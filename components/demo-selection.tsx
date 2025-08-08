'use client'

import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Users, User, UserCheck } from 'lucide-react'
import Link from 'next/link'

export default function DemoSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Choose Your Demo Experience
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Select how you&apos;d like to explore Modern Matrimoney. Experience the app as a user or view the admin dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Demo */}
          <Card className="text-center bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">User Experience</CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                Try our financial couples questionnaire and see how it works for real users.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Complete 10-question assessment</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Get personalized insights</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Experience the full user journey</span>
                </div>
              </div>
              <Link href="/questionnaire">
                <Button size="lg" className="w-full bg-primary text-white hover:bg-primary/90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Users className="w-5 h-5 mr-2" />
                  Start as User
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Demo */}
          <Card className="text-center bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Admin Dashboard</CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                View the admin perspective and see how responses are managed and analyzed.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>View all user responses</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Analyze engagement metrics</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Professional signup tracking</span>
                </div>
              </div>
              <Link href="/admin-dashboard">
                <Button size="lg" className="w-full bg-primary text-white hover:bg-primary/90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <UserCheck className="w-5 h-5 mr-2" />
                  View Admin Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            Want to go back to the homepage?
          </p>
          <Link href="/">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
