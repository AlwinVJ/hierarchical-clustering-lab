import { useState } from "react";
import {
  Link2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

/** Interactive Chaining Phenomenon Visualizer for Single vs Complete Linkage */
export function SingleLinkageChainingVisualizer() {
  const [method, setMethod] = useState<"single" | "complete">("single");
  const [threshold, setThreshold] = useState<number>(2.0);

  // 9 Points: Cluster A (left), Bridge, Cluster B (right)
  const points = [
    { id: 0, label: "A₁", x: 0.0, y: 0.0, clusterOriginal: "A" },
    { id: 1, label: "A₂", x: 0.5, y: 0.5, clusterOriginal: "A" },
    { id: 2, label: "A₃", x: 0.0, y: 1.0, clusterOriginal: "A" },
    { id: 3, label: "B₁", x: 2.0, y: 0.5, clusterOriginal: "Bridge" },
    { id: 4, label: "B₂", x: 4.0, y: 0.5, clusterOriginal: "Bridge" },
    { id: 5, label: "B₃", x: 6.0, y: 0.5, clusterOriginal: "Bridge" },
    { id: 6, label: "C₁", x: 8.0, y: 0.0, clusterOriginal: "C" },
    { id: 7, label: "C₂", x: 7.5, y: 0.5, clusterOriginal: "C" },
    { id: 8, label: "C₃", x: 8.0, y: 1.0, clusterOriginal: "C" },
  ];

  // Helper to determine cluster groupings at selected threshold:
  // For Single linkage:
  // - h < 0.75: singletons / pairs {0,1,2}, {6,7,8}
  // - 0.75 <= h < 1.55: {A}, {B1}, {B2}, {B3}, {C}
  // - 1.55 <= h < 2.05: all connected into 1 big chain (chaining!)
  // For Complete linkage:
  // - h < 1.05: {A}, {B1}, {B2}, {B3}, {C}
  // - 1.05 <= h < 4.1: {A}, {B}, {C} distinct!
  // - 4.1 <= h < 8.1: {A+B}, {C}
  // - h >= 8.1: 1 cluster

  const getClusters = () => {
    if (method === "single") {
      if (threshold < 0.75) {
        return {
          count: 5,
          desc: "Micro-clusters forming: dense left points and dense right points merge internally (d ≤ 0.71).",
          colors: [
            "#23395B",
            "#23395B",
            "#23395B",
            "#64748b",
            "#64748b",
            "#64748b",
            "#4D8580",
            "#4D8580",
            "#4D8580",
          ],
          hasChained: false,
        };
      } else if (threshold < 1.55) {
        return {
          count: 3,
          desc: "Intermediate bridge points attach to nearby clusters. Left cluster pulls B₁ (d = 1.50); right cluster pulls B₃ (d = 1.50).",
          colors: [
            "#23395B",
            "#23395B",
            "#23395B",
            "#23395B",
            "#64748b",
            "#4D8580",
            "#4D8580",
            "#4D8580",
            "#4D8580",
          ],
          hasChained: false,
        };
      } else {
        return {
          count: 1,
          desc: "CHAINING OCCURRED! Because d(B₁, B₂) = 2.0 and d(B₂, B₃) = 2.0, single linkage greedily merges the entire bridge at h = 2.0, fusing the two distant clusters into a single elongated straggly chain.",
          colors: [
            "#e11d48",
            "#e11d48",
            "#e11d48",
            "#e11d48",
            "#e11d48",
            "#e11d48",
            "#e11d48",
            "#e11d48",
            "#e11d48",
          ],
          hasChained: true,
        };
      }
    } else {
      // Complete Linkage
      if (threshold < 1.05) {
        return {
          count: 5,
          desc: "Dense left cluster A and right cluster C coalesce internally at maximum pairwise distance d = 1.00.",
          colors: [
            "#23395B",
            "#23395B",
            "#23395B",
            "#64748b",
            "#64748b",
            "#64748b",
            "#4D8580",
            "#4D8580",
            "#4D8580",
          ],
          hasChained: false,
        };
      } else if (threshold < 4.1) {
        return {
          count: 3,
          desc: "RESISTANCE TO CHAINING: Even though bridge points are nearby, Complete Linkage requires the MAXIMUM distance across clusters. It keeps Cluster A and Cluster C completely separate because max distance between them is 8.06 > h.",
          colors: [
            "#23395B",
            "#23395B",
            "#23395B",
            "#64748b",
            "#64748b",
            "#64748b",
            "#4D8580",
            "#4D8580",
            "#4D8580",
          ],
          hasChained: false,
        };
      } else if (threshold < 8.1) {
        return {
          count: 2,
          desc: "Bridge merges with Cluster A (max distance ~4.03). Cluster C remains safely isolated as an autonomous compact group.",
          colors: [
            "#23395B",
            "#23395B",
            "#23395B",
            "#23395B",
            "#23395B",
            "#23395B",
            "#4D8580",
            "#4D8580",
            "#4D8580",
          ],
          hasChained: false,
        };
      } else {
        return {
          count: 1,
          desc: "Final merge: All clusters coalesce only when the threshold exceeds the global maximum diameter (d = 8.0623 between A₁ and C₃).",
          colors: [
            "#8b5cf6",
            "#8b5cf6",
            "#8b5cf6",
            "#8b5cf6",
            "#8b5cf6",
            "#8b5cf6",
            "#8b5cf6",
            "#8b5cf6",
            "#8b5cf6",
          ],
          hasChained: false,
        };
      }
    }
  };

  const state = getClusters();

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-teal" />
            <h4 className="font-bold text-sm text-foreground">
              Single vs. Complete Linkage: Chaining Phenomenon Explorer
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare how nearest-neighbor (Single) versus farthest-neighbor (Complete) criteria
            handle noise bridges between clusters.
          </p>
        </div>

        {/* Linkage Method Toggle */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-sm border border-border">
          <button
            onClick={() => setMethod("single")}
            className={`px-3 py-1 text-xs rounded-sm transition-colors flex items-center gap-1.5 ${
              method === "single"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Minimize2 className="h-3 w-3" />
            Single Linkage (Min)
          </button>
          <button
            onClick={() => setMethod("complete")}
            className={`px-3 py-1 text-xs rounded-sm transition-colors flex items-center gap-1.5 ${
              method === "complete"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Maximize2 className="h-3 w-3" />
            Complete Linkage (Max)
          </button>
        </div>
      </div>

      {/* Threshold Slider Controller */}
      <div className="bg-muted/20 border border-border p-4 rounded-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-foreground flex items-center gap-1.5">
            <span>Dendrogram Cut Threshold (h):</span>
            <span className="font-mono text-teal bg-teal/10 px-2 py-0.5 rounded-xs border border-teal/20">
              {threshold.toFixed(2)}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-mono">Active Clusters: {state.count}</span>
            <button
              onClick={() => setThreshold(2.0)}
              className="p-1 text-muted-foreground hover:text-foreground"
              title="Reset threshold"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>

        <input
          type="range"
          min="0.5"
          max="8.5"
          step="0.1"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          className="w-full accent-teal cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
          <span>0.5 (Fine micro-pairs)</span>
          <span>2.0 (Bridge merge height)</span>
          <span>8.5 (Global diameter)</span>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 border border-border rounded-sm p-4 bg-background space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span>Data Distribution in ℝ² (Noise Bridge Scenario)</span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {method === "single" ? "D(A,B) = min d(a,b)" : "D(A,B) = max d(a,b)"}
            </span>
          </div>

          <div className="relative w-full aspect-[2/1] bg-muted/10 border border-border/60 rounded-xs overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 400 160" className="w-full h-full">
              {/* Coordinate Grid */}
              <defs>
                <pattern id="chain-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border/60"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#chain-grid)" />

              {/* Axis lines */}
              <line
                x1="30"
                y1="130"
                x2="380"
                y2="130"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
              />

              {/* Mapping: x: [0..8] -> [40..360] (dx = 40), y: [0..1] -> [120..40] (dy = -80) */}

              {/* Chaining connector line when single linkage and chained */}
              {method === "single" && threshold >= 1.55 && (
                <path
                  d="M 50 120 L 60 80 L 50 40 L 120 80 L 200 80 L 280 80 L 350 80 L 360 40 L 360 120"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                />
              )}

              {/* Cluster A Box */}
              <rect
                x="32"
                y="30"
                width="36"
                height="100"
                rx="8"
                fill="#23395B"
                fillOpacity="0.08"
                stroke="#23395B"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text
                x="50"
                y="24"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fill="#23395B"
              >
                Cluster A
              </text>

              {/* Cluster C Box */}
              <rect
                x="332"
                y="30"
                width="36"
                height="100"
                rx="8"
                fill="#4D8580"
                fillOpacity="0.08"
                stroke="#4D8580"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text
                x="350"
                y="24"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fill="#4D8580"
              >
                Cluster C
              </text>

              {/* Noise Bridge Label */}
              <text
                x="200"
                y="55"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                fill="#64748b"
              >
                Noise Bridge Points: B₁, B₂, B₃ (gap = 2.0)
              </text>

              {/* Points */}
              {points.map((pt, idx) => {
                const cx = 40 + pt.x * 40;
                const cy = 120 - pt.y * 80;
                const color = state.colors[idx];

                return (
                  <g key={pt.id}>
                    <circle cx={cx} cy={cy} r="6" fill={color} stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={cx}
                      y={cy + 15}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="currentColor"
                      className="text-foreground"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground pt-1">
            <span>Left: Cluster A (d ≤ 1.0)</span>
            <span>Center: Noise Bridge (d = 2.0 between nodes)</span>
            <span>Right: Cluster C (d ≤ 1.0)</span>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-border rounded-sm p-4 bg-background space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              {state.hasChained ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-teal" />
              )}
              <span>Behavioral Outcome</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{state.desc}</p>

            <div className="border-t border-border pt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Criterion:</span>
                <span className="font-mono font-semibold text-foreground">
                  {method === "single" ? "Minimum Distance" : "Maximum Distance"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chain Vulnerability:</span>
                <span
                  className={`font-mono font-semibold ${
                    method === "single" ? "text-red-600 dark:text-red-400" : "text-teal"
                  }`}
                >
                  {method === "single" ? "High (susceptible)" : "Low (resistant)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cluster Geometry:</span>
                <span className="font-mono text-foreground">
                  {method === "single" ? "Arbitrary / Elongated" : "Compact / Spherical"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 border border-border p-3.5 rounded-sm space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Key Mathematical Takeaway</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              In Single Linkage, two clusters merge if a <em>single</em> pair of points is close. In
              Complete Linkage, clusters only merge if <em>all</em> pairs are within the distance
              threshold.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
