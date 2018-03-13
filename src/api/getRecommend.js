import axios from 'axios'
import config from './config'

function getRecommend () {
  return axios.get(config.baseURL, {
    params: {
      g_tk: 5381,
      uin: 0,
      format: 'jsonp',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      _: 1520863351396
    }
  })
}

export default getRecommend
