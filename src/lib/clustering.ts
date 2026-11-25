/**
 * Pure TypeScript implementations of classic clustering algorithms and synthetic datasets:
 * - K-Means with K-Means++ initialization
 * - DBSCAN with density connectivity
 * - Agglomerative Single Linkage
 * - Agglomerative Ward Linkage
 * - Synthetic 2D Datasets (Two Moons, Anisotropic Blobs, Gaussian Mixtures)
 * - Evaluation Metrics (Adjusted Rand Index, Silhouette Score)
 */

export type Point2D = [number, number];

export function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export function squaredEuclidean(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    sum += diff * diff;
  }
  return sum;
}

/**
 * Deterministic pseudo-random number generator (Mulberry32)
 */
export function createRNG(seed = 42) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// 1. K-Means (K-Means++ & Lloyd's iteration)
// ---------------------------------------------------------------------------
export interface KMeansResult {
  labels: number[];
  centroids: number[][];
  iterations: number;
}

export function kMeans(
  points: number[][],
  k: number,
  maxIterations = 50,
  seed = 42
): KMeansResult {
  const n = points.length;
  if (n === 0 || k <= 0) return { labels: [], centroids: [], iterations: 0 };
  if (k >= n) {
    return {
      labels: points.map((_, i) => i),
      centroids: points.map((p) => [...p]),
      iterations: 0,
    };
  }

  const dim = points[0]?.length ?? 2;
  const rng = createRNG(seed);

  // K-Means++ initialization
  const centroids: number[][] = [];
  const firstIdx = Math.floor(rng() * n);
  const firstPoint = points[firstIdx];
  if (!firstPoint) return { labels: [], centroids: [], iterations: 0 };
  centroids.push([...firstPoint]);

  const minDistances = new Array<number>(n).fill(Infinity);

  while (centroids.length < k) {
    const lastCentroid = centroids[centroids.length - 1]!;
    let sumDistSq = 0;

    for (let i = 0; i < n; i++) {
      const dSq = squaredEuclidean(points[i]!, lastCentroid);
      minDistances[i] = Math.min(minDistances[i]!, dSq);
      sumDistSq += minDistances[i]!;
    }

    const target = rng() * sumDistSq;
    let running = 0;
    let chosenIdx = 0;
    for (let i = 0; i < n; i++) {
      running += minDistances[i]!;
      if (running >= target) {
        chosenIdx = i;
        break;
      }
    }
    centroids.push([...points[chosenIdx]!]);
  }

  // Lloyd's iteration
  const labels = new Array<number>(n).fill(0);
  let iter = 0;

  for (; iter < maxIterations; iter++) {
    let changed = false;

    // 1. Assignment step
    for (let i = 0; i < n; i++) {
      let bestDist = Infinity;
      let bestCluster = 0;
      for (let c = 0; c < k; c++) {
        const d = squaredEuclidean(points[i]!, centroids[c]!);
        if (d < bestDist) {
          bestDist = d;
          bestCluster = c;
        }
      }
      if (labels[i] !== bestCluster) {
        labels[i] = bestCluster;
        changed = true;
      }
    }

    if (!changed && iter > 0) break;

    // 2. Update step
    const counts = new Array<number>(k).fill(0);
    const newCentroids = Array.from({ length: k }, () => new Array<number>(dim).fill(0));

    for (let i = 0; i < n; i++) {
      const c = labels[i]!;
      counts[c]!++;
      for (let d = 0; d < dim; d++) {
        newCentroids[c]![d]! += points[i]![d]!;
      }
    }

    for (let c = 0; c < k; c++) {
      if (counts[c]! > 0) {
        for (let d = 0; d < dim; d++) {
          centroids[c]![d] = newCentroids[c]![d]! / counts[c]!;
        }
      }
    }
  }

  return { labels, centroids, iterations: iter };
}

// ---------------------------------------------------------------------------
// 2. DBSCAN
// ---------------------------------------------------------------------------
export interface DBSCANResult {
  labels: number[]; // -1 indicates noise
  coreIndices: Set<number>;
  clusterCount: number;
  noiseCount: number;
}

export function dbscan(
  points: number[][],
  eps: number,
  minPts: number
): DBSCANResult {
  const n = points.length;
  const labels = new Array<number>(n).fill(0); // 0 = unvisited
  const coreIndices = new Set<number>();
  let clusterId = 0;

  // Precompute neighborhood query
  function regionQuery(pIdx: number): number[] {
    const neighbors: number[] = [];
    const p = points[pIdx]!;
    for (let i = 0; i < n; i++) {
      if (euclideanDistance(p, points[i]!) <= eps) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }

  const visited = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    visited[i] = 1;

    const neighbors = regionQuery(i);
    if (neighbors.length < minPts) {
      labels[i] = -1; // Noise temporarily (might become border point)
    } else {
      coreIndices.add(i);
      clusterId++;
      labels[i] = clusterId;

      const queue = [...neighbors];
      for (let qi = 0; qi < queue.length; qi++) {
        const qIdx = queue[qi]!;
        if (!visited[qIdx]) {
          visited[qIdx] = 1;
          const qNeighbors = regionQuery(qIdx);
          if (qNeighbors.length >= minPts) {
            coreIndices.add(qIdx);
            for (const neighbor of qNeighbors) {
              if (!queue.includes(neighbor)) {
                queue.push(neighbor);
              }
            }
          }
        }
        if (labels[qIdx] === 0 || labels[qIdx] === -1) {
          labels[qIdx] = clusterId;
        }
      }
    }
  }

  // Convert to 0-indexed clusters (noise remains -1)
  let noiseCount = 0;
  for (let i = 0; i < n; i++) {
    if (labels[i] === -1) {
      noiseCount++;
    } else if (labels[i]! > 0) {
      labels[i] = labels[i]! - 1;
    }
  }

  return { labels, coreIndices, clusterCount: clusterId, noiseCount };
}

// ---------------------------------------------------------------------------
// 3. Single Linkage (Agglomerative)
// ---------------------------------------------------------------------------
export interface LinkageResult {
  labels: number[];
  clusters: number[][];
}

export function singleLinkage(points: number[][], k: number): LinkageResult {
  const n = points.length;
  if (n === 0) return { labels: [], clusters: [] };
  if (k >= n) {
    return {
      labels: points.map((_, i) => i),
      clusters: points.map((_, i) => [i]),
    };
  }

  // Initial clusters: each point in its own cluster
  let clusters: number[][] = Array.from({ length: n }, (_, i) => [i]);

  // Merge until k clusters remain
  while (clusters.length > k) {
    let minDist = Infinity;
    let mergeA = 0;
    let mergeB = 1;

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const cA = clusters[i]!;
        const cB = clusters[j]!;
        // Single linkage: min distance between any point in cA and any point in cB
        let pairMin = Infinity;
        for (const pA of cA) {
          for (const pB of cB) {
            const d = euclideanDistance(points[pA]!, points[pB]!);
            if (d < pairMin) pairMin = d;
          }
        }
        if (pairMin < minDist) {
          minDist = pairMin;
          mergeA = i;
          mergeB = j;
        }
      }
    }

    // Merge clusters mergeA and mergeB
    const newCluster = [...clusters[mergeA]!, ...clusters[mergeB]!];
    clusters = clusters.filter((_, idx) => idx !== mergeA && idx !== mergeB);
    clusters.push(newCluster);
  }

  // Assign label 0 to k-1
  const labels = new Array<number>(n).fill(0);
  for (let cIdx = 0; cIdx < clusters.length; cIdx++) {
    for (const pIdx of clusters[cIdx]!) {
      labels[pIdx] = cIdx;
    }
  }

  return { labels, clusters };
}

// ---------------------------------------------------------------------------
// 4. Ward Linkage (Agglomerative Minimum Variance)
// ---------------------------------------------------------------------------
export function wardLinkage(points: number[][], k: number): LinkageResult {
  const n = points.length;
  if (n === 0) return { labels: [], clusters: [] };
  if (k >= n) {
    return {
      labels: points.map((_, i) => i),
      clusters: points.map((_, i) => [i]),
    };
  }

  const dim = points[0]?.length ?? 2;

  // Helper to compute cluster centroid
  function getCentroid(members: number[]): number[] {
    const c = new Array<number>(dim).fill(0);
    for (const m of members) {
      for (let d = 0; d < dim; d++) {
        c[d]! += points[m]![d]!;
      }
    }
    for (let d = 0; d < dim; d++) {
      c[d] = c[d]! / members.length;
    }
    return c;
  }

  let clusters: number[][] = Array.from({ length: n }, (_, i) => [i]);

  while (clusters.length > k) {
    let minDeltaWSS = Infinity;
    let mergeA = 0;
    let mergeB = 1;

    for (let i = 0; i < clusters.length; i++) {
      const cA = clusters[i]!;
      const nA = cA.length;
      const centA = getCentroid(cA);

      for (let j = i + 1; j < clusters.length; j++) {
        const cB = clusters[j]!;
        const nB = cB.length;
        const centB = getCentroid(cB);

        // Delta WSS = (nA * nB) / (nA + nB) * ||centA - centB||^2
        const factor = (nA * nB) / (nA + nB);
        const distSq = squaredEuclidean(centA, centB);
        const delta = factor * distSq;

        if (delta < minDeltaWSS) {
          minDeltaWSS = delta;
          mergeA = i;
          mergeB = j;
        }
      }
    }

    const newCluster = [...clusters[mergeA]!, ...clusters[mergeB]!];
    clusters = clusters.filter((_, idx) => idx !== mergeA && idx !== mergeB);
    clusters.push(newCluster);
  }

  const labels = new Array<number>(n).fill(0);
  for (let cIdx = 0; cIdx < clusters.length; cIdx++) {
    for (const pIdx of clusters[cIdx]!) {
      labels[pIdx] = cIdx;
    }
  }

  return { labels, clusters };
}

// ---------------------------------------------------------------------------
// 5. Synthetic Datasets
// ---------------------------------------------------------------------------
export interface SyntheticDataset {
  name: string;
  description: string;
  points: Point2D[];
  groundTruth: number[];
  recommendedK: number;
  recommendedEps: number;
}

export function generateTwoMoons(n = 160, noise = 0.08, seed = 42): SyntheticDataset {
  const rng = createRNG(seed);
  const nPerMoon = Math.floor(n / 2);
  const points: Point2D[] = [];
  const groundTruth: number[] = [];

  // Top moon (upper crescent)
  for (let i = 0; i < nPerMoon; i++) {
    const theta = (Math.PI * i) / (nPerMoon - 1);
    const x = Math.cos(theta) + (rng() - 0.5) * noise * 2;
    const y = Math.sin(theta) + (rng() - 0.5) * noise * 2;
    points.push([x, y]);
    groundTruth.push(0);
  }

  // Bottom moon (lower crescent shifted)
  for (let i = 0; i < nPerMoon; i++) {
    const theta = (Math.PI * i) / (nPerMoon - 1);
    const x = 1 - Math.cos(theta) + (rng() - 0.5) * noise * 2;
    const y = 1 - Math.sin(theta) - 0.5 + (rng() - 0.5) * noise * 2;
    points.push([x, y]);
    groundTruth.push(1);
  }

  return {
    name: "Two Interleaving Moons",
    description: "Non-convex manifold structure where density connectivity succeeds but centroid Euclidean cuts fail.",
    points,
    groundTruth,
    recommendedK: 2,
    recommendedEps: 0.35,
  };
}

export function generateAnisotropicBlobs(n = 150, seed = 42): SyntheticDataset {
  const rng = createRNG(seed);
  const points: Point2D[] = [];
  const groundTruth: number[] = [];
  const nPerCluster = Math.floor(n / 3);

  // Cluster 0: Elongated cluster at angle
  for (let i = 0; i < nPerCluster; i++) {
    const t = (rng() - 0.5) * 3.0;
    const x = t * 1.5 + (rng() - 0.5) * 0.35;
    const y = t * 0.7 + (rng() - 0.5) * 0.35;
    points.push([x - 2.0, y - 1.0]);
    groundTruth.push(0);
  }

  // Cluster 1: Parallel elongated cluster
  for (let i = 0; i < nPerCluster; i++) {
    const t = (rng() - 0.5) * 3.0;
    const x = t * 1.5 + (rng() - 0.5) * 0.35;
    const y = t * 0.7 + (rng() - 0.5) * 0.35;
    points.push([x + 0.5, y + 1.8]);
    groundTruth.push(1);
  }

  // Cluster 2: Compact spherical blob
  for (let i = 0; i < nPerCluster; i++) {
    const r = Math.sqrt(rng()) * 0.6;
    const th = rng() * 2 * Math.PI;
    points.push([2.5 + r * Math.cos(th), -1.5 + r * Math.sin(th)]);
    groundTruth.push(2);
  }

  return {
    name: "Anisotropic Elongated Blobs",
    description: "Directional variance and unequal covariance ellipses testing metric adaptability.",
    points,
    groundTruth,
    recommendedK: 3,
    recommendedEps: 0.45,
  };
}

export function generateGaussianMixture(n = 150, seed = 42): SyntheticDataset {
  const rng = createRNG(seed);
  const points: Point2D[] = [];
  const groundTruth: number[] = [];
  const nPerCluster = Math.floor(n / 3);

  const centers: Point2D[] = [
    [-1.8, -1.2],
    [1.8, -1.2],
    [0.0, 1.8],
  ];

  for (let c = 0; c < 3; c++) {
    const [cx, cy] = centers[c]!;
    for (let i = 0; i < nPerCluster; i++) {
      // Box-Muller transform for Gaussian distribution
      const u1 = Math.max(rng(), 1e-6);
      const u2 = rng();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
      const scale = c === 2 ? 0.45 : 0.6;
      points.push([cx + z0 * scale, cy + z1 * scale]);
      groundTruth.push(c);
    }
  }

  return {
    name: "Overlapping Gaussian Blobs",
    description: "Spherical isotropic clusters with uniform density where Ward and K-Means excel.",
    points,
    groundTruth,
    recommendedK: 3,
    recommendedEps: 0.65,
  };
}

// ---------------------------------------------------------------------------
// 6. Evaluation Metrics
// ---------------------------------------------------------------------------
/**
 * Adjusted Rand Index (ARI) comparing ground truth and predicted labels
 */
export function computeAdjustedRandIndex(labelsTrue: number[], labelsPred: number[]): number {
  const n = labelsTrue.length;
  if (n <= 1) return 1.0;

  // Build contingency table
  const contingency = new Map<string, number>();
  const sumA = new Map<number, number>();
  const sumB = new Map<number, number>();

  for (let i = 0; i < n; i++) {
    const a = labelsTrue[i]!;
    const b = labelsPred[i]!;
    const key = `${a}:${b}`;
    contingency.set(key, (contingency.get(key) ?? 0) + 1);
    sumA.set(a, (sumA.get(a) ?? 0) + 1);
    sumB.set(b, (sumB.get(b) ?? 0) + 1);
  }

  const comb2 = (val: number) => (val * (val - 1)) / 2;

  let sumComb = 0;
  for (const count of contingency.values()) {
    sumComb += comb2(count);
  }

  let sumCombA = 0;
  for (const count of sumA.values()) {
    sumCombA += comb2(count);
  }

  let sumCombB = 0;
  for (const count of sumB.values()) {
    sumCombB += comb2(count);
  }

  const totalComb = comb2(n);
  const expectedIndex = (sumCombA * sumCombB) / totalComb;
  const maxIndex = (sumCombA + sumCombB) / 2;

  if (maxIndex === expectedIndex) return 1.0;
  return (sumComb - expectedIndex) / (maxIndex - expectedIndex);
}

/**
 * Mean Silhouette Coefficient for points and cluster labels
 */
export function computeSilhouetteScore(points: number[][], labels: number[]): number {
  const n = points.length;
  if (n <= 1) return 0;

  // Identify unique clusters (ignoring noise -1)
  const clusters = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    const l = labels[i]!;
    if (l === -1) continue; // Noise points don't form clusters in silhouette calculation
    if (!clusters.has(l)) clusters.set(l, []);
    clusters.get(l)!.push(i);
  }

  if (clusters.size <= 1) return 0;

  let totalSil = 0;
  let validCount = 0;

  for (let i = 0; i < n; i++) {
    const l = labels[i]!;
    if (l === -1) continue;

    const myCluster = clusters.get(l)!;
    if (myCluster.length <= 1) {
      // Single-point cluster has silhouette 0
      validCount++;
      continue;
    }

    // Intra-cluster distance a(i)
    let aDist = 0;
    for (const other of myCluster) {
      if (other !== i) {
        aDist += euclideanDistance(points[i]!, points[other]!);
      }
    }
    const a = aDist / (myCluster.length - 1);

    // Inter-cluster distance b(i): min average distance to any other cluster
    let b = Infinity;
    for (const [otherL, otherCluster] of clusters.entries()) {
      if (otherL === l || otherCluster.length === 0) continue;
      let otherDist = 0;
      for (const other of otherCluster) {
        otherDist += euclideanDistance(points[i]!, points[other]!);
      }
      const avgD = otherDist / otherCluster.length;
      if (avgD < b) b = avgD;
    }

    const s = Math.max(a, b) === 0 ? 0 : (b - a) / Math.max(a, b);
    totalSil += s;
    validCount++;
  }

  return validCount > 0 ? totalSil / validCount : 0;
}
