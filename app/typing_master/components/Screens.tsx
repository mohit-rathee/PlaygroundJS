import { useCallback, useContext, useEffect, useRef } from "react";
import { PageContext } from "../context/PageContext";
import { ArenaContext } from "../context/ArenaContext";

export function BlurryScreen({ children }: any) {
    const BlurryRef = useRef<HTMLDivElement>(null)
    const { isFocused, setIsFocused } = useContext(PageContext);
    useEffect(() => {
        function focusClick(e: MouseEvent) {
            if (BlurryRef.current &&
                BlurryRef.current.contains(e.target as Node))
                setIsFocused(true)
        }
        function focusPress() {
            if (!document.getElementById('CustomDiv'))
                setIsFocused(true)
        }
        window.addEventListener('click', focusClick)
        window.addEventListener('keypress', focusPress)
        return () => {
            window.removeEventListener('click', focusClick)
            window.removeEventListener('keypress', focusPress)
        }
    }, [setIsFocused, BlurryRef])
    return (
        <div className={`relative  m-16 w-[80%] rounded-xl 
                        xl:h-[13rem] lg:h-[12.5rem] md:h-[9.5rem] sm:h-[8.0rem]
`}>
            {!isFocused && <div ref={BlurryRef}
                className={`absolute inset-0 flex justify-center items-center
                                scale-x-110 scale-y-110
                                z-20 text-3xl text-gray-50
                                bg-gray-950 rounded-xl
                                hover:text-yellow-200
                                bg-opacity-50 backdrop-blur-sm`}>
                Click here or press any key to focus.
            </div>}

            {children}

        </div>
    )
}


export function Scrollable({ children }: any) {
    const { isRunning, typingContent } = useContext(PageContext)
    const { activeWordRef, scrollableRef, userList, } = useContext(ArenaContext)

    const scrollToCenter = useCallback(() => {
        if (!scrollableRef.current) return
        if (!activeWordRef.current) return
        const scrollDiv = scrollableRef.current
        const activeWord = activeWordRef.current
        const div_height = scrollDiv.clientHeight
        const active_word_height = activeWord.clientHeight
        const word_height = activeWord.offsetTop

        const scrollTo = + word_height - div_height / 2 + active_word_height / 2 + 10

        scrollDiv.scrollTo({
            top: scrollTo,
            behavior: 'instant'
        })
        //Automatic Scroll
    }, [activeWordRef, scrollableRef])

    useEffect(() => {
        scrollToCenter()
    })
    useEffect(() => {
        window.addEventListener('resize', scrollToCenter)
        return (() => {
            window.removeEventListener('resize', scrollToCenter)
        })
    }, [scrollToCenter])

    // useEffect(() => {
    //     if (isRunning && scrollableRef.current)
    //         scrollableRef.current.scrollIntoView({
    //             behavior: "smooth",
    //             block: "center"
    //         })
    // }, [isRunning, scrollableRef])

    return (
        <div className="flex items-baseline" >
            {isRunning &&
                <div className={` xl:text-5xl md:text-4xl sm:text-2xl
                    xl:ml-10 md:ml-9 sm:ml-9 
                    xl:-translate-y-16 md:-translate-y-14 sm:-translate-y-10
                    w-full h-auto  dark:text-yellow-300 text-gray-800 `} >
                    {userList.length} / {typingContent.length}
                </div>
            }
            <div ref={scrollableRef}
                className={`absolute inset-0 h-full w-full overflow-hidden`}>
                {children}
            </div>
        </div>
    )
}
