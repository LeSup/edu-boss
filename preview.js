const express = require('express')
const { createProxyMiddleware  } = require('http-proxy-middleware')

const app = express()

app.use(express.static('./dist'))

app.use('/boss', createProxyMiddleware({
  target: 'http://eduboss.lagou.com',
  changeOrigin: true // 把请求头中的 host 配置为 target
}))

app.use('/front', createProxyMiddleware({
  target: 'http://edufront.lagou.com',
  changeOrigin: true // 把请求头中的 host 配置为 target
}))

app.listen(3000, () => {
  console.log('listening on 3000 port')
})
