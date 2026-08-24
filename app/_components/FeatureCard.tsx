import { Button, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { Feature } from "../_lib/features";

export function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{feature.name}</CardTitle>
        <CardDescription>{feature.description}</CardDescription>
      </CardHeader>
      <Button variant="secondary" disabled>
        起動（準備中）
      </Button>
    </Card>
  );
}
