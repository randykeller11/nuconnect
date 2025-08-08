'use client'

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/lib/hooks/use-toast";
import { Heart, Users, Clock, MessageCircle, DollarSign, Lightbulb, BookOpen, Shield, Target, Mail, User, Lock } from "lucide-react";
import Link from "next/link";
import { FloatingMenu } from './landing/floating-menu';

const questions = [
  {
    id: 'relationship_status',
    type: 'radio',
    icon: Heart,
    title: 'Relationship Status & Tension',
    text: 'How would you describe your relationship today?',
    options: [
      'Solid, just looking to grow',
      'Good, but money brings tension',
      'Disconnected and unsure where to start',
      'Rebuilding after conflict or financial challenges'
    ]
  },
  {
    id: 'time_together',
    type: 'radio',
    icon: Clock,
    title: 'Time Together',
    text: 'How long have you been together?',
    options: [
      'Less than 1 year',
      '1 to 3 years',
      '4 to 10 years',
      '10 to 20 years',
      'More than 20 years'
    ]
  },
  {
    id: 'living_situation',
    type: 'radio',
    icon: Users,
    title: 'Living Situation',
    text: 'Do you currently live together?',
    options: [
      'Yes',
      'No',
      'Off and on'
    ]
  },
  {
    id: 'conversation_frequency',
    type: 'radio',
    icon: MessageCircle,
    title: 'Financial Conversation Frequency',
    text: 'When did you last talk about money beyond bills or budgeting?',
    options: [
      'Within the last week',
      'In the past month',
      'A few months ago',
      'Not really at all'
    ]
  },
  {
    id: 'money_management',
    type: 'radio',
    icon: DollarSign,
    title: 'Money Management Dynamics',
    text: 'Which statement best describes how you manage money together?',
    options: [
      'One of us handles everything',
      'We split tasks but rarely discuss strategy',
      'We both try, but it often leads to conflict',
      'We make it a point to check in regularly'
    ]
  },
  {
    id: 'reflective_story',
    type: 'textarea',
    icon: BookOpen,
    title: 'Reflective Story',
    text: 'Have you experienced a moment when finances tested your relationship?',
    placeholder: 'Share your story (optional)...',
    optional: true
  },
  {
    id: 'story_consent',
    type: 'radio',
    icon: Shield,
    title: 'Story Consent',
    text: 'If we feature stories anonymously in future content, are you open to being included?',
    options: [
      'Yes, I consent anonymously',
      'Maybe — please reach out first',
      'No, I prefer full privacy'
    ]
  },
  {
    id: 'practical_prompt',
    type: 'radio',
    icon: Target,
    title: 'Practical Prompt',
    text: 'Choose one of the 5 Prompts to Reset Your Financial Connection to explore this week:',
    options: [
      'What habit do you admire & wish to change?',
      'Rank your shared non-financial priorities.',
      'What feels unclear or overwhelming & how to simplify?',
      'What does financial peace look like, and one step toward it?',
      'What would you still do if money were no object?'
    ]
  },
  {
    id: 'stay_connected',
    type: 'radio',
    icon: Mail,
    title: 'Stay Connected',
    text: 'How would you like to engage further?',
    options: [
      'Free conversation prompts & event invites',
      'Updates about the Matrimoney app',
      'Licensing info for professionals',
      'Other',
      'No further engagement needed'
    ]
  }
];

export default function Questionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authenticationStep, setAuthenticationStep] = useState<'loading' | 'auth' | 'questionnaire'>('loading');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationshipStatus: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    if (user && Object.keys(answers).length > 0) {
      const autoSave = setTimeout(() => {
        saveProgress();
      }, 2000);

      return () => clearTimeout(autoSave);
    }
  }, [answers, user]);

  // Development mode session clearing
  useEffect(() => {
    // In development, add a way to clear sessions easily
    if (process.env.NODE_ENV === 'development') {
      const handleKeyPress = (e: KeyboardEvent) => {
        // Press Ctrl+Shift+C to clear session
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
          sessionStorage.removeItem('matrimoney_user');
          setUser(null);
          setIsAuthenticated(false);
          setCurrentQuestion(0);
          setAnswers({});
          console.log('Development: Session cleared manually');
          toast({
            title: "Development",
            description: "Session cleared manually (Ctrl+Shift+C)",
          });
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [toast]);

  // Check if user has already completed the questionnaire
  const checkExistingQuestionnaire = async (userId: number) => {
    try {
      const response = await fetch(`/api/questionnaire/load?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.isComplete) {
          setIsCompleted(true);
          return true;
        } else if (data.answers && Array.isArray(data.answers)) {
          // Load partial answers
          const answersMap: Record<string, any> = {};
          data.answers.forEach((item: any) => {
            answersMap[item.questionId] = item.answer;
          });
          setAnswers(answersMap);
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to load existing questionnaire:', error);
      return false;
    }
  };

  // Restore user data from sessionStorage on component mount
  useEffect(() => {
    const validateStoredUser = async (userData: any) => {
      try {
        const response = await fetch('/api/auth/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userData.id }),
        });

        if (response.ok) {
          const validUser = await response.json();
          setUser(validUser);
          setIsAuthenticated(true);
          
          // Check if user has already completed the questionnaire
          const hasCompleted = await checkExistingQuestionnaire(validUser.id);
          if (!hasCompleted) {
            setAuthenticationStep('questionnaire');
          }
          // If hasCompleted is true, isCompleted state is already set in checkExistingQuestionnaire
        } else {
          // User no longer exists, clear session
          sessionStorage.removeItem('matrimoney_user');
          console.log('Stored user no longer exists, cleared session');
          setAuthenticationStep('auth');
        }
      } catch (error) {
        console.error('Failed to validate stored user:', error);
        sessionStorage.removeItem('matrimoney_user');
        setAuthenticationStep('auth');
      } finally {
        setIsInitializing(false);
      }
    };

    const storedUser = sessionStorage.getItem('matrimoney_user');
    if (storedUser) {
      try {
        const sessionData = JSON.parse(storedUser);
        
        // Check if session has expired (new format)
        if (sessionData.timestamp && sessionData.expiresIn) {
          const isExpired = Date.now() - sessionData.timestamp > sessionData.expiresIn;
          if (isExpired) {
            sessionStorage.removeItem('matrimoney_user');
            console.log('Session expired, cleared storage');
            setAuthenticationStep('auth');
            setIsInitializing(false);
            return;
          }
          // Validate the user from new format
          validateStoredUser(sessionData.user);
        } else {
          // Handle old format for backward compatibility
          validateStoredUser(sessionData);
        }
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        sessionStorage.removeItem('matrimoney_user');
        setAuthenticationStep('auth');
        setIsInitializing(false);
      }
    } else {
      setAuthenticationStep('auth');
      setIsInitializing(false);
    }
  }, []);

  const saveProgress = async () => {
    if (!user) return;

    try {
      await fetch('/api/questionnaire/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          answers,
          isComplete: false
        }),
      });
      console.log('Progress auto-saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const authMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Authentication failed');
      }
      
      return response.json();
    },
    onSuccess: async (userData) => {
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store user data with expiration
      const sessionData = {
        user: userData,
        timestamp: Date.now(),
        expiresIn: 24 * 60 * 60 * 1000 // 24 hours
      };
      sessionStorage.setItem('matrimoney_user', JSON.stringify(sessionData));
      
      // Check if user has already completed the questionnaire
      const hasCompleted = await checkExistingQuestionnaire(userData.id);
      if (!hasCompleted) {
        setAuthenticationStep('questionnaire');
        setCurrentQuestion(0);
      }
      
      toast({
        title: "Success!",
        description: authMode === 'login' ? "Welcome back!" : "Account created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { userId: number; answers: any }) => {
      const response = await fetch('/api/questionnaire/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          isComplete: true
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit questionnaire');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setIsCompleted(true);
      toast({
        title: "Success!",
        description: "Your questionnaire responses have been submitted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit questionnaire. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAuthSubmit = () => {
    if (authMode === 'register') {
      if (userFormData.password !== userFormData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
      
      const { confirmPassword, ...registerData } = userFormData;
      authMutation.mutate(registerData);
    } else {
      authMutation.mutate({
        email: userFormData.email,
        password: userFormData.password
      });
    }
  };

  // Show completion screen if questionnaire is completed
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-earth-gray py-20 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
        <FloatingMenu isQuestionnairePage={true} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glassmorphic card-style shadow-xl text-center">
            {/* Header Section */}
            <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
              <div className="w-16 h-16 bg-brand-teal rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-teal-900 font-heading mb-6">Thank You!</h2>
              <p className="text-lg text-gray-800 mb-4 font-body leading-relaxed">
                Your responses have been submitted successfully. We appreciate you taking the time to share your financial journey with us.
              </p>
            </div>
            
            {/* Gold Divider */}
            <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
            
            {/* Body Section */}
            <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
              <div className="bg-brand-teal/10 rounded-lg p-6 mb-8">
                <p className="body-medium text-brand-teal">
                  Thank you for sharing your responses with us. Your insights help us better understand how couples navigate their financial journey together.
                </p>
              </div>
              <div className="flex justify-center">
                <Link href="/">
                  <Button className="btn-primary px-8 py-3 font-semibold">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading screen while initializing
  if (authenticationStep === 'loading' || isInitializing) {
    return (
      <div className="min-h-screen bg-earth-gray py-8 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
        <FloatingMenu isQuestionnairePage={true} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2 text-center">
            {/* Header Section */}
            <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-teal-900 font-heading mb-4">
                Preparing Your Questionnaire
              </h2>
            </div>
            
            {/* Gold Divider */}
            <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
            
            {/* Body Section */}
            <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
              <p className="text-lg text-gray-800 font-body leading-relaxed">
                Please wait while we set up your personalized experience...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show auth flow if not authenticated
  if (authenticationStep === 'auth') {
    return (
      <div className="min-h-screen bg-earth-gray py-8 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
        <FloatingMenu isQuestionnairePage={true} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2 mb-8">
            {/* Header Section */}
            <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-teal rounded-lg flex items-center justify-center shadow-md icon-wrapper">
                  <User className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-brand-teal uppercase tracking-wide font-accent">
                    Account Setup
                  </h3>
                  <h2 className="text-2xl font-bold text-teal-900 font-heading">
                    Sign in or create an account to save your progress
                  </h2>
                </div>
              </div>
            </div>
            
            {/* Gold Divider */}
            <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
            
            {/* Body Section */}
            <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
              <div className="space-y-6">
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-4 justify-center items-center">
                <Button
                  onClick={() => setAuthMode('login')}
                  className={`${authMode === 'login' ? 'btn-primary' : 'btn-secondary'} w-full xs:w-auto px-4 xs:px-6 py-2 xs:py-3 text-sm xs:text-base`}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => setAuthMode('register')}
                  className={`${authMode === 'register' ? 'btn-primary' : 'btn-secondary'} w-full xs:w-auto px-4 xs:px-6 py-2 xs:py-3 text-sm xs:text-base`}
                >
                  Create Account
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Email Address *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    required
                    value={userFormData.email}
                    onChange={handleUserFormChange}
                    placeholder="your@email.com"
                    className="input-focus"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Password *
                  </label>
                  <Input
                    name="password"
                    type="password"
                    required
                    value={userFormData.password}
                    onChange={handleUserFormChange}
                    placeholder="Enter password"
                    className="input-focus"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      Confirm Password *
                    </label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      required
                      value={userFormData.confirmPassword}
                      onChange={handleUserFormChange}
                      placeholder="Confirm password"
                      className="input-focus"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        First Name *
                      </label>
                      <Input
                        name="firstName"
                        type="text"
                        required
                        value={userFormData.firstName}
                        onChange={handleUserFormChange}
                        placeholder="John"
                        className="input-focus"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Last Name *
                      </label>
                      <Input
                        name="lastName"
                        type="text"
                        required
                        value={userFormData.lastName}
                        onChange={handleUserFormChange}
                        placeholder="Smith"
                        className="input-focus"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Phone Number *
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        required
                        value={userFormData.phone}
                        onChange={handleUserFormChange}
                        placeholder="(555) 123-4567"
                        className="input-focus"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Relationship Status
                      </label>
                      <select
                        name="relationshipStatus"
                        value={userFormData.relationshipStatus}
                        onChange={handleUserFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                      >
                        <option value="">Select status</option>
                        <option value="dating">Dating</option>
                        <option value="engaged">Engaged</option>
                        <option value="married">Married</option>
                        <option value="domestic-partnership">Domestic Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

                <Button
                  onClick={handleAuthSubmit}
                  disabled={authMutation.isPending}
                  className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                      {authMode === 'login' ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    authMode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, value: string | {email?: string, preferences?: string[], other?: string}) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };


  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submit button clicked', answers); // Debug log
    
    // Validate required fields - all except the optional story question
    const requiredQuestions = questions.filter(q => !q.optional && q.type !== 'info');
    const missingAnswers = requiredQuestions.filter(q => {
      const answer = answers[q.id];
      return !answer || (typeof answer === 'string' && answer.trim() === '');
    });
    
    console.log('Missing answers:', missingAnswers); // Debug log
    
    if (missingAnswers.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please answer all required questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      question: questions.find(q => q.id === questionId)?.text || '',
      answer
    }));

    console.log('Submitting:', formattedAnswers); // Debug log

    submitMutation.mutate({
      userId: user.id,
      answers: formattedAnswers
    });
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-earth-gray py-20 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
        <FloatingMenu isQuestionnairePage={true} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glassmorphic card-style shadow-xl text-center">
            {/* Header Section */}
            <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
              <div className="w-16 h-16 bg-brand-teal rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-teal-900 font-heading mb-6">Thank You!</h2>
              <p className="text-lg text-gray-800 mb-4 font-body leading-relaxed">
                Your responses have been submitted successfully. We appreciate you taking the time to share your financial journey with us.
              </p>
            </div>
            
            {/* Gold Divider */}
            <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
            
            {/* Body Section */}
            <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
              <div className="bg-brand-teal/10 rounded-lg p-6 mb-8">
                <p className="body-medium text-brand-teal">
                  Thank you for sharing your responses with us. Your insights help us better understand how couples navigate their financial journey together.
                </p>
              </div>
              <div className="flex justify-center">
                <Link href="/">
                  <Button className="btn-primary px-8 py-3 font-semibold">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const IconComponent = currentQ.icon;

  const isAnswered = () => {
    const answer = answers[currentQ.id];
    if (currentQ.type === 'info') return true;
    if (currentQ.optional) return true;
    if (currentQ.type === 'radio') {
      return answer && typeof answer === 'string' && answer.trim() !== '';
    }
    if (currentQ.type === 'textarea') {
      return currentQ.optional || (answer && typeof answer === 'string' && answer.trim() !== '');
    }
    return answer && (typeof answer === 'string' ? answer.trim() !== '' : Boolean(answer));
  };

  const renderQuestionContent = () => {
    switch (currentQ.type) {
      case 'radio':
        return (
          <div className="space-y-3">
            {currentQ.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-earth-gray/50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={currentQ.id}
                  value={option}
                  checked={answers[currentQ.id] === option}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  className="w-4 h-4 text-brand-teal focus:ring-brand-teal"
                />
                <span className="body-large text-neutral-dark">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <Textarea
            value={answers[currentQ.id] || ''}
            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
            placeholder={currentQ.placeholder || "Share your thoughts..."}
            className="min-h-32 resize-none input-focus"
          />
        );



      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-earth-gray py-8 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
      <FloatingMenu isQuestionnairePage={true} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-neutral-dark font-body">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-neutral-dark font-body">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-earth-gray" />
        </div>

        {/* Question Card */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2 mb-8">
          {/* Header Section */}
          <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-teal rounded-lg flex items-center justify-center shadow-md icon-wrapper">
                <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-brand-teal uppercase tracking-wide font-accent">
                  {currentQ.title}
                </h3>
                <h2 className="text-2xl font-bold text-teal-900 font-heading">
                  {currentQ.text}
                </h2>
              </div>
            </div>
          </div>
          
          {/* Gold Divider */}
          <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
          
          {/* Body Section */}
          <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
            {renderQuestionContent()}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-white/80 text-brand-teal border-2 border-brand-teal hover:bg-brand-teal hover:text-white px-6 py-3 font-medium rounded-lg shadow-md transition-all duration-300 disabled:bg-gray-400/80 disabled:text-gray-600 disabled:border-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="btn-primary px-8 py-3 font-semibold"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Responses'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isAnswered()}
              className="btn-primary px-8 py-3 font-semibold"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
