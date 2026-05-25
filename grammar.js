const { useState } = React;
const { NavBar, gradientStyle } = window.UI;

const TENSES = [
  {
    id: 'present-simple',
    name: 'Thì Hiện Tại Đơn',
    englishName: 'Present Simple',
    icon: '1',
    gradient: 'from-blue-500 to-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    light: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    formula: {
      positive: 'S + V (nguyên mẫu)\nHe / She / It + V-s / es',
      negative: 'S + do not (don\'t) + V\nHe/She/It + does not (doesn\'t) + V',
      question: 'Do + S + V?\nDoes + He/She/It + V?'
    },
    usage: [
      'Thói quen, hành động lặp đi lặp lại thường xuyên',
      'Sự thật hiển nhiên, quy luật tự nhiên, khoa học',
      'Lịch trình, thời gian biểu cố định',
      'Cảm xúc, sở thích và trạng thái không thay đổi'
    ],
    signals: ['always', 'usually', 'often', 'sometimes', 'rarely', 'never', 'every day / week / month / year', 'once / twice a week'],
    examples: [
      { en: 'She goes to school every day.', vi: 'Cô ấy đi học mỗi ngày.' },
      { en: 'Water boils at 100 degrees Celsius.', vi: 'Nước sôi ở 100 độ C.' },
      { en: 'He doesn\'t like coffee.', vi: 'Anh ấy không thích cà phê.' },
      { en: 'Do you speak English?', vi: 'Bạn có nói tiếng Anh không?' }
    ],
    note: 'Thêm -s/-es sau động từ khi chủ ngữ là He/She/It. Động từ "be": am (I), is (He/She/It), are (We/You/They).'
  },
  {
    id: 'present-continuous',
    name: 'Thì Hiện Tại Tiếp Diễn',
    englishName: 'Present Continuous',
    icon: '2',
    gradient: 'from-cyan-500 to-cyan-700',
    badge: 'bg-cyan-100 text-cyan-700',
    light: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    formula: {
      positive: 'S + am / is / are + V-ing',
      negative: 'S + am / is / are + not + V-ing',
      question: 'Am / Is / Are + S + V-ing?'
    },
    usage: [
      'Hành động đang xảy ra tại thời điểm nói',
      'Hành động tạm thời đang diễn ra trong giai đoạn hiện tại',
      'Kế hoạch đã được sắp xếp trong tương lai gần',
      'Xu hướng đang thay đổi, phát triển'
    ],
    signals: ['now', 'right now', 'at the moment', 'at present', 'currently', 'today', 'this week / month'],
    examples: [
      { en: 'She is studying English right now.', vi: 'Cô ấy đang học tiếng Anh ngay lúc này.' },
      { en: 'They are playing football at the moment.', vi: 'Họ đang chơi bóng đá lúc này.' },
      { en: 'I am not watching TV.', vi: 'Tôi không đang xem TV.' },
      { en: 'Are you coming to the party tonight?', vi: 'Bạn có đến bữa tiệc tối nay không?' }
    ],
    note: 'Stative verbs (động từ trạng thái) không dùng ở thì tiếp diễn: know, like, love, hate, want, need, believe, understand...'
  },
  {
    id: 'present-perfect',
    name: 'Thì Hiện Tại Hoàn Thành',
    englishName: 'Present Perfect',
    icon: '3',
    gradient: 'from-indigo-500 to-indigo-700',
    badge: 'bg-indigo-100 text-indigo-700',
    light: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    formula: {
      positive: 'S + have / has + V3 (quá khứ phân từ)',
      negative: 'S + have / has + not + V3',
      question: 'Have / Has + S + V3?'
    },
    usage: [
      'Hành động xảy ra trong quá khứ, kết quả còn ảnh hưởng đến hiện tại',
      'Kinh nghiệm sống, trải nghiệm cá nhân (không nêu thời điểm cụ thể)',
      'Hành động vừa mới xảy ra (just, recently)',
      'Hành động chưa hoàn thành hoặc dự kiến phải xảy ra (yet)'
    ],
    signals: ['just', 'already', 'yet', 'ever', 'never', 'recently', 'lately', 'since + mốc thời gian', 'for + khoảng thời gian', 'so far', 'up to now', 'before'],
    examples: [
      { en: 'I have visited Paris twice.', vi: 'Tôi đã đến thăm Paris hai lần.' },
      { en: 'She has just finished her homework.', vi: 'Cô ấy vừa mới làm xong bài tập.' },
      { en: 'Have you ever eaten sushi?', vi: 'Bạn đã từng ăn sushi chưa?' },
      { en: 'He hasn\'t called me yet.', vi: 'Anh ấy vẫn chưa gọi cho tôi.' }
    ],
    note: 'Không dùng với các trạng từ chỉ thời gian xác định như yesterday, last week, in 2020 — dùng Past Simple thay thế.'
  },
  {
    id: 'present-perfect-continuous',
    name: 'Thì Hiện Tại Hoàn Thành Tiếp Diễn',
    englishName: 'Present Perfect Continuous',
    icon: '4',
    gradient: 'from-violet-500 to-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    light: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    formula: {
      positive: 'S + have / has + been + V-ing',
      negative: 'S + have / has + not + been + V-ing',
      question: 'Have / Has + S + been + V-ing?'
    },
    usage: [
      'Hành động bắt đầu từ quá khứ, vẫn đang tiếp diễn đến hiện tại',
      'Nhấn mạnh tính liên tục, kéo dài của hành động',
      'Hành động vừa kết thúc nhưng kết quả vẫn còn thấy rõ',
      'Giải thích nguyên nhân của một trạng thái hiện tại'
    ],
    signals: ['since + mốc thời gian', 'for + khoảng thời gian', 'lately', 'recently', 'all day / morning / week', 'how long'],
    examples: [
      { en: 'I have been studying English for three years.', vi: 'Tôi đã học tiếng Anh được ba năm rồi.' },
      { en: 'She has been working here since 2020.', vi: 'Cô ấy đã làm việc ở đây từ năm 2020.' },
      { en: 'They have been waiting for two hours.', vi: 'Họ đã chờ đợi được hai tiếng rồi.' },
      { en: 'How long have you been learning guitar?', vi: 'Bạn học guitar được bao lâu rồi?' }
    ],
    note: 'So sánh với Present Perfect: "I have read the book" (đã đọc xong) vs "I have been reading the book" (đang đọc, chưa xong).'
  },
  {
    id: 'past-simple',
    name: 'Thì Quá Khứ Đơn',
    englishName: 'Past Simple',
    icon: '5',
    gradient: 'from-amber-600 to-amber-800',
    badge: 'bg-amber-100 text-amber-700',
    light: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    formula: {
      positive: 'S + V2 / V-ed (động từ bất quy tắc hoặc thêm -ed)',
      negative: 'S + did not (didn\'t) + V (nguyên mẫu)',
      question: 'Did + S + V (nguyên mẫu)?'
    },
    usage: [
      'Hành động đã xảy ra và kết thúc trong quá khứ (có thời điểm xác định)',
      'Chuỗi hành động xảy ra lần lượt trong quá khứ',
      'Thói quen hoặc trạng thái trong quá khứ (nay không còn nữa)',
      'Sự kiện lịch sử'
    ],
    signals: ['yesterday', 'last (night / week / month / year)', 'ago', 'in + năm cụ thể', 'when', 'then', 'at that time'],
    examples: [
      { en: 'She visited her grandmother last weekend.', vi: 'Cô ấy đã thăm bà ngoại cuối tuần trước.' },
      { en: 'He studied hard and passed the exam.', vi: 'Anh ấy học chăm và đã đậu kỳ thi.' },
      { en: 'I didn\'t watch the movie yesterday.', vi: 'Tôi đã không xem phim hôm qua.' },
      { en: 'Did you go to the party last night?', vi: 'Bạn có đi dự tiệc tối qua không?' }
    ],
    note: 'Động từ bất quy tắc (irregular verbs) phải học thuộc lòng dạng V2: go → went, have → had, see → saw...'
  },
  {
    id: 'past-continuous',
    name: 'Thì Quá Khứ Tiếp Diễn',
    englishName: 'Past Continuous',
    icon: '6',
    gradient: 'from-orange-500 to-orange-700',
    badge: 'bg-orange-100 text-orange-700',
    light: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    formula: {
      positive: 'S + was / were + V-ing',
      negative: 'S + was / were + not + V-ing',
      question: 'Was / Were + S + V-ing?'
    },
    usage: [
      'Hành động đang diễn ra tại một thời điểm xác định trong quá khứ',
      'Hành động đang diễn ra thì bị gián đoạn bởi hành động khác (dùng with Past Simple)',
      'Hai hành động song song xảy ra cùng lúc trong quá khứ',
      'Tạo bối cảnh cho câu chuyện (background action)'
    ],
    signals: ['at + giờ + yesterday', 'at that time', 'when + quá khứ đơn', 'while + quá khứ tiếp diễn', 'all morning / evening'],
    examples: [
      { en: 'She was cooking dinner when he arrived.', vi: 'Cô ấy đang nấu ăn tối thì anh ấy đến.' },
      { en: 'At 8pm last night, I was watching TV.', vi: 'Lúc 8 giờ tối qua, tôi đang xem TV.' },
      { en: 'While she was sleeping, he was studying.', vi: 'Trong khi cô ấy ngủ, anh ấy đang học.' },
      { en: 'Were you listening when the teacher spoke?', vi: 'Bạn có đang lắng nghe khi thầy giáo nói không?' }
    ],
    note: 'was dùng cho I/He/She/It; were dùng cho We/You/They. Cấu trúc hay gặp: "was/were doing ... when + did" (đang làm gì thì ...)'
  },
  {
    id: 'past-perfect',
    name: 'Thì Quá Khứ Hoàn Thành',
    englishName: 'Past Perfect',
    icon: '7',
    gradient: 'from-red-500 to-red-700',
    badge: 'bg-red-100 text-red-700',
    light: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    formula: {
      positive: 'S + had + V3 (quá khứ phân từ)',
      negative: 'S + had + not (hadn\'t) + V3',
      question: 'Had + S + V3?'
    },
    usage: [
      'Hành động xảy ra trước một hành động khác trong quá khứ',
      'Hành động đã hoàn thành trước một thời điểm xác định trong quá khứ',
      'Điều kiện loại 3 (If clause type 3)',
      'Báo cáo lại lời nói (reported speech)'
    ],
    signals: ['before', 'after', 'by the time', 'when (+ past simple)', 'already', 'just', 'never', 'as soon as', 'by + mốc thời gian quá khứ'],
    examples: [
      { en: 'She had finished the report before the meeting started.', vi: 'Cô ấy đã hoàn thành báo cáo trước khi cuộc họp bắt đầu.' },
      { en: 'When I arrived, the train had already left.', vi: 'Khi tôi đến, tàu đã rời đi rồi.' },
      { en: 'He hadn\'t eaten anything before the exam.', vi: 'Anh ấy chưa ăn gì trước khi thi.' },
      { en: 'Had you met him before the conference?', vi: 'Bạn đã gặp anh ấy trước hội nghị chưa?' }
    ],
    note: 'Dùng khi có hai hành động quá khứ, hành động nào xảy ra trước thì dùng Past Perfect. Hành động xảy ra sau dùng Past Simple.'
  },
  {
    id: 'past-perfect-continuous',
    name: 'Thì Quá Khứ Hoàn Thành Tiếp Diễn',
    englishName: 'Past Perfect Continuous',
    icon: '8',
    gradient: 'from-rose-500 to-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    light: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    formula: {
      positive: 'S + had + been + V-ing',
      negative: 'S + had + not + been + V-ing',
      question: 'Had + S + been + V-ing?'
    },
    usage: [
      'Hành động liên tục xảy ra trước một hành động/thời điểm khác trong quá khứ',
      'Nhấn mạnh khoảng thời gian của hành động trước một sự kiện quá khứ',
      'Giải thích nguyên nhân của một trạng thái trong quá khứ'
    ],
    signals: ['for + khoảng thời gian', 'since + mốc thời gian', 'before', 'when', 'by the time (+ past simple)'],
    examples: [
      { en: 'She had been crying for an hour when he came back.', vi: 'Cô ấy đã khóc một tiếng trước khi anh ấy về.' },
      { en: 'They had been working on the project for months before it was launched.', vi: 'Họ đã làm dự án đó vài tháng trước khi ra mắt.' },
      { en: 'He was tired because he had been running.', vi: 'Anh ấy mệt vì đã chạy một hồi lâu.' },
      { en: 'How long had you been waiting before the bus arrived?', vi: 'Bạn đã chờ bao lâu trước khi xe buýt đến?' }
    ],
    note: 'Ít phổ biến hơn các thì khác, thường xuất hiện trong văn viết và kể chuyện để nhấn mạnh khoảng thời gian.'
  },
  {
    id: 'future-simple',
    name: 'Thì Tương Lai Đơn',
    englishName: 'Future Simple (Will)',
    icon: '9',
    gradient: 'from-green-600 to-green-800',
    badge: 'bg-green-100 text-green-700',
    light: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    formula: {
      positive: 'S + will + V (nguyên mẫu)',
      negative: 'S + will not (won\'t) + V',
      question: 'Will + S + V?'
    },
    usage: [
      'Dự đoán về tương lai (không có bằng chứng cụ thể)',
      'Quyết định ngay tại thời điểm nói (spontaneous decision)',
      'Lời hứa, lời đề nghị, yêu cầu lịch sự',
      'Sự kiện tất yếu, không thể thay đổi trong tương lai'
    ],
    signals: ['tomorrow', 'next (week / month / year)', 'in the future', 'soon', 'perhaps / maybe / probably', 'I think...', 'I believe...'],
    examples: [
      { en: 'It will rain tomorrow.', vi: 'Ngày mai trời sẽ mưa.' },
      { en: 'I will help you with your homework.', vi: 'Tôi sẽ giúp bạn làm bài tập.' },
      { en: 'She won\'t come to the party.', vi: 'Cô ấy sẽ không đến bữa tiệc.' },
      { en: 'Will you marry me?', vi: 'Em có đồng ý lấy anh không?' }
    ],
    note: 'Phân biệt "will" (quyết định tức thời) và "be going to" (kế hoạch đã định từ trước). "I will get the phone" (ngay lúc này) vs "I am going to call him" (đã dự định).'
  },
  {
    id: 'future-continuous',
    name: 'Thì Tương Lai Tiếp Diễn',
    englishName: 'Future Continuous',
    icon: '10',
    gradient: 'from-emerald-600 to-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700',
    light: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    formula: {
      positive: 'S + will + be + V-ing',
      negative: 'S + will + not + be + V-ing',
      question: 'Will + S + be + V-ing?'
    },
    usage: [
      'Hành động đang diễn ra tại một thời điểm xác định trong tương lai',
      'Kế hoạch hoặc hành động đã được sắp xếp trong tương lai',
      'Hỏi lịch sự về kế hoạch của người khác'
    ],
    signals: ['at this time tomorrow', 'at + giờ + tomorrow', 'this time next week / year', 'in an hour', 'all day tomorrow'],
    examples: [
      { en: 'This time tomorrow, I will be flying to London.', vi: 'Vào giờ này ngày mai, tôi sẽ đang bay đến London.' },
      { en: 'At 8pm, she will be having dinner.', vi: 'Lúc 8 giờ tối, cô ấy sẽ đang ăn tối.' },
      { en: 'Will you be using the car tonight?', vi: 'Tối nay bạn có dùng xe không?' },
      { en: 'They won\'t be working on Sunday.', vi: 'Họ sẽ không làm việc vào Chủ nhật.' }
    ],
    note: 'Dùng để hỏi lịch sự hơn so với "Will you...?". "Will you be coming to the meeting?" lịch sự hơn "Will you come to the meeting?"'
  },
  {
    id: 'future-perfect',
    name: 'Thì Tương Lai Hoàn Thành',
    englishName: 'Future Perfect',
    icon: '11',
    gradient: 'from-teal-600 to-teal-800',
    badge: 'bg-teal-100 text-teal-700',
    light: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    formula: {
      positive: 'S + will + have + V3 (quá khứ phân từ)',
      negative: 'S + will + not + have + V3',
      question: 'Will + S + have + V3?'
    },
    usage: [
      'Hành động sẽ hoàn thành trước một thời điểm xác định trong tương lai',
      'Hành động sẽ kết thúc trước một hành động khác trong tương lai'
    ],
    signals: ['by + thời gian tương lai (by tomorrow, by next week, by 2030)', 'before + thời gian tương lai', 'by the time + mệnh đề tương lai'],
    examples: [
      { en: 'I will have finished the project by Friday.', vi: 'Tôi sẽ hoàn thành dự án vào trước thứ Sáu.' },
      { en: 'By the time you arrive, she will have left.', vi: 'Khi bạn đến, cô ấy sẽ đã rời đi rồi.' },
      { en: 'He will have studied English for 5 years by 2026.', vi: 'Đến năm 2026, anh ấy sẽ đã học tiếng Anh được 5 năm.' },
      { en: 'Will you have finished eating by 7pm?', vi: 'Trước 7 giờ tối bạn sẽ ăn xong chưa?' }
    ],
    note: '"by" là từ khóa quan trọng nhất của thì này. "By" nghĩa là "trước thời điểm đó" hoặc "không muộn hơn thời điểm đó".'
  },
  {
    id: 'future-perfect-continuous',
    name: 'Thì Tương Lai Hoàn Thành Tiếp Diễn',
    englishName: 'Future Perfect Continuous',
    icon: '12',
    gradient: 'from-lime-600 to-lime-800',
    badge: 'bg-lime-100 text-lime-700',
    light: 'bg-lime-50',
    border: 'border-lime-200',
    text: 'text-lime-700',
    formula: {
      positive: 'S + will + have + been + V-ing',
      negative: 'S + will + not + have + been + V-ing',
      question: 'Will + S + have + been + V-ing?'
    },
    usage: [
      'Nhấn mạnh khoảng thời gian của một hành động liên tục sẽ xảy ra trước một thời điểm trong tương lai',
      'Nhấn mạnh sự liên tục và kéo dài của hành động tương lai'
    ],
    signals: ['for + khoảng thời gian + by + thời điểm tương lai', 'by the time... for...'],
    examples: [
      { en: 'By 2027, I will have been studying English for 10 years.', vi: 'Đến năm 2027, tôi sẽ học tiếng Anh được 10 năm liên tục.' },
      { en: 'By the time he retires, he will have been working for 30 years.', vi: 'Đến lúc ông ấy nghỉ hưu, ông sẽ làm việc được 30 năm.' },
      { en: 'She will have been teaching for 20 years by next month.', vi: 'Sang tháng tới, cô ấy sẽ đã dạy học được 20 năm.' },
      { en: 'Will you have been living here for 5 years by June?', vi: 'Đến tháng Sáu thì bạn sẽ sống ở đây được 5 năm chưa?' }
    ],
    note: 'Đây là thì khó và ít gặp nhất trong 12 thì. Kết hợp tính hoàn thành (perfect) và liên tục (continuous) trong tương lai.'
  }
];

const GROUPS = [
  { name: 'Thì Hiện Tại', emoji: '🌞', ids: ['present-simple', 'present-continuous', 'present-perfect', 'present-perfect-continuous'] },
  { name: 'Thì Quá Khứ', emoji: '🕰️', ids: ['past-simple', 'past-continuous', 'past-perfect', 'past-perfect-continuous'] },
  { name: 'Thì Tương Lai', emoji: '🚀', ids: ['future-simple', 'future-continuous', 'future-perfect', 'future-perfect-continuous'] }
];

const GrammarListScreen = ({ onBack, onSelectTense }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title="Ngữ Pháp Tiếng Anh" onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 leading-relaxed">
            Tiếng Anh có <strong>12 thì cơ bản</strong>, chia thành 3 nhóm: Hiện tại, Quá khứ và Tương lai. Chọn một thì để xem công thức, cách dùng và ví dụ chi tiết.
          </p>
        </div>

        {GROUPS.map(group => {
          const groupTenses = TENSES.filter(t => group.ids.includes(t.id));
          return (
            <div key={group.name} className="mb-8">
              <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span>{group.emoji}</span>
                <span>{group.name}</span>
              </h2>
              <div className="grid gap-3">
                {groupTenses.map(tense => (
                  <button
                    key={tense.id}
                    onClick={() => onSelectTense(tense.id)}
                    className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all overflow-hidden"
                  >
                    <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                      <div style={gradientStyle(tense.gradient)} className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-bold text-base">{tense.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-800 font-bold text-sm">{tense.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{tense.englishName}</div>
                        <div className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${tense.badge} mt-1.5`}>
                          {tense.formula.positive.split('\n')[0]}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                    <div className="px-4 pb-3">
                      <div className="flex flex-wrap gap-1.5">
                        {tense.signals.slice(0, 3).map(s => (
                          <span key={s} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                        {tense.signals.length > 3 && (
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">+{tense.signals.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TenseDetailScreen = ({ tenseId, onBack }) => {
  const tense = TENSES.find(t => t.id === tenseId);
  const [activeTab, setActiveTab] = useState('formula');

  if (!tense) return null;

  const tabs = [
    { id: 'formula', label: 'Công Thức' },
    { id: 'usage', label: 'Cách Dùng' },
    { id: 'examples', label: 'Ví Dụ' }
  ];

  const FormulaRow = ({ label, formula, color }) => (
    <div className={`p-4 rounded-xl ${tense.light} border ${tense.border} mb-3`}>
      <div className={`text-xs font-bold uppercase tracking-wider ${tense.text} mb-2`}>{label}</div>
      {formula.split('\n').map((line, i) => (
        <div key={i} className="font-mono text-sm text-gray-700 font-semibold">{line}</div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title="" onBack={onBack} />

      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex items-center gap-4">
            <div style={gradientStyle(tense.gradient)} className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-bold text-xl">{tense.icon}</span>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Thì số {tense.icon}</div>
              <h1 className="text-gray-900 text-xl font-bold leading-tight">{tense.name}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{tense.englishName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? `${tense.text} border-b-2 ${tense.border}`
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'formula' && (
          <div>
            <FormulaRow label="Khẳng định (+)" formula={tense.formula.positive} />
            <FormulaRow label="Phủ định (-)" formula={tense.formula.negative} />
            <FormulaRow label="Nghi vấn (?)" formula={tense.formula.question} />

            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Từ nhận biết (Signal Words)</h3>
              <div className="flex flex-wrap gap-2">
                {tense.signals.map(s => (
                  <span key={s} className={`px-3 py-1.5 rounded-full text-sm font-medium ${tense.badge}`}>{s}</span>
                ))}
              </div>
            </div>

            {tense.note && (
              <div className="mt-5 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="text-xs font-bold uppercase tracking-wider text-yellow-700 mb-1">Lưu ý</div>
                <p className="text-sm text-yellow-800 leading-relaxed">{tense.note}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'usage' && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Dùng khi nào?</h3>
            <div className="grid gap-3">
              {tense.usage.map((u, i) => (
                <div key={i} className="flex gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full ${tense.badge} flex items-center justify-center text-xs font-bold`}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{u}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="grid gap-4">
            {tense.examples.map((ex, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className={`${tense.light} px-4 py-3 border-b ${tense.border}`}>
                  <p className={`font-semibold text-sm ${tense.text}`}>{ex.en}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-500">{ex.vi}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

window.Grammar = { GrammarListScreen, TenseDetailScreen, TENSES };
