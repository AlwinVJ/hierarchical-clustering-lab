import { useState } from "react";
import { HelpCircle, CheckCircle2, RotateCcw } from "lucide-react";

export function Module02Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const questions = [
    {
      id: 1,
      prompt:
        "Which of the following is NOT one of the four formal mathematical axioms of a metric space (M, d)?",
      options: [
        "Non-negativity: d(x, y) ≥ 0 for all x, y.",
        "Identity of Indiscernibles: d(x, y) = 0 if and only if x = y.",
        "Monotonicity of Scale: d(c·x, c·y) = c² · d(x, y) for any scalar c.",
        "Triangle Inequality: d(x, z) ≤ d(x, y) + d(y, z) for all x, y, z.",
      ],
      correct: 2,
      explanation:
        "The four foundational metric space axioms are: (1) Non-negativity d(x, y) ≥ 0, (2) Identity of indiscernibles d(x, y) = 0 ⇔ x = y, (3) Symmetry d(x, y) = d(y, x), and (4) Triangle inequality d(x, z) ≤ d(x, y) + d(y, z). Monotonicity of scale is not a metric axiom (norms satisfy absolute homogeneity d(cx, cy) = |c|·d(x, y), not c²).",
    },
    {
      id: 2,
      prompt:
        "How many unique pairwise distances must be stored for a dataset of N = 100 observations in a condensed distance vector?",
      options: [
        "100 elements (O(N))",
        "4,950 elements (N(N - 1) / 2)",
        "10,000 elements (N²)",
        "5,050 elements (N(N + 1) / 2)",
      ],
      correct: 1,
      explanation:
        "Because distance matrices are symmetric (d(x, y) = d(y, x)) with zero diagonal (d(x, x) = 0), only the upper triangular entries need to be stored. The condensed distance vector contains exactly N(N - 1) / 2 elements. For N = 100, this is (100 × 99) / 2 = 4,950 elements.",
    },
    {
      id: 3,
      prompt:
        "What is the key geometric difference between Euclidean distance (L₂ norm) and Manhattan distance (L₁ norm) isocontours?",
      options: [
        "L₂ isocontours are circular / spherical; L₁ isocontours are diamonds / rhombuses rotated at 45 degrees.",
        "L₁ isocontours are elliptical, while L₂ isocontours are square.",
        "L₂ is bounded between 0 and 1, while L₁ is unbounded.",
        "L₁ cannot be computed in spaces with dimension d > 2.",
      ],
      correct: 0,
      explanation:
        "In 2D space, the locus of points at constant Euclidean distance d_2(x, 0) = r forms a circle {x : x₁² + x₂² = r²}. For Manhattan distance, d_1(x, 0) = |x₁| + |x₂| = r forms a diamond (rotated square), which induces rectilinear grid paths and is more robust to extreme outlier coordinates.",
    },
    {
      id: 4,
      prompt:
        "What is the defining property of an Ultrametric Space, which governs dendrogram cophenetic distances?",
      options: [
        "Distances can be negative if clusters overlap.",
        "Strong Triangle Inequality: d(x, z) ≤ max(d(x, y), d(y, z)) for all triples (x, y, z).",
        "The distance between any two points must equal the sum of their vector coordinates.",
        "Every cluster centroid must be an observation in the dataset.",
      ],
      correct: 1,
      explanation:
        "An ultrametric space satisfies the strong triangle inequality: d(x, z) ≤ max(d(x, y), d(y, z)). A profound geometric consequence is that in an ultrametric space, every triangle is isosceles with at least two equal longer sides! Dendrogram cophenetic merge heights satisfy this property exactly.",
    },
    {
      id: 5,
      prompt:
        "Why does an observation distance metric d(x, y) not automatically define cluster-to-cluster distance D(A, B)?",
      options: [
        "Clusters A and B are sets of points, so a linkage criterion f must define how pairwise point distances are aggregated into a single scalar dissimilarity.",
        "Observation distances cannot be evaluated when clusters have unequal cardinalities.",
        "Metric axioms only apply to scalar variables.",
        "Distance metrics only measure correlation, not separation.",
      ],
      correct: 0,
      explanation:
        "A distance metric d(p, q) evaluates distance between two individual points. When dealing with clusters A and B containing multiple observations, a linkage function D(A, B) = f({d(p, q) : p ∈ A, q ∈ B}) is required to aggregate all pairwise distances into a single cluster dissimilarity (e.g., minimum, maximum, average, or variance increase).",
    },
    {
      id: 6,
      prompt:
        "What is the 'chaining phenomenon' and which linkage method is notoriously susceptible to it?",
      options: [
        "Ward linkage forming equal-sized clusters regardless of data density.",
        "Single linkage extending elongated, strand-like clusters across noise bridges, merging two distinct clusters prematurely.",
        "Complete linkage failing to compute distances when clusters have more than 10 points.",
        "Average linkage causing dendrogram inversions.",
      ],
      correct: 1,
      explanation:
        "Single linkage measures the minimum distance between any point in A and any point in B. If even a few spurious noise points form a thin 'bridge' between two large, distinct clusters, single linkage will follow the chain of small pairwise gaps and merge the two macro clusters together prematurely.",
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
    <div className="my-8 rounded-sm border border-border bg-card p-6 shadow-xs space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal font-mono">
            <HelpCircle className="h-4 w-4" />
            Knowledge Check
          </div>
          <h3 className="mt-1 text-lg font-bold text-foreground">
            Module 02: Fundamentals &amp; Distance Space Self-Assessment
          </h3>
          <p className="text-xs text-muted-foreground">
            Test your comprehension of metric axioms, norm geometries, ultrametric properties, and
            condensed distance vectors.
          </p>
        </div>
        {showResults && (
          <div className="inline-flex items-center gap-2 rounded-sm bg-teal/10 px-3 py-1.5 text-xs font-mono font-bold text-teal border border-teal/20">
            Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userAns = selectedAnswers[q.id];
          const isCorrect = userAns === q.correct;

          return (
            <div
              key={q.id}
              className="rounded-sm border border-border bg-secondary/30 p-4 space-y-3"
            >
              <p className="text-sm font-semibold text-foreground">
                {idx + 1}. {q.prompt}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let btnStyle = "border-border bg-card text-foreground hover:bg-secondary/40";

                  if (showResults) {
                    if (optIdx === q.correct) {
                      btnStyle = "border-teal bg-teal/10 text-teal font-medium border-teal/40";
                    } else if (userAns === optIdx) {
                      btnStyle =
                        "border-destructive bg-destructive/10 text-destructive font-medium border-destructive/40";
                    }
                  } else if (userAns === optIdx) {
                    btnStyle = "border-navy bg-teal/10 text-teal font-medium";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={showResults}
                      className={`flex w-full items-center justify-between rounded-sm border p-3 text-left text-xs transition-all ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showResults && optIdx === q.correct && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div
                  className={`rounded-sm p-3 text-xs leading-relaxed ${
                    isCorrect
                      ? "bg-teal/10 text-teal border border-teal/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
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
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retake Quiz
          </button>
        ) : (
          <button
            onClick={() => setShowResults(true)}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className="rounded-sm bg-navy hover:bg-deep text-primary-foreground px-5 py-2 text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
}
