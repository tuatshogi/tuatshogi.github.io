# 東京農工大学将棋部 公式Webサイト

東京農工大学将棋部の公式Webサイトです。

ReactとTailwind CSSを使用し、藍色・生成り・墨色を基調とした「和モダン × ミニマル」なデザインで構築しています。Reactはビルド時のHTML生成だけに使用し、ブラウザではモバイルメニュー用の最小JavaScriptだけを実行します。

## ページ一覧

| ページ | ファイル | 内容 |
|---|---|---|
| トップ | `index.html` | Hero、部の特徴、見学・活動紹介への導線 |
| 入部案内 | `entry.html` | 活動場所、キャンパスマップ、部費、入部・見学方法 |
| 大会記録 | `record.html` | 年度別の大会結果 |
| 活動紹介 | `introduce.html` | 日頃の活動、大会・部内戦、活動写真 |

旧URLの`top.html`は、トップページ`/`への互換転送ページです。

## 主な機能

- PC・タブレット・スマートフォン対応
- 固定ヘッダーとモバイルメニュー
- CSSで表現した将棋盤と駒のHeroビジュアル
- Aboutカードのデータ駆動表示
- 公式XのDMを利用した見学案内
- 小金井キャンパスの部室案内図
- 年度別の大会結果表示
- キーボード操作と`prefers-reduced-motion`への対応
- 全4ページのビルド時プリレンダリング
- AVIF・WebPのレスポンシブ画像配信
- 使用文字だけに絞ったWebフォントのローカル配信
- canonical、OGP、Twitter Card、Organization構造化データ
- `sitemap.xml`と`robots.txt`の自動生成
- Viteなしでも配信できる静的ビルド

## 使用技術

- React
- JavaScript / JSX
- Tailwind CSS
- Vite
- PostCSS / Autoprefixer

## ディレクトリ構成

```text
mycraft/
├── src/
│   ├── App.jsx
│   ├── client.js         # CSS読込とモバイルメニュー制御
│   ├── index.css
│   ├── assets/
│   │   ├── fonts/        # 配信用Webフォント
│   │   └── generated/    # ビルド時に再生成する画像
│   ├── components/
│   │   ├── home/          # Hero、About、FeatureCard
│   │   ├── layout/        # Header、Footer
│   │   └── pages/         # 入部案内、大会記録、活動紹介
│   └── data/
│       ├── siteConfig.js       # サイト共通設定と表示データ
│       └── pageDefinitions.js  # URL、title、description、canonical
├── public/                # OGP画像、構造化データ用ロゴ
├── templates/             # ビルド前のHTMLテンプレート
├── scripts/               # 画像生成、プリレンダリング、SEO検査、配置処理
├── assets/                # 静的配信用のビルド済みファイル
├── index.html             # 静的配信用トップ
├── top.html               # `/`への互換転送
├── entry.html
├── record.html
├── introduce.html
├── sitemap.xml
├── robots.txt
├── og-image.jpg
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 開発環境の準備

Node.js 20.19以上を使用します。CIでもNode.js 20系を使用します。

```bash
npm install
```

`package-lock.json`のバージョンを厳密に使用する場合は、次のコマンドを使用します。

```bash
npm ci
```

## 開発サーバー

```bash
npm run dev
```

ターミナルに表示されたURLをブラウザで開いてください。

## 本番ビルド

```bash
npm run build
```

ビルドでは次の処理を行います。

1. `templates/`から開発用HTMLを復元
2. `sharp`でAVIF・WebPのレスポンシブ画像、OGP画像、構造化データ用ロゴを生成
3. Reactの各ページをHTMLへプリレンダリング
4. JSX、Tailwind CSS、メニュー用JavaScriptをViteでビルド
5. `sitemap.xml`と`robots.txt`を生成
6. 新しいHTML、JavaScript、CSS、画像をプロジェクト直下へ配置

ビルド後のファイルは、Viteを使わない通常の静的Webサーバーでも配信できます。

```bash
python3 -m http.server
```

ブラウザで次を開きます。

```text
http://localhost:8000/
```

SEO出力の自動検査は次のコマンドで実行できます。

```bash
npm run check:seo
```

ビルド、SEO、成果物、HTMLを一括検査する場合は`npm test`を使用します。視覚・操作検査とLighthouseは用途に応じて個別に実行します。

```bash
npm test
npm run test:visual
npm run test:lighthouse:mobile
npm run test:lighthouse:desktop
```

## コンテンツの更新

### サイト名・リンク・Aboutカード

次のファイルを編集します。

```text
src/data/siteConfig.js
```

ここでは以下を管理しています。

- 大学名、部名
- 公式X URL
- 連絡先メールアドレス
- ナビゲーション
- HeroのCTAリンク
- Aboutカードの文言

ページごとのURL、title、description、canonicalは次で管理しています。

```text
src/data/pageDefinitions.js
```

### トップページ

```text
src/components/home/HeroSection.jsx
src/components/home/AboutSection.jsx
src/components/home/FeatureCard.jsx
```

### 入部案内・大会記録・活動紹介

```text
src/components/pages/ContentPage.jsx
```

大会結果の追加方法は、次の手順書を参照してください。

```text
tournament_result_update_guide.md
```

### ヘッダー・フッター

```text
src/components/layout/Header.jsx
src/components/layout/Footer.jsx
```

### 共通スタイル

```text
src/index.css
tailwind.config.js
```

## 画像

| ファイル | 用途 |
|---|---|
| `Designer.png` | ヘッダーのエンブレムと構造化データ用ロゴの生成元 |
| `logo.png` | ヘッダーのロゴとOGP用ワードマークの生成元 |
| `cumpasmap.jpg` | 入部案内のキャンパスマップ |
| `20260709_180604.jpg` | 日頃の活動写真 |
| `20260524_191148.jpg` | 大会参加時の写真 |
| `top.png` | Heroの正規原画 |
| `src/assets/generated/og-background.png` | OGP画像の背景素材 |

配信用画像は`src/assets/generated/responsive/`へ毎回再生成され、Viteがハッシュ付きファイルとして`assets/`へ配置します。生成途中の画像はGit管理しません。元画像を変更した場合も、必ず`npm run build`を実行してください。

`src/assets/fonts/`には現在の4ページで使用する文字を含むNoto Sans JP 400–700とShippori Mincho 700のWOFF2サブセットがあります。本文へ新しい文字を追加した場合は、フォントの表示と視覚テストも確認してください。

## Gitへ反映するときの注意

このリポジトリは、プロジェクト直下のHTMLと`assets/`を静的サイトとして配信します。

ソースを変更したら、次の順序で反映してください。

```bash
npm ci
npm run build
git status
git add -A
git commit -m "変更内容を記述"
git push
```

`assets/`内のファイル名には内容に応じたハッシュが付くため、ビルドすると古いファイルの削除と新しいファイルの追加が発生することがあります。HTMLと`assets/`は必ず一緒にコミットしてください。

`node_modules/`、`dist/`、PDF、ログ、一時ファイルは`.gitignore`で除外しています。

## 関連ドキュメント

| ファイル | 内容 |
|---|---|
| `university_shogi_site_requirements.md` | サイト構成要件 |
| `university_shogi_site_detailed_design.md` | 詳細設計書 |
| `implementation_report.md` | 実装内容と検証結果 |
| `tournament_result_update_guide.md` | 大会結果の更新手順 |

## 連絡先

- X: [@tuatshogiclub](https://x.com/tuatshogiclub)
- Email: [tuatshogi@gmail.com](mailto:tuatshogi@gmail.com)

## Copyright

© 東京農工大学将棋部
# 最後に
こんにちは、このページの作者友兼です。
本ホームページは2026年07月に作成されました。このページが幾年にもわたって維持、更新されていくことを期待しています。将来の将棋部の皆さん。私の知る世代かどうかはわかりませんが、皆さんの成功をここからお祈りしています。\\
友兼隆斗より
\\

友兼隆斗の略歴
2026年4月東京農工大学知能情報システム工学科入学
同年　同大学将棋部入部
