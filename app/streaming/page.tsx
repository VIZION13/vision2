"use client";
import { useState, useRef, useEffect } from "react";

function useDevice() {
  const [w, setW] = useState(1200);
  useEffect(() => {
    setW(window.innerWidth);
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: w < 768, isTablet: w >= 768 && w < 1024 };
}

const TC = { bg:"#0D0D0F",surface:"#141418",card:"#1A1A22",card2:"#20202C",border:"#2A2A36",text:"#F0EEF8",muted:"#7A7890",accent:"#6ECFAA",accent2:"#B44FD4" };
const AC = { bg:"#0A0A14",surface:"#10101E",card:"#161628",card2:"#1C1C34",border:"#252538",text:"#F0EEF8",muted:"#8080A0",accent:"#B44FD4",accent2:"#6ECFAA" };

const ARTISTS = [
  { id:1, name:"ZAK&DIEGO", genre:"Pop Urbain / Afro", city:"Marseille", followers:0, plays:0, supporters:0,
    cover:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/avatar/ZAK%26DIEGO%20PHOTO%20FICHE%20ARTISTE1.jpg",
    bio:"Duo aux sonorités afro-urbaines. Marseille dans le sang.",
    instagram:"@zakdiego", tiktok:"@zakdiego" },
  { id:2, name:"Carlton", genre:"Afro Urbain / DJ", city:"Marseille", followers:0, plays:0, supporters:0,
    cover:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/avatar/CARLTON%20PHOTO%20FICHE%20ARTISTE1.jpg",
    bio:"DJ et producteur afro-urbain basé à Marseille.",
    instagram:"@carltonofficial", tiktok:"@carlton" },
];
const TRACKS = [
  { id:1, title:"Soucis",    artist:"ZAK&DIEGO", artistId:1, duration:209, plays:0,
    audio:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/audio/SOUCIS%20MIX_V2_MASTER.mp3",
    cover:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/cover/ZAK%26DIEGO%20SOUCIS%20%20COVER.png" },
  { id:2, title:"Bali Baba", artist:"Carlton",   artistId:2, duration:177, plays:0,
    audio:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/audio/BALI%20%20BABA%203.mp3",
    cover:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/cover/CARLTON%20bailababa%20cover.JPG" },
];[
  { id:1, title:"Soucis",    artist:"ZAK&DIEGO", artistId:1, duration:209, plays:0,
    audio:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/audio/SOUCIS%20MIX_V2_MASTER.mp3" },
  { id:2, title:"Bali Baba", artist:"Carlton",   artistId:2, duration:177, plays:0,
    audio:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/audio/BALI%20%20BABA%203.mp3" },
];
const PLANS = [
  { id:"team",  label:"Team",       price:3,  perks:["Écoute illimitée","Badge Team","Newsletter"] },
  { id:"super", label:"Super Team", price:7,  perks:["Clips exclusifs","Sessions Q&A","Crédits"] },
  { id:"vip",   label:"VIP",        price:15, perks:["Live studio","Appel vidéo","Merch"] },
];
const MRV=[{m:"Nov",v:210},{m:"Déc",v:380},{m:"Jan",v:290},{m:"Fév",v:520},{m:"Mar",v:610},{m:"Avr",v:840}];
const GENRES=["Variété française","Rap / Hip-Hop","R&B / Soul","Électronique","Afro","Jazz","Classique","Rock","Pop","Monde"];

const fmt =(s:number)=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
const fmtE=(n:number)=>`${Number(n).toFixed(2)} €`;

const Ic=({d,s=18,fill="none",stroke="currentColor",sw=1.6}:{d:string,s?:number,fill?:string,stroke?:string,sw?:number})=>(
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);
const IPlay  =({s=16}:{s?:number})=><Ic s={s} d="M5 3l14 9-14 9V3z" fill="currentColor" stroke="none"/>;
const IPause =({s=16}:{s?:number})=><Ic s={s} d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" stroke="none"/>;
const IPrev  =({s=14}:{s?:number})=><Ic s={s} d="M19 20L9 12l10-8v16zM5 4v16"/>;
const INext  =({s=14}:{s?:number})=><Ic s={s} d="M5 4l10 8-10 8V4zM19 4v16"/>;
const ISearch=({s=16}:{s?:number})=><Ic s={s} d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"/>;
const IHeart =({s=14,f=false}:{s?:number,f?:boolean})=><svg width={s} height={s} viewBox="0 0 24 24" fill={f?"currentColor":"none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const IVol   =({s=14}:{s?:number})=><Ic s={s} d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>;
const IUp    =({s=16}:{s?:number})=><Ic s={s} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>;
const IBar   =({s=16}:{s?:number})=><Ic s={s} d="M18 20V10M12 20V4M6 20v-6"/>;
const IUser  =({s=16}:{s?:number})=><Ic s={s} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z"/>;
const IGrid  =({s=16}:{s?:number})=><Ic s={s} d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>;
const IVid   =({s=16}:{s?:number})=><Ic s={s} d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>;
const IDoc   =({s=16}:{s?:number})=><Ic s={s} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/>;
const IMenu  =({s=18}:{s?:number})=><Ic s={s} d="M3 12h18M3 6h18M3 18h18"/>;
const IClose =({s=18}:{s?:number})=><Ic s={s} d="M18 6L6 18M6 6l12 12"/>;
const ICheck =({s=13,c="#6ECFAA"}:{s?:number,c?:string})=><Ic s={s} d="M20 6L9 17l-5-5" stroke={c} sw={2.5}/>;
const IOut   =({s=14}:{s?:number})=><Ic s={s} d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>;
const ISw    =({s=14}:{s?:number})=><Ic s={s} d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>;

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:#2A2A36;border-radius:3px;}
input,select,textarea{outline:none;font-family:'DM Sans',sans-serif;}
.hvr:hover{opacity:.82;transform:translateY(-1px);}
.row:hover{background:rgba(255,255,255,.04)!important;}
.ch:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.4)!important;}
input[type=range]{-webkit-appearance:none;height:3px;border-radius:2px;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:#6ECFAA;cursor:pointer;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
`;

const SL=({l,c,C}:{l:string,c:string,C:any})=><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:3,height:13,borderRadius:2,background:c}}/><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:C.text}}>{l}</span></div>;
const FL=({C,ch}:{C:any,ch:React.ReactNode})=><div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase" as const,letterSpacing:.5,marginBottom:4}}>{ch}</div>;
const FI=({v,o,pl,C}:{v:string,o:(x:string)=>void,pl:string,C:any})=><input value={v} onChange={e=>o(e.target.value)} placeholder={pl} style={{width:"100%",padding:"10px 12px",borderRadius:10,background:C.card2,border:`1px solid ${C.border}`,color:C.text,fontSize:13}}/>;
const BB=({onClick,dis,load,ch,col}:{onClick:()=>void,dis:boolean,load:boolean,ch:React.ReactNode,col:string})=><button onClick={onClick} disabled={dis||load} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:dis||load?"#2A2A36":`linear-gradient(135deg,${col},#9B6FD4)`,color:dis?"#7A7890":"#fff",fontWeight:700,fontSize:14,cursor:dis||load?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>{load?<span style={{width:14,height:14,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>:ch}</button>;
const IB=({l,v,n,C}:{l:string,v:string,n:string,C:any})=><div style={{padding:"10px 14px",borderRadius:10,background:`${C.accent}08`,border:`1px solid ${C.accent}22`,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,color:C.muted}}>{l}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{n}</div></div><span style={{fontWeight:700,color:C.accent,fontSize:14}}>{v}</span></div>;
const SB=({t,C}:{t:string,C:any})=><div style={{padding:"10px 14px",borderRadius:11,background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.25)",fontSize:12,color:"#4ADE80",fontWeight:600,marginBottom:12,display:"flex",alignItems:"center",gap:8}}><ICheck s={12} c="#4ADE80"/>{t}</div>;
const DV=({l,C}:{l:string,C:any})=><div style={{display:"flex",alignItems:"center",gap:12,margin:"18px 0"}}>
  <div style={{height:1,flex:1,background:`linear-gradient(to right,${C.accent}44,transparent)`}}/>
  <span style={{fontSize:10,fontWeight:700,color:C.accent,letterSpacing:2,textTransform:"uppercase" as const,whiteSpace:"nowrap" as const}}>{l}</span>
  <div style={{height:1,flex:1,background:`linear-gradient(to left,${C.accent}44,transparent)`}}/>
</div>;

export default function Vizion2() {
  const {isMobile,isTablet}=useDevice();
  const [mode,setMode]=useState<"team"|"artist">("team");
  const [tt,setTT]=useState<"home"|"support">("home");
  const [at,setAT]=useState<"upload"|"sacem"|"dashboard">("upload");
  const [user,setUser]=useState<any>(null);
  const [showAuth,setShowAuth]=useState(false);
  const [aMode,setAMode]=useState<"login"|"signup">("login");
  const [aEmail,setAEmail]=useState("");
  const [aPass,setAPass]=useState("");
  const [aName,setAName]=useState("");
  const [aArtist,setAArtist]=useState(false);
  const [aLoad,setALoad]=useState(false);
  const [aErr,setAErr]=useState("");
  const [track,setTrack]=useState(TRACKS[0]);
  const [playing,setPlay]=useState(false);
  const [prog,setProg]=useState(0);
  const [vol,setVol]=useState(0.8);
  const [liked,setLiked]=useState<Set<number>>(new Set());
  const [sa,setSA]=useState(ARTISTS[0]);
  const [dAmt,setDAmt]=useState(5);
  const [dCust,setDCust]=useState("");
  const [sp,setSP]=useState(PLANS[0]);
  const [dOk,setDOk]=useState(false);
  const [sOk,setSOk]=useState(false);
  const [paying,setPaying]=useState(false);
  const aR=useRef<HTMLInputElement>(null);
  const playerRef = useRef<HTMLAudioElement>(typeof window !== "undefined" ? new Audio() : null as any);
useEffect(()=>{ if(playerRef.current) playerRef.current.volume = vol; },[vol]);
  const cR=useRef<HTMLInputElement>(null);
  const vR=useRef<HTMLInputElement>(null);
  const [aF,setAF]=useState<File|null>(null);
  const [cP,setCP]=useState("");
  const [aTi,setATi]=useState("");
  const [aAc,setAAc]=useState("public");
  const [aLoad2,setALoad2]=useState(false);
  const [aOk,setAOk]=useState(false);
  const [vF,setVF]=useState<File|null>(null);
  const [vTi,setVTi]=useState("");
  const [vAc,setVAc]=useState("public");
  const [vLoad,setVLoad]=useState(false);
  const [vOk,setVOk]=useState(false);
  const [sacem,setSacem]=useState({title:"",genre:"",isrc:"",rd:"",
    authors:[{name:"",num:"",share:"50"}],
    composers:[{name:"",num:"",share:"50"}]});
  const [scOk,setScOk]=useState(false);
  const [scLoad,setScLoad]=useState(false);
  const [search,setSearch]=useState("");

  const C=mode==="team"?TC:AC;
  const fd=dCust?Number(dCust):dAmt;
  const filtered=ARTISTS.filter(a=>a.name.toLowerCase().includes(search.toLowerCase())||a.genre.toLowerCase().includes(search.toLowerCase()));
  const maxR=Math.max(...MRV.map(m=>m.v));
  const pad=isMobile?"12px 14px":isTablet?"16px 20px":"22px 28px";

  useEffect(()=>{
  if(!playing) return;
  const iv=setInterval(()=>{
    if(playerRef.current && !playerRef.current.paused){
      setProg(Math.floor(playerRef.current.currentTime));
    }
  },500);
  return()=>clearInterval(iv);
},[playing,track]);

  const play=(t:any)=>{
    setTrack(t);setProg(0);setPlay(true);
    if(t.audio && playerRef.current){
      playerRef.current.pause();
      playerRef.current.src=t.audio;
playerRef.current.load();
      playerRef.current.play().catch(()=>{});
      playerRef.current.ontimeupdate=()=>{ if(playerRef.current) setProg(Math.floor(playerRef.current.currentTime)); };
      playerRef.current.onended=()=>{setPlay(false);setProg(0);};
    }
  };
  const tLike=(id:number)=>setLiked(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const pay=(cb:()=>void)=>{setPaying(true);setTimeout(()=>{setPaying(false);cb();},2000);};
  const doAuth=()=>{
    if(!aEmail||!aPass){setAErr("Email et mot de passe requis");return;}
    setALoad(true);setAErr("");
    setTimeout(()=>{setUser({name:aMode==="signup"?aName:aEmail.split("@")[0],email:aEmail,isArtist:aArtist});setShowAuth(false);setALoad(false);},1500);
  };
  const upAudio=()=>{if(!aF||!aTi)return;setALoad2(true);setTimeout(()=>{setALoad2(false);setAOk(true);setTimeout(()=>{setAOk(false);setAF(null);setATi("");},3000);},2500);};
  const upVideo=()=>{if(!vF||!vTi)return;setVLoad(true);setTimeout(()=>{setVLoad(false);setVOk(true);setTimeout(()=>{setVOk(false);setVF(null);setVTi("");},3000);},2500);};
  const doSacem=()=>{setScLoad(true);setTimeout(()=>{setScLoad(false);setScOk(true);},2500);};

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",transition:"background .4s"}}>
      <style>{CSS}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:"60vw",height:"60vh",background:`radial-gradient(circle,${C.accent}08,transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:"-10%",right:"-8%",width:"55vw",height:"55vh",background:`radial-gradient(circle,${C.accent2}0a,transparent 70%)`}}/>
      </div>

      {/* NAV */}
      <nav style={{position:"relative",zIndex:50,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?"0 14px":"0 24px",height:isMobile?50:56,background:`${C.surface}f0`,backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,transition:"all .4s"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none",flexShrink:0}}>
          <div style={{width:isMobile?24:28,height:isMobile?24:28,borderRadius:7,background:`linear-gradient(135deg,${TC.accent},${AC.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:12,color:"#fff"}}>V</div>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:isMobile?13:15,color:C.text}}>VIZION <span style={{color:C.accent}}>2.0</span></span>
        </a>
        {!isMobile&&mode==="team"&&(
          <div style={{display:"flex",gap:2}}>
            {([["home","Accueil",<IGrid s={13}/>],["support","Soutenir",<IHeart s={13}/>]] as [string,string,React.ReactNode][]).map(([id,lbl,ico])=>(
              <button key={id} onClick={()=>setTT(id as any)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:tt===id?700:500,background:tt===id?`${C.accent}18`:"transparent",color:tt===id?C.accent:C.muted,transition:"all .2s"}}>{ico}{lbl}</button>
            ))}
          </div>
        )}
        {!isMobile&&mode==="artist"&&(
          <div style={{display:"flex",gap:2}}>
            {([["upload","Publier",<IUp s={13}/>],["sacem","SACEM",<IDoc s={13}/>],["dashboard","Dashboard",<IBar s={13}/>]] as [string,string,React.ReactNode][]).map(([id,lbl,ico])=>(
              <button key={id} onClick={()=>setAT(id as any)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:at===id?700:500,background:at===id?`${C.accent}18`:"transparent",color:at===id?C.accent:C.muted,transition:"all .2s"}}>{ico}{lbl}</button>
            ))}
          </div>
        )}
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {!isMobile&&<a href="/cgu" style={{fontSize:11,color:C.muted,textDecoration:"none",padding:"4px 10px",borderRadius:8,border:`1px solid ${C.border}`}}>CGU</a>}
          <div style={{display:"flex",padding:3,background:C.card,borderRadius:10,border:`1px solid ${C.border}`}}>
            <button onClick={()=>setMode("team")} style={{display:"flex",alignItems:"center",gap:4,padding:isMobile?"4px 8px":"5px 11px",borderRadius:7,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,background:mode==="team"?`${TC.accent}22`:"transparent",color:mode==="team"?TC.accent:C.muted,transition:"all .2s"}}><IUser s={10}/>Team</button>
            <button onClick={()=>setMode("artist")} style={{display:"flex",alignItems:"center",gap:4,padding:isMobile?"4px 8px":"5px 11px",borderRadius:7,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,background:mode==="artist"?`${AC.accent}22`:"transparent",color:mode==="artist"?AC.accent:C.muted,transition:"all .2s"}}><ISw s={10}/>Artiste</button>
          </div>
          {user?(
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:10,background:C.card,border:`1px solid ${C.border}`}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>{user.name[0].toUpperCase()}</div>
              {!isMobile&&<span style={{fontSize:11,fontWeight:600}}>{user.name}</span>}
              <button onClick={()=>setUser(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,display:"flex"}}><IOut s={12}/></button>
            </div>
          ):(
            <button onClick={()=>{setShowAuth(true);setAMode("login");setAErr("");}} style={{display:"flex",alignItems:"center",gap:4,padding:isMobile?"5px 10px":"6px 13px",borderRadius:9,border:`1px solid ${C.accent}44`,background:`${C.accent}12`,color:C.accent,fontSize:11,fontWeight:700,cursor:"pointer"}}>
              <IUser s={11}/>{!isMobile&&" Connexion"}
            </button>
          )}
        </div>
      </nav>

      {/* BOTTOM NAV MOBILE */}
      {isMobile&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:49,background:`${C.surface}f8`,backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,display:"flex",height:54}}>
          {mode==="team"?(<>
            {([["home","Accueil",<IGrid s={18}/>],["support","Soutenir",<IHeart s={18}/>]] as [string,string,React.ReactNode][]).map(([id,lbl,ico])=>(
              <button key={id} onClick={()=>setTT(id as any)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,border:"none",background:"transparent",cursor:"pointer",color:tt===id?C.accent:C.muted}}>
                {ico}<span style={{fontSize:9,fontWeight:tt===id?700:400}}>{lbl}</span>
              </button>
            ))}
          </>):(<>
            {([["upload","Publier",<IUp s={18}/>],["sacem","SACEM",<IDoc s={18}/>],["dashboard","Stats",<IBar s={18}/>]] as [string,string,React.ReactNode][]).map(([id,lbl,ico])=>(
              <button key={id} onClick={()=>setAT(id as any)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,border:"none",background:"transparent",cursor:"pointer",color:at===id?C.accent:C.muted}}>
                {ico}<span style={{fontSize:9,fontWeight:at===id?700:400}}>{lbl}</span>
              </button>
            ))}
          </>)}
          <a href="/cgu" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,textDecoration:"none",color:C.muted}}>
            <IDoc s={18}/><span style={{fontSize:9}}>CGU</span>
          </a>
        </div>
      )}

      {/* CONTENU */}
      <div style={{flex:1,overflowY:"auto",position:"relative",zIndex:1,paddingBottom:isMobile?120:playing?100:20}}>

        {/* TEAM ACCUEIL */}
        {mode==="team"&&tt==="home"&&(
          <div style={{padding:pad,maxWidth:1000,margin:"0 auto",width:"100%",animation:"fadeUp .35s ease both"}}>

            {/* Featured */}
            <div style={{borderRadius:16,overflow:"hidden",marginBottom:18,background:`linear-gradient(135deg,${C.card},${C.accent}0a)`,border:`1px solid ${C.border}`,display:"flex",height:isMobile?100:130}}>
              <div style={{position:"relative",width:isMobile?100:130,flexShrink:0}}>
                <img src={ARTISTS[0].cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,transparent 50%,rgba(26,26,34,1))"}}/>
              </div>
              <div style={{padding:isMobile?"10px 12px":"14px 20px",display:"flex",flexDirection:"column",justifyContent:"center",flex:1}}>
                <div style={{fontSize:8,color:C.accent,letterSpacing:2,textTransform:"uppercase" as const,fontWeight:700,marginBottom:3}}>Artiste en vedette</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:isMobile?14:18,marginBottom:2}}>{ARTISTS[0].name}</div>
                <div style={{color:C.muted,fontSize:11,marginBottom:8}}>{ARTISTS[0].genre} · {ARTISTS[0].city}</div>
                <div style={{display:"flex",gap:6}}>
                  <button className="hvr" onClick={()=>play(TRACKS[0])} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:8,border:"none",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}><IPlay s={9}/>Écouter</button>
                  <button className="hvr" onClick={()=>setTT("support")} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:8,border:`1px solid ${C.accent}44`,background:`${C.accent}12`,color:C.accent,fontWeight:700,fontSize:10,cursor:"pointer"}}><IHeart s={9}/>Soutenir</button>
                </div>
              </div>
            </div>

            {/* Grille Tendances + En cours */}
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:14,marginBottom:14}}>
              <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                <div style={{padding:"11px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:3,height:12,borderRadius:2,background:C.accent2}}/><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13}}>Tendances</span>
                </div>
                <div style={{padding:"5px"}}>
                  {TRACKS.map((t,i)=>(
                    <div key={t.id} className="row" onClick={()=>play(t)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:9,cursor:"pointer",transition:"background .2s",background:track.id===t.id&&playing?`${C.accent}08`:"transparent"}}>
                      <div style={{width:14,textAlign:"center" as const,fontSize:10,color:track.id===t.id&&playing?C.accent:C.muted,flexShrink:0}}>{track.id===t.id&&playing?<IPlay s={9}/>:i+1}</div>
                      <div style={{width:28,height:28,borderRadius:7,overflow:"hidden",flexShrink:0,background:C.card2}}><img src={t.cover||ARTISTS.find(a=>a.id===t.artistId)?.cover||""} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:600,color:track.id===t.id&&playing?C.accent:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{t.title}</div>
                        <div style={{fontSize:10,color:C.muted}}>{t.artist}</div>
                      </div>
                      <button onClick={e=>{e.stopPropagation();tLike(t.id);}} style={{background:"none",border:"none",cursor:"pointer",color:liked.has(t.id)?C.accent2:C.muted,padding:2,flexShrink:0}}><IHeart s={11} f={liked.has(t.id)}/></button>
                      <div style={{fontSize:10,color:C.muted,flexShrink:0}}>{fmt(t.duration)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                  <div style={{padding:"11px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:3,height:12,borderRadius:2,background:C.accent}}/><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13}}>En cours</span>
                  </div>
                  <div style={{padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <div style={{width:38,height:38,borderRadius:9,overflow:"hidden",flexShrink:0}}><img src={track.cover||track.cover||ARTISTS.find(a=>a.id===track.artistId)?.cover||""} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{track.title}</div>
                        <div style={{fontSize:10,color:C.muted}}>{track.artist}</div>
                      </div>
                    </div>
                    <input type="range" min={0} max={track.duration} value={prog} onChange={e=>{const v=Number(e.target.value);setProg(v);if(playerRef.current)playerRef.current.currentTime=v;}} style={{width:"100%",background:`linear-gradient(to right,${C.accent} ${(prog/track.duration)*100}%,${C.border} ${(prog/track.duration)*100}%)`,marginBottom:10,cursor:"pointer"}}/>
                    <div style={{display:"flex",justifyContent:"center",gap:14,alignItems:"center"}}>
                      <button onClick={()=>{const i=TRACKS.findIndex(t=>t.id===track.id);play(TRACKS[(i-1+TRACKS.length)%TRACKS.length]);}} style={{background:"none",border:"none",cursor:"pointer",color:C.muted}}><IPrev s={13}/></button>
                      <button onClick={()=>{if(playerRef.current){if(!playerRef.current.paused){playerRef.current.pause();setPlay(false);}else{playerRef.current.play().catch(()=>{});setPlay(true);}}}} style={{width:32,height:32,borderRadius:"50%",border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{playing?<IPause s={12}/>:<IPlay s={12}/>}</button>
                      <button onClick={()=>{const i=TRACKS.findIndex(t=>t.id===track.id);play(TRACKS[(i+1)%TRACKS.length]);}} style={{background:"none",border:"none",cursor:"pointer",color:C.muted}}><INext s={13}/></button>
                    </div>
                  </div>
                </div>
                <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                  <div style={{padding:"11px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:3,height:12,borderRadius:2,background:"#F5C842"}}/><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13}}>Plus streamés</span>
                  </div>
                  <div style={{padding:"5px"}}>
                    {[...TRACKS].sort((a,b)=>b.plays-a.plays).map((t,i)=>(
                      <div key={t.id} className="row" onClick={()=>play(t)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:9,cursor:"pointer",transition:"background .2s"}}>
                        <div style={{width:17,height:17,borderRadius:5,background:"rgba(245,200,66,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#F5C842",flexShrink:0}}>#{i+1}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{t.title}</div>
                          <div style={{fontSize:10,color:C.muted}}>{t.artist}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Séparateur Explorer */}
            <DV l="Explorer les artistes" C={C}/>
            <div style={{position:"relative",marginBottom:12,maxWidth:320}}>
              <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted}}><ISearch s={13}/></div>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Artiste, genre…" style={{width:"100%",padding:"8px 12px 8px 30px",background:C.card,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13}}/>
            </div>

            {/* Artistes + Nouvelles pépites */}
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {filtered.map(a=>(
                  <div key={a.id} className="ch" onClick={()=>window.location.href=`/artiste/${a.id===1?"zak-diego":"carlton"}`} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:13,overflow:"hidden",cursor:"pointer",transition:"all .25s"}}>
                    <div style={{width:"100%",height:"88%",objectFit:"cover",objectPosition:"center 20%"}}>
                      <img src={a.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <div style={{position:"absolute",inset:0,background:`linear-gradient(to top,${C.bg}cc,transparent)`}}/>
                      <div style={{position:"absolute",top:6,right:6,fontSize:8,padding:"1px 6px",borderRadius:20,background:"rgba(0,0,0,.65)",color:C.accent,fontWeight:700}}>{a.genre.split("/")[0].trim()}</div>
                    </div>
                    <div style={{padding:"8px 10px"}}>
                      <a href={`/artiste/${a.id===1?"zak-diego":"carlton"}`} onClick={e=>e.stopPropagation()} style={{fontWeight:700,fontSize:12,marginBottom:4,color:C.text,textDecoration:"none",display:"block"}}>{a.name}</a>
                      <div style={{display:"flex",gap:5,marginBottom:6}}>
                        {a.instagram&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:20,background:"rgba(225,48,108,.12)",color:"#E1306C",fontWeight:600}}>Insta</span>}
                        {a.tiktok&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:20,background:"rgba(105,201,208,.12)",color:"#69C9D0",fontWeight:600}}>TikTok</span>}
                      </div>
                      <div style={{display:"flex",gap:5}}>
                        <button className="hvr" onClick={()=>{setSA(a);setTT("support");}} style={{flex:1,padding:"4px 0",borderRadius:7,border:"none",background:`${C.accent}20`,color:C.accent,fontSize:9,fontWeight:700,cursor:"pointer"}}>Soutenir</button>
                        <button className="hvr" onClick={()=>play(TRACKS.find(t=>t.artistId===a.id)||TRACKS[0])} style={{flex:1,padding:"4px 0",borderRadius:7,border:"none",background:`${C.accent2}20`,color:C.accent2,fontSize:9,fontWeight:700,cursor:"pointer"}}>Écouter</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",alignSelf:"start" as const}}>
                <div style={{padding:"11px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:3,height:12,borderRadius:2,background:C.accent}}/><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13}}>Nouvelles pépites</span>
                </div>
                <div style={{padding:"5px"}}>
                  {[...ARTISTS].reverse().map(a=>(
                    <div key={a.id} onClick={()=>{setSA(a);setTT("support");}} className="row" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:11,cursor:"pointer",transition:"background .2s"}}>
                      <img src={a.cover} alt="" style={{width:34,height:34,borderRadius:9,objectFit:"cover",flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{a.name}</div>
                        <div style={{fontSize:10,color:C.muted}}>{a.genre} · {a.city}</div>
                      </div>
                      <button style={{padding:"4px 9px",borderRadius:8,border:`1px solid ${C.accent}44`,background:`${C.accent}10`,color:C.accent,fontSize:10,fontWeight:700,cursor:"pointer",flexShrink:0}}>+</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEAM SOUTENIR */}
        {mode==="team"&&tt==="support"&&(
          <div style={{padding:pad,maxWidth:500,margin:"0 auto",animation:"fadeUp .35s ease both",width:"100%"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,marginBottom:14}}>Soutenir un artiste</div>
            <SL l="Choisir" c={C.accent} C={C}/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap" as const,marginBottom:18}}>
              {ARTISTS.map(a=>(
                <div key={a.id} onClick={()=>setSA(a)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",borderRadius:11,border:`1.5px solid ${sa.id===a.id?C.accent:C.border}`,background:sa.id===a.id?`${C.accent}10`:C.card,cursor:"pointer",transition:"all .2s"}}>
                  <img src={a.cover} alt="" style={{width:26,height:26,borderRadius:7,objectFit:"cover"}}/>
                  <span style={{fontSize:12,fontWeight:600,color:sa.id===a.id?C.accent:C.text}}>{a.name}</span>
                </div>
              ))}
            </div>
            <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:"16px",marginBottom:12}}>
              <SL l="Don libre — 0% commission" c={C.accent} C={C}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}}>
                {[2,5,10,20].map(v=>(
                  <button key={v} onClick={()=>{setDAmt(v);setDCust("");}} style={{padding:"10px 0",borderRadius:9,border:`2px solid ${!dCust&&dAmt===v?C.accent:C.border}`,background:!dCust&&dAmt===v?`${C.accent}18`:C.card2,color:!dCust&&dAmt===v?C.accent:C.text,fontWeight:700,fontSize:14,cursor:"pointer"}}>{v}€</button>
                ))}
              </div>
              <div style={{position:"relative",marginBottom:10}}>
                <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:13}}>€</span>
                <input type="number" placeholder="Autre montant…" value={dCust} onChange={e=>setDCust(e.target.value)} style={{width:"100%",padding:"10px 12px 10px 26px",background:C.card2,border:`1px solid ${dCust?C.accent:C.border}`,borderRadius:10,color:C.text,fontSize:13}}/>
              </div>
              <IB l={`Don à ${sa.name}`} v={fmtE(fd)} n="0% commission · 100% à l'artiste" C={C}/>
              {dOk&&<SB t={`Don envoyé à ${sa.name} !`} C={C}/>}
              <BB onClick={()=>pay(()=>setDOk(true))} dis={fd<=0||paying} load={paying} col={C.accent} ch={`Envoyer ${fmtE(fd)}`}/>
            </div>
            <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:"16px"}}>
              <SL l="Abonnement — 90% à l'artiste" c={C.accent2} C={C}/>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
                {PLANS.map(plan=>(
                  <div key={plan.id} onClick={()=>setSP(plan)} style={{padding:"12px 14px",borderRadius:12,cursor:"pointer",border:`2px solid ${sp.id===plan.id?C.accent2:C.border}`,background:sp.id===plan.id?`${C.accent2}10`:C.card2,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:sp.id===plan.id?C.accent2:C.text,marginBottom:2}}>{plan.label}</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap" as const}}>{plan.perks.map(pk=><span key={pk} style={{fontSize:10,color:C.muted}}>· {pk}</span>)}</div>
                    </div>
                    <div style={{textAlign:"right" as const}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:sp.id===plan.id?C.accent2:C.text}}>{plan.price}€</div>
                      <div style={{fontSize:10,color:C.muted}}>/mois</div>
                    </div>
                  </div>
                ))}
              </div>
              <IB l={`Abonnement ${sp.label}`} v={`${sp.price}€/mois`} n={`90% à ${sa.name} · 10% VIZION 2.0`} C={C}/>
              {sOk&&<SB t={`Abonnement ${sp.label} activé !`} C={C}/>}
              <BB onClick={()=>pay(()=>setSOk(true))} dis={paying} load={paying} col={C.accent2} ch={`S'abonner · ${sp.price}€/mois`}/>
            </div>
          </div>
        )}

        {/* ARTISTE PUBLIER */}
        {mode==="artist"&&at==="upload"&&(
          <div style={{padding:pad,maxWidth:680,margin:"0 auto",animation:"fadeUp .35s ease both",width:"100%"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,marginBottom:4}}>Publier du contenu</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:16}}>Audio et vidéo depuis cette page</div>
            <DV l="Titre Audio · MP3 WAV FLAC · Max 50MB" C={C}/>
            {aOk&&<SB t="Titre publié avec succès !" C={C}/>}
            <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:"16px",marginBottom:16}}>
              <div onClick={()=>aR.current?.click()} style={{border:`2px dashed ${aF?C.accent:C.border}`,borderRadius:12,padding:"18px",textAlign:"center" as const,cursor:"pointer",marginBottom:12,transition:"all .2s",background:aF?`${C.accent}06`:"transparent"}}>
                <div style={{color:aF?C.accent:C.muted,marginBottom:5,display:"flex",justifyContent:"center"}}><IUp s={22}/></div>
                {aF?<><div style={{fontWeight:700,color:C.accent,fontSize:13}}>{aF.name}</div><div style={{fontSize:11,color:C.muted}}>{(aF.size/1024/1024).toFixed(1)} MB</div></>:<><div style={{fontWeight:600,fontSize:13,marginBottom:2}}>Clique pour choisir</div><div style={{fontSize:11,color:C.muted}}>Max 50MB</div></>}
                <input ref={aR} type="file" accept="audio/*" onChange={e=>{const f=e.target.files?.[0];if(f){setAF(f);if(!aTi)setATi(f.name.replace(/\.[^.]+$/,""));}}} style={{display:"none"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"65px 1fr",gap:12,marginBottom:12}}>
                <div>
                  <FL C={C} ch="Pochette"/>
                  <div onClick={()=>cR.current?.click()} style={{width:65,height:65,borderRadius:9,overflow:"hidden",background:C.card2,border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                    {cP?<img src={cP} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{color:C.muted,textAlign:"center" as const,fontSize:9}}><IUp s={13}/><div>+</div></div>}
                  </div>
                  <input ref={cR} type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f)setCP(URL.createObjectURL(f));}} style={{display:"none"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <div><FL C={C} ch="Titre *"/><FI v={aTi} o={setATi} pl="Ex: Mon titre" C={C}/></div>
                  <div>
                    <FL C={C} ch="Accès"/>
                    <div style={{display:"flex",gap:6}}>
                      {[["public","Public"],["super","Super Team"],["vip","VIP"]].map(([v,l])=>(
                        <button key={v} onClick={()=>setAAc(v)} style={{flex:1,padding:"6px 0",borderRadius:8,border:`2px solid ${aAc===v?C.accent:C.border}`,background:aAc===v?`${C.accent}15`:C.card2,color:aAc===v?C.accent:C.muted,fontSize:9,fontWeight:700,cursor:"pointer"}}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <BB onClick={upAudio} dis={!aF||!aTi||aLoad2} load={aLoad2} col={C.accent} ch={<><IUp s={13}/>Publier le titre</>}/>
            </div>
            <DV l="Vidéo · MP4 MOV · Max 500MB" C={C}/>
            <div style={{padding:"8px 12px",borderRadius:10,background:`${C.accent}08`,border:`1px solid ${C.accent}22`,marginBottom:12,fontSize:11,color:C.muted}}>
              <span style={{color:C.accent,fontWeight:600}}>Super Team</span> → Clips · <span style={{color:C.accent2,fontWeight:600}}>VIP</span> → Lives + Making of
            </div>
            {vOk&&<SB t="Vidéo publiée avec succès !" C={C}/>}
            <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,padding:"16px"}}>
              <div onClick={()=>vR.current?.click()} style={{border:`2px dashed ${vF?C.accent2:C.border}`,borderRadius:12,padding:"18px",textAlign:"center" as const,cursor:"pointer",marginBottom:12,transition:"all .2s",background:vF?`${C.accent2}06`:"transparent"}}>
                <div style={{color:vF?C.accent2:C.muted,marginBottom:5,display:"flex",justifyContent:"center"}}><IVid s={22}/></div>
                {vF?<><div style={{fontWeight:700,color:C.accent2,fontSize:13}}>{vF.name}</div><div style={{fontSize:11,color:C.muted}}>{(vF.size/1024/1024).toFixed(1)} MB</div></>:<><div style={{fontWeight:600,fontSize:13,marginBottom:2}}>Clique pour choisir</div><div style={{fontSize:11,color:C.muted}}>Max 500MB</div></>}
                <input ref={vR} type="file" accept="video/*" onChange={e=>{const f=e.target.files?.[0];if(f){setVF(f);if(!vTi)setVTi(f.name.replace(/\.[^.]+$/,""));}}} style={{display:"none"}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
                <div><FL C={C} ch="Titre *"/><FI v={vTi} o={setVTi} pl="Ex: Mon clip officiel" C={C}/></div>
                <div>
                  <FL C={C} ch="Accès"/>
                  <div style={{display:"flex",gap:6}}>
                    {[["public","Public"],["super","Super Team"],["vip","VIP"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setVAc(v)} style={{flex:1,padding:"6px 0",borderRadius:8,border:`2px solid ${vAc===v?C.accent2:C.border}`,background:vAc===v?`${C.accent2}15`:C.card2,color:vAc===v?C.accent2:C.muted,fontSize:9,fontWeight:700,cursor:"pointer"}}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
              <BB onClick={upVideo} dis={!vF||!vTi||vLoad} load={vLoad} col={C.accent2} ch={<><IVid s={13}/>Publier la vidéo</>}/>
            </div>
          </div>
        )}

        {/* ARTISTE SACEM */}
        {mode==="artist"&&at==="sacem"&&(
          <div style={{padding:pad,maxWidth:660,margin:"0 auto",animation:"fadeUp .35s ease both",width:"100%"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,marginBottom:4}}>Dépôt SACEM</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:14}}>Via VIZION 2.0 Music Publishing</div>
            {scOk?(
              <div style={{textAlign:"center" as const,padding:"50px 0"}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><ICheck s={22} c="#fff"/></div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,marginBottom:8}}>Titre déposé !</div>
                <div style={{color:C.muted,fontSize:13,marginBottom:18}}>Dépôt sous 5 jours ouvrés · Contrat envoyé par email</div>
                <button onClick={()=>setScOk(false)} style={{padding:"10px 22px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",fontWeight:700,cursor:"pointer"}}>Déposer un autre titre</button>
              </div>
            ):(
              <>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                  <div style={{padding:"11px 14px",borderRadius:11,background:`${C.accent2}08`,border:`1px solid ${C.accent2}22`,fontSize:12,color:C.muted,lineHeight:1.7}}>
                    <strong style={{color:C.accent2}}>Pas d&apos;éditeur ?</strong> VIZION 2.0 t&apos;édite. Tu gardes <strong style={{color:C.accent2}}>100% de ta part auteur</strong>.
                  </div>
                  <div style={{padding:"11px 14px",borderRadius:11,background:`${C.accent}08`,border:`1px solid ${C.accent}22`,fontSize:12,color:C.muted,lineHeight:1.7}}>
                    <strong style={{color:C.accent}}>Déjà un éditeur ?</strong> Renseigne ses informations dans les champs dédiés.
                  </div>
                  <div style={{padding:"11px 14px",borderRadius:11,background:C.card2,border:`1px solid ${C.border}`,fontSize:12,color:C.muted,lineHeight:1.7}}>
                    <strong style={{color:C.text}}>Pas encore inscrit SACEM ?</strong> Adhésion unique de <strong>100€</strong>. <a href="https://www.sacem.fr/adhesion" target="_blank" rel="noreferrer" style={{color:C.accent}}>sacem.fr →</a>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div><FL C={C} ch="Titre *"/><FI v={sacem.title} o={v=>setSacem(s=>({...s,title:v}))} pl="Mon titre" C={C}/></div>
                  <div>
                    <FL C={C} ch="Genre SACEM *"/>
                    <select value={sacem.genre} onChange={e=>setSacem(s=>({...s,genre:e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:10,background:C.card2,border:`1px solid ${C.border}`,color:sacem.genre?C.text:C.muted,fontSize:13,cursor:"pointer"}}>
                      <option value="">Sélectionner…</option>
                      {GENRES.map(g=><option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div><FL C={C} ch="Code ISRC"/><FI v={sacem.isrc} o={v=>setSacem(s=>({...s,isrc:v}))} pl="FRXXX2500001" C={C}/></div>
                  <div><FL C={C} ch="Date de sortie"/><FI v={sacem.rd} o={v=>setSacem(s=>({...s,rd:v}))} pl="JJ/MM/AAAA" C={C}/></div>
                </div>
                <div style={{padding:"12px",borderRadius:12,background:C.card,border:`1px solid ${C.border}`,marginBottom:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:8}}>Auteurs (paroles)</div>
                  {sacem.authors.map((a,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 60px",gap:8,marginBottom:8}}>
                      <FI v={a.name} o={v=>setSacem(s=>({...s,authors:s.authors.map((x,j)=>j===i?{...x,name:v}:x)}))} pl="Nom complet" C={C}/>
                      <FI v={a.num} o={v=>setSacem(s=>({...s,authors:s.authors.map((x,j)=>j===i?{...x,num:v}:x)}))} pl="N° SACEM" C={C}/>
                      <FI v={a.share} o={v=>setSacem(s=>({...s,authors:s.authors.map((x,j)=>j===i?{...x,share:v}:x)}))} pl="%" C={C}/>
                    </div>
                  ))}
                  <button onClick={()=>setSacem(s=>({...s,authors:[...s.authors,{name:"",num:"",share:"0"}]}))} style={{padding:"4px 12px",borderRadius:8,border:`1px solid ${C.accent}44`,background:`${C.accent}10`,color:C.accent,fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Auteur</button>
                </div>
                <div style={{padding:"12px",borderRadius:12,background:C.card,border:`1px solid ${C.border}`,marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.accent2,marginBottom:8}}>Compositeurs (musique)</div>
                  {sacem.composers.map((c,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 60px",gap:8,marginBottom:8}}>
                      <FI v={c.name} o={v=>setSacem(s=>({...s,composers:s.composers.map((x,j)=>j===i?{...x,name:v}:x)}))} pl="Nom complet" C={C}/>
                      <FI v={c.num} o={v=>setSacem(s=>({...s,composers:s.composers.map((x,j)=>j===i?{...x,num:v}:x)}))} pl="N° SACEM" C={C}/>
                      <FI v={c.share} o={v=>setSacem(s=>({...s,composers:s.composers.map((x,j)=>j===i?{...x,share:v}:x)}))} pl="%" C={C}/>
                    </div>
                  ))}
                  <button onClick={()=>setSacem(s=>({...s,composers:[...s.composers,{name:"",num:"",share:"0"}]}))} style={{padding:"4px 12px",borderRadius:8,border:`1px solid ${C.accent2}44`,background:`${C.accent2}10`,color:C.accent2,fontSize:11,fontWeight:600,cursor:"pointer"}}>+ Compositeur</button>
                </div>
                <div style={{padding:"11px 13px",borderRadius:11,background:C.card2,border:`1px solid ${C.border}`,fontSize:12,color:C.muted,lineHeight:1.7,marginBottom:12}}>
                  En soumettant, j&apos;accepte le mandat d&apos;édition VIZION 2.0 Music Publishing et certifie être titulaire des droits.
                </div>
                <BB onClick={doSacem} dis={!sacem.title||!sacem.genre||scLoad} load={scLoad} col={C.accent} ch={<><IDoc s={13}/>Soumettre le dépôt SACEM</>}/>
              </>
            )}
          </div>
        )}

        {/* ARTISTE DASHBOARD */}
        {mode==="artist"&&at==="dashboard"&&(
          <div style={{padding:pad,animation:"fadeUp .35s ease both"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,marginBottom:14}}>Dashboard</div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:10,marginBottom:20}}>
              {[{l:"Revenus ce mois",v:"0 €",c:C.accent},{l:"Abonnés actifs",v:"0",c:C.accent2},{l:"Titres publiés",v:"0",c:C.accent},{l:"Écoutes totales",v:"0",c:C.accent2}].map(k=>(
                <div key={k.l} style={{padding:"14px",borderRadius:13,background:C.card,border:`1px solid ${C.border}`}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,color:k.c,marginBottom:3}}>{k.v}</div>
                  <div style={{fontSize:11,color:C.muted}}>{k.l}</div>
                </div>
              ))}
            </div>
            <SL l="Revenus mensuels" c={C.accent} C={C}/>
            <div style={{padding:"14px",borderRadius:13,background:C.card,border:`1px solid ${C.border}`,marginBottom:18}}>
              <div style={{display:"flex",alignItems:"flex-end",gap:6,height:72}}>
                {MRV.map((m,i)=>{const h=(m.v/maxR)*100;const last=i===MRV.length-1;return(
                  <div key={m.m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{fontSize:8,color:last?C.accent:C.muted,fontWeight:last?700:400}}>{m.v}€</div>
                    <div style={{width:"100%",height:`${h}%`,borderRadius:"3px 3px 2px 2px",background:last?`linear-gradient(to top,${C.accent},${C.accent2})`:C.border,minHeight:3}}/>
                    <div style={{fontSize:8,color:C.muted}}>{m.m}</div>
                  </div>
                );})}
              </div>
            </div>
            <SL l="Artistes VIZION 2.0" c={C.accent2} C={C}/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {ARTISTS.map(a=>(
                <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:13,background:C.card,border:`1px solid ${C.border}`}}>
                  <img src={a.cover} alt="" style={{width:38,height:38,borderRadius:9,objectFit:"cover",flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13}}>{a.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{a.genre} · {a.city}</div>
                  </div>
                  <span style={{fontSize:10,padding:"2px 9px",borderRadius:20,background:`${C.accent}18`,color:C.accent,fontWeight:700}}>✓ Vérifié</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PLAYER */}
      {playing&&(
        <div style={{position:"relative",zIndex:50,flexShrink:0,height:isMobile?56:68,background:`${C.surface}f8`,backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:isMobile?"0 12px":"0 20px",marginBottom:isMobile?54:0,transition:"all .4s"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,width:isMobile?120:180,flexShrink:0}}>
            <div style={{width:isMobile?30:36,height:isMobile?30:36,borderRadius:8,overflow:"hidden",flexShrink:0}}><img src={ARTISTS.find(a=>a.id===track.artistId)?.cover||""} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
            <div style={{overflow:"hidden",flex:1}}>
              <div style={{fontSize:isMobile?10:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{track.title}</div>
              <div style={{fontSize:9,color:C.muted}}>{track.artist}</div>
            </div>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{display:"flex",alignItems:"center",gap:isMobile?12:16}}>
              <button onClick={()=>{const i=TRACKS.findIndex(t=>t.id===track.id);play(TRACKS[(i-1+TRACKS.length)%TRACKS.length]);}} style={{background:"none",border:"none",cursor:"pointer",color:C.muted}}><IPrev s={isMobile?12:14}/></button>
              <button onClick={()=>setPlay(p=>!p)} style={{width:isMobile?28:32,height:isMobile?28:32,borderRadius:"50%",border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{playing?<IPause s={isMobile?11:13}/>:<IPlay s={isMobile?11:13}/>}</button>
              <button onClick={()=>{const i=TRACKS.findIndex(t=>t.id===track.id);play(TRACKS[(i+1)%TRACKS.length]);}} style={{background:"none",border:"none",cursor:"pointer",color:C.muted}}><INext s={isMobile?12:14}/></button>
            </div>
            <div style={{width:isMobile?"75%":"100%",maxWidth:380,height:2,borderRadius:1,background:C.border,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(prog/track.duration)*100}%`,background:`linear-gradient(to right,${C.accent},${C.accent2})`,transition:"width .5s"}}/>
            </div>
          </div>
          {!isMobile&&<div style={{width:110,display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end",flexShrink:0}}><div style={{color:C.muted}}><IVol s={12}/></div><input type="range" min={0} max={1} step={.01} value={vol} onChange={e=>{ const v=Number(e.target.value); setVol(v); if(playerRef.current) playerRef.current.volume=v; }} style={{width:60,background:`linear-gradient(to right,${C.accent} ${vol*100}%,${C.border} ${vol*100}%)`}}/></div>}</div>
      )}

      {/* MODAL AUTH */}
      {showAuth&&(
        <>
          <div onClick={()=>setShowAuth(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:200}}/>
          <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:201,background:C.card,borderRadius:20,border:`1px solid ${C.border}`,padding:"26px",width:"100%",maxWidth:380,boxShadow:"0 24px 64px rgba(0,0,0,.6)",animation:"fadeUp .25s ease both",maxHeight:"90vh",overflowY:"auto"}}>
            <button onClick={()=>setShowAuth(false)} style={{position:"absolute",top:13,right:13,background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:17}}>✕</button>
            <a href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none",marginBottom:18}}>
              <div style={{width:24,height:24,borderRadius:7,background:`linear-gradient(135deg,${TC.accent},${AC.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:11,color:"#fff"}}>V</div>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:C.text}}>VIZION <span style={{color:C.accent}}>2.0</span></span>
            </a>
            <div style={{display:"flex",gap:3,padding:3,background:C.surface,borderRadius:10,marginBottom:18}}>
              {([["login","Se connecter"],["signup","S'inscrire"]] as [string,string][]).map(([id,lbl])=>(
                <button key={id} onClick={()=>{setAMode(id as any);setAErr("");}} style={{flex:1,padding:"7px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:aMode===id?`${C.accent}22`:"transparent",color:aMode===id?C.accent:C.muted,transition:"all .2s"}}>{lbl}</button>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
              {aMode==="signup"&&<div><FL C={C} ch="Nom / Pseudo"/><FI v={aName} o={setAName} pl="Ex: ZAK&DIEGO" C={C}/></div>}
              <div><FL C={C} ch="Email"/><input type="email" value={aEmail} onChange={e=>setAEmail(e.target.value)} placeholder="ton@email.com" style={{width:"100%",padding:"10px 12px",borderRadius:10,background:C.card2,border:`1px solid ${C.border}`,color:C.text,fontSize:13}}/></div>
              <div><FL C={C} ch="Mot de passe"/><input type="password" value={aPass} onChange={e=>setAPass(e.target.value)} placeholder="••••••••" style={{width:"100%",padding:"10px 12px",borderRadius:10,background:C.card2,border:`1px solid ${C.border}`,color:C.text,fontSize:13}}/></div>
              {aMode==="signup"&&(
                <div onClick={()=>setAArtist(a=>!a)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:11,border:`1.5px solid ${aArtist?C.accent:C.border}`,background:aArtist?`${C.accent}10`:C.card2,cursor:"pointer"}}>
                  <div style={{width:16,height:16,borderRadius:5,background:aArtist?C.accent:C.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{aArtist&&<ICheck s={10} c="#fff"/>}</div>
                  <div><div style={{fontSize:12,fontWeight:600,color:aArtist?C.accent:C.text}}>Je suis un artiste</div><div style={{fontSize:10,color:C.muted}}>Upload · SACEM · Dashboard</div></div>
                </div>
              )}
            </div>
            {aErr&&<div style={{padding:"8px 12px",borderRadius:9,background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",fontSize:12,color:"#F87171",marginBottom:10}}>{aErr}</div>}
            <button onClick={doAuth} disabled={aLoad} style={{width:"100%",padding:"12px",borderRadius:12,border:"none",background:aLoad?"#2A2A36":`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",fontWeight:700,fontSize:14,cursor:aLoad?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
              {aLoad?<span style={{width:14,height:14,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>:aMode==="login"?"Se connecter →":"Créer mon compte →"}
            </button>
            <button style={{width:"100%",padding:"10px",borderRadius:11,border:`1px solid ${C.border}`,background:"transparent",color:C.text,fontWeight:600,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuer avec Google
            </button>
          </div>
        </>
      )}
    </div>
  );
}
