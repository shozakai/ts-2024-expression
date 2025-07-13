import * as THREE from 'three'
import { gsap } from 'gsap'

export interface ParticleRingOptions {
    particleCount?: number
    innerRadius?: number
    scatterIntensity?: number
    ringSharpness?: number
    backgroundColor?: number
    opacity?: number
    rotationSpeed?: number
    enableMouseInteraction?: boolean
    enableControls?: boolean
    enableBigBangAnimation?: boolean
    animationDuration?: number
    animationDelay?: number
}

export class ParticleRing {
    scene!: THREE.Scene
    camera!: THREE.PerspectiveCamera
    renderer!: THREE.WebGLRenderer
    particleSystem: THREE.Points | null = null
    
    private particleCount: number
    private innerRadius: number
    private scatterIntensity: number
    private ringSharpness: number
    private rotationSpeed: number
    private enableMouseInteraction: boolean
    
    private mouseX: number = 0
    private mouseY: number = 0
    private animationId: number | null = null
    private container: HTMLElement
    
    // スケール調整用の基準値
    private baseWidth: number = 1366
    private baseHeight: number = 768
    private currentScale: number = 1
    
    // ビックバンアニメーション関連
    private enableBigBangAnimation: boolean
    private animationDuration: number
    private animationDelay: number
    private animationProgress: number = 0
    private initialPositions: Float32Array | null = null
    private finalPositions: Float32Array | null = null
    private animationTween: gsap.core.Tween | null = null
    
    // イベントリスナーの参照を保持
    private resizeHandler: () => void
    private mouseMoveHandler: (event: MouseEvent) => void
    
    constructor(container: HTMLElement, options: ParticleRingOptions = {}) {
        this.container = container
        this.particleCount = options.particleCount || 8000
        this.innerRadius = options.innerRadius || 150
        this.scatterIntensity = options.scatterIntensity || 80
        this.ringSharpness = options.ringSharpness || 4
        this.rotationSpeed = options.rotationSpeed || 0.001
        this.enableMouseInteraction = options.enableMouseInteraction !== false
        
        // ビックバンアニメーション設定
        this.enableBigBangAnimation = options.enableBigBangAnimation !== false
        this.animationDuration = options.animationDuration || 3.0
        this.animationDelay = options.animationDelay || 0.5
        
        // イベントリスナーの参照を初期化
        this.resizeHandler = () => this.onWindowResize()
        this.mouseMoveHandler = (event: MouseEvent) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1
        }
        
        this.init(options)
        this.calculateScale()
        this.createParticleSystem()
        this.setupMouseInteraction()
        
        // ビックバンアニメーションを開始
        if (this.enableBigBangAnimation) {
            this.startBigBangAnimation()
        }
    }

    private init(options: ParticleRingOptions) {
        // Scene
        this.scene = new THREE.Scene()

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        this.camera.position.z = 500

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setClearColor(options.backgroundColor || 0x000000, options.opacity || 0.1)
        this.container.appendChild(this.renderer.domElement)

        // Handle window resize
        window.addEventListener('resize', this.resizeHandler)
    }

    private createParticleSystem() {
        // Remove existing particle system
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem)
        }

        // Create particle geometry
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(this.particleCount * 3)
        const colors = new Float32Array(this.particleCount * 3)
        const sizes = new Float32Array(this.particleCount)

        // 最終位置を計算（現在のリング状態）
        this.finalPositions = new Float32Array(this.particleCount * 3)
        
        // 初期位置を計算（中央に密集）
        this.initialPositions = new Float32Array(this.particleCount * 3)

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3
            
            // Generate angle
            const angle = Math.random() * Math.PI * 2
            
            let distance: number, intensity: number
            
            // スケール調整されたパラメータを使用
            const scaledInnerRadius = this.innerRadius * this.currentScale
            const scaledScatterIntensity = this.scatterIntensity * this.currentScale
            const scaledRingSharpness = this.ringSharpness * this.currentScale
            
            if (Math.random() < 0.15) {
                // 15%: Center of the light ring (brightest and most dense)
                distance = scaledInnerRadius + (Math.random() - 0.5) * scaledRingSharpness
                intensity = 1.0
            } else {
                // 85%: Exponential distribution decreasing from ring to outside
                const randomValue = Math.random()
                
                if (randomValue < 0.7) {
                    // 70% near to medium distance
                    const lambda = 2.0
                    const exponentialDistance = -Math.log(1 - Math.random()) / lambda
                    const normalizedDistance = Math.min(exponentialDistance, 4.0) / 4.0
                    const scatterDistance = normalizedDistance * scaledScatterIntensity * 0.8
                    distance = scaledInnerRadius + scaledRingSharpness * 0.5 + scatterDistance
                } else {
                    // 30% medium to far distance
                    const baseDistance = scaledInnerRadius + scaledRingSharpness * 0.5
                    const extendedDistance = Math.random() * scaledScatterIntensity * 1.5
                    distance = baseDistance + extendedDistance
                }
                
                // Intensity calculation based on distance
                const fadeDistance = distance - scaledInnerRadius
                
                if (fadeDistance <= scaledRingSharpness) {
                    intensity = 0.9
                } else {
                    const relativeDistance = (fadeDistance - scaledRingSharpness) / scaledScatterIntensity
                    intensity = Math.exp(-relativeDistance * 2.5) * 0.7
                    intensity = Math.max(intensity, 0.03)
                }
            }
            
            // Position scatter
            const scatterX = (Math.random() - 0.5) * 1.0 * this.currentScale
            const scatterY = (Math.random() - 0.5) * 1.0 * this.currentScale
            
            // 最終位置を計算（リング状態）
            this.finalPositions[i3] = Math.cos(angle) * distance + scatterX
            this.finalPositions[i3 + 1] = Math.sin(angle) * distance + scatterY
            this.finalPositions[i3 + 2] = (Math.random() - 0.5) * 2 * this.currentScale

            // 初期位置を計算（小さな円形に配置）
            const initialRadius = 25 * this.currentScale // 初期の小さな円の半径
            const initialAngle = Math.random() * Math.PI * 2
            
            // 中心からの距離を0から初期半径まで自然に分布
            const initialDistance = Math.sqrt(Math.random()) * initialRadius
            
            this.initialPositions[i3] = Math.cos(initialAngle) * initialDistance
            this.initialPositions[i3 + 1] = Math.sin(initialAngle) * initialDistance
            this.initialPositions[i3 + 2] = (Math.random() - 0.5) * 2 * this.currentScale

            // 現在の位置を設定（アニメーション進行度によって決まる）
            const currentX = this.interpolatePosition(this.initialPositions[i3]!, this.finalPositions[i3]!, this.animationProgress)
            const currentY = this.interpolatePosition(this.initialPositions[i3 + 1]!, this.finalPositions[i3 + 1]!, this.animationProgress)
            const currentZ = this.interpolatePosition(this.initialPositions[i3 + 2]!, this.finalPositions[i3 + 2]!, this.animationProgress)

            positions[i3] = currentX
            positions[i3 + 1] = currentY
            positions[i3 + 2] = currentZ

            // Set color (アニメーション進行度に応じて調整)
            const baseColorIntensity = intensity * (0.95 + Math.random() * 0.05)
            const colorIntensityWithAnimation = baseColorIntensity * (0.3 + 0.7 * this.animationProgress)
            colors[i3] = colorIntensityWithAnimation
            colors[i3 + 1] = colorIntensityWithAnimation
            colors[i3 + 2] = colorIntensityWithAnimation

            // Set size (アニメーション進行度に応じて調整)
            const distanceFromRing = Math.abs(distance - scaledInnerRadius)
            
            let baseSize: number
            if (distanceFromRing <= scaledRingSharpness) {
                baseSize = (1.0 + Math.random() * 0.3) * intensity + 0.7
            } else {
                const relativeDistance = (distanceFromRing - scaledRingSharpness) / scaledScatterIntensity
                const sizeFactor = Math.exp(-relativeDistance * 1.8)
                baseSize = (0.3 + Math.random() * 0.5) * intensity * sizeFactor + 0.1
            }
            
            // 初期状態では小さく、アニメーション進行と共に大きくなる
            sizes[i] = baseSize * (0.2 + 0.8 * this.animationProgress)
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

        // Create particle material
        const material = new THREE.PointsMaterial({
            size: 1.0 * this.currentScale,
            sizeAttenuation: false,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending
        })

        // Create particle system
        this.particleSystem = new THREE.Points(geometry, material)
        this.scene.add(this.particleSystem)
    }

    private interpolatePosition(start: number, end: number, progress: number): number {
        // イージング関数を適用（ease-out効果）
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        return start + (end - start) * easedProgress
    }

    private startBigBangAnimation() {
        // アニメーション進行度を0に設定
        this.animationProgress = 0
        
        // 既存のアニメーションを停止
        if (this.animationTween) {
            this.animationTween.kill()
        }
        
        // GSAPアニメーションを開始
        this.animationTween = gsap.to(this, {
            animationProgress: 1,
            duration: this.animationDuration,
            delay: this.animationDelay,
            ease: "power2.out",
            onUpdate: () => {
                this.updateParticlePositions()
            },
            onComplete: () => {
                this.animationTween = null
            }
        })
    }

    private updateParticlePositions() {
        if (!this.particleSystem || !this.initialPositions || !this.finalPositions) return

        const positionAttribute = this.particleSystem.geometry.attributes.position
        const colorAttribute = this.particleSystem.geometry.attributes.color
        const sizeAttribute = this.particleSystem.geometry.attributes.size
        
        if (!positionAttribute || !colorAttribute || !sizeAttribute) return
        
        const positions = positionAttribute.array as Float32Array
        const colors = colorAttribute.array as Float32Array
        const sizes = sizeAttribute.array as Float32Array

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3
            
            // Position update
            positions[i3] = this.interpolatePosition(this.initialPositions[i3]!, this.finalPositions[i3]!, this.animationProgress)
            positions[i3 + 1] = this.interpolatePosition(this.initialPositions[i3 + 1]!, this.finalPositions[i3 + 1]!, this.animationProgress)
            positions[i3 + 2] = this.interpolatePosition(this.initialPositions[i3 + 2]!, this.finalPositions[i3 + 2]!, this.animationProgress)
            
            // Color and size update based on current animation progress
            const currentX = positions[i3]!
            const currentY = positions[i3 + 1]!
            const currentDistance = Math.sqrt(currentX * currentX + currentY * currentY)
            
            // Calculate intensity based on current position
            const scaledInnerRadius = this.innerRadius * this.currentScale
            let intensity = 0
            if (currentDistance <= scaledInnerRadius + 20 * this.currentScale) {
                const ringDistance = Math.abs(currentDistance - scaledInnerRadius)
                intensity = Math.exp(-ringDistance * 0.1) * 0.9
            } else {
                const fadeDistance = currentDistance - scaledInnerRadius
                intensity = Math.exp(-fadeDistance * 0.008) * 0.7
            }
            intensity = Math.max(intensity, 0.03)
            
            // Update color with animation progress
            const baseColorIntensity = intensity * (0.95 + Math.random() * 0.02)
            const colorIntensityWithAnimation = baseColorIntensity * (0.3 + 0.7 * this.animationProgress)
            colors[i3] = colorIntensityWithAnimation
            colors[i3 + 1] = colorIntensityWithAnimation
            colors[i3 + 2] = colorIntensityWithAnimation
            
            // Update size with animation progress
            const baseSize = 0.5 + intensity * 0.8
            sizes[i] = baseSize * (0.2 + 0.8 * this.animationProgress)
        }

        positionAttribute.needsUpdate = true
        colorAttribute.needsUpdate = true
        sizeAttribute.needsUpdate = true
    }

    private setupMouseInteraction() {
        if (!this.enableMouseInteraction) return

        document.addEventListener('mousemove', this.mouseMoveHandler)
    }

    private calculateScale() {
        // ウィンドウサイズに基づいてスケール因子を計算
        const scaleX = window.innerWidth / this.baseWidth
        const scaleY = window.innerHeight / this.baseHeight
        
        // 適切なスケール因子を選択（アスペクト比を維持）
        let calculatedScale = Math.min(scaleX, scaleY)
        
        // 最小スケールを1.0に設定（1366px以下では縮小しない）
        this.currentScale = Math.max(calculatedScale, 1.0)
        
        // カメラの位置も調整（スケールに応じて距離を調整）
        this.camera.position.z = 500 / this.currentScale
    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        
        // スケール因子を再計算
        this.calculateScale()
        
        // パーティクルシステムを再作成（新しいスケールで）
        this.createParticleSystem()
    }

    public animate() {
        this.animationId = requestAnimationFrame(() => this.animate())

        if (this.particleSystem) {
            // Rotation animation
            this.particleSystem.rotation.z += this.rotationSpeed
            
            // Mouse interaction
            if (this.enableMouseInteraction) {
                this.particleSystem.rotation.x = this.mouseY * 0.1
                this.particleSystem.rotation.y = this.mouseX * 0.1
            }
            
            // Dynamic particle effect
            const time = Date.now() * 0.001
            const positions = this.particleSystem.geometry.attributes.position?.array as Float32Array
            const colors = this.particleSystem.geometry.attributes.color?.array as Float32Array
            
            if (positions && colors) {
                for (let i = 0; i < this.particleCount; i++) {
                    const i3 = i * 3
                    
                    const x = positions[i3]
                    const y = positions[i3 + 1]
                    
                    if (x !== undefined && y !== undefined) {
                        const distance = Math.sqrt(x * x + y * y)
                        
                        // Wave effect
                        const wave = Math.sin(time * 1.5 + distance * 0.008) * 0.08
                        
                        // Light ring scatter effect
                        let baseIntensity = 0
                        const scaledInnerRadius = this.innerRadius * this.currentScale
                        if (distance <= scaledInnerRadius + 20 * this.currentScale) {
                            const ringDistance = Math.abs(distance - scaledInnerRadius)
                            baseIntensity = Math.exp(-ringDistance * 0.1) * 0.9
                        } else {
                            const fadeDistance = distance - scaledInnerRadius
                            baseIntensity = Math.exp(-fadeDistance * 0.008) * 0.7
                        }
                        
                        const finalIntensity = Math.min(1, Math.max(0.02, baseIntensity + wave))
                        
                        colors[i3] = finalIntensity * 0.9
                        colors[i3 + 1] = finalIntensity * 0.9
                        colors[i3 + 2] = finalIntensity * 0.9
                    }
                }
                
                if (this.particleSystem.geometry.attributes.color) {
                    this.particleSystem.geometry.attributes.color.needsUpdate = true
                }
            }
        }

        this.renderer.render(this.scene, this.camera)
    }

    public updateParticleCount(count: number) {
        this.particleCount = count
        this.createParticleSystem()
    }

    public updateInnerRadius(radius: number) {
        this.innerRadius = radius
        this.createParticleSystem()
    }

    public updateRingSharpness(sharpness: number) {
        this.ringSharpness = sharpness
        this.createParticleSystem()
    }

    public updateScatterIntensity(intensity: number) {
        this.scatterIntensity = intensity
        this.createParticleSystem()
    }

    public dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
        }
        
        // ビックバンアニメーションを停止
        if (this.animationTween) {
            this.animationTween.kill()
            this.animationTween = null
        }
        
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem)
        }
        
        this.renderer.dispose()
        
        if (this.container && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement)
        }
        
        // イベントリスナーを適切に削除
        window.removeEventListener('resize', this.resizeHandler)
        if (this.enableMouseInteraction) {
            document.removeEventListener('mousemove', this.mouseMoveHandler)
        }
    }
} 