import{r as s}from"./react.5be2fbc9.js";import{c as y,a as d}from"./history.9fc37d5c.js";import{R as x,u as k,a as b,b as v,c as R}from"./react-router.d8772ad9.js";/**
 * React Router DOM v6.3.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function p(){return p=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var r=arguments[n];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},p.apply(this,arguments)}function C(e,n){if(e==null)return{};var r={},a=Object.keys(e),o,t;for(t=0;t<a.length;t++)o=a[t],!(n.indexOf(o)>=0)&&(r[o]=e[o]);return r}const L=["onClick","reloadDocument","replace","state","target","to"];function E(e){let{basename:n,children:r,window:a}=e,o=s.exports.useRef();o.current==null&&(o.current=y({window:a}));let t=o.current,[i,l]=s.exports.useState({action:t.action,location:t.location});return s.exports.useLayoutEffect(()=>t.listen(l),[t]),s.exports.createElement(x,{basename:n,children:r,location:i.location,navigationType:i.action,navigator:t})}function w(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}const B=s.exports.forwardRef(function(n,r){let{onClick:a,reloadDocument:o,replace:t=!1,state:i,target:l,to:c}=n,u=C(n,L),h=k(c),m=O(c,{replace:t,state:i,target:l});function g(f){a&&a(f),!f.defaultPrevented&&!o&&m(f)}return s.exports.createElement("a",p({},u,{href:h,onClick:g,ref:r,target:l}))});function O(e,n){let{target:r,replace:a,state:o}=n===void 0?{}:n,t=b(),i=v(),l=R(e);return s.exports.useCallback(c=>{if(c.button===0&&(!r||r==="_self")&&!w(c)){c.preventDefault();let u=!!a||d(i)===d(l);t(e,{replace:u,state:o})}},[i,t,l,a,o,r,e])}export{E as B,B as L};
