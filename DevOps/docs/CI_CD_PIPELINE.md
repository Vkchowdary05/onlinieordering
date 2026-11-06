# MediCare Hospital Appointment Booking System - CI/CD Pipeline Documentation

## 1. Overview
The MediCare Continuous Integration & Continuous Delivery (CI/CD) pipeline is defined declaratively in `Jenkinsfile` (and mirrored in `DevOps/Jenkinsfile`). It automates the complete lifecycle from source code checkout, dependency validation, TypeScript linting, production SSR compilation via TanStack Start & Nitro, containerization via multi-stage Docker builds, through to headless browser-level Selenium validation.

```
+------------------+    +----------------------+    +--------------------+
| 1. SCM Checkout  | -> | 2. Dependencies (npm)| -> | 3. Lint/Type Check |
+------------------+    +----------------------+    +--------------------+
                                                              |
                                                              v
+------------------+    +----------------------+    +--------------------+
| 6. Selenium Test | <- | 5. Docker Build      | <- | 4. Vite/Nitro Build|
+------------------+    +----------------------+    +--------------------+
         |
         v
+------------------+
| 7. Report Status |
+------------------+
```

---

## 2. Pipeline Stages

### Stage 1: Checkout Source Code
- Pulls the current branch and commit SHA from the repository.
- Logs git metadata (`BRANCH_NAME`, `GIT_COMMIT`).

### Stage 2: Install Dependencies
- Validates Node.js and npm versions.
- Installs all dependencies with `npm ci` (or `npm install`).
- Ensures required devDependencies (`@tanstack/react-start`, `nitro`, `vite`, `tailwindcss`, `lucide-react`, `framer-motion`) are present.

### Stage 3: Lint & Type Check
- Runs TypeScript compiler validation in no-emit mode:
  ```bash
  npx tsc --noEmit
  ```
- Ensures all strict TypeScript definitions across `src/types/medicare.ts`, `src/context/MediCareContext.tsx`, and view components conform to the type schema.

### Stage 4: Execute Application Build
- Executes the production compilation:
  ```bash
  npm run build
  ```
- Outputs the standalone Nitro server into `.output/server/index.mjs` and static client assets into `.output/public/`.

### Stage 5: Build Docker Image
- Executes multi-stage Docker build:
  ```bash
  docker build -t ${DOCKER_IMAGE} -t medicare-hospital-app:latest .
  ```
- Uses Alpine Linux base (`node:22-alpine`) with non-root security privileges (`medicare:nodejs`, UID 1001).
- Generates an immutable image tag corresponding to `${BUILD_NUMBER}`.

### Stage 6: Run Selenium Automated Tests
- Spins up an isolated test instance of the MediCare container:
  ```bash
  docker run -d --name medicare_test_instance -p 3000:3000 medicare-hospital-app:latest
  ```
- Polls the HTTP health check endpoint until HTTP 200 is confirmed.
- Installs Python automation dependencies (`selenium`, `webdriver-manager`, `pytest`, `pytest-html`).
- Executes the 7 test scenarios in headless mode (`HEADLESS_BROWSER=true`).
- Automatically captures full-resolution screenshots upon test failure.
- Shuts down and cleans up the test container in the post-step hook.

### Stage 7: Pipeline Reporting & Post Actions
- Generates JUnit test results (`DevOps/tests/reports/junit.xml`).
- Publishes self-contained HTML test execution report (`DevOps/tests/reports/report.html`).
- Archives failure screenshots into Jenkins build artifacts.
- Notifies build status (SUCCESS / FAILURE).

---

## 3. Environment Variables & Credentials Management

The pipeline uses environment variables to avoid hardcoded credentials:

| Variable | Default Value | Description |
|---|---|---|
| `APP_NAME` | `medicare-hospital-app` | Service and image name identifier |
| `APP_PORT` | `3000` | Target port exposed by container |
| `APP_URL` | `http://localhost:3000` | Target URL tested by Selenium |
| `DOCKER_IMAGE` | `medicare-hospital-app:latest` | Target image tag |
| `HEADLESS_BROWSER` | `true` | Runs Chrome/Edge in headless mode without GUI |
| `MEDICARE_PORT` | `3000` | Host port mapped by Docker Compose |

### Best Practices:
- Sensitive registry credentials should be injected via Jenkins Credentials Store using `withCredentials([usernamePassword(...)])`.
- Avoid storing tokens, API secrets, or passwords in repository files or Docker images.

---

## 4. Setup in Jenkins

1. **Prerequisites on Jenkins Controller / Agent**:
   - Docker installed with permissions for the `jenkins` user (`usermod -aG docker jenkins`).
   - Python 3.10+ installed with `pip`.
   - Google Chrome or Microsoft Edge installed (with Chromium drivers auto-managed by `webdriver-manager`).
   - Node.js 20+ installed.

2. **Creating the Job**:
   - Go to Jenkins -> **New Item** -> Select **Pipeline**.
   - Under **Pipeline Definition**, select **Pipeline script from SCM**.
   - Choose **Git**, enter repository URL and branch (`main`).
   - Specify Script Path: `Jenkinsfile` (or `DevOps/Jenkinsfile`).
   - Save and click **Build Now**.
