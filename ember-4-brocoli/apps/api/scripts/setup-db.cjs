#!/usr/bin/env node

/**
 * Script to dynamically set the Prisma database provider
 * based on the environment (development vs production)
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const isProduction = process.env.NODE_ENV === 'production';

// Read the schema file
let schema = fs.readFileSync(schemaPath, 'utf8');

// Determine which provider to use
const provider = isProduction ? 'postgresql' : 'sqlite';

console.log(`🔧 Setting database provider to: ${provider}`);

// Replace the provider line
schema = schema.replace(
  /provider\s*=\s*["'](?:sqlite|postgresql)["']/,
  `provider = "${provider}"`
);

// Write back to file
fs.writeFileSync(schemaPath, schema, 'utf8');

console.log(`✅ Database provider set to ${provider}`);
