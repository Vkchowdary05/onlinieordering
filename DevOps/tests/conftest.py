import os
import pytest
from utils.driver_factory import create_driver
from utils.test_helpers import capture_screenshot

@pytest.fixture(scope="function")
def driver(request):
    """Initializes browser driver for each test function and captures screenshot on failure."""
    driver_instance = create_driver()
    yield driver_instance

    # Capture screenshot if test failed
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        test_name = request.node.name
        capture_screenshot(driver_instance, f"FAIL_{test_name}")

    driver_instance.quit()

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, "rep_" + rep.when, rep)
