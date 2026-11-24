import { createFileRoute, notFound } from "@tanstack/react-router";
import { findPage, pages } from "@/lib/course";
import { PageShell } from "@/components/lab/page-shell";
import { ContentCard, SectionHeader, ContentPlaceholder, CodeBlock } from "@/components/lab/blocks";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const index = findPage(params.slug);
    if (index < 1) throw notFound();
    return { index };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? pages[loaderData.index] : undefined;
    const title = p ? `${p.title} · Hierarchical Clustering Lab` : "Unavailable · Hierarchical Clustering Lab";
    const description = p ? `${p.title} module of the Hierarchical Clustering Lab machine learning series.` : "Page not found.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }] };
  },
  component: ModulePage,
});

function ModulePage() {
  const { index } = Route.useLoaderData();
  return (
    <PageShell index={index}>
      {pages[index]!.slug === "projects" && (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <ContentCard key={n}>
              <SectionHeader index={n} title="[Project Title Placeholder]" />
              <div className="space-y-4">
                {["Dataset", "Problem statement", "Techniques used"].map((l) => <ContentPlaceholder key={l} label={l} />)}
                <CodeBlock label="Implementation" />
                <ContentPlaceholder label="Expected outcome" />
              </div>
            </ContentCard>
          ))}
        </div>
      )}
    </PageShell>
  );
}
