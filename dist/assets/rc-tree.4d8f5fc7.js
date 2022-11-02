import{d as w,j as G,k as je,l as We,m as qe,p as z,a as I,n as Ye,b as Ke,q as ee,_ as Pe,c as oe}from"./@babel.8bd90f99.js";import{r as m}from"./react.5be2fbc9.js";import{w as X,B as ze,t as at,o as ot,K as ae}from"./rc-util.871488ff.js";import{c as U}from"./classnames.88171464.js";import{L as dt}from"./rc-virtual-list.9e34bae9.js";import{C as it}from"./rc-motion.673c135c.js";function Xe(a,i){var p=new Set;return a.forEach(function(e){i.has(e)||p.add(e)}),p}function st(a){var i=a||{},p=i.disabled,e=i.disableCheckbox,o=i.checkable;return!!(p||e)||o===!1}function lt(a,i,p,e){for(var o=new Set(a),u=new Set,h=0;h<=p;h+=1){var t=i.get(h)||new Set;t.forEach(function(s){var l=s.key,f=s.node,v=s.children,g=v===void 0?[]:v;o.has(l)&&!e(f)&&g.filter(function(y){return!e(y.node)}).forEach(function(y){o.add(y.key)})})}for(var n=new Set,r=p;r>=0;r-=1){var d=i.get(r)||new Set;d.forEach(function(s){var l=s.parent,f=s.node;if(!(e(f)||!s.parent||n.has(s.parent.key))){if(e(s.parent.node)){n.add(l.key);return}var v=!0,g=!1;(l.children||[]).filter(function(y){return!e(y.node)}).forEach(function(y){var c=y.key,K=o.has(c);v&&!K&&(v=!1),!g&&(K||u.has(c))&&(g=!0)}),v&&o.add(l.key),g&&u.add(l.key),n.add(l.key)}})}return{checkedKeys:Array.from(o),halfCheckedKeys:Array.from(Xe(u,o))}}function ct(a,i,p,e,o){for(var u=new Set(a),h=new Set(i),t=0;t<=e;t+=1){var n=p.get(t)||new Set;n.forEach(function(l){var f=l.key,v=l.node,g=l.children,y=g===void 0?[]:g;!u.has(f)&&!h.has(f)&&!o(v)&&y.filter(function(c){return!o(c.node)}).forEach(function(c){u.delete(c.key)})})}h=new Set;for(var r=new Set,d=e;d>=0;d-=1){var s=p.get(d)||new Set;s.forEach(function(l){var f=l.parent,v=l.node;if(!(o(v)||!l.parent||r.has(l.parent.key))){if(o(l.parent.node)){r.add(f.key);return}var g=!0,y=!1;(f.children||[]).filter(function(c){return!o(c.node)}).forEach(function(c){var K=c.key,x=u.has(K);g&&!x&&(g=!1),!y&&(x||h.has(K))&&(y=!0)}),g||u.delete(f.key),y&&h.add(f.key),r.add(f.key)}})}return{checkedKeys:Array.from(u),halfCheckedKeys:Array.from(Xe(h,u))}}function Ee(a,i,p,e){var o=[],u;e?u=e:u=st;var h=new Set(a.filter(function(d){var s=!!p[d];return s||o.push(d),s})),t=new Map,n=0;Object.keys(p).forEach(function(d){var s=p[d],l=s.level,f=t.get(l);f||(f=new Set,t.set(l,f)),f.add(s),n=Math.max(n,l)}),X(!o.length,"Tree missing follow keys: ".concat(o.slice(0,100).map(function(d){return"'".concat(d,"'")}).join(", ")));var r;return i===!0?r=lt(h,t,n,u):r=ct(h,i.halfCheckedKeys,t,n,u),r}var Te=m.exports.createContext(null),ut=function(i){for(var p=i.prefixCls,e=i.level,o=i.isStart,u=i.isEnd,h="".concat(p,"-indent-unit"),t=[],n=0;n<e;n+=1){var r;t.push(m.exports.createElement("span",{key:n,className:U(h,(r={},w(r,"".concat(h,"-start"),o[n]),w(r,"".concat(h,"-end"),u[n]),r))}))}return m.exports.createElement("span",{"aria-hidden":"true",className:"".concat(p,"-indent")},t)},ft=m.exports.memo(ut),pt=["eventKey","className","style","dragOver","dragOverGapTop","dragOverGapBottom","isLeaf","isStart","isEnd","expanded","selected","checked","halfChecked","loading","domRef","active","data","onMouseMove","selectable"],Re="open",Ie="close",vt="---",ht=function(a){je(p,a);var i=We(p);function p(){var e;qe(this,p);for(var o=arguments.length,u=new Array(o),h=0;h<o;h++)u[h]=arguments[h];return e=i.call.apply(i,[this].concat(u)),e.state={dragNodeHighlight:!1},e.selectHandle=void 0,e.onSelectorClick=function(t){var n=e.props.context.onNodeClick;n(t,M(e.props)),e.isSelectable()?e.onSelect(t):e.onCheck(t)},e.onSelectorDoubleClick=function(t){var n=e.props.context.onNodeDoubleClick;n(t,M(e.props))},e.onSelect=function(t){if(!e.isDisabled()){var n=e.props.context.onNodeSelect;t.preventDefault(),n(t,M(e.props))}},e.onCheck=function(t){if(!e.isDisabled()){var n=e.props,r=n.disableCheckbox,d=n.checked,s=e.props.context.onNodeCheck;if(!(!e.isCheckable()||r)){t.preventDefault();var l=!d;s(t,M(e.props),l)}}},e.onMouseEnter=function(t){var n=e.props.context.onNodeMouseEnter;n(t,M(e.props))},e.onMouseLeave=function(t){var n=e.props.context.onNodeMouseLeave;n(t,M(e.props))},e.onContextMenu=function(t){var n=e.props.context.onNodeContextMenu;n(t,M(e.props))},e.onDragStart=function(t){var n=e.props.context.onNodeDragStart;t.stopPropagation(),e.setState({dragNodeHighlight:!0}),n(t,z(e));try{t.dataTransfer.setData("text/plain","")}catch{}},e.onDragEnter=function(t){var n=e.props.context.onNodeDragEnter;t.preventDefault(),t.stopPropagation(),n(t,z(e))},e.onDragOver=function(t){var n=e.props.context.onNodeDragOver;t.preventDefault(),t.stopPropagation(),n(t,z(e))},e.onDragLeave=function(t){var n=e.props.context.onNodeDragLeave;t.stopPropagation(),n(t,z(e))},e.onDragEnd=function(t){var n=e.props.context.onNodeDragEnd;t.stopPropagation(),e.setState({dragNodeHighlight:!1}),n(t,z(e))},e.onDrop=function(t){var n=e.props.context.onNodeDrop;t.preventDefault(),t.stopPropagation(),e.setState({dragNodeHighlight:!1}),n(t,z(e))},e.onExpand=function(t){var n=e.props,r=n.loading,d=n.context.onNodeExpand;r||d(t,M(e.props))},e.setSelectHandle=function(t){e.selectHandle=t},e.getNodeState=function(){var t=e.props.expanded;return e.isLeaf()?null:t?Re:Ie},e.hasChildren=function(){var t=e.props.eventKey,n=e.props.context.keyEntities,r=n[t]||{},d=r.children;return!!(d||[]).length},e.isLeaf=function(){var t=e.props,n=t.isLeaf,r=t.loaded,d=e.props.context.loadData,s=e.hasChildren();return n===!1?!1:n||!d&&!s||d&&r&&!s},e.isDisabled=function(){var t=e.props.disabled,n=e.props.context.disabled;return!!(n||t)},e.isCheckable=function(){var t=e.props.checkable,n=e.props.context.checkable;return!n||t===!1?!1:n},e.syncLoadData=function(t){var n=t.expanded,r=t.loading,d=t.loaded,s=e.props.context,l=s.loadData,f=s.onNodeLoad;r||l&&n&&!e.isLeaf()&&!e.hasChildren()&&!d&&f(M(e.props))},e.isDraggable=function(){var t=e.props,n=t.data,r=t.context.draggable;return!!(r&&(!r.nodeDraggable||r.nodeDraggable(n)))},e.renderDragHandler=function(){var t=e.props.context,n=t.draggable,r=t.prefixCls;return n!=null&&n.icon?m.exports.createElement("span",{className:"".concat(r,"-draggable-icon")},n.icon):null},e.renderSwitcherIconDom=function(t){var n=e.props.switcherIcon,r=e.props.context.switcherIcon,d=n||r;return typeof d=="function"?d(I(I({},e.props),{},{isLeaf:t})):d},e.renderSwitcher=function(){var t=e.props.expanded,n=e.props.context.prefixCls;if(e.isLeaf()){var r=e.renderSwitcherIconDom(!0);return r!==!1?m.exports.createElement("span",{className:U("".concat(n,"-switcher"),"".concat(n,"-switcher-noop"))},r):null}var d=U("".concat(n,"-switcher"),"".concat(n,"-switcher_").concat(t?Re:Ie)),s=e.renderSwitcherIconDom(!1);return s!==!1?m.exports.createElement("span",{onClick:e.onExpand,className:d},s):null},e.renderCheckbox=function(){var t=e.props,n=t.checked,r=t.halfChecked,d=t.disableCheckbox,s=e.props.context.prefixCls,l=e.isDisabled(),f=e.isCheckable();if(!f)return null;var v=typeof f!="boolean"?f:null;return m.exports.createElement("span",{className:U("".concat(s,"-checkbox"),n&&"".concat(s,"-checkbox-checked"),!n&&r&&"".concat(s,"-checkbox-indeterminate"),(l||d)&&"".concat(s,"-checkbox-disabled")),onClick:e.onCheck},v)},e.renderIcon=function(){var t=e.props.loading,n=e.props.context.prefixCls;return m.exports.createElement("span",{className:U("".concat(n,"-iconEle"),"".concat(n,"-icon__").concat(e.getNodeState()||"docu"),t&&"".concat(n,"-icon_loading"))})},e.renderSelector=function(){var t=e.state.dragNodeHighlight,n=e.props,r=n.title,d=n.selected,s=n.icon,l=n.loading,f=n.data,v=e.props.context,g=v.prefixCls,y=v.showIcon,c=v.icon,K=v.loadData,x=v.titleRender,k=e.isDisabled(),N="".concat(g,"-node-content-wrapper"),E;if(y){var b=s||c;E=b?m.exports.createElement("span",{className:U("".concat(g,"-iconEle"),"".concat(g,"-icon__customize"))},typeof b=="function"?b(e.props):b):e.renderIcon()}else K&&l&&(E=e.renderIcon());var D;typeof r=="function"?D=r(f):x?D=x(f):D=r;var C=m.exports.createElement("span",{className:"".concat(g,"-title")},D);return m.exports.createElement("span",{ref:e.setSelectHandle,title:typeof r=="string"?r:"",className:U("".concat(N),"".concat(N,"-").concat(e.getNodeState()||"normal"),!k&&(d||t)&&"".concat(g,"-node-selected")),onMouseEnter:e.onMouseEnter,onMouseLeave:e.onMouseLeave,onContextMenu:e.onContextMenu,onClick:e.onSelectorClick,onDoubleClick:e.onSelectorDoubleClick},E,C,e.renderDropIndicator())},e.renderDropIndicator=function(){var t=e.props,n=t.disabled,r=t.eventKey,d=e.props.context,s=d.draggable,l=d.dropLevelOffset,f=d.dropPosition,v=d.prefixCls,g=d.indent,y=d.dropIndicatorRender,c=d.dragOverNodeKey,K=d.direction,x=s!==!1,k=!n&&x&&c===r;return k?y({dropPosition:f,dropLevelOffset:l,indent:g,prefixCls:v,direction:K}):null},e}return Ye(p,[{key:"componentDidMount",value:function(){this.syncLoadData(this.props)}},{key:"componentDidUpdate",value:function(){this.syncLoadData(this.props)}},{key:"isSelectable",value:function(){var o=this.props.selectable,u=this.props.context.selectable;return typeof o=="boolean"?o:u}},{key:"render",value:function(){var o,u=this.props,h=u.eventKey,t=u.className,n=u.style,r=u.dragOver,d=u.dragOverGapTop,s=u.dragOverGapBottom,l=u.isLeaf,f=u.isStart,v=u.isEnd,g=u.expanded,y=u.selected,c=u.checked,K=u.halfChecked,x=u.loading,k=u.domRef,N=u.active;u.data;var E=u.onMouseMove,b=u.selectable,D=Ke(u,pt),C=this.props.context,S=C.prefixCls,T=C.filterTreeNode,P=C.keyEntities,O=C.dropContainerKey,R=C.dropTargetKey,$=C.draggingNodeKey,A=this.isDisabled(),_=ze(D,{aria:!0,data:!0}),j=P[h]||{},ie=j.level,se=v[v.length-1],F=this.isDraggable(),H=!A&&F,V=$===h,le=b!==void 0?{"aria-selected":!!b}:void 0;return m.exports.createElement("div",G({ref:k,className:U(t,"".concat(S,"-treenode"),(o={},w(o,"".concat(S,"-treenode-disabled"),A),w(o,"".concat(S,"-treenode-switcher-").concat(g?"open":"close"),!l),w(o,"".concat(S,"-treenode-checkbox-checked"),c),w(o,"".concat(S,"-treenode-checkbox-indeterminate"),K),w(o,"".concat(S,"-treenode-selected"),y),w(o,"".concat(S,"-treenode-loading"),x),w(o,"".concat(S,"-treenode-active"),N),w(o,"".concat(S,"-treenode-leaf-last"),se),w(o,"".concat(S,"-treenode-draggable"),H),w(o,"dragging",V),w(o,"drop-target",R===h),w(o,"drop-container",O===h),w(o,"drag-over",!A&&r),w(o,"drag-over-gap-top",!A&&d),w(o,"drag-over-gap-bottom",!A&&s),w(o,"filter-node",T&&T(M(this.props))),o)),style:n,draggable:H,"aria-grabbed":V,onDragStart:H?this.onDragStart:void 0,onDragEnter:F?this.onDragEnter:void 0,onDragOver:F?this.onDragOver:void 0,onDragLeave:F?this.onDragLeave:void 0,onDrop:F?this.onDrop:void 0,onDragEnd:F?this.onDragEnd:void 0,onMouseMove:E},le,_),m.exports.createElement(ft,{prefixCls:S,level:ie,isStart:f,isEnd:v}),this.renderDragHandler(),this.renderSwitcher(),this.renderCheckbox(),this.renderSelector())}}]),p}(m.exports.Component),de=function(i){return m.exports.createElement(Te.Consumer,null,function(p){return m.exports.createElement(ht,G({},i,{context:p}))})};de.displayName="TreeNode";de.defaultProps={title:vt};de.isTreeNode=1;function B(a,i){if(!a)return[];var p=a.slice(),e=p.indexOf(i);return e>=0&&p.splice(e,1),p}function Y(a,i){var p=(a||[]).slice();return p.indexOf(i)===-1&&p.push(i),p}function Oe(a){return a.split("-")}function Ve(a,i){return"".concat(a,"-").concat(i)}function gt(a){return a&&a.type&&a.type.isTreeNode}function yt(a,i){var p=[],e=i[a];function o(){var u=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[];u.forEach(function(h){var t=h.key,n=h.children;p.push(t),o(n)})}return o(e.children),p}function Kt(a){if(a.parent){var i=Oe(a.pos);return Number(i[i.length-1])===a.parent.children.length-1}return!1}function xt(a){var i=Oe(a.pos);return Number(i[i.length-1])===0}function $e(a,i,p,e,o,u,h,t,n,r){var d,s=a.clientX,l=a.clientY,f=a.target.getBoundingClientRect(),v=f.top,g=f.height,y=(r==="rtl"?-1:1)*(((o==null?void 0:o.x)||0)-s),c=(y-12)/e,K=t[p.props.eventKey];if(l<v+g/2){var x=h.findIndex(function($){return $.key===K.key}),k=x<=0?0:x-1,N=h[k].key;K=t[N]}var E=K.key,b=K,D=K.key,C=0,S=0;if(!n.includes(E))for(var T=0;T<c&&Kt(K);T+=1)K=K.parent,S+=1;var P=i.props.data,O=K.node,R=!0;return xt(K)&&K.level===0&&l<v+g/2&&u({dragNode:P,dropNode:O,dropPosition:-1})&&K.key===p.props.eventKey?C=-1:(b.children||[]).length&&n.includes(D)?u({dragNode:P,dropNode:O,dropPosition:0})?C=0:R=!1:S===0?c>-1.5?u({dragNode:P,dropNode:O,dropPosition:1})?C=1:R=!1:u({dragNode:P,dropNode:O,dropPosition:0})?C=0:u({dragNode:P,dropNode:O,dropPosition:1})?C=1:R=!1:u({dragNode:P,dropNode:O,dropPosition:1})?C=1:R=!1,{dropPosition:C,dropLevelOffset:S,dropTargetKey:K.key,dropTargetPos:K.pos,dragOverNodeKey:D,dropContainerKey:C===0?null:((d=K.parent)===null||d===void 0?void 0:d.key)||null,dropAllowed:R}}function Ae(a,i){if(!!a){var p=i.multiple;return p?a.slice():a.length?[a[0]]:a}}function be(a){if(!a)return null;var i;if(Array.isArray(a))i={checkedKeys:a,halfCheckedKeys:void 0};else if(Pe(a)==="object")i={checkedKeys:a.checked||void 0,halfCheckedKeys:a.halfChecked||void 0};else return X(!1,"`checkedKeys` is not an array or an object"),null;return i}function _e(a,i){var p=new Set;function e(o){if(!p.has(o)){var u=i[o];if(!!u){p.add(o);var h=u.parent,t=u.node;t.disabled||h&&e(h.key)}}}return(a||[]).forEach(function(o){e(o)}),ee(p)}var kt=["children"];function pe(a,i){return a!=null?a:i}function ye(a){var i=a||{},p=i.title,e=i._title,o=i.key,u=i.children,h=p||"title";return{title:h,_title:e||[h],key:o||"key",children:u||"children"}}function mt(a){function i(p){var e=at(p);return e.map(function(o){if(!gt(o))return X(!o,"Tree/TreeNode can only accept TreeNode as children."),null;var u=o.key,h=o.props,t=h.children,n=Ke(h,kt),r=I({key:u},n),d=i(t);return d.length&&(r.children=d),r}).filter(function(o){return o})}return i(a)}function De(a,i,p){var e=ye(p),o=e._title,u=e.key,h=e.children,t=new Set(i===!0?[]:i),n=[];function r(d){var s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;return d.map(function(l,f){for(var v=Ve(s?s.pos:"0",f),g=pe(l[u],v),y,c=0;c<o.length;c+=1){var K=o[c];if(l[K]!==void 0){y=l[K];break}}var x=I(I({},ot(l,[].concat(ee(o),[u,h]))),{},{title:y,key:g,parent:s,pos:v,children:null,data:l,isStart:[].concat(ee(s?s.isStart:[]),[f===0]),isEnd:[].concat(ee(s?s.isEnd:[]),[f===d.length-1])});return n.push(x),i===!0||t.has(g)?x.children=r(l[h]||[],x):x.children=[],x})}return r(a),n}function Nt(a,i,p){var e={};Pe(p)==="object"?e=p:e={externalGetKey:p},e=e||{};var o=e,u=o.childrenPropName,h=o.externalGetKey,t=o.fieldNames,n=ye(t),r=n.key,d=n.children,s=u||d,l;h?typeof h=="string"?l=function(g){return g[h]}:typeof h=="function"&&(l=function(g){return h(g)}):l=function(g,y){return pe(g[r],y)};function f(v,g,y,c){var K=v?v[s]:a,x=v?Ve(y.pos,g):"0",k=v?[].concat(ee(c),[v]):[];if(v){var N=l(v,x),E={node:v,index:g,pos:x,key:N,parentPos:y.node?y.pos:null,level:y.level+1,nodes:k};i(E)}K&&K.forEach(function(b,D){f(b,D,{node:v,pos:x,level:y?y.level+1:-1},k)})}f(null)}function Ct(a){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},p=i.initWrapper,e=i.processEntity,o=i.onProcessFinished,u=i.externalGetKey,h=i.childrenPropName,t=i.fieldNames,n=arguments.length>2?arguments[2]:void 0,r=u||n,d={},s={},l={posEntities:d,keyEntities:s};return p&&(l=p(l)||l),Nt(a,function(f){var v=f.node,g=f.index,y=f.pos,c=f.key,K=f.parentPos,x=f.level,k=f.nodes,N={node:v,nodes:k,index:g,key:c,pos:y,level:x},E=pe(c,y);d[y]=N,s[E]=N,N.parent=d[K],N.parent&&(N.parent.children=N.parent.children||[],N.parent.children.push(N)),e&&e(N,l)},{externalGetKey:r,childrenPropName:h,fieldNames:t}),o&&o(l),l}function fe(a,i){var p=i.expandedKeys,e=i.selectedKeys,o=i.loadedKeys,u=i.loadingKeys,h=i.checkedKeys,t=i.halfCheckedKeys,n=i.dragOverNodeKey,r=i.dropPosition,d=i.keyEntities,s=d[a],l={eventKey:a,expanded:p.indexOf(a)!==-1,selected:e.indexOf(a)!==-1,loaded:o.indexOf(a)!==-1,loading:u.indexOf(a)!==-1,checked:h.indexOf(a)!==-1,halfChecked:t.indexOf(a)!==-1,pos:String(s?s.pos:""),dragOver:n===a&&r===0,dragOverGapTop:n===a&&r===-1,dragOverGapBottom:n===a&&r===1};return l}function M(a){var i=a.data,p=a.expanded,e=a.selected,o=a.checked,u=a.loaded,h=a.loading,t=a.halfChecked,n=a.dragOver,r=a.dragOverGapTop,d=a.dragOverGapBottom,s=a.pos,l=a.active,f=a.eventKey,v=I(I({},i),{},{expanded:p,selected:e,checked:o,loaded:u,loading:h,halfChecked:t,dragOver:n,dragOverGapTop:r,dragOverGapBottom:d,pos:s,active:l,key:f});return"props"in v||Object.defineProperty(v,"props",{get:function(){return X(!1,"Second param return from event is node data instead of TreeNode instance. Please read value directly instead of reading from `props`."),a}}),v}var Et=["className","style","motion","motionNodes","motionType","onMotionStart","onMotionEnd","active","treeNodeRequiredProps"],Je=function(i,p){var e=i.className,o=i.style,u=i.motion,h=i.motionNodes,t=i.motionType,n=i.onMotionStart,r=i.onMotionEnd,d=i.active,s=i.treeNodeRequiredProps,l=Ke(i,Et),f=m.exports.useState(!0),v=oe(f,2),g=v[0],y=v[1],c=m.exports.useContext(Te),K=c.prefixCls,x=m.exports.useRef(!1),k=function(){x.current||r(),x.current=!0};return m.exports.useEffect(function(){h&&t==="hide"&&g&&y(!1)},[h]),m.exports.useEffect(function(){return h&&n(),function(){h&&k()}},[]),h?m.exports.createElement(it,G({ref:p,visible:g},u,{motionAppear:t==="show",onAppearEnd:k,onLeaveEnd:k}),function(N,E){var b=N.className,D=N.style;return m.exports.createElement("div",{ref:E,className:U("".concat(K,"-treenode-motion"),b),style:D},h.map(function(C){var S=G({},C.data),T=C.title,P=C.key,O=C.isStart,R=C.isEnd;delete S.children;var $=fe(P,s);return m.exports.createElement(de,G({},S,$,{title:T,active:d,data:C.data,key:P,isStart:O,isEnd:R}))}))}):m.exports.createElement(de,G({domRef:p,className:e,style:o},l,{active:d}))};Je.displayName="MotionTreeNode";var bt=m.exports.forwardRef(Je);function Dt(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[],p=a.length,e=i.length;if(Math.abs(p-e)!==1)return{add:!1,key:null};function o(u,h){var t=new Map;u.forEach(function(r){t.set(r,!0)});var n=h.filter(function(r){return!t.has(r)});return n.length===1?n[0]:null}return p<e?{add:!0,key:o(a,i)}:{add:!1,key:o(i,a)}}function Fe(a,i,p){var e=a.findIndex(function(t){return t.key===p}),o=a[e+1],u=i.findIndex(function(t){return t.key===p});if(o){var h=i.findIndex(function(t){return t.key===o.key});return i.slice(u+1,h)}return i.slice(u+1)}var St=["prefixCls","data","selectable","checkable","expandedKeys","selectedKeys","checkedKeys","loadedKeys","loadingKeys","halfCheckedKeys","keyEntities","disabled","dragging","dragOverNodeKey","dropPosition","motion","height","itemHeight","virtual","focusable","activeItem","focused","tabIndex","onKeyDown","onFocus","onBlur","onActiveChange","onListChangeStart","onListChangeEnd"],He={width:0,height:0,display:"flex",overflow:"hidden",opacity:0,border:0,padding:0,margin:0},Pt=function(){},te="RC_TREE_MOTION_".concat(Math.random()),Se={key:te},Qe={key:te,level:0,index:0,pos:"0",node:Se,nodes:[Se]},Ue={parent:null,children:[],pos:Qe.pos,data:Se,title:null,key:te,isStart:[],isEnd:[]};function Ge(a,i,p,e){return i===!1||!p?a:a.slice(0,Math.ceil(p/e)+1)}function Be(a){var i=a.key,p=a.pos;return pe(i,p)}function Tt(a){for(var i=String(a.data.key),p=a;p.parent;)p=p.parent,i="".concat(p.data.key," > ").concat(i);return i}var Ze=m.exports.forwardRef(function(a,i){var p=a.prefixCls,e=a.data;a.selectable,a.checkable;var o=a.expandedKeys,u=a.selectedKeys,h=a.checkedKeys,t=a.loadedKeys,n=a.loadingKeys,r=a.halfCheckedKeys,d=a.keyEntities,s=a.disabled,l=a.dragging,f=a.dragOverNodeKey,v=a.dropPosition,g=a.motion,y=a.height,c=a.itemHeight,K=a.virtual,x=a.focusable,k=a.activeItem,N=a.focused,E=a.tabIndex,b=a.onKeyDown,D=a.onFocus,C=a.onBlur,S=a.onActiveChange,T=a.onListChangeStart,P=a.onListChangeEnd,O=Ke(a,St),R=m.exports.useRef(null),$=m.exports.useRef(null);m.exports.useImperativeHandle(i,function(){return{scrollTo:function(q){R.current.scrollTo(q)},getIndentWidth:function(){return $.current.offsetWidth}}});var A=m.exports.useState(o),_=oe(A,2),j=_[0],ie=_[1],se=m.exports.useState(e),F=oe(se,2),H=F[0],V=F[1],le=m.exports.useState(e),ve=oe(le,2),xe=ve[0],ne=ve[1],ke=m.exports.useState([]),he=oe(ke,2),me=he[0],W=he[1],tt=m.exports.useState(null),we=oe(tt,2),nt=we[0],Ne=we[1],Le=m.exports.useRef(e);Le.current=e;function Ce(){var L=Le.current;V(L),ne(L),W([]),Ne(null),P()}m.exports.useEffect(function(){ie(o);var L=Dt(j,o);if(L.key!==null)if(L.add){var q=H.findIndex(function(ce){var ue=ce.key;return ue===L.key}),J=Ge(Fe(H,e,L.key),K,y,c),re=H.slice();re.splice(q+1,0,Ue),ne(re),W(J),Ne("show")}else{var Q=e.findIndex(function(ce){var ue=ce.key;return ue===L.key}),Z=Ge(Fe(e,H,L.key),K,y,c),ge=e.slice();ge.splice(Q+1,0,Ue),ne(ge),W(Z),Ne("hide")}else H!==e&&(V(e),ne(e))},[o,e]),m.exports.useEffect(function(){l||Ce()},[l]);var rt=g?xe:e,Me={expandedKeys:o,selectedKeys:u,loadedKeys:t,loadingKeys:n,checkedKeys:h,halfCheckedKeys:r,dragOverNodeKey:f,dropPosition:v,keyEntities:d};return m.exports.createElement(m.exports.Fragment,null,N&&k&&m.exports.createElement("span",{style:He,"aria-live":"assertive"},Tt(k)),m.exports.createElement("div",null,m.exports.createElement("input",{style:He,disabled:x===!1||s,tabIndex:x!==!1?E:null,onKeyDown:b,onFocus:D,onBlur:C,value:"",onChange:Pt,"aria-label":"for screen reader"})),m.exports.createElement("div",{className:"".concat(p,"-treenode"),"aria-hidden":!0,style:{position:"absolute",pointerEvents:"none",visibility:"hidden",height:0,overflow:"hidden"}},m.exports.createElement("div",{className:"".concat(p,"-indent")},m.exports.createElement("div",{ref:$,className:"".concat(p,"-indent-unit")}))),m.exports.createElement(dt,G({},O,{data:rt,itemKey:Be,height:y,fullHeight:!1,virtual:K,itemHeight:c,prefixCls:"".concat(p,"-list"),ref:R,onVisibleChange:function(q,J){var re=new Set(q),Q=J.filter(function(Z){return!re.has(Z)});Q.some(function(Z){return Be(Z)===te})&&Ce()}}),function(L){var q=L.pos,J=G({},L.data),re=L.title,Q=L.key,Z=L.isStart,ge=L.isEnd,ce=pe(Q,q);delete J.key,delete J.children;var ue=fe(ce,Me);return m.exports.createElement(bt,G({},J,ue,{title:re,active:!!k&&Q===k.key,pos:q,data:L.data,isStart:Z,isEnd:ge,motion:g,motionNodes:Q===te?me:null,motionType:nt,onMotionStart:T,onMotionEnd:Ce,treeNodeRequiredProps:Me,onMouseMove:function(){S(null)}}))}))});Ze.displayName="NodeList";function Ot(a){var i=a.dropPosition,p=a.dropLevelOffset,e=a.indent,o={pointerEvents:"none",position:"absolute",right:0,backgroundColor:"red",height:2};switch(i){case-1:o.top=0,o.left=-p*e;break;case 1:o.bottom=0,o.left=-p*e;break;case 0:o.bottom=0,o.left=e;break}return m.exports.createElement("div",{style:o})}var wt=10,et=function(a){je(p,a);var i=We(p);function p(){var e;qe(this,p);for(var o=arguments.length,u=new Array(o),h=0;h<o;h++)u[h]=arguments[h];return e=i.call.apply(i,[this].concat(u)),e.destroyed=!1,e.delayedDragEnterLogic=void 0,e.loadingRetryTimes={},e.state={keyEntities:{},indent:null,selectedKeys:[],checkedKeys:[],halfCheckedKeys:[],loadedKeys:[],loadingKeys:[],expandedKeys:[],draggingNodeKey:null,dragChildrenKeys:[],dropTargetKey:null,dropPosition:null,dropContainerKey:null,dropLevelOffset:null,dropTargetPos:null,dropAllowed:!0,dragOverNodeKey:null,treeData:[],flattenNodes:[],focused:!1,activeKey:null,listChanging:!1,prevProps:null,fieldNames:ye()},e.dragStartMousePosition=null,e.dragNode=void 0,e.currentMouseOverDroppableNodeKey=null,e.listRef=m.exports.createRef(),e.onNodeDragStart=function(t,n){var r=e.state,d=r.expandedKeys,s=r.keyEntities,l=e.props.onDragStart,f=n.props.eventKey;e.dragNode=n,e.dragStartMousePosition={x:t.clientX,y:t.clientY};var v=B(d,f);e.setState({draggingNodeKey:f,dragChildrenKeys:yt(f,s),indent:e.listRef.current.getIndentWidth()}),e.setExpandedKeys(v),window.addEventListener("dragend",e.onWindowDragEnd),l==null||l({event:t,node:M(n.props)})},e.onNodeDragEnter=function(t,n){var r=e.state,d=r.expandedKeys,s=r.keyEntities,l=r.dragChildrenKeys,f=r.flattenNodes,v=r.indent,g=e.props,y=g.onDragEnter,c=g.onExpand,K=g.allowDrop,x=g.direction,k=n.props,N=k.pos,E=k.eventKey,b=z(e),D=b.dragNode;if(e.currentMouseOverDroppableNodeKey!==E&&(e.currentMouseOverDroppableNodeKey=E),!D){e.resetDragState();return}var C=$e(t,D,n,v,e.dragStartMousePosition,K,f,s,d,x),S=C.dropPosition,T=C.dropLevelOffset,P=C.dropTargetKey,O=C.dropContainerKey,R=C.dropTargetPos,$=C.dropAllowed,A=C.dragOverNodeKey;if(l.indexOf(P)!==-1||!$){e.resetDragState();return}if(e.delayedDragEnterLogic||(e.delayedDragEnterLogic={}),Object.keys(e.delayedDragEnterLogic).forEach(function(_){clearTimeout(e.delayedDragEnterLogic[_])}),D.props.eventKey!==n.props.eventKey&&(t.persist(),e.delayedDragEnterLogic[N]=window.setTimeout(function(){if(e.state.draggingNodeKey!==null){var _=ee(d),j=s[n.props.eventKey];j&&(j.children||[]).length&&(_=Y(d,n.props.eventKey)),"expandedKeys"in e.props||e.setExpandedKeys(_),c==null||c(_,{node:M(n.props),expanded:!0,nativeEvent:t.nativeEvent})}},800)),D.props.eventKey===P&&T===0){e.resetDragState();return}e.setState({dragOverNodeKey:A,dropPosition:S,dropLevelOffset:T,dropTargetKey:P,dropContainerKey:O,dropTargetPos:R,dropAllowed:$}),y==null||y({event:t,node:M(n.props),expandedKeys:d})},e.onNodeDragOver=function(t,n){var r=e.state,d=r.dragChildrenKeys,s=r.flattenNodes,l=r.keyEntities,f=r.expandedKeys,v=r.indent,g=e.props,y=g.onDragOver,c=g.allowDrop,K=g.direction,x=z(e),k=x.dragNode;if(!!k){var N=$e(t,k,n,v,e.dragStartMousePosition,c,s,l,f,K),E=N.dropPosition,b=N.dropLevelOffset,D=N.dropTargetKey,C=N.dropContainerKey,S=N.dropAllowed,T=N.dropTargetPos,P=N.dragOverNodeKey;d.indexOf(D)!==-1||!S||(k.props.eventKey===D&&b===0?e.state.dropPosition===null&&e.state.dropLevelOffset===null&&e.state.dropTargetKey===null&&e.state.dropContainerKey===null&&e.state.dropTargetPos===null&&e.state.dropAllowed===!1&&e.state.dragOverNodeKey===null||e.resetDragState():E===e.state.dropPosition&&b===e.state.dropLevelOffset&&D===e.state.dropTargetKey&&C===e.state.dropContainerKey&&T===e.state.dropTargetPos&&S===e.state.dropAllowed&&P===e.state.dragOverNodeKey||e.setState({dropPosition:E,dropLevelOffset:b,dropTargetKey:D,dropContainerKey:C,dropTargetPos:T,dropAllowed:S,dragOverNodeKey:P}),y==null||y({event:t,node:M(n.props)}))}},e.onNodeDragLeave=function(t,n){e.currentMouseOverDroppableNodeKey===n.props.eventKey&&!t.currentTarget.contains(t.relatedTarget)&&(e.resetDragState(),e.currentMouseOverDroppableNodeKey=null);var r=e.props.onDragLeave;r==null||r({event:t,node:M(n.props)})},e.onWindowDragEnd=function(t){e.onNodeDragEnd(t,null,!0),window.removeEventListener("dragend",e.onWindowDragEnd)},e.onNodeDragEnd=function(t,n){var r=e.props.onDragEnd;e.setState({dragOverNodeKey:null}),e.cleanDragState(),r==null||r({event:t,node:M(n.props)}),e.dragNode=null},e.onNodeDrop=function(t,n){var r,d=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,s=e.state,l=s.dragChildrenKeys,f=s.dropPosition,v=s.dropTargetKey,g=s.dropTargetPos,y=s.dropAllowed;if(!!y){var c=e.props.onDrop;if(e.setState({dragOverNodeKey:null}),e.cleanDragState(),v!==null){var K=I(I({},fe(v,e.getTreeNodeRequiredProps())),{},{active:((r=e.getActiveItem())===null||r===void 0?void 0:r.key)===v,data:e.state.keyEntities[v].node}),x=l.indexOf(v)!==-1;X(!x,"Can not drop to dragNode's children node. This is a bug of rc-tree. Please report an issue.");var k=Oe(g),N={event:t,node:M(K),dragNode:e.dragNode?M(e.dragNode.props):null,dragNodesKeys:[e.dragNode.props.eventKey].concat(l),dropToGap:f!==0,dropPosition:f+Number(k[k.length-1])};d||c==null||c(N),e.dragNode=null}}},e.cleanDragState=function(){var t=e.state.draggingNodeKey;t!==null&&e.setState({draggingNodeKey:null,dropPosition:null,dropContainerKey:null,dropTargetKey:null,dropLevelOffset:null,dropAllowed:!0,dragOverNodeKey:null}),e.dragStartMousePosition=null,e.currentMouseOverDroppableNodeKey=null},e.triggerExpandActionExpand=function(t,n){var r=e.state,d=r.expandedKeys,s=r.flattenNodes,l=n.expanded,f=n.key,v=n.isLeaf;if(!(v||t.shiftKey||t.metaKey||t.ctrlKey)){var g=s.filter(function(c){return c.key===f})[0],y=M(I(I({},fe(f,e.getTreeNodeRequiredProps())),{},{data:g.data}));e.setExpandedKeys(l?B(d,f):Y(d,f)),e.onNodeExpand(t,y)}},e.onNodeClick=function(t,n){var r=e.props,d=r.onClick,s=r.expandAction;s==="click"&&e.triggerExpandActionExpand(t,n),d==null||d(t,n)},e.onNodeDoubleClick=function(t,n){var r=e.props,d=r.onDoubleClick,s=r.expandAction;s==="doubleClick"&&e.triggerExpandActionExpand(t,n),d==null||d(t,n)},e.onNodeSelect=function(t,n){var r=e.state.selectedKeys,d=e.state,s=d.keyEntities,l=d.fieldNames,f=e.props,v=f.onSelect,g=f.multiple,y=n.selected,c=n[l.key],K=!y;K?g?r=Y(r,c):r=[c]:r=B(r,c);var x=r.map(function(k){var N=s[k];return N?N.node:null}).filter(function(k){return k});e.setUncontrolledState({selectedKeys:r}),v==null||v(r,{event:"select",selected:K,node:n,selectedNodes:x,nativeEvent:t.nativeEvent})},e.onNodeCheck=function(t,n,r){var d=e.state,s=d.keyEntities,l=d.checkedKeys,f=d.halfCheckedKeys,v=e.props,g=v.checkStrictly,y=v.onCheck,c=n.key,K,x={event:"check",node:n,checked:r,nativeEvent:t.nativeEvent};if(g){var k=r?Y(l,c):B(l,c),N=B(f,c);K={checked:k,halfChecked:N},x.checkedNodes=k.map(function(T){return s[T]}).filter(function(T){return T}).map(function(T){return T.node}),e.setUncontrolledState({checkedKeys:k})}else{var E=Ee([].concat(ee(l),[c]),!0,s),b=E.checkedKeys,D=E.halfCheckedKeys;if(!r){var C=new Set(b);C.delete(c);var S=Ee(Array.from(C),{checked:!1,halfCheckedKeys:D},s);b=S.checkedKeys,D=S.halfCheckedKeys}K=b,x.checkedNodes=[],x.checkedNodesPositions=[],x.halfCheckedKeys=D,b.forEach(function(T){var P=s[T];if(!!P){var O=P.node,R=P.pos;x.checkedNodes.push(O),x.checkedNodesPositions.push({node:O,pos:R})}}),e.setUncontrolledState({checkedKeys:b},!1,{halfCheckedKeys:D})}y==null||y(K,x)},e.onNodeLoad=function(t){var n=t.key,r=new Promise(function(d,s){e.setState(function(l){var f=l.loadedKeys,v=f===void 0?[]:f,g=l.loadingKeys,y=g===void 0?[]:g,c=e.props,K=c.loadData,x=c.onLoad;if(!K||v.indexOf(n)!==-1||y.indexOf(n)!==-1)return null;var k=K(t);return k.then(function(){var N=e.state.loadedKeys,E=Y(N,n);x==null||x(E,{event:"load",node:t}),e.setUncontrolledState({loadedKeys:E}),e.setState(function(b){return{loadingKeys:B(b.loadingKeys,n)}}),d()}).catch(function(N){if(e.setState(function(b){return{loadingKeys:B(b.loadingKeys,n)}}),e.loadingRetryTimes[n]=(e.loadingRetryTimes[n]||0)+1,e.loadingRetryTimes[n]>=wt){var E=e.state.loadedKeys;X(!1,"Retry for `loadData` many times but still failed. No more retry."),e.setUncontrolledState({loadedKeys:Y(E,n)}),d()}s(N)}),{loadingKeys:Y(y,n)}})});return r.catch(function(){}),r},e.onNodeMouseEnter=function(t,n){var r=e.props.onMouseEnter;r==null||r({event:t,node:n})},e.onNodeMouseLeave=function(t,n){var r=e.props.onMouseLeave;r==null||r({event:t,node:n})},e.onNodeContextMenu=function(t,n){var r=e.props.onRightClick;r&&(t.preventDefault(),r({event:t,node:n}))},e.onFocus=function(){var t=e.props.onFocus;e.setState({focused:!0});for(var n=arguments.length,r=new Array(n),d=0;d<n;d++)r[d]=arguments[d];t==null||t.apply(void 0,r)},e.onBlur=function(){var t=e.props.onBlur;e.setState({focused:!1}),e.onActiveChange(null);for(var n=arguments.length,r=new Array(n),d=0;d<n;d++)r[d]=arguments[d];t==null||t.apply(void 0,r)},e.getTreeNodeRequiredProps=function(){var t=e.state,n=t.expandedKeys,r=t.selectedKeys,d=t.loadedKeys,s=t.loadingKeys,l=t.checkedKeys,f=t.halfCheckedKeys,v=t.dragOverNodeKey,g=t.dropPosition,y=t.keyEntities;return{expandedKeys:n||[],selectedKeys:r||[],loadedKeys:d||[],loadingKeys:s||[],checkedKeys:l||[],halfCheckedKeys:f||[],dragOverNodeKey:v,dropPosition:g,keyEntities:y}},e.setExpandedKeys=function(t){var n=e.state,r=n.treeData,d=n.fieldNames,s=De(r,t,d);e.setUncontrolledState({expandedKeys:t,flattenNodes:s},!0)},e.onNodeExpand=function(t,n){var r=e.state.expandedKeys,d=e.state,s=d.listChanging,l=d.fieldNames,f=e.props,v=f.onExpand,g=f.loadData,y=n.expanded,c=n[l.key];if(!s){var K=r.indexOf(c),x=!y;if(X(y&&K!==-1||!y&&K===-1,"Expand state not sync with index check"),x?r=Y(r,c):r=B(r,c),e.setExpandedKeys(r),v==null||v(r,{node:n,expanded:x,nativeEvent:t.nativeEvent}),x&&g){var k=e.onNodeLoad(n);k&&k.then(function(){var N=De(e.state.treeData,r,l);e.setUncontrolledState({flattenNodes:N})}).catch(function(){var N=e.state.expandedKeys,E=B(N,c);e.setExpandedKeys(E)})}}},e.onListChangeStart=function(){e.setUncontrolledState({listChanging:!0})},e.onListChangeEnd=function(){setTimeout(function(){e.setUncontrolledState({listChanging:!1})})},e.onActiveChange=function(t){var n=e.state.activeKey,r=e.props.onActiveChange;n!==t&&(e.setState({activeKey:t}),t!==null&&e.scrollTo({key:t}),r==null||r(t))},e.getActiveItem=function(){var t=e.state,n=t.activeKey,r=t.flattenNodes;return n===null?null:r.find(function(d){var s=d.key;return s===n})||null},e.offsetActiveKey=function(t){var n=e.state,r=n.flattenNodes,d=n.activeKey,s=r.findIndex(function(v){var g=v.key;return g===d});s===-1&&t<0&&(s=r.length),s=(s+t+r.length)%r.length;var l=r[s];if(l){var f=l.key;e.onActiveChange(f)}else e.onActiveChange(null)},e.onKeyDown=function(t){var n=e.state,r=n.activeKey,d=n.expandedKeys,s=n.checkedKeys,l=n.fieldNames,f=e.props,v=f.onKeyDown,g=f.checkable,y=f.selectable;switch(t.which){case ae.UP:{e.offsetActiveKey(-1),t.preventDefault();break}case ae.DOWN:{e.offsetActiveKey(1),t.preventDefault();break}}var c=e.getActiveItem();if(c&&c.data){var K=e.getTreeNodeRequiredProps(),x=c.data.isLeaf===!1||!!(c.data[l.children]||[]).length,k=M(I(I({},fe(r,K)),{},{data:c.data,active:!0}));switch(t.which){case ae.LEFT:{x&&d.includes(r)?e.onNodeExpand({},k):c.parent&&e.onActiveChange(c.parent.key),t.preventDefault();break}case ae.RIGHT:{x&&!d.includes(r)?e.onNodeExpand({},k):c.children&&c.children.length&&e.onActiveChange(c.children[0].key),t.preventDefault();break}case ae.ENTER:case ae.SPACE:{g&&!k.disabled&&k.checkable!==!1&&!k.disableCheckbox?e.onNodeCheck({},k,!s.includes(r)):!g&&y&&!k.disabled&&k.selectable!==!1&&e.onNodeSelect({},k);break}}}v==null||v(t)},e.setUncontrolledState=function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:null;if(!e.destroyed){var d=!1,s=!0,l={};Object.keys(t).forEach(function(f){if(f in e.props){s=!1;return}d=!0,l[f]=t[f]}),d&&(!n||s)&&e.setState(I(I({},l),r))}},e.scrollTo=function(t){e.listRef.current.scrollTo(t)},e}return Ye(p,[{key:"componentDidMount",value:function(){this.destroyed=!1,this.onUpdated()}},{key:"componentDidUpdate",value:function(){this.onUpdated()}},{key:"onUpdated",value:function(){var o=this.props.activeKey;o!==void 0&&o!==this.state.activeKey&&(this.setState({activeKey:o}),o!==null&&this.scrollTo({key:o}))}},{key:"componentWillUnmount",value:function(){window.removeEventListener("dragend",this.onWindowDragEnd),this.destroyed=!0}},{key:"resetDragState",value:function(){this.setState({dragOverNodeKey:null,dropPosition:null,dropLevelOffset:null,dropTargetKey:null,dropContainerKey:null,dropTargetPos:null,dropAllowed:!1})}},{key:"render",value:function(){var o,u=this.state,h=u.focused,t=u.flattenNodes,n=u.keyEntities,r=u.draggingNodeKey,d=u.activeKey,s=u.dropLevelOffset,l=u.dropContainerKey,f=u.dropTargetKey,v=u.dropPosition,g=u.dragOverNodeKey,y=u.indent,c=this.props,K=c.prefixCls,x=c.className,k=c.style,N=c.showLine,E=c.focusable,b=c.tabIndex,D=b===void 0?0:b,C=c.selectable,S=c.showIcon,T=c.icon,P=c.switcherIcon,O=c.draggable,R=c.checkable,$=c.checkStrictly,A=c.disabled,_=c.motion,j=c.loadData,ie=c.filterTreeNode,se=c.height,F=c.itemHeight,H=c.virtual,V=c.titleRender,le=c.dropIndicatorRender,ve=c.onContextMenu,xe=c.onScroll,ne=c.direction,ke=c.rootClassName,he=c.rootStyle,me=ze(this.props,{aria:!0,data:!0}),W;return O&&(Pe(O)==="object"?W=O:typeof O=="function"?W={nodeDraggable:O}:W={}),m.exports.createElement(Te.Provider,{value:{prefixCls:K,selectable:C,showIcon:S,icon:T,switcherIcon:P,draggable:W,draggingNodeKey:r,checkable:R,checkStrictly:$,disabled:A,keyEntities:n,dropLevelOffset:s,dropContainerKey:l,dropTargetKey:f,dropPosition:v,dragOverNodeKey:g,indent:y,direction:ne,dropIndicatorRender:le,loadData:j,filterTreeNode:ie,titleRender:V,onNodeClick:this.onNodeClick,onNodeDoubleClick:this.onNodeDoubleClick,onNodeExpand:this.onNodeExpand,onNodeSelect:this.onNodeSelect,onNodeCheck:this.onNodeCheck,onNodeLoad:this.onNodeLoad,onNodeMouseEnter:this.onNodeMouseEnter,onNodeMouseLeave:this.onNodeMouseLeave,onNodeContextMenu:this.onNodeContextMenu,onNodeDragStart:this.onNodeDragStart,onNodeDragEnter:this.onNodeDragEnter,onNodeDragOver:this.onNodeDragOver,onNodeDragLeave:this.onNodeDragLeave,onNodeDragEnd:this.onNodeDragEnd,onNodeDrop:this.onNodeDrop}},m.exports.createElement("div",{role:"tree",className:U(K,x,ke,(o={},w(o,"".concat(K,"-show-line"),N),w(o,"".concat(K,"-focused"),h),w(o,"".concat(K,"-active-focused"),d!==null),o)),style:he},m.exports.createElement(Ze,G({ref:this.listRef,prefixCls:K,style:k,data:t,disabled:A,selectable:C,checkable:!!R,motion:_,dragging:r!==null,height:se,itemHeight:F,virtual:H,focusable:E,focused:h,tabIndex:D,activeItem:this.getActiveItem(),onFocus:this.onFocus,onBlur:this.onBlur,onKeyDown:this.onKeyDown,onActiveChange:this.onActiveChange,onListChangeStart:this.onListChangeStart,onListChangeEnd:this.onListChangeEnd,onContextMenu:ve,onScroll:xe},this.getTreeNodeRequiredProps(),me))))}}],[{key:"getDerivedStateFromProps",value:function(o,u){var h=u.prevProps,t={prevProps:o};function n(E){return!h&&E in o||h&&h[E]!==o[E]}var r,d=u.fieldNames;if(n("fieldNames")&&(d=ye(o.fieldNames),t.fieldNames=d),n("treeData")?r=o.treeData:n("children")&&(X(!1,"`children` of Tree is deprecated. Please use `treeData` instead."),r=mt(o.children)),r){t.treeData=r;var s=Ct(r,{fieldNames:d});t.keyEntities=I(w({},te,Qe),s.keyEntities)}var l=t.keyEntities||u.keyEntities;if(n("expandedKeys")||h&&n("autoExpandParent"))t.expandedKeys=o.autoExpandParent||!h&&o.defaultExpandParent?_e(o.expandedKeys,l):o.expandedKeys;else if(!h&&o.defaultExpandAll){var f=I({},l);delete f[te],t.expandedKeys=Object.keys(f).map(function(E){return f[E].key})}else!h&&o.defaultExpandedKeys&&(t.expandedKeys=o.autoExpandParent||o.defaultExpandParent?_e(o.defaultExpandedKeys,l):o.defaultExpandedKeys);if(t.expandedKeys||delete t.expandedKeys,r||t.expandedKeys){var v=De(r||u.treeData,t.expandedKeys||u.expandedKeys,d);t.flattenNodes=v}if(o.selectable&&(n("selectedKeys")?t.selectedKeys=Ae(o.selectedKeys,o):!h&&o.defaultSelectedKeys&&(t.selectedKeys=Ae(o.defaultSelectedKeys,o))),o.checkable){var g;if(n("checkedKeys")?g=be(o.checkedKeys)||{}:!h&&o.defaultCheckedKeys?g=be(o.defaultCheckedKeys)||{}:r&&(g=be(o.checkedKeys)||{checkedKeys:u.checkedKeys,halfCheckedKeys:u.halfCheckedKeys}),g){var y=g,c=y.checkedKeys,K=c===void 0?[]:c,x=y.halfCheckedKeys,k=x===void 0?[]:x;if(!o.checkStrictly){var N=Ee(K,!0,l);K=N.checkedKeys,k=N.halfCheckedKeys}t.checkedKeys=K,t.halfCheckedKeys=k}}return n("loadedKeys")&&(t.loadedKeys=o.loadedKeys),t}}]),p}(m.exports.Component);et.defaultProps={prefixCls:"rc-tree",showLine:!1,showIcon:!0,selectable:!0,multiple:!1,checkable:!1,disabled:!1,checkStrictly:!1,draggable:!1,defaultExpandParent:!0,autoExpandParent:!1,defaultExpandAll:!1,defaultExpandedKeys:[],defaultCheckedKeys:[],defaultSelectedKeys:[],dropIndicatorRender:Ot,allowDrop:function(){return!0},expandAction:!1};et.TreeNode=de;export{de as C,et as T,mt as a,_e as b,Ct as c,Ee as d,B as e,Y as f};
