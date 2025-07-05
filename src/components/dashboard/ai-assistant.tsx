'use client'

import { useAiAssistant } from '@/hooks/useAiAssistant'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Loader2, SendIcon, User } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'

export function AiAssistant() {
	const [messages, setMessages] = useState<
		{
			role: 'user' | 'assistant'
			content: string
		}[]
	>([])
	const [isThinking, setIsThinking] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const { mutateAsync: askAi } = useAiAssistant()

	const handleAskAi = async (message: string) => {
		const updatedMessages = [
			...messages,
			{ role: 'user' as const, content: message },
		]
		setMessages(updatedMessages)

		setIsThinking(true)

		await askAi(message)
			.then(res => {
				setMessages([
					...updatedMessages,
					{ role: 'assistant' as const, content: res.response },
				])
			})
			.finally(() => {
				setIsThinking(false)
			})
	}

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages, isThinking])

	return (
		<Card className='h-[80vh] mb-6 sticky top-6 overflow-hidden flex flex-col'>
			<CardHeader className='pb-2 flex-shrink-0'>
				<CardTitle className='flex items-center'>
					<Bot className='mr-2 h-5 w-5' /> AI-ассистент
				</CardTitle>
			</CardHeader>
			<CardContent className='flex-1 flex flex-col overflow-hidden p-4'>
				<div className='flex-1 overflow-y-auto mb-4 pr-1'>
					<div className='flex flex-col'>
						{messages.length === 0 ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className='text-center text-muted-foreground p-4'
							>
								Запитайте щось у AI-асистента
							</motion.div>
						) : (
							<>
								<AnimatePresence>
									{messages.map((message, i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											className={`mb-3 p-3 flex items-start gap-2 rounded-lg ${
												message.role === 'user'
													? 'bg-black/80 text-white ml-auto max-w-[80%] flex-row-reverse'
													: 'bg-muted text-black mr-auto max-w-[80%]'
											}`}
										>
											<div
												className={`flex-shrink-0 ${
													message.role === 'user' ? 'ml-2' : 'mr-2'
												}`}
											>
												{message.role === 'user' ? (
													<User className='h-5 w-5' />
												) : (
													<Bot className='h-5 w-5' />
												)}
											</div>
											<div className='whitespace-pre-wrap'>
												{message.content}
											</div>
										</motion.div>
									))}
									{isThinking && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.1 }}
											className='mb-3 p-3 flex items-start gap-2 rounded-lg bg-muted text-muted-foreground mr-auto max-w-[80%]'
										>
											<div className='mr-2 flex-shrink-0'>
												<Bot className='h-5 w-5' />
											</div>
											<motion.div
												className='flex items-center'
												initial={{ opacity: 0.5 }}
												animate={{ opacity: 1 }}
												transition={{
													repeat: Infinity,
													repeatType: 'reverse',
													duration: 0.8,
												}}
											>
												<Loader2 className='h-4 w-4 animate-spin mr-2' />
												<span>Думаю...</span>
											</motion.div>
										</motion.div>
									)}
								</AnimatePresence>
								<div ref={messagesEndRef} />
							</>
						)}
					</div>
				</div>
				<motion.div
					className='flex-shrink-0 mt-auto'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<form
						className='relative'
						onSubmit={(e: FormEvent<HTMLFormElement>) => {
							e.preventDefault()
							const formData = new FormData(e.target as HTMLFormElement)
							const message = formData.get('message') as string
							if (message.trim() && !isThinking) {
								handleAskAi(message)
								;(e.target as HTMLFormElement).reset()
								inputRef.current?.focus()
							}
						}}
					>
						<Input
							ref={inputRef}
							type='text'
							name='message'
							placeholder='Які найбільші відхилення у витратах?'
							disabled={isThinking}
						/>
						<Button
							className='absolute right-0 top-0 h-full rounded-l-none'
							disabled={isThinking}
							type='submit'
						>
							{isThinking ? (
								<Loader2 className='h-4 w-4 animate-spin' />
							) : (
								<SendIcon />
							)}
						</Button>
					</form>
				</motion.div>
			</CardContent>
		</Card>
	)
}
