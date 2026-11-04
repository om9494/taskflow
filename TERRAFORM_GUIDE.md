# Terraform Infrastructure as Code (IaC) Guide for TaskFlow

This guide provides an in-depth reference for implementing and managing local infrastructure using **Terraform** and the **Docker Provider** on Windows.

---

## 1. What is Infrastructure as Code (IaC)?

**Infrastructure as Code (IaC)** is the practice of managing and provisioning IT infrastructure (servers, networks, containers, storage, firewalls) using declarative configuration files rather than manual point-and-click operations or ad-hoc shell scripts.

### Key Benefits of IaC:
1. **Reproducibility**: Environments can be spun up identically across development, testing, staging, and production.
2. **Version Control**: Infrastructure definitions are stored in Git, enabling pull requests, peer reviews, commit histories, and rollback capabilities.
3. **Speed & Efficiency**: Hundreds of cloud or container resources can be provisioned in parallel within seconds.
4. **Reduced Human Error**: Eliminates manual configuration drift and missing configuration steps.

---

## 2. Why Terraform?

**HashiCorp Terraform** is the industry standard open-source declarative Infrastructure as Code tool.

- **Declarative Approach**: You specify *what* the desired end-state of the infrastructure should look like, and Terraform automatically calculates the dependency graph and exact sequence of actions needed to achieve that state.
- **Provider Ecosystem**: Terraform interacts with hundreds of cloud providers (AWS, Azure, GCP) and container platforms (Docker, Kubernetes) through plugins called **Providers**.
- **State Management**: Terraform keeps a record of the resources it manages in a state file (`terraform.tfstate`), allowing it to map real-world infrastructure to your configuration.

---

## 3. Terraform Docker Provider Configuration

In TaskFlow, we use the official `kreuzwerker/docker` provider to provision and manage Docker resources locally on Windows without any paid cloud dependencies.

### Windows Docker Desktop Named Pipe
On Windows, Docker Desktop communicates via a Windows Named Pipe rather than a Unix socket (`/var/run/docker.sock`). Our provider is configured accordingly:

```hcl
provider "docker" {
  host = "npipe:////./pipe/docker_engine"
}
```

---

## 4. Terraform Project Architecture in TaskFlow

The `terraform/` directory contains four modular files:

| File | Purpose |
| :--- | :--- |
| `main.tf` | Declares the required provider, the Docker image, dedicated network, and container resources. |
| `variables.tf` | Defines parameterizable inputs (host port, image name, container name, named pipe host) with defaults. |
| `outputs.tf` | Exposes key data after provisioning (container ID, assigned host port, URL to view the application). |
| `.gitignore` | Prevents sensitive state files (`terraform.tfstate`) and plugin binaries (`.terraform/`) from leaking into Git. |

### Provisioned Resources:
1. **`docker_image.nginx`**: Pulls and caches the lightweight `nginx:alpine` image.
2. **`docker_network.taskflow_iac_network`**: A dedicated virtual bridge network (`taskflow-iac-network`) providing isolated inter-container communication.
3. **`docker_container.taskflow_iac_container`**: A standalone container named `taskflow-iac-demo` bound to host port `8088`.

---

## 5. Terraform Lifecycle & Windows CMD Commands

Navigate to the `terraform` directory before executing commands:
```cmd
cd "c:\Users\hp\Desktop\new project\taskflow\terraform"
```

### 1. `terraform init`
Initializes the working directory, downloads the required provider plugins (`kreuzwerker/docker`), and creates the `.terraform.lock.hcl` dependency lock file.
```cmd
terraform init
```

### 2. `terraform fmt`
Formats Terraform configuration files according to canonical style conventions for indentation and alignment.
```cmd
terraform fmt
```

### 3. `terraform validate`
Checks whether the configuration files are syntactically valid and internally consistent without contacting the Docker engine.
```cmd
terraform validate
```

### 4. `terraform plan`
Creates an execution plan by comparing the declared configuration against the current real-world state. It displays what will be added (`+`), modified (`~`), or destroyed (`-`).
```cmd
terraform plan
```

### 5. `terraform apply`
Applies the changes required to reach the desired state by executing API calls to Docker Desktop.
```cmd
terraform apply
```
*(To approve automatically for automated scripting):*
```cmd
terraform apply -auto-approve
```

### 6. `terraform state list`
Lists all resources currently tracked in the Terraform state file.
```cmd
terraform state list
```
**Expected Output:**
```text
docker_container.taskflow_iac_container
docker_image.nginx
docker_network.taskflow_iac_network
```

### 7. `terraform show`
Displays a comprehensive human-readable inspection of all resource attributes tracked in the state file.
```cmd
terraform show
```

### 8. `terraform output`
Prints the values of all defined outputs.
```cmd
terraform output
```

### 9. `terraform destroy`
Destroys all infrastructure managed by this Terraform workspace.
```cmd
terraform destroy
```

---

## 6. Understanding the Terraform State File (`terraform.tfstate`)

The `terraform.tfstate` file is a JSON file that acts as Terraform's database. It maps:
- The resource names in your `.tf` files (e.g. `docker_container.taskflow_iac_container`) to real container IDs in Docker (e.g. `edfc51d193d4...`).
- Stores resource metadata, IP addresses, ports, and dependencies.

> ⚠️ **Important Security & Team Best Practices**:
> 1. Never edit `terraform.tfstate` manually.
> 2. Never commit `terraform.tfstate` to public Git repositories (it is listed in our `.gitignore`).
> 3. In enterprise production, remote state backends (e.g. AWS S3 with DynamoDB locking) are used so teams do not overwrite each other's state.

---

## 7. Verification Steps on Windows

After running `terraform apply`, verify your resources with standard Docker and curl commands:

```cmd
:: 1. Verify container is running
docker ps --filter "name=taskflow-iac"

:: 2. Verify network was created
docker network ls --filter "name=taskflow-iac"

:: 3. Test HTTP connectivity
curl -I http://localhost:8088
```

Open your browser and visit:
👉 **[http://localhost:8088](http://localhost:8088)**
You will see the standard Nginx welcome page running inside the Terraform-provisioned container!
