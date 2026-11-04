# DevOps Engineering Assignment Report

**Project Title**: Automated CI/CD Pipeline and Infrastructure as Code for Task Management System (TaskFlow)  
**Author**: Om Panchal  
**GitHub Repository**: [https://github.com/om9494/taskflow](https://github.com/om9494/taskflow)  
**Target Environment**: Local Windows 10/11 Workstation (No Cloud Costs / Local DevOps Demonstration)  

---

## 1. Assignment Title
**Design and Implementation of an Automated Declarative Jenkins CI/CD Pipeline and Terraform Infrastructure as Code for a Containerized MERN Stack Application (TaskFlow).**

---

## 2. Aim
To design, implement, and demonstrate a local, enterprise-grade DevOps workflow incorporating Continuous Integration, Continuous Delivery (CI/CD) via Jenkins, and automated Infrastructure as Code (IaC) via HashiCorp Terraform on Windows.

---

## 3. Objectives
1. **Source Code & Architecture Inspection**: Analyze the existing TaskFlow MERN (MongoDB, Express, React, Node.js) application structure without rewriting code.
2. **Continuous Integration**: Implement automated dependency installation, production bundle compilation, JavaScript syntax validation, and container image building using Jenkins.
3. **Continuous Deployment**: Automate container teardown, rebuilding, and deployment using Docker Compose.
4. **Automated Health Probing**: Implement pipeline verification steps that validate application readiness on live HTTP endpoints.
5. **Infrastructure as Code (IaC)**: Use Terraform with the official Docker provider to declaratively provision dedicated container networks, images, and isolated demonstration services on Windows.
6. **Academic Documentation & Viva Readiness**: Document all commands, execution outputs, troubleshooting techniques, and DevOps theoretical concepts.

---

## 4. Existing TaskFlow Project Description
**TaskFlow** is a modern, responsive full-stack task management system designed to track personal and team work items.
- **Frontend**: A React.js Single-Page Application (SPA) built using Vite, styled with custom CSS variables (modern blue & white theme), communicating via Axios with backend services.
- **Backend**: A modular Node.js Express REST API providing endpoints for task creation, retrieval, updates, status toggles, deletion, and health monitoring.
- **Database**: MongoDB instance maintaining task schemas with automated timestamps and persistent disk storage.
- **Containerization**: Dual Dockerfiles featuring a multi-stage frontend build (Node.js builder stage -> Nginx Alpine runtime) and a lightweight Node.js LTS backend image.

---

## 5. Technology Stack

| Layer | Technology | Version / Details |
| :--- | :--- | :--- |
| **Frontend** | React.js, Vite | React 18, Vite 5, Axios, React Icons |
| **Backend** | Node.js, Express.js | Express 4.21, Mongoose 8.8, CORS, Dotenv |
| **Database** | MongoDB | Version 6.0 LTS (with persistent volume) |
| **Reverse Proxy** | Nginx Alpine | Reverse proxying `/api/` to backend + SPA routing |
| **Container Engine** | Docker Desktop | Version 28.5 (Windows Named Pipe: `npipe:////./pipe/docker_engine`) |
| **Orchestration** | Docker Compose | Multi-container composition (`taskflow-network`, `mongodb_data`) |
| **CI/CD Automation**| Jenkins | Declarative Pipeline (`Jenkinsfile`) using Windows batch steps |
| **IaC** | HashiCorp Terraform | Terraform v1.14+, `kreuzwerker/docker` provider v3.0.2 |

---

## 6. CI/CD Architecture

```text
               +--------------------------------------------------+
               |          Developer Workspace (Git Push)          |
               +-------------------------+------------------------+
                                         |
                                         v
               +--------------------------------------------------+
               |        GitHub Repository (om9494/taskflow)       |
               +-------------------------+------------------------+
                                         | (Webhook / Poll SCM)
                                         v
   +-------------------------------------------------------------------------+
   |                        JENKINS CI/CD PIPELINE                           |
   |                                                                         |
   |  [Stage 1: Checkout]     git clone & display commit metadata            |
   |           |                                                             |
   |  [Stage 2: Install]      npm ci / npm install (frontend & backend)      |
   |           |                                                             |
   |  [Stage 3: Build]        npm run build (Vite -> dist/index.html)        |
   |           |                                                             |
   |  [Stage 4: Backend Test] node -c (syntax validation across routes)      |
   |           |                                                             |
   |  [Stage 5: Frontend Test]Check test suite presence                     |
   |           |                                                             |
   |  [Stage 6: Docker Build] docker-compose build (frontend & backend)      |
   |           |                                                             |
   |  [Stage 7: Deploy]       docker-compose up -d (redeploy containers)     |
   |           |                                                             |
   |  [Stage 8: Verify]       HTTP GET /api/health (status == ok)            |
   |           |                                                             |
   |  [Post-Build]            Archive dist/ & send execution summary         |
   +-------------------------------------------------------------------------+
                                         |
                                         v
   +-------------------------------------------------------------------------+
   |                       RUNNING LOCAL DOCKER ENGINE                       |
   |                                                                         |
   |   - taskflow-frontend  (:80, :3000)                                     |
   |   - taskflow-backend   (:5000)                                          |
   |   - taskflow-mongodb   (:27017)                                         |
   |   - taskflow-iac-demo  (:8088 - Provisioned via Terraform)              |
   +-------------------------------------------------------------------------+
```

---

## 7. Jenkins Pipeline Stage Explanation

1. **Source Code Checkout**: Pulls latest code from GitHub and prints `git log -1` to track build provenance.
2. **Dependency Installation**: Checks for `package-lock.json` and executes `npm ci` for deterministic, reproducible dependency installs, falling back to `npm install` if absent.
3. **Frontend Build**: Compiles React JSX and assets using Vite into static minified assets in `frontend/dist/`.
4. **Backend Validation**: Performs compilation checks (`node -c`) against `server.js`, controllers, models, and routes.
5. **Frontend Testing**: Inspects test configurations and executes tests if present, avoiding false pipeline aborts while reporting status accurately.
6. **Docker Image Build**: Pre-builds container images to ensure Dockerfile syntax, build arguments, and file copy operations are valid.
7. **Deployment**: Orchestrates zero-downtime recreation of application containers with `docker-compose down` followed by `docker-compose up -d`.
8. **Deployment Verification**: Issues automated HTTP requests to backend health endpoints (`http://localhost:5000/api/health`) and frontend services. Fails the build if services are unreachable.
9. **Post Actions**: Archives build artifacts (`frontend/dist/**`) and prints summary status logs.

---

## 8. Terraform Infrastructure Explanation

Terraform provides reproducible infrastructure independently of manual container commands:
- **`docker_image.nginx`**: Pulls `nginx:alpine` and guarantees image availability locally without repeated internet lookups.
- **`docker_network.taskflow_iac_network`**: Configures an isolated virtual bridge network to enforce network security.
- **`docker_container.taskflow_iac_container`**: Deploys an Nginx container on host port `8088`.
- **State File (`terraform.tfstate`)**: Acts as a single source of truth mapping declared HCL code to real Docker container identifiers.

---

## 9. Implementation Procedure

### Phase 1: CI/CD Pipeline
1. Authored `Jenkinsfile` utilizing declarative pipeline syntax with native Windows batch execution blocks (`bat`).
2. Configured Jenkins project as a **Pipeline script from SCM** pointing to `https://github.com/om9494/taskflow.git` on branch `main`.
3. Tested build execution through all 9 stages.

### Phase 2: Terraform Infrastructure
1. Created `terraform/` directory containing `main.tf`, `variables.tf`, and `outputs.tf`.
2. Initialized provider with `terraform init`.
3. Validated and formatted code with `terraform fmt` and `terraform validate`.
4. Planned and applied infrastructure with `terraform plan` and `terraform apply -auto-approve`.

---

## 10. Testing and Verification

| Test Item | Verification Command | Expected Output | Actual Result |
| :--- | :--- | :--- | :--- |
| **Frontend Build** | `cd frontend && npm run build` | `dist/index.html` created in < 2s | **PASS** (1.26s) |
| **Backend Syntax** | `node -c backend/src/server.js` | Exit code 0 | **PASS** (Zero errors) |
| **Backend Health** | `curl -s http://localhost:5000/api/health` | `{"status":"ok",...}` | **PASS** (HTTP 200 OK) |
| **Frontend UI** | `curl -I http://localhost:3000` | `HTTP/1.1 200 OK` | **PASS** (HTTP 200 OK) |
| **Terraform Plan** | `terraform plan` | Plan: 3 to add, 0 to change, 0 to destroy | **PASS** (3 resources) |
| **Terraform Apply** | `terraform apply -auto-approve` | Apply complete! Resources: 3 added | **PASS** (Container created) |
| **Terraform App** | `curl -I http://localhost:8088` | `HTTP/1.1 200 OK` (Nginx) | **PASS** (HTTP 200 OK) |

---

## 11. Expected Results
- All containers (`taskflow-frontend`, `taskflow-backend`, `taskflow-mongodb`, `taskflow-iac-demo`) execute concurrently on distinct ports without port collisions.
- The React application is accessible at `http://localhost:3000` or `http://localhost:80`.
- The Terraform demonstration is accessible at `http://localhost:8088`.
- The Jenkins pipeline passes cleanly through all stages with green status indicators.

---

## 12. Conclusion
The TaskFlow DevOps practical assignment successfully demonstrates an end-to-end automation workflow running on a personal Windows machine without requiring cloud accounts. By combining GitHub version control, Jenkins CI/CD automation, Docker containerization, and Terraform Infrastructure as Code, the project mirrors modern software delivery pipelines used across the software industry.

---

## 13. Viva Questions and Answers

### Q1: What is the difference between Continuous Integration (CI) and Continuous Deployment (CD)?
**Answer**: Continuous Integration (CI) is the practice of automatically checking out code, installing dependencies, compiling builds, and running tests whenever code is pushed to a repository. Continuous Deployment (CD) automatically releases and deploys the tested artifacts to production or target test environments without manual intervention.

### Q2: What is the purpose of a declarative Jenkins pipeline?
**Answer**: A declarative pipeline provides a structured, opinionated syntax for defining pipelines with predefined blocks (`pipeline`, `agent`, `stages`, `stage`, `steps`, `post`). It is easier to read, supports syntax validation before execution, and handles failure and post-actions cleanly compared to older scripted pipelines.

### Q3: Why did we use `npm ci` instead of `npm install` in the Jenkinsfile?
**Answer**: `npm ci` (Clean Install) installs dependencies strictly based on `package-lock.json` and deletes any existing `node_modules` folder. It never modifies `package-lock.json`, making builds faster, reproducible, and reliable across automated CI/CD runners.

### Q4: What is Infrastructure as Code (IaC)?
**Answer**: IaC is the practice of defining, provisioning, and managing computing infrastructure (servers, networks, containers) using machine-readable configuration files (such as HashiCorp HCL in Terraform) rather than manual interactive configuration tools.

### Q5: How does Terraform know which resources have already been created?
**Answer**: Terraform maintains a state file (`terraform.tfstate`). When `terraform plan` or `terraform apply` is executed, Terraform compares the local `.tf` files with the recorded state file and the real infrastructure via provider APIs to determine the exact delta (add, change, or destroy).

### Q6: What is the purpose of the Terraform Docker Provider on Windows?
**Answer**: The `kreuzwerker/docker` provider acts as a translator between Terraform's HCL syntax and Docker's engine API. On Windows, it communicates directly with Docker Desktop using the Windows named pipe `npipe:////./pipe/docker_engine`.

### Q7: Why do we use multi-stage Docker builds in the TaskFlow frontend?
**Answer**: In the first stage (`builder`), Node.js installs full dependencies and compiles the React application into static files (`dist/`). In the second stage (`runtime`), only the static `dist/` folder and `nginx.conf` are copied into a lightweight `nginx:alpine` image. The heavy Node.js runtime and `node_modules` are discarded, shrinking the final image size from ~400MB to ~25MB.

### Q8: What happens when you run `terraform destroy`?
**Answer**: Terraform reads the state file, determines the dependency order in reverse, and deletes all managed resources (stopping and removing the container, deleting the network, and untagging the image) without affecting other unmanaged containers.
