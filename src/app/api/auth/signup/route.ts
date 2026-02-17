import { NextResponse } from 'next/server';
import { createUser, getUser } from '@/lib/db';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    // Check if user exists
    const existing = await getUser(email);
    if (existing) {
      return NextResponse.json({ error: '用户已存在' }, { status: 400 });
    }

    // Create new user
    await createUser(email, password);
    
    return NextResponse.json({ success: true, message: '注册成功！请登录' });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: '注册失败' }, { status: 500 });
  }
}
