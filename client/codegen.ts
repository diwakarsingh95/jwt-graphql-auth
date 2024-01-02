import { CodegenConfig } from "@graphql-codegen/cli";
import { BACKEND_URL } from "./src/utils/constants";

const config: CodegenConfig = {
  schema: `${BACKEND_URL}/graphql`,
  documents: ["src/**/*.gql.ts"],
  generates: {
    "./src/gql/__generated__/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
};

export default config;
