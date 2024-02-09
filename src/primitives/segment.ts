import { Point } from "./point";

export class Segment {
    constructor(public p1: Point, public p2: Point) {}

    equals(segment: Segment): boolean {
        const { p1, p2 } = segment;

        return this === segment
            || (this.containsPoint(p1) && this.containsPoint(p2));
    }

    containsPoint(point: Point): boolean {
        const { p1, p2 } = this;

        return p1.equals(point)
            || p2.equals(point);
    }
}