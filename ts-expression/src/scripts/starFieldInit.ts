import { StarField, type StarFieldOptions } from './starField'

let starFieldInstances: Map<string, StarField> = new Map()

export function initStarField(): void {
    // DOMContentLoadedまたは既にロード済みの場合に実行
    const initialize = () => {
        const starFieldContainers = document.querySelectorAll('.star-field-container')
        
        starFieldContainers.forEach((container) => {
            const element = container as HTMLElement
            const id = element.id || `star-field-${Date.now()}`
            
            // 既に初期化済みの場合はスキップ
            if (starFieldInstances.has(id)) {
                return
            }
            
            // data属性からオプションを取得
            const options: StarFieldOptions = {
                particleCount: parseInt(element.dataset.particleCount || '8000'),
                particleSize: parseFloat(element.dataset.particleSize || '1.2'),
                density: parseInt(element.dataset.density || '100'),
                motionStrength: parseFloat(element.dataset.motionStrength || '1.0'),
                vortexStrength: parseFloat(element.dataset.vortexStrength || '1.0'),
                enableAnimation: element.dataset.enableAnimation !== 'false',
                enableMouseInteraction: element.dataset.enableMouseInteraction !== 'false',
                mouseMovementIntensity: parseFloat(element.dataset.mouseMovementIntensity || '3.0'),
                backgroundColor: parseInt(element.dataset.backgroundColor || '0x000000'),
                enableBigBangAnimation: element.dataset.enableBigBangAnimation !== 'false',
                animationDuration: parseFloat(element.dataset.animationDuration || '2.0'),
                animationDelay: parseFloat(element.dataset.animationDelay || '0.5'),
                explosionRange: parseFloat(element.dataset.explosionRange || '150')
            }
            
            // StarFieldインスタンスを作成
            const starField = new StarField(element, options)
            starFieldInstances.set(id, starField)
        })
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize)
    } else {
        initialize()
    }
}

// ページ離脱時のクリーンアップ
export function cleanupStarFields(): void {
    starFieldInstances.forEach((starField) => {
        starField.dispose()
    })
    starFieldInstances.clear()
}

// 特定のStarFieldインスタンスを取得
export function getStarFieldInstance(id: string): StarField | undefined {
    return starFieldInstances.get(id)
}

// ページ離脱時に自動クリーンアップ
window.addEventListener('beforeunload', cleanupStarFields) 