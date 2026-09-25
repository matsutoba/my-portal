export type CaseStudy = {
  id: string;
  period: string;
  title: string;
  role: string;
  overview: string;
  challenge: string;
  techStack: string[];
  result: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "vaccination-reservation",
    period: "2018年7月 – 2019年12月",
    title: "自治体向け予防接種予約システム",
    role: "開発リーダー支援（要件定義・アーキテクチャ・受入テスト）",
    overview:
      "SI企業に在籍していた時代から関わってきた自治体向け予防接種予約システムに、フリーランス転向後も継続して参画。オフショア13名・東京2名の大規模体制で開発を進めました。",
    challenge: "拠点をまたぐ大規模チームで、設計と品質の一貫性をどう担保するかが課題でした。",
    techStack: ["C#", "JavaScript", "React", "Azure", "SQL Server"],
    result:
      "要件定義支援からアーキテクチャ設計・受入テストまでを一貫して主導し、大規模かつ拠点分散した体制でのプロジェクト稼働を実現しました。",
  },
  {
    id: "childcare-support-app",
    period: "2020年1月 – 2021年3月",
    title: "自治体向け子育て支援アプリ 新規開発",
    role: "開発リーダー（要件定義・設計・開発）",
    overview:
      "自治体向け子育て支援アプリをゼロから新規開発するプロジェクトに、開発リーダーとしてフルリモートで参画しました。",
    challenge: "少人数チームで、要件定義からリリースまでを短期間で立ち上げる必要がありました。",
    techStack: ["C#", "TypeScript", "React", "Azure", "HTML5", "CSS3", "SQL Server"],
    result: "要件定義から設計・開発までを一貫してリードし、フルリモート体制での新規システム立ち上げを実現しました。",
  },
  {
    id: "seminar-cms",
    period: "2021年4月 – 2021年8月",
    title: "セミナー管理／セミナー募集ページ作成CMS",
    role: "フロントエンドエンジニア（設計・開発・テスト、Google Cloud環境対応）",
    overview: "セミナー管理およびセミナー募集ページ作成CMSの開発を、フルリモートで担当しました。",
    challenge: "管理画面と募集ページ両方のフロントエンドを、Google Cloud環境と連携させながら短期間で実装する必要がありました。",
    techStack: ["TypeScript", "React", "Google Cloud"],
    result: "設計・開発・テストを一貫して担当し、約5ヶ月という短期間でのCMSリリースを実現しました。",
  },
  {
    id: "talent-management-frontend",
    period: "2021年9月 – 継続中",
    title: "タレントマネジメントシステムのフロントエンド開発",
    role: "フロントエンドエンジニア（仕様・デザインレビュー、実装）",
    overview:
      "企業向けタレントマネジメントシステムの開発チームの一員として、フルリモートでフロントエンド開発を継続的に担当しています。",
    challenge:
      "PdM・デザイナーが作成した仕様やデザインを開発チームの立場からレビューし、保守しやすいUIコンポーネントとして実装に落とし込む必要がありました。",
    techStack: ["TypeScript", "React", "HTML5", "CSS3"],
    result: "4年以上にわたり仕様・デザインレビューと実装を継続的に担当し、機能追加・保守を安定的に提供しています。",
  },
];
