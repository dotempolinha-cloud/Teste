/*
╔══════════════════════════════════════════════════════════════════
║  SGA — Sistema de Gestão da Garagem Municipal
║  Prefeitura de Upanema — RN  •  Versão Final 1.0
║
║  🔥 GUIA FIREBASE (substituir DB.load/DB.save quando pronto)
║  ─────────────────────────────────────────────────────────────
║  1. npm install firebase
║  2. firebase.google.com → Novo projeto "upanema-sga"
║  3. Copiar firebaseConfig e descomentar bloco abaixo
║  4. Substituir Store.get/set por Firestore (ver comentários)
║
║  Coleções Firestore:
║   /vehicles  /drivers  /trips  /fuel  /maint  /fines  /users
╚══════════════════════════════════════════════════════════════════
*/

import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import {
  LayoutDashboard, Car, Users, MapPin, Fuel, Wrench, DollarSign,
  FileText, Bell, Settings, LogOut, Search, Plus, Edit, Download,
  CheckCircle, AlertCircle, AlertTriangle, Truck, X, Check,
  Activity, Shield, User, Calendar, BarChart2, ClipboardList,
  Building2, CheckSquare, AlertOctagon, Moon, Sun, Trash2,
  Save, TrendingUp, TrendingDown, Menu, Lock, Eye, EyeOff, Wifi,
} from "lucide-react";

/* ══════════ HOOK: TAMANHO DA TELA (100% JavaScript) ══════════ */
function useWS() {
  const [W, setW] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1280));
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return W;
}

/* ══════════ CAMADA DE DADOS — Firebase Ready ══════════
   Para integrar Firebase, substitua Store.get/set por:
   import { collection, getDocs, setDoc, doc } from "firebase/firestore";
   DB.load = async (col) => { const s = await getDocs(collection(db,col)); return s.docs.map(d=>({id:d.id,...d.data()})); }
   DB.save = async (col,data) => { await setDoc(doc(db,"snapshots",col), {data,ts:Date.now()}); }
════════════════════════════════════════════════════════ */
const Store = {
  async get(k) {
    try { const r = await window.storage?.get(k); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async set(k, v) {
    try { await window.storage?.set(k, JSON.stringify(v)); } catch {}
  },
};

/* ══════════ TOKENS ══════════ */
const P = "#1d4ed8";
const NAV_BG = "#0c1a47";

/* ══════════ CSS GLOBAL ══════════ */
const CSS = `
html,body{margin:0;padding:0;width:100%;overflow-x:hidden;}
.sga{--c:#fff;--b:#f0f4f8;--bd:#e2e8f0;--tx:#0f172a;--sx:#374151;--mu:#64748b;--th:#f8fafc;--ra:#f9fafb;--hv:#eff6ff;--in:#fff;--ibd:#d1d5db;font-family:'Segoe UI',system-ui,sans-serif;width:100%;min-height:100vh;}
.sga.dark{--c:#102038;--b:#0c1828;--bd:#1b3054;--tx:#f1f5f9;--sx:#cbd5e1;--mu:#7090b8;--th:#091525;--ra:#091525;--hv:#152d52;--in:#091525;--ibd:#1b3054;}
.sga *{box-sizing:border-box;}
.sga input,.sga select,.sga textarea{background:var(--in);color:var(--tx);font-family:inherit;outline:none;transition:border-color .15s;}
.sga input:focus,.sga select:focus,.sga textarea:focus{border-color:#1d4ed8!important;}
.sga input::placeholder,.sga textarea::placeholder{color:var(--mu);}
/* Hover helpers */
.hr:hover{background:var(--hv)!important;cursor:pointer;}
.ni:hover{background:rgba(255,255,255,.07)!important;}
.ch:hover{border-color:#1d4ed8!important;}
/* Scrollable tables */
.tbl{overflow-x:auto;-webkit-overflow-scrolling:touch;}
/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes spin{to{transform:rotate(360deg)}}
.fu{animation:fadeUp .22s ease;}
.blink{animation:blink 2.2s ease infinite;}
.spin{animation:spin .8s linear infinite;}
`;

const bdr = (c) => `1px solid ${c || "var(--bd)"}`;
const card = () => "var(--c)";
const bg = () => "var(--b)";
const tx = () => "var(--tx)";
const mu = () => "var(--mu)";
const sub = () => "var(--sx)";
const th = () => "var(--th)";
const ra = () => "var(--ra)";

/* ══════════ USUÁRIOS DO SISTEMA ══════════ */
const SYS_USERS = [
  {email:"admin@upanema.rn.gov.br",pw:"admin123",nome:"Administrador Geral",role:"admin",perfil:"Administrador",sec:"Gestão Municipal",mat:"PMU-ADMIN",ativo:true},
  {email:"gestor@upanema.rn.gov.br",pw:"gestor123",nome:"Carlos Ferreira",role:"gestor",perfil:"Gestor da Garagem",sec:"Obras",mat:"PMU-GRG01",ativo:true},
  {email:"saude@upanema.rn.gov.br",pw:"saude123",nome:"Dra. Luísa Amaral",role:"secretario",perfil:"Secretária de Saúde",sec:"Saúde",mat:"PMU-SAU01",ativo:true},
  {email:"obras@upanema.rn.gov.br",pw:"obras123",nome:"Eng. Marcos Lima",role:"supervisor",perfil:"Supervisor de Obras",sec:"Obras",mat:"PMU-OBR01",ativo:true},
  {email:"motorista@upanema.rn.gov.br",pw:"motor123",nome:"João Silva",role:"motorista",perfil:"Motorista",sec:"Obras",mat:"PMU-001234",ativo:true},
  {email:"auditor@upanema.rn.gov.br",pw:"audit123",nome:"Fernando Auditoria",role:"auditor",perfil:"Auditor Externo",sec:"Controle Interno",mat:"PMU-AUD01",ativo:false},
];

const ROLES = {admin:["Tudo"],gestor:["dashboard","vehicles","drivers","trips","checklist","fuel","maintenance","fines","financial","reports","suppliers","alerts","audit"],secretario:["dashboard","vehicles","trips","financial","reports","alerts"],supervisor:["dashboard","vehicles","drivers","trips","checklist","maintenance","alerts"],motorista:["dashboard","trips","checklist"],auditor:["dashboard","vehicles","drivers","financial","reports","audit"]};

/* ══════════ DADOS INICIAIS ══════════ */
const V0 = [
  {id:"V001",placa:"QRZ-1A34",renavam:"00123456789",chassi:"9BWZZZ377VT004251",marca:"Ford",modelo:"Transit 2.2 Diesel",ano:2020,cor:"Branco",tipo:"Van",cat:"Transporte",sec:"Saúde",km:45320,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"01/08/2025",seg:"31/12/2025",pat:"PMU-0123",niv:75,obs:"Prioritário transporte de pacientes",mul:0,custo:889,kmm:1240},
  {id:"V002",placa:"QST-2B56",renavam:"00987654321",chassi:"9BWZZZ377VT004252",marca:"Chevrolet",modelo:"S10 2.8 Diesel",ano:2019,cor:"Prata",tipo:"Picape",cat:"Serviço",sec:"Obras",km:78900,comb:"Diesel S-10",sit:"Em uso",mot:"João Silva",rev:"15/07/2025",seg:"30/06/2025",pat:"PMU-0456",niv:50,obs:"Trocar óleo em 500 km",mul:1,custo:697,kmm:3100},
  {id:"V003",placa:"QUV-3C78",renavam:"00456789012",chassi:"9BWZZZ377VT004253",marca:"Volkswagen",modelo:"Gol 1.0 Gasolina",ano:2021,cor:"Azul",tipo:"Passeio",cat:"Administrativo",sec:"Administração",km:23100,comb:"Gasolina",sit:"Manutenção",mot:null,rev:"10/09/2025",seg:"15/01/2026",pat:"PMU-0789",niv:30,obs:"Reparo suspensão dianteira — OS-0094",mul:0,custo:1027,kmm:400},
  {id:"V004",placa:"QWX-4D90",renavam:"00321654987",chassi:"9BWZZZ377VT004254",marca:"Fiat",modelo:"Ducato Ambulância",ano:2018,cor:"Branco",tipo:"Ambulância",cat:"Emergência",sec:"Saúde",km:112400,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"20/07/2025",seg:"30/11/2025",pat:"PMU-0321",niv:90,obs:"Revisão 110.000 km concluída",mul:0,custo:567,kmm:2800},
  {id:"V005",placa:"QYZ-5E12",renavam:"00654321098",chassi:"9BWZZZ377VT004255",marca:"Mercedes-Benz",modelo:"Sprinter Escolar 415",ano:2022,cor:"Amarelo",tipo:"Ônibus Escolar",cat:"Transp. Escolar",sec:"Educação",km:31200,comb:"Diesel S-10",sit:"Em uso",mot:"Maria Santos",rev:"05/10/2025",seg:"20/03/2026",pat:"PMU-0654",niv:60,obs:"Rota Escolar 02 — 35 alunos",mul:0,custo:500,kmm:2100},
  {id:"V006",placa:"QAB-6F34",renavam:"00789012345",chassi:"9BWZZZ377VT004256",marca:"John Deere",modelo:"Trator 5075E",ano:2017,cor:"Verde",tipo:"Trator",cat:"Máq. Pesada",sec:"Obras",km:0,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"30/08/2025",seg:"01/12/2025",pat:"PMU-0987",niv:40,obs:"Horímetro: 2.340 h",mul:0,custo:0,kmm:0},
  {id:"V007",placa:"QCD-7G56",renavam:"00891234567",chassi:"9BWZZZ377VT004257",marca:"Volkswagen",modelo:"Kombi 1.4",ano:2014,cor:"Branco",tipo:"Utilitário",cat:"Transporte",sec:"Assist. Social",km:89500,comb:"Gasolina",sit:"Baixado",mot:null,rev:"—",seg:"—",pat:"PMU-1234",niv:0,obs:"Aguardando leilão — Processo 2025/LAR-04",mul:3,custo:0,kmm:0},
  {id:"V008",placa:"RCA-8H78",renavam:"00912345678",chassi:"9BWZZZ377VT004258",marca:"Toyota",modelo:"Hilux CD 2.8",ano:2021,cor:"Preto",tipo:"Picape",cat:"Serviço",sec:"Obras",km:34700,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"20/11/2025",seg:"28/02/2026",pat:"PMU-1400",niv:85,obs:"Supervisão de obras",mul:0,custo:320,kmm:890},
  {id:"V009",placa:"RDA-9I90",renavam:"00934567890",chassi:"9BWZZZ377VT004259",marca:"Renault",modelo:"Master 2.3 UTI",ano:2023,cor:"Branco",tipo:"Ambulância UTI",cat:"Emergência",sec:"Saúde",km:8600,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"15/05/2026",seg:"10/06/2026",pat:"PMU-1450",niv:95,obs:"UTI Móvel — equipamento completo",mul:0,custo:280,kmm:760},
  {id:"V010",placa:"REB-0J12",renavam:"00956789012",chassi:"9BWZZZ377VT004260",marca:"Hyundai",modelo:"HR 2.5 Diesel",ano:2020,cor:"Branco",tipo:"Utilitário",cat:"Transporte",sec:"Educação",km:41800,comb:"Diesel S-10",sit:"Em uso",mot:"Roberto Mendes",rev:"12/09/2025",seg:"30/09/2025",pat:"PMU-1510",niv:55,obs:"Transporte materiais escolares",mul:0,custo:410,kmm:1320},
  {id:"V011",placa:"RFC-1K34",renavam:"00978901234",chassi:"9BWZZZ377VT004261",marca:"New Holland",modelo:"Retroescavadeira B95B",ano:2016,cor:"Amarelo",tipo:"Retroescavadeira",cat:"Máq. Pesada",sec:"Obras",km:0,comb:"Diesel S-10",sit:"Manutenção",mot:null,rev:"05/07/2025",seg:"01/11/2025",pat:"PMU-1560",niv:20,obs:"OS-0095 — pneus dianteiros e revisão",mul:0,custo:2100,kmm:0},
  {id:"V012",placa:"RGD-2L56",renavam:"00990123456",chassi:"9BWZZZ377VT004262",marca:"Marcopolo",modelo:"Ônibus 70 lug.",ano:2019,cor:"Amarelo",tipo:"Ônibus Escolar",cat:"Transp. Escolar",sec:"Educação",km:62400,comb:"Diesel S-10",sit:"Disponível",mot:null,rev:"25/08/2025",seg:"31/10/2025",pat:"PMU-1620",niv:70,obs:"Rota Escolar 01 — Zona Rural",mul:0,custo:890,kmm:2650},
];
const D0 = [
  {id:"M001",nome:"João Silva",cpf:"123.456.789-00",rg:"1.234.567",mat:"PMU-001234",nasc:"15/03/1985",tel:"(84) 99123-4567",email:"joao.silva@upanema.rn.gov.br",sec:"Obras",cargo:"Motorista",cnh:"D",valCnh:"27/05/2027",sit:"Ativo",viagens:52,kmR:14800,veiAtual:"QST-2B56"},
  {id:"M002",nome:"Maria Santos",cpf:"987.654.321-00",rg:"7.654.321",mat:"PMU-001235",nasc:"22/07/1990",tel:"(84) 99234-5678",email:"maria.santos@upanema.rn.gov.br",sec:"Educação",cargo:"Motorista Escolar",cnh:"D",valCnh:"10/11/2026",sit:"Ativo",viagens:44,kmR:10200,veiAtual:"QYZ-5E12"},
  {id:"M003",nome:"Carlos Oliveira",cpf:"456.789.123-00",rg:"4.567.891",mat:"PMU-001236",nasc:"30/11/1978",tel:"(84) 99345-6789",email:"carlos.oliveira@upanema.rn.gov.br",sec:"Saúde",cargo:"Motorista",cnh:"E",valCnh:"15/07/2025",sit:"Ativo",viagens:74,kmR:31400,veiAtual:null},
  {id:"M004",nome:"Ana Pereira",cpf:"321.654.987-00",rg:"3.216.549",mat:"PMU-001237",nasc:"08/04/1992",tel:"(84) 99456-7890",email:"ana.pereira@upanema.rn.gov.br",sec:"Administração",cargo:"Motorista",cnh:"B",valCnh:"28/02/2028",sit:"Férias",viagens:25,kmR:4900,veiAtual:null},
  {id:"M005",nome:"Pedro Almeida",cpf:"654.321.098-00",rg:"6.543.210",mat:"PMU-001238",nasc:"14/09/1982",tel:"(84) 99567-8901",email:"pedro.almeida@upanema.rn.gov.br",sec:"Obras",cargo:"Operador de Máq.",cnh:"D",valCnh:"05/08/2026",sit:"Ativo",viagens:38,kmR:7600,veiAtual:null},
  {id:"M006",nome:"Fernanda Costa",cpf:"789.012.345-00",rg:"7.890.123",mat:"PMU-001239",nasc:"17/12/1988",tel:"(84) 99678-9012",email:"fernanda.costa@upanema.rn.gov.br",sec:"Saúde",cargo:"Mot. Ambulância",cnh:"E",valCnh:"30/09/2025",sit:"Ativo",viagens:97,kmR:48600,veiAtual:null},
  {id:"M007",nome:"Roberto Mendes",cpf:"543.210.876-00",rg:"5.432.108",mat:"PMU-001240",nasc:"03/06/1980",tel:"(84) 99789-0123",email:"roberto.mendes@upanema.rn.gov.br",sec:"Educação",cargo:"Motorista",cnh:"D",valCnh:"19/04/2027",sit:"Ativo",viagens:29,kmR:8100,veiAtual:"REB-0J12"},
  {id:"M008",nome:"Juliana Lima",cpf:"876.543.210-00",rg:"8.765.432",mat:"PMU-001241",nasc:"11/09/1995",tel:"(84) 99890-1234",email:"juliana.lima@upanema.rn.gov.br",sec:"Assist. Social",cargo:"Motorista",cnh:"B",valCnh:"22/06/2028",sit:"Ativo",viagens:18,kmR:3200,veiAtual:null},
];
const T0 = [
  {id:"VGM-2025-0240",placa:"QYZ-5E12",mod:"Mercedes Sprinter",mot:"Maria Santos",dest:"Escola Mun. — Roteiro 02",kmi:31000,kmf:null,saida:"08/06/2025 06:00",ret:null,fin:"Transporte Escolar",sec:"Educação",sit:"Em andamento",pass:35,custo:null},
  {id:"VGM-2025-0239",placa:"REB-0J12",mod:"Hyundai HR",mot:"Roberto Mendes",dest:"E. E. Upanema — Materiais",kmi:41600,kmf:41800,saida:"08/06/2025 08:00",ret:"08/06/2025 11:30",fin:"Entrega Materiais",sec:"Educação",sit:"Concluída",pass:2,custo:120},
  {id:"VGM-2025-0238",placa:"QRZ-1A34",mod:"Ford Transit",mot:"Carlos Oliveira",dest:"Hospital Regional — Mossoró",kmi:45000,kmf:45320,saida:"08/06/2025 07:30",ret:"08/06/2025 17:45",fin:"Transp. de Pacientes",sec:"Saúde",sit:"Concluída",pass:3,custo:286},
  {id:"VGM-2025-0237",placa:"QST-2B56",mod:"Chevrolet S10",mot:"João Silva",dest:"Rua das Flores — Pavimentação",kmi:78700,kmf:78900,saida:"07/06/2025 07:00",ret:"07/06/2025 18:00",fin:"Serviço de Obras",sec:"Obras",sit:"Concluída",pass:3,custo:377},
  {id:"VGM-2025-0236",placa:"QWX-4D90",mod:"Fiat Ducato",mot:"Fernanda Costa",dest:"Hospital Univ. — Natal/RN",kmi:111900,kmf:112400,saida:"06/06/2025 04:30",ret:"06/06/2025 22:15",fin:"Emergência Médica",sec:"Saúde",sit:"Concluída",pass:1,custo:567},
  {id:"VGM-2025-0235",placa:"RCA-8H78",mod:"Toyota Hilux",mot:"João Silva",dest:"Canteiro — Av. Presidente Vargas",kmi:34300,kmf:34700,saida:"05/06/2025 07:30",ret:"05/06/2025 17:00",fin:"Supervisão de Obras",sec:"Obras",sit:"Concluída",pass:2,custo:195},
];
const F0 = [
  {id:"ABS-0047",placa:"QRZ-1A34",mod:"Ford Transit",mot:"Carlos Oliveira",data:"08/06/2025 17:00",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:45.5,vl:6.29,total:286,km:45320,media:9.8},
  {id:"ABS-0046",placa:"QYZ-5E12",mod:"Mercedes Sprinter",mot:"Maria Santos",data:"07/06/2025 18:30",posto:"Posto Municipal",tipo:"Diesel S-10",litros:80,vl:6.25,total:500,km:31000,media:8.5},
  {id:"ABS-0045",placa:"QST-2B56",mod:"Chevrolet S10",mot:"João Silva",data:"07/06/2025 18:00",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:60,vl:6.29,total:377,km:78700,media:10.2},
  {id:"ABS-0044",placa:"RCA-8H78",mod:"Toyota Hilux",mot:"João Silva",data:"06/06/2025 17:30",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:48,vl:6.29,total:302,km:34700,media:11.8},
  {id:"ABS-0043",placa:"QWX-4D90",mod:"Fiat Ducato",mot:"Fernanda Costa",data:"06/06/2025 23:00",posto:"Posto BR — Natal",tipo:"Diesel S-10",litros:90,vl:6.30,total:567,km:112400,media:7.8},
  {id:"ABS-0042",placa:"RGD-2L56",mod:"Ônibus Marcopolo",mot:"Maria Santos",data:"05/06/2025 18:00",posto:"Posto Municipal",tipo:"Diesel S-10",litros:120,vl:6.25,total:750,km:62400,media:7.2},
];
const MNT0 = [
  {id:"OS-0095",placa:"RFC-1K34",mod:"New Holland Retro",tipo:"Corretiva",desc:"Substituição pneus dianteiros e revisão freios",oficina:"Tecmasc Equipamentos — Mossoró",custo:2100,criado:"08/06/2025",prev:"12/06/2025",status:"Agendada",prior:"Alta"},
  {id:"OS-0094",placa:"QUV-3C78",mod:"VW Gol",tipo:"Corretiva",desc:"Reparo suspensão dianteira — amortecedores e buchas",oficina:"Oficina São Pedro",custo:850,criado:"07/06/2025",prev:"10/06/2025",status:"Em execução",prior:"Alta"},
  {id:"OS-0093",placa:"QRZ-1A34",mod:"Ford Transit",tipo:"Preventiva",desc:"Troca de pneus traseiros — 2 un. 215/75R16",oficina:"Pneus Silva Upanema",custo:780,criado:"08/06/2025",prev:"10/06/2025",status:"Agendada",prior:"Média"},
  {id:"OS-0092",placa:"RGD-2L56",mod:"Ônibus Marcopolo",tipo:"Preventiva",desc:"Revisão 60.000 km — óleo, filtros, freios",oficina:"Auto Center RN",custo:1450,criado:"05/06/2025",prev:"07/06/2025",status:"Finalizada",prior:"Alta"},
  {id:"OS-0091",placa:"QST-2B56",mod:"Chevrolet S10",tipo:"Preventiva",desc:"Troca de óleo e filtros — 10.000 km",oficina:"Auto Center RN",custo:380,criado:"01/06/2025",prev:"01/06/2025",status:"Finalizada",prior:"Média"},
];
const MU0 = [
  {id:"MLT-001",placa:"QST-2B56",mot:"João Silva",data:"15/05/2025",inf:"Excesso de velocidade — 56km/h em via de 40km/h",valor:195.23,status:"Pendente"},
  {id:"MLT-002",placa:"QCD-7G56",mot:"—",data:"10/03/2025",inf:"Estacionamento em local proibido",valor:88.38,status:"Pago"},
  {id:"MLT-003",placa:"QCD-7G56",mot:"—",data:"22/02/2025",inf:"Avanço de sinal vermelho",valor:293.47,status:"Em recurso"},
  {id:"MLT-004",placa:"RCA-8H78",mot:"João Silva",data:"28/05/2025",inf:"Velocidade não compatível com via urbana",valor:130.16,status:"Pendente"},
];
const AL0 = [
  {id:1,nivel:"danger",tipo:"Seguro",titulo:"Seguro vence em 22 dias",desc:"QST-2B56 (Chevrolet S10) — Seguro vence em 30/06/2025. Renovar urgentemente.",pg:"vehicles"},
  {id:2,nivel:"warning",tipo:"CNH",titulo:"CNH próxima do vencimento",desc:"Carlos Oliveira — CNH Cat. E vence em 15/07/2025 (37 dias).",pg:"drivers"},
  {id:3,nivel:"warning",tipo:"CNH",titulo:"CNH próxima do vencimento",desc:"Fernanda Costa — CNH Cat. E vence em 30/09/2025 (114 dias).",pg:"drivers"},
  {id:4,nivel:"warning",tipo:"KM",titulo:"Troca de óleo necessária",desc:"QST-2B56 — Prevista para 79.400 km (~500 km restantes).",pg:"vehicles"},
  {id:5,nivel:"info",tipo:"Revisão",titulo:"Revisão agendada",desc:"QWX-4D90 — Revisão dos 115.000 km em 20/07/2025.",pg:"maintenance"},
  {id:6,nivel:"info",tipo:"Documento",titulo:"CRLV vence em dezembro",desc:"QCD-7G56 — CRLV vence 31/12/2025. Veículo em leilão.",pg:"vehicles"},
];
const LOG0 = [
  {id:1,user:"Administrador",acao:"Login no sistema",det:"IP: 192.168.1.10",data:"08/06/2025 07:14",tipo:"info"},
  {id:2,user:"Administrador",acao:"Criou viagem VGM-2025-0240",det:"QYZ-5E12 — Maria Santos → Escola Municipal",data:"08/06/2025 05:50",tipo:"create"},
  {id:3,user:"Gestor da Garagem",acao:"Atualizou veículo QUV-3C78",det:"Situação: Disponível → Manutenção",data:"07/06/2025 16:30",tipo:"edit"},
  {id:4,user:"Gestor da Garagem",acao:"Criou OS-0094",det:"QUV-3C78 — Suspensão dianteira",data:"07/06/2025 16:32",tipo:"create"},
  {id:5,user:"Administrador",acao:"Registrou ABS-0047",det:"QRZ-1A34 — 45,5L — R$ 286,20",data:"08/06/2025 17:05",tipo:"create"},
  {id:6,user:"Supervisor de Obras",acao:"Atualizou motorista M004",det:"Status: Ativo → Férias",data:"06/06/2025 08:00",tipo:"edit"},
];
const CH_G=[{mes:"Jan",c:2840,m:1180},{mes:"Fev",c:3120,m:460},{mes:"Mar",c:2980,m:2100},{mes:"Abr",c:3440,m:820},{mes:"Mai",c:4190,m:2350},{mes:"Jun",c:3165,m:3850}];
const CH_S=[{name:"Saúde",v:9840,cor:"#1d4ed8"},{name:"Obras",v:6720,cor:"#0c1a47"},{name:"Educação",v:4210,cor:"#3b82f6"},{name:"Admin",v:1800,cor:"#60a5fa"},{name:"Social",v:890,cor:"#93c5fd"}];
const CH_V=[{s:"S1/Mai",v:14},{s:"S2/Mai",v:19},{s:"S3/Mai",v:16},{s:"S4/Mai",v:24},{s:"S1/Jun",v:12},{s:"S2/Jun",v:8}];
const CH_K=[{p:"QUV-3C78",v:12.1},{p:"RCA-8H78",v:11.8},{p:"QST-2B56",v:10.2},{p:"QRZ-1A34",v:9.8},{p:"QYZ-5E12",v:8.5},{p:"QWX-4D90",v:7.8}];
const NAV_ITEMS=[
  {sec:null,items:[{id:"dashboard",lb:"Painel Geral",ic:LayoutDashboard}]},
  {sec:"OPERAÇÕES",items:[{id:"vehicles",lb:"Veículos",ic:Car},{id:"drivers",lb:"Motoristas",ic:Users},{id:"trips",lb:"Viagens",ic:MapPin,badge:1},{id:"checklist",lb:"Checklist",ic:CheckSquare}]},
  {sec:"RECURSOS",items:[{id:"fuel",lb:"Abastecimento",ic:Fuel},{id:"maintenance",lb:"Manutenção",ic:Wrench,badge:2},{id:"fines",lb:"Multas",ic:AlertOctagon}]},
  {sec:"GESTÃO",items:[{id:"financial",lb:"Financeiro",ic:DollarSign},{id:"reports",lb:"Relatórios",ic:FileText},{id:"suppliers",lb:"Fornecedores",ic:Building2}]},
  {sec:"SISTEMA",items:[{id:"alerts",lb:"Alertas",ic:Bell,badge:6},{id:"audit",lb:"Auditoria",ic:Shield},{id:"settings",lb:"Configurações",ic:Settings}]},
];
const PAGE_LABEL={dashboard:"Painel Geral",vehicles:"Veículos",drivers:"Motoristas",trips:"Viagens",checklist:"Checklist",fuel:"Abastecimento",maintenance:"Manutenção",fines:"Multas",financial:"Financeiro",reports:"Relatórios",suppliers:"Fornecedores",alerts:"Alertas",audit:"Auditoria",settings:"Configurações"};

/* ══════════ TOAST ══════════ */
function useToast(){const[ts,setTs]=useState([]);const add=(m,t="success")=>{const id=Date.now();setTs(p=>[...p,{id,m,t}]);setTimeout(()=>setTs(p=>p.filter(x=>x.id!==id)),4200);};return{ts,add};}
function Toasts({ts}){const pal={success:["#dcfce7","#15803d","#86efac"],danger:["#fee2e2","#dc2626","#fca5a5"],info:["#e0f2fe","#0369a1","#7dd3fc"],warning:["#fef9c3","#a16207","#fde047"]};if(!ts.length)return null;return(<div style={{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:8,maxWidth:"min(360px,calc(100vw - 32px))"}}>{ts.map(t=>{const[bg2,cl,br]=pal[t.t]||pal.success;return(<div key={t.id} className="fu" style={{background:bg2,border:`1px solid ${br}`,color:cl,padding:"12px 16px",fontSize:13,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,.15)"}}>{t.m}</div>);})}</div>);}

/* ══════════ CONFIRM ══════════ */
function Confirm({msg,ok,cancel,danger}){return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&cancel()}><div className="fu" style={{background:card(),width:"100%",maxWidth:380,padding:24,boxShadow:"0 20px 60px rgba(0,0,0,.35)"}}><div style={{display:"flex",gap:12,marginBottom:18}}><AlertTriangle size={20} color={danger?"#dc2626":"#d97706"} style={{flexShrink:0,marginTop:2}}/><p style={{fontSize:14,color:tx(),margin:0,lineHeight:1.65}}>{msg}</p></div><div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={cancel} style={{background:"none",border:bdr(),padding:"7px 16px",fontSize:13,cursor:"pointer",color:sub(),fontFamily:"inherit"}}>Cancelar</button><button onClick={ok} style={{background:danger?"#dc2626":P,color:"white",border:"none",padding:"7px 16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{danger?"Excluir":"Confirmar"}</button></div></div></div>);}

/* ══════════ UI PRIMITIVES ══════════ */
function Bdg({lb,tp="def"}){const m={ok:{bg:"#dcfce7",c:"#15803d",b:"#86efac"},bad:{bg:"#fee2e2",c:"#dc2626",b:"#fca5a5"},warn:{bg:"#fef9c3",c:"#a16207",b:"#fde047"},info:{bg:"#e0f2fe",c:"#0369a1",b:"#7dd3fc"},gray:{bg:"#f1f5f9",c:"#475569",b:"#cbd5e1"},def:{bg:"#f1f5f9",c:"#475569",b:"#cbd5e1"}};const s=m[tp]||m.def;return<span style={{background:s.bg,color:s.c,border:`1px solid ${s.b}`,padding:"2px 7px",fontSize:10,fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",display:"inline-block",whiteSpace:"nowrap"}}>{lb}</span>;}
function SBdg({v}){const mp={"Disponível":"ok","Em uso":"info","Manutenção":"warn","Baixado":"gray","Ativo":"ok","Férias":"warn","Afastado":"bad","Em andamento":"info","Concluída":"ok","Cancelada":"bad","Agendada":"info","Em execução":"warn","Finalizada":"ok","Pendente":"warn","Pago":"ok","Em recurso":"info","Sinistrado":"bad","Leiloado":"gray"};return<Bdg lb={v} tp={mp[v]||"def"}/>;}

function Kpi({lb,vl,sub:s,Ic,cor,top,delta}){const cl=cor||P;return(<div style={{background:card(),border:bdr(),padding:"15px 18px",borderTop:`3px solid ${top||cl}`,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}><div style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",letterSpacing:".08em",lineHeight:1.3}}>{lb}</div><div style={{width:33,height:33,background:`${cl}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic size={15} color={cl}/></div></div><div style={{fontSize:26,fontWeight:800,color:tx(),lineHeight:1}}>{vl}</div>{s&&<div style={{fontSize:11,color:mu(),marginTop:3}}>{s}</div>}{delta!=null&&<div style={{display:"flex",alignItems:"center",gap:3,fontSize:11,fontWeight:600,color:delta>=0?"#15803d":"#dc2626",marginTop:3}}>{delta>=0?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{Math.abs(delta)}% vs mês</div>}</div>);}

function GKpi({children,W}){const n=W<400?1:W<640?2:W<1100?3:4;return<div style={{display:"grid",gridTemplateColumns:`repeat(${n},1fr)`,gap:12,marginBottom:12}}>{children}</div>;}
function G2({children,W,ratio="1fr 1fr"}){const cols=W<900?"1fr":ratio;return<div style={{display:"grid",gridTemplateColumns:cols,gap:12,marginBottom:12}}>{children}</div>;}
function GF({children,W,n=3}){const c=W<640?Math.min(2,n):n;return<div style={{display:"grid",gridTemplateColumns:`repeat(${c},1fr)`,gap:12,marginBottom:12}}>{children}</div>;}

const Th=({ch,st={}})=><th style={{padding:"9px 12px",textAlign:"left",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:".08em",color:mu(),background:th(),borderBottom:`2px solid var(--bd)`,whiteSpace:"nowrap",...st}}>{ch}</th>;
const Td=({ch,st={}})=><td style={{padding:"10px 12px",color:sub(),borderBottom:`1px solid var(--bd)`,verticalAlign:"middle",fontSize:13,...st}}>{ch}</td>;
function Prog({v}){return<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:50,height:5,background:"var(--bd)"}}><div style={{width:`${v}%`,height:"100%",background:v<25?"#dc2626":v<50?"#f59e0b":P}}/></div><span style={{fontSize:11,color:mu()}}>{v}%</span></div>;}
function Modal({title,close,children,w=700}){return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.52)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&close()}><div className="fu" style={{background:card(),width:"100%",maxWidth:w,maxHeight:"92vh",overflow:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.35)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 18px",borderBottom:bdr(),background:th(),position:"sticky",top:0}}><span style={{fontWeight:700,fontSize:14,color:tx()}}>{title}</span><button onClick={close} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:mu()}}><X size={17}/></button></div><div style={{padding:18}}>{children}</div></div></div>);}
function FF({lb,val,set,type="text",opts,req}){const base={width:"100%",border:bdr("var(--ibd)"),padding:"9px 10px",fontSize:13,fontFamily:"inherit"};return(<div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",letterSpacing:".07em"}}>{lb}{req&&<span style={{color:"#dc2626"}}> *</span>}</label>{opts?<select value={val} onChange={e=>set(e.target.value)} style={base}><option value="">Selecionar...</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>:<input type={type} value={val} onChange={e=>set(e.target.value)} style={base}/>}</div>);}
const BP=({ch,click,Ic,sm,bad,full,dis})=><button onClick={click} disabled={dis} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,background:dis?"#94a3b8":bad?"#dc2626":P,color:"white",border:"none",padding:sm?"6px 11px":"9px 15px",fontSize:sm?11:13,fontWeight:600,cursor:dis?"not-allowed":"pointer",fontFamily:"inherit",width:full?"100%":undefined,flexShrink:0}}>{Ic&&<Ic size={sm?11:14}/>}{ch}</button>;
const BO=({ch,click,Ic,sm})=><button onClick={click} style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",color:sub(),border:bdr(),padding:sm?"6px 11px":"8px 13px",fontSize:sm?11:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>{Ic&&<Ic size={sm?11:14}/>}{ch}</button>;
function SH({title,sub:s,action}){return<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:18,gap:12,flexWrap:"wrap"}}><div><h2 style={{fontSize:18,fontWeight:800,color:tx(),margin:0}}>{title}</h2>{s&&<p style={{fontSize:12,color:mu(),margin:"3px 0 0"}}>{s}</p>}</div>{action&&<div style={{flexShrink:0}}>{action}</div>}</div>;}
const DR=({l,v})=><div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid var(--bd)`,fontSize:13,gap:8}}><span style={{color:mu(),fontSize:12,flexShrink:0}}>{l}</span><span style={{fontWeight:600,color:tx(),textAlign:"right"}}>{v}</span></div>;

/* ══════════ VEHICLE MODAL ══════════ */
function VehicleModal({v,save,close,toast,W}){
  const blank={placa:"",marca:"Ford",modelo:"",ano:2024,cor:"Branco",tipo:"Passeio",cat:"Administrativo",sec:"Administração",comb:"Gasolina",sit:"Disponível",renavam:"",chassi:"",pat:"",km:"0",niv:"50",rev:"",seg:"",obs:"",mot:null,mul:0,custo:0,kmm:0};
  const[f,setF]=useState(v||blank);const u=k=>val=>setF(p=>({...p,[k]:val}));
  const go=()=>{if(!f.placa||!f.modelo){toast("Preencha Placa e Modelo.","danger");return;}save({...f,id:v?.id||`V${Date.now().toString().slice(-4)}`,km:+f.km||0,niv:+f.niv||50});toast(v?"Veículo atualizado!":"Veículo cadastrado!");close();};
  const secs=["Saúde","Obras","Educação","Administração","Assist. Social","Financeiro","Infraestrutura"];
  return(<Modal title={v?`Editar — ${v.placa}`:"Cadastrar Novo Veículo"} close={close} w={W<640?undefined:760}>
    <p style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",margin:"0 0 10px",paddingBottom:8,borderBottom:bdr()}}>Identificação</p>
    <GF W={W} n={3}><FF lb="Placa" val={f.placa} set={u("placa")} req/><FF lb="RENAVAM" val={f.renavam} set={u("renavam")}/><FF lb="Patrimônio" val={f.pat} set={u("pat")}/></GF>
    <p style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",margin:"14px 0 10px",paddingBottom:8,borderBottom:bdr()}}>Características</p>
    <GF W={W} n={3}><FF lb="Marca" val={f.marca} set={u("marca")} opts={["Ford","Chevrolet","Volkswagen","Fiat","Mercedes-Benz","Toyota","Renault","Hyundai","John Deere","New Holland","Marcopolo","Outro"]}/><FF lb="Modelo" val={f.modelo} set={u("modelo")} req/><FF lb="Cor" val={f.cor} set={u("cor")}/><FF lb="Tipo" val={f.tipo} set={u("tipo")} opts={["Passeio","Van","Picape","SUV","Ambulância","Ambulância UTI","Ônibus Escolar","Ônibus","Trator","Retroescavadeira","Caminhão","Utilitário","Moto"]}/><FF lb="Categoria" val={f.cat} set={u("cat")} opts={["Administrativo","Serviço","Transporte","Emergência","Transp. Escolar","Máq. Pesada"]}/><FF lb="Combustível" val={f.comb} set={u("comb")} opts={["Gasolina","Diesel S-10","Diesel Comum","Etanol","Flex","GNV","Elétrico"]}/></GF>
    <p style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",margin:"14px 0 10px",paddingBottom:8,borderBottom:bdr()}}>Controle Operacional</p>
    <GF W={W} n={3}><FF lb="Situação" val={f.sit} set={u("sit")} opts={["Disponível","Em uso","Manutenção","Baixado","Leiloado","Sinistrado"]}/><FF lb="Secretaria" val={f.sec} set={u("sec")} opts={secs}/><FF lb="KM Atual" val={f.km} set={u("km")} type="number"/><FF lb="Nível Comb. (%)" val={f.niv} set={u("niv")} type="number"/><FF lb="Próxima Revisão" val={f.rev} set={u("rev")}/><FF lb="Validade Seguro" val={f.seg} set={u("seg")}/></GF>
    <div style={{marginBottom:16}}><FF lb="Observações / Pendências" val={f.obs} set={u("obs")}/></div>
    <div style={{display:"flex",gap:10,paddingTop:14,borderTop:bdr()}}><BP ch={v?"Salvar Alterações":"Cadastrar Veículo"} click={go} Ic={Save}/><BO ch="Cancelar" click={close}/></div>
  </Modal>);
}

/* ══════════ DRIVER MODAL ══════════ */
function DriverModal({d,save,close,toast,W}){
  const blank={nome:"",cpf:"",rg:"",mat:"",nasc:"",tel:"",email:"",sec:"Administração",cargo:"Motorista",cnh:"B",valCnh:"",sit:"Ativo",viagens:0,kmR:0,veiAtual:null};
  const[f,setF]=useState(d||blank);const u=k=>val=>setF(p=>({...p,[k]:val}));
  const go=()=>{if(!f.nome||!f.cpf){toast("Preencha Nome e CPF.","danger");return;}save({...f,id:d?.id||`M${Date.now().toString().slice(-4)}`});toast(d?"Motorista atualizado!":"Motorista cadastrado!");close();};
  return(<Modal title={d?`Editar — ${d.nome}`:"Cadastrar Motorista"} close={close} w={W<640?undefined:700}>
    <p style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",margin:"0 0 10px",paddingBottom:8,borderBottom:bdr()}}>Dados Pessoais</p>
    <GF W={W} n={3}><FF lb="Nome Completo" val={f.nome} set={u("nome")} req/><FF lb="CPF" val={f.cpf} set={u("cpf")} req/><FF lb="Data de Nascimento" val={f.nasc} set={u("nasc")}/><FF lb="Matrícula Funcional" val={f.mat} set={u("mat")}/><FF lb="Telefone" val={f.tel} set={u("tel")}/><FF lb="E-mail Institucional" val={f.email} set={u("email")}/></GF>
    <p style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",margin:"14px 0 10px",paddingBottom:8,borderBottom:bdr()}}>Dados Profissionais</p>
    <GF W={W} n={3}><FF lb="Secretaria" val={f.sec} set={u("sec")} opts={["Saúde","Obras","Educação","Administração","Assist. Social","Financeiro"]}/><FF lb="Cargo" val={f.cargo} set={u("cargo")} opts={["Motorista","Mot. de Ambulância","Mot. Escolar","Operador de Máq.","Operador de Patrol","Auxiliar"]}/><FF lb="Situação" val={f.sit} set={u("sit")} opts={["Ativo","Férias","Afastado","Licença Médica"]}/><FF lb="Categoria CNH" val={f.cnh} set={u("cnh")} opts={["A","B","C","D","E","AB","AC","AD","AE"]}/><FF lb="Validade da CNH" val={f.valCnh} set={u("valCnh")}/><FF lb="RG" val={f.rg} set={u("rg")}/></GF>
    <div style={{display:"flex",gap:10,paddingTop:14,borderTop:bdr()}}><BP ch={d?"Salvar":"Cadastrar"} click={go} Ic={Save}/><BO ch="Cancelar" click={close}/></div>
  </Modal>);
}

/* ══════════ PAGE: LOGIN ══════════ */
function Login({onLogin,W}){
  const[id,setId]=useState("admin@upanema.rn.gov.br");const[pw,setPw]=useState("");
  const[showPw,setShowPw]=useState(false);const[err,setErr]=useState("");const[loading,setLoading]=useState(false);
  const[step,setStep]=useState("in");const[fEmail,setFEmail]=useState("");const[fSent,setFSent]=useState(false);
  const mob=W<700;
  const go=()=>{if(!id||!pw){setErr("Preencha e-mail e senha.");return;}setLoading(true);setErr("");setTimeout(()=>{const u=SYS_USERS.find(x=>x.email===id&&x.pw===pw);if(u){if(!u.ativo){setErr("Conta inativa. Contate o administrador.");setLoading(false);return;}onLogin(u);}else setErr("E-mail ou senha incorretos.");setLoading(false);},900);};
  const inp={width:"100%",border:"1px solid #d1d5db",padding:"10px 12px",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",transition:"border-color .15s"};
  const demos=SYS_USERS.filter(u=>u.ativo).slice(0,3);
  return(<div style={{minHeight:"100vh",background:"linear-gradient(140deg,#0c1a47 0%,#1d4ed8 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{display:"flex",width:"100%",maxWidth:880,background:"white",boxShadow:"0 28px 80px rgba(0,0,0,.4)",flexDirection:mob?"column":"row"}}>
      <div style={{flex:mob?undefined:"1 1 280px",background:"#0c1a47",padding:mob?"32px 28px":"44px 36px",display:"flex",flexDirection:"column",justifyContent:"space-between",minHeight:mob?undefined:420}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:mob?20:32}}>
            <div style={{width:44,height:44,background:"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Truck size={21} color="white"/></div>
            <div><div style={{fontSize:9,fontWeight:700,color:"#60a5fa",letterSpacing:".14em",textTransform:"uppercase"}}>Prefeitura de Upanema — RN</div><div style={{fontSize:15,fontWeight:800,color:"white",lineHeight:1.2}}>SGA · Frota Municipal</div></div>
          </div>
          {!mob&&<><h1 style={{fontSize:24,fontWeight:800,color:"white",lineHeight:1.25,margin:"0 0 14px"}}>Sistema de<br/>Gestão da Garagem</h1><p style={{color:"rgba(203,213,225,.6)",fontSize:13,lineHeight:1.7,margin:0}}>Controle completo da frota pública: veículos, motoristas, abastecimentos, manutenções e custos.</p></>}
        </div>
        {!mob&&<div style={{display:"flex",flexDirection:"column",gap:11,marginTop:28}}>{[["Frota Completa","12 veículos + máquinas pesadas"],["Check-in / Retorno","Saídas e chegadas em tempo real"],["KPIs e Relatórios","Custo/km, consumo e análise"]].map(([t,s])=>(<div key={t} style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:5,height:5,background:"#60a5fa",flexShrink:0}}/><span style={{color:"white",fontSize:13,fontWeight:600}}>{t}</span><span style={{color:"rgba(203,213,225,.45)",fontSize:12}}>— {s}</span></div>))}</div>}
      </div>
      <div style={{flex:"1 1 280px",padding:mob?"28px":"44px 36px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
        {step==="in"?(
          <>
            <div style={{marginBottom:24}}><h2 style={{fontSize:20,fontWeight:800,color:"#0f172a",margin:"0 0 4px"}}>Acesso ao Sistema</h2><p style={{fontSize:13,color:"#64748b",margin:0}}>Use suas credenciais institucionais</p></div>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div><label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>E-mail Institucional</label><input value={id} onChange={e=>setId(e.target.value)} placeholder="nome@upanema.rn.gov.br" style={inp}/></div>
              <div><label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Senha</label><div style={{position:"relative"}}><input type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} style={{...inp,paddingRight:38}} placeholder="••••••••"/><button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#64748b",padding:4}}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></div>
              {err&&<div style={{background:"#fee2e2",border:"1px solid #fca5a5",color:"#dc2626",padding:"9px 12px",fontSize:13,display:"flex",alignItems:"center",gap:8}}><AlertCircle size={14}/>{err}</div>}
              <button onClick={go} disabled={loading} style={{background:loading?"#94a3b8":"#0c1a47",color:"white",border:"none",padding:"12px",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",textTransform:"uppercase",letterSpacing:".08em",fontFamily:"inherit"}}>{loading?"Verificando...":"Entrar no Sistema"}</button>
              <button onClick={()=>setStep("forgot")} style={{background:"none",border:"none",fontSize:12,color:"#1d4ed8",cursor:"pointer",textAlign:"left",fontFamily:"inherit",padding:0}}>Esqueceu a senha?</button>
            </div>
            <div style={{marginTop:20,padding:"12px 14px",background:"#f8fafc",border:"1px solid #e2e8f0"}}><div style={{fontSize:10,fontWeight:700,color:"#0c1a47",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Acessos de Demonstração</div>{demos.map(u=>(<div key={u.email} onClick={()=>{setId(u.email);setPw(u.pw);}} style={{padding:"5px 0",cursor:"pointer",borderBottom:"1px solid #f0f4f8"}}><div style={{fontSize:12,color:"#374151",fontWeight:600}}>{u.perfil}</div><div style={{fontSize:11,color:"#64748b"}}>{u.email} · senha: <strong>{u.pw}</strong></div></div>))}<div style={{fontSize:10,color:"#94a3b8",marginTop:6}}>Clique para preencher automaticamente.</div></div>
          </>
        ):(
          <>
            <button onClick={()=>{setStep("in");setFSent(false);}} style={{background:"none",border:"none",fontSize:12,color:"#1d4ed8",cursor:"pointer",textAlign:"left",fontFamily:"inherit",marginBottom:20,padding:0}}>← Voltar</button>
            <h2 style={{fontSize:20,fontWeight:800,color:"#0f172a",margin:"0 0 8px"}}>Recuperar Senha</h2>
            <p style={{fontSize:13,color:"#64748b",marginBottom:20}}>Informe seu e-mail institucional.</p>
            {!fSent?(<><input value={fEmail} onChange={e=>setFEmail(e.target.value)} placeholder="nome@upanema.rn.gov.br" style={{...inp,marginBottom:12}}/><button onClick={()=>setTimeout(()=>setFSent(true),700)} style={{background:"#0c1a47",color:"white",border:"none",padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>Enviar Instruções</button></>):<div style={{background:"#dcfce7",border:"1px solid #86efac",padding:"16px",color:"#15803d",fontSize:13}}><strong>✓ E-mail enviado!</strong> Verifique sua caixa de entrada.</div>}
          </>
        )}
        <p style={{fontSize:10,color:"#94a3b8",textAlign:"center",marginTop:20}}>© 2025 Prefeitura Municipal de Upanema — RN · SGA v1.0</p>
      </div>
    </div>
  </div>);
}

/* ══════════ DASHBOARD ══════════ */
function Dashboard({nav,vehicles,drivers,alerts,W}){
  const g=CH_G[CH_G.length-1];const gT=g.c+g.m;
  return(<div>
    <GKpi W={W}>
      <Kpi lb="Total da Frota" vl={vehicles.length} sub="Veículos cadastrados" Ic={Car} top="#1d4ed8"/>
      <Kpi lb="Disponíveis" vl={vehicles.filter(v=>v.sit==="Disponível").length} sub="Prontos para uso" Ic={CheckCircle} cor="#16a34a" top="#16a34a"/>
      <Kpi lb="Em Circulação" vl={vehicles.filter(v=>v.sit==="Em uso").length} sub="Viagens ativas" Ic={Activity} cor="#0284c7" top="#0284c7"/>
      <Kpi lb="Em Manutenção" vl={vehicles.filter(v=>v.sit==="Manutenção").length} sub="Ordens abertas" Ic={Wrench} cor="#d97706" top="#d97706"/>
      <Kpi lb="Gastos em Junho" vl={`R$ ${gT.toLocaleString("pt-BR")}`} sub="Comb + Manutenção" Ic={DollarSign} delta={4} top="#1d4ed8"/>
      <Kpi lb="Motoristas Ativos" vl={drivers.filter(d=>d.sit==="Ativo").length} sub={`${drivers.length} cadastrados`} Ic={Users} top="#1d4ed8"/>
      <Kpi lb="Viagens no Mês" vl={56} sub="Junho/2025" Ic={MapPin} top="#1d4ed8"/>
      <Kpi lb="Alertas" vl={alerts.length} sub={`${alerts.filter(a=>a.nivel==="danger").length} crítico(s)`} Ic={Bell} cor="#dc2626" top="#dc2626"/>
    </GKpi>
    <G2 W={W} ratio="1.3fr 1fr">
      <div style={{background:card(),border:bdr(),padding:"16px 16px 10px"}}>
        <div style={{fontSize:14,fontWeight:700,color:tx(),marginBottom:1}}>Gastos Mensais — 2025</div>
        <div style={{fontSize:11,color:mu(),marginBottom:12}}>Combustível + Manutenção (R$)</div>
        <ResponsiveContainer width="100%" height={W<640?160:200}><BarChart data={CH_G} barGap={2}><CartesianGrid strokeDasharray="3 3" stroke="var(--bd)"/><XAxis dataKey="mes" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v=>`${v/1000}k`}/><Tooltip formatter={v=>`R$ ${Number(v).toLocaleString("pt-BR")}`}/><Legend iconSize={10} wrapperStyle={{fontSize:11}}/><Bar dataKey="c" name="Combustível" fill="#1d4ed8"/><Bar dataKey="m" name="Manutenção" fill="#93c5fd"/></BarChart></ResponsiveContainer>
      </div>
      <div style={{background:card(),border:bdr(),padding:16}}>
        <div style={{fontSize:14,fontWeight:700,color:tx(),marginBottom:1}}>Por Secretaria</div>
        <div style={{fontSize:11,color:mu(),marginBottom:10}}>Acumulado 2025</div>
        <ResponsiveContainer width="100%" height={120}><PieChart><Pie data={CH_S} dataKey="v" cx="50%" cy="50%" outerRadius={52} innerRadius={24}>{CH_S.map((e,i)=><Cell key={i} fill={e.cor}/>)}</Pie><Tooltip formatter={v=>`R$ ${Number(v).toLocaleString("pt-BR")}`}/></PieChart></ResponsiveContainer>
        <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:8}}>{CH_S.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:7,fontSize:12}}><div style={{width:8,height:8,background:s.cor,flexShrink:0}}/><span style={{color:sub(),flexGrow:1}}>{s.name}</span><span style={{fontWeight:600,color:tx()}}>R$ {s.v.toLocaleString("pt-BR")}</span></div>))}</div>
      </div>
    </G2>
    <G2 W={W}>
      <div style={{background:card(),border:bdr(),padding:"16px 16px 10px"}}>
        <div style={{fontSize:14,fontWeight:700,color:tx(),marginBottom:1}}>Viagens por Semana</div>
        <div style={{fontSize:11,color:mu(),marginBottom:12}}>Últimas 6 semanas</div>
        <ResponsiveContainer width="100%" height={W<640?120:140}><AreaChart data={CH_V}><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="10%" stopColor="#1d4ed8" stopOpacity={.14}/><stop offset="90%" stopColor="#1d4ed8" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--bd)"/><XAxis dataKey="s" tick={{fontSize:10}}/><YAxis tick={{fontSize:11}}/><Tooltip/><Area type="monotone" dataKey="v" name="Viagens" stroke="#1d4ed8" strokeWidth={2} fill="url(#ag)"/></AreaChart></ResponsiveContainer>
      </div>
      <div style={{background:card(),border:bdr(),padding:"16px 16px 10px"}}>
        <div style={{fontSize:14,fontWeight:700,color:tx(),marginBottom:1}}>Consumo Médio (km/L)</div>
        <div style={{fontSize:11,color:mu(),marginBottom:12}}>Por veículo — 3 meses</div>
        <ResponsiveContainer width="100%" height={W<640?120:140}><BarChart data={CH_K} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="var(--bd)"/><XAxis type="number" tick={{fontSize:10}} domain={[0,14]}/><YAxis type="category" dataKey="p" tick={{fontSize:10}} width={78}/><Tooltip formatter={v=>`${v} km/L`}/><Bar dataKey="v" name="km/L" fill="#0c1a47"/></BarChart></ResponsiveContainer>
      </div>
    </G2>
    <G2 W={W} ratio="1fr 360px">
      <div style={{background:card(),border:bdr()}}>
        <div style={{padding:"12px 16px",borderBottom:bdr(),display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:14,color:tx()}}>Viagens Recentes</span><button onClick={()=>nav("trips")} style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Ver todas →</button></div>
        <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr><Th ch="Código"/><Th ch="Motorista"/><Th ch="Destino"/><Th ch="Status"/></tr></thead>
        <tbody>{T0.slice(0,5).map((t,i)=>(<tr key={i} style={{background:i%2===0?ra():card()}}><Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:mu()}}>{t.id}</span>}/><Td ch={<span style={{fontWeight:500}}>{t.mot}</span>}/><Td ch={<span style={{fontSize:12,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{t.dest}</span>}/><Td ch={<SBdg v={t.sit}/>}/></tr>))}</tbody>
        </table></div>
      </div>
      <div style={{background:card(),border:bdr()}}>
        <div style={{padding:"12px 16px",borderBottom:bdr(),display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:14,color:tx()}}>Alertas</span><button onClick={()=>nav("alerts")} style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Ver todos →</button></div>
        {alerts.slice(0,5).map((a,i)=>(<div key={i} style={{display:"flex",gap:10,padding:"9px 14px",borderBottom:bdr()}}><div style={{flexShrink:0,marginTop:2}}>{a.nivel==="danger"?<AlertCircle size={13} color="#dc2626"/>:a.nivel==="warning"?<AlertCircle size={13} color="#d97706"/>:<Bell size={13} color="#0284c7"/>}</div><div><div style={{fontSize:12,fontWeight:600,color:tx()}}>{a.titulo}</div><div style={{fontSize:11,color:mu(),lineHeight:1.4}}>{a.desc}</div></div></div>))}
      </div>
    </G2>
  </div>);
}

/* ══════════ PAGE: VEHICLES ══════════ */
function Vehicles({vehicles,setVehicles,toast,W}){
  const[tab,setTab]=useState("Todos");const[srch,setSrch]=useState("");const[sel,setSel]=useState(null);const[modal,setModal]=useState(null);const[cfm,setCfm]=useState(null);
  const tabs=["Todos","Disponível","Em uso","Manutenção","Baixado"];
  const filt=vehicles.filter(v=>(tab==="Todos"||v.sit===tab)&&(!srch||[v.placa,v.modelo,v.mot||""].some(x=>x.toLowerCase().includes(srch.toLowerCase()))));
  const saveV=v=>{if(modal?.id)setVehicles(p=>p.map(x=>x.id===v.id?v:x));else setVehicles(p=>[v,...p]);};
  const delV=v=>setCfm({msg:`Excluir ${v.placa} — ${v.modelo}?`,ok:()=>{setVehicles(p=>p.filter(x=>x.id!==v.id));toast("Veículo excluído.","danger");setCfm(null);}});
  return(<div>
    <SH title="Gestão de Veículos" sub={`${vehicles.length} veículos — ${vehicles.filter(v=>v.sit==="Disponível").length} disponíveis`} action={<BP ch="+ Cadastrar" click={()=>setModal("add")} Ic={Plus}/>}/>
    <GKpi W={W}><Kpi lb="Total" vl={vehicles.length} Ic={Car} top="#1d4ed8"/><Kpi lb="Disponíveis" vl={vehicles.filter(v=>v.sit==="Disponível").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/><Kpi lb="Em Uso" vl={vehicles.filter(v=>v.sit==="Em uso").length} Ic={Activity} cor="#0284c7" top="#0284c7"/><Kpi lb="Manutenção" vl={vehicles.filter(v=>v.sit==="Manutenção").length} Ic={Wrench} cor="#d97706" top="#d97706"/><Kpi lb="Baixados" vl={vehicles.filter(v=>v.sit==="Baixado").length} Ic={AlertOctagon} cor="#64748b" top="#94a3b8"/></GKpi>
    <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}><div style={{flex:"1 1 160px",position:"relative",minWidth:140}}><Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:mu()}}/><input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Pesquisar placa, modelo..." style={{width:"100%",border:bdr("var(--ibd)"),padding:"9px 12px 9px 30px",fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/></div><BO ch="Exportar" click={()=>{toast("Gerando relatório...","info");setTimeout(()=>toast("Exportado!"),2000);}} Ic={Download}/></div>
    <div style={{display:"flex",borderBottom:`2px solid var(--bd)`,marginBottom:12,overflowX:"auto"}}>{tabs.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"8px 14px",fontSize:12,fontWeight:600,background:"none",border:"none",borderBottom:tab===t?`2px solid ${P}`:"2px solid transparent",color:tab===t?P:mu(),cursor:"pointer",marginBottom:-2,fontFamily:"inherit",whiteSpace:"nowrap"}}>{t} ({t==="Todos"?vehicles.length:vehicles.filter(v=>v.sit===t).length})</button>)}</div>
    <div className="tbl" style={{background:card(),border:bdr()}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Placa"/><Th ch="Veículo"/><Th ch="Secretaria"/><Th ch="KM"/><Th ch="Comb."/><Th ch="Revisão"/><Th ch="Status"/><Th ch=""/></tr></thead>
        <tbody>{filt.map((v,i)=>(<tr key={v.id} className="hr" style={{background:i%2===0?ra():card()}}>
          <Td ch={<span style={{fontWeight:700,color:NAV_BG,letterSpacing:".04em"}}>{v.placa}</span>}/>
          <Td ch={<div><div style={{fontWeight:600}}>{v.modelo}</div><div style={{fontSize:11,color:mu()}}>{v.marca} · {v.ano}</div></div>}/>
          <Td ch={<div><div style={{fontSize:12}}>{v.sec}</div><div style={{fontSize:10,color:mu()}}>{v.pat}</div></div>}/>
          <Td ch={<span style={{fontWeight:500,whiteSpace:"nowrap"}}>{v.km>0?v.km.toLocaleString("pt-BR")+" km":"Hor."}</span>}/>
          <Td ch={<Prog v={v.niv}/>}/>
          <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{v.rev}</span>}/>
          <Td ch={<SBdg v={v.sit}/>}/>
          <Td ch={<div style={{display:"flex",gap:4}}>
            <button onClick={()=>setSel(v)} style={{background:"none",border:bdr(),padding:"3px 7px",cursor:"pointer",fontSize:11,color:"#0284c7",fontFamily:"inherit",fontWeight:600}}>Ver</button>
            <button onClick={()=>setModal(v)} style={{background:"none",border:bdr(),padding:"3px 7px",cursor:"pointer",fontSize:11,color:P,fontFamily:"inherit"}}><Edit size={11}/></button>
            <button onClick={()=>delV(v)} style={{background:"none",border:"none",padding:"3px",cursor:"pointer",color:"#dc2626"}}><Trash2 size={13}/></button>
          </div>}/>
        </tr>))}{filt.length===0&&<tr><td colSpan={8} style={{padding:"40px",textAlign:"center",color:mu(),fontSize:13}}>Nenhum veículo encontrado.</td></tr>}</tbody>
      </table>
    </div>
    {sel&&<Modal title={`${sel.placa} — ${sel.modelo}`} close={()=>setSel(null)} w={W<640?undefined:760}>
      <G2 W={W}><div><p style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:bdr()}}>Dados Técnicos</p>{[["Placa",sel.placa],["RENAVAM",sel.renavam],["Chassi",sel.chassi],["Modelo",`${sel.marca} ${sel.modelo}`],["Ano / Cor",`${sel.ano} · ${sel.cor}`],["Tipo / Cat.",`${sel.tipo} — ${sel.cat}`],["Combustível",sel.comb]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div>
      <div><p style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:bdr()}}>Situação Atual</p>{[["Secretaria",sel.sec],["Patrimônio",sel.pat],["Motorista",sel.mot||"—"],["KM Atual",sel.km>0?sel.km.toLocaleString("pt-BR")+" km":"Horímetro"],["Nível Comb.",sel.niv+"%"],["Próx. Revisão",sel.rev],["Val. Seguro",sel.seg],["Multas",sel.mul+" multa(s)"],["Custo/Mês","R$ "+sel.custo]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div></G2>
      {sel.obs&&<div style={{background:ra(),border:bdr(),padding:"10px 14px",marginTop:14}}><p style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",margin:"0 0 4px"}}>Observações</p><p style={{fontSize:13,color:sub(),margin:0}}>{sel.obs}</p></div>}
      <div style={{display:"flex",gap:10,marginTop:14,paddingTop:12,borderTop:bdr()}}><BP ch="Editar" click={()=>{setModal(sel);setSel(null);}} Ic={Edit}/><BO ch="Fechar" click={()=>setSel(null)}/></div>
    </Modal>}
    {(modal==="add"||modal?.id)&&<VehicleModal v={modal==="add"?null:modal} save={saveV} close={()=>setModal(null)} toast={toast} W={W}/>}
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>);
}

/* ══════════ PAGE: DRIVERS ══════════ */
function Drivers({drivers,setDrivers,toast,W}){
  const[srch,setSrch]=useState("");const[sel,setSel]=useState(null);const[modal,setModal]=useState(null);const[cfm,setCfm]=useState(null);
  const today=new Date("2025-06-08");
  const dias=d=>{try{const[dd,mm,aa]=d.valCnh.split("/");return Math.round((new Date(`${aa}-${mm}-${dd}`)-today)/86400000);}catch{return 999;}};
  const filt=drivers.filter(d=>!srch||[d.nome,d.mat,d.cpf].some(x=>x.toLowerCase().includes(srch.toLowerCase())));
  const saveD=d=>{if(modal?.id)setDrivers(p=>p.map(x=>x.id===d.id?d:x));else setDrivers(p=>[d,...p]);};
  const delD=d=>setCfm({msg:`Excluir ${d.nome}?`,ok:()=>{setDrivers(p=>p.filter(x=>x.id!==d.id));toast("Motorista excluído.","danger");setCfm(null);}});
  return(<div>
    <SH title="Motoristas e Operadores" sub={`${drivers.length} profissionais — ${drivers.filter(d=>d.sit==="Ativo").length} ativos`} action={<BP ch="+ Cadastrar" click={()=>setModal("add")} Ic={Plus}/>}/>
    <GKpi W={W}><Kpi lb="Ativos" vl={drivers.filter(d=>d.sit==="Ativo").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/><Kpi lb="Férias/Afastados" vl={drivers.filter(d=>d.sit!=="Ativo").length} Ic={Calendar} cor="#d97706" top="#d97706"/><Kpi lb="CNH Vencendo" vl={drivers.filter(d=>dias(d)<90).length} sub="Próx. 90 dias" Ic={AlertCircle} cor="#dc2626" top="#dc2626"/><Kpi lb="Total Viagens" vl={drivers.reduce((a,d)=>a+d.viagens,0)} Ic={MapPin} top="#1d4ed8"/></GKpi>
    <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}><div style={{flex:"1 1 160px",position:"relative",minWidth:140}}><Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:mu()}}/><input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Pesquisar nome, CPF..." style={{width:"100%",border:bdr("var(--ibd)"),padding:"9px 12px 9px 30px",fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/></div><BO ch="Exportar" click={()=>{toast("Exportando...","info");setTimeout(()=>toast("Exportado!"),1800);}} Ic={Download}/></div>
    <div className="tbl" style={{background:card(),border:bdr()}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Matrícula"/><Th ch="Nome / Cargo"/><Th ch="Sec."/><Th ch="CNH"/><Th ch="Validade"/><Th ch="Veículo"/><Th ch="Viagens"/><Th ch="Status"/><Th ch=""/></tr></thead>
        <tbody>{filt.map((d,i)=>{const dv=dias(d);const w=dv<90;return(<tr key={d.id} className="hr" style={{background:i%2===0?ra():card()}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:mu()}}>{d.mat}</span>}/>
          <Td ch={<div><div style={{fontWeight:600}}>{d.nome}</div><div style={{fontSize:11,color:mu()}}>{d.cargo}</div></div>}/>
          <Td ch={<span style={{fontSize:12}}>{d.sec}</span>}/>
          <Td ch={<span style={{fontWeight:700,color:P}}>Cat. {d.cnh}</span>}/>
          <Td ch={<div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:12,color:w?"#dc2626":"inherit",fontWeight:w?700:400}}>{d.valCnh}</span>{w&&<span style={{fontSize:9,background:"#fee2e2",color:"#dc2626",padding:"1px 5px",fontWeight:700}}>{dv}d</span>}</div>}/>
          <Td ch={<span style={{fontSize:12,color:d.veiAtual?P:mu(),fontWeight:d.veiAtual?600:400}}>{d.veiAtual||"—"}</span>}/>
          <Td ch={<span style={{fontWeight:600,textAlign:"center",display:"block"}}>{d.viagens}</span>}/>
          <Td ch={<SBdg v={d.sit}/>}/>
          <Td ch={<div style={{display:"flex",gap:4}}>
            <button onClick={()=>setSel(d)} style={{background:"none",border:bdr(),padding:"3px 7px",cursor:"pointer",fontSize:11,color:"#0284c7",fontFamily:"inherit",fontWeight:600}}>Ver</button>
            <button onClick={()=>setModal(d)} style={{background:"none",border:bdr(),padding:"3px 7px",cursor:"pointer",fontSize:11,color:P,fontFamily:"inherit"}}><Edit size={11}/></button>
            <button onClick={()=>delD(d)} style={{background:"none",border:"none",padding:"3px",cursor:"pointer",color:"#dc2626"}}><Trash2 size={13}/></button>
          </div>}/>
        </tr>);})}</tbody>
      </table>
    </div>
    {sel&&<Modal title={`${sel.nome}`} close={()=>setSel(null)}><G2 W={W}><div><p style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:bdr()}}>Pessoal</p>{[["Nome",sel.nome],["CPF",sel.cpf],["RG",sel.rg],["Matrícula",sel.mat],["Nascimento",sel.nasc],["Telefone",sel.tel],["E-mail",sel.email]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div><div><p style={{fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:bdr()}}>Profissional</p>{[["Secretaria",sel.sec],["Cargo",sel.cargo],["Cat. CNH","Cat. "+sel.cnh],["Validade CNH",sel.valCnh],["Situação",sel.sit],["Veículo",sel.veiAtual||"—"],["Viagens",sel.viagens+" viagens"],["KM Rodados",sel.kmR.toLocaleString("pt-BR")+" km"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div></G2><div style={{display:"flex",gap:10,marginTop:14,paddingTop:12,borderTop:bdr()}}><BP ch="Editar" click={()=>{setModal(sel);setSel(null);}} Ic={Edit}/><BO ch="Fechar" click={()=>setSel(null)}/></div></Modal>}
    {(modal==="add"||modal?.id)&&<DriverModal d={modal==="add"?null:modal} save={saveD} close={()=>setModal(null)} toast={toast} W={W}/>}
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>);
}

/* ══════════ PAGE: TRIPS (REATIVO) ══════════ */
function Trips({vehicles,setVehicles,drivers,trips,setTrips,toast,W}){
  const[view,setView]=useState("lista");
  const[f,setF]=useState({placa:"",mot:"",dest:"",fin:"",sec:"",kmi:"",pass:"1"});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const confirmar=()=>{
    if(!f.placa||!f.mot||!f.dest){toast("Preencha veículo, motorista e destino.","danger");return;}
    const id=`VGM-2025-0${String(trips.length+241).padStart(4,"0")}`;
    const now=new Date();const ts=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`;
    const vv=vehicles.find(v=>v.placa===f.placa);
    setTrips([{id,placa:f.placa,mod:vv?.modelo||"",mot:f.mot,dest:f.dest,kmi:+f.kmi||null,kmf:null,saida:ts,ret:null,fin:f.fin||"Serviço",sec:f.sec||"—",sit:"Em andamento",pass:+f.pass||1,custo:null},...trips]);
    // 🔄 REATIVO: Atualiza situação do veículo
    setVehicles(p=>p.map(v=>v.placa===f.placa?{...v,sit:"Em uso",mot:f.mot}:v));
    setF({placa:"",mot:"",dest:"",fin:"",sec:"",kmi:"",pass:"1"});setView("lista");
    toast("Saída registrada! Veículo marcado como Em uso.");
  };
  const retornar=id=>{
    const t=trips.find(x=>x.id===id);
    const now=new Date();const ts=now.toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
    setTrips(trips.map(x=>x.id===id?{...x,sit:"Concluída",ret:ts,kmf:x.kmi?x.kmi+Math.floor(Math.random()*200+50):null}:x));
    // 🔄 REATIVO: Libera o veículo
    if(t) setVehicles(p=>p.map(v=>v.placa===t.placa?{...v,sit:"Disponível",mot:null}:v));
    toast("Retorno registrado! Veículo liberado.");
  };
  const ea=trips.filter(t=>t.sit==="Em andamento");
  return(<div>
    <SH title="Controle de Viagens" sub={`${trips.length} registros — ${ea.length} em andamento`} action={<div style={{display:"flex",gap:8}}><BO ch="Lista" click={()=>setView("lista")} sm/><BP ch="+ Registrar Saída" click={()=>setView(view==="form"?"lista":"form")}/></div>}/>
    {ea.length>0&&<div style={{background:"#e0f2fe",border:"1px solid #7dd3fc",padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span className="blink" style={{width:8,height:8,background:"#0284c7",borderRadius:"50%",display:"inline-block"}}/><span style={{fontSize:13,fontWeight:600,color:"#0369a1"}}>{ea.length} viagem(ns) em andamento — {ea.map(t=>t.placa).join(", ")}</span></div>}
    {view==="form"&&<div style={{background:card(),border:bdr(),borderTop:`3px solid ${P}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:tx(),margin:"0 0 14px",paddingBottom:10,borderBottom:bdr()}}>Registrar Nova Saída</p>
      <GF W={W} n={3}><FF lb="Veículo Disponível" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit==="Disponível").map(v=>v.placa)} req/><FF lb="Motorista" val={f.mot} set={u("mot")} opts={drivers.filter(d=>d.sit==="Ativo").map(d=>d.nome)} req/><FF lb="KM Inicial" val={f.kmi} set={u("kmi")} type="number"/></GF>
      <GF W={W} n={3}><FF lb="Destino / Endereço" val={f.dest} set={u("dest")} req/><FF lb="Finalidade" val={f.fin} set={u("fin")} opts={["Transporte de Pacientes","Serviço de Obras","Transporte Escolar","Emergência Médica","Administrativa","Entrega de Materiais","Terraplanagem","Outros"]}/><FF lb="Secretaria" val={f.sec} set={u("sec")} opts={["Saúde","Obras","Educação","Administração","Assist. Social"]}/></GF>
      <div style={{display:"flex",gap:10}}><BP ch="Confirmar Saída" click={confirmar} Ic={Check}/><BO ch="Cancelar" click={()=>setView("lista")}/></div>
    </div>}
    <div className="tbl" style={{background:card(),border:bdr()}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Destino"/><Th ch="Saída"/><Th ch="Retorno"/><Th ch="Status"/><Th ch="Ação"/></tr></thead>
        <tbody>{trips.map((t,i)=>(<tr key={t.id} className="hr" style={{background:i%2===0?ra():card()}}>
          <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:mu()}}>{t.id}</span>}/>
          <Td ch={<div><div style={{fontWeight:600,fontSize:12}}>{t.placa}</div><div style={{fontSize:11,color:mu()}}>{t.mod}</div></div>}/>
          <Td ch={<span style={{fontWeight:500}}>{t.mot}</span>}/>
          <Td ch={<span style={{fontSize:12,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{t.dest}</span>}/>
          <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{t.saida}</span>}/>
          <Td ch={<span style={{fontSize:12,color:t.ret?sub():mu(),whiteSpace:"nowrap"}}>{t.ret||"—"}</span>}/>
          <Td ch={<SBdg v={t.sit}/>}/>
          <Td ch={t.sit==="Em andamento"?<button onClick={()=>retornar(t.id)} style={{background:"#16a34a",color:"white",border:"none",padding:"4px 9px",fontSize:11,cursor:"pointer",fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap"}}>Registrar Retorno</button>:<span style={{fontSize:11,color:mu()}}>—</span>}/>
        </tr>))}</tbody>
      </table>
    </div>
  </div>);
}

/* ══════════ PAGE: FUEL ══════════ */
function FuelPage({vehicles,drivers,fuel,setFuel,toast,W}){
  const[show,setShow]=useState(false);const[f,setF]=useState({placa:"",mot:"",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:"",vl:"",km:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const reg=()=>{if(!f.placa||!f.litros){toast("Preencha veículo e litros.","danger");return;}const total=+(+f.litros*+f.vl).toFixed(2);const id=`ABS-${String(fuel.length+48).padStart(4,"0")}`;const now=new Date();const data=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`;const vv=vehicles.find(v=>v.placa===f.placa);setFuel([{id,placa:f.placa,mod:vv?.modelo||"",mot:f.mot,data,posto:f.posto,tipo:f.tipo,litros:+f.litros,vl:+f.vl,total,km:+f.km||0,media:0},...fuel]);setF({placa:"",mot:"",posto:"Posto Central Upanema",tipo:"Diesel S-10",litros:"",vl:"",km:""});setShow(false);toast("Abastecimento registrado!");};
  const tot=fuel.reduce((a,x)=>a+x.total,0);const totL=fuel.reduce((a,x)=>a+x.litros,0);
  return(<div>
    <SH title="Controle de Abastecimento" sub={`${fuel.length} registros — R$ ${tot.toLocaleString("pt-BR")} total`} action={<BP ch="+ Registrar" click={()=>setShow(!show)} Ic={Plus}/>}/>
    <GKpi W={W}><Kpi lb="Gasto Total" vl={`R$ ${tot.toLocaleString("pt-BR")}`} Ic={DollarSign} top="#1d4ed8"/><Kpi lb="Litros" vl={`${totL.toFixed(1)} L`} Ic={Fuel} top="#1d4ed8"/><Kpi lb="Registros" vl={fuel.length} Ic={ClipboardList} top="#1d4ed8"/><Kpi lb="Consumo Médio" vl="9.4 km/L" Ic={Activity} cor="#16a34a" top="#16a34a"/></GKpi>
    {show&&<div style={{background:card(),border:bdr(),borderTop:`3px solid ${P}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:tx(),margin:"0 0 14px",paddingBottom:10,borderBottom:bdr()}}>Registrar Abastecimento</p>
      <GF W={W} n={3}><FF lb="Veículo" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit!=="Baixado").map(v=>v.placa)} req/><FF lb="Motorista" val={f.mot} set={u("mot")} opts={drivers.filter(d=>d.sit==="Ativo").map(d=>d.nome)}/><FF lb="Posto" val={f.posto} set={u("posto")} opts={["Posto Central Upanema","Posto Municipal","Outro Posto"]}/></GF>
      <GF W={W} n={4}><FF lb="Combustível" val={f.tipo} set={u("tipo")} opts={["Diesel S-10","Diesel Comum","Gasolina","Etanol","GNV"]}/><FF lb="Litros" val={f.litros} set={u("litros")} type="number" req/><FF lb="R$/Litro" val={f.vl} set={u("vl")} type="number"/><FF lb="KM Atual" val={f.km} set={u("km")} type="number"/></GF>
      {f.litros&&f.vl&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",padding:"10px 14px",marginBottom:12,fontSize:13,color:P,fontWeight:600}}>Total calculado: R$ {(+f.litros*+f.vl).toFixed(2)}</div>}
      <div style={{display:"flex",gap:10}}><BP ch="Registrar" click={reg} Ic={Check}/><BO ch="Cancelar" click={()=>setShow(false)}/></div>
    </div>}
    <div className="tbl" style={{background:card(),border:bdr()}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
      <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Posto"/><Th ch="Tipo"/><Th ch="Litros"/><Th ch="R$/L"/><Th ch="Total"/><Th ch="km/L"/></tr></thead>
      <tbody>{fuel.map((x,i)=>(<tr key={x.id} className="hr" style={{background:i%2===0?ra():card()}}>
        <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:mu()}}>{x.id}</span>}/>
        <Td ch={<div><div style={{fontWeight:600,fontSize:12}}>{x.placa}</div><div style={{fontSize:11,color:mu()}}>{x.mod}</div></div>}/>
        <Td ch={<span style={{fontSize:12}}>{x.mot}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{x.data}</span>}/><Td ch={<span style={{fontSize:12}}>{x.posto}</span>}/>
        <Td ch={<Bdg lb={x.tipo} tp="info"/>}/>
        <Td ch={<span style={{fontWeight:500}}>{x.litros.toFixed(1)} L</span>}/>
        <Td ch={<span style={{fontSize:12}}>R$ {x.vl.toFixed(2)}</span>}/>
        <Td ch={<span style={{fontWeight:700,color:P,whiteSpace:"nowrap"}}>R$ {x.total.toFixed(2)}</span>}/>
        <Td ch={<span style={{fontSize:12,fontWeight:500}}>{x.media>0?x.media+" km/L":"—"}</span>}/>
      </tr>))}</tbody>
    </table></div>
  </div>);
}

/* ══════════ PAGE: MAINTENANCE (REATIVO) ══════════ */
function MaintenancePage({vehicles,setVehicles,maint,setMaint,toast,W}){
  const[show,setShow]=useState(false);const[f,setF]=useState({placa:"",tipo:"Preventiva",desc:"",oficina:"",custo:"",prev:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const criar=()=>{
    if(!f.placa||!f.desc){toast("Preencha veículo e descrição.","danger");return;}
    const id=`OS-${String(maint.length+96).padStart(4,"0")}`;const vv=vehicles.find(v=>v.placa===f.placa);
    setMaint([{id,placa:f.placa,mod:vv?.modelo||"",tipo:f.tipo,desc:f.desc,oficina:f.oficina,custo:+f.custo||0,criado:new Date().toLocaleDateString("pt-BR"),prev:f.prev,status:"Agendada",prior:"Média"},...maint]);
    // 🔄 REATIVO: Se corretiva, coloca veículo em manutenção
    if(f.tipo==="Corretiva") setVehicles(p=>p.map(v=>v.placa===f.placa?{...v,sit:"Manutenção"}:v));
    setShow(false);setF({placa:"",tipo:"Preventiva",desc:"",oficina:"",custo:"",prev:""});
    toast(f.tipo==="Corretiva"?"OS criada! Veículo colocado em Manutenção.":"Ordem de Serviço criada!");
  };
  const chSt=(id,st)=>{
    const m=maint.find(x=>x.id===id);
    setMaint(maint.map(x=>x.id===id?{...x,status:st}:x));
    // 🔄 REATIVO: Ao finalizar OS, libera o veículo
    if(st==="Finalizada"&&m) setVehicles(p=>p.map(v=>v.placa===m.placa&&v.sit==="Manutenção"?{...v,sit:"Disponível"}:v));
    toast(st==="Finalizada"?"✓ OS finalizada! Veículo liberado como Disponível.":`Status: ${st}`);
  };
  return(<div>
    <SH title="Controle de Manutenção" sub={`${maint.filter(m=>m.status!=="Finalizada").length} OS abertas`} action={<BP ch="+ Nova OS" click={()=>setShow(!show)} Ic={Plus}/>}/>
    <GKpi W={W}><Kpi lb="OS Abertas" vl={maint.filter(m=>m.status!=="Finalizada").length} Ic={ClipboardList} cor="#d97706" top="#d97706"/><Kpi lb="Em Execução" vl={maint.filter(m=>m.status==="Em execução").length} Ic={Wrench} cor="#0284c7" top="#0284c7"/><Kpi lb="Agendadas" vl={maint.filter(m=>m.status==="Agendada").length} Ic={Calendar} top="#1d4ed8"/><Kpi lb="Finalizadas" vl={maint.filter(m=>m.status==="Finalizada").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/></GKpi>
    {show&&<div style={{background:card(),border:bdr(),borderTop:`3px solid ${P}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:tx(),margin:"0 0 14px",paddingBottom:10,borderBottom:bdr()}}>Nova Ordem de Serviço</p>
      <GF W={W} n={3}><FF lb="Veículo" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit!=="Baixado").map(v=>v.placa)} req/><FF lb="Tipo" val={f.tipo} set={u("tipo")} opts={["Preventiva","Corretiva","Elétrica","Funilaria","Pneus","Revisão Geral"]}/><FF lb="Oficina / Fornecedor" val={f.oficina} set={u("oficina")}/></GF>
      <GF W={W} n={3}><FF lb="Descrição do Serviço" val={f.desc} set={u("desc")} req/><FF lb="Custo Estimado (R$)" val={f.custo} set={u("custo")} type="number"/><FF lb="Previsão de Entrega" val={f.prev} set={u("prev")}/></GF>
      {f.tipo==="Corretiva"&&<div style={{background:"#fef9c3",border:"1px solid #fde047",padding:"8px 12px",marginBottom:12,fontSize:12,color:"#a16207"}}>⚠ OS Corretiva: o veículo será colocado automaticamente em Manutenção.</div>}
      <div style={{display:"flex",gap:10}}><BP ch="Criar OS" click={criar} Ic={Check}/><BO ch="Cancelar" click={()=>setShow(false)}/></div>
    </div>}
    <div className="tbl" style={{background:card(),border:bdr()}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
      <thead><tr><Th ch="Nº OS"/><Th ch="Veículo"/><Th ch="Tipo"/><Th ch="Descrição"/><Th ch="Oficina"/><Th ch="Abertura"/><Th ch="Custo"/><Th ch="Prior."/><Th ch="Status"/><Th ch="Ação"/></tr></thead>
      <tbody>{maint.map((m,i)=>(<tr key={m.id} className="hr" style={{background:i%2===0?ra():card()}}>
        <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:mu(),fontWeight:600}}>{m.id}</span>}/>
        <Td ch={<div><div style={{fontWeight:600,fontSize:12}}>{m.placa}</div><div style={{fontSize:11,color:mu()}}>{m.mod}</div></div>}/>
        <Td ch={<Bdg lb={m.tipo} tp={m.tipo==="Corretiva"?"bad":"info"}/>}/>
        <Td ch={<span style={{fontSize:12,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{m.desc}</span>}/>
        <Td ch={<span style={{fontSize:12}}>{m.oficina||"—"}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{m.criado}</span>}/>
        <Td ch={<span style={{fontWeight:600,color:m.custo>1000?"#dc2626":tx(),whiteSpace:"nowrap"}}>R$ {m.custo.toFixed(2)}</span>}/>
        <Td ch={<Bdg lb={m.prior} tp={m.prior==="Alta"?"bad":m.prior==="Média"?"warn":"gray"}/>}/>
        <Td ch={<SBdg v={m.status}/>}/>
        <Td ch={m.status==="Agendada"?<BP ch="Iniciar" sm click={()=>chSt(m.id,"Em execução")}/> : m.status==="Em execução"?<BP ch="Finalizar" sm click={()=>chSt(m.id,"Finalizada")}/> : <span style={{color:mu(),fontSize:11}}>—</span>}/>
      </tr>))}</tbody>
    </table></div>
  </div>);
}

/* ══════════ PAGE: FINES ══════════ */
function Fines({fines,setFines,toast,W}){
  const[show,setShow]=useState(false);const[f,setF]=useState({placa:"",mot:"",data:"",inf:"",valor:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const reg=()=>{if(!f.placa||!f.inf){toast("Preencha veículo e infração.","danger");return;}const id=`MLT-${String(fines.length+5).padStart(3,"0")}`;setFines([{id,placa:f.placa,mot:f.mot||"—",data:f.data||new Date().toLocaleDateString("pt-BR"),inf:f.inf,valor:+f.valor||0,status:"Pendente"},...fines]);setF({placa:"",mot:"",data:"",inf:"",valor:""});setShow(false);toast("Multa registrada!");};
  const pagar=id=>{setFines(fines.map(x=>x.id===id?{...x,status:"Pago"}:x));toast("Multa marcada como paga.");};
  const recurso=id=>{setFines(fines.map(x=>x.id===id?{...x,status:"Em recurso"}:x));toast("Recurso cadastrado.");};
  const total=fines.reduce((a,x)=>a+x.valor,0);
  return(<div>
    <SH title="Controle de Multas" sub={`${fines.length} multas — R$ ${total.toFixed(2)} total`} action={<BP ch="+ Registrar" click={()=>setShow(!show)} Ic={Plus}/>}/>
    <GKpi W={W}><Kpi lb="Total" vl={fines.length} Ic={AlertOctagon} top="#dc2626"/><Kpi lb="Pendentes" vl={fines.filter(x=>x.status==="Pendente").length} sub={`R$ ${fines.filter(x=>x.status==="Pendente").reduce((a,x)=>a+x.valor,0).toFixed(2)}`} Ic={AlertCircle} cor="#d97706" top="#d97706"/><Kpi lb="Em Recurso" vl={fines.filter(x=>x.status==="Em recurso").length} Ic={FileText} cor="#0284c7" top="#0284c7"/><Kpi lb="Pagas" vl={fines.filter(x=>x.status==="Pago").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/></GKpi>
    {show&&<div style={{background:card(),border:bdr(),borderTop:"3px solid #dc2626",padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:tx(),margin:"0 0 14px",paddingBottom:10,borderBottom:bdr()}}>Registrar Nova Multa</p>
      <GF W={W} n={3}><FF lb="Veículo (Placa)" val={f.placa} set={u("placa")} opts={["QRZ-1A34","QST-2B56","QUV-3C78","QWX-4D90","QYZ-5E12","RCA-8H78","RDA-9I90","REB-0J12","RGD-2L56"]} req/><FF lb="Motorista" val={f.mot} set={u("mot")}/><FF lb="Data da Infração" val={f.data} set={u("data")}/></GF>
      <GF W={W} n={2}><FF lb="Descrição da Infração" val={f.inf} set={u("inf")} req/><FF lb="Valor (R$)" val={f.valor} set={u("valor")} type="number"/></GF>
      <div style={{display:"flex",gap:10}}><BP ch="Registrar" click={reg} Ic={Check}/><BO ch="Cancelar" click={()=>setShow(false)}/></div>
    </div>}
    <div className="tbl" style={{background:card(),border:bdr()}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
      <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Infração"/><Th ch="Valor"/><Th ch="Status"/><Th ch="Ações"/></tr></thead>
      <tbody>{fines.map((m,i)=>(<tr key={m.id} className="hr" style={{background:i%2===0?ra():card()}}>
        <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:mu()}}>{m.id}</span>}/>
        <Td ch={<span style={{fontWeight:600,color:NAV_BG}}>{m.placa}</span>}/><Td ch={<span style={{fontSize:12}}>{m.mot}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{m.data}</span>}/>
        <Td ch={<span style={{fontSize:12,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{m.inf}</span>}/>
        <Td ch={<span style={{fontWeight:700,color:"#dc2626",whiteSpace:"nowrap"}}>R$ {m.valor.toFixed(2)}</span>}/>
        <Td ch={<SBdg v={m.status}/>}/>
        <Td ch={<div style={{display:"flex",gap:4}}>{m.status==="Pendente"?<><BP ch="Pagar" sm click={()=>pagar(m.id)}/><BO ch="Recurso" sm click={()=>recurso(m.id)}/></>:<span style={{fontSize:11,color:mu()}}>—</span>}</div>}/>
      </tr>))}</tbody>
    </table></div>
  </div>);
}

/* ══════════ PAGE: FINANCIAL ══════════ */
function Financial({vehicles,toast,W}){
  const rank=[...vehicles].filter(v=>v.custo>0).sort((a,b)=>b.custo-a.custo);
  const total=CH_G.reduce((a,x)=>a+x.c+x.m,0);
  return(<div>
    <SH title="Gestão Financeira" sub="Análise de custos e despesas da frota" action={<BO ch="Exportar" click={()=>{toast("Gerando...","info");setTimeout(()=>toast("Exportado!"),2000);}} Ic={Download}/>}/>
    <GKpi W={W}><Kpi lb="Total 2025" vl={`R$ ${total.toLocaleString("pt-BR")}`} sub="Jan–Jun" Ic={DollarSign} top="#1d4ed8"/><Kpi lb="Combustível" vl={`R$ ${CH_G.reduce((a,x)=>a+x.c,0).toLocaleString("pt-BR")}`} sub="72% dos gastos" Ic={Fuel} top="#0c1a47" delta={-8}/><Kpi lb="Manutenção" vl={`R$ ${CH_G.reduce((a,x)=>a+x.m,0).toLocaleString("pt-BR")}`} sub="27% dos gastos" Ic={Wrench} top="#d97706"/><Kpi lb="Multas" vl="R$ 902" sub="1% dos gastos" Ic={AlertOctagon} cor="#dc2626" top="#dc2626"/></GKpi>
    <G2 W={W} ratio="1.3fr 1fr">
      <div style={{background:card(),border:bdr(),padding:"16px 16px 10px"}}>
        <div style={{fontSize:14,fontWeight:700,color:tx(),marginBottom:1}}>Gastos Mensais — 2025</div>
        <div style={{fontSize:11,color:mu(),marginBottom:12}}>Combustível + Manutenção (R$)</div>
        <ResponsiveContainer width="100%" height={W<640?160:220}><BarChart data={CH_G}><CartesianGrid strokeDasharray="3 3" stroke="var(--bd)"/><XAxis dataKey="mes" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v=>`R$${v/1000}k`}/><Tooltip formatter={v=>`R$ ${Number(v).toLocaleString("pt-BR")}`}/><Legend iconSize={10} wrapperStyle={{fontSize:11}}/><Bar dataKey="c" name="Combustível" fill="#1d4ed8" stackId="a"/><Bar dataKey="m" name="Manutenção" fill="#93c5fd" stackId="a"/></BarChart></ResponsiveContainer>
      </div>
      <div style={{background:card(),border:bdr(),padding:16}}>
        <div style={{fontSize:14,fontWeight:700,color:tx(),marginBottom:14}}>Por Secretaria</div>
        {CH_S.map((s,i)=>(<div key={i} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,fontWeight:500,color:tx()}}>{s.name}</span><span style={{fontSize:13,fontWeight:700,color:tx()}}>R$ {s.v.toLocaleString("pt-BR")}</span></div><div style={{height:6,background:"var(--bd)"}}><div style={{height:"100%",width:`${(s.v/10000)*100}%`,background:s.cor}}/></div><div style={{fontSize:10,color:mu(),marginTop:2}}>{((s.v/23460)*100).toFixed(1)}%</div></div>))}
      </div>
    </G2>
    <div style={{background:card(),border:bdr()}}>
      <div style={{padding:"13px 16px",borderBottom:bdr()}}><span style={{fontWeight:700,fontSize:14,color:tx()}}>Ranking por Custo — Junho/2025</span></div>
      <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr><Th ch="Pos."/><Th ch="Placa"/><Th ch="Modelo"/><Th ch="Secretaria"/><Th ch="KM Mês"/><Th ch="Custo/Mês"/><Th ch="R$/km"/></tr></thead>
        <tbody>{rank.map((v,i)=>(<tr key={v.id} className="hr" style={{background:i%2===0?ra():card()}}><Td ch={<span style={{fontWeight:800,color:i===0?"#dc2626":i===1?"#d97706":mu(),fontSize:15}}>#{i+1}</span>}/><Td ch={<span style={{fontWeight:700,color:NAV_BG}}>{v.placa}</span>}/><Td ch={<span>{v.modelo}</span>}/><Td ch={<span style={{fontSize:12}}>{v.sec}</span>}/><Td ch={<span style={{whiteSpace:"nowrap"}}>{v.kmm.toLocaleString("pt-BR")} km</span>}/><Td ch={<span style={{fontWeight:700,color:v.custo>900?"#dc2626":P,whiteSpace:"nowrap"}}>R$ {v.custo.toFixed(2)}</span>}/><Td ch={<span style={{fontSize:12}}>{v.kmm>0?(v.custo/v.kmm).toFixed(2):"—"} R$/km</span>}/></tr>))}</tbody>
      </table></div>
    </div>
  </div>);
}

/* ══════════ PAGE: REPORTS ══════════ */
function Reports({toast,W}){
  const[periodo,setPeriodo]=useState("Jun/2025");const[sec,setSec]=useState("Todas");
  const gerar=(n,fmt)=>{toast(`Gerando "${n}" (${fmt.toUpperCase()})...`,"info");setTimeout(()=>toast(`✓ "${n}" exportado!`),2200);};
  const rpts=[{t:"Frota Completa",d:"Situação, KM e custos de todos os veículos",I:Car},{t:"Histórico de Viagens",d:"Viagens do período com destinos e custos",I:MapPin},{t:"Consumo de Combustível",d:"Análise de consumo e gastos por veículo",I:Fuel},{t:"Ordens de Serviço",d:"Histórico de manutenções e custos",I:Wrench},{t:"Gastos por Secretaria",d:"Distribuição de custos por órgão",I:Building2},{t:"Validade de Documentos",d:"CRLV, seguros, revisões e CNHs",I:FileText},{t:"Indicadores KPI",d:"Custo/km, ociosidade, consumo, eficiência",I:BarChart2},{t:"Relatório Executivo",d:"Resumo para o Gabinete do Prefeito",I:Shield},{t:"Controle de Multas",d:"Infrações, valores e situação atual",I:AlertOctagon},{t:"Relatório de Motoristas",d:"Desempenho, CNH e histórico",I:Users},{t:"Portal da Transparência",d:"Dados para publicação pública",I:Activity},{t:"Prestação de Contas TCE-RN",d:"Relatório para Tribunal de Contas",I:DollarSign}];
  return(<div>
    <SH title="Central de Relatórios" sub="Geração de relatórios operacionais, financeiros e analíticos"/>
    <div style={{background:card(),border:bdr(),padding:"12px 16px",marginBottom:16,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{fontSize:11,fontWeight:700,color:mu(),textTransform:"uppercase",letterSpacing:".07em"}}>Filtros:</span>
      <select value={periodo} onChange={e=>setPeriodo(e.target.value)} style={{border:bdr("var(--ibd)"),padding:"6px 10px",fontSize:12,fontFamily:"inherit",color:tx()}}>{["Jun/2025","Mai/2025","Abr/2025","1º Sem/2025","2024","Personalizado"].map(p=><option key={p}>{p}</option>)}</select>
      <select value={sec} onChange={e=>setSec(e.target.value)} style={{border:bdr("var(--ibd)"),padding:"6px 10px",fontSize:12,fontFamily:"inherit",color:tx()}}>{["Todas","Saúde","Obras","Educação","Administração","Assist. Social"].map(s=><option key={s}>{s}</option>)}</select>
    </div>
    <div style={{display:"grid",gridTemplateColumns:`repeat(${W<500?1:W<800?2:W<1100?3:4},1fr)`,gap:12}}>
      {rpts.map((r,i)=>(<div key={i} className="ch" style={{background:card(),border:bdr(),padding:16,display:"flex",flexDirection:"column",justifyContent:"space-between",transition:"border-color .15s"}}>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{width:34,height:34,background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center"}}><r.I size={16} color={P}/></div></div>
          <div style={{fontSize:13,fontWeight:700,color:tx(),marginBottom:3}}>{r.t}</div>
          <div style={{fontSize:11,color:mu(),marginBottom:14,lineHeight:1.55}}>{r.d}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
          <button onClick={()=>gerar(r.t,"pdf")} style={{background:NAV_BG,color:"white",border:"none",padding:"7px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Download size={10}/>PDF</button>
          <button onClick={()=>gerar(r.t,"xlsx")} style={{background:"#15803d",color:"white",border:"none",padding:"7px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Download size={10}/>Excel</button>
        </div>
      </div>))}
    </div>
  </div>);
}

/* ══════════ PAGE: CHECKLIST ══════════ */
function Checklist({vehicles,drivers,toast,W}){
  const ITEMS=["Nível de óleo motor","Água do radiador","Nível de combustível","Calibração dos pneus","Estado dos pneus","Freios (pedal e fluido)","Luzes dianteiras","Luzes traseiras e lanternas","Limpadores e reservatório","Espelhos retrovisores","Cinto de segurança","CRLV e documentos","Kit de emergência","Extintor de incêndio","Lataria e vidros"];
  const[placa,setPlaca]=useState("");const[mot,setMot]=useState("");const[ck,setCk]=useState({});const[obs,setObs]=useState("");
  const[hist,setHist]=useState([{id:"CKL-003",placa:"QYZ-5E12",mot:"Maria Santos",data:"08/06/2025 05:50",ok:15,total:15,res:"Aprovado"},{id:"CKL-002",placa:"QRZ-1A34",mot:"Carlos Oliveira",data:"07/06/2025 07:15",ok:13,total:15,res:"Aprovado c/ ressalvas"},{id:"CKL-001",placa:"QST-2B56",mot:"João Silva",data:"07/06/2025 07:00",ok:15,total:15,res:"Aprovado"}]);
  const totalOk=Object.values(ck).filter(Boolean).length;
  const enviar=()=>{if(!placa||!mot){toast("Selecione veículo e motorista.","danger");return;}const ok=Object.values(ck).filter(Boolean).length;const res=ok===ITEMS.length?"Aprovado":ok>=12?"Aprovado c/ ressalvas":"Reprovado";const id=`CKL-${String(hist.length+4).padStart(3,"0")}`;setHist([{id,placa,mot,data:new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}),ok,total:ITEMS.length,res},...hist]);setCk({});setObs("");setPlaca("");setMot("");toast(ok===ITEMS.length?"✓ Checklist aprovado! Veículo liberado.":"⚠ Checklist com ressalvas — verifique itens pendentes.","info");};
  return(<div>
    <SH title="Checklist Diário" sub="Inspeção pré-saída obrigatória para todos os veículos"/>
    <G2 W={W}>
      <div style={{background:card(),border:bdr(),padding:16}}>
        <p style={{fontSize:14,fontWeight:700,color:tx(),margin:"0 0 14px",paddingBottom:10,borderBottom:bdr()}}>Novo Checklist de Inspeção</p>
        <GF W={W} n={2}><FF lb="Veículo (Placa)" val={placa} set={setPlaca} opts={vehicles.filter(v=>v.sit==="Disponível").map(v=>v.placa)}/><FF lb="Motorista" val={mot} set={setMot} opts={drivers.filter(d=>d.sit==="Ativo").map(d=>d.nome)}/></GF>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:12,fontWeight:700,color:tx()}}>Itens de Inspeção</span><span style={{fontSize:12,color:totalOk===ITEMS.length?"#16a34a":P,fontWeight:700}}>{totalOk}/{ITEMS.length} ✓</span></div>
        <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:12}}>{ITEMS.map((item,i)=>(<div key={i} onClick={()=>setCk(p=>({...p,[item]:!p[item]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:ck[item]?"#dcfce7":ra(),cursor:"pointer",border:`1px solid ${ck[item]?"#86efac":"var(--bd)"}`,transition:"all .1s"}}><div style={{width:17,height:17,border:`2px solid ${ck[item]?"#16a34a":"var(--bd)"}`,background:ck[item]?"#16a34a":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ck[item]&&<Check size={10} color="white"/>}</div><span style={{fontSize:13,color:ck[item]?"#15803d":sub(),fontWeight:ck[item]?600:400}}>{item}</span></div>))}</div>
        <div style={{marginBottom:12}}><label style={{display:"block",fontSize:10,fontWeight:700,color:mu(),textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>Observações</label><textarea value={obs} onChange={e=>setObs(e.target.value)} rows={2} style={{width:"100%",border:bdr("var(--ibd)"),padding:"8px 10px",fontSize:13,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/></div>
        <BP ch={`Finalizar (${totalOk}/${ITEMS.length} itens)`} click={enviar} full/>
      </div>
      <div style={{background:card(),border:bdr()}}>
        <div style={{padding:"12px 16px",borderBottom:bdr()}}><span style={{fontWeight:700,fontSize:14,color:tx()}}>Histórico de Inspeções</span></div>
        <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Itens"/><Th ch="Resultado"/></tr></thead>
        <tbody>{hist.map((h,i)=>(<tr key={h.id} className="hr" style={{background:i%2===0?ra():card()}}><Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:mu()}}>{h.id}</span>}/><Td ch={<span style={{fontWeight:600,color:NAV_BG,fontSize:12}}>{h.placa}</span>}/><Td ch={<span style={{fontSize:12}}>{h.mot}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{h.data}</span>}/><Td ch={<span style={{fontSize:12,fontWeight:600}}>{h.ok}/{h.total}</span>}/><Td ch={<Bdg lb={h.res} tp={h.res==="Aprovado"?"ok":h.res.includes("ressalvas")?"warn":"bad"}/>}/></tr>))}</tbody>
        </table></div>
      </div>
    </G2>
  </div>);
}

/* ══════════ PAGE: ALERTS ══════════ */
function AlertsPage({alerts,setAlerts,nav}){
  return(<div>
    <SH title="Central de Alertas" sub={`${alerts.length} alertas — ${alerts.filter(a=>a.nivel==="danger").length} crítico(s)`} action={<BO ch="Dispensar todos" sm click={()=>setAlerts([])}/>}/>
    {alerts.length===0&&<div style={{background:card(),border:bdr(),padding:"48px",textAlign:"center",color:mu()}}><CheckCircle size={40} color="#16a34a" style={{display:"block",margin:"0 auto 12px"}}/><div style={{fontSize:15,fontWeight:600,color:tx(),marginBottom:4}}>Nenhum alerta ativo</div><div style={{fontSize:13}}>O sistema está operando normalmente.</div></div>}
    <div style={{display:"flex",flexDirection:"column",gap:8}}>{alerts.map(a=>(<div key={a.id} style={{background:card(),border:bdr(),borderLeft:`4px solid ${a.nivel==="danger"?"#dc2626":a.nivel==="warning"?"#d97706":"#0284c7"}`,padding:"13px 16px",display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
      <div style={{marginTop:2}}>{a.nivel==="danger"?<AlertCircle size={18} color="#dc2626"/>:a.nivel==="warning"?<AlertCircle size={18} color="#d97706"/>:<Bell size={18} color="#0284c7"/>}</div>
      <div style={{flex:1,minWidth:200}}><div style={{fontSize:14,fontWeight:700,color:tx(),marginBottom:2}}>{a.titulo}</div><div style={{fontSize:13,color:mu(),lineHeight:1.5}}>{a.desc}</div></div>
      <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}><Bdg lb={a.tipo} tp={a.nivel==="danger"?"bad":a.nivel==="warning"?"warn":"info"}/><button onClick={()=>nav(a.pg)} style={{fontSize:11,color:P,background:"none",border:`1px solid ${P}`,padding:"3px 10px",cursor:"pointer",fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap"}}>Acessar</button><button onClick={()=>setAlerts(p=>p.filter(x=>x.id!==a.id))} style={{background:"none",border:"none",cursor:"pointer",color:mu(),padding:2}}><X size={14}/></button></div>
    </div>))}</div>
  </div>);
}

/* ══════════ PAGE: AUDIT ══════════ */
function Audit({W}){
  const tp={create:"#dcfce7",edit:"#e0f2fe",info:"#f1f5f9",del:"#fee2e2"};const tl={create:"CRIAÇÃO",edit:"EDIÇÃO",info:"ACESSO",del:"EXCLUSÃO"};
  return(<div>
    <SH title="Auditoria e Rastreabilidade" sub="Registro completo de todas as ações no sistema"/>
    <GKpi W={W}><Kpi lb="Ações Hoje" vl={LOG0.length} Ic={Shield} top="#1d4ed8"/><Kpi lb="Criações" vl={LOG0.filter(a=>a.tipo==="create").length} Ic={Plus} cor="#16a34a" top="#16a34a"/><Kpi lb="Edições" vl={LOG0.filter(a=>a.tipo==="edit").length} Ic={Edit} cor="#0284c7" top="#0284c7"/><Kpi lb="Acessos" vl={LOG0.filter(a=>a.tipo==="info").length} Ic={User} cor="#64748b" top="#94a3b8"/></GKpi>
    <div className="tbl" style={{background:card(),border:bdr()}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
      <thead><tr><Th ch="#"/><Th ch="Data / Hora"/><Th ch="Usuário"/><Th ch="Tipo"/><Th ch="Ação"/><Th ch="Detalhe"/></tr></thead>
      <tbody>{LOG0.map((a,i)=>(<tr key={a.id} className="hr" style={{background:i%2===0?ra():card()}}><Td ch={<span style={{fontSize:11,color:mu(),fontFamily:"monospace"}}>{String(i+1).padStart(3,"0")}</span>}/><Td ch={<span style={{fontSize:12,fontFamily:"monospace",whiteSpace:"nowrap"}}>{a.data}</span>}/><Td ch={<div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:24,height:24,background:NAV_BG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"white",flexShrink:0}}>{a.user.split(" ").map(p=>p[0]).join("").slice(0,2)}</div><span style={{fontWeight:500,fontSize:12,whiteSpace:"nowrap"}}>{a.user}</span></div>}/><Td ch={<span style={{background:tp[a.tipo]||"#f1f5f9",fontSize:9,fontWeight:700,padding:"2px 6px",letterSpacing:".06em",whiteSpace:"nowrap"}}>{tl[a.tipo]||a.tipo.toUpperCase()}</span>}/><Td ch={<span style={{fontSize:12,fontWeight:500}}>{a.acao}</span>}/><Td ch={<span style={{fontSize:11,color:mu()}}>{a.det}</span>}/></tr>))}</tbody>
    </table></div>
  </div>);
}

/* ══════════ PAGE: SUPPLIERS ══════════ */
function Suppliers({toast,W}){
  const sups=[{id:"FRN-001",nome:"Posto Central Upanema",tipo:"Posto de Combustível",cnpj:"01.234.567/0001-89",contato:"(84) 3334-0001",val:"31/12/2025",status:"Ativo"},{id:"FRN-002",nome:"Oficina Mecânica São Pedro",tipo:"Oficina",cnpj:"12.345.678/0001-90",contato:"(84) 99234-5555",val:"30/09/2025",status:"Ativo"},{id:"FRN-003",nome:"Pneus Silva Upanema",tipo:"Pneus e Borracharia",cnpj:"23.456.789/0001-01",contato:"(84) 99876-1234",val:"31/12/2025",status:"Ativo"},{id:"FRN-004",nome:"Auto Center RN — Mossoró",tipo:"Oficina Especializada",cnpj:"34.567.890/0001-12",contato:"(84) 3321-7890",val:"30/06/2025",status:"Vencendo"},{id:"FRN-005",nome:"Concessionária Fiat Mossoró",tipo:"Conc. Autorizada",cnpj:"45.678.901/0001-23",contato:"(84) 3322-4500",val:"31/12/2025",status:"Ativo"},{id:"FRN-006",nome:"Posto Municipal",tipo:"Posto de Combustível",cnpj:"Interno PMU",contato:"Interno",val:"—",status:"Ativo"},{id:"FRN-007",nome:"Tecmasc Equipamentos",tipo:"Máquinas Pesadas",cnpj:"56.789.012/0001-34",contato:"(84) 3325-9000",val:"31/12/2025",status:"Ativo"}];
  return(<div>
    <SH title="Gestão de Fornecedores" sub="Postos, oficinas e parceiros credenciados" action={<BP ch="+ Cadastrar" click={()=>toast("Em desenvolvimento.","info")} Ic={Plus}/>}/>
    <GKpi W={W}><Kpi lb="Credenciados" vl={sups.length} Ic={Building2} top="#1d4ed8"/><Kpi lb="Ativos" vl={sups.filter(s=>s.status==="Ativo").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/><Kpi lb="Vencendo" vl={sups.filter(s=>s.status==="Vencendo").length} Ic={AlertCircle} cor="#d97706" top="#d97706"/><Kpi lb="Postos" vl={sups.filter(s=>s.tipo.includes("Posto")).length} Ic={Fuel} top="#0284c7"/></GKpi>
    <div className="tbl" style={{background:card(),border:bdr()}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
      <thead><tr><Th ch="Código"/><Th ch="Nome"/><Th ch="Tipo"/><Th ch="CNPJ"/><Th ch="Contato"/><Th ch="Validade"/><Th ch="Status"/><Th ch=""/></tr></thead>
      <tbody>{sups.map((s,i)=>(<tr key={s.id} className="hr" style={{background:i%2===0?ra():card()}}><Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:mu()}}>{s.id}</span>}/><Td ch={<span style={{fontWeight:600}}>{s.nome}</span>}/><Td ch={<span style={{fontSize:12}}>{s.tipo}</span>}/><Td ch={<span style={{fontFamily:"monospace",fontSize:11}}>{s.cnpj}</span>}/><Td ch={<span style={{fontSize:12}}>{s.contato}</span>}/><Td ch={<span style={{fontSize:12,color:s.status==="Vencendo"?"#dc2626":"inherit",fontWeight:s.status==="Vencendo"?700:400,whiteSpace:"nowrap"}}>{s.val}</span>}/><Td ch={<Bdg lb={s.status} tp={s.status==="Ativo"?"ok":"warn"}/>}/><Td ch={<BO ch="Ver" sm click={()=>toast(`${s.nome}.`)}/>}/></tr>))}</tbody>
    </table></div>
  </div>);
}

/* ══════════ PAGE: SETTINGS ══════════ */
function SettingsPage({toast,currentUser,W}){
  const isAdmin=currentUser?.role==="admin";
  const[users,setUsers]=useState(SYS_USERS.map(u=>({...u})));
  const[tab,setTab]=useState("users");
  const[showForm,setShowForm]=useState(false);
  const[cfm,setCfm]=useState(null);
  const[nf,setNf]=useState({nome:"",email:"",pw:"",role:"motorista",sec:"Administração",perfil:""});
  const toggle=email=>{if(!isAdmin){toast("Somente administradores.","danger");return;}setUsers(p=>p.map(u=>u.email===email?{...u,ativo:!u.ativo}:u));toast("Status atualizado.");};
  const del=u=>{if(!isAdmin){toast("Somente administradores.","danger");return;}if(u.email===currentUser.email){toast("Não pode remover o próprio usuário.","danger");return;}setCfm({msg:`Remover ${u.nome}?`,ok:()=>{setUsers(p=>p.filter(x=>x.email!==u.email));toast("Removido.","danger");setCfm(null);}});};
  const add=()=>{if(!nf.nome||!nf.email||!nf.pw){toast("Preencha nome, e-mail e senha.","danger");return;}if(users.find(u=>u.email===nf.email)){toast("E-mail já cadastrado.","danger");return;}setUsers(p=>[...p,{...nf,mat:`PMU-${Date.now().toString().slice(-5)}`,ativo:true,viagens:0,kmR:0,veiAtual:null}]);setShowForm(false);setNf({nome:"",email:"",pw:"",role:"motorista",sec:"Administração",perfil:""});toast("Usuário cadastrado!");};
  return(<div>
    <SH title="Configurações do Sistema" sub="Usuários, permissões e parâmetros"/>
    <div style={{display:"grid",gridTemplateColumns:W<700?"1fr":"200px 1fr",gap:14}}>
      <div style={{background:card(),border:bdr(),padding:"8px 0",height:"fit-content"}}>{[["users","Usuários & Acesso",User],["firebase","Firebase & Banco de Dados",Wifi],["backup","Backup & Segurança",Shield],["notif","Notificações",Bell]].map(([id,lb,I])=>(<button key={id} onClick={()=>setTab(id)} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"10px 14px",background:tab===id?"var(--hv)":"none",border:"none",borderLeft:tab===id?`3px solid ${P}`:"3px solid transparent",color:tab===id?P:sub(),fontSize:13,fontWeight:tab===id?600:400,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}><I size={14}/>{lb}</button>))}</div>
      <div>
        {tab==="users"&&<div>
          <div style={{background:card(),border:bdr()}}>
            <div style={{padding:"13px 16px",borderBottom:bdr(),display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}><div><span style={{fontWeight:700,fontSize:14,color:tx()}}>Usuários do Sistema</span>{!isAdmin&&<span style={{marginLeft:10,fontSize:11,color:"#d97706",display:"inline-flex",alignItems:"center",gap:4}}><Lock size={11}/>Apenas visualização</span>}</div>{isAdmin&&<BP ch="+ Novo Usuário" click={()=>setShowForm(!showForm)} Ic={Plus}/>}</div>
            {isAdmin&&showForm&&<div style={{padding:18,borderBottom:bdr(),background:ra()}} className="fu">
              <p style={{fontSize:13,fontWeight:700,color:tx(),margin:"0 0 12px"}}>Cadastrar Novo Usuário</p>
              <GF W={W} n={3}><FF lb="Nome Completo" val={nf.nome} set={v=>setNf(p=>({...p,nome:v}))} req/><FF lb="E-mail Institucional" val={nf.email} set={v=>setNf(p=>({...p,email:v}))} req/><FF lb="Senha Inicial" val={nf.pw} set={v=>setNf(p=>({...p,pw:v}))} type="password" req/><FF lb="Perfil de Acesso" val={nf.role} set={v=>setNf(p=>({...p,role:v}))} opts={["admin","gestor","secretario","supervisor","motorista","auditor"]}/><FF lb="Secretaria" val={nf.sec} set={v=>setNf(p=>({...p,sec:v}))} opts={["Saúde","Obras","Educação","Administração","Assist. Social","Controle Interno","Gestão"]}/><FF lb="Título do Perfil" val={nf.perfil} set={v=>setNf(p=>({...p,perfil:v}))}/></GF>
              <div style={{display:"flex",gap:10}}><BP ch="Cadastrar Usuário" click={add} Ic={Check}/><BO ch="Cancelar" click={()=>setShowForm(false)}/></div>
            </div>}
            <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr><Th ch="Matrícula"/><Th ch="Nome"/><Th ch="E-mail"/><Th ch="Perfil"/><Th ch="Secretaria"/><Th ch="Status"/>{isAdmin&&<Th ch="Ações"/>}</tr></thead>
              <tbody>{users.map((u,i)=>(<tr key={u.email} className="hr" style={{background:i%2===0?ra():card()}}>
                <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:mu()}}>{u.mat}</span>}/>
                <Td ch={<div style={{display:"flex",alignItems:"center",gap:6}}>{u.email===currentUser?.email&&<span style={{width:6,height:6,background:"#16a34a",borderRadius:"50%",flexShrink:0}}/>}<span style={{fontWeight:600}}>{u.nome}</span></div>}/>
                <Td ch={<span style={{fontSize:12}}>{u.email}</span>}/>
                <Td ch={<Bdg lb={u.perfil||u.role} tp={u.role==="admin"?"bad":u.role==="gestor"?"warn":"info"}/>}/>
                <Td ch={<span style={{fontSize:12}}>{u.sec}</span>}/>
                <Td ch={<SBdg v={u.ativo?"Ativo":"Afastado"}/>}/>
                {isAdmin&&<Td ch={<div style={{display:"flex",gap:5}}><BO ch={u.ativo?"Desativar":"Ativar"} sm click={()=>toggle(u.email)}/>{u.email!==currentUser?.email&&<button onClick={()=>del(u)} style={{background:"none",border:"none",cursor:"pointer",color:"#dc2626",padding:3}}><Trash2 size={13}/></button>}</div>}/>}
              </tr>))}</tbody>
            </table></div>
          </div>
          {!isAdmin&&<div style={{marginTop:12,background:"#fef9c3",border:"1px solid #fde047",padding:"12px 16px",display:"flex",gap:10,alignItems:"center"}}><Lock size={16} color="#a16207"/><span style={{fontSize:13,color:"#a16207"}}>Logado como <strong>{currentUser?.perfil}</strong>. Gerenciamento de usuários requer acesso de Administrador.</span></div>}
        </div>}
        {tab==="firebase"&&<div style={{background:card(),border:bdr(),padding:20}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}><Wifi size={16} color={P}/><span style={{fontSize:14,fontWeight:700,color:tx()}}>Integração Firebase Firestore</span><Bdg lb="Pronto para configurar" tp="info"/></div>
          <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",padding:"14px 16px",marginBottom:16,fontSize:13,lineHeight:1.9,color:"#1e40af"}}>
            <strong>🔥 Como conectar ao Firebase:</strong><br/>
            <strong>1.</strong> Acesse: <code style={{background:"#dbeafe",padding:"1px 5px"}}>console.firebase.google.com</code><br/>
            <strong>2.</strong> Crie projeto: <code style={{background:"#dbeafe",padding:"1px 5px"}}>upanema-sga</code> → Ative Firestore Database<br/>
            <strong>3.</strong> Copie as credenciais (firebaseConfig) do projeto<br/>
            <strong>4.</strong> Substitua as funções <code style={{background:"#dbeafe",padding:"1px 5px"}}>Store.get/set</code> nos comentários<br/>
            <strong>5.</strong> Configure regras de segurança: apenas usuários autenticados<br/>
            <strong>Resultado:</strong> Todos os dados ficam no servidor, sincronizados em tempo real em todos os dispositivos.
          </div>
          <p style={{fontSize:12,fontWeight:700,color:mu(),textTransform:"uppercase",marginBottom:8}}>Coleções no Firestore:</p>
          {[["vehicles","Veículos da frota"],["drivers","Motoristas e operadores"],["trips","Registros de viagens"],["fuel","Abastecimentos"],["maint","Ordens de serviço"],["fines","Multas"],["users","Usuários do sistema"]].map(([c,d])=>(<DR key={c} l={<code style={{background:"var(--ra)",padding:"1px 6px",fontSize:11}}>/{c}</code>} v={d}/>))}
        </div>}
        {tab==="backup"&&<div style={{background:card(),border:bdr(),padding:20}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}><Shield size={16} color={P}/><span style={{fontSize:14,fontWeight:700,color:tx()}}>Backup e Segurança</span></div>
          <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",padding:"14px",marginBottom:14,fontSize:12,color:"#1e40af",lineHeight:1.75}}>Dados armazenados no armazenamento local desta sessão (window.storage). Ao integrar Firebase, todos os dados migram automaticamente para o servidor com backup em nuvem.  </div>
          {[["Última sessão","08/06/2025 07:14"],["Versão do Sistema","SGA Frota Municipal v1.0 Final"],["Ambiente","Demonstração — dados para testes"],["Backend","Firebase Firestore (a configurar)"],["Política LGPD","Dados tratados conforme Lei 13.709/2018"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}
          <div style={{display:"flex",gap:10,marginTop:16}}><BP ch="Exportar Backup" click={()=>toast("Gerando backup...","info")} Ic={Download}/></div>
        </div>}
        {tab==="notif"&&<div style={{background:card(),border:bdr(),padding:20}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}><Bell size={16} color={P}/><span style={{fontSize:14,fontWeight:700,color:tx()}}>Configurações de Notificação</span></div>
          {[["CNH vencendo","Alertar 90 dias antes","ok"],["Seguro vencendo","Alertar 30 dias antes","ok"],["Revisão preventiva","Alertar 15 dias antes","ok"],["Consumo anormal","Desvio acima de 20%","info"],["Estoque baixo","Combustível abaixo de 20%","warn"],["E-mail de alertas","garagem@upanema.rn.gov.br","info"]].map(([l,v,tp])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid var(--bd)`,alignItems:"center"}}><span style={{fontSize:13,color:tx()}}>{l}</span><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:12,color:mu()}}>{v}</span><Bdg lb="Ativo" tp={tp}/></div></div>))}
        </div>}
      </div>
    </div>
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>);
}

/* ══════════ NOTIFICATIONS PANEL ══════════ */
function NotifPanel({close,nav,alerts}){
  return(<div className="fu" style={{position:"fixed",top:52,right:0,width:"min(320px,100vw)",background:card(),border:bdr(),borderTop:"none",boxShadow:"0 8px 32px rgba(0,0,0,.2)",zIndex:500,maxHeight:"80vh",overflow:"auto"}}>
    <div style={{padding:"12px 16px",borderBottom:bdr(),display:"flex",justifyContent:"space-between",alignItems:"center",background:th(),position:"sticky",top:0}}><span style={{fontWeight:700,fontSize:13,color:tx()}}>Notificações</span><button onClick={close} style={{background:"none",border:"none",cursor:"pointer",color:mu()}}><X size={15}/></button></div>
    {alerts.slice(0,6).map((a,i)=>(<div key={i} style={{display:"flex",gap:12,padding:"11px 16px",borderBottom:bdr(),cursor:"pointer"}} className="hr"><div style={{marginTop:2}}>{a.nivel==="danger"?<AlertCircle size={14} color="#dc2626"/>:a.nivel==="warning"?<AlertCircle size={14} color="#d97706"/>:<Bell size={14} color="#0284c7"/>}</div><div><div style={{fontSize:12,fontWeight:600,color:tx(),lineHeight:1.4}}>{a.titulo}</div><div style={{fontSize:11,color:mu()}}>{a.desc.slice(0,60)}...</div></div></div>))}
    <div style={{padding:"10px 16px",textAlign:"center"}}><button onClick={()=>{nav("alerts");close();}} style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Ver todos os alertas →</button></div>
  </div>);
}

/* ══════════ SIDEBAR ══════════ */
function Sidebar({page,setPage,currentUser,W,open,setOpen}){
  const role=currentUser?.role||"admin";
  const allowed=ROLES[role]||[];
  const canSee=id=>role==="admin"||allowed.includes(id);
  const nav=NAV_ITEMS.map(s=>({...s,items:(s.items||[]).filter(i=>canSee(i.id))})).filter(s=>s.items.length>0);
  const mob=W<900;
  const ini=currentUser?.nome?.split(" ").map(p=>p[0]).join("").slice(0,2)||"?";
  const roleColor={admin:"#dc2626",gestor:"#d97706",secretario:"#0284c7",supervisor:"#16a34a",motorista:"#7c3aed",auditor:"#64748b"};
  return(<div style={{
    position:"fixed",left:0,top:0,width:248,height:"100vh",background:NAV_BG,display:"flex",flexDirection:"column",
    zIndex:200,overflowY:"auto",
    transform:mob&&!open?"translateX(-248px)":"translateX(0)",
    transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)"
  }}>
    <div style={{padding:"18px 16px 14px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
      <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:7}}>
        <div style={{width:36,height:36,background:P,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Truck size={18} color="white"/></div>
        <div><div style={{fontSize:9,fontWeight:700,color:"#60a5fa",letterSpacing:".14em",textTransform:"uppercase"}}>Prefeitura de Upanema</div><div style={{fontSize:14,fontWeight:800,color:"white",lineHeight:1.2}}>Upanema — RN</div></div>
      </div>
      <div style={{fontSize:9,color:"rgba(148,163,184,.5)",letterSpacing:".07em",textTransform:"uppercase"}}>Sistema de Gestão da Frota</div>
    </div>
    <nav style={{flex:1,padding:"8px 0"}}>
      {nav.map((sec,si)=>(<div key={si}>
        {sec.sec&&<div style={{padding:"12px 16px 4px",fontSize:9,fontWeight:700,color:"rgba(148,163,184,.38)",letterSpacing:".14em",textTransform:"uppercase"}}>{sec.sec}</div>}
        {sec.items.map(item=>{const on=page===item.id;return(
          <button key={item.id} onClick={()=>{setPage(item.id);if(mob)setOpen(false);}}
            style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"9px 16px",background:on?P:"none",border:"none",borderLeft:on?"3px solid #93c5fd":"3px solid transparent",cursor:"pointer",textAlign:"left",boxSizing:"border-box",transition:"background .1s"}}
            onMouseEnter={e=>{if(!on)e.currentTarget.style.background="rgba(255,255,255,.07)";}}
            onMouseLeave={e=>{if(!on)e.currentTarget.style.background="none";}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><item.ic size={15} color={on?"white":"rgba(203,213,225,.65)"}/><span style={{fontSize:13,fontWeight:on?600:400,color:on?"white":"rgba(203,213,225,.88)",fontFamily:"inherit"}}>{item.lb}</span></div>
            {item.badge&&<span style={{background:on?"rgba(255,255,255,.22)":"#dc2626",color:"white",fontSize:10,fontWeight:700,padding:"1px 6px",minWidth:18,textAlign:"center",flexShrink:0}}>{item.badge}</span>}
          </button>
        );})}
      </div>))}
    </nav>
    <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,background:roleColor[role]||P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0}}>{ini}</div>
        <div style={{minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:"white",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser?.nome}</div><div style={{fontSize:10,color:"rgba(148,163,184,.5)",textTransform:"capitalize"}}>{currentUser?.perfil}</div></div>
      </div>
    </div>
  </div>);
}

/* ══════════ HEADER ══════════ */
function Header({page,logout,nav,dm,setDm,notif,setNotif,onMenu,W,alerts}){
  const mob=W<900;
  return(<div style={{height:52,background:card(),borderBottom:bdr(),display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",position:"sticky",top:0,zIndex:90,gap:8}}>
    <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0,flex:1}}>
      <button onClick={onMenu} style={{background:"none",border:"none",cursor:"pointer",padding:"5px",color:mu(),display:"flex",alignItems:"center",flexShrink:0}} aria-label="Menu"><Menu size={19}/></button>
      {!mob&&<><span style={{fontSize:10,color:mu(),textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap"}}>SGA Frota Municipal</span><span style={{color:"var(--bd)"}}>›</span></>}
      <span style={{fontSize:14,fontWeight:700,color:tx(),overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{PAGE_LABEL[page]||page}</span>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
      {!mob&&<div style={{position:"relative"}}><Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:mu()}}/><input placeholder="Busca rápida..." style={{border:bdr("var(--ibd)"),padding:"6px 12px 6px 26px",fontSize:12,width:170,fontFamily:"inherit"}}/></div>}
      <button onClick={()=>setDm(!dm)} title={dm?"Modo claro":"Modo escuro"} style={{background:"none",border:bdr(),padding:"5px 7px",cursor:"pointer",color:mu(),display:"flex",alignItems:"center"}}>{dm?<Sun size={15}/>:<Moon size={15}/>}</button>
      <div style={{position:"relative"}}>
        <button onClick={()=>setNotif(!notif)} style={{background:"none",border:"none",cursor:"pointer",padding:"5px",color:mu(),display:"flex",alignItems:"center"}}><Bell size={17}/>{alerts.filter(a=>a.nivel==="danger").length>0&&<span style={{position:"absolute",top:3,right:3,width:7,height:7,background:"#dc2626",borderRadius:"50%"}}/>}</button>
      </div>
      <div style={{width:1,height:20,background:"var(--bd)"}}/>
      <button onClick={logout} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:bdr(),padding:"5px 10px",cursor:"pointer",fontSize:12,color:sub(),fontFamily:"inherit",whiteSpace:"nowrap"}}><LogOut size={13}/>{!mob&&"Sair"}</button>
    </div>
  </div>);
}

/* ══════════════════════════════════════════════════════
   APP ROOT — Estado central + Persistência + Responsivo
═══════════════════════════════════════════════════════ */
export default function App() {
  const W = useWS();
  const mob = W < 900;

  const [logged, setLogged] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [dm, setDm] = useState(false);
  const [notif, setNotif] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const { ts, add: toast } = useToast();

  // Estado de dados — persistidos via window.storage (Firebase-ready)
  const [vehicles, setVehicles] = useState(V0);
  const [drivers, setDrivers] = useState(D0);
  const [trips, setTrips] = useState(T0);
  const [fuel, setFuel] = useState(F0);
  const [maint, setMaint] = useState(MNT0);
  const [fines, setFines] = useState(MU0);
  const [alerts, setAlerts] = useState(AL0);

  // 🔄 Carrega dados do storage na inicialização
  useEffect(() => {
    (async () => {
      try {
        const [v, d, t, f, m, fi, al] = await Promise.all([
          Store.get("sga_v"), Store.get("sga_d"), Store.get("sga_t"),
          Store.get("sga_f"), Store.get("sga_m"), Store.get("sga_fi"), Store.get("sga_al"),
        ]);
        if (v?.length) setVehicles(v); if (d?.length) setDrivers(d);
        if (t?.length) setTrips(t); if (f?.length) setFuel(f);
        if (m?.length) setMaint(m); if (fi?.length) setFines(fi);
        if (al?.length) setAlerts(al);
      } catch {}
      setReady(true);
    })();
  }, []);

  // 🔄 Salva automaticamente quando dados mudam
  useEffect(() => { if (ready) Store.set("sga_v", vehicles); }, [vehicles, ready]);
  useEffect(() => { if (ready) Store.set("sga_d", drivers); }, [drivers, ready]);
  useEffect(() => { if (ready) Store.set("sga_t", trips); }, [trips, ready]);
  useEffect(() => { if (ready) Store.set("sga_f", fuel); }, [fuel, ready]);
  useEffect(() => { if (ready) Store.set("sga_m", maint); }, [maint, ready]);
  useEffect(() => { if (ready) Store.set("sga_fi", fines); }, [fines, ready]);
  useEffect(() => { if (ready) Store.set("sga_al", alerts); }, [alerts, ready]);

  const goPage = (p) => { setPage(p); setSideOpen(false); setNotif(false); };

  if (!logged) return (
    <div className="sga"><style>{CSS}</style>
      <Login onLogin={u => { setCurrentUser(u); setLogged(true); }} W={W}/>
    </div>
  );

  const pages = {
    dashboard: <Dashboard nav={goPage} vehicles={vehicles} drivers={drivers} alerts={alerts} W={W}/>,
    vehicles: <Vehicles vehicles={vehicles} setVehicles={setVehicles} toast={toast} W={W}/>,
    drivers: <Drivers drivers={drivers} setDrivers={setDrivers} toast={toast} W={W}/>,
    trips: <Trips vehicles={vehicles} setVehicles={setVehicles} drivers={drivers} trips={trips} setTrips={setTrips} toast={toast} W={W}/>,
    checklist: <Checklist vehicles={vehicles} drivers={drivers} toast={toast} W={W}/>,
    fuel: <FuelPage vehicles={vehicles} drivers={drivers} fuel={fuel} setFuel={setFuel} toast={toast} W={W}/>,
    maintenance: <MaintenancePage vehicles={vehicles} setVehicles={setVehicles} maint={maint} setMaint={setMaint} toast={toast} W={W}/>,
    fines: <Fines fines={fines} setFines={setFines} toast={toast} W={W}/>,
    financial: <Financial vehicles={vehicles} toast={toast} W={W}/>,
    reports: <Reports toast={toast} W={W}/>,
    suppliers: <Suppliers toast={toast} W={W}/>,
    alerts: <AlertsPage alerts={alerts} setAlerts={setAlerts} nav={goPage}/>,
    audit: <Audit W={W}/>,
    settings: <SettingsPage toast={toast} currentUser={currentUser} W={W}/>,
  };

  return (
    <div className={`sga${dm ? " dark" : ""}`} style={{ display: "flex", minHeight: "100vh", background: bg() }}>
      <style>{CSS}</style>

      {/* Overlay móvel — fecha sidebar ao clicar fora */}
      {mob && sideOpen && (
        <div onClick={() => setSideOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 150, transition: "opacity .28s" }}/>
      )}

      <Sidebar page={page} setPage={goPage} currentUser={currentUser} W={W} open={sideOpen} setOpen={setSideOpen}/>

      {/* Conteúdo principal — margem automática baseada no tamanho da tela */}
      <div style={{ marginLeft: mob ? 0 : 248, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", minWidth: 0, transition: "margin-left 0.28s ease" }}>
        <Header page={page} logout={() => { setLogged(false); setCurrentUser(null); setPage("dashboard"); }} nav={goPage} dm={dm} setDm={setDm} notif={notif} setNotif={setNotif} onMenu={() => setSideOpen(!sideOpen)} W={W} alerts={alerts}/>
        {notif && <NotifPanel close={() => setNotif(false)} nav={goPage} alerts={alerts}/>}

        {!ready && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,.88)", zIndex: 800, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div className="spin" style={{ width: 32, height: 32, border: "3px solid var(--bd)", borderTopColor: P, borderRadius: "50%" }}/>
            <span style={{ fontSize: 13, color: mu(), fontWeight: 600 }}>Carregando dados do sistema...</span>
          </div>
        )}

        <main style={{ flex: 1, padding: mob ? 12 : 18, overflowY: "auto", maxWidth: "100%" }}>
          {pages[page] || <Dashboard nav={goPage} vehicles={vehicles} drivers={drivers} alerts={alerts} W={W}/>}
        </main>

        <footer style={{ padding: mob ? "8px 12px" : "8px 20px", borderTop: bdr(), background: card(), display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: mu(), flexShrink: 0, flexWrap: "wrap", gap: 4 }}>
          <span>© 2025 Prefeitura Municipal de Upanema — RN · SGA Frota v1.0</span>
          {!mob && <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#16a34a", fontWeight: 600 }}><CheckCircle size={11}/>Dados sincronizados · Pronto para Firebase</span>}
        </footer>
      </div>
      <Toasts ts={ts}/>
    </div>
  );
}
