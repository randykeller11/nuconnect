'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Users, FileText, Calendar, Mail, Phone, Building, ChevronDown, ChevronUp, MessageCircle, Menu, X, Home, BookOpen, Heart, Lock } from 'lucide-react'
import Link from 'next/link'

function FloatingMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleWorkbookClick = () => {
    const event = new CustomEvent('openWorkbookDialog')
    window.dispatchEvent(event)
    setIsMenuOpen(false)
  }

  return (
    <div className="fixed top-6 left-6 z-50">
      <button
        onClick={toggleMenu}
        className="w-14 h-14 bg-brand-teal/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 text-white hover:bg-brand-teal transition-all duration-200 flex items-center justify-center hover:scale-105"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 overflow-hidden">
          <nav className="py-2">
            <Link 
              href="/"
              className="flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 border-b border-gray-100/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </Link>
            
            <Link 
              href="/questionnaire"
              className="flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 border-b border-gray-100/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="h-5 w-5 mr-3" />
              Take Questionnaire
            </Link>
            
            <button
              onClick={handleWorkbookClick}
              className="w-full flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200 border-b border-gray-100/50 text-left"
            >
              <BookOpen className="h-5 w-5 mr-3" />
              Explore Workbook
            </button>
            
            <Link 
              href="/professional-signup"
              className="flex items-center px-4 py-3 text-neutral-dark hover:bg-brand-teal/10 hover:text-brand-teal transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-5 w-5 mr-3" />
              Join Pilot Program
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}

interface QuestionnaireResponse {
  id: number
  userId: number
  answers: Array<{questionId: string, question: string, answer: string | {email: string, preferences: string[]}}>
  isComplete: boolean
  submittedAt: string
  updatedAt: string
  user?: {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    relationshipStatus: string
  }
}

interface ProfessionalSignup {
  id: number
  name: string
  email: string
  firm: string
  phone: string
  specialty: string
  submittedAt: string
}

interface ContactSubmission {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  relationshipStatus: string
  message: string
  submittedAt: string
}

export default function AdminDashboard() {
  const [questionnaireResponses, setQuestionnaireResponses] = useState<QuestionnaireResponse[]>([])
  const [professionalSignups, setProfessionalSignups] = useState<ProfessionalSignup[]>([])
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedResponses, setExpandedResponses] = useState<Set<number>>(new Set())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    // Check if already authenticated in session storage
    const isAuth = sessionStorage.getItem('admin_authenticated')
    if (isAuth === 'true') {
      setIsAuthenticated(true)
      fetchData()
    } else {
      setLoading(false)
    }
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'Matrimoney2025Success') {
      setIsAuthenticated(true)
      setAuthError('')
      sessionStorage.setItem('admin_authenticated', 'true')
      fetchData()
    } else {
      setAuthError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin_authenticated')
    setPassword('')
    setAuthError('')
  }

  const fetchData = async () => {
    try {
      console.log('Fetching admin dashboard data...');
      
      const [questionnaireRes, professionalsRes, contactRes] = await Promise.all([
        fetch('/api/admin/questionnaire'),
        fetch('/api/admin/professionals'),
        fetch('/api/admin/contact')
      ])

      console.log('Response statuses:', {
        questionnaire: questionnaireRes.status,
        professionals: professionalsRes.status,
        contact: contactRes.status
      });

      if (questionnaireRes.ok) {
        const questionnaireData = await questionnaireRes.json()
        console.log('Questionnaire data received:', questionnaireData);
        setQuestionnaireResponses(Array.isArray(questionnaireData) ? questionnaireData : [])
      } else {
        const errorText = await questionnaireRes.text();
        console.error('Failed to fetch questionnaire responses:', questionnaireRes.status, errorText);
      }

      if (professionalsRes.ok) {
        const professionalsData = await professionalsRes.json()
        console.log('Professionals data received:', professionalsData);
        setProfessionalSignups(Array.isArray(professionalsData) ? professionalsData : [])
      } else {
        const errorText = await professionalsRes.text();
        console.error('Failed to fetch professional signups:', professionalsRes.status, errorText);
      }

      if (contactRes.ok) {
        const contactData = await contactRes.json()
        console.log('Contact data received:', contactData);
        setContactSubmissions(Array.isArray(contactData) ? contactData : [])
      } else {
        const errorText = await contactRes.text();
        console.error('Failed to fetch contact submissions:', contactRes.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAnswerValue = (answer: string | {email: string, preferences: string[]} | string[]) => {
    if (typeof answer === 'string') return answer
    if (Array.isArray(answer)) return answer.join(', ')
    if (answer && typeof answer === 'object') {
      if ('email' in answer) {
        const emailObj = answer as {email: string, preferences: string[]}
        return `${emailObj.email} (Interests: ${emailObj.preferences?.join(', ') || 'None specified'})`
      }
      // Handle other object types by showing key-value pairs
      return Object.entries(answer).map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: ${value.join(', ')}`
        }
        return `${key}: ${value}`
      }).join(' | ')
    }
    return String(answer)
  }

  const toggleResponseExpansion = (responseId: number) => {
    setExpandedResponses(prev => {
      const newSet = new Set(prev)
      if (newSet.has(responseId)) {
        newSet.delete(responseId)
      } else {
        newSet.add(responseId)
      }
      return newSet
    })
  }

  const getPreviewAnswers = (answers: Array<{questionId: string, question: string, answer: string | {email: string, preferences: string[]}}>) => {
    // Ensure answers is an array before calling slice
    if (!Array.isArray(answers)) {
      console.warn('Answers is not an array:', answers);
      return [];
    }
    return answers.slice(0, 3) // Show first 3 answers as preview
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-earth-gray py-8 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/images/freshBackground.png)'}}>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden p-2">
            {/* Header Section */}
            <div className="px-8 py-6 bg-white/30 backdrop-blur-sm rounded-t-lg">
              <div className="w-16 h-16 mx-auto mb-6 bg-brand-teal rounded-lg flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-3xl font-bold text-teal-900 mb-4 font-heading text-center">
                Admin Access
              </h1>
              <p className="text-lg text-gray-800 text-center">
                Enter the admin password to access the dashboard
              </p>
            </div>
            
            {/* Gold Divider */}
            <div className="h-1 bg-gradient-to-r from-gold-light via-gold-dark/60 via-gold-dark/30 via-gold-dark/15 via-gold-dark/8 to-transparent"></div>
            
            {/* Body Section */}
            <div className="px-8 py-6 bg-white/40 backdrop-blur-sm rounded-b-lg">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full input-focus bg-white/50"
                    required
                  />
                </div>
                {authError && (
                  <p className="text-red-600 text-sm text-center">{authError}</p>
                )}
                <Button
                  type="submit"
                  className="w-full btn-primary py-3 text-lg font-semibold"
                >
                  Access Dashboard
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <Link href="/">
                  <Button className="bg-brand-teal text-white hover:bg-brand-teal/90 hover:scale-105 hover:shadow-2xl transition-all duration-300 btn-glow">
                    ← Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-gray py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto"></div>
            <p className="mt-4 text-neutral-dark">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-earth-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FloatingMenu />
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-neutral-dark font-heading mb-4">
                Admin Dashboard
              </h1>
              <p className="text-lg text-neutral-dark">
                Review questionnaire responses and professional signups
              </p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questionnaires</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{questionnaireResponses.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professional Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{professionalSignups.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactSubmissions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {questionnaireResponses.length + professionalSignups.length + contactSubmissions.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="questionnaires" className="space-y-4">
          <TabsList>
            <TabsTrigger value="questionnaires">Questionnaire Responses</TabsTrigger>
            <TabsTrigger value="professionals">Professional Signups</TabsTrigger>
            <TabsTrigger value="consultations">Contact Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="questionnaires" className="space-y-4">
            <div className="grid gap-4">
              {questionnaireResponses.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-neutral-dark">No questionnaire responses yet.</p>
                  </CardContent>
                </Card>
              ) : (
                questionnaireResponses.map((response) => {
                  const isExpanded = expandedResponses.has(response.id)
                  const answersToShow = isExpanded ? response.answers : getPreviewAnswers(response.answers)
                  
                  return (
                    <Card key={response.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {response.user ? 
                                `${response.user.firstName} ${response.user.lastName}` : 
                                `User #${response.userId}`
                              }
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Response #{response.id} • {Array.isArray(response.answers) ? response.answers.length : 0} answers • {response.isComplete ? 'Complete' : 'In Progress'}
                            </p>
                            {response.user && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 mb-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{response.user.email}</span>
                                </div>
                                {response.user.phone && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{response.user.phone}</span>
                                  </div>
                                )}
                                {response.user.relationshipStatus && (
                                  <div className="flex items-center gap-2">
                                    <Heart className="h-3 w-3" />
                                    <span className="capitalize">{response.user.relationshipStatus.replace('-', ' ')}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {formatDate(response.submittedAt)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleResponseExpansion(response.id)}
                              className="h-8 w-8 p-0"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Array.isArray(answersToShow) && answersToShow.map((answer: {questionId: string, question: string, answer: string | {email: string, preferences: string[]}}, index: number) => (
                            <div key={index} className="border-l-2 border-brand-teal pl-4">
                              <h4 className="font-medium text-neutral-dark mb-1 text-sm">
                                {answer.question}
                              </h4>
                              <p className="text-sm text-neutral-dark/80">
                                {getAnswerValue(answer.answer)}
                              </p>
                            </div>
                          ))}
                          {!isExpanded && Array.isArray(response.answers) && response.answers.length > 3 && (
                            <div className="text-center pt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleResponseExpansion(response.id)}
                                className="text-brand-teal hover:text-brand-teal/80"
                              >
                                Show {response.answers.length - 3} more answers
                                <ChevronDown className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          )}
                          {!Array.isArray(response.answers) && (
                            <div className="text-center pt-2">
                              <p className="text-sm text-neutral-dark/60">No answers available</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="professionals" className="space-y-4">
            <div className="grid gap-4">
              {professionalSignups.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-neutral-dark">No professional signups yet.</p>
                  </CardContent>
                </Card>
              ) : (
                professionalSignups.map((signup) => (
                  <Card key={signup.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{signup.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {signup.specialty}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {formatDate(signup.submittedAt)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-brand-teal" />
                          <span className="text-sm">{signup.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-brand-teal" />
                          <span className="text-sm">{signup.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-brand-teal" />
                          <span className="text-sm">{signup.firm}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            <div className="grid gap-4">
              {contactSubmissions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-neutral-dark">No contact messages yet.</p>
                  </CardContent>
                </Card>
              ) : (
                contactSubmissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{submission.firstName} {submission.lastName}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Contact Message #{submission.id} • {submission.relationshipStatus}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {formatDate(submission.submittedAt)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-brand-teal" />
                            <span className="text-sm">{submission.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-brand-teal" />
                            <span className="text-sm">{submission.phone}</span>
                          </div>
                        </div>
                        {submission.message && (
                          <div className="border-l-2 border-brand-teal pl-4">
                            <h4 className="font-medium text-neutral-dark mb-1 text-sm">
                              Message
                            </h4>
                            <p className="text-sm text-neutral-dark/80">
                              {submission.message}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button 
            onClick={fetchData}
            className="btn-secondary"
          >
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  )
}
