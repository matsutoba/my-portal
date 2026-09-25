import { Card, CardDescription, CardHeader, CardTitle, TechTag } from "@/components/ui";
import type { CaseStudy } from "../_lib/works";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Card>
      <span className="text-xs font-bold tracking-widest text-accent uppercase">{caseStudy.period}</span>
      <CardHeader>
        <CardTitle>{caseStudy.title}</CardTitle>
        <CardDescription>{caseStudy.overview}</CardDescription>
      </CardHeader>
      <dl className="flex flex-col gap-3 text-sm">
        <div>
          <dt className="font-semibold text-foreground">役割</dt>
          <dd className="text-muted-foreground">{caseStudy.role}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">課題</dt>
          <dd className="text-muted-foreground">{caseStudy.challenge}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">結果</dt>
          <dd className="text-muted-foreground">{caseStudy.result}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-1.5">
        {caseStudy.techStack.map((tech) => (
          <TechTag key={tech}>{tech}</TechTag>
        ))}
      </div>
    </Card>
  );
}
