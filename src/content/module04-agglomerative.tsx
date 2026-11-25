import { useState } from "react";
import { MathFormula } from "@/components/lab/blocks";
import {
  GitMerge,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Table as TableIcon,
  Layers,
  Sparkles,
} from "lucide-react";

type LinkageType = "single" | "complete" | "average";

interface MatrixData {
  headers: string[];
  rows: string[];
  values: (string | number)[][];
  minCoords: [number, number][]; // row, col of min pair
  minVal: number;
}

interface StepDetail {
  step: number;
  title: string;
  clusters: string[];
  explanation: {
    single: string;
    complete: string;
    average: string;
  };
  zRows: {
    single: [number, number, number, number][];
    complete: [number, number, number, number][];
    average: [number, number, number, number][];
  };
  matrix: {
    single: MatrixData;
    complete: MatrixData;
    average: MatrixData;
  };
}

export function AgglomerativeSimulator() {
  const [step, setStep] = useState<number>(0);
  const [linkage, setLinkage] = useState<LinkageType>("single");

  // Deterministic 4-point dataset:
  // P1: (1, 2) [idx 0]
  // P2: (2, 3) [idx 1]
  // P3: (6, 5) [idx 2]
  // P4: (7, 6) [idx 3]

  const stepsData: StepDetail[] = [
    {
      step: 0,
      title: "Step 0: Initial State (N = 4 Singletons)",
      clusters: ["C₀ = { P₁ }", "C₁ = { P₂ }", "C₂ = { P₃ }", "C₃ = { P₄ }"],
      explanation: {
        single:
          "All 4 observations start as independent singleton clusters. The symmetric 4×4 distance matrix D₀ is evaluated. Minimum distance is 1.4142, tied between (C₀, C₁) and (C₂, C₃). Deterministic index tie-breaking selects (C₀, C₁).",
        complete:
          "All 4 observations start as independent singleton clusters. Distance matrix D₀ is identical regardless of linkage method. Minimum distance 1.4142 tie broken in favor of (C₀, C₁).",
        average:
          "All 4 observations start as independent singleton clusters. Distance matrix D₀ is identical regardless of linkage method. Minimum distance 1.4142 tie broken in favor of (C₀, C₁).",
      },
      zRows: {
        single: [],
        complete: [],
        average: [],
      },
      matrix: {
        single: {
          headers: ["C₀", "C₁", "C₂", "C₃"],
          rows: ["C₀", "C₁", "C₂", "C₃"],
          values: [
            ["0.0000", "1.4142", "5.8310", "7.2111"],
            ["1.4142", "0.0000", "4.4721", "5.8310"],
            ["5.8310", "4.4721", "0.0000", "1.4142"],
            ["7.2111", "5.8310", "1.4142", "0.0000"],
          ],
          minCoords: [
            [0, 1],
            [1, 0],
          ],
          minVal: 1.4142,
        },
        complete: {
          headers: ["C₀", "C₁", "C₂", "C₃"],
          rows: ["C₀", "C₁", "C₂", "C₃"],
          values: [
            ["0.0000", "1.4142", "5.8310", "7.2111"],
            ["1.4142", "0.0000", "4.4721", "5.8310"],
            ["5.8310", "4.4721", "0.0000", "1.4142"],
            ["7.2111", "5.8310", "1.4142", "0.0000"],
          ],
          minCoords: [
            [0, 1],
            [1, 0],
          ],
          minVal: 1.4142,
        },
        average: {
          headers: ["C₀", "C₁", "C₂", "C₃"],
          rows: ["C₀", "C₁", "C₂", "C₃"],
          values: [
            ["0.0000", "1.4142", "5.8310", "7.2111"],
            ["1.4142", "0.0000", "4.4721", "5.8310"],
            ["5.8310", "4.4721", "0.0000", "1.4142"],
            ["7.2111", "5.8310", "1.4142", "0.0000"],
          ],
          minCoords: [
            [0, 1],
            [1, 0],
          ],
          minVal: 1.4142,
        },
      },
    },
    {
      step: 1,
      title: "Step 1: First Merge (C₄ = C₀ ∪ C₁)",
      clusters: ["C₄ = { P₁, P₂ }", "C₂ = { P₃ }", "C₃ = { P₄ }"],
      explanation: {
        single:
          "C₀ and C₁ coalesce into C₄ at height h = 1.4142. Under Single Linkage: d(C₄, C₂) = min(5.8310, 4.4721) = 4.4721; d(C₄, C₃) = min(7.2111, 5.8310) = 5.8310. The global minimum in D₁ is (C₂, C₃) at 1.4142.",
        complete:
          "C₀ and C₁ coalesce into C₄ at height h = 1.4142. Under Complete Linkage: d(C₄, C₂) = max(5.8310, 4.4721) = 5.8310; d(C₄, C₃) = max(7.2111, 5.8310) = 7.2111. The global minimum in D₁ is (C₂, C₃) at 1.4142.",
        average:
          "C₀ and C₁ coalesce into C₄ at height h = 1.4142. Under Average Linkage: d(C₄, C₂) = (5.8310 + 4.4721)/2 = 5.1516; d(C₄, C₃) = (7.2111 + 5.8310)/2 = 6.5211. The global minimum in D₁ is (C₂, C₃) at 1.4142.",
      },
      zRows: {
        single: [[0, 1, 1.4142, 2]],
        complete: [[0, 1, 1.4142, 2]],
        average: [[0, 1, 1.4142, 2]],
      },
      matrix: {
        single: {
          headers: ["C₄", "C₂", "C₃"],
          rows: ["C₄", "C₂", "C₃"],
          values: [
            ["0.0000", "4.4721", "5.8310"],
            ["4.4721", "0.0000", "1.4142"],
            ["5.8310", "1.4142", "0.0000"],
          ],
          minCoords: [
            [1, 2],
            [2, 1],
          ],
          minVal: 1.4142,
        },
        complete: {
          headers: ["C₄", "C₂", "C₃"],
          rows: ["C₄", "C₂", "C₃"],
          values: [
            ["0.0000", "5.8310", "7.2111"],
            ["5.8310", "0.0000", "1.4142"],
            ["7.2111", "1.4142", "0.0000"],
          ],
          minCoords: [
            [1, 2],
            [2, 1],
          ],
          minVal: 1.4142,
        },
        average: {
          headers: ["C₄", "C₂", "C₃"],
          rows: ["C₄", "C₂", "C₃"],
          values: [
            ["0.0000", "5.1516", "6.5211"],
            ["5.1516", "0.0000", "1.4142"],
            ["6.5211", "1.4142", "0.0000"],
          ],
          minCoords: [
            [1, 2],
            [2, 1],
          ],
          minVal: 1.4142,
        },
      },
    },
    {
      step: 2,
      title: "Step 2: Second Merge (C₅ = C₂ ∪ C₃)",
      clusters: ["C₄ = { P₁, P₂ }", "C₅ = { P₃, P₄ }"],
      explanation: {
        single:
          "C₂ and C₃ merge into C₅ at height h = 1.4142. Only 2 composite clusters remain. Under Single Linkage: d(C₄, C₅) = min(5.8310, 7.2111, 4.4721, 5.8310) = 4.4721. Minimum is the sole remaining pair (C₄, C₅).",
        complete:
          "C₂ and C₃ merge into C₅ at height h = 1.4142. Only 2 composite clusters remain. Under Complete Linkage: d(C₄, C₅) = max(5.8310, 7.2111, 4.4721, 5.8310) = 7.2111. Minimum is the sole remaining pair (C₄, C₅).",
        average:
          "C₂ and C₃ merge into C₅ at height h = 1.4142. Only 2 composite clusters remain. Under Average Linkage: d(C₄, C₅) = (5.8310 + 7.2111 + 4.4721 + 5.8310)/4 = 5.8363. Minimum is the sole remaining pair (C₄, C₅).",
      },
      zRows: {
        single: [
          [0, 1, 1.4142, 2],
          [2, 3, 1.4142, 2],
        ],
        complete: [
          [0, 1, 1.4142, 2],
          [2, 3, 1.4142, 2],
        ],
        average: [
          [0, 1, 1.4142, 2],
          [2, 3, 1.4142, 2],
        ],
      },
      matrix: {
        single: {
          headers: ["C₄", "C₅"],
          rows: ["C₄", "C₅"],
          values: [
            ["0.0000", "4.4721"],
            ["4.4721", "0.0000"],
          ],
          minCoords: [
            [0, 1],
            [1, 0],
          ],
          minVal: 4.4721,
        },
        complete: {
          headers: ["C₄", "C₅"],
          rows: ["C₄", "C₅"],
          values: [
            ["0.0000", "7.2111"],
            ["7.2111", "0.0000"],
          ],
          minCoords: [
            [0, 1],
            [1, 0],
          ],
          minVal: 7.2111,
        },
        average: {
          headers: ["C₄", "C₅"],
          rows: ["C₄", "C₅"],
          values: [
            ["0.0000", "5.8363"],
            ["5.8363", "0.0000"],
          ],
          minCoords: [
            [0, 1],
            [1, 0],
          ],
          minVal: 5.8363,
        },
      },
    },
    {
      step: 3,
      title: "Step 3: Termination (C₆ = C₄ ∪ C₅)",
      clusters: ["C₆ = { P₁, P₂, P₃, P₄ }"],
      explanation: {
        single:
          "C₄ and C₅ merge into root C₆ at height h = 4.4721 (nearest neighbor distance across clusters). 1 cluster remains, satisfying the stopping criterion. Total merges = 3.",
        complete:
          "C₄ and C₅ merge into root C₆ at height h = 7.2111 (farthest neighbor distance across clusters, between P₁ and P₄). 1 cluster remains, satisfying the stopping criterion. Total merges = 3.",
        average:
          "C₄ and C₅ merge into root C₆ at height h = 5.8363 (average pairwise distance between all cross-cluster point pairs). 1 cluster remains, satisfying the stopping criterion. Total merges = 3.",
      },
      zRows: {
        single: [
          [0, 1, 1.4142, 2],
          [2, 3, 1.4142, 2],
          [4, 5, 4.4721, 4],
        ],
        complete: [
          [0, 1, 1.4142, 2],
          [2, 3, 1.4142, 2],
          [4, 5, 7.2111, 4],
        ],
        average: [
          [0, 1, 1.4142, 2],
          [2, 3, 1.4142, 2],
          [4, 5, 5.8363, 4],
        ],
      },
      matrix: {
        single: {
          headers: ["C₆"],
          rows: ["C₆"],
          values: [["0.0000"]],
          minCoords: [],
          minVal: 0,
        },
        complete: {
          headers: ["C₆"],
          rows: ["C₆"],
          values: [["0.0000"]],
          minCoords: [],
          minVal: 0,
        },
        average: {
          headers: ["C₆"],
          rows: ["C₆"],
          values: [["0.0000"]],
          minCoords: [],
          minVal: 0,
        },
      },
    },
  ];

  const currentStep = stepsData[step]!;
  const currentMatrix = currentStep.matrix[linkage];
  const currentZ = currentStep.zRows[linkage];

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-6">
      {/* Header with Title and Linkage Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitMerge className="h-4 w-4 text-teal" />
            <h4 className="font-bold text-sm text-foreground">
              Interactive Agglomerative Clustering Simulator
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step through bottom-up aggregation and inspect dynamic distance matrix updates and
            linkage matrix Z construction.
          </p>
        </div>

        {/* Linkage Selector */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-sm border border-border">
          <span className="text-[11px] font-medium text-muted-foreground px-2">Linkage:</span>
          {(
            [
              ["single", "Single (Min)"],
              ["complete", "Complete (Max)"],
              ["average", "Average (UPGMA)"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setLinkage(val)}
              className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
                linkage === val
                  ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Step Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 p-3 rounded-sm border border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {currentStep.title}
          </span>
          <span className="text-[11px] bg-teal/10 text-teal border border-teal/20 px-2 py-0.5 rounded-xs font-medium">
            Active Clusters: {currentStep.clusters.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStep(0)}
            disabled={step === 0}
            className="p-1.5 rounded-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40 transition-colors"
            title="Reset to Step 0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev
          </button>
          {[0, 1, 2, 3].map((sIdx) => (
            <button
              key={sIdx}
              onClick={() => setStep(sIdx)}
              className={`h-6 w-6 text-xs rounded-sm font-mono transition-colors ${
                step === sIdx
                  ? "bg-navy text-primary-foreground font-bold"
                  : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {sIdx}
            </button>
          ))}
          <button
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            disabled={step === 3}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40 transition-colors"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left is 2D Scatter + Cluster Pills; Right is Matrix + Z-table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 cols): 2D Geometry & Cluster State */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-border rounded-sm p-3 bg-background space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Observation Space: ℝ² Scatter</span>
              <span className="text-[11px] font-mono text-muted-foreground">
                P₁(1,2) to P₄(7,6)
              </span>
            </div>

            {/* SVG Visualizer */}
            <div className="relative w-full aspect-[4/3] bg-muted/10 border border-border/60 rounded-xs overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 320 240" className="w-full h-full">
                {/* Gridlines */}
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-border/60"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                {/* Axes */}
                <line
                  x1="30"
                  y1="210"
                  x2="300"
                  y2="210"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border"
                />
                <line
                  x1="30"
                  y1="20"
                  x2="30"
                  y2="210"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border"
                />
                <text
                  x="295"
                  y="225"
                  fontSize="9"
                  textAnchor="end"
                  fill="currentColor"
                  className="text-muted-foreground"
                >
                  x₁
                </text>
                <text
                  x="20"
                  y="25"
                  fontSize="9"
                  textAnchor="end"
                  fill="currentColor"
                  className="text-muted-foreground"
                >
                  x₂
                </text>

                {/* Coordinate mapping:
                    x: [0..8] -> [30..290] (dx = 32.5)
                    y: [0..8] -> [210..30] (dy = -22.5)
                    P1: (1, 2) -> (62.5, 165)
                    P2: (2, 3) -> (95, 142.5)
                    P3: (6, 5) -> (225, 97.5)
                    P4: (7, 6) -> (257.5, 75)
                */}

                {/* Cluster Hull Enclosures based on Step */}
                {/* Step >= 1: C4 {P1, P2} enclosed */}
                {step >= 1 && (
                  <g className="transition-all duration-300">
                    <ellipse
                      cx="78.75"
                      cy="153.75"
                      rx="38"
                      ry="28"
                      transform="rotate(-35, 78.75, 153.75)"
                      fill="#23395B"
                      fillOpacity="0.12"
                      stroke="#23395B"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <text x="45" y="130" fontSize="10" fontWeight="bold" fill="#23395B">
                      C₄
                    </text>
                  </g>
                )}

                {/* Step >= 2: C5 {P3, P4} enclosed */}
                {step >= 2 && (
                  <g className="transition-all duration-300">
                    <ellipse
                      cx="241.25"
                      cy="86.25"
                      rx="38"
                      ry="28"
                      transform="rotate(-35, 241.25, 86.25)"
                      fill="#4D8580"
                      fillOpacity="0.12"
                      stroke="#4D8580"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <text x="268" y="115" fontSize="10" fontWeight="bold" fill="#4D8580">
                      C₅
                    </text>
                  </g>
                )}

                {/* Step === 3: C6 Root enclosing all 4 points */}
                {step === 3 && (
                  <g className="transition-all duration-300">
                    <rect
                      x="35"
                      y="45"
                      width="245"
                      height="145"
                      rx="24"
                      fill="#8b5cf6"
                      fillOpacity="0.06"
                      stroke="#8b5cf6"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="160"
                      y="42"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#8b5cf6"
                    >
                      Root C₆ = {"{ P₁, P₂, P₃, P₄ }"} (h ={" "}
                      {currentStep.zRows[linkage][2]![2]!.toFixed(4)})
                    </text>
                  </g>
                )}

                {/* Merge connections for current step */}
                {step === 0 && (
                  <line
                    x1="62.5"
                    y1="165"
                    x2="95"
                    y2="142.5"
                    stroke="#23395B"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}
                {step === 1 && (
                  <line
                    x1="225"
                    y1="97.5"
                    x2="257.5"
                    y2="75"
                    stroke="#4D8580"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}
                {step === 2 && (
                  <line
                    x1="95"
                    y1="142.5"
                    x2="225"
                    y2="97.5"
                    stroke="#8b5cf6"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Data Points */}
                {/* P1 */}
                <g>
                  <circle cx="62.5" cy="165" r="5" fill="#23395B" />
                  <text
                    x="56"
                    y="180"
                    fontSize="10"
                    fontWeight="600"
                    fill="currentColor"
                    className="text-foreground"
                  >
                    P₁(1,2)
                  </text>
                </g>

                {/* P2 */}
                <g>
                  <circle cx="95" cy="142.5" r="5" fill="#23395B" />
                  <text
                    x="96"
                    y="135"
                    fontSize="10"
                    fontWeight="600"
                    fill="currentColor"
                    className="text-foreground"
                  >
                    P₂(2,3)
                  </text>
                </g>

                {/* P3 */}
                <g>
                  <circle cx="225" cy="97.5" r="5" fill="#4D8580" />
                  <text
                    x="210"
                    y="112"
                    fontSize="10"
                    fontWeight="600"
                    fill="currentColor"
                    className="text-foreground"
                  >
                    P₃(6,5)
                  </text>
                </g>

                {/* P4 */}
                <g>
                  <circle cx="257.5" cy="75" r="5" fill="#4D8580" />
                  <text
                    x="264"
                    y="70"
                    fontSize="10"
                    fontWeight="600"
                    fill="currentColor"
                    className="text-foreground"
                  >
                    P₄(7,6)
                  </text>
                </g>
              </svg>
            </div>

            {/* Active Clusters list */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Active Cluster Partitions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentStep.clusters.map((cName, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-2 py-1 bg-muted/60 border border-border rounded-xs text-foreground font-medium"
                  >
                    {cName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Distance Matrix & Linkage Matrix Z */}
        <div className="lg:col-span-7 space-y-4">
          {/* Pairwise Distance Matrix Card */}
          <div className="border border-border rounded-sm p-4 bg-background space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TableIcon className="h-4 w-4 text-navy" />
                <span className="text-xs font-bold text-foreground">
                  Current Distance Matrix D_{step} ({currentMatrix.headers.length}×
                  {currentMatrix.headers.length})
                </span>
              </div>
              {step < 3 && (
                <span className="text-[11px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-xs font-semibold">
                  Min d = {currentMatrix.minVal.toFixed(4)}
                </span>
              )}
            </div>

            {step === 3 ? (
              <div className="p-4 bg-muted/30 border border-dashed border-border rounded-xs text-center space-y-1">
                <p className="text-xs font-semibold text-foreground">
                  All clusters merged into universal root cluster C₆.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Stopping criterion met (|Active Clusters| = 1). Distance matrix reduced to 1×1
                  singleton [0.0000].
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="p-2 text-left text-muted-foreground font-semibold"></th>
                      {currentMatrix.headers.map((h, i) => (
                        <th key={i} className="p-2 text-center text-foreground font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentMatrix.rows.map((rLabel, rIdx) => (
                      <tr key={rIdx} className="border-b border-border/50">
                        <td className="p-2 text-left font-semibold text-foreground bg-muted/20">
                          {rLabel}
                        </td>
                        {currentMatrix.values[rIdx]!.map((val, cIdx) => {
                          const isMin = currentMatrix.minCoords.some(
                            ([r, c]) => r === rIdx && c === cIdx,
                          );
                          const isDiag = rIdx === cIdx;
                          return (
                            <td
                              key={cIdx}
                              className={`p-2 text-center transition-colors ${
                                isDiag
                                  ? "text-muted-foreground/60 bg-muted/10"
                                  : isMin
                                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/40"
                                    : "text-foreground"
                              }`}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Linkage Matrix Z Display (SciPy format) */}
          <div className="border border-border rounded-sm p-4 bg-background space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-teal" />
                <span className="text-xs font-bold text-foreground">
                  SciPy Linkage Matrix Z (Height & Composition)
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                Shape: ({currentZ.length}, 4)
              </span>
            </div>

            {currentZ.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-2">
                No merges executed yet. Matrix Z is empty at step 0.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-[11px] text-muted-foreground">
                      <th className="p-1.5 text-left font-semibold">Iteration</th>
                      <th className="p-1.5 text-center font-semibold">Cluster A</th>
                      <th className="p-1.5 text-center font-semibold">Cluster B</th>
                      <th className="p-1.5 text-right font-semibold">Distance (h)</th>
                      <th className="p-1.5 text-right font-semibold">New Cluster Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentZ.map((row, idx) => (
                      <tr key={idx} className="border-b border-border/40">
                        <td className="p-1.5 text-left text-muted-foreground">Row {idx}</td>
                        <td className="p-1.5 text-center font-bold text-navy">C_{row[0]}</td>
                        <td className="p-1.5 text-center font-bold text-navy">C_{row[1]}</td>
                        <td className="p-1.5 text-right font-mono text-teal font-semibold">
                          {row[2].toFixed(4)}
                        </td>
                        <td className="p-1.5 text-right text-foreground font-semibold">
                          {row[3]} points
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step Explanation Callout */}
      <div className="bg-muted/30 border border-border p-4 rounded-sm space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal" />
          <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Step Mechanics & Distance Updating Rule
          </h5>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {currentStep.explanation[linkage]}
        </p>
      </div>
    </div>
  );
}

/** Interactive Self-Assessment Quiz for Module 04 */
export function Module04Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      question:
        "For a dataset of N independent observations, how many merge steps does agglomerative clustering perform to construct the full tree?",
      options: [
        "N - 1 merge steps",
        "N merge steps",
        "N(N - 1) / 2 merge steps",
        "2^(N - 1) - 1 merge steps",
      ],
      correct: 0,
      explanation:
        "Because each agglomerative merge reduces the total number of active clusters by exactly 1 (from N down to 1), exactly N - 1 merges are required.",
    },
    {
      id: 2,
      question:
        "In the standard (N - 1) × 4 SciPy linkage matrix Z, what do the four columns represent?",
      options: [
        "[X-coordinate, Y-coordinate, Cluster ID, Weight]",
        "[Cluster A index, Cluster B index, Linkage distance, Total observations in new cluster]",
        "[Iteration index, Merge time, Inertia, Silhouette score]",
        "[Left child, Right child, Tree depth, Cophenetic correlation]",
      ],
      correct: 1,
      explanation:
        "By SciPy convention, Z[i] = [c1, c2, dist, count], where c1 and c2 are the merged cluster indices, dist is the linkage distance, and count is the number of original observations in the new cluster.",
    },
    {
      id: 3,
      question:
        "If two distinct cluster pairs exhibit identical minimal linkage distance in the distance matrix, how does deterministic agglomerative clustering resolve the tie?",
      options: [
        "It aborts execution because identical distances violate ultrametric inequality.",
        "It generates a non-binary split by merging all 4 clusters simultaneously.",
        "It randomly chooses one of the pairs, causing non-deterministic dendrograms on each run.",
        "It applies a deterministic tie-breaking rule, such as selecting the pair with the smallest minimum cluster index.",
      ],
      correct: 3,
      explanation:
        "Standard deterministic implementations (like SciPy and Scikit-learn) break distance ties lexicographically by cluster indices, ensuring identical and reproducible trees across runs.",
    },
    {
      id: 4,
      question:
        "What is the worst-case computational time complexity of naive agglomerative clustering on N observations?",
      options: ["O(N) linear time", "O(N log N) time", "O(N²) quadratic time", "O(N³) cubic time"],
      correct: 3,
      explanation:
        "A naive implementation performs N - 1 merge steps. In each step, scanning the unstructured distance matrix for the minimal value takes O(N²) operations, yielding an overall worst-case complexity of (N - 1) × O(N²) = O(N³).",
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
            Module 04 Knowledge Check: Agglomerative Mechanics
          </h4>
          <p className="text-xs text-muted-foreground">
            Test your understanding of the 8-stage execution algorithm, matrix updates, linkage
            matrices, and complexity.
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
