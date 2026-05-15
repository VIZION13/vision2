"use client";
import { useState, useRef } from "react";

const C = {
  mint:"#6ECFAA", purple:"#B44FD4", gold:"#F5C842",
  bg:"#0D0D0F", surface:"#141418", card:"#1A1A22", card2:"#20202C",
  border:"#2A2A36", text:"#F0EEF8", muted:"#7A7890",
  success:"#4ADE80", danger:"#F87171",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
input,textarea,select{outline:none;font-family:'DM Sans',sans-serif;transition:border-color .2s;}
input:focus,textarea:focus,select:focus{border-color:#6ECFAA !important;}
.btn:hover{opacity:.85;transform:translateY(-1px);}
.tab-btn:hover{color:#F0EEF8 !important;}
.drop:hover{border-color:#6ECFAA !important;background:rgba(110,207,170,.04) !important;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
`;

const GENRES_SACEM = ["Variété française","Rap / Hip-Hop","R&B / Soul","Électronique","Afro","Jazz","Classique","Rock","Pop","Monde"];
const VIDEO_TYPES  = ["Clip officiel","Live studio","Making of","Acoustic","Interview","Concert","Teaser"];

export default function ArtistSpacePage() {
  const [tab, setTab] = useState<"upload-audio"|"upload-video"|"sacem">("upload-audio");

  // ── Upload Audio ──
  const audioRef  = useRef<HTMLInputElement>(null);
  const coverRef  = useRef<HTMLInputElement>(null);
  const [audioFile,    setAudioFile]    = useState<File|null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [audioTitle,   setAudioTitle]   = useState("");
  const [audioGenre,   setAudioGenre]   = useState("");
  const [audioExclusive, setAudioExclusive] = useState<"public"|"super"|"vip">("public");
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioProgress,setAudioProgress]= useState(0);
  const [audioOk,      setAudioOk]      = useState(false);
  const [audioTracks,  setAudioTracks]  = useState<any[]>([]);

  // ── Upload Video ──
  const videoRef       = useRef<HTMLInputElement>(null);
  const videoCoverRef  = useRef<HTMLInputElement>(null);
  const [videoFile,       setVideoFile]       = useState<File|null>(null);
  const [videoCoverPreview,setVideoCoverPreview] = useState("");
  const [videoTitle,      setVideoTitle]      = useState("");
  const [videoType,       setVideoType]       = useState("");
  const [videoExclusive,  setVideoExclusive]  = useState<"public"|"super"|"vip">("public");
  const [videoLoading,    setVideoLoading]    = useState(false);
  const [videoProgress,   setVideoProgress]   = useState(0);
  const [videoOk,         setVideoOk]         = useState(false);
  const [videoList,       setVideoList]       = useState<any[]>([]);

  // ── SACEM ──
  const [sacemOk,      setSacemOk]      = useState(false);
  const [sacemLoading, setSacemLoading] = useState(false);
  const [sacem, setSacem] = useState({
    title:"", isrc:"", iswc:"", genre:"", releaseDate:"", label:"Vision 2.0 Edition",
    authors:    [{name:"", sacemNum:"", share:"50"}],
    composers:  [{name:"", sacemNum:"", share:"50"}],
    beatmakers: [{name:"", sacemNum:"", role:"Beatmaker", share:"0"}],
  });

  const fmtSize = (b:number) => b>1024*1024?(b/1024/1024).toFixed(1)+" MB":(b/1024).toFixed(0)+" KB";

  const uploadAudio = () => {
    if(!audioFile||!audioTitle) return;
    setAudioLoading(true); setAudioProgress(10);
    setTimeout(()=>setAudioProgress(50),600);
    setTimeout(()=>setAudioProgress(90),1200);
    setTimeout(()=>{
      setAudioLoading(false); setAudioProgress(100); setAudioOk(true);
      setAudioTracks(p=>[{id:Date.now(),title:audioTitle,genre:audioGenre,exclusive:audioExclusive,cover:coverPreview},...p]);
      setTimeout(()=>{setAudioOk(false);setAudioProgress(0);setAudioFile(null);setCoverPreview("");setAudioTitle("");setAudioGenre("");setAudioExclusive("public");},3000);
    },2000);
  };

  const uploadVideo = () => {
    if(!videoFile||!videoTitle) return;
    setVideoLoading(true); setVideoProgress(10);
    setTimeout(()=>setVideoProgress(50),800);
    setTimeout(()=>setVideoProgress(90),1600);
    setTimeout(()=>{
      setVideoLoading(false); setVideoProgress(100); setVideoOk(true);
      setVideoList(p=>[{id:Date.now(),title:videoTitle,type:videoType,exclusive:videoExclusive,cover:videoCoverPreview},...p]);
      setTimeout(()=>{setVideoOk(false);setVideoProgress(0);setVideoFile(null);setVideoCoverPreview("");setVideoTitle("");setVideoType("");setVideoExclusive("public");},3000);
    },2500);
  };

  const submitSacem = () => {
    setSacemLoading(true);
    setTimeout(()=>{ setSacemLoading(false); setSacemOk(true); }, 2500);
  };

  const addPerson = (field:"authors"|"composers"|"beatmakers") => {
    const defaults:any = { authors:{name:"",sacemNum:"",share:"0"}, composers:{name:"",sacemNum:"",share:"0"}, beatmakers:{name:"",sacemNum:"",role:"Beatmaker",share:"0"} };
    setSacem(s=>({...s,[field]:[...s[field],defaults[field]]}));
  };
  const updatePerson = (field:"authors"|"composers"|"beatmakers", idx:number, key:string, val:string) => {
    setSacem(s=>({...s,[field]:s[field].map((p:any,i:number)=>i===idx?{...p,[key]:val}:p)}));
  };
  const removePerson = (field:"authors"|"composers"|"beatmakers", idx:number) => {
    setSacem(s=>({...s,[field]:s[field].filter((_:any,i:number)=>i!==idx)}));
  };

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh"}}>
      <style>{CSS}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-15%",left:"-8%",width:"55vw",height:"55vh",background:`radial-gradient(circle,rgba(110,207,170,.06),transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:"0",right:"-8%",width:"50vw",height:"50vh",background:`radial-gradient(circle,rgba(180,79,212,.07),transparent 70%)`}}/>
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:800,margin:"0 auto",paddingBottom:80}}>

        {/* NAV */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 28px",borderBottom:`1px solid ${C.border}`,background:"rgba(13,13,15,.92)",backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:50}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:2}}>
              <div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:12,color:"#fff"}}>V</div>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14}}>VISION <span style={{color:C.mint}}>2.0</span></span>
            </div>
            <div style={{fontSize:11,color:C.mint,fontWeight:600,letterSpacing:.5,textTransform:"uppercase" as const}}>🔒 Espace Artiste Privé</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <a href="/dashboard" style={{fontSize:12,color:C.muted,textDecoration:"none",padding:"6px 12px",borderRadius:9,border:`1px solid ${C.border}`}}>📊 Dashboard</a>
            <a href="/artiste" style={{fontSize:12,color:C.muted,textDecoration:"none",padding:"6px 12px",borderRadius:9,border:`1px solid ${C.border}`}}>👤 Mon profil public</a>
          </div>
        </div>

        {/* HEADER */}
        <div style={{padding:"28px 28px 0"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,marginBottom:4}}>Espace Artiste</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:24}}>Upload ta musique, tes vidéos et dépose tes titres à la SACEM</div>

          {/* TABS */}
          <div style={{display:"flex",gap:4,padding:4,background:C.surface,borderRadius:14,width:"fit-content",marginBottom:32}}>
            {[
              {id:"upload-audio", label:"🎵 Upload Audio"},
              {id:"upload-video", label:"🎬 Upload Vidéo"},
              {id:"sacem",        label:"📋 Dépôt SACEM"},
            ].map(t=>(
              <button key={t.id} className="tab-btn" onClick={()=>setTab(t.id as any)} style={{
                padding:"9px 18px",borderRadius:11,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
                background:tab===t.id?`linear-gradient(135deg,rgba(110,207,170,.2),rgba(180,79,212,.15))`:"transparent",
                color:tab===t.id?C.mint:C.muted,transition:"all .2s",
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{padding:"0 28px"}}>

          {/* ══ UPLOAD AUDIO ══ */}
          {tab==="upload-audio"&&(
            <div style={{animation:"fadeUp .3s ease both"}}>

              {audioOk&&<SuccessBanner text="Titre publié avec succès sur Vision 2.0 !"/>}

              <div style={{background:C.card,borderRadius:20,border:`1px solid ${C.border}`,padding:"28px",marginBottom:24}}>

                {/* Drop zone audio */}
                <div className="drop" onClick={()=>audioRef.current?.click()} style={{border:`2px dashed ${audioFile?C.mint:C.border}`,borderRadius:16,padding:"32px",textAlign:"center",cursor:"pointer",marginBottom:24,transition:"all .2s",background:audioFile?`${C.mint}05`:"transparent"}}>
                  <div style={{fontSize:32,marginBottom:10}}>🎵</div>
                  {audioFile?(
                    <><div style={{fontWeight:700,color:C.mint,marginBottom:4}}>{audioFile.name}</div><div style={{fontSize:12,color:C.muted}}>{fmtSize(audioFile.size)}</div></>
                  ):(
                    <><div style={{fontWeight:600,marginBottom:4}}>Clique pour choisir ton fichier audio</div><div style={{fontSize:12,color:C.muted}}>MP3 · WAV · FLAC · Max 50MB</div></>
                  )}
                  <input ref={audioRef} type="file" accept="audio/*" onChange={e=>{const f=e.target.files?.[0];if(f){setAudioFile(f);if(!audioTitle)setAudioTitle(f.name.replace(/\.[^.]+$/,""));}}} style={{display:"none"}}/>
                </div>

                {/* Cover + info */}
                <div style={{display:"grid",gridTemplateColumns:"110px 1fr",gap:20,marginBottom:20}}>
                  <div onClick={()=>coverRef.current?.click()} style={{cursor:"pointer"}}>
                    <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:6,textTransform:"uppercase" as const,letterSpacing:.5}}>Pochette</div>
                    <div style={{width:110,height:110,borderRadius:14,overflow:"hidden",background:C.card2,border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {coverPreview?<img src={coverPreview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{textAlign:"center",color:C.muted}}><div style={{fontSize:24}}>🖼️</div><div style={{fontSize:10,marginTop:4}}>Ajouter</div></div>}
                    </div>
                    <input ref={coverRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f)setCoverPreview(URL.createObjectURL(f));}} style={{display:"none"}}/>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <FInput label="Titre du morceau *" value={audioTitle} onChange={setAudioTitle} placeholder="Ex: Lumière Froide"/>
                    <div>
                      <FLabel>Genre musical</FLabel>
                      <select value={audioGenre} onChange={e=>setAudioGenre(e.target.value)} style={{width:"100%",padding:"11px 13px",borderRadius:11,background:C.card2,border:`1px solid ${C.border}`,color:audioGenre?C.text:C.muted,fontSize:13,cursor:"pointer"}}>
                        <option value="">Sélectionne un genre…</option>
                        {GENRES_SACEM.map(g=><option key={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Accès exclusif */}
                <div style={{marginBottom:24}}>
                  <FLabel>Accès au titre</FLabel>
                  <div style={{display:"flex",gap:10}}>
                    {[
                      {val:"public", label:"🌍 Public",     desc:"Accessible à tous"},
                      {val:"super",  label:"⭐ Super Fan",  desc:"Abonnés Super Fan et VIP"},
                      {val:"vip",    label:"👑 VIP only",   desc:"Abonnés VIP uniquement"},
                    ].map(opt=>(
                      <div key={opt.val} onClick={()=>setAudioExclusive(opt.val as any)} style={{flex:1,padding:"12px",borderRadius:12,border:`2px solid ${audioExclusive===opt.val?C.mint:C.border}`,background:audioExclusive===opt.val?`${C.mint}10`:C.card2,cursor:"pointer",transition:"all .2s",textAlign:"center"}}>
                        <div style={{fontSize:14,fontWeight:700,color:audioExclusive===opt.val?C.mint:C.text,marginBottom:3}}>{opt.label}</div>
                        <div style={{fontSize:10,color:C.muted}}>{opt.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                {audioLoading&&<ProgressBar progress={audioProgress} label="Upload audio en cours…"/>}

                <BigBtn onClick={uploadAudio} disabled={!audioFile||!audioTitle||audioLoading} loading={audioLoading} color={C.mint}>
                  ⬆️ Publier le titre
                </BigBtn>
              </div>

              {/* Titres uploadés */}
              {audioTracks.length>0&&(
                <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,padding:"20px"}}>
                  <SLabel label="Titres publiés" color={C.mint}/>
                  {audioTracks.map((t:any)=>(
                    <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px",borderRadius:12,background:C.card2,marginBottom:8}}>
                      <div style={{width:40,height:40,borderRadius:10,overflow:"hidden",background:C.border,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {t.cover?<img src={t.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span>🎵</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600}}>{t.title}</div>
                        <div style={{fontSize:11,color:C.muted}}>{t.genre||"Sans genre"}</div>
                      </div>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700,background:t.exclusive==="public"?`${C.mint}22`:t.exclusive==="vip"?`${C.gold}22`:`${C.purple}22`,color:t.exclusive==="public"?C.mint:t.exclusive==="vip"?C.gold:C.purple}}>
                        {t.exclusive==="public"?"Public":t.exclusive==="vip"?"VIP 👑":"Super Fan ⭐"}
                      </span>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:`${C.success}22`,color:C.success,fontWeight:700}}>✓ En ligne</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ UPLOAD VIDEO ══ */}
          {tab==="upload-video"&&(
            <div style={{animation:"fadeUp .3s ease both"}}>

              {videoOk&&<SuccessBanner text="Vidéo publiée avec succès sur Vision 2.0 !"/>}

              <div style={{padding:"12px 16px",borderRadius:12,background:`${C.purple}08`,border:`1px solid ${C.purple}22`,marginBottom:20,fontSize:12,color:C.muted}}>
                🎬 <span style={{fontWeight:600,color:C.purple}}>Super Fan</span> → Clips officiels · <span style={{fontWeight:600,color:C.gold}}>VIP</span> → Clips + Live studio + Making of
              </div>

              <div style={{background:C.card,borderRadius:20,border:`1px solid ${C.border}`,padding:"28px",marginBottom:24}}>

                {/* Drop zone video */}
                <div className="drop" onClick={()=>videoRef.current?.click()} style={{border:`2px dashed ${videoFile?C.purple:C.border}`,borderRadius:16,padding:"32px",textAlign:"center",cursor:"pointer",marginBottom:24,transition:"all .2s",background:videoFile?`${C.purple}05`:"transparent"}}>
                  <div style={{fontSize:32,marginBottom:10}}>🎬</div>
                  {videoFile?(
                    <><div style={{fontWeight:700,color:C.purple,marginBottom:4}}>{videoFile.name}</div><div style={{fontSize:12,color:C.muted}}>{fmtSize(videoFile.size)}</div></>
                  ):(
                    <><div style={{fontWeight:600,marginBottom:4}}>Clique pour choisir ta vidéo</div><div style={{fontSize:12,color:C.muted}}>MP4 · MOV · AVI · Max 500MB</div></>
                  )}
                  <input ref={videoRef} type="file" accept="video/*" onChange={e=>{const f=e.target.files?.[0];if(f){setVideoFile(f);if(!videoTitle)setVideoTitle(f.name.replace(/\.[^.]+$/,""));}}} style={{display:"none"}}/>
                </div>

                {/* Miniature + infos */}
                <div style={{display:"grid",gridTemplateColumns:"110px 1fr",gap:20,marginBottom:20}}>
                  <div onClick={()=>videoCoverRef.current?.click()} style={{cursor:"pointer"}}>
                    <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:6,textTransform:"uppercase" as const,letterSpacing:.5}}>Miniature</div>
                    <div style={{width:110,height:70,borderRadius:12,overflow:"hidden",background:C.card2,border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {videoCoverPreview?<img src={videoCoverPreview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{textAlign:"center",color:C.muted}}><div style={{fontSize:20}}>🖼️</div><div style={{fontSize:10}}>Ajouter</div></div>}
                    </div>
                    <input ref={videoCoverRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f)setVideoCoverPreview(URL.createObjectURL(f));}} style={{display:"none"}}/>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <FInput label="Titre de la vidéo *" value={videoTitle} onChange={setVideoTitle} placeholder="Ex: Lumière Froide — Clip officiel"/>
                    <div>
                      <FLabel>Type de contenu</FLabel>
                      <select value={videoType} onChange={e=>setVideoType(e.target.value)} style={{width:"100%",padding:"11px 13px",borderRadius:11,background:C.card2,border:`1px solid ${C.border}`,color:videoType?C.text:C.muted,fontSize:13,cursor:"pointer"}}>
                        <option value="">Sélectionne un type…</option>
                        {VIDEO_TYPES.map(v=><option key={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Accès */}
                <div style={{marginBottom:24}}>
                  <FLabel>Accès à la vidéo</FLabel>
                  <div style={{display:"flex",gap:10}}>
                    {[
                      {val:"public", label:"🌍 Public",    desc:"Accessible à tous"},
                      {val:"super",  label:"⭐ Super Fan", desc:"Super Fan et VIP"},
                      {val:"vip",    label:"👑 VIP only",  desc:"VIP uniquement"},
                    ].map(opt=>(
                      <div key={opt.val} onClick={()=>setVideoExclusive(opt.val as any)} style={{flex:1,padding:"12px",borderRadius:12,border:`2px solid ${videoExclusive===opt.val?C.purple:C.border}`,background:videoExclusive===opt.val?`${C.purple}10`:C.card2,cursor:"pointer",transition:"all .2s",textAlign:"center"}}>
                        <div style={{fontSize:13,fontWeight:700,color:videoExclusive===opt.val?C.purple:C.text,marginBottom:3}}>{opt.label}</div>
                        <div style={{fontSize:10,color:C.muted}}>{opt.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {videoLoading&&<ProgressBar progress={videoProgress} label="Upload vidéo en cours…" color={C.purple}/>}

                <BigBtn onClick={uploadVideo} disabled={!videoFile||!videoTitle||videoLoading} loading={videoLoading} color={C.purple}>
                  🎬 Publier la vidéo
                </BigBtn>
              </div>

              {videoList.length>0&&(
                <div style={{background:C.card,borderRadius:18,border:`1px solid ${C.border}`,padding:"20px"}}>
                  <SLabel label="Vidéos publiées" color={C.purple}/>
                  {videoList.map((v:any)=>(
                    <div key={v.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px",borderRadius:12,background:C.card2,marginBottom:8}}>
                      <div style={{width:60,height:40,borderRadius:8,overflow:"hidden",background:C.border,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {v.cover?<img src={v.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span>🎬</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600}}>{v.title}</div>
                        <div style={{fontSize:11,color:C.muted}}>{v.type||"Vidéo"}</div>
                      </div>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700,background:v.exclusive==="public"?`${C.mint}22`:v.exclusive==="vip"?`${C.gold}22`:`${C.purple}22`,color:v.exclusive==="public"?C.mint:v.exclusive==="vip"?C.gold:C.purple}}>
                        {v.exclusive==="public"?"Public":v.exclusive==="vip"?"VIP 👑":"Super Fan ⭐"}
                      </span>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:`${C.success}22`,color:C.success,fontWeight:700}}>✓ En ligne</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ SACEM ══ */}
          {tab==="sacem"&&(
            <div style={{animation:"fadeUp .3s ease both"}}>

              {sacemOk?(
                <div style={{textAlign:"center",padding:"60px 0"}}>
                  <div style={{fontSize:64,marginBottom:20}}>🎉</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,marginBottom:10}}>Titre déposé !</div>
                  <div style={{color:C.muted,fontSize:14,lineHeight:1.7,marginBottom:24}}>
                    Vision 2.0 va procéder au dépôt SACEM sous 5 jours ouvrés.<br/>
                    Un contrat de mandat d&apos;édition vous sera envoyé par email.
                  </div>
                  <div style={{padding:"16px",borderRadius:14,background:`${C.gold}10`,border:`1px solid ${C.gold}33`,fontSize:13,color:C.gold,fontWeight:600,marginBottom:28,display:"inline-block"}}>
                    📧 Référence : VIS-{Date.now().toString().slice(-6)}
                  </div>
                  <br/>
                  <button onClick={()=>{setSacemOk(false);setSacem(s=>({...s,title:"",isrc:"",iswc:"",genre:"",releaseDate:""}));}} style={{padding:"12px 28px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.gold},${C.purple})`,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>
                    Déposer un autre titre
                  </button>
                </div>
              ):(
                <>
                  <div style={{padding:"16px",borderRadius:14,background:`${C.gold}08`,border:`1px solid ${C.gold}33`,marginBottom:28}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.gold,marginBottom:8}}>📋 Comment fonctionne le dépôt SACEM via Vision 2.0 ?</div>
                    <div style={{fontSize:12,color:C.muted,lineHeight:1.8}}>
                      <span style={{color:C.mint}}>1.</span> Tu remplis les informations de ton titre<br/>
                      <span style={{color:C.mint}}>2.</span> Vision 2.0 devient ton éditeur et dépose à la SACEM<br/>
                      <span style={{color:C.mint}}>3.</span> Tu gardes <strong style={{color:C.mint}}>100% de ta part auteur/compositeur</strong><br/>
                      <span style={{color:C.mint}}>4.</span> Vision 2.0 perçoit la <strong style={{color:C.gold}}>part éditeur SACEM</strong> (50% des droits d&apos;auteur)
                    </div>
                  </div>

                  <div style={{display:"flex",flexDirection:"column",gap:20}}>

                    {/* Infos titre */}
                    <Block title="📀 Informations du titre" color={C.gold}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                        <FInput label="Titre du morceau *" value={sacem.title} onChange={v=>setSacem(s=>({...s,title:v}))} placeholder="Ex: Lumière Froide"/>
                        <div>
                          <FLabel>Genre SACEM *</FLabel>
                          <select value={sacem.genre} onChange={e=>setSacem(s=>({...s,genre:e.target.value}))} style={{width:"100%",padding:"11px 13px",borderRadius:11,background:C.card2,border:`1px solid ${C.border}`,color:sacem.genre?C.text:C.muted,fontSize:13,cursor:"pointer"}}>
                            <option value="">Sélectionne…</option>
                            {GENRES_SACEM.map(g=><option key={g}>{g}</option>)}
                          </select>
                        </div>
                        <FInput label="Code ISRC" value={sacem.isrc} onChange={v=>setSacem(s=>({...s,isrc:v}))} placeholder="Ex: FRXXX2500001"/>
                        <FInput label="Code ISWC" value={sacem.iswc} onChange={v=>setSacem(s=>({...s,iswc:v}))} placeholder="Ex: T-123.456.789-0"/>
                        <FInput label="Date de sortie" value={sacem.releaseDate} onChange={v=>setSacem(s=>({...s,releaseDate:v}))} placeholder="JJ/MM/AAAA"/>
                        <FInput label="Label / Producteur" value={sacem.label} onChange={v=>setSacem(s=>({...s,label:v}))} placeholder="Vision 2.0 Edition"/>
                      </div>
                    </Block>

                    {/* Auteurs */}
                    <Block title="✍️ Auteurs (paroles)" color={C.mint}>
                      {sacem.authors.map((a:any,i:number)=>(
                        <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px auto",gap:10,marginBottom:10,alignItems:"end"}}>
                          <FInput label={i===0?"Nom complet *":""} value={a.name} onChange={v=>updatePerson("authors",i,"name",v)} placeholder="Prénom Nom"/>
                          <FInput label={i===0?"N° SACEM":""} value={a.sacemNum} onChange={v=>updatePerson("authors",i,"sacemNum",v)} placeholder="123456789"/>
                          <FInput label={i===0?"Part %":""} value={a.share} onChange={v=>updatePerson("authors",i,"share",v)} placeholder="50"/>
                          {i>0&&<button onClick={()=>removePerson("authors",i)} style={{padding:"11px",borderRadius:9,border:`1px solid ${C.danger}44`,background:`${C.danger}10`,color:C.danger,cursor:"pointer",fontSize:13}}>✕</button>}
                        </div>
                      ))}
                      <AddBtn onClick={()=>addPerson("authors")} label="+ Auteur" color={C.mint}/>
                    </Block>

                    {/* Compositeurs */}
                    <Block title="🎹 Compositeurs (musique)" color={C.purple}>
                      {sacem.composers.map((c:any,i:number)=>(
                        <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px auto",gap:10,marginBottom:10,alignItems:"end"}}>
                          <FInput label={i===0?"Nom complet *":""} value={c.name} onChange={v=>updatePerson("composers",i,"name",v)} placeholder="Prénom Nom"/>
                          <FInput label={i===0?"N° SACEM":""} value={c.sacemNum} onChange={v=>updatePerson("composers",i,"sacemNum",v)} placeholder="123456789"/>
                          <FInput label={i===0?"Part %":""} value={c.share} onChange={v=>updatePerson("composers",i,"share",v)} placeholder="50"/>
                          {i>0&&<button onClick={()=>removePerson("composers",i)} style={{padding:"11px",borderRadius:9,border:`1px solid ${C.danger}44`,background:`${C.danger}10`,color:C.danger,cursor:"pointer",fontSize:13}}>✕</button>}
                        </div>
                      ))}
                      <AddBtn onClick={()=>addPerson("composers")} label="+ Compositeur" color={C.purple}/>
                    </Block>

                    {/* Beatmakers */}
                    <Block title="🥁 Beatmakers / Arrangeurs" color={C.gold}>
                      {sacem.beatmakers.map((b:any,i:number)=>(
                        <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 120px 80px auto",gap:10,marginBottom:10,alignItems:"end"}}>
                          <FInput label={i===0?"Nom complet":""} value={b.name} onChange={v=>updatePerson("beatmakers",i,"name",v)} placeholder="Prénom Nom"/>
                          <FInput label={i===0?"N° SACEM":""} value={b.sacemNum} onChange={v=>updatePerson("beatmakers",i,"sacemNum",v)} placeholder="123456789"/>
                          <div>
                            {i===0&&<FLabel>Rôle</FLabel>}
                            <select value={b.role} onChange={e=>updatePerson("beatmakers",i,"role",e.target.value)} style={{width:"100%",padding:"11px 10px",borderRadius:11,background:C.card2,border:`1px solid ${C.border}`,color:C.text,fontSize:12,cursor:"pointer"}}>
                              {["Beatmaker","Arrangeur","Co-compositeur","Co-auteur"].map(r=><option key={r}>{r}</option>)}
                            </select>
                          </div>
                          <FInput label={i===0?"Part %":""} value={b.share} onChange={v=>updatePerson("beatmakers",i,"share",v)} placeholder="0"/>
                          {i>0&&<button onClick={()=>removePerson("beatmakers",i)} style={{padding:"11px",borderRadius:9,border:`1px solid ${C.danger}44`,background:`${C.danger}10`,color:C.danger,cursor:"pointer",fontSize:13}}>✕</button>}
                        </div>
                      ))}
                      <AddBtn onClick={()=>addPerson("beatmakers")} label="+ Beatmaker" color={C.gold}/>
                    </Block>

                    {/* Contrat */}
                    <div style={{padding:"18px",borderRadius:14,background:C.card2,border:`1px solid ${C.border}`}}>
                      <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>📄 Contrat de mandat d&apos;édition</div>
                      <p style={{fontSize:12,color:C.muted,lineHeight:1.7,marginBottom:14}}>
                        En soumettant ce formulaire, vous acceptez de confier le mandat d&apos;édition de ce titre à <strong style={{color:C.mint}}>Vision 2.0 Music Publishing</strong>. Nous nous engageons à déposer le titre auprès de la SACEM sous 5 jours ouvrés. Un contrat de mandat d&apos;édition complet vous sera transmis par email pour signature électronique.
                      </p>
                      <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer"}}>
                        <input type="checkbox" id="accept-sacem" style={{width:16,height:16,marginTop:1,cursor:"pointer",accentColor:C.gold}}/>
                        <span style={{fontSize:12,color:C.muted,lineHeight:1.6}}>
                          J&apos;accepte les conditions du mandat d&apos;édition et certifie être titulaire des droits sur ce titre.
                        </span>
                      </label>
                    </div>

                    <BigBtn onClick={submitSacem} disabled={!sacem.title||!sacem.genre||sacemLoading} loading={sacemLoading} color={C.gold}>
                      📋 Soumettre le dépôt SACEM
                    </BigBtn>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────
function SLabel({label,color}:{label:string,color:string}) {
  return <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><div style={{width:3,height:14,borderRadius:2,background:color}}/><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15}}>{label}</span></div>;
}
function Block({title,color,children}:{title:string,color:string,children:React.ReactNode}) {
  return (
    <div style={{padding:"20px",borderRadius:16,background:"#1A1A22",border:"1px solid #2A2A36"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <div style={{width:3,height:14,borderRadius:2,background:color}}/>
        <span style={{fontWeight:700,fontSize:14,color}}>{title}</span>
      </div>
      {children}
    </div>
  );
}
function FLabel({children}:{children:React.ReactNode}) {
  return <div style={{fontSize:11,color:"#7A7890",fontWeight:600,textTransform:"uppercase" as const,letterSpacing:.5,marginBottom:5}}>{children}</div>;
}
function FInput({label,value,onChange,placeholder}:{label:string,value:string,onChange:(v:string)=>void,placeholder:string}) {
  return (
    <div>
      {label&&<FLabel>{label}</FLabel>}
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"11px 13px",borderRadius:11,background:"#20202C",border:"1px solid #2A2A36",color:"#F0EEF8",fontSize:13}}/>
    </div>
  );
}
function BigBtn({onClick,disabled,loading,children,color}:{onClick:()=>void,disabled:boolean,loading:boolean,children:React.ReactNode,color:string}) {
  return (
    <button onClick={onClick} disabled={disabled||loading} className="btn" style={{width:"100%",padding:"15px",borderRadius:13,border:"none",background:disabled||loading?"#2A2A36":`linear-gradient(135deg,${color},#B44FD4)`,color:disabled?"#7A7890":"#fff",fontWeight:700,fontSize:15,cursor:disabled||loading?"not-allowed":"pointer",transition:"all .25s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
      {loading?<><span style={{width:16,height:16,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>En cours…</>:children}
    </button>
  );
}
function AddBtn({onClick,label,color}:{onClick:()=>void,label:string,color:string}) {
  return <button onClick={onClick} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${color}44`,background:`${color}10`,color,fontSize:12,fontWeight:600,cursor:"pointer",marginTop:4}}>{label}</button>;
}
function ProgressBar({progress,label,color=C.mint}:{progress:number,label:string,color?:string}) {
  return (
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#7A7890",marginBottom:6}}><span>{label}</span><span>{progress}%</span></div>
      <div style={{height:4,borderRadius:2,background:"#2A2A36",overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(to right,${color},#B44FD4)`,transition:"width .3s",borderRadius:2}}/></div>
    </div>
  );
}
function SuccessBanner({text}:{text:string}) {
  return <div style={{padding:"14px 16px",borderRadius:14,background:"rgba(74,222,128,.12)",border:"1px solid rgba(74,222,128,.3)",fontSize:13,color:"#4ADE80",fontWeight:600,marginBottom:20,display:"flex",alignItems:"center",gap:8,animation:"fadeUp .3s ease both"}}>✅ {text}</div>;
}
