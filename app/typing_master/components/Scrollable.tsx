import { useContext, useEffect } from "react";
import { ArenaContext } from "../context/ArenaContext";
import { PageContext } from "../context/PageContext";

export default function Scrollable({ children }: any) {
    const { isRunning } = useContext(PageContext)
    const { activeWordRef, scrollableRef, userList, } = useContext(ArenaContext)

    //Automatic Scroll
    useEffect(() => {
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
    }, [userList, activeWordRef, scrollableRef])

    // scroll up when starting test
    useEffect(() => {
        if (isRunning && scrollableRef.current)
            scrollableRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
    }, [isRunning, scrollableRef])

    return (
        <div ref={scrollableRef}
            className={`absolute inset-0 h-full w-full overflow-hidden`}>
            {children}
        </div>
    )
}
