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
  RichText,
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
import {
  DistanceMetricExplorer,
  CurseOfDimensionalitySimulator,
  Module07Quiz,
} from "@/content/module07-metrics";
import {
  DendrogramExplorer,
  UltrametricPropertyVisualizer,
  Module08Quiz,
} from "@/content/module08-dendrograms";
import { MathematicalPlayground, Module09Quiz } from "@/content/module09-mathematics";
import { ImplementationExplorer, Module10Quiz } from "@/content/module10-implementation";
import { EvaluationPlayground, Module11Quiz } from "@/content/module11-evaluation";
import { DendrogramCuttingLab, Module12Quiz } from "@/content/module12-selection";
import { ClusterInterpretationLab, Module13Quiz } from "@/content/module13-interpretation";
import { CaseStudyExplorer, Module14Quiz } from "@/content/module14-applications";

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

  it("splits double-newlines into multiple paragraph elements via RichText", () => {
    const html = renderToString(<RichText text={"Paragraph one.\n\nParagraph two."} />);
    expect(html).toContain("<p");
    expect(html).toContain("Paragraph one.");
    expect(html).toContain("Paragraph two.");
    const count = (html.match(/<p /g) || []).length;
    expect(count).toBe(2);
  });

  it("renders a numbered string as an ordered list with the right item count and bold lead-in", () => {
    const text =
      "1. NumPy (Numerical Python): High-performance arrays.\n2. SciPy: Scientific algorithms.\n3. Scikit-Learn: Machine learning.";
    const html = renderToString(<RichText text={text} />);
    expect(html).toContain("<ol");
    const liCount = (html.match(/<li /g) || []).length;
    expect(liCount).toBe(3);
    expect(html).toContain("<strong");
    expect(html).toContain("NumPy (Numerical Python):");
    expect(html).toContain("SciPy:");
  });

  it("renders nested lists (nested <ol> inside <ul>)", () => {
    const text =
      "- Choose Hierarchical Clustering when:\n  1. The dataset size is modest\n  2. You do not know cluster count k\n- Choose Alternative Paradigms when:\n  1. Dataset is massive";
    const html = renderToString(<RichText text={text} />);
    expect(html).toContain("<ul");
    expect(html).toContain("<ol");
    expect(html).toContain("Choose Hierarchical Clustering when:");
    expect(html).toContain("The dataset size is modest");
    expect(html).toContain("Dataset is massive");
  });

  it("leaves non-string ReactNode children untouched in RichText", () => {
    const element = <span data-testid="custom">Custom element</span>;
    const html = renderToString(<RichText text={element} />);
    expect(html).toContain('data-testid="custom"');
    expect(html).toContain("Custom element");
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

  it("renders DistanceMetricExplorer, CurseOfDimensionalitySimulator, and Module07Quiz", () => {
    const metricHtml = renderToString(<DistanceMetricExplorer />);
    expect(metricHtml).toContain("Interactive Distance Metric");
    expect(metricHtml).toContain("Calculated Distance");

    const simHtml = renderToString(<CurseOfDimensionalitySimulator />);
    expect(simHtml).toContain("Distance Concentration Simulator");
    expect(simHtml).toContain("Beyer et al. (1999)");

    const quizHtml = renderToString(<Module07Quiz />);
    expect(quizHtml).toContain("Module 07 Knowledge Check");
    expect(quizHtml).toContain("Check Answers");
  });

  it("renders DendrogramExplorer, UltrametricPropertyVisualizer, and Module08Quiz", () => {
    const dendroHtml = renderToString(<DendrogramExplorer />);
    expect(dendroHtml).toContain("Interactive Dendrogram Slicing");
    expect(dendroHtml).toContain("Cophenetic Correlation (CCC)");

    const ultraHtml = renderToString(<UltrametricPropertyVisualizer />);
    expect(ultraHtml).toContain("Ultrametric Inequality");
    expect(ultraHtml).toContain("Isosceles Triangle Theorem");

    const quizHtml = renderToString(<Module08Quiz />);
    expect(quizHtml).toContain("Module 08 Knowledge Check");
    expect(quizHtml).toContain("Check Answers");
  });

  it("renders MathematicalPlayground and Module09Quiz", () => {
    const mathHtml = renderToString(<MathematicalPlayground />);
    expect(mathHtml).toContain("Interactive Mathematical Playground");
    expect(mathHtml).toContain("Two-Point Distance");

    const quizHtml = renderToString(<Module09Quiz />);
    expect(quizHtml).toContain("Module 09 Knowledge Check");
    expect(quizHtml).toContain("Check Answers");
  });

  it("renders ImplementationExplorer and Module10Quiz", () => {
    const explorerHtml = renderToString(<ImplementationExplorer />);
    expect(explorerHtml).toContain("Client-Side Interactive Simulator");
    expect(explorerHtml).toContain("Dataset Selection");
    expect(explorerHtml).toContain("Target Clusters (k)");
    expect(explorerHtml).toContain("Feature Dimension X");

    const quizHtml = renderToString(<Module10Quiz />);
    expect(quizHtml).toContain("Module 10 Knowledge Check");
    expect(quizHtml).toContain("Check Answers");
  });

  it("renders EvaluationPlayground and Module11Quiz", () => {
    const evalHtml = renderToString(<EvaluationPlayground />);
    expect(evalHtml).toContain("Interactive Cluster Evaluation Laboratory");
    expect(evalHtml).toContain("Evaluation Dataset");
    expect(evalHtml).toContain("Internal Validation Panel");
    expect(evalHtml).toContain("External Benchmark Panel");
    expect(evalHtml).toContain("Silhouette Score");

    const quizHtml = renderToString(<Module11Quiz />);
    expect(quizHtml).toContain("Module 11 Knowledge Check: Cluster Evaluation");
    expect(quizHtml).toContain("Check Answers");
  });

  it("renders DendrogramCuttingLab and Module12Quiz", () => {
    const labHtml = renderToString(<DendrogramCuttingLab />);
    expect(labHtml).toContain("Hierarchical Cluster Extraction");
    expect(labHtml).toContain("Inconsistency Studio");
    expect(labHtml).toContain("Dataset Preset");
    expect(labHtml).toContain("Linkage Criterion");
    expect(labHtml).toContain("Slicing Paradigm");
    expect(labHtml).toContain("Interactive Dendrogram Slicing");

    const quizHtml = renderToString(<Module12Quiz />);
    expect(quizHtml).toContain("Module 12: Cluster Selection");
    expect(quizHtml).toContain("Submit Answers");
  });

  it("renders ClusterInterpretationLab and Module13Quiz", () => {
    const labHtml = renderToString(<ClusterInterpretationLab />);
    expect(labHtml).toContain("Feature Profiling");
    expect(labHtml).toContain("Resampling Stability");
    expect(labHtml).toContain("Dataset Domain");
    expect(labHtml).toContain("Linkage Criterion");
    expect(labHtml).toContain("Cluster Distribution Profiles");

    const quizHtml = renderToString(<Module13Quiz />);
    expect(quizHtml).toContain("Module 13: Cluster Profiling");
    expect(quizHtml).toContain("Submit Answers");
  });

  it("renders CaseStudyExplorer and Module14Quiz", () => {
    const explorerHtml = renderToString(<CaseStudyExplorer />);
    expect(explorerHtml).toContain("End-to-End Production Case Study");
    expect(explorerHtml).toContain("Enterprise Customer Behavioral Segmentation");
    expect(explorerHtml).toContain("15-Stage Pipeline Walkthrough");
    expect(explorerHtml).toContain("Operational Customer Personas");
    expect(explorerHtml).toContain("Production Diagnostic Dashboard");

    const quizHtml = renderToString(<Module14Quiz />);
    expect(quizHtml).toContain("Module 14: Applications");
    expect(quizHtml).toContain("Submit Answers");
  });
});
