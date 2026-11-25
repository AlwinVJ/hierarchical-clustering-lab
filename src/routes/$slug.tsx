import { createFileRoute, notFound } from "@tanstack/react-router";
import { findPage, pages } from "@/lib/course";
import { PageShell } from "@/components/lab/page-shell";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const index = findPage(params.slug);
    if (index < 1) throw notFound();
    return { index };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? pages[loaderData.index] : undefined;
    const title = p
      ? `${p.title} · Hierarchical Clustering Lab`
      : "Unavailable · Hierarchical Clustering Lab";
    const description = p
      ? `${p.title} module of the Hierarchical Clustering Lab machine learning series.`
      : "Page not found.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ModulePage,
});

function ModulePage() {
  const { index } = Route.useLoaderData();

  return <PageShell index={index} />;
}
