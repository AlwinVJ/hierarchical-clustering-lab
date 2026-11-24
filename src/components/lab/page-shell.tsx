import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { pages } from "@/lib/course";
import { BlockView, ContentCard, SectionHeader } from "./blocks";

const toOf = (slug: string) => (slug ? { to: "/$slug" as const, params: { slug } } : { to: "/" as const });

export function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      <Link to="/" className="hover:text-primary">Lab</Link>
      {items.map((i, n) => (
        <span key={i} className="flex items-center gap-1"><ChevronRight className="h-3 w-3" />
          <span className={n === items.length - 1 ? "font-medium text-foreground" : ""}>{i}</span></span>
      ))}
    </nav>
  );
}

export function PrevNext({ index }: { index: number }) {
  const prev = pages[index - 1], next = pages[index + 1];
  const cls = "group flex flex-1 flex-col rounded-md border border-border bg-card px-4 py-3 hover:border-primary";
  return (
    <div className="mt-10 flex gap-4">
      {prev ? <Link {...toOf(prev.slug)} className={cls}><span className="flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft className="h-3 w-3" />Previous</span><span className="font-medium text-foreground group-hover:text-primary">{prev.title}</span></Link> : <div className="flex-1" />}
      {next ? <Link {...toOf(next.slug)} className={`${cls} items-end text-right`}><span className="flex items-center gap-1 text-xs text-muted-foreground">Next<ArrowRight className="h-3 w-3" /></span><span className="font-medium text-foreground group-hover:text-primary">{next.title}</span></Link> : <div className="flex-1" />}
    </div>
  );
}

export function PageShell({ index, children }: { index: number; children?: ReactNode }) {
  const page = pages[index]!;
  return (
    <article className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
      <Breadcrumbs items={[page.group, page.title]} />
      <header className="mt-4 mb-8">
        <p className="font-mono text-xs text-lavender">Module {String(index).padStart(2, "0")}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{page.title}</h1>
        <p className="mt-2 font-mono text-xs text-primary">[CONTENT PLACEHOLDER] — short description of this module</p>
      </header>
      <div className="space-y-6">
        {page.sections.map((sec, i) => (
          <ContentCard key={sec.title}>
            <SectionHeader index={i + 1} title={sec.title} />
            <div className="space-y-4">{sec.blocks.map((b, j) => <BlockView key={j} block={b} />)}</div>
          </ContentCard>
        ))}
        {children}
      </div>
      <PrevNext index={index} />
    </article>
  );
}
