import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { pages, groups } from "@/lib/course";
import { PageShell } from "@/components/lab/page-shell";
import { ContentCard, SectionHeader, ContentPlaceholder, NoteBox } from "@/components/lab/blocks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hierarchical Clustering Lab — Overview" },
      { name: "description", content: "A structured learning lab for hierarchical clustering in machine learning: algorithms, linkage, dendrograms, and practice." },
      { property: "og:title", content: "Hierarchical Clustering Lab — Overview" },
      { property: "og:description", content: "A structured learning lab for hierarchical clustering in machine learning." },
    ],
  }),
  component: Overview,
});

function Overview() {
  return (
    <PageShell index={0}>
      <ContentCard>
        <SectionHeader index={1} title="Introduction" />
        <ContentPlaceholder />
        <Link to="/$slug" params={{ slug: "introduction" }} className="mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-deep">
          Start Learning <ArrowRight className="h-4 w-4" />
        </Link>
      </ContentCard>
      <ContentCard>
        <SectionHeader index={2} title="Learning Objectives" />
        <ul className="space-y-2">{[1, 2, 3, 4].map((n) => <li key={n} className="flex gap-3 text-sm"><span className="font-mono text-lavender">0{n}</span><span className="font-mono text-xs text-primary">[CONTENT PLACEHOLDER]</span></li>)}</ul>
      </ContentCard>
      <ContentCard>
        <SectionHeader index={3} title="Course Overview" />
        <ContentPlaceholder /><div className="mt-4"><NoteBox /></div>
      </ContentCard>
      <ContentCard>
        <SectionHeader index={4} title="Learning Roadmap" />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, i) => (
            <li key={g} className="rounded-sm border border-border p-3">
              <p className="font-mono text-xs text-lavender">Stage {i + 1}</p>
              <p className="font-semibold text-foreground">{g}</p>
              <p className="mt-1 text-xs text-muted-foreground">{pages.filter((p) => p.group === g).length} modules</p>
            </li>
          ))}
        </ol>
      </ContentCard>
      <ContentCard>
        <SectionHeader index={5} title="Topic Index" />
        <div className="grid gap-x-6 sm:grid-cols-2">
          {pages.slice(1).map((p, i) => (
            <Link key={p.slug} to="/$slug" params={{ slug: p.slug }} className="flex items-center gap-3 border-b border-border py-2 text-sm text-foreground hover:text-primary">
              <span className="w-6 font-mono text-xs text-lavender">{String(i + 2).padStart(2, "0")}</span>
              <p.icon className="h-4 w-4 text-lavender" />{p.title}
            </Link>
          ))}
        </div>
      </ContentCard>
    </PageShell>
  );
}
