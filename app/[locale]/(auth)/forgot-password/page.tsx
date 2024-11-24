import Image from "next/image"
import FptLogo from "@/public/images/fpt-logo.png"

import ForgotPasswordForm from "../_components/forgot-password-form"

const ForgotPasswordPage = () => {
  return (
    <div className="flex w-1/3 flex-col items-center justify-center gap-6 overflow-hidden">
      <div className="container space-y-2 overflow-hidden rounded-lg border-2 bg-white p-8 shadow-lg">
        <div className="flex justify-center">
          <Image src={FptLogo.src} alt="Logo" width={160} height={20} />
        </div>
        <h1 className="text-center font-semibold">Forgot your password</h1>
        <p className="text-center text-gray-400">
          Enter the email address and we will send you a link to reset your
          password
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPasswordPage
