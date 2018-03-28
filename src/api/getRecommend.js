import axios from 'axios'
import jsonp from 'common/js/jsonp'
import config from './config'

function getSlider () {
  const url = `${config.baseURL}/getSlider`
  return axios.get(url, {
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
  }).then((data) => {
    if (data.data.code === config.ERR_OK) {
      return data.data.data
    } else {
      throw new Error('数据请求失败')
    }
  })
}

function getHotList () {
  return jsonp(`${config.baseURL}/getHotList`, {
    picmid: 1,
    rnd: 0.12611501612242337,
    g_tk: 5381,
    jsonpCallback: 'getPlaylist',
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  }, {
    name: 'getPlaylist'
  })
    .then((data) => {
      if (data.code === config.ERR_OK) {
        return data.data.list
      } else {
        throw new Error('数据请求错误')
      }
    })
}

export {
  getSlider,
  getHotList
}
