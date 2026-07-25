(function() {
  const c = document.getElementById('content');
  if (!c) return;
  document.title = '活動紹介 | 東京農工大学将棋部';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = '東京農工大学将棋部の活動紹介。日頃の活動や大会・部内戦の様子を写真とともに紹介。';

  const h1 = document.createElement('h1');
  h1.textContent = '活動紹介';
  c.appendChild(h1);

  const sec1 = document.createElement('section');
  sec1.id = 'section-daily';

  const hr1 = document.createElement('hr');
  sec1.appendChild(hr1);

  const h2_1 = document.createElement('h2');
  h2_1.textContent = '日頃の活動';
  sec1.appendChild(h2_1);

  const photo1 = document.createElement('div');
  photo1.className = 'photo-card';
  const img1 = document.createElement('img');
  img1.src = '20260709_180604.jpg';
  img1.alt = '部室での活動風景';
  photo1.appendChild(img1);
  sec1.appendChild(photo1);

  const p1 = document.createElement('p');
  p1.textContent = '毎週金曜日に活動しています。部室には棋書・盤駒・チェスクロック等、将棋のための設備が整っています。';
  sec1.appendChild(p1);

  c.appendChild(sec1);

  const sec2 = document.createElement('section');
  sec2.id = 'section-tournament';

  const hr2 = document.createElement('hr');
  sec2.appendChild(hr2);

  const h2_2 = document.createElement('h2');
  h2_2.textContent = '大会・部内戦・レーティング';
  sec2.appendChild(h2_2);

  const photo2 = document.createElement('div');
  photo2.className = 'photo-card';
  const img2 = document.createElement('img');
  img2.src = '20260524_191148.jpg';
  img2.alt = '大会参加時の集合写真';
  photo2.appendChild(img2);
  sec2.appendChild(photo2);

  const p2 = document.createElement('p');
  p2.innerHTML = '一年を通して、さまざまな大会・部内戦があります。<br>大会は全国大会がかかるものから大学間交流を目的としてものまで多数あります。主に日曜日が開催日です。<br>一方、部内戦(順位戦)は1~3か月かけて行います。';
  sec2.appendChild(p2);

  c.appendChild(sec2);
})();
