#!/usr/bin/env python3
"""
Test Runner for NovaStore Online Shopping System
Executes automated Selenium tests for TC01-TC07 and generates a formatted results table.
"""

import os
import sys
import time
import subprocess
import socket
import urllib.request

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def is_port_in_use(port: int, host="127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(1.0)
        return s.connect_ex((host, port)) == 0

def wait_for_server(url: str, timeout=25):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url, timeout=2) as response:
                if response.status in (200, 304):
                    return True
        except Exception:
            pass
        time.sleep(1)
    return False

def main():
    print("=================================================================")
    print("[*] NovaStore Online Shopping System -- DevOps Automated Tests")
    print("=================================================================")

    # Create reports dir
    reports_dir = os.path.join(os.path.dirname(__file__), "reports")
    os.makedirs(reports_dir, exist_ok=True)
    report_file = os.path.join(reports_dir, "report.html")

    server_process = None
    app_url = os.environ.get("APP_URL")

    if not app_url:
        # Determine available port
        if wait_for_server("http://127.0.0.1:3002", timeout=1):
            app_url = "http://127.0.0.1:3002"
            print(f"[i] Detected running container/server on {app_url}")
        elif wait_for_server("http://127.0.0.1:8080", timeout=1):
            app_url = "http://127.0.0.1:8080"
            print(f"[i] Detected running container/server on {app_url}")
        elif wait_for_server(f"http://127.0.0.1:{target_port}", timeout=1):
            app_url = f"http://127.0.0.1:{target_port}"
            print(f"[i] Detected running preview server on {app_url}")
        else:
            # Start preview or dev server
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
            print(f"[+] Starting Vite local server in {project_root}...")

            # Check if dist exists, else run preview or dev
            dist_path = os.path.join(project_root, "dist")
            if os.path.exists(dist_path):
                cmd = f"npx vite preview --port {target_port} --host 127.0.0.1"
            else:
                cmd = f"npx vite --port {target_port} --host 127.0.0.1"

            server_process = subprocess.Popen(
                cmd,
                cwd=project_root,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                shell=True
            )
            app_url = f"http://127.0.0.1:{target_port}"
            print(f"[*] Waiting for {app_url} to become ready...")
            if not wait_for_server(app_url, timeout=20):
                print(f"[!] Failed to reach {app_url}")
                if server_process:
                    server_process.kill()
                sys.exit(1)
            print(f"[OK] Server is live on {app_url}")

    test_env = os.environ.copy()
    test_env["APP_URL"] = app_url

    # Run pytest
    pytest_cmd = [
        sys.executable,
        "-m",
        "pytest",
        os.path.join(os.path.dirname(__file__), "test_shopping_suite.py"),
        "-v",
        f"--html={report_file}",
        "--self-contained-html",
    ]

    print("\n[*] Executing Selenium Test Suite (TC01 - TC07)...")
    result = subprocess.run(pytest_cmd, env=test_env)

    # Print Formatted Results Table matching User Matrix
    test_matrix = [
        ("TC01", "Customer login", "Login successful"),
        ("TC02", "Search product", "Product displayed"),
        ("TC03", "Add product to cart", "Product added"),
        ("TC04", "Update quantity", "Cart updated"),
        ("TC05", "Remove product", "Product removed"),
        ("TC06", "Checkout", "Order placed"),
        ("TC07", "View order history", "Order details displayed"),
    ]

    status_tag = "PASSED" if result.returncode == 0 else "PARTIAL / FAILED"

    print("\n" + "=" * 80)
    print(f"{'Test ID':<10} | {'Test case':<24} | {'Expected result':<28} | {'Status'}")
    print("-" * 80)
    for test_id, case, expected in test_matrix:
        print(f"{test_id:<10} | {case:<24} | {expected:<28} | {status_tag}")
    print("=" * 80)
    print(f"[+] Detailed HTML Report: {report_file}")
    print("=" * 80 + "\n")

    if server_process:
        print("[*] Stopping background test server...")
        try:
            if os.name == 'nt':
                subprocess.run(f"taskkill /F /PID {server_process.pid} /T", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                server_process.terminate()
        except Exception:
            pass

    sys.exit(result.returncode)

if __name__ == "__main__":
    main()
