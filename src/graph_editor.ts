import { draw_point } from "./graphics/point";
import { draw_segment } from "./graphics/segment";
import { Graph } from "./maths/graph";
import { Pool_Array } from "./pool_array";
import { Point } from "./primitives/point";
import { Viewport } from "./viewport";

export class Graph_Editor {
    private nearest_point?: Point;
    private drag_point?: Point;
    private selection_history = new Pool_Array<Point>();
    private selected_point?: Point;

    private mouse_x?: number;
    private mouse_y?: number;

    private shift_down = false;
    private ctrl_down = false;

    constructor(
        private viewport: Viewport,
        private graph: Graph
    ) {
        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "Shift":
                    this.shift_down = true;
                    break;

                case "Control":
                    this.ctrl_down = true;
                    break;
            }
        });

        window.addEventListener("keyup", (event) => {
            switch (event.key) {
                // case "Escape":
                //     this.selected_point = undefined;
                //     this.nearest_point = undefined;
                //     break;

                // case "Delete" || "Backspace":
                //     if (this.selected_point) {
                //         this.graph.tryRemovePoint(this.selected_point);
                //         this.selected_point = undefined;
                //     }
                //     break;

                case "Shift":
                    this.shift_down = false;
                    break;

                case "Control":
                    this.ctrl_down = false;
                    break;
            }
        });

        viewport.canvas.addEventListener("mousemove", (event) => {
            this.mouse_x = viewport.transformX(event.offsetX);
            this.mouse_y = viewport.transformY(event.offsetY);

            const [nearest, distance] = graph.getNearestPoint(this.mouse_x, this.mouse_y);
            const SELECT_THRESHOLD = viewport.scaleValue(12);

            this.nearest_point = (nearest && distance <= SELECT_THRESHOLD)
                ? nearest
                : undefined;

            if (this.drag_point) {
                this.drag_point.x = this.mouse_x;
                this.drag_point.y = this.mouse_y;
            }
        });

        viewport.canvas.addEventListener("mousedown", (event) => {
            event.preventDefault();

            this.mouse_x = viewport.transformX(event.offsetX);
            this.mouse_y = viewport.transformY(event.offsetY);

            switch (event.button) {
                case 0: // Left mouse button
                    this.drag_point = this.nearest_point;

                    if (this.nearest_point) {
                        this.joinSelect(this.nearest_point);
                    } else {
                        const newPoint = graph.tryAddPoint(this.mouse_x, this.mouse_y);

                        if (newPoint) {
                            this.joinSelect(newPoint);
                        }
                    }
                    break;

                case 2: { // Right mouse button
                    if (this.selected_point) {
                        this.graph.tryRemovePoint(this.selected_point);
                        this.selected_point = this.selection_history.pop();
                        console.log(this.selection_history, this.selected_point);

                    } else if (this.nearest_point) {
                        this.graph.tryRemovePoint(this.nearest_point)

                        if (this.selected_point === this.nearest_point) {
                            this.selected_point = undefined;
                        }

                        this.nearest_point = undefined;
                    }
                    break;
                }
            }
        });

        viewport.canvas.addEventListener("mouseup", (event) => {
            if (event.button === 0) {
                this.drag_point = undefined;
            }
        });

        viewport.canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });
    }

    private joinSelect(point: Point): void {
        if (this.shift_down) {
            this.join(point);
            this.select(point);
        } else if (this.ctrl_down) {
            this.join(point);
        } else {
            this.select(point);
        }
    }

    private join(point: Point): void {
        if (this.selected_point && this.selected_point !== point) {
            this.graph.tryAddSegmentPoints(this.selected_point, point);
        }
    }

    private select(point: Point): void {
        if (this.selected_point) {
            this.selection_history.push(this.selected_point);
        }

        this.selected_point = point;
        this.nearest_point = point;
    }


    draw(context: CanvasRenderingContext2D): void {
        // Draw a ghost point and segment
        if (this.mouse_x && this.mouse_y) {
            if (!this.nearest_point) {
                if (this.shift_down) {
                    draw_point(context, this.mouse_x, this.mouse_y, { size: 22, colour: "rgba(0, 0, 0, 0.5)" });
                }

                draw_point(context, this.mouse_x, this.mouse_y, { size: 18, colour: "rgba(0, 0, 0, 0.5)" });
            }

            if ((this.shift_down || this.ctrl_down) && this.selected_point) {
                const { x, y } = this.selected_point;

                draw_segment(context, x, y, this.mouse_x, this.mouse_y, { width: 2, colour: "rgba(0, 0, 0, 0.5)", dash: [3, 3] });
            }
        }


        if (this.nearest_point) {
            const { x, y } = this.nearest_point;

            draw_point(context, x, y, { size: 22, colour: "yellow" });
        }

        // Draw an outline
        if (this.selected_point) {
            const { x, y } = this.selected_point;

            draw_point(context, x, y, { size: 22, colour: "white" });
        }
    }
}