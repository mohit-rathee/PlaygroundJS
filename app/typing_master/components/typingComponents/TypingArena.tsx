import { useContext, useEffect, useCallback, useState } from "react";
import { ActiveWord, InactiveWord, TypedWord } from "./Word"
import { PageContext } from "../../context/PageContext";
import { ArenaContext } from "../../context/ArenaContext";

export default function TypingArena() {
    const {
        activeWord,
        setActiveWord,
        userList,
        setUserList,
        statistics,
        activeWordRef,
        cursorPositonRef,
    } = useContext(ArenaContext)
    const {
        gameDispatch,
        isRunning,
        isFocused,
        setIsRunning,
        typingContent,
    } = useContext(PageContext);

    const wordList: string[] = typingContent

    useEffect(() => {
        setUserList([]) // just to do re-rendering of cursor
    }, [setUserList])
    useEffect(() => {
        setUserList([]) // reset test if typingContent changes
    }, [typingContent, setUserList])

    const gamePressListner = useCallback((e: KeyboardEvent) => {
        e.stopPropagation()
        if (/^[a-zA-Z0-9,.!@#$%^&*()_+\\[\]{};':"\\|,.<>?\/]$/.test(e.key)) {
            if (!isRunning) setIsRunning(true)
            setActiveWord((prevWord: string[]) => [...prevWord, e.key])
        }
        else {
            switch (e.code) {
                case 'Space': {
                    e.preventDefault()
                    if (e.shiftKey) {
                        setActiveWord([])
                        setUserList([])
                        gameDispatch({ type: 'reload' })
                        setTimestamps([])
                        setIsRunning(false)
                        return
                    }
                    setActiveWord((prevWord: string[]) => {
                        if (prevWord.length)
                            setUserList((prevList: string[]) => {
                                if (prevList.length == wordList.length - 1) {
                                    setIsRunning(false)
                                    setUserList([])
                                    setActiveWord([])
                                    gameDispatch({ type: 'reload' })
                                    setTimestamps([])
                                }
                                return [...prevList, prevWord.join('')]
                            })
                        return []
                    })
                    break;
                }
                case 'Backspace': {
                    // Complex Async Behaviour,  QUEUE = [...(1),(2),(3)...]
                    setActiveWord((prevWord: string[]) => {          //----(1)----|
                        if (prevWord.length) {                       //           |
                            if (e.ctrlKey)                           //           |
                                return []                            //           |
                            else                                     //           | 
                                return prevWord.slice(0, -1)         //           |
                        }                                            //           |
                        //If activeWord was empty, then              //           |       
                        setUserList((prevUserList: string[]) => {    //--(2)--|   |       
                            if (!prevUserList.length) return [];     //       |   |
                            const lastWord = prevUserList.pop()      //       |   |
                            if (!lastWord)                           //       |   |
                                throw new Error('lastWord not found')//       |   |
                            if (e.ctrlKey)                           //       |   |
                                setActiveWord([])                    //-(3)-| |   |
                            else                                     //     | |   |
                                setActiveWord(lastWord.split(''))    //-(3)-| |   |
                            return [...prevUserList]                 //       |   |
                        });                                          //-------|   |
                        return []                                    //           |
                    })                                               //-----------|
                }
                case 'Enter': {
                    if (!e.shiftKey) return
                    setIsRunning(false)
                    setUserList([])
                    setActiveWord([])
                    gameDispatch({ type: 'reload' })
                    setTimestamps([])
                    break;
                }
            }
        }
    }, [isRunning, setIsRunning, gameDispatch, wordList, setActiveWord, setUserList])
    useEffect(() => {
        if (isFocused) {
            document.addEventListener('keydown', gamePressListner)
        }
        return () =>
            document.removeEventListener('keydown', gamePressListner)
    }, [gamePressListner, isFocused]);
    const [timestamps, setTimestamps] = useState<number[]>([])
    useEffect(() => {
        // Define the function that will run the repeated logic
        const updateTimestamp = () => {
            if (!statistics.current) throw Error("IDK")
            const total_length = statistics.current['correct']
            console.log(statistics.current)
            setTimestamps((prevTime) => [...prevTime, Number(total_length)]);
        };

        const interval = setInterval(updateTimestamp, 1000);

        return () => {
            clearInterval(interval)
        };
    }, [statistics]);

    return (
        <div className={`
                    xl:text-5xl lg:text-5xl md:text-4xl sm:text-2xl 
                    xl:gap-5 lg:gap-4 md:gap-3  sm:gap-2
                    w-full  pt-[1vh] pb-[20vh] 
                    inline-flex items-baseline flex-wrap p-8 border-sky-50`}>
            <div className="fixed top-16 w-[80%] flex flex-wrap rounded gap-3 text-sm">{timestamps.map((time, index) => {
                return <div key={index}>{time}</div>
            })
            }</div>
            {wordList.map((word: string, idx: number) => {
                if (idx < userList.length) {
                    return <TypedWord
                        key={idx}
                        userWord={userList[idx]}
                        realWord={word}
                    />
                } else if (idx == userList.length) {
                    return <ActiveWord
                        key={idx}
                        activeWordRef={activeWordRef}
                        realLetters={word.split('')}
                        userLetters={activeWord}
                        cursorRef={cursorPositonRef}
                    />
                } else
                    return <InactiveWord
                        key={idx}
                        word={word}
                    />
            })}
        </div>
    )
}
