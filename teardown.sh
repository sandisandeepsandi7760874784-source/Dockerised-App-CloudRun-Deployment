#!/usr/bin/env bash
# ==============================================================================
# Teardown Script: Clean up temporary evaluation project & restore context
# ==============================================================================
set -euo pipefail

BILLING_ACCOUNT="0128EF-291EAD-AD0148"
GEN_LANG_PROJECT="gen-lang-client-0841148610"
RESTORE_PROJECT="shiftmadi-staging"

PROJECT_ID="${1:-$(cat .gcp_temp_project_id 2>/dev/null || echo "")}"

if [ -z "${PROJECT_ID}" ]; then
  echo "Error: No project ID found to tear down. Specify as first argument."
  exit 1
fi

echo "================================================================="
echo "  Tearing down temporary assessment project: ${PROJECT_ID}"
echo "================================================================="

read -p "Are you sure you want to delete temporary project ${PROJECT_ID}? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Deleting temporary GCP project: ${PROJECT_ID}..."
  gcloud projects delete "${PROJECT_ID}" --quiet || true

  echo "Restoring billing to ${GEN_LANG_PROJECT}..."
  gcloud billing projects link "${GEN_LANG_PROJECT}" --billing-account="${BILLING_ACCOUNT}" || true

  echo "Restoring gcloud active project context to ${RESTORE_PROJECT}..."
  gcloud config set project "${RESTORE_PROJECT}"

  rm -f .gcp_temp_project_id
  echo "Teardown complete! Environment restored cleanly to ${RESTORE_PROJECT}."
else
  echo "Teardown aborted."
fi
