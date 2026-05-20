const { useState } = React;

const Bar = ({ value, max, color = 'bg-blue-500' }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    <div className={`${color} h-2 rounded-full progress-fill`} style={{ width: max > 0 ? `${Math.round(value / max * 100)}%` : '0%' }} />
  </div>
);

const NavBar = ({ title, onBack, extra }) => (
  <div className="bg-white shadow-sm sticky top-0 z-40">
    <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        {onBack && (
          <button onClick={onBack} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
        )}
        <span className="font-bold text-gray-800 truncate">{title}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">{extra}</div>
    </div>
  </div>
);

const Btn = ({ children, onClick, color='blue', full=false, sm=false, disabled=false, type='button' }) => {
  const cls = {
    blue:  'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-100',
    green: 'bg-green-600 text-white hover:bg-green-700 shadow-sm shadow-green-100',
    gray:  'bg-gray-100 text-gray-600 hover:bg-gray-200',
    red:   'bg-red-50 text-red-600 hover:bg-red-100',
    orange:'bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-100'
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${full ? 'w-full' : ''} ${sm ? 'px-3 py-2 text-sm' : 'px-4 py-2.5'} rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${cls[color]}`}>
      {children}
    </button>
  );
};

const SpeakBtn = ({ text, lang = 'en-US' }) => {
  const [on, setOn] = useState(false);
  if (!window.speechSynthesis) return null;
  const go = (e) => {
    e.stopPropagation();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = 0.85;
    u.onstart = () => setOn(true);
    u.onend = u.onerror = () => setOn(false);
    speechSynthesis.speak(u);
  };
  return (
    <button onClick={go} type="button" title="Nghe phát âm" style={{ position:'relative' }}
      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all
        ${on ? 'bg-blue-500 text-white shadow-md speak-active' : 'bg-blue-50 text-blue-400 hover:bg-blue-100 hover:text-blue-600'}`}>
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        {on 
          ? <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          : <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
        }
      </svg>
    </button>
  );
};

// Đăng ký vào không gian toàn cục window để module khác sử dụng
window.UI = { Bar, NavBar, Btn, SpeakBtn };