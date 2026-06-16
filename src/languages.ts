export type LanguageRecord = { name: string; lang_code: string };

/** Stable language catalog — no runtime scrape of Google endpoints. */
export const LANGUAGES: Record<string, string> = {
  en: "english",
  my: "myanmar (burmese)",
  "zh-cn": "chinese (simplified)",
  "zh-tw": "chinese (traditional)",
  ja: "japanese",
  ko: "korean",
  th: "thai",
  vi: "vietnamese",
  hi: "hindi",
  es: "spanish",
  fr: "french",
  de: "german",
  it: "italian",
  pt: "portuguese",
  ru: "russian",
  ar: "arabic",
  id: "indonesian",
  ms: "malay",
  tl: "filipino",
  nl: "dutch",
  pl: "polish",
  tr: "turkish",
  sv: "swedish",
  da: "danish",
  fi: "finnish",
  no: "norwegian",
  cs: "czech",
  el: "greek",
  he: "hebrew",
  hu: "hungarian",
  ro: "romanian",
  uk: "ukrainian",
  bn: "bengali",
  ta: "tamil",
  te: "telugu",
  ur: "urdu",
  fa: "persian",
  sw: "swahili",
};

export function listLanguages(): LanguageRecord[] {
  return Object.entries(LANGUAGES)
    .map(([lang_code, name]) => ({ name, lang_code }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function resolveLanguage(code: string): LanguageRecord | null {
  const normalized = code.toLowerCase().trim();
  const name = LANGUAGES[normalized];
  if (!name) return null;
  return { name, lang_code: normalized };
}
