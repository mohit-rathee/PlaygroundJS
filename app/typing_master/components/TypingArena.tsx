import { useState } from "react"
import { ActiveWord, InactiveWord, TypedWord } from "./Word"
export default function TypingArena({ para }: { para: string }) {
    const wordList = para.split(' ')
    const [userList, setUserList] = useState<string[]>([])
    console.log(userList)
    const [activeWord, setActiveWord] = useState<string>('')
    const addWord = (word: string) => {
        setActiveWord('')
        setUserList([...userList, word])
    }
    const jumpBack = (removeWord = false) => {
        const lastIdx = userList.length - 1
        const lastWord = lastIdx >= 0 ? userList[lastIdx] : ''
        // const truncatedWord = lastWord.slice(0, Math.max(lastWord.length - 1, 0))
        if (removeWord)
            setActiveWord('')
        else
            setActiveWord(lastWord)
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
                            userWordString={activeWord}
                            addWord={addWord}
                            removeWord={jumpBack} />
                    } else
                        return (<TypedWord key={idx} userWord={userList[idx]} realWord={word} />)
                })}
            </div>
        </div>
    )
}
