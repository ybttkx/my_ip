"use client"

import { useTheme } from "@/context/theme-context"
import React from "react"
import { BsMoon, BsSun } from "react-icons/bs"

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      className="w-8 h-8 flex items-center justify-center rounded-full text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 active:scale-90"
      onClick={toggleTheme}
    >
      <span className="sr-only">Toggle theme mode</span>
      {theme === "light" ? <BsSun className="h-4 w-4" /> : <BsMoon className="h-3.5 w-3.5" />}
    </button>
  )
}
