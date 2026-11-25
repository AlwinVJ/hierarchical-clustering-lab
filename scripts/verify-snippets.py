#!/usr/bin/env python3
"""
scripts/verify-snippets.py
Continuous accuracy verification script for Hierarchical Clustering Lab.
Extracts code snippets and expected outputs across course.ts, module14, and module15,
executes them under Python 3.12, and asserts zero output discrepancies.
"""

import re
import sys
import io
import os
import contextlib
import traceback
import difflib
import warnings

os.environ["LOKY_MAX_CPU_COUNT"] = "4"
warnings.filterwarnings("ignore")

# Configure headless matplotlib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
plt.show = lambda *args, **kwargs: None

def clean_lines(s: str) -> list[str]:
    return [line.rstrip() for line in s.strip().splitlines() if line.strip() != ""]

def unescape_js(s: str) -> str:
    return s.replace(r"\`", "`").replace(r"\$", "$").replace(r"\\", "\\")

def run_course_snippets() -> tuple[int, int]:
    print("==================================================")
    print("1. Verifying Course Snippets (src/lib/course.ts)")
    print("==================================================")
    
    with open("src/lib/course.ts", "r", encoding="utf-8") as f:
        text = f.read()

    pattern = re.compile(
        r'cd\(\s*["\'](?P<cd_title>[^"\']+)["\']\s*,\s*`(?P<code>(?:(?!cd\()[\s\S])*?)`\s*,\s*\)\s*,\s*'
        r'out\(\s*["\'](?P<out_title>[^"\']+)["\']\s*,\s*`(?P<output>[\s\S]*?)`\s*,\s*\)',
        re.MULTILINE
    )

    scratch_pattern = re.compile(
        r'cd\(\s*["\']NumPy Agglomerative Clustering: Full Verified Implementation["\']\s*,\s*`([\s\S]*?)`\s*,\s*\)',
        re.MULTILINE
    )
    m_scratch = scratch_pattern.search(text)
    scratch_code = unescape_js(m_scratch.group(1)) if m_scratch else ""

    matches = list(pattern.finditer(text))
    passed = 0
    failed = 0

    module_env = {"__name__": "__main__", "plt": plt}
    if scratch_code:
        exec(scratch_code, module_env)

    for idx, m in enumerate(matches):
        title = m.group("cd_title")
        code = unescape_js(m.group("code"))
        expected = unescape_js(m.group("output"))

        # Context isolation between distinct modules
        if (
            "Complete End-to-End" in title
            or "Internal Metrics in Python" in title
            or "Analyzing Merge Height" in title
            or "Grouped Feature Aggregation" in title
            or "Sparse Connectivity" in title
            or "Computing Gower's Dissimilarity" in title
            or "Seeded Implementation of the Gap" in title
            or "Large-Scale Two-Stage" in title
        ):
            module_env = {"__name__": "__main__", "plt": plt}

        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf):
                exec(code, module_env)
            actual = buf.getvalue()

            actual_lines = clean_lines(actual)
            expected_lines = clean_lines(expected)

            if actual_lines == expected_lines:
                print(f"  [{idx+1:02d}/{len(matches):02d}] PASS: {title}")
                passed += 1
            else:
                print(f"  [{idx+1:02d}/{len(matches):02d}] FAIL: {title}")
                diff = list(difflib.unified_diff(expected_lines, actual_lines, fromfile="expected", tofile="actual", lineterm=""))
                print("\n".join(diff[:20]))
                failed += 1
        except Exception as e:
            print(f"  [{idx+1:02d}/{len(matches):02d}] ERROR: {title}")
            traceback.print_exc()
            failed += 1

    return passed, failed

def run_project_solutions() -> tuple[int, int]:
    print("\n==================================================")
    print("2. Verifying Project Reference Solutions (module15)")
    print("==================================================")
    
    with open("src/content/module15-projects.tsx", "r", encoding="utf-8") as f:
        text = f.read()

    pattern = re.compile(
        r'solutionCode:\s*`(?P<code>[\s\S]*?)`\s*,\s*'
        r'verifiedOutput:\s*`(?P<output>[\s\S]*?)`\s*,',
        re.MULTILINE
    )

    matches = list(pattern.finditer(text))
    passed = 0
    failed = 0

    for idx, m in enumerate(matches):
        code = unescape_js(m.group("code"))
        expected = unescape_js(m.group("output"))

        buf = io.StringIO()
        env = {"__name__": "__main__", "plt": plt}
        try:
            with contextlib.redirect_stdout(buf):
                exec(code, env)
            actual = buf.getvalue()

            actual_lines = clean_lines(actual)
            expected_lines = clean_lines(expected)

            if actual_lines == expected_lines:
                print(f"  [Project {idx+1:02d}] PASS")
                passed += 1
            else:
                print(f"  [Project {idx+1:02d}] FAIL")
                diff = list(difflib.unified_diff(expected_lines, actual_lines, fromfile="expected", tofile="actual", lineterm=""))
                print("\n".join(diff[:20]))
                failed += 1
        except Exception as e:
            print(f"  [Project {idx+1:02d}] ERROR")
            traceback.print_exc()
            failed += 1

    return passed, failed

def main():
    c_pass, c_fail = run_course_snippets()
    p_pass, p_fail = run_project_solutions()

    total_pass = c_pass + p_pass
    total_fail = c_fail + p_fail

    print("\n==================================================")
    print(f"VERIFICATION SUMMARY: {total_pass} passed, {total_fail} failed")
    print("==================================================")

    if total_fail > 0:
        sys.exit(1)
    else:
        print("All verified code snippets match expected output with 100% precision.")
        sys.exit(0)

if __name__ == "__main__":
    main()
