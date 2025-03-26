import axios from "axios"

const dictionaries: Record<string, string | undefined> = {
  levels: "TẦNG",
  Level: "Tầng",
  "Select a location and a destination": "Chọn vị trí và điểm đến",
  Itinerary: "Lộ trình",
  Navigate: "Định vị",
  "At Level 1": "Tại Tầng 1",
  "At Level 2": "Tại Tầng 2",
  "At Level 3": "Tại Tầng 3",
  Quit: "Thoát",
  Resume: "Tiếp tục",
}

async function translateText(
  text: string,
  targetLang: string = "vi"
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_TRANSLATE_API_KEY // Thay bằng key của bạn
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`

  try {
    if (dictionaries[text]) {
      return dictionaries[text]
    }

    const response = await axios.post<{
      data: { translations: { translatedText: string }[] }
    }>(url, {
      q: text,
      target: targetLang,
    })

    dictionaries[text] = response.data.data.translations[0].translatedText
    return dictionaries[text]
  } catch (error) {
    console.error("Lỗi dịch:", error)
    return text // Trả về nguyên gốc nếu lỗi
  }
}

export default translateText
