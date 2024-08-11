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

export function draw_by_image(canvasRef, canvas_no, imgData) {
    const canvas = canvasRef.current[canvas_no]
    const context = canvas.getContext('2d')
    const img = new Image()
    img.src = imgData
    img.onload = () => {
        context?.drawImage(img, 0, 0);
    }

}
export function draw_by_points(canvasRef, canvas_no, stroke) {
    const canvas = canvasRef.current[canvas_no]
    const context = canvas.getContext('2d')
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
