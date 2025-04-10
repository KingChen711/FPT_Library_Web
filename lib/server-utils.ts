import "server-only"

import jwt from "jsonwebtoken"

// import { getPlaiceholder } from "plaiceholder"

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

    console.log({
      exp: decoded.exp,
      currentTime,
    })

    // Thời gian còn lại (tính bằng giây)
    const timeLeft = decoded.exp - currentTime

    // Kiểm tra nếu thời gian hết hạn còn dưới 1 tiếng (3600 giây)
    return timeLeft <= 3600
  } catch (error) {
    console.log("isTokenExpiringSoon", error)
    //default return true to trigger refresh token
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
