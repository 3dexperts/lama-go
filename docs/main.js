"use strict";
var LamaGoCore = (function () {
    function LamaGoCore() {
        var url = new URL(window.location.href);
        this.currentParams = url.searchParams;
        this.size = this.parseSize();
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
    LamaGoCore.prototype.getSize = function () {
        return this.size;
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
        if (this.boardEdges !== null
            && this.delimiterXTemplate !== null) {
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
        }
    }
    return LamaGoBoard;
}());
//# sourceMappingURL=main.js.map