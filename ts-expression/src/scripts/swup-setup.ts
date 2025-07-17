import Swup from 'swup'
import SwupBodyClassPlugin from '@swup/body-class-plugin'
import SwupA11yPlugin from '@swup/a11y-plugin'
import SwupHeadPlugin from '@swup/head-plugin'
import SwupMorphPlugin from 'swup-morph-plugin'

/**
 * swup設定クラス
 * ページトランジションの初期化と管理を行う
 */
export class SwupSetup {
  private static instance: Swup | null = null

  /**
   * swupの初期化
   * @param options swupのオプション
   */
  static init(options?: Partial<ConstructorParameters<typeof Swup>[0]>) {
    // 既に初期化されている場合は何もしない
    if (this.instance) {
      console.warn('Swup is already initialized')
      return this.instance
    }

    // デフォルト設定
    const defaultOptions = {
      containers: ['#swup'], // メインコンテナ
      animateHistoryBrowsing: true, // ブラウザの戻る/進むボタンでもアニメーション
      animationSelector: '[class*="transition-"]', // アニメーション対象の要素
      cache: false,
      preload: true,
      linkToSelf: 'navigate',
    }

    // プラグインを配列に設定
    const plugins = [
      // Body Class Plugin - ページごとのbodyクラス管理
      new SwupBodyClassPlugin({
        prefix: 'page-' // ページクラスのプレフィックス（例: page-index, page-work）
      }),
      
      // A11y Plugin - アクセシビリティ向上
      new SwupA11yPlugin(),
      
      // Head Plugin - ヘッドタグの管理
      new SwupHeadPlugin(),
      
      // Morph Plugin - より滑らかなページトランジション
      new SwupMorphPlugin({
        containers: ['#header']
      })
    ]

    // オプションをマージ（プラグインを含む）
    const mergedOptions = { 
      ...defaultOptions, 
      ...options,
      plugins: [...plugins, ...(options?.plugins || [])] // 既存のプラグインと新しいプラグインをマージ
    }

    try {
      // swupインスタンスを作成
      this.instance = new Swup({
        ...mergedOptions,
        linkToSelf: 'navigate' as const
      })

      // フックを設定
      this.setupHooks()

      // swup初期化フラグを設定
      document.body.setAttribute('data-swup-initialized', 'true')

      console.log('Swup initialized successfully')
      return this.instance
    } catch (error) {
      console.error('Failed to initialize Swup:', error)
      return null
    }
  }

  /**
   * swupのフック（イベントハンドラ）を設定
   */
  private static setupHooks() {
    if (!this.instance) return

    // ページ遷移開始時
    this.instance.hooks.on('visit:start', (visit) => {
      console.log(`Starting transition from ${visit.from.url} to ${visit.to.url}`)
      
      // Lenisスクロールを一時停止（存在する場合）
      if (window.lenis) {
        window.lenis.stop()
      }
    })

    // コンテンツ置換時
    this.instance.hooks.on('content:replace', () => {
      // Three.jsやGSAPアニメーションのクリーンアップ
      this.cleanupAnimations()
    })

    // ページ表示後
    this.instance.hooks.on('page:view', () => {
      // 新しいページでアニメーションを再初期化
      this.reinitializeAnimations()
    })

    // ページ遷移完了時
    this.instance.hooks.on('visit:end', (visit) => {
      console.log(`Transition to ${visit.to.url} completed`)
      
      // Lenisスクロールを再開（存在する場合）
      if (window.lenis) {
        window.lenis.start()
      }
    })

    // エラーハンドリング
    this.instance.hooks.on('fetch:error', (visit, response) => {
      console.error('Swup fetch error:', response)
    })
  }

  /**
   * アニメーションのクリーンアップ
   */
  private static cleanupAnimations() {
    // ParticleRingのクリーンアップを通知
    const event = new CustomEvent('swup:willReplaceContent')
    document.dispatchEvent(event)

    // GSAPアニメーションのキル
    if (window.gsap) {
      window.gsap.killTweensOf('*')
    }

    // Three.jsキャンバス要素の強制クリーンアップ（最後の手段）
    const canvases = document.querySelectorAll('canvas')
    canvases.forEach(canvas => {
      try {
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2')
        if (gl) {
          const loseContext = gl.getExtension('WEBGL_lose_context')
          if (loseContext) {
            loseContext.loseContext()
          }
        }
        
        // キャンバスのサイズを0にリセット
        canvas.width = 0
        canvas.height = 0
      } catch (error) {
        console.warn('Error cleaning up canvas:', error)
      }
    })
  }

  /**
   * 新しいページでアニメーションを再初期化
   */
  private static reinitializeAnimations() {
    // カスタムイベントを発火して、アニメーションの再初期化を他のスクリプトに通知
    const event = new CustomEvent('swup:pageReady', {
      detail: { timestamp: Date.now() }
    })
    document.dispatchEvent(event)

    // ページ固有のスクリプトを再実行
    this.reinitializePageScripts()
  }

  /**
   * ページ固有のスクリプトを再実行
   */
  private static reinitializePageScripts() {
    // Three.jsやGSAPなどのページ固有のアニメーションを再初期化
    // この部分は各ページのニーズに応じてカスタマイズ
    
    // ParticleRingコンポーネントの再初期化（存在する場合）
    const particleElements = document.querySelectorAll('[data-particle-ring]')
    particleElements.forEach(element => {
      // パーティクルエフェクトの再初期化ロジック
      // （実際の実装は ParticleRing コンポーネントに依存）
    })
  }

  /**
   * swupインスタンスを取得
   */
  static getInstance(): Swup | null {
    return this.instance
  }

  /**
   * swupを破棄
   */
  static destroy() {
    if (this.instance) {
      this.instance.destroy()
      this.instance = null
      
      // swup初期化フラグをリセット
      document.body.removeAttribute('data-swup-initialized')
      
      console.log('Swup destroyed')
    }
  }

  /**
   * プログラムによるページ遷移
   * @param url 遷移先のURL
   * @param options 遷移オプション
   */
  static navigateTo(url: string, options?: any) {
    if (this.instance) {
      this.instance.navigate(url, options)
    } else {
      // swupが初期化されていない場合は通常のページ遷移
      window.location.href = url
    }
  }
}

// グローバル型定義の拡張
declare global {
  interface Window {
    lenis?: any
    gsap?: any
  }
} 