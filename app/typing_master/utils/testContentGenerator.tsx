import { GameInfoType } from "../typex";
import { words, punctuations } from "../utils/random_words";
import { longQuotes } from "./quotes/longQuotes";
import { mediumQuotes } from "./quotes/mediumQuotes";
import { shortQuotes } from "./quotes/shortQuotes";
import { thickQuotes } from "./quotes/thickQuotes";

export const quotesGenerator = (args: GameInfoType) => {
    if (args.type !== "quotes") throw new Error('only for quotes type')
    let quotesArray;
    switch (args.length) {
        case "all":
            quotesArray = [...shortQuotes, ...mediumQuotes, ...longQuotes, ...thickQuotes]
            break;
        case "short":
            quotesArray = shortQuotes
            break;
        case "medium":
            quotesArray = mediumQuotes
            break;
        case "long":
            quotesArray = longQuotes
            break;
        case "thick":
            quotesArray = thickQuotes
            break;
    }
    const quote = quotesArray[Math.random() * quotesArray.length | 0]
    const words = quote.text.split(' ')
    return words

}
export const generateCustom = (args: GameInfoType): string[] => {
    if (args.type !== "custom") throw new Error('only for words type')
    const customContent = args.payload === "" ?
        'The quick brown fox jumps over the lazy dog.' :
        args.payload
    let result;
    result = customContent.split(/[\s\n]+/) // Space and NewLine character
    result = args.punctuation ? applyPunctuation(result, result.length) : result;
    const numberCount = Math.floor(result.length * (Math.random() * 0.1 + 0.1));
    result = args.number ? generateNumbers(result, numberCount) : result;
    return result
}

export const randomWordsGenerator = (args: GameInfoType): string[] => {
    if (args.type !== "words") throw new Error('only for words type')
    const numberCount = args.number ?
        Math.floor(args.length * (Math.random() * 0.1 + 0.1)) :
        0
    const wordCount = args.length - numberCount
    const shuffled = [...words].sort(() => 0.5 - Math.random()).slice(0, wordCount);

    if (!args.number && !args.punctuation) {
        return shuffled;
    }
    let result;
    result = args.punctuation ? applyPunctuation(shuffled, args.length) : shuffled;
    result = args.number ? generateNumbers(result, numberCount) : result;
    return result.sort(() => 0.5 - Math.random()).slice(0, args.length);
};

export const applyPunctuation = (wordList: string[], count: number): string[] => {
    const punctuationCount = Math.floor(count * (Math.random() * 0.1 + 0.2));
    const indices = Array.from({ length: wordList.length }, (_, i) => i);
    const selectedIndices = indices
        .sort(() => 0.5 - Math.random())
        .slice(0, punctuationCount);

    return wordList.map((word, index) =>
        selectedIndices.includes(index)
            ? punctuations[Math.floor(Math.random() * punctuations.length)]
                .replace('*', word)
            : word
    );
};


export const generateNumbers = (wordList: string[], count: number): string[] => {
    const numberArray = Array.from(
        { length: count },
        () => Math.floor(Math.random() * 100).toString()
    );
    numberArray.forEach(number => {
        const randomIndex = Math.floor(Math.random() * (wordList.length + 1));
        wordList.splice(randomIndex, 0, number);
    });
    return wordList;
};


