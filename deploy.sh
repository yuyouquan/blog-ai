#!/bin/bash
# BlogAI 部署脚本

cd "$(dirname "$0")"

echo "正在推送代码到 GitHub..."

# 添加远程仓库
git remote add origin https://github.com/yuyouquan/blog-ai.git 2>/dev/null

# 切换到 main 分支
git branch -M main

# 推送到 GitHub
git push -u origin main

echo ""
echo "✅ 推送完成！"
echo ""
echo "下一步："
echo "1. 打开 https://vercel.com"
echo "2. 使用 transsionpublic@gmail.com 登录"
echo "3. 点击 Import Project"
echo "4. 选择 blog-ai 仓库"
echo "5. 在 Environment Variables 中添加："
echo "   MINIMAX_API_KEY=sk-cp-RbXjlT3ez_OaSzJ_Sb89ft8reiMhdsQf6stAT-2UkRwLSepi79tpthjpZCUBQN88vT890B72EtsBgkjpZY5V1mGffbjZoIaIVjqw-L2vkZSABVAsEcZJNxI"
echo "6. 点击 Deploy"
