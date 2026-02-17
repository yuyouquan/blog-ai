# BlogAI 部署指南

## 方案 1: Vercel 部署（推荐）

### 步骤 1: 安装 Vercel CLI
```bash
npm install -g vercel
```

### 步骤 2: 登录 Vercel
```bash
vercel login
```
使用邮箱：transsionpublic@gmail.com

### 步骤 3: 部署
```bash
vercel
```

按提示操作：
- Set up and deploy? **Y**
- Which scope? 选择你的 Vercel 账号
- Link to existing project? **N**
- Project name: **blog-ai**
- Directory? **./**
- Want to modify settings? **N**

### 步骤 4: 添加环境变量
在 Vercel Dashboard 中：
1. 进入项目 Settings → Environment Variables
2. 添加：`MINIMAX_API_KEY`
3. 值：`sk-cp-RbXjlT3ez_OaSzJ_Sb89ft8reiMhdsQf6stAT-2UkRwLSepi79tpthjpZCUBQN88vT890B72EtsBgkjpZY5V1mGffbjZoIaIVjqw-L2vkZSABVAsEcZJNxI`

### 步骤 5: 重新部署
在 Vercel 中点击 "Deployments" → 最新部署 → "..." → Redeploy

---

## 方案 2: GitHub + Vercel

### 步骤 1: 创建 GitHub 仓库
1. 打开 https://github.com/new
2. Repository name: blog-ai
3. Public / Private: Private
4. 点击 Create repository

### 步骤 2: 推送代码
```bash
gh auth login
# 使用 GitHub 邮箱登录

cd /Users/snoopy/.openclaw/workspace/projects/blog-ai
gh repo create blog-ai --public --source=. --push
```

### 步骤 3: 连接 Vercel
1. 打开 https://vercel.com
2. 使用 transsionpublic@gmail.com 登录
3. Import GitHub repository "blog-ai"
4. 添加环境变量 MINIMAX_API_KEY
5. Deploy

---

## 部署后

部署完成后，你将获得一个免费的 URL，例如：
`https://blog-ai.vercel.app`

然后可以：
1. 购买域名（可选）
2. 配置自定义域名
3. 申请 Stripe 支付
