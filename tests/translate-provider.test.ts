import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveProvider, translateWords } from "../src/translate.js";

describe("translate provider", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    delete process.env.TRANSLATION_MODE;
    delete process.env.TRANSLATE_PROVIDER;
    delete process.env.DEEPL_API_KEY;
    delete process.env.MYMEMORY_EMAIL;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
    delete process.env.TRANSLATION_MODE;
    delete process.env.TRANSLATE_PROVIDER;
    delete process.env.DEEPL_API_KEY;
  });

  it("defaults to MyMemory so any content can be translated", () => {
    expect(resolveProvider()).toBe("mymemory");
  });

  it("uses mock only when explicitly requested", () => {
    process.env.TRANSLATION_MODE = "mock";
    expect(resolveProvider()).toBe("mock");
  });

  it("uses DeepL when an API key is configured", () => {
    process.env.DEEPL_API_KEY = "secret";
    expect(resolveProvider()).toBe("deepl");
  });

  it("translates arbitrary text via MyMemory", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        responseStatus: 200,
        quotaFinished: false,
        responseData: { translatedText: "GraphQLは翻訳APIのラッパーです。" },
      }),
    }) as unknown as typeof fetch;

    const rows = await translateWords("GraphQL is a wrapper around a translation API.", ["ja"]);
    expect(rows).toHaveLength(1);
    expect(rows[0].content).toBe("GraphQLは翻訳APIのラッパーです。");
    expect(rows[0].targetLanguage.lang_code).toBe("ja");

    const called = decodeURIComponent(
      String((globalThis.fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0])
    ).replaceAll("+", " ");
    expect(called).toContain("api.mymemory.translated.net/get");
    expect(called).toContain("Autodetect");
    expect(called).toContain("GraphQL is a wrapper around a translation API.");
  });

  it("maps zh-cn to MyMemory zh-CN", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        responseStatus: 200,
        responseData: { translatedText: "今天天气不错" },
      }),
    }) as unknown as typeof fetch;

    await translateWords("The weather is nice today", ["zh-cn"]);
    const called = decodeURIComponent(
      String((globalThis.fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0])
    );
    expect(called).toContain("zh-CN");
  });
});
