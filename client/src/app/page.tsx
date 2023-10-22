'use client'

import { v4 } from 'uuid'
import { useRouter } from 'next/navigation'

export default function Home() {
    const navigate = useRouter()

    function createRoom() {
        const roomId = v4()
        console.log('create room')
        navigate.push(`/room/${roomId}`)
    }

    function joinRoom() {
        console.log('join room')
    }

    return (
        <main className='h-full grid place-content-center'>
            <h1 className='text-2xl font-bold mb-16 text-center'>Tic Tac Toe - Multiplayer</h1>
            <section className='flex justify-center gap-8'>
                <button
                    className='w-48 h-48 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-100 transition'
                    type='button'
                    onClick={ createRoom }
                >
                    Create Room
                </button>

                <button
                    className='w-48 h-48 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-50 disabled:hover:border-slate-200'
                    type='button'
                    onClick={ joinRoom }
                    disabled
                >
                    Join room
                </button>
            </section>
        </main>
    )
}
