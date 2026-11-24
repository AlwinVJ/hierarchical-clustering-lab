import type { LucideIcon } from "lucide-react";
import { createElement, type ReactNode } from "react";
import { ParadigmComparisonVisualizer, Module03Quiz } from "@/content/module03-types";
import { AgglomerativeSimulator, Module04Quiz } from "@/content/module04-agglomerative";
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
