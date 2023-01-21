import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express()

app.use("/", (req, res, next) => {
  Object.keys(req.query).forEach(key => {
    if (key.startsWith("h-")) {
      res.setHeader(key.replace("h-", ""), req.query[key] as string)
    }
  })

  const target =  new URL(req.query.url as string).href

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: (proxyReq, req, res) => {
      console.log("onProxyReq", req.url)
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log("onProxyRes", req.url)
    },
    onError: (err, req, res) => {
      console.log("onError", req.url)
    }
  })

  proxy(req, res, next)
})

export default app
