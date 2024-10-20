"use client";
import Image from "next/image";

import ThemeToggle from "../common/themeChanger";

export default function Navbar({ title }: { title: string }) {

    return (
        <div className="w-full p-2 z-50 flex justify-between items-center">
            <Image
                className="cursor-pointer"
                height={50}
                width={50}
                alt="Home"
                src={'/playgroundJS.svg'}
            />
            <h1>{title}</h1>
            <ThemeToggle />

        </div>
    );
}

