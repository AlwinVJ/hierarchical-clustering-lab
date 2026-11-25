import { useState } from "react";
import {
  Split,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Table as TableIcon,
  Sparkles,
  Maximize2,
  GitBranch,
} from "lucide-react";

interface DissimilarityRow {
  point: string;
  d_i: number;
  e_i: number;
  diff: number;
  status: "joined" | "remains" | "seed" | "none";
}

interface StepDetail {
  step: number;
  title: string;
  badge: string;
  splinter: string[];
  remaining: string[];
  diameter: number;
  diameterPair: [string, string];
  dissimilarityData: DissimilarityRow[];
  explanation: string;
}

export function DianaSimulator() {
  const [step, setStep] = useState<number>(0);

  // Deterministic 4-point benchmark dataset in R²:
  // P1: (1, 2)
  // P2: (2, 3)
  // P3: (6, 5)
  // P4: (7, 6)

  const stepsData: StepDetail[] = [
    {
      step: 0,
      title: "Step 0: Universal Cluster & Diameter Evaluation",
      badge: "Root State (m = 4)",
      splinter: [],
      remaining: ["P₁", "P₂", "P₃", "P₄"],
      diameter: 7.2111,
      diameterPair: ["P₁", "P₄"],
      dissimilarityData: [
        { point: "P₁", d_i: 4.8188, e_i: 0, diff: 4.8188, status: "seed" },
        { point: "P₂", d_i: 3.9058, e_i: 0, diff: 3.9058, status: "none" },
        { point: "P₃", d_i: 3.9058, e_i: 0, diff: 3.9058, status: "none" },
        { point: "P₄", d_i: 4.8188, e_i: 0, diff: 4.8188, status: "none" },
      ],
      explanation:
        "DIANA evaluates the cluster diameter diam(C) = max d(i, j). Here diam(C) = d(P₁, P₄) = 7.2111. It computes the average dissimilarity from each point to all other points in C. P₁ and P₄ are tied at 4.8188. Lexicographical index tie-breaking selects P₁ as the initial splinter seed.",
    },
    {
      step: 1,
      title: "Step 1: Splinter Seed & Candidate Evaluation",
      badge: "Splinter Initialized",
      splinter: ["P₁"],
      remaining: ["P₂", "P₃", "P₄"],
      diameter: 7.2111,
      diameterPair: ["P₁", "P₄"],
      dissimilarityData: [
        { point: "P₂", d_i: 5.1515, e_i: 1.4142, diff: 3.7373, status: "joined" },
        { point: "P₃", d_i: 2.9432, e_i: 5.831, diff: -2.8878, status: "remains" },
        { point: "P₄", d_i: 3.6226, e_i: 7.2111, diff: -3.5885, status: "remains" },
      ],
      explanation:
        "P₁ forms the splinter group S = {P₁}. For each point i in remaining group R = {P₂, P₃, P₄}, DIANA computes D_i (average distance to others in R) and E_i (distance to S). For P₂: D₂ = 5.1515, E₂ = 1.4142, yielding D₂ - E₂ = +3.7373 > 0. Since +3.7373 is strictly positive and maximal, P₂ joins S.",
    },
    {
      step: 2,
      title: "Step 2: Splinter Group Growth & Stopping Test",
      badge: "First Split Complete",
      splinter: ["P₁", "P₂"],
      remaining: ["P₃", "P₄"],
      diameter: 1.4142,
      diameterPair: ["P₃", "P₄"],
      dissimilarityData: [
        { point: "P₃", d_i: 1.4142, e_i: 5.1515, diff: -3.7373, status: "remains" },
        { point: "P₄", d_i: 1.4142, e_i: 6.521, diff: -5.1068, status: "remains" },
      ],
      explanation:
        "P₂ has joined S, giving S = {P₁, P₂} and R = {P₃, P₄}. In the next test, both remaining points yield negative differences: P₃ has D₃ - E₃ = -3.7373 and P₄ has D₄ - E₄ = -5.1068. Because max(D_i - E_i) ≤ 0, splintering terminates! The first split cleanly divides the data into {P₁, P₂} and {P₃, P₄}.",
    },
    {
      step: 3,
      title: "Step 3: Recursive Sub-splitting to Singletons",
      badge: "Full Tree Terminated",
      splinter: ["P₁", "P₂", "P₃", "P₄"],
      remaining: [],
      diameter: 0,
      diameterPair: ["-", "-"],
      dissimilarityData: [],
      explanation:
        "In subsequent recursive stages, sub-cluster {P₁, P₂} (diameter = 1.4142) is partitioned into singletons {P₁} and {P₂}. Simultaneously, sub-cluster {P₃, P₄} (diameter = 1.4142) is partitioned into singletons {P₃} and {P₄}. All 4 observations are now independent singletons, completing the top-down divisive tree.",
    },
  ];

  const current = stepsData[step]!;

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Split className="h-4 w-4 text-teal" />
            <h4 className="font-bold text-sm text-foreground">
              Interactive DIANA Splitting Simulator
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Step through Kaufman & Rousseeuw's Divisive Analysis algorithm on the 4-point benchmark
            dataset.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 bg-teal/10 text-teal border border-teal/20 rounded-xs font-semibold">
            {current.badge}
          </span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 p-3 rounded-sm border border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {current.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStep(0)}
            disabled={step === 0}
            className="p-1.5 rounded-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40 transition-colors"
            title="Reset"
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

      {/* Main Grid: Left Scatter, Right Splinter Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 cols): 2D Geometry & Cluster State */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-border rounded-sm p-3 bg-background space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Top-Down Spatial Decomposition</span>
              <span className="text-[11px] font-mono text-muted-foreground">ℝ² Scatter</span>
            </div>

            <div className="relative w-full aspect-[4/3] bg-muted/10 border border-border/60 rounded-xs overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 320 240" className="w-full h-full">
                <defs>
                  <pattern id="diana-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-border/60"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#diana-grid)" />

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

                {/* Diameter line for Step 0 & 1 */}
                {(step === 0 || step === 1) && (
                  <g>
                    <line
                      x1="62.5"
                      y1="165"
                      x2="257.5"
                      y2="75"
                      stroke="#e11d48"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    <text
                      x="160"
                      y="110"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#e11d48"
                      textAnchor="middle"
                    >
                      diam(C) = 7.2111 (P₁-P₄)
                    </text>
                  </g>
                )}

                {/* Enclosures by Step */}
                {step === 0 && (
                  <rect
                    x="35"
                    y="45"
                    width="245"
                    height="145"
                    rx="24"
                    fill="#23395B"
                    fillOpacity="0.08"
                    stroke="#23395B"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                )}

                {step === 1 && (
                  <>
                    {/* Splinter Seed P1 */}
                    <circle
                      cx="62.5"
                      cy="165"
                      r="18"
                      fill="#e11d48"
                      fillOpacity="0.15"
                      stroke="#e11d48"
                      strokeWidth="1.5"
                    />
                    <text x="35" y="195" fontSize="10" fontWeight="bold" fill="#e11d48">
                      Splinter S = {"{ P₁ }"}
                    </text>
                    {/* Remaining R {P2, P3, P4} */}
                    <ellipse
                      cx="192.5"
                      cy="105"
                      rx="85"
                      ry="48"
                      transform="rotate(-25, 192.5, 105)"
                      fill="#23395B"
                      fillOpacity="0.08"
                      stroke="#23395B"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <text x="210" y="55" fontSize="10" fontWeight="bold" fill="#23395B">
                      Remaining R = {"{ P₂, P₃, P₄ }"}
                    </text>
                  </>
                )}

                {step === 2 && (
                  <>
                    {/* Splinter Group S = {P1, P2} */}
                    <ellipse
                      cx="78.75"
                      cy="153.75"
                      rx="38"
                      ry="28"
                      transform="rotate(-35, 78.75, 153.75)"
                      fill="#e11d48"
                      fillOpacity="0.15"
                      stroke="#e11d48"
                      strokeWidth="1.5"
                    />
                    <text x="45" y="125" fontSize="10" fontWeight="bold" fill="#e11d48">
                      Cluster A = {"{ P₁, P₂ }"}
                    </text>

                    {/* Remaining Group R = {P3, P4} */}
                    <ellipse
                      cx="241.25"
                      cy="86.25"
                      rx="38"
                      ry="28"
                      transform="rotate(-35, 241.25, 86.25)"
                      fill="#4D8580"
                      fillOpacity="0.15"
                      stroke="#4D8580"
                      strokeWidth="1.5"
                    />
                    <text x="235" y="55" fontSize="10" fontWeight="bold" fill="#4D8580">
                      Cluster B = {"{ P₃, P₄ }"}
                    </text>
                  </>
                )}

                {step === 3 && (
                  <>
                    {/* 4 Singletons */}
                    <circle
                      cx="62.5"
                      cy="165"
                      r="14"
                      fill="#23395B"
                      fillOpacity="0.12"
                      stroke="#23395B"
                      strokeWidth="1"
                    />
                    <circle
                      cx="95"
                      cy="142.5"
                      r="14"
                      fill="#23395B"
                      fillOpacity="0.12"
                      stroke="#23395B"
                      strokeWidth="1"
                    />
                    <circle
                      cx="225"
                      cy="97.5"
                      r="14"
                      fill="#4D8580"
                      fillOpacity="0.12"
                      stroke="#4D8580"
                      strokeWidth="1"
                    />
                    <circle
                      cx="257.5"
                      cy="75"
                      r="14"
                      fill="#4D8580"
                      fillOpacity="0.12"
                      stroke="#4D8580"
                      strokeWidth="1"
                    />
                    <text
                      x="160"
                      y="40"
                      fontSize="10"
                      fontWeight="bold"
                      fill="currentColor"
                      textAnchor="middle"
                      className="text-foreground"
                    >
                      All 4 Singletons Isolated (DC = 0.804)
                    </text>
                  </>
                )}

                {/* Data Points */}
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
              </svg>
            </div>

            {/* Partition status pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Cluster Membership
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {step < 3 ? (
                  <>
                    <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xs">
                      Splinter S: {current.splinter.length > 0 ? current.splinter.join(", ") : "∅"}
                    </div>
                    <div className="px-2 py-1 bg-muted/60 border border-border text-foreground rounded-xs">
                      Remaining R: {current.remaining.join(", ")}
                    </div>
                  </>
                ) : (
                  <div className="px-2 py-1 bg-teal/10 border border-teal/20 text-teal rounded-xs">
                    4 Singletons: {"{P₁}, {P₂}, {P₃}, {P₄}"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Dissimilarity & Reassignment Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-border rounded-sm p-4 bg-background space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TableIcon className="h-4 w-4 text-teal" />
                <span className="text-xs font-bold text-foreground">
                  {step === 0
                    ? "Average Dissimilarity Table (Seed Selection)"
                    : step === 3
                      ? "Final Divisive Hierarchy Structure"
                      : "Dissimilarity Difference Test: D_i - E_i"}
                </span>
              </div>
              {step > 0 && step < 3 && (
                <span className="text-[11px] font-mono text-muted-foreground">
                  Condition: D_i - E_i &gt; 0
                </span>
              )}
            </div>

            {step === 3 ? (
              <div className="p-4 bg-muted/30 border border-dashed border-border rounded-xs space-y-3">
                <div className="flex items-center gap-2 text-teal font-semibold text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  Divisive Hierarchy Successfully Constructed
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
                  <p>
                    • Top Level Split: Root {"{P₁, P₂, P₃, P₄}"} partitioned into Cluster A{" "}
                    {"{P₁, P₂}"} and Cluster B {"{P₃, P₄}"} at diameter 7.2111.
                  </p>
                  <p>
                    • Sub-splits: Cluster A divided at diameter 1.4142; Cluster B divided at
                    diameter 1.4142.
                  </p>
                  <p>
                    • Divisive Coefficient (DC): Quantifies the tightness of the clustering
                    structure.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-[11px] text-muted-foreground">
                      <th className="p-2 text-left font-semibold">Observation</th>
                      <th className="p-2 text-right font-semibold">
                        {step === 0 ? "Avg Distance to Others" : "D_i (Avg to R \\ {i})"}
                      </th>
                      {step > 0 && <th className="p-2 text-right font-semibold">E_i (Avg to S)</th>}
                      <th className="p-2 text-right font-semibold">
                        {step === 0 ? "Seed Criterion" : "Δ_i = D_i - E_i"}
                      </th>
                      <th className="p-2 text-center font-semibold">Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.dissimilarityData.map((row, idx) => {
                      const isSeed = row.status === "seed";
                      const isJoined = row.status === "joined";
                      return (
                        <tr key={idx} className="border-b border-border/40">
                          <td className="p-2 text-left font-bold text-foreground">{row.point}</td>
                          <td className="p-2 text-right font-mono text-muted-foreground">
                            {row.d_i.toFixed(4)}
                          </td>
                          {step > 0 && (
                            <td className="p-2 text-right font-mono text-muted-foreground">
                              {row.e_i.toFixed(4)}
                            </td>
                          )}
                          <td
                            className={`p-2 text-right font-mono font-bold ${
                              row.diff > 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {row.diff > 0 ? `+${row.diff.toFixed(4)}` : row.diff.toFixed(4)}
                          </td>
                          <td className="p-2 text-center">
                            {isSeed && (
                              <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xs font-semibold">
                                Splinter Seed
                              </span>
                            )}
                            {isJoined && (
                              <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xs font-semibold">
                                Reassigned to S
                              </span>
                            )}
                            {row.status === "remains" && (
                              <span className="text-[10px] px-2 py-0.5 bg-muted/60 text-muted-foreground rounded-xs">
                                Remains in R (Δ ≤ 0)
                              </span>
                            )}
                            {row.status === "none" && (
                              <span className="text-[10px] text-muted-foreground/60">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mathematical Rule Callout */}
          <div className="border border-border rounded-sm p-3.5 bg-background space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-navy">
              <Maximize2 className="h-3.5 w-3.5 text-teal" />
              <span>DIANA Reassignment Condition</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-mono">
              i^* = argmax_{"{i \\in R}"} (D_i - E_i) &gt; 0
            </p>
            <p className="text-[11px] text-muted-foreground">
              A point shifts from remaining group R into splinter group S if and only if it is
              closer on average to the splinter group than to the rest of R. When no remaining point
              satisfies this, the split stops.
            </p>
          </div>
        </div>
      </div>

      {/* Step Explanation Callout */}
      <div className="bg-muted/30 border border-border p-4 rounded-sm space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal" />
          <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Step Mechanics & Algorithmic Rationale
          </h5>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{current.explanation}</p>
      </div>
    </div>
  );
}

/** Interactive Self-Assessment Quiz for Module 05 */
export function Module05Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      question:
        "Why is exhaustive brute-force search generally impossible for divisive hierarchical clustering?",
      options: [
        "Because computing pairwise Euclidean distances requires quantum hardware.",
        "Because partitioning a cluster of m observations into two non-empty subsets entails 2^(m - 1) - 1 possible splits, leading to exponential O(2^m) complexity.",
        "Because divisive clustering cannot be represented as a binary tree.",
        "Because top-down splits cannot compute dissimilarity matrices.",
      ],
      correct: 1,
      explanation:
        "A cluster of size m has 2^(m - 1) - 1 non-trivial binary partitions. For m = 50, this exceeds 10^14 combinations, rendering brute force computationally intractable and necessitating heuristic algorithms like DIANA.",
    },
    {
      id: 2,
      question:
        "In Kaufman & Rousseeuw's DIANA algorithm, which cluster is chosen at each stage to be subdivided?",
      options: [
        "The cluster with the minimum variance.",
        "The cluster with the largest diameter, defined as the maximum pairwise dissimilarity: diam(C) = max d(i, j).",
        "The cluster with the fewest observations.",
        "The cluster that was created most recently.",
      ],
      correct: 1,
      explanation:
        "DIANA prioritizes partitioning the most heterogeneous cluster by selecting the cluster with the largest diameter diam(C) = max_{i, j in C} d(i, j).",
    },
    {
      id: 3,
      question: "How is the seed observation of the splinter group chosen in DIANA?",
      options: [
        "It is selected uniformly at random to prevent bias.",
        "It is the observation closest to the global centroid.",
        "It is the observation that maximizes average dissimilarity to all other observations within that cluster.",
        "It is the observation with the lowest individual coordinate values.",
      ],
      correct: 2,
      explanation:
        "The seed observation is the one that is most isolated within the cluster, having the highest average distance to all other members of the cluster.",
    },
    {
      id: 4,
      question:
        "Under what mathematical condition does a point i in remaining group R move into splinter group S?",
      options: [
        "When D_i - E_i > 0 and is the maximum among all candidates in R.",
        "When E_i > D_i.",
        "When D_i + E_i = 0.",
        "When the distance to the splinter seed is greater than the cluster diameter.",
      ],
      correct: 0,
      explanation:
        "A point is reassigned to the splinter group if its average distance to the remaining points (D_i) exceeds its average distance to the splinter group (E_i), meaning D_i - E_i > 0. DIANA greedily selects the candidate maximizing this difference.",
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
            Module 05 Knowledge Check: Divisive Clustering & DIANA
          </h4>
          <p className="text-xs text-muted-foreground">
            Test your mastery of combinatorial splitting complexity, DIANA diameter heuristics,
            splinter group dynamics, and stopping criteria.
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
