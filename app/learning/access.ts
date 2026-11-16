import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../chatgpt-auth';
import { isProgramAdmin } from './policy';
export async function learningViewer(){const user=await getChatGPTUser();return {user,admin:isProgramAdmin(user?.email,env.TECH_GIRL_ADMIN_EMAIL)};}
export async function requireProgramAdmin(){const viewer=await learningViewer();if(!viewer.user)return Response.json({error:'Entre com sua conta para acessar a gestão.'},{status:401});if(!viewer.admin)return Response.json({error:'Acesso restrito à gestão do programa.'},{status:403});return null;}
