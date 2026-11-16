import { z } from "zod";
export const statuses = ["Planejada", "Confirmada", "Em andamento", "Concluída", "Cancelada"] as const;
export const types = ["Oficina", "Mentoria", "Palestra"] as const;
const short = z.string().max(180);
const note = z.string().max(5000);
const date = z.string().refine(v => !v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v))), "Data inválida");
const url = z.string().max(2000).refine(v => !v || /^https?:\/\//i.test(v), "Use um link https:// ou http://");
const count = z.number().int().min(0).max(100000);
export const programSchema = z.object({
  activities: z.array(z.object({ id: short, title: short.min(1), type: z.enum(types), status: z.enum(statuses), date, time: z.string().regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/), duration: z.number().min(0).max(1000), location: short, owner: short, month: short, description: note, attendees: count, evidence: url })).max(100),
  projects: z.array(z.object({ id: short, title: short.min(1), status: z.enum(["A definir", "Ideação", "Desenvolvimento", "Validação", "Concluído"]), team: short, description: note, url, evidence: url })).max(100),
  schools: z.array(z.object({ id: short, name: short.min(1), region: short, status: z.enum(["A articular", "Em contato", "Parceria confirmada", "Atendida"]), contact: short, students: count, notes: note, evidence: url })).max(100),
  products: z.array(z.object({ id: short, title: short.min(1), status: z.enum(["A iniciar", "Em andamento", "Concluído"]), owner: short, due: date, url, notes: note })).max(100),
  hackathon: z.object({ title: short.min(1), status: z.enum(statuses), date, time: short, location: short, teams: count, participants: count, description: note, evidence: url, checklist: z.array(z.object({ title: short, done: z.boolean() })).max(30) }),
  reach: z.object({ university: count, basic: count, notes: note }),
});
export type Program = z.infer<typeof programSchema>;
const lessons = [
  ["Boas-vindas e cidadania digital", "Oficina", "M3", "Inclusão digital, segurança da informação e colaboração."],
  ["Pensamento computacional", "Oficina", "M3", "Decomposição, padrões e desafios com algoritmos."],
  ["Lógica de programação", "Oficina", "M4", "Variáveis, condicionais, laços e resolução de problemas."],
  ["Primeiros passos na web", "Oficina", "M4", "HTML, CSS e uma primeira página com Git e GitHub."],
  ["JavaScript e interfaces", "Oficina", "M5", "Interatividade, front-end e introdução a UX/UI."],
  ["Mulheres que constroem tecnologia", "Palestra", "M5", "Trajetórias, oportunidades e protagonismo feminino."],
  ["Python, dados e APIs", "Oficina", "M6", "Primeiras aplicações e integração de sistemas."],
  ["Inteligência artificial com propósito", "Oficina", "M7", "IA generativa, ética e aplicação nos projetos."],
  ["Cloud e boas práticas de desenvolvimento", "Oficina", "M8", "Computação em nuvem e caminhos de formação."],
  ["Da ideia ao protótipo", "Mentoria", "M9", "Acompanhamento técnico dos projetos em equipe."],
  ["Preparação de pitch e hackathon", "Mentoria", "M9", "Preparação das equipes e apresentação de soluções."],
  ["Tecnologia que transforma a comunidade", "Palestra", "M11", "Trocas com as escolas e oportunidades nas áreas STEM."],
];
export const seed: Program = {
  activities: lessons.map((l,i)=>({id:`a${i+1}`,title:l[0],type:l[1] as typeof types[number],month:l[2],description:l[3],status:"Planejada",date:"",time:"",duration:0,location:"A definir",owner:"",attendees:0,evidence:""})),
  projects: Array.from({length:10},(_,i)=>({id:`p${i+1}`,title:`Projeto ${String(i+1).padStart(2,"0")} — a definir`,status:"A definir",team:"",description:"",url:"",evidence:""})),
  schools: Array.from({length:3},(_,i)=>({id:`s${i+1}`,name:`Escola ${String(i+1).padStart(2,"0")} — a articular`,region:"",status:"A articular",contact:"",students:0,notes:"",evidence:""})),
  products: ["Plano de trabalho e responsabilidades", "Identidade visual", "Site do programa", "Instagram e calendário editorial", "Inscrições e diagnóstico", "Planos de aula e materiais didáticos", "Registros de presença e evidências", "Relatório outubro–novembro", "Relatório final e resultados"].map((title,i)=>({id:`d${i+1}`,title,status:"A iniciar",owner:"",due:i===7?"2026-12-15":"",url:"",notes:i===7?"Prazo comunicado pela PROEXTC em 19/10/2026, registrado no plano de implantação.":""})),
  hackathon:{title:"Hackathon Tech Girl UnDF",status:"Planejada",date:"",time:"",location:"A definir",teams:0,participants:0,description:"Uma maratona colaborativa para transformar desafios reais da sociedade em soluções tecnológicas. Planejamento de referência: M10; data e formato a validar.",evidence:"",checklist:["Definir desafio e regulamento","Confirmar data e infraestrutura","Organizar inscrições e equipes","Convidar mentoras e banca","Preparar avaliação e pitch","Registrar resultados e evidências"].map(title=>({title,done:false}))},
  reach:{university:0,basic:0,notes:"Registre pessoas únicas, sem somar novamente quem participou de mais de uma ação. Não há resultados de participação informados nesta versão inicial."},
};
export const roadmap = ["Planejamento e mobilização","Integração e formação inicial","Fundamentos de programação","Desenvolvimento web","Desenvolvimento de aplicações","Python, dados e APIs","Inteligência artificial","Computação em nuvem","Projetos e inovação","Hackathon Tech Girl","Ações nas escolas e eventos","Demo Day e encerramento"];
