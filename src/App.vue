<script setup>
import { computed, ref } from 'vue';

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
const isManageOpen = ref(false);
const editingIndex = ref(-1);

const form = ref({ name: '', icon: '', url: '' });

const isImageIcon = (icon) => IMAGE_ICON_RE.test((icon || '').trim());

const saveSites = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites.value));
};

const frameUrl = computed(() => activeUrl.value || 'https://example.com');

const openInFrame = (url) => {
  const normalized = normalizeUrl(url);
  if (!normalized) return;
  try {
    activeUrl.value = new URL(normalized).toString();
  } catch {
    alert('请输入正确的网址，例如 https://example.com');
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
  if (normalizeUrl(removed.url) === activeUrl.value) {
    openInFrame(sites.value[0]?.url || 'https://example.com');
  }
  saveSites();
};
</script>

<template>
  <main class="layout">
    <section class="viewer" aria-label="网页浏览区域">
      <iframe
        id="siteFrame"
        title="网页显示区域"
        :src="frameUrl"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads allow-popups-to-escape-sandbox"
        referrerpolicy="no-referrer-when-downgrade"
        allow="clipboard-read; clipboard-write"
      ></iframe>
    </section>

    <nav class="right-sidebar" aria-label="快捷导航侧栏">
      <div class="quick-menu" role="tablist" aria-label="快捷网页">
        <button
          v-for="(site, index) in sites"
          :key="`${site.name}-${index}`"
          class="site-btn"
          :class="{ 'is-active': normalizeUrl(site.url) === activeUrl }"
          :title="site.name"
          role="tab"
          type="button"
          @click="openInFrame(site.url)"
        >
          <img
            v-if="isImageIcon(site.icon)"
            class="site-icon-img"
            :src="site.icon"
            :alt="`${site.name} 图标`"
            loading="lazy"
          />
          <span v-else class="site-icon-text">{{ site.icon }}</span>
        </button>
      </div>
      <button class="manage-toggle" title="管理导航" @click="isManageOpen = !isManageOpen">⚙️</button>
    </nav>

    <section class="manage-panel" aria-label="导航管理" v-show="isManageOpen">
      <h2>管理快捷网页</h2>
      <form class="site-form" @submit.prevent="upsertSite">
        <input v-model="form.name" type="text" placeholder="名称，例如 GitHub" required />
        <input
          v-model="form.icon"
          type="text"
          placeholder="图标：单个汉字 / 单个 emoji / 图片链接"
          required
        />
        <input v-model="form.url" type="url" placeholder="网址，例如 https://github.com" required />
        <button type="submit">{{ editingIndex >= 0 ? '保存修改' : '新增' }}</button>
        <button v-if="editingIndex >= 0" type="button" @click="resetForm">取消编辑</button>
      </form>

      <ul class="site-list">
        <li v-for="(site, index) in sites" :key="`${site.url}-${index}`" class="site-item">
          <img
            v-if="isImageIcon(site.icon)"
            class="site-icon-img"
            :src="site.icon"
            :alt="`${site.name} 图标`"
            loading="lazy"
          />
          <span v-else class="site-icon-text">{{ site.icon }}</span>
          <div>
            <div>{{ site.name }}</div>
            <div class="site-url">{{ site.url }}</div>
          </div>
          <button type="button" @click="startEdit(index)">编辑</button>
          <button type="button" @click="removeSite(index)">删除</button>
        </li>
      </ul>
    </section>
  </main>
</template>
