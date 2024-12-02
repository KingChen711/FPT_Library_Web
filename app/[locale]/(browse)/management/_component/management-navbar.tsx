// import Actions from "./actions"
import Actions from "./actions"

function ManagementNavbar() {
  return (
    <nav className="fixed left-0 top-0 flex h-16 w-full items-center justify-end bg-background px-6 lg:px-3">
      <Actions />
    </nav>
  )
}

export default ManagementNavbar
