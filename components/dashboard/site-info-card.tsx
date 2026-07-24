"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Lock, Clock, Server, ArrowRight, Activity, CheckCircle2, XCircle } from "lucide-react"
import { SiteInfo } from "@/lib/types"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface SiteInfoCardProps {
  siteInfo: SiteInfo
  locale: string
}

export default function SiteInfoCard({ siteInfo, locale }: SiteInfoCardProps) {
  const t = useTranslations("WebTest")
  const tDash = useTranslations("Dashboard")

  const cert = siteInfo.cert
  const timings = siteInfo.timings

  const maxTiming = timings ? Math.max(timings.dns, timings.tcp, timings.tls, timings.ttfb, 1) : 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full space-y-12"
    >
      {/* Site Header Summary */}
      <section className="border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 bg-slate-50/50 dark:bg-white/[0.02] backdrop-blur-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-6">
          <div className="flex items-center gap-3">
            {siteInfo.icon ? (
              <img src={siteInfo.icon} alt="icon" className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-black/40 p-1 border border-slate-200 dark:border-white/10" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-400">
                <Server className="w-4 h-4" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {siteInfo.title || siteInfo.url}
              </h1>
              <p className="text-xs font-mono text-slate-500 truncate max-w-md">
                {siteInfo.url}
              </p>
            </div>
          </div>

          {siteInfo.ipInfo?.ip && (
            <Link
              href={`/${locale}/ip/${siteInfo.ipInfo.ip}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              <span>HOST IP: {siteInfo.ipInfo.ip}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {siteInfo.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light">
            {siteInfo.description}
          </p>
        )}

        {/* Quick Badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-500" />
            {siteInfo.tlsVersion || "HTTP Only"}
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
            HTTP/1.1: {siteInfo.supportsHttp1_1 ? "YES" : "NO"}
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
            HTTP/2 (H2): {siteInfo.supportsHttp2 ? "YES" : "NO"}
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
            HTTP/3 (QUIC): {siteInfo.supportsHttp3 ? "YES" : "NO"}
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
            HSTS: {siteInfo.supportsHsts ? "ENABLED" : "DISABLED"}
          </span>
        </div>
      </section>

      {/* SSL / TLS Specs Card */}
      {cert && (
        <section className="space-y-4">
          <div className="border-b border-slate-200 dark:border-white/5 pb-2">
            <h3 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t("ssl_cert")}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-mono text-xs">
            <div className="border-b border-slate-100 dark:border-white/[0.03] py-2 flex justify-between">
              <span className="text-slate-500">{t("issuer")}</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[200px]">{cert.issuer}</span>
            </div>
            <div className="border-b border-slate-100 dark:border-white/[0.03] py-2 flex justify-between">
              <span className="text-slate-500">{t("subject")}</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[200px]">{cert.subject}</span>
            </div>
            <div className="border-b border-slate-100 dark:border-white/[0.03] py-2 flex justify-between">
              <span className="text-slate-500">{t("days_remaining")}</span>
              <span className={`font-semibold ${cert.daysRemaining < 30 ? "text-rose-500" : "text-emerald-500"}`}>
                {cert.daysRemaining} {locale === "zh" ? "天" : "days"}
              </span>
            </div>
            <div className="border-b border-slate-100 dark:border-white/[0.03] py-2 flex justify-between">
              <span className="text-slate-500">{t("cipher")}</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[200px]">{siteInfo.cipher || "N/A"}</span>
            </div>
            <div className="border-b border-slate-100 dark:border-white/[0.03] py-2 flex justify-between col-span-1 md:col-span-2">
              <span className="text-slate-500">{t("valid_period")}</span>
              <span className="text-slate-800 dark:text-slate-200">{cert.validFrom?.slice(0, 16)} ~ {cert.validTo?.slice(0, 16)}</span>
            </div>
          </div>
        </section>
      )}

      {/* Connection Waterfall Timings */}
      {timings && (
        <section className="space-y-4">
          <div className="border-b border-slate-200 dark:border-white/5 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              {t("connection_timings")}
            </h3>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
              {t("total_time")}: {timings.total} ms
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs pt-2">
            {[
              { label: t("dns_time"), val: timings.dns },
              { label: t("tcp_time"), val: timings.tcp },
              { label: t("tls_time"), val: timings.tls },
              { label: t("ttfb_time"), val: timings.ttfb },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{item.label}</span>
                  <span>{item.val} ms</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(5, (item.val / maxTiming) * 100))}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-slate-900 dark:bg-white rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  )
}
