'use strict';
var assert = require('assert');
var String2MediaQuery = require('./src/string2mediaquery.js');

it('should parse simple query', function () {
  assert.strictEqual(String2MediaQuery.parse('>=300px'), '(min-width: 300px)');
  assert.strictEqual(String2MediaQuery.parse('≥300px'), '(min-width: 300px)');
  assert.strictEqual(String2MediaQuery.parse('>300px'), '(min-width: 301px)');
  assert.strictEqual(String2MediaQuery.parse('<300px'), '(max-width: 299px)');
  assert.strictEqual(String2MediaQuery.parse('<=300px'), '(max-width: 300px)');
  assert.strictEqual(String2MediaQuery.parse('≤300px'), '(max-width: 300px)');
});

it('should return false for invalid queries', function () {
  assert.strictEqual(String2MediaQuery.parse(''), false);
  assert.strictEqual(String2MediaQuery.parse('300px'), false);
});

it('should return a full media query', function () {
  assert.strictEqual(String2MediaQuery('>=300px'), '(min-width: 300px)');
  assert.strictEqual(String2MediaQuery('>=300px <500px'), '(min-width: 300px) and (max-width: 499px)');
});

it('should parse named breakpoints', function () {
  assert.strictEqual(String2MediaQuery('>=mobile', {mobile: '320px'}), '(min-width: 320px)');
  assert.strictEqual(String2MediaQuery('>=mobile <desktop', {mobile: '320px', desktop: '1024px'}), '(min-width: 320px) and (max-width: 1023px)');
  assert.strictEqual(String2MediaQuery('>=mobile <1000px', {mobile: '320px'}), '(min-width: 320px) and (max-width: 999px)');
});

it('should cache the query based on pixels', function () {
  // Defining the same breakpoint with 2 different values should return different media queries.
  assert.strictEqual(String2MediaQuery('>=desktop', {desktop: 42}), '(min-width: 42px)');
  assert.strictEqual(String2MediaQuery('>=desktop', {desktop: 1024}), '(min-width: 1024px)');
});
