#!/usr/bin/env bash
# ==============================================================================
# Assessment Script: Containerized App Deployment on GCP Cloud Run
# Region: asia-south1 (Mumbai)
# ==============================================================================
set -euo pipefail

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-$(cat .gcp_temp_project_id 2>/dev/null || gcloud config get-value project)}"
REGION="asia-south1"
REPO_NAME="app-repo"
SERVICE_NAME="myapp"
IMAGE_TAG="v1"
IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:${IMAGE_TAG}"

echo "================================================================="
echo "  Deploying Containerized App to GCP Cloud Run"
echo "  Project ID : ${PROJECT_ID}"
echo "  Region     : ${REGION}"
echo "  Image URI  : ${IMAGE_URI}"
echo "================================================================="

# Step 1: Set up project context
echo "[Step 1/10] Setting project context and default region..."
gcloud config set project "${PROJECT_ID}"
gcloud config set run/region "${REGION}"

# Step 2: Enable required APIs
echo "[Step 2/10] Enabling required Cloud APIs..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com

# Step 3: Create Artifact Registry repository
echo "[Step 3/10] Creating Artifact Registry repository '${REPO_NAME}'..."
if ! gcloud artifacts repositories describe "${REPO_NAME}" --location="${REGION}" >/dev/null 2>&1; then
  gcloud artifacts repositories create "${REPO_NAME}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="Docker repo for dockerized app"
else
  echo "Repository '${REPO_NAME}' already exists. Continuing."
fi

# Step 4: Authenticate Docker
echo "[Step 4/10] Authenticating Docker with Google Artifact Registry..."
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

# Step 5: Build Docker image (targeting linux/amd64 for universal Cloud Run compatibility)
echo "[Step 5/10] Building Docker image for linux/amd64 architecture..."
docker build --platform linux/amd64 -t "${IMAGE_URI}" .

# Step 6: Test locally before pushing
echo "[Step 6/10] Testing container locally on port 8080..."
CONTAINER_ID=$(docker run -d -p 8080:8080 "${IMAGE_URI}")
sleep 3
if curl -fsSL http://localhost:8080/health >/dev/null; then
  echo "Local test PASSED! Container is healthy."
else
  echo "Local test FAILED! Stopping container."
  docker stop "${CONTAINER_ID}" && docker rm "${CONTAINER_ID}"
  exit 1
fi
docker stop "${CONTAINER_ID}" >/dev/null
docker rm "${CONTAINER_ID}" >/dev/null

# Step 7: Push image to Artifact Registry
echo "[Step 7/10] Pushing Docker image to Artifact Registry..."
docker push "${IMAGE_URI}"

# Step 8: Deploy to Cloud Run
echo "[Step 8/10] Deploying service '${SERVICE_NAME}' to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image="${IMAGE_URI}" \
  --platform=managed \
  --region="${REGION}" \
  --allow-unauthenticated \
  --port=8080

# Step 9: Verify deployment
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" --platform=managed --region="${REGION}" --format="value(status.url)")
echo "================================================================="
echo "[Step 9/10] Verification: Service Live URL: ${SERVICE_URL}"
echo "Testing health probe: ${SERVICE_URL}/health"
curl -s "${SERVICE_URL}/health" | grep -q "healthy" && echo "Cloud Run Service probe: HEALTHY!"
echo "================================================================="

# Step 10: Fetch logs
echo "[Step 10/10] Fetching recent service logs..."
gcloud run services logs read "${SERVICE_NAME}" --region="${REGION}" --limit=10

echo "Deployment complete! Visit ${SERVICE_URL} in your browser."
