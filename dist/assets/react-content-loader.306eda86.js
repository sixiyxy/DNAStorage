import{r as t}from"./react.6037337b.js";/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */var i=function(){return i=Object.assign||function(a){for(var o,r=1,n=arguments.length;r<n;r++){o=arguments[r];for(var c in o)Object.prototype.hasOwnProperty.call(o,c)&&(a[c]=o[c])}return a},i.apply(this,arguments)};function j(e,a){var o={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&a.indexOf(r)<0&&(o[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,r=Object.getOwnPropertySymbols(e);n<r.length;n++)a.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(o[r[n]]=e[r[n]]);return o}var R=function(){return Math.random().toString(36).substring(6)},g=function(e){var a=e.animate,o=e.backgroundColor,r=e.backgroundOpacity,n=e.baseUrl,c=e.children,h=e.foregroundColor,b=e.foregroundOpacity,l=e.gradientRatio,v=e.uniqueKey,O=e.interval,E=e.rtl,C=e.speed,k=e.style,u=e.title,w=j(e,["animate","backgroundColor","backgroundOpacity","baseUrl","children","foregroundColor","foregroundOpacity","gradientRatio","uniqueKey","interval","rtl","speed","style","title"]),s=v||R(),f=s+"-diff",m=s+"-animated-diff",y=s+"-aria",P=E?{transform:"scaleX(-1)"}:null,d="0; "+O+"; 1",p=C+"s";return t.exports.createElement("svg",i({"aria-labelledby":y,role:"img",style:i(i({},k),P)},w),u?t.exports.createElement("title",{id:y},u):null,t.exports.createElement("rect",{role:"presentation",x:"0",y:"0",width:"100%",height:"100%",clipPath:"url("+n+"#"+f+")",style:{fill:"url("+n+"#"+m+")"}}),t.exports.createElement("defs",{role:"presentation"},t.exports.createElement("clipPath",{id:f},c),t.exports.createElement("linearGradient",{id:m},t.exports.createElement("stop",{offset:"0%",stopColor:o,stopOpacity:r},a&&t.exports.createElement("animate",{attributeName:"offset",values:-l+"; "+-l+"; 1",keyTimes:d,dur:p,repeatCount:"indefinite"})),t.exports.createElement("stop",{offset:"50%",stopColor:h,stopOpacity:b},a&&t.exports.createElement("animate",{attributeName:"offset",values:-l/2+"; "+-l/2+"; "+(1+l/2),keyTimes:d,dur:p,repeatCount:"indefinite"})),t.exports.createElement("stop",{offset:"100%",stopColor:o,stopOpacity:r},a&&t.exports.createElement("animate",{attributeName:"offset",values:"0; 0; "+(1+l),keyTimes:d,dur:p,repeatCount:"indefinite"})))))};g.defaultProps={animate:!0,backgroundColor:"#f5f6f7",backgroundOpacity:1,baseUrl:"",foregroundColor:"#eee",foregroundOpacity:1,gradientRatio:2,id:null,interval:.25,rtl:!1,speed:1.2,style:{},title:"Loading..."};var x=function(e){return e.children?t.exports.createElement(g,i({},e)):t.exports.createElement(S,i({},e))},S=function(e){return t.exports.createElement(x,i({viewBox:"0 0 476 124"},e),t.exports.createElement("rect",{x:"48",y:"8",width:"88",height:"6",rx:"3"}),t.exports.createElement("rect",{x:"48",y:"26",width:"52",height:"6",rx:"3"}),t.exports.createElement("rect",{x:"0",y:"56",width:"410",height:"6",rx:"3"}),t.exports.createElement("rect",{x:"0",y:"72",width:"380",height:"6",rx:"3"}),t.exports.createElement("rect",{x:"0",y:"88",width:"178",height:"6",rx:"3"}),t.exports.createElement("circle",{cx:"20",cy:"20",r:"20"}))},T=x;export{T as C};
