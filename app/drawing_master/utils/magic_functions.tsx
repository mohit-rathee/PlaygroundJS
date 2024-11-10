import { COLOR_MAP_GAP } from "./initials";

export function intToRGBValue(n: number) {
    n = n * COLOR_MAP_GAP
    if (n < 0 || n > 16777215) {
        throw new Error('Number out of range. Must be between 0 and 16777215.');
    }
    const r = (n >> 16) & 0xFF;
    const g = (n >> 8) & 0xFF;
    const b = n & 0xFF;
    return [r, g, b]
}
export function intToRGBColor(n: number) {
    const [r, g, b] = intToRGBValue(n)
    return `rgb(${r}, ${g}, ${b})`;
}
export function rgbToINTColor(r: number, g: number, b: number) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        throw new Error('RGB values must be between 0 and 255.');
    }
    return ((r << 16) | (g << 8) | b) / COLOR_MAP_GAP;
}

export function catmullRom(p0: point, p1: point, p2: point, p3: point, t: number) {
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

export function distanceBtwPoints(a: point, b: point) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

function perpendicularDistance(point: point, lineStart: point, lineEnd: point) {
    const numerator = Math.abs((lineEnd.y - lineStart.y) * point.x - (lineEnd.x - lineStart.x) * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x);
    const denominator = Math.sqrt(Math.pow(lineEnd.y - lineStart.y, 2) + Math.pow(lineEnd.x - lineStart.x, 2));
    return numerator / denominator;
}

export function ramerDouglasPeucker(points: point[], epsilon: number): point[] {
    if (points.length <= 2) {
        return points;
    }

    let maxDistance = 0;
    let index = 0;
    const start = points[0];
    const end = points[points.length - 1];

    for (let i = 1; i < points.length - 1; i++) {
        const dist = perpendicularDistance(points[i], start, end);
        if (dist > maxDistance) {
            maxDistance = dist;
            index = i;
        }
    }

    if (maxDistance > epsilon) {
        const left = ramerDouglasPeucker(points.slice(0, index + 1), epsilon);
        const right = ramerDouglasPeucker(points.slice(index), epsilon);

        // Concatenate the two results (excluding the duplicate point)
        return left.slice(0, left.length - 1).concat(right);
    } else {
        // If the max distance is less than epsilon, return the endpoints
        return [start, end];
    }
}

export function createNewCanvas(dimensions: Dimensions, isP: boolean, onLeft: boolean) {
    const newCanvas = document.createElement('canvas')
    var newCanvasClassName = 'fixed top-0 image h-screen';
    if (onLeft) {
        newCanvasClassName += ' left-0'
    } else {
        newCanvasClassName += ' left-[50%]'

    }
    newCanvas.className = newCanvasClassName
    if (isP) {
        newCanvas.style.display = 'block'
    } else {
        newCanvas.style.display = 'none'
    }
    newCanvas.width = dimensions.width
    newCanvas.height = dimensions.height
    newCanvas.style.background = 'transparent'
    return newCanvas
}
export const throttle = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
    let lastCall = 0;
    return ((...args: any[]) => {
        const now = new Date().getTime();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    }) as T;
};
