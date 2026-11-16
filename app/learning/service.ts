import { z } from 'zod';
import { catalog,POLICY_URL } from './catalog.server';
import { grade,readiness,safeCourse } from './policy';
import type { Course,Enrollment,LearningData } from './types';
export type Learner={userId:string;displayName:string;email:string};
export class LearningError extends Error{status:number;constructor(status:number,message:string){super(message);this.status=status;}}
const short=z.string().trim().min(1).max(180),note=z.string().max(12000);
const url=z.string().max(2000).refine(v=>!v||/^https:\/\//i.test(v),'Use um link https://.');
const lessonSchema=z.object({id:short,title:short,body:z.string().trim().min(30).max(12000),exercise:z.string().max(4000),videoUrl:url,materialUrl:url}).strict();
const questionSchema=z.object({id:short,prompt:short,options:z.array(short).min(2).max(6),correctIndex:z.number().int().min(0).max(5),explanation:z.string().max(1000)}).strict().refine(q=>q.correctIndex<q.options.length,'Gabarito inválido.');
const courseSchema=z.object({id:short,title:short,summary:z.string().trim().min(10).max(500),category:short,hours:z.number().min(.5).max(200),passingScore:z.number().int().min(50).max(100),published:z.boolean(),intro:note,practicePrompt:z.string().trim().min(30).max(5000),lessons:z.array(lessonSchema).min(1).max(30),questions:z.array(questionSchema).min(1).max(20),version:z.number().int().min(0)}).strict().refine(c=>new Set(c.lessons.map(l=>l.id)).size===c.lessons.length&&new Set(c.questions.map(q=>q.id)).size===c.questions.length,'Os identificadores de aulas e questões devem ser únicos.');
const actionSchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('enroll'),courseId:short,name:z.string().trim().min(3).max(160)}).strict(),
 z.object({action:z.literal('lesson'),enrollmentId:short,lessonId:short}).strict(),
 z.object({action:z.literal('practice'),enrollmentId:short,text:z.string().trim().min(80).max(8000)}).strict(),
 z.object({action:z.literal('quiz'),enrollmentId:short,answers:z.array(z.number().int()).min(1).max(20)}).strict(),
 z.object({action:z.literal('request'),enrollmentId:short}).strict(),
 z.object({action:z.literal('review'),enrollmentId:short,decision:z.enum(['validated','returned','certificate_available']),note:z.string().trim().min(5).max(2000),certificateUrl:url,reference:z.string().max(180),institutionIssued:z.boolean()}).strict(),
 z.object({action:z.literal('save_course'),course:courseSchema}).strict(),
]);
export async function courses(db:D1Database):Promise<Course[]>{const result=await db.prepare('SELECT data,version FROM learning_courses LIMIT 100').all<{data:string;version:number}>();const map=new Map(catalog.map(c=>[c.id,c]));for(const row of result.results) {const course=JSON.parse(row.data);map.set(course.id,{...course,version:row.version});}return [...map.values()];}
export function enrollment(row:any,admin=false):Enrollment{return {id:row.id,userId:row.user_id,name:row.name,courseId:row.course_id,courseVersion:row.course_version,completedLessons:JSON.parse(row.completed_lessons),bestScore:row.best_score,attempts:row.attempts,status:row.status,practice:row.practice,reviewStatus:row.review_status,reviewNote:row.review_note,certificateUrl:row.certificate_url,certificateReference:row.certificate_reference,createdAt:row.created_at,updatedAt:row.updated_at,completedAt:row.completed_at,issuedAt:row.issued_at,course:safeCourse(JSON.parse(row.course_snapshot),admin)};}
export async function learningData(db:D1Database,user:Learner|null,admin=false):Promise<LearningData>{const all=await courses(db);const own=user?await db.prepare('SELECT * FROM learning_enrollments WHERE user_id=? ORDER BY updated_at DESC LIMIT 100').bind(user.userId).all():{results:[]};const reviews=admin?await db.prepare('SELECT * FROM learning_enrollments ORDER BY updated_at DESC LIMIT 200').all():{results:[]};return {viewer:user?{name:user.displayName,admin}:null,courses:all.filter(c=>admin||c.published).map(c=>safeCourse(c,admin)),enrollments:own.results.map(r=>enrollment(r,admin)),reviews:reviews.results.map(r=>enrollment(r,true)),policyUrl:POLICY_URL};}
async function ownRow(db:D1Database,id:string,userId:string){const row=await db.prepare('SELECT * FROM learning_enrollments WHERE id=? AND user_id=?').bind(id,userId).first<any>();if(!row)throw new LearningError(404,'Matrícula não encontrada nesta conta.');return row;}
async function refreshCompletion(db:D1Database,id:string,now:string){const row=await db.prepare('SELECT * FROM learning_enrollments WHERE id=?').bind(id).first<any>();const course=JSON.parse(row.course_snapshot) as Course;const ready=readiness(course,JSON.parse(row.completed_lessons),row.best_score,row.practice);await db.prepare("UPDATE learning_enrollments SET status=?,completed_at=?,updated_at=? WHERE id=?").bind(ready?'completed':'studying',ready?(row.completed_at||now):null,now,id).run();}
export async function learningAction(db:D1Database,user:Learner|null,admin:boolean,input:unknown){
 if(!user)throw new LearningError(401,'Entre com sua conta para salvar o progresso.');
 const parsed=actionSchema.safeParse(input);if(!parsed.success){const action=(input as any)?.action;throw new LearningError(400,action==='practice'?'Escreva uma entrega com pelo menos 80 caracteres.':action==='enroll'?'Informe seu nome completo, com pelo menos 3 caracteres.':action==='quiz'?'Responda todas as questões com alternativas válidas.':'Revise os campos: títulos, conteúdos, prática, alternativas e links https:// são necessários.');}const body=parsed.data,now=new Date().toISOString();
 if(body.action==='save_course'){
  if(!admin)throw new LearningError(403,'Apenas a gestão pode editar os cursos.');const previous=(await courses(db)).find(c=>c.id===body.course.id);if((previous?.version||0)!==body.course.version)throw new LearningError(409,'Este curso mudou em outra aba. Recarregue antes de editar.');const next={...body.course,version:(previous?.version||0)+1};
  const stored=await db.prepare('SELECT version FROM learning_courses WHERE id=?').bind(next.id).first<{version:number}>();const result=stored?await db.prepare('UPDATE learning_courses SET data=?,version=?,updated_at=? WHERE id=? AND version=?').bind(JSON.stringify(next),next.version,now,next.id,previous!.version).run():await db.prepare('INSERT INTO learning_courses (id,data,version,updated_at) VALUES (?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(next.id,JSON.stringify(next),next.version,now).run();if(!result.meta.changes)throw new LearningError(409,'Este curso mudou em outra aba. Recarregue antes de editar.');return {message:'Curso salvo. Matrículas anteriores preservam a versão já iniciada.'};
 }
 if(body.action==='enroll'){
  const course=(await courses(db)).find(c=>c.id===body.courseId&&(c.published||admin));if(!course)throw new LearningError(404,'Curso indisponível.');await db.prepare('INSERT INTO learning_enrollments (id,user_id,name,course_id,course_version,course_snapshot,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(user_id,course_id) DO NOTHING').bind(crypto.randomUUID(),user.userId,body.name,course.id,course.version,JSON.stringify(course),now,now).run();return {message:'Matrícula registrada. Seu progresso ficará salvo nesta conta.'};
 }
 if(body.action==='review'){
  if(!admin)throw new LearningError(403,'Apenas a gestão pode validar conclusões.');const row=await db.prepare('SELECT * FROM learning_enrollments WHERE id=?').bind(body.enrollmentId).first<any>();if(!row)throw new LearningError(404,'Matrícula não encontrada.');if(row.status!=='completed')throw new LearningError(400,'A participante ainda não concluiu os critérios da trilha.');
  if(!['pending','validated','returned','certificate_available'].includes(row.review_status))throw new LearningError(400,'A participante precisa solicitar a validação primeiro.');
  const official=body.decision==='certificate_available';if(official&&(!body.certificateUrl||!body.reference.trim()||!body.institutionIssued))throw new LearningError(400,'Informe o documento, a referência e confirme a emissão institucional pela PROEXTC/UnDF.');
  await db.batch([
   db.prepare('UPDATE learning_enrollments SET review_status=?,review_note=?,certificate_url=?,certificate_reference=?,issued_at=?,updated_at=? WHERE id=?').bind(body.decision,body.note,official?body.certificateUrl:'',official?body.reference:'',official?now:null,now,row.id),
   db.prepare('INSERT INTO learning_audit (id,enrollment_id,actor_id,action,note,created_at) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),row.id,user.userId,body.decision,JSON.stringify({note:body.note,reference:body.reference,url:official?body.certificateUrl:''}),now),
  ]);return {message:official?'Documento institucional disponibilizado.':'Análise registrada.'};
 }
 const row=await ownRow(db,body.enrollmentId,user.userId),course=JSON.parse(row.course_snapshot) as Course;
 if(body.action==='request'){
  if(!readiness(course,JSON.parse(row.completed_lessons),row.best_score,row.practice))throw new LearningError(400,'Conclua as aulas, entregue a prática e alcance a nota mínima antes de solicitar a validação.');if(['pending','validated','certificate_available'].includes(row.review_status))return {message:'Sua solicitação já está registrada.'};await db.prepare("UPDATE learning_enrollments SET review_status='pending',review_note='',updated_at=? WHERE id=? AND user_id=?").bind(now,row.id,user.userId).run();return {message:'Conclusão enviada para análise da gestão do programa.'};
 }
 if(['pending','validated','certificate_available'].includes(row.review_status))throw new LearningError(409,'A conclusão está em análise ou já foi validada. Solicite ajustes à gestão antes de alterar a entrega.');
 if(body.action==='lesson'){
  if(!course.lessons.some(l=>l.id===body.lessonId))throw new LearningError(400,'Aula inválida para esta matrícula.');await db.prepare("UPDATE learning_enrollments SET completed_lessons=json_insert(completed_lessons,'$[#]',?),updated_at=? WHERE id=? AND user_id=? AND review_status IN ('none','returned') AND NOT EXISTS (SELECT 1 FROM json_each(completed_lessons) WHERE value=?)").bind(body.lessonId,now,row.id,user.userId,body.lessonId).run();
 }
 if(body.action==='practice')await db.prepare("UPDATE learning_enrollments SET practice=?,updated_at=? WHERE id=? AND user_id=? AND review_status IN ('none','returned')").bind(body.text,now,row.id,user.userId).run();
 let result:any={message:'Progresso salvo.'};if(body.action==='quiz'){
  let score:number;try{score=grade(course,body.answers);}catch(e){throw new LearningError(400,(e as Error).message);}await db.prepare("UPDATE learning_enrollments SET best_score=MAX(best_score,?),attempts=attempts+1,updated_at=? WHERE id=? AND user_id=? AND review_status IN ('none','returned')").bind(score,now,row.id,user.userId).run();result={message:score>=course.passingScore?'Avaliação concluída com a nota mínima.':'Revise as aulas e tente novamente.',score,feedback:course.questions.map((q,i)=>({id:q.id,correct:q.correctIndex===body.answers[i],explanation:q.explanation}))};
 }
 const current=await ownRow(db,row.id,user.userId);if(['pending','validated','certificate_available'].includes(current.review_status))throw new LearningError(409,'A conclusão entrou em análise. Atualize a página para consultar o andamento.');
 await refreshCompletion(db,row.id,now);return result;
}
