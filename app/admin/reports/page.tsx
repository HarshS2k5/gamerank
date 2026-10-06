import { Metadata } from 'next'
import { AdminReportsDashboard } from '@/components/report/AdminReportsDashboard'

export const metadata: Metadata = {
  title: 'Reports & Feedback Triage Desk | GameRank Admin',
  description: 'Internal administrator console for reviewing submitted bug reports, component specs, and feedback.',
  robots: { index: false, follow: false },
}

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] py-6">
      <AdminReportsDashboard />
    </div>
  )
}
