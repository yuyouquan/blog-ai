import { NextResponse } from 'next/server';
import { setUserPro, getUser } from '@/lib/db';

export async function POST(req: Request) {
  const { email, secret } = await req.json();

  // Simple secret for manual upgrade (in production use proper admin auth)
  const UPGRADE_SECRET = process.env.UPGRADE_SECRET || 'blogai-admin-2026';
  
  if (secret !== UPGRADE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    await setUserPro(email, true);
    return NextResponse.json({ success: true, message: `用户 ${email} 已升级为 Pro 会员` });
  } catch (error) {
    console.error('Upgrade error:', error);
    return NextResponse.json({ error: '升级失败' }, { status: 500 });
  }
}
