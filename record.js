(function() {
  const c = document.getElementById('content');
  if (!c) return;
  document.title = '大会実績 | 東京農工大学将棋部';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = '東京農工大学将棋部の大会実績。年度別の大会成績一覧。春季/秋季団体戦の結果を掲載。';

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

  function extractHighlights(data, count) {
    const all = [];
    data.forEach(function(r) {
      r.entries.forEach(function(e) {
        all.push({ year: r.year, date: e.date, event: e.event, result: e.result, detail: e.detail, highlight: e.highlight });
      });
    });
    const gold = all.filter(function(e) { return e.highlight === 'gold'; }).slice(0, count);
    return gold.length ? gold : all.slice(0, count);
  }

  const h1 = document.createElement('h1');
  h1.textContent = '大会実績';
  c.appendChild(h1);

  const highlights = extractHighlights(records, 3);
  if (highlights.length) {
    const hs = document.createElement('div');
    hs.className = 'highlight-stats';
    highlights.forEach(function(h) {
      const card = document.createElement('div');
      card.className = 'highlight-stat-card';

      const label = document.createElement('div');
      label.className = 'highlight-stat-card-label highlight-stat-card-label--gold';
      label.textContent = h.result;

      const event = document.createElement('div');
      event.className = 'highlight-stat-card-event';
      event.textContent = h.event;

      const detail = document.createElement('div');
      detail.className = 'highlight-stat-card-detail';
      detail.textContent = h.date + ' / ' + h.detail;

      card.appendChild(label);
      card.appendChild(event);
      card.appendChild(detail);
      hs.appendChild(card);
    });
    c.appendChild(hs);
  }

  records.forEach(function(record) {
    const section = document.createElement('section');
    section.className = 'results-year';

    const h3 = document.createElement('h3');
    h3.textContent = record.label;

    const table = document.createElement('table');
    table.className = 'results-table';

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    ['大会名', '結果', '詳細'].forEach(function(text) {
      const th = document.createElement('th');
      th.textContent = text;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    record.entries.forEach(function(entry) {
      const tr = document.createElement('tr');

      const tdEvent = document.createElement('td');
      tdEvent.setAttribute('data-label', '大会名');
      tdEvent.textContent = entry.event;

      const tdResult = document.createElement('td');
      tdResult.setAttribute('data-label', '結果');
      if (entry.highlight === 'gold') {
        const span = document.createElement('span');
        span.className = 'record-label record-label--gold';
        span.textContent = entry.result;
        tdResult.appendChild(span);
      } else {
        tdResult.textContent = entry.result;
      }

      const tdDetail = document.createElement('td');
      tdDetail.setAttribute('data-label', '詳細');
      tdDetail.textContent = entry.date + ' / ' + entry.detail;

      tr.appendChild(tdEvent);
      tr.appendChild(tdResult);
      tr.appendChild(tdDetail);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    section.appendChild(h3);
    section.appendChild(table);
    c.appendChild(section);
  });
})();
