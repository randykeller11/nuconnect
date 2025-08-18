import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { topOverlap } from '@/lib/matching/score';
import { explainSynergyLLM } from '@/lib/ai/openrouter';

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { roomId, targetUserId } = await req.json();

  // Insert interaction
  await supabase
    .from('match_interactions')
    .upsert({
      room_id: roomId,
      user_id: user.id,
      target_user_id: targetUserId,
      action: 'like'
    }, {
      onConflict: 'room_id,user_id,target_user_id'
    });

  // Check for reciprocal like
  const { data: reciprocalLike } = await supabase
    .from('match_interactions')
    .select('*')
    .eq('room_id', roomId)
    .eq('user_id', targetUserId)
    .eq('target_user_id', user.id)
    .eq('action', 'like')
    .maybeSingle();

  if (!reciprocalLike) {
    return NextResponse.json({ mutual: false });
  }

  // It's a mutual match! Get both profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('user_id', [user.id, targetUserId]);

  const myProfile = profiles?.find(p => p.user_id === user.id);
  const otherProfile = profiles?.find(p => p.user_id === targetUserId);

  if (!myProfile || !otherProfile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Build overlaps
  const overlaps = {
    interests: topOverlap(myProfile.interests, otherProfile.interests),
    skills: topOverlap(myProfile.skills, otherProfile.skills),
    industries: topOverlap(myProfile.industries, otherProfile.industries)
  };

  // Generate synergy brief
  let synergy = 'You both have complementary backgrounds that could lead to valuable collaboration opportunities.';
  
  try {
    const roomContext = await supabase
      .from('rooms')
      .select('name, events(name)')
      .eq('id', roomId)
      .single();

    const synergyBrief = await explainSynergyLLM({
      me: {
        industries: myProfile?.industries ?? [],
        skills: myProfile?.skills ?? [],
        interests: myProfile?.interests ?? [],
        networking_goals: myProfile?.networking_goals ?? [],
        role: myProfile?.role ?? null,
        headline: myProfile?.headline ?? null,
      },
      other: {
        industries: otherProfile?.industries ?? [],
        skills: otherProfile?.skills ?? [],
        interests: otherProfile?.interests ?? [],
        networking_goals: otherProfile?.networking_goals ?? [],
        role: otherProfile?.role ?? null,
        headline: otherProfile?.headline ?? null,
      },
      overlaps,
      roomContext: {
        room: roomContext?.data?.name,
        event: roomContext?.data?.events?.name
      }
    });

    if (synergyBrief && synergyBrief.length > 20) {
      synergy = synergyBrief;
    }
  } catch (error) {
    console.error('Synergy generation failed:', error);
  }

  // Store synergy
  const userA = user.id < targetUserId ? user.id : targetUserId;
  const userB = user.id < targetUserId ? targetUserId : user.id;

  await supabase
    .from('match_synergy')
    .upsert({
      room_id: roomId,
      user_a: userA,
      user_b: userB,
      summary: synergy,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'room_id,user_a,user_b'
    });

  // Return reveal data
  const reveal = {
    user_id: otherProfile.user_id,
    name: `${otherProfile.first_name || ''} ${otherProfile.last_name || ''}`.trim() || otherProfile.name,
    role: otherProfile.role,
    headline: otherProfile.headline,
    profile_photo_url: otherProfile.profile_photo_url,
    linkedin_url: otherProfile.linkedin_url,
    industries: otherProfile.industries,
    skills: otherProfile.skills,
    interests: otherProfile.interests,
    networking_goals: otherProfile.networking_goals
  };

  return NextResponse.json({ 
    mutual: true, 
    synergy, 
    reveal 
  });
}
