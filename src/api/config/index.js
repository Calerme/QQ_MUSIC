const config = {
  // baseURL: 'http://127.0.0.1:9527/api',
  baseURL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:9527/api' : 'http://clouddin.com:9527/api',
  ERR_OK: 0
}

export default config
