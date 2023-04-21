import { installPackages } from "./mod.ts";

// Node.js
await installPackages({
  "apt-get": ["nodejs"],
  "pacman": ["nodejs"],
  "yum": ["nodejs"],
  "dnf": ["nodejs"],
  "apk": ["nodejs"],
  "pkg": ["node"],
  "brew": ["node"],
});

// npm
await installPackages({
  "apt-get": ["npm"],
  "pacman": ["npm"],
  "yum": ["npm"],
  "dnf": ["npm"],
  "apk": ["npm"],
  "pkg": ["npm"],
  "brew": ["npm"],
});

// Yarn
await installPackages({
  "apt-get": ["yarn"],
  "pacman": ["yarn"],
  "yum": ["yarn"],
  "dnf": ["yarn"],
  "apk": ["yarn"],
  "pkg": ["yarn"],
  "brew": ["yarn"],
});

// Sentry CLI
await installPackages({
  "apt-get": [{ name: "sentry-cli", version: "1.71.0" }], // Replace with the desired version
  "pacman": ["sentry-cli"],
  "yum": ["sentry-cli"],
  "dnf": ["sentry-cli"],
  "apk": ["sentry-cli"],
  "pkg": ["sentry-cli"],
  "brew": [{ name: "sentry-cli", version: "1.71.0" }], // Replace with the desired version
});

// GitHub CLI
await installPackages({
  "apt-get": ["gh"],
  "pacman": ["github-cli"],
  "yum": ["gh"],
  "dnf": ["gh"],
  "apk": ["gh"],
  "pkg": ["gh"],
  "brew": ["gh"],
});

// Next.js CLI
await installPackages({
  "apt-get": [{ name: "next-cli", version: "12.0.7" }], // Replace with the desired version
  "pacman": ["next-cli"],
  "yum": ["next-cli"],
  "dnf": ["next-cli"],
  "apk": ["next-cli"],
  "pkg": ["next-cli"],
  "brew": [{ name: "next-cli", version: "12.0.7" }], // Replace with the desired version
});

// AWS CLI
await installPackages({
  "apt-get": ["awscli"],
  "pacman": ["aws-cli"],
  "yum": ["awscli"],
  "dnf": ["awscli"],
  "apk": ["aws-cli"],
  "pkg": ["aws-cli"],
  "brew": ["awscli"],
});
