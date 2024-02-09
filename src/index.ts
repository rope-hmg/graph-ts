import { Graph_Editor } from "./graph_editor";
import { Graph } from "./maths/graph";
import { Pool_Array } from "./pool_array";
import { Point } from "./primitives/point";
import { Segment } from "./primitives/segment";
import { Viewport } from "./viewport";

function main() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;
    
    canvas.width = 600;
    canvas.height = 600;

    const points = new Pool_Array(
        new Point(200, 200),
        new Point(500, 200),
        new Point(400, 400),
        new Point(100, 300),
    );

    const segments = new Pool_Array(
        new Segment(points[0], points[1]),
        new Segment(points[0], points[2]),
        new Segment(points[0], points[3]),
        new Segment(points[1], points[2]),
    );

    const graph = new Graph(points, segments);
    const viewport = new Viewport(canvas, context);
    const editor = new Graph_Editor(viewport, graph);

    function render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.scale(1 / viewport.zoom, 1 / viewport.zoom);
        context.translate(viewport.offsetX, viewport.offsetY);
        editor.draw(context);
        graph.draw(context);
        context.restore();

        requestAnimationFrame(render);
    }
    
    render();
}

main();