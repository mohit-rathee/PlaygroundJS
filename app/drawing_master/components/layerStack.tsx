import React from "react";

export const LayerStack = React.memo(({ canvasContainerRef, refCanvasContainerRef }: any) => {
    return (
        <>
            <div ref={canvasContainerRef}> </div>
            <div ref={refCanvasContainerRef}> </div>
        </>
    )
})

export const MainCanvas = React.memo(({ mainPCanvasRef, mainRCanvasRef, dimensions, isDebugMode }: any) => {
    const canvasWidth = isDebugMode ? '50%' : '100%';
    const rCanvasPos = isDebugMode ? '50%' : '0';
    const rCanvasDisplay = isDebugMode ? 'block' : 'none';
    return (
        //TODO make widith to screen
        <div>
            <canvas className='fixed top-0 left-0 h-screen'
                ref={mainPCanvasRef}
                width={dimensions.width}
                height={dimensions.height}
                //TODO make it react to resizes
                style={{
                    background: 'transparent',
                    width: canvasWidth
                }}
            />
            {/* {isDebugMode && <hr className="z-50 absolute top-0 left-[50%] bg-gray-700 dark:bg-gray-300 h-full w-1" />} */}
            <canvas className='fixed top-0 hidden h-screen'
                ref={mainRCanvasRef}
                width={dimensions.width}
                height={dimensions.height}
                style={{
                    background: 'transparent',
                    width: canvasWidth,
                    left: rCanvasPos,
                    display: rCanvasDisplay
                }}
            />
        </div>
    )
})
MainCanvas.displayName = 'MainCanvas'
LayerStack.displayName = 'LayerStack'
