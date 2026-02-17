import { Redis } from '@upstash/redis';

// Simple in-memory store for development
const memoryStore = new Map<string, any>();

let redis: Redis | null = null;

function getRedis() {
  if (!redis && process.env.UPSTASH_REDIS_REST_URL) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

// User operations - with fallback to memory if Redis not configured
export async function getUser(email: string) {
  const r = getRedis();
  if (!r) {
    return memoryStore.get(`user:${email}`);
  }
  
  try {
    return await r.hgetall(`user:${email}`);
  } catch (e) {
    console.error('Redis error:', e);
    return memoryStore.get(`user:${email}`);
  }
}

export async function createUser(email: string, password: string) {
  const user = {
    email,
    password,
    createdAt: new Date().toISOString(),
    isPro: 'false',
    usageCount: '0',
  };
  
  const r = getRedis();
  if (!r) {
    memoryStore.set(`user:${email}`, user);
    return user;
  }
  
  try {
    await r.hset(`user:${email}`, user);
  } catch (e) {
    console.error('Redis error:', e);
    memoryStore.set(`user:${email}`, user);
  }
  return user;
}

export async function setUserPro(email: string, isPro: boolean) {
  const value = isPro ? 'true' : 'false';
  
  const r = getRedis();
  if (!r) {
    const user = memoryStore.get(`user:${email}`);
    if (user) { user.isPro = value; }
    return;
  }
  
  try {
    await r.hset(`user:${email}`, { isPro: value });
  } catch (e) {
    console.error('Redis error:', e);
  }
}

export async function getUserUsage(email: string) {
  const key = `usage:${email}:${getToday()}`;
  
  const r = getRedis();
  if (!r) {
    return parseInt(memoryStore.get(key) || '0');
  }
  
  try {
    const count = await r.get(key);
    return parseInt(count as string || '0');
  } catch (e) {
    console.error('Redis error:', e);
    return parseInt(memoryStore.get(key) || '0');
  }
}

export async function incrementUserUsage(email: string) {
  const key = `usage:${email}:${getToday()}`;
  
  const r = getRedis();
  if (!r) {
    const current = parseInt(memoryStore.get(key) || '0');
    memoryStore.set(key, (current + 1).toString());
    return;
  }
  
  try {
    await r.incr(key);
    await r.expire(key, 86400 * 2);
  } catch (e) {
    console.error('Redis error:', e);
  }
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}
