"use client";
import Image from "next/image";
import ThemeToggle from "../common/themeChanger";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";


export default function Navbar({ title }: { title: string }) {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter()
    const pathname = usePathname();
    const { resolvedTheme } = useTheme()


    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleClick = () => {
        if (pathname !== '/') {
            router.push('/')
        }
    };
    return (
        <div className="w-full h-14 bg-gray-400 dark:bg-gray-600 pl-5 p-2 z-50 flex justify-between items-center shadow-md">
            <Image
                onClick={handleClick}
                className="mx-4 mt-2 text-red-100 bg-transparent cursor-pointer scale-[2.5]"
                height={40}
                width={40}
                alt="PlaygroundJS"
                src={isMounted ?
                    resolvedTheme === 'light' ? '/light_home.svg' : '/dark_home.svg' :
                    'light_home.svg'
                }
            />
            <h1 className="lg:text-4xl sm:text-3xl text-center">{title}</h1>
            {isMounted ?
                <ThemeToggle
                    buttonClass={`  rounded-full p-2 shadow-lg bg-gray-600  
                                hover:shadow-2xl hover:scale-[1.3]
                                dark:bg-gray-400 
                                transition-all duration-300 ease-out transform
            `} /> :
                <button
                    className={`rounded-full p-4 shadow-lg 
                                bg-gray-600  dark:bg-gray-400 w-30 `}
                />
            }
        </div>
    );
}

