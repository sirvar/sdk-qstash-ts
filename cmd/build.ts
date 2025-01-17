import * as dnt from "https://deno.land/x/dnt@0.26.0/mod.ts";

const packageManager = "npm";
const outDir = "./dist";

await dnt.emptyDir(outDir);

await dnt.build({
  packageManager,
  entryPoints: [
    "entrypoints/nodejs.ts",
    {
      name: "./nodejs",
      path: "./entrypoints/nodejs.ts",
    },

    {
      name: "./cloudflare",
      path: "./entrypoints/cloudflare.ts",
    },
    {
      name: "./nextjs",
      path: "./entrypoints/nextjs.ts",
    },
  ],
  outDir,
  shims: {
    deno: "dev",
    crypto: true,
  },
  typeCheck: false,
  test: false,

  package: {
    // package.json properties
    name: "@upstash/qstash",
    version: Deno.args[0],
    description: "Official Deno/Typescript client for QStash",
    repository: {
      type: "git",
      url: "git+https://github.com/upstash/sdk-qstash-ts.git",
    },
    keywords: ["qstash", "queue", "events", "serverless", "upstash"],
    author: "Andreas Thomas <dev@chronark.com>",
    license: "MIT",
    bugs: {
      url: "https://github.com/upstash/sdk-qstash-ts/issues",
    },
    homepage: "https://github.com/upstash/sdk-qstash-ts#readme",

    /**
     * typesVersion is required to make imports work in typescript.
     * Without this you would not be able to import {} from "@upstash/redis/<some_path>"
     */
    typesVersions: {
      "*": {
        nodejs: ["./types/entrypoints/nodejs.d.ts"],
        cloudflare: ["./types/entrypoints/cloudflare.d.ts"],
        nextjs: ["./types/entrypoints/nextjs.d.ts"],
      },
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", `${outDir}/LICENSE`);
Deno.copyFileSync("README.md", `${outDir}/README.md`);

/**
 * Workaround because currently deno can not typecheck the built modules without `@types/node` being installed as regular dependency
 *
 * This removes it after everything is tested.
 */
await Deno.run({
  cwd: outDir,
  cmd: [packageManager, "uninstall", "@types/node"],
  stdout: "piped",
}).output();
