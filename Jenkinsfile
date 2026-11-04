pipeline {
    agent any

    environment {
        PROJECT_NAME = 'TaskFlow'
        NODE_ENV     = 'production'
    }

    options {
        timeout(time: 20, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
    }

    stages {
        stage('Source Code Checkout') {
            steps {
                echo "=================================================="
                echo " [STAGE 1] Checking Out TaskFlow Source Code"
                echo "=================================================="
                // Display current git commit details
                bat '''
                    @echo off
                    echo Repository Source Information:
                    git remote -v
                    echo.
                    echo Latest Commit:
                    git log -1 --pretty=format:"Commit: %%h %%nAuthor: %%an %%nDate:   %%ad %%nMessage: %%s" --date=iso
                    echo.
                '''
            }
        }

        stage('Dependency Installation') {
            steps {
                echo "=================================================="
                echo " [STAGE 2] Installing Dependencies (Frontend & Backend)"
                echo "=================================================="
                bat '''
                    @echo off
                    echo --- Installing Frontend Dependencies ---
                    cd frontend
                    if exist package-lock.json (
                        echo Found package-lock.json. Running npm ci...
                        call npm ci
                    ) else (
                        echo package-lock.json not found. Running npm install...
                        call npm install
                    )
                    if %ERRORLEVEL% NEQ 0 (
                        echo [ERROR] Frontend dependency installation failed!
                        exit /b %ERRORLEVEL%
                    )
                    cd ..

                    echo.
                    echo --- Installing Backend Dependencies ---
                    cd backend
                    if exist package-lock.json (
                        echo Found package-lock.json. Running npm ci...
                        call npm ci
                    ) else (
                        echo package-lock.json not found. Running npm install...
                        call npm install
                    )
                    if %ERRORLEVEL% NEQ 0 (
                        echo [ERROR] Backend dependency installation failed!
                        exit /b %ERRORLEVEL%
                    )
                    cd ..
                    echo [SUCCESS] Dependencies installed successfully.
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                echo "=================================================="
                echo " [STAGE 3] Building React Frontend Production Bundle"
                echo "=================================================="
                bat '''
                    @echo off
                    cd frontend
                    echo Running: npm run build
                    call npm run build
                    if %ERRORLEVEL% NEQ 0 (
                        echo [ERROR] Frontend production build failed!
                        exit /b %ERRORLEVEL%
                    )
                    cd ..

                    echo.
                    echo Verifying build output in frontend\\dist...
                    if not exist "frontend\\dist\\index.html" (
                        echo [ERROR] Build verification failed: frontend\\dist\\index.html not found!
                        exit /b 1
                    )
                    echo [SUCCESS] Frontend build verified. Assets created in frontend\\dist directory.
                    dir "frontend\\dist"
                '''
            }
        }

        stage('Backend Validation and Testing') {
            steps {
                echo "=================================================="
                echo " [STAGE 4] Validating Backend Syntax and Architecture"
                echo "=================================================="
                bat '''
                    @echo off
                    echo Running Node.js JavaScript syntax verification...
                    node -c backend\\src\\server.js
                    if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

                    node -c backend\\src\\config\\db.js
                    if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

                    node -c backend\\src\\models\\Task.js
                    if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

                    node -c backend\\src\\routes\\taskRoutes.js
                    if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

                    node -c backend\\src\\controllers\\taskController.js
                    if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

                    node -c backend\\src\\middleware\\validate.js
                    if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

                    node -c backend\\src\\middleware\\errorHandler.js
                    if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

                    echo.
                    echo [SUCCESS] Backend syntax validation passed with zero errors.
                '''
            }
        }

        stage('Frontend Testing') {
            steps {
                echo "=================================================="
                echo " [STAGE 5] Frontend Test Suite Check"
                echo "=================================================="
                bat '''
                    @echo off
                    echo Checking frontend/package.json for configured test runner...
                    findstr /C:"\"test\"" frontend\\package.json >nul 2>&1
                    if %ERRORLEVEL% EQU 0 (
                        echo Running frontend tests...
                        cd frontend && call npm test && cd ..
                    ) else (
                        echo [NOTICE] No automated frontend test suite is currently configured in frontend\\package.json.
                        echo [INFO] Skipping frontend unit testing stage safely.
                    )
                '''
            }
        }

        stage('Docker Image Build') {
            steps {
                echo "=================================================="
                echo " [STAGE 6] Building Docker Images via Docker Compose"
                echo "=================================================="
                bat '''
                    @echo off
                    echo Building container images for TaskFlow services...
                    docker-compose build
                    if %ERRORLEVEL% NEQ 0 (
                        echo [ERROR] Docker Compose build failed!
                        exit /b %ERRORLEVEL%
                    )
                    echo [SUCCESS] TaskFlow Docker images built successfully.
                    docker images | findstr /I "taskflow"
                '''
            }
        }

        stage('Deployment') {
            steps {
                echo "=================================================="
                echo " [STAGE 7] Deploying TaskFlow Application with Docker Compose"
                echo "=================================================="
                bat '''
                    @echo off
                    echo Stopping any existing TaskFlow containers...
                    docker-compose down --remove-orphans

                    echo.
                    echo Starting fresh TaskFlow stack in detached mode...
                    docker-compose up -d
                    if %ERRORLEVEL% NEQ 0 (
                        echo [ERROR] Docker Compose deployment failed to start!
                        exit /b %ERRORLEVEL%
                    )
                    echo [SUCCESS] TaskFlow services initiated.
                '''
            }
        }

        stage('Deployment Verification') {
            steps {
                echo "=================================================="
                echo " [STAGE 8] Verifying Live Deployment & Health Endpoints"
                echo "=================================================="
                bat '''
                    @echo off
                    echo Waiting 12 seconds for MongoDB, Backend, and Nginx to initialize...
                    powershell -Command "Start-Sleep -Seconds 12"

                    echo.
                    echo --- Checking Container Status ---
                    docker ps --filter "name=taskflow" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

                    echo.
                    echo --- Verifying Backend Health Check (GET /api/health) ---
                    powershell -Command ^
                        "try { " ^
                        "  $res = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -TimeoutSec 10; " ^
                        "  if ($res.status -eq 'ok') { " ^
                        "    Write-Host '[PASS] Backend API is healthy: ' ($res | ConvertTo-Json -Compress); " ^
                        "  } else { " ^
                        "    Write-Error '[FAIL] Backend returned unexpected status'; exit 1 " ^
                        "  } " ^
                        "} catch { " ^
                        "  Write-Error ('[FAIL] Could not reach backend: ' + $_.Exception.Message); exit 1 " ^
                        "}"
                    if %ERRORLEVEL% NEQ 0 (
                        echo [ERROR] Backend health verification failed!
                        docker logs taskflow-backend --tail 30
                        exit /b 1
                    )

                    echo.
                    echo --- Verifying Frontend Nginx Service (GET http://localhost:80 or :3000) ---
                    powershell -Command ^
                        "try { " ^
                        "  $res = Invoke-WebRequest -Uri 'http://localhost:80' -UseBasicParsing -TimeoutSec 10; " ^
                        "  if ($res.StatusCode -eq 200) { " ^
                        "    Write-Host '[PASS] Frontend web server is serving content on port 80 (HTTP 200 OK)'; " ^
                        "  } else { " ^
                        "    Write-Error '[FAIL] Frontend returned HTTP status ' $res.StatusCode; exit 1 " ^
                        "  } " ^
                        "} catch { " ^
                        "  try { " ^
                        "    $res2 = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 10; " ^
                        "    Write-Host '[PASS] Frontend web server is accessible on port 3000 (HTTP 200 OK)'; " ^
                        "  } catch { " ^
                        "    Write-Error ('[FAIL] Could not reach frontend: ' + $_.Exception.Message); exit 1 " ^
                        "  } " ^
                        "}"
                    if %ERRORLEVEL% NEQ 0 (
                        echo [ERROR] Frontend verification failed!
                        docker logs taskflow-frontend --tail 30
                        exit /b 1
                    )

                    echo.
                    echo [SUCCESS] All TaskFlow services are verified, healthy, and operational!
                '''
            }
        }
    }

    post {
        always {
            echo "Archiving production build artifacts..."
            archiveArtifacts artifacts: 'frontend/dist/**', allowEmptyArchive: true
        }
        success {
            echo "================================================================="
            echo " [PIPELINE SUCCESS] TaskFlow CI/CD Pipeline Completed Successfully!"
            echo " Frontend: http://localhost:80 or http://localhost:3000"
            echo " Backend API: http://localhost:5000/api/health"
            echo "================================================================="
        }
        failure {
            echo "================================================================="
            echo " [PIPELINE FAILED] TaskFlow CI/CD Pipeline Encountered an Error!"
            echo " Please review the Console Output for detailed stage logs."
            echo "================================================================="
        }
    }
}
