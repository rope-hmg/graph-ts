import { Segment } from "../primitives/segment";

export type Segment_Options = {
    width?: number,
    colour?: string | CanvasGradient | CanvasPattern,
    dash?: number[],
};

export function draw_segment(
    context: CanvasRenderingContext2D,
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number,
    { 
        width = 2,
        colour = "black",
        dash = [],
    }: Segment_Options = {},
): void {
    context.beginPath();
    context.lineWidth = width;
    context.strokeStyle = colour;
    context.setLineDash(dash),
    context.moveTo(p1x, p1y);
    context.lineTo(p2x, p2y);
    context.stroke();
    context.setLineDash([]);
}