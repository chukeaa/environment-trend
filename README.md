# 环境专业趋势证据 Dashboard

这是一个轻量前端项目，用于发布环境可持续证据 dashboard。页面保留原 `03_outputs/dashboard/2026-06-25_environment_sustainability_dashboard.html` 的视觉和交互风格，并把样式、数据、渲染脚本拆分为可维护文件。

## 目录

```text
index.html
assets/css/dashboard.css
assets/js/dashboard-data.js
assets/js/dashboard.js
scripts/validate.mjs
scripts/build.mjs
package.json
```

## 本地预览

```bash
npm run dev
```

然后访问 `http://127.0.0.1:5173/`。

## 校验与构建

```bash
npm run validate
npm run build
npm run preview
```

`npm run build` 会生成 `dist/`，用于本地检查和 GitHub Pages 发布。

## GitHub Pages 发布

GitHub Pages 发布来源使用 `gh-pages` 分支的根目录。`main` 分支仍然是完整前端项目根目录；workflow 会运行 `npm run validate` 和 `npm run build`，再把 `dist/` 推送到 `gh-pages` 分支。

`dist/` 是构建产物，不需要提交。
