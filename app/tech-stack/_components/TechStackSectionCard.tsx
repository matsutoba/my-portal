import { Card, CardDescription, CardHeader, CardTitle, TechTag } from "@/components/ui";
import type { TechStackSection } from "../_lib/sections";

export function TechStackSectionCard({ section }: { section: TechStackSection }) {
  return (
    <Card>
      <span className="text-xs font-bold tracking-widest text-accent uppercase">
        {section.category}
      </span>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      <div className="flex flex-wrap gap-1.5">
        {section.items.map((item) => (
          <TechTag key={item}>{item}</TechTag>
        ))}
      </div>
    </Card>
  );
}
