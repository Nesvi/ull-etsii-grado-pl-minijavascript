"use strict";
// tokens.js
// 2010-02-23

// Produce an array of simple token objects from a string.
// A simple token object contains these members:
//      type: 'name', 'string', 'number', 'operator'
//      value: string or number value of the token
//      from: index of first character of the token
//      to: index of the last character + 1

// Comments are ignored.

RegExp.prototype.bexec = function(str) {
  var i = this.lastIndex;
  var m = this.exec(str);
  if (m && m.index == i) return m;
  return null;
}

String.prototype.tokens = function () {
    var from;                   // The index of the start of the token.
    var i = 0;                  // The index of the current character.
    var n;                      // The number value.
    var str;                    // The string value.
    var m;                      // Matching
    var result = [];            // An array to hold the results.

    var WHITES              = /\s+/g;
    var ID                  = /[a-zA-Z]/g;
    var NUM                 = /(\d+)|(\d*.\d*)/g;
    var STRING              = /\"((\\")|([^\"]))*\"/g;//"
    var ONELINECOMMENT      = /\/\/.*\n/g;
    var MULTIPLELINECOMMENT = /\/\*(.|\n)*\*\//g;
    var TWOCHAROPERATORS    = /(\+\+)|(\-\-)|(&&)|(\|\|)|(==)|(<=)|(>=)/g;
    var ONECHAROPERATORS    = /[-+*\/=)(&;:%><\[\]]/g;//"
    
    // Make a token object.
    var make = function (type, value) {
        return {
            type: type,
            value: value,
            from: from,
            to: i
        };
    };

    // Begin tokenization. If the source string is empty, return nothing.
    if (!this) return; 
    
    var self = this;

    // Loop through this text
    while ( i < self.length ) {
        WHITES.lastIndex =  ID.lastIndex = NUM.lastIndex = STRING.lastIndex =
        ONELINECOMMENT.lastIndex = ONECHAROPERATORS.lastIndex =
        MULTIPLELINECOMMENT.lastIndex = TWOCHAROPERATORS.lastIndex = i;
        from = i;
	alert(self);
        // Ignore whitespace.
        if (m = WHITES.bexec(this)) {
            str = m[0];
            self = self.substr( m.index + str.length );
	    console.log("Match White");
        // name.
        } else if (m = ID.bexec(this)) {
            str = m[0];
            self = self.substr( m.index + str.length );
            result.push(make('name', str));
	    console.log("Match ID");

        // number.
        } else if (m = NUM.bexec(this)) {
            str = m[0];
            self = self.substr( m.index + str.length );

            n = +str;
            if (isFinite(n)) {
                result.push(make('number', n));
            } else {
                make('number', str).error("Bad number");
            }
	    console.log("Match NUM");
        // string
        } else if (m = STRING.bexec(this)) {
            str = m[0];
            self = self.substr( m.index + str.length );
            str = str.replace(/^["']/,'');//"
            str = str.replace(/["']$/,'');//"
            result.push(make('string', str));
	    console.log("Match STRING");				
        // comment.
        } else if ((m = ONELINECOMMENT.bexec(this))  || 
                   (m = MULTIPLELINECOMMENT.bexec(this))) {
            str = m[0];
            self = self.substr( m.index + str.length );
	    console.log("Match ONELINECOMMENT");
        // two char operator
        } else if (m = TWOCHAROPERATORS.bexec(this)) {
            str = m[0];
            self = self.substr( m.index + str.length );
            result.push(make('operator', str));
        // single-character operator
        } else if (m = ONECHAROPERATORS.bexec(this)){
            result.push(make('operator', this.substr(i,1)));
            self = self.substr( m.index + str.length );
        } else {
          throw "Syntax error near '"+this.substr(i)+"'";
        }
    }

    return result;
};

