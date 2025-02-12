import React, { createContext, useReducer, ReactNode, useEffect, useState } from "react";
import { generateCustom, quotesGenerator, randomWordsGenerator } from "../utils/testContentGenerator";
import { GameInfoType, gameInfoAction, PageContextType } from "../types";


const initialGameInfo: GameInfoType = { type: 'words', length: 25, punctuation: false, number: false };

function reducer(state: GameInfoType, action: gameInfoAction): GameInfoType {
    switch (action.type) {
        case 'complete':
            console.log(state.type)
            if (state.type == "result") throw Error('error')
            return {
                type: "result",
                timestamps: action.timestamps,
                lastConfig: state
            }
        case 'next':
            if (state.type == "result")
                return state.lastConfig
            else
                return { ...state }
        case 'retake':
            if (state.type == "result")
                return state.lastConfig
            else
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
        console.log('Loading typingContent')
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
            case "result":
                // const randomWords2 = randomWordsGenerator(gameInfo)
                // setTypingContent(['done'])
                // setResult(gameInfo.timestamps)
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

