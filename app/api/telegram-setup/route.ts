import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN is not configured in .env" })
  }

  if (configuredSecret && secret !== configuredSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized: Invalid secret query parameter" })
  }

  // Dynamic origin extraction makes ngrok local development or production easy to bind
  const origin = request.nextUrl.origin
  const webhookUrl = `${origin}/api/telegram-webhook`

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: configuredSecret || undefined,
      }),
    })
    const data = await response.json()
    return NextResponse.json({
      ok: data.ok,
      message: data.description || "Webhook setup completed",
      webhookUrl,
      telegramResponse: data,
    })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message })
  }
}
