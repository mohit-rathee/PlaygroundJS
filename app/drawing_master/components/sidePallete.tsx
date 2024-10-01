import { useEffect, useState } from "react";
import { COLOR_CHOISES } from "../utils/initials";

export default function SidePallete({
    mode,
    setMode,
    lineColor,
    setLineColor,
    fillColor,
    setFillColor,
    lineWidth,
    setLineWidth,
    isFill,
    setIsFill,
    undo,
    redo,
    save
}: any) {

    return (
        <div className={`w-28 p-1 z-50 h-full justify-center items-center 
                        flex flex-col bg-gray-700 rounded-sm`}>
            <ToolsBoard
                setMode={setMode}
                mode={mode}
            />
            <ColorBoard
                color={lineColor}
                setColor={setLineColor}
                fillColor={fillColor}
                setFillColor={setFillColor}
                isFill={isFill}
                setIsFill={setIsFill}
            />
            <LineWidthBoard
                lineWidth={lineWidth}
                setLineWidth={setLineWidth}
            />
            <ActionBoard
                undo={undo}
                redo={redo}
                save={save}
            />
        </div>
    );
};
function Heading({ title, size }: any) {
    return (
        <span className={'flex justify-center items-center p-1 text-sky-50 ' + size}>
            {title}
        </span>
    )
}
function Color({ color: thisColor, currColor, setColor, size }: any) {
    return (
        <div key={thisColor}
            className={'w-10 h-10 cursor-pointer border-4 rounded ' + size +
                `${thisColor === currColor ? ' border-gray-800' : ' border-gray-400'}`}
            style={{ backgroundColor: thisColor }}
            onClick={() => setColor(thisColor)}
        ></div>
    )
}
function ColorPallet({ currColor, setColor }: any) {
    return (
        <div className="absolute h-24 w-36 p-1 flex flex-wrap justify-between bg-gray-400" >
            {COLOR_CHOISES.map((color) => (
                <Color
                    key={color}
                    color={color}
                    currColor={currColor}
                    setColor={setColor}
                />
            ))}
        </div>
    )
}
function Button({ setMode, name, mode, thisMode }: any) {
    const isSelected = mode == thisMode
    return (
        <div
            onClick={() => {
                setMode(thisMode)
            }}
            className={`p-1 my-0.5 mx-1 rounded-md text-center border-2 w-10 cursor-pointer
                ${isSelected ? 'border-white bg-red-200 border-4' : 'bg-blue-200'} `}
        >
            {name}
        </div>
    )
}
function ToolsBoard({ mode, setMode }: any) {
    return (
        <>
            <Heading
                title={'Tools'}
                size={'text-lg'}
            />
            <Button
                mode={mode}
                setMode={setMode}
                name={'➤'}
                thisMode={'select'}
            />
            <div className="flex flex-wrap justify-center">
                <Button
                    mode={mode}
                    setMode={setMode}
                    name={'𝘓'}
                    thisMode={'drawFreeForm'}
                />
                <Button
                    mode={mode}
                    setMode={setMode}
                    name={'𞋎'}
                    thisMode={'drawCatmullRom'}
                />
                <Button
                    mode={mode}
                    setMode={setMode}
                    name={'☖'}
                    thisMode={'drawPolygon'}
                />
                <Button
                    mode={mode}
                    setMode={setMode}
                    name={'☐'}
                    thisMode={'drawRectangle'}
                />
                <Button
                    mode={mode}
                    setMode={setMode}
                    name={'⃝'}
                    thisMode={'drawCircle'}
                />
            </div>
        </>
    )
}
function ColorBoard({ color, setColor, fillColor, setFillColor, isFill, setIsFill }: any) {
    const [isLineColorPallet, setLineColorVisible] = useState(false)
    const [isFillColorPallet, setFillColorVisible] = useState(false)
    useEffect(() => {
        setLineColorVisible(false)
    }, [color])
    useEffect(() => {
        setFillColorVisible(false)
    }, [fillColor])

    return (
        <>
            <div className="flex my-1">
                <Heading
                    title={'LineColor'}
                    size={'text-sm'}
                />
                <Color
                    color={color}
                    setColor={() => setLineColorVisible(true)}
                    size={'h-9 w-9'}
                />
                {isLineColorPallet && <ColorPallet
                    currColor={color}
                    setColor={setColor}
                />}
            </div>
            <div className="flex items-center">
                <Heading
                    title={'isFill'}
                    size={'text-s'}
                />
                <input
                    className="w-5 h-5 rounded"
                    type="checkbox"
                    checked={isFill}
                    onChange={(e)=>setIsFill(e.target.checked)}
                />
            </div>
            <div className="flex my-1">
                <Heading
                    title={'FillColor'}
                    size={'text-sm'}
                />
                <Color
                    color={fillColor}
                    setColor={() => setFillColorVisible(true)}
                    size={'h-9 w-9'}
                />
                {isFillColorPallet && <ColorPallet
                    currColor={fillColor}
                    setColor={setFillColor}
                />}
            </div>
        </>
    )
}
function LineWidthBoard({ lineWidth, setLineWidth }: any) {
    const handleSliderChange = (event: any) => {
        const value = event.target.value;
        setLineWidth(value);
    };
    return (
        <>
            <span className="block mt-1 text-sky-50">
                Size:
            </span>
            <div>
                <div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={lineWidth}
                        onChange={handleSliderChange}
                        className="w-full"
                    />
                </div>
            </div>

        </>
    )
}
function ActionBoard({ undo, redo, save }: any) {
    return (
        <>
            <Heading
                title={'Action'}
            />
            <div className="flex flex-wrap justify-center">
                <button className='bg-blue-200 m-0.5 p-2 px-3 rounded-md border-1'
                    onClick={undo}
                >
                    ↺
                </button>
                <button className='bg-blue-200 m-0.5 p-2 px-3 rounded-md border-1'
                    onClick={redo}
                >
                    ↻
                </button>
                <button className='bg-blue-200 m-0.5 p-2 rounded-md border-1'
                    onClick={save}
                >
                    💾
                </button>
            </div>
        </>
    )
}
