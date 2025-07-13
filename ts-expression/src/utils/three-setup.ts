import * as THREE from 'three'

export class ThreeSetup {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    cube: THREE.Mesh

    constructor(container: HTMLElement) {
        // Scene
        this.scene = new THREE.Scene()

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        container.appendChild(this.renderer.domElement)

        // Cube
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        this.cube = new THREE.Mesh(geometry, material)
        this.scene.add(this.cube)

        this.camera.position.z = 5

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        })
    }

    animate() {
        requestAnimationFrame(() => this.animate())

        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01

        this.renderer.render(this.scene, this.camera)
    }

    dispose() {
        this.renderer.dispose()
        window.removeEventListener('resize', () => {})
    }
} 