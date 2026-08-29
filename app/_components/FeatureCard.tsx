import { Badge, Button, Card, CardDescription, CardHeader, CardTitle, LinkButton } from "@/components/ui";
import { cn } from "@/components/ui/cn";
import type { Feature } from "../_lib/features";

export function FeatureCard({ feature }: { feature: Feature }) {
  const isAvailable = feature.status === "available";

  return (
    <Card highlighted={isAvailable}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-xs font-bold tracking-widest uppercase",
            isAvailable ? "text-accent" : "text-muted-foreground",
          )}
        >
          {feature.category}
        </span>
        <Badge variant={isAvailable ? "success" : "neutral"}>
          {isAvailable ? "ACTIVE" : "PENDING"}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle>{feature.name}</CardTitle>
        <CardDescription>{feature.description}</CardDescription>
      </CardHeader>
      {isAvailable ? (
        <LinkButton href={`/${feature.slug}`}>起動 →</LinkButton>
      ) : (
        <Button variant="primary" disabled>
          起動（準備中）
        </Button>
      )}
    </Card>
  );
}
