"use client"
import PageProvider from "../context/PageContext"
import { BottomPallet, TopPallet } from "./Pallets"
import TypingArena from "./TypingArena"
import { Inter } from '@next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function TypingMaster() {
    return (
        <PageProvider>
            <div className={`${inter.className} w-full h-[calc(100vh-3.5rem)] 
                            flex flex-col items-center 
                            justify-evenly bg-gray-300 dark:bg-gray-600`} >
                <TopPallet />
                <TypingArena />
                <BottomPallet />
            </div>
        </PageProvider>

    )
}
