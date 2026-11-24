import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { pages, findPage, groups } from "@/lib/course";

describe("App routing and Course Structure", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it("matches root route / without falling back to root error", () => {
    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("contains all 15 required learning modules plus Overview", () => {
    expect(pages.length).toBeGreaterThanOrEqual(16);
    expect(pages[0].slug).toBe("");
    expect(pages[0].title).toBe("Overview");
  });

  const expectedSlugs = [
    "introduction",
    "fundamentals",
    "types",
    "agglomerative",
    "divisive",
    "linkage",
    "distance-metrics",
    "dendrograms",
    "mathematics",
    "implementation",
    "evaluation",
    "comparison",
    "limitations",
    "applications",
    "projects",
  ];

  it.each(expectedSlugs)("matches route for /$slug where slug is %s", (slug) => {
    const matches = router.matchRoutes(`/${slug}`);
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(findPage(slug)).toBeGreaterThan(0);
  });

  it("provides alias resolution for limitations-applications", () => {
    expect(findPage("limitations-applications")).toBeGreaterThan(0);
  });

  it("organizes modules into 4 logical curricular stages", () => {
    expect(groups).toEqual([
      "Getting Started",
      "Core Algorithms",
      "Theory & Practice",
      "Applied Learning",
    ]);
  });

  it("verifies required structural sections exist across core modules", () => {
    // Page 2: Introduction
    const intro = pages.find((p) => p.slug === "introduction")!;
    expect(intro.sections.map((s) => s.title)).toEqual([
      "Introduction",
      "What is Clustering?",
      "What is Hierarchical Clustering?",
      "Applications",
      "Key Concepts",
    ]);

    // Page 3: Fundamentals
    const fund = pages.find((p) => p.slug === "fundamentals")!;
    expect(fund.sections.map((s) => s.title)).toEqual([
      "Hierarchical Structure",
      "Distance Between Data Points",
      "Distance Between Clusters",
      "Linkage Criteria",
      "Dendrogram Fundamentals",
    ]);

    // Page 5: Agglomerative
    const agg = pages.find((p) => p.slug === "agglomerative")!;
    expect(agg.sections.map((s) => s.title)).toContain("Working Mechanism");
    expect(agg.sections.map((s) => s.title)).toContain("Stopping Criteria");

    // Page 7: Linkage methods
    const linkage = pages.find((p) => p.slug === "linkage")!;
    expect(linkage.sections.length).toBe(8);
    expect(linkage.sections.map((s) => s.title)).toContain("Single Linkage");
    expect(linkage.sections.map((s) => s.title)).toContain("Complete Linkage");
    expect(linkage.sections.map((s) => s.title)).toContain("Average Linkage (UPGMA)");
    expect(linkage.sections.map((s) => s.title)).toContain("Centroid Linkage (UPGMC)");
    expect(linkage.sections.map((s) => s.title)).toContain("Ward's Minimum Variance Linkage");
    expect(linkage.sections.map((s) => s.title)).toContain("Generalized Lance–Williams Recurrence");
    expect(linkage.sections.map((s) => s.title)).toContain("Monotonicity and Inversions");
    expect(linkage.sections.map((s) => s.title)).toContain("Knowledge Check & Self-Assessment");

    // Page 8: Distance metrics
    const metrics = pages.find((p) => p.slug === "distance-metrics")!;
    expect(metrics.sections.length).toBe(4);

    // Page 11: Implementation
    const impl = pages.find((p) => p.slug === "implementation")!;
    expect(impl.sections.length).toBe(3);

    // Page 12: Model Evaluation
    const evalPage = pages.find((p) => p.slug === "evaluation")!;
    expect(evalPage.sections.length).toBe(3);
  });
});
