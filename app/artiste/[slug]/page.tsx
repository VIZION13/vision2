"use client";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";

const C = {
  bg:"#0D0D0F", surface:"#141418", card:"#1A1A22", card2:"#20202C",
  border:"#2A2A36", text:"#F0EEF8", muted:"#7A7890",
  mint:"#6ECFAA", purple:"#B44FD4", gold:"#F5C842",
};

const ARTISTS_DATA: Record<string, any> = {
  "zak-diego": {
    name: "ZAK&DIEGO",
    genre: "Pop Urbain / Afro",
    city: "Marseille",
    bio: "Duo phocéen aux sonorités afro-urbaines. ZAK&DIEGO mêlent pop, rap et influences méditerranéennes pour une signature sonore unique. Marseille dans le sang, le monde en ligne de mire.",
    avatar: "https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/avatar/ZAK%26DIEGO%20PHOTO%20FICHE%20ARTISTE1.jpg",
    banner: "https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/avatar/ZAK%26DIEGO%20PHOTO%20FICHE%20ARTISTE1.jpg",
    instagram: "@zakdiego",
    tiktok: "@zakdiego",
    followers: 0,
    plays: 0,
    supporters: 0,
    tracks: [
      { id:1, title:"Soucis", duration:209, plays:0,
        audio:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/audio/SOUCIS%20MIX_V2_MASTER.mp3",
        cover:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/cover/ZAK%26DIEGO%20SOUCIS%20%20COVER.png" },
    ],
  },
  "carlton": {
    name: "Carlton",
    genre: "Afro Urbain / DJ",
    city: "Marseille",
    bio: "DJ et producteur afro-urbain basé à Marseille. Carlton fusionne les rythmes africains, la trap et l'électro pour des sets et des productions qui font vibrer les dancefloors depuis le Sud.",
    avatar: "https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/avatar/CARLTON%20PHOTO%20FICHE%20ARTISTE1.jpg",
    banner: "https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/avatar/CARLTON%20PHOTO%20FICHE%20ARTISTE1.jpg",
    instagram: "@carltonofficial",
    tiktok: "@carlton",
    followers: 0,
    plays: 0,
    supporters: 0,
    tracks: [
      { id:1, title:"Bali Baba", duration:177, plays:0,
        audio:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/audio/BALI%20%20BABA%203.mp3",
        cover:"https://qhglvqucvlselagsahnh.supabase.co/storage/v1/object/public/cover/CARLTON%20bailababa%20cover.JPG" },
    ],
  },
};

const PLANS = [
  { id:"team",  label:"Team",       price:3,  perks:["Écoute illimitée","Badge Team","Newsletter"] },
  { id:"super", label:"Super Team", price:7,  perks:["Clips exclusifs","Sessions Q&A","Crédits"] },
  { id:"vip",   label:"VIP",        price:15, perks:["Live studio","Appel vidéo","Merch"] },
];

const fmt  = (s:number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
const fmtK = (n:number) => n>=1000?(n/1000).toFixed(1)+"k":String(n);
const fmtE = (n:number) => `${Number(n).toFixed(2)} €`;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
input{outline:none;font-family:'DM Sans',sans-serif;}
.hvr:hover{opacity:.85;transform:translateY(-1px);}
.row:hover{background:rgba(255,255,255,.04)!important;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
`;

export default function ArtistPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const artist = ARTISTS_DATA[slug];

  const [tab,      setTab]     = useState<"titres"|"abos">("titres");
  const [playing,  setPlaying] = useState(false);
  const [curTrack, setCurTrack]= useState<any>(null);
  const [prog,     setProg]    = useState(0);
  const [showDon,  setShowDon] = useState(false);
  const [showSub,  setShowSub] = useState(false);
  const [donAmt,   setDonAmt]  = useState(5);
  const [donCust,  setDonCust] = useState("");
  const [selPlan,  setSelPlan] = useState(PLANS[1]);
  const [donOk,    setDonOk]   = useState(false);
  const [subOk,    setSubOk]   = useState(false);
  const [paying,   setPaying]  = useState(false);

  const playerRef = useRef<HTMLAudioElement>(typeof window !== "undefined" ? new Audio() : null as any);

  useEffect(()=>{
    if(!playing || !playerRef.current) return;
    const iv = setInterval(()=>{
      if(playerRef.current) setProg(Math.floor(playerRef.current.currentTime));
    },500);
    return ()=>clearInterval(iv);
  },[playing]);

  const play = (t:any) => {
    setCurTrack(t); setProg(0); setPlaying(true);
    if(playerRef.current){
      playerRef.current.src = t.audio;
      playerRef.current.load();
      playerRef.current.play().catch(()=>{});
      playerRef.current.onended = ()=>{ setPlaying(false); setProg(0); };
    }
  };

  const togglePlay = () => {
    if(!playerRef.current) return;
    if(!playerRef.current.paused){ playerRef.current.pause(); setPlaying(false); }
    else { playerRef.current.play().catch(()=>{}); setPlaying(true); }
  };

  const simPay = (cb:()=>void) => { setPaying(true); setTimeout(()=>{setPaying(false);cb();},2000); };
  const finalDon = donCust ? Number(donCust) : donAmt;

  if(!artist) return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>🎵</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:24,marginBottom:8}}>Artiste introuvable</div>
        <a href="/streaming" style={{color:C.mint,textDecoration:"none"}}>← Retour à l'app</a>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh"}}>
      <style>{CSS}</style>

      {/* Ambient */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:"60vw",height:"60vh",background:`radial-gradient(circle,${C.mint}08,transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:"-10%",right:"-8%",width:"55vw",height:"55vh",background:`radial-gradient(circle,${C.purple}0a,transparent 70%)`}}/>
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:860,margin:"0 auto",paddingBottom:100}}>

        {/* NAV */}
        <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",borderBottom:`1px solid ${C.border}`,background:"rgba(13,13,15,.92)",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:50}}>
          <a href="/streaming" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
            <div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:12,color:"#fff"}}>V</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:C.text}}>VIZION <span style={{color:C.mint}}>2.0</span></span>
          </a>
          <a href="/streaming" style={{fontSize:12,color:C.muted,textDecoration:"none",padding:"6px 14px",borderRadius:9,border:`1px solid ${C.border}`}}>← Retour</a>
        </nav>

        {/* BANNER */}
        <div style={{position:"relative",height:220,overflow:"hidden"}}>
          <img src={artist.banner} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.4)"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 30%,rgba(13,13,15,1))"}}/>
        </div>

        {/* PROFIL */}
        <div style={{padding:"0 24px",marginTop:-60,marginBottom:24,display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:16}}>
            <img src={artist.avatar} alt="" style={{width:90,height:90,borderRadius:18,objectFit:"cover",border:`3px solid ${C.bg}`,flexShrink:0}}/>
            <div style={{paddingBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26}}>{artist.name}</span>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:`${C.mint}22`,color:C.mint,fontWeight:700}}>✓ Vérifié</span>
              </div>
              <div style={{fontSize:13,color:C.muted}}>{artist.genre} · {artist.city}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,paddingBottom:4}}>
            <button className="hvr" onClick={()=>{setDonOk(false);setShowDon(true);}} style={{padding:"9px 18px",borderRadius:11,border:`1.5px solid ${C.mint}`,background:`${C.mint}18`,color:C.mint,fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s"}}>💸 Don</button>
            <button className="hvr" onClick={()=>{setSubOk(false);setShowSub(true);}} style={{padding:"9px 20px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${C.purple},${C.mint})`,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s"}}>⭐ S'abonner</button>
          </div>
        </div>

        {/* STATS */}
        <div style={{padding:"14px 24px",background:C.card,borderBottom:`1px solid ${C.border}`,borderTop:`1px solid ${C.border}`,display:"flex",gap:28,flexWrap:"wrap",marginBottom:0}}>
          {[["Abonnés",fmtK(artist.followers)],["Écoutes",fmtK(artist.plays)],["Supporters",fmtK(artist.supporters)]].map(([l,v])=>(
            <div key={l}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18}}>{v}</div>
              <div style={{fontSize:11,color:C.muted}}>{l}</div>
            </div>
          ))}
        </div>

        {/* BIO */}
        <div style={{padding:"16px 24px",borderBottom:`1px solid ${C.border}`}}>
          <p style={{fontSize:13,color:C.muted,lineHeight:1.8}}>{artist.bio}</p>
          {/* Réseaux */}
          <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
            {artist.instagram && <a href={`https://instagram.com/${artist.instagram.replace("@","")}`} target="_blank" rel="noreferrer" style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(225,48,108,.12)",color:"#E1306C",fontWeight:600,textDecoration:"none"}}>{artist.instagram}</a>}
            {artist.tiktok    && <a href={`https://tiktok.com/@${artist.tiktok.replace("@","")}`} target="_blank" rel="noreferrer" style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(105,201,208,.12)",color:"#69C9D0",fontWeight:600,textDecoration:"none"}}>{artist.tiktok}</a>}
          </div>
        </div>

        {/* TABS */}
        <div style={{display:"flex",gap:4,padding:"12px 24px",borderBottom:`1px solid ${C.border}`,background:C.surface}}>
          {([["titres","🎵 Titres"],["abos","⭐ Abonnements"]] as [string,string][]).map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id as any)} style={{padding:"7px 16px",borderRadius:9,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:tab===id?`${C.mint}18`:"transparent",color:tab===id?C.mint:C.muted,transition:"all .2s"}}>{lbl}</button>
          ))}
        </div>

        <div style={{padding:"20px 24px"}}>

          {/* TITRES */}
          {tab==="titres" && (
            <div style={{animation:"fadeUp .3s ease both"}}>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {artist.tracks.map((t:any,i:number)=>(
                  <div key={t.id} className="row" onClick={()=>play(t)} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 12px",borderRadius:13,cursor:"pointer",transition:"background .2s",background:curTrack?.id===t.id&&playing?`${C.mint}08`:"transparent"}}>
                    <div style={{width:20,textAlign:"center",fontSize:12,color:curTrack?.id===t.id&&playing?C.mint:C.muted}}>
                      {curTrack?.id===t.id&&playing ? "▶" : i+1}
                    </div>
                    <img src={t.cover} alt="" style={{width:40,height:40,borderRadius:9,objectFit:"cover",flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:curTrack?.id===t.id&&playing?C.mint:C.text}}>{t.title}</div>
                      <div style={{fontSize:11,color:C.muted}}>{fmtK(t.plays)} écoutes</div>
                    </div>
                    <div style={{fontSize:11,color:C.muted}}>{fmt(t.duration)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABONNEMENTS */}
          {tab==="abos" && (
            <div style={{animation:"fadeUp .3s ease both"}}>
              <div style={{padding:"12px 16px",borderRadius:12,background:`${C.mint}08`,border:`1px solid ${C.mint}22`,marginBottom:20,fontSize:13,color:C.muted}}>
                💡 <span style={{fontWeight:600,color:C.mint}}>90%</span> de chaque abonnement va directement à {artist.name} · VIZION 2.0 : 10%
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {PLANS.map(plan=>(
                  <div key={plan.id} style={{padding:"18px",borderRadius:16,border:`1px solid ${C.border}`,background:C.card,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                    <div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,marginBottom:6}}>{plan.label} · <span style={{color:C.mint}}>{plan.price}€</span><span style={{color:C.muted,fontSize:12}}>/mois</span></div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{plan.perks.map(p=><span key={p} style={{fontSize:11,color:C.muted}}>· {p}</span>)}</div>
                    </div>
                    <button className="hvr" onClick={()=>{setSelPlan(plan);setSubOk(false);setShowSub(true);}} style={{padding:"9px 20px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${C.purple},${C.mint})`,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s"}}>Souscrire</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MINI PLAYER */}
      {curTrack && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(20,20,24,.97)",backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,padding:"10px 24px",display:"flex",alignItems:"center",gap:14}}>
          <img src={curTrack.cover} alt="" style={{width:40,height:40,borderRadius:9,objectFit:"cover",flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{curTrack.title}</div>
            <div style={{fontSize:10,color:C.muted}}>{artist.name}</div>
            <div style={{height:2,borderRadius:1,background:C.border,overflow:"hidden",marginTop:6}}>
              <div style={{height:"100%",width:`${curTrack.duration>0?(prog/curTrack.duration)*100:0}%`,background:`linear-gradient(to right,${C.mint},${C.purple})`,transition:"width .5s"}}/>
            </div>
          </div>
          <button onClick={togglePlay} style={{width:36,height:36,borderRadius:"50%",border:"none",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            {playing ? "⏸" : "▶"}
          </button>
        </div>
      )}

      {/* MODAL DON */}
      {showDon && (
        <>
          <div onClick={()=>setShowDon(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:200}}/>
          <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:201,background:C.card,borderRadius:20,border:`1px solid ${C.border}`,padding:"28px",width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,.6)",animation:"fadeUp .25s ease both"}}>
            <button onClick={()=>setShowDon(false)} style={{position:"absolute",top:14,right:14,background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:18}}>✕</button>
            {donOk ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:40,marginBottom:12}}>🎉</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,marginBottom:8}}>Don envoyé !</div>
                <div style={{color:C.muted,fontSize:13}}>{artist.name} reçoit {fmtE(finalDon)} directement.</div>
              </div>
            ) : (
              <>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:4}}>💸 Soutenir {artist.name}</div>
                <div style={{fontSize:12,color:C.muted,marginBottom:20}}>0% commission · 100% à l&apos;artiste</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                  {[2,5,10,20].map(v=>(
                    <button key={v} onClick={()=>{setDonAmt(v);setDonCust("");}} style={{padding:"11px 0",borderRadius:10,border:`2px solid ${!donCust&&donAmt===v?C.mint:C.border}`,background:!donCust&&donAmt===v?`${C.mint}18`:C.card2,color:!donCust&&donAmt===v?C.mint:C.text,fontWeight:700,fontSize:15,cursor:"pointer"}}>{v}€</button>
                  ))}
                </div>
                <div style={{position:"relative",marginBottom:16}}>
                  <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted}}>€</span>
                  <input type="number" placeholder="Autre montant…" value={donCust} onChange={e=>setDonCust(e.target.value)} style={{width:"100%",padding:"11px 12px 11px 28px",background:C.card2,border:`1px solid ${donCust?C.mint:C.border}`,borderRadius:11,color:C.text,fontSize:14}}/>
                </div>
                <button onClick={()=>simPay(()=>setDonOk(true))} disabled={finalDon<=0||paying} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:finalDon<=0?C.border:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:14,cursor:finalDon<=0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {paying?<span style={{width:14,height:14,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>:`Envoyer ${fmtE(finalDon)}`}
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* MODAL ABONNEMENT */}
      {showSub && (
        <>
          <div onClick={()=>setShowSub(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:200}}/>
          <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:201,background:C.card,borderRadius:20,border:`1px solid ${C.border}`,padding:"28px",width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,.6)",animation:"fadeUp .25s ease both"}}>
            <button onClick={()=>setShowSub(false)} style={{position:"absolute",top:14,right:14,background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:18}}>✕</button>
            {subOk ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:40,marginBottom:12}}>⭐</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,marginBottom:8}}>Abonnement activé !</div>
                <div style={{color:C.muted,fontSize:13}}>Plan {selPlan.label} · {selPlan.price}€/mois</div>
              </div>
            ) : (
              <>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:4}}>⭐ Soutenir {artist.name}</div>
                <div style={{fontSize:12,color:C.muted,marginBottom:20}}>90% à l&apos;artiste · VIZION 2.0 : 10%</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                  {PLANS.map(plan=>(
                    <div key={plan.id} onClick={()=>setSelPlan(plan)} style={{padding:"12px 14px",borderRadius:13,cursor:"pointer",border:`2px solid ${selPlan.id===plan.id?C.purple:C.border}`,background:selPlan.id===plan.id?`${C.purple}10`:C.card2,display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .2s"}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:13,color:selPlan.id===plan.id?C.purple:C.text,marginBottom:2}}>{plan.label}</div>
                        <div style={{fontSize:10,color:C.muted}}>{plan.perks.join(" · ")}</div>
                      </div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:selPlan.id===plan.id?C.purple:C.text}}>{plan.price}€</div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>simPay(()=>setSubOk(true))} disabled={paying} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.purple},${C.mint})`,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {paying?<span style={{width:14,height:14,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>:`S'abonner · ${selPlan.price}€/mois`}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
