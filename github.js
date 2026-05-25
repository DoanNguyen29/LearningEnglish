const GITHUB_TOKEN = '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';
const GITHUB_OWNER = 'DoanNguyen29';
const GITHUB_REPO  = 'LearningEnglish';
const API_BASE     = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`;

const toB64   = str => btoa(unescape(encodeURIComponent(str)));
const fromB64 = str => decodeURIComponent(escape(atob(str.replace(/\s/g, ''))));

const getProgress = async (username) => {
  try {
    const res = await fetch(`${API_BASE}/progress/${username}.json`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { content: JSON.parse(fromB64(data.content)), sha: data.sha };
  } catch { return null; }
};

const saveProgress = async (username, content, sha) => {
  try {
    const body = { message: `progress: ${username}`, content: toB64(JSON.stringify(content, null, 2)) };
    if (sha) body.sha = sha;
    const res = await fetch(`${API_BASE}/progress/${username}.json`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.content.sha;
  } catch { return null; }
};

const getUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/users.json`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (res.status === 404) return { users: [], sha: null }; // file chưa tồn tại → lần đầu chạy
    if (res.status === 401 || res.status === 403) return { users: null, sha: null, error: 'token_invalid' };
    if (!res.ok) return { users: null, sha: null, error: `api_error_${res.status}` };
    const data = await res.json();
    return { users: JSON.parse(fromB64(data.content)), sha: data.sha };
  } catch {
    // Fallback về localStorage nếu mất mạng hoàn toàn
    try {
      const cached = localStorage.getItem('flashlearn_users');
      if (cached) return { users: JSON.parse(cached), sha: null };
    } catch {}
    return { users: null, sha: null, error: 'network_error' };
  }
};

const saveUsers = async (users, sha) => {
  try {
    const body = { message: 'update users', content: toB64(JSON.stringify(users, null, 2)) };
    if (sha) body.sha = sha;
    const res = await fetch(`${API_BASE}/users.json`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.content.sha;
  } catch { return null; }
};

window.GitHub = { getProgress, saveProgress, getUsers, saveUsers };
