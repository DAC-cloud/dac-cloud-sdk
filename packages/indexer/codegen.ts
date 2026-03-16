import type {CodegenConfig} from "@graphql-codegen/cli";

const schemaUrl = process.env.INDEXER_SCHEMA_URL ?? "http://127.0.0.1:8080/v1/graphql";

const config: CodegenConfig = {
  schema: schemaUrl,
  documents: ["src/queries/**/*.graphql"],
  ignoreNoDocuments: false,
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        avoidOptionals: false,
        scalars: {
          numeric: "string",
          timestamptz: "string",
          jsonb: "unknown",
        },
      },
    },
  },
};

export default config;
