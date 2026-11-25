"""Report scroll containers that show a scrollbar, and pages wider than the viewport.

Usage: python scripts/scroll-audit.py <dev-server URL printed by npm run dev> 1366
"""
import json
import sys

from playwright.sync_api import sync_playwright

SLUGS = [
    "", "introduction", "fundamentals", "types", "agglomerative", "divisive",
    "linkage", "distance-metrics", "dendrograms", "mathematics", "implementation",
    "evaluation", "comparison", "limitations", "applications", "projects",
]

JS = """
() => {
  const out = [];
  for (const el of document.querySelectorAll('main *')) {
    const cs = getComputedStyle(el);
    const sx = ['auto', 'scroll'].includes(cs.overflowX);
    const sy = ['auto', 'scroll'].includes(cs.overflowY);
    const dx = el.scrollWidth - el.clientWidth;
    const dy = el.scrollHeight - el.clientHeight;
    if ((sx && dx > 0) || (sy && dy > 0)) {
      out.push({dx, dy, tag: el.tagName,
                cls: String(el.className).slice(0, 80),
                text: (el.innerText || '').replace(/\\s+/g, ' ').slice(0, 60)});
    }
  }
  return {pageWidth: document.documentElement.scrollWidth, scrollers: out};
}
"""


def main() -> None:
    base, width = sys.argv[1].rstrip("/"), int(sys.argv[2])
    report = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": 900})
        for slug in SLUGS:
            url = f"{base}/{slug}" if slug else base
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(400)
            report[slug or "(overview)"] = page.evaluate(JS)
        browser.close()
    print(json.dumps(report, indent=1))


if __name__ == "__main__":
    main()
