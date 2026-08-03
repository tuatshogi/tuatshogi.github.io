(function () {
  const c = document.getElementById('content');
  if (!c) return;
  document.title = '活動紹介 | 東京農工大学将棋部';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = '東京農工大学将棋部の活動紹介。活動日時・場所、活動内容、雰囲気を紹介。初心者から有段者まで大歓迎。';

  const h1 = document.createElement('h1');
  h1.textContent = '活動紹介';
  c.appendChild(h1);

  const lead = document.createElement('p');
  lead.textContent = '東京農工大学将棋部では、初心者から有段者まで幅広いメンバーが将棋を楽しんでいます。兼部も自由で、自分のペースで活動できます。';
  c.appendChild(lead);

  const INFO = [
    { icon: '📅', label: '活動日', value: '毎週金曜日' },
    { icon: '📍', label: '活動場所', value: '小金井キャンパス サークル棟B棟' },
    { icon: '📋', label: '活動内容', value: '自由対局・感想戦・詰将棋研究・他大学との交流戦 等' },
    { icon: '👥', label: '雰囲気', value: '初心者から有段者まで大歓迎。兼部自由。自分のペースで活動できます。' },
  ];

  const infoList = document.createElement('div');
  infoList.className = 'info-list';
  INFO.forEach(function (item) {
    const row = document.createElement('div');
    row.className = 'info-row';

    const icon = document.createElement('span');
    icon.className = 'info-row-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = item.icon;

    const label = document.createElement('span');
    label.className = 'info-row-label';
    label.textContent = item.label;

    const value = document.createElement('span');
    value.className = 'info-row-value';
    value.textContent = item.value;

    row.appendChild(icon);
    row.appendChild(label);
    row.appendChild(value);
    infoList.appendChild(row);
  });
  c.appendChild(infoList);

  const h2 = document.createElement('h2');
  h2.textContent = 'フォトギャラリー';
  c.appendChild(h2);

  const photos = [
    { src: '20260709_180604.jpg', alt: '部室での活動風景 — 盤駒を囲む部員たち' },
    { src: '20260524_191148.jpg', alt: '大会参加時の集合写真' },
  ];

  const galleryDiv = document.createElement('div');
  galleryDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:var(--space-lg);margin-bottom:var(--space-xl)';
  photos.forEach(function (p) {
    const card = document.createElement('div');
    card.className = 'photo-card';

    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.alt;

    card.appendChild(img);
    galleryDiv.appendChild(card);
  });
  c.appendChild(galleryDiv);
})();
