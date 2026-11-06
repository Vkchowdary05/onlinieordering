# MediCare Hospital Appointment Booking System

> Enterprise-grade Hospital Appointment Booking & Healthcare Dashboard built with TanStack Start, Nitro, React 19, Tailwind CSS v4, Lucide Icons, and Creative Tim UI styling adhering to Dashboard V14 design specifications.

---

## 🏥 Features & Modules

### Patient Portal
- **Authentication**: Seamless Registration and Login modal with persistent session storage.
- **Patient Dashboard**: Real-time biometric metrics, upcoming appointments, health goals, and quick actions.
- **Doctor Directory**: 12+ specialized physicians with search by name, department, specialization, and full modal profile view.
- **Appointment Booking Flow**: 4-step interactive wizard:
  1. Doctor selection
  2. Date & slot picker (with real-time double-booking prevention and past-date validation)
  3. Patient contact details & visit reason
  4. Confirmation & immediate reference code generation (`APT-XXXXXX`)
- **My Appointments**: Real-time schedule list, appointment status badges (Confirmed, Pending, Cancelled), cancellation with reason input, and rescheduling.
- **Patient Profile**: Edit personal information, medical history, blood type, emergency contacts, and allergies.
- **Health Goals**: Interactive radial goal progress trackers and weekly activity statistics.

### Admin Dashboard
- **Executive Overview**: Total appointments, active patients, doctor capacity, and hospital operations stats.
- **Appointment Management**: Filter by status (Confirmed, Pending, Cancelled) and live search by patient or doctor.
- **Doctor Management**: Directory with active/on-duty status toggles and full doctor metadata.
- **Patient Records**: Searchable list of registered patients, emergency contacts, and appointment counts.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+ (Node 22 recommended)
- npm 10+

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Access in browser
# http://localhost:3000
```

### Production Build
```bash
# Build the production application bundle
npm run build

# Run the standalone Nitro server
node .output/server/index.mjs
```

---

## 🐳 Docker Deployment

The application features a production-ready, multi-stage Dockerfile (`node:22-alpine`) utilizing a non-root `medicare` user and standalone Nitro output.

### Build and Run Docker Image
```bash
# Build the Docker image
docker build -t medicare-hospital-app:latest .

# Run the container
docker run -d --name medicare-app -p 3000:3000 medicare-hospital-app:latest

# Check logs
docker logs -f medicare-app

# Stop container
docker stop medicare-app && docker rm medicare-app
```

---

## 📦 Docker Compose Deployment

Docker Compose coordinates service configuration, port mapping, and automatic container health checks.

```bash
# Start service in detached mode
docker compose up -d

# Verify container status and health
docker compose ps

# View real-time logs
docker compose logs -f

# Stop and remove containers
docker compose down
```

---

## 🔄 Jenkins CI/CD Pipeline

The project includes a production-grade declarative `Jenkinsfile` implementing 7 pipeline stages:

1. **Checkout Source Code**: Clones the repository and logs branch/commit metadata.
2. **Install Dependencies**: Runs `npm install` / `npm ci`.
3. **Lint & Type Check**: Validates strict TypeScript compilation (`npx tsc --noEmit`).
4. **Execute Application Build**: Compiles frontend assets and Nitro server bundle (`npm run build`).
5. **Build Docker Image**: Constructs multi-stage container image (`medicare-hospital-app:latest`).
6. **Run Selenium Automated Tests**:
   - Launches a containerized test instance.
   - Waits for HTTP health check.
   - Executes the 7 Selenium browser tests in headless mode.
   - Captures automated screenshots on test failure.
   - Tears down test container.
7. **Report Pipeline Success or Failure**: Generates JUnit XML and publishes HTML test reports.

For detailed pipeline configuration, see [DevOps/docs/CI_CD_PIPELINE.md](file:///E:/DEVOPS_PROJECTS_INTERNAL/DevOps/docs/CI_CD_PIPELINE.md).

---

## 🧪 Automated Selenium Testing

The automated testing suite verifies critical patient journeys and safeguards against business logic violations (double-booking and invalid dates).

### Test Case Coverage

| Test ID | Scenario | Expected Result |
|---|---|---|
| **TC01** | Patient registration | Registration successful & greeting displayed |
| **TC02** | Patient login | Dashboard displayed with authenticated user |
| **TC03** | Search doctor | Doctor directory filtered & details modal displayed |
| **TC04** | Book available slot | 4-step wizard completed & appointment confirmed |
| **TC05** | Book occupied slot | Occupied slot disabled & double-booking rejected |
| **TC06** | Cancel appointment | Reason modal confirmed & appointment cancelled |
| **TC07** | View appointments | List of appointments rendered with correct details |

### Running the Tests

```bash
# 1. Install test dependencies
pip install -r DevOps/tests/requirements.txt

# 2. Run with Pytest (Generates HTML Report)
python -m pytest DevOps/tests/test_medicare_suite.py -v --html=DevOps/tests/reports/report.html --self-contained-html

# 3. Alternatively, run via standalone test runner
python DevOps/tests/run_tests.py
```

### Test Configuration Options
- `MEDICARE_BASE_URL`: Base application URL (Default: `http://localhost:3000`).
- `HEADLESS_BROWSER`: Set to `false` for visible browser window, `true` for headless mode (Default: `true`).

For comprehensive instructions, see [DevOps/docs/TEST_EXECUTION_GUIDE.md](file:///E:/DEVOPS_PROJECTS_INTERNAL/DevOps/docs/TEST_EXECUTION_GUIDE.md).

---

## 📁 DevOps Directory Structure

```
DevOps/
├── docker/
│   ├── Dockerfile             # Multi-stage production Docker build
│   └── .dockerignore          # Build context exclusion rules
├── docker-compose.yml         # Container orchestration & health check
├── Jenkinsfile                # Declarative 7-stage CI/CD pipeline
├── docs/
│   ├── CI_CD_PIPELINE.md      # Pipeline architecture & Jenkins guide
│   └── TEST_EXECUTION_GUIDE.md# Testing setup and test case specifications
└── tests/
    ├── requirements.txt       # Python dependencies
    ├── conftest.py            # Pytest fixtures & screenshot hooks
    ├── test_medicare_suite.py # TC01 - TC07 test case implementations
    ├── run_tests.py           # Standalone automated test runner
    ├── utils/
    │   ├── driver_factory.py  # Cross-platform Chrome/Edge driver manager
    │   └── test_helpers.py    # Robust explicit waits & actions
    ├── reports/               # HTML and JUnit execution reports
    └── screenshots/           # Timestamped failure captures
```
