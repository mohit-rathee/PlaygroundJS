import { Ref } from "react";

export function ActiveWord({ realLetters, userLetters, activeWordRef, cursorRef }:
    {
        realLetters: string[],
        userLetters: string[],
        activeWordRef: Ref<HTMLDivElement>
        cursorRef: Ref<HTMLDivElement>
    }
) {
    return (
        < div ref={activeWordRef} className={'relative inline-flex px-1 items-baseline h-full'}>
            <div className="inline-flex ">
                {
                    userLetters.map((letter, idx) => {
                        if (idx < realLetters.length)
                            return (<Letter
                                key={idx}
                                letter={realLetters[idx]}
                                type={realLetters[idx] === userLetters[idx] ?
                                    'correct' :
                                    'incorrect'
                                }
                            />);
                        else
                            return <Letter type={'incorrect'} letter={letter} key={idx} />
                    })}
            </div>
            <div ref={cursorRef} className="" />
            <div className="inline-flex relative h-full">
                {userLetters.length < realLetters.length &&
                    Array.from(realLetters.slice(userLetters.length,))
                        .map((letter, idx) => {
                            return <Letter type={'active'} letter={letter} key={idx} />
                        })
                }
            </div>
        </div >
    )
}

export function InactiveWord({ word }: { word: string }) {
    const wordList = Array.from(word)
    return (
        <div className={'inline-flex px-1'}>
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
        <div className={'inline-flex px-1'}>
            {extendedList.map((letter: string, idx: number) => {
                if (idx >= realWord.length)
                    return <Letter key={idx} letter={letter} type="incorrect" />
                if (letter == '')
                    return <Letter key={idx} letter={realWord[idx]} type="incomplete" />
                else if (letter == realWord[idx])
                    return <Letter key={idx} letter={letter} type="correct" />
                else
                    return <Letter key={idx} letter={realWord[idx]} type="incorrect" />

            })}
        </div>
    )
}

export function Letter({ letter, type }: { letter: string, type: 'correct' | 'incorrect' | 'inactive' | 'active' | 'incomplete' }) {
    let className = 'pl-0.5 '
    switch (type) {
        case 'incomplete': {
            className += 'dark:text-gray-200 text-gray-500 underline decoration-3 dark:decoration-red-400 decoration-red-600'
            break
        }
        case 'correct': {
            className += 'dark:text-green-300 text-gray-700  '
            break
        }
        case 'incorrect': {
            className += 'dark:text-red-400   text-red-600'
            break
        }
        case 'inactive': {
            className += 'dark:text-gray-300  text-gray-200 '
            break
        }
        case 'active': {
            className += 'dark:text-gray-300  text-gray-200 '
            break
        }
    }
    return <div className={className}>{letter}</div>;
}
