"use client";
import Image from "next/image";
import ThemeToggle from "../common/themeChanger";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Navbar({ title }: { title: string }) {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter()
    const pathname = usePathname();


    useEffect(() => {
        // Ensuring the component is mounted before checking the path
        setIsMounted(true);
    }, []);


    if (!isMounted) {
        return null;
    }
    const handleClick = () => {
        if (isMounted && pathname !== '/') {
            router.push('/');
        }
    };
    return (
        <div className="w-full p-2 z-50 flex justify-between items-center shadow-md">
            <Image
                onClick={handleClick}
                className="bg-transparent cursor-pointer"
                height={40}
                width={40}
                alt="Home"
                src={'/home.png'}
            />
            <h1 className="text-4xl ">{title}</h1>
            <ThemeToggle />

        </div>
    );
}

