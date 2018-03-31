import config from './config'
import axios from 'axios'

export function getLyric (mid) {
  return axios.get(`${config.baseURL}/lyric`, {
    params: {
      callback: 'MusicJsonCallback_lrc',
      pcachetime: 1522496333863,
      songmid: mid,
      g_tk: 5381,
      jsonpCallback: 'MusicJsonCallback_lrc',
      loginUin: 0,
      hostUin: 0,
      format: 'json',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'yqq',
      needNewCode: 0
    }
  })
    .then(({data}) => {
      if (data.code === config.ERR_OK) {
        return Promise.resolve(data.lyric)
      } else {
        return Promise.reject(new Error('数据请求错误！'))
      }
    })
}
