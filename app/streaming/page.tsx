"use client";
import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  mint:"#6ECFAA", purple:"#B44FD4", mid:"#9B8EC4", gold:"#F5C842",
  bg:"#0D0D0F", surface:"#141418", card:"#1A1A22", card2:"#20202C",
  border:"#2A2A36", text:"#F0EEF8", muted:"#7A7890",
  success:"#4ADE80", danger:"#F87171", info:"#60A5FA",
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const ARTISTS = [
  { id:1, name:"Nova Kael",    genre:"Afro-Électro",   followers:4120, plays:28400, supporters:142, cover:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80", banner:"https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=900&q=80", color:C.mint,   bio:"Producteur & chanteur afro-électro basé à Paris." },
  { id:2, name:"Lys Paradis",  genre:"Neo-Soul",       followers:7860, plays:51200, supporters:318, cover:"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80", banner:"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&q=80", color:C.purple, bio:"Voix caméléon, âme libre. La neo-soul réinventée." },
  { id:3, name:"Trax Obscur",  genre:"Lo-fi Hip-Hop",  followers:2300, plays:14700, supporters:87,  cover:"https://images.unsplash.com/photo-1571609804016-0ea5a04f05f5?w=400&q=80", banner:"https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&q=80", color:C.mid,    bio:"Beatmaker dans l'ombre. Des boucles lo-fi." },
  { id:4, name:"Éclat Sonore", genre:"Indie Pop",      followers:9100, plays:63000, supporters:401, cover:"https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80", banner:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80", color:C.gold,   bio:"Indie pop solaire pour les grandes routes." },
  { id:5, name:"Miroir Brisé", genre:"Dark Ambient",   followers:1850, plays:9800,  supporters:63,  cover:"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80", banner:"https://images.unsplash.com/photo-1571609804016-0ea5a04f05f5?w=400&q=80", color:"#94a3b8", bio:"Architecte du silence. Ambient sombre." },
  { id:6, name:"Céleste X",    genre:"R&B Alternatif", followers:5400, plays:37200, supporters:229, cover:"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80", banner:"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80", color:C.info,   bio:"R&B qui gratte là où ça fait du bien." },
];

const TRACKS = [
  { id:1, title:"Lumière Froide",   artist:"Nova Kael",    artistId:1, duration:214 },
  { id:2, title:"Nuit Absolue",     artist:"Lys Paradis",  artistId:2, duration:187 },
  { id:3, title:"Béton & Velours",  artist:"Trax Obscur",  artistId:3, duration:243 },
  { id:4, title:"Altitude",         artist:"Éclat Sonore", artistId:4, duration:198 },
  { id:5, title:"Spectre",          artist:"Miroir Brisé", artistId:5, duration:271 },
  { id:6, title:"Fusion Lente",     artist:"Céleste X",    artistId:6, duration:225 },
  { id:7, title:"Origines",         artist:"Nova Kael",    artistId:1, duration:196 },
  { id:8, title:"Velvet Underground",artist:"Lys Paradis", artistId:2, duration:203 },
];

const PLANS = [
  { id:"fan",   label:"Fan",       price:3,  icon:"🎵", perks:["Exclusivités","Badge fan","Newsletter"] },
  { id:"super", label:"Super Fan", price:7,  icon:"⭐", perks:["Tout Fan","Stems","Q&A mensuel","Crédits"] },
  { id:"vip",   label:"VIP",       price:15, icon:"👑", perks:["Tout Super Fan","Appel vidéo","Merch","Early release"] },
];

const NOTIFS_INIT = [
  { id:1, type:"payment",    read:false, time:"2 min",   title:"Nouveau don",          body:"Marie L. t'a envoyé 10 €",              icon:"💸", color:C.mint   },
  { id:2, type:"subscriber", read:false, time:"8 min",   title:"Nouvel abonné",        body:"Thomas B. · Plan Super Fan",            icon:"⭐", color:C.purple },
  { id:3, type:"follower",   read:false, time:"23 min",  title:"Nouveau follower",     body:"Ines K. commence à te suivre",          icon:"👤", color:C.mid    },
  { id:4, type:"milestone",  read:false, time:"1h",      title:"Objectif atteint 🎉", body:"Tu dépasses 300 supporters !",          icon:"🏆", color:C.gold   },
  { id:5, type:"payment",    read:true,  time:"3h",      title:"Abonnement VIP",       body:"Sofia P. · 15 € / mois",               icon:"👑", color:C.gold   },
  { id:6, type:"follower",   read:true,  time:"Hier",    title:"5 nouveaux followers", body:"Lumière Froide est en tendance",        icon:"🔥", color:C.purple },
  { id:7, type:"milestone",  read:true,  time:"2 jours", title:"1 000 écoutes !",      body:"Nuit Absolue cartonne ce mois",         icon:"📈", color:C.info   },
];

const GENRES = ["Afro-Électro","Neo-Soul","Lo-fi Hip-Hop","Indie Pop","Dark Ambient","R&B Alternatif","Rap","Jazz Fusion","Electronic","Pop"];
const MONTHLY_REV = [{m:"Nov",v:210},{m:"Déc",v:380},{m:"Jan",v:290},{m:"Fév",v:520},{m:"Mar",v:610},{m:"Avr",v:840}];

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
const fmt  = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
const fmtK = (n: number) => n>=1000?(n/1000).toFixed(1)+"k":String(n);
const fmtE = (n: number) => `${Number(n).toFixed(2)} €`;

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const GCSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:#2A2A36;border-radius:3px;}
input,textarea,select{outline:none;font-family:'DM Sans',sans-serif;transition:border-color .2s;}
input:focus,textarea:focus,select:focus{border-color:#6ECFAA !important;}
.hvr:hover{opacity:.82;transform:translateY(-1px);}
.row-hvr:hover{background:rgba(110,207,170,.05) !important;}
.card-hvr:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(110,207,170,.12) !important;}
.nb:hover{color:#F0EEF8 !important;}
.notif-row:hover .na{opacity:1 !important;}
.notif-row:hover{background:#20202C !important;}
input[type=range]{-webkit-appearance:none;height:3px;border-radius:2px;outline:none;cursor:pointer;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:11px;height:11px;border-radius:50%;background:#6ECFAA;cursor:pointer;}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes spin{to{transform:rotate(360deg)}}
`;

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function Vision2() {
  const [page,        setPage]      = useState("home");
  const [subPage,     setSubPage]   = useState<string|null>(null);
  const [focusArtist, setFA]        = useState<any>(null);
  const [currentTrack,setTrack]     = useState(TRACKS[0]);
  const [playing,     setPlaying]   = useState(false);
  const [progress,    setProg]      = useState(0);
  const [volume,      setVol]       = useState(0.8);
  const [liked,       setLiked]     = useState<Set<number>>(new Set([2]));
  const [monStep,     setMonStep]   = useState(1);
  const [monPlan,     setMonPlan]   = useState(PLANS[0]);
  const [donAmt,      setDonAmt]    = useState(5);
  const [customDon,   setCustomDon] = useState("");
  const [payMode,     setPayMode]   = useState("card");
  const [cardData,    setCard]      = useState({num:"",exp:"",cvc:"",name:""});
  const [processing,  setProc]      = useState(false);
  const [mySupports,  setMyS]       = useState<Set<number>>(new Set([2]));
  const [successData, setSD]        = useState<any>(null);
  const [notifs,      setNotifs]    = useState(NOTIFS_INIT);
  const [editingProfile,setEditP]   = useState(false);
  const [profileSaved,  setPS]      = useState(false);
  const [uploadedTracks,setUploaded]= useState<any[]>([]);
  const [profile, setProfile] = useState({
    name:"Nova Kael", genre:"Afro-Électro", city:"Paris, France",
    bio:"Producteur & chanteur afro-électro basé à Paris.",
    avatar:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    banner:"https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=900&q=80",
    links:{instagram:"@nova.kael",twitter:"@novakael",spotify:"Nova Kael",website:"novakael.com"},
    stats:{followers:4120,plays:28400,supporters:142,tracks:7},
  });
  const [draft, setDraft] = useState({...profile,links:{...profile.links}});

  const unread = notifs.filter((n:any)=>!n.read).length;

  useEffect(()=>{
    if(!playing) return;
    const iv = setInterval(()=>{
      setProg(p=>{ if(p>=currentTrack.duration){setPlaying(false);return 0;} return p+1; });
    },1000);
    return ()=>clearInterval(iv);
  },[playing,currentTrack]);

  const play  = (t:any)=>{ setTrack(t); setProg(0); setPlaying(true); };
  const prev  = ()=>{ const i=TRACKS.findIndex(t=>t.id===currentTrack.id); play(TRACKS[(i-1+TRACKS.length)%TRACKS.length]); };
  const next  = ()=>{ const i=TRACKS.findIndex(t=>t.id===currentTrack.id); play(TRACKS[(i+1)%TRACKS.length]); };
  const toggleLike = (id:number)=>setLiked((s:Set<number>)=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const nav = (p:string,sub:string|null=null,artist:any=null)=>{ setPage(p); setSubPage(sub); if(artist) setFA(artist); };
  const startSupport   = (a:any)=>{ setFA(a); setMonStep(1); setCustomDon(""); nav("monetisation","support",a); };
  const startSubscribe = (a:any)=>{ setFA(a); setMonStep(1); setMonPlan(PLANS[0]); nav("monetisation","subscribe",a); };
  const simulatePay = ()=>{
    setProc(true);
    setTimeout(()=>{
      setProc(false);
      const isSubscribe = subPage==="subscribe";
      setSD({ artist:focusArtist, amount:isSubscribe?monPlan.price:(customDon?Number(customDon):donAmt), type:isSubscribe?"abonnement":"don", plan:isSubscribe?monPlan:null });
      setMyS((s:Set<number>)=>new Set([...s,focusArtist.id]));
      setSubPage("success");
    },2000);
  };
  const saveProfile = ()=>{ setProfile({...draft,links:{...draft.links}}); setEditP(false); setPS(true); setTimeout(()=>setPS(false),3000); };
  const handleUpload = (e:any)=>{
    const files = Array.from(e.target.files);
    setUploaded((p:any)=>[...p,...(files as File[]).map((f:File,i:number)=>({ id:1000+i+p.length, title:f.name.replace(/\.[^.]+$/,""), artist:"Moi", artistId:99, duration:Math.floor(Math.random()*180)+120 }))]);
  };

  const navItems = [
    { id:"home",        label:"Accueil",       icon:"🏠" },
    { id:"discover",    label:"Découvrir",      icon:"🔍" },
    { id:"monetisation",label:"Soutien",        icon:"❤️" },
    { id:"myspace",     label:"Mon Espace",     icon:"🎤" },
    { id:"profile",     label:"Profil",         icon:"👤" },
    { id:"notifs",      label:"Notifications",  icon:"🔔", badge:unread },
  ];

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{GCSS}</style>

      {/* Ambient */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:"60vw",height:"60vh",background:`radial-gradient(circle,rgba(110,207,170,.06),transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:"-5%",right:"-8%",width:"50vw",height:"50vh",background:`radial-gradient(circle,rgba(180,79,212,.08),transparent 70%)`}}/>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative",zIndex:1}}>

        {/* SIDEBAR */}
        <aside style={{width:210,flexShrink:0,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"22px 14px",gap:2}}>
          <div style={{display:"flex",alignItems:"center",gap:9,paddingLeft:8,marginBottom:28}}>
            <div style={{width:28,height:28,borderRadius:7,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,color:"#fff"}}>V</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,letterSpacing:.5}}>VISION <span style={{color:C.mint}}>2.0</span></span>
          </div>

          {navItems.map((it:any)=>(
            <button key={it.id} className="nb" onClick={()=>{ setPage(it.id); setSubPage(null); }} style={{
              display:"flex",alignItems:"center",gap:10,padding:"9px 11px",borderRadius:10,border:"none",cursor:"pointer",
              background:page===it.id?`linear-gradient(135deg,rgba(110,207,170,.15),rgba(180,79,212,.12))`:"transparent",
              color:page===it.id?C.mint:C.muted,fontWeight:page===it.id?600:400,fontSize:13,
              transition:"all .2s",textAlign:"left",width:"100%",position:"relative",
            }}>
              <span>{it.icon}</span>{it.label}
              {it.badge>0&&<span style={{marginLeft:"auto",minWidth:18,height:18,borderRadius:9,background:`linear-gradient(135deg,${C.purple},${C.mint})`,fontSize:10,fontWeight:800,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{it.badge}</span>}
            </button>
          ))}

          {/* Mini player */}
          <div style={{marginTop:"auto",padding:"12px 8px",borderRadius:12,background:C.card,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:.5,textTransform:"uppercase",marginBottom:8}}>En cours</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:32,height:32,borderRadius:8,overflow:"hidden",flexShrink:0,background:`linear-gradient(135deg,${C.mint}33,${C.purple}33)`}}>
                {ARTISTS.find((a:any)=>a.id===currentTrack.artistId)&&<img src={ARTISTS.find((a:any)=>a.id===currentTrack.artistId)!.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
              </div>
              <div style={{overflow:"hidden",flex:1}}>
                <div style={{fontSize:11,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{currentTrack.title}</div>
                <div style={{fontSize:10,color:C.muted}}>{currentTrack.artist}</div>
              </div>
              <button onClick={()=>setPlaying((p:boolean)=>!p)} style={{background:"none",border:"none",cursor:"pointer",color:playing?C.mint:C.muted,flexShrink:0,padding:2}}>
                {playing?"⏸":"▶"}
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{flex:1,overflowY:"auto",padding:"30px 36px",paddingBottom:100}}>
          {page==="home"         && <HomePage tracks={[...TRACKS,...uploadedTracks]} artists={ARTISTS} onPlay={play} currentTrack={currentTrack} playing={playing} liked={liked} onLike={toggleLike} onArtist={(a:any)=>{setFA(a);setPage("discover");setSubPage("artist-view");}} onSupport={startSupport}/>}
          {page==="discover"     && !subPage && <DiscoverPage artists={ARTISTS} onPlay={play} onArtist={(a:any)=>{setFA(a);setSubPage("artist-view");}} onSupport={startSupport} onSubscribe={startSubscribe}/>}
          {page==="discover"     && subPage==="artist-view" && focusArtist && <ArtistPage artist={focusArtist} tracks={TRACKS.filter((t:any)=>t.artistId===focusArtist.id)} onPlay={play} currentTrack={currentTrack} playing={playing} liked={liked} onLike={toggleLike} onSupport={()=>startSupport(focusArtist)} onSubscribe={()=>startSubscribe(focusArtist)} onBack={()=>setSubPage(null)} mySupports={mySupports}/>}
          {page==="monetisation" && !subPage && <MonetisationHub artists={ARTISTS} mySupports={mySupports} onSupport={startSupport} onSubscribe={startSubscribe}/>}
          {page==="monetisation" && subPage==="support"   && focusArtist && <SupportFlow artist={focusArtist} donAmt={donAmt} setDonAmt={setDonAmt} customDon={customDon} setCustomDon={setCustomDon} step={monStep} setStep={setMonStep} payMode={payMode} setPayMode={setPayMode} cardData={cardData} setCard={setCard} processing={processing} onPay={simulatePay} onBack={()=>setSubPage(null)}/>}
          {page==="monetisation" && subPage==="subscribe"  && focusArtist && <SubscribeFlow artist={focusArtist} plans={PLANS} selectedPlan={monPlan} setSelectedPlan={setMonPlan} step={monStep} setStep={setMonStep} payMode={payMode} setPayMode={setPayMode} cardData={cardData} setCard={setCard} processing={processing} onPay={simulatePay} onBack={()=>setSubPage(null)}/>}
          {page==="monetisation" && subPage==="success"    && successData  && <SuccessView data={successData} onBack={()=>setSubPage(null)}/>}
          {page==="myspace"      && <MySpacePage tracks={uploadedTracks} onUpload={handleUpload} onPlay={play} monthlyRev={MONTHLY_REV}/>}
          {page==="profile"      && <ProfilePage profile={profile} draft={draft} setDraft={setDraft} editing={editingProfile} setEditing={setEditP} saved={profileSaved} onSave={saveProfile} onCancel={()=>{setDraft({...profile,links:{...profile.links}});setEditP(false);}}/>}
          {page==="notifs"       && <NotifsPage notifs={notifs} setNotifs={setNotifs} unread={unread}/>}
        </main>
      </div>

      {/* PLAYER BAR */}
      <PlayerBar track={currentTrack} playing={playing} progress={progress} duration={currentTrack.duration} volume={volume} liked={liked.has(currentTrack.id)} onToggle={()=>setPlaying((p:boolean)=>!p)} onPrev={prev} onNext={next} onSeek={setProg} onVol={setVol} onLike={()=>toggleLike(currentTrack.id)} artists={ARTISTS}/>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
function SLabel({label,color}:{label:string,color:string}) {
  return <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><div style={{width:3,height:16,borderRadius:2,background:color}}/><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16}}>{label}</span></div>;
}
function PageTitle({title,sub}:{title:string,sub?:string}) {
  return <div style={{marginBottom:28}}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,marginBottom:3}}>{title}</div>{sub&&<div style={{color:C.muted,fontSize:13}}>{sub}</div>}</div>;
}
function TrackRow({track,idx,onPlay,active,liked,onLike}:any) {
  return (
    <div className="row-hvr" onClick={onPlay} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 12px",borderRadius:10,cursor:"pointer",transition:"background .2s"}}>
      <div style={{width:22,textAlign:"center",fontSize:13,color:active?C.mint:C.muted,fontWeight:active?700:400}}>{active?"▶":idx}</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:active?C.mint:C.text}}>{track.title}</div><div style={{fontSize:11,color:C.muted}}>{track.artist}</div></div>
      <button onClick={(e:any)=>{e.stopPropagation();onLike();}} style={{background:"none",border:"none",cursor:"pointer",color:liked?C.purple:C.muted,padding:4}}>{liked?"♥":"♡"}</button>
      <div style={{fontSize:11,color:C.muted,minWidth:34,textAlign:"right"}}>{fmt(track.duration)}</div>
    </div>
  );
}
function Btn({onClick,children,outline,color=C.mint}:any) {
  return <button className="hvr" onClick={onClick} style={{padding:"9px 18px",borderRadius:10,border:`1.5px solid ${color}`,background:outline?"transparent":`${color}20`,color,fontWeight:600,fontSize:13,cursor:"pointer",transition:"all .2s"}}>{children}</button>;
}
function BigBtn({onClick,disabled,loading,children,color=C.mint}:any) {
  return <button onClick={onClick} disabled={disabled||loading} style={{width:"100%",padding:"14px",borderRadius:13,border:"none",background:disabled||loading?C.border:`linear-gradient(135deg,${color},${C.purple})`,color:disabled?C.muted:"#fff",fontWeight:700,fontSize:14,cursor:disabled||loading?"not-allowed":"pointer",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>{loading?<span style={{width:14,height:14,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>:children}</button>;
}
function Steps({step,labels}:{step:number,labels:string[]}) {
  return <div style={{display:"flex",alignItems:"center",marginBottom:26}}>{labels.map((l,i)=>{const n=i+1;const done=n<step;const active=n===step;return(<div key={l} style={{display:"flex",alignItems:"center",flex:i<labels.length-1?1:"auto"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0}}><div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:done?C.mint:active?`linear-gradient(135deg,${C.mint},${C.purple})`:C.card,color:done||active?"#fff":C.muted,border:`2px solid ${done||active?"transparent":C.border}`}}>{done?"✓":n}</div><div style={{fontSize:10,color:active?C.mint:C.muted,fontWeight:active?600:400,whiteSpace:"nowrap"}}>{l}</div></div>{i<labels.length-1&&<div style={{flex:1,height:2,background:done?C.mint:C.border,margin:"0 4px",marginBottom:14,transition:"background .3s"}}/>}</div>);})}</div>;
}
function ArtistChip({artist}:any) {
  return <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:14,background:C.card,border:`1px solid ${C.border}`,marginBottom:24}}><img src={artist.cover} alt="" style={{width:46,height:46,borderRadius:11,objectFit:"cover"}}/><div><div style={{fontWeight:700,fontSize:14}}>{artist.name}</div><div style={{fontSize:11,color:C.muted}}>{artist.genre}</div></div><div style={{marginLeft:"auto",fontSize:12,color:C.muted}}>{fmtK(artist.supporters)} supporters</div></div>;
}
function AmountBox({label,artist,amount,note}:any) {
  return <div style={{padding:"13px 15px",borderRadius:11,background:`linear-gradient(135deg,rgba(110,207,170,.06),rgba(180,79,212,.06))`,border:`1px solid ${C.border}`,marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:C.muted,fontSize:13}}>{label} — {artist}</span><span style={{fontWeight:700,color:C.mint}}>{fmtE(amount)}</span></div>{note&&<div style={{fontSize:11,color:C.muted}}>{note}</div>}</div>;
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({tracks,artists,onPlay,currentTrack,playing,liked,onLike,onArtist,onSupport}:any) {
  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <PageTitle title="Accueil" sub="Découvre les artistes du moment"/>
      <div style={{borderRadius:20,overflow:"hidden",marginBottom:36,background:`linear-gradient(135deg,${C.card},rgba(110,207,170,.07))`,border:`1px solid ${C.border}`,display:"flex"}}>
        <div style={{position:"relative",width:200,flexShrink:0}}><img src={artists[1].cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to right,transparent 60%,rgba(26,26,34,1))"}}/></div>
        <div style={{padding:"28px 32px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{fontSize:10,color:C.mint,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Artiste en vedette</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,marginBottom:4}}>{artists[1].name}</div>
          <div style={{color:C.muted,fontSize:13,marginBottom:14}}>{artists[1].genre} · {fmtK(artists[1].followers)} abonnés</div>
          <div style={{display:"flex",gap:10}}><Btn onClick={()=>onPlay(tracks.find((t:any)=>t.artistId===2)||tracks[0])}>▶ Écouter</Btn><Btn outline onClick={()=>onSupport(artists[1])}>💸 Soutenir</Btn></div>
        </div>
      </div>
      <SLabel label="Tendances" color={C.purple}/>
      <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:36}}>{tracks.slice(0,6).map((t:any,i:number)=>(<TrackRow key={t.id} track={t} idx={i+1} onPlay={()=>onPlay(t)} active={currentTrack.id===t.id&&playing} liked={liked.has(t.id)} onLike={()=>onLike(t.id)}/>))}</div>
      <SLabel label="Artistes à suivre" color={C.mint}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:14}}>
        {artists.slice(0,4).map((a:any)=>(<div key={a.id} onClick={()=>onArtist(a)} className="card-hvr" style={{borderRadius:14,overflow:"hidden",cursor:"pointer",background:C.card,border:`1px solid ${C.border}`,transition:"all .25s"}}><img src={a.cover} alt="" style={{width:"100%",height:100,objectFit:"cover"}}/><div style={{padding:"10px 12px"}}><div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{a.name}</div><div style={{fontSize:11,color:C.muted}}>{a.genre}</div></div></div>))}
      </div>
    </div>
  );
}

// ─── DISCOVER ─────────────────────────────────────────────────────────────────
function DiscoverPage({artists,onPlay,onArtist,onSupport,onSubscribe}:any) {
  const [search,setSearch]=useState("");
  const [genre,setGenre]=useState("Tous");
  const allGenres=["Tous",...new Set(artists.map((a:any)=>a.genre))];
  const filtered=artists.filter((a:any)=>{const q=search.toLowerCase();return(genre==="Tous"||a.genre===genre)&&(a.name.toLowerCase().includes(q)||a.genre.toLowerCase().includes(q));});
  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <PageTitle title="Découvrir" sub="Explore les artistes en développement"/>
      <div style={{display:"flex",gap:12,marginBottom:20}}>
        <div style={{position:"relative",flex:1,maxWidth:360}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted}}>🔍</span>
          <input value={search} onChange={(e:any)=>setSearch(e.target.value)} placeholder="Rechercher…" style={{width:"100%",padding:"11px 14px 11px 36px",background:C.card,border:`1px solid ${C.border}`,borderRadius:11,color:C.text,fontSize:13}}/>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          {(allGenres as string[]).map((g:string)=>(<button key={g} onClick={()=>setGenre(g)} style={{padding:"7px 13px",borderRadius:20,border:`1.5px solid ${genre===g?C.mint:C.border}`,background:genre===g?`${C.mint}15`:"transparent",color:genre===g?C.mint:C.muted,fontSize:12,fontWeight:genre===g?700:400,cursor:"pointer",transition:"all .2s"}}>{g}</button>))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:18}}>
        {filtered.map((a:any)=>(<div key={a.id} className="card-hvr" onClick={()=>onArtist(a)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"all .25s"}}><div style={{position:"relative",height:150}}><img src={a.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",inset:0,background:`linear-gradient(to top,${C.bg}cc,transparent)`}}/><div style={{position:"absolute",top:10,right:10,fontSize:10,padding:"3px 8px",borderRadius:20,background:`${a.color}33`,color:a.color,fontWeight:700}}>{a.genre}</div></div><div style={{padding:"14px 16px"}}><div style={{fontWeight:700,fontSize:15,marginBottom:6}}>{a.name}</div><div style={{display:"flex",gap:8}} onClick={(e:any)=>e.stopPropagation()}><button className="hvr" onClick={()=>onSupport(a)} style={{flex:1,padding:"7px 0",borderRadius:9,border:"none",background:`${C.mint}20`,color:C.mint,fontSize:11,fontWeight:700,cursor:"pointer"}}>💸 Don</button><button className="hvr" onClick={()=>onSubscribe(a)} style={{flex:1,padding:"7px 0",borderRadius:9,border:"none",background:`${C.purple}20`,color:C.purple,fontSize:11,fontWeight:700,cursor:"pointer"}}>⭐ Abo</button></div></div></div>))}
      </div>
    </div>
  );
}

// ─── ARTIST PAGE ──────────────────────────────────────────────────────────────
function ArtistPage({artist,tracks,onPlay,currentTrack,playing,liked,onLike,onSupport,onSubscribe,onBack,mySupports}:any) {
  return (
    <div style={{animation:"fadeUp .3s ease both"}}>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:20,padding:0}}>← Retour</button>
      <div style={{borderRadius:20,overflow:"hidden",marginBottom:32,border:`1px solid ${C.border}`}}>
        <div style={{position:"relative",height:160}}><img src={artist.banner||artist.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(13,13,15,.95))"}}/><div style={{position:"absolute",bottom:20,left:24,display:"flex",alignItems:"flex-end",gap:16}}><img src={artist.cover} alt="" style={{width:64,height:64,borderRadius:14,objectFit:"cover",border:`3px solid ${C.bg}`}}/><div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,marginBottom:2}}>{artist.name}{mySupports.has(artist.id)&&<span style={{fontSize:10,marginLeft:8,padding:"2px 7px",borderRadius:20,background:`${C.mint}22`,color:C.mint}}>♥ Soutenu</span>}</div><div style={{color:C.muted,fontSize:13}}>{artist.genre}</div></div></div></div>
        <div style={{padding:"16px 24px",background:C.card,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",gap:24}}>{[["followers","Abonnés"],["plays","Écoutes"],["supporters","Supporters"]].map(([k,l])=>(<div key={k}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20}}>{fmtK((artist as any)[k])}</div><div style={{fontSize:11,color:C.muted}}>{l}</div></div>))}</div>
          <div style={{display:"flex",gap:10}}><Btn onClick={onSupport}>💸 Don</Btn><Btn outline onClick={onSubscribe} color={C.purple}>⭐ Abonnement</Btn></div>
        </div>
      </div>
      {artist.bio&&<p style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:28}}>{artist.bio}</p>}
      <SLabel label="Titres" color={artist.color}/>
      {tracks.length>0?<div style={{display:"flex",flexDirection:"column",gap:2}}>{tracks.map((t:any,i:number)=>(<TrackRow key={t.id} track={t} idx={i+1} onPlay={()=>onPlay(t)} active={currentTrack.id===t.id&&playing} liked={liked.has(t.id)} onLike={()=>onLike(t.id)}/>))}</div>:<div style={{color:C.muted,fontSize:13}}>Aucun titre.</div>}
    </div>
  );
}

// ─── MONETISATION ─────────────────────────────────────────────────────────────
function MonetisationHub({artists,mySupports,onSupport,onSubscribe}:any) {
  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <PageTitle title="Soutien Artistes" sub="100% des dons vont directement à l'artiste"/>
      <div style={{display:"flex",gap:12,marginBottom:36}}>{[{icon:"💸",t:"Don libre",d:"0% commission"},{icon:"🎟️",t:"Abonnement",d:"dès 3€/mois"},{icon:"🔐",t:"Sécurisé",d:"Stripe SSL"}].map((c:any)=>(<div key={c.t} style={{flex:1,padding:"16px",borderRadius:14,background:C.card,border:`1px solid ${C.border}`}}><div style={{fontSize:22,marginBottom:8}}>{c.icon}</div><div style={{fontWeight:700,fontSize:13,marginBottom:3}}>{c.t}</div><div style={{color:C.muted,fontSize:12}}>{c.d}</div></div>))}</div>
      <SLabel label="Artistes" color={C.mint}/>
      {artists.map((a:any)=>(<div key={a.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:14,marginBottom:8,transition:"background .2s"}} onMouseEnter={(e:any)=>e.currentTarget.style.background=C.card} onMouseLeave={(e:any)=>e.currentTarget.style.background="transparent"}><img src={a.cover} alt="" style={{width:48,height:48,borderRadius:12,objectFit:"cover",flexShrink:0}}/><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}><span style={{fontWeight:700,fontSize:14}}>{a.name}</span>{mySupports.has(a.id)&&<span style={{fontSize:10,padding:"1px 7px",borderRadius:20,background:`${C.mint}22`,color:C.mint}}>✓</span>}</div><div style={{fontSize:12,color:C.muted}}>{fmtK(a.supporters)} supporters</div></div><div style={{display:"flex",gap:8}}><button className="hvr" onClick={()=>onSupport(a)} style={{padding:"7px 14px",borderRadius:9,border:"none",background:`${C.mint}20`,color:C.mint,fontSize:12,fontWeight:700,cursor:"pointer"}}>Don</button><button className="hvr" onClick={()=>onSubscribe(a)} style={{padding:"7px 14px",borderRadius:9,border:"none",background:`${C.purple}20`,color:C.purple,fontSize:12,fontWeight:700,cursor:"pointer"}}>Abonnement</button></div></div>))}
    </div>
  );
}

// ─── SUPPORT FLOW ─────────────────────────────────────────────────────────────
function SupportFlow({artist,donAmt,setDonAmt,customDon,setCustomDon,step,setStep,payMode,setPayMode,cardData,setCard,processing,onPay,onBack}:any) {
  const final = customDon?Number(customDon):donAmt;
  return (
    <div style={{maxWidth:500,margin:"0 auto",animation:"fadeUp .3s ease both"}}>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:24,padding:0}}>← Retour</button>
      <ArtistChip artist={artist}/>
      <Steps step={step} labels={["Montant","Paiement"]}/>
      {step===1&&(<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>{[2,5,10,20].map((p:number)=>(<button key={p} onClick={()=>{setDonAmt(p);setCustomDon("");}} style={{padding:"13px 0",borderRadius:11,border:`2px solid ${!customDon&&donAmt===p?C.mint:C.border}`,background:!customDon&&donAmt===p?`${C.mint}15`:C.card,color:!customDon&&donAmt===p?C.mint:C.text,fontWeight:700,fontSize:16,cursor:"pointer"}}>{p} €</button>))}</div>
        <div style={{position:"relative",marginBottom:24}}><span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:15}}>€</span><input type="number" placeholder="Autre montant…" value={customDon} onChange={(e:any)=>setCustomDon(e.target.value)} style={{width:"100%",padding:"12px 14px 12px 34px",background:C.card,border:`1px solid ${customDon?C.mint:C.border}`,borderRadius:11,color:C.text,fontSize:14}}/></div>
        <AmountBox label="Don" artist={artist.name} amount={final} note="100% reversé à l'artiste"/>
        <BigBtn onClick={()=>setStep(2)} disabled={final<=0}>Continuer →</BigBtn>
      </div>)}
      {step===2&&<PayStep payMode={payMode} setPayMode={setPayMode} cardData={cardData} setCard={setCard} processing={processing} onPay={onPay} amount={final}/>}
    </div>
  );
}

// ─── SUBSCRIBE FLOW ───────────────────────────────────────────────────────────
function SubscribeFlow({artist,plans,selectedPlan,setSelectedPlan,step,setStep,payMode,setPayMode,cardData,setCard,processing,onPay,onBack}:any) {
  const fee=selectedPlan?+(selectedPlan.price*.1).toFixed(2):0;
  const gets=selectedPlan?+(selectedPlan.price-fee).toFixed(2):0;
  return (
    <div style={{maxWidth:520,margin:"0 auto",animation:"fadeUp .3s ease both"}}>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:24,padding:0}}>← Retour</button>
      <ArtistChip artist={artist}/>
      <Steps step={step} labels={["Plan","Paiement"]}/>
      {step===1&&(<div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>{plans.map((plan:any)=>(<div key={plan.id} onClick={()=>setSelectedPlan(plan)} style={{padding:"16px 18px",borderRadius:14,cursor:"pointer",border:`2px solid ${selectedPlan?.id===plan.id?C.purple:C.border}`,background:selectedPlan?.id===plan.id?`${C.purple}10`:C.card,transition:"all .2s",display:"flex",gap:12,alignItems:"flex-start"}}><span style={{fontSize:22}}>{plan.icon}</span><div style={{flex:1}}><div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:6}}><span style={{fontWeight:700}}>{plan.label}</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,color:selectedPlan?.id===plan.id?C.purple:C.text}}>{plan.price} €</span><span style={{color:C.muted,fontSize:12}}>/mois</span></div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{plan.perks.map((pk:string)=>(<span key={pk} style={{fontSize:11,color:C.muted}}>✓ {pk}</span>))}</div></div></div>))}</div>
        {selectedPlan&&<AmountBox label="Abonnement" artist={artist.name} amount={selectedPlan.price} note={`Vision 2.0 : 10% · ${artist.name} reçoit ${fmtE(gets)}`}/>}
        <BigBtn onClick={()=>setStep(2)} disabled={!selectedPlan} color={C.purple}>Continuer →</BigBtn>
      </div>)}
      {step===2&&selectedPlan&&<PayStep payMode={payMode} setPayMode={setPayMode} cardData={cardData} setCard={setCard} processing={processing} onPay={onPay} amount={selectedPlan.price} color={C.purple}/>}
    </div>
  );
}

// ─── PAY STEP ─────────────────────────────────────────────────────────────────
function PayStep({payMode,setPayMode,cardData,setCard,processing,onPay,amount,color=C.mint}:any) {
  const fmtNum=(v:string)=>v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp=(v:string)=>{const d=v.replace(/\D/g,"").slice(0,4);return d.length>2?d.slice(0,2)+"/"+d.slice(2):d;};
  const valid=cardData.num.replace(/\s/g,"").length===16&&cardData.exp.length===5&&cardData.cvc.length===3&&cardData.name.length>2;
  return (
    <div>
      <div style={{display:"flex",gap:6,padding:4,background:C.card,borderRadius:11,width:"fit-content",marginBottom:22}}>{[["card","💳 Carte"],["crypto","₿ Crypto"]].map(([id,lbl])=>(<button key={id} onClick={()=>setPayMode(id)} style={{padding:"7px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:payMode===id?`${color}22`:"transparent",color:payMode===id?color:C.muted,transition:"all .2s"}}>{lbl}</button>))}</div>
      {payMode==="card"?(<div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:22}}>{[{lbl:"Titulaire",ph:"Jean Dupont",key:"name",fn:(v:string)=>v},{lbl:"N° de carte",ph:"1234 5678 9012 3456",key:"num",fn:fmtNum},{lbl:"Expiration",ph:"MM/AA",key:"exp",fn:fmtExp},{lbl:"CVC",ph:"123",key:"cvc",fn:(v:string)=>v.replace(/\D/g,"").slice(0,3)}].map((f:any)=>(<div key={f.key}><div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>{f.lbl}</div><input value={cardData[f.key]} onChange={(e:any)=>setCard((c:any)=>({...c,[f.key]:f.fn(e.target.value)}))} placeholder={f.ph} style={{width:"100%",padding:"11px 13px",background:C.card,border:`1px solid ${C.border}`,borderRadius:10,color:C.text,fontSize:13}}/></div>))}<div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.muted}}>🔒 Sécurisé par <span style={{color:"#635BFF",fontWeight:700}}>Stripe</span></div></div>):(<div style={{padding:"28px",textAlign:"center",borderRadius:14,background:C.card,border:`1px dashed ${C.border}`,marginBottom:22}}><div style={{fontSize:32,marginBottom:10}}>₿</div><div style={{fontWeight:700,marginBottom:6}}>Paiement crypto</div><div style={{color:C.muted,fontSize:12,marginBottom:14}}>Bitcoin · Ethereum · USDC</div><div style={{padding:"8px 14px",background:C.card2,borderRadius:9,fontFamily:"monospace",fontSize:11,color:C.mint}}>0x4f3a...b92e (demo)</div></div>)}
      <BigBtn onClick={onPay} disabled={payMode==="card"&&!valid} loading={processing} color={color}>{`Confirmer · ${fmtE(amount)}`}</BigBtn>
    </div>
  );
}

// ─── SUCCESS ──────────────────────────────────────────────────────────────────
function SuccessView({data,onBack}:any) {
  return (
    <div style={{maxWidth:420,margin:"0 auto",textAlign:"center",paddingTop:20,animation:"fadeUp .4s ease both"}}>
      <div style={{width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28,boxShadow:`0 0 36px ${C.mint}44`}}>✓</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,marginBottom:8}}>{data.type==="don"?"Don envoyé !":"Abonnement activé !"}</div>
      <div style={{color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:28}}>{data.type==="don"?`${data.artist.name} reçoit ${fmtE(data.amount)}. Merci !`:`Plan ${data.plan.label} activé chez ${data.artist.name}.`}</div>
      <BigBtn onClick={onBack}>Retour aux artistes</BigBtn>
    </div>
  );
}

// ─── MY SPACE ─────────────────────────────────────────────────────────────────
function MySpacePage({tracks,onUpload,onPlay,monthlyRev}:any) {
  const fileRef=useRef<any>();
  const maxRev=Math.max(...monthlyRev.map((m:any)=>m.v));
  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <PageTitle title="Mon Espace Artiste" sub="Gère ta musique et tes statistiques"/>
      <div style={{display:"flex",gap:14,marginBottom:32}}>{[{icon:"📈",lbl:"Écoutes",val:"12.4k",c:C.mint},{icon:"👥",lbl:"Abonnés",val:"340",c:C.purple},{icon:"💰",lbl:"Ce mois",val:"840 €",c:C.gold},{icon:"🎵",lbl:"Titres",val:String(7+tracks.length),c:C.mid}].map((s:any)=>(<div key={s.lbl} style={{flex:1,padding:"18px",borderRadius:16,background:C.card,border:`1px solid ${C.border}`}}><div style={{fontSize:20,marginBottom:8}}>{s.icon}</div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:24,color:s.c}}>{s.val}</div><div style={{fontSize:11,color:C.muted,marginTop:3}}>{s.lbl}</div></div>))}</div>
      <SLabel label="Revenus mensuels" color={C.purple}/>
      <div style={{padding:"20px",borderRadius:16,background:C.card,border:`1px solid ${C.border}`,marginBottom:32}}><div style={{display:"flex",alignItems:"flex-end",gap:10,height:100}}>{monthlyRev.map((m:any,i:number)=>{const h=(m.v/maxRev)*100;const last=i===monthlyRev.length-1;return(<div key={m.m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><div style={{fontSize:10,color:last?C.mint:C.muted,fontWeight:last?700:400}}>{m.v}€</div><div style={{width:"100%",height:`${h}%`,borderRadius:"5px 5px 3px 3px",background:last?`linear-gradient(to top,${C.mint},${C.purple})`:C.border,minHeight:4}}/><div style={{fontSize:10,color:C.muted}}>{m.m}</div></div>);})}</div></div>
      <SLabel label="Upload tes titres" color={C.mint}/>
      <div onClick={()=>fileRef.current.click()} style={{border:`2px dashed ${C.border}`,borderRadius:16,padding:"32px",textAlign:"center",cursor:"pointer",marginBottom:tracks.length?24:0,transition:"all .2s"}} onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor=C.mint;e.currentTarget.style.background=`${C.mint}05`;}} onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent";}}>
        <div style={{fontSize:28,marginBottom:10}}>⬆️</div><div style={{fontWeight:600,marginBottom:3}}>Dépose tes fichiers audio ici</div><div style={{color:C.muted,fontSize:12}}>MP3 · WAV · FLAC</div>
        <input ref={fileRef} type="file" accept="audio/*" multiple onChange={onUpload} style={{display:"none"}}/>
      </div>
      {tracks.length>0&&<><SLabel label="Mes titres" color={C.mint}/><div style={{display:"flex",flexDirection:"column",gap:2}}>{tracks.map((t:any,i:number)=>(<TrackRow key={t.id} track={t} idx={i+1} onPlay={()=>onPlay(t)} active={false} liked={false} onLike={()=>{}}/>))}</div></>}
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfilePage({profile,draft,setDraft,editing,setEditing,saved,onSave,onCancel}:any) {
  const avatarRef=useRef<any>();
  const bannerRef=useRef<any>();
  const data=editing?draft:profile;
  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
        <PageTitle title="Mon Profil" sub="Ce que les fans voient sur ta page"/>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {saved&&<span style={{fontSize:13,color:C.success,fontWeight:600}}>✓ Sauvegardé</span>}
          {!editing?(<button className="hvr" onClick={()=>setEditing(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:11,border:`1px solid ${C.mint}44`,background:`${C.mint}15`,color:C.mint,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>✏️ Modifier</button>):(<div style={{display:"flex",gap:8}}><button className="hvr" onClick={onCancel} style={{padding:"9px 16px",borderRadius:11,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:13,fontWeight:600,cursor:"pointer"}}>Annuler</button><button className="hvr" onClick={onSave} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>💾 Sauvegarder</button></div>)}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:editing?"1fr 1fr":"1fr",gap:24}}>
        <div>
          <div style={{borderRadius:18,overflow:"hidden",border:`1px solid ${C.border}`,marginBottom:editing?0:20}}>
            <div style={{position:"relative",height:130}}><img src={data.banner} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 50%,rgba(26,26,34,.9))"}}/>{editing&&<button onClick={()=>bannerRef.current.click()} style={{position:"absolute",top:10,right:10,padding:"5px 11px",borderRadius:8,border:"none",cursor:"pointer",background:"rgba(0,0,0,.6)",color:"#fff",fontSize:11,fontWeight:600}}>📷 Bannière</button>}<input ref={bannerRef} type="file" accept="image/*" onChange={(e:any)=>{const f=e.target.files[0];if(f)setDraft((d:any)=>({...d,banner:URL.createObjectURL(f)}));}} style={{display:"none"}}/><div style={{position:"absolute",bottom:-24,left:20}}><div style={{position:"relative",width:60,height:60}}><img src={data.avatar} alt="" style={{width:60,height:60,borderRadius:14,objectFit:"cover",border:`3px solid ${C.bg}`}}/>{editing&&<button onClick={()=>avatarRef.current.click()} style={{position:"absolute",inset:0,borderRadius:14,border:"none",cursor:"pointer",background:"rgba(0,0,0,.6)",color:"#fff",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>📷</button>}<input ref={avatarRef} type="file" accept="image/*" onChange={(e:any)=>{const f=e.target.files[0];if(f)setDraft((d:any)=>({...d,avatar:URL.createObjectURL(f)}));}} style={{display:"none"}}/><div style={{position:"absolute",bottom:-3,right:-3,width:18,height:18,borderRadius:"50%",background:C.mint,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>✓</div></div></div></div>
            <div style={{padding:"34px 20px 20px",background:C.card}}>
              {!editing?(<><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,marginBottom:3}}>{profile.name}</div><div style={{color:C.muted,fontSize:13,marginBottom:12}}>{profile.genre} · {profile.city}</div><div style={{display:"flex",gap:18,marginBottom:14}}>{Object.entries(profile.stats).map(([k,v]:any)=>(<div key={k}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17}}>{fmtK(v)}</div><div style={{fontSize:10,color:C.muted,textTransform:"capitalize"}}>{k}</div></div>))}</div><p style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{profile.bio}</p></>):(<div style={{display:"flex",flexDirection:"column",gap:12}}>{[["Nom d'artiste","name"],["Genre","genre"],["Ville","city"]].map(([lbl,key])=>(<div key={key}><div style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>{lbl}</div><input value={(draft as any)[key]||""} onChange={(e:any)=>setDraft((d:any)=>({...d,[key]:e.target.value}))} placeholder={lbl} style={{width:"100%",padding:"10px 12px",borderRadius:10,background:C.card2,border:`1px solid ${C.border}`,color:C.text,fontSize:13}}/></div>))}<div><div style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>Bio</div><textarea value={draft.bio||""} onChange={(e:any)=>setDraft((d:any)=>({...d,bio:e.target.value.slice(0,400)}))} rows={4} style={{width:"100%",padding:"10px 12px",borderRadius:10,background:C.card2,border:`1px solid ${C.border}`,color:C.text,fontSize:12,lineHeight:1.6,resize:"none"}}/></div></div>)}
            </div>
          </div>
        </div>
        {editing&&(<div style={{position:"sticky",top:24,alignSelf:"flex-start"}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}><div style={{width:6,height:6,borderRadius:"50%",background:C.success,animation:"pulse 1.5s infinite"}}/><span style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase"}}>Aperçu live</span></div><div style={{borderRadius:16,overflow:"hidden",border:`1px solid ${C.mint}44`,background:C.card,boxShadow:`0 0 24px ${C.mint}15`}}><div style={{position:"relative",height:90}}><img src={draft.banner} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(26,26,34,.9))"}}/><div style={{position:"absolute",bottom:-18,left:16}}><img src={draft.avatar} alt="" style={{width:44,height:44,borderRadius:11,objectFit:"cover",border:`2px solid ${C.bg}`}}/></div></div><div style={{padding:"24px 16px 16px"}}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,marginBottom:1}}>{draft.name||"Nom artiste"}</div><div style={{fontSize:11,color:C.muted,marginBottom:8}}>{draft.genre}</div><div style={{display:"flex",gap:7}}><div style={{flex:1,padding:"7px",textAlign:"center",borderRadius:9,background:`${C.mint}18`,border:`1px solid ${C.mint}33`,fontSize:11,color:C.mint,fontWeight:700}}>Soutenir</div><div style={{flex:1,padding:"7px",textAlign:"center",borderRadius:9,background:C.card2,border:`1px solid ${C.border}`,fontSize:11,color:C.muted}}>Suivre</div></div></div></div></div>)}
      </div>
    </div>
  );
}

// ─── NOTIFS ───────────────────────────────────────────────────────────────────
function NotifsPage({notifs,setNotifs,unread}:any) {
  const [filter,setFilter]=useState("all");
  const markRead=(id:number)=>setNotifs((ns:any)=>ns.map((n:any)=>n.id===id?{...n,read:true}:n));
  const markAll=()=>setNotifs((ns:any)=>ns.map((n:any)=>({...n,read:true})));
  const del=(id:number)=>setNotifs((ns:any)=>ns.filter((n:any)=>n.id!==id));
  const tabs=[{id:"all",lbl:"Tout",icon:"🔔"},{id:"payment",lbl:"Paiements",icon:"💸"},{id:"subscriber",lbl:"Abonnés",icon:"⭐"},{id:"follower",lbl:"Followers",icon:"👤"},{id:"milestone",lbl:"Objectifs",icon:"🏆"}];
  const filtered=filter==="all"?notifs:notifs.filter((n:any)=>n.type===filter);
  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26}}>Notifications</div>{unread>0&&<span style={{padding:"3px 10px",borderRadius:20,background:`linear-gradient(135deg,${C.purple},${C.mint})`,color:"#fff",fontSize:12,fontWeight:700}}>{unread}</span>}</div>
        {unread>0&&<button className="hvr" onClick={markAll} style={{padding:"8px 14px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>Tout marquer lu</button>}
      </div>
      <div style={{display:"flex",gap:7,marginBottom:22,flexWrap:"wrap"}}>{tabs.map((t:any)=>{const cnt=t.id==="all"?notifs.filter((n:any)=>!n.read).length:notifs.filter((n:any)=>n.type===t.id&&!n.read).length;return(<button key={t.id} onClick={()=>setFilter(t.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 13px",borderRadius:20,border:`1.5px solid ${filter===t.id?C.mint:C.border}`,background:filter===t.id?`${C.mint}15`:"transparent",color:filter===t.id?C.mint:C.muted,fontSize:12,fontWeight:filter===t.id?700:400,cursor:"pointer",transition:"all .2s"}}>{t.icon}{t.lbl}{cnt>0&&<span style={{width:16,height:16,borderRadius:"50%",background:filter===t.id?C.mint:C.border,color:filter===t.id?C.bg:C.muted,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{cnt}</span>}</button>);})}</div>
      {filtered.length===0?(<div style={{textAlign:"center",padding:"50px 0",color:C.muted}}><div style={{fontSize:32,marginBottom:10}}>🔔</div><div style={{fontWeight:600}}>Aucune notification</div></div>):(<div style={{display:"flex",flexDirection:"column",gap:3}}>{filtered.map((n:any,i:number)=>(<div key={n.id} className="notif-row" onClick={()=>{if(!n.read)markRead(n.id);}} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",borderRadius:13,cursor:n.read?"default":"pointer",background:n.read?"transparent":`${n.color}07`,border:`1px solid ${n.read?"transparent":`${n.color}1a`}`,transition:"all .2s",animation:`fadeUp .3s ease ${i*25}ms both`}}><div style={{width:38,height:38,borderRadius:11,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,background:`${n.color}18`}}>{n.icon}</div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}><span style={{fontSize:13,fontWeight:n.read?500:700,color:n.read?C.muted:C.text}}>{n.title}</span>{!n.read&&<span style={{width:6,height:6,borderRadius:"50%",background:n.color,flexShrink:0}}/>}</div><div style={{fontSize:11,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.body}</div></div><div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}><span style={{fontSize:10,color:C.muted}}>{n.time}</span><div className="na" style={{display:"flex",gap:4,opacity:0,transition:"opacity .2s"}}>{!n.read&&<button onClick={(e:any)=>{e.stopPropagation();markRead(n.id);}} style={{padding:"2px 7px",borderRadius:6,border:`1px solid ${C.mint}44`,background:`${C.mint}15`,color:C.mint,fontSize:10,fontWeight:700,cursor:"pointer"}}>Lu</button>}<button onClick={(e:any)=>{e.stopPropagation();del(n.id);}} style={{padding:"2px 5px",borderRadius:6,border:`1px solid ${C.danger}30`,background:`${C.danger}10`,color:C.danger,cursor:"pointer",fontSize:11}}>🗑</button></div></div></div>))}</div>)}
    </div>
  );
}

// ─── PLAYER BAR ───────────────────────────────────────────────────────────────
function PlayerBar({track,playing,progress,duration,volume,liked,onToggle,onPrev,onNext,onSeek,onVol,onLike,artists}:any) {
  const art=artists.find((a:any)=>a.id===track.artistId);
  const pct=duration>0?(progress/duration)*100:0;
  return (
    <div style={{position:"relative",zIndex:100,height:80,background:"rgba(14,14,18,.96)",backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 24px",gap:0,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:12,width:220,flexShrink:0}}>
        <div style={{width:44,height:44,borderRadius:10,overflow:"hidden",flexShrink:0,background:`linear-gradient(135deg,${C.mint}33,${C.purple}33)`}}>{art&&<img src={art.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}</div>
        <div style={{overflow:"hidden",flex:1}}><div style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{track.title}</div><div style={{fontSize:11,color:C.muted}}>{track.artist}</div></div>
        <button onClick={onLike} style={{background:"none",border:"none",cursor:"pointer",color:liked?C.purple:C.muted,padding:4}}>{liked?"♥":"♡"}</button>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:7}}>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <button onClick={onPrev} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,padding:4,fontSize:18}}>⏮</button>
          <button onClick={onToggle} style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.mint},${C.purple})`,border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 18px ${C.mint}44`,fontSize:16}}>{playing?"⏸":"▶"}</button>
          <button onClick={onNext} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,padding:4,fontSize:18}}>⏭</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:9,width:"100%",maxWidth:480}}>
          <span style={{fontSize:10,color:C.muted,minWidth:30,textAlign:"right"}}>{fmt(progress)}</span>
          <input type="range" min={0} max={duration} value={progress} onChange={(e:any)=>onSeek(Number(e.target.value))} style={{flex:1,background:`linear-gradient(to right,${C.mint} ${pct}%,${C.border} ${pct}%)`}}/>
          <span style={{fontSize:10,color:C.muted,minWidth:30}}>{fmt(duration)}</span>
        </div>
      </div>
      <div style={{width:150,display:"flex",alignItems:"center",gap:8,justifyContent:"flex-end",flexShrink:0}}>
        <span style={{color:C.muted,fontSize:16}}>🔊</span>
        <input type="range" min={0} max={1} step={.01} value={volume} onChange={(e:any)=>onVol(Number(e.target.value))} style={{width:80,background:`linear-gradient(to right,${C.mint} ${volume*100}%,${C.border} ${volume*100}%)`}}/>
      </div>
    </div>
  );
}
