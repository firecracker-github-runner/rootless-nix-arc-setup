import { exec } from "@actions/exec";
import fs from "node:fs/promises";

async function main() {
  // Prime the store
  const storeContents = await fs.readdir("/nix/store");
  if (storeContents.length === 0) {
    const baseContents = await fs.readdir("/nix/store_base");
    if (baseContents.length === 0) {
      throw new Error("Store base is empty");
    }

    await Promise.all(
      baseContents.map((entry) => fs.cp(`/nix/store_base/${entry}`, `/nix/store/${entry}`), {
        recursive: true,
      }),
    );
  }

  // Install devenv
  await run("nix profile install nixpkgs#devenv");
}

/**
 * @param {string} command
 */
async function run(command) {
  await exec("bash", ["-c", command]);
}

await main();
