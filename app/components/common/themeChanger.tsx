import { MoonIcon } from "../common/MoonIcon";
import { SunIcon } from "../common/SunIcon";
import { useTheme } from "next-themes";

export default function ThemeToggle({ buttonClass }: any) {
    const { resolvedTheme, setTheme } = useTheme()

    return (
        <button
            tabIndex={-1}
            onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
            className={buttonClass}
        >
            {resolvedTheme === 'light' ? (
                <MoonIcon className="text-gray-200" />
            ) : (
                <SunIcon className="text-gray-50" />
            )}
        </button>
    );
}

