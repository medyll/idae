import express from 'express'
import bodyParser from 'body-parser'
import { handleCsssParse } from './handlers/csssHandler'

const app = express()
app.use(bodyParser.json({ limit: '1mb' }))

app.post('/mcp/run', async (req, res) => {
  try {
    const { tool, params } = req.body || {}
    if (!tool) return res.status(400).json({ error: 'missing tool' })

    switch (tool) {
      case 'csss.parse': {
        const result = await handleCsssParse(params)
        return res.json({ ok: true, result })
      }
      default:
        return res.status(404).json({ error: 'unknown tool' })
    }
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || String(err) })
  }
})

const PORT = process.env.PORT || 3001
app.listen(Number(PORT), () => {
  // eslint-disable-next-line no-console
  console.log(`idae-csss MCP server listening on port ${PORT}`)
})
