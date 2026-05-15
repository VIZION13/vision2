"use client";
import { useState } from "react";

const C = {
  mint:"#6ECFAA", purple:"#B44FD4", gold:"#F5C842",
  bg:"#0D0D0F", surface:"#141418", card:"#1A1A22", card2:"#20202C",
  border:"#2A2A36", text:"#F0EEF8", muted:"#7A7890",
  success:"#4ADE80", danger:"#F87171",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
input{outline:none;font-family:'DM Sans',sans-serif;transition:border-color .2s;}
input:focus{border-color:#6ECFAA !important;}
.btn:hover{opacity:.85;transform:translateY(-1px);}
.tab-btn:hover{color:#F0EEF8 !important;}
.social-link:hover{border-color:#6ECFAA !important;}
.track-row:hover{background:#20202C !important;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
`;

const ARTIST = {
  name:"Nova Kael", genre:"Afro-Électro", city:"Paris",
  bio:"Producteur & chanteur afro-électro basé à Paris. Rythmes africains meets électro contemporaine. En développement depuis 2022.",
  avatar:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
  banner:"https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=900&q=80",
  followers:4120, plays:28400, supporters:142,
  socials:{ instagram:"@nova.kael", tiktok:"@nova.kael", snapchat:"nova.kael", twitter:"@novakael" },
};

const TRACKS = [
  { id:"1", title:"Lumière Froide",  duration:214, plays:8400, plan:null      },
  { id:"2", title:"Nuit Absolue",    duration:187, plays:6200, plan:null      },
  { id:"3", title:"Béton & Velours", duration:243, plays:4100, plan:"super"  },
  { id:"4", title:"Origines",        duration:196, plays:2800, plan:"vip"    },
];

const VIDEOS = [
  { id:"v1", title:"Lumière Froide — Clip officiel", thumb:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=70", duration:"3:34", type:"Clip",          plan:null     },
  { id:"v2", title:"Nuit Absolue — Clip officiel",   thumb:"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=70", duration:"4:12", type:"Clip",          plan:"super"  },
  { id:"v3", title:"Session studio — Making of",     thumb:"https://images.unsplash.com/photo-1571609804016-0ea5a04f05f5?w=400&q=70", duration:"12:40",type:"Live studio",   plan:"vip"    },
  { id:"v4", title:"Live acoustique — Mars 2025",    thumb:"https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=70", duration:"28:00",type:"Live",          plan:"vip"    },
];

const PLANS = [
  { id:"fan",   label:"Fan",       price:3,  icon:"🎵", color:C.mint,   video:false,                          perks:["Audio illimité","Badge fan","Newsletter privée"] },
  { id:"super", label:"Super Fan", price:7,  icon:"⭐", color:C.purple, video:true, videoLabel:"Clips officiels",              perks:["Tout Fan","Clips exclusifs","Sessions Q&A","Crédits"] },
  { id:"vip",   label:"VIP",       price:15, icon:"👑", color:C.gold,   video:true, videoLabel:"Clips + Live studio + Making of", perks:["Tout Super Fan","Live studio","Making of","Appel vidéo","Merch","Early release"] },
];

export default function ArtistPublicPage() {
  const [tab,      setTab]    = useState<"musique"|"videos"|"abos">("musique");
  const [userPlan, setUserPlan]= useState<string|null>(null);
  const [showDon,  setShowDon]= useState(false);
  const [showSub,  setShowSub]= useState(false);
  const [donAmt,   setDonAmt] = useState(5);
  const [donCustom,setDonCust]= useState("");
  const [selPlan,  setSelPlan]= useState(PLANS[1]);
  const [donOk,    setDonOk]  = useState(false);
  const [subOk,    setSubOk]  = useState(false);
  const [paying,   setPaying] = useState(false);

  const fmtK = (n:number) => n>=1000?(n/1000).toFixed(1)+"k":String(n);
  const fmtE = (n:number) => `${Number(n).toFixed(2)} €`;
  const fmt  = (s:number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const finalDon = donCustom ? Number(donCustom) : donAmt;

  const canAccess = (plan:string|null, required:string|null) => {
    if(!required) return true;
    if(!plan) return false;
    if(plan==="vip") return true;
    if(plan==="super" && required==="super") return true;
    return false;
  };

  const pay = (cb:()=>void) => {
    setPaying(true);
    setTimeout(()=>{ setPaying(false); cb(); }, 2000);
  };

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh"}}>
      <style>{CSS}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-15%",left:"-8%",width:"55vw",height:"55vh",background:`radial-gradient(circle,rgba(110,207,170,.06),transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:"0",right:"-8%",width:"50vw",height:"50vh",background:`radial-gradient(circle,rgba(180,79,212,.07),transparent 70%)`}}/>
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:900,margin:"0 auto",paddingBottom:80}}>

        {/* NAV */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 28px",borderBottom:`1px solid ${C.border}`,background:"rgba(13,13,15,.92)",backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:50}}>
          <a href="/streaming" style={{display:"flex",alignItems:"center",gap:9,textDecoration:"none"}}>
            <div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:12,color:"#fff"}}>V</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:C.text}}>VISION <span style={{color:C.mint}}>2.0</span></span>
          </a>
          <div style={{display:"flex",gap:10}}>
            <a href="/dashboard" style={{fontSize:12,color:C.muted,textDecoration:"none",padding:"6px 12px",borderRadius:9,border:`1px solid ${C.border}`}}>Mon espace artiste</a>
            <a href="/" style={{fontSize:12,color:C.muted,textDecoration:"none",padding:"6px 12px",borderRadius:9,border:`1px solid ${C.border}`}}>← Accueil</a>
          </div>
        </div>

        {/* BANNER */}
        <div style={{position:"relative",height:220}}>
          <img src={ARTIST.banner} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 30%,rgba(13,13,15,1))"}}/>
          <div style={{position:"absolute",bottom:0,left:28,right:28,paddingBottom:20,display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:16}}>
              <img src={ARTIST.avatar} alt="" style={{width:76,height:76,borderRadius:18,objectFit:"cover",border:`3px solid ${C.bg}`}}/>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,marginBottom:3}}>
                  {ARTIST.name}
                  <span style={{fontSize:10,marginLeft:8,padding:"2px 8px",borderRadius:20,background:`${C.mint}22`,color:C.mint,fontWeight:700}}>✓ Vérifié</span>
                  {userPlan&&<span style={{fontSize:10,marginLeft:6,padding:"2px 8px",borderRadius:20,background:`${C.purple}33`,color:C.purple,fontWeight:700}}>✓ Abonné {userPlan}</span>}
                </div>
                <div style={{fontSize:13,color:C.muted}}>{ARTIST.genre} · {ARTIST.city}</div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS + ACTIONS */}
        <div style={{padding:"14px 28px",background:C.card,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",gap:24}}>
            {[["followers","Abonnés"],["plays","Écoutes"],["supporters","Supporters"]].map(([k,l])=>(
              <div key={k}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18}}>{fmtK((ARTIST as any)[k])}</div>
                <div style={{fontSize:11,color:C.muted}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{setDonOk(false);setShowDon(true);}} className="btn" style={{padding:"9px 18px",borderRadius:11,border:`1.5px solid ${C.mint}`,background:`${C.mint}18`,color:C.mint,fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s"}}>💸 Faire un don</button>
            <button onClick={()=>{setSubOk(false);setShowSub(true);}} className="btn" style={{padding:"9px 20px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${C.purple},${C.mint})`,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s"}}>⭐ S'abonner</button>
          </div>
        </div>

        {/* RÉSEAUX SOCIAUX */}
        <div style={{padding:"12px 28px",background:C.surface,borderBottom:`1px solid ${C.border}`,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,color:C.muted,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",marginRight:4}}>Réseaux</span>
          {[
            {key:"instagram",icon:"📸",label:"Instagram",color:"#E1306C"},
            {key:"tiktok",   icon:"🎵",label:"TikTok",   color:"#69C9D0"},
            {key:"snapchat", icon:"👻",label:"Snapchat", color:"#F5C842"},
            {key:"twitter",  icon:"𝕏", label:"Twitter",  color:"#1DA1F2"},
          ].filter(s=>(ARTIST.socials as any)[s.key]).map(s=>(
            <div key={s.key} className="social-link" style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:20,background:C.card,border:`1px solid ${C.border}`,fontSize:12,color:C.muted,cursor:"pointer",transition:"border .2s"}}>
              <span style={{fontSize:14}}>{s.icon}</span>
              <span style={{fontWeight:600,color:s.color}}>{s.label}</span>
              <span>{(ARTIST.socials as any)[s.key]}</span>
            </div>
          ))}
        </div>

        {/* BIO */}
        <div style={{padding:"18px 28px",borderBottom:`1px solid ${C.border}`}}>
          <p style={{fontSize:13,color:C.muted,lineHeight:1.8}}>{ARTIST.bio}</p>
        </div>

        {/* TABS */}
        <div style={{display:"flex",gap:4,padding:"12px 28px",borderBottom:`1px solid ${C.border}`,background:C.surface}}>
          {[{id:"musique",label:"🎵 Musique"},{id:"videos",label:"🎬 Vidéos"},{id:"abos",label:"⭐ Abonnements"}].map(t=>(
            <button key={t.id} className="tab-btn" onClick={()=>setTab(t.id as any)} style={{
              padding:"8px 18px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
              background:tab===t.id?`linear-gradient(135deg,rgba(110,207,170,.2),rgba(180,79,212,.15))`:"transparent",
              color:tab===t.id?C.mint:C.muted,transition:"all .2s",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{padding:"28px"}}>

          {/* MUSIQUE */}
          {tab==="musique"&&(
            <div style={{animation:"fadeUp .3s ease both"}}>
              <SLabel label="Titres" color={C.mint}/>
              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                {TRACKS.map((t,i)=>(
                  <div key={t.id} className="track-row" onClick={()=>{}} style={{display:"flex",alignItems:"center",gap:14,padding:"12px",borderRadius:12,transition:"background .2s",cursor:"pointer"}}>
                    <div style={{width:22,textAlign:"center",fontSize:12,color:C.muted}}>{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600}}>{t.title}</div>
                      <div style={{fontSize:11,color:C.muted}}>{fmtK(t.plays)} écoutes</div>
                    </div>
                    {t.plan&&(
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700,
                        background:t.plan==="vip"?`${C.gold}22`:`${C.purple}22`,
                        color:t.plan==="vip"?C.gold:C.purple,
                      }}>{t.plan==="vip"?"VIP 👑":"Super Fan ⭐"}</span>
                    )}
                    {t.plan&&!canAccess(userPlan,t.plan)&&<span style={{fontSize:12}}>🔒</span>}
                    <div style={{fontSize:11,color:C.muted}}>{fmt(t.duration)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIDEOS */}
          {tab==="videos"&&(
            <div style={{animation:"fadeUp .3s ease both"}}>
              <div style={{padding:"12px 16px",borderRadius:12,background:`${C.purple}08`,border:`1px solid ${C.purple}22`,marginBottom:24,fontSize:12,color:C.muted}}>
                🎬 <span style={{color:C.mint,fontWeight:600}}>Fan</span> → Teasers publics · <span style={{color:C.purple,fontWeight:600}}>Super Fan</span> → Clips officiels · <span style={{color:C.gold,fontWeight:600}}>VIP</span> → Clips + Live studio + Making of
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
                {VIDEOS.map(v=>{
                  const locked = !canAccess(userPlan, v.plan);
                  return (
                    <div key={v.id} style={{borderRadius:16,overflow:"hidden",background:C.card,border:`1px solid ${C.border}`}}>
                      <div style={{position:"relative",height:130}}>
                        <img src={v.thumb} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:locked&&v.plan?"blur(5px) brightness(.4)":"none"}}/>
                        {locked&&v.plan?(
                          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
                            <div style={{fontSize:22}}>🔒</div>
                            <div style={{fontSize:11,color:"#fff",fontWeight:700}}>{v.plan==="vip"?"Réservé VIP 👑":"Réservé Super Fan ⭐"}</div>
                            <button onClick={()=>setShowSub(true)} style={{padding:"4px 12px",borderRadius:20,border:"none",background:`linear-gradient(135deg,${C.purple},${C.mint})`,color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",marginTop:2}}>S'abonner</button>
                          </div>
                        ):(
                          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>▶</div>
                          </div>
                        )}
                        <div style={{position:"absolute",top:8,left:8,fontSize:9,padding:"2px 7px",borderRadius:20,background:"rgba(0,0,0,.7)",color:C.muted,fontWeight:600}}>{v.type}</div>
                        {v.plan&&<div style={{position:"absolute",top:8,right:8,fontSize:9,padding:"2px 7px",borderRadius:20,background:"rgba(0,0,0,.7)",color:v.plan==="vip"?C.gold:C.purple,fontWeight:700}}>{v.plan==="vip"?"VIP 👑":"Super Fan ⭐"}</div>}
                      </div>
                      <div style={{padding:"10px 12px"}}>
                        <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{v.title}</div>
                        <div style={{fontSize:10,color:C.muted}}>{v.duration}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABONNEMENTS */}
          {tab==="abos"&&(
            <div style={{animation:"fadeUp .3s ease both"}}>
              <SLabel label="Soutenir {ARTIST.name}" color={C.purple}/>
              <div style={{padding:"12px 16px",borderRadius:12,background:`${C.mint}08`,border:`1px solid ${C.mint}22`,marginBottom:24,fontSize:13,color:C.muted}}>
                💡 <span style={{fontWeight:600,color:C.mint}}>90%</span> de chaque abonnement va directement à {ARTIST.name} · Vision 2.0 : 10%
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {PLANS.map(plan=>(
                  <div key={plan.id} style={{padding:"20px",borderRadius:18,border:`2px solid ${userPlan===plan.id?plan.color:C.border}`,background:userPlan===plan.id?`${plan.color}10`:C.card,transition:"all .2s"}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
                      <div style={{display:"flex",gap:14}}>
                        <span style={{fontSize:26}}>{plan.icon}</span>
                        <div>
                          <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}>
                            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18}}>{plan.label}</span>
                            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:plan.color}}>{plan.price}€</span>
                            <span style={{color:C.muted,fontSize:12}}>/mois</span>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:4}}>
                            {plan.perks.map(p=><div key={p} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.muted}}><span style={{color:plan.color}}>✓</span>{p}</div>)}
                            {plan.video&&<div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,marginTop:4}}><span>🎬</span><span style={{color:plan.color,fontWeight:600}}>{(plan as any).videoLabel}</span></div>}
                          </div>
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                        <div style={{fontSize:11,color:C.muted}}>Artiste reçoit</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:plan.color}}>{fmtE(plan.price*0.9)}</div>
                        {userPlan===plan.id?(
                          <div style={{padding:"7px 14px",borderRadius:10,background:`${plan.color}22`,color:plan.color,fontSize:12,fontWeight:700}}>✓ Actif</div>
                        ):(
                          <button onClick={()=>{setSelPlan(plan);setSubOk(false);setShowSub(true);}} className="btn" style={{padding:"9px 18px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${plan.color},${C.purple})`,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s"}}>
                            Souscrire
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DON */}
      {showDon&&(
        <Modal onClose={()=>setShowDon(false)}>
          {donOk?(
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>🎉</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,marginBottom:8}}>Don envoyé !</div>
              <div style={{color:C.muted,fontSize:13,marginBottom:20}}>{ARTIST.name} reçoit {fmtE(finalDon)} directement.</div>
              <button onClick={()=>setShowDon(false)} style={{padding:"11px 24px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,cursor:"pointer"}}>Fermer</button>
            </div>
          ):(
            <>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:4}}>💸 Soutenir {ARTIST.name}</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:20}}>100% va directement à l&apos;artiste · 0% de commission</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                {[2,5,10,20].map(v=>(
                  <button key={v} onClick={()=>{setDonAmt(v);setDonCust("");}} style={{padding:"12px 0",borderRadius:10,border:`2px solid ${!donCustom&&donAmt===v?C.mint:C.border}`,background:!donCustom&&donAmt===v?`${C.mint}18`:C.card2,color:!donCustom&&donAmt===v?C.mint:C.text,fontWeight:700,fontSize:16,cursor:"pointer"}}>{v}€</button>
                ))}
              </div>
              <div style={{position:"relative",marginBottom:20}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted}}>€</span>
                <input type="number" placeholder="Autre montant…" value={donCustom} onChange={e=>setDonCust(e.target.value)} style={{width:"100%",padding:"11px 12px 11px 28px",background:C.card2,border:`1px solid ${donCustom?C.mint:C.border}`,borderRadius:11,color:C.text,fontSize:14}}/>
              </div>
              <div style={{padding:"12px",borderRadius:11,background:`${C.mint}08`,border:`1px solid ${C.mint}22`,marginBottom:16,display:"flex",justifyContent:"space-between",fontSize:13}}>
                <span style={{color:C.muted}}>Don à {ARTIST.name}</span>
                <span style={{fontWeight:700,color:C.mint}}>{fmtE(finalDon)}</span>
              </div>
              <button onClick={()=>pay(()=>setDonOk(true))} disabled={finalDon<=0||paying} className="btn" style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:finalDon<=0?C.border:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:14,cursor:finalDon<=0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {paying?<Spinner/>:`Envoyer ${fmtE(finalDon)}`}
              </button>
            </>
          )}
        </Modal>
      )}

      {/* MODAL ABONNEMENT */}
      {showSub&&(
        <Modal onClose={()=>setShowSub(false)}>
          {subOk?(
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>⭐</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,marginBottom:8}}>Abonnement activé !</div>
              <div style={{color:C.muted,fontSize:13,marginBottom:20}}>Plan {selPlan.label} · {selPlan.price}€/mois</div>
              <button onClick={()=>{setShowSub(false);setUserPlan(selPlan.id);}} style={{padding:"11px 24px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.purple},${C.mint})`,color:"#fff",fontWeight:700,cursor:"pointer"}}>Voir mes avantages</button>
            </div>
          ):(
            <>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:4}}>⭐ Soutenir {ARTIST.name}</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:20}}>90% à l&apos;artiste · Vision 2.0 : 10%</div>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                {PLANS.map(plan=>(
                  <div key={plan.id} onClick={()=>setSelPlan(plan)} style={{padding:"14px 16px",borderRadius:13,cursor:"pointer",border:`2px solid ${selPlan.id===plan.id?plan.color:C.border}`,background:selPlan.id===plan.id?`${plan.color}10`:C.card2,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:20}}>{plan.icon}</span>
                      <div>
                        <div style={{fontWeight:700,fontSize:14}}>{plan.label}</div>
                        <div style={{fontSize:11,color:C.muted}}>{plan.video?(plan as any).videoLabel:"Audio uniquement"}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:plan.color}}>{plan.price}€</div>
                      <div style={{fontSize:10,color:C.muted}}>/mois</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={()=>pay(()=>setSubOk(true))} disabled={paying} className="btn" style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${selPlan.color},${C.purple})`,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {paying?<Spinner/>:`S'abonner · ${selPlan.price}€/mois`}
              </button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}

function SLabel({label,color}:{label:string,color:string}) {
  return <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><div style={{width:3,height:16,borderRadius:2,background:color}}/><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16}}>{label}</span></div>;
}
function Modal({children,onClose}:{children:React.ReactNode,onClose:()=>void}) {
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:200}}/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:201,background:"#1A1A22",borderRadius:20,border:"1px solid #2A2A36",padding:"28px",width:"100%",maxWidth:440,boxShadow:"0 24px 64px rgba(0,0,0,.6)",maxHeight:"90vh",overflowY:"auto",animation:"fadeUp .25s ease both"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"none",border:"none",cursor:"pointer",color:"#7A7890",fontSize:20}}>✕</button>
        {children}
      </div>
    </>
  );
}
function Spinner() {
  return <span style={{width:14,height:14,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>;
}
