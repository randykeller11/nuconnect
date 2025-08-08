import { NextRequest, NextResponse } from 'next/server'

// Mock data for demo purposes
const mockQuestionnaireResponses = [
  {
    id: 1,
    userId: 'Sarah & Michael Thompson',
    answers: [
      {
        questionId: 'relationship_status',
        question: 'How would you describe your relationship today?',
        answer: 'Good, but money brings tension'
      },
      {
        questionId: 'time_together',
        question: 'How long have you been together?',
        answer: '4 to 10 years'
      },
      {
        questionId: 'living_situation',
        question: 'Do you currently live together?',
        answer: 'Yes'
      },
      {
        questionId: 'conversation_frequency',
        question: 'When did you last talk about money beyond bills or budgeting?',
        answer: 'A few months ago'
      },
      {
        questionId: 'money_management',
        question: 'Which statement best describes how you manage money together?',
        answer: 'We split tasks but rarely discuss strategy'
      },
      {
        questionId: 'reflective_story',
        question: 'Have you experienced a moment when finances tested your relationship?',
        answer: 'Yes, when we were deciding whether to buy a house. We had very different ideas about how much we could afford and it led to several heated discussions.'
      },
      {
        questionId: 'story_consent',
        question: 'If we feature stories anonymously in future content, are you open to being included?',
        answer: 'Yes, I consent anonymously'
      },
      {
        questionId: 'practical_prompt',
        question: 'Choose one of the 5 Prompts to Reset Your Financial Connection to explore this week:',
        answer: 'What does financial peace look like, and one step toward it?'
      },
      {
        questionId: 'stay_connected',
        question: 'How would you like to engage further?',
        answer: {
          email: 'sarah.thompson@email.com',
          preferences: ['Free conversation prompts & event invites', 'Updates about the MatriMoney app']
        }
      }
    ],
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 2,
    userId: 'Jessica & David Chen',
    answers: [
      {
        questionId: 'relationship_status',
        question: 'How would you describe your relationship today?',
        answer: 'Solid, just looking to grow'
      },
      {
        questionId: 'time_together',
        question: 'How long have you been together?',
        answer: '1 to 3 years'
      },
      {
        questionId: 'living_situation',
        question: 'Do you currently live together?',
        answer: 'No'
      },
      {
        questionId: 'conversation_frequency',
        question: 'When did you last talk about money beyond bills or budgeting?',
        answer: 'Within the last week'
      },
      {
        questionId: 'money_management',
        question: 'Which statement best describes how you manage money together?',
        answer: 'We make it a point to check in regularly'
      },
      {
        questionId: 'story_consent',
        question: 'If we feature stories anonymously in future content, are you open to being included?',
        answer: 'Maybe — please reach out first'
      },
      {
        questionId: 'practical_prompt',
        question: 'Choose one of the 5 Prompts to Reset Your Financial Connection to explore this week:',
        answer: 'Rank your shared non-financial priorities.'
      },
      {
        questionId: 'stay_connected',
        question: 'How would you like to engage further?',
        answer: {
          email: 'jessica.chen@gmail.com',
          preferences: ['Free conversation prompts & event invites']
        }
      }
    ],
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: 3,
    userId: 'Amanda & Robert Martinez',
    answers: [
      {
        questionId: 'relationship_status',
        question: 'How would you describe your relationship today?',
        answer: 'Rebuilding after conflict or financial challenges'
      },
      {
        questionId: 'time_together',
        question: 'How long have you been together?',
        answer: '10 to 20 years'
      },
      {
        questionId: 'living_situation',
        question: 'Do you currently live together?',
        answer: 'Off and on'
      },
      {
        questionId: 'conversation_frequency',
        question: 'When did you last talk about money beyond bills or budgeting?',
        answer: 'Not really at all'
      },
      {
        questionId: 'money_management',
        question: 'Which statement best describes how you manage money together?',
        answer: 'We both try, but it often leads to conflict'
      },
      {
        questionId: 'reflective_story',
        question: 'Have you experienced a moment when finances tested your relationship?',
        answer: 'We went through a period where one of us lost their job and we had very different approaches to handling the financial stress. It created a lot of tension and we\'re still working through it.'
      },
      {
        questionId: 'story_consent',
        question: 'If we feature stories anonymously in future content, are you open to being included?',
        answer: 'No, I prefer full privacy'
      },
      {
        questionId: 'practical_prompt',
        question: 'Choose one of the 5 Prompts to Reset Your Financial Connection to explore this week:',
        answer: 'What feels unclear or overwhelming & how to simplify?'
      },
      {
        questionId: 'stay_connected',
        question: 'How would you like to engage further?',
        answer: {
          email: 'amanda.martinez@outlook.com',
          preferences: ['Licensing info for professionals', 'Updates about the MatriMoney app']
        }
      }
    ],
    submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
  }
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return NextResponse.json(mockQuestionnaireResponses)
  } catch (error) {
    console.error('Error fetching questionnaire responses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire responses' },
      { status: 500 }
    )
  }
}
