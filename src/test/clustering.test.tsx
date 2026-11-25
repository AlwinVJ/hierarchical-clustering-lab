import { describe, it, expect } from "vitest";
import {
  euclideanDistance,
  squaredEuclidean,
  kMeans,
  dbscan,
  singleLinkage,
  wardLinkage,
  generateTwoMoons,
  generateGaussianMixture,
  computeAdjustedRandIndex,
  computeSilhouetteScore,
} from "../lib/clustering";

describe("Clustering Algorithms and Metrics Library", () => {
  const canonical4Points = [
    [1.0, 2.0], // P1
    [2.0, 3.0], // P2
    [6.0, 5.0], // P3
    [7.0, 6.0], // P4
  ];

  it("calculates exact Euclidean and squared Euclidean distances", () => {
    const p1 = [1, 2];
    const p2 = [2, 3];
    expect(euclideanDistance(p1, p2)).toBeCloseTo(Math.SQRT2, 5);
    expect(squaredEuclidean(p1, p2)).toBeCloseTo(2.0, 5);
  });

  it("partitions canonical 4-point set into {0, 1} and {2, 3} with Single Linkage at k=2", () => {
    const res = singleLinkage(canonical4Points, 2);
    expect(res.labels[0]).toBe(res.labels[1]);
    expect(res.labels[2]).toBe(res.labels[3]);
    expect(res.labels[0]).not.toBe(res.labels[2]);
  });

  it("partitions canonical 4-point set into {0, 1} and {2, 3} with Ward Linkage at k=2", () => {
    const res = wardLinkage(canonical4Points, 2);
    expect(res.labels[0]).toBe(res.labels[1]);
    expect(res.labels[2]).toBe(res.labels[3]);
    expect(res.labels[0]).not.toBe(res.labels[2]);
  });

  it("K-Means converges deterministically with seeded K-Means++", () => {
    const res = kMeans(canonical4Points, 2, 20, 42);
    expect(res.labels[0]).toBe(res.labels[1]);
    expect(res.labels[2]).toBe(res.labels[3]);
    expect(res.labels[0]).not.toBe(res.labels[2]);
    expect(res.centroids).toHaveLength(2);
  });

  it("DBSCAN correctly identifies clusters and flags isolated outliers as noise", () => {
    const pointsWithOutlier = [
      ...canonical4Points,
      [50.0, 50.0], // Isolated outlier point
    ];
    // eps = 2.0, minPts = 2
    const res = dbscan(pointsWithOutlier, 2.0, 2);
    // P1 and P2 in cluster
    expect(res.labels[0]).toBe(res.labels[1]);
    expect(res.labels[0]).toBeGreaterThanOrEqual(0);
    // P3 and P4 in cluster
    expect(res.labels[2]).toBe(res.labels[3]);
    expect(res.labels[2]).toBeGreaterThanOrEqual(0);
    // Outlier must be noise (-1)
    expect(res.labels[4]).toBe(-1);
    expect(res.noiseCount).toBe(1);
  });

  it("demonstrates manifold vs centroid behavior on Two Moons dataset", () => {
    const dataset = generateTwoMoons(120, 0.05, 42);

    // Single linkage follows the continuous manifold
    const singleRes = singleLinkage(dataset.points, 2);
    const singleARI = computeAdjustedRandIndex(dataset.groundTruth, singleRes.labels);
    expect(singleARI).toBeGreaterThan(0.9);

    // DBSCAN also follows density manifold
    const dbscanRes = dbscan(dataset.points, 0.35, 3);
    const dbscanARI = computeAdjustedRandIndex(dataset.groundTruth, dbscanRes.labels);
    expect(dbscanARI).toBeGreaterThan(0.85);

    // K-Means splits across Euclidean centers and fractures non-convex manifolds
    const kmRes = kMeans(dataset.points, 2, 50, 42);
    const kmARI = computeAdjustedRandIndex(dataset.groundTruth, kmRes.labels);
    expect(kmARI).toBeLessThan(0.6);
  });

  it("computes Adjusted Rand Index correctly (perfect and permuted invariance)", () => {
    const trueLabels = [0, 0, 1, 1, 2, 2];
    const perfectPred = [0, 0, 1, 1, 2, 2];
    const permutedPred = [2, 2, 0, 0, 1, 1];
    const imperfectPred = [0, 1, 1, 1, 2, 2];

    expect(computeAdjustedRandIndex(trueLabels, perfectPred)).toBeCloseTo(1.0, 5);
    expect(computeAdjustedRandIndex(trueLabels, permutedPred)).toBeCloseTo(1.0, 5);
    expect(computeAdjustedRandIndex(trueLabels, imperfectPred)).toBeLessThan(1.0);
  });

  it("computes Silhouette Score properly on distinct Gaussian clusters", () => {
    const dataset = generateGaussianMixture(90, 42);
    const wardRes = wardLinkage(dataset.points, 3);
    const sil = computeSilhouetteScore(dataset.points, wardRes.labels);
    expect(sil).toBeGreaterThan(0.5);
  });
});
