(function() {
  const c = document.getElementById('content');
  if (!c) return;
  document.title = '東京農工大学将棋部';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = '東京農工大学将棋部の公式Webサイト。活動日時・場所、大会成績、入部案内を掲載。初心者・経験者問わず大歓迎。';

  const h1 = document.createElement('h1');
  h1.textContent = 'お知らせ';
  c.appendChild(h1);

  const hr1 = document.createElement('hr');
  c.appendChild(hr1);

  const p1 = document.createElement('p');
  p1.innerHTML = '2026.05.24<br>春季団体戦c級2組で準優勝しました。<br>来期は昇級し、c級1組で戦います。';
  c.appendChild(p1);

  const detail = document.createElement('a');
  detail.href = '#';
  detail.textContent = '詳しく見る';
  detail.className = 'news-more';
  detail.addEventListener('click', function(e) {
    e.preventDefault();
    loadPage('top.html', true);
  });
  c.appendChild(detail);

  const bodyNav = document.createElement('div');
  bodyNav.className = 'body-nav';
  DATA.navitems.filter(function(item) {
    return item.label !== 'トップ' && !item.href.startsWith('http');
  }).forEach(function(item) {
    const card = document.createElement('a');
    card.className = 'body-nav-card';
    card.textContent = item.label;
    card.href = item.href;
    if (item.href.startsWith('http')) {
      card.target = '_blank';
      card.rel = 'noopener';
    } else {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        loadPage(item.href);
      });
    }
    bodyNav.appendChild(card);
  });
  c.appendChild(bodyNav);

  const h12 = document.createElement('h1');
  h12.textContent = '部室マップ';
  c.appendChild(h12);

  const hr2 = document.createElement('hr');
  c.appendChild(hr2);

  const p2 = document.createElement('p');
  const img = document.createElement('img');
  img.src = 'cumpasmap.jpg';
  img.alt = '小金井キャンパスマップ — サークル棟B棟の位置';
  img.className = 'campus-map';
  p2.appendChild(img);
  p2.appendChild(document.createElement('br'));
  p2.appendChild(document.createTextNode('小金井キャンパスマップ　赤線で示したサークル棟B棟に部室があります。'));
  p2.appendChild(document.createElement('br'));
  const link = document.createElement('a');
  link.href = 'https://www.tuat.ac.jp/outline/overview/access/koganei/campus_map/';
  link.textContent = 'https://www.tuat.ac.jp/outline/overview/access/koganei/campus_map/';
  p2.appendChild(link);
  p2.appendChild(document.createTextNode('より引用'));
  c.appendChild(p2);
})();
