import type { ReactNode } from "react";
import katex from "katex";
import {
  Info,
  Sigma,
  Code2,
  ImageIcon,
  MousePointerClick,
  Terminal,
  FileText,
  Table as TableIcon,
} from "lucide-react";
import type { Block } from "@/lib/course";

/** KaTeX Mathematical Expression Component */
export function MathFormula({
  tex,
  display = true,
  className = "",
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  try {
    const html = katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
    });
    return (
      <span
        className={`inline-block overflow-x-auto max-w-full align-middle ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <code className={`font-mono text-xs ${className}`}>{tex}</code>;
  }
}

/** Section Header for distinct educational modules */
export function SectionHeader({ index, title }: { index?: number; title: string }) {
  return (
    <div className="mb-5 flex items-baseline gap-3 border-b border-border pb-3">
      {index !== undefined && (
        <span className="font-mono text-xs font-semibold tracking-wider text-teal">
          {`SECTION ${String(index).padStart(2, "0")}`}
        </span>
      )}
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
    </div>
  );
}

/** Academic Content Card Container */
export function ContentCard({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-sm border border-border bg-card p-6 shadow-none sm:p-7 transition-colors ${className}`}
    >
      {children}
    </section>
  );
}

/** Explicit placeholder indicator pill */
export function PlaceholderTag({
  children,
  variant = "content",
}: {
  children: ReactNode;
  variant?: "content" | "math" | "diagram" | "code" | "viz";
}) {
  const variantStyles = {
    content: "bg-secondary text-primary border-border",
    math: "bg-navy/5 text-navy border-navy/20",
    diagram: "bg-teal/10 text-teal border-teal/30",
    code: "bg-ink/10 text-foreground border-border",
    viz: "bg-teal/10 text-navy border-teal/40",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}

interface RichTextItem {
  content: string;
  subList?: {
    type: "ol" | "ul";
    items: string[];
  };
}

interface RichTextGroup {
  type: "p" | "list";
  listType?: "ol" | "ul";
  paragraphs?: string[];
  items?: RichTextItem[];
}

export function renderRichTextItemContent(text: string): ReactNode {
  // Check for "Term:" lead-in at the beginning of the text
  const match = text.match(/^([^:\n]{1,60}:)(?:\s+(.*)|$)/);
  if (match && match[1]) {
    const leadIn = match[1];
    const rest = match[2] ?? "";
    return (
      <>
        <strong className="font-semibold text-foreground">{leadIn}</strong>
        {rest ? ` ${rest}` : ""}
      </>
    );
  }
  return text;
}

/** Formats multi-paragraph prose and ordered/unordered lists with nesting */
export function RichText({
  text,
  className = "",
}: {
  text: ReactNode;
  className?: string;
}) {
  if (typeof text !== "string") {
    return <>{text}</>;
  }

  const raw = text.replace(/\r\n/g, "\n");
  const sections = raw.split(/\n\s*\n/);
  const elements: ReactNode[] = [];

  sections.forEach((section, sIdx) => {
    const trimmedSection = section.trim();
    if (!trimmedSection) return;

    const lines = trimmedSection.split("\n");
    const groups: RichTextGroup[] = [];

    lines.forEach((line) => {
      const topListMatch = line.match(/^(\s{0,1})(?:([0-9]+[\.\)]|[a-zA-Z][\.\)])|([•\-\*]))\s+(.*)$/);
      const nestedMatch = line.match(/^(\s{2,}|\t+)(?:([0-9]+[\.\)]|[a-zA-Z][\.\)])|([•\-\*]))\s+(.*)$/);

      if (nestedMatch) {
        const subType: "ol" | "ul" = nestedMatch[2] ? "ol" : "ul";
        const content = nestedMatch[4] ?? "";
        const lastGroup = groups[groups.length - 1];
        if (lastGroup && lastGroup.type === "list" && lastGroup.items && lastGroup.items.length > 0) {
          const lastItem = lastGroup.items[lastGroup.items.length - 1]!;
          if (!lastItem.subList) {
            lastItem.subList = { type: subType, items: [content] };
          } else {
            lastItem.subList.items.push(content);
          }
          return;
        }
      }

      if (topListMatch) {
        const listType: "ol" | "ul" = topListMatch[2] ? "ol" : "ul";
        const content = topListMatch[4] ?? "";
        const lastGroup = groups[groups.length - 1];
        if (lastGroup && lastGroup.type === "list" && lastGroup.listType === listType && lastGroup.items) {
          lastGroup.items.push({ content });
        } else {
          groups.push({
            type: "list",
            listType,
            items: [{ content }],
          });
        }
        return;
      }

      // Normal text line
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.type === "p" && lastGroup.paragraphs) {
        lastGroup.paragraphs.push(line.trim());
      } else {
        groups.push({
          type: "p",
          paragraphs: [line.trim()],
        });
      }
    });

    groups.forEach((group, gIdx) => {
      const key = `${sIdx}-${gIdx}`;
      if (group.type === "p" && group.paragraphs) {
        elements.push(
          <p key={key} className="leading-relaxed text-left sm:text-justify hyphens-auto">
            {group.paragraphs.join(" ")}
          </p>,
        );
      } else if (group.type === "list" && group.items) {
        if (group.listType === "ol") {
          elements.push(
            <ol key={key} className="list-decimal pl-5 space-y-1.5 text-left sm:text-justify hyphens-auto">
              {group.items.map((it, iIdx) => (
                <li key={iIdx} className="leading-relaxed">
                  {renderRichTextItemContent(it.content)}
                  {it.subList && (
                    it.subList.type === "ol" ? (
                      <ol className="list-decimal pl-5 mt-1.5 space-y-1">
                        {it.subList.items.map((sub, subIdx) => (
                          <li key={subIdx}>{renderRichTextItemContent(sub)}</li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="list-disc pl-5 mt-1.5 space-y-1">
                        {it.subList.items.map((sub, subIdx) => (
                          <li key={subIdx}>{renderRichTextItemContent(sub)}</li>
                        ))}
                      </ul>
                    )
                  )}
                </li>
              ))}
            </ol>,
          );
        } else {
          elements.push(
            <ul key={key} className="list-disc pl-5 space-y-1.5 text-left sm:text-justify hyphens-auto">
              {group.items.map((it, iIdx) => (
                <li key={iIdx} className="leading-relaxed">
                  {renderRichTextItemContent(it.content)}
                  {it.subList && (
                    it.subList.type === "ol" ? (
                      <ol className="list-decimal pl-5 mt-1.5 space-y-1">
                        {it.subList.items.map((sub, subIdx) => (
                          <li key={subIdx}>{renderRichTextItemContent(sub)}</li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="list-disc pl-5 mt-1.5 space-y-1">
                        {it.subList.items.map((sub, subIdx) => (
                          <li key={subIdx}>{renderRichTextItemContent(sub)}</li>
                        ))}
                      </ul>
                    )
                  )}
                </li>
              ))}
            </ul>,
          );
        }
      }
    });
  });

  return <div className={`space-y-2 ${className}`}>{elements}</div>;
}

/** Main Textual Content Container / Placeholder */
export function ContentPlaceholder({
  label,
  children,
}: {
  label?: string | undefined;
  children?: ReactNode;
}) {
  if (children) {
    return (
      <div className="space-y-3 rounded-sm border border-border bg-card p-5 text-sm leading-relaxed text-foreground">
        {label && (
          <h3 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-teal">
            <FileText className="h-3.5 w-3.5 text-teal" />
            {label}
          </h3>
        )}
        <RichText text={children} className="text-foreground/90" />
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-sm border border-dashed border-border bg-secondary/30 p-4">
      <div className="flex items-center justify-between gap-2">
        {label ? (
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="h-3.5 w-3.5 text-teal" />
            {label}
          </h3>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">Explanatory Text Area</span>
        )}
        <PlaceholderTag variant="content">[CONTENT PLACEHOLDER]</PlaceholderTag>
      </div>
      <div className="space-y-2 pt-1 opacity-70">
        <div className="h-2 w-full rounded-sm bg-border" />
        <div className="h-2 w-11/12 rounded-sm bg-border" />
        <div className="h-2 w-4/5 rounded-sm bg-border" />
      </div>
      <p className="font-mono text-[11px] text-muted-foreground/80">
        Academic theory, conceptual definitions, and mechanical explanations will be added in Phase
        2.
      </p>
    </div>
  );
}

/** Mathematical Equation and Derivation Container */
export function FormulaBox({
  label,
  tex,
  description,
  children,
}: {
  label?: string | undefined;
  tex?: string | undefined;
  description?: string | undefined;
  children?: ReactNode;
}) {
  const defaultTex = tex ?? String.raw`d(u, v) = \min \{ \text{dist}(s, t) : s \in u, t \in v \}`;

  return (
    <div className="rounded-sm border-l-4 border-navy bg-secondary/50 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy">
          <Sigma className="h-4 w-4 text-navy" />
          <span>{label ?? "Mathematical Derivation & Formulation"}</span>
        </div>
        {!tex && !children && (
          <PlaceholderTag variant="math">[MATHEMATICAL EXPLANATION PLACEHOLDER]</PlaceholderTag>
        )}
      </div>

      <div className="my-4 flex flex-col items-center justify-center rounded-sm border border-border bg-background/90 py-5 px-4 overflow-x-auto">
        <MathFormula tex={defaultTex} display={true} />
      </div>

      {description && (
        <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
          <RichText text={description} />
        </div>
      )}

      {children && (
        <div className="mt-3 text-xs text-foreground/90 space-y-2">
          <RichText text={children} />
        </div>
      )}

      {!tex && !children && !description && (
        <p className="font-mono text-[11px] text-muted-foreground">
          Formulas, variables definitions, and step-by-step mathematical proofs will be integrated
          here.
        </p>
      )}
    </div>
  );
}

/** Code Implementation Container with Syntax Styling */
export function CodeBlock({
  label,
  code,
  language = "python",
}: {
  label?: string | undefined;
  code?: string | undefined;
  language?: string | undefined;
}) {
  const codeContent =
    code ??
    `# [CODE IMPLEMENTATION PLACEHOLDER]
# Full algorithm implementation, NumPy vectorization, or library workflow
# will be placed here in Phase 2.

def hierarchical_clustering(data, linkage="single"):
    """
    [FUNCTION SPECIFICATION PLACEHOLDER]
    """
    raise NotImplementedError("Implementation placeholder")`;

  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <div className="flex items-center justify-between bg-ink px-4 py-2 text-xs text-ink-foreground">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-teal" />
          <span className="font-mono font-medium">{label ?? "Python Implementation"}</span>
          <span className="text-[10px] text-muted-foreground opacity-80">· {language}</span>
        </div>
        {!code && <PlaceholderTag variant="code">[CODE IMPLEMENTATION PLACEHOLDER]</PlaceholderTag>}
      </div>
      <div className="bg-ink/95 px-5 py-4 overflow-x-auto">
        <pre className="font-mono text-xs leading-relaxed text-ink-foreground/90">
          <code>{codeContent}</code>
        </pre>
      </div>
      <div className="border-t border-ink/40 bg-ink/90 px-4 py-1.5 text-[11px] font-mono text-muted-foreground">
        Verified executable Python reference implementation.
      </div>
    </div>
  );
}

/** Output Container for Execution Logs and Results */
export function OutputBlock({
  label,
  output,
}: {
  label?: string | undefined;
  output?: string | undefined;
}) {
  const outputContent =
    output ??
    `>>> [EXECUTION LOG PLACEHOLDER]
>>> Computed cluster hierarchy: 4 clusters formed
>>> Cophenetic correlation coefficient: 0.884`;

  return (
    <div className="rounded-sm border border-border bg-secondary/40 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Terminal className="h-3.5 w-3.5 text-teal" />
          <span>{label ?? "Standard Output & Diagnostics"}</span>
        </div>
        {!output && <PlaceholderTag variant="content">[CONTENT PLACEHOLDER]</PlaceholderTag>}
      </div>
      <pre className="rounded-sm border border-border bg-background p-3 font-mono text-xs text-foreground/90 overflow-x-auto">
        {outputContent}
      </pre>
    </div>
  );
}

import {
  FlatVsNestedDiagram,
  ContinuousCloudCutDiagram,
  LinkageDistanceGeometryDiagram,
  AgglomerativeMergeSequenceDiagram,
  DivisiveSplinterSequenceDiagram,
} from "./diagrams";

/** Static Diagram and Schematic Component */
export function DiagramPlaceholder({ label }: { label?: string | undefined }) {
  if (label?.includes("Feature space partitioning") || label?.includes("cluster boundary geometries")) {
    return <FlatVsNestedDiagram label={label} />;
  }
  if (label?.includes("continuous feature space") || label?.includes("nested hierarchical partitions")) {
    return <ContinuousCloudCutDiagram label={label} />;
  }
  if (label?.includes("inter-cluster distance definitions") || label?.includes("distance definitions")) {
    return <LinkageDistanceGeometryDiagram label={label} />;
  }
  if (label?.includes("Bottom-up merge progression") || label?.includes("singletons to root")) {
    return <AgglomerativeMergeSequenceDiagram label={label} />;
  }
  if (label?.includes("Top-down splinter") || label?.includes("root to leaves")) {
    return <DivisiveSplinterSequenceDiagram label={label} />;
  }

  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed border-border bg-secondary/30 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-background border border-border text-teal">
        <ImageIcon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <div className="flex justify-center">
          <PlaceholderTag variant="diagram">[DIAGRAM PLACEHOLDER]</PlaceholderTag>
        </div>
        <p className="text-sm font-semibold text-foreground">
          {label ?? "Static Diagram & Conceptual Schema"}
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          Technical vector illustrations, cluster geometries, and dataflow schematics.
        </p>
      </div>
    </div>
  );
}

/** Interactive Visualization Workspace Placeholder */
export function VizPlaceholder({
  label,
  large,
}: {
  label?: string | undefined;
  large?: boolean | undefined;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed border-teal/40 bg-accent/30 p-8 text-center ${
        large ? "min-h-[420px]" : "min-h-[260px]"
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-background border border-teal/40 text-navy shadow-none">
        <MousePointerClick className="h-7 w-7 text-teal" />
      </div>
      <div className="max-w-md space-y-1.5">
        <div className="flex justify-center">
          <PlaceholderTag variant="viz">[INTERACTIVE VISUALIZATION PLACEHOLDER]</PlaceholderTag>
        </div>
        <h4 className="text-base font-bold text-foreground">
          {label ??
            (large ? "Reserved Interactive Simulation Workspace" : "Supporting Visualization")}
        </h4>
        <p className="text-xs text-muted-foreground">
          Interactive parameters, dynamic dendrogram cuts, step-by-step merge animations, and
          dataset controls will render in this area.
        </p>
      </div>
      <div className="mt-2 inline-flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-1 font-mono text-[11px] text-muted-foreground">
        <span>Status:</span>
        <span className="font-semibold text-teal">Canvas Dimensions Reserved</span>
      </div>
    </div>
  );
}

/** Important Academic Note / Callout Container */
export function NoteBox({
  title = "Key Concept Note",
  children,
}: {
  title?: string | undefined;
  children?: ReactNode;
}) {
  return (
    <div className="flex gap-3.5 rounded-sm border-l-4 border-teal bg-secondary/60 p-4">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-foreground">{title}</p>
        <div className="text-muted-foreground text-xs leading-relaxed">
          {children ? (
            <RichText text={children} />
          ) : (
            <div className="flex items-center gap-2">
              <span>Core insight or critical distinction:</span>
              <PlaceholderTag variant="content">[CONTENT PLACEHOLDER]</PlaceholderTag>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Structured Technical Comparison Table */
export function ComparisonTable({
  columns,
  rows,
  tableData,
}: {
  columns: string[];
  rows: string[];
  tableData?: Record<string, string[]> | undefined;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <div className="flex items-center justify-between bg-secondary/80 px-4 py-2 border-b border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-mono">
          <TableIcon className="h-3.5 w-3.5 text-teal" />
          <span>Technical Comparison Matrix</span>
        </div>
        {!tableData && <PlaceholderTag variant="content">[CONTENT PLACEHOLDER]</PlaceholderTag>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-foreground">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col}
                  className={`px-4 py-3 border-b border-border ${
                    idx === 0 ? "font-bold text-navy" : ""
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => {
              const rowValues = tableData?.[row];
              return (
                <tr key={row} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap bg-secondary/10">
                    {row}
                  </td>
                  {columns.slice(1).map((col, cIdx) => (
                    <td key={col} className="px-4 py-3 text-xs text-foreground/90 leading-relaxed">
                      {rowValues && rowValues[cIdx] ? (
                        rowValues[cIdx]
                      ) : (
                        <span className="font-mono text-muted-foreground/70">
                          [CONTENT PLACEHOLDER]
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Dynamic Block Dispatcher */
export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "math":
      return (
        <FormulaBox label={block.label} tex={block.tex} description={block.description}>
          {block.content}
        </FormulaBox>
      );
    case "diagram":
      return <DiagramPlaceholder label={block.label} />;
    case "code":
      return <CodeBlock label={block.label} code={block.code} />;
    case "output":
      return <OutputBlock label={block.label} output={block.output} />;
    case "viz":
      return <VizPlaceholder label={block.label} />;
    case "viz-large":
      return <VizPlaceholder large label={block.label} />;
    case "table":
      return (
        <ComparisonTable
          columns={block.columns ?? []}
          rows={block.rows ?? []}
          tableData={block.tableData}
        />
      );
    case "note":
      return <NoteBox title={block.noteTitle ?? block.label}>{block.content}</NoteBox>;
    case "custom":
      return <>{block.content}</>;
    default:
      return <ContentPlaceholder label={block.label}>{block.content}</ContentPlaceholder>;
  }
}
