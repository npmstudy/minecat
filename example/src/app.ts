import Koa from 'koa';
import { lib } from 'lib2';
const app = new Koa();

app.use(async (ctx) => {
  ctx.body = `Hello ${lib()}`;
});

app.listen(3000);
