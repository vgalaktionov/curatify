import { performance } from 'perf_hooks'
import consola from 'consola'

export async function timeAsyncCall(startMessage, fn, endMessage, ...args) {
  consola.info(startMessage)
  const start = performance.now()
  args ? await fn(args) : await fn()
  const end = performance.now()
  consola.info(`${endMessage} in ${end - start} ms.`)
}
