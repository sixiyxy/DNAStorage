import{k as b,l as S,m as A,d as R,a as g,j as y,n as w}from"./@babel.8bd90f99.js";import{r as v}from"./react.5be2fbc9.js";import{R as I}from"./rc-resize-observer.cd4dde61.js";import{o as C}from"./rc-util.871488ff.js";import{c as _}from"./classnames.88171464.js";import{s as T}from"./shallowequal.ea8d8004.js";var D=`
  min-height:0 !important;
  max-height:none !important;
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`,k=["letter-spacing","line-height","padding-top","padding-bottom","font-family","font-weight","font-size","font-variant","text-rendering","text-transform","width","text-indent","padding-left","padding-right","border-width","box-sizing","word-break"],z={},u;function P(i){var m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,n=i.getAttribute("id")||i.getAttribute("data-reactid")||i.getAttribute("name");if(m&&z[n])return z[n];var t=window.getComputedStyle(i),e=t.getPropertyValue("box-sizing")||t.getPropertyValue("-moz-box-sizing")||t.getPropertyValue("-webkit-box-sizing"),a=parseFloat(t.getPropertyValue("padding-bottom"))+parseFloat(t.getPropertyValue("padding-top")),r=parseFloat(t.getPropertyValue("border-bottom-width"))+parseFloat(t.getPropertyValue("border-top-width")),o=k.map(function(s){return"".concat(s,":").concat(t.getPropertyValue(s))}).join(";"),l={sizingStyle:o,paddingSize:a,borderSize:r,boxSizing:e};return m&&n&&(z[n]=l),l}function V(i){var m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:null,t=arguments.length>3&&arguments[3]!==void 0?arguments[3]:null;u||(u=document.createElement("textarea"),u.setAttribute("tab-index","-1"),u.setAttribute("aria-hidden","true"),document.body.appendChild(u)),i.getAttribute("wrap")?u.setAttribute("wrap",i.getAttribute("wrap")):u.removeAttribute("wrap");var e=P(i,m),a=e.paddingSize,r=e.borderSize,o=e.boxSizing,l=e.sizingStyle;u.setAttribute("style","".concat(l,";").concat(D)),u.value=i.value||i.placeholder||"";var s=Number.MIN_SAFE_INTEGER,c=Number.MAX_SAFE_INTEGER,d=u.scrollHeight,p;if(o==="border-box"?d+=r:o==="content-box"&&(d-=a),n!==null||t!==null){u.value=" ";var h=u.scrollHeight-a;n!==null&&(s=h*n,o==="border-box"&&(s=s+a+r),d=Math.max(s,d)),t!==null&&(c=h*t,o==="border-box"&&(c=c+a+r),p=d>c?"":"hidden",d=Math.min(c,d))}return{height:d,minHeight:s,maxHeight:c,overflowY:p,resize:"none"}}var f;(function(i){i[i.NONE=0]="NONE",i[i.RESIZING=1]="RESIZING",i[i.RESIZED=2]="RESIZED"})(f||(f={}));var O=function(i){b(n,i);var m=S(n);function n(t){var e;return A(this,n),e=m.call(this,t),e.nextFrameActionId=void 0,e.resizeFrameId=void 0,e.textArea=void 0,e.saveTextArea=function(a){e.textArea=a},e.handleResize=function(a){var r=e.state.resizeStatus,o=e.props,l=o.autoSize,s=o.onResize;r===f.NONE&&(typeof s=="function"&&s(a),l&&e.resizeOnNextFrame())},e.resizeOnNextFrame=function(){cancelAnimationFrame(e.nextFrameActionId),e.nextFrameActionId=requestAnimationFrame(e.resizeTextarea)},e.resizeTextarea=function(){var a=e.props.autoSize;if(!(!a||!e.textArea)){var r=a.minRows,o=a.maxRows,l=V(e.textArea,!1,r,o);e.setState({textareaStyles:l,resizeStatus:f.RESIZING},function(){cancelAnimationFrame(e.resizeFrameId),e.resizeFrameId=requestAnimationFrame(function(){e.setState({resizeStatus:f.RESIZED},function(){e.resizeFrameId=requestAnimationFrame(function(){e.setState({resizeStatus:f.NONE}),e.fixFirefoxAutoScroll()})})})})}},e.renderTextArea=function(){var a=e.props,r=a.prefixCls,o=r===void 0?"rc-textarea":r,l=a.autoSize,s=a.onResize,c=a.className,d=a.disabled,p=e.state,h=p.textareaStyles,F=p.resizeStatus,x=C(e.props,["prefixCls","onPressEnter","autoSize","defaultValue","onResize"]),E=_(o,c,R({},"".concat(o,"-disabled"),d));"value"in x&&(x.value=x.value||"");var N=g(g(g({},e.props.style),h),F===f.RESIZING?{overflowX:"hidden",overflowY:"hidden"}:null);return v.exports.createElement(I,{onResize:e.handleResize,disabled:!(l||s)},v.exports.createElement("textarea",y({},x,{className:E,style:N,ref:e.saveTextArea})))},e.state={textareaStyles:{},resizeStatus:f.NONE},e}return w(n,[{key:"componentDidUpdate",value:function(e){(e.value!==this.props.value||!T(e.autoSize,this.props.autoSize))&&this.resizeTextarea()}},{key:"componentWillUnmount",value:function(){cancelAnimationFrame(this.nextFrameActionId),cancelAnimationFrame(this.resizeFrameId)}},{key:"fixFirefoxAutoScroll",value:function(){try{if(document.activeElement===this.textArea){var e=this.textArea.selectionStart,a=this.textArea.selectionEnd;this.textArea.setSelectionRange(e,a)}}catch{}}},{key:"render",value:function(){return this.renderTextArea()}}]),n}(v.exports.Component),M=function(i){b(n,i);var m=S(n);function n(t){var e;A(this,n),e=m.call(this,t),e.resizableTextArea=void 0,e.focus=function(){e.resizableTextArea.textArea.focus()},e.saveTextArea=function(r){e.resizableTextArea=r},e.handleChange=function(r){var o=e.props.onChange;e.setValue(r.target.value,function(){e.resizableTextArea.resizeTextarea()}),o&&o(r)},e.handleKeyDown=function(r){var o=e.props,l=o.onPressEnter,s=o.onKeyDown;r.keyCode===13&&l&&l(r),s&&s(r)};var a=typeof t.value=="undefined"||t.value===null?t.defaultValue:t.value;return e.state={value:a},e}return w(n,[{key:"setValue",value:function(e,a){"value"in this.props||this.setState({value:e},a)}},{key:"blur",value:function(){this.resizableTextArea.textArea.blur()}},{key:"render",value:function(){return v.exports.createElement(O,y({},this.props,{value:this.state.value,onKeyDown:this.handleKeyDown,onChange:this.handleChange,ref:this.saveTextArea}))}}],[{key:"getDerivedStateFromProps",value:function(e){return"value"in e?{value:e.value}:null}}]),n}(v.exports.Component);export{M as T};
