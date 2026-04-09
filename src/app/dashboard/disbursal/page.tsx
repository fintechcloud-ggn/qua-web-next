import BorrowerDashboard from "@/components/ui/borrower-dashboard"
import { requireSessionUser } from "@/lib/auth"

export default async function DisbursalPage() {
  const user = await requireSessionUser()
  return <BorrowerDashboard activePage="disbursal" user={user} />
}
