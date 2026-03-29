import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import type {CodegenConfig} from "@graphql-codegen/cli";

const here = dirname(fileURLToPath(import.meta.url));
const localSchemaPath = resolve(here, "../../../dac-cloud-indexer/schema.graphql");
const schemaSource = process.env.INDEXER_SCHEMA_URL ?? process.env.INDEXER_SCHEMA_PATH ?? localSchemaPath;

const config: CodegenConfig = {
  schema: schemaSource,
  documents: ["src/queries/**/*.graphql"],
  ignoreNoDocuments: false,
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        avoidOptionals: false,
        onlyOperationTypes: true,
        scalars: {
          BigInt: "string",
          Bytes: "string",
          numeric: "string",
          timestamptz: "string",
          jsonb: "unknown",
        },
      },
    },
  },
};

export default config;
