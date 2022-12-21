const Koa = require('koa');
const Router = require('@koa/router');
const serverless = require("serverless-http");
const getCurrentlyListening = require('./getCurrentlyListening');
const parseCurrentlyListening = require('./parseCurrentlyListening');

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  try {
    const currentlyListening = await getCurrentlyListening();
    const parsedCurrentlyListening = parseCurrentlyListening(currentlyListening);
    ctx.body = parsedCurrentlyListening;
    ctx.status = 200;
  } catch (err) {
    console.log(err);
    ctx.body = {"error": "unable to retrieve currently listening"};
    ctx.status = 500;
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

const server = serverless(app, {
  basePath: 'currently-listening'
});
module.exports.currentlyListening = server; 
