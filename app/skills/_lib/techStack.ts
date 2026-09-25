export type TechStackSection = {
  id: string;
  category: string;
  title: string;
  description: string;
  items: string[];
};

export const techStackSections: TechStackSection[] = [
  {
    id: "frontend",
    category: "FRONTEND",
    title: "フロントエンド",
    description:
      "Next.js App Router構成のポータル兼feature集。UIは外部ライブラリに頼らず、Tailwind CSSベースの自前コンポーネントとして育てています。",
    items: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS v4", "TanStack Query", "Recharts", "Zod"],
  },
  {
    id: "backend",
    category: "BACKEND / API",
    title: "API サーバー",
    description:
      "GinでHTTPルーティングし、GORMでMySQLにアクセスするcontroller→service→repositoryの3層構成。featureごとにドメインロジックを分離しています。",
    items: ["Go", "Gin", "GORM", "golang-migrate"],
  },
  {
    id: "database",
    category: "DATABASE",
    title: "データベース",
    description: "MySQLをDockerコンテナで運用。コンテナ外には公開せず、Go API経由でのみアクセスします。",
    items: ["MySQL"],
  },
  {
    id: "ci",
    category: "CI/CD",
    title: "継続的インテグレーション",
    description:
      "GitHub Actionsでmainブランチへのpush・PRごとにNext.js側・Go側それぞれのlint/build/testを自動実行しています。",
    items: ["GitHub Actions", "ESLint", "go vet", "go test"],
  },
  {
    id: "infra",
    category: "INFRASTRUCTURE",
    title: "インフラ / デプロイ",
    description:
      "AWS Lightsail Instance（VPS）1台の上で、Next.js・Go API・MySQL・リバースプロキシをDocker Composeでまとめて動かしています。マネージドサービスに分散させるより、VPS運用そのものを経験することを優先した構成です。",
    items: ["AWS Lightsail", "Docker Compose", "Caddy", "Let's Encrypt"],
  },
];

export const designNotes: string[] = [
  "feature一覧はコード内で静的に定義し、ディレクトリの自動スキャンやCMS等の動的管理は行わない",
  "DBマイグレーションはgolang-migrateで明示的なSQLとして管理し、GORMのAutoMigrateは使わない",
  "DBアクセスはGo API経由のみとし、Next.js側から直接DBには接続しない",
  "公開デモの書き込みエンドポイントは READ_ONLY モードで丸ごと止められるようにしてある",
];
