import { Router } from 'express'
import { SseStream } from '@medyll/idae-api/server'
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