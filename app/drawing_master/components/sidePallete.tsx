import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

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
        <div className={`w-28 p-1 z-50 h-full items-center 
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
                name={'⊹'}
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
    const [isLineColorPallet, setLineColorVisible] = useState(false);
    const [isFillColorPallet, setFillColorVisible] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const lineColorPallet = document.getElementById('lineColorPallet');
            const fillColorPallet = document.getElementById('fillColorPallet');

            if (lineColorPallet && !lineColorPallet.contains(e.target as Node)) {
                setLineColorVisible(false);
            }

            if (fillColorPallet && !fillColorPallet.contains(e.target as Node)) {
                setFillColorVisible(false);
            }
        };

        // Add event listener only when any palette is visible
        if (isLineColorPallet || isFillColorPallet) {
            window.addEventListener('mousedown', handleClickOutside);
            console.log("adding event listenr")
        }

        // Clean up the event listener when both are false
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLineColorPallet, isFillColorPallet]);

    return (
        <div className="">
            <div className="flex items-center justify-between ">
                <Heading title="Line Color" size="text-md font-semibold" />
                <div className="relative">
                    <Color
                        color={color}
                        setColor={() => setLineColorVisible(!isLineColorPallet)}
                        size="h-10 w-10 border border-gray-300 rounded-full cursor-pointer"
                    />
                    {isLineColorPallet && (
                        <div
                            id="lineColorPallet"
                            className="absolute top-0 left-12 z-10 m-2 rounded-lg"
                        >
                            <HexColorPicker color={color} onChange={setColor} />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center ">
                <Heading title="Fill Shape" size=" font-semibold " />
                <button
                    className={`w-12 h-5 rounded-full transition-colors duration-300 focus:outline-none 
        ${isFill ? 'bg-blue-500' : 'bg-gray-300'}`}
                    onClick={() => setIsFill(!isFill)}
                >
                    <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300
            ${isFill ? 'translate-x-5' : 'translate-x-0.5'}`}
                    />
                </button>
            </div>


            <div className="flex items-center justify-between">
                <Heading title="Fill Color" size="text-md font-semibold" />
                <div className="relative">
                    <Color
                        color={fillColor}
                        setColor={() => setFillColorVisible(!isFillColorPallet)}
                        size="h-10 w-10 border border-gray-300 rounded-full cursor-pointer"
                    />
                    {isFillColorPallet && (
                        <div
                            id="fillColorPallet"
                            className="absolute top-0 border-gray-300 left-12 z-10 m-2 rounded-lg"
                        >
                            <HexColorPicker color={fillColor} onChange={setFillColor} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
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
                        step="2"
                        max="20"
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
