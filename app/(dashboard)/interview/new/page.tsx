'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function NewInterviewPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Please enter an interview title')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to create interview')
      }

      const { interview } = await response.json()
      router.push(`/interview/${interview.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create interview')
    } finally {
      setIsCreating(false)
    }
  }

  const quickTemplates = [
    'Technical Interview Practice',
    'Behavioral Interview Practice',
    'Mock Job Interview',
    'Presentation Practice',
    'Public Speaking Practice',
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Interview
        </h1>
        <p className="text-gray-600">
          Start a new mock interview session to practice and improve your skills
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">
            Interview Details
          </h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleCreate} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Interview Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Technical Interview Practice"
              helperText="Give your interview session a descriptive name"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Templates
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickTemplates.map((template) => (
                  <button
                    key={template}
                    type="button"
                    onClick={() => setTitle(template)}
                    className="text-left px-4 py-2 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-sm"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                isLoading={isCreating}
                className="flex-1"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Interview
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Tips for Success</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Find a quiet space with good lighting</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Test your camera and microphone before starting</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Speak clearly and at a natural pace</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Use Chrome or Edge browser for best results</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
