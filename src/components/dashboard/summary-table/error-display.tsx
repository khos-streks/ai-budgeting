'use client'

interface ErrorDisplayProps {
	error: Error | unknown
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
	return (
		<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
			{error?.toString() || 'An error occurred'}
		</div>
	)
}
