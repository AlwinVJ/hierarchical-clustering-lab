import { FC } from "react";

/**
 * 1. M01 Diagram: Flat Partition vs. Nested Hierarchical Partition
 */
export const FlatVsNestedDiagram: FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="my-6 rounded-sm border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2 font-mono">
        <span className="font-semibold text-foreground">Spatial Partitioning Paradigms</span>
        <span>Flat vs. Nested Hierarchy</span>
      </div>
      <svg
        viewBox="0 0 680 260"
        className="w-full h-auto bg-background rounded-sm border border-border"
      >
        {/* Left Side: Flat Partition */}
        <g transform="translate(10, 10)">
          <rect
            width="320"
            height="240"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="160"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Flat Partition (e.g. K-Means, k = 3)
          </text>
          <text
            x="160"
            y="40"
            textAnchor="middle"
            className="text-[10px] fill-muted-foreground font-mono"
          >
            Single rigid division | No sub-cluster awareness
          </text>

          {/* Voronoi partition boundaries */}
          <line
            x1="160"
            y1="50"
            x2="160"
            y2="150"
            stroke="#94a3b8"
            strokeDasharray="3 3"
            strokeWidth="1.5"
          />
          <line
            x1="160"
            y1="150"
            x2="40"
            y2="230"
            stroke="#94a3b8"
            strokeDasharray="3 3"
            strokeWidth="1.5"
          />
          <line
            x1="160"
            y1="150"
            x2="280"
            y2="230"
            stroke="#94a3b8"
            strokeDasharray="3 3"
            strokeWidth="1.5"
          />

          {/* Cluster 1 Points (Navy) */}
          <circle cx="100" cy="90" r="5" fill="#1e3a8a" />
          <circle cx="120" cy="110" r="5" fill="#1e3a8a" />
          <circle cx="80" cy="115" r="5" fill="#1e3a8a" />
          <circle cx="105" cy="130" r="5" fill="#1e3a8a" />
          <text
            x="100"
            y="70"
            textAnchor="middle"
            className="text-[10px] font-bold fill-navy font-mono"
          >
            Region C₁
          </text>

          {/* Cluster 2 Points (Teal) */}
          <circle cx="220" cy="90" r="5" fill="#0d9488" />
          <circle cx="240" cy="110" r="5" fill="#0d9488" />
          <circle cx="200" cy="115" r="5" fill="#0d9488" />
          <circle cx="225" cy="130" r="5" fill="#0d9488" />
          <text
            x="220"
            y="70"
            textAnchor="middle"
            className="text-[10px] font-bold fill-teal font-mono"
          >
            Region C₂
          </text>

          {/* Cluster 3 Points (Amber) */}
          <circle cx="140" cy="190" r="5" fill="#b45309" />
          <circle cx="160" cy="205" r="5" fill="#b45309" />
          <circle cx="180" cy="190" r="5" fill="#b45309" />
          <text
            x="160"
            y="225"
            textAnchor="middle"
            className="text-[10px] font-bold fill-amber-600 font-mono"
          >
            Region C₃
          </text>
        </g>

        {/* Right Side: Nested Hierarchical Partition */}
        <g transform="translate(350, 10)">
          <rect
            width="320"
            height="240"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="160"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Nested Hierarchy (Agglomerative / Divisive)
          </text>
          <text
            x="160"
            y="40"
            textAnchor="middle"
            className="text-[10px] fill-muted-foreground font-mono"
          >
            Multi-scale taxonomy: P₀ ≺ P₁ ≺ P₂ ≺ P_root
          </text>

          {/* Outer Global Envelope (Root Cluster) */}
          <ellipse
            cx="160"
            cy="145"
            rx="145"
            ry="90"
            fill="transparent"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x="160"
            y="230"
            textAnchor="middle"
            className="text-[9px] font-mono fill-muted-foreground"
          >
            Root Partition: P_root = &#123;All Observations&#125;
          </text>

          {/* Intermediate Macro Cluster A (Left Macro) */}
          <ellipse
            cx="105"
            cy="115"
            rx="55"
            ry="45"
            fill="#1e3a8a"
            fillOpacity="0.08"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          />
          <text
            x="105"
            y="62"
            textAnchor="middle"
            className="text-[10px] font-bold fill-navy font-mono"
          >
            Macro-Cluster A
          </text>

          {/* Inner Micro Sub-Clusters */}
          <ellipse
            cx="90"
            cy="100"
            rx="25"
            ry="20"
            fill="#1e3a8a"
            fillOpacity="0.15"
            stroke="#1e3a8a"
            strokeWidth="1"
          />
          <circle cx="85" cy="98" r="4" fill="#1e3a8a" />
          <circle cx="95" cy="103" r="4" fill="#1e3a8a" />

          <ellipse
            cx="120"
            cy="130"
            rx="22"
            ry="18"
            fill="#1e3a8a"
            fillOpacity="0.15"
            stroke="#1e3a8a"
            strokeWidth="1"
          />
          <circle cx="118" cy="128" r="4" fill="#1e3a8a" />
          <circle cx="125" cy="133" r="4" fill="#1e3a8a" />

          {/* Intermediate Macro Cluster B (Right Macro) */}
          <ellipse
            cx="220"
            cy="115"
            rx="55"
            ry="45"
            fill="#0d9488"
            fillOpacity="0.08"
            stroke="#0d9488"
            strokeWidth="1.5"
          />
          <text
            x="220"
            y="62"
            textAnchor="middle"
            className="text-[10px] font-bold fill-teal font-mono"
          >
            Macro-Cluster B
          </text>

          <ellipse
            cx="210"
            cy="100"
            rx="25"
            ry="20"
            fill="#0d9488"
            fillOpacity="0.15"
            stroke="#0d9488"
            strokeWidth="1"
          />
          <circle cx="205" cy="98" r="4" fill="#0d9488" />
          <circle cx="215" cy="103" r="4" fill="#0d9488" />

          <ellipse
            cx="235"
            cy="130"
            rx="22"
            ry="18"
            fill="#0d9488"
            fillOpacity="0.15"
            stroke="#0d9488"
            strokeWidth="1"
          />
          <circle cx="230" cy="128" r="4" fill="#0d9488" />
          <circle cx="240" cy="133" r="4" fill="#0d9488" />
        </g>
      </svg>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {label ??
          "Feature space partitioning and cluster boundary geometries: flat partition vs nested multi-scale hierarchy."}
      </p>
    </div>
  );
};

/**
 * 2. M02 Diagram: Continuous Feature Space Cuts vs. Dendrogram
 */
export const ContinuousCloudCutDiagram: FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="my-6 rounded-sm border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2 font-mono">
        <span className="font-semibold text-foreground">Multi-Threshold Feature Slicing</span>
        <span>2D Manifold Space ↔ Dendrogram Heights</span>
      </div>
      <svg
        viewBox="0 0 680 260"
        className="w-full h-auto bg-background rounded-sm border border-border"
      >
        {/* Left Side: 2D Feature Space with Slicing Contours */}
        <g transform="translate(15, 15)">
          <rect
            width="310"
            height="230"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="155"
            y="20"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            2D Observation Space &amp; Coalescence
          </text>

          {/* Cut 3: Global envelope (Height h3) */}
          <ellipse
            cx="155"
            cy="130"
            rx="135"
            ry="80"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text x="260" y="60" className="text-[10px] font-mono font-bold fill-red-500">
            Cut h₃ (k=1)
          </text>

          {/* Cut 2: Intermediate Clusters (Height h2) */}
          <ellipse
            cx="95"
            cy="130"
            rx="65"
            ry="60"
            fill="#1e3a8a"
            fillOpacity="0.06"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <ellipse
            cx="215"
            cy="130"
            rx="65"
            ry="60"
            fill="#0d9488"
            fillOpacity="0.06"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <text
            x="155"
            y="80"
            textAnchor="middle"
            className="text-[10px] font-mono font-bold fill-amber-500"
          >
            Cut h₂ (k=2)
          </text>

          {/* Cut 1: Sub-clusters (Height h1) */}
          <circle
            cx="75"
            cy="110"
            r="22"
            fill="#1e3a8a"
            fillOpacity="0.12"
            stroke="#10b981"
            strokeWidth="1"
          />
          <circle
            cx="115"
            cy="150"
            r="22"
            fill="#1e3a8a"
            fillOpacity="0.12"
            stroke="#10b981"
            strokeWidth="1"
          />
          <circle
            cx="195"
            cy="110"
            r="22"
            fill="#0d9488"
            fillOpacity="0.12"
            stroke="#10b981"
            strokeWidth="1"
          />
          <circle
            cx="235"
            cy="150"
            r="22"
            fill="#0d9488"
            fillOpacity="0.12"
            stroke="#10b981"
            strokeWidth="1"
          />
          <text
            x="155"
            y="215"
            textAnchor="middle"
            className="text-[10px] font-mono font-bold fill-emerald-600"
          >
            Cut h₁ (k=4)
          </text>

          {/* Observations */}
          <circle cx="75" cy="110" r="3.5" fill="#1e3a8a" />
          <circle cx="115" cy="150" r="3.5" fill="#1e3a8a" />
          <circle cx="195" cy="110" r="3.5" fill="#0d9488" />
          <circle cx="235" cy="150" r="3.5" fill="#0d9488" />
        </g>

        {/* Right Side: Matching Dendrogram with Corresponding Threshold Cutlines */}
        <g transform="translate(345, 15)">
          <rect
            width="320"
            height="230"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="160"
            y="20"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Topological Dendrogram &amp; Cut Heights
          </text>

          {/* Axis */}
          <line x1="45" y1="40" x2="45" y2="200" stroke="var(--color-border)" strokeWidth="1" />
          <line x1="45" y1="200" x2="300" y2="200" stroke="var(--color-border)" strokeWidth="1" />
          <text x="25" y="45" className="text-[9px] font-mono fill-muted-foreground">
            Height
          </text>

          {/* Leaves: P1 (80), P2 (140), P3 (200), P4 (260) */}
          <text
            x="80"
            y="215"
            textAnchor="middle"
            className="text-[10px] font-mono fill-foreground"
          >
            P₁
          </text>
          <text
            x="140"
            y="215"
            textAnchor="middle"
            className="text-[10px] font-mono fill-foreground"
          >
            P₂
          </text>
          <text
            x="200"
            y="215"
            textAnchor="middle"
            className="text-[10px] font-mono fill-foreground"
          >
            P₃
          </text>
          <text
            x="260"
            y="215"
            textAnchor="middle"
            className="text-[10px] font-mono fill-foreground"
          >
            P₄
          </text>

          {/* Merge 1: P1 + P2 at height 160 */}
          <line x1="80" y1="200" x2="80" y2="160" stroke="#1e3a8a" strokeWidth="2" />
          <line x1="140" y1="200" x2="140" y2="160" stroke="#1e3a8a" strokeWidth="2" />
          <line x1="80" y1="160" x2="140" y2="160" stroke="#1e3a8a" strokeWidth="2" />

          {/* Merge 2: P3 + P4 at height 160 */}
          <line x1="200" y1="200" x2="200" y2="160" stroke="#0d9488" strokeWidth="2" />
          <line x1="260" y1="200" x2="260" y2="160" stroke="#0d9488" strokeWidth="2" />
          <line x1="200" y1="160" x2="260" y2="160" stroke="#0d9488" strokeWidth="2" />

          {/* Root Merge: (P1,P2) + (P3,P4) at height 80 */}
          <line
            x1="110"
            y1="160"
            x2="110"
            y2="80"
            stroke="var(--color-foreground)"
            strokeWidth="2"
          />
          <line
            x1="230"
            y1="160"
            x2="230"
            y2="80"
            stroke="var(--color-foreground)"
            strokeWidth="2"
          />
          <line
            x1="110"
            y1="80"
            x2="230"
            y2="80"
            stroke="var(--color-foreground)"
            strokeWidth="2"
          />

          {/* Horizontal Cut Lines */}
          {/* Cut 3: Above root */}
          <line
            x1="45"
            y1="60"
            x2="300"
            y2="60"
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text x="305" y="64" className="text-[9px] font-mono font-bold fill-red-500">
            t = h₃
          </text>

          {/* Cut 2: Between root and sub-clusters */}
          <line
            x1="45"
            y1="120"
            x2="300"
            y2="120"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text x="305" y="124" className="text-[9px] font-mono font-bold fill-amber-500">
            t = h₂
          </text>

          {/* Cut 1: Below sub-clusters */}
          <line
            x1="45"
            y1="180"
            x2="300"
            y2="180"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text x="305" y="184" className="text-[9px] font-mono font-bold fill-emerald-600">
            t = h₁
          </text>
        </g>
      </svg>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {label ??
          "Decomposition of continuous feature space into nested hierarchical partitions: spatial density contours match horizontal dendrogram slicing heights exactly."}
      </p>
    </div>
  );
};

/**
 * 3. M02 Diagram: Inter-Cluster Distance Definitions
 */
export const LinkageDistanceGeometryDiagram: FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="my-6 rounded-sm border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2 font-mono">
        <span className="font-semibold text-foreground">Geometric Linkage Formulations</span>
        <span>Dissimilarity Between Composite Clusters</span>
      </div>
      <svg
        viewBox="0 0 680 260"
        className="w-full h-auto bg-background rounded-sm border border-border"
      >
        {/* Sub-panel 1: Single Linkage */}
        <g transform="translate(10, 10)">
          <rect
            width="155"
            height="240"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="77"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Single Linkage
          </text>
          <text x="77" y="38" textAnchor="middle" className="text-[9px] font-mono fill-teal">
            min d(a, b)
          </text>

          {/* Cluster A */}
          <ellipse
            cx="40"
            cy="120"
            rx="25"
            ry="40"
            fill="#1e3a8a"
            fillOpacity="0.1"
            stroke="#1e3a8a"
            strokeWidth="1"
          />
          <circle cx="35" cy="100" r="3.5" fill="#1e3a8a" />
          <circle cx="45" cy="120" r="3.5" fill="#1e3a8a" />
          <circle cx="38" cy="140" r="3.5" fill="#1e3a8a" />
          <circle cx="50" cy="115" r="4.5" fill="#1e3a8a" stroke="#fff" strokeWidth="1" />

          {/* Cluster B */}
          <ellipse
            cx="115"
            cy="120"
            rx="25"
            ry="40"
            fill="#0d9488"
            fillOpacity="0.1"
            stroke="#0d9488"
            strokeWidth="1"
          />
          <circle cx="105" cy="115" r="4.5" fill="#0d9488" stroke="#fff" strokeWidth="1" />
          <circle cx="115" cy="100" r="3.5" fill="#0d9488" />
          <circle cx="125" cy="130" r="3.5" fill="#0d9488" />
          <circle cx="112" cy="145" r="3.5" fill="#0d9488" />

          {/* Min distance arrow */}
          <line
            x1="50"
            y1="115"
            x2="105"
            y2="115"
            stroke="#ef4444"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text
            x="77"
            y="110"
            textAnchor="middle"
            className="text-[9px] font-bold fill-red-500 font-mono"
          >
            D_min
          </text>
          <text
            x="77"
            y="200"
            textAnchor="middle"
            className="text-[9px] fill-muted-foreground font-mono"
          >
            Closest pair distance
          </text>
        </g>

        {/* Sub-panel 2: Complete Linkage */}
        <g transform="translate(175, 10)">
          <rect
            width="155"
            height="240"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="77"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Complete Linkage
          </text>
          <text x="77" y="38" textAnchor="middle" className="text-[9px] font-mono fill-teal">
            max d(a, b)
          </text>

          {/* Cluster A */}
          <ellipse
            cx="40"
            cy="120"
            rx="25"
            ry="40"
            fill="#1e3a8a"
            fillOpacity="0.1"
            stroke="#1e3a8a"
            strokeWidth="1"
          />
          <circle cx="20" cy="95" r="4.5" fill="#1e3a8a" stroke="#fff" strokeWidth="1" />
          <circle cx="45" cy="120" r="3.5" fill="#1e3a8a" />
          <circle cx="38" cy="140" r="3.5" fill="#1e3a8a" />

          {/* Cluster B */}
          <ellipse
            cx="115"
            cy="120"
            rx="25"
            ry="40"
            fill="#0d9488"
            fillOpacity="0.1"
            stroke="#0d9488"
            strokeWidth="1"
          />
          <circle cx="105" cy="115" r="3.5" fill="#0d9488" />
          <circle cx="115" cy="100" r="3.5" fill="#0d9488" />
          <circle cx="135" cy="145" r="4.5" fill="#0d9488" stroke="#fff" strokeWidth="1" />

          {/* Max distance arrow */}
          <line x1="20" y1="95" x2="135" y2="145" stroke="#ef4444" strokeWidth="2" />
          <text
            x="77"
            y="112"
            textAnchor="middle"
            className="text-[9px] font-bold fill-red-500 font-mono"
          >
            D_max
          </text>
          <text
            x="77"
            y="200"
            textAnchor="middle"
            className="text-[9px] fill-muted-foreground font-mono"
          >
            Furthest pair distance
          </text>
        </g>

        {/* Sub-panel 3: Average Linkage */}
        <g transform="translate(340, 10)">
          <rect
            width="155"
            height="240"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="77"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Average Linkage
          </text>
          <text x="77" y="38" textAnchor="middle" className="text-[9px] font-mono fill-teal">
            mean d(a, b)
          </text>

          {/* Cluster A */}
          <ellipse
            cx="40"
            cy="120"
            rx="25"
            ry="40"
            fill="#1e3a8a"
            fillOpacity="0.1"
            stroke="#1e3a8a"
            strokeWidth="1"
          />
          <circle cx="35" cy="105" r="3.5" fill="#1e3a8a" />
          <circle cx="45" cy="135" r="3.5" fill="#1e3a8a" />

          {/* Cluster B */}
          <ellipse
            cx="115"
            cy="120"
            rx="25"
            ry="40"
            fill="#0d9488"
            fillOpacity="0.1"
            stroke="#0d9488"
            strokeWidth="1"
          />
          <circle cx="110" cy="105" r="3.5" fill="#0d9488" />
          <circle cx="120" cy="135" r="3.5" fill="#0d9488" />

          {/* All 4 pairwise lines */}
          <line
            x1="35"
            y1="105"
            x2="110"
            y2="105"
            stroke="#94a3b8"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
          <line
            x1="35"
            y1="105"
            x2="120"
            y2="135"
            stroke="#94a3b8"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
          <line
            x1="45"
            y1="135"
            x2="110"
            y2="105"
            stroke="#94a3b8"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
          <line
            x1="45"
            y1="135"
            x2="120"
            y2="135"
            stroke="#94a3b8"
            strokeDasharray="2 2"
            strokeWidth="1"
          />

          <text
            x="77"
            y="112"
            textAnchor="middle"
            className="text-[9px] font-bold fill-amber-600 font-mono"
          >
            D_avg
          </text>
          <text
            x="77"
            y="200"
            textAnchor="middle"
            className="text-[9px] fill-muted-foreground font-mono"
          >
            All pairwise mean
          </text>
        </g>

        {/* Sub-panel 4: Centroid Linkage */}
        <g transform="translate(505, 10)">
          <rect
            width="165"
            height="240"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="82"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Centroid Linkage
          </text>
          <text x="82" y="38" textAnchor="middle" className="text-[9px] font-mono fill-teal">
            ||c_A - c_B||
          </text>

          {/* Cluster A */}
          <ellipse
            cx="40"
            cy="120"
            rx="25"
            ry="40"
            fill="#1e3a8a"
            fillOpacity="0.1"
            stroke="#1e3a8a"
            strokeWidth="1"
          />
          <circle cx="30" cy="105" r="3" fill="#1e3a8a" />
          <circle cx="45" cy="135" r="3" fill="#1e3a8a" />
          {/* Centroid A */}
          <circle cx="38" cy="120" r="5" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2" />
          <text
            x="38"
            y="138"
            textAnchor="middle"
            className="text-[8px] font-bold fill-navy font-mono"
          >
            c_A
          </text>

          {/* Cluster B */}
          <ellipse
            cx="120"
            cy="120"
            rx="25"
            ry="40"
            fill="#0d9488"
            fillOpacity="0.1"
            stroke="#0d9488"
            strokeWidth="1"
          />
          <circle cx="115" cy="105" r="3" fill="#0d9488" />
          <circle cx="125" cy="135" r="3" fill="#0d9488" />
          {/* Centroid B */}
          <circle cx="120" cy="120" r="5" fill="#ffffff" stroke="#0d9488" strokeWidth="2" />
          <text
            x="120"
            y="138"
            textAnchor="middle"
            className="text-[8px] font-bold fill-teal font-mono"
          >
            c_B
          </text>

          {/* Distance between centroids */}
          <line x1="38" y1="120" x2="120" y2="120" stroke="#ef4444" strokeWidth="2" />
          <text
            x="79"
            y="112"
            textAnchor="middle"
            className="text-[9px] font-bold fill-red-500 font-mono"
          >
            D_cent
          </text>
          <text
            x="82"
            y="200"
            textAnchor="middle"
            className="text-[9px] fill-muted-foreground font-mono"
          >
            Center-to-center Euclidean
          </text>
        </g>
      </svg>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {label ??
          "Geometric visualization of inter-cluster distance definitions: contrasting Single (minimum point pair), Complete (maximum point pair), Average (all-pairs expectation), and Centroid (geometric mean distance)."}
      </p>
    </div>
  );
};

/**
 * 4. M03 Diagram: Agglomerative Step-Wise Merge Sequence on Canonical 4 Points
 */
export const AgglomerativeMergeSequenceDiagram: FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="my-6 rounded-sm border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2 font-mono">
        <span className="font-semibold text-foreground">Bottom-Up Coalescence Progression</span>
        <span>Canonical 4-Point Benchmark: P₁(1,2), P₂(2,3), P₃(6,5), P₄(7,6)</span>
      </div>
      <svg
        viewBox="0 0 680 230"
        className="w-full h-auto bg-background rounded-sm border border-border"
      >
        {/* Step 0: Initial Singletons */}
        <g transform="translate(10, 10)">
          <rect
            width="155"
            height="210"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="77"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Step 0: Singletons
          </text>
          <text
            x="77"
            y="40"
            textAnchor="middle"
            className="text-[10px] font-mono fill-muted-foreground"
          >
            k = 4 clusters
          </text>

          <circle cx="40" cy="140" r="5" fill="#1e3a8a" />
          <text
            x="40"
            y="158"
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-foreground"
          >
            P₁(1,2)
          </text>

          <circle cx="65" cy="115" r="5" fill="#1e3a8a" />
          <text
            x="65"
            y="105"
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-foreground"
          >
            P₂(2,3)
          </text>

          <circle cx="105" cy="85" r="5" fill="#0d9488" />
          <text
            x="105"
            y="75"
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-foreground"
          >
            P₃(6,5)
          </text>

          <circle cx="130" cy="60" r="5" fill="#0d9488" />
          <text
            x="130"
            y="50"
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-foreground"
          >
            P₄(7,6)
          </text>

          <text
            x="77"
            y="195"
            textAnchor="middle"
            className="text-[9px] font-mono fill-muted-foreground"
          >
            Initial disjoint points
          </text>
        </g>

        {/* Step 1: Merge {P1, P2} */}
        <g transform="translate(175, 10)">
          <rect
            width="155"
            height="210"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="77"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Step 1: Merge &#123;P₁, P₂&#125;
          </text>
          <text x="77" y="40" textAnchor="middle" className="text-[10px] font-mono fill-teal">
            d = √2 ≈ 1.4142 | k = 3
          </text>

          {/* Enclosing envelope */}
          <ellipse
            cx="52"
            cy="127"
            rx="25"
            ry="25"
            fill="#1e3a8a"
            fillOpacity="0.15"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          />
          <circle cx="40" cy="140" r="5" fill="#1e3a8a" />
          <circle cx="65" cy="115" r="5" fill="#1e3a8a" />

          <circle cx="105" cy="85" r="5" fill="#0d9488" />
          <circle cx="130" cy="60" r="5" fill="#0d9488" />

          <text
            x="77"
            y="195"
            textAnchor="middle"
            className="text-[9px] font-mono fill-navy font-bold"
          >
            Min dist pair coalesces
          </text>
        </g>

        {/* Step 2: Merge {P3, P4} */}
        <g transform="translate(340, 10)">
          <rect
            width="155"
            height="210"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="77"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Step 2: Merge &#123;P₃, P₄&#125;
          </text>
          <text x="77" y="40" textAnchor="middle" className="text-[10px] font-mono fill-teal">
            d = √2 ≈ 1.4142 | k = 2
          </text>

          {/* Cluster 1 */}
          <ellipse
            cx="52"
            cy="127"
            rx="25"
            ry="25"
            fill="#1e3a8a"
            fillOpacity="0.15"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          />
          <circle cx="40" cy="140" r="5" fill="#1e3a8a" />
          <circle cx="65" cy="115" r="5" fill="#1e3a8a" />

          {/* Cluster 2 */}
          <ellipse
            cx="117"
            cy="72"
            rx="25"
            ry="25"
            fill="#0d9488"
            fillOpacity="0.15"
            stroke="#0d9488"
            strokeWidth="1.5"
          />
          <circle cx="105" cy="85" r="5" fill="#0d9488" />
          <circle cx="130" cy="60" r="5" fill="#0d9488" />

          <text
            x="77"
            y="195"
            textAnchor="middle"
            className="text-[9px] font-mono fill-teal font-bold"
          >
            Second pair coalesces
          </text>
        </g>

        {/* Step 3: Root Merge */}
        <g transform="translate(505, 10)">
          <rect
            width="165"
            height="210"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="82"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Step 3: Universal Root
          </text>
          <text x="82" y="40" textAnchor="middle" className="text-[10px] font-mono fill-amber-600">
            H_merge ≈ 4.47–8.25 | k = 1
          </text>

          {/* Macro envelope */}
          <ellipse
            cx="85"
            cy="100"
            rx="65"
            ry="55"
            fill="#f59e0b"
            fillOpacity="0.1"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <circle cx="40" cy="140" r="5" fill="#1e3a8a" />
          <circle cx="65" cy="115" r="5" fill="#1e3a8a" />
          <circle cx="105" cy="85" r="5" fill="#0d9488" />
          <circle cx="130" cy="60" r="5" fill="#0d9488" />

          <text
            x="82"
            y="195"
            textAnchor="middle"
            className="text-[9px] font-mono fill-foreground font-bold"
          >
            Root cluster &#123;P₁,P₂,P₃,P₄&#125;
          </text>
        </g>
      </svg>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {label ??
          "Bottom-up merge progression from singletons to root: step-by-step greedy agglomeration sequence on canonical four-point benchmark."}
      </p>
    </div>
  );
};

/**
 * 5. M03 Diagram: Divisive (DIANA) Splinter Progression on Canonical 4 Points
 */
export const DivisiveSplinterSequenceDiagram: FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="my-6 rounded-sm border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2 font-mono">
        <span className="font-semibold text-foreground">Top-Down Splinter Progression (DIANA)</span>
        <span>Macnaughton-Smith (1964) Monothetic Splinter Group Heuristic</span>
      </div>
      <svg
        viewBox="0 0 680 230"
        className="w-full h-auto bg-background rounded-sm border border-border"
      >
        {/* Step 0: Monolithic Universal Cluster */}
        <g transform="translate(10, 10)">
          <rect
            width="155"
            height="210"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="77"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Step 0: Universal Root
          </text>
          <text
            x="77"
            y="40"
            textAnchor="middle"
            className="text-[10px] font-mono fill-muted-foreground"
          >
            k = 1 monolithic cluster
          </text>

          <ellipse
            cx="85"
            cy="100"
            rx="65"
            ry="55"
            fill="#1e3a8a"
            fillOpacity="0.1"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          />
          <circle cx="40" cy="140" r="5" fill="#1e3a8a" />
          <circle cx="65" cy="115" r="5" fill="#1e3a8a" />
          <circle cx="105" cy="85" r="5" fill="#1e3a8a" />
          <circle cx="130" cy="60" r="5" fill="#1e3a8a" />

          <text
            x="77"
            y="195"
            textAnchor="middle"
            className="text-[9px] font-mono fill-muted-foreground"
          >
            All points in single pool
          </text>
        </g>

        {/* Step 1: Isolate Splinter Seed */}
        <g transform="translate(175, 10)">
          <rect
            width="155"
            height="210"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="77"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Step 1: Splinter Seed
          </text>
          <text x="77" y="40" textAnchor="middle" className="text-[10px] font-mono fill-red-500">
            Find max avg dissimilarity
          </text>

          {/* Main group remains */}
          <ellipse
            cx="52"
            cy="127"
            rx="30"
            ry="30"
            fill="#1e3a8a"
            fillOpacity="0.1"
            stroke="#1e3a8a"
            strokeWidth="1"
          />
          <circle cx="40" cy="140" r="5" fill="#1e3a8a" />
          <circle cx="65" cy="115" r="5" fill="#1e3a8a" />
          <circle cx="105" cy="85" r="5" fill="#1e3a8a" />

          {/* Splinter Seed P4 */}
          <circle
            cx="130"
            cy="60"
            r="8"
            fill="#ef4444"
            fillOpacity="0.2"
            stroke="#ef4444"
            strokeWidth="1.5"
          />
          <circle cx="130" cy="60" r="5" fill="#ef4444" />
          <text
            x="130"
            y="45"
            textAnchor="middle"
            className="text-[9px] font-bold fill-red-600 font-mono"
          >
            Seed P₄
          </text>

          <text
            x="77"
            y="195"
            textAnchor="middle"
            className="text-[9px] font-mono fill-red-500 font-bold"
          >
            P₄ has highest distance
          </text>
        </g>

        {/* Step 2: Binary Partition */}
        <g transform="translate(340, 10)">
          <rect
            width="155"
            height="210"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="77"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Step 2: Binary Split
          </text>
          <text x="77" y="40" textAnchor="middle" className="text-[10px] font-mono fill-teal">
            P₃ joins splinter group
          </text>

          {/* Group 1: {P1, P2} */}
          <ellipse
            cx="52"
            cy="127"
            rx="25"
            ry="25"
            fill="#1e3a8a"
            fillOpacity="0.15"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          />
          <circle cx="40" cy="140" r="5" fill="#1e3a8a" />
          <circle cx="65" cy="115" r="5" fill="#1e3a8a" />

          {/* Group 2: {P3, P4} */}
          <ellipse
            cx="117"
            cy="72"
            rx="25"
            ry="25"
            fill="#0d9488"
            fillOpacity="0.15"
            stroke="#0d9488"
            strokeWidth="1.5"
          />
          <circle cx="105" cy="85" r="5" fill="#0d9488" />
          <circle cx="130" cy="60" r="5" fill="#0d9488" />

          <text
            x="77"
            y="195"
            textAnchor="middle"
            className="text-[9px] font-mono fill-teal font-bold"
          >
            Split into &#123;P₁,P₂&#125; &amp; &#123;P₃,P₄&#125;
          </text>
        </g>

        {/* Step 3: Terminal Singletons */}
        <g transform="translate(505, 10)">
          <rect
            width="165"
            height="210"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="1"
            rx="4"
          />
          <text
            x="82"
            y="24"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Step 3: Recursive Split
          </text>
          <text x="82" y="40" textAnchor="middle" className="text-[10px] font-mono fill-foreground">
            Terminal singletons (k = 4)
          </text>

          {/* Individual singletons */}
          <circle cx="40" cy="140" r="5" fill="#1e3a8a" />
          <text
            x="40"
            y="158"
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-foreground"
          >
            P₁
          </text>

          <circle cx="65" cy="115" r="5" fill="#1e3a8a" />
          <text
            x="65"
            y="105"
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-foreground"
          >
            P₂
          </text>

          <circle cx="105" cy="85" r="5" fill="#0d9488" />
          <text
            x="105"
            y="75"
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-foreground"
          >
            P₃
          </text>

          <circle cx="130" cy="60" r="5" fill="#0d9488" />
          <text
            x="130"
            y="50"
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-foreground"
          >
            P₄
          </text>

          <text
            x="82"
            y="195"
            textAnchor="middle"
            className="text-[9px] font-mono fill-muted-foreground font-bold"
          >
            Recursion terminates at singletons
          </text>
        </g>
      </svg>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {label ??
          "Top-down splinter group progression from root to leaves: Macnaughton-Smith divisive heuristic avoiding combinatorial 2^(n-1) explosion."}
      </p>
    </div>
  );
};

/**
 * 6. M08 Diagram: Tanglegram Tree Comparison (Single vs. Ward Linkage)
 */
export const TanglegramDiagram: FC<{ label?: string }> = ({ label }) => {
  // Leaf layout vertical positions (8 leaves, y=40 to y=250)
  const singleLeaves = [
    { label: "P₁", y: 45, id: 0 },
    { label: "P₂", y: 75, id: 1 },
    { label: "P₃", y: 105, id: 2 },
    { label: "P₇", y: 135, id: 6 }, // Bridge observation
    { label: "P₄", y: 165, id: 3 },
    { label: "P₅", y: 195, id: 4 },
    { label: "P₆", y: 225, id: 5 },
    { label: "P₈", y: 260, id: 7 }, // Outlier
  ];

  const wardLeaves = [
    { label: "P₁", y: 45, id: 0 },
    { label: "P₂", y: 75, id: 1 },
    { label: "P₃", y: 105, id: 2 },
    { label: "P₄", y: 145, id: 3 },
    { label: "P₅", y: 175, id: 4 },
    { label: "P₆", y: 205, id: 5 },
    { label: "P₇", y: 235, id: 6 }, // Chaining shift in Ward
    { label: "P₈", y: 265, id: 7 }, // Outlier
  ];

  return (
    <div className="my-6 rounded-sm border border-border bg-card p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground border-b border-border pb-2 font-mono">
        <span className="font-semibold text-foreground">
          Tanglegram Analysis: Single Linkage vs. Ward Linkage
        </span>
        <div className="flex items-center gap-3">
          <span className="text-teal font-semibold">r(C₁, C₂) = 0.8643</span>
          <span className="text-primary font-semibold">Baker&apos;s γ = 0.9964</span>
        </div>
      </div>

      <svg
        viewBox="0 0 740 300"
        className="w-full h-auto bg-background rounded-sm border border-border"
        aria-label="Tanglegram comparing Single and Ward linkage trees"
      >
        {/* Left Side: Single Linkage Tree (Roots left at x=30, Leaves at x=230) */}
        <g>
          {/* Subtree C1 (P1, P2, P3) */}
          <path
            d="M 230 45 L 180 45 L 180 60 L 150 60 L 150 75 L 120 75 L 120 90 L 90 90"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <path
            d="M 230 75 L 180 75 L 180 60"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <path
            d="M 230 105 L 150 105 L 150 75"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          {/* P7 bridge link */}
          <path
            d="M 230 135 L 120 135 L 120 90"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="3 3"
          />

          {/* Subtree C2 (P4, P5, P6) */}
          <path
            d="M 230 165 L 180 165 L 180 180 L 150 180 L 150 200 L 90 200"
            fill="none"
            stroke="#0d9488"
            strokeWidth="2"
          />
          <path
            d="M 230 195 L 180 195 L 180 180"
            fill="none"
            stroke="#0d9488"
            strokeWidth="2"
          />
          <path
            d="M 230 225 L 150 225 L 150 200"
            fill="none"
            stroke="#0d9488"
            strokeWidth="2"
          />

          {/* Root merge and Outlier P8 */}
          <path
            d="M 90 90 L 90 145 L 60 145 L 60 205 L 30 205"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
          />
          <path
            d="M 90 200 L 90 145"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
          />
          <path
            d="M 230 260 L 60 260 L 60 205"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />

          {/* Left Title */}
          <text
            x="130"
            y="25"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Single Linkage (Left)
          </text>
          <text
            x="130"
            y="37"
            textAnchor="middle"
            className="text-[9px] font-mono fill-muted-foreground"
          >
            Chaining Sensitivity (h_max = 7.81)
          </text>
        </g>

        {/* Center Connectors: Inter-tree observation matching */}
        <g>
          {singleLeaves.map((sLeaf) => {
            const wLeaf = wardLeaves.find((w) => w.id === sLeaf.id)!;
            const isCrossing = sLeaf.id === 6; // P7 crosses due to different grouping
            return (
              <g key={sLeaf.id}>
                <line
                  x1="250"
                  y1={sLeaf.y}
                  x2="490"
                  y2={wLeaf.y}
                  stroke={isCrossing ? "#f59e0b" : "#94a3b8"}
                  strokeWidth={isCrossing ? "2.5" : "1.2"}
                  strokeDasharray={isCrossing ? "4 3" : undefined}
                  opacity={isCrossing ? 1 : 0.65}
                />
                {/* Left Leaf Label */}
                <circle cx="230" cy={sLeaf.y} r="4" fill="#3b82f6" />
                <text
                  x="242"
                  y={sLeaf.y + 3.5}
                  textAnchor="start"
                  className="text-[10px] font-mono font-bold fill-foreground"
                >
                  {sLeaf.label}
                </text>

                {/* Right Leaf Label */}
                <circle cx="510" cy={wLeaf.y} r="4" fill="#8b5cf6" />
                <text
                  x="498"
                  y={wLeaf.y + 3.5}
                  textAnchor="end"
                  className="text-[10px] font-mono font-bold fill-foreground"
                >
                  {wLeaf.label}
                </text>
              </g>
            );
          })}

          {/* Crossing Diagnostic Flag */}
          <rect
            x="320"
            y="170"
            width="100"
            height="22"
            rx="3"
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="1"
          />
          <text
            x="370"
            y="184"
            textAnchor="middle"
            className="text-[9px] font-mono font-bold fill-amber-900"
          >
            P₇ Topological Shift
          </text>
        </g>

        {/* Right Side: Ward Linkage Tree (Leaves at x=510, Roots right at x=710) */}
        <g>
          {/* Subtree Ward C1 (P1, P2, P3) */}
          <path
            d="M 510 45 L 560 45 L 560 60 L 590 60 L 590 75 L 620 75 L 620 120 L 660 120"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
          <path
            d="M 510 75 L 560 75 L 560 60"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
          <path
            d="M 510 105 L 590 105 L 590 75"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
          />

          {/* Subtree Ward C2 (P4, P5, P6, P7) */}
          <path
            d="M 510 145 L 560 145 L 560 160 L 590 160 L 590 185 L 620 185 L 620 120"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
          />
          <path
            d="M 510 175 L 560 175 L 560 160"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
          />
          <path
            d="M 510 205 L 590 205 L 590 185"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
          />
          {/* P7 joins cluster C2 under Ward */}
          <path
            d="M 510 235 L 620 235 L 620 185"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="3 3"
          />

          {/* Ward Root Merge and Outlier P8 */}
          <path
            d="M 660 120 L 660 190 L 710 190"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
          />
          <path
            d="M 510 265 L 660 265 L 660 190"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />

          {/* Right Title */}
          <text
            x="610"
            y="25"
            textAnchor="middle"
            className="text-xs font-bold fill-foreground font-sans"
          >
            Ward&apos;s Linkage (Right)
          </text>
          <text
            x="610"
            y="37"
            textAnchor="middle"
            className="text-[9px] font-mono fill-muted-foreground"
          >
            Variance Minimization (h_max = 15.31)
          </text>
        </g>
      </svg>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {label ??
          "Tanglegram comparing Single Linkage (left) and Ward Linkage (right) on the 8-point benchmark. Parallel connecting lines represent conserved subtrees ({P₁, P₂} and {P₄, P₅, P₆}). The crossing dashed amber line reveals how observation P₇ acts as a chaining bridge under Single Linkage but is grouped into the compact cluster under Ward to minimize total within-cluster variance."}
      </p>
    </div>
  );
};

