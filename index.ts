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

  if (req.query["opt-join-query"] === "true") {
    delete req.query["opt-join-query"]
    delete req.query.url
    Object.keys(req.query).forEach(key => {
      if (key.startsWith("h-")) {
        delete req.query[key]
      }
    })
    req.query = { ...Object.fromEntries(target.searchParams.entries()), ...req.query }
  } else {
    req.query = Object.fromEntries(target.searchParams.entries())
  }
  req.url = target.pathname + new URLSearchParams(req.query as any).toString()

  const proxy = createProxyMiddleware({
    target: target.href,
    followRedirects: true,
    changeOrigin: true,
    cookieDomainRewrite: target.hostname,
    ws: true
  })

  proxy(req, res, next)
})

app.listen(8000, () => {
  console.log("Server listening on port 8000")
})
