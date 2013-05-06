//
//  CardShuffler - Using Riffle & Hindu shuffling
//
//  Created by Liji Jinaraj on June 19, 2012.
//  (c) 2012 Liji Jinaraj.  The MIT License.

var CardShuffler = function() {
  return {
    hinduShuffle: function(deck) {
      var pos = Math.floor(Math.random() * deck.length);
      var len = Math.floor(Math.random() * (deck.length - pos));
      var shuffledDeck = deck.splice(pos, len);
      return shuffledDeck.concat(deck);
    },

    riffleShuffle: function(deck) {
      var shuffledDeck = [];
      var mid = Math.floor((deck.length-1)/2);

      var pos = 1;
      for (var i = deck.length-1; i >= 0; i--) {
        if (i === mid) pos = 0;

        shuffledDeck[pos] = deck[i];
        pos = pos + 2;
      }

      return shuffledDeck;
    },

    /**
     * shuffle the deck
     *
     * @param Array deck
     * @param int n number of times to shuffle
     */
    shuffle: function(deck, n) {
      var shuffledDeck = deck;
      n = n || 5;

      for (var i = 0; i < n; i++) {
        shuffledDeck = this.riffleShuffle(shuffledDeck);
        shuffledDeck = this.hinduShuffle(shuffledDeck);
      }

      return shuffledDeck;
    },

    freshPack: function() {
      var deck = [];
      for (var j = 1; j <= 52; j++) {
        deck.push(j);
      }
      return deck;
    }
  };
};

var cardFlip = function() {
  _.each($('.playingCard'), function(card, index) {
    _.delay(function() { $(card).toggleClass('flip');}, 200 + 10 * index);
  });
};

var matrixDiagram = function() {
  var width = 103,
      height = 103;

  var n = 52,
      m = 0,
      zero = d3.range(n).map(function() { return 0; });

  var x = d3.scale.ordinal()
        .domain(d3.range(n))
        .rangeBands([0, width]);

  var z = d3.scale.quantile()
        .domain([0, 1, 2])
        .range(["#eee", "#E41A1C", "#222"]);

  var svg, row;

  var diagram = function() {};

  diagram.init = function() {
    diagram.reset();

    svg = d3.select(".matrix-diagram").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g");

    svg.append("rect")
        .attr("class", "diagram")
        .attr("width", width)
        .attr("height", height);

    row = svg.selectAll(".row")
        .data(matrix)
      .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; });

    row.selectAll(".cell")
        .data(function(d) { return d; })
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d, i) { return x(i); })
        .attr("width", x.rangeBand())
        .attr("height", x.rangeBand());

    return diagram;
  };

  diagram.reset = function() {
    matrix = zero.map(function() { return zero.slice(); });
    return diagram;
  };

  diagram.updateMatrix = function(cards) {
    m++;
    cards.forEach(function(card, j) {
      matrix[card.index][j] = card.suit === "D" || card.suit === "H" ? 1 : 2;
    });
    return diagram;
  };

  diagram.draw = function() {
    row.selectAll(".cell")
      .data(function(d, i) { return matrix[i]; })
      .style("fill", z);
    return diagram;
  };

  return diagram;
};


$(document).ready(function() {
  var diagram = matrixDiagram().init();
  var cardDeck = $(".card-deck").playingCards({
    'startShuffled': false,
    'jokers': 0
  });
  cardDeck.spread(true); // show it
  //cardFlip();
  diagram.reset().updateMatrix(cardDeck.cards).draw();

  $('.reset').on('click', function() {
    cardFlip();
    _.delay(function(){$('.playingCard').css({'top': 0, 'left': 0});}, 1000);
    _.delay(function(){
      cardDeck.init();
      cardDeck.spread(true);
      diagram.reset().updateMatrix(cardDeck.cards).draw();
      //cardFlip();
    }, 2000);
    return false;
  });

  $('.shuffle').on('click', function() {
    cardFlip();
    _.delay(function(){$('.playingCard').css({'top': 0, 'left': 0});}, 1000);
    _.delay(function(){
      var cs = new CardShuffler();
      cardDeck.cards = cs.shuffle(cardDeck.cards, 5);
      cardDeck.spread();
      //cardFlip();
      diagram.reset().updateMatrix(cardDeck.cards).draw();
    }, 1000);
    return false;
  });
});