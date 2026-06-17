#!/usr/bin/env bash
set -euo pipefail

# Manual multi-arch build/push for the `personal` image (no CI pipeline exists).
# Runs on both amd64 and Graviton/arm64 nodes. Requires a buildx builder with
# QEMU; on a fresh machine run once: docker buildx create --use --name multiarch
# and authenticate to ECR first:
#   aws ecr get-login-password --region us-east-1 \
#     | docker login --username AWS --password-stdin 353385719850.dkr.ecr.us-east-1.amazonaws.com

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t 353385719850.dkr.ecr.us-east-1.amazonaws.com/personal:latest \
  --push .
