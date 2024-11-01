import React, { createContext, ReactNode, RefObject, SetStateAction, useRef, useState } from "react";


interface ArenaContextType {
    userList: string[],
    activeWord: string[],
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
    scrollableRef: { current: null },
    activeWordRef: { current: null },
    cursorPositonRef: { current: null },
    cursorRef: { current: null },

});

const ArenaProvider = ({ children }: { children: ReactNode }) => {
    const [userList, setUserList] = useState<string[]>([])
    const [activeWord, setActiveWord] = useState<string[]>([])
    const scrollableRef = useRef<HTMLDivElement>(null)
    const activeWordRef = useRef<HTMLDivElement>(null)
    const cursorPositonRef = useRef<HTMLDivElement>(null)
    const cursorRef = useRef<HTMLDivElement>(null)

    const context = {
        userList: userList,
        setUserList: setUserList,
        activeWord: activeWord,
        setActiveWord: setActiveWord,
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

