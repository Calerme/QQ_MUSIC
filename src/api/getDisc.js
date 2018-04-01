import config from './config'
import jsonp from 'common/js/jsonp'

export function getDisc (dissid) {
  return jsonp(`${config.baseURL}/getdisc`, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: dissid,
    format: 'jsonp',
    g_tk: 5381,
    jsonpCallback: 'playlistinfoCallback',
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  }, {
    name: 'playlistinfoCallback'
  })
}
