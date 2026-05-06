# SidePanel Navigator (Chrome Extension)

一个基于 **Vue 3 + Vite 8 + Manifest V3** 的 Chrome Side Panel 导航插件。  
它把常用网站聚合到浏览器侧边栏中，支持像“标签页”一样快速切换，并提供可视化管理能力。

## 项目定位

SidePanel Navigator 适合以下场景：

- 希望在浏览器右侧固定一个“工作台”，快速访问 AI、文档、代码托管、设计等站点。
- 不想频繁切换浏览器标签页，希望把常用网页收拢到侧边栏统一操作。
- 需要一个轻量、可扩展、可二次开发的 Chrome 扩展模板。

---

## 功能特性

### 1) 侧边栏网页导航

- 点击扩展图标即可唤起 Chrome Side Panel。
- 侧边栏主区域通过 `iframe` 加载目标网页。
- 在同一侧边栏会话中可打开多个站点并快速切换当前可见页面。

### 2) 快捷网站管理（本地持久化）

- 内置默认网站快捷入口（如 ChatGPT、豆包、Kimi）。
- 支持新增快捷站点（名称 / 图标 / URL）。
- 支持编辑、删除已添加站点。
- 站点列表保存在 `localStorage`，浏览器重启后仍可保留。

### 3) 拖拽排序与横向滚动

- 快捷按钮支持拖拽排序，按你的使用习惯调整优先级。
- 当快捷入口较多时，支持滚轮映射为横向滚动，提升导航效率。

### 4) 图标显示策略

- 图标字段既支持 emoji/字符，也支持图片 URL。
- 如果识别到 `http/https` 链接，则渲染为图片图标；否则按文本图标展示。

### 5) URL 规范化与容错

- 用户输入 URL 时若缺少协议，自动补全为 `https://`。
- 对无效 URL 进行拦截提示，减少空白页或错误跳转。

### 6) 国际化（仅中文 / 英文）

- 集成 `vue-i18n`，统一管理界面文案。
- 根据浏览器默认语言自动匹配：
  - `zh*` → 中文
  - 其他 → 英文
- 当前仅维护 **中文（zh）** 与 **英文（en）** 两种语言版本。

### 7) iframe 兼容增强（实验性）

- 通过 MV3 `declarativeNetRequest` 静态规则，在子框架响应阶段尝试移除：
  - `X-Frame-Options`
  - `Content-Security-Policy`（含 `frame-ancestors`）
  - `Content-Security-Policy-Report-Only`

> 注意：该能力会弱化目标站点原有的防点击劫持策略，仅建议在你信任的自用场景中使用。

---

## 技术栈

- **Vue 3**（界面与状态管理）
- **Vite 8**（构建与开发服务器）
- **Manifest V3**（Chrome 扩展规范）
- **vue-i18n**（中英文国际化）
- **pnpm**（包管理）

---

## 目录结构

```text
.
├─ public/
│  ├─ manifest.json                # 扩展清单
│  └─ rules/remove-frame-limits.json
├─ src/
│  ├─ App.vue                      # 主界面（导航 + 管理面板）
│  ├─ i18n.js                      # 国际化配置与文案
│  ├─ main.js                      # Vue 启动入口
│  └─ main.css                     # 样式
├─ background.js                   # 扩展后台逻辑（Side Panel 入口）
├─ sidepanel.html                  # Side Panel 页面容器
└─ vite.config.js                  # Vite 配置
```

---

## 本地开发

```bash
pnpm install
pnpm dev
```

---

## 构建与加载

### 构建

```bash
pnpm build
```

构建产物目录：`dist/`

### 在 Chrome 中加载

1. 打开 `chrome://extensions/`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择项目的 `dist` 目录

---

## 使用说明

1. 点击浏览器工具栏扩展图标，打开 Side Panel。
2. 在右侧快捷栏点击任意站点按钮，即可在主区域加载网页。
3. 点击 `⚙️` 打开管理面板，可新增/编辑/删除导航项。
4. 通过拖拽快捷按钮可调整排序。

---

## 注意事项

- 部分网站即便移除部分响应头，仍可能由于复杂 CSP、登录策略或反嵌套策略无法在 iframe 中完整运行。
- 本项目默认用于个人效率场景；如用于团队或生产环境，请先进行安全评估。

---

## License

[MIT](./LICENSE)
