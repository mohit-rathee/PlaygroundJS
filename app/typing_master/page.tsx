"use client"
import '../globals.css';
import HomeTemplate from '../components/layout/HomeTemplate';
import TypingArena from './components/TypingArena';
import { useState } from 'react';

const Paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. "

export default function Home() {
    return (
        <HomeTemplate title="Typing Master" >
            <Page />
        </HomeTemplate>
    );
}


function Page() {
    const [para, _setPara] = useState(Paragraph)
    return (
        <div className='w-full flex flex-col items-center justify-evenly h-screen bg-gray-300 dark:bg-gray-600'>
            <TopPallet />
            <TypingArena para={para} />
            <BottomPallet />
        </div>
    )
}
function Badge({ emoji, title, size = 'xl' }: any) {
    return (
        <span className={'p-8 text-gray-300 hover:text-yellow-200 cursor-pointer '
            + ' text-' + size}>
            {emoji} {title}
        </span>
    )
}
function TopPallet() {
    return (
        <div className='h-10 w-[80%] bg-gray-700  flex justify-evenly items-center text-center rounded-xl'>
            <Badge emoji={"#"} title={"numbers"} />
            <Badge emoji={"@"} title={"punctutaion"} />
            <Badge emoji={"⏱"} title={"time"} />
            <Badge emoji={"𝐀"} title={"words"} />
            <Badge emoji={"❝"} title={"quotes"} />
        </div>
    )
}
function BottomPallet() {
    return (
        <div className='h-10 w-[70%] bg-gray-700  flex justify-around items-center text-center rounded-xl'>
            <Badge emoji={">"} title={""} size={'4xl'} />
            <Badge emoji={"↻"} title={""} size={'4xl'} />
            <Badge emoji={"⚠"} title={""} size={'4xl'} />
            <Badge emoji={"⏭"} title={""} size={'4xl'} />
        </div>
    )
}
