/**
 * Script migrate dữ liệu từ JSON files → SQL Server
 * Chạy 1 lần duy nhất sau khi đã tạo schema.sql
 *
 * Cách dùng:
 *   cd backend
 *   npm install
 *   node migrate.js
 */

require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const { getPool, sql } = require('./db');

const ROOT = path.join(__dirname, '..');

async function migrate() {
  console.log('Connecting to SQL Server...');
  const pool = await getPool();
  console.log('Connected.\n');

  // ── 1. Migrate users ─────────────────────────────────────────────────────
  const usersFile = path.join(ROOT, 'users.json');
  if (!fs.existsSync(usersFile)) {
    console.warn('users.json not found, skipping users migration.');
  } else {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    console.log(`Migrating ${users.length} users...`);
    for (const { username, password } of users) {
      await pool.request()
        .input('u', sql.NVarChar, username)
        .input('p', sql.NVarChar, password)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM users WHERE username = @u)
            INSERT INTO users (username, password) VALUES (@u, @p)
          ELSE
            UPDATE users SET password = @p WHERE username = @u
        `);
      console.log(`  ✓ user: ${username}`);
    }
  }

  // ── 2. Migrate progress ──────────────────────────────────────────────────
  const progressDir = path.join(ROOT, 'progress');
  if (!fs.existsSync(progressDir)) {
    console.warn('\nprogress/ directory not found, skipping progress migration.');
  } else {
    const files = fs.readdirSync(progressDir).filter(f => f.endsWith('.json'));
    console.log(`\nMigrating progress for ${files.length} user(s)...`);
    for (const file of files) {
      const username = path.basename(file, '.json');
      const data     = fs.readFileSync(path.join(progressDir, file), 'utf8');
      await pool.request()
        .input('u',    sql.NVarChar, username)
        .input('data', sql.NVarChar(sql.MAX), data)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM progress WHERE username = @u)
            INSERT INTO progress (username, data) VALUES (@u, @data)
          ELSE
            UPDATE progress SET data = @data, updated_at = GETDATE() WHERE username = @u
        `);
      console.log(`  ✓ progress: ${username}`);
    }
  }

  console.log('\nMigration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
