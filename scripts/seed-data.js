const { createClient } = require('@supabase/supabase-js');

// Supabase connection
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Sample users data for NuConnect
const sampleUsers = [
  {
    email: 'sarah.johnson@email.com',
    password: 'hashedpassword123',
    first_name: 'Sarah',
    last_name: 'Johnson'
  },
  {
    email: 'mike.chen@email.com',
    password: 'hashedpassword123',
    first_name: 'Mike',
    last_name: 'Chen'
  },
  {
    email: 'emma.davis@email.com',
    password: 'hashedpassword123',
    first_name: 'Emma',
    last_name: 'Davis'
  },
  {
    email: 'alex.rodriguez@email.com',
    password: 'hashedpassword123',
    first_name: 'Alex',
    last_name: 'Rodriguez'
  }
];

// Sample user profiles for NuConnect
const sampleProfiles = [
  {
    name: 'Sarah Johnson',
    interests: ['AI', 'Fintech', 'Education'],
    career_goals: 'find-cofounder',
    mentorship_pref: 'seeking',
    contact_prefs: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      email: 'sarah.johnson@email.com'
    }
  },
  {
    name: 'Mike Chen',
    interests: ['Climate', 'Health', 'Marketing'],
    career_goals: 'find-mentor',
    mentorship_pref: 'seeking',
    contact_prefs: {
      linkedin: 'https://linkedin.com/in/mikechen',
      email: 'mike.chen@email.com'
    }
  },
  {
    name: 'Emma Davis',
    interests: ['Design', 'UX', 'Product'],
    career_goals: 'explore-jobs',
    mentorship_pref: 'offering',
    contact_prefs: {
      linkedin: 'https://linkedin.com/in/emmadavis',
      portfolio: 'https://emmadavis.design'
    }
  },
  {
    name: 'Alex Rodriguez',
    interests: ['Blockchain', 'Gaming', 'VR'],
    career_goals: 'find-cofounder',
    mentorship_pref: 'both',
    contact_prefs: {
      linkedin: 'https://linkedin.com/in/alexrodriguez',
      github: 'https://github.com/alexr'
    }
  }
];

// Sample events for networking
const sampleEvents = [
  {
    name: 'NuConnect Demo Night',
    description: 'Internal demo and networking event',
    location: 'Chicago, IL',
    date_time: new Date().toISOString()
  },
  {
    name: 'Tech Networking Meetup',
    description: 'Monthly tech professional networking',
    location: 'San Francisco, CA',
    date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Sample match rooms
const sampleMatchRooms = [
  {
    name: 'AI Enthusiasts',
    description: 'Connect with fellow AI professionals and enthusiasts',
    visibility: 'public'
  },
  {
    name: 'Startup Founders',
    description: 'Network with other entrepreneurs and startup founders',
    visibility: 'public'
  }
];

async function seedData() {
  try {
    console.log('Starting to seed NuConnect data...');

    // 1. Insert users first
    console.log('Inserting users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert(sampleUsers)
      .select();

    if (usersError) {
      console.error('Error inserting users:', usersError);
      return;
    }
    console.log(`Inserted ${users.length} users`);

    // 2. Insert user profiles
    console.log('Inserting user profiles...');
    const profilesWithUserIds = users.map((user, index) => ({
      user_id: user.id,
      ...sampleProfiles[index]
    }));

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .insert(profilesWithUserIds)
      .select();

    if (profilesError) {
      console.error('Error inserting profiles:', profilesError);
      return;
    }
    console.log(`Inserted ${profiles.length} user profiles`);

    // 3. Insert events
    console.log('Inserting events...');
    const eventsWithCreator = sampleEvents.map(event => ({
      ...event,
      created_by: users[0].id // First user creates events
    }));

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .insert(eventsWithCreator)
      .select();

    if (eventsError) {
      console.error('Error inserting events:', eventsError);
      return;
    }
    console.log(`Inserted ${events.length} events`);

    // 4. Insert match rooms
    console.log('Inserting match rooms...');
    const roomsWithEventIds = sampleMatchRooms.map((room, index) => ({
      ...room,
      event_id: events[0].id, // Associate with first event
      created_by: users[0].id
    }));

    const { data: rooms, error: roomsError } = await supabase
      .from('match_rooms')
      .insert(roomsWithEventIds)
      .select();

    if (roomsError) {
      console.error('Error inserting match rooms:', roomsError);
      return;
    }
    console.log(`Inserted ${rooms.length} match rooms`);

    // 5. Insert room memberships (users join rooms)
    console.log('Adding users to match rooms...');
    const memberships = [];
    
    // Add all users to first room
    users.forEach(user => {
      memberships.push({
        room_id: rooms[0].id,
        user_id: user.id
      });
    });

    // Add first 2 users to second room
    users.slice(0, 2).forEach(user => {
      memberships.push({
        room_id: rooms[1].id,
        user_id: user.id
      });
    });

    const { data: membershipData, error: membershipError } = await supabase
      .from('room_members')
      .insert(memberships)
      .select();

    if (membershipError) {
      console.error('Error inserting room memberships:', membershipError);
      return;
    }
    console.log(`Inserted ${membershipData.length} room memberships`);

    // 6. Insert sample matches
    console.log('Creating sample matches...');
    const matches = [
      {
        room_id: rooms[0].id,
        user_a: users[0].id,
        user_b: users[1].id,
        match_score: 0.85,
        shared_topics: ['AI', 'Education'],
        ai_explanation: 'Both users show strong interest in AI and education technology, with complementary goals of seeking mentorship and finding co-founders.'
      },
      {
        room_id: rooms[0].id,
        user_a: users[2].id,
        user_b: users[3].id,
        match_score: 0.72,
        shared_topics: ['Product', 'Design'],
        ai_explanation: 'Great match for product development collaboration - one offers mentorship in UX/Design while the other seeks co-founder opportunities.'
      }
    ];

    const { data: matchData, error: matchError } = await supabase
      .from('matches')
      .insert(matches)
      .select();

    if (matchError) {
      console.error('Error inserting matches:', matchError);
      return;
    }
    console.log(`Inserted ${matchData.length} sample matches`);

    console.log('✅ All NuConnect seed data inserted successfully!');
    console.log('\nSummary:');
    console.log(`- ${users.length} users`);
    console.log(`- ${profiles.length} user profiles`);
    console.log(`- ${events.length} events`);
    console.log(`- ${rooms.length} match rooms`);
    console.log(`- ${membershipData.length} room memberships`);
    console.log(`- ${matchData.length} matches`);

  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run the seed function
seedData();
