import type { ReactNode } from "react";
import { Info, Sigma, Code2, ImageIcon, MousePointerClick, Terminal } from "lucide-react";
import type { Block } from "@/lib/course";

export function SectionHeader({ index, title }: { index?: number; title: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-2">
      {index !== undefined && <span className="font-mono text-sm text-lavender">{String(index).padStart(2, "0")}</span>}
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
    </div>
  );
}

export function ContentCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-md border border-border bg-card p-6 ${className}`}>{children}</section>;
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="font-mono text-xs font-semibold tracking-wide text-primary">{children}</span>;
}

export function ContentPlaceholder({ label }: { label?: string | undefined }) {
  return (
    <div className="space-y-2">
      {label && <h3 className="text-sm font-semibold text-foreground">{label}</h3>}
      <Tag>[CONTENT PLACEHOLDER]</Tag>
      <div className="space-y-2 pt-1">
        <div className="h-2 w-full rounded-sm bg-secondary" /><div className="h-2 w-11/12 rounded-sm bg-secondary" /><div className="h-2 w-3/5 rounded-sm bg-secondary" />
      </div>
    </div>
  );
}

export function FormulaBox({ label }: { label?: string | undefined }) {
  return (
    <div className="rounded-sm border-l-2 border-primary bg-secondary/60 px-4 py-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground"><Sigma className="h-3.5 w-3.5 text-lavender" />{label ?? "Mathematics"}</div>
      <Tag>[MATHEMATICAL EXPLANATION PLACEHOLDER]</Tag>
      <div className="mt-3 text-center font-mono text-lg text-muted-foreground">f(x) = …</div>
    </div>
  );
}

export function CodeBlock({ label }: { label?: string | undefined }) {
  return (
    <div className="overflow-hidden rounded-sm border border-ink">
      <div className="flex items-center gap-2 bg-ink px-3 py-1.5 text-xs text-ink-foreground"><Code2 className="h-3.5 w-3.5" />{label ?? "Code"} · python</div>
      <pre className="bg-ink/95 px-4 py-6 font-mono text-sm text-ink-foreground">[CODE IMPLEMENTATION PLACEHOLDER]</pre>
    </div>
  );
}

export function OutputBlock() {
  return (
    <div className="rounded-sm border border-border bg-background/50 px-4 py-3">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground"><Terminal className="h-3.5 w-3.5 text-lavender" />Output</div>
      <pre className="font-mono text-xs text-muted-foreground">[CONTENT PLACEHOLDER]</pre>
    </div>
  );
}

function Frame({ icon, tag, label, tall }: { icon: ReactNode; tag: string; label: string; tall?: boolean | undefined }) {
  return (
    <div className={`grid-dots flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-lavender bg-background/40 ${tall ? "h-96" : "h-48"}`}>
      <span className="text-lavender">{icon}</span>
      <Tag>{tag}</Tag>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
export const DiagramPlaceholder = ({ label }: { label?: string | undefined }) =>
  <Frame icon={<ImageIcon className="h-6 w-6" />} tag="[DIAGRAM PLACEHOLDER]" label={label ?? "Static diagram"} />;
export const VizPlaceholder = ({ label, large }: { label?: string | undefined; large?: boolean | undefined }) =>
  <Frame icon={<MousePointerClick className="h-6 w-6" />} tag="[INTERACTIVE VISUALIZATION PLACEHOLDER]" label={label ?? (large ? "Reserved interactive workspace" : "Visualization")} tall={large} />;

export function NoteBox({ children }: { children?: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-sm border border-border bg-secondary px-4 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="text-sm"><p className="font-semibold text-foreground">Important note</p><p className="text-muted-foreground">{children ?? "[CONTENT PLACEHOLDER]"}</p></div>
    </div>
  );
}

export function ComparisonTable({ columns, rows }: { columns: string[]; rows: string[] }) {
  return (
    <div className="overflow-x-auto rounded-sm border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-left text-foreground"><tr>{columns.map((c) => <th key={c} className="px-4 py-2 font-semibold">{c}</th>)}</tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r} className="border-t border-border">
            <td className="px-4 py-2 font-medium text-foreground">{r}</td>
            {columns.slice(1).map((c) => <td key={c} className="px-4 py-2 font-mono text-xs text-muted-foreground">[CONTENT PLACEHOLDER]</td>)}
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "math": return <FormulaBox label={block.label} />;
    case "diagram": return <DiagramPlaceholder label={block.label} />;
    case "code": return <CodeBlock label={block.label} />;
    case "output": return <OutputBlock />;
    case "viz": return <VizPlaceholder label={block.label} />;
    case "viz-large": return <VizPlaceholder large />;
    case "table": return <ComparisonTable columns={block.columns ?? []} rows={block.rows ?? []} />;
    case "note": return <NoteBox />;
    default: return <ContentPlaceholder label={block.label} />;
  }
}
