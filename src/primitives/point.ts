export class Point {
    constructor(
        public x: number,
        public y: number,
    ) {}

    equals(point: Point): boolean {
        const { x, y } = point;

        return this === point
            || this.containsXY(x, y);
    }

    containsXY(x: number, y: number): boolean {
        return this.x === x
            && this.y === y;
    }
}