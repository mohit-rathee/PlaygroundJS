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
    const scrollableRef = useRef<HTMLDivElement>(null)
    const activeWordRef = useRef<HTMLDivElement>(null)
    const cursorRef = useRef<HTMLDivElement>(null)
    const realCursorRef = useRef<HTMLDivElement>(null)
    const BlurryDivRef = useRef<HTMLDivElement>(null)


    const gamePressListner = useCallback((e: KeyboardEvent) => {
        e.stopPropagation()
        if (/^[a-zA-Z0-9,.!@#$%^&*()_+\\[\]{};':"\\|,.<>?\/]$/.test(e.key)) {
            if (!isRunning) setIsRunning(true)
            setActiveWord(prevWord => [...prevWord, e.key])
        }
        else {
            switch (e.code) {
                case 'Space': {
                    e.preventDefault()
                    if (e.shiftKey) {
                        setActiveWord([])
                        setUserList([])
                        gameDispatch({ type: 'reload' })
                        return
                    }
                    setActiveWord(prevWord => {
                        if (prevWord.length)
                            setUserList(prevList => {
                                if (prevList.length == wordList.length - 1) {
                                    setIsRunning(false)
                                    setUserList([])
                                    setActiveWord([])
                                    gameDispatch({ type: 'reload' })
                                }
                                return [...prevList, prevWord.join('')]
                            })
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
    }, [isRunning, setIsRunning, gameDispatch, wordList])
    useEffect(() => {
        if (isFocused) {
            document.addEventListener('keydown', gamePressListner)
        }
        return () =>
            document.removeEventListener('keydown', gamePressListner)
    }, [gamePressListner, isFocused]);
    useEffect(() => {
        function focusClick(e: MouseEvent) {
            if (
                BlurryDivRef.current &&
                BlurryDivRef.current.contains(e.target as Node)
            ) {
                setIsFocused(true)
            }
        }
        function focusPress() {
            if (!document.getElementById('CustomDiv'))
                setIsFocused(true)
        }
        window.addEventListener('click', focusClick)
        window.addEventListener('keypress', focusPress)
        return () => {
            window.removeEventListener('click', focusClick)
            window.removeEventListener('keypress', focusPress)
        }
    }, [setIsFocused, isFocused])
    useEffect(() => {
        if (!scrollableRef.current) return
        if (!activeWordRef.current) return
        const div = scrollableRef.current
        const activeWord = activeWordRef.current
        const div_height = div.clientHeight
        const active_word_height = activeWord.clientHeight
        const word_height = activeWord.offsetTop
        const scrollTo =
            + word_height
            - div_height / 2
            + active_word_height / 2
            + 10
        div.scrollTo({
            top: scrollTo,
            behavior: 'smooth'
        })
    }, [userList])
    useEffect(() => {
        if (isRunning && scrollableRef.current) {
            scrollableRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }

    }, [isRunning])
    useEffect(() => {
        if (cursorRef.current && realCursorRef.current && scrollableRef.current) {
            const cursor = cursorRef.current.getBoundingClientRect()
            const scrollDiv = scrollableRef.current
            const scrollRect = scrollDiv.getBoundingClientRect()
            const left = cursor.left - scrollRect.left
            const top = cursor.top - scrollRect.top + scrollDiv.scrollTop
            realCursorRef.current.style.top = `${top}px`;
            realCursorRef.current.style.left = `${left}px`;
        }
    })
    return (
        <div className={`text-5xl relative h-[12.5rem] w-[80%] rounded-xl `}>
            {!isFocused && <BlurryScreen ref={BlurryDivRef} />}
            <div ref={scrollableRef}
                className={`absolute inset-0 h-full w-full overflow-y-scroll`}>
                {/* animate-blink */}
                <div ref={realCursorRef} className={`relative z-50 w-[0.3rem] rounded-sm 
                                         -translate-x-[0.140rem] -translate-y-[0.3rem]
                                         h-16 bg-yellow-300`}
                    style={{ transition: 'top 0.2s ease, left 0.2s ease' }}
                />
                <div className={`w-full gap-6 pt-[1vh] pb-[20vh] inline-flex items-baseline flex-wrap p-8 border-sky-50`}>
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
                                activeWordRef={activeWordRef}
                                realLetters={word.split('')}
                                userLetters={activeWord}
                                cursorRef={cursorRef}
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

function BlurryScreen({ ref }: any) {
    return (
        <div ref={ref}
            className={`absolute inset-0  h-[16rem] flex justify-center items-center
                                transform -translate-y-[1.55rem]
                                scale-x-110
                                z-10 text-3xl text-gray-50
                                bg-gray-950 rounded-xl
                                hover:text-yellow-200
                                bg-opacity-50 backdrop-blur-sm`}>
            Click here or press any key to focus.
        </div>

    )
}
