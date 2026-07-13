import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import { IpManager } from "@/lib/providers/manager"
import { isIpAddress, isPrivateOrReservedIp } from "@/lib/ip-utils"
import { normalizeDomain, resolveDomain } from "@/lib/dns-utils"
import ScoreGauge from "@/components/dashboard/score-gauge"
import IpInfoCard from "@/components/dashboard/ip-info-card"
import IpTypeCard from "@/components/dashboard/ip-type-card"
import AiAvailability from "@/components/dashboard/ai-availability"
import ScreenshotCard from "@/components/dashboard/screenshot-card"

interface IpPageProps {
  params: Promise<{
    locale: string
    query: string
  }>
}

export async function generateMetadata({ params }: IpPageProps) {
  const { locale, query } = await params
  const decodedQuery = decodeURIComponent(query)
  return {
    title: `${decodedQuery} | IP Intelligence Report`,
    description: `Detailed IP geolocation, purity clean score, and AI service compatibility check for ${decodedQuery}.`,
    alternates: {
      canonical: `/${locale}/ip/${encodeURIComponent(decodedQuery)}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function IpPage({ params }: IpPageProps) {
  const { locale, query } = await params
  const decodedQuery = decodeURIComponent(query).trim()
  const t = await getTranslations({ locale, namespace: "Dashboard" })
  const errorsT = await getTranslations({ locale, namespace: "Errors" })

  let targetIp = decodedQuery
  let isDomain = false
  let resolvedFromDomain: string | null = null
  let errorMessage = ""

  const renderError = (message: string) => (
    <div className="min-h-screen px-6 py-12 md:py-24 max-w-2xl mx-auto w-full space-y-16 z-10 relative">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-6">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t("back_home")}</span>
        </Link>
        <Link
          href={`/${locale}/ip/${query}`}
          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white font-medium transition-colors bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded"
        >
          <RefreshCw className="h-3 w-3" />
          <span>{t("refresh")}</span>
        </Link>
      </div>

      <section className="border border-amber-200 bg-amber-50/80 dark:border-amber-400/20 dark:bg-amber-400/10 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <h1 className="text-lg font-semibold">{errorsT("title")}</h1>
        </div>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{message}</p>
        <p className="text-xs leading-5 text-slate-500 dark:text-slate-500">{errorsT("desc")}</p>
      </section>
    </div>
  )

  if (!isIpAddress(decodedQuery)) {
    isDomain = true
    const domain = normalizeDomain(decodedQuery)
    if (!domain) {
      errorMessage = locale === "zh" ? "请输入有效的 IP 地址或域名。" : "Please enter a valid IP address or domain name."
    } else {
      resolvedFromDomain = await resolveDomain(domain)
      if (resolvedFromDomain) {
        targetIp = resolvedFromDomain
      } else {
        errorMessage = locale === "zh" ? "域名解析失败，无法继续进行 IP 分析。" : "Domain resolution failed, so IP analysis cannot continue."
      }
    }
  } else if (isPrivateOrReservedIp(decodedQuery)) {
    errorMessage = locale === "zh" ? "该地址属于私网、本地或保留网段，无法进行公网 IP 分析。" : "This address is private, local, or reserved and cannot be audited as a public IP."
  }

  if (errorMessage) {
    return renderError(errorMessage)
  }

  const manager = new IpManager()
  const report = await manager.queryIp(targetIp).catch((error) => {
    console.warn("Live IP lookup failed:", error)
    return null
  })

  if (!report) {
    return renderError(locale === "zh" ? "实时查询失败，未返回可信的 IP 报告。" : "Live lookup failed and no trustworthy IP report is available.")
  }

  return (
    <div className="min-h-screen px-6 py-12 md:py-24 max-w-2xl mx-auto w-full space-y-16 z-10 relative">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-6">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t("back_home")}</span>
        </Link>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-slate-500 bg-black/[0.02] dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded">
              TARGET: {decodedQuery}
            </span>
            <Link
              href={`/${locale}/ip/${query}`}
              className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white font-medium transition-colors bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded"
            >
              <RefreshCw className="h-3 w-3" />
              <span>{t("refresh")}</span>
            </Link>
          </div>
          {isDomain && resolvedFromDomain && (
            <span className="text-[9px] font-mono text-slate-500 dark:text-slate-600">
              Resolved DNS to: {resolvedFromDomain}
            </span>
          )}
        </div>
      </div>

      {/* Hero: Purity Score typography & natural verdict */}
      <section className="py-4">
        <ScoreGauge scoreData={report.purityScore} locale={locale} />
      </section>

      {/* Section 1: Geo IP Info specs */}
      <section className="border-t border-slate-200 dark:border-white/5 pt-8">
        <IpInfoCard report={report} locale={locale} />
      </section>

      {/* Section 2: IP classification weights */}
      <section className="border-t border-slate-200 dark:border-white/5 pt-8">
        <IpTypeCard primaryType={report.type} locale={locale} />
      </section>

      {/* Section 3: AI availability */}
      <section className="border-t border-slate-200 dark:border-white/5 pt-8">
        <AiAvailability aiData={report.aiAvailability} locale={locale} />
      </section>

      {/* Section 4: Share report card */}
      <section className="border-t border-slate-200 dark:border-white/5 pt-8">
        <ScreenshotCard report={report} locale={locale} />
      </section>
    </div>
  )
}
