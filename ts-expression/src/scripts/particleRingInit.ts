import { ParticleRing } from './particleRing'

// グローバルインスタンス管理
let globalParticleRingInstance: ParticleRing | null = null

/**
 * ParticleRingを初期化する
 */
export function initParticleRing() {
    const containers = document.querySelectorAll('.particle-ring-container')
    
    containers.forEach(container => {
        const element = container as HTMLElement
        
        // 既に初期化されている場合はスキップ
        if (element.dataset.initialized === 'true') {
            return
        }
        
        // 既存のグローバルインスタンスがある場合は破棄
        if (globalParticleRingInstance) {
            globalParticleRingInstance.dispose()
            globalParticleRingInstance = null
        }
        
        // データ属性から設定を読み取り
        const options = {
            particleCount: parseInt(element.dataset.particleCount || '8000'),
            innerRadius: parseInt(element.dataset.innerRadius || '150'),
            scatterIntensity: parseInt(element.dataset.scatterIntensity || '80'),
            ringSharpness: parseInt(element.dataset.ringSharpness || '4'),
            backgroundColor: parseInt(element.dataset.backgroundColor || '0'),
            opacity: parseFloat(element.dataset.opacity || '0.1'),
            rotationSpeed: parseFloat(element.dataset.rotationSpeed || '0.001'),
            enableMouseInteraction: element.dataset.enableMouseInteraction === 'true',
            enableControls: element.dataset.enableControls === 'true',
            enableBigBangAnimation: element.dataset.enableBigBangAnimation === 'true',
            animationDuration: parseFloat(element.dataset.animationDuration || '3.0'),
            animationDelay: parseFloat(element.dataset.animationDelay || '0.5'),
        }
        
        try {
            // ParticleRingインスタンスを作成
            const particleRing = new ParticleRing(element, options)
            globalParticleRingInstance = particleRing
            
            // アニメーションを開始
            particleRing.animate()
            
            // 初期化完了フラグを設定
            element.dataset.initialized = 'true'
            
            // コントロールの設定（有効な場合）
            if (options.enableControls) {
                setupControls(particleRing)
            }
            
            console.log('ParticleRing initialized successfully')
        } catch (error) {
            console.error('Failed to initialize ParticleRing:', error)
        }
    })
}

/**
 * ParticleRingを破棄する
 */
export function disposeParticleRing() {
    if (globalParticleRingInstance) {
        globalParticleRingInstance.dispose()
        globalParticleRingInstance = null
        console.log('ParticleRing disposed')
    }
    
    // 初期化フラグをリセット
    const containers = document.querySelectorAll('.particle-ring-container')
    containers.forEach(container => {
        const element = container as HTMLElement
        element.dataset.initialized = 'false'
    })
}

/**
 * パーティクルコントロールを設定する
 */
function setupControls(particleRing: ParticleRing) {
    const particleSlider = document.getElementById('particle-slider') as HTMLInputElement
    const innerRadiusSlider = document.getElementById('inner-radius-slider') as HTMLInputElement
    const sharpnessSlider = document.getElementById('sharpness-slider') as HTMLInputElement
    const scatterSlider = document.getElementById('scatter-slider') as HTMLInputElement
    
    const particleCountDisplay = document.getElementById('particle-count')
    const innerRadiusDisplay = document.getElementById('inner-radius')
    const ringSharpnessDisplay = document.getElementById('ring-sharpness')
    const scatterIntensityDisplay = document.getElementById('scatter-intensity')
    
    if (particleSlider && particleCountDisplay) {
        particleSlider.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value)
            particleRing.updateParticleCount(value)
            particleCountDisplay.textContent = value.toString()
        })
    }
    
    if (innerRadiusSlider && innerRadiusDisplay) {
        innerRadiusSlider.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value)
            particleRing.updateInnerRadius(value)
            innerRadiusDisplay.textContent = value.toString()
        })
    }
    
    if (sharpnessSlider && ringSharpnessDisplay) {
        sharpnessSlider.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value)
            particleRing.updateRingSharpness(value)
            ringSharpnessDisplay.textContent = value.toString()
        })
    }
    
    if (scatterSlider && scatterIntensityDisplay) {
        scatterSlider.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value)
            particleRing.updateScatterIntensity(value)
            scatterIntensityDisplay.textContent = value.toString()
        })
    }
}

// swupとの統合
if (typeof window !== 'undefined') {
    // ページ準備完了時に初期化
    document.addEventListener('swup:pageReady', () => {
        console.log('Swup page ready - initializing ParticleRing')
        initParticleRing()
    })
    
    // ページ遷移開始時にクリーンアップ
    document.addEventListener('swup:willReplaceContent', () => {
        console.log('Swup will replace content - disposing ParticleRing')
        disposeParticleRing()
    })
    
    // 通常のページロード時の初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticleRing)
    } else {
        initParticleRing()
    }
}

// グローバルアクセス用のエクスポート
export { globalParticleRingInstance } 