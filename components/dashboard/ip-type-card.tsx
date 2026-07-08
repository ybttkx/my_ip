"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { IpType } from "@/lib/types"

interface IpTypeCardProps {
  primaryType: IpType
  locale: string
}

export default function IpTypeCard({ primaryType, locale }: IpTypeCardProps) {
  const t = useTranslations("Dashboard")

  const getTypeWeight = (type: IpType, category: string): number => {
    if (type === "Residential" && category === "Residential") return 95
    if (type === "Residential" && category === "Business") return 5
    
    if (type === "Hosting" && category === "Hosting") return 90
    if (type === "Hosting" && category === "IDC") return 10
    
    if (type === "IDC" && category === "IDC") return 85
    if (type === "IDC" && category === "Hosting") return 15
    
    if (type === "Mobile" && category === "Mobile") return 92
    if (type === "Mobile" && category === "Residential") return 8
    
    if (type === "Education" && category === "Education") return 95
    if (type === "Education" && category === "Business") return 5
    
    if (type === "Business" && category === "Business") return 88
    if (type === "Business" && category === "Residential") return 12

    if (type === category) return 80
    return 0
  }

  const categories = [
    { key: "Residential", label: t("type_residential") },
    { key: "IDC", label: t("type_idc") },
    { key: "Hosting", label: t("type_hosting") },
    { key: "Mobile", label: t("type_mobile") },
    { key: "Education", label: t("type_education") },
    { key: "Business", label: t("type_business") },
  ]

  const getPrimaryTypeLabel = (type: IpType) => {
    switch (type) {
      case "Residential": return t("type_residential")
      case "IDC": return t("type_idc")
      case "Hosting": return t("type_hosting")
      case "Mobile": return t("type_mobile")
      case "Education": return t("type_education")
      case "Business": return t("type_business")
      default: return t("type_unknown")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full bg-transparent space-y-6"
    >
      <div className="border-b border-slate-200 dark:border-white/5 pb-2">
        <h3 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {locale === "zh" ? "分类与应用场景研判" : "Network Classification Weights"}
        </h3>
      </div>

      {/* Main highlighted category badge */}
      <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
        {locale === "zh" ? "核心研判结果" : "Primary Classification"}:{" "}
        <span className="text-slate-900 dark:text-white font-bold underline underline-offset-4 decoration-black/20 dark:decoration-white/20">
          {getPrimaryTypeLabel(primaryType)}
        </span>
      </div>

      {/* Breakdown bar charts */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const weight = getTypeWeight(primaryType, cat.key)
          return (
            <div key={cat.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-mono ${weight > 0 ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-600"}`}>
                  {cat.label}
                </span>
                <span className={`font-mono ${weight > 0 ? "text-slate-900 dark:text-white font-semibold" : "text-slate-500 dark:text-slate-700"}`}>
                  {weight}%
                </span>
              </div>
              <div className="h-[2px] w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${weight}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    weight > 80 ? "bg-black dark:bg-white" : "bg-slate-300 dark:bg-slate-800"
                  }`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
