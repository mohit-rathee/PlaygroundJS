import React, { createContext, useReducer, ReactNode, useEffect, useState } from "react";
import { applyPunctuation, generateCustom, generateNumbers, quotesGenerator, randomWordsGenerator } from "../utils/testContentGenerator";
import { GameInfoType, Action, PageContextType } from "../typex";
import { stat } from "fs";


const initialGameInfo: GameInfoType = { type: 'words', length: 25, punctuation: false, number: false };

function reducer(state: GameInfoType, action: Action): GameInfoType {
    switch (action.type) {
        case 'reload':
            return { ...state }
        case 'toggleNumber':
            if (state.type === 'words' || state.type === 'custom') {
                return { ...state, number: !state.number };
            }
            return state;

        case 'togglePunctuation':
            if (state.type === 'words' || state.type === 'custom') {
                return { ...state, punctuation: !state.punctuation };
            }
            return state;

        case 'setLength':
            if (state.type === 'words') {
                return { ...state, length: action.length };
            }
            return state;
        case 'setQuotesLength':
            if (state.type === 'quotes') {
                return { ...state, length: action.length };
            }
            return state;
        case 'setWords':
            if (state.type !== "words")
                return { type: 'words', length: 25, number: false, punctuation: false };
            else
                return state

        case 'setCustom':
            return { type: 'custom', payload: action.payload, punctuation: false, number: false };

        case 'setQuotes':
            return { type: 'quotes', length: 'short' };

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
                const quotes = quotesGenerator(gameInfo)
                setTypingContent(quotes)
                break;
            case "custom":
                const customContent = generateCustom(gameInfo)
                setTypingContent(customContent)
                break;
            case "words":
                const randomWords = randomWordsGenerator(gameInfo)
                setTypingContent(randomWords)
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

