# CMS実装計画

## 1. 目的

東京農工大学将棋部の既存Webサイトに、お知らせ機能と大会記録のCMS管理機能を追加する。

公開サイトはGitHub Pagesで継続運用し、CMSは`mycraft`と同じディレクトリに作成する`mycraft-cms`からCloudflare Workersで公開する。

既存サイトのデザイン、表示形式、静的HTML配信、SEO、アクセシビリティをできるだけ維持し、CMS導入による公開サイトの見た目や操作感の変更を最小限にする。

## 2. 対象ディレクトリ

```text
/home/tomokane/.ssh/web/
├── mycraft/                    # 既存の公開サイト
└── mycraft-cms/                # 新規CMSプロジェクト
```

## 3. 採用する構成

```text
CMS管理画面
  ↓ HTTPS / 認証済みAPI
Cloudflare Workers
  ├── 管理API
  ├── 公開・下書きデータ管理
  ├── D1
  └── GitHub API
        ↓ データファイルをコミット
GitHubリポジトリ
  ↓ push
GitHub Actions
  ├── npm ci
  ├── npm run build
  └── GitHub Pagesへ公開
```

### 3.1 公開反映方式

CMSで公開操作を行ったとき、Cloudflare WorkerがGitHub APIを使って公開データファイルを更新する。

GitHub Actionsが変更を検知して既存サイトを再ビルドし、生成された静的HTMLをGitHub Pagesへ公開する。通常の反映時間はGitHub Actionsの実行時間を含めて数分程度を想定する。

生成済みの`index.html`や`record.html`を直接編集するのではなく、ソースデータを更新して既存のプリレンダリング処理でHTMLを再生成する。

### 3.2 GitHub認証

Cloudflare WorkerからGitHub Appを使用する。

- 個人アクセストークンは使用しない
- 対象リポジトリを限定する
- `Contents: Read and write`を基本権限とする
- App ID、Installation ID、秘密鍵はCloudflare Secretsで管理する
- GitHubのコミット履歴から公開内容を追跡・復元できるようにする

## 4. 公開サイトの変更方針

### 4.1 変更しないもの

- ヘッダー、フッター、Hero、Aboutの基本構成
- 藍色・生成り・墨色を基調とした配色
- 既存のフォント、罫線、背景グリッド、余白設計
- レスポンシブレイアウト
- 既存ページのURL
- JavaScript無効時にも表示できる静的HTML構成
- SEOメタ情報、canonical、OGP、構造化データ

### 4.2 大会記録

現在の`RecordPage`のHTML構造、Tailwindクラス、表示順、各項目の配置を維持する。

維持する表示要素:

- 年度見出し
- 年度ごとの公式結果リンク
- 大会開催日
- 大会名・級
- 勝敗や昇降級の詳細
- 結果ラベル
- `highlight: true`の金色ラベル
- モバイル・タブレット・デスクトップ時の配置

固定されている`records`配列を管理用データファイルへ移し、`RecordPage`は同じデータ構造を読み込んで描画する。

想定するデータ構造:

```json
{
  "records": [
    {
      "year": "2026年度（令和8年度）",
      "sourceUrl": "http://kantoshogi.web.fc2.com/kekka/R08/R08kekka.html",
      "publishedAt": "2026-08-10T00:00:00Z",
      "sortOrder": 0,
      "items": [
        {
          "date": "2026.05.24",
          "event": "春季団体戦C2級",
          "result": "2位・昇級",
          "detail": "6勝1敗　C1級へ昇級",
          "highlight": true
        }
      ]
    }
  ]
}
```

大会記録年度は`publishedAt`の新しい順に自動表示し、同時刻の場合は`sortOrder`、年度名の順で安定させる。

### 4.3 お知らせ欄

トップページのHeroセクション直後、既存のAboutセクションの前に追加する。

既存セクションのコードやスタイルは変更せず、追加されたお知らせ欄だけで完結させる。

表示内容:

- セクション見出し「お知らせ」
- 最新3件程度の公開済みお知らせの題名
- 各題名に「詳細を見る」ボタンを配置し、記事専用URLへリンクする
- トップでは題名と「詳細を見る」ボタンのみを表示し、公開日は表示しない
- 「もっとみる」リンクでお知らせ一覧ページ`/news.html`へ遷移する
- 本文や添付画像もトップページには表示しない
- お知らせがない場合の空状態

公開順は`publishedAt`（日時・時刻）の新しい順とし、同一時刻の場合だけIDで安定させる。

### 4.4 お知らせ一覧ページ

`/news.html`に公開済みのお知らせを新しい順に一覧表示する。

表示内容:

- ページ見出し「お知らせ一覧」
- 公開日
- 題名
- 各題名に「詳細」ボタン
- お知らせがない場合の空状態

### 4.5 お知らせ詳細ページ

公開済みのお知らせごとに、記事専用URL`/news/<notice-id>.html`を生成する。

URLの`<notice-id>`は記事ごとに固定し、タイトルの変更などではURLが変わらないようにする。

表示内容:

- 題名
- 公開日
- 本文
- 添付画像
- 必要に応じた外部リンクまたは内部リンク
- 一覧ページへの戻りリンク

記事詳細ページごとにtitle、description、canonical、OGPを生成し、`sitemap.xml`へURLを追加する。

本文はプレーンテキストとして保存する。表示時は次の処理を行う。

- 改行を保持する
- 空行を段落として扱う
- 適切な行間と最大幅を設定する
- URLは安全に検証したうえでリンク化する
- HTMLをそのまま解釈せず、XSSを防止する

### 4.6 添付画像

お知らせには画像を添付できる。添付画像は公開データとともにGitHubリポジトリへ保存し、GitHub Pagesから配信する。D1には画像のメタデータだけを保存する。

管理時の制約:

- JPEG、PNG、WebPを許可する
- Worker側でMIMEタイプ、ファイルサイズ、画像寸法を検証する
- `alt`を必須にする
- ビルド時に既存の`sharp`処理でWebP・AVIFへ変換し、レスポンシブ画像として配信する
- 公開データから参照されなくなった添付ファイルは公開操作時に削除する
- 初期段階では動画や大量画像は対象外とする

## 5. CMSの機能

### 5.1 認証

- IDとパスワードによるログイン
- パスワードのハッシュ化保存
- パスワードをソースコードやGitに保存しない
- HttpOnly、Secure、SameSite属性付きセッションCookie
- セッションの有効期限
- ログアウト
- 自分のパスワード変更
- ログイン失敗時のレート制限または一時的な試行制限

初期管理者はデプロイ時の安全な初期化処理で作成する。初期IDとパスワードはCloudflare Secretまたはローカルの対話式初期化コマンドから設定し、リポジトリには記録しない。

### 5.2 お知らせ管理

- 一覧表示
- 新規作成
- 編集
- 削除または非公開化
- 下書き保存
- 公開
- 公開日の設定
- 公開日時の変更
- 内部・外部リンクの設定
- 画像の添付・削除
- 添付画像の`alt`設定
- 更新日時の表示

想定フィールド:

| フィールド | 内容 |
|---|---|
| `id` | 一意な識別子 |
| `title` | お知らせタイトル |
| `body` | プレーンテキスト本文 |
| `linkUrl` | 任意のリンク先 |
| `published` | 公開状態 |
| `publishedAt` | 公開日時 |
| `attachments` | 添付画像の一覧（`alt`、ファイルパス） |
| `createdAt` | 作成日時 |
| `updatedAt` | 更新日時 |
| `updatedBy` | 最終更新者 |

### 5.3 大会記録管理

既存の表示形式を維持できる項目を管理画面で編集可能にする。

- 年度の追加・編集・削除
- 年度の表示順変更
- 公式結果URLの編集
- 大会結果の追加・編集・削除
- 大会結果の表示順変更
- 強調表示の切り替え
- 下書き保存
- 公開

### 5.4 ユーザー管理

権限に応じて利用可能な操作を制限する。

## 6. 権限設計

### 6.1 部長

- システム上1人だけ存在できる
- すべてのお知らせ・大会記録を編集できる
- 管理者を追加、編集、停止、削除できる
- ライターを追加、編集、停止、削除できる
- すべてのアカウントのパスワードをリセットできる
- 操作履歴を確認できる
- 部長を引き継げる
- システム設定を変更できる

部長の引き継ぎでは、新しい部長を選択したあと、現在の部長を管理者へ降格する。部長が0人または2人になる操作は禁止する。

### 6.2 管理者

- ライター権限を継承する
- ライターを追加、編集、停止、削除できる
- ライターのパスワードをリセットできる
- 部長・管理者自身・他の管理者の権限は変更できない
- 部長の引き継ぎはできない

### 6.3 ライター

- すべてのお知らせを編集できる
- すべての大会記録を編集できる
- 下書き保存・公開ができる
- ユーザー管理はできない
- 権限、システム設定、GitHub連携設定にはアクセスできない

## 7. D1データ設計

想定するテーブル:

- `users`: 管理者アカウント、表示名、権限、状態、パスワードハッシュ
- `sessions`: セッション情報、有効期限、失効状態
- `notices`: お知らせ本文、公開状態、公開日時、更新者
- `notice_attachments`: 添付画像のファイルパス、`alt`、ファイルサイズ、MIMEタイプ、作成者
- `record_seasons`: 年度、公式結果URL、表示順、公開状態
- `record_items`: 大会日、大会名、結果、詳細、強調状態、表示順
- `audit_logs`: ログイン、記事更新、権限変更、公開、同期結果
- `sync_jobs`: GitHubへの反映状態、エラー、再試行情報

D1のデータをCMS上の編集・下書きの正本とし、公開操作時に公開済みデータをJSONへ出力してGitHubへ反映する。公開データにはお知らせ一覧ページ`/news.html`と記事詳細ページ`/news/<notice-id>.html`の生成に必要な情報を含め、ビルド時に静的HTMLを生成する。

GitHub APIが一時的に失敗した場合でも、CMS上のデータを失わないようにする。同期状態を保存し、再同期操作または再試行処理で復旧できるようにする。

## 8. GitHub Actions

現在の品質チェックを維持しつつ、GitHub Pagesへ公開するWorkflowを追加する。

実行内容:

1. リポジトリをCheckout
2. Node.jsをセットアップ
3. `npm ci`
4. `npm run build`
5. 既存のビルド検査を実行
6. GitHub Pages Artifactを作成
7. GitHub Pagesへデプロイ

CMSからのコミット、通常のソース変更、手動実行に対応する。

ビルド処理でお知らせ一覧ページ`/news.html`と記事詳細ページ`/news/<notice-id>.html`を生成し、CMSから反映されたお知らせと添付画像を公開サイトへ反映する。

ビルドまたは検査が失敗した場合はデプロイしない。これにより、CMSの誤入力やビルドエラーで公開中のサイトが壊れることを防ぐ。

## 9. Cloudflare Workers構成

`mycraft-cms`はCloudflare Workers向けのフルスタックアプリケーションとして作成する。

想定構成:

```text
mycraft-cms/
├── src/
│   ├── index.ts                 # Workerエントリーポイント
│   ├── routes/                  # 認証、記事、ユーザー、同期API
│   ├── auth/                    # パスワード、セッション、権限
│   ├── db/                      # D1アクセス
│   └── ui/                      # CMS管理画面
├── migrations/                  # D1マイグレーション
├── public/                      # 管理画面の静的アセット
├── wrangler.toml または wrangler.jsonc
├── package.json
└── README.md
```

Cloudflare設定:

- Worker
- D1 Database
- 本番・ローカル環境
- GitHub App関連Secrets
- セッション署名用Secret
- 公開サイトのOrigin設定
- 添付画像の検証設定（MIMEタイプ、ファイルサイズ、画像寸法）
- 必要に応じたカスタムドメイン

## 10. 実装手順

### Phase 1: 公開サイトのデータ分離

- 既存の大会記録をデータファイルへ移動
- `RecordPage`の表示結果を変更しない
- お知らせの初期データ形式を追加
- Hero直後にお知らせ欄（題名と「詳細を見る」ボタンのみ。公開日、本文、添付画像は表示しない）を追加
- 「もっとみる」リンクを追加
- お知らせ一覧ページ`/news.html`を追加
- 記事詳細ページ`/news/<notice-id>.html`の静的生成処理を追加
- 静的プリレンダリングでお知らせをHTMLへ含める

### Phase 2: CMS基盤

- `mycraft-cms`を作成
- Cloudflare WorkersとD1を設定
- 認証、セッション、パスワード変更を実装
- 初期部長作成処理を実装
- D1マイグレーションを作成
- 全API入力契約を実装し、DB実行前に必須値、型、ID、`loginId`（`[A-Za-z0-9_-]{1,64}`）、URL、日時、boolean、integer、文字数、制御文字、HTML、JSONサイズを検証する。本文と`detail`は改行・タブ等を保持できるがHTMLを拒否し、それ以外の文字列は制御文字を拒否する
- safe URLはhttp/httpsまたは単一スラッシュの内部パスだけを許可し、生/URLエンコード済みバックスラッシュ、`.`/`..`パストラバーサル、異常なencodingを拒否する。日付は区切り文字を混在させない実在する`YYYY-MM-DD`または`YYYY.MM.DD`だけを許可する
- 公開状態の通知日時と大会記録年度の公式URLを検証
- セッションCookie、CSRF、Origin/CORS、安全ヘッダー、no-store、ログイン試行制限、監査ログを実装
- D1の一意制約、外部キー、cascade、部長・最後の管理権限保護を4xxへ変換
- bootstrapを不正トークン拒否かつ原子的に実装し、部長が同時実行で複数作成されないことを保証
- Workers/D1実環境のテストで、DBをテスト間で共有せず、リセットまたは固有fixtureを使用

### Phase 3: CMS管理画面

- [x] Workers Static Assetsから配信するvanilla TypeScript/HTML/CSSのログイン、ダッシュボード、通知、記録、ユーザー、パスワード変更、部長引き継ぎ画面
- [x] `/admin/login`, `/admin/`, `/admin/notices`, `/admin/notices/new`, `/admin/notices/:id/edit`, `/admin/records`, `/admin/records/:seasonId`, `/admin/users`, `/admin/account/password`, `/admin/transfer`
- [x] fetch credentials、`GET /api/auth/me`ガード、401リダイレクト、403表示、role別ナビ、CSRF
- [x] 通知・大会記録のCRUD、下書き・公開・非公開、公開日時、リンク、添付メタデータ操作
- [x] users CRUD、role/status操作、writer password reset、director transfer API
- [x] キーボード操作、focus表示、label、aria-live、確認ダイアログ、44px操作領域、320px以上のレスポンシブCSS

添付はPhase 3ではメタデータだけを扱い、バイナリ受信・画像変換・GitHub同期は実装しない。

### Phase 4: GitHub連携

- GitHub Appの認証処理
- 公開データJSONの生成
- 添付画像のGitHubリポジトリへの同期
- GitHub APIへのコミット
- 同期状態表示
- 同期失敗時の再試行
- GitHub ActionsのPagesデプロイWorkflow追加

Phase 4のGitHub App、GitHub API/Actions、公開データ同期、画像バイナリ同期、同期再試行は未実装のまま残す。

### Phase 5: 検証と公開準備

- 既存サイトのビジュアル回帰テスト
- CMSの認証テスト
- 権限マトリクステスト
- D1マイグレーションテスト
- GitHub同期テスト
- GitHub Pagesデプロイテスト
- Cloudflare Workersへの本番デプロイ
- 初期部長アカウント作成

## 11. テスト項目

### 公開サイト

- 既存4ページの表示形式が変わらない
- 大会記録の年度、項目、ラベル、公式リンクが維持される
- お知らせがトップページに表示される
- トップページにはお知らせの題名と「詳細を見る」ボタンだけが表示され、公開日、本文、添付画像は表示されない
- 「もっとみる」でお知らせ一覧ページへ遷移できる
- 一覧ページに公開済みお知らせだけが表示される
- 「詳細」ボタンで記事専用URLへ遷移できる
- 記事詳細ページに題名、公開日、本文、添付画像が表示される
- 記事専用URLがsitemapとcanonicalに含まれる
- 添付画像の`alt`、サイズ、リンク先が正しい
- お知らせ本文の改行と段落が維持される
- 320px、375px、768px、1024px、1440pxで崩れない
- JavaScript無効時にもビルド済みデータが表示される
- 既存のビジュアルスナップショットが意図せず変化しない
- `npm run build`、`npm test`、既存のPlaywrightテストが成功する
- `tests/fixtures/news-data.json`の公開4件・下書き1件を使い、公開日時による表示順を実DOMで検証する
- テスト用データは一時プロジェクトの`src/data/notices.js`だけに差し替え、元プロジェクトの生成物、データ、`public`、`assets`、`news`を変更しない
- 添付画像、本文中のURL、関連リンク、本文の改行・空行を記事詳細の実DOMで検証する
- canonical、OGP、sitemapの詳細URLと下書き除外を検証する

### CMS

- 未ログインで管理画面や管理APIへアクセスできない
- 正しいID・パスワードでログインできる
- 不正な認証情報でログインできない
- セッション期限切れ後に再認証が必要になる
- 部長が1人に制限される
- 部長の引き継ぎが正しく動作する
- 管理者がライターだけを管理できる
- ライターがユーザー管理へアクセスできない
- ライターがすべてのお知らせ・大会記録を編集できる
- 下書きが公開サイトへ表示されない
- 下書きのお知らせが一覧ページ・記事URL・静的JSONに含まれない
- 入力契約違反、HTML、本文/detail以外の制御文字、不正なURL（生/encoded backslash、`.`/`..`、異常encoding）・日時（混在区切り、存在しない日付）、loginId境界、JSON本体超過がDB実行前に4xxになる
- notice本文とrecord item detailの省略値が空文字になり、nullは4xxになる
- Cookie属性・期限、平文パスワード非保存、Origin/CORS、安全ヘッダー、no-store、rate limitを検証する
- 重複ID・login、FK不在（422）、D1 constraint、cascade、auditを検証する
- 添付メタデータのpath traversal、backslash、control、MIME、alt、正数size/dimensionsを検証する
- usersのdirector/admin/writer権限マトリクス、last management保護、直接director role変更禁止、password resetによる対象セッション失効を検証する
- director transferの再認証、D1 batch原子性、同時実行時のactive director一人維持、監査ログを検証する
- 管理画面の静的アセット、API guard、credentials、401/403、aria-live、label、44px、responsive CSS契約を検証する
- Playwrightは依存追加なしでは実行できないため、現実装ではWorkers/D1 APIテストと静的UI/アクセシビリティテストで代替する

## 12. 受け入れ条件

- 公開サイトの既存の雰囲気と表示形式が維持されている
- トップページにお知らせ欄が追加されている
- トップページのお知らせ欄には題名と「詳細を見る」ボタンのみが表示され、公開日、本文、添付画像は表示されない
- トップページから「もっとみる」でお知らせ一覧を開ける
- 各お知らせの「詳細」ボタンから記事専用URLを開ける
- CMSからお知らせを作成、編集、削除、公開できる
- CMSから大会記録を年度単位・項目単位で編集できる
- ライターはすべてのお知らせ・大会記録を編集でき、ユーザー管理APIへアクセスできない
- 部長はbootstrapの同時実行を含めて1人だけ存在できる
- CMSはIDとパスワードなしでは利用できない
- 公開操作前に入力契約が検証され、下書きは公開APIから除外される
- パスワードは平文保存・レスポンス返却されず、Secretもレスポンス返却されない
- `npm test`でWorkers/D1実環境のPhase 2テストが成功し、テスト間のfixtureが相互干渉しない
- 添付メタデータを検証・保存・削除できるが、画像バイナリは受け付けない
- ユーザー管理と部長引き継ぎはAPIおよび管理画面から利用でき、API側の権限検査を画面表示に依存しない
- GitHub App、GitHub API/Actions、GitHub Pages再公開、画像binary同期、同期再試行はPhase 4の残課題である
- 初期の空データでもトップと一覧に空状態が表示され、公開記事や下書きが表示されない

## 13. 検証方法

- `tests/news-test-site.mjs`は元プロジェクトを一時ディレクトリへ複製し、`tests/fixtures/news-data.json`から一時側の`src/data/notices.js`だけを差し替えてビルドし、一時HTTPサーバーを起動する
- `tests/news.spec.js`はテスト用サイトの実DOMで、トップの最新3件、一覧の公開4件・公開日・順序・詳細リンク、詳細の題名・公開日・本文の段落と改行・本文URL・関連リンク・添付画像の`alt`/`width`/`height`、一覧戻り、JavaScript無効表示を検証する
- 同テストはcanonical、OGP、sitemapの公開記事URLを検証し、下書きURLが含まれないことも確認する
- `tests/news-empty.spec.js`は別の空データ一時サイトで初期データのトップ・一覧の空状態を検証する
- `npm run test:news`、`npm run test:no-js`、`npm test`、`npx playwright test`、`git diff --check`を実行し、既存テストと静的ビルド検査の成功を確認する

## 14. 運用ドキュメント

次の内容を`mycraft-cms/README.md`に記載する。

- ローカル開発方法
- Node.jsと依存関係
- D1データベース作成
- マイグレーション適用
- 初期部長作成
- Cloudflare Secrets登録
- GitHub App作成・インストール
- GitHub Pages設定
- Cloudflare Workersデプロイ
- 部長引き継ぎ方法
- 同期エラーの確認と再試行
- お知らせの画像添付と削除
- バックアップと復旧
- アカウント停止・パスワードリセット手順

Phase 2ではGitHub App、画像アップロード、ユーザー管理画面、同期再試行の運用手順は作成しない。

## 15. 実装時の注意

- 既存の`RecordPage`の見た目を変更しない
- データ分離と表示変更を同じ作業で混在させず、ビジュアルテストで確認する
- 記事URLの`<notice-id>`は一度決定したら変更しない
- 添付画像はGitHubリポジトリを正本とし、D1にはメタデータだけを保存する
- 生成ファイルとソースデータを混同しない
- CMSの権限検査は画面側だけでなくWorkerのAPI側でも行う
- HTMLを直接保存・解釈せず、プレーンテキストとして扱う
- GitHub APIの秘密情報をブラウザへ渡さない
- GitHub同期に失敗してもD1の編集内容を保持する
- 部長不在・複数部長・最後の管理者削除を防止する
- 公開サイトの既存URLと内部リンクを変更しない
