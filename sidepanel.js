const DEFAULT_SITES = [
  { name: 'Google', icon: '🔍', url: 'https://www.google.com' },
  { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
  { name: 'Chrome Dev', icon: '🧩', url: 'https://developer.chrome.com' },
  { name: 'Hacker News', icon: '📰', url: 'https://news.ycombinator.com' },
];
const STORAGE_KEY = 'custom_sites_v1';

const urlInput = document.getElementById('urlInput');
const goBtn = document.getElementById('goBtn');
const frame = document.getElementById('siteFrame');
const floatingNav = document.querySelector('.floating-nav');
const menuToggle = document.getElementById('menuToggle');
const quickMenu = document.getElementById('quickMenu');
const manageToggle = document.getElementById('manageToggle');
const managePanel = document.getElementById('managePanel');
const siteForm = document.getElementById('siteForm');
const siteList = document.getElementById('siteList');
const siteNameInput = document.getElementById('siteNameInput');
const siteIconInput = document.getElementById('siteIconInput');
const siteUrlInput = document.getElementById('siteUrlInput');
const saveSiteBtn = document.getElementById('saveSiteBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

let sites = loadSites();
let editingIndex = -1;

function normalizeUrl(value) { const raw = value.trim(); if (!raw) return null; if (/^https?:\/\//i.test(raw)) return raw; return `https://${raw}`; }
function loadSites() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_SITES; } catch { return DEFAULT_SITES; } }
function saveSites() { localStorage.setItem(STORAGE_KEY, JSON.stringify(sites)); }

function openInFrame(url) {
  const normalized = normalizeUrl(url);
  if (!normalized) return;
  try { const parsed = new URL(normalized); frame.src = parsed.toString(); urlInput.value = parsed.toString(); }
  catch { alert('请输入正确的网址，例如 https://example.com'); }
}

function renderQuickMenu() {
  quickMenu.innerHTML = '';
  sites.forEach((site, index) => {
    const btn = document.createElement('button');
    btn.className = 'site-btn'; btn.type = 'button'; btn.title = site.name; btn.textContent = site.icon;
    btn.setAttribute('role', 'menuitem');
    btn.addEventListener('click', () => { openInFrame(site.url); setMenuOpen(false); });
    quickMenu.appendChild(btn);
  });
}

function renderSiteList() {
  siteList.innerHTML = '';
  sites.forEach((site, index) => {
    const li = document.createElement('li');
    li.className = 'site-item';
    li.innerHTML = `<span>${site.icon}</span><div><div>${site.name}</div><div class="site-url">${site.url}</div></div>`;
    const editBtn = document.createElement('button'); editBtn.textContent = '编辑';
    const delBtn = document.createElement('button'); delBtn.textContent = '删除';
    editBtn.addEventListener('click', () => startEdit(index));
    delBtn.addEventListener('click', () => { sites.splice(index, 1); saveSites(); renderAll(); });
    li.append(editBtn, delBtn);
    siteList.appendChild(li);
  });
}

function renderAll() { renderQuickMenu(); renderSiteList(); }
function setMenuOpen(open) { floatingNav.classList.toggle('open', open); menuToggle.setAttribute('aria-expanded', String(open)); quickMenu.setAttribute('aria-hidden', String(!open)); }

function startEdit(index) {
  const site = sites[index]; editingIndex = index;
  siteNameInput.value = site.name; siteIconInput.value = site.icon; siteUrlInput.value = site.url;
  saveSiteBtn.textContent = '保存修改'; cancelEditBtn.hidden = false;
}

function resetForm() {
  editingIndex = -1; siteForm.reset(); saveSiteBtn.textContent = '新增'; cancelEditBtn.hidden = true;
}

menuToggle.addEventListener('click', () => setMenuOpen(!floatingNav.classList.contains('open')));
manageToggle.addEventListener('click', () => { managePanel.hidden = !managePanel.hidden; });

siteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const site = { name: siteNameInput.value.trim(), icon: siteIconInput.value.trim(), url: normalizeUrl(siteUrlInput.value) };
  if (!site.name || !site.icon || !site.url) return;
  if (editingIndex >= 0) sites[editingIndex] = site; else sites.push(site);
  saveSites(); renderAll(); resetForm();
});

cancelEditBtn.addEventListener('click', resetForm);
goBtn.addEventListener('click', () => openInFrame(urlInput.value));
urlInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') openInFrame(urlInput.value); });

document.addEventListener('click', (event) => {
  if (!floatingNav.contains(event.target)) setMenuOpen(false);
});

renderAll();
