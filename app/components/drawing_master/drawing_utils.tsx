export function redrawLayer(canvasRef: any, canvas_no: number, start: number, end: number, layerData: Layer) {
    const canvas = canvasRef.current[canvas_no]
    const context = canvas.getContext('2d')
    if (!context) return;
    if (start == 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    for (let i = start; i < end; i++) {
        const stroke = layerData.strokes[i]
        const stroke_points = stroke.coordinates
        context.beginPath();
        context.strokeStyle = stroke.color.toString();
        context.lineWidth = stroke.width.valueOf()
        context.moveTo(stroke_points[0].x, stroke_points[0].y);
        stroke_points.forEach((point: point, index: number) => {
            if (index > 0) {
                context.lineTo(point.x, point.y);
            }
            context.stroke()
        });
    }
    context.closePath()
}

export function draw_by_image(
    canvasRef: React.RefObject<HTMLCanvasElement[]>,
    canvas_no: number,
    imgData: string) {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current[canvas_no]
    const context = canvas.getContext('2d')
    const img = new Image()
    img.src = imgData
    img.onload = () => {
        context?.drawImage(img, 0, 0);
    }

}
export function draw_by_points(
    canvasRef: React.RefObject<HTMLCanvasElement[]>,
    canvas_no: number,
    stroke: Stroke) {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current[canvas_no]
    const context = canvas.getContext('2d')
    if (!context) return;
    context.lineWidth = stroke.width
    const stroke_points = stroke.coordinates
    context.beginPath();
    context.strokeStyle = stroke.color.toString();
    context.lineWidth = stroke.width.valueOf()
    context.moveTo(stroke_points[0].x, stroke_points[0].y);
    stroke_points.forEach((point: point, index: number) => {
        if (index > 0) {
            context.lineTo(point.x, point.y);
        }
        context.stroke()
    });
    context.closePath()

}
export function save(canvasRef: canvas_ref) {
    console.log('save')
    const mergedCanvas = document.createElement('canvas');
    const mergedCtx = mergedCanvas.getContext('2d');

    console.log(canvasRef.current)
    if (!canvasRef.current) return
    const canvasArray = canvasRef.current
    const canvas = canvasArray[0]
    mergedCanvas.width = canvas.width;
    mergedCanvas.height = canvas.height;

    // Draw each canvas onto the merged canvas
    if (!mergedCtx) return;
    mergedCtx.fillStyle = "white"
    mergedCtx.fillRect(0, 0, mergedCanvas.width, mergedCanvas.height)
    canvasRef.current.forEach((canvas) => {
        mergedCtx.drawImage(canvas, 0, 0);
    });

    // Convert the merged canvas to an image
    const dataURL = mergedCanvas.toDataURL('image/jpeg');

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'drawing.jpg';
    link.click();
}
