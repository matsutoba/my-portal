import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, PageContainer, PageHeader } from "@/components/ui";
import { careerMilestones, personalInterests } from "../_lib/career";
import { CareerTimeline } from "./_components/CareerTimeline";

export const metadata: Metadata = {
  title: "Profile | Code Beaver",
  description: "SI企業でのバックエンド開発からフリーランスのフロントエンドエンジニアへ。これまでの経歴と人となりをまとめています。",
};

export default function ProfilePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Profile"
        description="SI企業でのバックエンド開発を経て、フリーランスとしてReact / TypeScriptを中心としたフロントエンド開発に携わっています。"
      />
      <CareerTimeline milestones={careerMilestones} />

      <Card>
        <CardHeader>
          <CardTitle>プライベート</CardTitle>
        </CardHeader>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          {personalInterests.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-accent" aria-hidden>
                —
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  );
}
