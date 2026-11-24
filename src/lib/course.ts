import type { LucideIcon } from "lucide-react";
import { createElement, type ReactNode } from "react";
import { ParadigmComparisonVisualizer, Module03Quiz } from "@/content/module03-types";
import { AgglomerativeSimulator, Module04Quiz } from "@/content/module04-agglomerative";
import { DianaSimulator, Module05Quiz } from "@/content/module05-divisive";
import {
  SingleLinkageChainingVisualizer,
  CentroidLinkageInversionVisualizer,
  WardVarianceIncreaseCalculator,
  LanceWilliamsExplorer,
  Module06Quiz,
} from "@/content/module06-linkage";
import {
  DistanceMetricExplorer,
  CurseOfDimensionalitySimulator,
  Module07Quiz,
} from "@/content/module07-metrics";
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
  | "content"
  | "math"
  | "diagram"
  | "code"
  | "viz"
  | "viz-large"
  | "output"
  | "table"
  | "note"
  | "custom";

export interface Block {
  kind: BlockKind;
  label?: string;
  columns?: string[];
  rows?: string[];
  tex?: string;
  description?: string;
  content?: ReactNode;
  code?: string;
  output?: string;
  noteTitle?: string;
  tableData?: Record<string, string[]>;
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

const c = (label?: string, content?: ReactNode): Block => ({
  kind: "content",
  ...(label ? { label } : {}),
  ...(content ? { content } : {}),
});
const m = (label?: string, tex?: string, description?: string): Block => ({
  kind: "math",
  ...(label ? { label } : {}),
  ...(tex ? { tex } : {}),
  ...(description ? { description } : {}),
});
const d = (label?: string): Block => ({ kind: "diagram", ...(label ? { label } : {}) });
const n = (title: string, content?: ReactNode): Block => ({
  kind: "note",
  noteTitle: title,
  ...(content ? { content } : {}),
});
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
      s(
        "Introduction",
        c(
          "Foundations of Unsupervised Learning",
          "In machine learning, clustering is the fundamental unsupervised task of partitioning unlabeled observations into natural groupings based on geometric or statistical affinity. Unlike supervised learning, where an explicit response variable guides model optimization, clustering models explore the geometry of feature space directly without ground-truth supervisory signals.",
        ),
        {
          kind: "table",
          columns: [
            "Dimension",
            "Supervised Learning",
            "Partition-Based (K-Means)",
            "Hierarchical Clustering",
          ],
          rows: [
            "Ground Truth Labels",
            "Cluster Count (k)",
            "Output Topology",
            "Optimization Determinism",
            "Computational Complexity",
          ],
          tableData: {
            "Ground Truth Labels": [
              "Required (labels y)",
              "None (explores feature space)",
              "None (discovers multi-level manifolds)",
            ],
            "Cluster Count (k)": [
              "Pre-fixed by class labels",
              "Must be specified upfront",
              "Discovered post-hoc via tree cuts",
            ],
            "Output Topology": [
              "Decision boundary functions",
              "Flat Voronoi partitioning",
              "Nested tree hierarchy (dendrogram)",
            ],
            "Optimization Determinism": [
              "Deterministic once converged",
              "Non-deterministic (random seeds)",
              "Fully deterministic on distance matrix",
            ],
            "Computational Complexity": [
              "O(N · d) per epoch",
              "O(N · k · d · i) linear in N",
              "O(N²) space, O(N² log N) to O(N³) compute",
            ],
          },
        },
      ),
      s(
        "What is Clustering?",
        c(
          "Mathematical Objective of Cluster Analysis",
          "Mathematically, clustering maps N observation vectors into K disjoint subsets such that observations assigned to the same subset exhibit high mutual similarity, while observations assigned to distinct subsets exhibit high mutual dissimilarity.",
        ),
        m(
          "Objective Intuition: Within-Cluster Dispersion",
          String.raw`W(C) = \frac{1}{2} \sum_{k=1}^K \sum_{i, j \in C_k} \|\mathbf{x}_i - \mathbf{x}_j\|^2`,
          "Clustering seeks partitions that minimize within-cluster pairwise dissimilarity W(C) while maximizing separation between cluster boundaries.",
        ),
        d("Feature space partitioning and cluster boundary geometries"),
      ),
      s(
        "What is Hierarchical Clustering?",
        c(
          "Multi-Scale Nested Partition Sequences",
          "Hierarchical clustering builds an entire hierarchy of nested clusters from individual observations up to a single universal root. Because all intermediate granularities are preserved in a tree structure, domain experts can inspect macro-clusters and micro-clusters simultaneously without choosing a single arbitrary k in advance.",
        ),
        m(
          "Formal Sequence of Nested Partitions",
          String.raw`\mathcal{P}_0 = \{\{1\}, \dots, \{N\}\} \prec \mathcal{P}_1 \prec \dots \prec \mathcal{P}_{N-1} = \{S\}`,
          "A hierarchical clustering of N observations forms a sequence of N nested partitions where each stage merges two existing clusters or splits an existing cluster.",
        ),
        n(
          "Agglomerative vs. Divisive Paradigms",
          "Hierarchical algorithms proceed in one of two opposite directions: Agglomerative (bottom-up, iteratively merging the closest pair of clusters from N singletons) or Divisive (top-down, recursively splitting a single universal cluster until N singletons remain).",
        ),
      ),
      s(
        "Applications",
        c(
          "Cross-Disciplinary Real-World Applications",
          "Hierarchical clustering is widely applied where data naturally conforms to taxonomies or multi-scale groupings:",
        ),
        {
          kind: "table",
          columns: [
            "Domain",
            "Application",
            "Distance / Linkage Strategy",
            "Typical Value Delivered",
          ],
          rows: ["Bioinformatics", "Document NLP", "Marketing", "Geospatial"],
          tableData: {
            Bioinformatics: [
              "Phylogenetic tree reconstruction & gene co-expression",
              "Correlation distance + Average / Complete linkage",
              "Uncovers evolutionary lineages and shared regulatory pathways",
            ],
            "Document NLP": [
              "Topic taxonomy construction & ontology mining",
              "Cosine distance + Complete / Ward linkage",
              "Builds multi-tier hierarchical category taxonomies from text embeddings",
            ],
            Marketing: [
              "Multi-tier customer behavioral segmentation",
              "Standardized Euclidean + Ward's linkage",
              "Identifies macro-segments (e.g. enterprise vs retail) and micro-personas",
            ],
            Geospatial: [
              "Urban transit zone & regional facility grouping",
              "Manhattan / Haversine distance + Single linkage",
              "Reveals commuter corridors and geographical catchment areas",
            ],
          },
        },
      ),
      s(
        "Key Concepts",
        c(
          "The Four Foundational Pillars",
          "To master hierarchical clustering, four core components must be understood: 1) The Proximity Matrix (symmetric observation distances), 2) Linkage Criteria (how distances between entire clusters are calculated), 3) The Dendrogram (the tree graph recording merge history), and 4) Tree Cutting (the horizontal slice that produces discrete clusters).",
        ),
        n(
          "Critical Heuristic: Greedy Irreversibility",
          "A fundamental property of classical hierarchical clustering is greedy irreversibility: once two clusters merge in agglomerative clustering, that merge is permanent and immutable for all higher levels. Early merge errors propagate upward.",
        ),
        c(
          "Authoritative Academic References",
          "Verified against Kaufman & Rousseeuw (1990) Ch. 1 & 6; Murtagh & Contreras (2012); Scikit-learn User Guide §2.3. See docs/references.md for complete bibliographical citations.",
        ),
      ),
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
        c(
          "Feature Space Representations",
          "Every observation is represented as a d-dimensional coordinate vector in feature space. Spatial proximity between points serves as a proxy for semantic similarity in the domain problem.",
        ),
        m(
          "Dataset Matrix Representation",
          String.raw`X = \begin{bmatrix} \mathbf{x}_1^T \\ \mathbf{x}_2^T \\ \vdots \\ \mathbf{x}_N^T \end{bmatrix} \in \mathbb{R}^{N \times d}, \quad \mathbf{x}_i = (x_{i1}, x_{i2}, \dots, x_{id}) \in \mathbb{R}^d`,
          "Each row of matrix X represents an observation, and each column represents a measured feature.",
        ),
        d("Decomposition of continuous feature space into nested hierarchical partitions"),
      ),
      s(
        "Distance Between Data Points",
        c(
          "Similarity, Dissimilarity, and Metric Axioms",
          "A distance function d(x, y) quantifies the dissimilarity between two observation vectors. To qualify as a formal metric, it must satisfy four fundamental axioms: Non-negativity, Identity of indiscernibles, Symmetry, and the Triangle inequality.",
        ),
        m(
          "The Four Metric Axioms",
          String.raw`d(\mathbf{x}, \mathbf{y}) \ge 0; \quad d(\mathbf{x}, \mathbf{y})=0 \iff \mathbf{x}=\mathbf{y}; \quad d(\mathbf{x}, \mathbf{y})=d(\mathbf{y}, \mathbf{x}); \quad d(\mathbf{x}, \mathbf{z}) \le d(\mathbf{x}, \mathbf{y}) + d(\mathbf{y}, \mathbf{z})`,
          "These four properties guarantee coherent geometric behavior without topological contradictions.",
        ),
        m(
          "Euclidean Distance (L2 Norm)",
          String.raw`d_2(\mathbf{x}_i, \mathbf{x}_j) = \|\mathbf{x}_i - \mathbf{x}_j\|_2 = \sqrt{\sum_{k=1}^d (x_{ik} - x_{jk})^2}`,
          "The standard straight-line metric in Euclidean space.",
        ),
        m(
          "Manhattan Distance (L1 Norm)",
          String.raw`d_1(\mathbf{x}_i, \mathbf{x}_j) = \|\mathbf{x}_i - \mathbf{x}_j\|_1 = \sum_{k=1}^d |x_{ik} - x_{jk}|`,
          "Sum of absolute coordinate differences, robust against moderate outliers.",
        ),
      ),
      s(
        "Distance Between Clusters",
        c(
          "Observation Distance vs. Cluster Distance: The Conceptual Leap",
          "While observation distance measures the gap between two single points, cluster distance measures the gap between two sets of points. Defining this inter-set gap requires a linkage criterion.",
        ),
        m(
          "Generalized Cluster Linkage Function",
          String.raw`\mathcal{D}(C_A, C_B) = f(\{d(\mathbf{x}_i, \mathbf{x}_j) : \mathbf{x}_i \in C_A, \mathbf{x}_j \in C_B\})`,
          "The linkage function f maps pairwise observation distances into a single scalar dissimilarity between clusters C_A and C_B.",
        ),
        d("Geometric visualization of inter-cluster distance definitions"),
      ),
      s(
        "Linkage Criteria",
        c(
          "Linkage Criteria & Induced Cluster Geometries",
          "The linkage criterion directly determines which clusters are considered closest at every step. Single linkage uses minimum pairwise distance, complete linkage uses maximum distance, average linkage uses mean distance, and Ward's method minimizes within-cluster variance increase.",
        ),
        m(
          "Lance-Williams Generalized Recurrence",
          String.raw`D(A \cup B, C) = \alpha_A D(A, C) + \alpha_B D(B, C) + \beta D(A, B) + \gamma |D(A, C) - D(B, C)|`,
          "Lance and Williams (1967) proved that all major linkages update distances using this single linear recurrence equation.",
        ),
        n(
          "Geometric Biases of Linkages",
          "Single linkage can follow elongated, non-globular paths but is prone to chaining noise bridges. Complete linkage and Ward's linkage enforce compact, roughly spherical clusters.",
        ),
      ),
      s(
        "Dendrogram Fundamentals",
        c(
          "Anatomy of the Dendrogram & Verified 4-Point Numerical Example",
          "A dendrogram maps the complete merge history: observations are positioned on the leaf axis at height 0, and horizontal bars connect clusters at vertical heights equal to their merge dissimilarity.",
        ),
        m(
          "Verified 4-Point Distance Matrix",
          String.raw`\mathbf{D} = \begin{bmatrix} 0.0000 & 1.4142 & 5.8310 & 7.2111 \\ 1.4142 & 0.0000 & 4.4721 & 5.8310 \\ 5.8310 & 4.4721 & 0.0000 & 1.4142 \\ 7.2111 & 5.8310 & 1.4142 & 0.0000 \end{bmatrix}`,
          "Verified pairwise Euclidean distance matrix for P_1(1,2), P_2(2,3), P_3(6,5), P_4(7,6). Global minimum distance is 1.4142, merging (P_1, P_2) first.",
        ),
        n(
          "Condensed Distance Vectors in SciPy",
          "SciPy avoids storing redundant NxN matrices by utilizing a condensed 1D array of size N(N-1)/2. For N=4, this requires exactly 6 values: [1.4142, 5.8310, 7.2111, 4.4721, 5.8310, 1.4142], indexed by k = N·i - i(i+1)/2 + j - i - 1.",
        ),
        c(
          "Chapter References",
          "References: Sokal & Rohlf (1962); Lance & Williams (1967); SciPy Spatial Distance Documentation. See docs/references.md.",
        ),
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
        "Introduction to Hierarchical Paradigms",
        c(
          "Two Complementary Search Strategies",
          "Hierarchical clustering algorithms construct an organized tree hierarchy through two opposing computational philosophies: Agglomerative (bottom-up aggregation) and Divisive (top-down recursive splitting). While both paradigms converge to a complete nested tree structure, they traverse the hypothesis space from opposite boundary conditions and exhibit distinct computational, mathematical, and practical trade-offs.",
        ),
      ),
      s(
        "Agglomerative Clustering",
        c(
          "Bottom-Up Merging Mechanics",
          "Agglomerative clustering is the most common paradigm in applied machine learning. It initializes every observation as an independent singleton cluster (N clusters in total) and proceeds through N-1 greedy merge iterations. At each step, it identifies and coalesces the two clusters exhibiting minimal inter-cluster dissimilarity according to a chosen linkage criterion.",
        ),
        m(
          "Greedy Merge Selection",
          String.raw`(A^*, B^*) = \arg\min_{A, B \in \mathcal{P}_t, A \neq B} \mathcal{D}(A, B)`,
          "At iteration t, the algorithm greedily identifies the pair of clusters with the global minimum linkage distance.",
        ),
        n(
          "Greedy Irreversibility",
          "Agglomerative clustering makes irreversible local decisions: once two points merge, they remain unified throughout all subsequent macro-stages. Any early merge error induced by noise or outlier bridges propagates upward.",
        ),
        d("Bottom-up merge progression from singletons to root"),
      ),
      s(
        "Divisive Clustering",
        c(
          "Top-Down Recursive Partitioning",
          "Divisive clustering operates in reverse: it begins with a single universal cluster containing all N observations and recursively partitions clusters until N singleton clusters remain. While top-down clustering has access to global structural context from the beginning, finding the mathematically optimal binary partition of a cluster of size m is computationally intractable.",
        ),
        m(
          "Combinatorial Splitting Complexity",
          String.raw`\text{Possible non-empty binary splits} = 2^{m-1} - 1`,
          "An exhaustive search for the optimal binary split of m points grows exponentially, requiring O(2^m) operations. For m = 50, this exceeds 10^14 evaluations.",
        ),
        c(
          "DIANA (Divisive Analysis) Algorithm Heuristic",
          "To bypass combinatorial explosion, Kaufman & Rousseeuw (1990) designed DIANA. DIANA identifies the cluster with the largest diameter (maximum pairwise dissimilarity), initializes a splinter group with the observation having the highest average distance to others, and iteratively reassigns points that are closer to the splinter group on average.",
        ),
        m(
          "Cluster Diameter Criterion in DIANA",
          String.raw`\text{diam}(C) = \max_{\mathbf{x}_i, \mathbf{x}_j \in C} d(\mathbf{x}_i, \mathbf{x}_j)`,
          "DIANA selects the cluster with maximum diameter to subdivide, focusing computation on the most widely dispersed group.",
        ),
        d("Top-down splinter group progression from root to leaves"),
      ),
      s(
        "Comparison of Paradigms",
        c(
          "Comprehensive Technical Comparison Matrix",
          "A side-by-side analysis of theoretical and operational characteristics between the two paradigms:",
        ),
        {
          kind: "table",
          columns: ["Dimension", "Agglomerative (Bottom-Up)", "Divisive (Top-Down, e.g. DIANA)"],
          rows: [
            "Starting Condition",
            "Termination Condition",
            "Direction of Search",
            "Core Operation",
            "Splitting / Merging Rule",
            "Greedy Decision Point",
            "Top-Level Cluster Accuracy",
            "Low-Level Cluster Accuracy",
            "Combinatorial Bottleneck",
            "Library Support in Python",
          ],
          tableData: {
            "Starting Condition": [
              "N singleton clusters {x_1}, ..., {x_N}",
              "1 universal cluster {X} containing all points",
            ],
            "Termination Condition": [
              "1 root cluster containing all points",
              "N singleton clusters",
            ],
            "Direction of Search": [
              "Bottom-up (aggregation)",
              "Top-down (recursive bi-partitioning)",
            ],
            "Core Operation": [
              "Pairwise distance matrix update",
              "Diameter evaluation & splinter group extraction",
            ],
            "Splitting / Merging Rule": [
              "Linkage distance minimization",
              "Average dissimilarity threshold test (D_i - E_i > 0)",
            ],
            "Greedy Decision Point": [
              "Irreversible merge of closest pair",
              "Irreversible splintering into two sub-clusters",
            ],
            "Top-Level Cluster Accuracy": [
              "Prone to early merge error propagation",
              "Higher fidelity because top splits see global data context",
            ],
            "Low-Level Cluster Accuracy": [
              "Highest fidelity at fine micro-cluster scales",
              "Prone to compounding late split errors",
            ],
            "Combinatorial Bottleneck": [
              "O(N²) distance matrix storage",
              "2^(m-1)-1 splits without DIANA heuristics",
            ],
            "Library Support in Python": [
              "Native in SciPy (`linkage`) & Scikit-learn",
              "Rarely implemented; R `cluster::diana` is reference",
            ],
          },
        },
      ),
      s(
        "When to Choose Each Approach",
        c(
          "Practical Decision Guidelines & Scenarios",
          "Choosing between agglomerative and divisive hierarchical clustering depends on the analytical objective, dataset scale, and software ecosystem:",
        ),
        {
          kind: "table",
          columns: ["Decision Factor", "Favor Agglomerative When", "Favor Divisive (DIANA) When"],
          rows: [
            "Analytical Granularity",
            "Computational Target",
            "Linkage Flexibility",
            "Software Ecosystem",
          ],
          tableData: {
            "Analytical Granularity": [
              "Fine-grained taxonomy, micro-segments, or full bottom-up tree is required",
              "Only a small number of top-level macro-clusters (e.g. k = 2 or 3) are needed",
            ],
            "Computational Target": [
              "Standard dataset sizes (N ≤ 10,000) where O(N²) matrix storage is feasible",
              "Early stopping is desired: stop after 2-3 splits without computing all N-1 merges",
            ],
            "Linkage Flexibility": [
              "Requires specific linkage criteria (Ward's variance, complete, or single linkage)",
              "Natural diameter/average dissimilarity separation is sufficient",
            ],
            "Software Ecosystem": [
              "Working in Python (Scikit-learn `AgglomerativeClustering`, SciPy `linkage`)",
              "Working in R (`cluster::diana`) or custom standalone algorithms",
            ],
          },
        },
      ),
      s(
        "Visual Progression Pathways",
        c(
          "Interactive Side-by-Side Progression",
          "Step through the simulation below to observe how the deterministic 4-point dataset is processed under both bottom-up aggregation and top-down division:",
        ),
        {
          kind: "custom",
          content: createElement(ParadigmComparisonVisualizer),
        },
      ),
      s(
        "Knowledge Check & Self-Assessment",
        c(
          "Interactive Conceptual Evaluation",
          "Test your mastery of bottom-up versus top-down paradigms, DIANA splinter heuristics, and algorithmic trade-offs:",
        ),
        {
          kind: "custom",
          content: createElement(Module03Quiz),
        },
        c(
          "Module References",
          "Verified against Kaufman & Rousseeuw (1990) Ch. 6; Lance & Williams (1967); Murtagh & Contreras (2012); R `cluster::diana` documentation. See docs/references.md.",
        ),
      ),
    ],
  },
  {
    slug: "agglomerative",
    title: "Agglomerative Clustering",
    group: "Core Algorithms",
    icon: GitMerge,
    subtitle:
      "Mathematical formulation, the 8-stage execution algorithm, worked numerical walkthrough, and computational complexity.",
    sections: [
      s(
        "Working Mechanism",
        c(
          "Bottom-Up Aggregation Pipeline",
          "Agglomerative hierarchical clustering constructs an organized taxonomic tree by starting at the maximum possible granularity—where every observation forms an autonomous singleton cluster—and iteratively coalescing the most similar cluster pairs. Formally, for a dataset of N observations X = {x_1, ..., x_N}, the algorithm performs exactly N - 1 discrete merge steps to produce a fully nested hierarchy terminating at a single root cluster.",
        ),
        m(
          "Agglomerative Partition Transition",
          String.raw`\mathcal{P}_{t+1} = (\mathcal{P}_t \setminus \{A^*, B^*\}) \cup \{A^* \cup B^*\}`,
          "At iteration t, active partition P_t is transformed into P_{t+1} by replacing the two optimal clusters A* and B* with their union.",
        ),
        m(
          "Greedy Selection Objective",
          String.raw`(A^*, B^*) = \arg\min_{A, B \in \mathcal{P}_t, A \neq B} \mathcal{D}(A, B)`,
          "The merge pair is selected by finding the global minimum across the active pairwise inter-cluster dissimilarity matrix D.",
        ),
        n(
          "Greedy Irreversibility Principle",
          "Agglomerative clustering is strictly greedy and monotonic: merge decisions cannot be reconsidered or undone at subsequent iterations. If noise or bridge outliers cause an early sub-optimal merge, that error permanently affects the upper topology of the dendrogram.",
        ),
      ),
      s(
        "The 8-Stage Execution Algorithm",
        c(
          "Step-by-Step Execution Lifecycle",
          "Every agglomerative clustering implementation follows an invariant 8-stage operational pipeline from initial data ingestion to dendrogram output:",
        ),
        {
          kind: "table",
          columns: ["Stage", "Phase Name", "Mathematical Operation", "Computational State"],
          rows: [
            "Stage 1",
            "Stage 2",
            "Stage 3",
            "Stage 4",
            "Stage 5",
            "Stage 6",
            "Stage 7",
            "Stage 8",
          ],
          tableData: {
            "Stage 1": [
              "Singleton Initialization",
              "Initialize P_0 = {{x_1}, {x_2}, ..., {x_N}}; assign unique cluster IDs 0, ..., N-1",
              "Active clusters: N; Linkage matrix Z is empty",
            ],
            "Stage 2": [
              "Initial Distance Computation",
              "Compute symmetric N × N pairwise distance matrix D_0 where D_{ij} = d(x_i, x_j) and D_{ii} = 0",
              "Memory: N(N-1)/2 unique non-diagonal pairwise distances",
            ],
            "Stage 3": [
              "Global Minimum Search",
              "Locate (A*, B*) = argmin D(A, B) across all upper-triangular entries (i < j)",
              "Time: O(N²) naive linear scan or O(log N) via priority queues",
            ],
            "Stage 4": [
              "Deterministic Tie-Breaking",
              "If multiple pairs share min distance, break ties lexicographically by smallest cluster ID min(i, j)",
              "Ensures deterministic and reproducible hierarchy across runs",
            ],
            "Stage 5": [
              "Composite Cluster Formation",
              "Allocate new cluster ID C_{new} = N + t; assign membership C_{new} = A* ∪ B*; record size |C_{new}| = |A*| + |B*|",
              "Active clusters reduced by 1: |P_{t+1}| = |P_t| - 1",
            ],
            "Stage 6": [
              "Distance Matrix Updating",
              "Compute distances D(C_{new}, K) for all remaining clusters K using chosen linkage; delete rows/cols of A* and B*",
              "Matrix dimensions shrink from (N-t) × (N-t) to (N-t-1) × (N-t-1)",
            ],
            "Stage 7": [
              "Convergence Evaluation",
              "Check if |P_{t+1}| == 1 or distance threshold h_max exceeded; if not, increment t and repeat Stage 3",
              "Iterates exactly N - 1 times for full dendrogram",
            ],
            "Stage 8": [
              "Linkage Matrix & Tree Output",
              "Format results into (N-1) × 4 matrix Z = [A*, B*, h, |C_{new}|] for dendrogram rendering",
              "Output: Root cluster contains all N samples; complete ultrametric tree established",
            ],
          },
        },
      ),
      s(
        "Worked Numerical Example",
        c(
          "Complete Deterministic 4-Point Walkthrough",
          "To understand the exact arithmetic of agglomerative clustering, we trace our verified 4-point benchmark dataset in ℝ²: P₁(1,2), P₂(2,3), P₃(6,5), P₄(7,6).",
        ),
        m(
          "Initial Distance Matrix D₀ (Step 0)",
          String.raw`D_0 = \begin{pmatrix} 0 & 1.4142 & 5.8310 & 7.2111 \\ 1.4142 & 0 & 4.4721 & 5.8310 \\ 5.8310 & 4.4721 & 0 & 1.4142 \\ 7.2111 & 5.8310 & 1.4142 & 0 \end{pmatrix}`,
          "Pairwise Euclidean distances: d(P₁, P₂) = √2 ≈ 1.4142, d(P₃, P₄) = √2 ≈ 1.4142, d(P₂, P₃) = √20 ≈ 4.4721, d(P₁, P₃) = d(P₂, P₄) = √34 ≈ 5.8310, d(P₁, P₄) = √52 ≈ 7.2111.",
        ),
        c(
          "Step 1: First Merge & Matrix D₁ Construction",
          "The minimum off-diagonal distance in D₀ is 1.4142, tied between (P₁, P₂) and (P₃, P₄). Applying deterministic lexicographical index tie-breaking selects (P₁, P₂). They merge into composite cluster C₄ = {P₁, P₂} at height h = 1.4142. Next, distance rows for C₄ to remaining singletons P₃ and P₄ are updated:",
        ),
        {
          kind: "table",
          columns: [
            "Linkage Method",
            "d(C₄, P₃) Formula & Calculation",
            "d(C₄, P₄) Formula & Calculation",
            "Matrix D₁ Minimum Pair",
          ],
          rows: ["Single Linkage (Min)", "Complete Linkage (Max)", "Average Linkage (UPGMA)"],
          tableData: {
            "Single Linkage (Min)": [
              "min(d(P₁, P₃), d(P₂, P₃)) = min(5.8310, 4.4721) = 4.4721",
              "min(d(P₁, P₄), d(P₂, P₄)) = min(7.2111, 5.8310) = 5.8310",
              "(P₃, P₄) at d = 1.4142",
            ],
            "Complete Linkage (Max)": [
              "max(d(P₁, P₃), d(P₂, P₃)) = max(5.8310, 4.4721) = 5.8310",
              "max(d(P₁, P₄), d(P₂, P₄)) = max(7.2111, 5.8310) = 7.2111",
              "(P₃, P₄) at d = 1.4142",
            ],
            "Average Linkage (UPGMA)": [
              "(d(P₁, P₃) + d(P₂, P₃)) / 2 = (5.8310 + 4.4721) / 2 = 5.1516",
              "(d(P₁, P₄) + d(P₂, P₄)) / 2 = (7.2111 + 5.8310) / 2 = 6.5211",
              "(P₃, P₄) at d = 1.4142",
            ],
          },
        },
        c(
          "Step 2: Second Merge & Matrix D₂ Construction",
          "In matrix D₁, the minimal distance is d(P₃, P₄) = 1.4142. Points P₃ and P₄ coalesce into composite cluster C₅ = {P₃, P₄} at height h = 1.4142. Now only two clusters remain: C₄ and C₅.",
        ),
        c(
          "Step 3: Final Root Merge & Linkage Matrix Z",
          "The final merge combines C₄ and C₅ into universal root cluster C₆ at the distance dictated by the linkage method:",
        ),
        {
          kind: "table",
          columns: [
            "Linkage Method",
            "Final Merge Distance d(C₄, C₅)",
            "SciPy Linkage Matrix Z Row 2",
            "Resulting Tree Property",
          ],
          rows: ["Single Linkage", "Complete Linkage", "Average Linkage"],
          tableData: {
            "Single Linkage": [
              "min {5.8310, 7.2111, 4.4721, 5.8310} = 4.4721",
              "[4, 5, 4.4721, 4]",
              "Measures nearest-neighbor gap; susceptible to chaining.",
            ],
            "Complete Linkage": [
              "max {5.8310, 7.2111, 4.4721, 5.8310} = 7.2111",
              "[4, 5, 7.2111, 4]",
              "Measures diameter span between P₁ and P₄; produces compact clusters.",
            ],
            "Average Linkage": [
              "(5.8310 + 7.2111 + 4.4721 + 5.8310) / 4 = 5.8363",
              "[4, 5, 5.8363, 4]",
              "Balances variance and inter-cluster separation.",
            ],
          },
        },
      ),
      s(
        "Stopping Criteria",
        c(
          "Mechanisms for Halting Agglomeration",
          "While the classical agglomerative algorithm runs for exactly N - 1 iterations to build a complete dendrogram terminating at a single root cluster, practical applications frequently employ early termination criteria:",
        ),
        {
          kind: "table",
          columns: [
            "Stopping Criterion",
            "Mathematical Formulation",
            "Use Case & Behavioral Impact",
          ],
          rows: [
            "Root Convergence (k = 1)",
            "Target Cluster Count (k = k_target)",
            "Distance Threshold (h ≥ τ)",
            "Variance Ratio / Acceleration",
          ],
          tableData: {
            "Root Convergence (k = 1)": [
              "|P_t| == 1 (after exactly N - 1 merge steps)",
              "Full hierarchical tree construction; provides complete exploratory dendrogram.",
            ],
            "Target Cluster Count (k = k_target)": [
              "|P_t| == k (halts after N - k merge steps)",
              "Supervised cluster partitioning; directly implements Scikit-learn's `n_clusters` parameter.",
            ],
            "Distance Threshold (h ≥ τ)": [
              "min D(A, B) > τ (stops when nearest pair distance exceeds τ)",
              "Detects natural density barriers; implements Scikit-learn's `distance_threshold` parameter.",
            ],
            "Variance Ratio / Acceleration": [
              "d²h / dt² maximum (knee/elbow in merge height progression)",
              "Unsupervised determination of optimal cluster count based on merge acceleration.",
            ],
          },
        },
      ),
      s(
        "Algorithmic Pseudocode",
        c(
          "Language-Independent Algorithm Specification",
          "The structured pseudocode below formalizes the complete agglomerative procedure with explicit distance updates and tie-breaking:",
        ),
        {
          kind: "code",
          label: "Agglomerative Hierarchical Clustering Pseudocode",
          code: `Algorithm: AgglomerativeClustering(X, Metric, LinkageCriterion)
Input:
    X: Dataset of N feature vectors {x_1, x_2, ..., x_N}
    Metric: Distance function d(u, v) (e.g., Euclidean)
    LinkageCriterion: Inter-cluster dissimilarity rule D(A, B)
Output:
    Z: (N - 1) x 4 linkage matrix encoding the complete dendrogram

1:  // Stage 1: Initialize active singleton clusters
2:  Clusters = { {x_i} for i = 0 to N - 1 }
3:  NextClusterId = N
4:  Z = AllocateMatrix(rows = N - 1, cols = 4)
5:
6:  // Stage 2: Construct initial symmetric distance matrix
7:  D = AllocateMatrix(rows = N, cols = N)
8:  for i = 0 to N - 1 do
9:      for j = i + 1 to N - 1 do
10:         D[i, j] = Metric(x_i, x_j)
11:         D[j, i] = D[i, j]
12:
13: // Main Agglomeration Loop (Stages 3 to 7)
14: for t = 0 to N - 2 do:
15:     // Stage 3 & 4: Find closest cluster pair with deterministic tie-breaking
16:     (c_a, c_b, min_dist) = argmin_{i < j, i, j in Active} D[i, j]
17:     // Tie-break rule: select pair with lexicographically smallest min(c_a, c_b)
18:
19:     // Stage 5: Form composite cluster
20:     c_new = NextClusterId
21:     NextClusterId = NextClusterId + 1
22:     new_size = |Clusters[c_a]| + |Clusters[c_b]|
23:     Clusters[c_new] = Clusters[c_a] U Clusters[c_b]
24:     Z[t] = [c_a, c_b, min_dist, new_size]
25:
26:     // Stage 6: Update distance matrix for new cluster c_new
27:     for each c_k in Active \\ {c_a, c_b} do:
28:         D[c_new, c_k] = UpdateLinkage(D, c_a, c_b, c_k, LinkageCriterion)
29:         D[c_k, c_new] = D[c_new, c_k]
30:
31:     // Deactivate merged clusters c_a and c_b; activate c_new
32:     Active = (Active \\ {c_a, c_b}) U {c_new}
33:
34: // Stage 8: Terminate and return linkage matrix
35: return Z`,
        },
      ),
      s(
        "Computational Complexity Analysis",
        c(
          "Time & Space Complexity Trade-Offs",
          "Understanding the computational bottlenecks of agglomerative clustering is critical when scaling to large datasets:",
        ),
        {
          kind: "table",
          columns: [
            "Algorithm Variant",
            "Time Complexity",
            "Space Complexity",
            "Algorithmic Mechanism & Feasibility",
          ],
          rows: [
            "Naive Implementation",
            "Priority Queue (Heap)",
            "Nearest-Neighbor Chain",
            "On-The-Fly Distance (SLINK)",
          ],
          tableData: {
            "Naive Implementation": [
              "O(N³)",
              "O(N²)",
              "Performs N - 1 steps; scans unindexed O(N²) matrix for the minimum at each step. Infeasible for N > 5,000.",
            ],
            "Priority Queue (Heap)": [
              "O(N² log N)",
              "O(N²)",
              "Maintains min-heaps for cluster distance rows. Each deletion and insertion requires O(log N). Standard for complete/average linkage.",
            ],
            "Nearest-Neighbor Chain": [
              "O(N²)",
              "O(N²)",
              "Maintains a stack of mutual nearest neighbors (Murtagh 1983). Feasible for reducible metrics (Single, Complete, Average, Ward).",
            ],
            "On-The-Fly Distance (SLINK)": [
              "O(N²)",
              "O(N)",
              "Sibson's SLINK algorithm for single linkage computes distances dynamically without storing the full N × N matrix in RAM.",
            ],
          },
        },
      ),
      s(
        "Step-by-Step Algorithm Walkthrough",
        c(
          "Interactive Agglomerative Simulator",
          "Experiment with Single, Complete, and Average linkage criteria on the 4-point benchmark dataset below. Step through each merge event to inspect the evolving distance matrix and the resulting SciPy linkage matrix Z:",
        ),
        {
          kind: "custom",
          content: createElement(AgglomerativeSimulator),
        },
      ),
      s(
        "Knowledge Check & Self-Assessment",
        c(
          "Interactive Conceptual Evaluation",
          "Test your understanding of the 8-stage execution algorithm, tie-breaking mechanics, linkage matrix formatting, and complexity:",
        ),
        {
          kind: "custom",
          content: createElement(Module04Quiz),
        },
        c(
          "Module References",
          "Verified against Lance & Williams (1967); Murtagh & Contreras (2012); Kaufman & Rousseeuw (1990) Ch. 5; SciPy `scipy.cluster.hierarchy.linkage` documentation. See docs/references.md.",
        ),
      ),
    ],
  },
  {
    slug: "divisive",
    title: "Divisive Clustering",
    group: "Core Algorithms",
    icon: Split,
    subtitle:
      "Top-down hierarchical partitioning, combinatorial splitting complexity, DIANA methodology, and trade-offs.",
    sections: [
      s(
        "Top-down Approach",
        c(
          "Global Decomposition Paradigm",
          "Divisive hierarchical clustering operates via a top-down recursive partitioning strategy. Unlike agglomerative clustering—which begins with fragmented individual observations and merges upward—divisive clustering initializes the entire dataset of N observations as a single, all-encompassing universal cluster. The algorithm iteratively subdivides active clusters into smaller sub-clusters until every observation forms an isolated singleton.",
        ),
        m(
          "Divisive Partition Transition",
          String.raw`\mathcal{P}_{t+1} = (\mathcal{P}_t \setminus \{C^*\}) \cup \{C_A^*, C_B^*\}`,
          "At split iteration t, the most dispersed cluster C* is divided into two non-empty, disjoint sub-clusters C_A* and C_B*.",
        ),
        c(
          "The Advantage of Global Perspective",
          "Because divisive clustering initiates its operations at the highest hierarchical level, its early splitting decisions evaluate global variance and large-scale structural boundaries across the entire dataset. Consequently, top-level clusters (e.g. k = 2 or k = 3) produced by divisive algorithms are often more robust and less vulnerable to local outlier noise than the upper levels of agglomerative dendrograms.",
        ),
        n(
          "Greedy Irreversibility in Divisive Clustering",
          "Like agglomerative merging, divisive splitting decisions are strictly irreversible: once two observations are partitioned into separate sub-clusters C_A and C_B, they can never be reunited in any lower branch of the dendrogram.",
        ),
      ),
      s(
        "Splitting Mechanism",
        c(
          "Combinatorial Partition Explosion",
          "The central theoretical challenge in divisive clustering is the selection of the optimal binary partition. For a cluster containing m observations, the number of distinct ways to split it into two non-empty subsets is:",
        ),
        m(
          "Combinatorial Splitting Complexity",
          String.raw`N_{\text{splits}}(m) = 2^{m-1} - 1`,
          "An exhaustive evaluation of all possible binary partitions requires O(2^m) operations. For m = 50, this yields over 1.12 × 10^14 combinations, rendering brute-force optimization mathematically intractable.",
        ),
        c(
          "Heuristic Splitting Paradigms",
          "To circumvent combinatorial explosion, practical divisive algorithms employ three principal heuristic strategies:",
        ),
        {
          kind: "table",
          columns: ["Splitting Strategy", "Algorithmic Mechanism", "Strengths", "Limitations"],
          rows: ["Bisecting K-Means", "DIANA (Kaufman & Rousseeuw)", "Spectral Bi-partitioning"],
          tableData: {
            "Bisecting K-Means": [
              "Applies 2-Means (k = 2) clustering iteratively to subdivide clusters with maximum sum of squared errors",
              "Extremely fast: O(N) per split; scales effectively to hundreds of thousands of samples",
              "Non-deterministic; sensitive to random centroid initialization and spherical cluster assumptions",
            ],
            "DIANA (Kaufman & Rousseeuw)": [
              "Deterministic heuristic: identifies maximum diameter cluster, extracts splinter group based on average dissimilarity",
              "100% deterministic, parameter-free, operates directly on distance matrices without vector coordinates",
              "Requires O(N²) distance matrix; computationally slower than bisecting k-means",
            ],
            "Spectral Bi-partitioning": [
              "Constructs affinity graph, evaluates graph Laplacian L = D - W, and splits using the Fiedler vector",
              "Excels at non-convex, manifold, and graph-structured cluster geometries",
              "Requires eigenvalue decomposition of N × N matrix; computationally expensive O(N³)",
            ],
          },
        },
      ),
      s(
        "DIANA Methodology & Mathematics",
        c(
          "Algorithmic Mechanics of DIANA",
          "Introduced by Leonard Kaufman and Peter J. Rousseeuw (1990), DIANA (Divisive Analysis) is the definitive academic algorithm for divisive hierarchical clustering. It replaces the intractable 2^(m-1)-1 search with a deterministic greedy splinter heuristic.",
        ),
        m(
          "1. Maximum Diameter Cluster Selection",
          String.raw`C^* = \arg\max_{C \in \mathcal{P}_t} \text{diam}(C) = \arg\max_{C \in \mathcal{P}_t} \left( \max_{\mathbf{x}_i, \mathbf{x}_j \in C} d(\mathbf{x}_i, \mathbf{x}_j) \right)`,
          "DIANA selects the cluster with the largest diameter (maximum pairwise dissimilarity) as the candidate for subdivision.",
        ),
        m(
          "2. Splinter Seed Selection",
          String.raw`i^* = \arg\max_{i \in C^*} \left( \frac{1}{|C^*| - 1} \sum_{j \in C^* \setminus \{i\}} d(\mathbf{x}_i, \mathbf{x}_j) \right)`,
          "The splinter group S is initialized with the single observation i* that has the highest average distance to all other members in C*.",
        ),
        m(
          "3. Iterative Dissimilarity Difference Reassignment",
          String.raw`\Delta_i = D_i - E_i = \left( \frac{1}{|R| - 1} \sum_{j \in R \setminus \{i\}} d(\mathbf{x}_i, \mathbf{x}_j) \right) - \left( \frac{1}{|S|} \sum_{j \in S} d(\mathbf{x}_i, \mathbf{x}_j) \right)`,
          "For every point i in remaining group R = C* \\ S, DIANA computes average distance to R (D_i) and to S (E_i). If max(D_i - E_i) > 0, that point moves to S. The split terminates when max(D_i - E_i) ≤ 0.",
        ),
        m(
          "Divisive Coefficient (DC)",
          String.raw`DC = 1 - \frac{1}{N} \sum_{i=1}^N \frac{d(i)}{\text{diam}(X)}`,
          "Quantifies the overall clustering structure of the dataset on a scale of [0, 1], where d(i) is the diameter of the cluster at the stage when observation i was separated into a singleton.",
        ),
      ),
      s(
        "Algorithm Workflow",
        c(
          "Structured Lifecycle of DIANA",
          "The step-by-step procedural workflow executed by DIANA at each recursive stage:",
        ),
        {
          kind: "code",
          label: "DIANA Divisive Algorithm Pseudocode",
          code: `Algorithm: DIANA(X, Metric)
Input:
    X: Dataset of N observations {x_1, ..., x_N}
    Metric: Distance function d(u, v)
Output:
    Tree: Fully nested divisive dendrogram

1:  // Stage 1: Initialize root cluster
2:  Clusters = { X }
3:
4:  // Main Divisive Splitting Loop
5:  while any cluster C in Clusters has |C| > 1 do:
6:      // Stage 2: Identify cluster with maximum diameter
7:      C_target = argmax_{C in Clusters, |C| > 1} diam(C)
8:
9:      // Stage 3: Initialize splinter group S with most isolated point
10:     seed = argmax_{i in C_target} (1 / (|C_target| - 1) * sum_{j in C_target \\ {i}} d(x_i, x_j))
11:     S = { seed }
12:     R = C_target \\ { seed }
13:
14:     // Stage 4: Iterative reassignment loop
15:     while true do:
16:         for each point i in R do:
17:             D_i = average distance from i to all other points in R \\ {i}
18:             E_i = average distance from i to all points in S
19:             diff_i = D_i - E_i
20:
21:         k_star = argmax_{i in R} diff_i
22:         if diff_{k_star} > 0 then:
23:             S = S U { k_star }
24:             R = R \\ { k_star }
25:         else:
26:             break  // Splintering complete
27:
28:     // Stage 5: Replace C_target with sub-clusters S and R
29:     Clusters = (Clusters \\ { C_target }) U { S, R }
30:
31: return Clusters`,
        },
      ),
      s(
        "Worked Numerical Example",
        c(
          "Complete Deterministic 4-Point DIANA Walkthrough",
          "Tracing DIANA step-by-step on the 4-point benchmark dataset: P₁(1,2), P₂(2,3), P₃(6,5), P₄(7,6).",
        ),
        {
          kind: "table",
          columns: [
            "Observation",
            "Pairwise Distances in Root C",
            "Average Distance to Others",
            "Splinter Seed Selection",
          ],
          rows: ["Point P₁", "Point P₂", "Point P₃", "Point P₄"],
          tableData: {
            "Point P₁": [
              "d(P₁, P₂) = 1.4142, d(P₁, P₃) = 5.8310, d(P₁, P₄) = 7.2111",
              "(1.4142 + 5.8310 + 7.2111) / 3 = 4.8188",
              "Selected as splinter seed S = {P₁} (index tie-break)",
            ],
            "Point P₂": [
              "d(P₂, P₁) = 1.4142, d(P₂, P₃) = 4.4721, d(P₂, P₄) = 5.8310",
              "(1.4142 + 4.4721 + 5.8310) / 3 = 3.9058",
              "Remains in R = {P₂, P₃, P₄}",
            ],
            "Point P₃": [
              "d(P₃, P₁) = 5.8310, d(P₃, P₂) = 4.4721, d(P₃, P₄) = 1.4142",
              "(5.8310 + 4.4721 + 1.4142) / 3 = 3.9058",
              "Remains in R = {P₂, P₃, P₄}",
            ],
            "Point P₄": [
              "d(P₄, P₁) = 7.2111, d(P₄, P₂) = 5.8310, d(P₄, P₃) = 1.4142",
              "(7.2111 + 5.8310 + 1.4142) / 3 = 4.8188",
              "Tied with P₁ at 4.8188; remains in R",
            ],
          },
        },
        c(
          "Splinter Iteration 1 & Point Reassignment",
          "With splinter seed S = {P₁} and remaining group R = {P₂, P₃, P₄}, we compute D_i, E_i, and the difference Δ_i = D_i - E_i:",
        ),
        {
          kind: "table",
          columns: [
            "Point in R",
            "D_i (Avg Distance to R \\ {i})",
            "E_i (Avg Distance to S)",
            "Δ_i = D_i - E_i",
            "Reassignment Decision",
          ],
          rows: ["Point P₂", "Point P₃", "Point P₄"],
          tableData: {
            "Point P₂": [
              "(4.4721 + 5.8310) / 2 = 5.1515",
              "d(P₂, P₁) = 1.4142",
              "5.1515 - 1.4142 = +3.7373",
              "Max positive difference (> 0) → Moves to S",
            ],
            "Point P₃": [
              "(4.4721 + 1.4142) / 2 = 2.9432",
              "d(P₃, P₁) = 5.8310",
              "2.9432 - 5.8310 = -2.8878",
              "Negative difference (≤ 0) → Remains in R",
            ],
            "Point P₄": [
              "(5.8310 + 1.4142) / 2 = 3.6226",
              "d(P₄, P₁) = 7.2111",
              "3.6226 - 7.2111 = -3.5885",
              "Negative difference (≤ 0) → Remains in R",
            ],
          },
        },
        c(
          "Splinter Iteration 2 & Stopping Rule",
          "Now S = {P₁, P₂} and R = {P₃, P₄}. We re-evaluate the remaining observations in R:",
        ),
        {
          kind: "table",
          columns: [
            "Point in R",
            "D_i (Avg Distance to R \\ {i})",
            "E_i (Avg Distance to S)",
            "Δ_i = D_i - E_i",
            "Reassignment Decision",
          ],
          rows: ["Point P₃", "Point P₄"],
          tableData: {
            "Point P₃": [
              "d(P₃, P₄) = 1.4142",
              "(5.8310 + 4.4721) / 2 = 5.1515",
              "1.4142 - 5.1515 = -3.7373",
              "Negative (≤ 0) → Splintering stops",
            ],
            "Point P₄": [
              "d(P₄, P₃) = 1.4142",
              "(7.2111 + 5.8310) / 2 = 6.5210",
              "1.4142 - 6.5210 = -5.1068",
              "Negative (≤ 0) → Splintering stops",
            ],
          },
        },
      ),
      s(
        "Comparison with Agglomerative Clustering",
        c(
          "Detailed Architectural Trade-Offs",
          "A comparative breakdown between divisive and agglomerative architectures across primary engineering dimensions:",
        ),
        {
          kind: "table",
          columns: ["Aspect", "Divisive Clustering (DIANA)", "Agglomerative Clustering"],
          rows: [
            "Computational Bottleneck",
            "Splitting Heuristics",
            "Sensitivity to Early Choices",
            "Software Support (SciPy/sklearn)",
            "Suitability for Few Clusters",
          ],
          tableData: {
            "Computational Bottleneck": [
              "O(2^m) combinatorial split explosion without heuristics; O(N²) space for distance matrix in DIANA",
              "O(N²) pairwise distance matrix storage; O(N³) naive search (reducible to O(N²) via NN-chains)",
            ],
            "Splitting Heuristics": [
              "Relies on heuristic seed identification and average dissimilarity reassignment thresholds",
              "Directly evaluates pairwise linkage criteria (Single, Complete, Average, Ward's minimum variance)",
            ],
            "Sensitivity to Early Choices": [
              "Early choices define macro-clusters; robust against noise at top levels, but sensitive at micro-leaves",
              "Early merges are local; sensitive to noise and outlier bridges, which propagate up to root",
            ],
            "Software Support (SciPy/sklearn)": [
              "Not natively implemented in Scikit-learn or SciPy; reference standard is R `cluster::diana`",
              "Universal standard support across Scikit-learn (`AgglomerativeClustering`) and SciPy (`cluster.hierarchy`)",
            ],
            "Suitability for Few Clusters": [
              "Highly suitable when targeting small k (e.g. k = 2 or 3): halt after k-1 splits without computing full tree",
              "Requires computing N - k merges to produce k clusters, processing fine granular details first",
            ],
          },
        },
      ),
      s(
        "Step-by-Step Algorithm Walkthrough",
        c(
          "Interactive DIANA Splitting Simulator",
          "Step through top-down divisive analysis on the 4-point benchmark dataset below. Inspect cluster diameter evaluations, splinter group seed extraction, and dynamic dissimilarity threshold tests:",
        ),
        {
          kind: "custom",
          content: createElement(DianaSimulator),
        },
      ),
      s(
        "Knowledge Check & Self-Assessment",
        c(
          "Interactive Conceptual Evaluation",
          "Test your mastery of combinatorial splitting complexity, DIANA diameter heuristics, splinter group dynamics, and stopping criteria:",
        ),
        {
          kind: "custom",
          content: createElement(Module05Quiz),
        },
        c(
          "Module References",
          "Verified against Kaufman & Rousseeuw (1990) Ch. 6; Maechler et al. (R `cluster::diana`); Murtagh & Contreras (2012). See docs/references.md.",
        ),
      ),
    ],
  },
  {
    slug: "linkage",
    title: "Linkage Methods",
    group: "Core Algorithms",
    icon: Link2,
    subtitle:
      "Mathematical definitions, geometrical behaviors, Lance-Williams recurrences, and trade-offs of major linkage criteria.",
    sections: [
      s(
        "Single Linkage",
        c(
          "Nearest-Neighbor Proximity Formulation",
          "In hierarchical clustering, calculating distance between individual observations d(x_i, x_j) is trivial using standard vector metrics. However, once clusters coalesce to contain multiple observations, a mathematical linkage criterion D(A, B) is required to evaluate the dissimilarity between entire sets of points. Single Linkage (also called nearest-neighbor linkage or minimum method) defines the distance between two clusters as the minimum pairwise distance between any observation in cluster A and any observation in cluster B.",
        ),
        m(
          "Single Linkage Formal Definition",
          String.raw`D(A, B) = \min \{ d(\mathbf{a}, \mathbf{b}) : \mathbf{a} \in A, \, \mathbf{b} \in B \}`,
          "Where A and B are disjoint cluster subsets of X, and d(a, b) is the underlying ground metric (e.g., Euclidean distance).",
        ),
        m(
          "Lance-Williams Recurrence Form for Single Linkage",
          String.raw`D(A \cup B, C) = \min(D(A, C), D(B, C)) = \frac{1}{2} D(A, C) + \frac{1}{2} D(B, C) - \frac{1}{2} |D(A, C) - D(B, C)|`,
          "Parameters in the generalized recurrence: α_A = 1/2, α_B = 1/2, β = 0, γ = -1/2. Distance updates require only O(1) operations per remaining cluster.",
        ),
        c(
          "Worked Numerical Example (Deterministic 4-Point Benchmark)",
          "Tracing Single Linkage on P₁(1,2), P₂(2,3), P₃(6,5), P₄(7,6). Initial minimum is d(P₁, P₂) = 1.4142. They merge into C₄ = {P₁, P₂}. The distance matrix is updated:",
        ),
        {
          kind: "table",
          columns: [
            "Cluster Pair",
            "Formula Evaluation",
            "Updated Linkage Distance",
            "Next Decision State",
          ],
          rows: ["D(C₄, P₃)", "D(C₄, P₄)", "D(P₃, P₄)", "D(C₄, C₅)"],
          tableData: {
            "D(C₄, P₃)": [
              "min(d(P₁, P₃), d(P₂, P₃)) = min(5.8310, 4.4721)",
              "4.4721",
              "Evaluated for next merge search",
            ],
            "D(C₄, P₄)": [
              "min(d(P₁, P₄), d(P₂, P₄)) = min(7.2111, 5.8310)",
              "5.8310",
              "Evaluated for next merge search",
            ],
            "D(P₃, P₄)": [
              "d(P₃, P₄) = √((7-6)² + (6-5)²) = √2",
              "1.4142",
              "Global minimum in D₁ → Merges into C₅ = {P₃, P₄}",
            ],
            "D(C₄, C₅)": [
              "min(D(C₄, P₃), D(C₄, P₄)) = min(4.4721, 5.8310)",
              "4.4721",
              "Final root merge combining all 4 points",
            ],
          },
        },
        c(
          "The Chaining Phenomenon & Minimum Spanning Trees",
          "Single Linkage is mathematically equivalent to Kruskal's algorithm for constructing a Minimum Spanning Tree (MST). Because it considers only the nearest pair of points between two sets, single linkage can successfully recover non-convex, elongated, and concentric manifold structures. However, it is fatally susceptible to 'chaining': a sparse sequence of noise points bridging two disparate clusters will cause them to merge prematurely at low heights.",
        ),
        {
          kind: "custom",
          content: createElement(SingleLinkageChainingVisualizer),
        },
        {
          kind: "table",
          columns: ["Dimension", "Characteristics of Single Linkage"],
          rows: [
            "Mathematical Objective",
            "Geometric Shape Tendency",
            "Outlier Sensitivity",
            "Monotonicity",
            "Primary ML Use Cases",
          ],
          tableData: {
            "Mathematical Objective": [
              "Minimizes the nearest-neighbor gap between cluster boundaries.",
            ],
            "Geometric Shape Tendency": [
              "Arbitrary, non-globular, serpentine, and concentric ribbon clusters.",
            ],
            "Outlier Sensitivity": [
              "High vulnerability to noise bridges (chaining); low sensitivity to isolated distant outliers.",
            ],
            Monotonicity: [
              "Always monotonic: merge heights are non-decreasing (h_1 ≤ h_2 ≤ ... ≤ h_{N-1}).",
            ],
            "Primary ML Use Cases": [
              "Manifold learning, geographic road networks, astronomy filament detection, biological phylogeny.",
            ],
          },
        },
      ),
      s(
        "Complete Linkage",
        c(
          "Farthest-Neighbor Diameter Formulation",
          "Complete Linkage (also called farthest-neighbor linkage or maximum method) adopts the diametrically opposed philosophy of Single Linkage: the distance between two clusters is defined as the MAXIMUM pairwise distance between any observation in cluster A and any observation in cluster B. Mathematically, this corresponds to the diameter of the combined cluster.",
        ),
        m(
          "Complete Linkage Formal Definition",
          String.raw`D(A, B) = \max \{ d(\mathbf{a}, \mathbf{b}) : \mathbf{a} \in A, \, \mathbf{b} \in B \}`,
          "D(A, B) represents the diameter of the bipartite graph spanning clusters A and B.",
        ),
        m(
          "Lance-Williams Recurrence Form for Complete Linkage",
          String.raw`D(A \cup B, C) = \max(D(A, C), D(B, C)) = \frac{1}{2} D(A, C) + \frac{1}{2} D(B, C) + \frac{1}{2} |D(A, C) - D(B, C)|`,
          "Parameters in the generalized recurrence: α_A = 1/2, α_B = 1/2, β = 0, γ = +1/2. Update requires O(1) operations per remaining cluster.",
        ),
        c(
          "Worked Numerical Example (Deterministic 4-Point Benchmark)",
          "Tracing Complete Linkage on P₁(1,2), P₂(2,3), P₃(6,5), P₄(7,6). Initial minimum merge is (P₁, P₂) into C₄ = {P₁, P₂}. Updated distances:",
        ),
        {
          kind: "table",
          columns: [
            "Cluster Pair",
            "Formula Evaluation",
            "Updated Linkage Distance",
            "Contrast with Single Linkage",
          ],
          rows: ["D(C₄, P₃)", "D(C₄, P₄)", "D(P₃, P₄)", "D(C₄, C₅)"],
          tableData: {
            "D(C₄, P₃)": [
              "max(d(P₁, P₃), d(P₂, P₃)) = max(5.8310, 4.4721)",
              "5.8310",
              "Much larger than Single Linkage (4.4721); penalizes cluster spread",
            ],
            "D(C₄, P₄)": [
              "max(d(P₁, P₄), d(P₂, P₄)) = max(7.2111, 5.8310)",
              "7.2111",
              "Measures farthest point span across P₁ and P₄",
            ],
            "D(P₃, P₄)": [
              "d(P₃, P₄) = √((7-6)² + (6-5)²) = √2",
              "1.4142",
              "Next minimum in D₁ → Merges into C₅ = {P₃, P₄}",
            ],
            "D(C₄, C₅)": [
              "max(D(C₄, P₃), D(C₄, P₄)) = max(5.8310, 7.2111)",
              "7.2111",
              "Final merge height: 7.2111 (vs. 4.4721 for single linkage)",
            ],
          },
        },
        n(
          "Compact Cluster Tendency & Extreme Outlier Sensitivity",
          "Because Complete Linkage penalizes large cluster diameters, it strongly favors compact, spherical clusters of approximately equal diameter. However, it is hyper-sensitive to outliers: even a single outlying point assigned to a cluster drastically inflates its distance to all other clusters, distorting dendrogram merge heights.",
        ),
        {
          kind: "table",
          columns: ["Dimension", "Characteristics of Complete Linkage"],
          rows: [
            "Mathematical Objective",
            "Geometric Shape Tendency",
            "Outlier Sensitivity",
            "Monotonicity",
            "Primary ML Use Cases",
          ],
          tableData: {
            "Mathematical Objective": ["Minimizes the maximum diameter of merged clusters."],
            "Geometric Shape Tendency": [
              "Compact, roughly spherical, equal-diameter globular clusters.",
            ],
            "Outlier Sensitivity": [
              "Extremely sensitive: a single distant point inflates the entire cluster distance.",
            ],
            Monotonicity: [
              "Always monotonic: merge heights are non-decreasing (h_1 ≤ h_2 ≤ ... ≤ h_{N-1}).",
            ],
            "Primary ML Use Cases": [
              "Market customer segmentation, gene expression co-expression profiling where compact groups are desired.",
            ],
          },
        },
      ),
      s(
        "Average Linkage (UPGMA)",
        c(
          "Unweighted Pair Group Method with Arithmetic Mean",
          "Average Linkage—historically introduced by Sokal and Michener (1958) as UPGMA (Unweighted Pair Group Method with Arithmetic Mean)—strikes an elegant balance between the extreme conservatism of Single Linkage (minimum distance) and Complete Linkage (maximum distance). It defines the dissimilarity between two clusters as the arithmetic average of all pairwise distances between observations across the two clusters.",
        ),
        m(
          "Average Linkage Formal Definition",
          String.raw`D(A, B) = \frac{1}{|A| |B|} \sum_{\mathbf{a} \in A} \sum_{\mathbf{b} \in B} d(\mathbf{a}, \mathbf{b})`,
          "Every observation pair (a, b) carries equal weight 1 / (|A||B|), making the dissimilarity robust against individual outlier pairs.",
        ),
        m(
          "Derivation of the UPGMA Distance Update Formula",
          String.raw`D(A \cup B, C) = \frac{|A| D(A, C) + |B| D(B, C)}{|A| + |B|} = \frac{n_A}{n_A + n_B} D(A, C) + \frac{n_B}{n_A + n_B} D(B, C)`,
          "Lance-Williams parameters: α_A = n_A/(n_A+n_B), α_B = n_B/(n_A+n_B), β = 0, γ = 0. Notice this is a weighted average of cluster distances, which ensures that all underlying observation pairs remain equally unweighted.",
        ),
        c(
          "Mathematical Derivation of the Cluster Update",
          "Why is the formula a weighted combination of cluster distances when the method is called 'unweighted'? Consider merging clusters A and B into A ∪ B. The distance to cluster C is: D(A ∪ B, C) = (1 / (|A ∪ B||C|)) ∑_{u ∈ A ∪ B} ∑_{c ∈ C} d(u, c). Splitting the sum yields ∑_{a ∈ A} ∑_{c ∈ C} d(a, c) + ∑_{b ∈ B} ∑_{c ∈ C} d(b, c). Because ∑_{a ∈ A} ∑_{c ∈ C} d(a, c) = |A||C| D(A, C) and ∑_{b ∈ B} ∑_{c ∈ C} d(b, c) = |B||C| D(B, C), dividing by (|A| + |B|)|C| cancels |C| exactly, proving D(A ∪ B, C) = (|A| D(A, C) + |B| D(B, C)) / (|A| + |B|).",
        ),
        c(
          "Worked Numerical Example (Deterministic 4-Point Benchmark)",
          "Tracing Average Linkage on P₁(1,2), P₂(2,3), P₃(6,5), P₄(7,6). Initial merge is (P₁, P₂) into C₄ = {P₁, P₂} (|C₄| = 2). Distance updates:",
        ),
        {
          kind: "table",
          columns: [
            "Cluster Pair",
            "Formula Evaluation",
            "Updated Linkage Distance",
            "Comparative Intermediate Height",
          ],
          rows: ["D(C₄, P₃)", "D(C₄, P₄)", "D(P₃, P₄)", "D(C₄, C₅)"],
          tableData: {
            "D(C₄, P₃)": [
              "(1 · d(P₁, P₃) + 1 · d(P₂, P₃)) / 2 = (5.8310 + 4.4721) / 2",
              "5.1516",
              "Strictly bounded between Single (4.4721) and Complete (5.8310)",
            ],
            "D(C₄, P₄)": [
              "(1 · d(P₁, P₄) + 1 · d(P₂, P₄)) / 2 = (7.2111 + 5.8310) / 2",
              "6.5211",
              "Strictly bounded between Single (5.8310) and Complete (7.2111)",
            ],
            "D(P₃, P₄)": [
              "d(P₃, P₄) = √((7-6)² + (6-5)²) = √2",
              "1.4142",
              "Next minimum in D₁ → Merges into C₅ = {P₃, P₄}",
            ],
            "D(C₄, C₅)": [
              "(2 · D(C₄, P₃) + 2 · D(C₄, P₄)) / 4 = (5.1516 + 6.5211) / 2",
              "5.8363",
              "Final merge height: 5.8363 (Single: 4.4721, Complete: 7.2111)",
            ],
          },
        },
        n(
          "Average Linkage vs. Centroid Linkage",
          "Do not confuse Average Linkage with Centroid Linkage: Average Linkage averages all pairwise distances between individual observations, whereas Centroid Linkage computes the Euclidean distance between the center-of-mass vectors. Average Linkage is always monotonic; Centroid Linkage can produce inversions.",
        ),
        {
          kind: "table",
          columns: ["Dimension", "Characteristics of Average Linkage (UPGMA)"],
          rows: [
            "Mathematical Objective",
            "Geometric Shape Tendency",
            "Outlier Sensitivity",
            "Monotonicity",
            "Primary ML Use Cases",
          ],
          tableData: {
            "Mathematical Objective": [
              "Minimizes average cross-cluster distance across all point pairs.",
            ],
            "Geometric Shape Tendency": [
              "Moderately compact clusters with balanced variance; less rigid than Complete Linkage.",
            ],
            "Outlier Sensitivity": [
              "Robust against individual noise points due to arithmetic averaging across all pairs.",
            ],
            Monotonicity: [
              "Always monotonic: merge heights are non-decreasing (h_1 ≤ h_2 ≤ ... ≤ h_{N-1}).",
            ],
            "Primary ML Use Cases": [
              "Phylogenetic tree construction, bioinformatics, computational taxonomy, ecology.",
            ],
          },
        },
      ),
      s(
        "Centroid Linkage (UPGMC)",
        c(
          "Geometric Centroid Distance Formulation",
          "Centroid Linkage—UPGMC (Unweighted Pair Group Method using Centroids)—defines the distance between two clusters as the standard Euclidean distance between their geometric centers of mass (centroids). Each cluster is represented by a single prototype vector μ, and the distance between clusters equals the distance between these prototypes.",
        ),
        m(
          "Centroid Linkage Formal Definition",
          String.raw`D(A, B) = \| \boldsymbol{\mu}_A - \boldsymbol{\mu}_B \|_2 = \sqrt{\sum_{k=1}^d (\mu_{A,k} - \mu_{B,k})^2}`,
          "Where μ_A = (1 / |A|) ∑_{a ∈ A} a and μ_B = (1 / |B|) ∑_{b ∈ B} b are the arithmetic mean vectors.",
        ),
        m(
          "Squared Centroid Lance-Williams Recurrence",
          String.raw`D^2(A \cup B, C) = \frac{n_A}{n_A + n_B} D^2(A, C) + \frac{n_B}{n_A + n_B} D^2(B, C) - \frac{n_A n_B}{(n_A + n_B)^2} D^2(A, B)`,
          "Lance-Williams parameters for squared Euclidean distance: α_A = n_A/(n_A+n_B), α_B = n_B/(n_A+n_B), β = -n_A n_B / (n_A+n_B)², γ = 0. Notice the strictly negative β coefficient!",
        ),
        c(
          "Mathematical Analysis of Dendrogram Inversions (Reversals)",
          "A fundamental mathematical property of hierarchical clustering is monotonicity: merge heights should never decrease as clusters grow larger (h_1 ≤ h_2 ≤ ... ≤ h_{N-1}). However, because Centroid Linkage possesses a strictly negative β coefficient in its recurrence, the distance between the newly formed centroid μ_{A ∪ B} and a third cluster C can be strictly LESS than the distance between A and B! When this occurs, the dendrogram exhibits an inversion: a higher-level branch is drawn lower than its child branches, causing the tree branches to intersect or fold backward.",
        ),
        c(
          "Concrete Numerical Counterexample (4-Point Inversion)",
          "Consider 4 points in ℝ²: P₁(0.0, 0.0), P₂(1.0, 0.0), P₃(0.5, 0.1), P₄(0.7, 0.6). We trace their Centroid Linkage execution step-by-step:",
        ),
        {
          kind: "table",
          columns: [
            "Merge Stage",
            "Clusters Merged",
            "Centroid Vectors",
            "Merge Distance (Height)",
            "Monotonicity Evaluation",
          ],
          rows: ["Merge 1", "Merge 2", "Merge 3 (Root)"],
          tableData: {
            "Merge 1": [
              "P₁(0,0) and P₃(0.5, 0.1)",
              "μ₄ = ((0+0.5)/2, (0+0.1)/2) = (0.25, 0.05)",
              "h₁ = √(0.5² + 0.1²) = √0.26 ≈ 0.5099",
              "Initial baseline merge",
            ],
            "Merge 2": [
              "P₂(1,0) and P₄(0.7, 0.6)",
              "μ₅ = ((1+0.7)/2, (0+0.6)/2) = (0.85, 0.30)",
              "h₂ = √((-0.3)² + 0.6²) = √0.45 ≈ 0.6708",
              "Monotonic: h₂ (0.6708) > h₁ (0.5099)",
            ],
            "Merge 3 (Root)": [
              "C₄ = {P₁, P₃} and C₅ = {P₂, P₄}",
              "Distance between μ₄(0.25, 0.05) and μ₅(0.85, 0.30)",
              "h₃ = √((0.85-0.25)² + (0.30-0.05)²) = √(0.60² + 0.25²) = √0.4225 = 0.6500",
              "INVERSION: h₃ (0.6500) < h₂ (0.6708)! Height drops by 0.0208.",
            ],
          },
        },
        {
          kind: "custom",
          content: createElement(CentroidLinkageInversionVisualizer),
        },
        {
          kind: "table",
          columns: ["Dimension", "Characteristics of Centroid Linkage (UPGMC)"],
          rows: [
            "Mathematical Objective",
            "Distance Basis",
            "Lance-Williams β Parameter",
            "Monotonicity",
            "Practical Recommendation",
          ],
          tableData: {
            "Mathematical Objective": [
              "Measures geometric distance between cluster centers of mass.",
            ],
            "Distance Basis": [
              "Requires Euclidean coordinates; meaningless for generic precomputed distance matrices.",
            ],
            "Lance-Williams β Parameter": ["Negative: β = -n_A n_B / (n_A + n_B)² < 0."],
            Monotonicity: ["Non-monotonic: prone to dendrogram inversions / reversals."],
            "Practical Recommendation": [
              "Generally avoided in exploratory data analysis due to uninterpretable crossed dendrogram branches.",
            ],
          },
        },
      ),
      s(
        "Ward's Minimum Variance Linkage",
        c(
          "Variance Minimization Philosophy",
          "Ward's Minimum Variance Linkage (Joe H. Ward, Jr., 1963) reframes hierarchical clustering from a geometric distance problem into an analysis-of-variance optimization problem. Instead of measuring spatial proximity between points or prototypes, Ward's method merges the pair of clusters that minimizes the total increase in within-cluster error sum of squares (ESS).",
        ),
        m(
          "Within-Cluster Error Sum of Squares (ESS)",
          String.raw`\text{ESS}(C) = \sum_{\mathbf{x}_i \in C} \| \mathbf{x}_i - \boldsymbol{\mu}_C \|^2, \quad \text{ESS}_{\text{total}}(\mathcal{P}) = \sum_{C \in \mathcal{P}} \text{ESS}(C)`,
          "Where ESS(C) measures the dispersion of points around their cluster centroid μ_C. For singleton clusters, ESS({x_i}) = 0.",
        ),
        c(
          "Rigorous Derivation of Ward's Variance Increase Formula",
          "Let clusters A and B merge into A ∪ B. We derive the exact change in within-cluster sum of squares: ΔESS(A, B) = ESS(A ∪ B) - ESS(A) - ESS(B). For any set of points S and arbitrary reference vector c: ∑_{x ∈ S} ||x - c||² = ∑_{x ∈ S} ||x - μ_S + μ_S - c||² = ESS(S) + |S| ||μ_S - c||² + 2(μ_S - c)^T ∑_{x ∈ S} (x - μ_S). Because ∑_{x ∈ S} (x - μ_S) = 0 by definition of the centroid, the cross-term vanishes! Applying this identity to A and B with c = μ_{A ∪ B}: ESS(A ∪ B) = ESS(A) + |A| ||μ_A - μ_{A ∪ B}||² + ESS(B) + |B| ||μ_B - μ_{A ∪ B}||². Substituting μ_{A ∪ B} = (|A| μ_A + |B| μ_B) / (|A| + |B|) yields ||μ_A - μ_{A ∪ B}|| = (|B| / (|A| + |B|)) ||μ_A - μ_B|| and ||μ_B - μ_{A ∪ B}|| = (|A| / (|A| + |B|)) ||μ_A - μ_B||. Factoring terms produces: ΔESS(A, B) = [|A||B| / (|A| + |B|)] ||μ_A - μ_B||².",
        ),
        m(
          "Ward's Variance Increase Objective",
          String.raw`\Delta \text{ESS}(A, B) = \frac{|A| |B|}{|A| + |B|} \| \boldsymbol{\mu}_A - \boldsymbol{\mu}_B \|_2^2`,
          "At every merge step, Ward greedily chooses the cluster pair (A*, B*) that minimizes ΔESS(A, B).",
        ),
        m(
          "Software Implementation Scaling: SciPy & R ward.D2",
          String.raw`d_{\text{SciPy}}(A, B) = \sqrt{2 \cdot \Delta \text{ESS}(A, B)} = \sqrt{\frac{2 n_A n_B}{n_A + n_B}} \| \boldsymbol{\mu}_A - \boldsymbol{\mu}_B \|_2`,
          "SciPy's `scipy.cluster.hierarchy.linkage(..., method='ward')` and R's `hclust(..., method='ward.D2')` scale merge heights by √2 so that for singletons (n_A=1, n_B=1), the merge distance equals the exact Euclidean distance ||x_A - x_B||.",
        ),
        m(
          "Lance-Williams Recurrence for Ward's Method",
          String.raw`D^2(A \cup B, C) = \frac{n_A + n_C}{n_A + n_B + n_C} D^2(A, C) + \frac{n_B + n_C}{n_A + n_B + n_C} D^2(B, C) - \frac{n_C}{n_A + n_B + n_C} D^2(A, B)`,
          "Parameters in Lance-Williams recurrence: α_A = (n_A+n_C)/(n_A+n_B+n_C), α_B = (n_B+n_C)/(n_A+n_B+n_C), β = -n_C/(n_A+n_B+n_C), γ = 0. Operates on squared dissimilarities.",
        ),
        c(
          "Worked Numerical Example (Deterministic 4-Point Benchmark)",
          "Tracing Ward's method on P₁(1,2), P₂(2,3), P₃(6,5), P₄(7,6). Merge 1 combines P₁ and P₂ (||μ₁ - μ₂|| = √2, ΔESS = (1·1/2)·2 = 1.0, d_SciPy = √(2·1.0) = 1.4142). Merge 2 combines P₃ and P₄ (||μ₃ - μ₄|| = √2, ΔESS = 1.0, d_SciPy = 1.4142). Merge 3 combines C₄ and C₅:",
        ),
        {
          kind: "table",
          columns: [
            "Analytical Quantity",
            "Formula & Mathematical Substitution",
            "Exact Value",
            "Interpretation",
          ],
          rows: [
            "Centroid of C₄",
            "Centroid of C₅",
            "Centroid Separation Squared",
            "Cluster Sizes",
            "Variance Increase (ΔESS)",
            "SciPy Linkage Distance",
          ],
          tableData: {
            "Centroid of C₄": [
              "μ₄ = ((1+2)/2, (2+3)/2)",
              "(1.5, 2.5)",
              "Center of mass of P₁ and P₂",
            ],
            "Centroid of C₅": [
              "μ₅ = ((6+7)/2, (5+6)/2)",
              "(6.5, 5.5)",
              "Center of mass of P₃ and P₄",
            ],
            "Centroid Separation Squared": [
              "||μ₄ - μ₅||² = (6.5 - 1.5)² + (5.5 - 2.5)² = 5² + 3²",
              "25 + 9 = 34.0",
              "Squared Euclidean distance between cluster centroids",
            ],
            "Cluster Sizes": [
              "n₄ = 2, n₅ = 2",
              "n₄ + n₅ = 4",
              "Harmonic weight factor = (2·2) / (2+2) = 1.0",
            ],
            "Variance Increase (ΔESS)": [
              "ΔESS = (n₄ · n₅ / (n₄ + n₅)) ||μ₄ - μ₅||² = 1.0 · 34.0",
              "34.0000",
              "Total increase in pooled within-cluster variance",
            ],
            "SciPy Linkage Distance": [
              "d_SciPy = √(2 · ΔESS) = √(2 · 34.0) = √68",
              "8.2462",
              "SciPy linkage matrix Z height at root merge",
            ],
          },
        },
        {
          kind: "custom",
          content: createElement(WardVarianceIncreaseCalculator),
        },
        {
          kind: "table",
          columns: ["Dimension", "Characteristics of Ward's Method"],
          rows: [
            "Mathematical Objective",
            "Cluster Geometry Tendency",
            "Cluster Size Bias",
            "Monotonicity",
            "Ground Metric Requirement",
          ],
          tableData: {
            "Mathematical Objective": ["Minimizes total within-cluster variance increase (ESS)."],
            "Cluster Geometry Tendency": [
              "Strongly favors spherical, compact, dense clusters (similar to K-Means).",
            ],
            "Cluster Size Bias": [
              "Heavily penalizes merging large clusters; tends to produce balanced, equal-sized clusters.",
            ],
            Monotonicity: [
              "Always strictly monotonic under Euclidean distances (no inversions possible).",
            ],
            "Ground Metric Requirement": [
              "STRICTLY requires Euclidean distance; meaningless with non-Euclidean metrics like Cosine or Manhattan.",
            ],
          },
        },
      ),
      s(
        "Generalized Lance–Williams Recurrence",
        c(
          "Unification of Agglomerative Criteria (Lance & Williams, 1967)",
          "In 1967, G. N. Lance and W. T. Williams published a landmark theoretical framework proving that all standard combinatorial agglomerative clustering methods can be expressed through a single universal recurrence equation. When two clusters A and B merge into A ∪ B, the distance from the newly unified cluster to any remaining cluster C in the dataset can be updated directly from the existing pairwise distances D(A, C), D(B, C), and D(A, B) without re-inspecting individual data points.",
        ),
        m(
          "General Lance–Williams Recurrence Formula",
          String.raw`D(A \cup B, C) = \alpha_A D(A, C) + \alpha_B D(B, C) + \beta D(A, B) + \gamma |D(A, C) - D(B, C)|`,
          "Where α_A, α_B, β, and γ are predetermined algebraic parameters defined by the specific linkage method, and may depend on cluster cardinalities n_A, n_B, and n_C.",
        ),
        c(
          "Algorithmic Complexity Advantage",
          "Without the Lance–Williams recurrence, evaluating the distance between merged cluster (A ∪ B) and cluster C would require scanning all |A ∪ B| · |C| constituent point pairs, requiring O(N³) operations across the entire clustering hierarchy. Using Lance–Williams, updating each distance entry requires strictly O(1) arithmetic operations. Across all N - 1 merge steps, updating the dissimilarity matrix consumes only O(N²) operations, enabling efficient agglomerative clustering implementations.",
        ),
        {
          kind: "table",
          columns: [
            "Linkage Method",
            "α_A Parameter",
            "α_B Parameter",
            "β Parameter",
            "γ Parameter",
            "Distance Space",
          ],
          rows: [
            "Single Linkage",
            "Complete Linkage",
            "Average Linkage (UPGMA)",
            "Centroid Linkage (UPGMC)",
            "Ward's Linkage (Minimum Variance)",
          ],
          tableData: {
            "Single Linkage": ["1/2", "1/2", "0", "-1/2", "Linear Metric d(u, v)"],
            "Complete Linkage": ["1/2", "1/2", "0", "+1/2", "Linear Metric d(u, v)"],
            "Average Linkage (UPGMA)": [
              "n_A / (n_A + n_B)",
              "n_B / (n_A + n_B)",
              "0",
              "0",
              "Linear Metric d(u, v)",
            ],
            "Centroid Linkage (UPGMC)": [
              "n_A / (n_A + n_B)",
              "n_B / (n_A + n_B)",
              "- (n_A · n_B) / (n_A + n_B)²",
              "0",
              "Squared Euclidean d²(u, v)",
            ],
            "Ward's Linkage (Minimum Variance)": [
              "(n_A + n_C) / (n_A + n_B + n_C)",
              "(n_B + n_C) / (n_A + n_B + n_C)",
              "- n_C / (n_A + n_B + n_C)",
              "0",
              "Squared Metric / Variance ΔESS",
            ],
          },
        },
        c(
          "Algebraic Derivation of min/max Simplifications",
          "For Single and Complete Linkage, Lance and Williams leveraged a classical algebraic identity for minimum and maximum functions: min(u, v) = (u + v)/2 - |u - v|/2 and max(u, v) = (u + v)/2 + |u - v|/2. Setting α_A = 1/2, α_B = 1/2, β = 0, and γ = ∓1/2 perfectly reproduces the nearest-neighbor and farthest-neighbor definitions without requiring any dependency on cluster sizes n_A or n_B.",
        ),
        {
          kind: "custom",
          content: createElement(LanceWilliamsExplorer),
        },
      ),
      s(
        "Monotonicity and Inversions",
        c(
          "The Monotonicity Property (Ultrametric Tree Condition)",
          "A fundamental mathematical property required for reliable hierarchical clustering interpretation is monotonicity. An agglomerative hierarchical clustering algorithm is said to be monotonic if the sequence of merge heights (dissimilarities at which clusters coalesce) is non-decreasing throughout the clustering process: h₁ ≤ h₂ ≤ ... ≤ h_{N-1}. Monotonicity ensures that the resulting dendrogram forms a valid ultrametric tree where parent nodes are always positioned at equal or greater heights than their child nodes.",
        ),
        m(
          "Necessary and Sufficient Conditions for Monotonicity (Batagelj, 1981)",
          String.raw`\alpha_A + \alpha_B + \beta \ge 1, \quad \min(\alpha_A, \alpha_B) \ge \gamma, \quad \gamma \ge -\min(\alpha_A, \alpha_B), \quad \beta \ge 0`,
          "Vladimir Batagelj (1981) and Glenn Milligan (1979) established that an agglomerative algorithm operating via the Lance–Williams recurrence is guaranteed to produce monotonic dendrograms under any valid distance matrix if and only if these four conditions hold.",
        ),
        c(
          "The Root Cause of Centroid and Median Inversions",
          "In Centroid Linkage (UPGMC) and Median Linkage (WPGMC), the parameter β is strictly negative (β = -n_A n_B / (n_A + n_B)² < 0), directly violating the fourth condition (β ≥ 0). Because the centroid of the newly merged cluster μ_{A ∪ B} can lie physically closer to a third cluster C than the original centroids μ_A and μ_B were to each other, D(A ∪ B, C) can be strictly less than D(A, B). When this happens, a dendrogram inversion (reversal) occurs: a higher-level branch is drawn below its constituent child branches, producing confusing, intersecting tree branches.",
        ),
        n(
          "Why Ward's Method Preserves Monotonicity Despite β < 0",
          "While Ward's method has a negative β parameter in terms of inter-cluster distances (β = -n_C / (n_A + n_B + n_C) < 0), it satisfies α_A + α_B + β = 1. More fundamentally, Ward's method optimizes the within-cluster error sum of squares (ESS). Because merging any two clusters can never reduce total variance, the incremental variance increase is non-negative (ΔESS ≥ 0), and under Euclidean distances, the sequence of minimum variance increases is strictly non-decreasing, guaranteeing full monotonicity.",
        ),
        {
          kind: "table",
          columns: [
            "Linkage Method",
            "Geometric Shape Tendency",
            "Chaining Vulnerability",
            "Outlier Sensitivity",
            "Dendrogram Monotonicity",
            "Computational Space / Time",
          ],
          rows: [
            "Single",
            "Complete",
            "Average (UPGMA)",
            "Centroid (UPGMC)",
            "Ward's Minimum Variance",
          ],
          tableData: {
            Single: [
              "Elongated, serpentine, arbitrary non-globular shapes",
              "Severe (noise points form false connective bridges)",
              "Low (isolates distant points until the final stages)",
              "Always strictly monotonic (no inversions)",
              "O(N²) space, O(N²) time (via SLINK or Prim's MST)",
            ],
            Complete: [
              "Compact, spherical, equal-diameter globular clusters",
              "None (strongly resists chaining by enforcing max diameter)",
              "Extremely high (single outlier inflates cluster distance)",
              "Always strictly monotonic (no inversions)",
              "O(N²) space, O(N² log N) or O(N²) time (via CLINK)",
            ],
            "Average (UPGMA)": [
              "Balanced, moderately compact clusters of intermediate variance",
              "Very low (arithmetic averaging suppresses single-pair noise)",
              "Moderate (outliers contribute proportionally to cluster size)",
              "Always strictly monotonic (no inversions)",
              "O(N²) space, O(N²) time (via nearest-neighbor chains)",
            ],
            "Centroid (UPGMC)": [
              "Spherical clusters defined by geometric centers of mass",
              "Low (centroids represent cluster mass rather than boundaries)",
              "Moderate to high (distant outliers distort centroid position)",
              "NON-MONOTONIC: Subject to dendrogram inversions (reversals)",
              "O(N²) space, O(N²) time (via nearest-neighbor chains)",
            ],
            "Ward's Minimum Variance": [
              "Spherical, dense, balanced equal-size globular clusters",
              "None (heavily penalizes elongated variance structures)",
              "High (squared distance term amplifies outlier impact)",
              "Always strictly monotonic under Euclidean distance",
              "O(N²) space, O(N²) time (via Murtagh's NN-chain algorithm)",
            ],
          },
        },
      ),
      s(
        "Knowledge Check & Self-Assessment",
        c(
          "Interactive Conceptual Evaluation",
          "Test your comprehension of Lance–Williams recurrence parameters, monotonicity criteria, centroid inversions, and Ward's variance increase:",
        ),
        {
          kind: "custom",
          content: createElement(Module06Quiz),
        },
        c(
          "Module 06 References & Further Reading",
          "Lance, G. N., & Williams, W. T. (1967). A General Theory of Classificatory Sorting Strategies: 1. Hierarchical Systems. The Computer Journal, 9(4), 373–380. | Batagelj, V. (1981). Note on ultrametric hierarchical clustering algorithms. Psychometrika, 46(3), 351–352. | Ward, J. H. (1963). Hierarchical Grouping to Optimize an Objective Function. JASA, 58(301), 236–244. | Murtagh, F., & Contreras, P. (2012). Algorithms for Hierarchical Clustering: An Overview. WIREs Data Mining and Knowledge Discovery, 2(1), 86–97.",
        ),
      ),
    ],
  },
  {
    slug: "distance-metrics",
    title: "Distance Metrics",
    group: "Core Algorithms",
    icon: Ruler,
    subtitle:
      "Metric space axioms, geometric norm balls, angular divergence, covariance whitening, and high-dimensional distance concentration.",
    sections: [
      s(
        "Metric Space Axioms & Mathematical Foundations",
        c(
          "The Role of Distance in Hierarchical Clustering",
          "Hierarchical clustering algorithms do not operate directly on raw observations; they operate on pairwise dissimilarity matrices D ∈ ℝ^{N × N}. The choice of the ground distance function d(x, y) establishes the underlying geometry of the feature space, dictating how proximity is perceived before any linkage criterion is applied. For a distance function to constitute a rigorous mathematical metric, it must satisfy four universal axioms.",
        ),
        m(
          "Metric Space Axioms (Fréchet, 1906)",
          String.raw`\begin{aligned}
1. \; &\text{Non-Negativity:} \quad d(\mathbf{x}, \mathbf{y}) \ge 0 \\
2. \; &\text{Identity of Indiscernibles:} \quad d(\mathbf{x}, \mathbf{y}) = 0 \iff \mathbf{x} = \mathbf{y} \\
3. \; &\text{Symmetry:} \quad d(\mathbf{x}, \mathbf{y}) = d(\mathbf{y}, \mathbf{x}) \\
4. \; &\text{Triangle Inequality:} \quad d(\mathbf{x}, \mathbf{z}) \le d(\mathbf{x}, \mathbf{y}) + d(\mathbf{y}, \mathbf{z})
\end{aligned}`,
          "A pair (X, d) satisfying all four axioms forms a metric space. If axiom 2 is relaxed such that d(x, y) = 0 for distinct points, d is a pseudometric. If axiom 4 (triangle inequality) is violated, d is a semimetric or generic dissimilarity function.",
        ),
        {
          kind: "table",
          columns: [
            "Mathematical Space",
            "Axioms Satisfied",
            "Machine Learning Examples",
            "Hierarchical Clustering Compatibility",
          ],
          rows: [
            "Strict Metric Space",
            "Pseudometric Space",
            "Semimetric (Dissimilarity)",
            "Ultrametric Space",
          ],
          tableData: {
            "Strict Metric Space": [
              "Non-negativity, Identity, Symmetry, Triangle Inequality",
              "Euclidean (L₂), Manhattan (L₁), Minkowski (L_p, p ≥ 1), Mahalanobis",
              "Fully supported across all linkage criteria (Single, Complete, Average, Ward)",
            ],
            "Pseudometric Space": [
              "Non-negativity, Symmetry, Triangle Inequality (d(x,y)=0 possible for x ≠ y)",
              "Rank correlation distance, subspace projection distance",
              "Permitted; identical points coalesce into initial zero-height clusters",
            ],
            "Semimetric (Dissimilarity)": [
              "Non-negativity, Symmetry (VIOLATES Triangle Inequality)",
              "Cosine distance (1 - cos θ), Jaccard dissimilarity, KL divergence",
              "Requires careful linkage choice; Ward's variance minimization is invalid",
            ],
            "Ultrametric Space": [
              "Non-negativity, Identity, Symmetry, Strong Triangle Inequality: d(x, z) ≤ max(d(x, y), d(y, z))",
              "Dendrogram cophenetic distance matrix",
              "The exact target mathematical representation produced by hierarchical clustering",
            ],
          },
        },
      ),
      s(
        "Euclidean Distance (L₂ Norm)",
        c(
          "Straight-Line Spatial Separation",
          "Euclidean distance represents the standard straight-line ruler distance between two vectors in d-dimensional Euclidean space ℝᵈ. Rooted in the Pythagorean theorem, it measures the magnitude (L₂ norm) of the difference vector between two observations.",
        ),
        m(
          "Euclidean Distance Formal Definition",
          String.raw`d_2(\mathbf{x}, \mathbf{y}) = \| \mathbf{x} - \mathbf{y} \|_2 = \sqrt{\sum_{k=1}^d (x_k - y_k)^2}`,
          "Where x_k and y_k denote the coordinate values along the k-th feature dimension.",
        ),
        c(
          "Geometric Invariance and Scale Sensitivity",
          "Euclidean distance possesses rotational invariance: rotating the coordinate axes by an orthogonal transformation matrix R (where RᵀR = I) leaves all pairwise distances strictly unchanged (||Rx - Ry||₂ = ||x - y||₂). However, Euclidean distance is NOT scale invariant. If one feature is measured in millimeters and another in kilometers, the larger-scale feature will completely dominate the distance calculation. Consequently, feature standardization (z-score normalization: z = (x - μ) / σ) is mandatory prior to computing Euclidean hierarchical clustering.",
        ),
        c(
          "Deterministic Benchmark Numerical Calculations",
          "Evaluating Euclidean pairwise distances on our canonical 4-point benchmark P₁(1,2), P₂(2,3), P₃(6,5), P₄(7,6):",
        ),
        {
          kind: "table",
          columns: [
            "Point Pair",
            "Coordinate Differences (Δx, Δy)",
            "Squared Sum (Δx² + Δy²)",
            "Exact Euclidean Distance d₂",
          ],
          rows: ["P₁ to P₂", "P₁ to P₃", "P₁ to P₄", "P₂ to P₃", "P₂ to P₄", "P₃ to P₄"],
          tableData: {
            "P₁ to P₂": ["Δx = 2-1 = 1, Δy = 3-2 = 1", "1² + 1² = 1 + 1 = 2", "√2 ≈ 1.4142"],
            "P₁ to P₃": ["Δx = 6-1 = 5, Δy = 5-2 = 3", "5² + 3² = 25 + 9 = 34", "√34 ≈ 5.8310"],
            "P₁ to P₄": ["Δx = 7-1 = 6, Δy = 6-2 = 4", "6² + 4² = 36 + 16 = 52", "√52 ≈ 7.2111"],
            "P₂ to P₃": ["Δx = 6-2 = 4, Δy = 5-3 = 2", "4² + 2² = 16 + 4 = 20", "√20 ≈ 4.4721"],
            "P₂ to P₄": ["Δx = 7-2 = 5, Δy = 6-3 = 3", "5² + 3² = 25 + 9 = 34", "√34 ≈ 5.8310"],
            "P₃ to P₄": ["Δx = 7-6 = 1, Δy = 6-5 = 1", "1² + 1² = 1 + 1 = 2", "√2 ≈ 1.4142"],
          },
        },
      ),
      s(
        "Manhattan Distance (L₁ Norm)",
        c(
          "City Block & Taxicab Geometry",
          "Manhattan distance—also designated as taxicab distance, city block distance, or the L₁ norm—measures the path length between two points when traversal is strictly constrained to orthogonal coordinate grid axes, analogous to a taxi navigating the rectangular street grid of Manhattan.",
        ),
        m(
          "Manhattan Distance Formal Definition",
          String.raw`d_1(\mathbf{x}, \mathbf{y}) = \| \mathbf{x} - \mathbf{y} \|_1 = \sum_{k=1}^d |x_k - y_k|`,
          "Sums absolute coordinate differences without squaring.",
        ),
        c(
          "Robustness to Extreme Outliers",
          "Because Manhattan distance sums absolute differences |x_k - y_k| rather than squared differences (x_k - y_k)², it does not disproportionately penalize large single-dimension discrepancies. An extreme outlier in a single feature exerts a linear rather than quadratic influence, making L₁ clustering significantly more robust against noisy sensor data or corrupted feature values.",
        ),
        c(
          "Geometric Bounds & Relationship to Euclidean Norm",
          "In any d-dimensional real space, the Manhattan and Euclidean distances are related by rigorous geometric inequalities: d₂(x, y) ≤ d₁(x, y) ≤ √d · d₂(x, y). The lower bound holds with equality when the difference vector aligns perfectly with a single coordinate axis; the upper bound holds when differences are equal across all d dimensions.",
        ),
        {
          kind: "table",
          columns: [
            "Point Pair",
            "Absolute Sum (|Δx| + |Δy|)",
            "Exact Manhattan Distance d₁",
            "Comparison with Euclidean d₂",
          ],
          rows: ["P₁ to P₂", "P₁ to P₃", "P₁ to P₄", "P₂ to P₃", "P₂ to P₄", "P₃ to P₄"],
          tableData: {
            "P₁ to P₂": ["|1| + |1| = 1 + 1", "2.0000", "d₁ (2.0000) > d₂ (1.4142)"],
            "P₁ to P₃": ["|5| + |3| = 5 + 3", "8.0000", "d₁ (8.0000) > d₂ (5.8310)"],
            "P₁ to P₄": ["|6| + |4| = 6 + 4", "10.0000", "d₁ (10.0000) > d₂ (7.2111)"],
            "P₂ to P₃": ["|4| + |2| = 4 + 2", "6.0000", "d₁ (6.0000) > d₂ (4.4721)"],
            "P₂ to P₄": ["|5| + |3| = 5 + 3", "8.0000", "d₁ (8.0000) > d₂ (5.8310)"],
            "P₃ to P₄": ["|1| + |1| = 1 + 1", "2.0000", "d₁ (2.0000) > d₂ (1.4142)"],
          },
        },
      ),
      s(
        "Minkowski Distance & Chebyshev Limit",
        c(
          "Generalized Vector p-Norm Framework",
          "Hermann Minkowski (1910) introduced a parametric family of metrics that subsumes both Manhattan and Euclidean distances as special cases. For any real parameter p ≥ 1, the Minkowski distance defines a valid normed metric space.",
        ),
        m(
          "Minkowski Distance Formulation",
          String.raw`d_p(\mathbf{x}, \mathbf{y}) = \| \mathbf{x} - \mathbf{y} \|_p = \left( \sum_{k=1}^d |x_k - y_k|^p \right)^{1/p}`,
          "Valid metric for all p ≥ 1 by the Minkowski inequality. When p < 1, the triangle inequality fails, producing a non-convex quasi-metric.",
        ),
        m(
          "Chebyshev Distance (L_∞ Limiting Norm)",
          String.raw`d_\infty(\mathbf{x}, \mathbf{y}) = \lim_{p \to \infty} \left( \sum_{k=1}^d |x_k - y_k|^p \right)^{1/p} = \max_{k=1, \dots, d} |x_k - y_k|`,
          "Also known as the maximum metric or chessboard distance (representing the minimum number of moves a king requires to travel between squares).",
        ),
        c(
          "Geometric Morphology of Unit Norm Balls",
          "The unit ball B_p = {x ∈ ℝ² : ||x||_p ≤ 1} illustrates how the metric parameter p governs distance topology: for p = 1, B₁ is a diamond tilted at 45°; for p = 2, B₂ is the classical circle; as p → ∞, B_p expands into a square aligned with the coordinate axes. When p < 1 (fractional norms), the unit ball indents into a concave 4-pointed star, violating convexity and the triangle inequality.",
        ),
        {
          kind: "custom",
          content: createElement(DistanceMetricExplorer),
        },
      ),
      s(
        "Cosine Similarity and Angular Distance",
        c(
          "Directional Similarity Independent of Vector Magnitude",
          "In many machine learning applications—such as natural language processing (TF-IDF, word embeddings), information retrieval, and gene expression profiling—the absolute magnitude (length) of a feature vector reflects document size or observation intensity rather than semantic identity. Cosine similarity computes the cosine of the angle θ between two non-zero vectors, evaluating directional alignment regardless of vector scale.",
        ),
        m(
          "Cosine Similarity and Cosine Distance",
          String.raw`S_C(\mathbf{x}, \mathbf{y}) = \frac{\mathbf{x} \cdot \mathbf{y}}{\| \mathbf{x} \|_2 \| \mathbf{y} \|_2} = \cos \theta, \quad d_{\cos}(\mathbf{x}, \mathbf{y}) = 1 - S_C(\mathbf{x}, \mathbf{y}) = 1 - \frac{\sum_{k=1}^d x_k y_k}{\sqrt{\sum x_k^2} \sqrt{\sum y_k^2}}`,
          "For non-negative vectors, S_C ∈ [0, 1] and d_cos ∈ [0, 1]. For general real vectors, S_C ∈ [-1, 1] and d_cos ∈ [0, 2].",
        ),
        n(
          "CRITICAL: Why Cosine Distance Violates the Triangle Inequality",
          "Standard Cosine Distance d_cos(x, y) = 1 - cos θ is NOT a proper metric because it violates the triangle inequality! For example, let three 2D unit vectors be u at 0°, v at 60°, and w at 120°. Then d_cos(u, v) = 1 - cos(60°) = 1 - 0.5 = 0.5, d_cos(v, w) = 1 - 0.5 = 0.5, but d_cos(u, w) = 1 - cos(120°) = 1 - (-0.5) = 1.5. Because 1.5 > 0.5 + 0.5, the triangle inequality fails! To obtain a strict metric, one must use Normalized Angular Distance: d_θ(x, y) = arccos(S_C(x, y)) / π, which maps the angular arc onto [0, 1] and rigorously satisfies all metric axioms.",
        ),
        {
          kind: "table",
          columns: [
            "Vector Pair",
            "Dot Product (u · v)",
            "Magnitudes (||u||, ||v||)",
            "Cosine Similarity S_C",
            "Cosine Distance d_cos",
          ],
          rows: ["P₁ and P₂", "P₁ and P₃", "P₁ and P₄", "P₃ and P₄"],
          tableData: {
            "P₁ and P₂": [
              "1·2 + 2·3 = 8.0",
              "√5 ≈ 2.2361, √13 ≈ 3.6056",
              "8 / √65 ≈ 0.9923",
              "0.0077 (Near-parallel vectors)",
            ],
            "P₁ and P₃": [
              "1·6 + 2·5 = 16.0",
              "√5 ≈ 2.2361, √61 ≈ 7.8102",
              "16 / √305 ≈ 0.9162",
              "0.0838 (Moderate angular divergence)",
            ],
            "P₁ and P₄": [
              "1·7 + 2·6 = 19.0",
              "√5 ≈ 2.2361, √85 ≈ 9.2195",
              "19 / √425 ≈ 0.9216",
              "0.0784 (Angle θ ≈ 22.8°)",
            ],
            "P₃ and P₄": [
              "6·7 + 5·6 = 72.0",
              "√61 ≈ 7.8102, √85 ≈ 9.2195",
              "72 / √5185 ≈ 0.9999",
              "0.0001 (Virtually collinear vectors)",
            ],
          },
        },
      ),
      s(
        "Mahalanobis Distance & Feature Covariance",
        c(
          "Covariance-Standardized Statistical Proximity",
          "Prasanta Chandra Mahalanobis (1936) formulated a statistical distance metric that accounts for feature variance and inter-feature correlations. When features are correlated, Euclidean distance distorts cluster boundaries by double-counting shared variance along the principal correlation axis.",
        ),
        m(
          "Mahalanobis Distance Formal Formulation",
          String.raw`d_M(\mathbf{x}, \mathbf{y}) = \sqrt{(\mathbf{x} - \mathbf{y})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x} - \mathbf{y})}`,
          "Where Σ is the d × d sample covariance matrix, and Σ⁻¹ is the precision (inverse covariance) matrix. Requires det(Σ) > 0 (non-singular covariance).",
        ),
        c(
          "Geometric Interpretation: Whitening and Ellipsoidal Contours",
          "Mahalanobis distance geometrically corresponds to applying a whitening transformation (Σ^{-1/2}) to the feature space and then calculating standard Euclidean distance: d_M(x, y) = || Σ^{-1/2} (x - y) ||₂. Under Mahalanobis distance, isodistance loci form ellipsoids whose principal axes align with the eigenvectors of Σ and whose axis lengths are proportional to the square roots of the eigenvalues. When features are uncorrelated and standardized (Σ = I), Mahalanobis distance simplifies exactly to Euclidean distance.",
        ),
      ),
      s(
        "Curse of Dimensionality & Distance Concentration",
        c(
          "The High-Dimensional Geometry Breakdown",
          "In high-dimensional spaces (d > 50, 100, 1000), standard geometric intuition derived from 2D and 3D completely fails. Richard Bellman coined the term 'Curse of Dimensionality' in 1961 to describe the exponential volume expansion of feature spaces. For distance-based machine learning and hierarchical clustering in particular, the most devastating consequence is the phenomenon of distance concentration.",
        ),
        m(
          "High-Dimensional Distance Concentration Theorem (Beyer et al., 1999)",
          String.raw`\lim_{d \to \infty} \frac{D_{\max} - D_{\min}}{D_{\min}} = 0`,
          "Under mild distributional assumptions (such as i.i.d. feature components), the relative contrast between the farthest neighbor D_max and nearest neighbor D_min converges to zero as dimensionality d approaches infinity.",
        ),
        c(
          "Why Pairwise Distances Concentrate",
          "Consider the squared Euclidean distance between two random points: D² = ∑_{k=1}^d (x_k - y_k)². By the Central Limit Theorem and Law of Large Numbers, D² is the sum of d independent random variables. Its expected value scales linearly with dimension E[D²] = d · σ_diff², so the mean distance scales as μ_D ∝ √d. However, its standard deviation scales only as σ_D ∝ O(1). Consequently, the relative variance σ_D / μ_D ∝ 1 / √d → 0! Pairwise distances collapse into an ultra-narrow spherical shell, causing every data point to appear virtually equidistant from every other data point.",
        ),
        n(
          "Catastrophic Impact on Hierarchical Linkage Criteria",
          "Distance concentration undermines the core premise of hierarchical clustering: Single Linkage becomes hypersensitive to minuscule numerical noise and collapses into a continuous chaining sequence; Complete Linkage creates spurious, arbitrary cluster splits; and Ward's method suffers from severe cluster size distortion. Remediation requires dimensionality reduction (PCA, UMAP, t-SNE) or feature selection before hierarchical clustering.",
        ),
        {
          kind: "custom",
          content: createElement(CurseOfDimensionalitySimulator),
        },
      ),
      s(
        "Knowledge Check & Self-Assessment",
        c(
          "Interactive Conceptual Evaluation",
          "Test your comprehension of metric space axioms, norm ball morphology, cosine angular divergence, Mahalanobis covariance whitening, and high-dimensional distance concentration:",
        ),
        {
          kind: "custom",
          content: createElement(Module07Quiz),
        },
        c(
          "Module 07 References & Further Reading",
          "Fréchet, M. (1906). Sur quelques points du calcul fonctionnel. Rendiconti del Circolo Matematico di Palermo, 22(1), 1–72. | Minkowski, H. (1910). Geometrie der Zahlen. Teubner. | Mahalanobis, P. C. (1936). On the generalized distance in statistics. Proceedings of the National Institute of Sciences of India, 2(1), 49–55. | Beyer, K., Goldstein, J., Ramakrishnan, R., & Shaft, U. (1999). When Is 'Nearest Neighbor' Meaningful? ICDT 1999, LNCS 1540, 217–235. | Aggarwal, C. C., Hinneburg, A., & Keim, D. A. (2001). On the Surprising Behavior of Distance Metrics in High Dimensional Space. ICDT 2001, 420–434.",
        ),
      ),
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
