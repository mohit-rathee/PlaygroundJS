import React, { createContext, Dispatch, useReducer, ReactNode, useEffect, useState, SetStateAction } from "react";

type Action =
    | { type: 'toggleNumber' }
    | { type: 'togglePunctuation' }
    | { type: 'setWords' }
    | { type: 'setCustom'; payload: string }
    | { type: 'setCustom'; payload: string }
    | { type: 'setZen' }
    | { type: 'setQuotes' };

type GameInfoType =
    | { type: 'words'; punctuation: boolean; number: boolean }
    | { type: 'zen' }
    | { type: 'quotes' }
    | { type: 'custom'; payload: string };

interface PageContextType {
    gameInfo: GameInfoType;
    typingContent: string[];
    gameDispatch: Dispatch<Action>;
    isFocused: boolean;
    isRunning: boolean;
    setIsRunning: React.Dispatch<SetStateAction<boolean>>;
    setIsFocused: React.Dispatch<SetStateAction<boolean>>;
}

const initialGameInfo: GameInfoType = { type: 'words', punctuation: false, number: false };

function reducer(state: GameInfoType, action: Action): GameInfoType {
    switch (action.type) {
        case 'toggleNumber':
            if (state.type === 'words') {
                return { ...state, number: !state.number };
            }
            return state;

        case 'togglePunctuation':
            if (state.type === 'words') {
                return { ...state, punctuation: !state.punctuation };
            }
            return state;

        case 'setWords':
            if (state.type !== "words")
                return { type: 'words', number: false, punctuation: false };
            else
                return state

        case 'setCustom':
            return { type: 'custom', payload: action.payload };

        case 'setQuotes':
            return { type: 'quotes' };

        case 'setZen':
            return { type: 'zen' };

        default:
            throw new Error("Unknown action type");
    }
}

export const PageContext = createContext<PageContextType>({
    typingContent: [],
    gameInfo: initialGameInfo,
    gameDispatch: () => { },
    isFocused: false,
    isRunning: false,
    setIsRunning: () => { },
    setIsFocused: () => { },
});

const PageProvider = ({ children }: { children: ReactNode }) => {
    const [gameInfo, gameDispatch] = useReducer(reducer, initialGameInfo);
    const [typingContent, setTypingContent] = useState<string[]>([])
    const [isRunning, setIsRunning] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        switch (gameInfo.type) {
            case "zen":
                setTypingContent(['I', 'am', 'lost.'])
                break;
            case "quotes":
                setTypingContent(['I', 'am', 'fucked.'])
                break;
            case "custom":
                setTypingContent(['I', 'am', 'drowned.'])
                break;
            case "words":
                setTypingContent(['Now', 'I', 'am', 'calm.'])
                break;
        }
    }, [gameInfo])
    const context = {
        gameInfo: gameInfo,
        gameDispatch: gameDispatch,
        typingContent: typingContent,
        isRunning: isRunning,
        setIsRunning: setIsRunning,
        isFocused: isFocused,
        setIsFocused: setIsFocused,
    }
    return (
        <PageContext.Provider value={context}>
            {children}
        </PageContext.Provider>
    );
};

export default PageProvider;

