import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express()

app.all("/", (req, res, next) => {
  Object.keys(req.query).forEach(key => {
    if (key.startsWith("h-")) {
      res.setHeader(key.replace("h-", ""), req.query[key] as string)
    }
  })

  const target = new URL(req.query.url as string)

  req.url = target.pathname + target.search
  req.query = Object.fromEntries(target.searchParams.entries())

  const proxy = createProxyMiddleware({
    target,
    followRedirects: true,
    changeOrigin: true,
    logLevel: "debug"
  })

  proxy(req, res, next)
})

export default app
