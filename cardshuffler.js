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


$(document).ready(function() {
  var cardFlip = function() {
    var delay = 200;
    $('.playingCard').each(function(index, value){
      delay += 10;
      setTimeout(function(){ $(value).toggleClass('flip'); }, delay);
    });
  };

  var cardDeck = $(".card-deck").playingCards({
    'startShuffled': false,
    'jokers': 0
  });
  cardDeck.spread(); // show it
  cardFlip();

  $('.reset').on('click', function() {
    cardFlip();
    // _.delay(function() {
    //   _.each($('.playingCard'), function(card, index) {
    //     var t = -$(card).position().top;
    //     var l = -$(card).position().left;
    //     var p = [l+'px',t+'px',0].join(',');
    //     _.delay(function(){ $(card).css({'-webkit-transform': 'translate3d(' + p + ')'}); }, 200+10*index);
    //   });
    // }, 1000);
    setTimeout(function(){
      cardDeck.init();
      cardDeck.spread();
      cardFlip();
    }, 1000);
    return false;
  });

  $('.shuffle').on('click', function() {
    cardFlip();
    setTimeout(function(){
      var cs = new CardShuffler();
      cardDeck.cards = cs.shuffle(cardDeck.cards, 5);
      cardDeck.spread();
      cardFlip();
    }, 1000);
    return false;
  });
});

