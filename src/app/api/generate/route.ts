export async function POST(req: Request) {
  const { topic, style, language } = await req.json();

  const styleGuide = style === 'professional' 
    ? '专业、正式、学术性强'
    : style === 'casual'
    ? '轻松、友好、口语化'
    : '平衡、实用、易懂';

  const systemPrompt = `你是一位专业的博客写手。请根据以下主题写一篇高质量的博客文章。

要求：
- 语言：${language === 'zh' ? '中文' : '英文'}
- 风格：${styleGuide}
- 长度：800-1500 字
- SEO优化：包含相关关键词
- 结构：开头引入、主体论述、总结结语

请直接输出文章内容，不要有前缀说明。`;

  try {
    const response = await fetch('https://api.minimaxi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `主题：${topic}` }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MiniMax API error:', errorText);
      return Response.json({ error: 'API调用失败: ' + errorText }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '生成失败';

    return Response.json({ content });
  } catch (error) {
    console.error('Generate error:', error);
    return Response.json({ error: '生成失败，请重试' }, { status: 500 });
  }
}
