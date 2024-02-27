#!/usr/bin/env node

import { join } from "desm";

const { cli } = import("libargs");

const cfg = import("./config");

async function main(argv) {
  // argv = [];
  await cli(cfg, argv);
}

main(process.argv);
