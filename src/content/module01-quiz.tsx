import { useState } from "react";
import { HelpCircle, CheckCircle2, RotateCcw } from "lucide-react";

export function Module01Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const questions = [
    {
      id: 1,
      prompt:
        "What is the defining mathematical property that distinguishes clustering from supervised classification?",
      options: [
        "Clustering operates strictly on scalar values, while classification handles vectors.",
        "Clustering discovers natural geometric partitions without access to predefined ground-truth target labels.",
        "Classification minimizes squared error, while clustering cannot optimize loss functions.",
        "Clustering requires prior knowledge of class probabilities.",
      ],
      correct: 1,
      explanation:
        "Supervised classification trains on labeled input-target pairs (x_i, y_i) to learn a decision boundary. Clustering is fundamentally unsupervised: it operates strictly on unlabeled observation vectors X to discover latent groupings based purely on spatial or topological similarity.",
    },
    {
      id: 2,
      prompt:
        "In hierarchical clustering of N observations, what constitutes the formal nested partition sequence?",
      options: [
        "A sequence of partitions P₀ ≺ P₁ ≺ ... ≺ P_{N-1} where every cluster at level t is a subset of some cluster at level t+1.",
        "N completely independent disjoint Voronoi tessellations of the feature space.",
        "A single partition where every cluster contains exactly k = log₂(N) observations.",
        "A descending list of observations sorted by magnitude.",
      ],
      correct: 0,
      explanation:
        "A hierarchical clustering forms a sequence of nested partitions P₀ ≺ P₁ ≺ ... ≺ P_{N-1}, starting from the trivial partition of N singletons P₀ = {{1}, ..., {N}} and terminating at the universal cluster P_{N-1} = {{1, ..., N}}. At every step, clusters in P_t are strictly nested within clusters of P_{t+1}.",
    },
    {
      id: 3,
      prompt:
        "What is the primary algorithmic distinction between Agglomerative and Divisive hierarchical clustering?",
      options: [
        "Agglomerative is bottom-up (merges singletons into root); Divisive is top-down (splits root into singletons).",
        "Agglomerative works only with Euclidean distance, while Divisive requires Manhattan distance.",
        "Agglomerative is O(N), while Divisive is O(N log N).",
        "Agglomerative produces binary trees, while Divisive produces ternary trees.",
      ],
      correct: 0,
      explanation:
        "Agglomerative clustering begins with N singleton clusters and iteratively merges the closest pair of clusters until a single root remains (bottom-up). Divisive clustering begins with one monolithic cluster and recursively fractures it into sub-clusters until all points are singletons (top-down).",
    },
    {
      id: 4,
      prompt: "Why is agglomerative hierarchical clustering classified as a 'greedy' algorithm?",
      options: [
        "It consumes more memory than any other machine learning algorithm.",
        "At each iteration, it commits to the locally optimal pairwise merge without backtracking, and merges can never be undone.",
        "It attempts all 2^N possible merge combinations before selecting one.",
        "It requires high CPU utilization during training.",
      ],
      correct: 1,
      explanation:
        "At iteration t, agglomerative clustering greedily merges the two clusters with the minimum dissimilarity. This decision is permanent and irreversible: if an erroneous merge occurs due to noise or chaining, the algorithm cannot undo or reassign observations at subsequent levels.",
    },
    {
      id: 5,
      prompt:
        "Why is a naive exhaustive search for divisive clustering splits computationally intractable for moderate N?",
      options: [
        "Distance matrices cannot be evaluated top-down.",
        "Bisecting a cluster of m observations into two non-empty subsets entails evaluating 2^(m-1) - 1 possible splits, which explodes exponentially.",
        "Dendrogram crossbars cannot support divisive branch heights.",
        "Floating point precision errors corrupt top-down calculations.",
      ],
      correct: 1,
      explanation:
        "To split a set of m points into two non-empty subsets, there are 2^(m-1) - 1 distinct combinations. For m = 100 points, 2^99 - 1 ≈ 6.33 × 10^29 combinations would need to be evaluated at the very first step, making exhaustive divisive search impossible without heuristics like DIANA.",
    },
    {
      id: 6,
      prompt:
        "Which of the following real-world applications is most naturally suited to hierarchical clustering rather than flat K-Means?",
      options: [
        "Biological phylogenetic trees and evolutionary taxonomic classification.",
        "Real-time streaming fraud detection over 100 million transactions per minute.",
        "Quantizing pixel color palettes in real-time video encoders.",
        "Partitioning 10 million users into exactly k = 4 balanced marketing tiers.",
      ],
      correct: 0,
      explanation:
        "Biological phylogenetics and taxonomic classification feature inherently nested multi-scale evolutionary relationships (species within genera within families within orders). Hierarchical clustering produces the multi-level tree required for this domain, whereas K-Means produces only a flat partition.",
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
            Module 01: Introduction &amp; Foundations Self-Assessment
          </h3>
          <p className="text-xs text-muted-foreground">
            Test your comprehension of clustering definitions, nested partition hierarchies, and
            agglomerative vs. divisive paradigms.
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
