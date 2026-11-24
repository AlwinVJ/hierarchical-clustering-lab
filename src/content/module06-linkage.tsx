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

/** Interactive Centroid Linkage Inversion Demonstration Visualizer */
export function CentroidLinkageInversionVisualizer() {
  const [activeStep, setActiveStep] = useState<number>(3);

  // The 4 verified counterexample points:
  // P1: (0.0, 0.0)
  // P2: (1.0, 0.0)
  // P3: (0.5, 0.1)
  // P4: (0.7, 0.6)

  const steps = [
    {
      step: 1,
      title: "Step 1: First Merge (P₁ and P₃)",
      h: 0.5099,
      desc: "P₁(0,0) and P₃(0.5,0.1) have minimal distance d = 0.5099. They merge into C₄ with centroid μ₄ = (0.25, 0.05).",
      status: "Monotonic (Initial)",
      hasInversion: false,
    },
    {
      step: 2,
      title: "Step 2: Second Merge (P₂ and P₄)",
      h: 0.6708,
      desc: "P₂(1,0) and P₄(0.7,0.6) merge at distance d = 0.6708 into C₅ with centroid μ₅ = (0.85, 0.30). Merge height increases normally (0.5099 → 0.6708).",
      status: "Monotonic (h₂ > h₁)",
      hasInversion: false,
    },
    {
      step: 3,
      title: "Step 3: Root Merge (C₄ and C₅) — Inversion Occurs!",
      h: 0.65,
      desc: "The distance between centroid μ₄(0.25, 0.05) and centroid μ₅(0.85, 0.30) is ||μ₄ - μ₅|| = √(0.60² + 0.25²) = 0.6500. Because 0.6500 < 0.6708, the merge height DECREASES!",
      status: "NON-MONOTONIC INVERSION (h₃ < h₂)",
      hasInversion: true,
    },
  ];

  const current = steps[activeStep - 1];

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <h4 className="font-bold text-sm text-foreground">
              Centroid Linkage Inversion Demonstration (4-Point Counterexample)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            A concrete numerical proof that Centroid Linkage violates monotonicity, producing a
            dendrogram reversal.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-sm border border-border">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setActiveStep(s)}
              className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                activeStep === s
                  ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Merge {s} {s === 3 ? "(Inversion)" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Scatter, Right Dendrogram Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (6 cols): 2D Geometry & Centroids */}
        <div className="lg:col-span-6 border border-border rounded-sm p-4 bg-background space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span>Observation Space & Shifting Centroids</span>
            <span className="text-[11px] font-mono text-muted-foreground">ℝ² Coordinates</span>
          </div>

          <div className="relative w-full aspect-[4/3] bg-muted/10 border border-border/60 rounded-xs overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 320 240" className="w-full h-full">
              <defs>
                <pattern id="inv-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border/60"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#inv-grid)" />

              {/* Axes: x in [-0.2..1.2] -> [30..290], y in [-0.1..0.8] -> [200..30] */}
              <line
                x1="30"
                y1="200"
                x2="300"
                y2="200"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
              />
              <line
                x1="60"
                y1="20"
                x2="60"
                y2="210"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
              />
              <text
                x="295"
                y="215"
                fontSize="9"
                textAnchor="end"
                fill="currentColor"
                className="text-muted-foreground"
              >
                x₁
              </text>
              <text
                x="50"
                y="25"
                fontSize="9"
                textAnchor="end"
                fill="currentColor"
                className="text-muted-foreground"
              >
                x₂
              </text>

              {/* Coordinates:
                  P1: (0, 0) -> (75, 180)
                  P2: (1, 0) -> (265, 180)
                  P3: (0.5, 0.1) -> (170, 160)
                  P4: (0.7, 0.6) -> (208, 60)
                  mu4: (0.25, 0.05) -> (122.5, 170)
                  mu5: (0.85, 0.30) -> (236.5, 120)
              */}

              {/* Hulls */}
              {activeStep >= 1 && (
                <ellipse
                  cx="122.5"
                  cy="170"
                  rx="60"
                  ry="25"
                  transform="rotate(-10, 122.5, 170)"
                  fill="#23395B"
                  fillOpacity="0.12"
                  stroke="#23395B"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {activeStep >= 2 && (
                <ellipse
                  cx="236.5"
                  cy="120"
                  rx="45"
                  ry="70"
                  transform="rotate(25, 236.5, 120)"
                  fill="#4D8580"
                  fillOpacity="0.12"
                  stroke="#4D8580"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* Centroid connector line at Step 3 */}
              {activeStep === 3 && (
                <g>
                  <line
                    x1="122.5"
                    y1="170"
                    x2="236.5"
                    y2="120"
                    stroke="#e11d48"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                  <text
                    x="175"
                    y="135"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#e11d48"
                    textAnchor="middle"
                  >
                    ||μ₄ - μ₅|| = 0.6500
                  </text>
                </g>
              )}

              {/* Observations */}
              <circle cx="75" cy="180" r="5" fill="#23395B" />
              <text
                x="65"
                y="195"
                fontSize="9"
                fontWeight="bold"
                fill="currentColor"
                className="text-foreground"
              >
                P₁(0, 0)
              </text>

              <circle cx="265" cy="180" r="5" fill="#4D8580" />
              <text
                x="265"
                y="195"
                fontSize="9"
                fontWeight="bold"
                fill="currentColor"
                className="text-foreground"
              >
                P₂(1, 0)
              </text>

              <circle cx="170" cy="160" r="5" fill="#23395B" />
              <text
                x="165"
                y="150"
                fontSize="9"
                fontWeight="bold"
                fill="currentColor"
                className="text-foreground"
              >
                P₃(0.5, 0.1)
              </text>

              <circle cx="208" cy="60" r="5" fill="#4D8580" />
              <text
                x="218"
                y="60"
                fontSize="9"
                fontWeight="bold"
                fill="currentColor"
                className="text-foreground"
              >
                P₄(0.7, 0.6)
              </text>

              {/* Centroids */}
              {activeStep >= 1 && (
                <g>
                  <circle cx="122.5" cy="170" r="4" fill="#e11d48" />
                  <path
                    d="M 116 170 L 129 170 M 122.5 163.5 L 122.5 176.5"
                    stroke="#e11d48"
                    strokeWidth="1.5"
                  />
                  <text x="110" y="160" fontSize="9" fontWeight="bold" fill="#e11d48">
                    μ₄(0.25, 0.05)
                  </text>
                </g>
              )}

              {activeStep >= 2 && (
                <g>
                  <circle cx="236.5" cy="120" r="4" fill="#e11d48" />
                  <path
                    d="M 230 120 L 243 120 M 236.5 113.5 L 236.5 126.5"
                    stroke="#e11d48"
                    strokeWidth="1.5"
                  />
                  <text x="245" y="125" fontSize="9" fontWeight="bold" fill="#e11d48">
                    μ₅(0.85, 0.30)
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="text-[11px] text-muted-foreground flex justify-between pt-1">
            <span>P₁, P₃ merged into C₄ (d = 0.5099)</span>
            <span>P₂, P₄ merged into C₅ (d = 0.6708)</span>
          </div>
        </div>

        {/* Right Column (6 cols): Inverted Dendrogram Structure */}
        <div className="lg:col-span-6 border border-border rounded-sm p-4 bg-background space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span>Dendrogram Crossover / Inversion</span>
            <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
              h₃ (0.6500) &lt; h₂ (0.6708)
            </span>
          </div>

          <div className="relative w-full aspect-[4/3] bg-muted/10 border border-border/60 rounded-xs overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 320 240" className="w-full h-full font-mono text-xs">
              {/* Y Axis: Height from 0 to 0.8 */}
              <line
                x1="45"
                y1="210"
                x2="45"
                y2="20"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
              />
              <line
                x1="45"
                y1="210"
                x2="300"
                y2="210"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
              />

              {/* Height ticks */}
              <text
                x="40"
                y="213"
                fontSize="9"
                textAnchor="end"
                fill="currentColor"
                className="text-muted-foreground"
              >
                0.0
              </text>
              <text
                x="40"
                y="145"
                fontSize="9"
                textAnchor="end"
                fill="currentColor"
                className="text-muted-foreground"
              >
                0.51
              </text>
              <text
                x="40"
                y="105"
                fontSize="9"
                textAnchor="end"
                fill="currentColor"
                className="text-muted-foreground"
              >
                0.65
              </text>
              <text
                x="40"
                y="80"
                fontSize="9"
                textAnchor="end"
                fill="currentColor"
                className="text-muted-foreground"
              >
                0.67
              </text>

              {/* Leaves: P1 (80), P3 (130), P2 (200), P4 (260) */}
              <text
                x="80"
                y="225"
                fontSize="9"
                textAnchor="middle"
                fill="currentColor"
                className="text-foreground"
              >
                P₁
              </text>
              <text
                x="130"
                y="225"
                fontSize="9"
                textAnchor="middle"
                fill="currentColor"
                className="text-foreground"
              >
                P₃
              </text>
              <text
                x="200"
                y="225"
                fontSize="9"
                textAnchor="middle"
                fill="currentColor"
                className="text-foreground"
              >
                P₂
              </text>
              <text
                x="260"
                y="225"
                fontSize="9"
                textAnchor="middle"
                fill="currentColor"
                className="text-foreground"
              >
                P₄
              </text>

              {/* Merge 1: P1 and P3 at h = 0.5099 (y = 145) */}
              {activeStep >= 1 && (
                <g stroke="#23395B" strokeWidth="1.5" fill="none">
                  <line x1="80" y1="210" x2="80" y2="145" />
                  <line x1="130" y1="210" x2="130" y2="145" />
                  <line x1="80" y1="145" x2="130" y2="145" />
                  <circle cx="105" cy="145" r="3" fill="#23395B" />
                  <text
                    x="105"
                    y="138"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#23395B"
                    stroke="none"
                  >
                    h₁=0.51
                  </text>
                </g>
              )}

              {/* Merge 2: P2 and P4 at h = 0.6708 (y = 80) */}
              {activeStep >= 2 && (
                <g stroke="#4D8580" strokeWidth="1.5" fill="none">
                  <line x1="200" y1="210" x2="200" y2="80" />
                  <line x1="260" y1="210" x2="260" y2="80" />
                  <line x1="200" y1="80" x2="260" y2="80" />
                  <circle cx="230" cy="80" r="3" fill="#4D8580" />
                  <text
                    x="230"
                    y="73"
                    fontSize="8"
                    textAnchor="middle"
                    fill="#4D8580"
                    stroke="none"
                  >
                    h₂=0.67
                  </text>
                </g>
              )}

              {/* Merge 3: C4 and C5 at h = 0.6500 (y = 105) -> INVERSION! */}
              {activeStep === 3 && (
                <g stroke="#e11d48" strokeWidth="2" fill="none">
                  {/* Stem from C4 (y=145 -> y=105) goes UP */}
                  <line x1="105" y1="145" x2="105" y2="105" strokeDasharray="3 2" />
                  {/* Stem from C5 (y=80 -> y=105) goes DOWN! (Inversion crossover!) */}
                  <line x1="230" y1="80" x2="230" y2="105" strokeDasharray="3 2" stroke="#e11d48" />
                  {/* Horizontal bar at h = 0.65 */}
                  <line x1="105" y1="105" x2="230" y2="105" />
                  <circle cx="167.5" cy="105" r="4" fill="#e11d48" />
                  <text
                    x="167.5"
                    y="97"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="#e11d48"
                    stroke="none"
                  >
                    h₃=0.65 (REVERSAL!)
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-4 w-4" />
              <span>Dendrogram Crossover Interpretation</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Notice that the branch connecting C₄ and C₅ is located at height{" "}
              <strong>0.6500</strong>, which lies <em>below</em> the branch of C₅ at height{" "}
              <strong>0.6708</strong>. The tree folds backward on itself, making it impossible to
              slice with a simple horizontal height threshold!
            </p>
          </div>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="bg-muted/30 border border-border p-4 rounded-sm space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            {current.title}
          </span>
          <span
            className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-xs ${
              current.hasInversion
                ? "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                : "bg-teal/10 text-teal border border-teal/20"
            }`}
          >
            {current.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{current.desc}</p>
      </div>
    </div>
  );
}

/** Interactive Ward's Minimum Variance Increase Calculator */
export function WardVarianceIncreaseCalculator() {
  const [nA, setNA] = useState<number>(4);
  const [nB, setNB] = useState<number>(4);
  const [dist, setDist] = useState<number>(3.0);

  // Calculations:
  // Weight factor: (nA * nB) / (nA + nB)
  const weightFactor = (nA * nB) / (nA + nB);
  // delta ESS = weightFactor * dist^2
  const deltaESS = weightFactor * Math.pow(dist, 2);
  // SciPy merge distance: sqrt(2 * deltaESS) = sqrt(2 * weightFactor) * dist
  const scipyDist = Math.sqrt(2 * deltaESS);

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal" />
            <h4 className="font-bold text-sm text-foreground">
              Ward's Variance Increase & Cluster Size Scaling Calculator
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Explore how cluster sizes (n_A, n_B) and centroid separation scale the increase in
            within-cluster error sum of squares (ESS).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-teal/10 text-teal border border-teal/20 px-2.5 py-1 rounded-xs font-semibold">
            SciPy Distance: {scipyDist.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/20 border border-border p-4 rounded-sm">
        {/* nA slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-foreground">Cluster A Size (n_A):</span>
            <span className="font-mono text-teal">{nA} points</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={nA}
            onChange={(e) => setNA(parseInt(e.target.value))}
            className="w-full accent-teal cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>1 (Singleton)</span>
            <span>30 (Macro-cluster)</span>
          </div>
        </div>

        {/* nB slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-foreground">Cluster B Size (n_B):</span>
            <span className="font-mono text-teal">{nB} points</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={nB}
            onChange={(e) => setNB(parseInt(e.target.value))}
            className="w-full accent-teal cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>1 (Singleton)</span>
            <span>30 (Macro-cluster)</span>
          </div>
        </div>

        {/* Centroid Distance slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-foreground">Centroid Distance ||μ_A - μ_B||:</span>
            <span className="font-mono text-teal">{dist.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10.0"
            step="0.1"
            value={dist}
            onChange={(e) => setDist(parseFloat(e.target.value))}
            className="w-full accent-teal cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>0.5 (Very Close)</span>
            <span>10.0 (Distant)</span>
          </div>
        </div>
      </div>

      {/* Output Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border rounded-sm p-3.5 bg-background space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Harmonic Weight Factor
          </span>
          <div className="text-xl font-bold font-mono text-navy">{weightFactor.toFixed(4)}</div>
          <span className="text-[10px] text-muted-foreground font-mono">
            (n_A · n_B) / (n_A + n_B)
          </span>
        </div>

        <div className="border border-border rounded-sm p-3.5 bg-background space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Variance Increase (ΔESS)
          </span>
          <div className="text-xl font-bold font-mono text-teal">{deltaESS.toFixed(4)}</div>
          <span className="text-[10px] text-muted-foreground font-mono">
            Weight · ||μ_A - μ_B||²
          </span>
        </div>

        <div className="border border-border rounded-sm p-3.5 bg-background space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            SciPy / R Ward.D2 Height
          </span>
          <div className="text-xl font-bold font-mono text-foreground">{scipyDist.toFixed(4)}</div>
          <span className="text-[10px] text-muted-foreground font-mono">√(2 · ΔESS)</span>
        </div>
      </div>

      {/* Analytical Callout */}
      <div className="bg-muted/30 border border-border p-4 rounded-sm space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-teal">
          <CheckCircle2 className="h-4 w-4" />
          <span>Why Ward's Method Enforces Equal-Sized Globular Clusters</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Notice what happens when two large clusters merge (e.g. n_A = 20, n_B = 20): the harmonic
          weight factor is <strong>10.0</strong>, imposing a huge variance penalty. In contrast,
          merging a singleton (n_A = 1) with an existing cluster (n_B = 20) yields a weight factor
          of only <strong>0.95</strong>. This property heavily penalizes combining large clusters
          early, guiding the algorithm to produce balanced, spherical clusters with approximately
          equal numbers of observations.
        </p>
      </div>
    </div>
  );
}
