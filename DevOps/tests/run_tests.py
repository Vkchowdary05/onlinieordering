#!/usr/bin/env python3
"""
MediCare Hospital Appointment Booking System
Standalone Selenium Test Runner for TC01 - TC07
"""

import os
import sys
import time
import traceback
from datetime import datetime
from selenium.webdriver.common.by import By

# Add current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from utils.driver_factory import create_driver
from utils.test_helpers import capture_screenshot
from test_medicare_suite import TestMediCareDevOpsSuite

def print_banner():
    print("=" * 70)
    print("  MediCare Hospital Appointment Booking System - Automated Test Suite  ")
    print("=" * 70)
    print(f"  Timestamp    : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  Target URL   : {os.environ.get('MEDICARE_BASE_URL', 'http://localhost:3000')}")
    print(f"  Headless Mode: {os.environ.get('HEADLESS_BROWSER', 'true')}")
    print("=" * 70)

def main():
    print_banner()

    suite = TestMediCareDevOpsSuite()
    test_methods = [
        ("TC01", "Patient registration", suite.test_tc01_patient_registration),
        ("TC02", "Patient login", suite.test_tc02_patient_login),
        ("TC03", "Search doctor", suite.test_tc03_search_doctor),
        ("TC04", "Book available slot", suite.test_tc04_book_available_slot),
        ("TC05", "Book occupied slot", suite.test_tc05_book_occupied_slot),
        ("TC06", "Cancel appointment", suite.test_tc06_cancel_appointment),
        ("TC07", "View appointments", suite.test_tc07_view_appointments),
    ]

    results = []
    total_start = time.time()

    driver = None
    try:
        print("\n[INIT] Initializing automated browser session...")
        driver = create_driver()
        print("[INIT] Browser session successfully launched.\n")

        for test_id, description, method in test_methods:
            print(f"--> Executing {test_id}: {description}...")
            start_time = time.time()
            status = "FAILED"
            error_msg = ""

            try:
                method(driver)
                status = "PASSED"
                elapsed = time.time() - start_time
                print(f"    [PASSED] {test_id} finished in {elapsed:.2f}s\n")
            except Exception as e:
                elapsed = time.time() - start_time
                error_msg = str(e)
                print(f"    [FAILED] {test_id} failed in {elapsed:.2f}s: {e}")
                screenshot_path = capture_screenshot(driver, f"FAIL_{test_id}")
                print(f"    [DEBUG] Failure screenshot captured: {screenshot_path}\n")

            results.append({
                "id": test_id,
                "description": description,
                "status": status,
                "duration": elapsed,
                "error": error_msg
            })

    except Exception as fatal_e:
        print(f"\n[FATAL] Error initializing or running tests: {fatal_e}")
        traceback.print_exc()
        return 1
    finally:
        if driver:
            try:
                driver.quit()
                print("[CLEANUP] Browser session closed.")
            except Exception:
                pass

    total_time = time.time() - total_start

    # Summary Report
    print("\n" + "=" * 70)
    print("                      TEST EXECUTION SUMMARY                          ")
    print("=" * 70)
    print(f"{'Test ID':<10} | {'Test Case':<28} | {'Status':<10} | {'Duration'}")
    print("-" * 70)

    passed_count = 0
    for r in results:
        status_marker = "[OK] PASS" if r["status"] == "PASSED" else "[X] FAIL"
        if r["status"] == "PASSED":
            passed_count += 1
        print(f"{r['id']:<10} | {r['description']:<28} | {status_marker:<10} | {r['duration']:.2f}s")

    print("-" * 70)
    print(f"Total Tests: {len(results)} | Passed: {passed_count} | Failed: {len(results) - passed_count} | Total Time: {total_time:.2f}s")
    print("=" * 70)

    # Save summary report to DevOps/tests/reports/summary.txt
    reports_dir = os.path.join(current_dir, "reports")
    os.makedirs(reports_dir, exist_ok=True)
    summary_file = os.path.join(reports_dir, "summary.txt")
    with open(summary_file, "w", encoding="utf-8") as f:
        f.write(f"MediCare Automated Test Run Summary\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n")
        f.write(f"Passed: {passed_count}/{len(results)}\n\n")
        for r in results:
            f.write(f"{r['id']}: {r['description']} -> {r['status']} ({r['duration']:.2f}s)\n")
            if r['error']:
                f.write(f"    Error: {r['error']}\n")

    print(f"\n[REPORT] Summary file written to: {summary_file}")

    return 0 if passed_count == len(results) else 1

if __name__ == "__main__":
    sys.exit(main())
