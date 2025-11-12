#!/bin/sh
set -e

# Reset DB, apply migrations, seed
npx prisma db push --force-reset
npx prisma db seed

# Start nginx in background
nginx -g 'daemon off;' &

# Start Node.js API on port 4000 (nginx proxies from 3333 to 4000)
PORT=4000 node dist/index.js
