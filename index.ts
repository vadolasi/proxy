import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express()

app.use("/", (req, res, next) => {
  Object.keys(req.query).forEach(key => {
    if (key.startsWith("h-")) {
      res.setHeader(key.replace("h-", ""), req.query[key] as string)
    }
  })

  createProxyMiddleware({
    target: new URL(req.query.url as string).href,
    changeOrigin: true,
    pathRewrite: {
      [`^/`]: ""
    }
  })(req, res, next)
})

export default app
