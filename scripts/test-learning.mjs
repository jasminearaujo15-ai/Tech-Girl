import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
await build({entryPoints:{service:'app/learning/service.ts',policy:'app/learning/policy.ts'},bundle:true,platform:'node',format:'esm',outdir:'.sites-runtime/learning-tests',outExtension:{'.js':'.mjs'},logLevel:'error'});
const result=spawnSync(process.execPath,['--test','tests/learning.test.mjs'],{stdio:'inherit'});
process.exit(result.status??1);
