import { useState, useMemo } from "react";
import {
  Code2,
  Terminal,
  RotateCcw,
  Sparkles,
  Layers,
  Table as TableIcon,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Copy,
  Check,
  Network,
} from "lucide-react";

interface Point2D {
  id: number;
  label: string;
  x: number;
  y: number;
}

interface DatasetPreset {
  name: string;
  description: string;
  points: Point2D[];
}

const PRESET_DATASETS: Record<string, DatasetPreset> = {
  benchmark: {
    name: "Canonical 4-Point Benchmark",
    description: "Our lab's reference points in R²: P₁(1,2), P₂(2,3), P₃(6,5), P₄(7,6).",
    points: [
      { id: 0, label: "P₁", x: 1.0, y: 2.0 },
      { id: 1, label: "P₂", x: 2.0, y: 3.0 },
      { id: 2, label: "P₃", x: 6.0, y: 5.0 },
      { id: 3, label: "P₄", x: 7.0, y: 6.0 },
    ],
  },
  compact: {
    name: "Two Compact Clusters (N=8)",
    description: "Two dense, well-separated clusters with 4 observations each.",
    points: [
      { id: 0, label: "P₁", x: 1.0, y: 1.0 },
      { id: 1, label: "P₂", x: 1.5, y: 1.8 },
      { id: 2, label: "P₃", x: 2.0, y: 1.2 },
      { id: 3, label: "P₄", x: 2.2, y: 2.0 },
      { id: 4, label: "P₅", x: 6.0, y: 6.0 },
      { id: 5, label: "P₆", x: 6.5, y: 6.8 },
      { id: 6, label: "P₇", x: 7.0, y: 6.2 },
      { id: 7, label: "P₈", x: 7.5, y: 7.0 },
    ],
  },
  "tri-cluster": {
    name: "Three Balanced Clusters (N=12)",
    description: "Three distinct clusters ideal for testing k=3 partition slicing.",
    points: [
      { id: 0, label: "P₁", x: 1.0, y: 1.0 },
      { id: 1, label: "P₂", x: 1.6, y: 1.8 },
      { id: 2, label: "P₃", x: 2.2, y: 1.2 },
      { id: 3, label: "P₄", x: 2.0, y: 2.2 },
      { id: 4, label: "P₅", x: 8.0, y: 2.0 },
      { id: 5, label: "P₆", x: 8.6, y: 1.4 },
      { id: 6, label: "P₇", x: 7.8, y: 2.6 },
      { id: 7, label: "P₈", x: 8.4, y: 2.4 },
      { id: 8, label: "P₉", x: 4.6, y: 7.6 },
      { id: 9, label: "P₁₀", x: 5.2, y: 8.2 },
      { id: 10, label: "P₁₁", x: 5.6, y: 7.4 },
      { id: 11, label: "P₁₂", x: 4.8, y: 8.4 },
    ],
  },
  concentric: {
    name: "Nucleus & Ring Manifold (N=12)",
    description: "A compact center cluster surrounded by an outer manifold ring.",
    points: [
      { id: 0, label: "P₁", x: 5.0, y: 5.0 },
      { id: 1, label: "P₂", x: 4.6, y: 5.3 },
      { id: 2, label: "P₃", x: 5.4, y: 4.7 },
      { id: 3, label: "P₄", x: 5.1, y: 5.4 },
      { id: 4, label: "P₅", x: 1.5, y: 5.0 },
      { id: 5, label: "P₆", x: 2.5, y: 7.5 },
      { id: 6, label: "P₇", x: 5.0, y: 8.5 },
      { id: 7, label: "P₈", x: 7.5, y: 7.5 },
      { id: 8, label: "P₉", x: 8.5, y: 5.0 },
      { id: 9, label: "P₁₀", x: 7.5, y: 2.5 },
      { id: 10, label: "P₁₁", x: 5.0, y: 1.5 },
      { id: 11, label: "P₁₂", x: 2.5, y: 2.5 },
    ],
  },
};

const CLUSTER_COLORS = [
  "#0d9488", // Teal
  "#1e3a8a", // Navy
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#6366f1", // Indigo
];

interface ZRow {
  step: number;
  clusterA: number;
  clusterB: number;
  dist: number;
  sampleCount: number;
  newNodeId: number;
}

interface DendroNode {
  id: number;
  isLeaf: boolean;
  leafIdx?: number | undefined;
  x: number;
  y: number;
  left?: DendroNode | undefined;
  right?: DendroNode | undefined;
  dist: number;
  members: number[];
}

export function ImplementationExplorer() {
  const [datasetKey, setDatasetKey] = useState<string>("benchmark");
  const [metric, setMetric] = useState<"euclidean" | "manhattan">("euclidean");
  const [linkageMethod, setLinkageMethod] = useState<"single" | "complete" | "average" | "ward">(
    "single",
  );
  const [kClusters, setKClusters] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<"scatter" | "dendrogram" | "matrix" | "python">(
    "scatter",
  );
  const [copied, setCopied] = useState<boolean>(false);

  const dataset = PRESET_DATASETS[datasetKey]!;
  const points = dataset.points;
  const n = points.length;

  // Run agglomerative hierarchical clustering algorithm
  const { Z, nodeTree, clusterAssignments } = useMemo(() => {
    const calcDist = (p1: Point2D, p2: Point2D): number => {
      if (metric === "euclidean") {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
      } else {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
      }
    };

    // Initial distance matrix
    const distMatrix: number[][] = [];
    for (let i = 0; i < n; i++) {
      distMatrix[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          distMatrix[i]![j] = Infinity;
        } else {
          distMatrix[i]![j] = calcDist(points[i]!, points[j]!);
        }
      }
    }

    const clusters: Record<number, number[]> = {};
    const centroids: Record<number, { x: number; y: number }> = {};
    const dNodes: Record<number, DendroNode> = {};
    const activeIds: number[] = [];

    for (let i = 0; i < n; i++) {
      clusters[i] = [i];
      centroids[i] = { x: points[i]!.x, y: points[i]!.y };
      activeIds.push(i);
      dNodes[i] = {
        id: i,
        isLeaf: true,
        leafIdx: i,
        x: 0,
        y: 0,
        dist: 0,
        members: [i],
      };
    }

    const zRows: ZRow[] = [];

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

      // Update centroid
      const totalCount = mergedMembers.length;
      let sumX = 0;
      let sumY = 0;
      for (const mIdx of mergedMembers) {
        sumX += points[mIdx]!.x;
        sumY += points[mIdx]!.y;
      }
      centroids[newNodeId] = { x: sumX / totalCount, y: sumY / totalCount };

      const cFirst = Math.min(bestA, bestB);
      const cSecond = Math.max(bestA, bestB);

      zRows.push({
        step: step + 1,
        clusterA: cFirst,
        clusterB: cSecond,
        dist: minDist,
        sampleCount: totalCount,
        newNodeId,
      });

      // Construct Dendro node
      dNodes[newNodeId] = {
        id: newNodeId,
        isLeaf: false,
        x: 0,
        y: minDist,
        dist: minDist,
        left: dNodes[cFirst],
        right: dNodes[cSecond],
        members: mergedMembers,
      };

      // Expand distMatrix
      distMatrix[newNodeId] = [];
      for (let k = 0; k <= newNodeId; k++) {
        distMatrix[newNodeId]![k] = Infinity;
        if (distMatrix[k]) {
          distMatrix[k]![newNodeId] = Infinity;
        }
      }

      // Update distance to remaining active clusters
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
            // Ward minimum variance update
            const centA = centroids[bestA]!;
            const centB = centroids[bestB]!;
            const centOther = centroids[otherId]!;
            const nOther = clusters[otherId]!.length;

            const nTotal = nA + nB + nOther;
            const alphaA = (nA + nOther) / nTotal;
            const alphaB = (nB + nOther) / nTotal;
            const beta = -nOther / nTotal;

            // Lance-Williams for Ward
            const dAB = distMatrix[bestA]![bestB]!;
            const sqNew =
              alphaA * Math.pow(dA, 2) + alphaB * Math.pow(dB, 2) + beta * Math.pow(dAB, 2);
            newD = Math.sqrt(Math.max(0, sqNew));
          }

          distMatrix[newNodeId]![otherId] = newD;
          distMatrix[otherId]![newNodeId] = newD;
        }
      }

      // Update active list
      const idxA = activeIds.indexOf(bestA);
      activeIds.splice(idxA, 1);
      const idxB = activeIds.indexOf(bestB);
      activeIds.splice(idxB, 1);
      activeIds.push(newNodeId);
    }

    // Slicing to extract k clusters:
    // We start with the full root cluster, and sequentially split nodes from highest merge distance
    const currentPartitions: number[][] = [[...Array(n).keys()]];
    // Invert Z steps: the last n - k steps are split
    const numSplits = Math.max(0, Math.min(n - 1, kClusters - 1));

    // Alternative robust slicing: take the active clusters when n - numSplits clusters remain
    const sliceIndex = n - 1 - numSplits; // index in Z
    const activeAtCut: number[][] = [];

    // Track active clusters by re-simulating up to sliceIndex
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

    // Root node of dendrogram
    const rootNode = dNodes[2 * n - 2]!;

    // Assign leaf x coordinates (0 to n - 1)
    let currentLeafX = 0;
    const assignLeafCoords = (node: DendroNode) => {
      if (node.isLeaf) {
        node.x = currentLeafX++;
      } else {
        if (node.left) assignLeafCoords(node.left);
        if (node.right) assignLeafCoords(node.right);
        node.x = ((node.left?.x ?? 0) + (node.right?.x ?? 0)) / 2;
      }
    };
    assignLeafCoords(rootNode);

    return {
      Z: zRows,
      nodeTree: rootNode,
      clusterAssignments: assignments,
    };
  }, [points, metric, linkageMethod, kClusters, n]);

  // Cut threshold height (distance of the split that produced k clusters)
  const cutHeight = useMemo(() => {
    if (kClusters <= 1) return (Z[Z.length - 1]?.dist ?? 0) * 1.1;
    if (kClusters >= n) return (Z[0]?.dist ?? 0) * 0.5;
    const splitRowIdx = n - kClusters;
    const currentDist = Z[splitRowIdx]?.dist ?? 0;
    const prevDist = splitRowIdx > 0 ? (Z[splitRowIdx - 1]?.dist ?? 0) : 0;
    return (currentDist + prevDist) / 2;
  }, [Z, kClusters, n]);

  const maxDist = Z.length > 0 ? Z[Z.length - 1]!.dist : 1;

  // Generated Python code matching current parameters
  const pythonSnippet = `# Reproduce this exact run in Python using SciPy and Scikit-learn
import numpy as np
from scipy.spatial.distance import pdist, squareform
from scipy.cluster.hierarchy import linkage, dendrogram, fcluster
from sklearn.cluster import AgglomerativeClustering

# 1. Dataset coordinates (${dataset.name}, N=${n})
X = np.array([
${points.map((p) => `    [${p.x}, ${p.y}],  # ${p.label}`).join("\n")}
])

# 2. SciPy Functional Workflow
# Metric: '${metric}', Linkage: '${linkageMethod}'
y = pdist(X, metric="${metric}")
Z = linkage(y, method="${linkageMethod}")

# Extract ${kClusters} flat clusters (1-indexed in SciPy)
labels_scipy = fcluster(Z, t=${kClusters}, criterion="maxclust")
print("SciPy Labels (1-indexed):", labels_scipy)

# 3. Scikit-learn Estimator Workflow
model = AgglomerativeClustering(
    n_clusters=${kClusters},
    metric="${metric}",
    linkage="${linkageMethod}",
    compute_distances=True
)
labels_sklearn = model.fit_predict(X)
print("Scikit-Learn Labels (0-indexed):", labels_sklearn)
print("Scikit-Learn children_:\\n", model.children_)`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 rounded-sm border border-border bg-card p-5">
      {/* Educational Notice Banner */}
      <div className="rounded-xs border border-teal/30 bg-teal/5 p-3 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-teal shrink-0 mt-0.5" />
        <div className="min-w-0 break-words [overflow-wrap:anywhere] text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Client-Side Interactive Simulator:</strong> This
          component runs in your browser to interactively demonstrate the identical mathematics
          executed by Python&apos;s SciPy (<code>scipy.cluster.hierarchy</code>) and Scikit-learn (
          <code className="break-all">sklearn.cluster.AgglomerativeClustering</code>).
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Dataset Selector */}
        <div className="space-y-1.5 rounded-xs border border-border bg-background p-3">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-teal" />
            Dataset Selection:
          </span>
          <select
            value={datasetKey}
            onChange={(e) => {
              setDatasetKey(e.target.value);
              setKClusters(2);
            }}
            className="w-full rounded-xs border border-border bg-card px-2 py-1.5 text-foreground"
          >
            {Object.entries(PRESET_DATASETS).map(([key, d]) => (
              <option key={key} value={key}>
                {d.name}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-muted-foreground">{dataset.description}</p>
        </div>

        {/* Distance Metric */}
        <div className="space-y-1.5 rounded-xs border border-border bg-background p-3">
          <span className="font-semibold text-foreground">Ground Distance Metric:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setMetric("euclidean")}
              className={`flex-1 py-1.5 px-2 rounded-xs border text-xs font-medium transition-colors ${
                metric === "euclidean"
                  ? "border-teal bg-teal/10 text-teal"
                  : "border-border text-muted-foreground hover:bg-muted/40"
              }`}
            >
              Euclidean (L₂)
            </button>
            <button
              onClick={() => setMetric("manhattan")}
              className={`flex-1 py-1.5 px-2 rounded-xs border text-xs font-medium transition-colors ${
                metric === "manhattan"
                  ? "border-teal bg-teal/10 text-teal"
                  : "border-border text-muted-foreground hover:bg-muted/40"
              }`}
            >
              Manhattan (L₁)
            </button>
          </div>
          <span className="text-[10px] text-muted-foreground block">
            {metric === "euclidean"
              ? "Straight-line vector distance"
              : "Grid-constrained cityblock distance"}
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
            <option value="single">Single (Minimum Pairwise)</option>
            <option value="complete">Complete (Maximum Pairwise)</option>
            <option value="average">Average (UPGMA Mean)</option>
            <option value="ward">Ward (Variance Minimization)</option>
          </select>
          <span className="text-[10px] text-muted-foreground block">
            Lance–Williams update: {linkageMethod.toUpperCase()}
          </span>
        </div>

        {/* Cluster Slicing Slider (k) */}
        <div className="space-y-1.5 rounded-xs border border-border bg-background p-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Sliders className="h-3.5 w-3.5 text-navy" />
              Target Clusters (k):
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
          <span className="text-[10px] text-muted-foreground block">
            Cut height t ≈ {cutHeight.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 pt-2">
        <div className="flex flex-wrap gap-1 bg-muted/40 p-1 rounded-sm border border-border">
          <button
            onClick={() => setActiveTab("scatter")}
            className={`px-3 py-1 text-xs rounded-sm transition-colors ${
              activeTab === "scatter"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            2D Feature Space
          </button>
          <button
            onClick={() => setActiveTab("dendrogram")}
            className={`px-3 py-1 text-xs rounded-sm transition-colors ${
              activeTab === "dendrogram"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Hierarchical Dendrogram
          </button>
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-3 py-1 text-xs rounded-sm transition-colors ${
              activeTab === "matrix"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            SciPy Linkage Matrix (Z)
          </button>
          <button
            onClick={() => setActiveTab("python")}
            className={`px-3 py-1 text-xs rounded-sm transition-colors flex items-center gap-1 ${
              activeTab === "python"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="h-3 w-3" />
            Python API Inspector
          </button>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[11px] text-muted-foreground">
            SciPy (1-indexed): [{clusterAssignments.map((c) => c + 1).join(", ")}]
          </span>
          <span className="text-[11px] text-muted-foreground">
            Sklearn (0-indexed): [{clusterAssignments.join(", ")}]
          </span>
        </div>
      </div>

      {/* TAB 1: 2D Feature Scatter Space */}
      {activeTab === "scatter" && (
        <div className="space-y-3">
          <div className="rounded-xs border border-border bg-background p-4 flex flex-col items-center">
            <svg viewBox="0 0 400 320" className="w-full max-w-lg overflow-visible font-sans">
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    className="text-border/40"
                    strokeWidth="0.8"
                  />
                </pattern>
              </defs>
              <rect width="360" height="280" x="30" y="20" fill="url(#grid)" />
              <rect
                width="360"
                height="280"
                x="30"
                y="20"
                fill="none"
                stroke="currentColor"
                className="text-border"
                strokeWidth="1.2"
              />

              {/* Axis labels */}
              <text
                x="210"
                y="315"
                textAnchor="middle"
                className="text-[11px] fill-muted-foreground"
              >
                Feature Dimension X₁
              </text>
              <text
                x="12"
                y="160"
                textAnchor="middle"
                transform="rotate(-90 12 160)"
                className="text-[11px] fill-muted-foreground"
              >
                Feature Dimension X₂
              </text>

              {/* Data points */}
              {points.map((p, idx) => {
                // Map coordinates: x in [0, 10] -> SVG x in [40, 380]
                // y in [0, 10] -> SVG y in [290, 30]
                const svgX = 40 + (p.x / 10) * 340;
                const svgY = 290 - (p.y / 10) * 260;
                const cIdx = clusterAssignments[idx] ?? 0;
                const color = CLUSTER_COLORS[cIdx % CLUSTER_COLORS.length];

                return (
                  <g key={p.id} className="transition-all duration-300">
                    {/* Glow ring */}
                    <circle cx={svgX} cy={svgY} r="12" fill={color} fillOpacity="0.15" />
                    {/* Main point */}
                    <circle
                      cx={svgX}
                      cy={svgY}
                      r="6"
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    {/* Label */}
                    <text
                      x={svgX}
                      y={svgY - 10}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-foreground"
                    >
                      {p.label}
                    </text>
                    <text
                      x={svgX}
                      y={svgY + 16}
                      textAnchor="middle"
                      className="text-[9px] font-mono fill-muted-foreground"
                    >
                      ({p.x}, {p.y})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Cluster Legend */}
          <div className="flex flex-wrap gap-2 text-xs">
            {Array.from({ length: kClusters }).map((_, cIdx) => {
              const color = CLUSTER_COLORS[cIdx % CLUSTER_COLORS.length];
              const members = points
                .filter((_, idx) => clusterAssignments[idx] === cIdx)
                .map((p) => p.label);
              return (
                <div
                  key={cIdx}
                  className="rounded-xs border border-border bg-background px-3 py-1.5 flex items-center gap-2"
                >
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-semibold text-foreground">
                    Cluster {cIdx + 1} (SciPy) / {cIdx} (Sklearn):
                  </span>
                  <span className="font-mono text-muted-foreground text-[11px]">
                    [{members.join(", ")}] ({members.length} points)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Hierarchical Dendrogram */}
      {activeTab === "dendrogram" && (
        <div className="space-y-3">
          <div className="rounded-xs border border-border bg-background p-4 flex flex-col items-center">
            <svg viewBox="0 0 500 280" className="w-full max-w-xl overflow-visible font-sans">
              {/* Distance axis on the left */}
              <line
                x1="45"
                y1="20"
                x2="45"
                y2="240"
                stroke="currentColor"
                className="text-border"
                strokeWidth="1.5"
              />
              <text
                x="18"
                y="130"
                textAnchor="middle"
                transform="rotate(-90 18 130)"
                className="text-[10px] fill-muted-foreground"
              >
                Cophenetic Distance (Height)
              </text>

              {/* Axis ticks */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((frac) => {
                const tickDist = frac * maxDist;
                const tickY = 240 - frac * 210;
                return (
                  <g key={frac}>
                    <line
                      x1="40"
                      y1={tickY}
                      x2="45"
                      y2={tickY}
                      stroke="currentColor"
                      className="text-border"
                    />
                    <text
                      x="36"
                      y={tickY + 3}
                      textAnchor="end"
                      className="text-[9px] font-mono fill-muted-foreground"
                    >
                      {tickDist.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Dendrogram Tree Paths */}
              {(() => {
                const paths: React.ReactNode[] = [];
                const renderBranch = (node: DendroNode) => {
                  if (node.isLeaf) return;
                  const left = node.left!;
                  const right = node.right!;

                  const nodeY = 240 - (node.dist / maxDist) * 210;
                  const leftY = 240 - (left.dist / maxDist) * 210;
                  const rightY = 240 - (right.dist / maxDist) * 210;

                  const nodeX = 60 + (node.x / (n - 1)) * 400;
                  const leftX = 60 + (left.x / (n - 1)) * 400;
                  const rightX = 60 + (right.x / (n - 1)) * 400;

                  // Determine branch color: if merged above cut height, gray; else match cluster
                  const isAboveCut = node.dist > cutHeight;
                  let branchColor = "#64748b";
                  if (!isAboveCut) {
                    const firstMember = node.members[0]!;
                    const cIdx = clusterAssignments[firstMember] ?? 0;
                    branchColor = CLUSTER_COLORS[cIdx % CLUSTER_COLORS.length]!;
                  }

                  paths.push(
                    <g key={node.id}>
                      {/* Left vertical line */}
                      <line
                        x1={leftX}
                        y1={leftY}
                        x2={leftX}
                        y2={nodeY}
                        stroke={branchColor}
                        strokeWidth="1.8"
                      />
                      {/* Right vertical line */}
                      <line
                        x1={rightX}
                        y1={rightY}
                        x2={rightX}
                        y2={nodeY}
                        stroke={branchColor}
                        strokeWidth="1.8"
                      />
                      {/* Horizontal connecting bar */}
                      <line
                        x1={leftX}
                        y1={nodeY}
                        x2={rightX}
                        y2={nodeY}
                        stroke={branchColor}
                        strokeWidth="1.8"
                      />
                      {/* Node circle */}
                      <circle cx={nodeX} cy={nodeY} r="3" fill={branchColor} />
                    </g>,
                  );

                  renderBranch(left);
                  renderBranch(right);
                };

                renderBranch(nodeTree);
                return paths;
              })()}

              {/* Horizontal Cut Threshold Line */}
              {(() => {
                const cutY = 240 - Math.min(1.0, cutHeight / maxDist) * 210;
                return (
                  <g>
                    <line
                      x1="45"
                      y1={cutY}
                      x2="480"
                      y2={cutY}
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    <text
                      x="485"
                      y={cutY + 3}
                      className="text-[10px] font-bold fill-red-500 font-mono"
                    >
                      Cut t={cutHeight.toFixed(2)}
                    </text>
                  </g>
                );
              })()}

              {/* Leaf labels */}
              {points.map((p) => {
                // Find node
                const leafX = (() => {
                  let coord = 60;
                  const search = (node: DendroNode) => {
                    if (node.isLeaf && node.leafIdx === p.id) {
                      coord = 60 + (node.x / (n - 1)) * 400;
                    } else {
                      if (node.left) search(node.left);
                      if (node.right) search(node.right);
                    }
                  };
                  search(nodeTree);
                  return coord;
                })();

                const cIdx = clusterAssignments[p.id] ?? 0;
                const color = CLUSTER_COLORS[cIdx % CLUSTER_COLORS.length];

                return (
                  <g key={p.id}>
                    <circle cx={leafX} cy={240} r="4" fill={color} />
                    <text
                      x={leafX}
                      y={258}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-foreground"
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            The red dashed line marks the threshold cut height separating the tree into exactly{" "}
            <strong className="text-foreground">{kClusters} clusters</strong>.
          </p>
        </div>
      )}

      {/* TAB 3: SciPy Linkage Matrix (Z) */}
      {activeTab === "matrix" && (
        <div className="space-y-3">
          <div className="rounded-xs border border-border overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead className="bg-muted/40 border-b border-border text-foreground font-sans">
                <tr>
                  <th className="p-2.5 text-left">Merge Step</th>
                  <th className="p-2.5 text-left">Cluster A (Z[:, 0])</th>
                  <th className="p-2.5 text-left">Cluster B (Z[:, 1])</th>
                  <th className="p-2.5 text-left">Cophenetic Dist (Z[:, 2])</th>
                  <th className="p-2.5 text-left">Sample Count (Z[:, 3])</th>
                  <th className="p-2.5 text-left">New Node ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Z.map((row) => (
                  <tr key={row.step} className="hover:bg-muted/20">
                    <td className="p-2.5 text-muted-foreground font-sans font-semibold">
                      Row {row.step - 1}
                    </td>
                    <td className="p-2.5 text-teal font-bold">
                      {row.clusterA < n
                        ? (points[row.clusterA]?.label ?? row.clusterA)
                        : `Node ${row.clusterA}`}
                    </td>
                    <td className="p-2.5 text-navy font-bold">
                      {row.clusterB < n
                        ? (points[row.clusterB]?.label ?? row.clusterB)
                        : `Node ${row.clusterB}`}
                    </td>
                    <td className="p-2.5 text-foreground font-bold">{row.dist.toFixed(4)}</td>
                    <td className="p-2.5 text-muted-foreground">{row.sampleCount} observations</td>
                    <td className="p-2.5 text-foreground font-semibold">Node {row.newNodeId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/15 border border-border/80 p-3 rounded-xs space-y-1">
            <strong className="text-foreground font-sans block">
              Matrix Structure Interpretation:
            </strong>
            <p>
              SciPy stores the hierarchical tree as an <code>(n - 1) × 4</code> matrix. Original
              points are indexed <code>0, ..., {n - 1}</code>. Each merge row creates a composite
              cluster node indexed{" "}
              <code>
                {n}, {n + 1}, ...
              </code>
              . Notice how the final row synthesizes the single monolithic root node{" "}
              <code>Node {2 * n - 2}</code> encompassing all {n} data points.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: Python API Inspector */}
      {activeTab === "python" && (
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
          <p className="text-xs text-muted-foreground">
            This executable snippet directly imports and runs the active simulation in Python using
            standard <code>scipy</code> and <code>scikit-learn</code> libraries.
          </p>
        </div>
      )}
    </div>
  );
}

/** Module 10 Knowledge Check Quiz */
export function Module10Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const questions = [
    {
      id: 1,
      question:
        "In the from-scratch NumPy implementation of agglomerative clustering, why are the diagonal elements of the distance matrix set to infinity (np.inf)?",
      options: [
        "To satisfy the triangle inequality for metric spaces.",
        "To prevent self-distance (D[i, i] = 0) from being selected as the minimum pairwise distance during merge search.",
        "To ensure that all distance values are strictly non-negative.",
        "Because NumPy broadcasting cannot compute squared differences along the diagonal.",
      ],
      correct: 1,
      explanation:
        "Since the distance from an observation to itself is always 0 (identity axiom), a naive minimum search across the matrix would continuously pick the diagonal element D[i, i] = 0! Setting diagonal entries to np.inf neatly prevents self-merges without requiring expensive conditional checks inside the loop.",
    },
    {
      id: 2,
      question:
        "In SciPy's (n - 1) × 4 linkage matrix Z, what does the 4th column (Z[:, 3]) represent?",
      options: [
        "The cophenetic merge distance between the two component clusters.",
        "The total number of original data observations contained in the newly merged composite cluster.",
        "The cluster centroid coordinate along the primary principal component axis.",
        "The index of the newly formed parent node.",
      ],
      correct: 1,
      explanation:
        "The 4th column of Z stores the cardinality (sample count) of the newly merged cluster. For leaf mergers (merging two individual observations), this value is 2.0; in the final row, it equals exactly n (the full sample size).",
    },
    {
      id: 3,
      question:
        "Which constructor parameter in Scikit-Learn's AgglomerativeClustering allows clustering to respect non-convex manifolds (such as concentric circles) by restricting allowable merges?",
      options: [
        "compute_distances=True",
        "connectivity (accepting a sparse adjacency graph, such as from kneighbors_graph)",
        "distance_threshold=None",
        "linkage='ward'",
      ],
      correct: 1,
      explanation:
        "Passing a sparse connectivity graph via kneighbors_graph() restricts cluster coalescence so that only clusters sharing an edge in the neighborhood graph are permitted to merge. This prevents Euclidean short-circuiting across empty manifold space.",
    },
    {
      id: 4,
      question:
        "What is the crucial indexing difference between cluster labels returned by SciPy's fcluster() versus Scikit-Learn's AgglomerativeClustering.labels_?",
      options: [
        "SciPy returns 1-indexed cluster labels (1 to k), whereas Scikit-Learn returns 0-indexed cluster labels (0 to k - 1).",
        "SciPy labels are negative integers (-1 to -k), whereas Scikit-Learn labels are positive floats.",
        "SciPy returns cluster labels sorted in descending order of cluster variance.",
        "Scikit-Learn uses string labels ('cluster_0', 'cluster_1'), whereas SciPy uses integers.",
      ],
      correct: 0,
      explanation:
        "SciPy's fcluster() follows scientific statistical conventions and indexes cluster partitions starting from 1 (1, 2, ..., k). In contrast, Scikit-Learn strictly adheres to standard Python 0-indexing (0, 1, ..., k - 1). Mixing these conventions is a notorious source of off-by-one errors when computing validation metrics!",
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
            Module 10 Knowledge Check: Practical Implementation
          </h4>
          <p className="text-xs text-muted-foreground">
            Test your comprehension of from-scratch NumPy algorithms, SciPy linkage matrices,
            Scikit-learn estimators, and connectivity graphs.
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
