import BorrowerDashboard from "@/components/ui/borrower-dashboard"
import { requireSessionUser } from "@/lib/auth"

export default async function ProfilePage() {
  const user = await requireSessionUser()
  return <BorrowerDashboard activePage="profile" user={user} />
}
