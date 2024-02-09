function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export class Viewport {
    public zoom = 1;
    public offsetX = 0;
    public offsetY = 0;

    public dragActive = false;
    public dragStartX = 0;
    public dragStartY = 0;


    constructor(
        public canvas: HTMLCanvasElement, 
        public context: CanvasRenderingContext2D,
    ) {
        canvas.addEventListener("wheel", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const direction = Math.sign(event.deltaY);
            this.zoom = clamp(this.zoom + direction * 0.1, 1, 5);
        });

        canvas.addEventListener("mousedown", (event) => {
            if (event.button === 1) {
                this.dragStartX = this.scaleValue(event.offsetX);
                this.dragStartY = this.scaleValue(event.offsetY);
                this.dragActive = true;
            }
        });

        canvas.addEventListener("mouseup", (event) => {
            if (event.button === 1) {
                this.dragActive = false;
            }
        });

        canvas.addEventListener("mousemove", (event) => {
            if (this.dragActive) {
                const x = this.scaleValue(event.offsetX);
                const y = this.scaleValue(event.offsetY);

                this.offsetX += x - this.dragStartX;
                this.offsetY += y - this.dragStartY;

                this.dragStartX = x;
                this.dragStartY = y;
            }
        });
    }

    transformX(x: number): number {
        return (x - this.offsetX) * this.zoom;
    }

    transformY(y: number): number {
        return (y - this.offsetY) * this.zoom;
    }

    scaleValue(value: number): number {
        return value * this.zoom;
    }
    
}