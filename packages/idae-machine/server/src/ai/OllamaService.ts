// @medyll/idae-api package.json "exports" only declares "." (root) — "/server" and
// "/client" subpaths are NOT exported and crash at runtime with ERR_PACKAGE_PATH_NOT_EXPORTED
// (typechecks fine under tsx, fails under real node ESM resolution). parseStream/SseStream
// are re-exported from root via packages/idae-api/src/lib/index.ts — always import from '@medyll/idae-api'.
import { parseStream } from '@medyll/idae-api'

interface OllamaChatChunk {
  message?: { content?: string }
  done?: boolean
}

export class OllamaService {
  constructor(private endpoint = 'http://127.0.0.1:11434') {}

  async *streamChat(
    payload: { model: string; messages: any[]; options?: Record<string, unknown> },
    signal?: AbortSignal
  ): AsyncGenerator<string> {
    const res = await fetch(`${this.endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status} ${res.statusText}`)
    }

    if (!res.body) {
      throw new Error('No response body')
    }

    for await (const chunk of parseStream<OllamaChatChunk>(res.body, 'ndjson', signal)) {
      if (chunk.message?.content) {
        yield chunk.message.content
      }
      if (chunk.done) {
        break
      }
    }
  }

  async listModels(): Promise<string[]> {
    const res = await fetch(`${this.endpoint}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data.models?.map((m: any) => m.name) || []
  }
}