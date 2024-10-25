import { useState } from "react"
import { ActiveWord, InactiveWord, TypedWord } from "./Word"
export default function TypingArena({ para }: { para: string }) {
    const wordList = para.split(' ')
    const [userList, setUserList] = useState<string[]>([])
    // const [activeWord,setActiveWord] = useState<string>('')
    const addWord = (word: string) => {
        // setActiveWord('')
        setUserList([...userList, word])
    }
    const removeWord = () => {
        // const lastWord = userList[Math.max(userList.length - 1, 0)]
        // const truncatedWord = lastWord.slice(0, Math.max(lastWord.length - 1, 0))
        // setActiveWord(truncatedWord)
        setUserList([...userList.slice(0, Math.max(userList.length - 1, 0))]);
    }


    return (
        <div className='h-60 rounded-xl border-2 w-[80%] overflow-y-scroll '>
            <div className='w-full h-full inline-flex items-baseline flex-wrap gap-3 p-8 border-sky-50 text-4xl font-semibold'>

                {wordList.map((word, idx) => {
                    if (idx > userList.length) {
                        return <InactiveWord key={idx} word={word} />
                    } else if (idx == userList.length) {
                        return <ActiveWord
                            key={idx}
                            word={word}
                            // userWordString={activeWord}
                            userWordString={''}
                            addWord={addWord}
                            removeWord={removeWord} />
                    } else
                        return (<TypedWord key={idx} userWord={userList[idx]} realWord={word} />)
                })}
            </div>
        </div>
    )
}
