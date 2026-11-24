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

  it("provides alias resolution for aliases", () => {
    expect(findPage("limitations-applications")).toBeGreaterThan(0);
    expect(findPage("cluster-selection")).toBeGreaterThan(0);
    expect(findPage("profiling-stability")).toBeGreaterThan(0);
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
    expect(metrics.sections.length).toBe(8);
    expect(metrics.sections.map((s) => s.title)).toContain(
      "Metric Space Axioms & Mathematical Foundations",
    );
    expect(metrics.sections.map((s) => s.title)).toContain("Euclidean Distance (L₂ Norm)");
    expect(metrics.sections.map((s) => s.title)).toContain("Manhattan Distance (L₁ Norm)");
    expect(metrics.sections.map((s) => s.title)).toContain("Minkowski Distance & Chebyshev Limit");
    expect(metrics.sections.map((s) => s.title)).toContain(
      "Cosine Similarity and Angular Distance",
    );
    expect(metrics.sections.map((s) => s.title)).toContain(
      "Mahalanobis Distance & Feature Covariance",
    );
    expect(metrics.sections.map((s) => s.title)).toContain(
      "Curse of Dimensionality & Distance Concentration",
    );
    expect(metrics.sections.map((s) => s.title)).toContain("Knowledge Check & Self-Assessment");

    // Page 9: Dendrograms
    const dendrograms = pages.find((p) => p.slug === "dendrograms")!;
    expect(dendrograms.sections.length).toBe(7);
    expect(dendrograms.sections.map((s) => s.title)).toContain("Dendrogram Structure");
    expect(dendrograms.sections.map((s) => s.title)).toContain("How Dendrograms are Constructed");
    expect(dendrograms.sections.map((s) => s.title)).toContain(
      "Ultrametric Space & Mathematical Properties",
    );
    expect(dendrograms.sections.map((s) => s.title)).toContain(
      "Cophenetic Distance & Correlation (CCC)",
    );
    expect(dendrograms.sections.map((s) => s.title)).toContain(
      "Cutting a Dendrogram & Cluster Extraction",
    );
    expect(dendrograms.sections.map((s) => s.title)).toContain("Interactive Dendrogram Workspace");
    expect(dendrograms.sections.map((s) => s.title)).toContain("Knowledge Check & Self-Assessment");

    // Page 10: Mathematics
    const mathPage = pages.find((p) => p.slug === "mathematics")!;
    expect(mathPage.sections.length).toBe(8);
    expect(mathPage.sections.map((s) => s.title)).toContain("Mathematical Representation of Data");
    expect(mathPage.sections.map((s) => s.title)).toContain(
      "Distance and Dissimilarity Foundations",
    );
    expect(mathPage.sections.map((s) => s.title)).toContain(
      "Cluster Centroids and Within-Cluster Variation",
    );
    expect(mathPage.sections.map((s) => s.title)).toContain("Ward's Minimum Variance Criterion");
    expect(mathPage.sections.map((s) => s.title)).toContain("Lance–Williams Recurrence");
    expect(mathPage.sections.map((s) => s.title)).toContain("Computational Complexity");
    expect(mathPage.sections.map((s) => s.title)).toContain("Interactive Mathematical Playground");
    expect(mathPage.sections.map((s) => s.title)).toContain("Knowledge Check & Self-Assessment");

    // Page 11: Implementation
    const impl = pages.find((p) => p.slug === "implementation")!;
    expect(impl.sections.length).toBe(8);
    expect(impl.sections.map((s) => s.title)).toContain(
      "Python Environment & Ecosystem Architecture",
    );
    expect(impl.sections.map((s) => s.title)).toContain(
      "Implementing Agglomerative Clustering from Scratch with NumPy",
    );
    expect(impl.sections.map((s) => s.title)).toContain(
      "Hierarchical Clustering in SciPy (scipy.cluster.hierarchy)",
    );
    expect(impl.sections.map((s) => s.title)).toContain(
      "Hierarchical Clustering in Scikit-learn (AgglomerativeClustering)",
    );
    expect(impl.sections.map((s) => s.title)).toContain(
      "SciPy vs. Scikit-learn: Architectural Comparison",
    );
    expect(impl.sections.map((s) => s.title)).toContain("End-to-End Practical Clustering Project");
    expect(impl.sections.map((s) => s.title)).toContain("Interactive Implementation Explorer");
    expect(impl.sections.map((s) => s.title)).toContain("Knowledge Check & Self-Assessment");

    // Page 12: Model Evaluation
    const evalPage = pages.find((p) => p.slug === "evaluation")!;
    expect(evalPage.sections.length).toBe(6);
    expect(evalPage.sections.map((s) => s.title)).toContain("Why Cluster Evaluation Matters");
    expect(evalPage.sections.map((s) => s.title)).toContain("Internal Validation Metrics");
    expect(evalPage.sections.map((s) => s.title)).toContain("External Validation Metrics");
    expect(evalPage.sections.map((s) => s.title)).toContain(
      "Relative Validation & Multi-Linkage Benchmarking",
    );
    expect(evalPage.sections.map((s) => s.title)).toContain(
      "Interactive Cluster Evaluation Playground",
    );
    expect(evalPage.sections.map((s) => s.title)).toContain("Knowledge Check & Self-Assessment");

    // Page 13: Optimal Cluster Selection (slug: "comparison")
    const selectionPage = pages.find((p) => p.slug === "comparison")!;
    expect(selectionPage.sections.length).toBe(6);
    expect(selectionPage.sections.map((s) => s.title)).toContain("The Cluster Selection Problem");
    expect(selectionPage.sections.map((s) => s.title)).toContain(
      "Dendrogram-Based Selection & Merge-Height Gaps",
    );
    expect(selectionPage.sections.map((s) => s.title)).toContain(
      "The Inconsistency Coefficient in SciPy",
    );
    expect(selectionPage.sections.map((s) => s.title)).toContain(
      "Silhouette Sweeps & Multi-Criterion Selection",
    );
    expect(selectionPage.sections.map((s) => s.title)).toContain(
      "Interactive Dendrogram Cutting Laboratory",
    );
    expect(selectionPage.sections.map((s) => s.title)).toContain(
      "Knowledge Check & Self-Assessment",
    );

    // Page 14: Cluster Profiling & Stability (slug: "limitations")
    const profilingPage = pages.find((p) => p.slug === "limitations")!;
    expect(profilingPage.sections.length).toBe(7);
    expect(profilingPage.sections.map((s) => s.title)).toContain("Understanding Cluster Profiles");
    expect(profilingPage.sections.map((s) => s.title)).toContain("Visualizing Cluster Profiles");
    expect(profilingPage.sections.map((s) => s.title)).toContain(
      "Cluster Stability & Resampling Analysis",
    );
    expect(profilingPage.sections.map((s) => s.title)).toContain(
      "Cophenetic Structure vs. Cluster Reliability",
    );
    expect(profilingPage.sections.map((s) => s.title)).toContain(
      "Outliers, Noise, and Chain Reactions",
    );
    expect(profilingPage.sections.map((s) => s.title)).toContain(
      "Interactive Cluster Interpretation Laboratory",
    );
    expect(profilingPage.sections.map((s) => s.title)).toContain(
      "Knowledge Check & Self-Assessment",
    );
  });
});
