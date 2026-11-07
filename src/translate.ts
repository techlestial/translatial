import { GraphQLError } from "graphql";
import { resolveLanguage } from "./languages.js";

export type TranslationResult = {
  targetLanguage: { name: string; lang_code: string };
  content: string;
  pronunciation: string;
};

export type TranslateProvider = "mock" | "mymemory" | "deepl";

/** Demo phrases for unit tests (`TRANSLATION_MODE=mock`). */
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

export function resolveProvider(): TranslateProvider {
  if (process.env.TRANSLATION_MODE === "mock") return "mock";
  if (process.env.TRANSLATE_PROVIDER === "mock") return "mock";
  if (
    process.env.TRANSLATE_PROVIDER === "deepl" ||
    (process.env.DEEPL_API_KEY && process.env.TRANSLATE_PROVIDER !== "mymemory")
  ) {
    if (!process.env.DEEPL_API_KEY) {
      throw new GraphQLError("DEEPL_API_KEY is not configured");
    }
    return "deepl";
  }
  return "mymemory";
}

function mockTranslation(content: string, langCode: string, languageName: string): string {
  const key = content.toLowerCase().trim();
  return MOCK_PHRASES[key]?.[langCode] ?? `[${languageName}] ${content}`;
}

function toMyMemoryLang(code: string): string {
  if (code === "zh-cn") return "zh-CN";
  if (code === "zh-tw") return "zh-TW";
  return code;
}

function toDeepLLang(code: string): string {
  if (code === "zh-cn" || code === "zh-tw") return "ZH";
  if (code === "pt") return "PT";
  if (code === "en") return "EN";
  return code.toUpperCase().split("-")[0];
}

async function translateWithMyMemory(content: string, targetLang: string): Promise<string> {
  const params = new URLSearchParams({
    q: content,
    langpair: `Autodetect|${toMyMemoryLang(targetLang)}`,
  });
  const email = process.env.MYMEMORY_EMAIL;
  if (email) params.set("de", email);

  const response = await fetch(`https://api.mymemory.translated.net/get?${params}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new GraphQLError(`Translation API error ${response.status}: ${detail}`);
  }

  const payload = (await response.json()) as {
    responseStatus?: number;
    quotaFinished?: boolean;
    responseData?: { translatedText?: string };
    responseDetails?: string;
  };

  const text = payload.responseData?.translatedText?.trim() ?? "";
  if (payload.quotaFinished || /MYMEMORY WARNING/i.test(text)) {
    throw new GraphQLError("Translation quota exceeded. Retry later or set DEEPL_API_KEY.");
  }
  if (payload.responseStatus && payload.responseStatus !== 200) {
    throw new GraphQLError(payload.responseDetails || `Translation failed (${payload.responseStatus})`);
  }
  if (!text) {
    throw new GraphQLError("Translation API returned an empty result");
  }
  return text;
}

async function translateWithDeepL(content: string, targetLang: string): Promise<string> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new GraphQLError("DEEPL_API_KEY is not configured");

  const base = process.env.DEEPL_API_URL ?? "https://api-free.deepl.com/v2/translate";
  const body = new URLSearchParams({
    text: content,
    target_lang: toDeepLLang(targetLang),
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
    throw new GraphQLError(`DeepL error ${response.status}: ${detail}`);
  }

  const payload = (await response.json()) as {
    translations: Array<{ text: string }>;
  };
  return payload.translations[0]?.text ?? content;
}

async function translateOne(
  content: string,
  langCode: string,
  languageName: string,
  provider: TranslateProvider
): Promise<string> {
  if (provider === "mock") return mockTranslation(content, langCode, languageName);
  if (provider === "deepl") return translateWithDeepL(content, langCode);
  return translateWithMyMemory(content, langCode);
}

export async function translateWords(
  content: string,
  targetLanguages: string[]
): Promise<TranslationResult[]> {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new GraphQLError("content must not be empty");
  }

  const provider = resolveProvider();
  const languages = targetLanguages.map((code) => {
    const language = resolveLanguage(code);
    if (!language) {
      throw new GraphQLError(`Unknown language code: ${code}`);
    }
    return language;
  });

  const texts = await Promise.all(
    languages.map((language) => translateOne(trimmed, language.lang_code, language.name, provider))
  );

  return languages.map((language, index) => ({
    targetLanguage: language,
    content: texts[index],
    pronunciation: "N.A",
  }));
}
