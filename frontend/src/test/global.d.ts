import { vi } from 'vitest'

declare global {
  var fetch: ReturnType<typeof vi.fn>
}

export {}