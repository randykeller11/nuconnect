const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  try {
    console.log('Creating sample matches...');

    // Get the demo room
    const { data: room, error: roomError } = await supabase
      .from('match_rooms')
      .select('id')
      .eq('name', 'AI Enthusiasts')
      .single();

    if (roomError || !room) {
      console.error('Demo room not found. Run seed-data.js first.');
      return;
    }

    // Get room members
    const { data: members, error: membersError } = await supabase
      .from('room_members')
      .select('user_id')
      .eq('room_id', room.id);

    if (membersError || !members || members.length < 2) {
      console.error('Not enough room members found.');
      return;
    }

    // Create sample matches
    const matches = [];
    
    // Create matches between pairs of users
    for (let i = 0; i < members.length - 1; i += 2) {
      if (i + 1 < members.length) {
        const userA = members[i].user_id;
        const userB = members[i + 1].user_id;
        
        matches.push({
          room_id: room.id,
          user_a: userA,
          user_b: userB,
          match_score: Math.random() * 0.4 + 0.6, // Score between 0.6-1.0
          shared_topics: ['AI', 'Technology'],
          ai_explanation: 'High compatibility based on shared interests in AI and complementary professional goals.'
        });
      }
    }

    // Add some specific high-quality matches
    if (members.length >= 4) {
      matches.push({
        room_id: room.id,
        user_a: members[0].user_id,
        user_b: members[2].user_id,
        match_score: 0.92,
        shared_topics: ['AI', 'Fintech', 'Education'],
        ai_explanation: 'Excellent match! Both users show strong interest in AI and education technology, with complementary goals of seeking mentorship and finding co-founders.'
      });

      matches.push({
        room_id: room.id,
        user_a: members[1].user_id,
        user_b: members[3].user_id,
        match_score: 0.87,
        shared_topics: ['AI', 'Product', 'Design'],
        ai_explanation: 'Great match for product development collaboration - one offers mentorship in UX/Design while the other seeks co-founder opportunities.'
      });
    }

    const { data: matchData, error: matchError } = await supabase
      .from('matches')
      .insert(matches)
      .select();

    if (matchError) throw matchError;

    console.log(`✅ Created ${matchData.length} sample matches`);
    console.log('Matches are ready for demo room testing!');

  } catch (error) {
    console.error('Error creating matches:', error);
    process.exit(1);
  }
}

main();
