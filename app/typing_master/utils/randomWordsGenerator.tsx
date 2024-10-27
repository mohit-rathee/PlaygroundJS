import { GameInfoType } from "../typex";
import { words, punctuations } from "../utils/random_words";

export const randomWordsGenerator = (args: GameInfoType): string[] => {
    if (args.type !== "words") throw new Error('only for words type')
    const shuffled = [...words].sort(() => 0.5 - Math.random()).slice(0, args.length);

    if (!args.number && !args.punctuation) {
        return shuffled;
    }
    let result = args.punctuation ? applyPunctuation(shuffled, args.length) : [...shuffled];
    if (args.number) result.push(...generateNumbers(args.length));

    return result.sort(() => 0.5 - Math.random()).slice(0, args.length);
};

const applyPunctuation = (wordList: string[], count: number): string[] => {
    const punctuationCount = Math.floor(count * (Math.random() * 0.1 + 0.2));
    return wordList.map((word, index) =>
        index < punctuationCount
            ? punctuations[Math.floor(Math.random() * punctuations.length)].replace('*', word)
            : word
    );
};

const generateNumbers = (count: number): string[] => {
    const numberCount = Math.floor(count * (Math.random() * 0.1 + 0.1));
    return Array.from({ length: numberCount }, () => Math.floor(Math.random() * 100).toString());
};

