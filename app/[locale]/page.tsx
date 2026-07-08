import { getTranslations } from "next-intl/server"
import SearchSection from "@/components/dashboard/search-section"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Home" })

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 md:px-8 py-24 md:py-36 relative z-10">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-12">
        
        {/* Apple/Vercel style mono version micro-badge */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            IP INTEL LABS v1.0.0
          </div>
          
          {/* Massive high-end typography */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] selection:bg-black/10 dark:selection:bg-white/20 select-none">
            {t("heading1")} <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-500 font-extrabold">
              {t("heading2")}
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-light tracking-wide max-w-lg leading-relaxed selection:bg-black/10 dark:selection:bg-white/20">
            {t("subtitle")}
          </p>
        </header>

        {/* Minimal input form */}
        <div className="w-full max-w-xl mx-auto pt-4">
          <SearchSection locale={locale} />
        </div>
      </div>
    </div>
  )
}
