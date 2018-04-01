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

router.get('/api/lyric', async (ctx, next) => {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  const data = await axios.get(url, {
    params: ctx.query,
    headers: {
      host: 'c.y.qq.com',
      referer: 'https://y.qq.com/'
    }
  })
  const reg = /^\w+\(({[^()]+})\)$/
  const ret = reg.exec(data.data)[1]
  ctx.response.set({ 'access-control-allow-credentials': true,
    'access-control-allow-origin': '*' })
  ctx.type = 'json'
  ctx.body = ret
})

router.get('/api/getdisc', async (ctx, next) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const data = await axios.get(url, {
    params: ctx.query,
    headers: {
      host: 'c.y.qq.com',
      referer: 'https://y.qq.com/n/yqq/playsquare/3712981979.html'
    }
  })
  console.log(data)
  ctx.body = data.data
})

router.get('/api/gettoplist', async (ctx, next) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = await axios.get(url, {
    params: ctx.query
  })
  ctx.response.set({ 'access-control-allow-credentials': true,
    'access-control-allow-origin': '*' })
  ctx.body = data.data
})

app.use(router.routes())
app.listen(9527, () => {
  console.log('Server is running at 9527.')
})
