require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const jwt       = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { getPool, sql } = require('./db');

const app        = express();
const PORT       = process.env.PORT       || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '30d';

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Chỉ cho phép GitHub Pages domain (và localhost khi dev)
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || 'https://doannguyen29.github.io')
  .split(',').map(s => s.trim());

app.use(cors({
  origin: (origin, cb) => {
    // origin = undefined khi test bằng curl/Postman (không có browser)
    // origin = null khi mở file:// local
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin "${origin}" not allowed`));
  },
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ─── Rate limiting ────────────────────────────────────────────────────────────
// Giới hạn /api/login: tối đa 10 lần thử / 15 phút / mỗi IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'too_many_requests' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Giới hạn toàn bộ API: tối đa 200 request / 1 phút / mỗi IP
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'too_many_requests' },
});
app.use('/api', globalLimiter);

// ─── JWT middleware ────────────────────────────────────────────────────────────
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'token_expired' });
  }
};

// ─── Public endpoints ─────────────────────────────────────────────────────────

// Kiểm tra server + có user nào chưa (để biết có phải first-run không)
app.get('/api/status', async (req, res) => {
  try {
    const pool   = await getPool();
    const result = await pool.request().query('SELECT COUNT(*) AS cnt FROM users');
    res.json({ ok: true, hasUsers: result.recordset[0].cnt > 0 });
  } catch (err) {
    console.error('GET /api/status:', err.message);
    res.status(500).json({ error: 'db_error' });
  }
});

// Tạo tài khoản admin lần đầu (chỉ hoạt động khi chưa có user nào)
app.post('/api/setup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'invalid_body' });

  try {
    const pool   = await getPool();
    const check  = await pool.request().query('SELECT COUNT(*) AS cnt FROM users');
    if (check.recordset[0].cnt > 0) {
      return res.status(403).json({ error: 'already_setup' });
    }
    await pool.request()
      .input('u', sql.NVarChar, username)
      .input('p', sql.NVarChar, password)
      .query('INSERT INTO users (username, password) VALUES (@u, @p)');

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ ok: true, token, username });
  } catch (err) {
    console.error('POST /api/setup:', err.message);
    res.status(500).json({ error: 'db_error' });
  }
});

// Đăng nhập → trả về JWT
app.post('/api/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'invalid_body' });

  try {
    const pool   = await getPool();
    const result = await pool.request()
      .input('u', sql.NVarChar, username)
      .input('p', sql.NVarChar, password)
      .query('SELECT username FROM users WHERE username = @u AND password = @p');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ ok: true, token, username });
  } catch (err) {
    console.error('POST /api/login:', err.message);
    res.status(500).json({ error: 'db_error' });
  }
});

// ─── Protected endpoints (JWT required) ───────────────────────────────────────

// GET /api/users
app.get('/api/users', requireAuth, async (req, res) => {
  try {
    const pool   = await getPool();
    const result = await pool.request().query('SELECT username, password FROM users ORDER BY id');
    res.json({ users: result.recordset, sha: null });
  } catch (err) {
    console.error('GET /api/users:', err.message);
    res.status(500).json({ error: 'db_error' });
  }
});

// PUT /api/users  — thay toàn bộ danh sách
app.put('/api/users', requireAuth, async (req, res) => {
  const { users } = req.body;
  if (!Array.isArray(users)) return res.status(400).json({ error: 'invalid_body' });

  try {
    const pool = await getPool();
    const tx   = new sql.Transaction(pool);
    await tx.begin();
    try {
      const incoming = new Set(users.map(u => u.username.toLowerCase()));
      const existing = await tx.request().query('SELECT username FROM users');
      for (const row of existing.recordset) {
        if (!incoming.has(row.username.toLowerCase())) {
          await tx.request()
            .input('u', sql.NVarChar, row.username)
            .query('DELETE FROM users WHERE username = @u');
        }
      }
      for (const { username, password } of users) {
        await tx.request()
          .input('u', sql.NVarChar, username)
          .input('p', sql.NVarChar, password)
          .query(`
            IF EXISTS (SELECT 1 FROM users WHERE username = @u)
              UPDATE users SET password = @p WHERE username = @u
            ELSE
              INSERT INTO users (username, password) VALUES (@u, @p)
          `);
      }
      await tx.commit();
      res.json({ sha: null });
    } catch (inner) {
      await tx.rollback();
      throw inner;
    }
  } catch (err) {
    console.error('PUT /api/users:', err.message);
    res.status(500).json({ error: 'db_error' });
  }
});

// GET /api/progress/:username
app.get('/api/progress/:username', requireAuth, async (req, res) => {
  try {
    const pool   = await getPool();
    const result = await pool.request()
      .input('u', sql.NVarChar, req.params.username)
      .query('SELECT data FROM progress WHERE username = @u');

    if (result.recordset.length === 0) return res.status(404).json({ error: 'not_found' });
    res.json({ content: JSON.parse(result.recordset[0].data), sha: null });
  } catch (err) {
    console.error('GET /api/progress/:username:', err.message);
    res.status(500).json({ error: 'db_error' });
  }
});

// PUT /api/progress/:username
app.put('/api/progress/:username', requireAuth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'invalid_body' });

  try {
    const pool = await getPool();
    await pool.request()
      .input('u',    sql.NVarChar, req.params.username)
      .input('data', sql.NVarChar(sql.MAX), JSON.stringify(content))
      .query(`
        IF EXISTS (SELECT 1 FROM progress WHERE username = @u)
          UPDATE progress SET data = @data, updated_at = GETDATE() WHERE username = @u
        ELSE
          INSERT INTO progress (username, data) VALUES (@u, @data)
      `);
    res.json({ sha: null });
  } catch (err) {
    console.error('PUT /api/progress/:username:', err.message);
    res.status(500).json({ error: 'db_error' });
  }
});

// GET /api/admin/stats
app.get('/api/admin/stats', requireAuth, async (req, res) => {
  try {
    const pool   = await getPool();
    const result = await pool.request().query(`
      SELECT u.username, p.data
      FROM users u
      LEFT JOIN progress p ON p.username = u.username
      WHERE u.username <> 'admin'
    `);
    const stats = result.recordset.map(row => {
      const prog         = row.data ? JSON.parse(row.data) : {};
      const progressMap  = prog.progress || {};
      const totalLearned = Object.keys(progressMap).length;
      const mastered     = Object.values(progressMap).filter(x => x.known).length;
      return { username: row.username, totalLearned, mastered };
    });
    res.json({ stats });
  } catch (err) {
    console.error('GET /api/admin/stats:', err.message);
    res.status(500).json({ error: 'db_error' });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
getPool()
  .then(() => app.listen(PORT, () => console.log(`FlashLearn API running on port ${PORT}`)))
  .catch(err => { console.error('Cannot connect to SQL Server:', err.message); process.exit(1); });
