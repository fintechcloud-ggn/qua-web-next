import { Card, Eyebrow } from "@/components/ui/dashboard-shared"
import { getAvatarTextColor } from "@/components/ui/dashboard-pages/avatar-text-color"

export function ProfileWorkspace({
  initials,
  fullName,
}: {
  initials: string
  fullName: string
}) {
  const avatarTextColor = getAvatarTextColor(fullName)

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_320px]">
      <Card className="overflow-hidden bg-[linear-gradient(180deg,#fff8f2_0%,#fff0e0_100%)] p-6">
        <div className="flex flex-col items-start gap-5 rounded-[1.75rem] border border-[#f0d7bf] bg-white/80 p-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Profile</Eyebrow>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#201812]">Profile controls now live in the popup</h3>
            <p className="mt-3 text-sm leading-6 text-[#6f6358]">
              This page is now a profile hub instead of the old editable card. Use the round avatar or the profile button to open the profile popup experience.
            </p>
          </div>

          <div className="flex size-28 items-center justify-center rounded-full bg-[#ffe2c9] text-4xl font-black ring-8 ring-white shadow-[0_18px_40px_rgba(156,78,11,0.14)]" style={{ color: avatarTextColor }}>
            {initials}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { label: "Profile entry", value: "Avatar and profile button" },
            { label: "Editable fields", value: "Name, mobile, email, address" },
            { label: "Read-only preview", value: "Avatar click opens readonly mode" },
            { label: "Persistent data", value: "Saved in local storage" },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.1rem] border border-[#f0d7bf] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(156,78,11,0.05)]">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">{item.label}</div>
              <div className="mt-2 text-sm font-semibold text-[#201812]">{item.value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-[#2f190c] p-5 text-white">
        <Eyebrow>Profile notes</Eyebrow>
        <h3 className="mt-2 text-xl font-black text-white">How it works</h3>
        <div className="mt-5 space-y-3">
          {[
            "Circle click opens a read-only profile preview.",
            "Profile button opens the editable popup version.",
            "Loan progress and dashboard navigation stay outside the popup.",
          ].map((item) => (
            <div key={item} className="rounded-[1rem] bg-white/8 px-4 py-3 text-sm font-semibold text-white">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
