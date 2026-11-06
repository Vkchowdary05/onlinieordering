import os
import time
from datetime import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def wait_for_element(driver, by, value, timeout=10):
    """Wait until an element is present and visible."""
    return WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located((by, value))
    )

def wait_and_click(driver, by, value, timeout=10):
    """Wait until an element is clickable, then click it."""
    element = WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable((by, value))
    )
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
    time.sleep(0.3)
    try:
        element.click()
    except Exception:
        driver.execute_script("arguments[0].click();", element)
    return element

def wait_and_send_keys(driver, by, value, text, timeout=10, clear_first=True):
    """Wait for input element, optionally clear it, and type text."""
    element = wait_for_element(driver, by, value, timeout)
    if clear_first:
        element.clear()
    element.send_keys(text)
    return element

def capture_screenshot(driver, test_name, screenshots_dir=None):
    """Saves a timestamped screenshot on test failure or milestone."""
    if screenshots_dir is None:
        screenshots_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "screenshots"
        )
    os.makedirs(screenshots_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = os.path.join(screenshots_dir, f"{test_name}_{timestamp}.png")
    driver.save_screenshot(filepath)
    print(f"[Screenshot] Captured: {filepath}")
    return filepath
