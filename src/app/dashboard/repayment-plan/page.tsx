import BorrowerDashboard from "@/components/ui/borrower-dashboard"
import { requireSessionUser } from "@/lib/auth"

export default async function RepaymentPlanPage() {
  const user = await requireSessionUser()
  return <BorrowerDashboard activePage="repayment-plan" user={user} />
}
