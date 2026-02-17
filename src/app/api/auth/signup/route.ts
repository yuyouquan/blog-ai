import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // For demo - in production use a real database
  // Store user in KV or database
  return NextResponse.json({ 
    success: true, 
    message: 'Account created. Please sign in.' 
  });
}
