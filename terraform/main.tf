terraform {
  required_version = ">= 1.0.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
  }
}

# Configure the Docker provider to connect to Windows Docker Desktop Engine via Named Pipe
provider "docker" {
  host = var.docker_host
}

# 1. Pull lightweight Nginx Alpine image
resource "docker_image" "nginx" {
  name         = var.image_name
  keep_locally = true
}

# 2. Dedicated Docker bridge network for isolated IaC resources
resource "docker_network" "taskflow_iac_network" {
  name   = var.network_name
  driver = "bridge"
}

# 3. Demonstration container mapped to configurable host port (default: 8088)
resource "docker_container" "taskflow_iac_container" {
  name         = var.container_name
  image        = docker_image.nginx.image_id
  network_mode = "bridge"

  networks_advanced {
    name = docker_network.taskflow_iac_network.name
  }

  ports {
    internal = var.internal_port
    external = var.host_port
    protocol = "tcp"
  }
}
