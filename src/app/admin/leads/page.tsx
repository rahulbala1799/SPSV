'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import {
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi'

interface Lead {
  id: string
  source: string
  fullName: string
  email: string
  phone: string
  daysFreeFrom: string | null
  daysFreeTo: string | null
  whichDays: string | null
  preferredTime: string | null
  enrollmentType: string | null
  preferredSchedule: string | null
  hasAppliedForTest: boolean | null
  testDate: string | null
  howDidYouHear: string | null
  additionalNotes: string | null
  status: string
  notes: string | null
  createdAt: string
}

const SOURCE_COLORS: Record<string, string> = {
  enrollment: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  timetable: 'bg-blue-100 text-blue-800 border-blue-200',
  'success-stories': 'bg-purple-100 text-purple-800 border-purple-200',
  'test-guide': 'bg-amber-100 text-amber-800 border-amber-200',
  contact: 'bg-gray-100 text-gray-800 border-gray-200',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-amber-100 text-amber-800 border-amber-200',
  contacted: 'bg-blue-100 text-blue-800 border-blue-200',
  converted: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function LeadsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const checkAdminAndFetch = async () => {
    try {
      const adminCheck = await fetch('/api/admin/check')
      const adminData = await adminCheck.json()
      if (!adminData.authenticated || !adminData.isAdmin) {
        router.push('/login')
        return
      }
      setCurrentUser(adminData.user)
      await fetchLeads()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (sourceFilter !== 'all') params.set('source', sourceFilter)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      const res = await fetch(`/api/admin/leads?${params}`)
      const data = await res.json()
      if (res.ok) setLeads(data.leads || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  useEffect(() => {
    checkAdminAndFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchLeads(), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sourceFilter, statusFilter])

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) await fetchLeads()
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })

  if (loading) {
    return (
      <AdminLayout user={currentUser}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading leads...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout user={currentUser}>
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Leads</h1>
          <p className="text-gray-600">Website enquiries and enrollment requests ({leads.length} total)</p>
        </div>

        {/* Filters - responsive */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none appearance-none bg-white"
                >
                  <option value="all">All sources</option>
                  <option value="enrollment">Enrollment</option>
                  <option value="timetable">Timetable</option>
                  <option value="success-stories">Success Stories</option>
                  <option value="test-guide">Test Guide</option>
                  <option value="contact">Contact</option>
                </select>
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none bg-white"
              >
                <option value="all">All status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop: Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {leads.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-2">No leads found</p>
              <p className="text-sm text-gray-500">Leads will appear when users submit the enquiry form</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Phone</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Source</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <>
                      <tr
                        key={lead.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(lead.createdAt)}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{lead.fullName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{lead.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg border ${SOURCE_COLORS[lead.source] || 'bg-gray-100 text-gray-700'}`}>
                            {lead.source.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={lead.status}
                            onChange={(e) => { e.stopPropagation(); updateStatus(lead.id, e.target.value); }}
                            onClick={(e) => e.stopPropagation()}
                            disabled={updatingId === lead.id}
                            className={`text-xs font-medium rounded-lg border px-2 py-1 cursor-pointer ${STATUS_COLORS[lead.status] || 'bg-gray-100'}`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <a href={`mailto:${lead.email}`} className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600" title="Email">
                              <FiMail className="w-4 h-4" />
                            </a>
                            <a href={`tel:${lead.phone.replace(/\s/g, '')}`} className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600" title="Call">
                              <FiPhone className="w-4 h-4" />
                            </a>
                            {expandedId === lead.id ? <FiChevronUp className="w-5 h-5 text-gray-400" /> : <FiChevronDown className="w-5 h-5 text-gray-400" />}
                          </div>
                        </td>
                      </tr>
                      {expandedId === lead.id && (
                        <tr key={`${lead.id}-detail`} className="bg-gray-50/80">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {lead.daysFreeFrom && <p><span className="text-gray-500">Days free:</span> {formatDate(lead.daysFreeFrom)} – {lead.daysFreeTo ? formatDate(lead.daysFreeTo) : '—'}</p>}
                              {lead.whichDays && <p><span className="text-gray-500">Which days:</span> {lead.whichDays}</p>}
                              {lead.preferredTime && <p><span className="text-gray-500">Preferred time:</span> {lead.preferredTime}</p>}
                              {lead.additionalNotes && <p className="md:col-span-2"><span className="text-gray-500">Notes:</span> {lead.additionalNotes}</p>}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile: Cards */}
        <div className="lg:hidden space-y-4">
          {leads.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-2">No leads found</p>
              <p className="text-sm text-gray-500">Leads will appear when users submit the enquiry form</p>
            </div>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div
                  className="p-4 flex flex-col gap-2"
                  onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{lead.fullName}</p>
                      <p className="text-sm text-gray-600">{lead.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-lg border ${SOURCE_COLORS[lead.source] || 'bg-gray-100'}`}>
                        {lead.source.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-lg border ${STATUS_COLORS[lead.status] || 'bg-gray-100'}`}>
                        {lead.status}
                      </span>
                      {expandedId === lead.id ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{formatDate(lead.createdAt)}</p>
                  <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                    <a href={`mailto:${lead.email}`} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                      <FiMail className="w-4 h-4" /> Email
                    </a>
                    <a href={`tel:${lead.phone.replace(/\s/g, '')}`} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                      <FiPhone className="w-4 h-4" /> Call
                    </a>
                  </div>
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    disabled={updatingId === lead.id}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full mt-2 px-3 py-2 text-sm rounded-lg border ${STATUS_COLORS[lead.status] || 'bg-gray-100'}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                {expandedId === lead.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                    <p className="text-sm text-gray-600"><span className="text-gray-500">Phone:</span> {lead.phone}</p>
                    {lead.daysFreeFrom && <p className="text-sm text-gray-600"><span className="text-gray-500">Days free:</span> {formatDate(lead.daysFreeFrom)} – {lead.daysFreeTo ? formatDate(lead.daysFreeTo) : '—'}</p>}
                    {lead.whichDays && <p className="text-sm text-gray-600"><span className="text-gray-500">Which days:</span> {lead.whichDays}</p>}
                    {lead.preferredTime && <p className="text-sm text-gray-600"><span className="text-gray-500">Time:</span> {lead.preferredTime}</p>}
                    {lead.additionalNotes && <p className="text-sm text-gray-600 mt-2"><span className="text-gray-500">Notes:</span> {lead.additionalNotes}</p>}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
