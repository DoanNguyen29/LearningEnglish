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

  // ── 3. Migrate vocabulary sets ───────────────────────────────────────────────
  const dbFile    = path.join(ROOT, 'database.json');
  const ieltsFile = path.join(ROOT, 'Vocabu', 'ielts_vocab_full.json');

  let allSets = [];

  if (fs.existsSync(dbFile)) {
    const sets = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    allSets = [...allSets, ...sets];
    console.log(`\nLoaded ${sets.length} sets from database.json`);
  } else {
    console.warn('\ndatabase.json not found, skipping.');
  }

  if (fs.existsSync(ieltsFile)) {
    const ielts = JSON.parse(fs.readFileSync(ieltsFile, 'utf8'));
    const topics = ielts.topics || [];
    // Chuyển sang cùng format với database.json
    const ieltsSets = topics.map(t => ({
      id:          t.id,
      name:        t.name,
      description: t.description || 'IELTS Vocabulary',
      category:    t.category    || 'IELTS',
      cards:       (t.words || t.cards || []).map(w => ({
        id:      w.id,
        front:   w.word   || w.front,
        back:    w.meaning || w.back,
        example: w.example || '',
        known:   false, correct: 0, incorrect: 0
      }))
    }));
    allSets = [...allSets, ...ieltsSets];
    console.log(`Loaded ${ieltsSets.length} IELTS topics from ielts_vocab_full.json`);
  } else {
    console.warn('ielts_vocab_full.json not found, skipping.');
  }

  if (allSets.length > 0) {
    const check = await pool.request().query('SELECT COUNT(*) AS cnt FROM sets');
    if (check.recordset[0].cnt === 0) {
      await pool.request()
        .input('data', sql.NVarChar(sql.MAX), JSON.stringify(allSets))
        .query('INSERT INTO sets (data) VALUES (@data)');
    } else {
      await pool.request()
        .input('data', sql.NVarChar(sql.MAX), JSON.stringify(allSets))
        .query('UPDATE sets SET data = @data, updated_at = GETDATE() WHERE id = (SELECT MIN(id) FROM sets)');
    }
    console.log(`  ✓ ${allSets.length} sets migrated to SQL`);
  }

  console.log('\nMigration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
