import express from "express"
import httpProxy from "http-proxy"

const proxy = httpProxy.createProxyServer({})

const app = express()

app.all("/", (req, res) => {
  Object.keys(req.query).forEach(key => {
    if (key.startsWith("h-")) {
      res.setHeader(key.replace("h-", ""), req.query[key] as string)
    }
  })

  const target =  new URL(req.query.url as string).href

  req.url = req.url.split("?")[0]

  proxy.web(req, res, { target })
})

export default app
