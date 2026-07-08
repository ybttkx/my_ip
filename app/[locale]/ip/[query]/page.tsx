import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
import dns from "dns"
import { IpManager } from "@/lib/providers/manager"
import { getMockReport } from "@/lib/mock-data"
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

// Helper to check if string is a valid IP address
function isIpAddress(str: string): boolean {
  const ipv4Regex = /^(((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d))$/
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{1,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/
  return ipv4Regex.test(str) || ipv6Regex.test(str)
}

// Server-side DNS resolution
async function resolveDomain(domain: string): Promise<string> {
  try {
    const addresses = await dns.promises.resolve4(domain)
    if (addresses && addresses.length > 0) {
      return addresses[0]
    }
  } catch (err) {
    console.warn(`DNS resolution failed for ${domain}, attempting fallback:`, err)
  }
  return domain
}

export async function generateMetadata({ params }: IpPageProps) {
  const { query } = await params
  const decodedQuery = decodeURIComponent(query)
  return {
    title: `${decodedQuery} | IP Intelligence Report`,
    description: `Detailed IP geolocation, purity clean score, and AI service compatibility check for ${decodedQuery}.`,
  }
}

export default async function IpPage({ params }: IpPageProps) {
  const { locale, query } = await params
  const decodedQuery = decodeURIComponent(query).trim()
  
  let targetIp = decodedQuery
  let isDomain = false
  let resolvedFromDomain = ""

  // If query is not a direct IP, treat it as a domain name and resolve it
  if (!isIpAddress(decodedQuery)) {
    isDomain = true
    resolvedFromDomain = await resolveDomain(decodedQuery)
    targetIp = resolvedFromDomain
  }

  const manager = new IpManager()

  // Always pre-initialize with mock/fallback so page always renders even if all providers fail
  let report = getMockReport(targetIp)

  try {
    // Attempt live lookup — overwrites fallback if successful
    const liveReport = await manager.queryIp(targetIp)
    report = liveReport
  } catch (error) {
    console.warn("Live IP lookup failed, using fallback data:", error)
    // report already set to getMockReport(targetIp) above
  }

  const t = await getTranslations({ locale, namespace: "Dashboard" })

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
          {isDomain && (
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
