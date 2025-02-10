import { useContext, useEffect, useCallback } from "react";
import { ActiveWord, InactiveWord, TypedWord } from "./Word"
import { PageContext } from "../../context/PageContext";
import { ArenaContext } from "../../context/ArenaContext";

export default function TypingArena() {
    const {
        typedContentRef,
        activeWord,
        wordDispatch,
        activeWordRef,
        cursorPositonRef,
    } = useContext(ArenaContext)
    const {
        gameDispatch,
        isRunning,
        isFocused,
        setIsRunning,
        setIsFocused,
        typingContent,
    } = useContext(PageContext);
    if (!typedContentRef.current) throw Error('typedContentRef is null')
    const typedContent = typedContentRef.current
    const wordList: string[] = typingContent

    const gamePressListner = useCallback((e: KeyboardEvent) => {
        e.stopPropagation()
        if (/^[a-zA-Z0-9,.!@#$%^&*()_+\\[\]{};':"\\|,.<>?\/]$/.test(e.key)) {
            if (!isRunning) setIsRunning(true)
            if (!isFocused) setIsFocused(true)
            wordDispatch({
                type: "add",
                letter: e.key
            })
        }
        else {
            switch (e.code) {
                case 'Space': {
                    e.preventDefault()
                    if (e.shiftKey) {
                        gameDispatch({ type: 'next' })
                        setIsRunning(false)
                        return
                    }
                    wordDispatch({ type: "next", })
                    break;
                }
                case 'Backspace': {
                    wordDispatch({
                        type: 'back',
                        isCtrl: e.ctrlKey
                    })
                    break;
                }
                case 'Enter': {
                    if (!e.shiftKey) return
                    setIsRunning(false)
                    wordDispatch({ type: 'complete' })
                    break;
                }
            }
        }
    }, [isRunning, isFocused, wordDispatch, setIsFocused, gameDispatch, setIsRunning])
    useEffect(() => {
        if (isFocused) {
            document.addEventListener('keydown', gamePressListner)
        }
        return () =>
            document.removeEventListener('keydown', gamePressListner)
    }, [gamePressListner, isFocused]);


    return (
        <div 
            id="typingContent"
            tabIndex={0}
            className={`
                    xl:text-5xl lg:text-5xl md:text-4xl sm:text-2xl 
                    xl:gap-5 lg:gap-4 md:gap-3  sm:gap-2
                    w-full  focus:outline-none
                    inline-flex items-baseline flex-wrap p-0 border-sky-50`}>
            {wordList.map((word: string, idx: number) => {
                if (idx < typedContent.length) {
                    return <TypedWord
                        key={idx}
                        userWord={typedContent[idx]}
                        realWord={word}
                    />
                } else if (idx == typedContent.length) {
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
