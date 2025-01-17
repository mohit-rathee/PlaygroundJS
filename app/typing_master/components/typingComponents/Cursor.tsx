import { useCallback, useContext, useEffect, useState } from "react"
import { ArenaContext } from "../../context/ArenaContext"
import { PageContext } from "../../context/PageContext"

export default function Cursor() {
    const { scrollableRef, cursorPositonRef, cursorRef } = useContext(ArenaContext)
    const { isFocused, isRunning, setIsRunning, setIsFocused } = useContext(PageContext)
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
            document.body.style.cursor = 'default'
        })
    }, [isFocused, isRunning, setIsRunning])
    useEffect(() => {
        setIsFocused(true)
    })
    const replaceCursor = useCallback(() => {
        if (cursorPositonRef.current && cursorRef.current && scrollableRef.current) {
            const cursor = cursorPositonRef.current.getBoundingClientRect()
            const scrollDiv = scrollableRef.current
            const scrollRect = scrollDiv.getBoundingClientRect()
            const left = cursor.left - scrollRect.left
            const top = cursor.top - scrollRect.top + scrollDiv.scrollTop
            cursorRef.current.style.top = `${top}px`;
            cursorRef.current.style.left = `${left}px`;
        }
    }, [cursorPositonRef, cursorRef, scrollableRef])
    useEffect(() => {
        replaceCursor()
    })
    useEffect(() => {
        window.addEventListener('resize', replaceCursor)
        return (() => {
            window.removeEventListener('resize', replaceCursor)
        })
    }, [replaceCursor])
    {/* animate-blink */ }
    return (
        <>
            {isFocused &&
                <div ref={cursorRef} className={`${blink ? 'animate-blink' : ''} 
                            -translate-x-[0.125rem] -translate-y-[2.7rem]
                            xl:h-14 xl:-translate-y-[2.7rem] xl:w-[0.3rem]
                            lg:h-14 lg:-translate-y-[2.7rem] lg:w-[0.3rem]
                            md:h-9 md:-translate-y-[2.0rem] md:w-[0.2rem]
                            sm:h-8 sm:-translate-y-[1.5rem] sm:w-[0.2rem]
                            absolute z-10 rounded-sm 
                            dark:bg-yellow-300 bg-gray-600`}
                    style={{ transition: 'top 0.125s ease, left 0.125s ease' }}
                />
            }
        </>
    )
}
