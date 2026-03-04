'use client'

import {
  FiX,
  FiMail,
  FiPhone,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiBook,
  FiUser,
  FiMessageSquare,
  FiInfo,
} from 'react-icons/fi'

export interface Lead {
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

interface LeadDetailModalProps {
  lead: Lead | null
  onClose: () => void
  onStatusChange?: (id: string, status: string) => void
  updatingStatus?: boolean
}

function InfoBlock({
  icon: Icon,
  label,
  value,
  href,
  type = 'text',
}: {
  icon: React.ElementType
  label: string
  value: string | null | undefined
  href?: string
  type?: 'text' | 'link' | 'tel'
}) {
  if (!value) return null

  const content = type === 'tel' ? (
    <a
      href={`tel:${String(value).replace(/\s/g, '')}`}
      className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
    >
      {value}
    </a>
  ) : type === 'link' && href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline break-all"
    >
      {value}
    </a>
  ) : (
    <span className="text-gray-900">{value}</span>
  )

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-50 transition-colors">
      <div className="p-2 rounded-lg bg-white border border-gray-100 shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
        <div className="text-sm">{content}</div>
      </div>
    </div>
  )
}

function SectionBlock({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10">
          <Icon className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export function LeadDetailModal({ lead, onClose, onStatusChange, updatingStatus }: LeadDetailModalProps) {
  if (!lead) return null

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })
  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const hasAvailability =
    lead.daysFreeFrom || lead.whichDays || lead.preferredTime
  const hasEnrollment =
    lead.enrollmentType || lead.preferredSchedule || lead.hasAppliedForTest != null || lead.testDate
  const hasOther = lead.howDidYouHear || lead.additionalNotes

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 rounded-t-2xl p-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{lead.fullName}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg border ${
                  SOURCE_COLORS[lead.source] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {lead.source.replace(/-/g, ' ')}
              </span>
              <span
                className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg border ${
                  STATUS_COLORS[lead.status] || 'bg-gray-100'
                }`}
              >
                {lead.status}
              </span>
              <span className="text-xs text-gray-500">{formatDateTime(lead.createdAt)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact - primary block with callable links */}
          <SectionBlock title="Contact" icon={FiUser}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100">
                <div className="p-2 rounded-lg bg-white border border-emerald-100 shrink-0">
                  <FiMail className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline break-all"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100">
                <div className="p-2 rounded-lg bg-white border border-emerald-100 shrink-0">
                  <FiPhone className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  <a
                    href={`tel:${lead.phone.replace(/\s/g, '')}`}
                    className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                  >
                    {lead.phone}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <a
                href={`mailto:${lead.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <FiMail className="w-5 h-5" /> Email
              </a>
              <a
                href={`tel:${lead.phone.replace(/\s/g, '')}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <FiPhone className="w-5 h-5" /> Call
              </a>
            </div>
          </SectionBlock>

          {/* Availability */}
          {hasAvailability && (
            <SectionBlock title="Availability" icon={FiCalendar}>
              {lead.daysFreeFrom && (
                <InfoBlock
                  icon={FiCalendar}
                  label="Days free"
                  value={`${formatDate(lead.daysFreeFrom)}${lead.daysFreeTo ? ` – ${formatDate(lead.daysFreeTo)}` : ''}`}
                />
              )}
              {lead.whichDays && <InfoBlock icon={FiMapPin} label="Which days" value={lead.whichDays} />}
              {lead.preferredTime && <InfoBlock icon={FiClock} label="Preferred time" value={lead.preferredTime} />}
            </SectionBlock>
          )}

          {/* Enrollment details */}
          {hasEnrollment && (
            <SectionBlock title="Enrollment details" icon={FiBook}>
              {lead.enrollmentType && (
                <InfoBlock icon={FiBook} label="Enrollment type" value={lead.enrollmentType} />
              )}
              {lead.preferredSchedule && (
                <InfoBlock icon={FiClock} label="Preferred schedule" value={lead.preferredSchedule} />
              )}
              {lead.hasAppliedForTest != null && (
                <InfoBlock
                  icon={FiInfo}
                  label="Applied for test"
                  value={lead.hasAppliedForTest ? 'Yes' : 'No'}
                />
              )}
              {lead.testDate && (
                <InfoBlock icon={FiCalendar} label="Test date" value={formatDate(lead.testDate)} />
              )}
            </SectionBlock>
          )}

          {/* How did you hear / Notes */}
          {hasOther && (
            <SectionBlock title="Additional info" icon={FiMessageSquare}>
              {lead.howDidYouHear && (
                <InfoBlock icon={FiInfo} label="How did you hear about us" value={lead.howDidYouHear} />
              )}
              {lead.additionalNotes && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Additional notes
                  </p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{lead.additionalNotes}</p>
                </div>
              )}
            </SectionBlock>
          )}

          {/* Status update */}
          {onStatusChange && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Update status</h3>
              <select
                value={lead.status}
                onChange={(e) => onStatusChange(lead.id, e.target.value)}
                disabled={updatingStatus}
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none ${
                  STATUS_COLORS[lead.status] || 'bg-white'
                }`}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
