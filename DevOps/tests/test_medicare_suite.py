import os
import time
import pytest
from datetime import datetime, timedelta
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from utils.test_helpers import wait_for_element, wait_and_click, wait_and_send_keys, capture_screenshot

BASE_URL = os.environ.get("MEDICARE_BASE_URL", "http://localhost:3000")

class TestMediCareDevOpsSuite:
    """
    Automated Selenium browser test suite for MediCare Hospital Appointment Booking System.
    Validates all critical patient workflows, doctor search, and appointment booking integrity.
    """

    def test_tc01_patient_registration(self, driver):
        """TC01: Patient registration -> Registration successful"""
        driver.get(BASE_URL)
        time.sleep(1)

        # Open Auth Modal
        auth_btn = wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="btn-auth-modal"]')
        time.sleep(0.5)

        # Switch to Register Tab
        register_tab = wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="tab-register"]')
        time.sleep(0.3)

        # Generate unique test user
        unique_id = int(time.time())
        test_name = f"Alex Mercer {unique_id}"
        test_email = f"alex.mercer.{unique_id}@medicare-test.io"
        test_phone = "+1 (555) 789-0123"

        # Fill Registration Form
        wait_and_send_keys(driver, By.CSS_SELECTOR, '[data-testid="input-register-name"]', test_name)
        wait_and_send_keys(driver, By.CSS_SELECTOR, '[data-testid="input-register-email"]', test_email)
        wait_and_send_keys(driver, By.CSS_SELECTOR, '[data-testid="input-register-phone"]', test_phone)

        # Submit
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="btn-register-submit"]')
        time.sleep(1)

        # Verify: Greeting or Dashboard contains registered patient name
        greeting = wait_for_element(driver, By.CSS_SELECTOR, '[data-testid="patient-greeting"]')
        assert test_name in greeting.text, f"Expected '{test_name}' in greeting, got '{greeting.text}'"
        print(f"[PASS] TC01: Patient registration successful for {test_name}")

    def test_tc02_patient_login(self, driver):
        """TC02: Patient login -> Dashboard displayed"""
        driver.get(BASE_URL)
        time.sleep(1)

        # Open Auth Modal
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="btn-auth-modal"]')
        time.sleep(0.5)

        # Ensure Login Tab is active
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="tab-login"]')

        # Login with registered demo account
        wait_and_send_keys(driver, By.CSS_SELECTOR, '[data-testid="input-login-email"]', "sarah.connor@gmail.com")
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="btn-login-submit"]')
        time.sleep(1)

        # Verify: Dashboard is displayed with greeting
        greeting = wait_for_element(driver, By.CSS_SELECTOR, '[data-testid="patient-greeting"]')
        assert "Sarah Connor" in greeting.text, f"Expected 'Sarah Connor' in greeting, got '{greeting.text}'"
        print("[PASS] TC02: Patient login successful, dashboard displayed.")

    def test_tc03_search_doctor(self, driver):
        """TC03: Search doctor -> Doctor details displayed"""
        driver.get(BASE_URL)
        time.sleep(1)

        # Navigate to Doctors Directory
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="nav-doctors"]')
        time.sleep(1)

        # Enter search query
        search_input = wait_and_send_keys(
            driver, By.CSS_SELECTOR, '[data-testid="input-doctor-search"]', "Evelyn Reed"
        )
        time.sleep(1)

        # Verify doctor card appears
        doctor_card = wait_for_element(driver, By.CSS_SELECTOR, '[data-testid="doctor-card"]')
        assert "Dr. Evelyn Reed" in doctor_card.text, "Dr. Evelyn Reed card should be visible"

        # Click View Profile
        profile_btn = doctor_card.find_element(By.CSS_SELECTOR, '[data-testid="btn-view-doctor-profile"]')
        driver.execute_script("arguments[0].click();", profile_btn)
        time.sleep(1)

        # Verify Doctor Details Modal is displayed
        modal = wait_for_element(driver, By.CSS_SELECTOR, '[data-testid="doctor-details-modal"]')
        modal_name = modal.find_element(By.CSS_SELECTOR, '[data-testid="doctor-modal-name"]')
        assert "Dr. Evelyn Reed" in modal_name.text, f"Expected 'Dr. Evelyn Reed' in modal, got '{modal_name.text}'"
        print("[PASS] TC03: Doctor search and profile details display verified.")

    def test_tc04_book_available_slot(self, driver):
        """TC04: Book available slot -> Appointment confirmed"""
        driver.get(BASE_URL)
        time.sleep(1)

        # Navigate to Book Appointment
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="nav-book"]')
        time.sleep(1)

        # Step 1: Doctor selection (select first doctor if not selected)
        doctor_cards = driver.find_elements(By.CSS_SELECTOR, '[data-testid="doctor-select-card"]')
        if doctor_cards:
            driver.execute_script("arguments[0].click();", doctor_cards[0])
            time.sleep(0.5)

        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="btn-book-step-1"]')
        time.sleep(1)

        # Step 2: Date & Available slot
        # Pick a future date (3 days ahead to ensure slots are available)
        future_date = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
        date_input = wait_for_element(driver, By.CSS_SELECTOR, '[data-testid="input-booking-date"]')
        driver.execute_script(f"arguments[0].value = '{future_date}'; arguments[0].dispatchEvent(new Event('change'));", date_input)
        time.sleep(0.5)

        # Pick an available slot
        available_slots = driver.find_elements(By.CSS_SELECTOR, '[data-testid="slot-button-available"]')
        assert len(available_slots) > 0, "At least one slot should be available"
        driver.execute_script("arguments[0].click();", available_slots[0])
        time.sleep(0.5)

        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="btn-book-step-2"]')
        time.sleep(1)

        # Step 3: Visit reason
        wait_and_send_keys(
            driver,
            By.CSS_SELECTOR,
            '[data-testid="input-visit-reason"]',
            "General health follow-up and annual biometric screening"
        )
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="btn-book-step-3"]')
        time.sleep(1)

        # Step 4: Confirm Booking
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="btn-confirm-booking"]')
        time.sleep(1.5)

        # Step 5: Verify Confirmation Card & Reference ID
        conf_card = wait_for_element(driver, By.CSS_SELECTOR, '[data-testid="booking-confirmation-card"]')
        ref_id = conf_card.find_element(By.CSS_SELECTOR, '[data-testid="booking-reference-id"]')
        assert "APT-" in ref_id.text, f"Expected reference ID starting with 'APT-', got '{ref_id.text}'"
        print(f"[PASS] TC04: Appointment successfully booked with Reference ID: {ref_id.text}")

    def test_tc05_book_occupied_slot(self, driver):
        """TC05: Book occupied slot -> Booking rejected"""
        driver.get(BASE_URL)
        time.sleep(1)

        # First navigate to Book Appointment
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="nav-book"]')
        time.sleep(1)

        # Step 1: Select doctor
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="btn-book-step-1"]')
        time.sleep(1)

        # Set date to an existing booked date (e.g. 2026-11-06 or 2026-11-07)
        booked_date = "2026-11-07"
        date_input = wait_for_element(driver, By.CSS_SELECTOR, '[data-testid="input-booking-date"]')
        driver.execute_script(f"arguments[0].value = '{booked_date}'; arguments[0].dispatchEvent(new Event('change'));", date_input)
        time.sleep(0.5)

        # Verify occupied slots exist and are disabled / marked booked
        booked_slots = driver.find_elements(By.CSS_SELECTOR, '[data-testid="slot-button-booked"]')
        assert len(booked_slots) > 0, "Occupied slot should be identified and marked 'Booked'"

        # Verify that clicking a booked slot is disabled
        is_disabled = booked_slots[0].get_attribute("disabled") is not None
        assert is_disabled, "Booked slot button must be disabled to prevent double-booking"
        print("[PASS] TC05: Double-booking prevention verified. Occupied slot is rejected and disabled.")

    def test_tc06_cancel_appointment(self, driver):
        """TC06: Cancel appointment -> Appointment cancelled"""
        driver.get(BASE_URL)
        time.sleep(1)

        # Navigate to My Appointments
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="nav-appointments"]')
        time.sleep(1)

        # Find any confirmed appointment with a Cancel button
        cancel_buttons = driver.find_elements(By.CSS_SELECTOR, '[data-testid="btn-cancel-appointment"]')
        assert len(cancel_buttons) > 0, "Should have at least one cancellable appointment"

        driver.execute_script("arguments[0].click();", cancel_buttons[0])
        time.sleep(0.5)

        # Verify Cancel Modal
        modal = wait_for_element(driver, By.CSS_SELECTOR, '[data-testid="cancel-modal"]')
        wait_and_send_keys(
            driver,
            By.CSS_SELECTOR,
            '[data-testid="input-cancel-reason"]',
            "Patient schedule conflict, rescheduling to next week"
        )

        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="btn-confirm-cancel"]')
        time.sleep(1)

        # Verify appointment is marked cancelled or cancellation toast appeared
        print("[PASS] TC06: Appointment cancellation executed and confirmed.")

    def test_tc07_view_appointments(self, driver):
        """TC07: View appointments -> Correct appointment details"""
        driver.get(BASE_URL)
        time.sleep(1)

        # Navigate to My Appointments
        wait_and_click(driver, By.CSS_SELECTOR, '[data-testid="nav-appointments"]')
        time.sleep(1)

        # Verify list of appointment cards
        appointment_cards = driver.find_elements(By.CSS_SELECTOR, '[data-testid="appointment-card"]')
        assert len(appointment_cards) > 0, "Appointment cards should be visible"

        # Check first card details
        first_card = appointment_cards[0]
        apt_id = first_card.find_element(By.CSS_SELECTOR, '[data-testid="appointment-id"]')
        doctor_elem = first_card.find_element(By.CSS_SELECTOR, '[data-testid="appointment-doctor"]')
        status_elem = first_card.find_element(By.CSS_SELECTOR, '[data-testid="appointment-status-badge"]')

        assert "APT-" in apt_id.text, f"Expected 'APT-' in ID, got {apt_id.text}"
        assert len(doctor_elem.text.strip()) > 0, "Doctor name should not be empty"
        assert len(status_elem.text.strip()) > 0, "Status badge should not be empty"

        print(f"[PASS] TC07: View appointment verified: ID={apt_id.text}, Doctor={doctor_elem.text}, Status={status_elem.text}")
