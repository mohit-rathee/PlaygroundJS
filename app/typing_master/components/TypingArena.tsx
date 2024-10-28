""
import { ActiveWord, InactiveWord, TypedWord } from "./Word"
import { PageContext } from "../context/PageContext";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function TypingArena() {
    const {
        gameDispatch,
        isRunning,
        typingContent,
        isFocused,
        setIsFocused,
        setIsRunning,
    } = useContext(PageContext);
    const wordList: string[] = typingContent
    const [userList, setUserList] = useState<string[]>([])
    const [activeWord, setActiveWord] = useState<string[]>([])

    const handleClick = useCallback((e: KeyboardEvent) => {
        e.stopPropagation()
        if (/^[a-zA-Z0-9,.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?\/]$/.test(e.key)) {
            if (!isRunning) setIsRunning(true)
            setActiveWord(prevWord => [...prevWord, e.key])
        }
        else {
            switch (e.code) {
                case 'Space': {
                    if (e.shiftKey) {
                        setActiveWord([])
                        setUserList([])
                        gameDispatch({ type: 'reload' })
                        return
                    }
                    setActiveWord(prevWord => {
                        if (prevWord.length)
                            setUserList(prevList => [...prevList, prevWord.join('')])
                        return []
                    })
                    break;
                }
                case 'Backspace': {
                    // Complex Async Behaviour,  QUEUE = [...(1),(2),(3)...]
                    setActiveWord(prevWord => {                      //----(1)----|
                        if (prevWord.length) {                       //           |
                            if (e.ctrlKey)                           //           |
                                return []                            //           |
                            else                                     //           | 
                                return prevWord.slice(0, -1)         //           |
                        }                                            //           |
                        //If activeWord was empty, then              //           |       
                        setUserList(prevUserList => {                //--(2)--|   |       
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
                    break;
                }
            }
        }
    }, [isRunning, setIsRunning, gameDispatch])

    useEffect(() => {
        if (isFocused) {
            document.addEventListener('keydown', handleClick)
        }
        return () =>
            document.removeEventListener('keydown', handleClick)
    }, [handleClick, isFocused]);

    const BlurOverlapDiv = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                BlurOverlapDiv.current &&
                BlurOverlapDiv.current.contains(e.target as Node)
            ) {
                setIsFocused(true)
            }
        }
        function handlePress() {
            setIsFocused(true)
        }
        window.addEventListener('click', handleClick)
        window.addEventListener('keypress', handlePress)
        return () => {
            window.removeEventListener('click', handleClick)
            window.removeEventListener('keypress', handlePress)
        }
    }, [setIsFocused])

    return (
        <div ref={BlurOverlapDiv} className={`relative h-64 w-[80%] rounded-xl border-2`}>
            {!isFocused && <>
                <div className={`absolute inset-0 flex justify-center items-center
                                z-10 text-3xl font-bold text-gray-50
                                bg-gray-950 rounded-xl
                                hover:text-yellow-200
                                bg-opacity-50 backdrop-blur-sm`}>
                    Click here or press any key to focus.
                </div>
            </>
            }
            <div className={`absolute inset-0 w-full overflow-y-scroll`}>
                <div className={`w-full inline-flex items-baseline flex-wrap gap-3 p-8 border-sky-50 text-4xl font-semibold `}>

                    {wordList.map((word, idx) => {
                        if (idx < userList.length) {
                            return <TypedWord
                                key={idx}
                                userWord={userList[idx]}
                                realWord={word}
                            />
                        } else if (idx == userList.length) {
                            return <ActiveWord
                                key={idx}
                                realLetters={word.split('')}
                                userLetters={activeWord}
                            />
                        } else
                            return <InactiveWord
                                key={idx}
                                word={word}
                            />
                    })}
                </div>
            </div>
        </div>
    )
}
