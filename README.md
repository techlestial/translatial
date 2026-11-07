# Translatial ㊗️

**Translation-as-a-Service (TAAS)** — GraphQL wrapper around a translation API. Send any text, pick target languages, get them all in one request.

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
  -d '{"query":"mutation { translateWords(content: \"The weather is nice today\", targetLanguages: [\"my\", \"ja\", \"zh-cn\"]) { result { content targetLanguage { langCode } } } }"}'
```

Default provider is [MyMemory](https://mymemory.translated.net/doc/spec.php) (no API key). Set `DEEPL_API_KEY` to use DeepL instead.

## Local development

```bash
npm install
npm test
npx vercel dev
```

Copy `.env.example` to `.env.local` if you want DeepL or a MyMemory email quota bump.

## Stack (v2)

- TypeScript, GraphQL Yoga, Vercel serverless
- Static landing in `public/`
- Live translations via MyMemory (default) or DeepL

## Legacy (v1)

Python Flask + Graphene + googletrans — preserved in `legacy/python/` for reference.

## License

MIT · Kevin Moe Myint Myat · Eternal Flame
