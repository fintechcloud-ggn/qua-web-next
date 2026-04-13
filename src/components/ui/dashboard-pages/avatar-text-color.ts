const avatarTextColors = ["#9e520f", "#0f5b84", "#2f6b1f", "#a33b61", "#6f42c1", "#9a6400"]

export function getAvatarTextColor(seed: string) {
  const key = seed.trim().toLowerCase()
  const hash = key.split("").reduce((total, char) => total + char.charCodeAt(0), 0)

  return avatarTextColors[hash % avatarTextColors.length]
}
