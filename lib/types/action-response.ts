export type ActionResponse<TData = undefined> =
  | (TData extends undefined
      ? { isSuccess: true }
      : { isSuccess: true; data: TData })
  | ServerActionError

export type ServerActionError =
  | { isSuccess: false; typeError: "unknown" }
  | {
      isSuccess: false
      typeError: "warning"
      messageError: string
      resultCode: string
    }
  | {
      isSuccess: false
      typeError: "error"
      messageError: string
      resultCode: string
    }
  | {
      isSuccess: false
      typeError: "form"
      fieldErrors: Record<string, string[]>
    }
