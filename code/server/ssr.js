const path = require('path')
const fs = require('fs')
const koaRouter = require('koa-router')
const { createBundleRenderer } = require('vue-server-renderer')
const redis = require('./db/redis.js')  // 可以使用 redis 数据库进行缓存
const router = koaRouter()
const isProd = process.env.NODE_ENV === 'production'
const resolve = file => path.resolve(__dirname, file)
const createRenderer = (bundle, options) => {
  return createBundleRenderer(
    bundle,
    Object.assign({}, options, {
      runInNewContext: false
    })
  )
}
const renderData = (ctx, renderer) => {
  const context = {
    url: ctx.url
  }
  return new Promise(async (resolve, reject) => {
    // 读取 redis 缓存
    // const html = await redis.getHtml(context.url)
    // if (html) {
    //   resolve(html)
    //   return
    // }
    renderer.renderToString(context, (err, html) => {
      if (err) {
        return reject(err)
      }
      redis.setHtml(context.url, html)
      resolve(html)
    })
  })
}
module.exports = app => {
  let renderer
  if (isProd) {
    // 生产环境直接获取
    const bundle = require('../../public/client/vue-ssr-server-bundle.json')
    const template = fs.readFileSync(
      resolve('../../public/client/index.html'),
      'utf-8'
    )
    const clientManifest = require('../../public/client/vue-ssr-client-manifest.json')
    renderer = createRenderer(bundle, {
      template,
      clientManifest
    })
  } else {
    // 开发环境
    require('../../build/setup-dev-server.js')(app, (bundle, options) => {
      renderer = createRenderer(bundle, options)
    })
  }

  router.get('*', async (ctx, next) => {
    // 提示webpack还在工作
    if (!renderer) {
      ctx.type = 'html'
      return (ctx.body = 'waiting for compilation... refresh in a moment.')
    }
    const s = Date.now()
    let html, status
    try {
      html = await renderData(ctx, renderer)
    } catch (e) {
      if (e.code === 404) {
        status = 404
        html = '404 | Not Found'
      } else {
        status = 500
        html = '500 | Internal Server Error'
      }
    }
    ctx.type = 'html'
    ctx.status = status ? status : 200
    ctx.body = html
    console.log(`whole request: ${Date.now() - s}ms`)
  })

  app.use(router.routes()).use(router.allowedMethods())
}
