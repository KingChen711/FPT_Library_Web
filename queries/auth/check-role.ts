import "server-only"

import { ERole } from "@/lib/types/enums"

import whoAmI from "./who-am-i"

//no export
const checkRole = async (role: ERole) => {
  const user = await whoAmI()
  return user?.role.roleName === role
}

const isAdmin = async () => await checkRole(ERole.ADMIN)
const isStaff = async () => await checkRole(ERole.STAFF)
const isTeacher = async () => await checkRole(ERole.TEACHER)
const isStudent = async () => await checkRole(ERole.STUDENT)

export { isAdmin, isStaff, isStudent, isTeacher }
