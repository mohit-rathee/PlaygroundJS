import React, { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer, useRef } from "react";
import { PageContext } from "./PageContext";
import { ArenaContextType, currentWordAction, gameInfoAction, Statistics, Timestamps } from "../types";

const initialStat = {
    correct: 0,
    incorrect: 0,
    left: 0,
    overflow: 0,
}
function getInitStats() {
    return {
        past: { ...initialStat },
        current: { ...initialStat },
    }
}

export const ArenaContext = createContext<ArenaContextType>({
    activeWord: [],
    wordDispatch: () => { },
    statisticsRef: { current: null },
    typedContentRef: { current: null },
    scrollableRef: { current: null },
    activeWordRef: { current: null },
    cursorPositonRef: { current: null },
    cursorRef: { current: null },

});
function gameReducer(
    word: string[],
    action: currentWordAction,
    typedWordsRef: React.MutableRefObject<string[]>,
    gameDispatch: Dispatch<gameInfoAction>,
    timestampsRef: React.MutableRefObject<Timestamps[]>,
    typingContent: string[],
    statisticsRef: React.MutableRefObject<Statistics>
): string[] {

    if (!typedWordsRef.current)
        throw Error('typedWordsRef is null')
    if (!timestampsRef.current)
        throw Error('timestampsRef is null')
    if (!statisticsRef.current)
        throw Error('statisticsRef is null')

    const statistics = statisticsRef.current
    const typedWords = typedWordsRef.current
    const currentWord = typingContent[typedWords.length]

    switch (action.type) {
        case "add": {
            const newWord = [...word, action.letter]
            const currLetter = currentWord[word.length]
            const overflow = Math.max(0, newWord.length - currentWord.length)
            const left = Math.max(0, currentWord.length - newWord.length)
            statistics.current.left = left
            statistics.current.overflow = overflow
            if (!overflow) {
                if (currLetter == action.letter)
                    statistics.current.correct += 1
                if (currLetter != action.letter)
                    statistics.current.incorrect += 1
            }
            // console.log('past', statistics.past)
            // console.log('current', statistics.current)
            return newWord
        }
        case "back": {
            let newWord: string[] = [];

            if (word.length) {
                if (action.isCtrl)
                    newWord = [];
                else
                    newWord = word.slice(0, word.length - 1);
            } else {
                const lastWord = typedWords.pop();
                newWord = lastWord ? lastWord.split("") : [];
                if (action.isCtrl) newWord = [];
            }

            console.log("newWord", [...newWord]);
            return [...newWord];
        }

        case "next": {
            if (!word.length) return []
            // const stat = getDiff(word, currentWord)
            const newWord = word.join("")
            typedWords.push(newWord)
            statistics.past.correct += statistics.current.correct 
            if (newWord.length == currentWord.length)
                statistics.past.correct += 1  //+1 for space
            statistics.past.incorrect += statistics.current.incorrect
            statistics.past.left += statistics.current.left
            statistics.past.overflow += statistics.current.overflow

            statistics.current = { ...initialStat }
            // console.log('past', statistics.past)
            // console.log('current', statistics.current)
            return []
        }
        case "complete":
            gameDispatch({ type: 'complete', timestamps: timestampsRef.current })
            timestampsRef.current = []
            typedWordsRef.current = []
            statisticsRef.current = getInitStats()
            return []
        case "reset":
            typedWordsRef.current = []
            timestampsRef.current = []
            statisticsRef.current = getInitStats()
            return []
        default:
            throw Error('case not defined')
    }
}

const ArenaProvider = ({ children }: { children: ReactNode }) => {
    const { gameInfo, gameDispatch, isRunning, typingContent } = useContext(PageContext);

    const typedContentRef = useRef<string[]>([]);
    const timestampsRef = useRef<Timestamps[]>([])
    const statisticsRef = useRef<Statistics>(getInitStats())
    const reducerWrapper = React.useCallback(
        (state: string[], action: currentWordAction) =>
            gameReducer(state, action,
                typedContentRef,
                gameDispatch,
                timestampsRef,
                typingContent,
                statisticsRef
            ),
        [typedContentRef, gameDispatch, typingContent]
    );
    const [activeWord, wordDispatch] = useReducer(reducerWrapper, []);


    const scrollableRef = useRef<HTMLDivElement>(null)
    const activeWordRef = useRef<HTMLDivElement>(null)
    const cursorPositonRef = useRef<HTMLDivElement>(null)
    const cursorRef = useRef<HTMLDivElement>(null)
    // useEffect(() => {
    //     console.log('statistics.past',statistics.current.past)
    //     console.log('statistics.current',statistics.current.current)
    //     console.log("------------")
    // }, [activeWord, typedContentRef.current.length]);

    useEffect(() => {
        wordDispatch({ type: 'reset' })
    }, [gameInfo]);
    useEffect(() => {
        if (!typedContentRef.current) throw Error('error')
        const typedContent = typedContentRef.current
        if (typedContent.length && typedContent.length == typingContent.length) {
            wordDispatch({ type: 'complete' })
        }
    }, [typedContentRef.current.length, typingContent]);


    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    useEffect(() => {
        const updateTimestamp = () => {
            if (!statisticsRef.current) throw Error("IDK")
            const statistics = statisticsRef.current
            const stat = {
                correct: 0,
                error: 0,
                left: 0,
                overflow: 0,
                timestamps: 0
            }
            stat.correct = statistics.past.correct + statistics.current.correct
            stat.error = statistics.current.incorrect + statistics.past.incorrect
            stat.left = statistics.past.left
            stat.overflow = statistics.current.overflow + statistics.past.overflow
            stat.timestamps = Date.now()

            timestampsRef.current.push(stat)
        };
        if (isRunning) {
            intervalRef.current = setInterval(updateTimestamp, 100);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
        return () => {
            if (intervalRef.current)
                clearInterval(intervalRef.current)
        };
    }, [statisticsRef, isRunning]);

    const context = {
        activeWord: activeWord,
        wordDispatch: wordDispatch,
        typedContentRef: typedContentRef,
        statisticsRef: statisticsRef,
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
