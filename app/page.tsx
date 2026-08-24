import { Grid, PageContainer, PageHeader } from "@/components/ui";
import { FeatureCard } from "./_components/FeatureCard";
import { features } from "./_lib/features";

export default function Home() {
  return (
    <PageContainer>
      <PageHeader
        title="My Portal"
        description="ポートフォリオアプリケーションの一覧です。"
      />
      <Grid columns={3}>
        {features.map((feature) => (
          <FeatureCard key={feature.slug} feature={feature} />
        ))}
      </Grid>
    </PageContainer>
  );
}
