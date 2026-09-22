import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, Grid, PageContainer, PageHeader } from "@/components/ui";
import { TechStackSectionCard } from "./_components/TechStackSectionCard";
import { designNotes, techStackSections } from "./_lib/sections";

export const metadata: Metadata = {
  title: "Technology Stack | My Portal",
  description: "このポートフォリオサイトで使用している技術スタック、CI構成、デプロイ環境の一覧です。",
};

export default function TechStackPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Technology Stack"
        description="このポートフォリオサイト自体（ポータル・各feature共通の基盤）で使用している技術スタック、CI構成、デプロイ環境をまとめています。"
      />
      <Grid columns={1}>
        {techStackSections.map((section) => (
          <TechStackSectionCard key={section.id} section={section} />
        ))}
      </Grid>
      <Card>
        <CardHeader>
          <CardTitle>設計上のポイント</CardTitle>
        </CardHeader>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          {designNotes.map((note) => (
            <li key={note} className="flex gap-2">
              <span className="text-accent" aria-hidden>
                —
              </span>
              {note}
            </li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  );
}
