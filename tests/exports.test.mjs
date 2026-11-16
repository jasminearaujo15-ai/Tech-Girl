import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarFile,reportFile} from '../app/exports.ts';
import {seed} from '../app/program.ts';
const event={id:'a1',title:'Mentoria, código e inclusão',date:'2026-12-02',time:'14:00',duration:2,type:'Mentoria',status:'Confirmada',location:'UnDF'};
test('agenda preserves Brasília start and duration when imported into calendars',()=>{const s=calendarFile([event],new Date('2026-11-15T00:00:00Z'));assert.match(s,/DTSTART:20261202T170000Z/);assert.match(s,/DTEND:20261202T190000Z/);assert.match(s,/SUMMARY:Mentoria\\, código e inclusão/);});
test('a deadline without a time remains a single all-day event across a month boundary',()=>{const s=calendarFile([{...event,date:'2026-12-31',time:'',duration:0}]);assert.match(s,/DTSTART;VALUE=DATE:20261231/);assert.match(s,/DTEND;VALUE=DATE:20270101/);});
test('UTF-8 calendar lines fold safely and cancellation is retained',()=>{const s=calendarFile([{...event,title:'Formação e inclusão '.repeat(15),status:'Cancelada'}]);assert.match(s,/STATUS:CANCELLED/);for(const line of s.split('\r\n'))assert.ok(Buffer.byteLength(line)<=75);assert.ok(s.replace(/\r\n /g,'').includes('SUMMARY:Formação e inclusão '.repeat(1)));});
test('CSV exports all records and prevents formula execution in user text',()=>{const data=structuredClone(seed);data.activities[0].title='=HYPERLINK("https://example.com")';const csv=reportFile(data);assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"\'=HYPERLINK'));assert.ok(csv.includes('"Estudantes UnDF"'));assert.equal(csv.split('\r\n').length,1+12+10+3+9+1+2);});
