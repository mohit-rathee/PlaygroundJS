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
    const rCanvasPos = isDebugMode ? 'left-[50%]' : 'left-0';
    return (
        //TODO make widith to screen
        <>
            <canvas className='fixed top-0 left-0 h-screen border-r-2 border-black'
                ref={mainPCanvasRef}
                width={dimensions.width}
                height={dimensions.height}
                //TODO make it react to resizes
                style={{
                    background: 'transparent',
                    width: canvasWidth
                }}
            />
            <canvas className='fixed top-0 hidden h-screen border-r-2 border-black'
                ref={mainRCanvasRef}
                width={dimensions.width}
                height={dimensions.height}
                style={{
                    background: 'transparent',
                    width: canvasWidth,
                    left: rCanvasPos
                }}
            />
        </>
    )
})
MainCanvas.displayName = 'MainCanvas'
LayerStack.displayName = 'LayerStack'
