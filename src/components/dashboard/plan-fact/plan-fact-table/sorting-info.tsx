'use client'

import { AlertTriangle } from 'lucide-react'

export function SortingInfo() {
	return (
		<div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
			<div className='flex items-start gap-2'>
				<AlertTriangle className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
				<div className='text-sm text-blue-800'>
					<strong>Сортування:</strong> Дані в Excel файлі автоматично
					відсортовані за відхиленням (від найбільшого до найменшого).
					Використовуйте фільтри для зменшення обсягу даних та швидкого пошуку
					потрібної інформації.
				</div>
			</div>
		</div>
	)
}
