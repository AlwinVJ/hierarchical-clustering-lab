import { useState, useMemo } from "react";
import {
  Network,
  RotateCcw,
  Sparkles,
  Scissors,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  Layers,
  Table as TableIcon,
  Info,
} from "lucide-react";

interface DendrogramNode {
  id: string;
  label?: string;
  isLeaf: boolean;
  leafIndex?: number;
  height: number;
  left?: DendrogramNode;
  right?: DendrogramNode;
  pointIndices: number[];
}

/** Interactive Dendrogram Slicing & Cophenetic Correlation Explorer */
export function DendrogramExplorer() {
  const [method, setMethod] = useState<"single" | "complete" | "average" | "centroid" | "ward">(
    "average",
  );

  // Cutting threshold height slider
  const [cutoffHeight, setCutoffHeight] = useState<number>(3.0);

  // Linkage tree data for the canonical 4-point benchmark:
  // P1(1,2), P2(2,3), P3(6,5), P4(7,6)
  const treesByMethod: Record<
    "single" | "complete" | "average" | "centroid" | "ward",
    {
      rootHeight: number;
      merge1Height: number;
      merge2Height: number;
      ccc: number;
      copheneticDists: number[]; // P1-P2, P1-P3, P1-P4, P2-P3, P2-P4, P3-P4
    }
  > = {
    single: {
      rootHeight: 4.4721,
      merge1Height: 1.4142,
      merge2Height: 1.4142,
      ccc: 0.935,
      copheneticDists: [1.4142, 4.4721, 4.4721, 4.4721, 4.4721, 1.4142],
    },
    complete: {
      rootHeight: 7.2111,
      merge1Height: 1.4142,
      merge2Height: 1.4142,
      ccc: 0.935,
      copheneticDists: [1.4142, 7.2111, 7.2111, 7.2111, 7.2111, 1.4142],
    },
    average: {
      rootHeight: 5.8363,
      merge1Height: 1.4142,
      merge2Height: 1.4142,
      ccc: 0.935,
      copheneticDists: [1.4142, 5.8363, 5.8363, 5.8363, 5.8363, 1.4142],
    },
    centroid: {
      rootHeight: 5.831,
      merge1Height: 1.4142,
      merge2Height: 1.4142,
      ccc: 0.935,
      copheneticDists: [1.4142, 5.831, 5.831, 5.831, 5.831, 1.4142],
    },
    ward: {
      rootHeight: 8.2462,
      merge1Height: 1.4142,
      merge2Height: 1.4142,
      ccc: 0.935,
      copheneticDists: [1.4142, 8.2462, 8.2462, 8.2462, 8.2462, 1.4142],
    },
  };

  const curr = treesByMethod[method];

  // Ground Euclidean pairwise distances for canonical benchmark
  const origDists = [1.4142, 5.831, 7.2111, 4.4721, 5.831, 1.4142];
  const pairLabels = ["d(P₁, P₂)", "d(P₁, P₃)", "d(P₁, P₄)", "d(P₂, P₃)", "d(P₂, P₄)", "d(P₃, P₄)"];

  // Cluster determination based on cutoff height:
  // If cutoff >= rootHeight -> 1 cluster: {P1, P2, P3, P4}
  // If merge1Height <= cutoff < rootHeight -> 2 clusters: {P1, P2} and {P3, P4}
  // If cutoff < merge1Height -> 4 singleton clusters: {P1}, {P2}, {P3}, {P4}
  let numClusters = 2;
  let clustersDesc: { name: string; points: string; color: string }[] = [];

  if (cutoffHeight >= curr.rootHeight) {
    numClusters = 1;
    clustersDesc = [
      {
        name: "Cluster 1",
        points: "{ P₁(1,2), P₂(2,3), P₃(6,5), P₄(7,6) }",
        color: "text-navy bg-navy/10 border-navy/30",
      },
    ];
  } else if (cutoffHeight >= curr.merge1Height) {
    numClusters = 2;
    clustersDesc = [
      {
        name: "Cluster 1",
        points: "{ P₁(1,2), P₂(2,3) }",
        color: "text-teal bg-teal/10 border-teal/30",
      },
      {
        name: "Cluster 2",
        points: "{ P₃(6,5), P₄(7,6) }",
        color: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/30",
      },
    ];
  } else {
    numClusters = 4;
    clustersDesc = [
      { name: "Cluster 1", points: "{ P₁(1,2) }", color: "text-teal bg-teal/10 border-teal/30" },
      { name: "Cluster 2", points: "{ P₂(2,3) }", color: "text-navy bg-navy/10 border-navy/30" },
      {
        name: "Cluster 3",
        points: "{ P₃(6,5) }",
        color: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/30",
      },
      {
        name: "Cluster 4",
        points: "{ P₄(7,6) }",
        color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
      },
    ];
  }

  // SVG dimensions for dendrogram
  const svgWidth = 440;
  const svgHeight = 240;
  const maxScaleHeight = 9.0;
  const bottomY = svgHeight - 35;
  const topY = 25;

  const toSvgY = (h: number) => bottomY - (h / maxScaleHeight) * (bottomY - topY);

  // Leaf X coordinates: 4 leaves spaced evenly
  const xCoords = [60, 140, 240, 320];

  // Node coordinates:
  // Node C4 merges leaf 0 and leaf 1: x = (60+140)/2 = 100, y = toSvgY(curr.merge1Height)
  // Node C5 merges leaf 2 and leaf 3: x = (240+320)/2 = 280, y = toSvgY(curr.merge2Height)
  // Root merges C4 and C5: x = (100+280)/2 = 190, y = toSvgY(curr.rootHeight)
  const xC4 = (xCoords[0]! + xCoords[1]!) / 2;
  const yC4 = toSvgY(curr.merge1Height);

  const xC5 = (xCoords[2]! + xCoords[3]!) / 2;
  const yC5 = toSvgY(curr.merge2Height);

  const xRoot = (xC4 + xC5) / 2;
  const yRoot = toSvgY(curr.rootHeight);

  const yCut = toSvgY(cutoffHeight);

  // Dynamic branch coloring based on cutoff
  const colorSubtree1 =
    cutoffHeight < curr.merge1Height
      ? "stroke-muted-foreground"
      : numClusters === 1
        ? "stroke-navy"
        : "stroke-teal";

  const colorSubtree2 =
    cutoffHeight < curr.merge2Height
      ? "stroke-muted-foreground"
      : numClusters === 1
        ? "stroke-navy"
        : "stroke-violet-500";

  const colorRootLink =
    cutoffHeight < curr.rootHeight ? "stroke-muted-foreground/50" : "stroke-navy";

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-teal" />
            <h4 className="font-bold text-sm text-foreground">
              Interactive Dendrogram Slicing &amp; Cophenetic Analysis Explorer
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cut the hierarchical dendrogram tree horizontally, extract flat clusters, and compare
            cophenetic vs original pairwise distances.
          </p>
        </div>

        {/* Linkage Method Buttons */}
        <div className="flex flex-wrap gap-1 bg-muted/40 p-1 rounded-sm border border-border">
          {(
            [
              ["single", "Single"],
              ["complete", "Complete"],
              ["average", "Average (UPGMA)"],
              ["centroid", "Centroid"],
              ["ward", "Ward"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setMethod(key);
                if (cutoffHeight > treesByMethod[key].rootHeight) {
                  setCutoffHeight(treesByMethod[key].rootHeight * 0.6);
                }
              }}
              className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
                method === key
                  ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Slicing Controls */}
      <div className="bg-muted/20 border border-border p-4 rounded-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Scissors className="h-3.5 w-3.5 text-destructive" />
            Horizontal Slicing Threshold (h_cut):
          </span>
          <span className="font-mono font-bold text-destructive">
            h_cut = {cutoffHeight.toFixed(2)} (Yields k = {numClusters} Clusters)
          </span>
        </div>

        <input
          type="range"
          min="0.2"
          max={maxScaleHeight - 0.2}
          step="0.05"
          value={cutoffHeight}
          onChange={(e) => setCutoffHeight(parseFloat(e.target.value))}
          className="w-full accent-destructive cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
          <span>0.2 (k=4 Singletons)</span>
          <span>h₁ = {curr.merge1Height.toFixed(2)} (First Merges)</span>
          <span>Root = {curr.rootHeight.toFixed(2)} (All Unified)</span>
          <span>9.0 (k=1 Grand Cluster)</span>
        </div>
      </div>

      {/* Main Visualizer: SVG Dendrogram Tree + Sliced Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Dendrogram Tree Display (7 Cols) */}
        <div className="lg:col-span-7 border border-border rounded-sm p-3 bg-background space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-foreground">
              Dendrogram Tree ({method.toUpperCase()} Linkage):
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              Root Merge Height: {curr.rootHeight.toFixed(4)}
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full max-w-full aspect-[440/240] select-none"
            >
              {/* Y-Axis (Distance Scale) */}
              <line x1={35} y1={topY} x2={35} y2={bottomY} className="stroke-border stroke-1" />
              {[0, 2, 4, 6, 8].map((hVal) => (
                <g key={`y-tick-${hVal}`}>
                  <line
                    x1={30}
                    y1={toSvgY(hVal)}
                    x2={35}
                    y2={toSvgY(hVal)}
                    className="stroke-border stroke-1"
                  />
                  <line
                    x1={35}
                    y1={toSvgY(hVal)}
                    x2={svgWidth - 20}
                    y2={toSvgY(hVal)}
                    className="stroke-border/30 stroke-[0.75]"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={26}
                    y={toSvgY(hVal) + 3}
                    textAnchor="end"
                    className="fill-muted-foreground text-[8px] font-mono"
                  >
                    {hVal}
                  </text>
                </g>
              ))}

              {/* Subtree 1 (P1 and P2) */}
              {/* Vertical branch from P1 */}
              <line
                x1={xCoords[0]}
                y1={bottomY}
                x2={xCoords[0]}
                y2={yC4}
                className={`${colorSubtree1} stroke-2`}
              />
              {/* Vertical branch from P2 */}
              <line
                x1={xCoords[1]}
                y1={bottomY}
                x2={xCoords[1]}
                y2={yC4}
                className={`${colorSubtree1} stroke-2`}
              />
              {/* Horizontal bridge across P1 and P2 at yC4 */}
              <line
                x1={xCoords[0]}
                y1={yC4}
                x2={xCoords[1]}
                y2={yC4}
                className={`${colorSubtree1} stroke-2`}
              />

              {/* Subtree 2 (P3 and P4) */}
              {/* Vertical branch from P3 */}
              <line
                x1={xCoords[2]}
                y1={bottomY}
                x2={xCoords[2]}
                y2={yC5}
                className={`${colorSubtree2} stroke-2`}
              />
              {/* Vertical branch from P4 */}
              <line
                x1={xCoords[3]}
                y1={bottomY}
                x2={xCoords[3]}
                y2={yC5}
                className={`${colorSubtree2} stroke-2`}
              />
              {/* Horizontal bridge across P3 and P4 at yC5 */}
              <line
                x1={xCoords[2]}
                y1={yC5}
                x2={xCoords[3]}
                y2={yC5}
                className={`${colorSubtree2} stroke-2`}
              />

              {/* Root Bridges joining C4 and C5 */}
              <line x1={xC4} y1={yC4} x2={xC4} y2={yRoot} className={`${colorRootLink} stroke-2`} />
              <line x1={xC5} y1={yC5} x2={xC5} y2={yRoot} className={`${colorRootLink} stroke-2`} />
              <line
                x1={xC4}
                y1={yRoot}
                x2={xC5}
                y2={yRoot}
                className={`${colorRootLink} stroke-2`}
              />

              {/* Horizontal Slicing Line (Cutoff) */}
              <line
                x1={35}
                y1={yCut}
                x2={svgWidth - 20}
                y2={yCut}
                className="stroke-destructive stroke-2"
                strokeDasharray="5 3"
              />
              <text
                x={svgWidth - 25}
                y={yCut - 4}
                textAnchor="end"
                className="fill-destructive text-[9px] font-bold font-mono"
              >
                h_cut = {cutoffHeight.toFixed(2)}
              </text>

              {/* Leaf Nodes & Labels */}
              {["P₁(1,2)", "P₂(2,3)", "P₃(6,5)", "P₄(7,6)"].map((lbl, idx) => (
                <g key={`leaf-${idx}`}>
                  <circle cx={xCoords[idx]} cy={bottomY} r={3.5} className="fill-foreground" />
                  <text
                    x={xCoords[idx]}
                    y={bottomY + 14}
                    textAnchor="middle"
                    className="fill-foreground font-mono text-[9px] font-semibold"
                  >
                    {lbl}
                  </text>
                </g>
              ))}

              {/* Node Height Badges */}
              <text x={xC4 + 6} y={yC4 - 4} className="fill-muted-foreground text-[8px] font-mono">
                h₁={curr.merge1Height.toFixed(2)}
              </text>
              <text x={xC5 + 6} y={yC5 - 4} className="fill-muted-foreground text-[8px] font-mono">
                h₂={curr.merge2Height.toFixed(2)}
              </text>
              <text
                x={xRoot}
                y={yRoot - 6}
                textAnchor="middle"
                className="fill-navy font-bold text-[9px] font-mono"
              >
                Root h₃={curr.rootHeight.toFixed(2)}
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-2">
            <span>U-shaped links represent cluster coalescence events.</span>
            <span className="font-mono">Leaf spacing does NOT reflect 1D proximity.</span>
          </div>
        </div>

        {/* Extracted Flat Clusters & CCC Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Extracted Flat Clusters Box */}
          <div className="border border-border rounded-sm p-4 bg-background space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                Extracted Flat Clusters (k = {numClusters})
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-xs bg-navy text-primary-foreground">
                Cut at h = {cutoffHeight.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              {clustersDesc.map((cl, cIdx) => (
                <div
                  key={cIdx}
                  className={`p-2.5 rounded-xs border text-xs flex flex-col gap-0.5 ${cl.color}`}
                >
                  <span className="font-bold">{cl.name}</span>
                  <span className="font-mono text-[11px] opacity-90">{cl.points}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
              {numClusters === 2 &&
                "Natural 2-cluster partition identified: the long vertical gap between h₁ (1.41) and root height marks the optimal separation threshold."}
              {numClusters === 1 &&
                "Cutoff is positioned above the root merge height: all data points are lumped into a single grand cluster."}
              {numClusters === 4 &&
                "Cutoff is below the earliest merge height: all data points remain unmerged singletons."}
            </p>
          </div>

          {/* Cophenetic Correlation Coefficient Box */}
          <div className="border border-border rounded-sm p-4 bg-teal/5 border-teal/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-foreground">
                Cophenetic Correlation (CCC)
              </span>
              <span className="text-xs font-mono font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-xs border border-teal/20">
                c = {curr.ccc.toFixed(4)}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Measures how faithfully the dendrogram cophenetic distance matrix C preserves original
              pairwise Euclidean distances D (Sokal &amp; Rohlf, 1962).
            </p>

            <div className="p-2 bg-background/80 rounded-xs border border-border text-[11px] font-mono space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Correlation Category:</span>
                <span className="font-bold text-teal">Excellent (c &gt; 0.90)</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Metric Preservation:</span>
                <span className="text-foreground">High Hierarchical Fidelity</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Distance Matrix Inspection Table */}
      <div className="border border-border rounded-sm p-4 bg-background space-y-3">
        <div className="flex items-center gap-2">
          <TableIcon className="h-4 w-4 text-teal" />
          <h5 className="font-bold text-xs text-foreground">
            Pairwise Euclidean Distances (D) vs. Dendrogram Cophenetic Distances (C)
          </h5>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-border">
            <thead>
              <tr className="bg-muted/40 text-foreground font-semibold border-b border-border">
                <th className="p-2">Point Pair</th>
                <th className="p-2">Original Euclidean Distance d(x_i, x_j)</th>
                <th className="p-2">Lowest Common Ancestor Merge</th>
                <th className="p-2">Cophenetic Distance c(x_i, x_j)</th>
                <th className="p-2">Distortion Metric |d - c|</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-mono">
              {pairLabels.map((lbl, pIdx) => {
                const orig = origDists[pIdx]!;
                const coph = curr.copheneticDists[pIdx]!;
                const distortion = Math.abs(orig - coph);
                const lcaName =
                  pIdx === 0
                    ? "Merge 1 (C₄ = {P₁, P₂})"
                    : pIdx === 5
                      ? "Merge 2 (C₅ = {P₃, P₄})"
                      : "Root Merge (C₆ = C₄ ∪ C₅)";

                return (
                  <tr key={pIdx} className="hover:bg-muted/20">
                    <td className="p-2 font-sans font-medium text-foreground">{lbl}</td>
                    <td className="p-2 text-foreground">{orig.toFixed(4)}</td>
                    <td className="p-2 font-sans text-muted-foreground text-[11px]">{lcaName}</td>
                    <td className="p-2 text-teal font-semibold">{coph.toFixed(4)}</td>
                    <td className="p-2 text-muted-foreground">{distortion.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** Interactive Ultrametric Inequality Visualizer */
export function UltrametricPropertyVisualizer() {
  const [pointTriple, setPointTriple] = useState<[number, number, number]>([0, 1, 2]);

  const pointsData = [
    { name: "P₁(1,2)", cluster: "C₄" },
    { name: "P₂(2,3)", cluster: "C₄" },
    { name: "P₃(6,5)", cluster: "C₅" },
    { name: "P₄(7,6)", cluster: "C₅" },
  ];

  // Cophenetic distance matrix for Average linkage on 4 points:
  // P1-P2: 1.4142, P3-P4: 1.4142, all others: 5.8363
  const getCophenetic = (i: number, j: number) => {
    if (i === j) return 0;
    if ((i === 0 && j === 1) || (i === 1 && j === 0)) return 1.4142;
    if ((i === 2 && j === 3) || (i === 3 && j === 2)) return 1.4142;
    return 5.8363;
  };

  const [a, b, c] = pointTriple;
  const dAB = getCophenetic(a, b);
  const dBC = getCophenetic(b, c);
  const dAC = getCophenetic(a, c);

  // Evaluate Ultrametric Inequality:
  // d(A, C) <= max(d(A, B), d(B, C))
  // d(A, B) <= max(d(A, C), d(B, C))
  // d(B, C) <= max(d(A, B), d(A, C))
  const maxBC = Math.max(dAB, dBC);
  const satisfies1 = dAC <= maxBC + 0.0001;

  const maxAC = Math.max(dAC, dBC);
  const satisfies2 = dAB <= maxAC + 0.0001;

  const maxAB = Math.max(dAB, dAC);
  const satisfies3 = dBC <= maxAB + 0.0001;

  const allSatisfied = satisfies1 && satisfies2 && satisfies3;

  // Check triangle side equality
  const sides = [dAB, dBC, dAC].sort((x, y) => x - y);
  const isIsoscelesUltrametric = Math.abs(sides[1]! - sides[2]!) < 0.001;

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-teal" />
            <h4 className="font-bold text-sm text-foreground">
              Ultrametric Inequality &amp; Isosceles Triangle Theorem
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dendrogram cophenetic distances induce an ultrametric space where every triangle has its
            two longest sides equal.
          </p>
        </div>

        {/* Triple Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Select Point Triple:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPointTriple([0, 1, 2])}
              className={`px-2 py-1 rounded-xs border text-xs font-mono ${
                a === 0 && b === 1 && c === 2
                  ? "bg-navy text-primary-foreground font-semibold"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              (P₁, P₂, P₃)
            </button>
            <button
              onClick={() => setPointTriple([0, 2, 3])}
              className={`px-2 py-1 rounded-xs border text-xs font-mono ${
                a === 0 && b === 2 && c === 3
                  ? "bg-navy text-primary-foreground font-semibold"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              (P₁, P₃, P₄)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-sm border border-border bg-background space-y-1">
          <span className="text-[10px] text-muted-foreground font-sans uppercase">
            Side 1: d_coph({pointsData[a]!.name.split("(")[0]}, {pointsData[b]!.name.split("(")[0]})
          </span>
          <div className="text-base font-bold text-navy">{dAB.toFixed(4)}</div>
          <span className="text-[11px] text-muted-foreground font-sans">
            {dAB < 2 ? "Within C₄ merge" : "Cross-cluster root merge"}
          </span>
        </div>

        <div className="p-3 rounded-sm border border-border bg-background space-y-1">
          <span className="text-[10px] text-muted-foreground font-sans uppercase">
            Side 2: d_coph({pointsData[b]!.name.split("(")[0]}, {pointsData[c]!.name.split("(")[0]})
          </span>
          <div className="text-base font-bold text-navy">{dBC.toFixed(4)}</div>
          <span className="text-[11px] text-muted-foreground font-sans">
            {dBC < 2 ? "Within C₅ merge" : "Cross-cluster root merge"}
          </span>
        </div>

        <div className="p-3 rounded-sm border border-border bg-background space-y-1">
          <span className="text-[10px] text-muted-foreground font-sans uppercase">
            Side 3: d_coph({pointsData[a]!.name.split("(")[0]}, {pointsData[c]!.name.split("(")[0]})
          </span>
          <div className="text-base font-bold text-navy">{dAC.toFixed(4)}</div>
          <span className="text-[11px] text-muted-foreground font-sans">
            {dAC < 2 ? "Within-cluster merge" : "Cross-cluster root merge"}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-sm border border-teal/20 bg-teal/5 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">
            Ultrametric Strong Triangle Inequality Evaluation:
          </span>
          <span className="font-mono font-bold text-teal flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Strictly Verified (No Scalene Triangles)
          </span>
        </div>

        <div className="space-y-1 font-mono text-muted-foreground">
          <p>
            1. d(A, C) ≤ max(d(A, B), d(B, C)) &rarr; {dAC.toFixed(4)} ≤ max({dAB.toFixed(4)},{" "}
            {dBC.toFixed(4)}) = {maxBC.toFixed(4)} ✓
          </p>
          <p>
            2. d(A, B) ≤ max(d(A, C), d(B, C)) &rarr; {dAB.toFixed(4)} ≤ max({dAC.toFixed(4)},{" "}
            {dBC.toFixed(4)}) = {maxAC.toFixed(4)} ✓
          </p>
          <p>
            3. d(B, C) ≤ max(d(A, B), d(A, C)) &rarr; {dBC.toFixed(4)} ≤ max({dAB.toFixed(4)},{" "}
            {dAC.toFixed(4)}) = {maxAB.toFixed(4)} ✓
          </p>
        </div>

        <p className="font-sans text-muted-foreground leading-relaxed pt-1">
          Notice that the two longest sides have identical lengths ({sides[1]!.toFixed(4)} =={" "}
          {sides[2]!.toFixed(4)}). In an ultrametric tree, every triangle is either equilateral or
          acute isosceles with the base being shorter than the two legs. Scalene triangles with
          three unequal side lengths cannot exist in any hierarchical clustering dendrogram.
        </p>
      </div>
    </div>
  );
}

/** Module 08 Knowledge Check Quiz */
export function Module08Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const questions = [
    {
      id: 1,
      question:
        "What is the mathematical definition of the cophenetic distance c(x_i, x_j) between two observations in a hierarchical clustering dendrogram?",
      options: [
        "The horizontal distance between the leaf positions of x_i and x_j along the bottom axis.",
        "The merge height of the lowest common ancestor (LCA) node where x_i and x_j first unite into the same cluster.",
        "The original Euclidean distance d₂(x_i, x_j) multiplied by the tree depth.",
        "The arithmetic difference between the cluster variance and the singleton variances.",
      ],
      correct: 1,
      explanation:
        "Cophenetic distance c(x_i, x_j) is defined precisely as the height of the lowest common ancestor (LCA) node in the dendrogram where the branches containing x_i and x_j first merge.",
    },
    {
      id: 2,
      question:
        "Which of the following is a fundamental geometric property of any metric space that satisfies the ultrametric inequality d(x, z) ≤ max(d(x, y), d(y, z))?",
      options: [
        "Every triangle in the space is scalene with three distinct edge lengths.",
        "Every triangle in the space is isosceles with its two longest sides having identical length.",
        "The sum of angles in any triangle strictly exceeds 180 degrees.",
        "Distance values can be negative if points belong to different subtrees.",
      ],
      correct: 1,
      explanation:
        "The strong triangle inequality implies that for any three points x, y, z, the two largest pairwise distances must be equal. Therefore, every triangle in an ultrametric space is either equilateral or acute isosceles with the base shorter than the two equal legs.",
    },
    {
      id: 3,
      question:
        "What does a Cophenetic Correlation Coefficient (CCC) of c = 0.935 indicate about a hierarchical clustering model?",
      options: [
        "The model is severely overfitted and should be pruned to 1 cluster.",
        "The dendrogram tree preserves original pairwise distances with very high fidelity.",
        "93.5% of the data points are identified as extreme outliers.",
        "The clustering algorithm violated monotonicity and produced inversions.",
      ],
      correct: 1,
      explanation:
        "The Cophenetic Correlation Coefficient (CCC) is the Pearson correlation between the original dissimilarity matrix D and the cophenetic distance matrix C. A score of c > 0.85 indicates excellent preservation of original spatial proximity.",
    },
    {
      id: 4,
      question:
        "Why can you NOT infer that observation P₂ is closer to P₃ than to P₁ simply because P₂ is plotted adjacent to P₃ along the horizontal leaf axis of a dendrogram?",
      options: [
        "Because horizontal spacing is drawn on a logarithmic scale.",
        "Because the horizontal order can be permuted at any internal node by swapping sibling branches without altering the tree's mathematical topology.",
        "Because leaf nodes are always sorted by feature variance rather than distance.",
        "Because dendrograms only display cluster labels, not observational coordinates.",
      ],
      correct: 1,
      explanation:
        "A dendrogram represents a mobile tree: any internal node can be rotated (swapping left and right child subtrees) without altering the merge heights or cluster hierarchy. Proximity in hierarchical clustering is determined exclusively by the vertical merge height of the lowest common ancestor, not by horizontal leaf adjacency.",
    },
    {
      id: 5,
      question:
        "In a Tanglegram comparing two hierarchical trees (e.g. Single vs Ward Linkage), what does a large number of crossing connector lines between the two dendrograms indicate?",
      options: [
        "Topological discordance and differing cluster arrangements between the two linkage criteria.",
        "Identical clustering results with zero variance.",
        "That the dataset contains no clusters.",
        "That the algorithm encountered an inversion.",
      ],
      correct: 0,
      explanation:
        "In a Tanglegram, observations are aligned between two face-to-face dendrograms. When the two trees agree on clustering order and subtree groupings, connecting lines run parallel with few crossings. Entangled, intersecting lines visually diagnose topological disagreement, highlighting observations that get grouped into different subtrees depending on the linkage criterion.",
    },
    {
      id: 6,
      question:
        "What does Baker's Gamma correlation coefficient (γ) measure when comparing two dendrogram trees?",
      options: [
        "The difference in Euclidean distance between the tree roots.",
        "The rank correlation (Spearman's rank correlation) between the pairwise cophenetic distance vectors of the two trees.",
        "The proportion of singleton clusters discarded during agglomeration.",
        "The exact computation time ratio between Single and Ward linkage.",
      ],
      correct: 1,
      explanation:
        "Baker's Gamma index (1974) calculates the Spearman rank-order correlation between the cophenetic distance matrices of two dendrograms (N(N-1)/2 pairs). Because it operates on ranks rather than raw heights, Baker's Gamma evaluates whether two trees agree on relative hierarchy and merge sequences, regardless of non-linear scale expansions.",
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
            Module 08 Knowledge Check: Dendrograms &amp; Ultrametric Theory
          </h4>
          <p className="text-xs text-muted-foreground">
            Test your understanding of tree anatomy, ultrametric inequalities, cophenetic
            correlation, horizontal cutting criteria, and leaf order invariance.
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
