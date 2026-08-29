export type Feature = {
  slug: string;
  name: string;
  description: string;
  status: "available" | "coming-soon";
};

export const features: Feature[] = [
  {
    slug: "book-database",
    name: "書籍データベース",
    description: "国立国会図書館サーチ・openBDから収集したIT関連書籍の一覧です。",
    status: "available",
  },
  {
    slug: "feature-a",
    name: "Feature A",
    description: "準備中のポートフォリオアプリです。",
    status: "coming-soon",
  },
  {
    slug: "feature-b",
    name: "Feature B",
    description: "準備中のポートフォリオアプリです。",
    status: "coming-soon",
  },
  {
    slug: "feature-c",
    name: "Feature C",
    description: "準備中のポートフォリオアプリです。",
    status: "coming-soon",
  },
];
