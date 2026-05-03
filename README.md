# SidePanel Navigator (Chrome Extension)

一个基础的 Chrome 插件脚手架：

- 点击工具栏图标后打开 Chrome Side Panel。
- Side Panel 中展示一个类似 H5 导航页的主界面。
- 点击导航按钮（或输入 URL）后，在当前侧边栏内 iframe 打开目标网页。

## 本地运行

1. 打开 `chrome://extensions/`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」，选择当前目录
4. 点击插件图标，即可在侧边栏打开主界面

## 说明

由于网站安全策略限制（`X-Frame-Options` 或 `CSP frame-ancestors`），部分网站不能在 iframe 内嵌展示。这是浏览器安全机制导致的正常现象。
