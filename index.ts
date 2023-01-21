import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express()

app.all("/", (req, res, next) => {
  Object.keys(req.query).forEach(key => {
    if (key.startsWith("h-")) {
      res.setHeader(key.replace("h-", ""), req.query[key] as string)
    }
  })

  const target =  new URL(req.query.url as string).href

  req.url = req.url.split("?")[0]

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    logLevel: "debug"
  })

  proxy(req, res, next)
})

export default app
