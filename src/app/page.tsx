import HomePageClient from "@/components/home-page-client"

type HomePageProps = {
  searchParams: Promise<{ auth?: string | string[] }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  const authParam = resolvedSearchParams.auth
  const shouldOpenAuth = Array.isArray(authParam) ? authParam.includes("1") : authParam === "1"

  return <HomePageClient shouldOpenAuth={shouldOpenAuth} />
}
