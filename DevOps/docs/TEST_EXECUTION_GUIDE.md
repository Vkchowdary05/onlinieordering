# MediCare Hospital Automation Testing Guide

## 1. Overview
The MediCare automated testing suite is built using **Python 3**, **Selenium WebDriver**, **pytest**, and **webdriver-manager**. It directly targets the actual application frontend routes and user flows, testing end-to-end interactions across both Patient and Administrator workflows.

---

## 2. Test Case Matrix

| Test ID | Test Scenario | Steps | Expected Result | Selector / Validation Marker |
|---|---|---|---|---|
| **TC01** | Patient Registration | Open Auth Modal -> Switch to Register -> Enter Name, Email, Phone -> Submit | Patient successfully registered, greeting contains patient name | `[data-testid="patient-greeting"]` |
| **TC02** | Patient Login | Open Auth Modal -> Enter demo credentials -> Submit | Patient dashboard rendered with greeting & metrics | `[data-testid="patient-greeting"]` contains "Sarah Connor" |
| **TC03** | Search Doctor | Navigate to `/doctors` -> Search "Evelyn Reed" -> Click Profile | Doctor card filtered, Doctor Details Modal rendered | `[data-testid="doctor-details-modal"]` with Dr. Evelyn Reed |
| **TC04** | Book Available Slot | Navigate to `/book` -> Select Doctor -> Pick future date -> Pick green slot -> Enter reason -> Confirm | Appointment confirmed, Reference ID issued | `[data-testid="booking-reference-id"]` matches `APT-` |
| **TC05** | Book Occupied Slot | Navigate to `/book` -> Select date with booked slots -> Inspect slot | Occupied slot button is marked "Booked" and disabled | `[data-testid="slot-button-booked"][disabled]` |
| **TC06** | Cancel Appointment | Navigate to `/appointments` -> Find confirmed appointment -> Click Cancel -> Enter Reason -> Confirm | Appointment cancelled, status updated or cancelled toast | `[data-testid="cancel-modal"]`, status update verified |
| **TC07** | View Appointments | Navigate to `/appointments` -> Inspect appointment cards | List of cards rendered with valid ID, Doctor Name, Status badge | `[data-testid="appointment-card"]`, ID, Doctor, Status badges |

---

## 3. Prerequisites

- Python 3.10+ (tested with Python 3.14)
- Google Chrome or Microsoft Edge browser installed
- Running MediCare application on `http://localhost:3000` (via Docker Compose, Docker container, or `npm run dev`)

---

## 4. Environment Setup

1. **Navigate to the test directory**:
   ```bash
   cd DevOps/tests
   ```

2. **Create and activate a virtual environment (optional but recommended)**:
   ```bash
   # Windows PowerShell
   python -m venv .venv
   .venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

---

## 5. Execution Commands

### Running with Pytest (Generates HTML and JUnit Reports)
```bash
# Headless mode (default in CI/CD)
python -m pytest DevOps/tests/test_medicare_suite.py -v --html=DevOps/tests/reports/report.html --self-contained-html

# Headful mode (with visible browser window for debugging)
$env:HEADLESS_BROWSER="false" # PowerShell
python -m pytest DevOps/tests/test_medicare_suite.py -v -s
```

### Running with Standalone Test Runner
```bash
python DevOps/tests/run_tests.py
```

### Running against a Custom Host or Port
```bash
$env:MEDICARE_BASE_URL="http://192.168.1.50:8080" # PowerShell
python DevOps/tests/run_tests.py
```

---

## 6. Test Artifacts & Screenshots

- **HTML Report**: `DevOps/tests/reports/report.html` (interactive report with timing, log output, and status).
- **Summary Report**: `DevOps/tests/reports/summary.txt`.
- **Failure Screenshots**: If any assertion fails, a full-page PNG screenshot is automatically saved into:
  ```
  DevOps/tests/screenshots/FAIL_<TestName>_<Timestamp>.png
  ```
