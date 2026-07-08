"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <html>
      <head>
        <title>404 - Not Found</title>
      </head>
      <body className="bg-[#02040a] text-slate-200 min-h-screen flex flex-col items-center justify-center font-sans">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-2xl font-mono animate-pulse">
            !
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Page Not Found
          </h1>
          <p className="text-slate-400 text-sm">
            The requested IP Analysis report could not be found, or the route is invalid.
          </p>
          <div className="pt-4">
            <Link
              href="/en"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-lg font-medium text-sm transition-all duration-300 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
