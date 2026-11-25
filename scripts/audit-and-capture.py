import os
import sys
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = os.environ.get(
    "ARTIFACT_DIR", 
    r"C:\Users\alwin\.gemini\antigravity\brain\6a977f64-1fc6-4558-af7b-686ecacc070c"
)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

BASE_URL = "http://localhost:8080"

SLUGS = [
    "", "introduction", "fundamentals", "types", "agglomerative", "divisive",
    "linkage", "distance-metrics", "dendrograms", "mathematics", "implementation",
    "evaluation", "comparison", "limitations", "applications", "projects",
]

def run_audit():
    errors = []
    hydration_warnings = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Test /applications for Hydration Errors & Capture Screenshot
        page_app = browser.new_page(viewport={"width": 1366, "height": 900})
        app_console = []
        page_app.on("console", lambda msg: app_console.append(f"[{msg.type}] {msg.text} (loc: {msg.location})"))
        page_app.on("pageerror", lambda exc: errors.append(f"Page error on /applications: {exc}"))
        page_app.on("response", lambda res: print(f"HTTP {res.status} on {res.url}") if res.status >= 400 else None)
        
        page_app.goto(f"{BASE_URL}/applications", wait_until="domcontentloaded")
        page_app.wait_for_timeout(1000)

        for msg in app_console:
            if "hydration" in msg.lower() or "did not match" in msg.lower():
                hydration_warnings.append(msg)
            elif "[error]" in msg.lower():
                errors.append(msg)

        showdown = page_app.locator("text=Cross-Paradigm Algorithm Showdown").first
        if showdown.count() > 0:
            showdown.scroll_into_view_if_needed()
            page_app.wait_for_timeout(300)
            page_app.screenshot(path=os.path.join(ARTIFACT_DIR, "audit_applications_showdown.png"))
        page_app.close()

        # 2. Test /implementation at 390px (Mobile Overflow Check) & Capture Screenshot
        page_mobile = browser.new_page(viewport={"width": 390, "height": 844})
        page_mobile.goto(f"{BASE_URL}/implementation", wait_until="domcontentloaded")
        page_mobile.wait_for_timeout(1000)
        
        scroll_w = page_mobile.evaluate("() => document.documentElement.scrollWidth")
        client_w = page_mobile.evaluate("() => document.documentElement.clientWidth")
        if scroll_w > client_w:
            errors.append(f"/implementation mobile overflow: scrollWidth ({scroll_w}) > clientWidth ({client_w})")
        
        notice = page_mobile.locator("text=Client-Side Interactive Simulator").first
        if notice.count() > 0:
            notice.scroll_into_view_if_needed()
            page_mobile.wait_for_timeout(300)
            page_mobile.screenshot(path=os.path.join(ARTIFACT_DIR, "audit_implementation_mobile_390.png"))
        page_mobile.close()

        # 3. Test /fundamentals SVG Diagrams (Linkage Distance Geometry & Cloud Cut)
        page_fund = browser.new_page(viewport={"width": 1366, "height": 900})
        page_fund.goto(f"{BASE_URL}/fundamentals", wait_until="domcontentloaded")
        page_fund.wait_for_timeout(1000)

        cut_diag = page_fund.locator("div.border:has-text('Multi-Threshold Feature Slicing')").first
        if cut_diag.count() > 0:
            cut_diag.scroll_into_view_if_needed()
            page_fund.wait_for_timeout(300)
            cut_diag.screenshot(path=os.path.join(ARTIFACT_DIR, "audit_fundamentals_cloud_cut.png"))

        geom_diag = page_fund.locator("div.border:has-text('Geometric Linkage Formulations')").first
        if geom_diag.count() > 0:
            geom_diag.scroll_into_view_if_needed()
            page_fund.wait_for_timeout(300)
            geom_diag.screenshot(path=os.path.join(ARTIFACT_DIR, "audit_fundamentals_linkage_geometry.png"))
        page_fund.close()

        # 4. Test /types SVG Diagram (DIANA Top-Down Splinter Sequence)
        page_types = browser.new_page(viewport={"width": 1366, "height": 900})
        page_types.goto(f"{BASE_URL}/types", wait_until="domcontentloaded")
        page_types.wait_for_timeout(1000)

        splinter = page_types.locator("div.border:has-text('Top-Down Splinter Progression (DIANA)')").first
        if splinter.count() > 0:
            splinter.scroll_into_view_if_needed()
            page_types.wait_for_timeout(300)
            splinter.screenshot(path=os.path.join(ARTIFACT_DIR, "audit_types_diana_splinter.png"))
        page_types.close()

        # 5. Test /dendrograms SVG Diagram (Tanglegram)
        page_dend = browser.new_page(viewport={"width": 1366, "height": 900})
        page_dend.goto(f"{BASE_URL}/dendrograms", wait_until="domcontentloaded")
        page_dend.wait_for_timeout(1000)

        tangle = page_dend.locator("div.border:has-text('Tanglegram Analysis')").first
        if tangle.count() == 0:
            tangle = page_dend.locator("div.border:has-text('Visualizing Congruence with Tanglegrams')").first
        if tangle.count() > 0:
            tangle.scroll_into_view_if_needed()
            page_dend.wait_for_timeout(300)
            tangle.screenshot(path=os.path.join(ARTIFACT_DIR, "audit_dendrograms_tanglegram.png"))
        page_dend.close()

        # 6. Test /projects (All 4 Project Architecture Diagrams & Card Grid)
        page_proj = browser.new_page(viewport={"width": 1366, "height": 900})
        page_proj.goto(f"{BASE_URL}/projects", wait_until="domcontentloaded")
        page_proj.wait_for_timeout(1000)

        # Check for any hsl(var(-- tokens in SVG or rects
        invalid_hsl_count = page_proj.evaluate(
            "() => document.querySelectorAll('[fill*=\"hsl(var\"], [stroke*=\"hsl(var\"]').length"
        )
        if invalid_hsl_count > 0:
            errors.append(f"/projects has {invalid_hsl_count} elements with invalid hsl(var(--)) attributes")

        pipeline = page_proj.locator("div.border:has-text('Architecture Blueprint & Data Pipeline')").first
        if pipeline.count() > 0:
            pipeline.scroll_into_view_if_needed()
            page_proj.wait_for_timeout(300)
            pipeline.screenshot(path=os.path.join(ARTIFACT_DIR, "audit_projects_arch_diagram.png"))
        page_proj.close()

        # 7. Comprehensive 390px audit across all 16 slugs
        mobile_overflow_pages = []
        page_audit = browser.new_page(viewport={"width": 390, "height": 844})
        for slug in SLUGS:
            url = f"{BASE_URL}/{slug}" if slug else BASE_URL
            page_audit.goto(url, wait_until="domcontentloaded")
            page_audit.wait_for_timeout(300)
            sw = page_audit.evaluate("() => document.documentElement.scrollWidth")
            cw = page_audit.evaluate("() => document.documentElement.clientWidth")
            if sw > cw:
                mobile_overflow_pages.append(f"{slug or 'overview'} (sw={sw}, cw={cw})")
        page_audit.close()
        browser.close()

    print("=== AUDIT SUMMARY ===")
    print(f"Hydration warnings: {len(hydration_warnings)}")
    for w in hydration_warnings:
        print(f"  WARN: {w}")
    print(f"Errors: {len(errors)}")
    for e in errors:
        print(f"  ERR: {e}")
    print(f"390px Mobile overflow pages: {len(mobile_overflow_pages)}")
    for p in mobile_overflow_pages:
        print(f"  OVERFLOW: {p}")
    print("=== END AUDIT ===")

    if hydration_warnings or errors or mobile_overflow_pages:
        sys.exit(1)
    else:
        print("ALL VERIFICATIONS PASSED CLEANLY!")
        sys.exit(0)

if __name__ == "__main__":
    run_audit()
