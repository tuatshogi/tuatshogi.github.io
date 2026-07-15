const DATA = {
  img: 'Designer.png',
  brand: 'logo.png',
  navitems: [
    {label: 'トップ', href: 'top.html'},
    {label: '入部案内', href: 'entry.html'},
    {label: '大会記録', href: 'record.html'},
    {label: '活動紹介', href: 'introduce.html'},
    {label: 'x(旧twitter)', href: 'https://x.com/tuatshogiclub'}
  ],
  footer: {copyright: '東京農工大学将棋部', contact: 'tuatshogi@gmail.com'}
};
function renderheader(data) {
  const header = document.createElement('header');
  header.className = 'site-header';

  const img = document.createElement('img');
  img.className = 'image';
  img.src = data.img;
  img.alt = '表示できませんでした';
  img.addEventListener('click', function() {
    loadPage('top.html');
  });
  const brand = document.createElement('img');
  brand.className = 'brand';
  brand.src = data.brand;
  brand.alt = '東京農工大学将棋部';

  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  const ul = document.createElement('ul');
  data.navitems.forEach(items => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = items.label;
    a.href = items.href;
    a.addEventListener('click', function(e) {
      if (items.href.startsWith('http')) {
        return;  // 外部リンクは通常通り遷移
      }
      e.preventDefault();
      nav.classList.remove('open');
      loadPage(items.href);
    });
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.textContent = 'MENU';
  toggle.setAttribute('aria-label', 'メニューを開閉');
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  header.appendChild(img);
  header.appendChild(brand);
  header.appendChild(nav);
  header.appendChild(toggle);
  return header;
}
function renderFooter(data) {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';

  const copy = document.createElement('div');
  copy.textContent = data.footer.copyright;

  const contact = document.createElement('div');
  contact.textContent = data.footer.contact;

  footer.append(copy, contact);
  return footer;
}
async function loadPage(htmlPath) {
  const content = document.getElementById('content');
  try {
    const res = await fetch(htmlPath);
    if (!res.ok) throw new Error('ファイルが見つかりません');
    const htmlText = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    content.innerHTML = doc.body.innerHTML;
  } catch (err) {
    content.innerHTML = '<p>ページの読み込みに失敗しました。</p>';
    console.error(err);
  }
}

function buildPage(data) {
  const wrap = document.createElement('div');
  wrap.id = 'wrap';
  wrap.style.cssText = 'overflow-x:hidden;width:100%';
  wrap.appendChild(renderheader(data));
  const content = document.createElement('div');
  content.id = 'content';
  wrap.append(content);
  wrap.appendChild(renderFooter(data));
  document.body.appendChild(wrap);
  loadPage('top.html')
}

buildPage(DATA);