<div align="center">

# Hierarchical Clustering Lab

### An Interactive Learning Platform for Understanding Hierarchical Clustering

Explore the mathematics, algorithms, visualizations, and practical implementations behind Hierarchical Clustering through a structured, hands-on learning experience.

<br/>

![Status](https://img.shields.io/badge/Status-Complete-22c55e?style=for-the-badge)
![Machine Learning](https://img.shields.io/badge/Domain-Machine%20Learning-5125D2?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-8D85FF?style=for-the-badge)
![Tests](https://img.shields.io/badge/Tests-66%20Passing-14b8a6?style=for-the-badge)

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
| 07  | Distance Metrics                    | Euclidean, Minkowski, Gower (mixed data), Jaccard, Curse of Dim.        |
| 08  | Dendrograms                         | Tree topology, cophenetic distance, Tanglegrams, Baker's Gamma index    |
| 09  | Mathematical Foundations            | Metric axioms, WSS expansion, Huygens theorem, Mathematical Playground  |
| 10  | Practical Implementation            | Pure NumPy scratch engine, SciPy `linkage`, Scikit-learn API            |
| 11  | Model Evaluation & Validation       | Silhouette, Davies–Bouldin, Calinski–Harabasz, ARI, Evaluation Lab      |
| 12  | Optimal Cluster Selection (Cutting) | Height cut ($t$), maxclust ($k$), Gap Statistic (1-SE), Inconsistency   |
| 13  | Cluster Profiling & Stability       | Median vs mean profiling, radar charts, bootstrap resampling (ARI)      |
| 14  | Real-World Applications & Showdown  | 15-stage RFM, Showdown, Large-Scale 2-Stage Hybrid Clustering           |
| 15  | Hands-on Capstone Projects          | 4 verified blueprints, 32-abstract NLP corpus, UCI retail stretch goals |

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

1. **Customer Behavioral Hierarchy & RFM Segmentation**: End-to-end retail pipeline with log1p stabilization, Ward clustering, Silhouette validation ($S=0.4598$), and commercial persona profiling. Includes UCI Online Retail stretch goal.
2. **Linkage Method Shoot-Out on Geometric Manifolds**: Multi-manifold benchmark across Blobs, Moons, Concentric Circles, and Iris, evaluating ARI, Silhouette, and Cophenetic correlation (CCC).
3. **Pure NumPy Agglomerative Engine**: Complete from-scratch clustering engine implementing the Lance–Williams recurrence, achieving machine-precision parity with SciPy ($\Delta < 10^{-12}$).
4. **Document Topic Taxonomy via TF-IDF & Ward**: Natural language taxonomy extraction across a realistic 32-abstract multi-domain corpus (Graphics, AI/ML, Space, Genomics) with centroid keyword salience ranking. Includes 20 Newsgroups stretch goal.

## Automated Verification & Testing

Every algorithm, derivation, and code snippet in this platform is continuously tested and verified:

```bash
# 1. Verify all 24 Python code snippets against Python 3.12, SciPy, and Scikit-learn
npm run verify:python

# 2. Run the Vitest unit test suite (66 assertions across routing, components, and math)
npm test

# 3. Perform TypeScript strict typecheck (zero unchecked index or property access errors)
npx tsc --noEmit

# 4. Production build check
npm run build
```

Additionally, automated headless Chrome audits verify that:
- Desktop viewports (1366px) have **0 horizontal scrollbars** under math formulas and interactive code panes.
- Mobile viewports (375px) have **0 sideways scrolling/overflow** across all 16 routes.

## Technology Stack

The project uses modern frontend and machine learning engineering tooling:

| Technology     | Purpose                                                    |
| -------------- | ---------------------------------------------------------- |
| React 19       | Modern UI framework with concurrent rendering              |
| TanStack Start | Routing architecture, pre-rendering, and client SPA shell  |
| TypeScript     | Strict static typing with zero unchecked property access   |
| Tailwind CSS v4| Modern utility-first CSS design and themes                 |
| KaTeX          | Fast mathematical typography and formula rendering         |
| Lucide React   | Accessible interface iconography                           |
| Vitest         | Fast unit and integration test suite                       |
| NumPy          | Vectorized computation and scratch matrix recurrence       |
| SciPy          | Hierarchical linkage, dendrograms, and cophenetic analysis |
| Scikit-learn   | Cluster validation metrics, pipelines, and manifolds       |

_The Python libraries are used in the educational implementation examples and verification suites; the website itself is built and deployed as a 100% static frontend application._

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or v20+ recommended)
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/AlwinVJ/hierarchical-clustering-lab.git
```

### 2. Navigate to the Project Directory

```bash
cd hierarchical-clustering-lab
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the local development port displayed in your terminal).

### 5. Build for Production

```bash
npm run build
```

The production-ready static website is generated in `dist/client/`. It includes:
- `index.html`: Fully pre-rendered overview page and application shell.
- `404.html`: Single-page app routing fallback for deep link navigation.
- `.nojekyll`: Disables Jekyll processing on GitHub Pages to ensure all asset paths and underscores are preserved.
- Pre-generated route subdirectories (`dist/client/<slug>/index.html`) for direct deep link access.

## Deployment to GitHub Pages

The project is configured for continuous, automated deployment to **GitHub Pages** using **GitHub Actions**.

### Live Deployment URL
**`https://alwinvj.github.io/hierarchical-clustering-lab/`**

### Repository Base Path
The production build automatically prefixes all static assets, stylesheets, scripts, and internal router links with `/hierarchical-clustering-lab/` via the configured Vite base path.

### Enabling GitHub Pages Deployment
To deploy automatically via GitHub Actions:
1. Open the repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push to the `main` branch or trigger the workflow manually via the **Actions** tab (`Deploy to GitHub Pages` > **Run workflow**).
5. GitHub Actions will run tests, build the static application, and publish to GitHub Pages.

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
