# DevOps Assignment Submission: Screenshot Checklist

This checklist lists all **15 required screenshots** for your college practical assignment submission, complete with the exact command or URL and what part of the screen to capture.

---

## 📸 Summary Checklist Table

| # | Screenshot Item | Capture Location / Command | Expected Content to Show |
| :-: | :--- | :--- | :--- |
| **1** | TaskFlow GitHub Repository | `https://github.com/om9494/taskflow` | Browser window showing repository root with `Jenkinsfile`, `terraform/`, `frontend/`, `backend/`, and `README.md`. |
| **2** | Jenkins Dashboard | `http://localhost:8080/` | Jenkins home page showing the `TaskFlow-Pipeline` job with a green sunny/blue success ball. |
| **3** | Jenkins Pipeline Configuration | `http://localhost:8080/job/TaskFlow-Pipeline/configure` | Configuration page showing **Pipeline script from SCM**, Git URL `https://github.com/om9494/taskflow.git`, and branch `*/main`. |
| **4** | Jenkins Successful Stage View | `http://localhost:8080/job/TaskFlow-Pipeline/` | **Stage View** matrix with all 8-9 stages showing green boxes and build duration. |
| **5** | Jenkins Console Output | `http://localhost:8080/job/TaskFlow-Pipeline/lastBuild/console` | Terminal output showing `Finished: SUCCESS` at the bottom of the console log. |
| **6** | TaskFlow Frontend Build | Command Prompt: `cd frontend && npm run build` | Terminal showing Vite compiling assets and outputting `dist/index.html` and assets in ~1.2s. |
| **7** | Docker Containers Running | Command Prompt: `docker ps` | List of running containers: `taskflow-frontend`, `taskflow-backend`, `taskflow-mongodb`, and `taskflow-iac-demo`. |
| **8** | TaskFlow Application in Browser | `http://localhost:3000` or `http://localhost:80` | Full TaskFlow dashboard showing "API Online", stats cards (Total, Completed, Pending), and task cards. |
| **9** | Terraform Initialization | Command Prompt: `terraform init` inside `terraform/` | Terminal output showing: `Terraform has been successfully initialized!` with `kreuzwerker/docker` provider. |
| **10**| Terraform Validation | Command Prompt: `terraform validate` | Terminal showing: `Success! The configuration is valid.` |
| **11**| Terraform Plan | Command Prompt: `terraform plan` | Terminal output displaying: `Plan: 3 to add, 0 to change, 0 to destroy.` |
| **12**| Terraform Apply | Command Prompt: `terraform apply` | Terminal output displaying: `Apply complete! Resources: 3 added, 0 changed, 0 destroyed.` and outputs. |
| **13**| Terraform State List | Command Prompt: `terraform state list` | Terminal output listing: `docker_container.taskflow_iac_container`, `docker_image.nginx`, `docker_network.taskflow_iac_network`. |
| **14**| Docker Network and Container by Terraform | Command Prompt: `docker ps` & `docker network ls` | Terminal showing `taskflow-iac-demo` container on port 8088 and `taskflow-iac-network` network. |
| **15**| Nginx Page at localhost:8088 | `http://localhost:8088` | Browser tab showing the standard "Welcome to nginx!" page. |

---

## 📝 Detailed Step-by-Step Screenshot Capture Guide

### 1. Existing TaskFlow GitHub Repository
- **Action**: Open [https://github.com/om9494/taskflow](https://github.com/om9494/taskflow) in Chrome/Edge.
- **Capture**: Full repository view showing the branch `main`, the latest commit message, and the root file directory tree including `Jenkinsfile` and `terraform/`.

---

### 2. Jenkins Dashboard
- **Action**: Open [http://localhost:8080](http://localhost:8080).
- **Capture**: The main dashboard table displaying `TaskFlow-Pipeline`, last success status, and weather indicator.

---

### 3. Jenkins Pipeline Configuration
- **Action**: Go to `http://localhost:8080/job/TaskFlow-Pipeline/configure` and scroll to the bottom **Pipeline** block.
- **Capture**: The fields showing:
  - Definition: `Pipeline script from SCM`
  - SCM: `Git`
  - Repository URL: `https://github.com/om9494/taskflow.git`
  - Branch Specifier: `*/main`
  - Script Path: `Jenkinsfile`

---

### 4. Jenkins Successful Stage View
- **Action**: Navigate to `http://localhost:8080/job/TaskFlow-Pipeline/`.
- **Capture**: The **Stage View** section showing the pipeline stages:
  1. *Source Code Checkout*
  2. *Dependency Installation*
  3. *Frontend Build*
  4. *Backend Validation and Testing*
  5. *Frontend Testing*
  6. *Docker Image Build*
  7. *Deployment*
  8. *Deployment Verification*
  All stage boxes should be highlighted green.

---

### 5. Jenkins Console Output
- **Action**: Go to `http://localhost:8080/job/TaskFlow-Pipeline/lastBuild/console`.
- **Capture**: The bottom portion of the console log displaying the deployment verification success and the final line `Finished: SUCCESS`.

---

### 6. TaskFlow Frontend Build
- **Action**: Open Windows Command Prompt (`cmd`) and run:
  ```cmd
  cd "c:\Users\hp\Desktop\new project\taskflow\frontend"
  npm run build
  ```
- **Capture**: Terminal output showing the Vite build time (e.g. `built in 1.26s`) and the list of output files in `dist/`.

---

### 7. Docker Containers Running
- **Action**: Open Command Prompt and run:
  ```cmd
  docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
  ```
- **Capture**: The active status of `taskflow-frontend`, `taskflow-backend`, `taskflow-mongodb`, and `taskflow-iac-demo`.

---

### 8. TaskFlow Application in Browser
- **Action**: Open your browser at [http://localhost:3000](http://localhost:3000) (or [http://localhost:80](http://localhost:80)).
- **Capture**: The complete dashboard with the green **API Online** badge, Total/Completed/Pending metric counters, and task cards.

---

### 9. Terraform Initialization
- **Action**: In Command Prompt:
  ```cmd
  cd "c:\Users\hp\Desktop\new project\taskflow\terraform"
  terraform init
  ```
- **Capture**: The green message `Terraform has been successfully initialized!` and provider installation for `kreuzwerker/docker`.

---

### 10. Terraform Validation
- **Action**: In Command Prompt:
  ```cmd
  terraform validate
  ```
- **Capture**: The message `Success! The configuration is valid.`

---

### 11. Terraform Plan
- **Action**: In Command Prompt:
  ```cmd
  terraform plan
  ```
- **Capture**: The plan summary showing `Plan: 3 to add, 0 to change, 0 to destroy` and the outputs to be created.

---

### 12. Terraform Apply
- **Action**: In Command Prompt:
  ```cmd
  terraform apply
  ```
- **Capture**: The output lines showing `Apply complete! Resources: 3 added, 0 changed, 0 destroyed.` and the displayed outputs:
  - `application_url = "http://localhost:8088"`
  - `container_name = "taskflow-iac-demo"`
  - `network_name = "taskflow-iac-network"`

---

### 13. Terraform State List
- **Action**: In Command Prompt:
  ```cmd
  terraform state list
  ```
- **Capture**: The terminal listing the 3 managed resources:
  - `docker_container.taskflow_iac_container`
  - `docker_image.nginx`
  - `docker_network.taskflow_iac_network`

---

### 14. Docker Network and Container Created by Terraform
- **Action**: In Command Prompt run:
  ```cmd
  docker ps --filter "name=taskflow-iac"
  docker network ls --filter "name=taskflow-iac"
  ```
- **Capture**: The terminal showing container `taskflow-iac-demo` running on port 8088 and bridge network `taskflow-iac-network`.

---

### 15. Nginx Page at localhost:8088
- **Action**: Open [http://localhost:8088](http://localhost:8088) in your web browser.
- **Capture**: The standard "Welcome to nginx!" title and heading showing port 8088 in the address bar.
