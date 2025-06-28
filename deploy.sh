#!/usr/bin/env bash
set -euo pipefail

# Название приложения
APP_NAME="Brisbane Wharf Box"
REPO_NAME=$(echo "$APP_NAME" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')

# GitHub username (замени при необходимости)
USERNAME="olya457"

# Локальный путь к проекту
PROJECT_PATH="/Users/ola/Downloads/ReactNative/BrisbaneWharfBox"

# Проверка: установлен ли GitHub CLI
command -v gh >/dev/null || { echo "❌ Установите GitHub CLI: https://cli.github.com/"; exit 1; }
gh auth status >/dev/null || { echo "❌ Не авторизован в gh. Выполните: gh auth login"; exit 1; }

# Переход в папку проекта
cd "$PROJECT_PATH" || { echo "❌ Папка проекта не найдена: $PROJECT_PATH"; exit 1; }

# Инициализация git (если ещё не инициализирован)
if [ ! -d .git ]; then
  git init
  git branch -M main
fi

# Добавление и коммит
git add .
git commit -m "Initial commit" || echo "– Ничего не закоммичено"

# Удаление origin если уже существует
git remote remove origin 2>/dev/null || true

# Создание приватного репозитория и пуш
gh repo create "$USERNAME/$REPO_NAME" \
  --private \
  --source=. \
  --remote=origin \
  --push \
  --confirm

echo "✅ Репозиторий создан и загружен: https://github.com/$USERNAME/$REPO_NAME"
