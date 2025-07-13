# Sass セットアップガイド

このプロジェクトでは、Sassが正常に設定されており、以下の機能が利用可能です。

## 📦 インストール済みパッケージ

- `sass` - Sassコンパイラ（開発依存関係として追加）

## 📁 ファイル構成

```
src/
├── styles/
│   ├── _variables.scss    # 変数定義
│   ├── _mixins.scss       # ミックスイン定義
│   ├── main.scss          # メインのSassファイル
│   └── welcome.scss       # コンポーネント別のSassファイル
├── layouts/
│   └── Layout.astro       # Sassをインポートするレイアウト
├── components/
│   ├── Welcome.astro      # Sassを使用するコンポーネント
│   └── SassDemo.astro     # Sassの機能を実演するコンポーネント
└── pages/
    └── index.astro        # デモページ
```

## 🎨 利用可能な機能

### 1. 変数 (`_variables.scss`)
```scss
$primary-color: #3245ff;
$secondary-color: #bc52ee;
$text-color: #111827;
$font-family-base: Inter, Roboto, sans-serif;
```

### 2. ミックスイン (`_mixins.scss`)
```scss
@mixin button-primary {
  // プライマリボタンのスタイル
}

@mixin mobile {
  @media screen and (max-width: $breakpoint-tablet) {
    @content;
  }
}
```

### 3. ネスト機能
```scss
.component {
  padding: $spacing-medium;
  
  &:hover {
    background: $primary-color;
  }
  
  .child-element {
    color: $text-color;
  }
}
```

## 🚀 使用方法

### Astroコンポーネントでの使用

```astro
<style lang="scss">
  // 変数とミックスインをインポート
  @import '../styles/variables';
  @import '../styles/mixins';
  
  .my-component {
    @include button-primary;
    color: $primary-color;
    
    &:hover {
      color: $secondary-color;
    }
  }
</style>
```

### 新しいコンポーネントでの使用

1. コンポーネントファイルを作成
2. `<style lang="scss">` タグを使用
3. 必要に応じて変数やミックスインをインポート

## 🎯 実演コンポーネント

- `SassDemo.astro` - Sassの機能を実演するコンポーネント
- 変数、ミックスイン、ネスト、レスポンシブデザインの例を含む

## 🔧 開発サーバーの起動

```bash
npm run dev
```

サーバーを起動後、`http://localhost:4321` でSassの機能を確認できます。

## 📝 追加のSassファイル作成

1. `src/styles/` ディレクトリに新しい `.scss` ファイルを作成
2. 必要に応じて `_variables.scss` や `_mixins.scss` をインポート
3. コンポーネントから `@import` で読み込み

## 🎉 利点

- **変数**: 色やサイズの一元管理
- **ミックスイン**: 再利用可能なスタイル
- **ネスト**: 構造化されたCSS
- **レスポンシブ**: メディアクエリの簡単な管理
- **保守性**: よりクリーンで組織化されたコード 