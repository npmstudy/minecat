import Koa from "koa";
import { lib } from "minecat";
const app = new Koa();

app.use(async (ctx) => {
  ctx.body = `Hello ${lib()}`;
});

app.listen(3000);
