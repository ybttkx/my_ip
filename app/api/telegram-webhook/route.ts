import { NextRequest, NextResponse } from "next/server"
import { IpManager } from "@/lib/providers/manager"
import { IpReport } from "@/lib/types"
import { isIpAddress, isPrivateOrReservedIp } from "@/lib/ip-utils"
import { normalizeDomain, resolveDomain } from "@/lib/dns-utils"

interface TelegramUpdate {
  update_id?: number
  message?: {
    text?: string
    chat?: { id?: number }
  }
}

const processedUpdates = new Map<number, number>()
const UPDATE_TTL_MS = 10 * 60 * 1000
const MAX_PROCESSED_UPDATES = 1000

function rememberUpdate(updateId: number): boolean {
  const now = Date.now()
  processedUpdates.forEach((timestamp, id) => {
    if (now - timestamp > UPDATE_TTL_MS) processedUpdates.delete(id)
  })

  if (processedUpdates.has(updateId)) return false
  processedUpdates.set(updateId, now)

  while (processedUpdates.size > MAX_PROCESSED_UPDATES) {
    const oldest = processedUpdates.keys().next().value
    if (oldest === undefined) break
    processedUpdates.delete(oldest)
  }
  return true
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function formatReportToHtml(report: IpReport, query: string): string {
  const getStars = (stars: number) => "⭐".repeat(stars)
  const aiStatusEmoji = (status: string) => {
    if (status === "available") return "✅"
    if (status === "restricted") return "⚠️"
    return "❌"
  }
  const aiStatusLabel = (status: string) => {
    if (status === "available") return "可用 (Available)"
    if (status === "restricted") return "受限 (Restricted)"
    return "不可用 (Blocked)"
  }

  const safeIp = escapeHtml(report.ip)
  const safeCountry = escapeHtml(report.country)
  const safeRegion = escapeHtml(report.regionName || report.region || "")
  const safeCity = escapeHtml(report.city || "")
  const safeIsp = escapeHtml(report.isp || "")
  const safeAsn = escapeHtml(report.asn || "")
  const safeType = escapeHtml(report.type || "Unknown")
  const starStr = getStars(report.purityScore?.stars || 5)

  let html = `🌐 <b>IP 智能检测报告 | IP Audit Report</b>\n`
  html += `━━━━━━━━━━━━━━━━━━━━\n`
  html += `📍 <b>目标查询:</b> <code>${escapeHtml(query)}</code>\n`
  html += `ℹ️ <b>实际 IP:</b> <code>${safeIp}</code>\n`
  html += `🗺️ <b>物理位置:</b> ${safeCountry} ${safeRegion} ${safeCity}\n`
  html += `📶 <b>网络类型:</b> <b>${safeType}</b>\n`
  html += `🏢 <b>ISP 运营商:</b> ${safeIsp} (${safeAsn})\n`
  html += `🛡️ <b>安全得分:</b> <b>${report.purityScore?.score ?? 100}/100</b> (${starStr})\n`
  html += `📝 <b>安全评估:</b> <i>${escapeHtml(report.purityScore?.summaryZh || "")}</i>\n\n`

  html += `🤖 <b>AI 服务准入兼容性:</b>\n`
  html += `• ChatGPT: ${aiStatusEmoji(report.aiAvailability?.chatgpt?.status)} ${aiStatusLabel(report.aiAvailability?.chatgpt?.status)}\n`
  html += `• Claude: ${aiStatusEmoji(report.aiAvailability?.claude?.status)} ${aiStatusLabel(report.aiAvailability?.claude?.status)}\n`
  html += `• Gemini: ${aiStatusEmoji(report.aiAvailability?.gemini?.status)} ${aiStatusLabel(report.aiAvailability?.gemini?.status)}\n`
  html += `• Perplexity: ${aiStatusEmoji(report.aiAvailability?.perplexity?.status)} ${aiStatusLabel(report.aiAvailability?.perplexity?.status)}\n`
  html += `• Grok: ${aiStatusEmoji(report.aiAvailability?.grok?.status)} ${aiStatusLabel(report.aiAvailability?.grok?.status)}\n\n`

  const detailUrl = `https://ip.ybovo.com/zh/ip/${encodeURIComponent(query)}`
  html += `🔗 <a href="${detailUrl}">查看网页版深度扫描报告</a>`

  return html
}

export async function POST(request: NextRequest) {
  try {
    // 1. Auth Secret Verification
    const secretToken = request.headers.get("x-telegram-bot-api-secret-token")
    const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET

    if (configuredSecret && secretToken !== configuredSecret) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      console.error("TELEGRAM_BOT_TOKEN is not configured in .env")
      return NextResponse.json({ ok: false, error: "Bot token not configured" })
    }

    // 2. Parse Telegram Update
    const body = (await request.json()) as TelegramUpdate
    if (body.update_id !== undefined && !rememberUpdate(body.update_id)) {
      return NextResponse.json({ ok: true, duplicate: true })
    }
    const message = body?.message
    if (!message || !message.chat?.id) {
      return NextResponse.json({ ok: true, message: "No message received" })
    }

    const chatId = message.chat.id
    let text = (message.text || "").trim()

    // Helper: Send reply function
    const sendReply = async (replyHtml: string) => {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyHtml,
          parse_mode: "HTML",
          disable_web_page_preview: false,
        }),
      })
    }

    // 3. Handle commands
    if (text.startsWith("/start")) {
      const welcome = `🤖 <b>欢迎使用 IP 智能检测助手！</b>\n\n` +
        `您可以向我发送任意 <b>IP地址</b> 或 <b>域名</b>，我将为您深度分析其：\n` +
        `• 🗺️ 物理地理位置\n` +
        `• 📶 宽带网络类型 (住宅/IDC/手机等)\n` +
        `• 🛡️ 纯净度扣分与安全评估\n` +
        `• 🤖 国际主流 AI 服务兼容性 (ChatGPT, Claude, Gemini...)\n\n` +
        `<b>使用示例:</b>\n` +
        `• <code>113.88.99.123</code>\n` +
        `• <code>/ip google.com</code>\n` +
        `• <code>github.com</code>\n\n` +
        `© 2026 毅白 · YIBAI`
      await sendReply(welcome)
      return NextResponse.json({ ok: true })
    }

    // Extract target query
    let query = text
    if (text.startsWith("/ip")) {
      query = text.substring(3).trim()
    }

    if (!query) {
      await sendReply("⚠️ 请提供要查询的 IP 地址或域名。\n例如: <code>/ip 8.8.8.8</code>")
      return NextResponse.json({ ok: true })
    }

    // Send a "processing" status message
    await fetch(`https://api.telegram.org/bot${botToken}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        action: "typing",
      }),
    })

    // Resolve domain name to IP if it's not a direct IP address
    let targetIp = query

    if (!isIpAddress(query)) {
      const domain = normalizeDomain(query)
      if (!domain) {
        await sendReply("⚠️ 请输入有效的 IP 地址或域名。\nPlease enter a valid IP address or domain name.")
        return NextResponse.json({ ok: true })
      }

      const resolvedFromDomain = await resolveDomain(domain)
      if (!resolvedFromDomain) {
        await sendReply("⚠️ 域名解析失败，无法继续进行 IP 分析。\nDomain resolution failed, so IP analysis cannot continue.")
        return NextResponse.json({ ok: true })
      }

      targetIp = resolvedFromDomain
    } else if (isPrivateOrReservedIp(query)) {
      await sendReply("⚠️ 该地址属于私网、本地或保留网段，无法进行公网 IP 分析。\nThis address is private, local, or reserved and cannot be audited as a public IP.")
      return NextResponse.json({ ok: true })
    }

    // Query IP Report
    const manager = new IpManager()
    let report: IpReport | null = null

    try {
      report = await manager.queryIp(targetIp)
    } catch (error) {
      console.warn("Telegram query error:", error)
    }

    if (!report) {
      await sendReply("⚠️ 实时查询失败，未返回可信的 IP 报告。\nLive lookup failed and no trustworthy IP report is available.")
      return NextResponse.json({ ok: true })
    }

    // Format & Send Reply
    const responseHtml = formatReportToHtml(report, query)
    await sendReply(responseHtml)

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    console.error("Telegram webhook error:", error)
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown webhook error",
    })
  }
}
