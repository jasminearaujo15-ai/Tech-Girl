import type { Course,Enrollment } from './types';
export function isProgramAdmin(email:string|undefined,configured:string|undefined){return !!email&&!!configured&&email.trim().toLowerCase()===configured.trim().toLowerCase();}
export function grade(course:Course,answers:number[]){if(answers.length!==course.questions.length||answers.some((a,i)=>!Number.isInteger(a)||a<0||a>=course.questions[i].options.length))throw new Error('Responda todas as questões com opções válidas.');const hits=course.questions.filter((q,i)=>q.correctIndex===answers[i]).length;return Math.round(hits/course.questions.length*100);}
export function readiness(course:Course,completed:string[],score:number,practice:string){return course.lessons.every(l=>completed.includes(l.id))&&score>=course.passingScore&&practice.trim().length>=80;}
export function safeCourse(course:Course,admin=false):Course{return {...course,questions:course.questions.map(q=>{if(admin)return q;const {correctIndex,explanation,...publicQuestion}=q;return {...publicQuestion,explanation:''};})};}
export function canReadEnrollment(userId:string,enrollment:{userId:string},admin=false){return admin||userId===enrollment.userId;}
