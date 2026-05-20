const { useState } = React;
const { NavBar, Bar, Btn, SpeakBtn } = window.UI;
const { SRS_BADGE, SRS_LABEL } = window.SRS;

const ImportExcelModal = ({ onClose, onImport }) => {
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
    if (preview.length === 0) return;
    const cards = preview.map(c => ({
      id: 'excel_' + Math.random().toString(36).slice(2),
      front: c.front, back: c.back, example: c.example,
      known: false, correct: 0, incorrect: 0
    }));
    onImport(cards);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-1">Import thẻ từ Excel</h3>
        <p className="text-xs text-gray-400 mb-4">Cột A: Từ tiếng Anh · Cột B: Nghĩa tiếng Việt · Cột C: Ví dụ (không bắt buộc)</p>
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
          <button onClick={handleImport} disabled={preview.length === 0} className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-xl text-sm disabled:opacity-40">
            Nhập {preview.length > 0 ? `${preview.length} từ` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

const ImportModal = ({ onClose, onImport }) => {
  const [text, setText] = useState('');
  const handleGo = () => {
    const lines = text.split('\n');
    const cards = [];
    lines.forEach(l => {
      const parts = l.split('\t');
      if (parts[0] && parts[1]) {
        cards.push({ id: 'imported_' + Math.random().toString(36).slice(2), front: parts[0].trim(), back: parts[1].trim(), example: (parts[2] || '').trim(), known: false, correct: 0, incorrect: 0 });
      }
    });
    onImport(cards);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-2">Nhập hàng loạt (Tab-separated)</h3>
        <textarea rows="6" value={text} onChange={e => setText(e.target.value)} className="w-full border p-2 text-sm rounded-xl outline-none mb-3" placeholder="Từ_Anh[Tab]Nghĩa_Việt[Tab]Ví_dụ..."/>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 bg-gray-100 font-semibold py-2 rounded-xl text-sm">Hủy</button>
          <button onClick={handleGo} className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-xl text-sm">Xác nhận nhập</button>
        </div>
      </div>
    </div>
  );
};

const SetDetail = ({ set, onBack, onStudy, onAddCard, onEditCard, onDeleteCard, onImportCards, isAdmin }) => {
  const [showImport, setShowImport] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const now = Date.now();
  const srsQueue = set.cards.filter(c => !c.srsStatus || c.srsStatus === 'new' || (c.srsNextReview || 0) <= now);

  // Chỉ kích hoạt chế độ xem (Khóa sửa đổi) nếu đây là bộ từ hệ thống và user hiện tại không phải admin
  const isReadOnly = set.isSystem && !isAdmin;

  return (
    <div className="min-h-screen">
      <NavBar 
        title={set.name} 
        onBack={onBack} 
        extra={!isReadOnly && <button onClick={onAddCard} className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded-xl hover:bg-blue-100">Thêm từ</button>}
      />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-500 mb-6">{set.description || 'Không có mô tả.'}</p>
        
        {/* Chỉ học viên mới thấy thanh điều hướng học tập, Admin chỉ vào quản lý từ */}
        {!isAdmin && (
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <button onClick={() => onStudy('learn')} className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-left shadow-sm transition-transform active:scale-98">
              <div className="text-xl mb-1">🧠</div>
              <div className="font-bold text-sm">Học SRS</div>
              <div className="text-xs opacity-80 mt-0.5">{srsQueue.length} từ cần ôn</div>
            </button>
            <button onClick={() => onStudy('flashcard')} className="p-4 rounded-2xl bg-white border border-gray-200 text-left shadow-xs hover:border-gray-300">
              <div className="text-xl mb-1">🎴</div>
              <div className="font-bold text-sm text-gray-800">Flashcard</div>
              <div className="text-xs text-gray-400 mt-0.5">Lật thẻ ghi nhớ</div>
            </button>
            <button onClick={() => onStudy('quiz')} className="p-4 rounded-2xl bg-white border border-gray-200 text-left shadow-xs hover:border-gray-300">
              <div className="text-xl mb-1">📝</div>
              <div className="font-bold text-sm text-gray-800">Trắc nghiệm</div>
              <div className="text-xs text-gray-400 mt-0.5">Chọn đáp án đúng</div>
            </button>
            <button onClick={() => onStudy('write')} className="p-4 rounded-2xl bg-white border border-gray-200 text-left shadow-xs hover:border-gray-300">
              <div className="text-xl mb-1">✍️</div>
              <div className="font-bold text-sm text-gray-800">Gõ chữ</div>
              <div className="text-xs text-gray-400 mt-0.5">Luyện viết chính tả</div>
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Danh sách thẻ ({set.cards.length})</h3>
          {!isReadOnly && (
            <div className="flex gap-3">
              <button onClick={() => setShowImport(true)} className="text-sm text-blue-600 font-semibold hover:underline">Nhập hàng loạt</button>
              <button onClick={() => setShowExcelImport(true)} className="text-sm text-green-600 font-semibold hover:underline">📊 Import Excel</button>
            </div>
          )}
        </div>

        <div className="grid gap-2">
          {set.cards.map((card) => {
            const st = card.srsStatus || 'new';
            return (
              <div key={card.id} className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{card.front}</span>
                    <SpeakBtn text={card.front}/>
                    {!isAdmin && <span className={`pill ${SRS_BADGE[st]}`}>{SRS_LABEL[st]}</span>}
                  </div>
                  <div className="text-sm text-blue-600 font-medium mt-0.5">{card.back}</div>
                  {card.example && <div className="text-xs text-gray-400 italic mt-0.5">"{card.example}"</div>}
                </div>
                
                {/* Ẩn hoàn toàn nút Sửa/Xóa đối với học viên khi vào xem bộ từ vựng hệ thống */}
                {!isReadOnly && (
                  <div className="flex gap-2">
                    <button onClick={() => onEditCard(card)} className="text-gray-400 text-xs font-medium hover:text-blue-600">Sửa</button>
                    <button onClick={() => onDeleteCard(card.id)} className="text-red-400 text-xs font-medium hover:text-red-600">Xóa</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={cards => { onImportCards(cards); setShowImport(false); }}/>}
      {showExcelImport && <ImportExcelModal onClose={() => setShowExcelImport(false)} onImport={cards => { onImportCards(cards); setShowExcelImport(false); }}/>}
    </div>
  );
};

window.SetDetail = SetDetail;
