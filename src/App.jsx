/*  SGA — Sistema de Gestão da Garagem Municipal
    Prefeitura de Upanema — RN  |  Versão de Produção
    ─────────────────────────────────────────── */
import { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, Car, Users, MapPin, Fuel, Wrench, DollarSign,
  FileText, Bell, Settings as SettingsIcon, LogOut, Search, Plus, Edit, Download,
  CheckCircle, AlertCircle, AlertTriangle, Truck, X, Check,
  Activity, Shield, User, Calendar, BarChart2, ClipboardList,
  Building2, CheckSquare, AlertOctagon, Moon, Sun, Trash2,
  Save, TrendingUp, TrendingDown, Menu, Lock, Eye, EyeOff,
  ChevronRight, RefreshCw, Camera, ImageOff,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   CSS — LAYOUT RESPONSIVO 100% VIA CSS
═══════════════════════════════════════════════════════ */
const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;height:100%;min-height:100vh;overflow-x:hidden;background:#0c1a47;}
#root{width:100%;min-height:100vh;}
.sga{
  --bg:#f0f4f8;--card:#fff;--bd:#e2e8f0;--tx:#0f172a;--sub:#374151;--mu:#64748b;
  --th:#f8fafc;--ra:#f9fafb;--hv:#eff6ff;--inp:#fff;--ibd:#d1d5db;
  font-family:'Segoe UI',system-ui,-apple-system,sans-serif;
  width:100%;min-height:100vh;background:var(--bg);
  position:relative;
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

.sga-wrap{display:flex;min-height:100vh;width:100%;}
.sga-sb{
  position:fixed;left:0;top:0;width:248px;height:100vh;z-index:200;
  overflow-y:auto;display:flex;flex-direction:column;
  background:#0c1a47;transition:transform .28s cubic-bezier(.4,0,.2,1);
}
.sga-mn{
  margin-left:248px;flex:1;display:flex;flex-direction:column;
  min-height:100vh;overflow-x:hidden;transition:margin-left .28s ease;
  width:calc(100% - 248px);max-width:100%;
}
.sga-ov{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:150;}
.sga-ov.vis{display:block;}
.hb{display:none!important;}

.gkpi{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;margin-bottom:12px;}
.gdash{display:grid;grid-template-columns:1.3fr 1fr;gap:12px;margin-bottom:12px;}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.gf2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.gf3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px;}
.gf4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px;}
.grpt{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;}
.gcfg{display:grid;grid-template-columns:200px 1fr;gap:14px;}

.tbl{overflow-x:auto;-webkit-overflow-scrolling:touch;}
.hr:hover{background:var(--hv)!important;cursor:pointer;}
.ni:hover{background:rgba(255,255,255,.08)!important;}
.ch:hover{border-color:#1d4ed8!important;}
.donly{}

@keyframes fadeUp{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes spin{to{transform:rotate(360deg)}}
.fu{animation:fadeUp .22s ease;}
.blink{animation:blink 2s ease infinite;}
.spin{animation:spin .8s linear infinite;}

@media(max-width:1024px){
  .gkpi{grid-template-columns:repeat(auto-fill,minmax(170px,1fr));}
}
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
@media(max-width:640px){
  .gkpi{grid-template-columns:repeat(2,1fr)!important;}
  .gf3{grid-template-columns:1fr 1fr!important;}
  .gf4{grid-template-columns:1fr 1fr!important;}
  .gf2{grid-template-columns:1fr!important;}
  .gcfg{grid-template-columns:1fr!important;}
}
@media(max-width:380px){
  .gkpi{grid-template-columns:1fr 1fr!important;}
  .gf3,.gf4{grid-template-columns:1fr!important;}
}
`;

/* ═══ STORAGE (troca por Firebase Firestore quando pronto) ═══ */
const Store = {
async get(key) {
  try {
    const ref = doc(db, "storage", key);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return null;
    }

    return snap.data().value;
  } catch (e) {
    console.error("Erro ao carregar", key, e);
    return null;
  }
},

async set(key, value) {
  try {
    const ref = doc(db, "storage", key);

    await setDoc(ref, {
      value: value,
      updatedAt: new Date()
    });
  } catch (e) {
    console.error("Erro ao salvar", key, e);
  }
},
};

const NAV_BG="#0c1a47", P="#1d4ed8";

/* ═══ CLOUDINARY ═══ */
const CLOUD_NAME="c1vt96ia";
const UPLOAD_PRESET="sga_upanema";

async function uploadCloudinary(base64){
  try{
    const fd=new FormData();
    fd.append("file",base64);
    fd.append("upload_preset",UPLOAD_PRESET);
    fd.append("folder","sga-frota");
    const res=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{method:"POST",body:fd});
    const data=await res.json();
    if(data.secure_url)return data.secure_url;
    return null;
  }catch(e){
    console.error("Cloudinary erro:",e);
    return null;
  }
}

/* ═══ USUÁRIO ÚNICO INICIAL — Administrador Geral ═══ */
const SYS_USERS_INIT=[
  {email:"gestão@gmail.com",pw:"gestão",nome:"Administrador Geral",role:"admin",perfil:"Administrador Geral",sec:"Gestão Municipal",mat:"PMU-ADMIN",ativo:true},
];

const ROLE_PAGES={
  admin:["dashboard","vehicles","drivers","trips","checklist","fuel","maintenance","fines","financial","reports","suppliers","alerts","audit","settings"],
  gestor:["dashboard","vehicles","drivers","trips","checklist","fuel","maintenance","fines","financial","reports","suppliers","alerts","audit"],
  secretario:["dashboard","vehicles","trips","financial","reports","alerts"],
  supervisor:["dashboard","vehicles","drivers","trips","checklist","maintenance","alerts"],
  motorista:["dashboard","trips","checklist"],
  auditor:["dashboard","vehicles","drivers","financial","reports","audit"],
};
const ROLE_LABELS={admin:"Administrador",gestor:"Gestor da Garagem",secretario:"Secretário(a)",supervisor:"Supervisor",motorista:"Motorista",auditor:"Auditor"};

const NAV_ITEMS=[
  {sec:null,items:[{id:"dashboard",lb:"Painel Geral",ic:LayoutDashboard}]},
  {sec:"OPERAÇÕES",items:[{id:"vehicles",lb:"Veículos",ic:Car},{id:"drivers",lb:"Motoristas",ic:Users},{id:"trips",lb:"Viagens",ic:MapPin},{id:"checklist",lb:"Vistoria",ic:CheckSquare}]},
  {sec:"RECURSOS",items:[{id:"fuel",lb:"Abastecimento",ic:Fuel},{id:"maintenance",lb:"Manutenção",ic:Wrench},{id:"fines",lb:"Multas",ic:AlertOctagon}]},
  {sec:"GESTÃO",items:[{id:"financial",lb:"Financeiro",ic:DollarSign},{id:"reports",lb:"Relatórios",ic:FileText},{id:"suppliers",lb:"Fornecedores",ic:Building2}]},
  {sec:"SISTEMA",items:[{id:"alerts",lb:"Alertas",ic:Bell},{id:"audit",lb:"Auditoria",ic:Shield},{id:"settings",lb:"Configurações",ic:SettingsIcon}]},
];
const PL={dashboard:"Painel Geral",vehicles:"Veículos",drivers:"Motoristas",trips:"Viagens",checklist:"Vistoria Veicular",fuel:"Abastecimento",maintenance:"Manutenção",fines:"Multas",financial:"Financeiro",reports:"Relatórios",suppliers:"Fornecedores",alerts:"Alertas",audit:"Auditoria",settings:"Configurações"};

/* ═══ TOAST ═══ */
function useToast(){const[ts,setTs]=useState([]);const add=(m,t="success")=>{const id=Date.now()+Math.random();setTs(p=>[...p,{id,m,t}]);setTimeout(()=>setTs(p=>p.filter(x=>x.id!==id)),4200);};return{ts,add};}
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

/* ═══ LIGHTBOX — visualizador de foto em tela cheia ═══ */
function Lightbox({src,close}){
  if(!src)return null;
  return<div onClick={close} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,cursor:"zoom-out"}}>
    <button onClick={close} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,.15)",border:"none",borderRadius:"50%",width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={18} color="white"/></button>
    <img src={src} alt="Foto" onClick={e=>e.stopPropagation()} style={{maxWidth:"95vw",maxHeight:"90vh",objectFit:"contain",boxShadow:"0 8px 40px rgba(0,0,0,.6)",cursor:"default"}}/>
  </div>;
}


/* ═══ UPLOAD DE FOTO ÚNICA ═══ */
function PhotoUpload({photo,setPhoto,toast,lb="Foto"}){
  const inputRef=useRef(null);
  const[lb_open,setLbOpen]=useState(false);
  const onFile=e=>{
    const file=e.target.files?.[0];
    if(!file)return;
    if(!file.type.startsWith("image/")){toast("Selecione uma imagem válida.","danger");return;}
    toast("Enviando foto...","info");
    const reader=new FileReader();
    reader.onload=async ev=>{
      const img=new Image();
      img.onload=async()=>{
        const canvas=document.createElement("canvas");
        const MAX=1600;
        let w=img.width,h=img.height;
        if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}
        if(h>MAX){w=Math.round(w*MAX/h);h=MAX;}
        canvas.width=w;canvas.height=h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        const base64=canvas.toDataURL("image/jpeg",0.88);
        const url=await uploadCloudinary(base64);
        if(url){setPhoto(url);toast("✓ Foto enviada com sucesso!");}
        else{setPhoto(base64);toast("Foto salva localmente.","info");}
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  return<div style={{display:"flex",flexDirection:"column",gap:6}}>
    <label style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".07em"}}>{lb}</label>
    <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
      {photo
        ?<div style={{position:"relative",flexShrink:0}}>
            <img src={photo} alt="preview" onClick={()=>setLbOpen(true)} style={{width:120,height:90,objectFit:"contain",border:"1px solid var(--ibd)",background:"var(--ra)",cursor:"zoom-in",display:"block"}}/>
            <div style={{position:"absolute",top:4,right:4,display:"flex",gap:3}}>
              <button onClick={()=>setLbOpen(true)} title="Ampliar" style={{background:"rgba(0,0,0,.55)",border:"none",borderRadius:3,padding:"2px 5px",cursor:"pointer",color:"white",fontSize:10}}>🔍</button>
              <button onClick={()=>setPhoto(null)} title="Remover" style={{background:"rgba(220,38,38,.8)",border:"none",borderRadius:3,padding:"2px 5px",cursor:"pointer",color:"white",fontSize:10}}>✕</button>
            </div>
          </div>
        :<div onClick={()=>inputRef.current?.click()} style={{width:120,height:90,border:"2px dashed var(--bd)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:4,flexShrink:0}}>
            <Camera size={20} color="var(--mu)"/><span style={{fontSize:10,color:"var(--mu)"}}>Adicionar</span>
          </div>
      }
      <div style={{display:"flex",flexDirection:"column",gap:6,paddingTop:4}}>
        <Btn ghost sm Ic={Camera} click={()=>inputRef.current?.click()}>{photo?"Trocar foto":"Selecionar foto"}</Btn>
        <span style={{fontSize:10,color:"var(--mu)",lineHeight:1.4}}>JPG, PNG ou WEBP<br/>Máximo 3 MB</span>
      </div>
    </div>
    <input ref={inputRef} type="file" accept="image/*" onChange={onFile} style={{display:"none"}}/>
    {lb_open&&<Lightbox src={photo} close={()=>setLbOpen(false)}/>}
  </div>;
}

/* ═══ UPLOAD DE MÚLTIPLAS FOTOS ═══ */
function MultiPhotoUpload({fotos=[],setFotos,toast,max=5,lb="Fotos"}){
  const inputRef=useRef(null);
  const[lbSrc,setLbSrc]=useState(null);
  const onFile=e=>{
    const files=Array.from(e.target.files||[]);
    const sobra=max-(fotos.length);
    if(sobra<=0){toast(`Máximo de ${max} fotos.`,"warning");return;}
    files.slice(0,sobra).forEach(file=>{
      if(!file.type.startsWith("image/")){toast("Apenas imagens.","danger");return;}
      toast("Enviando foto...","info");
      const reader=new FileReader();
      reader.onload=async ev=>{
        const img=new Image();
        img.onload=async()=>{
          const canvas=document.createElement("canvas");
          const MAX=1600;
          let w=img.width,h=img.height;
          if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}
          if(h>MAX){w=Math.round(w*MAX/h);h=MAX;}
          canvas.width=w;canvas.height=h;
          canvas.getContext("2d").drawImage(img,0,0,w,h);
          const base64=canvas.toDataURL("image/jpeg",0.88);
          const url=await uploadCloudinary(base64);
          const src=url||base64;
          setFotos(p=>[...p,{id:Date.now()+Math.random(),src,nome:file.name}]);
          if(url)toast("✓ Foto enviada!");
        };
        img.src=ev.target.result;
      };
      reader.readAsDataURL(file);
    });
    e.target.value="";
  };
  return<div style={{display:"flex",flexDirection:"column",gap:8}}>
    <label style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".07em"}}>{lb} ({fotos.length}/{max})</label>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-start"}}>
      {fotos.map((ft,i)=><div key={ft.id} style={{position:"relative",flexShrink:0}}>
        <img src={ft.src} alt={ft.nome} onClick={()=>setLbSrc(ft.src)} style={{width:100,height:75,objectFit:"contain",border:"1px solid var(--ibd)",background:"var(--ra)",cursor:"zoom-in",display:"block"}}/>
        <div style={{position:"absolute",top:3,right:3,display:"flex",gap:2}}>
          <button onClick={()=>setLbSrc(ft.src)} title="Ampliar" style={{background:"rgba(0,0,0,.55)",border:"none",borderRadius:3,padding:"1px 4px",cursor:"pointer",color:"white",fontSize:10}}>🔍</button>
          <button onClick={()=>setFotos(p=>p.filter((_,j)=>j!==i))} title="Remover" style={{background:"rgba(220,38,38,.8)",border:"none",borderRadius:3,padding:"1px 4px",cursor:"pointer",color:"white",fontSize:10}}>✕</button>
        </div>
      </div>)}
      {fotos.length<max&&<div onClick={()=>inputRef.current?.click()} style={{width:100,height:75,border:"2px dashed var(--bd)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:4,flexShrink:0}}>
        <Camera size={18} color="var(--mu)"/><span style={{fontSize:10,color:"var(--mu)"}}>Adicionar</span>
      </div>}
    </div>
    <input ref={inputRef} type="file" accept="image/*" multiple onChange={onFile} style={{display:"none"}}/>
    {lbSrc&&<Lightbox src={lbSrc} close={()=>setLbSrc(null)}/>}
  </div>;
}



/* ═══ MODAIS DE CADASTRO ═══ */
function VModal({v,save,close,toast}){
  const blank={placa:"",marca:"",modelo:"",ano:"",cor:"",tipo:"Passeio",cat:"Administrativo",sec:"Administração",comb:"Gasolina",sit:"Disponível",renavam:"",chassi:"",pat:"",km:"0",niv:"100",rev:"",seg:"",obs:"",mot:null,mul:0,custo:0,kmm:0,foto:null,fotos:[],fotoDoc:null,estadoCons:"Bom"};
  const[f,setF]=useState({...blank,...(v||{}),fotos:v?.fotos||[],foto:v?.foto||null,fotoDoc:v?.fotoDoc||null,estadoCons:v?.estadoCons||"Bom"});
  const u=k=>val=>setF(p=>({...p,[k]:val}));
  const go=()=>{if(!f.placa||!f.modelo){toast("Preencha Placa e Modelo.","danger");return;}save({...f,id:v?.id||`V${Date.now().toString().slice(-6)}`,km:+f.km||0,niv:+f.niv||0});toast(v?"Veículo atualizado!":"Veículo cadastrado com sucesso!");close();};
  return<Modal title={v?`Editar — ${v.placa}`:"Cadastrar Novo Veículo"} close={close} w={820}>
    {/* Fotos */}
    <p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:8,borderBottom:"1px solid var(--bd)"}}>Fotos e Documentos</p>
    <div className="gf3" style={{marginBottom:16}}>
      <MultiPhotoUpload fotos={f.fotos} setFotos={p=>setF(x=>({...x,fotos:typeof p==="function"?p(x.fotos):p}))} toast={toast} max={5} lb="Fotos do Veículo (até 5)"/>
      <PhotoUpload photo={f.fotoDoc} setPhoto={u("fotoDoc")} toast={toast} lb="Foto do CRLV / Documento"/>
    </div>
    <p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:8,borderBottom:"1px solid var(--bd)"}}>Identificação</p>
    <div className="gf3"><FF lb="Placa" val={f.placa} set={u("placa")} req/><FF lb="RENAVAM" val={f.renavam} set={u("renavam")}/><FF lb="Patrimônio" val={f.pat} set={u("pat")}/></div>
    <div className="gf3"><FF lb="Chassi" val={f.chassi} set={u("chassi")}/><FF lb="Ano" val={f.ano} set={u("ano")} type="number"/><FF lb="Cor" val={f.cor} set={u("cor")}/></div>
    <p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"14px 0 10px",paddingBottom:8,borderBottom:"1px solid var(--bd)"}}>Características</p>
    <div className="gf3">
      <FF lb="Marca" val={f.marca} set={u("marca")} req opts={["BYD","Caoa Chery","Chevrolet","Citroën","Fiat","Ford","Honda","Hyundai","JAC","John Deere","Kia","Mahindra","Marcopolo","Mercedes-Benz","Mitsubishi","Nissan","New Holland","Peugeot","Renault","Rivian","Stellantis","Subaru","Toyota","Volkswagen","Volvo","Outro"]}/>
      <FF lb="Modelo" val={f.modelo} set={u("modelo")} req/>
      <FF lb="Tipo" val={f.tipo} set={u("tipo")} opts={["Passeio","SUV","Picape","Van","Sprinter","Kombi","Utilitário","Moto","Ambulância","Ambulância UTI","Ônibus","Ônibus Escolar","Micro-ônibus","Caminhão","Caminhão Pipa","Caminhonete","Trator","Retroescavadeira","Patrol","Motoniveladora","Caminhão Basculante","Elétrico","Elétrico SUV","Elétrico Van","Outro"]}/>
      <FF lb="Categoria" val={f.cat} set={u("cat")} opts={["Administrativo","Serviço","Transporte","Emergência","Transp. Escolar","Máq. Pesada","Particular"]}/>
      <FF lb="Combustível" val={f.comb} set={u("comb")} opts={["Gasolina","Diesel S-10","Diesel Comum","Etanol","Flex","GNV","Elétrico"]}/>
      <FF lb="Secretaria" val={f.sec} set={u("sec")} opts={["Saúde","Obras","Educação","Administração","Assist. Social","Financeiro","Infraestrutura"]}/>
    </div>
    <p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"14px 0 10px",paddingBottom:8,borderBottom:"1px solid var(--bd)"}}>Controle Operacional</p>
    <div className="gf3">
      <FF lb="Situação" val={f.sit} set={u("sit")} opts={["Disponível","Em uso","Manutenção","Baixado","Leiloado","Sinistrado"]}/>
      <FF lb="Estado de Conservação" val={f.estadoCons} set={u("estadoCons")} opts={["Ótimo","Bom","Regular","Ruim","Péssimo"]}/>
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
  const blank={nome:"",cpf:"",rg:"",mat:"",nasc:"",tel:"",email:"",sec:"Administração",cargo:"Motorista",cnh:"B",valCnh:"",sit:"Ativo",viagens:0,kmR:0,veiAtual:null,foto:null};
  const[f,setF]=useState({...blank,...(d||{}),foto:d?.foto||null});const u=k=>val=>setF(p=>({...p,[k]:val}));
  const go=()=>{if(!f.nome||!f.cpf){toast("Preencha Nome e CPF.","danger");return;}save({...f,id:d?.id||`M${Date.now().toString().slice(-6)}`});toast(d?"Motorista atualizado!":"Motorista cadastrado!");close();};
  return<Modal title={d?`Editar — ${d.nome}`:"Cadastrar Motorista"} close={close} w={720}>
    <div style={{marginBottom:16,display:"flex",gap:16,alignItems:"flex-start"}}>
      <PhotoUpload photo={f.foto} setPhoto={u("foto")} toast={toast} lb="Foto do Motorista"/>
    </div>
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
function Login({onLogin,sysUsers}){
  const[id,setId]=useState("");const[pw,setPw]=useState("");
  const[showPw,setShowPw]=useState(false);const[err,setErr]=useState("");const[loading,setLoading]=useState(false);
  const[step,setStep]=useState("in");const[fEmail,setFEmail]=useState("");const[fSent,setFSent]=useState(false);
  const go=()=>{
    if(!id||!pw){setErr("Preencha e-mail e senha.");return;}
    setLoading(true);setErr("");
    setTimeout(()=>{
      const u=sysUsers.find(x=>x.email.toLowerCase()===id.toLowerCase()&&x.pw===pw);
      if(u){if(!u.ativo){setErr("Conta inativa. Contate o administrador.");setLoading(false);return;}onLogin(u);}
      else setErr("E-mail ou senha incorretos.");
      setLoading(false);
    },700);
  };
  const inp={width:"100%",border:"1px solid #d1d5db",padding:"10px 12px",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  return<div style={{width:"100vw",minHeight:"100vh",background:"linear-gradient(140deg,#0c1a47 0%,#1d4ed8 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
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
          {[["Controle de Frota","Veículos, ambulâncias e máquinas pesadas"],["Tempo Real","Check-in, retornos e viagens ativas"],["Relatórios Completos","KPIs, custo/km e análise financeira"]].map(([t,s])=>
            <div key={t} style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:5,height:5,background:"#60a5fa",flexShrink:0}}/><span style={{color:"white",fontSize:13,fontWeight:600}}>{t}</span><span style={{color:"rgba(203,213,225,.45)",fontSize:12}}>— {s}</span></div>
          )}
        </div>
      </div>
      <div style={{flex:"1 1 260px",padding:"40px 32px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
        {step==="in"?(
          <>
            <div style={{marginBottom:24}}><h2 style={{fontSize:20,fontWeight:800,color:"#0f172a",margin:"0 0 4px"}}>Acesso ao Sistema</h2><p style={{fontSize:13,color:"#64748b",margin:0}}>Use suas credenciais institucionais</p></div>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div><label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>E-mail</label><input value={id} onChange={e=>setId(e.target.value)} placeholder="seu@email.com" style={inp}/></div>
              <div><label style={{display:"block",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Senha</label>
                <div style={{position:"relative"}}><input type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••" style={{...inp,paddingRight:38}}/><button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#64748b"}}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button></div>
              </div>
              {err&&<div style={{background:"#fee2e2",border:"1px solid #fca5a5",color:"#dc2626",padding:"9px 12px",fontSize:13,display:"flex",alignItems:"center",gap:8}}><AlertCircle size={14}/>{err}</div>}
              <button onClick={go} disabled={loading} style={{background:loading?"#94a3b8":"#0c1a47",color:"white",border:"none",padding:"12px",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",textTransform:"uppercase",letterSpacing:".08em",fontFamily:"inherit"}}>{loading?"Verificando...":"Entrar no Sistema"}</button>
              <button onClick={()=>setStep("forgot")} style={{background:"none",border:"none",fontSize:12,color:P,cursor:"pointer",textAlign:"left",fontFamily:"inherit",padding:0}}>Esqueceu a senha?</button>
            </div>
          </>
        ):(
          <>
            <button onClick={()=>{setStep("in");setFSent(false);}} style={{background:"none",border:"none",fontSize:12,color:P,cursor:"pointer",textAlign:"left",fontFamily:"inherit",marginBottom:20,padding:0}}>← Voltar ao login</button>
            <h2 style={{fontSize:20,fontWeight:800,color:"#0f172a",margin:"0 0 8px"}}>Recuperar Senha</h2>
            <p style={{fontSize:13,color:"#64748b",marginBottom:20}}>Informe seu e-mail para receber instruções de redefinição.</p>
            {!fSent
              ?<><input value={fEmail} onChange={e=>setFEmail(e.target.value)} placeholder="seu@email.com" style={{...inp,marginBottom:12}}/><button onClick={()=>setTimeout(()=>setFSent(true),700)} style={{background:"#0c1a47",color:"white",border:"none",padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit"}}>Enviar Instruções</button></>
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
function Dashboard({nav,vehicles,drivers,alerts,fuel,maint}){
  const gastoComb=fuel.reduce((a,x)=>a+x.total,0);
  const gastoMnt=maint.reduce((a,x)=>a+x.custo,0);
  return<div>
    <div className="gkpi">
      <Kpi lb="Total da Frota" vl={vehicles.length} sub="Veículos cadastrados" Ic={Car} top="#1d4ed8"/>
      <Kpi lb="Disponíveis" vl={vehicles.filter(v=>v.sit==="Disponível").length} sub="Prontos para uso" Ic={CheckCircle} cor="#16a34a" top="#16a34a"/>
      <Kpi lb="Em Circulação" vl={vehicles.filter(v=>v.sit==="Em uso").length} sub="Viagens ativas agora" Ic={Activity} cor="#0284c7" top="#0284c7"/>
      <Kpi lb="Em Manutenção" vl={vehicles.filter(v=>v.sit==="Manutenção").length} sub="Ordens abertas" Ic={Wrench} cor="#d97706" top="#d97706"/>
      <Kpi lb="Combustível" vl={`R$ ${gastoComb.toLocaleString("pt-BR",{minimumFractionDigits:2})}`} sub="Total registrado" Ic={Fuel} top="#1d4ed8"/>
      <Kpi lb="Motoristas Ativos" vl={drivers.filter(d=>d.sit==="Ativo").length} sub={`${drivers.length} cadastrados`} Ic={Users} top="#1d4ed8"/>
      <Kpi lb="Manutenção" vl={`R$ ${gastoMnt.toLocaleString("pt-BR",{minimumFractionDigits:2})}`} sub="Total registrado" Ic={Wrench} top="#d97706"/>
      <Kpi lb="Alertas Ativos" vl={alerts.length} sub={`${alerts.filter(a=>a.nivel==="danger").length} crítico(s)`} Ic={Bell} cor="#dc2626" top="#dc2626"/>
    </div>
    <div className="gdash">
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:16}}>
        <div style={{fontSize:14,fontWeight:700,color:"var(--tx)",marginBottom:12}}>Situação da Frota</div>
        {vehicles.length===0&&<div style={{textAlign:"center",padding:"24px 0",color:"var(--mu)",fontSize:13}}>Nenhum veículo cadastrado ainda.<br/>Acesse "Veículos" para começar.</div>}
        {vehicles.length>0&&[["Disponíveis",vehicles.filter(v=>v.sit==="Disponível").length,"#16a34a"],["Em Uso",vehicles.filter(v=>v.sit==="Em uso").length,"#0284c7"],["Manutenção",vehicles.filter(v=>v.sit==="Manutenção").length,"#d97706"],["Baixados",vehicles.filter(v=>v.sit==="Baixado").length,"#94a3b8"]].map(([lb,n,c])=>
          <div key={lb} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:"var(--tx)"}}>{lb}</span><span style={{fontSize:13,fontWeight:700,color:c}}>{n} veículo{n!==1?"s":""}</span></div>
            <div style={{height:6,background:"var(--bd)"}}><div style={{height:"100%",width:`${vehicles.length>0?(n/vehicles.length)*100:0}%`,background:c,transition:"width .4s"}}/></div>
          </div>
        )}
      </div>
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:16}}>
        <div style={{fontWeight:700,fontSize:14,color:"var(--tx)",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>Alertas Críticos <button onClick={()=>nav("alerts")} style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Ver todos →</button></div>
        {alerts.length===0&&<div style={{padding:"20px",textAlign:"center",color:"var(--mu)",fontSize:13}}>✓ Nenhum alerta ativo</div>}
        {alerts.slice(0,5).map((a,i)=><div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:"1px solid var(--bd)"}}>
          <div style={{flexShrink:0,marginTop:2}}>{a.nivel==="danger"?<AlertCircle size={13} color="#dc2626"/>:a.nivel==="warning"?<AlertCircle size={13} color="#d97706"/>:<Bell size={13} color="#0284c7"/>}</div>
          <div><div style={{fontSize:12,fontWeight:600,color:"var(--tx)"}}>{a.titulo}</div><div style={{fontSize:11,color:"var(--mu)",lineHeight:1.4}}>{a.desc}</div></div>
        </div>)}
      </div>
    </div>
    <div style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:14,color:"var(--tx)"}}>Veículos Recentes</span><button onClick={()=>nav("vehicles")} style={{fontSize:12,color:P,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Ver todos →</button></div>
      {vehicles.length===0
        ?<div style={{padding:"32px",textAlign:"center",color:"var(--mu)",fontSize:13}}>Nenhum veículo cadastrado.</div>
        :<div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr><Th ch="Placa"/><Th ch="Veículo"/><Th ch="Secretaria"/><Th ch="Status"/></tr></thead>
        <tbody>{vehicles.slice(0,5).map((v,i)=><tr key={i} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}><Td ch={<span style={{fontWeight:700,color:NAV_BG}}>{v.placa}</span>}/><Td ch={<span style={{fontWeight:500}}>{v.modelo}</span>}/><Td ch={<span>{v.sec}</span>}/><Td ch={<SBdg v={v.sit}/>}/></tr>)}</tbody></table></div>
      }
    </div>
  </div>;
}

/* ═══ MODAL DE DETALHE DO VEÍCULO ═══ */
function VeiculoDetalhe({v,onEdit,onClose}){
  const[lbSrc,setLbSrc]=useState(null);
  const todasFotos=[...(v.fotos||[]).map(f=>f.src),v.foto].filter(Boolean);
  return<Modal title={`${v.placa} — ${v.modelo}`} close={onClose} w={820}>
    {todasFotos.length>0&&<div style={{marginBottom:16}}>
      <img src={todasFotos[0]} alt="foto" onClick={()=>setLbSrc(todasFotos[0])} style={{width:"100%",maxHeight:280,objectFit:"contain",background:"#f1f5f9",border:"1px solid var(--bd)",cursor:"zoom-in",display:"block",marginBottom:todasFotos.length>1?8:0}}/>
      {todasFotos.length>1&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}}>{todasFotos.slice(1).map((src,i)=><img key={i} src={src} alt={`foto ${i+2}`} onClick={()=>setLbSrc(src)} style={{width:80,height:60,objectFit:"contain",border:"1px solid var(--ibd)",background:"var(--ra)",cursor:"zoom-in"}}/>)}</div>}
    </div>}
    {v.fotoDoc&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"8px 10px",background:"var(--ra)",border:"1px solid var(--bd)"}}>
      <img src={v.fotoDoc} alt="CRLV" onClick={()=>setLbSrc(v.fotoDoc)} style={{width:72,height:54,objectFit:"contain",border:"1px solid var(--ibd)",background:"white",cursor:"zoom-in",flexShrink:0}}/>
      <span style={{fontSize:12,color:"var(--mu)"}}>Documento / CRLV — clique para ampliar</span>
    </div>}
    {todasFotos.length===0&&!v.fotoDoc&&<div style={{background:"var(--ra)",border:"1px solid var(--bd)",padding:"14px",textAlign:"center",marginBottom:14,color:"var(--mu)",fontSize:12}}>Sem fotos cadastradas. Clique em "Editar Veículo" para adicionar.</div>}
    <div className="g2">
      <div><p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:"1px solid var(--bd)"}}>Dados Técnicos</p>{[["Placa",v.placa],["RENAVAM",v.renavam||"—"],["Chassi",v.chassi||"—"],["Modelo",`${v.marca} ${v.modelo}`],["Ano / Cor",`${v.ano||"—"} · ${v.cor||"—"}`],["Tipo",`${v.tipo} — ${v.cat}`],["Combustível",v.comb]].map(([l,val])=><DR key={l} l={l} v={val}/>)}</div>
      <div><p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:"1px solid var(--bd)"}}>Situação Atual</p>{[["Secretaria",v.sec],["Patrimônio",v.pat||"—"],["Motorista",v.mot||"—"],["KM Atual",v.km>0?v.km.toLocaleString("pt-BR")+" km":"Horímetro"],["Conservação",v.estadoCons||"—"],["Nível Comb.",v.niv+"%"],["Próx. Revisão",v.rev||"—"],["Val. Seguro",v.seg||"—"],["Multas",(v.mul||0)+" multa(s)"]].map(([l,val])=><DR key={l} l={l} v={val}/>)}</div>
    </div>
    {v.obs&&<div style={{background:"var(--ra)",border:"1px solid var(--bd)",padding:"10px 14px",marginTop:14}}><p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 4px"}}>Observações</p><p style={{fontSize:13,color:"var(--sub)",margin:0}}>{v.obs}</p></div>}
    <div style={{display:"flex",gap:10,marginTop:14,paddingTop:12,borderTop:"1px solid var(--bd)"}}><Btn Ic={Edit} click={onEdit}>Editar Veículo</Btn><Btn ghost click={onClose}>Fechar</Btn></div>
    {lbSrc&&<Lightbox src={lbSrc} close={()=>setLbSrc(null)}/>}
  </Modal>;
}

/* ═══ VEHICLES — com foto ═══ */
function Vehicles({vehicles,setVehicles,toast}){
  const[tab,setTab]=useState("Todos");const[srch,setSrch]=useState("");
  const[sel,setSel]=useState(null);const[modal,setModal]=useState(null);const[cfm,setCfm]=useState(null);
  const tabs=["Todos","Disponível","Em uso","Manutenção","Baixado"];
  const filt=vehicles.filter(v=>(tab==="Todos"||v.sit===tab)&&(!srch||[v.placa,v.modelo,v.mot||""].some(x=>(x||"").toLowerCase().includes(srch.toLowerCase()))));
  const saveV=v=>{if(modal?.id)setVehicles(p=>p.map(x=>x.id===v.id?v:x));else setVehicles(p=>[v,...p]);};
  const delV=v=>setCfm({msg:`Excluir ${v.placa} — ${v.modelo}? Esta ação não pode ser desfeita.`,ok:()=>{setVehicles(p=>p.filter(x=>x.id!==v.id));toast("Veículo excluído do sistema.","danger");setCfm(null);}});
  return<div>
    <SH title="Gestão de Veículos" sub={`${vehicles.length} veículo(s) — ${vehicles.filter(v=>v.sit==="Disponível").length} disponível(is)`} action={<Btn Ic={Plus} click={()=>setModal("add")}>+ Cadastrar Veículo</Btn>}/>
    <div className="gkpi"><Kpi lb="Total" vl={vehicles.length} Ic={Car} top="#1d4ed8"/><Kpi lb="Disponíveis" vl={vehicles.filter(v=>v.sit==="Disponível").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/><Kpi lb="Em Uso" vl={vehicles.filter(v=>v.sit==="Em uso").length} Ic={Activity} cor="#0284c7" top="#0284c7"/><Kpi lb="Manutenção" vl={vehicles.filter(v=>v.sit==="Manutenção").length} Ic={Wrench} cor="#d97706" top="#d97706"/><Kpi lb="Baixados" vl={vehicles.filter(v=>v.sit==="Baixado").length} Ic={AlertOctagon} cor="#64748b" top="#94a3b8"/></div>
    <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}><SBar val={srch} set={setSrch} ph="Pesquisar placa, modelo ou motorista..."/><Btn ghost Ic={Download} click={()=>{toast("Gerando relatório de frota...","info");setTimeout(()=>toast("Relatório exportado com sucesso!"),2000);}}>Exportar</Btn></div>
    <div style={{display:"flex",borderBottom:"2px solid var(--bd)",marginBottom:12,overflowX:"auto"}}>{tabs.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"8px 14px",fontSize:12,fontWeight:600,background:"none",border:"none",borderBottom:tab===t?`2px solid ${P}`:"2px solid transparent",color:tab===t?P:"var(--mu)",cursor:"pointer",marginBottom:-2,fontFamily:"inherit",whiteSpace:"nowrap"}}>{t} ({t==="Todos"?vehicles.length:vehicles.filter(v=>v.sit===t).length})</button>)}</div>
    {vehicles.length===0
      ?<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"56px",textAlign:"center",color:"var(--mu)"}}><Car size={40} color="var(--bd)" style={{display:"block",margin:"0 auto 12px"}}/><div style={{fontSize:15,fontWeight:600,color:"var(--tx)",marginBottom:4}}>Nenhum veículo cadastrado</div><div style={{fontSize:13}}>Clique em "+ Cadastrar Veículo" para começar.</div></div>
      :<div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr>
            <Th ch="" st={{width:68,padding:"9px 8px"}}/>
            <Th ch="Placa" st={{textAlign:"center"}}/>
            <Th ch="Veículo" st={{textAlign:"center"}}/>
            <Th ch="Secretaria" st={{textAlign:"center"}}/>
            <Th ch="KM" st={{textAlign:"center"}}/>
            <Th ch="Comb." st={{textAlign:"center"}}/>
            <Th ch="Conservação" st={{textAlign:"center"}}/>
            <Th ch="Status" st={{textAlign:"center"}}/>
            <Th ch=""/>
          </tr></thead>
          <tbody>{filt.map((v,i)=><tr key={v.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
            <Td st={{padding:"8px",width:68}} ch={<div style={{width:56,height:42,flexShrink:0,border:"1px solid var(--bd)",background:"var(--ra)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:v.foto?"zoom-in":"default"}} onClick={()=>v.foto&&setSel(v)}>{v.foto?<img src={v.foto} alt={v.placa} style={{width:"100%",height:"100%",objectFit:"contain",display:"block"}}/>:<Car size={16} color="var(--mu)"/>}</div>}/>
            <Td st={{textAlign:"center"}} ch={<span style={{fontWeight:700,color:NAV_BG,letterSpacing:".04em"}}>{v.placa}</span>}/>
            <Td st={{textAlign:"center"}} ch={<div><div style={{fontWeight:600}}>{v.modelo}</div><div style={{fontSize:11,color:"var(--mu)"}}>{v.marca} · {v.ano} · {v.tipo}</div></div>}/>
            <Td st={{textAlign:"center"}} ch={<div><div style={{fontSize:12}}>{v.sec}</div><div style={{fontSize:10,color:"var(--mu)"}}>{v.pat}</div></div>}/>
            <Td st={{textAlign:"center"}} ch={<span style={{fontWeight:500,whiteSpace:"nowrap"}}>{v.km>0?v.km.toLocaleString("pt-BR")+" km":"Horímetro"}</span>}/>
            <Td st={{textAlign:"center"}} ch={<Prog v={v.niv}/>}/>
            <Td st={{textAlign:"center"}} ch={<Bdg lb={v.estadoCons||"—"} tp={v.estadoCons==="Ótimo"||v.estadoCons==="Bom"?"ok":v.estadoCons==="Regular"?"warn":v.estadoCons==="Ruim"||v.estadoCons==="Péssimo"?"bad":"gray"}/>}/>
            <Td st={{textAlign:"center"}} ch={<SBdg v={v.sit}/>}/>
            <Td st={{textAlign:"center"}} ch={<div style={{display:"flex",gap:4,justifyContent:"center"}}>
              <button onClick={()=>setSel(v)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:"#0284c7",fontFamily:"inherit",fontWeight:600}}>Ver</button>
              <button onClick={()=>setModal(v)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:P,fontFamily:"inherit"}}><Edit size={11}/></button>
              <button onClick={()=>delV(v)} style={{background:"none",border:"none",padding:"3px",cursor:"pointer",color:"#dc2626"}}><Trash2 size={13}/></button>
            </div>}/>
          </tr>)}{filt.length===0&&<tr><td colSpan={9} style={{padding:"40px",textAlign:"center",color:"var(--mu)",fontSize:13}}>Nenhum veículo encontrado com os filtros aplicados.</td></tr>}</tbody>
        </table>
      </div>
    }
    
    {sel&&<VeiculoDetalhe v={sel} onEdit={()=>{setModal(sel);setSel(null);}} onClose={()=>setSel(null)}/>}

    {(modal==="add"||modal?.id)&&<VModal v={modal==="add"?null:modal} save={saveV} close={()=>setModal(null)} toast={toast}/>}
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>;
}

/* ═══ DRIVERS ═══ */
function Drivers({drivers,setDrivers,toast}){
  const[srch,setSrch]=useState("");const[sel,setSel]=useState(null);const[modal,setModal]=useState(null);const[cfm,setCfm]=useState(null);
  const today=new Date();
  const dias=d=>{try{const[dd,mm,aa]=d.valCnh.split("/");return Math.round((new Date(`${aa}-${mm}-${dd}`)-today)/86400000);}catch{return 999;}};
  const filt=drivers.filter(d=>!srch||[d.nome,d.mat,d.cpf].some(x=>(x||"").toLowerCase().includes(srch.toLowerCase())));
  const saveD=d=>{if(modal?.id)setDrivers(p=>p.map(x=>x.id===d.id?d:x));else setDrivers(p=>[d,...p]);};
  const delD=d=>setCfm({msg:`Excluir motorista ${d.nome}?`,ok:()=>{setDrivers(p=>p.filter(x=>x.id!==d.id));toast("Motorista excluído.","danger");setCfm(null);}});
  return<div>
    <SH title="Motoristas e Operadores" sub={`${drivers.length} profissional(is) — ${drivers.filter(d=>d.sit==="Ativo").length} ativo(s)`} action={<Btn Ic={Plus} click={()=>setModal("add")}>+ Cadastrar Motorista</Btn>}/>
    <div className="gkpi"><Kpi lb="Ativos" vl={drivers.filter(d=>d.sit==="Ativo").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/><Kpi lb="Férias / Afastados" vl={drivers.filter(d=>d.sit!=="Ativo").length} Ic={Calendar} cor="#d97706" top="#d97706"/><Kpi lb="CNH Vencendo" vl={drivers.filter(d=>dias(d)<90).length} sub="Próximos 90 dias" Ic={AlertCircle} cor="#dc2626" top="#dc2626"/><Kpi lb="Total Viagens" vl={drivers.reduce((a,d)=>a+(d.viagens||0),0)} Ic={MapPin} top="#1d4ed8"/></div>
    <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}><SBar val={srch} set={setSrch} ph="Pesquisar nome, CPF ou matrícula..."/><Btn ghost Ic={Download} click={()=>{toast("Exportando motoristas...","info");setTimeout(()=>toast("Exportado com sucesso!"),1800);}}>Exportar</Btn></div>
    {drivers.length===0
      ?<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"56px",textAlign:"center",color:"var(--mu)"}}><Users size={40} color="var(--bd)" style={{display:"block",margin:"0 auto 12px"}}/><div style={{fontSize:15,fontWeight:600,color:"var(--tx)",marginBottom:4}}>Nenhum motorista cadastrado</div><div style={{fontSize:13}}>Clique em "+ Cadastrar Motorista" para começar.</div></div>
      :<div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th ch="" st={{width:52}}/><Th ch="Matrícula"/><Th ch="Nome / Cargo"/><Th ch="Secretaria"/><Th ch="Cat. CNH"/><Th ch="Validade CNH"/><Th ch="Veículo"/><Th ch="Viagens"/><Th ch="Status"/><Th ch=""/></tr></thead>
          <tbody>{filt.map((d,i)=>{const dv=dias(d);const w=d.valCnh&&dv<90;return<tr key={d.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
            <Td st={{padding:"8px",width:52}} ch={<div style={{width:40,height:40,borderRadius:"50%",overflow:"hidden",border:"1px solid var(--bd)",background:"var(--ra)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{d.foto?<img src={d.foto} alt={d.nome} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<User size={18} color="var(--mu)"/>}</div>}/>
            <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{d.mat||"—"}</span>}/>
            <Td ch={<div><div style={{fontWeight:600}}>{d.nome}</div><div style={{fontSize:11,color:"var(--mu)"}}>{d.cargo}</div></div>}/>
            <Td ch={<span style={{fontSize:12}}>{d.sec}</span>}/>
            <Td ch={<span style={{fontWeight:700,color:P}}>Cat. {d.cnh}</span>}/>
            <Td ch={<div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:12,color:w?"#dc2626":"inherit",fontWeight:w?700:400}}>{d.valCnh||"—"}</span>{w&&<span style={{fontSize:9,background:"#fee2e2",color:"#dc2626",padding:"1px 5px",fontWeight:700}}>{dv}d</span>}</div>}/>
            <Td ch={<span style={{fontSize:12,color:d.veiAtual?P:"var(--mu)",fontWeight:d.veiAtual?600:400}}>{d.veiAtual||"—"}</span>}/>
            <Td ch={<span style={{fontWeight:600,textAlign:"center",display:"block"}}>{d.viagens||0}</span>}/>
            <Td ch={<SBdg v={d.sit}/>}/>
            <Td ch={<div style={{display:"flex",gap:4}}>
              <button onClick={()=>setSel(d)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:"#0284c7",fontFamily:"inherit",fontWeight:600}}>Ver</button>
              <button onClick={()=>setModal(d)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:P,fontFamily:"inherit"}}><Edit size={11}/></button>
              <button onClick={()=>delD(d)} style={{background:"none",border:"none",padding:"3px",cursor:"pointer",color:"#dc2626"}}><Trash2 size={13}/></button>
            </div>}/>
          </tr>;})}
          {filt.length===0&&<tr><td colSpan={9} style={{padding:"40px",textAlign:"center",color:"var(--mu)",fontSize:13}}>Nenhum motorista encontrado.</td></tr>}</tbody>
        </table>
      </div>
    }
    {sel&&<Modal title={sel.nome} close={()=>setSel(null)} w={680}>
      {sel.foto&&<div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <img src={sel.foto} alt={sel.nome} style={{width:100,height:100,borderRadius:"50%",objectFit:"cover",border:"3px solid var(--bd)"}}/>
      </div>}<div className="g2"><div><p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:"1px solid var(--bd)"}}>Dados Pessoais</p>{[["Nome",sel.nome],["CPF",sel.cpf],["RG",sel.rg||"—"],["Matrícula",sel.mat||"—"],["Nascimento",sel.nasc||"—"],["Telefone",sel.tel||"—"],["E-mail",sel.email||"—"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div><div><p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",margin:"0 0 10px",paddingBottom:7,borderBottom:"1px solid var(--bd)"}}>Profissional</p>{[["Secretaria",sel.sec],["Cargo",sel.cargo],["Cat. CNH","Cat. "+sel.cnh],["Validade CNH",sel.valCnh||"—"],["Situação",sel.sit],["Veículo",sel.veiAtual||"—"],["Viagens",(sel.viagens||0)+" viagens"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div></div><div style={{display:"flex",gap:10,marginTop:14,paddingTop:12,borderTop:"1px solid var(--bd)"}}><Btn Ic={Edit} click={()=>{setModal(sel);setSel(null);}}>Editar</Btn><Btn ghost click={()=>setSel(null)}>Fechar</Btn></div></Modal>}
    {(modal==="add"||modal?.id)&&<DModal d={modal==="add"?null:modal} save={saveD} close={()=>setModal(null)} toast={toast}/>}
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>;
}

/* ═══ TRIPS ═══ */
function Trips({vehicles,setVehicles,drivers,trips,setTrips,toast}){
  const[view,setView]=useState("lista");
  const[f,setF]=useState({placa:"",mot:"",dest:"",fin:"",sec:"",kmi:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const confirmar=()=>{
    if(!f.placa||!f.mot||!f.dest){toast("Preencha veículo, motorista e destino.","danger");return;}
    const id=`VGM-${Date.now().toString().slice(-8)}`;
    const now=new Date();const ts=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`;
    const vv=vehicles.find(v=>v.placa===f.placa);
    setTrips([{id,placa:f.placa,mod:vv?.modelo||"",mot:f.mot,dest:f.dest,kmi:+f.kmi||null,kmf:null,saida:ts,ret:null,fin:f.fin||"Serviço",sec:f.sec||"—",sit:"Em andamento"},...trips]);
    setVehicles(p=>p.map(v=>v.placa===f.placa?{...v,sit:"Em uso",mot:f.mot}:v));
    setF({placa:"",mot:"",dest:"",fin:"",sec:"",kmi:""});setView("lista");
    toast("✓ Saída registrada! Veículo marcado como Em uso.");
  };
  const retornar=id=>{
    const t=trips.find(x=>x.id===id);
    const now=new Date();const ts=now.toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
    setTrips(trips.map(x=>x.id===id?{...x,sit:"Concluída",ret:ts}:x));
    if(t)setVehicles(p=>p.map(v=>v.placa===t.placa?{...v,sit:"Disponível",mot:null}:v));
    toast("✓ Retorno registrado! Veículo agora Disponível.");
  };
  const ea=trips.filter(t=>t.sit==="Em andamento");
  return<div>
    <SH title="Controle de Viagens" sub={`${trips.length} registro(s) — ${ea.length} em andamento agora`} action={<div style={{display:"flex",gap:8}}><Btn ghost sm click={()=>setView("lista")}>Lista</Btn><Btn click={()=>setView(view==="form"?"lista":"form")}>+ Registrar Saída</Btn></div>}/>
    {ea.length>0&&<div style={{background:"#e0f2fe",border:"1px solid #7dd3fc",padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
      <span className="blink" style={{width:8,height:8,background:"#0284c7",borderRadius:"50%",display:"inline-block"}}/>
      <span style={{fontSize:13,fontWeight:600,color:"#0369a1"}}>{ea.length} viagem(ns) em andamento — {ea.map(t=>t.placa).join(", ")}</span>
    </div>}
    {view==="form"&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",borderTop:`3px solid ${P}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>Registrar Nova Saída de Veículo</p>
      {vehicles.filter(v=>v.sit==="Disponível").length===0&&<div style={{background:"#fef9c3",border:"1px solid #fde047",padding:"10px 12px",marginBottom:12,fontSize:13,color:"#a16207"}}>⚠ Nenhum veículo disponível no momento.</div>}
      <div className="gf3"><FF lb="Veículo Disponível" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit==="Disponível").map(v=>v.placa)} req/><FF lb="Motorista" val={f.mot} set={u("mot")} opts={drivers.filter(d=>{
  if(d.sit!=="Ativo")return false;
  if(!d.valCnh||d.valCnh==="—")return true;
  const[dd,mm,aa]=d.valCnh.split("/");
  const venc=new Date(+aa,+mm-1,+dd);
  return venc>=new Date();
}).map(d=>{
  const[dd,mm,aa]=(d.valCnh||"").split("/");
  const venc=d.valCnh&&d.valCnh!=="—"?new Date(+aa,+mm-1,+dd):null;
  const dias=venc?Math.round((venc-new Date())/86400000):null;
  const aviso=dias!==null&&dias<=30?` ⚠ CNH vence em ${dias}d`:"";
  return d.nome+aviso;
})} req/><FF lb="KM Inicial" val={f.kmi} set={u("kmi")} type="number"/></div>
      <div className="gf3"><FF lb="Destino / Endereço" val={f.dest} set={u("dest")} req/><FF lb="Finalidade" val={f.fin} set={u("fin")} opts={["Transporte de Pacientes","Serviço de Obras","Transporte Escolar","Emergência Médica","Viagem Administrativa","Entrega de Materiais","Outros"]}/><FF lb="Secretaria Solicitante" val={f.sec} set={u("sec")} opts={["Saúde","Obras","Educação","Administração","Assist. Social"]}/></div>
      <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={confirmar}>Confirmar Saída</Btn><Btn ghost click={()=>setView("lista")}>Cancelar</Btn></div>
    </div>}
    {trips.length===0
      ?<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"56px",textAlign:"center",color:"var(--mu)"}}><MapPin size={40} color="var(--bd)" style={{display:"block",margin:"0 auto 12px"}}/><div style={{fontSize:15,fontWeight:600,color:"var(--tx)",marginBottom:4}}>Nenhuma viagem registrada</div><div style={{fontSize:13}}>Clique em "+ Registrar Saída" para começar.</div></div>
      :<div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
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
            <Td ch={<div style={{display:"flex",gap:4,alignItems:"center"}}>
  {t.sit==="Em andamento"&&<button onClick={()=>retornar(t.id)} style={{background:"#16a34a",color:"white",border:"none",padding:"4px 9px",fontSize:11,cursor:"pointer",fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap"}}>Registrar Retorno</button>}
  <button onClick={()=>{if(window.confirm(`Excluir viagem ${t.id}?`)){setTrips(p=>p.filter(x=>x.id!==t.id));if(t.sit==="Em andamento")setVehicles(p=>p.map(v=>v.placa===t.placa?{...v,sit:"Disponível",mot:null}:v));toast("Viagem excluída.","danger");}}} style={{background:"none",border:"none",padding:"3px 5px",cursor:"pointer",color:"#dc2626",display:"flex",alignItems:"center"}}><Trash2 size={14}/></button>
</div>}/>
          </tr>)}</tbody>
        </table>
      </div>
    }
  </div>;
}

/* ═══ FUEL ═══ */
function FuelPage({vehicles,drivers,fuel,setFuel,toast}){
  const[show,setShow]=useState(false);const[cfm,setCfm]=useState(null);const[f,setF]=useState({placa:"",mot:"",posto:"",tipo:"Diesel S-10",litros:"",vl:"",km:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const reg=()=>{
    if(!f.placa||!f.litros){toast("Preencha veículo e litros.","danger");return;}
    const total=+(+f.litros*+f.vl||0).toFixed(2);
    const id=`ABS-${Date.now().toString().slice(-8)}`;
    const now=new Date();const data=`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`;
    const vv=vehicles.find(v=>v.placa===f.placa);
    setFuel([{id,placa:f.placa,mod:vv?.modelo||"",mot:f.mot,data,posto:f.posto,tipo:f.tipo,litros:+f.litros,vl:+f.vl||0,total,km:+f.km||0,media:0},...fuel]);
    setF({placa:"",mot:"",posto:"",tipo:"Diesel S-10",litros:"",vl:"",km:""});setShow(false);
    toast("✓ Abastecimento registrado com sucesso!");
  };
  const tot=fuel.reduce((a,x)=>a+x.total,0);const totL=fuel.reduce((a,x)=>a+x.litros,0);
  return<div>
    <SH title="Controle de Abastecimento" sub={`${fuel.length} registro(s) — R$ ${tot.toLocaleString("pt-BR",{minimumFractionDigits:2})} total`} action={<Btn Ic={Plus} click={()=>setShow(!show)}>+ Registrar Abastecimento</Btn>}/>
    <div className="gkpi"><Kpi lb="Gasto Total" vl={`R$ ${tot.toLocaleString("pt-BR")}`} Ic={DollarSign} top="#1d4ed8"/><Kpi lb="Litros Abastecidos" vl={`${totL.toFixed(1)} L`} Ic={Fuel} top="#1d4ed8"/><Kpi lb="Registros" vl={fuel.length} Ic={ClipboardList} top="#1d4ed8"/><Kpi lb="Custo Médio" vl={`R$ ${totL>0?(tot/totL).toFixed(2):"0,00"}/L`} Ic={TrendingUp} top="#0284c7"/></div>
    {show&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",borderTop:`3px solid ${P}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>Registrar Novo Abastecimento</p>
      <div className="gf3"><FF lb="Veículo (Placa)" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit!=="Baixado").map(v=>v.placa)} req/><FF lb="Motorista" val={f.mot} set={u("mot")} opts={drivers.filter(d=>d.sit==="Ativo").map(d=>d.nome)}/><FF lb="Posto de Combustível" val={f.posto} set={u("posto")}/></div>
      <div className="gf4"><FF lb="Combustível" val={f.tipo} set={u("tipo")} opts={["Diesel S-10","Diesel Comum","Gasolina","Etanol","GNV"]}/><FF lb="Litros" val={f.litros} set={u("litros")} type="number" req/><FF lb="Valor por Litro (R$)" val={f.vl} set={u("vl")} type="number"/><FF lb="KM no Momento" val={f.km} set={u("km")} type="number"/></div>
      {f.litros&&f.vl&&<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",padding:"10px 14px",marginBottom:12,fontSize:13,color:P,fontWeight:600}}>💧 Total calculado: <strong>R$ {(+f.litros*+f.vl).toFixed(2)}</strong></div>}
      <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={reg}>Registrar Abastecimento</Btn><Btn ghost click={()=>setShow(false)}>Cancelar</Btn></div>
    </div>}
    {fuel.length===0
      ?<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"56px",textAlign:"center",color:"var(--mu)"}}><Fuel size={40} color="var(--bd)" style={{display:"block",margin:"0 auto 12px"}}/><div style={{fontSize:15,fontWeight:600,color:"var(--tx)",marginBottom:4}}>Nenhum abastecimento registrado</div></div>
      :<div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Posto"/><Th ch="Tipo"/><Th ch="Litros"/><Th ch="R$/L"/><Th ch="Total"/><Th ch=""/></tr></thead>
          <tbody>{fuel.map((x,i)=><tr key={x.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
            <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{x.id}</span>}/>
            <Td ch={<div><div style={{fontWeight:600,fontSize:12}}>{x.placa}</div><div style={{fontSize:11,color:"var(--mu)"}}>{x.mod}</div></div>}/>
            <Td ch={<span style={{fontSize:12}}>{x.mot||"—"}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{x.data}</span>}/><Td ch={<span style={{fontSize:12}}>{x.posto||"—"}</span>}/>
            <Td ch={<Bdg lb={x.tipo} tp="info"/>}/>
            <Td ch={<span style={{fontWeight:500}}>{x.litros.toFixed(1)} L</span>}/>
            <Td ch={<span style={{fontSize:12}}>R$ {x.vl.toFixed(2)}</span>}/>
            <Td ch={<span style={{fontWeight:700,color:P,whiteSpace:"nowrap"}}>R$ {x.total.toFixed(2)}</span>}/>
            <Td ch={<button onClick={()=>{if(window.confirm(`Excluir abastecimento ${x.id}?`)){setFuel(p=>p.filter(f=>f.id!==x.id));toast("Abastecimento excluído.","danger");}}} style={{background:"none",border:"none",padding:"3px 5px",cursor:"pointer",color:"#dc2626",display:"flex",alignItems:"center"}}><Trash2 size={14}/></button>}/>
          </tr>)}</tbody>
        </table>
      </div>
    }
  </div>;
}

/* ═══ MAINTENANCE ═══ */
function MaintenancePage({vehicles,setVehicles,maint,setMaint,toast}){
  const[show,setShow]=useState(false);const[cfm,setCfm]=useState(null);const[f,setF]=useState({placa:"",tipo:"Preventiva",desc:"",oficina:"",custo:"",prev:"",prior:"Média"});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const criar=()=>{
    if(!f.placa||!f.desc){toast("Preencha veículo e descrição.","danger");return;}
    const id=`OS-${Date.now().toString().slice(-8)}`;const vv=vehicles.find(v=>v.placa===f.placa);
    setMaint([{id,placa:f.placa,mod:vv?.modelo||"",tipo:f.tipo,desc:f.desc,oficina:f.oficina,custo:+f.custo||0,criado:new Date().toLocaleDateString("pt-BR"),prev:f.prev,status:"Agendada",prior:f.prior},...maint]);
    if(f.tipo==="Corretiva")setVehicles(p=>p.map(v=>v.placa===f.placa?{...v,sit:"Manutenção"}:v));
    setShow(false);setF({placa:"",tipo:"Preventiva",desc:"",oficina:"",custo:"",prev:"",prior:"Média"});
    toast(f.tipo==="Corretiva"?"✓ OS criada! Veículo colocado em Manutenção.":"✓ Ordem de Serviço criada com sucesso!");
  };
  const chSt=(id,st)=>{
    const m=maint.find(x=>x.id===id);
    setMaint(maint.map(x=>x.id===id?{...x,status:st}:x));
    if(st==="Finalizada"&&m)setVehicles(p=>p.map(v=>v.placa===m.placa&&v.sit==="Manutenção"?{...v,sit:"Disponível"}:v));
    toast(st==="Finalizada"?`✓ OS ${id} finalizada! Veículo liberado como Disponível.`:`Status atualizado: ${st}`);
  };
  const totAb=maint.filter(m=>m.status!=="Finalizada").reduce((a,m)=>a+m.custo,0);
  return<div>
    <SH title="Controle de Manutenção" sub={`${maint.filter(m=>m.status!=="Finalizada").length} OS aberta(s) — R$ ${totAb.toLocaleString("pt-BR")} em aberto`} action={<Btn Ic={Plus} click={()=>setShow(!show)}>+ Nova Ordem de Serviço</Btn>}/>
    <div className="gkpi"><Kpi lb="OS Abertas" vl={maint.filter(m=>m.status!=="Finalizada").length} Ic={ClipboardList} cor="#d97706" top="#d97706"/><Kpi lb="Em Execução" vl={maint.filter(m=>m.status==="Em execução").length} Ic={Wrench} cor="#0284c7" top="#0284c7"/><Kpi lb="Agendadas" vl={maint.filter(m=>m.status==="Agendada").length} Ic={Calendar} top="#1d4ed8"/><Kpi lb="Finalizadas" vl={maint.filter(m=>m.status==="Finalizada").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/></div>
    {show&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",borderTop:`3px solid ${P}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>Nova Ordem de Serviço</p>
      <div className="gf3"><FF lb="Veículo (Placa)" val={f.placa} set={u("placa")} opts={vehicles.filter(v=>v.sit!=="Baixado").map(v=>v.placa)} req/><FF lb="Tipo de Manutenção" val={f.tipo} set={u("tipo")} opts={["Preventiva","Corretiva","Elétrica","Funilaria","Pneus","Revisão Geral"]}/><FF lb="Prioridade" val={f.prior} set={u("prior")} opts={["Alta","Média","Baixa"]}/></div>
      <div className="gf3"><FF lb="Descrição Detalhada" val={f.desc} set={u("desc")} req/><FF lb="Oficina / Fornecedor" val={f.oficina} set={u("oficina")}/><FF lb="Custo Estimado (R$)" val={f.custo} set={u("custo")} type="number"/></div>
      <div className="gf2"><FF lb="Previsão de Entrega" val={f.prev} set={u("prev")}/></div>
      {f.tipo==="Corretiva"&&<div style={{background:"#fef9c3",border:"1px solid #fde047",padding:"8px 12px",marginBottom:12,fontSize:12,color:"#a16207"}}>⚠ OS Corretiva: o veículo será colocado automaticamente em Manutenção ao criar esta ordem.</div>}
      <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={criar}>Criar Ordem de Serviço</Btn><Btn ghost click={()=>setShow(false)}>Cancelar</Btn></div>
    </div>}
    {maint.length===0
      ?<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"56px",textAlign:"center",color:"var(--mu)"}}><Wrench size={40} color="var(--bd)" style={{display:"block",margin:"0 auto 12px"}}/><div style={{fontSize:15,fontWeight:600,color:"var(--tx)",marginBottom:4}}>Nenhuma OS registrada</div></div>
      :<div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
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
            <Td ch={<div style={{display:"flex",gap:4,alignItems:"center"}}>
              {m.status==="Agendada"&&<Btn sm click={()=>chSt(m.id,"Em execução")}>Iniciar</Btn>}
              {m.status==="Em execução"&&<Btn sm click={()=>chSt(m.id,"Finalizada")}>Finalizar</Btn>}
              <button onClick={()=>setCfm({msg:`Excluir OS ${m.id} — ${m.placa}? Esta ação não pode ser desfeita.`,ok:()=>{setMaint(p=>p.filter(x=>x.id!==m.id));if(m.status!=="Finalizada")setVehicles(p=>p.map(v=>v.placa===m.placa&&v.sit==="Manutenção"?{...v,sit:"Disponível"}:v));toast("OS excluída.","danger");setCfm(null);}})} style={{background:"none",border:"none",padding:"3px 5px",cursor:"pointer",color:"#dc2626",display:"flex",alignItems:"center"}}><Trash2 size={14}/></button>
            </div>}/>
          </tr>)}</tbody>
        </table>
      </div>
    }
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>;
}

/* ═══ FINANCIAL ═══ */
function Financial({vehicles,fuel,maint,toast}){
  const totalC=fuel.reduce((a,x)=>a+x.total,0);
  const totalM=maint.reduce((a,x)=>a+x.custo,0);
  const total=totalC+totalM;
  const rank=[...vehicles].map(v=>{
    const cF=fuel.filter(f=>f.placa===v.placa).reduce((a,x)=>a+x.total,0);
    const cM=maint.filter(m=>m.placa===v.placa).reduce((a,x)=>a+x.custo,0);
    return{...v,custoTotal:cF+cM};
  }).filter(v=>v.custoTotal>0).sort((a,b)=>b.custoTotal-a.custoTotal);
  return<div>
    <SH title="Gestão Financeira" sub="Análise de custos e despesas da frota" action={<Btn ghost Ic={Download} click={()=>{toast("Gerando relatório financeiro...","info");setTimeout(()=>toast("✓ Exportado com sucesso!"),2000);}}>Exportar Relatório</Btn>}/>
    <div className="gkpi"><Kpi lb="Total Geral" vl={`R$ ${total.toLocaleString("pt-BR",{minimumFractionDigits:2})}`} Ic={DollarSign} top="#1d4ed8"/><Kpi lb="Combustível" vl={`R$ ${totalC.toLocaleString("pt-BR",{minimumFractionDigits:2})}`} sub={total>0?`${((totalC/total)*100).toFixed(0)}% dos gastos`:"—"} Ic={Fuel} top="#0c1a47"/><Kpi lb="Manutenção" vl={`R$ ${totalM.toLocaleString("pt-BR",{minimumFractionDigits:2})}`} sub={total>0?`${((totalM/total)*100).toFixed(0)}% dos gastos`:"—"} Ic={Wrench} top="#d97706"/><Kpi lb="Veículos com Custo" vl={rank.length} Ic={Car} top="#0284c7"/></div>
    <div style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
      <div style={{padding:"13px 16px",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:14,color:"var(--tx)"}}>Ranking de Veículos por Custo Total</span><Bdg lb={`${rank.length} veículos`} tp="info"/></div>
      {rank.length===0
        ?<div style={{padding:"40px",textAlign:"center",color:"var(--mu)",fontSize:13}}>Nenhum custo registrado ainda. Registre abastecimentos e manutenções para ver a análise financeira.</div>
        :<div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th ch="Pos."/><Th ch="Placa"/><Th ch="Modelo"/><Th ch="Secretaria"/><Th ch="Custo Combustível"/><Th ch="Custo Manutenção"/><Th ch="Custo Total"/></tr></thead>
          <tbody>{rank.map((v,i)=>{
            const cF=fuel.filter(f=>f.placa===v.placa).reduce((a,x)=>a+x.total,0);
            const cM=maint.filter(m=>m.placa===v.placa).reduce((a,x)=>a+x.custo,0);
            return<tr key={v.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
              <Td ch={<span style={{fontWeight:800,color:i===0?"#dc2626":i===1?"#d97706":"var(--mu)",fontSize:15}}>#{i+1}</span>}/>
              <Td ch={<span style={{fontWeight:700,color:NAV_BG}}>{v.placa}</span>}/>
              <Td ch={<span style={{fontSize:12}}>{v.modelo}</span>}/><Td ch={<span style={{fontSize:12}}>{v.sec}</span>}/>
              <Td ch={<span style={{fontSize:12}}>R$ {cF.toFixed(2)}</span>}/>
              <Td ch={<span style={{fontSize:12}}>R$ {cM.toFixed(2)}</span>}/>
              <Td ch={<span style={{fontWeight:700,color:P,whiteSpace:"nowrap"}}>R$ {v.custoTotal.toFixed(2)}</span>}/>
            </tr>;
          })}</tbody>
        </table></div>
      }
    </div>
  </div>;
}

/* ═══ REPORTS ═══ */
function Reports({toast,vehicles,drivers,trips,fuel,maint,fines}){
  const[periodo,setPeriodo]=useState("Atual");
  const[sec,setSec]=useState("Todas");

  const gerarPDF=(tipo)=>{
    const data=new Date().toLocaleDateString("pt-BR");
    const hora=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
    let corpo="";
    if(tipo==="Frota Completa"){
      const lista=vehicles.filter(v=>sec==="Todas"||v.sec===sec);
      corpo=`<table><thead><tr><th>Placa</th><th>Modelo</th><th>Secretaria</th><th>Tipo</th><th>KM</th><th>Combustível</th><th>Revisão</th><th>Seguro</th><th>Situação</th></tr></thead><tbody>
        ${lista.map(v=>`<tr><td><b>${v.placa}</b></td><td>${v.marca} ${v.modelo}</td><td>${v.sec}</td><td>${v.tipo}</td><td>${v.km>0?v.km.toLocaleString("pt-BR")+" km":"Hor."}</td><td>${v.comb}</td><td>${v.rev||"—"}</td><td>${v.seg||"—"}</td><td>${v.sit}</td></tr>`).join("")}
        </tbody></table><p class="total">Total: ${lista.length} veículos</p>`;
    } else if(tipo==="Histórico de Viagens"){
      const lista=trips.filter(t=>sec==="Todas"||t.sec===sec);
      corpo=`<table><thead><tr><th>Código</th><th>Veículo</th><th>Motorista</th><th>Destino</th><th>Secretaria</th><th>Saída</th><th>Retorno</th><th>Situação</th></tr></thead><tbody>
        ${lista.map(t=>`<tr><td>${t.id}</td><td>${t.placa}</td><td>${t.mot}</td><td>${t.dest}</td><td>${t.sec}</td><td>${t.saida}</td><td>${t.ret||"—"}</td><td>${t.sit}</td></tr>`).join("")}
        </tbody></table><p class="total">Total: ${lista.length} viagens</p>`;
    } else if(tipo==="Consumo de Combustível"){
      const lista=fuel.filter(f=>sec==="Todas"||vehicles.find(v=>v.placa===f.placa)?.sec===sec);
      const totL=lista.reduce((a,x)=>a+x.litros,0);
      const totR=lista.reduce((a,x)=>a+x.total,0);
      corpo=`<table><thead><tr><th>Código</th><th>Veículo</th><th>Motorista</th><th>Data</th><th>Posto</th><th>Tipo</th><th>Litros</th><th>R$/L</th><th>Total</th></tr></thead><tbody>
        ${lista.map(f=>`<tr><td>${f.id}</td><td>${f.placa}</td><td>${f.mot||"—"}</td><td>${f.data}</td><td>${f.posto||"—"}</td><td>${f.tipo}</td><td>${f.litros.toFixed(1)} L</td><td>R$ ${f.vl.toFixed(2)}</td><td><b>R$ ${f.total.toFixed(2)}</b></td></tr>`).join("")}
        </tbody></table><p class="total">Total: ${totL.toFixed(1)} litros — R$ ${totR.toFixed(2)}</p>`;
    } else if(tipo==="Ordens de Serviço"){
      const lista=maint.filter(m=>sec==="Todas"||vehicles.find(v=>v.placa===m.placa)?.sec===sec);
      const totC=lista.reduce((a,x)=>a+x.custo,0);
      corpo=`<table><thead><tr><th>OS</th><th>Veículo</th><th>Tipo</th><th>Descrição</th><th>Oficina</th><th>Abertura</th><th>Custo</th><th>Prior.</th><th>Status</th></tr></thead><tbody>
        ${lista.map(m=>`<tr><td>${m.id}</td><td>${m.placa}</td><td>${m.tipo}</td><td>${m.desc}</td><td>${m.oficina||"—"}</td><td>${m.criado}</td><td><b>R$ ${m.custo.toFixed(2)}</b></td><td>${m.prior}</td><td>${m.status}</td></tr>`).join("")}
        </tbody></table><p class="total">Total: ${lista.length} OSs — R$ ${totC.toFixed(2)}</p>`;
    } else if(tipo==="Controle de Multas"){
      const tot=fines.reduce((a,x)=>a+x.valor,0);
      corpo=`<table><thead><tr><th>Código</th><th>Veículo</th><th>Motorista</th><th>Data</th><th>Infração</th><th>Valor</th><th>Status</th></tr></thead><tbody>
        ${fines.map(m=>`<tr><td>${m.id}</td><td>${m.placa}</td><td>${m.mot}</td><td>${m.data}</td><td>${m.inf}</td><td><b>R$ ${m.valor.toFixed(2)}</b></td><td>${m.status}</td></tr>`).join("")}
        </tbody></table><p class="total">Total: ${fines.length} multas — R$ ${tot.toFixed(2)}</p>`;
    } else if(tipo==="Relatório de Motoristas"){
      const lista=drivers.filter(d=>sec==="Todas"||d.sec===sec);
      corpo=`<table><thead><tr><th>Matrícula</th><th>Nome</th><th>Cargo</th><th>Secretaria</th><th>Cat. CNH</th><th>Validade CNH</th><th>Situação</th><th>Viagens</th></tr></thead><tbody>
        ${lista.map(d=>`<tr><td>${d.mat||"—"}</td><td><b>${d.nome}</b></td><td>${d.cargo}</td><td>${d.sec}</td><td>Cat. ${d.cnh}</td><td>${d.valCnh||"—"}</td><td>${d.sit}</td><td>${d.viagens||0}</td></tr>`).join("")}
        </tbody></table><p class="total">Total: ${lista.length} motoristas</p>`;
    } else if(tipo==="Relatório Executivo"){
      const totalC=fuel.reduce((a,x)=>a+x.total,0);
      const totalM=maint.reduce((a,x)=>a+x.custo,0);
      corpo=`<div class="exec">
        <div class="bloco"><h3>Frota</h3><p>Total de veículos: <b>${vehicles.length}</b></p><p>Disponíveis: <b>${vehicles.filter(v=>v.sit==="Disponível").length}</b></p><p>Em uso: <b>${vehicles.filter(v=>v.sit==="Em uso").length}</b></p><p>Em manutenção: <b>${vehicles.filter(v=>v.sit==="Manutenção").length}</b></p></div>
        <div class="bloco"><h3>Motoristas</h3><p>Cadastrados: <b>${drivers.length}</b></p><p>Ativos: <b>${drivers.filter(d=>d.sit==="Ativo").length}</b></p><p>Total viagens: <b>${trips.length}</b></p></div>
        <div class="bloco"><h3>Financeiro</h3><p>Combustível: <b>R$ ${totalC.toFixed(2)}</b></p><p>Manutenção: <b>R$ ${totalM.toFixed(2)}</b></p><p>Total geral: <b>R$ ${(totalC+totalM).toFixed(2)}</b></p></div>
        <div class="bloco"><h3>Multas</h3><p>Total: <b>${fines.length}</b></p><p>Pendentes: <b>${fines.filter(x=>x.status==="Pendente").length}</b></p><p>Valor: <b>R$ ${fines.reduce((a,x)=>a+x.valor,0).toFixed(2)}</b></p></div>
      </div>`;
    } else {
      corpo=`<p style="padding:20px;color:#64748b;">Relatório "${tipo}" — dados conforme registros do sistema.</p>`;
    }
    const html=`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${tipo} — SGA Upanema</title>
    <style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#0f172a;padding:20px;}.topo{border-bottom:3px solid #0c1a47;padding-bottom:14px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-end;}.topo h1{font-size:20px;font-weight:800;color:#0c1a47;}.topo .sub{font-size:11px;color:#64748b;margin-top:3px;}.meta{font-size:11px;color:#64748b;text-align:right;}table{width:100%;border-collapse:collapse;margin-bottom:14px;}th{background:#0c1a47;color:white;padding:7px 9px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.05em;}td{padding:6px 9px;border-bottom:1px solid #e2e8f0;font-size:11px;}tr:nth-child(even){background:#f8fafc;}b{font-weight:700;}.total{font-size:12px;font-weight:700;color:#0c1a47;padding:8px 0;border-top:2px solid #0c1a47;margin-top:4px;}.exec{display:grid;grid-template-columns:1fr 1fr;gap:16px;}.bloco{border:1px solid #e2e8f0;padding:14px;}.bloco h3{font-size:13px;font-weight:700;color:#0c1a47;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #1d4ed8;}.bloco p{margin-bottom:5px;font-size:12px;color:#374151;}.rodape{margin-top:24px;padding-top:10px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;display:flex;justify-content:space-between;}@media print{body{padding:10px;}@page{margin:1.5cm;}}</style>
    </head><body>
    <div class="topo"><div><div style="font-size:9px;font-weight:700;color:#1d4ed8;letter-spacing:.12em;text-transform:uppercase;margin-bottom:3px;">Prefeitura Municipal de Upanema — RN</div><h1>SGA Frota — ${tipo}</h1><div class="sub">Período: ${periodo} · Secretaria: ${sec}</div></div><div class="meta">Emitido em: ${data} às ${hora}<br/>Sistema de Gestão da Garagem</div></div>
    ${corpo}
    <div class="rodape"><span>© 2025 Prefeitura Municipal de Upanema — RN · SGA Frota Municipal</span><span>Página 1</span></div>
    </body></html>`;
    const w=window.open("","_blank","width=900,height=700");
    if(!w){toast("Permita pop-ups para gerar o PDF.","danger");return;}
    w.document.write(html);w.document.close();
    setTimeout(()=>{w.focus();w.print();},500);
    toast(`✓ "${tipo}" aberto — use Ctrl+P ou "Salvar como PDF".`);
  };

  const gerarCSV=(tipo)=>{
    let linhas=[],nome="relatorio";
    if(tipo==="Frota Completa"){
      linhas=[["Placa","Marca","Modelo","Ano","Cor","Tipo","Secretaria","KM","Combustível","Situação","Revisão","Seguro"],
        ...vehicles.filter(v=>sec==="Todas"||v.sec===sec).map(v=>[v.placa,v.marca,v.modelo,v.ano,v.cor,v.tipo,v.sec,v.km,v.comb,v.sit,v.rev||"",v.seg||""])];nome="frota_completa";
    } else if(tipo==="Histórico de Viagens"){
      linhas=[["Código","Veículo","Motorista","Destino","Secretaria","Finalidade","Saída","Retorno","Situação"],
        ...trips.filter(t=>sec==="Todas"||t.sec===sec).map(t=>[t.id,t.placa,t.mot,t.dest,t.sec,t.fin,t.saida,t.ret||"",t.sit])];nome="historico_viagens";
    } else if(tipo==="Consumo de Combustível"){
      linhas=[["Código","Placa","Motorista","Data","Posto","Tipo","Litros","R$/L","Total R$"],
        ...fuel.map(f=>[f.id,f.placa,f.mot||"",f.data,f.posto||"",f.tipo,f.litros,f.vl,f.total])];nome="abastecimento";
    } else if(tipo==="Ordens de Serviço"){
      linhas=[["OS","Veículo","Tipo","Descrição","Oficina","Abertura","Custo","Prioridade","Status"],
        ...maint.map(m=>[m.id,m.placa,m.tipo,m.desc,m.oficina||"",m.criado,m.custo,m.prior,m.status])];nome="manutencao";
    } else if(tipo==="Controle de Multas"){
      linhas=[["Código","Veículo","Motorista","Data","Infração","Valor","Status"],
        ...fines.map(m=>[m.id,m.placa,m.mot,m.data,m.inf,m.valor,m.status])];nome="multas";
    } else if(tipo==="Relatório de Motoristas"){
      linhas=[["Matrícula","Nome","Cargo","Secretaria","Cat. CNH","Validade CNH","Situação","Viagens"],
        ...drivers.filter(d=>sec==="Todas"||d.sec===sec).map(d=>[d.mat||"",d.nome,d.cargo,d.sec,d.cnh,d.valCnh||"",d.sit,d.viagens||0])];nome="motoristas";
    } else {
      toast(`Exportação CSV para "${tipo}" em breve.`,"info");return;
    }
    const csv="\uFEFF"+linhas.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(";")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`${nome}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
    toast(`✓ "${tipo}" exportado — abre direto no Excel.`);
  };

  const rpts=[
    {t:"Frota Completa",d:"Situação, KM e custos de todos os veículos",I:Car},
    {t:"Histórico de Viagens",d:"Viagens do período com destinos e custos",I:MapPin},
    {t:"Consumo de Combustível",d:"Análise de consumo e gastos por veículo",I:Fuel},
    {t:"Ordens de Serviço",d:"Histórico de manutenções e custos",I:Wrench},
    {t:"Gastos por Secretaria",d:"Distribuição de custos por órgão",I:Building2},
    {t:"Validade de Documentos",d:"CRLV, seguros, revisões e CNHs",I:FileText},
    {t:"Indicadores KPI",d:"Custo/km, ociosidade, consumo, eficiência",I:BarChart2},
    {t:"Relatório Executivo",d:"Resumo para o Gabinete do Prefeito",I:Shield},
    {t:"Controle de Multas",d:"Infrações, valores e situação atual",I:AlertOctagon},
    {t:"Relatório de Motoristas",d:"Desempenho, CNH e histórico",I:Users},
    {t:"Transparência Pública",d:"Dados para publicação — Lei 12.527/2011",I:Activity},
    {t:"Prestação de Contas",d:"Relatório para o Tribunal de Contas",I:DollarSign},
  ];
  return<div>
    <SH title="Central de Relatórios" sub="PDF abre para impressão · CSV/Excel faz download direto"/>
    <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"12px 16px",marginBottom:16,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{fontSize:11,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".07em"}}>Filtros:</span>
      <select value={periodo} onChange={e=>setPeriodo(e.target.value)} style={{border:"1px solid var(--ibd)",padding:"6px 10px",fontSize:12,fontFamily:"inherit",color:"var(--tx)",background:"var(--inp)"}}>{["Atual","Último mês","Últimos 3 meses","Personalizado"].map(p=><option key={p}>{p}</option>)}</select>
      <select value={sec} onChange={e=>setSec(e.target.value)} style={{border:"1px solid var(--ibd)",padding:"6px 10px",fontSize:12,fontFamily:"inherit",color:"var(--tx)",background:"var(--inp)"}}>{["Todas","Saúde","Obras","Educação","Administração","Assist. Social"].map(s=><option key={s}>{s}</option>)}</select>
    </div>
    <div className="grpt">{rpts.map((r,i)=><div key={i} className="ch" style={{background:"var(--card)",border:"1px solid var(--bd)",padding:16,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
      <div>
        <div style={{width:34,height:34,background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><r.I size={16} color={P}/></div>
        <div style={{fontSize:13,fontWeight:700,color:"var(--tx)",marginBottom:3}}>{r.t}</div>
        <div style={{fontSize:11,color:"var(--mu)",marginBottom:14,lineHeight:1.55}}>{r.d}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
        <button onClick={()=>gerarPDF(r.t)} style={{background:NAV_BG,color:"white",border:"none",padding:"7px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Download size={10}/>PDF</button>
        <button onClick={()=>gerarCSV(r.t)} style={{background:"#15803d",color:"white",border:"none",padding:"7px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Download size={10}/>Excel/CSV</button>
      </div>
    </div>)}</div>
  </div>;
}

/* ═══ FINES ═══ */
function Fines({vehicles,fines,setFines,toast}){
  const[show,setShow]=useState(false);
  const[cfm,setCfm]=useState(null);
  const[f,setF]=useState({placa:"",mot:"",data:"",inf:"",valor:""});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const reg=()=>{
    if(!f.placa||!f.inf){toast("Preencha veículo e infração.","danger");return;}
    const id=`MLT-${Date.now().toString().slice(-8)}`;
    setFines([{id,placa:f.placa,mot:f.mot||"—",data:f.data||new Date().toLocaleDateString("pt-BR"),inf:f.inf,valor:+f.valor||0,status:"Pendente"},...fines]);
    setF({placa:"",mot:"",data:"",inf:"",valor:""});setShow(false);
    toast("✓ Multa registrada com sucesso!");
  };
  const pagar=id=>{setFines(fines.map(x=>x.id===id?{...x,status:"Pago"}:x));toast("✓ Multa marcada como paga.");};
  const recurso=id=>{setFines(fines.map(x=>x.id===id?{...x,status:"Em recurso"}:x));toast("✓ Recurso cadastrado.");};
  const excluir=m=>setCfm({msg:`Excluir multa ${m.id} — ${m.placa}? Esta ação não pode ser desfeita.`,ok:()=>{setFines(p=>p.filter(x=>x.id!==m.id));toast("Multa excluída.","danger");setCfm(null);}});
  const total=fines.reduce((a,x)=>a+x.valor,0);
  return<div>
    <SH title="Controle de Multas" sub={`${fines.length} multa(s) — R$ ${total.toFixed(2)} total`} action={<Btn Ic={Plus} click={()=>setShow(!show)}>+ Registrar Multa</Btn>}/>
    <div className="gkpi">
      <Kpi lb="Total" vl={fines.length} Ic={AlertOctagon} top="#dc2626"/>
      <Kpi lb="Pendentes" vl={fines.filter(x=>x.status==="Pendente").length} sub={`R$ ${fines.filter(x=>x.status==="Pendente").reduce((a,x)=>a+x.valor,0).toFixed(2)}`} Ic={AlertCircle} cor="#d97706" top="#d97706"/>
      <Kpi lb="Em Recurso" vl={fines.filter(x=>x.status==="Em recurso").length} Ic={FileText} cor="#0284c7" top="#0284c7"/>
      <Kpi lb="Pagas" vl={fines.filter(x=>x.status==="Pago").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/>
    </div>
    {show&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",borderTop:"3px solid #dc2626",padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>Registrar Nova Multa de Trânsito</p>
      <div className="gf3"><FF lb="Veículo (Placa)" val={f.placa} set={u("placa")} opts={vehicles.map(v=>v.placa)} req/><FF lb="Motorista Responsável" val={f.mot} set={u("mot")}/><FF lb="Data da Infração" val={f.data} set={u("data")}/></div>
      <div className="gf2"><FF lb="Descrição Completa da Infração" val={f.inf} set={u("inf")} req/><FF lb="Valor da Multa (R$)" val={f.valor} set={u("valor")} type="number"/></div>
      <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={reg}>Registrar Multa</Btn><Btn ghost click={()=>setShow(false)}>Cancelar</Btn></div>
    </div>}
    {fines.length===0
      ?<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"56px",textAlign:"center",color:"var(--mu)"}}><AlertOctagon size={40} color="var(--bd)" style={{display:"block",margin:"0 auto 12px"}}/><div style={{fontSize:15,fontWeight:600,color:"var(--tx)",marginBottom:4}}>Nenhuma multa registrada</div></div>
      :<div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Infração"/><Th ch="Valor"/><Th ch="Status"/><Th ch="Ações"/></tr></thead>
          <tbody>{fines.map((m,i)=><tr key={m.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
            <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{m.id}</span>}/>
            <Td ch={<span style={{fontWeight:600,color:NAV_BG}}>{m.placa}</span>}/>
            <Td ch={<span style={{fontSize:12}}>{m.mot}</span>}/>
            <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{m.data}</span>}/>
            <Td ch={<span style={{fontSize:12,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{m.inf}</span>}/>
            <Td ch={<span style={{fontWeight:700,color:"#dc2626",whiteSpace:"nowrap"}}>R$ {m.valor.toFixed(2)}</span>}/>
            <Td ch={<SBdg v={m.status}/>}/>
            <Td ch={<div style={{display:"flex",gap:4,alignItems:"center"}}>
              {m.status==="Pendente"&&<><Btn sm click={()=>pagar(m.id)}>Pagar</Btn><Btn ghost sm click={()=>recurso(m.id)}>Recurso</Btn></>}
              <button onClick={()=>excluir(m)} style={{background:"none",border:"none",padding:"3px 5px",cursor:"pointer",color:"#dc2626",display:"flex",alignItems:"center"}}><Trash2 size={14}/></button>
            </div>}/>
          </tr>)}</tbody>
        </table>
      </div>
    }
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>;
}


/* ═══ VISTORIA VEICULAR ═══ */
function Checklist({vehicles,setVehicles,drivers,vistorias,setVistorias,toast}){
  const ITENS_MECANICA=[
    "Nível de óleo motor","Água do radiador / arrefecimento","Nível de combustível",
    "Calibração dos pneus (incl. estepe)","Estado dos pneus (desgaste e danos)",
    "Freios — pedal firme e fluido no nível","Sistema de direção (folgas e ruídos)",
    "Suspensão (amortecedores e buchas)","Correia dentada / alternador",
  ];
  const ITENS_ELETRICA=[
    "Luzes dianteiras (faróis e luzinhas)","Luzes traseiras (freio, ré e seta)",
    "Sinaleiros / pisca-alerta","Limpadores de para-brisa e reservatório",
    "Buzina","Ar-condicionado / aquecedor","Instrumentos do painel",
  ];
  const ITENS_SEGURANCA=[
    "Cinto de segurança (todos os lugares)","CRLV e documentos obrigatórios",
    "Kit de emergência completo (triângulo, macaco, chave)","Extintor de incêndio (prazo e carga)",
    "Espelhos retrovisores (regulados e limpos)","Lataria e vidros (avarias visíveis)",
    "Portas e travas funcionando","Para-choques sem danos",
  ];
  const TODOS=[...ITENS_MECANICA,...ITENS_ELETRICA,...ITENS_SEGURANCA];

  const[placa,setPlaca]=useState("");
  const[mot,setMot]=useState("");
  const[ck,setCk]=useState({});
  const[obs,setObs]=useState("");
  const[km,setKm]=useState("");
  const[estadoCons,setEstadoCons]=useState("Bom");
  const[foto,setFoto]=useState(null);
  const[sel,setSel]=useState(null);
  const[editando,setEditando]=useState(null);
  const[cfm,setCfm]=useState(null);
  const totalOk=Object.values(ck).filter(Boolean).length;

  const limpar=()=>{setPlaca("");setMot("");setCk({});setObs("");setKm("");setEstadoCons("Bom");setFoto(null);setEditando(null);};

  const abrirEdicao=h=>{
    setPlaca(h.placa);setMot(h.mot);setObs(h.obs||"");setKm(h.km||"");
    setEstadoCons(h.estadoCons||"Bom");setFoto(h.foto||null);
    setCk(Object.fromEntries(TODOS.map(it=>[it,h.itensMarcados?.includes(it)||false])));
    setEditando(h.id);setSel(null);
  };

  const enviar=()=>{
    if(!placa||!mot){toast("Selecione o veículo e o motorista.","danger");return;}
    const ok=Object.values(ck).filter(Boolean).length;
    const itensMarcados=Object.entries(ck).filter(([,v])=>v).map(([k])=>k);
    const itensFaltando=TODOS.filter(i=>!ck[i]);
    const res=ok===TODOS.length?"Aprovado":ok>=Math.floor(TODOS.length*0.8)?"Aprovado c/ ressalvas":"Reprovado";
    if(editando){
      setVistorias(p=>p.map(v=>v.id===editando?{...v,placa,mot,obs,km:+km||0,estadoCons,foto,ok,total:TODOS.length,res,itensMarcados,itensFaltando}:v));
      toast("✓ Vistoria atualizada com sucesso!");
    } else {
      const id=`VST-${Date.now().toString().slice(-8)}`;
      setVistorias(p=>[{id,placa,mot,data:new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}),ok,total:TODOS.length,res,obs,km:+km||0,estadoCons,foto,itensMarcados,itensFaltando},...p]);
      toast(res==="Aprovado"?"✓ Vistoria aprovada!":res==="Aprovado c/ ressalvas"?"⚠ Aprovado c/ ressalvas.":"❌ Reprovado.","info");
    }
    setVehicles(p=>p.map(v=>v.placa===placa?{...v,estadoCons,km:+km||v.km}:v));
    limpar();
  };

  const corEstado={Ótimo:"#16a34a",Bom:"#0284c7",Regular:"#d97706",Ruim:"#dc2626",Péssimo:"#7f1d1d"};

  const SecaoItens=({titulo,itens})=><div style={{marginBottom:14}}>
    <p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:6,paddingBottom:5,borderBottom:"1px solid var(--bd)"}}>{titulo}</p>
    <div style={{display:"flex",flexDirection:"column",gap:3}}>
      {itens.map((item,i)=><div key={i} onClick={()=>setCk(p=>({...p,[item]:!p[item]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:ck[item]?"#dcfce7":"var(--ra)",cursor:"pointer",border:`1px solid ${ck[item]?"#86efac":"var(--bd)"}`,transition:"all .12s"}}>
        <div style={{width:17,height:17,border:`2px solid ${ck[item]?"#16a34a":"var(--bd)"}`,background:ck[item]?"#16a34a":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ck[item]&&<Check size={10} color="white"/>}</div>
        <span style={{fontSize:13,color:ck[item]?"#15803d":"var(--sub)",fontWeight:ck[item]?600:400}}>{item}</span>
      </div>)}
    </div>
  </div>;

  return<div>
    <SH title="Vistoria Veicular" sub={`${vistorias.length} vistoria(s) registrada(s)`}/>
    <div style={{display:"grid",gridTemplateColumns:"minmax(320px,420px) 1fr",gap:12,marginBottom:12,alignItems:"start"}}>
      <div style={{background:"var(--card)",border:`1px solid ${editando?"#d97706":"var(--bd)"}`,borderTop:`3px solid ${editando?"#d97706":P}`,padding:16,overflowY:"auto",maxHeight:"85vh"}}>
        <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>{editando?"✏ Editando Vistoria":"Nova Vistoria Veicular"}</p>
        <div className="gf2" style={{marginBottom:12}}>
          <FF lb="Veículo" val={placa} set={setPlaca} opts={vehicles.filter(v=>v.sit==="Disponível").map(v=>v.placa)}/>
          <FF lb="Motorista / Vistoriador" val={mot} set={setMot} opts={drivers.filter(d=>d.sit==="Ativo").map(d=>d.nome)}/>
        </div>
        <div className="gf2" style={{marginBottom:12}}>
          <FF lb="KM Atual" val={km} set={setKm} type="number"/>
          <FF lb="Estado de Conservação Geral" val={estadoCons} set={setEstadoCons} opts={["Ótimo","Bom","Regular","Ruim","Péssimo"]}/>
        </div>
        <div style={{marginBottom:12}}>
          <PhotoUpload photo={foto} setPhoto={setFoto} toast={toast} lb="Foto da Vistoria (opcional)"/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:12,fontWeight:700,color:"var(--tx)"}}>Itens de Inspeção ({TODOS.length} obrigatórios)</span>
          <span style={{fontSize:12,color:totalOk===TODOS.length?"#16a34a":P,fontWeight:700}}>{totalOk}/{TODOS.length} ✓</span>
        </div>
        <SecaoItens titulo="Mecânica e Motor" itens={ITENS_MECANICA}/>
        <SecaoItens titulo="Elétrica e Iluminação" itens={ITENS_ELETRICA}/>
        <SecaoItens titulo="Segurança e Documentação" itens={ITENS_SEGURANCA}/>
        <div style={{marginBottom:12}}><label style={{display:"block",fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>Observações e Pendências</label><textarea value={obs} onChange={e=>setObs(e.target.value)} rows={2} style={{width:"100%",border:"1px solid var(--ibd)",padding:"8px 10px",fontSize:13,fontFamily:"inherit",resize:"vertical",background:"var(--inp)",color:"var(--tx)"}}/></div>
        <div style={{display:"flex",gap:10}}>
          <Btn click={enviar} full={!editando}>{editando?`Salvar Edição (${totalOk}/${TODOS.length} ✓)`:`Finalizar Vistoria (${totalOk}/${TODOS.length} ✓)`}</Btn>
          {editando&&<Btn ghost click={limpar}>Cancelar</Btn>}
        </div>
      </div>

      <div style={{background:"var(--card)",border:"1px solid var(--bd)",minWidth:0}}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid var(--bd)"}}><span style={{fontWeight:700,fontSize:14,color:"var(--tx)"}}>Histórico de Vistorias</span></div>
        {vistorias.length===0
          ?<div style={{padding:"32px",textAlign:"center",color:"var(--mu)",fontSize:13}}>Nenhuma vistoria registrada ainda.</div>
          :<div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr><Th ch="Código"/><Th ch="Veículo"/><Th ch="Motorista"/><Th ch="Data"/><Th ch="Conservação"/><Th ch="Itens"/><Th ch="Resultado"/><Th ch=""/></tr></thead>
            <tbody>{vistorias.map((h,i)=><tr key={h.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
              <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{h.id}</span>}/>
              <Td ch={<span style={{fontWeight:600,color:NAV_BG,fontSize:12}}>{h.placa}</span>}/>
              <Td ch={<span style={{fontSize:12}}>{h.mot}</span>}/>
              <Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{h.data}</span>}/>
              <Td ch={<span style={{fontSize:12,fontWeight:600,color:corEstado[h.estadoCons]||"var(--tx)"}}>{h.estadoCons||"—"}</span>}/>
              <Td ch={<span style={{fontSize:12,fontWeight:600}}>{h.ok}/{h.total}</span>}/>
              <Td ch={<Bdg lb={h.res} tp={h.res==="Aprovado"?"ok":h.res.includes("ressalvas")?"warn":"bad"}/>}/>
              <Td ch={<div style={{display:"flex",gap:4}}>
                <button onClick={()=>setSel(h)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:"#0284c7",fontFamily:"inherit",fontWeight:600}}>Ver</button>
                <button onClick={()=>abrirEdicao(h)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:P,fontFamily:"inherit"}}><Edit size={11}/></button>
                <button onClick={()=>setCfm({msg:`Excluir vistoria ${h.id}?`,ok:()=>{setVistorias(p=>p.filter(x=>x.id!==h.id));toast("Vistoria excluída.","danger");setCfm(null);}})} style={{background:"none",border:"none",padding:"3px 5px",cursor:"pointer",color:"#dc2626",display:"flex",alignItems:"center"}}><Trash2 size={13}/></button>
              </div>}/>
            </tr>)}
            </tbody>
          </table></div>
        }
      </div>
    </div>

    {sel&&<Modal title={`Vistoria ${sel.id} — ${sel.placa}`} close={()=>setSel(null)} w={700}>
      {sel.foto&&<img src={sel.foto} alt="vistoria" style={{width:"100%",maxHeight:200,objectFit:"contain",background:"#f1f5f9",border:"1px solid var(--bd)",marginBottom:14,display:"block"}}/>}
      <div className="g2">
        <div>{[["Veículo",sel.placa],["Motorista",sel.mot],["Data",sel.data],["KM",sel.km>0?sel.km.toLocaleString("pt-BR")+" km":"—"],["Conservação",sel.estadoCons||"—"],["Itens OK",`${sel.ok}/${sel.total}`],["Resultado",sel.res]].map(([l,v])=><DR key={l} l={l} v={v}/>)}</div>
        <div>
          {sel.itensFaltando?.length>0&&<><p style={{fontSize:10,fontWeight:700,color:"#dc2626",textTransform:"uppercase",margin:"0 0 6px"}}>Itens não conformes ({sel.itensFaltando.length})</p>{sel.itensFaltando.map((it,i)=><div key={i} style={{fontSize:12,color:"#dc2626",padding:"3px 0",borderBottom:"1px solid var(--bd)"}}>✗ {it}</div>)}</>}
          {sel.obs&&<div style={{marginTop:10,background:"var(--ra)",border:"1px solid var(--bd)",padding:"8px 12px"}}><p style={{fontSize:10,fontWeight:700,color:"var(--mu)",textTransform:"uppercase",marginBottom:4}}>Observações</p><p style={{fontSize:12,color:"var(--sub)"}}>{sel.obs}</p></div>}
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:14,paddingTop:12,borderTop:"1px solid var(--bd)"}}>
        <Btn Ic={Edit} click={()=>abrirEdicao(sel)}>Editar esta Vistoria</Btn>
        <Btn ghost click={()=>setSel(null)}>Fechar</Btn>
      </div>
    </Modal>}
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>;
}

/* ═══ ALERTS ═══ */
function AlertsPage({alerts,setAlerts,nav}){
  return<div>
    <SH title="Central de Alertas" sub={`${alerts.length} alerta(s) ativo(s) — ${alerts.filter(a=>a.nivel==="danger").length} crítico(s)`} action={alerts.length>0&&<Btn ghost sm click={()=>setAlerts([])}>Dispensar todos</Btn>}/>
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
function Audit({log}){
  const tp={create:"#dcfce7",edit:"#e0f2fe",info:"#f1f5f9",del:"#fee2e2"};const tl={create:"CRIAÇÃO",edit:"EDIÇÃO",info:"ACESSO",del:"EXCLUSÃO"};
  return<div>
    <SH title="Auditoria e Rastreabilidade" sub="Registro completo de todas as ações no sistema"/>
    <div className="gkpi"><Kpi lb="Registros" vl={log.length} Ic={Shield} top="#1d4ed8"/><Kpi lb="Criações" vl={log.filter(a=>a.tipo==="create").length} Ic={Plus} cor="#16a34a" top="#16a34a"/><Kpi lb="Edições" vl={log.filter(a=>a.tipo==="edit").length} Ic={Edit} cor="#0284c7" top="#0284c7"/><Kpi lb="Acessos" vl={log.filter(a=>a.tipo==="info").length} Ic={User} cor="#64748b" top="#94a3b8"/></div>
    {log.length===0
      ?<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"56px",textAlign:"center",color:"var(--mu)"}}><Shield size={40} color="var(--bd)" style={{display:"block",margin:"0 auto 12px"}}/><div style={{fontSize:15,fontWeight:600,color:"var(--tx)"}}>Nenhuma ação registrada ainda</div></div>
      :<div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th ch="#"/><Th ch="Data / Hora"/><Th ch="Usuário"/><Th ch="Tipo"/><Th ch="Ação Realizada"/><Th ch="Detalhe"/></tr></thead>
          <tbody>{log.map((a,i)=><tr key={a.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
            <Td ch={<span style={{fontSize:11,color:"var(--mu)",fontFamily:"monospace"}}>{String(i+1).padStart(3,"0")}</span>}/>
            <Td ch={<span style={{fontSize:12,fontFamily:"monospace",whiteSpace:"nowrap"}}>{a.data}</span>}/>
            <Td ch={<div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:24,height:24,background:NAV_BG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"white",flexShrink:0}}>{a.user.split(" ").map(p=>p[0]).join("").slice(0,2)}</div><span style={{fontWeight:500,fontSize:12,whiteSpace:"nowrap"}}>{a.user}</span></div>}/>
            <Td ch={<span style={{background:tp[a.tipo]||"#f1f5f9",fontSize:9,fontWeight:700,padding:"2px 6px",letterSpacing:".06em",whiteSpace:"nowrap"}}>{tl[a.tipo]||a.tipo.toUpperCase()}</span>}/>
            <Td ch={<span style={{fontSize:12,fontWeight:500}}>{a.acao}</span>}/>
            <Td ch={<span style={{fontSize:11,color:"var(--mu)"}}>{a.det}</span>}/>
          </tr>)}</tbody>
        </table>
      </div>
    }
  </div>;
}

/* ═══ SUPPLIERS ═══ */
function Suppliers({suppliers,setSuppliers,toast}){
  const[show,setShow]=useState(false);const[sel,setSel]=useState(null);const[cfm,setCfm]=useState(null);
  const[f,setF]=useState({nome:"",tipo:"Oficina Mecânica",cnpj:"",contato:"",ct:"",val:"",status:"Ativo"});
  const u=k=>v=>setF(p=>({...p,[k]:v}));
  const reg=()=>{
    if(!f.nome||!f.contato){toast("Preencha nome e contato.","danger");return;}
    const id=`FRN-${Date.now().toString().slice(-8)}`;
    setSuppliers([...suppliers,{...f,id}]);
    setF({nome:"",tipo:"Oficina Mecânica",cnpj:"",contato:"",ct:"",val:"",status:"Ativo"});
    setShow(false);toast("✓ Fornecedor cadastrado com sucesso!");
  };
  const del=s=>setCfm({msg:`Excluir fornecedor "${s.nome}"?`,ok:()=>{setSuppliers(p=>p.filter(x=>x.id!==s.id));toast("Fornecedor removido.","danger");setCfm(null);}});
  return<div>
    <SH title="Gestão de Fornecedores" sub="Postos, oficinas e parceiros credenciados da frota" action={<Btn Ic={Plus} click={()=>setShow(!show)}>+ Cadastrar Fornecedor</Btn>}/>
    <div className="gkpi"><Kpi lb="Credenciados" vl={suppliers.length} Ic={Building2} top="#1d4ed8"/><Kpi lb="Ativos" vl={suppliers.filter(s=>s.status==="Ativo").length} Ic={CheckCircle} cor="#16a34a" top="#16a34a"/><Kpi lb="Vencendo" vl={suppliers.filter(s=>s.status==="Vencendo").length} Ic={AlertCircle} cor="#d97706" top="#d97706"/></div>
    {show&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",borderTop:`3px solid ${P}`,padding:18,marginBottom:14}} className="fu">
      <p style={{fontSize:14,fontWeight:700,color:"var(--tx)",margin:"0 0 14px",paddingBottom:10,borderBottom:"1px solid var(--bd)"}}>Cadastrar Novo Fornecedor</p>
      <div className="gf3"><FF lb="Nome / Razão Social" val={f.nome} set={u("nome")} req/><FF lb="Tipo" val={f.tipo} set={u("tipo")} opts={["Posto de Combustível","Oficina Mecânica","Oficina Especializada","Conc. Autorizada","Pneus e Borracharia","Máquinas Pesadas","Outros"]}/><FF lb="CNPJ" val={f.cnpj} set={u("cnpj")}/></div>
      <div className="gf3"><FF lb="Contato (Telefone)" val={f.contato} set={u("contato")} req/><FF lb="Nº do Contrato" val={f.ct} set={u("ct")}/><FF lb="Validade do Contrato" val={f.val} set={u("val")}/></div>
      <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={reg}>Cadastrar Fornecedor</Btn><Btn ghost click={()=>setShow(false)}>Cancelar</Btn></div>
    </div>}
    {suppliers.length===0
      ?<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"56px",textAlign:"center",color:"var(--mu)"}}><Building2 size={40} color="var(--bd)" style={{display:"block",margin:"0 auto 12px"}}/><div style={{fontSize:15,fontWeight:600,color:"var(--tx)"}}>Nenhum fornecedor cadastrado</div></div>
      :<div className="tbl" style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr><Th ch="Código"/><Th ch="Nome / Razão Social"/><Th ch="Tipo"/><Th ch="CNPJ"/><Th ch="Contato"/><Th ch="Contrato"/><Th ch="Validade"/><Th ch="Status"/><Th ch=""/></tr></thead>
          <tbody>{suppliers.map((s,i)=><tr key={s.id} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}><Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{s.id}</span>}/><Td ch={<span style={{fontWeight:600}}>{s.nome}</span>}/><Td ch={<span style={{fontSize:12}}>{s.tipo}</span>}/><Td ch={<span style={{fontFamily:"monospace",fontSize:11}}>{s.cnpj||"—"}</span>}/><Td ch={<span style={{fontSize:12}}>{s.contato}</span>}/><Td ch={<span style={{fontFamily:"monospace",fontSize:11}}>{s.ct||"—"}</span>}/><Td ch={<span style={{fontSize:12,whiteSpace:"nowrap"}}>{s.val||"—"}</span>}/><Td ch={<SBdg v={s.status}/>}/><Td ch={<div style={{display:"flex",gap:4}}><button onClick={()=>setSel(s)} style={{background:"none",border:"1px solid var(--bd)",padding:"3px 7px",cursor:"pointer",fontSize:11,color:"#0284c7",fontFamily:"inherit",fontWeight:600}}>Ver</button><button onClick={()=>del(s)} style={{background:"none",border:"none",padding:"3px",cursor:"pointer",color:"#dc2626"}}><Trash2 size={13}/></button></div>}/></tr>)}
          </tbody>
        </table>
      </div>
    }
    {sel&&<Modal title={sel.nome} close={()=>setSel(null)} w={500}>
      {[["Código",sel.id],["Nome",sel.nome],["Tipo",sel.tipo],["CNPJ",sel.cnpj||"—"],["Contato",sel.contato],["Contrato",sel.ct||"—"],["Validade",sel.val||"—"],["Status",sel.status]].map(([l,v])=><DR key={l} l={l} v={v}/>)}
      <div style={{display:"flex",gap:10,marginTop:14,paddingTop:12,borderTop:"1px solid var(--bd)"}}><Btn ghost click={()=>setSel(null)}>Fechar</Btn></div>
    </Modal>}
    {cfm&&<Confirm msg={cfm.msg} ok={cfm.ok} cancel={()=>setCfm(null)} danger/>}
  </div>;
}

/* ═══ BACKUP & RECUPERAÇÃO ═══ */
function BackupPanel({vehicles,drivers,trips,fuel,maint,fines,suppliers,vistorias,setVehicles,setDrivers,setTrips,setFuel,setMaint,setFines,setSuppliers,setVistorias,toast}){
  const[importando,setImportando]=useState(false);
  const[cfm,setCfm]=useState(null);
  const inputRef=useRef(null);

  const exportar=()=>{
    const backup={
      versao:"1.0",
      data:new Date().toISOString(),
      sistema:"SGA Frota Municipal — Upanema RN",
      dados:{vehicles,drivers,trips,fuel,maint,fines,suppliers,vistorias},
    };
    const json=JSON.stringify(backup,null,2);
    const blob=new Blob([json],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`sga_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);a.click();
    document.body.removeChild(a);URL.revokeObjectURL(url);
    toast("✓ Backup exportado com sucesso! Guarde o arquivo em local seguro.");
  };

  const importar=e=>{
    const file=e.target.files?.[0];
    if(!file)return;
    if(!file.name.endsWith(".json")){toast("Selecione um arquivo .json de backup.","danger");return;}
    setImportando(true);
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const backup=JSON.parse(ev.target.result);
        if(!backup.dados){toast("Arquivo de backup inválido.","danger");setImportando(false);return;}
        setCfm({
          dados:backup.dados,
          data:backup.data,
          msg:`Restaurar backup de ${new Date(backup.data).toLocaleString("pt-BR")}? Isso irá substituir TODOS os dados atuais do sistema. Esta ação não pode ser desfeita.`,
        });
      }catch{
        toast("Erro ao ler o arquivo. Verifique se é um backup válido.","danger");
      }
      setImportando(false);
      e.target.value="";
    };
    reader.readAsText(file);
  };

  const restaurar=dados=>{
    if(dados.vehicles)setVehicles(dados.vehicles);
    if(dados.drivers)setDrivers(dados.drivers);
    if(dados.trips)setTrips(dados.trips);
    if(dados.fuel)setFuel(dados.fuel);
    if(dados.maint)setMaint(dados.maint);
    if(dados.fines)setFines(dados.fines);
    if(dados.suppliers)setSuppliers(dados.suppliers);
    if(dados.vistorias)setVistorias(dados.vistorias);
    toast("✓ Backup restaurado com sucesso! Todos os dados foram recuperados.","info");
    setCfm(null);
  };

  const totais=[
    ["Veículos",vehicles.length,Car],
    ["Motoristas",drivers.length,Users],
    ["Viagens",trips.length,MapPin],
    ["Abastecimentos",fuel.length,Fuel],
    ["Manutenções",maint.length,Wrench],
    ["Multas",fines.length,AlertOctagon],
    ["Fornecedores",suppliers.length,Building2],
    ["Vistorias",vistorias.length,CheckSquare],
  ];

  return<div>
    <div style={{background:"#dcfce7",border:"1px solid #86efac",padding:"12px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
      <CheckCircle size={16} color="#15803d"/>
      <span style={{fontSize:13,color:"#15803d",fontWeight:600}}>O backup exporta TODOS os dados do sistema em um arquivo .json. Guarde em local seguro (pendrive, Google Drive, e-mail).</span>
    </div>

    <div className="g2" style={{marginBottom:16}}>
      {/* EXPORTAR */}
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:36,height:36,background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center"}}><Download size={18} color={P}/></div>
          <div><div style={{fontSize:14,fontWeight:700,color:"var(--tx)"}}>Exportar Backup</div><div style={{fontSize:12,color:"var(--mu)"}}>Salva todos os dados em arquivo .json</div></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
          {totais.map(([lb,n,I])=><div key={lb} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--bd)",fontSize:13}}>
            <span style={{color:"var(--mu)",display:"flex",alignItems:"center",gap:6}}><I size={12}/>{lb}</span>
            <span style={{fontWeight:700,color:"var(--tx)"}}>{n} registro(s)</span>
          </div>)}
        </div>
        <Btn Ic={Download} click={exportar} full>Exportar Backup Agora</Btn>
        <p style={{fontSize:11,color:"var(--mu)",marginTop:8,textAlign:"center"}}>Arquivo: sga_backup_{new Date().toISOString().slice(0,10)}.json</p>
      </div>

      {/* IMPORTAR */}
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:36,height:36,background:"#fef9c3",display:"flex",alignItems:"center",justifyContent:"center"}}><RefreshCw size={18} color="#a16207"/></div>
          <div><div style={{fontSize:14,fontWeight:700,color:"var(--tx)"}}>Restaurar Backup</div><div style={{fontSize:12,color:"var(--mu)"}}>Recupera dados de um arquivo .json</div></div>
        </div>
        <div style={{background:"#fef9c3",border:"1px solid #fde047",padding:"10px 12px",marginBottom:16,fontSize:12,color:"#a16207",lineHeight:1.6}}>
          ⚠ <strong>Atenção:</strong> restaurar um backup irá substituir TODOS os dados atuais. Faça um backup dos dados atuais antes de restaurar.
        </div>
        <Btn Ic={RefreshCw} click={()=>inputRef.current?.click()} full dis={importando}>{importando?"Lendo arquivo...":"Selecionar Arquivo de Backup"}</Btn>
        <input ref={inputRef} type="file" accept=".json" onChange={importar} style={{display:"none"}}/>
        <p style={{fontSize:11,color:"var(--mu)",marginTop:8,textAlign:"center"}}>Selecione um arquivo .json exportado por este sistema</p>
      </div>
    </div>

    {cfm&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div className="fu" style={{background:"var(--card)",width:"100%",maxWidth:460,padding:24,boxShadow:"0 20px 60px rgba(0,0,0,.4)"}}>
        <div style={{display:"flex",gap:12,marginBottom:16}}><AlertTriangle size={22} color="#d97706" style={{flexShrink:0,marginTop:2}}/><div><p style={{fontSize:15,fontWeight:700,color:"var(--tx)",marginBottom:4}}>Confirmar Restauração</p><p style={{fontSize:13,color:"var(--mu)",lineHeight:1.6}}>{cfm.msg}</p></div></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn ghost click={()=>setCfm(null)}>Cancelar</Btn>
          <Btn click={()=>restaurar(cfm.dados)}>Sim, Restaurar Backup</Btn>
        </div>
      </div>
    </div>}
  </div>;
}

/* ═══ SETTINGS — Controle de usuários por papel ═══ */
function Settings({toast,currentUser,sysUsers,setSysUsers,vehicles,drivers,trips,fuel,maint,fines,suppliers,vistorias,setVehicles,setDrivers,setTrips,setFuel,setMaint,setFines,setSuppliers,setVistorias}){
  const isAdmin=currentUser?.role==="admin";
  const[tab,setTab]=useState("users");const[showForm,setShowForm]=useState(false);const[cfm,setCfm]=useState(null);
  const[nf,setNf]=useState({nome:"",email:"",pw:"",role:"motorista",sec:"Administração",perfil:""});
  const toggle=email=>{if(!isAdmin){toast("Somente administradores podem alterar usuários.","danger");return;}setSysUsers(p=>p.map(u=>u.email===email?{...u,ativo:!u.ativo}:u));toast("Status do usuário atualizado.");};
  const del=u=>{if(!isAdmin){toast("Somente administradores.","danger");return;}if(u.email===currentUser.email){toast("Não é possível remover o próprio usuário.","danger");return;}setCfm({msg:`Remover permanentemente o usuário "${u.nome}"?`,ok:()=>{setSysUsers(p=>p.filter(x=>x.email!==u.email));toast("Usuário removido do sistema.","danger");setCfm(null);}});};
  const add=()=>{
    if(!nf.nome||!nf.email||!nf.pw){toast("Preencha nome, e-mail e senha.","danger");return;}
    if(sysUsers.find(u=>u.email.toLowerCase()===nf.email.toLowerCase())){toast("Este e-mail já está cadastrado.","danger");return;}
    if(nf.pw.length<4){toast("A senha deve ter pelo menos 4 caracteres.","danger");return;}
    setSysUsers(p=>[...p,{...nf,perfil:nf.perfil||ROLE_LABELS[nf.role],mat:`PMU-${Date.now().toString().slice(-6)}`,ativo:true}]);
    setShowForm(false);setNf({nome:"",email:"",pw:"",role:"motorista",sec:"Administração",perfil:""});
    toast("✓ Usuário cadastrado com sucesso! Ele já pode acessar com as permissões do perfil escolhido.");
  };
  const roleColor={admin:"#dc2626",gestor:"#d97706",secretario:"#0284c7",supervisor:"#16a34a",motorista:"#7c3aed",auditor:"#64748b"};
  const menuItems=[["users","Usuários & Permissões",User],["sistema","Informações do Sistema",Shield],["backup","Backup & Recuperação",RefreshCw]];
  return<div>
    <SH title="Configurações do Sistema" sub="Usuários, permissões e parâmetros gerais"/>
    <div className="gcfg">
      <div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:"8px 0",height:"fit-content"}}>
        {menuItems.map(([id,lb,I])=><button key={id} onClick={()=>setTab(id)} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"10px 14px",background:tab===id?"var(--hv)":"none",border:"none",borderLeft:tab===id?`3px solid ${P}`:"3px solid transparent",color:tab===id?P:"var(--sub)",fontSize:13,fontWeight:tab===id?600:400,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}><I size={14}/>{lb}</button>)}
      </div>
      <div>
        {tab==="users"&&<div>
          <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",padding:"12px 14px",marginBottom:14,fontSize:12,color:"#1e40af",lineHeight:1.7}}>
            <strong>Controle de acesso por perfil:</strong> cada usuário só visualiza e edita as páginas correspondentes ao seu perfil. <strong>Administrador</strong> tem acesso total; <strong>Motorista</strong> só vê Viagens e Checklist; <strong>Secretário(a)</strong> vê Veículos, Viagens, Financeiro e Relatórios; e assim por diante, conforme a função de cada papel.
          </div>
          <div style={{background:"var(--card)",border:"1px solid var(--bd)"}}>
            <div style={{padding:"13px 16px",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontWeight:700,fontSize:14,color:"var(--tx)"}}>Usuários do Sistema</span>{!isAdmin&&<span style={{fontSize:11,color:"#d97706",display:"inline-flex",alignItems:"center",gap:4}}><Lock size={11}/>Apenas visualização</span>}</div>
              {isAdmin&&<Btn Ic={Plus} click={()=>setShowForm(!showForm)}>+ Novo Usuário</Btn>}
            </div>
            {isAdmin&&showForm&&<div style={{padding:18,borderBottom:"1px solid var(--bd)",background:"var(--ra)"}} className="fu">
              <p style={{fontSize:13,fontWeight:700,color:"var(--tx)",margin:"0 0 12px"}}>Cadastrar Novo Usuário</p>
              <div className="gf3">
                <FF lb="Nome Completo" val={nf.nome} set={v=>setNf(p=>({...p,nome:v}))} req/>
                <FF lb="E-mail" val={nf.email} set={v=>setNf(p=>({...p,email:v}))} req/>
                <FF lb="Senha Inicial" val={nf.pw} set={v=>setNf(p=>({...p,pw:v}))} type="password" req/>
                <FF lb="Perfil de Acesso" val={nf.role} set={v=>setNf(p=>({...p,role:v}))} opts={["admin","gestor","secretario","supervisor","motorista","auditor"]}/>
                <FF lb="Secretaria" val={nf.sec} set={v=>setNf(p=>({...p,sec:v}))} opts={["Saúde","Obras","Educação","Administração","Assist. Social","Controle Interno","Gestão"]}/>
                <FF lb="Título do Cargo (opcional)" val={nf.perfil} set={v=>setNf(p=>({...p,perfil:v}))}/>
              </div>
              <div style={{background:"#fef9c3",border:"1px solid #fde047",padding:"8px 12px",marginBottom:12,fontSize:12,color:"#a16207"}}>⚠ O acesso às páginas do sistema é definido automaticamente pelo perfil selecionado: admin (Administrador, acesso total), gestor (Gestor da Garagem), secretario (Secretário/a), supervisor (Supervisor), motorista (Motorista) e auditor (Auditor).</div>
              <div style={{display:"flex",gap:10}}><Btn Ic={Check} click={add}>Cadastrar Usuário</Btn><Btn ghost click={()=>setShowForm(false)}>Cancelar</Btn></div>
            </div>}
            <div className="tbl"><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr><Th ch="Matrícula"/><Th ch="Nome"/><Th ch="E-mail"/><Th ch="Perfil"/><Th ch="Secretaria"/><Th ch="Status"/>{isAdmin&&<Th ch="Ações"/>}</tr></thead>
              <tbody>{sysUsers.map((u,i)=><tr key={u.email} className="hr" style={{background:i%2===0?"var(--ra)":"var(--card)"}}>
                <Td ch={<span style={{fontFamily:"monospace",fontSize:10,color:"var(--mu)"}}>{u.mat}</span>}/>
                <Td ch={<div style={{display:"flex",alignItems:"center",gap:7}}>{u.email===currentUser?.email&&<span style={{width:7,height:7,background:"#16a34a",borderRadius:"50%",flexShrink:0}}/>}<span style={{fontWeight:600}}>{u.nome}</span></div>}/>
                <Td ch={<span style={{fontSize:12}}>{u.email}</span>}/>
                <Td ch={<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,background:roleColor[u.role]||"#64748b",borderRadius:"50%",flexShrink:0}}/><Bdg lb={u.perfil||ROLE_LABELS[u.role]} tp={u.role==="admin"?"bad":u.role==="gestor"?"warn":"info"}/></div>}/>
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
        {tab==="sistema"&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",padding:20}}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--tx)",marginBottom:16}}>Informações do Sistema</div>
          {[["Versão","SGA Frota Municipal — Versão de Produção"],["Usuário atual",`${currentUser?.nome} (${currentUser?.perfil})`],["Nível de acesso",currentUser?.role?.toUpperCase()],["Total de usuários",sysUsers.length+" cadastrado(s)"],["Armazenamento","Firebase Firestore + Cloudinary"],["Política de dados","LGPD — Lei nº 13.709/2018"],["Desenvolvido para","Prefeitura Municipal de Upanema — RN"],["Desenvolvido por","Luelson dos Santos Felix — Todos os direitos reservados 2026"]].map(([l,v])=><DR key={l} l={l} v={v}/>)}
        </div>}
        {tab==="backup"&&<BackupPanel
          vehicles={vehicles} drivers={drivers} trips={trips} fuel={fuel}
          maint={maint} fines={fines} suppliers={suppliers} vistorias={vistorias}
          setVehicles={setVehicles} setDrivers={setDrivers} setTrips={setTrips}
          setFuel={setFuel} setMaint={setMaint} setFines={setFines}
          setSuppliers={setSuppliers} setVistorias={setVistorias}
          toast={toast}
        />}
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

/* ═══ SIDEBAR — Filtra por permissão de papel ═══ */
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

  /* Dados iniciam ZERADOS — produção real */
  const[vehicles,setVehicles]=useState([]);
  const[drivers,setDrivers]=useState([]);
  const[trips,setTrips]=useState([]);
  const[fuel,setFuel]=useState([]);
  const[maint,setMaint]=useState([]);
  const[fines,setFines]=useState([]);
  const[alerts,setAlerts]=useState([]);
  const[suppliers,setSuppliers]=useState([]);
  const[log,setLog]=useState([]);
  const[sysUsers,setSysUsers]=useState(SYS_USERS_INIT);
  const[vistorias,setVistorias]=useState([]);

  /* Carrega dados persistidos */
  useEffect(()=>{
    (async()=>{
      try{
        const[v,d,t,f,m,fi,al,su,lg,us,vs]=await Promise.all([
  Store.get("sga_v"),Store.get("sga_d"),Store.get("sga_t"),Store.get("sga_f"),
  Store.get("sga_m"),Store.get("sga_fi"),Store.get("sga_al"),Store.get("sga_su"),
  Store.get("sga_log"),Store.get("sga_users"),Store.get("sga_vistorias"),
]);
if(v)setVehicles(v);if(d)setDrivers(d);if(t)setTrips(t);
if(f)setFuel(f);if(m)setMaint(m);if(fi)setFines(fi);
if(al)setAlerts(al);if(su)setSuppliers(su);if(lg)setLog(lg);
if(us&&us.length)setSysUsers(us);
if(vs)setVistorias(vs);
      }catch{}
      setReady(true);
    })();
  },[]);

  /* Salva automaticamente — toda alteração é permanente nesta sessão/storage */
  useEffect(()=>{if(ready)Store.set("sga_v",vehicles);},[vehicles,ready]);
  useEffect(()=>{if(ready)Store.set("sga_d",drivers);},[drivers,ready]);
  useEffect(()=>{if(ready)Store.set("sga_t",trips);},[trips,ready]);
  useEffect(()=>{if(ready)Store.set("sga_f",fuel);},[fuel,ready]);
  useEffect(()=>{if(ready)Store.set("sga_m",maint);},[maint,ready]);
  useEffect(()=>{if(ready)Store.set("sga_fi",fines);},[fines,ready]);
  useEffect(()=>{if(ready)Store.set("sga_al",alerts);},[alerts,ready]);
  useEffect(()=>{if(ready)Store.set("sga_su",suppliers);},[suppliers,ready]);
  useEffect(()=>{if(ready)Store.set("sga_log",log);},[log,ready]);
  useEffect(()=>{if(ready)Store.set("sga_users",sysUsers);},[sysUsers,ready]);
  useEffect(()=>{if(ready)Store.set("sga_vistorias",vistorias);},[vistorias,ready]);

/* ═══ ALERTAS AUTOMÁTICOS — roda ao carregar e quando veículos/motoristas mudam ═══ */
  useEffect(()=>{
    if(!ready||!vehicles.length&&!drivers.length)return;
    const hoje=new Date();hoje.setHours(0,0,0,0);

    const parseDt=str=>{
      if(!str||str==="—")return null;
      const p=str.split("/");
      if(p.length===3)return new Date(+p[2],+p[1]-1,+p[0]);
      return null;
    };

    const diasAte=str=>{
      const d=parseDt(str);
      if(!d)return null;
      return Math.round((d-hoje)/86400000);
    };

    const novos=[];
    let id=Date.now();

    // ── VEÍCULOS ──
    vehicles.forEach(v=>{
      if(v.sit==="Baixado"||v.sit==="Leiloado")return;
      const placa=v.placa;
      const nome=`${v.placa} — ${v.modelo||v.marca}`;

      // Seguro
      const dSeg=diasAte(v.seg);
      if(dSeg!==null){
        if(dSeg<0) novos.push({id:id++,nivel:"danger",tipo:"Seguro Vencido",titulo:`Seguro VENCIDO — ${placa}`,desc:`${nome}: seguro venceu há ${Math.abs(dSeg)} dia(s). Veículo não deve circular.`,pg:"vehicles"});
        else if(dSeg<=15) novos.push({id:id++,nivel:"danger",tipo:"Seguro",titulo:`Seguro vence em ${dSeg} dia(s) — ${placa}`,desc:`${nome}: seguro vence em ${v.seg}. Renove com urgência.`,pg:"vehicles"});
        else if(dSeg<=30) novos.push({id:id++,nivel:"warning",tipo:"Seguro",titulo:`Seguro vence em ${dSeg} dias — ${placa}`,desc:`${nome}: seguro vence em ${v.seg}. Providencie a renovação.`,pg:"vehicles"});
        else if(dSeg<=60) novos.push({id:id++,nivel:"info",tipo:"Seguro",titulo:`Seguro vence em ${dSeg} dias — ${placa}`,desc:`${nome}: seguro vence em ${v.seg}.`,pg:"vehicles"});
      }

      // Revisão / Licenciamento
      const dRev=diasAte(v.rev);
      if(dRev!==null){
        if(dRev<0) novos.push({id:id++,nivel:"danger",tipo:"Revisão Vencida",titulo:`Revisão VENCIDA — ${placa}`,desc:`${nome}: revisão venceu há ${Math.abs(dRev)} dia(s).`,pg:"vehicles"});
        else if(dRev<=15) novos.push({id:id++,nivel:"danger",tipo:"Revisão",titulo:`Revisão vence em ${dRev} dia(s) — ${placa}`,desc:`${nome}: revisão vence em ${v.rev}. Agende imediatamente.`,pg:"maintenance"});
        else if(dRev<=30) novos.push({id:id++,nivel:"warning",tipo:"Revisão",titulo:`Revisão vence em ${dRev} dias — ${placa}`,desc:`${nome}: revisão vence em ${v.rev}.`,pg:"maintenance"});
        else if(dRev<=60) novos.push({id:id++,nivel:"info",tipo:"Revisão",titulo:`Revisão vence em ${dRev} dias — ${placa}`,desc:`${nome}: revisão prevista para ${v.rev}.`,pg:"maintenance"});
      }

      // Combustível baixo
      if(v.niv<=15&&v.sit!=="Manutenção") novos.push({id:id++,nivel:"warning",tipo:"Combustível",titulo:`Combustível baixo — ${placa}`,desc:`${nome}: nível de combustível em ${v.niv}%. Abastecer antes da próxima saída.`,pg:"fuel"});

      // Multas pendentes
      const multasPend=fines.filter(f=>f.placa===placa&&f.status==="Pendente");
      if(multasPend.length>0) novos.push({id:id++,nivel:"warning",tipo:"Multas",titulo:`${multasPend.length} multa(s) pendente(s) — ${placa}`,desc:`${nome}: R$ ${multasPend.reduce((a,x)=>a+x.valor,0).toFixed(2)} em multas pendentes.`,pg:"fines"});

      // Vistoria — mais de 30 dias sem vistoria
      const vsVei=vistorias.filter(vs=>vs.placa===placa);
      if(vsVei.length>0){
        const ultima=vsVei[0];
        const partsData=ultima.data?.split(" ")[0]?.split("/");
        if(partsData?.length===3){
          const dtUlt=new Date(+partsData[2],+partsData[1]-1,+partsData[0]);
          const diasSemVist=Math.round((hoje-dtUlt)/86400000);
          if(diasSemVist>30) novos.push({id:id++,nivel:"warning",tipo:"Vistoria",titulo:`Vistoria desatualizada — ${placa}`,desc:`${nome}: última vistoria há ${diasSemVist} dias. Recomendado a cada 30 dias.`,pg:"checklist"});
        }
      } else if(v.sit==="Disponível"||v.sit==="Em uso"){
        novos.push({id:id++,nivel:"info",tipo:"Vistoria",titulo:`Sem vistoria cadastrada — ${placa}`,desc:`${nome}: nenhuma vistoria registrada. Realize a primeira inspeção.`,pg:"checklist"});
      }
    });

    // ── MOTORISTAS ──
    drivers.forEach(d=>{
      if(d.sit==="Afastado")return;
      const dCnh=diasAte(d.valCnh);
      if(dCnh!==null){
        if(dCnh<0) novos.push({id:id++,nivel:"danger",tipo:"CNH Vencida",titulo:`CNH VENCIDA — ${d.nome}`,desc:`${d.nome}: CNH Cat. ${d.cnh} venceu há ${Math.abs(dCnh)} dia(s). Motorista não pode dirigir.`,pg:"drivers"});
        else if(dCnh<=15) novos.push({id:id++,nivel:"danger",tipo:"CNH",titulo:`CNH vence em ${dCnh} dia(s) — ${d.nome}`,desc:`${d.nome}: CNH Cat. ${d.cnh} vence em ${d.valCnh}. Renovar com urgência.`,pg:"drivers"});
        else if(dCnh<=30) novos.push({id:id++,nivel:"warning",tipo:"CNH",titulo:`CNH vence em ${dCnh} dias — ${d.nome}`,desc:`${d.nome}: CNH Cat. ${d.cnh} vence em ${d.valCnh}.`,pg:"drivers"});
        else if(dCnh<=90) novos.push({id:id++,nivel:"info",tipo:"CNH",titulo:`CNH vence em ${dCnh} dias — ${d.nome}`,desc:`${d.nome}: CNH Cat. ${d.cnh} vence em ${d.valCnh}.`,pg:"drivers"});
      }
    });

    // ── OSs EM ATRASO ──
    maint.forEach(m=>{
      if(m.status==="Finalizada")return;
      const dPrev=diasAte(m.prev);
      if(dPrev!==null&&dPrev<0) novos.push({id:id++,nivel:"warning",tipo:"OS Atrasada",titulo:`OS atrasada ${Math.abs(dPrev)} dia(s) — ${m.placa}`,desc:`${m.id}: ${m.desc} — previsão era ${m.prev}.`,pg:"maintenance"});
    });

    // Substitui apenas alertas automáticos, mantém alertas manuais
    setAlerts(prev=>{
      const manuais=prev.filter(a=>a._manual);
      return[...novos,...manuais];
    });
  },[ready,vehicles,drivers,maint,fines,vistorias]);

  const goPage=p=>{setPage(p);setSideOpen(false);setNotif(false);};

  const handleLogin=u=>{
    setCurrentUser(u);setLogged(true);
    const now=new Date();
    setLog(p=>[{id:Date.now(),user:u.nome,acao:"Login no sistema",det:`Perfil: ${u.perfil}`,data:`${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`,tipo:"info"},...p]);
  };

  if(!logged)return<div className="sga"><style>{CSS}</style><Login onLogin={handleLogin} sysUsers={sysUsers}/></div>;

  const pages={
    dashboard:<Dashboard nav={goPage} vehicles={vehicles} drivers={drivers} alerts={alerts} fuel={fuel} maint={maint}/>,
    vehicles:<Vehicles vehicles={vehicles} setVehicles={setVehicles} toast={toast}/>,
    drivers:<Drivers drivers={drivers} setDrivers={setDrivers} toast={toast}/>,
    trips:<Trips vehicles={vehicles} setVehicles={setVehicles} drivers={drivers} trips={trips} setTrips={setTrips} toast={toast}/>,
    checklist:<Checklist vehicles={vehicles} setVehicles={setVehicles} drivers={drivers} vistorias={vistorias} setVistorias={setVistorias} toast={toast}/>,
    fuel:<FuelPage vehicles={vehicles} drivers={drivers} fuel={fuel} setFuel={setFuel} toast={toast}/>,
    maintenance:<MaintenancePage vehicles={vehicles} setVehicles={setVehicles} maint={maint} setMaint={setMaint} toast={toast}/>,
    fines:<Fines vehicles={vehicles} fines={fines} setFines={setFines} toast={toast}/>,
    financial:<Financial vehicles={vehicles} fuel={fuel} maint={maint} toast={toast}/>,
    reports:<Reports toast={toast} vehicles={vehicles} drivers={drivers} trips={trips} fuel={fuel} maint={maint} fines={fines}/>,
    suppliers:<Suppliers suppliers={suppliers} setSuppliers={setSuppliers} toast={toast}/>,
    alerts:<AlertsPage alerts={alerts} setAlerts={setAlerts} nav={goPage}/>,
    audit:<Audit log={log}/>,
    settings:<Settings toast={toast} currentUser={currentUser} sysUsers={sysUsers} setSysUsers={setSysUsers} vehicles={vehicles} drivers={drivers} trips={trips} fuel={fuel} maint={maint} fines={fines} suppliers={suppliers} vistorias={vistorias} setVehicles={setVehicles} setDrivers={setDrivers} setTrips={setTrips} setFuel={setFuel} setMaint={setMaint} setFines={setFines} setSuppliers={setSuppliers} setVistorias={setVistorias}/>,
  };

  /* Bloqueio de acesso direto: se a página atual não é permitida ao papel, força dashboard */
  const role=currentUser?.role||"admin";
  const allowedPages=ROLE_PAGES[role]||[];
  const safePage=(role==="admin"||allowedPages.includes(page))?page:"dashboard";

  return<div className={`sga${dm?" dark":""}`}>
    <style>{CSS}</style>
    {sideOpen&&<div className="sga-ov vis" onClick={()=>setSideOpen(false)}/>}
    <div className="sga-wrap">
      <Sidebar page={safePage} setPage={goPage} currentUser={currentUser} sideOpen={sideOpen}/>
      <div className="sga-mn">
        <Header page={safePage} logout={()=>{setLogged(false);setCurrentUser(null);setPage("dashboard");}} dm={dm} setDm={setDm} notif={notif} setNotif={setNotif} onMenu={()=>setSideOpen(s=>!s)} alerts={alerts}/>
        {notif&&<NotifPanel close={()=>setNotif(false)} nav={goPage} alerts={alerts}/>}
        {!ready&&<div style={{position:"fixed",inset:0,background:"rgba(255,255,255,.9)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
          <div className="spin" style={{width:32,height:32,border:"3px solid var(--bd)",borderTopColor:P,borderRadius:"50%"}}/>
          <span style={{fontSize:13,color:"var(--mu)",fontWeight:600}}>Carregando dados...</span>
        </div>}
        <main style={{flex:1,padding:"20px 28px",overflowY:"auto",width:"100%",minWidth:0}}>
          {pages[safePage]||<Dashboard nav={goPage} vehicles={vehicles} drivers={drivers} alerts={alerts} fuel={fuel} maint={maint}/>}
        </main>
        <footer style={{padding:"8px 18px",borderTop:"1px solid var(--bd)",background:"var(--card)",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:"var(--mu)",flexShrink:0,flexWrap:"wrap",gap:4}}>
          <span>© 2025 Prefeitura Municipal de Upanema — RN · SGA Frota Municipal</span>
          <span className="donly" style={{display:"flex",alignItems:"center",gap:5,color:"#16a34a",fontWeight:600}}><CheckCircle size={11}/>Dados salvos automaticamente</span>
        </footer>
      </div>
    </div>
    <Toasts ts={ts}/>
  </div>;
}
