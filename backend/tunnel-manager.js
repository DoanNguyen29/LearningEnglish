require('dotenv').config();
const { spawn } = require('child_process');
const https     = require('https');

const CLOUDFLARED   = process.env.CLOUDFLARED_PATH || 'cloudflared';
const GITHUB_TOKEN  = process.env.GITHUB_TOKEN;
const GITHUB_OWNER  = process.env.GITHUB_OWNER;
const GITHUB_REPO   = process.env.GITHUB_REPO;

if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
  console.error('Thiếu GITHUB_TOKEN, GITHUB_OWNER hoặc GITHUB_REPO trong .env');
  process.exit(1);
}

// ─── Khởi động cloudflared ────────────────────────────────────────────────────
console.log('Starting cloudflared tunnel...');
const cf = spawn(CLOUDFLARED, ['tunnel', '--url', 'http://localhost:3000'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});

let urlUpdated = false;

const handleOutput = (data) => {
  const text = data.toString();
  process.stdout.write(text);

  if (!urlUpdated) {
    const match = text.match(/https:\/\/[a-z0-9\-]+\.trycloudflare\.com/);
    if (match) {
      urlUpdated = true;
      updateGitHub(match[0]);
    }
  }
};

cf.stdout.on('data', handleOutput);
cf.stderr.on('data', handleOutput);

cf.on('exit', (code) => {
  console.log(`cloudflared exited (code ${code})`);
  process.exit(code || 0);
});

// ─── Cập nhật api.js trên GitHub ─────────────────────────────────────────────
async function updateGitHub(tunnelUrl) {
  const apiBase = `${tunnelUrl}/api`;
  console.log(`\nTunnel URL: ${tunnelUrl}`);
  console.log(`Updating api.js on GitHub...`);

  try {
    // 1. Lấy nội dung và SHA hiện tại của api.js
    const current = await githubGet(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/api.js`);
    const oldContent = Buffer.from(current.content, 'base64').toString('utf8');

    // 2. Thay dòng API_BASE
    const newContent = oldContent.replace(
      /const API_BASE = '[^']*';/,
      `const API_BASE = '${apiBase}';`
    );

    if (newContent === oldContent) {
      console.log('URL không thay đổi, bỏ qua.');
      return;
    }

    // 3. Push lên GitHub
    await githubPut(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/api.js`, {
      message: 'chore: update Cloudflare Tunnel URL',
      content: Buffer.from(newContent).toString('base64'),
      sha:     current.sha,
    });

    console.log(`api.js đã cập nhật: ${apiBase}`);
    console.log('GitHub Pages sẽ deploy trong ~1 phút.');
  } catch (err) {
    console.error('Lỗi cập nhật GitHub:', err.message);
  }
}

// ─── GitHub API helpers ───────────────────────────────────────────────────────
function githubRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req  = https.request({
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        Authorization:  `token ${GITHUB_TOKEN}`,
        Accept:         'application/vnd.github.v3+json',
        'User-Agent':   'FlashLearn-TunnelManager',
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error(`Invalid JSON: ${raw}`)); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

const githubGet = (path)        => githubRequest('GET',  path);
const githubPut = (path, body)  => githubRequest('PUT',  path, body);
