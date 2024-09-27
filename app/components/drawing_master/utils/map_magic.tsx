
export function intToRGBColor(n: number) {
    if (n < 0 || n > 16777215) {
        throw new Error('Number out of range. Must be between 0 and 16777215.');
    }
    const red = (n >> 16) & 0xFF;
    const green = (n >> 8) & 0xFF;
    const blue = n & 0xFF;
    return [red, green, blue]
    // return `rgb(${red}, ${green}, ${blue})`;
}
export function rgbToINTColor(r: number, g: number, b: number) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        throw new Error('RGB values must be between 0 and 255.');
    }
    return (r << 16) | (g << 8) | b;
}

export function catmullRom(p0:point, p1:point, p2:point, p3:point, t:number) {
        const t2 = t * t;
        const t3 = t2 * t;

        const x = 0.5 * ((2 * p1.x) +
                        (-p0.x + p2.x) * t +
                        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

        const y = 0.5 * ((2 * p1.y) +
                        (-p0.y + p2.y) * t +
                        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

        return { x, y };
}
