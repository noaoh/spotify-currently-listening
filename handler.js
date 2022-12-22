const Koa = require('koa');
const Router = require('@koa/router');
const serverless = require("serverless-http");
const getCurrentlyListening = require('./getCurrentlyListening');
const parseCurrentlyListening = require('./parseCurrentlyListening');

const app = new Koa();
const router = new Router();

const {
  LOCAL_URL: localUrl,
  GITHUB_URL: githubUrl,
} = process.env;

router.get('/', async (ctx) => {
  try {
    const currentlyListening = await getCurrentlyListening();
    const parsedCurrentlyListening = parseCurrentlyListening(currentlyListening);
    ctx.body = parsedCurrentlyListening;
    const origin = ctx.req.headers.origin
    if (origin === localUrl || origin === githubUrl) {
      ctx.res.setHeader('Access-Control-Allow-Origin', origin);
    }
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
