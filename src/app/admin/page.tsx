'use client';

import { useState } from 'react';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const upgrade = async () => {
    if (!email || !secret) {
      setResult('请填写邮箱和密钥');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/admin/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, secret }),
      });
      const data = await res.json();
      setResult(data.success ? '✅ ' + data.message : '❌ ' + data.error);
    } catch (e) {
      setResult('❌ 请求失败');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🔧 管理员后台
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">用户邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">升级密钥</label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="输入升级密钥"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {result && (
            <p className="text-center text-sm">{result}</p>
          )}

          <button
            onClick={upgrade}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition"
          >
            {loading ? '处理中...' : '升级为 Pro 会员'}
          </button>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          仅供管理员使用
        </p>
      </div>
    </div>
  );
}
