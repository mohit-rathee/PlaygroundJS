import { useCallback, useEffect, useState } from "react";

export function ActiveWord({ word, userWordString, key, addWord/* , removeWord */ }:
    {
        word: string,
        userWordString: string,
        key: number,
        addWord: (word: string) => void,
        removeWord: () => void,
    }
) {
    const realWord = word.split('')
    const [userWord, setUserWord] = useState<string[]>(userWordString.split(''))

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
                case 'AltRight': {
                    console.log(userWord.join(''))
                    addWord('')
                    break;
                }
                case 'Backspace': {
                    if (userWord.length) {
                        if (e.ctrlKey == true) {
                            setUserWord([])
                        } else {
                            setUserWord([...userWord.slice(0, Math.max(userWord.length - 1, 0))])
                            console.log([...userWord.slice(0, Math.max(userWord.length - 1, 0))])
                        }
                    } /* else */
                    // removeWord()
                    break;
                }
            }
        }
    }, [addWord, /* removeWord, */ userWord])

    useEffect(() => {
        console.log('adding addEventListener')
        console.log(userWord)
        document.addEventListener('keydown', handleClick)
        return () => document.removeEventListener('keydown', handleClick)
    }, [handleClick, userWord]);

    useEffect(() => {

    })
    return (
        < div className={'inline-flex'} key={key} >
            {
                realWord.map((letter, idx) => {
                    // If index is beyond the userWord length, display the realWord letter
                    if (idx > userWord.length - 1) {
                        return (<Letter type={'active'} letter={letter} key={idx} />);
                    } else {
                        // Compare letters in userWord and realWord
                        if (userWord[idx] === realWord[idx]) {
                            return (<Letter type={'correct'} letter={letter} key={idx} />);
                        } else {
                            return (<Letter type={'incorrect'} letter={letter} key={idx} />);
                        }
                    }
                })
            }
            {userWord.length > realWord.length &&
                Array.from(userWord.slice(realWord.length)).map((letter, idx) => {
                    return (<Letter type={'incorrect'} letter={letter} key={idx} />);
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

export function Letter({ letter, key, type }: { letter: string, key: number, type: 'correct' | 'incorrect' | 'inactive' | 'active' }) {
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
    return (
        <div className={className} key={key}>{letter}</div>
    )
}
