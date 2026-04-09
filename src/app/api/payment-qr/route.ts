import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const data = searchParams.get("data")

  if (!data) {
    return new NextResponse("Missing QR data", { status: 400 })
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=0&data=${encodeURIComponent(data)}`
  const response = await fetch(qrUrl, {
    cache: "no-store",
  })

  if (!response.ok) {
    return new NextResponse("Unable to generate QR", { status: 502 })
  }

  const imageBuffer = await response.arrayBuffer()

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("content-type") || "image/png",
      "Cache-Control": "no-store",
    },
  })
}
