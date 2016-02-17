/** Randomly select n unique items from array. */

(function($) {
    // Fisher-Yates shuffle
    String.prototype.shuffle = function () {
        var a = this.split(""),
            n = a.length;

        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    };

    $.fn.selectRandomUniqueAndShuffle = function(size) {
        size = Math.min(size, this.size());

        var indexes = new Array(this.size()),
            randomIndexes = {},
            i = 0;

        // Store current indexes.
        for (i = 0; i < this.size(); i++) {
            indexes[i] = i;
        }

        for (i = 0 ; i < size ; i++){
            var randomIndex = Math.floor(Math.random() * indexes.length);
            randomIndexes[indexes[randomIndex]] = true;
            indexes.splice(randomIndex, 1);
        }

        var selectedDice = this.filter(function(index) {
            return(index in randomIndexes);
        });

        // Shuffle the letters in each of the select die.
        $(selectedDice).each(function(index) {
            selectedDice[index] = this.shuffle();
        });

        return selectedDice;
    };
})(jQuery);