# SidePanel Navigator (Chrome Extension)

基于 **Vue 3 + Vite 8 + pnpm** 的 Chrome Side Panel 扩展模板：

- 点击工具栏图标后打开 Chrome Side Panel。
- Side Panel 中展示一个类似 H5 导航页的主界面。
- 点击导航按钮后，在当前侧边栏 iframe 打开目标网页。
- 支持新增 / 编辑 / 删除快捷网站（存储在 localStorage）。

## 技术栈

- Vue 3
- Vite 8
- pnpm
- Manifest V3

## 开发

```bash
pnpm install
pnpm dev
```

## 构建扩展

```bash
pnpm build
```

构建产物目录：`dist/`

加载方式：
1. 打开 `chrome://extensions/`
2. 开启开发者模式
3. 点击「加载已解压的扩展程序」
4. 选择 `dist` 目录

## iframe 兼容增强（实验性）

扩展通过 MV3 `declarativeNetRequest` 静态规则在子框架响应阶段移除以下限制头：

- `X-Frame-Options`
- `Content-Security-Policy`（包含 `frame-ancestors`）
- `Content-Security-Policy-Report-Only`

> 注意：这会削弱原网站的点击劫持防护，仅建议在你信任的本地开发/自用场景启用。
