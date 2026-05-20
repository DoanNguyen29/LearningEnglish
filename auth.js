const { useState } = React;
const { Btn } = window.UI;
const { SAMPLE } = window.SRS;

const USERS_KEY = 'flashlearn_users';
const CURRENT_USER_KEY = 'flashlearn_current_user';
const DATA_PREFIX = 'flashlearn_v3__';

const loadUsers = () => { try { const d = localStorage.getItem(USERS_KEY); return d ? JSON.parse(d) : []; } catch { return []; } };
const saveUsers = (u) => { try { localStorage.setItem(USERS_KEY, JSON.stringify(u)); } catch {} };
const loadCurrentUser = () => { try { return localStorage.getItem(CURRENT_USER_KEY); } catch { return null; } };
const saveCurrentUser = (user) => { try { if (user) localStorage.setItem(CURRENT_USER_KEY, user); else localStorage.removeItem(CURRENT_USER_KEY); } catch {} };
const loadData = (user) => { if (!user) return null; try { const d = localStorage.getItem(DATA_PREFIX + user); return d ? JSON.parse(d) : null; } catch { return null; } };
const saveData = (user, d) => { if (!user) return; try { localStorage.setItem(DATA_PREFIX + user, JSON.stringify(d)); } catch {} };

const AuthScreen = ({ onLoginSuccess }) => {
  // Chỉ cho phép tạo tài khoản khi chưa có user nào (lần đầu cài đặt)
  const isFirstRun = loadUsers().length === 0;
  const [isLogin, setIsLogin] = useState(!isFirstRun);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const uTrim = username.trim();
    const pTrim = password.trim();
    if (!uTrim || !pTrim) { setError('Vui lòng điền đầy đủ thông tin'); return; }

    const users = loadUsers();
    if (isLogin) {
      const found = users.find(x => x.username.toLowerCase() === uTrim.toLowerCase() && x.password === pTrim);
      if (found) { onLoginSuccess(found.username); }
      else { setError('Sai tên đăng nhập hoặc mật khẩu'); }
    } else {
      // Chỉ chạy nhánh này khi isFirstRun (chưa có user nào)
      users.push({ username: uTrim, password: pTrim });
      saveUsers(users);
      onLoginSuccess(uTrim);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border border-gray-100/50 pop-in">
        <div className="text-center mb-8">
          <span className="text-4xl">🚀</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">FlashLearn</h1>
          <p className="text-sm text-gray-400 mt-1">Học từ vựng thông minh lặp lại ngắt quãng</p>
        </div>
        {isFirstRun && (
          <div className="bg-blue-50 text-blue-700 p-3 text-xs rounded-xl border border-blue-100 mb-4 text-center font-medium">
            Thiết lập lần đầu — Tạo tài khoản admin
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && <div className="bg-red-50 text-red-600 p-3 text-sm rounded-xl border border-red-100 font-medium shake">⚠️ {error}</div>}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Tên tài khoản</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" placeholder="Username..."/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Mật khẩu</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none" placeholder="Password..."/>
          </div>
          <div className="mt-2">
            <Btn full type="submit" color="blue">{isLogin ? 'Đăng nhập' : 'Tạo tài khoản Admin'}</Btn>
          </div>
        </form>
      </div>
    </div>
  );
};

window.Auth = { AuthScreen, loadCurrentUser, saveCurrentUser, loadData, saveData, loadUsers, saveUsers };