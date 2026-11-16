import type { Program } from "./program";
export type CalendarEvent = {id:string;title:string;date:string;time:string;type:string;status:string;location:string;duration?:number};
const stamp=(date:Date)=>date.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
const escapeIcs=(s:string)=>s.replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;");
function fold(line:string){let lines:string[]=[],part="",bytes=0;for(const char of line){const n=new TextEncoder().encode(char).length;if(bytes+n>75){lines.push(part);part=" ";bytes=1;}part+=char;bytes+=n;}lines.push(part);return lines.join("\r\n");}
export function calendarFile(events:CalendarEvent[],now=new Date()){
 const rows=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//TECH GIRL UnDF//Agenda//PT-BR","CALSCALE:GREGORIAN","X-WR-CALNAME:TECH GIRL UnDF","X-WR-TIMEZONE:America/Sao_Paulo"];
 for(const e of events){rows.push("BEGIN:VEVENT",`UID:${e.id}@techgirl-undf`,`DTSTAMP:${stamp(now)}`);if(e.time){const start=new Date(`${e.date}T${e.time}:00-03:00`);rows.push(`DTSTART:${stamp(start)}`);if(e.duration&&e.duration>0)rows.push(`DTEND:${stamp(new Date(start.getTime()+e.duration*3600000))}`);}else{rows.push(`DTSTART;VALUE=DATE:${e.date.replaceAll("-","")}`);const end=new Date(e.date+"T12:00:00Z");end.setUTCDate(end.getUTCDate()+1);rows.push(`DTEND;VALUE=DATE:${end.toISOString().slice(0,10).replaceAll("-","")}`);}rows.push(`SUMMARY:${escapeIcs(e.title)}`,`DESCRIPTION:${escapeIcs(`${e.type} • ${e.status}${e.time?` • Horário de Brasília: ${e.time}`:""}`)}`,`LOCATION:${escapeIcs(e.location)}`);if(e.status==="Cancelada")rows.push("STATUS:CANCELLED");rows.push("END:VEVENT");}
 rows.push("END:VCALENDAR");return rows.map(fold).join("\r\n")+"\r\n";
}
export function reportFile(data:Program){
 const rows:(string|number)[][]=[["Categoria","Item","Status","Data / prazo","Responsável / equipe","Participações / alcance","Link de evidência"]];
 data.activities.forEach(a=>rows.push([a.type,a.title,a.status,a.date,a.owner,a.attendees,a.evidence]));
 data.projects.forEach(p=>rows.push(["Projeto",p.title,p.status,"",p.team,"",p.evidence||p.url]));
 data.schools.forEach(s=>rows.push(["Escola",s.name,s.status,"",s.contact,s.students,s.evidence]));
 data.products.forEach(p=>rows.push(["Produto",p.title,p.status,p.due,p.owner,"",p.url]));
 rows.push(["Hackathon",data.hackathon.title,data.hackathon.status,data.hackathon.date,"",data.hackathon.participants,data.hackathon.evidence]);
 rows.push(["Alcance único","Estudantes UnDF","Registrado","","",data.reach.university,""]);
 rows.push(["Alcance único","Educação básica","Registrado","","",data.reach.basic,""]);
 return "\uFEFF"+rows.map(row=>row.map(v=>{let s=String(v);if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}).join(";")).join("\r\n");
}
