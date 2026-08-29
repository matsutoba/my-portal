import { Grid, PageContainer, PageHeader } from "@/components/ui";
import { FeatureCard } from "./_components/FeatureCard";
import { PortalStats } from "./_components/PortalStats";
import { features } from "./_lib/features";

export default function Home() {
  return (
    <PageContainer>
      <Grid columns={2}>
        {features.map((feature) => (
          <FeatureCard key={feature.slug} feature={feature} />
        ))}
      </Grid>
    </PageContainer>
  );
}
