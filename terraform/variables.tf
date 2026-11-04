variable "docker_host" {
  type        = string
  description = "Docker daemon host endpoint for Windows Docker Desktop named pipe"
  default     = "npipe:////./pipe/docker_engine"
}

variable "container_name" {
  type        = string
  description = "Unique name for the Terraform-provisioned demonstration container"
  default     = "taskflow-iac-demo"
}

variable "network_name" {
  type        = string
  description = "Name for the dedicated Docker bridge network"
  default     = "taskflow-iac-network"
}

variable "image_name" {
  type        = string
  description = "Lightweight Docker image for the infrastructure demonstration"
  default     = "nginx:alpine"
}

variable "host_port" {
  type        = number
  description = "Host port mapped to the demonstration container port"
  default     = 8088
}

variable "internal_port" {
  type        = number
  description = "Container internal port exposed by the Nginx image"
  default     = 80
}
