import { NextResponse } from 'next/server';
import { getUser, getUserUsage, incrementUserUsage } from '@/lib/db';

export async function POST(req: Request) {
  const { identifier } = await req.json();
  
  if (!identifier || identifier === 'anonymous') {
    return NextResponse.json({ allowed: false, message: '请先登录' });
  }

  try {
    // Check if user is Pro
    const user = await getUser(identifier);
    if (user?.isPro === 'true') {
      // Pro users have unlimited usage
      await incrementUserUsage(identifier);
      return NextResponse.json({ allowed: true, remaining: 'unlimited', isPro: true });
    }

    const usage = await getUserUsage(identifier);
    const maxFree = 5;
    
    if (usage >= maxFree) {
      return NextResponse.json({ 
        allowed: false, 
        remaining: 0,
        message: '今日免费次数已用完，请升级 Pro 会员' 
      });
    }
    
    await incrementUserUsage(identifier);
    
    return NextResponse.json({ 
      allowed: true, 
      remaining: maxFree - usage - 1,
      isPro: false
    });
  } catch (error) {
    console.error('Usage error:', error);
    // Default to allow on error
    return NextResponse.json({ allowed: true, remaining: 0 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const identifier = searchParams.get('identifier') || 'anonymous';
  
  if (!identifier || identifier === 'anonymous') {
    return NextResponse.json({ used: 0, remaining: 0, isPro: false });
  }

  try {
    const user = await getUser(identifier);
    if (user?.isPro === 'true') {
      return NextResponse.json({ used: 0, remaining: 'unlimited', isPro: true });
    }

    const usage = await getUserUsage(identifier);
    
    return NextResponse.json({ 
      used: usage, 
      remaining: Math.max(0, 5 - usage),
      isPro: false,
      maxFree: 5
    });
  } catch (error) {
    return NextResponse.json({ used: 0, remaining: 5, isPro: false });
  }
}
