import { isAuthenticated } from './actions'
import AdminShell from './admin-shell'

export const metadata = { title: 'Admin', robots: { index: false } }

export default async function AdminPage() {
  const authed = await isAuthenticated()
  return <AdminShell authed={authed} />
}
