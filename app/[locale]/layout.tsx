import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { notFound } from "next/navigation"
import AuthProvider from "@/contexts/auth-provider"
import { ReactQueryProvider } from "@/contexts/react-query-provider"
// import SocketProvider from "@/contexts/socket-provider"
import { ThemeProvider } from "@/contexts/theme-provider"
import { routing } from "@/i18n/routing"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"

import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: {
    template: "%s | FPT E-library",
    default: "FPT E-library",
  },
  description: "Generated by create next app",
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const locale = (await params).locale

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    return notFound()
  }

  // Enable static rendering with next-intl
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              {/* <SocketProvider> */}
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
              {/* </SocketProvider> */}
            </AuthProvider>
          </NextIntlClientProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
