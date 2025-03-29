import { AudioLines, BookOpen, Clock, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"
import useConfirmTransactionBorrowRequest from "@/hooks/borrow/use-confirm-transaction-borrow-request"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  borrowRequestId: number
}

const BorrowRequestTransactionDialog = ({
  borrowRequestId,
  open,
  setOpen,
}: Props) => {
  const { data: borrowRequestResources, isLoading } =
    useConfirmTransactionBorrowRequest(borrowRequestId)
  const t = useTranslations("BookPage.borrow tracking")
  // Setup Payment
  // const locale = useLocale()
  // const router = useRouter()
  // const { user, isLoadingAuth, accessToken } = useAuth()
  // const [isPending, startTransition] = useTransition()
  // const [connection, setConnection] = useState<HubConnection | null>(null)
  // const { data: paymentMethods, isLoading: isLoadingPaymentMethods } =
  //   useGetPaymentMethods()
  // const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  // const [paymentStates, setPaymentStates] = useState({
  //   leftTime: 0,
  //   canNavigate: false,
  //   navigateTime: 5,
  //   status: ETransactionStatus.PENDING,
  // })

  if (isLoading) {
    return <Loader2 className="animate-spin" />
  }

  if (!borrowRequestResources) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Confirm borrow request transaction?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please check your borrow request
            details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {borrowRequestResources.map((resource) => (
            <Card
              key={resource.borrowRequestResourceId}
              className="overflow-hidden border border-muted/50 transition-all hover:border-primary/20 hover:shadow-md"
            >
              <CardHeader className="bg-muted/10 pb-2 pt-3">
                <CardTitle className="line-clamp-1 text-base">
                  {resource?.resourceTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="progress"
                      className="flex items-center gap-1 border-primary/20 bg-primary/5 text-xs font-normal text-primary"
                    >
                      {resource.libraryResource.resourceType ===
                      EResourceBookType.EBOOK ? (
                        <>
                          <BookOpen className="size-3" />
                          {t("ebook")}
                        </>
                      ) : (
                        <>
                          <AudioLines className="size-3" />
                          {t("audio book")}
                        </>
                      )}
                    </Badge>
                  </div>

                  {resource.defaultBorrowDurationDays && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1.5 size-3.5" />
                      {t("borrow duration")}:&nbsp;
                      {resource.defaultBorrowDurationDays} &nbsp;
                      {t("days")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BorrowRequestTransactionDialog
