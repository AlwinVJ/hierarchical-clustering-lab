import { MathFormula } from "@/components/lab/blocks";
import { CheckCircle2, AlertOctagon, HelpCircle, ArrowRight, BookOpen, Layers } from "lucide-react";

export function Module01Content() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-foreground/90">
      {/* 1. Introduction & Formal Definition */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">
          1. Introduction & Foundational Paradigm
        </h3>
        <p>
          In machine learning, <strong>clustering</strong> is the foundational task of discovering
          natural groupings, underlying structural manifolds, or taxonomic relationships within
          unlabeled data. Unlike supervised learning, where models optimize parameters against an
          explicit ground-truth response vector{" "}
          <MathFormula tex={String.raw`\mathbf{y} \in \mathbb{R}^N`} display={false} />,
          unsupervised clustering operates exclusively on feature representations{" "}
          <MathFormula
            tex={String.raw`X = \{\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N\} \subset \mathbb{R}^d`}
            display={false}
          />
          .
        </p>
        <p>
          <strong>Hierarchical Clustering</strong> refers to a distinct family of clustering
          algorithms that do not simply partition a dataset into a static, disjoint collection of{" "}
          <MathFormula tex="k" display={false} /> subsets. Instead, it constructs an entire{" "}
          <em>nested sequence of partitions</em> organized in a multi-level tree structure known as
          a <strong>dendrogram</strong>.
        </p>
      </div>

      {/* Formal Definition Callout */}
      <div className="rounded-sm border-l-4 border-navy bg-secondary/40 p-4 space-y-2">
        <div className="font-mono text-xs font-bold uppercase tracking-wider text-navy">
          Mathematical Definition: Nested Partition Hierarchy
        </div>
        <p className="text-xs text-foreground/90 leading-relaxed">
          Let <MathFormula tex={String.raw`S = \{1, 2, \dots, N\}`} display={false} /> denote the
          index set of <MathFormula tex="N" display={false} /> observations. A hierarchical
          clustering of <MathFormula tex="S" display={false} /> is a sequence of partitions{" "}
          <MathFormula
            tex={String.raw`\mathcal{P}_0, \mathcal{P}_1, \dots, \mathcal{P}_{N-1}`}
            display={false}
          />{" "}
          such that:
        </p>
        <div className="py-2 flex justify-center">
          <MathFormula
            tex={String.raw`\mathcal{P}_0 = \{\{1\}, \{2\}, \dots, \{N\}\}, \quad \mathcal{P}_{N-1} = \{S\}`}
            display={true}
          />
        </div>
        <p className="text-xs text-foreground/90">
          and for every step <MathFormula tex="t \in \{0, 1, \dots, N-2\}" display={false} />,
          partition <MathFormula tex={String.raw`\mathcal{P}_{t+1}`} display={false} /> is formed by
          combining exactly two clusters from{" "}
          <MathFormula tex={String.raw`\mathcal{P}_t`} display={false} /> (agglomerative) or
          splitting one cluster into two (divisive), ensuring that every cluster at level{" "}
          <MathFormula tex="t" display={false} /> is a subset of some cluster at level{" "}
          <MathFormula tex="t+1" display={false} />.
        </p>
      </div>

      {/* 2. Supervised vs. Unsupervised Learning */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">
          2. Supervised Learning vs. Unsupervised Clustering
        </h3>
        <p>
          To appreciate why hierarchical clustering is unique, we must contrast it with both
          supervised learning and flat partition-based clustering:
        </p>
        <div className="overflow-x-auto rounded-sm border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/60 font-semibold text-foreground">
              <tr>
                <th className="p-3 border-b border-border">Dimension</th>
                <th className="p-3 border-b border-border">Supervised Learning (Classification)</th>
                <th className="p-3 border-b border-border">
                  Unsupervised Flat Clustering (K-Means)
                </th>
                <th className="p-3 border-b border-border">Hierarchical Clustering</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-medium bg-secondary/10">Ground Truth Labels</td>
                <td className="p-3">
                  Required (<MathFormula tex="\mathbf{y}" display={false} /> provided during
                  training)
                </td>
                <td className="p-3">None (discovers spatial groupings)</td>
                <td className="p-3">None (discovers nested multi-scale topologies)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium bg-secondary/10">Number of Clusters</td>
                <td className="p-3">Fixed by discrete label classes</td>
                <td className="p-3">
                  Must be specified in advance (<MathFormula tex="k" display={false} />)
                </td>
                <td className="p-3">Not required in advance; determined post-hoc by tree cuts</td>
              </tr>
              <tr>
                <td className="p-3 font-medium bg-secondary/10">Output Representation</td>
                <td className="p-3">Decision boundary / class probabilities</td>
                <td className="p-3">
                  Flat partition of <MathFormula tex="k" display={false} /> Voronoi cells
                </td>
                <td className="p-3">
                  Complete dendrogram tree revealing multi-granularity hierarchies
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium bg-secondary/10">Determinism</td>
                <td className="p-3">Deterministic once optimizer converges</td>
                <td className="p-3">Non-deterministic (sensitive to random centroid seed)</td>
                <td className="p-3">Fully deterministic (exact pairwise distance ordering)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium bg-secondary/10">Scalability</td>
                <td className="p-3">
                  <MathFormula tex="O(N \cdot d)" display={false} /> per epoch
                </td>
                <td className="p-3">
                  <MathFormula tex="O(N \cdot k \cdot d \cdot i)" display={false} /> (linear in{" "}
                  <MathFormula tex="N" display={false} />)
                </td>
                <td className="p-3">
                  <MathFormula tex="O(N^2)" display={false} /> memory,{" "}
                  <MathFormula tex="O(N^2 \log N)" display={false} /> to{" "}
                  <MathFormula tex="O(N^3)" display={false} /> compute
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Why Hierarchical Clustering? */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">
          3. Why Hierarchical Clustering? The Power of Multi-Scale Analysis
        </h3>
        <p>
          In real-world empirical phenomena, categories are rarely flat. Consider biological
          taxonomy: organisms belong to species, which belong to genera, families, orders, classes,
          phyla, and kingdoms. Similarly, customer behavior spans broad macro-segments (e.g.
          wholesale vs. retail) that naturally branch into micro-personas (e.g. impulse discount
          buyers vs. loyal premium subscribers).
        </p>
        <p>
          Flat algorithms like K-Means force the practitioner to choose a single arbitrary
          granularity level <MathFormula tex="k" display={false} /> prior to running the algorithm.
          If <MathFormula tex="k=3" display={false} /> is selected, any rich sub-cluster structure
          within those 3 clusters is entirely discarded. Hierarchical clustering solves this by
          computing <em>all granularities simultaneously</em>. The resulting dendrogram allows
          domain experts to inspect macro-clusters at large heights and micro-clusters at lower
          heights within a unified mathematical model.
        </p>
      </div>

      {/* 4. Real-world Application Landscapes */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">4. Real-World Applications</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-sm border border-border bg-card p-3.5 space-y-1.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal">
              Bioinformatics & Phylogenetics
            </h4>
            <p className="text-xs text-muted-foreground">
              Reconstructing evolutionary trees from genomic sequence dissimilarities; grouping gene
              expression microarray profiles to discover co-regulated gene pathways.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-card p-3.5 space-y-1.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal">
              Information Retrieval & NLP
            </h4>
            <p className="text-xs text-muted-foreground">
              Constructing automated topic taxonomies and document ontologies; grouping search
              queries into hierarchical intent trees.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-card p-3.5 space-y-1.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal">
              Geospatial & Social Networks
            </h4>
            <p className="text-xs text-muted-foreground">
              Discovering hierarchical metropolitan zones from commuter movement flows;
              multi-resolution community detection in social graphs.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Advantages & Critical Limitations */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">
          5. Comparative Advantages & Core Constraints
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-border bg-secondary/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal">
              <CheckCircle2 className="h-4 w-4 text-teal" />
              <span>Core Advantages</span>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
              <li>
                <strong>
                  No predefined <MathFormula tex="k" display={false} />:
                </strong>{" "}
                The number of clusters is chosen post-analysis by cutting the tree at an informative
                threshold.
              </li>
              <li>
                <strong>Informative Visualization:</strong> The dendrogram provides an interpretable
                summary of data topology and cluster separation distances.
              </li>
              <li>
                <strong>Deterministic:</strong> Produces identical cluster structures on
                deterministic pairwise distances, unlike random-seed dependent K-Means.
              </li>
              <li>
                <strong>Flexible Dissimilarity:</strong> Compatible with arbitrary pairwise metric
                spaces (Euclidean, Manhattan, Cosine, Jaccard, string edit distances).
              </li>
            </ul>
          </div>
          <div className="rounded-sm border border-border bg-secondary/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-destructive">
              <AlertOctagon className="h-4 w-4 text-destructive" />
              <span>Fundamental Constraints</span>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
              <li>
                <strong>High Computational Complexity:</strong> Naive agglomeration requires{" "}
                <MathFormula tex="O(N^3)" display={false} /> time; optimized implementations require{" "}
                <MathFormula tex="O(N^2)" display={false} />.
              </li>
              <li>
                <strong>Substantial Memory Footprint:</strong> Storing the full pairwise distance
                matrix demands <MathFormula tex="O(N^2)" display={false} /> memory, creating
                bottlenecks for <MathFormula tex="N > 50,000" display={false} />.
              </li>
              <li>
                <strong>Greedy Irreversibility:</strong> Once two clusters are merged in
                agglomerative clustering, they can never be separated at later stages, causing early
                merge errors to propagate.
              </li>
              <li>
                <strong>Outlier Sensitivity:</strong> Isolated outliers can distort linkage
                calculations or form degenerate chains of singleton clusters.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 6. When to Use Hierarchical Clustering */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">
          6. Practical Decision Heuristic: When to Use It
        </h3>
        <p>As an engineering rule of thumb, choose hierarchical clustering when:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
          <li>
            The dataset size is small to moderate (typically{" "}
            <MathFormula tex="N \le 10,000" display={false} /> samples).
          </li>
          <li>
            The natural domain problem possesses an intrinsic taxonomic or nested hierarchy (e.g.
            biology, document ontologies, multi-level market segmentation).
          </li>
          <li>
            You need to visually inspect cluster separation distances before committing to a final
            number of clusters <MathFormula tex="k" display={false} />.
          </li>
          <li>
            You require a non-Euclidean dissimilarity metric (e.g. Cosine distance for text vectors,
            Jaccard for binary feature sets) that K-Means cannot natively optimize.
          </li>
        </ol>
      </div>

      {/* 7. Common Misconceptions */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">7. Common Misconceptions</h3>
        <div className="space-y-2.5">
          <div className="rounded-sm border border-border bg-secondary/30 p-3 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <HelpCircle className="h-3.5 w-3.5 text-teal" />
              <span>
                Misconception: "Hierarchical clustering can correct mistakes made in early
                iterations."
              </span>
            </div>
            <p className="text-xs text-muted-foreground pl-5">
              <strong>Reality:</strong> Both agglomerative and divisive hierarchical algorithms make
              locally optimal greedy decisions. Once two observations are merged into a cluster,
              that merge is permanent and immutable for all subsequent higher levels.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-secondary/30 p-3 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <HelpCircle className="h-3.5 w-3.5 text-teal" />
              <span>
                Misconception: "Dendrogram branch height always reflects the Euclidean distance
                between cluster centroids."
              </span>
            </div>
            <p className="text-xs text-muted-foreground pl-5">
              <strong>Reality:</strong> Merge height depends entirely on the chosen{" "}
              <em>linkage criterion</em>. In single linkage, it represents minimum pairwise point
              distance; in complete linkage, maximum distance; in Ward's linkage, the square root of
              the normalized increase in within-cluster variance.
            </p>
          </div>
        </div>
      </div>

      {/* 8. Key Takeaways & Academic References */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">
          8. Key Takeaways & Chapter References
        </h3>
        <div className="rounded-sm border-l-4 border-teal bg-secondary/50 p-4 space-y-1.5">
          <p className="text-xs font-bold text-foreground">Key Takeaways Summary</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
            <li>
              Hierarchical clustering produces a deterministic, nested continuum of clusterings from{" "}
              <MathFormula tex="N" display={false} /> singletons to 1 root cluster.
            </li>
            <li>
              It eliminates the requirement of guessing <MathFormula tex="k" display={false} />{" "}
              upfront and reveals structural relationships via dendrograms.
            </li>
            <li>
              Its computational cost (<MathFormula tex="O(N^2)" display={false} /> space,{" "}
              <MathFormula tex="O(N^2)" display={false} /> to{" "}
              <MathFormula tex="O(N^3)" display={false} /> time) makes it best suited for
              exploratory and moderate-scale analytical tasks.
            </li>
          </ul>
        </div>
        <div className="pt-2 text-xs text-muted-foreground font-mono">
          <span>Module References: </span>
          <span className="text-foreground">
            Kaufman & Rousseeuw (1990) Ch. 1 & 6; Murtagh & Contreras (2012); Scikit-learn User
            Guide §2.3.
          </span>
        </div>
      </div>
    </div>
  );
}
