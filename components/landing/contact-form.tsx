'use client'

import { useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationshipStatus: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsSubmitting(true)

    try {
      console.log('Submitting contact form:', formData)
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Contact form submitted successfully:', result)
        
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you within 24 hours.",
        })
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          relationshipStatus: '',
          message: ''
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Contact form submission failed:', errorData)
        throw new Error('Failed to submit contact form')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-800 mb-2">
              First Name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white/50"
              placeholder="John"
            />
          </div>
          <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-800 mb-2">
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white/50"
              placeholder="Smith"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white/50"
              placeholder="john@example.com"
            />
          </div>
          <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-2">
              Phone Number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white/50"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
          <label htmlFor="relationshipStatus" className="block text-sm font-medium text-gray-800 mb-2">
            Relationship Status
          </label>
          <select
            id="relationshipStatus"
            name="relationshipStatus"
            value={formData.relationshipStatus}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white/50"
          >
            <option value="">Select your relationship status</option>
            <option value="dating">Dating</option>
            <option value="engaged">Engaged</option>
            <option value="married">Married</option>
            <option value="domestic-partnership">Domestic Partnership</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
          <label htmlFor="message" className="block text-sm font-medium text-gray-800 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none bg-white/50"
            placeholder="Tell us how we can help you or any questions you have about Modern Matrimoney..."
          />
        </div>

        <div className="bg-white/30 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  )
}
