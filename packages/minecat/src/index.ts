#!/usr/bin/env node

import { cli } from "libargs";
import { config } from "./config";

export async function main(argv) {
  await cli(config, argv);
}

main(process.argv);
