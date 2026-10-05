import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Failed to load game data. Please try again.',
  onRetry
}: ErrorStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-gray-400 text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-secondary flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export function EmptyState({ message = 'No games found.' }: { message?: string }) {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <p className="text-gray-500">{message}</p>
    </div>
  )
}
