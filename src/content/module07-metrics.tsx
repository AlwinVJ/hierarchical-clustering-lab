import { useState, useMemo } from "react";
import {
  Ruler,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  Compass,
  Layers,
  Activity,
  BarChart2,
} from "lucide-react";

const MIN_COORD = -3;
const MAX_COORD = 9;
const RANGE_COORD = MAX_COORD - MIN_COORD;
const SVG_WIDTH = 340;
const SVG_HEIGHT = 280;

const toSvgX = (x: number) => ((x - MIN_COORD) / RANGE_COORD) * SVG_WIDTH;
const toSvgY = (y: number) => SVG_HEIGHT - ((y - MIN_COORD) / RANGE_COORD) * SVG_HEIGHT;

/** Interactive Distance Metric 2D Geometric Explorer */
export function DistanceMetricExplorer() {
  const [selectedMetric, setSelectedMetric] = useState<
    "euclidean" | "manhattan" | "minkowski" | "chebyshev" | "cosine" | "mahalanobis"
  >("euclidean");

  // Coordinate states for two points
  const [p1, setP1] = useState<{ x: number; y: number }>({ x: 1, y: 2 });
  const [p2, setP2] = useState<{ x: number; y: number }>({ x: 2, y: 3 });

  // Minkowski p-value
  const [minkowskiP, setMinkowskiP] = useState<number>(3);

  // Mahalanobis correlation rho
  const [rho, setRho] = useState<number>(0.6);
  const [sigmaX, setSigmaX] = useState<number>(2.0);
  const [sigmaY, setSigmaY] = useState<number>(1.5);

  // Presets
  const applyPreset = (
    preset: "benchmark_p1_p2" | "benchmark_p1_p3" | "benchmark_p1_p4" | "orthogonal" | "opposite",
  ) => {
    if (preset === "benchmark_p1_p2") {
      setP1({ x: 1, y: 2 });
      setP2({ x: 2, y: 3 });
    } else if (preset === "benchmark_p1_p3") {
      setP1({ x: 1, y: 2 });
      setP2({ x: 6, y: 5 });
    } else if (preset === "benchmark_p1_p4") {
      setP1({ x: 1, y: 2 });
      setP2({ x: 7, y: 6 });
    } else if (preset === "orthogonal") {
      setP1({ x: 3, y: 0 });
      setP2({ x: 0, y: 3 });
    } else if (preset === "opposite") {
      setP1({ x: 3, y: 3 });
      setP2({ x: -3, y: -3 });
    }
  };

  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);

  // Euclidean (L2)
  const euclideanDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

  // Manhattan (L1)
  const manhattanDist = dx + dy;

  // Minkowski (Lp)
  const minkowskiDist =
    minkowskiP < 0.1
      ? 0
      : Math.pow(Math.pow(dx, minkowskiP) + Math.pow(dy, minkowskiP), 1 / minkowskiP);

  // Chebyshev (L_infinity)
  const chebyshevDist = Math.max(dx, dy);

  // Cosine
  const dotProduct = p1.x * p2.x + p1.y * p2.y;
  const norm1 = Math.hypot(p1.x, p1.y);
  const norm2 = Math.hypot(p2.x, p2.y);
  const cosSim = norm1 > 0 && norm2 > 0 ? dotProduct / (norm1 * norm2) : 0;
  const clampedCosSim = Math.max(-1, Math.min(1, cosSim));
  const cosineDist = 1 - clampedCosSim;
  const angularDist = Math.acos(clampedCosSim) / Math.PI;
  const angleDeg = (Math.acos(clampedCosSim) * 180) / Math.PI;

  // Mahalanobis
  // 2D Covariance Matrix:
  // Σ = [ [sigmaX^2, rho*sigmaX*sigmaY], [rho*sigmaX*sigmaY, sigmaY^2] ]
  // det(Σ) = sigmaX^2 * sigmaY^2 * (1 - rho^2)
  // Σ^-1 = (1 / det) * [ [sigmaY^2, -rho*sigmaX*sigmaY], [-rho*sigmaX*sigmaY, sigmaX^2] ]
  const diffX = p2.x - p1.x;
  const diffY = p2.y - p1.y;
  const detSigma = Math.pow(sigmaX, 2) * Math.pow(sigmaY, 2) * (1 - Math.pow(rho, 2));
  let mahalanobisDist = 0;
  if (detSigma > 0.0001) {
    const inv11 = Math.pow(sigmaY, 2) / detSigma;
    const inv12 = (-rho * sigmaX * sigmaY) / detSigma;
    const inv22 = Math.pow(sigmaX, 2) / detSigma;
    const mSq = diffX * (inv11 * diffX + inv12 * diffY) + diffY * (inv12 * diffX + inv22 * diffY);
    mahalanobisDist = Math.sqrt(Math.max(0, mSq));
  }

  const svgWidth = SVG_WIDTH;
  const svgHeight = SVG_HEIGHT;
  const rangeCoord = RANGE_COORD;

  // Generate isodistance contour points centered at p1 with radius = distance
  const contourPath = useMemo(() => {
    const points: string[] = [];
    const steps = 120;
    const r =
      selectedMetric === "manhattan"
        ? manhattanDist
        : selectedMetric === "chebyshev"
          ? chebyshevDist
          : selectedMetric === "minkowski"
            ? minkowskiDist
            : euclideanDist;

    if (r <= 0.001) return "";

    if (selectedMetric === "manhattan") {
      // Diamond
      const pTop = `${toSvgX(p1.x)},${toSvgY(p1.y + r)}`;
      const pRight = `${toSvgX(p1.x + r)},${toSvgY(p1.y)}`;
      const pBottom = `${toSvgX(p1.x)},${toSvgY(p1.y - r)}`;
      const pLeft = `${toSvgX(p1.x - r)},${toSvgY(p1.y)}`;
      return `M ${pTop} L ${pRight} L ${pBottom} L ${pLeft} Z`;
    }

    if (selectedMetric === "chebyshev") {
      // Square
      const x1 = toSvgX(p1.x - r);
      const x2 = toSvgX(p1.x + r);
      const y1 = toSvgY(p1.y + r);
      const y2 = toSvgY(p1.y - r);
      return `M ${x1},${y1} L ${x2},${y1} L ${x2},${y2} L ${x1},${y2} Z`;
    }

    if (selectedMetric === "minkowski") {
      // Superellipse
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * 2 * Math.PI;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const sgnCos = Math.sign(cosT);
        const sgnSin = Math.sign(sinT);
        const absCos = Math.abs(cosT);
        const absSin = Math.abs(sinT);

        const rad =
          r / Math.pow(Math.pow(absCos, minkowskiP) + Math.pow(absSin, minkowskiP), 1 / minkowskiP);
        const px = p1.x + rad * cosT;
        const py = p1.y + rad * sinT;
        points.push(`${i === 0 ? "M" : "L"} ${toSvgX(px)},${toSvgY(py)}`);
      }
      points.push("Z");
      return points.join(" ");
    }

    if (selectedMetric === "mahalanobis") {
      // Ellipse centered at p1
      // Eigenvalues and eigenvectors of 2x2 covariance
      const a = Math.pow(sigmaX, 2);
      const c = Math.pow(sigmaY, 2);
      const b = rho * sigmaX * sigmaY;
      const trace = a + c;
      const diff = a - c;
      const disc = Math.sqrt(diff * diff + 4 * b * b);
      const lambda1 = (trace + disc) / 2;
      const lambda2 = (trace - disc) / 2;
      const angle = (Math.atan2(2 * b, diff) / 2) * (180 / Math.PI);

      const rM = mahalanobisDist;
      const rx = rM * Math.sqrt(Math.max(0.01, lambda1));
      const ry = rM * Math.sqrt(Math.max(0.01, lambda2));

      // Return ellipse parameters
      return { rx, ry, angle };
    }

    // Default Euclidean circle
    return "";
  }, [
    selectedMetric,
    p1,
    manhattanDist,
    chebyshevDist,
    minkowskiDist,
    euclideanDist,
    minkowskiP,
    mahalanobisDist,
    sigmaX,
    sigmaY,
    rho,
  ]);

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-teal" />
            <h4 className="font-bold text-sm text-foreground">
              Interactive Distance Metric &amp; Geometry Explorer
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visualize metric unit isodistance contours, taxicab grids, angular divergence, and
            covariance deformation in ℝ².
          </p>
        </div>

        <div className="flex flex-wrap gap-1 bg-muted/40 p-1 rounded-sm border border-border">
          {(
            [
              ["euclidean", "Euclidean (L₂)"],
              ["manhattan", "Manhattan (L₁)"],
              ["minkowski", "Minkowski (L_p)"],
              ["chebyshev", "Chebyshev (L_∞)"],
              ["cosine", "Cosine Distance"],
              ["mahalanobis", "Mahalanobis"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
                selectedMetric === key
                  ? "bg-navy text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Point Presets & Coordinate Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 border border-border p-4 rounded-sm">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-teal" />
            Coordinate Presets (Deterministic Benchmark Points):
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => applyPreset("benchmark_p1_p2")}
              className="text-xs px-2 py-1 rounded-xs border border-border bg-background hover:bg-muted/50 text-foreground"
            >
              P₁ &amp; P₂ ((1,2) &rarr; (2,3))
            </button>
            <button
              onClick={() => applyPreset("benchmark_p1_p3")}
              className="text-xs px-2 py-1 rounded-xs border border-border bg-background hover:bg-muted/50 text-foreground"
            >
              P₁ &amp; P₃ ((1,2) &rarr; (6,5))
            </button>
            <button
              onClick={() => applyPreset("benchmark_p1_p4")}
              className="text-xs px-2 py-1 rounded-xs border border-border bg-background hover:bg-muted/50 text-foreground"
            >
              P₁ &amp; P₄ ((1,2) &rarr; (7,6))
            </button>
            <button
              onClick={() => applyPreset("orthogonal")}
              className="text-xs px-2 py-1 rounded-xs border border-border bg-background hover:bg-muted/50 text-foreground"
            >
              Orthogonal ((3,0) &rarr; (0,3))
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-muted-foreground font-medium">Point P₁ (x₁, y₁):</label>
            <div className="flex gap-1.5 font-mono">
              <input
                type="number"
                value={p1.x}
                onChange={(e) => setP1({ ...p1, x: parseFloat(e.target.value) || 0 })}
                className="w-full border border-border bg-background px-2 py-1 rounded-xs text-xs"
                step="0.5"
              />
              <input
                type="number"
                value={p1.y}
                onChange={(e) => setP1({ ...p1, y: parseFloat(e.target.value) || 0 })}
                className="w-full border border-border bg-background px-2 py-1 rounded-xs text-xs"
                step="0.5"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-muted-foreground font-medium">Point P₂ (x₂, y₂):</label>
            <div className="flex gap-1.5 font-mono">
              <input
                type="number"
                value={p2.x}
                onChange={(e) => setP2({ ...p2, x: parseFloat(e.target.value) || 0 })}
                className="w-full border border-border bg-background px-2 py-1 rounded-xs text-xs"
                step="0.5"
              />
              <input
                type="number"
                value={p2.y}
                onChange={(e) => setP2({ ...p2, y: parseFloat(e.target.value) || 0 })}
                className="w-full border border-border bg-background px-2 py-1 rounded-xs text-xs"
                step="0.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Sliders for Minkowski / Mahalanobis */}
      {selectedMetric === "minkowski" && (
        <div className="bg-teal/5 border border-teal/20 p-3 rounded-sm space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground">
              Minkowski Norm Order (p-exponent):
            </span>
            <span className="font-mono font-bold text-teal">
              p = {minkowskiP.toFixed(1)}{" "}
              {minkowskiP < 1
                ? "(Quasi-metric: Non-convex!)"
                : minkowskiP === 1
                  ? "(Manhattan L₁)"
                  : minkowskiP === 2
                    ? "(Euclidean L₂)"
                    : minkowskiP >= 8
                      ? "(Approaching Chebyshev L_∞)"
                      : ""}
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.1"
            value={minkowskiP}
            onChange={(e) => setMinkowskiP(parseFloat(e.target.value))}
            className="w-full accent-teal cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
            <span>p=0.5 (Non-metric star)</span>
            <span>p=1 (Diamond)</span>
            <span>p=2 (Circle)</span>
            <span>p=10 (Square)</span>
          </div>
        </div>
      )}

      {selectedMetric === "mahalanobis" && (
        <div className="bg-navy/5 border border-navy/20 p-3 rounded-sm space-y-3">
          <span className="text-xs font-semibold text-foreground block">
            Covariance Matrix Parameters (Deforms Metric Space):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Correlation (&rho;):</span>
                <span className="font-mono font-bold text-navy">{rho.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-0.9"
                max="0.9"
                step="0.05"
                value={rho}
                onChange={(e) => setRho(parseFloat(e.target.value))}
                className="w-full accent-navy cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Variance X (&sigma;<sub>x</sub>):
                </span>
                <span className="font-mono font-bold text-navy">{sigmaX.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.5"
                value={sigmaX}
                onChange={(e) => setSigmaX(parseFloat(e.target.value))}
                className="w-full accent-navy cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Variance Y (&sigma;<sub>y</sub>):
                </span>
                <span className="font-mono font-bold text-navy">{sigmaY.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.5"
                value={sigmaY}
                onChange={(e) => setSigmaY(parseFloat(e.target.value))}
                className="w-full accent-navy cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Display: Visual Geometry + Calculation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SVG Canvas (5 Cols) */}
        <div className="lg:col-span-5 border border-border rounded-sm p-2 bg-background flex flex-col items-center">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-[340px] aspect-[340/280] select-none overflow-hidden"
          >
            {/* Coordinate Grid Lines */}
            {[-2, 0, 2, 4, 6, 8].map((cVal) => (
              <g key={`grid-${cVal}`}>
                {/* Vertical */}
                <line
                  x1={toSvgX(cVal)}
                  y1={0}
                  x2={toSvgX(cVal)}
                  y2={svgHeight}
                  stroke="currentColor"
                  className={
                    cVal === 0 ? "text-foreground/40 stroke-[1.5]" : "text-border/60 stroke-[0.75]"
                  }
                  strokeDasharray={cVal === 0 ? undefined : "3 3"}
                />
                {/* Horizontal */}
                <line
                  x1={0}
                  y1={toSvgY(cVal)}
                  x2={svgWidth}
                  y2={toSvgY(cVal)}
                  stroke="currentColor"
                  className={
                    cVal === 0 ? "text-foreground/40 stroke-[1.5]" : "text-border/60 stroke-[0.75]"
                  }
                  strokeDasharray={cVal === 0 ? undefined : "3 3"}
                />
                <text
                  x={toSvgX(cVal) + 2}
                  y={toSvgY(0) - 3}
                  className="fill-muted-foreground text-[8px] font-mono"
                >
                  {cVal}
                </text>
                {cVal !== 0 && (
                  <text
                    x={toSvgX(0) + 3}
                    y={toSvgY(cVal) - 2}
                    className="fill-muted-foreground text-[8px] font-mono"
                  >
                    {cVal}
                  </text>
                )}
              </g>
            ))}

            {/* Isodistance Contour Path */}
            {selectedMetric === "euclidean" && (
              <circle
                cx={toSvgX(p1.x)}
                cy={toSvgY(p1.y)}
                r={(euclideanDist / rangeCoord) * svgWidth}
                fill="none"
                className="stroke-teal/40 stroke-[1.5]"
                strokeDasharray="4 3"
              />
            )}

            {selectedMetric === "manhattan" && typeof contourPath === "string" && (
              <path
                d={contourPath}
                fill="none"
                className="stroke-teal/40 stroke-[1.5]"
                strokeDasharray="4 3"
              />
            )}

            {selectedMetric === "chebyshev" && typeof contourPath === "string" && (
              <path
                d={contourPath}
                fill="none"
                className="stroke-teal/40 stroke-[1.5]"
                strokeDasharray="4 3"
              />
            )}

            {selectedMetric === "minkowski" && typeof contourPath === "string" && (
              <path
                d={contourPath}
                fill="none"
                className="stroke-teal/40 stroke-[1.5]"
                strokeDasharray="4 3"
              />
            )}

            {selectedMetric === "mahalanobis" && typeof contourPath === "object" && contourPath && (
              <g
                transform={`translate(${toSvgX(p1.x)}, ${toSvgY(p1.y)}) rotate(${-contourPath.angle})`}
              >
                <ellipse
                  cx={0}
                  cy={0}
                  rx={(contourPath.rx / rangeCoord) * svgWidth}
                  ry={(contourPath.ry / rangeCoord) * svgHeight}
                  fill="none"
                  className="stroke-navy/50 stroke-[1.5]"
                  strokeDasharray="4 3"
                />
              </g>
            )}

            {/* Path Representations between P1 and P2 */}
            {selectedMetric === "manhattan" ? (
              // Taxicab Grid Path
              <path
                d={`M ${toSvgX(p1.x)},${toSvgY(p1.y)} L ${toSvgX(p2.x)},${toSvgY(p1.y)} L ${toSvgX(p2.x)},${toSvgY(p2.y)}`}
                fill="none"
                className="stroke-teal stroke-2"
                strokeDasharray="4 2"
              />
            ) : selectedMetric === "cosine" ? (
              // Vector Rays from Origin (0,0)
              <g>
                <line
                  x1={toSvgX(0)}
                  y1={toSvgY(0)}
                  x2={toSvgX(p1.x)}
                  y2={toSvgY(p1.y)}
                  className="stroke-navy stroke-[1.5]"
                />
                <line
                  x1={toSvgX(0)}
                  y1={toSvgY(0)}
                  x2={toSvgX(p2.x)}
                  y2={toSvgY(p2.y)}
                  className="stroke-teal stroke-[1.5]"
                />
                <line
                  x1={toSvgX(p1.x)}
                  y1={toSvgY(p1.y)}
                  x2={toSvgX(p2.x)}
                  y2={toSvgY(p2.y)}
                  className="stroke-muted-foreground/40 stroke-1 stroke-dashed"
                />
              </g>
            ) : (
              // Direct Euclidean line segment
              <line
                x1={toSvgX(p1.x)}
                y1={toSvgY(p1.y)}
                x2={toSvgX(p2.x)}
                y2={toSvgY(p2.y)}
                className="stroke-teal stroke-2"
              />
            )}

            {/* Point P1 */}
            <circle
              cx={toSvgX(p1.x)}
              cy={toSvgY(p1.y)}
              r={5}
              className="fill-navy stroke-background stroke-2"
            />
            <text
              x={toSvgX(p1.x) - 14}
              y={toSvgY(p1.y) - 8}
              className="fill-foreground font-bold text-[10px] font-mono"
            >
              P₁({p1.x},{p1.y})
            </text>

            {/* Point P2 */}
            <circle
              cx={toSvgX(p2.x)}
              cy={toSvgY(p2.y)}
              r={5}
              className="fill-teal stroke-background stroke-2"
            />
            <text
              x={toSvgX(p2.x) + 7}
              y={toSvgY(p2.y) + 4}
              className="fill-foreground font-bold text-[10px] font-mono"
            >
              P₂({p2.x},{p2.y})
            </text>
          </svg>

          <span className="text-[11px] text-muted-foreground text-center mt-2">
            Dashed boundary shows the isodistance locus (unit norm ball) around P₁.
          </span>
        </div>

        {/* Analytical Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Metric Name & Distance Output */}
          <div className="border border-border rounded-sm p-4 bg-background space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                Calculated Distance
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-xs bg-teal/10 text-teal border border-teal/20">
                {selectedMetric === "euclidean" && "L₂ Norm"}
                {selectedMetric === "manhattan" && "L₁ Norm (Taxicab / Cityblock)"}
                {selectedMetric === "minkowski" && `L_{${minkowskiP.toFixed(1)}} Norm`}
                {selectedMetric === "chebyshev" && "L_∞ Norm (Chebyshev / Maximum)"}
                {selectedMetric === "cosine" && "Angular Dissimilarity (1 - cos θ)"}
                {selectedMetric === "mahalanobis" && "Covariance-Standardized Distance"}
              </span>
            </div>

            <div className="text-2xl font-bold font-mono text-navy">
              {selectedMetric === "euclidean" && euclideanDist.toFixed(4)}
              {selectedMetric === "manhattan" && manhattanDist.toFixed(4)}
              {selectedMetric === "minkowski" && minkowskiDist.toFixed(4)}
              {selectedMetric === "chebyshev" && chebyshevDist.toFixed(4)}
              {selectedMetric === "cosine" && cosineDist.toFixed(6)}
              {selectedMetric === "mahalanobis" && mahalanobisDist.toFixed(4)}
            </div>

            {selectedMetric === "cosine" && (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-border/60">
                <div>
                  <span className="text-muted-foreground">Cosine Similarity: </span>
                  <span className="font-bold text-foreground">{cosSim.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Angular Separation: </span>
                  <span className="font-bold text-foreground">{angleDeg.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Normalized Angular Dist: </span>
                  <span className="font-bold text-foreground">{angularDist.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Dot Product (P₁ · P₂): </span>
                  <span className="font-bold text-foreground">{dotProduct.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Mathematical Step-by-Step Substitution */}
          <div className="border border-border rounded-sm p-4 bg-muted/20 space-y-2 text-xs">
            <span className="font-bold text-foreground block">
              Mathematical Step-by-Step Breakdown:
            </span>
            {selectedMetric === "euclidean" && (
              <div className="space-y-1 font-mono text-muted-foreground">
                <p>d₂(P₁, P₂) = √[(x₂ - x₁)² + (y₂ - y₁)²]</p>
                <p>
                  = √[({p2.x} - {p1.x})² + ({p2.y} - {p1.y})²]
                </p>
                <p>
                  = √[({(p2.x - p1.x).toFixed(2)})² + ({(p2.y - p1.y).toFixed(2)})²]
                </p>
                <p>
                  = √[{Math.pow(dx, 2).toFixed(4)} + {Math.pow(dy, 2).toFixed(4)}] = √
                  {Math.pow(euclideanDist, 2).toFixed(4)} ={" "}
                  <span className="font-bold text-foreground">{euclideanDist.toFixed(4)}</span>
                </p>
              </div>
            )}

            {selectedMetric === "manhattan" && (
              <div className="space-y-1 font-mono text-muted-foreground">
                <p>d₁(P₁, P₂) = |x₂ - x₁| + |y₂ - y₁|</p>
                <p>
                  = |{p2.x} - {p1.x}| + |{p2.y} - {p1.y}|
                </p>
                <p>
                  = {dx.toFixed(2)} + {dy.toFixed(2)} ={" "}
                  <span className="font-bold text-foreground">{manhattanDist.toFixed(4)}</span>
                </p>
                <p className="text-[11px] text-teal font-sans pt-1">
                  Notice: d₁(P₁, P₂) is always &ge; d₂(P₁, P₂). The taxicab path traverses grid axes
                  rather than diagonal Euclidean shortcuts.
                </p>
              </div>
            )}

            {selectedMetric === "minkowski" && (
              <div className="space-y-1 font-mono text-muted-foreground">
                <p>d_p(P₁, P₂) = (|x₂ - x₁|^p + |y₂ - y₁|^p)^(1/p)</p>
                <p>
                  = ({dx.toFixed(2)}^{minkowskiP.toFixed(1)} + {dy.toFixed(2)}^
                  {minkowskiP.toFixed(1)})^(1/{minkowskiP.toFixed(1)})
                </p>
                <p>
                  = ({Math.pow(dx, minkowskiP).toFixed(4)} + {Math.pow(dy, minkowskiP).toFixed(4)}
                  )^({(1 / minkowskiP).toFixed(4)}) ={" "}
                  <span className="font-bold text-foreground">{minkowskiDist.toFixed(4)}</span>
                </p>
                {minkowskiP < 1 && (
                  <p className="text-[11px] text-destructive font-sans pt-1 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    Warning: When p &lt; 1, the unit ball is non-convex and the triangle inequality
                    is violated (quasi-metric).
                  </p>
                )}
              </div>
            )}

            {selectedMetric === "chebyshev" && (
              <div className="space-y-1 font-mono text-muted-foreground">
                <p>d_∞(P₁, P₂) = max(|x₂ - x₁|, |y₂ - y₁|)</p>
                <p>
                  = max(|{p2.x} - {p1.x}|, |{p2.y} - {p1.y}|)
                </p>
                <p>
                  = max({dx.toFixed(2)}, {dy.toFixed(2)}) ={" "}
                  <span className="font-bold text-foreground">{chebyshevDist.toFixed(4)}</span>
                </p>
                <p className="text-[11px] text-teal font-sans pt-1">
                  Corresponds to the number of king moves on a chessboard. Isodistance contours form
                  perfect squares aligned with the coordinate axes.
                </p>
              </div>
            )}

            {selectedMetric === "cosine" && (
              <div className="space-y-1 font-mono text-muted-foreground">
                <p>cos(θ) = (P₁ · P₂) / (||P₁|| · ||P₂||)</p>
                <p>
                  = ({p1.x}·{p2.x} + {p1.y}·{p2.y}) / [√({p1.x}² + {p1.y}²) · √({p2.x}² + {p2.y}²)]
                </p>
                <p>
                  = {dotProduct.toFixed(2)} / [{norm1.toFixed(4)} · {norm2.toFixed(4)}] ={" "}
                  {cosSim.toFixed(4)}
                </p>
                <p>
                  d_cos = 1 - cos(θ) = 1 - {cosSim.toFixed(4)} ={" "}
                  <span className="font-bold text-foreground">{cosineDist.toFixed(6)}</span>
                </p>
                <p className="text-[11px] text-destructive font-sans pt-1 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Note: Cosine distance is NOT a strict metric because it violates the triangle
                  inequality. The normalized angular distance &theta;/&pi; is a proper metric.
                </p>
              </div>
            )}

            {selectedMetric === "mahalanobis" && (
              <div className="space-y-1 font-mono text-muted-foreground">
                <p>d_M(P₁, P₂) = √[(P₂ - P₁)ᵀ · &Sigma;⁻¹ · (P₂ - P₁)]</p>
                <p>
                  &Sigma; = [[&sigma;_x², &rho;&sigma;_x&sigma;_y], [&rho;&sigma;_x&sigma;_y,
                  &sigma;_y²]]
                </p>
                <p>det(&Sigma;) = {detSigma.toFixed(4)}</p>
                <p>
                  d_M ={" "}
                  <span className="font-bold text-foreground">{mahalanobisDist.toFixed(4)}</span>
                </p>
                <p className="text-[11px] text-teal font-sans pt-1">
                  Mahalanobis distance accounts for variance and cross-feature covariance. If
                  &rho;=0 and &sigma;_x=&sigma;_y=1, d_M reduces to Euclidean distance d₂.
                </p>
              </div>
            )}
          </div>

          {/* Properties Summary Pill Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="border border-border p-2 rounded-xs bg-background">
              <span className="text-[10px] text-muted-foreground block">Triangle Ineq.</span>
              <span
                className={`font-semibold ${selectedMetric === "cosine" || (selectedMetric === "minkowski" && minkowskiP < 1) ? "text-destructive" : "text-teal"}`}
              >
                {selectedMetric === "cosine" || (selectedMetric === "minkowski" && minkowskiP < 1)
                  ? "Violated"
                  : "Satisfied"}
              </span>
            </div>
            <div className="border border-border p-2 rounded-xs bg-background">
              <span className="text-[10px] text-muted-foreground block">Rotation Invariant</span>
              <span
                className={`font-semibold ${selectedMetric === "euclidean" ? "text-teal" : "text-muted-foreground"}`}
              >
                {selectedMetric === "euclidean" ? "Yes" : "No (Axis-dep)"}
              </span>
            </div>
            <div className="border border-border p-2 rounded-xs bg-background">
              <span className="text-[10px] text-muted-foreground block">Scale Invariant</span>
              <span
                className={`font-semibold ${selectedMetric === "cosine" ? "text-teal" : "text-muted-foreground"}`}
              >
                {selectedMetric === "cosine" ? "Yes" : "No"}
              </span>
            </div>
            <div className="border border-border p-2 rounded-xs bg-background">
              <span className="text-[10px] text-muted-foreground block">Covariance Aware</span>
              <span
                className={`font-semibold ${selectedMetric === "mahalanobis" ? "text-teal" : "text-muted-foreground"}`}
              >
                {selectedMetric === "mahalanobis" ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Interactive Curse of Dimensionality & Distance Concentration Simulator */
export function CurseOfDimensionalitySimulator() {
  const [dim, setDim] = useState<number>(10);
  const [distribution, setDistribution] = useState<"uniform" | "gaussian">("uniform");

  // Precomputed or analytical Monte Carlo data across dimensions for 100 points
  const dimData: Record<
    number,
    {
      uniform: {
        mean: number;
        std: number;
        dMin: number;
        dMax: number;
        relContrast: number;
        relStd: number;
      };
      gaussian: {
        mean: number;
        std: number;
        dMin: number;
        dMax: number;
        relContrast: number;
        relStd: number;
      };
    }
  > = {
    1: {
      uniform: {
        mean: 0.3445,
        std: 0.2416,
        dMin: 0.0001,
        dMax: 0.9814,
        relContrast: 9813.0,
        relStd: 0.7012,
      },
      gaussian: {
        mean: 1.1284,
        std: 0.8412,
        dMin: 0.0012,
        dMax: 4.821,
        relContrast: 4016.5,
        relStd: 0.7455,
      },
    },
    2: {
      uniform: {
        mean: 0.5297,
        std: 0.2476,
        dMin: 0.0028,
        dMax: 1.2916,
        relContrast: 460.3,
        relStd: 0.4675,
      },
      gaussian: {
        mean: 1.7725,
        std: 0.9015,
        dMin: 0.015,
        dMax: 5.621,
        relContrast: 373.7,
        relStd: 0.5086,
      },
    },
    5: {
      uniform: {
        mean: 0.8917,
        std: 0.2555,
        dMin: 0.1365,
        dMax: 1.6888,
        relContrast: 11.37,
        relStd: 0.2865,
      },
      gaussian: {
        mean: 3.0112,
        std: 0.9321,
        dMin: 0.3512,
        dMax: 7.1205,
        relContrast: 19.28,
        relStd: 0.3095,
      },
    },
    10: {
      uniform: {
        mean: 1.2923,
        std: 0.246,
        dMin: 0.4629,
        dMax: 2.1419,
        relContrast: 3.63,
        relStd: 0.1903,
      },
      gaussian: {
        mean: 4.3541,
        std: 0.9512,
        dMin: 1.251,
        dMax: 8.4215,
        relContrast: 5.73,
        relStd: 0.2185,
      },
    },
    25: {
      uniform: {
        mean: 2.0412,
        std: 0.2431,
        dMin: 1.215,
        dMax: 2.891,
        relContrast: 1.38,
        relStd: 0.1191,
      },
      gaussian: {
        mean: 6.9632,
        std: 0.961,
        dMin: 3.421,
        dMax: 11.215,
        relContrast: 2.28,
        relStd: 0.138,
      },
    },
    50: {
      uniform: {
        mean: 2.8693,
        std: 0.24,
        dMin: 1.9161,
        dMax: 3.6336,
        relContrast: 0.896,
        relStd: 0.0836,
      },
      gaussian: {
        mean: 9.9015,
        std: 0.9712,
        dMin: 6.2105,
        dMax: 14.12,
        relContrast: 1.27,
        relStd: 0.0981,
      },
    },
    100: {
      uniform: {
        mean: 4.0673,
        std: 0.2464,
        dMin: 3.2302,
        dMax: 4.9469,
        relContrast: 0.531,
        relStd: 0.0606,
      },
      gaussian: {
        mean: 14.072,
        std: 0.9805,
        dMin: 10.312,
        dMax: 18.52,
        relContrast: 0.796,
        relStd: 0.0697,
      },
    },
    200: {
      uniform: {
        mean: 5.761,
        std: 0.2421,
        dMin: 4.8912,
        dMax: 6.6421,
        relContrast: 0.358,
        relStd: 0.042,
      },
      gaussian: {
        mean: 19.951,
        std: 0.985,
        dMin: 16.12,
        dMax: 24.31,
        relContrast: 0.508,
        relStd: 0.0494,
      },
    },
    500: {
      uniform: {
        mean: 9.1075,
        std: 0.2403,
        dMin: 8.2678,
        dMax: 9.9972,
        relContrast: 0.209,
        relStd: 0.0264,
      },
      gaussian: {
        mean: 31.591,
        std: 0.9912,
        dMin: 27.21,
        dMax: 36.12,
        relContrast: 0.327,
        relStd: 0.0314,
      },
    },
  };

  const curr = dimData[dim]![distribution];

  // SVG chart configuration for distance distribution bell curve
  const chartWidth = 500;
  const chartHeight = 160;

  // Normal distribution curve points around mean and std
  const curvePoints = useMemo(() => {
    const points: string[] = [];
    const minX = Math.max(0, curr.mean - 3.5 * curr.std);
    const maxX = curr.mean + 3.5 * curr.std;
    const range = maxX - minX;

    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const xVal = minX + (i / steps) * range;
      const z = (xVal - curr.mean) / curr.std;
      const yNorm = Math.exp(-0.5 * z * z);
      const svgX = ((xVal - minX) / range) * (chartWidth - 60) + 30;
      const svgY = chartHeight - 30 - yNorm * (chartHeight - 60);
      points.push(`${i === 0 ? "M" : "L"} ${svgX.toFixed(1)},${svgY.toFixed(1)}`);
    }
    return { path: points.join(" "), minX, maxX, range };
  }, [curr, chartWidth, chartHeight]);

  const toChartX = (val: number) => {
    const clamped = Math.max(curvePoints.minX, Math.min(curvePoints.maxX, val));
    return ((clamped - curvePoints.minX) / curvePoints.range) * (chartWidth - 60) + 30;
  };

  return (
    <div className="rounded-sm border border-border bg-card p-5 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-teal" />
            <h4 className="font-bold text-sm text-foreground">
              Curse of Dimensionality: Distance Concentration Simulator
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Observe the mathematical collapse of pairwise distance contrast in high dimensions
            (Beyer et al., 1999).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Distribution:</span>
          <div className="flex gap-1 bg-muted/40 p-1 rounded-sm border border-border">
            <button
              onClick={() => setDistribution("uniform")}
              className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
                distribution === "uniform"
                  ? "bg-navy text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Uniform [0, 1]ᵈ
            </button>
            <button
              onClick={() => setDistribution("gaussian")}
              className={`px-2.5 py-1 text-xs rounded-sm transition-colors ${
                distribution === "gaussian"
                  ? "bg-navy text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Gaussian &Nu;(0, I_d)
            </button>
          </div>
        </div>
      </div>

      {/* Dimension Button Selector */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-foreground">
            Select Feature Space Dimensionality (d):
          </span>
          <span className="font-mono font-bold text-teal">d = {dim} Dimensions</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
          {[1, 2, 5, 10, 25, 50, 100, 200, 500].map((dVal) => (
            <button
              key={dVal}
              onClick={() => setDim(dVal)}
              className={`py-1.5 text-xs rounded-xs font-mono font-semibold border transition-all ${
                dim === dVal
                  ? "bg-teal text-primary-foreground border-teal shadow-xs"
                  : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              d={dVal}
            </button>
          ))}
        </div>
      </div>

      {/* Analytical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="border border-border p-3 rounded-sm bg-background space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Mean Distance (&mu;<sub>D</sub>)
          </span>
          <div className="text-lg font-bold font-mono text-foreground">{curr.mean.toFixed(4)}</div>
          <span className="text-[11px] text-muted-foreground font-mono">Scales as O(&radic;d)</span>
        </div>

        <div className="border border-border p-3 rounded-sm bg-background space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Standard Deviation (&sigma;<sub>D</sub>)
          </span>
          <div className="text-lg font-bold font-mono text-foreground">{curr.std.toFixed(4)}</div>
          <span className="text-[11px] text-muted-foreground font-mono">Remains O(1) constant</span>
        </div>

        <div className="border border-border p-3 rounded-sm bg-background space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Relative Variance (&sigma;/&mu;)
          </span>
          <div className="text-lg font-bold font-mono text-navy">{curr.relStd.toFixed(4)}</div>
          <span className="text-[11px] text-muted-foreground font-mono">
            Decays as 1/&radic;d &rarr; 0
          </span>
        </div>

        <div className="border border-border p-3 rounded-sm bg-teal/5 border-teal/30 space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal">
            Relative Contrast
          </span>
          <div className="text-lg font-bold font-mono text-teal">
            {curr.relContrast > 100
              ? `${curr.relContrast.toFixed(0)}x`
              : `${curr.relContrast.toFixed(3)}x`}
          </div>
          <span className="text-[11px] text-teal-dark dark:text-teal font-mono">
            (D_max - D_min) / D_min
          </span>
        </div>
      </div>

      {/* SVG Distance Density Plot */}
      <div className="border border-border rounded-sm p-4 bg-background space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <BarChart2 className="h-3.5 w-3.5 text-teal" />
            Empirical Pairwise Distance Probability Density:
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            D_min = {curr.dMin.toFixed(3)} | &mu; = {curr.mean.toFixed(3)} | D_max ={" "}
            {curr.dMax.toFixed(3)}
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full min-w-[420px] aspect-[500/160] select-none"
          >
            {/* Baseline X-axis */}
            <line
              x1={20}
              y1={chartHeight - 30}
              x2={chartWidth - 20}
              y2={chartHeight - 30}
              className="stroke-border stroke-1"
            />

            {/* Density Curve */}
            <path d={curvePoints.path} fill="none" className="stroke-teal stroke-2" />

            {/* D_min Marker */}
            <line
              x1={toChartX(curr.dMin)}
              y1={20}
              x2={toChartX(curr.dMin)}
              y2={chartHeight - 30}
              className="stroke-navy stroke-1 stroke-dashed"
            />
            <circle cx={toChartX(curr.dMin)} cy={chartHeight - 30} r={3.5} className="fill-navy" />
            <text
              x={toChartX(curr.dMin)}
              y={14}
              textAnchor="middle"
              className="fill-navy text-[9px] font-mono font-bold"
            >
              D_min
            </text>

            {/* Mean Marker */}
            <line
              x1={toChartX(curr.mean)}
              y1={20}
              x2={toChartX(curr.mean)}
              y2={chartHeight - 30}
              className="stroke-teal stroke-1.5 stroke-dashed"
            />
            <circle cx={toChartX(curr.mean)} cy={chartHeight - 30} r={3.5} className="fill-teal" />
            <text
              x={toChartX(curr.mean)}
              y={14}
              textAnchor="middle"
              className="fill-teal text-[9px] font-mono font-bold"
            >
              &mu; ({curr.mean.toFixed(2)})
            </text>

            {/* D_max Marker */}
            <line
              x1={toChartX(curr.dMax)}
              y1={20}
              x2={toChartX(curr.dMax)}
              y2={chartHeight - 30}
              className="stroke-navy stroke-1 stroke-dashed"
            />
            <circle cx={toChartX(curr.dMax)} cy={chartHeight - 30} r={3.5} className="fill-navy" />
            <text
              x={toChartX(curr.dMax)}
              y={14}
              textAnchor="middle"
              className="fill-navy text-[9px] font-mono font-bold"
            >
              D_max
            </text>
          </svg>
        </div>

        <div className="p-3 bg-muted/20 border border-border/80 rounded-xs text-xs space-y-1.5">
          <p className="font-semibold text-foreground">
            Beyer et al. (1999) Distance Concentration Phenomenon:
          </p>
          <p className="text-muted-foreground leading-relaxed">
            In {dim}-dimensional space, relative distance contrast is{" "}
            <span className="font-mono font-bold text-foreground">
              {curr.relContrast.toFixed(3)}
            </span>
            . As dimensionality d &rarr; &infin;, the ratio &sigma;<sub>D</sub> / &mu;<sub>D</sub>{" "}
            converges to 0 because the mean distance expands as &radic;d while the standard
            deviation remains strictly constant O(1). Consequently, the nearest neighbor distance
            D_min and farthest neighbor distance D_max converge, rendering distance-based clustering
            criteria (such as Single and Complete linkage) completely indiscriminate.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Module 07 Knowledge Check Quiz */
export function Module07Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const questions = [
    {
      id: 1,
      question:
        "Why is standard Cosine Distance, defined as d_cos(u, v) = 1 - cos(u, v), formally classified as a semi-metric / dissimilarity rather than a strict metric?",
      options: [
        "It can yield negative distance values when vectors point in opposite directions.",
        "It violates the triangle inequality: d_cos(u, w) can exceed d_cos(u, v) + d_cos(v, w).",
        "It violates the symmetry axiom: d_cos(u, v) ≠ d_cos(v, u).",
        "It fails identity of indiscernibles because orthogonal vectors produce zero distance.",
      ],
      correct: 1,
      explanation:
        "Cosine distance violates the triangle inequality! For example, if vector u is at 0°, v is at 60°, and w is at 120°, d_cos(u, v) = 1 - 0.5 = 0.5, d_cos(v, w) = 0.5, but d_cos(u, w) = 1 - (-0.5) = 1.5, which is strictly greater than 0.5 + 0.5 = 1.0! The normalized angular distance (arccos(cos θ) / π) restores the triangle inequality and is a strict metric.",
    },
    {
      id: 2,
      question:
        "What happens to the unit ball and metric axioms when the Minkowski parameter p is set to a fractional value p < 1 (e.g., p = 0.5)?",
      options: [
        "The unit ball becomes a non-convex star shape, and the triangle inequality fails, making it a quasi-metric.",
        "The unit ball becomes a perfect square, identical to the Chebyshev L_∞ norm.",
        "The distance function satisfies all metric axioms but becomes computationally intractable.",
        "The distance between identical points becomes strictly positive.",
      ],
      correct: 0,
      explanation:
        "When p < 1, the unit ball {x : ||x||_p ≤ 1} becomes non-convex (inward-curving star shape). By functional analysis, any norm must produce a convex unit ball; hence for p < 1, the triangle inequality is violated and L_p becomes a non-metric / quasi-metric.",
    },
    {
      id: 3,
      question:
        "Under what mathematical condition does the Mahalanobis distance d_M(u, v) = √[(u - v)ᵀ Σ⁻¹ (u - v)] reduce exactly to the standard Euclidean distance d₂(u, v)?",
      options: [
        "When the features have unequal variances but zero cross-feature correlation.",
        "When the covariance matrix Σ is an arbitrary diagonal matrix.",
        "When the covariance matrix Σ is the identity matrix I (or spherical covariance σ²I with scale normalization).",
        "When all data points lie along the principal diagonal axis.",
      ],
      correct: 2,
      explanation:
        "When Σ = I, Σ⁻¹ = I, so (u - v)ᵀ I (u - v) = (u - v)ᵀ(u - v) = ||u - v||₂², which is precisely the squared Euclidean distance. Mahalanobis distance generalizes Euclidean distance by rotating and scaling the coordinate system according to the data's covariance structure.",
    },
    {
      id: 4,
      question:
        "According to the distance concentration theorem (Beyer et al., 1999), why do hierarchical clustering algorithms fail in very high dimensions (d > 100) without dimensionality reduction?",
      options: [
        "Because floating-point underflow causes all distances to be rounded to zero.",
        "Because the relative contrast (D_max - D_min) / D_min converges to 0, making all points appear equidistant.",
        "Because the Lance–Williams recurrence parameters become mathematically undefined in d > 100.",
        "Because the time complexity of distance calculation shifts from O(N²) to O(2^d).",
      ],
      correct: 1,
      explanation:
        "Beyer et al. proved that as dimensionality d → ∞ under mild conditions, (D_max - D_min) / D_min → 0. Because all pairwise distances converge to the same value, nearest-neighbor concepts become meaningless, causing Single Linkage to chain indiscriminately and Complete Linkage to form arbitrary, unstable clusters.",
    },
    {
      id: 5,
      question:
        "Why is Ward's minimum variance linkage mathematically invalid when applied to a precomputed non-Euclidean dissimilarity matrix (such as Gower or Jaccard dissimilarity)?",
      options: [
        "Ward's criterion relies on Huygens' theorem of variance decomposition (SS_total = SS_between + SS_within), which holds only in Euclidean metric space.",
        "SciPy raises a syntax error whenever a non-Euclidean matrix is passed to linkage.",
        "Non-Euclidean dissimilarity matrices cannot be converted to condensed 1D vectors with squareform.",
        "Non-Euclidean metrics prevent dendrograms from displaying branch labels.",
      ],
      correct: 0,
      explanation:
        "Ward's objective function explicitly minimizes the increase in within-cluster sum of squares (ESS). This formulation depends directly on the Huygens decomposition of variance, which is strictly valid only when distance is Euclidean. Applying Ward's Lance–Williams recurrence to non-Euclidean dissimilarity can cause negative branch lengths (inversions) and produces meaningless variance estimates. For non-Euclidean metrics, Average Linkage (UPGMA) or Complete Linkage should be used.",
    },
    {
      id: 6,
      question:
        "How does Gower's general dissimilarity coefficient (1971) handle datasets containing both continuous numeric variables and nominal categorical variables?",
      options: [
        "It forces all categorical variables to be converted to continuous values using PCA.",
        "It computes partial dissimilarities feature-by-feature—scaling continuous features by range and scoring nominal matches as 0 and mismatches as 1—then takes a weighted average.",
        "It computes Euclidean distance on the continuous columns and ignores all categorical columns.",
        "It transforms the distance matrix into an ultrametric before applying single linkage.",
      ],
      correct: 1,
      explanation:
        "Gower's dissimilarity computes a per-feature score: for continuous attributes, the absolute difference normalized by the feature's range (|x_ik - x_jk| / R_k); for nominal/binary attributes, 0 if values match and 1 if they differ. The overall dissimilarity is the weighted mean of these attribute dissimilarities, neatly handling mixed tabular schemas without arbitrary numeric encoding.",
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
            Module 07 Knowledge Check: Distance Metrics &amp; Dimensionality
          </h4>
          <p className="text-xs text-muted-foreground">
            Evaluate your understanding of metric space axioms, Lp norm balls, angular cosine
            distance, Mahalanobis covariance, and high-dimensional distance concentration.
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
