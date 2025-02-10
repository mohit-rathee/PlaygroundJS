import { useContext, useState } from "react"
import { PageContext } from "../context/PageContext"

const wordLength = [10, 25, 50, 100]
const quotesLength: Array<"short" | "medium" | "long" | "thick"> = ["short", "medium", "long", "thick"];

function CustomInput({ cancel }: any) {
    const { gameDispatch, typingContent, setIsFocused, isFocused } = useContext(PageContext)
    const [text, setText] = useState(typingContent.join(" "))
    return (
        <div
            id="CustomDiv"
            className={`absolute bg-gray-700 z-30 h-[50vh] w-[90%] 
                        flex flex-col justify-around items-center
                        rounded-xl p-4 text-xl `}
        >
            <textarea
                required
                onFocus={() => isFocused ? setIsFocused(false) : ''}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
                style={{ minHeight: '10rem' }}
                defaultValue={text}
                placeholder="Enter Custom Text"
                className={`w-full rounded-xl focus p-4 resize-y bg-gray-700 text-4xl
                            focus:ring-0 focus:outline-none max-h-80 overflow-auto`}
            />
            <div className="flex justify-around gap-10 w-[90%] mt-2">
                <button className="w-1/2 p-1 bg-gray-500 rounded-xl hover:scale-110"
                    onClick={() => cancel()}
                >
                    Cancel
                </button>
                <button className="w-1/2 p-1 bg-gray-500 rounded-xl hover:scale-110"
                    onClick={() => {
                        gameDispatch({ type: "setCustom", payload: text.trim() })
                        cancel()
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export function TopPallet() {
    const { gameInfo, gameDispatch, isRunning } = useContext(PageContext)
    const [isCustomInputVisible, setCustomVisible] = useState(false)
    return (
        <>
            {isCustomInputVisible &&
                <CustomInput
                    cancel={() => setCustomVisible(false)}
                />}
            <div className={`flex absolute top-[20vh] p-2 overflow-auto
                    dark:bg-gray-800 bg-gray-500 max-w-[90%]
                    xl:text-2xl lg:text-xl md:text-sm sm:text-xs 
                    justify-evenly items-center text-center rounded-xl
                        ${gameInfo.type == "result" ? 'opacity-0' : ''}
                        ${isRunning ? 'opacity-0' : ''}`}>
                {(gameInfo.type === 'words' || gameInfo.type === "custom") &&
                    <>
                        <Badge emoji={"#"} title={"numbers"}
                            isSelected={gameInfo.number}
                            onclick={() => { gameDispatch({ type: "toggleNumber" }) }}
                        />
                        <Badge emoji={"@"} title={"punctutaion"}
                            isSelected={gameInfo.punctuation}
                            onclick={() => { gameDispatch({ type: "togglePunctuation" }) }}
                        />
                        <Divider />
                    </>
                }

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
                        gameDispatch({ type: "setCustom", payload: "" })
                    }}
                    isSelected={gameInfo.type === 'custom'} />

                {gameInfo.type === 'words' &&
                    <>
                        <Divider />
                        {wordLength.map((length, idx) => (
                            <Badge emoji={""} title={length}
                                key={idx}
                                isSelected={gameInfo.length == length}
                                onclick={() => gameDispatch({
                                    type: 'setLength',
                                    length: length
                                }
                                )}
                            />
                        ))}
                    </>
                }
                {gameInfo.type === 'quotes' &&
                    <>
                        <Divider />
                        <Badge emoji={""} title={'all'}
                            onclick={() => gameDispatch({
                                type: 'setQuotesLength',
                                length: 'all'
                            }
                            )}
                        />
                        {quotesLength.map((length, idx) => (
                            <Badge emoji={""} title={length}
                                key={idx}
                                isSelected={
                                    gameInfo.length == length ||
                                    gameInfo.length == 'all'
                                }
                                onclick={() => gameDispatch({
                                    type: 'setQuotesLength',
                                    length: length
                                }
                                )}
                            />
                        ))}
                    </>
                }
                {gameInfo.type === 'custom' &&
                    <>
                        <Divider />
                        <div
                            onClick={() => setCustomVisible(!isCustomInputVisible)}
                            className='rounded-lg border-2 p-0.5 cursor-pointer'>
                            change
                        </div>
                    </>
                }
            </div >
        </>
    )
}
function Divider() {
    return (
        <div className='w-1 m-2 h-[80%] rounded-lg dark:bg-gray-200' />
    )
}
function Badge({ emoji, title, hover, onclick = () => {}, isSelected = false, tabIndex = -1 }: any) {
    return (
        <div className="relative inline-block group">
            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 
                text-white p-1 rounded text-lg opacity-0 group-hover:opacity-100 
                transition-opacity duration-200">
                {hover}
            </div>

            {/* Button */}
            <button
                tabIndex={tabIndex}
                className={`p-1.5 px-2 dark:text-word cursor-pointer 
                    ${isSelected ? 'text-word dark:text-yellow-200' : 'text-word'}
                    focus:text-yellow-500 focus:outline-white hover:text-yellow-200
                `}
                onClick={(e) => {
                    onclick();
                    if (e.target) (e.target as HTMLButtonElement).blur();
                }}
            >
                {emoji} {title}
            </button>
        </div>
    );
}

export function BottomPallet() {
    const { isRunning, gameInfo, gameDispatch } = useContext(PageContext)
    return (
        <>
            <div
                className={`absolute bottom-[3vh] w-auto text-4xl flex justify-around
                        items-center text-center rounded-xl
                        ${isRunning ? "opacity-0" : "opacity-80"}
                        `}>
                <div className="px-10 flex gap-24 ">
                    {gameInfo.type == "result" ?
                        <Badge
                            emoji={'>'}
                            hover={'next'}
                            tabIndex={1}
                            onclick={() => gameDispatch({ type: 'next' })}
                        /> :
                        <Badge
                            emoji={'↺'}
                            hover={'restart'}
                            tabIndex={1}
                            onclick={() => gameDispatch({ type: 'next' })}
                        />}
                    {/* Needs more focus, to compare the results */}
                    {/* <Badge emoji={"↻"} title={""}  */}
                    {/*     tabIndex={2}     */}
                    {/*     onclick={() => gameDispatch({ type: 'reload' })} */}
                    {/* /> */}
                    {/* <Badge emoji={"⚠"} title={""} /> */}
                    {/* <Badge emoji={"⏭"} title={""} /> */}
                    {/* <Badge emoji={"🏞"} title={""} /> */}
                </div>
            </div>
            <div className={`absolute bottom-[3%] right-[5%] bg-gray-800 p-2 
                            text-center rounded w-64 gap-24 text-xl
                    ${(isRunning || gameInfo.type == "result") ? 'opacity-0' : 'opacity-80'}`}>
                Shift+Space ={'>'} Restart
                <br />
                Shift+Enter  ={'>'} Submit
            </div>
        </>
    )
}
