chrome.runtime.onInstalled.addListener(async () => {
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

function stripFrameRestrictions(headers = []) {
  const filtered = [];

  for (const header of headers) {
    const name = header.name.toLowerCase();

    if (name === 'x-frame-options') {
      continue;
    }

    if (name === 'content-security-policy') {
      const csp = header.value || '';
      const updated = csp
        .replace(/(^|;)\s*frame-ancestors[^;]*/gi, '')
        .replace(/^\s*;|;\s*$/g, '')
        .trim();

      if (updated) {
        filtered.push({ ...header, value: updated });
      }
      continue;
    }

    filtered.push(header);
  }

  return filtered;
}

chrome.webRequest.onHeadersReceived.addListener(
  (details) => ({
    responseHeaders: stripFrameRestrictions(details.responseHeaders),
  }),
  { urls: ['<all_urls>'], types: ['sub_frame'] },
  ['blocking', 'responseHeaders', 'extraHeaders']
);
