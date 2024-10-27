import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PageContext } from "../context/PageContext";

export function ActiveWord({ realWord, typedWord, completeWord: addWord, jumpPrevWord: removeWord }:
    {
        realWord: string,
        typedWord: string,
        key: number,
        completeWord: (word: string) => void,
        jumpPrevWord: (removeWord: boolean) => void,
    }
) {
    const { isFocused, isRunning, setIsRunning } = useContext(PageContext)
    const realLetters = realWord.split('')
    const [userLetters, setUserWord] = useState<string[]>(typedWord.split(''))

    const activeWordDiv = useRef<HTMLDivElement>(null)

    const handleClick = useCallback((e: KeyboardEvent) => {
        if (!isRunning) setIsRunning(true)
        if (/^[a-zA-Z0-9,.]$/i.test(e.key)) {
            setUserWord(prevUserWord => [...prevUserWord, e.key]);
        }
        else {
            switch (e.code) {
                case 'Space': {
                    setUserWord(prevUserWord => {
                        if (prevUserWord.length)
                            addWord(prevUserWord.join(''));
                        return [];
                    });
                    break;
                }
                case 'Backspace': {
                    setUserWord(prevUserWord => {
                        if (prevUserWord.length) {
                            if (e.ctrlKey)
                                return [];
                            else
                                return prevUserWord.slice(0, -1);
                        } else
                            removeWord(e.ctrlKey);
                        return prevUserWord;
                    });
                }
            }
        }
    }, [addWord, removeWord, isRunning, setIsRunning])

    useEffect(() => {
        if (isFocused) {
            document.addEventListener('keydown', handleClick)
        }
        return () =>
            document.removeEventListener('keydown', handleClick)
    }, [handleClick, isFocused]);

    useEffect(() => {
        requestAnimationFrame(() => {
            if (activeWordDiv) {
                activeWordDiv.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
        })
    })
    return (
        < div ref={activeWordDiv} className={'inline-flex items-baseline h-8'}>
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
                    text-[2.6rem] text-yellow-200 left-full text-center
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
            className = 'text-gray-100'
            break
        }
    }
    return <div className={className}>{letter}</div>;
}
