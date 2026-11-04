# TaskFlow – Task Management System
### Production-Ready MERN Stack Application with Docker & Kubernetes (DevOps Practical)

---

## 1. Project Introduction

**TaskFlow** is a modern, responsive, production-ready full-stack Task Management System built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). 

Engineered specifically for practical DevOps demonstrations, TaskFlow showcases industry-standard DevOps engineering practices:
- **Multi-stage Docker builds** for optimized, lightweight, and secure container images.
- **Nginx Reverse Proxy & Single-Page Application (SPA) routing** to solve browser-to-cluster networking.
- **Microservice-ready orchestration with Docker Compose** for local full-stack integration.
- **Production Kubernetes (K8s) deployment manifests** with High Availability (HA), persistent storage (PVC), secrets management, and automated health probing.
- Ready for cloud deployment on **AWS Elastic Kubernetes Service (EKS)** or lightweight clusters like **K3s** / **Minikube**.

---

## 2. Key Features

1. **Create Tasks**: Add new tasks with title, description, and auto-generated timestamps.
2. **Read & Filter Tasks**: View all tasks with live search and category filtering (All, Pending, Completed).
3. **Update Tasks**: Edit task titles, descriptions, and completion states via an interactive modal.
4. **Delete Tasks**: Remove tasks with safety confirmation dialogs.
5. **Quick Status Toggle**: Mark tasks completed or pending with one click directly from task cards.
6. **Live Dashboard Metrics**: Dynamic stat cards displaying Total Tasks, Completed Tasks, Pending Tasks, and overall completion rate percentage.
7. **Production Error Handling & Loading States**: Animated loading spinners, friendly empty states, and toast notification banners for user feedback.
8. **Responsive UI**: Clean blue-and-white theme built with standard CSS, fully responsive across mobile, tablet, and desktop viewports.
9. **Zero-Configuration Microservice Networking**: Production Nginx reverse-proxies all `/api` requests directly to backend pods, eliminating CORS and hardcoded hostnames.
10. **Kubernetes Health Probes**: Backend and frontend services include `/api/health` and HTTP liveness/readiness probes.

---

## 3. Technology Stack

### Frontend:
- **Framework**: React.js (v18) initialized with Vite for fast builds.
- **Language**: JavaScript (ES6+).
- **Styling**: Vanilla Modern CSS (CSS custom variables, flexbox, grid, glassmorphic accents).
- **HTTP Client**: Axios with configured baseURL and response interceptors.
- **Icons**: React Icons (Feather icons `react-icons/fi`).
- **Web Server / Reverse Proxy**: Nginx Alpine (`nginx:alpine`).

### Backend:
- **Runtime**: Node.js (LTS).
- **Framework**: Express.js (v4).
- **Database ODM**: Mongoose (v8).
- **Environment Management**: `dotenv`.
- **CORS Support**: `cors` middleware.
- **Input Validation**: Custom validation middleware for MongoDB ObjectIDs and request bodies.

### Database:
- **Engine**: MongoDB (v6.0+).
- **Storage**: Persistent Volumes with Kubernetes PVC and Docker named volumes.

### DevOps & Orchestration:
- **Container Engine**: Docker Engine & Docker CLI.
- **Multi-Container Management**: Docker Compose (v3.8).
- **Cluster Orchestration**: Kubernetes (K3s, Minikube, or AWS EKS).
- **Container Registry**: Amazon Elastic Container Registry (ECR) / Docker Hub.

---

## 4. Project Folder Structure

```text
taskflow/
│
├── frontend/                     # React + Vite client
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── EmptyState.jsx    # Empty state illustration
│   │   │   ├── LoadingSpinner.jsx# CSS animated loading spinner
│   │   │   ├── Navbar.jsx        # Navigation header & health indicator
│   │   │   ├── Sidebar.jsx       # Category navigation & DevOps summary
│   │   │   ├── StatsCards.jsx    # Dashboard metrics & progress bar
│   │   │   ├── TaskCard.jsx      # Task presentation with actions
│   │   │   ├── TaskFormModal.jsx # Add / Edit task modal form
│   │   │   └── Toast.jsx         # Success / Error toast banner
│   │   ├── services/
│   │   │   └── api.js            # Axios client with interceptors
│   │   ├── App.jsx               # Main state container & dashboard
│   │   ├── index.css             # Blue & white responsive styles
│   │   └── main.jsx              # React DOM entry point
│   ├── .dockerignore             # Docker build exclusions
│   ├── .env.example              # Frontend environment template
│   ├── Dockerfile                # Multi-stage build (Node -> Nginx)
│   ├── index.html                # HTML template with Google Fonts
│   ├── nginx.conf                # Nginx reverse proxy + SPA routing
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite build configuration with dev proxy
│
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # Mongoose MongoDB connection handler
│   │   ├── controllers/
│   │   │   └── taskController.js # REST API business logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js   # 404 and global error handling
│   │   │   └── validate.js       # ID and body validation
│   │   ├── models/
│   │   │   └── Task.js           # Mongoose Task schema
│   │   ├── routes/
│   │   │   └── taskRoutes.js     # Express routes definition
│   │   └── server.js             # Express application & HTTP server
│   ├── .dockerignore             # Docker build exclusions
│   ├── .env.example              # Backend environment template
│   ├── Dockerfile                # Lightweight Node.js LTS Alpine container
│   └── package.json              # Backend dependencies and scripts
│
├── k8s/                          # Kubernetes Manifests
│   ├── mongodb-pvc.yaml          # PersistentVolumeClaim for MongoDB (1Gi)
│   ├── mongodb-secret.yaml       # K8s Secret for DB credentials & URI
│   ├── mongodb-deployment.yaml   # MongoDB Deployment (1 replica)
│   ├── mongodb-service.yaml      # MongoDB ClusterIP Service (:27017)
│   ├── backend-deployment.yaml   # Express Backend Deployment (2 replicas)
│   ├── backend-service.yaml      # Backend ClusterIP Service (:5000)
│   ├── frontend-deployment.yaml  # React Nginx Deployment (2 replicas)
│   └── frontend-service.yaml     # Frontend NodePort Service (:30080)
│
├── docker-compose.yml            # Full-stack local multi-container composition
├── .gitignore                    # Git version control exclusions
└── README.md                     # Comprehensive documentation
```

---

## 5. REST API Documentation

Base URL: `http://localhost:5000/api` (or `/api` via Nginx)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck and uptime probe | None |
| `GET` | `/api/tasks` | Retrieve all tasks (sorted newest first) | None |
| `POST` | `/api/tasks` | Create a new task | `{ "title": "string", "description": "string" }` |
| `PUT` | `/api/tasks/:id` | Update an existing task | `{ "title": "string", "description": "string", "completed": boolean }` |
| `PATCH` | `/api/tasks/:id/status`| Toggle or set completion status | `{ "completed": boolean }` (optional) |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID | None |

---

## 6. Local Setup (Without Docker)

### Prerequisites:
- Node.js (v18 or higher)
- MongoDB running locally on `mongodb://localhost:27017`

### 1. Start the Backend:
```bash
# Navigate to backend directory
cd taskflow/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start backend server
npm start
# (or for development with auto-reload: npm run dev)
```
*Backend will start on `http://localhost:5000`.*
Verify health: `curl http://localhost:5000/api/health`

### 2. Start the Frontend:
```bash
# In a new terminal, navigate to frontend directory
cd taskflow/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend will start on `http://localhost:3000`.*
Open browser to `http://localhost:3000`.

---

## 7. Frontend Production Build

The React application uses Vite for ultra-fast, optimized production bundling.

```bash
cd taskflow/frontend

# Run production build
npm run build
```

This compiles your React application and generates the production-ready static assets in the `frontend/dist/` directory:
- `dist/index.html` (Minified entrypoint)
- `dist/assets/index-*.css` (Optimized stylesheet)
- `dist/assets/index-*.js` (Production JavaScript bundle)

You can preview the production build locally anytime using:
```bash
npm run preview
```

---

## 8. Docker Containerization

### How the Dockerfiles Work:

1. **Frontend (`frontend/Dockerfile`) — Multi-stage Build**:
   - **Stage 1 (Builder)**: Uses `node:20-alpine` to install dependencies and execute `npm run build`. This generates the static `dist/` directory.
   - **Stage 2 (Production Server)**: Uses `nginx:alpine` (under 25MB). Copies the built static files from Stage 1 into `/usr/share/nginx/html` and copies our custom `nginx.conf`. The heavy Node.js runtime and `node_modules` are discarded, resulting in an ultra-lean and secure image.
   - **Nginx Reverse Proxy**: In `nginx.conf`, any request starting with `/api/` is proxied internally to `http://backend:5000/api/`. This ensures the user's browser never needs to reach backend internal container IPs or Kubernetes cluster IPs directly!

2. **Backend (`backend/Dockerfile`)**:
   - Uses `node:20-alpine` lightweight base image.
   - Installs only production dependencies (`npm ci --only=production`).
   - Runs on port 5000 with `npm start`.

### Commands to Build Docker Images Manually:

```bash
# 1. Build Backend Docker Image
cd taskflow/backend
docker build -t taskflow-backend:latest .

# 2. Build Frontend Docker Image
cd ../frontend
docker build -t taskflow-frontend:latest .
```

---

## 9. Running with Docker Compose

Docker Compose automatically spins up the frontend, backend, and MongoDB database inside an isolated virtual network (`taskflow-network`) with persistent database storage (`mongodb_data`).

### Start All Services:
```bash
cd taskflow

# Build and start all containers in detached mode
docker-compose up --build -d
```

### Check Running Containers:
```bash
docker-compose ps
```

### View Logs:
```bash
# View logs from all services in real time
docker-compose logs -f

# View backend logs specifically
docker-compose logs -f backend
```

### Accessing the Application:
- **Frontend Dashboard**: Open your browser at `http://localhost:80` or `http://localhost:3000`.
- **Backend API Health**: `http://localhost:5000/api/health`.

### Stop All Services:
```bash
# Stop containers (preserves database volume)
docker-compose down

# Stop containers and remove volumes (clean slate)
docker-compose down -v
```

---

## 10. Kubernetes (K8s) Deployment Guide

This project includes production-ready Kubernetes YAML manifests compatible with **K3s**, **Minikube**, **Kind**, or cloud **AWS EKS**.

### Networking Architecture in Kubernetes:
```
[ User Browser ]
       │
       ▼ (Hits NodePort 30080 or Port 80)
┌────────────────────────────────────────────────────────┐
│  Kubernetes Service: frontend (NodePort 30080)         │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
       ┌────────────────────────────────┐
       │   Frontend Pod (Nginx + SPA)   │
       │   - Serves React index.html    │
       │   - Proxies /api/* requests ───┼───────────┐
       └────────────────────────────────┘           │
                                                    ▼
                       ┌─────────────────────────────────────────┐
                       │  Kubernetes Service: backend (ClusterIP)│
                       │  DNS: http://backend:5000               │
                       └────────────────────┬────────────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │ Backend Pods (Replicas) │
                               │ Node.js / Express       │
                               └────────────┬────────────┘
                                            │
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │ Kubernetes Service: mongodb (ClusterIP) │
                       │ DNS: mongodb:27017                      │
                       └────────────────────┬────────────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │ MongoDB Pod + PVC (1Gi) │
                               └─────────────────────────┘
```

### Step-by-Step Deployment Commands:

```bash
cd taskflow/k8s

# Step 1: Create Persistent Volume Claim for MongoDB
kubectl apply -f mongodb-pvc.yaml

# Step 2: Create Secrets (Credentials & Connection String)
kubectl apply -f mongodb-secret.yaml

# Step 3: Deploy MongoDB and its Service
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml

# Step 4: Deploy Express Backend and its Service
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# Step 5: Deploy React Frontend and its NodePort Service
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

*Or deploy all resources at once:*
```bash
kubectl apply -f taskflow/k8s/
```

---

## 11. Monitoring & Managing the Cluster

### Check Status of Pods:
```bash
kubectl get pods -o wide
```
*Expected output: 1 MongoDB pod, 2 Backend pods, and 2 Frontend pods all in `Running` state.*

### Check Services:
```bash
kubectl get services
```
*Expected output:*
- `frontend` Service of type `NodePort` mapping `80:30080/TCP`.
- `backend` Service of type `ClusterIP` on port `5000`.
- `mongodb` Service of type `ClusterIP` on port `27017`.

### Check Persistent Volume Claims:
```bash
kubectl get pvc
```
*Status should be `Bound`.*

### Inspect Pod Logs:
```bash
# Backend logs
kubectl logs -l app=backend --tail=50 -f

# Frontend (Nginx access and proxy) logs
kubectl logs -l app=frontend --tail=50 -f

# MongoDB logs
kubectl logs -l app=mongodb --tail=50 -f
```

---

## 12. How to Access the Application in Kubernetes

1. **On Local K3s / Minikube**:
   - Access the dashboard at `http://<NODE-IP>:30080` (e.g., `http://localhost:30080` or `http://192.168.49.2:30080`).
   - If using Minikube on Windows/macOS:
     ```bash
     minikube service frontend
     ```

2. **Port Forwarding (Quick Testing)**:
   ```bash
   kubectl port-forward svc/frontend 8080:80
   ```
   *Then open `http://localhost:8080` in your browser.*

---

## 13. AWS Deployment Overview (EC2 / ECR / EKS)

For your college DevOps practical viva or demonstration, here is the architecture for deploying TaskFlow to **Amazon Web Services (AWS)**:

### Architecture Components:
1. **Amazon ECR (Elastic Container Registry)**:
   - Stores your custom Docker container images (`taskflow-frontend` and `taskflow-backend`).
2. **Amazon EKS (Elastic Kubernetes Service)** or **EC2 with K3s**:
   - Manages the compute nodes and Kubernetes cluster.
3. **AWS Elastic Load Balancer (ALB / NLB)**:
   - Directs external internet traffic to the Frontend service.
4. **Amazon EBS (Elastic Block Store)**:
   - Backs the PersistentVolumeClaim for MongoDB data retention.

### AWS Deployment Workflow:

```bash
# 1. Authenticate Docker with Amazon ECR
aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com

# 2. Create ECR repositories
aws ecr create-repository --repository-name taskflow-backend
aws ecr create-repository --repository-name taskflow-frontend

# 3. Tag images for ECR
docker tag taskflow-backend:latest <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/taskflow-backend:latest
docker tag taskflow-frontend:latest <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/taskflow-frontend:latest

# 4. Push images to ECR
docker push <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/taskflow-backend:latest
docker push <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/taskflow-frontend:latest

# 5. Connect kubectl to your Amazon EKS Cluster
aws eks update-kubeconfig --region <your-region> --name <your-eks-cluster-name>

# 6. Update the image paths in backend-deployment.yaml and frontend-deployment.yaml to your ECR URLs, then apply:
kubectl apply -f taskflow/k8s/
```

---

## 14. DevOps Concepts Reference (Viva & Practical Preparation)

| Concept | Explanation | Role in TaskFlow |
| :--- | :--- | :--- |
| **Docker** | An open-source platform that automates the deployment of applications inside lightweight, portable software containers. | Packages the React frontend, Express API, and dependencies into reproducible runtime environments. |
| **Docker Image** | A read-only, immutable blueprint or snapshot with code, runtime, system tools, and libraries needed to execute an application. | Built via `Dockerfile` (e.g. `taskflow-frontend:latest`, `node:20-alpine`). |
| **Docker Container** | A runnable, isolated instance of a Docker image executing as an isolated process on the host operating system kernel. | Instances created when executing `docker run` or `docker-compose up`. |
| **Multi-Stage Build** | A Dockerfile technique where multiple `FROM` instructions are used to build artifacts in one stage and copy only the final artifacts to a slim production image. | Used in `frontend/Dockerfile` where Node builds the React code, and only static `dist/` files are copied to Nginx, reducing image size from ~400MB to ~25MB. |
| **Kubernetes (K8s)** | An enterprise-grade container orchestration system for automating container deployment, scaling, failover, and management. | Orchestrates frontend and backend pods across multiple nodes. |
| **Pod** | The smallest deployable computing unit in Kubernetes, wrapping one or more tightly coupled containers sharing network and storage. | We run backend pods, frontend pods, and a MongoDB pod. |
| **Deployment** | A Kubernetes controller that declaratively manages desired state, replica counts, rolling updates, and self-healing for Pods. | Manages 2 replicas of frontend, 2 replicas of backend, and 1 replica of MongoDB. |
| **Service (K8s)** | An abstraction defining a logical set of Pods and a policy to access them with stable DNS and load balancing. | `backend` and `mongodb` use `ClusterIP` (internal only); `frontend` uses `NodePort` (external access). |
| **ClusterIP vs NodePort** | `ClusterIP` provides an internal virtual IP reachable only within the cluster. `NodePort` exposes the service on each node’s IP at a static port (30000–32767). | `backend` is secured via ClusterIP; `frontend` is accessible to users via NodePort `30080`. |
| **PersistentVolumeClaim (PVC)** | A request for storage by a user/pod in Kubernetes that binds to physical disk storage independent of the pod's lifecycle. | Used in `mongodb-pvc.yaml` so MongoDB database records survive pod restarts and rescheduling. |
| **Kubernetes Secret** | An object storing sensitive data like passwords, tokens, or connection strings securely instead of plain text in deployment files. | Used in `mongodb-secret.yaml` to store MongoDB credentials and database URI safely. |
| **Amazon ECR** | Amazon Elastic Container Registry is a managed AWS container image registry service that is secure, scalable, and reliable. | Stores production Docker images before deploying to AWS EKS or EC2. |

---

## 15. License

This project is licensed under the **MIT License**. Created for academic practicals, DevOps demonstrations, and production reference implementations.
