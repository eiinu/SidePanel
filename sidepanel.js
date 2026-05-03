const urlInput = document.getElementById('urlInput');
const goBtn = document.getElementById('goBtn');
const frame = document.getElementById('siteFrame');

function normalizeUrl(value) {
  const raw = value.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

function openInFrame(url) {
  const normalized = normalizeUrl(url);
  if (!normalized) return;

  try {
    const parsed = new URL(normalized);
    frame.src = parsed.toString();
    urlInput.value = parsed.toString();
  } catch {
    alert('请输入正确的网址，例如 https://example.com');
  }
}

document.querySelectorAll('.site-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    openInFrame(btn.dataset.url ?? '');
  });
});

goBtn.addEventListener('click', () => openInFrame(urlInput.value));
urlInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    openInFrame(urlInput.value);
  }
});
