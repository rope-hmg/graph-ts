import { Point } from "../primitives/point";

export type Point_Options = {
    size?: number,
    colour?: string | CanvasGradient | CanvasPattern,

};

export function draw_point(
    context: CanvasRenderingContext2D, 
    x: number,
    y: number,
    { 
        size = 18,
        colour = "black",
    }: Point_Options = {},
): void {
    const radius = size / 2;

    context.fillStyle = colour;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
}