const { useState, useEffect } = React;
const { NavBar } = window.UI;

const GRAMMAR_QUESTIONS = [
  // Present Simple
  { id: 'g1', tense: 'present-simple', question: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'went'], answer: 'goes', explanation: 'Chủ ngữ She (số ít) + V-es trong thì Hiện Tại Đơn.' },
  { id: 'g2', tense: 'present-simple', question: 'Water ___ at 100 degrees Celsius.', options: ['boil', 'boils', 'boiling', 'boiled'], answer: 'boils', explanation: 'Sự thật khoa học dùng thì Hiện Tại Đơn. Water là số ít → boils.' },
  { id: 'g3', tense: 'present-simple', question: 'They ___ not eat meat.', options: ['do', 'does', 'did', 'are'], answer: 'do', explanation: 'They (số nhiều) dùng "do not" trong phủ định Hiện Tại Đơn.' },
  { id: 'g4', tense: 'present-simple', question: 'Từ nào là signal word của Hiện Tại Đơn?', options: ['yesterday', 'tomorrow', 'always', 'at the moment'], answer: 'always', explanation: '"Always" là dấu hiệu nhận biết của Hiện Tại Đơn (thói quen, lặp đi lặp lại).' },
  { id: 'g5', tense: 'present-simple', question: '___ he speak English?', options: ['Do', 'Does', 'Is', 'Did'], answer: 'Does', explanation: 'Câu hỏi với chủ ngữ He/She/It trong Hiện Tại Đơn dùng "Does".' },

  // Present Continuous
  { id: 'g6', tense: 'present-continuous', question: 'She ___ studying English now.', options: ['is', 'are', 'was', 'be'], answer: 'is', explanation: 'She (số ít) + is + V-ing trong Hiện Tại Tiếp Diễn.' },
  { id: 'g7', tense: 'present-continuous', question: 'They ___ playing football at the moment.', options: ['is', 'am', 'are', 'were'], answer: 'are', explanation: 'They (số nhiều) + are + V-ing trong Hiện Tại Tiếp Diễn.' },
  { id: 'g8', tense: 'present-continuous', question: 'Câu nào đúng?', options: ['I am knowing the answer.', 'I know the answer.', 'I am know the answer.', 'I knowing the answer.'], answer: 'I know the answer.', explanation: '"Know" là stative verb (động từ trạng thái), không dùng thì tiếp diễn.' },
  { id: 'g9', tense: 'present-continuous', question: 'Từ nào là signal word của Hiện Tại Tiếp Diễn?', options: ['yesterday', 'always', 'at the moment', 'by next week'], answer: 'at the moment', explanation: '"At the moment" = ngay lúc này, dấu hiệu của Hiện Tại Tiếp Diễn.' },
  { id: 'g10', tense: 'present-continuous', question: '___ you coming to the party tonight?', options: ['Do', 'Does', 'Are', 'Is'], answer: 'Are', explanation: 'Câu hỏi với You trong Hiện Tại Tiếp Diễn dùng "Are".' },

  // Present Perfect
  { id: 'g11', tense: 'present-perfect', question: 'She ___ visited Paris twice.', options: ['have', 'has', 'had', 'is'], answer: 'has', explanation: 'She (số ít) + has + V3 trong Hiện Tại Hoàn Thành.' },
  { id: 'g12', tense: 'present-perfect', question: 'I have ___ finished my homework.', options: ['just', 'yesterday', 'last week', 'ago'], answer: 'just', explanation: '"Just" (vừa mới) là signal word của Hiện Tại Hoàn Thành. Các từ còn lại dùng với Past Simple.' },
  { id: 'g13', tense: 'present-perfect', question: 'Have you ever ___ sushi?', options: ['eat', 'eating', 'ate', 'eaten'], answer: 'eaten', explanation: 'have/has + V3 (past participle). "Eaten" là V3 của "eat".' },
  { id: 'g14', tense: 'present-perfect', question: 'He ___ called me yet.', options: ["hasn't", "didn't", "wasn't", "isn't"], answer: "hasn't", explanation: '"Yet" dùng trong câu phủ định/nghi vấn Hiện Tại Hoàn Thành.' },
  { id: 'g15', tense: 'present-perfect', question: 'I lived in Hanoi ___ 5 years. (Tôi đã sống ở HN 5 năm - và vẫn đang sống)', options: ['ago', 'last', 'for', 'when'], answer: 'for', explanation: '"For + khoảng thời gian" dùng với Hiện Tại Hoàn Thành để diễn tả thời gian kéo dài đến hiện tại.' },

  // Past Simple
  { id: 'g16', tense: 'past-simple', question: 'She ___ her grandmother last weekend.', options: ['visit', 'visits', 'visited', 'visiting'], answer: 'visited', explanation: '"Last weekend" là signal word của Quá Khứ Đơn → dùng V-ed.' },
  { id: 'g17', tense: 'past-simple', question: 'I ___ watch the movie yesterday.', options: ["didn't", "don't", "wasn't", "haven't"], answer: "didn't", explanation: 'Phủ định Quá Khứ Đơn: S + didn\'t + V (nguyên mẫu).' },
  { id: 'g18', tense: 'past-simple', question: '___ you go to the party last night?', options: ['Do', 'Did', 'Have', 'Were'], answer: 'Did', explanation: 'Câu hỏi Quá Khứ Đơn: Did + S + V?.' },
  { id: 'g19', tense: 'past-simple', question: 'The word "went" is the past form of:', options: ['go', 'get', 'give', 'grow'], answer: 'go', explanation: '"Went" là V2 của động từ bất quy tắc "go".' },
  { id: 'g20', tense: 'past-simple', question: 'Từ nào là signal word của Quá Khứ Đơn?', options: ['recently', 'just', 'ago', 'since'], answer: 'ago', explanation: '"Ago" (... trước đây) là signal word đặc trưng của Quá Khứ Đơn. Ví dụ: 2 days ago.' },

  // Past Continuous
  { id: 'g21', tense: 'past-continuous', question: 'She ___ cooking when he arrived.', options: ['was', 'were', 'is', 'has been'], answer: 'was', explanation: 'She (số ít) + was + V-ing trong Quá Khứ Tiếp Diễn.' },
  { id: 'g22', tense: 'past-continuous', question: 'At 8pm last night, I ___ TV.', options: ['watched', 'was watching', 'am watching', 'watch'], answer: 'was watching', explanation: '"At 8pm last night" chỉ thời điểm xác định trong quá khứ → Quá Khứ Tiếp Diễn.' },
  { id: 'g23', tense: 'past-continuous', question: 'While she ___ sleeping, he was studying.', options: ['was', 'were', 'is', 'has'], answer: 'was', explanation: 'She (số ít) + was + V-ing. "While" thường đi với Quá Khứ Tiếp Diễn.' },
  { id: 'g24', tense: 'past-continuous', question: '___ they playing football when you called?', options: ['Was', 'Were', 'Did', 'Have'], answer: 'Were', explanation: 'They (số nhiều) + were trong Quá Khứ Tiếp Diễn.' },
  { id: 'g25', tense: 'past-continuous', question: 'Chọn câu đúng (Quá Khứ Tiếp Diễn):', options: ['He study when I called.', 'He was studying when I called.', 'He studied when I was calling.', 'He has studied when I called.'], answer: 'He was studying when I called.', explanation: 'Hành động đang diễn ra (was studying) bị gián đoạn bởi hành động khác (called - Past Simple).' },

  // Past Perfect
  { id: 'g26', tense: 'past-perfect', question: 'When I arrived, the train ___ already left.', options: ['has', 'had', 'was', 'have'], answer: 'had', explanation: 'Hành động "tàu rời đi" xảy ra trước "tôi đến" → Quá Khứ Hoàn Thành: had + V3.' },
  { id: 'g27', tense: 'past-perfect', question: 'She had finished the report before the meeting ___', options: ['starts', 'start', 'started', 'starting'], answer: 'started', explanation: '"Before" + mệnh đề dùng Quá Khứ Đơn (started). Hành động trước đó dùng Quá Khứ Hoàn Thành.' },
  { id: 'g28', tense: 'past-perfect', question: 'He ___ eaten anything before the exam.', options: ["hadn't", "didn't", "wasn't", "doesn't"], answer: "hadn't", explanation: 'Phủ định Quá Khứ Hoàn Thành: hadn\'t + V3.' },
  { id: 'g29', tense: 'past-perfect', question: 'Từ nào là signal word của Quá Khứ Hoàn Thành?', options: ['since then', 'yesterday', 'by the time', 'right now'], answer: 'by the time', explanation: '"By the time" (trước thời điểm...) là signal word của Quá Khứ Hoàn Thành.' },
  { id: 'g30', tense: 'past-perfect', question: '___ you met him before the conference?', options: ['Did', 'Have', 'Had', 'Were'], answer: 'Had', explanation: 'Câu hỏi Quá Khứ Hoàn Thành: Had + S + V3?' },

  // Future Simple
  { id: 'g31', tense: 'future-simple', question: 'It ___ rain tomorrow.', options: ['will', 'would', 'is', 'was'], answer: 'will', explanation: '"Tomorrow" là signal word của Tương Lai Đơn. S + will + V (nguyên mẫu).' },
  { id: 'g32', tense: 'future-simple', question: 'She ___ come to the party.', options: ["won't", "doesn't", "isn't", "hadn't"], answer: "won't", explanation: 'Phủ định Tương Lai Đơn: S + will not (won\'t) + V.' },
  { id: 'g33', tense: 'future-simple', question: '___ you marry me?', options: ['Do', 'Did', 'Will', 'Are'], answer: 'Will', explanation: 'Câu hỏi Tương Lai Đơn: Will + S + V?' },
  { id: 'g34', tense: 'future-simple', question: 'Từ nào là signal word của Tương Lai Đơn?', options: ['yesterday', 'at the moment', 'next month', 'just'], answer: 'next month', explanation: '"Next month" (tháng sau) là signal word của Tương Lai Đơn.' },
  { id: 'g35', tense: 'future-simple', question: 'I think they ___ win the match.', options: ['will', 'would', 'are', 'were'], answer: 'will', explanation: '"I think" thường đi với "will" để diễn đạt dự đoán về tương lai.' },

  // Present Perfect Continuous
  { id: 'g36', tense: 'present-perfect-continuous', question: 'I ___ studying English for 3 years.', options: ['have been', 'has been', 'had been', 'am'], answer: 'have been', explanation: 'I + have + been + V-ing trong Hiện Tại Hoàn Thành Tiếp Diễn.' },
  { id: 'g37', tense: 'present-perfect-continuous', question: 'They have been waiting ___ two hours.', options: ['since', 'for', 'ago', 'when'], answer: 'for', explanation: '"For + khoảng thời gian" trong Hiện Tại Hoàn Thành Tiếp Diễn.' },
  { id: 'g38', tense: 'present-perfect-continuous', question: 'She has been working here ___ 2020.', options: ['for', 'ago', 'since', 'when'], answer: 'since', explanation: '"Since + mốc thời gian" trong Hiện Tại Hoàn Thành Tiếp Diễn.' },

  // Future Perfect
  { id: 'g39', tense: 'future-perfect', question: 'I will have finished the project ___ Friday.', options: ['in', 'on', 'by', 'at'], answer: 'by', explanation: '"By + thời điểm" là signal word đặc trưng của Tương Lai Hoàn Thành.' },
  { id: 'g40', tense: 'future-perfect', question: 'By the time you arrive, she ___ left.', options: ['will have', 'has', 'had', 'will'], answer: 'will have', explanation: 'By the time + hiện tại đơn → will have + V3 (Tương Lai Hoàn Thành).' },
  { id: 'g41', tense: 'future-perfect', question: 'Cấu trúc Tương Lai Hoàn Thành là:', options: ['S + will + V', 'S + will + have + V3', 'S + will + be + V-ing', 'S + had + V3'], answer: 'S + will + have + V3', explanation: 'Tương Lai Hoàn Thành: S + will + have + V3 (quá khứ phân từ).' },

  // Future Continuous
  { id: 'g42', tense: 'future-continuous', question: 'This time tomorrow, I ___ flying to London.', options: ['will be', 'will have', 'am', 'would be'], answer: 'will be', explanation: '"This time tomorrow" + will be + V-ing = Tương Lai Tiếp Diễn.' },
  { id: 'g43', tense: 'future-continuous', question: 'Cấu trúc Tương Lai Tiếp Diễn là:', options: ['S + will + V', 'S + will + have + V3', 'S + will + be + V-ing', 'S + am/is/are + V-ing'], answer: 'S + will + be + V-ing', explanation: 'Tương Lai Tiếp Diễn: S + will + be + V-ing.' },

  // Past Perfect Continuous
  { id: 'g44', tense: 'past-perfect-continuous', question: 'She had been crying ___ an hour when he came back.', options: ['since', 'for', 'ago', 'by'], answer: 'for', explanation: '"For + khoảng thời gian" trong Quá Khứ Hoàn Thành Tiếp Diễn.' },
  { id: 'g45', tense: 'past-perfect-continuous', question: 'Cấu trúc Quá Khứ Hoàn Thành Tiếp Diễn là:', options: ['S + had + V3', 'S + had + been + V-ing', 'S + was/were + V-ing', 'S + have been + V-ing'], answer: 'S + had + been + V-ing', explanation: 'Quá Khứ Hoàn Thành Tiếp Diễn: S + had + been + V-ing.' }
];

const TENSE_NAMES = {
  'present-simple': 'Hiện Tại Đơn',
  'present-continuous': 'Hiện Tại Tiếp Diễn',
  'present-perfect': 'Hiện Tại Hoàn Thành',
  'present-perfect-continuous': 'Hiện Tại Hoàn Thành Tiếp Diễn',
  'past-simple': 'Quá Khứ Đơn',
  'past-continuous': 'Quá Khứ Tiếp Diễn',
  'past-perfect': 'Quá Khứ Hoàn Thành',
  'past-perfect-continuous': 'Quá Khứ Hoàn Thành Tiếp Diễn',
  'future-simple': 'Tương Lai Đơn',
  'future-continuous': 'Tương Lai Tiếp Diễn',
  'future-perfect': 'Tương Lai Hoàn Thành'
};

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const GrammarTestScreen = ({ selectedTense, onBack }) => {
  const [questions] = useState(() => {
    const pool = selectedTense === 'all'
      ? GRAMMAR_QUESTIONS
      : GRAMMAR_QUESTIONS.filter(q => q.tense === selectedTense);
    return shuffle(pool).slice(0, Math.min(10, pool.length));
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const q = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const correct = opt === q.answer;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { question: q.question, selected: opt, answer: q.answer, correct, explanation: q.explanation }]);
  };

  const handleNext = () => {
    if (isLast) {
      setShowResult(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
    }
  };

  if (showResult) {
    const pct = Math.round(score / questions.length * 100);
    const grade = pct >= 80 ? { label: 'Xuất sắc!', color: 'text-green-600', bg: 'bg-green-50', emoji: '🏆' }
      : pct >= 60 ? { label: 'Khá tốt!', color: 'text-blue-600', bg: 'bg-blue-50', emoji: '👍' }
      : { label: 'Cần ôn thêm!', color: 'text-orange-600', bg: 'bg-orange-50', emoji: '📚' };

    return (
      <div className="min-h-screen bg-gray-50 pb-10">
        <NavBar title="Kết Quả" onBack={onBack} />
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className={`${grade.bg} rounded-2xl p-6 text-center mb-6`}>
            <div className="text-5xl mb-3">{grade.emoji}</div>
            <div className={`text-3xl font-bold ${grade.color}`}>{score}/{questions.length}</div>
            <div className={`text-lg font-semibold ${grade.color} mt-1`}>{grade.label}</div>
            <div className="text-gray-500 text-sm mt-1">Tỉ lệ đúng: {pct}%</div>
          </div>

          <h3 className="text-sm font-bold text-gray-600 mb-3">Chi tiết từng câu:</h3>
          <div className="grid gap-3 mb-6">
            {answers.map((a, i) => (
              <div key={i} className={`p-4 rounded-xl border ${a.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-base">{a.correct ? '✅' : '❌'}</span>
                  <p className="text-sm font-medium text-gray-700">{i + 1}. {a.question}</p>
                </div>
                {!a.correct && (
                  <div className="ml-6">
                    <p className="text-xs text-red-600">Bạn chọn: <strong>{a.selected}</strong></p>
                    <p className="text-xs text-green-700">Đáp án đúng: <strong>{a.answer}</strong></p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2 ml-6 leading-relaxed">{a.explanation}</p>
              </div>
            ))}
          </div>

          <button onClick={onBack} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl">
            Về Trang Kiểm Tra
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title={`Câu ${currentIdx + 1}/${questions.length}`} onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {TENSE_NAMES[q.tense] || q.tense}
          </span>
          <span className="text-xs text-gray-400">Điểm: {score}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${(currentIdx / questions.length) * 100}%` }} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <p className="text-base font-semibold text-gray-800 leading-relaxed">{q.question}</p>
        </div>

        <div className="grid gap-3 mb-6">
          {q.options.map(opt => {
            let cls = 'bg-white border-gray-200 text-gray-700';
            if (selected !== null) {
              if (opt === q.answer) cls = 'bg-green-50 border-green-400 text-green-700';
              else if (opt === selected) cls = 'bg-red-50 border-red-400 text-red-700';
            }
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={selected !== null}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm transition-all ${cls} disabled:cursor-not-allowed`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className={`p-4 rounded-xl mb-5 ${selected === q.answer ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
            <p className="text-sm font-semibold mb-1">{selected === q.answer ? '✅ Chính xác!' : `❌ Đáp án đúng: ${q.answer}`}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {selected !== null && (
          <button onClick={handleNext} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl">
            {isLast ? 'Xem Kết Quả' : 'Câu Tiếp Theo →'}
          </button>
        )}
      </div>
    </div>
  );
};

// ── GrammarCategoryScreen (tự quản lý navigation nội bộ) ─────────────
const GrammarCategoryScreen = ({ onBack }) => {
  const [mode, setMode] = useState('pick');
  const [selectedTense, setSelectedTense] = useState(null);
  if (mode === 'test' && selectedTense)
    return <GrammarTestScreen selectedTense={selectedTense} onBack={() => { setMode('pick'); setSelectedTense(null); }} />;
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title="Ngữ Pháp – 12 Thì" onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => { setSelectedTense('all'); setMode('test'); }}
          className="w-full mb-4 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-2xl p-5 text-left shadow-sm">
          <div className="font-bold text-lg">Tổng Hợp 12 Thì</div>
          <div className="text-sm opacity-90 mt-1">Ngẫu nhiên 10 câu từ tất cả các thì</div>
        </button>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Chọn thì cụ thể:</h3>
        <div className="grid gap-2">
          {Object.entries(TENSE_NAMES).map(([id, name]) => (
            <button key={id} onClick={() => { setSelectedTense(id); setMode('test'); }}
              className="w-full text-left px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-sm font-medium text-gray-700">
              {name}
              <span className="text-xs text-gray-400 ml-2">({GRAMMAR_QUESTIONS.filter(q => q.tense === id).length} câu)</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── VocabCategoryScreen ───────────────────────────────────────────────
const VocabCategoryScreen = ({ onBack, displaySets, onStartVocabTest }) => (
  <div className="min-h-screen bg-gray-50 pb-10">
    <NavBar title="Từ Vựng" onBack={onBack} />
    <div className="max-w-2xl mx-auto px-4 py-6">
      <p className="text-sm text-gray-500 mb-4">Chọn bộ từ vựng để kiểm tra:</p>
      {displaySets && displaySets.length > 0 ? (
        <div className="grid gap-3">
          {displaySets.map(set => (
            <button key={set.id} onClick={() => onStartVocabTest(set.id)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4">
              <div className="font-bold text-gray-800">{set.name}</div>
              <div className="text-xs text-gray-400 mt-1">{set.cards.length} từ</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 text-sm">Chưa có bộ từ vựng nào.</div>
      )}
    </div>
  </div>
);

// ── TestHomeScreen – màn hình chọn kỳ thi / kỹ năng ──────────────────
const TestHomeScreen = ({ onBack, displaySets, onStartVocabTest }) => {
  const [cat, setCat] = useState(null);

  if (cat === 'grammar') return <GrammarCategoryScreen onBack={() => setCat(null)} />;
  if (cat === 'vocab')   return <VocabCategoryScreen onBack={() => setCat(null)} displaySets={displaySets} onStartVocabTest={onStartVocabTest} />;
  if (cat === 'toeic')   return <ToeicHomeScreen onBack={() => setCat(null)} />;
  if (cat === 'vstep')   return <VstepHomeScreen onBack={() => setCat(null)} />;
  if (cat === 'ielts')   return <IeltsHomeScreen onBack={() => setCat(null)} />;
  if (cat === 'reading') return <GeneralReadingScreen onBack={() => setCat(null)} />;
  if (cat === 'error')   return <ErrorRecognitionScreen onBack={() => setCat(null)} />;

  const cats = [
    { id: 'toeic',   icon: '🏅', label: 'TOEIC',        sub: 'Part 5 · Part 7 · Reading',      from: 'from-orange-500', to: 'to-orange-700' },
    { id: 'vstep',   icon: '🎓', label: 'VSTEP',         sub: 'Ngữ Pháp · Từ Vựng · Đọc Hiểu', from: 'from-blue-500',   to: 'to-blue-700' },
    { id: 'ielts',   icon: '🌍', label: 'IELTS',         sub: 'Academic Reading · Grammar',      from: 'from-emerald-500',to: 'to-emerald-700' },
    { id: 'grammar', icon: '📝', label: 'Ngữ Pháp',      sub: '12 thì · Trắc nghiệm có giải thích', from: 'from-indigo-500', to: 'to-indigo-700' },
    { id: 'vocab',   icon: '🗂️', label: 'Từ Vựng',       sub: `${displaySets ? displaySets.length : 0} bộ từ · Trắc nghiệm từ thẻ`, from: 'from-green-500', to: 'to-green-700' },
    { id: 'reading', icon: '📖', label: 'Đọc Hiểu',      sub: 'Email · Thông báo · Bài báo',    from: 'from-cyan-500',   to: 'to-cyan-700' },
    { id: 'error',   icon: '🔍', label: 'Tìm Lỗi Sai',  sub: 'Phát hiện lỗi ngữ pháp trong câu', from: 'from-purple-500', to: 'to-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title="Bài Kiểm Tra" onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-400 mb-5">Chọn kỳ thi hoặc kỹ năng muốn luyện tập:</p>
        <div className="grid grid-cols-2 gap-3">
          {cats.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`text-left bg-gradient-to-br ${c.from} ${c.to} text-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all`}>
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-bold text-base leading-tight">{c.label}</div>
              <div className="text-xs opacity-80 mt-1 leading-snug">{c.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// TOEIC Part 5 – Incomplete Sentences (34 câu)
// =====================================================================
const TOEIC_PART5 = [
  // Word Form (5)
  { id: 't1', category: 'word-form', question: 'The company made a significant ___ in its annual revenue last year.', options: ['increase', 'increasing', 'increased', 'increasingly'], answer: 'increase', explanation: 'Sau mạo từ "a" và tính từ "significant" cần DANH TỪ → "increase" (sự tăng trưởng).' },
  { id: 't2', category: 'word-form', question: 'Please submit your ___ for the new project by this Friday.', options: ['propose', 'proposal', 'proposed', 'proposing'], answer: 'proposal', explanation: 'Sau "your" cần DANH TỪ làm tân ngữ → "proposal" (bản đề xuất).' },
  { id: 't3', category: 'word-form', question: 'The manager is ___ responsible for the department\'s performance.', options: ['ultimate', 'ultimacy', 'ultimately', 'ultimated'], answer: 'ultimately', explanation: 'Cần TRẠNG TỪ bổ nghĩa cho tính từ "responsible" → "ultimately" (về cơ bản).' },
  { id: 't4', category: 'word-form', question: 'The new marketing strategy proved to be extremely ___.', options: ['effective', 'effect', 'effectively', 'effecting'], answer: 'effective', explanation: 'Sau "to be" cần TÍNH TỪ → "effective" (có hiệu quả). "Effect" là danh từ.' },
  { id: 't5', category: 'word-form', question: 'We need to improve the ___ of our customer service team.', options: ['efficient', 'efficiently', 'efficiency', 'efficiencies'], answer: 'efficiency', explanation: 'Sau "the" cần DANH TỪ không đếm được → "efficiency" (hiệu suất).' },
  // Prepositions (6)
  { id: 't6', category: 'preposition', question: 'The meeting has been postponed ___ next Tuesday.', options: ['to', 'for', 'until', 'by'], answer: 'until', explanation: '"Postpone until" = hoãn cho đến. "Until" chỉ thời điểm kết thúc. "By" = hạn chót.' },
  { id: 't7', category: 'preposition', question: 'She is responsible ___ managing the entire sales team.', options: ['of', 'for', 'to', 'with'], answer: 'for', explanation: '"Be responsible for" = chịu trách nhiệm về. Cụm từ cố định.' },
  { id: 't8', category: 'preposition', question: 'The report should be submitted ___ Monday morning.', options: ['on', 'in', 'at', 'by'], answer: 'by', explanation: '"By Monday" = trước thứ Hai (hạn chót). "By" dùng cho deadline.' },
  { id: 't9', category: 'preposition', question: 'She excels ___ managing large teams under pressure.', options: ['in', 'at', 'on', 'for'], answer: 'at', explanation: '"Excel at something" = xuất sắc về điều gì. Cụm từ cố định.' },
  { id: 't10', category: 'preposition', question: 'The conference will be held ___ March 15th ___ 17th.', options: ['from / to', 'between / and', 'since / until', 'from / until'], answer: 'from / to', explanation: '"From ... to ..." chỉ khoảng thời gian từ đến. Phổ biến nhất trong lịch trình.' },
  { id: 't11', category: 'preposition', question: 'The new policy will take effect ___ the beginning of next quarter.', options: ['at', 'in', 'on', 'by'], answer: 'at', explanation: '"At the beginning of" = vào đầu kỳ. Cụm từ cố định với "at".' },
  // Conjunctions (3)
  { id: 't12', category: 'conjunction', question: '___ the heavy rain, the outdoor event was cancelled.', options: ['Although', 'Because of', 'Despite', 'However'], answer: 'Because of', explanation: '"Because of + cụm danh từ" = vì. "Although/Despite" diễn ý tương phản. "However" là trạng từ.' },
  { id: 't13', category: 'conjunction', question: 'The project was completed on time ___ the unexpected challenges.', options: ['because of', 'due to', 'despite', 'since'], answer: 'despite', explanation: '"Despite + danh từ" = mặc dù (tương phản). Câu muốn nói "mặc dù có thách thức".' },
  { id: 't14', category: 'conjunction', question: 'Please send the invoice ___ you have finished reviewing it.', options: ['before', 'until', 'after', 'during'], answer: 'after', explanation: '"After + S + V" = sau khi. Trình tự: xem xong → gửi → "after you have finished".' },
  // Pronouns / Determiners (4)
  { id: 't15', category: 'pronoun', question: 'The company will announce ___ new product line next month.', options: ['its', 'their', "it's", 'his'], answer: 'its', explanation: '"The company" là số ít, không phải người → đại từ sở hữu "its". "Their" dùng cho số nhiều.' },
  { id: 't16', category: 'pronoun', question: '___ of the candidates was fully qualified for the position.', options: ['Any', 'None', 'Both', 'Either'], answer: 'None', explanation: '"None of + the + danh từ" = không ai trong số. Phù hợp với "was" (số ít / nhấn mạnh không có ai).' },
  { id: 't17', category: 'determiner', question: '___ information provided in the attached report was inaccurate.', options: ['A', 'An', 'The', 'Some'], answer: 'The', explanation: '"The information" = thông tin cụ thể đã biết → dùng "the" (mạo từ xác định).' },
  { id: 't18', category: 'determiner', question: 'There are ___ alternatives available if the original plan fails.', options: ['few', 'a few', 'little', 'a little'], answer: 'a few', explanation: '"A few + danh từ đếm được số nhiều" = một vài. "Alternatives" đếm được. "Few" (không có "a") mang nghĩa tiêu cực.' },
  // Verb Tenses (5)
  { id: 't19', category: 'verb-tense', question: 'By the time the CEO arrives, the team ___ the presentation.', options: ['will finish', 'will have finished', 'finished', 'has finished'], answer: 'will have finished', explanation: '"By the time + hiện tại đơn" → Tương Lai Hoàn Thành: will have + V3.' },
  { id: 't20', category: 'verb-tense', question: 'She ___ for this company since she graduated in 2018.', options: ['works', 'worked', 'has worked', 'is working'], answer: 'has worked', explanation: '"Since 2018" → Hiện Tại Hoàn Thành: has + V3. Bắt đầu quá khứ, còn tiếp đến nay.' },
  { id: 't21', category: 'verb-tense', question: 'The annual report ___ to all shareholders last Monday.', options: ['sends', 'was sent', 'has sent', 'is sending'], answer: 'was sent', explanation: '"Last Monday" → Quá Khứ Đơn bị động: was/were + V3.' },
  { id: 't22', category: 'verb-tense', question: 'The new branch ___ by the end of this year.', options: ['opens', 'is opened', 'will be opened', 'has been opened'], answer: 'will be opened', explanation: '"By the end of this year" → tương lai. Bị động: will + be + V3.' },
  { id: 't23', category: 'verb-tense', question: 'All staff ___ the mandatory training before the product launch.', options: ['must complete', 'must be completed', 'must completing', 'must to complete'], answer: 'must complete', explanation: 'Modal verb "must" + V nguyên mẫu. "Staff" là người thực hiện → chủ động.' },
  // Passive (2)
  { id: 't24', category: 'passive', question: 'All applications must ___ before the deadline on Friday.', options: ['submit', 'be submitted', 'submitted', 'submitting'], answer: 'be submitted', explanation: 'Modal verb + be + V3 trong câu bị động: "must be submitted" = phải được nộp.' },
  { id: 't25', category: 'passive', question: 'The new headquarters ___ next spring to accommodate more staff.', options: ['builds', 'is built', 'will be built', 'has built'], answer: 'will be built', explanation: '"Next spring" → tương lai. Bị động tương lai: will + be + V3.' },
  // Conditionals (2)
  { id: 't26', category: 'conditional', question: 'If the budget ___ approved, we would start the project immediately.', options: ['is', 'were', 'has been', 'will be'], answer: 'were', explanation: 'Điều kiện loại 2 (giả định không có thật ở hiện tại): If + S + were → S + would + V.' },
  { id: 't27', category: 'conditional', question: 'If you ___ the early registration, you would have saved 30%.', options: ['chose', 'choose', 'had chosen', 'would choose'], answer: 'had chosen', explanation: 'Điều kiện loại 3 (quá khứ không có thật): If + S + had + V3 → S + would have + V3.' },
  // Vocabulary – Collocations (7)
  { id: 't28', category: 'vocabulary', question: 'The new regulation will ___ from the first day of next month.', options: ['take effect', 'take place', 'take over', 'take part'], answer: 'take effect', explanation: '"Take effect" = có hiệu lực (luật, chính sách). "Take place" = diễn ra sự kiện.' },
  { id: 't29', category: 'vocabulary', question: 'The client has requested a detailed ___ of all project expenses.', options: ['breakdown', 'breakthrough', 'breakup', 'breakout'], answer: 'breakdown', explanation: '"Breakdown of expenses" = bảng phân tích chi tiết chi phí. Colocation phổ biến.' },
  { id: 't30', category: 'vocabulary', question: 'All employees are ___ to attend the mandatory training session.', options: ['required', 'requested', 'reminded', 'referred'], answer: 'required', explanation: '"Required to do" = bắt buộc phải làm. Phù hợp với "mandatory" (bắt buộc).' },
  { id: 't31', category: 'vocabulary', question: 'The company plans to ___ a new branch in Singapore next year.', options: ['establish', 'accomplish', 'achieve', 'perform'], answer: 'establish', explanation: '"Establish a branch" = thành lập chi nhánh. Colocation chuẩn trong tiếng Anh thương mại.' },
  { id: 't32', category: 'vocabulary', question: 'Please ___ the enclosed form and return it via email by tomorrow.', options: ['complete', 'conduct', 'create', 'compose'], answer: 'complete', explanation: '"Complete a form" = điền vào mẫu đơn. Colocation cố định trong TOEIC.' },
  { id: 't33', category: 'vocabulary', question: 'All suppliers are expected to ___ with the new quality standards.', options: ['comply', 'cooperate', 'contribute', 'confirm'], answer: 'comply', explanation: '"Comply with regulations/standards" = tuân thủ quy định. Cụm từ cố định quan trọng.' },
  { id: 't34', category: 'vocabulary', question: 'The marketing team will ___ a survey to collect customer feedback.', options: ['conduct', 'make', 'manage', 'arrange'], answer: 'conduct', explanation: '"Conduct a survey" = tiến hành khảo sát. Colocation trang trọng, phổ biến trong TOEIC.' },
];

const TOEIC_CATEGORIES = {
  'word-form':   'Dạng Từ',
  'preposition': 'Giới Từ',
  'conjunction': 'Liên Từ',
  'pronoun':     'Đại Từ',
  'determiner':  'Mạo Từ / Lượng Từ',
  'verb-tense':  'Thì / Động Từ',
  'passive':     'Câu Bị Động',
  'conditional': 'Câu Điều Kiện',
  'vocabulary':  'Từ Vựng',
};

// =====================================================================
// Reading Comprehension – 3 đoạn văn (5 câu/đoạn)
// =====================================================================
const READING_PASSAGES = [
  {
    id: 'r1',
    title: 'Remote Work Policy Update',
    tag: 'Công Văn Nội Bộ',
    tagColor: 'bg-blue-100 text-blue-700',
    text: `MEMORANDUM

To: All Employees
From: Human Resources Department
Subject: Updated Hybrid Work Policy – Effective December 1

The company will implement a new hybrid work policy starting December 1. All employees will be required to work from the office a minimum of three days per week. The remaining two days may be worked remotely.

Employees wishing to work remotely must notify their direct supervisor at least 48 hours in advance. Approval is subject to business needs and team schedules.

Employees found not complying without prior approval will receive a formal warning. Repeated violations may result in the permanent loss of remote work privileges.

For questions, contact hr@company.com or visit the HR office on the 3rd floor.`,
    questions: [
      { id: 'r1q1', q: 'What is the main purpose of this memo?', options: ['To announce new employee benefits', 'To inform staff about a new hybrid work policy', 'To invite employees to a team meeting', 'To introduce a new HR manager'], answer: 'To inform staff about a new hybrid work policy', explanation: 'Subject của memo: "Updated Hybrid Work Policy" — thông báo chính sách làm việc kết hợp mới.' },
      { id: 'r1q2', q: 'How many days per week must employees work from the office?', options: ['One day', 'Two days', 'Three days', 'Five days'], answer: 'Three days', explanation: '"required to work from the office a minimum of three days per week".' },
      { id: 'r1q3', q: 'How much advance notice is required to work remotely?', options: ['24 hours', '36 hours', '48 hours', '72 hours'], answer: '48 hours', explanation: '"must notify their direct supervisor at least 48 hours in advance".' },
      { id: 'r1q4', q: 'What could happen if an employee repeatedly violates the policy?', options: ['They will be dismissed', 'They will lose remote work privileges permanently', 'They will be transferred to another department', 'They will receive a pay reduction'], answer: 'They will lose remote work privileges permanently', explanation: '"Repeated violations may result in the permanent loss of remote work privileges".' },
      { id: 'r1q5', q: 'Where can employees go for in-person HR assistance?', options: ['The 1st floor', 'The 2nd floor', 'The 3rd floor', 'The HR website'], answer: 'The 3rd floor', explanation: '"visit the HR office on the 3rd floor".' },
    ],
  },
  {
    id: 'r2',
    title: 'TechMart Year-End Sale',
    tag: 'Quảng Cáo',
    tagColor: 'bg-orange-100 text-orange-700',
    text: `TECHMART ELECTRONICS — YEAR-END SALE!

Don't miss our biggest sale of the year! From December 20 to December 31, enjoy incredible discounts on all products.

SPECIAL OFFERS:
• Laptops & Computers: Up to 30% off
• Smartphones: Buy one, get one 20% off
• Accessories: Buy 2, get the 3rd FREE
• Free shipping on all orders over $50

EXCLUSIVE MEMBER BENEFITS:
Gold members receive an additional 5% discount on top of all sale prices. Not yet a member? Sign up today for instant access to member-only deals.

In-store locations are open daily from 9 AM to 10 PM throughout the sale period.

Offer valid while supplies last. Some exclusions may apply.`,
    questions: [
      { id: 'r2q1', q: 'How long does the TechMart sale last?', options: ['9 days', '10 days', '11 days', '12 days'], answer: '12 days', explanation: 'December 20 to December 31 = 12 ngày (31 − 20 + 1 = 12).' },
      { id: 'r2q2', q: 'What discount applies to laptops?', options: ['10% off', '20% off', 'Up to 30% off', '5% extra off'], answer: 'Up to 30% off', explanation: '"Laptops & Computers: Up to 30% off".' },
      { id: 'r2q3', q: 'What benefit do Gold members receive?', options: ['Free shipping always', 'An extra 5% discount', 'A free accessory', 'Double reward points'], answer: 'An extra 5% discount', explanation: '"Gold members receive an additional 5% discount on top of all sale prices".' },
      { id: 'r2q4', q: 'When does free shipping apply?', options: ['On all orders', 'On orders over $50', 'Only for members', 'On laptop purchases only'], answer: 'On orders over $50', explanation: '"Free shipping on all orders over $50".' },
      { id: 'r2q5', q: 'What time do stores close during the sale?', options: ['8 PM', '9 PM', '10 PM', '11 PM'], answer: '10 PM', explanation: '"open daily from 9 AM to 10 PM throughout the sale period".' },
    ],
  },
  {
    id: 'r3',
    title: 'Greenbridge Zero-Plastic Campaign',
    tag: 'Bài Báo',
    tagColor: 'bg-green-100 text-green-700',
    text: `GREENBRIDGE CITY LAUNCHES PLASTIC REDUCTION CAMPAIGN

Greenbridge City announced last Monday the launch of its ambitious "Zero Plastic by 2030" campaign, aiming to dramatically reduce single-use plastic waste across the city.

Under the new initiative, all restaurants, cafes, and retail shops must stop providing single-use plastic bags and straws by July 1, 2025. Businesses that fail to comply will face fines ranging from $200 to $1,000 depending on the severity and frequency of violations.

Mayor Johnson emphasized the campaign is not purely regulatory. "We will invest $2 million in public education programs and provide subsidies to help local businesses transition to eco-friendly alternatives," she said at the press conference.

Citizens are encouraged to join the city's "Bring Your Own Bag" program, which offers a 10% discount at participating stores for customers who use reusable bags.

Environmental groups have praised the initiative, though some business owners have raised concerns about the additional costs of switching to biodegradable packaging.`,
    questions: [
      { id: 'r3q1', q: 'What is the main goal of the campaign?', options: ['To increase city tourism', 'To reduce single-use plastic waste', 'To promote local businesses', 'To build new recycling centers'], answer: 'To reduce single-use plastic waste', explanation: '"aiming to dramatically reduce single-use plastic waste across the city".' },
      { id: 'r3q2', q: 'What must businesses stop providing by July 1, 2025?', options: ['Paper bags and cardboard boxes', 'Single-use plastic bags and straws', 'All packaging materials', 'Plastic bottles'], answer: 'Single-use plastic bags and straws', explanation: '"must stop providing single-use plastic bags and straws by July 1, 2025".' },
      { id: 'r3q3', q: 'How much will the city invest in education programs?', options: ['$200,000', '$1 million', '$2 million', '$10 million'], answer: '$2 million', explanation: '"We will invest $2 million in public education programs".' },
      { id: 'r3q4', q: 'What do customers receive for using reusable bags?', options: ['A free bag', 'A 10% discount', 'Loyalty points', 'A tax refund'], answer: 'A 10% discount', explanation: '"offers a 10% discount at participating stores for customers who use reusable bags".' },
      { id: 'r3q5', q: 'Who expressed concerns about the campaign?', options: ['Environmental groups', 'The mayor', 'Some business owners', 'City residents'], answer: 'Some business owners', explanation: '"some business owners have raised concerns about the additional costs of switching to biodegradable packaging".' },
    ],
  },
];

// =====================================================================
// Error Recognition – Tìm Lỗi Sai (10 câu)
// =====================================================================
const ERROR_QUESTIONS = [
  {
    id: 'e1',
    sentence: 'She has worked in this company since five years.',
    parts: [
      { label: 'A', text: 'She has worked' },
      { label: 'B', text: 'in this company' },
      { label: 'C', text: 'since' },
      { label: 'D', text: 'five years' },
    ],
    answer: 'C',
    correction: '"since" → "for"',
    explanation: '"For + khoảng thời gian" (for five years). "Since + mốc thời gian cụ thể" (since 2019). Câu đúng: "...for five years."',
  },
  {
    id: 'e2',
    sentence: 'This is more better than the previous version.',
    parts: [
      { label: 'A', text: 'This is' },
      { label: 'B', text: 'more better' },
      { label: 'C', text: 'than' },
      { label: 'D', text: 'the previous version' },
    ],
    answer: 'B',
    correction: '"more better" → "better"',
    explanation: '"Better" đã là so sánh hơn của "good". Không dùng "more" trước so sánh hơn một âm tiết. Câu đúng: "This is better than..."',
  },
  {
    id: 'e3',
    sentence: 'I am agree with your decision about the project.',
    parts: [
      { label: 'A', text: 'I am agree' },
      { label: 'B', text: 'with your decision' },
      { label: 'C', text: 'about' },
      { label: 'D', text: 'the project' },
    ],
    answer: 'A',
    correction: '"am agree" → "agree"',
    explanation: '"Agree" là stative verb (động từ trạng thái), không dùng với "be". Câu đúng: "I agree with your decision."',
  },
  {
    id: 'e4',
    sentence: 'Despite of the rain, we continued the outdoor meeting.',
    parts: [
      { label: 'A', text: 'Despite of' },
      { label: 'B', text: 'the rain' },
      { label: 'C', text: 'we continued' },
      { label: 'D', text: 'the outdoor meeting' },
    ],
    answer: 'A',
    correction: '"Despite of" → "Despite"',
    explanation: '"Despite" không đi kèm "of". Cấu trúc đúng: "Despite + danh từ/V-ing". Nhầm với "in spite of" (có "of").',
  },
  {
    id: 'e5',
    sentence: 'The informations in this report are not up to date.',
    parts: [
      { label: 'A', text: 'The informations' },
      { label: 'B', text: 'in this report' },
      { label: 'C', text: 'are not' },
      { label: 'D', text: 'up to date' },
    ],
    answer: 'A',
    correction: '"informations" → "information"',
    explanation: '"Information" là danh từ không đếm được (uncountable noun), không có dạng số nhiều. Câu đúng: "The information in this report is not..."',
  },
  {
    id: 'e6',
    sentence: 'I have visited Paris last summer with my family.',
    parts: [
      { label: 'A', text: 'I have visited' },
      { label: 'B', text: 'Paris' },
      { label: 'C', text: 'last summer' },
      { label: 'D', text: 'with my family' },
    ],
    answer: 'A',
    correction: '"have visited" → "visited"',
    explanation: '"Last summer" là mốc thời gian xác định trong quá khứ → dùng Quá Khứ Đơn, không dùng Hiện Tại Hoàn Thành. Câu đúng: "I visited Paris last summer."',
  },
  {
    id: 'e7',
    sentence: 'She works hardly to support her family every day.',
    parts: [
      { label: 'A', text: 'She works' },
      { label: 'B', text: 'hardly' },
      { label: 'C', text: 'to support her family' },
      { label: 'D', text: 'every day' },
    ],
    answer: 'B',
    correction: '"hardly" → "hard"',
    explanation: '"Hard" (trạng từ) = chăm chỉ. "Hardly" = hầu như không (nghĩa hoàn toàn khác). Câu đúng: "She works hard to support her family."',
  },
  {
    id: 'e8',
    sentence: 'Every students must bring their own laptop to the class.',
    parts: [
      { label: 'A', text: 'Every students' },
      { label: 'B', text: 'must bring' },
      { label: 'C', text: 'their own laptop' },
      { label: 'D', text: 'to the class' },
    ],
    answer: 'A',
    correction: '"Every students" → "Every student"',
    explanation: '"Every" luôn đi với danh từ số ÍT: "Every student". Câu đúng: "Every student must bring their own laptop."',
  },
  {
    id: 'e9',
    sentence: 'He suggested to postpone the meeting until Friday.',
    parts: [
      { label: 'A', text: 'He suggested' },
      { label: 'B', text: 'to postpone' },
      { label: 'C', text: 'the meeting' },
      { label: 'D', text: 'until Friday' },
    ],
    answer: 'B',
    correction: '"to postpone" → "postponing"',
    explanation: '"Suggest" + V-ing (gerund), không dùng "to + V". Câu đúng: "He suggested postponing the meeting until Friday."',
  },
  {
    id: 'e10',
    sentence: 'Neither the manager nor the employees was informed about the change.',
    parts: [
      { label: 'A', text: 'Neither the manager' },
      { label: 'B', text: 'nor the employees' },
      { label: 'C', text: 'was informed' },
      { label: 'D', text: 'about the change' },
    ],
    answer: 'C',
    correction: '"was informed" → "were informed"',
    explanation: 'Với "Neither...nor", động từ chia theo chủ ngữ gần nhất: "the employees" (số nhiều) → "were informed". Câu đúng: "...were informed about the change."',
  },
];

// =====================================================================
// Generic Quiz Screen – dùng cho TOEIC Part 5
// =====================================================================
const GenericTestScreen = ({ questions, title, tagMap, onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const q = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const correct = opt === q.answer;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { question: q.question, selected: opt, answer: q.answer, correct, explanation: q.explanation }]);
  };

  const handleNext = () => {
    if (isLast) setShowResult(true);
    else { setCurrentIdx(i => i + 1); setSelected(null); }
  };

  if (showResult) {
    const pct = Math.round(score / questions.length * 100);
    const grade = pct >= 80 ? { label: 'Xuất sắc!', color: 'text-green-600', bg: 'bg-green-50', emoji: '🏆' }
      : pct >= 60 ? { label: 'Khá tốt!', color: 'text-blue-600', bg: 'bg-blue-50', emoji: '👍' }
      : { label: 'Cần ôn thêm!', color: 'text-orange-600', bg: 'bg-orange-50', emoji: '📚' };
    return (
      <div className="min-h-screen bg-gray-50 pb-10">
        <NavBar title="Kết Quả" onBack={onBack} />
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className={`${grade.bg} rounded-2xl p-6 text-center mb-6`}>
            <div className="text-5xl mb-3">{grade.emoji}</div>
            <div className={`text-3xl font-bold ${grade.color}`}>{score}/{questions.length}</div>
            <div className={`text-lg font-semibold ${grade.color} mt-1`}>{grade.label}</div>
            <div className="text-gray-500 text-sm mt-1">Tỉ lệ đúng: {pct}%</div>
          </div>
          <h3 className="text-sm font-bold text-gray-600 mb-3">Chi tiết từng câu:</h3>
          <div className="grid gap-3 mb-6">
            {answers.map((a, i) => (
              <div key={i} className={`p-4 rounded-xl border ${a.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-base">{a.correct ? '✅' : '❌'}</span>
                  <p className="text-sm font-medium text-gray-700">{i + 1}. {a.question}</p>
                </div>
                {!a.correct && (
                  <div className="ml-6">
                    <p className="text-xs text-red-600">Bạn chọn: <strong>{a.selected}</strong></p>
                    <p className="text-xs text-green-700">Đáp án đúng: <strong>{a.answer}</strong></p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2 ml-6 leading-relaxed">{a.explanation}</p>
              </div>
            ))}
          </div>
          <button onClick={onBack} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl">Về Trang Kiểm Tra</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title={`${title} – Câu ${currentIdx + 1}/${questions.length}`} onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
            {tagMap ? (tagMap[q.category] || q.category) : q.category}
          </span>
          <span className="text-xs text-gray-400">Điểm: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: `${(currentIdx / questions.length) * 100}%` }} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <p className="text-base font-semibold text-gray-800 leading-relaxed">{q.question}</p>
        </div>
        <div className="grid gap-3 mb-6">
          {q.options.map(opt => {
            let cls = 'bg-white border-gray-200 text-gray-700';
            if (selected !== null) {
              if (opt === q.answer) cls = 'bg-green-50 border-green-400 text-green-700';
              else if (opt === selected) cls = 'bg-red-50 border-red-400 text-red-700';
            }
            return (
              <button key={opt} onClick={() => handleSelect(opt)} disabled={selected !== null}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm transition-all ${cls} disabled:cursor-not-allowed`}>
                {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className={`p-4 rounded-xl mb-5 ${selected === q.answer ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
            <p className="text-sm font-semibold mb-1">{selected === q.answer ? '✅ Chính xác!' : `❌ Đáp án đúng: ${q.answer}`}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{q.explanation}</p>
          </div>
        )}
        {selected !== null && (
          <button onClick={handleNext} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl">
            {isLast ? 'Xem Kết Quả' : 'Câu Tiếp Theo →'}
          </button>
        )}
      </div>
    </div>
  );
};

// =====================================================================
// TOEIC Pick Screen
// =====================================================================
const ToeicPickScreen = ({ onBack, onStart }) => (
  <div className="min-h-screen bg-gray-50 pb-10">
    <NavBar title="Luyện TOEIC Part 5" onBack={onBack} />
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button
        onClick={() => onStart(TOEIC_PART5)}
        className="w-full mb-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-2xl p-5 text-left shadow-sm"
      >
        <div className="font-bold text-lg">Tổng Hợp – Tất Cả Dạng Bài</div>
        <div className="text-sm opacity-90 mt-1">Ngẫu nhiên 15 câu từ toàn bộ {TOEIC_PART5.length} câu</div>
      </button>
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Hoặc chọn dạng bài cụ thể:</h3>
      <div className="grid gap-2">
        {Object.entries(TOEIC_CATEGORIES).map(([id, name]) => {
          const pool = TOEIC_PART5.filter(q => q.category === id);
          if (pool.length === 0) return null;
          return (
            <button key={id} onClick={() => onStart(pool)}
              className="w-full text-left px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-sm font-medium text-gray-700">
              {name}
              <span className="text-xs text-gray-400 ml-2">({pool.length} câu)</span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

// =====================================================================
// Reading Test Screen – hiển thị một đoạn văn + câu hỏi
// =====================================================================
const ReadingTestScreen = ({ passage, onBack }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassage, setShowPassage] = useState(true);

  const handleSelect = (qId, opt) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const allAnswered = passage.questions.every(q => selectedAnswers[q.id]);
  const score = submitted ? passage.questions.filter(q => selectedAnswers[q.id] === q.answer).length : 0;

  if (submitted) {
    const pct = Math.round(score / passage.questions.length * 100);
    const grade = pct >= 80 ? { label: 'Xuất sắc!', color: 'text-green-600', bg: 'bg-green-50', emoji: '🏆' }
      : pct >= 60 ? { label: 'Khá tốt!', color: 'text-blue-600', bg: 'bg-blue-50', emoji: '👍' }
      : { label: 'Cần đọc lại!', color: 'text-orange-600', bg: 'bg-orange-50', emoji: '📚' };
    return (
      <div className="min-h-screen bg-gray-50 pb-10">
        <NavBar title="Kết Quả Đọc Hiểu" onBack={onBack} />
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className={`${grade.bg} rounded-2xl p-6 text-center mb-6`}>
            <div className="text-5xl mb-3">{grade.emoji}</div>
            <div className={`text-3xl font-bold ${grade.color}`}>{score}/{passage.questions.length}</div>
            <div className={`text-lg font-semibold ${grade.color} mt-1`}>{grade.label}</div>
            <div className="text-gray-500 text-sm mt-1">Tỉ lệ đúng: {pct}%</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Đoạn văn</p>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{passage.text}</p>
          </div>
          <div className="grid gap-4 mb-6">
            {passage.questions.map((q, i) => {
              const correct = selectedAnswers[q.id] === q.answer;
              return (
                <div key={q.id} className={`p-4 rounded-xl border ${correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span>{correct ? '✅' : '❌'}</span>
                    <p className="text-sm font-medium text-gray-700">{i + 1}. {q.q}</p>
                  </div>
                  {!correct && (
                    <div className="ml-6 mb-1">
                      <p className="text-xs text-red-600">Bạn chọn: <strong>{selectedAnswers[q.id]}</strong></p>
                      <p className="text-xs text-green-700">Đáp án đúng: <strong>{q.answer}</strong></p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1 ml-6 leading-relaxed">{q.explanation}</p>
                </div>
              );
            })}
          </div>
          <button onClick={onBack} className="w-full bg-cyan-600 text-white font-bold py-3.5 rounded-xl">Về Trang Đọc Hiểu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title={passage.title} onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
          <button onClick={() => setShowPassage(v => !v)}
            className="w-full flex justify-between items-center px-5 py-3.5 text-left">
            <span className="text-sm font-bold text-gray-700">Đọc đoạn văn</span>
            <span className="text-gray-400 text-xs">{showPassage ? '▲ Ẩn' : '▼ Hiện'}</span>
          </button>
          {showPassage && (
            <div className="px-5 pb-5 border-t border-gray-50">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mt-3">{passage.text}</p>
            </div>
          )}
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Câu hỏi ({passage.questions.length} câu)</p>
        <div className="grid gap-5 mb-6">
          {passage.questions.map((q, i) => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-semibold text-gray-800 mb-3">{i + 1}. {q.q}</p>
              <div className="grid gap-2">
                {q.options.map(opt => {
                  const isSel = selectedAnswers[q.id] === opt;
                  return (
                    <button key={opt} onClick={() => handleSelect(q.id, opt)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all
                        ${isSel ? 'bg-cyan-50 border-cyan-400 text-cyan-700' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setSubmitted(true)} disabled={!allAnswered}
          className="w-full bg-cyan-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">
          Nộp Bài ({Object.keys(selectedAnswers).length}/{passage.questions.length} câu đã trả lời)
        </button>
      </div>
    </div>
  );
};

// =====================================================================
// Reading Pick Screen
// =====================================================================
const ReadingPickScreen = ({ onBack, onSelect, passages }) => {
  const list = passages || READING_PASSAGES;
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title="Đọc Hiểu" onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-500 mb-4">Chọn đoạn văn để làm bài:</p>
        <div className="grid gap-3">
          {list.map(p => (
            <button key={p.id} onClick={() => onSelect(p)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.tagColor}`}>{p.tag}</span>
              <div className="font-bold text-gray-800 mt-2">{p.title}</div>
              <div className="text-xs text-gray-400 mt-1">{p.questions.length} câu hỏi</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// Error Recognition Screen
// =====================================================================
const ErrorRecognitionScreen = ({ onBack }) => {
  const [questions] = useState(() => shuffle(ERROR_QUESTIONS));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const q = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  const handleSelect = (label) => {
    if (selected !== null) return;
    setSelected(label);
    const correct = label === q.answer;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { ...q, selected: label, correct }]);
  };

  const handleNext = () => {
    if (isLast) setShowResult(true);
    else { setCurrentIdx(i => i + 1); setSelected(null); }
  };

  if (showResult) {
    const pct = Math.round(score / questions.length * 100);
    const grade = pct >= 80 ? { label: 'Xuất sắc!', color: 'text-green-600', bg: 'bg-green-50', emoji: '🏆' }
      : pct >= 60 ? { label: 'Khá tốt!', color: 'text-blue-600', bg: 'bg-blue-50', emoji: '👍' }
      : { label: 'Cần ôn thêm!', color: 'text-orange-600', bg: 'bg-orange-50', emoji: '📚' };
    return (
      <div className="min-h-screen bg-gray-50 pb-10">
        <NavBar title="Kết Quả" onBack={onBack} />
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className={`${grade.bg} rounded-2xl p-6 text-center mb-6`}>
            <div className="text-5xl mb-3">{grade.emoji}</div>
            <div className={`text-3xl font-bold ${grade.color}`}>{score}/{questions.length}</div>
            <div className={`text-lg font-semibold ${grade.color} mt-1`}>{grade.label}</div>
            <div className="text-gray-500 text-sm mt-1">Tỉ lệ đúng: {pct}%</div>
          </div>
          <div className="grid gap-4 mb-6">
            {answers.map((a, i) => (
              <div key={i} className={`p-4 rounded-xl border ${a.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-2 mb-2">
                  <span>{a.correct ? '✅' : '❌'}</span>
                  <p className="text-sm font-medium text-gray-700 italic">"{a.sentence}"</p>
                </div>
                <div className="ml-6">
                  {!a.correct && <p className="text-xs text-red-600 mb-0.5">Bạn chọn: <strong>{a.selected}</strong> · Đúng: <strong>{a.answer}</strong></p>}
                  <p className="text-xs text-purple-700 font-semibold">{a.correction}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{a.explanation}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={onBack} className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl">Về Trang Kiểm Tra</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title={`Tìm Lỗi Sai – Câu ${currentIdx + 1}/${questions.length}`} onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${(currentIdx / questions.length) * 100}%` }} />
        </div>
        <p className="text-xs text-gray-400 mb-3 text-center">Chọn phần gạch chân có lỗi sai (A, B, C hoặc D)</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <p className="text-base font-semibold text-gray-800 leading-relaxed italic mb-4">"{q.sentence}"</p>
          <div className="grid grid-cols-2 gap-3">
            {q.parts.map(p => {
              let cls = 'bg-gray-50 border-gray-200 text-gray-700';
              if (selected !== null) {
                if (p.label === q.answer) cls = 'bg-green-50 border-green-400 text-green-700';
                else if (p.label === selected && selected !== q.answer) cls = 'bg-red-50 border-red-400 text-red-700';
              }
              return (
                <button key={p.label} onClick={() => handleSelect(p.label)} disabled={selected !== null}
                  className={`text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${cls} disabled:cursor-not-allowed`}>
                  <span className="font-bold text-xs mr-2 opacity-60">{p.label}</span>
                  <span className="underline">{p.text}</span>
                </button>
              );
            })}
          </div>
        </div>
        {selected !== null && (
          <div className={`p-4 rounded-xl mb-5 ${selected === q.answer ? 'bg-green-50 border border-green-200' : 'bg-purple-50 border border-purple-200'}`}>
            <p className="text-sm font-semibold mb-1">{selected === q.answer ? '✅ Chính xác!' : `❌ Lỗi sai ở phần: ${q.answer}`}</p>
            <p className="text-xs font-bold text-purple-700 mb-1">{q.correction}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{q.explanation}</p>
          </div>
        )}
        {selected !== null && (
          <button onClick={handleNext} className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl">
            {isLast ? 'Xem Kết Quả' : 'Câu Tiếp Theo →'}
          </button>
        )}
      </div>
    </div>
  );
};

// =====================================================================
// VSTEP – Ngữ Pháp & Từ Vựng (15 câu)
// =====================================================================
const VSTEP_QUESTIONS = [
  { id: 'v1',  category: 'grammar',    question: 'The students are looking forward ___ the summer vacation.', options: ['to have', 'to having', 'having', 'have'], answer: 'to having', explanation: '"Look forward to + V-ing" là cụm cố định. "To" ở đây là giới từ, không phải to-infinitive.' },
  { id: 'v2',  category: 'grammar',    question: 'It is essential that every employee ___ the new safety manual.', options: ['reads', 'read', 'reading', 'will read'], answer: 'read', explanation: '"It is essential that + S + V (bare infinitive)" – subjunctive mood. Không chia theo chủ ngữ.' },
  { id: 'v3',  category: 'grammar',    question: 'Hardly ___ sat down when the phone rang.', options: ['I had', 'had I', 'I have', 'have I'], answer: 'had I', explanation: '"Hardly had + S + V3 when..." – đảo ngữ với trạng từ phủ định đứng đầu câu.' },
  { id: 'v4',  category: 'grammar',    question: 'The report, together with all supporting documents, ___ to the committee yesterday.', options: ['was submitted', 'were submitted', 'has submitted', 'have submitted'], answer: 'was submitted', explanation: '"Together with" không thay đổi số của chủ ngữ chính. "The report" (số ít) → "was submitted".' },
  { id: 'v5',  category: 'grammar',    question: 'Not until the meeting ended ___ the full extent of the problem.', options: ['they understood', 'did they understand', 'they did understand', 'understood they'], answer: 'did they understand', explanation: '"Not until..." đứng đầu câu → đảo ngữ: did + S + V.' },
  { id: 'v6',  category: 'grammar',    question: 'She would rather ___ at home than attend the conference.', options: ['staying', 'stayed', 'stay', 'to stay'], answer: 'stay', explanation: '"Would rather + V nguyên mẫu (bare infinitive)". Không dùng "to" sau "would rather".' },
  { id: 'v7',  category: 'grammar',    question: 'By 2030, renewable energy sources ___ for more than half of global electricity.', options: ['will account', 'will have accounted', 'account', 'accounted'], answer: 'will have accounted', explanation: '"By 2030" (mốc tương lai) → Tương Lai Hoàn Thành: will have + V3.' },
  { id: 'v8',  category: 'grammar',    question: 'The more exposure to English you get, ___ you will become.', options: ['the more fluent', 'more fluent', 'fluenter', 'the fluenter'], answer: 'the more fluent', explanation: 'Cấu trúc so sánh kép: "The + so sánh hơn, the + so sánh hơn" = càng... càng...' },
  { id: 'v9',  category: 'grammar',    question: '___ as the situation seemed, the team remained calm.', options: ['Danger', 'Dangerous', 'Dangerously', 'More dangerous'], answer: 'Dangerous', explanation: '"Adjective + as + S + V" = mặc dù... Đảo ngữ nhượng bộ: Dangerous as it seemed = mặc dù có vẻ nguy hiểm.' },
  { id: 'v10', category: 'grammar',    question: 'It was not ___ she explained the full context that we understood the issue.', options: ['since', 'until', 'when', 'after'], answer: 'until', explanation: '"It was not until... that..." = Chỉ đến khi... thì mới... Cấu trúc nhấn mạnh thời điểm.' },
  { id: 'v11', category: 'vocabulary', question: 'The government has taken ___ measures to combat rising inflation.', options: ['drastic', 'dramatic', 'direct', 'deliberate'], answer: 'drastic', explanation: '"Drastic measures" = biện pháp quyết liệt, mạnh mẽ. Colocation phổ biến trong tiếng Anh học thuật.' },
  { id: 'v12', category: 'vocabulary', question: 'Scientists have gathered ___ evidence that climate change is accelerating.', options: ['conclusive', 'closed', 'complete', 'compact'], answer: 'conclusive', explanation: '"Conclusive evidence" = bằng chứng rõ ràng, thuyết phục. Colocation học thuật quan trọng.' },
  { id: 'v13', category: 'vocabulary', question: 'The new law will ___ the use of single-use plastics by 2025.', options: ['prohibit', 'protect', 'produce', 'proceed'], answer: 'prohibit', explanation: '"Prohibit the use of..." = cấm việc sử dụng. Từ học thuật phổ biến trong VSTEP.' },
  { id: 'v14', category: 'vocabulary', question: 'The findings of the new study ___ previous research on the topic.', options: ['corroborate', 'contradict', 'consume', 'consider'], answer: 'corroborate', explanation: '"Corroborate" = xác nhận, củng cố. Phân biệt với "contradict" = mâu thuẫn. Từ học thuật VSTEP/IELTS.' },
  { id: 'v15', category: 'vocabulary', question: 'She is used to ___ presentations in front of large audiences.', options: ['give', 'giving', 'gave', 'have given'], answer: 'giving', explanation: '"Be used to + V-ing" = quen với việc làm gì. Phân biệt với "used to + V" (đã từng làm gì).' },
];

const VSTEP_CATEGORIES = { 'grammar': 'Ngữ Pháp', 'vocabulary': 'Từ Vựng' };

// =====================================================================
// IELTS Academic Reading (2 đoạn văn, 5 câu/đoạn)
// =====================================================================
const IELTS_PASSAGES = [
  {
    id: 'iel1',
    title: 'The Psychology of Decision-Making',
    tag: 'Tâm Lý Học',
    tagColor: 'bg-emerald-100 text-emerald-700',
    text: `THE PSYCHOLOGY OF DECISION-MAKING

Behavioural economists have long been fascinated by the seemingly irrational choices that humans make on a daily basis. Unlike the classical economic model, which assumes that individuals always act in their own best interest by carefully weighing all available information, research in cognitive psychology has revealed that human decision-making is often shaped by cognitive biases — systematic patterns of thought that deviate from rational judgment.

One of the most well-documented phenomena is the anchoring effect, first identified by Amos Tversky and Daniel Kahneman in their landmark 1974 study. When presented with a numerical reference point, individuals tend to adjust their estimates insufficiently from that initial value. In one classic demonstration, participants who were first shown a high random number consistently gave higher estimates for unrelated quantities than those shown a low number.

A related concept is the availability heuristic, which refers to the tendency to judge the probability of an event based on how easily examples come to mind. Following extensive media coverage of a plane crash, for instance, people frequently overestimate the risk of air travel, despite statistical evidence showing that flying is considerably safer than driving.

Perhaps the most counterintuitive finding in decision research is the paradox of choice. Studies by psychologist Barry Schwartz suggest that an abundance of options can actually impair decision-making and reduce overall satisfaction. When consumers face too many alternatives, they frequently experience decision fatigue and are more likely to regret their final choice — a phenomenon Schwartz terms "the tyranny of choice".

These insights have significant practical implications. Policymakers increasingly use "nudge" strategies — subtle modifications to the environment in which choices are made — to encourage socially beneficial behaviours such as organ donation, retirement savings, and healthier eating, without restricting individual freedom.`,
    questions: [
      { id: 'iel1q1', q: 'How does the classical economic model differ from behavioural economics?', options: ['Classical economics studies irrational behaviour', 'Classical economics assumes people always make rational decisions', 'Behavioural economics ignores cognitive biases', 'Behavioural economics supports the rational actor model'], answer: 'Classical economics assumes people always make rational decisions', explanation: '"the classical economic model, which assumes that individuals always act in their own best interest by carefully weighing all available information".' },
      { id: 'iel1q2', q: 'What did Tversky and Kahneman\'s anchoring experiment demonstrate?', options: ['People adjust well from initial reference points', 'Random numbers have no effect on unrelated estimates', 'Initial reference numbers influence subsequent estimates', 'High anchors reduce final estimates significantly'], answer: 'Initial reference numbers influence subsequent estimates', explanation: '"participants who were first shown a high random number consistently gave higher estimates" → initial number influences estimates.' },
      { id: 'iel1q3', q: 'What is the availability heuristic?', options: ['Judging risk based purely on statistical data', 'Estimating probability based on how easily examples are recalled', 'Making decisions based on the most convenient options', 'Overweighting the most recent information in decisions'], answer: 'Estimating probability based on how easily examples are recalled', explanation: '"the tendency to judge the probability of an event based on how easily examples come to mind".' },
      { id: 'iel1q4', q: 'According to Barry Schwartz, what happens when consumers face too many choices?', options: ['More options always lead to better decisions', 'More options increase satisfaction and confidence', 'Too many options can impair decisions and lower satisfaction', 'People prefer more options in all situations'], answer: 'Too many options can impair decisions and lower satisfaction', explanation: '"an abundance of options can actually impair decision-making and reduce overall satisfaction".' },
      { id: 'iel1q5', q: 'What is the primary purpose of "nudge" strategies according to the passage?', options: ['To restrict freedom of individual choice', 'To increase government control over consumption', 'To encourage beneficial behaviours without limiting freedom', 'To replace traditional policymaking with technology'], answer: 'To encourage beneficial behaviours without limiting freedom', explanation: '"to encourage socially beneficial behaviours...without restricting individual freedom".' },
    ],
  },
  {
    id: 'iel2',
    title: 'Urban Green Spaces and Public Health',
    tag: 'Xã Hội Học',
    tagColor: 'bg-teal-100 text-teal-700',
    text: `URBAN GREEN SPACES AND PUBLIC HEALTH

The rapid pace of urbanisation across the globe has raised significant concerns about public health. As cities expand and population densities increase, residents spend more time in built environments and have less access to nature. Growing evidence, however, suggests that the presence of urban green spaces — parks, gardens, tree-lined streets, and other vegetated areas — can have profound and measurable effects on both physical and mental well-being.

Epidemiological studies have consistently linked proximity to green spaces with lower rates of cardiovascular disease, obesity, and type 2 diabetes. One frequently cited mechanism is the encouragement of physical activity: parks and recreational areas provide accessible venues for walking, cycling, and sports, thereby reducing sedentary behaviour. Research published in The Lancet found that individuals living within 300 metres of green spaces were significantly more likely to meet recommended levels of weekly physical activity than those without such access.

The psychological benefits are equally compelling. Exposure to natural environments has been shown to reduce cortisol levels — the primary stress hormone — and to improve mood, attention, and cognitive performance. The concept of "restorative environments", developed by environmental psychologists Rachel and Stephen Kaplan, holds that natural settings allow the mind to recover from directed attention fatigue, the mental exhaustion caused by sustained focus on demanding tasks.

Despite this compelling evidence, green spaces are not equitably distributed across urban populations. Lower-income neighbourhoods consistently report less access to quality parks and recreational facilities, exacerbating existing health inequalities. Urban planners and policymakers are therefore increasingly called upon to incorporate green infrastructure into city development strategies, ensuring that the health benefits of nature are available to all residents, regardless of socioeconomic status.`,
    questions: [
      { id: 'iel2q1', q: 'What primary concern does rapid urbanisation raise, according to the passage?', options: ['Increased traffic congestion in cities', 'Greater exposure to air pollution', 'Reduced access to nature and built-environment dominance', 'Declining economic productivity'], answer: 'Reduced access to nature and built-environment dominance', explanation: '"residents spend more time in built environments and have less access to nature".' },
      { id: 'iel2q2', q: 'According to The Lancet study, who was more likely to meet physical activity recommendations?', options: ['People in high-income areas', 'People living near public transport', 'People living within 300 metres of green spaces', 'People with gym memberships'], answer: 'People living within 300 metres of green spaces', explanation: '"individuals living within 300 metres of green spaces were significantly more likely to meet recommended levels of weekly physical activity".' },
      { id: 'iel2q3', q: 'What is cortisol, as mentioned in the passage?', options: ['A type of urban pollutant', 'The primary stress hormone', 'A cognitive performance enhancer', 'A chemical released by plants'], answer: 'The primary stress hormone', explanation: '"reduce cortisol levels — the primary stress hormone".' },
      { id: 'iel2q4', q: 'What does the concept of "restorative environments" suggest?', options: ['Nature causes mental overstimulation', 'Built environments improve attention spans', 'Natural settings allow recovery from mental fatigue', 'Green spaces reduce physical energy levels'], answer: 'Natural settings allow recovery from mental fatigue', explanation: '"natural settings allow the mind to recover from directed attention fatigue, the mental exhaustion caused by sustained focus on demanding tasks".' },
      { id: 'iel2q5', q: 'What problem does the passage identify regarding green space distribution?', options: ['Green spaces are too expensive to maintain', 'Green spaces are not equally accessible across income groups', 'Too many people use parks, reducing their effectiveness', 'Urban planners oppose green infrastructure'], answer: 'Green spaces are not equally accessible across income groups', explanation: '"Lower-income neighbourhoods consistently report less access to quality parks...exacerbating existing health inequalities".' },
    ],
  },
];

// =====================================================================
// ToeicHomeScreen – sub-menu của TOEIC
// =====================================================================
const ToeicHomeScreen = ({ onBack }) => {
  const [mode, setMode] = useState('home');
  const [qs, setQs] = useState(null);
  const [passage, setPassage] = useState(null);

  if (mode === 'part5-pick')
    return <ToeicPickScreen onBack={() => setMode('home')} onStart={(pool) => { setQs(shuffle(pool).slice(0, Math.min(15, pool.length))); setMode('part5-test'); }} />;
  if (mode === 'part5-test' && qs)
    return <GenericTestScreen questions={qs} title="TOEIC Part 5" tagMap={TOEIC_CATEGORIES} onBack={() => { setMode('part5-pick'); setQs(null); }} />;
  if (mode === 'part7-pick')
    return <ReadingPickScreen passages={READING_PASSAGES} onBack={() => setMode('home')} onSelect={(p) => { setPassage(p); setMode('part7-test'); }} />;
  if (mode === 'part7-test' && passage)
    return <ReadingTestScreen passage={passage} onBack={() => { setMode('part7-pick'); setPassage(null); }} />;
  if (mode === 'error')
    return <ErrorRecognitionScreen onBack={() => setMode('home')} />;

  const items = [
    { id: 'part5-pick', icon: '✏️', label: 'Part 5 – Incomplete Sentences', sub: `Điền từ vào câu · ${TOEIC_PART5.length} câu · Dạng từ, giới từ, từ vựng...`, from: 'from-orange-400', to: 'to-orange-600' },
    { id: 'part7-pick', icon: '📄', label: 'Part 7 – Reading Comprehension', sub: `${READING_PASSAGES.length} đoạn văn · Email, quảng cáo, bài báo`, from: 'from-amber-400', to: 'to-amber-600' },
    { id: 'error',       icon: '🔍', label: 'Error Recognition', sub: `${ERROR_QUESTIONS.length} câu · Tìm phần sai trong câu`, from: 'from-red-400', to: 'to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title="TOEIC" onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4 px-1 text-xs text-gray-400">Test of English for International Communication – luyện tập theo từng Part</div>
        <div className="grid gap-4">
          {items.map(it => (
            <button key={it.id} onClick={() => setMode(it.id)}
              className={`w-full text-left bg-gradient-to-r ${it.from} ${it.to} text-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all`}>
              <div className="text-2xl mb-2">{it.icon}</div>
              <div className="font-bold text-base">{it.label}</div>
              <div className="text-xs opacity-85 mt-1">{it.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// VstepHomeScreen – sub-menu của VSTEP
// =====================================================================
const VstepHomeScreen = ({ onBack }) => {
  const [mode, setMode] = useState('home');
  const [qs, setQs] = useState(null);
  const [passage, setPassage] = useState(null);

  if (mode === 'grammar-test' && qs)
    return <GenericTestScreen questions={qs} title="VSTEP – Ngữ Pháp & Từ Vựng" tagMap={VSTEP_CATEGORIES} onBack={() => { setMode('home'); setQs(null); }} />;
  if (mode === 'reading-pick')
    return <ReadingPickScreen passages={READING_PASSAGES} onBack={() => setMode('home')} onSelect={(p) => { setPassage(p); setMode('reading-test'); }} />;
  if (mode === 'reading-test' && passage)
    return <ReadingTestScreen passage={passage} onBack={() => { setMode('reading-pick'); setPassage(null); }} />;
  if (mode === 'grammar-tense')
    return <GrammarCategoryScreen onBack={() => setMode('home')} />;

  const items = [
    { id: 'grammar',  label: 'Ngữ Pháp & Từ Vựng', icon: '📝', sub: `${VSTEP_QUESTIONS.length} câu · Cấu trúc nâng cao, colocation học thuật`, from: 'from-blue-400', to: 'to-blue-600', action: () => { setQs(shuffle(VSTEP_QUESTIONS)); setMode('grammar-test'); } },
    { id: 'tense',    label: '12 Thì Tiếng Anh',   icon: '⏰', sub: `${GRAMMAR_QUESTIONS.length} câu · Chọn thì hoặc tổng hợp`, from: 'from-indigo-400', to: 'to-indigo-600', action: () => setMode('grammar-tense') },
    { id: 'reading',  label: 'Đọc Hiểu',            icon: '📖', sub: `${READING_PASSAGES.length} đoạn văn · Email, công văn, bài báo`, from: 'from-sky-400', to: 'to-sky-600', action: () => setMode('reading-pick') },
    { id: 'error',    label: 'Tìm Lỗi Sai',         icon: '🔍', sub: `${ERROR_QUESTIONS.length} câu · Xác định phần sai trong câu`, from: 'from-violet-400', to: 'to-violet-600', action: () => setMode('error') },
  ];

  if (mode === 'error') return <ErrorRecognitionScreen onBack={() => setMode('home')} />;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title="VSTEP" onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4 px-1 text-xs text-gray-400">Bài thi Năng lực tiếng Anh Việt Nam – luyện theo từng kỹ năng</div>
        <div className="grid gap-4">
          {items.map(it => (
            <button key={it.id} onClick={it.action}
              className={`w-full text-left bg-gradient-to-r ${it.from} ${it.to} text-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all`}>
              <div className="text-2xl mb-2">{it.icon}</div>
              <div className="font-bold text-base">{it.label}</div>
              <div className="text-xs opacity-85 mt-1">{it.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// IeltsHomeScreen – sub-menu của IELTS
// =====================================================================
const IeltsHomeScreen = ({ onBack }) => {
  const [mode, setMode] = useState('home');
  const [qs, setQs] = useState(null);
  const [passage, setPassage] = useState(null);

  if (mode === 'reading-pick')
    return <ReadingPickScreen passages={IELTS_PASSAGES} onBack={() => setMode('home')} onSelect={(p) => { setPassage(p); setMode('reading-test'); }} />;
  if (mode === 'reading-test' && passage)
    return <ReadingTestScreen passage={passage} onBack={() => { setMode('reading-pick'); setPassage(null); }} />;
  if (mode === 'grammar-test' && qs)
    return <GenericTestScreen questions={qs} title="IELTS – Grammar" tagMap={VSTEP_CATEGORIES} onBack={() => { setMode('home'); setQs(null); }} />;
  if (mode === 'grammar-tense')
    return <GrammarCategoryScreen onBack={() => setMode('home')} />;

  const items = [
    { id: 'reading-pick', icon: '📚', label: 'Academic Reading',        sub: `${IELTS_PASSAGES.length} đoạn văn học thuật · Tâm lý học, Xã hội học`, from: 'from-emerald-400', to: 'to-emerald-600', action: () => setMode('reading-pick') },
    { id: 'grammar',      icon: '🧠', label: 'Grammar for IELTS',       sub: `${VSTEP_QUESTIONS.length} câu nâng cao · Đảo ngữ, Subjunctive, So sánh kép`, from: 'from-teal-400', to: 'to-teal-600', action: () => { setQs(shuffle(VSTEP_QUESTIONS)); setMode('grammar-test'); } },
    { id: 'tense',        icon: '⏰', label: '12 Thì – Ôn Nền Tảng',   sub: `${GRAMMAR_QUESTIONS.length} câu · Nền tảng ngữ pháp cho IELTS`, from: 'from-green-400', to: 'to-green-600', action: () => setMode('grammar-tense') },
    { id: 'error',        icon: '🔍', label: 'Error Correction',         sub: `${ERROR_QUESTIONS.length} câu · Nhận diện và sửa lỗi ngữ pháp`, from: 'from-lime-500', to: 'to-lime-700', action: () => setMode('error') },
  ];

  if (mode === 'error') return <ErrorRecognitionScreen onBack={() => setMode('home')} />;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title="IELTS" onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-4 px-1 text-xs text-gray-400">International English Language Testing System – luyện đọc và ngữ pháp học thuật</div>
        <div className="grid gap-4">
          {items.map(it => (
            <button key={it.id} onClick={it.action}
              className={`w-full text-left bg-gradient-to-r ${it.from} ${it.to} text-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all`}>
              <div className="text-2xl mb-2">{it.icon}</div>
              <div className="font-bold text-base">{it.label}</div>
              <div className="text-xs opacity-85 mt-1">{it.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// GeneralReadingScreen – Đọc Hiểu chung (TOEIC passages)
// =====================================================================
const GeneralReadingScreen = ({ onBack }) => {
  const [mode, setMode] = useState('pick');
  const [passage, setPassage] = useState(null);
  if (mode === 'test' && passage)
    return <ReadingTestScreen passage={passage} onBack={() => { setMode('pick'); setPassage(null); }} />;
  return <ReadingPickScreen passages={READING_PASSAGES} onBack={onBack} onSelect={(p) => { setPassage(p); setMode('test'); }} />;
};

window.TestModule = { TestHomeScreen, GrammarTestScreen };
