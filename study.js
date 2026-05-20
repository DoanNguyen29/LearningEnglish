const { useState, useEffect } = React;
const { NavBar, Bar, Btn } = window.UI;
const { shuffle, speak, calcSRS, nextIvLabels } = window.SRS;

const ResultScreen = ({ known, unknown, onRetryAll, onBack }) => {
  const total = known + unknown;
  return (
    <div className="max-w-md mx-auto px-4 py-10 text-center">
      <div className="text-5xl mb-2">🏆</div>
      <h2 className="text-xl font-bold mb-6">Kết quả buổi học</h2>
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-4">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-green-50 p-2 rounded-lg text-green-700 font-bold">Đúng: {known}</div>
          <div className="bg-red-50 p-2 rounded-lg text-red-700 font-bold">Sai: {unknown}</div>
        </div>
        <Bar value={known} max={total}/>
      </div>
      <div className="grid gap-2">
        <Btn full onClick={onRetryAll}>Học lại tất cả</Btn>
        <Btn full color="gray" onClick={onBack}>Quay lại</Btn>
      </div>
    </div>
  );
};

/* 1. SRS Study Module */
const LearnStudy = ({ set, onBack, onUpdateCard }) => {
  const now = Date.now();
  const [queue, setQueue] = useState(() => shuffle(set.cards.filter(c => !c.srsStatus || c.srsStatus === 'new' || (c.srsNextReview || 0) <= now)));
  const [idx, setIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const card = queue[idx];
  useEffect(() => { if (card?.front) speak(card.front); }, [idx, card]);

  if (queue.length === 0) return <div className="text-center p-12"><p className="mb-4 font-bold">Hoàn thành mục tiêu ôn tập SRS hôm nay!</p><Btn onClick={onBack}>Quay lại</Btn></div>;

  const labels = nextIvLabels(card);

  return (
    <div className="min-h-screen">
      <NavBar title="🧠 Học lặp lại ngắt quãng (SRS)" onBack={onBack}/>
      <div className="max-w-md mx-auto px-4 py-5 text-center">
        <div className="bg-white border p-12 rounded-2xl shadow-sm mb-4">
          <div className="text-3xl font-bold">{card.front}</div>
          {showBack && (
            <div className="mt-4 border-t pt-4">
              <div className="text-2xl text-blue-600 font-bold">{card.back}</div>
              <p className="text-sm text-gray-400 mt-2 italic">"{card.example}"</p>
            </div>
          )}
        </div>
        {!showBack ? (
          <Btn full onClick={() => setShowBack(true)}>Hiện nghĩa đáp án</Btn>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            <button onClick={() => { onUpdateCard(set.id, card.id, calcSRS(card, 0)); setShowBack(false); if (idx+1 >= queue.length) setQueue([]); else setIdx(idx+1); }} className="bg-red-500 text-white p-2 rounded-xl text-xs font-bold">Quên<br/><span className="text-[10px] opacity-80">{labels[0]}</span></button>
            <button onClick={() => { onUpdateCard(set.id, card.id, calcSRS(card, 1)); setShowBack(false); if (idx+1 >= queue.length) setQueue([]); else setIdx(idx+1); }} className="bg-orange-500 text-white p-2 rounded-xl text-xs font-bold">Khó<br/><span className="text-[10px] opacity-80">{labels[1]}</span></button>
            <button onClick={() => { onUpdateCard(set.id, card.id, calcSRS(card, 2)); setShowBack(false); if (idx+1 >= queue.length) setQueue([]); else setIdx(idx+1); }} className="bg-blue-500 text-white p-2 rounded-xl text-xs font-bold">Nhớ<br/><span className="text-[10px] opacity-80">{labels[2]}</span></button>
            <button onClick={() => { onUpdateCard(set.id, card.id, calcSRS(card, 3)); setShowBack(false); if (idx+1 >= queue.length) setQueue([]); else setIdx(idx+1); }} className="bg-green-500 text-white p-2 rounded-xl text-xs font-bold">Dễ<br/><span className="text-[10px] opacity-80">{labels[3]}</span></button>
          </div>
        )}
      </div>
    </div>
  );
};

/* 2. Flashcard Module */
const FlashcardStudy = ({ set, onBack, onUpdateCard }) => {
  const [pool, setPool] = useState(() => shuffle(set.cards));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlip] = useState(false);
  const [known, setKnown] = useState(0);
  const [unk, setUnk] = useState(0);
  const [done, setDone] = useState(false);

  const card = pool[idx];
  useEffect(() => { if (!done && card?.front) speak(card.front); }, [idx, done]);

  const advance = (ok) => {
    onUpdateCard(set.id, card.id, { known: ok });
    if (ok) setKnown(n => n + 1); else setUnk(n => n + 1);
    setFlip(false);
    if (idx + 1 >= pool.length) setDone(true); else setIdx(idx + 1);
  };

  if (done) return <ResultScreen known={known} unknown={unk} onBack={onBack} onRetryAll={() => { setPool(shuffle(set.cards)); setIdx(0); setDone(false); setKnown(0); setUnk(0); }}/>;
  if (!card) return null;

  return (
    <div className="min-h-screen">
      <NavBar title="🃏 Flashcard" onBack={onBack}/>
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="card-container h-64 mb-6 cursor-pointer" onClick={() => setFlip(!flipped)}>
          <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
            <div className="card-face absolute inset-0 bg-white shadow-md flex flex-col items-center justify-center p-6 border">
              <span className="text-3xl font-bold">{card.front}</span>
              <span className="text-xs text-gray-400 mt-4">Bấm để lật nghĩa</span>
            </div>
            <div className="card-face card-back-face absolute inset-0 bg-blue-50 shadow-md flex flex-col items-center justify-center p-6 border border-blue-200">
              <span className="text-2xl font-bold text-blue-700 mb-2">{card.back}</span>
              <p className="text-sm text-gray-500 text-center italic">"{card.example}"</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Btn full color="red" onClick={() => advance(false)}>Chưa thuộc ❌</Btn>
          <Btn full color="green" onClick={() => advance(true)}>Đã thuộc  ✅</Btn>
        </div>
      </div>
    </div>
  );
};

/* 3. Quiz Module */
const QuizStudy = ({ set, onBack, onUpdateCard }) => {
  const [pool, setPool] = useState(() => shuffle(set.cards));
  const [idx, setIdx] = useState(0);
  const [opts, setOpts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [known, setKnown] = useState(0);
  const [unk, setUnk] = useState(0);
  const [done, setDone] = useState(false);

  const card = pool[idx];

  useEffect(() => {
    if (!card) return;
    speak(card.front);
    const wrongs = set.cards.filter(c => c.id !== card.id);
    const shuffledWrongs = shuffle(wrongs).slice(0, 3);
    setOpts(shuffle([card, ...shuffledWrongs]));
    setSelected(null);
  }, [idx, card, set.cards]);

  const handleAnswer = (o) => {
    if (selected) return;
    setSelected(o.id);
    const ok = o.id === card.id;
    onUpdateCard(set.id, card.id, { known: ok });
    if (ok) setKnown(n => n + 1); else setUnk(n => n + 1);

    setTimeout(() => {
      if (idx + 1 >= pool.length) setDone(true); else setIdx(idx + 1);
    }, 1200);
  };

  if (done) return <ResultScreen known={known} unknown={unk} onBack={onBack} onRetryAll={() => { setPool(shuffle(set.cards)); setIdx(0); setDone(false); setKnown(0); setUnk(0); }}/>;
  if (!card) return null;

  return (
    <div className="min-h-screen">
      <NavBar title="📝 Trắc nghiệm" onBack={onBack}/>
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Từ này có nghĩa là gì?</span>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{card.front}</h2>
        </div>
        <div className="grid gap-3">
          {opts.map(o => {
            let color = "bg-white border-gray-200 hover:border-blue-300";
            if (selected) {
              if (o.id === card.id) color = "bg-green-100 border-green-500 text-green-700 font-bold";
              else if (o.id === selected) color = "bg-red-100 border-red-500 text-red-700";
            }
            return (
              <button key={o.id} onClick={() => handleAnswer(o)} className={`w-full p-4 rounded-xl text-left border text-sm transition-all ${color}`}>
                {o.back}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* 4. Typing Write Module */
const WriteStudy = ({ set, onBack, onUpdateCard }) => {
  const [pool, setPool] = useState(() => shuffle(set.cards));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [known, setKnown] = useState(0);
  const [unk, setUnk] = useState(0);
  const [done, setDone] = useState(false);

  const card = pool[idx];

  const handleCheck = (e) => {
    e.preventDefault();
    if (checked) return;
    const ok = input.trim().toLowerCase() === card.front.toLowerCase();
    setIsCorrect(ok);
    setChecked(true);
    onUpdateCard(set.id, card.id, { known: ok });
    if (ok) setKnown(n => n + 1); else setUnk(n => n + 1);
    speak(card.front);

    setTimeout(() => {
      setInput('');
      setChecked(false);
      if (idx + 1 >= pool.length) setDone(true); else setIdx(idx + 1);
    }, 1500);
  };

  if (done) return <ResultScreen known={known} unknown={unk} onBack={onBack} onRetryAll={() => { setPool(shuffle(set.cards)); setIdx(0); setDone(false); setKnown(0); setUnk(0); }}/>;
  if (!card) return null;

  return (
    <div className="min-h-screen">
      <NavBar title="✍️ Gõ từ" onBack={onBack}/>
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Hãy gõ lại từ tiếng Anh ứng với nghĩa:</span>
          <h2 className="text-2xl font-bold text-blue-600 mt-2">{card.back}</h2>
          <p className="text-sm text-gray-400 mt-2 italic">Gợi ý: {card.front[0]}... ({card.front.length} ký tự)</p>
        </div>
        <form onSubmit={handleCheck} className="grid gap-3">
          <input type="text" value={input} disabled={checked} onChange={e => setInput(e.target.value)} placeholder="Nhập từ tiếng Anh tại đây..." className="w-full px-4 py-3 rounded-xl border text-center font-bold text-lg outline-none" autoFocus/>
          <Btn full type="submit" disabled={!input.trim() || checked} color={checked ? (isCorrect ? 'green' : 'red') : 'blue'}>
            {checked ? (isCorrect ? 'Chính xác! 🎉' : `Sai rồi ❌ Đáp án là: ${card.front}`) : 'Kiểm tra'}
          </Btn>
        </form>
      </div>
    </div>
  );
};

window.Study = { LearnStudy, FlashcardStudy, QuizStudy, WriteStudy };