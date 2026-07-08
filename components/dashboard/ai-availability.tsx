"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { ExternalLink } from "lucide-react"
import { AiAvailabilityResult, AiStatus } from "@/lib/types"

interface AiAvailabilityProps {
  aiData: AiAvailabilityResult
  locale: string
}

// Brand SVG logos (inline, no external deps)
const AiLogo = ({ id }: { id: string }) => {
  switch (id) {
    case "chatgpt":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z"/>
        </svg>
      )
    case "claude":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-1.21-.097L2 12.587l.032-.203.436-.313 1.307.097 2.144.12 2.485.137.742.04v-.137l-.307-.12-2.485-1.065-2.357-1.04-1.468-.645L2 9.754l.17-.54.42-.1.81.327 2.695 1.178 2.357.998 1.032.436-.065-.12-1.21-2.23-.92-1.735-.566-1.13-.387-1.08.128-.41.566-.23.5.198.437.767.848 1.614.97 1.79 1.082 2.03-.016-.162-1.952-2.228-.43-.476-.21-.387.356-.484.68-.065.872.726 2.357 2.164 1.468 1.355.017-.21-.388-4.135-.162-1.485-.065-.98.485-.39.517.031.42.39.227 1.18.42 3.86.29 2.518.128 1.21-.016-.1-.565-1.065-.32-.628-.146-.226.58-.26.678.023.663.59.63.547.485.485.873.13.436.03.8-.033.695-.113.696-.26.485-.463.194-.614-.016-.485-.21-.21-.42-.178-.84-.017-.792.033-.84.065-1.404-.548.549 1.016.565 1.227.048 1.065-.436.517-1.081.017-.856-.63-1.032-1.517-1.145-2.082-.936-1.775-.145-.291-.033-.016-.016.13-.307.63-.307.663-.131 1.807-.147 1.92-.21.953-.355.437-.485.146-.582-.226-.323-.582-.065-1.016.098-1.742.226-2.095.098-.582-.033-.307-.226-.178-.436.081-.517.323-.13.856-.097 2.305-.049 1.582-.065.824.016-.046-.178-.81-1.468-1.049-1.872-.437-.808-.162-.42.453-.227.63.114.42.355.84.937 1.404 1.323 2.275 1.04 1.775.064.13.017-.034-.21-2.68-.13-.937-.032-.565.45-.194.55.097.356.45.21 1.113.195 2.178.081.872-.016.13.016-.016-.065-.566-.905-1.355-.34-.453-.081-.258.42-.226.565.064.437.388.21.37.566.873.84 1.21.453.566-.016.016.032-1.307-2.485-.162-.324.29-.258.63.032.372.42.16.308.631 1.065.614 1.03.355.52.33.016.049-.807-.017-1.323-.049-1.032.034-.502.47-.13.55.227.274.582-.016 1.08.033.776.065.437-.097.33-.323.01-.29-.21-.307-.55-.113-1.017-.178-1.79-.065-1.016.016.016-.097-.049-.049-.178.324-.63.663-1.485.47-.324.21-.258-.5-.275-.63.113-.29.21-.145.307-.614.647-1.114.534-.905.23-.437-.065-.29-.308.194-.42.13-.29.291-.372.82-.518.937-.405.84-.178.437.065-.033-.033-.065-.307-.372-.776-.517-1.355-.163-.468.307-.387.63.03.356.405.066.178.31.679.63 1.177.243.436-.032.13-.016-.033-.904-1.032-1.307-1.695-.356-.453-.049-.178.517-.21.615.113.356.42.113.275.646.937.695.953.453.453-.016.13-.065-.29-.985-1.258-.826-1.016-.178-.275.533-.195.63.13.34.437.063.162.613.953.679.937.42.452-.032.097.016-.016-.68-.84-.985-1.195-.21-.29.583-.162.598.162.324.42.065.162.55.81.453.68.21.274-.05.065.016-.016-.388-.42-.614-.646-.156-.195.57-.147.534.196.26.42-.016.113.276.55.276.34v.421l-.324.29-.42-.032-.533-.42-.308-.356-.048-.13-.033.016.017.034z"/>
        </svg>
      )
    case "gemini":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M11.04 0C10.15 6.79 6.79 10.15 0 11.04v1.92C6.79 13.85 10.15 17.21 11.04 24h1.92c.89-6.79 4.25-10.15 11.04-11.04v-1.92C17.21 10.15 13.85 6.79 12.96 0h-1.92z"/>
        </svg>
      )
    case "perplexity":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M22.069 10.44h-8.76L20.535 4.2H14.28L12 6.66 9.72 4.2H3.465l7.226 6.24H2.069L2 21.72h8.286v-1.8h3.428v1.8H22l-.068-11.28H22.069zM14.743 4.8h4.337l-6.154 5.64h-1.714L14.743 4.8zM9.257 4.8l3.531 5.64H11.03L4.92 4.8H9.257zM2.623 11.04H10.8v9.6H2.657l-.034-9.6zm8.777 8.88h3.428v.72H11.4v-.72zm3.6-8.88h8.177l.034 9.6H15V11.04z"/>
        </svg>
      )
    case "grok":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    default:
      return null
  }
}

const SERVICE_META: Record<string, { url: string; color: string; bgDark: string; bgLight: string }> = {
  chatgpt:    { url: "https://chat.openai.com",      color: "text-[#10a37f]", bgDark: "bg-[#10a37f]/10", bgLight: "bg-[#10a37f]/8" },
  claude:     { url: "https://claude.ai",            color: "text-[#c9956c]", bgDark: "bg-[#c9956c]/10", bgLight: "bg-[#c9956c]/8" },
  gemini:     { url: "https://gemini.google.com",    color: "text-[#4285f4]", bgDark: "bg-[#4285f4]/10", bgLight: "bg-[#4285f4]/8" },
  perplexity: { url: "https://www.perplexity.ai",    color: "text-[#20b2aa]", bgDark: "bg-[#20b2aa]/10", bgLight: "bg-[#20b2aa]/8" },
  grok:       { url: "https://grok.com",             color: "text-slate-400",  bgDark: "bg-white/5",       bgLight: "bg-slate-100"     },
}

export default function AiAvailability({ aiData, locale }: AiAvailabilityProps) {
  const tDashboard = useTranslations("Dashboard")
  const tAi = useTranslations("AI")
  
  const services = [
    { id: "chatgpt",    label: tAi("chatgpt"),    data: aiData.chatgpt    },
    { id: "claude",     label: tAi("claude"),     data: aiData.claude     },
    { id: "gemini",     label: tAi("gemini"),     data: aiData.gemini     },
    { id: "perplexity", label: tAi("perplexity"), data: aiData.perplexity },
    { id: "grok",       label: tAi("grok"),       data: aiData.grok       },
  ]

  const getStatusColorClass = (status: AiStatus) => {
    switch (status) {
      case "available":  return "text-emerald-600 dark:text-emerald-400"
      case "restricted": return "text-amber-600 dark:text-amber-400"
      case "blocked":    return "text-rose-600 dark:text-rose-400"
    }
  }

  const getStatusDotClass = (status: AiStatus) => {
    switch (status) {
      case "available":  return "bg-emerald-500 dark:bg-emerald-400 glow-dot-green"
      case "restricted": return "bg-amber-500 dark:bg-amber-400 glow-dot-amber"
      case "blocked":    return "bg-rose-500 dark:bg-rose-400 glow-dot-rose"
    }
  }

  const getStatusLabel = (status: AiStatus) => {
    switch (status) {
      case "available":  return tAi("status_available")
      case "restricted": return tAi("status_restricted")
      case "blocked":    return tAi("status_blocked")
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

      <div className="space-y-3">
        {services.map((service) => {
          const meta = SERVICE_META[service.id]
          const isAvailable = service.data.status === "available"
          return (
            <div key={service.id} className="space-y-1.5">
              <div className="flex items-center justify-between py-1.5 border-b border-black/[0.03] dark:border-white/[0.03]">

                {/* Logo + Name (clickable) */}
                <a
                  href={meta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 group transition-opacity ${
                    isAvailable ? "opacity-100 hover:opacity-80" : "opacity-50 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  <span className={`flex items-center justify-center h-6 w-6 rounded-md ${meta.bgDark} ${meta.color} transition-colors`}>
                    <AiLogo id={service.id} />
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                    {service.label}
                  </span>
                  {isAvailable && (
                    <ExternalLink className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </a>

                {/* Dotted connector */}
                <div className="flex-grow mx-4 border-b border-dashed border-slate-200 dark:border-white/5 h-1" />

                {/* Status + Visit button */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getStatusDotClass(service.data.status)}`} />
                    <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${getStatusColorClass(service.data.status)}`}>
                      {getStatusLabel(service.data.status)}
                    </span>
                  </div>
                  {isAvailable && (
                    <a
                      href={meta.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 transition-colors"
                    >
                      {locale === "zh" ? "访问" : "Visit"}
                    </a>
                  )}
                </div>
              </div>

              {/* Reason when restricted/blocked */}
              {service.data.status !== "available" && (
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono pl-3 leading-relaxed">
                  ↳ {locale === "zh" ? service.data.reasonZh : service.data.reasonEn}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
