export type ActionResponse<TData = undefined> =
  | (TData extends undefined
      ? { isSuccess: true }
      : { isSuccess: true; data: TData })
  | ServerActionError

export type ServerActionError =
  | { isSuccess: false; typeError: "unknown" }
  | { isSuccess: false; typeError: "base"; messageError: string }
  | {
      isSuccess: false
      typeError: "form"
      fieldErrors: Record<string, string[]>
    }
