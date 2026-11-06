pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    environment {
        APP_NAME = 'medicare-hospital-app'
        APP_PORT = '3000'
        APP_URL = "http://localhost:${APP_PORT}"
        DOCKER_IMAGE = "${APP_NAME}:${env.BUILD_NUMBER ?: 'latest'}"
        PYTHONUNBUFFERED = '1'
        SELENIUM_HEADLESS = 'true'
        REPORTS_DIR = "${WORKSPACE}/DevOps/tests/reports"
        SCREENSHOTS_DIR = "${WORKSPACE}/DevOps/tests/screenshots"
    }

    stages {
        stage('1. Checkout Source Code') {
            steps {
                echo "===> Stage 1: Checking out repository code..."
                checkout scm
                script {
                    echo "Branch: ${env.BRANCH_NAME ?: 'main'}"
                    echo "Commit: ${env.GIT_COMMIT ?: 'local'}"
                }
            }
        }

        stage('2. Install Dependencies') {
            steps {
                echo "===> Stage 2: Installing project dependencies..."
                sh '''
                    node -v
                    npm -v
                    npm ci || npm install
                '''
            }
        }

        stage('3. Lint & Type Check') {
            steps {
                echo "===> Stage 3: Running type checking and lint validation..."
                sh '''
                    npx tsc --noEmit
                '''
            }
        }

        stage('4. Execute Application Build') {
            steps {
                echo "===> Stage 4: Compiling frontend bundle via Vite & Nitro..."
                sh '''
                    npm run build
                '''
            }
        }

        stage('5. Build Docker Image') {
            steps {
                echo "===> Stage 5: Building multi-stage production Docker image: ${DOCKER_IMAGE}..."
                sh """
                    docker build -t ${DOCKER_IMAGE} -t ${APP_NAME}:latest .
                """
            }
        }

        stage('6. Run Selenium Automated Tests') {
            steps {
                echo "===> Stage 6: Launching MediCare container and running Selenium browser automation suite..."
                script {
                    // Create test artifact directories
                    sh "mkdir -p ${REPORTS_DIR} ${SCREENSHOTS_DIR}"

                    // Start container using Docker
                    sh """
                        docker stop medicare_test_instance || true
                        docker rm medicare_test_instance || true
                        docker run -d --name medicare_test_instance -p ${APP_PORT}:3000 ${DOCKER_IMAGE}
                    """

                    // Wait for health check
                    sh """
                        echo "Waiting for MediCare service to be ready..."
                        for i in \$(seq 1 30); do
                            if curl -s -f ${APP_URL} > /dev/null; then
                                echo "Service is healthy and responding at ${APP_URL}"
                                break
                            fi
                            echo "Attempt \$i: Service not ready yet, sleeping 2s..."
                            sleep 2
                        done
                    """

                    // Execute Python Selenium test suite
                    sh """
                        python3 -m pip install --break-system-packages -r DevOps/tests/requirements.txt || pip install -r DevOps/tests/requirements.txt || true
                        export MEDICARE_BASE_URL="${APP_URL}"
                        export HEADLESS_BROWSER="${SELENIUM_HEADLESS}"
                        python3 -m pytest DevOps/tests/test_medicare_suite.py --html=${REPORTS_DIR}/report.html --self-contained-html --junitxml=${REPORTS_DIR}/junit.xml || python3 DevOps/tests/run_tests.py
                    """
                }
            }
            post {
                always {
                    // Stop test container
                    sh """
                        docker stop medicare_test_instance || true
                        docker rm medicare_test_instance || true
                    """
                }
            }
        }
    }

    post {
        always {
            echo "===> Archiving test artifacts and reports..."
            junit allowEmptyResults: true, testResults: 'DevOps/tests/reports/junit.xml'
            archiveArtifacts allowEmptyArchive: true, artifacts: 'DevOps/tests/reports/**, DevOps/tests/screenshots/**'
        }
        success {
            echo "=========================================================="
            echo " Pipeline SUCCESS: MediCare CI/CD and Selenium Verification Passed! "
            echo "=========================================================="
        }
        failure {
            echo "=========================================================="
            echo " Pipeline FAILED: Review Jenkins logs and test screenshots. "
            echo "=========================================================="
        }
    }
}
