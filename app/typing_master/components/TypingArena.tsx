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
            document.addEventListener('keydown', handleClick)
        }
        return () =>
            document.removeEventListener('keydown', handleClick)
    }, [handleClick, isFocused]);

    const scrollableRef = useRef<HTMLDivElement>(null)
    const activeWordRef = useRef<HTMLDivElement>(null)
    const BlurryDivRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                BlurryDivRef.current &&
                BlurryDivRef.current.contains(e.target as Node)
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
    useEffect(()=>{
        if(isRunning&&scrollableRef.current){
            scrollableRef.current.scrollIntoView({
                behavior:"smooth",
                block:"center"
            })
        }

    },[isRunning])

    return (
        <div className={`text-5xl relative h-[12.5rem] w-[80%] rounded-xl `}>
            {!isFocused && <>
                <div ref={BlurryDivRef}
                    className={`absolute inset-1 flex justify-center items-center
                                scale-110
                                z-10 text-3xl text-gray-50
                                bg-gray-950 rounded-xl
                                hover:text-yellow-200
                                bg-opacity-50 backdrop-blur-sm`}>
                    Click here or press any key to focus.
                </div>
            </>
            }
            <div ref={scrollableRef}
                className={`absolute inset-0 h-full w-full overflow-y-scroll`}>
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
                                activeWordRef={activeWordRef}
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
