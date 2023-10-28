#!/usr/bin/env ts-node

(async () => {
  const index = await import('../src/index.ts');
  await index.main();
})();
