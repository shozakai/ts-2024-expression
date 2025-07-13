import { gsap } from 'gsap'

export class GSAPSetup {
    static fadeIn(element: HTMLElement, duration: number = 1) {
        gsap.from(element, {
            opacity: 0,
            duration: duration,
            ease: 'power2.out',
        })
    }

    static slideUp(element: HTMLElement, duration: number = 1) {
        gsap.from(element, {
            y: 50,
            opacity: 0,
            duration: duration,
            ease: 'power2.out',
        })
    }

    static scaleIn(element: HTMLElement, duration: number = 1) {
        gsap.from(element, {
            scale: 0,
            opacity: 0,
            duration: duration,
            ease: 'back.out(1.7)',
        })
    }

    static rotateIn(element: HTMLElement, duration: number = 1) {
        gsap.from(element, {
            rotation: 360,
            opacity: 0,
            duration: duration,
            ease: 'power2.out',
        })
    }

    static timeline() {
        return gsap.timeline()
    }

    static batch(elements: HTMLElement[], animation: string = 'fadeIn') {
        const animations = {
            fadeIn: { opacity: 0, y: 50 },
            slideUp: { y: 100, opacity: 0 },
            scaleIn: { scale: 0, opacity: 0 },
        }

        const selectedAnimation = animations[animation as keyof typeof animations]

        gsap.from(elements, {
            ...selectedAnimation,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
        })
    }
} 