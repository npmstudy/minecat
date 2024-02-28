#!/usr/bin/env node

import { cli } from "libargs";
import { config } from "./config";

async function main(argv) {
  await cli(config, argv);
}

main(process.argv);
