const koaRouter = require('koa-router')
const router = koaRouter()

module.exports = app => {
  router.delete('/blog/article/:id', async (ctx, next) => {
    const { _id } = ctx.params
    await model.article.update({ _id }, { isDeleted: true })
    ctx.body = null
  })

  app.use(router.routes()).use(router.allowedMethods())
}
