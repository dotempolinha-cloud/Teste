import { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { LayoutDashboard, Car, Users, MapPin, Fuel, Wrench, DollarSign, FileText, Bell, Settings, LogOut, Search, Plus, Edit, Download, CheckCircle, AlertCircle, AlertTriangle, Truck, X, Check, Activity, Shield, User, Calendar, BarChart2, ClipboardList, Building2, CheckSquare, AlertOctagon, Moon, Sun, Trash2, Filter, Save, TrendingUp, TrendingDown, Menu, Lock, Eye, EyeOff } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   CSS — Layout Responsivo Automático + Modo Escuro
   ═══════════════════════════════════════════════════════════ */
const CSS = `
html,body{margin:0;padding:0;width:100%;overflow-x:hidden;}
.sga{--b:#f0f4f8;--c:#fff;--bd:#e2e8f0;--tx:#0f172a;--sx:#374151;--mu:#64748b;--th:#f8fafc;--ra:#f9fafb;--hv:#eff6ff;--in:#fff;--ibd:#d1d5db;width:100%;min-height:100vh;font-family:'Segoe UI',system-ui,sans-serif;}
.sga.dark{--b:#0c1828;--c:#112038;--bd:#1a3050;--tx:#f1f5f9;--sx:#cbd5e1;--mu:#7090b8;--th:#091522;--ra:#091522;--hv:#152d52;--in:#091522;--ibd:#1a3050;}
.sga *{box-sizing:border-box;}
.sga input,.sga select,.sga textarea{background:var(--in);color:var(--tx);outline:none;font-family:inherit;transition:border-color .15s;}
.sga input:focus,.sga select:focus,.sga textarea:focus{border-color:#1d4ed8!important;}
.sga input::placeholder,.sga textarea::placeholder{color:var(--mu);}

/* ── Sidebar & Layout ── */
.sga-sb{position:fixed;left:0;top:0;width:248px;height:100vh;z-index:200;overflow-y:auto;background:#0c1a47;transform:translateX(0);transition:transform .28s cubic-bezier(.4,0,.2,1);}
.sga-mn{margin-left:248px;display:flex;flex-direction:column;min-height:100vh;min-width:0;transition:margin-left .28s ease;}
.sga-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:150;opacity:0;pointer-events:none;transition:opacity .28s;}
.sga-ov.vis{opacity:1;pointer-events:all;}
.ham{display:none;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;padding:6px;color:var(--mu);}

/* ── Auto-fill Grids ── */
.g-kpi{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:12px;margin-bottom:12px;}
.g-dash{display:grid;grid-template-columns:1.3fr 1fr;gap:12px;margin-bottom:12px;}
.g-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.g-f3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px;}
.g-f4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px;}
.g-f2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.g-rpt{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;}
.tbl{overflow-x:auto;-webkit-overflow-scrolling:touch;}

/* ── Hover & Utilities ── */
.hr:hover{background:var(--hv)!important;cursor:pointer;}
.ni:hover{background:rgba(255,255,255,.07)!important;}
.ch:hover{border-color:#1d4ed8!important;transition:border-color .15s;}
.no-mob{} /* visible by default */

/* ── Animations ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes spin{to{transform:rotate(360deg)}}
.fu{animation:fadeUp .22s ease;}
.blink{animation:blink 2.2s ease infinite;}
.spin{animation:spin .8s linear infinite;}

/* ── TABLET (max 1024px) ── */
@media(max-width:1024px){
  .g-kpi{grid-template-columns:repeat(auto-fill,minmax(175px,1fr));}
}

/* ── MOBILE (max 900px) ── */
@media(max-width:900px){
  .sga-sb{transform:translateX(-248px);}
  .sga-sb.open{transform:translateX(0);}
  .sga-mn{margin-left:0!important;}
  .ham{display:flex;}
  .no-mob{display:none!important;}
  .g-dash{grid-template-columns:1fr!important;}
  .g-2{grid-template-columns:1fr!important;}
}

/* ── SMALL MOBILE (max 600px) ── */
@media(max-width:600px){
  .g-kpi{grid-template-columns:repeat(2,1fr)!important;}
  .g-f3{grid-template-columns:1fr 1fr!important;}
  .g-f4{grid-template-columns:1fr 1fr!important;}
  .g-f2{grid-template-columns:1fr!important;}
}

/* ── VERY SMALL (max 380px) ── */
@media(max-width:380px){
  .g-kpi{grid-template-columns:1fr!important;}
}
`;

/* ═══════════════════════════════════════════════════════════
   TOKENS
   ═══════════════════════════════════════════════════════════ */
const C = {
  nav:"#0c1a47", primary:"#1d4ed8", ok:"#16a34a", bad:"#dc2626", warn:"#d97706", info:"#0284c7",
  bg:"var(--b)", card:"var(--c)", bd:"var(--bd)", tx:"var(--tx)",
  sub:"var(--sx)", mu:"var(--mu)", th:"var(--th)", ra:"var(--ra)", hv:"var(--hv)", inp:"var(--in)", ibd:"var(--ibd)",
};
const bdr = (c) => `1px solid ${c||C.bd}`;

/* ═══════════════════════════════════════════════════════════
   USUÁRIOS DO SISTEMA — Credenciais e Perfis
   ═══════════════════════════════════════════════════════════ */
const SISTEMA_USUARIOS = [
  { email:"admin@upanema.rn.gov.br",   pw:"admin123",  nome:"Administrador",       role:"admin",     perfil:"Administrador Geral",  sec:"Gestão Municipal", mat:"PMU-ADMIN",   ativo:true  },
  { email:"gestor@upanema.rn.gov.br",  pw:"gestor123", nome:"Carlos Ferreira",     role:"gestor",    perfil:"Gestor da Garagem",    sec:"Obras",             mat:"PMU-GRG01",   ativo:true  },
  { email:"saude@upanema.rn.gov.br",   pw:"saude123",  nome:"Dra. Luísa Amaral",   role:"secretario",perfil:"Secretária de Saúde",  sec:"Saúde",             mat:"PMU-SAU01",   ativo:true  },
  { email:"obras@upanema.rn.gov.br",   pw:"obras123",  nome:"Eng. Marcos Lima",    role:"supervisor",perfil:"Supervisor de Obras",  sec:"Obras",             mat:"PMU-OBR01",   ativo:true  },
  { email:"motorista@upanema.rn.gov.br",pw:"motor123", nome:"João Silva",          role:"motorista", perfil:"Motorista",            sec:"Obras",             mat:"PMU-001234",  ativo:true  },
  { email:"auditor@upanema.rn.gov.br", pw:"audit123",  nome:"Fernando Auditoria",  role:"auditor",   perfil:"Auditor Externo",      sec:"Controle Interno",  mat:"PMU-AUD01",   ativo:false },
];

/* ═══════════════════════════════════════════════════════════
   ARMAZENAMENTO PERSISTENTE
   ═══════════════════════════════════════════════════════════ */
const Store = {
  async get(k){try{const r=await window.storage?.get(k);return r?JSON.parse(r.value):null;}catch{return null;}},
  async set(k,v){try{await window.storage?.set(k,JSON.stringify(v));}catch{}},
};

/* ═══════════════════════════════════════════════════════════
   DADOS MOCKADOS — Frota Completa
   ═══════════════════════════════════════════════════════════ */
const V0=[
  {id:"V001",placa:"QRZ-1A34",renavam:"00123456789",chassi:"9BWZZZ377VT004251",marca:"Ford",modelo:"Transit 2.2 Diesel",ano:2020,cor:"Branco",tipo:"Van",cat:"Transporte",sec:"Saúde",km:45320,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"01/08/2025",seg:"31/12/2025",pat:"PMU-0123",niv:75,obs:"Prioritário para transporte de pacientes",mul:0,custo:889.20,kmm:1240},
  {id:"V002",placa:"QST-2B56",renavam:"00987654321",chassi:"9BWZZZ377VT004252",marca:"Chevrolet",modelo:"S10 2.8 Diesel",ano:2019,cor:"Prata",tipo:"Picape",cat:"Serviço",sec:"Obras",km:78900,comb:"Diesel S-10",sit:"Em uso",mot:"João Silva",rev:"15/07/2025",seg:"30/06/2025",pat:"PMU-0456",niv:50,obs:"Trocar óleo em 500 km (OS programada)",mul:1,custo:697.40,kmm:3100},
  {id:"V003",placa:"QUV-3C78",renavam:"00456789012",chassi:"9BWZZZ377VT004253",marca:"Volkswagen",modelo:"Gol 1.0 Gasolina",ano:2021,cor:"Azul",tipo:"Passeio",cat:"Administrativo",sec:"Administração",km:23100,comb:"Gasolina",sit:"Manutenção",mot:null,rev:"10/09/2025",seg:"15/01/2026",pat:"PMU-0789",niv:30,obs:"Reparo suspensão dianteira — OS-0092",mul:0,custo:1026.70,kmm:400},
  {id:"V004",placa:"QWX-4D90",renavam:"00321654987",chassi:"9BWZZZ377VT004254",marca:"Fiat",modelo:"Ducato Ambulância",ano:2018,cor:"Branco",tipo:"Ambulância",cat:"Emergência",sec:"Saúde",km:112400,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"20/07/2025",seg:"30/11/2025",pat:"PMU-0321",niv:90,obs:"Revisão dos 110.000 km concluída",mul:0,custo:567.00,kmm:2800},
  {id:"V005",placa:"QYZ-5E12",renavam:"00654321098",chassi:"9BWZZZ377VT004255",marca:"Mercedes-Benz",modelo:"Sprinter Escolar 415",ano:2022,cor:"Amarelo",tipo:"Ônibus Escolar",cat:"Transp. Escolar",sec:"Educação",km:31200,comb:"Diesel S-10",sit:"Em uso",mot:"Maria Santos",rev:"05/10/2025",seg:"20/03/2026",pat:"PMU-0654",niv:60,obs:"Rota Escolar 02 — 35 alunos ativos",mul:0,custo:500.00,kmm:2100},
  {id:"V006",placa:"QAB-6F34",renavam:"00789012345",chassi:"9BWZZZ377VT004256",marca:"John Deere",modelo:"Trator 5075E",ano:2017,cor:"Verde/Amarelo",tipo:"Trator",cat:"Máq. Pesada",sec:"Obras",km:0,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"30/08/2025",seg:"01/12/2025",pat:"PMU-0987",niv:40,obs:"Horímetro: 2.340 h — uso em terraplanagem",mul:0,custo:0,kmm:0},
  {id:"V007",placa:"QCD-7G56",renavam:"00891234567",chassi:"9BWZZZ377VT004257",marca:"Volkswagen",modelo:"Kombi 1.4",ano:2014,cor:"Branco",tipo:"Utilitário",cat:"Transporte",sec:"Assist. Social",km:89500,comb:"Gasolina",sit:"Baixado",mot:null,rev:"—",seg:"—",pat:"PMU-1234",niv:0,obs:"Aguardando leilão — Processo nº 2025/LAR-04",mul:3,custo:0,kmm:0},
  {id:"V008",placa:"RCA-8H78",renavam:"00912345678",chassi:"9BWZZZ377VT004258",marca:"Toyota",modelo:"Hilux CD 2.8",ano:2021,cor:"Preto",tipo:"Picape",cat:"Serviço",sec:"Obras",km:34700,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"20/11/2025",seg:"28/02/2026",pat:"PMU-1400",niv:85,obs:"Veículo de supervisão de obras",mul:0,custo:320.00,kmm:890},
  {id:"V009",placa:"RDA-9I90",renavam:"00934567890",chassi:"9BWZZZ377VT004259",marca:"Renault",modelo:"Master 2.3 Ambulância",ano:2023,cor:"Branco",tipo:"Ambulância",cat:"Emergência",sec:"Saúde",km:8600,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"15/05/2026",seg:"10/06/2026",pat:"PMU-1450",niv:95,obs:"Ambulância UTI — UTI móvel completa",mul:0,custo:280.00,kmm:760},
  {id:"V010",placa:"REB-0J12",renavam:"00956789012",chassi:"9BWZZZ377VT004260",marca:"Hyundai",modelo:"HR 2.5 Diesel",ano:2020,cor:"Branco",tipo:"Utilitário",cat:"Transporte",sec:"Educação",km:41800,comb:"Diesel S-10",sit:"Em uso",mot:"Roberto Mendes",rev:"12/09/2025",seg:"30/09/2025",pat:"PMU-1510",niv:55,obs:"Transporte de materiais escolares",mul:0,custo:410.00,kmm:1320},
  {id:"V011",placa:"RFC-1K34",renavam:"00978901234",chassi:"9BWZZZ377VT004261",marca:"New Holland",modelo:"Retroescavadeira B95B",ano:2016,cor:"Amarelo",tipo:"Retroescavadeira",cat:"Máq. Pesada",sec:"Obras",km:0,comb:"Diesel S-10",sit:"Manutenção",mot:null,rev:"05/07/2025",seg:"01/11/2025",pat:"PMU-1560",niv:20,obs:"OS-0091 — Troca de pneus dianteiros e revisão",mul:0,custo:2100.00,kmm:0},
  {id:"V012",placa:"RGD-2L56",renavam:"00990123456",chassi:"9BWZZZ377VT004262",marca:"Marcopolo",modelo:"Ônibus Escolar 70 lug.",ano:2019,cor:"Amarelo",tipo:"Ônibus Escolar",cat:"Transp. Escolar",sec:"Educação",km:62400,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"25/08/2025",seg:"31/10/2025",pat:"PMU-1620",niv:70,obs:"Rota Escolar 01 — Zona Rural",mul:0,custo:890.00,kmm:2650},
];

const D0=[
  {id:"M001",nome:"João Silva",cpf:"123.456.789-00",rg:"1.234.567",mat:"PMU-001234",nasc:"15/03/1985",tel:"(84) 99123-4567",email:"joao.silva@upanema.rn.gov.br",sec:"Obras",cargo:"Motorista",cnh:"D",valCnh:"27/05/2027",sit:"Ativo",viagens:52,kmR:14800,veiAtual:"QST-2B56"},
  {id:"M002",nome:"Maria Santos",cpf:"987.654.321-00",rg:"7.654.321",mat:"PMU-001235",nasc:"22/07/1990",tel:"(84) 99234-5678",email:"maria.santos@upanema.rn.gov.br",sec:"Educação",cargo:"Motorista Escolar",cnh:"D",valCnh:"10/11/2026",sit:"Ativo",viagens:44,kmR:10200,veiAtual:"QYZ-5E12"},
  {id:"M003",nome:"Carlos Oliveira",cpf:"456.789.123-00",rg:"4.567.891",mat:"PMU-001236",nasc:"30/11/1978",tel:"(84) 99345-6789",email:"carlos.oliveira@upanema.rn.gov.br",sec:"Saúde",cargo:"Motorista",cnh:"E",valCnh:"15/07/2025",sit:"Ativo",viagens:74,kmR:31400,veiAtual:null},
  {id:"M004",nome:"Ana Pereira",cpf:"321.654.987-00",rg:"3.216.549",mat:"PMU-001237",nasc:"08/04/1992",tel:"(84) 99456-7890",email:"ana.pereira@upanema.rn.gov.br",sec:"Administração",cargo:"Motorista",cnh:"B",valCnh:"28/02/2028",sit:"Férias",viagens:25,kmR:4900,veiAtual:null},
  {id:"M005",nome:"Pedro Almeida",cpf:"654.321.098-00",rg:"6.543.210",mat:"PMU-001238",nasc:"14/09/1982",tel:"(84) 99567-8901",email:"pedro.almeida@upanema.rn.gov.br",sec:"Obras",cargo:"Operador de Máq.",cnh:"D",valCnh:"05/08/2026",sit:"Ativo",viagens:38,kmR:7600,veiAtual:null},
  {id:"M006",nome:"Fernanda Costa",cpf:"789.012.345-00",rg:"7.890.123",mat:"PMU-001239",nasc:"17/12/1988",tel:"(84) 99678-9012",email:"fernanda.costa@upanema.rn.gov.br",sec:"Saúde",cargo:"Mot. Ambulância",cnh:"E",valCnh:"30/09/2025",sit:"Ativo",viagens:97,kmR:48600,veiAtual:null},
  {id:"M007",nome:"Roberto Mendes",cpf:"543.210.876-00",rg:"5.432.108",mat:"PMU-001240",nasc:"03/06/1980",tel:"(84) 99789-0123",email:"roberto.mendes@upanema.rn.gov.br",sec:"Educação",cargo:"Motorista",cnh:"D",valCnh:"19/04/2027",sit:"Ativo",viagens:29,kmR:8100,veiAtual:"REB-0J12"},
  {id:"M008",nome:"Juliana Lima",cpf:"876.543.210-00",rg:"8.765.432",mat:"PMU-001241",nasc:"11/09/1995",tel:"(84) 99890-1234",email:"juliana.lima@upanema.rn.gov.br",sec:"Assist. Social",cargo:"Motorista",cnh:"B",valCnh:"22/06/2028",sit:"Ativo",viagens:18,kmR:3200,veiAtual:null},
];

const T0=[
  {id:"VGM-2025-0240",placa:"QYZ-5E12",mod:"Mercedes Sprinter",mot:"Maria Santos",dest:"Escola Mun. José Bezerra — Roteiro 02",kmi:31000,kmf:null,saida:"08/06/2025 06:00",ret:null,fin:"Transporte Escolar",sec:"Educação",sit:"Em andamento",pass:35,custo:null},
  {id:"VGM-2025-0239",placa:"REB-0J12",mod:"Hyundai HR",mot:"Roberto Mendes",dest:"E. E. Upanema — Entrega de Materiais",kmi:41600,kmf:41800,saida:"08/06/2025 08:00",ret:"08/06/2025 11:30",fin:"Entrega Materiais",sec:"Educação",sit:"Concluída",pass:2,custo:120.00},
  {id:"VGM-2025-0238",placa:"QRZ-1A34",mod:"Ford Transit",mot:"Carlos Oliveira",dest:"Hospital Regional Tarcísio Maia — Mossoró",kmi:45000,kmf:45320,saida:"08/06/2025 07:30",ret:"08/06/2025 17:45",fin:"Transp. de Pacientes",sec:"Saúde",sit:"Concluída",pass:3,custo:286.20},
  {id:"VGM-2025-0237",placa:"QST-2B56",mod:"Chevrolet S10",mot:"João Silva",dest:"Rua das Flores nº 540 — Pavimentação",kmi:78700,kmf:78900,saida:"07/06/2025 07:00",ret:"07/06/2025 18:00",fin:"Serviço de Obras",sec:"Obras",sit:"Concluída",pass:3,custo:377.40},
  {id:"VGM-2025-0236",placa:"QWX-4D90",mod:"Fiat Ducato",mot:"Fernanda Costa",dest:"H. Univ. Onofre Lopes — Natal/RN",kmi:111900,kmf:112400,saida:"06/06/2025 04:30",ret:"06/06/2025 22:15",fin:"Emergência Médica — UTI",sec:"Saúde",sit:"Concluída",pass:1,custo:567.00},
  {id:"VGM-2025-0235",placa:"RCA-8H78",mod:"Toyota Hilux",mot:"João Silva",dest:"Canteiro de Obras — Av. Pres. Vargas",kmi:34300,kmf:34700,saida:"05/06/2025 07:30",ret:"05/06/2025 17:00",fin:"Supervisão de Obras",sec:"Obras",sit:"Concluída",pass:2,custo:195.00},
  {id:"VGM-2025-0234",placa:"RDA-9I90",mod:"Renault Master",mot:"Carlos Oliveira",dest:"UPA Upanema — Transferência paciente",kmi:8200,kmf:8600,saida:"04/06/2025 14:00",ret:"04/06/2025 18:30",fin:"Transp. de Pacientes",sec:"Saúde",sit:"Concluída",pass:2,custo:145.00},
  {id:"VGM-2025-0233",placa:"QRZ-1A34",mod:"Ford Transit",mot:"Fernanda Costa",dest:"CAAC Mossoró — Tratamento Contínuo",kmi:44650,kmf:45000,saida:"03/06/2025 06:00",ret:"03/06/2025 19:30",fin:"Tratamento Médico",sec:"Saúde",sit:"Concluída",pass:4,custo:240.00},
  {id:"VGM-2025-0232",placa:"QAB-6F34",mod:"Trator John Deere",mot:"Pedro Almeida",dest:"Zona Rural — Estrada do Olho D'água",kmi:null,kmf:null,saida:"02/06/2025 07:00",ret:"02/06/2025 17:30",fin:"Terraplanagem",sec:"Obras",sit:"Concluída",pass:1,custo:0},
  {id:"VGM-2025-0231",placa:"RGD-2L56",mod:"Ônibus Marcopolo",mot:"Maria Santos",dest:"Escola Mun. Antônio Alves — Roteiro 01",kmi:61800,kmf:62400,saida:"01/06/2025 06:00",ret:"01/06/2025 17:45",fin:"Transporte Escolar",sec:"Educação",sit:"Concluída",pass:42,custo:480.00},
];

const F0=[
  {id:"ABS-0048",placa:"RDA-9I90",mod:"Renault Master",mot:"Carlos Oliveira",data:"08/06/2025 18:30",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:55.0,vl:6.30,total:346.50,km:8600,media:11.2},
  {id:"ABS-0047",placa:"QRZ-1A34",mod:"Ford Transit",mot:"Carlos Oliveira",data:"08/06/2025 17:00",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:45.5,vl:6.29,total:286.20,km:45320,media:9.8},
  {id:"ABS-0046",placa:"REB-0J12",mod:"Hyundai HR",mot:"Roberto Mendes",data:"07/06/2025 19:00",posto:"Posto Municipal",tipo:"Diesel S-10",litros:38.0,vl:6.28,total:238.64,km:41800,media:10.5},
  {id:"ABS-0045",placa:"QYZ-5E12",mod:"Mercedes Sprinter",mot:"Maria Santos",data:"07/06/2025 18:30",posto:"Posto Municipal",tipo:"Diesel S-10",litros:80.0,vl:6.25,total:500.00,km:31000,media:8.5},
  {id:"ABS-0044",placa:"QST-2B56",mod:"Chevrolet S10",mot:"João Silva",data:"07/06/2025 18:00",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:60.0,vl:6.29,total:377.40,km:78700,media:10.2},
  {id:"ABS-0043",placa:"RCA-8H78",mod:"Toyota Hilux",mot:"João Silva",data:"06/06/2025 17:30",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:48.0,vl:6.29,total:301.92,km:34700,media:11.8},
  {id:"ABS-0042",placa:"QWX-4D90",mod:"Fiat Ducato",mot:"Fernanda Costa",data:"06/06/2025 23:00",posto:"Posto BR — Natal/RN",tipo:"Diesel S-10",litros:90.0,vl:6.30,total:567.00,km:112400,media:7.8},
  {id:"ABS-0041",placa:"RGD-2L56",mod:"Ônibus Marcopolo",mot:"Maria Santos",data:"05/06/2025 18:00",posto:"Posto Municipal",tipo:"Diesel S-10",litros:120.0,vl:6.25,total:750.00,km:62400,media:7.2},
  {id:"ABS-0040",placa:"QUV-3C78",mod:"VW Gol",mot:"—",data:"01/06/2025 10:00",posto:"Posto Central Upanema",tipo:"Gasolina",litros:30.0,vl:5.89,total:176.70,km:23000,media:12.1},
];

const M0=[
  {id:"OS-0095",placa:"RFC-1K34",mod:"New Holland Retro",tipo:"Corretiva",desc:"Substituição de pneus dianteiros e revisão de freios",oficina:"Tecmasc Equipamentos — Mossoró",custo:2100.00,criado:"08/06/2025",prev:"12/06/2025",status:"Agendada",prior:"Alta"},
  {id:"OS-0094",placa:"QUV-3C78",mod:"VW Gol",tipo:"Corretiva",desc:"Reparo suspensão dianteira — amortecedores e buchas",oficina:"Oficina São Pedro",custo:850.00,criado:"07/06/2025",prev:"10/06/2025",status:"Em execução",prior:"Alta"},
  {id:"OS-0093",placa:"QRZ-1A34",mod:"Ford Transit",tipo:"Preventiva",desc:"Troca de pneus traseiros — 2 unidades 215/75R16",oficina:"Pneus Silva Upanema",custo:780.00,criado:"08/06/2025",prev:"10/06/2025",status:"Agendada",prior:"Média"},
  {id:"OS-0092",placa:"RGD-2L56",mod:"Ônibus Marcopolo",tipo:"Preventiva",desc:"Revisão dos 60.000 km — óleo, filtros, buchas e freios",oficina:"Auto Center RN — Mossoró",custo:1450.00,criado:"05/06/2025",prev:"07/06/2025",status:"Finalizada",prior:"Alta"},
  {id:"OS-0091",placa:"QST-2B56",mod:"Chevrolet S10",tipo:"Preventiva",desc:"Troca de óleo e filtros — a cada 10.000 km",oficina:"Auto Center RN — Mossoró",custo:380.00,criado:"01/06/2025",prev:"01/06/2025",status:"Finalizada",prior:"Média"},
  {id:"OS-0090",placa:"QWX-4D90",mod:"Fiat Ducato",tipo:"Preventiva",desc:"Revisão dos 110.000 km — kit completo de manutenção",oficina:"Conc. Fiat — Mossoró",custo:1200.00,criado:"20/05/2025",prev:"22/05/2025",status:"Finalizada",prior:"Alta"},
];

const MU0=[
  {id:"MLT-001",placa:"QST-2B56",mot:"João Silva",data:"15/05/2025",inf:"Excesso de velocidade — 56 km/h em via de 40 km/h (Rod. RN-015)",valor:195.23,status:"Pendente"},
  {id:"MLT-002",placa:"QCD-7G56",mot:"—",data:"10/03/2025",inf:"Estacionamento em local proibido — Av. Cel. Antônio Fernandes",valor:88.38,status:"Pago"},
  {id:"MLT-003",placa:"QCD-7G56",mot:"—",data:"22/02/2025",inf:"Avanço de sinal vermelho — Cruzamento Rua do Comércio",valor:293.47,status:"Em recurso"},
  {id:"MLT-004",placa:"QCD-7G56",mot:"—",data:"05/01/2025",inf:"Condução sem o CRLV — documento vencido em 31/12/2024",valor:195.23,status:"Pago"},
  {id:"MLT-005",placa:"RCA-8H78",mot:"João Silva",data:"28/05/2025",inf:"Velocidade não compatível com o local — via urbana",valor:130.16,status:"Pendente"},
];

const AL0=[
  {id:1,nivel:"danger",tipo:"Seguro",titulo:"Seguro com vencimento crítico",desc:"QST-2B56 (Chevrolet S10) — Seguro vence em 30/06/2025. Apenas 22 dias restantes.",pg:"vehicles"},
  {id:2,nivel:"warning",tipo:"CNH",titulo:"CNH próxima do vencimento",desc:"Carlos Oliveira — CNH Cat. E vence em 15/07/2025 (37 dias). Providenciar renovação.",pg:"drivers"},
  {id:3,nivel:"warning",tipo:"CNH",titulo:"CNH próxima do vencimento",desc:"Fernanda Costa — CNH Cat. E vence em 30/09/2025 (114 dias).",pg:"drivers"},
  {id:4,nivel:"warning",tipo:"Revisão",titulo:"Revisão preventiva agendada",desc:"QWX-4D90 (Fiat Ducato) — Revisão dos 115.000 km prevista para 20/07/2025.",pg:"maintenance"},
  {id:5,nivel:"warning",tipo:"KM",titulo:"Troca de óleo necessária",desc:"QST-2B56 — Troca de óleo programada para 79.400 km (restam ~500 km).",pg:"vehicles"},
  {id:6,nivel:"warning",tipo:"Seguro",titulo:"Seguro vence em setembro",desc:"REB-0J12 (Hyundai HR) — Seguro vence em 30/09/2025. Renovar com antecedência.",pg:"vehicles"},
  {id:7,nivel:"info",tipo:"Documento",titulo:"CRLV vence em dezembro",desc:"QCD-7G56 (VW Kombi) — CRLV vence em 31/12/2025. Veículo aguarda leilão.",pg:"vehicles"},
  {id:8,nivel:"info",tipo:"Revisão",titulo:"Revisão preventiva futura",desc:"QYZ-5E12 (Sprinter) — Revisão programada para 05/10/2025 (119 dias).",pg:"maintenance"},
];

const CH_G=[{mes:"Jan",c:2840,m:1180},{mes:"Fev",c:3120,m:460},{mes:"Mar",c:2980,m:2100},{mes:"Abr",c:3440,m:820},{mes:"Mai",c:4190,m:2350},{mes:"Jun",c:3165,m:4050}];
const CH_S=[{name:"Saúde",v:9840,cor:"#1d4ed8"},{name:"Obras",v:6720,cor:"#0c1a47"},{name:"Educação",v:4210,cor:"#3b82f6"},{name:"Admin",v:1800,cor:"#60a5fa"},{name:"Social",v:890,cor:"#93c5fd"}];
const CH_V=[{s:"S1/Mai",v:14},{s:"S2/Mai",v:19},{s:"S3/Mai",v:16},{s:"S4/Mai",v:24},{s:"S1/Jun",v:12},{s:"S2/Jun",v:8}];
const CH_K=[{p:"QUV-3C78",v:12.1},{p:"RCA-8H78",v:11.8},{p:"RDA-9I90",v:11.2},{p:"REB-0J12",v:10.5},{p:"QST-2B56",v:10.2},{p:"QRZ-1A34",v:9.8},{p:"QYZ-5E12",v:8.5},{p:"QWX-4D90",v:7.8}];

const LOG0=[
  {id:1,user:"Administrador",acao:"Login no sistema",det:"IP: 192.168.1.10 — Acesso autorizado",data:"08/06/2025 07:14",tipo:"info"},
  {id:2,user:"Administrador",acao:"Registrou viagem VGM-2025-0240",det:"QYZ-5E12 — Maria Santos → Escola Municipal",data:"08/06/2025 05:50",tipo:"create"},
  {id:3,user:"Gestor da Garagem",acao:"Atualizou veículo QUV-3C78",det:"Situação alterada: Disponível → Manutenção",data:"07/06/2025 16:30",tipo:"edit"},
  {id:4,user:"Gestor da Garagem",acao:"Criou OS-0094",det:"QUV-3C78 — Suspensão dianteira",data:"07/06/2025 16:32",tipo:"create"},
  {id:5,user:"Administrador",acao:"Registrou abastecimento ABS-0047",det:"QRZ-1A34 — 45,5L Diesel — R$ 286,20",data:"08/06/2025 17:05",tipo:"create"},
  {id:6,user:"Supervisor de Obras",acao:"Atualizou motorista M004",det:"Status: Ativo → Férias",data:"06/06/2025 08:00",tipo:"edit"},
  {id:7,user:"Administrador",acao:"Cadastrou novo veículo RDA-9I90",det:"Renault Master — Ambulância UTI — Saúde",data:"05/06/2025 14:20",tipo:"create"},
  {id:8,user:"Gestor da Garagem",acao:"Finalizou OS-0092",det:"Ônibus Marcopolo — Revisão 60.000 km",data:"07/06/2025 17:00",tipo:"edit"},
];

const NAV=[
  {sec:null,items:[{id:"dashboard",lb:"Painel Geral",ic:LayoutDashboard,roles:["admin","gestor","secretario","supervisor","motorista","auditor"]}]},
  {sec:"OPERAÇÕES",items:[
    {id:"vehicles",lb:"Veículos",ic:Car,roles:["admin","gestor","secretario","supervisor","auditor"]},
    {id:"drivers",lb:"Motoristas",ic:Users,roles:["admin","gestor","supervisor","auditor"]},
    {id:"trips",lb:"Viagens",ic:MapPin,badge:1,roles:["admin","gestor","secretario","supervisor","motorista"]},
    {id:"checklist",lb:"Checklist Diário",ic:CheckSquare,roles:["admin","gestor","motorista","supervisor"]},
  ]},
  {sec:"RECURSOS",items:[
    {id:"fuel",lb:"Abastecimento",ic:Fuel,roles:["admin","gestor","supervisor"]},
    {id:"maintenance",lb:"Manutenção",ic:Wrench,badge:2,roles:["admin","gestor","supervisor","auditor"]},
    {id:"fines",lb:"Multas",ic:AlertOctagon,roles:["admin","gestor","auditor"]},
  ]},
  {sec:"GESTÃO",items:[
    {id:"financial",lb:"Financeiro",ic:DollarSign,roles:["admin","gestor","secretario","auditor"]},
    {id:"reports",lb:"Relatórios",ic:FileText,roles:["admin","gestor","secretario","auditor"]},
    {id:"suppliers",lb:"Fornecedores",ic:Building2,roles:["admin","gestor"]},
  ]},
  {sec:"SISTEMA",items:[
    {id:"alerts",lb:"Alertas",ic:Bell,badge:8,roles:["admin","gestor","secretario","supervisor"]},
    {id:"audit",lb:"Auditoria",ic:Shield,roles:["admin","auditor"]},
    {id:"settings",lb:"Configurações",ic:Settings,roles:["admin"]},
  ]},
];
const PL={dashboard:"Painel Geral",vehicles:"Veículos",drivers:"Motoristas",trips:"Viagens",checklist:"Checklist Diário",fuel:"Abastecimento",maintenance:"Manutenção",fines:"Multas",financial:"Financeiro",reports:"Relatórios",suppliers:"Fornecedores",alerts:"Alertas",audit:"Auditoria",settings:"Configurações"};

/* ═══════════════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════════════ */
function useToast() {
  const [ts,setTs]=useState([]);
  const add=(msg,type="success")=>{const id=Date.now();setTs(p=>[...p,{id,msg,type}]);setTimeout(()=>setTs(p=>p.filter(x=>x.id!==id)),4200);};
  return{ts,add};
}
function Toasts({ts}) {
  const pal={success:["#dcfce7","#15803d","#86efac"],danger:["#fee2e2","#dc2626","#fca5a5"],info:["#e0f2fe","#0369a1","#7dd3fc"],warning:["#fef9c3","#a16207","#fde047"]};
  if(!ts.length)return null;
  return(<div style={{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:8,maxWidth:360,width:"calc(100vw - 48px)"}}>
    {ts.map(t=>{const[bg,cl,br]=pal[t.type]||pal.success;return(<div key={t.id} className="fu" style={{background:bg,border:`1px solid ${br}`,color:cl,padding:"12px 16px",fontSize:13,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,.15)"}}>{t.msg}</div>);})}
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   CONFIRM
   ═══════════════════════════════════════════════════════════ */
function Confirm({msg,ok,cancel,danger}) {
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&cancel()}>
    <div className="fu" style={{background:C.card,width:"100%",maxWidth:380,padding:24,boxShadow:"0 20px 60px rgba(0,0,0,.35)"}}>
      <div style={{display:"flex",gap:12,marginBottom:18}}><AlertTriangle size={20} color={danger?C.bad:C.warn} style={{flexShrink:0,marginTop:2}}/><p style={{fontSize:14,color:C.tx,margin:0,lineHeight:1.65}}>{msg}</p></div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button onClick={cancel} style={{background:"none",border:bdr(),padding:"7px 16px",fontSize:13,cursor:"pointer",color:C.sub,fontFamily:"inherit"}}>Cancelar</button>
        <button onClick={ok} style={{background:danger?C.bad:C.primary,color:"white",border:"none",padding:"7px 16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{danger?"Excluir":"Confirmar"}</button>
      </div>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   UI PRIMITIVES
   ═══════════════════════════════════════════════════════════ */
function Bdg({lb,tp="def"}) {
  const m={ok:{bg:"#dcfce7",c:"#15803d",b:"#86efac"},bad:{bg:"#fee2e2",c:"#dc2626",b:"#fca5a5"},warn:{bg:"#fef9c3",c:"#a16207",b:"#fde047"},info:{bg:"#e0f2fe",c:"#0369a1",b:"#7dd3fc"},gray:{bg:"#f1f5f9",c:"#475569",b:"#cbd5e1"},def:{bg:"#f1f5f9",c:"#475569",b:"#cbd5e1"}};
  const s=m[tp]||m.def;
  return<span style={{background:s.bg,color:s.c,border:`1px solid ${s.b}`,padding:"2px 7px",fontSize:10,fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",display:"inline-block",whiteSpace:"nowrap"}}>{lb}</span>;
}
function SBdg({v}) {
  const mp={"Disponível":"ok","Em uso":"info","Manutenção":"warn","Baixado":"gray","Ativo":"ok","Férias":"warn","Afastado":"bad","Em andamento":"info","Concluída":"ok","Cancelada":"bad","Agendada":"info","Em execução":"warn","Finalizada":"ok","Pendente":"warn","Pago":"ok","Em recurso":"info","Sinistrado":"bad","Leiloado":"gray"};
  return<Bdg lb={v} tp={mp[v]||"def"}/>;
}
function Kpi({lb,vl,sub,Ic,cor,top,delta}) {
  const cl=cor||C.primary;
  return(<div style={{background:C.card,border:bdr(),padding:"16px 18px",borderTop:`3px solid ${top||cl}`,minWidth:0}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
      <div style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",letterSpacing:".08em",lineHeight:1.3}}>{lb}</div>
      <div style={{width:34,height:34,background:`${cl}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic size={16} color={cl}/></div>
    </div>
    <div style={{fontSize:26,fontWeight:800,color:C.tx,lineHeight:1}}>{vl}</div>
    {sub&&<div style={{fontSize:11,color:C.mu,marginTop:4}}>{sub}</div>}
    {delta!=null&&<div style={{display:"flex",alignItems:"center",gap:3,fontSize:11,fontWeight:600,color:delta>=0?"#15803d":"#dc2626",marginTop:4}}>{delta>=0?<TrendingUp size={11}/>:<TrendingDown size={11}/>}{Math.abs(delta)}% vs mês anterior</div>}
  </div>);
}
const Th=({ch,st={}})=><th style={{padding:"9px 12px",textAlign:"left",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:".08em",color:C.mu,background:C.th,borderBottom:`2px solid ${C.bd}`,whiteSpace:"nowrap",...st}}>{ch}</th>;
const Td=({ch,st={}})=><td style={{padding:"10px 12px",color:C.sub,borderBottom:`1px solid ${C.bd}`,verticalAlign:"middle",fontSize:13,...st}}>{ch}</td>;
function Prog({v}) {return(<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:50,height:5,background:C.bd}}><div style={{width:`${v}%`,height:"100%",background:v<25?"#dc2626":v<50?"#f59e0b":C.primary}}/></div><span style={{fontSize:11,color:C.mu}}>{v}%</span></div>);}
function Modal({title,close,children,w=680}) {
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.52)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&close()}>
    <div className="fu" style={{background:C.card,width:"100%",maxWidth:w,maxHeight:"92vh",overflow:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.35)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 18px",borderBottom:bdr(),background:C.th,position:"sticky",top:0}}>
        <span style={{fontWeight:700,fontSize:14,color:C.tx}}>{title}</span>
        <button onClick={close} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:C.mu}}><X size={17}/></button>
      </div>
      <div style={{padding:18}}>{children}</div>
    </div>
  </div>);
}
function FF({lb,val,set,type="text",opts,req,span}) {
  const base={width:"100%",border:bdr(C.ibd),padding:"9px 10px",fontSize:13,fontFamily:"inherit"};
  return(<div style={span?{gridColumn:`span ${span}`,display:"flex",flexDirection:"column",gap:4}:{display:"flex",flexDirection:"column",gap:4}}>
    <label style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",letterSpacing:".07em"}}>{lb}{req&&<span style={{color:C.bad}}> *</span>}</label>
    {opts?<select value={val} onChange={e=>set(e.target.value)} style={base}><option value="">Selecionar...</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>:<input type={type} value={val} onChange={e=>set(e.target.value)} style={base}/>}
  </div>);
}
const BtnP=({ch,click,Ic,sm,bad,full,dis})=>(<button onClick={click} disabled={dis} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,background:dis?"#94a3b8":bad?C.bad:C.primary,color:"white",border:"none",padding:sm?"6px 11px":"9px 15px",fontSize:sm?11:13,fontWeight:600,cursor:dis?"not-allowed":"pointer",fontFamily:"inherit",width:full?"100%":undefined,flexShrink:0,transition:"background .15s"}}>{Ic&&<Ic size={sm?11:14}/>}{ch}</button>);
const BtnO=({ch,click,Ic,sm})=>(<button onClick={click} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",color:C.sub,border:bdr(),padding:sm?"6px 11px":"8px 13px",fontSize:sm?11:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>{Ic&&<Ic size={sm?11:14}/>}{ch}</button>);
function SecHdr({title,sub,action}) {return(<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:18,gap:12,flexWrap:"wrap"}}><div><h2 style={{fontSize:18,fontWeight:800,color:C.tx,margin:0}}>{title}</h2>{sub&&<p style={{fontSize:12,color:C.mu,margin:"3px 0 0"}}>{sub}</p>}</div>{action&&<div style={{flexShrink:0}}>{action}</div>}</div>);}
const DR=({l,v})=>(<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.bd}`,fontSize:13,gap:8}}><span style={{color:C.mu,fontSize:12,flexShrink:0}}>{l}</span><span style={{fontWeight:600,color:C.tx,textAlign:"right"}}>{v}</span></div>);

/* ═══════════════════════════════════════════════════════════
   VEHICLE MODAL
   ═══════════════════════════════════════════════════════════ */
function VehicleModal({v,save,close,toast}) {
  const blank={placa:"",marca:"Ford",modelo:"",ano:2024,cor:"Branco",tipo:"Passeio",cat:"Administrativo",sec:"Administração",comb:"Gasolina",sit:"Disponível",renavam:"",chassi:"",pat:"",km:"0",niv:"50",rev:"",seg:"",obs:"",mot:null,mul:0,custo:0,kmm:0};
  const [f,setF]=useState(v||blank);
  const u=k=>val=>setF(p=>({...p,[k]:val}));
  const go=()=>{if(!f.placa||!f.modelo){toast("Preencha Placa e Modelo.","danger");return;}save({...f,id:v?.id||`V${Date.now().toString().slice(-4)}`,km:+f.km||0,niv:+f.niv||50});toast(v?"Veículo atualizado com sucesso!":"Veículo cadastrado com sucesso!");close();};
  const secs=["Saúde","Obras","Educação","Administração","Assist. Social","Financeiro","Infraestrutura","Meio Ambiente"];
  return(<Modal title={v?`Editar Veículo — ${v.placa}`:"Cadastrar Novo Veículo"} close={close} w={760}>
    <p style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",margin:"0 0 10px",paddingBottom:8,borderBottom:bdr()}}>Identificação</p>
    <div className="g-f3"><FF lb="Placa" val={f.placa} set={u("placa")} req/><FF lb="RENAVAM" val={f.renavam} set={u("renavam")}/><FF lb="Nº Patrimônio" val={f.pat} set={u("pat")}/></div>
    <div className="g-f3"><FF lb="Chassi" val={f.chassi} set={u("chassi")} span={2}/><FF lb="Ano Fabricação" val={f.ano} set={u("ano")} type="number"/></div>
    <p style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",margin:"14px 0 10px",paddingBottom:8,borderBottom:bdr()}}>Características do Veículo</p>
    <div className="g-f3">
      <FF lb="Marca" val={f.marca} set={u("marca")} opts={["Ford","Chevrolet","Volkswagen","Fiat","Mercedes-Benz","Toyota","Renault","Hyundai","John Deere","New Holland","Marcopolo","Outro"]}/>
      <FF lb="Modelo / Versão" val={f.modelo} set={u("modelo")} req/>
      <FF lb="Cor Principal" val={f.cor} set={u("cor")}/>
      <FF lb="Tipo" val={f.tipo} set={u("tipo")} opts={["Passeio","Van","Picape","SUV","Ambulância","Ônibus Escolar","Ônibus","Trator","Retroescavadeira","Patrol","Caminhão","Utilitário","Moto"]}/>
      <FF lb="Categoria" val={f.cat} set={u("cat")} opts={["Administrativo","Serviço","Transporte","Emergência","Transp. Escolar","Máq. Pesada","Limpeza Urbana"]}/>
      <FF lb="Combustível" val={f.comb} set={u("comb")} opts={["Gasolina","Diesel S-10","Diesel Comum","Etanol","Flex","GNV","Elétrico"]}/>
    </div>
    <p style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",margin:"14px 0 10px",paddingBottom:8,borderBottom:bdr()}}>Controle Operacional</p>
    <div className="g-f3">
      <FF lb="Situação Atual" val={f.sit} set={u("sit")} opts={["Disponível","Em uso","Manutenção","Baixado","Leiloado","Sinistrado"]}/>
      <FF lb="Secretaria Responsável" val={f.sec} set={u("sec")} opts={secs}/>
      <FF lb="KM Atual (ou Horímetro)" val={f.km} set={u("km")} type="number"/>
      <FF lb="Nível Combustível (%)" val={f.niv} set={u("niv")} type="number"/>
      <FF lb="Data Próxima Revisão" val={f.rev} set={u("rev")}/>
      <FF lb="Validade Seguro" val={f.seg} set={u("seg")}/>
    </div>
    <div style={{marginBottom:16}}><FF lb="Observações / Pendências" val={f.obs} set={u("obs")}/></div>
    <div style={{display:"flex",gap:10,paddingTop:14,borderTop:bdr()}}><BtnP ch={v?"Salvar Alterações":"Cadastrar Veículo"} click={go} Ic={Save}/><BtnO ch="Cancelar" click={close}/></div>
  </Modal>);
}

/* ═══════════════════════════════════════════════════════════
   DRIVER MODAL
   ═══════════════════════════════════════════════════════════ */
function DriverModal({d,save,close,toast}) {
  const blank={nome:"",cpf:"",rg:"",mat:"",nasc:"",tel:"",email:"",sec:"Administração",cargo:"Motorista",cnh:"B",valCnh:"",sit:"Ativo",viagens:0,kmR:0,veiAtual:null};
  const [f,setF]=useState(d||blank);
  const u=k=>val=>setF(p=>({...p,[k]:val}));
  const go=()=>{if(!f.nome||!f.cpf){toast("Preencha Nome e CPF.","danger");return;}save({...f,id:d?.id||`M${Date.now().toString().slice(-4)}`});toast(d?"Motorista atualizado!":"Motorista cadastrado!");close();};
  return(<Modal title={d?`Editar — ${d.nome}`:"Cadastrar Motorista / Operador"} close={close} w={700}>
    <p style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",margin:"0 0 10px",paddingBottom:8,borderBottom:bdr()}}>Dados Pessoais</p>
    <div className="g-f3"><FF lb="Nome Completo" val={f.nome} set={u("nome")} req span={3}/></div>
    <div className="g-f3"><FF lb="CPF" val={f.cpf} set={u("cpf")} req/><FF lb="RG" val={f.rg} set={u("rg")}/><FF lb="Data de Nascimento" val={f.nasc} set={u("nasc")}/></div>
    <div className="g-f2"><FF lb="Telefone / WhatsApp" val={f.tel} set={u("tel")}/><FF lb="E-mail institucional" val={f.email} set={u("email")} type="email"/></div>
    <p style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",margin:"14px 0 10px",paddingBottom:8,borderBottom:bdr()}}>Dados Profissionais</p>
    <div className="g-f3">
      <FF lb="Matrícula Funcional" val={f.mat} set={u("mat")}/>
      <FF lb="Secretaria" val={f.sec} set={u("sec")} opts={["Saúde","Obras","Educação","Administração","Assist. Social","Financeiro"]}/>
      <FF lb="Cargo / Função" val={f.cargo} set={u("cargo")} opts={["Motorista","Mot. de Ambulância","Mot. Escolar","Operador de Máq.","Operador de Patrol","Auxiliar de Frota"]}/>
      <FF lb="Categoria CNH" val={f.cnh} set={u("cnh")} opts={["A","B","C","D","E","AB","AC","AD","AE"]}/>
      <FF lb="Validade da CNH" val={f.valCnh} set={u("valCnh")}/>
      <FF lb="Situação" val={f.sit} set={u("sit")} opts={["Ativo","Férias","Afastado","Licença Médica","Suspensão"]}/>
    </div>
    <div style={{display:"flex",gap:10,paddingTop:14,borderTop:bdr()}}><BtnP ch={d?"Salvar Alterações":"Cadastrar"} click={go} Ic={Save}/><BtnO ch="Cancelar" click={close}/></div>
  </Modal>);
}

/* ═══════════════════════════════════════════════════════════
   PAGE: LOGIN
   ═══════════════════════════════════════════════════════════ */
function Login({onLogin}) {
  const [step,setStep]=useState("in");
  const [id,setId]=useState("admin@upanema.rn.gov.br");
  const [pw,setPw]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [fEmail,setFEmail]=useState("");
  const [fSent,setFSent]=useState(false);

  const go=()=>{
    if(!id||!pw){setErr("Preencha e-mail e senha.");return;}
    setLoading(true);setErr("");
    setTimeout(()=>{
      const u=SISTEMA_USUARIOS.find(x=>x.email===id&&x.pw===pw);
      if(u){if(!u.ativo){setErr("Conta inativa. Contate o administrador.");setLoading(false);return;}onLogin(u);}
      else setErr("E-mail ou senha incorretos. Verifique suas credenciais.");
      setLoading(false);
    },900);
  };
  const inp={width:"100%",border:"1px solid #d1d5db",padding:"10px 12px",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",transition:"border-color .15s"};
  const demos=[["admin@upanema.rn.gov.br","admin123","Administrador Geral"],["gestor@upanema.rn.gov.br","gestor123","Gestor da Garagem"],["motorista@upanema.rn.gov.br","motor123","Motorista"]];

  return(<div style={{minHeight:"100vh",background:"linear-gradient(140deg,#0c1a47 0%,#1d4ed8 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{display:"flex",width:"100%",maxWidth:900,background:"white",boxShadow:"0 28px 80px rgba(0,0,0,.4)",flexWrap:"wrap"}}>
      <div style={{flex:"1 1 280px",background:"#0c1a47",padding:"44px 36px",display:"flex",flexDirection:"column",justifyContent:"space-between",minHeight:420}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32}}>
            <div style={{width:46,height:46,background:"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Truck size={22} color="white"/></div>
            <div><div style={{fontSize:9,fontWeight:700,color:"#60a5fa",letterSpacing:".14em",textTransform:"uppercase"}}>Prefeitura de Upanema — RN</div><div style={{fontSize:16,fontWeight:800,color:"white",lineHeight:1.2}}>SGA · Frota Municipal</div></div>
          </div>
          <h1 style={{fontSize:26,fontWeight:800,color:"white",lineHeight:1.25,margin:"0 0 14px"}}>Sistema de<br/>Gestão da Garagem</h1>
          <p style={{color:"rgba(203,213,225,.6)",fontSize:13,lineHeight:1.7,margin:0}}>Controle completo da frota pública: veículos, motoristas, abastecimentos, manutenções e custos operacionais.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:11,marginTop:28}}>
          {[["Frota Completa","12 veículos + máquinas pesadas"],["Controle em Tempo Real","Check-in, retorno e viagens"],["Indicadores e Relatórios","KPIs, custo/km e análise financeira"]].map(([t,s])=>(
            <div key={t} style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:5,height:5,background:"#60a5fa",flexShrink:0}}/><span style={{color:"white",fontSize:13,fontWeight:600}}>{t}</span><span style={{color:"rgba(203,213,225,.45)",fontSize:12}}>— {s}</span></div>
          ))}
        </div>
      </div>
      <div style={{flex:"1 1 280px",padding:"44px 36px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
        {step==="in"?(
          <>
            <div style={{marginBottom:28}}><h2 style={{fontSize:21,fontWeight:800,color:"#0f172a",margin:"0 0 4px"}}>Acesso ao Sistema</h2><p style={{fontSize:13,color:"#64748b",margin:0}}>Use suas credenciais institucionais</p></div>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div><label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>E-mail Institucional</label><input value={id} onChange={e=>setId(e.target.value)} placeholder="nome@upanema.rn.gov.br" style={inp}/></div>
              <div><label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Senha</label>
                <div style={{position:"relative"}}><input type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} style={{...inp,paddingRight:38}} placeholder="••••••••"/>
                  <button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#64748b",padding:4}}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                </div>
              </div>
              {err&&<div style={{background:"#fee2e2",border:"1px solid #fca5a5",color:"#dc2626",padding:"9px 12px",fontSize:13,display:"flex",alignItems:"center",gap:8}}><AlertCircle size={14}/>{err}</div>}
              <button onClick={go} disabled={loading} style={{background:loading?"#94a3b8":"#0c1a47",color:"white",border:"none",padding:"12px",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",textTransform:"uppercase",letterSpacing:".08em",fontFamily:"inherit"}}>{loading?"Verificando...":"Entrar no Sistema"}</button>
              <button onClick={()=>setStep("forgot")} style={{background:"none",border:"none",fontSize:12,color:"#1d4ed8",cursor:"pointer",textAlign:"left",fontFamily:"inherit",padding:0}}>Esqueceu a senha?</button>
            </div>
            <div style={{marginTop:22,padding:"12px 14px",background:"#f8fafc",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#0c1a47",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Acessos de Demonstração</div>
              {demos.map(([e,p,r])=>(<div key={e} onClick={()=>{setId(e);setPw(p);}} style={{padding:"5px 0",cursor:"pointer",borderBottom:"1px solid #f0f4f8"}}>
                <div style={{fontSize:12,color:"#374151",fontWeight:600}}>{r}</div>
                <div style={{fontSize:11,color:"#64748b"}}>{e} · <strong>senha: {p}</strong></div>
              </div>))}
              <div style={{fontSize:10,color:"#94a3b8",marginTop:6}}>Clique em qualquer conta acima para preencher automaticamente.</div>
            </div>
          </>
        ):(
          <>
            <button onClick={()=>{setStep("in");setFSent(false);}} style={{background:"none",border:"none",fontSize:12,color:"#1d4ed8",cursor:"pointer",textAlign:"left",fontFamily:"inherit",marginBottom:22,padding:0}}>← Voltar ao login</button>
            <h2 style={{fontSize:20,fontWeight:800,color:"#0f172a",margin:"0 0 8px"}}>Recuperar Senha</h2>
            <p style={{fontSize:13,color:"#64748b",marginBottom:22}}>Informe seu e-mail institucional para receber as instruções de redefinição.</p>
            {!fSent?(<><label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>E-mail Institucional</label><input value={fEmail} onChange={e=>setFEmail(e.target.value)} placeholder="nome@upanema.rn.gov.br" style={{...inp,marginBottom:12}}/><button onClick={()=>setTimeout(()=>setFSent(true),700)} style={{background:"#0c1a47",color:"white",border:"none",padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>Enviar Instruções de Recuperação</button></>)
            :<div style={{background:"#dcfce7",border:"1px solid #86efac",padding:"16px",color:"#15803d",fontSize:13,lineHeight:1.6}}><strong>✓ E-mail enviado com sucesso!</strong><br/>Verifique a caixa de entrada do e-mail <strong>{fEmail}</strong> para as instruções de recuperação.</div>}
          </>
        )}
        <p style={{fontSize:10,color:"#94a3b8",textAlign:"center",marginTop:22}}>© 2025 Prefeitura Municipal de Upanema — RN<br/>SGA Frota Municipal v4.0</p>
      </div>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   PAGE: DASHBOARD
   ═══════════════════════════════════════════════════════════ */
function Dashboard({nav,vehicles,drivers,toast}) {
  const disp=vehicles.filter(v=>v.sit==="Disponível").length;
  const uso=vehicles.filter(v=>v.sit==="Em uso").length;
  const man=vehicles.filter(v=>v.sit==="Manutenção").length;
  const gTotal=CH_G[CH_G.length-1].c+CH_G[CH_G.length-1].m;
  return(<div>
    <div className="g-kpi">
      <Kpi lb="Total da Frota" vl={vehicles.length} sub="Veículos cadastrados" Ic={Car} top="#1d4ed8"/>
      <Kpi lb="Disponíveis" vl={disp} sub="Prontos para uso agora" Ic={CheckCircle} cor={C.ok} top="#16a34a"/>
      <Kpi lb="Em Circulação" vl={uso} sub="Viagens ativas" Ic={Activity} cor={C.info} top="#0284c7"/>
      <Kpi lb="Em Manutenção" vl={man} sub="Ordens de serviço abertas" Ic={Wrench} cor={C.warn} top="#d97706"/>
      <Kpi lb="Gastos em Junho" vl={`R$ ${gTotal.toLocaleString("pt-BR",{minimumFractionDigits:2})}`} sub="Combustível + Manutenção" Ic={DollarSign} delta={+4} top="#1d4ed8"/>
      <Kpi lb="Motoristas Ativos" vl={drivers.filter(d=>d.sit==="Ativo").length} sub={`${drivers.length} cadastrados no total`} Ic={Users} top="#1d4ed8"/>
      <Kpi lb="Viagens em Junho" vl={56} sub="Acumulado mensal" Ic={MapPin} top="#1d4ed8"/>
      <Kpi lb="Alertas Ativos" vl={AL0.length} sub={`${AL0.filter(a=>a.nivel==="danger").length} crítico(s)`} Ic={Bell} cor={C.bad} top="#dc2626"/>
    </div>
    <div className="g-dash">
      <div style={{background:C.card,border:bdr(),padding:"18px 18px 12px"}}>
        <div style={{fontSize:14,fontWeight:700,color:C.tx,marginBottom:1}}>Gastos Mensais — 2025</div>
        <div style={{fontSize:11,color:C.mu,marginBottom:14}}>Combustível + Manutenção (R$)</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CH_G} barGap={3}><CartesianGrid strokeDasharray="3 3" stroke={C.bd}/><XAxis dataKey="mes" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v=>`${v/1000}k`}/><Tooltip formatter={v=>`R$ ${Number(v).toLocaleString("pt-BR",{minimumFractionDigits:2})}`}/><Legend iconSize={10} wrapperStyle={{fontSize:11}}/><Bar dataKey="c" name="Combustível" fill="#1d4ed8"/><Bar dataKey="m" name="Manutenção" fill="#93c5fd"/></BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:C.card,border:bdr(),padding:18}}>
        <div style={{fontSize:14,fontWeight:700,color:C.tx,marginBottom:1}}>Gastos por Secretaria</div>
        <div style={{fontSize:11,color:C.mu,marginBottom:10}}>Acumulado 2025</div>
        <ResponsiveContainer width="100%" height={130}>
          <PieChart><Pie data={CH_S} dataKey="v" cx="50%" cy="50%" outerRadius={55} innerRadius={26}>{CH_S.map((e,i)=><Cell key={i} fill={e.cor}/>)}</Pie><Tooltip formatter={v=>`R$ ${Number(v).toLocaleString("pt-BR")}`}/></PieChart>
        </ResponsiveContainer>
        <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:8}}>
          {CH_S.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}><div style={{width:9,height:9,background:s.cor,flexShrink:0}}/><span style={{color:C.sub,flexGrow:1}}>{s.name}</span><span style={{fontWeight:600,color:C.tx}}>R$ {s.v.toLocaleString("pt-BR")}</span></div>))}
        </div>
      </div>
    </div>
    <div className="g-2">
      <div style={{background:C.card,border:bdr(),padding:"18px 18px 12px"}}>
        <div style={{fontSize:14,fontWeight:700,color:C.tx,marginBottom:1}}>Viagens por Semana</div>
        <div style={{fontSize:11,color:C.mu,marginBottom:14}}>Últimas 6 semanas</div>
        <ResponsiveContainer width="100%" height={145}>
          <AreaChart data={CH_V}><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="10%" stopColor="#1d4ed8" stopOpacity={.15}/><stop offset="90%" stopColor="#1d4ed8" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={C.bd}/><XAxis dataKey="s" tick={{fontSize:10}}/><YAxis tick={{fontSize:11}}/><Tooltip/><Area type="monotone" dataKey="v" name="Viagens" stroke="#1d4ed8" strokeWidth={2} fill="url(#ag)"/></AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:C.card,border:bdr(),padding:"18px 18px 12px"}}>
        <div style={{fontSize:14,fontWeight:700,color:C.tx,marginBottom:1}}>Consumo Médio (km/L)</div>
        <div style={{fontSize:11,color:C.mu,marginBottom:14}}>Por veículo — últimos 3 meses</div>
        <ResponsiveContainer width="100%" height={145}>
          <BarChart data={CH_K} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={C.bd}/><XAxis type="number" tick={{fontSize:10}} domain={[0,14]}/><YAxis type="category" dataKey="p" tick={{fontSize:10}} width={78}/><Tooltip formatter={v=>`${v} km/L`}/><Bar dataKey="v" name="km/L" fill="#0c1a47"/></BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="g-dash" style={{marginBottom:0}}>
      <div style={{background:C.card,border:bdr()}}>
        <div style={{padding:"12px 16px",borderBottom:bdr(),display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:14,color:C.tx}}>Viagens Recentes</span><button onClick={()=>nav("trips")} style={{fontSize:12,color:C.primary,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Ver todas →</button></div>
        <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr><Th ch="Código"/><Th ch="Motorista"/><Th ch="Destino"/><Th ch="Status"/></tr></thead>
          <tbody>{T0.slice(0,5).map((t,i)=>(<tr key={i} style={{background:i%2===0?C.ra:C.card}}><Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:C.mu}}>{t.id}</span>}/><Td ch={<span style={{fontWeight:500}}>{t.mot}</span>}/><Td ch={<span style={{fontSize:12,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{t.dest}</span>}/><Td ch={<SBdg v={t.sit}/>}/></tr>))}</tbody>
        </table></div>
      </div>
      <div style={{background:C.card,border:bdr()}}>
        <div style={{padding:"12px 16px",borderBottom:bdr(),display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:14,color:C.tx}}>Alertas Críticos</span><button onClick={()=>nav("alerts")} style={{fontSize:12,color:C.primary,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Ver todos →</button></div>
        {AL0.slice(0,5).map((a,i)=>(<div key={i} style={{display:"flex",gap:10,padding:"9px 14px",borderBottom:bdr()}}><div style={{flexShrink:0,marginTop:2}}>{a.nivel==="danger"?<AlertCircle size={13} color="#dc2626"/>:a.nivel==="warning"?<AlertCircle size={13} color="#d97706"/>:<Bell size={13} color="#0284c7"/>}</div><div><div style={{fontSize:12,fontWeight:600,color:C.tx}}>{a.titulo}</div><div style={{fontSize:11,color:C.mu,lineHeight:1.45}}>{a.desc}</div></div></div>))}
      </div>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   PAGE: VEHICLES
   ═══════════════════════════════════════════════════════════ */
function Vehicles({vehicles,setVehicles,toast}) {
  const [tab,setTab]=useState("Todos");
  const [srch,setSrch]=useState("");
  const [sel,setSel]=useState(null);
  const [modal,setModal]=useState(null);
  const [cfm,setCfm]=useState(null);
  const tabs=["Todos","Disponível","Em uso","Manutenção","Baixado"];
  const filtered=vehicles.filter(v=>(tab==="Todos"||v.sit===tab)&&(!srch||[v.placa,v.modelo,v.mot||""].some(x=>x.toLowerCase().includes(srch.toLowerCase()))));
  const saveV=v=>{if(modal?.id)setVehicles(p=>p.map(x=>x.id===v.id?v:x));else setVehicles(p=>[v,...p]);};
  const delV=v=>setCfm({msg:`Tem certeza que deseja excluir o veículo ${v.placa} — ${v.modelo}? Esta ação não pode ser desfeita.`,ok:()=>{setVehicles(p=>p.filter(x=>x.id!==v.id));toast("Veículo excluído.","danger");setCfm(null);}});
  return(<div>
    <SecHdr title="Gestão de Veículos" sub={`${vehicles.length} veículos na frota municipal de Upanema`} action={<BtnP ch="+ Cadastrar Veículo" click={()=>setModal("add")} Ic={Plus}/>}/>
    <div className="g-kpi" style={{marginBottom:14}}>
      <Kpi lb="Total" vl={vehicles.length} Ic={Car} top="#1d4ed8"/>
      <Kpi lb="Disponíveis" vl={vehicles.filter(v=>v.sit==="Disponível").length} Ic={CheckCircle} cor={C.ok} top="#16a34a"/>
      <Kpi lb="Em Uso" vl={vehicles.filter(v=>v.sit==="Em uso").length} Ic={Activity} cor={C.info} top="#0284c7"/>
      <Kpi lb="Manutenção" vl={vehicles.filter(v=>v.sit==="Manutenção").length} Ic={Wrench} cor={C.warn} top="#d97706"/>
      <Kpi lb="Baixados" vl={vehicles.filter(v=>v.sit==="Baixado").length} Ic={AlertOctagon} cor={C.mu} top="#94a3b8"/>
    </div>
    <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
      <div style={{flex:"1 1 180px",position:"relative",minWidth:160}}><Search size={14} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.mu}}/><input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Pesquisar placa, modelo ou motorista..." style={{width:"100%",border:bdr(C.ibd),padding:"9px 12px 9px 32px",fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/></div>
      <BtnO ch="Exportar" click={()=>{toast("Gerando relatório de frota...","info");setTimeout(()=>toast("Relatório exportado!"),2000);}} Ic={Download}/>
    </div>
    <div style={{display:"flex",borderBottom:`2px solid ${C.bd}`,marginBottom:12,overflowX:"auto"}}>
      {tabs.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"8px 14px",fontSize:12,fontWeight:600,background:"none",border:"none",borderBottom:tab===t?`2px solid ${C.primary}`:"2px solid transparent",color:tab===t?C.primary:C.mu,cursor:"pointer",marginBottom:-2,fontFamily:"inherit",whiteSpace:"nowrap"}}>{t} ({t==="Todos"?vehicles.length:vehicles.filter(v=>v.sit===t).length})</button>)}
    </div>
    <div className="tbl" style={{background:C.card,border:bdr()}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Placa"/><Th ch="Veículo"/><Th ch="Secretaria"/><Th ch="KM Atual"/><Th ch="Combustível"/><Th ch="Prox. Revisão"/><Th ch="Custo/Mês"/><Th ch="Status"/><Th ch=""/></tr></thead>
        <tbody>{filtered.map((v,i)=>(<tr key={v.id} className="hr" style={{background:i%2===0?C.ra:C.card}}>
          <Td ch={<span style={{fontWeight:700,color:"#0c1a47",letterSpacing:".04em"}}>{v.placa}</span>}/>
          <Td ch={<div><div style={{fontWeight:600}}>{v.modelo}</div><div style={{fontSize:11,color:C.mu}}>{v.marca} · {v.ano} · {v.tipo}</div></div>}/>
          <Td ch={<div><div style={{fontSize:12}}>{v.sec}</div><div style={{fontSize:10,color:C.mu}}>{v.pat}</div></div>}/>
          <Td ch={<span style={{fontWeight:500,whiteSpace:"nowrap"}}>{v.km>0?v.km.toLocaleString("pt-BR")+" km":"Horímetro"}</span>}/>
          <Td ch={<Prog v={v.niv}/>}/>
          <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{v.rev}</span>}/>
          <Td ch={<span style={{fontWeight:600,color:v.custo>900?C.bad:C.tx,whiteSpace:"nowrap"}}>R$ {v.custo.toFixed(2)}</span>}/>
          <Td ch={<SBdg v={v.sit}/>}/>
          <Td ch={<div style={{display:"flex",gap:4}}>
            <button onClick={()=>setSel(v)} style={{background:"none",border:bdr(),padding:"3px 7px",cursor:"pointer",fontSize:11,color:C.info,fontFamily:"inherit",fontWeight:600}}>Ver</button>
            <button onClick={()=>setModal(v)} style={{background:"none",border:bdr(),padding:"3px 7px",cursor:"pointer",fontSize:11,color:C.primary,fontFamily:"inherit"}}><Edit size={11}/></button>
            <button onClick={()=>delV(v)} style={{background:"none",border:"none",padding:"3px",cursor:"pointer",color:C.bad}}><Trash2 size={13}/></button>
          </div>}/>
        </tr>))}{filtered.length===0&&<tr><td colSpan={9} style={{padding:"40px",textAlign:"center",color:C.mu,fontSize:13}}><Car size={32} color={C.bd} style={{display:"block",margin:"0 auto 8px"}}/> Nenhum veículo encontrado com os filtros aplicados.</td></tr>}</tbody>
      </table>
    </div>
    {sel&&<Modal title={`${sel.placa} — ${sel.modelo}`} close={()=>setSel(null)} w={760}>
      <div className="g-2">
        <div><p style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:bdr()}}>Dados Técnicos</p>{[["Placa",sel.placa],["RENAVAM",sel.renavam],["Chassi",sel.chassi],["Marca / Modelo",`${sel.marca} ${sel.modelo}`],["Ano / Cor",`${sel.ano} · ${sel.cor}`],["Tipo",`${sel.tipo} — ${sel.cat}`],["Combustível",sel.comb]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div>
        <div><p style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:bdr()}}>Situação Operacional</p>{[["Secretaria",sel.sec],["Patrimônio",sel.pat],["Motorista Atual",sel.mot||"— (sem motorista)"],["KM Atual",sel.km>0?sel.km.toLocaleString("pt-BR")+" km":"Horímetro"],["Nível Combustível",sel.niv+"%"],["Próx. Revisão",sel.rev],["Val. Seguro",sel.seg],["Multas Ativas",sel.mul+" multa(s)"],["Custo neste Mês","R$ "+sel.custo.toFixed(2)],["KM Rodados (Mês)",sel.kmm.toLocaleString("pt-BR")+" km"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div>
      </div>
      {sel.obs&&<div style={{background:C.ra,border:bdr(),padding:"10px 14px",marginTop:14}}><p style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",margin:"0 0 4px"}}>Observações / Pendências</p><p style={{fontSize:13,color:C.sub,margin:0}}>{sel.obs}</p></div>}
      <div style={{display:"flex",gap:10,marginTop:14,paddingTop:12,borderTop:bdr()}}><BtnP ch="Editar Veículo" click={()=>{setModal(sel);setSel(null);}} Ic={Edit}/><BtnO ch="Fechar" click={()=>setSel(null)}/></div>
    </Modal>}
    {(modal==="add"||modal?.id)&&<VehicleModal v={modal==="add"?null:modal} save={saveV} close={()=>setModal(null)} toast={toast}/>}
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   PAGE: DRIVERS
   ═══════════════════════════════════════════════════════════ */
function Drivers({drivers,setDrivers,toast}) {
  const [srch,setSrch]=useState("");
  const [sel,setSel]=useState(null);
  const [modal,setModal]=useState(null);
  const [cfm,setCfm]=useState(null);
  const today=new Date("2025-06-08");
  const dias=d=>{try{const[dd,mm,aa]=d.valCnh.split("/");return Math.round((new Date(`${aa}-${mm}-${dd}`)-today)/86400000);}catch{return 999;}};
  const filtered=drivers.filter(d=>!srch||[d.nome,d.mat,d.cpf].some(x=>x.toLowerCase().includes(srch.toLowerCase())));
  const saveD=d=>{if(modal?.id)setDrivers(p=>p.map(x=>x.id===d.id?d:x));else setDrivers(p=>[d,...p]);};
  const delD=d=>setCfm({msg:`Excluir o motorista ${d.nome} (${d.mat})?`,ok:()=>{setDrivers(p=>p.filter(x=>x.id!==d.id));toast("Motorista excluído.","danger");setCfm(null);}});
  return(<div>
    <SecHdr title="Motoristas e Operadores" sub={`${drivers.length} profissionais cadastrados na frota`} action={<BtnP ch="+ Cadastrar Motorista" click={()=>setModal("add")} Ic={Plus}/>}/>
    <div className="g-kpi" style={{marginBottom:14}}>
      <Kpi lb="Ativos" vl={drivers.filter(d=>d.sit==="Ativo").length} Ic={CheckCircle} cor={C.ok} top="#16a34a"/>
      <Kpi lb="Férias / Afastados" vl={drivers.filter(d=>d.sit!=="Ativo").length} Ic={Calendar} cor={C.warn} top="#d97706"/>
      <Kpi lb="CNH Vencendo (90d)" vl={drivers.filter(d=>dias(d)<90).length} sub="Requerem atenção" Ic={AlertCircle} cor={C.bad} top="#dc2626"/>
      <Kpi lb="Total de Viagens" vl={drivers.reduce((a,d)=>a+d.viagens,0)} sub="Acumulado 2025" Ic={MapPin} top="#1d4ed8"/>
      <Kpi lb="KM Rodados" vl={`${(drivers.reduce((a,d)=>a+d.kmR,0)/1000).toFixed(1)}k`} sub="Acumulado total" Ic={Activity} top="#1d4ed8"/>
    </div>
    <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
      <div style={{flex:"1 1 180px",position:"relative",minWidth:160}}><Search size={14} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.mu}}/><input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Pesquisar nome, CPF ou matrícula..." style={{width:"100%",border:bdr(C.ibd),padding:"9px 12px 9px 32px",fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/></div>
      <BtnO ch="Exportar" click={()=>{toast("Exportando motoristas...","info");setTimeout(()=>toast("Exportado com sucesso!"),1800);}} Ic={Download}/>
    </div>
    <div className="tbl" style={{background:C.card,border:bdr()}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Matrícula"/><Th ch="Nome / Cargo"/><Th ch="Secretaria"/><Th ch="Cat. CNH"/><Th ch="Validade CNH"/><Th ch="Veículo Atual"/><Th ch="Viagens"/><Th ch="KM Total"/><Th ch="Status"/><Th ch=""/></tr></thead>
        <tbody>{filtered.map((d,i)=>{const dv=dias(d);const w=dv<90;return(<tr key={d.id} className="hr" style={{background:i%2===0?C.ra:C.card}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:C.mu}}>{d.mat}</span>}/>
          <Td ch={<div><div style={{fontWeight:600}}>{d.nome}</div><div style={{fontSize:11,color:C.mu}}>{d.cargo}</div></div>}/>
          <Td ch={<span style={{fontSize:12}}>{d.sec}</span>}/>
          <Td ch={<span style={{fontWeight:700,color:C.primary}}>Cat. {d.cnh}</span>}/>
          <Td ch={<div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:12,color:w?"#dc2626":"inherit",fontWeight:w?700:400}}>{d.valCnh}</span>{w&&<span style={{fontSize:9,background:"#fee2e2",color:"#dc2626",padding:"1px 5px",fontWeight:700,whiteSpace:"nowrap"}}>⚠ {dv}d</span>}</div>}/>
          <Td ch={<span style={{fontSize:12,color:d.veiAtual?C.primary:C.mu,fontWeight:d.veiAtual?600:400}}>{d.veiAtual||"—"}</span>}/>
          <Td ch={<span style={{fontWeight:600,textAlign:"center",display:"block"}}>{d.viagens}</span>}/>
          <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{d.kmR.toLocaleString("pt-BR")} km</span>}/>
          <Td ch={<SBdg v={d.sit}/>}/>
          <Td ch={<div style={{display:"flex",gap:4}}>
            <button onClick={()=>setSel(d)} style={{background:"none",border:bdr(),padding:"3px 7px",cursor:"pointer",fontSize:11,color:C.info,fontFamily:"inherit",fontWeight:600}}>Ver</button>
            <button onClick={()=>setModal(d)} style={{background:"none",border:bdr(),padding:"3px 7px",cursor:"pointer",fontSize:11,color:C.primary,fontFamily:"inherit"}}><Edit size={11}/></button>
            <button onClick={()=>delD(d)} style={{background:"none",border:"none",padding:"3px",cursor:"pointer",color:C.bad}}><Trash2 size={13}/></button>
          </div>}/>
        </tr>);})}{filtered.length===0&&<tr><td colSpan={10} style={{padding:"40px",textAlign:"center",color:C.mu,fontSize:13}}><Users size={32} color={C.bd} style={{display:"block",margin:"0 auto 8px"}}/>Nenhum motorista encontrado.</td></tr>}</tbody>
      </table>
    </div>
    {sel&&<Modal title={`${sel.nome} — ${sel.mat}`} close={()=>setSel(null)}>
      <div className="g-2">
        <div><p style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:bdr()}}>Dados Pessoais</p>{[["Nome",sel.nome],["CPF",sel.cpf],["RG",sel.rg],["Matrícula",sel.mat],["Nascimento",sel.nasc],["Telefone",sel.tel],["E-mail",sel.email]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div>
        <div><p style={{fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:bdr()}}>Dados Profissionais</p>{[["Secretaria",sel.sec],["Cargo",sel.cargo],["Categoria CNH","Cat. "+sel.cnh],["Validade CNH",sel.valCnh],["Situação",sel.sit],["Veículo Atual",sel.veiAtual||"—"],["Total Viagens",sel.viagens+" viagens"],["KM Rodados",sel.kmR.toLocaleString("pt-BR")+" km"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:14,paddingTop:12,borderTop:bdr()}}><BtnP ch="Editar" click={()=>{setModal(sel);setSel(null);}} Ic={Edit}/><BtnO ch="Fechar" click={()=>setSel(null)}/></div>
    </Modal>}
    {(modal==="add"||modal?.id)&&<DriverModal d={modal==="add"?null:modal} save={saveD} close={()=>setModal(null)} toast={toast}/>}
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   PAGES: TRIPS, FUEL, MAINTENANCE, FINANCIAL, REPORTS, FINES, CHECKLIST, AUDIT, ALERTS, SUPPLIERS, SETTINGS
   ═══════════════════════════════════════════════════════════ */
function Trips({vehicles,drivers,trips,setTrips,toast}) {
  const [view,setView]=useState("lista");
  const [f,setF]=useState({placa:"",mot:"",dest:"",fin:"",sec:"",kmi:"",pass:"1"});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const confirmar=()=>{
    if(!f.placa||!f.mot||!f.dest){toast("Preencha veículo, motorista e destino.","danger");return;}
    const id=`VGM-2025-0${String(trips.length+241).padStart(4,"0")}`;
    const now=new Date();const ts=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`;
    const vv=vehicles.find(v=>v.placa===f.placa);
    setTrips([{id,placa:f.placa,mod:vv?.modelo||"",mot:f.mot,dest:f.dest,kmi:+f.kmi||null,kmf:null,saida:ts,ret:null,fin:f.fin||"Serviço",sec:f.sec||"—",sit:"Em andamento",pass:+f.pass||1,custo:null},...trips]);
    setF({placa:"",mot:"",dest:"",fin:"",sec:"",kmi:"",pass:"1"});setView("lista");toast("Saída registrada!");
  };
  const retornar=id=>{setTrips(trips.map(t=>t.id===id?{...t,sit:"Concluída",ret:new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}),kmf:t.kmi?t.kmi+Math.floor(Math.random()*200+50):null}:t));toast("Retorno registrado!");};
  const ea=trips.filter(t=>t.sit==="Em andamento");
  return(<div>
    <SecHdr title="Controle de Viagens" sub={`${trips.length} registros — ${ea.length} em andamento agora`} action={<div style={{display:"flex",gap:8}}><BtnO ch="Lista" click={()=>setView("lista")} sm/><BtnP ch="+ Registrar Saída" click={()=>setView(view==="checkin"?"lista":"checkin")}/></div>}/>
    {ea.length>0&&<div style={{background:"#e0f2fe",border:"1px solid #7dd3fc",padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span className="blink" style={{width:8,height:8,background:"#0284c7",borderRadius:"50%",display:"inline-block"}}/><span style={{fontSize:13,fontWeight:600,color:"#0369a1"}}>{ea.length} viagem(ns) em andamento</span><span style={{fontSize:13,color:"#0369a1"}}>— {ea.map(t=>t.placa).join(", ")}</span></div>}
    {view==="checkin"&&<div style={{background:C.card,border:bdr(),borderTop:`3px solid ${C.primary}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:C.tx,margin:"0 0 14px",paddingBottom:10,borderBottom:bdr()}}>Registrar Nova Saída de Veículo</p>
      <div className="g-f3"><FF lb="Veículo Disponível" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit==="Disponível").map(v=>`${v.placa} — ${v.modelo}`).map(s=>s.split(" — ")[0])} req/><FF lb="Motorista" val={f.mot} set={u("mot")} opts={drivers.filter(d=>d.sit==="Ativo").map(d=>d.nome)} req/><FF lb="KM Inicial" val={f.kmi} set={u("kmi")} type="number"/></div>
      <div className="g-f3"><FF lb="Destino / Endereço" val={f.dest} set={u("dest")} req/><FF lb="Finalidade" val={f.fin} set={u("fin")} opts={["Transporte de Pacientes","Serviço de Obras","Transporte Escolar","Emergência Médica","Viagem Administrativa","Entrega de Materiais","Terraplanagem","Outros"]}/><FF lb="Secretaria Solicitante" val={f.sec} set={u("sec")} opts={["Saúde","Obras","Educação","Administração","Assist. Social","Financeiro"]}/></div>
      <div style={{display:"flex",gap:10}}><BtnP ch="Confirmar Saída" click={confirmar} Ic={Check}/><BtnO ch="Cancelar" click={()=>setView("lista")}/></div>
    </div>}
    <div className="tbl" style={{background:C.card,border:bdr()}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Destino"/><Th ch="Saída"/><Th ch="Retorno"/><Th ch="Sec."/><Th ch="Status"/><Th ch="Ação"/></tr></thead>
        <tbody>{trips.map((t,i)=>(<tr key={t.id} className="hr" style={{background:i%2===0?C.ra:C.card}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:C.mu}}>{t.id}</span>}/>
          <Td ch={<div><div style={{fontWeight:600,fontSize:12}}>{t.placa}</div><div style={{fontSize:11,color:C.mu}}>{t.mod}</div></div>}/>
          <Td ch={<span style={{fontWeight:500}}>{t.mot}</span>}/>
          <Td ch={<span style={{fontSize:12,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{t.dest}</span>}/>
          <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{t.saida}</span>}/>
          <Td ch={<span style={{fontSize:12,color:t.ret?C.sub:C.mu,whiteSpace:"nowrap"}}>{t.ret||"—"}</span>}/>
          <Td ch={<span style={{fontSize:11,color:C.mu}}>{t.sec}</span>}/>
          <Td ch={<SBdg v={t.sit}/>}/>
          <Td ch={t.sit==="Em andamento"?<button onClick={()=>retornar(t.id)} style={{background:C.ok,color:"white",border:"none",padding:"4px 9px",fontSize:11,cursor:"pointer",fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap"}}>Registrar Retorno</button>:<span style={{fontSize:11,color:C.mu}}>—</span>}/>
        </tr>))}</tbody>
      </table>
    </div>
  </div>);
}

function FuelPage({vehicles,drivers,fuel,setFuel,toast}) {
  const [show,setShow]=useState(false);
  const [f,setF]=useState({placa:"",mot:"",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:"",vl:"",km:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const reg=()=>{if(!f.placa||!f.litros){toast("Preencha veículo e litros.","danger");return;}const total=+(+f.litros*+f.vl).toFixed(2);const id=`ABS-${String(fuel.length+49).padStart(4,"0")}`;const now=new Date();const data=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`;const vv=vehicles.find(v=>v.placa===f.placa);setFuel([{id,placa:f.placa,mod:vv?.modelo||"",mot:f.mot,data,posto:f.posto,tipo:f.tipo,litros:+f.litros,vl:+f.vl,total,km:+f.km||0,media:0},...fuel]);setF({placa:"",mot:"",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:"",vl:"",km:""});setShow(false);toast("Abastecimento registrado!");};
  const tot=fuel.reduce((a,x)=>a+x.total,0);const totL=fuel.reduce((a,x)=>a+x.litros,0);
  return(<div>
    <SecHdr title="Controle de Abastecimento" sub={`${fuel.length} registros — R$ ${tot.toLocaleString("pt-BR",{minimumFractionDigits:2})} no total`} action={<BtnP ch="+ Registrar" click={()=>setShow(!show)} Ic={Plus}/>}/>
    <div className="g-kpi" style={{marginBottom:14}}>
      <Kpi lb="Gasto Total (Jun)" vl={`R$ ${tot.toLocaleString("pt-BR",{minimumFractionDigits:2})}`} Ic={DollarSign} top="#1d4ed8"/>
      <Kpi lb="Litros Abastecidos" vl={`${totL.toFixed(1)} L`} Ic={Fuel} top="#1d4ed8"/>
      <Kpi lb="Registros" vl={fuel.length} sub="Junho/2025" Ic={ClipboardList} top="#1d4ed8"/>
      <Kpi lb="Consumo Médio" vl="9.4 km/L" sub="Frota geral" Ic={Activity} cor={C.ok} top="#16a34a"/>
      <Kpi lb="Custo Médio" vl={`R$ ${(tot/totL||0).toFixed(2)}/L`} sub="Valor médio por litro" Ic={TrendingUp} top="#0284c7"/>
    </div>
    {show&&<div style={{background:C.card,border:bdr(),borderTop:`3px solid ${C.primary}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:C.tx,margin:"0 0 14px",paddingBottom:10,borderBottom:bdr()}}>Registrar Novo Abastecimento</p>
      <div className="g-f3"><FF lb="Veículo (Placa)" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit!=="Baixado").map(v=>v.placa)} req/><FF lb="Motorista" val={f.mot} set={u("mot")} opts={drivers.filter(d=>d.sit==="Ativo").map(d=>d.nome)}/><FF lb="Posto de Combustível" val={f.posto} set={u("posto")} opts={["Posto Central Upanema","Posto Municipal","Outro Posto"]}/></div>
      <div className="g-f4"><FF lb="Combustível" val={f.tipo} set={u("tipo")} opts={["Diesel S-10","Diesel Comum","Gasolina","Etanol","GNV"]}/><FF lb="Litros Abastecidos" val={f.litros} set={u("litros")} type="number" req/><FF lb="Valor por Litro (R$)" val={f.vl} set={u("vl")} type="number"/><FF lb="KM no Momento" val={f.km} set={u("km")} type="number"/></div>
      {f.litros&&f.vl&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",padding:"10px 14px",marginBottom:12,fontSize:13,color:C.primary,fontWeight:600}}>💧 Total calculado: <strong>R$ {(+f.litros*+f.vl).toFixed(2)}</strong></div>}
      <div style={{display:"flex",gap:10}}><BtnP ch="Registrar Abastecimento" click={reg} Ic={Check}/><BtnO ch="Cancelar" click={()=>setShow(false)}/></div>
    </div>}
    <div className="tbl" style={{background:C.card,border:bdr()}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Posto"/><Th ch="Tipo"/><Th ch="Litros"/><Th ch="R$/L"/><Th ch="Total"/><Th ch="KM"/><Th ch="km/L"/></tr></thead>
        <tbody>{fuel.map((x,i)=>(<tr key={x.id} className="hr" style={{background:i%2===0?C.ra:C.card}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:C.mu}}>{x.id}</span>}/>
          <Td ch={<div><div style={{fontWeight:600,fontSize:12}}>{x.placa}</div><div style={{fontSize:11,color:C.mu}}>{x.mod}</div></div>}/>
          <Td ch={<span style={{fontSize:12}}>{x.mot}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{x.data}</span>}/><Td ch={<span style={{fontSize:12}}>{x.posto}</span>}/>
          <Td ch={<Bdg lb={x.tipo} tp="info"/>}/>
          <Td ch={<span style={{fontWeight:500}}>{x.litros.toFixed(1)} L</span>}/>
          <Td ch={<span style={{fontSize:12}}>R$ {x.vl.toFixed(2)}</span>}/>
          <Td ch={<span style={{fontWeight:700,color:C.primary,whiteSpace:"nowrap"}}>R$ {x.total.toFixed(2)}</span>}/>
          <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{x.km>0?x.km.toLocaleString("pt-BR")+" km":"—"}</span>}/>
          <Td ch={<span style={{fontSize:12,fontWeight:500}}>{x.media>0?x.media+" km/L":"—"}</span>}/>
        </tr>))}</tbody>
      </table>
    </div>
  </div>);
}

function MaintenancePage({vehicles,maint,setMaint,toast}) {
  const [show,setShow]=useState(false);
  const [f,setF]=useState({placa:"",tipo:"Preventiva",desc:"",oficina:"",custo:"",prev:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const criar=()=>{if(!f.placa||!f.desc){toast("Preencha veículo e descrição.","danger");return;}const id=`OS-${String(maint.length+96).padStart(4,"0")}`;const vv=vehicles.find(v=>v.placa===f.placa);setMaint([{id,placa:f.placa,mod:vv?.modelo||"",tipo:f.tipo,desc:f.desc,oficina:f.oficina,custo:+f.custo||0,criado:new Date().toLocaleDateString("pt-BR"),prev:f.prev,status:"Agendada",prior:"Média"},...maint]);setShow(false);setF({placa:"",tipo:"Preventiva",desc:"",oficina:"",custo:"",prev:""});toast("Ordem de Serviço criada!");};
  const chSt=(id,st)=>{setMaint(maint.map(m=>m.id===id?{...m,status:st}:m));toast(`Status atualizado: ${st}`);};
  const totCusto=maint.reduce((a,m)=>a+(m.status!=="Finalizada"?m.custo:0),0);
  return(<div>
    <SecHdr title="Controle de Manutenção" sub={`${maint.filter(m=>m.status!=="Finalizada").length} ordens abertas — R$ ${totCusto.toLocaleString("pt-BR",{minimumFractionDigits:2})} em aberto`} action={<BtnP ch="+ Nova Ordem de Serviço" click={()=>setShow(!show)} Ic={Plus}/>}/>
    <div className="g-kpi" style={{marginBottom:14}}>
      <Kpi lb="OS Abertas" vl={maint.filter(m=>m.status!=="Finalizada").length} Ic={ClipboardList} cor={C.warn} top="#d97706"/>
      <Kpi lb="Em Execução" vl={maint.filter(m=>m.status==="Em execução").length} Ic={Wrench} cor={C.info} top="#0284c7"/>
      <Kpi lb="Agendadas" vl={maint.filter(m=>m.status==="Agendada").length} Ic={Calendar} top="#1d4ed8"/>
      <Kpi lb="Finalizadas" vl={maint.filter(m=>m.status==="Finalizada").length} Ic={CheckCircle} cor={C.ok} top="#16a34a"/>
      <Kpi lb="Custo Total Aberto" vl={`R$ ${totCusto.toLocaleString("pt-BR",{minimumFractionDigits:2})}`} Ic={DollarSign} top="#dc2626"/>
    </div>
    {show&&<div style={{background:C.card,border:bdr(),borderTop:`3px solid ${C.primary}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:C.tx,margin:"0 0 14px",paddingBottom:10,borderBottom:bdr()}}>Nova Ordem de Serviço</p>
      <div className="g-f3"><FF lb="Veículo (Placa)" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit!=="Baixado").map(v=>v.placa)} req/><FF lb="Tipo de Manutenção" val={f.tipo} set={u("tipo")} opts={["Preventiva","Corretiva","Elétrica","Funilaria","Pneus","Revisão Geral","Sanitária"]}/><FF lb="Oficina / Fornecedor" val={f.oficina} set={u("oficina")}/></div>
      <div className="g-f3"><FF lb="Descrição Detalhada do Serviço" val={f.desc} set={u("desc")} req/><FF lb="Custo Estimado (R$)" val={f.custo} set={u("custo")} type="number"/><FF lb="Previsão de Entrega" val={f.prev} set={u("prev")}/></div>
      <div style={{display:"flex",gap:10}}><BtnP ch="Criar Ordem de Serviço" click={criar} Ic={Check}/><BtnO ch="Cancelar" click={()=>setShow(false)}/></div>
    </div>}
    <div className="tbl" style={{background:C.card,border:bdr()}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Nº OS"/><Th ch="Veículo"/><Th ch="Tipo"/><Th ch="Descrição"/><Th ch="Oficina"/><Th ch="Abertura"/><Th ch="Previsão"/><Th ch="Custo"/><Th ch="Prior."/><Th ch="Status"/><Th ch="Ação"/></tr></thead>
        <tbody>{maint.map((m,i)=>(<tr key={m.id} className="hr" style={{background:i%2===0?C.ra:C.card}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:C.mu,fontWeight:600}}>{m.id}</span>}/>
          <Td ch={<div><div style={{fontWeight:600,fontSize:12}}>{m.placa}</div><div style={{fontSize:11,color:C.mu}}>{m.mod}</div></div>}/>
          <Td ch={<Bdg lb={m.tipo} tp={m.tipo==="Corretiva"?"bad":"info"}/>}/>
          <Td ch={<span style={{fontSize:12,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{m.desc}</span>}/>
          <Td ch={<span style={{fontSize:12}}>{m.oficina||"—"}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{m.criado}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{m.prev||"—"}</span>}/>
          <Td ch={<span style={{fontWeight:600,color:m.custo>1000?C.bad:C.tx,whiteSpace:"nowrap"}}>R$ {m.custo.toFixed(2)}</span>}/>
          <Td ch={<Bdg lb={m.prior} tp={m.prior==="Alta"?"bad":m.prior==="Média"?"warn":"gray"}/>}/>
          <Td ch={<SBdg v={m.status}/>}/>
          <Td ch={m.status==="Agendada"?<BtnP ch="Iniciar" sm click={()=>chSt(m.id,"Em execução")}/> : m.status==="Em execução"?<BtnP ch="Finalizar" sm click={()=>chSt(m.id,"Finalizada")}/> : <span style={{color:C.mu,fontSize:11}}>—</span>}/>
        </tr>))}</tbody>
      </table>
    </div>
  </div>);
}

function Financial({vehicles,toast}) {
  const rank=[...vehicles].filter(v=>v.custo>0).sort((a,b)=>b.custo-a.custo);
  const total2025=CH_G.reduce((a,x)=>a+x.c+x.m,0);
  const totalC=CH_G.reduce((a,x)=>a+x.c,0);
  const totalM=CH_G.reduce((a,x)=>a+x.m,0);
  return(<div>
    <SecHdr title="Gestão Financeira" sub="Análise completa de custos e despesas operacionais da frota" action={<BtnO ch="Exportar Relatório" click={()=>{toast("Gerando relatório financeiro...","info");setTimeout(()=>toast("Exportado com sucesso!"),2000);}} Ic={Download}/>}/>
    <div className="g-kpi" style={{marginBottom:16}}>
      <Kpi lb="Total 2025 (Jan–Jun)" vl={`R$ ${total2025.toLocaleString("pt-BR")}`} Ic={DollarSign} top="#1d4ed8"/>
      <Kpi lb="Combustível" vl={`R$ ${totalC.toLocaleString("pt-BR")}`} sub={`${((totalC/total2025)*100).toFixed(0)}% dos gastos`} Ic={Fuel} top="#0c1a47" delta={-8}/>
      <Kpi lb="Manutenção" vl={`R$ ${totalM.toLocaleString("pt-BR")}`} sub={`${((totalM/total2025)*100).toFixed(0)}% dos gastos`} Ic={Wrench} top="#d97706"/>
      <Kpi lb="Multas / Outros" vl="R$ 902" sub="1% dos gastos" Ic={AlertOctagon} cor={C.bad} top="#dc2626"/>
    </div>
    <div className="g-dash">
      <div style={{background:C.card,border:bdr(),padding:"18px 18px 12px"}}>
        <div style={{fontSize:14,fontWeight:700,color:C.tx,marginBottom:1}}>Evolução Mensal — Janeiro a Junho/2025</div>
        <div style={{fontSize:11,color:C.mu,marginBottom:14}}>Combustível + Manutenção empilhados (R$)</div>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={CH_G}><CartesianGrid strokeDasharray="3 3" stroke={C.bd}/><XAxis dataKey="mes" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v=>`R$${v/1000}k`}/><Tooltip formatter={v=>`R$ ${Number(v).toLocaleString("pt-BR",{minimumFractionDigits:2})}`}/><Legend iconSize={10} wrapperStyle={{fontSize:11}}/><Bar dataKey="c" name="Combustível" fill="#1d4ed8" stackId="a"/><Bar dataKey="m" name="Manutenção" fill="#93c5fd" stackId="a"/></BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:C.card,border:bdr(),padding:18}}>
        <div style={{fontSize:14,fontWeight:700,color:C.tx,marginBottom:16}}>Distribuição por Secretaria</div>
        {CH_S.map((s,i)=>(<div key={i} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:500,color:C.tx}}>{s.name}</span><span style={{fontSize:13,fontWeight:700,color:C.tx}}>R$ {s.v.toLocaleString("pt-BR")}</span></div>
          <div style={{height:7,background:C.bd}}><div style={{height:"100%",width:`${(s.v/10000)*100}%`,background:s.cor}}/></div>
          <div style={{fontSize:10,color:C.mu,marginTop:2}}>{((s.v/23460)*100).toFixed(1)}% do total acumulado</div>
        </div>))}
      </div>
    </div>
    <div style={{background:C.card,border:bdr()}}>
      <div style={{padding:"13px 16px",borderBottom:bdr()}}><span style={{fontWeight:700,fontSize:14,color:C.tx}}>Ranking de Veículos por Custo — Junho/2025</span></div>
      <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Pos."/><Th ch="Placa"/><Th ch="Modelo"/><Th ch="Secretaria"/><Th ch="KM no Mês"/><Th ch="Custo no Mês"/><Th ch="Custo/km"/><Th ch="Eficiência"/></tr></thead>
        <tbody>{rank.map((v,i)=>(<tr key={v.id} className="hr" style={{background:i%2===0?C.ra:C.card}}>
          <Td ch={<span style={{fontWeight:800,color:i===0?"#dc2626":i===1?"#d97706":i===2?"#0284c7":C.mu,fontSize:15}}>#{i+1}</span>}/>
          <Td ch={<span style={{fontWeight:700,color:"#0c1a47"}}>{v.placa}</span>}/>
          <Td ch={<span style={{fontSize:12}}>{v.modelo}</span>}/>
          <Td ch={<span style={{fontSize:12}}>{v.sec}</span>}/>
          <Td ch={<span style={{whiteSpace:"nowrap"}}>{v.kmm.toLocaleString("pt-BR")} km</span>}/>
          <Td ch={<span style={{fontWeight:700,color:v.custo>900?C.bad:C.primary,whiteSpace:"nowrap"}}>R$ {v.custo.toFixed(2)}</span>}/>
          <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{v.kmm>0?(v.custo/v.kmm).toFixed(2):"—"} R$/km</span>}/>
          <Td ch={<Bdg lb={v.kmm>0&&(v.custo/v.kmm)<0.40?"Eficiente":v.kmm>0&&(v.custo/v.kmm)<0.60?"Regular":"Alto Custo"} tp={v.kmm>0&&(v.custo/v.kmm)<0.40?"ok":v.kmm>0&&(v.custo/v.kmm)<0.60?"warn":"bad"}/>}/>
        </tr>))}</tbody>
      </table></div>
    </div>
  </div>);
}

function Reports({toast}) {
  const [periodo,setPeriodo]=useState("Jun/2025");
  const [sec,setSec]=useState("Todas");
  const gerar=(nome,fmt)=>{toast(`Gerando: ${nome} (${fmt.toUpperCase()})...`,"info");setTimeout(()=>toast(`✓ "${nome}" gerado com sucesso!`),2200);};
  const rpts=[{t:"Frota Completa",d:"Situação, KM e custos de todos os veículos",I:Car,tag:"Veículos"},{t:"Histórico de Viagens",d:"Viagens do período com destinos e custos",I:MapPin,tag:"Operações"},{t:"Consumo de Combustível",d:"Análise de consumo e gastos por veículo",I:Fuel,tag:"Recursos"},{t:"Ordens de Serviço",d:"Histórico de manutenções e custos totais",I:Wrench,tag:"Manutenção"},{t:"Gastos por Secretaria",d:"Distribuição de custos por órgão municipal",I:Building2,tag:"Financeiro"},{t:"Validade de Documentos",d:"CRLV, seguros, revisões e CNHs",I:FileText,tag:"Documentos"},{t:"Indicadores KPI",d:"Custo/km, ociosidade, consumo médio, eficiência",I:BarChart2,tag:"Análise"},{t:"Relatório Executivo",d:"Resumo executivo para o gabinete do Prefeito",I:Shield,tag:"Executivo"},{t:"Controle de Multas",d:"Infrações, valores e situação atual",I:AlertOctagon,tag:"Multas"},{t:"Relatório de Motoristas",d:"Desempenho, CNH e histórico de viagens",I:Users,tag:"Motoristas"},{t:"Transparência Pública",d:"Dados para o Portal da Transparência municipal",I:Activity,tag:"Portal"},{t:"Prestação de Contas",d:"Relatório financeiro para TCE-RN",I:DollarSign,tag:"Contabilidade"}];
  return(<div>
    <SecHdr title="Central de Relatórios" sub="Geração de relatórios operacionais, financeiros e analíticos"/>
    <div style={{background:C.card,border:bdr(),padding:"13px 16px",marginBottom:16,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
      <Filter size={14} color={C.mu}/><span style={{fontSize:11,fontWeight:700,color:C.mu,textTransform:"uppercase",letterSpacing:".07em"}}>Filtros do Relatório:</span>
      <select value={periodo} onChange={e=>setPeriodo(e.target.value)} style={{border:bdr(C.ibd),padding:"6px 10px",fontSize:12,fontFamily:"inherit",color:C.tx}}>
        {["Jun/2025","Mai/2025","Abr/2025","Mar/2025","1º Sem/2025","2º Sem/2024","2024 Completo","Personalizado"].map(p=><option key={p}>{p}</option>)}
      </select>
      <select value={sec} onChange={e=>setSec(e.target.value)} style={{border:bdr(C.ibd),padding:"6px 10px",fontSize:12,fontFamily:"inherit",color:C.tx}}>
        {["Todas","Saúde","Obras","Educação","Administração","Assist. Social"].map(s=><option key={s}>{s}</option>)}
      </select>
      <span style={{fontSize:11,color:C.mu}}>Período: <strong style={{color:C.tx}}>{periodo}</strong> · Secretaria: <strong style={{color:C.tx}}>{sec}</strong></span>
    </div>
    <div className="g-rpt">
      {rpts.map((r,i)=>(<div key={i} className="ch" style={{background:C.card,border:bdr(),padding:16,display:"flex",flexDirection:"column",justifyContent:"space-between",transition:"border-color .15s"}}>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{width:34,height:34,background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center"}}><r.I size={16} color={C.primary}/></div><Bdg lb={r.tag} tp="info"/></div>
          <div style={{fontSize:13,fontWeight:700,color:C.tx,marginBottom:3}}>{r.t}</div>
          <div style={{fontSize:11,color:C.mu,marginBottom:14,lineHeight:1.55}}>{r.d}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
          <button onClick={()=>gerar(r.t,"pdf")} style={{background:"#0c1a47",color:"white",border:"none",padding:"7px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Download size={10}/>PDF</button>
          <button onClick={()=>gerar(r.t,"xlsx")} style={{background:"#15803d",color:"white",border:"none",padding:"7px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Download size={10}/>Excel</button>
        </div>
      </div>))}
    </div>
  </div>);
}

function Fines({fines,setFines,toast}) {
  const [show,setShow]=useState(false);
  const [f,setF]=useState({placa:"",mot:"",data:"",inf:"",valor:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const reg=()=>{if(!f.placa||!f.inf){toast("Preencha veículo e infração.","danger");return;}const id=`MLT-${String(fines.length+6).padStart(3,"0")}`;setFines([{id,placa:f.placa,mot:f.mot||"—",data:f.data||new Date().toLocaleDateString("pt-BR"),inf:f.inf,valor:+f.valor||0,status:"Pendente"},...fines]);setF({placa:"",mot:"",data:"",inf:"",valor:""});setShow(false);toast("Multa registrada!");};
  const total=fines.reduce((a,x)=>a+x.valor,0);
  return(<div>
    <SecHdr title="Controle de Multas" sub={`${fines.length} multas registradas — R$ ${total.toFixed(2)} em valores totais`} action={<BtnP ch="+ Registrar Multa" click={()=>setShow(!show)} Ic={Plus}/>}/>
    <div className="g-kpi" style={{marginBottom:14}}>
      <Kpi lb="Total" vl={fines.length} Ic={AlertOctagon} top="#dc2626"/>
      <Kpi lb="Pendentes" vl={fines.filter(x=>x.status==="Pendente").length} sub={`R$ ${fines.filter(x=>x.status==="Pendente").reduce((a,x)=>a+x.valor,0).toFixed(2)}`} Ic={AlertCircle} cor={C.warn} top="#d97706"/>
      <Kpi lb="Em Recurso" vl={fines.filter(x=>x.status==="Em recurso").length} Ic={FileText} cor={C.info} top="#0284c7"/>
      <Kpi lb="Pagas" vl={fines.filter(x=>x.status==="Pago").length} Ic={CheckCircle} cor={C.ok} top="#16a34a"/>
      <Kpi lb="Total em Valores" vl={`R$ ${total.toFixed(2)}`} Ic={DollarSign} cor={C.bad} top="#dc2626"/>
    </div>
    {show&&<div style={{background:C.card,border:bdr(),borderTop:`3px solid ${C.bad}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:C.tx,margin:"0 0 14px",paddingBottom:10,borderBottom:bdr()}}>Registrar Nova Multa de Trânsito</p>
      <div className="g-f3"><FF lb="Veículo (Placa)" val={f.placa} set={u("placa")} opts={vehicles_placeholder||["QRZ-1A34","QST-2B56","QUV-3C78","QWX-4D90","QYZ-5E12","QAB-6F34","RCA-8H78","RDA-9I90","REB-0J12","RFC-1K34","RGD-2L56"]} req/><FF lb="Motorista Responsável" val={f.mot} set={u("mot")}/><FF lb="Data da Infração" val={f.data} set={u("data")}/></div>
      <div className="g-f2"><FF lb="Descrição Completa da Infração" val={f.inf} set={u("inf")} req/><FF lb="Valor da Multa (R$)" val={f.valor} set={u("valor")} type="number"/></div>
      <div style={{display:"flex",gap:10}}><BtnP ch="Registrar Multa" click={reg} Ic={Check}/><BtnO ch="Cancelar" click={()=>setShow(false)}/></div>
    </div>}
    <div className="tbl" style={{background:C.card,border:bdr()}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Infração"/><Th ch="Valor"/><Th ch="Status"/><Th ch="Ações"/></tr></thead>
        <tbody>{fines.map((m,i)=>(<tr key={m.id} className="hr" style={{background:i%2===0?C.ra:C.card}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:C.mu}}>{m.id}</span>}/>
          <Td ch={<span style={{fontWeight:600,color:"#0c1a47"}}>{m.placa}</span>}/><Td ch={<span style={{fontSize:12}}>{m.mot}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{m.data}</span>}/>
          <Td ch={<span style={{fontSize:12,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{m.inf}</span>}/>
          <Td ch={<span style={{fontWeight:700,color:C.bad,whiteSpace:"nowrap"}}>R$ {m.valor.toFixed(2)}</span>}/>
          <Td ch={<SBdg v={m.status}/>}/>
          <Td ch={<div style={{display:"flex",gap:4}}>{m.status==="Pendente"?<><BtnP ch="Pagar" sm click={()=>{setFines(fines.map(x=>x.id===m.id?{...x,status:"Pago"}:x));toast("Multa paga.");}}/><BtnO ch="Recurso" sm click={()=>{setFines(fines.map(x=>x.id===m.id?{...x,status:"Em recurso"}:x));toast("Recurso cadastrado.");}}/></>:<span style={{fontSize:11,color:C.mu}}>—</span>}</div>}/>
        </tr>))}</tbody>
      </table>
    </div>
  </div>);
}
const vehicles_placeholder=null;

function Checklist({vehicles,drivers,toast}) {
  const ITEMS=["Nível de óleo motor","Água do radiador / líquido de arrefecimento","Nível de combustível","Calibração dos pneus (incluindo estepe)","Estado dos pneus (desgaste e danos)","Freios (pedal firme e fluido no nível)","Luzes dianteiras (faróis, luzinhas)","Luzes traseiras (freio, ré, seta)","Limpadores de para-brisa e reservatório","Espelhos retrovisores (regulados e limpos)","Cinto de segurança do motorista","CRLV e outros documentos obrigatórios","Kit de emergência completo","Extintor de incêndio (prazo e carga)","Lataria e vidros (avarias visíveis)"];
  const [placa,setPlaca]=useState("");const[mot,setMot]=useState("");const[ck,setCk]=useState({});const[obs,setObs]=useState("");
  const [hist,setHist]=useState([
    {id:"CKL-003",placa:"QYZ-5E12",mot:"Maria Santos",data:"08/06/2025 05:50",ok:15,total:15,res:"Aprovado"},
    {id:"CKL-002",placa:"QRZ-1A34",mot:"Carlos Oliveira",data:"07/06/2025 07:15",ok:13,total:15,res:"Aprovado c/ ressalvas"},
    {id:"CKL-001",placa:"QST-2B56",mot:"João Silva",data:"07/06/2025 07:00",ok:15,total:15,res:"Aprovado"},
    {id:"CKL-000",placa:"RCA-8H78",mot:"João Silva",data:"05/06/2025 07:20",ok:15,total:15,res:"Aprovado"},
    {id:"CKL-099",placa:"QWX-4D90",mot:"Fernanda Costa",data:"06/06/2025 04:20",ok:14,total:15,res:"Aprovado c/ ressalvas"},
  ]);
  const toggle=item=>setCk(p=>({...p,[item]:!p[item]}));
  const totalOk=Object.values(ck).filter(Boolean).length;
  const enviar=()=>{
    if(!placa||!mot){toast("Selecione o veículo e o motorista.","danger");return;}
    const ok=Object.values(ck).filter(Boolean).length;
    const id=`CKL-${String(hist.length+4).padStart(3,"0")}`;
    const res=ok===ITEMS.length?"Aprovado":ok>=12?"Aprovado c/ ressalvas":"Reprovado";
    setHist([{id,placa,mot,data:new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}),ok,total:ITEMS.length,res},...hist]);
    setCk({});setObs("");setPlaca("");setMot("");
    toast(ok===ITEMS.length?"✓ Checklist aprovado! Veículo liberado para saída.":"⚠ Checklist com ressalvas — verifique os itens pendentes.","info");
  };
  return(<div>
    <SecHdr title="Checklist Diário de Inspeção" sub="Inspeção pré-saída obrigatória para todos os veículos da frota"/>
    <div className="g-2">
      <div style={{background:C.card,border:bdr(),padding:18}}>
        <p style={{fontSize:14,fontWeight:700,color:C.tx,margin:"0 0 14px",paddingBottom:10,borderBottom:bdr()}}>Novo Checklist de Inspeção Veicular</p>
        <div className="g-f2" style={{marginBottom:14}}><FF lb="Veículo (Placa) — Apenas disponíveis" val={placa} set={setPlaca} opts={vehicles.filter(v=>v.sit==="Disponível").map(v=>v.placa)}/><FF lb="Motorista Responsável" val={mot} set={setMot} opts={drivers.filter(d=>d.sit==="Ativo").map(d=>d.nome)}/></div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:12,fontWeight:700,color:C.tx}}>Itens de Inspeção Obrigatória</span>
          <span style={{fontSize:12,color:totalOk===ITEMS.length?C.ok:C.primary,fontWeight:700}}>{totalOk} / {ITEMS.length} ✓</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:12}}>
          {ITEMS.map((item,i)=>(<div key={i} onClick={()=>toggle(item)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:ck[item]?"#dcfce7":C.ra,cursor:"pointer",border:`1px solid ${ck[item]?"#86efac":C.bd}`,transition:"all .1s"}}>
            <div style={{width:18,height:18,border:`2px solid ${ck[item]?"#16a34a":C.bd}`,background:ck[item]?"#16a34a":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .1s"}}>{ck[item]&&<Check size={11} color="white"/>}</div>
            <span style={{fontSize:13,color:ck[item]?"#15803d":C.sub,fontWeight:ck[item]?600:400}}>{item}</span>
          </div>))}
        </div>
        <div style={{marginBottom:14}}><label style={{display:"block",fontSize:10,fontWeight:700,color:C.mu,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>Observações e Pendências</label><textarea value={obs} onChange={e=>setObs(e.target.value)} rows={2} style={{width:"100%",border:bdr(C.ibd),padding:"8px 10px",fontSize:13,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/></div>
        <BtnP ch={`Finalizar Checklist (${totalOk}/${ITEMS.length} itens ✓)`} click={enviar} full/>
      </div>
      <div style={{background:C.card,border:bdr()}}>
        <div style={{padding:"13px 16px",borderBottom:bdr()}}><span style={{fontWeight:700,fontSize:14,color:C.tx}}>Histórico de Inspeções</span></div>
        <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Itens"/><Th ch="Resultado"/></tr></thead>
          <tbody>{hist.map((h,i)=>(<tr key={h.id} className="hr" style={{background:i%2===0?C.ra:C.card}}><Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:C.mu}}>{h.id}</span>}/><Td ch={<span style={{fontWeight:600,color:"#0c1a47",fontSize:12}}>{h.placa}</span>}/><Td ch={<span style={{fontSize:12}}>{h.mot}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{h.data}</span>}/><Td ch={<span style={{fontSize:12,fontWeight:600}}>{h.ok}/{h.total}</span>}/><Td ch={<Bdg lb={h.res} tp={h.res==="Aprovado"?"ok":h.res.includes("ressalvas")?"warn":"bad"}/>}/></tr>))}</tbody>
        </table></div>
      </div>
    </div>
  </div>);
}

function Audit() {
  const tp={create:"#dcfce7",edit:"#e0f2fe",info:"#f1f5f9",del:"#fee2e2"};const tl={create:"CRIAÇÃO",edit:"EDIÇÃO",info:"ACESSO",del:"EXCLUSÃO"};
  return(<div>
    <SecHdr title="Auditoria e Rastreabilidade" sub="Registro completo e imutável de todas as ações no sistema"/>
    <div className="g-kpi" style={{marginBottom:16}}>
      <Kpi lb="Ações Hoje" vl={LOG0.length} Ic={Shield} top="#1d4ed8"/>
      <Kpi lb="Criações" vl={LOG0.filter(a=>a.tipo==="create").length} Ic={Plus} cor={C.ok} top="#16a34a"/>
      <Kpi lb="Edições" vl={LOG0.filter(a=>a.tipo==="edit").length} Ic={Edit} cor={C.info} top="#0284c7"/>
      <Kpi lb="Acessos" vl={LOG0.filter(a=>a.tipo==="info").length} Ic={User} cor={C.mu} top="#94a3b8"/>
    </div>
    <div className="tbl" style={{background:C.card,border:bdr()}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="#"/><Th ch="Data / Hora"/><Th ch="Usuário"/><Th ch="Tipo"/><Th ch="Ação Realizada"/><Th ch="Detalhe"/></tr></thead>
        <tbody>{LOG0.map((a,i)=>(<tr key={a.id} className="hr" style={{background:i%2===0?C.ra:C.card}}>
          <Td ch={<span style={{fontSize:11,color:C.mu,fontFamily:"monospace"}}>{String(i+1).padStart(3,"0")}</span>}/>
          <Td ch={<span style={{fontSize:12,fontFamily:"monospace",whiteSpace:"nowrap"}}>{a.data}</span>}/>
          <Td ch={<div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:26,height:26,background:"#0c1a47",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"white",flexShrink:0}}>{a.user.split(" ").map(p=>p[0]).join("").slice(0,2)}</div><span style={{fontWeight:500,fontSize:12,whiteSpace:"nowrap"}}>{a.user}</span></div>}/>
          <Td ch={<span style={{background:tp[a.tipo]||"#f1f5f9",fontSize:9,fontWeight:700,padding:"2px 6px",letterSpacing:".06em",whiteSpace:"nowrap"}}>{tl[a.tipo]||a.tipo.toUpperCase()}</span>}/>
          <Td ch={<span style={{fontSize:12,fontWeight:500}}>{a.acao}</span>}/>
          <Td ch={<span style={{fontSize:11,color:C.mu}}>{a.det}</span>}/>
        </tr>))}</tbody>
      </table>
    </div>
  </div>);
}

function AlertsPage({alerts,setAlerts,nav}) {
  return(<div>
    <SecHdr title="Central de Alertas" sub={`${alerts.length} alertas ativos — ${alerts.filter(a=>a.nivel==="danger").length} crítico(s) requerem ação imediata`} action={<BtnO ch="Dispensar todos" sm click={()=>setAlerts([])}/>}/>
    {alerts.length===0&&<div style={{background:C.card,border:bdr(),padding:"56px",textAlign:"center",color:C.mu}}><CheckCircle size={40} color="#16a34a" style={{display:"block",margin:"0 auto 12px"}}/><div style={{fontSize:16,fontWeight:600,color:C.tx,marginBottom:4}}>Nenhum alerta ativo</div><div style={{fontSize:13}}>O sistema está operando normalmente. Todos os documentos e manutenções estão em dia.</div></div>}
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {alerts.map(a=>(<div key={a.id} style={{background:C.card,border:bdr(),borderLeft:`4px solid ${a.nivel==="danger"?C.bad:a.nivel==="warning"?C.warn:C.info}`,padding:"13px 16px",display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{marginTop:2}}>{a.nivel==="danger"?<AlertCircle size={18} color="#dc2626"/>:a.nivel==="warning"?<AlertCircle size={18} color="#d97706"/>:<Bell size={18} color="#0284c7"/>}</div>
        <div style={{flex:1,minWidth:200}}><div style={{fontSize:14,fontWeight:700,color:C.tx,marginBottom:2}}>{a.titulo}</div><div style={{fontSize:13,color:C.mu,lineHeight:1.5}}>{a.desc}</div></div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
          <Bdg lb={a.tipo} tp={a.nivel==="danger"?"bad":a.nivel==="warning"?"warn":"info"}/>
          <button onClick={()=>nav(a.pg)} style={{fontSize:11,color:C.primary,background:"none",border:`1px solid ${C.primary}`,padding:"3px 10px",cursor:"pointer",fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap"}}>Acessar</button>
          <button onClick={()=>setAlerts(p=>p.filter(x=>x.id!==a.id))} style={{background:"none",border:"none",cursor:"pointer",color:C.mu,padding:2}}><X size={14}/></button>
        </div>
      </div>))}
    </div>
  </div>);
}

function Suppliers({toast}) {
  const sups=[{id:"FRN-001",nome:"Posto Central Upanema",tipo:"Posto de Combustível",cnpj:"01.234.567/0001-89",contato:"(84) 3334-0001",ct:"CT-2024-045",val:"31/12/2025",status:"Ativo"},{id:"FRN-002",nome:"Oficina Mecânica São Pedro",tipo:"Oficina Mecânica",cnpj:"12.345.678/0001-90",contato:"(84) 99234-5555",ct:"CT-2024-028",val:"30/06/2025",status:"Vencendo"},{id:"FRN-003",nome:"Pneus Silva Upanema",tipo:"Pneus e Borracharia",cnpj:"23.456.789/0001-01",contato:"(84) 99876-1234",ct:"CT-2025-003",val:"31/12/2025",status:"Ativo"},{id:"FRN-004",nome:"Auto Center RN — Mossoró",tipo:"Oficina Especializada",cnpj:"34.567.890/0001-12",contato:"(84) 3321-7890",ct:"CT-2023-067",val:"30/09/2025",status:"Ativo"},{id:"FRN-005",nome:"Concessionária Fiat Mossoró",tipo:"Conc. Autorizada — Fiat",cnpj:"45.678.901/0001-23",contato:"(84) 3322-4500",ct:"CT-2024-089",val:"31/12/2025",status:"Ativo"},{id:"FRN-006",nome:"Posto Municipal de Combustível",tipo:"Posto de Combustível",cnpj:"Interno PMU",contato:"Interno",ct:"Direto",val:"—",status:"Ativo"},{id:"FRN-007",nome:"Tecmasc Equipamentos — Mossoró",tipo:"Máquinas Pesadas",cnpj:"56.789.012/0001-34",contato:"(84) 3325-9000",ct:"CT-2025-007",val:"31/12/2025",status:"Ativo"}];
  return(<div>
    <SecHdr title="Gestão de Fornecedores" sub="Postos credenciados, oficinas e parceiros homologados" action={<BtnP ch="+ Cadastrar Fornecedor" click={()=>toast("Formulário em desenvolvimento nesta versão.","info")} Ic={Plus}/>}/>
    <div className="g-kpi" style={{marginBottom:16}}>
      <Kpi lb="Credenciados" vl={sups.length} Ic={Building2} top="#1d4ed8"/>
      <Kpi lb="Ativos" vl={sups.filter(s=>s.status==="Ativo").length} Ic={CheckCircle} cor={C.ok} top="#16a34a"/>
      <Kpi lb="Contratos Vencendo" vl={sups.filter(s=>s.status==="Vencendo").length} Ic={AlertCircle} cor={C.warn} top="#d97706"/>
      <Kpi lb="Postos" vl={sups.filter(s=>s.tipo.includes("Posto")).length} Ic={Fuel} top="#0284c7"/>
      <Kpi lb="Oficinas" vl={sups.filter(s=>s.tipo.includes("Oficina")||s.tipo.includes("Conc.")).length} Ic={Wrench} top="#1d4ed8"/>
    </div>
    <div className="tbl" style={{background:C.card,border:bdr()}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Código"/><Th ch="Nome / Razão Social"/><Th ch="Tipo"/><Th ch="CNPJ"/><Th ch="Contato"/><Th ch="Contrato"/><Th ch="Validade"/><Th ch="Status"/><Th ch=""/></tr></thead>
        <tbody>{sups.map((s,i)=>(<tr key={s.id} className="hr" style={{background:i%2===0?C.ra:C.card}}><Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:C.mu}}>{s.id}</span>}/><Td ch={<span style={{fontWeight:600}}>{s.nome}</span>}/><Td ch={<span style={{fontSize:12}}>{s.tipo}</span>}/><Td ch={<span style={{fontFamily:"monospace",fontSize:11}}>{s.cnpj}</span>}/><Td ch={<span style={{fontSize:12}}>{s.contato}</span>}/><Td ch={<span style={{fontFamily:"monospace",fontSize:11}}>{s.ct}</span>}/><Td ch={<span style={{fontSize:12,color:s.status==="Vencendo"?"#dc2626":"inherit",fontWeight:s.status==="Vencendo"?700:400,whiteSpace:"nowrap"}}>{s.val}</span>}/><Td ch={<Bdg lb={s.status} tp={s.status==="Ativo"?"ok":"warn"}/>}/><Td ch={<BtnO ch="Detalhes" sm click={()=>toast(`Detalhes de ${s.nome} em desenvolvimento.`,"info")}/>}/></tr>))}</tbody>
      </table>
    </div>
  </div>);
}

function SettingsPage({toast,currentUser}) {
  const isAdmin=currentUser?.role==="admin";
  const [users,setUsers]=useState(SISTEMA_USUARIOS.map(u=>({...u})));
  const [showForm,setShowForm]=useState(false);
  const [cfm,setCfm]=useState(null);
  const [tab,setTab]=useState("users");
  const [nf,setNf]=useState({nome:"",email:"",pw:"",role:"motorista",sec:"",perfil:""});
  const toggle=email=>{if(!isAdmin){toast("Apenas administradores podem alterar usuários.","danger");return;}setUsers(p=>p.map(u=>u.email===email?{...u,ativo:!u.ativo}:u));toast("Status atualizado.");};
  const del=u=>{if(!isAdmin){toast("Apenas administradores podem remover usuários.","danger");return;}if(u.email===currentUser.email){toast("Não é possível remover o próprio usuário.","danger");return;}setCfm({msg:`Remover permanentemente o usuário "${u.nome}"? Esta ação não pode ser desfeita.`,ok:()=>{setUsers(p=>p.filter(x=>x.email!==u.email));toast("Usuário removido.","danger");setCfm(null);}});};
  const addUser=()=>{if(!nf.nome||!nf.email||!nf.pw){toast("Preencha nome, e-mail e senha.","danger");return;}if(users.find(u=>u.email===nf.email)){toast("Este e-mail já está cadastrado.","danger");return;}setUsers(p=>[...p,{...nf,mat:`PMU-${Date.now().toString().slice(-5)}`,ativo:true,viagens:0,kmR:0,veiAtual:null}]);setShowForm(false);setNf({nome:"",email:"",pw:"",role:"motorista",sec:"",perfil:""});toast("Usuário cadastrado com sucesso!");};
  const menuItems=[["users","Usuários & Acesso",User],["sistema","Informações do Sistema",Shield],["notif","Notificações",Bell],["backup","Backup & Dados",CheckSquare]];
  return(<div>
    <SecHdr title="Configurações do Sistema" sub="Gerenciamento de usuários, permissões e parâmetros do sistema"/>
    <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:14,flexWrap:"wrap"}}>
      <div style={{background:C.card,border:bdr(),padding:"8px 0",height:"fit-content"}}>
        {menuItems.map(([id,lb,I])=>(<button key={id} onClick={()=>setTab(id)} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"10px 14px",background:tab===id?C.hv:"none",border:"none",borderLeft:tab===id?`3px solid ${C.primary}`:"3px solid transparent",color:tab===id?C.primary:C.sub,fontSize:13,fontWeight:tab===id?600:400,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}><I size={14}/>{lb}</button>))}
      </div>
      <div>
        {tab==="users"&&<div>
          <div style={{background:C.card,border:bdr()}}>
            <div style={{padding:"13px 16px",borderBottom:bdr(),display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div><span style={{fontWeight:700,fontSize:14,color:C.tx}}>Usuários do Sistema</span>{!isAdmin&&<span style={{marginLeft:10,fontSize:11,color:C.warn,display:"inline-flex",alignItems:"center",gap:4}}><Lock size={11}/>Somente leitura</span>}</div>
              {isAdmin&&<BtnP ch="+ Novo Usuário" click={()=>setShowForm(!showForm)} Ic={Plus}/>}
            </div>
            {isAdmin&&showForm&&<div style={{padding:18,borderBottom:bdr(),background:C.ra}} className="fu">
              <p style={{fontSize:13,fontWeight:700,color:C.tx,margin:"0 0 12px"}}>Cadastrar Novo Usuário</p>
              <div className="g-f3">
                <FF lb="Nome Completo" val={nf.nome} set={v=>setNf(p=>({...p,nome:v}))} req/>
                <FF lb="E-mail Institucional" val={nf.email} set={v=>setNf(p=>({...p,email:v}))} req/>
                <FF lb="Senha Inicial" val={nf.pw} set={v=>setNf(p=>({...p,pw:v}))} type="password" req/>
                <FF lb="Perfil de Acesso" val={nf.role} set={v=>setNf(p=>({...p,role:v}))} opts={["admin","gestor","secretario","supervisor","motorista","auditor"]}/>
                <FF lb="Secretaria" val={nf.sec} set={v=>setNf(p=>({...p,sec:v}))} opts={["Saúde","Obras","Educação","Administração","Assist. Social","Controle Interno","Gestão"]}/>
                <FF lb="Título do Perfil" val={nf.perfil} set={v=>setNf(p=>({...p,perfil:v}))}/>
              </div>
              <div style={{display:"flex",gap:10}}><BtnP ch="Cadastrar Usuário" click={addUser} Ic={Check}/><BtnO ch="Cancelar" click={()=>setShowForm(false)}/></div>
            </div>}
            <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr><Th ch="Matrícula"/><Th ch="Nome"/><Th ch="E-mail"/><Th ch="Perfil"/><Th ch="Secretaria"/><Th ch="Status"/>{isAdmin&&<Th ch="Ações"/>}</tr></thead>
              <tbody>{users.map((u,i)=>(<tr key={u.email} className="hr" style={{background:i%2===0?C.ra:C.card}}>
                <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:C.mu}}>{u.mat}</span>}/>
                <Td ch={<div style={{display:"flex",alignItems:"center",gap:6}}>{u.email===currentUser?.email&&<span style={{width:6,height:6,background:C.ok,borderRadius:"50%",flexShrink:0}}/>}<span style={{fontWeight:600}}>{u.nome}</span></div>}/>
                <Td ch={<span style={{fontSize:12}}>{u.email}</span>}/>
                <Td ch={<Bdg lb={u.role==="admin"?"Administrador":u.perfil||u.role} tp={u.role==="admin"?"bad":u.role==="gestor"?"warn":"info"}/>}/>
                <Td ch={<span style={{fontSize:12}}>{u.sec}</span>}/>
                <Td ch={<SBdg v={u.ativo?"Ativo":"Afastado"}/>}/>
                {isAdmin&&<Td ch={<div style={{display:"flex",gap:5}}>
                  <BtnO ch={u.ativo?"Desativar":"Ativar"} sm click={()=>toggle(u.email)}/>
                  {u.email!==currentUser?.email&&<button onClick={()=>del(u)} style={{background:"none",border:"none",cursor:"pointer",color:C.bad,padding:3}}><Trash2 size={13}/></button>}
                </div>}/>}
              </tr>))}</tbody>
            </table></div>
          </div>
          {!isAdmin&&<div style={{marginTop:12,background:"#fef9c3",border:"1px solid #fde047",padding:"12px 16px",display:"flex",gap:10,alignItems:"center"}}><Lock size={16} color="#a16207"/><span style={{fontSize:13,color:"#a16207"}}>Você está logado como <strong>{currentUser?.perfil}</strong>. Para gerenciar usuários, é necessário acesso de Administrador.</span></div>}
        </div>}
        {tab==="sistema"&&<div style={{background:C.card,border:bdr(),padding:20}}>
          <p style={{fontSize:14,fontWeight:700,color:C.tx,margin:"0 0 14px"}}>Informações do Sistema</p>
          {[["Versão","SGA Frota Municipal v4.0 — Protótipo Avançado"],["Usuário atual",`${currentUser?.nome} (${currentUser?.perfil})`],["Nível de acesso",currentUser?.role?.toUpperCase()],["Ambiente","Demonstração — dados fictícios para testes"],["Armazenamento","window.storage (artifact) → MySQL em produção"],["API Backend","Preparado para Node.js + Express (REST API)"],["Autenticação","JWT + bcrypt implementados no backend"],["Versão do protocolo","HTTP/2 + HTTPS obrigatório em produção"],["Banco de dados","MySQL 8.x ou PostgreSQL 15+"],["Backup previsto","Automático diário às 02:00h no servidor municipal"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}
        </div>}
        {tab==="notif"&&<div style={{background:C.card,border:bdr(),padding:20}}>
          <p style={{fontSize:14,fontWeight:700,color:C.tx,margin:"0 0 14px"}}>Configurações de Notificação</p>
          {[["CNH vencendo","Alertar 90 dias antes","ok"],["Seguro vencendo","Alertar 30 dias antes","ok"],["Revisão preventiva","Alertar 15 dias antes","ok"],["Estoque combustível baixo","Alertar abaixo de 20%","warn"],["Consumo anormal","Desvio acima de 20%","info"],["E-mail de alertas","garagem@upanema.rn.gov.br","info"]].map(([l,v,tp])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.bd}`,alignItems:"center"}}><span style={{fontSize:13,color:C.tx}}>{l}</span><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:12,color:C.mu}}>{v}</span><Bdg lb="Ativo" tp={tp}/></div></div>))}
        </div>}
        {tab==="backup"&&<div style={{background:C.card,border:bdr(),padding:20}}>
          <p style={{fontSize:14,fontWeight:700,color:C.tx,margin:"0 0 14px"}}>Backup e Dados</p>
          <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",padding:14,marginBottom:14,fontSize:12,color:"#1e40af",lineHeight:1.75}}>
            <strong>Dados em uso nesta sessão:</strong> Os dados estão sendo salvos automaticamente no armazenamento local desta instância.<br/>
            <strong>Em produção:</strong> Os dados serão armazenados no banco de dados MySQL do servidor da Prefeitura Municipal de Upanema.
          </div>
          {[["Último backup automático","08/06/2025 02:00h"],["Próximo backup","09/06/2025 02:00h"],["Tamanho estimado dos dados","~2.4 MB"],["Retenção de logs","90 dias"],["Política LGPD","Dados tratados conforme Lei nº 13.709/2018"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <BtnP ch="Exportar Backup Agora" click={()=>toast("Gerando backup completo...","info")} Ic={Download}/>
            {isAdmin&&<BtnO ch="Limpar Cache" click={()=>toast("Cache limpo com sucesso.","warning")}/>}
          </div>
        </div>}
      </div>
    </div>
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS PANEL
   ═══════════════════════════════════════════════════════════ */
function NotifPanel({close,nav}) {
  const items=[{I:AlertCircle,cor:"#dc2626",t:"Seguro do QST-2B56 vence em 22 dias",s:"Ação urgente necessária"},{I:Bell,cor:"#d97706",t:"CNH de Carlos Oliveira vence em 37 dias",s:"Providenciar renovação"},{I:Wrench,cor:"#0284c7",t:"OS-0094 em execução — VW Gol",s:"Oficina São Pedro — prev. 10/06"},{I:CheckCircle,cor:"#16a34a",t:"Viagem VGM-2025-0238 concluída",s:"Ford Transit retornou às 17:45"},{I:Fuel,cor:"#1d4ed8",t:"Abastecimento ABS-0047 registrado",s:"QRZ-1A34 — 45,5L — R$ 286,20"},{I:Activity,cor:"#8b5cf6",t:"Sistema atualizado para v4.0",s:"Novas funcionalidades disponíveis"}];
  return(<div className="fu" style={{position:"fixed",top:52,right:0,width:320,background:C.card,border:bdr(),borderTop:"none",boxShadow:"0 8px 32px rgba(0,0,0,.2)",zIndex:500,maxHeight:"80vh",overflow:"auto"}}>
    <div style={{padding:"12px 16px",borderBottom:bdr(),display:"flex",justifyContent:"space-between",alignItems:"center",background:C.th,position:"sticky",top:0}}>
      <span style={{fontWeight:700,fontSize:13,color:C.tx}}>Notificações do Sistema</span>
      <button onClick={close} style={{background:"none",border:"none",cursor:"pointer",color:C.mu}}><X size={15}/></button>
    </div>
    {items.map((n,i)=>(<div key={i} style={{display:"flex",gap:12,padding:"11px 16px",borderBottom:bdr(),cursor:"pointer"}} className="hr"><n.I size={15} color={n.cor} style={{flexShrink:0,marginTop:2}}/><div><div style={{fontSize:12,fontWeight:600,color:C.tx,lineHeight:1.4}}>{n.t}</div><div style={{fontSize:11,color:C.mu}}>{n.s}</div></div></div>))}
    <div style={{padding:"10px 16px",textAlign:"center"}}><button onClick={()=>{nav("alerts");close();}} style={{fontSize:12,color:C.primary,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Ver todos os alertas →</button></div>
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════════════════ */
function Sidebar({page,setPage,open,currentUser}) {
  const role=currentUser?.role||"admin";
  const filtered=NAV.map(s=>({...s,items:(s.items||[]).filter(i=>!i.roles||i.roles.includes(role))})).filter(s=>s.items.length>0);
  const ini=currentUser?.nome?.split(" ").map(p=>p[0]).join("").slice(0,2)||"?";
  const roleColor={"admin":"#dc2626","gestor":"#d97706","secretario":"#0284c7","supervisor":"#16a34a","motorista":"#7c3aed","auditor":"#64748b"};
  return(<div className={`sga-sb${open?" open":""}`}>
    <div style={{padding:"18px 16px 14px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
      <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:7}}>
        <div style={{width:36,height:36,background:"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Truck size={18} color="white"/></div>
        <div><div style={{fontSize:9,fontWeight:700,color:"#60a5fa",letterSpacing:".14em",textTransform:"uppercase"}}>Prefeitura de Upanema</div><div style={{fontSize:14,fontWeight:800,color:"white",lineHeight:1.2}}>Upanema — RN</div></div>
      </div>
      <div style={{fontSize:9,color:"rgba(148,163,184,.5)",letterSpacing:".07em",textTransform:"uppercase"}}>Sistema de Gestão da Frota</div>
    </div>
    <nav style={{flex:1,padding:"8px 0"}}>
      {filtered.map((sec,si)=>(<div key={si}>
        {sec.sec&&<div style={{padding:"12px 16px 4px",fontSize:9,fontWeight:700,color:"rgba(148,163,184,.38)",letterSpacing:".14em",textTransform:"uppercase"}}>{sec.sec}</div>}
        {sec.items.map(item=>{const on=page===item.id;return(
          <button key={item.id} onClick={()=>setPage(item.id)} className={on?"":"ni"}
            style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"9px 16px",background:on?"#1d4ed8":"none",border:"none",borderLeft:on?"3px solid #93c5fd":"3px solid transparent",cursor:"pointer",textAlign:"left",boxSizing:"border-box"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><item.ic size={15} color={on?"white":"rgba(203,213,225,.65)"}/><span style={{fontSize:13,fontWeight:on?600:400,color:on?"white":"rgba(203,213,225,.88)",fontFamily:"inherit"}}>{item.lb}</span></div>
            {item.badge&&<span style={{background:on?"rgba(255,255,255,.22)":"#dc2626",color:"white",fontSize:10,fontWeight:700,padding:"1px 6px",minWidth:18,textAlign:"center",flexShrink:0}}>{item.badge}</span>}
          </button>
        );})}
      </div>))}
    </nav>
    <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:32,height:32,background:roleColor[role]||"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0}}>{ini}</div>
        <div style={{minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:"white",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser?.nome||"Usuário"}</div><div style={{fontSize:10,color:"rgba(148,163,184,.5)",textTransform:"capitalize"}}>{currentUser?.perfil||"—"}</div></div>
      </div>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════ */
function Header({page,logout,nav,dm,setDm,notif,setNotif,onMenu}) {
  return(<div style={{height:52,background:C.card,borderBottom:bdr(),display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",position:"sticky",top:0,zIndex:90,gap:8}}>
    <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0,flex:1}}>
      <button className="ham" onClick={onMenu} aria-label="Menu"><Menu size={19}/></button>
      <span style={{fontSize:10,color:C.mu,textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap"}} className="no-mob">SGA Frota Municipal</span>
      <span style={{color:C.bd}} className="no-mob">›</span>
      <span style={{fontSize:14,fontWeight:700,color:C.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{PL[page]||page}</span>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
      <div style={{position:"relative"}} className="no-mob"><Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:C.mu}}/><input placeholder="Busca rápida..." style={{border:bdr(C.ibd),padding:"6px 12px 6px 26px",fontSize:12,width:180,fontFamily:"inherit"}}/></div>
      <button onClick={()=>setDm(!dm)} title={dm?"Modo claro":"Modo escuro"} style={{background:"none",border:bdr(),padding:"5px 7px",cursor:"pointer",color:C.mu,display:"flex",alignItems:"center"}}>{dm?<Sun size={15}/>:<Moon size={15}/>}</button>
      <div style={{position:"relative"}}>
        <button onClick={()=>setNotif(!notif)} style={{background:"none",border:"none",cursor:"pointer",padding:"5px",color:C.mu,display:"flex",alignItems:"center"}}><Bell size={17}/><span style={{position:"absolute",top:3,right:3,width:7,height:7,background:"#dc2626",borderRadius:"50%"}}/></button>
      </div>
      <div style={{width:1,height:20,background:C.bd}} className="no-mob"/>
      <button onClick={logout} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:bdr(),padding:"5px 10px",cursor:"pointer",fontSize:12,color:C.sub,fontFamily:"inherit",whiteSpace:"nowrap"}}><LogOut size={13}/><span className="no-mob">Sair</span></button>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════════════════ */
export default function App() {
  const [logged,setLogged]=useState(false);
  const [currentUser,setCurrentUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [dm,setDm]=useState(false);
  const [notif,setNotif]=useState(false);
  const [sideOpen,setSideOpen]=useState(false);
  const [ready,setReady]=useState(false);
  const {ts,add:toast}=useToast();

  const [vehicles,setVehicles]=useState(V0);
  const [drivers,setDrivers]=useState(D0);
  const [trips,setTrips]=useState(T0);
  const [fuel,setFuel]=useState(F0);
  const [maint,setMaint]=useState(M0);
  const [fines,setFines]=useState(MU0);
  const [alerts,setAlerts]=useState(AL0);

  useEffect(()=>{
    (async()=>{
      try{
        const[v,d,t,f,m,fi]=await Promise.all([Store.get("sga_v"),Store.get("sga_d"),Store.get("sga_t"),Store.get("sga_f"),Store.get("sga_m"),Store.get("sga_fi")]);
        if(v?.length)setVehicles(v);if(d?.length)setDrivers(d);if(t?.length)setTrips(t);
        if(f?.length)setFuel(f);if(m?.length)setMaint(m);if(fi?.length)setFines(fi);
      }catch{}
      setReady(true);
    })();
  },[]);

  useEffect(()=>{if(ready){Store.set("sga_v",vehicles);}}, [vehicles,ready]);
  useEffect(()=>{if(ready){Store.set("sga_d",drivers);}}, [drivers,ready]);
  useEffect(()=>{if(ready){Store.set("sga_t",trips);}}, [trips,ready]);
  useEffect(()=>{if(ready){Store.set("sga_f",fuel);}}, [fuel,ready]);
  useEffect(()=>{if(ready){Store.set("sga_m",maint);}}, [maint,ready]);
  useEffect(()=>{if(ready){Store.set("sga_fi",fines);}}, [fines,ready]);

  const goPage=p=>{setPage(p);setSideOpen(false);setNotif(false);};

  if(!logged) return(<div className="sga"><style>{CSS}</style><Login onLogin={u=>{setCurrentUser(u);setLogged(true);}}/></div>);

  const pages={
    dashboard:<Dashboard nav={goPage} vehicles={vehicles} drivers={drivers} toast={toast}/>,
    vehicles:<Vehicles vehicles={vehicles} setVehicles={setVehicles} toast={toast}/>,
    drivers:<Drivers drivers={drivers} setDrivers={setDrivers} toast={toast}/>,
    trips:<Trips vehicles={vehicles} drivers={drivers} trips={trips} setTrips={setTrips} toast={toast}/>,
    checklist:<Checklist vehicles={vehicles} drivers={drivers} toast={toast}/>,
    fuel:<FuelPage vehicles={vehicles} drivers={drivers} fuel={fuel} setFuel={setFuel} toast={toast}/>,
    maintenance:<MaintenancePage vehicles={vehicles} maint={maint} setMaint={setMaint} toast={toast}/>,
    fines:<Fines fines={fines} setFines={setFines} toast={toast}/>,
    financial:<Financial vehicles={vehicles} toast={toast}/>,
    reports:<Reports toast={toast}/>,
    suppliers:<Suppliers toast={toast}/>,
    alerts:<AlertsPage alerts={alerts} setAlerts={setAlerts} nav={goPage}/>,
    audit:<Audit/>,
    settings:<SettingsPage toast={toast} currentUser={currentUser}/>,
  };

  return(<div className={`sga${dm?" dark":""}`} style={{display:"flex",minHeight:"100vh",background:C.bg}}>
    <style>{CSS}</style>
    <div className={`sga-ov${sideOpen?" vis":""}`} onClick={()=>setSideOpen(false)}/>
    <Sidebar page={page} setPage={goPage} open={sideOpen} currentUser={currentUser}/>
    <div className="sga-mn">
      <Header page={page} logout={()=>{setLogged(false);setCurrentUser(null);setPage("dashboard");}} nav={goPage} dm={dm} setDm={setDm} notif={notif} setNotif={setNotif} onMenu={()=>setSideOpen(!sideOpen)}/>
      {notif&&<NotifPanel close={()=>setNotif(false)} nav={goPage}/>}
      {!ready&&<div style={{position:"fixed",inset:0,background:"rgba(255,255,255,.85)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}><div className="spin" style={{width:32,height:32,border:`3px solid ${C.bd}`,borderTopColor:C.primary,borderRadius:"50%"}}/><span style={{fontSize:13,color:C.mu,fontWeight:600}}>Carregando dados do sistema...</span></div>}
      <main style={{flex:1,padding:18,overflowY:"auto",maxWidth:"100%"}}>
        {pages[page]||<Dashboard nav={goPage} vehicles={vehicles} drivers={drivers} toast={toast}/>}
      </main>
      <footer style={{padding:"8px 18px",borderTop:bdr(),background:C.card,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:C.mu,flexShrink:0,flexWrap:"wrap",gap:4}}>
        <span>© 2025 Prefeitura Municipal de Upanema — RN · SGA Frota Municipal v4.0</span>
        <span style={{display:"flex",alignItems:"center",gap:5,color:C.ok,fontWeight:600}}><CheckCircle size={11}/>Dados sincronizados · Pronto para integração</span>
      </footer>
    </div>
    <Toasts ts={ts}/>
  </div>);
}
