import { Button, Card, CardDescription, CardHeader, CardTitle, LinkButton } from "@/components/ui";
import type { Feature } from "../_lib/features";

export function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{feature.name}</CardTitle>
        <CardDescription>{feature.description}</CardDescription>
      </CardHeader>
      {feature.status === "available" ? (
        <LinkButton href={`/${feature.slug}`}>起動</LinkButton>
      ) : (
        <Button variant="secondary" disabled>
          起動（準備中）
        </Button>
      )}
    </Card>
  );
}
