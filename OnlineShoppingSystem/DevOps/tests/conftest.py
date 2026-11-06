import os
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

@pytest.fixture(scope="session")
def base_url():
    """Retrieve base URL under test, default to local Vite server port 5173."""
    return os.environ.get("APP_URL", "http://127.0.0.1:5173").rstrip("/")

@pytest.fixture(scope="function")
def driver():
    """Initialize Chrome WebDriver session with Selenium 4 native manager."""
    options = Options()
    
    headless_env = os.environ.get("HEADLESS", "true").lower()
    if headless_env in ("true", "1", "yes"):
        options.add_argument("--headless=new")
        
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-notifications")
    options.add_argument("--ignore-certificate-errors")

    if os.name == 'nt':
        win_chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        if os.path.exists(win_chrome):
            options.binary_location = win_chrome

    # 1. First try Selenium 4 native driver
    try:
        browser = webdriver.Chrome(options=options)
    except Exception as e_s4:
        # 2. Try ChromeDriverManager
        try:
            from webdriver_manager.chrome import ChromeDriverManager
            service = Service(ChromeDriverManager().install())
            browser = webdriver.Chrome(service=service, options=options)
        except Exception:
            raise e_s4

    browser.set_page_load_timeout(30)
    browser.implicitly_wait(6)
    
    yield browser

    try:
        browser.quit()
    except Exception:
        pass

def pytest_html_report_title(report):
    report.title = "NovaStore E-Commerce — Selenium Test Suite (TC01-TC07)"
