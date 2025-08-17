import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { scoreMatch, whySimple } from '@/lib/matching/score';
import { explainMatchLLM } from '@/lib/ai/openrouter';

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { roomId } = await req.json();

  // 1) My profile
  const { data: me } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // 2) Others in room (exclude me)
  const { data: othersMembers } = await supabase
    .from('room_members')
    .select('user_id')
    .eq('room_id', roomId)
    .neq('user_id', user.id);

  const othersIds = (othersMembers || []).map((m) => m.user_id);
  let candidates: any[] = [];

  if (othersIds.length) {
    const { data: others } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', othersIds);
    candidates = others || [];
  }

  // 3) Compute scores + rationale
  const results = await Promise.all(
    candidates.map(async (p) => {
      const score = scoreMatch(me, p);
      let why = whySimple(me, p, score);
      const maybeLLM = await explainMatchLLM(
        { me: pickForLLM(me), other: pickForLLM(p), score }
      );
      if (maybeLLM) why = maybeLLM;

      return {
        user_id: p.user_id,
        name: p.name ?? `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim(),
        headline: p.headline ?? p.role ?? '',
        avatar: p.profile_photo_url || null, // or compute getPublicUrl(p.avatar_url)
        score,
        shared: {
          interests: topOverlap(me?.interests, p?.interests),
          skills: topOverlap(me?.skills, p?.skills),
        },
        rationale: why,
      };
    })
  );

  results.sort((a, b) => b.score - a.score);
  return NextResponse.json({ matches: results.slice(0, 10) });
}

function topOverlap(a?: string[], b?: string[], n = 3) {
  if (!a?.length || !b?.length) return [];
  const setB = new Set(b.map((x) => x.toLowerCase()));
  const hits = a.filter((x) => setB.has(x.toLowerCase()));
  return hits.slice(0, n);
}

function pickForLLM(p: any) {
  return {
    industries: p?.industries ?? [],
    skills: p?.skills ?? [],
    interests: p?.interests ?? [],
    networking_goals: p?.networking_goals ?? [],
    role: p?.role ?? null,
    headline: p?.headline ?? null,
  };
}
