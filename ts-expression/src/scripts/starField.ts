import * as THREE from 'three'

export interface StarFieldOptions {
    particleCount?: number
    particleSize?: number
    density?: number
    motionStrength?: number
    vortexStrength?: number
    enableAnimation?: boolean
    enableMouseInteraction?: boolean
    mouseMovementIntensity?: number
    backgroundColor?: number
}

export class StarField {
    scene!: THREE.Scene
    camera!: THREE.PerspectiveCamera
    renderer!: THREE.WebGLRenderer
    particleSystem: THREE.Points | null = null
    
    private particleCount: number
    private particleSize: number
    private density: number
    private motionStrength: number
    private vortexStrength: number
    private enableAnimation: boolean
    private enableMouseInteraction: boolean
    private mouseMovementIntensity: number
    
    private mouseX: number = 0
    private mouseY: number = 0
    private animationId: number | null = null
    private container: HTMLElement
    private time: number = 0
    
    constructor(container: HTMLElement, options: StarFieldOptions = {}) {
        this.container = container
        this.particleCount = options.particleCount ?? 8000
        this.particleSize = options.particleSize ?? 1.2
        this.density = options.density ?? 100
        this.motionStrength = options.motionStrength ?? 1.0
        this.vortexStrength = options.vortexStrength ?? 1.0
        this.enableAnimation = options.enableAnimation ?? true
        this.enableMouseInteraction = options.enableMouseInteraction ?? true
        this.mouseMovementIntensity = options.mouseMovementIntensity ?? 3.0
        
        this.init()
        this.createParticleSystem()
        this.setupEventListeners()
        this.animate()
    }
    
    private init(): void {
        // シーンの初期化
        this.scene = new THREE.Scene()
        
        // カメラの初期化
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        )
        this.camera.position.z = 50
        
        // レンダラーの初期化
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.renderer.setClearColor(0x000000, 1)
        this.container.appendChild(this.renderer.domElement)
    }
    
    private createParticleSystem(): void {
        // 既存のパーティクルシステムを削除
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem)
        }

        // パーティクルの位置を格納する配列
        const positions = new Float32Array(this.particleCount * 3)
        const sizes = new Float32Array(this.particleCount)
        const opacities = new Float32Array(this.particleCount)

        // パーティクルの初期位置とサイズを設定
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3
            
            // より集中した分布のための調整
            const spread = this.density
            positions[i3] = (Math.random() - 0.5) * spread
            positions[i3 + 1] = (Math.random() - 0.5) * spread
            positions[i3 + 2] = (Math.random() - 0.5) * spread

            // サイズにランダムな変動を加える
            sizes[i] = Math.random() * this.particleSize * 0.8 + this.particleSize * 0.2
            
            // 透明度にもランダムな変動を加える
            opacities[i] = Math.random() * 0.8 + 0.2
        }

        // パーティクルのジオメトリを作成
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
        geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1))

        // パーティクル用のシェーダーマテリアルを作成
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                baseSize: { value: this.particleSize },
                motionStrength: { value: this.motionStrength },
                vortexStrength: { value: this.vortexStrength }
            },
            vertexShader: `
                attribute float size;
                attribute float opacity;
                varying float vOpacity;
                uniform float time;
                uniform float baseSize;
                uniform float motionStrength;
                uniform float vortexStrength;
                
                // 3D ノイズ関数
                vec3 mod289(vec3 x) {
                    return x - floor(x * (1.0 / 289.0)) * 289.0;
                }
                
                vec4 mod289(vec4 x) {
                    return x - floor(x * (1.0 / 289.0)) * 289.0;
                }
                
                vec4 permute(vec4 x) {
                    return mod289(((x*34.0)+1.0)*x);
                }
                
                vec4 taylorInvSqrt(vec4 r) {
                    return 1.79284291400159 - 0.85373472095314 * r;
                }
                
                float snoise(vec3 v) {
                    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                    
                    vec3 i = floor(v + dot(v, C.yyy));
                    vec3 x0 = v - i + dot(i, C.xxx);
                    
                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 i1 = min(g.xyz, l.zxy);
                    vec3 i2 = max(g.xyz, l.zxy);
                    
                    vec3 x1 = x0 - i1 + C.xxx;
                    vec3 x2 = x0 - i2 + C.yyy;
                    vec3 x3 = x0 - D.yyy;
                    
                    i = mod289(i);
                    vec4 p = permute(permute(permute(
                                i.z + vec4(0.0, i1.z, i2.z, 1.0))
                              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                    
                    float n_ = 0.142857142857;
                    vec3 ns = n_ * D.wyz - D.xzx;
                    
                    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                    
                    vec4 x_ = floor(j * ns.z);
                    vec4 y_ = floor(j - 7.0 * x_);
                    
                    vec4 x = x_ *ns.x + ns.yyyy;
                    vec4 y = y_ *ns.x + ns.yyyy;
                    vec4 h = 1.0 - abs(x) - abs(y);
                    
                    vec4 b0 = vec4(x.xy, y.xy);
                    vec4 b1 = vec4(x.zw, y.zw);
                    
                    vec4 s0 = floor(b0) * 2.0 + 1.0;
                    vec4 s1 = floor(b1) * 2.0 + 1.0;
                    vec4 sh = -step(h, vec4(0.0));
                    
                    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
                    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
                    
                    vec3 p0 = vec3(a0.xy, h.x);
                    vec3 p1 = vec3(a0.zw, h.y);
                    vec3 p2 = vec3(a1.xy, h.z);
                    vec3 p3 = vec3(a1.zw, h.w);
                    
                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;
                    
                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
                }
                
                void main() {
                    vOpacity = opacity;
                    vec3 pos = position;
                    
                    // 複数の力場を組み合わせた不規則な動き
                    float timeScale = time * 0.3;
                    
                    // ノイズベースの揺らぎ
                    vec3 noisePos = pos * 0.02 + timeScale * 0.5;
                    float noiseX = snoise(noisePos);
                    float noiseY = snoise(noisePos + vec3(100.0, 0.0, 0.0));
                    float noiseZ = snoise(noisePos + vec3(0.0, 100.0, 0.0));
                    
                    // 渦巻き効果の追加
                    float dist = length(pos.xy);
                    float angle = atan(pos.y, pos.x);
                    float spiralStrength = 0.3 / (1.0 + dist * 0.1);
                    
                    // 複数の渦の中心を作成
                    vec2 vortex1 = vec2(20.0, 15.0);
                    vec2 vortex2 = vec2(-25.0, -10.0);
                    vec2 vortex3 = vec2(10.0, -20.0);
                    
                    // 各渦からの影響を計算
                    float vortexEffect = 0.0;
                    vec2 toVortex1 = pos.xy - vortex1;
                    vec2 toVortex2 = pos.xy - vortex2;
                    vec2 toVortex3 = pos.xy - vortex3;
                    
                    float dist1 = length(toVortex1);
                    float dist2 = length(toVortex2);
                    float dist3 = length(toVortex3);
                    
                    // 渦の回転効果
                    float rotation1 = atan(toVortex1.y, toVortex1.x) + timeScale * 0.8;
                    float rotation2 = atan(toVortex2.y, toVortex2.x) - timeScale * 0.6;
                    float rotation3 = atan(toVortex3.y, toVortex3.x) + timeScale * 1.2;
                    
                    vec2 spiral1 = vec2(cos(rotation1), sin(rotation1)) * 0.5 / (1.0 + dist1 * 0.05);
                    vec2 spiral2 = vec2(cos(rotation2), sin(rotation2)) * 0.4 / (1.0 + dist2 * 0.05);
                    vec2 spiral3 = vec2(cos(rotation3), sin(rotation3)) * 0.3 / (1.0 + dist3 * 0.05);
                    
                    // 波動効果
                    float wave1 = sin(dist * 0.1 + timeScale * 2.0) * 0.8;
                    float wave2 = cos(dist * 0.15 + timeScale * 1.5) * 0.6;
                    
                    // すべての効果を組み合わせ
                    pos.x += (noiseX * 2.0 + spiral1.x + spiral2.x + spiral3.x + wave1 * 0.5) * motionStrength;
                    pos.y += (noiseY * 2.0 + spiral1.y + spiral2.y + spiral3.y + wave2 * 0.5) * motionStrength;
                    pos.z += (noiseZ * 1.5 + sin(timeScale + dist * 0.1) * 0.3) * motionStrength;
                    
                    // 渦の強さを調整
                    pos.x += (spiral1.x + spiral2.x + spiral3.x) * (vortexStrength - 1.0);
                    pos.y += (spiral1.y + spiral2.y + spiral3.y) * (vortexStrength - 1.0);
                    
                    // 周期的な拡散と収束
                    float pulse = sin(timeScale * 0.5) * 0.1 + 1.0;
                    pos *= pulse;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    
                    gl_PointSize = size * baseSize * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying float vOpacity;
                
                void main() {
                    // 円形のパーティクルを作成
                    float distance = length(gl_PointCoord - vec2(0.5));
                    if (distance > 0.5) discard;
                    
                    // 中心から外側に向かって透明度を変化
                    float alpha = 1.0 - distance * 2.0;
                    alpha = smoothstep(0.0, 1.0, alpha);
                    
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * vOpacity);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        })

        // パーティクルシステムを作成
        this.particleSystem = new THREE.Points(geometry, material)
        this.scene.add(this.particleSystem)
    }
    
    private setupEventListeners(): void {
        // ウィンドウリサイズ対応
        window.addEventListener('resize', this.handleResize.bind(this))
        
        // マウスの動きでカメラを制御
        if (this.enableMouseInteraction) {
            document.addEventListener('mousemove', this.handleMouseMove.bind(this))
        }
    }
    
    private handleResize(): void {
        const width = this.container.clientWidth
        const height = this.container.clientHeight
        
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    }
    
    private handleMouseMove(event: MouseEvent): void {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1
        
        this.camera.position.x = this.mouseX * this.mouseMovementIntensity
        this.camera.position.y = this.mouseY * this.mouseMovementIntensity
        this.camera.lookAt(0, 0, 0)
    }
    
    private animate(): void {
        this.animationId = requestAnimationFrame(this.animate.bind(this))
        
        this.time += 0.01
        
        if (this.enableAnimation && this.particleSystem) {
            // パーティクルシステムをゆっくり回転
            this.particleSystem.rotation.y += 0.001
            this.particleSystem.rotation.x += 0.0005
            
            // シェーダーに時間を渡す
            if (this.particleSystem.material instanceof THREE.ShaderMaterial) {
                this.particleSystem.material.uniforms.time.value = this.time
                this.particleSystem.material.uniforms.motionStrength.value = this.motionStrength
                this.particleSystem.material.uniforms.vortexStrength.value = this.vortexStrength
            }
        }
        
        this.renderer.render(this.scene, this.camera)
    }
    
    public updateOptions(options: Partial<StarFieldOptions>): void {
        if (options.particleCount !== undefined) {
            this.particleCount = options.particleCount
            this.createParticleSystem()
        }
        
        if (options.particleSize !== undefined) {
            this.particleSize = options.particleSize
            if (this.particleSystem && this.particleSystem.material instanceof THREE.ShaderMaterial) {
                this.particleSystem.material.uniforms.baseSize.value = this.particleSize
            }
        }
        
        if (options.density !== undefined) {
            this.density = options.density
            this.createParticleSystem()
        }
        
        if (options.motionStrength !== undefined) {
            this.motionStrength = options.motionStrength
        }
        
        if (options.vortexStrength !== undefined) {
            this.vortexStrength = options.vortexStrength
        }
        
        if (options.enableAnimation !== undefined) {
            this.enableAnimation = options.enableAnimation
        }
        
        if (options.mouseMovementIntensity !== undefined) {
            this.mouseMovementIntensity = options.mouseMovementIntensity
        }
    }
    
    public dispose(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
        }
        
        if (this.particleSystem && this.scene) {
            this.scene.remove(this.particleSystem)
            if (this.particleSystem.geometry) {
                this.particleSystem.geometry.dispose()
            }
            if (this.particleSystem.material instanceof THREE.Material) {
                this.particleSystem.material.dispose()
            }
        }
        
        if (this.renderer) {
            this.renderer.dispose()
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement)
            }
        }
        
        window.removeEventListener('resize', this.handleResize.bind(this))
        document.removeEventListener('mousemove', this.handleMouseMove.bind(this))
    }
} 