export class Pool_Array<T> extends Array<T> {
    activeLength = 0;

    constructor(...items: T[]); 
    constructor(arrayLength: number); 
    constructor();
    constructor(...items: T[] | [number] | []) { 
        super(...items as any);

        switch (items.length) {
            case 0: break;
            case 1: {
                const [maybeArrayLength] = items;

                this.activeLength = (typeof maybeArrayLength === "number") 
                    ? maybeArrayLength
                    : 1;

                break;
            }
            default: {
                this.activeLength = items.length;
                break;
            }
        }
    }

    last(): T | undefined {
        return this[this.activeLength - 1];
    }

    swapRemove(index: number): T {
        const end = this.activeLength - 1;
        const item = this[index];

        this[index] = this[end];
        this[end] = item;

        this.activeLength -= 1;

        return item;
    }

    grow(onActive: (item: T) => void, onNew: () => T): T {
        let item: T;

        if (this.length > this.activeLength) {
            item = this[this.activeLength];
            onActive(item);
        } else {
            item = onNew();
            super.push(item);
        }

        this.activeLength += 1;

        return item;
    }

    push(item: T): number {
        if (this.length > this.activeLength) {
            this[this.activeLength] = item;
        } else {
            super.push(item);
        }

        this.activeLength += 1;

        return this.activeLength;
    }

    pop(): T | undefined {
        let item: T | undefined;

        if (this.activeLength > 0) {
            this.activeLength -= 1;

            item = this[this.activeLength];
        }
        
        return item;
    }

    *[Symbol.iterator](): IterableIterator<T> {
        for (let i = 0; i < this.activeLength; i += 1) {
            yield this[i];
        }
    }
}