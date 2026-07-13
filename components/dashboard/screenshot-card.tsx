"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Share2, Copy, Download, Check, Globe } from "lucide-react"
import { IpReport } from "@/lib/types"
import { useTheme } from "@/context/theme-context"

interface ScreenshotCardProps {
  report: IpReport
  locale: string
}

export default function ScreenshotCard({ report, locale }: ScreenshotCardProps) {
  const t = useTranslations("Dashboard")
  const { theme } = useTheme()
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (copiedTimer.current) clearTimeout(copiedTimer.current)
  }, [])

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/${locale}/ip/${report.ip}`
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true)
        if (copiedTimer.current) clearTimeout(copiedTimer.current)
        copiedTimer.current = setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  const handleDownloadImage = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const { toPng } = await import("html-to-image")
      await new Promise(r => setTimeout(r, 100))
      
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
        style: {
          transform: "scale(1)",
          borderRadius: "0px",
        },
        cacheBust: true,
      })

      const link = document.createElement("a")
      link.download = `ip-report-${report.ip}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Error generating share card", error)
    } finally {
      setDownloading(false)
    }
  }

  const getStatusEmoji = (status: "available" | "restricted" | "blocked") => {
    switch (status) {
      case "available": return "●"
      case "restricted": return "▲"
      case "blocked": return "■"
    }
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return locale === "zh" ? "极佳" : "Excellent"
    if (score >= 60) return locale === "zh" ? "良好" : "Good"
    if (score >= 40) return locale === "zh" ? "一般" : "Average"
    return locale === "zh" ? "危险" : "Risk"
  }

  // Localized field helpers for exported card text
  const labelCountry = locale === "zh" ? "国家/地区" : "Country"
  const labelAsn = locale === "zh" ? "自治系统" : "ASN"
  const labelIsp = locale === "zh" ? "运营商" : "ISP"
  const labelPurity = locale === "zh" ? "IP纯净度" : "Purity"
  const labelAiServices = locale === "zh" ? "AI 服务可用性" : "AI Services"

  // Theme styling configurations
  const isDark = theme === "dark"
  const cardBg = isDark ? "bg-black border-white/10" : "bg-white border-slate-200"
  const textHeader = isDark ? "text-slate-500" : "text-slate-400"
  const textMain = isDark ? "text-white" : "text-slate-900"
  const textLabel = isDark ? "text-slate-600" : "text-slate-400"
  const textValue = isDark ? "text-slate-200" : "text-slate-800"
  const borderLine = isDark ? "border-white/10" : "border-slate-200"
  const borderLineSub = isDark ? "border-white/5" : "border-slate-100"
  const badgeBg = isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-800"
  const textAiName = isDark ? "text-slate-500" : "text-slate-400"
  const textAiVal = isDark ? "text-slate-300" : "text-slate-700"
  const footerText = isDark ? "text-slate-500" : "text-slate-400"
  const footerCopy = isDark ? "text-slate-600" : "text-slate-500"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="w-full bg-transparent space-y-6 pt-4"
    >
      <div className="border-b border-slate-200 dark:border-white/5 pb-2">
        <h3 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Share2 className="h-3.5 w-3.5" />
          {t("share_report")}
        </h3>
      </div>

      {/* Sharing buttons - Apple/Vercel styling */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleCopyLink}
          className="flex-grow flex items-center justify-center gap-2 py-2.5 px-4 bg-transparent border border-slate-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/[0.02] text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500">{locale === "zh" ? "已复制" : "Copied"}</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>{t("copy_link")}</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="flex-grow flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-black rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {downloading ? (
            <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          <span>{t("download_card")}</span>
        </button>
      </div>

      {/* Card Preview Area */}
      <div className="space-y-3 pt-2">
        <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
          {locale === "zh" ? "分享卡片预览" : "Report Card Preview"}
        </span>
        
        <div className="border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden p-6 bg-slate-50/50 dark:bg-[#030303]">
          {/* Snapshotted container */}
          <div
            ref={cardRef}
            className={`w-full max-w-[360px] mx-auto border p-6 space-y-6 font-mono text-left rounded-lg shadow-xl transition-colors duration-200 ${cardBg}`}
          >
            {/* Header */}
            <div className={`border-b pb-4 space-y-1 ${borderLine}`}>
              <h4 className={`text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5 select-none ${textHeader}`}>
                <Globe className="h-3 w-3" />
                {locale === "zh" ? "IP 智能检测报告" : "IP Intelligence Report"}
              </h4>
              <div className={`text-lg font-bold tracking-tight select-all ${textMain}`}>
                {report.ip}
              </div>
            </div>

            {/* Specs list */}
            <div className={`space-y-3.5 text-[11px] ${textValue}`}>
              <div className="flex items-start justify-between">
                <span className={`uppercase text-[9px] ${textLabel}`}>{labelCountry}</span>
                <span className="font-semibold text-right">{report.country} ({report.countryCode})</span>
              </div>
              <div className="flex items-start justify-between">
                <span className={`uppercase text-[9px] ${textLabel}`}>{labelAsn}</span>
                <span className="font-semibold text-right truncate max-w-[200px]">{report.asn}</span>
              </div>
              <div className={`flex items-start justify-between border-t pt-3 ${borderLineSub}`}>
                <span className={`uppercase text-[9px] ${textLabel}`}>{labelIsp}</span>
                <span className="font-semibold text-right truncate max-w-[200px]">{report.isp}</span>
              </div>
              <div className={`flex items-start justify-between border-t pt-3 ${borderLineSub}`}>
                <span className={`uppercase text-[9px] ${textLabel}`}>{labelPurity}</span>
                <span className="font-semibold text-right flex items-center gap-1.5">
                  <span>{report.purityScore.score}/100</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${badgeBg}`}>
                    {getScoreLabel(report.purityScore.score)}
                  </span>
                </span>
              </div>
            </div>

            {/* AI Grid */}
            <div className={`border-t pt-4 space-y-2 ${borderLine}`}>
              <span className={`uppercase text-[9px] ${textLabel}`}>{labelAiServices}</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className={`flex items-center justify-between border-r pr-2 ${borderLineSub}`}>
                  <span className={textAiName}>ChatGPT</span>
                  <span className={`font-bold ${textAiVal}`}>{getStatusEmoji(report.aiAvailability.chatgpt.status)}</span>
                </div>
                <div className="flex items-center justify-between pl-2">
                  <span className={textAiName}>Claude</span>
                  <span className={`font-bold ${textAiVal}`}>{getStatusEmoji(report.aiAvailability.claude.status)}</span>
                </div>
                <div className={`flex items-center justify-between border-r pr-2 border-t pt-1.5 mt-1 ${borderLineSub}`}>
                  <span className={textAiName}>Gemini</span>
                  <span className={`font-bold ${textAiVal}`}>{getStatusEmoji(report.aiAvailability.gemini.status)}</span>
                </div>
                <div className={`flex items-center justify-between pl-2 border-t pt-1.5 mt-1 ${borderLineSub}`}>
                  <span className={textAiName}>Perplexity</span>
                  <span className={`font-bold ${textAiVal}`}>{getStatusEmoji(report.aiAvailability.perplexity.status)}</span>
                </div>
              </div>
            </div>

            {/* Footer with website address, date and custom signature */}
            <div className={`border-t pt-4 flex flex-col gap-1 text-[8.5px] font-bold select-none ${borderLine}`}>
              <div className="flex items-center justify-between">
                <span className={`tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>ip.ybovo.com</span>
                <span className={footerText}>{report.queryTime?.slice(0, 10) || "-"}</span>
              </div>
              <div className={`text-[7.5px] font-normal ${footerCopy}`}>
                © 2026 毅白 · YIBAI.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
