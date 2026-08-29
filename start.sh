#!/bin/sh
# 本番スタック（mysql/api/web/caddy）を起動する。
# 呼び出し時のカレントディレクトリに関わらず動くよう、まずこのスクリプト自身の
# ディレクトリ（リポジトリルート）へ移動してから docker compose を実行する。
set -eu

cd "$(dirname "$0")"

docker compose --env-file .env.prod -f docker-compose.prod.yml up -d mysql api web caddy
