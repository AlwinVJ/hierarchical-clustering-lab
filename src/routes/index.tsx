import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Layers,
  CheckCircle2,
  Milestone,
  ShieldCheck,
  Cpu,
  GitMerge,
  LineChart,
} from "lucide-react";
import { pages, groups } from "@/lib/course";
import { PageShell } from "@/components/lab/page-shell";
import { ContentCard, SectionHeader, NoteBox } from "@/components/lab/blocks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hierarchical Clustering Lab — Overview" },
      {
        name: "description",
        content:
          "A structured educational learning laboratory for hierarchical clustering in machine learning: algorithms, linkage criteria, dendrograms, mathematical formulations, and practice.",
      },
      { property: "og:title", content: "Hierarchical Clustering Lab — Overview" },
      {
        property: "og:description",
        content:
          "Academic laboratory dedicated to mastering Agglomerative and Divisive hierarchical clustering.",
      },
    ],
  }),
  component: Overview,
});

const LEARNING_OBJECTIVES = [
  {
    title: "Lance–Williams Recurrence",
    desc: "Derive and analyze generalized distance updates across Single, Complete, Average, Centroid, and Ward linkage criteria.",
  },
  {
    title: "Metric & Ultrametric Spaces",
    desc: "Master triangle inequalities, ultrametric dissimilarity axioms, cophenetic distance matrices, and cophenetic correlation (CCC).",
  },
  {
    title: "Dendrogram Topology & Slicing",
    desc: "Construct, prune, and interpret hierarchical trees, detecting merge-height leaps, inconsistency coefficients, and inversion anomalies.",
  },
  {
    title: "From-Scratch & Framework Implementation",
    desc: "Implement agglomerative clustering from scratch in NumPy and optimize production workflows via SciPy and Scikit-Learn estimators.",
  },
  {
    title: "Rigorous Cluster Validation",
    desc: "Evaluate partitions using internal metrics (Silhouette, DB, CH), external benchmarks (ARI, NMI), and bootstrap resampling stability.",
  },
  {
    title: "Industrial & Capstone Blueprints",
    desc: "Deploy end-to-end clustering pipelines on enterprise customer RFM cohorts, genomic taxonomies, and high-dimensional document spaces.",
  },
];

const STAGE_METADATA: Record<string, { desc: string; modules: string; outcome: string }> = {
  "Foundations & Intuition": {
    desc: "Establish core intuition, partition geometry, agglomerative vs. divisive paradigms, and the Lance–Williams algebraic framework.",
    modules: "Modules 01 – 05",
    outcome: "Understand step-wise coalescence, splinter splits, and recursive distance updates.",
  },
  "Linkage, Metrics & Dendrograms": {
    desc: "Examine the five classical linkage criteria, non-Euclidean distance metrics, and the mathematical anatomy of dendrograms.",
    modules: "Modules 06 – 08",
    outcome: "Prove monotonicity, prevent chaining/inversions, and quantify cophenetic distortion.",
  },
  "Mathematics & Implementation": {
    desc: "Derive Ward's minimum variance criterion, analyze algorithmic complexity, and implement models in NumPy, SciPy, and Scikit-Learn.",
    modules: "Modules 09 – 10",
    outcome: "Master O(N²) nearest-neighbor chains and sparse connectivity graph constraints.",
  },
  "Validation, Production & Projects": {
    desc: "Perform automated cluster count selection, multi-feature profiling, resampling stability tests, and capstone project blueprints.",
    modules: "Modules 11 – 15",
    outcome:
      "Deploy validated clustering solutions with comprehensive profiling and stability proofs.",
  },
};

function Overview() {
  const learningModules = pages.slice(1);

  return (
    <PageShell index={0}>
      {/* 1. Introduction & Start Learning Button */}
      <ContentCard>
        <SectionHeader index={1} title="Laboratory Overview & Scope" />
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground/90">
            Welcome to the <strong>Hierarchical Clustering Laboratory</strong>—a comprehensive,
            mathematically rigorous educational platform designed for machine learning engineers,
            data scientists, and applied researchers. Unlike flat partitioning algorithms (such as
            K-Means) that enforce a single arbitrary division upon data, hierarchical clustering
            reveals the full multi-scale nested taxonomy inherent in observation spaces.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Across 15 focused modules, this laboratory establishes theoretical foundations,
            algebraic recurrence derivations, metric space geometries, from-scratch implementations,
            defensible validation protocols, and production case studies for both bottom-up
            (Agglomerative) and top-down (Divisive) hierarchical methods.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/$slug"
              params={{ slug: "introduction" }}
              className="inline-flex items-center gap-2 rounded-sm bg-navy px-5 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-primary-foreground hover:bg-deep transition-colors shadow-xs"
            >
              <span>Start Learning</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-xs font-mono text-muted-foreground">
              Module 01: Introduction to Hierarchical Clustering
            </span>
          </div>
        </div>
      </ContentCard>

      {/* 2. Learning Objectives */}
      <ContentCard>
        <SectionHeader index={2} title="Learning Objectives" />
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-mono">
            Upon completing this comprehensive learning series, practitioners will achieve verified
            mastery of:
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEARNING_OBJECTIVES.map((obj, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-sm border border-border bg-secondary/30 p-4 space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-teal/10 text-teal text-xs font-mono font-bold border border-teal/20">
                    {idx + 1}
                  </div>
                  <h4 className="text-xs font-bold text-foreground">{obj.title}</h4>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ContentCard>

      {/* 3. Course / Module Overview */}
      <ContentCard>
        <SectionHeader index={3} title="Course & Curriculum Overview" />
        <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
          <p>The curriculum is architected around four foundational pedagogical pillars:</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-sm border border-border bg-card p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-teal font-mono">
                <Cpu className="h-3.5 w-3.5" />
                <span>1. First-Principles Mathematics</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No black boxes. Every objective function, recurrence formula (Lance–Williams), and
                distance norm is derived rigorously from geometric and statistical definitions.
              </p>
            </div>

            <div className="rounded-sm border border-border bg-card p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-navy dark:text-teal font-mono">
                <LineChart className="h-3.5 w-3.5" />
                <span>2. Interactive Visual Geometry</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pure inline vector SVG simulations bridge algebraic equations with spatial
                intuition, allowing dynamic exploration of threshold cuts, dendrograms, and manifold
                behavior.
              </p>
            </div>

            <div className="rounded-sm border border-border bg-card p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-navy dark:text-teal font-mono">
                <GitMerge className="h-3.5 w-3.5" />
                <span>3. Production-Ready Code</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Complete, runnable Python implementations verified against NumPy 2.x, SciPy 1.14+,
                and Scikit-Learn 1.5+ with exact reproducible console outputs.
              </p>
            </div>

            <div className="rounded-sm border border-border bg-card p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-teal font-mono">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>4. Defensible Decision Protocols</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Structured frameworks for selecting cluster counts, diagnosing cophenetic
                distortion, evaluating bootstrap stability, and deploying actionable personas.
              </p>
            </div>
          </div>

          <NoteBox title="Prerequisites & Academic Target">
            <span>
              Targeted at machine learning practitioners, data scientists, and computational
              researchers. Foundational familiarity with basic linear algebra, Euclidean vector
              norms, and Python is helpful; all clustering mechanics are derived step-by-step from
              first principles.
            </span>
          </NoteBox>
        </div>
      </ContentCard>

      {/* 4. Learning Roadmap */}
      <ContentCard>
        <SectionHeader index={4} title="Four-Stage Learning Roadmap" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((groupName, idx) => {
            const count = pages.filter((p) => p.group === groupName).length;
            const meta = STAGE_METADATA[groupName] ?? {
              desc: "Structured curricular phase.",
              modules: `${count} Modules`,
              outcome: "Master core concepts.",
            };
            return (
              <div
                key={groupName}
                className="flex flex-col justify-between rounded-sm border border-border bg-secondary/20 p-4 space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span className="text-teal font-semibold">STAGE 0{idx + 1}</span>
                    <span>{meta.modules}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-foreground">{groupName}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{meta.desc}</p>
                </div>
                <div className="pt-3 border-t border-border/60">
                  <span className="text-[10px] font-mono text-teal font-medium uppercase tracking-wider block">
                    Core Competency:
                  </span>
                  <p className="text-[11px] text-foreground mt-0.5">{meta.outcome}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ContentCard>

      {/* 5. Topic Navigation Cards / Structured Topic Index */}
      <ContentCard>
        <SectionHeader index={5} title="Structured Topic Index" />
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {learningModules.map((page, idx) => {
            const Icon = page.icon;
            return (
              <Link
                key={page.slug}
                to="/$slug"
                params={{ slug: page.slug }}
                className="group flex min-w-0 items-start gap-3 rounded-sm border border-border bg-secondary/10 p-3 hover:border-navy hover:bg-secondary/40 transition-all"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-background border border-border text-teal group-hover:text-navy transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      MODULE {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-border">·</span>
                    <span className="text-[10px] text-muted-foreground font-mono truncate">
                      {page.group}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-bold text-foreground group-hover:text-navy transition-colors truncate">
                    {page.title}
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-navy group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </Link>
            );
          })}
        </div>
      </ContentCard>
    </PageShell>
  );
}
