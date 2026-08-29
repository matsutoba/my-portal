# Architecture

## 技術スタック

- フロントエンド: Next.js 16 (App Router) / TypeScript / React 19 / Tailwind CSS v4
- API: Go / Gin（HTTPルーティング） / GORM（DBアクセス）
- DB: Railway管理のMySQL。従量課金（Hobbyプランの月$5クレジット内に収まる想定）
- デプロイ: Next.jsはVercel、Go APIとMySQLはRailway（同一Railwayプロジェクト内。APIからDBへはRailwayのプライベートネットワーク経由で接続し、外部公開しない）

## ディレクトリ構造（案）

```
app/
  page.tsx                    # ポータルトップ（feature一覧）
  (features)/                 # route group。URLには出現しない
    <feature-slug>/           # 各ポートフォリオアプリケーション（URL: /<feature-slug>）
      page.tsx
      _components/            # そのfeature専用のコンポーネント（非ルーティング）
      _lib/                   # そのfeature専用のロジック（非ルーティング）
      ...                     # ページを複数持つfeatureはさらにネストしたルートを配置
components/
  ui/                         # プロジェクト共通のUIコンポーネントライブラリ（Button, Card等）
server/
  go.mod
  cmd/api/main.go             # エントリポイント（Goの標準的なcmd/レイアウト）
  cmd/migrate/main.go         # DBマイグレーション適用コマンド
  migrations/                 # SQLマイグレーションファイル（golang-migrate形式）
  internal/
    db/                       # feature非依存の共通処理（GORMのDB接続等）
    models/                   # DBエンティティ（GORM struct）。feature間で共有し、テーブルと1対1対応させる
      book.go
      publisher.go
      ...
    features/
      <feature-slug>/         # featureごとのドメインロジック（Next.js側のfeature-slugと対応）
        controller/           # HTTPハンドラ（Ginのgin.HandlerFuncを返す）
        service/               # ビジネスロジック。repositoryを呼び出し、dtoを組み立てる
        repository/             # DBアクセス（GORMクエリ）。internal/models のエンティティを読み書きする
        dto/                     # APIリクエスト/レスポンス専用の型（modelsのエンティティとは別）
        router/                  # repository→service→controllerを組み立ててルート登録する
        ...                      # 外部API連携等、上記4層に収まらないものは自由なサブパッケージにしてよい（例: ndl/, openbd/）
  ...
```

- `app/page.tsx`: ポータルトップ。`(features)/` 配下の各featureへの導線を表示する
- `app/(features)/<feature-slug>/`: featureごとに1つのポートフォリオアプリケーションを配置する。feature間の依存は持たせない
  - `(features)` はroute group（括弧付きフォルダ）とし、URLには `/features/` を出さない（例: `sample1` → `/sample1`）
  - feature専用のコンポーネント・ロジックは `_components/` `_lib/` 等のprivate folder（アンダースコア接頭辞）としてfeatureフォルダ内にcolocateし、ルーティングに含めない
- `components/ui/`: Tailwind CSS v4でスタイリングした共通UIコンポーネント（Button, Card等）を配置する。ポータルトップ・各featureはTailwindのユーティリティクラスを直接書くのではなく、原則としてここのコンポーネントを利用する。外部UIライブラリ（shadcn/ui等）は導入せず、自前のコンポーネントとして育てていく
- `server/`: Go APIを配置する独立したGoモジュール。Next.js側とは依存を持たない
  - `internal/features/<feature-slug>/`: featureごとのドメインロジックを配置する。Next.js側の`app/(features)/<feature-slug>/`とfeature-slugを揃え、どのAPIコードがどのfeatureに属すか分かるようにする。package名にハイフンは使えないため、`book-database` → `bookdatabase`のように詰めた名前にする
    - `controller` → `service` → `repository` の3層構成とする。`controller`はGinのHTTPハンドラ（リクエストの読み取りとレスポンス整形のみ）、`service`はビジネスロジック（複数repositoryの組み合わせ、トランザクション境界の管理）、`repository`はGORMによるDBアクセスに専念させる
    - `dto`はAPIリクエスト/レスポンス専用の型を置く。`internal/models`のDBエンティティ（GORM struct）とは別物とし、service層が両者を変換する
    - `router`はfeatureごとに`controller`/`service`/`repository`をコンストラクタで組み立て（DI）、ルートを登録する。`cmd/api/main.go`からはfeatureごとの`router.SetupXxxRoutes(...)`を呼ぶだけにする
    - 外部API連携（`ndl/`, `openbd/`等）のように上記4層に収まらないものは自由なサブパッケージとしてよい
  - `internal/models/`: 全featureで共有するDBエンティティ（GORM struct）を置く。テーブルと1対1対応させ、`TableName()`でテーブル名を明示する
  - 複数featureで共有する処理（GORMのDB接続等）は`internal/db/`のようにfeature非依存の場所に置く
  - `PORT` 環境変数をリッスンするGinサーバー。Railwayにデプロイする
  - Railway側の設定: Root Directoryを `server` に設定し、Build/Startコマンドを明示する（`main.go`が`cmd/api/`配下にありRailwayの自動検出が効かないため）
  - フロント（Vercel）とAPI（Railway）が別オリジンになるため、Go側でCORSを許可する（`ALLOWED_ORIGIN` 環境変数でフロントのオリジンを指定）
  - Next.js側はfeatureのServer Component・Client Componentともに `NEXT_PUBLIC_API_BASE_URL` 環境変数（例: `.env.example`）でGo APIのベースURLを参照する。VercelとRailwayはプライベートネットワークを共有しないため、SSR時のサーバー間通信もブラウザからの呼び出しも同じ公開URLを使う

## DBマイグレーション

- [golang-migrate](https://github.com/golang-migrate/migrate) を使用。SQLファイル（up/down）を `server/migrations/` に置く。GORMの`AutoMigrate`は使わない（本番でのスキーマ変更を明示的なSQL＋レビュー可能な差分にするため）
- `internal/models/` のGORM structは既存スキーマへのマッピング専用。struct定義を変更したときは対応するマイグレーションSQLも必ず追加する
- マイグレーションファイルは `server/migrations/migrations.go` の `go:embed` でバイナリに埋め込む。本番（Railway）でも別途CLIを用意する必要がなく、`server/cmd/migrate` を実行するだけで適用できる
- 実行方法:
  ```bash
  cd server
  DATABASE_URL="mysql://app:app@tcp(127.0.0.1:3306)/my_portal" go run ./cmd/migrate up   # 適用
  DATABASE_URL="mysql://app:app@tcp(127.0.0.1:3306)/my_portal" go run ./cmd/migrate down  # 直前のマイグレーションを取り消し
  ```
- 新しいマイグレーションを追加する場合は `server/migrations/` に連番のup/downファイルを追加する（例: `000002_xxx.up.sql` / `000002_xxx.down.sql`）
- テーブル名はfeature単位で `<feature-slug>_` のprefixを付ける（例: `book-database` featureのテーブルは `book_database_books` のように `book_database_` を付与）。単一のMySQLインスタンス・単一スキーマを複数featureで共有するため、feature間のテーブル名衝突を防ぐ

## 主要な設計判断

- feature一覧はコード内で静的に定義する（例: `features` 配列を1箇所で管理し、ポータルトップがそれを参照する）。ディレクトリの自動スキャンやCMS等の動的管理は行わない
- フロント（Vercel）とAPI（Railway）を別プラットフォームに分離する。単一プラットフォームに統一する構成（Vercel Services）よりも一般的な実務構成に近いことを優先
- DBアクセスはGo API経由のみとし、Next.js側から直接DBには接続しない

## ローカル開発

- MySQLは `docker-compose.yml` でコンテナ起動する（`docker compose up -d`）。ホストへのMySQLインストールは不要
- Next.js・Goはどちらもコンテナ化せず、ホスト上でネイティブ実行する（`npm run dev` / `go run ./cmd/api`）。コード変更のたびにイメージを再ビルドする必要がなく開発サイクルが速いため
- 接続情報（ユーザー: `app` / パスワード: `app` / DB名: `my_portal` / ポート: `3306`）は開発用の固定値。本番のRailway MySQLとは別物

