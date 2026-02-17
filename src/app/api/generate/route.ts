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
        temperature: 0.7,
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MiniMax API error:', errorText);
      return new Response(JSON.stringify({ error: 'API调用失败: ' + errorText }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = '';
        let sentProgress = false;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += new TextDecoder().decode(value);
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: {"done": true}\n\n'));
                  controller.close();
                  return;
                }

                try {
                  const json = JSON.parse(data);
                  const content = json.choices?.[0]?.delta?.content || '';
                  if (content) {
                    // Send progress update (simulated based on content length)
                    const progress = Math.min(95, 30 + (content.length * 0.5));
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ progress: Math.floor(progress), content })}\n\n`));
                    sentProgress = true;
                  }
                } catch (e) {
                  // Ignore parse errors for incomplete chunks
                }
              }
            }
          }
        } catch (e) {
          console.error('Stream error:', e);
        } finally {
          if (!sentProgress) {
            controller.enqueue(encoder.encode('data: {"progress": 100, "done": true}\n\n'));
          }
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Generate error:', error);
    return new Response(JSON.stringify({ error: '生成失败，请重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
