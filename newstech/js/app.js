// ── NewsTech · app.js ──
// Para publicar um artigo: edite /data/articles.json e faça git push.

const ICONES = {
  'IA':        '🧠',
  'Hardware':  '🖥️',
  'Software':  '💻',
  'Segurança': '🔐',
  'Ciência':   '⚛️',
};

let ARTICLES = [];

// ── Carrega artigos do JSON ──
async function loadArticles() {
  try {
    const res = await fetch('data/articles.json');
    ARTICLES = await res.json();
    // Ordena por data decrescente
    ARTICLES.sort((a, b) => new Date(b.data) - new Date(a.data));
    init();
  } catch (e) {
    console.error('Erro ao carregar artigos:', e);
  }
}

function init() {
  setDate();
  buildTicker();
  buildHero();
  buildHomeGrid();
  buildTrending();
  buildTagCloud();
  initFadeObserver();
}

// ── Data no masthead ──
function setDate() {
  const el = document.getElementById('mastDate');
  if (el) {
    el.textContent = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
  const fy = document.getElementById('footerYear');
  if (fy) fy.textContent = new Date().getFullYear();
}

// ── Ticker ──
function buildTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const items = ARTICLES.slice(0, 8).map(a =>
    `<span class="ticker-item"><b>${a.categoria}</b> ${a.titulo}</span>`
  ).join('');
  // Duplica para loop infinito
  track.innerHTML = items + items;
}

// ── Hero (3 colunas: destaque | últimas | em alta) ──
function buildHero() {
  const section = document.getElementById('heroSection');
  if (!section) return;

  const destaque = ARTICLES.find(a => a.destaque) || ARTICLES[0];
  const ultimas  = ARTICLES.filter(a => a.id !== destaque.id).slice(0, 4);
  const emAlta   = ARTICLES.filter(a => a.id !== destaque.id && !ultimas.find(u => u.id === a.id))[0]
                   || ARTICLES[ARTICLES.length - 1];

  section.innerHTML = `
    <div class="hero-col">
      <div class="hero-label">⚡ Destaque</div>
      <div class="hero-thumb thumb-${destaque.categoria}">${ICONES[destaque.categoria] || '📰'}</div>
      <div class="hero-main-title" onclick="openArticle(${destaque.id})">${destaque.titulo}</div>
      <div class="hero-main-desc">${destaque.resumo}</div>
      <div class="hero-meta">${destaque.categoria} · ${destaque.tempoLeitura} · ${formatDate(destaque.data)}</div>
    </div>

    <div class="hero-divider"></div>

    <div class="hero-col">
      <div class="hero-label">📰 Últimas notícias</div>
      ${ultimas.map((a, i) => `
        <div class="hero-side-item" onclick="openArticle(${a.id})">
          <span class="side-num">0${i + 1}</span>
          <div>
            <div class="side-cat">${a.categoria}</div>
            <div class="side-title">${a.titulo}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="hero-divider"></div>

    <div class="hero-col">
      <div class="hero-label">🔬 Em alta</div>
      <div class="hero-thumb thumb-${emAlta.categoria}">${ICONES[emAlta.categoria] || '📰'}</div>
      <div class="hero-main-title" onclick="openArticle(${emAlta.id})">${emAlta.titulo}</div>
      <div class="hero-main-desc">${emAlta.resumo}</div>
      <div class="hero-meta">${emAlta.categoria} · ${emAlta.tempoLeitura} · ${formatDate(emAlta.data)}</div>
    </div>
  `;
}

// ── Home grid (artigos após hero) ──
function buildHomeGrid() {
  const g = document.getElementById('homeGrid');
  if (!g) return;
  const destaque = ARTICLES.find(a => a.destaque) || ARTICLES[0];
  const lista = ARTICLES.filter(a => a.id !== destaque.id).slice(2, 8);
  g.innerHTML = lista.map(a => cardHTML(a)).join('');
  observeFadeIn(g);
}

// ── Card HTML ──
function cardHTML(a) {
  return `
    <div class="article-card fade-in" onclick="openArticle(${a.id})">
      <div class="card-thumb thumb-${a.categoria}">${ICONES[a.categoria] || '📰'}</div>
      <div class="card-body">
        <div class="card-cat cat-${a.categoria}">${a.categoria}</div>
        <div class="card-title">${a.titulo}</div>
        <div class="card-meta"><span>${formatDate(a.data)}</span><span>${a.tempoLeitura}</span></div>
      </div>
    </div>`;
}

// ── Trending ──
function buildTrending() {
  const t = document.getElementById('trendingList');
  if (!t) return;
  t.innerHTML = ARTICLES.slice(0, 5).map((a, i) => `
    <div class="trending-item" onclick="openArticle(${a.id})">
      <span class="trending-num">0${i + 1}</span>
      <span class="trending-title">${a.titulo}</span>
    </div>`).join('');
}

// ── Tag Cloud ──
function buildTagCloud() {
  const tc = document.getElementById('tagCloud');
  if (!tc) return;
  const tags = [...new Set(ARTICLES.flatMap(a => a.tags || []))].slice(0, 20);
  tc.innerHTML = tags.map(t =>
    `<span class="tag" onclick="searchByTag('${t}')">${t}</span>`
  ).join('');
}

function searchByTag(tag) {
  showPage('categorias');
  renderCatGrid('todas');
  // Filtra pelo tag
  const g = document.getElementById('catGrid');
  const lista = ARTICLES.filter(a => (a.tags || []).includes(tag));
  g.innerHTML = lista.map(a => cardHTML(a)).join('');
  observeFadeIn(g);
}

// ── Filtro de categorias ──
function filterCat(cat, el) {
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderCatGrid(cat);
}

function renderCatGrid(filter = 'todas') {
  const g = document.getElementById('catGrid');
  if (!g) return;
  const lista = filter === 'todas' ? ARTICLES : ARTICLES.filter(a => a.categoria === filter);
  g.innerHTML = lista.map(a => cardHTML(a)).join('');
  observeFadeIn(g);
}

// ── Abrir artigo ──
function openArticle(id) {
  const a = ARTICLES.find(x => x.id === id);
  if (!a) return;

  const content = document.getElementById('articleContent');
  content.innerHTML = `
    <span class="article-back" onclick="history.back(); showPage('home')">← Voltar</span>
    <div class="article-category">${a.categoria}</div>
    <h1 class="article-title">${a.titulo}</h1>
    <div class="article-meta">
      <span>✍️ ${a.autor}</span>
      <span>📅 ${formatDate(a.data)}</span>
      <span>⏱ ${a.tempoLeitura} de leitura</span>
    </div>
    <div class="article-tags">
      ${(a.tags || []).map(t => `<span class="article-tag">${t}</span>`).join('')}
    </div>
    <div class="article-body">${markdownToHTML(a.conteudo)}</div>
  `;

  showPage('artigo');
  window.scrollTo(0, 0);
}

// ── Markdown simples → HTML ──
function markdownToHTML(md) {
  return md
    .split('\n\n')
    .map(block => {
      if (block.startsWith('## '))  return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith('### ')) return `<h3>${block.slice(4)}</h3>`;
      if (block.startsWith('# '))   return `<h2>${block.slice(2)}</h2>`;
      // Listas
      if (block.split('\n').every(l => l.match(/^\d+\.\s/))) {
        const items = block.split('\n').map(l => `<li>${l.replace(/^\d+\.\s/, '')}</li>`).join('');
        return `<ol>${items}</ol>`;
      }
      if (block.split('\n').every(l => l.match(/^[-*]\s/))) {
        const items = block.split('\n').map(l => `<li>${l.replace(/^[-*]\s/, '')}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      // Bold e code inline
      let p = block
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code>$1</code>');
      return `<p>${p}</p>`;
    })
    .join('\n');
}

// ── Navegação entre páginas ──
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');

  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-link'));
  const nl = document.getElementById('nl-' + id);
  if (nl) nl.classList.add('active-link');

  if (id === 'categorias') renderCatGrid();
  window.scrollTo(0, 0);
}

// ── Busca ──
function handleSearch(q) {
  const r = document.getElementById('searchResults');
  if (!q.trim()) { r.classList.remove('show'); return; }
  const res = ARTICLES.filter(a =>
    a.titulo.toLowerCase().includes(q.toLowerCase()) ||
    a.categoria.toLowerCase().includes(q.toLowerCase()) ||
    (a.tags || []).some(t => t.toLowerCase().includes(q.toLowerCase()))
  ).slice(0, 6);
  r.innerHTML = res.length
    ? res.map(a => `
        <div class="search-item" onclick="openArticle(${a.id})">
          <div class="search-item-cat">${a.categoria}</div>
          <div class="search-item-title">${a.titulo}</div>
        </div>`).join('')
    : '<div style="padding:.5rem;font-size:.78rem;color:var(--text3)">Nenhum resultado encontrado</div>';
  r.classList.add('show');
}
function showSR() { if (document.getElementById('searchInput').value) document.getElementById('searchResults').classList.add('show'); }
function hideSR() { document.getElementById('searchResults').classList.remove('show'); }

// ── Newsletter ──
function subscribe(emailId, successId, formId) {
  const email = document.getElementById(emailId).value;
  if (!email || !email.includes('@')) {
    document.getElementById(emailId).focus();
    document.getElementById(emailId).style.borderColor = 'var(--accent3)';
    return;
  }
  document.getElementById(formId).style.display = 'none';
  document.getElementById(successId).style.display = 'block';
}

// ── Tema ──
function toggleTheme() {
  const b = document.body;
  const btn = document.querySelector('.theme-btn');
  if (b.getAttribute('data-theme') === 'light') {
    b.removeAttribute('data-theme');
    btn.textContent = '☀';
    localStorage.setItem('theme', 'dark');
  } else {
    b.setAttribute('data-theme', 'light');
    btn.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
}

// Restaura tema salvo
(function () {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.setAttribute('data-theme', 'light');
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.querySelector('.theme-btn');
      if (btn) btn.textContent = '🌙';
    });
  }
})();

// ── Utilitários ──
function formatDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function observeFadeIn(container) {
  setTimeout(() => {
    container.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }, 60);
}

function initFadeObserver() {
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08 }
);

// ── Start ──
loadArticles();
