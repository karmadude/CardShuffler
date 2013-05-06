/**
 * playingCards.ui is a UI utility library extension of the playingCard.js library
 * This contains methods to render the cards and apply effects.
 *
 * @requires playingCards.js
 * @requires playingCards.ui.css
 *
 * @author Copyright (c) 2010 Adam Eivy (antic | atomantic)
 * @license Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

 (function($,window,document,undefined) {

	if ($.fn) {
	     // we can use library methods
	     // attach this as an extension to the library
	     $.fn.playingCards = playingCards;
	}
    /*
	 * requires jquery (currently)
	 */
    playingCards.prototype.spread = function(clear, dest) {
        clear = clear || false;
        if (!this.conf.el && !dest) {
            return false;
        }
        var to = this.conf.el || dest,
			l = this.cards.length,
			i;

        if (clear) {
            to.html('');
        }
        // clear (just a demo)
        for (var i = 0; i < l; i++) {
            this.cards[i].getHTML();
            if (clear) {
                to.append(this.cards[i].$html);
            }

            var top = 104*(Math.floor(i/13));
            var left = 80 * (i%13);
            (function(c, t,l) {
                _.delay(function(){
                    c.$html.css({
                        'top': t,
                        'left': l
                    }).toggleClass('flip');
                }, 500 + i*30);
            })(this.cards[i], top, left);
        }
    };
	/**
	 * generate (and cache) html for the card
	 *
	 * @return string The HTML block to show the card
	 */
    playingCards.card.prototype.getHTML = function() {
        if (this.html) {
            return this.html;
        }
        this.suitCode = "&nbsp;";
        this.colorCls = '';
        switch (this.suit) {
        case "S":
            this.suitCode = "&spades;";
            break;
        case "D":
            this.colorCls = "red";
            this.suitCode = "&diams;";
            break;
        case "C":
            this.suitCode = "&clubs;";
            break;
        case "H":
            this.colorCls = "red";
            this.suitCode = "&hearts;";
            break;
        }

        // concatenating strings with "+" is slow, using array join is faster: http://code.google.com/speed/articles/optimizing-javascript.html
        // TODO: run perf test to be sure that in this case we are getting better perf in IE
        var txt = this.rank;
        if (this.rank === "N") {
            txt = this.rankString.split('').join('<br />');
        }

        var cargbg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="76px" height="100px" viewBox="0 0 76 100" enable-background="new 0 0 76 100" xml:space="preserve"> <path fill="#3A3A3A" d="M76,95c0,2.762-2.238,5-5,5H5c-2.761,0-5-2.238-5-5V5c0-2.762,2.239-5,5-5h66c2.762,0,5,2.238,5,5V95z"/> <path fill="#E5D839" d="M76,95c0,2.762-2.238,5-5,5H5c-2.761,0-5-2.238-5-5V39.445h76V95z"/> <rect y="39.445" fill="#F9F1A7" width="76" height="1.099"/> <rect y="41.809" fill="#F9F1A7" width="76" height="1.1"/> <rect y="44.173" fill="#F9F1A7" width="76" height="1.099"/> <rect y="46.537" fill="#F9F1A7" width="76" height="1.099"/> <rect y="48.901" fill="#F9F1A7" width="76" height="1.099"/> <polygon fill="#FFFFFF" points="38,7.299 39.199,9.729 41.88,10.118 39.939,12.009 40.398,14.679 38,13.419 35.602,14.679 36.06,12.009 34.12,10.118 36.801,9.729 "/> <g> <polygon fill="#FFFFFF" points="13.138,89.293 14.337,91.723 17.018,92.112 15.077,94.004 15.536,96.674 13.138,95.413 10.74,96.674 11.198,94.004 9.258,92.112 11.938,91.723     "/> <polygon fill="#FFFFFF" points="29.713,89.293 30.912,91.723 33.593,92.112 31.652,94.004 32.111,96.674 29.713,95.413 27.314,96.674 27.772,94.004 25.833,92.112 28.514,91.723     "/> <polygon fill="#FFFFFF" points="46.288,89.293 47.487,91.723 50.167,92.112 48.228,94.004 48.687,96.674 46.288,95.413 43.89,96.674 44.348,94.004 42.407,92.112 45.089,91.723  "/> <polygon fill="#FFFFFF" points="62.862,89.293 64.062,91.723 66.741,92.112 64.802,94.004 65.261,96.674 62.862,95.413 60.464,96.674 60.923,94.004 58.982,92.112 61.663,91.723     "/> </g> </svg>';
        var strBuild = ['<div class="playingCard flip"><div class="side front ', this.colorCls, '"><div class="corner">', txt, '<br />', this.suitCode, '</div>'];
        strBuild = strBuild.concat(this.buildIconHTML());
        strBuild = strBuild.concat('<div class="corner cornerBR flip">', txt, '<br />', this.suitCode, '</div></div><div class="side back">' + cargbg + '</div></div>');
        this.html = strBuild.join('');
        this.$html = $(this.html);
        return this.html;
    };
	/**
 	 * build the middle of the playing card HTML
	 *
	 * @return string The HTML block for the middle of the card
 	 */
    playingCards.card.prototype.buildIconHTML = function() {
        // TODO: could we optimize this with a for loop that breaks/continues to named positions?
        if (this.rank === "A") {
            return ['<div class="suit suit0">', this.suitCode, '</div>'];
        }
        if (this.rank === "J" || this.rank === "Q" || this.rank === "K" || this.rank === "N") {
            var n = 'D';
            if (!this.conf.singleFace) {
                n = this.suit;
            }
            return [
            '<div class="suit A1">', this.suitCode, '</div>',
            '<img class="suit ', this.rank, ' face" src="img/', this.rank, n, '.gif"/>',
            '<div class="suit C5 flip">', this.suitCode, '</div>'
            ];
        }
        var ret = [],
			list = ['4', '5', '6', '7', '8', '9', '10'];
        // all of these will have A1, A5, C1, C5 icons
        if (list.indexOf(this.rank) !== -1) {
            ret = ret.concat([
            '<div class="suit A1">', this.suitCode, '</div>',
            '<div class="suit A5 flip">', this.suitCode, '</div>',
            '<div class="suit C1">', this.suitCode, '</div>',
            '<div class="suit C5 flip">', this.suitCode, '</div>'
            ]);
        }
        list = ['2', '3'];
        if (list.indexOf(this.rank) !== -1) {
            ret = ret.concat([
            '<div class="suit B1">', this.suitCode, '</div>',
            '<div class="suit B5 flip">', this.suitCode, '</div>'
            ]);
        }
        list = ['3', '5', '9'];
        if (list.indexOf(this.rank) !== -1) {
            ret = ret.concat([
            '<div class="suit B3">', this.suitCode, '</div>'
            ]);
        }
        list = ['6', '7', '8'];
        if (list.indexOf(this.rank) !== -1) {
            ret = ret.concat([
            '<div class="suit A3">', this.suitCode, '</div>',
            '<div class="suit C3">', this.suitCode, '</div>'
            ]);
        }
        list = ['7', '8', '10'];
        if (list.indexOf(this.rank) !== -1) {
            ret = ret.concat([
            '<div class="suit B2">', this.suitCode, '</div>'
            ]);
        }
        list = ['8', '10'];
        if (list.indexOf(this.rank) !== -1) {
            ret = ret.concat([
            '<div class="suit B4 flip">', this.suitCode, '</div>'
            ]);
        }
        list = ['9', '10'];
        if (list.indexOf(this.rank) !== -1) {
            ret = ret.concat([
            '<div class="suit A2">', this.suitCode, '</div>',
            '<div class="suit A4 flip">', this.suitCode, '</div>',
            '<div class="suit C2">', this.suitCode, '</div>',
            '<div class="suit C4 flip">', this.suitCode, '</div>'
            ]);
        }
        return ret;
    };
})(typeof(jQuery) !== 'undefined' ? jQuery: function(){},this,this.document);