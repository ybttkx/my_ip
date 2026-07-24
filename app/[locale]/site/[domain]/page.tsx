import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, RefreshCw, Shield, Globe } from "lucide-react"
import { SiteInfo } from "@/lib/types"
import SiteInfoCard from "@/components/dashboard/site-info-card"
import { headers } from "next/headers"

interface SitePageProps {
  params: Promise<{
    locale: string
    domain: string
  }>
}

export async function generateMetadata({ params }: SitePageProps) {
  const { locale, domain } = await params
  const decodedDomain = decodeURIComponent(domain)
  return {
    title: `${decodedDomain} | Web Security & Performance Report`,
    description: `Detailed SSL/TLS certificate, connection latency breakdown, HTTP protocol support, and HSTS analysis for ${decodedDomain}.`,
    alternates: {
      canonical: `/${locale}/site/${encodeURIComponent(decodedDomain)}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function SitePage({ params }: SitePageProps) {
  const { locale, domain } = await params
  const decodedDomain = decodeURIComponent(domain).trim()
  const t = await getTranslations({ locale, namespace: "Dashboard" })
  const webTestT = await getTranslations({ locale, namespace: "WebTest" })
  const errorsT = await getTranslations({ locale, namespace: "Errors" })

  const headersList = await headers()
  const host = headersList.get("host") || "localhost:7878"
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  let siteInfo: SiteInfo | null = null
  let errorMessage = ""

  try {
    const targetUrl = decodedDomain.startsWith("http") ? decodedDomain : `https://${decodedDomain}`
    const res = await fetch(`${baseUrl}/api/check-site`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: targetUrl }),
      cache: "no-store",
    })

    if (res.ok) {
      siteInfo = await res.json()
      if (siteInfo?.error) {
        errorMessage = siteInfo.error
      }
    } else {
      errorMessage = "Web inspector service failed to return data."
    }
  } catch (err: any) {
    errorMessage = err.message || "Failed to inspect website."
  }

  if (errorMessage && (!siteInfo || !siteInfo.timings)) {
    return (
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
            href={`/${locale}/site/${domain}`}
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
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{errorMessage}</p>
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-500">{errorsT("desc")}</p>
        </section>
      </div>
    )
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
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-slate-500 bg-black/[0.02] dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded">
            TARGET: {decodedDomain}
          </span>
          <Link
            href={`/${locale}/site/${domain}`}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white font-medium transition-colors bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded"
          >
            <RefreshCw className="h-3 w-3" />
            <span>{t("refresh")}</span>
          </Link>
        </div>
      </div>

      {/* Main Inspection Specs Card */}
      {siteInfo && <SiteInfoCard siteInfo={siteInfo} locale={locale} />}
    </div>
  )
}
