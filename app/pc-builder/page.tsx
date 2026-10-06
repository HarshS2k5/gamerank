import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PCBuilderMain } from '@/components/pc-builder/PCBuilderMain'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const metadata: Metadata = {
  title: 'Advanced PC Builder & Performance Planner | TechForge',
  description:
    'Design your dream custom gaming PC. Check real-time hardware compatibility, estimate FPS across 50+ games, calculate PSU power requirements, and compare component benchmarks in INR (₹) and USD ($).',
  keywords: [
    'PC Builder',
    'Custom PC',
    'PC Part Picker India',
    'Gaming PC Builder',
    'Component Compatibility Checker',
    'FPS Estimator',
    'PSU Calculator',
    'Bottleneck Calculator',
    'GameRank',
  ],
  openGraph: {
    title: 'Advanced PC Builder & Performance Planner | GameRank TechForge',
    description:
      'Real-time component compatibility, game FPS simulation, power consumption calculator, and side-by-side hardware comparison.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function PCBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <PCBuilderMain />
    </Suspense>
  )
}
