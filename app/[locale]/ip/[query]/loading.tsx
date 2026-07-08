import { Loader2, Wifi, ShieldAlert, Cpu } from "lucide-react"

export default function IpPageLoading() {
  return (
    <div className="min-h-screen px-6 py-12 md:py-24 max-w-2xl mx-auto w-full flex flex-col justify-center items-center space-y-12 z-10 relative select-none">
      
      {/* Soft spotlight breathing background */}
      <div className="absolute w-[300px] h-[300px] rounded-full blur-[6rem] bg-indigo-500/5 dark:bg-indigo-500/10 animate-pulse -z-10" />

      {/* Main Spinning Loader */}
      <div className="flex flex-col items-center space-y-6">
        <div className="relative flex items-center justify-center">
          {/* Pulsing ring */}
          <span className="absolute h-16 w-16 rounded-full border border-slate-200/50 dark:border-white/10 animate-ping opacity-75" />
          <div className="relative p-4 rounded-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-slate-800 dark:text-white" />
          </div>
        </div>

        {/* Query status titles */}
        <div className="text-center space-y-2">
          <h2 className="text-sm font-semibold tracking-wider text-slate-800 dark:text-white uppercase font-sans animate-pulse">
            正在分析中...
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Analyzing intelligence details
          </p>
        </div>
      </div>

      {/* Console Dotted Log checklist — Apple/Specs style */}
      <div className="w-full max-w-xs p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] backdrop-blur-sm space-y-3 font-mono text-[10px] text-slate-500">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Wifi className="h-3 w-3 text-slate-400" />
            DNS Resolution
          </span>
          <span className="text-emerald-500 font-bold">● RUNNING</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/[0.03] pt-2">
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3 w-3 text-slate-400" />
            Geo-IP Concurrency
          </span>
          <span className="text-emerald-500 font-bold">● CONNECTING</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/[0.03] pt-2">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="h-3 w-3 text-slate-400" />
            Security Scorer
          </span>
          <span className="text-slate-400 dark:text-slate-600">○ PENDING</span>
        </div>
      </div>

      {/* Background skeleton shapes representing specs sheet */}
      <div className="w-full space-y-6 pt-4 opacity-30 animate-pulse pointer-events-none">
        <div className="border-b border-slate-200 dark:border-white/5 pb-2">
          <div className="h-3 w-32 rounded bg-slate-200 dark:bg-white/5" />
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          <div className="h-8 rounded bg-slate-200 dark:bg-white/5" />
          <div className="h-8 rounded bg-slate-200 dark:bg-white/5" />
          <div className="h-8 rounded bg-slate-200 dark:bg-white/5" />
          <div className="h-8 rounded bg-slate-200 dark:bg-white/5" />
        </div>
      </div>

    </div>
  )
}
