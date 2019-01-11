import { ingestAll } from './ingest'
import { analyzeAll } from './analyze';

(async () => {
  await ingestAll()
  await analyzeAll()
})()
