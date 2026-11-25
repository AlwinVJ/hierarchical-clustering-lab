from playwright.sync_api import sync_playwright
import os

ARTIFACT_DIR = os.environ.get("ARTIFACT_DIR", "./screenshots")
os.makedirs(ARTIFACT_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        ignore_default_args=["--hide-scrollbars"]
    )
    
    # 1. Module 10 formula at 1366px (no horizontal scrollbar)
    page_m10 = browser.new_page(viewport={"width": 1366, "height": 900})
    page_m10.goto("http://localhost:8081/implementation", wait_until="networkidle")
    page_m10.screenshot(path=os.path.join(ARTIFACT_DIR, "partA_m10_desktop_no_scroll.png"), full_page=False)
    page_m10.close()
    
    # 2. Module 14 case study at 1366px (full-width stacked code panel)
    page_m14 = browser.new_page(viewport={"width": 1366, "height": 900})
    page_m14.goto("http://localhost:8081/applications", wait_until="networkidle")
    # scroll down to case study
    case_study = page_m14.locator("text=Customer Segmentation Case Study").first
    if case_study.count() > 0:
        case_study.scroll_into_view_if_needed()
    page_m14.screenshot(path=os.path.join(ARTIFACT_DIR, "partA_m14_desktop_case_study.png"), full_page=False)
    page_m14.close()
    
    # 3. Overview on mobile (375px, no sideways scroll)
    page_mobile = browser.new_page(viewport={"width": 375, "height": 800})
    page_mobile.goto("http://localhost:8081/", wait_until="networkidle")
    page_mobile.screenshot(path=os.path.join(ARTIFACT_DIR, "partA_overview_mobile_375.png"), full_page=False)
    page_mobile.close()

    browser.close()

print("Screenshots taken successfully!")
