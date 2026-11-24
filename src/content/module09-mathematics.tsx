import { useState, useMemo } from "react";
import {
  Sigma,
  RotateCcw,
  Sparkles,
  Calculator,
  Layers,
  Scale,
  Maximize2,
  Table as TableIcon,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

/** Interactive Distance Calculator */
export function DistanceCalculator() {
  const [p1, setP1] = useState<{ x: number; y: number }>({ x: 1, y: 2 });
  const [p2, setP2] = useState<{ x: number; y: number }>({ x: 2, y: 3 });
  const [pNorm, setPNorm] = useState<number>(3);

  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);

  // Euclidean & Squared Euclidean
  const euclidean = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const squaredEuclidean = Math.pow(euclidean, 2);

  // Manhattan
  const manhattan = dx + dy;

  // Minkowski
  const minkowski =
    pNorm >= 0.1 ? Math.pow(Math.pow(dx, pNorm) + Math.pow(dy, pNorm), 1 / pNorm) : 0;

  // Cosine Dissimilarity
  const dot = p1.x * p2.x + p1.y * p2.y;
  const norm1 = Math.hypot(p1.x, p1.y);
  const norm2 = Math.hypot(p2.x, p2.y);
  const isZeroVector = norm1 === 0 || norm2 === 0;
  const cosSim = isZeroVector ? 0 : dot / (norm1 * norm2);
  const clampedCosSim = Math.max(-1, Math.min(1, cosSim));
  const cosineDissimilarity = 1 - clampedCosSim;

  return (
    <div className="space-y-4 rounded-sm border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-teal" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            A. Two-Point Distance &amp; Dissimilarity Calculator
          </h4>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">Coordinates in ℝ²</span>
      </div>

      {/* Coordinate Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-2 rounded-xs border border-border bg-background p-3">
          <span className="font-semibold text-foreground">Point P₁ (x₁, y₁):</span>
          <div className="flex gap-2 font-mono">
            <label className="flex items-center gap-1 text-muted-foreground">
              x₁:
              <input
                type="number"
                value={p1.x}
                onChange={(e) => setP1({ ...p1, x: parseFloat(e.target.value) || 0 })}
                className="w-16 rounded-xs border border-border bg-card px-2 py-1 text-foreground"
                step="0.5"
              />
            </label>
            <label className="flex items-center gap-1 text-muted-foreground">
              y₁:
              <input
                type="number"
                value={p1.y}
                onChange={(e) => setP1({ ...p1, y: parseFloat(e.target.value) || 0 })}
                className="w-16 rounded-xs border border-border bg-card px-2 py-1 text-foreground"
                step="0.5"
              />
            </label>
          </div>
        </div>

        <div className="space-y-2 rounded-xs border border-border bg-background p-3">
          <span className="font-semibold text-foreground">Point P₂ (x₂, y₂):</span>
          <div className="flex gap-2 font-mono">
            <label className="flex items-center gap-1 text-muted-foreground">
              x₂:
              <input
                type="number"
                value={p2.x}
                onChange={(e) => setP2({ ...p2, x: parseFloat(e.target.value) || 0 })}
                className="w-16 rounded-xs border border-border bg-card px-2 py-1 text-foreground"
                step="0.5"
              />
            </label>
            <label className="flex items-center gap-1 text-muted-foreground">
              y₂:
              <input
                type="number"
                value={p2.y}
                onChange={(e) => setP2({ ...p2, y: parseFloat(e.target.value) || 0 })}
                className="w-16 rounded-xs border border-border bg-card px-2 py-1 text-foreground"
                step="0.5"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Minkowski p Slider */}
      <div className="rounded-xs border border-border bg-muted/20 p-3 space-y-1.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-medium text-foreground">Minkowski Norm Exponent (p):</span>
          <span className="font-mono font-bold text-teal">p = {pNorm.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="8.0"
          step="0.1"
          value={pNorm}
          onChange={(e) => setPNorm(parseFloat(e.target.value))}
          className="w-full accent-teal cursor-pointer"
        />
      </div>

      {/* Numerical Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="rounded-xs border border-border bg-background p-2.5 space-y-1">
          <span className="text-[10px] uppercase font-sans font-semibold text-muted-foreground">
            Euclidean (L₂)
          </span>
          <div className="text-base font-bold text-navy">{euclidean.toFixed(4)}</div>
          <span className="text-[10px] text-muted-foreground font-sans">
            √({dx}² + {dy}²)
          </span>
        </div>

        <div className="rounded-xs border border-border bg-background p-2.5 space-y-1">
          <span className="text-[10px] uppercase font-sans font-semibold text-muted-foreground">
            Squared Euclidean (L₂²)
          </span>
          <div className="text-base font-bold text-navy">{squaredEuclidean.toFixed(4)}</div>
          <span className="text-[10px] text-destructive font-sans">Violates Triangle Ineq.</span>
        </div>

        <div className="rounded-xs border border-border bg-background p-2.5 space-y-1">
          <span className="text-[10px] uppercase font-sans font-semibold text-muted-foreground">
            Manhattan (L₁)
          </span>
          <div className="text-base font-bold text-navy">{manhattan.toFixed(4)}</div>
          <span className="text-[10px] text-muted-foreground font-sans">
            |{dx}| + |{dy}|
          </span>
        </div>

        <div className="rounded-xs border border-border bg-background p-2.5 space-y-1">
          <span className="text-[10px] uppercase font-sans font-semibold text-muted-foreground">
            Cosine Dissimilarity
          </span>
          <div className="text-base font-bold text-navy">
            {isZeroVector ? "Undefined (Zero Vector)" : cosineDissimilarity.toFixed(4)}
          </div>
          <span className="text-[10px] text-muted-foreground font-sans">1 - cos(θ)</span>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="rounded-xs border border-border/80 bg-muted/20 p-3 text-xs font-mono text-muted-foreground space-y-1">
        <span className="font-sans font-bold text-foreground block">
          Intermediate Coordinate Differences:
        </span>
        <p>
          Δx = |{p2.x} - {p1.x}| = {dx.toFixed(2)}, Δy = |{p2.y} - {p1.y}| = {dy.toFixed(2)}
        </p>
        <p>
          Minkowski (p={pNorm.toFixed(1)}): ({dx.toFixed(2)}^{pNorm.toFixed(1)} + {dy.toFixed(2)}^
          {pNorm.toFixed(1)})^(1/{pNorm.toFixed(1)}) ={" "}
          <span className="font-bold text-teal">{minkowski.toFixed(4)}</span>
        </p>
      </div>
    </div>
  );
}

/** Interactive Centroid and Within-Cluster Sum of Squares (WSS) Calculator */
export function CentroidWSSCalculator() {
  // Cluster A points (up to 3 points in ℝ²)
  const [ptsA, setPtsA] = useState<{ x: number; y: number }[]>([
    { x: 1.0, y: 2.0 },
    { x: 2.0, y: 3.0 },
  ]);

  // Cluster B points (up to 3 points in ℝ²)
  const [ptsB, setPtsB] = useState<{ x: number; y: number }[]>([
    { x: 6.0, y: 5.0 },
    { x: 7.0, y: 6.0 },
  ]);

  // Centroid A
  const muA = useMemo(() => {
    if (ptsA.length === 0) return { x: 0, y: 0 };
    const sumX = ptsA.reduce((acc, p) => acc + p.x, 0);
    const sumY = ptsA.reduce((acc, p) => acc + p.y, 0);
    return { x: sumX / ptsA.length, y: sumY / ptsA.length };
  }, [ptsA]);

  // Centroid B
  const muB = useMemo(() => {
    if (ptsB.length === 0) return { x: 0, y: 0 };
    const sumX = ptsB.reduce((acc, p) => acc + p.x, 0);
    const sumY = ptsB.reduce((acc, p) => acc + p.y, 0);
    return { x: sumX / ptsB.length, y: sumY / ptsB.length };
  }, [ptsB]);

  // WSS A
  const wssA = useMemo(() => {
    return ptsA.reduce((acc, p) => acc + Math.pow(p.x - muA.x, 2) + Math.pow(p.y - muA.y, 2), 0);
  }, [ptsA, muA]);

  // WSS B
  const wssB = useMemo(() => {
    return ptsB.reduce((acc, p) => acc + Math.pow(p.x - muB.x, 2) + Math.pow(p.y - muB.y, 2), 0);
  }, [ptsB, muB]);

  // Merged Cluster A U B
  const ptsAB = useMemo(() => [...ptsA, ...ptsB], [ptsA, ptsB]);

  const muAB = useMemo(() => {
    if (ptsAB.length === 0) return { x: 0, y: 0 };
    const sumX = ptsAB.reduce((acc, p) => acc + p.x, 0);
    const sumY = ptsAB.reduce((acc, p) => acc + p.y, 0);
    return { x: sumX / ptsAB.length, y: sumY / ptsAB.length };
  }, [ptsAB]);

  const wssAB = useMemo(() => {
    return ptsAB.reduce((acc, p) => acc + Math.pow(p.x - muAB.x, 2) + Math.pow(p.y - muAB.y, 2), 0);
  }, [ptsAB, muAB]);

  // Variance increase Delta WSS
  const deltaWSS = wssAB - wssA - wssB;

  // BSS from Ward formula: (nA * nB / (nA + nB)) * ||muA - muB||^2
  const nA = ptsA.length;
  const nB = ptsB.length;
  const centroidSepSq = Math.pow(muA.x - muB.x, 2) + Math.pow(muA.y - muB.y, 2);
  const wardHarmonicWeight = (nA * nB) / (nA + nB);
  const bssAnalytical = wardHarmonicWeight * centroidSepSq;

  return (
    <div className="space-y-4 rounded-sm border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-teal" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            B. Centroid &amp; Within-Cluster Sum of Squares (WSS) Calculator
          </h4>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          Huygens' Theorem Verification: TSS = WSS + BSS
        </span>
      </div>

      {/* Cluster Point Coordinates & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Cluster A */}
        <div className="space-y-2 rounded-xs border border-border bg-background p-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-foreground">Cluster A (n_A = {nA}):</span>
            <span className="font-mono text-teal font-semibold">
              μ_A = ({muA.x.toFixed(2)}, {muA.y.toFixed(2)})
            </span>
          </div>
          <div className="space-y-1 font-mono text-muted-foreground">
            {ptsA.map((p, idx) => (
              <div key={idx} className="flex justify-between">
                <span>
                  Point A{idx + 1}: ({p.x}, {p.y})
                </span>
                <span>
                  ||p - μ_A||² = {(Math.pow(p.x - muA.x, 2) + Math.pow(p.y - muA.y, 2)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-1 flex justify-between font-mono font-bold text-foreground">
            <span>WSS(A):</span>
            <span className="text-teal">{wssA.toFixed(4)}</span>
          </div>
        </div>

        {/* Cluster B */}
        <div className="space-y-2 rounded-xs border border-border bg-background p-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-foreground">Cluster B (n_B = {nB}):</span>
            <span className="font-mono text-teal font-semibold">
              μ_B = ({muB.x.toFixed(2)}, {muB.y.toFixed(2)})
            </span>
          </div>
          <div className="space-y-1 font-mono text-muted-foreground">
            {ptsB.map((p, idx) => (
              <div key={idx} className="flex justify-between">
                <span>
                  Point B{idx + 1}: ({p.x}, {p.y})
                </span>
                <span>
                  ||p - μ_B||² = {(Math.pow(p.x - muB.x, 2) + Math.pow(p.y - muB.y, 2)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-1 flex justify-between font-mono font-bold text-foreground">
            <span>WSS(B):</span>
            <span className="text-teal">{wssB.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Merged Cluster Analysis Box */}
      <div className="rounded-xs border border-teal/30 bg-teal/5 p-4 space-y-3 text-xs">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <span className="font-bold text-foreground">Merged Cluster A ∪ B (n = {nA + nB}):</span>
          <span className="font-mono font-bold text-navy">
            μ_{"{A∪B}"} = ({muAB.x.toFixed(2)}, {muAB.y.toFixed(2)})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center">
          <div className="rounded-xs border border-border bg-background p-2 space-y-0.5">
            <span className="text-[10px] text-muted-foreground font-sans uppercase">
              Pooled WSS(A∪B)
            </span>
            <div className="text-sm font-bold text-foreground">{wssAB.toFixed(4)}</div>
          </div>
          <div className="rounded-xs border border-border bg-background p-2 space-y-0.5">
            <span className="text-[10px] text-muted-foreground font-sans uppercase">
              Sum of Prior WSS
            </span>
            <div className="text-sm font-bold text-muted-foreground">
              {(wssA + wssB).toFixed(4)}
            </div>
          </div>
          <div className="rounded-xs border border-teal/40 bg-teal/10 p-2 space-y-0.5">
            <span className="text-[10px] text-teal font-sans uppercase font-bold">
              Variance Increase (ΔWSS)
            </span>
            <div className="text-sm font-bold text-teal">{deltaWSS.toFixed(4)}</div>
          </div>
        </div>

        <div className="rounded-xs border border-border bg-background/80 p-3 font-mono text-[11px] text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Harmonic Weight factor [n_A · n_B / (n_A + n_B)]:</span>
            <span className="font-bold text-foreground">{wardHarmonicWeight.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span>Squared Centroid Separation ||μ_A - μ_B||²:</span>
            <span className="font-bold text-foreground">{centroidSepSq.toFixed(4)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1 font-bold text-teal">
            <span>Ward Analytical Increase [Harmonic · ||μ_A - μ_B||²]:</span>
            <span>{bssAnalytical.toFixed(4)} (Exact Match with ΔWSS ✓)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Interactive Ward Criterion Simulator */
export function WardCriterionSimulator() {
  const [sizeA, setSizeA] = useState<number>(2);
  const [sizeB, setSizeB] = useState<number>(2);
  const [centroidDist, setCentroidDist] = useState<number>(5.831);

  const centroidSepSq = Math.pow(centroidDist, 2);
  const harmonicFactor = (sizeA * sizeB) / (sizeA + sizeB);
  const deltaWSS = harmonicFactor * centroidSepSq;
  const scipyHeight = Math.sqrt(2 * deltaWSS);

  return (
    <div className="space-y-4 rounded-sm border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-teal" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            C. Ward's Variance Increase &amp; Size Penalty Simulator
          </h4>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          ΔWSS = [n_A n_B / (n_A + n_B)] · ||μ_A - μ_B||²
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1.5 rounded-xs border border-border bg-background p-3">
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Cluster A Size (n_A):</span>
            <span className="font-mono font-bold text-teal">{sizeA}</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={sizeA}
            onChange={(e) => setSizeA(parseInt(e.target.value) || 1)}
            className="w-full accent-teal cursor-pointer"
          />
        </div>

        <div className="space-y-1.5 rounded-xs border border-border bg-background p-3">
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Cluster B Size (n_B):</span>
            <span className="font-mono font-bold text-teal">{sizeB}</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={sizeB}
            onChange={(e) => setSizeB(parseInt(e.target.value) || 1)}
            className="w-full accent-teal cursor-pointer"
          />
        </div>

        <div className="space-y-1.5 rounded-xs border border-border bg-background p-3">
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Centroid Distance ||μ_A - μ_B||:</span>
            <span className="font-mono font-bold text-navy">{centroidDist.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="12.0"
            step="0.1"
            value={centroidDist}
            onChange={(e) => setCentroidDist(parseFloat(e.target.value))}
            className="w-full accent-navy cursor-pointer"
          />
        </div>
      </div>

      {/* Output Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="rounded-xs border border-border bg-background p-3 space-y-1">
          <span className="text-[10px] uppercase font-sans font-semibold text-muted-foreground">
            Harmonic Weight
          </span>
          <div className="text-base font-bold text-foreground">{harmonicFactor.toFixed(4)}</div>
          <span className="text-[10px] text-muted-foreground font-sans">
            n_A · n_B / (n_A + n_B)
          </span>
        </div>

        <div className="rounded-xs border border-border bg-background p-3 space-y-1">
          <span className="text-[10px] uppercase font-sans font-semibold text-muted-foreground">
            Squared Separation
          </span>
          <div className="text-base font-bold text-foreground">{centroidSepSq.toFixed(4)}</div>
          <span className="text-[10px] text-muted-foreground font-sans">||μ_A - μ_B||²</span>
        </div>

        <div className="rounded-xs border border-teal/30 bg-teal/5 p-3 space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-teal">
            Variance Increase (ΔWSS)
          </span>
          <div className="text-base font-bold text-teal">{deltaWSS.toFixed(4)}</div>
          <span className="text-[10px] text-teal-dark dark:text-teal font-sans">
            Raw Ward Objective
          </span>
        </div>

        <div className="rounded-xs border border-navy/30 bg-navy/5 p-3 space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-navy">
            SciPy Linkage Height
          </span>
          <div className="text-base font-bold text-navy">{scipyHeight.toFixed(4)}</div>
          <span className="text-[10px] text-navy font-sans">√(2 · ΔWSS)</span>
        </div>
      </div>

      <div className="p-3 bg-muted/20 border border-border/80 rounded-xs text-xs space-y-1">
        <span className="font-bold text-foreground block">Key Mathematical Takeaway:</span>
        <p className="text-muted-foreground leading-relaxed">
          Notice how doubling cluster sizes while keeping centroid separation constant doubles the
          harmonic weight factor from {(harmonicFactor / 2).toFixed(2)} to{" "}
          {harmonicFactor.toFixed(2)}, doubling the variance penalty ΔWSS. This mathematical size
          bias is why Ward's criterion resists merging large clusters and naturally produces
          balanced, compact clusters.
        </p>
      </div>
    </div>
  );
}

/** Interactive Lance–Williams Recurrence Calculator */
export function LanceWilliamsCalculator() {
  const [method, setMethod] = useState<"single" | "complete" | "average" | "centroid" | "ward">(
    "ward",
  );

  const [dAC, setDAC] = useState<number>(34.0);
  const [dBC, setDBC] = useState<number>(20.0);
  const [dAB, setDAB] = useState<number>(2.0);

  const [nA, setNA] = useState<number>(1);
  const [nB, setNB] = useState<number>(1);
  const [nC, setNC] = useState<number>(1);

  // Parameter calculation
  const params = useMemo(() => {
    if (method === "single") {
      return { alphaA: 0.5, alphaB: 0.5, beta: 0.0, gamma: -0.5, space: "Distance d" };
    }
    if (method === "complete") {
      return { alphaA: 0.5, alphaB: 0.5, beta: 0.0, gamma: 0.5, space: "Distance d" };
    }
    if (method === "average") {
      return {
        alphaA: nA / (nA + nB),
        alphaB: nB / (nA + nB),
        beta: 0.0,
        gamma: 0.0,
        space: "Distance d",
      };
    }
    if (method === "centroid") {
      return {
        alphaA: nA / (nA + nB),
        alphaB: nB / (nA + nB),
        beta: -(nA * nB) / Math.pow(nA + nB, 2),
        gamma: 0.0,
        space: "Squared Distance d²",
      };
    }
    // Ward
    return {
      alphaA: (nA + nC) / (nA + nB + nC),
      alphaB: (nB + nC) / (nA + nB + nC),
      beta: -nC / (nA + nB + nC),
      gamma: 0.0,
      space: "Squared Distance / ΔWSS",
    };
  }, [method, nA, nB, nC]);

  const updatedDistance =
    params.alphaA * dAC +
    params.alphaB * dBC +
    params.beta * dAB +
    params.gamma * Math.abs(dAC - dBC);

  return (
    <div className="space-y-4 rounded-sm border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Sigma className="h-4 w-4 text-teal" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            D. Lance–Williams Recurrence Calculator
          </h4>
        </div>

        <div className="flex flex-wrap gap-1 bg-muted/40 p-1 rounded-sm border border-border">
          {(
            [
              ["single", "Single"],
              ["complete", "Complete"],
              ["average", "Average"],
              ["centroid", "Centroid"],
              ["ward", "Ward"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMethod(key)}
              className={`px-2 py-0.5 text-xs rounded-xs font-medium transition-colors ${
                method === key
                  ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Distances & Sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-2 rounded-xs border border-border bg-background p-3">
          <span className="font-semibold text-foreground">
            Existing Cluster Distances ({params.space}):
          </span>
          <div className="grid grid-cols-3 gap-2 font-mono">
            <label className="space-y-1 text-muted-foreground">
              <span>D(A, C):</span>
              <input
                type="number"
                value={dAC}
                onChange={(e) => setDAC(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xs border border-border bg-card px-2 py-1 text-foreground"
              />
            </label>
            <label className="space-y-1 text-muted-foreground">
              <span>D(B, C):</span>
              <input
                type="number"
                value={dBC}
                onChange={(e) => setDBC(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xs border border-border bg-card px-2 py-1 text-foreground"
              />
            </label>
            <label className="space-y-1 text-muted-foreground">
              <span>D(A, B):</span>
              <input
                type="number"
                value={dAB}
                onChange={(e) => setDAB(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xs border border-border bg-card px-2 py-1 text-foreground"
              />
            </label>
          </div>
        </div>

        <div className="space-y-2 rounded-xs border border-border bg-background p-3">
          <span className="font-semibold text-foreground">Cluster Cardinalities:</span>
          <div className="grid grid-cols-3 gap-2 font-mono">
            <label className="space-y-1 text-muted-foreground">
              <span>n_A:</span>
              <input
                type="number"
                min="1"
                value={nA}
                onChange={(e) => setNA(parseInt(e.target.value) || 1)}
                className="w-full rounded-xs border border-border bg-card px-2 py-1 text-foreground"
              />
            </label>
            <label className="space-y-1 text-muted-foreground">
              <span>n_B:</span>
              <input
                type="number"
                min="1"
                value={nB}
                onChange={(e) => setNB(parseInt(e.target.value) || 1)}
                className="w-full rounded-xs border border-border bg-card px-2 py-1 text-foreground"
              />
            </label>
            <label className="space-y-1 text-muted-foreground">
              <span>n_C:</span>
              <input
                type="number"
                min="1"
                value={nC}
                onChange={(e) => setNC(parseInt(e.target.value) || 1)}
                className="w-full rounded-xs border border-border bg-card px-2 py-1 text-foreground"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Calculated Coefficients and Result */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono text-center">
        <div className="rounded-xs border border-border bg-background p-2">
          <span className="text-[10px] text-muted-foreground font-sans uppercase">α_A</span>
          <div className="font-bold text-foreground">{params.alphaA.toFixed(4)}</div>
        </div>
        <div className="rounded-xs border border-border bg-background p-2">
          <span className="text-[10px] text-muted-foreground font-sans uppercase">α_B</span>
          <div className="font-bold text-foreground">{params.alphaB.toFixed(4)}</div>
        </div>
        <div className="rounded-xs border border-border bg-background p-2">
          <span className="text-[10px] text-muted-foreground font-sans uppercase">β</span>
          <div className="font-bold text-foreground">{params.beta.toFixed(4)}</div>
        </div>
        <div className="rounded-xs border border-border bg-background p-2">
          <span className="text-[10px] text-muted-foreground font-sans uppercase">γ</span>
          <div className="font-bold text-foreground">{params.gamma.toFixed(4)}</div>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-xs border border-teal/40 bg-teal/10 p-2">
          <span className="text-[10px] text-teal font-sans uppercase font-bold">D(A∪B, C)</span>
          <div className="font-bold text-teal">{updatedDistance.toFixed(4)}</div>
        </div>
      </div>

      {/* Step by step arithmetic */}
      <div className="rounded-xs border border-border/80 bg-muted/20 p-3 text-xs font-mono text-muted-foreground space-y-1">
        <span className="font-sans font-bold text-foreground block">
          Recurrence Evaluation Breakdown:
        </span>
        <p>
          D(A ∪ B, C) = ({params.alphaA.toFixed(4)} × {dAC}) + ({params.alphaB.toFixed(4)} × {dBC})
          + ({params.beta.toFixed(4)} × {dAB}) + ({params.gamma.toFixed(4)} × |{dAC} - {dBC}|)
        </p>
        <p>
          = {(params.alphaA * dAC).toFixed(4)} + {(params.alphaB * dBC).toFixed(4)} +{" "}
          {(params.beta * dAB).toFixed(4)} + {(params.gamma * Math.abs(dAC - dBC)).toFixed(4)} ={" "}
          <span className="font-bold text-teal">{updatedDistance.toFixed(4)}</span>
        </p>
      </div>
    </div>
  );
}

/** Interactive Pairwise Distance Growth and Memory Calculator */
export function PairwiseDistanceGrowthVisualizer() {
  const [numObs, setNumObs] = useState<number>(100);

  const numPairs = (numObs * (numObs - 1)) / 2;
  const redundantFloats = Math.pow(numObs, 2);
  const condensedFloats = numPairs;

  // Assuming 8 bytes per double-precision float (float64)
  const redundantBytes = redundantFloats * 8;
  const condensedBytes = condensedFloats * 8;

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="space-y-4 rounded-sm border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-teal" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            E. Quadratic Pairwise Distance &amp; Memory Growth Calculator
          </h4>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">N_pairs = n(n - 1) / 2</span>
      </div>

      <div className="space-y-2 rounded-xs border border-border bg-background p-3 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-foreground">Dataset Observations (n):</span>
          <span className="font-mono font-bold text-teal">
            n = {numObs.toLocaleString()} samples
          </span>
        </div>
        <input
          type="range"
          min="2"
          max="2000"
          step="5"
          value={numObs}
          onChange={(e) => setNumObs(parseInt(e.target.value) || 2)}
          className="w-full accent-teal cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
          <span>n = 2 (1 pair)</span>
          <span>n = 500 (124,750 pairs)</span>
          <span>n = 1,000 (499,500 pairs)</span>
          <span>n = 2,000 (1,999,000 pairs)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-center">
        <div className="rounded-xs border border-border bg-background p-3 space-y-1">
          <span className="text-[10px] text-muted-foreground font-sans uppercase">
            Unique Observation Pairs
          </span>
          <div className="text-base font-bold text-navy">{numPairs.toLocaleString()}</div>
          <span className="text-[10px] text-muted-foreground font-sans">
            n(n-1) / 2 evaluations
          </span>
        </div>

        <div className="rounded-xs border border-border bg-background p-3 space-y-1">
          <span className="text-[10px] text-muted-foreground font-sans uppercase">
            Condensed Array Memory
          </span>
          <div className="text-base font-bold text-teal">{formatBytes(condensedBytes)}</div>
          <span className="text-[10px] text-teal-dark dark:text-teal font-sans">
            SciPy pdist (1D vector)
          </span>
        </div>

        <div className="rounded-xs border border-border bg-background p-3 space-y-1">
          <span className="text-[10px] text-muted-foreground font-sans uppercase">
            Square Matrix Memory
          </span>
          <div className="text-base font-bold text-destructive">{formatBytes(redundantBytes)}</div>
          <span className="text-[10px] text-destructive font-sans">n × n redundant float64</span>
        </div>
      </div>
    </div>
  );
}

/** Module 09 Knowledge Check Quiz */
export function Module09Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const questions = [
    {
      id: 1,
      question:
        "Why is Squared Euclidean Distance d²(u, v) = ||u - v||² formally disqualified as a strict metric space distance?",
      options: [
        "It can produce negative distance values between orthogonal vectors.",
        "It violates the triangle inequality: d²(u, w) can exceed d²(u, v) + d²(v, w).",
        "It violates the symmetry axiom: d²(u, v) ≠ d²(v, u).",
        "It assigns zero distance to non-identical observations.",
      ],
      correct: 1,
      explanation:
        "Squared Euclidean distance violates the triangle inequality! For collinear points with x=0, y=1, z=2, d(x, y)=1, d(y, z)=1, and d(x, z)=2. In squared distance: d²(x, y)=1, d²(y, z)=1, but d²(x, z)=4, which is strictly greater than 1 + 1 = 2! However, its strictly convex properties make it mathematically essential for Ward's variance minimization and K-Means.",
    },
    {
      id: 2,
      question:
        "In the algebraic derivation of Ward's variance increase ΔWSS(A, B) = [n_A n_B / (n_A + n_B)] ||μ_A - μ_B||², which fundamental centroid identity causes the expansion cross-terms to vanish?",
      options: [
        "∑_{x ∈ C} (x - μ_C) = 0 (the sum of deviations from the centroid is identically zero).",
        "The Cauchy-Schwarz inequality |u · v| ≤ ||u|| ||v||.",
        "The Lance–Williams recurrence β parameter being strictly negative.",
        "The orthogonality of the principal component axes.",
      ],
      correct: 0,
      explanation:
        "By mathematical definition of the centroid μ_C = (1/|C|) ∑ x_i, multiplying by |C| gives |C| μ_C = ∑ x_i. Subtracting yields ∑ (x_i - μ_C) = 0. Therefore, when expanding ||(x - μ_S) + (μ_S - c)||², the cross-term 2(μ_S - c)ᵀ ∑ (x - μ_S) evaluates to 0, leaving only WSS(S) and |S| ||μ_S - c||².",
    },
    {
      id: 3,
      question:
        "How does the harmonic weight factor (n_A n_B) / (n_A + n_B) in Ward's method influence cluster formation compared to centroid distance alone?",
      options: [
        "It encourages merging large clusters with each other regardless of spatial distance.",
        "It penalizes merging clusters with large cardinalities, strongly favoring balanced, equal-sized clusters.",
        "It causes the algorithm to produce elongated, serpentine chaining clusters identical to Single Linkage.",
        "It makes the merge distance invariant to feature scaling.",
      ],
      correct: 1,
      explanation:
        "The harmonic weight factor scales proportionally with cluster sizes (e.g., 0.5 for two singletons vs 50.0 for two clusters of size 100). Consequently, Ward's method imposes a severe penalty on merges between large clusters, heavily biasing the tree toward balanced, compact, equal-sized spherical clusters.",
    },
    {
      id: 4,
      question:
        "Why does standard hierarchical clustering require O(n²) space complexity regardless of the linkage criterion chosen?",
      options: [
        "Because each tree level requires storing 2^n cluster pointers.",
        "Because storing all pairwise distances between n observations requires n(n - 1)/2 entries.",
        "Because Scikit-learn allocates a copy of the dataset for every merge stage.",
        "Because the Lance–Williams recurrence evaluates all n³ combinations simultaneously.",
      ],
      correct: 1,
      explanation:
        "There are n(n - 1)/2 unique observation pairs in a dataset of size n. Storing this initial dissimilarity matrix in condensed or square form consumes O(n²) memory, which becomes a severe computational bottleneck for large sample sizes (e.g. n > 50,000).",
    },
  ];

  const handleSelect = (qId: number, oIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: oIdx }));
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = Object.entries(answers).reduce((acc, [qId, ans]) => {
    const q = questions.find((item) => item.id === Number(qId));
    return q && q.correct === ans ? acc + 1 : acc;
  }, 0);

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-teal" />
            Module 09 Knowledge Check: Mathematical Foundations
          </h4>
          <p className="text-xs text-muted-foreground">
            Test your understanding of metric space axioms, WSS variance expansion, Ward's harmonic
            size penalty, and quadratic storage growth.
          </p>
        </div>
        {submitted && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-sm bg-teal/10 text-teal border border-teal/20">
              Score: {score} / {questions.length}
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 border border-border px-2 py-1 rounded-sm"
            >
              <RotateCcw className="h-3 w-3" /> Retry
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((q) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.correct;

          return (
            <div
              key={q.id}
              className="rounded-sm border border-border/70 p-4 bg-muted/15 space-y-3"
            >
              <p className="text-xs font-semibold text-foreground">
                <span className="text-teal font-mono mr-1.5">Q{q.id}.</span>
                {q.question}
              </p>

              <div className="space-y-1.5">
                {q.options.map((opt, oIdx) => {
                  let optStyle = "border-border hover:bg-muted/40 text-muted-foreground";

                  if (selected === oIdx) {
                    optStyle = "border-navy bg-navy/10 text-foreground font-medium";
                  }

                  if (submitted) {
                    if (oIdx === q.correct) {
                      optStyle = "border-teal bg-teal/15 text-teal font-semibold";
                    } else if (selected === oIdx) {
                      optStyle = "border-destructive bg-destructive/15 text-destructive";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(q.id, oIdx)}
                      disabled={submitted}
                      className={`w-full text-left text-xs p-2.5 rounded-sm border transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && oIdx === q.correct && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`text-xs p-2.5 rounded-sm flex items-start gap-2 ${
                    isCorrect
                      ? "bg-teal/10 text-teal-dark dark:text-teal border border-teal/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < questions.length}
          className="w-full sm:w-auto px-4 py-2 bg-navy text-primary-foreground text-xs font-semibold rounded-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          Check Answers ({Object.keys(answers).length}/{questions.length} completed)
        </button>
      )}
    </div>
  );
}

/** Unified Interactive Mathematical Playground Component */
export function MathematicalPlayground() {
  const [activeTab, setActiveTab] = useState<
    "distance" | "centroid" | "ward" | "lancewilliams" | "complexity"
  >("distance");

  return (
    <div className="space-y-4 rounded-sm border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-4 w-4 text-teal" />
            Interactive Mathematical Playground
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test and verify distance calculations, centroid shifts, WSS increases, Ward's objective,
            and Lance–Williams updates in real time.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 bg-muted/40 p-1 rounded-sm border border-border">
          <button
            onClick={() => setActiveTab("distance")}
            className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
              activeTab === "distance"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Distance
          </button>
          <button
            onClick={() => setActiveTab("centroid")}
            className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
              activeTab === "centroid"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Centroid &amp; WSS
          </button>
          <button
            onClick={() => setActiveTab("ward")}
            className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
              activeTab === "ward"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Ward Simulator
          </button>
          <button
            onClick={() => setActiveTab("lancewilliams")}
            className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
              activeTab === "lancewilliams"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Lance–Williams
          </button>
          <button
            onClick={() => setActiveTab("complexity")}
            className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
              activeTab === "complexity"
                ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Complexity Growth
          </button>
        </div>
      </div>

      {activeTab === "distance" && <DistanceCalculator />}
      {activeTab === "centroid" && <CentroidWSSCalculator />}
      {activeTab === "ward" && <WardCriterionSimulator />}
      {activeTab === "lancewilliams" && <LanceWilliamsCalculator />}
      {activeTab === "complexity" && <PairwiseDistanceGrowthVisualizer />}
    </div>
  );
}
