import { requireProgramAdmin } from "../../learning/access";
import { env } from "cloudflare:workers";
import { seed, programSchema } from "../../program";
export const dynamic = "force-dynamic";
const json = (body: unknown, status=200) => Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
export async function GET() {
  const denied=await requireProgramAdmin();if(denied)return denied;
  try {
    const row = await env.DB!.prepare("SELECT data, revision, updated_at FROM program_state WHERE id = ?").bind("techgirl").first<{data:string;revision:number;updated_at:string}>();
    return json(row ? {data:JSON.parse(row.data),revision:row.revision,updatedAt:row.updated_at} : {data:seed,revision:0,updatedAt:null});
  } catch { return json({error:"Não foi possível carregar o programa. Tente novamente."},503); }
}
export async function PUT(request: Request) {
  const denied=await requireProgramAdmin();if(denied)return denied;
  // The private Site gate and the server-side program role both protect management records.
  if (request.headers.get("sec-fetch-site")==="cross-site") return json({error:"Origem não autorizada."},403);
  if(Number(request.headers.get("content-length")||0)>500000) return json({error:"Dados muito grandes."},413);
  try {
    const raw=await request.text(); if(raw.length>500000) return json({error:"Dados muito grandes."},413);
    const body=JSON.parse(raw); const data=programSchema.parse(body.data); const revision=body.revision;
    if(!Number.isInteger(revision)||revision<0) return json({error:"Versão inválida."},400);
    const updatedAt=new Date().toISOString();
    const result=revision===0
      ? await env.DB!.prepare("INSERT INTO program_state (id,data,revision,updated_at) VALUES (?,?,1,?) ON CONFLICT(id) DO NOTHING").bind("techgirl",JSON.stringify(data),updatedAt).run()
      : await env.DB!.prepare("UPDATE program_state SET data=?, revision=revision+1, updated_at=? WHERE id=? AND revision=?").bind(JSON.stringify(data),updatedAt,"techgirl",revision).run();
    if(!result.meta.changes) return json({error:"O programa mudou em outra aba. Recarregue antes de editar novamente."},409);
    return json({data,revision:revision+1,updatedAt});
  } catch(e) { if(e instanceof SyntaxError || (e as any)?.name==="ZodError") return json({error:"Verifique os campos e links. Use links iniciados em https:// ou http://."},400); return json({error:"Não foi possível salvar. Suas alterações continuam abertas para tentar novamente."},503); }
}
