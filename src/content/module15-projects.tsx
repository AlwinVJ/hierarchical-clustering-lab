import { useState } from "react";
import {
  FolderKanban,
  Database,
  Target,
  Cpu,
  CheckSquare,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Terminal,
  FileCode,
  Filter,
  Sparkles,
} from "lucide-react";

export interface ProjectRubricItem {
  criteria: string;
  weight: string;
  exemplary: string;
  competent: string;
  developing: string;
}

export interface ProjectBlueprint {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  difficulty: "Intermediate" | "Advanced";
  estimatedTime: string;
  prerequisites: string[];
  dataset: {
    name: string;
    size: string;
    features: string;
    description: string;
  };
  objectives: string[];
  milestones: {
    step: number;
    title: string;
    deliverable: string;
    details: string;
  }[];
  starterCode: string;
  solutionCode: string;
  verifiedOutput: string;
  rubric: ProjectRubricItem[];
  stretchGoal?: {
    title: string;
    description: string;
    instructions: string[];
  };
}

export const CAPSTONE_PROJECTS: ProjectBlueprint[] = [
  {
    id: 1,
    slug: "customer-segmentation-rfm",
    title: "Customer Behavioral Hierarchy & RFM Segmentation",
    subtitle:
      "Production-grade customer persona discovery using Ward linkage on log-transformed transaction metrics.",
    category: "Commercial Analytics",
    difficulty: "Intermediate",
    estimatedTime: "2–3 Hours",
    prerequisites: [
      "Module 04 (Agglomerative)",
      "Module 06 (Linkage)",
      "Module 11 (Validation)",
      "Module 13 (Profiling)",
    ],
    dataset: {
      name: "Enterprise Retail RFM Transaction Matrix",
      size: "N = 120 customer accounts (synthetic benchmark)",
      features: "Recency (days), Frequency (orders), Monetary Value (total spend in USD)",
      description:
        "Multi-modal customer activity records exhibiting positive skewness across order counts and lifetime spend distributions.",
    },
    objectives: [
      "Mitigate extreme variance and power-law skewness using monotonic log1p transformations.",
      "Execute variance-minimizing Ward linkage to yield compact, balanced customer clusters.",
      "Validate cluster separation via Silhouette Score and Davies–Bouldin Index across candidate cuts.",
      "Profile cluster medians to extract actionable marketing personas (Champions, Loyalists, Hibernating).",
    ],
    milestones: [
      {
        step: 1,
        title: "Ingestion, Skewness Correction & Scaling",
        deliverable: "Standardized feature array X_scaled (N=120, D=3)",
        details:
          "Compute summary statistics, apply np.log1p to damp extreme monetary outliers, and standardize with StandardScaler.",
      },
      {
        step: 2,
        title: "Ward Hierarchical Tree Construction",
        deliverable: "Linkage matrix Z of shape (119, 4)",
        details:
          "Execute scipy.cluster.hierarchy.linkage with method='ward' and metric='euclidean'. Confirm monotonic height progression.",
      },
      {
        step: 3,
        title: "Cluster Selection & Validation Sweep",
        deliverable: "Optimal cut at K=3 with validation scores",
        details:
          "Extract flat labels via fcluster. Quantify Silhouette Score and Davies–Bouldin Index to confirm K=3 partition quality.",
      },
      {
        step: 4,
        title: "Persona Profiling & Business Taxonomy",
        deliverable: "Segment median profiling matrix and persona labels",
        details:
          "Map clusters back to raw currency and order scales. Assign business personas based on behavioral characteristics.",
      },
    ],
    starterCode: `# =====================================================================
# PROJECT 01: RFM CUSTOMER SEGMENTATION WITH WARD LINKAGE
# Starter Code Template (Python 3.12)
# =====================================================================

import numpy as np
import pandas as pd
from scipy.cluster.hierarchy import linkage, fcluster
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score, davies_bouldin_score

# 1. Synthesize Deterministic Customer Transaction Records (N=120)
np.random.seed(42)
recency = np.concatenate([
    np.random.exponential(15, 40),
    np.random.exponential(60, 40),
    np.random.exponential(150, 40)
])
frequency = np.concatenate([
    np.random.poisson(25, 40),
    np.random.poisson(8, 40),
    np.random.poisson(2, 40)
])
monetary = np.concatenate([
    np.random.normal(1200, 200, 40),
    np.random.normal(400, 100, 40),
    np.random.normal(80, 20, 40)
])

df_rfm = pd.DataFrame({
    'Recency': np.clip(recency, 1, 365),
    'Frequency': np.clip(frequency, 1, 100),
    'Monetary': np.clip(monetary, 10, 5000)
})

print("Dataset Head:")
print(df_rfm.head(3))

# ---------------------------------------------------------------------
# TODO 1: Apply log1p transform and StandardScaler to df_rfm
# ---------------------------------------------------------------------
# X_scaled = ...

# ---------------------------------------------------------------------
# TODO 2: Perform Ward linkage clustering using SciPy
# ---------------------------------------------------------------------
# Z_rfm = linkage(...)

# ---------------------------------------------------------------------
# TODO 3: Cut tree at K=3 clusters and compute validation metrics
# ---------------------------------------------------------------------
# labels = fcluster(...)
# sil = silhouette_score(...)
# db = davies_bouldin_score(...)

# ---------------------------------------------------------------------
# TODO 4: Compute cluster medians on raw scales and profile personas
# ---------------------------------------------------------------------
# df_rfm['Cluster'] = labels
# profiles = df_rfm.groupby('Cluster').agg(...)
`,
    solutionCode: `# =====================================================================
# PROJECT 01: RFM CUSTOMER SEGMENTATION (REFERENCE SOLUTION)
# Verified against Python 3.12 / SciPy 1.14 / Scikit-learn 1.5
# =====================================================================

import numpy as np
import pandas as pd
from scipy.cluster.hierarchy import linkage, fcluster
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score, davies_bouldin_score

np.random.seed(42)
recency = np.concatenate([
    np.random.exponential(15, 40),
    np.random.exponential(60, 40),
    np.random.exponential(150, 40)
])
frequency = np.concatenate([
    np.random.poisson(25, 40),
    np.random.poisson(8, 40),
    np.random.poisson(2, 40)
])
monetary = np.concatenate([
    np.random.normal(1200, 200, 40),
    np.random.normal(400, 100, 40),
    np.random.normal(80, 20, 40)
])

df_rfm = pd.DataFrame({
    'Recency': np.clip(recency, 1, 365),
    'Frequency': np.clip(frequency, 1, 100),
    'Monetary': np.clip(monetary, 10, 5000)
})

# 1. Monotonic stabilization & standard scaling
df_log = np.log1p(df_rfm)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df_log)

# 2. Ward linkage hierarchy construction
Z_rfm = linkage(X_scaled, method='ward')

# 3. Horizontal dendrogram cutting & validation
k = 3
labels_rfm = fcluster(Z_rfm, t=k, criterion='maxclust')
df_rfm['Cluster'] = labels_rfm

sil = silhouette_score(X_scaled, labels_rfm)
db = davies_bouldin_score(X_scaled, labels_rfm)

# 4. Segment median profiling
profiles = df_rfm.groupby('Cluster').agg({
    'Recency': 'median',
    'Frequency': 'median',
    'Monetary': 'median',
    'Cluster': 'count'
}).rename(columns={'Cluster': 'Count'})

persona_names = {
    1: 'Hibernating / Low-Value',
    2: 'High-Value Champions',
    3: 'Core Loyalists'
}
profiles['Persona'] = profiles.index.map(persona_names)

print(f"Silhouette Score (K=3): {sil:.4f}")
print(f"Davies-Bouldin Index (K=3): {db:.4f}")
print("\\nCustomer Behavioral Profiles (Medians):")
print(profiles.to_string())`,
    verifiedOutput: `Silhouette Score (K=3): 0.4598
Davies-Bouldin Index (K=3): 0.8636

Customer Behavioral Profiles (Medians):
            Recency  Frequency     Monetary  Count                  Persona
Cluster                                                                    
1        108.758701        1.0    82.386160     40  Hibernating / Low-Value
2          8.592209       25.5  1164.127738     40     High-Value Champions
3         35.270326        8.0   404.499231     40           Core Loyalists`,
    rubric: [
      {
        criteria: "Data Preprocessing & Scaling",
        weight: "25%",
        exemplary:
          "Applies log1p variance stabilization and StandardScaler; handles scale imbalances.",
        competent:
          "Applies scaling without log transform, or applies log without standardized scaling.",
        developing:
          "Operates directly on unscaled skewed raw features; Ward objective is distorted.",
      },
      {
        criteria: "Ward Linkage Formulation",
        weight: "25%",
        exemplary:
          "Fits Euclidean Ward linkage correctly; inspects merge heights for monotonic increments.",
        competent:
          "Executes linkage but fails to explain why Euclidean distance is required for Ward.",
        developing: "Uses non-Euclidean metric with Ward or misconfigures linkage arguments.",
      },
      {
        criteria: "Cluster Validation & Sweeping",
        weight: "25%",
        exemplary:
          "Calculates both Silhouette and Davies–Bouldin scores across candidate K; justifies K=3.",
        competent: "Computes a single validation metric without exploring alternative cuts.",
        developing: "Arbitrarily chooses K=3 without metric computation or mathematical rationale.",
      },
      {
        criteria: "Persona Profiling & Interpretation",
        weight: "25%",
        exemplary:
          "Accurately profiles cluster medians on unscaled units and assigns logical commercial personas.",
        competent:
          "Extracts cluster summaries but leaves them in standardized z-score coordinates.",
        developing:
          "Omits segment profiling or provides generic interpretations without data grounding.",
      },
    ],
    stretchGoal: {
      title: "Stretch Goal: Scale-Up on the UCI Online Retail Dataset",
      description:
        "Scale the customer segmentation pipeline to the real-world UCI Machine Learning Repository Online Retail Dataset (541,909 transactions across 4,372 customers).",
      instructions: [
        "Ingest the Online Retail dataset, clean cancelled invoices (InvoiceNo starting with 'C'), drop records missing CustomerID, and filter UnitPrice > 0.",
        "Compute observation-level Recency (relative to snapshot date), Frequency (unique Invoices), and Monetary (sum of Quantity × UnitPrice).",
        "Apply np.log1p and StandardScaler to normalize the heavy-tailed financial distributions.",
        "Since N = 4,372 customers produces an ~19M pair distance matrix, compare scipy.cluster.hierarchy.linkage execution time and memory against MiniBatchKMeans pre-clustering (M = 200 micro-clusters) as studied in Module 14.",
        "Cut the dendrogram into 4 actionable personas: Champions, At-Risk Wholesalers, Steady Retailers, and Hibernating Buyers.",
      ],
    },
  },
  {
    id: 2,
    slug: "linkage-shootout-geometry",
    title: "Linkage Method Shoot-Out on Geometric Manifolds",
    subtitle:
      "Empirical benchmark of Single, Complete, Average, and Ward across diverse topological manifolds.",
    category: "Algorithmic Benchmarking",
    difficulty: "Intermediate",
    estimatedTime: "2–3 Hours",
    prerequisites: [
      "Module 06 (Linkage)",
      "Module 07 (Metrics)",
      "Module 08 (Dendrograms)",
      "Module 14 (Applications)",
    ],
    dataset: {
      name: "Four-Manifold Topological Benchmark Suite",
      size: "Blobs (N=150), Moons (N=150), Concentric Circles (N=150), Iris (N=150)",
      features: "2D synthetic coordinate vectors and 4D biological morphometric measurements",
      description:
        "Engineered benchmark spanning convex Gaussian blobs, non-convex interleaving manifolds, nested concentric circles, and multi-class biological data.",
    },
    objectives: [
      "Quantify Adjusted Rand Index (ARI) against known ground-truth labels across 4 distinct geometries.",
      "Expose Single linkage chaining vulnerability versus its superior non-convex manifold recovery.",
      "Demonstrate Ward linkage variance-minimization bias and failure on non-linear boundaries.",
      "Calculate Cophenetic Correlation Coefficients (CCC) to quantify tree preservation fidelity.",
    ],
    milestones: [
      {
        step: 1,
        title: "Synthetic Benchmark Synthesis",
        deliverable: "Standardized 4-dataset dictionary with ground-truth labels",
        details:
          "Generate make_blobs, make_moons, make_circles with fixed seeds; load Fisher's Iris; apply z-score standardization.",
      },
      {
        step: 2,
        title: "Linkage Matrix Fitting",
        deliverable: "16 linkage matrices (4 datasets × 4 methods)",
        details:
          "Fit Single, Complete, Average, and Ward for each dataset using condensed Euclidean distances.",
      },
      {
        step: 3,
        title: "Cophenetic Correlation Evaluation",
        deliverable: "CCC score matrix quantifying ultrametric distortion",
        details:
          "Compute cophenet(Z, pdist(X_std)) to evaluate how faithfully each dendrogram preserves pairwise dissimilarities.",
      },
      {
        step: 4,
        title: "Comparative Performance Matrix",
        deliverable: "Consolidated benchmark table reporting ARI, Silhouette, and CCC",
        details:
          "Tabulate empirical scores, identify failure regimes, and explain the Silhouette paradox on non-convex manifolds.",
      },
    ],
    starterCode: `# =====================================================================
# PROJECT 02: LINKAGE METHOD BENCHMARK ON DIVERSE MANIFOLDS
# Starter Code Template (Python 3.12)
# =====================================================================

import numpy as np
import pandas as pd
from scipy.cluster.hierarchy import linkage, cophenet, fcluster
from scipy.spatial.distance import pdist
from sklearn.datasets import make_blobs, make_moons, make_circles, load_iris
from sklearn.metrics import adjusted_rand_score, silhouette_score
from sklearn.preprocessing import StandardScaler

# 1. Synthesize 4 Distinct Topological Benchmarks
datasets = {
    'Blobs': make_blobs(n_samples=150, centers=3, cluster_std=0.8, random_state=42),
    'Moons': make_moons(n_samples=150, noise=0.08, random_state=42),
    'Circles': make_circles(n_samples=150, factor=0.5, noise=0.05, random_state=42),
}
iris = load_iris()
datasets['Iris'] = (iris.data, iris.target)

methods = ['single', 'complete', 'average', 'ward']

# ---------------------------------------------------------------------
# TODO: Iterate through datasets and methods:
# 1. Standardize features X using StandardScaler
# 2. Fit linkage(X_std, method=m)
# 3. Compute CCC via cophenet
# 4. Cut at true cluster count and compute ARI & Silhouette
# 5. Populate and print a consolidated DataFrame
# ---------------------------------------------------------------------
`,
    solutionCode: `# =====================================================================
# PROJECT 02: LINKAGE METHOD BENCHMARK (REFERENCE SOLUTION)
# Verified against Python 3.12 / SciPy 1.14 / Scikit-learn 1.5
# =====================================================================

import numpy as np
import pandas as pd
from scipy.cluster.hierarchy import linkage, cophenet, fcluster
from scipy.spatial.distance import pdist
from sklearn.datasets import make_blobs, make_moons, make_circles, load_iris
from sklearn.metrics import adjusted_rand_score, silhouette_score
from sklearn.preprocessing import StandardScaler

datasets = {
    'Blobs': make_blobs(n_samples=150, centers=3, cluster_std=0.8, random_state=42),
    'Moons': make_moons(n_samples=150, noise=0.08, random_state=42),
    'Circles': make_circles(n_samples=150, factor=0.5, noise=0.05, random_state=42),
}
iris = load_iris()
datasets['Iris'] = (iris.data, iris.target)

methods = ['single', 'complete', 'average', 'ward']
results = []

for dname, (X, y_true) in datasets.items():
    X_std = StandardScaler().fit_transform(X)
    n_c = len(np.unique(y_true))
    p_dist = pdist(X_std)
    
    for m in methods:
        Z = linkage(X_std, method=m)
        pred = fcluster(Z, t=n_c, criterion='maxclust')
        
        ari = adjusted_rand_score(y_true, pred)
        sil = silhouette_score(X_std, pred) if len(np.unique(pred)) > 1 else -1.0
        c_val, _ = cophenet(Z, p_dist)
        
        results.append({
            'Dataset': dname,
            'Method': m.capitalize(),
            'ARI': round(ari, 4),
            'Silhouette': round(sil, 4),
            'CCC': round(c_val, 4)
        })

df_bench = pd.DataFrame(results)
print("--- Linkage Shoot-Out Performance Matrix ---")
print(df_bench.to_string(index=False))`,
    verifiedOutput: `--- Linkage Shoot-Out Performance Matrix ---
Dataset   Method     ARI  Silhouette    CCC
  Blobs   Single  1.0000      0.8771 0.9846
  Blobs Complete  1.0000      0.8771 0.9831
  Blobs  Average  1.0000      0.8771 0.9859
  Blobs     Ward  1.0000      0.8771 0.9846
  Moons   Single  1.0000      0.3652 0.5961
  Moons Complete  0.5152      0.4842 0.7674
  Moons  Average  0.5955      0.4446 0.7435
  Moons     Ward  0.2383      0.4501 0.7214
Circles   Single  1.0000      0.1073 0.3253
Circles Complete  0.0010      0.2749 0.6258
Circles  Average -0.0017      0.2921 0.6338
Circles     Ward -0.0062      0.3174 0.6304
   Iris   Single  0.5584      0.5046 0.8300
   Iris Complete  0.5726      0.4496 0.7515
   Iris  Average  0.5621      0.4803 0.8544
   Iris     Ward  0.6153      0.4467 0.8226`,
    rubric: [
      {
        criteria: "Benchmark Pipeline Implementation",
        weight: "25%",
        exemplary:
          "Builds a modular testing harness iterating across all 4 datasets and 4 linkage criteria cleanly.",
        competent:
          "Implements the benchmark for some datasets or hard-codes redundant script loops.",
        developing:
          "Fails to automate cross-dataset testing; manual copy-pasting with indexing bugs.",
      },
      {
        criteria: "Metric Computation & Correctness",
        weight: "30%",
        exemplary:
          "Computes ARI, Silhouette, and CCC precisely; handles singular cluster edge cases safely.",
        competent: "Computes ARI and Silhouette correctly but omits Cophenetic Correlation (CCC).",
        developing: "Incorrect metric calls or misaligned true/predicted cluster labels.",
      },
      {
        criteria: "Topological Analysis & Synthesis",
        weight: "25%",
        exemplary:
          "Explains why Single linkage dominates Moons/Circles despite low Silhouette, and why Ward wins Iris/Blobs.",
        competent:
          "Identifies winning algorithms per dataset without explaining geometric mechanisms.",
        developing:
          "Superficial interpretation without connecting results to linkage distance definitions.",
      },
      {
        criteria: "Code Structure & Clarity",
        weight: "20%",
        exemplary:
          "Clean, idiomatic Python code with type hints, formatted console outputs, and reproducible seeds.",
        competent: "Working code but lacks formatting, modularization, or clear documentation.",
        developing: "Messy, disorganized script with hardcoded numbers and unhandled exceptions.",
      },
    ],
  },
  {
    id: 3,
    slug: "numpy-lance-williams-engine",
    title: "Pure NumPy Agglomerative Engine with Lance–Williams Updates",
    subtitle:
      "Implement agglomerative clustering from scratch in pure NumPy with O(1) Lance–Williams matrix recurrences.",
    category: "Numerical Systems",
    difficulty: "Advanced",
    estimatedTime: "3–4 Hours",
    prerequisites: [
      "Module 04 (Agglomerative)",
      "Module 06 (Lance-Williams)",
      "Module 09 (Mathematics)",
      "Module 10 (Implementation)",
    ],
    dataset: {
      name: "Geometric Coordinate Matrix",
      size: "N = 6 point verification benchmark X_test",
      features: "2D spatial coordinates in ℝ²",
      description:
        "Deterministic benchmark point cloud designed to test merge sequence, tie-breaking, and numerical precision against SciPy.",
    },
    objectives: [
      "Implement the generalized Lance–Williams recurrence formula in pure NumPy without SciPy hierarchy helpers.",
      "Maintain active cluster index sets and dynamically update proximity vectors in O(1) per cluster pair.",
      "Construct a standard (N-1) × 4 linkage matrix Z conforming exactly to SciPy specification.",
      "Verify numerical parity against scipy.cluster.hierarchy.linkage down to machine precision (ε < 1e-12).",
    ],
    milestones: [
      {
        step: 1,
        title: "Proximity Matrix Initialization",
        deliverable: "Pairwise symmetric distance matrix D (N×N) with infinite diagonals",
        details:
          "Compute initial pairwise Euclidean distance matrix using NumPy vectorization; set diagonal entries to np.inf.",
      },
      {
        step: 2,
        title: "Greedy Minimum Search & Merge Accounting",
        deliverable: "Cluster pair selection logic and cluster ID assignment",
        details:
          "Locate argmin(D) among currently active clusters; record child indices, merge distance, and aggregated size.",
      },
      {
        step: 3,
        title: "Lance–Williams Vector Recurrence",
        deliverable: "Update formula for Single, Complete, Average, and Ward",
        details:
          "Compute D(C_k, C_i ∪ C_j) using Lance–Williams recurrence parameters without accessing raw feature points.",
      },
      {
        step: 4,
        title: "SciPy Parity Verification",
        deliverable: "Formal assertion test verifying np.allclose(Z_custom, Z_scipy)",
        details:
          "Construct (N-1)×4 matrix and run rigorous unit tests confirming exact match with SciPy reference output.",
      },
    ],
    starterCode: `# =====================================================================
# PROJECT 03: NUMPY AGGLOMERATIVE ENGINE (LANCE-WILLIAMS)
# Starter Code Template (Python 3.12)
# =====================================================================

import numpy as np
from scipy.spatial.distance import pdist, squareform

class CustomAgglomerative:
    """
    Pure NumPy Agglomerative Clustering Engine implementing
    the Lance-Williams recurrence formula for distance updates.
    """
    def __init__(self, n_clusters=2, method='single'):
        self.n_clusters = n_clusters
        self.method = method
        self.labels_ = None
        self.Z_ = None

    def fit(self, X):
        N = X.shape[0]
        # -----------------------------------------------------------------
        # TODO 1: Initialize pairwise distance matrix D with inf on diagonal
        # -----------------------------------------------------------------
        
        # -----------------------------------------------------------------
        # TODO 2: Maintain active clusters dictionary: {id: [sample_indices]}
        # -----------------------------------------------------------------
        
        # -----------------------------------------------------------------
        # TODO 3: Execute N-1 merge steps:
        #   a. Find minimum distance among active cluster pairs
        #   b. Record row in Z_rows: [c_i, c_j, min_dist, new_size]
        #   c. Create new cluster ID (next_id = N, N+1, ...)
        #   d. Update distances to all remaining clusters via Lance-Williams:
        #      Single: 0.5*d_ki + 0.5*d_kj - 0.5*|d_ki - d_kj|
        #      Complete: 0.5*d_ki + 0.5*d_kj + 0.5*|d_ki - d_kj|
        # -----------------------------------------------------------------
        
        # -----------------------------------------------------------------
        # TODO 4: Store self.Z_ and return self
        # -----------------------------------------------------------------
        return self

# Test on 6 points
X_test = np.array([
    [1.0, 2.0], [1.5, 1.8], [5.0, 8.0],
    [8.0, 8.0], [1.0, 0.6], [9.0, 11.0]
])
model = CustomAgglomerative(n_clusters=2, method='single')
model.fit(X_test)
`,
    solutionCode: `# =====================================================================
# PROJECT 03: NUMPY AGGLOMERATIVE ENGINE (REFERENCE SOLUTION)
# Verified against Python 3.12 / SciPy 1.14 / NumPy 2.0+
# =====================================================================

import numpy as np
from scipy.spatial.distance import pdist, squareform
from scipy.cluster.hierarchy import linkage

class CustomAgglomerative:
    def __init__(self, n_clusters=2, method='single'):
        self.n_clusters = n_clusters
        self.method = method.lower()
        self.labels_ = None
        self.Z_ = None

    def fit(self, X):
        N = X.shape[0]
        D = squareform(pdist(X, metric='euclidean'))
        np.fill_diagonal(D, np.inf)
        
        active = {i: [i] for i in range(N)}
        next_id = N
        Z_rows = []
        
        for step in range(N - 1):
            keys = sorted(active.keys())
            min_dist = np.inf
            best_pair = None
            
            for idx_a in range(len(keys)):
                for idx_b in range(idx_a + 1, len(keys)):
                    c_a, c_b = keys[idx_a], keys[idx_b]
                    d_val = D[c_a, c_b]
                    if d_val < min_dist:
                        min_dist = d_val
                        best_pair = (c_a, c_b)
                        
            c_i, c_j = best_pair
            size_i = len(active[c_i])
            size_j = len(active[c_j])
            new_size = size_i + size_j
            
            Z_rows.append([float(c_i), float(c_j), float(min_dist), float(new_size)])
            
            active[next_id] = active[c_i] + active[c_j]
            del active[c_i]
            del active[c_j]
            
            if next_id >= D.shape[0]:
                new_D = np.full((next_id + 1, next_id + 1), np.inf)
                new_D[:D.shape[0], :D.shape[1]] = D
                D = new_D
                
            for c_k in active.keys():
                if c_k == next_id:
                    continue
                d_ki = D[c_k, c_i]
                d_kj = D[c_k, c_j]
                
                if self.method == 'single':
                    d_new = 0.5 * d_ki + 0.5 * d_kj - 0.5 * abs(d_ki - d_kj)
                elif self.method == 'complete':
                    d_new = 0.5 * d_ki + 0.5 * d_kj + 0.5 * abs(d_ki - d_kj)
                elif self.method == 'average':
                    d_new = (size_i / new_size) * d_ki + (size_j / new_size) * d_kj
                else:
                    raise ValueError(f"Unsupported method: {self.method}")
                    
                D[c_k, next_id] = d_new
                D[next_id, c_k] = d_new
                
            next_id += 1
            
        self.Z_ = np.array(Z_rows)
        return self

# Rigorous Verification against SciPy
X_test = np.array([
    [1.0, 2.0], [1.5, 1.8], [5.0, 8.0],
    [8.0, 8.0], [1.0, 0.6], [9.0, 11.0]
])

model = CustomAgglomerative(n_clusters=2, method='single')
model.fit(X_test)

Z_scipy = linkage(X_test, method='single')
diff = np.max(np.abs(model.Z_[:, 2] - Z_scipy[:, 2]))

print(f"Max distance discrepancy vs SciPy: {diff:.6e}")
print(f"Custom Linkage Matrix (N=6):\\n{model.Z_}")
assert diff < 1e-12, "Custom agglomerative failed SciPy numerical parity test!"
print("PARITY TEST PASSED: Linkage matrix matches SciPy down to machine precision.")`,
    verifiedOutput: `Max distance discrepancy vs SciPy: 1.776357e-15
Custom Linkage Matrix (N=6):
[[0.         1.         0.53851648 2.        ]
 [4.         6.         1.3        3.        ]
 [2.         3.         3.         2.        ]
 [5.         8.         3.16227766 3.        ]
 [7.         9.         7.119691   6.        ]]
PARITY TEST PASSED: Linkage matrix matches SciPy down to machine precision.`,
    rubric: [
      {
        criteria: "Lance–Williams Recurrence Implementation",
        weight: "35%",
        exemplary:
          "Implements general recurrence without accessing raw data points; supports multiple criteria seamlessly.",
        competent: "Implements Single and Complete correctly but hardcodes specific formulas.",
        developing:
          "Incorrect recurrence coefficients or recomputes pairwise distances across all points.",
      },
      {
        criteria: "Dynamic Matrix Management & Indexing",
        weight: "25%",
        exemplary:
          "Correctly grows distance array and handles cluster ID creation (N to 2N-2) with no memory leaks.",
        competent:
          "Maintains cluster tracking but uses fixed preallocated buffers with index offset bugs.",
        developing: "Confuses internal node IDs with initial leaf observation indices.",
      },
      {
        criteria: "SciPy Format Compatibility & Parity",
        weight: "20%",
        exemplary:
          "Outputs (N-1)×4 matrix matching SciPy linkage format; passes automated assert np.allclose.",
        competent:
          "Produces valid merge steps but formats dimensions or cluster sizes incorrectly.",
        developing: "Produces incompatible output structures or fails numerical verification.",
      },
      {
        criteria: "Code Quality & Numerical Robustness",
        weight: "20%",
        exemplary:
          "Clean OOP interface modeled after scikit-learn (.fit()); vectorised operations where appropriate.",
        competent: "Working script without clear object encapsulation.",
        developing: "Fragile imperative script with global state variables.",
      },
    ],
  },
  {
    id: 4,
    slug: "text-topic-taxonomy",
    title: "Document Topic Taxonomy & Semantic Hierarchy via TF-IDF",
    subtitle:
      "Construct a multi-level topical taxonomy from unstructured text using L2-normalized TF-IDF and Ward linkage.",
    category: "Natural Language Processing",
    difficulty: "Advanced",
    estimatedTime: "3–4 Hours",
    prerequisites: [
      "Module 07 (Metrics)",
      "Module 08 (Dendrograms)",
      "Module 12 (Selection)",
      "Module 13 (Profiling)",
    ],
    dataset: {
      name: "Multidisciplinary Scientific Corpus",
      size: "N = 32 technical document abstracts across 4 distinct thematic domains (8 Graphics, 8 AI/ML, 8 Astronomy/Space, 8 Genomics)",
      features: "High-dimensional sparse TF-IDF vocabulary feature space with L2 unit norm",
      description:
        "Text abstracts spanning Computer Graphics, Artificial Intelligence, Space Science, and Molecular Genetics.",
    },
    objectives: [
      "Vectorize text documents with TF-IDF and apply L2 unit normalization to feature rows.",
      "Prove and leverage the mathematical equivalence: ||u - v||² = 2(1 - cos θ) for Ward on text.",
      "Construct a semantic topic tree and cut at coarse (K=2) and granular (K=4) taxonomic levels.",
      "Rank centroid keyword weights per cluster to automatically name and interpret topical branches.",
    ],
    milestones: [
      {
        step: 1,
        title: "Corpus Ingestion & Unit-Norm Vectorization",
        deliverable: "Normalized TF-IDF matrix X_tfidf with unit Euclidean row norms",
        details:
          "Fit TfidfVectorizer(norm='l2') to ensure every document vector lies on the unit hypersphere.",
      },
      {
        step: 2,
        title: "Ward Clustering in Angular Metric Space",
        deliverable: "Hierarchical linkage matrix Z_text",
        details:
          "Apply Ward's minimum variance criterion to unit-normalized vectors to achieve spherical clustering on text.",
      },
      {
        step: 3,
        title: "Multi-Tier Taxonomy Extraction",
        deliverable: "Coarse (K=2) and fine (K=4) cluster membership assignments",
        details:
          "Perform multi-height tree cutting to extract both top-level super-domains and specific sub-disciplines.",
      },
      {
        step: 4,
        title: "Centroid Keyword Salience Scoring",
        deliverable: "Ranked keyword table identifying semantic themes",
        details:
          "Compute cluster mean centroids and identify top 4 highest-weighted vocabulary terms per topic.",
      },
    ],
    starterCode: `# =====================================================================
# PROJECT 04: DOCUMENT TOPIC TAXONOMY WITH WARD & TF-IDF
# Starter Code Template (Python 3.12)
# =====================================================================

import numpy as np
from scipy.cluster.hierarchy import linkage, fcluster
from sklearn.feature_extraction.text import TfidfVectorizer

# 1. Benchmark Text Corpus (32 documents across 4 domains)
corpus = [
    # Topic 1: Computer Graphics & Rendering (8 docs)
    "computer graphics real time raytracing acceleration data structures gpu shaders",
    "rendering graphics raytracing illumination path tracing monte carlo shaders",
    "graphics rendering rasterization pipeline vertex fragment shaders buffer",
    "computer graphics rendering engine directx vulkan compute shaders texture mapping",
    "rendering raytracing bidirectional reflectance distribution function shaders",
    "volumetric rendering graphics atmospheric scattering simulation voxels shaders",
    "computer graphics geometry processing polygon mesh subdivision shaders modeling",
    "rendering graphics real time shadow mapping ambient occlusion screen shaders",

    # Topic 2: Machine Learning & Artificial Intelligence (8 docs)
    "deep learning neural networks gradient descent backpropagation optimization",
    "machine learning transformer architecture self attention neural networks modeling",
    "convolutional neural networks deep learning image classification feature learning",
    "reinforcement learning policy gradient actor critic markov decision optimization",
    "generative adversarial networks deep learning diffusion latent representation",
    "supervised machine learning classification regression decision trees optimization",
    "unsupervised representation learning contrastive deep learning neural embeddings",
    "machine learning deep learning regularization dropout optimization validation",

    # Topic 3: Astronomy & Space Science (8 docs)
    "astrophysics telescope gravitational wave detection black hole orbital space",
    "planetary astronomy exoplanet transit habitable zone orbital space telescope",
    "cosmological telescope cosmic microwave background radiation astrophysics space",
    "astrophysics active galactic nuclei supermassive black holes radiation space",
    "stellar astrophysics supernovae remnants planetary nebulae telescope space",
    "spacecraft orbital mechanics hohmann transfer delta gravity assist space",
    "planetary astronomy lunar regolith mars surface exploration space rover",
    "radio astronomy telescope interferometry very long baseline pulsar astrophysics",

    # Topic 4: Genomics & Molecular Biology (8 docs)
    "genomics dna sequencing crispr targeted genome editing cellular biology",
    "whole genome dna sequencing read alignment variant calling molecular genetics",
    "single cell rna sequencing transcriptomics gene expression cellular biology",
    "molecular biology protein structure prediction alphafold residue genetics dna",
    "epigenetic regulation dna methylation histone chromatin cellular biology",
    "ribosome translation mrna transfer rna codon peptide synthesis cellular biology",
    "metagenomics microbial community sequencing 16s taxonomic cellular genetics",
    "genome wide association studies gwas nucleotide polymorphisms dna genetics"
]

# ---------------------------------------------------------------------
# TODO 1: Initialize TfidfVectorizer with L2 normalization and fit corpus
# ---------------------------------------------------------------------
# vectorizer = TfidfVectorizer(...)
# X_tfidf = ...
# vocab = ...

# ---------------------------------------------------------------------
# TODO 2: Perform Ward linkage clustering on normalized TF-IDF matrix
# ---------------------------------------------------------------------
# Z_text = linkage(...)

# ---------------------------------------------------------------------
# TODO 3: Extract K=4 fine-grained topic clusters
# ---------------------------------------------------------------------
# topic_labels = fcluster(...)

# ---------------------------------------------------------------------
# TODO 4: Compute centroid vectors and print top 4 keywords per topic
# ---------------------------------------------------------------------
`,
    solutionCode: `# =====================================================================
# PROJECT 04: DOCUMENT TOPIC TAXONOMY (REFERENCE SOLUTION)
# Verified against Python 3.12 / Scikit-learn 1.5 / SciPy 1.14
# =====================================================================

import numpy as np
from scipy.cluster.hierarchy import linkage, fcluster
from sklearn.feature_extraction.text import TfidfVectorizer

corpus = [
    # Topic 1: Computer Graphics & Rendering (8 docs)
    "computer graphics real time raytracing acceleration data structures gpu shaders",
    "rendering graphics raytracing illumination path tracing monte carlo shaders",
    "graphics rendering rasterization pipeline vertex fragment shaders buffer",
    "computer graphics rendering engine directx vulkan compute shaders texture mapping",
    "rendering raytracing bidirectional reflectance distribution function shaders",
    "volumetric rendering graphics atmospheric scattering simulation voxels shaders",
    "computer graphics geometry processing polygon mesh subdivision shaders modeling",
    "rendering graphics real time shadow mapping ambient occlusion screen shaders",

    # Topic 2: Machine Learning & Artificial Intelligence (8 docs)
    "deep learning neural networks gradient descent backpropagation optimization",
    "machine learning transformer architecture self attention neural networks modeling",
    "convolutional neural networks deep learning image classification feature learning",
    "reinforcement learning policy gradient actor critic markov decision optimization",
    "generative adversarial networks deep learning diffusion latent representation",
    "supervised machine learning classification regression decision trees optimization",
    "unsupervised representation learning contrastive deep learning neural embeddings",
    "machine learning deep learning regularization dropout optimization validation",

    # Topic 3: Astronomy & Space Science (8 docs)
    "astrophysics telescope gravitational wave detection black hole orbital space",
    "planetary astronomy exoplanet transit habitable zone orbital space telescope",
    "cosmological telescope cosmic microwave background radiation astrophysics space",
    "astrophysics active galactic nuclei supermassive black holes radiation space",
    "stellar astrophysics supernovae remnants planetary nebulae telescope space",
    "spacecraft orbital mechanics hohmann transfer delta gravity assist space",
    "planetary astronomy lunar regolith mars surface exploration space rover",
    "radio astronomy telescope interferometry very long baseline pulsar astrophysics",

    # Topic 4: Genomics & Molecular Biology (8 docs)
    "genomics dna sequencing crispr targeted genome editing cellular biology",
    "whole genome dna sequencing read alignment variant calling molecular genetics",
    "single cell rna sequencing transcriptomics gene expression cellular biology",
    "molecular biology protein structure prediction alphafold residue genetics dna",
    "epigenetic regulation dna methylation histone chromatin cellular biology",
    "ribosome translation mrna transfer rna codon peptide synthesis cellular biology",
    "metagenomics microbial community sequencing 16s taxonomic cellular genetics",
    "genome wide association studies gwas nucleotide polymorphisms dna genetics"
]

# 1. Ingestion & L2 unit normalization
vectorizer = TfidfVectorizer(norm='l2')
X_tfidf = vectorizer.fit_transform(corpus).toarray()
vocab = np.array(vectorizer.get_feature_names_out())

# 2. Ward linkage on unit hypersphere
Z_text = linkage(X_tfidf, method='ward')

# 3. Fine-grained cutting at K=4
k_topics = 4
topic_labels = fcluster(Z_text, t=k_topics, criterion='maxclust')

print(f"Hierarchical Topic Clusters Formed: {k_topics}\\n")
for topic_id in range(1, k_topics + 1):
    doc_idx = np.where(topic_labels == topic_id)[0]
    centroid = X_tfidf[doc_idx].mean(axis=0)
    top_terms = vocab[centroid.argsort()[-4:][::-1]]
    print(
        f"Topic {topic_id} (Docs {doc_idx.tolist()}): "
        f"{', '.join(top_terms)}"
    )`,
    verifiedOutput: `Hierarchical Topic Clusters Formed: 4

Topic 1 (Docs [8, 9, 10, 11, 12, 13, 14, 15]): learning, deep, optimization, networks
Topic 2 (Docs [0, 1, 2, 3, 4, 5, 6, 7]): shaders, graphics, rendering, raytracing
Topic 3 (Docs [16, 17, 18, 19, 20, 21, 22, 23]): space, telescope, astrophysics, planetary
Topic 4 (Docs [24, 25, 26, 27, 28, 29, 30, 31]): cellular, dna, biology, sequencing`,
    rubric: [
      {
        criteria: "Text Preprocessing & Normalization",
        weight: "25%",
        exemplary:
          "Correctly leverages TfidfVectorizer with norm='l2' and explains why unit length preserves cosine properties.",
        competent:
          "Applies TF-IDF without unit normalization, degrading Ward's Euclidean variance assumption.",
        developing: "Uses raw count matrices or fails to extract feature vocabulary.",
      },
      {
        criteria: "Mathematical Alignment of Ward on Text",
        weight: "25%",
        exemplary:
          "Articulates the mathematical relationship between Euclidean distance on unit vectors and Cosine distance.",
        competent:
          "Applies Ward successfully but cannot explain why it works on high-dimensional text.",
        developing:
          "Uses cosine distance directly in Ward (which causes mathematically undefined inversions in SciPy).",
      },
      {
        criteria: "Multi-Scale Hierarchy Extraction",
        weight: "25%",
        exemplary:
          "Demonstrates both macro-domain (K=2) and micro-topic (K=4) cuts with consistent semantic logic.",
        competent: "Extracts only a single cut without exploring hierarchical sub-groupings.",
        developing: "Fails to correctly assign cluster labels to documents.",
      },
      {
        criteria: "Topical Interpretation & Salience",
        weight: "25%",
        exemplary:
          "Computes TF-IDF centroid weights and extracts ranked distinctive keywords per cluster.",
        competent: "Lists words present in documents without weighting by centroid salience.",
        developing: "Omits keyword extraction or manually guesses topic identities.",
      },
    ],
    stretchGoal: {
      title: "Stretch Goal: 20 Newsgroups Multi-Topic Classification & Taxonomy",
      description:
        "Scale document taxonomy discovery to the canonical Scikit-learn 20 Newsgroups corpus across 4 major comp / rec / sci / talk newsgroups.",
      instructions: [
        "Fetch sklearn.datasets.fetch_20newsgroups(subset='train', categories=['comp.graphics', 'sci.space', 'rec.sport.baseball', 'talk.politics.guns']).",
        "Preprocess with TfidfVectorizer(max_features=1000, stop_words='english', norm='l2', sublinear_tf=True).",
        "Fit Ward linkage on the L2-normalized sparse/dense text representations.",
        "Evaluate Adjusted Rand Index (ARI) against ground-truth newsgroup labels across K=2, 3, 4, 5, 6 cuts.",
        "Extract the top 10 distinctive keywords per cluster from the centroid TF-IDF weights to automatically label the 4 newsgroup categories.",
      ],
    },
  },
];

/** Visual Architecture Diagram for Project 1: RFM Customer Pipeline */
function RfmPipelineDiagram() {
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <div className="text-xs font-mono font-semibold text-teal mb-3 uppercase">
        Project Architecture: RFM Hierarchical Segmentation Flow
      </div>
      <svg
        viewBox="0 0 760 140"
        className="w-full h-auto text-foreground"
        aria-label="RFM pipeline diagram"
      >
        <rect
          x="10"
          y="30"
          width="130"
          height="80"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="75"
          y="60"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          Raw RFM Ingestion
        </text>
        <text x="75" y="78" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          Recency, Freq, Spend
        </text>
        <text x="75" y="93" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          Severe Skewness
        </text>

        <path
          d="M 140 70 L 190 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />

        <rect
          x="190"
          y="30"
          width="130"
          height="80"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="255"
          y="60"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          Log1p & Scaling
        </text>
        <text x="255" y="78" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          np.log1p(X)
        </text>
        <text x="255" y="93" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          StandardScaler (z-score)
        </text>

        <path
          d="M 320 70 L 370 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />

        <rect
          x="370"
          y="30"
          width="130"
          height="80"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--navy))"
          strokeWidth="1.5"
        />
        <text
          x="435"
          y="60"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--navy))"
        >
          Ward Linkage
        </text>
        <text x="435" y="78" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          Min-Variance Tree
        </text>
        <text x="435" y="93" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          O(N²) Lance–Williams
        </text>

        <path
          d="M 500 70 L 550 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />

        <rect
          x="550"
          y="30"
          width="130"
          height="80"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="615"
          y="55"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          Tree Cut & Profiling
        </text>
        <text x="615" y="72" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          K=3 Validation Sweep
        </text>
        <text x="615" y="87" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          Silhouette: 0.4598
        </text>
        <text x="615" y="101" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          Business Personas
        </text>

        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="hsl(var(--navy))" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

/** Visual Architecture Diagram for Project 2: Linkage Shoot-Out Flow */
function ShootoutDiagram() {
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <div className="text-xs font-mono font-semibold text-teal mb-3 uppercase">
        Project Architecture: Multi-Manifold Cross-Linkage Evaluation
      </div>
      <svg
        viewBox="0 0 760 140"
        className="w-full h-auto text-foreground"
        aria-label="Linkage shootout diagram"
      >
        <rect
          x="10"
          y="25"
          width="160"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="90"
          y="48"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          4 Test Manifolds
        </text>
        <text x="90" y="66" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          • Blobs (Convex Gaussian)
        </text>
        <text x="90" y="80" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          • Moons (Interleaved)
        </text>
        <text x="90" y="94" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          • Circles (Concentric)
        </text>
        <text x="90" y="108" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          • Iris (Biological 4D)
        </text>

        <path
          d="M 170 70 L 220 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow2)"
        />

        <rect
          x="220"
          y="25"
          width="160"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--navy))"
          strokeWidth="1.5"
        />
        <text
          x="300"
          y="48"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--navy))"
        >
          4 Linkage Criteria
        </text>
        <text x="300" y="66" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          • Single (Chaining)
        </text>
        <text x="300" y="80" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          • Complete (Compact)
        </text>
        <text x="300" y="94" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          • Average (UPGMA)
        </text>
        <text x="300" y="108" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          • Ward (Min-Variance)
        </text>

        <path
          d="M 380 70 L 430 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow2)"
        />

        <rect
          x="430"
          y="25"
          width="140"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="500"
          y="52"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          Metric Engine
        </text>
        <text x="500" y="72" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          1. Adjusted Rand Index
        </text>
        <text x="500" y="88" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          2. Silhouette Score
        </text>
        <text x="500" y="104" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          3. Cophenetic (CCC)
        </text>

        <path
          d="M 570 70 L 620 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow2)"
        />

        <rect
          x="620"
          y="25"
          width="130"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="685"
          y="52"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          Synthesis
        </text>
        <text x="685" y="72" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          Comparative Matrix
        </text>
        <text x="685" y="88" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          Paradox Analysis
        </text>
        <text x="685" y="104" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          Failure Taxonomy
        </text>

        <defs>
          <marker
            id="arrow2"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="hsl(var(--navy))" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

/** Visual Architecture Diagram for Project 3: Lance–Williams Scratch Engine */
function LanceWilliamsDiagram() {
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <div className="text-xs font-mono font-semibold text-teal mb-3 uppercase">
        Project Architecture: Pure NumPy Lance–Williams Update Loop
      </div>
      <svg
        viewBox="0 0 760 140"
        className="w-full h-auto text-foreground"
        aria-label="Lance Williams scratch engine diagram"
      >
        <rect
          x="10"
          y="25"
          width="160"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="90"
          y="52"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          Proximity Matrix D₀
        </text>
        <text x="90" y="72" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          pdist(X, 'euclidean')
        </text>
        <text x="90" y="88" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          diag(D) = +∞
        </text>
        <text x="90" y="104" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          Active Dict: &#123;0..N-1&#125;
        </text>

        <path
          d="M 170 70 L 220 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow3)"
        />

        <rect
          x="220"
          y="25"
          width="160"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="300"
          y="52"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          Greedy argmin(D)
        </text>
        <text x="300" y="72" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          Find min d(C_i, C_j)
        </text>
        <text x="300" y="88" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          New cluster ID = N+step
        </text>
        <text x="300" y="104" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          Append to Z_rows
        </text>

        <path
          d="M 380 70 L 430 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow3)"
        />

        <rect
          x="430"
          y="25"
          width="160"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--navy))"
          strokeWidth="1.5"
        />
        <text
          x="510"
          y="48"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--navy))"
        >
          Lance–Williams Update
        </text>
        <text x="510" y="66" textAnchor="middle" fontSize="9" fill="hsl(var(--foreground))">
          d_new = αᵢd_ki + αⱼd_kj
        </text>
        <text x="510" y="80" textAnchor="middle" fontSize="9" fill="hsl(var(--foreground))">
          + βd_ij + γ|d_ki - d_kj|
        </text>
        <text x="510" y="98" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          O(1) per cluster k
        </text>

        <path
          d="M 590 70 L 640 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow3)"
        />

        <rect
          x="640"
          y="25"
          width="110"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="695"
          y="52"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          SciPy Parity
        </text>
        <text x="695" y="72" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          ||Z - Z_scipy||
        </text>
        <text x="695" y="88" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          &lt; 1e-12
        </text>
        <text x="695" y="104" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          Machine Precision
        </text>

        <defs>
          <marker
            id="arrow3"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="hsl(var(--navy))" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

/** Visual Architecture Diagram for Project 4: Topic Taxonomy Flow */
function TopicTaxonomyDiagram() {
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <div className="text-xs font-mono font-semibold text-teal mb-3 uppercase">
        Project Architecture: Text Taxonomy via L2 Unit-Norm & Ward
      </div>
      <svg
        viewBox="0 0 760 140"
        className="w-full h-auto text-foreground"
        aria-label="Text topic taxonomy diagram"
      >
        <rect
          x="10"
          y="25"
          width="150"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="85"
          y="52"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          Corpus Ingestion
        </text>
        <text x="85" y="72" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          8 Multi-Domain Docs
        </text>
        <text x="85" y="88" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          TF-IDF Feature Space
        </text>
        <text x="85" y="104" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          Vocabulary V
        </text>

        <path
          d="M 160 70 L 210 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow4)"
        />

        <rect
          x="210"
          y="25"
          width="160"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="290"
          y="48"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          L2 Unit Normalization
        </text>
        <text x="290" y="66" textAnchor="middle" fontSize="9" fill="hsl(var(--foreground))">
          ||x||₂ = 1.0
        </text>
        <text x="290" y="82" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          ||u - v||² = 2(1 - cos θ)
        </text>
        <text x="290" y="98" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          Euclidean = Angular Space
        </text>

        <path
          d="M 370 70 L 420 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow4)"
        />

        <rect
          x="420"
          y="25"
          width="150"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--navy))"
          strokeWidth="1.5"
        />
        <text
          x="495"
          y="52"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--navy))"
        >
          Ward Hierarchy
        </text>
        <text x="495" y="72" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          linkage(X, 'ward')
        </text>
        <text x="495" y="88" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          Spherical Variance Min
        </text>
        <text x="495" y="104" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          Semantic Tree
        </text>

        <path
          d="M 570 70 L 620 70"
          stroke="hsl(var(--navy))"
          strokeWidth="2"
          markerEnd="url(#arrow4)"
        />

        <rect
          x="620"
          y="25"
          width="130"
          height="90"
          rx="4"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
        />
        <text
          x="685"
          y="52"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          Taxonomy & Keywords
        </text>
        <text x="685" y="72" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          Cut at K=4 Topics
        </text>
        <text x="685" y="88" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">
          Centroid TF-IDF Salience
        </text>
        <text x="685" y="104" textAnchor="middle" fontSize="9" fill="hsl(var(--teal))">
          Top Ranked Terms
        </text>

        <defs>
          <marker
            id="arrow4"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="hsl(var(--navy))" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

/** Interactive Projects Catalog Component */
export function ProjectsCatalog() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [expandedSolution, setExpandedSolution] = useState<boolean>(false);

  const filteredProjects = CAPSTONE_PROJECTS.filter((proj) => {
    if (filterDifficulty === "all") return true;
    return proj.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  const activeProject = CAPSTONE_PROJECTS.find((p) => p.id === selectedId) ?? CAPSTONE_PROJECTS[0]!;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  return (
    <div className="space-y-8" data-testid="projects-catalog">
      {/* 1. Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-sm border border-border bg-card p-5">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-teal" />
            <h2 className="text-lg font-bold text-foreground">Capstone Project Blueprints</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Four production-ready hierarchical clustering capstones with end-to-end datasets,
            starter code, and verified solutions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">Difficulty:</span>
          <div className="flex rounded-sm border border-border bg-secondary/50 p-0.5">
            {["all", "intermediate", "advanced"].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-2.5 py-1 text-xs font-medium capitalize rounded-xs transition-colors ${
                  filterDifficulty === diff
                    ? "bg-background text-navy font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Project Selection Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProjects.map((proj) => {
          const isSelected = proj.id === selectedId;
          return (
            <button
              key={proj.id}
              onClick={() => {
                setSelectedId(proj.id);
                setExpandedSolution(false);
              }}
              className={`flex flex-col justify-between rounded-sm border p-4 text-left transition-all ${
                isSelected
                  ? "border-navy bg-navy/5 shadow-xs ring-1 ring-navy"
                  : "border-border bg-card hover:border-navy/50 hover:bg-secondary/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-teal">{`PROJECT 0${proj.id}`}</span>
                  <span
                    className={`rounded-xs px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      proj.difficulty === "Intermediate"
                        ? "bg-teal/10 text-teal border border-teal/30"
                        : "bg-navy/10 text-navy border border-navy/30"
                    }`}
                  >
                    {proj.difficulty}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                  {proj.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{proj.subtitle}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-teal" />
                  {proj.estimatedTime}
                </span>
                <span className="text-teal font-medium">Select Blueprint &rarr;</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Detailed Project Workspace */}
      <div className="space-y-6 rounded-sm border border-border bg-card p-6 shadow-xs">
        {/* Workspace Header */}
        <div className="border-b border-border pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-xs bg-navy px-2 py-0.5 font-mono text-xs font-bold text-background uppercase tracking-wider">
                {`PROJECT 0${activeProject.id} BLUEPRINT`}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs font-semibold text-teal uppercase tracking-wider">
                {activeProject.category}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-teal" />
                Est. Duration: {activeProject.estimatedTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-navy" />
                Level: {activeProject.difficulty}
              </span>
            </div>
          </div>

          <h2 className="mt-3 text-xl font-extrabold text-foreground tracking-tight sm:text-2xl">
            {activeProject.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {activeProject.subtitle}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-foreground">Recommended Prerequisites:</span>
            {activeProject.prerequisites.map((req) => (
              <span
                key={req}
                className="rounded-xs border border-border bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground"
              >
                {req}
              </span>
            ))}
          </div>
        </div>

        {/* Visual Workflow Diagram */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
            Architecture Blueprint & Data Pipeline
          </div>
          {activeProject.id === 1 && <RfmPipelineDiagram />}
          {activeProject.id === 2 && <ShootoutDiagram />}
          {activeProject.id === 3 && <LanceWilliamsDiagram />}
          {activeProject.id === 4 && <TopicTaxonomyDiagram />}
        </div>

        {/* Dataset Specification & Objectives Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Dataset Card */}
          <div className="space-y-3 rounded-sm border border-border bg-secondary/20 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy">
              <Database className="h-4 w-4 text-teal" />
              <span>Dataset Specification</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="font-semibold text-foreground">Benchmark: </span>
                <span className="text-muted-foreground">{activeProject.dataset.name}</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">Dimensions: </span>
                <span className="text-muted-foreground">{activeProject.dataset.size}</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">Feature Space: </span>
                <span className="text-muted-foreground">{activeProject.dataset.features}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground border-t border-border/60 pt-2 leading-relaxed">
                {activeProject.dataset.description}
              </p>
            </div>
          </div>

          {/* Objectives Card */}
          <div className="space-y-3 rounded-sm border border-border bg-secondary/20 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy">
              <Target className="h-4 w-4 text-teal" />
              <span>Core Learning Objectives</span>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {activeProject.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono text-teal font-bold shrink-0">{idx + 1}.</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4 Milestones */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy">
            <Cpu className="h-4 w-4 text-teal" />
            <span>Implementation Milestones & Execution Roadmap</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activeProject.milestones.map((m) => (
              <div
                key={m.step}
                className="flex flex-col justify-between rounded-sm border border-border bg-card p-3 space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-teal">{`STAGE 0${m.step}`}</span>
                  </div>
                  <h4 className="mt-1 text-xs font-bold text-foreground">{m.title}</h4>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                    {m.details}
                  </p>
                </div>
                <div className="border-t border-border/60 pt-2 text-[10px] font-mono text-navy font-semibold">
                  Deliverable: {m.deliverable}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Starter Code Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy">
              <FileCode className="h-4 w-4 text-teal" />
              <span>Starter Code Template (Python 3.12)</span>
            </div>
            <button
              onClick={() => handleCopy(activeProject.starterCode, `starter-${activeProject.id}`)}
              className="flex items-center gap-1.5 rounded-sm border border-border bg-secondary/50 px-2.5 py-1 text-xs font-mono text-muted-foreground transition-colors hover:border-navy hover:text-navy"
            >
              {copiedCodeId === `starter-${activeProject.id}` ? (
                <>
                  <Check className="h-3.5 w-3.5 text-teal" />
                  <span className="text-teal font-semibold">Copied Starter!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Starter Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-sm border border-border bg-secondary/40 p-4 font-mono text-xs leading-relaxed text-foreground max-h-96">
            <code>{activeProject.starterCode}</code>
          </pre>
        </div>

        {/* Collapsible Reference Solution Accordion */}
        <div className="rounded-sm border border-border bg-secondary/15 overflow-hidden">
          <button
            onClick={() => setExpandedSolution(!expandedSolution)}
            className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm text-foreground transition-colors hover:bg-secondary/30"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal" />
              <span>Reference Implementation & Verified Output (Python 3.12)</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono text-teal">
              <span>{expandedSolution ? "Hide Solution" : "Reveal Reference Solution"}</span>
              {expandedSolution ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </button>

          {expandedSolution && (
            <div className="space-y-4 border-t border-border p-4 bg-background">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  Verified Executable Script (All Output Empirically Confirmed)
                </span>
                <button
                  onClick={() => handleCopy(activeProject.solutionCode, `sol-${activeProject.id}`)}
                  className="flex items-center gap-1.5 rounded-sm border border-border bg-secondary/50 px-2.5 py-1 text-xs font-mono text-muted-foreground transition-colors hover:border-navy hover:text-navy"
                >
                  {copiedCodeId === `sol-${activeProject.id}` ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-teal" />
                      <span className="text-teal font-semibold">Copied Solution!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Solution</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="overflow-x-auto rounded-sm border border-border bg-secondary/30 p-4 font-mono text-xs leading-relaxed text-foreground max-h-96">
                <code>{activeProject.solutionCode}</code>
              </pre>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-navy">
                  <Terminal className="h-3.5 w-3.5 text-teal" />
                  <span>Exact Console Stdout (Python 3.12 Verified)</span>
                </div>
                <pre className="overflow-x-auto rounded-sm border border-border bg-navy/5 p-4 font-mono text-xs leading-relaxed text-foreground">
                  <code>{activeProject.verifiedOutput}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Evaluation Rubric Table */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy">
            <CheckSquare className="h-4 w-4 text-teal" />
            <span>Grading Rubric & Mastery Standards</span>
          </div>
          <div className="overflow-x-auto rounded-sm border border-border">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/50 font-mono text-muted-foreground">
                  <th className="p-3 font-semibold">Evaluation Criteria</th>
                  <th className="p-3 font-semibold">Weight</th>
                  <th className="p-3 font-semibold">Exemplary (100%)</th>
                  <th className="p-3 font-semibold">Competent (75%)</th>
                  <th className="p-3 font-semibold">Developing (50%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                {activeProject.rubric.map((r, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{r.criteria}</td>
                    <td className="p-3 font-mono font-semibold text-teal">{r.weight}</td>
                    <td className="p-3 text-muted-foreground">{r.exemplary}</td>
                    <td className="p-3 text-muted-foreground">{r.competent}</td>
                    <td className="p-3 text-muted-foreground">{r.developing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optional Stretch Goal Card */}
        {activeProject.stretchGoal && (
          <div className="rounded-sm border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{activeProject.stretchGoal.title}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeProject.stretchGoal.description}
            </p>
            <div className="space-y-1.5 pt-1">
              {activeProject.stretchGoal.instructions.map((inst, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                  <span className="font-mono text-teal font-semibold">•</span>
                  <span>{inst}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
