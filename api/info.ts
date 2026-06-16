import type { VercelRequest, VercelResponse } from "@vercel/node";

const apiInfo = {
  author: "techlestial — Kevin Moe Myint Myat",
  name: "Translatial GraphQL",
  version: "2.0.0",
  description: "GraphQL API for multi-language translation in one request",
  route: "/graphql",
  mode: process.env.TRANSLATION_MODE ?? (process.env.DEEPL_API_KEY ? "live" : "mock"),
  docs: "/docs",
};

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({ info: apiInfo });
}
