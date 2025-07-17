# ページ設定システム使用ガイド

Layout.astroの新しいページ設定システムにより、ページごとのDOM要素の表示・非表示やパーティクルエフェクトの設定を一元管理できるようになりました。

## 基本的な使用方法

### 1. 標準のページ設定

```astro
---
import Layout from '../layouts/Layout.astro'

const meta = {
    title: 'My Page',
    description: 'Page description'
}
---

<Layout {meta} pageId="work">
    <!-- ページコンテンツ -->
</Layout>
```

`pageId`に対応する設定が自動的に`src/types/pageConfig.ts`から読み込まれます。

### 2. 設定のカスタマイズ

```astro
---
import Layout from '../layouts/Layout.astro'

const meta = {
    title: 'Special Page',
    description: 'Custom page with special effects'
}

// ページ設定の上書き
const pageConfigOverride = {
    particleSettings: {
        particleCount: 10000,  // パーティクル数を増やす
        innerRadius: 200,      // リングサイズを大きく
        enableBigBangAnimation: false,  // ビッグバンアニメーション無効
        backgroundColor: 0x001122,      // 背景色を変更
        opacity: 0.3                    // 透明度を下げる
    },
    bodyClasses: ['special-page', 'dark-theme']  // 追加のCSSクラス
}
---

<Layout {meta} pageId="work" {pageConfigOverride}>
    <!-- ページコンテンツ -->
</Layout>
```

### 3. 完全カスタムページ

```astro
---
import Layout from '../layouts/Layout.astro'

const pageConfigOverride = {
    showParticleRing: false,  // パーティクルを完全に無効
    showFooter: false,        // フッターを非表示
    bodyClasses: ['fullscreen-page', 'no-particles']
}
---

<Layout pageId="custom" {pageConfigOverride}>
    <!-- フルスクリーンコンテンツ -->
</Layout>
```

## 利用可能な設定オプション

### 表示制御

- `showParticleRing: boolean` - パーティクルエフェクトの表示
- `showFooter: boolean` - フッターの表示
- `showHeader: boolean` - ヘッダーの表示

### スタイル制御

- `bodyClasses: string[]` - bodyタグに追加するCSSクラス

### パーティクル設定

```typescript
particleSettings: {
    particleCount?: number           // パーティクル数 (3000-15000)
    innerRadius?: number             // 光の輪の半径 (80-300)
    scatterIntensity?: number        // 散らばり強度 (40-150)
    ringSharpness?: number           // 輪の鋭さ (1-12)
    backgroundColor?: number         // 背景色 (0x000000など)
    opacity?: number                 // 透明度 (0.0-1.0)
    rotationSpeed?: number           // 回転速度 (0.0001-0.002)
    enableMouseInteraction?: boolean // マウス連動
    enableBigBangAnimation?: boolean // ビッグバンアニメーション
    animationDuration?: number       // アニメーション時間 (秒)
    animationDelay?: number         // アニメーション遅延 (秒)
}
```

### メタ情報上書き

```typescript
metaOverrides: {
    title?: string
    description?: string
    keywords?: string[]
}
```

## 定義済みページID

現在利用可能なページID：

- `home` - ホームページ（フッター無し、フルパーティクル）
- `work` - 作品ページ（控えめなパーティクル）
- `exploration` - 実験ページ（パーティクル無し）
- `font-demo` - フォントデモ（軽量パーティクル）
- `animation-demo` - アニメーションデモ（リッチパーティクル）
- `about` - アバウトページ（標準設定）
- `contact` - コンタクトページ（軽量設定）

## 新しいページIDの追加

`src/types/pageConfig.ts`の`PAGE_CONFIGS`に新しい設定を追加：

```typescript
export const PAGE_CONFIGS: Record<PageId, PageConfig> = {
    // 既存の設定...
    
    'new-page': {
        showParticleRing: true,
        showFooter: true,
        showHeader: true,
        bodyClasses: ['page-new-page', 'custom-styling'],
        particleSettings: {
            particleCount: 5000,
            innerRadius: 100,
            // その他の設定...
        }
    }
}
```

型定義の`PageId`にも追加：

```typescript
export type PageId = 
    | 'home' 
    | 'work' 
    | 'exploration'
    | 'new-page'  // 新しいページIDを追加
    // その他...
```

## ベストプラクティス

1. **パフォーマンスを考慮**：`particleCount`は適切な範囲（3000-8000）に設定
2. **一貫性を保つ**：同じタイプのページには類似の設定を使用
3. **段階的な変更**：設定を大幅に変更する前に、段階的にテスト
4. **レスポンシブ対応**：モバイルでのパフォーマンスを考慮した設定

## トラブルシューティング

### パーティクルが表示されない
- `showParticleRing: true`が設定されているか確認
- `particleCount`が0以上に設定されているか確認
- ブラウザのWebGL対応を確認

### 設定が反映されない
- `pageId`が正しく設定されているか確認
- `pageConfigOverride`の構文が正しいか確認
- ブラウザのキャッシュをクリア

### パフォーマンスが悪い
- `particleCount`を下げる（6000以下）
- `enableMouseInteraction: false`に設定
- `enableBigBangAnimation: false`に設定 