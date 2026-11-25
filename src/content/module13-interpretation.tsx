import { useState, useMemo } from "react";
import {
  ShieldCheck,
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
  Flame,
} from "lucide-react";

interface ProfileItem {
  id: number;
  label: string;
  features: Record<string, number>;
  trueCluster?: number;
}

interface ProfileDataset {
  name: string;
  description: string;
  featureNames: string[];
  featureUnits: Record<string, string>;
  items: ProfileItem[];
}

const PROFILING_DATASETS: Record<string, ProfileDataset> = {
  customer_rfm: {
    name: "Customer Behavioral RFM Cohort (N=12)",
    description:
      "12 enterprise customer accounts characterized by Annual Spend ($k), Order Frequency (orders/mo), and Discount Affinity (%).",
    featureNames: ["annual_spend", "order_frequency", "discount_rate"],
    featureUnits: { annual_spend: "$k", order_frequency: "orders/mo", discount_rate: "%" },
    items: [
      // Cluster 1: VIP High-Volume Enterprise
      {
        id: 0,
        label: "Acme Corp",
        features: { annual_spend: 85.0, order_frequency: 24.0, discount_rate: 5.0 },
      },
      {
        id: 1,
        label: "GlobalTech",
        features: { annual_spend: 92.0, order_frequency: 28.0, discount_rate: 4.0 },
      },
      {
        id: 2,
        label: "Apex Cloud",
        features: { annual_spend: 78.0, order_frequency: 22.0, discount_rate: 8.0 },
      },
      {
        id: 3,
        label: "OmniSoft",
        features: { annual_spend: 88.0, order_frequency: 25.0, discount_rate: 6.0 },
      },
      // Cluster 2: Budget Discount Seekers
      {
        id: 4,
        label: "BargainMart",
        features: { annual_spend: 12.0, order_frequency: 14.0, discount_rate: 45.0 },
      },
      {
        id: 5,
        label: "Thrifty Co",
        features: { annual_spend: 15.0, order_frequency: 16.0, discount_rate: 42.0 },
      },
      {
        id: 6,
        label: "DiscountHub",
        features: { annual_spend: 10.0, order_frequency: 12.0, discount_rate: 50.0 },
      },
      {
        id: 7,
        label: "ValueDeals",
        features: { annual_spend: 14.0, order_frequency: 15.0, discount_rate: 38.0 },
      },
      // Cluster 3: Small Occasional Shoppers
      {
        id: 8,
        label: "SoloTech",
        features: { annual_spend: 6.0, order_frequency: 2.0, discount_rate: 15.0 },
      },
      {
        id: 9,
        label: "MicroStudio",
        features: { annual_spend: 8.0, order_frequency: 3.0, discount_rate: 12.0 },
      },
      {
        id: 10,
        label: "FreelancePro",
        features: { annual_spend: 5.0, order_frequency: 2.0, discount_rate: 20.0 },
      },
      {
        id: 11,
        label: "IndieDev",
        features: { annual_spend: 7.0, order_frequency: 4.0, discount_rate: 18.0 },
      },
    ],
  },
  gene_expression: {
    name: "Cellular Transcriptomics (N=12)",
    description:
      "12 single-cell samples profiled across marker genes: CD3D (T-Cells), CD19 (B-Cells), and EPCAM (Epithelial).",
    featureNames: ["CD3D", "CD19", "EPCAM"],
    featureUnits: { CD3D: "log2(TPM)", CD19: "log2(TPM)", EPCAM: "log2(TPM)" },
    items: [
      // Cluster 1: T-Lymphocytes
      { id: 0, label: "T_Cell_1", features: { CD3D: 10.2, CD19: 0.1, EPCAM: 0.2 } },
      { id: 1, label: "T_Cell_2", features: { CD3D: 9.8, CD19: 0.3, EPCAM: 0.1 } },
      { id: 2, label: "T_Cell_3", features: { CD3D: 11.1, CD19: 0.2, EPCAM: 0.0 } },
      { id: 3, label: "T_Cell_4", features: { CD3D: 10.5, CD19: 0.4, EPCAM: 0.3 } },
      // Cluster 2: B-Lymphocytes
      { id: 4, label: "B_Cell_1", features: { CD3D: 0.2, CD19: 9.5, EPCAM: 0.1 } },
      { id: 5, label: "B_Cell_2", features: { CD3D: 0.4, CD19: 10.1, EPCAM: 0.2 } },
      { id: 6, label: "B_Cell_3", features: { CD3D: 0.1, CD19: 8.9, EPCAM: 0.0 } },
      { id: 7, label: "B_Cell_4", features: { CD3D: 0.3, CD19: 9.7, EPCAM: 0.4 } },
      // Cluster 3: Epithelial Carcinoma
      { id: 8, label: "Epi_1", features: { CD3D: 0.1, CD19: 0.2, EPCAM: 11.4 } },
      { id: 9, label: "Epi_2", features: { CD3D: 0.0, CD19: 0.1, EPCAM: 10.8 } },
      { id: 10, label: "Epi_3", features: { CD3D: 0.3, CD19: 0.0, EPCAM: 12.0 } },
      { id: 11, label: "Epi_4", features: { CD3D: 0.2, CD19: 0.3, EPCAM: 11.2 } },
    ],
  },
  outlier_anomaly: {
    name: "Core Clusters with Remote Outlier (N=9)",
    description:
      "Two compact 4-point clusters with an extreme remote anomaly showing outlier vulnerability in Ward vs. Single linkage.",
    featureNames: ["metric_x", "metric_y"],
    featureUnits: { metric_x: "units", metric_y: "units" },
    items: [
      { id: 0, label: "A₁", features: { metric_x: 2.0, metric_y: 2.0 } },
      { id: 1, label: "A₂", features: { metric_x: 2.5, metric_y: 2.8 } },
      { id: 2, label: "A₃", features: { metric_x: 3.0, metric_y: 2.2 } },
      { id: 3, label: "A₄", features: { metric_x: 2.8, metric_y: 3.0 } },
      { id: 4, label: "B₁", features: { metric_x: 10.0, metric_y: 10.0 } },
      { id: 5, label: "B₂", features: { metric_x: 10.5, metric_y: 10.8 } },
      { id: 6, label: "B₃", features: { metric_x: 11.0, metric_y: 10.2 } },
      { id: 7, label: "B₄", features: { metric_x: 10.8, metric_y: 11.0 } },
      { id: 8, label: "Outlier_Ω", features: { metric_x: 35.0, metric_y: 40.0 } },
    ],
  },
};

const PALETTE = [
  "#0d9488", // Teal
  "#1e3a8a", // Navy
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#10b981", // Emerald
];

export function ClusterInterpretationLab() {
  const [datasetKey, setDatasetKey] = useState<string>("customer_rfm");
  const [linkageMethod, setLinkageMethod] = useState<"ward" | "average" | "complete" | "single">(
    "ward",
  );
  const [kClusters, setKClusters] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<"profiles" | "heatmap" | "stability" | "code">(
    "profiles",
  );
  const [bootstrapReps, setBootstrapReps] = useState<number>(25);
  const [subsampleRatio, setSubsampleRatio] = useState<number>(0.8);
  const [copied, setCopied] = useState<boolean>(false);

  const dataset = PROFILING_DATASETS[datasetKey] || PROFILING_DATASETS.customer_rfm;
  const items = dataset.items;
  const featureNames = dataset.featureNames;
  const n = items.length;

  // Feature population statistics (mean and std dev for z-score standardization)
  const populationStats = useMemo(() => {
    const stats: Record<string, { mean: number; std: number }> = {};
    for (const f of featureNames) {
      const vals = items.map((it) => it.features[f]);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const sumSq = vals.reduce((a, b) => a + (b - mean) ** 2, 0);
      const std = Math.sqrt(sumSq / vals.length) || 1.0;
      stats[f] = { mean, std };
    }
    return stats;
  }, [items, featureNames]);

  // Standardized distance matrix for clustering
  const distMatrix = useMemo(() => {
    const mat: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let sumSq = 0;
        for (const f of featureNames) {
          const z_i = (items[i].features[f] - populationStats[f].mean) / populationStats[f].std;
          const z_j = (items[j].features[f] - populationStats[f].mean) / populationStats[f].std;
          sumSq += (z_i - z_j) ** 2;
        }
        const d = Math.sqrt(sumSq);
        mat[i][j] = d;
        mat[j][i] = d;
      }
    }
    return mat;
  }, [items, featureNames, populationStats, n]);

  // Hierarchical clustering simulation on active dataset
  const clusterAssignments = useMemo(() => {
    interface ActiveCluster {
      id: number;
      indices: number[];
    }

    let clusters: ActiveCluster[] = items.map((_, i) => ({
      id: i,
      indices: [i],
    }));

    const calcClusterDist = (c1: ActiveCluster, c2: ActiveCluster): number => {
      if (linkageMethod === "single") {
        let minD = Infinity;
        for (const i of c1.indices) {
          for (const j of c2.indices) {
            minD = Math.min(minD, distMatrix[i][j]);
          }
        }
        return minD;
      } else if (linkageMethod === "complete") {
        let maxD = 0;
        for (const i of c1.indices) {
          for (const j of c2.indices) {
            maxD = Math.max(maxD, distMatrix[i][j]);
          }
        }
        return maxD;
      } else if (linkageMethod === "average") {
        let sumD = 0;
        for (const i of c1.indices) {
          for (const j of c2.indices) {
            sumD += distMatrix[i][j];
          }
        }
        return sumD / (c1.indices.length * c2.indices.length);
      } else {
        // Ward's linkage
        const n1 = c1.indices.length;
        const n2 = c2.indices.length;
        let cDistSq = 0;
        for (const f of featureNames) {
          let mean1 = 0,
            mean2 = 0;
          for (const i of c1.indices) {
            mean1 += (items[i].features[f] - populationStats[f].mean) / populationStats[f].std;
          }
          mean1 /= n1;
          for (const j of c2.indices) {
            mean2 += (items[j].features[f] - populationStats[f].mean) / populationStats[f].std;
          }
          mean2 /= n2;
          cDistSq += (mean1 - mean2) ** 2;
        }
        return Math.sqrt(((2 * n1 * n2) / (n1 + n2)) * cDistSq);
      }
    };

    while (clusters.length > kClusters) {
      let bestDist = Infinity;
      let bestA = 0;
      let bestB = 1;

      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const d = calcClusterDist(clusters[i], clusters[j]);
          if (d < bestDist) {
            bestDist = d;
            bestA = i;
            bestB = j;
          }
        }
      }

      const mergedIndices = [...clusters[bestA].indices, ...clusters[bestB].indices];
      const newCluster: ActiveCluster = {
        id: clusters[bestA].id,
        indices: mergedIndices,
      };

      clusters = clusters.filter((_, idx) => idx !== bestA && idx !== bestB);
      clusters.push(newCluster);
    }

    const labels = new Array<number>(n).fill(0);
    clusters.forEach((c, cIdx) => {
      c.indices.forEach((ptIdx) => {
        labels[ptIdx] = cIdx + 1;
      });
    });

    return { labels, clusters };
  }, [items, featureNames, populationStats, distMatrix, linkageMethod, kClusters, n]);

  // Compute cluster feature profiles (means, medians, std, and standardized z-scores)
  const clusterProfiles = useMemo(() => {
    const k = clusterAssignments.clusters.length;
    const profiles: {
      clusterId: number;
      color: string;
      memberCount: number;
      memberLabels: string[];
      features: Record<
        string,
        {
          mean: number;
          median: number;
          std: number;
          zScore: number;
        }
      >;
    }[] = [];

    for (let c = 0; c < k; c++) {
      const cIndices = clusterAssignments.clusters[c].indices;
      const memberLabels = cIndices.map((i) => items[i].label);
      const featMap: Record<string, { mean: number; median: number; std: number; zScore: number }> =
        {};

      for (const f of featureNames) {
        const vals = cIndices.map((i) => items[i].features[f]).sort((a, b) => a - b);
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        const mid = Math.floor(vals.length / 2);
        const median = vals.length % 2 === 0 ? (vals[mid - 1] + vals[mid]) / 2 : vals[mid];
        const sumSq = vals.reduce((a, b) => a + (b - mean) ** 2, 0);
        const std = Math.sqrt(sumSq / vals.length);
        const zScore = (mean - populationStats[f].mean) / populationStats[f].std;

        featMap[f] = { mean, median, std, zScore };
      }

      profiles.push({
        clusterId: c + 1,
        color: PALETTE[c % PALETTE.length],
        memberCount: cIndices.length,
        memberLabels,
        features: featMap,
      });
    }

    return profiles;
  }, [clusterAssignments, items, featureNames, populationStats]);

  // Bootstrap Resampling Stability Simulation
  const stabilityResult = useMemo(() => {
    const subN = Math.max(3, Math.floor(subsampleRatio * n));
    const refLabels = clusterAssignments.labels;

    const calcARI = (labelsA: number[], labelsB: number[]): number => {
      const len = labelsA.length;
      let a = 0,
        b = 0,
        c = 0,
        d = 0;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const sameA = labelsA[i] === labelsA[j];
          const sameB = labelsB[i] === labelsB[j];
          if (sameA && sameB) a++;
          else if (sameA && !sameB) b++;
          else if (!sameA && !sameB) c++;
          else d++;
        }
      }
      const totalPairs = a + b + c + d;
      if (totalPairs === 0) return 1.0;
      const expectedIndex = ((a + b) * (a + d)) / totalPairs;
      const maxIndex = (a + b + (a + d)) / 2;
      const denom = maxIndex - expectedIndex;
      return denom === 0 ? 1.0 : (a - expectedIndex) / denom;
    };

    const runSim = (seedOffset: number) => {
      // Deterministic PRNG for stable simulation
      let seed = 42 + seedOffset * 1000 + kClusters * 31;
      const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      const ariScores: number[] = [];

      for (let rep = 0; rep < bootstrapReps; rep++) {
        // Draw subsample indices
        const pool = Array.from({ length: n }, (_, i) => i);
        const subIndices: number[] = [];
        for (let s = 0; s < subN; s++) {
          const pick = Math.floor(random() * pool.length);
          subIndices.push(pool[pick]);
          pool.splice(pick, 1);
        }

        // Subsample distance matrix
        const subDist: number[][] = Array.from({ length: subN }, () => Array(subN).fill(0));
        for (let i = 0; i < subN; i++) {
          for (let j = i + 1; j < subN; j++) {
            const origD = distMatrix[subIndices[i]][subIndices[j]];
            subDist[i][j] = origD;
            subDist[j][i] = origD;
          }
        }

        // Perform clustering on subsample
        interface SubCluster {
          id: number;
          indices: number[];
        }
        let subClusters: SubCluster[] = subIndices.map((_, i) => ({ id: i, indices: [i] }));

        while (subClusters.length > kClusters) {
          let bDist = Infinity;
          let bA = 0;
          let bB = 1;
          for (let i = 0; i < subClusters.length; i++) {
            for (let j = i + 1; j < subClusters.length; j++) {
              let minD = Infinity;
              for (const u of subClusters[i].indices) {
                for (const v of subClusters[j].indices) {
                  minD = Math.min(minD, subDist[u][v]);
                }
              }
              if (minD < bDist) {
                bDist = minD;
                bA = i;
                bB = j;
              }
            }
          }
          const merged = [...subClusters[bA].indices, ...subClusters[bB].indices];
          const newC: SubCluster = { id: subClusters[bA].id, indices: merged };
          subClusters = subClusters.filter((_, idx) => idx !== bA && idx !== bB);
          subClusters.push(newC);
        }

        const subAssigned = new Array<number>(subN).fill(0);
        subClusters.forEach((c, cIdx) => {
          c.indices.forEach((ptIdx) => {
            subAssigned[ptIdx] = cIdx + 1;
          });
        });

        const restrictedRef = subIndices.map((origIdx) => refLabels[origIdx]);
        const score = calcARI(restrictedRef, subAssigned);
        ariScores.push(score);
      }

      const meanARI = ariScores.reduce((a, b) => a + b, 0) / ariScores.length;
      const stdARI = Math.sqrt(
        ariScores.reduce((a, b) => a + (b - meanARI) ** 2, 0) / ariScores.length,
      );

      return { ariScores, meanARI, stdARI };
    };

    return runSim(1);
  }, [bootstrapReps, subsampleRatio, n, clusterAssignments, distMatrix, kClusters]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatedPython = useMemo(() => {
    return `import numpy as np
import pandas as pd
from scipy.spatial.distance import pdist
from scipy.cluster.hierarchy import linkage, fcluster
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import adjusted_rand_score
import seaborn as sns
import matplotlib.pyplot as plt

# 1. Load Data
# Dataset: ${dataset.name}
data = [
${items.map((it) => `    {"label": "${it.label}", ${featureNames.map((f) => `"${f}": ${it.features[f]}`).join(", ")}}`).join(",\n")}
]
df = pd.DataFrame(data)
features = ${JSON.stringify(featureNames)}
X = df[features].values

# 2. Standardize Features (Z-scores)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 3. Fit Hierarchical Linkage (${linkageMethod.toUpperCase()})
Z = linkage(pdist(X_scaled, metric="euclidean"), method="${linkageMethod}")
df["cluster"] = fcluster(Z, t=${kClusters}, criterion="maxclust")

# 4. Multi-Feature Cluster Profiling
profile = df.groupby("cluster")[features].agg(["count", "mean", "median", "std"]).round(2)
print("--- Cluster Distribution Profiles ---")
print(profile)

# Standardized Centroid Z-Scores
z_centroids = (df.groupby("cluster")[features].mean() - df[features].mean()) / df[features].std()
print("\\n--- Standardized Centroid Z-Scores ---")
print(z_centroids.round(3))

# 5. Bootstrap Resampling Stability (B=${bootstrapReps}, Ratio=${subsampleRatio})
def test_stability(X, k=${kClusters}, reps=${bootstrapReps}, ratio=${subsampleRatio}):
    n = len(X)
    sub_size = int(ratio * n)
    Z_full = linkage(pdist(X), method="${linkageMethod}")
    ref_labels = fcluster(Z_full, t=k, criterion="maxclust")
    
    ari_list = []
    for _ in range(reps):
        sub_idx = np.random.choice(n, size=sub_size, replace=False)
        Z_sub = linkage(pdist(X[sub_idx]), method="${linkageMethod}")
        sub_labels = fcluster(Z_sub, t=k, criterion="maxclust")
        ari = adjusted_rand_score(ref_labels[sub_idx], sub_labels)
        ari_list.append(ari)
    return np.mean(ari_list), np.std(ari_list)

mean_ari, std_ari = test_stability(X_scaled)
print(f"\\nStability for k={kClusters}: Mean ARI = {mean_ari:.4f} (±{std_ari:.4f})")
`;
  }, [dataset, items, featureNames, linkageMethod, kClusters, bootstrapReps, subsampleRatio]);

  return (
    <div className="my-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Interactive Cluster Interpretation & Stability Studio
          </div>
          <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            Feature Profiling, Centroid Heatmaps & Resampling Stability
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Profile feature distributions, identify defining attributes via standardized z-scores,
            and test cluster reproducibility.
          </p>
        </div>

        <button
          onClick={() => {
            setDatasetKey("customer_rfm");
            setLinkageMethod("ward");
            setKClusters(3);
            setBootstrapReps(25);
            setSubsampleRatio(0.8);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Defaults
        </button>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Dataset Domain
          </label>
          <select
            value={datasetKey}
            onChange={(e) => setDatasetKey(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-violet-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {Object.entries(PROFILING_DATASETS).map(([key, d]) => (
              <option key={key} value={key}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Linkage Criterion
          </label>
          <select
            value={linkageMethod}
            onChange={(e) =>
              setLinkageMethod(e.target.value as "ward" | "average" | "complete" | "single")
            }
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-violet-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="ward">Ward's Minimum Variance</option>
            <option value="average">Average Linkage (UPGMA)</option>
            <option value="complete">Complete Linkage (Farthest)</option>
            <option value="single">Single Linkage (Nearest Neighbor)</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Cluster Count (k)</span>
            <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">
              k = {kClusters}
            </span>
          </div>
          <input
            type="range"
            min="2"
            max={Math.min(5, n - 1)}
            step="1"
            value={kClusters}
            onChange={(e) => setKClusters(parseInt(e.target.value, 10))}
            className="mt-2 w-full accent-violet-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Subsample Ratio</span>
            <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">
              {Math.round(subsampleRatio * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="0.9"
            step="0.05"
            value={subsampleRatio}
            onChange={(e) => setSubsampleRatio(parseFloat(e.target.value))}
            className="mt-2 w-full accent-violet-600"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("profiles")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "profiles"
              ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Cluster Distribution Profiles
        </button>
        <button
          onClick={() => setActiveTab("heatmap")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "heatmap"
              ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          Standardized Centroid Heatmap (Z-Scores)
        </button>
        <button
          onClick={() => setActiveTab("stability")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "stability"
              ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Bootstrap Resampling Stability (ARI)
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "code"
              ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          Python Profiling Pipeline
        </button>
      </div>

      {/* Profiles Tab */}
      {activeTab === "profiles" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusterProfiles.map((c) => (
              <div
                key={c.clusterId}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                style={{ borderTopWidth: "4px", borderTopColor: c.color }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm" style={{ color: c.color }}>
                    Cluster {c.clusterId}
                  </h4>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {c.memberCount} members ({Math.round((c.memberCount / n) * 100)}%)
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Cohort:</span>{" "}
                  {c.memberLabels.join(", ")}
                </div>

                <div className="mt-4 space-y-3">
                  {featureNames.map((f) => {
                    const feat = c.features[f];
                    const unit = dataset.featureUnits[f] || "";
                    const isEnriched = feat.zScore > 0.8;
                    const isSuppressed = feat.zScore < -0.8;

                    return (
                      <div key={f} className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
                            {f.replace("_", " ")}
                          </span>
                          <span
                            className={`font-mono font-bold text-[11px] ${
                              isEnriched
                                ? "text-amber-600 dark:text-amber-400"
                                : isSuppressed
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-slate-500"
                            }`}
                          >
                            z ={" "}
                            {feat.zScore > 0
                              ? `+${feat.zScore.toFixed(2)}`
                              : feat.zScore.toFixed(2)}
                          </span>
                        </div>

                        <div className="mt-1.5 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500">
                          <div>
                            Mean:{" "}
                            <span className="text-slate-800 dark:text-slate-200">
                              {feat.mean.toFixed(1)} {unit}
                            </span>
                          </div>
                          <div>
                            Median:{" "}
                            <span className="text-slate-800 dark:text-slate-200">
                              {feat.median.toFixed(1)} {unit}
                            </span>
                          </div>
                        </div>

                        {/* Visual indicator bar */}
                        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(100, Math.max(10, ((feat.zScore + 2.5) / 5) * 100))}%`,
                              backgroundColor: c.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heatmap Tab */}
      {activeTab === "heatmap" && (
        <div className="space-y-6">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Standardized Centroid Z-Score Matrix
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each cell displays the standardized z-score: z = (x̄_{`{kj}`} - μ_j) / σ_j. Red
              indicates strongly enriched attributes (z &gt; +0.5), while blue indicates suppressed
              attributes (z &lt; -0.5).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="p-3 text-left">Cluster Persona</th>
                  <th className="p-3">Cohort Size</th>
                  {featureNames.map((f) => (
                    <th key={f} className="p-3 uppercase tracking-wider">
                      {f.replace("_", " ")}
                    </th>
                  ))}
                  <th className="p-3">Dominant Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {clusterProfiles.map((c) => {
                  let maxFeat = featureNames[0];
                  let maxZ = -Infinity;
                  for (const f of featureNames) {
                    if (c.features[f].zScore > maxZ) {
                      maxZ = c.features[f].zScore;
                      maxFeat = f;
                    }
                  }

                  return (
                    <tr
                      key={c.clusterId}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                    >
                      <td className="p-3 text-left font-bold" style={{ color: c.color }}>
                        Cluster {c.clusterId}
                      </td>
                      <td className="p-3 font-mono">{c.memberCount}</td>
                      {featureNames.map((f) => {
                        const z = c.features[f].zScore;
                        let bgColor = "transparent";
                        let textColor = "inherit";

                        if (z > 0.8) {
                          bgColor = "rgba(239, 68, 68, 0.2)";
                          textColor = "#dc2626";
                        } else if (z > 0.3) {
                          bgColor = "rgba(245, 158, 11, 0.15)";
                          textColor = "#d97706";
                        } else if (z < -0.8) {
                          bgColor = "rgba(59, 130, 246, 0.2)";
                          textColor = "#2563eb";
                        } else if (z < -0.3) {
                          bgColor = "rgba(59, 130, 246, 0.1)";
                          textColor = "#3b82f6";
                        }

                        return (
                          <td
                            key={f}
                            className="p-3 font-mono font-bold"
                            style={{ backgroundColor: bgColor, color: textColor }}
                          >
                            {z > 0 ? `+${z.toFixed(2)}` : z.toFixed(2)}
                          </td>
                        );
                      })}
                      <td className="p-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        High {maxFeat.replace("_", " ")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stability Tab */}
      {activeTab === "stability" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Mean Bootstrap Stability
              </span>
              <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                ARI = {stabilityResult.meanARI.toFixed(4)}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Across {bootstrapReps} random subsamples
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Stability Variance
              </span>
              <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                ± {stabilityResult.stdARI.toFixed(4)}
              </div>
              <div className="mt-1 text-xs text-slate-500">Sample standard deviation</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Empirical Assessment
              </span>
              <div className="mt-2 text-lg font-bold">
                {stabilityResult.meanARI >= 0.85 ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" /> Highly Stable (Real Cohort)
                  </span>
                ) : stabilityResult.meanARI >= 0.7 ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-5 w-5" /> Moderate Stability
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="h-5 w-5" /> Unstable (Potential Noise)
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs text-slate-500">Ben-Hur et al. (2002) Criteria</div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Resampling Iteration Traces (Adjusted Rand Index)
            </h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {stabilityResult.ariScores.map((score, idx) => (
                <span
                  key={idx}
                  className={`rounded px-2 py-0.5 font-mono text-xs font-semibold ${
                    score >= 0.85
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : score >= 0.6
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                  }`}
                >
                  #{idx + 1}: {score.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Code Tab */}
      {activeTab === "code" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              End-to-End Production Profiling & Stability Pipeline
            </span>
            <button
              onClick={() => copyCode(generatedPython)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Script
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-200">
            {generatedPython}
          </pre>
        </div>
      )}
    </div>
  );
}

/** 4-Question Interactive Self-Assessment Quiz for Module 13 */
export function Module13Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const questions = [
    {
      id: 1,
      prompt:
        "When summarizing feature distributions within a cluster, why is relying exclusively on arithmetic means dangerous?",
      options: [
        "Means cannot be computed on continuous variables.",
        "A few extreme outliers or high distribution skewness can heavily pull the mean, obscuring typical cluster behavior.",
        "The arithmetic mean always equals the median in unsupervised clustering.",
        "Means are strictly forbidden by Scikit-learn pipelines.",
      ],
      correct: 1,
      explanation:
        "In skewed, heavy-tailed, or bimodal clusters (e.g. customer spending or web traffic), a small number of extreme values heavily distort the arithmetic mean. Complementing means with medians and interquartile ranges (IQR) provides a robust representation of typical cluster members.",
    },
    {
      id: 2,
      prompt:
        "Why is comparing raw cluster ID integers directly across bootstrap resampled runs mathematically invalid?",
      options: [
        "Cluster algorithms suffer from the label permutation problem, where cluster numbering is arbitrary in each run.",
        "Bootstrap samples always have zero overlap with the original dataset.",
        "Floating-point roundoff errors invert cluster labels.",
        "SciPy only supports integer labels up to 4.",
      ],
      correct: 0,
      explanation:
        "Unsupervised clustering algorithms assign arbitrary numerical labels (1, 2, 3...) upon each execution. A cohort labeled 'Cluster 1' in one run may be designated 'Cluster 3' in a subsequent subsample. Therefore, stability analysis must use label-invariant metrics such as Adjusted Rand Index (ARI) or Jaccard similarity.",
    },
    {
      id: 3,
      prompt:
        "Does a high Cophenetic Correlation Coefficient (e.g. CCC = 0.94) prove that a dataset contains distinct, well-separated clusters?",
      options: [
        "Yes, a high CCC mathematically guarantees high cluster silhouette scores.",
        "No, CCC only measures how faithfully the tree preserves original pairwise distances, which can be high even on uniformly distributed noise.",
        "Yes, provided Ward's linkage was used.",
        "No, CCC is only defined for categorical data.",
      ],
      correct: 1,
      explanation:
        "Cophenetic correlation measures tree representation fidelity (how well ultrametric cophenetic distances preserve pairwise Euclidean distances). Even continuous, uniformly distributed random data without any natural clusters can achieve high CCC under Average linkage because spatial distance gradients are faithfully mapped.",
    },
    {
      id: 4,
      prompt:
        "How do extreme outliers affect Ward's minimum variance linkage compared to Single linkage?",
      options: [
        "Ward's linkage ignores outliers completely, whereas Single linkage fails with an exception.",
        "Ward's linkage inflates within-cluster sum of squares, causing small clean clusters to merge prematurely while forcing the outlier into a cluster; Single linkage isolates outliers until the top.",
        "Ward's linkage is guaranteed to place all outliers into a special cluster labeled -1.",
        "Single linkage produces dendrogram inversions whenever an outlier is present.",
      ],
      correct: 1,
      explanation:
        "Because Ward's linkage minimizes the increase in total within-cluster variance (sum of squared errors), a remote outlier imposes a massive variance penalty. To minimize total variance growth, Ward's method may prematurely fuse natural, compact clusters elsewhere in the data while eventually forcing the outlier into a heterogeneous group. Single linkage, by contrast, naturally isolates outliers as singletons until the final merges.",
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
    <div className="my-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400">
            <HelpCircle className="h-4 w-4" />
            Knowledge Check
          </div>
          <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
            Module 13: Cluster Profiling & Stability Assessment
          </h3>
        </div>
        {showResults && (
          <div className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
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
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30"
            >
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {idx + 1}. {q.prompt}
              </p>

              <div className="mt-3 space-y-2">
                {q.options.map((opt, optIdx) => {
                  let btnStyle =
                    "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";

                  if (showResults) {
                    if (optIdx === q.correct) {
                      btnStyle =
                        "border-emerald-500 bg-emerald-50 text-emerald-800 font-medium dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700";
                    } else if (userAns === optIdx) {
                      btnStyle =
                        "border-rose-500 bg-rose-50 text-rose-800 font-medium dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700";
                    }
                  } else if (userAns === optIdx) {
                    btnStyle =
                      "border-violet-600 bg-violet-50 text-violet-800 font-medium dark:bg-violet-950/40 dark:text-violet-200 dark:border-violet-500";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={showResults}
                      className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-xs transition-all ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showResults && optIdx === q.correct && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div
                  className={`mt-3 rounded-md p-3 text-xs ${
                    isCorrect
                      ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                      : "bg-rose-50 text-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
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
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Retake Quiz
          </button>
        ) : (
          <button
            onClick={() => setShowResults(true)}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
}
