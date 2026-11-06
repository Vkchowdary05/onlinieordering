import os
import sys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.edge.options import Options as EdgeOptions
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager

def create_driver(headless=None):
    """
    Creates and configures a Selenium WebDriver instance.
    Supports Chrome with fallback to Microsoft Edge.
    Configures headless mode automatically for CI/CD environments.
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

    # Try Google Chrome first
    try:
        # Check standard Windows paths if available
        chrome_binary = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        if os.path.exists(chrome_binary):
            chrome_options.binary_location = chrome_binary

        service = ChromeService(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.set_page_load_timeout(30)
        driver.implicitly_wait(5)
        return driver
    except Exception as e_chrome:
        print(f"[DriverFactory] Chrome initialization note: {e_chrome}")
        print("[DriverFactory] Attempting Microsoft Edge as fallback...")

    # Fallback to Microsoft Edge
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

        service = EdgeService(EdgeChromiumDriverManager().install())
        driver = webdriver.Edge(service=service, options=edge_options)
        driver.set_page_load_timeout(30)
        driver.implicitly_wait(5)
        return driver
    except Exception as e_edge:
        print(f"[DriverFactory] Error initializing both Chrome and Edge: {e_edge}")
        raise e_edge
