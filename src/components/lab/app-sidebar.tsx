import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Menu, X, Network } from "lucide-react";
import { groups, pages } from "@/lib/course";

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const isActive = (slug: string) => (slug ? path === `/${slug}` : path === "/");

  const nav = (mini: boolean) => (
    <nav className="flex-1 overflow-y-auto px-2 py-3">
      {groups.map((g) => {
        const open = mini || !closed[g];
        return (
          <div key={g} className="mb-2">
            {!mini && (
              <button onClick={() => setClosed((c) => ({ ...c, [g]: !c[g] }))} className="flex w-full items-center justify-between px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                {g}<ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "" : "-rotate-90"}`} />
              </button>
            )}
            {open && pages.filter((p) => p.group === g).map((p) => {
              const i = pages.indexOf(p), active = isActive(p.slug);
              const Icon = p.icon;
              return (
                <Link key={p.title} onClick={() => setMobileOpen(false)} title={p.title}
                  {...(p.slug ? { to: "/$slug" as const, params: { slug: p.slug } } : { to: "/" as const })}
                  className={`flex items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm ${mini ? "justify-center" : ""} ${active ? "bg-deep text-primary-foreground" : "text-foreground hover:bg-background/70"}`}>
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "" : "text-lavender"}`} />
                  {!mini && <><span className="w-5 font-mono text-[11px] opacity-60">{i + 1}</span><span className="truncate">{p.title}</span></>}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );

  const brand = (mini: boolean) => (
    <div className={`flex items-center gap-2.5 border-b border-border px-4 py-4 ${mini ? "justify-center px-2" : ""}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-primary text-primary"><Network className="h-4 w-4" /></div>
      {!mini && <div className="min-w-0"><p className="truncate text-sm font-bold text-foreground">Hierarchical Clustering Lab</p><p className="truncate text-[11px] text-muted-foreground">Machine Learning Series</p></div>}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-border bg-sidebar px-3 lg:hidden">
        <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="rounded-sm p-1.5 text-foreground hover:bg-background"><Menu className="h-5 w-5" /></button>
        <span className="text-sm font-bold text-foreground">Hierarchical Clustering Lab</span>
      </header>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-sidebar">
            <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute right-2 top-4 p-1 text-muted-foreground"><X className="h-4 w-4" /></button>
            {brand(false)}{nav(false)}
          </aside>
        </div>
      )}
      <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar lg:flex ${collapsed ? "w-16" : "w-72"}`}>
        {brand(collapsed)}{nav(collapsed)}
        <button onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar" className="flex items-center gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground hover:text-primary">
          {collapsed ? <PanelLeftOpen className="mx-auto h-4 w-4" /> : <><PanelLeftClose className="h-4 w-4" />Collapse</>}
        </button>
      </aside>
    </>
  );
}
