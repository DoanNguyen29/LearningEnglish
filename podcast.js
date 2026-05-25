const { useState } = React;
const { NavBar, gradientStyle } = window.UI;

const PODCASTS = [
  {
    id: 'bbc-6min',
    name: '6 Minute English',
    provider: 'BBC Learning English',
    description: 'Mỗi tập chỉ 6 phút, tập trung vào một chủ đề thời sự kèm theo giải thích từ vựng và cách dùng. Lý tưởng cho người học trung cấp.',
    level: 'Trung cấp',
    levelColor: 'bg-blue-100 text-blue-700',
    topic: 'Thời sự & Xã hội',
    topicColor: 'bg-indigo-100 text-indigo-700',
    icon: '🇬🇧',
    gradient: 'from-red-500 to-red-700',
    url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english',
    tips: 'Mỗi tập có transcript và từ vựng đi kèm. Nên nghe 2 lần: lần 1 để nắm ý chính, lần 2 để ghi từ mới.'
  },
  {
    id: 'bbc-english-we-speak',
    name: 'The English We Speak',
    provider: 'BBC Learning English',
    description: 'Mỗi tập ngắn (~3 phút) giới thiệu một cụm từ thông dụng, thành ngữ hoặc tiếng lóng mà người Anh dùng trong cuộc sống hằng ngày.',
    level: 'Trung - Cao cấp',
    levelColor: 'bg-orange-100 text-orange-700',
    topic: 'Thành ngữ & Tiếng lóng',
    topicColor: 'bg-pink-100 text-pink-700',
    icon: '🗣️',
    gradient: 'from-pink-500 to-rose-600',
    url: 'https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak',
    tips: 'Nghe xong hãy tự đặt 2-3 câu dùng cụm từ vừa học. Đây là cách tốt nhất để ghi nhớ thành ngữ lâu dài.'
  },
  {
    id: 'voa-learning',
    name: 'VOA Learning English',
    provider: 'Voice of America',
    description: 'Tin tức thế giới được đọc chậm và rõ ràng, dành riêng cho người học tiếng Anh. Nội dung cập nhật hàng ngày.',
    level: 'Sơ - Trung cấp',
    levelColor: 'bg-green-100 text-green-700',
    topic: 'Tin tức Thế giới',
    topicColor: 'bg-emerald-100 text-emerald-700',
    icon: '🇺🇸',
    gradient: 'from-blue-600 to-blue-800',
    url: 'https://learningenglish.voanews.com',
    tips: 'Phần "Everyday Grammar" và "Words and Their Stories" rất hữu ích cho người học ngữ pháp và từ vựng.'
  },
  {
    id: 'cnn10',
    name: 'CNN 10',
    provider: 'CNN',
    description: 'Bản tin 10 phút mỗi ngày tóm tắt các sự kiện thế giới quan trọng, dùng tiếng Anh rõ ràng phù hợp cho người học trung cấp trở lên.',
    level: 'Trung cấp',
    levelColor: 'bg-blue-100 text-blue-700',
    topic: 'Tin tức Thế giới',
    topicColor: 'bg-emerald-100 text-emerald-700',
    icon: '📺',
    gradient: 'from-red-600 to-red-800',
    url: 'https://edition.cnn.com/cnn10',
    tips: 'Bật phụ đề tiếng Anh, xem 2 lần: lần đầu không phụ đề để luyện nghe, lần hai bật phụ đề để kiểm tra.'
  },
  {
    id: 'eslpod',
    name: 'ESL Podcast',
    provider: 'ESLPod.com',
    description: 'Podcast với các đoạn hội thoại hàng ngày, được giải thích chi tiết từng cụm từ và thành ngữ. Phong cách học rất rõ ràng và có phương pháp.',
    level: 'Trung cấp',
    levelColor: 'bg-blue-100 text-blue-700',
    topic: 'Hội thoại hàng ngày',
    topicColor: 'bg-purple-100 text-purple-700',
    icon: '🎙️',
    gradient: 'from-purple-500 to-purple-700',
    url: 'https://www.eslpod.com',
    tips: 'Tải script về để đọc theo khi nghe. Cố gắng nhại lại cách phát âm và ngữ điệu của diễn giả.'
  },
  {
    id: 'culips',
    name: 'Culips Everyday English',
    provider: 'Culips',
    description: 'Podcast hội thoại tự nhiên giữa người Canada với nhiều chủ đề quen thuộc: công việc, du lịch, ẩm thực, cuộc sống. Giải thích rõ từ vựng và ngữ pháp.',
    level: 'Trung cấp',
    levelColor: 'bg-blue-100 text-blue-700',
    topic: 'Hội thoại hàng ngày',
    topicColor: 'bg-purple-100 text-purple-700',
    icon: '🍁',
    gradient: 'from-amber-500 to-orange-600',
    url: 'https://culips.com',
    tips: 'Chú ý cách người Canada dùng "eh" và các cụm từ đặc trưng. Lắng nghe tốc độ nói thực tế để làm quen với nhịp điệu tiếng Anh.'
  },
  {
    id: 'all-ears',
    name: 'All Ears English',
    provider: 'Lindsay McMahon & Michelle Kaplan',
    description: 'Tập trung vào tiếng Anh tự nhiên, thực tế trong giao tiếp hàng ngày. Các host người Mỹ nói chuyện thân thiện và sử dụng nhiều thành ngữ hiện đại.',
    level: 'Trung - Cao cấp',
    levelColor: 'bg-orange-100 text-orange-700',
    topic: 'Tiếng Anh giao tiếp',
    topicColor: 'bg-amber-100 text-amber-700',
    icon: '👂',
    gradient: 'from-orange-500 to-orange-700',
    url: 'https://www.allearsenglish.com',
    tips: 'Lắng nghe cách họ dùng "connected speech" (nối âm) để bắt chước phong cách nói chuyện tự nhiên của người Mỹ.'
  },
  {
    id: 'business-english-pod',
    name: 'Business English Pod',
    provider: 'BusinessEnglishPod.com',
    description: 'Chuyên về tiếng Anh thương mại: họp hành, thuyết trình, đàm phán, email công việc. Phù hợp cho người đi làm muốn nâng cao tiếng Anh chuyên nghiệp.',
    level: 'Trung - Cao cấp',
    levelColor: 'bg-orange-100 text-orange-700',
    topic: 'Tiếng Anh thương mại',
    topicColor: 'bg-sky-100 text-sky-700',
    icon: '💼',
    gradient: 'from-sky-600 to-blue-700',
    url: 'https://www.businessenglishpod.com',
    tips: 'Luyện theo từng tình huống cụ thể: họp, email, điện thoại. Ghi chép các cụm từ chuyên nghiệp để dùng ngay trong công việc.'
  },
  {
    id: 'ted-talks',
    name: 'TED Talks',
    provider: 'TED',
    description: 'Bài nói chuyện truyền cảm hứng từ các chuyên gia hàng đầu thế giới về mọi lĩnh vực. Chất lượng tiếng Anh học thuật cao, ngôn ngữ phong phú.',
    level: 'Cao cấp',
    levelColor: 'bg-red-100 text-red-700',
    topic: 'Kiến thức & Cảm hứng',
    topicColor: 'bg-rose-100 text-rose-700',
    icon: '💡',
    gradient: 'from-red-600 to-pink-600',
    url: 'https://www.ted.com/talks',
    tips: 'Bật phụ đề tiếng Anh thay vì tiếng Việt. Sau khi xem, thử tóm tắt lại nội dung bằng tiếng Anh trong 3-5 câu.'
  },
  {
    id: 'lukes-english',
    name: "Luke's English Podcast",
    provider: 'Luke Thompson',
    description: 'Podcast từ một giáo viên tiếng Anh người Anh với nội dung đa dạng: văn hóa Anh, hài hước, ngôn ngữ học. Phong cách tự nhiên, gần gũi.',
    level: 'Trung - Cao cấp',
    levelColor: 'bg-orange-100 text-orange-700',
    topic: 'Văn hóa & Ngôn ngữ',
    topicColor: 'bg-teal-100 text-teal-700',
    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    gradient: 'from-teal-500 to-teal-700',
    url: 'https://teacherluke.co.uk',
    tips: 'Các tập "phrasal verbs" và "British culture" rất hay. Phù hợp nếu bạn muốn học giọng Anh-Anh.'
  },
  {
    id: 'grammar-girl',
    name: 'Grammar Girl',
    provider: 'Mignon Fogarty / Quick and Dirty Tips',
    description: 'Giải thích ngữ pháp tiếng Anh theo cách đơn giản, thú vị và dễ nhớ. Mỗi tập ngắn tập trung vào một điểm ngữ pháp hoặc cách dùng từ thường bị nhầm lẫn.',
    level: 'Mọi cấp độ',
    levelColor: 'bg-gray-100 text-gray-700',
    topic: 'Ngữ pháp',
    topicColor: 'bg-violet-100 text-violet-700',
    icon: '📖',
    gradient: 'from-violet-500 to-indigo-600',
    url: 'https://www.quickanddirtytips.com/grammar-girl',
    tips: 'Lý tưởng để tra cứu các điểm ngữ pháp hay nhầm (affect/effect, who/whom...). Nghe mỗi khi bạn phân vân về một cấu trúc.'
  },
  {
    id: 'speak-naturally',
    name: 'Speak English Naturally',
    provider: 'RealLife English',
    description: 'Tập trung vào cách người bản xứ thực sự nói chuyện trong cuộc sống hàng ngày, không phải tiếng Anh "sách giáo khoa".',
    level: 'Trung cấp',
    levelColor: 'bg-blue-100 text-blue-700',
    topic: 'Tiếng Anh tự nhiên',
    topicColor: 'bg-cyan-100 text-cyan-700',
    icon: '🌍',
    gradient: 'from-cyan-500 to-cyan-700',
    url: 'https://reallifeglobal.com/podcast',
    tips: 'Chú ý các cụm từ lóng (slang) và cách rút gọn trong hội thoại thực tế như "gonna", "wanna", "kinda".'
  },
  {
    id: 'english-class101',
    name: 'EnglishClass101',
    provider: 'Innovative Language',
    description: 'Khóa học tiếng Anh có cấu trúc rõ ràng từ sơ cấp đến nâng cao, mỗi tập tập trung vào một điểm ngữ pháp hoặc tình huống giao tiếp cụ thể.',
    level: 'Mọi cấp độ',
    levelColor: 'bg-gray-100 text-gray-700',
    topic: 'Học có cấu trúc',
    topicColor: 'bg-violet-100 text-violet-700',
    icon: '📚',
    gradient: 'from-violet-500 to-violet-700',
    url: 'https://www.englishclass101.com',
    tips: 'Bắt đầu từ level phù hợp với trình độ. Làm flashcard với từ mới từng tập ngay sau khi nghe.'
  },
  {
    id: 'stuff-you-should-know',
    name: 'Stuff You Should Know',
    provider: 'iHeartRadio / Josh Clark & Chuck Bryant',
    description: 'Hai người Mỹ nói chuyện tự nhiên về đủ mọi chủ đề thú vị: khoa học, lịch sử, văn hóa đại chúng. Tốc độ nói nhanh, từ vựng phong phú, rất thực tế.',
    level: 'Cao cấp',
    levelColor: 'bg-red-100 text-red-700',
    topic: 'Kiến thức Tổng quát',
    topicColor: 'bg-yellow-100 text-yellow-700',
    icon: '🧠',
    gradient: 'from-slate-600 to-gray-800',
    url: 'https://www.iheart.com/podcast/105-stuff-you-should-know-26940277',
    tips: 'Không có giải thích từ vựng — đây là immersion thuần túy. Hãy nghe thụ động trước, sau đó ghi lại từ không hiểu để tra cứu.'
  },
  {
    id: 'elementary-podcasts',
    name: 'Elementary Podcasts',
    provider: 'British Council',
    description: 'Series podcast dành cho người mới bắt đầu đến trung cấp. Hội thoại chậm rõ ràng kèm bài tập nghe, từ vựng và ngữ pháp miễn phí đi kèm.',
    level: 'Sơ - Trung cấp',
    levelColor: 'bg-green-100 text-green-700',
    topic: 'Học có cấu trúc',
    topicColor: 'bg-violet-100 text-violet-700',
    icon: '🏛️',
    gradient: 'from-blue-400 to-cyan-500',
    url: 'https://learnenglish.britishcouncil.org/general-english/audio-zone/elementary-podcasts',
    tips: 'Làm bài tập đi kèm trên website sau mỗi tập. British Council có transcript đầy đủ — đọc song song khi nghe lần 2.'
  },
  {
    id: 'coffee-break-english',
    name: 'Coffee Break English',
    provider: 'Radio Lingua Network',
    description: 'Học tiếng Anh từng bước từ sơ cấp đến nâng cao, mỗi tập ngắn và dễ tiêu hóa như một ly cà phê buổi sáng. Giáo viên người Scotland giải thích rõ ràng.',
    level: 'Sơ - Trung cấp',
    levelColor: 'bg-green-100 text-green-700',
    topic: 'Học từng bước',
    topicColor: 'bg-amber-100 text-amber-700',
    icon: '☕',
    gradient: 'from-amber-600 to-yellow-700',
    url: 'https://coffeebreaklanguages.com/coffeebreakEnglish/',
    tips: 'Nghe vào buổi sáng khi đang uống cà phê hoặc di chuyển. Tính nhất quán quan trọng hơn thời lượng — nghe mỗi ngày một tập.'
  },
  {
    id: 'american-english-podcast',
    name: 'American English Podcast',
    provider: 'Shana Thompson',
    description: 'Tập trung vào phát âm, ngữ điệu và giọng Mỹ chuẩn. Giải thích chi tiết cách người Mỹ nối âm, nuốt âm và các đặc trưng phát âm thực tế.',
    level: 'Trung - Cao cấp',
    levelColor: 'bg-orange-100 text-orange-700',
    topic: 'Phát âm & Giọng Mỹ',
    topicColor: 'bg-rose-100 text-rose-700',
    icon: '🎤',
    gradient: 'from-rose-500 to-pink-600',
    url: 'https://www.americanenglishpodcast.com',
    tips: 'Dừng lại và nhại lại từng câu ngay sau khi nghe. Ghi âm bản thân rồi so sánh với bản gốc để nhận ra điểm cần cải thiện.'
  },
  {
    id: 'accents-way',
    name: "Accent's Way English with Hadar",
    provider: 'Hadar Shemesh',
    description: 'Giáo viên người Israel chia sẻ hành trình tự học giọng Mỹ. Podcast giúp bạn nói tiếng Anh tự tin hơn, tập trung vào phát âm và tư duy bằng tiếng Anh.',
    level: 'Trung - Cao cấp',
    levelColor: 'bg-orange-100 text-orange-700',
    topic: 'Phát âm & Giọng Mỹ',
    topicColor: 'bg-fuchsia-100 text-fuchsia-700',
    icon: '🎵',
    gradient: 'from-fuchsia-500 to-purple-600',
    url: 'https://theaccentsway.com/podcast/',
    tips: 'Phù hợp nếu bạn đã học tiếng Anh lâu nhưng vẫn ngại nói. Hadar chia sẻ mindset rất hay về việc vượt qua rào cản tâm lý khi nói.'
  },
  {
    id: 'english-with-lucy',
    name: 'English with Lucy',
    provider: 'Lucy Earl',
    description: 'Cô giáo người Anh trẻ chia sẻ về ngữ pháp, từ vựng, văn hóa Anh và các mẹo học tiếng Anh thực tế. Phong cách thân thiện, giải thích dễ hiểu.',
    level: 'Trung cấp',
    levelColor: 'bg-blue-100 text-blue-700',
    topic: 'Văn hóa & Ngôn ngữ',
    topicColor: 'bg-pink-100 text-pink-700',
    icon: '🌸',
    gradient: 'from-pink-400 to-rose-500',
    url: 'https://www.englishwithlucy.co.uk',
    tips: 'Kênh YouTube đi kèm rất hữu ích để học qua video. Tập trung vào các tập so sánh giọng Anh-Anh và Anh-Mỹ nếu bạn đang chọn accent.'
  },
  {
    id: 'this-american-life',
    name: 'This American Life',
    provider: 'NPR / Ira Glass',
    description: 'Chương trình kể chuyện radio nổi tiếng nhất nước Mỹ. Mỗi tập là một chủ đề với nhiều câu chuyện thật về con người. Tiếng Anh cực kỳ tự nhiên và sâu sắc.',
    level: 'Cao cấp',
    levelColor: 'bg-red-100 text-red-700',
    topic: 'Kể chuyện & Văn hóa',
    topicColor: 'bg-indigo-100 text-indigo-700',
    icon: '🎭',
    gradient: 'from-indigo-600 to-blue-700',
    url: 'https://www.thisamericanlife.org',
    tips: 'Đọc transcript trên website khi nghe. Đây là immersion thuần túy — không học mà vẫn học được rất nhiều nếu nghe thường xuyên.'
  },
  {
    id: 'the-daily',
    name: 'The Daily',
    provider: 'The New York Times / Michael Barbaro',
    description: 'Bản tin sâu 20-30 phút mỗi ngày từ NYT về một sự kiện quan trọng. Giọng đọc chuyên nghiệp, cấu trúc câu phức tạp, từ vựng báo chí cao cấp.',
    level: 'Cao cấp',
    levelColor: 'bg-red-100 text-red-700',
    topic: 'Tin tức Thế giới',
    topicColor: 'bg-gray-100 text-gray-700',
    icon: '📰',
    gradient: 'from-gray-700 to-gray-900',
    url: 'https://www.nytimes.com/column/the-daily',
    tips: 'Đọc bài báo liên quan trên NYT trước khi nghe để có ngữ cảnh. Giúp xây dựng từ vựng báo chí và cách phân tích sự kiện bằng tiếng Anh.'
  },
  {
    id: 'serial',
    name: 'Serial',
    provider: 'Sarah Koenig / This American Life',
    description: 'Podcast điều tra tội phạm (true crime) đình đám nhất thế giới. Lối kể chuyện cuốn hút, ngôn ngữ tường thuật phong phú, phát âm rất chuẩn.',
    level: 'Cao cấp',
    levelColor: 'bg-red-100 text-red-700',
    topic: 'True Crime & Kể chuyện',
    topicColor: 'bg-stone-100 text-stone-700',
    icon: '🔍',
    gradient: 'from-stone-600 to-neutral-800',
    url: 'https://serialpodcast.org',
    tips: 'Bắt đầu từ Season 1 — câu chuyện hấp dẫn đến mức bạn sẽ không nhận ra mình đang "học". Đây là cách tốt nhất để tạo thói quen nghe tiếng Anh.'
  },
  {
    id: 'radiolab',
    name: 'Radiolab',
    provider: 'WNYC Studios',
    description: 'Khám phá khoa học, triết học và nhân văn qua những câu chuyện được dàn dựng công phu. Từ vựng học thuật phong phú, cách diễn đạt sáng tạo và sâu sắc.',
    level: 'Cao cấp',
    levelColor: 'bg-red-100 text-red-700',
    topic: 'Khoa học & Triết học',
    topicColor: 'bg-green-100 text-green-700',
    icon: '🔬',
    gradient: 'from-green-600 to-teal-700',
    url: 'https://radiolab.org',
    tips: 'Nghe các tập ngắn (dưới 20 phút) trước. Đây là podcast phù hợp cho những ai muốn học từ vựng học thuật một cách tự nhiên.'
  },
  {
    id: 'freakonomics',
    name: 'Freakonomics Radio',
    provider: 'Stephen Dubner',
    description: 'Phân tích kinh tế và xã hội theo góc nhìn độc đáo, phi truyền thống. Giọng nói chuyên nghiệp, lập luận logic chặt chẽ, từ vựng kinh tế và xã hội học phong phú.',
    level: 'Cao cấp',
    levelColor: 'bg-red-100 text-red-700',
    topic: 'Kinh tế & Xã hội',
    topicColor: 'bg-lime-100 text-lime-700',
    icon: '📊',
    gradient: 'from-lime-600 to-green-700',
    url: 'https://freakonomics.com/podcast/',
    tips: 'Chú ý cách diễn giả xây dựng lập luận bằng tiếng Anh. Học cách dùng từ nối (however, therefore, in contrast...) qua podcast này rất hiệu quả.'
  },
  {
    id: 'conan-podcast',
    name: "Conan O'Brien Needs a Friend",
    provider: "Conan O'Brien",
    description: 'Talk show hài hước của danh hài Conan O\'Brien. Ngôn ngữ rất tự nhiên, nhiều slang và cách nói chuyện vui vẻ của người Mỹ. Nghe mà cười sảng khoái.',
    level: 'Cao cấp',
    levelColor: 'bg-red-100 text-red-700',
    topic: 'Hài hước & Giải trí',
    topicColor: 'bg-orange-100 text-orange-700',
    icon: '😂',
    gradient: 'from-orange-400 to-amber-500',
    url: 'https://www.earwolf.com/show/conan-obrien-needs-a-friend/',
    tips: 'Không phải để học ngữ pháp — mà để tận hưởng và làm quen với humor, sarcasm của người Mỹ. Hiểu được các joke tiếng Anh là dấu hiệu trình độ đã rất cao.'
  },
  {
    id: 'hbr-ideacast',
    name: 'HBR IdeaCast',
    provider: 'Harvard Business Review',
    description: 'Phỏng vấn các nhà lãnh đạo, giáo sư và chuyên gia hàng đầu về quản trị, lãnh đạo và kinh doanh. Tiếng Anh học thuật và kinh doanh cao cấp.',
    level: 'Cao cấp',
    levelColor: 'bg-red-100 text-red-700',
    topic: 'Tiếng Anh thương mại',
    topicColor: 'bg-red-100 text-red-700',
    icon: '🏢',
    gradient: 'from-red-700 to-red-900',
    url: 'https://hbr.org/2018/01/podcast-ideacast',
    tips: 'Phù hợp cho người đi làm ở môi trường quốc tế. Ghi chép các cụm từ leadership và management để dùng trong email và meeting.'
  },
  {
    id: 'the-indicator',
    name: 'The Indicator',
    provider: 'NPR / Planet Money',
    description: 'Mỗi ngày một khái niệm kinh tế thú vị được giải thích trong 10 phút. Ngắn gọn, súc tích, từ vựng kinh tế tài chính thực tế được dùng tự nhiên.',
    level: 'Trung - Cao cấp',
    levelColor: 'bg-orange-100 text-orange-700',
    topic: 'Kinh tế & Tài chính',
    topicColor: 'bg-teal-100 text-teal-700',
    icon: '📈',
    gradient: 'from-teal-600 to-cyan-700',
    url: 'https://www.npr.org/podcasts/510325/the-indicator-from-planet-money',
    tips: 'Nghe mỗi sáng như đọc tin tức. Chỉ 10 phút nhưng học được cách người Mỹ bàn về kinh tế, số liệu và xu hướng thị trường.'
  },
  {
    id: 'science-vs',
    name: 'Science Vs',
    provider: 'Spotify / Wendy Zukerman',
    description: 'Kiểm chứng các xu hướng và quan niệm phổ biến bằng khoa học thực sự. Giọng dẫn chương trình năng động, hài hước, từ vựng khoa học dễ tiêu hóa.',
    level: 'Cao cấp',
    levelColor: 'bg-red-100 text-red-700',
    topic: 'Khoa học',
    topicColor: 'bg-emerald-100 text-emerald-700',
    icon: '🧪',
    gradient: 'from-emerald-500 to-green-600',
    url: 'https://gimletmedia.com/shows/science-vs',
    tips: 'Chọn chủ đề bạn quan tâm để dễ theo dõi hơn. Cách Wendy đặt câu hỏi và dẫn dắt lập luận là mẫu tuyệt vời để học tiếng Anh học thuật.'
  },
  {
    id: 'elllo',
    name: 'ELLLO - English Listening Library',
    provider: 'ELLLO.org',
    description: 'Thư viện nghe miễn phí với hơn 3,000 bài luyện nghe cho mọi trình độ từ A1 đến C1. Mỗi bài có audio/video, transcript đầy đủ, từ vựng và bài tập tương tác.',
    level: 'Mọi cấp độ',
    levelColor: 'bg-gray-100 text-gray-700',
    topic: 'Luyện nghe toàn diện',
    topicColor: 'bg-sky-100 text-sky-700',
    icon: '🎓',
    gradient: 'from-sky-500 to-blue-600',
    url: 'https://www.elllo.org',
    tips: 'Chọn đúng cấp độ CEFR của mình (A1–C1) để không quá dễ hay quá khó. Làm bài quiz sau mỗi bài nghe để kiểm tra độ hiểu ngay lập tức.'
  },
  {
    id: 'elllo-one-minute',
    name: 'One Minute English',
    provider: 'ELLLO.org',
    description: 'Series video ngắn 1 phút: một người bản xứ trả lời một câu hỏi đơn giản. Có speakers từ nhiều quốc gia khác nhau, giúp làm quen với nhiều giọng nói.',
    level: 'Sơ - Trung cấp',
    levelColor: 'bg-green-100 text-green-700',
    topic: 'Luyện nghe nhiều giọng',
    topicColor: 'bg-cyan-100 text-cyan-700',
    icon: '⏱️',
    gradient: 'from-cyan-500 to-sky-600',
    url: 'https://www.elllo.org/english/Mixer/',
    tips: 'Cố gắng nghe không nhìn transcript lần đầu, sau đó đọc transcript để kiểm tra. Nghe nhiều giọng khác nhau (Anh, Mỹ, Úc, châu Á) giúp cải thiện khả năng nghe hiểu thực tế rất nhiều.'
  },
  {
    id: 'elllo-english-views',
    name: 'English Views',
    provider: 'ELLLO.org',
    description: 'Hơn 1,500 đoạn hội thoại tự nhiên giữa những người từ nhiều nước, bàn về các chủ đề đời thường. Được phân loại theo cấp độ và có transcript, quiz đi kèm.',
    level: 'Trung cấp',
    levelColor: 'bg-blue-100 text-blue-700',
    topic: 'Hội thoại tự nhiên',
    topicColor: 'bg-indigo-100 text-indigo-700',
    icon: '🌐',
    gradient: 'from-indigo-500 to-blue-600',
    url: 'https://www.elllo.org/english/Views/',
    tips: 'Chú ý sự khác biệt giữa các giọng nói từ nhiều quốc gia. Luyện nghe quen với accent không phải Mỹ hay Anh cũng rất quan trọng trong giao tiếp thực tế.'
  }
];

const LEVELS = ['Tất cả', 'Sơ - Trung cấp', 'Trung cấp', 'Trung - Cao cấp', 'Cao cấp', 'Mọi cấp độ'];

const PodcastScreen = ({ onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState('Tất cả');
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const filtered = selectedLevel === 'Tất cả'
    ? PODCASTS
    : PODCASTS.filter(p => p.level === selectedLevel);

  if (selectedPodcast) {
    const p = PODCASTS.find(x => x.id === selectedPodcast);
    return (
      <div className="min-h-screen bg-gray-50 pb-10">
        <NavBar title="" onBack={() => setSelectedPodcast(null)} />

        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
            <div className="flex items-center gap-4">
              <div style={gradientStyle(p.gradient)} className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-3xl">{p.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-gray-900 text-xl font-bold leading-tight">{p.name}</h1>
                <p className="text-gray-500 text-sm mt-0.5">{p.provider}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.levelColor}`}>{p.level}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.topicColor}`}>{p.topic}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Mô tả</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{p.description}</p>
          </div>

          <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-5 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-700 mb-2">Mẹo học hiệu quả</h3>
            <p className="text-sm text-yellow-800 leading-relaxed">{p.tips}</p>
          </div>

          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...gradientStyle(p.gradient, '90deg'), color: '#fff' }}
            className="block w-full text-center font-bold py-4 rounded-2xl shadow-lg"
          >
            Mở Podcast →
          </a>

          <p className="text-center text-xs text-gray-400 mt-3">Sẽ mở trang web bên ngoài trong tab mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <NavBar title="Luyện Nghe - Podcast" onBack={onBack} />

      <div className="max-w-2xl mx-auto px-4 py-5">
        <div className="mb-5 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex gap-3 items-start">
            <span className="text-2xl">🎧</span>
            <div>
              <p className="text-sm font-semibold text-gray-700">Luyện nghe qua Podcast thực tế</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">Nghe podcast tiếng Anh là cách hiệu quả nhất để cải thiện kỹ năng nghe và làm quen với cách nói chuyện tự nhiên của người bản xứ.</p>
            </div>
          </div>
        </div>

        <div className="mb-5 overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {LEVELS.map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedLevel === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPodcast(p.id)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all overflow-hidden"
            >
              <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                <div style={gradientStyle(p.gradient)} className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-2xl">{p.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-800 font-bold text-sm truncate">{p.name}</div>
                  <div className="text-gray-500 text-xs truncate mt-0.5">{p.provider}</div>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.levelColor}`}>{p.level}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.topicColor}`}>{p.topic}</span>
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
              <div className="px-4 pb-3">
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <div className="text-3xl mb-2">😅</div>
            <p className="text-sm">Không tìm thấy podcast ở cấp độ này</p>
          </div>
        )}
      </div>
    </div>
  );
};

window.Podcast = { PodcastScreen };
