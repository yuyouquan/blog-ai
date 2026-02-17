import { NextResponse } from 'next/server';

// Simple in-memory store for demo (use Redis/DB in production)
const usageStore = new Map<string, { count: number; date: string }>();

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export async function POST(req: Request) {
  const { identifier } = await req.json();
  
  const today = getToday();
  const key = `${identifier}_${today}`;
  
  const usage = usageStore.get(key) || { count: 0, date: today };
  
  // Free users get 5 requests per day
  const maxFree = 5;
  
  if (usage.count >= maxFree) {
    return NextResponse.json({ 
      allowed: false, 
      remaining: 0,
      message: '今日免费次数已用完，请明天再来或升级 Pro 会员' 
    });
  }
  
  usage.count += 1;
  usageStore.set(key, usage);
  
  return NextResponse.json({ 
    allowed: true, 
    remaining: maxFree - usage.count 
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const identifier = searchParams.get('identifier') || 'anonymous';
  
  const today = getToday();
  const key = `${identifier}_${today}`;
  const usage = usageStore.get(key) || { count: 0, date: today };
  
  return NextResponse.json({ 
    used: usage.count, 
    remaining: 5 - usage.count,
    maxFree: 5
  });
}
