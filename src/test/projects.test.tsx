import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProjectsCatalog, CAPSTONE_PROJECTS } from "@/content/module15-projects";
import { pages, findPage } from "@/lib/course";

describe("Module 15: Capstone Projects Catalog", () => {
  it("renders ProjectsCatalog with header, difficulty filter and workspace", () => {
    const html = renderToString(<ProjectsCatalog />);
    expect(html).toContain("Capstone Project Blueprints");
    expect(html).toContain("Difficulty:");
    expect(html).toContain("PROJECT 01");
    expect(html).toContain("PROJECT 02");
    expect(html).toContain("PROJECT 03");
    expect(html).toContain("PROJECT 04");
  });

  it("contains exactly 4 production-grade capstone project blueprints", () => {
    expect(CAPSTONE_PROJECTS).toHaveLength(4);
    const titles = CAPSTONE_PROJECTS.map((p) => p.title);
    expect(titles).toContain("Customer Behavioral Hierarchy & RFM Segmentation");
    expect(titles).toContain("Linkage Method Shoot-Out on Geometric Manifolds");
    expect(titles).toContain("Pure NumPy Agglomerative Engine with Lance–Williams Updates");
    expect(titles).toContain("Document Topic Taxonomy & Semantic Hierarchy via TF-IDF");
  });

  it.each(CAPSTONE_PROJECTS)(
    "verifies blueprint $id ($slug) has complete specification, code, and rubric",
    (proj) => {
      expect(proj.title).toBeTruthy();
      expect(proj.subtitle).toBeTruthy();
      expect(proj.category).toBeTruthy();
      expect(proj.estimatedTime).toBeTruthy();
      expect(proj.prerequisites.length).toBeGreaterThanOrEqual(3);
      expect(proj.objectives.length).toBeGreaterThanOrEqual(4);
      expect(proj.milestones).toHaveLength(4);

      // Starter code must have TODO tasks
      expect(proj.starterCode).toContain("TODO");

      // Solution code must contain executable Python code
      expect(proj.solutionCode).toContain("import");
      expect(proj.solutionCode.length).toBeGreaterThan(200);

      // Verified output must be non-empty
      expect(proj.verifiedOutput.length).toBeGreaterThan(50);

      // Rubric must have 4 criteria with 100% total weight
      expect(proj.rubric).toHaveLength(4);
      const totalWeight = proj.rubric
        .map((r) => parseInt(r.weight.replace("%", ""), 10))
        .reduce((a, b) => a + b, 0);
      expect(totalWeight).toBe(100);
    },
  );

  it("verifies Module 15 in course.ts is populated and contains 3 sections", () => {
    const projPageIdx = findPage("projects");
    expect(projPageIdx).toBeGreaterThan(0);

    const projPage = pages[projPageIdx]!;
    expect(projPage.title).toBe("Hands-on Projects");
    expect(projPage.sections).toHaveLength(3);
    expect(projPage.sections.map((s) => s.title)).toEqual([
      "Curriculum & Engineering Standards",
      "Interactive Project Catalog & Blueprints",
      "Submission Guidelines & Best Practices",
    ]);
  });
});
