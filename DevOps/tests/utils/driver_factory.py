import os
import sys
import shutil
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.edge.options import Options as EdgeOptions

def create_driver(headless=None):
    """
    Creates and configures a Selenium WebDriver instance.
    Cross-platform support for Windows, Linux (CI/CD / Jenkins), and macOS.
    Supports Chrome/Chromium with fallback to Microsoft Edge.
    """
    if headless is None:
        headless_env = os.environ.get("HEADLESS_BROWSER", "true").lower()
        headless = headless_env in ("true", "1", "yes")

    # Common Chrome arguments
    chrome_options = ChromeOptions()
    if headless:
        chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-infobars")
    chrome_options.add_argument("--ignore-certificate-errors")

    # Detect Linux Chromium / Chrome
    linux_browsers = ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"]
    linux_drivers = ["/usr/bin/chromedriver", "/usr/lib/chromium/chromedriver"]

    browser_bin = None
    for b in linux_browsers:
        if os.path.exists(b):
            browser_bin = b
            chrome_options.binary_location = browser_bin
            break

    driver_bin = None
    for d in linux_drivers:
        if os.path.exists(d):
            driver_bin = d
            break

    # Check Windows path if not Linux
    if not browser_bin and os.name == 'nt':
        win_chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        if os.path.exists(win_chrome):
            chrome_options.binary_location = win_chrome

    # 1. Try local service binary first if found
    if driver_bin:
        try:
            service = ChromeService(executable_path=driver_bin)
            driver = webdriver.Chrome(service=service, options=chrome_options)
            driver.set_page_load_timeout(30)
            driver.implicitly_wait(5)
            return driver
        except Exception as e_local:
            print(f"[DriverFactory] Local driver ({driver_bin}) note: {e_local}")

    # 2. Try Selenium 4 built-in manager
    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.set_page_load_timeout(30)
        driver.implicitly_wait(5)
        return driver
    except Exception as e_s4:
        print(f"[DriverFactory] Selenium Manager note: {e_s4}")

    # 3. Try webdriver-manager
    try:
        from webdriver_manager.chrome import ChromeDriverManager
        service = ChromeService(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.set_page_load_timeout(30)
        driver.implicitly_wait(5)
        return driver
    except Exception as e_wdm:
        print(f"[DriverFactory] ChromeDriverManager note: {e_wdm}")

    # 4. Fallback to Microsoft Edge (Windows)
    try:
        edge_options = EdgeOptions()
        if headless:
            edge_options.add_argument("--headless=new")
        edge_options.add_argument("--no-sandbox")
        edge_options.add_argument("--disable-dev-shm-usage")
        edge_options.add_argument("--window-size=1920,1080")

        edge_binary = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
        if os.path.exists(edge_binary):
            edge_options.binary_location = edge_binary

        from webdriver_manager.microsoft import EdgeChromiumDriverManager
        service = EdgeService(EdgeChromiumDriverManager().install())
        driver = webdriver.Edge(service=service, options=edge_options)
        driver.set_page_load_timeout(30)
        driver.implicitly_wait(5)
        return driver
    except Exception as e_edge:
        print(f"[DriverFactory] Error initializing Edge fallback: {e_edge}")
        raise e_edge
