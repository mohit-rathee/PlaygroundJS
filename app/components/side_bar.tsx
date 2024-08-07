export default function Board({ undo, redo, save/* , strokePointer, layerLength */}: boardProp): JSX.Element {
    return (
        <div className='w-1/5 pt-2 h-full flex flex-col bg-sky-50 rounded-sm'>
            <div className='text-center  h-10'>Dashboard</div>
            <div className='flex-1 h-full overflow-y-auto px-5 border-2 border-gray-300'>
                <button className='bg-blue-200 m-2 p-2 rounded-md border-1'
                    onClick={undo}
                >
                    undo
                </button>
                <button className='bg-blue-200  m-2 p-2 rounded-md border-1'
                    onClick={redo}
                >
                    redo
                </button>
                <button className='bg-blue-200  m-2 p-2 rounded-md border-1'
                    onClick={save}
                >
                    save
                </button>
                {/* layer: {strokePointer.layer}<br /> */}
                {/* stroke: {strokePointer.stroke}<br /> */}
                {/* {layerLength.toString()}/200<br /> */}
            </div>
        </div>
    )
}
