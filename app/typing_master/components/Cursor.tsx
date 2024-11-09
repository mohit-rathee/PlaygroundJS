import { useContext, useEffect } from "react"
import { ArenaContext } from "../context/ArenaContext"

export default function Cursor() {
    const { scrollableRef, cursorPositonRef, cursorRef } = useContext(ArenaContext)
    useEffect(() => {
        if (cursorPositonRef.current && cursorRef.current && scrollableRef.current) {
            const cursor = cursorPositonRef.current.getBoundingClientRect()
            const scrollDiv = scrollableRef.current
            const scrollRect = scrollDiv.getBoundingClientRect()
            const left = cursor.left - scrollRect.left
            const top = cursor.top - scrollRect.top + scrollDiv.scrollTop
            cursorRef.current.style.top = `${top}px`;
            cursorRef.current.style.left = `${left}px`;
        }else{
            console.log('cursorPositonRef not found')
        }
    })
    {/* animate-blink */ }
    return (
        <div ref={cursorRef} className={`relative z-10 w-[0.3rem] rounded-sm 
                                 -translate-x-[0.125rem] -translate-y-[3.25rem]
                                 h-16 bg-yellow-300`}
            style={{ transition: 'top 0.125s ease, left 0.125s ease' }}
        />
    )
}
