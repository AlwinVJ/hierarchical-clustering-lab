import { useState } from "react";
import { MathFormula } from "@/components/lab/blocks";
import {
  ArrowDownUp,
  GitMerge,
  Split,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Layers,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

/** Interactive Side-by-Side Paradigm Comparison Visualizer */
export function ParadigmComparisonVisualizer() {
  const [step, setStep] = useState(0);

  const stepsData = [
    {
      step: 0,
      title: "Step 0: Initial State",
      agg: {
        stage: "N Singleton Clusters",
        clusters: ["{ P₁ }", "{ P₂ }", "{ P₃ }", "{ P₄ }"],
        desc: "Agglomerative begins with every observation as an independent cluster. Active clusters = 4.",
        badge: "Bottom Boundary",
      },
      div: {
        stage: "1 Universal Root Cluster",
        clusters: ["{ P₁, P₂, P₃, P₄ }"],
        desc: "Divisive begins with the entire dataset enclosed in a single cluster. Diameter = 7.2111.",
        badge: "Top Boundary",
      },
    },
    {
      step: 1,
      title: "Step 1: First Transition",
      agg: {
        stage: "First Merge: { P₁, P₂ }",
        clusters: ["{ P₁, P₂ }", "{ P₃ }", "{ P₄ }"],
        desc: "Pair (P₁, P₂) has minimal distance (d = 1.4142) and is merged into composite cluster C₅.",
        badge: "Clusters: 4 → 3",
      },
      div: {
        stage: "First Split: { P₁, P₂ } and { P₃, P₄ }",
        clusters: ["{ P₁, P₂ }", "{ P₃, P₄ }"],
        desc: "DIANA forms a splinter group starting with P₁, pulling P₂. Splitting completes into two clusters.",
        badge: "Clusters: 1 → 2",
      },
    },
    {
      step: 2,
      title: "Step 2: Second Transition",
      agg: {
        stage: "Second Merge: { P₃, P₄ }",
        clusters: ["{ P₁, P₂ }", "{ P₃, P₄ }"],
        desc: "Pair (P₃, P₄) has minimal distance (d = 1.4142) and is merged into composite cluster C₆.",
        badge: "Clusters: 3 → 2",
      },
      div: {
        stage: "Second Split: Sub-dividing { P₁, P₂ }",
        clusters: ["{ P₁ }", "{ P₂ }", "{ P₃, P₄ }"],
        desc: "Cluster { P₁, P₂ } (diameter 1.4142) is split into two singletons { P₁ } and { P₂ }.",
        badge: "Clusters: 2 → 3",
      },
    },
    {
      step: 3,
      title: "Step 3: Termination",
      agg: {
        stage: "Final Coalescence into Root",
        clusters: ["{ P₁, P₂, P₃, P₄ }"],
        desc: "The final two clusters merge across the inter-cluster gap into the root cluster.",
        badge: "Termination: 1 Root",
      },
      div: {
        stage: "Final Splitting into Singletons",
        clusters: ["{ P₁ }", "{ P₂ }", "{ P₃ }", "{ P₄ }"],
        desc: "Cluster { P₃, P₄ } splits into singletons { P₃ } and { P₄ }. All clusters are singletons.",
        badge: "Termination: N Singletons",
      },
    },
  ];

  const current = stepsData[step];

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4 text-teal" />
            Side-by-Side Progression Visualizer (4-Point Dataset)
          </h4>
          <p className="text-xs text-muted-foreground">
            Observe the dual trajectory: Bottom-Up Agglomeration vs. Top-Down Division.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-sm border border-border px-2.5 py-1 font-mono text-xs text-foreground hover:bg-secondary disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="font-mono text-xs text-teal font-semibold px-1">Step {step} of 3</span>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            disabled={step === 3}
            className="rounded-sm bg-navy px-2.5 py-1 font-mono text-xs text-primary-foreground hover:bg-deep disabled:opacity-40 transition-colors"
          >
            Next
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            title="Reset simulation"
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Left: Agglomerative */}
        <div className="rounded-sm border border-border bg-secondary/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-navy uppercase">
              <GitMerge className="h-4 w-4 text-teal" />
              <span>Agglomerative (Bottom-Up)</span>
            </div>
            <span className="rounded-sm bg-navy/10 px-2 py-0.5 font-mono text-[10px] text-navy font-semibold">
              {current.agg.badge}
            </span>
          </div>

          <div className="p-3 rounded-sm border border-border bg-background space-y-2">
            <div className="text-xs font-semibold text-foreground">{current.agg.stage}</div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {current.agg.clusters.map((c) => (
                <span
                  key={c}
                  className="rounded-sm border border-teal/40 bg-teal/10 px-2 py-1 text-navy font-semibold"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{current.agg.desc}</p>
        </div>

        {/* Right: Divisive */}
        <div className="rounded-sm border border-border bg-secondary/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-teal uppercase">
              <Split className="h-4 w-4 text-teal" />
              <span>Divisive (Top-Down)</span>
            </div>
            <span className="rounded-sm bg-teal/10 px-2 py-0.5 font-mono text-[10px] text-teal font-semibold">
              {current.div.badge}
            </span>
          </div>

          <div className="p-3 rounded-sm border border-border bg-background space-y-2">
            <div className="text-xs font-semibold text-foreground">{current.div.stage}</div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {current.div.clusters.map((c) => (
                <span
                  key={c}
                  className="rounded-sm border border-navy/30 bg-navy/5 px-2 py-1 text-foreground font-semibold"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{current.div.desc}</p>
        </div>
      </div>
    </div>
  );
}

/** Interactive Knowledge Check Component */
export function Module03Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question:
        "Why is an unconstrained, exhaustive search for optimal cluster bi-partitioning in generic divisive clustering computationally intractable for large clusters?",
      options: [
        "Because it requires computing distance metrics in infinite-dimensional spaces.",
        "Because dividing a cluster of m observations into two non-empty subsets involves evaluating 2^(m-1) - 1 possible partitions.",
        "Because top-down trees cannot be represented in Euclidean coordinate space.",
        "Because divisive clustering requires storing N^3 pairwise distance matrices.",
      ],
      correct: 1,
      explanation:
        "An exhaustive search over all possible non-empty binary splits of m elements requires checking 2^(m-1) - 1 combinations, which grows exponentially O(2^m). Heuristic algorithms like DIANA or 2-Means are necessary to make divisive clustering polynomial.",
    },
    {
      id: 2,
      question:
        "In the DIANA (Divisive Analysis) algorithm, how is the cluster selected for the next split chosen?",
      options: [
        "The cluster with the fewest data points is selected.",
        "The cluster with the largest diameter (maximum pairwise dissimilarity) is selected.",
        "A cluster is chosen completely at random.",
        "The cluster with the highest average density is selected.",
      ],
      correct: 1,
      explanation:
        "DIANA defines cluster diameter as D(C) = max d(i, j) for all i, j in C. At each step, it selects the cluster with the largest diameter to subdivide, focusing effort on the most dispersed grouping.",
    },
    {
      id: 3,
      question:
        "What key characteristic describes the greedy decision mechanism in classical agglomerative clustering?",
      options: [
        "It can reconsider and undo earlier merge decisions if a later partition has lower variance.",
        "It evaluates all possible dendrogram topologies simultaneously before outputting the tree.",
        "It makes the locally optimal merge decision at step t, which is permanent and irreversible for all higher levels.",
        "It requires pre-specifying the exact number of clusters k before pairwise distances are computed.",
      ],
      correct: 2,
      explanation:
        "Agglomerative clustering is greedy: once two clusters merge, they can never be separated. Early merge errors propagate upward, making the algorithm sensitive to initial noise and outliers.",
    },
    {
      id: 4,
      question:
        "When is a divisive clustering strategy particularly advantageous compared to agglomerative clustering in practical data science?",
      options: [
        "When the user only needs a small number of large macro-clusters (e.g. k = 2 or 3) from a large dataset, avoiding the full bottom-up merge sequence.",
        "When calculating pairwise distances is completely impossible.",
        "When the dataset consists exclusively of 1-dimensional categorical strings.",
        "When single linkage chaining is required for elongated geometries.",
      ],
      correct: 0,
      explanation:
        "Because divisive clustering starts at the root, if only 2 or 3 broad clusters are required, it can stop after 1 or 2 splits without ever computing the full bottom-up tree.",
    },
  ];

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-4">
      <div className="border-b border-border pb-3">
        <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-teal" />
          Module 03 Knowledge Check
        </h4>
        <p className="text-xs text-muted-foreground">
          Test your comprehension of bottom-up vs. top-down clustering mechanics, DIANA heuristics,
          and decision trade-offs.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = userChoice !== undefined;
          const isCorrect = userChoice === q.correct;

          return (
            <div
              key={q.id}
              className="rounded-sm border border-border bg-secondary/20 p-4 space-y-2.5"
            >
              <p className="text-xs font-semibold text-foreground">
                <span className="font-mono text-teal mr-1.5">Q{q.id}.</span>
                {q.question}
              </p>

              <div className="space-y-1.5">
                {q.options.map((opt, optIdx) => {
                  let optStyle =
                    "border-border bg-background text-foreground/90 hover:bg-secondary/60";
                  if (showResults && isAnswered) {
                    if (optIdx === q.correct) {
                      optStyle = "border-teal bg-teal/15 text-navy font-semibold";
                    } else if (optIdx === userChoice) {
                      optStyle = "border-destructive/60 bg-destructive/10 text-destructive";
                    }
                  } else if (userChoice === optIdx) {
                    optStyle = "border-navy bg-navy/10 text-navy font-semibold";
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={showResults}
                      onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                      className={`flex w-full text-left items-start gap-2.5 rounded-sm border p-2.5 text-xs transition-colors ${optStyle}`}
                    >
                      <span className="font-mono text-[11px] font-bold shrink-0 opacity-70">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div
                  className={`mt-2 p-2.5 rounded-sm text-xs leading-relaxed border ${
                    isCorrect
                      ? "border-teal/30 bg-teal/10 text-foreground"
                      : "border-destructive/30 bg-destructive/5 text-foreground"
                  }`}
                >
                  <span className="font-bold">{isCorrect ? "Correct! " : "Incorrect. "}</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowResults((prev) => !prev)}
          className="rounded-sm bg-navy px-4 py-2 font-mono text-xs font-semibold text-primary-foreground hover:bg-deep transition-colors"
        >
          {showResults ? "Hide Explanations" : "Submit & Check Answers"}
        </button>
        {showResults && (
          <span className="font-mono text-xs text-muted-foreground">
            Score:{" "}
            <strong className="text-teal font-bold">
              {questions.filter((q) => selectedAnswers[q.id] === q.correct).length}
            </strong>{" "}
            / {questions.length}
          </span>
        )}
      </div>
    </div>
  );
}
