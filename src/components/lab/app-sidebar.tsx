import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Menu, X, Network } from "lucide-react";
import { groups, pages } from "@/lib/course";

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  const isActive = (slug: string) => {
    if (!slug) return path === "/";
    return path === `/${slug}` || path === `/${slug}/`;
  };

  const nav = (mini: boolean) => (
    <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-4" aria-label="Course Navigation">
      {groups.map((groupName) => {
        const isOpen = mini || !closed[groupName];
        const groupPages = pages.filter((p) => p.group === groupName);

        return (
          <div key={groupName} className="space-y-1">
            {!mini && (
              <button
                type="button"
                onClick={() => setClosed((prev) => ({ ...prev, [groupName]: !prev[groupName] }))}
                className="flex w-full items-center justify-between px-2.5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                aria-expanded={isOpen}
              >
                <span>{groupName}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "" : "-rotate-90"
                  }`}
                />
              </button>
            )}

            {isOpen && (
              <div className="space-y-0.5">
                {groupPages.map((page) => {
                  const globalIdx = pages.indexOf(page);
                  const active = isActive(page.slug);
                  const Icon = page.icon;

                  return (
                    <Link
                      key={page.slug || "overview"}
                      onClick={() => setMobileOpen(false)}
                      title={page.title}
                      {...(page.slug
                        ? { to: "/$slug" as const, params: { slug: page.slug } }
                        : { to: "/" as const })}
                      className={`group flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-xs font-medium transition-colors ${
                        mini ? "justify-center px-1.5" : ""
                      } ${
                        active
                          ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                          : "text-foreground/90 hover:bg-secondary hover:text-navy"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active ? "text-primary-foreground" : "text-teal group-hover:text-navy"
                        }`}
                      />
                      {!mini && (
                        <>
                          <span
                            className={`font-mono text-[10px] tabular-nums shrink-0 ${
                              active ? "text-primary-foreground/80" : "text-muted-foreground"
                            }`}
                          >
                            {String(globalIdx).padStart(2, "0")}
                          </span>
                          <span className="truncate">{page.title}</span>
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  const brand = (mini: boolean) => (
    <Link
      to="/"
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-3 border-b border-border px-4 py-4.5 bg-sidebar transition-colors hover:bg-secondary/40 ${
        mini ? "justify-center px-2" : ""
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-navy bg-navy/5 text-navy">
        <Network className="h-5 w-5 text-navy" />
      </div>
      {!mini && (
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-foreground">
            Hierarchical Clustering Lab
          </p>
          <p className="truncate text-[10px] font-mono tracking-wide text-muted-foreground uppercase">
            Machine Learning Learning Series
          </p>
        </div>
      )}
    </Link>
  );

  return (
    <>
      {/* Mobile Sticky Header */}
      <header className="sticky top-0 z-30 flex h-13 items-center justify-between border-b border-border bg-sidebar px-4 lg:hidden">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-sm border border-border p-1.5 text-foreground hover:bg-secondary transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="truncate">
            <span className="text-xs font-bold text-foreground">Hierarchical Clustering Lab</span>
            <span className="block text-[10px] font-mono text-muted-foreground">ML Series</span>
          </div>
        </div>
        <Link to="/" className="text-xs font-mono text-teal hover:underline">
          Overview
        </Link>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-76 max-w-[85vw] flex-col border-r border-border bg-sidebar shadow-xl">
            <div className="flex items-center justify-between border-b border-border pr-2">
              <div className="flex-1">{brand(false)}</div>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
                className="rounded-sm p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {nav(false)}
          </aside>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar transition-all duration-200 lg:flex ${
          collapsed ? "w-16" : "w-72"
        }`}
      >
        {brand(collapsed)}
        {nav(collapsed)}
        <div className="border-t border-border p-2">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-navy transition-colors"
          >
            {collapsed ? (
              <PanelLeftOpen className="mx-auto h-4 w-4 text-teal" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 text-teal" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
