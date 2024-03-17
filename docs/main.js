"use strict";
var LamaGoCore = (function () {
    function LamaGoCore() {
        var url = new URL(window.location.href);
        this.currentParams = url.searchParams;
        this.pathname = url.origin;
        this.size = this.parseSize();
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
    LamaGoCore.prototype.getEncodedBoard = function () {
        return this.encodedBoard;
    };
    LamaGoCore.prototype.getPathname = function () {
        return this.pathname;
    };
    LamaGoCore.DEFAULT_SIZE = 19;
    return LamaGoCore;
}());
var LamaGoBoard = (function () {
    function LamaGoBoard(size) {
        this.board = document.getElementById("board");
        this.boardEdges = document.getElementById("board-edges");
        this.delimiterXTemplate = document.getElementById("delimiter-x-template");
        this.delimiterYTemplate = document.getElementById("delimiter-y-template");
        this.stoneTemplate = document.getElementById("stone-template");
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
                            cloneStone.firstElementChild.addEventListener("click", LamaGoBoard.toggleStone);
                            cloneStone.firstElementChild.dataset.type = "0";
                            this.boardEdges.appendChild(cloneStone);
                        }
                    }
                }
            }
        }
    }
    LamaGoBoard.toggleStone = function () {
        if (this.classList.contains("background-black")) {
            this.classList.remove("background-black");
            this.classList.add("background-white");
            LamaGoBoard.toggleEdited(this, "2");
        }
        else {
            if (this.classList.contains("background-white")) {
                this.classList.remove("background-white");
                LamaGoBoard.toggleEdited(this, "0");
            }
            else {
                this.classList.add("background-black");
                LamaGoBoard.toggleEdited(this, "1");
            }
        }
    };
    LamaGoBoard.toggleEdited = function (element, expectedType) {
        if (element.dataset.type == expectedType) {
            element.classList.remove("background-edited");
        }
        else {
            element.classList.toggle("background-edited", true);
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
    return LamaGoBoard;
}());
//# sourceMappingURL=main.js.map