import { Card, CardDescription, CardHeader, CardTitle, TechTag } from "@/components/ui";
import type { CareerMilestone } from "../../_lib/career";

export function CareerTimeline({ milestones }: { milestones: CareerMilestone[] }) {
  return (
    <div className="relative">
      <div className="absolute top-6 bottom-6 left-[15px] w-px bg-border" aria-hidden />
      <ol className="flex flex-col gap-8">
        {milestones.map((milestone) => (
          <li key={milestone.id} className="relative pl-9">
            <span className="absolute top-6 left-[9px] size-3 rounded-full bg-accent" aria-hidden />
            <Card>
              <span className="text-xs font-bold tracking-widest text-accent uppercase">{milestone.period}</span>
              <CardHeader>
                <CardTitle>{milestone.title}</CardTitle>
                <CardDescription>{milestone.description}</CardDescription>
              </CardHeader>
              {milestone.techStack ? (
                <div className="flex flex-wrap gap-1.5">
                  {milestone.techStack.map((tech) => (
                    <TechTag key={tech}>{tech}</TechTag>
                  ))}
                </div>
              ) : null}
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
