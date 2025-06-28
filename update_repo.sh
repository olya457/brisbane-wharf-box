#!/usr/bin/env bash
set -euo pipefail

# ✅ Коммит-сообщение и имя ветки
COMMIT_MESSAGE=${1:-"Update"}
BRANCH_NAME=${2:-"feature-$(date +%Y%m%d-%H%M%S)"}

# ✅ Локальный путь к проекту
PROJECT_PATH="/Users/ola/Downloads/ReactNative/BrisbaneWharfBox"

# ✅ Твой GitHub username и репозиторий
GITHUB_USER="olya457"
REPO_NAME="brisbane-wharf-box"

# ⬇ Переход в проект
cd "$PROJECT_PATH" || { echo "❌ Папка проекта не найдена"; exit 1; }

# ⬇ Удалим и пересоздадим origin (https)
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

# ⬇ Создаём новую ветку
git checkout -b "$BRANCH_NAME"

# ⬇ Добавляем всё
git add .

# ⬇ Коммитим (всегда, даже если нет изменений)
git commit --allow-empty -m "$COMMIT_MESSAGE"

# ⬇ Пушим
git push -u origin "$BRANCH_NAME"

# ✅ Готово
echo "✅ Коммит запушен в ветку '$BRANCH_NAME'"
echo "🔗 Открой Pull Request: https://github.com/$GITHUB_USER/$REPO_NAME/pull/new/$BRANCH_NAME"
