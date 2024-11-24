import Image from "next/image"
import FptLogo from "@/public/assets/images/fpt-logo.png"

import RegisterForm from "../_components/register-form"

function RegisterPage() {
  return (
    <div className="flex w-[420px] max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-background shadow-lg">
      <div className="container space-y-4 rounded-lg border-2 p-8 shadow-2xl">
        <div className="flex justify-center">
          <Image src={FptLogo.src} alt="Logo" width={120} height={48} />
        </div>
        <div className="flex flex-col gap-y-1">
          <h1 className="text-center text-lg font-semibold">Registration</h1>
          <p className="text-center text-sm text-muted-foreground">
            Welcome! Please fill in the details to get started.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
