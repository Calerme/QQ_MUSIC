import axios from 'axios'
import config from 'api/config'
import jsonp from 'common/js/jsonp'

export function getToplist () {
  return axios.get(`${config.baseURL}/gettoplist`, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    _: 1522576868194
  })
    .then(res => {
      let json = res.data.slice(0, -1)
      json = json.slice(json.indexOf('(') + 1)
      return json
    })
    .then(JSON.parse)
}

export function getTopSongs (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  return jsonp(url, {
    g_tk: 5381,
    uin: 0,
    format: 'jsonp',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: topid,
    _: 1522590686542,
    jsonpCallback: 'getTopSongs'
  }, {
    name: 'getTopSongs'
  })
}
