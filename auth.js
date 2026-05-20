const { useState, useEffect } = React;
const { Btn } = window.UI;

const CURRENT_USER_KEY = 'flashlearn_current_user';
const DATA_PREFIX      = 'flashlearn_v3__';

const loadCurrentUser = () => { try { return localStorage.getItem(CURRENT_USER_KEY); } catch { return null; } };
const saveCurrentUser = (user) => { try { if (user) localStorage.setItem(CURRENT_USER_KEY, user); else localStorage.removeItem(CURRENT_USER_KEY); } catch {} };
const loadData  = (user) => { if (!user) return null; try { const d = localStorage.getItem(DATA_PREFIX + user); return d ? JSON.parse(d) : null; } catch { return null; } };
const saveData  = (user, d) => { if (!user) return; try { localStorage.setItem(DATA_PREFIX + user, JSON.stringify(d)); } catch {} };

const AuthScreen = ({ onLoginSuccess }) => {
  const [status, setStatus]       = useState('loading'); // loading | ready | error
  const [statusMsg, setStatusMsg] = useState('');
  const [users, setUsers]         = useState([]);
  const [usersSha, setUsersSha]   = useState(null);
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Tải danh sách tài khoản từ GitHub khi mở app
  useEffect(() => {
    (async () => {
      const result = await window.GitHub.getUsers();
      if (result.error === 'token_invalid') {
        setStatus('error');
        setStatusMsg('Token GitHub không hợp lệ hoặc đã hết hạn. Vui lòng cập nhật token trong github.js.');
        return;
      }
      if (result.error === 'network_error') {
        setStatus('error');
        setStatusMsg('Không thể kết nối đến GitHub. Kiểm tra kết nối mạng và thử lại.');
        return;
      }
      if (result.error) {
        setStatus('error');
        setStatusMsg(`Lỗi khi tải dữ liệu: ${result.error}`);
        return;
      }
      const loaded = result.users || [];
      setUsers(loaded);
      setUsersSha(result.sha);
      // Cache lại localStorage để fallback khi mất mạng
      if (loaded.length > 0) localStorage.setItem('flashlearn_users', JSON.stringify(loaded));
      setStatus('ready');
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const uTrim = username.trim();
    const pTrim = password.trim();
    if (!uTrim || !pTrim) { setError('Vui lòng điền đầy đủ thông tin'); setSubmitting(false); return; }

    const isFirstRun = users.length === 0;

    if (!isFirstRun) {
      // Đăng nhập
      const found = users.find(x => x.username.toLowerCase() === uTrim.toLowerCase() && x.password === pTrim);
      if (found) { onLoginSuccess(found.username); }
      else { setError('Sai tên đăng nhập hoặc mật khẩu'); }
    } else {
      // Lần đầu: tạo tài khoản admin, lưu lên GitHub
      const newUsers = [{ username: uTrim, password: pTrim }];
      const newSha = await window.GitHub.saveUsers(newUsers, usersSha);
      if (newSha !== null) {
        localStorage.setItem('flashlearn_users', JSON.stringify(newUsers));
        onLoginSuccess(uTrim);
      } else {
        setError('Không thể lưu tài khoản. Kiểm tra kết nối mạng và thử lại.');
      }
    }
    setSubmitting(false);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-4xl mb-3">🚀</div>
          <p className="text-gray-500 font-medium">Đang kết nối...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-indigo-100">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border border-gray-100/50 pop-in text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Không thể tải dữ liệu</h2>
          <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 border border-red-100">{statusMsg}</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const isFirstRun = users.length === 0;

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
            <Btn full type="submit" color="blue" disabled={submitting}>
              {submitting ? 'Đang xử lý...' : (isFirstRun ? 'Tạo tài khoản Admin' : 'Đăng nhập')}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
};

window.Auth = { AuthScreen, loadCurrentUser, saveCurrentUser, loadData, saveData };
