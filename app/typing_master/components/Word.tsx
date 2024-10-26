import { useCallback, useEffect, useRef, useState } from "react";

export function ActiveWord({ word, userWordString, addWord, removeWord }:
    {
        word: string,
        userWordString: string,
        key: number,
        addWord: (word: string) => void,
        removeWord: (removeWord: boolean) => void,
    }
) {
    const userTypedWord = userWordString.split('')
    const realWord = word.split('')
    const [userWord, setUserWord] = useState<string[]>(userTypedWord)
    console.log(userWord)
    const activeWordDiv = useRef<HTMLDivElement>(null)

    const handleClick = useCallback((e: KeyboardEvent) => {
        if (/^[a-zA-Z0-9,.]$/i.test(e.key)) {
            setUserWord([...userWord, e.key])
        }
        else {
            switch (e.code) {
                case 'Space': {
                    if (userWord.length)
                        addWord(userWord.join(''))
                    break;
                }
                case 'Backspace': {
                    if (userWord.length) {
                        if (e.ctrlKey == true) {
                            setUserWord([])
                        } else {
                            setUserWord(userWord.slice(0, Math.max(userWord.length - 1, 0)))
                        }
                    } else
                        if (e.ctrlKey == true)
                            removeWord(true)
                        else
                            removeWord(false)
                    break;
                }
            }
        }
    }, [addWord, removeWord, userWord])

    useEffect(() => {
        document.addEventListener('keydown', handleClick)
        return () => document.removeEventListener('keydown', handleClick)
    }, [handleClick, userWord]);

    useEffect(() => {
        requestAnimationFrame(() => {
            if (activeWordDiv) {
                activeWordDiv.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
        })
    }, [userWord])
    return (
        < div ref={activeWordDiv} className={'inline-flex items-baseline h-8'}>
            <div className="inline-flex relative h-full items-baseline ">
                {
                    userWord.map((letter, idx) => {
                        if (idx < realWord.length)
                            return (<Letter
                                key={idx}
                                letter={realWord[idx]}
                                type={realWord[idx] === userWord[idx] ? 'correct' : 'incorrect'}
                            />);
                        else
                            return <Letter type={'incorrect'} letter={letter} key={idx} />
                    }
                    )
                } {/* animate-blink */}
                <div key={'cursor'} className={` animate-blink absolute z-100 
                    text-[2.6rem] text-yellow-200 left-full text-center
                    pointer-events-none`} >
                |
                </div>

            </div>
            {
                userWord.length < realWord.length &&
                Array.from(realWord.slice(userWord.length,)).map((letter, idx) => {
                    return <Letter type={'active'} letter={letter} key={idx} />
                })
            }
        </div >
    )
}

export function InactiveWord({ word, key }: { word: string, key: number }) {
    const wordList = Array.from(word)
    return (
        <div className={'inline-flex'} key={key}>
            {
                wordList.map((letter, idx) =>
                    <Letter key={idx} letter={letter} type="inactive" />)}
        </div>
    )
}

export function TypedWord({ userWord, realWord, key }: { userWord: string, realWord: string, key: number }) {
    const realList = Array.from(realWord)
    const extendedList = [
        ...Array.from(userWord),
        ...Array(Math.max(realList.length - userWord.length, 0)).fill('')
    ];
    return (
        <div className={'inline-flex'} key={key}>
            {extendedList.map((letter: string, idx: number) => {
                if (idx >= realWord.length)
                    return <Letter key={idx} letter={letter} type="incorrect" />
                if (letter == realWord[idx])
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
            className = 'text-gray-50'
            break
        }
    }
    return <div className={className}>{letter}</div>;
}
