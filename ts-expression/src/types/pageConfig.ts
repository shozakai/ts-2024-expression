/**
 * ページ設定の型定義
 */
export interface PageConfig {
  /** パーティクルエフェクトを表示するか */
  showParticleRing: boolean
  /** フッターを表示するか */
  showFooter: boolean
  /** ヘッダーの表示設定 */
  showHeader: boolean
  /** ページ固有のbodyクラス */
  bodyClasses?: string[]
  /** ページ固有のメタ設定 */
  metaOverrides?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  /** パーティクルエフェクトの設定上書き */
  particleSettings?: {
    particleCount?: number
    innerRadius?: number
    scatterIntensity?: number
    ringSharpness?: number
    backgroundColor?: number
    opacity?: number
    rotationSpeed?: number
    enableMouseInteraction?: boolean
    enableBigBangAnimation?: boolean
    animationDuration?: number
    animationDelay?: number
  }
}

/**
 * 利用可能なページIDの型定義
 */
export type PageId = 
  | 'home' 
  | 'work' 
  | 'exploration' 
  | 'font-demo' 
  | 'animation-demo'
  | 'about'
  | 'contact'

/**
 * ページ設定のマップ
 */
export const PAGE_CONFIGS: Record<PageId, PageConfig> = {
  home: {
    showParticleRing: true,
    showFooter: false,
    showHeader: true,
    bodyClasses: ['page-home', 'has-particles'],
    particleSettings: {
      particleCount: 6000,
      innerRadius: 120,
      scatterIntensity: 100,
      ringSharpness: 3,
      backgroundColor: 0x000000,
      opacity: 0.95,
      rotationSpeed: 0.0008,
      enableMouseInteraction: true,
      enableBigBangAnimation: true,
      animationDuration: 3.0,
      animationDelay: 0.5,
    }
  },
  
  work: {
    showParticleRing: true,
    showFooter: true,
    showHeader: true,
    bodyClasses: ['page-work', 'has-particles'],
    particleSettings: {
      particleCount: 4000,
      innerRadius: 100,
      scatterIntensity: 80,
      ringSharpness: 2,
      backgroundColor: 0x000000,
      opacity: 0.7,
      rotationSpeed: 0.0005,
      enableMouseInteraction: true,
      enableBigBangAnimation: false,
    }
  },
  
  exploration: {
    showParticleRing: false, // 実験ページではパーティクル無効
    showFooter: true,
    showHeader: true,
    bodyClasses: ['page-exploration', 'experimental'],
  },
  
  'font-demo': {
    showParticleRing: true,
    showFooter: true,
    showHeader: true,
    bodyClasses: ['page-font-demo', 'typography-focus'],
    particleSettings: {
      particleCount: 3000,
      innerRadius: 80,
      scatterIntensity: 60,
      ringSharpness: 1,
      backgroundColor: 0x000000,
      opacity: 0.3,
      rotationSpeed: 0.0003,
      enableMouseInteraction: false,
      enableBigBangAnimation: false,
    }
  },
  
  'animation-demo': {
    showParticleRing: true,
    showFooter: true,
    showHeader: true,
    bodyClasses: ['page-animation-demo', 'animation-focus'],
    particleSettings: {
      particleCount: 8000,
      innerRadius: 150,
      scatterIntensity: 120,
      ringSharpness: 5,
      backgroundColor: 0x000000,
      opacity: 0.8,
      rotationSpeed: 0.001,
      enableMouseInteraction: true,
      enableBigBangAnimation: true,
      animationDuration: 2.0,
      animationDelay: 0.3,
    }
  },
  
  about: {
    showParticleRing: true,
    showFooter: true,
    showHeader: true,
    bodyClasses: ['page-about'],
    particleSettings: {
      particleCount: 5000,
      innerRadius: 110,
      scatterIntensity: 90,
      ringSharpness: 3,
      backgroundColor: 0x000000,
      opacity: 0.6,
      rotationSpeed: 0.0006,
      enableMouseInteraction: true,
      enableBigBangAnimation: false,
    }
  },
  
  contact: {
    showParticleRing: true,
    showFooter: true,
    showHeader: true,
    bodyClasses: ['page-contact'],
    particleSettings: {
      particleCount: 4000,
      innerRadius: 90,
      scatterIntensity: 70,
      ringSharpness: 2,
      backgroundColor: 0x000000,
      opacity: 0.5,
      rotationSpeed: 0.0004,
      enableMouseInteraction: true,
      enableBigBangAnimation: false,
    }
  }
}

/**
 * デフォルトページ設定
 */
export const DEFAULT_PAGE_CONFIG: PageConfig = {
  showParticleRing: true,
  showFooter: true,
  showHeader: true,
  bodyClasses: ['page-default'],
  particleSettings: {
    particleCount: 6000,
    innerRadius: 120,
    scatterIntensity: 100,
    ringSharpness: 3,
    backgroundColor: 0x000000,
    opacity: 0.95,
    rotationSpeed: 0.0008,
    enableMouseInteraction: true,
    enableBigBangAnimation: true,
    animationDuration: 3.0,
    animationDelay: 0.5,
  }
}

/**
 * ページ設定を取得するヘルパー関数
 */
export function getPageConfig(pageId: string | undefined): PageConfig {
  if (!pageId) {
    return DEFAULT_PAGE_CONFIG
  }
  
  return PAGE_CONFIGS[pageId as PageId] || DEFAULT_PAGE_CONFIG
}

/**
 * ページ設定をマージするヘルパー関数
 */
export function mergePageConfig(
  baseConfig: PageConfig, 
  overrides: Partial<PageConfig>
): PageConfig {
  return {
    ...baseConfig,
    ...overrides,
    bodyClasses: [
      ...(baseConfig.bodyClasses || []),
      ...(overrides.bodyClasses || [])
    ],
    particleSettings: {
      ...baseConfig.particleSettings,
      ...overrides.particleSettings
    },
    metaOverrides: {
      ...baseConfig.metaOverrides,
      ...overrides.metaOverrides
    }
  }
} 