import React from "react"
import Image from "next/image"
import bgDark from "@/public/assets/images/bg-dark.jpg"
import bgLight from "@/public/assets/images/bg-light.jpg"
import { GoogleOAuthProvider } from "@react-oauth/google"

type Props = {
  children: React.ReactNode
}

function AuthLayout({ children }: Props) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="flex min-h-dvh flex-col items-center justify-center gap-y-6 px-6 py-8">
        <div className="fixed -z-50 h-screen w-screen">
          <Image
            alt="bg"
            fill
            priority
            src={bgLight}
            placeholder="blur"
            quality={100}
            sizes="100vw"
            className="object-cover dark:hidden"
          />
          <Image
            alt="bg"
            fill
            priority
            placeholder="blur"
            quality={100}
            src={bgDark}
            sizes="100vw"
            className="hidden object-cover dark:inline"
          />
        </div>
        {children}
      </div>
    </GoogleOAuthProvider>
  )
}

export default AuthLayout
