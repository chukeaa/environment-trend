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

`npm run build` 会生成 `dist/`，用于本地检查或后续切换到 Actions 部署。

## GitHub Pages 发布

推荐在 GitHub Pages 设置里选择 `GitHub Actions` 作为发布来源。仓库根目录就是前端项目，workflow 会运行 `npm run validate` 和 `npm run build`，并发布 `dist/`。

`dist/` 是构建产物，不需要提交。
