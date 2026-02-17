'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('balanced');
  const [language, setLanguage] = useState('zh');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [remaining, setRemaining] = useState(5);
  const [isPro, setIsPro] = useState(false);

  // Check usage on mount
  useEffect(() => {
    const checkUsage = async () => {
      const identifier = session?.user?.email || 'anonymous';
      try {
        const res = await fetch(`/api/usage?identifier=${encodeURIComponent(identifier)}`);
        const data = await res.json();
        setRemaining(data.remaining === 'unlimited' ? 999 : (data.remaining || 0));
        setIsPro(data.isPro || false);
      } catch (e) {
        console.error('Failed to check usage:', e);
      }
    };
    checkUsage();
  }, [session]);

  const generate = async () => {
    if (!topic.trim()) return;
    
    // Check usage for non-logged in users
    if (!session && remaining <= 0) {
      alert('今日免费次数已用完！请登录或明天再来');
      return;
    }

    // Check with API for usage tracking
    if (session?.user?.email) {
      try {
        const checkRes = await fetch('/api/usage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: session.user.email }),
        });
        const checkData = await checkRes.json();
        
        if (!checkData.allowed) {
          alert(checkData.message || '次数已用完');
          return;
        }
      } catch (e) {
        console.error('Usage check failed:', e);
      }
    }

    setLoading(true);
    setDisplayProgress(0);
    setContent('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style, language }),
      });

      if (!res.ok) {
        const data = await res.json();
        setContent(data.error || '生成失败，请重试');
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (!reader) {
        setLoading(false);
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.progress !== undefined) {
                setDisplayProgress(prev => Math.max(prev, data.progress));
              }
              
              if (data.content) {
                setContent(prev => prev + data.content);
              }
              
              if (data.done) {
                setDisplayProgress(100);
                setLoading(false);
                // Track usage
                const identifier = session?.user?.email || 'anonymous';
                await fetch('/api/usage', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ identifier }),
                });
                // Refresh remaining count
                const res2 = await fetch(`/api/usage?identifier=${encodeURIComponent(identifier)}`);
                const data2 = await res2.json();
                setRemaining(data2.remaining === 'unlimited' ? 999 : (data2.remaining || 0));
                setIsPro(data2.isPro || false);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (e) {
      setContent('生成失败，请重试');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    alert('已复制到剪贴板！');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ✍️ BlogAI
          </h1>
          <div className="flex items-center gap-4">
            {!session && remaining > 0 && (
              <span className="text-xs bg-green-100 text-green-700 rounded-full px-3 py-1">
                今日剩余 {remaining} 次
              </span>
            )}
            {isPro && (
              <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-3 py-1 font-medium">
                💎 Pro
              </span>
            )}
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:inline">{session.user?.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  退出
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                登录
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 text-center px-4">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI 博客写作助手
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          几秒钟内生成高质量、SEO 优化的博客文章。支持中英文，多种写作风格。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#generate" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition">
            立即体验
          </a>
          <a href="#features" className="bg-white text-gray-700 px-8 py-3 rounded-full font-medium border border-gray-200 hover:bg-gray-50 transition">
            了解更多
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">✨ 核心功能</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-lg font-semibold mb-2">AI 驱动</h4>
              <p className="text-gray-600">使用先进的 AI 模型，生成专业、高质量的内容</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-lg font-semibold mb-2">快速生成</h4>
              <p className="text-gray-600">几秒钟内完成文章创作，无需等待</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-lg font-semibold mb-2">多风格支持</h4>
              <p className="text-gray-600">专业、平衡、轻松等多种写作风格</p>
            </div>
          </div>
        </div>
      </section>

      {/* Generate Section */}
      <section id="generate" className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-4">📝 输入主题</h2>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例如：AI对未来工作的影响"
                  className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">写作风格</label>
                    <div className="flex gap-2 flex-wrap">
                      {['professional', 'balanced', 'casual'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setStyle(s)}
                          className={`px-4 py-2 rounded-lg text-sm transition ${
                            style === s
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {s === 'professional' ? '专业' : s === 'casual' ? '轻松' : '平衡'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">语言</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setLanguage('zh')}
                        className={`px-4 py-2 rounded-lg text-sm transition ${
                          language === 'zh'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        🇨🇳 中文
                      </button>
                      <button
                        onClick={() => setLanguage('en')}
                        className={`px-4 py-2 rounded-lg text-sm transition ${
                          language === 'en'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        🇺🇸 English
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={generate}
                  disabled={loading || !topic.trim()}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? `🤔 AI 写作中 ${displayProgress}%` : '🚀 生成博客文章'}
                </button>

                {/* 进度条 */}
                {loading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>正在生成...</span>
                      <span>{displayProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${displayProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Card */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">💎 Pro 会员</h3>
                <p className="text-indigo-100 text-sm mb-4">无限次数生成，支持更多功能</p>
                <div className="text-3xl font-bold mb-4">$9<span className="text-lg font-normal">/月</span></div>
                <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-50 transition">
                  即将推出
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">📄 生成结果</h2>
                {content && (
                  <button
                    onClick={copyToClipboard}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    📋 复制
                  </button>
                )}
              </div>
              
              <div className="min-h-[400px] p-4 bg-gray-50 rounded-xl border border-gray-100">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-4xl mb-4">✍️</div>
                    <p className="text-gray-500 mb-2">AI 正在创作中...</p>
                    <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${displayProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-indigo-600 text-sm mt-2">{displayProgress}%</p>
                  </div>
                ) : content ? (
                  <div className="prose prose-indigo max-w-none whitespace-pre-wrap text-sm">
                    {content}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>输入主题后点击生成按钮</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 BlogAI - AI 博客写作助手</p>
        </div>
      </footer>
    </div>
  );
}
