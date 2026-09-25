import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, Grid, PageContainer, PageHeader, TechTag } from "@/components/ui";
import { currentFocus, foundationSkills, supportedWork } from "../_lib/profile";
import { TechStackSectionCard } from "./_components/TechStackSectionCard";
import { designNotes, techStackSections } from "./_lib/techStack";

export const metadata: Metadata = {
  title: "Skills | Code Beaver",
  description: "React / TypeScriptを中心としたフロントエンド開発の専門性と、SI企業で培った技術的基盤をまとめています。",
};

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <TechTag key={item}>{item}</TechTag>
      ))}
    </div>
  );
}

export default function SkillsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Skills"
        description="現在の専門領域と、SI企業時代から培ってきた技術的基盤をまとめています。"
      />

      <Grid columns={3}>
        <Card>
          <CardHeader>
            <CardTitle>現在の専門領域</CardTitle>
          </CardHeader>
          <TagList items={currentFocus} />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>技術的基盤</CardTitle>
          </CardHeader>
          <TagList items={foundationSkills} />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>対応できる業務</CardTitle>
          </CardHeader>
          <TagList items={supportedWork} />
        </Card>
      </Grid>

      <section className="flex flex-col gap-6">
        <PageHeader
          title="このポートフォリオサイト自体の技術構成"
          description="このサイト（ポータル・各feature共通の基盤）で使用している技術スタック、CI構成、デプロイ環境です。"
          size="sm"
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
      </section>
    </PageContainer>
  );
}
