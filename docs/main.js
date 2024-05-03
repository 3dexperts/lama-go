"use strict";
var LamaGoCore = (function () {
    function LamaGoCore() {
        var url = new URL(window.location.href);
        this.currentParams = url.searchParams;
        this.size = this.parseSize();
        this.blackCapturedStones = this.parseNumber("bcs", 0);
        this.whiteCapturedStones = this.parseNumber("wcs", 0);
        this.encodedBoard = this.parseB();
    }
    LamaGoCore.prototype.parseSize = function () {
        var size = this.currentParams.get("size");
        if (size === null) {
            return LamaGoCore.DEFAULT_SIZE;
        }
        else {
            var parsedNumber = parseInt(size, 10);
            if (isNaN(parsedNumber)) {
                return LamaGoCore.DEFAULT_SIZE;
            }
            else {
                return parsedNumber;
            }
        }
    };
    LamaGoCore.prototype.parseNumber = function (argumentName, defaultValue) {
        var size = this.currentParams.get(argumentName);
        if (size === null) {
            return defaultValue;
        }
        else {
            var parsedNumber = parseInt(size, 10);
            if (isNaN(parsedNumber)) {
                return defaultValue;
            }
            else {
                return parsedNumber;
            }
        }
    };
    LamaGoCore.prototype.parseB = function () {
        var encodedBoard = this.currentParams.get("b");
        if (encodedBoard === null) {
            return "";
        }
        else {
            return encodedBoard;
        }
    };
    LamaGoCore.prototype.getSize = function () {
        return this.size;
    };
    LamaGoCore.prototype.getBcs = function () {
        return this.blackCapturedStones;
    };
    LamaGoCore.prototype.getWcs = function () {
        return this.whiteCapturedStones;
    };
    LamaGoCore.prototype.getEncodedBoard = function () {
        return this.encodedBoard;
    };
    LamaGoCore.DEFAULT_SIZE = 19;
    return LamaGoCore;
}());
var LamaGoBoard = (function () {
    function LamaGoBoard(size, bcs, wcs) {
        this.bcsField = document.getElementById("bcs");
        this.wcsField = document.getElementById("wcs");
        this.board = document.getElementById("board");
        this.boardEdges = document.getElementById("board-edges");
        this.delimiterXTemplate = document.getElementById("delimiter-x-template");
        this.delimiterYTemplate = document.getElementById("delimiter-y-template");
        this.stoneTemplate = document.getElementById("stone-template");
        this.bcsCount = bcs;
        this.wcsCount = wcs;
        this.stoneSize = 100 / (size - 1);
        this.edgeSize = this.stoneSize / 2;
        this.boardEdgeSize = size;
        if (this.boardEdges !== null
            && this.delimiterXTemplate !== null
            && this.delimiterYTemplate !== null) {
            this.boardEdges.style.top = this.edgeSize + "%";
            this.boardEdges.style.left = this.edgeSize + "%";
            this.boardEdges.style.width = (100 - this.stoneSize) + "%";
            this.boardEdges.style.height = this.boardEdges.style.width;
            for (var i = 0; i < size; i++) {
                var cloneX = this.delimiterXTemplate.content.cloneNode(true);
                if (cloneX.firstElementChild !== null
                    && cloneX.firstElementChild instanceof HTMLElement) {
                    cloneX.firstElementChild.style.left = (this.stoneSize * i) + "%";
                    this.boardEdges.appendChild(cloneX);
                }
                var cloneY = this.delimiterYTemplate.content.cloneNode(true);
                if (cloneY.firstElementChild !== null
                    && cloneY.firstElementChild instanceof HTMLElement) {
                    cloneY.firstElementChild.style.top = (this.stoneSize * i) + "%";
                    this.boardEdges.appendChild(cloneY);
                }
            }
            if (this.stoneTemplate !== null) {
                for (var i = 0; i < this.boardEdgeSize; i++) {
                    for (var j = 0; j < this.boardEdgeSize; j++) {
                        var cloneStone = this.stoneTemplate.content.cloneNode(true);
                        if (cloneStone.firstElementChild !== null
                            && cloneStone.firstElementChild instanceof HTMLElement) {
                            cloneStone.firstElementChild.style.top = ((this.stoneSize / -2) + this.stoneSize * i) + "%";
                            cloneStone.firstElementChild.style.left = ((this.stoneSize / -2) + this.stoneSize * j) + "%";
                            cloneStone.firstElementChild.style.width = this.stoneSize + "%";
                            cloneStone.firstElementChild.style.height = cloneStone.firstElementChild.style.width;
                            cloneStone.firstElementChild.id = "s" + i + j;
                            var tmpThis = this;
                            cloneStone.firstElementChild.addEventListener("click", function () {
                                var change = LamaGoBoard.toggleStone(this);
                                if (change < 0) {
                                    if (change == -1) {
                                        tmpThis.bcsCount++;
                                    }
                                    else if (change == -2) {
                                        tmpThis.wcsCount++;
                                    }
                                }
                                else {
                                    if (change == 1) {
                                        tmpThis.bcsCount--;
                                    }
                                    else if (change == 2) {
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
    LamaGoBoard.toggleStone = function (element) {
        if (element.classList.contains("background-black")) {
            element.classList.remove("background-black");
            element.classList.add("background-white");
            if (LamaGoBoard.toggleEdited(element, "2") === false) {
                if (element.dataset.type === "2") {
                    return 2;
                }
            }
        }
        else {
            if (element.classList.contains("background-white")) {
                element.classList.remove("background-white");
                if (LamaGoBoard.toggleEdited(element, "0")) {
                    if (element.dataset.type === "1") {
                        return -1;
                    }
                    else if (element.dataset.type === "2") {
                        return -2;
                    }
                }
            }
            else {
                element.classList.add("background-black");
                if (LamaGoBoard.toggleEdited(element, "1") === false) {
                    if (element.dataset.type === "1") {
                        return 1;
                    }
                }
            }
        }
        return 0;
    };
    LamaGoBoard.toggleEdited = function (element, expectedType) {
        if (element.dataset.type === expectedType) {
            element.classList.remove("background-edited");
            return false;
        }
        else {
            return element.classList.toggle("background-edited", true);
        }
    };
    LamaGoBoard.prototype.renderCapturedStones = function () {
        if (this.bcsField !== null && this.wcsField !== null) {
            this.bcsField.textContent = this.bcsCount.toString();
            this.wcsField.textContent = this.wcsCount.toString();
        }
    };
    LamaGoBoard.prototype.insertStones = function (boardString) {
        console.assert(this.boardEdgeSize * this.boardEdgeSize === boardString.length, "Size of boardString is different!");
        var stones = document.getElementsByClassName("stone");
        console.assert(stones.length === boardString.length, "Size of stones is different than boardString!");
        for (var i = 0; i < stones.length; i++) {
            var type = boardString.charAt(i);
            var stone = stones[i];
            stone.dataset.type = type;
            stone.classList.remove("background-black", "background-white", "background-edited");
            if (type === "1") {
                stone.classList.add("background-black");
            }
            else if (type === "2") {
                stone.classList.add("background-white");
            }
        }
    };
    LamaGoBoard.prototype.getBoardString = function () {
        var boardString = "";
        var stones = document.getElementsByClassName("stone");
        for (var i = 0; i < stones.length; i++) {
            var stone = stones[i];
            if (stone.classList.contains("background-black")) {
                boardString += "1";
            }
            else if (stone.classList.contains("background-white")) {
                boardString += "2";
            }
            else {
                boardString += "0";
            }
        }
        return boardString;
    };
    LamaGoBoard.prototype.getBcsCount = function () {
        return this.bcsCount;
    };
    LamaGoBoard.prototype.getWcsCount = function () {
        return this.wcsCount;
    };
    return LamaGoBoard;
}());
//# sourceMappingURL=main.js.map