// ─── Đổi URL này thành địa chỉ Windows Server của bạn ───────────────────────
const API_BASE = 'http://192.168.6.179:3000/api';
// Ví dụ: const API_BASE = 'http://192.168.1.100:3000/api';
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_KEY = 'fl_jwt';

const getJWT  = ()  => localStorage.getItem(TOKEN_KEY) || '';
const setJWT  = (t) => localStorage.setItem(TOKEN_KEY, t);
const clearJWT = () => localStorage.removeItem(TOKEN_KEY);

const authHeader = () => ({
  'Content-Type':  'application/json',
  'Authorization': `Bearer ${getJWT()}`,
});

// 401 → xoá token, reload về trang login
const handle401 = () => { clearJWT(); window.location.reload(); };

// ─── Auth ─────────────────────────────────────────────────────────────────────

// Kiểm tra server + có user nào chưa
const checkStatus = async () => {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) return { error: `api_error_${res.status}` };
    return await res.json(); // { ok, hasUsers }
  } catch {
    return { error: 'network_error' };
  }
};

// Đăng nhập → lưu JWT
const login = async (username, password) => {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.status === 401) return { error: 'unauthorized' };
    if (!res.ok) return { error: `api_error_${res.status}` };
    const data = await res.json();
    setJWT(data.token);
    return { ok: true };
  } catch {
    return { error: 'network_error' };
  }
};

// Tạo admin lần đầu (chỉ chạy khi chưa có user nào)
const setup = async (username, password) => {
  try {
    const res = await fetch(`${API_BASE}/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return { ok: false };
    const data = await res.json();
    setJWT(data.token);
    return { ok: true };
  } catch {
    return { ok: false };
  }
};

// Đăng xuất
const logout = () => { clearJWT(); window.location.reload(); };

// ─── Users ────────────────────────────────────────────────────────────────────

const getUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/users`, { headers: authHeader() });
    if (res.status === 401) { handle401(); return { users: null, sha: null, error: 'unauthorized' }; }
    if (!res.ok) return { users: null, sha: null, error: `api_error_${res.status}` };
    return await res.json(); // { users, sha: null }
  } catch {
    try {
      const cached = localStorage.getItem('flashlearn_users');
      if (cached) return { users: JSON.parse(cached), sha: null };
    } catch {}
    return { users: null, sha: null, error: 'network_error' };
  }
};

const saveUsers = async (users) => {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify({ users }),
    });
    if (res.status === 401) { handle401(); return null; }
    if (!res.ok) return null;
    return 'ok';
  } catch { return null; }
};

// ─── Progress ─────────────────────────────────────────────────────────────────

const getProgress = async (username) => {
  try {
    const res = await fetch(`${API_BASE}/progress/${encodeURIComponent(username)}`, {
      headers: authHeader(),
    });
    if (res.status === 401) { handle401(); return null; }
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return await res.json(); // { content, sha: null }
  } catch { return null; }
};

const saveProgress = async (username, content) => {
  try {
    const res = await fetch(`${API_BASE}/progress/${encodeURIComponent(username)}`, {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify({ content }),
    });
    if (res.status === 401) { handle401(); return null; }
    if (!res.ok) return null;
    return 'ok';
  } catch { return null; }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

const getAdminStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeader() });
    if (res.status === 401) { handle401(); return []; }
    if (!res.ok) return [];
    const data = await res.json();
    return data.stats || [];
  } catch { return []; }
};

// No-op: không dùng nữa nhưng giữ để không break code cũ
const setToken = () => {};
const getToken = () => '';

window.GitHub = {
  checkStatus, login, setup, logout,
  getUsers, saveUsers,
  getProgress, saveProgress,
  getAdminStats,
  setToken, getToken,
};
