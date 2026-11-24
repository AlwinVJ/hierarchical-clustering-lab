import { useState, useMemo } from "react";
import {
  Scissors,
  RotateCcw,
  Sparkles,
  Layers,
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
  Zap,
} from "lucide-react";

interface SelPoint {
  id: number;
  label: string;
  x: number;
  y: number;
}

interface SelDataset {
  name: string;
  description: string;
  points: SelPoint[];
}

const DATASETS: Record<string, SelDataset> = {
  benchmark: {
    name: "Canonical 4-Point Benchmark (N=4)",
    description:
      "Four reference points P₁(1,2), P₂(2,3), P₃(6,5), P₄(7,6) demonstrating clear two-cluster separation and exact SciPy inconsistency values.",
    points: [
      { id: 0, label: "P₁", x: 1.0, y: 2.0 },
      { id: 1, label: "P₂", x: 2.0, y: 3.0 },
      { id: 2, label: "P₃", x: 6.0, y: 5.0 },
      { id: 3, label: "P₄", x: 7.0, y: 6.0 },
    ],
  },
  three_cohorts: {
    name: "Three Disjoint Cohorts (N=9)",
    description:
      "Nine points arranged in three distinct compact clusters (3 points each), illustrating multi-cluster merge gaps.",
    points: [
      { id: 0, label: "A₁", x: 1.0, y: 1.0 },
      { id: 1, label: "A₂", x: 1.5, y: 1.8 },
      { id: 2, label: "A₃", x: 2.0, y: 1.2 },
      { id: 3, label: "B₁", x: 7.5, y: 1.5 },
      { id: 4, label: "B₂", x: 8.0, y: 2.2 },
      { id: 5, label: "B₃", x: 8.5, y: 1.8 },
      { id: 6, label: "C₁", x: 4.5, y: 7.5 },
      { id: 7, label: "C₂", x: 5.0, y: 8.2 },
      { id: 8, label: "C₃", x: 5.5, y: 7.8 },
    ],
  },
  outlier: {
    name: "Cluster with Distant Outlier (N=6)",
    description:
      "Five tightly packed core observations with one remote anomaly, showing how merge-height jumps isolate outliers.",
    points: [
      { id: 0, label: "P₁", x: 2.0, y: 2.0 },
      { id: 1, label: "P₂", x: 2.4, y: 2.5 },
      { id: 2, label: "P₃", x: 2.2, y: 3.0 },
      { id: 3, label: "P₄", x: 3.0, y: 2.2 },
      { id: 4, label: "P₅", x: 2.8, y: 2.8 },
      { id: 5, label: "Outlier", x: 9.0, y: 8.5 },
    ],
  },
  nested: {
    name: "Hierarchically Nested Groups (N=8)",
    description:
      "Sub-groups nested inside larger macro structures, showing how cutting height selects macro vs micro granularity.",
    points: [
      { id: 0, label: "N₁", x: 1.0, y: 2.0 },
      { id: 1, label: "N₂", x: 1.5, y: 2.2 },
      { id: 2, label: "N₃", x: 2.8, y: 2.0 },
      { id: 3, label: "N₄", x: 3.2, y: 2.4 },
      { id: 4, label: "M₁", x: 7.0, y: 6.0 },
      { id: 5, label: "M₂", x: 7.4, y: 6.2 },
      { id: 6, label: "M₃", x: 8.8, y: 6.1 },
      { id: 7, label: "M₄", x: 9.2, y: 6.3 },
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
  "#6366f1", // Indigo
  "#e11d48", // Rose
];

interface MergeStep {
  step: number;
  clusterA: number;
  clusterB: number;
  height: number;
  size: number;
  points: number[];
}

interface InconsistentRow {
  step: number;
  meanHeight: number;
  stdDev: number;
  linkCount: number;
  inconsistencyCoeff: number;
}

interface TreeNode {
  id: number;
  isLeaf: boolean;
  pointId?: number;
  left?: TreeNode;
  right?: TreeNode;
  height: number;
  points: number[];
  x: number;
  y: number;
}

export function DendrogramCuttingLab() {
  const [datasetKey, setDatasetKey] = useState<string>("benchmark");
  const [linkageMethod, setLinkageMethod] = useState<"single" | "complete" | "average" | "ward">(
    "ward",
  );
  const [cutMode, setCutMode] = useState<"distance" | "maxclust">("distance");
  const [targetK, setTargetK] = useState<number>(2);
  const [thresholdHeight, setThresholdHeight] = useState<number>(3.0);
  const [inconsistencyDepth, setInconsistencyDepth] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<
    "dendrogram" | "gaps" | "inconsistent" | "sweep" | "code"
  >("dendrogram");
  const [copied, setCopied] = useState<boolean>(false);

  const dataset = DATASETS[datasetKey] || DATASETS.benchmark;
  const points = dataset.points;
  const n = points.length;

  // Pairwise Euclidean distance
  const distMatrix = useMemo(() => {
    const mat: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        mat[i][j] = d;
        mat[j][i] = d;
      }
    }
    return mat;
  }, [points, n]);

  // Hierarchical agglomeration simulation
  const { mergeSteps, treeRoot, maxTreeHeight } = useMemo(() => {
    interface ActiveCluster {
      id: number;
      pointIndices: number[];
      node: TreeNode;
    }

    const clusters: (ActiveCluster | null)[] = points.map((p, i) => ({
      id: i,
      pointIndices: [i],
      node: {
        id: i,
        isLeaf: true,
        pointId: i,
        height: 0,
        points: [i],
        x: 0,
        y: 0,
      },
    }));

    const calcClusterDist = (c1: ActiveCluster, c2: ActiveCluster): number => {
      if (linkageMethod === "single") {
        let minD = Infinity;
        for (const i of c1.pointIndices) {
          for (const j of c2.pointIndices) {
            minD = Math.min(minD, distMatrix[i][j]);
          }
        }
        return minD;
      } else if (linkageMethod === "complete") {
        let maxD = 0;
        for (const i of c1.pointIndices) {
          for (const j of c2.pointIndices) {
            maxD = Math.max(maxD, distMatrix[i][j]);
          }
        }
        return maxD;
      } else if (linkageMethod === "average") {
        let sumD = 0;
        for (const i of c1.pointIndices) {
          for (const j of c2.pointIndices) {
            sumD += distMatrix[i][j];
          }
        }
        return sumD / (c1.pointIndices.length * c2.pointIndices.length);
      } else {
        // Ward's linkage
        const n1 = c1.pointIndices.length;
        const n2 = c2.pointIndices.length;
        let c1x = 0,
          c1y = 0;
        for (const i of c1.pointIndices) {
          c1x += points[i].x;
          c1y += points[i].y;
        }
        c1x /= n1;
        c1y /= n1;

        let c2x = 0,
          c2y = 0;
        for (const j of c2.pointIndices) {
          c2x += points[j].x;
          c2y += points[j].y;
        }
        c2x /= n2;
        c2y /= n2;

        const centroidDistSq = (c1x - c2x) ** 2 + (c1y - c2y) ** 2;
        return Math.sqrt(((2 * n1 * n2) / (n1 + n2)) * centroidDistSq);
      }
    };

    const steps: MergeStep[] = [];
    let nextClusterId = n;

    for (let s = 0; s < n - 1; s++) {
      let bestDist = Infinity;
      let bestA = -1;
      let bestB = -1;

      for (let i = 0; i < clusters.length; i++) {
        const cA = clusters[i];
        if (!cA) continue;
        for (let j = i + 1; j < clusters.length; j++) {
          const cB = clusters[j];
          if (!cB) continue;
          const d = calcClusterDist(cA, cB);
          if (d < bestDist) {
            bestDist = d;
            bestA = i;
            bestB = j;
          }
        }
      }

      if (bestA === -1 || bestB === -1) break;

      const cA = clusters[bestA]!;
      const cB = clusters[bestB]!;
      const mergedPoints = [...cA.pointIndices, ...cB.pointIndices];

      const newNode: TreeNode = {
        id: nextClusterId,
        isLeaf: false,
        left: cA.node,
        right: cB.node,
        height: bestDist,
        points: mergedPoints,
        x: 0,
        y: 0,
      };

      steps.push({
        step: s,
        clusterA: cA.id,
        clusterB: cB.id,
        height: bestDist,
        size: mergedPoints.length,
        points: mergedPoints,
      });

      clusters[bestA] = {
        id: nextClusterId,
        pointIndices: mergedPoints,
        node: newNode,
      };
      clusters[bestB] = null;
      nextClusterId++;
    }

    const finalCluster = clusters.find((c) => c !== null);
    const root = finalCluster ? finalCluster.node : null;
    const maxHeight = steps.length > 0 ? steps[steps.length - 1].height : 1;

    return { mergeSteps: steps, treeRoot: root, maxTreeHeight: maxHeight };
  }, [points, n, distMatrix, linkageMethod]);

  // Compute layout coordinates for SVG Dendrogram
  const dendrogramLayout = useMemo(() => {
    if (!treeRoot) return { rootNode: null, leaves: [] };

    let leafOrder = 0;
    const leavesList: { id: number; pointId: number; x: number }[] = [];

    const assignLeafCoords = (node: TreeNode) => {
      if (node.isLeaf && node.pointId !== undefined) {
        node.x = leafOrder * 80 + 50;
        leavesList.push({ id: node.id, pointId: node.pointId, x: node.x });
        leafOrder++;
        return;
      }
      if (node.left) assignLeafCoords(node.left);
      if (node.right) assignLeafCoords(node.right);
      if (node.left && node.right) {
        node.x = (node.left.x + node.right.x) / 2;
      }
    };

    assignLeafCoords(treeRoot);

    return { rootNode: treeRoot, leaves: leavesList };
  }, [treeRoot]);

  // Calculate SciPy Inconsistency Matrix for each merge step
  const inconsistencyMatrix = useMemo(() => {
    if (mergeSteps.length === 0) return [];

    // Map clusterId -> step index (for non-leaves)
    const stepMap = new Map<number, number>();
    mergeSteps.forEach((m) => {
      stepMap.set(n + m.step, m.step);
    });

    const rows: InconsistentRow[] = [];

    // For each merge step, find sub-tree links up to depth d
    for (let s = 0; s < mergeSteps.length; s++) {
      const stepHeights: number[] = [];

      const collectHeights = (clusterId: number, currentDepth: number) => {
        if (currentDepth > inconsistencyDepth) return;
        if (clusterId < n) return; // leaf node has no merge link

        const stepIdx = stepMap.get(clusterId);
        if (stepIdx === undefined) return;

        const merge = mergeSteps[stepIdx];
        stepHeights.push(merge.height);

        collectHeights(merge.clusterA, currentDepth + 1);
        collectHeights(merge.clusterB, currentDepth + 1);
      };

      collectHeights(n + s, 1);

      const m = stepHeights.length;
      const mean = stepHeights.reduce((acc, v) => acc + v, 0) / m;
      let std = 0;
      if (m > 1) {
        const sumSq = stepHeights.reduce((acc, v) => acc + (v - mean) ** 2, 0);
        std = Math.sqrt(sumSq / (m - 1));
      }

      const currentHeight = mergeSteps[s].height;
      const coeff = std > 1e-7 ? (currentHeight - mean) / std : 0.0;

      rows.push({
        step: s,
        meanHeight: mean,
        stdDev: std,
        linkCount: m,
        inconsistencyCoeff: coeff,
      });
    }

    return rows;
  }, [mergeSteps, n, inconsistencyDepth]);

  // Calculate cluster labels based on cut mode (distance vs maxclust)
  const { activeCutHeight, activeK, clusterAssignments, clustersList } = useMemo(() => {
    let effectiveCut = thresholdHeight;
    let computedK = targetK;

    if (cutMode === "maxclust") {
      computedK = Math.max(1, Math.min(n, targetK));
      if (computedK === 1) {
        effectiveCut = maxTreeHeight * 1.05;
      } else if (computedK >= n) {
        effectiveCut = 0.0;
      } else {
        // Severs (computedK - 1) highest merges
        // The cut height sits right between mergeSteps[n - computedK] and mergeSteps[n - computedK - 1]
        const idx = n - computedK;
        if (idx >= 0 && idx < mergeSteps.length) {
          const cutH = mergeSteps[idx].height;
          const prevH = idx > 0 ? mergeSteps[idx - 1].height : 0;
          effectiveCut = (cutH + prevH) / 2;
        }
      }
    }

    // Cut the tree at effectiveCut
    // Any node with height <= effectiveCut whose parent height > effectiveCut forms a cluster
    const clusterLabels = new Array<number>(n).fill(0);
    const clusters: { id: number; points: number[]; color: string }[] = [];

    if (!treeRoot) {
      return {
        activeCutHeight: effectiveCut,
        activeK: n,
        clusterAssignments: clusterLabels,
        clustersList: [],
      };
    }

    let clusterCount = 0;
    const traverseCut = (node: TreeNode) => {
      if (node.height <= effectiveCut) {
        // Entire subtree is a cluster
        const col = PALETTE[clusterCount % PALETTE.length];
        clusters.push({
          id: clusterCount + 1,
          points: node.points,
          color: col,
        });
        node.points.forEach((pIdx) => {
          clusterLabels[pIdx] = clusterCount + 1;
        });
        clusterCount++;
        return;
      }

      if (node.left) traverseCut(node.left);
      if (node.right) traverseCut(node.right);
    };

    traverseCut(treeRoot);

    return {
      activeCutHeight: effectiveCut,
      activeK: clusters.length,
      clusterAssignments: clusterLabels,
      clustersList: clusters,
    };
  }, [cutMode, thresholdHeight, targetK, n, maxTreeHeight, mergeSteps, treeRoot]);

  // Merge height gaps and largest jump
  const mergeGaps = useMemo(() => {
    return mergeSteps.map((m, idx) => {
      const prev = idx > 0 ? mergeSteps[idx - 1].height : 0;
      const gap = m.height - prev;
      return {
        step: idx,
        height: m.height,
        gap: idx > 0 ? gap : m.height,
        clustersRemaining: n - idx,
      };
    });
  }, [mergeSteps, n]);

  const maxGapStep = useMemo(() => {
    if (mergeGaps.length <= 1) return null;
    let maxGap = -1;
    let best = mergeGaps[1];
    for (let i = 1; i < mergeGaps.length; i++) {
      if (mergeGaps[i].gap > maxGap) {
        maxGap = mergeGaps[i].gap;
        best = mergeGaps[i];
      }
    }
    return best;
  }, [mergeGaps]);

  // Silhouette sweep across k in [2, n-1]
  const sweepData = useMemo(() => {
    if (n < 3) return [];

    const results = [];
    for (let k = 2; k <= Math.min(n - 1, 6); k++) {
      // Extract partition for this k
      const idx = n - k;
      const cutH =
        idx >= 0 && idx < mergeSteps.length
          ? (mergeSteps[idx].height + (idx > 0 ? mergeSteps[idx - 1].height : 0)) / 2
          : 0;

      const labels = new Array<number>(n).fill(0);
      let cId = 1;
      const cutSub = (node: TreeNode) => {
        if (node.height <= cutH) {
          node.points.forEach((p) => {
            labels[p] = cId;
          });
          cId++;
          return;
        }
        if (node.left) cutSub(node.left);
        if (node.right) cutSub(node.right);
      };
      if (treeRoot) cutSub(treeRoot);

      // Compute Silhouette
      let sumSil = 0;
      for (let i = 0; i < n; i++) {
        const myLabel = labels[i];
        let aSum = 0;
        let aCount = 0;
        const bSums: Record<number, { sum: number; count: number }> = {};

        for (let j = 0; j < n; j++) {
          if (i === j) continue;
          const otherLabel = labels[j];
          const d = distMatrix[i][j];
          if (otherLabel === myLabel) {
            aSum += d;
            aCount++;
          } else {
            if (!bSums[otherLabel]) bSums[otherLabel] = { sum: 0, count: 0 };
            bSums[otherLabel].sum += d;
            bSums[otherLabel].count++;
          }
        }

        const a_i = aCount > 0 ? aSum / aCount : 0;
        let b_i = Infinity;
        for (const oLab in bSums) {
          const avgDist = bSums[oLab].sum / bSums[oLab].count;
          if (avgDist < b_i) b_i = avgDist;
        }
        if (b_i === Infinity) b_i = 0;

        const max_ab = Math.max(a_i, b_i);
        const s_i = max_ab === 0 ? 0 : (b_i - a_i) / max_ab;
        sumSil += s_i;
      }

      results.push({
        k,
        silhouette: sumSil / n,
      });
    }

    return results;
  }, [n, mergeSteps, distMatrix, treeRoot]);

  const bestK = useMemo(() => {
    if (sweepData.length === 0) return 2;
    let best = sweepData[0];
    for (const d of sweepData) {
      if (d.silhouette > best.silhouette) best = d;
    }
    return best.k;
  }, [sweepData]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatedPython = useMemo(() => {
    const pts = points.map((p) => `    [${p.x}, ${p.y}]`).join(",\n");
    return `import numpy as np
import pandas as pd
from scipy.spatial.distance import pdist
from scipy.cluster.hierarchy import linkage, fcluster, inconsistent, dendrogram
import matplotlib.pyplot as plt

# 1. Dataset Configuration (${dataset.name})
X = np.array([
${pts}
])

# 2. Fit Hierarchical Linkage (${linkageMethod.toUpperCase()})
Z = linkage(pdist(X, metric='euclidean'), method='${linkageMethod}')

# 3. Inconsistency Diagnostics (Depth d=${inconsistencyDepth})
inconsistency_table = inconsistent(Z, d=${inconsistencyDepth})
df_inc = pd.DataFrame(inconsistency_table, columns=['mean_height', 'std_dev', 'link_count', 'inconsistency_coeff'])
print("--- SciPy Inconsistency Matrix ---")
print(df_inc.round(4))

# 4. Dendrogram Slicing
${
  cutMode === "distance"
    ? `# Distance threshold slicing at height t = ${thresholdHeight.toFixed(4)}
cluster_labels = fcluster(Z, t=${thresholdHeight.toFixed(4)}, criterion='distance')
print(f"\\nCluster assignments (t=${thresholdHeight.toFixed(2)}):", cluster_labels)`
    : `# Exact cluster count extraction for k = ${activeK}
cluster_labels = fcluster(Z, t=${activeK}, criterion='maxclust')
print(f"\\nCluster assignments (k=${activeK}):", cluster_labels)`
}
print(f"Total extracted clusters: {len(np.unique(cluster_labels))}")
`;
  }, [dataset.name, points, linkageMethod, inconsistencyDepth, cutMode, thresholdHeight, activeK]);

  return (
    <div className="my-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
            <Scissors className="h-3.5 w-3.5" />
            Interactive Dendrogram Cutting & Selection Lab
          </div>
          <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            Hierarchical Cluster Extraction & Inconsistency Studio
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Slice dendrograms dynamically, analyze merge-height gaps, and inspect SciPy
            inconsistency coefficients.
          </p>
        </div>

        <button
          onClick={() => {
            setDatasetKey("benchmark");
            setLinkageMethod("ward");
            setCutMode("distance");
            setThresholdHeight(3.0);
            setTargetK(2);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Defaults
        </button>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Dataset Preset
          </label>
          <select
            value={datasetKey}
            onChange={(e) => setDatasetKey(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-violet-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {Object.entries(DATASETS).map(([key, d]) => (
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
              setLinkageMethod(e.target.value as "single" | "complete" | "average" | "ward")
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
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Slicing Paradigm
          </label>
          <div className="mt-1.5 flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/80">
            <button
              onClick={() => setCutMode("distance")}
              className={`flex-1 rounded-md py-1 text-xs font-semibold transition-all ${
                cutMode === "distance"
                  ? "bg-white text-violet-700 shadow-xs dark:bg-slate-900 dark:text-violet-300"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              Height (t)
            </button>
            <button
              onClick={() => setCutMode("maxclust")}
              className={`flex-1 rounded-md py-1 text-xs font-semibold transition-all ${
                cutMode === "maxclust"
                  ? "bg-white text-violet-700 shadow-xs dark:bg-slate-900 dark:text-violet-300"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              Count (k)
            </button>
          </div>
        </div>

        <div>
          {cutMode === "distance" ? (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Cut Height (t)</span>
                <span className="font-mono text-violet-600 dark:text-violet-400">
                  {thresholdHeight.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max={(maxTreeHeight * 1.15).toFixed(2)}
                step="0.05"
                value={thresholdHeight}
                onChange={(e) => setThresholdHeight(parseFloat(e.target.value))}
                className="mt-2 w-full accent-violet-600"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Target Clusters (k)</span>
                <span className="font-mono text-violet-600 dark:text-violet-400">
                  k = {targetK}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max={n}
                step="1"
                value={targetK}
                onChange={(e) => setTargetK(parseInt(e.target.value, 10))}
                className="mt-2 w-full accent-violet-600"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("dendrogram")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "dendrogram"
              ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Scissors className="h-3.5 w-3.5" />
          Interactive Dendrogram Slicing
        </button>
        <button
          onClick={() => setActiveTab("gaps")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "gaps"
              ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Merge-Height Gaps (Δh)
        </button>
        <button
          onClick={() => setActiveTab("inconsistent")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "inconsistent"
              ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          Inconsistency Matrix (SciPy)
        </button>
        <button
          onClick={() => setActiveTab("sweep")}
          className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-all ${
            activeTab === "sweep"
              ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Silhouette Sweep Curve
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
          Python Code Generator
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === "dendrogram" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SVG Dendrogram */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Dendrogram Tree with Dynamic Cutting Line
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  Cut Height: {activeCutHeight.toFixed(2)} → {activeK} Clusters
                </span>
              </div>

              {/* Responsive SVG */}
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox={`0 0 ${Math.max(450, n * 80 + 80)} 320`}
                  className="w-full h-72 text-xs select-none"
                >
                  {/* Grid Lines */}
                  {[0.25, 0.5, 0.75, 1.0].map((frac) => {
                    const h = maxTreeHeight * frac;
                    const y = 260 - (h / (maxTreeHeight * 1.15)) * 220;
                    return (
                      <g key={frac}>
                        <line
                          x1="35"
                          y1={y}
                          x2={n * 80 + 50}
                          y2={y}
                          stroke="#cbd5e1"
                          strokeDasharray="2,3"
                          strokeWidth="1"
                          className="dark:stroke-slate-800"
                        />
                        <text
                          x="30"
                          y={y + 3}
                          textAnchor="end"
                          className="fill-slate-400 text-[9px] font-mono"
                        >
                          {h.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Render Tree Links */}
                  {(() => {
                    if (!dendrogramLayout.rootNode) return null;
                    const links: React.ReactNode[] = [];

                    const renderBranches = (node: TreeNode) => {
                      if (node.isLeaf) return;
                      const left = node.left;
                      const right = node.right;
                      if (!left || !right) return;

                      const nodeY = 260 - (node.height / (maxTreeHeight * 1.15)) * 220;
                      const leftY = 260 - (left.height / (maxTreeHeight * 1.15)) * 220;
                      const rightY = 260 - (right.height / (maxTreeHeight * 1.15)) * 220;

                      const isBelowCut = node.height <= activeCutHeight;
                      const clusterId = isBelowCut ? clusterAssignments[node.points[0]] : undefined;
                      const strokeColor =
                        isBelowCut && clusterId !== undefined
                          ? PALETTE[(clusterId - 1) % PALETTE.length]
                          : "#64748b";

                      // Left vertical line
                      links.push(
                        <line
                          key={`lv-${node.id}-${left.id}`}
                          x1={left.x}
                          y1={leftY}
                          x2={left.x}
                          y2={nodeY}
                          stroke={
                            left.height <= activeCutHeight
                              ? PALETTE[(clusterAssignments[left.points[0]] - 1) % PALETTE.length]
                              : "#94a3b8"
                          }
                          strokeWidth="2"
                        />,
                      );

                      // Right vertical line
                      links.push(
                        <line
                          key={`rv-${node.id}-${right.id}`}
                          x1={right.x}
                          y1={rightY}
                          x2={right.x}
                          y2={nodeY}
                          stroke={
                            right.height <= activeCutHeight
                              ? PALETTE[(clusterAssignments[right.points[0]] - 1) % PALETTE.length]
                              : "#94a3b8"
                          }
                          strokeWidth="2"
                        />,
                      );

                      // Horizontal crossbar
                      links.push(
                        <line
                          key={`h-${node.id}`}
                          x1={left.x}
                          y1={nodeY}
                          x2={right.x}
                          y2={nodeY}
                          stroke={strokeColor}
                          strokeWidth="2.5"
                        />,
                      );

                      // Merge node badge
                      links.push(
                        <circle
                          key={`circ-${node.id}`}
                          cx={node.x}
                          cy={nodeY}
                          r="3"
                          fill={strokeColor}
                        />,
                      );

                      renderBranches(left);
                      renderBranches(right);
                    };

                    renderBranches(dendrogramLayout.rootNode);
                    return links;
                  })()}

                  {/* Cut Line */}
                  {(() => {
                    const cutY = 260 - (activeCutHeight / (maxTreeHeight * 1.15)) * 220;
                    return (
                      <g>
                        <line
                          x1="35"
                          y1={cutY}
                          x2={n * 80 + 50}
                          y2={cutY}
                          stroke="#e11d48"
                          strokeWidth="2"
                          strokeDasharray="4,4"
                        />
                        <rect
                          x={n * 80 + 10}
                          y={cutY - 9}
                          width="42"
                          height="18"
                          rx="3"
                          fill="#e11d48"
                        />
                        <text
                          x={n * 80 + 31}
                          y={cutY + 3}
                          textAnchor="middle"
                          fill="#ffffff"
                          className="text-[9px] font-bold font-mono"
                        >
                          t={activeCutHeight.toFixed(1)}
                        </text>
                      </g>
                    );
                  })()}

                  {/* Leaf labels */}
                  {dendrogramLayout.leaves.map((leaf) => {
                    const p = points[leaf.pointId];
                    const cId = clusterAssignments[leaf.pointId];
                    const color = PALETTE[(cId - 1) % PALETTE.length];
                    return (
                      <g key={leaf.id}>
                        <circle cx={leaf.x} cy="260" r="4" fill={color} />
                        <text
                          x={leaf.x}
                          y="278"
                          textAnchor="middle"
                          className="font-bold fill-slate-700 dark:fill-slate-200 text-[10px]"
                        >
                          {p.label}
                        </text>
                        <text
                          x={leaf.x}
                          y="292"
                          textAnchor="middle"
                          className="fill-slate-400 text-[8px] font-mono"
                        >
                          ({p.x}, {p.y})
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Extracted Clusters Summary Card */}
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Extracted Clusters</span>
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700 font-semibold dark:bg-violet-950 dark:text-violet-300">
                    k = {activeK}
                  </span>
                </h4>

                <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {clustersList.map((c) => {
                    const cPts = c.points.map((idx) => points[idx]);
                    const avgX = cPts.reduce((acc, p) => acc + p.x, 0) / cPts.length;
                    const avgY = cPts.reduce((acc, p) => acc + p.y, 0) / cPts.length;

                    return (
                      <div
                        key={c.id}
                        className="rounded-lg border border-slate-100 p-2.5 text-xs dark:border-slate-800"
                        style={{ borderLeftWidth: "4px", borderLeftColor: c.color }}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span style={{ color: c.color }}>Cluster {c.id}</span>
                          <span className="text-slate-400 text-[11px]">
                            {cPts.length} point{cPts.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="mt-1 text-slate-600 dark:text-slate-300">
                          Members: {cPts.map((p) => p.label).join(", ")}
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                          Centroid: ({avgX.toFixed(2)}, {avgY.toFixed(2)})
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selection Rule Advice */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Zap className="h-4 w-4 text-amber-600" />
                  Slicing Insight
                </div>
                {activeK === 1 && (
                  <p>
                    Threshold is too high (t ≥ {maxTreeHeight.toFixed(2)}). All observations have
                    merged into a single monolithic cluster.
                  </p>
                )}
                {activeK === n && (
                  <p>
                    Threshold is too low (t &lt; {mergeSteps[0]?.height.toFixed(2)}). Every
                    observation remains an isolated singleton.
                  </p>
                )}
                {activeK > 1 && activeK < n && (
                  <p>
                    Current slice partitions the data into {activeK} clusters. Cutting below long
                    vertical branches ensures high cluster stability.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Merge-Height Gaps Tab */}
      {activeTab === "gaps" && (
        <div className="space-y-6">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Merge-Distance Gap Analysis (Heuristic Jump Detection)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              An abrupt leap in merge distance (Δh_k = h_k - h_{`{k-1}`}) indicates that compact
              sub-clusters have coalesced and the algorithm is now forced to bridge separated
              cohorts.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="p-3">Merge Step</th>
                  <th className="p-3">Merged Components</th>
                  <th className="p-3">Merge Height (h)</th>
                  <th className="p-3">Height Jump (Δh)</th>
                  <th className="p-3">Resulting Clusters (k)</th>
                  <th className="p-3">Heuristic Diagnostic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mergeGaps.map((g) => {
                  const isMaxGap = maxGapStep && g.step === maxGapStep.step;
                  const m = mergeSteps[g.step];
                  const cALabel =
                    m.clusterA < n ? points[m.clusterA].label : `Cluster(${m.clusterA})`;
                  const cBLabel =
                    m.clusterB < n ? points[m.clusterB].label : `Cluster(${m.clusterB})`;

                  return (
                    <tr
                      key={g.step}
                      className={
                        isMaxGap
                          ? "bg-amber-50/70 font-medium dark:bg-amber-950/30"
                          : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                      }
                    >
                      <td className="p-3 font-mono">Step {g.step + 1}</td>
                      <td className="p-3">
                        {cALabel} + {cBLabel}
                      </td>
                      <td className="p-3 font-mono">{g.height.toFixed(4)}</td>
                      <td className="p-3 font-mono font-bold text-violet-700 dark:text-violet-300">
                        +{g.gap.toFixed(4)}
                      </td>
                      <td className="p-3 font-bold">k = {g.clustersRemaining}</td>
                      <td className="p-3">
                        {isMaxGap ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 font-semibold">
                            <Sparkles className="h-3.5 w-3.5" />
                            Largest Gap Jump! Cut here for k = {g.clustersRemaining}
                          </span>
                        ) : (
                          <span className="text-slate-400">Normal progression</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inconsistency Matrix Tab */}
      {activeTab === "inconsistent" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                SciPy Inconsistency Matrix (
                <code className="text-violet-600">sch.inconsistent(Z, d)</code>)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Measures whether a merge height significantly deviates from the average height of
                predecessor links in its subtree.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                Subtree Depth (d):
              </span>
              <select
                value={inconsistencyDepth}
                onChange={(e) => setInconsistencyDepth(parseInt(e.target.value, 10))}
                className="rounded border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-700"
              >
                <option value="1">d = 1 (Immediate merge)</option>
                <option value="2">d = 2 (Standard default)</option>
                <option value="3">d = 3 (Extended depth)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="p-3">Merge Step</th>
                  <th className="p-3">Height (h)</th>
                  <th className="p-3">Mean Height (h̄)</th>
                  <th className="p-3">Sample Std Dev (s)</th>
                  <th className="p-3">Links in Subtree</th>
                  <th className="p-3">Inconsistency Coeff (I)</th>
                  <th className="p-3">Anomaly Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {inconsistencyMatrix.map((row) => {
                  const isHigh = row.inconsistencyCoeff >= 1.0;
                  return (
                    <tr
                      key={row.step}
                      className={
                        isHigh
                          ? "bg-rose-50/70 font-medium dark:bg-rose-950/30"
                          : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                      }
                    >
                      <td className="p-3 font-mono">Row {row.step}</td>
                      <td className="p-3 font-mono">{mergeSteps[row.step]?.height.toFixed(4)}</td>
                      <td className="p-3 font-mono">{row.meanHeight.toFixed(4)}</td>
                      <td className="p-3 font-mono">{row.stdDev.toFixed(4)}</td>
                      <td className="p-3">{row.linkCount}</td>
                      <td className="p-3 font-mono font-bold text-violet-700 dark:text-violet-300">
                        {row.inconsistencyCoeff.toFixed(4)}
                      </td>
                      <td className="p-3">
                        {isHigh ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                            <AlertTriangle className="h-3 w-3" /> Inconsistent (I ≥ 1.0)
                          </span>
                        ) : (
                          <span className="text-slate-400">Homogeneous (I &lt; 1.0)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Silhouette Sweep Tab */}
      {activeTab === "sweep" && (
        <div className="space-y-6">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Multi-Cluster Silhouette Optimization Sweep
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated sweep across candidate cluster counts k ∈ [2, {Math.min(n - 1, 6)}] to
              identify the peak mean silhouette score.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sweepData.map((d) => {
              const isBest = d.k === bestK;
              const isCurrent = d.k === activeK;
              return (
                <div
                  key={d.k}
                  className={`rounded-xl border p-4 transition-all ${
                    isBest
                      ? "border-violet-500 bg-violet-50/50 shadow-xs dark:border-violet-600 dark:bg-violet-950/20"
                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-slate-500">
                      k = {d.k} Clusters
                    </span>
                    {isBest && (
                      <span className="rounded bg-violet-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        PEAK
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                    {d.silhouette.toFixed(4)}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Mean Silhouette (s̄)</span>
                    {isCurrent && (
                      <span className="text-violet-600 dark:text-violet-400 font-semibold">
                        (Active Cut)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Code Tab */}
      {activeTab === "code" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Production Python Implementation (SciPy & Scikit-learn)
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

/** 4-Question Interactive Self-Assessment Quiz for Module 12 */
export function Module12Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const questions = [
    {
      id: 1,
      prompt:
        "When inspecting a dendrogram to select an optimal cluster cut height, what does an exceptionally tall vertical stem indicate?",
      options: [
        "The algorithm suffered a severe numerical inversion and violated monotonicity.",
        "The cluster solution remains stable and invariant across a wide range of dissimilarity threshold values.",
        "The observations in the subtree are high-dimensional outliers and must be removed.",
        "The linkage criterion was forced to switch between Single and Ward linkage.",
      ],
      correct: 1,
      explanation:
        "A tall vertical stem signifies a large cophenetic merge distance gap (Δh) between successive merges. Because no intermediate coalescences occur within that distance window, cutting along that vertical stem produces a cluster partition that is stable across a wide range of height thresholds.",
    },
    {
      id: 2,
      prompt:
        "In SciPy's inconsistent() function, what happens when a merge link's inconsistency coefficient exceeds 1.0 (with d=2)?",
      options: [
        "The merge height is significantly larger than the average height of immediate predecessor merges in its subtree.",
        "The linkage distance matrix has become negative.",
        "The dataset has more clusters than observations.",
        "The sample standard deviation s of the subtree merge heights was exactly zero.",
      ],
      correct: 0,
      explanation:
        "The inconsistency coefficient is defined as I_j = (h_j - h̄_j) / s_j. A value exceeding 1.0 indicates that the current merge height h_j is more than one standard deviation higher than the mean merge height h̄_j of the predecessor links in its subtree, signaling that distinct clusters are being merged.",
    },
    {
      id: 3,
      prompt:
        "Why is selecting the number of clusters k solely based on maximum Silhouette score sometimes dangerous in real-world business applications?",
      options: [
        "Silhouette scores can only be computed when ground truth labels are known.",
        "Silhouette often peaks at k=2 by splitting the dataset into one giant clump and one small outlier group, which may lack operational business utility.",
        "Silhouette values are always negative for spherical clusters.",
        "Silhouette is strictly invariant to label permutations and therefore cannot distinguish between clusters.",
      ],
      correct: 1,
      explanation:
        "A well-known vulnerability of the Silhouette heuristic is its tendency to produce a global maximum at k=2 when an extreme outlier exists or when the data forms a continuous manifold. While mathematically optimal under the silhouette formula, such a split often fails to provide actionable business segments, underscoring the need for multi-criterion validation and cardinality checks.",
    },
    {
      id: 4,
      prompt:
        "How does cutting a dendrogram via criterion='maxclust' in SciPy (fcluster) determine which merges to sever when forming k clusters?",
      options: [
        "It randomly removes merges until k leaves are disconnected.",
        "It severs the (k - 1) merges with the highest cophenetic merge heights.",
        "It slices the tree at height t = k without inspecting the linkage matrix.",
        "It recalculates the K-Means objective function on the original feature space.",
      ],
      correct: 1,
      explanation:
        "When slicing via criterion='maxclust' for target count k, SciPy traverses the linkage matrix from the root downward and severs the k - 1 highest merges in the tree, leaving exactly k disjoint connected subtrees.",
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
            Module 12: Cluster Selection & Inconsistency Assessment
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
