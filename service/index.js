const Koa = require('koa')
const router = require('koa-router')()
const axios = require('axios')

const app = new Koa()

router.get('/api/getSlider', async (ctx, next) => {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = await axios.get(url, {
    params: ctx.query
  })
  ctx.response.set({ 'access-control-allow-credentials': true,
    'access-control-allow-origin': '*' })
  if (/^2\d{2}/.test(data.status)) {
    ctx.response.body = data.data
  } else {
    ctx.response.status = 404
    ctx.response.body = '数据代理请求失败'
  }
})

router.get('/api/getHotList', async (ctx, next) => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  const data = await axios.get(url, {
    params: ctx.query,
    headers: {
      referer: 'https://y.qq.com/portal/playlist.html',
      host: 'c.y.qq.com'
    }
  })
  ctx.response.set({
    'access-control-allow-credentials': true,
    'access-control-allow-origin': '*'})
  ctx.type = 'text/javascript'
  ctx.body = data.data
})

app.use(router.routes())
app.listen(9527, () => {
  console.log('Server is running at 9527.')
})