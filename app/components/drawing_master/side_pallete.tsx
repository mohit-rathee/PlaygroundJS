const colors = [
    'darkred',
    'darkblue',
    'gray',
    'darkgreen',
    'purple',
    'teal',
];
export default function SidePallete({ layerLength,strokePointer,onColorSelect, setLineWidth, lineWidth, undo, redo, save, rerenders }: any) {
    const handleSliderChange = (event: any) => {
        const value = event.target.value;
        setLineWidth(value);
    };
    console.log('layerLength: ',layerLength.current)

    return (
        <div className='w-28 p-2 z-50 h-full flex flex-col bg-gray-700 rounded-sm'>
            <span className="block mt-2 text-sky-50">
                Color:
            </span>
            <aside>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <div
                            key={color}
                            className="w-10 h-10 cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => onColorSelect(color)}
                        ></div>
                    ))}
                </div>
            </aside>
            <div>
                <span className="block mt-2 text-sky-50">
                    Size:
                </span>
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
                <button className='bg-blue-200 m-0.5 p-1 rounded-md border-1'
                    onClick={undo}
                >
                    undo
                </button>
                <button className='bg-blue-200 m-0.5 p-1 rounded-md border-1'
                    onClick={redo}
                >
                    redo
                </button>
                <button className='bg-blue-200 m-0.5 p-1 rounded-md border-1'
                    onClick={save}
                >
                    save
                </button>
            </div>
                Rerenders: {rerenders.toString()}<br />
                layerLength:{layerLength.current.toString()}<br />
                layer:{strokePointer.current.layer}<br />
                stroke_id:{strokePointer.current.stroke_id}<br />
        </div>
    );
};
