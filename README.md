# 東京農工大学将棋部 公式Webサイト

東京農工大学将棋部の公式Webサイトです。

ReactとTailwind CSSを使用し、藍色・生成り・墨色を基調とした「和モダン × ミニマル」なデザインで構築しています。

## ページ一覧

| ページ | ファイル | 内容 |
|---|---|---|
| トップ | `index.html` / `top.html` | Hero、部の特徴、見学・活動紹介への導線 |
| 入部案内 | `entry.html` | 活動場所、キャンパスマップ、部費、入部・見学方法 |
| 大会記録 | `record.html` | 年度別の大会結果 |
| 活動紹介 | `introduce.html` | 日頃の活動、大会・部内戦、活動写真 |

## 主な機能

- PC・タブレット・スマートフォン対応
- 固定ヘッダーとモバイルメニュー
- CSSで表現した将棋盤と駒のHeroビジュアル
- Aboutカードのデータ駆動表示
- 公式XのDMを利用した見学案内
- 小金井キャンパスの部室案内図
- 年度別の大会結果表示
- キーボード操作と`prefers-reduced-motion`への対応
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
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── home/          # Hero、About、FeatureCard
│   │   ├── layout/        # Header、Footer
│   │   └── pages/         # 入部案内、大会記録、活動紹介
│   └── data/
│       └── siteConfig.js  # サイト共通設定と表示データ
├── templates/             # ビルド前のHTMLテンプレート
├── scripts/               # ビルド前後の配置処理
├── assets/                # 静的配信用のビルド済みファイル
├── index.html             # 静的配信用トップ
├── top.html
├── entry.html
├── record.html
├── introduce.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 開発環境の準備

Node.js 20以上を推奨します。

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
2. React、JSX、Tailwind CSSをViteでビルド
3. 古い配信用`assets/`を削除
4. 新しいHTML、JavaScript、CSS、画像をプロジェクト直下へ配置

ビルド後のファイルは、Viteを使わない通常の静的Webサーバーでも配信できます。

```bash
python3 -m http.server
```

ブラウザで次を開きます。

```text
http://localhost:8000/
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
| `Designer.png` | ヘッダーのエンブレム |
| `logo.png` | ヘッダーのロゴ |
| `cumpasmap.jpg` | 入部案内のキャンパスマップ |
| `20260709_180604.jpg` | 日頃の活動写真 |
| `20260524_191148.jpg` | 大会参加時の写真 |

元画像を変更した場合も、必ず`npm run build`を実行してください。

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
