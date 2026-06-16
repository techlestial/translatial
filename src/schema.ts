import { createSchema, createYoga, type YogaServerOptions } from "graphql-yoga";
import { listLanguages } from "./languages.js";
import { translateWords } from "./translate.js";

export const typeDefs = /* GraphQL */ `
  type Language {
    name: String
    langCode: String
  }

  type Translation {
    targetLanguage: Language
    content: String
    pronunciation: String
  }

  type TranslateWordsPayload {
    result: [Translation!]!
  }

  type Query {
    languages: [Language!]!
  }

  type Mutation {
    translateWords(content: String!, targetLanguages: [String!]!): TranslateWordsPayload!
  }
`;

export const resolvers = {
  Query: {
    languages: () =>
      listLanguages().map((lang) => ({
        name: lang.name,
        langCode: lang.lang_code,
      })),
  },
  Mutation: {
    translateWords: async (
      _: unknown,
      args: { content: string; targetLanguages: string[] }
    ) => {
      const result = await translateWords(args.content, args.targetLanguages);
      return {
        result: result.map((row) => ({
          targetLanguage: {
            name: row.targetLanguage.name,
            langCode: row.targetLanguage.lang_code,
          },
          content: row.content,
          pronunciation: row.pronunciation,
        })),
      };
    },
  },
};

export function createGraphQLServer(
  graphiql = false,
  options: Pick<YogaServerOptions<object, object>, "maskedErrors"> = {}
) {
  return createYoga({
    schema: createSchema({ typeDefs, resolvers }),
    graphqlEndpoint: "/graphql",
    graphiql,
    landingPage: false,
    maskedErrors: options.maskedErrors ?? process.env.NODE_ENV === "production",
  });
}
