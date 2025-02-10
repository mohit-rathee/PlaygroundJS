"use client";
import '../globals.css';
import HomeTemplate from '../components/layout/HomeTemplate';
import { useEffect, useState } from 'react';
import { Jersey_25 } from 'next/font/google';
function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const blocks = 25
const mines = 5

function randomFunction(mines: number, blocks: any[]): boolean[] {
    let i = 0
    while (i < mines) {
        const random = getRandomInt(0, blocks.length - 1)
        if (blocks[random] == false) {
            blocks[random] = true
            i++
        }
    }
    return blocks
}
export default function Home() {
    const [blocksData, setBlocks] = useState<boolean[]>(Array(blocks).fill(false))
    const [openedData, setOpen] = useState<boolean[]>(Array(blocks).fill(false))

    useEffect(() => {
        const array = new Array(25).fill(false)
        const newArr = randomFunction(mines, array)
        setBlocks(newArr)
    }, [])

    return (
        <HomeTemplate title="Mine sweeper" >
            <>
                <div className='w-[100%] h-[90vh] items-center flex justify-center'>
                    <div className='w-80 h-80 p-2 rounded bg-gray-500 justify-center flex flex-wrap gap-2'>
                        {blocksData.map((is_mine: boolean, index: number) =>
                            <Block
                                key={index}
                                index={index}
                                isMine={is_mine}
                                isOpen={openedData[index]}
                                openBlock={() => {
                                    openedData[index] = true
                                    setOpen([...openedData])
                                }}
                            />
                        )}

                    </div>
                </div>
            </>
        </HomeTemplate>
    );
}

function Block({ isMine, isOpen, openBlock }: any) {
    const realColor = isMine ? 'bg-red-500' : 'bg-green-500'
    return (
        <div
            className={`w-12 h-12 rounded hover:scale-110 
                            ${isOpen ? realColor : 'bg-gray-700'} `}
            onClick={openBlock}
        ></div>
    )

}
