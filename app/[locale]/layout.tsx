import "./globals.css"
import { Inter } from "next/font/google"
import ThemeContextProvider from "@/context/theme-context"
import ThemeSwitch from "@/components/ThemeTwich"
import LanguageSwitch from "@/components/LanguageSwitch"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import WidgetWrapper from "@/components/WidgetWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "IP Intelligence Hub",
  description: "Modern & high-aesthetic IP intelligence analysis platform.",
  metadataBase: new URL("https://ip.ybovo.com"),
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} className="!scroll-smooth" suppressHydrationWarning>
      {/* Inline script: apply theme BEFORE React hydrates to prevent white flash */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var t = localStorage.getItem('theme');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (t === 'dark' || (!t && prefersDark)) {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
              } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
              }
            } catch(e) {}
          })();
        ` }} />
      </head>
      <body className={`${inter.className} min-h-screen relative overflow-x-hidden`}>
        {/* Top spotlight glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] cosmic-spotlight -z-30 pointer-events-none" />
        
        {/* Subtle grid lines matching Linear's homepage */}
        <div className="absolute inset-0 cosmic-grid -z-25 pointer-events-none" />

        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeContextProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow flex flex-col">
                {children}
              </main>
              
              {/* Site Footer */}
              <footer className="w-full py-8 text-center text-[11px] font-mono text-slate-400/40 dark:text-slate-600/40 select-none space-y-1">
                <div>© 2026 毅白 · YIBAI.</div>
                <div className="text-[10px] opacity-75">
                  {locale === "zh" ? "本站数据仅供参考" : "Data is for reference only"}
                </div>
              </footer>
              
              <WidgetWrapper>
                <ThemeSwitch />
                <LanguageSwitch />
              </WidgetWrapper>
            </div>
          </ThemeContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
