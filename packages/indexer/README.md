# @dac-cloud/indexer

Typed GraphQL query client for DAC.cloud indexer data.

## Generate types

```bash
INDEXER_SCHEMA_URL=http://127.0.0.1:8080/v1/graphql \
  npm run codegen --workspace @dac-cloud/indexer
```

## Usage

```ts
import {createIndexerClient} from "@dac-cloud/indexer";

const client = createIndexerClient({
  url: "http://127.0.0.1:8080/v1/graphql",
});

const dac = await client.dacs.getByAddress("0x...");
const deal = await client.deals.getByAddress("0x...");
```
