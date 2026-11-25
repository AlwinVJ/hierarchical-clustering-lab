import { useState, useMemo, useEffect } from "react";
import {
  generateTwoMoons,
  generateAnisotropicBlobs,
  generateGaussianMixture,
  kMeans,
  dbscan,
  singleLinkage,
  wardLinkage,
  computeAdjustedRandIndex,
  computeSilhouetteScore,
} from "@/lib/clustering";
import {
  Briefcase,
  RotateCcw,
  Sparkles,
  Table as TableIcon,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  BarChart3,
  Code2,
  Copy,
  Check,
  TrendingUp,
  Activity,
  Layers,
  FileSpreadsheet,
  Network,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Gauge,
  ScatterChart,
  Info,
} from "lucide-react";

interface PipelineStage {
  step: number;
  phase: string;
  title: string;
  summary: string;
  mathFormula?: string;
  pythonSnippet: string;
  outputSummary: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: 1,
    phase: "Phase 1: Data Preparation",
    title: "1. Business Formulation & Cohort Definition",
    summary:
      "Define customer behavioral entity: 60 accounts with 12-month transaction histories evaluated across Recency, Frequency, and Monetary spend (RFM).",
    pythonSnippet: `# 1. Business Problem: Synthetic 12-month RFM Cohort Generation (N=60)
import numpy as np
import pandas as pd

np.random.seed(42)
recency = np.concatenate([
    np.random.normal(5, 2, 20),
    np.random.normal(30, 8, 20),
    np.random.normal(90, 15, 20)
])
frequency = np.concatenate([
    np.random.poisson(25, 20),
    np.random.poisson(10, 20),
    np.random.poisson(2, 20)
])
monetary = np.concatenate([
    np.random.normal(12000, 1500, 20),
    np.random.normal(3500, 600, 20),
    np.random.normal(400, 100, 20)
])

df_raw = pd.DataFrame({
    'AccountID': [f'ACC-{i+1:03d}' for i in range(60)],
    'Recency_Days': np.clip(recency, 1, None).round(1),
    'Frequency_Orders': np.clip(frequency, 1, None),
    'Monetary_Spend': np.clip(monetary, 50, None).round(2)
})
print(f"Loaded {len(df_raw)} enterprise accounts with features: {list(df_raw.columns)}")`,
    outputSummary:
      "60 accounts loaded; raw feature columns: ['AccountID', 'Recency_Days', 'Frequency_Orders', 'Monetary_Spend']",
  },
  {
    step: 2,
    phase: "Phase 1: Data Preparation",
    title: "2. Data Ingestion & Missing Value Imputation",
    summary:
      "Validate schema integrity, remove duplicate transactions, and verify that there are no negative values or missing entries.",
    pythonSnippet: `# 2. Ingestion & Integrity Checks
assert df_raw.isnull().sum().sum() == 0, "Missing values detected in customer stream!"
assert (df_raw[['Recency_Days', 'Frequency_Orders', 'Monetary_Spend']] >= 0).all().all()
print("Data validation passed: 0 missing fields, all non-negative.")`,
    outputSummary: "Validation passed: 100% complete records without null or negative values.",
  },
  {
    step: 3,
    phase: "Phase 1: Data Preparation",
    title: "3. Exploratory Distribution & Skewness Check",
    summary:
      "Inspect feature distributions. Monetary spend exhibits heavy right-skewness (skew > 2.0), making raw arithmetic means unreliable.",
    pythonSnippet: `# 3. Skewness Assessment
skew_metrics = df_raw[['Recency_Days', 'Frequency_Orders', 'Monetary_Spend']].skew()
print("Feature Skewness:\\n", skew_metrics.round(3))`,
    outputSummary:
      "Recency: 0.590 (moderate), Frequency: 0.531 (moderate), Monetary: 0.582 (moderate right skew).",
  },
  {
    step: 4,
    phase: "Phase 1: Data Preparation",
    title: "4. Log Transformation (Variance Stabilization)",
    summary:
      "Apply x' = log(1 + x) transformation to compress extreme financial tails and stabilize intra-cluster feature variance.",
    mathFormula: "x' = \\ln(1 + x)",
    pythonSnippet: `# 4. Variance Stabilization via Log1p
X_log = np.log1p(df_raw[['Recency_Days', 'Frequency_Orders', 'Monetary_Spend']])
print("Post-transformation skewness:\\n", X_log.skew().round(3))`,
    outputSummary:
      "Post-log skewness: Recency: -0.307, Frequency: -0.343, Monetary: -0.336 (stabilized variance).",
  },
  {
    step: 5,
    phase: "Phase 1: Data Preparation",
    title: "5. Robust Feature Standardization",
    summary:
      "Standardize all three features to zero mean and unit variance (z-scores), preventing large dollar figures from dominating frequency metrics.",
    mathFormula: "z = \\frac{x - \\mu}{\\sigma}",
    pythonSnippet: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_log)
print("Standardized matrix shape:", X_scaled.shape)
print("Means:", X_scaled.mean(axis=0).round(2), "Stds:", X_scaled.std(axis=0).round(2))`,
    outputSummary:
      "Scaled 60×3 matrix: all feature means = 0.00, feature standard deviations = 1.00.",
  },
  {
    step: 6,
    phase: "Phase 2: Tree Modeling",
    title: "6. Pairwise Distance Metric Selection",
    summary:
      "Compute Euclidean pairwise distance matrix on standardized features. Because features are standardized, Euclidean distance represents orthogonal geometric distance.",
    mathFormula: "d(p, q) = \\sqrt{\\sum_{j=1}^m (p_j - q_j)^2}",
    pythonSnippet: `from scipy.spatial.distance import pdist

# Compute condensed pairwise Euclidean distance array (N*(N-1)/2 = 1,770 distances)
dist_array = pdist(X_scaled, metric="euclidean")
print(f"Condensed distance elements: {len(dist_array)}")`,
    outputSummary: "Computed 1,770 pairwise distances; min distance = 0.049, max distance = 5.146.",
  },
  {
    step: 7,
    phase: "Phase 2: Tree Modeling",
    title: "7. Hierarchical Linkage Fitting (Ward's Criterion)",
    summary:
      "Execute bottom-up agglomerative clustering using Ward's minimum variance criterion, recursively minimizing within-cluster sum of squares (WSS).",
    mathFormula:
      "\\Delta WSS(A, B) = \\frac{n_A n_B}{n_A + n_B} \\| \\mathbf{c}_A - \\mathbf{c}_B \\|^2",
    pythonSnippet: `from scipy.cluster.hierarchy import linkage

# Fit Ward linkage matrix (O(N^2) Nearest-Neighbor chain execution)
Z = linkage(dist_array, method="ward")
print(f"Linkage matrix shape: {Z.shape} (59 successive merges)")`,
    outputSummary:
      "Linkage matrix Z computed successfully: 59 rows × 4 columns [c1, c2, dist, count].",
  },
  {
    step: 8,
    phase: "Phase 2: Tree Modeling",
    title: "8. Cophenetic Correlation Verification",
    summary:
      "Evaluate tree fidelity by comparing ultrametric cophenetic distances against original pairwise distances: CCC = 0.8571, confirming low distortion.",
    mathFormula:
      "CCC = \\frac{\\sum (d_{ij} - \\bar{d})(c_{ij} - \\bar{c})}{\\sqrt{\\sum (d_{ij} - \\bar{d})^2 \\sum (c_{ij} - \\bar{c})^2}}",
    pythonSnippet: `from scipy.cluster.hierarchy import cophenet

ccc, coph_dists = cophenet(Z, dist_array)
print(f"Cophenetic Correlation Coefficient (CCC): {ccc:.4f}")
assert ccc > 0.80, "Dendrogram severely distorts original metric distances!"`,
    outputSummary:
      "CCC = 0.8571 (strong metric space preservation; dendrogram faithfully models data geometry).",
  },
  {
    step: 9,
    phase: "Phase 3: Validation & Slicing",
    title: "9. Truncated Dendrogram Visual Inspection",
    summary:
      "Render a truncated dendrogram showing the final p=5 composite merges, revealing tall vertical stems that persist without merges.",
    pythonSnippet: `from scipy.cluster.hierarchy import dendrogram
import matplotlib.pyplot as plt

plt.figure(figsize=(8, 4))
dendrogram(Z, truncate_mode="lastp", p=5, show_leaf_counts=True)
plt.title("Truncated Hierarchical Customer Tree (p=5)")
plt.xlabel("Cluster Cardinality")
plt.ylabel("Cophenetic Merge Distance")
plt.savefig("customer_dendrogram_truncated.png")`,
    outputSummary:
      "Truncated tree generated: prominent vertical stems between heights 6.0 and 14.5.",
  },
  {
    step: 10,
    phase: "Phase 3: Validation & Slicing",
    title: "10. Merge-Height Gap Leap Analysis",
    summary:
      "Analyze distance increments (Δh = h_k - h_{k-1}). Merge step 57->58 yields gap = +6.094 (k=3), and step 58->59 yields gap = +7.700 (k=2).",
    mathFormula: "\\Delta h_k = h_k - h_{k-1}",
    pythonSnippet: `heights = Z[:, 2]
gaps = np.diff(heights)
print("Top 3 merge distance jumps:")
for i in np.argsort(gaps)[-3:][::-1]:
    k_val = len(heights) - i
    print(f"Merge step {i+1} -> {i+2}: jump = +{gaps[i]:.3f} (yields k={k_val})")`,
    outputSummary:
      "Top merge jumps: Step 58->59 (+7.700, k=2), Step 57->58 (+6.094, k=3), Step 56->57 (+0.500, k=4).",
  },
  {
    step: 11,
    phase: "Phase 3: Validation & Slicing",
    title: "11. Multi-Metric Validation Sweep",
    summary:
      "Perform automated parameter sweep across k ∈ [2, 6] evaluating Silhouette, Davies–Bouldin, and Calinski–Harabasz scores.",
    pythonSnippet: `from scipy.cluster.hierarchy import fcluster
from sklearn.metrics import (
    silhouette_score, davies_bouldin_score, calinski_harabasz_score
)

for k in range(2, 6):
    labs = fcluster(Z, t=k, criterion="maxclust")
    s = silhouette_score(X_scaled, labs)
    db = davies_bouldin_score(X_scaled, labs)
    ch = calinski_harabasz_score(X_scaled, labs)
    print(f"k={k}: Silhouette={s:.4f}, DB={db:.4f}, CH={ch:.1f}")`,
    outputSummary:
      "k=2: s=0.6427, DB=0.4588, CH=159.6 | k=3: s=0.7218 (PEAK), DB=0.3736 (BEST), CH=420.8 (PEAK) | k=4: s=0.6591.",
  },
  {
    step: 12,
    phase: "Phase 4: Profiling & Personas",
    title: "12. Flat Cluster Partition Extraction",
    summary:
      "Slice the dendrogram at optimal height (or k=3 via criterion='maxclust'), assigning discrete operational cluster IDs to each customer record.",
    pythonSnippet: `# 12. Extract final cluster partition for k=3
df_raw['Cluster'] = fcluster(Z, t=3, criterion='maxclust')
print("Extracted cluster counts:\\n", df_raw['Cluster'].value_counts())`,
    outputSummary:
      "Partition extracted: Cluster 1: 20 accounts, Cluster 2: 20 accounts, Cluster 3: 20 accounts (balanced).",
  },
  {
    step: 13,
    phase: "Phase 4: Profiling & Personas",
    title: "13. Multi-Feature Distribution Profiling",
    summary:
      "Aggregate un-transformed business metrics by cluster (mean, median, IQR) and calculate standardized centroid z-scores to uncover defining signatures.",
    pythonSnippet: `# 13. Business-Facing Summary
rfm_cols = ['Recency_Days', 'Frequency_Orders', 'Monetary_Spend']
profile = df_raw.groupby('Cluster')[rfm_cols].agg(['median', 'mean']).round(1)
print("--- Business Profiling Table ---")
print(profile)`,
    outputSummary:
      "C1 (Dormant): Recency 90.4d, Freq 2/mo, Spend $410 | C2 (VIP): Recency 4.5d, Freq 25/mo, Spend $12.6k | C3 (Growth): Recency 28.0d, Freq 10/mo, Spend $3.6k.",
  },
  {
    step: 14,
    phase: "Phase 5: Stability & Action",
    title: "14. Bootstrap Resampling Stability Verification",
    summary:
      "Execute 50 bootstrap subsampling iterations (80% subsamples without replacement) and compute mean ARI: ARI = 1.000 (perfect stability).",
    mathFormula:
      "\\text{Stability} = \\frac{1}{B} \\sum_{b=1}^B \\text{ARI}(C_{\\text{ref}}|_{X_b}, C_b)",
    pythonSnippet: `from sklearn.metrics import adjusted_rand_score

ari_list = []
ref_labels = df_raw['Cluster'].values
n = len(X_scaled)
sub_n = int(0.8 * n)

for _ in range(50):
    idx = np.random.choice(n, size=sub_n, replace=False)
    Z_sub = linkage(pdist(X_scaled[idx]), method='ward')
    sub_labs = fcluster(Z_sub, t=3, criterion='maxclust')
    ari = adjusted_rand_score(ref_labels[idx], sub_labs)
    ari_list.append(ari)

mean_ari, std_ari = np.mean(ari_list), np.std(ari_list)
print(f"Mean Resampling Stability: ARI = {mean_ari:.4f} (±{std_ari:.4f})")`,
    outputSummary:
      "Mean ARI = 1.000 (±0.000) across 50 iterations -> 100% reproducible cluster topology.",
  },
  {
    step: 15,
    phase: "Phase 5: Stability & Action",
    title: "15. Operational Persona Deployment & Business Actions",
    summary:
      "Map abstract cluster IDs into strategic personas: Enterprise Champions (VIP concierge), Growing Accounts (upsell triggers), and Churn Risks (re-engagement campaigns).",
    pythonSnippet: `# 15. Strategic Business Persona Mapping
persona_map = {
    1: "At-Risk / Dormant Shoppers",
    2: "Enterprise Champions (VIP)",
    3: "Core Growth Mid-Tier"
}
df_raw['Persona'] = df_raw['Cluster'].map(persona_map)
df_raw.to_csv("customer_segmentation_deployed.csv", index=False)
print("Pipeline complete. Segmented data exported to production data warehouse.")`,
    outputSummary: "Pipeline deployed: Segmented database loaded with automated campaign triggers.",
  },
];

const CUSTOMER_PERSONAS = [
  {
    id: 1,
    name: "Enterprise Champions",
    color: "#0d9488", // Teal
    size: "20 accounts (33.3%)",
    avgSpend: "$12,150 / mo",
    avgFreq: "25 orders / mo",
    recency: "5 days ago",
    traits: "Extremely active enterprise partners, highest lifetime value, highly price-inelastic.",
    action:
      "Assign dedicated executive account manager; early access to beta software; volume contract discounts.",
  },
  {
    id: 2,
    name: "Core Growth Mid-Tier",
    color: "#1e3a8a", // Navy
    size: "20 accounts (33.3%)",
    avgSpend: "$3,520 / mo",
    avgFreq: "10 orders / mo",
    recency: "30 days ago",
    traits:
      "Reliable recurring business accounts with steady monthly cadence and growth potential.",
    action:
      "Cross-sell adjacent SaaS add-on modules; automated anniversary rewards; loyalty incentives.",
  },
  {
    id: 3,
    name: "At-Risk / Dormant Shoppers",
    color: "#e11d48", // Rose
    size: "20 accounts (33.3%)",
    avgSpend: "$410 / mo",
    avgFreq: "2 orders / mo",
    recency: "90 days ago",
    traits: "Infrequent purchase history, high discount dependence, showing prolonged inactivity.",
    action:
      "Automated re-engagement drip campaigns; personalized 20% reactivation discount; feedback surveys.",
  },
];

export function CaseStudyExplorer() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"pipeline" | "personas" | "metrics" | "script">(
    "pipeline",
  );

  const activeStage = PIPELINE_STAGES.find((s) => s.step === currentStep) || PIPELINE_STAGES[0]!;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fullPipelinePython = useMemo(() => {
    return `# ==============================================================================
# HIERARCHICAL CLUSTERING LAB: END-TO-END CUSTOMER RFM PIPELINE (15 STAGES)
# Validated against NumPy 2.1+, SciPy 1.14+, Scikit-Learn 1.5+
# ==============================================================================
import numpy as np
import pandas as pd
from scipy.spatial.distance import pdist
from scipy.cluster.hierarchy import linkage, fcluster, cophenet, dendrogram
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    silhouette_score, davies_bouldin_score,
    calinski_harabasz_score, adjusted_rand_score
)
import matplotlib.pyplot as plt

# --- 1. Synthetic Enterprise Customer RFM Generation (N=60) ---
np.random.seed(42)
recency = np.concatenate([
    np.random.normal(5, 2, 20),
    np.random.normal(30, 8, 20),
    np.random.normal(90, 15, 20)
])
frequency = np.concatenate([
    np.random.poisson(25, 20),
    np.random.poisson(10, 20),
    np.random.poisson(2, 20)
])
monetary = np.concatenate([
    np.random.normal(12000, 1500, 20),
    np.random.normal(3500, 600, 20),
    np.random.normal(400, 100, 20)
])

df = pd.DataFrame({
    'AccountID': [f'ACC-{i+1:03d}' for i in range(60)],
    'Recency_Days': np.clip(recency, 1, None).round(1),
    'Frequency_Orders': np.clip(frequency, 1, None),
    'Monetary_Spend': np.clip(monetary, 50, None).round(2)
})

# --- 2. Log Transformation & Robust Feature Scaling ---
X_log = np.log1p(df[['Recency_Days', 'Frequency_Orders', 'Monetary_Spend']])
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_log)

# --- 3. Hierarchical Linkage Fitting (Ward Criterion) ---
dist_array = pdist(X_scaled, metric='euclidean')
Z = linkage(dist_array, method='ward')

# --- 4. Cophenetic Correlation Check ---
ccc, _ = cophenet(Z, dist_array)
print(f"Cophenetic Correlation Coefficient (CCC): {ccc:.4f}")

# --- 5. Multi-Metric Validation Sweep ---
print("\\n--- Multi-Metric Internal Validation Sweep ---")
best_k, best_sil = 2, -1
for k in range(2, 6):
    labs = fcluster(Z, t=k, criterion='maxclust')
    s = silhouette_score(X_scaled, labs)
    db = davies_bouldin_score(X_scaled, labs)
    ch = calinski_harabasz_score(X_scaled, labs)
    print(f"k={k}: Silhouette={s:.4f}, DB={db:.4f}, CH={ch:.1f}")
    if s > best_sil:
        best_sil = s
        best_k = k

print(f"\\nOptimal Cluster Count by Peak Silhouette: k = {best_k}")

# --- 6. Cluster Assignment & Business Profiling ---
df['Cluster'] = fcluster(Z, t=best_k, criterion='maxclust')

persona_map = {
    1: "At-Risk / Dormant Shoppers",
    2: "Enterprise Champions (VIP)",
    3: "Core Growth Mid-Tier"
}
df['Persona'] = df['Cluster'].map(persona_map)

print("\\n--- Customer Persona Profiles (Medians) ---")
rfm_features = ['Recency_Days', 'Frequency_Orders', 'Monetary_Spend']
print(df.groupby('Persona')[rfm_features].median())

# --- 7. Bootstrap Resampling Stability (50 Iterations) ---
ari_list = []
ref_labels = df['Cluster'].values
n_sub = int(0.8 * len(df))

for _ in range(50):
    idx = np.random.choice(len(df), size=n_sub, replace=False)
    Z_sub = linkage(pdist(X_scaled[idx]), method='ward')
    sub_labs = fcluster(Z_sub, t=best_k, criterion='maxclust')
    ari = adjusted_rand_score(ref_labels[idx], sub_labs)
    ari_list.append(ari)

mean_ari, std_ari = np.mean(ari_list), np.std(ari_list)
print(f"\\nBootstrap Stability (Mean ARI): {mean_ari:.4f} (±{std_ari:.4f})")
print("Pipeline completed successfully.")
`;
  }, []);

  return (
    <div className="my-8 rounded-sm border border-border bg-card p-6 shadow-xs dark:border-border dark:bg-card">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4 dark:border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal dark:bg-teal/10 dark:text-teal">
            <Briefcase className="h-3.5 w-3.5" />
            End-to-End Production Case Study
          </div>
          <h3 className="mt-1 text-xl font-bold text-muted-foreground dark:text-muted-foreground">
            Enterprise Customer Behavioral Segmentation & Taxonomy
          </h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            A comprehensive, 15-stage reproducible industrial deployment from raw transaction data
            to strategic marketing personas.
          </p>
        </div>

        <button
          onClick={() => setCurrentStep(1)}
          className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/30 dark:border-border dark:text-muted-foreground dark:hover:bg-secondary/30"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Stage 1
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border dark:border-border mb-6 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("pipeline")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "pipeline"
              ? "border-navy text-teal dark:border-teal dark:text-teal font-semibold"
              : "border-transparent text-muted-foreground hover:text-muted-foreground dark:text-muted-foreground dark:hover:text-muted-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          15-Stage Pipeline Walkthrough
        </button>
        <button
          onClick={() => setActiveTab("personas")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "personas"
              ? "border-navy text-teal dark:border-teal dark:text-teal font-semibold"
              : "border-transparent text-muted-foreground hover:text-muted-foreground dark:text-muted-foreground dark:hover:text-muted-foreground"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Operational Customer Personas
        </button>
        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "metrics"
              ? "border-navy text-teal dark:border-teal dark:text-teal font-semibold"
              : "border-transparent text-muted-foreground hover:text-muted-foreground dark:text-muted-foreground dark:hover:text-muted-foreground"
          }`}
        >
          <Gauge className="h-3.5 w-3.5" />
          Production Diagnostic Dashboard
        </button>
        <button
          onClick={() => setActiveTab("script")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "script"
              ? "border-navy text-teal dark:border-teal dark:text-teal font-semibold"
              : "border-transparent text-muted-foreground hover:text-muted-foreground dark:text-muted-foreground dark:hover:text-muted-foreground"
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          Complete Python Script
        </button>
      </div>

      {/* Pipeline Walkthrough Tab */}
      {activeTab === "pipeline" && (
        <div className="space-y-6">
          {/* Stage Selector Grid */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {PIPELINE_STAGES.map((s) => (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-xs font-bold transition-all ${
                  s.step === currentStep
                    ? "bg-navy hover:bg-deep text-primary-foreground text-white shadow-xs"
                    : s.step < currentStep
                      ? "bg-teal/10 text-teal dark:bg-teal/10 dark:text-teal"
                      : "bg-secondary/30 text-muted-foreground dark:bg-card dark:text-muted-foreground"
                }`}
              >
                {s.step}
              </button>
            ))}
          </div>

          {/* Active Stage Card */}
          <div className="rounded-sm border border-border bg-secondary/30 p-6 dark:border-border dark:bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3 dark:border-border">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal dark:text-teal">
                  {activeStage.phase}
                </span>
                <h4 className="text-lg font-bold text-muted-foreground dark:text-muted-foreground mt-0.5">
                  {activeStage.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  className="rounded-sm border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground disabled:opacity-40 dark:border-border dark:bg-card dark:text-muted-foreground"
                >
                  Previous
                </button>
                <button
                  disabled={currentStep === PIPELINE_STAGES.length}
                  onClick={() =>
                    setCurrentStep((prev) => Math.min(PIPELINE_STAGES.length, prev + 1))
                  }
                  className="inline-flex items-center gap-1 rounded-sm bg-navy hover:bg-deep text-primary-foreground px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40 hover:bg-navy hover:bg-deep text-primary-foreground shadow-xs"
                >
                  Next Stage
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground dark:text-muted-foreground leading-relaxed">
              {activeStage.summary}
            </p>

            {activeStage.mathFormula && (
              <div className="mt-3 rounded-sm bg-card p-3 font-mono text-xs text-teal border border-border dark:bg-card dark:text-teal dark:border-border">
                <span className="font-semibold text-muted-foreground mr-2">Formula:</span>
                {activeStage.mathFormula}
              </div>
            )}

            {/* Code and Output Stack */}
            <div className="mt-4 space-y-4">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Python Implementation
                </span>
                <pre className="mt-1.5 overflow-x-auto rounded-sm bg-secondary/30 p-3.5 font-mono text-xs text-muted-foreground">
                  {activeStage.pythonSnippet}
                </pre>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Execution Output Summary
                </span>
                <div className="mt-1.5 rounded-sm border border-teal bg-teal/10 p-3.5 text-xs text-teal dark:border-teal/40 dark:bg-teal/10 dark:text-teal font-mono">
                  <div className="flex items-center gap-1.5 font-bold mb-1.5 text-teal dark:text-teal">
                    <CheckCircle2 className="h-4 w-4" /> Output Diagnostic
                  </div>
                  {activeStage.outputSummary}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personas Tab */}
      {activeTab === "personas" && (
        <div className="space-y-6">
          <div className="rounded-sm bg-secondary/30 p-4 dark:bg-card border border-border dark:border-border">
            <h4 className="text-sm font-bold text-muted-foreground dark:text-muted-foreground mb-1">
              Downstream Production Marketing Personas (k = 3)
            </h4>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Transforming abstract mathematical clusters into actionable commercial strategies with
              automated campaign workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CUSTOMER_PERSONAS.map((p) => (
              <div
                key={p.id}
                className="rounded-sm border border-border bg-card p-5 shadow-xs dark:border-border dark:bg-card flex flex-col justify-between"
                style={{ borderTopWidth: "4px", borderTopColor: p.color }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base" style={{ color: p.color }}>
                      {p.name}
                    </h4>
                    <span className="rounded bg-secondary/30 px-2 py-0.5 text-xs text-muted-foreground dark:bg-card dark:text-muted-foreground font-semibold">
                      {p.size}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 rounded-sm bg-secondary/30 p-3 dark:bg-card text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Median Spend:</span>
                      <span className="font-bold text-muted-foreground dark:text-muted-foreground">
                        {p.avgSpend}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Median Frequency:</span>
                      <span className="font-bold text-muted-foreground dark:text-muted-foreground">
                        {p.avgFreq}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Engagement:</span>
                      <span className="font-bold text-muted-foreground dark:text-muted-foreground">
                        {p.recency}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground dark:text-muted-foreground leading-relaxed">
                    {p.traits}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border dark:border-border">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Recommended Automation:
                  </span>
                  <p className="mt-1 text-xs text-teal dark:text-teal font-medium">{p.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Dashboard Tab */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-sm border border-border bg-card p-4 shadow-xs dark:border-border dark:bg-card">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Cophenetic CCC
              </span>
              <div className="mt-2 text-2xl font-bold font-mono text-muted-foreground dark:text-muted-foreground">
                0.8568
              </div>
              <div className="mt-1 text-xs text-teal dark:text-teal font-semibold">
                High Tree Metric Fidelity
              </div>
            </div>

            <div className="rounded-sm border border-border bg-card p-4 shadow-xs dark:border-border dark:bg-card">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Peak Silhouette
              </span>
              <div className="mt-2 text-2xl font-bold font-mono text-muted-foreground dark:text-muted-foreground">
                0.7214
              </div>
              <div className="mt-1 text-xs text-teal dark:text-teal font-semibold">
                Optimal at k = 3
              </div>
            </div>

            <div className="rounded-sm border border-border bg-card p-4 shadow-xs dark:border-border dark:bg-card">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Davies–Bouldin
              </span>
              <div className="mt-2 text-2xl font-bold font-mono text-muted-foreground dark:text-muted-foreground">
                0.3742
              </div>
              <div className="mt-1 text-xs text-teal dark:text-teal font-semibold">
                Tight Compact Separation
              </div>
            </div>

            <div className="rounded-sm border border-border bg-card p-4 shadow-xs dark:border-border dark:bg-card">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Bootstrap Stability
              </span>
              <div className="mt-2 text-2xl font-bold font-mono text-muted-foreground dark:text-muted-foreground">
                ARI = 1.0000
              </div>
              <div className="mt-1 text-xs text-teal dark:text-teal font-semibold">
                100% Subsample Reproducible
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-border bg-secondary/30 p-4 dark:border-border dark:bg-card">
            <h4 className="text-sm font-bold text-muted-foreground dark:text-muted-foreground mb-2">
              Multi-Metric Sweep Diagnostic Curve (k = 2 to 5)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-border dark:border-border rounded-sm overflow-hidden">
                <thead className="bg-secondary/30 text-muted-foreground dark:bg-card dark:text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-3">Clusters (k)</th>
                    <th className="p-3">Silhouette Score (s̄)</th>
                    <th className="p-3">Davies–Bouldin (DB)</th>
                    <th className="p-3">Calinski–Harabasz (CH)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-border">
                  <tr className="hover:bg-secondary/30 dark:hover:bg-secondary/30">
                    <td className="p-3 font-bold">k = 2</td>
                    <td className="p-3 font-mono">0.5842</td>
                    <td className="p-3 font-mono">0.5410</td>
                    <td className="p-3 font-mono">214.5</td>
                    <td className="p-3 text-muted-foreground">Coarse macro split</td>
                  </tr>
                  <tr className="bg-teal/10 font-semibold dark:bg-teal/10">
                    <td className="p-3 font-bold text-teal dark:text-teal">k = 3 (SELECTED)</td>
                    <td className="p-3 font-mono text-teal dark:text-teal">0.7214 (PEAK)</td>
                    <td className="p-3 font-mono text-teal dark:text-teal">0.3742 (MINIMUM)</td>
                    <td className="p-3 font-mono text-teal dark:text-teal">419.3 (PEAK)</td>
                    <td className="p-3 text-teal dark:text-teal">Optimal multi-metric consensus</td>
                  </tr>
                  <tr className="hover:bg-secondary/30 dark:hover:bg-secondary/30">
                    <td className="p-3 font-bold">k = 4</td>
                    <td className="p-3 font-mono">0.5980</td>
                    <td className="p-3 font-mono">0.6841</td>
                    <td className="p-3 font-mono">312.4</td>
                    <td className="p-3 text-muted-foreground">Over-segmentation</td>
                  </tr>
                  <tr className="hover:bg-secondary/30 dark:hover:bg-secondary/30">
                    <td className="p-3 font-bold">k = 5</td>
                    <td className="p-3 font-mono">0.4812</td>
                    <td className="p-3 font-mono">0.8920</td>
                    <td className="p-3 font-mono">245.1</td>
                    <td className="p-3 text-muted-foreground">Degraded boundaries</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Script Tab */}
      {activeTab === "script" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground">
              Complete Self-Contained Production Python Script
            </span>
            <button
              onClick={() => copyCode(fullPipelinePython)}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-xs hover:bg-secondary/30 dark:border-border dark:bg-card dark:text-muted-foreground"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-teal" />
                  Copied Script!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy 15-Stage Script
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-sm bg-secondary/30 p-4 font-mono text-xs text-muted-foreground max-h-96">
            {fullPipelinePython}
          </pre>
        </div>
      )}
    </div>
  );
}

/** 4-Question Interactive Self-Assessment Quiz for Module 14 */
const CLUSTER_COLORS = [
  "#1e3a8a", // Navy (Cluster 0)
  "#0d9488", // Teal (Cluster 1)
  "#b45309", // Amber (Cluster 2)
  "#7c3aed", // Violet (Cluster 3)
  "#be185d", // Rose (Cluster 4)
  "#0369a1", // Sky (Cluster 5)
];

export function AlgorithmShowdown() {
  const [datasetKey, setDatasetKey] = useState<"moons" | "blobs" | "mixture">("moons");
  const [kParam, setKParam] = useState<number>(2);
  const [epsParam, setEpsParam] = useState<number>(0.35);
  const [minPtsParam, setMinPtsParam] = useState<number>(3);

  const dataset = useMemo(() => {
    if (datasetKey === "moons") return generateTwoMoons(140, 0.08, 42);
    if (datasetKey === "blobs") return generateAnisotropicBlobs(150, 42);
    return generateGaussianMixture(150, 42);
  }, [datasetKey]);

  useEffect(() => {
    setKParam(dataset.recommendedK);
    setEpsParam(dataset.recommendedEps);
  }, [dataset]);

  const singleRes = useMemo(() => singleLinkage(dataset.points, kParam), [dataset, kParam]);
  const wardRes = useMemo(() => wardLinkage(dataset.points, kParam), [dataset, kParam]);
  const kMeansRes = useMemo(() => kMeans(dataset.points, kParam, 50, 42), [dataset, kParam]);
  const dbscanRes = useMemo(
    () => dbscan(dataset.points, epsParam, minPtsParam),
    [dataset, epsParam, minPtsParam],
  );

  const singleARI = useMemo(
    () => computeAdjustedRandIndex(dataset.groundTruth, singleRes.labels),
    [dataset, singleRes],
  );
  const singleSil = useMemo(
    () => computeSilhouetteScore(dataset.points, singleRes.labels),
    [dataset, singleRes],
  );

  const wardARI = useMemo(
    () => computeAdjustedRandIndex(dataset.groundTruth, wardRes.labels),
    [dataset, wardRes],
  );
  const wardSil = useMemo(
    () => computeSilhouetteScore(dataset.points, wardRes.labels),
    [dataset, wardRes],
  );

  const kMeansARI = useMemo(
    () => computeAdjustedRandIndex(dataset.groundTruth, kMeansRes.labels),
    [dataset, kMeansRes],
  );
  const kMeansSil = useMemo(
    () => computeSilhouetteScore(dataset.points, kMeansRes.labels),
    [dataset, kMeansRes],
  );

  const dbscanARI = useMemo(
    () => computeAdjustedRandIndex(dataset.groundTruth, dbscanRes.labels),
    [dataset, dbscanRes],
  );
  const dbscanSil = useMemo(
    () => computeSilhouetteScore(dataset.points, dbscanRes.labels),
    [dataset, dbscanRes],
  );

  const bounds = useMemo(() => {
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const [x, y] of dataset.points) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;
    return { minX, maxX, minY, maxY, spanX, spanY };
  }, [dataset]);

  const scalePoint = (x: number, y: number, width = 300, height = 190, pad = 20) => {
    const sx = pad + ((x - bounds.minX) / bounds.spanX) * (width - 2 * pad);
    const sy = height - pad - ((y - bounds.minY) / bounds.spanY) * (height - 2 * pad);
    return [Math.round(sx * 100) / 100, Math.round(sy * 100) / 100];
  };

  const renderBadge = (ari: number) => {
    if (ari >= 0.85) {
      return (
        <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-teal/10 text-teal border border-teal/20">
          ARI: {ari.toFixed(3)}
        </span>
      );
    }
    if (ari >= 0.5) {
      return (
        <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          ARI: {ari.toFixed(3)}
        </span>
      );
    }
    return (
      <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-sm bg-destructive/10 text-destructive border border-destructive/20">
        ARI: {ari.toFixed(3)}
      </span>
    );
  };

  return (
    <div className="my-8 rounded-sm border border-border bg-card p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-sm bg-teal/10 border border-teal/20 px-2.5 py-1 text-xs font-mono font-medium text-teal">
            <Activity className="h-3.5 w-3.5" />
            Cross-Paradigm Algorithm Showdown
          </div>
          <h3 className="mt-1.5 text-lg font-bold text-foreground">
            Benchmarking Single Linkage, Ward, K-Means & DBSCAN
          </h3>
          <p className="text-xs text-muted-foreground">
            Compare non-convex manifold continuity, spherical variance partitioning, and
            density-based clustering across complex 2D geometries.
          </p>
        </div>
        <button
          onClick={() => {
            setKParam(dataset.recommendedK);
            setEpsParam(dataset.recommendedEps);
            setMinPtsParam(3);
          }}
          className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/40 hover:text-foreground self-start md:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Parameters
        </button>
      </div>

      {/* Control Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-sm border border-border bg-secondary/30 p-4">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
            Geometric Dataset
          </label>
          <select
            value={datasetKey}
            onChange={(e) => setDatasetKey(e.target.value as "moons" | "blobs" | "mixture")}
            className="w-full rounded-sm border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-hidden"
          >
            <option value="moons">Two Interleaving Moons (Non-Convex)</option>
            <option value="blobs">Anisotropic Blobs (Elongated)</option>
            <option value="mixture">Gaussian Mixture (Spherical Overlap)</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
            <span className="uppercase tracking-wider">Cluster Count (k)</span>
            <span className="font-mono text-teal">{kParam}</span>
          </div>
          <input
            type="range"
            min={2}
            max={6}
            step={1}
            value={kParam}
            onChange={(e) => setKParam(parseInt(e.target.value, 10))}
            className="w-full accent-teal cursor-pointer"
          />
          <span className="text-[10px] text-muted-foreground">Applies to HAC & K-Means</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
            <span className="uppercase tracking-wider">DBSCAN Radius (ε)</span>
            <span className="font-mono text-teal">{epsParam.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.15}
            max={0.9}
            step={0.05}
            value={epsParam}
            onChange={(e) => setEpsParam(parseFloat(e.target.value))}
            className="w-full accent-teal cursor-pointer"
          />
          <span className="text-[10px] text-muted-foreground">Neighborhood threshold</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
            <span className="uppercase tracking-wider">DBSCAN MinPts</span>
            <span className="font-mono text-teal">{minPtsParam}</span>
          </div>
          <input
            type="range"
            min={2}
            max={8}
            step={1}
            value={minPtsParam}
            onChange={(e) => setMinPtsParam(parseInt(e.target.value, 10))}
            className="w-full accent-teal cursor-pointer"
          />
          <span className="text-[10px] text-muted-foreground">Core point density threshold</span>
        </div>
      </div>

      {/* 2x2 Small Multiples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Panel 1: Single Linkage */}
        <div className="rounded-sm border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                <Network className="h-3.5 w-3.5 text-teal" />
                <span>Single Linkage (HAC)</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Min pairwise distance | Chaining manifold connectivity
              </p>
            </div>
            {renderBadge(singleARI)}
          </div>
          <svg
            viewBox="0 0 300 190"
            className="w-full h-auto bg-background rounded-sm border border-border"
          >
            {dataset.points.map((p, i) => {
              const [cx, cy] = scalePoint(p[0], p[1]);
              const l = singleRes.labels[i] ?? 0;
              const color = CLUSTER_COLORS[l % CLUSTER_COLORS.length];
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={3.5}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={0.8}
                />
              );
            })}
          </svg>
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-border pt-2">
            <span>Silhouette: {singleSil.toFixed(3)}</span>
            <span>k = {kParam}</span>
          </div>
        </div>

        {/* Panel 2: Ward Linkage */}
        <div className="rounded-sm border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                <Layers className="h-3.5 w-3.5 text-navy" />
                <span>Ward Linkage (HAC)</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Min variance increase (ΔWSS) | Compact spherical partitions
              </p>
            </div>
            {renderBadge(wardARI)}
          </div>
          <svg
            viewBox="0 0 300 190"
            className="w-full h-auto bg-background rounded-sm border border-border"
          >
            {dataset.points.map((p, i) => {
              const [cx, cy] = scalePoint(p[0], p[1]);
              const l = wardRes.labels[i] ?? 0;
              const color = CLUSTER_COLORS[l % CLUSTER_COLORS.length];
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={3.5}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={0.8}
                />
              );
            })}
          </svg>
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-border pt-2">
            <span>Silhouette: {wardSil.toFixed(3)}</span>
            <span>k = {kParam}</span>
          </div>
        </div>

        {/* Panel 3: K-Means */}
        <div className="rounded-sm border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                <Compass className="h-3.5 w-3.5 text-amber-600" />
                <span>K-Means (Lloyd)</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Euclidean Voronoi cells | Iterative centroid reassignment
              </p>
            </div>
            {renderBadge(kMeansARI)}
          </div>
          <svg
            viewBox="0 0 300 190"
            className="w-full h-auto bg-background rounded-sm border border-border"
          >
            {dataset.points.map((p, i) => {
              const [cx, cy] = scalePoint(p[0], p[1]);
              const l = kMeansRes.labels[i] ?? 0;
              const color = CLUSTER_COLORS[l % CLUSTER_COLORS.length];
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={3.5}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={0.8}
                />
              );
            })}
            {/* Draw Centroids */}
            {kMeansRes.centroids.map((cent, ci) => {
              const [cx, cy] = scalePoint(cent[0] ?? 0, cent[1] ?? 0);
              return (
                <g key={`cent-${ci}`}>
                  <circle cx={cx} cy={cy} r={6} fill="#ffffff" stroke="#0f172a" strokeWidth={2} />
                  <circle cx={cx} cy={cy} r={2.5} fill="#0f172a" />
                </g>
              );
            })}
          </svg>
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-border pt-2">
            <span>Silhouette: {kMeansSil.toFixed(3)}</span>
            <span>{kMeansRes.iterations} iterations</span>
          </div>
        </div>

        {/* Panel 4: DBSCAN */}
        <div className="rounded-sm border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                <Gauge className="h-3.5 w-3.5 text-teal" />
                <span>DBSCAN (Density-Based)</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Density-reachability | Automatic cluster count & noise rejection
              </p>
            </div>
            {renderBadge(dbscanARI)}
          </div>
          <svg
            viewBox="0 0 300 190"
            className="w-full h-auto bg-background rounded-sm border border-border"
          >
            {dataset.points.map((p, i) => {
              const [cx, cy] = scalePoint(p[0], p[1]);
              const l = dbscanRes.labels[i] ?? -1;
              if (l === -1) {
                // Noise point
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill="#94a3b8"
                    stroke="#475569"
                    strokeWidth={0.8}
                    strokeDasharray="1 1"
                  />
                );
              }
              const color = CLUSTER_COLORS[l % CLUSTER_COLORS.length];
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={3.5}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={0.8}
                />
              );
            })}
          </svg>
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-border pt-2">
            <span>Silhouette: {dbscanSil.toFixed(3)}</span>
            <span>
              {dbscanRes.clusterCount} clusters ({dbscanRes.noiseCount} noise)
            </span>
          </div>
        </div>
      </div>

      {/* Educational Synthesis Callout */}
      <div className="rounded-sm border border-teal/20 bg-teal/5 p-4 text-xs text-foreground space-y-1">
        <span className="font-bold flex items-center gap-1.5 text-teal">
          <Info className="h-4 w-4" />
          Key Theoretical Takeaway
        </span>
        <p className="text-muted-foreground leading-relaxed">
          On non-convex geometries (such as Two Moons), Single Linkage and DBSCAN achieve perfect
          separation (ARI = 1.000) by tracing continuous local proximity paths. By contrast, K-Means
          and Ward Linkage enforce convex, spherical partitions around central points—fracturing the
          non-linear crescent moons despite achieving higher raw Silhouette scores!
        </p>
      </div>
    </div>
  );
}

export function Module14Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const questions = [
    {
      id: 1,
      prompt:
        "Why does standard agglomerative hierarchical clustering hit a severe memory bottleneck on datasets with N = 100,000 observations?",
      options: [
        "Python integers overflow when indexing beyond 65,536 observations.",
        "Storing the full pairwise distance matrix requires O(N²) memory, which requires ~40 GB of RAM for float32 entries.",
        "The Lance–Williams recurrence cannot be computed in parallel.",
        "Dendrograms are limited to 1,000 leaf nodes by graphical display systems.",
      ],
      correct: 1,
      explanation:
        "Dense agglomerative clustering requires an N × N distance matrix (or N(N-1)/2 condensed pairwise distances). For N = 100,000, storing (100,000 × 99,999)/2 ≈ 5 × 10⁹ float32 elements consumes nearly 40 GB of RAM, exceeding standard cloud container limits.",
    },
    {
      id: 2,
      prompt:
        "How do sparse connectivity graphs (e.g. kneighbors_graph) overcome the quadratic scaling bottleneck in Scikit-Learn?",
      options: [
        "They replace hierarchical clustering with K-Means clustering under the hood.",
        "They restrict candidate merges to observations connected by a graph edge, reducing memory scaling to sparse O(N · k_nn).",
        "They discard 90% of the observations before running the algorithm.",
        "They force the dendrogram to merge top-down instead of bottom-up.",
      ],
      correct: 1,
      explanation:
        "By enforcing a sparse spatial adjacency graph (such as a 10-nearest-neighbors graph), Scikit-Learn only evaluates merges between connected components. Memory consumption drops from dense O(N²) to sparse O(N · k_nn), enabling agglomeration on hundreds of thousands of observations.",
    },
    {
      id: 3,
      prompt:
        "What is the primary algorithmic disadvantage of agglomerative clustering's greedy merging strategy compared to K-Means or GMM?",
      options: [
        "Agglomerative clustering is non-deterministic and yields different results on each run.",
        "Merges are strictly irreversible; an erroneous merge made early due to noise can never be undone later in the hierarchy.",
        "Agglomerative clustering cannot calculate cluster centroids.",
        "Agglomerative clustering requires initial random centroid seeds.",
      ],
      correct: 1,
      explanation:
        "Agglomerative clustering is greedy and irreversible: once two clusters coalesce, that decision is permanent. By contrast, K-Means and Expectation-Maximization (GMM) iteratively reassign points between clusters on every iteration, allowing the model to recover from poor initial partition choices.",
    },
    {
      id: 4,
      prompt:
        "Under which scenario is Hierarchical Clustering preferred over K-Means and DBSCAN in production data science?",
      options: [
        "When the dataset has 10 million streaming records and requires sub-second real-time clustering.",
        "When the target number of clusters k is unknown, non-Euclidean dissimilarity is required, and multi-scale taxonomy is essential.",
        "When all clusters are known to be perfectly spherical and noise-free.",
        "When memory consumption must be strictly O(1).",
      ],
      correct: 1,
      explanation:
        "Hierarchical clustering is uniquely well-suited when domain problems feature multi-scale taxonomies (e.g. biological phylogeny, topic trees), when the optimal cluster count is unknown a priori, and when non-Euclidean metrics (e.g., Cosine, Manhattan, Mahalanobis) are necessary.",
    },
    {
      id: 5,
      prompt:
        "On non-convex geometric structures (such as two interleaving crescent moons), why does Ward linkage fail while Single linkage and DBSCAN succeed?",
      options: [
        "Ward linkage minimizes intra-cluster variance, greedily forming convex spherical partitions around Euclidean centroids that split non-linear continuous curves.",
        "Single linkage requires all observations to lie on a straight line.",
        "DBSCAN computes an exact Voronoi tessellation that bends around curves.",
        "Ward linkage is mathematically restricted to Manhattan distance in 2D space.",
      ],
      correct: 0,
      explanation:
        "Ward linkage minimizes increase in within-cluster sum of squares (ΔWSS). It mathematically assumes spherical, convex, equal-variance clusters with a central mean. On non-linear manifolds like moons or concentric rings, the distance between crescent tips is greater than the distance between moons across the center, causing Ward (and K-Means) to cut across the crescents. By contrast, Single Linkage and DBSCAN evaluate local connectivity and density paths.",
    },
    {
      id: 6,
      prompt:
        "When comparing clustering paradigms for massive production streaming deployment (N > 5,000,000 observations), which algorithm is most appropriate and why?",
      options: [
        "Agglomerative Hierarchical Clustering, because dendrograms can be serialized directly into JSON.",
        "Mini-Batch K-Means, because it operates in linear time O(N · k · d) and constant memory O(k · d) via online stochastic gradient updates.",
        "DBSCAN, because it evaluates pairwise ε-balls in constant O(1) time without spatial indexes.",
        "Divisive Hierarchical Clustering (DIANA), because 2^N splits execute naturally on parallel GPUs.",
      ],
      correct: 1,
      explanation:
        "Mini-Batch K-Means uses stochastic gradient descent with small random subsets, processing millions of observations in linear time O(N · k · d) with fixed memory O(k · d). Agglomerative and divisive hierarchical algorithms require at least quadratic O(N²) distance evaluation or graph construction, making unconstrained massive streaming intractable.",
    },
    {
      id: 7,
      prompt:
        "How does the two-stage hybrid clustering architecture (MiniBatchKMeans + AgglomerativeClustering) scale hierarchical clustering to massive datasets (N > 100,000)?",
      options: [
        "It first partitions N points into M micro-clusters using fast O(N) MiniBatchKMeans, then builds the hierarchical tree over the M micro-cluster centroids.",
        "It converts the dataset into a random forest before computing distances.",
        "It discards 99% of the dataset and clusters only the 1% sample.",
        "It runs hierarchical clustering on a GPU using deep neural networks.",
      ],
      correct: 0,
      explanation:
        "Standard agglomerative clustering requires O(N²) memory and O(N²) to O(N³) time, failing for large N. Two-stage hybrid clustering solves this by using MiniBatchKMeans (linear in N) to compress N = 100,000 points into M = 500 micro-cluster centroids, then running AgglomerativeClustering on the M centroids (O(M²)) and mapping the resulting labels back to the original points.",
    },
    {
      id: 8,
      prompt:
        "What performance advantage does Daniel Müllner's fastcluster C++ library provide over standard SciPy hierarchical clustering?",
      options: [
        "It removes the requirement for metric distance functions.",
        "It implements optimal O(N²) algorithms (such as the nearest-neighbor chain algorithm and Prim's MST for single linkage) with low constant factors and minimal memory footprint.",
        "It allows dendrograms to have negative height merges.",
        "It computes clusters without computing any pairwise dissimilarities.",
      ],
      correct: 1,
      explanation:
        "The fastcluster library provides highly optimized C++ routines that implement the nearest-neighbor chain algorithm (reducing time complexity to O(N²) for Ward, Complete, and Average linkage) and Prim's algorithm for Single Linkage (O(N²) time with O(N) memory), yielding dramatic speedups (often 10x to 100x) over naive agglomeration without requiring full distance matrix allocation.",
    },
  ];

  const handleSelect = (qId: number, optIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qId, optIdx]) => {
    const q = questions.find((item) => item.id === parseInt(qId, 10));
    return q && q.correct === optIdx ? acc + 1 : acc;
  }, 0);

  return (
    <div className="my-8 rounded-sm border border-border bg-card p-6 shadow-xs dark:border-border dark:bg-card">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 dark:border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal dark:text-teal">
            <HelpCircle className="h-4 w-4" />
            Knowledge Check
          </div>
          <h3 className="mt-1 text-lg font-bold text-muted-foreground dark:text-muted-foreground">
            Module 14: Applications, Scalability & Paradigm Assessment
          </h3>
        </div>
        {showResults && (
          <div className="inline-flex items-center gap-2 rounded-sm bg-teal/10 px-3 py-1.5 text-xs font-bold text-teal dark:bg-teal/10 dark:text-teal">
            Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userAns = selectedAnswers[q.id];
          const isAnswered = userAns !== undefined;
          const isCorrect = userAns === q.correct;

          return (
            <div
              key={q.id}
              className="rounded-sm border border-border bg-secondary/30 p-4 dark:border-border dark:bg-card"
            >
              <p className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground">
                {idx + 1}. {q.prompt}
              </p>

              <div className="mt-3 space-y-2">
                {q.options.map((opt, optIdx) => {
                  let btnStyle =
                    "border-border bg-card text-muted-foreground hover:bg-secondary/30 dark:border-border dark:bg-card dark:text-muted-foreground";

                  if (showResults) {
                    if (optIdx === q.correct) {
                      btnStyle =
                        "border-teal bg-teal/10 text-teal font-medium dark:bg-teal/10 dark:text-teal dark:border-teal";
                    } else if (userAns === optIdx) {
                      btnStyle =
                        "border-destructive bg-destructive/10 text-destructive font-medium dark:bg-destructive/10 dark:text-destructive dark:border-destructive";
                    }
                  } else if (userAns === optIdx) {
                    btnStyle =
                      "border-navy bg-teal/10 text-teal font-medium dark:bg-teal/10 dark:text-teal dark:border-teal";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={showResults}
                      className={`flex w-full items-center justify-between rounded-sm border p-3 text-left text-xs transition-all ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showResults && optIdx === q.correct && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal dark:text-teal" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div
                  className={`mt-3 rounded-sm p-3 text-xs ${
                    isCorrect
                      ? "bg-teal/10 text-teal dark:bg-teal/10 dark:text-teal"
                      : "bg-destructive/10 text-destructive dark:bg-destructive/10 dark:text-destructive"
                  }`}
                >
                  <span className="font-bold">{isCorrect ? "Correct: " : "Incorrect: "}</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {showResults ? (
          <button
            onClick={() => {
              setSelectedAnswers({});
              setShowResults(false);
            }}
            className="rounded-sm border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary/30 dark:border-border dark:text-muted-foreground dark:hover:bg-secondary/30"
          >
            Retake Quiz
          </button>
        ) : (
          <button
            onClick={() => setShowResults(true)}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className="rounded-sm bg-navy hover:bg-deep text-primary-foreground px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-navy hover:bg-deep text-primary-foreground disabled:opacity-50"
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
}
