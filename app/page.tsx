"use client";
import { useState } from "react";

const C = {
  bg:"#0D0D0F", surface:"#141418", card:"#1A1A22", card2:"#20202C",
  border:"#2A2A36", text:"#F0EEF8", muted:"#7A7890",
  mint:"#6ECFAA", purple:"#B44FD4", gold:"#F5C842",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
a{text-decoration:none;color:inherit;}
input:focus{outline:none;}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,0,0,.4);}
.btn-g:hover{border-color:#6ECFAA !important;color:#6ECFAA !important;}
.feat:hover{transform:translateY(-3px);}
.art:hover{transform:scale(1.03);}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes g1{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.gt{background:linear-gradient(135deg,#6ECFAA,#B44FD4,#6ECFAA);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:g1 5s ease infinite;}
.ga{background:linear-gradient(135deg,#B44FD4,#6ECFAA,#B44FD4);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:g1 5s ease infinite;}
`;

function SVG({d,s=20,c="currentColor"}) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
}

const TEAM_CONTENT = {
  badge:"ESPACE TEAM — Pour les fans et la communauté",
  badgeColor: "#6ECFAA",
  headline: <>La plateforme qui connecte<br/><span className="gt">fans et artistes</span></>,
  sub: "Écoute sans limites. Soutiens tes artistes préférés. Accède à des contenus exclusifs selon ton plan.",
  cta1: "Rejoindre la Team",
  cta2: "Explorer les artistes",
  stats: [
    ["0%",    "commission sur tes dons"],
    ["3€",    "pour devenir Team"],
    ["100%",  "gratuit pour écouter"],
  ],
  features: [
    { icon:"M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3", title:"Écoute illimitée",    desc:"Tous les titres des artistes, gratuitement et sans pub.",                color:"#6ECFAA" },
    { icon:"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z", title:"Soutien direct",   desc:"Fais un don ou abonne-toi. 90% va directement à l'artiste.",            color:"#B44FD4" },
    { icon:"M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z", title:"Vidéos exclusives", desc:"Clips, lives, making of — selon ton plan Team, Super Team ou VIP.",     color:"#F5C842" },
    { icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title:"Communauté", desc:"Suis tes artistes, réagis et échanges dans une vraie communauté.",        color:"#6ECFAA" },
  ],
  plans: [
    { label:"Team",       price:"3€",  color:"#6ECFAA", perks:["Écoute illimitée","Badge Team","Newsletter privée"] },
    { label:"Super Team", price:"7€",  color:"#B44FD4", perks:["Clips exclusifs","Sessions Q&A","Crédits dans les titres"], popular:true },
    { label:"VIP",        price:"15€", color:"#F5C842", perks:["Live studio","Appel vidéo","Merch exclusif"] },
  ],
  planNote:"10% Vision 2.0 · 90% à l'artiste sur chaque abonnement",
};

const ARTIST_CONTENT = {
  badge:"ESPACE ARTISTE — Pour les créateurs indépendants",
  badgeColor: "#B44FD4",
  headline: <>La plateforme qui fait<br/><span className="ga">vivre les artistes</span></>,
  sub: "Publie ta musique. Monétise ta communauté. Dépose tes titres à la SACEM. Garde le contrôle de ta carrière.",
  cta1: "Créer mon compte artiste",
  cta2: "Voir l'application",
  stats: [
    ["0%",  "commission sur tes dons"],
    ["90%", "des abonnements pour toi"],
    ["100%","propriétaire de ta musique"],
  ],
  features: [
    { icon:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12", title:"Upload audio & vidéo", desc:"MP3, WAV, FLAC, MP4. Qualité maximale. Clips, lives, making of.",          color:"#B44FD4" },
    { icon:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",        title:"Dépôt SACEM intégré", desc:"Déclare tes titres, auteurs, compositeurs et beatmakers directement.",    color:"#6ECFAA" },
    { icon:"M18 20V10M12 20V4M6 20v-6",                                        title:"Dashboard temps réel",desc:"Revenus, écoutes, abonnés, dons — tout en un coup d'oeil.",                color:"#F5C842" },
    { icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title:"Droits proteges",   desc:"Tu es proprietaire. Vision 2.0 prend 10% uniquement sur les revenus.",  color:"#B44FD4" },
  ],
  plans: [
    { label:"Dons",        price:"0%",     color:"#6ECFAA", perks:["Aucune commission","Paiement immédiat","Stripe Connect"] },
    { label:"Abonnements", price:"10%",    color:"#B44FD4", perks:["90% pour toi","Revenus récurrents","Dashboard complet"], popular:true },
    { label:"SACEM",       price:"Inclus", color:"#F5C842", perks:["Dépôt via Vision 2.0","Contrat d'édition","Part auteur 100%"] },
  ],
  planNote:"Vision 2.0 prend 10% uniquement sur les abonnements — 0% sur les dons",
};

const ARTISTS = [
  { name:"Nova Kael",    genre:"Afro-Electro",   img:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80" },
  { name:"Lys Paradis",  genre:"Neo-Soul",        img:"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80" },
  { name:"Eclat Sonore", genre:"Indie Pop",       img:"https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80" },
  { name:"Celeste X",    genre:"R&B Alternatif",  img:"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80" },
];

export default function Landing() {
  const [mode,    setMode]   = useState("team");
  const [email,   setEmail]  = useState("");
  const [done,    setDone]   = useState(false);
  const [loading, setLoad]   = useState(false);

  const D      = mode === "team" ? TEAM_CONTENT : ARTIST_CONTENT;
  const accent = mode === "team" ? C.mint : C.purple;
  const accent2= mode === "team" ? C.purple : C.mint;

  const join = () => {
    if(!email) return;
    setLoad(true);
    setTimeout(()=>{ setLoad(false); setDone(true); }, 1200);
  };

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",overflowX:"hidden"}}>
      <style>{CSS}</style>

      {/* Ambient */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:"70vw",height:"70vh",background:`radial-gradient(circle,${accent}09,transparent 70%)`,transition:"background .6s"}}/>
        <div style={{position:"absolute",bottom:"-10%",right:"-10%",width:"65vw",height:"65vh",background:`radial-gradient(circle,${accent2}0b,transparent 70%)`,transition:"background .6s"}}/>
      </div>

      <div style={{position:"relative",zIndex:1}}>

        {/* NAV */}
        <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 48px",height:64,background:"rgba(13,13,15,.92)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:30,height:30,borderRadius:9,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,color:"#fff"}}>V</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16}}>VISION <span style={{color:accent,transition:"color .3s"}}>2.0</span></span>
          </div>

          {/* Switcher */}
          <div style={{display:"flex",padding:4,background:C.card,borderRadius:14,border:`1px solid ${C.border}`}}>
            <button onClick={()=>{setMode("team");setDone(false);setEmail("");}} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 22px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,transition:"all .25s",background:mode==="team"?`${C.mint}18`:"transparent",color:mode==="team"?C.mint:C.muted}}>
              <SVG d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" s={15} c={mode==="team"?C.mint:C.muted}/>
              Team
            </button>
            <button onClick={()=>{setMode("artist");setDone(false);setEmail("");}} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 22px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,transition:"all .25s",background:mode==="artist"?`${C.purple}18`:"transparent",color:mode==="artist"?C.purple:C.muted}}>
              <SVG d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" s={15} c={mode==="artist"?C.purple:C.muted}/>
              Artiste
            </button>
          </div>

          <div style={{display:"flex",gap:10}}>
            <a href="/streaming"><button className="btn-g" style={{padding:"8px 18px",borderRadius:10,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .25s"}}>Explorer</button></a>
            <a href="/auth"><button className="btn-p" style={{padding:"9px 22px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${accent},${accent2})`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .3s"}}>Se connecter</button></a>
          </div>
        </nav>

        {/* HERO */}
        <section style={{textAlign:"center",padding:"110px 24px 80px",maxWidth:860,margin:"0 auto",animation:"fadeUp .5s ease both"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 16px",borderRadius:20,background:`${D.badgeColor}12`,border:`1px solid ${D.badgeColor}30`,fontSize:11,fontWeight:700,color:D.badgeColor,marginBottom:32,letterSpacing:.5,transition:"all .3s"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:D.badgeColor,animation:"pulse 1.5s infinite",display:"inline-block"}}/>
            {D.badge}
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(36px,6vw,68px)",lineHeight:1.05,marginBottom:28,letterSpacing:-1}}>
            {D.headline}
          </h1>
          <p style={{fontSize:"clamp(15px,2vw,18px)",color:C.muted,lineHeight:1.8,marginBottom:48,maxWidth:520,margin:"0 auto 48px"}}>
            {D.sub}
          </p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:72}}>
            <a href={`/auth?mode=signup&type=${mode}`}><button className="btn-p" style={{padding:"15px 36px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${accent},${accent2})`,color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",transition:"all .3s"}}>{D.cta1} →</button></a>
            <a href="/streaming"><button className="btn-g" style={{padding:"15px 36px",borderRadius:14,border:`1.5px solid ${C.border}`,background:"transparent",color:C.muted,fontWeight:600,fontSize:16,cursor:"pointer",transition:"all .25s"}}>{D.cta2}</button></a>
          </div>
          <div style={{display:"flex",justifyContent:"center",borderTop:`1px solid ${C.border}`,paddingTop:48}}>
            {D.stats.map(([v,l],i)=>(
              <div key={i} style={{flex:1,maxWidth:220,padding:"0 24px",borderRight:i<2?`1px solid ${C.border}`:"none"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:36,marginBottom:6,background:`linear-gradient(135deg,${accent},${accent2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{v}</div>
                <div style={{fontSize:13,color:C.muted,lineHeight:1.5}}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section style={{padding:"80px 48px",background:C.surface,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
          <div style={{maxWidth:900,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{fontSize:11,color:accent,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:12,transition:"color .3s"}}>{mode==="team"?"Pour la Team":"Pour les Artistes"}</div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,38px)"}}>{mode==="team"?"Tout pour vivre la musique":"Tout pour gerer ta carriere"}</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:18}}>
              {D.features.map((f,i)=>(
                <div key={i} className="feat" style={{padding:"26px",borderRadius:20,background:C.card,border:`1px solid ${C.border}`,transition:"all .25s"}}>
                  <div style={{width:42,height:42,borderRadius:12,background:`${f.color}15`,border:`1px solid ${f.color}22`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                    <SVG d={f.icon} s={20} c={f.color}/>
                  </div>
                  <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{f.title}</div>
                  <div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ARTISTES (Team) ou REVENUS (Artiste) */}
        {mode==="team" ? (
          <section style={{padding:"100px 48px"}}>
            <div style={{maxWidth:960,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:48}}>
                <div style={{fontSize:11,color:C.mint,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:12}}>Artistes</div>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,38px)",marginBottom:10}}>Decouvre les artistes a soutenir</h2>
                <p style={{color:C.muted,fontSize:14}}>Des talents independants qui comptent sur leur communaute</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:40}}>
                {ARTISTS.map((a,i)=>(
                  <div key={i} className="art" style={{borderRadius:16,overflow:"hidden",background:C.card,border:`1px solid ${C.border}`,transition:"all .25s"}}>
                    <div style={{height:160,overflow:"hidden",position:"relative"}}>
                      <img src={a.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(26,26,34,1) 0%,transparent 60%)"}}/>
                    </div>
                    <div style={{padding:"12px 14px"}}>
                      <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{a.name}</div>
                      <div style={{fontSize:11,color:C.muted}}>{a.genre}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{textAlign:"center"}}><a href="/auth?mode=signup&type=team"><button className="btn-p" style={{padding:"13px 32px",borderRadius:13,border:"none",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",transition:"all .25s"}}>Rejoindre la Team →</button></a></div>
            </div>
          </section>
        ) : (
          <section style={{padding:"100px 48px"}}>
            <div style={{maxWidth:860,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:48}}>
                <div style={{fontSize:11,color:C.purple,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:12}}>Revenus</div>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,38px)",marginBottom:10}}>Combien tu peux gagner ?</h2>
                <p style={{color:C.muted,fontSize:14}}>Exemple avec 160 abonnes actifs</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
                {[{label:"100 Team (3€)",rev:"270€/mois",color:C.mint},{label:"50 Super Team (7€)",rev:"315€/mois",color:C.purple},{label:"10 VIP (15€)",rev:"135€/mois",color:C.gold}].map((r,i)=>(
                  <div key={i} style={{padding:"28px",borderRadius:20,background:C.card,border:`1px solid ${C.border}`,textAlign:"center"}}>
                    <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{r.label}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:34,color:r.color,marginBottom:4}}>{r.rev}</div>
                    <div style={{fontSize:11,color:C.muted}}>apres 10% Vision 2.0</div>
                  </div>
                ))}
              </div>
              <div style={{padding:"18px 24px",borderRadius:14,background:`${C.purple}08`,border:`1px solid ${C.purple}22`,textAlign:"center",marginBottom:40}}>
                <div style={{fontSize:14,color:C.muted}}>Total : <strong style={{color:C.purple,fontSize:18}}>720€ / mois</strong> en revenus recurrents + dons libres a 0% commission</div>
              </div>
              <div style={{textAlign:"center"}}><a href="/auth?mode=signup&type=artist"><button className="btn-p" style={{padding:"13px 32px",borderRadius:13,border:"none",background:`linear-gradient(135deg,${C.purple},${C.mint})`,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",transition:"all .25s"}}>Creer mon compte artiste →</button></a></div>
            </div>
          </section>
        )}

        {/* PLANS */}
        <section style={{padding:"80px 48px",background:C.surface,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{fontSize:11,color:accent,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:12,transition:"color .3s"}}>{mode==="team"?"Plans Team":"Modele economique"}</div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,38px)",marginBottom:10}}>{mode==="team"?"Choisis ton niveau de soutien":"Simple et transparent"}</h2>
              <p style={{fontSize:13,color:C.muted}}>{D.planNote}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              {D.plans.map((p,i)=>(
                <div key={i} style={{padding:"28px 22px",borderRadius:20,background:p.popular?`${p.color}08`:C.card,border:`2px solid ${p.popular?p.color:C.border}`,textAlign:"center",position:"relative",transition:"all .3s"}}>
                  {p.popular&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",padding:"3px 14px",borderRadius:20,background:`linear-gradient(135deg,${p.color},${accent})`,fontSize:10,fontWeight:700,color:"#fff",whiteSpace:"nowrap"}}>{mode==="team"?"Le plus populaire":"Revenus recurrents"}</div>}
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:32,color:p.color,marginBottom:4}}>{p.price}</div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:20}}>{mode==="team"?"/mois · ":""}{p.label}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
                    {p.perks.map(pk=><div key={pk} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.muted}}><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>{pk}</div>)}
                  </div>
                  <a href={`/auth?mode=signup&type=${mode}`}><button style={{width:"100%",padding:"10px",borderRadius:11,border:`1.5px solid ${p.color}`,background:p.popular?`linear-gradient(135deg,${p.color},${accent})`:`${p.color}12`,color:p.popular?"#fff":p.color,fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .25s"}}>{mode==="team"?"Choisir ce plan":"Commencer"}</button></a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section style={{padding:"120px 48px",textAlign:"center"}}>
          <div style={{maxWidth:580,margin:"0 auto"}}>
            <div style={{fontSize:52,marginBottom:20,animation:"float 4s ease-in-out infinite"}}>{mode==="team"?"🎵":"🎤"}</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(28px,5vw,50px)",lineHeight:1.1,marginBottom:16}}>
              {mode==="team"?<>Pret a rejoindre<br/><span className="gt">la communaute ?</span></>:<>Pret a lancer<br/><span className="ga">ta musique ?</span></>}
            </h2>
            <p style={{color:C.muted,fontSize:15,lineHeight:1.7,marginBottom:40}}>
              {mode==="team"?"Rejoins Vision 2.0 gratuitement. Ecoute, decouvre et soutiens tes artistes preferes.":"Rejoins Vision 2.0 gratuitement. Upload ton premier titre et commence a construire ta communaute."}
            </p>
            {!done ? (
              <div style={{display:"flex",maxWidth:420,margin:"0 auto 16px",borderRadius:14,overflow:"hidden",border:`1px solid ${C.border}`,background:C.card}}>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Ton adresse email" type="email" onKeyDown={e=>e.key==="Enter"&&join()} style={{flex:1,padding:"15px 18px",background:"transparent",border:"none",color:C.text,fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
                <button onClick={join} disabled={!email||loading} style={{padding:"15px 24px",border:"none",background:`linear-gradient(135deg,${accent},${accent2})`,color:"#fff",fontWeight:700,fontSize:14,cursor:!email?"not-allowed":"pointer",whiteSpace:"nowrap",transition:"background .3s",display:"flex",alignItems:"center",gap:6}}>
                  {loading?<span style={{width:14,height:14,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>:mode==="team"?"Rejoindre →":"S'inscrire →"}
                </button>
              </div>
            ) : (
              <div style={{padding:"16px 28px",borderRadius:14,background:`${accent}10`,border:`1px solid ${accent}30`,fontSize:14,color:accent,fontWeight:600,display:"inline-block",marginBottom:16}}>
                Vous etes sur la liste ! On vous contacte tres bientot.
              </div>
            )}
            <div style={{fontSize:12,color:C.muted}}>{mode==="team"?"Gratuit pour ecouter · Abonnements a partir de 3 euros":"Inscription gratuite · Aucune carte bancaire requise"}</div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{borderTop:`1px solid ${C.border}`,padding:"24px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16,background:C.surface}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,color:"#fff",fontSize:12}}>V</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14}}>VISION <span style={{color:accent,transition:"color .3s"}}>2.0</span></span>
          </div>
          <div style={{display:"flex",gap:24}}>
            {[["Explorer","/streaming"],["Se connecter","/auth"],["CGU","/cgu"],["contact@vision2.music","mailto:contact@vision2.music"]].map(([lbl,href])=>(
              <a key={lbl} href={href} style={{fontSize:12,color:C.muted,transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color=accent} onMouseLeave={e=>e.currentTarget.style.color=C.muted}>{lbl}</a>
            ))}
          </div>
          <div style={{fontSize:12,color:C.muted}}>2025 Vision 2.0</div>
        </footer>

      </div>
    </div>
  );
}
