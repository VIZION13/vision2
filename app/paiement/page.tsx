"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const C = {
  mint:"#6ECFAA", purple:"#B44FD4", gold:"#F5C842",
  bg:"#0D0D0F", surface:"#141418", card:"#1A1A22", card2:"#20202C",
  border:"#2A2A36", text:"#F0EEF8", muted:"#7A7890",
  success:"#4ADE80", danger:"#F87171",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
input:focus{outline:none;border-color:#6ECFAA !important;}
.btn:hover{opacity:.85;transform:translateY(-1px);}
.plan-card:hover{border-color:#B44FD4 !important;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
`;

const PLANS = [
  { id:"fan",   label:"Fan",       price:3,  icon:"🎵", color:C.mint,   perks:["Accès aux exclusivités","Badge fan","Newsletter privée"] },
  { id:"super", label:"Super Fan", price:7,  icon:"⭐", color:C.purple, perks:["Tout Fan","Stems & instrumentaux","Sessions Q&A","Crédits"] },
  { id:"vip",   label:"VIP",       price:15, icon:"👑", color:C.gold,   perks:["Tout Super Fan","Appel vidéo trimestriel","Merch exclusif","Early release"] },
];

export default function StripePage() {
  const [artists,     setArtists]     = useState<any[]>([]);
  const [selectedArt, setSelectedArt] = useState<any>(null);
  const [selectedPlan,setSelectedPlan]= useState<any>(PLANS[0]);
  const [donAmount,   setDonAmount]   = useState(5);
  const [customDon,   setCustomDon]   = useState("");
  const [mode,        setMode]        = useState<"don"|"subscription">("don");
  const [loading,     setLoading]     = useState(false);
  const [user,        setUser]        = useState<any>(null);
  const [step,        setStep]        = useState<"select"|"pay">("select");
  const [cardNum,     setCardNum]     = useState("");
  const [cardExp,     setCardExp]     = useState("");
  const [cardCvc,     setCardCvc]     = useState("");
  const [cardName,    setCardName]    = useState("");
  const [success,     setSuccess]     = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const { data } = await supabase.from("profiles").select("*").eq("is_artist", true);
      setArtists(data || []);
      if (data && data.length > 0) setSelectedArt(data[0]);
    };
    init();
  }, []);

  const fmtNum = (v: string) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp = (v: string) => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };
  const fmtE   = (n: number) => `${n.toFixed(2)} €`;
  const finalAmount = customDon ? Number(customDon) : donAmount;
  const valid = cardNum.replace(/\s/g,"").length===16 && cardExp.length===5 && cardCvc.length===3 && cardName.length>2;

  const handlePay = async () => {
    if (!user) { window.location.href = "/auth"; return; }
    setLoading(true);

    // Simulation paiement Stripe (remplacer par vraie intégration Stripe)
    // En prod : appeler une Edge Function Supabase qui crée le PaymentIntent
    await new Promise(r => setTimeout(r, 2000));

    // Enregistrer en BDD
    if (mode === "don") {
      await supabase.from("donations").insert({
        fan_id:    user.id,
        artist_id: selectedArt.id,
        amount:    finalAmount * 100, // en centimes
        message:   `Don de ${fmtE(finalAmount)}`,
      });
    } else {
      await supabase.from("subscriptions").upsert({
        fan_id:    user.id,
        artist_id: selectedArt.id,
        plan:      selectedPlan.id,
        amount:    selectedPlan.price * 100,
        status:    "active",
        current_period_end: new Date(Date.now() + 30*24*3600*1000).toISOString(),
      }, { onConflict: "fan_id,artist_id" });
    }

    setLoading(false);
    setSuccess(true);
  };

  if (success) return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center",animation:"fadeUp .4s ease both",maxWidth:400}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:32,boxShadow:`0 0 40px ${C.mint}44`}}>✓</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:28,marginBottom:8}}>{mode==="don"?"Don envoyé !":"Abonnement activé !"}</div>
        <div style={{color:C.muted,fontSize:14,lineHeight:1.7,marginBottom:28}}>
          {mode==="don"
            ? `${selectedArt?.display_name} reçoit ${fmtE(finalAmount)} directement. Merci ! 🙏`
            : `Bienvenue dans la communauté ${selectedArt?.display_name} · Plan ${selectedPlan.label}.`
          }
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button onClick={()=>setSuccess(false)} style={{padding:"11px 20px",borderRadius:11,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontWeight:600,cursor:"pointer"}}>Faire un autre don</button>
          <a href="/streaming" style={{padding:"11px 20px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,cursor:"pointer",textDecoration:"none"}}>Retour à l&apos;app</a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",padding:"32px 24px"}}>
      <style>{CSS}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-15%",left:"-8%",width:"55vw",height:"55vh",background:`radial-gradient(circle,rgba(110,207,170,.06),transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:"0",right:"-8%",width:"50vw",height:"50vh",background:`radial-gradient(circle,rgba(180,79,212,.07),transparent 70%)`}}/>
      </div>

      <div style={{maxWidth:560,margin:"0 auto",position:"relative",zIndex:1,animation:"fadeUp .4s ease both"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:13,color:"#fff"}}>V</div>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15}}>VISION <span style={{color:C.mint}}>2.0</span></span>
            </div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26}}>Soutenir un artiste</div>
            <div style={{color:C.muted,fontSize:13}}>100% des dons vont directement à l&apos;artiste</div>
          </div>
          <a href="/streaming" style={{padding:"9px 14px",borderRadius:10,border:`1px solid ${C.border}`,color:C.muted,fontSize:13,textDecoration:"none"}}>← App</a>
        </div>

        {step === "select" ? (
          <>
            {/* Sélection artiste */}
            {artists.length > 0 && (
              <div style={{marginBottom:24}}>
                <FieldLabel>Artiste à soutenir</FieldLabel>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {artists.map((a:any) => (
                    <div key={a.id} onClick={()=>setSelectedArt(a)} style={{
                      display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                      borderRadius:12,border:`1.5px solid ${selectedArt?.id===a.id?C.mint:C.border}`,
                      background:selectedArt?.id===a.id?`${C.mint}12`:C.card,
                      cursor:"pointer",transition:"all .2s",
                    }}>
                      <div style={{width:32,height:32,borderRadius:8,overflow:"hidden",background:C.card2,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {a.avatar_url ? <img src={a.avatar_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span>🎤</span>}
                      </div>
                      <div>
                        <div style={{fontWeight:600,fontSize:13}}>{a.display_name}</div>
                        <div style={{fontSize:11,color:C.muted}}>{a.genre}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mode : don ou abonnement */}
            <div style={{display:"flex",gap:4,padding:4,background:C.surface,borderRadius:12,marginBottom:24,width:"fit-content"}}>
              {[["don","💸 Don libre"],["subscription","⭐ Abonnement"]].map(([id,lbl])=>(
                <button key={id} onClick={()=>setMode(id as any)} style={{
                  padding:"9px 20px",borderRadius:9,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
                  background:mode===id?`linear-gradient(135deg,rgba(110,207,170,.2),rgba(180,79,212,.15))`:"transparent",
                  color:mode===id?C.mint:C.muted,transition:"all .2s",
                }}>{lbl}</button>
              ))}
            </div>

            {mode === "don" ? (
              <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,padding:"24px",marginBottom:20}}>
                <FieldLabel>Montant du don</FieldLabel>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                  {[2,5,10,20].map(v=>(
                    <button key={v} onClick={()=>{setDonAmount(v);setCustomDon("");}} style={{
                      padding:"13px 0",borderRadius:11,border:`2px solid ${!customDon&&donAmount===v?C.mint:C.border}`,
                      background:!customDon&&donAmount===v?`${C.mint}18`:C.card2,
                      color:!customDon&&donAmount===v?C.mint:C.text,fontWeight:700,fontSize:18,cursor:"pointer",
                    }}>{v}€</button>
                  ))}
                </div>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:C.muted}}>€</span>
                  <input type="number" placeholder="Autre montant…" value={customDon} onChange={e=>setCustomDon(e.target.value)}
                    style={{width:"100%",padding:"12px 14px 12px 30px",background:C.card2,border:`1px solid ${customDon?C.mint:C.border}`,borderRadius:11,color:C.text,fontSize:14}}/>
                </div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                {PLANS.map(plan => (
                  <div key={plan.id} className="plan-card" onClick={()=>setSelectedPlan(plan)} style={{
                    padding:"16px 18px",borderRadius:14,cursor:"pointer",
                    border:`2px solid ${selectedPlan.id===plan.id?plan.color:C.border}`,
                    background:selectedPlan.id===plan.id?`${plan.color}10`:C.card,
                    transition:"all .2s",display:"flex",gap:12,alignItems:"flex-start",
                  }}>
                    <span style={{fontSize:24}}>{plan.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:6}}>
                        <span style={{fontWeight:700,fontSize:16}}>{plan.label}</span>
                        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:selectedPlan.id===plan.id?plan.color:C.text}}>{plan.price}€</span>
                        <span style={{color:C.muted,fontSize:12}}>/mois</span>
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {plan.perks.map(p=><span key={p} style={{fontSize:11,color:C.muted}}>✓ {p}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            <div style={{padding:"13px 15px",borderRadius:11,background:`linear-gradient(135deg,rgba(110,207,170,.06),rgba(180,79,212,.06))`,border:`1px solid ${C.border}`,marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{color:C.muted,fontSize:13}}>{mode==="don"?"Don à":"Abonnement"} {selectedArt?.display_name}</span>
                <span style={{fontWeight:700,color:C.mint}}>{mode==="don"?fmtE(finalAmount):`${selectedPlan.price}€/mois`}</span>
              </div>
              <div style={{fontSize:11,color:C.muted,marginTop:4}}>{mode==="don"?"100% reversé à l'artiste":`Vision 2.0 : 10% · ${selectedArt?.display_name} reçoit ${fmtE(selectedPlan.price*.9)}`}</div>
            </div>

            <button className="btn" onClick={()=>{ if(!user){window.location.href="/auth";return;} setStep("pay");}} disabled={mode==="don"&&finalAmount<=0} style={{
              width:"100%",padding:"14px",borderRadius:13,border:"none",
              background:`linear-gradient(135deg,${C.mint},${C.purple})`,
              color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",transition:"all .25s",
            }}>
              {user ? "Continuer vers le paiement →" : "Se connecter pour continuer →"}
            </button>
          </>
        ) : (
          /* Payment step */
          <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,padding:"28px"}}>
            <button onClick={()=>setStep("select")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginBottom:20,padding:0}}>← Retour</button>

            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px",borderRadius:12,background:C.surface,marginBottom:24}}>
              <div style={{width:40,height:40,borderRadius:10,overflow:"hidden",background:C.card2,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {selectedArt?.avatar_url ? <img src={selectedArt.avatar_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span>🎤</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{selectedArt?.display_name}</div>
                <div style={{fontSize:12,color:C.muted}}>{mode==="don"?fmtE(finalAmount):`Plan ${selectedPlan.label} · ${selectedPlan.price}€/mois`}</div>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
              <div><FieldLabel>Titulaire de la carte</FieldLabel><input value={cardName} onChange={e=>setCardName(e.target.value)} placeholder="Jean Dupont" style={{width:"100%",padding:"12px 13px",background:C.card2,border:`1px solid ${C.border}`,borderRadius:11,color:C.text,fontSize:14}}/></div>
              <div><FieldLabel>Numéro de carte</FieldLabel><input value={cardNum} onChange={e=>setCardNum(fmtNum(e.target.value))} placeholder="1234 5678 9012 3456" style={{width:"100%",padding:"12px 13px",background:C.card2,border:`1px solid ${C.border}`,borderRadius:11,color:C.text,fontSize:14}}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><FieldLabel>Expiration</FieldLabel><input value={cardExp} onChange={e=>setCardExp(fmtExp(e.target.value))} placeholder="MM/AA" style={{width:"100%",padding:"12px 13px",background:C.card2,border:`1px solid ${C.border}`,borderRadius:11,color:C.text,fontSize:14}}/></div>
                <div><FieldLabel>CVC</FieldLabel><input value={cardCvc} onChange={e=>setCardCvc(e.target.value.replace(/\D/g,"").slice(0,3))} placeholder="123" style={{width:"100%",padding:"12px 13px",background:C.card2,border:`1px solid ${C.border}`,borderRadius:11,color:C.text,fontSize:14}}/></div>
              </div>
            </div>

            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.muted,marginBottom:20}}>
              🔒 Paiement sécurisé par <span style={{color:"#635BFF",fontWeight:700}}>Stripe</span> · SSL
            </div>

            <button className="btn" onClick={handlePay} disabled={!valid||loading} style={{
              width:"100%",padding:"14px",borderRadius:13,border:"none",
              background:!valid||loading?C.border:`linear-gradient(135deg,${C.mint},${C.purple})`,
              color:!valid||loading?C.muted:"#fff",
              fontWeight:700,fontSize:15,cursor:!valid||loading?"not-allowed":"pointer",
              transition:"all .25s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            }}>
              {loading
                ? <><span style={{width:16,height:16,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>Traitement…</>
                : `Confirmer · ${mode==="don"?fmtE(finalAmount):`${selectedPlan.price}€/mois`}`
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldLabel({children}: {children: React.ReactNode}) {
  return <div style={{fontSize:11,color:"#7A7890",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{children}</div>;
}
