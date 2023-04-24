import { StepFn, StepOptions } from "https://deno.land/x/cicada/mod.ts";

import { installPackages } from "../install/mod.ts";

/**
 * Install NPM
 */
export function install(version = "latest"): StepOptions {
  const stepFn: StepFn = async () => {
    // Node.js
    await installPackages({
      "apt-get": [{ name: "npm", version: version }],
      "pacman": [{ name: "npm", version: version }],
      "yum": [{ name: "npm", version: version }],
      "dnf": [{ name: "npm", version: version }],
      "apk": [{ name: "npm", version: version }],
      "pkg": [{ name: "npm", version: version }],
      "brew": [{ name: "npm", version: version }],
    });
  };

  return {
    name: "Install NPM cli",
    run: stepFn,
  };
}
