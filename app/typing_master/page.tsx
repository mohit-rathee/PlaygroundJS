"use client"
import '../globals.css';
import HomeTemplate from '../components/layout/HomeTemplate';
import { useState } from 'react';
export default function Home() {
    return (
        <HomeTemplate title="Typing Master" >
            <Page />
        </HomeTemplate>
    );
}


function Page() {
    const [para, setPara] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ")
    return (
        <div className='w-full flex flex-col items-center justify-evenly h-screen bg-gray-300 dark:bg-gray-600'>
            <TopPallet />
            <WordsArena para={para} />
            <BottomPallet />
        </div>
    )
}
function Badge({ emoji, title,size='xl' }: any) {
    return (
        <span className={'p-8 text-gray-300 hover:text-yellow-200 cursor-pointer '
            +' text-'+size}>
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
function Word({ word, type, key }: { word: string, type: 'active' | 'correct' | 'incorrect' | 'inactive', key: number }) {
    let className = '';
    switch (type) {
        case 'active': className = 'dark:text-gray-50'; break;
        case 'correct': className = 'dark:text-green-300'; break;
        case 'incorrect': className = 'dark:text-red-300'; break;
        case 'inactive': className = 'dark:text-gray-400'; break;
    }
    return (
        <div className={className} key={key}>
            {word}
        </div>
    )
}
function WordsArena({ para }: { para: string }) {
    const words = para.split(' ')
    return (
        <div className='h-60 rounded-xl border-2 w-[80%] overflow-y-scroll '>
            <div className='w-full h-full flex flex-wrap gap-3 p-8 border-sky-50 text-4xl font-semibold'>
                {words.map((el, idx) => {
                    if (idx < 3) {
                        return (<Word key={idx} word={el} type={'correct'} />)
                    } else if (idx == 4) {
                        return (<Word key={idx} word={el} type={'incorrect'} />)
                    } else if (idx == 5) {
                        return (<Word key={idx} word={el} type={'active'} />)
                    } else if (idx > 6) {
                        return (<Word key={idx} word={el} type={'inactive'} />)
                    }
                })}
            </div>
        </div>
    )
}
function BottomPallet() {
    return (
        <div className='h-10 w-[70%] bg-gray-700  flex justify-around items-center text-center rounded-xl'>
            <Badge emoji={">"} title={""} size={'4xl'}/>
            <Badge emoji={"↻"} title={""} size={'4xl'}/>
            <Badge emoji={"⚠"} title={""} size={'4xl'}/>
            <Badge emoji={"⏭"} title={""} size={'4xl'}/>
        </div>
    )
}
