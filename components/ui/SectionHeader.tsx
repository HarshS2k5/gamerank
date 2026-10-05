import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  viewAllHref?: string
  viewAllLabel?: string
  icon?: string
}

export function SectionHeader({ title, subtitle, viewAllHref, viewAllLabel = 'View All', icon }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="section-heading flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-[#00ff88] hover:text-[#00e87a] transition-colors text-sm font-medium shrink-0 mb-8"
        >
          {viewAllLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}
