import BorrowerDashboard from "@/components/ui/borrower-dashboard"
import { requireSessionUser } from "@/lib/auth"

export default async function ApplicationPage() {
  const user = await requireSessionUser()
  return <BorrowerDashboard activePage="application" user={user} />
}
