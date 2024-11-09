import { useContext, useEffect, useRef } from "react";
import { PageContext } from "../context/PageContext";

export default function BlurryScreen({ children }: any) {
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
        <div className={`relative h-60 w-[80%] rounded-xl `}>
            {!isFocused && <div ref={BlurryRef}
                className={`absolute inset-0  h-[16rem] flex justify-center items-center
                                transform -translate-y-[1.55rem]
                                scale-x-110
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
