from playwright.sync_api import sync_playwright
import os

ARTIFACT_DIR = os.environ.get("ARTIFACT_DIR", "./screenshots")
os.makedirs(ARTIFACT_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # 1. Module 07 Gower Distance section
    page = browser.new_page(viewport={"width": 1366, "height": 900})
    page.goto("http://localhost:8081/distance-metrics", wait_until="networkidle")
    loc = page.locator("text=Distances for Binary, Categorical and Mixed Data").first
    if loc.count() > 0:
        loc.scroll_into_view_if_needed()
    page.screenshot(path=os.path.join(ARTIFACT_DIR, "partD_m07_gower_mixed.png"))
    page.close()

    # 2. Module 08 Tanglegram Diagram
    page = browser.new_page(viewport={"width": 1366, "height": 900})
    page.goto("http://localhost:8081/dendrograms", wait_until="networkidle")
    loc = page.locator("text=Comparing Two Dendrograms").first
    if loc.count() > 0:
        loc.scroll_into_view_if_needed()
    page.screenshot(path=os.path.join(ARTIFACT_DIR, "partD_m08_tanglegram.png"))
    page.close()

    # 3. Module 12 Gap Statistic
    page = browser.new_page(viewport={"width": 1366, "height": 900})
    page.goto("http://localhost:8081/comparison", wait_until="networkidle")
    loc = page.locator("text=The Gap Statistic Protocol").first
    if loc.count() > 0:
        loc.scroll_into_view_if_needed()
    page.screenshot(path=os.path.join(ARTIFACT_DIR, "partD_m12_gap_statistic.png"))
    page.close()

    # 4. Module 14 Large-Scale Clustering
    page = browser.new_page(viewport={"width": 1366, "height": 900})
    page.goto("http://localhost:8081/applications", wait_until="networkidle")
    loc = page.locator("text=Scaling Hierarchical Clustering to Large Datasets").first
    if loc.count() > 0:
        loc.scroll_into_view_if_needed()
    page.screenshot(path=os.path.join(ARTIFACT_DIR, "partD_m14_large_scale.png"))
    page.close()

    # 5. Module 15 Project 4 (32 Abstracts & Stretch Goal)
    page = browser.new_page(viewport={"width": 1366, "height": 900})
    page.goto("http://localhost:8081/projects", wait_until="networkidle")
    loc = page.locator("text=Project 4: Hierarchical Document Taxonomy via TF-IDF & Ward").first
    if loc.count() > 0:
        loc.scroll_into_view_if_needed()
    page.screenshot(path=os.path.join(ARTIFACT_DIR, "partD_m15_p4_nlp_corpus.png"))
    page.close()

    browser.close()

print("Screenshots taken successfully!")
