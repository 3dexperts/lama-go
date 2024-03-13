class LamaGoCore {
    private static DEFAULT_SIZE: number = 19;
    private currentParams: URLSearchParams;
    private size: number;

    public constructor() {
        const url = new URL(window.location.href);
        this.currentParams = url.searchParams;

        this.size = this.parseSize();
    }

    private parseSize(): number {
        let size = this.currentParams.get("size");
        if (size === null) {
            return LamaGoCore.DEFAULT_SIZE;
        } else {
            let parsedNumber = parseInt(size, 10);
            if (isNaN(parsedNumber)) {
                return LamaGoCore.DEFAULT_SIZE;
            } else {
                return parsedNumber;
            }
        }
    }

    public getSize(): number {
        return this.size;
    }
}

class LamaGoBoard {
    private board: HTMLElement | null;
    private boardEdges: HTMLElement | null;
    private delimiterXTemplate: HTMLTemplateElement | null;
    private delimiterYTemplate: HTMLTemplateElement | null;
    private stoneTemplate: HTMLElement | null;

    private stoneSize: number;
    private edgeSize: number;

    public constructor(size: number) {
        this.board = document.getElementById("board");
        this.boardEdges = document.getElementById("board-edges");
        this.delimiterXTemplate = document.getElementById("delimiter-x-template") as HTMLTemplateElement;
        this.delimiterYTemplate = document.getElementById("delimiter-y-template") as HTMLTemplateElement;
        this.stoneTemplate = document.getElementById("stone-template");

        this.stoneSize = 100 / (size - 1);
        this.edgeSize = this.stoneSize / 2;

        // Configure
        if (this.boardEdges !== null
            && this.delimiterXTemplate !== null) {
            // Edges
            this.boardEdges.style.top = this.edgeSize + "%";
            this.boardEdges.style.left = this.edgeSize + "%";
            this.boardEdges.style.width = (100 - this.stoneSize) + "%";
            this.boardEdges.style.height = this.boardEdges.style.width;

            // Generate rows and columns
            for (let i = 0; i < size; i++) {
                let cloneX = this.delimiterXTemplate.content.cloneNode(true) as HTMLElement;
                if (cloneX.firstElementChild !== null
                    && cloneX.firstElementChild instanceof HTMLElement) {
                    cloneX.firstElementChild.style.left = (this.stoneSize * i) + "%";
                    this.boardEdges.appendChild(cloneX);
                }

                let cloneY = this.delimiterYTemplate.content.cloneNode(true) as HTMLElement;
                if (cloneY.firstElementChild !== null
                    && cloneY.firstElementChild instanceof HTMLElement) {
                    cloneY.firstElementChild.style.top = (this.stoneSize * i) + "%";
                    this.boardEdges.appendChild(cloneY);
                }
            }
        }
    }
}


