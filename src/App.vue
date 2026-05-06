<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const DEFAULT_SITES = [
  { name: 'ChatGPT', icon: '🤖', url: 'https://chatgpt.com' },
  { name: '豆包', icon: '🫘', url: 'https://www.doubao.com' },
  { name: 'Kimi', icon: '🌙', url: 'https://kimi.moonshot.cn' }
];

const STORAGE_KEY = 'custom_sites_v1';

const IMAGE_ICON_RE = /^https?:\/\/\S+$/i;

const normalizeUrl = (value) => {
  const raw = value.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
};

const loadSites = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_SITES;
  } catch {
    return DEFAULT_SITES;
  }
};

const sites = ref(loadSites());
const activeUrl = ref(normalizeUrl(sites.value[0]?.url || 'https://example.com'));
const openedUrls = ref(activeUrl.value ? [activeUrl.value] : []);
const isManageOpen = ref(false);
const editingIndex = ref(-1);

const form = ref({ name: '', icon: '', url: '' });
const draggedIndex = ref(-1);

const isImageIcon = (icon) => IMAGE_ICON_RE.test((icon || '').trim());

const saveSites = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites.value));
};

const frameUrl = computed(() => activeUrl.value || 'https://example.com');

const isSiteActive = (siteUrl) => {
  const normalized = normalizeUrl(siteUrl);
  if (!normalized || !activeUrl.value) return false;
  try {
    const current = new URL(activeUrl.value).toString();
    const target = new URL(normalized).toString();
    return current.startsWith(target);
  } catch {
    return false;
  }
};

const openInFrame = (url) => {
  const normalized = normalizeUrl(url);
  if (!normalized) return;
  try {
    const resolvedUrl = new URL(normalized).toString();
    activeUrl.value = resolvedUrl;
    if (!openedUrls.value.includes(resolvedUrl)) {
      openedUrls.value.push(resolvedUrl);
    }
  } catch {
    alert(t('ui.invalidUrl'));
  }
};

const resetForm = () => {
  editingIndex.value = -1;
  form.value = { name: '', icon: '', url: '' };
};

const startEdit = (index) => {
  const site = sites.value[index];
  editingIndex.value = index;
  form.value = { name: site.name, icon: site.icon, url: site.url };
};

const upsertSite = () => {
  const site = {
    name: form.value.name.trim(),
    icon: form.value.icon.trim(),
    url: normalizeUrl(form.value.url)
  };

  if (!site.name || !site.icon || !site.url) return;

  if (editingIndex.value >= 0) {
    sites.value[editingIndex.value] = site;
  } else {
    sites.value.push(site);
  }

  saveSites();
  resetForm();
};

const removeSite = (index) => {
  const removed = sites.value.splice(index, 1)[0];
  const removedUrl = normalizeUrl(removed.url);
  if (removedUrl) {
    openedUrls.value = openedUrls.value.filter((url) => url !== removedUrl);
  }
  if (removedUrl === activeUrl.value) {
    openInFrame(sites.value[0]?.url || 'https://example.com');
  }
  saveSites();
};

const handleMenuWheel = (event) => {
  const menu = event.currentTarget;
  if (!(menu instanceof HTMLElement)) return;
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  menu.scrollLeft += event.deltaY;
};

const onDragStart = (index) => {
  draggedIndex.value = index;
};

const onDrop = (targetIndex) => {
  const from = draggedIndex.value;
  draggedIndex.value = -1;
  if (from < 0 || from === targetIndex) return;
  const moved = sites.value.splice(from, 1)[0];
  sites.value.splice(targetIndex, 0, moved);
  saveSites();
};
</script>

<template>
  <main class="layout">
    <section class="viewer" :aria-label="t('ui.viewerArea')">
      <iframe
        v-for="url in openedUrls"
        class="site-frame"
        :key="url"
        :title="t('ui.frameTitle')"
        :src="url"
        v-show="url === frameUrl"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads allow-popups-to-escape-sandbox"
        referrerpolicy="no-referrer-when-downgrade"
        allow="clipboard-read; clipboard-write"
      ></iframe>
    </section>

    <nav class="right-sidebar" :aria-label="t('ui.quickSidebar')">
      <div class="quick-menu" role="tablist" :aria-label="t('ui.quickSites')" @wheel.prevent="handleMenuWheel">
        <button
          v-for="(site, index) in sites"
          :key="`${site.name}-${index}`"
          class="site-btn"
          :class="{ 'is-active': isSiteActive(site.url) }"
          :title="site.name"
          role="tab"
          type="button"
          draggable="true"
          @click="openInFrame(site.url)"
          @dragstart="onDragStart(index)"
          @dragover.prevent
          @drop="onDrop(index)"
          @dragend="draggedIndex = -1"
        >
          <img
            v-if="isImageIcon(site.icon)"
            class="site-icon-img"
            :src="site.icon"
            :alt="t('ui.iconAlt', { name: site.name })"
            loading="lazy"
          />
          <span v-else class="site-icon-text">{{ site.icon }}</span>
        </button>
      </div>
      <button class="manage-toggle" :title="t('ui.manageNav')" @click="isManageOpen = !isManageOpen">⚙️</button>
    </nav>

    <section class="manage-panel" :aria-label="t('ui.managePanel')" v-show="isManageOpen">
      <h2>{{ t('ui.manageQuickSites') }}</h2>
      <form class="site-form" @submit.prevent="upsertSite">
        <input v-model="form.name" type="text" :placeholder="t('ui.inputName')" required />
        <input
          v-model="form.icon"
          type="text"
          :placeholder="t('ui.inputIcon')"
          required
        />
        <input v-model="form.url" type="url" :placeholder="t('ui.inputUrl')" required />
        <button type="submit">{{ editingIndex >= 0 ? t('ui.save') : t('ui.add') }}</button>
        <button v-if="editingIndex >= 0" type="button" @click="resetForm">{{ t('ui.cancel') }}</button>
      </form>

      <ul class="site-list">
        <li v-for="(site, index) in sites" :key="`${site.url}-${index}`" class="site-item">
          <img
            v-if="isImageIcon(site.icon)"
            class="site-icon-img"
            :src="site.icon"
            :alt="t('ui.iconAlt', { name: site.name })"
            loading="lazy"
          />
          <span v-else class="site-icon-text">{{ site.icon }}</span>
          <div>
            <div>{{ site.name }}</div>
            <div class="site-url">{{ site.url }}</div>
          </div>
          <button type="button" @click="startEdit(index)">{{ t('ui.edit') }}</button>
          <button type="button" @click="removeSite(index)">{{ t('ui.remove') }}</button>
        </li>
      </ul>
    </section>
  </main>
</template>
