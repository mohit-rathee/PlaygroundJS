import { useContext, useEffect, useState } from "react"
import { ArenaContext } from "../context/ArenaContext"
import { PageContext } from "../context/PageContext"

export default function Cursor() {
    const { scrollableRef, cursorPositonRef, cursorRef } = useContext(ArenaContext)
    const { isFocused, isRunning, setIsRunning } = useContext(PageContext)
    const [blink, setBlink] = useState(isRunning)
    useEffect(() => {
        if (isRunning) {
            document.body.style.cursor = 'none';
            setBlink(false)
        }
        else {
            document.body.style.cursor = 'default'
            setBlink(true)
        }
        // using Closure for storing lastP in isValidMove.
        let lastP: { x: number, y: number } | null = null;
        const isValidMove = (e: MouseEvent) => {
            if (!lastP) return
            const distance = Math.sqrt(
                Math.pow(e.clientX - lastP.x, 2) + Math.pow(e.clientY - lastP.y, 2));
            if (distance < 50) return false
            else return true
        }
        const handleMove = (e: MouseEvent) => {
            if (!lastP) lastP = { x: e.clientX, y: e.clientY }
            if (isValidMove(e)) {
                document.body.style.cursor = 'default'
                setBlink(true)
                setIsRunning(false)
            }
        }
        if (isRunning)
            document.addEventListener('mousemove', handleMove)
        return (() => {
            document.removeEventListener('mousemove', handleMove)
        })
    }, [isFocused, isRunning, setIsRunning])
    useEffect(() => {
        if (cursorPositonRef.current && cursorRef.current && scrollableRef.current) {
            const cursor = cursorPositonRef.current.getBoundingClientRect()
            const scrollDiv = scrollableRef.current
            const scrollRect = scrollDiv.getBoundingClientRect()
            const left = cursor.left - scrollRect.left
            const top = cursor.top - scrollRect.top + scrollDiv.scrollTop
            cursorRef.current.style.top = `${top}px`;
            cursorRef.current.style.left = `${left}px`;
        }
    })
    {/* animate-blink */ }
    return (
        <>
            {isFocused &&
                <div ref={cursorRef} className={`${blink ? 'animate-blink' : ''} 
                            -translate-x-[0.125rem] -translate-y-[2.8rem]
                            absolute z-10 w-[0.3rem] rounded-sm 
                            h-14 bg-yellow-300`}
                    style={{ transition: 'top 0.125s ease, left 0.125s ease' }}
                />
            }
        </>
    )
}
