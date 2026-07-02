# 环境专业趋势证据 Dashboard

这是 `docs/` 下的轻量前端项目，用于发布环境可持续证据 dashboard。页面保留原 `03_outputs/dashboard/2026-06-25_environment_sustainability_dashboard.html` 的视觉和交互风格，并把样式、数据、渲染脚本拆分为可维护文件。

## 目录

```text
docs/
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
cd docs
npm run dev
```

然后访问 `http://127.0.0.1:5173/`。

## 校验与构建

```bash
cd docs
npm run validate
npm run build
npm run preview
```

`npm run build` 会生成 `docs/dist/`，可作为 GitHub Pages Actions 的发布产物。

## GitHub Pages 发布

推荐使用仓库根目录下的 `.github/workflows/pages.yml`，在 GitHub Pages 设置里选择 `GitHub Actions` 作为发布来源。也可以直接把 Pages source 设为当前分支的 `/docs` 目录，因为 `docs/index.html` 本身就是可直接托管的静态页面。
