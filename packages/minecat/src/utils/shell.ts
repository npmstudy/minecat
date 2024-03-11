import debug from "debug";

import shell from "shelljs";

const log = debug("minecat");

export function moveTo(from, to) {
  // 先判断newname是否存在
  log("cp from " + from + " to " + to);

  // 如果newname不存在，就拷贝tpl到newname
  shell.cp("-Rf", from, to);
}
