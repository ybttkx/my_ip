"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { AiAvailabilityResult, AiStatus } from "@/lib/types"

interface AiAvailabilityProps {
  aiData: AiAvailabilityResult
  locale: string
}

export default function AiAvailability({ aiData, locale }: AiAvailabilityProps) {
  const tDashboard = useTranslations("Dashboard")
  const tAi = useTranslations("AI")
  
  const services = [
    { id: "chatgpt", label: tAi("chatgpt"), data: aiData.chatgpt },
    { id: "claude", label: tAi("claude"), data: aiData.claude },
    { id: "gemini", label: tAi("gemini"), data: aiData.gemini },
    { id: "perplexity", label: tAi("perplexity"), data: aiData.perplexity },
    { id: "grok", label: tAi("grok"), data: aiData.grok },
  ]

  const getStatusColorClass = (status: AiStatus) => {
    switch (status) {
      case "available": return "text-emerald-600 dark:text-emerald-400"
      case "restricted": return "text-amber-600 dark:text-amber-400"
      case "blocked": return "text-rose-600 dark:text-rose-400"
    }
  }

  const getStatusDotClass = (status: AiStatus) => {
    switch (status) {
      case "available": return "bg-emerald-500 dark:bg-emerald-400 glow-dot-green"
      case "restricted": return "bg-amber-500 dark:bg-amber-400 glow-dot-amber"
      case "blocked": return "bg-rose-500 dark:bg-rose-400 glow-dot-rose"
    }
  }

  const getStatusLabel = (status: AiStatus) => {
    switch (status) {
      case "available": return tAi("status_available")
      case "restricted": return tAi("status_restricted")
      case "blocked": return tAi("status_blocked")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full bg-transparent space-y-6"
    >
      <div className="border-b border-slate-200 dark:border-white/5 pb-2">
        <h3 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {tDashboard("ai_availability")}
        </h3>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={service.id} className="space-y-1">
            <div className="flex items-center justify-between py-1 border-b border-black/[0.02] dark:border-white/[0.02]">
              {/* Service Name */}
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {service.label}
              </span>

              {/* Dotted connector (Apple/Specs style) */}
              <div className="flex-grow mx-4 border-b border-dashed border-slate-200 dark:border-white/5 h-1" />

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(service.data.status)}`} />
                <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${getStatusColorClass(service.data.status)}`}>
                  {getStatusLabel(service.data.status)}
                </span>
              </div>
            </div>

            {/* Explanatory text under service if warning/blocked */}
            {service.data.status !== "available" && (
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono pl-3 leading-relaxed">
                ↳ {locale === "zh" ? service.data.reasonZh : service.data.reasonEn}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
