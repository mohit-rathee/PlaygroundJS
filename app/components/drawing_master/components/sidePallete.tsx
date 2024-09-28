import { color_choices } from "../utils/initials";

export default function SidePallete({ mode, setMode, style, setStyle, onColorSelect, setLineWidth, lineWidth, undo, redo, save }: any) {
    const handleSliderChange = (event: any) => {
        const value = event.target.value;
        setLineWidth(value);
    };

    return (
        <div className='w-28 p-1 z-50 h-full justify-center items-center flex flex-col bg-gray-700 rounded-sm'>
            <div
                onClick={() => {
                    setMode('select')
                }}
                className={`p-1 m-1 rounded-md justify-between text-center border-2 bg-blue-200 w-14 cursor-pointer
                    ${mode === 'select' ? 'border-blue-800' : ''} `}
            >
                select
            </div>
            <PencilStack
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
                    {color_choices.map((color) => (
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
function Button({ isSelected, setMode, setStyle, style, name, mode }: any) {
    return (
        <div
            onClick={() => {
                setMode(mode)
                setStyle(style)
            }}
            className={`p-1 m-1 rounded-md text-center border-2 bg-blue-200 w-10 cursor-pointer
                ${isSelected ? 'border-blue-800' : ''} `}
        >
            {name}
        </div>
    )
}
function PencilStack({ mode, style, setMode, setStyle }: any) {
    const isPencilSelected = mode == 'drawPencil' ? true : false
    return (
        <>
            <span className="block text-sky-50">
                Style:
            </span>
            <div className="flex">
                <Button
                    isSelected={isPencilSelected && style == 'Normal'}
                    setMode={setMode}
                    setStyle={setStyle}
                    style={'Normal'}
                    name={'𝘓'}
                    mode={'drawPencil'}
                />
                <Button
                    isSelected={isPencilSelected && style == 'CatmullRom'}
                    setMode={setMode}
                    setStyle={setStyle}
                    style={'CatmullRom'}
                    name={'𞋎'}
                    mode={'drawPencil'}
                />
            </div>
        </>
    )
}
