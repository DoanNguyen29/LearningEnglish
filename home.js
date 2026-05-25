const { useState } = React;
const { NavBar, Bar, gradientStyle } = window.UI;

const ImportSetModal = ({ onClose, onImport }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setError('');
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const cards = [];
        rows.forEach(row => {
          if (row[0] && row[1]) {
            cards.push({ front: String(row[0]).trim(), back: String(row[1]).trim(), example: row[2] ? String(row[2]).trim() : '' });
          }
        });
        if (cards.length === 0) {
          setError('Không tìm thấy dữ liệu. Kiểm tra file có cột A (từ tiếng Anh) và cột B (nghĩa tiếng Việt).');
          setPreview([]);
        } else {
          setPreview(cards);
        }
      } catch (err) {
        setError('Lỗi đọc file. Vui lòng dùng file .xlsx, .xls hoặc .csv hợp lệ.');
      }
    };
    reader.readAsArrayBuffer(f);
  };

  const handleImport = () => {
    if (!name.trim() || preview.length === 0) return;
    onImport(name.trim(), preview);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-1">Tạo bộ từ từ Excel</h3>
        <p className="text-xs text-gray-400 mb-4">Cột A: Từ tiếng Anh · Cột B: Nghĩa tiếng Việt · Cột C: Ví dụ (không bắt buộc)</p>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Tên bộ từ vựng..."
          className="w-full px-4 py-2 rounded-xl border text-sm outline-none mb-3"
        />
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-green-200 rounded-xl cursor-pointer bg-green-50 hover:bg-green-100 mb-3">
          <div className="text-center">
            <div className="text-xl mb-0.5">📊</div>
            <div className="text-sm font-semibold text-green-700">{file ? file.name : 'Chọn file Excel'}</div>
            <div className="text-xs text-gray-400">.xlsx · .xls · .csv</div>
          </div>
          <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
        </label>
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        {preview.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">Xem trước — {preview.length} từ:</p>
            <div className="max-h-32 overflow-y-auto border rounded-xl divide-y text-xs">
              {preview.slice(0, 5).map((c, i) => (
                <div key={i} className="px-3 py-1.5 flex gap-3">
                  <span className="font-bold text-gray-700 w-28 truncate">{c.front}</span>
                  <span className="text-blue-600 flex-1 truncate">{c.back}</span>
                </div>
              ))}
              {preview.length > 5 && <div className="px-3 py-1.5 text-gray-400 text-center">... và {preview.length - 5} từ khác</div>}
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 bg-gray-100 font-semibold py-2 rounded-xl text-sm">Hủy</button>
          <button onClick={handleImport} disabled={!name.trim() || preview.length === 0} className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-xl text-sm disabled:opacity-40">
            Tạo bộ từ {preview.length > 0 ? `(${preview.length} từ)` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

const SyncBadge = ({ status }) => {
  if (!status) return null;
  const map = {
    loading: { text: 'Đang tải...', cls: 'bg-blue-100 text-blue-600' },
    pending: { text: 'Chờ lưu...', cls: 'bg-yellow-100 text-yellow-700' },
    saving:  { text: '⏳ Đang lưu', cls: 'bg-yellow-100 text-yellow-700' },
    saved:   { text: '✓ Đã đồng bộ', cls: 'bg-green-100 text-green-700' },
    error:   { text: '✗ Lưu thất bại', cls: 'bg-red-100 text-red-600' },
  };
  const s = map[status];
  if (!s) return null;
  return <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${s.cls}`}>{s.text}</span>;
};

const HomeScreen = ({ sets, onSelect, onCreate, onDelete, currentUser, onLogout, onImportSet, onManageUsers, onExport, onExportProgress, onImportProgress, syncStatus, onBack }) => {
  const [q, setQ] = useState('');
  const [showImportSet, setShowImportSet] = useState(false);
  const now = Date.now();
  const filtered = sets.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || (s.description || '').toLowerCase().includes(q.toLowerCase()));
  const total    = sets.reduce((n, s) => n + s.cards.length, 0);
  const known    = sets.reduce((n, s) => n + s.cards.filter(c => c.known).length, 0);
  const dueTotal = sets.reduce((n, s) => n + s.cards.filter(c => c.srsStatus && c.srsStatus !== 'new' && (c.srsNextReview || 0) <= now).length, 0);

  return (
    <div className="min-h-screen">
      <NavBar title="📚 Từ Vựng" onBack={onBack} extra={
        <div className="flex items-center gap-2">
          
          {/* --- SỬA ĐOẠN NÀY --- */}
          {currentUser === 'admin' && (
            <>
              <button onClick={onManageUsers} className="flex items-center gap-1.5 bg-gray-700 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800">
                👥 Tài khoản
              </button>
              <button onClick={onExport} className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600">
                📤 Xuất DB
              </button>
              <button onClick={() => setShowImportSet(true)} className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-green-700">
                📊 Import Excel
              </button>
              <button onClick={onCreate} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">
                Tạo bộ mới
              </button>
            </>
          )}
          {/* ------------------- */}

          {currentUser !== 'admin' && <SyncBadge status={syncStatus}/>}
          <button onClick={onLogout} className="bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-sm font-semibold">Đăng xuất</button>
        </div>
      } />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 shadow-lg mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Tiến trình tổng thể</h2>
            <div className="flex items-center gap-4 mt-3 text-sm opacity-90">
              <div><span className="font-bold text-lg">{total}</span> Từ vựng</div>
              <div><span className="font-bold text-lg text-green-300">{known}</span> Đã thuộc</div>
              {dueTotal > 0 && <div className="bg-orange-500/40 px-2 py-0.5 rounded-lg text-xs font-bold animate-pulse">🔥 {dueTotal} thẻ cần ôn</div>}
            </div>
          </div>
        </div>
        <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm kiếm học phần..." className="w-full px-5 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm outline-none mb-6" />
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(set => {
            const k = set.cards.filter(c => c.known).length;
            const due = set.cards.filter(c => c.srsStatus && c.srsStatus !== 'new' && (c.srsNextReview || 0) <= now).length;
            return (
              <div key={set.id} onClick={() => onSelect(set.id)} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800 truncate">{set.name}</h3>
                      {due > 0 && <span className="pill bg-orange-100 text-orange-700">{due} cần ôn</span>}
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); onDelete(set.id); }} className="text-gray-300 hover:text-red-400">Xóa</button>
                </div>
                <div className="flex items-center gap-3 mt-2 mb-1.5">
                  <span className="text-xs text-gray-400">{set.cards.length} từ</span>
                  <span className="text-xs font-semibold text-green-600">{k} đã thuộc</span>
                </div>
                {set.cards.length > 0 && <Bar value={k} max={set.cards.length} color="bg-green-500" />}
              </div>
            );
          })}
        </div>
      </div>
      {showImportSet && (
        <ImportSetModal
          onClose={() => setShowImportSet(false)}
          onImport={(name, cards) => { onImportSet(name, cards); setShowImportSet(false); }}
        />
      )}
    </div>
  );
};

const DashboardScreen = ({ currentUser, onLogout, onNavigate, syncStatus, onManageUsers, onExport, onImportSet, onCreate, displaySets }) => {
  const [showImportSet, setShowImportSet] = useState(false);
  const isAdmin = currentUser === 'admin';

  const modules = [
    {
      id: 'vocabulary',
      icon: '📚',
      title: 'Học Từ Vựng',
      description: 'Flashcard, SRS và các bộ từ vựng do admin tạo',
      gradient: 'from-blue-500 to-indigo-600',
      stat: displaySets ? `${displaySets.length} bộ từ` : '...'
    },
    {
      id: 'grammar',
      icon: '📝',
      title: 'Ngữ Pháp',
      description: '12 thì tiếng Anh với công thức và ví dụ chi tiết',
      gradient: 'from-violet-500 to-purple-600',
      stat: '12 thì'
    },
    {
      id: 'podcast',
      icon: '🎧',
      title: 'Luyện Nghe',
      description: 'Podcast tiếng Anh từ BBC, VOA, TED và nhiều kênh khác',
      gradient: 'from-green-500 to-emerald-600',
      stat: '31 kênh podcast'
    },
    {
      id: 'test',
      icon: '📋',
      title: 'Bài Kiểm Tra',
      description: 'Trắc nghiệm ngữ pháp và từ vựng để kiểm tra kiến thức',
      gradient: 'from-amber-500 to-orange-600',
      stat: '45 câu hỏi ngữ pháp'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar
        title="FlashLearn"
        extra={
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button onClick={onManageUsers} className="flex items-center gap-1 bg-gray-700 text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-gray-800">
                  👥 Tài khoản
                </button>
                <button onClick={onExport} className="flex items-center gap-1 bg-orange-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-orange-600">
                  📤 Xuất DB
                </button>
                <button onClick={() => setShowImportSet(true)} className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-green-700">
                  📊 Import
                </button>
                <button onClick={onCreate} className="flex items-center gap-1 bg-blue-600 text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-blue-700">
                  + Tạo bộ
                </button>
              </>
            )}
            {!isAdmin && <SyncBadge status={syncStatus} />}
            <button onClick={onLogout} className="bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-xl text-xs font-semibold">Đăng xuất</button>
          </div>
        }
      />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-lg mb-8">
          <div className="text-sm opacity-80 mb-1">Xin chào 👋</div>
          <h1 className="text-2xl font-bold">{currentUser}</h1>
          <p className="text-sm opacity-80 mt-2">Hôm nay bạn muốn học gì?</p>
        </div>

        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Chọn nội dung học</h2>
        <div className="grid gap-4">
          {modules.map(m => (
            <button
              key={m.id}
              onClick={() => onNavigate(m.id)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all overflow-hidden"
            >
              <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                <div style={gradientStyle(m.gradient)} className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-3xl">{m.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="text-gray-800 font-bold text-base">{m.title}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{m.stat}</div>
                </div>
                <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-500">{m.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showImportSet && (
        <ImportSetModal
          onClose={() => setShowImportSet(false)}
          onImport={(name, cards) => { onImportSet(name, cards); setShowImportSet(false); }}
        />
      )}
    </div>
  );
};

window.HomeScreen = HomeScreen;
window.DashboardScreen = DashboardScreen;
