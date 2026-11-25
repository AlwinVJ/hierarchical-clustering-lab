import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, ArrowLeft, ArrowRight, Home } from "lucide-react";
import { pages } from "@/lib/course";
import { BlockView, ContentCard, SectionHeader } from "./blocks";

const toOf = (slug: string) =>
  slug ? { to: "/$slug" as const, params: { slug } } : { to: "/" as const };

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-navy transition-colors font-medium"
      >
        <Home className="h-3.5 w-3.5 text-teal" />
        <span>Lab Overview</span>
      </Link>
      {items.map((item, idx) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
          {item.to ? (
            <Link to={item.to} className="hover:text-navy transition-colors">
              {item.label}
            </Link>
          ) : (
            <span
              className={
                idx === items.length - 1
                  ? "font-semibold text-foreground tracking-tight"
                  : "text-muted-foreground"
              }
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PrevNext({ index }: { index: number }) {
  const prev = pages[index - 1];
  const next = pages[index + 1];

  const baseCard =
    "group flex flex-1 flex-col rounded-sm border border-border bg-card p-4 transition-all hover:border-navy hover:shadow-xs";

  return (
    <nav aria-label="Module navigation" className="mt-12 pt-6 border-t border-border">
      <div className="flex flex-col sm:flex-row gap-4">
        {prev ? (
          <Link {...toOf(prev.slug)} className={baseCard}>
            <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground group-hover:text-teal transition-colors">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Previous Module
            </span>
            <span className="mt-1 font-semibold text-foreground text-sm group-hover:text-navy">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1 hidden sm:block" />
        )}

        {next ? (
          <Link {...toOf(next.slug)} className={`${baseCard} sm:items-end sm:text-right`}>
            <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground group-hover:text-teal transition-colors">
              Next Module
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="mt-1 font-semibold text-foreground text-sm group-hover:text-navy">
              {next.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1 hidden sm:block" />
        )}
      </div>
    </nav>
  );
}

export function PageShell({ index, children }: { index: number; children?: ReactNode }) {
  const page = pages[index]!;
  const isOverview = index === 0;

  return (
    <article className="mx-auto max-w-6xl px-6 py-10 lg:px-12">
      {/* 1. Breadcrumb navigation */}
      <Breadcrumbs
        items={isOverview ? [{ label: "Welcome" }] : [{ label: page.group }, { label: page.title }]}
      />

      {/* 2 & 3. Section Title & Lead Subtitle */}
      <header className="mt-6 mb-10 pb-6 border-b border-border">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs">
          <span className="font-semibold text-teal uppercase tracking-widest">
            {isOverview ? "START HERE" : `MODULE ${String(index).padStart(2, "0")}`}
          </span>
          <span className="text-border">·</span>
          <span className="text-muted-foreground">{page.group}</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {page.title}
        </h1>

        {page.subtitle && (
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            {page.subtitle}
          </p>
        )}
      </header>

      {/* 4 & 5. Main Content Containers and Visualizations */}
      <div className="space-y-8">
        {page.sections.map((sec, secIdx) => (
          <ContentCard key={sec.title} id={`section-${secIdx + 1}`}>
            <SectionHeader index={secIdx + 1} title={sec.title} />
            <div className="space-y-5">
              {sec.blocks.map((b, blockIdx) => (
                <BlockView key={blockIdx} block={b} />
              ))}
            </div>
          </ContentCard>
        ))}

        {children}
      </div>

      {/* 6. Previous and Next Topic Navigation */}
      <PrevNext index={index} />
    </article>
  );
}
