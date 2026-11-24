import type { LucideIcon } from "lucide-react";
import {
  Compass,
  BookOpen,
  Layers,
  GitFork,
  GitMerge,
  Split,
  Link2,
  Ruler,
  Network,
  Sigma,
  Code2,
  Gauge,
  Scale,
  AlertTriangle,
  Briefcase,
  FolderKanban,
} from "lucide-react";

export type BlockKind =
  "content" | "math" | "diagram" | "code" | "viz" | "viz-large" | "output" | "table" | "note";
export interface Block {
  kind: BlockKind;
  label?: string;
  columns?: string[];
  rows?: string[];
}
export interface Section {
  title: string;
  description?: string;
  blocks: Block[];
}
export interface CoursePage {
  slug: string;
  title: string;
  subtitle?: string;
  group: string;
  icon: LucideIcon;
  sections: Section[];
}

const c = (label?: string): Block => ({ kind: "content", ...(label ? { label } : {}) });
const m = (label?: string): Block => ({ kind: "math", ...(label ? { label } : {}) });
const d = (label?: string): Block => ({ kind: "diagram", ...(label ? { label } : {}) });
const s = (title: string, ...blocks: Block[]): Section => ({
  title,
  blocks: blocks.length ? blocks : [c()],
});

const linkage = (name: string) =>
  s(
    name,
    c("Definition"),
    m("Mathematical formula"),
    d("Geometric diagram"),
    c("Advantages and disadvantages"),
  );

const metric = (name: string) =>
  s(
    name,
    c("Definition & properties"),
    m("Mathematical formula"),
    m("Numerical calculation example"),
    c("Practical context"),
  );

const impl = (name: string) =>
  s(
    name,
    c("Explanation"),
    { kind: "code", label: "Code editor" },
    { kind: "output", label: "Console output" },
    { kind: "viz", label: "Visualization placeholder" },
  );

const evalM = (name: string) =>
  s(name, c("Definition & rationale"), m("Formula"), c("Interpretation criteria"), {
    kind: "output",
    label: "Example evaluation results",
  });

const cmp = (otherAlgorithm: string): Block => ({
  kind: "table",
  columns: ["Criterion", otherAlgorithm, "Hierarchical Clustering"],
  rows: [
    "Clustering Paradigm",
    "Predefined Number of Clusters (k)",
    "Cluster Shape Assumption",
    "Time Complexity",
    "Space Complexity",
    "Scalability to Large Datasets",
    "Sensitivity to Outliers & Noise",
    "Interpretability (Dendrogram)",
    "Deterministic Output",
  ],
});

export const pages: CoursePage[] = [
  {
    slug: "",
    title: "Overview",
    group: "Getting Started",
    icon: Compass,
    subtitle:
      "A comprehensive university-grade learning laboratory for hierarchical clustering algorithms, mathematical foundations, and practical implementations.",
    sections: [],
  },
  {
    slug: "introduction",
    title: "Introduction to Hierarchical Clustering",
    group: "Getting Started",
    icon: BookOpen,
    subtitle:
      "Core intuition, foundational concepts, and landscape of hierarchical clustering in unsupervised machine learning.",
    sections: [
      s("Introduction", c("Overview of unsupervised learning and clustering")),
      s(
        "What is Clustering?",
        c("Definition and partitioning intuition"),
        d("Clustering concept overview"),
      ),
      s(
        "What is Hierarchical Clustering?",
        c("Tree-structured cluster organization"),
        d("Hierarchy illustration"),
      ),
      s("Applications", c("Key domains benefiting from hierarchical representations")),
      s("Key Concepts", c("Dendrograms, proximity matrices, and nested clusters"), {
        kind: "note",
      }),
    ],
  },
  {
    slug: "fundamentals",
    title: "Fundamentals",
    group: "Getting Started",
    icon: Layers,
    subtitle:
      "Underlying principles of hierarchical structures, distance measurements, linkage criteria, and tree representations.",
    sections: [
      s(
        "Hierarchical Structure",
        c("Nested partitions and tree topology"),
        d("Hierarchical tree decomposition"),
      ),
      s(
        "Distance Between Data Points",
        c("Point-to-point proximity representations"),
        m("Pointwise distance formulation"),
      ),
      s(
        "Distance Between Clusters",
        c("Pairwise cluster distance concepts"),
        m("Cluster distance formulation"),
        d("Inter-cluster distance geometry"),
      ),
      s(
        "Linkage Criteria",
        c("Role of linkage in forming cluster geometries"),
        m("Generalized linkage metric"),
      ),
      s(
        "Dendrogram Fundamentals",
        c("Anatomy of the dendrogram diagram"),
        d("Dendrogram components and axes"),
      ),
    ],
  },
  {
    slug: "types",
    title: "Types of Hierarchical Clustering",
    group: "Core Algorithms",
    icon: GitFork,
    subtitle:
      "A detailed comparison of bottom-up (Agglomerative) and top-down (Divisive) algorithmic paradigms.",
    sections: [
      s(
        "Agglomerative Clustering",
        c("Bottom-up aggregation mechanism"),
        d("Agglomerative progression diagram"),
      ),
      s(
        "Divisive Clustering",
        c("Top-down recursive splitting mechanism"),
        d("Divisive decomposition diagram"),
      ),
      s(
        "Comparison of Paradigms",
        c("Comparative analysis of time complexity and top-level decision precision"),
        {
          kind: "table",
          columns: ["Characteristic", "Agglomerative (Bottom-Up)", "Divisive (Top-Down)"],
          rows: [
            "Starting Condition",
            "Termination Condition",
            "Direction of Computation",
            "Time Complexity (Naive)",
            "Optimal Sub-splitting Problem",
            "Accuracy of High-Level Clusters",
            "Accuracy of Low-Level Clusters",
            "Frequency of Practical Use",
          ],
        },
      ),
    ],
  },
  {
    slug: "agglomerative",
    title: "Agglomerative Clustering",
    group: "Core Algorithms",
    icon: GitMerge,
    subtitle: "In-depth mechanical decomposition of the bottom-up clustering pipeline.",
    sections: [
      s(
        "Working Mechanism",
        c("Iterative nearest-pair merging pipeline"),
        d("Agglomerative iterative flow"),
      ),
      s("Initialisation", c("Singleton cluster setup and initial distance matrix construction")),
      s(
        "Distance Calculation",
        c("Pairwise metric computation across all samples"),
        m("Pairwise distance matrix"),
      ),
      s("Cluster Assignment", c("Identification of the global minimum distance pair")),
      s(
        "Cluster Merging",
        c("Forming composite clusters and index remapping"),
        d("Merge event visualization"),
      ),
      s(
        "Updating Distances",
        c("Updating distance matrix rows and columns using linkage"),
        m("Matrix update formulation"),
      ),
      s(
        "Stopping Criteria",
        c("Convergence when single root cluster or target threshold is reached"),
        { kind: "note" },
      ),
      s("Step-by-Step Algorithm Walkthrough", {
        kind: "viz-large",
        label: "Reserved step-by-step algorithm animation workspace",
      }),
    ],
  },
  {
    slug: "divisive",
    title: "Divisive Clustering",
    group: "Core Algorithms",
    icon: Split,
    subtitle:
      "Top-down hierarchical partitioning, recursive bi-partitioning mechanisms, and trade-offs.",
    sections: [
      s(
        "Top-down Approach",
        c("Starting from a universal cluster down to singletons"),
        d("Top-down tree branching diagram"),
      ),
      s(
        "Splitting Mechanism",
        c("Finding optimal bi-partitions (e.g. 2-means, spectral splitting)"),
        m("Splitting criterion optimization"),
      ),
      s(
        "Algorithm Workflow",
        c("Recursive sub-clustering workflow and priority queues"),
        d("Workflow execution chart"),
      ),
      s(
        "Comparison with Agglomerative Clustering",
        c("Detailed trade-offs between split quality and merge efficiency"),
        {
          kind: "table",
          columns: ["Aspect", "Divisive Clustering", "Agglomerative Clustering"],
          rows: [
            "Computational Bottleneck",
            "Splitting Heuristics",
            "Sensitivity to Early Choices",
            "Software Support (SciPy/sklearn)",
            "Suitability for Few Clusters",
          ],
        },
      ),
    ],
  },
  {
    slug: "linkage",
    title: "Linkage Methods",
    group: "Core Algorithms",
    icon: Link2,
    subtitle:
      "Mathematical definitions, geometrical behaviors, and trade-offs of major cluster linkage criteria.",
    sections: [
      linkage("Single Linkage"),
      linkage("Complete Linkage"),
      linkage("Average Linkage (UPGMA)"),
      linkage("Centroid Linkage (UPGMC)"),
      linkage("Ward's Minimum Variance Linkage"),
    ],
  },
  {
    slug: "distance-metrics",
    title: "Distance Metrics",
    group: "Core Algorithms",
    icon: Ruler,
    subtitle:
      "Formulations and geometric implications of metrics used to compute similarity between points.",
    sections: [
      metric("Euclidean Distance"),
      metric("Manhattan Distance"),
      metric("Minkowski Distance"),
      metric("Cosine Distance"),
    ],
  },
  {
    slug: "dendrograms",
    title: "Dendrograms",
    group: "Core Algorithms",
    icon: Network,
    subtitle:
      "Constructing, reading, and cutting hierarchical tree visualizations to determine optimal clusters.",
    sections: [
      s(
        "Dendrogram Structure",
        c("U-shaped links, cophenetic distance, and leaf ordering"),
        d("Anatomical dendrogram diagram"),
      ),
      s(
        "How Dendrograms are Constructed",
        c("Mapping merge heights to linkage distances"),
        d("Step-by-step tree growth"),
      ),
      s(
        "How to Interpret Dendrograms",
        c("Reading vertical jump lengths to identify distinct clusters"),
      ),
      s(
        "How to Select the Number of Clusters",
        c("Finding largest vertical gaps without intersecting horizontal lines"),
        { kind: "note" },
      ),
      s(
        "Cutting a Dendrogram",
        c("Horizontal cutting threshold and extraction of discrete labels"),
        d("Dendrogram horizontal slice diagram"),
        m("Threshold criterion"),
      ),
      s("Interactive Dendrogram Workspace", {
        kind: "viz-large",
        label: "Reserved interactive dendrogram tree-cutter workspace",
      }),
    ],
  },
  {
    slug: "mathematics",
    title: "Mathematical Foundation",
    group: "Theory & Practice",
    icon: Sigma,
    subtitle:
      "Formal mathematical formulation of distance updates, Lance-Williams recurrences, and numerical proofs.",
    sections: [
      s(
        "Distance Calculations",
        c("Metric spaces, distance properties, and matrix properties"),
        m("Normed distance properties"),
        m("Pairwise distance matrix formulation"),
      ),
      s(
        "Linkage Calculations",
        c("Lance-Williams recurrence equation for updating distances between clusters"),
        m("General Lance-Williams recurrence formula"),
        m("Parameter table for common linkages"),
      ),
      s(
        "Cluster Merging Calculations",
        c("Centroid displacement and within-cluster sum of squares update"),
        m("Ward's variance update derivation"),
        d("Geometric variance reduction"),
      ),
      s(
        "Worked Numerical Examples",
        c("Complete manual calculation on a synthetic 4-point dataset"),
        m("Initial distance matrix calculation"),
        m("First merge step and distance table update"),
      ),
    ],
  },
  {
    slug: "implementation",
    title: "Practical Implementation",
    group: "Theory & Practice",
    icon: Code2,
    subtitle: "Code blueprints and execution workflows across NumPy, SciPy, and Scikit-Learn.",
    sections: [
      impl("Python Implementation from Scratch using NumPy"),
      impl("Implementation using SciPy (scipy.cluster.hierarchy)"),
      impl("Implementation using Scikit-learn (sklearn.cluster.AgglomerativeClustering)"),
    ],
  },
  {
    slug: "evaluation",
    title: "Model Evaluation",
    group: "Theory & Practice",
    icon: Gauge,
    subtitle:
      "Internal and hierarchical validation metrics to assess cluster validity and dendrogram fidelity.",
    sections: [
      evalM("Silhouette Score"),
      evalM("Davies-Bouldin Index"),
      evalM("Cophenetic Correlation Coefficient"),
    ],
  },
  {
    slug: "comparison",
    title: "Algorithm Comparison",
    group: "Theory & Practice",
    icon: Scale,
    subtitle:
      "Side-by-side benchmarking against centroid-based and density-based clustering paradigms.",
    sections: [
      s(
        "K-Means vs Hierarchical Clustering",
        c("Comparison across clustering philosophy, speed, and rigidity"),
        cmp("K-Means"),
      ),
      s(
        "DBSCAN vs Hierarchical Clustering",
        c("Comparison across noise tolerance, non-globular shapes, and density variations"),
        cmp("DBSCAN"),
      ),
    ],
  },
  {
    slug: "limitations",
    title: "Limitations",
    group: "Applied Learning",
    icon: AlertTriangle,
    subtitle: "Algorithmic constraints, computational scaling bottlenecks, and noise sensitivity.",
    sections: [
      s(
        "Computational Complexity",
        c("O(N^2) space and O(N^3) or O(N^2 log N) time complexity"),
        m("Big-O complexity bounds"),
      ),
      s(
        "Scalability",
        c("Memory and compute barriers on large-scale datasets"),
        d("Scalability comparison curve"),
      ),
      s(
        "Sensitivity to Outliers",
        c("How extreme values distort merge hierarchies and linkage bridges"),
        d("Outlier distortion diagram"),
      ),
    ],
  },
  {
    slug: "applications",
    title: "Real-world Applications",
    group: "Applied Learning",
    icon: Briefcase,
    subtitle:
      "Real-world industrial, biological, and linguistic applications of hierarchical clustering.",
    sections: [
      s(
        "Customer Segmentation",
        c("Constructing customer personas and behavioral purchase hierarchies"),
        d("Market segment hierarchy"),
      ),
      s(
        "Biological Classification",
        c("Phylogenetic tree reconstruction and gene expression grouping"),
        d("Phylogeny tree visualization"),
      ),
      s(
        "Document Clustering",
        c("Topic taxonomies and hierarchical text categorization"),
        d("Topic taxonomy hierarchy"),
      ),
    ],
  },
  {
    slug: "projects",
    title: "Hands-on Projects",
    group: "Applied Learning",
    icon: FolderKanban,
    subtitle:
      "Applied capstone project blueprints with datasets, problem statements, and implementation guidelines.",
    sections: [],
  },
];

export const groups = Array.from(new Set(pages.map((p) => p.group)));

export const findPage = (slug: string) => {
  // Support aliases for backward compatibility or direct queries
  if (slug === "limitations-applications") return pages.findIndex((p) => p.slug === "limitations");
  return pages.findIndex((p) => p.slug === slug);
};
