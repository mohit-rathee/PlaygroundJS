import { useContext } from "react"
import { PageContext } from "../context/PageContext"
import { type } from "os"

export function TopPallet() {
    const { gameInfo, gameDispatch, isRunning } = useContext(PageContext)
    return (

        <div className={`flex max-w-[90%] w-auto bg-gray-700 xl:text-2xl 
                        lg:text-xl md:text-md sm:text-sm justify-evenly 
                        items-center text-center rounded-xl
                        ${isRunning ? 'hidden' : ''}`}>
            {gameInfo.type === 'words' &&
                <>
                    <Container width='[25%]'>
                        <Badge emoji={"#"} title={"numbers"}
                            isSelected={gameInfo.number}
                            onclick={() => { gameDispatch({ type: "toggleNumber" }) }}
                        />
                        <Badge emoji={"@"} title={"punctutaion"}
                            isSelected={gameInfo.punctuation}
                            onclick={() => { gameDispatch({ type: "togglePunctuation" }) }}
                        />
                    </Container>
                    <Divider />
                </>
            }
            <Container width='[60%]'>

                {/* <Badge emoji={"⏱"} title={"time"} /> */}

                <Badge emoji={"𝐀"} title={"words"}
                    onclick={() => { gameDispatch({ type: "setWords" }) }}
                    isSelected={gameInfo.type === 'words'} />

                <Badge emoji={"❝"} title={"quotes"}
                    onclick={() => { gameDispatch({ type: "setQuotes" }) }}
                    isSelected={gameInfo.type === 'quotes'} />

                <Badge emoji={"☯"} title={"coding"}
                    onclick={() => { gameDispatch({ type: "setZen" }) }}
                    isSelected={gameInfo.type === 'zen'} />

                <Badge emoji={"🛠"} title={"custom"}
                    onclick={() => {
                        gameDispatch({
                            type: "setCustom",
                            payload: "I Am Custom."
                        })
                    }}
                    isSelected={gameInfo.type === 'custom'} />

            </Container>
            {gameInfo.type === 'words' &&
                <>
                    <Divider />
                    <Container width='[5%]'>
                        <Badge emoji={""} title={"10"}
                            isSelected={gameInfo.length == 10}
                            onclick={()=>gameDispatch({ type: 'setLength', length: 10 })}
                        />
                        <Badge emoji={""} title={"25"}
                            isSelected={gameInfo.length == 25}
                            onclick={()=>gameDispatch({ type: 'setLength', length: 25 })}
                        />
                        <Badge emoji={""} title={"50"}
                            isSelected={gameInfo.length == 50}
                            onclick={()=>gameDispatch({ type: 'setLength', length: 50 })}
                        />
                        <Badge emoji={""} title={"100"}
                            isSelected={gameInfo.length == 100}
                            onclick={()=>gameDispatch({ type: 'setLength', length: 100 })}
                        />
                    </Container>
                </>
            }
        </div>
    )
}
function Divider() {
    return (
        <div className='w-1 h-[80%] rounded-lg dark:bg-gray-200' />
    )
}
function Container({ children, width }: any) {
    return (
        <div className={'px-4 flex gap-2 justify-evenly ' + 'w-' + width}>{children}</div>
    )
}
function Badge({ emoji, title, onclick = () => { }, isSelected = false }: any) {
    return (
        <span
            className={`py-2 text-gray-300 cursor-pointer 
                        ${isSelected ? 'text-yellow-200' : ''}`}
            onClick={onclick}
        >
            {emoji} {title}
        </span>
    )
}
export function BottomPallet() {
    const { isRunning, gameDispatch } = useContext(PageContext)
    return (
        <div
            className={`w-[70%] text-4xl bg-gray-700 flex justify-around
                        items-center text-center rounded-xl
                        ${isRunning ? 'hidden' : ''}`}>
            <Badge emoji={">"} title={""} 
                onclick={()=>gameDispatch({type:'reload'})}
            />
            <Badge emoji={"↻"} title={""} />
            <Badge emoji={"⚠"} title={""} />
            <Badge emoji={"⏭"} title={""} />
            <Badge emoji={"🏞"} title={""} />
        </div>
    )
}
