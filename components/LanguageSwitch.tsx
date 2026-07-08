"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"

export default function LanguageSwitch() {
  const localActive = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const onChangeLanguage = () => {
    const nextLocale = localActive === "en" ? "zh" : "en"
    const newPath = pathname.replace(/^\/(en|zh)/, `/${nextLocale}/`)
    router.replace(newPath, {
      scroll: false,
    })
  }

  return (
    <button
      onClick={onChangeLanguage}
      className="w-8 h-8 flex items-center justify-center rounded-full text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90 text-[10px] font-mono font-bold"
    >
      <span className="sr-only">Change Language</span>
      {localActive === "en" ? "EN" : "中"}
    </button>
  )
}
