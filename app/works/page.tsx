import type { Metadata } from "next";
import { Grid, PageContainer, PageHeader } from "@/components/ui";
import { CaseStudyCard } from "../_components/CaseStudyCard";
import { FeatureCard } from "../_components/FeatureCard";
import { features } from "../_lib/features";
import { caseStudies } from "../_lib/works";

export const metadata: Metadata = {
  title: "Works | Code Beaver",
  description: "実務案件の事例と、このポートフォリオサイトで公開しているデモアプリケーションの一覧です。",
};

export default function WorksPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Works"
        description="実務案件の事例と、このサイト上で実際に動くデモアプリケーション（feature）の一覧です。"
      />

      <section className="flex flex-col gap-6">
        <PageHeader
          title="実務案件"
          description="業務委託として携わった案件の一部です（守秘義務の範囲で匿名化しています）。"
          size="sm"
        />
        <Grid columns={2}>
          {caseStudies.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
          ))}
        </Grid>
      </section>

      <section className="flex flex-col gap-6">
        <PageHeader
          title="デモアプリ"
          description="このポートフォリオサイト上で実際に起動・閲覧できるアプリケーションです。"
          size="sm"
        />
        <Grid columns={2}>
          {features.map((feature) => (
            <FeatureCard key={feature.slug} feature={feature} />
          ))}
        </Grid>
      </section>
    </PageContainer>
  );
}
