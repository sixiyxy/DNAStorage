import{b as k,j as g,a as z,c as y}from"./@babel.f35c36d6.js";import{r}from"./react.6037337b.js";import{c as ie}from"./classnames.ebd64329.js";import{R as Ce}from"./rc-resize-observer.db6cce6c.js";import{j as Ye,e as Ne,G as qe}from"./rc-util.9c09048a.js";var Je=["prefixCls","invalidate","item","renderItem","responsive","responsiveDisabled","registerSize","itemKey","className","style","children","display","order","component"],b=void 0;function Qe(e,f){var c=e.prefixCls,i=e.invalidate,l=e.item,n=e.renderItem,u=e.responsive,p=e.responsiveDisabled,o=e.registerSize,R=e.itemKey,_=e.className,h=e.style,H=e.children,Y=e.display,v=e.order,F=e.component,P=F===void 0?"div":F,U=k(e,Je),m=u&&!Y;function K(w){o(R,w)}r.exports.useEffect(function(){return function(){K(null)}},[]);var q=n&&l!==b?n(l):H,I;i||(I={opacity:m?0:1,height:m?0:b,overflowY:m?"hidden":b,order:u?v:b,pointerEvents:m?"none":b,position:m?"absolute":b});var M={};m&&(M["aria-hidden"]=!0);var x=r.exports.createElement(P,g({className:ie(!i&&c,_),style:z(z({},I),h)},M,U,{ref:f}),q);return u&&(x=r.exports.createElement(Ce,{onResize:function(J){var O=J.offsetWidth;K(O)},disabled:p},x)),x}var A=r.exports.forwardRef(Qe);A.displayName="Item";function Ze(){var e=Ye({}),f=y(e,2),c=f[1],i=r.exports.useRef([]),l=0,n=0;function u(p){var o=l;l+=1,i.current.length<o+1&&(i.current[o]=p);var R=i.current[o];function _(h){i.current[o]=typeof h=="function"?h(i.current[o]):h,Ne.cancel(n),n=Ne(function(){c({},!0)})}return[R,_]}return u}var et=["component"],tt=["className"],rt=["className"],at=function(f,c){var i=r.exports.useContext(X);if(!i){var l=f.component,n=l===void 0?"div":l,u=k(f,et);return r.exports.createElement(n,g({},u,{ref:c}))}var p=i.className,o=k(i,tt),R=f.className,_=k(f,rt);return r.exports.createElement(X.Provider,{value:null},r.exports.createElement(A,g({ref:c,className:ie(p,R)},o,_)))},ge=r.exports.forwardRef(at);ge.displayName="RawItem";var nt=["prefixCls","data","renderItem","renderRawItem","itemKey","itemWidth","ssr","style","className","maxCount","renderRest","renderRawRest","suffix","component","itemComponent","onVisibleChange"],X=r.exports.createContext(null),Ie="responsive",we="invalidate";function st(e){return"+ ".concat(e.length," ...")}function it(e,f){var c=e.prefixCls,i=c===void 0?"rc-overflow":c,l=e.data,n=l===void 0?[]:l,u=e.renderItem,p=e.renderRawItem,o=e.itemKey,R=e.itemWidth,_=R===void 0?10:R,h=e.ssr,H=e.style,Y=e.className,v=e.maxCount,F=e.renderRest,P=e.renderRawRest,U=e.suffix,m=e.component,K=m===void 0?"div":m,q=e.itemComponent,I=e.onVisibleChange,M=k(e,nt),x=Ze(),w=h==="full",J=x(null),O=y(J,2),V=O[0],Ee=O[1],N=V||0,be=x(new Map),oe=y(be,2),le=oe[0],ze=oe[1],Pe=x(0),fe=y(Pe,2),Ue=fe[0],We=fe[1],De=x(0),ue=y(De,2),$=ue[0],ke=ue[1],Ae=x(0),de=y(Ae,2),T=de[0],Fe=de[1],Ke=r.exports.useState(null),ce=y(Ke,2),ve=ce[0],j=ce[1],Me=r.exports.useState(null),me=y(Me,2),Q=me[0],Oe=me[1],E=r.exports.useMemo(function(){return Q===null&&w?Number.MAX_SAFE_INTEGER:Q||0},[Q,V]),Ve=r.exports.useState(!1),xe=y(Ve,2),$e=xe[0],Te=xe[1],Z="".concat(i,"-item"),Se=Math.max(Ue,$),ee=v===Ie,S=n.length&&ee,ye=v===we,je=S||typeof v=="number"&&n.length>v,C=r.exports.useMemo(function(){var t=n;return S?V===null&&w?t=n:t=n.slice(0,Math.min(n.length,N/_)):typeof v=="number"&&(t=n.slice(0,v)),t},[n,_,V,v,S]),te=r.exports.useMemo(function(){return S?n.slice(E+1):n.slice(C.length)},[n,C,S,E]),G=r.exports.useCallback(function(t,a){var s;return typeof o=="function"?o(t):(s=o&&(t==null?void 0:t[o]))!==null&&s!==void 0?s:a},[o]),Ge=r.exports.useCallback(u||function(t){return t},[u]);function L(t,a){Oe(t),a||(Te(t<n.length-1),I==null||I(t))}function Le(t,a){Ee(a.clientWidth)}function pe(t,a){ze(function(s){var d=new Map(s);return a===null?d.delete(t):d.set(t,a),d})}function Xe(t,a){ke(a),We($)}function Be(t,a){Fe(a)}function re(t){return le.get(G(C[t],t))}qe(function(){if(N&&Se&&C){var t=T,a=C.length,s=a-1;if(!a){L(0),j(null);return}for(var d=0;d<a;d+=1){var D=re(d);if(w&&(D=D||0),D===void 0){L(d-1,!0);break}if(t+=D,s===0&&t<=N||d===s-1&&t+re(s)<=N){L(s),j(null);break}else if(t+Se>N){L(d-1),j(t-D-T+$);break}}U&&re(0)+T>N&&j(null)}},[N,le,$,T,G,C]);var Re=$e&&!!te.length,_e={};ve!==null&&S&&(_e={position:"absolute",left:ve,top:0});var W={prefixCls:Z,responsive:S,component:q,invalidate:ye},He=p?function(t,a){var s=G(t,a);return r.exports.createElement(X.Provider,{key:s,value:z(z({},W),{},{order:a,item:t,itemKey:s,registerSize:pe,display:a<=E})},p(t,a))}:function(t,a){var s=G(t,a);return r.exports.createElement(A,g({},W,{order:a,key:s,item:t,renderItem:Ge,itemKey:s,registerSize:pe,display:a<=E}))},ae,he={order:Re?E:Number.MAX_SAFE_INTEGER,className:"".concat(Z,"-rest"),registerSize:Xe,display:Re};if(P)P&&(ae=r.exports.createElement(X.Provider,{value:z(z({},W),he)},P(te)));else{var ne=F||st;ae=r.exports.createElement(A,g({},W,he),typeof ne=="function"?ne(te):ne)}var se=r.exports.createElement(K,g({className:ie(!ye&&i,Y),style:H,ref:f},M),C.map(He),je?ae:null,U&&r.exports.createElement(A,g({},W,{responsive:ee,responsiveDisabled:!S,order:E,className:"".concat(Z,"-suffix"),registerSize:Be,display:!0,style:_e}),U));return ee&&(se=r.exports.createElement(Ce,{onResize:Le,disabled:!S},se)),se}var B=r.exports.forwardRef(it);B.displayName="Overflow";B.Item=ge;B.RESPONSIVE=Ie;B.INVALIDATE=we;export{B as F};
