"use client"

import type React from "react"
import { useRef, useState, useTransition } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { BookOpen, Calendar, Loader2, MapPin, User, X } from "lucide-react"
import Barcode from "react-barcode"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { formatDate } from "@/lib/utils"
import { uploadBookImage } from "@/actions/books/upload-medias"
import { registerLibraryCard } from "@/actions/library-cards/register-library-card"
import useGetPaymentMethods from "@/hooks/payment-methods/use-get-payment-method"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  avatar: z.custom<File | null>(
    (file) => file === null || file instanceof File,
    {
      message: "Avatar is required",
    }
  ),
  fullName: z.string().min(1, { message: "Required" }),
  libraryCardPackageId: z.number().int().positive(),
  resourceId: z.string().nullable().catch(null),
  description: z.string().nullable().catch(null),
  paymentMethodId: z.number().int().positive(),
  transactionType: z.number().int().positive(),
})

type Props = {
  searchParams: {
    libraryCardId: string
  }
}

const LibraryCardRegister = ({ searchParams }: Props) => {
  const { user, isLoadingAuth } = useAuth()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isPending, startTransition] = useTransition()
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } =
    useGetPaymentMethods()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: null,
      fullName: "",
      libraryCardPackageId: +searchParams.libraryCardId,
      resourceId: null,
      description: null,
      paymentMethodId: 1,
      transactionType: 2,
    },
  })

  if (isLoadingAuth || isLoadingPaymentMethods) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("avatar", file, { shouldValidate: true })
    }
  }

  const clearAvatar = () => {
    setPreviewImage(null)
    form.setValue("avatar", null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      if (!values.avatar) {
        form.setError("avatar", { message: "Avatar is required" })
        return
      }
      if (values.avatar) {
        const data = await uploadBookImage(values.avatar)
        if (data) {
          console.log("🚀 ~ startTransition ~ data:", data)
          const res = await registerLibraryCard({
            avatar: data.secureUrl,
            fullName: values.fullName,
          })
          console.log("🚀 ~ startTransition ~ res:", res)
        }
      }
    })

    console.log(values)
  }

  const cardId = "0123456789"
  const formattedCardId = cardId.replace(/(\d{4})/g, "$1 ").trim()

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-6 text-center text-2xl font-bold text-primary">
        Library Card Registration
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="border-b pb-2 text-lg font-semibold">
                Personal Information
              </h2>

              {/* Avatar upload section */}
              <div className="flex flex-col items-center gap-4">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field: { value, ...field } }) => (
                    <FormItem className="w-full">
                      <FormLabel className="flex items-center">
                        Profile Photo
                        <span className="ml-1 text-danger">*</span>
                      </FormLabel>
                      <div className="relative">
                        <div
                          className="mx-auto flex size-32 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[hsl(178,71%,27%)] bg-gray-200"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {previewImage ? (
                            <Image
                              src={previewImage || "/placeholder.svg"}
                              alt="Avatar preview"
                              width={150}
                              height={150}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center">
                              <User className="size-16" />
                              <span className="mt-1 text-xs">Required</span>
                            </div>
                          )}
                        </div>
                        {previewImage && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-1/4 top-0 rounded-full"
                            onClick={clearAvatar}
                          >
                            <X className="size-4" />
                            <span className="sr-only">Clear avatar</span>
                          </Button>
                        )}
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            {...field}
                            ref={(e) => {
                              field.ref(e)
                              fileInputRef.current = e
                            }}
                            className="hidden"
                            onChange={(e) => {
                              field.onChange(e)
                              handleImageChange(e)
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-center" />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value.toString()}
                        onValueChange={(value) =>
                          field.onChange(Number.parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods &&
                            paymentMethods?.map((paymentMethod) => (
                              <SelectItem
                                key={paymentMethod.paymentMethodId}
                                value={paymentMethod.paymentMethodId.toString()}
                              >
                                {paymentMethod.methodName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Register Library Card</Button>
            </div>

            {/* Library Card Preview */}
            <div>
              <h2 className="mb-4 border-b pb-2 text-lg font-semibold">
                Card Preview
              </h2>
              <Card className="overflow-hidden border-2">
                <CardHeader className="bg-primary p-4 text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-6" />
                      <h3 className="text-xl font-bold">ELibrary</h3>
                    </div>
                    <div className="text-sm">
                      <p>Member Card</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <div className="flex gap-4">
                    <div className="flex size-24 items-center justify-center overflow-hidden rounded-md border">
                      {previewImage ? (
                        <Image
                          src={previewImage || "/placeholder.svg"}
                          alt="Avatar preview"
                          width={96}
                          height={96}
                          className="size-full object-cover"
                        />
                      ) : (
                        <User className="size-12" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-lg font-semibold">
                        {form.watch("fullName") || "Your Name"}
                      </p>
                      <p className="text-sm">
                        {user?.email || "user@example.com"}
                      </p>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="size-3" />
                        <span>
                          {formatDate(user?.dob as string) || "01/01/1990"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="size-3" />
                        <span>{user?.address || "123 Library Street"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Card ID:</span>
                      <span className="font-medium">{formattedCardId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Issue Date:</span>
                      <span>{formatDate(new Date().toISOString())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expiry Date:</span>
                      <span>
                        {formatDate(
                          new Date(
                            new Date().setFullYear(new Date().getFullYear() + 1)
                          ).toISOString()
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Barcode
                      value={cardId}
                      width={1.5}
                      height={40}
                      fontSize={12}
                      margin={0}
                      displayValue={true}
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-3 text-center text-xs">
                  <p className="w-full">
                    This card remains the property of ELibrary. If found, please
                    return to any ELibrary branch.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default LibraryCardRegister
