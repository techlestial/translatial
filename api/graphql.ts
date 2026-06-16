import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createGraphQLServer } from "../src/schema.js";

const yoga = createGraphQLServer(process.env.GRAPHIQL !== "false");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const protocol = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers.host ?? "translatial.vercel.app";
  const url = `${protocol}://${host}${req.url ?? "/graphql"}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body =
      typeof req.body === "string"
        ? req.body
        : req.body
          ? JSON.stringify(req.body)
          : undefined;
  }

  const response = await yoga.fetch(url, {
    method: req.method,
    headers,
    body,
  });

  res.status(response.status);
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "content-encoding") return;
    res.setHeader(key, value);
  });

  const text = await response.text();
  res.send(text);
}
