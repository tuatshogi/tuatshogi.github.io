(function() {
  const c = document.getElementById('content');
  if (!c) return;
  document.title = '大会記録 | 東京農工大学将棋部';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = '東京農工大学将棋部の大会記録。年度別の大会成績一覧。春季/秋季団体戦の結果を掲載。';

  const h1 = document.createElement('h1');
  h1.textContent = '大会記録';
  c.appendChild(h1);

  const records = [
    {
      year: 2026,
      label: '2026年度',
      entries: [
        { date: '2026.05.24', event: '春季団体戦C級2組', result: '準優勝', detail: '6勝1敗でC1級へ昇級', highlight: 'gold' }
      ]
    },
    {
      year: 2024,
      label: '2024年度',
      entries: [
        { date: '2024.10.20', event: '秋季団体戦B2級', result: '5位', detail: '残留', highlight: null },
        { date: '2024.05.19', event: '春季団体戦B2級', result: '3位', detail: '2期連続', highlight: null }
      ]
    }
  ];

  records.forEach(function(record) {
    const section = document.createElement('section');
    section.id = 'section-year-' + record.year;

    const hr = document.createElement('hr');
    section.appendChild(hr);

    const h2 = document.createElement('h2');
    h2.textContent = record.label;
    section.appendChild(h2);

    record.entries.forEach(function(entry) {
      const p = document.createElement('p');
      if (entry.highlight === 'gold') {
        const label = document.createElement('span');
        label.className = 'record-label record-label--gold';
        label.textContent = entry.result;
        p.innerHTML = entry.date + ' ' + entry.event + ' ';
        p.appendChild(label);
        p.appendChild(document.createElement('br'));
        p.appendChild(document.createTextNode(entry.detail));
      } else {
        p.innerHTML = entry.date + '<br>' + entry.event + '　' + entry.result + '<br>' + entry.detail;
      }
      section.appendChild(p);
    });

    c.appendChild(section);
  });
})();
