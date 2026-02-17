'use client';

import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('balanced');
  const [language, setLanguage] = useState('zh');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setProgress(0);
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
                setProgress(data.progress);
              }
              
              if (data.content) {
                setContent(prev => prev + data.content);
              }
              
              if (data.done) {
                setProgress(100);
                setLoading(false);
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ✍️ BlogAI
          </h1>
          <span className="text-sm text-gray-500">AI 博客写作助手</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* 输入面板 */}
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
                  <div className="flex gap-2">
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
                      ��🇨 中文
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
                {loading ? `🤔 AI 写作中 ${progress}%` : '🚀 生成博客文章'}
              </button>

              {/* 进度条 */}
              {loading && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>正在生成...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* 定价卡片 */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">💎 Pro 会员</h3>
              <p className="text-indigo-100 text-sm mb-4">无限次数生成，支持更多功能</p>
              <div className="text-3xl font-bold mb-4">$9<span className="text-lg font-normal">/月</span></div>
              <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-50 transition">
                立即升级
              </button>
            </div>
          </div>

          {/* 输出面板 */}
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
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-indigo-600 text-sm mt-2">{progress}%</p>
                </div>
              ) : content ? (
                <div className="prose prose-indigo max-w-none whitespace-pre-wrap">
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
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
        © 2026 BlogAI - AI 博客写作助手
      </footer>
    </div>
  );
}
