import { nanoid } from 'nanoid'
import type { Answer, Axes, Session } from './types'

const KEY = 'delulu.sessions.v1'

type LocalStore = Record<string, Session>

function readLocal(): LocalStore {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as LocalStore) : {}
  } catch {
    return {}
  }
}

function writeLocal(store: LocalStore) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    /* quota / private mode — ignore */
  }
}

export function cacheSession(session: Session) {
  const store = readLocal()
  store[session.id] = session
  writeLocal(store)
}

export function getCachedSession(id: string): Session | null {
  return readLocal()[id] ?? null
}

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

export type CreateInput = {
  a: {
    name: string
    hook: string
    styleKey: string
    priorities: string[]
    baseline: Axes
    look?: string
  }
  b: { name: string; look?: string }
}

export async function createSession(input: CreateInput): Promise<Session> {
  const remote = await request<Session>('/api/sessions', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  if (remote) {
    cacheSession(remote)
    return remote
  }
  const session: Session = {
    id: nanoid(9),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    a: input.a,
    b: input.b,
    answers: [],
    status: 'waiting_b',
    localOnly: true,
  }
  cacheSession(session)
  return session
}

export async function getSession(id: string): Promise<Session | null> {
  const remote = await request<Session>(`/api/sessions/${encodeURIComponent(id)}`)
  if (remote) {
    cacheSession(remote)
    return remote
  }
  return getCachedSession(id)
}

export async function patchSession(
  id: string,
  patch: { answers?: Answer[]; status?: Session['status']; b?: { name: string } },
): Promise<Session | null> {
  const local = getCachedSession(id)
  if (local) {
    const merged: Session = {
      ...local,
      ...patch,
      b: { ...local.b, ...(patch.b || {}) },
      updatedAt: Date.now(),
    }
    cacheSession(merged)
  }
  const remote = await request<Session>(`/api/sessions/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
  if (remote) cacheSession(remote)
  return remote ?? getCachedSession(id)
}

export function inviteUrl(id: string) {
  return `${window.location.origin}/play/${id}`
}

export function reportUrl(id: string) {
  return `${window.location.origin}/report/${id}`
}
