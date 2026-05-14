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
.artist-card:hover{transform:translateY(-4px);border-color:#6ECFAA44 !important;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
`;

export default function FansPage() {
  const [artists,   setArtists]   = useState<any[]>([]);
  const [followed,  setFollowed]  = useState<Set<string>>(new Set());
  const [tracks,    setTracks]    = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [user,      setUser]      = useState<any>(null);
  const [search,    setSearch]    = useState("");
  const [activeTab, setTab]       = useState<"discover"|"following">("discover");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Charger les artistes
      const { data: artistData } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_artist", true)
        .order("created_at", { ascending: false });
      setArtists(artistData || []);

      // Charger les follows de l'utilisateur
      if (user) {
        const { data: followData } = await supabase
          .from("followers")
          .select("artist_id")
          .eq("fan_id", user.id);
        setFollowed(new Set(followData?.map((f:any) => f.artist_id) || []));
      }

      // Charger les derniers titres
      const { data: trackData } = await supabase
        .from("tracks")
        .select("*, artist:profiles!artist_id(display_name, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(10);
      setTracks(trackData || []);
      setLoading(false);
    };
    init();
  }, []);

  const toggleFollow = async (artistId: string) => {
    if (!user) { window.location.href = "/auth"; return; }
    const isFollowed = followed.has(artistId);

    setFollowed(prev => {
      const next = new Set(prev);
      isFollowed ? next.delete(artistId) : next.add(artistId);
      return next;
    });

    if (isFollowed) {
      await supabase.from("followers").delete()
        .eq("fan_id", user.id).eq("artist_id", artistId);
    } else {
      await supabase.from("followers").insert({ fan_id: user.id, artist_id: artistId });
    }
  };

  const filtered = artists.filter(a =>
    a.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.genre?.toLowerCase().includes(search.toLowerCase())
  );

  const followedArtists = artists.filter(a => followed.has(a.id));
  const fmt = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",padding:"32px 24px"}}>
      <style>{CSS}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-15%",left:"-8%",width:"55vw",height:"55vh",background:`radial-gradient(circle,rgba(110,207,170,.06),transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:"0",right:"-8%",width:"50vw",height:"50vh",background:`radial-gradient(circle,rgba(180,79,212,.07),transparent 70%)`}}/>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",position:"relative",zIndex:1,animation:"fadeUp .4s ease both"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:13,color:"#fff"}}>V</div>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15}}>VISION <span style={{color:C.mint}}>2.0</span></span>
            </div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26}}>Espace Fans</div>
            <div style={{color:C.muted,fontSize:13}}>Découvre et suis tes artistes préférés</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            {!user && <a href="/auth" style={{padding:"9px 16px",borderRadius:10,border:`1px solid ${C.mint}`,background:`${C.mint}15`,color:C.mint,fontSize:13,fontWeight:700,textDecoration:"none"}}>Se connecter</a>}
            <a href="/streaming" style={{padding:"9px 14px",borderRadius:10,border:`1px solid ${C.border}`,color:C.muted,fontSize:13,textDecoration:"none"}}>← App</a>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,padding:4,background:C.surface,borderRadius:12,marginBottom:24,width:"fit-content"}}>
          {[["discover","🔍 Découvrir"],["following","❤️ Mes artistes"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id as any)} style={{
              padding:"8px 20px",borderRadius:9,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
              background:activeTab===id?`linear-gradient(135deg,rgba(110,207,170,.2),rgba(180,79,212,.15))`:"transparent",
              color:activeTab===id?C.mint:C.muted,transition:"all .2s",
            }}>{lbl}{id==="following"&&followed.size>0&&<span style={{marginLeft:6,padding:"1px 6px",borderRadius:10,background:C.mint,color:C.bg,fontSize:10,fontWeight:800}}>{followed.size}</span>}</button>
          ))}
        </div>

        {activeTab==="discover" && (
          <>
            {/* Search */}
            <div style={{position:"relative",marginBottom:24,maxWidth:400}}>
              <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:C.muted}}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un artiste ou genre…"
                style={{width:"100%",padding:"11px 14px 11px 38px",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:14}}/>
            </div>

            {loading ? (
              <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
                <span style={{width:24,height:24,border:`2px solid ${C.border}`,borderTopColor:C.mint,borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>
                <div style={{marginTop:12}}>Chargement des artistes…</div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
                <div style={{fontSize:36,marginBottom:12}}>🎤</div>
                <div style={{fontWeight:600,marginBottom:6}}>Aucun artiste trouvé</div>
                <div style={{fontSize:13}}>Les artistes apparaîtront ici une fois inscrits</div>
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16,marginBottom:36}}>
                {filtered.map((a:any) => (
                  <div key={a.id} className="artist-card" style={{
                    background:C.card,border:`1px solid ${C.border}`,borderRadius:18,
                    overflow:"hidden",transition:"all .25s",
                  }}>
                    <div style={{position:"relative",height:140}}>
                      <div style={{width:"100%",height:"100%",background:`linear-gradient(135deg,${C.mint}33,${C.purple}33)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {a.avatar_url
                          ? <img src={a.avatar_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                          : <span style={{fontSize:48}}>🎤</span>
                        }
                      </div>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(26,26,34,1) 0%,transparent 60%)"}}/>
                      <div style={{position:"absolute",top:10,right:10,fontSize:10,padding:"3px 8px",borderRadius:20,background:`${C.mint}33`,color:C.mint,fontWeight:700}}>
                        {a.genre || "Artiste"}
                      </div>
                    </div>
                    <div style={{padding:"14px 16px"}}>
                      <div style={{fontWeight:700,fontSize:15,marginBottom:8}}>{a.display_name}</div>
                      {a.bio && <div style={{fontSize:12,color:C.muted,lineHeight:1.5,marginBottom:12,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{a.bio}</div>}
                      <button className="btn" onClick={()=>toggleFollow(a.id)} style={{
                        width:"100%",padding:"9px",borderRadius:10,border:"none",cursor:"pointer",
                        background:followed.has(a.id)?`${C.mint}20`:`linear-gradient(135deg,${C.mint},${C.purple})`,
                        color:followed.has(a.id)?C.mint:"#fff",
                        fontWeight:700,fontSize:13,transition:"all .25s",
                      }}>
                        {followed.has(a.id) ? "✓ Suivi" : "Suivre"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Derniers titres */}
            {tracks.length > 0 && (
              <>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:3,height:16,borderRadius:2,background:C.purple}}/>
                  Derniers titres
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  {tracks.map((t:any,i:number) => (
                    <div key={t.id} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 12px",borderRadius:10,background:"transparent",transition:"background .2s"}}
                      onMouseEnter={e=>(e.currentTarget.style.background=C.card)}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                      <div style={{width:22,textAlign:"center",fontSize:12,color:C.muted}}>{i+1}</div>
                      <div style={{width:40,height:40,borderRadius:10,overflow:"hidden",background:C.card2,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {t.cover_url ? <img src={t.cover_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span>🎵</span>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</div>
                        <div style={{fontSize:11,color:C.muted}}>{t.artist?.display_name}</div>
                      </div>
                      {t.is_exclusive && <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:`${C.purple}22`,color:C.purple,fontWeight:700}}>Exclusif ⭐</span>}
                      <div style={{fontSize:11,color:C.muted,minWidth:34,textAlign:"right"}}>{fmt(t.duration)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab==="following" && (
          followedArtists.length === 0 ? (
            <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
              <div style={{fontSize:36,marginBottom:12}}>❤️</div>
              <div style={{fontWeight:600,marginBottom:6}}>Tu ne suis encore personne</div>
              <div style={{fontSize:13,marginBottom:20}}>Découvre des artistes et suis ceux qui te plaisent</div>
              <button onClick={()=>setTab("discover")} style={{padding:"10px 24px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.mint},${C.purple})`,color:"#fff",fontWeight:700,cursor:"pointer"}}>
                Découvrir des artistes
              </button>
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
              {followedArtists.map((a:any) => (
                <div key={a.id} className="artist-card" style={{background:C.card,border:`1px solid ${C.mint}33`,borderRadius:18,overflow:"hidden",transition:"all .25s"}}>
                  <div style={{height:100,background:`linear-gradient(135deg,${C.mint}22,${C.purple}22)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {a.avatar_url ? <img src={a.avatar_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:40}}>🎤</span>}
                  </div>
                  <div style={{padding:"12px 14px"}}>
                    <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{a.display_name}</div>
                    <div style={{fontSize:11,color:C.muted,marginBottom:10}}>{a.genre}</div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>toggleFollow(a.id)} style={{flex:1,padding:"7px",borderRadius:9,border:`1px solid ${C.danger}44`,background:`${C.danger}10`,color:C.danger,fontSize:11,fontWeight:700,cursor:"pointer"}}>
                        Ne plus suivre
                      </button>
                      <a href="/streaming" style={{flex:1,padding:"7px",borderRadius:9,border:"none",background:`${C.mint}20`,color:C.mint,fontSize:11,fontWeight:700,cursor:"pointer",textDecoration:"none",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        Écouter
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
