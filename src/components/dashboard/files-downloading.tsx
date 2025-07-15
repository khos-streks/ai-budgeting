'use client'

import { useDownloadFile, useFiles } from '@/hooks/useBudgeting'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { DownloadIcon, Loader2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function FilesDownloading() {
	const { data, isLoading: isFilesLoading, isError: isFilesError } = useFiles()
	const queryClient = useQueryClient()

	const [downloadingFile, setDownloadingFile] = useState<string | null>(null)

	const {
		data: downloadedBlob,
		isLoading: isDownloading,
		isError: isDownloadError,
	} = useDownloadFile(downloadingFile)

	useEffect(() => {
		if (
			downloadingFile &&
			downloadedBlob instanceof Blob &&
			!isDownloading &&
			!isDownloadError
		) {
			const url = URL.createObjectURL(downloadedBlob)
			const a = document.createElement('a')
			a.href = url
			a.download = downloadingFile
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
			setDownloadingFile(null)
		}
	}, [downloadedBlob, isDownloading, isDownloadError, downloadingFile])

	const handleDownload = (fileName: string) => {
		setDownloadingFile(fileName)
		queryClient.invalidateQueries({ queryKey: ['download file', fileName] })
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Завантаження файлів</CardTitle>
			</CardHeader>
			<CardContent>
				{isFilesLoading ? (
					<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
						<Loader2 className='w-4 h-4 animate-spin' />
						<span>Завантаження списку файлів...</span>
					</div>
				) : isFilesError ? (
					<div className='text-sm text-destructive flex items-center space-x-2'>
						<XCircle className='w-4 h-4' />
						<span>Помилка при завантаженні списку файлів.</span>
					</div>
				) : data && data.files.length > 0 ? (
					<ul className='space-y-2'>
						{downloadingFile && isDownloading && (
							<div className='text-sm text-muted-foreground mb-2'>
								Завантаження файлу <strong>{downloadingFile}</strong>...
							</div>
						)}
						{isDownloadError && (
							<div className='text-sm text-destructive mb-2'>
								Помилка при завантаженні файлу{' '}
								<strong>{downloadingFile}</strong>.
							</div>
						)}
						{data.files.map((fileName: string) => (
							<li
								key={fileName}
								className='border rounded-md p-2 flex items-center justify-between'
							>
								<span className='truncate pr-2'>{fileName}</span>
								<Button
									variant='outline'
									size='icon'
									disabled={isDownloading && downloadingFile === fileName}
									onClick={() => handleDownload(fileName)}
								>
									{isDownloading && downloadingFile === fileName ? (
										<Loader2 className='w-4 h-4 animate-spin' />
									) : (
										<DownloadIcon className='w-4 h-4' />
									)}
								</Button>
							</li>
						))}
					</ul>
				) : (
					<span className='text-sm text-muted-foreground'>Файли відсутні.</span>
				)}
			</CardContent>
		</Card>
	)
}
