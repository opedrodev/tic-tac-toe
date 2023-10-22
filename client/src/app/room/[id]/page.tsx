/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

'use client'

import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import useSocket from '@/hooks/useSocket'

type Message = {
    roomId: string
    userId: string
    message: string
}

export default function Room() {
    const socket = useSocket()
    const { id } = useParams<{ id: string }>()
    const [users, setUsers] = useState<string[]>([])
    const [turn, setTurn] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState<string>('')
    const [playerWon, setPlayerWon] = useState<string>('')

    const sectionRef = useRef<HTMLDivElement>(null)

    function updateBoard(board: string[]) {
        if (!sectionRef.current) return
        const cells = Array.from(sectionRef.current!.childNodes)
        cells.forEach((e, i) => {
            e.childNodes[0].textContent = board[i]
        })
    }

    useEffect(() => {
        socket.on('connect', () => {
            setUsers((users) => [...users, socket.id])
            socket.emit('join-room', { roomId: id, userId: socket.id })
        })

        socket.on('user-connected', (id: string, room: string[]) => {
            setUsers(room)
            setTurn(id)
        })

        socket.on('user-disconnected', (id, room: string[]) => {
            setUsers(room)
        })

        socket.on('receive-message', ({ roomId, userId, message }: Message) => {
            setMessages((messages) => [...messages, { roomId, userId, message }])
        })

        socket.on('cell-clicked', ({ cells, turn: t }: { roomId: string, userId: string, cells: string[], turn: string }) => {
            updateBoard(cells)
            setTurn(t)
        })

        socket.on('player-won', (id: string) => {
            console.log(id)
            setPlayerWon(id)
        })

        return () => {
            socket.off('user-connected')
            socket.off('user-disconnected')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!input || input.length === 0) return
        const formData = new FormData(event.currentTarget)
        const message = formData.get('msg') as string
        socket.emit('send-message', { roomId: id, userId: socket.id, message })
        setInput('')
    }

    function handleCellClick(cell: number) {
        if (turn !== socket.id) return

        const board = sectionRef.current?.childNodes
        if (!board) return

        if (board[cell].childNodes[0].textContent) return

        board[cell].childNodes[0].textContent = users[0] === socket.id ? 'O' : 'X'

        const combinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [0, 4, 8],
            [2, 5, 8],
            [2, 4, 6],
        ]

        const playerX: any[] = []
        const playerO: any[] = []

        board!.forEach((e, i) => {
            if (e.textContent === 'X') playerX.push(i)
            if (e.textContent === 'O') playerO.push(i)
        })

        combinations.forEach(([i, j, k]) => {
            if (playerX.includes(i) && playerX.includes(j) && playerX.includes(k)) {
                console.log('player X wins')
                socket.emit('player-won', { roomId: id, userId: socket.id })
            }

            if (playerO.includes(i) && playerO.includes(j) && playerO.includes(k)) {
                console.log('player O wins')
                socket.emit('player-won', { roomId: id, userId: socket.id })
            }

            if (playerX.length === 5) {
                console.log('draw')
            }
        })

        const cells = Array.from(board).map((e) => e.textContent)

        socket.emit('cell-click', {
            roomId: id, userId: socket.id, cells, turn: users.find((user) => user !== socket.id),
        })
    }

    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <main className='grid grid-cols-[400px,1fr] h-screen'>
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
                                    <p className={ `${userId === socket.id ? 'text-end' : 'text-start'} text-xs font-bold mb-1` }>{ userId === socket.id ? 'You' : 'Opponent' }</p>
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
                        value={ input }
                        onChange={ (e) => setInput(e.target.value) }
                        placeholder='Type a message...'
                    />
                </form>
            </section>

            {
                playerWon ? (
                    <div className='self-center place-self-center'>
                        <h1 className='font-bold text-4xl'>
                            { playerWon === socket.id ? 'You' : 'Opponent' }
                            &nbsp;won
                        </h1>
                    </div>
                ) : (
                    <section className='self-center place-self-center'>
                        <h1 className='text-center mb-8 font-bold text-xl'>
                            { turn === socket.id ? 'Your' : 'Opponent' }
                            <span className='font-normal'>&nbsp;turn</span>
                        </h1>
                        <div
                            className='grid grid-cols-3 w-96 h-96 gap-[1px] bg-slate-400'
                            ref={ sectionRef }
                        >
                            {
                                Array(9).fill(0).map((_, i) => (
                                    <div
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={ i }
                                        aria-hidden
                                        className='bg-slate-50 text-black relative cursor-pointer flex items-center justify-center'
                                        onClick={ () => handleCellClick(i) }
                                    >
                                        <p className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-4xl' />
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                )
            }

        </main>
    )
}
