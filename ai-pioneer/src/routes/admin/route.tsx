import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getAdminSession } from '@/server/admin'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/admin/login') {
      return
    }

    const session = await getAdminSession()
    if (!session) {
      throw redirect({
        to: '/admin/login',
        search: { redirect: location.pathname },
      })
    }
  },
  component: AdminShell,
})

function AdminShell() {
  return <Outlet />
}
