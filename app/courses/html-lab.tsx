"use client";
import {useState} from 'react';
import {Code2,Play,ArrowRight} from 'lucide-react';
const initial=`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Meu projeto</title>
<style>
  body { font-family: sans-serif; color: #71383e; background: #fff7ed; padding: 24px; line-height: 1.7; }
  main { max-width: 600px; margin: auto; }
  h1 { color: #b45121; }
</style>
</head>
<body>
<main>
  <h1>Minha primeira página</h1>
  <p>Uma ideia para transformar a comunidade.</p>
  <h2>O que quero construir</h2>
  <ul><li>Aprender</li><li>Criar</li><li>Compartilhar</li></ul>
</main>
</body>
</html>`;
export default function HtmlLab({onUse}:{onUse:(code:string)=>void}){const [code,setCode]=useState(initial),[rendered,setRendered]=useState(initial);return <section className="html-lab"><div className="section-title"><div><div className="eyebrow">LABORATÓRIO NO NAVEGADOR</div><h3><Code2 size={19}/>Experimente HTML e CSS</h3></div></div><p>Edite o código e atualize a prévia. O laboratório não executa JavaScript nem carrega recursos externos. O código fica nesta aba até você incluí-lo na entrega.</p><label className="field"><span>Código da página</span><textarea aria-label="Código do laboratório HTML" value={code} onChange={e=>setCode(e.target.value)} spellCheck={false} rows={14} maxLength={7000}/></label><div className="html-lab-actions"><button className="btn secondary" onClick={()=>setRendered(code)}><Play size={15}/>Atualizar prévia</button><button className="btn primary" onClick={()=>onUse(code)}>Usar código na entrega<ArrowRight size={15}/></button></div><iframe title="Prévia da sua página" sandbox="" srcDoc={'<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data:; form-action \'none\'">'+rendered}/></section>;}
