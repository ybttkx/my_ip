export default function WidgetWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-center gap-1 p-1 bg-white/70 dark:bg-black/40 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-lg rounded-full transition-all duration-300">
      {children}
    </div>
  )
}
