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
  footer: {copyright: '東京農工大学将棋部', contact: 'tuatshogi@gmail.com', x: 'https://x.com/tuatshogiclub'}
};
function createNav(data, onItemClick, filter) {
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  const ul = document.createElement('ul');
  data.navitems.forEach(items => {
    if (filter && !filter(items)) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = items.label;
    a.href = items.href;
    a.addEventListener('click', function(e) {
      if (items.href.startsWith('http')) return;
      e.preventDefault();
      if (onItemClick) onItemClick(nav);
      loadPage(items.href);
    });
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);
  return nav;
}

function renderheader(data) {
  const header = document.createElement('header');
  header.className = 'site-header';

  const img = document.createElement('img');
  img.className = 'image';
  img.src = data.img;
  img.alt = '東京農工大学将棋部 エンブレム';
  img.addEventListener('click', function() {
    loadPage('top.html');
  });
  const brand = document.createElement('img');
  brand.className = 'brand';
  brand.src = data.brand;
  brand.alt = '東京農工大学将棋部';

  const nav = createNav(data, (nav) => nav.classList.remove('open'));

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

  const nav = createNav(data, null, items => !items.href.startsWith('http'));
  nav.className = 'footer-nav';
  footer.appendChild(nav);

  const xLink = document.createElement('a');
  xLink.href = data.footer.x;
  xLink.className = 'footer-x';
  xLink.target = '_blank';
  xLink.rel = 'noopener';
  xLink.setAttribute('aria-label', 'X (旧Twitter)');
  xLink.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
  footer.appendChild(xLink);

  const left = document.createElement('div');
  left.className = 'footer-left';

  const contact = document.createElement('div');
  contact.textContent = data.footer.contact;
  left.appendChild(contact);

  const copy = document.createElement('div');
  copy.textContent = '\u00A9 ' + data.footer.copyright;
  left.appendChild(copy);

  footer.appendChild(left);

  return footer;
}
async function loadPage(htmlPath, forceHTML) {
  const content = document.getElementById('content');
  content.innerHTML = '';

  if (!forceHTML) {
    const jsPath = htmlPath.replace('.html', '.js');
    try {
      const jsRes = await fetch(jsPath);
      if (jsRes.ok) {
        const jsText = await jsRes.text();
        const script = document.createElement('script');
        script.textContent = jsText;
        document.body.appendChild(script);
        return;
      }
    } catch (_) {}
  }

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