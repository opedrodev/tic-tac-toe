import { BoardProps } from '@/types'

export default function Board({
    turn, socket, innerRef, handleCellClick,
}: BoardProps) {
    return (
        <section className='self-center place-self-center'>
            <h1 className='text-center mb-8 font-bold text-xl'>
                { turn === socket.id ? 'Your' : 'Opponent' }
                <span className='font-normal'>&nbsp;turn</span>
            </h1>
            <div
                className='grid grid-cols-3 w-96 h-96 gap-[1px] bg-slate-400'
                ref={ innerRef }
            >
                {
                    Array(9).fill(0).map((_, i) => (
                        <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={ i }
                            aria-hidden
                            className='bg-slate-50 text-slate-600 relative cursor-pointer flex items-center justify-center'
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
