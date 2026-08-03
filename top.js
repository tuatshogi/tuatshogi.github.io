(function() {
  const c = document.getElementById('content');
  if (!c) return;
  document.title = '東京農工大学将棋部';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = '東京農工大学将棋部の公式Webサイト。活動日時・場所、大会成績、入部案内を掲載。初心者・経験者問わず大歓迎。';

  const hero = document.createElement('div');
  hero.className = 'hero bg-grid';
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';

  const h1Hero = document.createElement('h1');
  h1Hero.className = 'hero-title';
  h1Hero.textContent = '東京農工大学将棋部';

  const subtitle = document.createElement('p');
  subtitle.className = 'hero-subtitle';
  subtitle.textContent = '初心者から有段者まで、将棋を愛する仲間が集う場所';

  const cta = document.createElement('a');
  cta.className = 'hero-cta';
  cta.textContent = '新入生募集中';
  cta.href = 'entry.html';
  cta.addEventListener('click', function(e) {
    e.preventDefault();
    loadPage('entry.html');
  });

  heroContent.appendChild(h1Hero);
  heroContent.appendChild(subtitle);
  heroContent.appendChild(cta);
  hero.appendChild(heroContent);
  c.appendChild(hero);

  const h2 = document.createElement('h2');
  h2.textContent = 'お知らせ';
  c.appendChild(h2);

  const NEWS = [
    { date: '2026.05.24', tag: 'お知らせ', title: '春季団体戦C級2組で準優勝しました', href: 'record.html' },
  ];

  const newsList = document.createElement('div');
  newsList.className = 'news-list';
  NEWS.forEach(function(item) {
    const row = document.createElement('a');
    row.className = 'news-item';
    row.href = item.href;
    row.addEventListener('click', function(e) {
      e.preventDefault();
      loadPage(item.href);
    });

    const date = document.createElement('span');
    date.className = 'news-item-date';
    date.textContent = item.date;

    const tag = document.createElement('span');
    tag.className = 'news-item-tag';
    tag.textContent = item.tag;

    const title = document.createElement('span');
    title.className = 'news-item-title';
    title.textContent = item.title;

    row.appendChild(date);
    row.appendChild(tag);
    row.appendChild(title);
    newsList.appendChild(row);
  });
  c.appendChild(newsList);

  const NAV_CARDS = [
    { label: '活動紹介', href: 'introduce.html', icon: 'M20 4 L28 14 L24 28 L16 28 L12 14 Z' },
    { label: '大会実績', href: 'record.html', icon: 'M20 4 L28 14 L24 28 L16 28 L12 14 Z' },
  ];

  const iconNav = document.createElement('div');
  iconNav.className = 'icon-nav';
  NAV_CARDS.forEach(function(card) {
    const el = document.createElement('a');
    el.className = 'icon-nav-card';
    el.href = card.href;
    el.addEventListener('click', function(e) {
      e.preventDefault();
      loadPage(card.href);
    });

    const icon = document.createElement('div');
    icon.className = 'icon-nav-card-icon';
    icon.innerHTML = '<svg viewBox="0 0 40 40" width="40" height="40" fill="currentColor" aria-hidden="true"><path d="' + card.icon + '"/></svg>';

    const label = document.createElement('span');
    label.className = 'icon-nav-card-label';
    label.textContent = card.label;

    el.appendChild(icon);
    el.appendChild(label);
    iconNav.appendChild(el);
  });
  c.appendChild(iconNav);

  const hMap = document.createElement('h2');
  hMap.textContent = '部室マップ';
  c.appendChild(hMap);

  const pMap = document.createElement('p');
  const img = document.createElement('img');
  img.src = 'cumpasmap.jpg';
  img.alt = '小金井キャンパスマップ — サークル棟B棟の位置';
  img.className = 'campus-map';
  pMap.appendChild(img);
  pMap.appendChild(document.createElement('br'));
  pMap.appendChild(document.createTextNode('小金井キャンパスマップ　赤線で示したサークル棟B棟に部室があります。'));
  pMap.appendChild(document.createElement('br'));
  const link = document.createElement('a');
  link.href = 'https://www.tuat.ac.jp/outline/overview/access/koganei/campus_map/';
  link.textContent = 'https://www.tuat.ac.jp/outline/overview/access/koganei/campus_map/';
  pMap.appendChild(link);
  pMap.appendChild(document.createTextNode('より引用'));
  c.appendChild(pMap);
})();
