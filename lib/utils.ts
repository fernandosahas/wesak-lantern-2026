import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { NextRequest } from "next/server"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-LK").format(value)
}

export function calcPercentage(value: number, total: number) {
  if (total <= 0) return 0
  return Math.round((value / total) * 100)
}

export function timeAgo(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value)
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))

  if (seconds < 60) return "just now"

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ]

  const interval = intervals.find((item) => seconds >= item.seconds)
  if (!interval) return "just now"

  const count = Math.floor(seconds / interval.seconds)
  return `${count} ${interval.label}${count === 1 ? "" : "s"} ago`
}

export function getClientIP(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) return forwardedFor.split(",")[0].trim()

  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    "unknown"
  )
}

export function hashIP(ip: string) {
  let hash = 0x811c9dc5
  const input = `${ip}:${process.env.IP_HASH_SALT ?? ""}`

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }

  return (hash >>> 0).toString(16).padStart(8, "0")
}

export async function validateTurnstile(token: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true

  const body = new FormData()
  body.append("secret", secret)
  body.append("response", token)
  if (ip && ip !== "unknown") body.append("remoteip", ip)

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  })

  if (!response.ok) return false

  const result = (await response.json()) as { success?: boolean }
  return result.success === true
}
