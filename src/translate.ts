import { GraphQLError } from "graphql";
import { resolveLanguage } from "./languages.js";

export type TranslationResult = {
  targetLanguage: { name: string; lang_code: string };
  content: string;
  pronunciation: string;
};

function useMock(): boolean {
  if (process.env.TRANSLATION_MODE === "live") return false;
  if (process.env.TRANSLATION_MODE === "mock") return true;
  return !process.env.DEEPL_API_KEY;
}

/** Demo phrases so mock mode feels real in the playground (no API key). */
const MOCK_PHRASES: Record<string, Record<string, string>> = {
  "hello, world": {
    "zh-cn": "你好，世界",
    "zh-tw": "你好，世界",
    my: "မင်္ဂလာပါ၊ ကမ္ဘာလောက",
    ja: "こんにちは、世界",
    ko: "안녕하세요, 세계",
    fr: "Bonjour le monde",
    es: "Hola, mundo",
    de: "Hallo, Welt",
  },
  hello: {
    "zh-cn": "你好",
    "zh-tw": "你好",
    my: "မင်္ဂလာပါ",
    ja: "こんにちは",
    ko: "안녕하세요",
    fr: "Bonjour",
    es: "Hola",
    de: "Hallo",
  },
};

function mockTranslation(content: string, langCode: string, languageName: string): string {
  const key = content.toLowerCase().trim();
  const phrase = MOCK_PHRASES[key]?.[langCode];
  if (phrase) return phrase;
  return `[${languageName}] ${content}`;
}

async function translateWithDeepL(
  content: string,
  targetLang: string
): Promise<{ text: string }> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY is not configured");

  const base =
    process.env.DEEPL_API_URL ?? "https://api-free.deepl.com/v2/translate";

  const body = new URLSearchParams({
    text: content,
    target_lang: targetLang.toUpperCase().replace("-", "_").split("_")[0],
  });

  const response = await fetch(base, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`DeepL error ${response.status}: ${detail}`);
  }

  const payload = (await response.json()) as {
    translations: Array<{ text: string }>;
  };
  return { text: payload.translations[0]?.text ?? content };
}

export async function translateWords(
  content: string,
  targetLanguages: string[]
): Promise<TranslationResult[]> {
  const results: TranslationResult[] = [];

  for (const code of targetLanguages) {
    const language = resolveLanguage(code);
    if (!language) {
      throw new GraphQLError(`Unknown language code: ${code}`);
    }

    let text: string;
    if (useMock()) {
      text = mockTranslation(content, code, language.name);
    } else {
      const translated = await translateWithDeepL(content, code);
      text = translated.text;
    }

    results.push({
      targetLanguage: language,
      content: text,
      pronunciation: "N.A",
    });
  }

  return results;
}
