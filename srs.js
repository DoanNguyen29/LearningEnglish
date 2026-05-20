const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const speak = (text, lang = 'en-US', rate = 0.85) => {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = rate;
  speechSynthesis.speak(u);
};

const DAY = 86400000;

const calcSRS = (card, rating) => {
  const now  = Date.now();
  const MIN_EASE = 1.3;
  let iv   = card.srsInterval || 0;
  let ease = card.srsEase    || 2.5;
  let laps = card.srsLapses  || 0;
  const st = card.srsStatus  || 'new';
  const fresh = st === 'new' || st === 'learning';
  let newSt;

  if (rating === 0) {
    laps++; iv = 1; ease = Math.max(MIN_EASE, ease - 0.2); newSt = 'learning';
  } else if (rating === 1) {
    if (fresh) { iv = 1; newSt = 'learning'; }
    else { iv = Math.max(1, Math.round(iv * 1.2)); ease = Math.max(MIN_EASE, ease - 0.15); newSt = iv >= 21 ? 'mastered' : 'review'; }
  } else if (rating === 2) {
    iv = fresh ? 3 : Math.round(iv * ease); newSt = iv >= 21 ? 'mastered' : 'review';
  } else {
    if (fresh) { iv = 7; } else { iv = Math.round(iv * ease * 1.3); ease = Math.min(3.0, ease + 0.15); }
    newSt = 'mastered';
  }

  return {
    srsInterval: iv, srsEase: +ease.toFixed(2), srsLapses: laps,
    srsStatus: newSt, srsNextReview: now + iv * DAY,
    known: rating >= 2,
    correct:   (card.correct   || 0) + (rating >= 2 ? 1 : 0),
    incorrect: (card.incorrect || 0) + (rating  < 2 ? 1 : 0),
  };
};

const fmtIv = (d) => {
  if (!d || d <= 0) return '< 10 phút';
  if (d === 1) return '1 ngày';
  if (d  <  7) return `${d} ngày`;
  if (d  < 30) return `${Math.round(d / 7)} tuần`;
  return `${Math.round(d / 30)} tháng`;
};

const nextIvLabels = (card) => {
  const iv = card.srsInterval || 0, ease = card.srsEase || 2.5;
  const fresh = !card.srsStatus || card.srsStatus === 'new' || card.srsStatus === 'learning';
  return [
    '< 10 phút',
    fmtIv(fresh ? 1 : Math.max(1, Math.round(iv * 1.2))),
    fmtIv(fresh ? 3 : Math.round(iv * ease)),
    fmtIv(fresh ? 7 : Math.round(iv * ease * 1.3)),
  ];
};

const SRS_BADGE = {
  new:      'bg-gray-100 text-gray-500',
  learning: 'bg-orange-100 text-orange-700',
  review:   'bg-blue-100 text-blue-700',
  mastered: 'bg-green-100 text-green-700',
};

const SRS_LABEL = { new:'Mới', learning:'Học', review:'Ôn', mastered:'Thuộc' };

const SAMPLE = {
  sets: [
    {
      id:'set1', name:'Từ vựng cốt lõi', description:'Các từ thông dụng căn bản hữu ích nhất', createdAt:Date.now(),
      cards:[
        {id:'c01',front:'Apple',    back:'Quả táo',        example:'I eat an apple every morning.',    known:false,correct:0,incorrect:0},
        {id:'c02',front:'Book',     back:'Quyển sách',     example:'She is reading a good book.',      known:false,correct:0,incorrect:0},
        {id:'c03',front:'Computer', back:'Máy tính',       example:'I work on my computer all day.',   known:false,correct:0,incorrect:0},
        {id:'c04',front:'Dog',      back:'Con chó',        example:'The dog is very friendly.',        known:false,correct:0,incorrect:0},
        {id:'c05',front:'Elephant', back:'Con voi',        example:'An elephant never forgets.',       known:false,correct:0,incorrect:0},
        {id:'c06',front:'Flower',   back:'Bông hoa',       example:'The flower smells wonderful.',     known:false,correct:0,incorrect:0},
        {id:'c07',front:'Garden',   back:'Khu vườn',       example:'We have a beautiful garden.',      known:false,correct:0,incorrect:0},
        {id:'c08',front:'House',    back:'Ngôi nhà',       example:'They live in a big house.',        known:false,correct:0,incorrect:0},
        {id:'c09',front:'Island',   back:'Hòn đảo',        example:'The island is surrounded by sea.', known:false,correct:0,incorrect:0},
        {id:'c10',front:'Journey',  back:'Cuộc hành trình',example:'Life is a long journey.',          known:false,correct:0,incorrect:0},
      ]
    }
  ]
};

window.SRS = { uid, shuffle, speak, calcSRS, nextIvLabels, SRS_BADGE, SRS_LABEL, SAMPLE };