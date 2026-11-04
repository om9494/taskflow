# Jenkins CI/CD Setup Guide for TaskFlow on Windows

This guide provides step-by-step instructions to install, configure, and execute the automated CI/CD pipeline for **TaskFlow** locally on Windows 10/11.

---

## 1. Prerequisites

### A. Java Development Kit (JDK 17 or 21)
Jenkins is built on Java and requires **OpenJDK 17** or **OpenJDK 21 (LTS)**.

1. Check if Java is installed:
   ```cmd
   java -version
   ```
2. If not installed, download and install Eclipse Temurin (OpenJDK):
   - [Download Eclipse Temurin OpenJDK 17/21](https://adoptium.net/)
   - Ensure the installer option **"Add to PATH"** and **"Set JAVA_HOME variable"** are enabled.

### B. Git for Windows
Ensure Git is installed and available in your system PATH:
```cmd
git --version
```

### C. Node.js & npm
```cmd
node -v
npm -v
```

### D. Docker Desktop for Windows
Ensure Docker Desktop is running and configured with Windows named pipe or standard CLI integration:
```cmd
docker version
```

---

## 2. Installing and Starting Jenkins Locally

You can run Jenkins on Windows using either the **Native WAR file** (recommended for ease of use) or the **Windows Installer**.

### Method 1: Running Jenkins via `jenkins.war` (Quickest & Most Flexible)

1. Download the latest Jenkins LTS WAR file:
   - [Download jenkins.war](https://get.jenkins.io/war-stable/latest/jenkins.war)
2. Create a folder, for example `C:\Jenkins`, and place `jenkins.war` inside it.
3. Open Windows Command Prompt (`cmd`) as Administrator and run:
   ```cmd
   cd C:\Jenkins
   java -jar jenkins.war --httpPort=8080
   ```
4. Keep this terminal window open. Jenkins will initialize and print the **initial administrator password**:
   ```text
   *************************************************************
   Jenkins initial setup is required. An admin user has been created and a password generated.
   Please use the following password to proceed to installation:

   4a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d

   This may also be found at: C:\Users\<Username>\.jenkins\secrets\initialAdminPassword
   *************************************************************
   ```

### Method 2: Running Jenkins via Windows MSI Installer
1. Download the Windows Installer from [jenkins.io/download](https://www.jenkins.io/download/).
2. Run the MSI installer and follow the wizard.
3. Choose **Run service as local system** or provide service credentials.
4. Set the port (default: `8080`).

---

## 3. Initial Jenkins Unlock and Setup

1. Open your web browser and navigate to:
   👉 **[http://localhost:8080](http://localhost:8080)**
2. Copy the initial administrator password from the console or read it from:
   ```cmd
   type "%USERPROFILE%\.jenkins\secrets\initialAdminPassword"
   ```
3. Paste the password into the **Unlock Jenkins** screen and click **Continue**.
4. Select **Install suggested plugins** and wait for the plugin installation to finish.
5. In the **Create First Admin User** screen:
   - Create your username and password (e.g., `admin` / `admin123`).
   - Fill in your Name and Email address.
6. Confirm the Jenkins URL (`http://localhost:8080/`) and click **Save and Finish** -> **Start using Jenkins**.

---

## 4. Required Plugins Verification

Ensure the following essential plugins are active:
- **Git plugin** (Installed by default)
- **Pipeline** (Installed by default)
- **Pipeline: Stage View** (Visual dashboard for stages)
- **AnsiColor** (Optional, for colored console output)
- **Timestamper** (For timestamped stage logs)

To verify or install extra plugins:
1. Go to **Dashboard** -> **Manage Jenkins** -> **Plugins**.
2. Under the **Installed plugins** tab, verify `Git` and `Pipeline` are active.

---

## 5. Creating the TaskFlow CI/CD Pipeline Job

1. From the Jenkins home dashboard, click **New Item** (left sidebar).
2. Enter the item name:
   ```text
   TaskFlow-Pipeline
   ```
3. Select **Pipeline** as the project type and click **OK**.

---

## 6. Configuring the Pipeline Job

In the job configuration page, configure the following sections:

### General & Triggers
1. **Description**:
   ```text
   End-to-End CI/CD Pipeline for TaskFlow MERN Stack Application (Docker + Node.js + Vite + Nginx)
   ```
2. (Optional) Check **GitHub project** and enter:
   ```text
   https://github.com/om9494/taskflow/
   ```
3. **Build Triggers**:
   - Check **Poll SCM**.
   - Schedule (checks for repository changes every 5 minutes):
     ```text
     H/5 * * * *
     ```

### Pipeline Definition (from SCM)
1. Scroll down to the **Pipeline** section.
2. In the **Definition** dropdown, choose:
   ```text
   Pipeline script from SCM
   ```
3. In the **SCM** dropdown, select:
   ```text
   Git
   ```
4. **Repository URL**:
   ```text
   https://github.com/om9494/taskflow.git
   ```
5. **Credentials**:
   - Since the repository is public, leave credentials as **- none -**.
   - (If using a private repo, add your GitHub Personal Access Token under Credentials).
6. **Branches to build**:
   - Change `*/master` to:
     ```text
     */main
     ```
7. **Script Path**:
   - Ensure the filename is:
     ```text
     Jenkinsfile
     ```
8. Click **Save** at the bottom.

---

## 7. Executing the Pipeline

1. In the `TaskFlow-Pipeline` page, click **Build Now** on the left menu.
2. Under **Build History**, click on `#1` (the newly running build).
3. Click on **Console Output** to monitor the live build logs in real time.
4. Watch the pipeline advance through all 9 stages:
   - `[STAGE 1]` Source Code Checkout
   - `[STAGE 2]` Dependency Installation
   - `[STAGE 3]` Frontend Build (`npm run build`)
   - `[STAGE 4]` Backend Validation and Testing (Syntax check)
   - `[STAGE 5]` Frontend Testing
   - `[STAGE 6]` Docker Image Build (`docker-compose build`)
   - `[STAGE 7]` Deployment (`docker-compose up -d`)
   - `[STAGE 8]` Deployment Verification (Container status + API health probe)
   - `[POST]` Artifact Archiving & Success Notification

---

## 8. Verifying the Deployment

Once the pipeline completes with **SUCCESS**:
1. Open your browser and access the live application:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000) or [http://localhost:80](http://localhost:80)
   - **Backend API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
2. View the **Pipeline Stage View** on the Jenkins project dashboard to see the green status boxes for every stage.

---

## 9. Troubleshooting Common Windows Jenkins Issues

### Issue 1: `'node'`, `'npm'`, or `'docker'` not recognized in Jenkins
- **Cause**: Jenkins runs under a system service or separate environment that did not inherit the user PATH.
- **Fix**:
  1. Go to **Manage Jenkins** -> **System** -> **Global properties**.
  2. Check **Environment variables**.
  3. Add a variable named `PATH` with value:
     ```text
     C:\Program Files\nodejs;C:\Program Files\Docker\Docker\resources\bin;C:\Program Files\Git\cmd;%PATH%
     ```
  4. Click **Save** and re-run the build.

### Issue 2: Docker command hangs or says "Cannot connect to the Docker daemon"
- **Cause**: Docker Desktop is not started or running in Linux Containers mode.
- **Fix**:
  1. Open Docker Desktop on Windows.
  2. Verify the whale icon in the Windows taskbar tray shows "Docker Desktop is running".
  3. Ensure Windows user is in the `docker-users` group if Jenkins runs as a Windows Service.

### Issue 3: Git checkout fails with "Branch not found"
- **Cause**: Jenkins defaults to `*/master`, but modern GitHub repositories use `*/main`.
- **Fix**: In your pipeline configuration under **Branches to build**, make sure it is explicitly set to `*/main`.
