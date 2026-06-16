# Translatial ㊗️

**Translation-as-a-Service (TAAS)** — GraphQL API for translating text into multiple languages in one request.

Originally conceived years ago on Flask + Ainize. **v2** is reborn on Vercel with TypeScript, GraphQL Yoga, and the Eternal Flame portfolio standard.

| | |
|---|---|
| **Live** | https://translatial.vercel.app |
| **GraphQL** | `POST /graphql` |
| **Docs** | [/docs](https://translatial.vercel.app/docs) |
| **Studio** | [@techlestial](https://techlestial.vercel.app) |

## Quick start

```bash
curl -X POST https://translatial.vercel.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { translateWords(content: \"Hello\", targetLanguages: [\"my\", \"ja\"]) { result { content targetLanguage { langCode } } } }"}'
```

## Local development

```bash
npm install
npm test
npx vercel dev
```

Copy `.env.example` to `.env.local` for Vercel dev. Default mode is **mock** (no API key required).

## Stack (v2)

- TypeScript, GraphQL Yoga, Vercel serverless
- Static landing in `public/` (express-instant pattern)
- Optional [DeepL](https://www.deepl.com/pro-api) for live translations

## Legacy (v1)

Python Flask + Graphene + googletrans — preserved in repo root for reference. The Ainize deployment is retired.

## License

MIT · Kevin Moe Myint Myat · Eternal Flame
