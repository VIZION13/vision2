"use client";
import { useState, useRef } from "react";
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
input,textarea,select{outline:none;font-family:'DM Sans',sans-serif;}
input:focus,textarea:focus{border-color:#6ECFAA !important;}
.btn:hover{opacity:.85;transform:translateY(-1px);}
.drop-zone:hover{border-color:#6ECFAA !important;background:rgba(110,207,170,.04) !important;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes progress{from{width:0%}to{width:100%}}
`;

const GENRES = ["Afro-Électro","Neo-Soul","Lo-fi Hip-Hop","Indie Pop","Dark Ambient","R&B Alternatif","Rap","Jazz Fusion","Electronic","Pop","Rock Alternatif"];

export default function UploadPage() {
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [audioFile,   setAudioFile]  = useState<File|null>(null);
  const [coverFile,   setCoverFile]  = useState<File|null>(null);
  const [coverPreview,setCoverPreview] = useState<string>("");
  const [title,       setTitle]      = useState("");
  const [genre,       setGenre]      = useState("");
  const [isExclusive, setExclusive]  = useState(false);
  const [uploading,   setUploading]  = useState(false);
  const [progress,    setProgress]   = useState(0);
  const [error,       setError]      = useState("");
  const [success,     setSuccess]    = useState(false);
  const [uploadedTracks, setTracks]  = useState<any[]>([]);

  const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAudioFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  };

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  };

  const getAudioDuration = (file: File): Promise<number> =>
    new Promise(resolve => {
      const audio = new Audio();
      audio.onloadedmetadata = () => resolve(Math.round(audio.duration));
      audio.src = URL.createObjectURL(file);
    });

  const handleUpload = async () => {
    if (!audioFile || !title) { setError("Fichier audio et titre requis"); return; }
    setError("");
    setUploading(true);
    setProgress(10);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Tu dois être connecté"); setUploading(false); return; }

      // 1. Upload audio
      const audioExt  = audioFile.name.split(".").pop();
      const audioPath = `${user.id}/${Date.now()}.${audioExt}`;
      const { error: audioErr } = await supabase.storage
        .from("audio")
        .upload(audioPath, audioFile, { cacheControl:"3600", upsert:false });
      if (audioErr) throw audioErr;
      setProgress(50);

      const audioUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/audio/${audioPath}`;

      // 2. Upload cover si fournie
      let coverUrl = null;
      if (coverFile) {
        const coverPath = `${user.id}/${Date.now()}.jpg`;
        const { error: coverErr } = await supabase.storage
          .from("covers")
          .upload(coverPath, coverFile, { cacheControl:"3600", upsert:false });
        if (!coverErr) coverUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/covers/${coverPath}`;
      }
      setProgress(75);

      // 3. Durée audio
      const duration = await getAudioDuration(audioFile);

      // 4. Insert en BDD
      const { data: track, error: dbErr } = await supabase
        .from("tracks")
        .insert({
          artist_id:    user.id,
          title,
          audio_url:    audioUrl,
          cover_url:    coverUrl,
          duration,
          is_exclusive: isExclusive,
        })
        .select()
        .single();
      if (dbErr) throw dbErr;
      setProgress(100);

      setTracks(prev => [track, ...prev]);
      setSuccess(true);
      setTitle(""); setAudioFile(null); setCoverFile(null); setCoverPreview(""); setGenre(""); setExclusive(false);
      setTimeout(() => { setSuccess(false); setProgress(0); }, 3000);

    } catch (err: any) {
      setError(err.message || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const fmt = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",padding:"32px 24px"}}>
      <style>{CSS}</style>

      {/* Ambient */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-15%",left:"-8%",width:"55vw",height:"55vh",background:`radial-gradient(circle,rgba(110,207,170,.06),transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:"0",right:"-8%",width:"50vw",height:"50vh",background:`radial-gradient(circle,rgba(180,79,212,.07),transparent 70%)`}}/>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",position:"relative",zIndex:1,animation:"fadeUp .4s ease both"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:36}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:13,color:"#fff"}}>V</div>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15}}>VISION <span style={{color:C.mint}}>2.0</span></span>
            </div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26}}>Upload ta musique</div>
            <div style={{color:C.muted,fontSize:13}}>MP3, WAV, FLAC acceptés · Max 50MB</div>
          </div>
          <a href="/streaming" style={{fontSize:13,color:C.muted,textDecoration:"none",padding:"8px 14px",borderRadius:10,border:`1px solid ${C.border}`}}>← Retour</a>
        </div>

        {/* Success banner */}
        {success && (
          <div style={{padding:"16px",borderRadius:14,background:`${C.success}15`,border:`1px solid ${C.success}44`,marginBottom:24,display:"flex",alignItems:"center",gap:10,fontSize:14,color:C.success,fontWeight:600,animation:"fadeUp .3s ease both"}}>
            ✅ Titre uploadé avec succès ! Il est maintenant disponible sur Vision 2.0.
          </div>
        )}

        {/* Form */}
        <div style={{background:C.card,borderRadius:20,border:`1px solid ${C.border}`,padding:"28px",marginBottom:28}}>

          {/* Audio drop zone */}
          <div
            className="drop-zone"
            onClick={()=>audioRef.current?.click()}
            style={{
              border:`2px dashed ${audioFile?C.mint:C.border}`,
              borderRadius:16,padding:"32px",textAlign:"center",
              cursor:"pointer",marginBottom:24,transition:"all .2s",
              background:audioFile?`${C.mint}05`:"transparent",
            }}
          >
            <div style={{fontSize:36,marginBottom:10}}>🎵</div>
            {audioFile ? (
              <>
                <div style={{fontWeight:700,color:C.mint,marginBottom:4}}>{audioFile.name}</div>
                <div style={{fontSize:12,color:C.muted}}>{(audioFile.size/1024/1024).toFixed(1)} MB</div>
              </>
            ) : (
              <>
                <div style={{fontWeight:600,marginBottom:4}}>Clique pour choisir ton fichier audio</div>
                <div style={{fontSize:12,color:C.muted}}>MP3 · WAV · FLAC · Max 50MB</div>
              </>
            )}
            <input ref={audioRef} type="file" accept="audio/*" onChange={handleAudio} style={{display:"none"}}/>
          </div>

          {/* Cover + Info */}
          <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:20,marginBottom:20}}>
            {/* Cover */}
            <div onClick={()=>coverRef.current?.click()} style={{cursor:"pointer"}}>
              <div style={{width:120,height:120,borderRadius:14,overflow:"hidden",background:C.card2,border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"border .2s"}}>
                {coverPreview ? (
                  <img src={coverPreview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                ) : (
                  <div style={{textAlign:"center",color:C.muted}}>
                    <div style={{fontSize:24,marginBottom:4}}>🖼️</div>
                    <div style={{fontSize:10}}>Pochette</div>
                  </div>
                )}
              </div>
              <input ref={coverRef} type="file" accept="image/*" onChange={handleCover} style={{display:"none"}}/>
            </div>

            {/* Fields */}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <FieldLabel>Titre du morceau *</FieldLabel>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Mon super titre"
                  style={{width:"100%",padding:"11px 13px",borderRadius:11,background:C.card2,border:`1px solid ${C.border}`,color:C.text,fontSize:14,transition:"border .2s"}}/>
              </div>
              <div>
                <FieldLabel>Genre</FieldLabel>
                <select value={genre} onChange={e=>setGenre(e.target.value)} style={{width:"100%",padding:"11px 13px",borderRadius:11,background:C.card2,border:`1px solid ${C.border}`,color:genre?C.text:C.muted,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  <option value="">Sélectionne un genre…</option>
                  {GENRES.map(g=><option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Exclusive toggle */}
          <div onClick={()=>setExclusive(e=>!e)} style={{
            display:"flex",alignItems:"center",gap:12,padding:"14px 16px",
            borderRadius:12,border:`1.5px solid ${isExclusive?C.purple:C.border}`,
            background:isExclusive?`${C.purple}10`:"transparent",
            cursor:"pointer",transition:"all .2s",marginBottom:24,
          }}>
            <div style={{width:20,height:20,borderRadius:6,background:isExclusive?C.purple:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",flexShrink:0,transition:"all .2s"}}>{isExclusive?"✓":""}</div>
            <div>
              <div style={{fontWeight:600,fontSize:14}}>Titre exclusif ⭐</div>
              <div style={{fontSize:12,color:C.muted}}>Réservé aux abonnés Super Fan et VIP uniquement</div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{padding:"12px 14px",borderRadius:10,background:`${C.danger}15`,border:`1px solid ${C.danger}44`,fontSize:13,color:C.danger,marginBottom:16}}>
              ⚠️ {error}
            </div>
          )}

          {/* Progress bar */}
          {uploading && (
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted,marginBottom:6}}>
                <span>Upload en cours…</span><span>{progress}%</span>
              </div>
              <div style={{height:4,borderRadius:2,background:C.border,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(to right,${C.mint},${C.purple})`,transition:"width .3s",borderRadius:2}}/>
              </div>
            </div>
          )}

          {/* Submit */}
          <button className="btn" onClick={handleUpload} disabled={uploading||!audioFile||!title} style={{
            width:"100%",padding:"14px",borderRadius:13,border:"none",
            background:uploading||!audioFile||!title?C.border:`linear-gradient(135deg,${C.mint},${C.purple})`,
            color:uploading||!audioFile||!title?C.muted:"#fff",
            fontWeight:700,fontSize:15,cursor:uploading||!audioFile||!title?"not-allowed":"pointer",
            transition:"all .25s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          }}>
            {uploading
              ? <><span style={{width:16,height:16,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>Upload en cours…</>
              : "⬆️ Publier le titre"
            }
          </button>
        </div>

        {/* Uploaded tracks list */}
        {uploadedTracks.length > 0 && (
          <div style={{background:C.card,borderRadius:20,border:`1px solid ${C.border}`,padding:"24px"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:3,height:16,borderRadius:2,background:C.mint}}/>
              Titres uploadés ce soir
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {uploadedTracks.map((t:any) => (
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:12,background:C.card2}}>
                  <div style={{width:40,height:40,borderRadius:10,overflow:"hidden",background:C.border,flexShrink:0}}>
                    {t.cover_url && <img src={t.cover_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13}}>{t.title}</div>
                    <div style={{fontSize:11,color:C.muted}}>{fmt(t.duration)} · {t.is_exclusive?"Exclusif ⭐":"Public"}</div>
                  </div>
                  <div style={{fontSize:10,padding:"3px 8px",borderRadius:20,background:`${C.success}22`,color:C.success,fontWeight:700}}>En ligne</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function FieldLabel({children}: {children: React.ReactNode}) {
  return <div style={{fontSize:11,color:"#7A7890",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{children}</div>;
}
