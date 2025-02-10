import { GameInfoType, Timestamps } from "../types"

const WPM = 60 / 5
const ns = 100
const items_in_1_sec = 1000 / ns
const LOW = 2
const MID = 10
const HIGH = 30

export function calculateResult(gameInfo: GameInfoType) {
    if (gameInfo.type != 'result') throw Error('idk')
    console.log(gameInfo.timestamps)
    const total_time = gameInfo.timestamps.length / items_in_1_sec
    const steps = 25
    let dots;
    if (total_time < LOW)
        dots = items_in_1_sec / 10 // 0.01 sec
    else if (total_time < MID)
        dots = items_in_1_sec / 2 // 0.5 sec
    else if (total_time < HIGH)
        dots = items_in_1_sec
    else
        dots = Math.floor(gameInfo.timestamps.length / steps)
    const aggregatedData = aggregateResut(dots, gameInfo.timestamps)
    console.log('aggregatedData', aggregatedData)

    const graphData = aggregatedData.map((v: any, idx: number) => {

        const prev = aggregatedData[idx - 1] ||
            { correct: 0, incorrect: 0, gross: 0, timestamps: 0 }
        const prev2 = aggregatedData[idx - 2] || prev
        const prev3 = aggregatedData[idx - 3] || prev2

        const correctTyped = v.correct - prev3.correct;
        const incorrectTyped = v.incorrect - prev3.incorrect;
        const gap = v.timestamps - prev.timestamps
        const totalTyped = Math.floor((correctTyped + incorrectTyped) / gap)

        // console.log('t', v.timestamps)
        // console.log('c', v.correct)
        // console.log('g', totalTyped)
        // console.log('letter in 1 sec', v.correct / v.timestamps)
        // console.log('----')
        return {
            // timestamps: (total_time > Low) ? Math.round(v.timestamps) : v.timestamps,
            timestamps: (total_time > MID) ? Math.round(v.timestamps) : v.timestamps,
            speed: Math.floor(((v.correct - prev.correct) * WPM)),
            correct: Math.max(
                Math.floor((v.correct  / v.timestamps) * WPM),
                Math.floor(((v.correct - v.incorrect) / v.timestamps) * WPM)
            ),
            incorrect: v.incorrect - prev.incorrect,
            gross: totalTyped / Math.min(idx + 1, 3) * WPM
        }
    })
    const lastResult = graphData[graphData.length - 1]
    const lastAggData = aggregatedData[aggregatedData.length - 1]
    const lastTimestamp = gameInfo.timestamps[gameInfo.timestamps.length - 1]
    const result = {
        wpm: lastResult.correct,
        graphData: graphData,
        time: lastResult.timestamps,
        accuracy: Math.round(Math.max(0, (1 - (lastAggData.incorrect / lastAggData.gross))) * 100),
        remark: {
            correct: lastTimestamp.correct,
            error: lastTimestamp.error,
            left: lastTimestamp.left,
            overflow: lastTimestamp.overflow,
        },
        raw: Math.floor(((lastAggData.correct + lastAggData.incorrect) / lastAggData.timestamps) * WPM)

    }
    return result
}

function aggregateResut(dots: number, timestamps: Timestamps[]) {
    console.log(timestamps)
    const aggData: {
        timestamps: number,
        correct: number,
        gross: number,
        incorrect: number
    }[] = []
    // console.log(dots)
    const state = {
        correct: 0,
        errors: 0,
        left: 0,
        overflow: 0,
    }
    const initialTime = timestamps[0].timestamps
    timestamps.forEach((stamp: Timestamps, index: number) => {
        state.correct = Math.max(state.correct, stamp.correct)
        state.left = Math.max(state.left, stamp.left)
        state.overflow = Math.max(state.overflow, stamp.overflow)
        state.errors = Math.max(state.errors, stamp.error)
        if (index + 1 == timestamps.length || (index > 0 && index % dots == 0)) {
            console.log('timestamps', stamp)
            aggData.push({
                // timestamps: (stamp.timestamps - initialTime)/1000,
                timestamps: index / items_in_1_sec,
                correct: state.correct,
                gross: state.correct + state.errors + state.overflow,
                incorrect: state.errors + state.overflow + state.left
            })
            state.correct = 0
            state.errors = 0
            state.left = 0
            state.overflow = 0
        }
    });

    const lastStamp = aggData.pop()
    if (!lastStamp) throw Error('lastStamp not found')
    if (dots != 1 && !Number.isInteger(lastStamp?.timestamps))
        aggData.pop()
    aggData.push(lastStamp)

    return aggData
}
