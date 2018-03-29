import config from './config'
import jsonp from 'common/js/jsonp'

export function getSinger () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  return jsonp(url, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    g_tk: 5381,
    jsonpCallback: 'GetSingerListCallback',
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  }, {
    name: 'GetSingerListCallback'
  })
    .then(data => {
      if (data.code === config.ERR_OK) {
        return Promise.resolve(data.data.list)
      } else {
        return Promise.reject(new Error('数据请求失败！'))
      }
    })
}
