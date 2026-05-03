const DEFAULT_SITES = [
  { name: 'ChatGPT', icon: '🤖', url: 'https://chatgpt.com' },
  { name: '豆包', icon: '🫘', url: 'https://www.doubao.com' },
  { name: 'Kimi', icon: '🌙', url: 'https://kimi.moonshot.cn' },
];
const STORAGE_KEY = 'custom_sites_v1';

const frame = document.getElementById('siteFrame');
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
let activeUrl = normalizeUrl(sites[0]?.url || 'https://example.com');

function normalizeUrl(value) { const raw = value.trim(); if (!raw) return null; if (/^https?:\/\//i.test(raw)) return raw; return `https://${raw}`; }
function loadSites() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_SITES; } catch { return DEFAULT_SITES; } }
function saveSites() { localStorage.setItem(STORAGE_KEY, JSON.stringify(sites)); }

function openInFrame(url) {
  const normalized = normalizeUrl(url);
  if (!normalized) return;
  try {
    const parsed = new URL(normalized);
    activeUrl = parsed.toString();
    frame.src = activeUrl;
    renderQuickMenu();
  } catch {
    alert('请输入正确的网址，例如 https://example.com');
  }
}

function renderQuickMenu() {
  quickMenu.innerHTML = '';
  sites.forEach((site) => {
    const btn = document.createElement('button');
    btn.className = 'site-btn';
    btn.type = 'button';
    btn.title = site.name;
    btn.textContent = site.icon;
    if (normalizeUrl(site.url) === activeUrl) btn.classList.add('is-active');
    btn.setAttribute('role', 'tab');
    btn.addEventListener('click', () => openInFrame(site.url));
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
    delBtn.addEventListener('click', () => {
      const removed = sites.splice(index, 1)[0];
      if (normalizeUrl(removed.url) === activeUrl) {
        const fallback = sites[0]?.url || 'https://example.com';
        openInFrame(fallback);
      } else {
        renderQuickMenu();
      }
      saveSites();
      renderSiteList();
    });
    li.append(editBtn, delBtn);
    siteList.appendChild(li);
  });
}

function renderAll() { renderQuickMenu(); renderSiteList(); }

function startEdit(index) {
  const site = sites[index]; editingIndex = index;
  siteNameInput.value = site.name; siteIconInput.value = site.icon; siteUrlInput.value = site.url;
  saveSiteBtn.textContent = '保存修改'; cancelEditBtn.hidden = false;
}

function resetForm() {
  editingIndex = -1; siteForm.reset(); saveSiteBtn.textContent = '新增'; cancelEditBtn.hidden = true;
}

manageToggle.addEventListener('click', () => { managePanel.hidden = !managePanel.hidden; });

siteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const site = { name: siteNameInput.value.trim(), icon: siteIconInput.value.trim(), url: normalizeUrl(siteUrlInput.value) };
  if (!site.name || !site.icon || !site.url) return;
  if (editingIndex >= 0) sites[editingIndex] = site; else sites.push(site);
  saveSites();
  renderAll();
  resetForm();
});

cancelEditBtn.addEventListener('click', resetForm);

openInFrame(activeUrl);
renderSiteList();
