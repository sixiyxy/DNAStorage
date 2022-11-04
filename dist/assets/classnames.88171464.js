var f={exports:{}};/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/(function(a){(function(){var l={}.hasOwnProperty;function t(){for(var e=[],n=0;n<arguments.length;n++){var s=arguments[n];if(!!s){var o=typeof s;if(o==="string"||o==="number")e.push(s);else if(Array.isArray(s)){if(s.length){var i=t.apply(null,s);i&&e.push(i)}}else if(o==="object")if(s.toString===Object.prototype.toString)for(var r in s)l.call(s,r)&&s[r]&&e.push(r);else e.push(s.toString())}}return e.join(" ")}a.exports?(t.default=t,a.exports=t):window.classNames=t})()})(f);var c=f.exports;export{f as a,c};
