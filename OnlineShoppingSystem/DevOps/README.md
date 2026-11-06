# DevOps Tools & Automated Testing Guide — NovaStore

Comprehensive DevOps documentation for the **NovaStore Online Shopping & Order Management System**, covering Docker containerization, Jenkins CI/CD pipeline automation, and Selenium headless end-to-end testing.

---

## 1. Automated Test Suite (Selenium & Pytest)

The automated test suite directly implements the project test matrix:

| Test ID | Test case | Expected result | Automated Status |
| :--- | :--- | :--- | :---: |
| **TC01** | Customer login | Login successful | **PASSED** ✅ |
| **TC02** | Search product | Product displayed | **PASSED** ✅ |
| **TC03** | Add product to cart | Product added | **PASSED** ✅ |
| **TC04** | Update quantity | Cart updated | **PASSED** ✅ |
| **TC05** | Remove product | Product removed | **PASSED** ✅ |
| **TC06** | Checkout | Order placed | **PASSED** ✅ |
| **TC07** | View order history | Order details displayed | **PASSED** ✅ |

### Running the Test Suite

```bash
# Navigate to the test directory
cd OnlineShoppingSystem/DevOps/tests

# Install Python test requirements
pip install -r requirements.txt

# Run all 7 test cases with HTML report generation
python -m pytest test_shopping_suite.py -v --html=reports/report.html --self-contained-html
```

Or execute via the unified test runner:
```bash
python run_tests.py
```

An interactive, self-contained HTML report is automatically compiled into:
`OnlineShoppingSystem/DevOps/tests/reports/report.html`

---

## 2. Docker Containerization

The project uses a high-performance, multi-stage production Docker setup:
- **Builder Stage**: `node:22-alpine` compiles TypeScript and Vite static assets.
- **Production Stage**: `nginx:alpine` serves compressed static assets with custom security headers and SPA routing rules.
- **Healthcheck**: Built-in container health check endpoint `/healthz`.

### Building and Running with Docker:

```bash
# Navigate to the project root
cd OnlineShoppingSystem

# Build the production Docker image
docker build -t onlineshopping-system:latest .

# Run the container mapping host port 8080
docker run -d --name onlineshopping-app -p 8080:80 onlineshopping-system:latest

# Verify container health
curl http://localhost:8080/healthz
```

### Running with Docker Compose:

```bash
# Start the shopping web service
docker compose up -d shopping-web

# Or launch both web app and Selenium Grid
docker compose --profile test up -d
```

---

## 3. Jenkins CI/CD Pipeline (`Jenkinsfile`)

A declarative Jenkins pipeline orchestrates the entire continuous delivery lifecycle:

### Pipeline Stages:
1. **Pre-flight & Environment Inspection**: Checks Node, Python, and Docker environments.
2. **Install Dependencies**: Installs project packages with `npm ci`.
3. **Static Analysis & Production Build**: Runs `npm run build` (TypeScript verification + asset bundling).
4. **Build Docker Container**: Builds `onlineshopping-system:latest`, launches container on port 8080, and polls the `/healthz` endpoint.
5. **Selenium Automated Testing (TC01-TC07)**: Executes all 7 functional test cases against the live container.
6. **Publish Test Reports & Artifacts**: Archives test logs and publishes the Pytest HTML report.
7. **Cleanup**: Shuts down test containers upon completion.
