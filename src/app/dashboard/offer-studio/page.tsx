import BorrowerDashboard from "@/components/ui/borrower-dashboard"
import { requireSessionUser } from "@/lib/auth"

export default async function OfferStudioPage() {
  const user = await requireSessionUser()
  return <BorrowerDashboard activePage="offer-studio" user={user} />
}
