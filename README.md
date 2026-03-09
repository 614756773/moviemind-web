## moviemind-web 启动说明

### 1. 环境要求

- 建议使用 **Node.js 18+**（LTS 版本更稳定）。
- 包管理工具优先使用 **pnpm**（仓库中存在 `pnpm-lock.yaml`）。

### 2. 安装依赖

在项目根目录下先进入前端工程目录：

```bash
cd moviemind-web
```

使用 pnpm 安装依赖（推荐）：

```bash
pnpm install
```

如果本机没有 pnpm，也可以使用 npm：

```bash
npm install
```

### 3. 启动开发环境

在 `moviemind-web` 目录下运行：

**使用 pnpm：**

```bash
pnpm dev
```

**或使用 npm：**

```bash
npm run dev
```

默认会在 `http://localhost:3000` 启动 Next.js 开发服务器，浏览器访问该地址即可打开前端应用。
