'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Users, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface QuestionnaireResponse {
  id: number
  userId: string
  answers: Array<{questionId: string, question: string, answer: string}>
  submittedAt: string
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

export default function AdminDashboard() {
  const [questionnaireResponses, setQuestionnaireResponses] = useState<QuestionnaireResponse[]>([])
  const [professionalSignups, setProfessionalSignups] = useState<ProfessionalSignup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responsesRes, professionalsRes] = await Promise.all([
          fetch('/api/questionnaire/responses'),
          fetch('/api/professionals')
        ])
        
        const responses = await responsesRes.json()
        const professionals = await professionalsRes.json()
        
        setQuestionnaireResponses(responses)
        setProfessionalSignups(professionals)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Admin Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Monitor user engagement and track professional interest in Modern Matrimoney.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{questionnaireResponses.length}</div>
              <p className="text-xs text-muted-foreground">
                Questionnaire submissions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professional Interest</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{professionalSignups.length}</div>
              <p className="text-xs text-muted-foreground">
                Professional signups
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {questionnaireResponses.length > 0 ? '100%' : '0%'}
              </div>
              <p className="text-xs text-muted-foreground">
                Completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Questionnaire Responses */}
        <Card className="bg-white shadow-xl border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Recent Questionnaire Responses</CardTitle>
            <CardDescription>
              Latest submissions from couples exploring financial literacy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {questionnaireResponses.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No responses yet. Share the questionnaire to get started!</p>
            ) : (
              <div className="space-y-4">
                {questionnaireResponses.slice(0, 5).map((response) => (
                  <div key={response.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{response.userId}</h3>
                        <p className="text-sm text-slate-600">Response #{response.id}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {response.answers.slice(0, 4).map((answer, index) => (
                        <div key={index}>
                          <span className="font-medium">{answer.question}:</span> {answer.answer}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Signups */}
        <Card className="bg-white shadow-xl border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Professional Interest</CardTitle>
            <CardDescription>
              Financial professionals interested in Modern Matrimoney
            </CardDescription>
          </CardHeader>
          <CardContent>
            {professionalSignups.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No professional signups yet.</p>
            ) : (
              <div className="space-y-4">
                {professionalSignups.slice(0, 5).map((signup) => (
                  <div key={signup.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{signup.name}</h3>
                        <p className="text-sm text-slate-600">{signup.email}</p>
                        <p className="text-sm text-slate-600">{signup.specialty} at {signup.firm}</p>
                      </div>
                      <Badge variant="outline">
                        {new Date(signup.submittedAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Link href="/demo-selection">
            <Button variant="outline" className="mr-4">
              ← Back to Demo Selection
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
