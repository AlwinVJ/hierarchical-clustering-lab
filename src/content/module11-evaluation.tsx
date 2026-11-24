import { useState, useMemo } from "react";
import {
  Gauge,
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
  ShieldCheck,
} from "lucide-react";

interface EvalPoint {
  id: number;
  label: string;
  x: number;
  y: number;
  trueClass: number; // Ground truth reference class
}

interface EvalDatasetPreset {
  name: string;
  description: string;
  points: EvalPoint[];
}

const EVAL_PRESETS: Record<string, EvalDatasetPreset> = {
  benchmark: {
    name: "Canonical 4-Point Benchmark",
    description:
      "4 reference points partitioned into 2 natural classes: Class 0 ({P₁, P₂}) and Class 1 ({P₃, P₄}).",
    points: [
      { id: 0, label: "P₁", x: 1.0, y: 2.0, trueClass: 0 },
      { id: 1, label: "P₂", x: 2.0, y: 3.0, trueClass: 0 },
      { id: 2, label: "P₃", x: 6.0, y: 5.0, trueClass: 1 },
      { id: 3, label: "P₄", x: 7.0, y: 6.0, trueClass: 1 },
    ],
  },
  compact: {
    name: "Two Dense Cohorts (N=8)",
    description: "Two tightly focused clusters with 4 observations each in Class 0 and Class 1.",
    points: [
      { id: 0, label: "P₁", x: 1.0, y: 1.0, trueClass: 0 },
      { id: 1, label: "P₂", x: 1.5, y: 1.8, trueClass: 0 },
      { id: 2, label: "P₃", x: 2.0, y: 1.2, trueClass: 0 },
      { id: 3, label: "P₄", x: 2.2, y: 2.0, trueClass: 0 },
      { id: 4, label: "P₅", x: 6.0, y: 6.0, trueClass: 1 },
      { id: 5, label: "P₆", x: 6.5, y: 6.8, trueClass: 1 },
      { id: 6, label: "P₇", x: 7.0, y: 6.2, trueClass: 1 },
      { id: 7, label: "P₈", x: 7.5, y: 7.0, trueClass: 1 },
    ],
  },
  "tri-balanced": {
    name: "Three Balanced Classes (N=12)",
    description:
      "Three distinct classes (4 points each), ideal for evaluating multi-class ARI and NMI.",
    points: [
      { id: 0, label: "P₁", x: 1.0, y: 1.0, trueClass: 0 },
      { id: 1, label: "P₂", x: 1.6, y: 1.8, trueClass: 0 },
      { id: 2, label: "P₃", x: 2.2, y: 1.2, trueClass: 0 },
      { id: 3, label: "P₄", x: 2.0, y: 2.2, trueClass: 0 },
      { id: 4, label: "P₅", x: 8.0, y: 2.0, trueClass: 1 },
      { id: 5, label: "P₆", x: 8.6, y: 1.4, trueClass: 1 },
      { id: 6, label: "P₇", x: 7.8, y: 2.6, trueClass: 1 },
      { id: 7, label: "P₈", x: 8.4, y: 2.4, trueClass: 1 },
      { id: 8, label: "P₉", x: 4.6, y: 7.6, trueClass: 2 },
      { id: 9, label: "P₁₀", x: 5.2, y: 8.2, trueClass: 2 },
      { id: 10, label: "P₁₁", x: 5.6, y: 7.4, trueClass: 2 },
      { id: 11, label: "P₁₂", x: 4.8, y: 8.4, trueClass: 2 },
    ],
  },
  overlapping: {
    name: "Two Interleaving Clusters (N=10)",
    description:
      "Two elongated adjacent classes with mild boundary overlap to test boundary silhouette.",
    points: [
      { id: 0, label: "P₁", x: 2.0, y: 2.0, trueClass: 0 },
      { id: 1, label: "P₂", x: 2.8, y: 3.2, trueClass: 0 },
      { id: 2, label: "P₃", x: 3.5, y: 3.8, trueClass: 0 },
      { id: 3, label: "P₄", x: 4.2, y: 4.5, trueClass: 0 },
      { id: 4, label: "P₅", x: 4.8, y: 5.0, trueClass: 0 },
      { id: 5, label: "P₆", x: 4.6, y: 3.8, trueClass: 1 },
      { id: 6, label: "P₇", x: 5.4, y: 4.6, trueClass: 1 },
      { id: 7, label: "P₈", x: 6.2, y: 5.5, trueClass: 1 },
      { id: 8, label: "P₉", x: 7.0, y: 6.2, trueClass: 1 },
      { id: 9, label: "P₁₀", x: 7.8, y: 7.0, trueClass: 1 },
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
];

export function EvaluationPlayground() {
  const [datasetKey, setDatasetKey] = useState<string>("benchmark");
  const [metric, setMetric] = useState<"euclidean" | "manhattan">("euclidean");
  const [linkageMethod, setLinkageMethod] = useState<"single" | "complete" | "average" | "ward">(
    "ward",
  );
  const [kClusters, setKClusters] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<"scatter" | "silhouette" | "dashboard" | "code">(
    "dashboard",
  );
  const [copied, setCopied] = useState<boolean>(false);

  const dataset = EVAL_PRESETS[datasetKey]!;
  const points = dataset.points;
  const n = points.length;

  // Run agglomerative clustering and compute assignments
  const { clusterAssignments } = useMemo(() => {
    const calcDist = (p1: EvalPoint, p2: EvalPoint): number => {
      if (metric === "euclidean") {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
      } else {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
      }
    };

    const distMatrix: number[][] = [];
    for (let i = 0; i < n; i++) {
      distMatrix[i] = [];
      for (let j = 0; j < n; j++) {
        distMatrix[i]![j] = i === j ? Infinity : calcDist(points[i]!, points[j]!);
      }
    }

    const clusters: Record<number, number[]> = {};
    const centroids: Record<number, { x: number; y: number }> = {};
    const activeIds: number[] = [];

    for (let i = 0; i < n; i++) {
      clusters[i] = [i];
      centroids[i] = { x: points[i]!.x, y: points[i]!.y };
      activeIds.push(i);
    }

    const zRows: Array<{ clusterA: number; clusterB: number; newNodeId: number; dist: number }> =
      [];

    for (let step = 0; step < n - 1; step++) {
      let minDist = Infinity;
      let bestA = -1;
      let bestB = -1;

      for (let i = 0; i < activeIds.length; i++) {
        for (let j = i + 1; j < activeIds.length; j++) {
          const idA = activeIds[i]!;
          const idB = activeIds[j]!;
          const dVal = distMatrix[idA]![idB]!;
          if (dVal < minDist) {
            minDist = dVal;
            bestA = idA;
            bestB = idB;
          }
        }
      }

      const newNodeId = n + step;
      const membersA = clusters[bestA]!;
      const membersB = clusters[bestB]!;
      const mergedMembers = [...membersA, ...membersB];
      clusters[newNodeId] = mergedMembers;

      const totalCount = mergedMembers.length;
      let sumX = 0;
      let sumY = 0;
      for (const mIdx of mergedMembers) {
        sumX += points[mIdx]!.x;
        sumY += points[mIdx]!.y;
      }
      centroids[newNodeId] = { x: sumX / totalCount, y: sumY / totalCount };

      zRows.push({
        clusterA: Math.min(bestA, bestB),
        clusterB: Math.max(bestA, bestB),
        newNodeId,
        dist: minDist,
      });

      distMatrix[newNodeId] = [];
      for (let k = 0; k <= newNodeId; k++) {
        distMatrix[newNodeId]![k] = Infinity;
        if (distMatrix[k]) distMatrix[k]![newNodeId] = Infinity;
      }

      for (const otherId of activeIds) {
        if (otherId !== bestA && otherId !== bestB) {
          const dA = distMatrix[bestA]![otherId]!;
          const dB = distMatrix[bestB]![otherId]!;
          const nA = clusters[bestA]!.length;
          const nB = clusters[bestB]!.length;

          let newD = 0;
          if (linkageMethod === "single") {
            newD = Math.min(dA, dB);
          } else if (linkageMethod === "complete") {
            newD = Math.max(dA, dB);
          } else if (linkageMethod === "average") {
            newD = (nA * dA + nB * dB) / (nA + nB);
          } else if (linkageMethod === "ward") {
            const dAB = distMatrix[bestA]![bestB]!;
            const nOther = clusters[otherId]!.length;
            const nTotal = nA + nB + nOther;
            const alphaA = (nA + nOther) / nTotal;
            const alphaB = (nB + nOther) / nTotal;
            const beta = -nOther / nTotal;
            const sqNew =
              alphaA * Math.pow(dA, 2) + alphaB * Math.pow(dB, 2) + beta * Math.pow(dAB, 2);
            newD = Math.sqrt(Math.max(0, sqNew));
          }

          distMatrix[newNodeId]![otherId] = newD;
          distMatrix[otherId]![newNodeId] = newD;
        }
      }

      const idxA = activeIds.indexOf(bestA);
      activeIds.splice(idxA, 1);
      const idxB = activeIds.indexOf(bestB);
      activeIds.splice(idxB, 1);
      activeIds.push(newNodeId);
    }

    // Slicing to extract k clusters
    const numSplits = Math.max(0, Math.min(n - 1, kClusters - 1));
    const sliceIndex = n - 1 - numSplits;

    const cutClusters: Record<number, number[]> = {};
    const cutActive: number[] = [];
    for (let i = 0; i < n; i++) {
      cutClusters[i] = [i];
      cutActive.push(i);
    }
    for (let step = 0; step < sliceIndex; step++) {
      const row = zRows[step]!;
      const merged = [...cutClusters[row.clusterA]!, ...cutClusters[row.clusterB]!];
      cutClusters[row.newNodeId] = merged;
      const idx1 = cutActive.indexOf(row.clusterA);
      cutActive.splice(idx1, 1);
      const idx2 = cutActive.indexOf(row.clusterB);
      cutActive.splice(idx2, 1);
      cutActive.push(row.newNodeId);
    }

    const assignments: number[] = new Array(n).fill(0);
    cutActive.forEach((clusterId, clusterIdx) => {
      const members = cutClusters[clusterId]!;
      for (const mIdx of members) {
        assignments[mIdx] = clusterIdx;
      }
    });

    return { clusterAssignments: assignments };
  }, [points, metric, linkageMethod, kClusters, n]);

  // Comprehensive metric calculations
  const metrics = useMemo(() => {
    const k = kClusters;
    const isSingleCluster = k <= 1;
    const isAllSingletons = k >= n;

    const calcDist = (p1: EvalPoint, p2: EvalPoint): number => {
      if (metric === "euclidean") {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
      } else {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
      }
    };

    // 1. Silhouette Coefficient
    let meanSilhouette = 0;
    const sampleSilhouettes: number[] = new Array(n).fill(0);

    if (!isSingleCluster && !isAllSingletons) {
      for (let i = 0; i < n; i++) {
        const cA = clusterAssignments[i]!;
        const sameClusterIndices = points
          .map((_, idx) => idx)
          .filter((idx) => clusterAssignments[idx] === cA && idx !== i);

        // a(i)
        let aI = 0;
        if (sameClusterIndices.length > 0) {
          const sumA = sameClusterIndices.reduce(
            (acc, idx) => acc + calcDist(points[i]!, points[idx]!),
            0,
          );
          aI = sumA / sameClusterIndices.length;
        }

        // b(i)
        let bI = Infinity;
        for (let otherC = 0; otherC < k; otherC++) {
          if (otherC !== cA) {
            const otherIndices = points
              .map((_, idx) => idx)
              .filter((idx) => clusterAssignments[idx] === otherC);
            if (otherIndices.length > 0) {
              const sumB = otherIndices.reduce(
                (acc, idx) => acc + calcDist(points[i]!, points[idx]!),
                0,
              );
              const meanB = sumB / otherIndices.length;
              if (meanB < bI) bI = meanB;
            }
          }
        }

        const maxAB = Math.max(aI, bI);
        sampleSilhouettes[i] = maxAB > 0 ? (bI - aI) / maxAB : 0;
      }
      meanSilhouette = sampleSilhouettes.reduce((acc, v) => acc + v, 0) / n;
    }

    // 2. Davies-Bouldin Index
    let daviesBouldin = 0;
    if (!isSingleCluster && !isAllSingletons) {
      const centroids: Array<{ x: number; y: number }> = [];
      const scatters: number[] = [];

      for (let cIdx = 0; cIdx < k; cIdx++) {
        const members = points.filter((_, idx) => clusterAssignments[idx] === cIdx);
        if (members.length === 0) {
          centroids.push({ x: 0, y: 0 });
          scatters.push(0);
          continue;
        }
        const centX = members.reduce((acc, p) => acc + p.x, 0) / members.length;
        const centY = members.reduce((acc, p) => acc + p.y, 0) / members.length;
        centroids.push({ x: centX, y: centY });

        const scatter =
          members.reduce((acc, p) => acc + Math.hypot(p.x - centX, p.y - centY), 0) /
          members.length;
        scatters.push(scatter);
      }

      let dbSum = 0;
      for (let i = 0; i < k; i++) {
        let maxR = 0;
        for (let j = 0; j < k; j++) {
          if (i !== j) {
            const mIJ = Math.hypot(
              centroids[i]!.x - centroids[j]!.x,
              centroids[i]!.y - centroids[j]!.y,
            );
            const rIJ = mIJ > 0 ? (scatters[i]! + scatters[j]!) / mIJ : 0;
            if (rIJ > maxR) maxR = rIJ;
          }
        }
        dbSum += maxR;
      }
      daviesBouldin = dbSum / k;
    }

    // 3. Calinski-Harabasz Index
    let calinskiHarabasz = 0;
    if (!isSingleCluster && !isAllSingletons) {
      const globalMeanX = points.reduce((acc, p) => acc + p.x, 0) / n;
      const globalMeanY = points.reduce((acc, p) => acc + p.y, 0) / n;

      let betweenDisp = 0;
      let withinDisp = 0;

      for (let cIdx = 0; cIdx < k; cIdx++) {
        const members = points.filter((_, idx) => clusterAssignments[idx] === cIdx);
        if (members.length === 0) continue;
        const centX = members.reduce((acc, p) => acc + p.x, 0) / members.length;
        const centY = members.reduce((acc, p) => acc + p.y, 0) / members.length;

        betweenDisp +=
          members.length * (Math.pow(centX - globalMeanX, 2) + Math.pow(centY - globalMeanY, 2));

        for (const p of members) {
          withinDisp += Math.pow(p.x - centX, 2) + Math.pow(p.y - centY, 2);
        }
      }

      const dfBetween = k - 1;
      const dfWithin = n - k;
      if (withinDisp > 0 && dfWithin > 0) {
        calinskiHarabasz = betweenDisp / dfBetween / (withinDisp / dfWithin);
      }
    }

    // 4. External Metrics (ARI, NMI, Homogeneity, Completeness, V-Measure)
    const trueClasses = points.map((p) => p.trueClass);
    const numTrueClasses = Math.max(...trueClasses) + 1;

    // Contingency matrix: rows = true classes, cols = predicted clusters
    const contingency: number[][] = [];
    for (let r = 0; r < numTrueClasses; r++) {
      contingency[r] = new Array(k).fill(0);
    }
    for (let i = 0; i < n; i++) {
      const t = trueClasses[i]!;
      const c = clusterAssignments[i]!;
      contingency[t]![c]! += 1;
    }

    // Adjusted Rand Index
    const comb2 = (val: number) => (val * (val - 1)) / 2;
    let sumNij = 0;
    for (let r = 0; r < numTrueClasses; r++) {
      for (let c = 0; c < k; c++) {
        sumNij += comb2(contingency[r]![c]!);
      }
    }
    const aRows = contingency.map((row) => row.reduce((acc, v) => acc + v, 0));
    const bCols: number[] = new Array(k).fill(0);
    for (let c = 0; c < k; c++) {
      for (let r = 0; r < numTrueClasses; r++) {
        bCols[c] += contingency[r]![c]!;
      }
    }
    const sumA = aRows.reduce((acc, v) => acc + comb2(v), 0);
    const sumB = bCols.reduce((acc, v) => acc + comb2(v), 0);
    const totalComb = comb2(n);
    const expectedIndex = (sumA * sumB) / totalComb;
    const maxIndex = 0.5 * (sumA + sumB);
    const ari =
      maxIndex - expectedIndex > 0 ? (sumNij - expectedIndex) / (maxIndex - expectedIndex) : 1.0;

    // Information Theory: H(Y), H(C), I(Y; C), Homogeneity, Completeness, V-Measure
    let hY = 0;
    for (const count of aRows) {
      if (count > 0) {
        const p = count / n;
        hY -= p * Math.log(p);
      }
    }

    let hC = 0;
    for (const count of bCols) {
      if (count > 0) {
        const p = count / n;
        hC -= p * Math.log(p);
      }
    }

    let mi = 0;
    for (let r = 0; r < numTrueClasses; r++) {
      for (let c = 0; c < k; c++) {
        const count = contingency[r]![c]!;
        if (count > 0) {
          const pIJ = count / n;
          const pI = aRows[r]! / n;
          const pJ = bCols[c]! / n;
          mi += pIJ * Math.log(pIJ / (pI * pJ));
        }
      }
    }

    const nmi = hY + hC > 0 ? (2 * mi) / (hY + hC) : 1.0;

    // Conditional entropies
    let hYGivenC = 0;
    for (let c = 0; c < k; c++) {
      const colTotal = bCols[c]!;
      if (colTotal > 0) {
        let condSum = 0;
        for (let r = 0; r < numTrueClasses; r++) {
          const count = contingency[r]![c]!;
          if (count > 0) {
            const p = count / colTotal;
            condSum -= p * Math.log(p);
          }
        }
        hYGivenC += (colTotal / n) * condSum;
      }
    }

    let hCGivenY = 0;
    for (let r = 0; r < numTrueClasses; r++) {
      const rowTotal = aRows[r]!;
      if (rowTotal > 0) {
        let condSum = 0;
        for (let c = 0; c < k; c++) {
          const count = contingency[r]![c]!;
          if (count > 0) {
            const p = count / rowTotal;
            condSum -= p * Math.log(p);
          }
        }
        hCGivenY += (rowTotal / n) * condSum;
      }
    }

    const homogeneity = hY > 0 ? Math.max(0, 1 - hYGivenC / hY) : 1.0;
    const completeness = hC > 0 ? Math.max(0, 1 - hCGivenY / hC) : 1.0;
    const vMeasure =
      homogeneity + completeness > 0
        ? (2 * homogeneity * completeness) / (homogeneity + completeness)
        : 0;

    return {
      meanSilhouette,
      sampleSilhouettes,
      daviesBouldin,
      calinskiHarabasz,
      ari,
      nmi,
      homogeneity,
      completeness,
      vMeasure,
      contingency,
      isSingleCluster,
      isAllSingletons,
    };
  }, [points, clusterAssignments, kClusters, metric, n]);

  const pythonSnippet = `# Scikit-Learn Cluster Evaluation Benchmark
import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import (
    silhouette_score,
    davies_bouldin_score,
    calinski_harabasz_score,
    adjusted_rand_score,
    normalized_mutual_info_score,
    homogeneity_completeness_v_measure
)

X = np.array([
${points.map((p) => `    [${p.x}, ${p.y}],  # ${p.label}`).join("\n")}
])
y_true = np.array([${points.map((p) => p.trueClass).join(", ")}])

# Fit Agglomerative Clustering
model = AgglomerativeClustering(
    n_clusters=${kClusters},
    metric="${metric}",
    linkage="${linkageMethod}"
)
y_pred = model.fit_predict(X)

# Internal Validation Metrics
print("--- Internal Validation Metrics (k=${kClusters}) ---")
${
  kClusters > 1 && kClusters < n
    ? `print(f"Silhouette Score:      {silhouette_score(X, y_pred, metric='${metric}'):.4f}")
print(f"Davies-Bouldin Index:  {davies_bouldin_score(X, y_pred):.4f}")
print(f"Calinski-Harabasz:     {calinski_harabasz_score(X, y_pred):.4f}")`
    : `print("Internal metrics undefined for k=1 or k=N.")`
}

# External Validation Metrics (Ground Truth Benchmark)
print("\\n--- External Validation Metrics (Reference Comparison) ---")
print(f"Adjusted Rand Index:   {adjusted_rand_score(y_true, y_pred):.4f}")
print(f"Normalized Mutual Info:{normalized_mutual_info_score(y_true, y_pred):.4f}")
h, c, v = homogeneity_completeness_v_measure(y_true, y_pred)
print(f"Homogeneity / Completeness / V-Measure: {h:.4f} / {c:.4f} / {v:.4f}")`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 rounded-sm border border-border bg-card p-5">
      {/* Educational Banner */}
      <div className="rounded-xs border border-teal/30 bg-teal/5 p-3 flex items-start gap-2.5">
        <Gauge className="h-4 w-4 text-teal shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Interactive Cluster Evaluation Laboratory:</strong>{" "}
          Dynamic calculation engine evaluating within-cluster compactness, between-cluster
          separation, and external ground-truth fidelity across customizable linkage and distance
          criteria.
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Preset Dataset */}
        <div className="space-y-1.5 rounded-xs border border-border bg-background p-3">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-teal" />
            Evaluation Dataset:
          </span>
          <select
            value={datasetKey}
            onChange={(e) => {
              setDatasetKey(e.target.value);
              setKClusters(2);
            }}
            className="w-full rounded-xs border border-border bg-card px-2 py-1.5 text-foreground"
          >
            {Object.entries(EVAL_PRESETS).map(([key, d]) => (
              <option key={key} value={key}>
                {d.name}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-muted-foreground">{dataset.description}</p>
        </div>

        {/* Distance Metric */}
        <div className="space-y-1.5 rounded-xs border border-border bg-background p-3">
          <span className="font-semibold text-foreground">Distance Metric:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setMetric("euclidean")}
              className={`flex-1 py-1.5 px-2 rounded-xs border text-xs font-medium transition-colors ${
                metric === "euclidean"
                  ? "border-teal bg-teal/10 text-teal font-semibold"
                  : "border-border text-muted-foreground hover:bg-muted/40"
              }`}
            >
              Euclidean
            </button>
            <button
              onClick={() => setMetric("manhattan")}
              className={`flex-1 py-1.5 px-2 rounded-xs border text-xs font-medium transition-colors ${
                metric === "manhattan"
                  ? "border-teal bg-teal/10 text-teal font-semibold"
                  : "border-border text-muted-foreground hover:bg-muted/40"
              }`}
            >
              Manhattan
            </button>
          </div>
          <span className="text-[10px] text-muted-foreground block">
            Metric space geometry: {metric.toUpperCase()}
          </span>
        </div>

        {/* Linkage Method */}
        <div className="space-y-1.5 rounded-xs border border-border bg-background p-3">
          <span className="font-semibold text-foreground">Linkage Method:</span>
          <select
            value={linkageMethod}
            onChange={(e) =>
              setLinkageMethod(e.target.value as "single" | "complete" | "average" | "ward")
            }
            className="w-full rounded-xs border border-border bg-card px-2 py-1.5 text-foreground"
          >
            <option value="ward">Ward (Variance Minimization)</option>
            <option value="average">Average (UPGMA)</option>
            <option value="complete">Complete (Max Diameter)</option>
            <option value="single">Single (Min Pairwise)</option>
          </select>
          <span className="text-[10px] text-muted-foreground block">
            Objective: {linkageMethod.toUpperCase()}
          </span>
        </div>

        {/* Cluster Slicing k */}
        <div className="space-y-1.5 rounded-xs border border-border bg-background p-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Sliders className="h-3.5 w-3.5 text-navy" />
              Cluster Count (k):
            </span>
            <span className="font-mono font-bold text-navy text-sm">{kClusters}</span>
          </div>
          <input
            type="range"
            min="1"
            max={n}
            value={kClusters}
            onChange={(e) => setKClusters(parseInt(e.target.value) || 1)}
            className="w-full accent-navy cursor-pointer"
          />
          <span className="text-[10px] text-muted-foreground block">Valid range: 1 ≤ k ≤ {n}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 pt-2">
        <div className="flex gap-1 bg-muted/40 p-1 rounded-sm border border-border">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1 text-xs rounded-sm transition-colors ${
              activeTab === "dashboard"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Metrics Dashboard
          </button>
          <button
            onClick={() => setActiveTab("silhouette")}
            className={`px-3 py-1 text-xs rounded-sm transition-colors flex items-center gap-1 ${
              activeTab === "silhouette"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-3 w-3" />
            Silhouette Plot
          </button>
          <button
            onClick={() => setActiveTab("scatter")}
            className={`px-3 py-1 text-xs rounded-sm transition-colors ${
              activeTab === "scatter"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            2D Scatter Space
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 text-xs rounded-sm transition-colors flex items-center gap-1 ${
              activeTab === "code"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="h-3 w-3" />
            Python Verification
          </button>
        </div>

        <div className="text-[11px] font-mono text-muted-foreground">
          N={n} | k={kClusters} | Linkage: {linkageMethod.toUpperCase()}
        </div>
      </div>

      {/* TAB 1: Metrics Dashboard */}
      {activeTab === "dashboard" && (
        <div className="space-y-4">
          {/* Internal Metrics Cards */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-teal" />
              Internal Validation Panel (No Ground Truth Required)
            </h5>
            {metrics.isSingleCluster || metrics.isAllSingletons ? (
              <div className="rounded-xs border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                Internal metrics require <strong className="text-foreground">2 ≤ k ≤ N - 1</strong>{" "}
                clusters. Currently k = {kClusters}.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="rounded-xs border border-teal/40 bg-teal/5 p-3 space-y-1">
                  <span className="text-[10px] font-sans font-semibold text-teal uppercase">
                    Silhouette Score (s̄)
                  </span>
                  <div className="text-lg font-bold text-foreground">
                    {metrics.meanSilhouette.toFixed(4)}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-sans block">
                    Range [-1, +1] · Higher is better
                  </span>
                </div>

                <div className="rounded-xs border border-navy/40 bg-navy/5 p-3 space-y-1">
                  <span className="text-[10px] font-sans font-semibold text-navy uppercase">
                    Davies–Bouldin Index (DB)
                  </span>
                  <div className="text-lg font-bold text-foreground">
                    {metrics.daviesBouldin.toFixed(4)}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-sans block">
                    DB ≥ 0 · Lower is better
                  </span>
                </div>

                <div className="rounded-xs border border-border bg-background p-3 space-y-1">
                  <span className="text-[10px] font-sans font-semibold text-muted-foreground uppercase">
                    Calinski–Harabasz (CH)
                  </span>
                  <div className="text-lg font-bold text-foreground">
                    {metrics.calinskiHarabasz.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-sans block">
                    ANOVA F-Ratio · Higher is better
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* External Metrics Cards */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-navy" />
              External Benchmark Panel (Compared to Reference Classes)
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono text-center">
              <div className="rounded-xs border border-border bg-background p-2.5">
                <span className="text-[10px] text-muted-foreground font-sans uppercase">ARI</span>
                <div className="text-base font-bold text-foreground">{metrics.ari.toFixed(4)}</div>
                <span className="text-[9px] text-muted-foreground font-sans">Chance-adjusted</span>
              </div>

              <div className="rounded-xs border border-border bg-background p-2.5">
                <span className="text-[10px] text-muted-foreground font-sans uppercase">NMI</span>
                <div className="text-base font-bold text-foreground">{metrics.nmi.toFixed(4)}</div>
                <span className="text-[9px] text-muted-foreground font-sans">Mutual Info</span>
              </div>

              <div className="rounded-xs border border-border bg-background p-2.5">
                <span className="text-[10px] text-muted-foreground font-sans uppercase">
                  Homogeneity
                </span>
                <div className="text-base font-bold text-foreground">
                  {metrics.homogeneity.toFixed(4)}
                </div>
                <span className="text-[9px] text-muted-foreground font-sans">Cluster purity</span>
              </div>

              <div className="rounded-xs border border-border bg-background p-2.5">
                <span className="text-[10px] text-muted-foreground font-sans uppercase">
                  Completeness
                </span>
                <div className="text-base font-bold text-foreground">
                  {metrics.completeness.toFixed(4)}
                </div>
                <span className="text-[9px] text-muted-foreground font-sans">Class cohesion</span>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-xs border border-teal/40 bg-teal/10 p-2.5">
                <span className="text-[10px] text-teal font-sans uppercase font-bold">
                  V-Measure
                </span>
                <div className="text-base font-bold text-teal">{metrics.vMeasure.toFixed(4)}</div>
                <span className="text-[9px] text-teal font-sans">Harmonic mean</span>
              </div>
            </div>
          </div>

          {/* Contingency Table */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <TableIcon className="h-3.5 w-3.5 text-muted-foreground" />
              Confusion Contingency Matrix (Ground Truth vs. Predicted Clusters):
            </span>
            <div className="rounded-xs border border-border overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead className="bg-muted/40 border-b border-border text-foreground font-sans">
                  <tr>
                    <th className="p-2 text-left">Ground Truth Class</th>
                    {Array.from({ length: kClusters }).map((_, cIdx) => (
                      <th key={cIdx} className="p-2 text-center">
                        Cluster {cIdx + 1} (Col {cIdx})
                      </th>
                    ))}
                    <th className="p-2 text-right">Class Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {metrics.contingency.map((row, rIdx) => {
                    const rowSum = row.reduce((acc, v) => acc + v, 0);
                    return (
                      <tr key={rIdx} className="hover:bg-muted/20">
                        <td className="p-2 font-sans font-semibold text-foreground">
                          Reference Class {rIdx}
                        </td>
                        {row.map((cellCount, cIdx) => (
                          <td
                            key={cIdx}
                            className={`p-2 text-center font-bold ${
                              cellCount > 0 ? "text-teal bg-teal/5" : "text-muted-foreground"
                            }`}
                          >
                            {cellCount}
                          </td>
                        ))}
                        <td className="p-2 text-right text-muted-foreground">{rowSum}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Silhouette Plot */}
      {activeTab === "silhouette" && (
        <div className="space-y-3">
          {metrics.isSingleCluster || metrics.isAllSingletons ? (
            <div className="rounded-xs border border-border bg-muted/20 p-4 text-xs text-muted-foreground text-center">
              Silhouette plot requires 2 ≤ k ≤ N - 1 clusters.
            </div>
          ) : (
            <div className="rounded-xs border border-border bg-background p-4 flex flex-col items-center">
              <svg
                viewBox="0 0 460 260"
                className="w-full max-w-lg overflow-visible font-sans text-xs"
              >
                {/* Horizontal reference axis at s=0 */}
                <line
                  x1="100"
                  y1="20"
                  x2="100"
                  y2="230"
                  stroke="currentColor"
                  className="text-border"
                  strokeWidth="1.5"
                />
                <line
                  x1="40"
                  y1="230"
                  x2="430"
                  y2="230"
                  stroke="currentColor"
                  className="text-border"
                  strokeWidth="1.2"
                />

                {/* Ticks: -0.5, 0.0, 0.5, 1.0 */}
                {[-0.5, 0.0, 0.5, 1.0].map((tickVal) => {
                  const tickX = 100 + tickVal * 300;
                  return (
                    <g key={tickVal}>
                      <line
                        x1={tickX}
                        y1="230"
                        x2={tickX}
                        y2="235"
                        stroke="currentColor"
                        className="text-border"
                      />
                      <text
                        x={tickX}
                        y="248"
                        textAnchor="middle"
                        className="text-[9px] font-mono fill-muted-foreground"
                      >
                        {tickVal.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Mean silhouette vertical dashed line */}
                {(() => {
                  const meanX = 100 + metrics.meanSilhouette * 300;
                  return (
                    <g>
                      <line
                        x1={meanX}
                        y1="15"
                        x2={meanX}
                        y2="230"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />
                      <text
                        x={meanX}
                        y="12"
                        textAnchor="middle"
                        className="text-[9px] font-bold fill-red-500 font-mono"
                      >
                        Mean s={metrics.meanSilhouette.toFixed(2)}
                      </text>
                    </g>
                  );
                })()}

                {/* Silhouette bars per sample */}
                {points.map((p, idx) => {
                  const sVal = metrics.sampleSilhouettes[idx] ?? 0;
                  const cIdx = clusterAssignments[idx] ?? 0;
                  const color = PALETTE[cIdx % PALETTE.length];

                  const barY = 25 + idx * ((230 - 35) / n);
                  const barHeight = Math.max(8, (230 - 35) / n - 4);
                  const barX = sVal >= 0 ? 100 : 100 + sVal * 300;
                  const barWidth = Math.abs(sVal) * 300;

                  return (
                    <g key={p.id}>
                      <text
                        x="35"
                        y={barY + barHeight / 2 + 3}
                        className="text-[9px] font-mono fill-muted-foreground"
                      >
                        {p.label} (C{cIdx + 1})
                      </text>
                      <rect
                        x={barX}
                        y={barY}
                        width={Math.max(1, barWidth)}
                        height={barHeight}
                        fill={color}
                        rx="1"
                      />
                      <text
                        x={sVal >= 0 ? 105 + barWidth : 95}
                        y={barY + barHeight / 2 + 3}
                        className="text-[8px] font-mono fill-foreground"
                        textAnchor={sVal >= 0 ? "start" : "end"}
                      >
                        {sVal.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
          <p className="text-xs text-muted-foreground text-center">
            Individual silhouette coefficients s(i). The red dashed line denotes the overall mean
            score s̄ ={" "}
            <strong className="text-foreground">{metrics.meanSilhouette.toFixed(4)}</strong>.
          </p>
        </div>
      )}

      {/* TAB 3: 2D Feature Scatter Space */}
      {activeTab === "scatter" && (
        <div className="space-y-3">
          <div className="rounded-xs border border-border bg-background p-4 flex flex-col items-center">
            <svg
              viewBox="0 0 380 280"
              className="w-full max-w-md overflow-visible font-sans text-xs"
            >
              <rect
                width="320"
                height="230"
                x="35"
                y="20"
                fill="none"
                stroke="currentColor"
                className="text-border"
                strokeWidth="1.2"
              />

              <text
                x="195"
                y="270"
                textAnchor="middle"
                className="text-[10px] fill-muted-foreground"
              >
                Feature Dimension X₁
              </text>
              <text
                x="14"
                y="135"
                textAnchor="middle"
                transform="rotate(-90 14 135)"
                className="text-[10px] fill-muted-foreground"
              >
                Feature Dimension X₂
              </text>

              {points.map((p, idx) => {
                const svgX = 45 + (p.x / 10) * 300;
                const svgY = 240 - (p.y / 10) * 210;
                const cIdx = clusterAssignments[idx] ?? 0;
                const color = PALETTE[cIdx % PALETTE.length];

                return (
                  <g key={p.id}>
                    <circle cx={svgX} cy={svgY} r="10" fill={color} fillOpacity="0.15" />
                    <circle
                      cx={svgX}
                      cy={svgY}
                      r="5"
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={svgX}
                      y={svgY - 8}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-foreground"
                    >
                      {p.label}
                    </text>
                    <text
                      x={svgX}
                      y={svgY + 14}
                      textAnchor="middle"
                      className="text-[8px] font-mono fill-muted-foreground"
                    >
                      T:{p.trueClass} | C:{cIdx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* TAB 4: Python Code Generator */}
      {activeTab === "code" && (
        <div className="space-y-3">
          <div className="relative rounded-xs border border-border bg-muted/30 p-3 font-mono text-xs">
            <button
              onClick={handleCopyCode}
              className="absolute top-3 right-3 px-2 py-1 bg-background border border-border rounded-xs text-[11px] text-foreground hover:bg-muted/40 flex items-center gap-1 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-teal" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy Python Code
                </>
              )}
            </button>
            <pre className="overflow-x-auto text-foreground whitespace-pre leading-relaxed pr-24">
              {pythonSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/** Module 11 Knowledge Check Quiz */
export function Module11Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const questions = [
    {
      id: 1,
      question:
        "Why is raw Rand Index (RI) considered mathematically inadequate for cluster evaluation compared to the Adjusted Rand Index (ARI)?",
      options: [
        "RI produces negative numbers when applied to Euclidean distances.",
        "The expected value of raw RI increases as cluster count k grows, failing to center at 0.0 for random chance partitions.",
        "Raw RI violates the symmetry property between true classes and cluster labels.",
        "Raw RI can only be evaluated when true classes and clusters have the exact same cardinality.",
      ],
      correct: 1,
      explanation:
        "Raw Rand Index RI = (a + d) / (a + b + c + d) increases monotonically as the number of clusters increases because true negative pair matches (d) dominate the denominator. Hubert & Arabie (1985) introduced ARI to normalize against the expected value under a generalized hypergeometric model of random labeling, guaranteeing that ARI has expected value 0.0 for chance partitions.",
    },
    {
      id: 2,
      question:
        "Under what condition is an observation's Silhouette Coefficient s(i) assigned a value of exactly 0.0 by statistical convention?",
      options: [
        "When the observation is the global centroid of the entire dataset.",
        "When the observation resides in a singleton cluster (|C_A| = 1), causing intra-cluster distance a(i) to be undefined.",
        "When the observation is equidistant from all centroids in the metric space.",
        "When the ground-truth reference label matches the predicted cluster ID.",
      ],
      correct: 1,
      explanation:
        "For a singleton cluster containing only observation i, the intra-cluster distance a(i) = [1/(|C_A|-1)] ∑ d(i, j) would require division by zero. Rousseeuw (1987) and Scikit-learn establish by convention that singleton observations receive s(i) = 0.0.",
    },
    {
      id: 3,
      question:
        "Which internal validation metric directly mirrors the F-statistic in analysis of variance (ANOVA) by computing the ratio of between-cluster dispersion to within-cluster dispersion?",
      options: [
        "Davies–Bouldin Index",
        "Calinski–Harabasz Index (Variance Ratio Criterion)",
        "Silhouette Coefficient",
        "Cophenetic Correlation Coefficient",
      ],
      correct: 1,
      explanation:
        "The Calinski–Harabasz Index is defined as CH = [tr(B_k)/(k - 1)] / [tr(W_k)/(n - k)], exactly mirroring the one-way ANOVA F-statistic by dividing between-cluster variance by within-cluster variance weighted by their respective degrees of freedom.",
    },
    {
      id: 4,
      question:
        "If a clustering algorithm places every single observation into its own unique singleton cluster (k = n), what are the resulting Homogeneity and Completeness scores?",
      options: [
        "Homogeneity = 1.0 (perfect cluster purity), but Completeness is low (severe class fragmentation).",
        "Completeness = 1.0, but Homogeneity is 0.0.",
        "Both Homogeneity and Completeness evaluate to 0.0.",
        "Both Homogeneity and Completeness evaluate to 1.0.",
      ],
      correct: 0,
      explanation:
        "In degenerate singleton clustering, every cluster contains points from only one class, satisfying perfect Homogeneity (h = 1.0). However, single classes are completely fragmented across multiple clusters, yielding low Completeness. This illustrates why V-measure (the harmonic mean) is required to evaluate the trade-off.",
    },
  ];

  const handleSelect = (qId: number, oIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: oIdx }));
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = Object.entries(answers).reduce((acc, [qId, ans]) => {
    const q = questions.find((item) => item.id === Number(qId));
    return q && q.correct === ans ? acc + 1 : acc;
  }, 0);

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-teal" />
            Module 11 Knowledge Check: Cluster Evaluation &amp; Validation
          </h4>
          <p className="text-xs text-muted-foreground">
            Test your understanding of internal compactness metrics, external reference chance
            adjustment, and homogeneity trade-offs.
          </p>
        </div>
        {submitted && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-sm bg-teal/10 text-teal border border-teal/20">
              Score: {score} / {questions.length}
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 border border-border px-2 py-1 rounded-sm"
            >
              <RotateCcw className="h-3 w-3" /> Retry
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((q) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.correct;

          return (
            <div
              key={q.id}
              className="rounded-sm border border-border/70 p-4 bg-muted/15 space-y-3"
            >
              <p className="text-xs font-semibold text-foreground">
                <span className="text-teal font-mono mr-1.5">Q{q.id}.</span>
                {q.question}
              </p>

              <div className="space-y-1.5">
                {q.options.map((opt, oIdx) => {
                  let optStyle = "border-border hover:bg-muted/40 text-muted-foreground";

                  if (selected === oIdx) {
                    optStyle = "border-navy bg-navy/10 text-foreground font-medium";
                  }

                  if (submitted) {
                    if (oIdx === q.correct) {
                      optStyle = "border-teal bg-teal/15 text-teal font-semibold";
                    } else if (selected === oIdx) {
                      optStyle = "border-destructive bg-destructive/15 text-destructive";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(q.id, oIdx)}
                      disabled={submitted}
                      className={`w-full text-left text-xs p-2.5 rounded-sm border transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && oIdx === q.correct && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`text-xs p-2.5 rounded-sm flex items-start gap-2 ${
                    isCorrect
                      ? "bg-teal/10 text-teal-dark dark:text-teal border border-teal/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < questions.length}
          className="w-full sm:w-auto px-4 py-2 bg-navy text-primary-foreground text-xs font-semibold rounded-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          Check Answers ({Object.keys(answers).length}/{questions.length} completed)
        </button>
      )}
    </div>
  );
}
