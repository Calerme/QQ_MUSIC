import axios from 'axios'
import jsonp from 'common/js/jsonp'
import config from './config'

export function getHotKey () {
  const url = `${config.baseURL}/gethotkey`
  return axios.get(url, {
    params: {
      g_tk: 471322607,
      uin: 2803284764,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: 1522638741828
    }
  })
    .then(res => {
      return res.data
    })
}

export function search (query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  return jsonp(url, {
    perpage: perpage,
    g_tk: 471322607,
    uin: 2803284764,
    format: 'jsonp',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all',
    _: 1522648582459,
    jsonpCallback: 'getPlaylist'
  }, {
    name: 'getPlaylist'
  })
}
