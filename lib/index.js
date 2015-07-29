(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.index = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  // Save parsed conditions as functions.
  var conditions_cache = {};

  // ex: String2MediaQuery('>=mobile <742px', {mobile: '320px'});
  function String2MediaQuery(query) {
    var breakpoints = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // First replace named breakpoints with actual values.
    var raw_conditions = query;
    for (var key in breakpoints) {
      if (breakpoints.hasOwnProperty(key)) {
        raw_conditions = raw_conditions.replace(new RegExp(key, 'g'), breakpoints[key]);
      }
    }

    if (conditions_cache.hasOwnProperty(raw_conditions)) {
      // If we already parsed the query return the cached result.
      return conditions_cache[raw_conditions];
    } else {
      var conditions = [];

      // Split conditions in an array.
      raw_conditions = raw_conditions.split(' ');
      for (var i = 0; i < raw_conditions.length; i++) {
        var item = raw_conditions[i];
        var parsed = String2MediaQuery.parse(item);
        // If one of the condition is invalid make the whole invalid.
        if (parsed === false) {
          conditions_cache[raw_conditions] = false;
          return false;
        }

        // If condition is valid add it to the array.
        conditions.push(parsed);
      }
      return conditions.join(' and ');
    }
  }

  String2MediaQuery.parse = function (condition) {
    var smaller = undefined,
        larger = undefined,
        equal = false;
    // First find the operator and remove it.
    if (condition.indexOf('>') > -1) {
      larger = true;
      condition = condition.replace('>', '');
    }
    if (condition.indexOf('≥') > -1) {
      larger = true;
      equal = true;
      condition = condition.replace('≥', '');
    }
    if (condition.indexOf('<') > -1) {
      smaller = true;
      condition = condition.replace('<', '');
    }
    if (condition.indexOf('≤') > -1) {
      smaller = true;
      equal = true;
      condition = condition.replace('≤', '');
    }
    if (condition.indexOf('=') > -1) {
      equal = true;
      condition = condition.replace('=', '');
    }

    // If we don't have a smaller or larger operator this is an invalid query.
    if (!smaller && !larger) {
      return false;
    }

    // Next remove the px unit.
    condition = condition.replace('px', '');

    // Get the width as number.
    var width = parseInt(condition, 10);

    // If target is not a number the query is invalid.
    if (isNaN(width)) {
      return false;
    }

    // Define the media query operator.
    var condition_operator = 'min-width';
    if (smaller) {
      condition_operator = 'max-width';
    }

    // Adapt width if smaller or larger and not equal.
    if (smaller && !equal) {
      width -= 1;
    } else if (larger && !equal) {
      width += 1;
    }
    return '(' + condition_operator + ': ' + width + 'px)';
  };

  module.exports = String2MediaQuery;
});