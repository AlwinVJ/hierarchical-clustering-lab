import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { pages } from "@/lib/course";
import { BlockView } from "@/components/lab/blocks";
import { PageShell } from "@/components/lab/page-shell";

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<Record<string, unknown>>("@tanstack/react-router");
  return {
    ...actual,
    Link: ({ children, ...props }: { children?: React.ReactNode }) => (
      <span {...props}>{children}</span>
    ),
  };
});

describe("Zero-Placeholders Quality Gate", () => {
  const disallowedPatterns = [
    /\[CONTENT PLACEHOLDER\]/i,
    /\[MATHEMATICAL EXPLANATION PLACEHOLDER\]/i,
    /\[CODE IMPLEMENTATION PLACEHOLDER\]/i,
    /\[EXECUTION LOG PLACEHOLDER\]/i,
    /\[DIAGRAM PLACEHOLDER\]/i,
    /\[INTERACTIVE VISUALIZATION PLACEHOLDER\]/i,
    /\[Project Title Placeholder\]/i,
    /statement placeholder/i,
    /will be placed here in Phase 2/i,
    /NotImplementedError\("Implementation placeholder"\)/i,
  ];

  it("verifies all 16 curriculum pages render via PageShell with zero placeholder markers", () => {
    expect(pages.length).toBeGreaterThanOrEqual(16);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]!;
      const renderedHtml = renderToString(<PageShell index={i} />);

      for (const pattern of disallowedPatterns) {
        const match = renderedHtml.match(pattern);
        if (match) {
          throw new Error(
            `Placeholder violation on page [${page.slug || "overview"}] (${page.title}): matched pattern "${pattern.toString()}" at index ${match.index}.`,
          );
        }
      }
    }
  });

  it("verifies all 15 curriculum modules render all individual blocks with zero placeholder markers", () => {
    // Skip index 0 (Overview is rendered by src/routes/index.tsx)
    for (let i = 1; i < pages.length; i++) {
      const page = pages[i]!;
      expect(page.sections.length).toBeGreaterThan(0);

      for (const section of page.sections) {
        for (const block of section.blocks) {
          const renderedHtml = renderToString(<BlockView block={block} />);

          for (const pattern of disallowedPatterns) {
            const match = renderedHtml.match(pattern);
            if (match) {
              throw new Error(
                `Placeholder violation on page [${page.slug}] (${page.title}), section "${section.title}": matched pattern "${pattern.toString()}" at index ${match.index}.`,
              );
            }
          }
        }
      }
    }
  });

  it("verifies that no empty sections exist in any module", () => {
    // Overview (index 0) has slug '' and sections are handled by index route
    for (let i = 1; i < pages.length; i++) {
      const page = pages[i]!;
      expect(
        page.sections.length,
        `Page [${page.slug}] (${page.title}) has 0 sections!`,
      ).toBeGreaterThan(0);

      for (const section of page.sections) {
        expect(
          section.blocks.length,
          `Section "${section.title}" on page [${page.slug}] has 0 blocks!`,
        ).toBeGreaterThan(0);
      }
    }
  });
});
