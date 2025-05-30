// "use client"

// import React from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { managementRoutes } from "@/constants"
// import { useManagementSideBar } from "@/stores/use-management-sidebar"
// import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react"
// import { useTranslations } from "next-intl"

// import { EFeature } from "@/lib/types/enums"
// import { cn } from "@/lib/utils"
// import useAccessibleFeatures from "@/hooks/features/use-accessible-features"
// import { Skeleton } from "@/components/ui/skeleton"

// import Logo from "./logo"

// function LeftSidebar() {
//   const pathname = usePathname()
//   const t = useTranslations("Routes")
//   const { toggle, isCollapsed } = useManagementSideBar()
//   const { data, isLoading } = useAccessibleFeatures()
//   const accessibleFeatures = data?.map((item) => item.featureId) || []

//   return (
//     <section
//       className={cn(
//         "sticky left-0 top-0 z-20 flex h-screen w-[110px] shrink-0 flex-col justify-between overflow-y-auto border-r bg-card transition-all dark:shadow-none max-sm:hidden lg:w-[300px]",
//         isCollapsed && "lg:w-[110px]"
//       )}
//     >
//       <div className="flex flex-col">
//         <Logo />
//         <div
//           className={cn(
//             "h-0 w-full transition-all lg:h-2",
//             isCollapsed && "lg:h-0"
//           )}
//         ></div>
//         <div
//           className={cn(
//             "flex flex-col transition-all max-lg:px-6 lg:px-3",
//             isCollapsed && "lg:px-6"
//           )}
//         >
//           <div
//             onClick={() => toggle()}
//             className={cn(
//               "flex cursor-pointer items-center justify-start rounded-md p-4 text-muted-foreground transition-all hover:bg-border/30 max-lg:hidden",
//               !isCollapsed && "absolute right-0 top-0",
//               isCollapsed && "w-fit"
//             )}
//           >
//             {isCollapsed ? (
//               <ArrowRightFromLine size={20} />
//             ) : (
//               <ArrowLeftFromLine size={20} />
//             )}
//           </div>

//           {isLoading && (
//             <>
//               {Array(6)
//                 .fill(null)
//                 .map((_, i) => (
//                   <Skeleton
//                     key={i}
//                     className="mb-2 h-[44px] w-full rounded-md"
//                   />
//                 ))}
//             </>
//           )}

//           {!isLoading &&
//             managementRoutes.map(({ Icon, label, route, feature }) => {
//               if (
//                 !accessibleFeatures.includes(feature) &&
//                 feature !== EFeature.DASHBOARD_MANAGEMENT
//               ) {
//                 return null
//               }

//               const isActive =
//                 (pathname.slice(3).startsWith(route) &&
//                   route !== "/management") ||
//                 (pathname.slice(3) === "/management" && route === "/management")

//               return (
//                 <Link
//                   key={route}
//                   href={route}
//                   className={cn(
//                     "flex items-center justify-start gap-4 rounded-md p-4 text-muted-foreground hover:bg-border/30 max-lg:w-fit",
//                     isActive && "bg-border/30 text-primary",
//                     isCollapsed && "w-fit"
//                   )}
//                 >
//                   <Icon className={cn("inline-block size-5")} />

//                   <p
//                     className={cn(
//                       "h-5 overflow-hidden text-nowrap transition-all max-lg:hidden",
//                       isActive && "font-semibold",
//                       isCollapsed && "hidden"
//                     )}
//                   >
//                     {t(label)}
//                   </p>
//                 </Link>
//               )
//             })}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default LeftSidebar
