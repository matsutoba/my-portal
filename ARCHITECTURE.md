# Architecture

## 技術スタック

- フロントエンド: Next.js 16 (App Router) / TypeScript / React 19 / Tailwind CSS v4
- API: Go
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
  ...
```

- `app/page.tsx`: ポータルトップ。`(features)/` 配下の各featureへの導線を表示する
- `app/(features)/<feature-slug>/`: featureごとに1つのポートフォリオアプリケーションを配置する。feature間の依存は持たせない
  - `(features)` はroute group（括弧付きフォルダ）とし、URLには `/features/` を出さない（例: `sample1` → `/sample1`）
  - feature専用のコンポーネント・ロジックは `_components/` `_lib/` 等のprivate folder（アンダースコア接頭辞）としてfeatureフォルダ内にcolocateし、ルーティングに含めない
- `components/ui/`: Tailwind CSS v4でスタイリングした共通UIコンポーネント（Button, Card等）を配置する。ポータルトップ・各featureはTailwindのユーティリティクラスを直接書くのではなく、原則としてここのコンポーネントを利用する。外部UIライブラリ（shadcn/ui等）は導入せず、自前のコンポーネントとして育てていく
- `server/`: Go APIを配置する独立したGoモジュール。Next.js側とは依存を持たない
  - `PORT` 環境変数をリッスンする通常の`net/http`サーバー。Railwayにデプロイする
  - Railway側の設定: Root Directoryを `server` に設定し、Build/Startコマンドを明示する（`main.go`が`cmd/api/`配下にありRailwayの自動検出が効かないため）
  - フロント（Vercel）とAPI（Railway）が別オリジンになるため、Go側でCORSを許可する（`ALLOWED_ORIGIN` 環境変数でフロントのオリジンを指定）

## 主要な設計判断

- feature一覧はコード内で静的に定義する（例: `features` 配列を1箇所で管理し、ポータルトップがそれを参照する）。ディレクトリの自動スキャンやCMS等の動的管理は行わない
- フロント（Vercel）とAPI（Railway）を別プラットフォームに分離する。単一プラットフォームに統一する構成（Vercel Services）よりも一般的な実務構成に近いことを優先
- DBアクセスはGo API経由のみとし、Next.js側から直接DBには接続しない

## ローカル開発

- MySQLは `docker-compose.yml` でコンテナ起動する（`docker compose up -d`）。ホストへのMySQLインストールは不要
- Next.js・Goはどちらもコンテナ化せず、ホスト上でネイティブ実行する（`npm run dev` / `go run ./cmd/api`）。コード変更のたびにイメージを再ビルドする必要がなく開発サイクルが速いため
- 接続情報（ユーザー: `app` / パスワード: `app` / DB名: `my_portal` / ポート: `3306`）は開発用の固定値。本番のRailway MySQLとは別物

