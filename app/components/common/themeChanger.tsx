import { useEffect, useState } from "react";
import { MoonIcon } from "../common/MoonIcon";
import { SunIcon } from "../common/SunIcon";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="rounded-full p-2 shadow-lg 
                bg-gray-200  dark:bg-gray-600
                transition-all duration-300 ease-out transform"
            >
                <MoonIcon className="text-gray-600" />
            </button>

        )
    }
    return (
        <button
            onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
            className="rounded-full p-2 shadow-lg 
                bg-gray-200  hover:shadow-2xl hover:scale-110 
                hover:bg-gray-400 
                dark:bg-gray-600 dark:hover:bg-gray-400 
                transition-all duration-300 ease-out transform"
        >
            {resolvedTheme === 'light' ? (
                <MoonIcon className="text-gray-600" />
            ) : (
                <SunIcon className="text-gray-200" />
            )}
        </button>
    );
}

