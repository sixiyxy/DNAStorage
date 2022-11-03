import{r as f}from"./react.5be2fbc9.js";import{c as K}from"./classnames.88171464.js";import{R as Qe}from"./rc-resize-observer.cd4dde61.js";import{e as O,J as Xe,L as re}from"./rc-util.871488ff.js";function me(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter(function(u){return Object.getOwnPropertyDescriptor(e,u).enumerable})),n.push.apply(n,t)}return n}function be(e){for(var r=1;r<arguments.length;r++){var n=arguments[r]!=null?arguments[r]:{};r%2?me(Object(n),!0).forEach(function(t){Pe(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):me(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Pe(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}var He=f.exports.forwardRef(function(e,r){var n=e.height,t=e.offset,u=e.children,i=e.prefixCls,l=e.onInnerResize,o={},a={display:"flex",flexDirection:"column"};return t!==void 0&&(o={height:n,position:"relative",overflow:"hidden"},a=be(be({},a),{},{transform:"translateY(".concat(t,"px)"),position:"absolute",left:0,right:0,top:0})),f.exports.createElement("div",{style:o},f.exports.createElement(Qe,{onResize:function(v){var s=v.offsetHeight;s&&l&&l()}},f.exports.createElement("div",{style:a,className:K(Pe({},"".concat(i,"-holder-inner"),i)),ref:r},u)))});He.displayName="Filler";function ne(e){return ne=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(r){return typeof r}:function(r){return r&&typeof Symbol=="function"&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},ne(e)}function Se(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function et(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function Re(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function tt(e,r,n){return r&&Re(e.prototype,r),n&&Re(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function rt(e,r){if(typeof r!="function"&&r!==null)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),r&&oe(e,r)}function oe(e,r){return oe=Object.setPrototypeOf||function(t,u){return t.__proto__=u,t},oe(e,r)}function nt(e){var r=it();return function(){var t=V(e),u;if(r){var i=V(this).constructor;u=Reflect.construct(t,arguments,i)}else u=t.apply(this,arguments);return ot(this,u)}}function ot(e,r){if(r&&(ne(r)==="object"||typeof r=="function"))return r;if(r!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return ut(e)}function ut(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function it(){if(typeof Reflect=="undefined"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function V(e){return V=Object.setPrototypeOf?Object.getPrototypeOf:function(n){return n.__proto__||Object.getPrototypeOf(n)},V(e)}var at=20;function _e(e){return"touches"in e?e.touches[0].pageY:e.pageY}var lt=function(e){rt(n,e);var r=nt(n);function n(){var t;et(this,n);for(var u=arguments.length,i=new Array(u),l=0;l<u;l++)i[l]=arguments[l];return t=r.call.apply(r,[this].concat(i)),t.moveRaf=null,t.scrollbarRef=f.exports.createRef(),t.thumbRef=f.exports.createRef(),t.visibleTimeout=null,t.state={dragging:!1,pageY:null,startTop:null,visible:!1},t.delayHidden=function(){clearTimeout(t.visibleTimeout),t.setState({visible:!0}),t.visibleTimeout=setTimeout(function(){t.setState({visible:!1})},2e3)},t.onScrollbarTouchStart=function(o){o.preventDefault()},t.onContainerMouseDown=function(o){o.stopPropagation(),o.preventDefault()},t.patchEvents=function(){window.addEventListener("mousemove",t.onMouseMove),window.addEventListener("mouseup",t.onMouseUp),t.thumbRef.current.addEventListener("touchmove",t.onMouseMove),t.thumbRef.current.addEventListener("touchend",t.onMouseUp)},t.removeEvents=function(){var o;window.removeEventListener("mousemove",t.onMouseMove),window.removeEventListener("mouseup",t.onMouseUp),(o=t.scrollbarRef.current)===null||o===void 0||o.removeEventListener("touchstart",t.onScrollbarTouchStart),t.thumbRef.current&&(t.thumbRef.current.removeEventListener("touchstart",t.onMouseDown),t.thumbRef.current.removeEventListener("touchmove",t.onMouseMove),t.thumbRef.current.removeEventListener("touchend",t.onMouseUp)),O.cancel(t.moveRaf)},t.onMouseDown=function(o){var a=t.props.onStartMove;t.setState({dragging:!0,pageY:_e(o),startTop:t.getTop()}),a(),t.patchEvents(),o.stopPropagation(),o.preventDefault()},t.onMouseMove=function(o){var a=t.state,c=a.dragging,v=a.pageY,s=a.startTop,h=t.props.onScroll;if(O.cancel(t.moveRaf),c){var d=_e(o)-v,g=s+d,b=t.getEnableScrollRange(),S=t.getEnableHeightRange(),M=S?g/S:0,E=Math.ceil(M*b);t.moveRaf=O(function(){h(E)})}},t.onMouseUp=function(){var o=t.props.onStopMove;t.setState({dragging:!1}),o(),t.removeEvents()},t.getSpinHeight=function(){var o=t.props,a=o.height,c=o.count,v=a/c*10;return v=Math.max(v,at),v=Math.min(v,a/2),Math.floor(v)},t.getEnableScrollRange=function(){var o=t.props,a=o.scrollHeight,c=o.height;return a-c||0},t.getEnableHeightRange=function(){var o=t.props.height,a=t.getSpinHeight();return o-a||0},t.getTop=function(){var o=t.props.scrollTop,a=t.getEnableScrollRange(),c=t.getEnableHeightRange();if(o===0||a===0)return 0;var v=o/a;return v*c},t.showScroll=function(){var o=t.props,a=o.height,c=o.scrollHeight;return c>a},t}return tt(n,[{key:"componentDidMount",value:function(){this.scrollbarRef.current.addEventListener("touchstart",this.onScrollbarTouchStart),this.thumbRef.current.addEventListener("touchstart",this.onMouseDown)}},{key:"componentDidUpdate",value:function(u){u.scrollTop!==this.props.scrollTop&&this.delayHidden()}},{key:"componentWillUnmount",value:function(){this.removeEvents(),clearTimeout(this.visibleTimeout)}},{key:"render",value:function(){var u=this.state,i=u.dragging,l=u.visible,o=this.props.prefixCls,a=this.getSpinHeight(),c=this.getTop(),v=this.showScroll(),s=v&&l;return f.exports.createElement("div",{ref:this.scrollbarRef,className:K("".concat(o,"-scrollbar"),Se({},"".concat(o,"-scrollbar-show"),v)),style:{width:8,top:0,bottom:0,right:0,position:"absolute",display:s?null:"none"},onMouseDown:this.onContainerMouseDown,onMouseMove:this.delayHidden},f.exports.createElement("div",{ref:this.thumbRef,className:K("".concat(o,"-scrollbar-thumb"),Se({},"".concat(o,"-scrollbar-thumb-moving"),i)),style:{width:"100%",height:a,top:c,left:0,position:"absolute",background:"rgba(0, 0, 0, 0.5)",borderRadius:99,cursor:"pointer",userSelect:"none"},onMouseDown:this.onMouseDown}))}}]),n}(f.exports.Component);function ft(e){var r=e.children,n=e.setRef,t=f.exports.useCallback(function(u){n(u)},[]);return f.exports.cloneElement(r,{ref:t})}function ct(e,r,n,t,u,i){var l=i.getKey;return e.slice(r,n+1).map(function(o,a){var c=r+a,v=u(o,c,{}),s=l(o);return f.exports.createElement(ft,{key:s,setRef:function(d){return t(o,d)}},v)})}function st(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function xe(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function vt(e,r,n){return r&&xe(e.prototype,r),n&&xe(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}var pt=function(){function e(){st(this,e),this.maps=void 0,this.maps=Object.create(null)}return vt(e,[{key:"set",value:function(n,t){this.maps[n]=t}},{key:"get",value:function(n){return this.maps[n]}}]),e}();function ht(e,r){return mt(e)||gt(e,r)||yt(e,r)||dt()}function dt(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function yt(e,r){if(!!e){if(typeof e=="string")return we(e,r);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return we(e,r)}}function we(e,r){(r==null||r>e.length)&&(r=e.length);for(var n=0,t=new Array(r);n<r;n++)t[n]=e[n];return t}function gt(e,r){var n=e==null?null:typeof Symbol!="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var t=[],u=!0,i=!1,l,o;try{for(n=n.call(e);!(u=(l=n.next()).done)&&(t.push(l.value),!(r&&t.length===r));u=!0);}catch(a){i=!0,o=a}finally{try{!u&&n.return!=null&&n.return()}finally{if(i)throw o}}return t}}function mt(e){if(Array.isArray(e))return e}function bt(e,r,n){var t=f.exports.useState(0),u=ht(t,2),i=u[0],l=u[1],o=f.exports.useRef(new Map),a=f.exports.useRef(new pt),c=f.exports.useRef();function v(){O.cancel(c.current)}function s(){v(),c.current=O(function(){o.current.forEach(function(d,g){if(d&&d.offsetParent){var b=Xe(d),S=b.offsetHeight;a.current.get(g)!==S&&a.current.set(g,b.offsetHeight)}}),l(function(d){return d+1})})}function h(d,g){var b=e(d),S=o.current.get(b);g?(o.current.set(b,g),s()):o.current.delete(b),!S!=!g&&(g?r==null||r(d):n==null||n(d))}return f.exports.useEffect(function(){return v},[]),[h,s,a.current,i]}function ue(e){return ue=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(r){return typeof r}:function(r){return r&&typeof Symbol=="function"&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},ue(e)}function St(e,r,n,t,u,i,l,o){var a=f.exports.useRef();return function(c){if(c==null){o();return}if(O.cancel(a.current),typeof c=="number")l(c);else if(c&&ue(c)==="object"){var v,s=c.align;"index"in c?v=c.index:v=r.findIndex(function(b){return u(b)===c.key});var h=c.offset,d=h===void 0?0:h,g=function b(S,M){if(!(S<0||!e.current)){var E=e.current.clientHeight,_=!1,D=M;if(E){for(var B=M||s,L=0,x=0,$=0,G=Math.min(r.length,v),T=0;T<=G;T+=1){var J=u(r[T]);x=L;var I=n.get(J);$=x+(I===void 0?t:I),L=$,T===v&&I===void 0&&(_=!0)}var P=null;switch(B){case"top":P=x-d;break;case"bottom":P=$-E+d;break;default:{var m=e.current.scrollTop,R=m+E;x<m?D="top":$>R&&(D="bottom")}}P!==null&&P!==e.current.scrollTop&&l(P)}a.current=O(function(){_&&i(),b(S-1,D)})}};g(3)}}}function Rt(e,r,n){var t=e.length,u=r.length,i,l;if(t===0&&u===0)return null;t<u?(i=e,l=r):(i=r,l=e);var o={__EMPTY_ITEM__:!0};function a(g){return g!==void 0?n(g):o}for(var c=null,v=Math.abs(t-u)!==1,s=0;s<l.length;s+=1){var h=a(i[s]),d=a(l[s]);if(h!==d){c=s,v=v||h!==a(l[s+1]);break}}return c===null?null:{index:c,multiple:v}}function Oe(e,r){return Ot(e)||wt(e,r)||xt(e,r)||_t()}function _t(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function xt(e,r){if(!!e){if(typeof e=="string")return Me(e,r);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Me(e,r)}}function Me(e,r){(r==null||r>e.length)&&(r=e.length);for(var n=0,t=new Array(r);n<r;n++)t[n]=e[n];return t}function wt(e,r){var n=e==null?null:typeof Symbol!="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var t=[],u=!0,i=!1,l,o;try{for(n=n.call(e);!(u=(l=n.next()).done)&&(t.push(l.value),!(r&&t.length===r));u=!0);}catch(a){i=!0,o=a}finally{try{!u&&n.return!=null&&n.return()}finally{if(i)throw o}}return t}}function Ot(e){if(Array.isArray(e))return e}function Mt(e,r,n){var t=f.exports.useState(e),u=Oe(t,2),i=u[0],l=u[1],o=f.exports.useState(null),a=Oe(o,2),c=a[0],v=a[1];return f.exports.useEffect(function(){var s=Rt(i||[],e||[],r);(s==null?void 0:s.index)!==void 0&&(n==null||n(s.index),v(e[s.index])),l(e)},[e]),[c]}function ie(e){return ie=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(r){return typeof r}:function(r){return r&&typeof Symbol=="function"&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},ie(e)}var Et=(typeof navigator=="undefined"?"undefined":ie(navigator))==="object"&&/Firefox/i.test(navigator.userAgent),De=function(e,r){var n=f.exports.useRef(!1),t=f.exports.useRef(null);function u(){clearTimeout(t.current),n.current=!0,t.current=setTimeout(function(){n.current=!1},50)}var i=f.exports.useRef({top:e,bottom:r});return i.current.top=e,i.current.bottom=r,function(l){var o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,a=l<0&&i.current.top||l>0&&i.current.bottom;return o&&a?(clearTimeout(t.current),n.current=!1):(!a||n.current)&&u(),!n.current&&a}};function Tt(e,r,n,t){var u=f.exports.useRef(0),i=f.exports.useRef(null),l=f.exports.useRef(null),o=f.exports.useRef(!1),a=De(r,n);function c(s){if(!!e){O.cancel(i.current);var h=s.deltaY;u.current+=h,l.current=h,!a(h)&&(Et||s.preventDefault(),i.current=O(function(){var d=o.current?10:1;t(u.current*d),u.current=0}))}}function v(s){!e||(o.current=s.detail===l.current)}return[c,v]}var Pt=14/15;function Ht(e,r,n){var t=f.exports.useRef(!1),u=f.exports.useRef(0),i=f.exports.useRef(null),l=f.exports.useRef(null),o,a=function(h){if(t.current){var d=Math.ceil(h.touches[0].pageY),g=u.current-d;u.current=d,n(g)&&h.preventDefault(),clearInterval(l.current),l.current=setInterval(function(){g*=Pt,(!n(g,!0)||Math.abs(g)<=.1)&&clearInterval(l.current)},16)}},c=function(){t.current=!1,o()},v=function(h){o(),h.touches.length===1&&!t.current&&(t.current=!0,u.current=Math.ceil(h.touches[0].pageY),i.current=h.target,i.current.addEventListener("touchmove",a),i.current.addEventListener("touchend",c))};o=function(){i.current&&(i.current.removeEventListener("touchmove",a),i.current.removeEventListener("touchend",c))},re(function(){return e&&r.current.addEventListener("touchstart",v),function(){var s;(s=r.current)===null||s===void 0||s.removeEventListener("touchstart",v),o(),clearInterval(l.current)}},[e])}var Dt=["prefixCls","className","height","itemHeight","fullHeight","style","data","children","itemKey","virtual","component","onScroll","onVisibleChange"];function ae(){return ae=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var n=arguments[r];for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])}return e},ae.apply(this,arguments)}function Ee(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter(function(u){return Object.getOwnPropertyDescriptor(e,u).enumerable})),n.push.apply(n,t)}return n}function te(e){for(var r=1;r<arguments.length;r++){var n=arguments[r]!=null?arguments[r]:{};r%2?Ee(Object(n),!0).forEach(function(t){$e(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Ee(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function $e(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function k(e,r){return Lt(e)||jt(e,r)||It(e,r)||$t()}function $t(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function It(e,r){if(!!e){if(typeof e=="string")return Te(e,r);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Te(e,r)}}function Te(e,r){(r==null||r>e.length)&&(r=e.length);for(var n=0,t=new Array(r);n<r;n++)t[n]=e[n];return t}function jt(e,r){var n=e==null?null:typeof Symbol!="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var t=[],u=!0,i=!1,l,o;try{for(n=n.call(e);!(u=(l=n.next()).done)&&(t.push(l.value),!(r&&t.length===r));u=!0);}catch(a){i=!0,o=a}finally{try{!u&&n.return!=null&&n.return()}finally{if(i)throw o}}return t}}function Lt(e){if(Array.isArray(e))return e}function At(e,r){if(e==null)return{};var n=Ct(e,r),t,u;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(u=0;u<i.length;u++)t=i[u],!(r.indexOf(t)>=0)&&(!Object.prototype.propertyIsEnumerable.call(e,t)||(n[t]=e[t]))}return n}function Ct(e,r){if(e==null)return{};var n={},t=Object.keys(e),u,i;for(i=0;i<t.length;i++)u=t[i],!(r.indexOf(u)>=0)&&(n[u]=e[u]);return n}var kt=[],Nt={overflowY:"auto",overflowAnchor:"none"};function Ut(e,r){var n=e.prefixCls,t=n===void 0?"rc-virtual-list":n,u=e.className,i=e.height,l=e.itemHeight,o=e.fullHeight,a=o===void 0?!0:o,c=e.style,v=e.data,s=e.children,h=e.itemKey,d=e.virtual,g=e.component,b=g===void 0?"div":g,S=e.onScroll,M=e.onVisibleChange,E=At(e,Dt),_=!!(d!==!1&&i&&l),D=_&&v&&l*v.length>i,B=f.exports.useState(0),L=k(B,2),x=L[0],$=L[1],G=f.exports.useState(!1),T=k(G,2),J=T[0],I=T[1],P=K(t,u),m=v||kt,R=f.exports.useRef(),le=f.exports.useRef(),fe=f.exports.useRef(),A=f.exports.useCallback(function(p){return typeof h=="function"?h(p):p==null?void 0:p[h]},[h]),Ie={getKey:A};function N(p){$(function(y){var w;typeof p=="function"?w=p(y):w=p;var j=We(w);return R.current.scrollTop=j,j})}var ce=f.exports.useRef({start:0,end:m.length}),je=f.exports.useRef(),Le=Mt(m,A),Ae=k(Le,1),Ce=Ae[0];je.current=Ce;var ke=bt(A,null,null),U=k(ke,4),Ne=U[0],se=U[1],ve=U[2],Ue=U[3],F=f.exports.useMemo(function(){if(!_)return{scrollHeight:void 0,start:0,end:m.length-1,offset:void 0};if(!D){var p;return{scrollHeight:((p=le.current)===null||p===void 0?void 0:p.offsetHeight)||0,start:0,end:m.length-1,offset:void 0}}for(var y=0,w,j,H,Je=m.length,C=0;C<Je;C+=1){var Ze=m[C],qe=A(Ze),ge=ve.get(qe),ee=y+(ge===void 0?l:ge);ee>=x&&w===void 0&&(w=C,j=y),ee>x+i&&H===void 0&&(H=C),y=ee}return w===void 0&&(w=0,j=0),H===void 0&&(H=m.length-1),H=Math.min(H+1,m.length),{scrollHeight:y,start:w,end:H,offset:j}},[D,_,x,m,Ue,i]),Z=F.scrollHeight,W=F.start,Y=F.end,Fe=F.offset;ce.current.start=W,ce.current.end=Y;var q=Z-i,Q=f.exports.useRef(q);Q.current=q;function We(p){var y=p;return Number.isNaN(Q.current)||(y=Math.min(y,Q.current)),y=Math.max(y,0),y}var pe=x<=0,he=x>=q,Ye=De(pe,he);function ze(p){var y=p;N(y)}function Ke(p){var y=p.currentTarget.scrollTop;y!==x&&N(y),S==null||S(p)}var Ve=Tt(_,pe,he,function(p){N(function(y){var w=y+p;return w})}),de=k(Ve,2),X=de[0],ye=de[1];Ht(_,R,function(p,y){return Ye(p,y)?!1:(X({preventDefault:function(){},deltaY:p}),!0)}),re(function(){function p(y){_&&y.preventDefault()}return R.current.addEventListener("wheel",X),R.current.addEventListener("DOMMouseScroll",ye),R.current.addEventListener("MozMousePixelScroll",p),function(){R.current&&(R.current.removeEventListener("wheel",X),R.current.removeEventListener("DOMMouseScroll",ye),R.current.removeEventListener("MozMousePixelScroll",p))}},[_]);var Be=St(R,m,ve,l,A,se,N,function(){var p;(p=fe.current)===null||p===void 0||p.delayHidden()});f.exports.useImperativeHandle(r,function(){return{scrollTo:Be}}),re(function(){if(M){var p=m.slice(W,Y+1);M(p,m)}},[W,Y,m]);var Ge=ct(m,W,Y,Ne,s,Ie),z=null;return i&&(z=te($e({},a?"height":"maxHeight",i),Nt),_&&(z.overflowY="hidden",J&&(z.pointerEvents="none"))),f.exports.createElement("div",ae({style:te(te({},c),{},{position:"relative"}),className:P},E),f.exports.createElement(b,{className:"".concat(t,"-holder"),style:z,ref:R,onScroll:Ke},f.exports.createElement(He,{prefixCls:t,height:Z,offset:Fe,onInnerResize:se,ref:le},Ge)),_&&f.exports.createElement(lt,{ref:fe,prefixCls:t,scrollTop:x,height:i,scrollHeight:Z,count:m.length,onScroll:ze,onStartMove:function(){I(!0)},onStopMove:function(){I(!1)}}))}var Ft=f.exports.forwardRef(Ut);Ft.displayName="List";export{Ft as L};
