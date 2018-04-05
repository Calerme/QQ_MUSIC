const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const static = require('koa-static')
const router = require('koa-router')()

const app = new Koa()

const staticPath = '../dist'

router.get('/:path', async (ctx, next) => {
  const data = await fs.readFile(path(__dirname, 'dist/index.html'))
  ctx.body = data
})

app.use(static(
  path.join(__dirname, staticPath), {
    gzip: true
  }
))

app.use(router.routes())

app.listen(80)

console.log(`Server is running at 80 port`)

