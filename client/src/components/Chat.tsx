import { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import { useParams } from 'next/navigation'
import { Message } from '@/types'

export default function Chat({ messages, socket }: { messages: Message[], socket: Socket }) {
    const { id } = useParams<{ id: string }>()
    const [message, setMessage] = useState<string>('')
    const bottomRef = useRef<HTMLDivElement>(null)

    function handleSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!message || message.length === 0 || message.trim().length === 0) return
        socket.emit('send-message', { roomId: id, userId: socket.id, message })
        setMessage('')
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <section className='w-full bg-slate-100 border-r border-r-slate-200 relative grid grid-rows-[auto,1fr,81px]'>
            <p className='text-center py-4 font-bold border-b border-b-slate-200'>CHAT</p>

            <div className='h-full overflow-y-scroll'>
                <div className='p-4 h-[500px]'>
                    {
                        messages.map(({ roomId, userId, message }) => (
                            <div
                                key={ `${roomId}-${userId}-${message}` }
                                className='mb-2 flex flex-col rounded-lg px-4 py-2'
                            >
                                <p className={ `${userId === socket.id ? 'text-end' : 'text-start'} text-xs font-bold mb-1` }>
                                    { userId === socket.id ? 'You' : 'Opponent' }
                                </p>

                                <div className={ `${userId === socket.id ? 'ml-auto' : 'mr-auto'} w-fit bg-slate-200 rounded-lg px-4 py-2` }>
                                    <p>{ message }</p>
                                </div>
                            </div>
                        ))
                    }
                    <div ref={ bottomRef } />
                </div>
            </div>

            <form
                className='absolute bottom-0 left-0 w-full border-t border-t-slate-200 p-4 '
                onSubmit={ handleSubmitMessage }
            >
                <input
                    className='w-full h-12 px-6 py-4 rounded-lg bg-slate-200 active:outline-none focus:outline-none'
                    type='text'
                    name='msg'
                    id='msg'
                    value={ message }
                    onChange={ (e) => setMessage(e.target.value) }
                    placeholder='Type a message...'
                />
            </form>
        </section>
    )
}
