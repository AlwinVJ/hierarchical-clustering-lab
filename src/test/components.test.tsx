import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  SectionHeader,
  ContentCard,
  ContentPlaceholder,
  FormulaBox,
  CodeBlock,
  OutputBlock,
  DiagramPlaceholder,
  VizPlaceholder,
  NoteBox,
  ComparisonTable,
} from "@/components/lab/blocks";

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
});
