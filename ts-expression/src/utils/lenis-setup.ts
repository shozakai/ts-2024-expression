import Lenis from 'lenis'

export class LenisSetup {
    private static instance: Lenis | null = null

    static init(options?: Partial<{
        duration: number
        easing: (t: number) => number
        direction: 'vertical' | 'horizontal'
        gestureDirection: 'vertical' | 'horizontal' | 'both'
        smooth: boolean
        mouseMultiplier: number
        smoothTouch: boolean
        touchMultiplier: number
        infinite: boolean
        autoResize: boolean
        wrapper: HTMLElement | Window
        content: HTMLElement
    }>) {
        if (typeof window === 'undefined') return

        // デフォルト設定
        const defaultOptions = {
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical' as const,
            gestureDirection: 'vertical' as const,
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
            autoResize: true,
        }

        this.instance = new Lenis({
            ...defaultOptions,
            ...options,
        })

        // アニメーションループを開始
        this.startAnimationLoop()

        return this.instance
    }

    static getInstance() {
        return this.instance
    }

    private static startAnimationLoop() {
        if (!this.instance) return

        const raf = (time: number) => {
            this.instance?.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    }

    static scrollTo(target: number | string | HTMLElement, options?: {
        offset?: number
        duration?: number
        easing?: (t: number) => number
        immediate?: boolean
        lock?: boolean
        force?: boolean
        onComplete?: () => void
    }) {
        if (!this.instance) return

        this.instance.scrollTo(target, options)
    }

    static stop() {
        if (!this.instance) return
        this.instance.stop()
    }

    static start() {
        if (!this.instance) return
        this.instance.start()
    }

    static destroy() {
        if (!this.instance) return
        this.instance.destroy()
        this.instance = null
    }

    // GSAPとの統合用
    static setupWithGSAP() {
        if (!this.instance) return

        // GSAPのScrollTriggerと統合する場合
        this.instance.on('scroll', () => {
            if (typeof window !== 'undefined' && (window as any).ScrollTrigger) {
                (window as any).ScrollTrigger.update()
            }
        })
    }
} 