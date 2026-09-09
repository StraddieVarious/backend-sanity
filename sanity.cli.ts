import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "amp8e9rk",
    dataset: "production",
  },
  studioHost: "straddievarious",
  deployment: {
    // Returned by the first `sanity deploy`; without it the CLI prompts for an
    // application id on every subsequent deploy.
    appId: "pfj3acd3d95cimcjmbkug037",
  },
});
