"use client";
import { useState, useRef, useEffect } from "react";

// ─── Responsive hook ──────────────────────────────────────────────────────────
function useWindowSize() {
  const [size, setSize] = useState({ w: typeof window !== "undefined" ? window.innerWidth : 1200 });
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
}
// Breakpoints: mobile < 768, tablet 768-1024, desktop > 1024
function useDevice() {
  const { w } = useWindowSize();
  return { isMobile: w < 768, isTablet: w >= 768 && w < 1024, isDesktop: w >= 1024, w };
}

// ─── Palettes ─────────────────────────────────────────────────────────────────
const TEAM_COLORS = {
  bg:"#0D0D0F", surface:"#141418", card:"#1A1A22", card2:"#20202C",
  border:"#2A2A36", text:"#F0EEF8", muted:"#7A7890",
  accent:"#6ECFAA", accent2:"#B44FD4", gold:"#F5C842",
};
const ARTIST_COLORS = {
  bg:"#0A0A14", surface:"#10101E", card:"#161628", card2:"#1C1C34",
  border:"#252538", text:"#F0EEF8", muted:"#8080A0",
  accent:"#B44FD4", accent2:"#6ECFAA", gold:"#F5C842",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const ARTISTS = [
  { id:1, name:"ZAK&DIEGO", genre:"Pop Urbain / Afro", city:"Marseille", followers:0, plays:0, supporters:0,
    cover:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/avatars/zak-diego.jpg",
    bio:"Duo phocéen aux sonorités afro-urbaines. ZAK&DIEGO mêlent pop, rap et influences méditerranéennes pour une signature sonore unique. Marseille dans le sang, le monde en ligne de mire.",
    instagram:"@zakdiego", tiktok:"@zakdiego" },
  { id:2, name:"Carlton",   genre:"Afro Urbain / DJ",  city:"Marseille", followers:0, plays:0, supporters:0,
    cover:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/avatars/carlton.jpg",
    bio:"DJ et producteur afro-urbain basé à Marseille. Carlton fusionne les rythmes africains, la trap et l\'électro pour des sets et des productions qui font vibrer les dancefloors.",
    instagram:"@carltonofficial", tiktok:"@carlton" },
];

const TRACKS = [
  { id:1, title:"Lumière Froide",   artist:"Nova Kael",    artistId:1, duration:214, plays:8400  },
  { id:2, title:"Nuit Absolue",     artist:"Lys Paradis",  artistId:2, duration:187, plays:6200  },
  { id:3, title:"Béton & Velours",  artist:"Trax Obscur",  artistId:3, duration:243, plays:4100  },
  { id:4, title:"Altitude",         artist:"Éclat Sonore", artistId:4, duration:198, plays:9800  },
  { id:5, title:"Fusion Lente",     artist:"Céleste X",    artistId:5, duration:225, plays:5600  },
];

const PLANS = [
  { id:"team",  label:"Team",      price:3,  perks:["Écoute illimitée","Badge Team","Newsletter exclusive"] },
  { id:"super", label:"Super Team",price:7,  perks:["Tout Team","Clips officiels","Sessions Q&A","Crédits"] },
  { id:"vip",   label:"VIP",       price:15, perks:["Tout Super Team","Live studio","Appel vidéo","Merch","Early release"] },
];

const MONTHLY_REV = [{m:"Nov",v:210},{m:"Déc",v:380},{m:"Jan",v:290},{m:"Fév",v:520},{m:"Mar",v:610},{m:"Avr",v:840}];
const GENRES_SACEM = ["Variété française","Rap / Hip-Hop","R&B / Soul","Électronique","Afro","Jazz","Classique","Rock","Pop","Monde"];

const ARTIST_SOCIALS = {
  1: { instagram:"@zakdiego", tiktok:"@zakdiego" },
  2: { instagram:"@carltonofficial", tiktok:"@carlton" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt  = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
const fmtK = (n) => n>=1000?(n/1000).toFixed(1)+"k":String(n);
const fmtE = (n) => `${Number(n).toFixed(2)} €`;

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = ({d,s=20,fill="none",stroke="currentColor",sw=1.5}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const IPlay    = ({s=18}) => <Icon s={s} d="M5 3l14 9-14 9V3z" fill="currentColor" stroke="none"/>;
const IPause   = ({s=18}) => <Icon s={s} d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" stroke="none"/>;
const IPrev    = ({s=16}) => <Icon s={s} d="M19 20L9 12l10-8v16zM5 4v16"/>;
const INext    = ({s=16}) => <Icon s={s} d="M5 4l10 8-10 8V4zM19 4v16"/>;
const ISearch  = ({s=18}) => <Icon s={s} d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"/>;
const IHeart   = ({s=16,f=false}) => <Icon s={s} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill={f?"currentColor":"none"}/>;
const IVol     = ({s=16}) => <Icon s={s} d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>;
const IUpload  = ({s=18}) => <Icon s={s} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>;
const IBar     = ({s=18}) => <Icon s={s} d="M18 20V10M12 20V4M6 20v-6"/>;
const IUser    = ({s=18}) => <Icon s={s} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z"/>;
const IGrid    = ({s=18}) => <Icon s={s} d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>;
const ICheck   = ({s=13,c="#6ECFAA"}) => <Icon s={s} d="M20 6L9 17l-5-5" stroke={c} sw={2.5}/>;
const ILogout  = ({s=14}) => <Icon s={s} d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>;
const IVideo   = ({s=18}) => <Icon s={s} d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>;
const IDoc     = ({s=18}) => <Icon s={s} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/>;
const ILock    = ({s=14}) => <Icon s={s} d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4"/>;
const IMenu    = ({s=20}) => <Icon s={s} d="M3 12h18M3 6h18M3 18h18"/>;
const IClose   = ({s=20}) => <Icon s={s} d="M18 6L6 18M6 6l12 12"/>;
const IArrow   = ({s=14}) => <Icon s={s} d="M5 12h14M12 5l7 7-7 7"/>;
const ISwitch  = ({s=16}) => <Icon s={s} d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>;

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GCSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:#2A2A36;border-radius:3px;}
input,textarea,select{outline:none;font-family:'DM Sans',sans-serif;}
.hvr:hover{opacity:.82;transform:translateY(-1px);}
.row:hover{background:rgba(255,255,255,.03) !important;}
.card-hvr:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.4) !important;}
input[type=range]{-webkit-appearance:none;height:3px;border-radius:2px;outline:none;cursor:pointer;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:#6ECFAA;cursor:pointer;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}

/* ── RESPONSIVE ── */
@media (max-width:767px) {
  .desktop-only{display:none !important;}
  .nav-tabs{display:none !important;}
  .switcher-nav{display:none !important;}
  .cgu-nav{display:none !important;}
}
@media (min-width:768px) {
  .mobile-only{display:none !important;}
  .bottom-nav{display:none !important;}
}
@media (max-width:1023px) {
  .card-hvr:hover{transform:none;box-shadow:none !important;}
  .hvr:hover{transform:none;}
}
`;

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Vizion2Unified() {
  const { isMobile, isTablet, isDesktop } = useDevice();
  const [mode,    setMode]   = useState("team");   // "team" | "artist"
  const [menuOpen,setMenu]   = useState(false);
  const [teamTab, setTeamTab]= useState("home");
  const [artTab,  setArtTab] = useState("upload");

  // Auth
  const [user,       setUser]     = useState(null);
  const [showAuth,   setShowAuth] = useState(false);
  const [authMode,   setAuthMode] = useState("login");
  const [authEmail,  setAuthEmail]= useState("");
  const [authPass,   setAuthPass] = useState("");
  const [authName,   setAuthName] = useState("");
  const [authArtist, setAuthArt]  = useState(false);
  const [authLoad,   setAuthLoad] = useState(false);
  const [authError,  setAuthError]= useState("");

  // Player
  const [track,   setTrack]  = useState(TRACKS[0]);
  const [playing, setPlay]   = useState(false);
  const [progress,setProg]   = useState(0);
  const [volume,  setVol]    = useState(0.8);
  const [liked,   setLiked]  = useState(new Set([2]));

  // Team — support
  const [selectedArtist,setArtistSel] = useState(ARTISTS[0]);
  const [donAmt,  setDonAmt] = useState(5);
  const [donCust, setDonCust]= useState("");
  const [selPlan, setSelPlan]= useState(PLANS[0]);
  const [donOk,   setDonOk]  = useState(false);
  const [subOk,   setSubOk]  = useState(false);
  const [paying,  setPaying] = useState(false);
  const [mySupports,setMyS]  = useState(new Set());

  // Artist — upload
  const audioRef = useRef(null);
  const coverRef = useRef(null);
  const videoRef = useRef(null);
  const [audioFile,   setAudioFile]  = useState(null);
  const [coverPrev,   setCoverPrev]  = useState("");
  const [audioTitle,  setAudioTitle] = useState("");
  const [audioAccess, setAudioAccess]= useState("public");
  const [audioLoading,setAudioLoad]  = useState(false);
  const [audioOk,     setAudioOk]    = useState(false);
  const [videoFile,   setVideoFile]  = useState(null);
  const [videoTitle,  setVideoTitle] = useState("");
  const [videoAccess, setVideoAccess]= useState("public");
  const [videoLoading,setVideoLoad]  = useState(false);
  const [videoOk,     setVideoOk]    = useState(false);

  // SACEM
  const [sacem,setSacem] = useState({ title:"",genre:"",isrc:"",releaseDate:"", authors:[{name:"",num:"",share:"50"}], composers:[{name:"",num:"",share:"50"}], beatmakers:[{name:"",num:"",role:"Beatmaker",share:"0"}] });
  const [sacemOk,  setSacemOk]  = useState(false);
  const [sacemLoad,setSacemLoad]= useState(false);

  // Search
  const [search,setSearch] = useState("");

  const C = mode === "team" ? TEAM_COLORS : ARTIST_COLORS;
  const finalDon = donCust ? Number(donCust) : donAmt;

  useEffect(() => {
    if(!playing) return;
    const iv = setInterval(()=>setProg(p=>p>=track.duration?(setPlay(false),0):p+1),1000);
    return ()=>clearInterval(iv);
  },[playing,track]);

  const play = (t) => { setTrack(t); setProg(0); setPlay(true); };
  const toggleLike = (id) => setLiked(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});

  const switchMode = (m) => { setMode(m); setMenu(false); };

  const handleAuth = () => {
    if(!authEmail||!authPass){ setAuthError("Email et mot de passe requis"); return; }
    if(authMode==="signup"&&!authName){ setAuthError("Nom requis"); return; }
    setAuthLoad(true); setAuthError("");
    setTimeout(()=>{
      setUser({ name: authMode==="signup"?authName:authEmail.split("@")[0], email:authEmail, isArtist:authMode==="signup"?authArtist:false });
      setShowAuth(false); setAuthLoad(false); setAuthEmail(""); setAuthPass(""); setAuthName("");
    },1500);
  };

  const logout = () => { setUser(null); };

  const simPay = (cb) => { setPaying(true); setTimeout(()=>{setPaying(false);cb();},2000); };

  const uploadAudio = () => {
    if(!audioFile||!audioTitle) return;
    setAudioLoad(true);
    setTimeout(()=>{ setAudioLoad(false); setAudioOk(true); setTimeout(()=>{setAudioOk(false);setAudioFile(null);setCoverPrev("");setAudioTitle("");},3000); },2500);
  };

  const uploadVideo = () => {
    if(!videoFile||!videoTitle) return;
    setVideoLoad(true);
    setTimeout(()=>{ setVideoLoad(false); setVideoOk(true); setTimeout(()=>{setVideoOk(false);setVideoFile(null);setVideoTitle("");},3000); },2500);
  };

  const submitSacem = () => {
    setSacemLoad(true);
    setTimeout(()=>{ setSacemLoad(false); setSacemOk(true); },2500);
  };

  const maxRev = Math.max(...MONTHLY_REV.map(m=>m.v));

  const filteredArtists = ARTISTS.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",transition:"background .4s"}}>
      <style>{GCSS}</style>

      {/* Ambient glow */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:"60vw",height:"60vh",background:`radial-gradient(circle,${C.accent}09,transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:"-10%",right:"-8%",width:"55vw",height:"55vh",background:`radial-gradient(circle,${C.accent2}0b,transparent 70%)`}}/>
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{position:"relative",zIndex:50,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?"0 14px":"0 28px",height:isMobile?52:56,background:`${C.surface}f0`,backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,transition:"all .4s"}}>

        {/* Logo → accueil */}
        <a href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none",flexShrink:0}}>
          <div style={{width:isMobile?24:28,height:isMobile?24:28,borderRadius:7,background:`linear-gradient(135deg,${TEAM_COLORS.accent},${ARTIST_COLORS.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:isMobile?11:13,color:"#fff"}}>V</div>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:isMobile?13:15,letterSpacing:.5,color:C.text}}>VIZION <span style={{color:C.accent}}>2.0</span></span>
        </a>

        {/* Mode tabs — desktop/tablet seulement */}
        {!isMobile && mode==="team" && (
          <div className="nav-tabs" style={{display:"flex",gap:2}}>
            {[["home","Accueil",<IGrid s={13}/>],["support","Soutenir",<IHeart s={13}/>]].map(([id,lbl,ico])=>(
              <button key={id} onClick={()=>setTeamTab(id)} style={{display:"flex",alignItems:"center",gap:5,padding:isTablet?"5px 10px":"6px 14px",borderRadius:9,border:"none",cursor:"pointer",fontSize:isTablet?11:12,fontWeight:teamTab===id?700:500,background:teamTab===id?`${C.accent}18`:"transparent",color:teamTab===id?C.accent:C.muted,transition:"all .2s"}}>{ico}{lbl}</button>
            ))}
          </div>
        )}
        {!isMobile && mode==="artist" && (
          <div className="nav-tabs" style={{display:"flex",gap:2}}>
            {[["upload","Publier",<IUpload s={13}/>],["sacem","SACEM",<IDoc s={13}/>],["dashboard","Dashboard",<IBar s={13}/>]].map(([id,lbl,ico])=>(
              <button key={id} onClick={()=>setArtTab(id)} style={{display:"flex",alignItems:"center",gap:5,padding:isTablet?"5px 10px":"6px 14px",borderRadius:9,border:"none",cursor:"pointer",fontSize:isTablet?11:12,fontWeight:artTab===id?700:500,background:artTab===id?`${C.accent}18`:"transparent",color:artTab===id?C.accent:C.muted,transition:"all .2s"}}>{ico}{lbl}</button>
            ))}
          </div>
        )}

        {/* Right */}
        <div style={{display:"flex",alignItems:"center",gap:isMobile?6:8}}>
          {!isMobile && (
            <a className="cgu-nav" href="/cgu" style={{fontSize:11,color:C.muted,textDecoration:"none",padding:"5px 10px",borderRadius:8,border:`1px solid ${C.border}`}}>CGU</a>
          )}
          {/* Switcher */}
          <div className="switcher-nav" style={{display:"flex",padding:3,background:C.card,borderRadius:10,border:`1px solid ${C.border}`}}>
            <button onClick={()=>switchMode("team")} style={{display:"flex",alignItems:"center",gap:4,padding:isMobile?"4px 8px":"5px 12px",borderRadius:7,border:"none",cursor:"pointer",fontSize:isMobile?10:11,fontWeight:700,background:mode==="team"?`${TEAM_COLORS.accent}22`:"transparent",color:mode==="team"?TEAM_COLORS.accent:C.muted,transition:"all .2s"}}>
              <IUser s={isMobile?10:12}/> Team
            </button>
            <button onClick={()=>switchMode("artist")} style={{display:"flex",alignItems:"center",gap:4,padding:isMobile?"4px 8px":"5px 12px",borderRadius:7,border:"none",cursor:"pointer",fontSize:isMobile?10:11,fontWeight:700,background:mode==="artist"?`${ARTIST_COLORS.accent}22`:"transparent",color:mode==="artist"?ARTIST_COLORS.accent:C.muted,transition:"all .2s"}}>
              <ISwitch s={isMobile?10:12}/> Artiste
            </button>
          </div>
          {/* Login */}
          {user ? (
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:10,background:C.card,border:`1px solid ${C.border}`}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>{user.name[0].toUpperCase()}</div>
              {!isMobile && <span style={{fontSize:12,fontWeight:600,color:C.text}}>{user.name}</span>}
              <button onClick={logout} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,padding:2,display:"flex"}}><ILogout s={12}/></button>
            </div>
          ) : (
            <button onClick={()=>{setShowAuth(true);setAuthMode("login");setAuthError("");}} style={{display:"flex",alignItems:"center",gap:5,padding:isMobile?"5px 10px":"6px 14px",borderRadius:9,border:`1px solid ${C.accent}44`,background:`${C.accent}12`,color:C.accent,fontSize:isMobile?10:12,fontWeight:700,cursor:"pointer"}}>
              <IUser s={isMobile?10:12}/>{!isMobile&&" Connexion"}
            </button>
          )}
        </div>
      </nav>

      {/* ── BOTTOM NAV MOBILE ── */}
      {isMobile && (
        <div className="bottom-nav" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:49,background:`${C.surface}f8`,backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,display:"flex",height:56,paddingBottom:"env(safe-area-inset-bottom)"}}>
          {mode==="team" ? (
            <>
              {[["home","Accueil",<IGrid s={18}/>],["support","Soutenir",<IHeart s={18}/>]].map(([id,lbl,ico])=>(
                <button key={id} onClick={()=>setTeamTab(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:"none",background:"transparent",cursor:"pointer",color:teamTab===id?C.accent:C.muted,transition:"all .2s"}}>
                  <div style={{color:teamTab===id?C.accent:C.muted}}>{ico}</div>
                  <span style={{fontSize:9,fontWeight:teamTab===id?700:500}}>{lbl}</span>
                </button>
              ))}
            </>
          ) : (
            <>
              {[["upload","Publier",<IUpload s={18}/>],["sacem","SACEM",<IDoc s={18}/>],["dashboard","Stats",<IBar s={18}/>]].map(([id,lbl,ico])=>(
                <button key={id} onClick={()=>setArtTab(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:"none",background:"transparent",cursor:"pointer",color:artTab===id?C.accent:C.muted,transition:"all .2s"}}>
                  <div style={{color:artTab===id?C.accent:C.muted}}>{ico}</div>
                  <span style={{fontSize:9,fontWeight:artTab===id?700:500}}>{lbl}</span>
                </button>
              ))}
            </>
          )}
          <a href="/cgu" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,textDecoration:"none",color:C.muted}}>
            <IDoc s={18}/>
            <span style={{fontSize:9}}>CGU</span>
          </a>
        </div>
      )}
          <button onClick={()=>setMenu(o=>!o)} style={{width:32,height:32,borderRadius:9,border:`1px solid ${C.border}`,background:C.card,cursor:"pointer",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
            {menuOpen ? <IClose s={16}/> : <IMenu s={16}/>}
          </button>
        </div>
      </nav>

      {/* ── DROPDOWN MENU ── */}
      {menuOpen && (
        <div style={{position:"absolute",top:56,left:0,right:0,zIndex:49,background:`${C.surface}f8`,backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,padding:"20px 28px",animation:"slideDown .2s ease both"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,maxWidth:600,margin:"0 auto"}}>
            {[{id:"team",label:"Espace Team",desc:"Écoute · Découverte · Soutien",accent:TEAM_COLORS.accent},{id:"artist",label:"Espace Artiste",desc:"Publier · Distribuer · SACEM",accent:ARTIST_COLORS.accent}].map(m=>(
              <div key={m.id} onClick={()=>switchMode(m.id)} style={{padding:"16px",borderRadius:14,cursor:"pointer",border:`2px solid ${mode===m.id?m.accent:C.border}`,background:mode===m.id?`${m.accent}10`:"transparent",transition:"all .2s"}}>
                <div style={{fontWeight:700,fontSize:15,color:mode===m.id?m.accent:C.text,marginBottom:4}}>{m.label}</div>
                <div style={{fontSize:12,color:C.muted}}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{flex:1,overflowY:"auto",position:"relative",zIndex:1,paddingBottom:isMobile?120:playing?140:20}}>

        {/* ════ TEAM SCREENS ════ */}

        {/* Accueil — sections avec bannières séparatrices */}
        {mode==="team" && teamTab==="home" && (
          <div style={{padding:isMobile?"14px 12px":(isTablet?"18px 20px":"24px 32px"),animation:"fadeUp .35s ease both",maxWidth:1000,margin:"0 auto",width:"100%"}}>

            {/* ── Featured ── */}
            <div style={{borderRadius:16,overflow:"hidden",marginBottom:isMobile?18:28,background:`linear-gradient(135deg,${C.card},${C.accent}0a)`,border:`1px solid ${C.border}`,display:"flex",height:isMobile?110:140}}>
              <div style={{position:"relative",width:isMobile?110:140,flexShrink:0}}>
                <img src={ARTISTS[1].cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,transparent 50%,rgba(26,26,34,1))"}}/>
              </div>
              <div style={{padding:isMobile?"12px 14px":"18px 22px",display:"flex",flexDirection:"column",justifyContent:"center",flex:1}}>
                <div style={{fontSize:9,color:C.accent,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:3}}>Artiste en vedette</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:isMobile?15:18,marginBottom:3}}>{ARTISTS[1].name}</div>
                <div style={{color:C.muted,fontSize:11,marginBottom:isMobile?8:10}}>{ARTISTS[1].genre} · {fmtK(ARTISTS[1].followers)} abonnés</div>
                <div style={{display:"flex",gap:6}}>
                  <button className="hvr" onClick={()=>play(TRACKS.find(t=>t.artistId===2)||TRACKS[0])} style={{display:"flex",alignItems:"center",gap:4,padding:isMobile?"5px 10px":"6px 12px",borderRadius:8,border:"none",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",fontWeight:700,fontSize:10,cursor:"pointer"}}><IPlay s={9}/>Écouter</button>
                  <button className="hvr" onClick={()=>{setArtistSel(ARTISTS[1]);setTeamTab("support");}} style={{display:"flex",alignItems:"center",gap:4,padding:isMobile?"5px 10px":"6px 12px",borderRadius:8,border:`1px solid ${C.accent}44`,background:`${C.accent}12`,color:C.accent,fontWeight:700,fontSize:10,cursor:"pointer"}}><IHeart s={9}/>Soutenir</button>
                </div>
              </div>
            </div>

            {/* ── SECTION : Tendances ── */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{height:1,flex:1,background:`linear-gradient(to right,${C.accent}44,transparent)`}}/>
              <span style={{fontSize:11,fontWeight:700,color:C.accent,letterSpacing:1.5,textTransform:"uppercase"}}>Tendances</span>
              <div style={{height:1,flex:1,background:`linear-gradient(to left,${C.accent}44,transparent)`}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":(isTablet?"1fr 1fr":"1fr 1fr"),gap:3,marginBottom:isMobile?20:28}}>
              {TRACKS.map((t,i)=>(
                <div key={t.id} className="row" onClick={()=>play(t)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:10,cursor:"pointer",transition:"background .2s",background:track.id===t.id&&playing?`${C.accent}08`:"transparent"}}>
                  <div style={{width:16,textAlign:"center",fontSize:11,color:track.id===t.id&&playing?C.accent:C.muted,flexShrink:0}}>{track.id===t.id&&playing?<IPlay s={10}/>:i+1}</div>
                  <div style={{width:32,height:32,borderRadius:8,overflow:"hidden",flexShrink:0,background:C.card}}>
                    <img src={ARTISTS.find(a=>a.id===t.artistId)?.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:track.id===t.id&&playing?C.accent:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</div>
                    <div style={{fontSize:10,color:C.muted}}>{t.artist}</div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();toggleLike(t.id);}} style={{background:"none",border:"none",cursor:"pointer",color:liked.has(t.id)?C.accent2:C.muted,padding:3,flexShrink:0}}><IHeart s={12} f={liked.has(t.id)}/></button>
                  <div style={{fontSize:10,color:C.muted,minWidth:28,textAlign:"right",flexShrink:0}}>{fmt(t.duration)}</div>
                </div>
              ))}
            </div>

            {/* ── SECTION : En cours ── */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{height:1,flex:1,background:`linear-gradient(to right,${C.purple}44,transparent)`}}/>
              <span style={{fontSize:11,fontWeight:700,color:C.purple,letterSpacing:1.5,textTransform:"uppercase"}}>En cours</span>
              <div style={{height:1,flex:1,background:`linear-gradient(to left,${C.purple}44,transparent)`}}/>
            </div>
            <div style={{padding:"16px",borderRadius:16,background:C.card,border:`1px solid ${C.border}`,marginBottom:32,display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:56,height:56,borderRadius:12,overflow:"hidden",flexShrink:0}}>
                <img src={ARTISTS.find(a=>a.id===track.artistId)?.cover||""} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{track.title}</div>
                <div style={{fontSize:12,color:C.muted,marginBottom:10}}>{track.artist}</div>
                <div style={{height:2,borderRadius:1,background:C.border,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(progress/track.duration)*100}%`,background:`linear-gradient(to right,${C.accent},${C.accent2})`,transition:"width .5s"}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:14,alignItems:"center",flexShrink:0}}>
                <button onClick={()=>{const i=TRACKS.findIndex(t=>t.id===track.id);play(TRACKS[(i-1+TRACKS.length)%TRACKS.length]);}} style={{background:"none",border:"none",cursor:"pointer",color:C.muted}}><IPrev s={14}/></button>
                <button onClick={()=>setPlay(p=>!p)} style={{width:36,height:36,borderRadius:"50%",border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{playing?<IPause s={14}/>:<IPlay s={14}/>}</button>
                <button onClick={()=>{const i=TRACKS.findIndex(t=>t.id===track.id);play(TRACKS[(i+1)%TRACKS.length]);}} style={{background:"none",border:"none",cursor:"pointer",color:C.muted}}><INext s={14}/></button>
              </div>
            </div>

            {/* ── SECTION : Explorer ── */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{height:1,flex:1,background:`linear-gradient(to right,${C.accent}44,transparent)`}}/>
              <span style={{fontSize:11,fontWeight:700,color:C.accent,letterSpacing:1.5,textTransform:"uppercase"}}>Explorer</span>
              <div style={{height:1,flex:1,background:`linear-gradient(to left,${C.accent}44,transparent)`}}/>
            </div>
            <div style={{position:"relative",marginBottom:16,maxWidth:380}}>
              <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted}}><ISearch s={13}/></div>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Artiste, genre…" style={{width:"100%",padding:"9px 12px 9px 32px",background:C.card,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":(isTablet?"repeat(3,1fr)":"repeat(auto-fill,minmax(170px,1fr))"),gap:isMobile?10:12,marginBottom:isMobile?20:28}}>
              {filteredArtists.map(a=>{
                const socials=ARTIST_SOCIALS[a.id]||{};
                return(
                  <div key={a.id} className="card-hvr" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"all .25s"}}>
                    <div style={{height:110,overflow:"hidden",position:"relative"}}>
                      <img src={a.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <div style={{position:"absolute",inset:0,background:`linear-gradient(to top,${C.bg}cc,transparent)`}}/>
                      <div style={{position:"absolute",top:7,right:7,fontSize:9,padding:"2px 6px",borderRadius:20,background:"rgba(0,0,0,.65)",color:C.accent,fontWeight:700}}>{a.genre}</div>
                    </div>
                    <div style={{padding:"10px 12px"}}>
                      <div style={{fontWeight:700,fontSize:13,marginBottom:5}}>{a.name}</div>
                      {Object.keys(socials).length>0&&(
                        <div style={{display:"flex",gap:4,marginBottom:7}}>
                          {socials.instagram&&<span style={{fontSize:9,padding:"2px 5px",borderRadius:20,background:"rgba(225,48,108,.12)",color:"#E1306C",fontWeight:600}}>Insta</span>}
                          {socials.tiktok&&<span style={{fontSize:9,padding:"2px 5px",borderRadius:20,background:"rgba(105,201,208,.12)",color:"#69C9D0",fontWeight:600}}>TikTok</span>}
                          {socials.snapchat&&<span style={{fontSize:9,padding:"2px 5px",borderRadius:20,background:"rgba(255,252,0,.1)",color:"#FFD700",fontWeight:600}}>Snap</span>}
                        </div>
                      )}
                      <div style={{display:"flex",gap:5}}>
                        <button className="hvr" onClick={()=>{setArtistSel(a);setTeamTab("support");}} style={{flex:1,padding:"5px 0",borderRadius:7,border:"none",background:`${C.accent}20`,color:C.accent,fontSize:10,fontWeight:700,cursor:"pointer"}}>Soutenir</button>
                        <button className="hvr" onClick={()=>play(TRACKS.find(t=>t.artistId===a.id)||TRACKS[0])} style={{flex:1,padding:"5px 0",borderRadius:7,border:"none",background:`${C.accent2}20`,color:C.accent2,fontSize:10,fontWeight:700,cursor:"pointer"}}>Écouter</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── SECTION : Nouvelles pépites ── */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{height:1,flex:1,background:`linear-gradient(to right,${C.gold}44,transparent)`}}/>
              <span style={{fontSize:11,fontWeight:700,color:C.gold,letterSpacing:1.5,textTransform:"uppercase"}}>Nouvelles pépites</span>
              <div style={{height:1,flex:1,background:`linear-gradient(to left,${C.gold}44,transparent)`}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:32}}>
              {ARTISTS.slice(2,5).map((a,i)=>(
                <div key={a.id} className="row" onClick={()=>play(TRACKS.find(t=>t.artistId===a.id)||TRACKS[0])} style={{display:"flex",alignItems:"center",gap:12,padding:"12px",borderRadius:12,background:C.card,border:`1px solid ${C.border}`,cursor:"pointer",transition:"all .2s"}}>
                  <img src={a.cover} alt="" style={{width:42,height:42,borderRadius:10,objectFit:"cover",flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{a.genre}</div>
                  </div>
                  <div style={{fontSize:9,padding:"2px 8px",borderRadius:20,background:`${C.gold}18`,color:C.gold,fontWeight:700,flexShrink:0}}>Nouveau</div>
                </div>
              ))}
            </div>

            {/* ── SECTION : Les plus streamés ── */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{height:1,flex:1,background:`linear-gradient(to right,${C.accent2}44,transparent)`}}/>
              <span style={{fontSize:11,fontWeight:700,color:C.accent2,letterSpacing:1.5,textTransform:"uppercase"}}>Les plus streamés</span>
              <div style={{height:1,flex:1,background:`linear-gradient(to left,${C.accent2}44,transparent)`}}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:2}}>
              {[...TRACKS].sort((a,b)=>b.plays-a.plays).map((t,i)=>(
                <div key={t.id} className="row" onClick={()=>play(t)} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 10px",borderRadius:10,cursor:"pointer",transition:"background .2s"}}>
                  <div style={{width:20,textAlign:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:13,color:i<3?C.accent2:C.muted,flexShrink:0}}>#{i+1}</div>
                  <div style={{width:32,height:32,borderRadius:8,overflow:"hidden",flexShrink:0}}>
                    <img src={ARTISTS.find(a=>a.id===t.artistId)?.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</div>
                    <div style={{fontSize:10,color:C.muted}}>{t.artist}</div>
                  </div>
                  <div style={{fontSize:11,color:C.accent2,fontWeight:600,flexShrink:0}}>{fmtK(t.plays)} écoutes</div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Support */}
        {mode==="team" && teamTab==="support" && (
          <div style={{padding:isMobile?"14px 12px":"28px",maxWidth:540,margin:"0 auto",animation:"fadeUp .35s ease both"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:24,marginBottom:20}}>Soutenir un artiste</div>

            {/* Artist select */}
            <SLabel label="Choisir un artiste" color={C.accent} C={C}/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
              {ARTISTS.map(a=>(
                <div key={a.id} onClick={()=>setArtistSel(a)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:12,border:`1.5px solid ${selectedArtist.id===a.id?C.accent:C.border}`,background:selectedArtist.id===a.id?`${C.accent}10`:C.card,cursor:"pointer",transition:"all .2s"}}>
                  <img src={a.cover} alt="" style={{width:28,height:28,borderRadius:7,objectFit:"cover"}}/>
                  <span style={{fontSize:12,fontWeight:600,color:selectedArtist.id===a.id?C.accent:C.text}}>{a.name}</span>
                </div>
              ))}
            </div>

            {/* Don */}
            <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,padding:"22px",marginBottom:16}}>
              <SLabel label="Don libre — 90% à l'artiste" color={C.accent} C={C}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                {[2,5,10,20].map(v=>(
                  <button key={v} onClick={()=>{setDonAmt(v);setDonCust("");}} style={{padding:"12px 0",borderRadius:10,border:`2px solid ${!donCust&&donAmt===v?C.accent:C.border}`,background:!donCust&&donAmt===v?`${C.accent}18`:C.card2,color:!donCust&&donAmt===v?C.accent:C.text,fontWeight:700,fontSize:16,cursor:"pointer",transition:"all .2s"}}>{v}€</button>
                ))}
              </div>
              <div style={{position:"relative",marginBottom:16}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:14}}>€</span>
                <input type="number" placeholder="Autre montant…" value={donCust} onChange={e=>setDonCust(e.target.value)} style={{width:"100%",padding:"11px 12px 11px 28px",background:C.card2,border:`1px solid ${donCust?C.accent:C.border}`,borderRadius:11,color:C.text,fontSize:14}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=donCust?C.accent:C.border}/>
              </div>
              <InfoBox label={`Don à ${selectedArtist.name}`} value={fmtE(finalDon)} note={`90% à l'artiste · 10% Vizion 2.0`} C={C}/>
              {donOk && <SuccessBanner text={`Don envoyé à ${selectedArtist.name} !`} C={C}/>}
              <BigBtn onClick={()=>simPay(()=>setDonOk(true))} disabled={finalDon<=0||paying} loading={paying} color={C.accent}>Envoyer {fmtE(finalDon)}</BigBtn>
            </div>

            {/* Abonnement */}
            <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,padding:"22px"}}>
              <SLabel label="Abonnement — 90% à l'artiste" color={C.accent2} C={C}/>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                {PLANS.map(plan=>(
                  <div key={plan.id} onClick={()=>setSelPlan(plan)} style={{padding:"14px 16px",borderRadius:13,cursor:"pointer",border:`2px solid ${selPlan.id===plan.id?C.accent2:C.border}`,background:selPlan.id===plan.id?`${C.accent2}10`:C.card2,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,marginBottom:4,color:selPlan.id===plan.id?C.accent2:C.text}}>{plan.label}</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{plan.perks.map(p=><span key={p} style={{fontSize:10,color:C.muted}}>· {p}</span>)}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,color:selPlan.id===plan.id?C.accent2:C.text}}>{plan.price}€</div>
                      <div style={{fontSize:10,color:C.muted}}>/mois</div>
                    </div>
                  </div>
                ))}
              </div>
              <InfoBox label={`Abonnement ${selPlan.label}`} value={`${selPlan.price}€/mois`} note={`90% à ${selectedArtist.name} · 10% Vizion 2.0`} C={C}/>
              {subOk && <SuccessBanner text={`Abonnement ${selPlan.label} activé !`} C={C}/>}
              <BigBtn onClick={()=>simPay(()=>setSubOk(true))} disabled={paying} loading={paying} color={C.accent2}>S'abonner · {selPlan.price}€/mois</BigBtn>
            </div>
          </div>
        )}

        {/* ════ ARTIST SCREENS ════ */}

        {/* Publier — Audio en haut, Vidéo en dessous */}
        {mode==="artist" && artTab==="upload" && (
          <div style={{padding:isMobile?"14px 12px":(isTablet?"18px 20px":"24px 32px"),maxWidth:isMobile?"100%":(isTablet?680:760),margin:"0 auto",animation:"fadeUp .35s ease both",width:"100%"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,marginBottom:4}}>Publier du contenu</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:24}}>Audio et vidéo depuis cette même page</div>

            {/* AUDIO */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{height:1,flex:1,background:`linear-gradient(to right,${C.accent}44,transparent)`}}/>
              <span style={{fontSize:11,fontWeight:700,color:C.accent,letterSpacing:1.5,textTransform:"uppercase"}}>Titre Audio</span>
              <div style={{height:1,flex:1,background:`linear-gradient(to left,${C.accent}44,transparent)`}}/>
            </div>
            {audioOk && <SuccessBanner text="Titre publié avec succès !" C={C}/>}
            <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,padding:"20px",marginBottom:32}}>
              <div onClick={()=>audioRef.current?.click()} style={{border:`2px dashed ${audioFile?C.accent:C.border}`,borderRadius:12,padding:"22px",textAlign:"center",cursor:"pointer",marginBottom:18,transition:"all .2s",background:audioFile?`${C.accent}06`:"transparent"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=audioFile?C.accent:C.border}>
                <div style={{color:audioFile?C.accent:C.muted,marginBottom:6,display:"flex",justifyContent:"center"}}><IUpload s={24}/></div>
                {audioFile?<><div style={{fontWeight:700,color:C.accent}}>{audioFile.name}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{(audioFile.size/1024/1024).toFixed(1)} MB</div></>:<><div style={{fontWeight:600,marginBottom:2}}>Clique pour choisir ton fichier audio</div><div style={{fontSize:12,color:C.muted}}>MP3 · WAV · FLAC · Max 50MB</div></>}
                <input ref={audioRef} type="file" accept="audio/*" onChange={e=>{const f=e.target.files?.[0];if(f){setAudioFile(f);if(!audioTitle)setAudioTitle(f.name.replace(/\.[^.]+$/,""));}}} style={{display:"none"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"80px 1fr",gap:14,marginBottom:16}}>
                <div>
                  <FLabel C={C}>Pochette</FLabel>
                  <div onClick={()=>coverRef.current?.click()} style={{width:80,height:80,borderRadius:11,overflow:"hidden",background:C.card2,border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    {coverPrev?<img src={coverPrev} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{color:C.muted,textAlign:"center"}}><IUpload s={16}/><div style={{fontSize:9,marginTop:2}}>Ajouter</div></div>}
                  </div>
                  <input ref={coverRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f)setCoverPrev(URL.createObjectURL(f));}} style={{display:"none"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div><FLabel C={C}>Titre *</FLabel><FInput value={audioTitle} onChange={setAudioTitle} placeholder="Ex: Lumière Froide" C={C}/></div>
                  <div>
                    <FLabel C={C}>Accès</FLabel>
                    <div style={{display:"flex",gap:7}}>
                      {[["public","Public"],["super","Super Team"],["vip","VIP"]].map(([v,l])=>(
                        <button key={v} onClick={()=>setAudioAccess(v)} style={{flex:1,padding:"7px 4px",borderRadius:9,border:`2px solid ${audioAccess===v?C.accent:C.border}`,background:audioAccess===v?`${C.accent}15`:C.card2,color:audioAccess===v?C.accent:C.muted,fontSize:11,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <BigBtn onClick={uploadAudio} disabled={!audioFile||!audioTitle||audioLoading} loading={audioLoading} color={C.accent}><IUpload s={14}/>Publier le titre</BigBtn>
            </div>

            {/* VIDEO */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{height:1,flex:1,background:`linear-gradient(to right,${C.accent2}44,transparent)`}}/>
              <span style={{fontSize:11,fontWeight:700,color:C.accent2,letterSpacing:1.5,textTransform:"uppercase"}}>Vidéo</span>
              <div style={{height:1,flex:1,background:`linear-gradient(to left,${C.accent2}44,transparent)`}}/>
            </div>
            <div style={{padding:"8px 14px",borderRadius:10,background:`${C.accent2}08`,border:`1px solid ${C.accent2}22`,marginBottom:14,fontSize:12,color:C.muted}}>
              <span style={{color:C.accent2,fontWeight:600}}>Super Team</span> → Clips officiels &nbsp;·&nbsp; <span style={{color:"#F5C842",fontWeight:600}}>VIP</span> → Live studio + Making of
            </div>
            {videoOk && <SuccessBanner text="Vidéo publiée avec succès !" C={C}/>}
            <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,padding:"20px"}}>
              <div onClick={()=>videoRef.current?.click()} style={{border:`2px dashed ${videoFile?C.accent2:C.border}`,borderRadius:12,padding:"22px",textAlign:"center",cursor:"pointer",marginBottom:16,transition:"all .2s",background:videoFile?`${C.accent2}06`:"transparent"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent2} onMouseLeave={e=>e.currentTarget.style.borderColor=videoFile?C.accent2:C.border}>
                <div style={{color:videoFile?C.accent2:C.muted,marginBottom:6,display:"flex",justifyContent:"center"}}><IVideo s={24}/></div>
                {videoFile?<><div style={{fontWeight:700,color:C.accent2}}>{videoFile.name}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{(videoFile.size/1024/1024).toFixed(1)} MB</div></>:<><div style={{fontWeight:600,marginBottom:2}}>Clique pour choisir ta vidéo</div><div style={{fontSize:12,color:C.muted}}>MP4 · MOV · Max 500MB</div></>}
                <input ref={videoRef} type="file" accept="video/*" onChange={e=>{const f=e.target.files?.[0];if(f){setVideoFile(f);if(!videoTitle)setVideoTitle(f.name.replace(/\.[^.]+$/,""));}}} style={{display:"none"}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
                <div><FLabel C={C}>Titre de la vidéo *</FLabel><FInput value={videoTitle} onChange={setVideoTitle} placeholder="Ex: Lumière Froide — Clip officiel" C={C}/></div>
                <div>
                  <FLabel C={C}>Accès</FLabel>
                  <div style={{display:"flex",gap:7}}>
                    {[["public","Public"],["super","Super Team"],["vip","VIP"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setVideoAccess(v)} style={{flex:1,padding:"7px 4px",borderRadius:9,border:`2px solid ${videoAccess===v?C.accent2:C.border}`,background:videoAccess===v?`${C.accent2}15`:C.card2,color:videoAccess===v?C.accent2:C.muted,fontSize:11,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
              <BigBtn onClick={uploadVideo} disabled={!videoFile||!videoTitle||videoLoading} loading={videoLoading} color={C.accent2}><IVideo s={14}/>Publier la vidéo</BigBtn>
            </div>
          </div>
        )}

        {/* SACEM */}
        {mode==="artist" && artTab==="sacem" && (
          <div style={{padding:isMobile?"14px 12px":(isTablet?"18px 20px":"28px"),maxWidth:700,margin:"0 auto",animation:"fadeUp .35s ease both"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:24,marginBottom:4}}>Dépôt SACEM</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:20}}>Enregistrement de titre via Vizion 2.0 Music Publishing</div>

            {sacemOk ? (
              <div style={{textAlign:"center",padding:"60px 0"}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><ICheck s={28} c="#fff"/></div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:24,marginBottom:8}}>Titre déposé !</div>
                <div style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:20}}>Dépôt SACEM sous 5 jours ouvrés.<br/>Contrat de mandat d'édition envoyé par email.</div>
                <div style={{padding:"12px 20px",borderRadius:12,background:`${C.accent}10`,border:`1px solid ${C.accent}22`,fontSize:12,color:C.accent,fontWeight:600,display:"inline-block",marginBottom:24}}>Référence VIS-{Date.now().toString().slice(-6)}</div>
                <br/><button onClick={()=>setSacemOk(false)} style={{padding:"11px 24px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",fontWeight:700,cursor:"pointer"}}>Déposer un autre titre</button>
              </div>
            ):(
              <>
                {/* ── EXPLICATIONS ── */}
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>

                  {/* Cas 1 — Pas d'éditeur → Vizion 2.0 édite */}
                  <div style={{padding:"16px 18px",borderRadius:14,background:`${C.accent2}08`,border:`1px solid ${C.accent2}22`}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.accent2,marginBottom:6}}>Tu n'as pas d'éditeur — Vizion 2.0 peut t'éditer</div>
                    <div style={{fontSize:12,color:C.muted,lineHeight:1.7}}>
                      Si toi (l'artiste) ou ton beatmaker êtes inscrits à la SACEM mais sans éditeur, Vizion 2.0 peut devenir votre éditeur pour ce titre. Tu gardes <strong style={{color:C.accent2}}>100% de ta part auteur/compositeur</strong>. Vizion 2.0 perçoit uniquement la <strong style={{color:C.accent2}}>part éditeur SACEM</strong> (50% des droits d'auteur collectés). Coche la case "Vizion 2.0 m'édite" pour chaque personne concernée.
                    </div>
                  </div>

                  {/* Cas 2 — Déjà un éditeur */}
                  <div style={{padding:"16px 18px",borderRadius:14,background:`${C.accent}08`,border:`1px solid ${C.accent}22`}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.accent,marginBottom:6}}>Tu as déjà un éditeur</div>
                    <div style={{fontSize:12,color:C.muted,lineHeight:1.7}}>
                      Si toi ou ton beatmaker avez déjà un contrat avec un éditeur, déclare ses informations dans le champ prévu. Vizion 2.0 effectue le dépôt sans retenir de commission sur cette part.
                    </div>
                  </div>

                  {/* Pas encore inscrit SACEM */}
                  <div style={{padding:"14px 18px",borderRadius:14,background:C.card2,border:`1px solid ${C.border}`}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.muted,marginBottom:4}}>Pas encore inscrit à la SACEM ?</div>
                    <div style={{fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:8}}>
                      L'adhésion SACEM coûte <strong style={{color:C.text}}>100€ une seule fois</strong> (droit d'entrée, pas de cotisation annuelle). Ce montant est restitué si tu te désinscrits. Vizion 2.0 ne prend rien sur cette démarche — c'est ta propre adhésion.
                    </div>
                    <a href="https://www.sacem.fr/adhesion" target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:9,background:`${C.accent}15`,border:`1px solid ${C.accent}33`,color:C.accent,fontSize:12,fontWeight:700,textDecoration:"none"}}>
                      Adhérer sur sacem.fr →
                    </a>
                  </div>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:16}}>

                  {/* Infos titre */}
                  <SBlock title="Informations du titre" color={C.accent} C={C}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div><FLabel C={C}>Titre *</FLabel><FInput value={sacem.title} onChange={v=>setSacem(s=>({...s,title:v}))} placeholder="Ex: Lumière Froide" C={C}/></div>
                      <div>
                        <FLabel C={C}>Genre SACEM *</FLabel>
                        <select value={sacem.genre} onChange={e=>setSacem(s=>({...s,genre:e.target.value}))} style={{width:"100%",padding:"11px 13px",borderRadius:11,background:C.card2,border:`1px solid ${C.border}`,color:sacem.genre?C.text:C.muted,fontSize:13,cursor:"pointer"}}>
                          <option value="">Sélectionner…</option>
                          {GENRES_SACEM.map(g=><option key={g}>{g}</option>)}
                        </select>
                      </div>
                      <div><FLabel C={C}>Code ISRC</FLabel><FInput value={sacem.isrc} onChange={v=>setSacem(s=>({...s,isrc:v}))} placeholder="FRXXX2500001" C={C}/></div>
                      <div><FLabel C={C}>Date de sortie</FLabel><FInput value={sacem.releaseDate} onChange={v=>setSacem(s=>({...s,releaseDate:v}))} placeholder="JJ/MM/AAAA" C={C}/></div>
                    </div>
                  </SBlock>

                  {/* Auteurs + Compositeurs */}
                  {[{field:"authors",title:"Auteurs (paroles)",color:C.accent},{field:"composers",title:"Compositeurs (musique)",color:C.accent2}].map(({field,title,color})=>(
                    <SBlock key={field} title={title} color={color} C={C}>
                      {sacem[field].map((p,i)=>(
                        <div key={i} style={{marginBottom:12}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 70px auto",gap:8,marginBottom:6,alignItems:"end"}}>
                            <div><FLabel C={C}>{i===0?"Nom complet *":""}</FLabel><FInput value={p.name} onChange={v=>setSacem(s=>({...s,[field]:s[field].map((x,j)=>j===i?{...x,name:v}:x)}))} placeholder="Prénom Nom" C={C}/></div>
                            <div><FLabel C={C}>{i===0?"N° SACEM":""}</FLabel><FInput value={p.num} onChange={v=>setSacem(s=>({...s,[field]:s[field].map((x,j)=>j===i?{...x,num:v}:x)}))} placeholder="123456789" C={C}/></div>
                            <div><FLabel C={C}>{i===0?"Part %":""}</FLabel><FInput value={p.share} onChange={v=>setSacem(s=>({...s,[field]:s[field].map((x,j)=>j===i?{...x,share:v}:x)}))} placeholder="50" C={C}/></div>
                            {i>0&&<button onClick={()=>setSacem(s=>({...s,[field]:s[field].filter((_,j)=>j!==i)}))} style={{padding:"11px",borderRadius:9,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:13}}>✕</button>}
                          </div>
                          {/* Éditeur pour cet auteur/compositeur */}
                          <div style={{display:"flex",gap:8,marginBottom:p.hasEditor?8:0}}>
                            <button onClick={()=>setSacem(s=>({...s,[field]:s[field].map((x,j)=>j===i?{...x,hasEditor:true,editorName:"",editorNum:"",editorShare:""}:x)}))} style={{padding:"4px 12px",borderRadius:8,border:`1px solid ${p.hasEditor?color:C.border}`,background:p.hasEditor?`${color}15`:"transparent",color:p.hasEditor?color:C.muted,fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>J'ai un éditeur</button>
                            <button onClick={()=>setSacem(s=>({...s,[field]:s[field].map((x,j)=>j===i?{...x,hasEditor:false}:x)}))} style={{padding:"4px 12px",borderRadius:8,border:`1px solid ${!p.hasEditor?C.accent2:C.border}`,background:!p.hasEditor?`${C.accent2}15`:"transparent",color:!p.hasEditor?C.accent2:C.muted,fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>Vizion 2.0 m'édite</button>
                          </div>
                          {p.hasEditor && (
                            <div style={{padding:"12px",borderRadius:11,background:C.card2,border:`1px solid ${C.border}`,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                              <div><FLabel C={C}>Nom de l'éditeur</FLabel><FInput value={p.editorName||""} onChange={v=>setSacem(s=>({...s,[field]:s[field].map((x,j)=>j===i?{...x,editorName:v}:x)}))} placeholder="Ex: Universal Music" C={C}/></div>
                              <div><FLabel C={C}>N° SACEM éditeur</FLabel><FInput value={p.editorNum||""} onChange={v=>setSacem(s=>({...s,[field]:s[field].map((x,j)=>j===i?{...x,editorNum:v}:x)}))} placeholder="123456789" C={C}/></div>
                              <div><FLabel C={C}>Part éditeur %</FLabel><FInput value={p.editorShare||""} onChange={v=>setSacem(s=>({...s,[field]:s[field].map((x,j)=>j===i?{...x,editorShare:v}:x)}))} placeholder="50" C={C}/></div>
                            </div>
                          )}
                        </div>
                      ))}
                      <button onClick={()=>setSacem(s=>({...s,[field]:[...s[field],{name:"",num:"",share:"0",hasEditor:false}]}))} style={{padding:"6px 14px",borderRadius:9,border:`1px solid ${color}44`,background:`${color}10`,color,fontSize:12,fontWeight:600,cursor:"pointer",marginTop:4}}>+ Ajouter</button>
                    </SBlock>
                  ))}

                  {/* Beatmakers */}
                  <SBlock title="Beatmakers / Arrangeurs" color={C.muted} C={C}>
                    <div style={{fontSize:12,color:C.muted,marginBottom:12,lineHeight:1.6}}>
                      Si le beatmaker est inscrit à la SACEM et n'a pas d'éditeur, Vizion 2.0 peut aussi l'éditer. Si il a déjà son propre éditeur, déclare-le ci-dessous.
                    </div>
                    {sacem.beatmakers.map((b,i)=>(
                      <div key={i} style={{marginBottom:16,padding:"14px",borderRadius:12,background:C.card2,border:`1px solid ${C.border}`}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 110px 70px auto",gap:8,marginBottom:10,alignItems:"end"}}>
                          <div><FLabel C={C}>{i===0?"Nom":""}</FLabel><FInput value={b.name} onChange={v=>setSacem(s=>({...s,beatmakers:s.beatmakers.map((x,j)=>j===i?{...x,name:v}:x)}))} placeholder="Prénom Nom" C={C}/></div>
                          <div><FLabel C={C}>{i===0?"N° SACEM":""}</FLabel><FInput value={b.num} onChange={v=>setSacem(s=>({...s,beatmakers:s.beatmakers.map((x,j)=>j===i?{...x,num:v}:x)}))} placeholder="123456789" C={C}/></div>
                          <div>{i===0&&<FLabel C={C}>Rôle</FLabel>}<select value={b.role} onChange={e=>setSacem(s=>({...s,beatmakers:s.beatmakers.map((x,j)=>j===i?{...x,role:e.target.value}:x)}))} style={{width:"100%",padding:"11px 10px",borderRadius:11,background:C.card,border:`1px solid ${C.border}`,color:C.text,fontSize:12,cursor:"pointer"}}>{["Beatmaker","Arrangeur","Co-compositeur"].map(r=><option key={r}>{r}</option>)}</select></div>
                          <div><FLabel C={C}>{i===0?"Part %":""}</FLabel><FInput value={b.share} onChange={v=>setSacem(s=>({...s,beatmakers:s.beatmakers.map((x,j)=>j===i?{...x,share:v}:x)}))} placeholder="0" C={C}/></div>
                          {i>0&&<button onClick={()=>setSacem(s=>({...s,beatmakers:s.beatmakers.filter((_,j)=>j!==i)}))} style={{padding:"11px",borderRadius:9,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",fontSize:13}}>✕</button>}
                        </div>
                        {/* Éditeur du beatmaker */}
                        <div style={{marginBottom:b.hasEditor?10:0}}>
                          <FLabel C={C}>Situation éditoriale du beatmaker</FLabel>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                            <button onClick={()=>setSacem(s=>({...s,beatmakers:s.beatmakers.map((x,j)=>j===i?{...x,hasEditor:false,editorName:"",editorNum:"",editorShare:""}:x)}))} style={{padding:"5px 14px",borderRadius:9,border:`1px solid ${b.hasEditor===false?C.accent2:C.border}`,background:b.hasEditor===false?`${C.accent2}15`:"transparent",color:b.hasEditor===false?C.accent2:C.muted,fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>Vizion 2.0 m'édite</button>
                            <button onClick={()=>setSacem(s=>({...s,beatmakers:s.beatmakers.map((x,j)=>j===i?{...x,hasEditor:true}:x)}))} style={{padding:"5px 14px",borderRadius:9,border:`1px solid ${b.hasEditor===true?C.accent:C.border}`,background:b.hasEditor===true?`${C.accent}15`:"transparent",color:b.hasEditor===true?C.accent:C.muted,fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>J'ai un éditeur</button>
                            <button onClick={()=>setSacem(s=>({...s,beatmakers:s.beatmakers.map((x,j)=>j===i?{...x,hasEditor:null}:x)}))} style={{padding:"5px 14px",borderRadius:9,border:`1px solid ${b.hasEditor===null?C.muted:C.border}`,background:b.hasEditor===null?`${C.muted}10`:"transparent",color:b.hasEditor===null?C.text:C.muted,fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>Non inscrit SACEM</button>
                          </div>
                        </div>
                        {/* Champs éditeur externe du beatmaker */}
                        {b.hasEditor===true && (
                          <div style={{padding:"12px",borderRadius:11,background:C.card,border:`1px solid ${C.accent}33`,marginTop:10}}>
                            <div style={{fontSize:11,color:C.accent,fontWeight:600,marginBottom:8}}>Informations de l'éditeur du beatmaker</div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                              <div><FLabel C={C}>Nom de l'éditeur</FLabel><FInput value={b.editorName||""} onChange={v=>setSacem(s=>({...s,beatmakers:s.beatmakers.map((x,j)=>j===i?{...x,editorName:v}:x)}))} placeholder="Ex: Sony Music Pub." C={C}/></div>
                              <div><FLabel C={C}>N° SACEM éditeur</FLabel><FInput value={b.editorNum||""} onChange={v=>setSacem(s=>({...s,beatmakers:s.beatmakers.map((x,j)=>j===i?{...x,editorNum:v}:x)}))} placeholder="123456789" C={C}/></div>
                              <div><FLabel C={C}>Part éditeur %</FLabel><FInput value={b.editorShare||""} onChange={v=>setSacem(s=>({...s,beatmakers:s.beatmakers.map((x,j)=>j===i?{...x,editorShare:v}:x)}))} placeholder="50" C={C}/></div>
                            </div>
                          </div>
                        )}
                        {/* Vizion 2.0 édite le beatmaker */}
                        {b.hasEditor===false && (
                          <div style={{padding:"10px 12px",borderRadius:11,background:`${C.accent2}08`,border:`1px solid ${C.accent2}22`,marginTop:10,fontSize:11,color:C.accent2}}>
                            Vizion 2.0 devient l'éditeur de ce beatmaker pour ce titre. Il conserve 100% de sa part compositeur.
                          </div>
                        )}
                        {/* Non inscrit SACEM */}
                        {b.hasEditor===null && (
                          <div style={{padding:"10px 12px",borderRadius:11,background:C.card,border:`1px solid ${C.border}`,marginTop:10,fontSize:11,color:C.muted}}>
                            Ce beatmaker ne sera pas déclaré à la SACEM. Encourage-le à s'inscrire sur sacem.fr pour percevoir ses droits.
                          </div>
                        )}
                      </div>
                    ))}
                    <button onClick={()=>setSacem(s=>({...s,beatmakers:[...s.beatmakers,{name:"",num:"",role:"Beatmaker",share:"0",hasEditor:false}]}))} style={{padding:"6px 14px",borderRadius:9,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:12,fontWeight:600,cursor:"pointer",marginTop:4}}>+ Ajouter un beatmaker</button>
                  </SBlock>

                  {/* Contrat */}
                  <div style={{padding:"14px 16px",borderRadius:12,background:C.card2,border:`1px solid ${C.border}`,fontSize:12,color:C.muted,lineHeight:1.7}}>
                    En soumettant, vous acceptez le mandat d'édition Vizion 2.0 Music Publishing et certifiez être titulaire des droits sur ce titre.
                  </div>
                  <BigBtn onClick={submitSacem} disabled={!sacem.title||!sacem.genre||sacemLoad} loading={sacemLoad} color={C.accent}><IDoc s={15}/>Soumettre le dépôt SACEM</BigBtn>
                </div>
              </>
            )}
          </div>
        )}

        {/* Dashboard */}
        {mode==="artist" && artTab==="dashboard" && (
          <div style={{padding:isMobile?"14px 12px":(isTablet?"18px 20px":"28px"),animation:"fadeUp .35s ease both"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:isMobile?20:24,marginBottom:isMobile?14:20}}>Dashboard</div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":(isTablet?"repeat(2,1fr)":"repeat(auto-fill,minmax(160px,1fr))"),gap:isMobile?10:12,marginBottom:isMobile?18:28}}>
              {[{icon:<IBar s={20}/>,label:"Revenus ce mois",val:"840 €",color:C.accent},{icon:<IUser s={20}/>,label:"Abonnés actifs",val:"318",color:C.accent2},{icon:<IHeart s={20}/>,label:"Titres publiés",val:"7",color:C.accent},{icon:<IBar s={20}/>,label:"Écoutes totales",val:"28.4k",color:C.accent2}].map(k=>(
                <div key={k.label} style={{padding:"18px",borderRadius:16,background:C.card,border:`1px solid ${C.border}`}}>
                  <div style={{color:k.color,marginBottom:10}}>{k.icon}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:k.color,marginBottom:3}}>{k.val}</div>
                  <div style={{fontSize:11,color:C.muted}}>{k.label}</div>
                </div>
              ))}
            </div>

            <SLabel label="Revenus mensuels" color={C.accent} C={C}/>
            <div style={{padding:"20px",borderRadius:16,background:C.card,border:`1px solid ${C.border}`,marginBottom:24}}>
              <div style={{display:"flex",alignItems:"flex-end",gap:10,height:100}}>
                {MONTHLY_REV.map((m,i)=>{
                  const h=(m.v/maxRev)*100;
                  const last=i===MONTHLY_REV.length-1;
                  return(<div key={m.m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <div style={{fontSize:10,color:last?C.accent:C.muted,fontWeight:last?700:400}}>{m.v}€</div>
                    <div style={{width:"100%",height:`${h}%`,borderRadius:"5px 5px 3px 3px",background:last?`linear-gradient(to top,${C.accent},${C.accent2})`:C.border,minHeight:4,transition:"height .4s"}}/>
                    <div style={{fontSize:10,color:C.muted}}>{m.m}</div>
                  </div>);
                })}
              </div>
            </div>

            <SLabel label="Plans actifs" color={C.accent2} C={C}/>
            <div style={{display:"flex",gap:12}}>
              {[{plan:"Team",count:187,pct:59,color:C.accent},{plan:"Super Team",count:94,pct:30,color:C.accent2},{plan:"VIP",count:37,pct:11,color:"#F5C842"}].map(p=>(
                <div key={p.plan} style={{flex:1,padding:"16px",borderRadius:14,background:C.card,border:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:12,fontWeight:600,color:p.color}}>{p.plan}</span>
                    <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18}}>{p.count}</span>
                  </div>
                  <div style={{height:3,borderRadius:2,background:C.border,overflow:"hidden"}}><div style={{height:"100%",width:`${p.pct}%`,background:p.color}}/></div>
                  <div style={{fontSize:10,color:C.muted,marginTop:5}}>{p.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── PLAYER BAR ── */}
      {playing && (
        <div style={{position:"relative",zIndex:50,flexShrink:0,height:isMobile?60:76,background:`${C.surface}f8`,backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:isMobile?"0 12px":"0 20px",gap:0,transition:"all .4s",marginBottom:isMobile?56:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,width:isMobile?140:200,flexShrink:0}}>
            <div style={{width:isMobile?34:40,height:isMobile?34:40,borderRadius:9,overflow:"hidden",flexShrink:0}}>
              <img src={ARTISTS.find(a=>a.id===track.artistId)?.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
            <div style={{overflow:"hidden",flex:1}}>
              <div style={{fontSize:isMobile?11:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{track.title}</div>
              <div style={{fontSize:isMobile?9:10,color:C.muted}}>{track.artist}</div>
            </div>
            {!isMobile && <button onClick={()=>toggleLike(track.id)} style={{background:"none",border:"none",cursor:"pointer",color:liked.has(track.id)?C.accent2:C.muted,padding:4}}><IHeart s={13} f={liked.has(track.id)}/></button>}
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:isMobile?4:6}}>
            <div style={{display:"flex",alignItems:"center",gap:isMobile?12:16}}>
              <button onClick={()=>{const i=TRACKS.findIndex(t=>t.id===track.id);play(TRACKS[(i-1+TRACKS.length)%TRACKS.length]);}} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,padding:4}}><IPrev s={isMobile?12:14}/></button>
              <button onClick={()=>setPlay(p=>!p)} style={{width:isMobile?32:36,height:isMobile?32:36,borderRadius:"50%",border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 16px ${C.accent}44`}}>
                {playing?<IPause s={isMobile?12:14}/>:<IPlay s={isMobile?12:14}/>}
              </button>
              <button onClick={()=>{const i=TRACKS.findIndex(t=>t.id===track.id);play(TRACKS[(i+1)%TRACKS.length]);}} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,padding:4}}><INext s={isMobile?12:14}/></button>
            </div>
            {!isMobile && (
              <div style={{display:"flex",alignItems:"center",gap:8,width:"100%",maxWidth:440}}>
                <span style={{fontSize:10,color:C.muted,minWidth:28,textAlign:"right"}}>{fmt(progress)}</span>
                <input type="range" min={0} max={track.duration} value={progress} onChange={e=>setProg(Number(e.target.value))} style={{flex:1,background:`linear-gradient(to right,${C.accent} ${(progress/track.duration)*100}%,${C.border} ${(progress/track.duration)*100}%)`}}/>
                <span style={{fontSize:10,color:C.muted,minWidth:28}}>{fmt(track.duration)}</span>
              </div>
            )}
            {isMobile && (
              <div style={{width:"80%",height:2,borderRadius:1,background:C.border,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(progress/track.duration)*100}%`,background:`linear-gradient(to right,${C.accent},${C.accent2})`,transition:"width .5s"}}/>
              </div>
            )}
          </div>
          {!isMobile && (
            <div style={{width:130,display:"flex",alignItems:"center",gap:6,justifyContent:"flex-end",flexShrink:0}}>
              <div style={{color:C.muted}}><IVol s={13}/></div>
              <input type="range" min={0} max={1} step={.01} value={volume} onChange={e=>setVol(Number(e.target.value))} style={{width:70,background:`linear-gradient(to right,${C.accent} ${volume*100}%,${C.border} ${volume*100}%)`}}/>
            </div>
          )}
        </div>
      )}

      {/* ── MODAL AUTH ── */}
      {showAuth && (
      <>
        <div onClick={()=>setShowAuth(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:200}}/>
        <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:201,background:C.card,borderRadius:22,border:`1px solid ${C.border}`,padding:"32px 28px",width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,.6)",animation:"fadeUp .25s ease both"}}>
          <button onClick={()=>setShowAuth(false)} style={{position:"absolute",top:16,right:16,background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:20}}>✕</button>

          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:20}}>
            <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${TEAM_COLORS.accent},${ARTIST_COLORS.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:13,color:"#fff"}}>V</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15}}>VIZION <span style={{color:C.accent}}>2.0</span></span>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:3,padding:3,background:C.surface,borderRadius:12,marginBottom:24}}>
            {[["login","Se connecter"],["signup","S'inscrire"]].map(([id,lbl])=>(
              <button key={id} onClick={()=>{setAuthMode(id);setAuthError("");}} style={{flex:1,padding:"8px",borderRadius:9,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:authMode===id?`linear-gradient(135deg,${C.accent}33,${C.accent2}22)`:"transparent",color:authMode===id?C.accent:C.muted,transition:"all .2s"}}>{lbl}</button>
            ))}
          </div>

          {/* Fields */}
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
            {authMode==="signup" && (
              <div>
                <div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>Nom d'artiste / Pseudo</div>
                <input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Ex: Nova Kael" style={{width:"100%",padding:"12px 14px",borderRadius:12,background:C.card2,border:`1px solid ${C.border}`,color:C.text,fontSize:14}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
              </div>
            )}
            <div>
              <div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>Email</div>
              <input type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="ton@email.com" style={{width:"100%",padding:"12px 14px",borderRadius:12,background:C.card2,border:`1px solid ${C.border}`,color:C.text,fontSize:14}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
            <div>
              <div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>Mot de passe</div>
              <input type="password" value={authPass} onChange={e=>setAuthPass(e.target.value)} placeholder="••••••••" style={{width:"100%",padding:"12px 14px",borderRadius:12,background:C.card2,border:`1px solid ${C.border}`,color:C.text,fontSize:14}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
            {authMode==="signup" && (
              <div onClick={()=>setAuthArt(a=>!a)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:12,border:`1.5px solid ${authArtist?C.accent:C.border}`,background:authArtist?`${C.accent}10`:C.card2,cursor:"pointer",transition:"all .2s"}}>
                <div style={{width:18,height:18,borderRadius:5,background:authArtist?C.accent:C.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
                  {authArtist && <ICheck s={11} c="#fff"/>}
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:authArtist?C.accent:C.text}}>Je suis un artiste</div>
                  <div style={{fontSize:11,color:C.muted}}>Accès upload, SACEM, dashboard</div>
                </div>
              </div>
            )}
          </div>

          {authError && <div style={{padding:"10px 12px",borderRadius:10,background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",fontSize:12,color:"#F87171",marginBottom:14}}>{authError}</div>}

          <button onClick={handleAuth} disabled={authLoad} style={{width:"100%",padding:"14px",borderRadius:13,border:"none",background:authLoad?C.border:`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",fontWeight:700,fontSize:14,cursor:authLoad?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .25s",marginBottom:14}}>
            {authLoad?<span style={{width:15,height:15,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>:authMode==="login"?"Se connecter →":"Créer mon compte →"}
          </button>

          {/* Google */}
          <button style={{width:"100%",padding:"12px",borderRadius:12,border:`1px solid ${C.border}`,background:"transparent",color:C.text,fontWeight:600,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuer avec Google
          </button>
        </div>
      </>
      )}
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────
function SLabel({label,color,C}) {
  return <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><div style={{width:3,height:14,borderRadius:2,background:color}}/><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:C.text}}>{label}</span></div>;
}
function SBlock({title,color,C,children}) {
  return (
    <div style={{padding:"18px",borderRadius:16,background:C.card,border:`1px solid ${C.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><div style={{width:3,height:13,borderRadius:2,background:color}}/><span style={{fontWeight:700,fontSize:13,color}}>{title}</span></div>
      {children}
    </div>
  );
}
function FLabel({C,children}) {
  return <div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>{children}</div>;
}
function FInput({value,onChange,placeholder,C}) {
  return <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"11px 13px",borderRadius:11,background:C.card2,border:`1px solid ${C.border}`,color:C.text,fontSize:13,transition:"border .2s"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>;
}
function BigBtn({onClick,disabled,loading,children,color}) {
  return (
    <button onClick={onClick} disabled={disabled||loading} className="hvr" style={{width:"100%",padding:"14px",borderRadius:13,border:"none",background:disabled||loading?"#2A2A36":`linear-gradient(135deg,${color},#9B6FD4)`,color:disabled?"#7A7890":"#fff",fontWeight:700,fontSize:14,cursor:disabled||loading?"not-allowed":"pointer",transition:"all .25s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
      {loading?<span style={{width:15,height:15,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>:children}
    </button>
  );
}
function InfoBox({label,value,note,C}) {
  return <div style={{padding:"11px 14px",borderRadius:11,background:`${C.accent}08`,border:`1px solid ${C.accent}22`,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,color:C.muted}}>{label}</div>{note&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{note}</div>}</div><span style={{fontWeight:700,color:C.accent,fontSize:14}}>{value}</span></div>;
}
function SuccessBanner({text,C}) {
  return <div style={{padding:"12px 14px",borderRadius:12,background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.25)",fontSize:13,color:"#4ADE80",fontWeight:600,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><ICheck s={14} c="#4ADE80"/>{text}</div>;
}
