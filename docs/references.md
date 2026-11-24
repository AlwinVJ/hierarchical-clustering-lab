# Hierarchical Clustering Lab: Authoritative Technical & Academic References

This documentation catalogs the foundational academic papers, peer-reviewed monographs, and primary technical documentation used to design, mathematically verify, and implement the educational content of the **Hierarchical Clustering Lab**.

---

## 1. Primary Technical Documentation

### Scikit-learn

- **Title**: _Scikit-learn User Guide — 2.3. Clustering: Hierarchical clustering_
  - **Organization**: Scikit-learn Development Team
  - **URL**: https://scikit-learn.org/stable/modules/clustering.html#hierarchical-clustering
  - **Verified Information**: Parameter semantics for `sklearn.cluster.AgglomerativeClustering` (`n_clusters`, `metric`, `linkage`, `distance_threshold`, `compute_distances`, `children_`, `distances_`), tree extraction logic, and graph connectivity constraints.
- **Title**: _Scikit-learn API Reference — `sklearn.cluster.AgglomerativeClustering`_
  - **Organization**: Scikit-learn Development Team
  - **URL**: https://scikit-learn.org/stable/modules/generated/sklearn.cluster.AgglomerativeClustering.html
  - **Verified Information**: Validation of parameter combinations (e.g. `metric="euclidean"` requirement for Ward linkage, `distance_threshold` mutual exclusivity with `n_clusters`).
- **Title**: _Scikit-learn Clustering Performance Evaluation_
  - **Organization**: Scikit-learn Development Team
  - **URL**: https://scikit-learn.org/stable/modules/clustering.html#clustering-performance-evaluation
  - **Verified Information**: Silhouette score formulation, Davies-Bouldin index formulation, intra-cluster vs nearest-cluster formulations.

### SciPy

- **Title**: _SciPy API Reference — `scipy.cluster.hierarchy`_
  - **Organization**: SciPy Community
  - **URL**: https://docs.scipy.org/doc/scipy/reference/cluster.hierarchy.html
  - **Verified Information**: Structure of the `(N-1, 4)` linkage matrix `Z`, indices convention for cluster merges ($N+i$), cophenetic correlation calculation (`scipy.cluster.hierarchy.cophenet`), dendrogram tree construction and color thresholding (`scipy.cluster.hierarchy.dendrogram`), and flat cluster extraction (`scipy.cluster.hierarchy.fcluster`).
- **Title**: _SciPy API Reference — `scipy.spatial.distance.pdist` & `squareform`_
  - **Organization**: SciPy Community
  - **URL**: https://docs.scipy.org/doc/scipy/reference/spatial.distance.html
  - **Verified Information**: Formulas for metric computations (Euclidean, City Block/Manhattan, Minkowski, Cosine, Hamming), and conversion between condensed distance vectors of length $N(N-1)/2$ and $N \times N$ redundant square matrices.

### NumPy

- **Title**: _NumPy Reference Documentation_
  - **Organization**: NumPy Developers
  - **URL**: https://numpy.org/doc/stable/reference/
  - **Verified Information**: Vectorized broadcasting conventions for pairwise differences $(X[:, \text{None}, :] - X[\text{None}, :, :])$, triangular indexing `np.triu_indices`, and matrix update recurrences.

### R `cluster` Package (DIANA Implementation)

- **Title**: _R cluster Package Documentation — `diana` (Divisive Analysis Clustering)_
  - **Authors**: Martin Maechler, Peter Rousseeuw, Anja Struyf, Mia Hubert
  - **URL**: https://stat.ethz.ch/R-manual/R-devel/library/cluster/html/diana.html
  - **Verified Information**: Algorithm specification for DIANA: selection of cluster with maximum diameter $\max_{i, j \in C} d(i, j)$, initialization of the splinter group with the observation maximizing average dissimilarity to others in $C$, iterative reassignment criterion based on difference between average dissimilarity to remaining cluster and splinter group ($D_i - E_i > 0$), and calculation of the divisive coefficient (DC).
- **Title**: _R cluster Package Documentation — `diana.object`_
  - **Authors**: Martin Maechler, Peter Rousseeuw, Anja Struyf, Mia Hubert
  - **URL**: https://stat.ethz.ch/R-manual/R-devel/library/cluster/html/diana.object.html
  - **Verified Information**: Structure of the DIANA tree output, merge-order coding, and diameter tracking across successive splits.

---

## 2. Seminal Academic Papers & Monographs

### Ward's Minimum Variance Method

- **Title**: _Hierarchical Grouping to Optimize an Objective Function_
  - **Author**: Joe H. Ward, Jr.
  - **Journal**: _Journal of the American Statistical Association_, Vol. 58, No. 301 (1963), pp. 236–244.
  - **DOI/URL**: https://doi.org/10.1080/01621459.1963.10500845
  - **Verified Information**: Original objective function minimizing total within-cluster error sum of squares ($\text{ESS}$). Mathematical derivation of the increase in sum of squares $\Delta \text{ESS}_{A \cup B} = \frac{n_A n_B}{n_A + n_B} \|\mathbf{m}_A - \mathbf{m}_B\|^2$. Verified that Ward's distance in SciPy uses $\sqrt{2 \cdot \Delta \text{ESS}}$ or $\sqrt{\frac{2 n_A n_B}{n_A + n_B}} \|\mathbf{m}_A - \mathbf{m}_B\|$ to preserve Euclidean metric scale.

### The Lance-Williams Recurrence Formula

- **Title**: _A General Theory of Classificatory Sorting Strategies: 1. Hierarchical Systems_
  - **Authors**: G. N. Lance and W. T. Williams
  - **Journal**: _The Computer Journal_, Vol. 9, No. 4 (1967), pp. 373–380.
  - **DOI/URL**: https://doi.org/10.1093/comjnl/9.4.373
  - **Verified Information**: The generalized recurrence formula:
    $$D(A \cup B, C) = \alpha_A D(A, C) + \alpha_B D(B, C) + \beta D(A, B) + \gamma |D(A, C) - D(B, C)|$$
    Exact parameter values verified for Single Linkage ($\alpha_A=1/2, \alpha_B=1/2, \beta=0, \gamma=-1/2$), Complete Linkage ($\alpha_A=1/2, \alpha_B=1/2, \beta=0, \gamma=1/2$), Average Linkage / UPGMA ($\alpha_A=\frac{n_A}{n_A+n_B}, \alpha_B=\frac{n_B}{n_A+n_B}, \beta=0, \gamma=0$), Centroid Linkage / UPGMC ($\alpha_A=\frac{n_A}{n_A+n_B}, \alpha_B=\frac{n_B}{n_A+n_B}, \beta=-\frac{n_A n_B}{(n_A+n_B)^2}, \gamma=0$), and Ward's method.

### Divisive Analysis (DIANA) & Silhouette Coefficient

- **Title**: _Finding Groups in Data: An Introduction to Cluster Analysis_
  - **Authors**: Leonard Kaufman and Peter J. Rousseeuw
  - **Publisher**: John Wiley & Sons, Inc., Hoboken, NJ (1990).
  - **DOI/URL**: https://doi.org/10.1002/9780470316801
  - **Verified Information**: Chapter 6: Divisive Analysis (DIANA) algorithm mechanics, splinter group initialization using maximum average dissimilarity, iterative observation reassignment until condition $\max (D_i - E_i) \le 0$, and divisive coefficient. Chapter 2: Silhouette width formula $s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$.

### Silhouette Validation

- **Title**: _Silhouettes: A Graphical Aid to the Interpretation and Validation of Cluster Analysis_
  - **Author**: Peter J. Rousseeuw
  - **Journal**: _Journal of Computational and Applied Mathematics_, Vol. 20 (1987), pp. 53–65.
  - **DOI/URL**: https://doi.org/10.1016/0377-0427(87)90125-7
  - **Verified Information**: Bounds $s(i) \in [-1, 1]$, interpretation rules (strong $>0.7$, reasonable $0.51-0.70$, weak $0.26-0.50$, artificial $<0.25$), and handling of singleton clusters ($s(i)=0$).

### Davies-Bouldin Index

- **Title**: _A Cluster Separation Measure_
  - **Authors**: David L. Davies and Donald W. Bouldin
  - **Journal**: _IEEE Transactions on Pattern Analysis and Machine Intelligence_, Vol. PAMI-1, No. 2 (1979), pp. 224–227.
  - **DOI/URL**: https://doi.org/10.1109/TPAMI.1979.4766909
  - **Verified Information**: Ratio of intra-cluster scatter to inter-cluster separation $R_{ij} = \frac{s_i + s_j}{M_{ij}}$, maximum similarity selection $R_i = \max_{j \ne i} R_{ij}$, and total index $DB = \frac{1}{k} \sum_{i=1}^k R_i$.

### Cophenetic Correlation Coefficient

- **Title**: _The Comparison of Dendrograms by Objective Methods_
  - **Authors**: Robert R. Sokal and F. James Rohlf
  - **Journal**: _Taxon_, Vol. 11, No. 2 (1962), pp. 33–40.
  - **DOI/URL**: https://doi.org/10.2307/1217208
  - **Verified Information**: Cophenetic distance definition as the threshold height at which two observations are first merged into the same cluster. Pearson correlation formula between original dissimilarity vector $Y$ and cophenetic distance vector $Z$.

### Modern Algorithmic Survey & Complexity

- **Title**: _Algorithms for Hierarchical Clustering: An Overview_
  - **Authors**: Fionn Murtagh and Pedro Contreras
  - **Journal**: _WIREs Data Mining and Knowledge Discovery_, Vol. 2, No. 1 (2012), pp. 86–97.
  - **DOI/URL**: https://doi.org/10.1002/widm.53
  - **Verified Information**: Time and space complexity bounds: Naive agglomeration $O(N^3)$, nearest-neighbor chain algorithm (NN-chain) achieving $O(N^2)$ for reducible linkages (Ward, Single, Complete), space complexity $O(N^2)$ or $O(N)$ with on-the-fly metric computation.

### Monotonicity & Ultrametric Hierarchy Conditions

- **Title**: _Note on Ultrametric Hierarchical Clustering Algorithms_
  - **Author**: Vladimir Batagelj
  - **Journal**: _Psychometrika_, Vol. 46, No. 3 (1981), pp. 351–352.
  - **DOI/URL**: https://doi.org/10.1007/BF02293735
  - **Verified Information**: Necessary and sufficient Lance–Williams conditions for strict monotonicity ($h_1 \le h_2 \le \dots \le h_{N-1}$): $\alpha_A + \alpha_B + \beta \ge 1$, $\min(\alpha_A, \alpha_B) \ge \gamma$, $\gamma \ge -\min(\alpha_A, \alpha_B)$, and $\beta \ge 0$. Proves why Centroid Linkage produces dendrogram inversions due to $\beta < 0$.

### High-Dimensional Distance Concentration & The Curse of Dimensionality

- **Title**: _When Is "Nearest Neighbor" Meaningful?_
  - **Authors**: Kevin Beyer, Jonathan Goldstein, Raghu Ramakrishnan, and Uri Shaft
  - **Conference**: _International Conference on Database Theory (ICDT)_, 1999, LNCS 1540, pp. 217–235.
  - **DOI/URL**: https://doi.org/10.1007/3-540-49257-7_15
  - **Verified Information**: Distance concentration theorem $\lim_{d \to \infty} \frac{D_{\max} - D_{\min}}{D_{\min}} = 0$. Proves why pairwise distance contrast vanishes in high dimensions, causing distance-based clustering algorithms to degrade.
- **Title**: _On the Surprising Behavior of Distance Metrics in High Dimensional Space_
  - **Authors**: Charu C. Aggarwal, Alexander Hinneburg, and Daniel A. Keim
  - **Conference**: _International Conference on Database Theory (ICDT)_, 2001, pp. 420–434.
  - **DOI/URL**: https://doi.org/10.1007/3-540-44503-X_27
  - **Verified Information**: Analysis of $L_p$ norms in high-dimensional spaces showing that lower values of $p$ ($p=1$ or fractional $p < 1$) preserve relative contrast significantly better than $L_2$ Euclidean distance.

### Optimal Leaf Ordering for Dendrograms

- **Title**: _Fast Optimal Leaf Ordering for Hierarchical Clustering_
  - **Authors**: Ziv Bar-Joseph, David K. Gifford, and Tommi S. Jaakkola
  - **Journal**: _Bioinformatics_, Vol. 17, Suppl. 1 (2001), pp. S22–S29.
  - **DOI/URL**: https://doi.org/10.1093/bioinformatics/17.suppl_1.S22
  - **Verified Information**: Formulation and dynamic programming solution for the optimal leaf ordering (OLO) problem, minimizing adjacent leaf distances among the $2^{N-1}$ valid branch rotations without altering dendrogram topology.

### Mahalanobis Distance & Statistical Covariance

- **Title**: _On the Generalized Distance in Statistics_
  - **Author**: Prasanta Chandra Mahalanobis
  - **Journal**: _Proceedings of the National Institute of Sciences of India_, Vol. 2, No. 1 (1936), pp. 49–55.
  - **Verified Information**: Formulation of covariance-standardized distance $d_M(\mathbf{x}, \mathbf{y}) = \sqrt{(\mathbf{x} - \mathbf{y})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x} - \mathbf{y})}$ and ellipsoidal isodistance contours.

### Nearest-Neighbor Chain & Optimized Implementations

- **Title**: _Cluster Analysis for Applications_
  - **Author**: Michael R. Anderberg
  - **Publisher**: Academic Press, New York (1973).
  - **Verified Information**: Nearest-neighbor chain algorithm (NN-chain) and mutual nearest neighbor properties, establishing $O(N^2)$ optimal clustering for reducible linkage criteria.
- **Title**: _fastcluster: Fast Hierarchical, Agglomerative Clustering Routines for R and Python_
  - **Author**: Daniel Müllner
  - **Journal**: _Journal of Statistical Software_, Vol. 53, No. 9 (2013), pp. 1–18.
  - **DOI/URL**: https://doi.org/10.18637/jss.v053.i09
  - **Verified Information**: Algorithmic complexity bounds, memory-efficient index tracking, and vectorization architectures underlying modern SciPy `scipy.cluster.hierarchy` and C/C++ clustering extensions.

---

## 3. Module-to-Source Mapping

| Module                           | Core Concepts Verified                                                                                                             | Primary & Academic References                                                     |
| :------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **01. Introduction**             | Supervised vs. Unsupervised, Hierarchical vs. Flat, Nested Partitions                                                              | Kaufman & Rousseeuw (1990), Scikit-learn User Guide                               |
| **02. Fundamentals**             | Observation-level vs Cluster-level distance, Proximity Matrix, Trees                                                               | Murtagh & Contreras (2012), Sokal & Rohlf (1962)                                  |
| **03. Types**                    | Bottom-up (Agglomerative) vs Top-down (Divisive), DIANA Splintering                                                                | Kaufman & Rousseeuw (1990 Ch. 6), Lance & Williams (1967)                         |
| **04. Agglomerative**            | Merge sequence, Proximity matrix updates, Tie-breaking, Termination                                                                | Murtagh & Contreras (2012), SciPy Hierarchy docs                                  |
| **05. Divisive**                 | DIANA algorithm, Splinter group, Max diameter heuristic, Partition cost                                                            | Kaufman & Rousseeuw (1990), Murtagh & Contreras (2012)                            |
| **06. Linkage Methods**          | Single, Complete, Average (UPGMA), Centroid (UPGMC), Ward's Min Variance                                                           | Ward (1963), Lance & Williams (1967), SciPy `linkage`                             |
| **07. Distance Metrics**         | Euclidean, Manhattan, Minkowski, Cosine, Metric Axioms, Normalization                                                              | SciPy `pdist`, Scikit-learn Preprocessing Guide                                   |
| **08. Dendrograms**              | Topology, Cophenetic heights, Inversion anomalies, Cutting thresholds                                                              | Sokal & Rohlf (1962), SciPy `dendrogram`, Bar-Joseph et al. (2001)                |
| **09. Mathematics**              | Matrix data $\mathbf{X} \in \mathbb{R}^{n \times d}$, Metric axioms, WSS variance expansion, Huygens theorem, Ward harmonic factor | Ward (1963), Lance & Williams (1967), Batagelj (1981), Murtagh & Contreras (2012) |
| **10. Practical Implementation** | NumPy scratch broadcasting, SciPy `pdist`/`linkage`/`fcluster`, Scikit-Learn `AgglomerativeClustering`, k-NN connectivity graphs   | NumPy Reference, SciPy Docs, Scikit-learn API, Müllner (2013), Anderberg (1973)   |
| **11. Model Evaluation**         | Silhouette Score, Davies-Bouldin Index, Cophenetic Correlation                                                                     | Rousseeuw (1987), Davies & Bouldin (1979), Sokal & Rohlf (1962)                   |
| **12. Algorithm Comparison**     | K-Means, DBSCAN, Agglomerative trade-offs, Non-globular shapes                                                                     | Scikit-learn User Guide, Murtagh & Contreras (2012)                               |
| **13. Limitations**              | $O(N^2)$ space, $O(N^3)$ time, Greedy irreversibility, Chaining                                                                    | Murtagh & Contreras (2012), Kaufman & Rousseeuw (1990)                            |
| **14. Real-world Applications**  | Customer RFM hierarchies, Gene Phylogeny, Taxonomy Clustering                                                                      | Scikit-learn Applications, Kaufman & Rousseeuw (1990)                             |
| **15. Hands-on Projects**        | End-to-end Python pipeline, Validation against SciPy, Evaluation metrics                                                           | SciPy, Scikit-learn, NumPy official guides                                        |
| **13. Limitations**              | $O(N^2)$ space, $O(N^3)$ time, Greedy irreversibility, Chaining                                                                    | Murtagh & Contreras (2012), Kaufman & Rousseeuw (1990)                            |
| **14. Real-world Applications**  | Customer RFM hierarchies, Gene Phylogeny, Taxonomy Clustering                                                                      | Scikit-learn Applications, Kaufman & Rousseeuw (1990)                             |
| **15. Hands-on Projects**        | End-to-end Python pipeline, Validation against SciPy, Evaluation metrics                                                           | SciPy, Scikit-learn, NumPy official guides                                        |
