import { env } from 'cloudflare:workers';
import { learningViewer } from '../../learning/access';
import { learningData,learningAction,LearningError } from '../../learning/service';
export const dynamic='force-dynamic';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){try{const {user,admin}=await learningViewer();return json(await learningData(env.DB!,user,admin));}catch{return json({error:'Não foi possível carregar os cursos. Tente novamente.'},503);}}
export async function POST(request:Request){if(request.headers.get('sec-fetch-site')==='cross-site')return json({error:'Origem não autorizada.'},403);try{const raw=await request.text();if(raw.length>500000)return json({error:'Conteúdo muito grande.'},413);const {user,admin}=await learningViewer();const result=await learningAction(env.DB!,user,admin,JSON.parse(raw));return json(result);}catch(e){if(e instanceof LearningError)return json({error:e.message},e.status);if(e instanceof SyntaxError)return json({error:'Requisição inválida.'},400);return json({error:'Não foi possível salvar. Tente novamente.'},503);}}
