# String2MediaQuery [![Build Status](https://travis-ci.org/idflood/String2MediaQuery.svg?branch=master)](https://travis-ci.org/idflood/String2MediaQuery)

>


## Install

```
$ npm install --save String2MediaQuery
```


## Usage

```js
var mq = String2MediaQuery('>=mobile', {mobile: '320px'});
//=> (min-width: 320px)

var mq = String2MediaQuery('>=mobile <1024px', {mobile: '320px'});
//=> (min-width: 320px) and (max-width: 1023px)

// The result can then be used with window.matchMedia like this.
if (window.matchMedia(mq).matches) {
  // ...
}

```


## API

### String2MediaQuery(query, breakpoints)

#### query

*Required*
Type: `string`

The simplified query as text.

#### breakpoints

Type: `object`
Default: `{}`

Named breakpoints can be passed as an object with names and with as string
with pixel units. ex: `{mobile: "320px", desktop: "960px"}`

This is expecially useful if you are importing css breakpoints.


## License

MIT © [David Mignot](https://github.com/idflood)
