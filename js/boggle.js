/** Boggle Module */
var Boggle = (function($) {
    var mod = function() {
        this.model = {
            dicePossibilities: ["aaafrs", "aaeeee", "aafirs", "adennn", "aeeeem", "aeegmu", "aegmnn", "afirsy", "bjkqxz",
                "ccenst", "ceiilt", "ceilpt", "ceipst", "ddhnot", "dhhlor", "dhlnor", "eiiitt", "emottt", "ensssu",
                "fiprsy", "gorrvw", "iprrry", "nootuw", "ooottu"],
            size: 5,
            wordBuilder: "",
            facesSelected: [],
            wordsSubmitted: []
        };

        this.elements = {};

        this.initElements();
        this.init();
    };

    mod.fn = mod.prototype;

    mod.fn.initElements = function() {
        this.elements.dice = $(".die");
        this.elements.faces = $(".face");
        this.elements.currentWord = $("#currentWord");
        this.elements.submitWord = $("#submitWord");
        this.elements.scoreTable = $("#scoreTable").find("tbody");
        this.elements.totalScore = $("#totalScore");
    };

    mod.fn.init = function() {
        this.model.selectedDice = $(this.model.dicePossibilities).selectRandomUniqueAndShuffle(this.model.size);
        this.populateDice();
        this.saveNeighboringCells();
        this.bindEvents();
    };

    mod.fn.populateDice = function() {
        var self = this;

        self.elements.dice.each(function(index) {
            var die = self.model.selectedDice[index].split("");
            $(this).find(".letter").each(function(faceIndex) {
                var letter = die[faceIndex].toUpperCase();
                $(this).html(letter === "Q" ? "Qu" : letter);
            });
        });
    };

    mod.fn.saveNeighboringCells = function() {
        var self = this;

        // For each face save its neighboring cells' selector as a data attribute.
        self.elements.faces.each(function(index) {
            var neighborIndexes = [],
                neighborCells = [];

            self.getNeighboringCellIndexes(index - self.model.size, neighborIndexes);
            self.getNeighboringCellIndexes(index, neighborIndexes);
            self.getNeighboringCellIndexes(index + self.model.size, neighborIndexes);
            neighborIndexes.splice(neighborIndexes.indexOf(index), 1);

            // A face can have a minimum of 3 and maximum of 8 neighboring cells.
            $(neighborIndexes).each(function(neighborArrayIndex, neighborIndex) {
                neighborCells.push("face" + neighborIndex);
            });

            $(this).data("neighbors", neighborCells);
        });
    };

    mod.fn.getNeighboringCellIndexes = function(index, neighborIndexesArray) {
        var self = this;

        if (index < 0 || index > self.model.size * self.model.size - 1) {
            return;
        }

        for(var i = 0; i < 3; i++) {
            var indexFromEdge = (index % self.model.size) - 1;
            if (indexFromEdge + i >= 0 && indexFromEdge + i < self.model.size) {
                neighborIndexesArray.push(index + i - 1);
            }
        }
    };

    mod.fn.selectFace = function(face) {
        this.model.facesSelected.push(face);
        this.model.wordBuilder += $(face).find("span").html();
        $(face).addClass("selected");
    };

    mod.fn.deselectFace = function(face) {
        this.model.facesSelected.pop();
        this.model.wordBuilder = this.model.wordBuilder.slice(0, -1);
        $(face).removeClass("selected");
    };

    mod.fn.computeScore = function() {
        switch (this.model.wordBuilder.length) {
            case 1:
            case 2:
                return 0;
                break;
            case 3:
            case 4:
                return 1;
                break;
            case 5:
                return 2;
                break;
            case 6:
                return 3;
                break;
            case 7:
                return 5;
                break;
            default:
                return 11;
        }
    };

    mod.fn.startNewWord = function() {
        // Clear the stack of faces selected.
        this.model.facesSelected = [];

        // Deselect all faces so they are selectable again.
        this.elements.faces.removeClass("selected");

        // Clear the currently build word.
        this.model.wordBuilder = "";

        // Set the current word to empty string.
        this.elements.currentWord.html("");
    };

    mod.fn.bindEvents = function() {
        var self = this;

        self.elements.faces.click(function() {
            // If no faces have been selected then add the face to the facesSelected stack and build the current word.
            if (self.model.facesSelected.length === 0) {
                self.selectFace(this);
            }
            else {
                // If we are deselecting the last selected face:
                if ($(this).hasClass("selected") && this === self.model.facesSelected[self.model.facesSelected.length - 1]) {
                    self.deselectFace(this);
                }
                // If we are selecting another unselected face:
                else if (!$(this).hasClass("selected")) {
                    var previousCell = self.model.facesSelected[self.model.facesSelected.length - 1];
                    var neighbors = $(previousCell).data("neighbors");

                    // Make sure that the new face selected is a neighboring cell of the previously selected face.
                    if (neighbors.indexOf($(this).attr("id")) !== -1) {
                        self.selectFace(this);
                    }
                }
            }
            self.elements.currentWord.html(self.model.wordBuilder);
        });

        self.elements.submitWord.click(function() {
            // If a new word is submitted:
            if (self.model.wordBuilder.length > 0 && self.model.wordsSubmitted.indexOf(self.model.wordBuilder) === -1) {
                var score = self.computeScore();

                // Add the word and its corresponding score the scoreTable.
                self.elements.scoreTable.append("<tr><td>" + self.model.wordBuilder + "</td><td>" + score + "</td></tr>");

                // Update the total score.
                self.elements.totalScore.html(parseInt(self.elements.totalScore.html()) + score);

                // Add the word to list of already entered words.
                self.model.wordsSubmitted.push(self.model.wordBuilder);

                self.startNewWord();
            }
            else if (self.model.wordBuilder.length > 0 && self.model.wordsSubmitted.indexOf(self.model.wordBuilder) !== -1) {
                self.startNewWord();
            }
        });

        $(document).keypress(function(event) {
            var key = event.which;

            // Enter key code
            if (key == 13) {
                self.elements.submitWord.click();
            }
        });
    };

    return mod;
})(jQuery);