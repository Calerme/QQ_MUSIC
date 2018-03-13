const Koa = require('koa')
const router = require('koa-router')()
const axios = require('axios')

const app = new Koa()

const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

router.get('/api', async (ctx, next) => {
  // const data = await axios.get(`${url}`)
  // ctx.response.body = data.data
  // ctx.response.body = JSON.stringify(ctx.query, null, 2)
  const data = await axios.get(url + '?' + ctx.querystring)
  ctx.response.set({ 'access-control-allow-credentials': true,
    'access-control-allow-origin': '*' })
  if (/^2\d{2}/.test(data.status)) {
    ctx.response.body = data.data
  } else {
    ctx.response.status = 404
    ctx.response.body = '数据代理请求失败'
  }
})

app.use(router.routes())
app.listen(9527)
