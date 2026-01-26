'use client'

import React, { useState } from 'react'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { FiX } from 'react-icons/fi'

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ email: string; password: string } | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create student')
        setLoading(false)
        return
      }

      // Success - show credentials before closing
      setSuccess({
        email: formData.email,
        password: formData.password
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        emergencyContact: '',
      })
      
      // Refresh student list
      onSuccess()
      
      // Auto-close after 5 seconds or let user close manually
      setTimeout(() => {
        setSuccess(null)
        onClose()
      }, 5000)
    } catch (error: any) {
      console.error('Create student error:', error)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setError(null)
      setSuccess(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Student Account</h2>
            <p className="text-sm text-gray-600 mt-1">Create login credentials for a new student</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="p-6">
            <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="text-lg font-bold text-green-900 mb-4">✅ Student Account Created Successfully!</h3>
              <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Login Credentials:</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Email (Username):</span>
                    <p className="text-base font-mono font-semibold text-gray-900 bg-gray-50 p-2 rounded mt-1">
                      {success.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Password:</span>
                    <p className="text-base font-mono font-semibold text-gray-900 bg-gray-50 p-2 rounded mt-1">
                      {success.password}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Share these credentials with the student. They can use them to sign in at the login page.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={handleClose}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You are creating login credentials for this student. They will use their email address as their username to sign in.
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name *"
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Smith"
              required
              disabled={loading}
            />

            <Input
              label="Email Address (Username) *"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john.smith@example.com"
              required
              disabled={loading}
            />

            <Input
              label="Password *"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min. 8 characters"
              required
              disabled={loading}
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="+44 7700 900000"
              disabled={loading}
            />

            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              disabled={loading}
            />

            <Input
              label="Emergency Contact"
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="Name: +44 7700 900000"
              disabled={loading}
            />
          </div>

          <div className="col-span-2">
            <Input
              label="Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main Street, London, UK"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Student'}
            </Button>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}
