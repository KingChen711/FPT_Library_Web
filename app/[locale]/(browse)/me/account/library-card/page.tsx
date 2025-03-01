"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-provider"
import MomoPayment from "@/public/assets/images/momo_payment.png"
import PayOSPayment from "@/public/assets/images/payos_payment.png"
import Logo from "@/public/images/logo.png"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Barcode from "react-barcode"
import { useForm } from "react-hook-form"
import { z } from "zod"

import LibraryPackages from "./_components/library-packages"
import RegisteredLibraryCard from "./_components/registered-library-card"

const MeLibraryCard = () => {
  const { user, isLoadingAuth } = useAuth()

  if (isLoadingAuth) {
    return (
      <div className="size-full">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div>
      {user?.libraryCard ? (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Library card</h2>
          <RegisteredLibraryCard user={user} />
        </div>
      ) : (
        <LibraryPackages />
      )}
    </div>
  )
}

export default MeLibraryCard
