const path = require('path')
const bodyParser = require('koa-bodyparser')
const staticFiles = require('koa-static')
const compress = require('koa-compress')
module.exports = app => {
  app.use(async (ctx, next) => {
    if (ctx.url == '/favicon.ico') return
    await next()
  })

  //gzip压缩
  app.use(compress())

  //post请求中间件
  app.use(bodyParser())

  //静态文件中间件
  app.use(staticFiles(path.resolve(__dirname, '../../../public')))
}
