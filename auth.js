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
  const [isFirstRun, setIsFirstRun] = useState(false);
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Kiểm tra server và trạng thái first-run
  useEffect(() => {
    (async () => {
      const result = await window.GitHub.checkStatus();
      if (result.error) {
        setStatus('error');
        setStatusMsg('Không thể kết nối đến server. Đảm bảo backend đang chạy tại địa chỉ đã cấu hình trong api.js.');
        return;
      }
      setIsFirstRun(!result.hasUsers);
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

    if (isFirstRun) {
      // Lần đầu: tạo tài khoản admin qua /api/setup
      const result = await window.GitHub.setup(uTrim, pTrim);
      if (result.ok) {
        onLoginSuccess(uTrim);
      } else {
        setError('Không thể tạo tài khoản. Kiểm tra kết nối server.');
      }
    } else {
      // Đăng nhập qua /api/login → nhận JWT
      const result = await window.GitHub.login(uTrim, pTrim);
      if (result.ok) {
        onLoginSuccess(uTrim);
      } else if (result.error === 'unauthorized') {
        setError('Sai tên đăng nhập hoặc mật khẩu');
      } else {
        setError('Lỗi kết nối server. Vui lòng thử lại.');
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
          <p className="text-xs text-gray-400 mt-2">Đảm bảo backend server đang chạy tại địa chỉ đã cấu hình trong api.js</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

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
