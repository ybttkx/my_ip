"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Check, MapPin, ExternalLink, Globe } from "lucide-react"
import { IpReport } from "@/lib/types"

interface IpInfoCardProps {
  report: IpReport
  locale: string
}

export default function IpInfoCard({ report, locale }: IpInfoCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (field: string, val: string) => {
    navigator.clipboard.writeText(val)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  // Simplified bilingual translation
  const getFieldLabel = (key: string) => {
    const labelsZh: Record<string, string> = {
      ip: "IP 地址",
      country: "国家/地区",
      region: "省份 / 州",
      city: "城市 / 区",
      coordinates: "地理坐标",
      timezone: "时区",
      asn: "ASN 编号",
      asnOrg: "ASN 机构",
      isp: "运营商 (ISP)",
      reverseDns: "反向 DNS (PTR)"
    }
    const labelsEn: Record<string, string> = {
      ip: "IP Address",
      country: "Country / Region",
      region: "State / Region",
      city: "City / District",
      coordinates: "Coordinates",
      timezone: "Timezone",
      asn: "ASN ID",
      asnOrg: "ASN Org",
      isp: "ISP / Carrier",
      reverseDns: "Reverse DNS"
    }
    return locale === "zh" ? labelsZh[key] : labelsEn[key]
  }

  const infoItems = [
    { key: "ip", value: report.ip, copyable: true },
    {
      key: "country",
      value: `${report.country} (${report.countryCode})`,
      copyable: false,
      extra: (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[9px] font-mono text-slate-600 dark:text-slate-400">
          {report.countryCode}
        </span>
      )
    },
    { key: "region", value: report.regionName || report.region || "--", copyable: true },
    { key: "city", value: report.city || "--", copyable: true },
    {
      key: "coordinates",
      value: `${report.lat}, ${report.lon}`,
      copyable: true,
      extra: (
        <a
          href={`https://www.openstreetmap.org/?mlat=${report.lat}&mlon=${report.lon}#map=12/${report.lat}/${report.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-white transition-colors"
        >
          <MapPin className="h-3 w-3" />
        </a>
      )
    },
    { key: "timezone", value: report.timezone || "--", copyable: true },
    { key: "asn", value: report.asn || "--", copyable: true },
    { key: "asnOrg", value: report.asnOrg || "--", copyable: true },
    { key: "isp", value: report.isp || "--", copyable: true },
    { key: "reverseDns", value: report.reverseDns || "--", copyable: true },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="w-full bg-transparent space-y-6"
    >
      <div className="border-b border-slate-200 dark:border-white/5 pb-2">
        <h3 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {locale === "zh" ? "地理与物理网络规范" : "Geographic & Physical Network Specs"}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {infoItems.map((item) => (
          <div
            key={item.key}
            className="flex flex-col space-y-1 py-1 border-b border-black/[0.03] dark:border-white/[0.03]"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-light">{getFieldLabel(item.key)}</span>
              <div className="flex items-center gap-2">
                {item.extra}
                {item.copyable && item.value !== "--" && (
                  <button
                    onClick={() => handleCopy(item.key, item.value)}
                    className="p-1 rounded text-slate-600 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedField === item.key ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="text-sm font-mono font-medium text-slate-800 dark:text-slate-200 select-all truncate pt-0.5">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
