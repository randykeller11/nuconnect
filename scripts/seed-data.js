const { createClient } = require('@supabase/supabase-js');

// Supabase connection
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Sample users data
const sampleUsers = [
  {
    email: 'sarah.johnson@email.com',
    password: 'hashedpassword123',
    first_name: 'Sarah',
    last_name: 'Johnson',
    phone: '(555) 123-4567',
    relationship_status: 'married'
  },
  {
    email: 'mike.chen@email.com',
    password: 'hashedpassword123',
    first_name: 'Mike',
    last_name: 'Chen',
    phone: '(555) 234-5678',
    relationship_status: 'engaged'
  },
  {
    email: 'emma.davis@email.com',
    password: 'hashedpassword123',
    first_name: 'Emma',
    last_name: 'Davis',
    phone: '(555) 345-6789',
    relationship_status: 'dating'
  },
  {
    email: 'alex.rodriguez@email.com',
    password: 'hashedpassword123',
    first_name: 'Alex',
    last_name: 'Rodriguez',
    phone: '(555) 456-7890',
    relationship_status: 'domestic-partnership'
  }
];

// Sample questionnaire responses
const sampleQuestionnaireAnswers = [
  {
    relationship_status: 'Solid, just looking to grow',
    time_together: '4 to 10 years',
    living_situation: 'Yes',
    conversation_frequency: 'Within the last week',
    money_management: 'We make it a point to check in regularly',
    reflective_story: 'We had a disagreement about saving for a house versus taking a vacation. It taught us we need to talk about priorities more openly.',
    story_consent: 'Yes, I consent anonymously',
    practical_prompt: 'What does financial peace look like, and one step toward it?',
    stay_connected: {
      email: 'sarah.johnson@email.com',
      preferences: ['Free conversation prompts & event invites', 'Updates about the Matrimoney app']
    }
  },
  {
    relationship_status: 'Good, but money brings tension',
    time_together: '1 to 3 years',
    living_situation: 'Yes',
    conversation_frequency: 'In the past month',
    money_management: 'We split tasks but rarely discuss strategy',
    reflective_story: 'Planning our wedding budget was stressful. We realized we have different spending styles and need better communication.',
    story_consent: 'Maybe — please reach out first',
    practical_prompt: 'What habit do you admire & wish to change?',
    stay_connected: {
      email: 'mike.chen@email.com',
      preferences: ['Free conversation prompts & event invites', 'Licensing info for professionals']
    }
  },
  {
    relationship_status: 'Disconnected and unsure where to start',
    time_together: '10 to 20 years',
    living_situation: 'Yes',
    conversation_frequency: 'A few months ago',
    money_management: 'One of us handles everything',
    reflective_story: 'After years of avoiding money talks, we found ourselves in debt without realizing it. We need to rebuild trust and communication.',
    story_consent: 'Yes, I consent anonymously',
    practical_prompt: 'What feels unclear or overwhelming & how to simplify?',
    stay_connected: {
      email: 'emma.davis@email.com',
      preferences: ['Free conversation prompts & event invites', 'Updates about the Matrimoney app', 'Other']
    }
  },
  {
    relationship_status: 'Rebuilding after conflict or financial challenges',
    time_together: '4 to 10 years',
    living_situation: 'Off and on',
    conversation_frequency: 'Not really at all',
    money_management: 'We both try, but it often leads to conflict',
    reflective_story: 'A job loss last year put strain on our relationship. We argued about money constantly and are working to get back on track.',
    story_consent: 'No, I prefer full privacy',
    practical_prompt: 'Rank your shared non-financial priorities.',
    stay_connected: {
      email: 'alex.rodriguez@email.com',
      preferences: ['Updates about the Matrimoney app']
    }
  }
];

// Sample professional signups
const sampleProfessionalSignups = [
  {
    name: 'Dr. Jennifer Martinez',
    firm: 'Martinez Financial Planning',
    email: 'jennifer@martinezfp.com',
    phone: '(555) 987-6543',
    specialty: 'Certified Financial Planner'
  },
  {
    name: 'Robert Kim, LMFT',
    firm: 'Couples Therapy Center',
    email: 'robert@couplestherapy.com',
    phone: '(555) 876-5432',
    specialty: 'Marriage and Family Therapy'
  },
  {
    name: 'Lisa Thompson, CPA',
    firm: 'Thompson & Associates',
    email: 'lisa@thompsonaccounting.com',
    phone: '(555) 765-4321',
    specialty: 'Tax Planning and Preparation'
  },
  {
    name: 'David Wilson',
    firm: 'Wilson Wealth Management',
    email: 'david@wilsonwealth.com',
    phone: '(555) 654-3210',
    specialty: 'Investment Advisory Services'
  }
];

// Sample contact submissions
const sampleContactSubmissions = [
  {
    first_name: 'Jessica',
    last_name: 'Brown',
    email: 'jessica.brown@email.com',
    phone: '(555) 111-2222',
    relationship_status: 'married',
    message: 'My husband and I are interested in learning more about your approach to financial planning for couples. We\'ve been married for 8 years and feel like we\'re not on the same page financially.'
  },
  {
    first_name: 'Carlos',
    last_name: 'Garcia',
    email: 'carlos.garcia@email.com',
    phone: '(555) 222-3333',
    relationship_status: 'engaged',
    message: 'We\'re getting married next year and want to start our marriage with good financial habits. Can you tell us more about your workbook and how it might help us?'
  },
  {
    first_name: 'Amanda',
    last_name: 'Taylor',
    email: 'amanda.taylor@email.com',
    phone: '(555) 333-4444',
    relationship_status: 'dating',
    message: 'I\'ve been with my partner for 2 years and we\'re starting to talk about moving in together. Your questionnaire was really helpful - we\'d love to learn more about your resources.'
  },
  {
    first_name: 'Ryan',
    last_name: 'Mitchell',
    email: 'ryan.mitchell@email.com',
    phone: '(555) 444-5555',
    relationship_status: 'domestic-partnership',
    message: 'We\'ve been together for 5 years and recently went through some financial stress. Looking for tools to help us communicate better about money and rebuild our financial foundation.'
  }
];

async function seedData() {
  try {
    console.log('Starting to seed data...');

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

    // 2. Insert questionnaire responses with user IDs
    console.log('Inserting questionnaire responses...');
    const questionnaireResponses = users.map((user, index) => ({
      user_id: user.id,
      answers: sampleQuestionnaireAnswers[index],
      is_complete: true
    }));

    const { data: responses, error: responsesError } = await supabase
      .from('questionnaire_responses')
      .insert(questionnaireResponses)
      .select();

    if (responsesError) {
      console.error('Error inserting questionnaire responses:', responsesError);
      return;
    }
    console.log(`Inserted ${responses.length} questionnaire responses`);

    // 3. Insert professional signups
    console.log('Inserting professional signups...');
    const { data: professionals, error: professionalsError } = await supabase
      .from('professional_signups')
      .insert(sampleProfessionalSignups)
      .select();

    if (professionalsError) {
      console.error('Error inserting professional signups:', professionalsError);
      return;
    }
    console.log(`Inserted ${professionals.length} professional signups`);

    // 4. Insert contact submissions
    console.log('Inserting contact submissions...');
    const { data: contacts, error: contactsError } = await supabase
      .from('contact_submissions')
      .insert(sampleContactSubmissions)
      .select();

    if (contactsError) {
      console.error('Error inserting contact submissions:', contactsError);
      return;
    }
    console.log(`Inserted ${contacts.length} contact submissions`);

    console.log('✅ All seed data inserted successfully!');
    console.log('\nSummary:');
    console.log(`- ${users.length} users`);
    console.log(`- ${responses.length} questionnaire responses`);
    console.log(`- ${professionals.length} professional signups`);
    console.log(`- ${contacts.length} contact submissions`);

  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run the seed function
seedData();
