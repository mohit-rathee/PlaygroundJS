import React, { createContext, ReactNode, RefObject, SetStateAction, useEffect, useRef, useState } from "react";


interface ArenaContextType {
    userList: string[],
    activeWord: string[],
    statistics: RefObject<{ correct: number, incorrect: number }>
    scrollableRef: RefObject<HTMLDivElement>
    setUserList: React.Dispatch<SetStateAction<string[]>>;
    setActiveWord: React.Dispatch<SetStateAction<string[]>>;
    activeWordRef: RefObject<HTMLDivElement>
    cursorPositonRef: RefObject<HTMLDivElement>
    cursorRef: RefObject<HTMLDivElement>

}
export const ArenaContext = createContext<ArenaContextType>({
    userList: [],
    activeWord: [],
    setUserList: () => { },
    setActiveWord: () => { },
    statistics: { current: null },
    scrollableRef: { current: null },
    activeWordRef: { current: null },
    cursorPositonRef: { current: null },
    cursorRef: { current: null },

});

const ArenaProvider = ({ children }: { children: ReactNode }) => {
    const [userList, setUserList] = useState<string[]>([])
    const [activeWord, setActiveWord] = useState<string[]>([])
    const statistics = useRef<{ correct: number, incorrect: number }>({
        correct: 0,
        incorrect: 0,
    })
    const scrollableRef = useRef<HTMLDivElement>(null)
    const activeWordRef = useRef<HTMLDivElement>(null)
    const cursorPositonRef = useRef<HTMLDivElement>(null)
    const cursorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!statistics.current) throw Error('IDK')
        statistics.current.correct = userList.reduce((total_words, current) => {
            return total_words + current.length
        }, 0) + activeWord.length
        statistics.current.incorrect = 3
    }, [activeWord, userList]);

    const context = {
        userList: userList,
        setUserList: setUserList,
        activeWord: activeWord,
        setActiveWord: setActiveWord,
        statistics: statistics,
        scrollableRef: scrollableRef,
        activeWordRef: activeWordRef,
        cursorPositonRef: cursorPositonRef,
        cursorRef: cursorRef,
    }
    return (
        <ArenaContext.Provider value={context}>
            {children}
        </ArenaContext.Provider>
    );
};

export default ArenaProvider;

