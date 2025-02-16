"use client"

import React, { useState } from "react"
import {
  Building,
  Mail,
  MapPin,
  PencilIcon,
  Phone,
  Trash2Icon,
  User,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { type Supplier } from "@/lib/types/models"
import ActiveBadge from "@/components/ui/active-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Skeleton } from "@/components/ui/skeleton"
import SupplierTypeBadge from "@/components/ui/supplier-type-badge"

import DeleteSupplierDialog from "./delete-supplier-dialog"
import MutateSupplierDialog from "./mutate-supplier-dialog"

type Props = {
  supplier: Supplier
}

function SupplierCard({ supplier }: Props) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const t = useTranslations("SuppliersManagementPage")

  return (
    <>
      <MutateSupplierDialog
        type="update"
        supplier={supplier}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
      />
      <DeleteSupplierDialog
        supplierId={supplier.supplierId}
        supplierName={supplier.supplierName}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Card className="col-span-12 h-full flex-1 rounded-md border bg-card shadow sm:col-span-6 lg:col-span-3">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-2">
                <CardTitle className="line-clamp-2 text-xl font-bold">
                  {supplier.supplierName}
                </CardTitle>
                <div className="flex gap-2">
                  <SupplierTypeBadge status={supplier.supplierType} />
                  <ActiveBadge active={supplier.isActive} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              {supplier.contactPerson && (
                <div className="flex items-center gap-2">
                  <User className="size-4 shrink-0 opacity-70" />
                  <span className="text-sm">{supplier.contactPerson}</span>
                </div>
              )}
              {supplier.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0 opacity-70" />
                  <span className="text-sm">{supplier.contactEmail}</span>
                </div>
              )}
              {supplier.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 opacity-70" />
                  <span className="text-sm">{supplier.contactPhone}</span>
                </div>
              )}
              {supplier.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 opacity-70" />
                  <span className="text-sm">{supplier.address}</span>
                </div>
              )}
              {(supplier.city || supplier.country) && (
                <div className="flex items-center gap-2">
                  <Building className="size-4 shrink-0 opacity-70" />
                  <span className="text-sm">
                    {[supplier.city, supplier.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onSelect={() => setOpenEdit(true)}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <PencilIcon className="size-4" />
            {t("Edit")}
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => setOpenDelete(true)}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <Trash2Icon className="size-4" />
            {t("Delete")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}

export default SupplierCard

export const SupplierCardSkeleton = () => (
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <div className="col-span-12 h-full flex-1 rounded-md border bg-card p-4 shadow sm:col-span-6 lg:col-span-3">
        <div className="flex">
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="mt-2">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="mt-2">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-3/4" />
        </div>
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem className="flex cursor-pointer items-center gap-x-2">
        <Skeleton className="size-4" />
        <Skeleton className="h-4 w-12" />
      </ContextMenuItem>
      <ContextMenuItem className="flex cursor-pointer items-center gap-x-2">
        <Skeleton className="size-4" />
        <Skeleton className="h-4 w-16" />
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
)
