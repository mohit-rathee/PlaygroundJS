import { Dispatch, SetStateAction } from "react";

export type Action =
    | { type: 'reload' }
    | { type: 'toggleNumber' }
    | { type: 'togglePunctuation' }
    | { type: 'setLength'; length: number }
    | { type: 'setQuotesLength'; length: 'all' | 'short' | 'medium' | 'long' | 'thick' }
    | { type: 'setWords' }
    | { type: 'setCustom'; payload: string }
    | { type: 'setZen' }
    | { type: 'setQuotes' };

export type GameInfoType =
    | { type: 'words'; punctuation: boolean; number: boolean; length: number }
    | { type: 'zen' }
    | { type: 'quotes'; length: 'all' | 'short' | 'medium' | 'long' | 'thick' }
    | { type: 'custom'; payload: string; punctuation: boolean; number: boolean; };

export interface PageContextType {
    gameInfo: GameInfoType;
    typingContent: string[];
    gameDispatch: Dispatch<Action>;
    isFocused: boolean;
    isRunning: boolean;
    setIsRunning: React.Dispatch<SetStateAction<boolean>>;
    setIsFocused: React.Dispatch<SetStateAction<boolean>>;
}
