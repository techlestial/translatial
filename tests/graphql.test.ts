import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createGraphQLServer } from "../src/schema.js";

describe("Translatial GraphQL", () => {
  const yoga = createGraphQLServer(false, { maskedErrors: false });

  beforeEach(() => {
    process.env.TRANSLATION_MODE = "mock";
    delete process.env.DEEPL_API_KEY;
  });

  afterEach(() => {
    delete process.env.TRANSLATION_MODE;
  });

  it("lists languages", async () => {
    const response = await yoga.fetch("http://localhost/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "{ languages { name langCode } }",
      }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.errors).toBeUndefined();
    expect(body.data.languages.length).toBeGreaterThan(10);
    expect(body.data.languages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ langCode: "en", name: "english" }),
        expect.objectContaining({ langCode: "my" }),
      ])
    );
  });

  it("translates words in mock mode", async () => {
    const response = await yoga.fetch("http://localhost/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation {
            translateWords(content: "Hello", targetLanguages: ["my", "ja"]) {
              result {
                targetLanguage { langCode name }
                content
                pronunciation
              }
            }
          }
        `,
      }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.errors).toBeUndefined();
    const rows = body.data.translateWords.result;
    expect(rows).toHaveLength(2);
    expect(rows[0].content).toContain("Hello");
    expect(rows[0].pronunciation).toBe("N.A");
  });

  it("rejects unknown language codes", async () => {
    const response = await yoga.fetch("http://localhost/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation {
            translateWords(content: "Hi", targetLanguages: ["zz"]) {
              result { content }
            }
          }
        `,
      }),
    });

    const body = await response.json();
    expect(body.errors?.[0]?.message).toMatch(/Unknown language code/);
  });
});
