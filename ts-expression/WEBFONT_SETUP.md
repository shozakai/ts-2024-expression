# Webフォント設定ガイド

このプロジェクトでのWebフォントの設定方法について説明します。

## フォルダ構成

```
ts-expression/
├── public/
│   └── fonts/              # 静的フォントファイル配置場所（推奨）
│       ├── a66e71dad627fbd29f19a5ef10dafbb4.woff2
│       └── a66e71dad627fbd29f19a5ef10dafbb4.woff
├── src/
│   ├── assets/
│   │   └── fonts/          # ビルド時に処理されるフォントファイル
│   └── styles/
│       └── _setting/
│           └── _fonts.scss # フォント設定ファイル
```

## フォント設定方法

### 1. Google Fonts を使用する場合

`src/layouts/Layout.astro` で `<link>` タグを使って読み込み（推奨）：

```astro
<head>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
    />
</head>
```

### 2. ローカルフォントを使用する場合

#### Step 1: フォントファイルの配置
- `public/fonts/` フォルダにフォントファイルを配置
- 推奨フォーマット：WOFF2 > WOFF > TTF

#### Step 2: @font-face の定義
`src/styles/_setting/_fonts.scss` で定義：

```scss
@font-face {
    font-family: 'Graphyne';
    src: url('/fonts/a66e71dad627fbd29f19a5ef10dafbb4.woff2') format('woff2'),
         url('/fonts/a66e71dad627fbd29f19a5ef10dafbb4.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

#### Step 3: CSS変数での使用

```scss
:root {
    --font-family-graphyne: 'Graphyne', sans-serif;
}
```

## 使用可能なフォントクラス

### 基本クラス

```scss
.font-public-sans  // Public Sans フォント
.font-graphyne     // カスタムフォント
```

### 最適化クラス

```scss
.font-display-swap    // フォント表示最適化
.text-optimize-jp     // 日本語テキスト最適化
```

## 使用例

### HTML/Astro での使用

```astro
<div class="font-public-sans">Public Sans text</div>
<div class="font-graphyne">Custom font</div>
```

### SCSS での使用

```scss
.my-main-text {
    font-family: var(--font-family-public-sans);
}

.my-custom-text {
    font-family: var(--font-family-graphyne);
}
```

## パフォーマンス最適化

### 1. フォントプリロード

重要なフォントは Layout.astro でプリロード：

```astro
<!-- Google Fonts のプリロード -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- ローカルフォントのプリロード -->
<link rel="preload" href="/fonts/a66e71dad627fbd29f19a5ef10dafbb4.woff2" as="font" type="font/woff2" crossorigin>
```

### 2. font-display: swap の使用

```scss
@font-face {
    font-family: 'Graphyne';
    src: url('/fonts/a66e71dad627fbd29f19a5ef10dafbb4.woff2') format('woff2');
    font-display: swap; // 必須
}
```

### 3. サブセットフォントの使用

Google Fontsでは可変フォントを使用してパフォーマンスを最適化：

```scss
// Public Sans は可変フォント技術対応（100-900のウェイト）
@import url('https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap');
```

## 現在の設定

- **メインフォント**: Public Sans（可変フォント）
- **カスタムフォント**: Graphyne
- **デフォルトフォント**: Public Sans

## カスタマイズ方法

### 新しいフォントの追加

1. `src/styles/_setting/_fonts.scss` に @font-face 定義を追加
2. CSS変数を定義
3. 必要に応じてユーティリティクラスを作成

### フォントウェイトの追加

Public Sansは可変フォントなので、100-900の全ウェイトが利用可能：

```scss
$font-weight-thin: 100;
$font-weight-light: 300;
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$font-weight-black: 900;
```

## トラブルシューティング

### フォントが読み込まれない場合

1. ファイルパスが正しいか確認
2. フォントファイルが存在するか確認
3. CORS設定が適切か確認
4. ブラウザの開発者ツールでネットワークタブを確認

### パフォーマンスが悪い場合

1. 不要なフォントウェイトを削除
2. プリロードを適切に設定
3. font-display: swap を使用
4. 可変フォント技術を活用

## 参考リンク

- [Google Fonts](https://fonts.google.com/)
- [Public Sans Font](https://fonts.google.com/specimen/Public+Sans)
- [Font Squirrel](https://www.fontsquirrel.com/)
- [Web Font Best Practices](https://web.dev/font-best-practices/)
- [Astro Font Optimization](https://docs.astro.build/en/guides/fonts/) 