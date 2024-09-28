import { color_choices } from "../utils/initials";

export default function SidePallete({ options, selected, setSelected, onColorSelect, setLineWidth, lineWidth, undo, redo, save }: any) {
    const handleSliderChange = (event: any) => {
        const value = event.target.value;
        setLineWidth(value);
    };

    return (
        <div className='w-28 p-2 z-50 h-full flex flex-col bg-gray-700 rounded-sm'>
            {options.map((option: string) => (
                <div
                    key={option}
                    className={`p-1 rounded-md border-2 bg-blue-200 w-14 cursor-pointer
                ${selected === option ? 'border-blue-800' : 'border-blue-200'} `}
                    onClick={() => setSelected(option)}
                >{option}</div>
            ))}
            <span className="block mt-2 text-sky-50">
                Color:
            </span>
            <aside>
                <div className="flex flex-wrap gap-2">
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
        </div>
    );
};
