import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, CartesianGrid } from 'recharts';
import { useContext } from "react"
import { PageContext } from "../context/PageContext"
import { calculateResult } from '../utils/result_utils';

const styles: any = {
    'large': {
        h_width: 'text-5xl',
        c_width: 'text-7xl'
    },
    'mid': {
        h_width: 'text-3xl',
        c_width: 'text-6xl'
    },
    'small': {
        h_width: 'text-2xl',
        c_width: 'text-5xl'
    },
}
function Block({ heading, content, type }: any) {
    const styl: { h_width: string, c_width: string } = styles[type]
    //w-[${styl.width}]
    return (
        <div className='flex flex-col mt-0 m-4 w-full'>

            <div className={` text-gray-400 ${styl.h_width}`}>
                {heading}
            </div>
            <div className={` text-yellow-500 ${styl.c_width}`}>
                {content}
            </div>
        </div>
    )
}
export function Result() {
    const { gameInfo } = useContext(PageContext)
    if (gameInfo.type != 'result') return
    const result = calculateResult(gameInfo)
    return (
        <>
            {/* <div>{dots}{'-'}{msInSteps}</div> */}
            <div className="absolute w-[100%] top-[15%] flex flex-col h-auto p-5 ">
                <div className="flex flex-row h-full p-5 ">
                    <div className='flex flex-col justify-around w-[25%]'>
                        <Block type='large' heading='wpm' content={result.wpm} />
                        <Block type='large' heading='acc' content={`${result.accuracy}%`} />
                    </div>
                    <MyLineChart data={result.graphData} />
                </div>
                <div className="w-full justify-around  flex flex-row h-auto px-5 ">
                    <Block type='mid' heading='time' content={`${result.time}s`} />
                    <Block type='mid' heading='raw' content={`${result.raw}`} />
                    <Block type='mid' heading='remark' content={
                        `${result.remark.correct}/${result.remark.error}/${result.remark.left}/${result.remark.overflow}`
                    } />
                </div>
            </div>
        </>
    );
}

const MyLineChart = ({ data }: { data: { timestamps: number; correct: number }[] }) => {
    const ticks = data.map((d) => d.timestamps);
    console.log(ticks)
    return (
        <ResponsiveContainer width="100%" aspect={3} className='border-0'>
            <LineChart data={data}>
                <defs>
                    <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="blue" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="blue" stopOpacity={0.0} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical='' horizontal='true' />
                <XAxis
                    dataKey="timestamps"
                    // type='number'
                    // domain={['dataMin', 'dataMax']}
                    // ticks={ticks}
                    label={{
                        value: 'Timestamps',
                        position: 'insideBottom',
                        offset: -5,

                    }}
                    tick={{ fill: '#9CA3AF', fontSize: 18, }}

                />
                <YAxis
                    yAxisId="left"
                    label={{
                        value: 'Correct',
                        angle: -90,
                        position: 'insideLeft'
                    }}
                    tick={{ fill: '#9CA3AF', fontSize: 18, }}
                />
                <YAxis
                    yAxisId="right"
                    orientation='right'
                    label={{
                        value: 'Errors',
                        angle: 90,
                        position: 'insideRight'
                    }}
                // tick={{ fill: '#9CA3AF', fontSize: 18, }}
                />
                <Tooltip
                    cursor={false}
                    contentStyle={{
                        backgroundColor: "black",
                        color: "#9CA3AF",
                        borderRadius: "8px",
                        padding: "10px",
                        border: "none"
                    }} />



                <Line
                    yAxisId="left"
                    type="natural"
                    dataKey="gross"
                    fill='gray'
                    opacity={1}
                    stroke="gray"
                    strokeWidth={5}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                />
                <Line
                    yAxisId="left"
                    type="natural"
                    dataKey="correct"
                    stroke="#E2B714"
                    strokeWidth={5}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}

                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="incorrect"
                    stroke="red"
                    strokeWidth={0}
                    dot={<CustomDot width={5} />}
                    activeDot={<CustomDot width={7} />}
                    isAnimationActive={false} // Optional: disables animation for dots
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
const CustomDot = (props) => {
    const { cx, cy, value, width } = props;

    // Skip rendering for `value === 0`
    if (value === 0) return null;

    return (
        <svg x={cx - 5} y={cy - 5} width={10} height={10} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="2" x2="20" y2="20" stroke="red" strokeWidth={width} />
            <line x1="20" y1="2" x2="2" y2="20" stroke="red" strokeWidth={width} />
        </svg>
    );
};
