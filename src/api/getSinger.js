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

export function getSingerDesc (id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  return jsonp(url, {
    g_tk: 5381,
    jsonpCallback: 'MusicJsonCallbacksinger_track',
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: id,
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1
  }, {
    name: 'MusicJsonCallbacksinger_track'
  })
    .then(data => {
      if (data.code === config.ERR_OK) {
        return data.data
      } else {
        throw new Error('数据请求错误')
      }
    })
}
