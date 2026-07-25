(function() {
  const c = document.getElementById('content');
  if (!c) return;
  document.title = '入部案内 | 東京農工大学将棋部';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = '東京農工大学将棋部の入部案内。新入生・経験者向け入部案内。活動場所・内容、部費無料、入部方法を掲載。';

  const s1 = document.createElement('section');
  s1.id = 'section-entry-top';
  const h1 = document.createElement('h1');
  h1.textContent = '入部案内';
  s1.appendChild(h1);
  c.appendChild(s1);

  const sections = [
    {
      id: 'section-for-newstudents',
      h2: '新入生の方へ',
      body: '新入生の皆さん。入学おめでとうございます！<br>当将棋部には、全国大会を目指している人から単に趣味として将棋を楽しむ人まで、様々な部員がいます。初心者から有段者まで大歓迎です。<br>大学から将棋を始めて卒業までに有段者になる部員もいます！<br>興味がある方は、XのDMまでお気軽にご連絡ください！'
    },
    {
      id: 'section-location',
      h2: '活動場所',
      body: '普段は小金井キャンパス欅寮近くのサークル棟B棟の部室にて活動を行っています。'
    },
    {
      id: 'section-activities',
      h2: '活動内容',
      body: '毎週金曜日の活動日に部員同士で指したり、棋譜並べ・詰将棋、変則将棋の研究等を行ったりしています。<br>また、一年通してさまざまな大会や部内戦等のイベントがあります。<br>詳細は活動紹介や各種SNSをご覧ください！'
    },
    {
      id: 'section-fee',
      h2: '部費',
      body: '部費はありません。'
    },
    {
      id: 'section-join',
      h2: '入部方法',
      body: '<strong>新入部員募集</strong><br>将棋部に入部して将棋部のDiscordサーバーに参加して、新歓イベントや活動に参加しましょう。<br>セキュリティの観点から、当サイトでは招待リンクを一般公開していません。代わりに、以下いずれかの方法で参加することができます。<br><strong>将棋部の公式X(旧Twitter)にDMで連絡する</strong><br><strong>部員に声をかける</strong><br>みなさんの参加をお待ちしています！'
    },
    {
      id: 'section-other',
      h2: 'その他',
      body: '兼部は自由です。実際に掛け持ちをしている部員も多くいます。'
    }
  ];

  sections.forEach(function(sec) {
    const section = document.createElement('section');
    section.id = sec.id;

    const hr = document.createElement('hr');
    section.appendChild(hr);

    const h2 = document.createElement('h2');
    h2.textContent = sec.h2;
    section.appendChild(h2);

    const p = document.createElement('p');
    p.innerHTML = sec.body;
    section.appendChild(p);

    c.appendChild(section);
  });
})();
