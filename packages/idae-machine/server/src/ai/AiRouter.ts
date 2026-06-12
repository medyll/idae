import { Router } from 'express'
// @medyll/idae-api package.json "exports" only declares "." (root) — "/server" and
// "/client" subpaths are NOT exported and crash at runtime with ERR_PACKAGE_PATH_NOT_EXPORTED
// (typechecks fine under tsx, fails under real node ESM resolution). SseStream/parseStream
// are re-exported from root via packages/idae-api/src/lib/index.ts — always import from '@medyll/idae-api'.
import { SseStream } from '@medyll/idae-api'
import { OllamaService } from './OllamaService.js'

const router = Router()
const ollama = new OllamaService(process.env.OLLAMA_ENDPOINT ?? 'http://127.0.0.1:11434')

router.post('/chat-session/:sessionId/send', async (req, res) => {
  const sse = new SseStream(res)
  const controller = new AbortController()
  
  // Handle client disconnect
  req.on('close', () => controller.abort())
  
  const { messages, model, temperature } = req.body
  
  try {
    for await (const chunk of ollama.streamChat(
      { model, messages, options: { temperature } },
      controller.signal
    )) {
      sse.send({ chunk })
    }
    sse.done()
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      sse.error(err.message)
    } else {
      sse.done()
    }
  }
})

router.get('/models', async (_req, res) => {
  try {
    const models = await ollama.listModels()
    res.json({ models })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export { router as AiRouter }