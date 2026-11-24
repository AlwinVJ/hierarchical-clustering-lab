import type { LucideIcon } from "lucide-react";
import {
  Compass, BookOpen, Layers, GitFork, GitMerge, Split, Link2, Ruler, Network,
  Sigma, Code2, Gauge, Scale, AlertTriangle, FolderKanban,
} from "lucide-react";

export type BlockKind = "content" | "math" | "diagram" | "code" | "viz" | "viz-large" | "output" | "table" | "note";
export interface Block { kind: BlockKind; label?: string; columns?: string[]; rows?: string[] }
export interface Section { title: string; blocks: Block[] }
export interface CoursePage {
  slug: string; title: string; short: string; group: string; icon: LucideIcon; sections: Section[];
}

const c = (label?: string): Block => ({ kind: "content", ...(label ? { label } : {}) });
const m = (label?: string): Block => ({ kind: "math", ...(label ? { label } : {}) });
const d = (label?: string): Block => ({ kind: "diagram", ...(label ? { label } : {}) });
const s = (title: string, ...blocks: Block[]): Section => ({ title, blocks: blocks.length ? blocks : [c()] });

const linkage = (name: string) =>
  s(name, c("Definition"), m("Mathematical formula"), d(), c("Advantages"), c("Disadvantages"));
const metric = (name: string) => s(name, c(), m("Formula"), m("Numerical example"));
const impl = (name: string) =>
  s(name, c("Explanation"), { kind: "code", label: "Code editor" }, { kind: "output" }, { kind: "viz" });
const evalM = (name: string) => s(name, c(), m("Formula"), c("Interpretation"));
const cmp = (a: string): Block => ({
  kind: "table", columns: ["Criterion", a, "Hierarchical Clustering"],
  rows: ["Approach", "Number of clusters", "Cluster shape", "Complexity", "Scalability", "Sensitivity to outliers", "Typical use cases"],
});

export const pages: CoursePage[] = [
  { slug: "", title: "Overview", short: "overview", group: "Getting Started", icon: Compass, sections: [] },
  { slug: "introduction", title: "Introduction", short: "intro", group: "Getting Started", icon: BookOpen, sections: [
    s("Introduction to Clustering"), s("What is Hierarchical Clustering?", c(), d()), s("Applications"), s("Key Concepts", c(), { kind: "note" }),
  ]},
  { slug: "fundamentals", title: "Fundamentals", short: "", group: "Getting Started", icon: Layers, sections: [
    s("Hierarchical Structure", c(), d()), s("Distance Between Data Points", c(), m()),
    s("Distance Between Clusters", c(), m(), d()), s("Linkage Criteria", c(), m()), s("Dendrogram Fundamentals", c(), d()),
  ]},
  { slug: "types", title: "Types of Hierarchical Clustering", short: "", group: "Core Algorithms", icon: GitFork, sections: [
    s("Agglomerative Clustering", c(), d()), s("Divisive Clustering", c(), d()),
    s("Comparison", { kind: "table", columns: ["Aspect", "Agglomerative", "Divisive"], rows: ["Direction", "Starting point", "Complexity", "Common usage"] }),
  ]},
  { slug: "agglomerative", title: "Agglomerative Clustering", short: "", group: "Core Algorithms", icon: GitMerge, sections: [
    s("Working Mechanism", c(), d()), s("Initialisation"), s("Distance Calculation", c(), m()), s("Cluster Assignment"),
    s("Cluster Merging", c(), d()), s("Distance Updates", c(), m()), s("Stopping Criteria", c(), { kind: "note" }),
    s("Interactive Walkthrough", { kind: "viz-large" }),
  ]},
  { slug: "divisive", title: "Divisive Clustering", short: "", group: "Core Algorithms", icon: Split, sections: [
    s("Top-down Approach", c(), d()), s("Splitting Mechanism", c(), m()), s("Algorithm Workflow", c(), d()),
    s("Comparison with Agglomerative Clustering", { kind: "table", columns: ["Aspect", "Divisive", "Agglomerative"], rows: ["Direction", "Split / merge rule", "Complexity", "Accuracy at top levels"] }),
  ]},
  { slug: "linkage", title: "Linkage Methods", short: "", group: "Core Algorithms", icon: Link2, sections: [
    linkage("Single Linkage"), linkage("Complete Linkage"), linkage("Average Linkage"), linkage("Centroid Linkage"), linkage("Ward's Linkage"),
  ]},
  { slug: "distance-metrics", title: "Distance Metrics", short: "", group: "Core Algorithms", icon: Ruler, sections: [
    metric("Euclidean Distance"), metric("Manhattan Distance"), metric("Minkowski Distance"), metric("Cosine Distance"),
  ]},
  { slug: "dendrograms", title: "Dendrograms", short: "", group: "Core Algorithms", icon: Network, sections: [
    s("Dendrogram Structure", c(), d()), s("Construction Process", c(), d()), s("Interpretation"),
    s("Selecting the Number of Clusters", c(), { kind: "note" }), s("Cutting a Dendrogram", c(), d()),
    s("Interactive Dendrogram", { kind: "viz-large" }),
  ]},
  { slug: "mathematics", title: "Mathematical Foundation", short: "", group: "Theory & Practice", icon: Sigma, sections: [
    s("Distance Calculations", m(), m()), s("Linkage Calculations", m(), m()), s("Cluster Merging Calculations", m(), d()),
    s("Worked Numerical Examples", m("Example 1"), m("Example 2")),
  ]},
  { slug: "implementation", title: "Practical Implementation", short: "", group: "Theory & Practice", icon: Code2, sections: [
    impl("NumPy Implementation from Scratch"), impl("SciPy Implementation"), impl("Scikit-learn Implementation"),
  ]},
  { slug: "evaluation", title: "Model Evaluation", short: "", group: "Theory & Practice", icon: Gauge, sections: [
    evalM("Silhouette Score"), evalM("Davies-Bouldin Index"), evalM("Cophenetic Correlation Coefficient"),
  ]},
  { slug: "comparison", title: "Algorithm Comparison", short: "", group: "Theory & Practice", icon: Scale, sections: [
    s("K-Means vs Hierarchical Clustering", c(), cmp("K-Means")), s("DBSCAN vs Hierarchical Clustering", c(), cmp("DBSCAN")),
  ]},
  { slug: "limitations-applications", title: "Limitations and Applications", short: "", group: "Applied Learning", icon: AlertTriangle, sections: [
    s("Computational Complexity", c(), m()), s("Scalability"), s("Sensitivity to Outliers", c(), d()),
    s("Customer Segmentation"), s("Biological Classification", c(), d()), s("Document Clustering"),
  ]},
  { slug: "projects", title: "Hands-on Projects", short: "", group: "Applied Learning", icon: FolderKanban, sections: [] },
];

export const groups = Array.from(new Set(pages.map((p) => p.group)));
export const findPage = (slug: string) => pages.findIndex((p) => p.slug === slug);
