import Image from "next/image"
import fptLogo from "@/public/assets/images/fpt-logo.png"

import fptLogo2 from "@/app/favicon.ico"

function Logo() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-2 pb-4 pt-8 lg:gap-y-4">
      <Image
        alt="logo"
        src={fptLogo}
        width={160}
        height={72}
        className="object-cover max-lg:hidden"
      />
      <Image
        alt="logo"
        src={fptLogo2}
        width={48}
        height={48}
        className="object-cover lg:hidden"
      />

      <div className="text-sm font-bold lg:text-base">E-library</div>
    </div>
  )
}

export default Logo
