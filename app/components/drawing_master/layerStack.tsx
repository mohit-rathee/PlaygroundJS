import React from "react";

export const LayerStack = React.memo(({ canvasContainerRef, refCanvasContainerRef }: any) => {
    return (
        <>
            <div ref={canvasContainerRef}> </div>
            <div ref={refCanvasContainerRef}> </div>
        </>
    )
})

export const MainCanvas = React.memo(({ mainCanvasRef, dimensions }: any) => {

    return (
        //TODO make widith to screen
        <canvas className='fixed top-0 left-0 w-[50%] h-screen border-r-2 border-black'
            ref={mainCanvasRef}
            width={dimensions.width}
            height={dimensions.height}
            //TODO make it react to resizes
            style={{
                background: 'transparent',
            }}
        />
    )
})
