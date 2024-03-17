class LamaGoCore {
    private static DEFAULT_SIZE: number = 19;
    private currentParams: URLSearchParams;
    private pathname: string;
    private size: number;
    private encodedBoard: string;

    public constructor() {
        const url = new URL(window.location.href);
        this.currentParams = url.searchParams;
        this.pathname = url.origin;

        this.size = this.parseSize();
        this.encodedBoard = this.parseB();
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

    private parseB(): string {
        let encodedBoard = this.currentParams.get("b");
        if (encodedBoard === null) {
            return "";
        } else {
            return encodedBoard;
        }
    }

    public getSize(): number {
        return this.size;
    }

    public getEncodedBoard(): string {
        return this.encodedBoard;
    }

    public getPathname(): string {
        return this.pathname;
    }
}

class LamaGoBoard {
    private board: HTMLElement | null;
    private boardEdges: HTMLElement | null;
    private delimiterXTemplate: HTMLTemplateElement | null;
    private delimiterYTemplate: HTMLTemplateElement | null;
    private stoneTemplate: HTMLTemplateElement | null;

    private stoneSize: number;
    private edgeSize: number;
    private boardEdgeSize: number;

    public constructor(size: number) {
        this.board = document.getElementById("board");
        this.boardEdges = document.getElementById("board-edges");
        this.delimiterXTemplate = document.getElementById("delimiter-x-template") as HTMLTemplateElement;
        this.delimiterYTemplate = document.getElementById("delimiter-y-template") as HTMLTemplateElement;
        this.stoneTemplate = document.getElementById("stone-template") as HTMLTemplateElement;

        this.stoneSize = 100 / (size - 1);
        this.edgeSize = this.stoneSize / 2;
        this.boardEdgeSize = size;

        // Configure
        if (this.boardEdges !== null
            && this.delimiterXTemplate !== null
            && this.delimiterYTemplate !== null) {
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

            if (this.stoneTemplate !== null) {
                for (let i = 0; i < this.boardEdgeSize; i++) {
                    for (let j = 0; j < this.boardEdgeSize; j++) {
                        let cloneStone = this.stoneTemplate.content.cloneNode(true) as HTMLElement;
                        if (cloneStone.firstElementChild !== null
                            && cloneStone.firstElementChild instanceof HTMLElement) {
                            cloneStone.firstElementChild.style.top = ((this.stoneSize / -2) + this.stoneSize *i) + "%";
                            cloneStone.firstElementChild.style.left = ((this.stoneSize / -2) + this.stoneSize * j) + "%";
                            cloneStone.firstElementChild.style.width = this.stoneSize + "%";
                            cloneStone.firstElementChild.style.height = cloneStone.firstElementChild.style.width;
                            cloneStone.firstElementChild.id = "s" + i + j;
                            cloneStone.firstElementChild.addEventListener("click", LamaGoBoard.toggleStone);
                            cloneStone.firstElementChild.dataset.type = "0";
                            this.boardEdges.appendChild(cloneStone);
                        }
                    }
                }
            }
        }
    }

    private static toggleStone(this: HTMLElement) {
        if (this.classList.contains("background-black")) {
            this.classList.remove("background-black");
            this.classList.add("background-white");

            LamaGoBoard.toggleEdited(this, "2");
        } else {
            if (this.classList.contains("background-white")) {
                this.classList.remove("background-white");

                LamaGoBoard.toggleEdited(this, "0");
            } else {
                this.classList.add("background-black");

                LamaGoBoard.toggleEdited(this, "1");
            }
        }
    }

    private static toggleEdited(element: HTMLElement, expectedType: string) {
        if (element.dataset.type == expectedType) {
            element.classList.remove("background-edited");
        } else {
            element.classList.toggle("background-edited", true);
        }
    }

    public insertStones(boardString: string) {
        console.assert(this.boardEdgeSize * this.boardEdgeSize === boardString.length, "Size of boardString is different!")

        let stones = document.getElementsByClassName("stone");
        console.assert(stones.length === boardString.length, "Size of stones is different than boardString!")
        for (let i = 0; i < stones.length; i++) {
            const type = boardString.charAt(i);
            const stone = stones[i] as HTMLElement;
            stone.dataset.type = type;
            stone.classList.remove("background-black", "background-white", "background-edited");
            if (type === "1") {
                stone.classList.add("background-black");
            } else if (type === "2") {
                stone.classList.add("background-white");
            }
        }
    }

    public getBoardString(): string {
        let boardString = ""
        let stones = document.getElementsByClassName("stone");
        for (let i = 0; i < stones.length; i++) {
            const stone = stones[i] as HTMLElement;
            if (stone.classList.contains("background-black")) {
                boardString += "1";
            } else if (stone.classList.contains("background-white")) {
                boardString += "2";
            } else {
                boardString += "0";
            }
        }
        return boardString;
    }
}
