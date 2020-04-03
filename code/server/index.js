const Koa = require('koa')
const ip = require('ip')
const router = require('./router/index')
const middleware = require('./middleware/index.js')
const conf = require('./config')
const SSR = require('./ssr')
const app = new Koa()
//使用中间件
middleware(app)

// 接口
router(app)

// vue-ssr
SSR(app)

app.listen(conf.app.port, '0.0.0.0', () => {
  console.log(`server is running at http://${ip.address()}:${conf.app.port}`)
})
