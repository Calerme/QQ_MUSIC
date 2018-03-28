import jsonpOrigin from 'jsonp'
export default function jsonp (url, data, option) {
  if (data) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + parseParam(data)
  }
  return new Promise((resolve, reject) => {
    jsonpOrigin(url, option, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

function parseParam (data) {
  let str = ''
  for (let i in data) {
    if (data.hasOwnProperty(i)) {
      str += `&${encodeURIComponent(i)}=${encodeURIComponent(data[i])}`
    }
  }
  return str.slice(1)
}
