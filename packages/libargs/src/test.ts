// import { join } from "desm";

// console.dir(process.argv);

// import("./index.js")
//   .then(({ cli }) => {
//     const cfg = {
//       name: "mincat",
//       desc: "headline",
//       dir: join(import.meta.url, "./__tests__", "fixtures"),
//       commands: {
//         add: {
//           desc: "'Add an integration.'",
//           fnName: "ada",
//           flags: {
//             "--config <path>": "Specify your config file.",
//             "--root <path>": "Specify your project root folder.",
//           },
//         },
//         init: {
//           desc: "'init an integration.'",
//           flags: {
//             "--config1 <path>": "Specify your config file.",
//             "--root1 <path>": "Specify your project root folder.",
//           },
//         },
//         ada: {
//           desc: "'ada an integration.'",
//           file: "aba",
//           fnName: "ada",
//           flags: {
//             "--config1 <path>": "Specify your config file.",
//             "--root1 <path>": "Specify your project root folder.",
//           },
//         },
//       },
//       flags: {
//         "--config <path>": "Specify your config file.",
//         "--root <path>": "Specify your project root folder.",
//         "--site <url>": "Specify your project site.",
//       },
//     };
//     cli(cfg, process.argv);
//   })
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
