import { COLOR_CHOISES } from "../utils/initials";

export default function SidePallete({ mode, setMode, style, setStyle, onColorSelect, setLineWidth, lineWidth, undo, redo, save }: any) {
    const handleSliderChange = (event: any) => {
        const value = event.target.value;
        setLineWidth(value);
    };

    return (
        <div className='w-28 p-1 z-50 h-full justify-center items-center flex flex-col bg-gray-700 rounded-sm'>
            <ToolsStack
                setMode={setMode}
                setStyle={setStyle}
                mode={mode}
                style={style}
            />
            <span className="block mt-2 text-sky-50">
                Color:
            </span>
            <aside>
                <div className="flex flex-wrap justify-center gap-2">
                    {COLOR_CHOISES.map((color) => (
                        <div
                            key={color}
                            className="w-10 h-10 cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => onColorSelect(color)}
                        ></div>
                    ))}
                </div>
            </aside>
            <span className="block mt-2 text-sky-50">
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
            <span className="block mt-2 text-sky-50">
                Actions:
            </span>
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
        </div>
    );
};
function Button({ setMode, name, mode, thisMode }: any) {
    const isSelected = mode == thisMode
    return (
        <div
            onClick={() => {
                setMode(thisMode)
            }}
            className={`p-1 m-1 rounded-md text-center border-2 w-10 cursor-pointer
                ${isSelected ? 'border-blue-800 bg-red-200' : 'bg-blue-200'} `}
        >
            {name}
        </div>
    )
}
function ToolsStack({ mode, setMode }: any) {
    return (
        <>
            <span className="block text-sky-50">
                Tools:
            </span>
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
