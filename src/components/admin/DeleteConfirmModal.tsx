'use client'

import React from 'react'
import { Button } from '@/components/Button'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

interface DeleteConfirmModalProps {
  isOpen: boolean
  studentName: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function DeleteConfirmModal({
  isOpen,
  studentName,
  onConfirm,
  onCancel,
  loading = false
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <FiAlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete student <strong>{studentName}</strong>? This action
            cannot be undone and will permanently remove all student data including their account,
            progress, and enrollment records.
          </p>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onConfirm}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Deleting...' : 'Delete Student'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
