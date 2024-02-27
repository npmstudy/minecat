#!/usr/bin/env node

async function main(argv) {
  const { config } = await import("./config");
  const { cli } = await import("libargs");

  await cli(config, argv);
}

main(process.argv);
