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
.btn:hover{opacity:.85;transform:translateY(-1px);}
.stat-card{transition:transform .2s;}
.stat-card:hover{transform:translateY(-3px);}
.track-row:hover{background:#20202C !important;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
`;

export default function DashboardPage() {
  const [user,         setUser]         = useState<any>(null);
  const [profile,      setProfile]      = useState<any>(null);
  const [tracks,       setTracks]       = useState<any[]>([]);
  const [donations,    setDonations]    = useState<any[]>([]);
  const [subscriptions,setSubs]         = useState<any[]>([]);
  const [followers,    setFollowers]    = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setTab]          = useState<"overview"|"tracks"|"transactions">("overview");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      setUser(user);

      const [profileRes, tracksRes, donRes, subRes, followerRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("tracks").select("*").eq("artist_id", user.id).order("created_at", { ascending: false }),
        supabase.from("donations").select("*, fan:profiles!fan_id(display_name)").eq("artist_id", user.id).order("created_at", { ascending: false }),
        supabase.from("subscriptions").select("*, fan:profiles!fan_id(display_name)").eq("artist_id", user.id).eq("status", "active"),
        supabase.from("followers").select("*", { count:"exact", head:true }).eq("artist_id", user.id),
      ]);

      setProfile(profileRes.data);
      setTracks(tracksRes.data || []);
      setDonations(donRes.data || []);
      setSubs(subRes.data || []);
      setFollowers(followerRes.count || 0);
      setLoading(false);
    };
    init();
  }, []);

  const totalDons    = donations.reduce((sum, d) => sum + d.amount, 0) / 100;
  const mrr          = subscriptions.reduce((sum, s) => sum + s.amount, 0) / 100;
  const totalPlays   = tracks.reduce((sum, t) => sum + (t.play_count || 0), 0);
  const fmtE         = (n: number) => `${n.toFixed(2)} €`;
  const fmtK         = (n: number) => n >= 1000 ? (n/1000).toFixed(1)+"k" : String(n);
  const fmt          = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const fmtDate      = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day:"2-digit", month:"short" });

  const deleteTrack = async (id: string) => {
    await supabase.from("tracks").delete().eq("id", id);
    setTracks(prev => prev.filter(t => t.id !== id));
  };

  if (loading) return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center"}}>
        <span style={{width:28,height:28,border:`2px solid ${C.border}`,borderTopColor:C.mint,borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>
        <div style={{marginTop:14,color:C.muted}}>Chargement du dashboard…</div>
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

      <div style={{maxWidth:900,margin:"0 auto",position:"relative",zIndex:1,animation:"fadeUp .4s ease both"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:13,color:"#fff"}}>V</div>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15}}>VISION <span style={{color:C.mint}}>2.0</span></span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,overflow:"hidden",background:C.card,border:`2px solid ${C.mint}44`}}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🎤</div>
                }
              </div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22}}>Dashboard</div>
                <div style={{color:C.muted,fontSize:13}}>Bonjour, {profile?.display_name || "Artiste"} 👋</div>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <a href="/upload" style={{padding:"9px 16px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontSize:13,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>
              ⬆️ Uploader
            </a>
            <a href="/streaming" style={{padding:"9px 14px",borderRadius:10,border:`1px solid ${C.border}`,color:C.muted,fontSize:13,textDecoration:"none"}}>← App</a>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:32}}>
          {[
            { icon:"💰", label:"MRR",           value:fmtE(mrr),         sub:`${subscriptions.length} abonnés actifs`, color:C.mint   },
            { icon:"💸", label:"Total dons",     value:fmtE(totalDons),   sub:`${donations.length} dons reçus`,        color:C.purple },
            { icon:"👥", label:"Followers",      value:fmtK(followers),   sub:"abonnés gratuits",                      color:C.gold   },
            { icon:"🎵", label:"Écoutes totales",value:fmtK(totalPlays),  sub:`${tracks.length} titres publiés`,       color:C.mint   },
          ].map(k=>(
            <div key={k.label} className="stat-card" style={{padding:"18px",borderRadius:16,background:C.card,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:22,marginBottom:8}}>{k.icon}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:24,color:k.color,marginBottom:2}}>{k.value}</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:3}}>{k.label}</div>
              <div style={{fontSize:10,color:k.color,opacity:.7}}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Plan breakdown */}
        {subscriptions.length > 0 && (
          <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,padding:"20px 24px",marginBottom:24}}>
            <SLabel label="Abonnements par plan" color={C.purple}/>
            <div style={{display:"flex",gap:12}}>
              {[
                { plan:"fan",   label:"Fan (3€)",       color:C.mint   },
                { plan:"super", label:"Super Fan (7€)",  color:C.purple },
                { plan:"vip",   label:"VIP (15€)",       color:C.gold   },
              ].map(p=>{
                const count = subscriptions.filter(s=>s.plan===p.plan).length;
                const pct   = subscriptions.length > 0 ? Math.round(count/subscriptions.length*100) : 0;
                return (
                  <div key={p.plan} style={{flex:1,padding:"14px",borderRadius:12,background:C.card2,border:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                      <span style={{fontSize:12,fontWeight:600,color:p.color}}>{p.label}</span>
                      <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20}}>{count}</span>
                    </div>
                    <div style={{height:4,borderRadius:2,background:C.border,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,borderRadius:2,background:p.color}}/>
                    </div>
                    <div style={{fontSize:10,color:C.muted,marginTop:5}}>{pct}% des abonnés</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{display:"flex",gap:4,padding:4,background:C.surface,borderRadius:12,marginBottom:24,width:"fit-content"}}>
          {[["overview","📊 Vue d'ensemble"],["tracks","🎵 Mes titres"],["transactions","💳 Transactions"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id as any)} style={{
              padding:"8px 18px",borderRadius:9,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
              background:activeTab===id?`linear-gradient(135deg,rgba(110,207,170,.2),rgba(180,79,212,.15))`:"transparent",
              color:activeTab===id?C.mint:C.muted,transition:"all .2s",
            }}>{lbl}</button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab==="overview" && (
          <div>
            {subscriptions.length > 0 && (
              <>
                <SLabel label="Abonnés actifs" color={C.mint}/>
                <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:24}}>
                  {subscriptions.slice(0,5).map((s:any,i:number)=>(
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",background:i%2===0?C.card:C.card2,borderBottom:i<subscriptions.length-1?`1px solid ${C.border}`:"none"}}>
                      <div style={{width:34,height:34,borderRadius:9,background:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>👤</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600}}>{s.fan?.display_name||"Fan anonyme"}</div>
                        <div style={{fontSize:11,color:C.muted,textTransform:"capitalize"}}>Plan {s.plan}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontWeight:700,color:C.mint}}>{fmtE(s.amount/100)}/mois</div>
                        {s.current_period_end&&<div style={{fontSize:10,color:C.muted}}>jusqu&apos;au {fmtDate(s.current_period_end)}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {donations.length > 0 && (
              <>
                <SLabel label="Derniers dons" color={C.purple}/>
                <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                  {donations.slice(0,5).map((d:any,i:number)=>(
                    <div key={d.id} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",background:i%2===0?C.card:C.card2,borderBottom:i<donations.length-1?`1px solid ${C.border}`:"none"}}>
                      <div style={{width:34,height:34,borderRadius:9,background:`${C.mint}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>💸</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600}}>{d.fan?.display_name||"Fan anonyme"}</div>
                        <div style={{fontSize:11,color:C.muted}}>{fmtDate(d.created_at)}</div>
                      </div>
                      <div style={{fontWeight:700,color:C.mint}}>{fmtE(d.amount/100)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {donations.length===0&&subscriptions.length===0&&(
              <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
                <div style={{fontSize:48,marginBottom:16}}>🚀</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,marginBottom:8}}>Pas encore de revenus</div>
                <div style={{fontSize:14,marginBottom:24}}>Upload ta musique et partage ton profil pour commencer à recevoir du soutien</div>
                <a href="/upload" style={{padding:"12px 24px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:14,textDecoration:"none"}}>
                  ⬆️ Uploader un titre
                </a>
              </div>
            )}
          </div>
        )}

        {/* Tracks Tab */}
        {activeTab==="tracks" && (
          <div>
            {tracks.length === 0 ? (
              <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
                <div style={{fontSize:36,marginBottom:12}}>🎵</div>
                <div style={{fontWeight:600,marginBottom:16}}>Aucun titre publié</div>
                <a href="/upload" style={{padding:"11px 22px",borderRadius:11,border:"none",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,fontSize:14,textDecoration:"none"}}>
                  ⬆️ Uploader mon premier titre
                </a>
              </div>
            ) : (
              <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                {tracks.map((t:any,i:number)=>(
                  <div key={t.id} className="track-row" style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",background:i%2===0?C.card:C.card2,borderBottom:i<tracks.length-1?`1px solid ${C.border}`:"none",transition:"background .2s"}}>
                    <div style={{width:42,height:42,borderRadius:10,overflow:"hidden",background:C.border,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {t.cover_url ? <img src={t.cover_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:18}}>🎵</span>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</div>
                      <div style={{fontSize:11,color:C.muted}}>{fmt(t.duration)} · {fmtK(t.play_count||0)} écoutes · {fmtDate(t.created_at)}</div>
                    </div>
                    {t.is_exclusive&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:`${C.purple}22`,color:C.purple,fontWeight:700,flexShrink:0}}>Exclusif ⭐</span>}
                    <button onClick={()=>deleteTrack(t.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.danger,fontSize:16,padding:4,opacity:.6,flexShrink:0}} title="Supprimer">🗑</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab==="transactions" && (
          <div>
            {[...donations.map(d=>({...d,txType:"don"})), ...subscriptions.map(s=>({...s,txType:"abonnement"}))]
              .sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime())
              .length === 0 ? (
              <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
                <div style={{fontSize:36,marginBottom:12}}>💳</div>
                <div style={{fontWeight:600}}>Aucune transaction pour le moment</div>
              </div>
            ) : (
              <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden"}}>
                {[...donations.map(d=>({...d,txType:"don"})), ...subscriptions.map(s=>({...s,txType:"abonnement"}))]
                  .sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime())
                  .map((tx:any,i:number,arr:any[])=>(
                  <div key={tx.id} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",background:i%2===0?C.card:C.card2,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                    <div style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,background:tx.txType==="don"?`${C.mint}20`:`${C.purple}20`,flexShrink:0}}>
                      {tx.txType==="don"?"💸":"⭐"}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600}}>{tx.fan?.display_name||"Fan anonyme"}</div>
                      <div style={{fontSize:11,color:C.muted,textTransform:"capitalize"}}>{tx.txType}{tx.plan?` · Plan ${tx.plan}`:""}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontWeight:700,color:tx.txType==="don"?C.mint:C.purple}}>{fmtE(tx.amount/100)}{tx.txType==="abonnement"?"/mois":""}</div>
                      <div style={{fontSize:10,color:C.muted}}>{fmtDate(tx.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function SLabel({label,color}:{label:string,color:string}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
      <div style={{width:3,height:16,borderRadius:2,background:color}}/>
      <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16}}>{label}</span>
    </div>
  );
}
