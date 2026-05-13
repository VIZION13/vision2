"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const C = {
  mint:"#6ECFAA", purple:"#B44FD4",
  bg:"#0D0D0F", surface:"#141418", card:"#1A1A22",
  border:"#2A2A36", text:"#F0EEF8", muted:"#7A7890",
  success:"#4ADE80", danger:"#F87171",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
input:focus{outline:none;border-color:#6ECFAA !important;}
.btn:hover{opacity:.85;transform:translateY(-1px);}
.tab:hover{color:#F0EEF8 !important;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
`;

export default function AuthPage() {
  const [mode,     setMode]    = useState<"login"|"signup">("login");
  const [isArtist, setArtist]  = useState(false);
  const [email,    setEmail]   = useState("");
  const [password, setPass]    = useState("");
  const [name,     setName]    = useState("");
  const [genre,    setGenre]   = useState("");
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState("");
  const [success,  setSuccess] = useState("");

  const handleAuth = async () => {
    if (!email || !password) { setError("Email et mot de passe requis"); return; }
    if (mode === "signup" && !name) { setError("Ton nom d'artiste est requis"); return; }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name }
          }
        });
        if (signUpError) throw signUpError;

        // Mettre à jour le profil avec is_artist et genre
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            display_name: name,
            is_artist: isArtist,
            genre: genre || null,
          });
        }
        setSuccess("Compte créé ! Vérifie ton email pour confirmer ton inscription. 🎉");

      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        window.location.href = "/streaming";
      }
    } catch (err: any) {
      const msg = err.message || "Une erreur est survenue";
      if (msg.includes("Invalid login")) setError("Email ou mot de passe incorrect");
      else if (msg.includes("already registered")) setError("Cet email est déjà utilisé");
      else if (msg.includes("Password should")) setError("Mot de passe trop court (min 6 caractères)");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/streaming` }
    });
  };

  return (
    <div style={{
      fontFamily:"'DM Sans',sans-serif",
      background:C.bg, color:C.text,
      minHeight:"100vh",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"24px",
      position:"relative", overflow:"hidden",
    }}>
      <style>{CSS}</style>

      {/* Ambient */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"-20%",left:"-10%",width:"60vw",height:"60vh",background:`radial-gradient(circle,rgba(110,207,170,.07),transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:"-10%",right:"-10%",width:"55vw",height:"55vh",background:`radial-gradient(circle,rgba(180,79,212,.08),transparent 70%)`}}/>
      </div>

      <div style={{
        width:"100%", maxWidth:420,
        background:C.card, borderRadius:24,
        border:`1px solid ${C.border}`,
        padding:"36px 32px",
        position:"relative", zIndex:1,
        animation:"fadeUp .4s ease both",
        boxShadow:"0 24px 64px rgba(0,0,0,.5)",
      }}>

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{
            width:48,height:48,borderRadius:14,
            background:`linear-gradient(135deg,${C.mint},${C.purple})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:"#fff",
            margin:"0 auto 12px",
            boxShadow:`0 8px 24px ${C.mint}44`,
          }}>V</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,letterSpacing:.5}}>
            VISION <span style={{color:C.mint}}>2.0</span>
          </div>
          <div style={{color:C.muted,fontSize:13,marginTop:4}}>
            {mode==="login" ? "Content de te revoir 👋" : "Rejoins la communauté 🎵"}
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,padding:4,background:C.surface,borderRadius:12,marginBottom:28}}>
          {(["login","signup"] as const).map(m=>(
            <button key={m} className="tab" onClick={()=>{setMode(m);setError("");setSuccess("");}} style={{
              flex:1,padding:"9px",borderRadius:9,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,
              background:mode===m?`linear-gradient(135deg,rgba(110,207,170,.2),rgba(180,79,212,.15))`:"transparent",
              color:mode===m?C.mint:C.muted,transition:"all .2s",
            }}>
              {m==="login"?"Se connecter":"S'inscrire"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>

          {/* Signup extra fields */}
          {mode==="signup" && (
            <>
              <div>
                <Label>Nom d&apos;artiste *</Label>
                <Input value={name} onChange={setName} placeholder="Nova Kael" />
              </div>

              {/* Type de compte */}
              <div style={{
                padding:"14px 16px",borderRadius:12,
                border:`1.5px solid ${isArtist?C.mint:C.border}`,
                background:isArtist?`${C.mint}10`:C.surface,
                cursor:"pointer",transition:"all .2s",
              }} onClick={()=>setArtist(a=>!a)}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{
                    width:20,height:20,borderRadius:6,
                    background:isArtist?C.mint:C.border,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:11,color:"#fff",flexShrink:0,transition:"all .2s",
                  }}>{isArtist?"✓":""}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:14}}>Je suis un artiste 🎤</div>
                    <div style={{fontSize:12,color:C.muted}}>Accès au dashboard, upload de musique, monétisation</div>
                  </div>
                </div>
              </div>

              {isArtist && (
                <div>
                  <Label>Genre musical</Label>
                  <select value={genre} onChange={e=>setGenre(e.target.value)} style={{
                    width:"100%",padding:"12px 14px",borderRadius:12,
                    background:C.surface,border:`1px solid ${C.border}`,
                    color:genre?C.text:C.muted,fontSize:14,cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif",
                  }}>
                    <option value="">Sélectionne ton genre…</option>
                    {["Afro-Électro","Neo-Soul","Lo-fi Hip-Hop","Indie Pop","Dark Ambient","R&B Alternatif","Rap","Jazz Fusion","Electronic","Pop","Rock"].map(g=>(
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div>
            <Label>Email *</Label>
            <Input value={email} onChange={setEmail} placeholder="ton@email.com" type="email"/>
          </div>

          <div>
            <Label>Mot de passe *</Label>
            <Input value={password} onChange={setPass} placeholder="••••••••" type="password"/>
            {mode==="signup"&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>Minimum 6 caractères</div>}
          </div>

          {/* Error / Success */}
          {error && (
            <div style={{padding:"12px 14px",borderRadius:10,background:`${C.danger}15`,border:`1px solid ${C.danger}44`,fontSize:13,color:C.danger}}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{padding:"12px 14px",borderRadius:10,background:`${C.success}15`,border:`1px solid ${C.success}44`,fontSize:13,color:C.success}}>
              ✅ {success}
            </div>
          )}

          {/* Submit */}
          <button className="btn" onClick={handleAuth} disabled={loading} style={{
            width:"100%",padding:"14px",borderRadius:13,border:"none",
            background:loading?C.border:`linear-gradient(135deg,${C.mint},${C.purple})`,
            color:"#fff",fontWeight:700,fontSize:15,cursor:loading?"not-allowed":"pointer",
            transition:"all .25s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            marginTop:4,
          }}>
            {loading
              ? <span style={{width:16,height:16,border:"2px solid #fff4",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>
              : mode==="login" ? "Se connecter →" : "Créer mon compte →"
            }
          </button>

          {/* Divider */}
          <div style={{display:"flex",alignItems:"center",gap:12,margin:"4px 0"}}>
            <div style={{flex:1,height:1,background:C.border}}/>
            <span style={{fontSize:12,color:C.muted}}>ou</span>
            <div style={{flex:1,height:1,background:C.border}}/>
          </div>

          {/* Google */}
          <button className="btn" onClick={handleGoogle} style={{
            width:"100%",padding:"13px",borderRadius:13,
            border:`1.5px solid ${C.border}`,background:"transparent",
            color:C.text,fontWeight:600,fontSize:14,cursor:"pointer",
            transition:"all .25s",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

        </div>

        {/* Footer */}
        <div style={{marginTop:24,textAlign:"center",fontSize:12,color:C.muted}}>
          {mode==="login" ? (
            <>Pas encore de compte ? <span onClick={()=>{setMode("signup");setError("");}} style={{color:C.mint,cursor:"pointer",fontWeight:600}}>S&apos;inscrire</span></>
          ) : (
            <>Déjà un compte ? <span onClick={()=>{setMode("login");setError("");}} style={{color:C.mint,cursor:"pointer",fontWeight:600}}>Se connecter</span></>
          )}
        </div>

        {/* Back to app */}
        <div style={{marginTop:16,textAlign:"center"}}>
          <a href="/streaming" style={{fontSize:12,color:C.muted,textDecoration:"none"}}>
            ← Retour à l&apos;application
          </a>
        </div>

      </div>
    </div>
  );
}

// ── Shared components ─────────────────────────────────────────────────────────
function Label({children}: {children: React.ReactNode}) {
  return <div style={{fontSize:11,color:"#7A7890",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{children}</div>;
}

function Input({value,onChange,placeholder,type="text"}: {value:string,onChange:(v:string)=>void,placeholder:string,type?:string}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e=>onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width:"100%",padding:"12px 14px",borderRadius:12,
        background:"#141418",border:"1px solid #2A2A36",
        color:"#F0EEF8",fontSize:14,
        fontFamily:"'DM Sans',sans-serif",transition:"border .2s",
      }}
    />
  );
}
