import translator, { LanguageCode } from "open-google-translator";

export const translateText = async (
  text: string,
  toLanguage: LanguageCode = "vi",
  fromLanguage: LanguageCode = "en"
): Promise<string> => {
  try {
    const [result] = await translator.TranslateLanguageData({
      listOfWordsToTranslate: [text],
      fromLanguage,
      toLanguage,
    });
    return result.translation || text;
  } catch (err) {
    console.error("Translate error:", err);
    return text; // fallback nếu lỗi
  }
};
