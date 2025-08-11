const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');

// Supabase connection
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const INTERESTS = ['AI','Climate','Fintech','Education','Health','Music','Art','Gaming','Marketing','Operations','Sales','Design','Product','Engineering'];
const GOALS = ['find-cofounder','explore-jobs','hire','learn-ai','mentor-others','find-mentor','investors','portfolio-feedback'];
const MENTORSHIP_PREFS = ['seeking','offering','both','none'];

function pick(arr, n = 3) { 
  return faker.helpers.arrayElements(arr, n); 
}

async function ensureAuthUser(email, name) {
  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: 'password123', // Demo password
    email_confirm: true,
    user_metadata: {
      name: name
    }
  });
  
  if (error && !error.message.includes('already registered')) {
    throw error;
  }
  
  return data?.user?.id || null;
}

async function upsertProfile(user_id, name) {
  const interests = pick(INTERESTS, faker.number.int({min:2,max:5}));
  const mentorship = faker.helpers.arrayElement(MENTORSHIP_PREFS);
  const careerGoals = faker.helpers.arrayElement(GOALS);
  const contact = { 
    linkedin: `https://linkedin.com/in/${faker.internet.userName()}`,
    email: faker.internet.email()
  };

  const { error } = await supabase.from('profiles').upsert({
    user_id, 
    name,
    interests,
    career_goals: careerGoals,
    mentorship_pref: mentorship,
    contact_prefs: contact
  });
  
  if (error) throw error;
  return { interests, mentorship, careerGoals };
}

async function main() {
  try {
    console.log('Starting to seed NuConnect data...');

    // Create specific demo users first
    const demoUsers = [
      { name: 'Sarah Johnson', email: 'sarah.johnson@demo.com' },
      { name: 'Mike Chen', email: 'mike.chen@demo.com' },
      { name: 'Emma Davis', email: 'emma.davis@demo.com' },
      { name: 'Alex Rodriguez', email: 'alex.rodriguez@demo.com' }
    ];

    const users = [];
    
    // Create demo users
    console.log('Creating demo users...');
    for (const demoUser of demoUsers) {
      const id = await ensureAuthUser(demoUser.email, demoUser.name);
      if (id) {
        await upsertProfile(id, demoUser.name);
        users.push(id);
      }
    }

    // Create additional random users
    console.log('Creating additional users...');
    for (let i = 0; i < 26; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email({ firstName: name.split(' ')[0] }).toLowerCase();
      const id = await ensureAuthUser(email, name);
      if (id) {
        await upsertProfile(id, name);
        users.push(id);
      }
    }

    console.log(`Created ${users.length} users with profiles`);

    // Create demo events
    console.log('Creating events...');
    const events = [
      {
        name: 'NuConnect Demo Night',
        description: 'Internal demo and networking event',
        location: 'Chicago, IL',
        date_time: new Date().toISOString(),
        created_by: users[0]
      },
      {
        name: 'Tech Networking Meetup',
        description: 'Monthly tech professional networking',
        location: 'San Francisco, CA',
        date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: users[0]
      }
    ];

    const { data: eventData, error: eventsError } = await supabase
      .from('events')
      .insert(events)
      .select();

    if (eventsError) throw eventsError;
    console.log(`Created ${eventData.length} events`);

    // Create match rooms
    console.log('Creating match rooms...');
    const rooms = [
      {
        name: 'AI Enthusiasts',
        description: 'Connect with fellow AI professionals and enthusiasts',
        event_id: eventData[0].id,
        visibility: 'public',
        created_by: users[0]
      },
      {
        name: 'Startup Founders',
        description: 'Network with other entrepreneurs and startup founders',
        event_id: eventData[0].id,
        visibility: 'public',
        created_by: users[0]
      },
      {
        name: 'Climate Tech',
        description: 'Professionals working on climate solutions',
        event_id: eventData[1].id,
        visibility: 'public',
        created_by: users[0]
      }
    ];

    const { data: roomData, error: roomsError } = await supabase
      .from('match_rooms')
      .insert(rooms)
      .select();

    if (roomsError) throw roomsError;
    console.log(`Created ${roomData.length} match rooms`);

    // Add users to rooms
    console.log('Adding users to match rooms...');
    const memberships = [];
    
    // Add first 20 users to first room
    users.slice(0, 20).forEach(userId => {
      memberships.push({
        room_id: roomData[0].id,
        user_id: userId
      });
    });

    // Add first 15 users to second room
    users.slice(0, 15).forEach(userId => {
      memberships.push({
        room_id: roomData[1].id,
        user_id: userId
      });
    });

    // Add users 10-25 to third room
    users.slice(10, 25).forEach(userId => {
      memberships.push({
        room_id: roomData[2].id,
        user_id: userId
      });
    });

    const { data: membershipData, error: membershipError } = await supabase
      .from('room_members')
      .insert(memberships)
      .select();

    if (membershipError) throw membershipError;
    console.log(`Created ${membershipData.length} room memberships`);

    console.log('✅ All NuConnect seed data inserted successfully!');
    console.log('\nSummary:');
    console.log(`- ${users.length} users with profiles`);
    console.log(`- ${eventData.length} events`);
    console.log(`- ${roomData.length} match rooms`);
    console.log(`- ${membershipData.length} room memberships`);
    console.log('\nDemo users created:');
    demoUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

main();
