"use client";
import {Printer} from 'lucide-react';
export default function PrintButton(){return <button className="btn primary" onClick={()=>window.print()}><Printer size={16}/>Imprimir / salvar em PDF</button>;}
