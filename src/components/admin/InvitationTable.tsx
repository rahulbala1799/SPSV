'use client'

import { FaEnvelope, FaUser, FaClock, FaCheckCircle, FaTimes } from 'react-icons/fa'

interface Invitation {
  id: string
  email: string
  token: string
  role: string
  expiresAt: Date
  acceptedAt: Date | null
  createdAt: Date
  inviter: {
    name: string | null
    email: string
  }
}

interface InvitationTableProps {
  invitations: Invitation[]
}

export function InvitationTable({ invitations }: InvitationTableProps) {
  const getInviteLink = (token: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/invite/${token}`
    }
    return ''
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Invitation link copied to clipboard!')
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invited By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invite Link
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invitations.map((invitation) => {
              const isExpired = new Date() > new Date(invitation.expiresAt)
              const isAccepted = invitation.acceptedAt !== null
              const inviteLink = getInviteLink(invitation.token)

              return (
                <tr key={invitation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {invitation.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invitation.role === 'SUPER_ADMIN'
                        ? 'bg-red-100 text-red-800'
                        : invitation.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {invitation.role === 'SUPER_ADMIN' ? 'Super Admin' : invitation.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaUser className="text-xs" />
                      {invitation.inviter.name || invitation.inviter.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {!isAccepted && !isExpired ? (
                      <button
                        onClick={() => copyToClipboard(inviteLink)}
                        className="text-xs text-green-600 hover:text-green-700 underline"
                      >
                        Copy Link
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaClock className="text-xs" />
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isAccepted ? (
                      <span className="flex items-center gap-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <FaCheckCircle />
                        Accepted
                      </span>
                    ) : isExpired ? (
                      <span className="flex items-center gap-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        <FaTimes />
                        Expired
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {invitations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No invitations found
        </div>
      )}
    </div>
  )
}
