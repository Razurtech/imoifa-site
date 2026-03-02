#!/usr/bin/env bash
set -euo pipefail

echo "[1/4] Pull latest changes (if repo is git)"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git pull --ff-only
else
  echo "Not a git repo, skipping pull."
fi

echo "[2/4] Build and restart container"
docker compose up -d --build

echo "[3/4] Quick health check"
curl -fsS -I http://127.0.0.1:8081/en/glossary/ | head -n 5

echo "[4/4] Done"
