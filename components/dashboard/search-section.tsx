"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Clock, Trash2, Loader2, Wifi, Globe, Shield } from "lucide-react"
import { useTranslations } from "next-intl"

interface SearchSectionProps {
  locale: string
}

export default function SearchSection({ locale }: SearchSectionProps) {
  const router = useRouter()
  const t = useTranslations("Home")
  const [mode, setMode] = useState<"ip" | "site">("ip")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [detectedIp, setDetectedIp] = useState<string | null>(null)
  const [detecting, setDetecting] = useState(true)
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("ip_history")
    if (stored) {
      try { setHistory(JSON.parse(stored)) } catch {}
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const detect = async () => {
      try {
        const res = await fetch("/api/detect", { cache: "no-store", signal: controller.signal })
        const data = await res.json()

        if (!cancelled) {
          if (data?.ip) {
            setDetectedIp(data.ip)
          } else if (data?.local) {
            const ipifyRes = await fetch("https://api.ipify.org?format=json", {
              cache: "no-store",
              signal: controller.signal,
            })
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
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigateTo(trimmed, mode)
  }

  const navigateTo = (target: string, targetMode: "ip" | "site" = mode) => {
    setLoading(true)
    const newHistory = [target, ...history.filter(h => h !== target)].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem("ip_history", JSON.stringify(newHistory))

    if (targetMode === "site") {
      let cleanTarget = target.replace(/^https?:\/\//i, '').replace(/\/.*$/, '')
      router.push(`/${locale}/site/${encodeURIComponent(cleanTarget)}`)
    } else {
      router.push(`/${locale}/ip/${encodeURIComponent(target)}`)
    }
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("ip_history")
  }

  return (
    <div className="w-full space-y-5">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl w-fit mx-auto text-xs font-mono select-none">
        <button
          type="button"
          onClick={() => setMode("ip")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
            mode === "ip"
              ? "bg-white dark:bg-black text-slate-900 dark:text-white font-bold shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{t("mode_ip")}</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("site")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
            mode === "site"
              ? "bg-white dark:bg-black text-slate-900 dark:text-white font-bold shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t("mode_site")}</span>
        </button>
      </div>

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
            placeholder={mode === "ip" ? t("placeholder_ip") : t("placeholder_site")}
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
              t("button")
            )}
          </button>
        </div>
      </form>

      {/* My IP shortcut */}
      <div className="flex items-center justify-center gap-2 text-[11px] font-mono">
        <Wifi className="h-3 w-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
        <span className="text-slate-400 dark:text-slate-500">
          {t("my_ip")}:
        </span>
        {detecting ? (
          <span className="text-slate-400 dark:text-slate-600 flex items-center gap-1">
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
            {t("detecting")}
          </span>
        ) : detectedIp ? (
          <button
            onClick={() => navigateTo(detectedIp, "ip")}
            className="text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white font-bold underline underline-offset-2 decoration-dotted cursor-pointer transition-colors"
          >
            {detectedIp}
          </button>
        ) : (
          <span className="text-slate-500">{t("detect_failed")}</span>
        )}
      </div>

      {/* Search history */}
      {history.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-2.5 w-2.5" />
              {t("history")}
            </span>
            <button
              onClick={clearHistory}
              className="text-[10px] font-mono text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="h-2.5 w-2.5" />
              {t("clear_history")}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((item) => (
              <button
                key={item}
                onClick={() => navigateTo(item)}
                className="px-2.5 py-1 text-xs font-mono bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white rounded-md transition-colors cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
