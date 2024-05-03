class LamaGoCore {
    private static DEFAULT_SIZE: number = 19;
    private currentParams: URLSearchParams;
    private size: number;
    private blackCapturedStones: number;
    private whiteCapturedStones: number;
    private encodedBoard: string;

    public constructor() {
        const url = new URL(window.location.href);
        this.currentParams = url.searchParams;

        this.size = this.parseSize();
        this.blackCapturedStones = this.parseNumber("bcs", 0);
        this.whiteCapturedStones = this.parseNumber("wcs", 0);
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

    private parseNumber(argumentName: string, defaultValue: number): number {
            let size = this.currentParams.get(argumentName);
            if (size === null) {
                return defaultValue;
            } else {
                let parsedNumber = parseInt(size, 10);
                if (isNaN(parsedNumber)) {
                    return defaultValue;
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

    public getBcs(): number {
        return this.blackCapturedStones;
    }

    public getWcs(): number {
        return this.whiteCapturedStones;
    }

    public getEncodedBoard(): string {
        return this.encodedBoard;
    }
}

class LamaGoBoard {
    private bcsField: HTMLElement | null;
    private wcsField: HTMLElement | null;
    private board: HTMLElement | null;
    private boardEdges: HTMLElement | null;
    private delimiterXTemplate: HTMLTemplateElement | null;
    private delimiterYTemplate: HTMLTemplateElement | null;
    private stoneTemplate: HTMLTemplateElement | null;

    private bcsCount: number;
    private wcsCount: number;
    private stoneSize: number;
    private edgeSize: number;
    private boardEdgeSize: number;

    public constructor(size: number, bcs: number, wcs: number) {
        this.bcsField = document.getElementById("bcs");
        this.wcsField = document.getElementById("wcs");
        this.board = document.getElementById("board");
        this.boardEdges = document.getElementById("board-edges");
        this.delimiterXTemplate = document.getElementById("delimiter-x-template") as HTMLTemplateElement;
        this.delimiterYTemplate = document.getElementById("delimiter-y-template") as HTMLTemplateElement;
        this.stoneTemplate = document.getElementById("stone-template") as HTMLTemplateElement;

        this.bcsCount = bcs;
        this.wcsCount = wcs;
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

                            var tmpThis = this;
                            cloneStone.firstElementChild.addEventListener("click", function() {
                                let change: number = LamaGoBoard.toggleStone(this);
                                if (change < 0) {
                                    if (change == -1) {
                                        tmpThis.bcsCount++;
                                    } else if (change == -2) {
                                        tmpThis.wcsCount++;
                                    }
                                } else {
                                    if (change == 1) {
                                        tmpThis.bcsCount--;
                                    } else if (change == 2) {
                                        tmpThis.wcsCount--;
                                    }
                                }
                                tmpThis.renderCapturedStones();
                            });
                            cloneStone.firstElementChild.dataset.type = "0";
                            this.boardEdges.appendChild(cloneStone);
                        }
                    }
                }
            }
        }

        this.renderCapturedStones();
    }

    public static toggleStone(element: HTMLElement): number {
        if (element.classList.contains("background-black")) {
            element.classList.remove("background-black");
            element.classList.add("background-white");

            if (LamaGoBoard.toggleEdited(element, "2") === false) {
                if (element.dataset.type === "2") {
                    return 2;
                }
            }
        } else {
            if (element.classList.contains("background-white")) {
                element.classList.remove("background-white");

                if (LamaGoBoard.toggleEdited(element, "0")) {
                    if (element.dataset.type === "1") {
                        return -1;
                    } else if (element.dataset.type === "2") {
                        return -2;
                    }
                }
            } else {
                element.classList.add("background-black");

                if (LamaGoBoard.toggleEdited(element, "1") === false) {
                    if (element.dataset.type === "1") {
                        return 1;
                    }
                }
            }
        }
        return 0;
    }

    private static toggleEdited(element: HTMLElement, expectedType: string): boolean {
        if (element.dataset.type === expectedType) {
            element.classList.remove("background-edited");
            return false;
        } else {
            return element.classList.toggle("background-edited", true);
        }
    }

    public renderCapturedStones() {
        if (this.bcsField !== null && this.wcsField !== null) {
            this.bcsField.textContent = this.bcsCount.toString();
            this.wcsField.textContent = this.wcsCount.toString();
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

    public getBcsCount(): number {
        return this.bcsCount;
    }

    public getWcsCount(): number {
        return this.wcsCount;
    }
}
