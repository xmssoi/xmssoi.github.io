# AGENTS.md — xmssoi/xmssoi.github.io（厦门双十中学竞赛数据库）

Codex 只读本档（不读 CLAUDE.md）。在目标仓库 clone 内按 goal 施工，止于 commit；push/PR 由 foreman 负责。

## 项目
React 18 单页应用，**Vite 5 构建**，`react-router-dom` 路由，`recharts` 出图。数据驱动：界面读 `src/data/*.json`，原始数据由根目录 Python 脚本转换生成。部署 main → `gh-pages`（`npm run build` 出 `dist/`，`npm run deploy`）。
- 入口 `index.html` → `src/main.jsx` → `src/App.jsx`
- 页面 `src/pages/*`（Home/Search/Statistics/Timeline/Admin）
- 全局数据 `src/context/DataContext.jsx`；数据契约 `src/utils/dataSchema.js`
- 数据 `src/data/*.json`（apio/awards/csp/noi/noip/students）
- 数据转换脚本 `convert_data.py` / `convert_students.py`（原始数据 → JSON）
- 样式 `src/index.css` / `src/App.css`；静态资源 `public/`、`src/assets/`、`picture/`

## 自验（必须本地跑并贴结果）
- `npm ci`（或 `npm install`）后 `npm run build` 必须通过——`vite build` 报错即失败。
- 有 lint 改动跑 `npx eslint .`（见 `eslint.config.js`），零 error。
- UI/交互改动：`npm run dev` 本地起站，核对相关页面渲染正常、**零控制台错误**；移动端响应式按需核对。
- 改 `src/data/*.json` 必须与 `src/utils/dataSchema.js` 的契约一致；改了转换脚本须说明输入输出，不得只改 JSON 不改脚本（或反之）造成漂移。

## 红线（违则 PR 必拒）
- 不改既有数据契约（`dataSchema.js` 的字段/形状、各 `data/*.json` 的键结构）除非 goal 明确要求；变更须在 PR body 列出受影响页面。
- `node_modules`、`dist/` 不得入库（`.gitignore` 已挡）；不得提交构建产物。
- 不部署、不动 `gh-pages` 分支；涉及部署的事项只在 PR body 标注「部署待人工」。
- 不写入任何 token、密码、auth.json。
- 不 merge、不 force-push、不改 main 或既有分支；分支已由 foreman 建好（`foreman/issue-N`），只在其上 commit。

## 不交自动化（留给人工）
真实竞赛数据的录入与核验、视觉终审、产品级范围拆分一类需事实判断与设计取舍之活**不由 Codex 执行**；此类工单挂 `no-agent`（如 issue #1：空验收标准、从零搭整站的开放式需求）。待拆为范围明确、带命令级验收的子单后再逐单放行。
