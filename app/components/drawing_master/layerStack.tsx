import React from "react";

export const LayerStack = React.memo(({ canvasContainerRef, canvasRef, dimensions }: any) => {
    return (
        <div ref={canvasContainerRef}>
            <canvas className='fixed top-0 left-0 w-screen h-screen'
                ref={(el) => { canvasRef.current[0] = el }}
                width={dimensions.width}
                height={dimensions.height}
                style={{
                    background: 'transparent',
                }}
            />
        </div>
    )
})

export const MainCanvas = React.memo(({ mainCanvasRef, dimensions }: any) => {

    return (
        <canvas className='fixed top-0 left-0 w-screen h-screen'
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
