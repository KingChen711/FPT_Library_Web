export type ActionResponse<TFormSchema = undefined, TData = undefined> =
  | (TData extends undefined
      ? { isSuccess: true }
      : { isSuccess: true; data: TData })
  | { isSuccess: false; typeError: "base"; messageError: string }
  | (TFormSchema extends undefined
      ? never
      : {
          isSuccess: false
          typeError: "form"
          fieldErrors: Record<keyof TFormSchema, string>
        })
