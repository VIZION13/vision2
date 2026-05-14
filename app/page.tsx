"use client";
import { useState } from "react";

const C = {
  mint:"#6ECFAA", purple:"#B44FD4", gold:"#F5C842",
  bg:"#0D0D0F", surface:"#141418", card:"#1A1A22",
  border:"#2A2A36", text:"#F0EEF8", muted:"#7A7890",
};

const PAGES = [
  { href:"/streaming",  icon:"🎵", label:"Application",      desc:"Écoute, découvre et soutiens les artistes",     color:C.mint   },
  { href:"/auth",       icon:"🔐", label:"Connexion",         desc:"Crée ton compte ou connecte-toi",               color:C.purple },
  { href:"/upload",     icon:"⬆️", label:"Upload musique",    desc:"Publie tes titres sur la plateforme",           color:C.mint   },
  { href:"/Team",       icon:"❤️", label:"Espace Team",       desc:"Découvre et suis tes artistes préférés",        color:C.purple },
  { href:"/paiement",   icon:"💸", label:"Soutenir",          desc:"Fais un don ou abonne-toi à un artiste",        color:C.gold   },
  { href:"/dashboard",  icon:"📊", label:"Dashboard artiste", desc:"Tes stats, revenus et titres en un coup d'oeil", color:C.mint  },
];

const FEATURES = [
  { icon:"💸", title:"Dons directs",       desc:"90% à l'artiste, 10% de commission.", color:C.mint   },
  { icon:"⭐", title:"Abonnements Team",   desc:"Team, Super Team, VIP dès 3€/mois.",    color:C.purple },
  { icon:"🎵", title:"Streaming libre",    desc:"Ta musique accessible à tous.",        color:C.gold   },
  { icon:"📊", title:"Dashboard revenus",  desc:"Suis tes stats en temps réel.",        color:C.mint   },
  { icon:"🔔", title:"Notifications live", desc:"Chaque don, chaque abonné.",           color:C.purple },
  { icon:"🔐", title:"Paiements Stripe",   desc:"Virement automatique sur ton IBAN.",   color:C.gold   },
];

const FAQS = [
  { q:"C'est quoi Vision 2.0 ?",                  a:"Une plateforme de streaming pour les artistes en developpement. Tu partages ta musique, recois des dons et des abonnements fans." },
  { q:"Combien Vision 2.0 prend de commission ?", a:"0% sur les dons. 10% sur les abonnements. C'est tout." },
  { q:"Comment sont verses les revenus ?",        a:"Via Stripe Connect directement sur ton IBAN, sans intermediaire." },
  { q:"Faut-il avoir des fans pour commencer ?",  a:"Non. Tu crees ton profil et uploades ta musique des aujourd'hui." },
];

export default function Page() {
  const [email,     setEmail]   = useState("");
  const [name,      setName]    = useState("");
  const [genre,     setGenre]   = useState("");
  const [submitted, setSubmit]  = useState(false);
  const [loading,   setLoading] = useState(false);
  const [openFaq,   setOpenFaq] = useState<number|null>(null);

  const handleSubmit = () => {
    if (!email || !name) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmit(true); }, 1500);
  };

  return (
    <div style={{fontFamily:"'DM Sans','Helvetica Neue',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        a{text-decoration:none;}
        input:focus{outline:none;border-color:#6ECFAA !important;}
        .btn-main:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(110,207,170,.4);}
        .btn-ghost:hover{border-color:#6ECFAA !important;color:#6ECFAA !important;}
        .feature-card:hover{border-color:#6ECFAA44 !important;transform:translateY(-4px);}
        .page-card:hover{transform:translateY(-4px);border-color:#6ECFAA66 !important;box-shadow:0 12px 32px rgba(110,207,170,.15);}
        .faq-item:hover{border-color:#6ECFAA33 !important;}
        .nav-link:hover{color:#F0EEF8 !important;}
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .gradient-text{background:linear-gradient(135deg,#6ECFAA,#B44FD4,#6ECFAA);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradientShift 4s ease infinite;}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-15%",left:"-8%",width:"60vw",height:"60vh",background:"radial-gradient(circle,rgba(110,207,170,.07),transparent 70%)"}}/>
        <div style={{position:"absolute",bottom:"0",right:"-8%",width:"55vw",height:"55vh",background:"radial-gradient(circle,rgba(180,79,212,.08),transparent 70%)"}}/>
      </div>

      <div style={{position:"relative",zIndex:1}}>

        {/* NAV */}
        <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 48px",borderBottom:`1px solid ${C.border}`,background:"rgba(13,13,15,.92)",backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,color:"#fff",fontSize:16}}>V</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17}}>VISION <span style={{color:C.mint}}>2.0</span></span>
          </div>
          <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
            <a href="#pages"   className="nav-link" style={{color:C.muted,fontSize:13,fontWeight:500,transition:"color .2s"}}>Pages</a>
            <a href="#faq"     className="nav-link" style={{color:C.muted,fontSize:13,fontWeight:500,transition:"color .2s"}}>FAQ</a>
            <a href="/auth"    style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${C.border}`,color:C.muted,fontSize:13,fontWeight:600,transition:"all .2s"}}>Connexion</a>
            <a href="/streaming">
              <button className="btn-main" style={{padding:"9px 20px",borderRadius:10,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:13,transition:"all .25s"}}>
                Ouvrir l&apos;app
              </button>
            </a>
          </div>
        </nav>

        {/* HERO */}
        <section style={{textAlign:"center",padding:"100px 24px 80px",maxWidth:800,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:`${C.mint}15`,border:`1px solid ${C.mint}33`,fontSize:12,fontWeight:700,color:C.mint,marginBottom:28}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C.mint,animation:"pulse 1.5s infinite",display:"inline-block"}}/>
            BETA OUVERTE — 47 artistes inscrits
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(36px,6vw,64px)",lineHeight:1.05,marginBottom:24}}>
            La plateforme qui fait<br/>
            <span className="gradient-text">vivre les artistes emergents</span>
          </h1>
          <p style={{fontSize:"clamp(15px,2vw,18px)",color:C.muted,lineHeight:1.7,marginBottom:40,maxWidth:520,margin:"0 auto 40px"}}>
            Stream ta musique. Monetise tes fans. Garde 90% de tes revenus.
          </p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/streaming">
              <button className="btn-main" style={{padding:"15px 32px",borderRadius:14,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:16,transition:"all .25s",boxShadow:`0 4px 24px ${C.mint}33`}}>
                Ouvrir l&apos;application →
              </button>
            </a>
            <a href="#signup">
              <button className="btn-ghost" style={{padding:"15px 32px",borderRadius:14,border:`1.5px solid ${C.border}`,cursor:"pointer",background:"transparent",color:C.muted,fontWeight:600,fontSize:16,transition:"all .25s"}}>
                Rejoindre la beta
              </button>
            </a>
          </div>

          <div style={{display:"flex",justifyContent:"center",marginTop:64,borderTop:`1px solid ${C.border}`,paddingTop:40}}>
            {[["0%","commission dons"],["90%","revenus abonnements"],["100%","gratuit pour demarrer"]].map(([v,l],i)=>(
              <div key={i} style={{flex:1,padding:"0 20px",borderRight:i<2?`1px solid ${C.border}`:"none",maxWidth:220}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:32,background:`linear-gradient(135deg,${C.mint},${C.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4}}>{v}</div>
                <div style={{fontSize:13,color:C.muted}}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PAGES NAVIGATION */}
        <section id="pages" style={{padding:"80px 48px",background:C.surface,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
          <div style={{maxWidth:960,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{fontSize:12,color:C.mint,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:12}}>Navigation</div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,36px)",marginBottom:10}}>Acces a toutes les pages</h2>
              <p style={{color:C.muted,fontSize:14}}>Clique sur une carte pour y acceder directement</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
              {PAGES.map((pg,i)=>(
                <a key={i} href={pg.href}>
                  <div className="page-card" style={{padding:"24px",borderRadius:18,background:C.card,border:`1px solid ${C.border}`,transition:"all .25s",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:16}}>
                    <div style={{width:48,height:48,borderRadius:14,flexShrink:0,background:`${pg.color}18`,border:`1px solid ${pg.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{pg.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:6}}>{pg.label}</div>
                      <div style={{fontSize:13,color:C.muted,lineHeight:1.5,marginBottom:10}}>{pg.desc}</div>
                      <div style={{fontSize:12,color:pg.color,fontWeight:600}}>Acceder →</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{padding:"80px 48px",maxWidth:960,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontSize:12,color:C.purple,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:12}}>Fonctionnalites</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,36px)"}}>Tout ce dont un artiste a besoin</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20}}>
            {FEATURES.map((f,i)=>(
              <div key={i} className="feature-card" style={{padding:"24px",borderRadius:18,background:C.card,border:`1px solid ${C.border}`,transition:"all .25s"}}>
                <div style={{fontSize:28,marginBottom:14}}>{f.icon}</div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{f.title}</div>
                <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{f.desc}</div>
                <div style={{marginTop:16,height:2,borderRadius:1,background:`linear-gradient(to right,${f.color},transparent)`}}/>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{padding:"60px 48px",background:`linear-gradient(135deg,${C.mint}15,${C.purple}15)`,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
          <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(22px,3vw,32px)",marginBottom:14}}>Pret a lancer ta musique ?</h2>
            <p style={{color:C.muted,fontSize:14,marginBottom:28}}>Rejoins les artistes qui font confiance a Vision 2.0</p>
            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
              <a href="/auth"><button className="btn-main" style={{padding:"14px 28px",borderRadius:13,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:15,transition:"all .25s"}}>Creer mon compte →</button></a>
              <a href="/streaming"><button className="btn-ghost" style={{padding:"14px 28px",borderRadius:13,border:`1.5px solid ${C.border}`,cursor:"pointer",background:"transparent",color:C.muted,fontWeight:600,fontSize:15,transition:"all .25s"}}>Voir l&apos;application</button></a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{padding:"80px 48px",maxWidth:700,margin:"0 auto"}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(22px,3vw,32px)",textAlign:"center",marginBottom:36}}>Questions frequentes</h2>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {FAQS.map((faq,i)=>(
              <div key={i} className="faq-item" onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{padding:"16px 18px",borderRadius:14,border:`1px solid ${openFaq===i?`${C.mint}44`:C.border}`,background:openFaq===i?`${C.mint}06`:C.card,cursor:"pointer",transition:"all .2s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:600,fontSize:14,color:openFaq===i?C.mint:C.text}}>{faq.q}</span>
                  <span style={{color:openFaq===i?C.mint:C.muted,fontSize:20,transition:"transform .2s",transform:openFaq===i?"rotate(45deg)":"none",lineHeight:1}}>+</span>
                </div>
                {openFaq===i&&<p style={{marginTop:10,fontSize:13,color:C.muted,lineHeight:1.7}}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* SIGNUP */}
        <section id="signup" style={{padding:"80px 24px",textAlign:"center",borderTop:`1px solid ${C.border}`,background:C.surface}}>
          <div style={{maxWidth:440,margin:"0 auto"}}>
            {!submitted ? (
              <>
                <div style={{fontSize:48,marginBottom:16,animation:"float 4s ease-in-out infinite"}}>🎵</div>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,36px)",marginBottom:10}}>Rejoins la beta artiste</h2>
                <p style={{color:C.muted,fontSize:14,marginBottom:28,lineHeight:1.6}}>Places limitees. Badge Artiste Fondateur a vie.</p>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                  {[{ph:"Ton nom d'artiste",val:name,set:setName,type:"text"},{ph:"Ton email",val:email,set:setEmail,type:"email"},{ph:"Ton genre musical",val:genre,set:setGenre,type:"text"}].map((f,i)=>(
                    <input key={i} type={f.type} placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)} style={{padding:"13px 16px",borderRadius:12,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontSize:14,width:"100%",fontFamily:"'DM Sans',sans-serif",transition:"border .2s"}}/>
                  ))}
                </div>
                <button className="btn-main" onClick={handleSubmit} disabled={!email||!name||loading} style={{width:"100%",padding:"15px",borderRadius:13,border:"none",cursor:(!email||!name)?"not-allowed":"pointer",background:(!email||!name)?C.border:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:15,transition:"all .25s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {loading?<span style={{width:16,height:16,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>:"Rejoindre la beta →"}
                </button>
                <p style={{fontSize:11,color:C.muted,marginTop:12}}>Zero spam. Gratuit.</p>
              </>
            ) : (
              <div>
                <div style={{fontSize:56,marginBottom:16}}>🎉</div>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,marginBottom:10}}>Tu es dans la liste, {name} !</h2>
                <p style={{color:C.muted,fontSize:14,lineHeight:1.7,marginBottom:20}}>On te contacte des que ton acces est pret.</p>
                <a href="/streaming"><button className="btn-main" style={{padding:"13px 24px",borderRadius:12,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:14}}>Decouvrir l&apos;application →</button></a>
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{padding:"28px 48px",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,color:"#fff",fontSize:13}}>V</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14}}>VISION <span style={{color:C.mint}}>2.0</span></span>
          </div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            {PAGES.map(pg=>(
              <a key={pg.href} href={pg.href} style={{fontSize:12,color:C.muted,textDecoration:"none"}}
                onMouseEnter={e=>(e.currentTarget.style.color=C.mint)}
                onMouseLeave={e=>(e.currentTarget.style.color=C.muted)}>
                {pg.icon} {pg.label}
              </a>
            ))}
          </div>
          <div style={{fontSize:12,color:C.muted}}>2025 Vision 2.0</div>
        </footer>

      </div>
    </div>
  );
}
