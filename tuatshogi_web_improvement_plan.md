# 東京農工大学将棋部 Webサイト改善計画

作成日: 2026年8月5日  
対象サイト: https://tuatshogi.github.io/

## 1. 目的

「東京農工大学将棋部Webサイト 改善計画.pdf」の指摘と現行実装を基に、サイトの外見を一切変えず、表示速度、アクセシビリティ、HTML品質、保守性を改善する。

## 2. 外見を維持するための必須条件

- 文言、色、書体、文字サイズ、余白、配置、画像の比率・トリミングを変更しない
- ブレークポイント、ホバー表現、フォーカス表示、メニューアニメーションを変更しない
- 画像は現在と同じ原画から生成し、表示領域とCSSクラスを維持する
- 空要素を削除する場合は、その要素が作っていた余白を隣接する実要素へ移す
- 変更前後に4ページを375px、768px、1440px幅で撮影し、表示差分を確認する
- レイアウト上の位置と寸法の差を0pxとし、画像圧縮による差は目視で判別できない範囲に限定する

対象ページ:

- `/`
- `/entry.html`
- `/record.html`
- `/introduce.html`

`/top.html`はトップページへの転送が正常に動作することを確認する。

## 3. 現状

### 3.1 画像

| 画像 | 現在の配信容量 | 主な問題 |
|---|---:|---|
| 活動写真 `20260709_180604.jpg` | 約4.13MB | 原寸配信、画面下部画像を含む自動preload |
| 大会写真 `20260524_191148.jpg` | 約254KB | 自動preload、寸法属性なし |
| トップ画像 `top.png` | 約1.46MB | 端末を問わず同じ画像を配信 |
| エンブレム `Designer.png` | 約574KB | 表示サイズに対して過大、全ページでpreload |
| ヘッダーロゴ `logo.png` | 約222KB | 表示サイズに対して過大、寸法属性なし、全ページでpreload |
| キャンパスマップ `cumpasmap.jpg` | 約357KB | 画面下部にもかかわらずpreload、寸法属性なし |

トップ画像はコード上で`2000×2000`と指定されているが、現在の実ファイルは`1254×1254`である。派生画像は実寸を上限とし、拡大生成しない。

### 3.2 JavaScriptとCSS

- JavaScript: 約210KB、gzip時約66KB
- CSS: 約17KB、gzip時約4.5KB
- HTML本文はプリレンダリング済みだが、表示後にReact全体をhydrationしている
- ブラウザでJavaScriptが必要な機能は主にモバイルメニューである

### 3.3 SEOとアクセシビリティ

- title、description、canonical、OGP、Xカード、構造化データを設定済み
- 全4ページの本文をプリレンダリング済み
- 既存の`npm run check:seo`は合格
- `lang="ja"`、見出し構造、代替テキスト、フォーカス表示、モバイルメニューのARIA属性、`prefers-reduced-motion`に対応済み
- 現在ページのナビゲーションに`aria-current="page"`がない

## 4. 実施計画

### 第0段階: 表示基準と性能基準の保存

実装前に以下を保存する。

1. 4ページを375px、768px、1440px幅で撮影
2. 各ページの主要要素の位置、幅、高さを記録
3. Lighthouseのモバイル・デスクトップ結果を記録
4. 初期通信量、画像リクエスト、preload件数を記録
5. モバイルメニューの開閉、Escapeキー、フォーカス復帰を動画またはテストで記録

この基準を以後の各段階で使用する。

### 第1段階: 画像最適化

対象ファイル:

- `scripts/optimize-images.mjs`
- `src/components/home/HeroSection.jsx`
- `src/components/layout/Header.jsx`
- `src/components/pages/ContentPage.jsx`
- `src/data/siteConfig.js`

#### 1. レスポンシブ画像の生成

`scripts/optimize-images.mjs`で、ビルド時に次の派生画像を生成する。

| 用途 | 生成幅 | 形式 |
|---|---|---|
| トップ画像 | 480 / 768 / 1024 / 1254px | AVIF、WebP |
| 活動写真 | 640 / 960 / 1280 / 1600px | AVIF、WebP |
| 大会写真 | 640 / 960 / 1280px | AVIF、WebP |
| キャンパスマップ | 640 / 960 / 1280px | AVIF、WebP |
| エンブレム | 表示サイズの2倍を上限 | lossless WebP |
| ヘッダーロゴ | 表示サイズの2倍を上限 | lossless WebP |

- 元画像の縦横比を必ず維持する
- 元画像より大きい派生画像を生成しない
- GPS、撮影機種など、表示に不要なメタデータを除去する
- 生成結果が容量上限を超えた場合はビルドを失敗させる

#### 2. 表示側の変更

- `<picture>`、`srcset`、`sizes`で画面幅に適した画像を配信する
- `<img>`の既存クラスを維持し、表示寸法とトリミングを変えない
- 各画像に実際の縦横比に基づく`width`と`height`を指定する
- トップ画像は`fetchPriority="high"`を維持する
- 活動紹介の1枚目はLCP測定後に`eager/high`の要否を決定する
- 活動紹介の2枚目とキャンパスマップには`loading="lazy"`と`decoding="async"`を指定する
- ヘッダー画像には`fetchPriority="low"`を指定し、React SSRによる自動preloadを停止する

活動写真は4:3、大会写真は5:4、キャンパスマップは元画像固有の比率を維持する。すべてを一律の寸法にそろえない。

#### 3. 画像の容量目標

- 640px版: 100KB以下
- 960px版: 180KB以下
- 1600px版: 300KB前後以下
- キャンパスマップ: 150KB以下
- エンブレム: 50KB以下
- ヘッダーロゴ: 30KB以下
- 3MBを超える配信画像: 0件
- 画面下部画像のpreload: 0件

### 第2段階: ブラウザ向けJavaScriptの削減

対象ファイル:

- `src/main.jsx`
- `src/App.jsx`
- `src/entry-server.jsx`
- `vite.config.js`
- `scripts/prerender-pages.mjs`
- `templates/*.html`

推奨案は、Reactをビルド時のHTML生成だけに使用し、ブラウザ側のページ全体のhydrationを廃止する方法とする。

1. 現在のReactプリレンダリングを維持する
2. 本番HTMLからReact hydration用エントリーを外す
3. モバイルメニュー専用の小さなVanilla JavaScriptを追加する
4. 現在の開閉クラス、ARIA属性、Escapeキー、フォーカス復帰を同じ状態で再現する
5. 768px以上になった際のメニュー閉鎖処理を維持する
6. メニュー内リンクを選択した際の閉鎖処理を維持する
7. ページ本文とフッターではJavaScriptを実行しない

実行時JavaScriptはgzip 5KB以下を目標とする。

### 第3段階: HTML、アクセシビリティ、フォントの整理

対象ファイル:

- `src/components/home/HeroSection.jsx`
- `src/components/home/AboutSection.jsx`
- `src/components/layout/Header.jsx`
- `templates/*.html`

#### 1. 空要素

HeroとAboutの空`p`要素を削除する。ただし、単純に削除すると縦方向の間隔が変わる可能性があるため、変更前の計測値に基づいて余白を見出し、CTA、親要素へ移す。

#### 2. 現在ページの通知

ヘッダーの内部リンクに、表示中ページと一致する場合のみ次を設定する。

```jsx
aria-current={item.href === currentPath ? "page" : undefined}
```

`aria-current`に対する追加スタイルは設定せず、見た目を変えない。

#### 3. Webフォント

- 使用されていない`Shippori Mincho 600`を読込対象から外す
- 使用中の`Noto Sans JP 400 / 500 / 700`と`Shippori Mincho 700`は維持する
- フォントファミリーとフォールバックを変更しない
- セルフホスト化は文字幅や描画結果が変わらないことを確認できる場合のみ別途実施する

#### 4. HTML検証

Nu HTML Checkerで4ページを検証し、Error 0を確認する。

### 第4段階: 自動品質チェック

GitHub Actionsに以下を追加する。

1. `npm run build`
2. `npm run check:seo`
3. Nu HTML Checker
4. Lighthouse CI
5. 内部リンク検査
6. 画像容量、形式、寸法属性の検査
7. 画面下部画像のpreloadが0件であることの検査
8. JavaScript容量の検査
9. 4ページ、3画面幅のスクリーンショット差分検査

既存の`check-seo.mjs`には次の検査を追加するか、性能専用の検査スクリプトを新設する。

- 全コンテンツ画像に`width`と`height`がある
- 活動紹介の2枚目とキャンパスマップがlazy loadである
- 不要な画像preloadが生成されていない
- 3MBを超える配信画像が存在しない
- AVIFまたはWebPの`srcset`が存在する
- JavaScriptが設定した容量上限を超えていない

## 5. 完了基準

| 項目 | 目標 |
|---|---:|
| Lighthouse モバイルPerformance | 90以上 |
| Lighthouse デスクトップPerformance | 95以上 |
| Accessibility | 95以上 |
| Best Practices | 95以上 |
| SEO | 100 |
| LCP | 2.5秒以下 |
| CLS | 0.1以下 |
| INP | 200ms以下 |
| Nu HTML Checker | Error 0 |
| 画面下部画像のpreload | 0件 |
| 3MB超の配信画像 | 0件 |
| 寸法指定のないコンテンツ画像 | 0件 |
| 実行時JavaScript | gzip 5KB以下 |

性能値に加え、次を満たした場合のみ完了とする。

- 4ページの文字、色、余白、配置が変更前と一致する
- 画像の表示比率、切り抜き範囲、表示サイズが一致する
- ヘッダーとモバイルメニューの外見・操作が一致する
- キーボード操作とフォーカス表示が維持されている
- title、description、canonical、OGP、構造化データが維持されている

## 6. 実施順序と切り戻し

変更は次の単位に分けて実施し、各段階でビルド、性能検査、表示差分検査を完了してから次へ進む。

1. 表示基準と自動差分検査
2. 画像生成とレスポンシブ配信
3. preload、lazy load、寸法属性
4. React hydrationの廃止とモバイルメニュー移行
5. HTML、アクセシビリティ、フォント整理
6. CIと完了基準の固定

各段階を独立したコミットにし、問題が発生した段階だけを切り戻せる状態にする。
