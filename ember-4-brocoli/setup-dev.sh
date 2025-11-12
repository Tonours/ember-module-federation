#!/bin/bash

# Setup development environment
# This script copies .env.example files to .env for local development

echo "🔧 Setting up development environment..."

# API
if [ ! -f apps/api/.env ]; then
  echo "📝 Creating apps/api/.env"
  cp apps/api/.env.example apps/api/.env
else
  echo "✅ apps/api/.env already exists"
fi

# React Shell
if [ ! -f apps/react-shell/.env ]; then
  echo "📝 Creating apps/react-shell/.env"
  cp apps/react-shell/.env.example apps/react-shell/.env
else
  echo "✅ apps/react-shell/.env already exists"
fi

# MFE Blog Article
if [ ! -f apps/mf-blog-article/.env ]; then
  echo "📝 Creating apps/mf-blog-article/.env"
  cp apps/mf-blog-article/.env.example apps/mf-blog-article/.env
else
  echo "✅ apps/mf-blog-article/.env already exists"
fi

# Ember
if [ ! -f apps/ember/.env ]; then
  echo "📝 Creating apps/ember/.env"
  cp apps/ember/.env.example apps/ember/.env
else
  echo "✅ apps/ember/.env already exists"
fi

echo ""
echo "✨ Development environment setup complete!"
echo ""
echo "Next steps:"
echo "  1. npm install (if not done yet)"
echo "  2. npm run prisma:generate (generate Prisma client)"
echo "  3. npm run prisma:push (create SQLite database)"
echo "  4. npm run dev:all (start all services)"
echo ""
