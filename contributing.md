### Contributing to Cicada Modules

Currently, [@cicadahq/modules](https://github.com/cicadahq/modules) is the home
to all verified Cicada modules.

Contributing is easy:

1. Go to `src/`
2. Create a folder with the module name you want
3. Copy the structure of an existing module (we suggest the `node/`) module
4. Have at it!

Your module should be a step or a job.

### Helpful hacks

ChatGPT is ridiuclously simple. Copy and paste our schema + add a paragraph
about the module you want to create and it will do 99% of it for you... It's
wild.

<details>
<summary>Example </summary>
Here is a typescript schema
```
/**
 * mod.ts
 *
 * This is the main entry point for the cicada library.
 *
 * Get started with a simple pipeline:
 *
 * ```ts
 * import { Job, Pipeline } from "https://deno.land/x/cicada/mod.ts";
 *
 * const job = new Job({
 *   name: "Hello World",
 *   image: "node:18",
 *   steps: [{
 *     run: "echo Hello World",
 *   }],
 * });
 *
 * export default new Pipeline([job]);
 * ```
 *
 * For more information, see the [Cicada documentation](https://cicada.run/docs).
 * @module
 */

import { resolve } from "https://deno.land/x/cicada/deps.ts"; import {
DockerImages } from "https://deno.land/x/cicada/types/dockerImages.ts";

/**

- A file path represented as a string. */ export type FilePath = string;

/**

- Options for a cached directory _/ export interface CacheDirectoryOptions {
  path: FilePath; /_*
  - Directories default to `shared`
  -
  -
    - `shared` - can be used concurrently by multiple writers
  -
    - `private` - creates a new cache if there are multiple writers
  -
    - `locked` - pauses the second writer until the first one releases the cache
      */ sharing?: "shared" | "private" | "locked"; }

/**

- A directory to cache. This can be a single file path or an array of file
  paths. */ export type CacheDirectories = (FilePath | CacheDirectoryOptions)[];

/**

- A step function that can return void or a number and can be synchronous or
  asynchronous. */ export type StepFn = () => void | Promise<void> | number |
  Promise<number>;

/**

- The options available in a step such as the name, the script to run, what
  directories to cache, and the secrets/env variables needed. _/ export
  interface StepOptions { /_*
  - The command to run as a string or a {@link StepFn step function}. */ run:
    string | StepFn;

/**

- The name of the step. */ name?: string;

/**

- Cache directories are mounted as docker volumes. You may use absolute or
  relative paths. They are mounted for this job only. Use cacheDirectories in a
  {@link Job Job} for caching at the Job level. */ cacheDirectories?:
  CacheDirectories;

/**

- Disable caching for this step. This will cause the step to run every time and
  may cause subsequent steps to run every time as well.
- @default false */ ignoreCache?: boolean;

/**

- Environment variables to set specifically for this step */ env?:
  Record<string, string>;

/**

- Secrets to expose specifically for this step. Secrets are accessible in the
  run param. using the the `getSecret()` function or via the `/var/run/secrets`
  directory.
-
- Use secrets rather than env for greater security in job runs and caching. */
  secrets?: Secret[];

/**

- The directory where the step should run. */ workingDirectory?: FilePath; }

/**

- A step in the job. A step can either be an object with a run property,
- a step function (which executed typescript), or a string command (which
  executes as bash). */ export type Step = | StepOptions | StepFn | string;

/**

- The options for a job, including the name, base image, environment variables,
  secrets, folder cache, and steps. _/ export interface JobOptions { /_*
  - The docker image to use for this job.
  -
  - @example "node", "node:18", "node:18-alpine" */ image: DockerImages;

/**

- A list of steps to run in the job. Each step can be a deno/typescript script
  or a shell script. */ steps: Step[];

/**

- The name of the job. This will be displayed in the logs and can be referenced
  in another job's "dependsOn" property */ name?: string;

/**

- Environment variables to set for this job. These will be available for every
  step. */ env?: Record<string, string>;

/**

- Cache directories are mounted as docker volumes. They are mounted for all
  steps in a job. You may use absolute or relative paths. */ cacheDirectories?:
  CacheDirectories;

/**

- The directory where the job should run */ workingDirectory?: FilePath;

/**

- A list of jobs that must run before the current job can be executed. */
  dependsOn?: Job[];

/**

- What to do if the job fails.
-
  - `ignore` - ignore the failure and continue the pipeline
-
  - `stop` - stop the pipeline */ onFail?: "ignore" | "stop"; }

/**

- A job is a lightweight container that executes code. Jobs can be configured
  with JobOptions. By default, all jobs in a pipeline run in parallel. _/ export
  class Job { /_*
- @deprecated Do not use. The _uuid property is unstable and should be
  considered an internal implementation detail. */ readonly _uuid =
  crypto.randomUUID();

/**

- Creates a new Job instance.
- @param options - The options for the job. */ constructor(public options:
  JobOptions) {} }

/**

- A git branch represented as a string. */ export type Branch = string;

/**

- The options for configuring a pipeline's trigger event. */ export interface
  TriggerOptions { push?: Branch[]; pullRequest?: Branch[]; }

/**

- A trigger function that returns a boolean value indicating whether the
  pipeline should run. */ // export type TriggerFn = () => boolean |
  Promise<boolean>;

/**

- The trigger events which determines when a pipeline should run. */ export type
  Trigger = TriggerOptions; //TriggerFn | TriggerOptions;

/**

- The options for a pipeline, including the name and the conditions under which
  the pipeline should run. _/ export interface PipelineOptions { /_*
  - The name of the pipeline _/ name?: string; /_*
  - The trigger declares the conditions under which the pipeline should run. */
    on: Trigger; }

/**

- A pipeline is an array of jobs. Jobs are executed in parallel by default. _/
  export class Pipeline { /_*
  - Creates a new Pipeline instance.
  - @param jobs - An array of jobs to include in the pipeline.
  - @param options - The options for the pipeline. */ constructor(public jobs:
    Job[], public options?: PipelineOptions) {} }

/**

- A secret is a more secure environment variable. Secrets are not cached whereas
  env variables are.
-
- First, create your secret key-value in the Cicada dashboard (cicada.build).
  Then access that secret in code doing the following.
-
- @example
- ```
  ```
- var gh_token = new Secret.value("github-secret-key")
- ```
  ```
- github-secret-key is the name of the key for my secret stored in Cicada's
  dashboard. */ export class Secret { static readonly #isInJob =
  Deno.env.has("CICADA_JOB"); static readonly #secretsDir = "/run/secrets";
  #path = "";

/**

- Creates a new Secret instance.
-
- @param name - The name of the secret. */ constructor(public name: string) { if
  (!Secret.#isInJob) return; this.#path = resolve(Secret.#secretsDir, name); }

/**

- A check that the secret file exists to avoid a cryptic error message. */
  #assertFileExists = () => { try { Deno.statSync(this.#path); } catch (_) {
  throw new Error( `Secret \`${this.name}\` is not available in this job, make
  sure it is specified in the job options.`, ); } };

/**

- Get a secret value from the secrets directory asynchronously.
- This is an asynchronous version of {@linkcode valueSync()}.
-
- @returns The secret value */ value(): Promise<string> { if (!Secret.#isInJob)
  { throw new Error("Secrets are only available during a job."); }

  this.#assertFileExists();

  return Deno.readTextFile(this.#path);

}

/**

- Get a secret value from the secrets directory synchronously.
- This is a synchronous version of {@linkcode value()}.
-
- @returns The secret value */ valueSync(): string { if (!Secret.#isInJob) {
  throw new Error("Secrets are only available during a job."); }

  this.#assertFileExists();

  return Deno.readTextFileSync(this.#path);

} }

```
Write a step that enables users to install all their npm dependencies using node. Have it prefer pnpm, then yarn, then npm. It should be a valid step in typescript. It should be a module that's uploadable to deno.

</details>



### Focus Areas

These modules are our current focus areas. We'd love your support.


**node**
- [ ] set up correct version of node

**npm**
- [ ] create and publish release
- [ ] bump npm version
- [ ] auth with private npm registry

**Sentry**
- [ ] create release
- [ ] Upload sourcemap

**git**
- [ ] checkout another repo
- [ ] add a commit
- [ ] push

**Github**
- [ ] Upload artifacts
- [ ] Create PR
- [ ] Create release
- [ ] create tag
- [ ] download artifacts

**Next**
- [ ] Build

**terraform**
- [ ] apply, plan, fmt

**aws**
- [ ] put folder on s3

**install cli tool**
- [ ] yarn, deno, aws, pnpm, github
```
