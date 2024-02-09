import { draw_point } from "../graphics/point";
import { draw_segment } from "../graphics/segment";
import { Pool_Array } from "../pool_array";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

export class Graph {
    constructor(
        private points = new Pool_Array<Point>(),
        private segments = new Pool_Array<Segment>(),
    ) {}

    getNearestPoint(x: number, y: number): [Point | undefined, number] {
        let nearestPoint: Point | undefined;
        let nearestDistance = Infinity;

        for (const point of this.points) {
            const dx = point.x - x;
            const dy = point.y - y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq < nearestDistance) {
                nearestPoint = point;
                nearestDistance = distanceSq;
            }
        }

        return [nearestPoint, Math.sqrt(nearestDistance)];
    }

    pointCount(): number {
        return this.points.activeLength;
    }

    segmentCount(): number {
        return this.segments.activeLength;
    }

    containsPoint(x: number, y: number): boolean {
        let found = false;

        const points = this.points;
        const pointCount = this.pointCount();

        for (
            let i = 0;
            i < pointCount && !found;
            i += 1
        ) {
            found = points[i].containsXY(x, y);
        }

        return found;
    }

    containsSegment(p1: Point, p2: Point): boolean {
        let found = false;

        const { points, segments } = this;
        const segmentCount = this.segmentCount();

        for (
            let i = 0;
            i < segmentCount && !found;
            i += 1
        ) {
            const segment = segments[i];

            found = segment.containsPoint(p1)
                &&  segment.containsPoint(p2);
        }

        return found;
    }

    private addPoint(x: number, y: number): Point {
        return this.points.grow(
            (point) => {
                point.x = x;
                point.y = y;
            },
            () => new Point(x, y)
        );
    }

    private removePoint(pointIndex: number): void {
        const { points, segments } = this;

        const point = points.swapRemove(pointIndex);
        
        for (let i = this.segments.activeLength - 1; i >= 0; i -= 1) {
            if (segments[i].containsPoint(point)) {
                this.tryRemoveSegment(i);
            }
        }
    }

    private addSegment(p1: Point, p2: Point): void {
        this.segments.grow(
            (segment) => {
                segment.p1 = p1;
                segment.p2 = p2;
            },
            () => new Segment(p1, p2),
        );
    }

    tryAddPoint(x: number, y: number): Point | undefined {
        const spotAvailable = !this.containsPoint(x, y);
        let addedPoint: Point | undefined;

        if (spotAvailable) {
            addedPoint = this.addPoint(x, y);
        }

        return addedPoint;
    } 
    
    tryAddSegmentPoints(p1: Point, p2: Point): boolean {
        const spotAvailable = !p1.equals(p2) && !this.containsSegment(p1, p2);

        if (spotAvailable) {
            this.addSegment(p1, p2);
        }

        return spotAvailable;
    }

    tryAddSegmentIndexes(p1: number, p2: number): boolean {
        let spotAvailable = p1 !== p2;
        
        const point1 = this.points[p1];
        const point2 = this.points[p2];

        spotAvailable = !!point1 && !!point2;

        if (spotAvailable) {
            spotAvailable = !this.containsSegment(point1, point2);

            if (spotAvailable) {
                this.addSegment(point1, point2);
            }
        }

        return spotAvailable;
    }

    tryRemovePoint(point: Point): boolean {
        const pointIndex = this.points.indexOf(point);
        const validIndex = pointIndex !== -1;

        if (validIndex) {
            this.removePoint(pointIndex);
        }

        return validIndex;
    }

    tryRemovePointByIndex(pointIndex: number): boolean {
        const validIndex = pointIndex >= 0 && pointIndex < this.points.activeLength;

        if (validIndex) {
            this.removePoint(pointIndex);
        }

        return validIndex;
    }

    tryRemoveSegment(segmentIndex: number): boolean {
        const validIndex = segmentIndex >= 0 && segmentIndex < this.segments.activeLength;

        if (validIndex) {
            this.segments.swapRemove(segmentIndex);
        }

        return validIndex;
    }

    dispose(): void {
        this.points.activeLength = 0;
        this.segments.activeLength = 0;
    }

    draw(context: CanvasRenderingContext2D): void {
        // TODO: Improve the rendering by batching similar objects
        for (const { p1, p2 } of this.segments) {
            draw_segment(context, p1.x, p1.y, p2.x, p2.y);
        }

        for (const { x, y } of this.points) {
            draw_point(context, x, y);
        }
    }
}