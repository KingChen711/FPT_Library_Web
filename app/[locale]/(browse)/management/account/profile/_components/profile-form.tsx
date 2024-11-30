"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, SquarePen } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  profileSchema,
  type TProfileSchema,
} from "@/lib/validations/auth/profile"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const ProfileForm = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [pending, startTransition] = useTransition()

  const form = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: "Doan Viet Thanh",
      collegeEmailId: "thanhdvse171867@fpt.edu.vn",
      registerNumber: "123456789",
      phoneNumber: "0123456789",
      bio: "I am a student",
    },
  })

  function onSubmit(values: TProfileSchema) {
    startTransition(async () => {
      console.log(values)
    })
  }

  const handleReset = () => {
    form.reset()
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <SquarePen
          size={18}
          className="cursor-pointer"
          onClick={() => setIsEditing(true)}
        />
      </div>
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input disabled={!isEditing || pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeEmailId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College email ID</FormLabel>
                    <FormControl>
                      <Input disabled={!isEditing || pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registerNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Register number</FormLabel>
                    <FormControl>
                      <Input disabled={!isEditing || pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input disabled={!isEditing || pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={!isEditing || pending}
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-4">
              <Button disabled={pending} type="submit">
                Update Profile
                {pending && <Loader2 className="size-4 animate-spin" />}
              </Button>
              <Button
                disabled={pending}
                variant={"ghost"}
                onClick={handleReset}
              >
                Reset
                {pending && <Loader2 className="size-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </>
    </div>
  )
}

export default ProfileForm
