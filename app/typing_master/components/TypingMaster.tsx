"use client"
import PageProvider from "../context/PageContext"
import { BottomPallet, TopPallet } from "./Pallets"
import MainScreen from "./MainScreen"
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function TypingMaster() {
    return (
        <PageProvider>
            <div className={`${inter.className} w-full h-[100vh]
                            flex flex-col items-center 
                            justify-center bg-gray-400 dark:bg-dark-bag`} >
                <TopPallet />
                <MainScreen />
                <BottomPallet />
            </div>
        </PageProvider>

    )
}
