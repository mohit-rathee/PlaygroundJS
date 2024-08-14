export function intToRGBColor(n: number) {
    if (n < 0 || n > 16777215) {
        throw new Error('Number out of range. Must be between 0 and 16777215.');
    }
    const red = (n >> 16) & 0xFF;
    const green = (n >> 8) & 0xFF;
    const blue = n & 0xFF;
    return `rgb(${red}, ${green}, ${blue})`;
}
export function rgbToINTColor(r: number, g: number, b: number) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        throw new Error('RGB values must be between 0 and 255.');
    }
    return (r << 16) | (g << 8) | b;
}

