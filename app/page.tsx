"use client";
import { useState } from "react";

const C = {
  mint:"#6ECFAA", purple:"#B44FD4", gold:"#F5C842",
  bg:"#0D0D0F", surface:"#141418", card:"#1A1A22",
  border:"#2A2A36", text:"#F0EEF8", muted:"#7A7890",
};

const FEATURES = [
  { icon:"💸", title:"Dons directs",        desc:"Tes fans te soutiennent à partir de 1€. 90% te revient.", color:C.mint   },
  { icon:"⭐", title:"Abonnements fans",    desc:"Fan, Super Fan, VIP. Des revenus récurrents chaque mois.", color:C.purple },
  { icon:"🎵", title:"Streaming libre",     desc:"Ta musique accessible à tous, gratuitement.",              color:C.gold   },
  { icon:"📊", title:"Dashboard revenus",   desc:"Suis tes écoutes et tes revenus en temps réel.",           color:C.mint   },
  { icon:"🔔", title:"Notifications live",  desc:"Chaque don, chaque abonné — tu es notifié instantanément.",color:C.purple },
  { icon:"🔐", title:"Paiements Stripe",    desc:"Virement mensuel automatique directement sur ton IBAN.",   color:C.gold   },
];

const FAQS = [
  { q:"C'est quoi Vision 2.0 ?",                   a:"Une plateforme de streaming créée pour les artistes en développement. Tu partages ta musique, reçois des dons et des abonnements fans — tout en gardant le contrôle." },
  { q:"Combien Vision 2.0 prend de commission ?",  a:"10% sur les dons. 10% sur les abonnements fans. C'est tout. Spotify prend 70%, nous prenons 10% seulement." },
  { q:"Comment sont versés les revenus ?",         a:"Via Stripe Connect. Tu t'inscris avec ton IBAN, et les paiements sont virés directement sur ton compte bancaire." },
  { q:"Faut-il avoir des fans pour commencer ?",   a:"Non. Tu crées ton profil et uploades ta musique dès aujourd'hui. La bêta est l'occasion de construire ta première communauté." },
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
    <div style={{ fontFamily:"'DM Sans','Helvetica Neue',sans-serif", background:C.bg, color:C.text, minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        a{text-decoration:none;}
        input:focus{outline:none;border-color:#6ECFAA !important;}
        .btn-main:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(110,207,170,.4);}
        .btn-ghost:hover{border-color:#6ECFAA !important;color:#6ECFAA !important;}
        .feature-card:hover{border-color:#6ECFAA44 !important;transform:translateY(-4px);}
        .faq-item:hover{border-color:#6ECFAA33 !important;}
        .nav-link:hover{color:#F0EEF8 !important;}
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .gradient-text{background:linear-gradient(135deg,#6ECFAA,#B44FD4,#6ECFAA);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradientShift 4s ease infinite;}
      `}</style>

      {/* Ambient */}
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
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            {["Fonctionnalités","FAQ"].map(l=>(
              <a key={l} href={`#${l.toLowerCase()}`} className="nav-link" style={{color:C.muted,fontSize:13,fontWeight:500,transition:"color .2s"}}>{l}</a>
            ))}
            <a href="#signup">
              <button className="btn-main" style={{padding:"9px 20px",borderRadius:10,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:13,transition:"all .25s"}}>
                Rejoindre la bêta
              </button>
            </a>
          </div>
        </nav>

        {/* HERO */}
        <section style={{textAlign:"center",padding:"100px 24px 80px",maxWidth:800,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:`${C.mint}15`,border:`1px solid ${C.mint}33`,fontSize:12,fontWeight:700,color:C.mint,marginBottom:28}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C.mint,animation:"pulse 1.5s infinite",display:"inline-block"}}/>
            BÊTA OUVERTE — 47 artistes inscrits
          </div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(36px,6vw,64px)",lineHeight:1.05,marginBottom:24}}>
            La plateforme qui fait<br/>
            <span className="gradient-text">vivre les artistes émergents</span>
          </h1>
          <p style={{fontSize:"clamp(15px,2vw,18px)",color:C.muted,lineHeight:1.7,marginBottom:40,maxWidth:520,margin:"0 auto 40px"}}>
            Stream ta musique. Monétise tes fans. Garde 90% de tes revenus.<br/>
            Vision 2.0 est la plateforme que Spotify n&apos;a jamais voulu construire.
          </p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="#signup">
              <button className="btn-main" style={{padding:"15px 32px",borderRadius:14,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:16,transition:"all .25s",boxShadow:`0 4px 24px ${C.mint}33`}}>
                Rejoindre la bêta gratuite →
              </button>
            </a>
            <a href="#fonctionnalités">
              <button className="btn-ghost" style={{padding:"15px 32px",borderRadius:14,border:`1.5px solid ${C.border}`,cursor:"pointer",background:"transparent",color:C.muted,fontWeight:600,fontSize:16,transition:"all .25s"}}>
                Découvrir le produit
              </button>
            </a>
          </div>

          {/* Stats */}
          <div style={{display:"flex",justifyContent:"center",marginTop:64,borderTop:`1px solid ${C.border}`,paddingTop:40,gap:0}}>
            {[["10%","commission sur les dons"],["90%","des revenus abonnements"],["100%","gratuit pour démarrer"]].map(([v,l],i)=>(
              <div key={i} style={{flex:1,padding:"0 20px",borderRight:i<2?`1px solid ${C.border}`:"none",maxWidth:200}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:32,background:`linear-gradient(135deg,${C.mint},${C.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4}}>{v}</div>
                <div style={{fontSize:13,color:C.muted}}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="fonctionnalités" style={{padding:"80px 48px",maxWidth:960,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontSize:12,color:C.purple,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:12}}>Fonctionnalités</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,36px)"}}>Tout ce dont un artiste a besoin</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20}}>
            {FEATURES.map((f,i)=>(
              <div key={i} className="feature-card" style={{padding:"24px",borderRadius:18,background:C.card,border:`1px solid ${C.border}`,transition:"all .25s",cursor:"default"}}>
                <div style={{fontSize:28,marginBottom:14}}>{f.icon}</div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{f.title}</div>
                <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{f.desc}</div>
                <div style={{marginTop:16,height:2,borderRadius:1,background:`linear-gradient(to right,${f.color},transparent)`}}/>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARATIF */}
        <section style={{padding:"80px 48px",background:C.surface,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
          <div style={{maxWidth:760,margin:"0 auto"}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(22px,3vw,32px)",textAlign:"center",marginBottom:36}}>Pourquoi pas Spotify ?</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              {[
                { label:"Spotify", items:["0.003€ par stream","Seuil minimum d'écoutes","0 lien direct avec tes fans","Algorithme opaque","Commission : 70%"], bad:true },
                { label:"Vision 2.0", items:["Dons directs : 90% te revient","Premier fan = premier euro","Lien direct avec ta communauté","Tu contrôles ta visibilité","Commission : 10% dons, 10% abos"], bad:false },
              ].map((col,i)=>(
                <div key={i} style={{padding:"24px",borderRadius:18,background:col.bad?"rgba(248,113,113,.05)":`${C.mint}08`,border:`1.5px solid ${col.bad?"rgba(248,113,113,.2)":`${C.mint}33`}`}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:16,color:col.bad?"#F87171":C.mint}}>{col.label}</div>
                  {col.items.map((item,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:10}}>
                      <span style={{color:col.bad?"#F87171":C.mint,fontSize:14,flexShrink:0}}>{col.bad?"✗":"✓"}</span>
                      <span style={{fontSize:13,color:col.bad?C.muted:C.text,lineHeight:1.5}}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{padding:"80px 48px",maxWidth:700,margin:"0 auto"}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(22px,3vw,32px)",textAlign:"center",marginBottom:36}}>Questions fréquentes</h2>
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
                <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,36px)",marginBottom:10}}>
                  Rejoins la bêta<br/><span className="gradient-text">en tant qu&apos;artiste</span>
                </h2>
                <p style={{color:C.muted,fontSize:14,marginBottom:28,lineHeight:1.6}}>
                  Places limitées. Les premiers inscrits auront un badge &quot;Artiste Fondateur&quot; à vie.
                </p>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                  {[{ph:"Ton nom d'artiste",val:name,set:setName,type:"text"},{ph:"Ton email",val:email,set:setEmail,type:"email"},{ph:"Ton genre musical (ex: Neo-Soul, Rap…)",val:genre,set:setGenre,type:"text"}].map((f,i)=>(
                    <input key={i} type={f.type} placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)}
                      style={{padding:"13px 16px",borderRadius:12,border:`1px solid ${C.border}`,background:C.card,color:C.text,fontSize:14,width:"100%",fontFamily:"'DM Sans',sans-serif",transition:"border .2s"}}/>
                  ))}
                </div>
                <button className="btn-main" onClick={handleSubmit} disabled={!email||!name||loading} style={{
                  width:"100%",padding:"15px",borderRadius:13,border:"none",cursor:(!email||!name)?"not-allowed":"pointer",
                  background:(!email||!name)?C.border:`linear-gradient(135deg,${C.mint},${C.purple})`,
                  color:"#fff",fontWeight:700,fontSize:15,transition:"all .25s",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                }}>
                  {loading?<span style={{width:16,height:16,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>:"Rejoindre la bêta →"}
                </button>
                <p style={{fontSize:11,color:C.muted,marginTop:12}}>🔒 Zéro spam. Zéro carte bancaire requise.</p>
              </>
            ) : (
              <div>
                <div style={{fontSize:56,marginBottom:16}}>🎉</div>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,marginBottom:10}}>Tu es dans la liste, {name} !</h2>
                <p style={{color:C.muted,fontSize:14,lineHeight:1.7,marginBottom:20}}>On t&apos;envoie un email dès que ton accès bêta est prêt.</p>
                <div style={{padding:"14px",borderRadius:12,background:`${C.mint}10`,border:`1px solid ${C.mint}33`,fontSize:13,color:C.mint,fontWeight:600}}>
                  🏆 Badge &quot;Artiste Fondateur&quot; réservé sur ton profil
                </div>
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
          <div style={{fontSize:12,color:C.muted}}>© 2025 Vision 2.0 · contact@vision2.music</div>
        </footer>

      </div>
    </div>
  );
}

