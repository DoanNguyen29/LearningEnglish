const { loadCurrentUser, saveCurrentUser, loadData, saveData, loadUsers, saveUsers, AuthScreen } = window.Auth;
const { HomeScreen } = window;
const { SetDetail } = window;
const { LearnStudy, FlashcardStudy, QuizStudy, WriteStudy } = window.Study;
const { uid } = window.SRS;

const { useState, useEffect } = React;

const UserManagementModal = ({ onClose }) => {
  const [users, setUsers] = useState(() => loadUsers().filter(u => u.username !== 'admin'));
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreate = () => {
    const u = newUsername.trim();
    const p = newPassword.trim();
    if (!u || !p) { setError('Vui lòng điền đầy đủ'); return; }
    const allUsers = loadUsers();
    if (allUsers.some(x => x.username.toLowerCase() === u.toLowerCase())) {
      setError('Tên tài khoản đã tồn tại'); return;
    }
    const updated = [...allUsers, { username: u, password: p }];
    saveUsers(updated);
    setUsers(updated.filter(x => x.username !== 'admin'));
    setNewUsername('');
    setNewPassword('');
    setError('');
    setSuccess(`Đã tạo tài khoản "${u}"`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (username) => {
    if (!confirm(`Xóa tài khoản "${username}"? Toàn bộ tiến trình học của người này cũng bị xóa.`)) return;
    const updated = loadUsers().filter(u => u.username !== username);
    saveUsers(updated);
    localStorage.removeItem('flashlearn_v3__' + username);
    setUsers(updated.filter(u => u.username !== 'admin'));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">Quản lý tài khoản</h3>
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tài khoản hiện có ({users.length})</p>
          {users.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-3 border rounded-xl">Chưa có tài khoản nào</p>
          ) : (
            <div className="border rounded-xl divide-y max-h-44 overflow-y-auto">
              {users.map(u => (
                <div key={u.username} className="flex justify-between items-center px-3 py-2.5">
                  <span className="text-sm font-medium text-gray-700">👤 {u.username}</span>
                  <button onClick={() => handleDelete(u.username)} className="text-xs text-red-400 hover:text-red-600 font-semibold">Xóa</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Thêm tài khoản mới</p>
          {error && <p className="text-xs text-red-500 mb-2">⚠️ {error}</p>}
          {success && <p className="text-xs text-green-600 mb-2">✓ {success}</p>}
          <div className="grid gap-2 mb-3">
            <input type="text" value={newUsername} onChange={e => { setNewUsername(e.target.value); setError(''); }} placeholder="Tên tài khoản..." className="w-full px-3 py-2 rounded-xl border text-sm outline-none"/>
            <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mật khẩu..." className="w-full px-3 py-2 rounded-xl border text-sm outline-none"/>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 bg-gray-100 font-semibold py-2 rounded-xl text-sm">Đóng</button>
            <button onClick={handleCreate} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-xl text-sm">Tạo tài khoản</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardModal = ({ card, onClose, onSave }) => {
  const [f, setF] = useState(card ? card.front : '');
  const [b, setB] = useState(card ? card.back : '');
  const [e, setE] = useState(card ? card.example : '');

  const go = (evt) => {
    evt.preventDefault();
    if (!f.trim() || !b.trim()) return;
    onSave({ front: f.trim(), back: b.trim(), example: e.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">{card ? 'Sửa từ' : 'Thêm từ mới'}</h3>
        <form onSubmit={go} className="grid gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Từ tiếng Anh</label>
            <input type="text" value={f} onChange={e => setF(e.target.value)} className="w-full px-4 py-2 rounded-xl border text-sm outline-none" required/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nghĩa tiếng Việt</label>
            <input type="text" value={b} onChange={e => setB(e.target.value)} className="w-full px-4 py-2 rounded-xl border text-sm outline-none" required/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ví dụ (Không bắt buộc)</label>
            <input type="text" value={e} onChange={e => setE(e.target.value)} className="w-full px-4 py-2 rounded-xl border text-sm outline-none"/>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 font-semibold py-2 rounded-xl text-sm">Hủy</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-xl text-sm">Lưu lại</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUser());
  const [userData, setUserData] = useState({ customSets: [], progress: {} });
  const [displaySets, setDisplaySets] = useState([]);
  const [userListProgress, setUserListProgress] = useState([]);
  const [systemSets, setSystemSets] = useState(null);

  const [screen, setScreen] = useState('home');
  const [setId, setSetId] = useState(null);
  const [editCard, setEditCard] = useState(undefined);
  const [showUserMgmt, setShowUserMgmt] = useState(false);

  const isAdmin = currentUser === 'admin';

  // Fetch database.json từ GitHub (hoặc cùng thư mục) khi app khởi động
  useEffect(() => {
    fetch('./database.json?t=' + Date.now())
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setSystemSets(data))
      .catch(() => {
        const cached = localStorage.getItem('flashlearn_admin_system_sets');
        setSystemSets(cached ? JSON.parse(cached) : window.SRS.SAMPLE.sets);
      });
  }, []);

  // 1. Tải tiến trình cá nhân hoặc quét báo cáo tổng cho Admin khi đăng nhập
  useEffect(() => {
    if (!currentUser) {
      setUserData({ customSets: [], progress: {} });
      setUserListProgress([]);
      return;
    }

    const sharedSets = JSON.parse(localStorage.getItem('SHARED_SETS') || '[]');
    
    if (currentUser === 'admin') {
        // Nếu là admin, hiển thị kho chung
        setDisplaySets(sharedSets);
    } else {
        // Nếu là user, bạn có thể trộn kho chung + kho cá nhân (nếu có)
        // hoặc chỉ hiển thị kho chung
        setDisplaySets(sharedSets);
    }
    if (isAdmin) {
      // ADMIN: Tải kho từ vựng hệ thống dùng chung từ localStorage toàn cục
      const systemData = localStorage.getItem('flashlearn_admin_system_sets');
      setUserData({
        customSets: systemData ? JSON.parse(systemData) : window.SRS.SAMPLE.sets,
        progress: {}
      });

      // ADMIN: Thu thập thống kê tiến độ học của tất cả học viên trong hệ thống
      try {
        const allUsers = JSON.parse(localStorage.getItem('flashlearn_users') || '[]');
        const progressSummary = allUsers
          .filter(u => u.username !== 'admin')
          .map(u => {
            const uData = JSON.parse(localStorage.getItem('flashlearn_v3__' + u.username) || '{"progress":{}}');
            const totalLearned = Object.keys(uData.progress || {}).length;
            const mastered = Object.values(uData.progress || {}).filter(p => p.known).length;
            return { username: u.username, totalLearned, mastered };
          });
        setUserListProgress(progressSummary);
      } catch (e) {
        console.error("Lỗi đọc dữ liệu thống kê user:", e);
      }
    } else {
      // USER THƯỜNG: Tải dữ liệu tiến trình học cá nhân như bình thường
      const uData = loadData(currentUser);
      if (uData) setUserData(uData); else setUserData({ customSets: [], progress: {} });
    }
  }, [currentUser]);

  // 2. Trộn kho từ vựng dùng chung của Admin và Tiến độ học cá nhân
  useEffect(() => {
    if (!currentUser) return;

    if (isAdmin) {
      // Admin làm việc trực tiếp trên kho hệ thống
      setDisplaySets(userData.customSets);
      localStorage.setItem('flashlearn_admin_system_sets', JSON.stringify(userData.customSets));
    } else {
      // User thường: dùng systemSets từ database.json (fetch từ GitHub)
      const sharedSets = systemSets || JSON.parse(localStorage.getItem('flashlearn_admin_system_sets') || 'null') || window.SRS.SAMPLE.sets;

      // Đánh dấu isSystem để khóa quyền thao tác của user thường
      const markedSystemSets = sharedSets.map(s => ({ ...s, isSystem: true }));
      const allRawSets = [...markedSystemSets, ...userData.customSets];

      // Bơm trạng thái SRS cá nhân vào từng thẻ từ
      const combined = allRawSets.map(set => {
        const mappedCards = set.cards.map(card => {
          const p = userData.progress[card.id] || { srsStatus: 'new', srsInterval: 0, srsEase: 2.5, known: false, correct: 0, incorrect: 0 };
          return { ...card, ...p };
        });
        return { ...set, cards: mappedCards };
      });
      setDisplaySets(combined);
      saveData(currentUser, userData);
    }
  }, [userData, currentUser, systemSets]);

  const handleLoginSuccess = (username) => { saveCurrentUser(username); setCurrentUser(username); setScreen('home'); };
  const handleLogout = () => { saveCurrentUser(null); setCurrentUser(null); setScreen('home'); };

  const addSet = () => {
    if (currentUser !== 'admin') {
    alert("Bạn không có quyền thực hiện thao tác này!");
    return;
  }
    const name = prompt('Nhập tên bộ thẻ mới:');
    if (!name || !name.trim()) return;
    const newSet = { id: uid(), name: name.trim(), description: isAdmin ? 'Kho từ vựng hệ thống (Dùng chung)' : 'Bộ từ cá nhân tự tạo', cards: [] };
    setUserData(prev => ({ ...prev, customSets: [newSet, ...prev.customSets] }));
  };

  const deleteSet = (id) => {
    const targetSet = displaySets.find(s => s.id === id);
    if (!isAdmin && targetSet?.isSystem) {
      alert('Bạn không có quyền xóa bộ từ vựng dùng chung của hệ thống!');
      return;
    }
    if (!confirm('Bạn có chắc chắn muốn xóa bộ thẻ này?')) return;
    setUserData(prev => ({ ...prev, customSets: prev.customSets.filter(s => s.id !== id) }));
  };

  const updateCardStatus = (sid, cid, upd) => {
    if (isAdmin) return;
    setUserData(prev => ({
      ...prev,
      progress: { ...prev.progress, [cid]: { ...(prev.progress[cid] || {}), ...upd } }
    }));
  };

  const saveCard = (fields) => {
    setUserData(prev => ({
      ...prev,
      customSets: prev.customSets.map(s => {
        if (s.id !== setId) return s;
        if (editCard) return { ...s, cards: s.cards.map(c => c.id === editCard.id ? { ...c, ...fields } : c) };
        else return { ...s, cards: [...s.cards, { id: uid(), ...fields }] };
      })
    }));
    setEditCard(undefined);
  };

  const deleteCard = (cid) => {
    if (!confirm('Xóa từ này?')) return;
    setUserData(prev => ({
      ...prev,
      customSets: prev.customSets.map(s => s.id === setId ? { ...s, cards: s.cards.filter(c => c.id !== cid) } : s)
    }));
  };

  const importCards = (newCards) => {
    setUserData(prev => ({ ...prev, customSets: prev.customSets.map(s => s.id === setId ? { ...s, cards: [...s.cards, ...newCards] } : s) }));
  };

  const exportDatabase = () => {
    // Strip SRS progress khi export để database.json luôn sạch (progress lưu riêng mỗi user)
    const clean = userData.customSets.map(s => ({
      ...s,
      cards: s.cards.map(({ srsStatus, srsInterval, srsEase, srsLapses, srsNextReview, ...rest }) => ({
        ...rest, known: false, correct: 0, incorrect: 0
      }))
    }));
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'database.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const importSetFromExcel = (name, rawCards) => {
    const newSet = {
      id: uid(),
      name,
      description: 'Kho từ vựng hệ thống (Dùng chung)',
      cards: rawCards.map(c => ({ id: uid(), front: c.front, back: c.back, example: c.example, known: false, correct: 0, incorrect: 0 }))
    };
    setUserData(prev => ({ ...prev, customSets: [newSet, ...prev.customSets] }));
  };

  if (!currentUser) return <AuthScreen onLoginSuccess={handleLoginSuccess}/>;
  const set = displaySets.find(s => s.id === setId);

  if (screen === 'learn' && set) return <LearnStudy set={set} onBack={() => setScreen('set-detail')} onUpdateCard={updateCardStatus}/>;
  if (screen === 'flashcard' && set) return <FlashcardStudy set={set} onBack={() => setScreen('set-detail')} onUpdateCard={updateCardStatus}/>;
  if (screen === 'quiz' && set) return <QuizStudy set={set} onBack={() => setScreen('set-detail')} onUpdateCard={updateCardStatus}/>;
  if (screen === 'write' && set) return <WriteStudy set={set} onBack={() => setScreen('set-detail')} onUpdateCard={updateCardStatus}/>;

  if (screen === 'set-detail' && set) return (
    <>
      <SetDetail set={set} onBack={() => setScreen('home')} onStudy={m => setScreen(m)}
        onAddCard={() => setEditCard(null)} onEditCard={c => setEditCard(c)}
        onDeleteCard={deleteCard} onImportCards={importCards} isAdmin={isAdmin}/>
      {editCard !== undefined && <CardModal card={editCard} onClose={() => setEditCard(undefined)} onSave={saveCard}/>}
    </>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <HomeScreen sets={displaySets} onSelect={id => { setSetId(id); setScreen('set-detail'); }} onCreate={addSet} onDelete={deleteSet} currentUser={currentUser} onLogout={handleLogout} onImportSet={importSetFromExcel} onManageUsers={() => setShowUserMgmt(true)} onExport={exportDatabase}/>
      {showUserMgmt && <UserManagementModal onClose={() => setShowUserMgmt(false)}/>}
      
      {/* THỐNG KÊ HỌC VIÊN DÀNH RIÊNG CHO TÀI KHOẢN ADMIN */}
      {isAdmin && userListProgress.length > 0 && (
        <div className="mt-8 px-4 py-5 bg-white rounded-2xl shadow-sm border border-gray-100 mb-10">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">📊 Báo cáo tiến độ học viên</h3>
          <div className="grid gap-3">
            {userListProgress.map(u => (
              <div key={u.username} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="font-bold text-gray-700">👤 {u.username}</span>
                  <div className="text-xs text-gray-400 mt-0.5">Đã tương tác: {u.totalLearned} từ</div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                  🏆 Đã thuộc (SRS): {u.mastered} từ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);
