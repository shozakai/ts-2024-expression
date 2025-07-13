import { ParticleRing } from './particleRing'

export function initParticleRing() {
    document.addEventListener('DOMContentLoaded', () => {
        const containers = document.querySelectorAll('.particle-ring-container')
        
        containers.forEach(container => {
            const htmlContainer = container as HTMLElement
            const id = htmlContainer.id
            
            // Get options from data attributes or use defaults
            const options = {
                particleCount: parseInt(htmlContainer.dataset.particleCount || '8000'),
                innerRadius: parseInt(htmlContainer.dataset.innerRadius || '150'),
                scatterIntensity: parseInt(htmlContainer.dataset.scatterIntensity || '80'),
                ringSharpness: parseInt(htmlContainer.dataset.ringSharpness || '4'),
                backgroundColor: parseInt(htmlContainer.dataset.backgroundColor || '0x000000'),
                opacity: parseFloat(htmlContainer.dataset.opacity || '0.1'),
                rotationSpeed: parseFloat(htmlContainer.dataset.rotationSpeed || '0.001'),
                enableMouseInteraction: htmlContainer.dataset.enableMouseInteraction !== 'false',
                enableControls: htmlContainer.dataset.enableControls === 'true',
                enableBigBangAnimation: htmlContainer.dataset.enableBigBangAnimation === 'true',
                animationDuration: parseFloat(htmlContainer.dataset.animationDuration || '3.0'),
                animationDelay: parseFloat(htmlContainer.dataset.animationDelay || '0.5'),
            }
            
            const particleRing = new ParticleRing(htmlContainer, options)
            particleRing.animate()
            
            // Setup controls if enabled
            if (options.enableControls) {
                const particleSlider = document.getElementById('particle-slider') as HTMLInputElement
                const innerRadiusSlider = document.getElementById('inner-radius-slider') as HTMLInputElement
                const sharpnessSlider = document.getElementById('sharpness-slider') as HTMLInputElement
                const scatterSlider = document.getElementById('scatter-slider') as HTMLInputElement
                
                const particleCountLabel = document.getElementById('particle-count')
                const innerRadiusLabel = document.getElementById('inner-radius')
                const ringSharpnessLabel = document.getElementById('ring-sharpness')
                const scatterIntensityLabel = document.getElementById('scatter-intensity')

                particleSlider?.addEventListener('input', (e) => {
                    const value = parseInt((e.target as HTMLInputElement).value)
                    particleRing.updateParticleCount(value)
                    if (particleCountLabel) particleCountLabel.textContent = value.toString()
                })

                innerRadiusSlider?.addEventListener('input', (e) => {
                    const value = parseInt((e.target as HTMLInputElement).value)
                    particleRing.updateInnerRadius(value)
                    if (innerRadiusLabel) innerRadiusLabel.textContent = value.toString()
                })

                sharpnessSlider?.addEventListener('input', (e) => {
                    const value = parseInt((e.target as HTMLInputElement).value)
                    particleRing.updateRingSharpness(value)
                    if (ringSharpnessLabel) ringSharpnessLabel.textContent = value.toString()
                })

                scatterSlider?.addEventListener('input', (e) => {
                    const value = parseInt((e.target as HTMLInputElement).value)
                    particleRing.updateScatterIntensity(value)
                    if (scatterIntensityLabel) scatterIntensityLabel.textContent = value.toString()
                })
            }
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', () => {
                particleRing.dispose()
            })
        })
    })
} 