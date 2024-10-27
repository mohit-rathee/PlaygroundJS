""
import { ActiveWord, InactiveWord, TypedWord } from "./Word"
import { PageContext } from "../context/PageContext";
import { useContext, useEffect, useRef, useState } from "react";

export default function TypingArena() {
    const { gameDispatch, typingContent, isFocused, setIsFocused, setIsRunning } = useContext(PageContext);
    const wordList: string[] = typingContent
    const [userList, setUserList] = useState<string[]>([])
    const [activeWord, setActiveWord] = useState<string>('')

    const typingArenaDiv = useRef<HTMLDivElement>(null)
    const addWord = (word: string) => {
        setActiveWord('')
        const newUserList = [...userList, word]
        setUserList(newUserList)
        if (newUserList.length == wordList.length) {
            setIsRunning(false)
            setUserList([])
            gameDispatch({ type: 'reload' })
        }
    }
    const jumpBack = (removeWord = false) => {
        const lastIdx = userList.length - 1
        const lastWord = lastIdx >= 0 ? userList[lastIdx] : ''
        if (removeWord)
            setActiveWord('')
        else
            setActiveWord(lastWord)
        setUserList([...userList.slice(0, Math.max(userList.length - 1, 0))]);
    }
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                typingArenaDiv.current &&
                typingArenaDiv.current.contains(e.target as Node)
            ) {
                setIsFocused(true)
                window.removeEventListener('click', handleClick)
            }
        }
        function handlePress() {
            setIsFocused(true)
            window.removeEventListener('keypress', handlePress)
        }
        window.addEventListener('click', handleClick)
        window.addEventListener('keypress', handlePress)
        return () => window.removeEventListener('click', handleClick)
    }, [setIsFocused])
    return (
        <div ref={typingArenaDiv} className={`scrollable-container h-60 rounded-xl border-2 w-[80%] overflow-y-scroll`}>
            <div className={`w-full inline-flex items-baseline flex-wrap gap-3 p-8 border-sky-50 text-4xl font-semibold  ${isFocused ? '' : 'blur'}`}>

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
                            realWord={word}
                            typedWord={activeWord}
                            completeWord={addWord}
                            jumpPrevWord={jumpBack}
                            reloadGame={() => {
                                setUserList([])
                                setActiveWord('')
                                gameDispatch({ type: 'reload' })
                            }}
                            completeGame={() => {
                                setIsRunning(false)
                                if(!userList.length) return
                                setUserList([])
                                setActiveWord('')
                                gameDispatch({ type: 'reload' })
                            }}
                        />
                    } else
                        return <InactiveWord
                            key={idx}
                            word={word}
                        />
                })}
            </div>
        </div>
    )
}
