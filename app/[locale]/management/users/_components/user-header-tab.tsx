// "use client"

// import Link from "next/link"
// import { usePathname, useSearchParams } from "next/navigation"

// import {  ESystemRoutes } from "@/lib/types/enums"
// import { cn } from "@/lib/utils"

// type UserHeaderTabProps = {
//   locale: string
// }

// const userManagementRoutes = [
//   {
//     label: "All",
//     route: `${ESystemRoutes.USER_MANAGEMENT}`,
//   },
//   {
//     label: ERole.ADMIN,
//     route: `${ESystemRoutes.USER_MANAGEMENT}?role=${ERole.ADMIN.toLowerCase()}`,
//   },
//   {
//     label: ERole.STAFF,
//     route: `${ESystemRoutes.USER_MANAGEMENT}?role=${ERole.STAFF.toLowerCase()}`,
//   },
//   {
//     label: ERole.TEACHER,
//     route: `${ESystemRoutes.USER_MANAGEMENT}?role=${ERole.TEACHER.toLowerCase()}`,
//   },
//   {
//     label: ERole.STUDENT,
//     route: `${ESystemRoutes.USER_MANAGEMENT}?role=${ERole.STUDENT.toLowerCase()}`,
//   },
// ]

// const UserHeaderTab = ({ locale }: UserHeaderTabProps) => {
//   const pathname = usePathname()
//   const searchParams = useSearchParams()

//   const isActive = (route: string) => {
//     const [routePath, routeQuery] = route.split("?")
//     const currentPath = `/${locale}${routePath}`

//     // Nếu là "All", kiểm tra cả hai trường hợp
//     if (route === `${ESystemRoutes.USER_MANAGEMENT}`) {
//       const roleParam = searchParams.get("role")
//       return (
//         pathname === currentPath && (roleParam === null || roleParam === "")
//       )
//     }

//     // Kiểm tra các route khác
//     if (pathname !== currentPath) return false

//     const queryParams = new URLSearchParams(routeQuery || "")
//     for (const [key, value] of queryParams) {
//       if (searchParams.get(key) !== value) return false
//     }

//     return true
//   }

//   return (
//     <div className="flex items-center">
//       {userManagementRoutes.map((route) => (
//         <Link
//           key={route.label}
//           href={`/${locale}${route.route}`}
//           className={cn(
//             "w-[120px] border-b-2 pb-1 text-center text-base font-semibold text-muted-foreground hover:border-primary hover:text-primary",
//             isActive(route.route) && "border-primary text-primary"
//           )}
//         >
//           {route.label}
//         </Link>
//       ))}
//     </div>
//   )
// }

// export default UserHeaderTab
