import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Layers, CheckCircle2, Milestone } from "lucide-react";
import { pages, groups } from "@/lib/course";
import { PageShell } from "@/components/lab/page-shell";
import {
  ContentCard,
  SectionHeader,
  ContentPlaceholder,
  NoteBox,
  PlaceholderTag,
} from "@/components/lab/blocks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hierarchical Clustering Lab — Overview" },
      {
        name: "description",
        content:
          "A structured educational learning laboratory for hierarchical clustering in machine learning: algorithms, linkage criteria, dendrograms, mathematical formulations, and practice.",
      },
      { property: "og:title", content: "Hierarchical Clustering Lab — Overview" },
      {
        property: "og:description",
        content:
          "Academic laboratory dedicated to mastering Agglomerative and Divisive hierarchical clustering.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const learningModules = pages.slice(1);

  return (
    <PageShell index={0}>
      {/* 1. Introduction & Start Learning Button */}
      <ContentCard>
        <SectionHeader index={1} title="Laboratory Overview & Scope" />
        <div className="space-y-4">
          <ContentPlaceholder label="Brief Series Introduction" />
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/$slug"
              params={{ slug: "introduction" }}
              className="inline-flex items-center gap-2 rounded-sm bg-navy px-5 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-primary-foreground hover:bg-deep transition-colors shadow-none"
            >
              <span>Start Learning</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-xs font-mono text-muted-foreground">
              Module 01: Introduction to Hierarchical Clustering
            </span>
          </div>
        </div>
      </ContentCard>

      {/* 2. Learning Objectives */}
      <ContentCard>
        <SectionHeader index={2} title="Learning Objectives" />
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-mono">
            Upon completing this comprehensive learning series, students and practitioners will
            achieve:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Formal understanding of Agglomerative and Divisive clustering mechanics and distance formulations.",
              "Mathematical mastery of Lance-Williams recurrence updates across all major linkage criteria.",
              "Complete proficiency in constructing, cutting, and interpreting dendrogram topologies.",
              "Hands-on ability to implement algorithms from scratch in NumPy and evaluate using internal metrics.",
            ].map((_, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-sm border border-border bg-secondary/30 p-3.5"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-teal/10 text-teal text-xs font-mono font-bold">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <PlaceholderTag variant="content">[CONTENT PLACEHOLDER]</PlaceholderTag>
                  <p className="text-xs text-muted-foreground">
                    Objective {idx + 1} statement placeholder.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContentCard>

      {/* 3. Course / Module Overview */}
      <ContentCard>
        <SectionHeader index={3} title="Course & Curriculum Overview" />
        <div className="space-y-4">
          <ContentPlaceholder label="Curricular Philosophy & Academic Structure" />
          <NoteBox title="Prerequisites & Academic Target">
            <span>
              Targeted at machine learning students, data scientists, and researchers. Foundational
              familiarity with basic linear algebra, Euclidean norms, and basic Python is helpful
              but all mechanics are derived from first principles.
            </span>
          </NoteBox>
        </div>
      </ContentCard>

      {/* 4. Learning Roadmap */}
      <ContentCard>
        <SectionHeader index={4} title="Four-Stage Learning Roadmap" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((groupName, idx) => {
            const count = pages.filter((p) => p.group === groupName).length;
            return (
              <div
                key={groupName}
                className="flex flex-col justify-between rounded-sm border border-border bg-secondary/20 p-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span className="text-teal font-semibold">STAGE 0{idx + 1}</span>
                    <span>
                      {count} {count === 1 ? "Module" : "Modules"}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-foreground">{groupName}</h3>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60">
                  <PlaceholderTag variant="content">[CONTENT PLACEHOLDER]</PlaceholderTag>
                </div>
              </div>
            );
          })}
        </div>
      </ContentCard>

      {/* 5. Topic Navigation Cards / Structured Topic Index */}
      <ContentCard>
        <SectionHeader index={5} title="Structured Topic Index" />
        <div className="grid gap-2.5 sm:grid-cols-2">
          {learningModules.map((page, idx) => {
            const Icon = page.icon;
            return (
              <Link
                key={page.slug}
                to="/$slug"
                params={{ slug: page.slug }}
                className="group flex items-start gap-3 rounded-sm border border-border bg-secondary/10 p-3 hover:border-navy hover:bg-secondary/40 transition-all"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-background border border-border text-teal group-hover:text-navy transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      MODULE {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-border">·</span>
                    <span className="text-[10px] text-muted-foreground font-mono truncate">
                      {page.group}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-bold text-foreground group-hover:text-navy transition-colors truncate">
                    {page.title}
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-navy group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </Link>
            );
          })}
        </div>
      </ContentCard>
    </PageShell>
  );
}
