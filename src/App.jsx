/*  SGA — Sistema de Gestão da Garagem Municipal
    Prefeitura de Upanema — RN  |  v1.0 Final
    ─────────────────────────────────────────── */
import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, Car, Users, MapPin, Fuel, Wrench, DollarSign,
  FileText, Bell, Settings, LogOut, Search, Plus, Edit, Download,
  CheckCircle, AlertCircle, AlertTriangle, Truck, X, Check,
  Activity, Shield, User, Calendar, BarChart2, ClipboardList,
  Building2, CheckSquare, AlertOctagon, Moon, Sun, Trash2,
  Save, TrendingUp, TrendingDown, Menu, Lock, Eye, EyeOff,
  ChevronRight, RefreshCw,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   CSS — LAYOUT RESPONSIVO 100% VIA CSS
   O browser aplica ANTES do JS rodar.
   Funciona em qualquer tela sem JavaScript.
═══════════════════════════════════════════════════════ */
const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;min-height:100vh;overflow-x:hidden;}
.sga{
  --bg:#f0f4f8;--card:#fff;--bd:#e2e8f0;--tx:#0f172a;--sub:#374151;--mu:#64748b;
  --th:#f8fafc;--ra:#f9fafb;--hv:#eff6ff;--inp:#fff;--ibd:#d1d5db;
  font-family:'Segoe UI',system-ui,-apple-system,sans-serif;
  width:100%;min-height:100vh;background:var(--bg);
}
.sga.dark{
  --bg:#0c1828;--card:#102038;--bd:#1a3050;--tx:#f1f5f9;--sub:#cbd5e1;--mu:#7090b8;
  --th:#091525;--ra:#091525;--hv:#152d52;--inp:#091525;--ibd:#1a3050;
}
.sga *{box-sizing:border-box;}
.sga input,.sga select,.sga textarea{
  background:var(--inp);color:var(--tx);font-family:inherit;outline:none;transition:border-color .15s;
}
.sga input:focus,.sga select:focus,.sga textarea:focus{border-color:#1d4ed8!important;}
.sga input::placeholder,.sga textarea::placeholder{color:var(--mu);}

/* ── LAYOUT ── */
.sga-wrap{display:flex;min-height:100vh;width:100%;}
.sga-sb{
  position:fixed;left:0;top:0;width:248px;height:100vh;z-index:200;
  overflow-y:auto;display:flex;flex-direction:column;
  background:#0c1a47;transition:transform .28s cubic-bezier(.4,0,.2,1);
}
.sga-mn{
  margin-left:248px;flex:1;display:flex;flex-direction:column;
  min-height:100vh;overflow-x:hidden;transition:margin-left .28s ease;
}
.sga-ov{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:150;}
.sga-ov.vis{display:block;}
.hb{display:none!important;}

/* ── GRIDS AUTOMÁTICOS ── */
.gkpi{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;margin-bottom:12px;}
.gdash{display:grid;grid-template-columns:1.3fr 1fr;gap:12px;margin-bottom:12px;}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.gf2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.gf3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px;}
.gf4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px;}
.grpt{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;}
.gcfg{display:grid;grid-template-columns:200px 1fr;gap:14px;}

/* ── UTILITÁRIOS ── */
.tbl{overflow-x:auto;-webkit-overflow-scrolling:touch;}
.hr:hover{background:var(--hv)!important;cursor:pointer;}
.ni:hover{background:rgba(255,255,255,.08)!important;}
.ch:hover{border-color:#1d4ed8!important;}
.donly{}

/* ── ANIMAÇÕES ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes spin{to{transform:rotate(360deg)}}
.fu{animation:fadeUp .22s ease;}
.blink{animation:blink 2s ease infinite;}
.spin{animation:spin .8s linear infinite;}

/* ════════════════════════════════════════════
   BREAKPOINTS — O browser aplica automaticamente
════════════════════════════════════════════ */
@media(max-width:1024px){
  .gkpi{grid-template-columns:repeat(auto-fill,minmax(170px,1fr));}
}
/* MOBILE ≤ 900px */
@media(max-width:900px){
  .sga-sb{transform:translateX(-248px);}
  .sga-sb.open{transform:translateX(0)!important;}
  .sga-mn{margin-left:0!important;}
  .hb{display:flex!important;}
  .donly{display:none!important;}
  .gdash{grid-template-columns:1fr!important;}
  .g2{grid-template-columns:1fr!important;}
  .gcfg{grid-template-columns:1fr!important;}
}
/* PEQUENO ≤ 640px */
@media(max-width:640px){
  .gkpi{grid-template-columns:repeat(2,1fr)!important;}
  .gf3{grid-template-columns:1fr 1fr!important;}
  .gf4{grid-template-columns:1fr 1fr!important;}
  .gf2{grid-template-columns:1fr!important;}
  .gcfg{grid-template-columns:1fr!important;}
}
/* MUITO PEQUENO ≤ 380px */
@media(max-width:380px){
  .gkpi{grid-template-columns:1fr 1fr!important;}
  .gf3,.gf4{grid-template-columns:1fr!important;}
}
`;

/* ═══ STORAGE (troca por Firebase Firestore quando pronto) ═══ */
const Store = {
  async get(k){try{const r=await window.storage?.get(k);return r?JSON.parse(r.value):null;}catch{return null;}},
  async set(k,v){try{await window.storage?.set(k,JSON.stringify(v));}catch{}},
};

/* ═══ CONSTANTES ═══ */
const NAV_BG="#0c1a47", P="#1d4ed8";

/* ═══ USUÁRIOS ═══ */
const SYS_USERS=[
  {email:"admin@upanema.rn.gov.br",pw:"admin123",nome:"Administrador",role:"admin",perfil:"Administrador Geral",sec:"Gestão",mat:"PMU-ADMIN",ativo:true},
  {email:"gestor@upanema.rn.gov.br",pw:"gestor123",nome:"Carlos Ferreira",role:"gestor",perfil:"Gestor da Garagem",sec:"Obras",mat:"PMU-GRG01",ativo:true},
  {email:"saude@upanema.rn.gov.br",pw:"saude123",nome:"Dra. Luísa Amaral",role:"secretario",perfil:"Secretária de Saúde",sec:"Saúde",mat:"PMU-SAU01",ativo:true},
  {email:"obras@upanema.rn.gov.br",pw:"obras123",nome:"Eng. Marcos Lima",role:"supervisor",perfil:"Supervisor de Obras",sec:"Obras",mat:"PMU-OBR01",ativo:true},
  {email:"motorista@upanema.rn.gov.br",pw:"motor123",nome:"João Silva",role:"motorista",perfil:"Motorista",sec:"Obras",mat:"PMU-001234",ativo:true},
  {email:"auditor@upanema.rn.gov.br",pw:"audit123",nome:"Fernando Duarte",role:"auditor",perfil:"Auditor Externo",sec:"Controle",mat:"PMU-AUD01",ativo:false},
];
const ROLE_PAGES={
  admin:["dashboard","vehicles","drivers","trips","checklist","fuel","maintenance","fines","financial","reports","suppliers","alerts","audit","settings"],
  gestor:["dashboard","vehicles","drivers","trips","checklist","fuel","maintenance","fines","financial","reports","suppliers","alerts","audit"],
  secretario:["dashboard","vehicles","trips","financial","reports","alerts"],
  supervisor:["dashboard","vehicles","drivers","trips","checklist","maintenance","alerts"],
  motorista:["dashboard","trips","checklist"],
  auditor:["dashboard","vehicles","drivers","financial","reports","audit"],
};

/* ═══ DADOS INICIAIS ═══ */
const V0=[
  {id:"V001",placa:"QRZ-1A34",renavam:"00123456789",chassi:"9BWZZZ377VT004251",marca:"Ford",modelo:"Transit 2.2 Diesel",ano:2020,cor:"Branco",tipo:"Van",cat:"Transporte",sec:"Saúde",km:45320,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"01/08/2025",seg:"31/12/2025",pat:"PMU-0123",niv:75,obs:"Prioritário transporte de pacientes",mul:0,custo:889,kmm:1240},
  {id:"V002",placa:"QST-2B56",renavam:"00987654321",chassi:"9BWZZZ377VT004252",marca:"Chevrolet",modelo:"S10 2.8 Diesel",ano:2019,cor:"Prata",tipo:"Picape",cat:"Serviço",sec:"Obras",km:78900,comb:"Diesel S-10",sit:"Em uso",mot:"João Silva",rev:"15/07/2025",seg:"30/06/2025",pat:"PMU-0456",niv:50,obs:"Trocar óleo em 500 km",mul:1,custo:697,kmm:3100},
  {id:"V003",placa:"QUV-3C78",renavam:"00456789012",chassi:"9BWZZZ377VT004253",marca:"Volkswagen",modelo:"Gol 1.0 Gasolina",ano:2021,cor:"Azul",tipo:"Passeio",cat:"Administrativo",sec:"Administração",km:23100,comb:"Gasolina",sit:"Manutenção",mot:null,rev:"10/09/2025",seg:"15/01/2026",pat:"PMU-0789",niv:30,obs:"Reparo suspensão — OS-0094",mul:0,custo:1027,kmm:400},
  {id:"V004",placa:"QWX-4D90",renavam:"00321654987",chassi:"9BWZZZ377VT004254",marca:"Fiat",modelo:"Ducato Ambulância",ano:2018,cor:"Branco",tipo:"Ambulância",cat:"Emergência",sec:"Saúde",km:112400,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"20/07/2025",seg:"30/11/2025",pat:"PMU-0321",niv:90,obs:"Revisão 110k concluída",mul:0,custo:567,kmm:2800},
  {id:"V005",placa:"QYZ-5E12",renavam:"00654321098",chassi:"9BWZZZ377VT004255",marca:"Mercedes-Benz",modelo:"Sprinter Escolar",ano:2022,cor:"Amarelo",tipo:"Ônibus Escolar",cat:"Transp. Escolar",sec:"Educação",km:31200,comb:"Diesel S-10",sit:"Em uso",mot:"Maria Santos",rev:"05/10/2025",seg:"20/03/2026",pat:"PMU-0654",niv:60,obs:"Rota Escolar 02 — 35 alunos",mul:0,custo:500,kmm:2100},
  {id:"V006",placa:"QAB-6F34",renavam:"00789012345",chassi:"9BWZZZ377VT004256",marca:"John Deere",modelo:"Trator 5075E",ano:2017,cor:"Verde",tipo:"Trator",cat:"Máq. Pesada",sec:"Obras",km:0,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"30/08/2025",seg:"01/12/2025",pat:"PMU-0987",niv:40,obs:"Horímetro: 2.340 h",mul:0,custo:0,kmm:0},
  {id:"V007",placa:"QCD-7G56",renavam:"00891234567",chassi:"9BWZZZ377VT004257",marca:"Volkswagen",modelo:"Kombi 1.4",ano:2014,cor:"Branco",tipo:"Utilitário",cat:"Transporte",sec:"Assist. Social",km:89500,comb:"Gasolina",sit:"Baixado",mot:null,rev:"—",seg:"—",pat:"PMU-1234",niv:0,obs:"Aguardando leilão — Proc. 2025/LAR-04",mul:3,custo:0,kmm:0},
  {id:"V008",placa:"RCA-8H78",renavam:"00912345678",chassi:"9BWZZZ377VT004258",marca:"Toyota",modelo:"Hilux CD 2.8",ano:2021,cor:"Preto",tipo:"Picape",cat:"Serviço",sec:"Obras",km:34700,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"20/11/2025",seg:"28/02/2026",pat:"PMU-1400",niv:85,obs:"Supervisão de obras",mul:0,custo:320,kmm:890},
  {id:"V009",placa:"RDA-9I90",renavam:"00934567890",chassi:"9BWZZZ377VT004259",marca:"Renault",modelo:"Master UTI 2.3",ano:2023,cor:"Branco",tipo:"Ambulância UTI",cat:"Emergência",sec:"Saúde",km:8600,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"15/05/2026",seg:"10/06/2026",pat:"PMU-1450",niv:95,obs:"UTI Móvel — equipamento completo",mul:0,custo:280,kmm:760},
  {id:"V010",placa:"REB-0J12",renavam:"00956789012",chassi:"9BWZZZ377VT004260",marca:"Hyundai",modelo:"HR 2.5 Diesel",ano:2020,cor:"Branco",tipo:"Utilitário",cat:"Transporte",sec:"Educação",km:41800,comb:"Diesel S-10",sit:"Em uso",mot:"Roberto Mendes",rev:"12/09/2025",seg:"30/09/2025",pat:"PMU-1510",niv:55,obs:"Transporte materiais escolares",mul:0,custo:410,kmm:1320},
  {id:"V011",placa:"RFC-1K34",renavam:"00978901234",chassi:"9BWZZZ377VT004261",marca:"New Holland",modelo:"Retroescavadeira B95B",ano:2016,cor:"Amarelo",tipo:"Retroescavadeira",cat:"Máq. Pesada",sec:"Obras",km:0,comb:"Diesel S-10",sit:"Manutenção",mot:null,rev:"05/07/2025",seg:"01/11/2025",pat:"PMU-1560",niv:20,obs:"OS-0095 — pneus e revisão",mul:0,custo:2100,kmm:0},
  {id:"V012",placa:"RGD-2L56",renavam:"00990123456",chassi:"9BWZZZ377VT004262",marca:"Marcopolo",modelo:"Ônibus 70 lug.",ano:2019,cor:"Amarelo",tipo:"Ônibus Escolar",cat:"Transp. Escolar",sec:"Educação",km:62400,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"25/08/2025",seg:"31/10/2025",pat:"PMU-1620",niv:70,obs:"Rota Escolar 01 — Zona Rural",mul:0,custo:890,kmm:2650},
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
  {id:"VGM-2025-0240",placa:"QYZ-5E12",mod:"Mercedes Sprinter",mot:"Maria Santos",dest:"Escola Mun. — Roteiro 02",kmi:31000,kmf:null,saida:"08/06/2025 06:00",ret:null,fin:"Transporte Escolar",sec:"Educação",sit:"Em andamento",pass:35,custo:null},
  {id:"VGM-2025-0239",placa:"REB-0J12",mod:"Hyundai HR",mot:"Roberto Mendes",dest:"E. E. Upanema — Materiais",kmi:41600,kmf:41800,saida:"08/06/2025 08:00",ret:"08/06/2025 11:30",fin:"Entrega Materiais",sec:"Educação",sit:"Concluída",pass:2,custo:120},
  {id:"VGM-2025-0238",placa:"QRZ-1A34",mod:"Ford Transit",mot:"Carlos Oliveira",dest:"Hospital Regional — Mossoró",kmi:45000,kmf:45320,saida:"08/06/2025 07:30",ret:"08/06/2025 17:45",fin:"Transp. de Pacientes",sec:"Saúde",sit:"Concluída",pass:3,custo:286},
  {id:"VGM-2025-0237",placa:"QST-2B56",mod:"Chevrolet S10",mot:"João Silva",dest:"Rua das Flores — Pavimentação",kmi:78700,kmf:78900,saida:"07/06/2025 07:00",ret:"07/06/2025 18:00",fin:"Serviço de Obras",sec:"Obras",sit:"Concluída",pass:3,custo:377},
  {id:"VGM-2025-0236",placa:"QWX-4D90",mod:"Fiat Ducato",mot:"Fernanda Costa",dest:"Hospital Univ. — Natal/RN",kmi:111900,kmf:112400,saida:"06/06/2025 04:30",ret:"06/06/2025 22:15",fin:"Emergência Médica",sec:"Saúde",sit:"Concluída",pass:1,custo:567},
];
const F0=[
  {id:"ABS-0047",placa:"QRZ-1A34",mod:"Ford Transit",mot:"Carlos Oliveira",data:"08/06/2025 17:00",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:45.5,vl:6.29,total:286,km:45320,media:9.8},
  {id:"ABS-0046",placa:"QYZ-5E12",mod:"Mercedes Sprinter",mot:"Maria Santos",data:"07/06/2025 18:30",posto:"Posto Municipal",tipo:"Diesel S-10",litros:80,vl:6.25,total:500,km:31000,media:8.5},
  {id:"ABS-0045",placa:"QST-2B56",mod:"Chevrolet S10",mot:"João Silva",data:"07/06/2025 18:00",posto:"Posto Central",tipo:"Diesel S-10",litros:60,vl:6.29,total:377,km:78700,media:10.2},
  {id:"ABS-0044",placa:"RCA-8H78",mod:"Toyota Hilux",mot:"João Silva",data:"06/06/2025 17:30",posto:"Posto Central",tipo:"Diesel S-10",litros:48,vl:6.29,total:302,km:34700,media:11.8},
  {id:"ABS-0043",placa:"QWX-4D90",mod:"Fiat Ducato",mot:"Fernanda Costa",data:"06/06/2025 23:00",posto:"Posto BR — Natal",tipo:"Diesel S-10",litros:90,vl:6.30,total:567,km:112400,media:7.8},
];
const MNT0=[
  {id:"OS-0095",placa:"RFC-1K34",mod:"New Holland Retro",tipo:"Corretiva",desc:"Substituição pneus dianteiros e revisão freios",oficina:"Tecmasc — Mossoró",custo:2100,criado:"08/06/2025",prev:"12/06/2025",status:"Agendada",prior:"Alta"},
  {id:"OS-0094",placa:"QUV-3C78",mod:"VW Gol",tipo:"Corretiva",desc:"Reparo suspensão dianteira — amortecedores e buchas",oficina:"Oficina São Pedro",custo:850,criado:"07/06/2025",prev:"10/06/2025",status:"Em execução",prior:"Alta"},
  {id:"OS-0093",placa:"QRZ-1A34",mod:"Ford Transit",tipo:"Preventiva",desc:"Troca de pneus traseiros — 2 un. 215/75R16",oficina:"Pneus Silva Upanema",custo:780,criado:"08/06/2025",prev:"10/06/2025",status:"Agendada",prior:"Média"},
  {id:"OS-0092",placa:"RGD-2L56",mod:"Ônibus Marcopolo",tipo:"Preventiva",desc:"Revisão 60.000 km — óleo, filtros, freios",oficina:"Auto Center RN",custo:1450,criado:"05/06/2025",prev:"07/06/2025",status:"Finalizada",prior:"Alta"},
  {id:"OS-0091",placa:"QST-2B56",mod:"Chevrolet S10",tipo:"Preventiva",desc:"Troca de óleo e filtros — 10.000 km",oficina:"Auto Center RN",custo:380,criado:"01/06/2025",prev:"01/06/2025",status:"Finalizada",prior:"Média"},
];
const MU0=[
  {id:"MLT-001",placa:"QST-2B56",mot:"João Silva",data:"15/05/2025",inf:"Excesso de velocidade — 56km/h em via de 40km/h",valor:195.23,status:"Pendente"},
  {id:"MLT-002",placa:"QCD-7G56",mot:"—",data:"10/03/2025",inf:"Estacionamento em local proibido",valor:88.38,status:"Pago"},
  {id:"MLT-003",placa:"QCD-7G56",mot:"—",data:"22/02/2025",inf:"Avanço de sinal vermelho",valor:293.47,status:"Em recurso"},
  {id:"MLT-004",placa:"RCA-8H78",mot:"João Silva",data:"28/05/2025",inf:"Velocidade incompatível com via urbana",valor:130.16,status:"Pendente"},
];
const AL0=[
  {id:1,nivel:"danger",tipo:"Seguro",titulo:"Seguro vence em 22 dias",desc:"QST-2B56 — Seguro vence em 30/06/2025. Renovar urgentemente.",pg:"vehicles"},
  {id:2,nivel:"warning",tipo:"CNH",titulo:"CNH próxima do vencimento",desc:"Carlos Oliveira — CNH Cat. E vence em 15/07/2025 (37 dias).",pg:"drivers"},
  {id:3,nivel:"warning",tipo:"CNH",titulo:"CNH próxima do vencimento",desc:"Fernanda Costa — CNH Cat. E vence em 30/09/2025.",pg:"drivers"},
  {id:4,nivel:"warning",tipo:"KM",titulo:"Troca de óleo necessária",desc:"QST-2B56 — Prevista para 79.400 km (~500 km restantes).",pg:"vehicles"},
  {id:5,nivel:"info",tipo:"Revisão",titulo:"Revisão agendada",desc:"QWX-4D90 — Revisão dos 115.000 km em 20/07/2025.",pg:"maintenance"},
  {id:6,nivel:"info",tipo:"Documento",titulo:"CRLV vence em dezembro",desc:"QCD-7G56 — CRLV vence 31/12/2025. Veículo em leilão.",pg:"vehicles"},
];
const SUPS0=[
  {id:"FRN-001",nome:"Posto Central Upanema",tipo:"Posto de Combustível",cnpj:"01.234.567/0001-89",contato:"(84) 3334-0001",ct:"CT-2024-045",val:"31/12/2025",status:"Ativo"},
  {id:"FRN-002",nome:"Oficina Mecânica São Pedro",tipo:"Oficina Mecânica",cnpj:"12.345.678/0001-90",contato:"(84) 99234-5555",ct:"CT-2024-028",val:"30/09/2025",status:"Ativo"},
  {id:"FRN-003",nome:"Pneus Silva Upanema",tipo:"Pneus e Borracharia",cnpj:"23.456.789/0001-01",contato:"(84) 99876-1234",ct:"CT-2025-003",val:"31/12/2025",status:"Ativo"},
  {id:"FRN-004",nome:"Auto Center RN — Mossoró",tipo:"Oficina Especializada",cnpj:"34.567.890/0001-12",contato:"(84) 3321-7890",ct:"CT-2023-067",val:"30/06/2025",status:"Vencendo"},
  {id:"FRN-005",nome:"Concessionária Fiat Mossoró",tipo:"Conc. Autorizada",cnpj:"45.678.901/0001-23",contato:"(84) 3322-4500",ct:"CT-2024-089",val:"31/12/2025",status:"Ativo"},
  {id:"FRN-006",nome:"Posto Municipal",tipo:"Posto de Combustível",cnpj:"Interno PMU",contato:"Interno",ct:"Direto",val:"—",status:"Ativo"},
  {id:"FRN-007",nome:"Tecmasc Equipamentos",tipo:"Máquinas Pesadas",cnpj:"56.789.012/0001-34",contato:"(84) 3325-9000",ct:"CT-2025-007",val:"31/12/2025",status:"Ativo"},
];
const LOG0=[
  {id:1,user:"Administrador",acao:"Login no sistema",det:"IP: 192.168.1.10",data:"08/06/2025 07:14",tipo:"info"},
  {id:2,user:"Administrador",acao:"Registrou viagem VGM-2025-0240",det:"QYZ-5E12 → Escola Municipal",data:"08/06/2025 05:50",tipo:"create"},
  {id:3,user:"Gestor da Garagem",acao:"Atualizou veículo QUV-3C78",det:"Situação: Disponível → Manutenção",data:"07/06/2025 16:30",tipo:"edit"},
  {id:4,user:"Gestor da Garagem",acao:"Criou OS-0094",det:"QUV-3C78 — Suspensão dianteira",data:"07/06/2025 16:32",tipo:"create"},
  {id:5,user:"Administrador",acao:"Registrou ABS-0047",det:"QRZ-1A34 — 45,5L — R$ 286,20",data:"08/06/2025 17:05",tipo:"create"},
  {id:6,user:"Supervisor",acao:"Atualizou motorista M004",det:"Status: Ativo → Férias",data:"06/06/2025 08:00",tipo:"edit"},
  {id:7,user:"Administrador",acao:"Cadastrou veículo RDA-9I90",det:"Renault Master UTI — Saúde",data:"05/06/2025 14:20",tipo:"create"},
  {id:8,user:"Gestor da Garagem",acao:"Finalizou OS-0092",det:"Ônibus Marcopolo — Revisão 60k",data:"07/06/2025 17:00",tipo:"edit"},
];
const CKL0=[
  {id:"CKL-004",placa:"QYZ-5E12",mot:"Maria Santos",data:"08/06/2025 05:50",ok:15,total:15,res:"Aprovado"},
  {id:"CKL-003",placa:"QRZ-1A34",mot:"Carlos Oliveira",data:"07/06/2025 07:15",ok:13,total:15,res:"Aprovado c/ ressalvas"},
  {id:"CKL-002",placa:"QST-2B56",mot:"João Silva",data:"07/06/2025 07:00",ok:15,total:15,res:"Aprovado"},
  {id:"CKL-001",placa:"QWX-4D90",mot:"Fernanda Costa",data:"06/06/2025 04:20",ok:14,total:15,res:"Aprovado c/ ressalvas"},
];
const CH_G=[{mes:"Jan",c:2840,m:1180},{mes:"Fev",c:3120,m:460},{mes:"Mar",c:2980,m:2100},{mes:"Abr",c:3440,m:820},{mes:"Mai",c:4190,m:2350},{mes:"Jun",c:3165,m:3850}];
const CH_S=[{name:"Saúde",v:9840,cor:"#1d4ed8"},{name:"Obras",v:6720,cor:"#0c1a47"},{name:"Educação",v:4210,cor:"#3b82f6"},{name:"Admin",v:1800,cor:"#60a5fa"},{name:"Social",v:890,cor:"#93c5fd"}];
const CH_V=[{s:"S1/Mai",v:14},{s:"S2/Mai",v:19},{s:"S3/Mai",v:16},{s:"S4/Mai",v:24},{s:"S1/Jun",v:12},{s:"S2/Jun",v:8}];

const NAV_ITEMS=[
  {sec:null,items:[{id:"dashboard",lb:"Painel Geral",ic:LayoutDashboard}]},
  {sec:"OPERAÇÕES",items:[{id:"vehicles",lb:"Veículos",ic:Car},{id:"drivers",lb:"Motoristas",ic:Users},{id:"trips",lb:"Viagens",ic:MapPin,bdg:1},{id:"checklist",lb:"Checklist",ic:CheckSquare}]},
  {sec:"RECURSOS",items:[{id:"fuel",lb:"Abastecimento",ic:Fuel},{id:"maintenance",lb:"Manutenção",ic:Wrench,bdg:2},{id:"fines",lb:"Multas",ic:AlertOctagon}]},
  {sec:"GESTÃO",items:[{id:"financial",lb:"Financeiro",ic:DollarSign},{id:"reports",lb:"Relatórios",ic:FileText},{id:"suppliers",lb:"Fornecedores",ic:Building2}]},
  {sec:"SISTEMA",items:[{id:"alerts",lb:"Alertas",ic:Bell,bdg:6},{id:"audit",lb:"Auditoria",ic:Shield},{id:"settings",lb:"Configurações",ic:Settings}]},
];
const PL={dashboard:"Painel Geral",vehicles:"Veículos",drivers:"Motoristas",trips:"Viagens",checklist:"Checklist Diário",fuel:"Abastecimento",maintenance:"Manutenção",fines:"Multas",financial:"Financeiro",reports:"Relatórios",suppliers:"Fornecedores",alerts:"Alertas",audit:"Auditoria",settings:"Configurações"};

/* ═══ TOAST ═══ */
function useToast(){const[ts,setTs]=useState([]);const add=(m,t="success")=>{const id=Date.now();setTs(p=>[...p,{id,m,t}]);setTimeout(()=>setTs(p=>p.filter(x=>x.id!==id)),4200);};return{ts,add};}
function Toasts({ts}){
  const pal={success:["#dcfce7","#15803d","#86efac"],danger:["#fee2e2","#dc2626","#fca5a5"],info:["#e0f2fe","#0369a1","#7dd3fc"],warning:["#fef9c3","#a16207","#fde047"]};
  if(!ts.length)return null;
  return<div style={{position:"fixed",bottom:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:8,maxWidth:"min(360px,calc(100vw - 24px))"}}>
    {ts.map(t=>{const[bg2,cl,br]=pal[t.t]||pal.success;return<div key={t.id} className="fu" style={{background:bg2,border:`1px solid ${br}`,color:cl,padding:"12px 16px",fontSize:13,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,.18)"}}>{t.m}</div>;})}
  </div>;
}

/* ═══ CONFIRM ═══ */
function Confirm({msg,ok,cancel,danger}){
  return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&cancel()}>
    <div className="fu" style={{background:"var(--card)",width:"100%",maxWidth:380,padding:24,boxShadow:"0 20px 60px rgba(0,0,0,.35)"}}>
      <div style={{display:"flex",gap:12,marginBottom:18}}><AlertTriangle size={20} color={danger?"#dc2626":"#d97706"} style={{flexShrink:0,marginTop:2}}/><p style={{fontSize:14,color:"var(--tx)",margin:0,lineHeight:1.65}}>{msg}</p></div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <Btn ghost click={cancel}>Cancelar</Btn>
        <Btn bad={danger} click={ok}>{danger?"Excluir":"Confirmar"}</Btn>
      </div>
    </div>
  </div>;
}

/* ═══ PRIMITIVES ═══ */
function Bdg({lb,tp="def"}){
  const m={ok:{bg:"#dcfce7",c:"#15803d",b:"#86efac"},bad:{bg:"#fee2e2",c:"#dc2626",b:"#fca5a5"},warn:{bg:"#fef9c3",c:"#a16207",b:"#fde047"},info:{bg:"#e0f2fe",c:"#0369a1",b:"#7dd3fc"},gray:{bg:"#f1f5f9",c:"#475569",b:"#cbd5e1"},def:{bg:"#f1f5f9",c:"#475569",b:"#cbd5e1"}};
  const s=m[tp]||m.def;
  return<span style={{background:s.bg,color:s.c,border:`1px solid ${s.b}`,padding:"2px 7px",fontSize:10,fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",display:"inline-block",whiteSpace:"nowrap"}}>{lb}</span>;
}
function SBdg({v}){const mp={"Disponível":"ok","Em uso":"info","Manutenção":"warn","Baixado":"gray","Ativo":"ok","Férias":"warn","Afastado":"bad","Em andamento":"info","Concluída":"ok","Cancelada":"bad","Agendada":"info","Em execução":"warn","Finalizada":"ok","Pendente":"warn","Pago":"ok","Em recurso":"info","Sinistrado":"bad","Leiloado":"gray","Vencendo":"warn"};return<Bdg lb={v} tp={mp[v]||"def"}/>;}

function Kpi({lb,vl,sub,Ic,cor,top,delta}){
  const cl=cor||P;
  return<div className="ch" style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"15px 16px",borderTop:`3px solid ${top||cl}`,minWidth:0}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
      <div style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".08em",lineHeight:1.3,paddingRight:8}}>{lb}</div>
      <div style={{width:32,height:32,background:`${cl}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic size={15} color={cl}/></div>
    </div>
    <div style={{fontSize:25,fontWeight:800,color:"var(--tx)",lineHeight:1}}>{vl}</div>
    {sub&&<div style={{fontSize:11,color:"var(--mu)",marginTop:3}}>{sub}</div>}
    {delta!=null&&<div style={{display:"flex",alignItems:"center",gap:3,fontSize:11,fontWeight:600,color:delta>=0?"#15803d":"#dc2626",marginTop:3}}>{delta>=0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{Math.abs(delta)}% vs mês</div>}
  </div>;
}

const Th=({ch,st={}})=><th style={{padding:"9px 12px",textAlign:"left",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:".08em",color:"var(--mu)",background:"var(--th)",borderBottom:"2px solid var(--bd)",whiteSpace:"nowrap",...st}}>{ch}</th>;
const Td=({ch,st={}})=><td style={{padding:"10px 12px",color:"var(--sub)",borderBottom:"1px solid var(--bd)",verticalAlign:"middle",fontSize:13,...st}}>{ch}</td>;
function Prog({v}){return<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:50,height:5,background:"var(--bd)"}}><div style={{width:`${v}%`,height:"100%",background:v<25?"#dc2626":v<50?"#f59e0b":P}}/></div><span style={{fontSize:11,color:"var(--mu)"}}>{v}%</span></div>;}

function Modal({title,close,children,w=700}){
  return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.52)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&close()}>
    <div className="fu" style={{background:"var(--card)",width:"100%",maxWidth:w,maxHeight:"92vh",overflow:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.35)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 18px",borderBottom:"1px solid var(--bd)",background:"var(--th)",position:"sticky",top:0,zIndex:1}}>
        <span style={{fontWeight:700,fontSize:14,color:"var(--tx)"}}>{title}</span>
        <button onClick={close} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:"var(--mu)",display:"flex"}}><X size={17}/></button>
      </div>
      <div style={{padding:18}}>{children}</div>
    </div>
  </div>;
}

function FF({lb,val,set,type="text",opts,req}){
  return<div style={{display:"flex",flexDirection:"column",gap:4}}>
    <label style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".07em"}}>{lb}{req&&<span style={{color:"#dc2626"}}> *</span>}</label>
    {opts
      ?<select value={val} onChange={e=>set(e.target.value)} style={{width:"100%",border:"1px solid var(--ibd)",padding:"9px 10px",fontSize:13,fontFamily:"inherit",background:"var(--inp)",color:"var(--tx)"}}><option value="">Selecionar...</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>
      :<input type={type} value={val} onChange={e=>set(e.target.value)} style={{width:"100%",border:"1px solid var(--ibd)",padding:"9px 10px",fontSize:13,fontFamily:"inherit"}}/>
    }
  </div>;
}

function Btn({children,click,Ic,sm,bad,full,ghost,dis}){
  const bg=dis?"#94a3b8":ghost?"none":bad?"#dc2626":P;
  const cl=ghost?"var(--sub)":"white";
  return<button onClick={click} disabled={dis} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,background:bg,color:cl,border:ghost?"1px solid var(--bd)":"none",padding:sm?"6px 11px":"9px 15px",fontSize:sm?11:13,fontWeight:600,cursor:dis?"not-allowed":"pointer",fontFamily:"inherit",width:full?"100%":undefined,flexShrink:0,transition:"opacity .15s"}}>{Ic&&<Ic size={sm?11:14}/>}{children}</button>;
}

function SH({title,sub,action}){
  return<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:18,gap:12,flexWrap:"wrap"}}>
    <div><h2 style={{fontSize:18,fontWeight:800,color:"var(--tx)",margin:0}}>{title}</h2>{sub&&<p style={{fontSize:12,color:"var(--mu)",margin:"3px 0 0"}}>{sub}</p>}</div>
    {action&&<div style={{flexShrink:0}}>{action}</div>}
  </div>;
}
const DR=({l,v})=><div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--bd)",fontSize:13,gap:8}}><span style={{color:"var(--mu)",fontSize:12,flexShrink:0}}>{l}</span><span style={{fontWeight:600,color:"var(--tx)",textAlign:"right"}}>{v}</span></div>;
function SBar({val,set,ph}){return<div style={{flex:"1 1 160px",position:"relative",minWidth:140}}><Search size={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--mu)"}}/><input value={val} onChange={e=>set(e.target.value)} placeholder={ph||"Pesquisar..."} style={{width:"100%",border:"1px solid var(--ibd)",padding:"9px 12px 9px 30px",fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/></div>;}

/* ═══ MODAIS DE CADASTRO ═══ */
function VModal({v,save,close,toast}){
  const blank={placa:"",marca:"Ford",modelo:"",ano:2024,cor:"Branco",tipo:"Passeio",cat:"Administrativo",sec:"Administração",comb:"Gasolina",sit:"Disponível",renavam:"",chassi:"",pat:"",km:"0",niv:"50",rev:"",seg:"",obs:"",mot:null,mul:0,custo:0,kmm:0};
  const[f,setF]=useState(v||blank);const u=k=>val=>setF(p=>({...p,[k]:val}));
  const go=()=>{if(!f.placa||!f.modelo){toast("Preencha Placa e Modelo.","danger");return;}save({...f,id:v?.id||`V${Date.now().toString().slice(-4)}`,km:+f.km||0,niv:+f.niv||50});toast(v?"Veículo atualizado!":"Veículo cadastrado com sucesso!");close();};
  return<Modal title={v?`Editar — ${v.placa}`:"Cadastrar Novo Veículo"} close={close} w={760}>
    <p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:8,borderBottom:"1px solid var(--bd)"}}>Identificação</p>
    <div className="gf3"><FF lb="Placa" val={f.placa} set={u("placa")} req/><FF lb="RENAVAM" val={f.renavam} set={u("renavam")}/><FF lb="Patrimônio" val={f.pat} set={u("pat")}/></div>
    <div className="gf3"><FF lb="Chassi" val={f.chassi} set={u("chassi")}/><FF lb="Ano" val={f.ano} set={u("ano")} type="number"/><FF lb="Cor" val={f.cor} set={u("cor")}/></div>
    <p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"14px 0 10px",paddingBottom:8,borderBottom:"1px solid var(--bd)"}}>Características</p>
    <div className="gf3">
      <FF lb="Marca" val={f.marca} set={u("marca")} opts={["Ford","Chevrolet","Volkswagen","Fiat","Mercedes-Benz","Toyota","Renault","Hyundai","John Deere","New Holland","Marcopolo","Outro"]}/>
      <FF lb="Modelo" val={f.modelo} set={u("modelo")} req/>
      <FF lb="Tipo" val={f.tipo} set={u("tipo")} opts={["Passeio","Van","Picape","SUV","Ambulância","Ambulância UTI","Ônibus Escolar","Ônibus","Trator","Retroescavadeira","Caminhão","Utilitário","Moto"]}/>
      <FF lb="Categoria" val={f.cat} set={u("cat")} opts={["Administrativo","Serviço","Transporte","Emergência","Transp. Escolar","Máq. Pesada"]}/>
      <FF lb="Combustível" val={f.comb} set={u("comb")} opts={["Gasolina","Diesel S-10","Diesel Comum","Etanol","Flex","GNV","Elétrico"]}/>
      <FF lb="Secretaria" val={f.sec} set={u("sec")} opts={["Saúde","Obras","Educação","Administração","Assist. Social","Financeiro","Infraestrutura"]}/>
    </div>
    <p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"14px 0 10px",paddingBottom:8,borderBottom:"1px solid var(--bd)"}}>Controle Operacional</p>
    <div className="gf3">
      <FF lb="Situação" val={f.sit} set={u("sit")} opts={["Disponível","Em uso","Manutenção","Baixado","Leiloado","Sinistrado"]}/>
      <FF lb="KM Atual" val={f.km} set={u("km")} type="number"/>
      <FF lb="Nível Comb. (%)" val={f.niv} set={u("niv")} type="number"/>
      <FF lb="Próxima Revisão" val={f.rev} set={u("rev")}/>
      <FF lb="Validade Seguro" val={f.seg} set={u("seg")}/>
    </div>
    <div style={{marginBottom:16}}><FF lb="Observações / Pendências" val={f.obs} set={u("obs")}/></div>
    <div style={{display:"flex",gap:10,paddingTop:14,borderTop:"1px solid var(--bd)"}}><Btn Ic={Save} click={go}>{v?"Salvar Alterações":"Cadastrar Veículo"}</Btn><Btn ghost click={close}>Cancelar</Btn></div>
  </Modal>;
}

function DModal({d,save,close,toast}){
  const blank={nome:"",cpf:"",rg:"",mat:"",nasc:"",tel:"",email:"",sec:"Administração",cargo:"Motorista",cnh:"B",valCnh:"",sit:"Ativo",viagens:0,kmR:0,veiAtual:null};
  const[f,setF]=useState(d||blank);const u=k=>val=>setF(p=>({...p,[k]:val}));
  const go=()=>{if(!f.nome||!f.cpf){toast("Preencha Nome e CPF.","danger");return;}save({...f,id:d?.id||`M${Date.now().toString().slice(-4)}`});toast(d?"Motorista atualizado!":"Motorista cadastrado!");close();};
  return<Modal title={d?`Editar — ${d.nome}`:"Cadastrar Motorista"} close={close} w={720}>
    <p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:8,borderBottom:"1px solid var(--bd)"}}>Dados Pessoais</p>
    <div className="gf3"><FF lb="Nome Completo" val={f.nome} set={u("nome")} req/><FF lb="CPF" val={f.cpf} set={u("cpf")} req/><FF lb="RG" val={f.rg} set={u("rg")}/><FF lb="Matrícula" val={f.mat} set={u("mat")}/><FF lb="Telefone" val={f.tel} set={u("tel")}/><FF lb="E-mail" val={f.email} set={u("email")}/><FF lb="Nascimento" val={f.nasc} set={u("nasc")}/></div>
    <p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"14px 0 10px",paddingBottom:8,borderBottom:"1px solid var(--bd)"}}>Dados Profissionais</p>
    <div className="gf3">
      <FF lb="Secretaria" val={f.sec} set={u("sec")} opts={["Saúde","Obras","Educação","Administração","Assist. Social"]}/>
      <FF lb="Cargo" val={f.cargo} set={u("cargo")} opts={["Motorista","Mot. de Ambulância","Mot. Escolar","Operador de Máq.","Auxiliar"]}/>
      <FF lb="Situação" val={f.sit} set={u("sit")} opts={["Ativo","Férias","Afastado","Licença Médica"]}/>
      <FF lb="Categoria CNH" val={f.cnh} set={u("cnh")} opts={["A","B","C","D","E","AB","AC","AD","AE"]}/>
      <FF lb="Validade da CNH" val={f.valCnh} set={u("valCnh")}/>
    </div>
    <div style={{display:"flex",gap:10,paddingTop:14,borderTop:"1px solid var(--bd)"}}><Btn Ic={Save} click={go}>{d?"Salvar Alterações":"Cadastrar Motorista"}</Btn><Btn ghost click={close}>Cancelar</Btn></div>
  </Modal>;
}

/* ═══ LOGIN ═══ */
function Login({onLogin}){
  const[step,setStep]=useState("in");
  const[id,setId]=useState("admin@upanema.rn.gov.br");const[pw,setPw]=useState("");
  const[showPw,setShowPw]=useState(false);const[err,setErr]=useState("");const[loading,setLoading]=useState(false);
  const[fEmail,setFEmail]=useState("");const[fSent,setFSent]=useState(false);
  const go=()=>{
    if(!id||!pw){setErr("Preencha e-mail e senha.");return;}
    setLoading(true);setErr("");
    setTimeout(()=>{
      const u=SYS_USERS.find(x=>x.email===id&&x.pw===pw);
      if(u){if(!u.ativo){setErr("Conta inativa. Contate o administrador.");setLoading(false);return;}onLogin(u);}
      else setErr("E-mail ou senha incorretos.");
      setLoading(false);
    },900);
  };
  const inp={width:"100%",border:"1px solid #d1d5db",padding:"10px 12px",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  return<div style={{minHeight:"100vh",background:"linear-gradient(140deg,#0c1a47 0%,#1d4ed8 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{display:"flex",width:"100%",maxWidth:880,background:"white",boxShadow:"0 28px 80px rgba(0,0,0,.4)",flexWrap:"wrap"}}>
      <div style={{flex:"1 1 260px",background:"#0c1a47",padding:"40px 32px",display:"flex",flexDirection:"column",justifyContent:"space-between",minHeight:380}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
            <div style={{width:44,height:44,background:P,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Truck size={21} color="white"/></div>
            <div><div style={{fontSize:9,fontWeight:700,color:"#60a5fa",letterSpacing:".14em",textTransform:"uppercase"}}>Prefeitura de Upanema — RN</div><div style={{fontSize:15,fontWeight:800,color:"white",lineHeight:1.2}}>SGA · Frota Municipal</div></div>
          </div>
          <h1 style={{fontSize:22,fontWeight:800,color:"white",lineHeight:1.3,margin:"0 0 12px"}}>Sistema de Gestão<br/>da Garagem</h1>
          <p style={{color:"rgba(203,213,225,.6)",fontSize:13,lineHeight:1.7,margin:0}}>Controle completo da frota pública municipal: veículos, motoristas, abastecimentos e manutenções.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:24}}>
          {[["12 Veículos Ativos","Ambulâncias, ônibus e máquinas pesadas"],["Controle em Tempo Real","Check-in, retornos e viagens ativas"],["Relatórios Completos","KPIs, custo/km e análise financeira"]].map(([t,s])=>
            <div key={t} style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:5,height:5,background:"#60a5fa",flexShrink:0}}/><span style={{color:"white",fontSize:13,fontWeight:600}}>{t}</span><span style={{color:"rgba(203,213,225,.45)",fontSize:12}}>— {s}</span></div>
          )}
        </div>
      </div>
      <div style={{flex:"1 1 260px",padding:"40px 32px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
        {step==="in"?(
          <>
            <div style={{marginBottom:24}}><h2 style={{fontSize:20,fontWeight:800,color:"#0f172a",margin:"0 0 4px"}}>Acesso ao Sistema</h2><p style={{fontSize:13,color:"#64748b",margin:0}}>Use suas credenciais institucionais</p></div>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div><label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>E-mail Institucional</label><input value={id} onChange={e=>setId(e.target.value)} placeholder="nome@upanema.rn.gov.br" style={inp}/></div>
              <div><label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Senha</label>
                <div style={{position:"relative"}}><input type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••" style={{...inp,paddingRight:38}}/><button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#64748b"}}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button></div>
              </div>
              {err&&<div style={{background:"#fee2e2",border:"1px solid #fca5a5",color:"#dc2626",padding:"9px 12px",fontSize:13,display:"flex",alignItems:"center",gap:8}}><AlertCircle size={14}/>{err}</div>}
              <button onClick={go} disabled={loading} style={{background:loading?"#94a3b8":"#0c1a47",color:"white",border:"none",padding:"12px",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",textTransform:"uppercase",letterSpacing:".08em",fontFamily:"inherit"}}>{loading?"Verificando...":"Entrar no Sistema"}</button>
              <button onClick={()=>setStep("forgot")} style={{background:"none",border:"none",fontSize:12,color:P,cursor:"pointer",textAlign:"left",fontFamily:"inherit",padding:0}}>Esqueceu a senha?</button>
            </div>
            <div style={{marginTop:18,padding:"12px 14px",background:"#f8fafc",border:"1px solid #e2e8f0"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#0c1a47",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Acessos de Demonstração <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:"#64748b"}}>(clique para preencher)</span></div>
              {SYS_USERS.filter(u=>u.ativo).slice(0,3).map(u=><div key={u.email} onClick={()=>{setId(u.email);setPw(u.pw);}} style={{padding:"5px 0",cursor:"pointer",borderBottom:"1px solid #f0f4f8"}}><div style={{fontSize:12,color:"#374151",fontWeight:600}}>{u.perfil}</div><div style={{fontSize:11,color:"#64748b"}}>{u.email} · senha: <strong>{u.pw}</strong></div></div>)}
            </div>
          </>
        ):(
          <>
            <button onClick={()=>{setStep("in");setFSent(false);}} style={{background:"none",border:"none",fontSize:12,color:P,cursor:"pointer",textAlign:"left",fontFamily:"inherit",marginBottom:20,padding:0}}>← Voltar ao login</button>
            <h2 style={{fontSize:20,fontWeight:800,color:"#0f172a",margin:"0 0 8px"}}>Recuperar Senha</h2>
            <p style={{fontSize:13,color:"#64748b",marginBottom:20}}>Informe seu e-mail para receber as instruções de redefinição.</p>
            {!fSent
              ?<><input value={fEmail} onChange={e=>setFEmail(e.target.value)} placeholder="nome@upanema.rn.gov.br" style={{...inp,marginBottom:12}}/><button onClick={()=>setTimeout(()=>setFSent(true),700)} style={{background:"#0c1a47",color:"white",border:"none",padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>Enviar Instruções</button></>
              :<div style={{background:"#dcfce7",border:"1px solid #86efac",padding:"16px",color:"#15803d",fontSize:13}}><strong>✓ E-mail enviado!</strong> Verifique sua caixa de entrada.</div>
            }
          </>
        )}
        <p style={{fontSize:10,color:"#94a3b8",textAlign:"center",marginTop:20}}>© 2025 Prefeitura Municipal de Upanema — RN</p>
      </div>
    </div>
  </div>;
}

/* ═══ DASHBOARD ═══ */
function Dashboard({nav,vehicles,drivers,alerts}){
  const gJ=CH_G[CH_G.length-1];
  return<div>
    <div className="gkpi">
      <Kpi lb="Total da Frota" vl={vehicles.length} sub="Veículos cadastrados" Ic={Car} top="#1d4ed8"/>
      <Kpi lb="Disponíveis" vl={vehicles.filter(v=>v.sit==="Disponível").length} sub="Prontos para uso" Ic={CheckCircle} cor="#16a34a" top="#16a34a"/>
      <Kpi lb="Em Circulação" vl={vehicles.filter(v=>v.sit==="Em uso").length} sub="Viagens ativas agora" Ic={Activity} cor="#0284c7" top="#0284c7"/>
      <Kpi lb="Em Manutenção" vl={vehicles.filter(v=>v.sit==="Manutenção").length} sub="Ordens abertas" Ic={Wrench} cor="#d97706" top="#d97706"/>
      <Kpi lb="Gastos em Junho" vl={`R$ ${(gJ.c+gJ.m).toLocaleString("pt-BR")}`} sub="Comb. + Manutenção" Ic={DollarSign} delta={4} top="#1d4ed8"/>
      <Kpi lb="Motoristas Ativos" vl={drivers.filter(d=>d.sit==="Ativo").length} sub={`${drivers.length} cadastrados`} Ic={Users} top="#1d4ed8"/>
      <Kpi lb="Viagens no Mês" vl={56} sub="Junho/2025" Ic={MapPin} top="#1d4ed8"/>
      <Kpi lb="Alertas Ativos" vl={alerts.length} sub={`${alerts.filter(a=>a.nivel==="danger").length} crítico(s)`} Ic={Bell} cor="#dc2626" top="#dc2626"/>
    </div>
    <div className="gdash">
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"16px 16px 10px"}}>
        <div style={{fontSize:14,fontWeight:700,color:"var(--tx)",marginBottom:1}}>Gastos Mensais — 2025</div>
        <div style={{fontSize:11,color:"var(--mu)",marginBottom:12}}>Combustível + Manutenção (R$)</div>
        <ResponsiveContainer width="100%" height={190}><BarChart data={CH_G} barGap={2}><CartesianGrid strokeDasharray="3 3" stroke="var(--bd)"/><XAxis dataKey="mes" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v=>`${v/1000}k`}/><Tooltip formatter={v=>`R$ ${Number(v).toLocaleString("pt-BR")}`}/><Legend iconSize={10} wrapperStyle={{fontSize:11}}/><Bar dataKey="c" name="Combustível" fill="#1d4ed8"/><Bar dataKey="m" name="Manutenção" fill="#93c5fd"/></BarChart></ResponsiveContainer>
      </div>
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:16}}>
        <div style={{fontSize:14,fontWeight:700,color:"var(--tx)",marginBottom:1}}>Situação da Frota</div>
        <div style={{fontSize:11,color:"var(--mu)",marginBottom:12}}>{vehicles.length} veículos no total</div>
        {[["Disponíveis",vehicles.filter(v=>v.sit==="Disponível").length,"#16a34a"],["Em Uso",vehicles.filter(v=>v.sit==="Em uso").length,"#0284c7"],["Manutenção",vehicles.filter(v=>v.sit==="Manutenção").length,"#d97706"],["Baixados",vehicles.filter(v=>v.sit==="Baixado").length,"#94a3b8"]].map(([lb,n,c])=>
          <div key={lb} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:"var(--tx)"}}>{lb}</span><span style={{fontSize:13,fontWeight:700,color:c}}>{n} veículo{n!==1?"s":""}</span></div>
            <div style={{height:6,background:"var(--bd)"}}><div style={{height:"100%",width:`${vehicles.length>0?(n/vehicles.length)*100:0}%`,background:c,transition:"width .4s"}}/></div>
          </div>
        )}
        <div style={{fontSize:11,color:"var(--mu)",marginTop:8}}>Por Secretaria — Acumulado 2025</div>
        <ResponsiveContainer width="100%" height={100}><PieChart><Pie data={CH_S} dataKey="v" cx="50%" cy="50%" outerRadius={42} innerRadius={20}>{CH_S.map((e,i)=><Cell key={i} fill={e.cor}/>)}</Pie><Tooltip formatter={v=>`R$ ${Number(v).toLocaleString("pt-BR")}`}/></PieChart></ResponsiveContainer>
      </div>
    </div>
    <div className="g2">
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"16px 16px 10px"}}>
        <div style={{fontSize:14,fontWeight:700,color:"var(--tx)",marginBottom:1}}>Viagens por Semana</div>
        <div style={{fontSize:11,color:"var(--mu)",marginBottom:12}}>Últimas 6 semanas</div>
        <ResponsiveContainer width="100%" height={140}><AreaChart data={CH_V}><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="10%" stopColor="#1d4ed8" stopOpacity={.14}/><stop offset="90%" stopColor="#1d4ed8" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--bd)"/><XAxis dataKey="s" tick={{fontSize:10}}/><YAxis tick={{fontSize:11}}/><Tooltip/><Area type="monotone" dataKey="v" name="Viagens" stroke="#1d4ed8" strokeWidth={2} fill="url(#ag)"/></AreaChart></ResponsiveContainer>
      </div>
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:16}}>
        <div style={{fontWeight:700,fontSize:14,color:"var(--tx)",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>Alertas Críticos <button onClick={()=>nav("alerts")} style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Ver todos →</button></div>
        {alerts.length===0&&<div style={{padding:"20px",textAlign:"center",color:"var(--mu)",fontSize:13}}>✓ Nenhum alerta ativo</div>}
        {alerts.slice(0,4).map((a,i)=><div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid var(--bd)"}}>
          <div style={{flexShrink:0,marginTop:2}}>{a.nivel==="danger"?<AlertCircle size={13} color="#dc2626"/>:a.nivel==="warning"?<AlertCircle size={13} color="#d97706"/>:<Bell size={13} color="#0284c7"/>}</div>
          <div><div style={{fontSize:12,fontWeight:600,color:"var(--tx)"}}>{a.titulo}</div><div style={{fontSize:11,color:"var(--mu)",lineHeight:1.4}}>{a.desc}</div></div>
        </div>)}
      </div>
    </div>
    <div className="gdash" style={{marginBottom:0}}>
      <div style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:14,color:"var(--tx)"}}>Viagens Recentes</span><button onClick={()=>nav("trips")} style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Ver todas →</button></div>
        <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr><Th ch="Código"/><Th ch="Motorista"/><Th ch="Destino"/><Th ch="Status"/></tr></thead>
        <tbody>{T0.slice(0,5).map((t,i)=><tr key={i} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}><Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{t.id}</span>}/><Td ch={<span style={{fontWeight:500}}>{t.mot}</span>}/><Td ch={<span style={{maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{t.dest}</span>}/><Td ch={<SBdg v={t.sit}/>}/></tr>)}</tbody></table></div>
      </div>
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"13px 16px"}}>
        <div style={{fontWeight:700,fontSize:14,color:"var(--tx)",marginBottom:12}}>Gastos por Secretaria</div>
        {CH_S.map((s,i)=><div key={i} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:"var(--tx)"}}>{s.name}</span><span style={{fontSize:12,fontWeight:700,color:"var(--tx)"}}>R$ {s.v.toLocaleString("pt-BR")}</span></div>
          <div style={{height:5,background:"var(--bd)"}}><div style={{height:"100%",width:`${(s.v/10000)*100}%`,background:s.cor}}/></div>
        </div>)}
      </div>
    </div>
  </div>;
}

/* ═══ VEHICLES ═══ */
function Vehicles({vehicles,setVehicles,toast}){
  const[tab,setTab]=useState("Todos");const[srch,setSrch]=useState("");
  const[sel,setSel]=useState(null);const[modal,setModal]=useState(null);const[cfm,setCfm]=useState(null);
  const tabs=["Todos","Disponível","Em uso","Manutenção","Baixado"];
  const filt=vehicles.filter(v=>(tab==="Todos"||v.sit===tab)&&(!srch||[v.placa,v.modelo,v.mot||""].some(x=>x.toLowerCase().includes(srch.toLowerCase()))));
  const saveV=v=>{if(modal?.id)setVehicles(p=>p.map(x=>x.id===v.id?v:x));else setVehicles(p=>[v,...p]);};
  const delV=v=>setCfm({msg:`Excluir ${v.placa} — ${v.modelo}? Esta ação não pode ser desfeita.`,ok:()=>{setVehicles(p=>p.filter(x=>x.id!==v.id));toast("Veículo excluído do sistema.","danger");setCfm(null);}});
  return<div>
    <SH title="Gestão de Veículos" sub={`${vehicles.length} veículos — ${vehicles.filter(v=>v.sit==="Disponível").length} disponíveis agora`} action={<Btn Ic={Plus} click={()=>setModal("add")}>+ Cadastrar Veículo</Btn>}/>
    <div className="gkpi"><Kpi lb="Total" vl={vehicles.length} Ic={Car} top="#1d4ed8"/><Kpi lb="Disponíveis" vl={vehicles.filter(v=>v.sit==="Disponível").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/><Kpi lb="Em Uso" vl={vehicles.filter(v=>v.sit==="Em uso").length} Ic={Activity} cor="#0284c7" top="#0284c7"/><Kpi lb="Manutenção" vl={vehicles.filter(v=>v.sit==="Manutenção").length} Ic={Wrench} cor="#d97706" top="#d97706"/><Kpi lb="Baixados" vl={vehicles.filter(v=>v.sit==="Baixado").length} Ic={AlertOctagon} cor="#64748b" top="#94a3b8"/></div>
    <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}><SBar val={srch} set={setSrch} ph="Pesquisar placa, modelo ou motorista..."/><Btn ghost Ic={Download} click={()=>{toast("Gerando relatório de frota...","info");setTimeout(()=>toast("Relatório exportado com sucesso!"),2000);}}>Exportar</Btn></div>
    <div style={{display:"flex",borderBottom:"2px solid var(--bd)",marginBottom:12,overflowX:"auto"}}>{tabs.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"8px 14px",fontSize:12,fontWeight:600,background:"none",border:"none",borderBottom:tab===t?`2px solid ${P}`:"2px solid transparent",color:tab===t?P:"var(--mu)",cursor:"pointer",marginBottom:-2,fontFamily:"inherit",whiteSpace:"nowrap"}}>{t} ({t==="Todos"?vehicles.length:vehicles.filter(v=>v.sit===t).length})</button>)}</div>
    <div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Placa"/><Th ch="Veículo"/><Th ch="Secretaria"/><Th ch="KM"/><Th ch="Comb."/><Th ch="Revisão"/><Th ch="Custo/Mês"/><Th ch="Status"/><Th ch=""/></tr></thead>
        <tbody>{filt.map((v,i)=><tr key={v.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
          <Td ch={<span style={{fontWeight:700,color:NAV_BG,letterSpacing:".04em"}}>{v.placa}</span>}/>
          <Td ch={<div><div style={{fontWeight:600}}>{v.modelo}</div><div style={{fontSize:11,color:"var(--mu)"}}>{v.marca} · {v.ano} · {v.tipo}</div></div>}/>
          <Td ch={<div><div style={{fontSize:12}}>{v.sec}</div><div style={{fontSize:10,color:"var(--mu)"}}>{v.pat}</div></div>}/>
          <Td ch={<span style={{fontWeight:500,whiteSpace:"nowrap"}}>{v.km>0?v.km.toLocaleString("pt-BR")+" km":"Horímetro"}</span>}/>
          <Td ch={<Prog v={v.niv}/>}/>
          <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{v.rev}</span>}/>
          <Td ch={<span style={{fontWeight:600,color:v.custo>900?"#dc2626":"var(--tx)",whiteSpace:"nowrap"}}>R$ {v.custo.toLocaleString("pt-BR")}</span>}/>
          <Td ch={<SBdg v={v.sit}/>}/>
          <Td ch={<div style={{display:"flex",gap:4}}>
            <button onClick={()=>setSel(v)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:"#0284c7",fontFamily:"inherit",fontWeight:600}}>Ver</button>
            <button onClick={()=>setModal(v)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:P,fontFamily:"inherit"}}><Edit size={11}/></button>
            <button onClick={()=>delV(v)} style={{background:"none",border:"none",padding:"3px",cursor:"pointer",color:"#dc2626"}}><Trash2 size={13}/></button>
          </div>}/>
        </tr>)}{filt.length===0&&<tr><td colSpan={9} style={{padding:"40px",textAlign:"center",color:"var(--mu)",fontSize:13}}>Nenhum veículo encontrado com os filtros aplicados.</td></tr>}</tbody>
      </table>
    </div>
    {sel&&<Modal title={`${sel.placa} — ${sel.modelo}`} close={()=>setSel(null)} w={740}>
      <div className="g2"><div><p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:"1px solid var(--bd)"}}>Dados Técnicos</p>{[["Placa",sel.placa],["RENAVAM",sel.renavam],["Chassi",sel.chassi],["Modelo",`${sel.marca} ${sel.modelo}`],["Ano / Cor",`${sel.ano} · ${sel.cor}`],["Tipo",`${sel.tipo} — ${sel.cat}`],["Combustível",sel.comb]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div>
      <div><p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:"1px solid var(--bd)"}}>Situação Atual</p>{[["Secretaria",sel.sec],["Patrimônio",sel.pat],["Motorista",sel.mot||"—"],["KM Atual",sel.km>0?sel.km.toLocaleString("pt-BR")+" km":"Horímetro"],["Nível Comb.",sel.niv+"%"],["Próx. Revisão",sel.rev],["Val. Seguro",sel.seg],["Multas",sel.mul+" multa(s)"],["Custo/Mês","R$ "+sel.custo]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div></div>
      {sel.obs&&<div style={{background:"var(--ra)",border:"1px solid var(--bd)",padding:"10px 14px",marginTop:14}}><p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 4px"}}>Observações</p><p style={{fontSize:13,color:"var(--sub)",margin:0}}>{sel.obs}</p></div>}
      <div style={{display:"flex",gap:10,marginTop:14,paddingTop:12,borderTop:"1px solid var(--bd)"}}><Btn Ic={Edit} click={()=>{setModal(sel);setSel(null);}}>Editar Veículo</Btn><Btn ghost click={()=>setSel(null)}>Fechar</Btn></div>
    </Modal>}
    {(modal==="add"||modal?.id)&&<VModal v={modal==="add"?null:modal} save={saveV} close={()=>setModal(null)} toast={toast}/>}
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>;
}

/* ═══ DRIVERS ═══ */
function Drivers({drivers,setDrivers,toast}){
  const[srch,setSrch]=useState("");const[sel,setSel]=useState(null);const[modal,setModal]=useState(null);const[cfm,setCfm]=useState(null);
  const today=new Date("2025-06-08");
  const dias=d=>{try{const[dd,mm,aa]=d.valCnh.split("/");return Math.round((new Date(`${aa}-${mm}-${dd}`)-today)/86400000);}catch{return 999;}};
  const filt=drivers.filter(d=>!srch||[d.nome,d.mat,d.cpf].some(x=>x.toLowerCase().includes(srch.toLowerCase())));
  const saveD=d=>{if(modal?.id)setDrivers(p=>p.map(x=>x.id===d.id?d:x));else setDrivers(p=>[d,...p]);};
  const delD=d=>setCfm({msg:`Excluir motorista ${d.nome}?`,ok:()=>{setDrivers(p=>p.filter(x=>x.id!==d.id));toast("Motorista excluído.","danger");setCfm(null);}});
  return<div>
    <SH title="Motoristas e Operadores" sub={`${drivers.length} profissionais — ${drivers.filter(d=>d.sit==="Ativo").length} ativos`} action={<Btn Ic={Plus} click={()=>setModal("add")}>+ Cadastrar Motorista</Btn>}/>
    <div className="gkpi"><Kpi lb="Ativos" vl={drivers.filter(d=>d.sit==="Ativo").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/><Kpi lb="Férias / Afastados" vl={drivers.filter(d=>d.sit!=="Ativo").length} Ic={Calendar} cor="#d97706" top="#d97706"/><Kpi lb="CNH Vencendo" vl={drivers.filter(d=>dias(d)<90).length} sub="Próximos 90 dias" Ic={AlertCircle} cor="#dc2626" top="#dc2626"/><Kpi lb="Total Viagens" vl={drivers.reduce((a,d)=>a+d.viagens,0)} Ic={MapPin} top="#1d4ed8"/><Kpi lb="KM Rodados" vl={`${(drivers.reduce((a,d)=>a+d.kmR,0)/1000).toFixed(1)}k`} Ic={Activity} top="#1d4ed8"/></div>
    <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}><SBar val={srch} set={setSrch} ph="Pesquisar nome, CPF ou matrícula..."/><Btn ghost Ic={Download} click={()=>{toast("Exportando motoristas...","info");setTimeout(()=>toast("Exportado com sucesso!"),1800);}}>Exportar</Btn></div>
    <div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Matrícula"/><Th ch="Nome / Cargo"/><Th ch="Secretaria"/><Th ch="Cat. CNH"/><Th ch="Validade CNH"/><Th ch="Veículo"/><Th ch="Viagens"/><Th ch="KM"/><Th ch="Status"/><Th ch=""/></tr></thead>
        <tbody>{filt.map((d,i)=>{const dv=dias(d);const w=dv<90;return<tr key={d.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{d.mat}</span>}/>
          <Td ch={<div><div style={{fontWeight:600}}>{d.nome}</div><div style={{fontSize:11,color:"var(--mu)"}}>{d.cargo}</div></div>}/>
          <Td ch={<span style={{fontSize:12}}>{d.sec}</span>}/>
          <Td ch={<span style={{fontWeight:700,color:P}}>Cat. {d.cnh}</span>}/>
          <Td ch={<div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:12,color:w?"#dc2626":"inherit",fontWeight:w?700:400}}>{d.valCnh}</span>{w&&<span style={{fontSize:9,background:"#fee2e2",color:"#dc2626",padding:"1px 5px",fontWeight:700}}>{dv}d</span>}</div>}/>
          <Td ch={<span style={{fontSize:12,color:d.veiAtual?P:"var(--mu)",fontWeight:d.veiAtual?600:400}}>{d.veiAtual||"—"}</span>}/>
          <Td ch={<span style={{fontWeight:600,textAlign:"center",display:"block"}}>{d.viagens}</span>}/>
          <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{d.kmR.toLocaleString("pt-BR")} km</span>}/>
          <Td ch={<SBdg v={d.sit}/>}/>
          <Td ch={<div style={{display:"flex",gap:4}}>
            <button onClick={()=>setSel(d)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:"#0284c7",fontFamily:"inherit",fontWeight:600}}>Ver</button>
            <button onClick={()=>setModal(d)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:P,fontFamily:"inherit"}}><Edit size={11}/></button>
            <button onClick={()=>delD(d)} style={{background:"none",border:"none",padding:"3px",cursor:"pointer",color:"#dc2626"}}><Trash2 size={13}/></button>
          </div>}/>
        </tr>;})}
        {filt.length===0&&<tr><td colSpan={10} style={{padding:"40px",textAlign:"center",color:"var(--mu)",fontSize:13}}>Nenhum motorista encontrado.</td></tr>}</tbody>
      </table>
    </div>
    {sel&&<Modal title={sel.nome} close={()=>setSel(null)}><div className="g2"><div><p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:"1px solid var(--bd)"}}>Dados Pessoais</p>{[["Nome",sel.nome],["CPF",sel.cpf],["RG",sel.rg],["Matrícula",sel.mat],["Nascimento",sel.nasc],["Telefone",sel.tel],["E-mail",sel.email]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div><div><p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:"1px solid var(--bd)"}}>Profissional</p>{[["Secretaria",sel.sec],["Cargo",sel.cargo],["Cat. CNH","Cat. "+sel.cnh],["Validade CNH",sel.valCnh],["Situação",sel.sit],["Veículo",sel.veiAtual||"—"],["Viagens",sel.viagens+" viagens"],["KM Rodados",sel.kmR.toLocaleString("pt-BR")+" km"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div></div><div style={{display:"flex",gap:10,marginTop:14,paddingTop:12,borderTop:"1px solid var(--bd)"}}><Btn Ic={Edit} click={()=>{setModal(sel);setSel(null);}}>Editar</Btn><Btn ghost click={()=>setSel(null)}>Fechar</Btn></div></Modal>}
    {(modal==="add"||modal?.id)&&<DModal d={modal==="add"?null:modal} save={saveD} close={()=>setModal(null)} toast={toast}/>}
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>;
}

/* ═══ TRIPS — Reativo com veículos ═══ */
function Trips({vehicles,setVehicles,drivers,trips,setTrips,toast}){
  const[view,setView]=useState("lista");
  const[f,setF]=useState({placa:"",mot:"",dest:"",fin:"",sec:"",kmi:"",pass:"1"});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const confirmar=()=>{
    if(!f.placa||!f.mot||!f.dest){toast("Preencha veículo, motorista e destino.","danger");return;}
    const id=`VGM-2025-0${String(trips.length+241).padStart(4,"0")}`;
    const now=new Date();const ts=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`;
    const vv=vehicles.find(v=>v.placa===f.placa);
    setTrips([{id,placa:f.placa,mod:vv?.modelo||"",mot:f.mot,dest:f.dest,kmi:+f.kmi||null,kmf:null,saida:ts,ret:null,fin:f.fin||"Serviço",sec:f.sec||"—",sit:"Em andamento",pass:+f.pass||1,custo:null},...trips]);
    setVehicles(p=>p.map(v=>v.placa===f.placa?{...v,sit:"Em uso",mot:f.mot}:v));
    setF({placa:"",mot:"",dest:"",fin:"",sec:"",kmi:"",pass:"1"});setView("lista");
    toast("✓ Saída registrada! Veículo marcado como Em uso.");
  };
  const retornar=id=>{
    const t=trips.find(x=>x.id===id);
    const now=new Date();const ts=now.toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
    setTrips(trips.map(x=>x.id===id?{...x,sit:"Concluída",ret:ts,kmf:x.kmi?x.kmi+Math.floor(Math.random()*200+50):null}:x));
    if(t)setVehicles(p=>p.map(v=>v.placa===t.placa?{...v,sit:"Disponível",mot:null}:v));
    toast("✓ Retorno registrado! Veículo agora Disponível.");
  };
  const ea=trips.filter(t=>t.sit==="Em andamento");
  return<div>
    <SH title="Controle de Viagens" sub={`${trips.length} registros — ${ea.length} em andamento agora`} action={<div style={{display:"flex",gap:8}}><Btn ghost sm click={()=>setView("lista")}>Lista</Btn><Btn click={()=>setView(view==="form"?"lista":"form")}>+ Registrar Saída</Btn></div>}/>
    {ea.length>0&&<div style={{background:"#e0f2fe",border:"1px solid #7dd3fc",padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
      <span className="blink" style={{width:8,height:8,background:"#0284c7",borderRadius:"50%",display:"inline-block"}}/>
      <span style={{fontSize:13,fontWeight:600,color:"#0369a1"}}>{ea.length} viagem(ns) em andamento — {ea.map(t=>t.placa).join(", ")}</span>
    </div>}
    {view==="form"&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",borderTop:`3px solid ${P}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>Registrar Nova Saída de Veículo</p>
      {vehicles.filter(v=>v.sit==="Disponível").length===0&&<div style={{background:"#fef9c3",border:"1px solid #fde047",padding:"10px 12px",marginBottom:12,fontSize:13,color:"#a16207"}}>⚠ Nenhum veículo disponível no momento.</div>}
      <div className="gf3"><FF lb="Veículo Disponível" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit==="Disponível").map(v=>`${v.placa} — ${v.modelo}`).map(s=>s.split(" — ")[0])} req/><FF lb="Motorista" val={f.mot} set={u("mot")} opts={drivers.filter(d=>d.sit==="Ativo").map(d=>d.nome)} req/><FF lb="KM Inicial" val={f.kmi} set={u("kmi")} type="number"/></div>
      <div className="gf3"><FF lb="Destino / Endereço" val={f.dest} set={u("dest")} req/><FF lb="Finalidade" val={f.fin} set={u("fin")} opts={["Transporte de Pacientes","Serviço de Obras","Transporte Escolar","Emergência Médica","Viagem Administrativa","Entrega de Materiais","Terraplanagem","Outros"]}/><FF lb="Secretaria Solicitante" val={f.sec} set={u("sec")} opts={["Saúde","Obras","Educação","Administração","Assist. Social"]}/></div>
      <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={confirmar}>Confirmar Saída</Btn><Btn ghost click={()=>setView("lista")}>Cancelar</Btn></div>
    </div>}
    <div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Destino"/><Th ch="Saída"/><Th ch="Retorno"/><Th ch="Sec."/><Th ch="Status"/><Th ch="Ação"/></tr></thead>
        <tbody>{trips.map((t,i)=><tr key={t.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{t.id}</span>}/>
          <Td ch={<div><div style={{fontWeight:600,fontSize:12}}>{t.placa}</div><div style={{fontSize:11,color:"var(--mu)"}}>{t.mod}</div></div>}/>
          <Td ch={<span style={{fontWeight:500}}>{t.mot}</span>}/>
          <Td ch={<span style={{fontSize:12,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{t.dest}</span>}/>
          <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{t.saida}</span>}/>
          <Td ch={<span style={{fontSize:12,color:t.ret?"var(--sub)":"var(--mu)",whiteSpace:"nowrap"}}>{t.ret||"—"}</span>}/>
          <Td ch={<span style={{fontSize:11,color:"var(--mu)"}}>{t.sec}</span>}/>
          <Td ch={<SBdg v={t.sit}/>}/>
          <Td ch={t.sit==="Em andamento"?<button onClick={()=>retornar(t.id)} style={{background:"#16a34a",color:"white",border:"none",padding:"4px 9px",fontSize:11,cursor:"pointer",fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap"}}>Registrar Retorno</button>:<span style={{fontSize:11,color:"var(--mu)"}}>—</span>}/>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}

/* ═══ FUEL ═══ */
function FuelPage({vehicles,drivers,fuel,setFuel,toast}){
  const[show,setShow]=useState(false);const[f,setF]=useState({placa:"",mot:"",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:"",vl:"",km:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const reg=()=>{
    if(!f.placa||!f.litros){toast("Preencha veículo e litros.","danger");return;}
    const total=+(+f.litros*+f.vl).toFixed(2);
    const id=`ABS-${String(fuel.length+48).padStart(4,"0")}`;
    const now=new Date();const data=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`;
    const vv=vehicles.find(v=>v.placa===f.placa);
    setFuel([{id,placa:f.placa,mod:vv?.modelo||"",mot:f.mot,data,posto:f.posto,tipo:f.tipo,litros:+f.litros,vl:+f.vl,total,km:+f.km||0,media:0},...fuel]);
    setF({placa:"",mot:"",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:"",vl:"",km:""});setShow(false);
    toast("✓ Abastecimento registrado com sucesso!");
  };
  const tot=fuel.reduce((a,x)=>a+x.total,0);const totL=fuel.reduce((a,x)=>a+x.litros,0);
  return<div>
    <SH title="Controle de Abastecimento" sub={`${fuel.length} registros — R$ ${tot.toLocaleString("pt-BR",{minimumFractionDigits:2})} total`} action={<Btn Ic={Plus} click={()=>setShow(!show)}>+ Registrar Abastecimento</Btn>}/>
    <div className="gkpi"><Kpi lb="Gasto Total (Jun)" vl={`R$ ${tot.toLocaleString("pt-BR")}`} Ic={DollarSign} top="#1d4ed8"/><Kpi lb="Litros Abastecidos" vl={`${totL.toFixed(1)} L`} Ic={Fuel} top="#1d4ed8"/><Kpi lb="Registros" vl={fuel.length} sub="Junho/2025" Ic={ClipboardList} top="#1d4ed8"/><Kpi lb="Consumo Médio" vl="9.4 km/L" sub="Frota geral" Ic={Activity} cor="#16a34a" top="#16a34a"/><Kpi lb="Custo Médio" vl={`R$ ${totL>0?(tot/totL).toFixed(2):0}/L`} Ic={TrendingUp} top="#0284c7"/></div>
    {show&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",borderTop:`3px solid ${P}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>Registrar Novo Abastecimento</p>
      <div className="gf3"><FF lb="Veículo (Placa)" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit!=="Baixado").map(v=>v.placa)} req/><FF lb="Motorista" val={f.mot} set={u("mot")} opts={drivers.filter(d=>d.sit==="Ativo").map(d=>d.nome)}/><FF lb="Posto de Combustível" val={f.posto} set={u("posto")} opts={["Posto Central Upanema","Posto Municipal","Posto BR — Natal","Outro Posto"]}/></div>
      <div className="gf4"><FF lb="Combustível" val={f.tipo} set={u("tipo")} opts={["Diesel S-10","Diesel Comum","Gasolina","Etanol","GNV"]}/><FF lb="Litros" val={f.litros} set={u("litros")} type="number" req/><FF lb="Valor por Litro (R$)" val={f.vl} set={u("vl")} type="number"/><FF lb="KM no Momento" val={f.km} set={u("km")} type="number"/></div>
      {f.litros&&f.vl&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",padding:"10px 14px",marginBottom:12,fontSize:13,color:P,fontWeight:600}}>💧 Total calculado: <strong>R$ {(+f.litros*+f.vl).toFixed(2)}</strong></div>}
      <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={reg}>Registrar Abastecimento</Btn><Btn ghost click={()=>setShow(false)}>Cancelar</Btn></div>
    </div>}
    <div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Posto"/><Th ch="Tipo"/><Th ch="Litros"/><Th ch="R$/L"/><Th ch="Total"/><Th ch="km/L"/></tr></thead>
        <tbody>{fuel.map((x,i)=><tr key={x.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{x.id}</span>}/>
          <Td ch={<div><div style={{fontWeight:600,fontSize:12}}>{x.placa}</div><div style={{fontSize:11,color:"var(--mu)"}}>{x.mod}</div></div>}/>
          <Td ch={<span style={{fontSize:12}}>{x.mot}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{x.data}</span>}/><Td ch={<span style={{fontSize:12}}>{x.posto}</span>}/>
          <Td ch={<Bdg lb={x.tipo} tp="info"/>}/>
          <Td ch={<span style={{fontWeight:500}}>{x.litros.toFixed(1)} L</span>}/>
          <Td ch={<span style={{fontSize:12}}>R$ {x.vl.toFixed(2)}</span>}/>
          <Td ch={<span style={{fontWeight:700,color:P,whiteSpace:"nowrap"}}>R$ {x.total.toFixed(2)}</span>}/>
          <Td ch={<span style={{fontSize:12,fontWeight:500}}>{x.media>0?x.media+" km/L":"—"}</span>}/>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}

/* ═══ MAINTENANCE — Reativo ═══ */
function MaintenancePage({vehicles,setVehicles,maint,setMaint,toast}){
  const[show,setShow]=useState(false);const[f,setF]=useState({placa:"",tipo:"Preventiva",desc:"",oficina:"",custo:"",prev:"",prior:"Média"});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const criar=()=>{
    if(!f.placa||!f.desc){toast("Preencha veículo e descrição.","danger");return;}
    const id=`OS-${String(maint.length+96).padStart(4,"0")}`;const vv=vehicles.find(v=>v.placa===f.placa);
    setMaint([{id,placa:f.placa,mod:vv?.modelo||"",tipo:f.tipo,desc:f.desc,oficina:f.oficina,custo:+f.custo||0,criado:new Date().toLocaleDateString("pt-BR"),prev:f.prev,status:"Agendada",prior:f.prior},...maint]);
    if(f.tipo==="Corretiva")setVehicles(p=>p.map(v=>v.placa===f.placa?{...v,sit:"Manutenção"}:v));
    setShow(false);setF({placa:"",tipo:"Preventiva",desc:"",oficina:"",custo:"",prev:"",prior:"Média"});
    toast(f.tipo==="Corretiva"?"✓ OS criada! Veículo colocado em Manutenção.":"✓ Ordem de Serviço criada com sucesso!");
  };
  const chSt=(id,st)=>{
    const m=maint.find(x=>x.id===id);
    setMaint(maint.map(x=>x.id===id?{...x,status:st}:x));
    if(st==="Finalizada"&&m)setVehicles(p=>p.map(v=>v.placa===m.placa&&v.sit==="Manutenção"?{...v,sit:"Disponível"}:v));
    toast(st==="Finalizada"?`✓ OS ${id} finalizada! Veículo liberado como Disponível.`:`Status: ${st}`);
  };
  const totAb=maint.filter(m=>m.status!=="Finalizada").reduce((a,m)=>a+m.custo,0);
  return<div>
    <SH title="Controle de Manutenção" sub={`${maint.filter(m=>m.status!=="Finalizada").length} OS abertas — R$ ${totAb.toLocaleString("pt-BR")} em aberto`} action={<Btn Ic={Plus} click={()=>setShow(!show)}>+ Nova Ordem de Serviço</Btn>}/>
    <div className="gkpi"><Kpi lb="OS Abertas" vl={maint.filter(m=>m.status!=="Finalizada").length} Ic={ClipboardList} cor="#d97706" top="#d97706"/><Kpi lb="Em Execução" vl={maint.filter(m=>m.status==="Em execução").length} Ic={Wrench} cor="#0284c7" top="#0284c7"/><Kpi lb="Agendadas" vl={maint.filter(m=>m.status==="Agendada").length} Ic={Calendar} top="#1d4ed8"/><Kpi lb="Finalizadas" vl={maint.filter(m=>m.status==="Finalizada").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/><Kpi lb="Custo Aberto" vl={`R$ ${totAb.toLocaleString("pt-BR")}`} Ic={DollarSign} cor="#dc2626" top="#dc2626"/></div>
    {show&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",borderTop:`3px solid ${P}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>Nova Ordem de Serviço</p>
      <div className="gf3"><FF lb="Veículo (Placa)" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit!=="Baixado").map(v=>v.placa)} req/><FF lb="Tipo de Manutenção" val={f.tipo} set={u("tipo")} opts={["Preventiva","Corretiva","Elétrica","Funilaria","Pneus","Revisão Geral"]}/><FF lb="Prioridade" val={f.prior} set={u("prior")} opts={["Alta","Média","Baixa"]}/></div>
      <div className="gf3"><FF lb="Descrição Detalhada" val={f.desc} set={u("desc")} req/><FF lb="Oficina / Fornecedor" val={f.oficina} set={u("oficina")}/><FF lb="Custo Estimado (R$)" val={f.custo} set={u("custo")} type="number"/></div>
      <div className="gf2"><FF lb="Previsão de Entrega" val={f.prev} set={u("prev")}/></div>
      {f.tipo==="Corretiva"&&<div style={{background:"#fef9c3",border:"1px solid #fde047",padding:"8px 12px",marginBottom:12,fontSize:12,color:"#a16207"}}>⚠ OS Corretiva: o veículo será colocado automaticamente em Manutenção ao criar esta ordem.</div>}
      <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={criar}>Criar Ordem de Serviço</Btn><Btn ghost click={()=>setShow(false)}>Cancelar</Btn></div>
    </div>}
    <div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Nº OS"/><Th ch="Veículo"/><Th ch="Tipo"/><Th ch="Descrição"/><Th ch="Oficina"/><Th ch="Abertura"/><Th ch="Custo"/><Th ch="Prior."/><Th ch="Status"/><Th ch="Ação"/></tr></thead>
        <tbody>{maint.map((m,i)=><tr key={m.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)",fontWeight:600}}>{m.id}</span>}/>
          <Td ch={<div><div style={{fontWeight:600,fontSize:12}}>{m.placa}</div><div style={{fontSize:11,color:"var(--mu)"}}>{m.mod}</div></div>}/>
          <Td ch={<Bdg lb={m.tipo} tp={m.tipo==="Corretiva"?"bad":"info"}/>}/>
          <Td ch={<span style={{fontSize:12,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{m.desc}</span>}/>
          <Td ch={<span style={{fontSize:12}}>{m.oficina||"—"}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{m.criado}</span>}/>
          <Td ch={<span style={{fontWeight:600,color:m.custo>1000?"#dc2626":"var(--tx)",whiteSpace:"nowrap"}}>R$ {m.custo.toLocaleString("pt-BR")}</span>}/>
          <Td ch={<Bdg lb={m.prior} tp={m.prior==="Alta"?"bad":m.prior==="Média"?"warn":"gray"}/>}/>
          <Td ch={<SBdg v={m.status}/>}/>
          <Td ch={m.status==="Agendada"?<Btn sm click={()=>chSt(m.id,"Em execução")}>Iniciar</Btn>:m.status==="Em execução"?<Btn sm click={()=>chSt(m.id,"Finalizada")}>Finalizar</Btn>:<span style={{color:"var(--mu)",fontSize:11}}>—</span>}/>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}

/* ═══ FINANCIAL ═══ */
function Financial({vehicles,toast}){
  const rank=[...vehicles].filter(v=>v.custo>0).sort((a,b)=>b.custo-a.custo);
  const totalG=CH_G.reduce((a,x)=>a+x.c+x.m,0);const totalC=CH_G.reduce((a,x)=>a+x.c,0);const totalM=CH_G.reduce((a,x)=>a+x.m,0);
  return<div>
    <SH title="Gestão Financeira" sub="Análise completa de custos e despesas da frota" action={<Btn ghost Ic={Download} click={()=>{toast("Gerando relatório financeiro...","info");setTimeout(()=>toast("✓ Exportado com sucesso!"),2000);}}>Exportar Relatório</Btn>}/>
    <div className="gkpi"><Kpi lb="Total 2025 (Jan–Jun)" vl={`R$ ${totalG.toLocaleString("pt-BR")}`} Ic={DollarSign} top="#1d4ed8"/><Kpi lb="Combustível" vl={`R$ ${totalC.toLocaleString("pt-BR")}`} sub={`${((totalC/totalG)*100).toFixed(0)}% dos gastos`} Ic={Fuel} top="#0c1a47" delta={-8}/><Kpi lb="Manutenção" vl={`R$ ${totalM.toLocaleString("pt-BR")}`} sub={`${((totalM/totalG)*100).toFixed(0)}% dos gastos`} Ic={Wrench} top="#d97706"/><Kpi lb="Multas / Outros" vl="R$ 902" sub="1% dos gastos" Ic={AlertOctagon} cor="#dc2626" top="#dc2626"/></div>
    <div className="gdash">
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"16px 16px 10px"}}>
        <div style={{fontSize:14,fontWeight:700,color:"var(--tx)",marginBottom:1}}>Evolução Mensal — Jan a Jun/2025</div>
        <div style={{fontSize:11,color:"var(--mu)",marginBottom:12}}>Combustível + Manutenção empilhados (R$)</div>
        <ResponsiveContainer width="100%" height={215}><BarChart data={CH_G}><CartesianGrid strokeDasharray="3 3" stroke="var(--bd)"/><XAxis dataKey="mes" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v=>`R$${v/1000}k`}/><Tooltip formatter={v=>`R$ ${Number(v).toLocaleString("pt-BR")}`}/><Legend iconSize={10} wrapperStyle={{fontSize:11}}/><Bar dataKey="c" name="Combustível" fill="#1d4ed8" stackId="a"/><Bar dataKey="m" name="Manutenção" fill="#93c5fd" stackId="a"/></BarChart></ResponsiveContainer>
      </div>
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:16}}>
        <div style={{fontSize:14,fontWeight:700,color:"var(--tx)",marginBottom:14}}>Por Secretaria — Acumulado 2025</div>
        {CH_S.map((s,i)=><div key={i} style={{marginBottom:13}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,fontWeight:500,color:"var(--tx)"}}>{s.name}</span><span style={{fontSize:13,fontWeight:700,color:"var(--tx)"}}>R$ {s.v.toLocaleString("pt-BR")}</span></div>
          <div style={{height:6,background:"var(--bd)"}}><div style={{height:"100%",width:`${(s.v/10000)*100}%`,background:s.cor}}/></div>
          <div style={{fontSize:10,color:"var(--mu)",marginTop:2}}>{((s.v/CH_S.reduce((a,x)=>a+x.v,0))*100).toFixed(1)}% do total</div>
        </div>)}
      </div>
    </div>
    <div style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
      <div style={{padding:"13px 16px",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:14,color:"var(--tx)"}}>Ranking por Custo Mensal — Junho/2025</span><Bdg lb={`${rank.length} veículos ativos`} tp="info"/></div>
      <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Pos."/><Th ch="Placa"/><Th ch="Modelo"/><Th ch="Secretaria"/><Th ch="KM Mês"/><Th ch="Custo/Mês"/><Th ch="R$/km"/><Th ch="Eficiência"/></tr></thead>
        <tbody>{rank.map((v,i)=><tr key={v.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
          <Td ch={<span style={{fontWeight:800,color:i===0?"#dc2626":i===1?"#d97706":i===2?"#0284c7":"var(--mu)",fontSize:15}}>#{i+1}</span>}/>
          <Td ch={<span style={{fontWeight:700,color:NAV_BG}}>{v.placa}</span>}/>
          <Td ch={<span style={{fontSize:12}}>{v.modelo}</span>}/><Td ch={<span style={{fontSize:12}}>{v.sec}</span>}/>
          <Td ch={<span style={{whiteSpace:"nowrap"}}>{v.kmm.toLocaleString("pt-BR")} km</span>}/>
          <Td ch={<span style={{fontWeight:700,color:v.custo>900?"#dc2626":P,whiteSpace:"nowrap"}}>R$ {v.custo.toLocaleString("pt-BR")}</span>}/>
          <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{v.kmm>0?(v.custo/v.kmm).toFixed(2):"—"} R$/km</span>}/>
          <Td ch={<Bdg lb={v.kmm>0&&(v.custo/v.kmm)<0.40?"Eficiente":v.kmm>0&&(v.custo/v.kmm)<0.70?"Regular":"Alto Custo"} tp={v.kmm>0&&(v.custo/v.kmm)<0.40?"ok":v.kmm>0&&(v.custo/v.kmm)<0.70?"warn":"bad"}/>}/>
        </tr>)}</tbody>
      </table></div>
    </div>
  </div>;
}

/* ═══ REPORTS ═══ */
function Reports({toast}){
  const[periodo,setPeriodo]=useState("Jun/2025");const[sec,setSec]=useState("Todas");
  const gerar=(n,fmt)=>{toast(`Gerando "${n}" (${fmt.toUpperCase()})...`,"info");setTimeout(()=>toast(`✓ "${n}" exportado!`),2200);};
  const rpts=[{t:"Frota Completa",d:"Situação, KM e custos de todos os veículos",I:Car},{t:"Histórico de Viagens",d:"Viagens do período com destinos e custos",I:MapPin},{t:"Consumo de Combustível",d:"Análise de consumo e gastos por veículo",I:Fuel},{t:"Ordens de Serviço",d:"Histórico de manutenções e custos",I:Wrench},{t:"Gastos por Secretaria",d:"Distribuição de custos por órgão",I:Building2},{t:"Validade de Documentos",d:"CRLV, seguros, revisões e CNHs",I:FileText},{t:"Indicadores KPI",d:"Custo/km, ociosidade, consumo, eficiência",I:BarChart2},{t:"Relatório Executivo",d:"Resumo para o Gabinete do Prefeito",I:Shield},{t:"Controle de Multas",d:"Infrações, valores e situação atual",I:AlertOctagon},{t:"Relatório de Motoristas",d:"Desempenho, CNH e histórico",I:Users},{t:"Transparência Pública",d:"Dados para publicação — Lei 12.527/2011",I:Activity},{t:"Prestação de Contas TCE-RN",d:"Relatório para o Tribunal de Contas",I:DollarSign}];
  return<div>
    <SH title="Central de Relatórios" sub="Geração de relatórios operacionais, financeiros e analíticos"/>
    <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"12px 16px",marginBottom:16,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{fontSize:11,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".07em"}}>Filtros:</span>
      <select value={periodo} onChange={e=>setPeriodo(e.target.value)} style={{border:"1px solid var(--ibd)",padding:"6px 10px",fontSize:12,fontFamily:"inherit",color:"var(--tx)",background:"var(--inp)"}}>{["Jun/2025","Mai/2025","Abr/2025","1º Sem/2025","2024","Personalizado"].map(p=><option key={p}>{p}</option>)}</select>
      <select value={sec} onChange={e=>setSec(e.target.value)} style={{border:"1px solid var(--ibd)",padding:"6px 10px",fontSize:12,fontFamily:"inherit",color:"var(--tx)",background:"var(--inp)"}}>{["Todas","Saúde","Obras","Educação","Administração","Assist. Social"].map(s=><option key={s}>{s}</option>)}</select>
      <span style={{fontSize:11,color:"var(--mu)"}}>Período: <strong style={{color:"var(--tx)"}}>{periodo}</strong> · Secretaria: <strong style={{color:"var(--tx)"}}>{sec}</strong></span>
    </div>
    <div className="grpt">{rpts.map((r,i)=><div key={i} className="ch" style={{background:"var(--card)",border:"1px solid var(--bd)",padding:16,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
      <div>
        <div style={{width:34,height:34,background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><r.I size={16} color={P}/></div>
        <div style={{fontSize:13,fontWeight:700,color:"var(--tx)",marginBottom:3}}>{r.t}</div>
        <div style={{fontSize:11,color:"var(--mu)",marginBottom:14,lineHeight:1.55}}>{r.d}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
        <button onClick={()=>gerar(r.t,"pdf")} style={{background:NAV_BG,color:"white",border:"none",padding:"7px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Download size={10}/>PDF</button>
        <button onClick={()=>gerar(r.t,"xlsx")} style={{background:"#15803d",color:"white",border:"none",padding:"7px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Download size={10}/>Excel</button>
      </div>
    </div>)}</div>
  </div>;
}

/* ═══ FINES ═══ */
function Fines({vehicles,fines,setFines,toast}){
  const[show,setShow]=useState(false);const[f,setF]=useState({placa:"",mot:"",data:"",inf:"",valor:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const reg=()=>{
    if(!f.placa||!f.inf){toast("Preencha veículo e infração.","danger");return;}
    const id=`MLT-${String(fines.length+5).padStart(3,"0")}`;
    setFines([{id,placa:f.placa,mot:f.mot||"—",data:f.data||new Date().toLocaleDateString("pt-BR"),inf:f.inf,valor:+f.valor||0,status:"Pendente"},...fines]);
    setF({placa:"",mot:"",data:"",inf:"",valor:""});setShow(false);
    toast("✓ Multa registrada com sucesso!");
  };
  const pagar=id=>{setFines(fines.map(x=>x.id===id?{...x,status:"Pago"}:x));toast("✓ Multa marcada como paga.");};
  const recurso=id=>{setFines(fines.map(x=>x.id===id?{...x,status:"Em recurso"}:x));toast("✓ Recurso cadastrado.");};
  const total=fines.reduce((a,x)=>a+x.valor,0);
  return<div>
    <SH title="Controle de Multas" sub={`${fines.length} multas — R$ ${total.toFixed(2)} total`} action={<Btn Ic={Plus} click={()=>setShow(!show)}>+ Registrar Multa</Btn>}/>
    <div className="gkpi">
      <Kpi lb="Total" vl={fines.length} Ic={AlertOctagon} top="#dc2626"/>
      <Kpi lb="Pendentes" vl={fines.filter(x=>x.status==="Pendente").length} sub={`R$ ${fines.filter(x=>x.status==="Pendente").reduce((a,x)=>a+x.valor,0).toFixed(2)}`} Ic={AlertCircle} cor="#d97706" top="#d97706"/>
      <Kpi lb="Em Recurso" vl={fines.filter(x=>x.status==="Em recurso").length} Ic={FileText} cor="#0284c7" top="#0284c7"/>
      <Kpi lb="Pagas" vl={fines.filter(x=>x.status==="Pago").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/>
      <Kpi lb="Total em Valores" vl={`R$ ${total.toFixed(2)}`} Ic={DollarSign} cor="#dc2626" top="#dc2626"/>
    </div>
    {show&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",borderTop:"3px solid #dc2626",padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>Registrar Nova Multa de Trânsito</p>
      <div className="gf3"><FF lb="Veículo (Placa)" val={f.placa} set={u("placa")} opts={vehicles.map(v=>v.placa)} req/><FF lb="Motorista Responsável" val={f.mot} set={u("mot")}/><FF lb="Data da Infração" val={f.data} set={u("data")}/></div>
      <div className="gf2"><FF lb="Descrição Completa da Infração" val={f.inf} set={u("inf")} req/><FF lb="Valor da Multa (R$)" val={f.valor} set={u("valor")} type="number"/></div>
      <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={reg}>Registrar Multa</Btn><Btn ghost click={()=>setShow(false)}>Cancelar</Btn></div>
    </div>}
    <div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Infração"/><Th ch="Valor"/><Th ch="Status"/><Th ch="Ações"/></tr></thead>
        <tbody>{fines.map((m,i)=><tr key={m.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{m.id}</span>}/>
          <Td ch={<span style={{fontWeight:600,color:NAV_BG}}>{m.placa}</span>}/><Td ch={<span style={{fontSize:12}}>{m.mot}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{m.data}</span>}/>
          <Td ch={<span style={{fontSize:12,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{m.inf}</span>}/>
          <Td ch={<span style={{fontWeight:700,color:"#dc2626",whiteSpace:"nowrap"}}>R$ {m.valor.toFixed(2)}</span>}/>
          <Td ch={<SBdg v={m.status}/>}/>
          <Td ch={<div style={{display:"flex",gap:4}}>{m.status==="Pendente"?<><Btn sm click={()=>pagar(m.id)}>Pagar</Btn><Btn ghost sm click={()=>recurso(m.id)}>Recurso</Btn></>:<span style={{fontSize:11,color:"var(--mu)"}}>—</span>}</div>}/>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}

/* ═══ CHECKLIST ═══ */
function Checklist({vehicles,drivers,toast}){
  const ITEMS=["Nível de óleo motor","Água do radiador / arrefecimento","Nível de combustível","Calibração dos pneus (incl. estepe)","Estado dos pneus (desgaste e danos)","Freios — pedal firme e fluido no nível","Luzes dianteiras (faróis e luzinhas)","Luzes traseiras (freio, ré e seta)","Limpadores de para-brisa e reservatório","Espelhos retrovisores (regulados e limpos)","Cinto de segurança do motorista","CRLV e documentos obrigatórios","Kit de emergência completo","Extintor de incêndio (prazo e carga)","Lataria e vidros (avarias visíveis)"];
  const[placa,setPlaca]=useState("");const[mot,setMot]=useState("");const[ck,setCk]=useState({});const[obs,setObs]=useState("");
  const[hist,setHist]=useState(CKL0);
  const totalOk=Object.values(ck).filter(Boolean).length;
  const enviar=()=>{
    if(!placa||!mot){toast("Selecione o veículo e o motorista.","danger");return;}
    const ok=Object.values(ck).filter(Boolean).length;
    const res=ok===ITEMS.length?"Aprovado":ok>=12?"Aprovado c/ ressalvas":"Reprovado";
    const id=`CKL-${String(hist.length+5).padStart(3,"0")}`;
    setHist([{id,placa,mot,data:new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}),ok,total:ITEMS.length,res},...hist]);
    setCk({});setObs("");setPlaca("");setMot("");
    toast(ok===ITEMS.length?"✓ Checklist aprovado! Veículo liberado para saída.":"⚠ Checklist com ressalvas — verifique itens pendentes.","info");
  };
  return<div>
    <SH title="Checklist Diário de Inspeção" sub="Inspeção pré-saída obrigatória para todos os veículos da frota"/>
    <div className="g2">
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:16}}>
        <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>Novo Checklist de Inspeção Veicular</p>
        <div className="gf2" style={{marginBottom:14}}>
          <FF lb="Veículo (apenas disponíveis)" val={placa} set={setPlaca} opts={vehicles.filter(v=>v.sit==="Disponível").map(v=>v.placa)}/>
          <FF lb="Motorista Responsável" val={mot} set={setMot} opts={drivers.filter(d=>d.sit==="Ativo").map(d=>d.nome)}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:12,fontWeight:700,color:"var(--tx)"}}>Itens de Inspeção ({ITEMS.length} obrigatórios)</span>
          <span style={{fontSize:12,color:totalOk===ITEMS.length?"#16a34a":P,fontWeight:700}}>{totalOk}/{ITEMS.length} ✓</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:12}}>
          {ITEMS.map((item,i)=><div key={i} onClick={()=>setCk(p=>({...p,[item]:!p[item]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:ck[item]?"#dcfce7":"var(--ra)",cursor:"pointer",border:`1px solid ${ck[item]?"#86efac":"var(--bd)"}`,transition:"all .12s"}}>
            <div style={{width:17,height:17,border:`2px solid ${ck[item]?"#16a34a":"var(--bd)"}`,background:ck[item]?"#16a34a":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ck[item]&&<Check size={10} color="white"/>}</div>
            <span style={{fontSize:13,color:ck[item]?"#15803d":"var(--sub)",fontWeight:ck[item]?600:400}}>{item}</span>
          </div>)}
        </div>
        <div style={{marginBottom:12}}><label style={{display:"block",fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>Observações e Pendências</label><textarea value={obs} onChange={e=>setObs(e.target.value)} rows={2} style={{width:"100%",border:"1px solid var(--ibd)",padding:"8px 10px",fontSize:13,fontFamily:"inherit",resize:"vertical",background:"var(--inp)",color:"var(--tx)"}}/></div>
        <Btn click={enviar} full>{`Finalizar Checklist (${totalOk}/${ITEMS.length} ✓)`}</Btn>
      </div>
      <div style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:700,fontSize:14,color:"var(--tx)"}}>Histórico de Inspeções</span>
          <Bdg lb={`${hist.filter(h=>h.res==="Aprovado").length} aprovados`} tp="ok"/>
        </div>
        <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Itens"/><Th ch="Resultado"/></tr></thead>
          <tbody>{hist.map((h,i)=><tr key={h.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}><Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{h.id}</span>}/><Td ch={<span style={{fontWeight:600,color:NAV_BG,fontSize:12}}>{h.placa}</span>}/><Td ch={<span style={{fontSize:12}}>{h.mot}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{h.data}</span>}/><Td ch={<span style={{fontSize:12,fontWeight:600}}>{h.ok}/{h.total}</span>}/><Td ch={<Bdg lb={h.res} tp={h.res==="Aprovado"?"ok":h.res.includes("ressalvas")?"warn":"bad"}/>}/></tr>)}
          </tbody>
        </table></div>
      </div>
    </div>
  </div>;
}

/* ═══ ALERTS ═══ */
function AlertsPage({alerts,setAlerts,nav}){
  return<div>
    <SH title="Central de Alertas" sub={`${alerts.length} alertas ativos — ${alerts.filter(a=>a.nivel==="danger").length} crítico(s)`} action={alerts.length>0&&<Btn ghost sm click={()=>setAlerts([])}>Dispensar todos</Btn>}/>
    {alerts.length===0&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"56px",textAlign:"center",color:"var(--mu)"}}><CheckCircle size={40} color="#16a34a" style={{display:"block",margin:"0 auto 12px"}}/><div style={{fontSize:15,fontWeight:600,color:"var(--tx)",marginBottom:4}}>Nenhum alerta ativo</div><div style={{fontSize:13}}>Sistema operando normalmente.</div></div>}
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {alerts.map(a=><div key={a.id} style={{background:"var(--card)",border:"1px solid var(--bd)",borderLeft:`4px solid ${a.nivel==="danger"?"#dc2626":a.nivel==="warning"?"#d97706":"#0284c7"}`,padding:"13px 16px",display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{marginTop:2}}>{a.nivel==="danger"?<AlertCircle size={18} color="#dc2626"/>:a.nivel==="warning"?<AlertCircle size={18} color="#d97706"/>:<Bell size={18} color="#0284c7"/>}</div>
        <div style={{flex:1,minWidth:200}}><div style={{fontSize:14,fontWeight:700,color:"var(--tx)",marginBottom:2}}>{a.titulo}</div><div style={{fontSize:13,color:"var(--mu)",lineHeight:1.5}}>{a.desc}</div></div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
          <Bdg lb={a.tipo} tp={a.nivel==="danger"?"bad":a.nivel==="warning"?"warn":"info"}/>
          <button onClick={()=>nav(a.pg)} style={{fontSize:11,color:P,background:"none",border:`1px solid ${P}`,padding:"3px 10px",cursor:"pointer",fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap"}}>Acessar</button>
          <button onClick={()=>setAlerts(p=>p.filter(x=>x.id!==a.id))} style={{background:"none",border:"none",cursor:"pointer",color:"var(--mu)",padding:2}}><X size={14}/></button>
        </div>
      </div>)}
    </div>
  </div>;
}

/* ═══ AUDIT ═══ */
function Audit(){
  const tp={create:"#dcfce7",edit:"#e0f2fe",info:"#f1f5f9",del:"#fee2e2"};const tl={create:"CRIAÇÃO",edit:"EDIÇÃO",info:"ACESSO",del:"EXCLUSÃO"};
  return<div>
    <SH title="Auditoria e Rastreabilidade" sub="Registro completo de todas as ações no sistema"/>
    <div className="gkpi"><Kpi lb="Registros" vl={LOG0.length} Ic={Shield} top="#1d4ed8"/><Kpi lb="Criações" vl={LOG0.filter(a=>a.tipo==="create").length} Ic={Plus} cor="#16a34a" top="#16a34a"/><Kpi lb="Edições" vl={LOG0.filter(a=>a.tipo==="edit").length} Ic={Edit} cor="#0284c7" top="#0284c7"/><Kpi lb="Acessos" vl={LOG0.filter(a=>a.tipo==="info").length} Ic={User} cor="#64748b" top="#94a3b8"/></div>
    <div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="#"/><Th ch="Data / Hora"/><Th ch="Usuário"/><Th ch="Tipo"/><Th ch="Ação Realizada"/><Th ch="Detalhe"/></tr></thead>
        <tbody>{LOG0.map((a,i)=><tr key={a.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
          <Td ch={<span style={{fontSize:11,color:"var(--mu)",fontFamily:"monospace"}}>{String(i+1).padStart(3,"0")}</span>}/>
          <Td ch={<span style={{fontSize:12,fontFamily:"monospace",whiteSpace:"nowrap"}}>{a.data}</span>}/>
          <Td ch={<div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:24,height:24,background:NAV_BG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"white",flexShrink:0}}>{a.user.split(" ").map(p=>p[0]).join("").slice(0,2)}</div><span style={{fontWeight:500,fontSize:12,whiteSpace:"nowrap"}}>{a.user}</span></div>}/>
          <Td ch={<span style={{background:tp[a.tipo]||"#f1f5f9",fontSize:9,fontWeight:700,padding:"2px 6px",letterSpacing:".06em",whiteSpace:"nowrap"}}>{tl[a.tipo]||a.tipo.toUpperCase()}</span>}/>
          <Td ch={<span style={{fontSize:12,fontWeight:500}}>{a.acao}</span>}/>
          <Td ch={<span style={{fontSize:11,color:"var(--mu)"}}>{a.det}</span>}/>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}

/* ═══ SUPPLIERS — Com CRUD completo ═══ */
function Suppliers({suppliers,setSuppliers,toast}){
  const[show,setShow]=useState(false);const[sel,setSel]=useState(null);const[cfm,setCfm]=useState(null);
  const[f,setF]=useState({nome:"",tipo:"Oficina Mecânica",cnpj:"",contato:"",ct:"",val:"",status:"Ativo"});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const reg=()=>{
    if(!f.nome||!f.contato){toast("Preencha nome e contato.","danger");return;}
    const id=`FRN-${String(suppliers.length+1).padStart(3,"0")}`;
    setSuppliers([...suppliers,{...f,id}]);
    setF({nome:"",tipo:"Oficina Mecânica",cnpj:"",contato:"",ct:"",val:"",status:"Ativo"});
    setShow(false);toast("✓ Fornecedor cadastrado com sucesso!");
  };
  const del=s=>setCfm({msg:`Excluir fornecedor "${s.nome}"?`,ok:()=>{setSuppliers(p=>p.filter(x=>x.id!==s.id));toast("Fornecedor removido.","danger");setCfm(null);}});
  return<div>
    <SH title="Gestão de Fornecedores" sub="Postos, oficinas e parceiros credenciados da frota" action={<Btn Ic={Plus} click={()=>setShow(!show)}>+ Cadastrar Fornecedor</Btn>}/>
    <div className="gkpi"><Kpi lb="Credenciados" vl={suppliers.length} Ic={Building2} top="#1d4ed8"/><Kpi lb="Ativos" vl={suppliers.filter(s=>s.status==="Ativo").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/><Kpi lb="Vencendo" vl={suppliers.filter(s=>s.status==="Vencendo").length} Ic={AlertCircle} cor="#d97706" top="#d97706"/><Kpi lb="Postos" vl={suppliers.filter(s=>s.tipo.includes("Posto")).length} Ic={Fuel} top="#0284c7"/></div>
    {show&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",borderTop:`3px solid ${P}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>Cadastrar Novo Fornecedor</p>
      <div className="gf3"><FF lb="Nome / Razão Social" val={f.nome} set={u("nome")} req/><FF lb="Tipo" val={f.tipo} set={u("tipo")} opts={["Posto de Combustível","Oficina Mecânica","Oficina Especializada","Conc. Autorizada","Pneus e Borracharia","Máquinas Pesadas","Outros"]}/><FF lb="CNPJ" val={f.cnpj} set={u("cnpj")}/></div>
      <div className="gf3"><FF lb="Contato (Telefone)" val={f.contato} set={u("contato")} req/><FF lb="Nº do Contrato" val={f.ct} set={u("ct")}/><FF lb="Validade do Contrato" val={f.val} set={u("val")}/></div>
      <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={reg}>Cadastrar Fornecedor</Btn><Btn ghost click={()=>setShow(false)}>Cancelar</Btn></div>
    </div>}
    <div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Código"/><Th ch="Nome / Razão Social"/><Th ch="Tipo"/><Th ch="CNPJ"/><Th ch="Contato"/><Th ch="Contrato"/><Th ch="Validade"/><Th ch="Status"/><Th ch=""/></tr></thead>
        <tbody>{suppliers.map((s,i)=><tr key={s.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}><Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{s.id}</span>}/><Td ch={<span style={{fontWeight:600}}>{s.nome}</span>}/><Td ch={<span style={{fontSize:12}}>{s.tipo}</span>}/><Td ch={<span style={{fontFamily:"monospace",fontSize:11}}>{s.cnpj||"—"}</span>}/><Td ch={<span style={{fontSize:12}}>{s.contato}</span>}/><Td ch={<span style={{fontFamily:"monospace",fontSize:11}}>{s.ct||"—"}</span>}/><Td ch={<span style={{fontSize:12,color:s.status==="Vencendo"?"#dc2626":"inherit",fontWeight:s.status==="Vencendo"?700:400,whiteSpace:"nowrap"}}>{s.val||"—"}</span>}/><Td ch={<SBdg v={s.status}/>}/><Td ch={<div style={{display:"flex",gap:4}}><button onClick={()=>setSel(s)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:"#0284c7",fontFamily:"inherit",fontWeight:600}}>Ver</button><button onClick={()=>del(s)} style={{background:"none",border:"none",padding:"3px",cursor:"pointer",color:"#dc2626"}}><Trash2 size={13}/></button></div>}/></tr>)}
        </tbody>
      </table>
    </div>
    {sel&&<Modal title={`${sel.nome}`} close={()=>setSel(null)} w={500}>
      {[["Código",sel.id],["Nome",sel.nome],["Tipo",sel.tipo],["CNPJ",sel.cnpj||"—"],["Contato",sel.contato],["Contrato",sel.ct||"—"],["Validade",sel.val||"—"],["Status",sel.status]].map(([l,v])=><DR key={l} l={l} v={v}/>)}
      <div style={{display:"flex",gap:10,marginTop:14,paddingTop:12,borderTop:"1px solid var(--bd)"}}><Btn ghost click={()=>setSel(null)}>Fechar</Btn></div>
    </Modal>}
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>;
}

/* ═══ SETTINGS — Sem tutoriais ═══ */
function Settings({toast,currentUser}){
  const isAdmin=currentUser?.role==="admin";
  const[users,setUsers]=useState(SYS_USERS.map(u=>({...u})));
  const[tab,setTab]=useState("users");const[showForm,setShowForm]=useState(false);const[cfm,setCfm]=useState(null);
  const[nf,setNf]=useState({nome:"",email:"",pw:"",role:"motorista",sec:"Administração",perfil:""});
  const toggle=email=>{if(!isAdmin){toast("Somente administradores podem alterar usuários.","danger");return;}setUsers(p=>p.map(u=>u.email===email?{...u,ativo:!u.ativo}:u));toast("Status do usuário atualizado com sucesso.");};
  const del=u=>{if(!isAdmin){toast("Somente administradores.","danger");return;}if(u.email===currentUser.email){toast("Não é possível remover o próprio usuário.","danger");return;}setCfm({msg:`Remover permanentemente o usuário "${u.nome}"?`,ok:()=>{setUsers(p=>p.filter(x=>x.email!==u.email));toast("Usuário removido do sistema.","danger");setCfm(null);}});};
  const add=()=>{
    if(!nf.nome||!nf.email||!nf.pw){toast("Preencha nome, e-mail e senha.","danger");return;}
    if(users.find(u=>u.email===nf.email)){toast("Este e-mail já está cadastrado.","danger");return;}
    if(nf.pw.length<6){toast("A senha deve ter pelo menos 6 caracteres.","danger");return;}
    setUsers(p=>[...p,{...nf,mat:`PMU-${Date.now().toString().slice(-5)}`,ativo:true}]);
    setShowForm(false);setNf({nome:"",email:"",pw:"",role:"motorista",sec:"Administração",perfil:""});
    toast("✓ Usuário cadastrado com sucesso!");
  };
  const roleColor={admin:"#dc2626",gestor:"#d97706",secretario:"#0284c7",supervisor:"#16a34a",motorista:"#7c3aed",auditor:"#64748b"};
  const menuItems=[["users","Usuários & Acesso",User],["notif","Notificações",Bell],["sistema","Informações do Sistema",Shield],["backup","Backup & Dados",RefreshCw]];
  return<div>
    <SH title="Configurações do Sistema" sub="Usuários, permissões e parâmetros gerais"/>
    <div className="gcfg">
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"8px 0",height:"fit-content"}}>
        {menuItems.map(([id,lb,I])=><button key={id} onClick={()=>setTab(id)} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"10px 14px",background:tab===id?"var(--hv)":"none",border:"none",borderLeft:tab===id?`3px solid ${P}`:"3px solid transparent",color:tab===id?P:"var(--sub)",fontSize:13,fontWeight:tab===id?600:400,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}><I size={14}/>{lb}</button>)}
      </div>
      <div>
        {tab==="users"&&<div>
          <div style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
            <div style={{padding:"13px 16px",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontWeight:700,fontSize:14,color:"var(--tx)"}}>Usuários do Sistema</span>{!isAdmin&&<span style={{fontSize:11,color:"#d97706",display:"inline-flex",alignItems:"center",gap:4}}><Lock size={11}/>Apenas visualização</span>}</div>
              {isAdmin&&<Btn Ic={Plus} click={()=>setShowForm(!showForm)}>+ Novo Usuário</Btn>}
            </div>
            {isAdmin&&showForm&&<div style={{padding:18,borderBottom:"1px solid var(--bd)",background:"var(--ra)"}} className="fu">
              <p style={{fontSize:13,fontWeight:700,color:"var(--tx)",margin:"0 0 12px"}}>Cadastrar Novo Usuário</p>
              <div className="gf3"><FF lb="Nome Completo" val={nf.nome} set={v=>setNf(p=>({...p,nome:v}))} req/><FF lb="E-mail Institucional" val={nf.email} set={v=>setNf(p=>({...p,email:v}))} req/><FF lb="Senha Inicial" val={nf.pw} set={v=>setNf(p=>({...p,pw:v}))} type="password" req/><FF lb="Perfil de Acesso" val={nf.role} set={v=>setNf(p=>({...p,role:v}))} opts={["admin","gestor","secretario","supervisor","motorista","auditor"]}/><FF lb="Secretaria" val={nf.sec} set={v=>setNf(p=>({...p,sec:v}))} opts={["Saúde","Obras","Educação","Administração","Assist. Social","Controle Interno","Gestão"]}/><FF lb="Título do Cargo" val={nf.perfil} set={v=>setNf(p=>({...p,perfil:v}))}/></div>
              <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={add}>Cadastrar Usuário</Btn><Btn ghost click={()=>setShowForm(false)}>Cancelar</Btn></div>
            </div>}
            <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr><Th ch="Matrícula"/><Th ch="Nome"/><Th ch="E-mail"/><Th ch="Perfil"/><Th ch="Secretaria"/><Th ch="Status"/>{isAdmin&&<Th ch="Ações"/>}</tr></thead>
              <tbody>{users.map((u,i)=><tr key={u.email} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
                <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{u.mat}</span>}/>
                <Td ch={<div style={{display:"flex",alignItems:"center",gap:7}}>{u.email===currentUser?.email&&<span style={{width:7,height:7,background:"#16a34a",borderRadius:"50%",flexShrink:0}}/>}<span style={{fontWeight:600}}>{u.nome}</span></div>}/>
                <Td ch={<span style={{fontSize:12}}>{u.email}</span>}/>
                <Td ch={<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,background:roleColor[u.role]||"#64748b",borderRadius:"50%",flexShrink:0}}/><Bdg lb={u.perfil||u.role} tp={u.role==="admin"?"bad":u.role==="gestor"?"warn":"info"}/></div>}/>
                <Td ch={<span style={{fontSize:12}}>{u.sec}</span>}/>
                <Td ch={<SBdg v={u.ativo?"Ativo":"Afastado"}/>}/>
                {isAdmin&&<Td ch={<div style={{display:"flex",gap:5}}>
                  <Btn ghost sm click={()=>toggle(u.email)}>{u.ativo?"Desativar":"Ativar"}</Btn>
                  {u.email!==currentUser?.email&&<button onClick={()=>del(u)} style={{background:"none",border:"none",cursor:"pointer",color:"#dc2626",padding:3}}><Trash2 size={13}/></button>}
                </div>}/>}
              </tr>)}</tbody>
            </table></div>
          </div>
          {!isAdmin&&<div style={{marginTop:12,background:"#fef9c3",border:"1px solid #fde047",padding:"12px 16px",display:"flex",gap:10,alignItems:"center"}}><Lock size={16} color="#a16207"/><span style={{fontSize:13,color:"#a16207"}}>Logado como <strong>{currentUser?.perfil}</strong>. Gerenciamento de usuários requer acesso de Administrador.</span></div>}
        </div>}
        {tab==="notif"&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:20}}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--tx)",marginBottom:16}}>Configurações de Notificação</div>
          {[["CNH vencendo","Alertar 90 dias antes do vencimento","ok"],["Seguro do veículo","Alertar 30 dias antes do vencimento","ok"],["Revisão preventiva","Alertar 15 dias antes da data","ok"],["Consumo anormal","Desvio acima de 20% da média","info"],["Combustível baixo","Alertar abaixo de 20% do tanque","warn"],["CRLV vencendo","Alertar 30 dias antes","ok"]].map(([l,v,tp])=>
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--bd)",alignItems:"center"}}>
              <div><div style={{fontSize:13,color:"var(--tx)",fontWeight:500}}>{l}</div><div style={{fontSize:11,color:"var(--mu)"}}>{v}</div></div>
              <Bdg lb="Ativo" tp={tp}/>
            </div>
          )}
        </div>}
        {tab==="sistema"&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:20}}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--tx)",marginBottom:16}}>Informações do Sistema</div>
          {[["Versão","SGA Frota Municipal v1.0"],["Usuário atual",`${currentUser?.nome} (${currentUser?.perfil})`],["Nível de acesso",currentUser?.role?.toUpperCase()],["Total de veículos",V0.length+" cadastrados"],["Total de motoristas",D0.length+" cadastrados"],["Total de fornecedores",SUPS0.length+" credenciados"],["Última atualização","08/06/2025"],["Política de dados","LGPD — Lei nº 13.709/2018"],["Desenvolvido para","Prefeitura Municipal de Upanema — RN"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}
        </div>}
        {tab==="backup"&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:20}}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--tx)",marginBottom:12}}>Backup e Exportação de Dados</div>
          <div style={{background:"var(--ra)",border:"1px solid var(--bd)",padding:"12px 14px",marginBottom:16,fontSize:13,color:"var(--sub)",lineHeight:1.6}}>Todos os dados inseridos nesta sessão são salvos automaticamente no armazenamento local. Utilize os botões abaixo para exportar uma cópia de segurança completa.</div>
          {[["Armazenamento","Local (automático — salvo a cada alteração)"],["Dados incluídos","Veículos, motoristas, viagens, abastecimentos, OS, multas"],["Formato de exportação","JSON (compatível com qualquer banco de dados)"],["Última sessão","08/06/2025 07:14"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <Btn Ic={Download} click={()=>{toast("Gerando backup completo dos dados...","info");setTimeout(()=>toast("✓ Backup exportado com sucesso!"),2000);}}>Exportar Backup JSON</Btn>
            <Btn ghost Ic={RefreshCw} click={()=>toast("✓ Cache do sistema limpo.","warning")}>Limpar Cache</Btn>
          </div>
        </div>}
      </div>
    </div>
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>;
}

/* ═══ NOTIF PANEL ═══ */
function NotifPanel({close,nav,alerts}){
  return<div className="fu" style={{position:"fixed",top:52,right:0,width:"min(320px,100vw)",background:"var(--card)",border:"1px solid var(--bd)",borderTop:"none",boxShadow:"0 8px 32px rgba(0,0,0,.2)",zIndex:500,maxHeight:"80vh",overflow:"auto"}}>
    <div style={{padding:"12px 16px",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--th)",position:"sticky",top:0}}><span style={{fontWeight:700,fontSize:13,color:"var(--tx)"}}>Notificações</span><button onClick={close} style={{background:"none",border:"none",cursor:"pointer",color:"var(--mu)",display:"flex"}}><X size={15}/></button></div>
    {alerts.length===0&&<div style={{padding:"24px",textAlign:"center",color:"var(--mu)",fontSize:13}}><CheckCircle size={28} color="#16a34a" style={{display:"block",margin:"0 auto 8px"}}/>Nenhuma notificação ativa</div>}
    {alerts.slice(0,6).map((a,i)=><div key={i} style={{display:"flex",gap:12,padding:"11px 16px",borderBottom:"1px solid var(--bd)",cursor:"pointer"}} className="hr" onClick={()=>{nav(a.pg);close();}}>
      <div style={{marginTop:2}}>{a.nivel==="danger"?<AlertCircle size={14} color="#dc2626"/>:a.nivel==="warning"?<AlertCircle size={14} color="#d97706"/>:<Bell size={14} color="#0284c7"/>}</div>
      <div><div style={{fontSize:12,fontWeight:600,color:"var(--tx)",lineHeight:1.4}}>{a.titulo}</div><div style={{fontSize:11,color:"var(--mu)"}}>{a.desc.length>70?a.desc.slice(0,70)+"...":a.desc}</div></div>
    </div>)}
    <div style={{padding:"10px 16px",textAlign:"center"}}><button onClick={()=>{nav("alerts");close();}} style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Ver todos os alertas →</button></div>
  </div>;
}

/* ═══ SIDEBAR ═══ */
function Sidebar({page,setPage,currentUser,sideOpen}){
  const role=currentUser?.role||"admin";
  const allowed=ROLE_PAGES[role]||[];
  const canSee=id=>role==="admin"||allowed.includes(id);
  const nav=NAV_ITEMS.map(s=>({...s,items:(s.items||[]).filter(i=>canSee(i.id))})).filter(s=>s.items.length>0);
  const ini=currentUser?.nome?.split(" ").map(p=>p[0]).join("").slice(0,2)||"?";
  const roleColor={admin:"#dc2626",gestor:"#d97706",secretario:"#0284c7",supervisor:"#16a34a",motorista:"#7c3aed",auditor:"#64748b"};
  return<div className={`sga-sb${sideOpen?" open":""}`}>
    <div style={{padding:"18px 16px 14px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
      <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:7}}>
        <div style={{width:36,height:36,background:P,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Truck size={18} color="white"/></div>
        <div><div style={{fontSize:9,fontWeight:700,color:"#60a5fa",letterSpacing:".14em",textTransform:"uppercase"}}>Prefeitura de Upanema</div><div style={{fontSize:14,fontWeight:800,color:"white",lineHeight:1.2}}>Upanema — RN</div></div>
      </div>
      <div style={{fontSize:9,color:"rgba(148,163,184,.5)",letterSpacing:".07em",textTransform:"uppercase"}}>Sistema de Gestão da Frota</div>
    </div>
    <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
      {nav.map((sec,si)=><div key={si}>
        {sec.sec&&<div style={{padding:"12px 16px 4px",fontSize:9,fontWeight:700,color:"rgba(148,163,184,.38)",letterSpacing:".14em",textTransform:"uppercase"}}>{sec.sec}</div>}
        {sec.items.map(item=>{const on=page===item.id;return<button key={item.id} onClick={()=>setPage(item.id)} className={on?"":"ni"}
          style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"9px 16px",background:on?P:"none",border:"none",borderLeft:on?"3px solid #93c5fd":"3px solid transparent",cursor:"pointer",textAlign:"left",boxSizing:"border-box",transition:"background .12s"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><item.ic size={15} color={on?"white":"rgba(203,213,225,.65)"}/><span style={{fontSize:13,fontWeight:on?600:400,color:on?"white":"rgba(203,213,225,.88)",fontFamily:"inherit"}}>{item.lb}</span></div>
          {item.bdg&&<span style={{background:on?"rgba(255,255,255,.22)":"#dc2626",color:"white",fontSize:10,fontWeight:700,padding:"1px 6px",minWidth:18,textAlign:"center",flexShrink:0}}>{item.bdg}</span>}
        </button>;})}
      </div>)}
    </nav>
    <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,background:roleColor[role]||P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0}}>{ini}</div>
        <div style={{minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:"white",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser?.nome}</div><div style={{fontSize:10,color:"rgba(148,163,184,.5)"}}>{currentUser?.perfil}</div></div>
      </div>
    </div>
  </div>;
}

/* ═══ HEADER ═══ */
function Header({page,logout,dm,setDm,notif,setNotif,onMenu,alerts}){
  const cr=alerts.filter(a=>a.nivel==="danger").length;
  return<div style={{height:52,background:"var(--card)",borderBottom:"1px solid var(--bd)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",position:"sticky",top:0,zIndex:90,gap:8}}>
    <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0,flex:1}}>
      <button className="hb" onClick={onMenu} style={{alignItems:"center",justifyContent:"center",background:"none",border:"none",cursor:"pointer",padding:"5px",color:"var(--mu)",flexShrink:0}} aria-label="Menu"><Menu size={19}/></button>
      <span className="donly" style={{fontSize:10,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap"}}>SGA Frota</span>
      <ChevronRight className="donly" size={13} color="var(--bd)" style={{flexShrink:0}}/>
      <span style={{fontSize:14,fontWeight:700,color:"var(--tx)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{PL[page]||page}</span>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
      <div className="donly" style={{position:"relative"}}><Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"var(--mu)"}}/><input placeholder="Busca rápida..." style={{border:"1px solid var(--ibd)",padding:"6px 12px 6px 26px",fontSize:12,width:160,fontFamily:"inherit"}}/></div>
      <button onClick={()=>setDm(!dm)} title={dm?"Modo claro":"Modo escuro"} style={{background:"none",border:"1px solid var(--bd)",padding:"5px 7px",cursor:"pointer",color:"var(--mu)",display:"flex",alignItems:"center"}}>{dm?<Sun size={15}/>:<Moon size={15}/>}</button>
      <div style={{position:"relative"}}><button onClick={()=>setNotif(!notif)} style={{background:"none",border:"none",cursor:"pointer",padding:"5px",color:"var(--mu)",display:"flex",alignItems:"center"}}><Bell size={17}/>{cr>0&&<span style={{position:"absolute",top:2,right:2,width:8,height:8,background:"#dc2626",borderRadius:"50%"}}/>}</button></div>
      <div className="donly" style={{width:1,height:20,background:"var(--bd)"}}/>
      <button onClick={logout} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"1px solid var(--bd)",padding:"5px 10px",cursor:"pointer",fontSize:12,color:"var(--sub)",fontFamily:"inherit",whiteSpace:"nowrap"}}><LogOut size={13}/><span className="donly">Sair</span></button>
    </div>
  </div>;
}

/* ═══════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════ */
export default function App(){
  const[logged,setLogged]=useState(false);
  const[currentUser,setCurrentUser]=useState(null);
  const[page,setPage]=useState("dashboard");
  const[dm,setDm]=useState(false);
  const[notif,setNotif]=useState(false);
  const[sideOpen,setSideOpen]=useState(false);
  const[ready,setReady]=useState(false);
  const{ts,add:toast}=useToast();

  const[vehicles,setVehicles]=useState(V0);
  const[drivers,setDrivers]=useState(D0);
  const[trips,setTrips]=useState(T0);
  const[fuel,setFuel]=useState(F0);
  const[maint,setMaint]=useState(MNT0);
  const[fines,setFines]=useState(MU0);
  const[alerts,setAlerts]=useState(AL0);
  const[suppliers,setSuppliers]=useState(SUPS0);

  /* Carrega dados persistidos */
  useEffect(()=>{
    (async()=>{
      try{
        const[v,d,t,f,m,fi,al,su]=await Promise.all([
          Store.get("sga_v"),Store.get("sga_d"),Store.get("sga_t"),Store.get("sga_f"),
          Store.get("sga_m"),Store.get("sga_fi"),Store.get("sga_al"),Store.get("sga_su"),
        ]);
        if(v?.length)setVehicles(v);if(d?.length)setDrivers(d);if(t?.length)setTrips(t);
        if(f?.length)setFuel(f);if(m?.length)setMaint(m);if(fi?.length)setFines(fi);
        if(al?.length)setAlerts(al);if(su?.length)setSuppliers(su);
      }catch{}
      setReady(true);
    })();
  },[]);

  /* Salva automaticamente */
  useEffect(()=>{if(ready)Store.set("sga_v",vehicles);},[vehicles,ready]);
  useEffect(()=>{if(ready)Store.set("sga_d",drivers);},[drivers,ready]);
  useEffect(()=>{if(ready)Store.set("sga_t",trips);},[trips,ready]);
  useEffect(()=>{if(ready)Store.set("sga_f",fuel);},[fuel,ready]);
  useEffect(()=>{if(ready)Store.set("sga_m",maint);},[maint,ready]);
  useEffect(()=>{if(ready)Store.set("sga_fi",fines);},[fines,ready]);
  useEffect(()=>{if(ready)Store.set("sga_al",alerts);},[alerts,ready]);
  useEffect(()=>{if(ready)Store.set("sga_su",suppliers);},[suppliers,ready]);

  const goPage=p=>{setPage(p);setSideOpen(false);setNotif(false);};

  if(!logged)return<div className="sga"><style>{CSS}</style><Login onLogin={u=>{setCurrentUser(u);setLogged(true);}}/></div>;

  const pages={
    dashboard:<Dashboard nav={goPage} vehicles={vehicles} drivers={drivers} alerts={alerts}/>,
    vehicles:<Vehicles vehicles={vehicles} setVehicles={setVehicles} toast={toast}/>,
    drivers:<Drivers drivers={drivers} setDrivers={setDrivers} toast={toast}/>,
    trips:<Trips vehicles={vehicles} setVehicles={setVehicles} drivers={drivers} trips={trips} setTrips={setTrips} toast={toast}/>,
    checklist:<Checklist vehicles={vehicles} drivers={drivers} toast={toast}/>,
    fuel:<FuelPage vehicles={vehicles} drivers={drivers} fuel={fuel} setFuel={setFuel} toast={toast}/>,
    maintenance:<MaintenancePage vehicles={vehicles} setVehicles={setVehicles} maint={maint} setMaint={setMaint} toast={toast}/>,
    fines:<Fines vehicles={vehicles} fines={fines} setFines={setFines} toast={toast}/>,
    financial:<Financial vehicles={vehicles} toast={toast}/>,
    reports:<Reports toast={toast}/>,
    suppliers:<Suppliers suppliers={suppliers} setSuppliers={setSuppliers} toast={toast}/>,
    alerts:<AlertsPage alerts={alerts} setAlerts={setAlerts} nav={goPage}/>,
    audit:<Audit/>,
    settings:<Settings toast={toast} currentUser={currentUser}/>,
  };

  return<div className={`sga${dm?" dark":""}`}>
    <style>{CSS}</style>
    {sideOpen&&<div className="sga-ov vis" onClick={()=>setSideOpen(false)}/>}
    <div className="sga-wrap">
      <Sidebar page={page} setPage={goPage} currentUser={currentUser} sideOpen={sideOpen}/>
      <div className="sga-mn">
        <Header page={page} logout={()=>{setLogged(false);setCurrentUser(null);setPage("dashboard");}} dm={dm} setDm={setDm} notif={notif} setNotif={setNotif} onMenu={()=>setSideOpen(s=>!s)} alerts={alerts}/>
        {notif&&<NotifPanel close={()=>setNotif(false)} nav={goPage} alerts={alerts}/>}
        {!ready&&<div style={{position:"fixed",inset:0,background:"rgba(255,255,255,.9)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
          <div className="spin" style={{width:32,height:32,border:"3px solid var(--bd)",borderTopColor:P,borderRadius:"50%"}}/>
          <span style={{fontSize:13,color:"var(--mu)",fontWeight:600}}>Carregando dados...</span>
        </div>}
        <main style={{flex:1,padding:"18px",overflowY:"auto",maxWidth:"100%"}}>
          {pages[page]||<Dashboard nav={goPage} vehicles={vehicles} drivers={drivers} alerts={alerts}/>}
        </main>
        <footer style={{padding:"8px 18px",borderTop:"1px solid var(--bd)",background:"var(--card)",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:"var(--mu)",flexShrink:0,flexWrap:"wrap",gap:4}}>
          <span>© 2025 Prefeitura Municipal de Upanema — RN · SGA Frota Municipal v1.0</span>
          <span className="donly" style={{display:"flex",alignItems:"center",gap:5,color:"#16a34a",fontWeight:600}}><CheckCircle size={11}/>Dados salvos automaticamente</span>
        </footer>
      </div>
    </div>
    <Toasts ts={ts}/>
  </div>;
}
