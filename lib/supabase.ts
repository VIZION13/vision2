import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnon);

// ── Types ──────────────────────────────────────────────────────────────────
export type Profile = {
  id:           string;
  auth_id:      string;
  name:         string;
  slug:         string;
  type:         "artist" | "team";
  genre:        string | null;
  city:         string | null;
  bio:          string | null;
  avatar_url:   string | null;
  banner_url:   string | null;
  instagram:    string | null;
  tiktok:       string | null;
  snapchat:     string | null;
  twitter:      string | null;
  is_verified:  boolean;
  created_at:   string;
};

export type Track = {
  id:           string;
  artist_id:    string;
  title:        string;
  audio_url:    string | null;
  cover_url:    string | null;
  duration:     number;
  plays:        number;
  access_level: "public" | "super" | "vip";
  genre:        string | null;
  isrc:         string | null;
  released_at:  string | null;
  created_at:   string;
  profiles?:    Profile;
};

export type Video = {
  id:           string;
  artist_id:    string;
  title:        string;
  video_url:    string | null;
  thumb_url:    string | null;
  duration:     number;
  type:         string;
  access_level: "public" | "super" | "vip";
  created_at:   string;
  profiles?:    Profile;
};

export type Subscription = {
  id:               string;
  fan_id:           string;
  artist_id:        string;
  plan:             "team" | "super" | "vip";
  amount:           number;
  stripe_sub_id:    string | null;
  status:           "active" | "cancelled" | "past_due";
  started_at:       string;
  next_billing_at:  string | null;
};

export type Donation = {
  id:           string;
  fan_id:       string | null;
  artist_id:    string;
  amount:       number;
  stripe_pi_id: string | null;
  message:      string | null;
  created_at:   string;
};

// ── Queries artistes ───────────────────────────────────────────────────────
export async function getArtists() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("type", "artist")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Profile[];
}

export async function getArtistBySlug(slug: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data as Profile;
}

// ── Queries tracks ─────────────────────────────────────────────────────────
export async function getTracks(artistId?: string) {
  let query = supabase
    .from("tracks")
    .select("*, profiles(*)")
    .order("plays", { ascending: false });
  if (artistId) query = query.eq("artist_id", artistId);
  const { data, error } = await query;
  if (error) throw error;
  return data as Track[];
}

export async function incrementPlays(trackId: string) {
  await supabase.rpc("increment_plays", { track_uuid: trackId });
}

// ── Queries videos ─────────────────────────────────────────────────────────
export async function getVideos(artistId?: string) {
  let query = supabase
    .from("videos")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false });
  if (artistId) query = query.eq("artist_id", artistId);
  const { data, error } = await query;
  if (error) throw error;
  return data as Video[];
}

// ── Queries abonnements ────────────────────────────────────────────────────
export async function getArtistStats(artistId: string) {
  const { data, error } = await supabase
    .from("artist_stats")
    .select("*")
    .eq("id", artistId)
    .single();
  if (error) throw error;
  return data;
}

// ── Auth helpers ───────────────────────────────────────────────────────────
export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_id", user.id)
    .single();
  if (error) return null;
  return data as Profile;
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, name: string, isArtist: boolean) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) throw error;
  // Créer le profil
  await supabase.from("profiles").insert({
    auth_id: data.user.id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    type: isArtist ? "artist" : "team",
  });
  return data;
}

export async function signOut() {
  return supabase.auth.signOut();
}

// ── Storage upload ─────────────────────────────────────────────────────────
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  contentType: string
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType, upsert: true });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);
  return publicUrl;
}

export async function uploadAudio(artistId: string, file: File) {
  return uploadFile("audio", `${artistId}/${Date.now()}-${file.name}`, file, file.type);
}

export async function uploadVideo(artistId: string, file: File) {
  return uploadFile("videos", `${artistId}/${Date.now()}-${file.name}`, file, file.type);
}

export async function uploadCover(artistId: string, file: File) {
  return uploadFile("covers", `${artistId}/${Date.now()}-${file.name}`, file, file.type);
}

export async function uploadAvatar(artistId: string, file: File) {
  return uploadFile("avatars", `${artistId}/avatar-${Date.now()}.jpg`, file, file.type);
}
