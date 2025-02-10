import { Dispatch, RefObject, SetStateAction } from "react";

export type gameInfoAction =
    | { type: 'complete'; timestamps: Timestamps[] }
    | { type: 'next' }
    | { type: 'retake' }
    | { type: 'toggleNumber' }
    | { type: 'togglePunctuation' }
    | { type: 'setLength'; length: number }
    | { type: 'setQuotesLength'; length: 'all' | 'short' | 'medium' | 'long' | 'thick' }
    | { type: 'setWords' }
    | { type: 'setCustom'; payload: string }
    | { type: 'setZen' }
    | { type: 'setQuotes' };

export type currentWordAction =
    | { type: 'add'; letter: string }
    | { type: 'back'; isCtrl: boolean }
    | { type: 'next' }
    | { type: 'complete' }
    | { type: 'reset' }

export type GameInfoType =
    | { type: 'words'; punctuation: boolean; number: boolean; length: number }
    | { type: 'zen' }
    | { type: 'quotes'; length: 'all' | 'short' | 'medium' | 'long' | 'thick' }
    | { type: 'custom'; payload: string; punctuation: boolean; number: boolean; }
    | {
        type: 'result'; timestamps: Timestamps[];
        lastConfig: Exclude<GameInfoType, { type: 'result' }>
    };

export interface PageContextType {
    gameInfo: GameInfoType;
    typingContent: string[];
    gameDispatch: Dispatch<gameInfoAction>;
    isFocused: boolean;
    isRunning: boolean;
    setIsRunning: React.Dispatch<SetStateAction<boolean>>;
    setIsFocused: React.Dispatch<SetStateAction<boolean>>;
}

export interface ArenaContextType {
    activeWord: string[],
    wordDispatch: Dispatch<currentWordAction>,
    typedContentRef: RefObject<string[]>
    statisticsRef: RefObject<Statistics>
    scrollableRef: RefObject<HTMLDivElement>
    activeWordRef: RefObject<HTMLDivElement>
    cursorPositonRef: RefObject<HTMLDivElement>
    cursorRef: RefObject<HTMLDivElement>

}
export interface Statistics {
    past: {
        correct: number,
        incorrect: number,
        left: number,
        overflow: number,
    }
    current: {
        correct: number,
        incorrect: number,
        left: number,
        overflow: number,
    }
}
export interface Timestamps {
    correct: number,
    error: number
    left: number,
    overflow: number,
    timestamps: number,
}
