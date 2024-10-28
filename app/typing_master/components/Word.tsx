import { Ref } from "react";

export function ActiveWord({ realLetters, userLetters, activeWordRef }:
    {
        realLetters: string[],
        userLetters: string[],
        activeWordRef: Ref<HTMLDivElement>
    }
) {
    return (
        < div ref={activeWordRef} className={'inline-flex items-baseline h-8'}>
            <div className="inline-flex relative h-full items-baseline ">
                {
                    userLetters.map((letter, idx) => {
                        if (idx < realLetters.length)
                            return (<Letter
                                key={idx}
                                letter={realLetters[idx]}
                                type={realLetters[idx] === userLetters[idx] ? 'correct' : 'incorrect'}
                            />);
                        else
                            return <Letter type={'incorrect'} letter={letter} key={idx} />
                    }
                    )
                } {/* animate-blink */}
                <div key={'cursor'} className={`animate-blink absolute z-100 
                    text-yellow-200 left-full text-center
                    pointer-events-none`} >
                    |
                </div>

            </div>
            {
                userLetters.length < realLetters.length &&
                Array.from(realLetters.slice(userLetters.length,)).map((letter, idx) => {
                    return <Letter type={'active'} letter={letter} key={idx} />
                })
            }
        </div >
    )
}

export function InactiveWord({ word }: { word: string }) {
    const wordList = Array.from(word)
    return (
        <div className={'inline-flex'}>
            {
                wordList.map((letter, idx) =>
                    <Letter key={idx} letter={letter} type="inactive" />)}
        </div>
    )
}

export function TypedWord({ userWord, realWord }: { userWord: string, realWord: string }) {
    const realList = Array.from(realWord)
    const extendedList = [
        ...Array.from(userWord),
        ...Array(Math.max(realList.length - userWord.length, 0)).fill('')
    ];
    return (
        <div className={'inline-flex'}>
            {extendedList.map((letter: string, idx: number) => {
                if (idx >= realWord.length)
                    return <Letter key={idx} letter={letter} type="incorrect" />
                if (letter == '')
                    return <Letter key={idx} letter={realWord[idx]} type="inactive" />
                else if (letter == realWord[idx])
                    return <Letter key={idx} letter={letter} type="correct" />
                else
                    return <Letter key={idx} letter={realWord[idx]} type="incorrect" />

            })}
        </div>
    )
}

export function Letter({ letter, type }: { letter: string, type: 'correct' | 'incorrect' | 'inactive' | 'active' }) {
    let className = ''
    switch (type) {
        case 'correct': {
            className = 'text-green-300'
            break
        }
        case 'incorrect': {
            className = 'text-red-300'
            break
        }
        case 'inactive': {
            className = 'text-gray-300'
            break
        }
        case 'active': {
            className = 'text-gray-100'
            break
        }
    }
    return <div className={className}>{letter}</div>;
}
