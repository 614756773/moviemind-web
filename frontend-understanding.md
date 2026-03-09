## moviemind 前端整体理解（moviemind-web）

**最后更新：** 2026-03-09  
**技术栈：** Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS + Radix UI / shadcn 风格组件

---

## 1. 路由与页面结构

- **应用入口**
  - `app/layout.tsx`：全局布局，设置中文 `lang="zh-CN"`，引入 `globals.css`，接入 Vercel Analytics。
  - `app/page.tsx`：根路径 `/`，直接 `redirect("/login")`，因此默认入口为登录页。

- **认证与主工作区**
  - `app/login/page.tsx`
    - 登录表单（用户名 + 密码），目前逻辑是**模拟登录**：
      - 校验仅在前端完成：用户名和密码非空即视为成功。
      - 成功后：`sessionStorage.setItem("user", { username })`，然后跳转 `/dashboard`。
      - 失败时只在前端显示错误文案。
    - 真实环境中，这里应替换为调用后端认证接口。

  - `app/dashboard/layout.tsx`
    - Dashboard 的共享布局：左侧为 `AppSidebar` 侧边栏，右侧 `SidebarInset` 中放置各功能页面。
    - 所有 `/dashboard/*` 子路由均在该布局内部渲染。

- **Dashboard 子页面**
  - `app/dashboard/page.tsx`：**电影推荐主页面**
    - 使用 demo 数据 `demoRecommendations` 和 `demoReminders`，模拟从后端获取的推荐结果和评分提醒。
    - 核心交互：
      - “换一批”：按钮触发 `handleRefresh`，目前是 `setTimeout` 模拟 1s 加载。
      - “不感兴趣” / “采纳”：通过过滤本地 `recommendations` state 实现，尚未接后端。
      - “待评分提醒”：使用 `ReminderCard` 组件，可“还没看”“去评分”（目前只从列表中移除）。
      - 新用户 Onboarding：通过 `sessionStorage.getItem("userPreferences")` 判断，如不存在则显示 `OnboardingBanner`。

  - `app/dashboard/preferences/page.tsx`：**偏好管理（已看电影 + 标签）**
    - 用 `demoPreferences` 初始化本地偏好列表，**完全在前端内存中管理**。
    - 主要数据结构 `Preference`：
      - `title`（电影名）、`rating`（1-10）、`notes`（备注）、`tags`（标签数组）、`addedAt`（日期）。
    - 功能点：
      - 搜索框：按标题模糊过滤。
      - 排序：支持按添加时间、评分、标题排序。
      - 新增 / 编辑 / 删除偏好：
        - 通过 Dialog + 表单（标题、评分滑块、备注、多标签选择+自定义标签）实现。
        - 保存时若是编辑会按 `id` 替换，否则在列表前端插入一条。
      - 预设标签 `presetTags`：常见类型/风格（动作、喜剧、烧脑、治愈等），可点击切换选中状态。
      - 自定义标签：输入框 + `添加` 按钮创建新标签，并以 Badge 展示，可再次点击移除。
    - 当前实现中，偏好只存在于组件状态中，未与后端同步。

  - `app/dashboard/watchlist/page.tsx`：**待看清单 / 已看清单**
    - 使用 `demoWatchlist` 作为本地 watchlist 数据源，结构 `WatchlistItem`：
      - `watched` 区分待看/已看，`rating`、`notes`、`watchedAt` 仅对已看有效。
    - 视图划分：
      - Tab “待看”：
        - 列表展示电影海报、类型、AI 推荐理由、添加时间。
        - 若添加天数 > 7 天，打上“已添加 X 天”的提示，带 warning 样式。
        - 操作：从列表删除、点击“标记为已看”弹出评分 Dialog。
      - Tab “已看”：
        - 展示评分（星标图标 + 分数）、观看日期、备注，以及删除按钮。
    - 状态变化：
      - 点击“标记为已看”：打开评分 Dialog，设置评分+备注后更新对应 item 为 `watched: true` 并填充 `rating`、`notes`、`watchedAt`。
      - 所有数据变化目前仅保留在本页面的 `useState` 中。

  - `app/dashboard/settings/page.tsx`：**设置页**
    - 账户信息：
      - 用户名：从 `sessionStorage.user` 读取 `username`，只读展示，不可修改。
      - 修改密码：通过 Dialog 弹窗输入当前密码和新密码，在前端用 `setTimeout` 模拟更新，无真实后端交互。
    - 通知设置：
      - `notifications.watchReminders`：观影提醒。
      - `notifications.newRecommendations`：新推荐通知。
      - `notifications.weeklyDigest`：每周摘要。
      - 目前只存在组件本地状态，不持久化。
    - 危险区域：
      - “清除所有数据”：`sessionStorage.clear()` 并跳转 `/login`。
      - “退出登录”：删除 `sessionStorage.user` 并跳转 `/login`。

---

## 2. 核心组件概览

- **`AppSidebar`（侧边栏）**
  - 使用自定义 `Sidebar` 组件构建。左侧导航项：
    - “电影推荐” → `/dashboard`
    - “偏好管理” → `/dashboard/preferences`
    - “待看清单” → `/dashboard/watchlist`
    - “设置” → `/dashboard/settings`
  - 当前路径高亮逻辑：精确匹配或 `pathname.startsWith(item.href)`。
  - 底部用户信息区域：
    - 头像 + 用户名（来自 `sessionStorage.user.username`，默认“用户”）。
    - 下拉菜单：跳转“设置”、执行“退出登录”。

- **`MovieCard`**
  - 展示单个推荐电影卡片：
    - 海报、年份、评分 Badge、前三个类型标签。
    - AI 推荐理由（`aiReason`）在一个带高亮背景的区域内展示。
    - 操作按钮：
      - “不感兴趣” → 调用父组件传入的 `onReject`（推荐列表移除）。
      - “采纳” → 调用 `onAdopt`（后续可扩展为加入待看清单 + 调用后端）。

- **`ReminderCard`**
  - 用于“待评分提醒”列表：
    - 显示小海报、片名、距采纳天数（根据 `adoptedDate` 计算）。
    - 操作按钮：
      - “还没看” → 通常仅移除提醒。
      - “去评分” → 未来可跳转到某个评分入口或打开评分弹窗。

- **`OnboardingBanner`**
  - 针对没有偏好数据的新用户，在推荐页顶部展示欢迎 Banner。
  - 提示用户前往“偏好管理”页面添加已看电影，以提升推荐质量。
  - 提供“暂时跳过”和“添加偏好”两个行动按钮。

- **通用 UI 组件**
  - 大部分 UI 来自 `components/ui/*`，包括 `button`、`card`、`tabs`、`dialog`、`switch`、`field`、`sidebar` 等。
  - 样式体系基于 Tailwind + shadcn 设计规范，颜色/间距统一。

---

## 3. 状态与数据流（当前实现）

- **会话级状态（伪登录）**
  - 登录成功时仅在 `sessionStorage` 中存储：
    - key: `"user"`，value: `{"username": "..."}`
  - 退出登录 / 清除数据时，会清空 `sessionStorage` 并跳转登录页。
  - 目前前端没有基于该状态做路由守卫（如未登录访问 `/dashboard` 仍然可以），后续可补充：
    - 在 `app/dashboard/layout.tsx` 或中间件里统一校验 `sessionStorage.user` / Cookie / Token。

- **推荐 / 偏好 / 待看数据**
  - `demoRecommendations`、`demoPreferences`、`demoWatchlist` 等都写死在前端。
  - 对这些数据的增删改目前全部只存在于组件内部的 `useState` 中：
    - 刷新推荐、采纳/拒绝推荐。
    - 添加/编辑/删除偏好。
    - 待看清单中标记已看、删除条目。
  - 与后端尚未打通的潜在接口点：
    - 获取推荐列表：GET `/api/recommendations`。
    - 同步偏好：增删改 + 查询偏好列表。
    - 同步 watchlist：采纳推荐时创建条目、标记已看时回写评分。

- **本地存储使用**
  - 登录信息与“是否有偏好数据”都通过 `sessionStorage` 进行简单演示。
  - 偏好和 watchlist 的实际内容尚未本地持久化（页面刷新会丢失），后续可以：
    - 在与后端联调前先用 `localStorage` 模拟持久层。
    - 正式接后端后以 token + API 为主。

---

## 4. 与后端（moviemind-server）的预期集成点（建议）

> 以下是基于当前前端结构推测/建议的后端接口与集成方式，方便后续你设计 `moviemind-server` 或调整前端。

- **认证**
  - 替换 `login/page.tsx` 中 `setTimeout` 模拟逻辑为真实调用：
    - `POST /api/auth/login` → 返回 token + 用户基本信息。
    - 将 token 保存到 Cookie 或 `localStorage` 中，并在前端请求时携带。
  - 可考虑在 Next.js 中使用 Middleware 对 `/dashboard/*` 做登录校验。

- **推荐服务**
  - `/dashboard/page.tsx`：
    - 读取当前用户 ID，从后端获取推荐结果：
      - `GET /api/recommendations?userId=...`
    - “换一批”：
      - 可重新请求推荐或传入 `offset` / `page` 参数。
    - “采纳”：
      - 点击采纳时调用后端接口：
        - `POST /api/watchlist`（创建待看记录），并通知推荐系统用户已接受该推荐。
    - “不感兴趣”：
      - `POST /api/feedback`，记录该电影被拒绝，可用于调优算法。

- **偏好管理**
  - `preferences/page.tsx`：
    - 页面初始化时请求用户的历史评分+标签：
      - `GET /api/preferences`。
    - 保存时：
      - 新增：`POST /api/preferences`
      - 编辑：`PUT /api/preferences/:id`
      - 删除：`DELETE /api/preferences/:id`
    - 后端可以用这些数据训练/更新用户画像和推荐模型。

- **待看清单 / 评分流程**
  - `watchlist/page.tsx`：
    - 初始化：`GET /api/watchlist`。
    - 删除条目：`DELETE /api/watchlist/:id`。
    - “标记为已看 + 评分”：
      - `POST /api/ratings` 或 `PUT /api/watchlist/:id/rating`，同时更新 watched 状态。
    - “待评分提醒”（首页 `demoReminders`）：
      - 可以由后端根据“已采纳但没有评分”的记录生成返回。

- **设置 / 通知偏好**
  - `settings/page.tsx`：
    - 通知开关：`GET/PUT /api/settings/notifications`。
    - 修改密码：`POST /api/auth/change-password`。
    - 清除数据：提供一个危险接口 `DELETE /api/user/data` 或后台管理功能（前端只调用一次即可）。

---

## 5. 后续协作建议

- **若以后我需要“记住”前端结构或接口约定**，可以直接引用本文件中各小节，例如：
  - “推荐页数据流请参考 `frontend-understanding.md` 的第 3 节”。
  - “后端评分接口我们按第 4 节推荐的路径来设计”。
- 当前前端以**交互 Demo 为主**，逻辑清晰、组件拆分良好，非常适合按上述集成点逐步接入 `moviemind-server`。

