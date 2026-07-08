"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Clock, Trash2, Loader2, Wifi } from "lucide-react"
import { useTranslations } from "next-intl"

interface SearchSectionProps {
  locale: string
}

export default function SearchSection({ locale }: SearchSectionProps) {
  const router = useRouter()
  const t = useTranslations("Home")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [detectedIp, setDetectedIp] = useState<string | null>(null)
  const [detecting, setDetecting] = useState(true)
  const [history, setHistory] = useState<string[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("ip_history")
    if (stored) {
      try { setHistory(JSON.parse(stored)) } catch {}
    }
  }, [])

  // Detect client IP once on mount — no auto-redirect, just display
  useEffect(() => {
    let cancelled = false
    const detect = async () => {
      try {
        // Always fetch fresh, no browser cache
        const res = await fetch("/api/detect", { cache: "no-store" })
        const data = await res.json()

        if (!cancelled) {
          if (data?.ip) {
            // Server successfully read the real IP from headers
            setDetectedIp(data.ip)
          } else if (data?.local) {
            // Local dev: server can't see real IP, ask ipify directly from client
            const ipifyRes = await fetch("https://api.ipify.org?format=json", { cache: "no-store" })
            const ipifyData = await ipifyRes.json()
            if (!cancelled && ipifyData?.ip) {
              setDetectedIp(ipifyData.ip)
            }
          }
        }
      } catch {}
      if (!cancelled) setDetecting(false)
    }
    detect()
    return () => { cancelled = true }
  }, []) // run once only

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigateTo(trimmed)
  }

  const navigateTo = (target: string) => {
    setLoading(true)
    // Save to history
    const newHistory = [target, ...history.filter(h => h !== target)].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem("ip_history", JSON.stringify(newHistory))
    router.push(`/${locale}/ip/${encodeURIComponent(target)}`)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("ip_history")
  }

  return (
    <div className="w-full space-y-5">
      {/* Search form */}
      <form onSubmit={handleSearch} className="relative w-full">
        <div className="relative flex items-center bg-slate-50/60 dark:bg-[#0d0d0f]/60 backdrop-blur-xl border border-slate-200 dark:border-white/8 hover:border-slate-300 dark:hover:border-white/15 rounded-xl overflow-hidden transition-all duration-200 focus-within:border-slate-400 dark:focus-within:border-white/25">
          <div className="pl-4 text-slate-400 dark:text-slate-500 flex-shrink-0">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === "zh" ? "输入 IPv4、IPv6 或域名…" : "Enter IPv4, IPv6 or domain…"}
            className="w-full px-3 py-4 bg-transparent outline-none border-none text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-600 disabled:opacity-50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="mr-2 px-5 py-2 bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-100 text-white dark:text-black rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              locale === "zh" ? "分析" : "Analyze"
            )}
          </button>
        </div>
      </form>

      {/* My IP shortcut — no auto-redirect, always visible */}
      <div className="flex items-center gap-2 text-[11px] font-mono">
        <Wifi className="h-3 w-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
        <span className="text-slate-400 dark:text-slate-500">
          {locale === "zh" ? "本机 IP:" : "My IP:"}
        </span>
        {detecting ? (
          <span className="text-slate-400 dark:text-slate-600 flex items-center gap-1">
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
            {locale === "zh" ? "检测中…" : "Detecting…"}
          </span>
        ) : detectedIp ? (
          <button
            onClick={() => navigateTo(detectedIp)}
            className="text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white font-bold underline underline-offset-2 decoration-dotted cursor-pointer transition-colors"
          >
            {detectedIp}
          </button>
        ) : (
          <span className="text-slate-500">{locale === "zh" ? "获取失败" : "unavailable"}</span>
        )}
        {detectedIp && !detecting && (
          <span className="text-slate-300 dark:text-slate-700">·</span>
        )}
        {detectedIp && !detecting && (
          <button
            onClick={() => navigateTo(detectedIp)}
            className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer text-[10px]"
          >
            {locale === "zh" ? "查询" : "Analyze"}
          </button>
        )}
      </div>

      {/* Search history */}
      {history.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-2.5 w-2.5" />
              {locale === "zh" ? "最近查询" : "Recent"}
            </span>
            <button
              onClick={clearHistory}
              className="text-[10px] font-mono text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="h-2.5 w-2.5" />
              {locale === "zh" ? "清除" : "Clear"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((ip) => (
              <button
                key={ip}
                onClick={() => navigateTo(ip)}
                className="px-2.5 py-1 text-xs font-mono bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white rounded-md transition-colors cursor-pointer"
              >
                {ip}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
