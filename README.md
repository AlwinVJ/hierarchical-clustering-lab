<div align="center">

# Hierarchical Clustering Lab

### An Interactive Learning Platform for Understanding Hierarchical Clustering

Explore the mathematics, algorithms, visualizations, and practical implementations behind Hierarchical Clustering through a structured, hands-on learning experience.

<br/>

![Status](https://img.shields.io/badge/Status-Complete-22c55e?style=for-the-badge)
![Machine Learning](https://img.shields.io/badge/Domain-Machine%20Learning-5125D2?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-8D85FF?style=for-the-badge)
![Tests](https://img.shields.io/badge/Tests-64%20Passing-14b8a6?style=for-the-badge)

<br/>

**Understand the mathematics. Visualize the algorithms. Implement them from scratch.**

</div>

---

## About the Project

**Hierarchical Clustering Lab** is an educational platform designed to provide a comprehensive understanding of Hierarchical Clustering, one of the fundamental unsupervised machine learning algorithms.

Rather than focusing solely on theoretical explanations, this platform bridges the gap between mathematical foundations and practical implementation through structured lessons, numerical examples, interactive visualizations, and hands-on Python projects.

The learning experience progresses from fundamental clustering concepts to advanced algorithmic mechanisms, helping learners understand not just how hierarchical clustering works, but also why particular clustering decisions are made.

## Learning Roadmap

The platform is organized into 15 complete learning modules plus an interactive curriculum overview.

|  #  | Module                              | Topics Covered & Interactive Workspaces                                 |
| :-: | ----------------------------------- | ----------------------------------------------------------------------- |
| 01  | Introduction                        | Unsupervised taxonomy, flat vs nested partitions, 6-question quiz       |
| 02  | Fundamentals                        | Spatial feature space, distance matrices, linkage criteria, anatomy     |
| 03  | Types of Hierarchical Clustering    | Agglomerative vs Divisive, DIANA heuristics, Paradigm Visualizer        |
| 04  | Agglomerative Clustering            | 8-stage merge algorithm, distance matrix updates, interactive simulator |
| 05  | Divisive Clustering                 | Top-down splintering, maximum diameter heuristic, DIANA Simulator       |
| 06  | Linkage Methods                     | Single, Complete, Average, Centroid, Ward, Lance–Williams Explorer      |
| 07  | Distance Metrics                    | Euclidean, Manhattan, Minkowski, Cosine, Mahalanobis, Curse of Dim.     |
| 08  | Dendrograms                         | Tree topology, cophenetic distance, ultrametricity, Dendrogram Explorer |
| 09  | Mathematical Foundations            | Metric axioms, WSS expansion, Huygens theorem, Mathematical Playground  |
| 10  | Practical Implementation            | Pure NumPy scratch engine, SciPy `linkage`, Scikit-learn API            |
| 11  | Model Evaluation & Validation       | Silhouette, Davies–Bouldin, Calinski–Harabasz, ARI, Evaluation Lab      |
| 12  | Optimal Cluster Selection (Cutting) | Height cut ($t$), maxclust ($k$), inconsistency sweep, Cutting Lab      |
| 13  | Cluster Profiling & Stability       | Median vs mean profiling, radar charts, bootstrap resampling (ARI)      |
| 14  | Real-World Applications & Showdown  | 15-stage RFM pipeline, Algorithm Showdown (HAC vs K-Means vs DBSCAN)    |
| 15  | Hands-on Capstone Projects          | 4 verified production blueprints, starter templates, verified solutions |

## Key Learning Features

### 1. Structured Theoretical Learning & Zero-Placeholder Quality

- Beginner-friendly explanations of complex concepts with rigorous mathematical grounding.
- Step-by-step algorithmic breakdowns and recurrence derivations.
- Mathematical foundations: Lance–Williams recurrence, Huygens theorem, ultrametric spaces.
- Comprehensive self-assessment quizzes across all core modules.

### 2. Interactive SVG Visualizations & Simulators

Every interactive workspace is hand-crafted as pure inline SVG in React:

- **Agglomerative Merge Simulator**: Step-by-step bottom-up cluster coalescing with live matrix updates.
- **DIANA Divisive Simulator**: Splinter group formation and diameter tracking.
- **Lance–Williams Recurrence Explorer**: Dynamic parameter matrix updates.
- **Interactive Dendrogram Workspace**: Live horizontal cutting threshold slider and cophenetic matrix inspection.
- **Metric Space & Curse of Dimensionality Simulators**: Contrast ratio decay across dimensions.
- **Algorithm Showdown Benchmark**: Real-time TypeScript clustering comparison (Single, Ward, K-Means, DBSCAN).
- **Cluster Profiling & Stability Workspace**: Radar profiles, boxplots, and bootstrap stability curves.

### 3. Practical Python Implementations

Explore hierarchical clustering through three verified implementation approaches:

| Implementation     | Description                                                                  |
| ------------------ | ---------------------------------------------------------------------------- |
| NumPy from Scratch | Pure vectorized distance matrix and Lance–Williams $O(1)$ matrix update loop |
| SciPy              | Fast linkage matrix generation, cophenetic correlation, and dendrograms      |
| Scikit-learn       | Production pipelines, sparse k-NN connectivity graphs, and metric evaluation |

### 4. Capstone Projects (Module 15)

Four production-grade capstone blueprints verified against Python 3.12, SciPy 1.14, and Scikit-learn 1.5:

1. **Customer Behavioral Hierarchy & RFM Segmentation**: End-to-end retail pipeline with log1p stabilization, Ward clustering, Silhouette validation ($S=0.4598$), and commercial persona profiling.
2. **Linkage Method Shoot-Out on Geometric Manifolds**: Multi-manifold benchmark across Blobs, Moons, Concentric Circles, and Iris, evaluating ARI, Silhouette, and Cophenetic correlation (CCC).
3. **Pure NumPy Agglomerative Engine**: Complete from-scratch clustering engine implementing the Lance–Williams recurrence, achieving machine-precision parity with SciPy ($\Delta < 10^{-12}$).
4. **Document Topic Taxonomy via TF-IDF & Ward**: Natural language taxonomy extraction on $L_2$-normalized text vectors with centroid keyword salience ranking.

## Technology Stack

The project uses the following technologies:

| Technology   | Purpose                                                |
| ------------ | ------------------------------------------------------ |
| React        | Frontend development                                   |
| TypeScript   | Type safety                                            |
| Vite         | Development and build tooling                          |
| Tailwind CSS | Styling and responsive layouts                         |
| Lucide       | Interface icons                                        |
| NumPy        | Numerical computations and from-scratch implementation |
| SciPy        | Hierarchical clustering and dendrograms                |
| Scikit-learn | Machine learning implementation and evaluation         |

_The Python libraries are used in the educational implementation examples; the website itself is designed as a static frontend application._

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js (LTS recommended)
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/AlwinVJ/Hierarchical-Clustering-Lab.git
```

### 2. Navigate to the Project Directory

```bash
cd Hierarchical-Clustering-Lab
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at the local development URL displayed in your terminal.

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

> Note: Replace the repository URL and directory name above if the actual GitHub repository uses a different name.

## Deployment

The project is intended to be hosted using **GitHub Pages**.

Deployment is configured through GitHub Actions, allowing the application to be built and published as a static website.

The deployment configuration must account for the repository-specific base path so that assets and internal navigation work correctly.

## Learning Resources

The educational content prioritizes authoritative technical documentation and academic references.

| Resource                                                                                           | Description                                             |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [Scikit-learn Documentation](https://scikit-learn.org/stable/modules/clustering.html)              | Clustering algorithms and implementation                |
| [SciPy Hierarchical Clustering](https://docs.scipy.org/doc/scipy/reference/cluster.hierarchy.html) | Linkage algorithms and dendrograms                      |
| [SciPy Distance Functions](https://docs.scipy.org/doc/scipy/reference/spatial.distance.html)       | Distance metrics and dissimilarity calculations         |
| [NumPy Documentation](https://numpy.org/doc/stable/)                                               | Numerical computing                                     |
| [Ward (1963)](https://doi.org/10.1080/01621459.1963.10500845)                                      | Hierarchical grouping to optimize an objective function |

## Project Goals

The primary objectives of this project are:

- Build a strong conceptual understanding of hierarchical clustering.
- Connect mathematical theory with practical implementations.
- Understand the differences between hierarchical clustering approaches and linkage methods.
- Develop interactive visual learning tools.
- Implement clustering algorithms from scratch.
- Explore real-world applications through end-to-end projects.

## Contributing

Suggestions, corrections, and improvements are welcome.

If you identify an issue or have an idea that could improve the learning experience:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request with a clear description.

Contributions that improve technical accuracy, mathematical explanations, code implementations, and learning visualizations are particularly valuable.

## License

This project is distributed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Learn the Structure Behind the Data.

**Hierarchical Clustering Lab**

Built with a focus on mathematical understanding, practical experimentation, and interactive learning.

<br/>

`Machine Learning` · `Unsupervised Learning` · `Hierarchical Clustering`

</div>
