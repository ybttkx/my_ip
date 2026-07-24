"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, ShieldAlert, ShieldX, Star } from "lucide-react"
import { PurityScoreResult } from "@/lib/types"
import { useTranslations } from "next-intl"

interface ScoreGaugeProps {
  scoreData: PurityScoreResult
  locale: string
}

export default function ScoreGauge({ scoreData, locale }: ScoreGaugeProps) {
  const t = useTranslations("Dashboard")
  const { score, stars, summaryZh, summaryEn, details } = scoreData
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1200 // ms
    const increment = score / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= score) {
        clearInterval(timer)
        setAnimatedScore(score)
      } else {
        setAnimatedScore(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [score])

  const getScoreColor = (val: number) => {
    if (val >= 80) return "rgba(52, 211, 153, 0.08)" // Emerald green glow
    if (val >= 60) return "rgba(34, 211, 238, 0.08)" // Cyan glow
    if (val >= 40) return "rgba(251, 191, 36, 0.08)" // Amber glow
    return "rgba(244, 63, 94, 0.08)" // Rose red glow
  }

  const getScoreTextClass = (val: number) => {
    if (val >= 80) return "text-emerald-400"
    if (val >= 60) return "text-cyan-400"
    if (val >= 40) return "text-amber-400"
    return "text-rose-500"
  }

  const getVerdictLabel = (val: number) => {
    if (val >= 80) return t("score_excellent")
    if (val >= 60) return t("score_good")
    if (val >= 40) return t("score_average")
    if (val >= 20) return t("score_warning")
    return t("score_danger")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col items-center justify-center p-8 text-center space-y-8 select-none"
    >
      {/* Background Soft Breathing Spotlight matching the score color */}
      <div
        className="absolute w-[260px] h-[260px] rounded-full blur-[4rem] transition-all duration-1000 -z-10"
        style={{
          background: `radial-gradient(circle, ${getScoreColor(score)} 0%, transparent 70%)`,
        }}
      />

      {/* Title */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          {t("purity_score")}
        </span>
      </div>

      {/* Massive Typographic Score */}
      <div className="relative flex items-baseline justify-center">
        <span className={`text-8xl md:text-9xl font-extrabold tracking-tighter ${getScoreTextClass(score)} tabular-nums`}>
          {animatedScore}
        </span>
        <span className="text-2xl font-mono text-slate-600 ml-1">/100</span>
      </div>

      {/* Verdict and Stars */}
      <div className="flex flex-col items-center space-y-2">
        <span className={`text-sm font-semibold tracking-wider font-mono uppercase ${getScoreTextClass(score)}`}>
          {getVerdictLabel(score)}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < stars
                  ? `${getScoreTextClass(score)} fill-current`
                  : "text-slate-200 dark:text-slate-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Verdict Summary Text - Clean prose, no cards */}
      <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mx-auto font-light leading-relaxed">
        {locale === "zh" ? summaryZh : summaryEn}
      </p>

      {/* Flags - Extremely slim inline badges instead of cards */}
      <div className="flex flex-wrap gap-2 justify-center max-w-xs pt-2">
        {Object.entries(details).map(([key, value]) => (
          <span
            key={key}
            className={`text-[10px] md:text-[11px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded border transition-colors ${
              value
                ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400"
                : "bg-slate-100 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
            }`}
          >
            {key.replace("is", "").toUpperCase()}: {value ? "YES" : "NO"}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
