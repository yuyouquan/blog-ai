export const metadata = {
  title: '关于 - BlogAI',
  description: '关于 BlogAI - AI 博客写作助手',
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          关于 BlogAI
        </h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">🤖 我们是谁</h2>
            <p className="text-gray-600">
              BlogAI 是一款 AI 驱动的博客写作助手，帮助内容创作者快速生成高质量的博客文章。
              我们相信 AI 应该成为创作者的助手，而不是替代者。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">✨ 核心功能</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>AI 驱动的文章生成</li>
              <li>多种写作风格（专业、平衡、轻松）</li>
              <li>中英文支持</li>
              <li>SEO 优化内容</li>
              <li>快速生成，几秒钟内完成</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">🛠 技术栈</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Next.js 16 - React 框架</li>
              <li>Tailwind CSS - 样式设计</li>
              <li>MiniMax AI - 大语言模型</li>
              <li>NextAuth.js - 用户认证</li>
              <li>Vercel - 云端部署</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">📱 访问我们</h2>
            <p className="text-gray-600">
              网站：<a href="https://blog-ai-sage.vercel.app" className="text-indigo-600 hover:underline">blog-ai-sage.vercel.app</a>
            </p>
            <p className="text-gray-600">
              GitHub：<a href="https://github.com/yuyouquan/blog-ai" className="text-indigo-600 hover:underline">github.com/yuyouquan/blog-ai</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">📄 使用条款</h2>
            <p className="text-gray-600 text-sm">
              使用 BlogAI 生成的内容仅供参老，您需要对生成的内容进行审核和修改。
              请遵守相关法律法规，不要生成违法内容。
            </p>
          </section>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          © 2026 BlogAI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
