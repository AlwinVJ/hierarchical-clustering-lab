import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  SectionHeader,
  ContentPlaceholder,
  FormulaBox,
  CodeBlock,
  DiagramPlaceholder,
  VizPlaceholder,
  NoteBox,
  ComparisonTable,
} from "@/components/lab/blocks";
import { ParadigmComparisonVisualizer, Module03Quiz } from "@/content/module03-types";
import { AgglomerativeSimulator, Module04Quiz } from "@/content/module04-agglomerative";
import { DianaSimulator, Module05Quiz } from "@/content/module05-divisive";
import {
  SingleLinkageChainingVisualizer,
  CentroidLinkageInversionVisualizer,
  WardVarianceIncreaseCalculator,
  LanceWilliamsExplorer,
  Module06Quiz,
} from "@/content/module06-linkage";

describe("Reusable Lab Components", () => {
  it("renders SectionHeader with section index and title", () => {
    const html = renderToString(<SectionHeader index={2} title="Linkage Criteria" />);
    expect(html).toContain("SECTION 02");
    expect(html).toContain("Linkage Criteria");
  });

  it("renders ContentPlaceholder with explicit placeholder badge", () => {
    const html = renderToString(<ContentPlaceholder label="Theory Overview" />);
    expect(html).toContain("Theory Overview");
    expect(html).toContain("[CONTENT PLACEHOLDER]");
  });

  it("renders FormulaBox with mathematical placeholder badge and label", () => {
    const html = renderToString(<FormulaBox label="Euclidean Metric" />);
    expect(html).toContain("Euclidean Metric");
    expect(html).toContain("[MATHEMATICAL EXPLANATION PLACEHOLDER]");
  });

  it("renders CodeBlock with code placeholder badge", () => {
    const html = renderToString(<CodeBlock label="NumPy Scratch Script" />);
    expect(html).toContain("NumPy Scratch Script");
    expect(html).toContain("[CODE IMPLEMENTATION PLACEHOLDER]");
  });

  it("renders DiagramPlaceholder with diagram badge", () => {
    const html = renderToString(<DiagramPlaceholder label="Dendrogram Geometry" />);
    expect(html).toContain("Dendrogram Geometry");
    expect(html).toContain("[DIAGRAM PLACEHOLDER]");
  });

  it("renders VizPlaceholder with interactive visualization badge", () => {
    const html = renderToString(<VizPlaceholder label="Interactive Dendrogram Cutter" large />);
    expect(html).toContain("Interactive Dendrogram Cutter");
    expect(html).toContain("[INTERACTIVE VISUALIZATION PLACEHOLDER]");
  });

  it("renders NoteBox with title", () => {
    const html = renderToString(<NoteBox title="Key Takeaway">Important heuristic</NoteBox>);
    expect(html).toContain("Key Takeaway");
    expect(html).toContain("Important heuristic");
  });

  it("renders ComparisonTable with headers and rows", () => {
    const html = renderToString(
      <ComparisonTable
        columns={["Feature", "Agglomerative", "Divisive"]}
        rows={["Direction", "Complexity"]}
      />,
    );
    expect(html).toContain("Feature");
    expect(html).toContain("Agglomerative");
    expect(html).toContain("Divisive");
    expect(html).toContain("Direction");
    expect(html).toContain("Complexity");
  });

  it("renders ParadigmComparisonVisualizer and Module03Quiz", () => {
    const vizHtml = renderToString(<ParadigmComparisonVisualizer />);
    expect(vizHtml).toContain("Side-by-Side Progression Visualizer");
    expect(vizHtml).toContain("4-Point Dataset");

    const quizHtml = renderToString(<Module03Quiz />);
    expect(quizHtml).toContain("Module 03 Knowledge Check");
    expect(quizHtml).toContain("Check Answers");
  });

  it("renders AgglomerativeSimulator and Module04Quiz", () => {
    const vizHtml = renderToString(<AgglomerativeSimulator />);
    expect(vizHtml).toContain("Interactive Agglomerative Clustering Simulator");
    expect(vizHtml).toContain("Current Distance Matrix");

    const quizHtml = renderToString(<Module04Quiz />);
    expect(quizHtml).toContain("Module 04 Knowledge Check");
    expect(quizHtml).toContain("Check Answers");
  });

  it("renders DianaSimulator and Module05Quiz", () => {
    const vizHtml = renderToString(<DianaSimulator />);
    expect(vizHtml).toContain("Interactive DIANA Splitting Simulator");
    expect(vizHtml).toContain("diam(C) = 7.2111");

    const quizHtml = renderToString(<Module05Quiz />);
    expect(quizHtml).toContain("Module 05 Knowledge Check");
    expect(quizHtml).toContain("Check Answers");
  });

  it("renders SingleLinkageChainingVisualizer", () => {
    const vizHtml = renderToString(<SingleLinkageChainingVisualizer />);
    expect(vizHtml).toContain("Single vs. Complete Linkage: Chaining Phenomenon Explorer");
    expect(vizHtml).toContain("Noise Bridge Points");
  });

  it("renders CentroidLinkageInversionVisualizer and WardVarianceIncreaseCalculator", () => {
    const invHtml = renderToString(<CentroidLinkageInversionVisualizer />);
    expect(invHtml).toContain("Centroid Linkage Inversion Demonstration");
    expect(invHtml).toContain("NON-MONOTONIC INVERSION");

    const wardHtml = renderToString(<WardVarianceIncreaseCalculator />);
    expect(wardHtml).toContain("Variance Increase");
    expect(wardHtml).toContain("Harmonic Weight Factor");
  });

  it("renders LanceWilliamsExplorer and Module06Quiz", () => {
    const lwHtml = renderToString(<LanceWilliamsExplorer />);
    expect(lwHtml).toContain("Generalized Lance–Williams Recurrence");
    expect(lwHtml).toContain("Batagelj (1981) Monotonicity Conditions");

    const quizHtml = renderToString(<Module06Quiz />);
    expect(quizHtml).toContain("Module 06 Knowledge Check");
    expect(quizHtml).toContain("Check Answers");
  });
});
