import "server-only"

import jwt from "jsonwebtoken"
import sharp from "sharp"

export async function getBlurDataURL(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()

    const resizedBuffer = await sharp(Buffer.from(buffer))
      .resize(10, 10, { fit: "inside" }) // giữ tỉ lệ, resize nhỏ để blur
      .toFormat("jpeg")
      .toBuffer()

    const base64 = resizedBuffer.toString("base64")
    return `data:image/jpeg;base64,${base64}`
  } catch {
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACkAKQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAEDBf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO0AioACAKIAAAAAAAAACAAgAgADUBFEVAQVFEAAAAAAFAQAEFQBFQAAGoqICKgCKigigICgigAAAioAioAAAADUBBBUBEUBAFAAABAAAAUQAEFQAAGoqICKgCKgIKigAAKIAAIKigioAAAADUBBAARFAQAABQAQAAAFEABBUAABqKiAioCCoCCooAAKCAACCooIqAAAAA1AQRFARFRQABFAAAABAAUQAEAAABqAggAIiiiAAAAAAAAAAgACKgAANQEEFQEAUQAAAAABQBAAEVAEVAAAagICAogAIAAAAACgAgACAAgAAA//2Q=="
  }
}

interface DecodedToken {
  email: string
  exp: number
  userType: "user" | "employee"
  //...s
}

// export default async function getBase64(imageUrl: string): Promise<string> {
//   try {
//     const res = await fetch(imageUrl)

//     if (!res.ok) {
//       throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`)
//     }

//     const buffer = await res.arrayBuffer()

//     const { base64 } = await getPlaiceholder(Buffer.from(buffer))

//     return base64
//   } catch (e) {
//     if (e instanceof Error) console.log(e.stack)
//     return ""
//   }
// }

export function isTokenExpiringSoon(token: string): boolean {
  try {
    // Decode token để lấy payload
    const decoded = verifyToken(token)

    if (!decoded?.exp) {
      throw new Error("Token không chứa exp")
    }

    // Thời gian hiện tại (tính bằng giây)
    const currentTime = Math.floor(Date.now() / 1000)

    // Thời gian còn lại (tính bằng giây)
    const timeLeft = decoded.exp - currentTime

    // Kiểm tra nếu thời gian hết hạn còn dưới 1 tiếng (3600 giây)
    return timeLeft <= 3600
  } catch {
    return true
  }
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as DecodedToken

    return verified
  } catch {
    return null
  }
}
