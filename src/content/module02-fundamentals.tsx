import { MathFormula } from "@/components/lab/blocks";
import { CheckCircle2, HelpCircle, Layers, Ruler, Table as TableIcon } from "lucide-react";

export function Module02Content() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-foreground/90">
      {/* 1. Observations and Feature Space */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">
          1. Observations, Features, and Feature Space
        </h3>
        <p>
          At the core of any clustering task is a collection of{" "}
          <MathFormula tex="N" display={false} /> observations (data points, items, or samples),
          each measured across <MathFormula tex="d" display={false} /> quantitative attributes or
          features. Mathematically, the dataset is represented as a matrix{" "}
          <MathFormula tex={String.raw`X \in \mathbb{R}^{N \times d}`} display={false} />:
        </p>
        <div className="py-2 flex justify-center">
          <MathFormula
            tex={String.raw`X = \begin{bmatrix} x_{1,1} & x_{1,2} & \cdots & x_{1,d} \\ x_{2,1} & x_{2,2} & \cdots & x_{2,d} \\ \vdots & \vdots & \ddots & \vdots \\ x_{N,1} & x_{N,2} & \cdots & x_{N,d} \end{bmatrix} = \begin{bmatrix} \mathbf{x}_1^T \\ \mathbf{x}_2^T \\ \vdots \\ \mathbf{x}_N^T \end{bmatrix}`}
            display={true}
          />
        </div>
        <p>
          Each observation{" "}
          <MathFormula tex={String.raw`\mathbf{x}_i \in \mathbb{R}^d`} display={false} /> occupies a
          specific coordinate within the <MathFormula tex="d" display={false} />
          -dimensional feature space. The fundamental hypothesis of clustering is that{" "}
          <strong>
            spatial proximity in feature space reflects semantic or structural similarity in the
            real-world domain
          </strong>
          .
        </p>
      </div>

      {/* 2. Similarity vs. Dissimilarity and Metric Axioms */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">
          2. Similarity vs. Dissimilarity (Distance)
        </h3>
        <p>
          While domain problems often speak of <em>similarity</em>{" "}
          <MathFormula tex="s(\mathbf{x}_i, \mathbf{x}_j) \in [0, 1]" display={false} /> (where 1
          means identical and 0 means completely dissimilar), hierarchical clustering algorithms
          traditionally operate on <strong>dissimilarity</strong> or <strong>distance</strong>{" "}
          <MathFormula tex="d(\mathbf{x}_i, \mathbf{x}_j) \ge 0" display={false} /> (where 0
          indicates identical points, and larger values indicate greater separation).
        </p>
        <div className="rounded-sm border-l-4 border-navy bg-secondary/40 p-4 space-y-2">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-navy">
            The Four Metric Axioms
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed">
            A function{" "}
            <MathFormula
              tex={String.raw`d: \mathbb{R}^d \times \mathbb{R}^d \to \mathbb{R}_{\ge 0}`}
              display={false}
            />{" "}
            is a formal <strong>metric</strong> if and only if it satisfies four mathematical
            conditions for all observations{" "}
            <MathFormula
              tex="\mathbf{x}, \mathbf{y}, \mathbf{z} \in \mathbb{R}^d"
              display={false}
            />
            :
          </p>
          <div className="grid gap-2 text-xs pt-1 sm:grid-cols-2">
            <div className="p-2 rounded-sm border border-border bg-background/80">
              <span className="font-bold text-teal">1. Non-negativity:</span>{" "}
              <MathFormula tex="d(\mathbf{x}, \mathbf{y}) \ge 0" display={false} />
            </div>
            <div className="p-2 rounded-sm border border-border bg-background/80">
              <span className="font-bold text-teal">2. Identity of Indiscernibles:</span>{" "}
              <MathFormula
                tex="d(\mathbf{x}, \mathbf{y}) = 0 \iff \mathbf{x} = \mathbf{y}"
                display={false}
              />
            </div>
            <div className="p-2 rounded-sm border border-border bg-background/80">
              <span className="font-bold text-teal">3. Symmetry:</span>{" "}
              <MathFormula
                tex="d(\mathbf{x}, \mathbf{y}) = d(\mathbf{y}, \mathbf{x})"
                display={false}
              />
            </div>
            <div className="p-2 rounded-sm border border-border bg-background/80">
              <span className="font-bold text-teal">4. Triangle Inequality:</span>{" "}
              <MathFormula
                tex="d(\mathbf{x}, \mathbf{z}) \le d(\mathbf{x}, \mathbf{y}) + d(\mathbf{y}, \mathbf{z})"
                display={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Crucial Distinction: Point Distance vs. Cluster Distance */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">
          3. The Critical Distinction: Point Distance vs. Cluster Distance
        </h3>
        <p>
          A common stumbling block for machine learning practitioners is failing to distinguish
          between two fundamentally different types of distance in hierarchical clustering:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-teal">
              <Ruler className="h-4 w-4" />
              <span>Observation-Level Distance</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Computes proximity between two individual coordinate vectors{" "}
              <MathFormula tex="\mathbf{x}_i, \mathbf{x}_j \in \mathbb{R}^d" display={false} />{" "}
              using a mathematical metric:
            </p>
            <div className="py-2 flex justify-center">
              <MathFormula
                tex={String.raw`d(\mathbf{x}_i, \mathbf{x}_j) = \|\mathbf{x}_i - \mathbf{x}_j\|_2 = \sqrt{\sum_{k=1}^d (x_{ik} - x_{jk})^2}`}
                display={true}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This calculation is static and computed once prior to clustering.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-navy">
              <Layers className="h-4 w-4" />
              <span>Cluster-Level Distance (Linkage)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Computes proximity between two entire sets of observations{" "}
              <MathFormula tex="C_A, C_B \subset X" display={false} /> using a{" "}
              <strong>linkage criterion</strong>{" "}
              <MathFormula tex="\mathcal{D}(C_A, C_B)" display={false} />:
            </p>
            <div className="py-2 flex justify-center">
              <MathFormula
                tex={String.raw`\mathcal{D}(C_A, C_B) = f(\{d(\mathbf{x}_i, \mathbf{x}_j) : \mathbf{x}_i \in C_A, \mathbf{x}_j \in C_B\})`}
                display={true}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This distance changes dynamically as clusters merge and grow throughout the hierarchy.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Distance Matrices: Squareform vs Condensed Vector */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">
          4. Pairwise Distance Representations
        </h3>
        <p>
          To initialize clustering, we compute all pairwise distances between the{" "}
          <MathFormula tex="N" display={false} /> observations. In statistical software (e.g. SciPy,
          NumPy), two primary formats exist:
        </p>
        <div className="space-y-3">
          <div className="p-3.5 rounded-sm border border-border bg-secondary/20 space-y-1.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-navy">
              A. Full Redundant Distance Matrix (Squareform)
            </h4>
            <p className="text-xs text-muted-foreground">
              An <MathFormula tex="N \times N" display={false} /> symmetric matrix{" "}
              <MathFormula tex="\mathbf{D}" display={false} /> where diagonal entries are zero (
              <MathFormula tex="\mathbf{D}_{ii} = 0" display={false} />) and off-diagonal entries
              are symmetric (<MathFormula tex="\mathbf{D}_{ij} = \mathbf{D}_{ji}" display={false} />
              ). Requires <MathFormula tex="N^2" display={false} /> floating-point storage.
            </p>
          </div>
          <div className="p-3.5 rounded-sm border border-border bg-secondary/20 space-y-1.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal">
              B. Condensed 1D Distance Vector
            </h4>
            <p className="text-xs text-muted-foreground">
              Because <MathFormula tex="\mathbf{D}" display={false} /> is symmetric with a zero
              diagonal, storing all <MathFormula tex="N^2" display={false} /> values wastes more
              than half the memory. SciPy stores only the strictly upper triangular entries in a
              flat 1D array of size:
            </p>
            <div className="py-1 flex justify-center">
              <MathFormula tex={String.raw`M = \frac{N(N - 1)}{2}`} display={true} />
            </div>
            <p className="text-xs text-muted-foreground">
              For any pair of observations <MathFormula tex="i < j" display={false} />, the
              corresponding index <MathFormula tex="k" display={false} /> in the condensed vector is
              calculated via the index formula:
            </p>
            <div className="py-1 flex justify-center">
              <MathFormula
                tex={String.raw`k = N \cdot i - \frac{i(i + 1)}{2} + j - i - 1`}
                display={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Verified Deterministic Numerical Example */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">
          5. Verified Numerical Walkthrough: 4-Point Dataset
        </h3>
        <p>
          To make these fundamental concepts concrete, let us calculate the full pairwise distance
          matrix and initial cluster merge for a 2-dimensional dataset with{" "}
          <MathFormula tex="N = 4" display={false} /> points:
        </p>
        <div className="py-1 flex justify-center">
          <MathFormula
            tex={String.raw`P_1 = (1, 2), \quad P_2 = (2, 3), \quad P_3 = (6, 5), \quad P_4 = (7, 6)`}
            display={true}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Using Euclidean distance{" "}
          <MathFormula
            tex={String.raw`d(P_i, P_j) = \sqrt{(x_i - x_j)^2 + (y_i - y_j)^2}`}
            display={false}
          />
          , we calculate all 6 pairwise distances independently:
        </p>
        <div className="grid gap-2 text-xs sm:grid-cols-2 font-mono">
          <div className="p-2.5 rounded-sm border border-border bg-background">
            d(P_1, P_2) = \sqrt{(2 - 1) ^ (2 + (3 - 2)) ^ 2} = \sqrt{1 + 1} = \sqrt{2} \approx
            1.4142
          </div>
          <div className="p-2.5 rounded-sm border border-border bg-background">
            d(P_3, P_4) = \sqrt{(7 - 6) ^ (2 + (6 - 5)) ^ 2} = \sqrt{1 + 1} = \sqrt{2} \approx
            1.4142
          </div>
          <div className="p-2.5 rounded-sm border border-border bg-background">
            d(P_2, P_3) = \sqrt{(6 - 2) ^ (2 + (5 - 3)) ^ 2} = \sqrt{16 + 4} = \sqrt{20} \approx
            4.4721
          </div>
          <div className="p-2.5 rounded-sm border border-border bg-background">
            d(P_1, P_3) = \sqrt{(6 - 1) ^ (2 + (5 - 2)) ^ 2} = \sqrt{25 + 9} = \sqrt{34} \approx
            5.8310
          </div>
          <div className="p-2.5 rounded-sm border border-border bg-background">
            d(P_2, P_4) = \sqrt{(7 - 2) ^ (2 + (6 - 3)) ^ 2} = \sqrt{25 + 9} = \sqrt{34} \approx
            5.8310
          </div>
          <div className="p-2.5 rounded-sm border border-border bg-background">
            d(P_1, P_4) = \sqrt{(7 - 1) ^ (2 + (6 - 2)) ^ 2} = \sqrt{36 + 16} = \sqrt{52} \approx
            7.2111
          </div>
        </div>

        <p className="pt-2 text-xs font-semibold text-foreground">
          The Resulting Symmetric Distance Matrix <MathFormula tex="\mathbf{D}" display={false} />:
        </p>
        <div className="py-2 flex justify-center">
          <MathFormula
            tex={String.raw`\mathbf{D} = \begin{bmatrix} 0.0000 & 1.4142 & 5.8310 & 7.2111 \\ 1.4142 & 0.0000 & 4.4721 & 5.8310 \\ 5.8310 & 4.4721 & 0.0000 & 1.4142 \\ 7.2111 & 5.8310 & 1.4142 & 0.0000 \end{bmatrix}`}
            display={true}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Notice the global minimum distance is <MathFormula tex="1.4142" display={false} />, which
          occurs for two pairs: <MathFormula tex="(P_1, P_2)" display={false} /> and{" "}
          <MathFormula tex="(P_3, P_4)" display={false} />. In an agglomerative algorithm, the
          lowest-index pair <MathFormula tex="(P_1, P_2)" display={false} /> is merged first into
          composite cluster <MathFormula tex="C_5" display={false} /> at merge height{" "}
          <MathFormula tex="h_1 = 1.4142" display={false} />.
        </p>
      </div>

      {/* 6. Dendrogram Fundamentals */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">
          6. Dendrogram Fundamentals: Anatomy of a Tree
        </h3>
        <p>
          A <strong>dendrogram</strong> (from the Greek <em>dendron</em> = tree, <em>gramma</em> =
          drawing) is a 2D tree diagram that visually summarizes the entire clustering history:
        </p>
        <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
          <li>
            <strong>Leaves (Terminal Nodes):</strong> Placed along the horizontal axis at height{" "}
            <MathFormula tex="h = 0" display={false} />, representing the{" "}
            <MathFormula tex="N" display={false} /> individual singleton observations.
          </li>
          <li>
            <strong>Vertical Stems:</strong> Indicate the dissimilarity distance at which two
            clusters merge into a parent node. Longer vertical stems signify greater cluster
            separation.
          </li>
          <li>
            <strong>Horizontal Crossbars:</strong> Connect the two child clusters being joined at
            that specific merge height.
          </li>
          <li>
            <strong>Cophenetic Distance:</strong> The height of the horizontal bar joining
            observation <MathFormula tex="i" display={false} /> and observation{" "}
            <MathFormula tex="j" display={false} /> represents their <em>cophenetic distance</em> in
            the tree representation.
          </li>
        </ul>
      </div>

      {/* 7. Key Takeaways & Academic References */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-foreground">
          7. Key Takeaways & Chapter References
        </h3>
        <div className="rounded-sm border-l-4 border-teal bg-secondary/50 p-4 space-y-1.5">
          <p className="text-xs font-bold text-foreground">Key Takeaways Summary</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
            <li>
              Clustering operates in a <MathFormula tex="d" display={false} />
              -dimensional feature space where spatial distance represents semantic dissimilarity.
            </li>
            <li>
              Formal distance metrics must satisfy non-negativity, identity, symmetry, and the
              triangle inequality.
            </li>
            <li>
              Crucial conceptual leap: <em>point-to-point</em> metrics determine the initial
              distance matrix, but <em>linkage criteria</em> govern how cluster-to-cluster distances
              update dynamically.
            </li>
            <li>
              Condensed vectors reduce storage from <MathFormula tex="N^2" display={false} /> to{" "}
              <MathFormula tex="N(N-1)/2" display={false} />, which is the standard input for SciPy
              hierarchical routines.
            </li>
          </ul>
        </div>
        <div className="pt-2 text-xs text-muted-foreground font-mono">
          <span>Module References: </span>
          <span className="text-foreground">
            Sokal & Rohlf (1962); Lance & Williams (1967); SciPy Spatial Distance Documentation
            (`pdist`, `squareform`).
          </span>
        </div>
      </div>
    </div>
  );
}
