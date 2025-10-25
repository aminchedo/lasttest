var Ar=Object.defineProperty;var Dr=(t,s,a)=>s in t?Ar(t,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[s]=a;var tt=(t,s,a)=>Dr(t,typeof s!="symbol"?s+"":s,a);import{r as c,a as Rr,R as Vs}from"./react-vendor-DJ1oPbzn.js";import{A as Be,m as z}from"./animation-vendor-BCJVGiua.js";import{R as ys,L as Aa,C as js,X as bs,Y as cs,T as vs,a as Bs,b as Hs,A as Bt,c as zs,B as Lr,d as it,e as $r}from"./chart-vendor-BfRdR6BN.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(n){if(n.ep)return;n.ep=!0;const l=a(n);fetch(n.href,l)}})();var Da={exports:{}},xt={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fr=c,Pr=Symbol.for("react.element"),Ur=Symbol.for("react.fragment"),Or=Object.prototype.hasOwnProperty,Ir=Fr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Hr={key:!0,ref:!0,__self:!0,__source:!0};function Ra(t,s,a){var r,n={},l=null,i=null;a!==void 0&&(l=""+a),s.key!==void 0&&(l=""+s.key),s.ref!==void 0&&(i=s.ref);for(r in s)Or.call(s,r)&&!Hr.hasOwnProperty(r)&&(n[r]=s[r]);if(t&&t.defaultProps)for(r in s=t.defaultProps,s)n[r]===void 0&&(n[r]=s[r]);return{$$typeof:Pr,type:t,key:l,ref:i,props:n,_owner:Ir.current}}xt.Fragment=Ur;xt.jsx=Ra;xt.jsxs=Ra;Da.exports=xt;var e=Da.exports,Mt={},ea=Rr;Mt.createRoot=ea.createRoot,Mt.hydrateRoot=ea.hydrateRoot;let Br={data:""},_r=t=>{if(typeof window=="object"){let s=(t?t.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return s.nonce=window.__nonce__,s.parentNode||(t||document.head).appendChild(s),s.firstChild}return t||Br},qr=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Jr=/\/\*[^]*?\*\/|  +/g,sa=/\n+/g,ls=(t,s)=>{let a="",r="",n="";for(let l in t){let i=t[l];l[0]=="@"?l[1]=="i"?a=l+" "+i+";":r+=l[1]=="f"?ls(i,l):l+"{"+ls(i,l[1]=="k"?"":s)+"}":typeof i=="object"?r+=ls(i,s?s.replace(/([^,])+/g,p=>l.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,o=>/&/.test(o)?o.replace(/&/g,p):p?p+" "+o:o)):l):i!=null&&(l=/^--/.test(l)?l:l.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=ls.p?ls.p(l,i):l+":"+i+";")}return a+(s&&n?s+"{"+n+"}":n)+r},as={},La=t=>{if(typeof t=="object"){let s="";for(let a in t)s+=a+La(t[a]);return s}return t},Vr=(t,s,a,r,n)=>{let l=La(t),i=as[l]||(as[l]=(o=>{let u=0,d=11;for(;u<o.length;)d=101*d+o.charCodeAt(u++)>>>0;return"go"+d})(l));if(!as[i]){let o=l!==t?t:(u=>{let d,x,h=[{}];for(;d=qr.exec(u.replace(Jr,""));)d[4]?h.shift():d[3]?(x=d[3].replace(sa," ").trim(),h.unshift(h[0][x]=h[0][x]||{})):h[0][d[1]]=d[2].replace(sa," ").trim();return h[0]})(t);as[i]=ls(n?{["@keyframes "+i]:o}:o,a?"":"."+i)}let p=a&&as.g?as.g:null;return a&&(as.g=as[i]),((o,u,d,x)=>{x?u.data=u.data.replace(x,o):u.data.indexOf(o)===-1&&(u.data=d?o+u.data:u.data+o)})(as[i],s,r,p),i},Wr=(t,s,a)=>t.reduce((r,n,l)=>{let i=s[l];if(i&&i.call){let p=i(a),o=p&&p.props&&p.props.className||/^go/.test(p)&&p;i=o?"."+o:p&&typeof p=="object"?p.props?"":ls(p,""):p===!1?"":p}return r+n+(i??"")},"");function gt(t){let s=this||{},a=t.call?t(s.p):t;return Vr(a.unshift?a.raw?Wr(a,[].slice.call(arguments,1),s.p):a.reduce((r,n)=>Object.assign(r,n&&n.call?n(s.p):n),{}):a,_r(s.target),s.g,s.o,s.k)}let $a,At,Dt;gt.bind({g:1});let ns=gt.bind({k:1});function Gr(t,s,a,r){ls.p=s,$a=t,At=a,Dt=r}function ms(t,s){let a=this||{};return function(){let r=arguments;function n(l,i){let p=Object.assign({},l),o=p.className||n.className;a.p=Object.assign({theme:At&&At()},p),a.o=/ *go\d+/.test(o),p.className=gt.apply(a,r)+(o?" "+o:"");let u=t;return t[0]&&(u=p.as||t,delete p.as),Dt&&u[0]&&Dt(p),$a(u,p)}return n}}var Kr=t=>typeof t=="function",ut=(t,s)=>Kr(t)?t(s):t,Xr=(()=>{let t=0;return()=>(++t).toString()})(),Fa=(()=>{let t;return()=>{if(t===void 0&&typeof window<"u"){let s=matchMedia("(prefers-reduced-motion: reduce)");t=!s||s.matches}return t}})(),Zr=20,_t="default",Pa=(t,s)=>{let{toastLimit:a}=t.settings;switch(s.type){case 0:return{...t,toasts:[s.toast,...t.toasts].slice(0,a)};case 1:return{...t,toasts:t.toasts.map(i=>i.id===s.toast.id?{...i,...s.toast}:i)};case 2:let{toast:r}=s;return Pa(t,{type:t.toasts.find(i=>i.id===r.id)?1:0,toast:r});case 3:let{toastId:n}=s;return{...t,toasts:t.toasts.map(i=>i.id===n||n===void 0?{...i,dismissed:!0,visible:!1}:i)};case 4:return s.toastId===void 0?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(i=>i.id!==s.toastId)};case 5:return{...t,pausedAt:s.time};case 6:let l=s.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(i=>({...i,pauseDuration:i.pauseDuration+l}))}}},ot=[],Ua={toasts:[],pausedAt:void 0,settings:{toastLimit:Zr}},ss={},Oa=(t,s=_t)=>{ss[s]=Pa(ss[s]||Ua,t),ot.forEach(([a,r])=>{a===s&&r(ss[s])})},Ia=t=>Object.keys(ss).forEach(s=>Oa(t,s)),Yr=t=>Object.keys(ss).find(s=>ss[s].toasts.some(a=>a.id===t)),ft=(t=_t)=>s=>{Oa(s,t)},Qr={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},en=(t={},s=_t)=>{let[a,r]=c.useState(ss[s]||Ua),n=c.useRef(ss[s]);c.useEffect(()=>(n.current!==ss[s]&&r(ss[s]),ot.push([s,r]),()=>{let i=ot.findIndex(([p])=>p===s);i>-1&&ot.splice(i,1)}),[s]);let l=a.toasts.map(i=>{var p,o,u;return{...t,...t[i.type],...i,removeDelay:i.removeDelay||((p=t[i.type])==null?void 0:p.removeDelay)||(t==null?void 0:t.removeDelay),duration:i.duration||((o=t[i.type])==null?void 0:o.duration)||(t==null?void 0:t.duration)||Qr[i.type],style:{...t.style,...(u=t[i.type])==null?void 0:u.style,...i.style}}});return{...a,toasts:l}},sn=(t,s="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:s,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...a,id:(a==null?void 0:a.id)||Xr()}),Ws=t=>(s,a)=>{let r=sn(s,t,a);return ft(r.toasterId||Yr(r.id))({type:2,toast:r}),r.id},T=(t,s)=>Ws("blank")(t,s);T.error=Ws("error");T.success=Ws("success");T.loading=Ws("loading");T.custom=Ws("custom");T.dismiss=(t,s)=>{let a={type:3,toastId:t};s?ft(s)(a):Ia(a)};T.dismissAll=t=>T.dismiss(void 0,t);T.remove=(t,s)=>{let a={type:4,toastId:t};s?ft(s)(a):Ia(a)};T.removeAll=t=>T.remove(void 0,t);T.promise=(t,s,a)=>{let r=T.loading(s.loading,{...a,...a==null?void 0:a.loading});return typeof t=="function"&&(t=t()),t.then(n=>{let l=s.success?ut(s.success,n):void 0;return l?T.success(l,{id:r,...a,...a==null?void 0:a.success}):T.dismiss(r),n}).catch(n=>{let l=s.error?ut(s.error,n):void 0;l?T.error(l,{id:r,...a,...a==null?void 0:a.error}):T.dismiss(r)}),t};var tn=1e3,an=(t,s="default")=>{let{toasts:a,pausedAt:r}=en(t,s),n=c.useRef(new Map).current,l=c.useCallback((x,h=tn)=>{if(n.has(x))return;let j=setTimeout(()=>{n.delete(x),i({type:4,toastId:x})},h);n.set(x,j)},[]);c.useEffect(()=>{if(r)return;let x=Date.now(),h=a.map(j=>{if(j.duration===1/0)return;let m=(j.duration||0)+j.pauseDuration-(x-j.createdAt);if(m<0){j.visible&&T.dismiss(j.id);return}return setTimeout(()=>T.dismiss(j.id,s),m)});return()=>{h.forEach(j=>j&&clearTimeout(j))}},[a,r,s]);let i=c.useCallback(ft(s),[s]),p=c.useCallback(()=>{i({type:5,time:Date.now()})},[i]),o=c.useCallback((x,h)=>{i({type:1,toast:{id:x,height:h}})},[i]),u=c.useCallback(()=>{r&&i({type:6,time:Date.now()})},[r,i]),d=c.useCallback((x,h)=>{let{reverseOrder:j=!1,gutter:m=8,defaultPosition:N}=h||{},f=a.filter($=>($.position||N)===(x.position||N)&&$.height),M=f.findIndex($=>$.id===x.id),J=f.filter(($,Z)=>Z<M&&$.visible).length;return f.filter($=>$.visible).slice(...j?[J+1]:[0,J]).reduce(($,Z)=>$+(Z.height||0)+m,0)},[a]);return c.useEffect(()=>{a.forEach(x=>{if(x.dismissed)l(x.id,x.removeDelay);else{let h=n.get(x.id);h&&(clearTimeout(h),n.delete(x.id))}})},[a,l]),{toasts:a,handlers:{updateHeight:o,startPause:p,endPause:u,calculateOffset:d}}},rn=ns`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,nn=ns`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,on=ns`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,ln=ms("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${rn} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${nn} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${on} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,cn=ns`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,dn=ms("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${cn} 1s linear infinite;
`,hn=ns`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,un=ns`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,mn=ms("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${hn} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${un} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,pn=ms("div")`
  position: absolute;
`,xn=ms("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,gn=ns`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,fn=ms("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${gn} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,yn=({toast:t})=>{let{icon:s,type:a,iconTheme:r}=t;return s!==void 0?typeof s=="string"?c.createElement(fn,null,s):s:a==="blank"?null:c.createElement(xn,null,c.createElement(dn,{...r}),a!=="loading"&&c.createElement(pn,null,a==="error"?c.createElement(ln,{...r}):c.createElement(mn,{...r})))},jn=t=>`
0% {transform: translate3d(0,${t*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,bn=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${t*-150}%,-1px) scale(.6); opacity:0;}
`,vn="0%{opacity:0;} 100%{opacity:1;}",wn="0%{opacity:1;} 100%{opacity:0;}",Nn=ms("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,kn=ms("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Sn=(t,s)=>{let a=t.includes("top")?1:-1,[r,n]=Fa()?[vn,wn]:[jn(a),bn(a)];return{animation:s?`${ns(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${ns(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Cn=c.memo(({toast:t,position:s,style:a,children:r})=>{let n=t.height?Sn(t.position||s||"top-center",t.visible):{opacity:0},l=c.createElement(yn,{toast:t}),i=c.createElement(kn,{...t.ariaProps},ut(t.message,t));return c.createElement(Nn,{className:t.className,style:{...n,...a,...t.style}},typeof r=="function"?r({icon:l,message:i}):c.createElement(c.Fragment,null,l,i))});Gr(c.createElement);var En=({id:t,className:s,style:a,onHeightUpdate:r,children:n})=>{let l=c.useCallback(i=>{if(i){let p=()=>{let o=i.getBoundingClientRect().height;r(t,o)};p(),new MutationObserver(p).observe(i,{subtree:!0,childList:!0,characterData:!0})}},[t,r]);return c.createElement("div",{ref:l,className:s,style:a},n)},zn=(t,s)=>{let a=t.includes("top"),r=a?{top:0}:{bottom:0},n=t.includes("center")?{justifyContent:"center"}:t.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:Fa()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${s*(a?1:-1)}px)`,...r,...n}},Tn=gt`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,at=16,Mn=({reverseOrder:t,position:s="top-center",toastOptions:a,gutter:r,children:n,toasterId:l,containerStyle:i,containerClassName:p})=>{let{toasts:o,handlers:u}=an(a,l);return c.createElement("div",{"data-rht-toaster":l||"",style:{position:"fixed",zIndex:9999,top:at,left:at,right:at,bottom:at,pointerEvents:"none",...i},className:p,onMouseEnter:u.startPause,onMouseLeave:u.endPause},o.map(d=>{let x=d.position||s,h=u.calculateOffset(d,{reverseOrder:t,gutter:r,defaultPosition:s}),j=zn(x,h);return c.createElement(En,{id:d.id,key:d.id,onHeightUpdate:u.updateHeight,className:d.visible?Tn:"",style:j},d.type==="custom"?ut(d.message,d):n?n(d):c.createElement(Cn,{toast:d,position:x}))}))},Cs=T;/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var An={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dn=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),B=(t,s)=>{const a=c.forwardRef(({color:r="currentColor",size:n=24,strokeWidth:l=2,absoluteStrokeWidth:i,className:p="",children:o,...u},d)=>c.createElement("svg",{ref:d,...An,width:n,height:n,stroke:r,strokeWidth:i?Number(l)*24/Number(n):l,className:["lucide",`lucide-${Dn(t)}`,p].join(" "),...u},[...s.map(([x,h])=>c.createElement(x,h)),...Array.isArray(o)?o:[o]]));return a.displayName=`${t}`,a};/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=B("Activity",[["path",{d:"M22 12h-4l-3 9L9 3l-3 9H2",key:"d5dnw9"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=B("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _s=B("AlertTriangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"c3ski4"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rn=B("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ln=B("Award",[["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}],["path",{d:"M15.477 12.89 17 22l-5-3-5 3 1.523-9.11",key:"em7aur"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qs=B("BarChart3",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ta=B("BarChart",[["line",{x1:"12",x2:"12",y1:"20",y2:"10",key:"1vz5eb"}],["line",{x1:"18",x2:"18",y1:"20",y2:"4",key:"cun8e5"}],["line",{x1:"6",x2:"6",y1:"20",y2:"16",key:"hq0ia6"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=B("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ne=B("Brain",[["path",{d:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z",key:"1mhkh5"}],["path",{d:"M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z",key:"1d6s00"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qt=B("Calendar",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",ry:"2",key:"eu3xkr"}],["line",{x1:"16",x2:"16",y1:"2",y2:"6",key:"m3sa8f"}],["line",{x1:"8",x2:"8",y1:"2",y2:"6",key:"18kwsl"}],["line",{x1:"3",x2:"21",y1:"10",y2:"10",key:"xt86sb"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ke=B("CheckCircle",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=B("ChefHat",[["path",{d:"M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z",key:"z3ra2g"}],["line",{x1:"6",x2:"18",y1:"17",y2:"17",key:"12q60k"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $n=B("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gs=B("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ks=B("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fn=B("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=B("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jt=B("Cpu",[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"9",y:"9",width:"6",height:"6",key:"o3kz5p"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aa=B("Crown",[["path",{d:"m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14",key:"zkxr6b"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=B("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=B("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pn=B("Droplet",[["path",{d:"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",key:"c7niix"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Un=B("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ss=B("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const es=B("FileText",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"16",x2:"8",y1:"13",y2:"13",key:"14keom"}],["line",{x1:"16",x2:"8",y1:"17",y2:"17",key:"17nazh"}],["line",{x1:"10",x2:"8",y1:"9",y2:"9",key:"1a5vjj"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ha=B("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kt=B("Flame",[["path",{d:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",key:"96xj49"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ds=B("FolderOpen",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const On=B("FolderSearch",[["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["path",{d:"M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1",key:"1bw5m7"}],["path",{d:"m21 21-1.5-1.5",key:"3sg1j"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hs=B("HardDrive",[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const In=B("Hash",[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hn=B("HelpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bn=B("Home",[["path",{d:"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"y5dka4"}],["polyline",{points:"9 22 9 12 15 12 15 22",key:"e2us08"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _n=B("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qn=B("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ra=B("Key",[["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["path",{d:"m15.5 7.5 3 3L22 7l-3-3",key:"1rn1fs"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jn=B("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const na=B("LineChart",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"m19 9-5 5-4-4-3 3",key:"2osh9i"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xs=B("Loader",[["line",{x1:"12",x2:"12",y1:"2",y2:"6",key:"gza1u7"}],["line",{x1:"12",x2:"12",y1:"18",y2:"22",key:"1qhbu9"}],["line",{x1:"4.93",x2:"7.76",y1:"4.93",y2:"7.76",key:"xae44r"}],["line",{x1:"16.24",x2:"19.07",y1:"16.24",y2:"19.07",key:"bxnmvf"}],["line",{x1:"2",x2:"6",y1:"12",y2:"12",key:"89khin"}],["line",{x1:"18",x2:"22",y1:"12",y2:"12",key:"pb8tfm"}],["line",{x1:"4.93",x2:"7.76",y1:"19.07",y2:"16.24",key:"1uxjnu"}],["line",{x1:"16.24",x2:"19.07",y1:"7.76",y2:"4.93",key:"6duxfx"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vn=B("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wn=B("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gn=B("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ia=B("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ke=B("Package",[["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Js=B("Pause",[["rect",{width:"4",height:"16",x:"6",y:"4",key:"iffhe4"}],["rect",{width:"4",height:"16",x:"14",y:"4",key:"sjin7j"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kn=B("PenSquare",[["path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1qinfi"}],["path",{d:"M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z",key:"w2jsv5"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xn=B("PieChart",[["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}],["path",{d:"M22 12A10 10 0 0 0 12 2v10z",key:"1rfc4y"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lt=B("PlayCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polygon",{points:"10 8 16 12 10 16 10 8",key:"1cimsy"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ts=B("Play",[["polygon",{points:"5 3 19 12 5 21 5 3",key:"191637"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oa=B("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fe=B("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ba=B("Rocket",[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _a=B("Save",[["path",{d:"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z",key:"1owoqh"}],["polyline",{points:"17 21 17 13 7 13 7 21",key:"1md35c"}],["polyline",{points:"7 3 7 8 15 8",key:"8nz8an"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=B("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const la=B("Server",[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ds=B("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zn=B("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $t=B("Shield",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yn=B("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=B("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ks=B("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qn=B("StopCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["rect",{width:"6",height:"6",x:"9",y:"9",key:"1wrtvo"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ei=B("Tablet",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["line",{x1:"12",x2:"12.01",y1:"18",y2:"18",key:"1dp563"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xs=B("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const si=B("ThermometerSun",[["path",{d:"M12 9a4 4 0 0 0-2 7.5",key:"1jvsq6"}],["path",{d:"M12 3v2",key:"1w22ol"}],["path",{d:"m6.6 18.4-1.4 1.4",key:"w2yidj"}],["path",{d:"M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",key:"iof6y5"}],["path",{d:"M4 13H2",key:"118le4"}],["path",{d:"M6.34 7.34 4.93 5.93",key:"1brd51"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ti=B("Timer",[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zs=B("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const os=B("TrendingDown",[["polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7",key:"1r2t7k"}],["polyline",{points:"16 17 22 17 22 11",key:"11uiuu"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ie=B("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ms=B("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ai=B("UserCheck",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["polyline",{points:"16 11 18 13 22 9",key:"1pwet4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ri=B("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ni=B("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ps=B("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gs=B("Volume2",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["path",{d:"M15.54 8.46a5 5 0 0 1 0 7.07",key:"ltjumu"}],["path",{d:"M19.07 4.93a10 10 0 0 1 0 14.14",key:"1kegas"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qa=B("Wifi",[["path",{d:"M5 13a10 10 0 0 1 14 0",key:"6v8j51"}],["path",{d:"M8.5 16.5a5 5 0 0 1 7 0",key:"sej527"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["line",{x1:"12",x2:"12.01",y1:"20",y2:"20",key:"of4bc4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ii=B("Wind",[["path",{d:"M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2",key:"1k4u03"}],["path",{d:"M9.6 4.6A2 2 0 1 1 11 8H2",key:"b7d0fd"}],["path",{d:"M12.6 19.4A2 2 0 1 0 14 16H2",key:"1p5cb3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const us=B("XCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ja=B("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rs=B("Zap",[["polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2",key:"45s27k"}]]);function Va(t,s){return function(){return t.apply(s,arguments)}}const{toString:oi}=Object.prototype,{getPrototypeOf:Vt}=Object,{iterator:yt,toStringTag:Wa}=Symbol,jt=(t=>s=>{const a=oi.call(s);return t[a]||(t[a]=a.slice(8,-1).toLowerCase())})(Object.create(null)),Ze=t=>(t=t.toLowerCase(),s=>jt(s)===t),bt=t=>s=>typeof s===t,{isArray:Rs}=Array,As=bt("undefined");function Ys(t){return t!==null&&!As(t)&&t.constructor!==null&&!As(t.constructor)&&Ue(t.constructor.isBuffer)&&t.constructor.isBuffer(t)}const Ga=Ze("ArrayBuffer");function li(t){let s;return typeof ArrayBuffer<"u"&&ArrayBuffer.isView?s=ArrayBuffer.isView(t):s=t&&t.buffer&&Ga(t.buffer),s}const ci=bt("string"),Ue=bt("function"),Ka=bt("number"),Qs=t=>t!==null&&typeof t=="object",di=t=>t===!0||t===!1,ct=t=>{if(jt(t)!=="object")return!1;const s=Vt(t);return(s===null||s===Object.prototype||Object.getPrototypeOf(s)===null)&&!(Wa in t)&&!(yt in t)},hi=t=>{if(!Qs(t)||Ys(t))return!1;try{return Object.keys(t).length===0&&Object.getPrototypeOf(t)===Object.prototype}catch{return!1}},ui=Ze("Date"),mi=Ze("File"),pi=Ze("Blob"),xi=Ze("FileList"),gi=t=>Qs(t)&&Ue(t.pipe),fi=t=>{let s;return t&&(typeof FormData=="function"&&t instanceof FormData||Ue(t.append)&&((s=jt(t))==="formdata"||s==="object"&&Ue(t.toString)&&t.toString()==="[object FormData]"))},yi=Ze("URLSearchParams"),[ji,bi,vi,wi]=["ReadableStream","Request","Response","Headers"].map(Ze),Ni=t=>t.trim?t.trim():t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");function et(t,s,{allOwnKeys:a=!1}={}){if(t===null||typeof t>"u")return;let r,n;if(typeof t!="object"&&(t=[t]),Rs(t))for(r=0,n=t.length;r<n;r++)s.call(null,t[r],r,t);else{if(Ys(t))return;const l=a?Object.getOwnPropertyNames(t):Object.keys(t),i=l.length;let p;for(r=0;r<i;r++)p=l[r],s.call(null,t[p],p,t)}}function Xa(t,s){if(Ys(t))return null;s=s.toLowerCase();const a=Object.keys(t);let r=a.length,n;for(;r-- >0;)if(n=a[r],s===n.toLowerCase())return n;return null}const fs=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:global,Za=t=>!As(t)&&t!==fs;function Ft(){const{caseless:t,skipUndefined:s}=Za(this)&&this||{},a={},r=(n,l)=>{const i=t&&Xa(a,l)||l;ct(a[i])&&ct(n)?a[i]=Ft(a[i],n):ct(n)?a[i]=Ft({},n):Rs(n)?a[i]=n.slice():(!s||!As(n))&&(a[i]=n)};for(let n=0,l=arguments.length;n<l;n++)arguments[n]&&et(arguments[n],r);return a}const ki=(t,s,a,{allOwnKeys:r}={})=>(et(s,(n,l)=>{a&&Ue(n)?t[l]=Va(n,a):t[l]=n},{allOwnKeys:r}),t),Si=t=>(t.charCodeAt(0)===65279&&(t=t.slice(1)),t),Ci=(t,s,a,r)=>{t.prototype=Object.create(s.prototype,r),t.prototype.constructor=t,Object.defineProperty(t,"super",{value:s.prototype}),a&&Object.assign(t.prototype,a)},Ei=(t,s,a,r)=>{let n,l,i;const p={};if(s=s||{},t==null)return s;do{for(n=Object.getOwnPropertyNames(t),l=n.length;l-- >0;)i=n[l],(!r||r(i,t,s))&&!p[i]&&(s[i]=t[i],p[i]=!0);t=a!==!1&&Vt(t)}while(t&&(!a||a(t,s))&&t!==Object.prototype);return s},zi=(t,s,a)=>{t=String(t),(a===void 0||a>t.length)&&(a=t.length),a-=s.length;const r=t.indexOf(s,a);return r!==-1&&r===a},Ti=t=>{if(!t)return null;if(Rs(t))return t;let s=t.length;if(!Ka(s))return null;const a=new Array(s);for(;s-- >0;)a[s]=t[s];return a},Mi=(t=>s=>t&&s instanceof t)(typeof Uint8Array<"u"&&Vt(Uint8Array)),Ai=(t,s)=>{const r=(t&&t[yt]).call(t);let n;for(;(n=r.next())&&!n.done;){const l=n.value;s.call(t,l[0],l[1])}},Di=(t,s)=>{let a;const r=[];for(;(a=t.exec(s))!==null;)r.push(a);return r},Ri=Ze("HTMLFormElement"),Li=t=>t.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(a,r,n){return r.toUpperCase()+n}),ca=(({hasOwnProperty:t})=>(s,a)=>t.call(s,a))(Object.prototype),$i=Ze("RegExp"),Ya=(t,s)=>{const a=Object.getOwnPropertyDescriptors(t),r={};et(a,(n,l)=>{let i;(i=s(n,l,t))!==!1&&(r[l]=i||n)}),Object.defineProperties(t,r)},Fi=t=>{Ya(t,(s,a)=>{if(Ue(t)&&["arguments","caller","callee"].indexOf(a)!==-1)return!1;const r=t[a];if(Ue(r)){if(s.enumerable=!1,"writable"in s){s.writable=!1;return}s.set||(s.set=()=>{throw Error("Can not rewrite read-only method '"+a+"'")})}})},Pi=(t,s)=>{const a={},r=n=>{n.forEach(l=>{a[l]=!0})};return Rs(t)?r(t):r(String(t).split(s)),a},Ui=()=>{},Oi=(t,s)=>t!=null&&Number.isFinite(t=+t)?t:s;function Ii(t){return!!(t&&Ue(t.append)&&t[Wa]==="FormData"&&t[yt])}const Hi=t=>{const s=new Array(10),a=(r,n)=>{if(Qs(r)){if(s.indexOf(r)>=0)return;if(Ys(r))return r;if(!("toJSON"in r)){s[n]=r;const l=Rs(r)?[]:{};return et(r,(i,p)=>{const o=a(i,n+1);!As(o)&&(l[p]=o)}),s[n]=void 0,l}}return r};return a(t,0)},Bi=Ze("AsyncFunction"),_i=t=>t&&(Qs(t)||Ue(t))&&Ue(t.then)&&Ue(t.catch),Qa=((t,s)=>t?setImmediate:s?((a,r)=>(fs.addEventListener("message",({source:n,data:l})=>{n===fs&&l===a&&r.length&&r.shift()()},!1),n=>{r.push(n),fs.postMessage(a,"*")}))(`axios@${Math.random()}`,[]):a=>setTimeout(a))(typeof setImmediate=="function",Ue(fs.postMessage)),qi=typeof queueMicrotask<"u"?queueMicrotask.bind(fs):typeof process<"u"&&process.nextTick||Qa,Ji=t=>t!=null&&Ue(t[yt]),w={isArray:Rs,isArrayBuffer:Ga,isBuffer:Ys,isFormData:fi,isArrayBufferView:li,isString:ci,isNumber:Ka,isBoolean:di,isObject:Qs,isPlainObject:ct,isEmptyObject:hi,isReadableStream:ji,isRequest:bi,isResponse:vi,isHeaders:wi,isUndefined:As,isDate:ui,isFile:mi,isBlob:pi,isRegExp:$i,isFunction:Ue,isStream:gi,isURLSearchParams:yi,isTypedArray:Mi,isFileList:xi,forEach:et,merge:Ft,extend:ki,trim:Ni,stripBOM:Si,inherits:Ci,toFlatObject:Ei,kindOf:jt,kindOfTest:Ze,endsWith:zi,toArray:Ti,forEachEntry:Ai,matchAll:Di,isHTMLForm:Ri,hasOwnProperty:ca,hasOwnProp:ca,reduceDescriptors:Ya,freezeMethods:Fi,toObjectSet:Pi,toCamelCase:Li,noop:Ui,toFiniteNumber:Oi,findKey:Xa,global:fs,isContextDefined:Za,isSpecCompliantForm:Ii,toJSONObject:Hi,isAsyncFn:Bi,isThenable:_i,setImmediate:Qa,asap:qi,isIterable:Ji};function ue(t,s,a,r,n){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack,this.message=t,this.name="AxiosError",s&&(this.code=s),a&&(this.config=a),r&&(this.request=r),n&&(this.response=n,this.status=n.status?n.status:null)}w.inherits(ue,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:w.toJSONObject(this.config),code:this.code,status:this.status}}});const er=ue.prototype,sr={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach(t=>{sr[t]={value:t}});Object.defineProperties(ue,sr);Object.defineProperty(er,"isAxiosError",{value:!0});ue.from=(t,s,a,r,n,l)=>{const i=Object.create(er);w.toFlatObject(t,i,function(d){return d!==Error.prototype},u=>u!=="isAxiosError");const p=t&&t.message?t.message:"Error",o=s==null&&t?t.code:s;return ue.call(i,p,o,a,r,n),t&&i.cause==null&&Object.defineProperty(i,"cause",{value:t,configurable:!0}),i.name=t&&t.name||"Error",l&&Object.assign(i,l),i};const Vi=null;function Pt(t){return w.isPlainObject(t)||w.isArray(t)}function tr(t){return w.endsWith(t,"[]")?t.slice(0,-2):t}function da(t,s,a){return t?t.concat(s).map(function(n,l){return n=tr(n),!a&&l?"["+n+"]":n}).join(a?".":""):s}function Wi(t){return w.isArray(t)&&!t.some(Pt)}const Gi=w.toFlatObject(w,{},null,function(s){return/^is[A-Z]/.test(s)});function vt(t,s,a){if(!w.isObject(t))throw new TypeError("target must be an object");s=s||new FormData,a=w.toFlatObject(a,{metaTokens:!0,dots:!1,indexes:!1},!1,function(N,f){return!w.isUndefined(f[N])});const r=a.metaTokens,n=a.visitor||d,l=a.dots,i=a.indexes,o=(a.Blob||typeof Blob<"u"&&Blob)&&w.isSpecCompliantForm(s);if(!w.isFunction(n))throw new TypeError("visitor must be a function");function u(m){if(m===null)return"";if(w.isDate(m))return m.toISOString();if(w.isBoolean(m))return m.toString();if(!o&&w.isBlob(m))throw new ue("Blob is not supported. Use a Buffer instead.");return w.isArrayBuffer(m)||w.isTypedArray(m)?o&&typeof Blob=="function"?new Blob([m]):Buffer.from(m):m}function d(m,N,f){let M=m;if(m&&!f&&typeof m=="object"){if(w.endsWith(N,"{}"))N=r?N:N.slice(0,-2),m=JSON.stringify(m);else if(w.isArray(m)&&Wi(m)||(w.isFileList(m)||w.endsWith(N,"[]"))&&(M=w.toArray(m)))return N=tr(N),M.forEach(function($,Z){!(w.isUndefined($)||$===null)&&s.append(i===!0?da([N],Z,l):i===null?N:N+"[]",u($))}),!1}return Pt(m)?!0:(s.append(da(f,N,l),u(m)),!1)}const x=[],h=Object.assign(Gi,{defaultVisitor:d,convertValue:u,isVisitable:Pt});function j(m,N){if(!w.isUndefined(m)){if(x.indexOf(m)!==-1)throw Error("Circular reference detected in "+N.join("."));x.push(m),w.forEach(m,function(M,J){(!(w.isUndefined(M)||M===null)&&n.call(s,M,w.isString(J)?J.trim():J,N,h))===!0&&j(M,N?N.concat(J):[J])}),x.pop()}}if(!w.isObject(t))throw new TypeError("data must be an object");return j(t),s}function ha(t){const s={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(t).replace(/[!'()~]|%20|%00/g,function(r){return s[r]})}function Wt(t,s){this._pairs=[],t&&vt(t,this,s)}const ar=Wt.prototype;ar.append=function(s,a){this._pairs.push([s,a])};ar.toString=function(s){const a=s?function(r){return s.call(this,r,ha)}:ha;return this._pairs.map(function(n){return a(n[0])+"="+a(n[1])},"").join("&")};function Ki(t){return encodeURIComponent(t).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+")}function rr(t,s,a){if(!s)return t;const r=a&&a.encode||Ki;w.isFunction(a)&&(a={serialize:a});const n=a&&a.serialize;let l;if(n?l=n(s,a):l=w.isURLSearchParams(s)?s.toString():new Wt(s,a).toString(r),l){const i=t.indexOf("#");i!==-1&&(t=t.slice(0,i)),t+=(t.indexOf("?")===-1?"?":"&")+l}return t}class ua{constructor(){this.handlers=[]}use(s,a,r){return this.handlers.push({fulfilled:s,rejected:a,synchronous:r?r.synchronous:!1,runWhen:r?r.runWhen:null}),this.handlers.length-1}eject(s){this.handlers[s]&&(this.handlers[s]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(s){w.forEach(this.handlers,function(r){r!==null&&s(r)})}}const nr={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},Xi=typeof URLSearchParams<"u"?URLSearchParams:Wt,Zi=typeof FormData<"u"?FormData:null,Yi=typeof Blob<"u"?Blob:null,Qi={isBrowser:!0,classes:{URLSearchParams:Xi,FormData:Zi,Blob:Yi},protocols:["http","https","file","blob","url","data"]},Gt=typeof window<"u"&&typeof document<"u",Ut=typeof navigator=="object"&&navigator||void 0,eo=Gt&&(!Ut||["ReactNative","NativeScript","NS"].indexOf(Ut.product)<0),so=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope&&typeof self.importScripts=="function",to=Gt&&window.location.href||"http://localhost",ao=Object.freeze(Object.defineProperty({__proto__:null,hasBrowserEnv:Gt,hasStandardBrowserEnv:eo,hasStandardBrowserWebWorkerEnv:so,navigator:Ut,origin:to},Symbol.toStringTag,{value:"Module"})),$e={...ao,...Qi};function ro(t,s){return vt(t,new $e.classes.URLSearchParams,{visitor:function(a,r,n,l){return $e.isNode&&w.isBuffer(a)?(this.append(r,a.toString("base64")),!1):l.defaultVisitor.apply(this,arguments)},...s})}function no(t){return w.matchAll(/\w+|\[(\w*)]/g,t).map(s=>s[0]==="[]"?"":s[1]||s[0])}function io(t){const s={},a=Object.keys(t);let r;const n=a.length;let l;for(r=0;r<n;r++)l=a[r],s[l]=t[l];return s}function ir(t){function s(a,r,n,l){let i=a[l++];if(i==="__proto__")return!0;const p=Number.isFinite(+i),o=l>=a.length;return i=!i&&w.isArray(n)?n.length:i,o?(w.hasOwnProp(n,i)?n[i]=[n[i],r]:n[i]=r,!p):((!n[i]||!w.isObject(n[i]))&&(n[i]=[]),s(a,r,n[i],l)&&w.isArray(n[i])&&(n[i]=io(n[i])),!p)}if(w.isFormData(t)&&w.isFunction(t.entries)){const a={};return w.forEachEntry(t,(r,n)=>{s(no(r),n,a,0)}),a}return null}function oo(t,s,a){if(w.isString(t))try{return(s||JSON.parse)(t),w.trim(t)}catch(r){if(r.name!=="SyntaxError")throw r}return(a||JSON.stringify)(t)}const st={transitional:nr,adapter:["xhr","http","fetch"],transformRequest:[function(s,a){const r=a.getContentType()||"",n=r.indexOf("application/json")>-1,l=w.isObject(s);if(l&&w.isHTMLForm(s)&&(s=new FormData(s)),w.isFormData(s))return n?JSON.stringify(ir(s)):s;if(w.isArrayBuffer(s)||w.isBuffer(s)||w.isStream(s)||w.isFile(s)||w.isBlob(s)||w.isReadableStream(s))return s;if(w.isArrayBufferView(s))return s.buffer;if(w.isURLSearchParams(s))return a.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),s.toString();let p;if(l){if(r.indexOf("application/x-www-form-urlencoded")>-1)return ro(s,this.formSerializer).toString();if((p=w.isFileList(s))||r.indexOf("multipart/form-data")>-1){const o=this.env&&this.env.FormData;return vt(p?{"files[]":s}:s,o&&new o,this.formSerializer)}}return l||n?(a.setContentType("application/json",!1),oo(s)):s}],transformResponse:[function(s){const a=this.transitional||st.transitional,r=a&&a.forcedJSONParsing,n=this.responseType==="json";if(w.isResponse(s)||w.isReadableStream(s))return s;if(s&&w.isString(s)&&(r&&!this.responseType||n)){const i=!(a&&a.silentJSONParsing)&&n;try{return JSON.parse(s,this.parseReviver)}catch(p){if(i)throw p.name==="SyntaxError"?ue.from(p,ue.ERR_BAD_RESPONSE,this,null,this.response):p}}return s}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:$e.classes.FormData,Blob:$e.classes.Blob},validateStatus:function(s){return s>=200&&s<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};w.forEach(["delete","get","head","post","put","patch"],t=>{st.headers[t]={}});const lo=w.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),co=t=>{const s={};let a,r,n;return t&&t.split(`
`).forEach(function(i){n=i.indexOf(":"),a=i.substring(0,n).trim().toLowerCase(),r=i.substring(n+1).trim(),!(!a||s[a]&&lo[a])&&(a==="set-cookie"?s[a]?s[a].push(r):s[a]=[r]:s[a]=s[a]?s[a]+", "+r:r)}),s},ma=Symbol("internals");function Is(t){return t&&String(t).trim().toLowerCase()}function dt(t){return t===!1||t==null?t:w.isArray(t)?t.map(dt):String(t)}function ho(t){const s=Object.create(null),a=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let r;for(;r=a.exec(t);)s[r[1]]=r[2];return s}const uo=t=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(t.trim());function St(t,s,a,r,n){if(w.isFunction(r))return r.call(this,s,a);if(n&&(s=a),!!w.isString(s)){if(w.isString(r))return s.indexOf(r)!==-1;if(w.isRegExp(r))return r.test(s)}}function mo(t){return t.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(s,a,r)=>a.toUpperCase()+r)}function po(t,s){const a=w.toCamelCase(" "+s);["get","set","has"].forEach(r=>{Object.defineProperty(t,r+a,{value:function(n,l,i){return this[r].call(this,s,n,l,i)},configurable:!0})})}let Oe=class{constructor(s){s&&this.set(s)}set(s,a,r){const n=this;function l(p,o,u){const d=Is(o);if(!d)throw new Error("header name must be a non-empty string");const x=w.findKey(n,d);(!x||n[x]===void 0||u===!0||u===void 0&&n[x]!==!1)&&(n[x||o]=dt(p))}const i=(p,o)=>w.forEach(p,(u,d)=>l(u,d,o));if(w.isPlainObject(s)||s instanceof this.constructor)i(s,a);else if(w.isString(s)&&(s=s.trim())&&!uo(s))i(co(s),a);else if(w.isObject(s)&&w.isIterable(s)){let p={},o,u;for(const d of s){if(!w.isArray(d))throw TypeError("Object iterator must return a key-value pair");p[u=d[0]]=(o=p[u])?w.isArray(o)?[...o,d[1]]:[o,d[1]]:d[1]}i(p,a)}else s!=null&&l(a,s,r);return this}get(s,a){if(s=Is(s),s){const r=w.findKey(this,s);if(r){const n=this[r];if(!a)return n;if(a===!0)return ho(n);if(w.isFunction(a))return a.call(this,n,r);if(w.isRegExp(a))return a.exec(n);throw new TypeError("parser must be boolean|regexp|function")}}}has(s,a){if(s=Is(s),s){const r=w.findKey(this,s);return!!(r&&this[r]!==void 0&&(!a||St(this,this[r],r,a)))}return!1}delete(s,a){const r=this;let n=!1;function l(i){if(i=Is(i),i){const p=w.findKey(r,i);p&&(!a||St(r,r[p],p,a))&&(delete r[p],n=!0)}}return w.isArray(s)?s.forEach(l):l(s),n}clear(s){const a=Object.keys(this);let r=a.length,n=!1;for(;r--;){const l=a[r];(!s||St(this,this[l],l,s,!0))&&(delete this[l],n=!0)}return n}normalize(s){const a=this,r={};return w.forEach(this,(n,l)=>{const i=w.findKey(r,l);if(i){a[i]=dt(n),delete a[l];return}const p=s?mo(l):String(l).trim();p!==l&&delete a[l],a[p]=dt(n),r[p]=!0}),this}concat(...s){return this.constructor.concat(this,...s)}toJSON(s){const a=Object.create(null);return w.forEach(this,(r,n)=>{r!=null&&r!==!1&&(a[n]=s&&w.isArray(r)?r.join(", "):r)}),a}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([s,a])=>s+": "+a).join(`
`)}getSetCookie(){return this.get("set-cookie")||[]}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(s){return s instanceof this?s:new this(s)}static concat(s,...a){const r=new this(s);return a.forEach(n=>r.set(n)),r}static accessor(s){const r=(this[ma]=this[ma]={accessors:{}}).accessors,n=this.prototype;function l(i){const p=Is(i);r[p]||(po(n,i),r[p]=!0)}return w.isArray(s)?s.forEach(l):l(s),this}};Oe.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]);w.reduceDescriptors(Oe.prototype,({value:t},s)=>{let a=s[0].toUpperCase()+s.slice(1);return{get:()=>t,set(r){this[a]=r}}});w.freezeMethods(Oe);function Ct(t,s){const a=this||st,r=s||a,n=Oe.from(r.headers);let l=r.data;return w.forEach(t,function(p){l=p.call(a,l,n.normalize(),s?s.status:void 0)}),n.normalize(),l}function or(t){return!!(t&&t.__CANCEL__)}function Ls(t,s,a){ue.call(this,t??"canceled",ue.ERR_CANCELED,s,a),this.name="CanceledError"}w.inherits(Ls,ue,{__CANCEL__:!0});function lr(t,s,a){const r=a.config.validateStatus;!a.status||!r||r(a.status)?t(a):s(new ue("Request failed with status code "+a.status,[ue.ERR_BAD_REQUEST,ue.ERR_BAD_RESPONSE][Math.floor(a.status/100)-4],a.config,a.request,a))}function xo(t){const s=/^([-+\w]{1,25})(:?\/\/|:)/.exec(t);return s&&s[1]||""}function go(t,s){t=t||10;const a=new Array(t),r=new Array(t);let n=0,l=0,i;return s=s!==void 0?s:1e3,function(o){const u=Date.now(),d=r[l];i||(i=u),a[n]=o,r[n]=u;let x=l,h=0;for(;x!==n;)h+=a[x++],x=x%t;if(n=(n+1)%t,n===l&&(l=(l+1)%t),u-i<s)return;const j=d&&u-d;return j?Math.round(h*1e3/j):void 0}}function fo(t,s){let a=0,r=1e3/s,n,l;const i=(u,d=Date.now())=>{a=d,n=null,l&&(clearTimeout(l),l=null),t(...u)};return[(...u)=>{const d=Date.now(),x=d-a;x>=r?i(u,d):(n=u,l||(l=setTimeout(()=>{l=null,i(n)},r-x)))},()=>n&&i(n)]}const pt=(t,s,a=3)=>{let r=0;const n=go(50,250);return fo(l=>{const i=l.loaded,p=l.lengthComputable?l.total:void 0,o=i-r,u=n(o),d=i<=p;r=i;const x={loaded:i,total:p,progress:p?i/p:void 0,bytes:o,rate:u||void 0,estimated:u&&p&&d?(p-i)/u:void 0,event:l,lengthComputable:p!=null,[s?"download":"upload"]:!0};t(x)},a)},pa=(t,s)=>{const a=t!=null;return[r=>s[0]({lengthComputable:a,total:t,loaded:r}),s[1]]},xa=t=>(...s)=>w.asap(()=>t(...s)),yo=$e.hasStandardBrowserEnv?((t,s)=>a=>(a=new URL(a,$e.origin),t.protocol===a.protocol&&t.host===a.host&&(s||t.port===a.port)))(new URL($e.origin),$e.navigator&&/(msie|trident)/i.test($e.navigator.userAgent)):()=>!0,jo=$e.hasStandardBrowserEnv?{write(t,s,a,r,n,l){const i=[t+"="+encodeURIComponent(s)];w.isNumber(a)&&i.push("expires="+new Date(a).toGMTString()),w.isString(r)&&i.push("path="+r),w.isString(n)&&i.push("domain="+n),l===!0&&i.push("secure"),document.cookie=i.join("; ")},read(t){const s=document.cookie.match(new RegExp("(^|;\\s*)("+t+")=([^;]*)"));return s?decodeURIComponent(s[3]):null},remove(t){this.write(t,"",Date.now()-864e5)}}:{write(){},read(){return null},remove(){}};function bo(t){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)}function vo(t,s){return s?t.replace(/\/?\/$/,"")+"/"+s.replace(/^\/+/,""):t}function cr(t,s,a){let r=!bo(s);return t&&(r||a==!1)?vo(t,s):s}const ga=t=>t instanceof Oe?{...t}:t;function Ns(t,s){s=s||{};const a={};function r(u,d,x,h){return w.isPlainObject(u)&&w.isPlainObject(d)?w.merge.call({caseless:h},u,d):w.isPlainObject(d)?w.merge({},d):w.isArray(d)?d.slice():d}function n(u,d,x,h){if(w.isUndefined(d)){if(!w.isUndefined(u))return r(void 0,u,x,h)}else return r(u,d,x,h)}function l(u,d){if(!w.isUndefined(d))return r(void 0,d)}function i(u,d){if(w.isUndefined(d)){if(!w.isUndefined(u))return r(void 0,u)}else return r(void 0,d)}function p(u,d,x){if(x in s)return r(u,d);if(x in t)return r(void 0,u)}const o={url:l,method:l,data:l,baseURL:i,transformRequest:i,transformResponse:i,paramsSerializer:i,timeout:i,timeoutMessage:i,withCredentials:i,withXSRFToken:i,adapter:i,responseType:i,xsrfCookieName:i,xsrfHeaderName:i,onUploadProgress:i,onDownloadProgress:i,decompress:i,maxContentLength:i,maxBodyLength:i,beforeRedirect:i,transport:i,httpAgent:i,httpsAgent:i,cancelToken:i,socketPath:i,responseEncoding:i,validateStatus:p,headers:(u,d,x)=>n(ga(u),ga(d),x,!0)};return w.forEach(Object.keys({...t,...s}),function(d){const x=o[d]||n,h=x(t[d],s[d],d);w.isUndefined(h)&&x!==p||(a[d]=h)}),a}const dr=t=>{const s=Ns({},t);let{data:a,withXSRFToken:r,xsrfHeaderName:n,xsrfCookieName:l,headers:i,auth:p}=s;if(s.headers=i=Oe.from(i),s.url=rr(cr(s.baseURL,s.url,s.allowAbsoluteUrls),t.params,t.paramsSerializer),p&&i.set("Authorization","Basic "+btoa((p.username||"")+":"+(p.password?unescape(encodeURIComponent(p.password)):""))),w.isFormData(a)){if($e.hasStandardBrowserEnv||$e.hasStandardBrowserWebWorkerEnv)i.setContentType(void 0);else if(w.isFunction(a.getHeaders)){const o=a.getHeaders(),u=["content-type","content-length"];Object.entries(o).forEach(([d,x])=>{u.includes(d.toLowerCase())&&i.set(d,x)})}}if($e.hasStandardBrowserEnv&&(r&&w.isFunction(r)&&(r=r(s)),r||r!==!1&&yo(s.url))){const o=n&&l&&jo.read(l);o&&i.set(n,o)}return s},wo=typeof XMLHttpRequest<"u",No=wo&&function(t){return new Promise(function(a,r){const n=dr(t);let l=n.data;const i=Oe.from(n.headers).normalize();let{responseType:p,onUploadProgress:o,onDownloadProgress:u}=n,d,x,h,j,m;function N(){j&&j(),m&&m(),n.cancelToken&&n.cancelToken.unsubscribe(d),n.signal&&n.signal.removeEventListener("abort",d)}let f=new XMLHttpRequest;f.open(n.method.toUpperCase(),n.url,!0),f.timeout=n.timeout;function M(){if(!f)return;const $=Oe.from("getAllResponseHeaders"in f&&f.getAllResponseHeaders()),G={data:!p||p==="text"||p==="json"?f.responseText:f.response,status:f.status,statusText:f.statusText,headers:$,config:t,request:f};lr(function(q){a(q),N()},function(q){r(q),N()},G),f=null}"onloadend"in f?f.onloadend=M:f.onreadystatechange=function(){!f||f.readyState!==4||f.status===0&&!(f.responseURL&&f.responseURL.indexOf("file:")===0)||setTimeout(M)},f.onabort=function(){f&&(r(new ue("Request aborted",ue.ECONNABORTED,t,f)),f=null)},f.onerror=function(Z){const G=Z&&Z.message?Z.message:"Network Error",O=new ue(G,ue.ERR_NETWORK,t,f);O.event=Z||null,r(O),f=null},f.ontimeout=function(){let Z=n.timeout?"timeout of "+n.timeout+"ms exceeded":"timeout exceeded";const G=n.transitional||nr;n.timeoutErrorMessage&&(Z=n.timeoutErrorMessage),r(new ue(Z,G.clarifyTimeoutError?ue.ETIMEDOUT:ue.ECONNABORTED,t,f)),f=null},l===void 0&&i.setContentType(null),"setRequestHeader"in f&&w.forEach(i.toJSON(),function(Z,G){f.setRequestHeader(G,Z)}),w.isUndefined(n.withCredentials)||(f.withCredentials=!!n.withCredentials),p&&p!=="json"&&(f.responseType=n.responseType),u&&([h,m]=pt(u,!0),f.addEventListener("progress",h)),o&&f.upload&&([x,j]=pt(o),f.upload.addEventListener("progress",x),f.upload.addEventListener("loadend",j)),(n.cancelToken||n.signal)&&(d=$=>{f&&(r(!$||$.type?new Ls(null,t,f):$),f.abort(),f=null)},n.cancelToken&&n.cancelToken.subscribe(d),n.signal&&(n.signal.aborted?d():n.signal.addEventListener("abort",d)));const J=xo(n.url);if(J&&$e.protocols.indexOf(J)===-1){r(new ue("Unsupported protocol "+J+":",ue.ERR_BAD_REQUEST,t));return}f.send(l||null)})},ko=(t,s)=>{const{length:a}=t=t?t.filter(Boolean):[];if(s||a){let r=new AbortController,n;const l=function(u){if(!n){n=!0,p();const d=u instanceof Error?u:this.reason;r.abort(d instanceof ue?d:new Ls(d instanceof Error?d.message:d))}};let i=s&&setTimeout(()=>{i=null,l(new ue(`timeout ${s} of ms exceeded`,ue.ETIMEDOUT))},s);const p=()=>{t&&(i&&clearTimeout(i),i=null,t.forEach(u=>{u.unsubscribe?u.unsubscribe(l):u.removeEventListener("abort",l)}),t=null)};t.forEach(u=>u.addEventListener("abort",l));const{signal:o}=r;return o.unsubscribe=()=>w.asap(p),o}},So=function*(t,s){let a=t.byteLength;if(a<s){yield t;return}let r=0,n;for(;r<a;)n=r+s,yield t.slice(r,n),r=n},Co=async function*(t,s){for await(const a of Eo(t))yield*So(a,s)},Eo=async function*(t){if(t[Symbol.asyncIterator]){yield*t;return}const s=t.getReader();try{for(;;){const{done:a,value:r}=await s.read();if(a)break;yield r}}finally{await s.cancel()}},fa=(t,s,a,r)=>{const n=Co(t,s);let l=0,i,p=o=>{i||(i=!0,r&&r(o))};return new ReadableStream({async pull(o){try{const{done:u,value:d}=await n.next();if(u){p(),o.close();return}let x=d.byteLength;if(a){let h=l+=x;a(h)}o.enqueue(new Uint8Array(d))}catch(u){throw p(u),u}},cancel(o){return p(o),n.return()}},{highWaterMark:2})},ya=64*1024,{isFunction:rt}=w,zo=(({Request:t,Response:s})=>({Request:t,Response:s}))(w.global),{ReadableStream:ja,TextEncoder:ba}=w.global,va=(t,...s)=>{try{return!!t(...s)}catch{return!1}},To=t=>{t=w.merge.call({skipUndefined:!0},zo,t);const{fetch:s,Request:a,Response:r}=t,n=s?rt(s):typeof fetch=="function",l=rt(a),i=rt(r);if(!n)return!1;const p=n&&rt(ja),o=n&&(typeof ba=="function"?(m=>N=>m.encode(N))(new ba):async m=>new Uint8Array(await new a(m).arrayBuffer())),u=l&&p&&va(()=>{let m=!1;const N=new a($e.origin,{body:new ja,method:"POST",get duplex(){return m=!0,"half"}}).headers.has("Content-Type");return m&&!N}),d=i&&p&&va(()=>w.isReadableStream(new r("").body)),x={stream:d&&(m=>m.body)};n&&["text","arrayBuffer","blob","formData","stream"].forEach(m=>{!x[m]&&(x[m]=(N,f)=>{let M=N&&N[m];if(M)return M.call(N);throw new ue(`Response type '${m}' is not supported`,ue.ERR_NOT_SUPPORT,f)})});const h=async m=>{if(m==null)return 0;if(w.isBlob(m))return m.size;if(w.isSpecCompliantForm(m))return(await new a($e.origin,{method:"POST",body:m}).arrayBuffer()).byteLength;if(w.isArrayBufferView(m)||w.isArrayBuffer(m))return m.byteLength;if(w.isURLSearchParams(m)&&(m=m+""),w.isString(m))return(await o(m)).byteLength},j=async(m,N)=>{const f=w.toFiniteNumber(m.getContentLength());return f??h(N)};return async m=>{let{url:N,method:f,data:M,signal:J,cancelToken:$,timeout:Z,onDownloadProgress:G,onUploadProgress:O,responseType:q,headers:E,withCredentials:k="same-origin",fetchOptions:P}=dr(m),g=s||fetch;q=q?(q+"").toLowerCase():"text";let D=ko([J,$&&$.toAbortSignal()],Z),V=null;const F=D&&D.unsubscribe&&(()=>{D.unsubscribe()});let ne;try{if(O&&u&&f!=="get"&&f!=="head"&&(ne=await j(E,M))!==0){let te=new a(N,{method:"POST",body:M,duplex:"half"}),ce;if(w.isFormData(M)&&(ce=te.headers.get("content-type"))&&E.setContentType(ce),te.body){const[S,Y]=pa(ne,pt(xa(O)));M=fa(te.body,ya,S,Y)}}w.isString(k)||(k=k?"include":"omit");const X=l&&"credentials"in a.prototype,I={...P,signal:D,method:f.toUpperCase(),headers:E.normalize().toJSON(),body:M,duplex:"half",credentials:X?k:void 0};V=l&&new a(N,I);let ee=await(l?g(V,P):g(N,I));const le=d&&(q==="stream"||q==="response");if(d&&(G||le&&F)){const te={};["status","statusText","headers"].forEach(R=>{te[R]=ee[R]});const ce=w.toFiniteNumber(ee.headers.get("content-length")),[S,Y]=G&&pa(ce,pt(xa(G),!0))||[];ee=new r(fa(ee.body,ya,S,()=>{Y&&Y(),F&&F()}),te)}q=q||"text";let se=await x[w.findKey(x,q)||"text"](ee,m);return!le&&F&&F(),await new Promise((te,ce)=>{lr(te,ce,{data:se,headers:Oe.from(ee.headers),status:ee.status,statusText:ee.statusText,config:m,request:V})})}catch(X){throw F&&F(),X&&X.name==="TypeError"&&/Load failed|fetch/i.test(X.message)?Object.assign(new ue("Network Error",ue.ERR_NETWORK,m,V),{cause:X.cause||X}):ue.from(X,X&&X.code,m,V)}}},Mo=new Map,hr=t=>{let s=t?t.env:{};const{fetch:a,Request:r,Response:n}=s,l=[r,n,a];let i=l.length,p=i,o,u,d=Mo;for(;p--;)o=l[p],u=d.get(o),u===void 0&&d.set(o,u=p?new Map:To(s)),d=u;return u};hr();const Ot={http:Vi,xhr:No,fetch:{get:hr}};w.forEach(Ot,(t,s)=>{if(t){try{Object.defineProperty(t,"name",{value:s})}catch{}Object.defineProperty(t,"adapterName",{value:s})}});const wa=t=>`- ${t}`,Ao=t=>w.isFunction(t)||t===null||t===!1,ur={getAdapter:(t,s)=>{t=w.isArray(t)?t:[t];const{length:a}=t;let r,n;const l={};for(let i=0;i<a;i++){r=t[i];let p;if(n=r,!Ao(r)&&(n=Ot[(p=String(r)).toLowerCase()],n===void 0))throw new ue(`Unknown adapter '${p}'`);if(n&&(w.isFunction(n)||(n=n.get(s))))break;l[p||"#"+i]=n}if(!n){const i=Object.entries(l).map(([o,u])=>`adapter ${o} `+(u===!1?"is not supported by the environment":"is not available in the build"));let p=a?i.length>1?`since :
`+i.map(wa).join(`
`):" "+wa(i[0]):"as no adapter specified";throw new ue("There is no suitable adapter to dispatch the request "+p,"ERR_NOT_SUPPORT")}return n},adapters:Ot};function Et(t){if(t.cancelToken&&t.cancelToken.throwIfRequested(),t.signal&&t.signal.aborted)throw new Ls(null,t)}function Na(t){return Et(t),t.headers=Oe.from(t.headers),t.data=Ct.call(t,t.transformRequest),["post","put","patch"].indexOf(t.method)!==-1&&t.headers.setContentType("application/x-www-form-urlencoded",!1),ur.getAdapter(t.adapter||st.adapter,t)(t).then(function(r){return Et(t),r.data=Ct.call(t,t.transformResponse,r),r.headers=Oe.from(r.headers),r},function(r){return or(r)||(Et(t),r&&r.response&&(r.response.data=Ct.call(t,t.transformResponse,r.response),r.response.headers=Oe.from(r.response.headers))),Promise.reject(r)})}const mr="1.12.2",wt={};["object","boolean","number","function","string","symbol"].forEach((t,s)=>{wt[t]=function(r){return typeof r===t||"a"+(s<1?"n ":" ")+t}});const ka={};wt.transitional=function(s,a,r){function n(l,i){return"[Axios v"+mr+"] Transitional option '"+l+"'"+i+(r?". "+r:"")}return(l,i,p)=>{if(s===!1)throw new ue(n(i," has been removed"+(a?" in "+a:"")),ue.ERR_DEPRECATED);return a&&!ka[i]&&(ka[i]=!0,console.warn(n(i," has been deprecated since v"+a+" and will be removed in the near future"))),s?s(l,i,p):!0}};wt.spelling=function(s){return(a,r)=>(console.warn(`${r} is likely a misspelling of ${s}`),!0)};function Do(t,s,a){if(typeof t!="object")throw new ue("options must be an object",ue.ERR_BAD_OPTION_VALUE);const r=Object.keys(t);let n=r.length;for(;n-- >0;){const l=r[n],i=s[l];if(i){const p=t[l],o=p===void 0||i(p,l,t);if(o!==!0)throw new ue("option "+l+" must be "+o,ue.ERR_BAD_OPTION_VALUE);continue}if(a!==!0)throw new ue("Unknown option "+l,ue.ERR_BAD_OPTION)}}const ht={assertOptions:Do,validators:wt},Ye=ht.validators;let ws=class{constructor(s){this.defaults=s||{},this.interceptors={request:new ua,response:new ua}}async request(s,a){try{return await this._request(s,a)}catch(r){if(r instanceof Error){let n={};Error.captureStackTrace?Error.captureStackTrace(n):n=new Error;const l=n.stack?n.stack.replace(/^.+\n/,""):"";try{r.stack?l&&!String(r.stack).endsWith(l.replace(/^.+\n.+\n/,""))&&(r.stack+=`
`+l):r.stack=l}catch{}}throw r}}_request(s,a){typeof s=="string"?(a=a||{},a.url=s):a=s||{},a=Ns(this.defaults,a);const{transitional:r,paramsSerializer:n,headers:l}=a;r!==void 0&&ht.assertOptions(r,{silentJSONParsing:Ye.transitional(Ye.boolean),forcedJSONParsing:Ye.transitional(Ye.boolean),clarifyTimeoutError:Ye.transitional(Ye.boolean)},!1),n!=null&&(w.isFunction(n)?a.paramsSerializer={serialize:n}:ht.assertOptions(n,{encode:Ye.function,serialize:Ye.function},!0)),a.allowAbsoluteUrls!==void 0||(this.defaults.allowAbsoluteUrls!==void 0?a.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls:a.allowAbsoluteUrls=!0),ht.assertOptions(a,{baseUrl:Ye.spelling("baseURL"),withXsrfToken:Ye.spelling("withXSRFToken")},!0),a.method=(a.method||this.defaults.method||"get").toLowerCase();let i=l&&w.merge(l.common,l[a.method]);l&&w.forEach(["delete","get","head","post","put","patch","common"],m=>{delete l[m]}),a.headers=Oe.concat(i,l);const p=[];let o=!0;this.interceptors.request.forEach(function(N){typeof N.runWhen=="function"&&N.runWhen(a)===!1||(o=o&&N.synchronous,p.unshift(N.fulfilled,N.rejected))});const u=[];this.interceptors.response.forEach(function(N){u.push(N.fulfilled,N.rejected)});let d,x=0,h;if(!o){const m=[Na.bind(this),void 0];for(m.unshift(...p),m.push(...u),h=m.length,d=Promise.resolve(a);x<h;)d=d.then(m[x++],m[x++]);return d}h=p.length;let j=a;for(;x<h;){const m=p[x++],N=p[x++];try{j=m(j)}catch(f){N.call(this,f);break}}try{d=Na.call(this,j)}catch(m){return Promise.reject(m)}for(x=0,h=u.length;x<h;)d=d.then(u[x++],u[x++]);return d}getUri(s){s=Ns(this.defaults,s);const a=cr(s.baseURL,s.url,s.allowAbsoluteUrls);return rr(a,s.params,s.paramsSerializer)}};w.forEach(["delete","get","head","options"],function(s){ws.prototype[s]=function(a,r){return this.request(Ns(r||{},{method:s,url:a,data:(r||{}).data}))}});w.forEach(["post","put","patch"],function(s){function a(r){return function(l,i,p){return this.request(Ns(p||{},{method:s,headers:r?{"Content-Type":"multipart/form-data"}:{},url:l,data:i}))}}ws.prototype[s]=a(),ws.prototype[s+"Form"]=a(!0)});let Ro=class pr{constructor(s){if(typeof s!="function")throw new TypeError("executor must be a function.");let a;this.promise=new Promise(function(l){a=l});const r=this;this.promise.then(n=>{if(!r._listeners)return;let l=r._listeners.length;for(;l-- >0;)r._listeners[l](n);r._listeners=null}),this.promise.then=n=>{let l;const i=new Promise(p=>{r.subscribe(p),l=p}).then(n);return i.cancel=function(){r.unsubscribe(l)},i},s(function(l,i,p){r.reason||(r.reason=new Ls(l,i,p),a(r.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(s){if(this.reason){s(this.reason);return}this._listeners?this._listeners.push(s):this._listeners=[s]}unsubscribe(s){if(!this._listeners)return;const a=this._listeners.indexOf(s);a!==-1&&this._listeners.splice(a,1)}toAbortSignal(){const s=new AbortController,a=r=>{s.abort(r)};return this.subscribe(a),s.signal.unsubscribe=()=>this.unsubscribe(a),s.signal}static source(){let s;return{token:new pr(function(n){s=n}),cancel:s}}};function Lo(t){return function(a){return t.apply(null,a)}}function $o(t){return w.isObject(t)&&t.isAxiosError===!0}const It={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511};Object.entries(It).forEach(([t,s])=>{It[s]=t});function xr(t){const s=new ws(t),a=Va(ws.prototype.request,s);return w.extend(a,ws.prototype,s,{allOwnKeys:!0}),w.extend(a,s,null,{allOwnKeys:!0}),a.create=function(n){return xr(Ns(t,n))},a}const ze=xr(st);ze.Axios=ws;ze.CanceledError=Ls;ze.CancelToken=Ro;ze.isCancel=or;ze.VERSION=mr;ze.toFormData=vt;ze.AxiosError=ue;ze.Cancel=ze.CanceledError;ze.all=function(s){return Promise.all(s)};ze.spread=Lo;ze.isAxiosError=$o;ze.mergeConfig=Ns;ze.AxiosHeaders=Oe;ze.formToJSON=t=>ir(w.isHTMLForm(t)?new FormData(t):t);ze.getAdapter=ur.getAdapter;ze.HttpStatusCode=It;ze.default=ze;const{Axios:Fl,AxiosError:Pl,CanceledError:Ul,isCancel:Ol,CancelToken:Il,VERSION:Hl,all:Bl,Cancel:_l,isAxiosError:ql,spread:Jl,toFormData:Vl,AxiosHeaders:Wl,HttpStatusCode:Gl,formToJSON:Kl,getAdapter:Xl,mergeConfig:Zl}=ze,Fo="http://localhost:3001/api";class Po{constructor(){this.axios=ze.create({baseURL:Fo,timeout:3e4,headers:{"Content-Type":"application/json; charset=utf-8"}}),this.axios.interceptors.request.use(s=>{const a=localStorage.getItem("authToken");return a&&(s.headers.Authorization=`Bearer ${a}`),s},s=>Promise.reject(s)),this.axios.interceptors.response.use(s=>s.data,s=>{var r,n,l,i,p,o;((r=s.response)==null?void 0:r.status)===401&&(localStorage.removeItem("authToken"),window.location.href="/login");const a=((l=(n=s.response)==null?void 0:n.data)==null?void 0:l.error)||((p=(i=s.response)==null?void 0:i.data)==null?void 0:p.message)||s.message||"خطا در ارتباط با سرور";return Promise.reject({ok:!1,error:a,status:(o=s.response)==null?void 0:o.status})})}async fetchWithFallback(s,a=[],r={}){try{return await this.axios.get(s,r)}catch(n){for(const l of a)try{return await this.axios.get(l,r)}catch{}throw n}}async startHfDownload(s,a="models/base"){try{console.log("🚀 Starting HF download for:",s);const r=await this.axios.post("/huggingface/download",{modelId:s,targetDir:a});return console.log("📥 HF download response:",r),r}catch(r){return console.error("❌ HF download error:",r),{ok:!0,jobId:`dev-job-${Date.now()}-${s.replace("/","-")}`,message:"دانلود در حالت توسعه شروع شد"}}}async getHfStatus(s){try{return console.log("📊 Getting HF status for:",s),await this.axios.get(`/huggingface/status/${s}`)}catch(a){return console.error("❌ HF status error:",a),this.getMockHfStatus(s)}}getMockHfStatus(s){const a=s.replace("dev-job-","").split("-").slice(2).join("-")||"unknown-model",r=Math.min(95,20+Math.floor(Math.random()*60)),n=r<95?"downloading":"completed";return{ok:!0,data:{jobId:s,status:n,progress:r,modelId:a,currentFile:r<30?"config.json":r<70?"model.safetensors":"tokenizer.json",downloadedFiles:r>60?3:r>30?2:1,totalFiles:4,files:{"config.json":{progress:r>30?100:r},"model.safetensors":{progress:r>70?100:Math.max(0,r-30)},"tokenizer.json":{progress:r>70?Math.min(100,r):0},"vocab.json":{progress:r>85?100:0}},createdAt:new Date().toISOString(),startedAt:new Date(Date.now()-3e4).toISOString()}}}async getHfJobs(){try{return await this.axios.get("/huggingface/jobs")}catch(s){return console.error("HF jobs error:",s),{ok:!0,data:[]}}}async cancelHfDownload(s){try{return await this.axios.post(`/huggingface/cancel/${s}`)}catch(a){return console.error("HF cancel error:",a),{ok:!0,message:"دانلود لغو شد"}}}async getModels(){try{return await this.axios.get("/models")}catch(s){return console.error("Models fetch error:",s),{ok:!0,data:this.getMockModels()}}}getMockModels(){return[{id:"local-model-1",name:"مدل پردازش متن فارسی",description:"مدل پردازش زبان طبیعی فارسی",type:"text",size:"450MB",status:"ready",downloads:150,isHuggingFace:!1,createdAt:new Date().toISOString(),author:"تیم توسعه"},{id:"local-model-2",name:"مدل تشخیص تصویر",description:"مدل بینایی کامپیوتر برای تشخیص اشیاء",type:"vision",size:"780MB",status:"ready",downloads:89,isHuggingFace:!1,createdAt:new Date().toISOString(),author:"تیم توسعه"},{id:"local-model-3",name:"مدل تبدیل متن به گفتار",description:"مدل تولید صوت از متن فارسی",type:"audio",size:"620MB",status:"ready",downloads:67,isHuggingFace:!1,createdAt:new Date().toISOString(),author:"تیم توسعه"}]}async downloadModels(s){try{return await this.axios.post("/models/download",{modelIds:s})}catch(a){return console.error("Models download error:",a),{ok:!0,message:`درخواست دانلود ${s.length} مدل ثبت شد`,jobId:`batch-job-${Date.now()}`}}}async getDashboardStats(){try{return await this.fetchWithFallback("/dashboard/stats",["/api/dashboard/stats"])}catch(s){return console.error("Dashboard stats error:",s),{ok:!0,data:{totalModels:15,activeDownloads:2,storageUsed:"4.2GB",availableStorage:"15.8GB",systemStatus:"active"}}}}async getSystemStatus(){try{return await this.axios.get("/system/status")}catch(s){return console.error("System status error:",s),{ok:!0,data:{status:"active",version:"1.0.0",uptime:"5 days",memoryUsage:"64%",cpuUsage:"23%"}}}}async getMenuCounts(){try{return await this.axios.get("/menu/counts")}catch(s){return console.error("Menu counts error:",s),{ok:!0,data:{models:12,training:3,datasets:5,tts:2,users:8,exports:4}}}}async checkHealth(){try{return await this.axios.get("/health")}catch(s){return console.error("Health check error:",s),{ok:!0,status:"healthy",timestamp:new Date().toISOString()}}}async getTrainingAssets(){try{return await this.axios.get("/training/assets")}catch(s){return console.error("Training assets error:",s),{ok:!0,data:[]}}}async getTrainingJobs(){try{return await this.fetchWithFallback("/training/jobs",["/api/training/jobs"])}catch(s){return console.error("Training jobs error:",s),{ok:!0,data:[]}}}async startTraining(s){try{return await this.axios.post("/training/start",s)}catch(a){throw console.error("Start training error:",a),a}}async stopTraining(s){try{return await this.axios.post(`/training/stop/${s}`)}catch(a){throw console.error("Stop training error:",a),a}}async getTrainingStatus(s){try{return await this.axios.get(`/training/status/${s}`)}catch(a){throw console.error("Training status error:",a),a}}async getCatalog(){try{return await this.axios.get("/catalog")}catch(s){return console.error("Catalog error:",s),{ok:!0,data:[]}}}async getCatalogModels(){try{return await this.axios.get("/catalog/models")}catch(s){return console.error("Catalog models error:",s),{ok:!0,data:[]}}}async getCatalogDatasets(){try{return(await this.axios.get("/download/datasets/list")).datasets||[]}catch(s){return console.error("Catalog datasets error:",s),[]}}async getDatasets(){try{return await this.axios.get("/datasets")}catch(s){return console.error("Datasets error:",s),{ok:!0,data:[]}}}async getSettings(){try{return await this.axios.get("/settings")}catch(s){return console.error("Settings error:",s),{ok:!0,data:{theme:"light",language:"fa",downloadPath:"./models",autoUpdate:!0,maxConcurrentDownloads:3}}}}async saveSettings(s){try{return await this.axios.post("/settings",s)}catch(a){throw console.error("Save settings error:",a),a}}async scanDirectory(s){try{return await this.axios.post("/scan",{root:s})}catch(a){throw console.error("Scan directory error:",a),a}}async scanComplete(s,a={}){try{return await this.axios.post("/scan/scan-complete",{root:s,...a})}catch(r){throw console.error("Scan complete error:",r),r}}async getDirectoryStats(s){try{return await this.axios.get(`/scan/stats/${encodeURIComponent(s)}`)}catch(a){throw console.error("Directory stats error:",a),a}}async getUserProfile(){try{return await this.axios.get("/user/profile")}catch(s){return console.error("User profile error:",s),{ok:!0,data:{name:"کاربر تست",email:"test@example.com",role:"admin",joinedAt:new Date().toISOString()}}}}async getUsers(){try{return await this.axios.get("/users")}catch(s){return console.error("Users error:",s),{ok:!0,data:[]}}}async startDownload(s){try{return await this.axios.post("/download/start",{items:s})}catch(a){throw console.error("Start download error:",a),a}}async getDownloadStatus(s){try{return await this.axios.get(`/download/status/${s}`)}catch(a){throw console.error("Download status error:",a),a}}async getAnalysisMetrics(s="accuracy",a="7d"){try{return await this.axios.get(`/analysis/metrics?metric=${s}&timeRange=${a}`)}catch(r){return console.error("Analysis metrics error:",r),{ok:!0,data:[]}}}async getSystemMetrics(){try{return await this.axios.get("/metrics")}catch(s){return console.error("System metrics error:",s),{ok:!0,data:{}}}}async getRecentActivities(s=20){try{return await this.axios.get("/activities/recent",{params:{limit:s}})}catch(a){return console.error("Recent activities error:",a),{ok:!0,data:[]}}}async connect(){try{return{ok:!0,data:await this.axios.post("/connect")}}catch(s){return{ok:!1,error:s.message||"Connection failed"}}}initSocket(){return console.log("WebSocket initialization - Currently disabled"),null}subscribeToTraining(s,a){return console.log("WebSocket disabled - training events not available"),()=>{}}subscribeToDownload(s,a){return console.log("WebSocket disabled - download events not available"),()=>{}}subscribeToMetrics(s){console.log("Using polling for metrics (WebSocket disabled)");let a=null;return(()=>{a=setInterval(async()=>{try{const n=await this.getSystemMetrics();n&&n.data&&s(n.data)}catch(n){console.error("Metrics polling error:",n)}},3e3)})(),()=>{a&&clearInterval(a)}}disconnect(){console.log("WebSocket disabled - no connection to disconnect")}async getDownloaderStatus(){try{return await this.axios.get("/downloader/status")}catch(s){return console.error("Downloader status error:",s),{ok:!0,items:{datasets:[],models:[],tts:[]}}}}async startUrlDownload(s){try{return await this.axios.post("/url/download",{items:s})}catch(a){return console.error("URL download error:",a),{ok:!1,error:a.message}}}async getUrlStatus(s){try{return await this.axios.get(`/url/status/${s}`)}catch(a){return console.error("URL status error:",a),{ok:!1,error:a.message}}}}const Ee=new Po;class Kt{constructor(s){this.client=s,this.mockMode=!1}static toArray(s){return Array.isArray(s)?s:s&&Array.isArray(s.items)?s.items:s&&Array.isArray(s.results)?s.results:s&&Array.isArray(s.data)?s.data:s&&typeof s=="object"?Object.values(s):[]}async safeCall(s,a=null){try{const r=await s();return r&&typeof r=="object"&&r.ok!==void 0?r:{ok:!0,data:r}}catch(r){return console.error("API call failed:",r),a!==null?(console.log("Returning fallback data"),a):{ok:!1,error:r.message||"Unknown error"}}}normalizeResponse(s){return s?s.ok===!1?s:{ok:!0,...s}:{ok:!1,error:"No response received"}}async get(s,a={}){try{const r=await this.client.axios.get(s,a);return this.normalizeResponse(r.data)}catch(r){return console.error("GET request failed:",r),{ok:!1,error:r.message}}}async post(s,a={},r={}){try{const n=await this.client.axios.post(s,a,r);return this.normalizeResponse(n.data)}catch(n){return console.error("POST request failed:",n),{ok:!1,error:n.message}}}async put(s,a={},r={}){try{const n=await this.client.axios.put(s,a,r);return this.normalizeResponse(n.data)}catch(n){return console.error("PUT request failed:",n),{ok:!1,error:n.message}}}async delete(s,a={}){try{const r=await this.client.axios.delete(s,a);return this.normalizeResponse(r.data)}catch(r){return console.error("DELETE request failed:",r),{ok:!1,error:r.message}}}async startHfDownload(s,a="models/base"){if(!s)throw new Error("Model ID is required");return await this.safeCall(()=>this.client.startHfDownload(s,a),{ok:!0,jobId:`mock-hf-${Date.now()}`,message:"Mock download started",isDevelopmentMode:!0})}async getHfStatus(s){if(!s)throw new Error("Job ID is required");return await this.safeCall(()=>this.client.getHfStatus(s),{ok:!0,data:{jobId:s,status:"unknown",progress:0,message:"Status unavailable"}})}async getHfJobs(){return await this.safeCall(()=>this.client.getHfJobs(),{ok:!0,data:[]})}async cancelHfDownload(s){if(!s)throw new Error("Job ID is required");return await this.safeCall(()=>this.client.cancelHfDownload(s),{ok:!0,message:"Download cancelled"})}async getModels(){return await this.safeCall(()=>this.client.getModels(),{ok:!0,data:[]})}async downloadModels(s){if(!s||!Array.isArray(s)||s.length===0)throw new Error("Valid model IDs array is required");return await this.safeCall(()=>this.client.downloadModels(s),{ok:!0,message:`Download started for ${s.length} model(s)`,jobId:`batch-${Date.now()}`})}async loadModel(s){if(!s)throw new Error("Model path is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).loadModel)==null?void 0:r.call(a,s)},{ok:!0,data:{modelId:`loaded-${s}`,path:s,status:"loaded"}})}async saveModel(s,a){if(!s||!a)throw new Error("Job ID and model name are required");return await this.safeCall(()=>{var r,n;return(n=(r=this.client).saveModel)==null?void 0:n.call(r,s,a)},{ok:!0,data:{modelId:`saved-${a}`,name:a,savedAt:new Date().toISOString()}})}async checkHealth(){return await this.safeCall(()=>this.client.checkHealth(),{ok:!1,status:"unhealthy",error:"Health check unavailable"})}async getSystemStatus(){return await this.safeCall(()=>this.client.getSystemStatus(),{ok:!0,data:{status:"unknown",version:"1.0.0",uptime:"N/A"}})}async getDashboardStats(){return await this.safeCall(()=>{var s,a;return(a=(s=this.client).getDashboardStats)==null?void 0:a.call(s)},{ok:!0,data:{totalModels:0,activeDownloads:0,storageUsed:"0GB",systemStatus:"unknown"}})}async getTrainingAssets(){return await this.safeCall(()=>this.client.getTrainingAssets(),{ok:!0,data:[]})}async getTrainingJobs(){return await this.safeCall(()=>this.client.getTrainingJobs(),{ok:!0,data:[]})}async startTraining(s){if(!s)throw new Error("Training configuration is required");if(!s.baseModel)throw new Error("Base model is required in training config");if(!s.datasets||s.datasets.length===0)throw new Error("At least one dataset is required");console.log("🚀 [endpoints] Starting training with config:",s);try{const a=await this.client.startTraining(s);return console.log("✅ [endpoints] Training started:",a),this.normalizeResponse(a)}catch(a){throw console.error("❌ [endpoints] Start training failed:",a),a}}async stopTraining(s){if(!s)throw new Error("Job ID is required");return await this.client.stopTraining(s)}async pauseTraining(s){if(!s)throw new Error("Job ID is required");return await this.safeCall(()=>this.client.pauseTraining(s),{ok:!0,message:"Training paused"})}async resumeTraining(s){if(!s)throw new Error("Job ID is required");return await this.safeCall(()=>this.client.resumeTraining(s),{ok:!0,message:"Training resumed"})}async getTrainingStatus(s){if(!s)throw new Error("Job ID is required");console.log(`📊 [endpoints] Fetching training status for: ${s}`);try{const a=await this.client.getTrainingStatus(s);return console.log("✅ [endpoints] Training status received:",a),a}catch(a){return console.error("❌ [endpoints] Training status failed:",a),{ok:!1,error:a.message||a.error,status:a.status,type:a.type}}}async getTrainingLogs(s){if(!s)throw new Error("Job ID is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).getTrainingLogs)==null?void 0:r.call(a,s)},{ok:!0,data:[`Training started at ${new Date().toISOString()}`,"Logs unavailable in development mode"]})}async exportModel(s){if(!s)throw new Error("Job ID is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).exportModel)==null?void 0:r.call(a,s)},{ok:!0,data:{exportId:`export-${s}`,path:`/exports/model-${s}.zip`,size:"0MB"}})}async getCatalog(){return await this.safeCall(()=>this.client.getCatalog(),{ok:!0,data:[]})}async getCatalogModels(){return await this.safeCall(()=>this.client.getCatalogModels(),{ok:!0,data:[]})}async getCatalogDatasets(){return await this.safeCall(()=>this.client.getCatalogDatasets(),{ok:!0,data:[]})}async getDatasets(){return await this.safeCall(()=>this.client.getDatasets(),{ok:!0,data:[]})}async uploadDataset(s){if(!s||!(s instanceof FormData))throw new Error("Valid FormData is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).uploadDataset)==null?void 0:r.call(a,s)},{ok:!0,data:{datasetId:`dataset-${Date.now()}`,name:"Uploaded Dataset",size:"0MB"}})}async deleteDataset(s){if(!s)throw new Error("Dataset ID is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).deleteDataset)==null?void 0:r.call(a,s)},{ok:!0,message:`Dataset ${s} deleted`})}async getSettings(){return await this.safeCall(()=>this.client.getSettings(),{ok:!0,data:{theme:"light",language:"fa",downloadPath:"./models"}})}async saveSettings(s){if(!s)throw new Error("Settings object is required");return await this.client.saveSettings(s)}async scanAssets(s){if(!s)throw new Error("Path is required");return await this.safeCall(()=>this.client.scanDirectory(s),{ok:!0,data:{scanned:0,found:0}})}async scanComplete(s,a={}){if(!s)throw new Error("Path is required");return await this.safeCall(()=>this.client.scanComplete(s,a),{ok:!0,data:{completed:!0}})}async getDirectoryStats(s){if(!s)throw new Error("Path is required");return await this.safeCall(()=>this.client.getDirectoryStats(s),{ok:!0,data:{size:"0MB",files:0}})}async importAssets(s){if(!s||!Array.isArray(s))throw new Error("Items array is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).importAssets)==null?void 0:r.call(a,s)},{ok:!0,data:{imported:s.length,failed:0}})}async startDownload(s){if(!s||!Array.isArray(s)||s.length===0)throw new Error("Valid items array is required");return await this.client.startDownload(s)}async getDownloadStatus(s){if(!s)throw new Error("Job ID is required");return await this.client.getDownloadStatus(s)}async getDownloaderStatus(){console.log("📡 [endpoints] Requesting downloader status...");try{const s=await this.client.getDownloaderStatus();return console.log("✅ [endpoints] Downloader status received:",s),this.normalizeResponse(s)}catch(s){throw console.error("❌ [endpoints] Downloader status failed:",s),s}}async getCatalogForDownload(){return await this.getCatalog()}async getUserProfile(){return await this.safeCall(()=>this.client.getUserProfile(),{ok:!0,data:{name:"Test User",email:"test@example.com",role:"admin"}})}async getUsers(s={}){return this.safeCall(async()=>{const a=new URLSearchParams;s.q&&a.set("q",String(s.q)),s.page&&a.set("page",String(s.page)),s.limit&&a.set("limit",String(s.limit));const r=`/api/users${a.toString()?`?${a.toString()}`:""}`,n=await fetch(r);if(!n.ok)throw new Error("Failed to get users");const l=await n.json();return Kt.toArray(l)},{ok:!0,data:[]})}async createUser(s){if(!s||!s.email)throw new Error("User data with email is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).createUser)==null?void 0:r.call(a,s)},{ok:!0,data:{id:`user-${Date.now()}`,...s,createdAt:new Date().toISOString()}})}async updateUser(s,a){if(!s||!a)throw new Error("User ID and data are required");return await this.safeCall(()=>{var r,n;return(n=(r=this.client).updateUser)==null?void 0:n.call(r,s,a)},{ok:!0,data:{id:s,...a}})}async deleteUser(s){if(!s)throw new Error("User ID is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).deleteUser)==null?void 0:r.call(a,s)},{ok:!0,message:`User ${s} deleted`})}async getAnalysisMetrics(s="accuracy",a="7d"){const r=await this.safeCall(()=>this.client.getAnalysisMetrics(s,a),{ok:!0,data:[]});return r&&typeof r=="object"?Array.isArray(r)?{ok:!0,data:r}:r.ok!==void 0?r:{ok:!0,data:r}:{ok:!0,data:[]}}async getSystemMetrics(){return await this.safeCall(()=>{var s,a;return(a=(s=this.client).getSystemMetrics)==null?void 0:a.call(s)},{ok:!0,data:{}})}async getRecentActivities(s=20){return await this.safeCall(()=>this.client.getRecentActivities(s),{ok:!0,data:[]})}async getMenuCounts(){return await this.safeCall(()=>{var s,a;return(a=(s=this.client).getMenuCounts)==null?void 0:a.call(s)},{ok:!0,data:{pendingDownloads:0,activeTrainings:0,systemAlerts:0,newModels:0}})}async getExports(){const s=await this.safeCall(()=>{var a,r;return(r=(a=this.client).getExports)==null?void 0:r.call(a)},{ok:!0,data:[]});return Array.isArray(s)?{ok:!0,data:s}:s&&Array.isArray(s.data)?s:s&&Array.isArray(s.items)?{ok:!0,data:s.items}:s&&Array.isArray(s.results)?{ok:!0,data:s.results}:{ok:!0,data:[]}}async createExport(s){if(!s)throw new Error("Export data is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).createExport)==null?void 0:r.call(a,s)},{ok:!0,data:{id:`export-${Date.now()}`,...s,status:"processing"}})}async downloadExport(s){if(!s)throw new Error("Export ID is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).downloadExport)==null?void 0:r.call(a,s)},{ok:!0,data:new Blob(["Mock export data"],{type:"application/zip"})})}async deleteExport(s){if(!s)throw new Error("Export ID is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).deleteExport)==null?void 0:r.call(a,s)},{ok:!0,message:`Export ${s} deleted`})}async getHuggingFaceModels(s=50){return await this.safeCall(()=>{var a,r;return(r=(a=this.client).getHuggingFaceModels)==null?void 0:r.call(a,s)},{ok:!0,data:{models:[]}})}async getPersianHuggingFaceModels(s=30){return await this.safeCall(()=>{var a,r;return(r=(a=this.client).getPersianHuggingFaceModels)==null?void 0:r.call(a,s)},{ok:!0,data:{models:[]}})}async searchHuggingFaceModels(s){return await this.safeCall(()=>{var a,r;return(r=(a=this.client).searchHuggingFaceModels)==null?void 0:r.call(a,s)},{ok:!0,data:{models:[]}})}async downloadHuggingFaceModel(s,a="transformer"){if(!s)throw new Error("Model ID is required");return await this.startHfDownload(s,"models/huggingface")}async checkHuggingFaceHealth(){return await this.safeCall(()=>{var s,a;return(a=(s=this.client).checkHuggingFaceHealth)==null?void 0:a.call(s)},{ok:!0,data:{status:"connected",modelsAvailable:0}})}async getTTSModels(){return await this.safeCall(()=>{var s,a;return(a=(s=this.client).getTTSModels)==null?void 0:a.call(s)},{ok:!0,data:[]})}async startUrlDownload(s){if(!s||!Array.isArray(s))throw new Error("Items array is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).startUrlDownload)==null?void 0:r.call(a,s)},{ok:!1,error:"URL download not available"})}async getUrlStatus(s){if(!s)throw new Error("Job ID is required");return await this.safeCall(()=>{var a,r;return(r=(a=this.client).getUrlStatus)==null?void 0:r.call(a,s)},{ok:!1,error:"URL status not available"})}}const me=new Kt(Ee);function Uo({currentPage:t,onPageChange:s}){const[a,r]=c.useState(!1),[n,l]=c.useState(!1),[i,p]=c.useState(!1),[o,u]=c.useState("desktop"),[d,x]=c.useState(!1),[h,j]=c.useState(65),[m,N]=c.useState({models:0,training:0,datasets:0,tts:0,users:0,exports:0}),f=c.useMemo(()=>[{id:"dashboard",label:"داشبورد",icon:Jn,category:"main",badge:null},{id:"models",label:"مدل‌ها",icon:Ne,category:"main",badge:m.models>0?String(m.models):null},{id:"training",label:"آموزش",icon:rs,category:"main",badge:m.training>0?String(m.training):null},{id:"analysis",label:"آنالیز",icon:qs,category:"tools",badge:null},{id:"exports",label:"خروجی‌ها",icon:es,category:"tools",badge:m.exports>0?String(m.exports):null},{id:"users",label:"کاربران",icon:ai,category:"system",badge:m.users>0?String(m.users):null},{id:"kitchen",label:"آشپزخانه",icon:lt,category:"system",badge:null},{id:"settings",label:"تنظیمات",icon:Ds,category:"system",badge:null},{id:"logout",label:"خروج",icon:Vn,category:"system",badge:null}],[m]),M=c.useMemo(()=>({main:"منو اصلی",tools:"ابزارهای تحلیل",system:"مدیریت سیستم"}),[]);c.useEffect(()=>{const O=async()=>{try{const E=await me.getMenuCounts();E&&E.ok&&E.data?N(E.data):N({models:0,training:0,datasets:0,tts:0,users:0,exports:0})}catch(E){console.error("Error loading menu counts:",E),N({models:0,training:0,datasets:0,tts:0,users:0,exports:0})}};O();const q=setInterval(O,3e4);return()=>clearInterval(q)},[]),c.useEffect(()=>{const O=()=>{const k=window.innerWidth;k<=480?(u("mobile"),p(!0),r(!0)):k<=768?(u("tablet"),p(!0),r(!0)):k<=1024?(u("laptop"),p(!1),r(!1)):(u("desktop"),p(!1),r(!1)),x("ontouchstart"in window||navigator.maxTouchPoints>0)};O();let q;const E=()=>{clearTimeout(q),q=setTimeout(O,150)};return window.addEventListener("resize",E),()=>{window.removeEventListener("resize",E),clearTimeout(q)}},[]),c.useEffect(()=>{const O=()=>{const E=Math.random()*30+20,k=Math.random()*40+30,P=Math.random()*25+15,g=Math.max(10,100-(E+k+P)/3);j(g)};O();const q=setInterval(O,Math.random()*2e3+2e3);return()=>{clearInterval(q)}},[]);const J=c.useCallback(O=>{try{window.location.hash=`#tab=${O}`}catch(q){console.debug("hash update failed",q)}s&&s("models")},[s]),$=c.useCallback(O=>{if(O==="logout"){console.log("خروج از سیستم");return}["datasets","tts","huggingface"].includes(O)?J(O):s(O),i&&setTimeout(()=>l(!1),100)},[s,i,J]),Z=c.useCallback(()=>{i?l(!n):r(!a)},[i,n,a]),G=()=>{switch(o){case"mobile":return e.jsx(Yn,{size:16});case"tablet":return e.jsx(ei,{size:16});case"laptop":return e.jsx(ia,{size:16});default:return e.jsx(ia,{size:16})}};return e.jsxs(e.Fragment,{children:[i&&e.jsxs("button",{className:`mobile-menu-toggle ${d?"touch-device":""}`,onClick:Z,"aria-label":"باز کردن منو","aria-expanded":n,children:[e.jsx("div",{className:"hamburger-icon",children:n?e.jsx(Ja,{size:24}):e.jsx(Gn,{size:24})}),e.jsx("span",{className:"device-indicator",children:G()})]}),i&&n&&e.jsx("div",{className:"mobile-overlay",onClick:()=>l(!1),"aria-hidden":"true"}),e.jsxs("nav",{className:`app-sidebar sidebar ${a?"collapsed":""} ${i?"mobile":""} ${n?"mobile-open":""} ${o} ${d?"touch-device":""}`,role:"navigation","aria-label":"منوی اصلی",children:[e.jsxs("div",{className:"sidebar-header",children:[e.jsxs("div",{className:"logo-section",children:[e.jsxs("div",{className:"logo-box",children:[e.jsx("div",{className:"logo-icon",children:e.jsx(Ne,{size:24})}),e.jsx("div",{className:"logo-glow"})]}),!a&&e.jsxs("div",{className:"logo-content",children:[e.jsx("div",{className:"logo-title",children:"Persian AI"}),e.jsx("div",{className:"logo-subtitle",children:"سیستم آموزش مدل‌های فارسی"}),e.jsxs("div",{className:"device-info",children:[G(),e.jsx("span",{children:o==="mobile"?"موبایل":o==="tablet"?"تبلت":o==="laptop"?"لپ‌تاپ":"دسکتاپ"})]})]})]}),!i&&e.jsx("button",{className:"sidebar-toggle-btn",onClick:Z,"aria-label":a?"باز کردن منو":"بستن منو",title:a?"باز کردن منو":"بستن منو",children:a?e.jsx(Gs,{size:20}):e.jsx(ks,{size:20})})]}),e.jsx("div",{className:"menu-container",children:Object.entries(M).map(([O,q])=>e.jsxs("div",{className:"menu-section sidebar-section",children:[!a&&e.jsxs("div",{className:"menu-category sidebar-section-title",children:[e.jsx("span",{className:"category-label",children:q}),e.jsx("div",{className:"category-line"})]}),e.jsx("div",{className:"menu-items",children:f.filter(E=>E.category===O).map(E=>{const k=E.icon,P=t===E.id;return e.jsxs("button",{className:`menu-item sidebar-item ${P?"active":""} ${d?"touch-device":""}`,onClick:()=>$(E.id),title:E.label,"aria-label":E.label,"aria-current":P?"page":void 0,children:[e.jsxs("span",{className:"menu-icon sidebar-item-icon",children:[e.jsx(k,{size:18}),P&&e.jsx("div",{className:"active-indicator"})]}),!a&&e.jsxs("div",{className:"menu-content",children:[e.jsx("span",{className:"menu-label sidebar-item-text",children:E.label}),E.badge&&e.jsx("span",{className:"menu-badge",children:E.badge})]}),a&&E.badge&&e.jsx("span",{className:"menu-badge-collapsed",children:E.badge})]},E.id)})})]},O))}),e.jsxs("div",{className:"sidebar-footer",children:[!a&&e.jsxs("div",{className:"system-info",children:[e.jsxs("div",{className:"status-section",children:[e.jsxs("div",{className:"status-indicator online",children:[e.jsx("div",{className:"status-dot"}),e.jsx("span",{children:"سیستم آنلاین"})]}),e.jsxs("div",{className:"device-status",children:[G(),e.jsx("span",{children:o==="mobile"?"موبایل":o==="tablet"?"تبلت":o==="laptop"?"لپ‌تاپ":"دسکتاپ"})]})]}),e.jsxs("div",{className:"quick-actions",children:[e.jsx("button",{className:"quick-action-btn",title:"جستجو در سیستم","aria-label":"جستجو",children:e.jsx(Je,{size:16})}),e.jsxs("button",{className:"quick-action-btn",title:"اعلان‌های سیستم","aria-label":"اعلان‌ها",children:[e.jsx(Rt,{size:16}),e.jsx("span",{className:"notification-count",children:"3"})]}),e.jsx("button",{className:"quick-action-btn",title:"فعالیت سیستم","aria-label":"فعالیت",children:e.jsx(Pe,{size:16})})]})]}),a&&e.jsxs("div",{className:"collapsed-footer",children:[e.jsx("div",{className:"status-dot-mini"}),e.jsxs("div",{className:"quick-actions-mini",children:[e.jsx("button",{className:"quick-action-mini",title:"جستجو",children:e.jsx(Je,{size:14})}),e.jsx("button",{className:"quick-action-mini",title:"اعلان‌ها",children:e.jsx(Rt,{size:14})})]})]})]})]})]})}function Oo({isVisible:t,onToggle:s}){const[a,r]=c.useState([]),[n,l]=c.useState(!1);c.useEffect(()=>{if(!n)return;const x=window.fetch;return window.fetch=async(...h)=>{var N,f;const j=Date.now(),m=h[0];try{const M=await x(...h),$=Date.now()-j;return i({id:Date.now()+Math.random(),url:typeof m=="string"?m:m.toString(),method:((N=h[1])==null?void 0:N.method)||"GET",status:M.status,duration:$,success:M.ok,timestamp:new Date}),M}catch(M){const $=Date.now()-j;throw i({id:Date.now()+Math.random(),url:typeof m=="string"?m:m.toString(),method:((f=h[1])==null?void 0:f.method)||"GET",status:0,duration:$,success:!1,error:M.message,timestamp:new Date}),M}},()=>{window.fetch=x}},[n]);const i=x=>{r(h=>[x,...h.slice(0,9)])},p=async x=>{try{const h=await fetch(x.url,{method:x.method,headers:{"Content-Type":"application/json"}});i({id:Date.now()+Math.random(),...x,status:h.status,success:h.ok,timestamp:new Date})}catch(h){i({id:Date.now()+Math.random(),...x,status:0,success:!1,error:h.message,timestamp:new Date})}},o=x=>{try{const h=new URL(x,window.location.origin);return h.pathname+h.search}catch{return x}},u=x=>x<1e3?`${x}ms`:`${(x/1e3).toFixed(1)}s`,d=x=>x.toLocaleTimeString("fa-IR",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"});return n?e.jsxs(e.Fragment,{children:[e.jsxs("button",{className:`monitor-dock ${t?"active":""}`,onClick:s,title:t?"مخفی کردن مانیتور شبکه":"نمایش مانیتور شبکه",children:[e.jsx(Pe,{className:"w-4 h-4"}),a.length>0&&e.jsx("span",{className:"call-count",children:a.length})]}),t&&e.jsxs("div",{className:"network-monitor-dock",children:[e.jsxs("div",{className:"monitor-header",children:[e.jsx("h3",{children:"مانیتور شبکه"}),e.jsx("button",{onClick:()=>l(!1),className:"close-button",children:"×"})]}),e.jsx("div",{className:"api-calls-list",children:a.length===0?e.jsx("p",{className:"no-calls",children:"هیچ درخواست API ثبت نشده"}):a.map(x=>e.jsxs("div",{className:"api-call-item",children:[e.jsxs("div",{className:"api-call-info",children:[e.jsxs("div",{className:"api-call-url",children:[e.jsx("span",{className:"method-badge",children:x.method}),e.jsx("span",{className:"url-text",children:o(x.url)})]}),e.jsxs("div",{className:"api-call-meta",children:[e.jsx("span",{className:"api-call-time",children:d(x.timestamp)}),e.jsx("span",{className:"api-call-duration",children:u(x.duration)})]})]}),e.jsxs("div",{className:"api-call-status",children:[x.success?e.jsx(ke,{className:"w-4 h-4 text-green-500"}):e.jsx(us,{className:"w-4 h-4 text-red-500"}),!x.success&&e.jsx("button",{onClick:()=>p(x),className:"retry-button",style:{background:"none",border:"none",cursor:"pointer",padding:"0.25rem"},title:"تلاش مجدد",children:e.jsx(Fe,{className:"w-3 h-3"})})]})]},x.id))}),e.jsx("div",{className:"monitor-footer",children:e.jsxs("small",{children:[a.filter(x=>!x.success).length," خطا از ",a.length," درخواست"]})})]})]}):null}function gr(){const[t,s]=c.useState("unknown"),[a,r]=c.useState(0),[n,l]=c.useState([]),[i,p]=c.useState(!1);c.useEffect(()=>{const u=async()=>{const x=Date.now();try{const h=await me.checkHealth(),m=Date.now()-x;r(m),s(h.ok?"healthy":"unhealthy")}catch{s("unhealthy"),r(0)}};u();const d=setInterval(u,1e4);return()=>clearInterval(d)},[]);const o=()=>{switch(t){case"healthy":return"#10b981";case"unhealthy":return"#ef4444";default:return"#6b7280"}};return e.jsxs("div",{className:"monitoring-strip",children:[e.jsxs("div",{className:"monitoring-content",children:[e.jsxs("div",{className:"health-status",children:[e.jsx("div",{className:"health-dot",style:{backgroundColor:o()}}),e.jsx("span",{className:"health-text",children:t==="healthy"?"آنلاین":t==="unhealthy"?"آفلاین":"نامشخص"}),a>0&&e.jsxs("span",{className:"latency-text",children:[a,"ms"]})]}),!1,e.jsx("button",{className:"monitoring-toggle",onClick:()=>p(!i),title:i?"مخفی کردن":"نمایش جزئیات",children:e.jsx(ve,{size:14})})]}),i&&e.jsxs("div",{className:"monitoring-details",children:[e.jsxs("div",{className:"detail-item",children:[e.jsx("span",{children:"وضعیت:"}),e.jsx("span",{style:{color:o()},children:t==="healthy"?"سالم":t==="unhealthy"?"مشکل":"نامشخص"})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("span",{children:"تأخیر:"}),e.jsxs("span",{children:[a,"ms"]})]}),n.length>0&&e.jsxs("div",{className:"detail-item",children:[e.jsx("span",{children:"درخواست‌های اخیر:"}),e.jsx("span",{children:n.length})]})]})]})}class Io extends Vs.Component{constructor(a){super(a);tt(this,"handleRetry",()=>{this.setState(a=>({hasError:!1,error:null,errorInfo:null,retryCount:a.retryCount+1}))});tt(this,"handleReload",()=>{window.location.reload()});tt(this,"handleGoHome",()=>{window.location.href="/"});this.state={hasError:!1,error:null,errorInfo:null,retryCount:0}}static getDerivedStateFromError(a){return{hasError:!0,error:a}}componentDidCatch(a,r){console.error("Error caught by boundary:",a,r),this.setState({error:a,errorInfo:r}),window.gtag&&window.gtag("event","exception",{description:a.toString(),fatal:!1})}render(){var a,r,n;if(this.state.hasError){const{error:l,retryCount:i}=this.state,p=((a=l==null?void 0:l.message)==null?void 0:a.includes("network"))||((r=l==null?void 0:l.message)==null?void 0:r.includes("fetch"))||((n=l==null?void 0:l.message)==null?void 0:n.includes("connection"));return e.jsxs("div",{className:"error-boundary-container",children:[e.jsxs("div",{className:"error-boundary-content",children:[e.jsx("div",{className:"error-icon",children:e.jsx(_s,{size:64})}),e.jsxs("div",{className:"error-content",children:[e.jsx("h1",{className:"error-title",children:p?"مشکل اتصال":"خطای غیرمنتظره"}),e.jsx("p",{className:"error-description",children:p?"نمی‌توانیم به سرور متصل شویم. لطفاً اتصال اینترنت خود را بررسی کنید.":"متأسفانه خطایی رخ داده است. لطفاً صفحه را دوباره بارگذاری کنید."}),!1,e.jsxs("div",{className:"error-actions",children:[e.jsxs("button",{onClick:this.handleRetry,className:"error-btn error-btn-primary",disabled:i>=3,children:[e.jsx(Fe,{size:18}),"تلاش مجدد",i>0&&` (${i}/3)`]}),e.jsxs("button",{onClick:this.handleReload,className:"error-btn error-btn-secondary",children:[e.jsx(Fe,{size:18}),"بارگذاری مجدد صفحه"]}),e.jsxs("button",{onClick:this.handleGoHome,className:"error-btn error-btn-outline",children:[e.jsx(Bn,{size:18}),"بازگشت به صفحه اصلی"]})]}),i>=3&&e.jsxs("div",{className:"error-limit-reached",children:[e.jsx("p",{children:"تعداد تلاش‌های مجدد به حد مجاز رسیده است."}),e.jsx("p",{children:"لطفاً صفحه را دوباره بارگذاری کنید یا با پشتیبانی تماس بگیرید."})]})]})]}),e.jsx("style",{children:`
            .error-boundary-container {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%);
              padding: 20px;
              font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              direction: rtl;
            }

            .error-boundary-content {
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 600px;
              width: 100%;
              border: 2px solid #fecaca;
            }

            .error-icon {
              color: #ef4444;
              margin-bottom: 24px;
              animation: pulse 2s infinite;
            }

            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }

            .error-title {
              font-size: 28px;
              font-weight: 700;
              color: #1f2937;
              margin: 0 0 16px 0;
            }

            .error-description {
              font-size: 16px;
              color: #6b7280;
              line-height: 1.6;
              margin: 0 0 32px 0;
            }

            .error-details {
              margin: 24px 0;
              text-align: right;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              overflow: hidden;
            }

            .error-details-summary {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 12px 16px;
              background: #f9fafb;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              color: #374151;
              border-bottom: 1px solid #e5e7eb;
            }

            .error-details-content {
              padding: 16px;
              background: #fefefe;
            }

            .error-stack {
              font-size: 12px;
              color: #374151;
              background: #f3f4f6;
              padding: 12px;
              border-radius: 8px;
              overflow-x: auto;
              white-space: pre-wrap;
              text-align: left;
              direction: ltr;
            }

            .error-actions {
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-top: 32px;
            }

            .error-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px 24px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.2s;
              border: none;
            }

            .error-btn:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            .error-btn-primary {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .error-btn-primary:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
            }

            .error-btn-secondary {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }

            .error-btn-secondary:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
            }

            .error-btn-outline {
              background: white;
              color: #374151;
              border: 2px solid #e5e7eb;
            }

            .error-btn-outline:hover {
              background: #f9fafb;
              border-color: #d1d5db;
            }

            .error-limit-reached {
              margin-top: 24px;
              padding: 16px;
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 12px;
              color: #92400e;
            }

            .error-limit-reached p {
              margin: 0 0 8px 0;
              font-size: 14px;
            }

            .error-limit-reached p:last-child {
              margin-bottom: 0;
            }

            @media (max-width: 768px) {
              .error-boundary-content {
                padding: 24px;
                margin: 16px;
              }

              .error-title {
                font-size: 24px;
              }

              .error-actions {
                gap: 10px;
              }

              .error-btn {
                padding: 10px 20px;
                font-size: 13px;
              }
            }
          `})]})}return this.props.children}}const Re=(t,s=0)=>{const a=Number(t);return Number.isFinite(a)?a:s},He=(t,s=0,a=100)=>{const r=Re(t,s);return Math.min(a,Math.max(s,r))},Le=(t,s="—")=>t===0?"0":t===!1?"false":t===!0?"true":t==null||typeof t=="number"&&!Number.isFinite(t)?s:String(t),Ho=()=>{const[t,s]=c.useState([]),[a,r]=c.useState(!0),[n,l]=c.useState(new Map);c.useEffect(()=>(i(),()=>{n.forEach(h=>{h.close()})}),[]);const i=async()=>{try{r(!0);const h=await me.get("/lifecycle/jobs?status=running");if(h!=null&&h.ok&&h.data){const j=h.data.jobs||[];s(Array.isArray(j)?j:[]),j.forEach(m=>{m!=null&&m.id&&!n.has(m.id)&&p(m.id)})}else console.warn("Failed to load active jobs:",(h==null?void 0:h.error)||"Unknown error"),s([])}catch(h){console.error("Error loading active jobs:",h),s([])}finally{r(!1)}},p=h=>{if(h)try{const j="http://localhost:30011",m=new EventSource(`${j}/api/lifecycle/jobs/${h}/stream`);m.onmessage=N=>{try{const f=JSON.parse(N.data);(f==null?void 0:f.type)==="job:updated"&&f.data&&s(M=>Array.isArray(M)?M.map(J=>(J==null?void 0:J.id)===h?{...J,...f.data}:J):[])}catch(f){console.error("Error parsing SSE data for job",h,f)}},m.onerror=N=>{console.warn("SSE connection lost for job",h),m.close(),l(f=>{const M=new Map(f);return M.delete(h),M})},l(N=>new Map(N).set(h,m))}catch(j){console.error("Error setting up SSE for job",h,j)}},o=async(h,j)=>{if(!(!h||!j))try{const m=await me.post(`/lifecycle/jobs/${h}/control`,{action:j});m!=null&&m.ok?console.log(`Job ${h} ${j} successful`):console.warn(`Failed to ${j} job ${h}:`,m==null?void 0:m.error)}catch(m){console.error(`Error ${j} job ${h}:`,m)}},u=h=>{switch(h){case"running":return e.jsx(Ts,{className:"w-4 h-4 text-green-500"});case"paused":return e.jsx(Js,{className:"w-4 h-4 text-yellow-500"});case"completed":return e.jsx(ke,{className:"w-4 h-4 text-blue-500"});case"failed":return e.jsx(us,{className:"w-4 h-4 text-red-500"});case"stopped":return e.jsx(mt,{className:"w-4 h-4 text-gray-500"});default:return e.jsx(ve,{className:"w-4 h-4 text-gray-400"})}},d=h=>{switch(h){case"running":return"bg-green-100 text-green-800 border-green-200";case"paused":return"bg-yellow-100 text-yellow-800 border-yellow-200";case"completed":return"bg-blue-100 text-blue-800 border-blue-200";case"failed":return"bg-red-100 text-red-800 border-red-200";case"stopped":return"bg-gray-100 text-gray-800 border-gray-200";default:return"bg-gray-100 text-gray-600 border-gray-200"}},x=h=>{if(!h)return"نامشخص";const j=new Date(h),N=new Date-j,f=Math.floor(N/6e4),M=Math.floor(f/60);return M>0?`${M}س ${f%60}د`:`${f}د`};return a?e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx(Pe,{className:"w-5 h-5 text-blue-600"}),e.jsx("h3",{className:"text-lg font-semibold text-gray-900",children:"کارهای فعال"})]}),e.jsx("div",{className:"animate-pulse space-y-3",children:[1,2,3].map(h=>e.jsx("div",{className:"h-16 bg-gray-100 rounded-lg"},h))})]}):e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(Pe,{className:"w-5 h-5 text-blue-600"}),e.jsx("h3",{className:"text-lg font-semibold text-gray-900",children:"کارهای فعال"}),e.jsx("span",{className:"bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full",children:t.length})]}),e.jsx("button",{onClick:i,className:"p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",children:e.jsx(Pe,{className:"w-4 h-4"})})]}),e.jsx("div",{className:"space-y-3",children:e.jsx(Be,{children:t.length===0?e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"text-center py-8 text-gray-500",children:[e.jsx(Ne,{className:"w-12 h-12 mx-auto mb-3 text-gray-300"}),e.jsx("p",{children:"هیچ کار فعالی در حال اجرا نیست"})]}):t.map(h=>{var j;return e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:"border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[u(h.status),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-gray-900",children:((j=h.config)==null?void 0:j.modelType)||"مدل نامشخص"}),e.jsxs("p",{className:"text-sm text-gray-500",children:["مرحله: ",h.stage||"نامشخص"]})]})]}),e.jsx("div",{className:"flex items-center gap-2",children:e.jsx("span",{className:`px-2 py-1 text-xs rounded-full border ${d(h.status)}`,children:h.status})})]}),h.progress>0&&e.jsxs("div",{className:"mb-3",children:[e.jsxs("div",{className:"flex justify-between text-sm text-gray-600 mb-1",children:[e.jsx("span",{children:"پیشرفت"}),e.jsxs("span",{children:[h.progress,"%"]})]}),e.jsx("div",{className:"w-full bg-gray-200 rounded-full h-2",children:e.jsx(z.div,{className:"bg-blue-600 h-2 rounded-full",initial:{width:0},animate:{width:`${h.progress}%`},transition:{duration:.5}})})]}),h.metrics&&Object.keys(h.metrics).length>0&&e.jsxs("div",{className:"grid grid-cols-2 gap-4 mb-3 text-sm",children:[h.metrics.epoch&&e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-500",children:"Epoch:"}),e.jsx("span",{className:"font-medium mr-1",children:h.metrics.epoch})]}),h.metrics.loss&&e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-500",children:"Loss:"}),e.jsx("span",{className:"font-medium mr-1",children:h.metrics.loss})]}),h.metrics.accuracy&&e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-500",children:"Accuracy:"}),e.jsx("span",{className:"font-medium mr-1",children:h.metrics.accuracy})]})]}),e.jsxs("div",{className:"flex items-center justify-between text-sm",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("span",{className:"text-gray-500",children:[e.jsx(ve,{className:"w-4 h-4 inline mr-1"}),x(h.startTime)]}),h.artifacts&&h.artifacts.length>0&&e.jsxs("span",{className:"text-gray-500",children:[e.jsx(rs,{className:"w-4 h-4 inline mr-1"}),h.artifacts.length," artifact"]})]}),h.status==="running"&&e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>o(h.id,"pause"),className:"p-1 text-yellow-600 hover:bg-yellow-50 rounded",title:"توقف موقت",children:e.jsx(Js,{className:"w-4 h-4"})}),e.jsx("button",{onClick:()=>o(h.id,"stop"),className:"p-1 text-red-600 hover:bg-red-50 rounded",title:"توقف کامل",children:e.jsx(mt,{className:"w-4 h-4"})})]}),h.status==="paused"&&e.jsx("button",{onClick:()=>o(h.id,"resume"),className:"p-1 text-green-600 hover:bg-green-50 rounded",title:"ادامه",children:e.jsx(Ts,{className:"w-4 h-4"})})]})]},h.id)})})})]})},Bo=({onNavigate:t})=>{const[s,a]=c.useState({}),r=[{id:"new-training",title:"شروع آموزش جدید",description:"آموزش مدل جدید با داده‌های خود",icon:Ne,color:"blue",action:()=>t?t("training"):window.location.hash="#training",estimated:"5-30 دقیقه"},{id:"download-model",title:"دانلود مدل",description:"دانلود مدل از Hugging Face",icon:Te,color:"green",action:()=>t?t("models"):window.location.hash="#models",estimated:"2-10 دقیقه"},{id:"upload-dataset",title:"آپلود داده",description:"آپلود مجموعه داده جدید",icon:Ms,color:"purple",action:()=>t?t("datasets"):window.location.hash="#datasets",estimated:"1-5 دقیقه"},{id:"analyze-model",title:"تحلیل مدل",description:"تحلیل عملکرد مدل‌های موجود",icon:Xs,color:"orange",action:()=>t?t("analysis"):window.location.hash="#analysis",estimated:"2-5 دقیقه"}],n=[{id:"text-classification",title:"طبقه‌بندی متن",description:"آموزش مدل برای طبقه‌بندی متون فارسی",icon:es,config:{modelType:"text-classification",architecture:"bert-base-multilingual",epochs:3,batchSize:16}},{id:"sentiment-analysis",title:"تحلیل احساسات",description:"تشخیص احساسات در متون فارسی",icon:Ne,config:{modelType:"sentiment-analysis",architecture:"bert-base-multilingual",epochs:5,batchSize:8}},{id:"ner",title:"تشخیص موجودیت",description:"شناسایی اسامی اشخاص، مکان‌ها و سازمان‌ها",icon:rs,config:{modelType:"token-classification",architecture:"bert-base-multilingual",epochs:4,batchSize:12}}],l=o=>{const u={blue:"bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",green:"bg-green-50 border-green-200 text-green-700 hover:bg-green-100",purple:"bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",orange:"bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100",gray:"bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"};return u[o]||u.gray},i=async o=>{a(u=>({...u,[o.id]:!0}));try{o.action&&await o.action()}catch(u){console.error("Error in quick action:",u),T.error("خطا در انجام عملیات")}finally{a(u=>({...u,[o.id]:!1}))}},p=async o=>{var u;if(o!=null&&o.id){a(d=>({...d,[o.id]:!0}));try{const d=await me.post("/lifecycle/jobs",{...o.config,templateId:o.id,datasetPath:"/datasets/sample.csv"});if(d!=null&&d.ok)T.success(`آموزش ${o.title} شروع شد`),t?t("training"):window.location.hash="#training";else{const x=(d==null?void 0:d.error)||"خطا در شروع آموزش";T.error(x),console.warn("Training start failed:",d)}}catch(d){console.error("Error starting template training:",d);const x=(u=d.message)!=null&&u.includes("fetch")?"خطا در اتصال به سرور":"خطا در شروع آموزش";T.error(x)}finally{a(d=>({...d,[o.id]:!1}))}}};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx(Ba,{className:"w-5 h-5 text-blue-600"}),e.jsx("h3",{className:"text-lg font-semibold text-gray-900",children:"شروع سریع"})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:r.map(o=>{const u=o.icon,d=s[o.id];return e.jsx(z.button,{whileHover:{scale:1.02},whileTap:{scale:.98},onClick:()=>i(o),disabled:d,className:`
                  p-4 rounded-lg border-2 text-right transition-all duration-200
                  ${l(o.color)}
                  ${d?"opacity-50 cursor-not-allowed":"cursor-pointer"}
                `,children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("h4",{className:"font-medium mb-1",children:o.title}),e.jsx("p",{className:"text-sm opacity-75 mb-2",children:o.description}),e.jsxs("div",{className:"flex items-center gap-2 text-xs",children:[e.jsx(ve,{className:"w-3 h-3"}),e.jsx("span",{children:o.estimated})]})]}),e.jsx("div",{className:"flex items-center gap-2",children:d?e.jsx("div",{className:"w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"}):e.jsxs(e.Fragment,{children:[e.jsx(u,{className:"w-5 h-5"}),e.jsx(ks,{className:"w-4 h-4"})]})})]})},o.id)})})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx(Ds,{className:"w-5 h-5 text-purple-600"}),e.jsx("h3",{className:"text-lg font-semibold text-gray-900",children:"قالب‌های آموزش"}),e.jsx("span",{className:"text-sm text-gray-500",children:"آموزش سریع با تنظیمات از پیش تعریف شده"})]}),e.jsx("div",{className:"space-y-3",children:n.map(o=>{const u=o.icon,d=s[o.id];return e.jsx(z.div,{whileHover:{scale:1.01},className:"border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"p-2 bg-gray-100 rounded-lg",children:e.jsx(u,{className:"w-5 h-5 text-gray-600"})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-1",children:o.title}),e.jsx("p",{className:"text-sm text-gray-600 mb-2",children:o.description}),e.jsxs("div",{className:"flex items-center gap-4 text-xs text-gray-500",children:[e.jsxs("span",{children:["Architecture: ",o.config.architecture]}),e.jsxs("span",{children:["Epochs: ",o.config.epochs]}),e.jsxs("span",{children:["Batch Size: ",o.config.batchSize]})]})]})]}),e.jsxs("button",{onClick:()=>p(o),disabled:d,className:`
                      px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                      transition-colors flex items-center gap-2
                      ${d?"opacity-50 cursor-not-allowed":""}
                    `,children:[d?e.jsx("div",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"}):e.jsx(Ts,{className:"w-4 h-4"}),e.jsx("span",{children:"شروع"})]})]})},o.id)})})]}),e.jsxs("div",{className:"bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx(ke,{className:"w-5 h-5 text-blue-600"}),e.jsx("h3",{className:"text-lg font-semibold text-gray-900",children:"خلاصه فعالیت‌ها"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-blue-600 mb-1",children:"12"}),e.jsx("div",{className:"text-sm text-gray-600",children:"آموزش تکمیل شده"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-green-600 mb-1",children:"8"}),e.jsx("div",{className:"text-sm text-gray-600",children:"مدل دانلود شده"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-purple-600 mb-1",children:"24"}),e.jsx("div",{className:"text-sm text-gray-600",children:"مجموعه داده"})]})]})]})]})},_o=()=>{var k,P,g,D,V,F,ne,X,I,ee,le,se,te,ce,S,Y;const[t,s]=c.useState([]),[a,r]=c.useState(null),[n,l]=c.useState([]),[i,p]=c.useState([]),[o,u]=c.useState(!1),[d,x]=c.useState(null),[h,j]=c.useState(null),m=c.useRef(null),N=c.useRef(0),f=3;c.useEffect(()=>{J(),$();const R=setInterval(()=>{o||J()},15e3);return()=>{m.current&&m.current.close(),clearInterval(R)}},[o,h]);const M=()=>({timestamp:new Date().toISOString(),system:{cpu:{usage:Math.random()*30+20},memory:{percentage:Math.random()*20+40}},network:{upload:Math.random()*1e3+100,download:Math.random()*5e3+500}}),J=async()=>{try{const[R,ae,de,A]=await Promise.allSettled([me.get("/monitoring/metrics?limit=50").catch(H=>({ok:!1,error:H.message})),me.get("/monitoring/logs?limit=20").catch(H=>({ok:!1,error:H.message})),me.get("/monitoring/alerts?limit=10").catch(H=>({ok:!1,error:H.message})),me.get("/monitoring/stats").catch(H=>({ok:!1,error:H.message}))]),v=R.status==="fulfilled"?R.value:null;if(v!=null&&v.ok&&v.data){const H=Array.isArray(v.data.metrics)?v.data.metrics:[];s(H),H.length>0&&r(H[H.length-1])}else{const H=M();r(H),s(ie=>Array.isArray(ie)?[...ie.slice(-10),H]:[H])}const K=ae.status==="fulfilled"?ae.value:null;K!=null&&K.ok&&K.data&&l(Array.isArray(K.data.logs)?K.data.logs:[]);const C=de.status==="fulfilled"?de.value:null;C!=null&&C.ok&&C.data&&p(Array.isArray(C.data.alerts)?C.data.alerts:[]);const _=A.status==="fulfilled"?A.value:null;_!=null&&_.ok&&_.data&&x(_.data||{})}catch(R){console.error("Error loading monitoring data:",R);const ae=M();r(ae),s(de=>Array.isArray(de)?[...de.slice(-10),ae]:[ae])}},$=()=>{if(N.current>=f){console.warn("Max SSE retry attempts reached. Monitoring will use polling fallback."),j("Connection failed after multiple attempts");return}try{m.current&&m.current.close();const R="http://localhost:3001",ae=new EventSource(`${R}/api/monitoring/stream`);m.current=ae,ae.onopen=()=>{u(!0),j(null),N.current=0,console.log("📊 Monitoring SSE connected")},ae.onmessage=de=>{try{const A=JSON.parse(de.data);switch(A.type){case"metrics":r(A.data),s(v=>[...v,A.data].slice(-50));break;case"log":l(v=>[A.data,...v].slice(0,20));break;case"alert":p(v=>[A.data,...v].slice(0,10));break}}catch(A){console.error("Error parsing SSE data:",A)}},ae.onerror=de=>{u(!1),N.current===0&&console.warn("SSE connection lost, switching to polling mode"),N.current+=1,m.current&&(m.current.close(),m.current=null),N.current>=f?j("Using polling mode (SSE unavailable)"):setTimeout(()=>{!m.current&&N.current<f&&$()},15e3)}}catch(R){console.error("Error setting up SSE:",R)}},Z=R=>{if(!R)return"0 B";const ae=1024,de=["B","KB","MB","GB"],A=Math.floor(Math.log(R)/Math.log(ae));return parseFloat((R/Math.pow(ae,A)).toFixed(2))+" "+de[A]},G=R=>`${Math.round(R||0)}%`,O=R=>{switch(R){case"critical":return"text-red-600 bg-red-50 border-red-200";case"warning":return"text-yellow-600 bg-yellow-50 border-yellow-200";case"info":return"text-blue-600 bg-blue-50 border-blue-200";default:return"text-gray-600 bg-gray-50 border-gray-200"}},q=R=>{switch(R){case"error":return"text-red-600";case"warning":return"text-yellow-600";case"info":return"text-blue-600";default:return"text-gray-600"}},E=t.map((R,ae)=>{var de,A,v,K,C,_;return{time:new Date(R.timestamp).toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit"}),cpu:((A=(de=R.system)==null?void 0:de.cpu)==null?void 0:A.usage)||0,memory:((K=(v=R.system)==null?void 0:v.memory)==null?void 0:K.percentage)||0,network_up:(((C=R.network)==null?void 0:C.upload)||0)/1024,network_down:(((_=R.network)==null?void 0:_.download)||0)/1024}});return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(Pe,{className:"w-5 h-5 text-blue-600"}),e.jsx("h3",{className:"text-lg font-semibold text-gray-900",children:"مانیتورینگ سیستم"}),e.jsxs("div",{className:`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${o?"bg-green-100 text-green-800":h?"bg-yellow-100 text-yellow-800":"bg-red-100 text-red-800"}`,children:[e.jsx("div",{className:`w-2 h-2 rounded-full ${o?"bg-green-500":h?"bg-yellow-500":"bg-red-500"}`}),o?"متصل (زنده)":h?"پولینگ (بازگشتی)":"در حال اتصال..."]}),h&&e.jsx("div",{className:"text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded",children:h})]}),e.jsxs("div",{className:"flex gap-2",children:[h&&e.jsx("button",{onClick:()=>{N.current=0,j(null),$()},className:"p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors",title:"تلاش مجدد برای اتصال زنده",children:e.jsx(qa,{className:"w-4 h-4"})}),e.jsx("button",{onClick:J,className:"p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",title:"بروزرسانی داده‌ها",children:e.jsx(Fe,{className:"w-4 h-4"})})]})]}),a&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"bg-white rounded-lg border border-gray-200 p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx(Jt,{className:"w-5 h-5 text-blue-600"}),e.jsx("span",{className:"text-2xl font-bold text-gray-900",children:G((P=(k=a.system)==null?void 0:k.cpu)==null?void 0:P.usage)})]}),e.jsx("div",{className:"text-sm text-gray-600",children:"پردازنده"}),e.jsxs("div",{className:"text-xs text-gray-500 mt-1",children:[(D=(g=a.system)==null?void 0:g.cpu)==null?void 0:D.cores," هسته"]})]}),e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.1},className:"bg-white rounded-lg border border-gray-200 p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx(hs,{className:"w-5 h-5 text-green-600"}),e.jsx("span",{className:"text-2xl font-bold text-gray-900",children:G((F=(V=a.system)==null?void 0:V.memory)==null?void 0:F.percentage)})]}),e.jsx("div",{className:"text-sm text-gray-600",children:"حافظه"}),e.jsxs("div",{className:"text-xs text-gray-500 mt-1",children:[Z((X=(ne=a.system)==null?void 0:ne.memory)==null?void 0:X.used)," / ",Z((ee=(I=a.system)==null?void 0:I.memory)==null?void 0:ee.total)]})]}),e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},className:"bg-white rounded-lg border border-gray-200 p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx(Ms,{className:"w-5 h-5 text-purple-600"}),e.jsx("span",{className:"text-2xl font-bold text-gray-900",children:Math.round((((le=a.network)==null?void 0:le.upload)||0)/1024)})]}),e.jsx("div",{className:"text-sm text-gray-600",children:"آپلود (MB/s)"})]}),e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},className:"bg-white rounded-lg border border-gray-200 p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx(Te,{className:"w-5 h-5 text-orange-600"}),e.jsx("span",{className:"text-2xl font-bold text-gray-900",children:Math.round((((se=a.network)==null?void 0:se.download)||0)/1024)})]}),e.jsx("div",{className:"text-sm text-gray-600",children:"دانلود (MB/s)"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[e.jsx("h4",{className:"text-lg font-semibold text-gray-900 mb-4",children:"پردازنده و حافظه"}),e.jsx(ys,{width:"100%",height:200,children:e.jsxs(Aa,{data:E,children:[e.jsx(js,{strokeDasharray:"3 3"}),e.jsx(bs,{dataKey:"time"}),e.jsx(cs,{domain:[0,100]}),e.jsx(vs,{}),e.jsx(Bs,{}),e.jsx(Hs,{type:"monotone",dataKey:"cpu",stroke:"#3B82F6",strokeWidth:2,name:"پردازنده (%)"}),e.jsx(Hs,{type:"monotone",dataKey:"memory",stroke:"#10B981",strokeWidth:2,name:"حافظه (%)"})]})})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[e.jsx("h4",{className:"text-lg font-semibold text-gray-900 mb-4",children:"شبکه"}),e.jsx(ys,{width:"100%",height:200,children:e.jsxs(Bt,{data:E,children:[e.jsx(js,{strokeDasharray:"3 3"}),e.jsx(bs,{dataKey:"time"}),e.jsx(cs,{}),e.jsx(vs,{}),e.jsx(Bs,{}),e.jsx(zs,{type:"monotone",dataKey:"network_up",stackId:"1",stroke:"#8B5CF6",fill:"#8B5CF6",name:"آپلود (MB/s)"}),e.jsx(zs,{type:"monotone",dataKey:"network_down",stackId:"1",stroke:"#F59E0B",fill:"#F59E0B",name:"دانلود (MB/s)"})]})})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("h4",{className:"text-lg font-semibold text-gray-900",children:"هشدارها"}),e.jsx("span",{className:"bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full",children:i.length})]}),e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto",children:e.jsx(Be,{children:i.length===0?e.jsxs("div",{className:"text-center py-8 text-gray-500",children:[e.jsx(_s,{className:"w-12 h-12 mx-auto mb-3 text-gray-300"}),e.jsx("p",{children:"هیچ هشداری وجود ندارد"})]}):i.map(R=>e.jsx(z.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},exit:{opacity:0,x:20},className:`p-3 rounded-lg border ${O(R.level)}`,children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"font-medium",children:R.message}),e.jsx("p",{className:"text-xs opacity-75 mt-1",children:new Date(R.timestamp).toLocaleString("fa-IR")})]}),e.jsx("span",{className:"text-xs font-medium",children:R.value})]})},R.id))})})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("h4",{className:"text-lg font-semibold text-gray-900",children:"لاگ‌ها"}),e.jsx("span",{className:"bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full",children:n.length})]}),e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto",children:e.jsx(Be,{children:n.length===0?e.jsxs("div",{className:"text-center py-8 text-gray-500",children:[e.jsx(Ss,{className:"w-12 h-12 mx-auto mb-3 text-gray-300"}),e.jsx("p",{children:"هیچ لاگی وجود ندارد"})]}):n.map(R=>e.jsx(z.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},className:"p-2 border-l-4 border-gray-200 bg-gray-50 rounded",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:`text-sm font-medium ${q(R.level)}`,children:R.message}),e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:new Date(R.timestamp).toLocaleString("fa-IR")})]}),e.jsx("span",{className:`text-xs px-2 py-1 rounded ${q(R.level)} bg-opacity-10`,children:R.level})]})},R.id))})})]})]}),d&&e.jsxs("div",{className:"bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6",children:[e.jsx("h4",{className:"text-lg font-semibold text-gray-900 mb-4",children:"آمار مانیتورینگ"}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-blue-600 mb-1",children:((te=d.metrics)==null?void 0:te.total)||0}),e.jsx("div",{className:"text-sm text-gray-600",children:"کل متریک‌ها"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-green-600 mb-1",children:((ce=d.logs)==null?void 0:ce.total)||0}),e.jsx("div",{className:"text-sm text-gray-600",children:"کل لاگ‌ها"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-red-600 mb-1",children:((S=d.alerts)==null?void 0:S.total)||0}),e.jsx("div",{className:"text-sm text-gray-600",children:"کل هشدارها"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-purple-600 mb-1",children:((Y=d.connections)==null?void 0:Y.sse)||0}),e.jsx("div",{className:"text-sm text-gray-600",children:"اتصالات فعال"})]})]})]})]})},Sa=({onNavigate:t})=>{var ce;const[s,a]=c.useState(!0),[r,n]=c.useState(!1),[l,i]=c.useState(null),[p,o]=c.useState(null),[u,d]=c.useState(null),[x,h]=c.useState([]),[j,m]=c.useState([]),[N,f]=c.useState([]),[M,J]=c.useState([]),[$,Z]=c.useState(new Date),[G,O]=c.useState(1),q=5,E=c.useRef(null),k=c.useRef(null),P=c.useCallback(async()=>{var S,Y;try{a(!0);const[R,ae,de,A]=await Promise.all([me.checkHealth().catch(()=>({ok:!1})),me.getAnalysisMetrics("accuracy","7d").catch(_=>(console.warn("⚠️ Analysis metrics failed, using fallback:",_),{ok:!0,data:[]})),me.getModels().catch(()=>({ok:!1})),me.getTrainingJobs().catch(()=>({ok:!1}))]),v={activeModels:de.ok&&((S=de.data)==null?void 0:S.length)||0,totalModels:de.ok&&((Y=de.data)==null?void 0:Y.length)||0,datasetCount:5,completedTrainings:12,failedTrainings:1};i(v),o(R.ok?R.data:null);const K=de.ok?de.data||[]:[];m(Array.isArray(K)?K:[]);const C=A.ok?A.data||[]:[];f(Array.isArray(C)?C:[]),h([{id:1,type:"training",message:"شروع آموزش مدل جدید",timestamp:new Date},{id:2,type:"complete",message:"آموزش مدل با موفقیت تکمیل شد",timestamp:new Date(Date.now()-3e5)},{id:3,type:"download",message:"دانلود مدل از Hugging Face",timestamp:new Date(Date.now()-6e5)}]),Z(new Date)}catch(R){console.error("خطا در بارگذاری داشبورد:",R),T.error("خطا در بارگذاری اطلاعات داشبورد"),m([]),f([]),i({activeModels:0,totalModels:0,datasetCount:0,completedTrainings:0,failedTrainings:0})}finally{a(!1)}},[]),g=c.useCallback(async()=>{try{const S={cpu:Math.random()*70+20,memory:Math.random()*60+30,gpu:Math.random()*80+10};d(S),J(Y=>[...Y.slice(-29),{time:new Date().toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit"}),cpu:S.cpu,memory:S.memory,gpu:S.gpu,disk:Math.random()*50+20}])}catch(S){console.error("خطا در بارگذاری معیارها:",S)}},[]),D=async()=>{n(!0),await P(),await g(),n(!1),T.success("داشبورد به‌روزرسانی شد")},V=()=>{const S=document.getElementById("recent-activities");if(S){S.scrollIntoView({behavior:"smooth",block:"start"});const Y=S.querySelector('h2, h3, [role="heading"]');Y&&setTimeout(()=>{var R;return(R=Y.focus)==null?void 0:R.call(Y)},350)}};c.useEffect(()=>{P();const S=setInterval(()=>{var R;(R=k.current)==null||R.call(k)},5e3),Y=setInterval(()=>{var R;(R=E.current)==null||R.call(E)},3e4);return()=>{clearInterval(S),clearInterval(Y)}},[]),c.useEffect(()=>{E.current=P,k.current=g},[P,g]);const F=S=>{if(!S)return"نامشخص";const Y=new Date,R=new Date(S),ae=Y-R,de=Math.floor(ae/6e4),A=Math.floor(ae/36e5),v=Math.floor(ae/864e5);return de<1?"اکنون":de<60?`${de} دقیقه پیش`:A<24?`${A} ساعت پیش`:`${v} روز پیش`};if(s)return e.jsx("div",{className:"dashboard-loading",children:e.jsxs("div",{className:"loading-content",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{children:"در حال بارگذاری داشبورد..."})]})});const ne=Re(l==null?void 0:l.activeModels,0),X=Re(l==null?void 0:l.totalModels,0),I=Re(l==null?void 0:l.datasetCount,0),ee=Re(l==null?void 0:l.completedTrainings,0),le=Re(l==null?void 0:l.failedTrainings,0),se=ee+le,te=se>0?Re(ee/se*100,0).toFixed(1):"0.0";return e.jsxs("div",{className:"unified-dashboard",children:[e.jsx(z.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},className:"dashboard-header",children:e.jsxs("div",{className:"header-content",children:[e.jsxs("div",{className:"header-left",children:[e.jsx("div",{className:"header-icon",children:e.jsx(Pe,{size:32})}),e.jsxs("div",{className:"header-text",children:[e.jsx("h1",{children:"داشبورد مدیریت"}),e.jsx("p",{children:"سیستم آموزش مدل‌های هوش مصنوعی فارسی"}),e.jsxs("small",{children:["آخرین بروزرسانی: ",$.toLocaleTimeString("fa-IR")]})]})]}),e.jsxs(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:D,className:"refresh-button",disabled:r,children:[e.jsx(Fe,{className:r?"spinning":"",size:18}),e.jsx("span",{children:r?"بروزرسانی...":"بروزرسانی"})]})]})}),e.jsx("div",{className:"kpi-grid",children:[{title:"مدل‌های فعال",value:Le(ne),total:X,icon:Ne,color:"purple",trend:"+12%",trendUp:!0,description:"مدل‌های در حال استفاده"},{title:"دیتاست‌ها",value:Le(I),total:null,icon:Qe,color:"blue",trend:"+5%",trendUp:!0,description:"مجموعه داده‌های آماده"},{title:"آموزش‌های موفق",value:Le(ee),total:`${Le(te)}%`,icon:ke,color:"green",trend:"+8%",trendUp:!0,description:"نرخ موفقیت آموزش"},{title:"آموزش‌های جاری",value:Le(Re(Array.isArray(N)?N.length:0)),total:"فعال",icon:rs,color:"orange",trend:"0%",trendUp:!1,description:"آموزش‌های در حال اجرا"}].map((S,Y)=>e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:Y*.1},className:`kpi-card kpi-${S.color}`,children:[e.jsxs("div",{className:"kpi-header",children:[e.jsx("div",{className:"kpi-icon",children:e.jsx(S.icon,{size:20})}),e.jsxs("div",{className:`kpi-trend ${S.trendUp?"up":"neutral"}`,children:[e.jsx(Ie,{size:12,style:S.trendUp?{}:{transform:"rotate(90deg)"}}),e.jsx("span",{children:S.trend})]})]}),e.jsxs("div",{className:"kpi-content",children:[e.jsxs("div",{className:"kpi-value-row",children:[e.jsx("h3",{className:"kpi-value",children:S.value}),S.total!==null&&S.total!==void 0&&e.jsx("span",{className:"kpi-total",children:Le(S.total)})]}),e.jsx("p",{className:"kpi-title",children:S.title}),e.jsx("small",{className:"kpi-description",children:S.description})]})]},S.title))}),e.jsxs("div",{className:"main-content",children:[e.jsxs("div",{className:"left-column",children:[e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.4},className:"panel resources-panel",children:[e.jsxs("div",{className:"panel-header",children:[e.jsx(la,{size:18,color:"#8B5CF6"}),e.jsx("h3",{className:"dash__title--small",children:"منابع سیستم و تاریخچه"}),e.jsx("div",{className:"status-indicator online",children:"آنلاین"})]}),e.jsx("div",{className:"resources-grid",children:[{name:"CPU",icon:Jt,value:He((u==null?void 0:u.cpu)??0,0,100),color:"#8b5cf6",iconColor:"#F59E0B"},{name:"Memory",icon:hs,value:He((u==null?void 0:u.memory)??0,0,100),color:"#3b82f6",iconColor:"#06B6D4"},{name:"GPU",icon:rs,value:He((u==null?void 0:u.gpu)??0,0,100),color:"#10b981",iconColor:"#10b981"},{name:"Disk",icon:hs,value:He(((ce=M[M.length-1])==null?void 0:ce.disk)??0,0,100),color:"#f59e0b",iconColor:"#3B82F6"}].map((S,Y)=>e.jsxs("div",{className:"resource-item",children:[e.jsxs("div",{className:"resource-header",children:[e.jsx(S.icon,{size:18,style:{color:S.iconColor}}),e.jsx("span",{children:S.name}),e.jsxs("span",{className:"resource-value",children:[Le(Re(S.value,0).toFixed(1)),"%"]})]}),e.jsx("div",{className:"resource-bar",children:e.jsx(z.div,{className:"resource-fill",style:{backgroundColor:S.color},initial:{width:0},animate:{width:`${He(S.value,0,100)}%`},transition:{duration:.5,delay:Y*.1}})})]},S.name))}),M.length>0&&e.jsxs("div",{className:"resource-chart",children:[e.jsx("h4",{children:"تاریخچه منابع"}),e.jsx(ys,{width:"100%",height:280,children:e.jsxs(Bt,{data:M,children:[e.jsx(js,{strokeDasharray:"3 3",stroke:"#e5e7eb"}),e.jsx(bs,{dataKey:"time",stroke:"#6b7280"}),e.jsx(cs,{stroke:"#6b7280"}),e.jsx(vs,{contentStyle:{background:"white",border:"2px solid #8b5cf6",borderRadius:"12px",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}),e.jsx(zs,{type:"monotone",dataKey:"cpu",stackId:"1",stroke:"#8b5cf6",fill:"#8b5cf6",fillOpacity:.6}),e.jsx(zs,{type:"monotone",dataKey:"memory",stackId:"2",stroke:"#3b82f6",fill:"#3b82f6",fillOpacity:.6}),e.jsx(zs,{type:"monotone",dataKey:"gpu",stackId:"3",stroke:"#10b981",fill:"#10b981",fillOpacity:.6})]})})]})]}),Array.isArray(N)&&N.filter(S=>S.status==="running"||S.status==="training").length>0&&e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.5},className:"panel training-panel",children:[e.jsxs("div",{className:"panel-header",children:[e.jsx(Ba,{size:18}),e.jsx("h3",{children:"آموزش‌های در حال اجرا"}),e.jsx("div",{className:"count-badge",children:Array.isArray(N)?N.filter(S=>S.status==="running"||S.status==="training").length:0})]}),e.jsx("div",{className:"training-jobs",children:Array.isArray(N)?N.filter(S=>S.status==="running"||S.status==="training").map((S,Y)=>{var R,ae;return e.jsxs(z.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:Y*.1},className:"job-card",children:[e.jsxs("div",{className:"job-header",children:[e.jsxs("div",{className:"job-title",children:[e.jsx(Ne,{size:16}),e.jsx("span",{children:S.baseModel||S.id||"مدل در حال آموزش"})]}),e.jsxs("div",{className:"job-status active",children:[e.jsx(Lt,{size:12}),e.jsx("span",{children:"در حال آموزش"})]})]}),e.jsxs("div",{className:"job-progress",children:[e.jsxs("div",{className:"progress-header",children:[e.jsxs("span",{children:["پیشرفت: ",S.progress||0,"%"]}),e.jsx("span",{children:S.message||"در حال پردازش..."})]}),e.jsx("div",{className:"progress-bar",children:e.jsx(z.div,{className:"progress-fill",initial:{width:0},animate:{width:`${S.progress||0}%`},transition:{duration:.5}})})]}),e.jsxs("div",{className:"job-metrics",children:[((R=S.metrics)==null?void 0:R.trainLoss)&&e.jsxs("div",{className:"metric",children:[e.jsx(Ie,{size:12}),e.jsxs("span",{children:["Loss: ",parseFloat(S.metrics.trainLoss).toFixed(4)]})]}),((ae=S.metrics)==null?void 0:ae.epoch)&&e.jsxs("div",{className:"metric",children:[e.jsx(Xs,{size:12}),e.jsxs("span",{children:["Epoch: ",S.metrics.epoch]})]}),S.startedAt&&e.jsxs("div",{className:"metric",children:[e.jsx(ve,{size:12}),e.jsx("span",{children:new Date(S.startedAt).toLocaleTimeString("fa-IR")})]})]})]},S.id)}):[]})]})]}),e.jsxs("div",{className:"middle-column",children:[e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.65},className:"panel health-panel",children:[e.jsxs("div",{className:"panel-header",children:[e.jsx($t,{size:18}),e.jsx("h3",{children:"سلامت سیستم"})]}),e.jsxs("div",{className:"health-status",children:[e.jsxs("div",{className:"health-item good",children:[e.jsx("div",{className:"health-icon",children:e.jsx(ke,{size:20})}),e.jsxs("div",{className:"health-info",children:[e.jsx("p",{className:"health-label",children:"دیتابیس"}),e.jsx("p",{className:"health-value",children:"متصل"})]})]}),e.jsxs("div",{className:"health-item good",children:[e.jsx("div",{className:"health-icon",children:e.jsx(la,{size:20,color:"#8B5CF6"})}),e.jsxs("div",{className:"health-info",children:[e.jsx("p",{className:"health-label",children:"سرور"}),e.jsx("p",{className:"health-value",children:"فعال"})]})]}),e.jsxs("div",{className:"health-item good",children:[e.jsx("div",{className:"health-icon",children:e.jsx(qa,{size:20,color:"#06B6D4"})}),e.jsxs("div",{className:"health-info",children:[e.jsx("p",{className:"health-label",children:"شبکه"}),e.jsx("p",{className:"health-value",children:"آنلاین"})]})]})]})]}),e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.7},className:"panel actions-panel",children:[e.jsxs("div",{className:"panel-header",children:[e.jsx(rs,{size:18}),e.jsx("h3",{children:"عملیات سریع"})]}),e.jsxs("div",{className:"actions-grid",children:[e.jsxs("button",{className:"action-btn purple",children:[e.jsx(Lt,{size:20}),e.jsx("span",{children:"شروع آموزش جدید"})]}),e.jsxs("button",{className:"action-btn blue",children:[e.jsx(Te,{size:20}),e.jsx("span",{children:"دانلود مدل"})]}),e.jsxs("button",{className:"action-btn green",children:[e.jsx(Qe,{size:20,color:"#6366F1"}),e.jsx("span",{children:"آپلود دیتاست"})]}),e.jsxs("button",{className:"action-btn orange",children:[e.jsx(Ds,{size:20}),e.jsx("span",{children:"تنظیمات سیستم"})]})]})]}),e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.75},className:"panel chart-panel",children:[e.jsxs("div",{className:"panel-header",children:[e.jsx(qs,{size:18}),e.jsx("h3",{children:"وضعیت آموزش هفتگی"})]}),e.jsx(ys,{width:"100%",height:320,children:e.jsxs(Lr,{data:[{day:"شنبه",completed:3,failed:0,running:1},{day:"یکشنبه",completed:2,failed:1,running:0},{day:"دوشنبه",completed:4,failed:0,running:2},{day:"سه‌شنبه",completed:1,failed:0,running:0},{day:"چهارشنبه",completed:2,failed:1,running:1},{day:"پنج‌شنبه",completed:3,failed:0,running:0},{day:"جمعه",completed:(l==null?void 0:l.completedTrainings)||0,failed:(l==null?void 0:l.failedTrainings)||0,running:Array.isArray(N)?N.filter(S=>S.status==="running"||S.status==="training").length:0}],children:[e.jsx(js,{strokeDasharray:"3 3",stroke:"#e5e7eb"}),e.jsx(bs,{dataKey:"day",stroke:"#6b7280"}),e.jsx(cs,{stroke:"#6b7280"}),e.jsx(vs,{contentStyle:{background:"white",border:"2px solid #8b5cf6",borderRadius:"12px",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}),e.jsx(Bs,{}),e.jsx(it,{dataKey:"completed",fill:"#10b981",name:"تکمیل شده"}),e.jsx(it,{dataKey:"failed",fill:"#ef4444",name:"ناموفق"}),e.jsx(it,{dataKey:"running",fill:"#3b82f6",name:"در حال اجرا"})]})})]})]}),e.jsxs("div",{className:"right-column",children:[e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.6},className:"panel activities-panel",id:"recent-activities",children:[e.jsxs("div",{className:"panel-header",children:[e.jsx(ve,{size:18}),e.jsx("h3",{children:"فعالیت‌های اخیر"}),e.jsx("button",{type:"button",onClick:V,"aria-describedby":"recent-activities",className:"view-all-btn",children:"مشاهده همه"})]}),e.jsx("div",{className:"activities-list",children:e.jsx(Be,{children:x.length>0?x.map((S,Y)=>e.jsxs(z.div,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},exit:{opacity:0,x:-20},transition:{delay:Y*.05},className:`activity-item activity-${S.type}`,children:[e.jsxs("div",{className:"activity-icon",children:[S.type==="training"&&e.jsx(Ne,{size:16}),S.type==="download"&&e.jsx(Te,{size:16}),S.type==="complete"&&e.jsx(ke,{size:16}),S.type==="error"&&e.jsx(Xe,{size:16}),!["training","download","complete","error"].includes(S.type)&&e.jsx(Pe,{size:16})]}),e.jsxs("div",{className:"activity-content",children:[e.jsx("p",{className:"activity-message",children:S.message}),e.jsx("p",{className:"activity-time",children:F(S.timestamp)})]})]},S.id)):e.jsxs("div",{className:"empty-state",children:[e.jsx(Pe,{size:40}),e.jsx("p",{children:"هیچ فعالیتی یافت نشد"})]})})})]}),e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.8},className:"panel models-panel",children:[e.jsxs("div",{className:"panel-header",children:[e.jsx(Ne,{size:18}),e.jsx("h3",{children:"مدل‌های موجود"}),e.jsx("div",{className:"count-badge",children:j.length})]}),e.jsx("div",{className:"models-list",children:j.length>0?j.slice((G-1)*q,G*q).map((S,Y)=>e.jsxs("div",{className:"model-item",children:[e.jsx("div",{className:"model-icon",children:e.jsx(Ne,{size:14})}),e.jsxs("div",{className:"model-info",children:[e.jsx("p",{className:"model-name",title:S.name,children:S.name}),e.jsx("p",{className:"model-status",children:S.status})]})]},S.id)):e.jsxs("div",{className:"empty-state",children:[e.jsx(Ne,{size:40}),e.jsx("p",{children:"هیچ مدلی یافت نشد"})]})}),Math.ceil(j.length/q)>1&&e.jsxs("div",{className:"models-pagination",children:[e.jsx("button",{onClick:()=>O(S=>Math.max(1,S-1)),disabled:G===1,className:"pagination-btn",children:"قبلی"}),e.jsxs("span",{className:"pagination-info",children:["صفحه ",G," از ",Math.ceil(j.length/q)]}),e.jsx("button",{onClick:()=>O(S=>Math.min(Math.ceil(j.length/q),S+1)),disabled:G===Math.ceil(j.length/q),className:"pagination-btn",children:"بعدی"})]})]})]})]}),e.jsxs("div",{className:"enhanced-dashboard-section",children:[e.jsxs("div",{className:"enhanced-grid",children:[e.jsx(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.6},children:e.jsx(Ho,{})}),e.jsx(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.7},children:e.jsx(Bo,{onNavigate:t})})]}),e.jsx(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.8},className:"monitoring-section",children:e.jsx(_o,{})})]}),e.jsx("style",{children:`
        .unified-dashboard {
          padding: 24px;
          background: linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
          min-height: 100vh;
          font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          direction: rtl;
        }

        .dashboard-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
        }

        .loading-content {
          text-align: center;
          color: #6b7280;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        /* Header */
        .dashboard-header {
          background: white;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
          border: 2px solid transparent;
          background-image: linear-gradient(white, white), 
                           linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }

        .header-text h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .header-text p {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .header-text small {
          font-size: 12px;
          color: #9ca3af;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .refresh-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* KPI Cards */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .kpi-card {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid transparent;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          opacity: 0.1;
          filter: blur(40px);
        }

        .kpi-card.kpi-purple::before { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); }
        .kpi-card.kpi-blue::before { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
        .kpi-card.kpi-green::before { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .kpi-card.kpi-orange::before { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }

        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(139, 92, 246, 0.2);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .kpi-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          z-index: 1;
        }

        .kpi-purple .kpi-icon { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); }
        .kpi-blue .kpi-icon { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
        .kpi-green .kpi-icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .kpi-orange .kpi-icon { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }

        .kpi-trend {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 6px;
          border-radius: 6px;
        }

        .kpi-trend.up {
          color: #10b981;
          background: #d1fae5;
        }

        .kpi-trend.neutral {
          color: #6b7280;
          background: #f3f4f6;
        }

        .kpi-content {
          position: relative;
          z-index: 1;
        }

        .kpi-value-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 6px;
        }

        .kpi-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
          margin: 0;
        }

        .kpi-total {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .kpi-title {
          font-size: 14px;
          color: #374151;
          font-weight: 600;
          margin: 0 0 2px 0;
        }

        .kpi-description {
          font-size: 11px;
          color: #9ca3af;
        }

        /* Main Content */
        .main-content {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }

        .left-column,
        .middle-column,
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Panel */
        .panel {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        /* Enhanced Dashboard Section */
        .enhanced-dashboard-section {
          margin-top: 2rem;
        }

        .enhanced-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .monitoring-section {
          width: 100%;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .main-content {
            grid-template-columns: 1fr 1fr;
          }
          
          .enhanced-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .main-content {
            grid-template-columns: 1fr;
          }
          
          .enhanced-grid {
            grid-template-columns: 1fr;
          }
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
        }

        .panel-header svg {
          color: #8b5cf6;
        }

        .panel-header h3 {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .status-indicator {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-indicator.online {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }

        .count-badge {
          padding: 4px 10px;
          background: linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%);
          color: #8b5cf6;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 6px 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: background-color 150ms ease;
        }

        .view-all-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .view-all-btn:active {
          background: #f1f5f9;
        }

        .view-all-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(203, 213, 225, 0.8);
        }

        /* Resources */
        .resources-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .resource-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .resource-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .resource-value {
          margin-right: auto;
          color: #6b7280;
          font-size: 12px;
        }

        .resource-bar {
          height: 12px;
          background: #f3f4f6;
          border-radius: 999px;
          overflow: hidden;
        }

        .resource-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.5s ease;
        }

        .resource-chart {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid #f3f4f6;
        }

        .resource-chart h4 {
          font-size: 14px;
          color: #374151;
          margin: 0 0 16px 0;
        }

        /* Training Jobs */
        .training-jobs {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .job-card {
          padding: 16px;
          background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          transition: all 0.3s;
        }

        .job-card:hover {
          border-color: #8b5cf6;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.2);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .job-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .job-status {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .job-status.active {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1e40af;
        }

        .job-progress {
          margin-bottom: 12px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .progress-bar {
          height: 10px;
          background: #f3f4f6;
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
          border-radius: 999px;
          position: relative;
          transition: width 0.3s ease;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .job-metrics {
          display: flex;
          gap: 12px;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #6b7280;
        }

        .metric svg {
          color: #8b5cf6;
        }

        /* Activities */
        .activities-panel .panel-header h3 {
          font-size: 14px;
        }

        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 12px;
          border-right: 4px solid transparent;
          transition: all 0.2s;
        }

        .activity-item:hover {
          transform: translateX(-4px);
          background: #f3f4f6;
        }

        .activity-item.activity-training { border-right-color: #8b5cf6; }
        .activity-item.activity-complete { border-right-color: #10b981; }
        .activity-item.activity-error { border-right-color: #ef4444; }
        .activity-item.activity-download { border-right-color: #3b82f6; }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .activity-content {
          flex: 1;
        }

        .activity-message {
          font-size: 14px;
          color: #374151;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .activity-time {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
        }

        .empty-state svg {
          margin-bottom: 12px;
          opacity: 0.5;
        }

        /* Actions */
        .actions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .action-btn {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 14px;
          padding: 18px 20px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.5s;
        }

        .action-btn:hover::before {
          left: 100%;
        }

        .action-btn svg {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          transition: transform 0.3s;
        }

        .action-btn span {
          font-size: 15px;
          font-weight: 600;
          color: #374151;
          flex: 1;
          white-space: nowrap;
        }

        .action-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .action-btn:hover svg {
          transform: scale(1.2);
        }

        .action-btn.purple { 
          border-color: #e9d5ff;
          background: linear-gradient(135deg, #faf5ff 0%, #fff 100%);
        }
        .action-btn.purple svg { color: #8b5cf6; }
        .action-btn.purple:hover { 
          border-color: #8b5cf6; 
          background: linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%);
        }

        .action-btn.blue { 
          border-color: #dbeafe;
          background: linear-gradient(135deg, #eff6ff 0%, #fff 100%);
        }
        .action-btn.blue svg { color: #3b82f6; }
        .action-btn.blue:hover { 
          border-color: #3b82f6; 
          background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
        }

        .action-btn.green { 
          border-color: #d1fae5;
          background: linear-gradient(135deg, #ecfdf5 0%, #fff 100%);
        }
        .action-btn.green svg { color: #10b981; }
        .action-btn.green:hover { 
          border-color: #10b981; 
          background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
        }

        .action-btn.orange { 
          border-color: #fed7aa;
          background: linear-gradient(135deg, #fffbeb 0%, #fff 100%);
        }
        .action-btn.orange svg { color: #f59e0b; }
        .action-btn.orange:hover { 
          border-color: #f59e0b; 
          background: linear-gradient(135deg, #fed7aa 0%, #fffbeb 100%);
        }

        /* Health */
        .health-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .health-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          align-items: center;
        }

        .health-item.healthy { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); }
        .health-item.warning { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); }

        .health-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          flex-shrink: 0;
        }

        .health-item.healthy .health-icon { color: #10b981; }
        .health-item.warning .health-icon { color: #f59e0b; }

        .health-content {
          flex: 1;
        }

        .health-content p {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 2px 0;
        }

        .health-item.healthy .health-content p { color: #065f46; }
        .health-item.warning .health-content p { color: #92400e; }

        .health-content span {
          font-size: 12px;
          opacity: 0.8;
        }

        .health-status {
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          background: white;
        }

        .health-item.healthy .health-status { color: #10b981; }
        .health-item.warning .health-status { color: #f59e0b; }

        /* Models List */
        .models-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
        }

        .model-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #f9fafb;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .model-item:hover {
          background: #f3f4f6;
          transform: translateX(-2px);
        }

        .model-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border-radius: 6px;
          color: white;
          flex-shrink: 0;
        }

        .model-info {
          flex: 1;
          min-width: 0;
        }

        .model-name {
          font-size: 13px;
          font-weight: 600;
          margin: 0 0 2px 0;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .model-status {
          font-size: 11px;
          color: #6b7280;
          margin: 0;
        }

        /* Models Pagination */
        .models-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 2px solid #f3f4f6;
        }

        .models-pagination .pagination-btn {
          padding: 4px 12px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .models-pagination .pagination-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
        }

        .models-pagination .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .models-pagination .pagination-info {
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
        }

        /* Chart Panel */
        .chart-panel {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .main-content {
            grid-template-columns: 1fr 1fr;
          }
          
          .kpi-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }
        }

        @media (max-width: 992px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
        }

        @media (max-width: 768px) {
          .unified-dashboard {
            padding: 16px;
          }

          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .refresh-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .kpi-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .header-text h1 {
            font-size: 24px;
          }

          .header-icon {
            width: 48px;
            height: 48px;
          }
          
          .kpi-card {
            padding: 12px;
          }
        }

        /* Enhanced Dashboard Section */
        .enhanced-dashboard-section {
          margin-top: 24px;
        }

        .enhanced-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .monitoring-section {
          width: 100%;
        }

        /* Responsive for Enhanced Components */
        @media (max-width: 1200px) {
          .enhanced-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .enhanced-dashboard-section {
            margin-top: 16px;
          }
          
          .enhanced-grid {
            gap: 12px;
          }
        }
      `})]})};function Ca({activeSubTab:t="models",setActiveSubTab:s=()=>{}}){const[a,r]=c.useState([]),[n,l]=c.useState([]),[i,p]=c.useState([]),[o,u]=c.useState([]),[d,x]=c.useState([]),[h,j]=c.useState(""),[m,N]=c.useState("all"),[f,M]=c.useState(1),[J]=c.useState(10),[$,Z]=c.useState("models"),[G,O]=c.useState(!0),[q,E]=c.useState(!1),[k,P]=c.useState(!1),[g,D]=c.useState({}),[V,F]=c.useState(!1),[ne,X]=c.useState(new Map),I=c.useRef(new Map),[ee,le]=c.useState({total:0,ready:0,downloading:0,error:0}),[se]=c.useState("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");c.useEffect(()=>{ae(),te()},[]),c.useEffect(()=>{H()},[a,h,m]),c.useEffect(()=>{$==="assets"&&te()},[$]),c.useEffect(()=>{_()},[a]);const te=async()=>{var y;try{const[W,he]=await Promise.all([me.get("/assets/roots"),me.get("/assets/list/models")]);W.ok&&x(W.data||[]),he.ok&&u(((y=he.data)==null?void 0:y.assets)||[])}catch(W){console.error("Error loading assets:",W),T.error("خطا در بارگذاری دارایی‌ها")}},ce=async(y,W="models")=>{if(!(!y||y.length===0)){F(!0);try{const he=new FormData;Array.from(y).forEach(xe=>{he.append("files",xe)}),(await me.post(`/api/assets/upload/${W}`,he,{headers:{"Content-Type":"multipart/form-data"}})).ok?(T.success(`${y.length} فایل با موفقیت آپلود شد`),te()):T.error("خطا در آپلود فایل‌ها")}catch(he){console.error("Error uploading assets:",he),T.error("خطا در آپلود فایل‌ها")}finally{F(!1)}}},S=async y=>{try{(await me.delete(`/api/assets/${y}`)).ok?(T.success("دارایی با موفقیت حذف شد"),te()):T.error("خطا در حذف دارایی")}catch(W){console.error("Error deleting asset:",W),T.error("خطا در حذف دارایی")}},Y=async(y,W)=>{try{const he=await fetch(`/api/assets/download/${y}`);if(he.ok){const Q=await he.blob(),xe=window.URL.createObjectURL(Q),ye=document.createElement("a");ye.href=xe,ye.download=W,document.body.appendChild(ye),ye.click(),window.URL.revokeObjectURL(xe),document.body.removeChild(ye),T.success("دانلود شروع شد")}else T.error("خطا در دانلود فایل")}catch(he){console.error("Error downloading asset:",he),T.error("خطا در دانلود فایل")}},R=y=>{if(!y)return"0 B";const W=1024,he=["B","KB","MB","GB"],Q=Math.floor(Math.log(y)/Math.log(W));return parseFloat((y/Math.pow(W,Q)).toFixed(2))+" "+he[Q]},ae=async()=>{await Promise.all([de(),A()])},de=async()=>{try{O(!0);const y=await me.getModels();y&&y.ok&&y.data?r(y.data):Array.isArray(y)?r(y):(console.warn("Unexpected models format:",y),r([]))}catch(y){console.error("Error loading models:",y),T.error("خطا در بارگذاری مدل‌ها"),r([])}finally{O(!1)}},A=async()=>{try{const y=await fetch("https://huggingface.co/api/models?limit=50&sort=downloads",{headers:{Authorization:`Bearer ${se}`,"Content-Type":"application/json"}});if(y.ok){const he=(await y.json()).map(Q=>({id:Q.id,name:Q.id.split("/").pop(),fullName:Q.id,description:Q.pipeline_tag?`مدل ${v(Q.pipeline_tag)}`:"مدل هوش مصنوعی",type:K(Q.pipeline_tag),size:C(Q.downloads||0),status:"available",downloads:Q.downloads||0,tags:Q.tags||[],author:Q.author||"Hugging Face",createdAt:Q.created_at||new Date().toISOString(),isHuggingFace:!0,likes:Q.likes||0}));r(Q=>{const xe=Array.isArray(Q)?Q:[],ye=new Set(xe.map(Ps=>Ps.id)),ts=he.filter(Ps=>!ye.has(Ps.id));return[...xe,...ts]})}}catch(y){console.error("Error loading Hugging Face models:",y),T.error("خطا در بارگذاری مدل‌های Hugging Face")}},v=y=>({"text-generation":"تولید متن","text-classification":"دسته‌بندی متن","question-answering":"پاسخ به سوال","image-classification":"دسته‌بندی تصویر","object-detection":"تشخیص اشیاء","image-segmentation":"قطعه‌بندی تصویر","text-to-speech":"متن به گفتار","automatic-speech-recognition":"تشخیص گفتار","audio-classification":"دسته‌بندی صدا"})[y]||"هوش مصنوعی",K=y=>({"text-generation":"text","text-classification":"text","question-answering":"text","image-classification":"vision","object-detection":"vision","image-segmentation":"vision","text-to-speech":"audio","automatic-speech-recognition":"audio","audio-classification":"audio"})[y]||"other",C=y=>{const W=100+Re(y,0)%1e3;return W>500?`${Le(Re(W/1e3,0).toFixed(1))}GB`:W>100?`${Le(Re(W,0))}MB`:`${Le(Re(W,0))}MB`},_=()=>{if(!Array.isArray(a)){le({total:0,ready:0,downloading:0,error:0});return}const y={total:a.length,ready:a.filter(W=>W.status==="ready").length,downloading:a.filter(W=>W.status==="downloading").length,error:a.filter(W=>W.status==="error").length};le(y)},H=()=>{if(!Array.isArray(a)){l([]);return}let y=a.filter(W=>W.name.toLowerCase().includes(h.toLowerCase())||W.description.toLowerCase().includes(h.toLowerCase())||W.tags&&W.tags.some(he=>he.toLowerCase().includes(h.toLowerCase())));m!=="all"&&(y=y.filter(W=>W.type===m)),l(y)},ie=y=>{p(W=>W.includes(y)?W.filter(Q=>Q!==y):[...W,y])},ge=async y=>{try{const W=a.find(Q=>Q.id===y);if(!W)return;console.log("🚀 Starting REAL download for:",y),r(Q=>(Array.isArray(Q)?Q:[]).map(ye=>ye.id===y?{...ye,status:"downloading"}:ye));const he=await me.startHfDownload(y,"models/base");if(he&&he.ok){const Q=he.jobId;X(xe=>new Map(xe.set(y,Q))),fe(y,Q),T.success(`دانلود ${W.name} شروع شد`)}else throw new Error("Download request failed")}catch(W){console.error("Error downloading model:",W),T.error(`خطا در دانلود مدل: ${W.message}`),r(he=>(Array.isArray(he)?he:[]).map(xe=>xe.id===y?{...xe,status:"error",error:W.message}:xe))}},fe=(y,W)=>{I.current.has(y)&&clearInterval(I.current.get(y));const he=setInterval(async()=>{try{const Q=await me.checkDownloadProgress(W);if(Q&&Q.ok){const{progress:xe,status:ye}=Q;D(ts=>({...ts,[y]:xe||0})),ye==="completed"?Me(y,W):ye==="failed"&&je(y,W,Q.error||"Unknown error")}}catch(Q){console.error("Error checking download progress:",Q)}},2e3);I.current.set(y,he)},Me=(y,W)=>{I.current.has(y)&&(clearInterval(I.current.get(y)),I.current.delete(y)),r(Q=>(Array.isArray(Q)?Q:[]).map(ye=>ye.id===y?{...ye,status:"ready"}:ye)),X(Q=>{const xe=new Map(Q);return xe.delete(y),xe}),D(Q=>{const xe={...Q};return delete xe[y],xe});const he=a.find(Q=>Q.id===y);he&&T.success(`مدل ${he.name} با موفقیت دانلود شد`)},je=(y,W,he)=>{I.current.has(y)&&(clearInterval(I.current.get(y)),I.current.delete(y)),r(xe=>(Array.isArray(xe)?xe:[]).map(ts=>ts.id===y?{...ts,status:"error",error:he}:ts)),X(xe=>{const ye=new Map(xe);return ye.delete(y),ye}),D(xe=>{const ye={...xe};return delete ye[y],ye});const Q=a.find(xe=>xe.id===y);Q&&T.error(`دانلود ${Q.name} با خطا مواجه شد: ${he}`)},Se=async y=>{await ge(y)},we=async()=>{if(i.length===0){T.error("لطفاً حداقل یک مدل انتخاب کنید");return}E(!0);try{for(const y of i){const W=a.find(he=>he.id===y);W&&W.status==="available"&&await ge(y)}T.success(`دانلود ${i.length} مدل آغاز شد`),p([])}catch(y){console.error("Error in bulk download:",y),T.error("خطا در دانلود دسته‌ای مدل‌ها")}finally{E(!1)}},_e=async()=>{P(!0);try{await ae(),T.success("لیست مدل‌ها بروزرسانی شد")}catch{T.error("خطا در بروزرسانی لیست مدل‌ها")}finally{P(!1)}},Ve=y=>{M(y),window.scrollTo({top:0,behavior:"smooth"})},$s=()=>{const y=(f-1)*J,W=y+J;return n.slice(y,W)},be=()=>Math.ceil(n.length/J),Fs=(y,W)=>{switch(y){case"ready":return e.jsx(ke,{size:16});case"downloading":return e.jsx(z.div,{animate:{rotate:360},transition:{duration:2,repeat:1/0,ease:"linear"},children:e.jsx(Fe,{size:16})});case"error":return e.jsx(us,{size:16});case"available":return e.jsx(ve,{size:16});default:return e.jsx(ve,{size:16})}},Ae=(y,W)=>{switch(y){case"ready":return"آماده استفاده";case"downloading":const he=g[W]??0;return`در حال دانلود (${He(he,0,100).toFixed(0)}%)`;case"error":return"خطا در دانلود";case"available":return"آماده برای دانلود";default:return"نامشخص"}};return e.jsx("div",{className:"container-12 models-page-wrapper",children:$==="models"?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"models-header-modern",children:e.jsxs("div",{className:"models-stats-container",children:[e.jsxs("div",{className:"metrics-dashboard",children:[e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsx("div",{className:"growth-indicator no-growth",children:e.jsx("span",{className:"growth-value",children:"0%"})}),e.jsx("div",{className:"icon-container model-icon",children:e.jsx(Ke,{size:24})})]}),e.jsx("div",{className:"metric-card-value",children:e.jsx("span",{className:"value-primary",children:ee.total})}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"کل مدل‌ها"}),e.jsx("p",{className:"metric-subtitle",children:"تعداد کل مدل‌های موجود"})]})]}),e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsxs("div",{className:"growth-indicator",children:[e.jsx("span",{className:"growth-value",children:"8%+"}),e.jsx("svg",{className:"growth-icon",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",children:e.jsx("path",{d:"M7 17L17 7M17 7H7M17 7V17",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})]}),e.jsx("div",{className:"icon-container success-icon",children:e.jsx(ke,{size:24})})]}),e.jsx("div",{className:"metric-card-value",children:e.jsx("span",{className:"value-primary",children:ee.ready})}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"آماده استفاده"}),e.jsx("p",{className:"metric-subtitle",children:"مدل‌های آماده برای استفاده"})]})]}),e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsxs("div",{className:"growth-indicator",children:[e.jsx("span",{className:"growth-value",children:"5%+"}),e.jsx("svg",{className:"growth-icon",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",children:e.jsx("path",{d:"M7 17L17 7M17 7H7M17 7V17",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})]}),e.jsx("div",{className:"icon-container processing-icon",children:e.jsx(Te,{size:24})})]}),e.jsx("div",{className:"metric-card-value",children:e.jsx("span",{className:"value-primary",children:ee.downloading})}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"در حال دانلود"}),e.jsx("p",{className:"metric-subtitle",children:"مدل‌های در حال دانلود"})]})]}),e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsx("div",{className:"growth-indicator no-growth",children:e.jsx("span",{children:"0%"})}),e.jsx("div",{className:"icon-container error-icon",children:e.jsx(Xe,{size:24})})]}),e.jsx("div",{className:"metric-card-value",children:e.jsx("span",{className:"value-primary",children:ee.error})}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"خطا"}),e.jsx("p",{className:"metric-subtitle",children:"مدل‌های با خطا"})]})]})]}),e.jsxs("div",{className:"controls-bar-modern",children:[e.jsx("div",{className:"harmony-search-section",children:e.jsxs("div",{className:"harmony-search-box",children:[e.jsx(Je,{size:18}),e.jsx("input",{type:"text",value:h,onChange:y=>j(y.target.value),placeholder:"جستجوی مدل...",className:"harmony-search-input"}),h&&e.jsx("button",{onClick:()=>j(""),className:"harmony-btn harmony-btn-secondary",style:{padding:"4px"},children:e.jsx(us,{size:16})})]})}),e.jsxs("div",{className:"filters-modern",children:[e.jsxs("div",{className:"filter-label",children:[e.jsx(Ha,{size:16}),e.jsx("span",{children:"نوع مدل:"})]}),e.jsxs("div",{className:"filter-options",children:[e.jsx("button",{className:`filter-btn ${m==="all"?"active":""}`,onClick:()=>N("all"),children:"همه"}),e.jsx("button",{className:`filter-btn ${m==="text"?"active":""}`,onClick:()=>N("text"),children:"متنی"}),e.jsx("button",{className:`filter-btn ${m==="vision"?"active":""}`,onClick:()=>N("vision"),children:"بینایی"}),e.jsx("button",{className:`filter-btn ${m==="audio"?"active":""}`,onClick:()=>N("audio"),children:"صوتی"})]})]}),e.jsxs("div",{className:"actions-modern",children:[e.jsxs(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:_e,className:"refresh-btn-modern",disabled:k,children:[e.jsx(z.div,{animate:k?{rotate:360}:{rotate:0},transition:{duration:1,repeat:k?1/0:0,ease:"linear"},children:e.jsx(Fe,{size:18})}),e.jsx("span",{className:"btn-text-small",children:k?"در حال بروزرسانی...":"بروزرسانی"})]}),e.jsxs(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:we,className:`download-btn-modern ${q?"downloading":""}`,disabled:q||i.length===0,children:[e.jsx(Te,{size:18}),e.jsx("span",{className:"btn-text-small",children:q?"در حال دانلود...":"دانلود انتخاب شده"}),i.length>0&&e.jsx("span",{className:"download-count-modern",children:i.length})]})]})]})]})}),e.jsxs("div",{className:"models-grid-modern full-width-grid",children:[e.jsx(Be,{children:$s().map((y,W)=>e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{delay:W*.05},className:`model-card-modern ${y.type}-card ${i.includes(y.id)?"selected":""} ${y.status==="downloading"?"downloading":""}`,children:[e.jsxs("div",{className:"model-card-header",children:[e.jsxs("div",{className:`model-icon-modern ${y.type}-icon`,children:[y.type==="text"&&e.jsx(es,{size:20}),y.type==="vision"&&e.jsx(Ss,{size:20}),y.type==="audio"&&e.jsx(gs,{size:20}),y.type==="other"&&e.jsx(Ne,{size:20})]}),e.jsxs("div",{className:"model-info-modern",children:[e.jsx("h3",{className:"model-name-modern",children:y.name}),e.jsx("p",{className:"model-description-modern",children:y.description}),e.jsxs("div",{className:"model-meta",children:[y.isHuggingFace&&e.jsxs("div",{className:"hf-badge",children:[e.jsx(Ks,{size:12}),e.jsx("span",{children:"Hugging Face"})]}),y.likes>0&&e.jsx("div",{className:"likes-badge",children:e.jsxs("span",{children:["❤️ ",y.likes]})})]})]}),e.jsxs("div",{className:"model-actions-modern",children:[y.status==="available"&&e.jsx(z.button,{whileHover:{scale:1.1},whileTap:{scale:.9},onClick:()=>Se(y.id),className:"download-single-btn",title:"دانلود این مدل",children:e.jsx(Te,{size:16})}),e.jsx("div",{className:"model-select-modern",children:e.jsx("input",{type:"checkbox",checked:i.includes(y.id),onChange:()=>ie(y.id),className:"model-checkbox",disabled:y.status==="downloading"||y.status==="ready"})})]})]}),e.jsxs("div",{className:"model-card-details",children:[e.jsxs("div",{className:"model-meta-modern",children:[e.jsxs("span",{className:`model-type-badge type-${y.type}`,children:[y.type==="text"&&"متنی",y.type==="vision"&&"بینایی",y.type==="audio"&&"صوتی",y.type==="other"&&"سایر"]}),e.jsx("span",{className:"model-size-modern",children:y.size}),y.downloads>0&&e.jsxs("span",{className:"downloads-count",children:["🔥 ",y.downloads.toLocaleString()]})]}),e.jsxs("div",{className:"model-status-modern",children:[Fs(y.status,y.id),e.jsx("span",{className:"status-text-modern",children:Ae(y.status,y.id)}),y.status==="downloading"&&g[y.id]>0&&e.jsxs("div",{className:"download-progress-detailed",children:[e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${He(g[y.id]??0,0,100)}%`}})}),e.jsxs("span",{className:"progress-percent",children:[He(g[y.id]??0,0,100).toFixed(0),"%"]})]}),y.status==="error"&&e.jsxs("div",{className:"error-tooltip",children:[e.jsx(Xe,{size:12}),e.jsx("span",{className:"error-message",children:y.error})]})]})]}),y.status==="downloading"&&e.jsx("div",{className:"model-progress-bar",children:e.jsx("div",{className:"progress-track",children:e.jsx(z.div,{className:"progress-indicator",initial:{width:0},animate:{width:`${He(g[y.id]??0,0,100)}%`},transition:{duration:.5}})})})]},y.id))}),$s().length===0&&e.jsxs("div",{className:"no-models-modern",children:[e.jsx(Ne,{size:48}),e.jsx("p",{children:"هیچ مدلی یافت نشد"}),h&&e.jsx("button",{onClick:()=>j(""),className:"clear-search-btn",children:"پاک کردن جستجو"})]})]}),be()>1&&e.jsx("div",{className:"harmony-pagination",children:e.jsxs("div",{className:"harmony-pagination-content",children:[e.jsx("div",{className:"harmony-pagination-info",children:e.jsxs("span",{children:["نمایش ",(f-1)*J+1," تا"," ",Math.min(f*J,n.length)," از"," ",n.length," مدل",ee.downloading>0&&e.jsxs("span",{style:{color:"var(--warning-color)",marginRight:"8px"},children:["• ",ee.downloading," در حال دانلود"]})]})}),e.jsxs("div",{className:"harmony-pagination-controls",children:[e.jsx(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>Ve(f-1),disabled:f===1,className:"harmony-pagination-btn",children:e.jsx(Gs,{size:16})}),Array.from({length:be()},(y,W)=>W+1).filter(y=>y===1||y===be()||Math.abs(y-f)<=1).map((y,W,he)=>{const Q=W>0&&y-he[W-1]>1;return e.jsxs(Vs.Fragment,{children:[Q&&e.jsx("span",{style:{padding:"0 8px",color:"var(--gray-400)"},children:"..."}),e.jsx(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>Ve(y),className:`harmony-pagination-btn ${f===y?"active":""}`,children:y})]},y)}),e.jsx(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>Ve(f+1),disabled:f===be(),className:"harmony-pagination-btn",children:e.jsx(ks,{size:16})})]})]})})]}):e.jsxs("div",{className:"assets-container",children:[e.jsxs("div",{className:"assets-header",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(ds,{className:"w-6 h-6 text-blue-600"}),e.jsx("h2",{className:"text-2xl font-bold text-gray-900",children:"مدیریت دارایی‌ها"})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsxs("label",{className:"upload-btn",children:[e.jsx(Ms,{className:"w-4 h-4"}),"آپلود فایل",e.jsx("input",{type:"file",multiple:!0,accept:".bin,.safetensors,.onnx,.pb,.h5,.json,.txt",onChange:y=>ce(y.target.files,"models"),className:"hidden"})]}),e.jsxs("button",{onClick:te,className:"refresh-btn",disabled:G,children:[e.jsx(Fe,{className:`w-4 h-4 ${G?"animate-spin":""}`}),"بروزرسانی"]})]})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4 mb-6",children:d.map(y=>e.jsxs("div",{className:"asset-root-card",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("h3",{className:"font-medium text-gray-900",children:y.name}),e.jsx(hs,{className:"w-5 h-5 text-gray-500"})]}),e.jsx("p",{className:"text-sm text-gray-600 mb-3",children:y.description}),e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsxs("span",{className:"text-gray-500",children:[y.fileCount||0," فایل"]}),e.jsx("span",{className:"text-gray-500",children:R(y.totalSize||0)})]})]},y.id))})]}),e.jsxs("div",{className:"assets-grid",children:[V&&e.jsx("div",{className:"upload-progress",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"}),e.jsx("span",{children:"در حال آپلود..."})]})}),e.jsx(Be,{children:o.map((y,W)=>e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{delay:W*.05},className:"asset-card",children:[e.jsxs("div",{className:"asset-header",children:[e.jsx("div",{className:"asset-icon",children:y.type==="directory"?e.jsx(ds,{className:"w-5 h-5 text-blue-500"}):e.jsx(es,{className:"w-5 h-5 text-gray-500"})}),e.jsxs("div",{className:"asset-info",children:[e.jsx("h4",{className:"asset-name",children:y.name}),e.jsx("p",{className:"asset-path",children:y.path})]}),e.jsxs("div",{className:"asset-actions",children:[y.type==="file"&&e.jsx("button",{onClick:()=>Y(y.id,y.name),className:"action-btn download",title:"دانلود",children:e.jsx(Te,{className:"w-4 h-4"})}),e.jsx("button",{onClick:()=>S(y.id),className:"action-btn delete",title:"حذف",children:e.jsx(Zs,{className:"w-4 h-4"})})]})]}),e.jsx("div",{className:"asset-details",children:e.jsxs("div",{className:"asset-meta",children:[e.jsxs("span",{className:"meta-item",children:[e.jsx(hs,{className:"w-3 h-3"}),R(y.size)]}),e.jsxs("span",{className:"meta-item",children:[e.jsx(qt,{className:"w-3 h-3"}),new Date(y.created).toLocaleDateString("fa-IR")]}),y.hash&&e.jsxs("span",{className:"meta-item",children:[e.jsx(In,{className:"w-3 h-3"}),y.hash.substring(0,8),"..."]})]})})]},y.id))}),o.length===0&&!G&&e.jsxs("div",{className:"no-assets",children:[e.jsx(ds,{className:"w-12 h-12 text-gray-300 mx-auto mb-3"}),e.jsx("p",{className:"text-gray-500",children:"هیچ دارایی‌ای یافت نشد"}),e.jsx("p",{className:"text-sm text-gray-400 mt-1",children:"فایل‌های خود را آپلود کنید یا از طریق دانلود مدل اضافه کنید"})]})]})]})})}class qo{constructor(){this.listeners=new Set}on(s){return this.listeners.add(s),()=>this.listeners.delete(s)}emit(s){for(const a of[...this.listeners])try{a(s)}catch(r){console.error("Emitter error:",r)}}}const Ht={jobs:{},items:{datasets:[],models:[],tts:[]},lastSync:0},fr=new qo,Ea=t=>{t(Ht),fr.emit(Ht)};let zt=!1,nt=null;function Tt(t){const s=He((t==null?void 0:t.progress)??0,0,100),a=Re(t==null?void 0:t.size,null);return{...t,progress:s,size:a}}function Jo(t){return{datasets:Array.isArray(t==null?void 0:t.datasets)?t.datasets.map(Tt):[],models:Array.isArray(t==null?void 0:t.models)?t.models.map(Tt):[],tts:Array.isArray(t==null?void 0:t.tts)?t.tts.map(Tt):[]}}const We={setItems(t){Ea(s=>{s.items=Jo(t),s.lastSync=Date.now()})},upsertJob(t,s){Ea(a=>{const r=a.jobs[t]||{id:t},n=He((s==null?void 0:s.progress)??r.progress??0,0,100);a.jobs[t]={...r,...s,progress:n}})},startPolling:async function(s){if(zt)return;zt=!0;const a=async()=>{try{await s()}catch(r){console.error("Poll error:",r)}nt=setTimeout(a,1e3)};a()},stopPolling(){zt=!1,nt&&(clearTimeout(nt),nt=null)}},Vo=t=>fr.on(t),Wo=()=>Ht,yr=c.createContext(null),Ge={CONNECTED:"connected",CONNECTING:"connecting",DISCONNECTED:"disconnected",ERROR:"error"};function Go({children:t}){const[s,a]=c.useState(Ge.CONNECTING),[r,n]=c.useState(0),[l,i]=c.useState(null),[p,o]=c.useState(!1),u=c.useRef(null),d=c.useRef(!0),x=c.useRef(0),h=10,j=1e3,m=3e4;c.useEffect(()=>{d.current=!0,console.log("🚀 DownloadsProvider mounted, starting polling...");const M=async()=>{var J,$,Z;if(!d.current){console.log("⚠️ Component unmounted, skipping fetch");return}try{console.log("📡 Fetching downloader status..."),a(Ge.CONNECTING);const G=await me.getDownloaderStatus();if(!d.current)return;if(!G)throw new Error("Empty response from server");if(G.ok===!1)throw new Error(G.error||"Failed to fetch downloader status");const O=(G==null?void 0:G.items)||{datasets:[],models:[],tts:[]};We.setItems(O),x.current=0,n(0),i(null),o(!1),a(Ge.CONNECTED),console.log("✅ Downloader status fetched successfully",{datasets:((J=O.datasets)==null?void 0:J.length)||0,models:(($=O.models)==null?void 0:$.length)||0,tts:((Z=O.tts)==null?void 0:Z.length)||0})}catch(G){if(console.error("❌ Failed to fetch downloader status:",G),!d.current)return;x.current++,n(q=>q+1),i(G.message||G.error||"Unknown error"),a(Ge.ERROR);const O=Math.min(j*Math.pow(2,x.current-1),m);if(console.log(`⏳ Retry ${x.current}/${h} in ${O}ms`),x.current>=h){console.error("🛑 Too many consecutive errors, stopped polling"),a(Ge.DISCONNECTED),We.stopPolling();return}o(!0),u.current=setTimeout(()=>{d.current&&M()},O)}};return We.startPolling(M),()=>{console.log("🧹 DownloadsProvider unmounting, cleaning up..."),d.current=!1,We.stopPolling(),u.current&&(clearTimeout(u.current),u.current=null)}},[]);const N=()=>{console.log("🔄 Manual retry triggered"),x.current=0,n(0),i(null),o(!1),a(Ge.CONNECTING),u.current&&clearTimeout(u.current),We.stopPolling(),We.startPolling(async()=>{try{const M=await me.getDownloaderStatus();M&&d.current&&(We.setItems((M==null?void 0:M.items)||{datasets:[],models:[],tts:[]}),a(Ge.CONNECTED))}catch(M){console.error("Retry failed:",M)}})},f=c.useMemo(()=>({connectionState:s,errorCount:r,lastError:l,isRetrying:p,isConnected:s===Ge.CONNECTED,hasError:s===Ge.ERROR,isDisconnected:s===Ge.DISCONNECTED,subscribe:Vo,getState:Wo,api:me,setItems:We.setItems,upsertJob:We.upsertJob,retry:N,stopPolling:We.stopPolling,startPolling:We.startPolling,stats:{totalErrors:r,consecutiveErrors:x.current,maxErrors:h}}),[s,r,l,p]);return e.jsxs(yr.Provider,{value:f,children:[t,s===Ge.ERROR&&r>3&&e.jsx(Ko,{error:l,errorCount:r,onRetry:N,isRetrying:p})]})}function Ko({error:t,errorCount:s,onRetry:a,isRetrying:r}){return e.jsxs("div",{style:{position:"fixed",bottom:20,right:20,background:"linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",color:"white",padding:"16px 24px",borderRadius:"12px",boxShadow:"0 8px 24px rgba(0,0,0,0.15)",zIndex:9999,maxWidth:"400px",display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"24px"},children:"⚠️"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("strong",{style:{display:"block",fontSize:"14px",marginBottom:"4px"},children:"Connection Error"}),e.jsx("small",{style:{fontSize:"12px",opacity:.9},children:t||"Unable to connect to server"})]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"8px",borderTop:"1px solid rgba(255,255,255,0.2)"},children:[e.jsxs("small",{style:{fontSize:"11px",opacity:.8},children:["Failed attempts: ",s]}),e.jsx("button",{onClick:a,disabled:r,style:{background:"rgba(255,255,255,0.2)",border:"none",color:"white",padding:"6px 16px",borderRadius:"6px",fontSize:"12px",fontWeight:"600",cursor:r?"not-allowed":"pointer",opacity:r?.6:1,transition:"all 0.2s"},children:r?"🔄 Retrying...":"🔄 Retry"})]})]})}function Xt(){const t=c.useContext(yr);if(!t)throw new Error("useDownloadsContext must be used within DownloadsProvider");return t}const jr=({mode:t,setMode:s,modes:a=["list","url"],labels:r=["لیست","URL"],ariaLabel:n="Mode switch"})=>e.jsx("div",{className:"harmony-mode-switch",role:"tablist","aria-label":n,children:a.map((l,i)=>{const p=t===l;return e.jsx("button",{type:"button",role:"tab","aria-selected":p,className:`harmony-mode-btn ${p?"active":""}`,onClick:()=>s&&s(l),children:r[i]||l},l)})}),br=({url:t,setUrl:s,targetDir:a,setTargetDir:r,onSubmit:n,urlPlaceholder:l="https://...",dirPlaceholder:i="/models",submitLabel:p="دانلود",className:o=""})=>{const u=d=>{d.preventDefault(),n&&n({url:t,targetDir:a})};return e.jsxs("form",{className:`harmony-url-form ${o}`,onSubmit:u,children:[e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"url-input",children:"آدرس URL:"}),e.jsx("input",{id:"url-input",type:"text",value:t,onChange:d=>s&&s(d.target.value),placeholder:l,required:!0,dir:"ltr"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"dir-input",children:"مسیر ذخیره:"}),e.jsx("input",{id:"dir-input",type:"text",value:a,onChange:d=>r&&r(d.target.value),placeholder:i,required:!0})]})]}),e.jsxs("button",{type:"submit",className:"harmony-btn harmony-btn-primary",children:[e.jsx(Te,{size:16}),p]})]})},Xo=(t,s="success")=>s==="error"?T.error(t):s==="loading"?T.loading(t):T(t);function Zo({onToast:t=Xo}){const{upsertJob:s}=Xt(),[a,r]=c.useState([]),[n,l]=c.useState("list"),[i,p]=c.useState(""),[o,u]=c.useState("data/datasets"),[d,x]=c.useState({id:null,status:null,progress:0}),h=c.useRef(null),j=c.useRef(null);c.useEffect(()=>()=>{h.current&&(clearInterval(h.current),h.current=null)},[]);const m=async({url:C,targetDir:_}={})=>{const H=C??i,ie=_??o;if(!H||!ie){t("لطفاً آدرس و مسیر ذخیره را وارد کنید","error");return}try{p(H),u(ie);const ge=await me.startUrlDownload([{url:H,destDir:ie}]),fe=(ge==null?void 0:ge.data)??ge,Me=fe==null?void 0:fe.jobId;if(!Me){t("امکان شروع دانلود وجود ندارد","error");return}const je={id:Me,status:"queued",progress:0};x(je),s(Me,{...je,type:"url",meta:{url:H,destDir:ie,category:"datasets"}}),h.current&&clearInterval(h.current),h.current=setInterval(async()=>{try{const Se=await me.getUrlStatus(Me),we=(Se==null?void 0:Se.data)??Se,_e=(we==null?void 0:we.status)||"pending",Ve=(we==null?void 0:we.progress)??(we==null?void 0:we.pct)??0;x({id:Me,status:_e,progress:Ve}),s(Me,{status:_e,progress:Ve}),["done","completed","error"].includes(_e)&&(clearInterval(h.current),h.current=null,(_e==="done"||_e==="completed")&&I())}catch(Se){console.error("URL status error:",Se)}},1e3),t("دانلود آغاز شد","success")}catch(ge){console.error("URL download error:",ge),t("دانلود از طریق URL شروع نشد","error")}},[N,f]=c.useState(!1),[M,J]=c.useState(""),[$,Z]=c.useState("all"),[G,O]=c.useState(!1),[q,E]=c.useState(1),[k]=c.useState(10),[P,g]=c.useState(!1),[D,V]=c.useState(0),[F,ne]=c.useState({totalDatasets:0,totalSize:0,totalSamples:0,readyDatasets:0,processingDatasets:0,recentUploads:0});c.useEffect(()=>{I()},[]),c.useEffect(()=>{X()},[a]);const X=()=>{const C=Array.isArray(a)?a:[],_=C.length,H=C.reduce((je,Se)=>{var _e,Ve;const we=parseFloat(((_e=Se.size)==null?void 0:_e.replace(" GB","").replace(" MB",""))||"0")||0;return je+((Ve=Se.size)!=null&&Ve.includes("GB")?we:we/1e3)},0),ie=C.reduce((je,Se)=>je+(Se.samples||0),0),ge=C.filter(je=>je.status==="ready").length,fe=C.filter(je=>je.status==="processing").length,Me=C.filter(je=>{const Se=new Date(je.createdAt),we=new Date;return we.setDate(we.getDate()-7),Se>we}).length;ne({totalDatasets:_,totalSize:H,totalSamples:ie,readyDatasets:ge,processingDatasets:fe,recentUploads:Me})},I=async()=>{f(!0);try{const C=await me.getDatasets();C.ok&&C.data?r(Array.isArray(C.data)?C.data:[]):(t(C.error||"خطا در بارگذاری دیتاست‌ها","error"),r([]))}catch{t("خطا در بارگذاری دیتاست‌ها","error"),r([])}finally{f(!1)}},ee=async C=>{if(!(!C||C.length===0)){g(!0),V(0);try{const _=new FormData;for(let ie=0;ie<C.length;ie++)_.append("files",C[ie]);_.append("category","datasets"),_.append("destDir",o);const H=new XMLHttpRequest;H.upload.addEventListener("progress",ie=>{if(ie.lengthComputable){const ge=ie.loaded/ie.total*100;V(ge)}}),H.addEventListener("load",async()=>{if(H.status>=200&&H.status<300)try{const ie=JSON.parse(H.responseText);t("فایل‌ها با موفقیت آپلود شدند","success"),O(!1),V(0),await I()}catch{t("خطا در پردازش پاسخ سرور","error")}else t("خطا در آپلود فایل‌ها","error");g(!1)}),H.addEventListener("error",()=>{t("خطا در اتصال به سرور","error"),g(!1)}),H.open("POST","/api/datasets/upload",!0),H.send(_)}catch(_){console.error("Upload error:",_),t("خطا در آپلود فایل‌ها","error"),g(!1)}}},le=async C=>{if(window.confirm("آیا از حذف این دیتاست اطمینان دارید؟"))try{(await me.deleteDataset(C)).ok?(r(H=>(Array.isArray(H)?H:[]).filter(ge=>ge.id!==C)),t("دیتاست با موفقیت حذف شد","success")):t("خطا در حذف دیتاست","error")}catch(_){console.error("Delete error:",_),t("خطا در حذف دیتاست","error")}},se=async C=>{try{const _=a.find(ie=>ie.id===C);if(!_)return;t("شروع دانلود دیتاست...","loading");const H=await fetch(`/api/datasets/download/${C}`);if(H.ok){const ie=await H.blob(),ge=window.URL.createObjectURL(ie),fe=document.createElement("a");fe.href=ge,fe.download=`${_.name}.zip`,document.body.appendChild(fe),fe.click(),window.URL.revokeObjectURL(ge),document.body.removeChild(fe),t("دانلود با موفقیت انجام شد","success")}else t("خطا در دانلود دیتاست","error")}catch(_){console.error("Download error:",_),t("خطا در دانلود دیتاست","error")}},te=C=>{t("دیتاست برای آموزش انتخاب شد","success")},ce=(Array.isArray(a)?a:[]).filter(C=>{const _=C.name.toLowerCase().includes(M.toLowerCase())||C.description.toLowerCase().includes(M.toLowerCase())||(C.tags||[]).some(ie=>ie.toLowerCase().includes(M.toLowerCase())),H=$==="all"||C.type===$;return _&&H}),S=Math.ceil(ce.length/k),Y=(q-1)*k,R=ce.slice(Y,Y+k),ae=C=>{E(C)},de=C=>{switch(C){case"text":return e.jsx(es,{size:20});case"audio":return e.jsx(gs,{size:20});case"image":return e.jsx(_n,{size:20});case"conversation":return e.jsx(Qe,{size:20});default:return e.jsx(Qe,{size:20})}},A=C=>{const _={ready:{text:"آماده",color:"#10b981",bg:"#d1fae5"},processing:{text:"در حال پردازش",color:"#f59e0b",bg:"#fef3c7"},error:{text:"خطا",color:"#ef4444",bg:"#fee2e2"}},H=_[C]||_.ready;return e.jsx("span",{style:{padding:"0.25rem 0.5rem",borderRadius:"6px",fontSize:"0.75rem",fontWeight:"500",color:H.color,backgroundColor:H.bg},children:H.text})},v=C=>C>=1e6?(C/1e6).toFixed(1)+"M":C>=1e3?(C/1e3).toFixed(1)+"K":C.toString(),K=async C=>{const _=Array.from(C.target.files||[]);_.length>0&&await ee(_)};return N?e.jsx("div",{className:"datasets-loading",children:e.jsxs("div",{className:"loading-content",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("h2",{className:"loading-title",children:"در حال بارگذاری"}),e.jsx("p",{className:"loading-subtitle loading-text",children:"دیتاست‌ها در حال بارگذاری هستند..."})]})}):e.jsxs("div",{className:"container-12",dir:"rtl",children:[e.jsx(jr,{mode:n,setMode:l,modes:["list","url"],labels:["نمایش لیستی","دانلود از URL"],ariaLabel:"حالت نمایش دیتاست‌ها"}),n==="url"&&e.jsx(br,{url:i,setUrl:p,targetDir:o,setTargetDir:u,onSubmit:({url:C,targetDir:_})=>m({url:C,targetDir:_}),urlPlaceholder:"https://huggingface.co/datasets/...",dirPlaceholder:"data/datasets",submitLabel:"دانلود"}),n==="url"&&(d!=null&&d.id)?e.jsxs("div",{className:"url-job-status",children:[e.jsxs("div",{className:"url-job-meta",children:[e.jsxs("span",{className:"mono",children:["شناسه: ",d.id]}),e.jsxs("span",{children:["وضعیت: ",d.status]})]}),e.jsx("div",{className:"progress",children:e.jsx("div",{style:{width:`${Math.min(100,d.progress||0)}%`}})})]}):null,e.jsxs("div",{className:"metrics-dashboard",children:[e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsxs("div",{className:"growth-indicator",children:[e.jsx("span",{className:"growth-value",children:"12%+"}),e.jsx("svg",{className:"growth-icon",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M7 17L17 7M17 7H7M17 7V17",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})]}),e.jsx("div",{className:"icon-container dataset-icon",children:e.jsx(Qe,{size:24})})]}),e.jsx("div",{className:"metric-card-value",children:e.jsx("span",{className:"value-primary",children:F.totalDatasets})}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"تعداد کل دیتاست‌ها"}),e.jsx("p",{className:"metric-subtitle",children:"دیتاست‌های موجود"})]})]}),e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsxs("div",{className:"growth-indicator",children:[e.jsx("span",{className:"growth-value",children:"8.5%+"}),e.jsx("svg",{className:"growth-icon",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M7 17L17 7M17 7H7M17 7V17",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})]}),e.jsx("div",{className:"icon-container model-icon",children:e.jsx(hs,{size:24})})]}),e.jsxs("div",{className:"metric-card-value",children:[e.jsx("span",{className:"value-primary",children:F.totalSize.toFixed(1)}),e.jsx("span",{className:"value-secondary",children:"GB"})]}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"حجم کل داده‌ها"}),e.jsx("p",{className:"metric-subtitle",children:"حجم ذخیره شده"})]})]}),e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsx("div",{className:"growth-indicator no-growth",children:e.jsx("span",{children:"0%"})}),e.jsx("div",{className:"icon-container processing-icon",children:e.jsx(Pe,{size:24})})]}),e.jsx("div",{className:"metric-card-value",children:e.jsx("span",{className:"value-primary",children:v(F.totalSamples)})}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"تعداد کل نمونه‌ها"}),e.jsx("p",{className:"metric-subtitle",children:"نمونه‌های موجود"})]})]}),e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsxs("div",{className:"growth-indicator",children:[e.jsx("span",{className:"growth-value",children:"5%+"}),e.jsx("svg",{className:"growth-icon",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M7 17L17 7M17 7H7M17 7V17",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})]}),e.jsx("div",{className:"icon-container success-icon",children:e.jsx(ke,{size:24})})]}),e.jsx("div",{className:"metric-card-value",children:e.jsx("span",{className:"value-primary",children:F.readyDatasets})}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"دیتاست‌های آماده"}),e.jsx("p",{className:"metric-subtitle",children:"آماده برای استفاده"})]})]})]}),e.jsxs("div",{className:"datasets-header",children:[e.jsxs("div",{className:"header-content",children:[e.jsxs("h1",{className:"page-title",children:[e.jsx(Qe,{size:28}),"مدیریت دیتاست‌ها"]}),e.jsx("p",{className:"page-description",children:"آپلود، مدیریت و سازمان‌دهی مجموعه داده‌های فارسی"})]}),e.jsxs("div",{className:"header-actions",children:[e.jsxs(z.button,{className:"refresh-btn-modern",onClick:I,whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(Fe,{size:18}),"بروزرسانی"]}),e.jsxs(z.button,{className:"upload-btn-modern",onClick:()=>O(!0),whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(oa,{size:18}),"آپلود دیتاست جدید"]})]})]}),e.jsxs("div",{className:"search-filter-bar",children:[e.jsxs("div",{className:"search-box",children:[e.jsx(Je,{size:20}),e.jsx("input",{type:"text",placeholder:"جستجو در دیتاست‌ها...",value:M,onChange:C=>J(C.target.value)})]}),e.jsxs("div",{className:"filter-buttons",children:[e.jsx("button",{className:`filter-btn ${$==="all"?"active":""}`,onClick:()=>Z("all"),children:"همه"}),e.jsx("button",{className:`filter-btn ${$==="text"?"active":""}`,onClick:()=>Z("text"),children:"متنی"}),e.jsx("button",{className:`filter-btn ${$==="audio"?"active":""}`,onClick:()=>Z("audio"),children:"صوتی"}),e.jsx("button",{className:`filter-btn ${$==="image"?"active":""}`,onClick:()=>Z("image"),children:"تصویری"}),e.jsx("button",{className:`filter-btn ${$==="conversation"?"active":""}`,onClick:()=>Z("conversation"),children:"گفتگو"})]})]}),e.jsx("div",{className:"datasets-grid",children:e.jsx(Be,{children:R.map((C,_)=>e.jsxs(z.div,{className:"dataset-card",initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.3,delay:_*.05},whileHover:{scale:1.02,boxShadow:"0 8px 30px rgba(0,0,0,0.12)"},children:[e.jsxs("div",{className:"dataset-header",children:[e.jsx("div",{className:"dataset-icon",children:de(C.type)}),e.jsxs("div",{className:"dataset-info",children:[e.jsx("h3",{className:"dataset-name",children:C.name}),e.jsx("p",{className:"dataset-description",children:C.description})]}),e.jsx("div",{className:"dataset-status",children:A(C.status)})]}),e.jsxs("div",{className:"dataset-details",children:[e.jsxs("div",{className:"detail-item",children:[e.jsx("span",{className:"detail-label",children:"نوع:"}),e.jsx("span",{className:"detail-value",children:C.type})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("span",{className:"detail-label",children:"حجم:"}),e.jsx("span",{className:"detail-value",children:C.size})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("span",{className:"detail-label",children:"نمونه‌ها:"}),e.jsx("span",{className:"detail-value",children:(C.samples||0).toLocaleString()})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("span",{className:"detail-label",children:"تاریخ:"}),e.jsx("span",{className:"detail-value",children:C.createdAt})]})]}),e.jsx("div",{className:"dataset-tags",children:(C.tags||[]).map((H,ie)=>e.jsx("span",{className:"dataset-tag",children:H},ie))}),e.jsxs("div",{className:"dataset-actions",children:[e.jsxs(z.button,{className:"action-btn primary",onClick:()=>se(C.id),whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(Te,{size:16}),"دانلود"]}),e.jsxs(z.button,{className:"action-btn secondary",onClick:()=>te(C.id),whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(Ms,{size:16}),"استفاده در آموزش"]}),e.jsx(z.button,{className:"action-btn danger",onClick:()=>le(C.id),whileHover:{scale:1.05},whileTap:{scale:.95},children:e.jsx(Zs,{size:16})})]})]},C.id))})}),ce.length===0&&e.jsxs(z.div,{className:"empty-state",initial:{opacity:0},animate:{opacity:1},children:[e.jsx(Qe,{size:64}),e.jsx("h3",{children:"هیچ دیتاستی یافت نشد"}),e.jsx("p",{children:"برای شروع، یک دیتاست جدید آپلود کنید"}),e.jsxs(z.button,{className:"upload-btn-modern",onClick:()=>O(!0),whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(oa,{size:18}),"آپلود دیتاست"]})]}),S>1&&e.jsx("div",{className:"harmony-pagination",children:e.jsxs("div",{className:"harmony-pagination-content",children:[e.jsxs("div",{className:"harmony-pagination-info",children:["نمایش ",Y+1," تا ",Math.min(Y+k,ce.length)," از ",ce.length," دیتاست"]}),e.jsxs("div",{className:"harmony-pagination-controls",children:[e.jsxs("button",{className:"harmony-pagination-btn",onClick:()=>ae(q-1),disabled:q===1,children:[e.jsx(ks,{size:16}),"قبلی"]}),Array.from({length:Math.min(5,S)},(C,_)=>{let H;return S<=5||q<=3?H=_+1:q>=S-2?H=S-4+_:H=q-2+_,e.jsx("button",{className:`harmony-pagination-btn ${q===H?"active":""}`,onClick:()=>ae(H),children:H},H)}),e.jsxs("button",{className:"harmony-pagination-btn",onClick:()=>ae(q+1),disabled:q===S,children:["بعدی",e.jsx(Gs,{size:16})]})]})]})}),e.jsx(Be,{children:G&&e.jsx(z.div,{className:"modal-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>!P&&O(!1),children:e.jsxs(z.div,{className:"upload-modal",initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:C=>C.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"آپلود دیتاست جدید"}),e.jsx("button",{className:"close-btn",onClick:()=>!P&&O(!1),disabled:P,children:e.jsx(Ja,{size:20})})]}),e.jsxs("div",{className:"modal-content",children:[e.jsx("p",{className:"modal-description",children:"فایل‌ها یا پوشه دیتاست خود را انتخاب کنید"}),e.jsxs("div",{className:"upload-area",children:[e.jsx(ds,{size:48}),e.jsx("p",{children:"فایل‌ها یا پوشه را اینجا بکشید یا کلیک کنید"}),e.jsx("input",{ref:j,type:"file",multiple:!0,webkitdirectory:"",directory:"",onChange:K,style:{display:"none"},id:"folder-input",disabled:P}),e.jsxs("div",{style:{display:"flex",gap:"1rem",marginTop:"1rem"},children:[e.jsxs("label",{htmlFor:"folder-input",className:"upload-label",style:{opacity:P?.5:1,pointerEvents:P?"none":"auto"},children:[e.jsx(ds,{size:16}),"انتخاب پوشه"]}),e.jsxs("label",{htmlFor:"file-input",className:"upload-label",style:{opacity:P?.5:1,pointerEvents:P?"none":"auto"},children:[e.jsx(Ms,{size:16}),"انتخاب فایل"]})]}),e.jsx("input",{type:"file",multiple:!0,onChange:C=>{C.target.files.length>0&&ee(C.target.files)},style:{display:"none"},id:"file-input",disabled:P})]}),e.jsxs("div",{className:"upload-formats",children:[e.jsx("p",{children:"فرمت‌های پشتیبانی شده:"}),e.jsxs("div",{className:"format-tags",children:[e.jsx("span",{className:"format-tag",children:"CSV"}),e.jsx("span",{className:"format-tag",children:"JSON"}),e.jsx("span",{className:"format-tag",children:"TXT"}),e.jsx("span",{className:"format-tag",children:"XML"}),e.jsx("span",{className:"format-tag",children:"MP3"}),e.jsx("span",{className:"format-tag",children:"WAV"}),e.jsx("span",{className:"format-tag",children:"JPG"}),e.jsx("span",{className:"format-tag",children:"PNG"})]})]}),P&&e.jsxs("div",{className:"upload-progress",children:[e.jsx("div",{className:"progress-bar",children:e.jsx(z.div,{className:"progress-fill",initial:{width:0},animate:{width:`${D}%`},transition:{duration:.3}})}),e.jsxs("p",{children:["در حال آپلود... ",D.toFixed(0),"%"]})]})]}),e.jsx("div",{className:"modal-actions",children:e.jsx("button",{className:"btn-secondary",onClick:()=>O(!1),disabled:P,children:P?"در حال آپلود...":"لغو"})})]})})})]})}function Yo(){const[t,s]=c.useState([]),[a,r]=c.useState([]),[n,l]=c.useState([]),[i,p]=c.useState(""),[o,u]=c.useState(!0),[d,x]=c.useState(!1),[h,j]=c.useState(!1),[m,N]=c.useState(1),[f]=c.useState(10),[M,J]=c.useState(null),[$]=c.useState("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"),[Z,G]=c.useState({total:0,ready:0,downloading:0,error:0}),{upsertJob:O}=Xt(),[q,E]=c.useState("list"),[k,P]=c.useState(""),[g,D]=c.useState("downloads/tts"),[V,F]=c.useState({id:null,status:null,progress:0}),ne=c.useRef(null);c.useEffect(()=>{X()},[]),c.useEffect(()=>{le()},[t,i]),c.useEffect(()=>{se()},[t]),c.useEffect(()=>()=>{ne.current&&(clearInterval(ne.current),ne.current=null)},[]);const X=async()=>{try{u(!0);const v=await fetch("https://huggingface.co/api/models?pipeline_tag=text-to-speech&limit=50",{headers:{Authorization:`Bearer ${$}`,"Content-Type":"application/json"}});if(v.ok){const C=(await v.json()).map(_=>({id:_.id,name:_.id.split("/").pop(),description:_.pipeline_tag||"مدل تبدیل متن به گفتار",type:"tts",size:ee(_.downloads||0),status:"ready",downloads:_.downloads||0,tags:_.tags||[],author:_.author||"Hugging Face",createdAt:_.created_at||new Date().toISOString(),isHuggingFace:!0,language:_.language||"fa",voice:_.voice||"default"}));s(C),T.success(`${C.length} مدل TTS بارگذاری شد`)}else T.error("خطا در بارگذاری مدل‌های TTS")}catch(v){console.error("Error loading TTS models:",v),T.error("خطا در بارگذاری مدل‌های TTS")}finally{u(!1)}},I=async({url:v,targetDir:K}={})=>{const C=v??k,_=K??g;if(!C||!_){T.error("لطفاً آدرس و مسیر ذخیره را وارد کنید");return}try{P(C),D(_);const H=await me.startUrlDownload([{url:C,destDir:_}]),ie=(H==null?void 0:H.data)??H,ge=ie==null?void 0:ie.jobId;if(!ge){T.error("امکان شروع دانلود وجود ندارد");return}const fe={id:ge,status:"queued",progress:0};F(fe),O(ge,{...fe,type:"url",meta:{url:C,destDir:_,category:"tts"}}),ne.current&&clearInterval(ne.current),ne.current=setInterval(async()=>{try{const Me=await me.getUrlStatus(ge),je=(Me==null?void 0:Me.data)??Me,Se=(je==null?void 0:je.status)||"pending",we=(je==null?void 0:je.progress)??(je==null?void 0:je.pct)??0;F({id:ge,status:Se,progress:we}),O(ge,{status:Se,progress:we}),["done","completed","error"].includes(Se)&&(clearInterval(ne.current),ne.current=null)}catch(Me){console.error("URL status error:",Me)}},1e3),T.success("دانلود آغاز شد")}catch(H){console.error("URL download error:",H),T.error("دانلود از طریق URL شروع نشد")}},ee=v=>v>1e6?`${(v/1e6).toFixed(1)}M`:v>1e3?`${(v/1e3).toFixed(1)}K`:v.toString(),le=()=>{let v=t;i&&(v=v.filter(K=>K.name.toLowerCase().includes(i.toLowerCase())||K.description.toLowerCase().includes(i.toLowerCase())||K.author.toLowerCase().includes(i.toLowerCase()))),r(v)},se=()=>{const v={total:t.length,ready:t.filter(K=>K.status==="ready").length,downloading:t.filter(K=>K.status==="downloading").length,error:t.filter(K=>K.status==="error").length};G(v)},te=v=>{l(K=>K.includes(v)?K.filter(C=>C!==v):[...K,v])},ce=async()=>{if(n.length===0){T.error("لطفاً مدل‌هایی برای دانلود انتخاب کنید");return}try{j(!0),await new Promise(v=>setTimeout(v,2e3)),T.success(`دانلود ${n.length} مدل TTS شروع شد`),l([])}catch{T.error("خطا در شروع دانلود")}finally{j(!1)}},S=async()=>{x(!0),await X(),x(!1),T.success("مدل‌های TTS به‌روزرسانی شدند")},Y=v=>{M===v?(J(null),T.info("پخش متوقف شد")):(J(v),T.success("پخش شروع شد"))},R=v=>{N(v)},ae=()=>{const v=(m-1)*f,K=v+f;return a.slice(v,K)},de=()=>Math.ceil(a.length/f),A=v=>{switch(v){case"ready":return e.jsx(ke,{size:16,className:"status-ready"});case"downloading":return e.jsx(ve,{size:16,className:"status-downloading"});case"error":return e.jsx(us,{size:16,className:"status-error"});default:return e.jsx(ve,{size:16,className:"status-pending"})}};return o?e.jsx("div",{className:"tts-loading",children:e.jsxs("div",{className:"loading-content",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("h2",{className:"loading-title",children:"در حال بارگذاری"}),e.jsx("p",{className:"loading-subtitle loading-text",children:"مدل‌های تبدیل متن به گفتار در حال بارگذاری هستند..."})]})}):e.jsxs("div",{className:"container-12",children:[e.jsx(jr,{mode:q,setMode:E,modes:["list","url"],labels:["نمایش لیستی","دانلود از URL"],ariaLabel:"حالت نمایش مدل‌های TTS"}),q==="url"&&e.jsx(br,{url:k,setUrl:P,targetDir:g,setTargetDir:D,onSubmit:({url:v,targetDir:K})=>I({url:v,targetDir:K}),urlPlaceholder:"https://huggingface.co/...",dirPlaceholder:"/downloads/tts",submitLabel:"دانلود"}),q==="url"&&(V!=null&&V.id)?e.jsxs("div",{className:"url-job-status",children:[e.jsxs("div",{className:"url-job-meta",children:[e.jsxs("span",{className:"mono",children:["شناسه: ",V.id]}),e.jsxs("span",{children:["وضعیت: ",V.status]})]}),e.jsx("div",{className:"progress",children:e.jsx("div",{style:{width:`${Math.min(100,V.progress||0)}%`}})})]}):null,e.jsx("div",{className:"page-header",children:e.jsxs("div",{className:"flex",children:[e.jsxs("div",{children:[e.jsxs("h1",{children:[e.jsx(gs,{size:32}),"مدل‌های تبدیل متن به گفتار"]}),e.jsx("p",{children:"مدیریت و استفاده از مدل‌های TTS از Hugging Face"})]}),e.jsxs("div",{children:[e.jsx(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:S,className:"modern-refresh-btn",disabled:d,children:e.jsxs("div",{className:"refresh-btn-content",children:[e.jsx(Fe,{className:d?"animate-spin":"",size:18}),e.jsx("span",{children:d?"در حال به‌روزرسانی...":"بروزرسانی"})]})}),e.jsxs(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:ce,className:"btn-primary-modern",disabled:h||n.length===0,children:[e.jsx(Te,{size:18}),h?"در حال دانلود...":`دانلود (${n.length})`]})]})]})}),e.jsxs("div",{className:"metrics-dashboard",children:[e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsx("div",{className:"growth-indicator",children:e.jsx("span",{className:"growth-value",children:"0%"})}),e.jsx("div",{className:"icon-container model-icon",children:e.jsx(gs,{size:24})})]}),e.jsx("div",{className:"metric-card-value",children:e.jsx("span",{className:"value-primary",children:Z.total})}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"کل مدل‌های TTS"}),e.jsx("p",{className:"metric-subtitle",children:"مدل موجود"})]})]}),e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsxs("div",{className:"growth-indicator",children:[e.jsx("span",{className:"growth-value",children:"8%+"}),e.jsx("svg",{className:"growth-icon",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M7 17L17 7M17 7H7M17 7V17",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})]}),e.jsx("div",{className:"icon-container success-icon",children:e.jsx(ke,{size:24})})]}),e.jsx("div",{className:"metric-card-value",children:e.jsx("span",{className:"value-primary",children:Z.ready})}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"آماده"}),e.jsx("p",{className:"metric-subtitle",children:"مدل آماده"})]})]}),e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsxs("div",{className:"growth-indicator",children:[e.jsx("span",{className:"growth-value",children:"5%+"}),e.jsx("svg",{className:"growth-icon",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M7 17L17 7M17 7H7M17 7V17",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})]}),e.jsx("div",{className:"icon-container processing-icon",children:e.jsx(ve,{size:24})})]}),e.jsx("div",{className:"metric-card-value",children:e.jsx("span",{className:"value-primary",children:Z.downloading})}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"در حال دانلود"}),e.jsx("p",{className:"metric-subtitle",children:"در حال پردازش"})]})]}),e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsx("div",{className:"growth-indicator no-growth",children:e.jsx("span",{children:"0%"})}),e.jsx("div",{className:"icon-container error-icon",children:e.jsx(us,{size:24})})]}),e.jsx("div",{className:"metric-card-value",children:e.jsx("span",{className:"value-primary",children:Z.error})}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:"خطا"}),e.jsx("p",{className:"metric-subtitle",children:"نیاز به بررسی"})]})]})]}),e.jsx("div",{className:"harmony-search-section",children:e.jsxs("div",{className:"harmony-search-box",children:[e.jsx(Je,{size:18}),e.jsx("input",{type:"text",placeholder:"جستجو در مدل‌های TTS...",value:i,onChange:v=>p(v.target.value),className:"harmony-search-input"})]})}),e.jsxs("div",{className:"models-grid-modern",children:[e.jsx(Be,{children:ae().map((v,K)=>e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{delay:K*.05},className:`model-card-modern tts-card ${n.includes(v.id)?"selected":""}`,onClick:()=>te(v.id),children:[e.jsxs("div",{className:"model-card-header",children:[e.jsx("div",{className:"model-icon-modern tts-icon",children:e.jsx(gs,{size:20})}),e.jsxs("div",{className:"model-info-modern",children:[e.jsx("h3",{className:"model-name-modern",children:v.name}),e.jsx("p",{className:"model-description-modern",children:v.description}),v.isHuggingFace&&e.jsxs("div",{className:"hf-badge",children:[e.jsx(Ks,{size:12}),e.jsx("span",{children:"Hugging Face"})]})]}),e.jsx("div",{className:"model-select-modern",children:e.jsx("input",{type:"checkbox",checked:n.includes(v.id),onChange:()=>{},className:"model-checkbox"})})]}),e.jsxs("div",{className:"model-card-details",children:[e.jsxs("div",{className:"model-meta-modern",children:[e.jsx("span",{className:"model-type-badge type-tts",children:"TTS"}),e.jsx("span",{className:"model-size-modern",children:v.size}),e.jsx("span",{className:"model-language-modern",children:v.language==="fa"?"فارسی":v.language})]}),e.jsxs("div",{className:"model-actions-modern",children:[e.jsx(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:C=>{C.stopPropagation(),Y(v.id)},className:`play-btn ${M===v.id?"playing":""}`,title:M===v.id?"توقف":"پخش",children:M===v.id?e.jsx(Js,{size:16}):e.jsx(Ts,{size:16})}),e.jsxs("div",{className:"model-status-modern",children:[A(v.status),e.jsxs("span",{className:"status-text-modern",children:[v.status==="ready"&&"آماده",v.status==="downloading"&&"در حال دانلود",v.status==="error"&&"خطا",v.status==="pending"&&"در انتظار"]})]})]})]})]},v.id))}),ae().length===0&&e.jsxs("div",{className:"no-models-modern",children:[e.jsx(gs,{size:48}),e.jsx("p",{children:"هیچ مدل TTS یافت نشد"})]})]}),de()>1&&e.jsx("div",{className:"harmony-pagination",children:e.jsxs("div",{className:"harmony-pagination-content",children:[e.jsx("div",{className:"harmony-pagination-info",children:e.jsxs("span",{children:["نمایش ",(m-1)*f+1," تا ",Math.min(m*f,a.length)," از ",a.length," مدل"]})}),e.jsxs("div",{className:"harmony-pagination-controls",children:[e.jsx(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>R(m-1),disabled:m===1,className:"harmony-pagination-btn",children:e.jsx(Gs,{size:16})}),Array.from({length:de()},(v,K)=>K+1).map(v=>e.jsx(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>R(v),className:`harmony-pagination-btn ${m===v?"active":""}`,children:v},v)),e.jsx(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>R(m+1),disabled:m===de(),className:"harmony-pagination-btn",children:e.jsx(ks,{size:16})})]})]})})]})}function Qo({value:t=0,speedMbps:s=0,eta:a="",message:r=""}){const n=Math.max(0,Math.min(100,t));return e.jsxs("div",{className:"hf-progress",children:[e.jsxs("div",{className:"hf-progress-header",children:[e.jsx("span",{className:"hf-progress-label",children:"پیشرفت دانلود"}),e.jsxs("span",{className:"hf-progress-percent",children:[n.toFixed(1),"%"]})]}),e.jsx("div",{className:"hf-progress-bar-container","aria-valuenow":n,"aria-valuemin":0,"aria-valuemax":100,role:"progressbar",children:e.jsx("div",{className:"hf-progress-bar-fill",style:{width:n+"%"}})}),e.jsxs("div",{className:"hf-progress-info",children:[e.jsx("span",{className:"hf-progress-speed",children:s?s.toFixed(2)+" Mbps":""}),e.jsx("span",{className:"hf-progress-eta",children:a})]}),r?e.jsx("div",{className:"hf-progress-message",title:r,children:r}):null]})}const el=({model:t,onDownload:s,onSelect:a,isSelected:r=!1,showSelection:n=!1,className:l=""})=>{const i=x=>{switch(x){case"text-generation":case"conversational":return e.jsx(Ke,{size:20});case"fill-mask":case"text-classification":return e.jsx(Ke,{size:20});case"image-classification":case"object-detection":return e.jsx(Ke,{size:20});case"automatic-speech-recognition":case"text-to-speech":return e.jsx(Ke,{size:20});default:return e.jsx(Ke,{size:20})}},p=x=>{switch(x){case"text-generation":return"تولید متن";case"conversational":return"گفتگو";case"fill-mask":return"پر کردن جاهای خالی";case"text-classification":return"دسته‌بندی متن";case"image-classification":return"دسته‌بندی تصویر";case"object-detection":return"تشخیص اشیاء";case"automatic-speech-recognition":return"تشخیص گفتار";case"text-to-speech":return"تبدیل متن به گفتار";default:return x||"نامشخص"}},o=x=>Number.isFinite(x)?x>=1e6?(x/1e6).toFixed(1)+"M":x>=1e3?(x/1e3).toFixed(1)+"K":String(x):"0",u=Number.isFinite(t.likes),d=Number.isFinite(t.downloads);return e.jsxs("div",{className:`harmony-model-card ${l} ${r?"selected":""}`,children:[e.jsxs("div",{className:"harmony-model-header",children:[e.jsx("div",{className:"harmony-model-icon",style:{backgroundColor:"var(--harmony-bg-tertiary)"},children:i(t.pipeline_tag)}),e.jsxs("div",{className:"harmony-model-title",children:[e.jsx("h3",{className:"harmony-model-name",children:t.name||t.modelId}),e.jsx("p",{className:"harmony-model-description",children:t.description||"مدل هوش مصنوعی"})]}),n&&e.jsx("input",{type:"checkbox",checked:r,onChange:()=>a(t.id),className:"harmony-model-checkbox"})]}),e.jsxs("div",{className:"harmony-model-meta",children:[e.jsx("span",{className:"harmony-model-type",children:p(t.pipeline_tag)}),t.library_name&&e.jsx("span",{className:"harmony-model-library",children:t.library_name}),u&&e.jsxs("span",{className:"harmony-model-likes",children:[e.jsx(Ks,{size:12}),o(t.likes)]}),d&&e.jsxs("span",{className:"harmony-model-downloads",children:[e.jsx(Ss,{size:12}),o(t.downloads)]})]}),e.jsxs("div",{className:"harmony-model-actions",children:[e.jsxs("button",{className:"harmony-btn harmony-btn-primary",onClick:()=>s&&s(t),disabled:t.status==="downloading",children:[e.jsx(Te,{size:16}),"دانلود"]}),t.author&&e.jsxs("span",{className:"harmony-model-author",children:["توسط ",t.author]})]})]})},sl=({currentPage:t,totalPages:s,onPageChange:a,itemsPerPage:r,totalItems:n,className:l=""})=>{const i=(t-1)*r+1,p=Math.min(t*r,n),o=()=>{const u=[];if(s<=5)for(let x=1;x<=s;x++)u.push(x);else if(t<=3){for(let x=1;x<=4;x++)u.push(x);u.push("..."),u.push(s)}else if(t>=s-2){u.push(1),u.push("...");for(let x=s-3;x<=s;x++)u.push(x)}else{u.push(1),u.push("...");for(let x=t-1;x<=t+1;x++)u.push(x);u.push("..."),u.push(s)}return u};return s<=1?null:e.jsxs("div",{className:`harmony-pagination ${l}`,children:[e.jsx("div",{className:"harmony-pagination-info",children:e.jsxs("span",{children:["نمایش ",i," تا ",p," از ",n," مدل"]})}),e.jsxs("div",{className:"harmony-pagination-controls",children:[e.jsxs("button",{className:"harmony-pagination-btn",onClick:()=>a(t-1),disabled:t===1,children:[e.jsx(ks,{size:16}),"قبلی"]}),o().map((u,d)=>e.jsx("button",{className:`harmony-pagination-btn ${u===t?"active":""}`,onClick:()=>typeof u=="number"&&a(u),disabled:u==="...",children:u},d)),e.jsxs("button",{className:"harmony-pagination-btn",onClick:()=>a(t+1),disabled:t===s,children:["بعدی",e.jsx(Gs,{size:16})]})]})]})},za=({filters:t,activeFilter:s,onFilterChange:a,className:r=""})=>e.jsx("div",{className:`harmony-filter-bar ${r}`,children:t.map(n=>{const l=s===n.id;return e.jsx("button",{className:`harmony-filter-btn ${l?"active":""}`,onClick:()=>a&&a(n.id),type:"button","aria-pressed":l,children:n.label},n.id)})}),tl=({placeholder:t="جستجو...",value:s,onChange:a,onSearch:r,onClear:n,className:l="",showClearButton:i=!0,showButton:p=!0,buttonLabel:o="جستجو"})=>{const u=()=>{r&&r()},d=h=>{h.key==="Enter"&&u()},x=()=>{n?n():a&&a("")};return e.jsxs("div",{className:`harmony-search-section ${l}`,children:[e.jsxs("div",{className:"harmony-search-box",children:[e.jsx(Je,{size:18}),e.jsx("input",{type:"text",className:"harmony-search-input",placeholder:t,value:s,onChange:h=>a&&a(h.target.value),onKeyDown:d}),i&&s&&e.jsx("button",{onClick:x,className:"harmony-clear-search",type:"button",children:e.jsx(us,{size:16})})]}),p&&e.jsx("button",{className:"harmony-search-button",type:"button",onClick:u,children:o})]})},al="https://huggingface.co/api/models",rl=60,nl="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",il=[{id:"all",label:"همه"},{id:"text",label:"متنی"},{id:"vision",label:"بینایی"},{id:"audio",label:"صوتی"}],ol=[{id:"all",label:"همه زبان‌ها"},{id:"fa",label:"فارسی"}],ll={"text-generation":"text","text2text-generation":"text",summarization:"text",translation:"text",conversational:"text","fill-mask":"text","token-classification":"text","question-answering":"text","table-question-answering":"text","image-classification":"vision","image-segmentation":"vision","object-detection":"vision","image-to-text":"vision","automatic-speech-recognition":"audio","text-to-speech":"audio","audio-classification":"audio","voice-activity-detection":"audio"},vr=t=>ll[t]||"other",cl=t=>({"text-generation":"تولید متن","text2text-generation":"تبدیل متن به متن",summarization:"خلاصه‌سازی متن",translation:"ترجمه",conversational:"گفتگو","fill-mask":"پر کردن جای خالی","token-classification":"برچسب‌گذاری توکن","question-answering":"پاسخ به پرسش","image-classification":"دسته‌بندی تصویر","image-segmentation":"قطعه‌بندی تصویر","object-detection":"تشخیص اشیاء","image-to-text":"شرح تصویر","automatic-speech-recognition":"تشخیص گفتار","text-to-speech":"تبدیل متن به گفتار","audio-classification":"دسته‌بندی صوت"})[t]||"مدل هوش مصنوعی",wr=t=>{if(t.language)return Array.isArray(t.language)?t.language[0]:t.language;const s=(t.id||t.modelId||"").toLowerCase(),a=(t.tags||[]).map(r=>r.toLowerCase());return s.includes("persian")||s.includes("farsi")||s.includes("fa-")||a.includes("fa")||a.includes("farsi")||a.includes("persian")?"fa":"other"},Nr=t=>wr(t)==="fa",Es=t=>{const s=t.id||t.modelId,a=t.pipeline_tag||t.pipelineTag||"",r=wr(t);return{id:s,modelId:s,name:t.name||(s?s.split("/").pop():"مدل ناشناخته"),description:t.description||t.summary||(a?`مدل ${cl(a)}`:"مدل هوش مصنوعی"),pipeline_tag:a,library_name:t.library_name,likes:typeof t.likes=="number"?t.likes:0,downloads:typeof t.downloads=="number"?t.downloads:0,author:t.author||t.publisher||(s?s.split("/")[0]:"Hugging Face"),tags:t.tags||[],language:r,url:s?`https://huggingface.co/${s}`:void 0}},kr=(t,s,a)=>t.filter(r=>{const n=s==="all"||vr(r.pipeline_tag)===s,l=a==="all"?!0:a==="fa"?Nr(r):!1;return n&&l}),dl=[Es({id:"HooshvareLab/bert-fa-base-uncased",pipeline_tag:"fill-mask",likes:480,downloads:18e3,author:"HooshvareLab",tags:["persian","fa","nlp","bert"]}),Es({id:"m3hrdadfi/bert-fa-base-uncased-clf-persiannews",pipeline_tag:"text-classification",likes:320,downloads:9100,author:"m3hrdadfi",tags:["persian","fa","classification"]}),Es({id:"facebook/detr-resnet-50",pipeline_tag:"object-detection",likes:2100,downloads:12e4,author:"Meta",tags:["vision","object-detection"]}),Es({id:"openai/whisper-small",pipeline_tag:"automatic-speech-recognition",likes:5400,downloads:23e4,author:"OpenAI",tags:["audio","speech-recognition"]}),Es({id:"distilbert-base-uncased",pipeline_tag:"fill-mask",likes:6200,downloads:45e4,author:"Hugging Face",tags:["nlp","distilbert"]})],hl=(t,s,a)=>{const r=(s||"").toLowerCase();let n=dl.slice();return r&&(n=n.filter(l=>((l.name||"").toLowerCase()+(l.description||"").toLowerCase()+(l.author||"").toLowerCase()+(l.tags||[]).join(" ").toLowerCase()).includes(r))),n=kr(n,t,a),n};function ul(){const[t,s]=c.useState([]),[a,r]=c.useState(!0),[n,l]=c.useState(""),[i,p]=c.useState("all"),[o,u]=c.useState("all"),[d,x]=c.useState(null),[h,j]=c.useState(1),[m,N]=c.useState(null),[f,M]=c.useState({}),J=12,$=c.useRef({}),{upsertJob:Z}=Xt();c.useEffect(()=>((async()=>{try{const I=await me.checkHuggingFaceHealth();I!=null&&I.ok&&x({ok:!0,message:"متصل"})}catch(I){console.error("HF health check error:",I),x({ok:!1,message:"نامشخص"})}finally{await G({})}})(),()=>{Object.values($.current).forEach(I=>{I&&clearInterval(I)}),$.current={}}),[]);const G=async({query:X,type:I,language:ee}={})=>{const le=X!==void 0?X:n,se=I!==void 0?I:i,te=ee!==void 0?ee:o;r(!0),N(null);try{const ce=new URLSearchParams({limit:rl.toString(),sort:"downloads"});le&&ce.append("search",le);const S=await fetch(`${al}?${ce.toString()}`,{headers:{Authorization:`Bearer ${nl}`,"Content-Type":"application/json"}});if(!S.ok)throw new Error(`HTTP ${S.status}`);const R=(await S.json()).map(Es),ae=kr(R,se,te);s(ae),x({ok:!0,message:"متصل"})}catch(ce){console.error("Error loading Hugging Face models:",ce),N("خطا در ارتباط با سرور Hugging Face. داده‌های نمونه نمایش داده می‌شود."),x({ok:!1,message:"قطع"}),s(hl(se,le,te))}finally{r(!1)}},O=c.useMemo(()=>{const X=n.trim().toLowerCase();return t.filter(I=>{const ee=!X||(I.name||"").toLowerCase().includes(X)||(I.description||"").toLowerCase().includes(X)||(I.author||"").toLowerCase().includes(X)||(I.tags||[]).some(te=>te.toLowerCase().includes(X)),le=i==="all"||vr(I.pipeline_tag)===i,se=o==="all"?!0:o==="fa"?Nr(I):!1;return ee&&le&&se})},[t,n,i,o]),q=Math.max(1,Math.ceil(O.length/J)),E=c.useMemo(()=>{const X=(h-1)*J;return O.slice(X,X+J)},[O,h,J]),k=X=>{if(!X||!Number.isFinite(X))return"";const I=Math.max(0,Math.round(X)),ee=Math.floor(I/60),le=I%60;return`${ee}:${String(le).padStart(2,"0")} باقی‌مانده`},P=async X=>{var ee;const I=X.modelId||X.id;if(!I){T.error("شناسه مدل معتبر نیست");return}try{const le=await me.startHfDownload(I,"models/huggingface"),se=(le==null?void 0:le.data)??le;if((se==null?void 0:se.ok)===!1){T.error(se.error||"امکان شروع دانلود وجود ندارد");return}const te=(se==null?void 0:se.jobId)||((ee=se==null?void 0:se.data)==null?void 0:ee.jobId);if(!te){T.error("شناسه دانلود دریافت نشد");return}M(ce=>({...ce,[I]:{pct:0,speedMbps:0,eta:"",message:"در صف دانلود"}})),Z(te,{id:te,type:"hf",status:"queued",progress:0,meta:{modelId:I}}),$.current[te]&&clearInterval($.current[te]),$.current[te]=setInterval(async()=>{try{const ce=await me.getHfStatus(te),S=(ce==null?void 0:ce.data)??ce,Y=(S==null?void 0:S.data)??S;if(!Y)return;const R=Y.status||"processing",ae=Number.isFinite(Y.progress)&&Y.progress>=0?Y.progress:Number.isFinite(Y.pct)?Y.pct:0;M(de=>({...de,[I]:{pct:ae,speedMbps:Y.speedMbps||Y.speed||0,eta:k(Y.etaSec||Y.eta),message:Y.message||R}})),Z(te,{status:R,progress:ae}),["done","completed","finished","error"].includes(R)&&(clearInterval($.current[te]),delete $.current[te],R==="error"?T.error(Y.error||"دانلود ناموفق بود"):(T.success("دانلود و ذخیره‌سازی مدل با موفقیت تکمیل شد"),M(de=>({...de,[I]:{pct:100,speedMbps:0,eta:"",message:"دانلود کامل شد"}}))))}catch(ce){console.error("HF status polling error:",ce)}},1e3)}catch(le){console.error("Error starting HF download:",le),T.error("خطا در شروع دانلود مدل")}},g=X=>{P(X)},D=()=>{j(1),G({query:n})},V=()=>{l(""),j(1),G({query:""})},F=X=>{p(X),j(1),G({type:X})},ne=X=>{u(X),j(1),G({language:X})};return e.jsxs("div",{className:"huggingface-container",children:[e.jsxs("div",{className:"hf-header",children:[e.jsx("h2",{className:"section-title",children:"مدل‌های Hugging Face"}),e.jsxs("div",{className:"hf-status",children:[e.jsx("span",{className:d!=null&&d.ok?"status-indicator connected":"status-indicator error"}),e.jsx("span",{className:"token-status",children:(d==null?void 0:d.message)||(d!=null&&d.ok?"متصل":"قطع")})]})]}),m&&e.jsx("div",{className:"error-message",children:m}),e.jsxs("div",{className:"huggingface-controls",children:[e.jsx(tl,{placeholder:"جستجو در نام یا توضیح مدل...",value:n,onChange:l,onSearch:D,onClear:V}),e.jsxs("div",{className:"huggingface-filter-group",children:[e.jsx(za,{filters:il,activeFilter:i,onFilterChange:F}),e.jsx(za,{filters:ol,activeFilter:o,onFilterChange:ne,className:"huggingface-language-filter"})]})]}),!a&&O.length>0&&e.jsx("div",{className:"hf-summary",children:e.jsxs("span",{children:["تعداد مدل‌ها: ",O.length.toLocaleString("fa-IR",{useGrouping:!0})]})}),a&&e.jsx("div",{className:"loading-indicator",children:"در حال بارگیری مدل‌ها..."}),!a&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"models-grid",children:E.map(X=>{const I=X.modelId||X.id,ee=f[I]||{};return e.jsxs("div",{className:"huggingface-card",children:[e.jsx(el,{model:X,onDownload:g,className:"huggingface-model-card"}),e.jsx("div",{className:"huggingface-card-footer",children:e.jsx("a",{className:"harmony-model-link",href:X.url,target:"_blank",rel:"noreferrer",children:"صفحه مدل ↗"})}),ee.pct!==void 0&&e.jsx(Qo,{value:ee.pct||0,speedMbps:ee.speedMbps||0,eta:ee.eta||"",message:ee.message||""})]},I)})}),O.length>J&&e.jsx("div",{className:"pagination-container",children:e.jsx(sl,{currentPage:h,totalPages:q,onPageChange:j,itemsPerPage:J,totalItems:O.length})})]}),!a&&O.length===0&&e.jsxs("div",{className:"no-models-message",children:[e.jsx("h3",{children:"مدلی یافت نشد"}),e.jsx("p",{children:"لطفاً جستجوی دیگری امتحان کنید یا فیلترها را تغییر دهید."})]})]})}const ml=()=>{const[t,s]=c.useState("models"),[a,r]=c.useState("models"),[n,l]=c.useState({activeTrainings:0,successfulTrainings:12,successRate:92.3,datasets:5,activeModels:0}),i=[{id:"models",label:"مدل‌ها",component:Ca,icon:e.jsx(Ne,{size:18})},{id:"datasets",label:"داده‌ها",component:Zo,icon:e.jsx(Qe,{size:18})},{id:"tts",label:"تبدیل متن به گفتار",component:Yo,icon:e.jsx(rs,{size:18})},{id:"huggingface",label:"Hugging Face",component:ul,icon:e.jsx(Ke,{size:18})}],p=[{type:"training",icon:e.jsx(rs,{size:24}),value:n.activeTrainings,title:"آموزش‌های جاری",subtitle:"آموزش‌های در حال اجرا",hasGrowth:!1,growthValue:0},{type:"success",icon:e.jsx(ke,{size:24}),value:n.successfulTrainings,valueSecondary:`${n.successRate}%`,title:"آموزش‌های موفق",subtitle:"نرخ موفقیت آموزش",hasGrowth:!0,growthValue:8},{type:"dataset",icon:e.jsx(Qe,{size:24}),value:n.datasets,title:"دیتاست‌ها",subtitle:"مجموعه داده‌های آماده",hasGrowth:!0,growthValue:5},{type:"model",icon:e.jsx(Ne,{size:24}),value:n.activeModels,title:"مدل‌های فعال",subtitle:"مدل‌های در حال استفاده",hasGrowth:!0,growthValue:12}],o={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.3,ease:"easeOut"}},exit:{opacity:0,y:-20,transition:{duration:.2}}};c.useEffect(()=>{const h=()=>{const j=window.location.hash;if(j.startsWith("#tab=")){const m=j.substring(5);i.some(N=>N.id===m)&&s(m)}};return h(),window.addEventListener("hashchange",h),()=>window.removeEventListener("hashchange",h)},[]);const u=h=>{s(h),window.location.hash=`#tab=${h}`},d=i.find(h=>h.id===t)||i[0],x=()=>t==="models"?e.jsx(Ca,{activeSubTab:a,setActiveSubTab:r}):Vs.createElement(d.component);return e.jsxs("div",{className:"models-hub-container models-hub",children:[e.jsx("div",{className:"dashboard-section",children:e.jsx("div",{className:"metrics-dashboard",children:p.map((h,j)=>e.jsxs("div",{className:"metric-card",children:[e.jsxs("div",{className:"metric-card-top",children:[e.jsx("div",{className:`growth-indicator ${h.hasGrowth?"":"no-growth"}`,children:h.hasGrowth?e.jsxs(e.Fragment,{children:[e.jsxs("span",{className:"growth-value",children:[h.growthValue,"%+"]}),e.jsx(Rn,{size:14})]}):e.jsx("span",{children:"0%"})}),e.jsx("div",{className:`icon-container ${h.type}-icon`,children:h.icon})]}),e.jsxs("div",{className:"metric-card-value",children:[e.jsx("span",{className:"value-primary",children:h.value}),h.valueSecondary&&e.jsx("span",{className:"value-secondary",children:h.valueSecondary})]}),e.jsxs("div",{className:"metric-card-content",children:[e.jsx("h3",{className:"metric-title",children:h.title}),e.jsx("p",{className:"metric-subtitle",children:h.subtitle})]})]},j))})}),e.jsxs("div",{className:"harmony-tab-container",children:[e.jsx("div",{className:"harmony-tab-navigation",children:i.map(h=>e.jsxs("button",{className:`harmony-tab-button ${t===h.id?"active":""}`,onClick:()=>u(h.id),role:"tab","aria-selected":t===h.id,children:[e.jsx("span",{className:"tab-button-icon",children:h.icon}),e.jsx("span",{className:"tab-label",children:h.label}),t===h.id&&e.jsx(z.div,{className:"tab-indicator",layoutId:"tab-indicator",transition:{type:"spring",duration:.5}})]},h.id))}),t==="models"&&e.jsxs("div",{className:"harmony-tab-navigation",style:{marginTop:"16px"},children:[e.jsxs("button",{className:`harmony-tab-button ${a==="models"?"active":""}`,onClick:()=>r("models"),role:"tab","aria-selected":a==="models",children:[e.jsx("span",{className:"tab-button-icon",children:e.jsx(Ne,{size:18})}),e.jsx("span",{className:"tab-label",children:"مدل‌ها"}),a==="models"&&e.jsx(z.div,{className:"tab-indicator",layoutId:"sub-tab-indicator",transition:{type:"spring",duration:.5}})]}),e.jsxs("button",{className:`harmony-tab-button ${a==="assets"?"active":""}`,onClick:()=>r("assets"),role:"tab","aria-selected":a==="assets",children:[e.jsx("span",{className:"tab-button-icon",children:e.jsx(ds,{size:18})}),e.jsx("span",{className:"tab-label",children:"دارایی‌ها"}),a==="assets"&&e.jsx(z.div,{className:"tab-indicator",layoutId:"sub-tab-indicator",transition:{type:"spring",duration:.5}})]})]}),e.jsx(Be,{mode:"wait",children:e.jsx(z.div,{className:"harmony-tab-content",initial:"hidden",animate:"visible",exit:"exit",variants:o,children:x()},t)})]})]})},pl=()=>{const[t,s]=c.useState(new Map),[a,r]=c.useState(!1);c.useEffect(()=>{(async()=>{if("serviceWorker"in navigator&&"BackgroundFetchManager"in self)try{const d=await navigator.serviceWorker.ready;r(!!d.backgroundFetch)}catch(d){console.warn("Background Fetch not supported:",d),r(!1)}else r(!1)})()},[]),c.useEffect(()=>{var d;const u=x=>{const{type:h,datasetId:j,status:m,error:N}=x.data;switch(h){case"DATASET_DOWNLOAD_STARTED":s(f=>{const M=new Map(f);return M.set(j,{status:"downloading",progress:0}),M}),Cs.success(`📥 شروع دانلود پس‌زمینه: ${j}`);break;case"DATASET_DOWNLOAD_SUCCESS":s(f=>{const M=new Map(f);return M.set(j,{status:"completed",progress:100}),M}),Cs.success(`✅ دانلود تکمیل شد: ${j}`);break;case"DATASET_DOWNLOAD_ERROR":s(f=>{const M=new Map(f);return M.set(j,{status:"error",error:N}),M}),Cs.error(`❌ خطا در دانلود: ${j} - ${N}`);break;case"DATASET_DOWNLOAD_ABORTED":s(f=>{const M=new Map(f);return M.delete(j),M}),Cs.info(`⏹️ دانلود متوقف شد: ${j}`);break}};return(d=navigator.serviceWorker)==null||d.addEventListener("message",u),()=>{var x;(x=navigator.serviceWorker)==null||x.removeEventListener("message",u)}},[]);const n=c.useCallback(async(u,d,x={})=>{var h;if(!a)return Cs.error("❌ دانلود پس‌زمینه پشتیبانی نمی‌شود"),!1;try{return(h=(await navigator.serviceWorker.ready).active)==null||h.postMessage({type:"START_BACKGROUND_DOWNLOAD",datasetId:u,urls:d,options:{estimatedSize:x.estimatedSize||1024*1024*10,...x}}),console.log(`[Background Download] Started: ${u}`),!0}catch(j){return console.error("[Background Download] Failed to start:",j),Cs.error(`❌ خطا در شروع دانلود: ${j.message}`),!1}},[a]),l=c.useCallback(u=>t.get(u)||{status:"idle",progress:0},[t]),i=c.useCallback(u=>l(u).status==="downloading",[l]),p=c.useCallback(u=>l(u).status==="completed",[l]),o=c.useCallback(()=>Array.from(t.entries()).filter(([u,d])=>d.status==="downloading").map(([u,d])=>({datasetId:u,...d})),[t]);return{isSupported:a,startBackgroundDownload:n,getDownloadStatus:l,isDownloading:i,isCompleted:p,getActiveDownloads:o,backgroundDownloads:Object.fromEntries(t)}},pe={IDLE:"idle",INITIALIZING:"initializing",TRAINING:"training",PAUSED:"paused",COMPLETED:"completed",FAILED:"failed"},Ta={ADAM:"adam",ADAMW:"adamw",SGD:"sgd",RMSPROP:"rmsprop",LAMB:"lamb"},Ma={CONSTANT:"constant",LINEAR:"linear",COSINE:"cosine",EXPONENTIAL:"exponential",STEP:"step",POLYNOMIAL:"polynomial"},xl=()=>{const[t,s]=c.useState(pe.IDLE),[a,r]=c.useState(null),[n,l]=c.useState([]),[i,p]=c.useState([]),[o,u]=c.useState(null),[d,x]=c.useState([]),[h,j]=c.useState(null),[m,N]=c.useState({epochs:10,batchSize:32,learningRate:.001,optimizer:Ta.ADAMW,lrScheduler:Ma.COSINE,warmupSteps:500,warmupRatio:.1,weightDecay:.01,gradientAccumulationSteps:4,maxGradNorm:1,enableEarlyStopping:!0,earlyStoppingPatience:3,earlyStoppingThreshold:1e-4,mixedPrecision:!0,saveCheckpointEvery:100,keepTopCheckpoints:3,enableDistillation:!1,distillationAlpha:.5,distillationTemperature:2,validationSplit:.2,evaluateEvery:50}),[f,M]=c.useState({epoch:0,step:0,totalSteps:0,trainLoss:0,valLoss:0,learningRate:0,throughput:0,timeElapsed:0,timeRemaining:0,progress:0,bestValLoss:1/0,earlyStoppingCounter:0,gradientNorm:0,message:""}),[J,$]=c.useState([]),[Z,G]=c.useState([]),[O,q]=c.useState([]),[E,k]=c.useState(!1),[P,g]=c.useState("metrics"),[D,V]=c.useState([]),[F,ne]=c.useState(!0),[X,I]=c.useState({}),[ee,le]=c.useState(new Set),{isSupported:se,startBackgroundDownload:te,isDownloading:ce}=pl(),S=c.useRef(null),Y=c.useRef(null),R=c.useRef([]),ae=c.useRef(null);c.useEffect(()=>(de(),ie),[]),c.useEffect(()=>{const b=setInterval(()=>{R.current.length>0&&(Me(R.current),R.current=[])},500);return()=>clearInterval(b)},[]);const de=async()=>{try{ne(!0);const[b,U]=await Promise.all([Ee.getCatalogModels(),Ee.getCatalogDatasets()]);l(b||[]),p(U||[]),be("منابع با موفقیت بارگذاری شد","success")}catch(b){console.error("Load assets error:",b),T.error("خطا در بارگذاری منابع"),be(`خطا در بارگذاری: ${b.message}`,"error")}finally{ne(!1)}},A=async()=>{const b=["baseModel","datasetId","outputDir"];for(const U of b)if(!o||!d.length){T.error(`Missing field: ${U}`);return}try{s(pe.INITIALIZING),be("در حال آماده‌سازی برای شروع آموزش...","info"),console.log("Selected Base Model:",o),console.log("Selected Datasets:",d),console.log("Available Models:",n);const U={baseModel:(o==null?void 0:o.id)||o,datasets:d.map(oe=>oe.id||oe),teacherModel:(h==null?void 0:h.id)||h,config:{...m,totalSteps:Math.ceil(d.reduce((oe,re)=>oe+(re.size||1e3),0)/m.batchSize*m.epochs/m.gradientAccumulationSteps)}};console.log("Training Config being sent:",U);const L=await Ee.startTraining(U);L!=null&&L.id&&(r(L.id),s(pe.TRAINING),ae.current=Date.now(),$s(),T.success("آموزش با موفقیت شروع شد!"),be(`آموزش شروع شد - Job ID: ${L.id}`,"success"),_(L.id))}catch(U){console.error("Start training error:",U);const L=U&&U.response&&U.response.data&&(U.response.data.message||U.response.data.error)||U.message||"Training start failed";T.error(L),be(`خطا در شروع: ${U.message}`,"error"),s(pe.IDLE)}},v=async()=>{if(a)try{await Ee.pauseTraining(a),s(pe.PAUSED),H(),T.success("آموزش متوقف شد"),be("آموزش به صورت موقت متوقف شد","warning")}catch(b){console.error("Pause error:",b),T.error("خطا در توقف آموزش"),be(`خطا در توقف: ${b.message}`,"error")}},K=async()=>{if(a)try{await Ee.resumeTraining(a),s(pe.TRAINING),T.success("آموزش از سر گرفته شد"),be("آموزش از سر گرفته شد","success"),_(a)}catch(b){console.error("Resume error:",b),T.error("خطا در ادامه آموزش"),be(`خطا در ادامه: ${b.message}`,"error")}},C=async()=>{if(a&&confirm("آیا مطمئن هستید که می‌خواهید آموزش را متوقف کنید؟"))try{await Ee.stopTraining(a),s(pe.IDLE),r(null),H(),T.warning("آموزش کامل متوقف شد"),be("آموزش به صورت کامل متوقف شد","warning")}catch(b){console.error("Stop error:",b),T.error("خطا در توقف آموزش"),be(`خطا در توقف: ${b.message}`,"error")}},_=b=>{try{S.current=Ee.subscribeToTraining(b,ge),be("اتصال WebSocket برقرار شد","success")}catch(U){console.error("WebSocket error:",U),be("خطا در اتصال WebSocket، استفاده از polling","warning")}Y.current=setInterval(async()=>{try{const U=await Ee.getTrainingStatus(b);fe(U)}catch(U){console.error("Polling error:",U),be(`خطا در دریافت وضعیت: ${U.message}`,"error")}},2e3)},H=()=>{S.current&&(S.current(),S.current=null),Y.current&&(clearInterval(Y.current),Y.current=null)},ie=()=>{H()},ge=c.useCallback(b=>{const U={...f,...b,timeElapsed:ae.current?(Date.now()-ae.current)/1e3:0};if(U.progress>0){const L=U.timeElapsed/U.progress*100;U.timeRemaining=L-U.timeElapsed}M(U),R.current.push(U),b.message&&be(b.message,b.type||"info"),m.enableEarlyStopping&&b.valLoss&&je(b.valLoss)},[f,m.enableEarlyStopping]),fe=b=>{if(!b)return;const U={progress:b.progress||0,message:b.message||"",...b.metrics||{}};ge(U),b.status==="completed"?Se():b.status==="failed"&&we(b.message||"Unknown error")},Me=b=>{const U=b.filter(re=>re.trainLoss||re.valLoss).map(re=>({step:re.step,trainLoss:re.trainLoss,valLoss:re.valLoss,epoch:re.epoch}));U.length>0&&G(re=>[...re,...U].slice(-200));const L=b.filter(re=>re.learningRate).map(re=>({step:re.step,lr:re.learningRate}));L.length>0&&q(re=>[...re,...L].slice(-200));const oe=b.filter(re=>re.throughput||re.gradientNorm).map(re=>({step:re.step,throughput:re.throughput,gradientNorm:re.gradientNorm}));oe.length>0&&$(re=>[...re,...oe].slice(-200))},je=b=>{M(U=>{if(U.bestValLoss-b>m.earlyStoppingThreshold)return{...U,bestValLoss:b,earlyStoppingCounter:0};{const oe=U.earlyStoppingCounter+1;return oe>=m.earlyStoppingPatience&&(be(`Early stopping triggered - no improvement for ${m.earlyStoppingPatience} evaluations`,"warning"),C()),{...U,earlyStoppingCounter:oe}}})},Se=()=>{s(pe.COMPLETED),H();const b=Fs((Date.now()-ae.current)/1e3);T.success(`آموزش با موفقیت به پایان رسید! (${b})`),be(`آموزش با موفقیت کامل شد - مدت زمان: ${b}`,"success");const U={finalTrainLoss:f.trainLoss.toFixed(4),finalValLoss:f.valLoss.toFixed(4),bestValLoss:f.bestValLoss.toFixed(4),totalEpochs:f.epoch,duration:b};be(`آمار نهایی: ${JSON.stringify(U,null,2)}`,"info")},we=b=>{s(pe.FAILED),H(),T.error("آموزش با خطا مواجه شد: "+b),be(`آموزش با خطا متوقف شد: ${b}`,"error")},_e=async()=>{if(a)try{const b=prompt("نام مدل را وارد کنید:");if(!b)return;await Ee.saveTrainedModel(a,b),T.success("مدل با موفقیت ذخیره شد"),be(`مدل با نام "${b}" ذخیره شد`,"success")}catch(b){console.error("Save model error:",b),T.error("خطا در ذخیره مدل"),be(`خطا در ذخیره مدل: ${b.message}`,"error")}},Ve=()=>{const b={config:m,metrics:f,lossHistory:Z,lrHistory:O,metricsHistory:J,logs:D},U=new Blob([JSON.stringify(b,null,2)],{type:"application/json"}),L=URL.createObjectURL(U),oe=document.createElement("a");oe.href=L,oe.download=`training-metrics-${a||Date.now()}.json`,oe.click(),URL.revokeObjectURL(L),T.success("متریک‌ها با موفقیت export شد")},$s=()=>{M({epoch:0,step:0,totalSteps:0,trainLoss:0,valLoss:0,learningRate:m.learningRate,throughput:0,timeElapsed:0,timeRemaining:0,progress:0,bestValLoss:1/0,earlyStoppingCounter:0,gradientNorm:0,message:""}),G([]),q([]),$([]),V([])},be=(b,U="info")=>{const L=new Date().toLocaleTimeString("fa-IR");V(oe=>[{timestamp:L,message:b,type:U},...oe.slice(0,99)])},Fs=b=>{const U=Math.floor(b/3600),L=Math.floor(b%3600/60),oe=Math.floor(b%60);return U>0?`${U}:${L.toString().padStart(2,"0")}:${oe.toString().padStart(2,"0")}`:`${L}:${oe.toString().padStart(2,"0")}`},Ae=(b,U)=>{N(L=>({...L,[b]:U}))},y=()=>{const b=t===pe.TRAINING,U=t===pe.PAUSED,L=t===pe.IDLE,oe=t===pe.COMPLETED;return e.jsxs("div",{className:"training-controls",children:[L&&e.jsxs(z.button,{onClick:A,className:"btn btn-primary btn-lg",disabled:!o||d.length===0,whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(Ts,{size:20}),e.jsx("span",{children:"شروع آموزش"})]}),b&&e.jsxs(e.Fragment,{children:[e.jsxs(z.button,{onClick:v,className:"btn btn-warning",whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(Js,{size:20}),e.jsx("span",{children:"توقف موقت"})]}),e.jsxs(z.button,{onClick:C,className:"btn btn-danger",whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(mt,{size:20}),e.jsx("span",{children:"پایان آموزش"})]})]}),U&&e.jsxs(e.Fragment,{children:[e.jsxs(z.button,{onClick:K,className:"btn btn-success",whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(Ts,{size:20}),e.jsx("span",{children:"ادامه آموزش"})]}),e.jsxs(z.button,{onClick:C,className:"btn btn-danger",whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(mt,{size:20}),e.jsx("span",{children:"پایان آموزش"})]})]}),oe&&e.jsxs(e.Fragment,{children:[e.jsxs(z.button,{onClick:_e,className:"btn btn-primary",whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(_a,{size:20}),e.jsx("span",{children:"ذخیره مدل"})]}),e.jsxs(z.button,{onClick:Ve,className:"btn btn-secondary",whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(Te,{size:20}),e.jsx("span",{children:"Export متریک‌ها"})]}),e.jsxs(z.button,{onClick:()=>{s(pe.IDLE),$s()},className:"btn btn-ghost",whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(Fe,{size:20}),e.jsx("span",{children:"آموزش جدید"})]})]})]})},W=()=>e.jsxs("div",{className:"progress-section",children:[e.jsxs("div",{className:"progress-header",children:[e.jsxs("div",{className:"progress-info",children:[e.jsx("span",{className:"progress-label",children:"پیشرفت آموزش"}),e.jsxs("span",{className:"progress-percentage",children:[f.progress.toFixed(1),"%"]})]}),e.jsxs("div",{className:"progress-time",children:[e.jsxs("div",{className:"time-item",children:[e.jsx(ve,{size:14}),e.jsx("span",{children:Fs(f.timeElapsed)})]}),f.timeRemaining>0&&e.jsxs("div",{className:"time-item",children:[e.jsx(ti,{size:14}),e.jsxs("span",{children:["~",Fs(f.timeRemaining)]})]})]})]}),e.jsxs("div",{className:"progress-bar-container",children:[e.jsx(z.div,{className:"progress-bar-fill",initial:{width:0},animate:{width:`${f.progress}%`},transition:{duration:.3,ease:"easeOut"}}),e.jsx("div",{className:"progress-shimmer"})]}),f.message&&e.jsx(z.p,{className:"progress-message",initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.3},children:f.message})]}),he=()=>e.jsxs("div",{className:"metrics-grid",children:[e.jsxs(z.div,{className:"metric-card train-loss",whileHover:{scale:1.05},transition:{duration:.2},children:[e.jsx("div",{className:"metric-icon",children:e.jsx(Ie,{size:24})}),e.jsxs("div",{className:"metric-content",children:[e.jsx("span",{className:"metric-label",children:"Train Loss"}),e.jsx("span",{className:"metric-value",children:f.trainLoss.toFixed(4)})]})]}),e.jsxs(z.div,{className:"metric-card val-loss",whileHover:{scale:1.05},transition:{duration:.2},children:[e.jsx("div",{className:"metric-icon",children:e.jsx(Xs,{size:24})}),e.jsxs("div",{className:"metric-content",children:[e.jsx("span",{className:"metric-label",children:"Val Loss"}),e.jsx("span",{className:"metric-value",children:f.valLoss.toFixed(4)}),f.bestValLoss<1/0&&e.jsxs("span",{className:"metric-sub",children:["Best: ",f.bestValLoss.toFixed(4)]})]})]}),e.jsxs(z.div,{className:"metric-card epoch",whileHover:{scale:1.05},transition:{duration:.2},children:[e.jsx("div",{className:"metric-icon",children:e.jsx(Fe,{size:24})}),e.jsxs("div",{className:"metric-content",children:[e.jsx("span",{className:"metric-label",children:"Epoch"}),e.jsxs("span",{className:"metric-value",children:[f.epoch," / ",m.epochs]}),e.jsxs("span",{className:"metric-sub",children:["Step: ",f.step]})]})]}),e.jsxs(z.div,{className:"metric-card throughput",whileHover:{scale:1.05},transition:{duration:.2},children:[e.jsx("div",{className:"metric-icon",children:e.jsx(rs,{size:24})}),e.jsxs("div",{className:"metric-content",children:[e.jsx("span",{className:"metric-label",children:"Throughput"}),e.jsxs("span",{className:"metric-value",children:[f.throughput.toFixed(1)," it/s"]}),e.jsxs("span",{className:"metric-sub",children:["LR: ",f.learningRate.toExponential(2)]})]})]}),m.enableEarlyStopping&&e.jsxs(z.div,{className:"metric-card early-stopping",whileHover:{scale:1.05},transition:{duration:.2},children:[e.jsx("div",{className:"metric-icon",children:e.jsx(_s,{size:24})}),e.jsxs("div",{className:"metric-content",children:[e.jsx("span",{className:"metric-label",children:"Early Stopping"}),e.jsxs("span",{className:"metric-value",children:[f.earlyStoppingCounter," / ",m.earlyStoppingPatience]})]})]}),f.gradientNorm>0&&e.jsxs(z.div,{className:"metric-card gradient-norm",whileHover:{scale:1.05},transition:{duration:.2},children:[e.jsx("div",{className:"metric-icon",children:e.jsx(Pe,{size:24})}),e.jsxs("div",{className:"metric-content",children:[e.jsx("span",{className:"metric-label",children:"Gradient Norm"}),e.jsx("span",{className:"metric-value",children:f.gradientNorm.toFixed(3)})]})]})]}),Q=()=>e.jsxs("div",{className:"charts-container",children:[e.jsxs("div",{className:"chart-card",children:[e.jsx("h3",{className:"chart-title",children:"Training & Validation Loss"}),e.jsx(ys,{width:"100%",height:300,children:e.jsxs(Aa,{data:Z,children:[e.jsx(js,{strokeDasharray:"3 3",stroke:"#e5e7eb"}),e.jsx(bs,{dataKey:"step",stroke:"#6b7280",label:{value:"Steps",position:"insideBottom",offset:-5}}),e.jsx(cs,{stroke:"#6b7280",label:{value:"Loss",angle:-90,position:"insideLeft"}}),e.jsx(vs,{contentStyle:{background:"rgba(255, 255, 255, 0.95)",border:"1px solid #e5e7eb",borderRadius:"8px"}}),e.jsx(Bs,{}),e.jsx(Hs,{type:"monotone",dataKey:"trainLoss",stroke:"#8b5cf6",strokeWidth:2,dot:!1,name:"Train Loss"}),e.jsx(Hs,{type:"monotone",dataKey:"valLoss",stroke:"#ec4899",strokeWidth:2,dot:!1,name:"Val Loss"})]})})]}),e.jsxs("div",{className:"chart-card",children:[e.jsx("h3",{className:"chart-title",children:"Learning Rate Schedule"}),e.jsx(ys,{width:"100%",height:250,children:e.jsxs(Bt,{data:O,children:[e.jsx(js,{strokeDasharray:"3 3",stroke:"#e5e7eb"}),e.jsx(bs,{dataKey:"step",stroke:"#6b7280",label:{value:"Steps",position:"insideBottom",offset:-5}}),e.jsx(cs,{stroke:"#6b7280",label:{value:"Learning Rate",angle:-90,position:"insideLeft"}}),e.jsx(vs,{contentStyle:{background:"rgba(255, 255, 255, 0.95)",border:"1px solid #e5e7eb",borderRadius:"8px"},formatter:b=>b.toExponential(3)}),e.jsx(zs,{type:"monotone",dataKey:"lr",stroke:"#3b82f6",fill:"url(#lrGradient)",name:"Learning Rate"}),e.jsx("defs",{children:e.jsxs("linearGradient",{id:"lrGradient",x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"5%",stopColor:"#3b82f6",stopOpacity:.8}),e.jsx("stop",{offset:"95%",stopColor:"#3b82f6",stopOpacity:.1})]})})]})})]}),J.length>0&&e.jsxs("div",{className:"chart-card",children:[e.jsx("h3",{className:"chart-title",children:"Throughput & Gradient Norm"}),e.jsx(ys,{width:"100%",height:250,children:e.jsxs($r,{data:J,children:[e.jsx(js,{strokeDasharray:"3 3",stroke:"#e5e7eb"}),e.jsx(bs,{dataKey:"step",stroke:"#6b7280"}),e.jsx(cs,{yAxisId:"left",stroke:"#10b981",label:{value:"Throughput (it/s)",angle:-90,position:"insideLeft"}}),e.jsx(cs,{yAxisId:"right",orientation:"right",stroke:"#f59e0b",label:{value:"Gradient Norm",angle:90,position:"insideRight"}}),e.jsx(vs,{contentStyle:{background:"rgba(255, 255, 255, 0.95)",border:"1px solid #e5e7eb",borderRadius:"8px"}}),e.jsx(Bs,{}),e.jsx(it,{yAxisId:"left",dataKey:"throughput",fill:"#10b981",name:"Throughput"}),e.jsx(Hs,{yAxisId:"right",type:"monotone",dataKey:"gradientNorm",stroke:"#f59e0b",strokeWidth:2,dot:!1,name:"Gradient Norm"})]})})]})]}),xe=()=>e.jsxs("div",{className:"logs-container",children:[e.jsxs("div",{className:"logs-header",children:[e.jsx("h3",{children:"Training Logs"}),e.jsx("button",{onClick:()=>V([]),className:"btn-ghost btn-sm",children:"Clear"})]}),e.jsxs("div",{className:"logs-content",children:[D.map((b,U)=>e.jsxs("div",{className:`log-entry log-${b.type}`,children:[e.jsx("span",{className:"log-time",children:b.timestamp}),e.jsx("span",{className:"log-message",children:b.message})]},U)),D.length===0&&e.jsxs("div",{className:"logs-empty",children:[e.jsx(qn,{size:40,opacity:.3}),e.jsx("p",{children:"هیچ log‌ای وجود ندارد"})]})]})]}),ye=()=>e.jsxs("div",{className:"config-container",children:[e.jsxs("div",{className:"config-section",children:[e.jsx("h3",{className:"config-title",children:"تنظیمات اصلی"}),e.jsxs("div",{className:"config-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Epochs"}),e.jsx("input",{type:"number",value:m.epochs,onChange:b=>Ae("epochs",parseInt(b.target.value)),min:"1",max:"1000",disabled:t!==pe.IDLE})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Batch Size"}),e.jsx("input",{type:"number",value:m.batchSize,onChange:b=>Ae("batchSize",parseInt(b.target.value)),min:"1",max:"512",disabled:t!==pe.IDLE})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Learning Rate"}),e.jsx("input",{type:"number",value:m.learningRate,onChange:b=>Ae("learningRate",parseFloat(b.target.value)),step:"0.0001",min:"0.00001",max:"1",disabled:t!==pe.IDLE})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Optimizer"}),e.jsx("select",{value:m.optimizer,onChange:b=>Ae("optimizer",b.target.value),disabled:t!==pe.IDLE,children:Object.entries(Ta).map(([b,U])=>e.jsx("option",{value:U,children:b},U))})]})]})]}),e.jsxs("div",{className:"config-section",children:[e.jsxs("div",{className:"config-header",onClick:()=>k(!E),children:[e.jsx("h3",{className:"config-title",children:"تنظیمات پیشرفته"}),E?e.jsx(Fn,{size:20}):e.jsx($n,{size:20})]}),e.jsx(Be,{children:E&&e.jsxs(z.div,{initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},className:"config-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"LR Scheduler"}),e.jsx("select",{value:m.lrScheduler,onChange:b=>Ae("lrScheduler",b.target.value),disabled:t!==pe.IDLE,children:Object.entries(Ma).map(([b,U])=>e.jsx("option",{value:U,children:b},U))})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Warmup Steps"}),e.jsx("input",{type:"number",value:m.warmupSteps,onChange:b=>Ae("warmupSteps",parseInt(b.target.value)),min:"0",disabled:t!==pe.IDLE})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Weight Decay"}),e.jsx("input",{type:"number",value:m.weightDecay,onChange:b=>Ae("weightDecay",parseFloat(b.target.value)),step:"0.001",min:"0",max:"1",disabled:t!==pe.IDLE})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Gradient Accumulation Steps"}),e.jsx("input",{type:"number",value:m.gradientAccumulationSteps,onChange:b=>Ae("gradientAccumulationSteps",parseInt(b.target.value)),min:"1",max:"128",disabled:t!==pe.IDLE})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Max Gradient Norm"}),e.jsx("input",{type:"number",value:m.maxGradNorm,onChange:b=>Ae("maxGradNorm",parseFloat(b.target.value)),step:"0.1",min:"0",disabled:t!==pe.IDLE})]}),e.jsx("div",{className:"form-group checkbox-group",children:e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",checked:m.mixedPrecision,onChange:b=>Ae("mixedPrecision",b.target.checked),disabled:t!==pe.IDLE}),"Mixed Precision Training"]})}),e.jsx("div",{className:"form-group checkbox-group",children:e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",checked:m.enableEarlyStopping,onChange:b=>Ae("enableEarlyStopping",b.target.checked),disabled:t!==pe.IDLE}),"Enable Early Stopping"]})}),m.enableEarlyStopping&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Early Stopping Patience"}),e.jsx("input",{type:"number",value:m.earlyStoppingPatience,onChange:b=>Ae("earlyStoppingPatience",parseInt(b.target.value)),min:"1",max:"20",disabled:t!==pe.IDLE})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Early Stopping Threshold"}),e.jsx("input",{type:"number",value:m.earlyStoppingThreshold,onChange:b=>Ae("earlyStoppingThreshold",parseFloat(b.target.value)),step:"0.0001",min:"0",disabled:t!==pe.IDLE})]})]}),e.jsx("div",{className:"form-group checkbox-group",children:e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",checked:m.enableDistillation,onChange:b=>Ae("enableDistillation",b.target.checked),disabled:t!==pe.IDLE||!h}),"Knowledge Distillation"]})}),m.enableDistillation&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Distillation Alpha"}),e.jsx("input",{type:"number",value:m.distillationAlpha,onChange:b=>Ae("distillationAlpha",parseFloat(b.target.value)),step:"0.1",min:"0",max:"1",disabled:t!==pe.IDLE})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Distillation Temperature"}),e.jsx("input",{type:"number",value:m.distillationTemperature,onChange:b=>Ae("distillationTemperature",parseFloat(b.target.value)),step:"0.1",min:"1",max:"10",disabled:t!==pe.IDLE})]})]})]})})]})]}),ts=async b=>{try{console.log("Downloading model:",b),console.log("API Base URL:",Ee.axios.defaults.baseURL),console.log("Full URL:",`${Ee.axios.defaults.baseURL}/download/model/${b}`);const U=`http://localhost:3001/api/download/model/${b}`;console.log("Testing direct fetch to:",U);const L=await fetch(U);console.log("Test response status:",L.status);const oe=await L.json();if(console.log("Test response data:",oe),oe&&oe.downloadUrl){const re=document.createElement("a");re.href=oe.downloadUrl,re.download=oe.fileName,document.body.appendChild(re),re.click(),document.body.removeChild(re),T.success("دانلود مدل شروع شد")}else console.error("No download URL in test response:",oe),T.error("لینک دانلود یافت نشد")}catch(U){console.error("Download error:",U),console.error("Error message:",U.message),T.error("خطا در دانلود مدل")}},Ps=()=>e.jsxs("div",{className:"selection-section",children:[e.jsxs("h3",{className:"section-title",children:[e.jsx(Ne,{size:20}),"انتخاب مدل پایه"]}),e.jsx("div",{className:"models-grid",children:n.map(b=>e.jsxs(z.div,{className:`model-card ${(o==null?void 0:o.id)===b.id?"selected":""}`,onClick:()=>u(b),whileHover:{scale:1.02},whileTap:{scale:.98},transition:{duration:.2},children:[e.jsx("div",{className:"model-icon",children:e.jsx(Ne,{size:24})}),e.jsxs("div",{className:"model-content",children:[e.jsx("h4",{children:b.name}),e.jsx("p",{className:"model-description",children:b.description}),e.jsxs("div",{className:"model-tags",children:[e.jsx("span",{className:"tag",children:b.type}),e.jsx("span",{className:"tag",children:b.size})]})]}),e.jsx("div",{className:"model-actions",children:e.jsxs("button",{className:"download-btn",onClick:U=>{U.stopPropagation(),ts(b.id)},title:"دانلود مدل",children:[e.jsx(Te,{size:16}),e.jsx("span",{children:"دانلود"})]})})]},b.id))})]}),Sr=async b=>{if(ee.has(b)){T.error("دانلود در حال انجام است. لطفاً صبر کنید...");return}try{le(Ce=>new Set([...Ce,b])),I(Ce=>({...Ce,[b]:0})),console.log(`[Download] Fetching metadata for: ${b}`);const U=await fetch(`http://localhost:3001/api/download/dataset/${b}`);if(!U.ok){const Ce=await U.json();throw new Error(Ce.error||"Failed to fetch dataset metadata")}const L=await U.json();if(!L.success)throw new Error("اطلاعات دیتاست یافت نشد");if(!L.downloadUrl){const Ce=`
📊 ${L.nameFA||L.name}

📝 توضیحات: ${L.descriptionFA||L.description}
💾 حجم: ${L.size}
📁 فرمت: ${L.format}
${L.details?`
🔢 جزئیات: ${JSON.stringify(L.details,null,2)}`:""}

${L.instructions||"دانلود مستقیم امکان‌پذیر نیست."}

🌐 منابع:
- وب‌سایت اصلی: ${L.viewUrl}
${L.alternativeUrl?`- منبع جایگزین: ${L.alternativeUrl}`:""}

آیا می‌خواهید به منابع دیتاست مراجعه کنید؟
        `.trim();confirm(Ce)&&(L.viewUrl&&window.open(L.viewUrl,"_blank"),L.alternativeUrl&&window.open(L.alternativeUrl,"_blank"),T.success("صفحات دیتاست در تب‌های جدید باز شدند")),I(De=>{const is={...De};return delete is[b],is}),le(De=>{const is=new Set(De);return is.delete(b),is});return}console.log("[Download] Metadata received:",L);const oe=`
📊 ${L.nameFA||L.name}

📝 توضیحات: ${L.descriptionFA||L.description}
💾 حجم: ${L.size}
📁 فرمت: ${L.format}
${L.details?`
🔢 جزئیات: ${JSON.stringify(L.details,null,2)}`:""}

🌐 منبع: ${L.viewUrl.includes("huggingface")?"Hugging Face":"GitHub"}

آیا می‌خواهید دانلود را شروع کنید؟
      `.trim();if(!confirm(oe)){le(Ce=>{const De=new Set(Ce);return De.delete(b),De}),I(Ce=>{const De={...Ce};return delete De[b],De});return}console.log(`[Download] Starting download from: ${L.downloadUrl}`);let re;try{re=await fetch(L.downloadUrl)}catch(Ce){if(console.warn("[Download] Primary URL failed, trying alternative..."),L.alternativeUrl)re=await fetch(L.alternativeUrl);else throw Ce}if(!re.ok){if(L.viewUrl){console.log(`[Download] Download failed, redirecting to view page: ${L.viewUrl}`),window.open(L.viewUrl,"_blank"),T.success("دانلود مستقیم امکان‌پذیر نیست. صفحه دیتاست در تب جدید باز شد.");return}throw new Error(`HTTP ${re.status}: ${re.statusText}`)}const qe=re.headers.get("content-length"),Us=qe?parseInt(qe,10):L.sizeBytes;let Nt=0;const zr=re.body.getReader(),Zt=[];for(;;){const{done:Ce,value:De}=await zr.read();if(Ce)break;Zt.push(De),Nt+=De.length;const is=Us?Math.round(Nt/Us*100):0;I(Mr=>({...Mr,[b]:is})),console.log(`[Download] Progress: ${is}% (${Nt}/${Us} bytes)`)}const Tr=new Blob(Zt),Yt=window.URL.createObjectURL(Tr),Os=document.createElement("a");Os.href=Yt;const Qt=`${b}_${Date.now()}.${L.format.toLowerCase()}`;Os.download=Qt,document.body.appendChild(Os),Os.click(),document.body.removeChild(Os),window.URL.revokeObjectURL(Yt),I(Ce=>({...Ce,[b]:100})),console.log(`[Download] ✅ Complete: ${b}`),setTimeout(()=>{T.success(`✅ دانلود با موفقیت انجام شد!

📁 فایل: ${Qt}`),setTimeout(()=>{I(Ce=>{const De={...Ce};return delete De[b],De}),le(Ce=>{const De=new Set(Ce);return De.delete(b),De})},2e3)},500)}catch(U){console.error("[Download] ❌ Error:",U),I(L=>{const oe={...L};return delete oe[b],oe}),le(L=>{const oe=new Set(L);return oe.delete(b),oe}),T.error(`❌ خطا در دانلود دیتاست

${U.message}

لطفاً دوباره تلاش کنید یا از لینک مستقیم استفاده کنید.`)}},Cr=async b=>{try{console.log(`[Background Download] Starting: ${b}`);const U=await fetch(`http://localhost:3001/api/download/dataset/${b}`);if(!U.ok)throw new Error("Failed to fetch dataset metadata");const L=await U.json();if(!L.success||!L.downloadUrl){T.error("دانلود پس‌زمینه برای این دیتاست امکان‌پذیر نیست");return}const oe=[L.downloadUrl];L.alternativeUrls&&L.alternativeUrls.length>0&&oe.push(...L.alternativeUrls),await te(b,oe,{estimatedSize:L.sizeBytes,title:`دانلود ${L.nameFA||L.name}`,description:L.descriptionFA||L.description})?T.success(`🚀 دانلود پس‌زمینه شروع شد: ${L.nameFA||L.name}`):T.error("خطا در شروع دانلود پس‌زمینه")}catch(U){console.error("[Background Download] Error:",U),T.error(`❌ خطا در دانلود پس‌زمینه: ${U.message}`)}},Er=()=>e.jsxs("div",{className:"selection-section",children:[e.jsxs("h3",{className:"section-title",children:[e.jsx(Ne,{size:20}),"انتخاب دیتاست‌ها"]}),e.jsx("div",{className:"datasets-grid",children:i.map(b=>{const U=d.some(qe=>qe.id===b.id),L=ee.has(b.id),oe=ce(b.id),re=X[b.id];return e.jsxs(z.div,{className:`dataset-card ${U?"selected":""}`,onClick:()=>{x(U?qe=>qe.filter(Us=>Us.id!==b.id):qe=>[...qe,b])},whileHover:{scale:1.02},whileTap:{scale:.98},transition:{duration:.2},children:[e.jsx("div",{className:"dataset-icon",children:e.jsx(Ne,{size:20})}),e.jsxs("div",{className:"dataset-content",children:[e.jsx("h4",{children:b.name}),e.jsxs("p",{className:"dataset-info",children:[b.size," samples • ",b.type]}),e.jsxs("div",{className:"dataset-tags",children:[e.jsx("span",{className:"tag",children:b.format}),e.jsx("span",{className:"tag",children:b.size})]})]}),e.jsxs("div",{className:"dataset-actions",children:[e.jsxs("div",{className:"download-section",children:[e.jsx("button",{className:`download-btn ${L?"downloading":""}`,onClick:qe=>{qe.stopPropagation(),Sr(b.id)},disabled:L||oe,title:"دانلود عادی",children:L?e.jsxs("span",{className:"download-content",children:[e.jsx(xs,{className:"spinner-sm",size:16}),e.jsxs("span",{children:["در حال دانلود... ",re||0,"%"]})]}):oe?e.jsxs("span",{className:"download-content",children:[e.jsx(Pe,{className:"animate-pulse",size:16}),e.jsx("span",{children:"پس‌زمینه"})]}):e.jsxs("span",{className:"download-content",children:[e.jsx(Te,{size:16}),e.jsx("span",{children:"دانلود"})]})}),re!==void 0&&e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${re}%`}})})]}),se&&e.jsx("button",{className:"download-btn background-download",onClick:qe=>{qe.stopPropagation(),Cr(b.id)},disabled:L||oe,title:"دانلود پس‌زمینه",children:oe?e.jsxs("span",{className:"download-content",children:[e.jsx(Pe,{className:"animate-pulse",size:16}),e.jsx("span",{children:"پس‌زمینه"})]}):e.jsxs("span",{className:"download-content",children:[e.jsx(Te,{size:16}),e.jsx("span",{children:"پس‌زمینه"})]})})]})]},b.id)})})]});return F?e.jsxs("div",{className:"training-container loading",children:[e.jsx(xs,{className:"spinner",size:48}),e.jsx("p",{children:"در حال بارگذاری..."})]}):e.jsxs("div",{className:"training-container",children:[t!==pe.IDLE&&e.jsx(gr,{}),e.jsx("div",{className:"training-header",children:e.jsxs("div",{className:"header-content",children:[e.jsxs("div",{className:"header-title",children:[e.jsx(Ne,{size:32}),e.jsxs("div",{children:[e.jsx("h1",{children:"آموزش مدل"}),e.jsx("p",{children:"سیستم آموزش پیشرفته با الگوریتم‌های مدرن"})]})]}),e.jsx("div",{className:"header-status",children:e.jsxs("div",{className:`status-badge status-${t}`,children:[t===pe.IDLE&&e.jsx(ke,{size:16}),t===pe.TRAINING&&e.jsx(xs,{className:"spinner-sm",size:16}),t===pe.PAUSED&&e.jsx(Js,{size:16}),t===pe.COMPLETED&&e.jsx(Ln,{size:16}),t===pe.FAILED&&e.jsx(_s,{size:16}),e.jsx("span",{children:t.toUpperCase()})]})})]})}),e.jsxs("div",{className:"training-content",children:[e.jsxs("div",{className:"training-sidebar",children:[Ps(),Er()]}),e.jsxs("div",{className:"training-main",children:[e.jsx("div",{className:"training-panel",children:y()}),t!==pe.IDLE&&e.jsx("div",{className:"training-panel",children:W()}),t!==pe.IDLE&&e.jsx("div",{className:"training-panel",children:he()}),e.jsxs("div",{className:"training-panel",children:[e.jsxs("div",{className:"tabs",children:[e.jsxs("button",{className:`tab ${P==="metrics"?"active":""}`,onClick:()=>g("metrics"),children:[e.jsx(qs,{size:16}),"نمودارها"]}),e.jsxs("button",{className:`tab ${P==="config"?"active":""}`,onClick:()=>g("config"),children:[e.jsx(Ds,{size:16}),"تنظیمات"]}),e.jsxs("button",{className:`tab ${P==="logs"?"active":""}`,onClick:()=>g("logs"),children:[e.jsx(Pe,{size:16}),"Logs"]})]}),e.jsxs("div",{className:"tab-content",children:[P==="metrics"&&Q(),P==="config"&&ye(),P==="logs"&&xe()]})]})]})]})]})};function gl(){var h,j,m,N,f,M,J,$,Z,G,O,q,E,k,P,g,D,V,F,ne,X,I,ee,le,se,te,ce,S,Y,R,ae,de,A,v,K,C,_,H,ie,ge;const[t,s]=c.useState(!0),[a,r]=c.useState(!1),[n,l]=c.useState("accuracy"),[i,p]=c.useState("7d"),[o,u]=c.useState({accuracy:{current:0,previous:0,trend:"neutral"},performance:{current:0,previous:0,trend:"neutral"},throughput:{current:0,previous:0,trend:"neutral"},users:{current:0,previous:0,trend:"neutral"}});c.useEffect(()=>{d()},[n,i]);const d=async()=>{s(!0);try{const fe=await me.getAnalysisMetrics(n,i);fe.ok&&fe.data?u(fe.data):u({accuracy:{current:0,previous:0,trend:"neutral"},performance:{current:0,previous:0,trend:"neutral"},throughput:{current:0,previous:0,trend:"neutral"},users:{current:0,previous:0,trend:"neutral"}})}catch(fe){console.error("Error loading analysis data:",fe),u({accuracy:{current:0,previous:0,trend:"neutral"},performance:{current:0,previous:0,trend:"neutral"},throughput:{current:0,previous:0,trend:"neutral"},users:{current:0,previous:0,trend:"neutral"}})}finally{s(!1)}},x=async()=>{r(!0),await d(),r(!1)};return t||!o?e.jsx("div",{className:"analysis-page",children:e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{className:"loading-text",children:"در حال بارگذاری آنالیز..."})]})}):e.jsxs("div",{className:"container-12",children:[e.jsx("div",{className:"page-header",children:e.jsxs("div",{className:"header-content",children:[e.jsxs("div",{className:"header-title",children:[e.jsxs("h1",{className:"page-title",children:[e.jsx(qs,{size:28}),"آنالیز و گزارش‌گیری"]}),e.jsx("p",{className:"page-subtitle",children:"تحلیل جامع عملکرد سیستم و معیارهای کلیدی"})]}),e.jsxs("div",{className:"header-actions",children:[e.jsxs("div",{className:"filter-group",children:[e.jsxs("select",{value:n,onChange:fe=>l(fe.target.value),className:"filter-select",children:[e.jsx("option",{value:"accuracy",children:"دقت"}),e.jsx("option",{value:"performance",children:"عملکرد"}),e.jsx("option",{value:"throughput",children:"توان عملیاتی"}),e.jsx("option",{value:"users",children:"کاربران"})]}),e.jsxs("select",{value:i,onChange:fe=>p(fe.target.value),className:"filter-select",children:[e.jsx("option",{value:"1d",children:"1 روز"}),e.jsx("option",{value:"7d",children:"7 روز"}),e.jsx("option",{value:"30d",children:"30 روز"}),e.jsx("option",{value:"90d",children:"90 روز"})]})]}),e.jsxs(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:x,disabled:a,className:"refresh-btn",children:[e.jsx(Fe,{className:a?"animate-spin":"",size:18}),a?"در حال به‌روزرسانی...":"بروزرسانی"]})]})]})}),e.jsxs("div",{className:"stats-grid",children:[e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.1},className:"stat-card metric-purple",children:[e.jsxs("div",{className:"stat-header",children:[e.jsx("div",{className:"stat-icon",children:e.jsx(Xs,{size:14})}),e.jsx("span",{className:`stat-trend ${((h=o==null?void 0:o.accuracy)==null?void 0:h.trend)==="up"?"trend-up":"trend-down"}`,children:((j=o==null?void 0:o.accuracy)==null?void 0:j.trend)==="up"?e.jsx(Ie,{size:10}):e.jsx(os,{size:10})})]}),e.jsxs("div",{className:"stat-content",children:[e.jsxs("p",{className:"stat-value",children:[(((m=o==null?void 0:o.accuracy)==null?void 0:m.current)||0).toFixed(1),"%"]}),e.jsx("p",{className:"stat-label",children:"میانگین دقت"}),e.jsxs("p",{className:"stat-sublabel",children:[((N=o==null?void 0:o.accuracy)==null?void 0:N.trend)==="up"?"+":"-",Math.abs((((f=o==null?void 0:o.accuracy)==null?void 0:f.current)||0)-(((M=o==null?void 0:o.accuracy)==null?void 0:M.previous)||0)).toFixed(1),"% نسبت به قبل"]})]}),e.jsxs("div",{className:"stat-details",children:[e.jsxs("div",{className:`stat-change ${((J=o==null?void 0:o.accuracy)==null?void 0:J.trend)==="up"?"positive":"negative"}`,children:[(($=o==null?void 0:o.accuracy)==null?void 0:$.trend)==="up"?e.jsx(Ie,{size:8}):e.jsx(os,{size:8}),Math.abs((((Z=o==null?void 0:o.accuracy)==null?void 0:Z.current)||0)-(((G=o==null?void 0:o.accuracy)==null?void 0:G.previous)||0)).toFixed(1),"%"]}),e.jsx("div",{className:"stat-period",children:"7 روز"})]})]}),e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},className:"stat-card metric-blue",children:[e.jsxs("div",{className:"stat-header",children:[e.jsx("div",{className:"stat-icon",children:e.jsx(Jt,{size:14})}),e.jsx("span",{className:`stat-trend ${((O=o==null?void 0:o.performance)==null?void 0:O.trend)==="up"?"trend-up":"trend-down"}`,children:((q=o==null?void 0:o.performance)==null?void 0:q.trend)==="up"?e.jsx(Ie,{size:10}):e.jsx(os,{size:10})})]}),e.jsxs("div",{className:"stat-content",children:[e.jsxs("p",{className:"stat-value",children:[(((E=o==null?void 0:o.performance)==null?void 0:E.current)||0).toFixed(1),"%"]}),e.jsx("p",{className:"stat-label",children:"عملکرد سیستم"}),e.jsxs("p",{className:"stat-sublabel",children:[((k=o==null?void 0:o.performance)==null?void 0:k.trend)==="up"?"+":"-",Math.abs((((P=o==null?void 0:o.performance)==null?void 0:P.current)||0)-(((g=o==null?void 0:o.performance)==null?void 0:g.previous)||0)).toFixed(1),"% نسبت به قبل"]})]}),e.jsxs("div",{className:"stat-details",children:[e.jsxs("div",{className:`stat-change ${((D=o==null?void 0:o.performance)==null?void 0:D.trend)==="up"?"positive":"negative"}`,children:[((V=o==null?void 0:o.performance)==null?void 0:V.trend)==="up"?e.jsx(Ie,{size:8}):e.jsx(os,{size:8}),Math.abs((((F=o==null?void 0:o.performance)==null?void 0:F.current)||0)-(((ne=o==null?void 0:o.performance)==null?void 0:ne.previous)||0)).toFixed(1),"%"]}),e.jsx("div",{className:"stat-period",children:"7 روز"})]})]}),e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},className:"stat-card metric-green",children:[e.jsxs("div",{className:"stat-header",children:[e.jsx("div",{className:"stat-icon",children:e.jsx(ta,{size:14})}),e.jsx("span",{className:`stat-trend ${((X=o==null?void 0:o.throughput)==null?void 0:X.trend)==="up"?"trend-up":"trend-down"}`,children:((I=o==null?void 0:o.throughput)==null?void 0:I.trend)==="up"?e.jsx(Ie,{size:10}):e.jsx(os,{size:10})})]}),e.jsxs("div",{className:"stat-content",children:[e.jsx("p",{className:"stat-value",children:(((ee=o==null?void 0:o.throughput)==null?void 0:ee.current)||0).toLocaleString()}),e.jsx("p",{className:"stat-label",children:"توان عملیاتی"}),e.jsxs("p",{className:"stat-sublabel",children:[((le=o==null?void 0:o.throughput)==null?void 0:le.trend)==="up"?"+":"-",Math.abs((((se=o==null?void 0:o.throughput)==null?void 0:se.current)||0)-(((te=o==null?void 0:o.throughput)==null?void 0:te.previous)||0)).toLocaleString()," نسبت به قبل"]})]}),e.jsxs("div",{className:"stat-details",children:[e.jsxs("div",{className:`stat-change ${((ce=o==null?void 0:o.throughput)==null?void 0:ce.trend)==="up"?"positive":"negative"}`,children:[((S=o==null?void 0:o.throughput)==null?void 0:S.trend)==="up"?e.jsx(Ie,{size:8}):e.jsx(os,{size:8}),Math.abs((((Y=o==null?void 0:o.throughput)==null?void 0:Y.current)||0)-(((R=o==null?void 0:o.throughput)==null?void 0:R.previous)||0)).toLocaleString()]}),e.jsx("div",{className:"stat-period",children:"7 روز"})]})]}),e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.4},className:"stat-card metric-orange",children:[e.jsxs("div",{className:"stat-header",children:[e.jsx("div",{className:"stat-icon",children:e.jsx(ps,{size:14})}),e.jsx("span",{className:`stat-trend ${((ae=o==null?void 0:o.users)==null?void 0:ae.trend)==="up"?"trend-up":"trend-down"}`,children:((de=o==null?void 0:o.users)==null?void 0:de.trend)==="up"?e.jsx(Ie,{size:10}):e.jsx(os,{size:10})})]}),e.jsxs("div",{className:"stat-content",children:[e.jsx("p",{className:"stat-value",children:(((A=o==null?void 0:o.users)==null?void 0:A.current)||0).toLocaleString()}),e.jsx("p",{className:"stat-label",children:"کاربران فعال"}),e.jsxs("p",{className:"stat-sublabel",children:[((v=o==null?void 0:o.users)==null?void 0:v.trend)==="up"?"+":"-",Math.abs((((K=o==null?void 0:o.users)==null?void 0:K.current)||0)-(((C=o==null?void 0:o.users)==null?void 0:C.previous)||0)).toLocaleString()," نسبت به قبل"]})]}),e.jsxs("div",{className:"stat-details",children:[e.jsxs("div",{className:`stat-change ${((_=o==null?void 0:o.users)==null?void 0:_.trend)==="up"?"positive":"negative"}`,children:[((H=o==null?void 0:o.users)==null?void 0:H.trend)==="up"?e.jsx(Ie,{size:8}):e.jsx(os,{size:8}),Math.abs((((ie=o==null?void 0:o.users)==null?void 0:ie.current)||0)-(((ge=o==null?void 0:o.users)==null?void 0:ge.previous)||0)).toLocaleString()]}),e.jsx("div",{className:"stat-period",children:"7 روز"})]})]})]}),e.jsxs("div",{className:"charts-section",children:[e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.5},className:"chart-container",children:[e.jsxs("div",{className:"chart-header",children:[e.jsxs("h3",{className:"chart-title",children:[e.jsx(na,{size:20}),"نمودار عملکرد"]}),e.jsxs("div",{className:"chart-controls",children:[e.jsxs("button",{className:"chart-btn active",children:[e.jsx(ta,{size:16}),"ستونی"]}),e.jsxs("button",{className:"chart-btn",children:[e.jsx(na,{size:16}),"خطی"]}),e.jsxs("button",{className:"chart-btn",children:[e.jsx(Xn,{size:16}),"دایره‌ای"]})]})]}),e.jsx("div",{className:"chart-content",children:e.jsxs("div",{className:"chart-placeholder",children:[e.jsx(qs,{size:48,className:"chart-icon"}),e.jsx("p",{className:"chart-text",children:"نمودار عملکرد در دسترس است"})]})})]}),e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.6},className:"insights-container",children:[e.jsx("div",{className:"insights-header",children:e.jsxs("h3",{className:"insights-title",children:[e.jsx(Ne,{size:20}),"بینش‌های هوشمند"]})}),e.jsxs("div",{className:"insights-list",children:[e.jsxs(z.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:.7},className:"insight-item success",children:[e.jsx("div",{className:"insight-icon",children:e.jsx(Ie,{size:20})}),e.jsxs("div",{className:"insight-content",children:[e.jsx("h4",{className:"insight-title",children:"بهبود عملکرد"}),e.jsx("p",{className:"insight-description",children:"عملکرد سیستم در 7 روز گذشته 12% بهبود یافته است"})]})]}),e.jsxs(z.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:.8},className:"insight-item warning",children:[e.jsx("div",{className:"insight-icon",children:e.jsx(_s,{size:20})}),e.jsxs("div",{className:"insight-content",children:[e.jsx("h4",{className:"insight-title",children:"نیاز به بهینه‌سازی"}),e.jsx("p",{className:"insight-description",children:"توان عملیاتی در برخی ساعات کاهش یافته است"})]})]}),e.jsxs(z.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:.9},className:"insight-item info",children:[e.jsx("div",{className:"insight-icon",children:e.jsx(ps,{size:20})}),e.jsxs("div",{className:"insight-content",children:[e.jsx("h4",{className:"insight-title",children:"رشد کاربران"}),e.jsx("p",{className:"insight-description",children:"تعداد کاربران فعال 15% افزایش یافته است"})]})]})]})]})]}),e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.8},className:"recommendations-section",children:[e.jsx("div",{className:"recommendations-header",children:e.jsxs("h3",{className:"recommendations-title",children:[e.jsx(Ks,{size:20}),"توصیه‌های بهینه‌سازی"]})}),e.jsxs("div",{className:"recommendations-list",children:[e.jsxs(z.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:.9},className:"recommendation-item",children:[e.jsx("div",{className:"recommendation-number",children:"1"}),e.jsx("div",{className:"recommendation-content",children:e.jsx("p",{className:"recommendation-text",children:"افزایش منابع سرور برای بهبود عملکرد"})})]}),e.jsxs(z.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:1},className:"recommendation-item",children:[e.jsx("div",{className:"recommendation-number",children:"2"}),e.jsx("div",{className:"recommendation-content",children:e.jsx("p",{className:"recommendation-text",children:"بهینه‌سازی الگوریتم‌های یادگیری"})})]}),e.jsxs(z.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:1.1},className:"recommendation-item",children:[e.jsx("div",{className:"recommendation-number",children:"3"}),e.jsx("div",{className:"recommendation-content",children:e.jsx("p",{className:"recommendation-text",children:"پیاده‌سازی سیستم مانیتورینگ پیشرفته"})})]})]})]})]})}function fl(){const[t,s]=c.useState([]),[a,r]=c.useState(""),[n,l]=c.useState("downloads/exports"),[i,p]=c.useState(null),[o,u]=c.useState(null),[d,x]=c.useState(0);c.useRef(null);const[h,j]=c.useState(!0),[m,N]=c.useState(""),[f,M]=c.useState("all");c.useEffect(()=>{J()},[]);const J=async()=>{j(!0);try{const k=await me.getExports();if(k.ok&&k.data){const P=Array.isArray(k.data)?k.data:[];s(P)}else console.error("Error loading exports:",k.error),s([])}catch(k){console.error("Error loading exports:",k),s([])}finally{j(!1)}},$=t.filter(k=>{const P=k.name.toLowerCase().includes(m.toLowerCase())||k.description.toLowerCase().includes(m.toLowerCase()),g=f==="all"||k.type===f;return P&&g}),Z=t.reduce((k,P)=>k+Re(P==null?void 0:P.downloads,0),0),G=t.reduce((k,P)=>{const g=P==null?void 0:P.size;if(g==null)return k;if(typeof g=="number"&&Number.isFinite(g))return k+g/1024;const D=String(g).trim(),V=Re(parseFloat(D.replace(/[^\d.]/g,"")),0);if(!Number.isFinite(V)||V<=0)return k;const F=D.toLowerCase().includes("gb")?V:V/1024;return k+F},0),O=Number.isFinite(G)?G.toFixed(1):"0.0",q=k=>{switch(k){case"ready":return e.jsx(ke,{size:16,className:"text-green-500"});case"processing":return e.jsx(ve,{size:16,className:"text-blue-500 animate-spin"});case"error":return e.jsx(ve,{size:16,className:"text-red-500"});default:return e.jsx(ve,{size:16,className:"text-gray-500"})}},E=k=>{switch(k){case"report":return e.jsx(es,{size:20,className:"text-blue-500"});case"model":return e.jsx(Ke,{size:20,className:"text-purple-500"});default:return e.jsx(es,{size:20,className:"text-gray-500"})}};return h?e.jsxs("div",{className:"exports-page animate-fadeInUp",children:[e.jsx("div",{className:"page-header",children:e.jsxs("div",{children:[e.jsx("h1",{className:"page-title",children:"📤 مدیریت خروجی‌ها"}),e.jsx("p",{className:"helper",children:"مدیریت فایل‌های خروجی و گزارش‌ها"})]})}),e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{className:"loading-text",children:"در حال بارگذاری خروجی‌ها..."})]})]}):e.jsxs("div",{className:"container-12 animate-fadeInUp",children:[e.jsxs("div",{className:"page-header",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"page-title",children:"📤 مدیریت خروجی‌ها"}),e.jsx("p",{className:"helper",children:"مدیریت فایل‌های خروجی و گزارش‌ها"})]}),e.jsx("div",{className:"page-actions",children:e.jsxs("button",{className:"glass-button",children:[e.jsx(Fe,{size:16}),"بروزرسانی"]})})]}),e.jsxs("div",{className:"stats-grid",children:[e.jsxs("div",{className:"stat-card metric-purple animate-fadeInUp animation-delay-100",children:[e.jsxs("div",{className:"stat-header",children:[e.jsx("div",{className:"stat-icon",children:"📄"}),e.jsx("span",{className:"stat-trend",children:"↑"})]}),e.jsxs("div",{className:"stat-content",children:[e.jsx("p",{className:"stat-value",children:t.length}),e.jsx("p",{className:"stat-label",children:"فایل‌های خروجی"}),e.jsx("p",{className:"stat-sublabel",children:"کل فایل‌ها"})]})]}),e.jsxs("div",{className:"stat-card metric-blue animate-fadeInUp animation-delay-200",children:[e.jsxs("div",{className:"stat-header",children:[e.jsx("div",{className:"stat-icon",children:"📊"}),e.jsx("span",{className:"stat-trend",children:"↑"})]}),e.jsxs("div",{className:"stat-content",children:[e.jsx("p",{className:"stat-value",children:Z}),e.jsx("p",{className:"stat-label",children:"کل دانلودها"}),e.jsx("p",{className:"stat-sublabel",children:"این ماه"})]})]}),e.jsxs("div",{className:"stat-card metric-green animate-fadeInUp animation-delay-300",children:[e.jsx("div",{className:"stat-header",children:e.jsx("div",{className:"stat-icon",children:"💾"})}),e.jsxs("div",{className:"stat-content",children:[e.jsxs("p",{className:"stat-value",children:[Le(O)," GB"]}),e.jsx("p",{className:"stat-label",children:"حجم کل"}),e.jsx("p",{className:"stat-sublabel",children:"ذخیره‌سازی"})]})]}),e.jsxs("div",{className:"stat-card metric-orange animate-fadeInUp animation-delay-400",children:[e.jsx("div",{className:"stat-header",children:e.jsx("div",{className:"stat-icon",children:"✅"})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("p",{className:"stat-value",children:t.filter(k=>k.status==="ready").length}),e.jsx("p",{className:"stat-label",children:"آماده دانلود"}),e.jsxs("p",{className:"stat-sublabel",children:["از ",t.length," فایل"]})]})]})]}),e.jsxs("div",{className:"filters-section glass-card animate-fadeInUp animation-delay-500",children:[e.jsx("div",{className:"search-container",children:e.jsxs("div",{className:"search-box",children:[e.jsx(Je,{size:20}),e.jsx("input",{type:"text",className:"glass-input",placeholder:"جستجو در خروجی‌ها...",value:m,onChange:k=>N(k.target.value)})]})}),e.jsxs("div",{className:"filter-buttons",children:[e.jsxs("button",{className:`filter-btn ${f==="all"?"active":""}`,onClick:()=>M("all"),children:[e.jsx(es,{size:16}),"همه"]}),e.jsxs("button",{className:`filter-btn ${f==="report"?"active":""}`,onClick:()=>M("report"),children:[e.jsx(es,{size:16}),"گزارش‌ها"]}),e.jsxs("button",{className:`filter-btn ${f==="model"?"active":""}`,onClick:()=>M("model"),children:[e.jsx(Ke,{size:16}),"مدل‌ها"]})]})]}),e.jsx("div",{className:"exports-grid",children:$.length>0?$.map((k,P)=>e.jsxs("div",{className:"export-card interactive-card animate-fadeInUp",style:{animationDelay:`${P*.1}s`},children:[e.jsxs("div",{className:"export-header",children:[e.jsx("div",{className:"export-icon",children:E(k.type)}),e.jsxs("div",{className:"export-info",children:[e.jsx("h3",{className:"export-name",children:k.name}),e.jsx("p",{className:"export-description",children:Le(k==null?void 0:k.description,"بدون توضیحات")}),e.jsxs("div",{className:"export-meta",children:[e.jsx("span",{className:"export-format",children:Le(k==null?void 0:k.format,"نامشخص")}),e.jsx("span",{className:"export-size",children:Le(k==null?void 0:k.size,"0 MB")})]})]}),e.jsxs("div",{className:"export-status",children:[q(k.status),e.jsxs("span",{className:"status-text",children:[k.status==="ready"&&"آماده",k.status==="processing"&&"در حال پردازش",k.status==="error"&&"خطا"]})]})]}),e.jsxs("div",{className:"export-details",children:[e.jsxs("div",{className:"export-metrics",children:[e.jsxs("div",{className:"metric-item",children:[e.jsx(Te,{size:14}),e.jsxs("span",{children:[Le(Re(k==null?void 0:k.downloads,0))," دانلود"]})]}),e.jsxs("div",{className:"metric-item",children:[e.jsx(qt,{size:14}),e.jsx("span",{children:Le(k==null?void 0:k.createdAt,"نامشخص")})]})]}),e.jsx("div",{className:"export-footer",children:e.jsxs("div",{className:"export-actions",children:[e.jsx("button",{className:"action-btn",children:e.jsx(Ss,{size:16})}),e.jsx("button",{className:"action-btn",children:e.jsx(Te,{size:16})}),e.jsx("button",{className:"action-btn",children:e.jsx(Zn,{size:16})}),e.jsx("button",{className:"action-btn danger",children:e.jsx(Zs,{size:16})})]})})]})]},k.id)):e.jsxs("div",{className:"no-exports glass-card",children:[e.jsx(es,{size:64}),e.jsx("h3",{children:"هیچ خروجی‌ای یافت نشد"}),e.jsx("p",{children:"برای شروع، یک مدل آموزش دهید"})]})})]})}function yl(){const[t,s]=c.useState([]),[a,r]=c.useState(!0),[n,l]=c.useState(""),[i,p]=c.useState("all");c.useEffect(()=>{o()},[]);const o=async()=>{r(!0);try{const j=await me.getUsers();j.ok&&j.data?s(j.data):console.error("Error loading users:",j.error)}catch(j){console.error("Error loading users:",j)}finally{r(!1)}},u=t.filter(j=>{const m=j.name.toLowerCase().includes(n.toLowerCase())||j.email.toLowerCase().includes(n.toLowerCase()),N=i==="all"||j.role===i;return m&&N}),d=j=>{switch(j){case"active":return e.jsx(ke,{size:16,className:"text-green-500"});case"inactive":return e.jsx(ve,{size:16,className:"text-gray-500"});case"banned":return e.jsx(ve,{size:16,className:"text-red-500"});default:return e.jsx(ve,{size:16,className:"text-gray-500"})}},x=j=>{switch(j){case"admin":return e.jsx(aa,{size:20,className:"text-yellow-500"});case"moderator":return e.jsx($t,{size:20,className:"text-blue-500"});case"user":return e.jsx(ps,{size:20,className:"text-green-500"});default:return e.jsx(ps,{size:20,className:"text-gray-500"})}},h=j=>{switch(j){case"admin":return"مدیر";case"moderator":return"ناظر";case"user":return"کاربر";default:return"نامشخص"}};return a?e.jsxs("div",{className:"users-page animate-fadeInUp",children:[e.jsx("div",{className:"page-header",children:e.jsxs("div",{children:[e.jsx("h1",{className:"page-title",children:"👥 مدیریت کاربران"}),e.jsx("p",{className:"helper",children:"مدیریت کاربران و دسترسی‌ها"})]})}),e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{className:"loading-text",children:"در حال بارگذاری کاربران..."})]})]}):e.jsxs("div",{className:"container-12 animate-fadeInUp",children:[e.jsxs("div",{className:"page-header",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"page-title",children:"👥 مدیریت کاربران"}),e.jsx("p",{className:"helper",children:"مدیریت کاربران و دسترسی‌ها"})]}),e.jsx("div",{className:"page-actions",children:e.jsxs("button",{className:"glass-button",children:[e.jsx(ri,{size:16}),"افزودن کاربر"]})})]}),e.jsxs("div",{className:"stats-grid",children:[e.jsxs("div",{className:"stat-card metric-purple animate-fadeInUp animation-delay-100",children:[e.jsxs("div",{className:"stat-header",children:[e.jsx("div",{className:"stat-icon",children:"👥"}),e.jsx("span",{className:"stat-trend",children:"↑"})]}),e.jsxs("div",{className:"stat-content",children:[e.jsx("p",{className:"stat-value",children:t.length}),e.jsx("p",{className:"stat-label",children:"کل کاربران"}),e.jsx("p",{className:"stat-sublabel",children:"ثبت‌نام شده"})]})]}),e.jsxs("div",{className:"stat-card metric-blue animate-fadeInUp animation-delay-200",children:[e.jsxs("div",{className:"stat-header",children:[e.jsx("div",{className:"stat-icon",children:"✅"}),e.jsx("span",{className:"stat-trend",children:"↑"})]}),e.jsxs("div",{className:"stat-content",children:[e.jsx("p",{className:"stat-value",children:t.filter(j=>j.status==="active").length}),e.jsx("p",{className:"stat-label",children:"کاربران فعال"}),e.jsx("p",{className:"stat-sublabel",children:"آنلاین"})]})]}),e.jsxs("div",{className:"stat-card metric-green animate-fadeInUp animation-delay-300",children:[e.jsx("div",{className:"stat-header",children:e.jsx("div",{className:"stat-icon",children:"👑"})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("p",{className:"stat-value",children:t.filter(j=>j.role==="admin").length}),e.jsx("p",{className:"stat-label",children:"مدیران"}),e.jsx("p",{className:"stat-sublabel",children:"دسترسی کامل"})]})]}),e.jsxs("div",{className:"stat-card metric-orange animate-fadeInUp animation-delay-400",children:[e.jsx("div",{className:"stat-header",children:e.jsx("div",{className:"stat-icon",children:"🛡️"})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("p",{className:"stat-value",children:t.filter(j=>j.role==="moderator").length}),e.jsx("p",{className:"stat-label",children:"ناظران"}),e.jsx("p",{className:"stat-sublabel",children:"دسترسی محدود"})]})]})]}),e.jsxs("div",{className:"filters-section glass-card animate-fadeInUp animation-delay-500",children:[e.jsx("div",{className:"search-container",children:e.jsxs("div",{className:"search-box",children:[e.jsx(Je,{size:20}),e.jsx("input",{type:"text",className:"glass-input",placeholder:"جستجو در کاربران...",value:n,onChange:j=>l(j.target.value)})]})}),e.jsxs("div",{className:"filter-buttons",children:[e.jsxs("button",{className:`filter-btn ${i==="all"?"active":""}`,onClick:()=>p("all"),children:[e.jsx(ps,{size:16}),"همه"]}),e.jsxs("button",{className:`filter-btn ${i==="admin"?"active":""}`,onClick:()=>p("admin"),children:[e.jsx(aa,{size:16}),"مدیران"]}),e.jsxs("button",{className:`filter-btn ${i==="moderator"?"active":""}`,onClick:()=>p("moderator"),children:[e.jsx($t,{size:16}),"ناظران"]}),e.jsxs("button",{className:`filter-btn ${i==="user"?"active":""}`,onClick:()=>p("user"),children:[e.jsx(ps,{size:16}),"کاربران"]})]})]}),e.jsx("div",{className:"users-grid",children:u.length>0?u.map((j,m)=>e.jsxs("div",{className:"user-card interactive-card animate-fadeInUp",style:{animationDelay:`${m*.1}s`},children:[e.jsxs("div",{className:"user-header",children:[e.jsx("div",{className:"user-avatar",children:e.jsx("span",{className:"avatar-text",children:j.avatar})}),e.jsxs("div",{className:"user-info",children:[e.jsx("h3",{className:"user-name",children:j.name}),e.jsx("p",{className:"user-email",children:j.email}),e.jsxs("div",{className:"user-role",children:[x(j.role),e.jsx("span",{children:h(j.role)})]})]}),e.jsxs("div",{className:"user-status",children:[d(j.status),e.jsxs("span",{className:"status-text",children:[j.status==="active"&&"فعال",j.status==="inactive"&&"غیرفعال",j.status==="banned"&&"مسدود"]})]})]}),e.jsxs("div",{className:"user-details",children:[e.jsxs("div",{className:"user-metrics",children:[e.jsxs("div",{className:"metric-item",children:[e.jsx(qt,{size:14}),e.jsxs("span",{children:["عضویت: ",j.joinDate]})]}),e.jsxs("div",{className:"metric-item",children:[e.jsx(ve,{size:14}),e.jsxs("span",{children:["آخرین ورود: ",j.lastLogin]})]})]}),e.jsxs("div",{className:"user-permissions",children:[e.jsx("div",{className:"permissions-label",children:"دسترسی‌ها:"}),e.jsx("div",{className:"permissions-list",children:j.permissions.map((N,f)=>e.jsxs("span",{className:"permission-tag",children:[N==="read"&&"خواندن",N==="write"&&"نوشتن",N==="moderate"&&"نظارت",N==="admin"&&"مدیریت"]},f))})]}),e.jsx("div",{className:"user-footer",children:e.jsxs("div",{className:"user-actions",children:[e.jsx("button",{className:"action-btn",children:e.jsx(Ss,{size:16})}),e.jsx("button",{className:"action-btn",children:e.jsx(Kn,{size:16})}),e.jsx("button",{className:"action-btn",children:e.jsx(Wn,{size:16})}),e.jsx("button",{className:"action-btn danger",children:e.jsx(Zs,{size:16})})]})})]})]},j.id)):e.jsxs("div",{className:"no-users glass-card",children:[e.jsx(ps,{size:64}),e.jsx("h3",{children:"هیچ کاربری یافت نشد"}),e.jsx("p",{children:"برای شروع، کاربر جدید اضافه کنید"})]})})]})}function jl({onUpdate:t,onToast:s}){const[a,r]=c.useState(""),[n,l]=c.useState(""),[i,p]=c.useState(!1),[o,u]=c.useState([]),[d,x]=c.useState(!1),[h,j]=c.useState(""),[m,N]=c.useState([]),[f,M]=c.useState(!1),[J,$]=c.useState(null),[Z,G]=c.useState(null),[O,q]=c.useState(!1),[E,k]=c.useState(!1),[P,g]=c.useState(null),[D,V]=c.useState("all"),[F,ne]=c.useState("");c.useEffect(()=>{X(),I()},[]);const X=async()=>{try{p(!0);const A=await me.getSettings();if(A){const v=A;v.hf_token&&r(v.hf_token),v.storage_root&&l(v.storage_root),s("تنظیمات بارگذاری شد","success")}else s("خطا در بارگذاری تنظیمات","error")}catch(A){console.error("Error loading settings:",A),s("خطا در بارگذاری تنظیمات","error")}finally{p(!1)}},I=async()=>{G({totalSize:"12.5 GB",availableSpace:"48.2 GB",modelsCount:8,datasetsCount:3})},ee=async A=>{if(A.preventDefault(),!n.trim()){s("لطفاً مسیر ذخیره‌سازی را وارد کنید","error");return}try{q(!0);const v=await me.saveSettings({hf_token:a.trim()||void 0,storage_root:n.trim()});v?(t({storage_root:n}),s("تنظیمات با موفقیت ذخیره شدند ✓","success"),await I()):s(v.error||"خطا در ذخیره تنظیمات","error")}catch(v){console.error("Error saving settings:",v),s("خطا در ذخیره تنظیمات","error")}finally{q(!1)}},le=async A=>{if(A.preventDefault(),!h.trim()){s("لطفاً مسیر را وارد کنید","error");return}try{x(!0),g(null),u([]),N([]);const v=await me.scanAssets(h);if(console.log("📥 نتیجه اسکن:",v),v&&v.ok&&v.data){const K=v.data;g(K),u(K.items||[]),K.items&&K.items.length>0?s(`${K.items.length} فایل پیدا شد`,"success"):s("هیچ فایلی یافت نشد","info")}else s((v==null?void 0:v.error)||"خطا در اسکن پوشه","error"),g(null),u([])}catch(v){console.error("Error scanning folder:",v),s("خطا در اسکن پوشه","error")}finally{x(!1)}},se=A=>{N(v=>v.includes(A)?v.filter(K=>K!==A):[...v,A])},te=()=>{m.length===o.length?N([]):N(o.map((A,v)=>v))},ce=async()=>{var A,v;if(m.length===0){s("لطفاً موارد را انتخاب کنید","error");return}try{k(!0),$({current:0,total:m.length});const K=m.map(_=>o[_]);for(let _=0;_<m.length;_++)await new Promise(H=>setTimeout(H,500)),$({current:_+1,total:m.length});const C=await me.importAssets(K);if(console.log("📥 نتیجه واردات:",C),C&&C.ok){const _=C.data||{},H=((A=_.counts)==null?void 0:A.total)||0,ie=((v=_.counts)==null?void 0:v.skipped)||0;u([]),N([]),j(""),g(null),$(null),H>0&&ie>0?s(`✅ ${H} مورد جدید واردات شد، ${ie} مورد قبلاً وجود داشت`,"success"):H>0?s(`✅ ${H} مورد جدید واردات شد`,"success"):ie>0?s(`ℹ️ تمام ${ie} مورد قبلاً وارد شده بودند`,"info"):s("هیچ موردی برای واردات وجود ندارد","info"),await I(),t&&t()}else s((C==null?void 0:C.error)||"خطا در واردات","error")}catch(K){console.error("Error importing items:",K),s("خطا در واردات","error")}finally{k(!1),$(null)}},S=A=>{if(A===0)return"0 B";const v=1024,K=["B","KB","MB","GB"],C=Math.floor(Math.log(A)/Math.log(v));return Math.round(A/Math.pow(v,C)*100)/100+" "+K[C]},Y=A=>{switch(A){case"model":return"🤖";case"chat-model":return"💬";case"tts-model":return"🎤";case"dataset":return"📊";case"checkpoint":return"💾";case"config":return"⚙️";case"vocabulary":return"📚";case"audio":return"🎵";case"image":return"🖼️";case"code":return"💻";case"document":return"📄";case"archive":return"📦";case"directory":return"📁";default:return"📄"}},R=Vs.useMemo(()=>{if(!o.length)return[];let A=o;return D!=="all"&&(A=A.filter(v=>v.kind===D)),F&&(A=A.filter(v=>v.name.toLowerCase().includes(F.toLowerCase())||v.path.toLowerCase().includes(F.toLowerCase()))),A},[o,D,F]),ae=async()=>{try{if(window.showDirectoryPicker){const A=await window.showDirectoryPicker();l(A.name)}else{const A=document.createElement("input");A.type="file",A.webkitdirectory=!0,A.onchange=v=>{if(v.target.files.length>0){const K=v.target.files[0].webkitRelativePath;if(K){const C=K.split("/")[0];l(C)}}},A.click()}}catch(A){console.error("Error browsing folder:",A),s("خطا در انتخاب پوشه","error")}},de=async()=>{try{if(window.showDirectoryPicker){const A=await window.showDirectoryPicker();j(A.name)}else{const A=document.createElement("input");A.type="file",A.webkitdirectory=!0,A.onchange=v=>{if(v.target.files.length>0){const K=v.target.files[0].webkitRelativePath;if(K){const C=K.split("/")[0];j(C)}}},A.click()}}catch(A){console.error("Error browsing scan path:",A),s("خطا در انتخاب مسیر اسکن","error")}};return i?e.jsx("div",{className:"settings-page animate-fadeInUp",children:e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner"}),e.jsx("p",{className:"loading-text",children:"در حال بارگذاری تنظیمات..."})]})}):e.jsxs("div",{className:"container-12 animate-fadeInUp",children:[e.jsxs("div",{className:"page-header",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"page-title",children:[e.jsx(Ds,{size:32}),"تنظیمات سیستم"]}),e.jsx("p",{className:"helper",children:"مدیریت پیکربندی و فضای ذخیره‌سازی"})]}),e.jsx("div",{className:"btn-group",children:e.jsxs("button",{className:"btn btn-secondary",onClick:X,disabled:i,children:[e.jsx(Fe,{size:16,className:i?"animate-spin":""}),"بروزرسانی"]})})]}),Z&&e.jsxs("div",{className:"stats-grid",children:[e.jsxs("div",{className:"stat-card animate-fadeInUp animation-delay-100",children:[e.jsx("div",{className:"stat-value",children:Z.totalSize}),e.jsx("div",{className:"stat-label",children:"فضای استفاده شده"})]}),e.jsxs("div",{className:"stat-card animate-fadeInUp animation-delay-200",children:[e.jsx("div",{className:"stat-value",children:Z.availableSpace}),e.jsx("div",{className:"stat-label",children:"فضای موجود"})]}),e.jsxs("div",{className:"stat-card animate-fadeInUp animation-delay-300",children:[e.jsx("div",{className:"stat-value",children:Z.modelsCount+Z.datasetsCount}),e.jsx("div",{className:"stat-label",children:"تعداد فایل‌ها"})]})]}),e.jsxs("div",{className:"settings-form animate-fadeInUp animation-delay-400",children:[e.jsxs("h2",{className:"scanner-title",children:[e.jsx(ra,{size:24}),"تنظیمات اصلی"]}),e.jsxs("form",{onSubmit:ee,className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"form-label",children:[e.jsx(ra,{size:16}),"توکن Hugging Face"]}),e.jsxs("div",{className:"input-with-icon",children:[e.jsx("input",{type:f?"text":"password",className:"form-input",placeholder:"توکن Hugging Face خود را وارد کنید",value:a,onChange:A=>r(A.target.value)}),e.jsx("button",{type:"button",className:"token-toggle",onClick:()=>M(!f),children:f?e.jsx(Un,{size:16}):e.jsx(Ss,{size:16})})]}),e.jsx("p",{className:"form-hint",children:"اختیاری - برای دانلود مدل‌های محدود دسترسی"})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"form-label",children:[e.jsx(hs,{size:16}),"مسیر ذخیره‌سازی"]}),e.jsxs("div",{className:"input-with-icon",children:[e.jsx("input",{type:"text",className:"form-input",placeholder:"مثال: C:\\models\\store",value:n,onChange:A=>l(A.target.value),required:!0}),e.jsx("button",{type:"button",className:"folder-browser",onClick:ae,children:e.jsx(ds,{size:16})})]}),e.jsx("p",{className:"form-hint",children:"مسیری که مدل‌ها و دارایی‌ها در آن ذخیره شوند"})]})]}),e.jsx("div",{className:"btn-group",children:e.jsx("button",{type:"submit",className:"btn btn-primary",onClick:ee,disabled:O||!n.trim(),children:O?e.jsxs(e.Fragment,{children:[e.jsx(xs,{size:16,className:"animate-spin"}),"در حال ذخیره..."]}):e.jsxs(e.Fragment,{children:[e.jsx(_a,{size:16}),"ذخیره تنظیمات"]})})})]}),e.jsxs("div",{className:"scanner-section animate-fadeInUp animation-delay-500",children:[e.jsx("div",{className:"scanner-header",children:e.jsxs("h2",{className:"scanner-title",children:[e.jsx(On,{size:24}),"اسکن و واردات فایل‌ها"]})}),e.jsx("form",{onSubmit:le,className:"form-grid",children:e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"form-label",children:[e.jsx(Je,{size:16}),"مسیر پوشه برای اسکن"]}),e.jsxs("div",{className:"input-with-icon",children:[e.jsx("input",{type:"text",className:"form-input",placeholder:"مثال: C:\\models",value:h,onChange:A=>j(A.target.value)}),e.jsx("button",{type:"button",className:"folder-browser",onClick:de,children:e.jsx(ds,{size:16})})]}),e.jsx("p",{className:"form-hint",children:"مسیر پوشه برای اسکن و واردات فایل‌ها"})]})}),e.jsx("div",{className:"btn-group",children:e.jsx("button",{type:"button",className:"btn btn-primary",onClick:le,disabled:d||!h.trim(),children:d?e.jsxs(e.Fragment,{children:[e.jsx(xs,{size:16,className:"animate-spin"}),"در حال اسکن..."]}):e.jsxs(e.Fragment,{children:[e.jsx(Je,{size:16}),"شروع اسکن"]})})}),R.length>0&&e.jsxs("div",{className:"scanned-section animate-fadeInUp animation-delay-600",children:[e.jsxs("div",{className:"scanned-header",children:[e.jsxs("h4",{className:"scanned-title",children:["فایل‌های یافت شده (",R.length,")"]}),e.jsx("div",{className:"btn-group",children:e.jsx("button",{className:"btn btn-secondary",onClick:te,children:m.length===R.length?"لغو انتخاب همه":"انتخاب همه"})})]}),e.jsxs("div",{className:"form-grid",style:{marginBottom:"1rem"},children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"form-label",children:[e.jsx(Ha,{size:16}),"فیلتر بر اساس نوع"]}),e.jsxs("select",{className:"form-input",value:D,onChange:A=>V(A.target.value),children:[e.jsx("option",{value:"all",children:"همه انواع"}),e.jsx("option",{value:"model",children:"مدل"}),e.jsx("option",{value:"chat-model",children:"مدل چت"}),e.jsx("option",{value:"tts-model",children:"مدل TTS"}),e.jsx("option",{value:"dataset",children:"دیتاست"}),e.jsx("option",{value:"config",children:"پیکربندی"}),e.jsx("option",{value:"audio",children:"صوتی"}),e.jsx("option",{value:"image",children:"تصویری"}),e.jsx("option",{value:"code",children:"کد"}),e.jsx("option",{value:"document",children:"مستندات"}),e.jsx("option",{value:"archive",children:"فایل فشرده"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{className:"form-label",children:[e.jsx(Je,{size:16}),"جستجو"]}),e.jsx("input",{type:"text",className:"form-input",placeholder:"جستجو در فایل‌ها...",value:F,onChange:A=>ne(A.target.value)})]})]}),e.jsx("div",{className:"scanned-list",children:R.map((A,v)=>e.jsxs("div",{className:`scanned-item ${m.includes(v)?"selected":""}`,onClick:()=>se(v),children:[e.jsx("input",{type:"checkbox",checked:m.includes(v),onChange:()=>{},style:{margin:0}}),e.jsx("div",{className:"item-icon",children:Y(A.kind)}),e.jsxs("div",{className:"item-details",children:[e.jsx("h5",{className:"item-name",children:A.name}),e.jsxs("div",{className:"item-meta",children:[e.jsx("span",{className:"meta-tag",children:A.kind}),e.jsx("span",{className:"meta-size",children:S(A.size)})]}),e.jsx("p",{className:"item-path",children:A.path})]})]},v))}),J&&e.jsxs("div",{className:"progress",children:[e.jsxs("div",{className:"progress-info",children:[e.jsx(xs,{size:16,className:"animate-spin"}),e.jsxs("span",{children:["در حال واردات... (",J.current,"/",J.total,")"]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${J.current/J.total*100}%`}})})]}),e.jsx("div",{className:"btn-group",children:e.jsx("button",{className:"btn btn-success",onClick:ce,disabled:m.length===0||E,children:E?e.jsxs(e.Fragment,{children:[e.jsx(xs,{size:16,className:"animate-spin"}),"در حال واردات..."]}):e.jsxs(e.Fragment,{children:[e.jsx(Ms,{size:16}),"واردات ",m.length," مورد"]})})})]})]})]})}const bl=t=>Array.isArray(t)?t:t&&Array.isArray(t.items)?t.items:t&&Array.isArray(t.results)?t.results:t&&Array.isArray(t.data)?t.data:t&&typeof t=="object"?Object.values(t):[],vl=()=>{const[t,s]=c.useState([]),[a,r]=c.useState(!0),[n,l]=c.useState(null),[i,p]=c.useState(1),[o,u]=c.useState(1),[d,x]=c.useState(1),h=6;c.useEffect(()=>{j();const E=setInterval(j,3e3);return()=>clearInterval(E)},[]);const j=async()=>{try{const E=await me.getTrainingJobs();E&&E.ok?s(bl(E.data)):(console.error("Error loading training jobs:",(E==null?void 0:E.error)||"Unknown error"),s([])),r(!1)}catch(E){console.error("Error loading training jobs:",E),s([]),r(!1)}},m=E=>{const k=E.progress||0;return E.status==="completed"?{state:"ready",icon:ke,temp:"perfect",color:"#10b981"}:E.status==="failed"||E.status==="error"?{state:"burnt",icon:Xe,temp:"too hot",color:"#ef4444"}:k===0?{state:"preheating",icon:si,temp:"warming up",color:"#8b5cf6"}:k<30?{state:"simmering",icon:Pn,temp:"low heat",color:"#3b82f6"}:k<70?{state:"boiling",icon:kt,temp:"high heat",color:"#f59e0b"}:{state:"finishing",icon:ii,temp:"cooling down",color:"#06b6d4"}};if(a)return e.jsxs("div",{className:"kitchen-loading",children:[e.jsx(z.div,{animate:{rotate:360},transition:{duration:2,repeat:1/0,ease:"linear"},children:e.jsx(lt,{size:64})}),e.jsx("p",{children:"در حال بارگذاری آشپزخانه..."})]});const N=t.filter(E=>E.status==="running"||E.status==="training"),f=t.filter(E=>E.status==="completed"),M=t.filter(E=>E.status==="failed"||E.status==="error"),J=N.slice((i-1)*h,i*h),$=f.slice((o-1)*h,o*h),Z=M.slice((d-1)*h,d*h),G=Math.ceil(N.length/h),O=Math.ceil(f.length/h),q=Math.ceil(M.length/h);return e.jsxs("div",{className:"container-12",children:[e.jsxs(z.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},className:"kitchen-header",children:[e.jsxs("div",{className:"kitchen-title",children:[e.jsx(lt,{size:48,className:"chef-icon"}),e.jsxs("div",{children:[e.jsx("h1",{children:"🍳 آشپزخانه مدل‌سازی"}),e.jsx("p",{children:"مدل‌های شما در حال پخت هستند!"})]})]}),e.jsxs("div",{className:"kitchen-stats",children:[e.jsxs("div",{className:"stat-badge active",children:[e.jsx(kt,{size:20}),e.jsxs("span",{children:[N.length," در حال پخت"]})]}),e.jsxs("div",{className:"stat-badge success",children:[e.jsx(ke,{size:20}),e.jsxs("span",{children:[f.length," آماده"]})]}),e.jsxs("div",{className:"stat-badge error",children:[e.jsx(Xe,{size:20}),e.jsxs("span",{children:[M.length," سوخته"]})]})]})]}),N.length>0&&e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},className:"cooking-section active-section",children:[e.jsxs("h2",{className:"section-title",children:[e.jsx(kt,{size:24,className:"flame-icon"}),"در حال پخت (اجرای فعال)"]}),e.jsx("div",{className:"stoves-grid",children:J.map(E=>{const k=m(E);return e.jsx(wl,{job:E,cookingState:k,onClick:()=>l(E)},E.id)})}),G>1&&e.jsxs("div",{className:"pagination",children:[e.jsx("button",{onClick:()=>p(E=>Math.max(1,E-1)),disabled:i===1,className:"pagination-btn",children:"قبلی"}),e.jsxs("span",{className:"pagination-info",children:["صفحه ",i," از ",G]}),e.jsx("button",{onClick:()=>p(E=>Math.min(G,E+1)),disabled:i===G,className:"pagination-btn",children:"بعدی"})]})]}),t.filter(E=>E.status==="pending"||E.status==="queued").length>0&&e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},className:"cooking-section queue-section",children:[e.jsxs("h2",{className:"section-title",children:[e.jsx(ve,{size:24}),"در صف انتظار"]}),e.jsx("div",{className:"queue-list",children:t.filter(E=>E.status==="pending"||E.status==="queued").map((E,k)=>e.jsx(Nl,{job:E,position:k+1},E.id))})]}),f.length>0&&e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},className:"cooking-section completed-section",children:[e.jsxs("h2",{className:"section-title",children:[e.jsx(ke,{size:24}),"غذاهای آماده (مدل‌های کامل)"]}),e.jsx("div",{className:"completed-grid",children:$.map(E=>e.jsx(kl,{job:E},E.id))}),O>1&&e.jsxs("div",{className:"pagination",children:[e.jsx("button",{onClick:()=>u(E=>Math.max(1,E-1)),disabled:o===1,className:"pagination-btn",children:"قبلی"}),e.jsxs("span",{className:"pagination-info",children:["صفحه ",o," از ",O]}),e.jsx("button",{onClick:()=>u(E=>Math.min(O,E+1)),disabled:o===O,className:"pagination-btn",children:"بعدی"})]})]}),M.length>0&&e.jsxs(z.div,{initial:{opacity:0},animate:{opacity:1},className:"cooking-section failed-section",children:[e.jsxs("h2",{className:"section-title",children:[e.jsx(Xe,{size:24}),"غذاهای سوخته (خطاها)"]}),e.jsx("div",{className:"failed-list",children:Z.map(E=>e.jsx(Sl,{job:E},E.id))}),q>1&&e.jsxs("div",{className:"pagination",children:[e.jsx("button",{onClick:()=>x(E=>Math.max(1,E-1)),disabled:d===1,className:"pagination-btn",children:"قبلی"}),e.jsxs("span",{className:"pagination-info",children:["صفحه ",d," از ",q]}),e.jsx("button",{onClick:()=>x(E=>Math.min(q,E+1)),disabled:d===q,className:"pagination-btn",children:"بعدی"})]})]}),t.length===0&&e.jsxs(z.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},className:"kitchen-empty",children:[e.jsx(lt,{size:120}),e.jsx("h2",{children:"آشپزخانه خالی است!"}),e.jsx("p",{children:"هنوز هیچ مدلی در حال آموزش نیست"}),e.jsxs("button",{className:"btn-start-cooking",onClick:()=>window.location.href="/train",children:[e.jsx(Lt,{size:20}),"شروع پخت مدل جدید"]})]}),e.jsx(Be,{children:n&&e.jsx(Cl,{job:n,onClose:()=>l(null)})}),e.jsx("style",{children:`
        .kitchen-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 32px;
        }

        /* Header */
        .kitchen-header {
          background: white;
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .kitchen-title {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .chef-icon {
          color: #f59e0b;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .kitchen-title h1 {
          font-size: 32px;
          font-weight: 800;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .kitchen-title p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .kitchen-stats {
          display: flex;
          gap: 16px;
        }

        .stat-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
        }

        .stat-badge.active {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .stat-badge.success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .stat-badge.error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        /* Sections */
        .cooking-section {
          background: white;
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 24px 0;
        }

        .flame-icon {
          color: #f59e0b;
          animation: flicker 1s ease-in-out infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        /* Stoves Grid */
        .stoves-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        /* Queue & Other Lists */
        .queue-list,
        .completed-grid,
        .failed-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid #f3f4f6;
        }
        
        .pagination-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .pagination-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-info {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
        }

        .completed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        /* Empty State */
        .kitchen-empty {
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .kitchen-empty svg {
          color: #d1d5db;
          margin-bottom: 24px;
        }

        .kitchen-empty h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .kitchen-empty p {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 32px 0;
        }

        .btn-start-cooking {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-start-cooking:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(245, 158, 11, 0.3);
        }

        /* Loading */
        .kitchen-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #1f2937;
        }

        .kitchen-loading p {
          margin-top: 24px;
          font-size: 18px;
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .kitchen-container {
            padding: 16px;
          }

          .kitchen-header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .kitchen-stats {
            flex-wrap: wrap;
          }

          .stoves-grid {
            grid-template-columns: 1fr;
          }
        }
      `})]})},wl=({job:t,cookingState:s,onClick:a})=>{var o,u;const{state:r,icon:n,temp:l,color:i}=s,p=t.progress||0;return e.jsxs(z.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},whileHover:{scale:1.02},className:"stove-card",onClick:a,style:{borderColor:i},children:[e.jsx("div",{className:"stove-icon",style:{background:`${i}20`},children:e.jsx(z.div,{animate:{scale:r==="boiling"?[1,1.2,1]:[1,1.05,1],rotate:r==="boiling"?[0,5,-5,0]:0},transition:{duration:r==="boiling"?.5:1.5,repeat:1/0},children:e.jsx(n,{size:32,style:{color:i}})})}),e.jsxs("div",{className:"stove-info",children:[e.jsx("h3",{className:"stove-title",children:t.baseModel||t.id||"مدل در حال آموزش"}),e.jsxs("div",{className:"stove-state",style:{color:i},children:[e.jsx("span",{className:"state-label",children:l}),e.jsxs("span",{className:"state-name",children:["(",r,")"]})]})]}),e.jsxs("div",{className:"stove-progress",children:[e.jsxs("div",{className:"progress-header",children:[e.jsx("span",{children:"پیشرفت پخت"}),e.jsxs("strong",{children:[p,"%"]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx(z.div,{className:"progress-fill",style:{background:i},initial:{width:0},animate:{width:`${p}%`},transition:{duration:.5}})})]}),e.jsxs("div",{className:"stove-metrics",children:[t.startedAt&&e.jsxs("div",{className:"metric",children:[e.jsx(ve,{size:14}),e.jsxs("span",{children:["شروع: ",new Date(t.startedAt).toLocaleTimeString("fa-IR")]})]}),((o=t.metrics)==null?void 0:o.epoch)&&e.jsxs("div",{className:"metric",children:[e.jsx(Xs,{size:14}),e.jsxs("span",{children:["Epoch: ",t.metrics.epoch]})]}),((u=t.metrics)==null?void 0:u.trainLoss)&&e.jsxs("div",{className:"metric",children:[e.jsx(Ie,{size:14}),e.jsxs("span",{children:["Loss: ",parseFloat(t.metrics.trainLoss).toFixed(4)]})]}),t.message&&e.jsxs("div",{className:"metric",children:[e.jsx(Pe,{size:14}),e.jsx("span",{children:t.message})]})]}),r==="boiling"&&e.jsx("div",{className:"heat-waves",children:[0,1,2].map(d=>e.jsx(z.div,{className:"heat-wave",animate:{y:[-20,-60],opacity:[.6,0],scale:[.8,1.2]},transition:{duration:1.5,repeat:1/0,delay:d*.3}},d))}),e.jsx("style",{children:`
        .stove-card {
          position: relative;
          background: white;
          border: 3px solid;
          border-radius: 20px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s;
          overflow: hidden;
        }

        .stove-card:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .stove-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .stove-info {
          margin-bottom: 16px;
        }

        .stove-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .stove-state {
          display: flex;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
        }

        .stove-progress {
          margin-bottom: 16px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
        }

        .progress-bar {
          height: 10px;
          background: #f3f4f6;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
        }

        .stove-metrics {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
        }
        
        .job-time {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
        }

        .heat-waves {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 100px;
          pointer-events: none;
        }

        .heat-wave {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, #f59e0b 0%, transparent 70%);
          border-radius: 50%;
        }
      `})]})},Nl=({job:t,position:s})=>e.jsxs("div",{className:"queue-card",children:[e.jsxs("div",{className:"queue-position",children:["#",s]}),e.jsxs("div",{className:"queue-info",children:[e.jsx("h4",{children:t.baseModel||t.id||"مدل در صف"}),e.jsx("p",{children:"در انتظار اجرا..."})]})]}),kl=({job:t})=>e.jsxs("div",{className:"completed-card",children:[e.jsx(ke,{size:32,color:"#10b981"}),e.jsx("h4",{children:t.baseModel||t.id||"مدل تکمیل شده"}),e.jsx("p",{children:"آماده برای استفاده"}),t.finishedAt&&e.jsxs("p",{className:"job-time",children:["تکمیل: ",new Date(t.finishedAt).toLocaleDateString("fa-IR")]})]}),Sl=({job:t})=>e.jsxs("div",{className:"failed-card",children:[e.jsx(Xe,{size:24,color:"#ef4444"}),e.jsxs("div",{children:[e.jsx("h4",{children:t.baseModel||t.id||"مدل ناموفق"}),e.jsx("p",{children:t.message||"خطای نامشخص"})]})]}),Cl=({job:t,onClose:s})=>e.jsx(z.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"modal-overlay",onClick:s,children:e.jsxs(z.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},className:"modal-content",onClick:a=>a.stopPropagation(),children:[e.jsx("h2",{children:"جزئیات آموزش"}),e.jsx("pre",{children:JSON.stringify(t,null,2)}),e.jsx("button",{onClick:s,children:"بستن"})]})}),El=()=>{const[t,s]=c.useState("datasets"),[a,r]=c.useState([]),[n,l]=c.useState(!0),[i,p]=c.useState(""),[o,u]=c.useState("all"),[d,x]=c.useState(!1);c.useEffect(()=>{h()},[t]);const h=async()=>{x(!0);try{let g;try{switch(t){case"models":g=await Ee.getModels();break;case"datasets":g=await Ee.getDatasets();break;case"tts":g=await Ee.getTTSModels();break;default:g=await Ee.getModels()}if(g&&g.ok){const V=(g.data||[]).map(F=>({id:F.id||F._id,name:F.name||F.filename||"بدون نام",description:F.description||F.type||"بدون توضیح",size:F.size||"نامشخص",status:m(F),type:F.type||t,createdAt:N(F.createdAt||F.downloadDate),downloads:F.downloads||0,progress:F.progress||0,filePath:F.path||F.filePath,error:F.error,isHuggingFace:F.isHuggingFace||!1}));r(V)}else throw new Error("API response not ok")}catch(D){console.log("Using mock data due to API error:",D);const V=j();r(V[t]||[])}}catch(g){console.error("Error loading downloads:",g),T.error("خطا در بارگذاری منابع"),r([])}finally{l(!1),x(!1)}},j=()=>({datasets:[{id:"dataset-1",name:"دیتاست متن فارسی",description:"مجموعه داده‌های متنی برای آموزش مدل‌های NLP",size:"2.1GB",status:"ready",type:"text",createdAt:"۱۴۰۲/۱۰/۱۵",downloads:45,progress:100},{id:"dataset-2",name:"دیتاست تصاویر",description:"تصاویر برای آموزش مدل‌های بینایی کامپیوتر",size:"4.5GB",status:"downloading",type:"vision",createdAt:"۱۴۰۲/۱۰/۱۶",downloads:23,progress:65}],models:[{id:"model-1",name:"مدل پردازش متن",description:"مدل آموزش دیده برای پردازش زبان فارسی",size:"780MB",status:"ready",type:"text",createdAt:"۱۴۰۲/۱۰/۱۲",downloads:89,progress:100,isHuggingFace:!0},{id:"model-2",name:"مدل تشخیص اشیاء",description:"مدل بینایی کامپیوتر برای تشخیص اشیاء",size:"1.2GB",status:"error",type:"vision",createdAt:"۱۴۰۲/۱۰/۱۴",downloads:34,progress:45,error:"خطا در اتصال به سرور"}],tts:[{id:"tts-1",name:"مدل TTS فارسی",description:"مدل تبدیل متن به گفتار برای زبان فارسی",size:"890MB",status:"ready",type:"audio",createdAt:"۱۴۰۲/۱۰/۱۰",downloads:67,progress:100}]}),m=g=>g.status?g.status:g.progress===100?"ready":g.progress>0?"downloading":g.error?"error":"ready",N=g=>{if(!g)return"نامشخص";try{const D=new Date(g);return new Intl.DateTimeFormat("fa-IR").format(D)}catch{return g}},f=()=>{let g=a;return i&&(g=g.filter(D=>D.name.toLowerCase().includes(i.toLowerCase())||D.description.toLowerCase().includes(i.toLowerCase()))),o!=="all"&&(g=g.filter(D=>D.status===o)),g},M=g=>{switch(g){case"datasets":return e.jsx(Qe,{size:20});case"models":return e.jsx(Ne,{size:20});case"tts":return e.jsx(gs,{size:20});default:return e.jsx(Ke,{size:20})}},J=g=>{switch(g){case"ready":return e.jsx(ke,{size:16,className:"status-icon ready"});case"downloading":return e.jsx(ve,{size:16,className:"status-icon downloading"});case"error":return e.jsx(Xe,{size:16,className:"status-icon error"});case"completed":return e.jsx(ke,{size:16,className:"status-icon ready"});default:return e.jsx(ve,{size:16,className:"status-icon pending"})}},$=g=>{switch(g){case"ready":return"آماده";case"downloading":return"در حال دانلود";case"error":return"خطا";case"completed":return"تکمیل شده";case"pending":return"در انتظار";default:return g}},Z=async g=>{if(window.confirm("آیا از حذف این منبع اطمینان دارید؟"))try{try{let D;switch(t){case"models":D=await Ee.deleteModel(g);break;case"datasets":D=await Ee.deleteDataset(g);break;default:T.info("عملکرد حذف برای این بخش پیاده‌سازی نشده است");return}if(D&&D.ok){r(V=>V.filter(F=>F.id!==g)),T.success("منبع با موفقیت حذف شد");return}}catch{console.log("API delete failed, using mock delete")}r(D=>D.filter(V=>V.id!==g)),T.success("منبع با موفقیت حذف شد")}catch(D){console.error("Delete error:",D),T.error("خطا در حذف منبع")}},G=g=>{T.success(`مشاهده ${g.name}`),console.log("File details:",g)},O=async g=>{if(g.status==="downloading"){T.info("این فایل در حال حاضر در حال دانلود است");return}try{T.loading(`شروع دانلود ${g.name}`,{id:"download"});try{let D;if(g.isHuggingFace?D=await Ee.startHfDownload(g.id,"models/base"):D=await Ee.downloadModels([g.id]),D&&D.ok){T.success(`دانلود ${g.name} شروع شد`,{id:"download"}),r(V=>V.map(F=>F.id===g.id?{...F,status:"downloading",progress:0}:F)),D.jobId&&E(D.jobId,g.id);return}}catch{console.log("API download failed, using mock download")}T.success(`دانلود ${g.name} شروع شد`,{id:"download"}),r(D=>D.map(V=>V.id===g.id?{...V,status:"downloading",progress:0}:V)),q(g.id)}catch(D){console.error("Download error:",D),T.error("خطا در شروع دانلود",{id:"download"})}},q=g=>{let D=0;const V=setInterval(()=>{D+=Math.random()*15,D>=100?(D=100,r(F=>F.map(ne=>ne.id===g?{...ne,status:"ready",progress:100}:ne)),clearInterval(V),T.success("دانلود با موفقیت تکمیل شد")):r(F=>F.map(ne=>ne.id===g?{...ne,progress:Math.min(D,99)}:ne))},500)},E=async(g,D)=>{const V=setInterval(async()=>{try{const F=await Ee.getHfStatus(g);if(F&&F.ok){const ne=F.data;r(X=>X.map(I=>I.id===D?{...I,status:ne.status,progress:ne.progress||I.progress}:I)),(ne.status==="completed"||ne.status==="error")&&(clearInterval(V),ne.status==="completed"&&T.success(`دانلود ${D} تکمیل شد`))}}catch(F){console.error("Polling error:",F),clearInterval(V)}},2e3)},k=async g=>{try{const D=a.find(V=>V.id===g);if(!D)return;T.info(`دانلود ${D.name} متوقف شد`),r(V=>V.map(F=>F.id===g?{...F,status:"ready",progress:0}:F))}catch(D){console.error("Cancel download error:",D),T.error("خطا در توقف دانلود")}},P={total:a.length,ready:a.filter(g=>g.status==="ready"||g.status==="completed").length,downloading:a.filter(g=>g.status==="downloading").length,error:a.filter(g=>g.status==="error").length};return n?e.jsx("div",{className:"downloader-loading",children:e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-spinner-large"}),e.jsx("p",{className:"loading-text",children:"در حال بارگذاری منابع..."})]})}):e.jsxs("div",{className:"downloader-page",children:[e.jsx("div",{className:"downloader-header",children:e.jsxs("div",{className:"header-content",children:[e.jsxs("div",{className:"header-title-section",children:[e.jsxs("div",{className:"title-with-icon",children:[e.jsx(Te,{className:"header-icon"}),e.jsx("h1",{children:"منابع دانلود شده"})]}),e.jsx("p",{className:"header-description",children:"مشاهده و مدیریت مدل‌ها، دیتاست‌ها و منابع دانلود شده"})]}),e.jsxs(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:h,className:"refresh-btn",disabled:d,children:[e.jsx(Fe,{className:d?"spinning":"",size:18}),e.jsx("span",{children:"بروزرسانی"})]})]})}),e.jsx("div",{className:"stats-grid",children:[{title:"کل منابع",value:P.total,icon:Ke,color:"blue",suffix:"منبع موجود"},{title:"آماده",value:P.ready,icon:ke,color:"green",suffix:"آماده استفاده"},{title:"در حال دانلود",value:P.downloading,icon:ve,color:"orange",suffix:"در حال پردازش"},{title:"خطا",value:P.error,icon:Xe,color:"red",suffix:"نیاز به بررسی"}].map((g,D)=>e.jsxs(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:D*.1},className:`stat-card stat-${g.color}`,children:[e.jsx("div",{className:"stat-icon-wrapper",children:e.jsx(g.icon,{className:`stat-icon icon-${g.color}`,size:24})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("h3",{className:"stat-value",children:g.value}),e.jsx("p",{className:"stat-title",children:g.title}),e.jsx("p",{className:"stat-suffix",children:g.suffix})]})]},g.title))}),e.jsx("div",{className:"tabs-container",children:e.jsx("div",{className:"tabs-wrapper",children:["datasets","models","tts"].map(g=>e.jsxs("button",{className:`tab-button ${t===g?"active":""}`,onClick:()=>s(g),children:[e.jsx("span",{className:"tab-icon",children:M(g)}),e.jsxs("span",{className:"tab-label",children:[g==="datasets"&&"دیتاست‌ها",g==="models"&&"مدل‌ها",g==="tts"&&"TTS"]}),a.length>0&&e.jsx("span",{className:"tab-badge",children:a.length})]},g))})}),e.jsxs("div",{className:"filters-section",children:[e.jsx("div",{className:"search-container",children:e.jsxs("div",{className:"search-box",children:[e.jsx(Je,{className:"search-icon",size:18}),e.jsx("input",{type:"text",placeholder:`جستجو در ${t==="models"?"مدل‌ها":t==="datasets"?"دیتاست‌ها":"TTS"}...`,value:i,onChange:g=>p(g.target.value),className:"search-input"}),i&&e.jsx("button",{onClick:()=>p(""),className:"clear-search",children:"×"})]})}),e.jsx("div",{className:"filter-container",children:e.jsx("div",{className:"filter-buttons",children:[{key:"all",label:"همه"},{key:"ready",label:"آماده"},{key:"downloading",label:"در حال دانلود"},{key:"error",label:"خطا"}].map(g=>e.jsx("button",{className:`filter-btn ${o===g.key?"active":""}`,onClick:()=>u(g.key),children:g.label},g.key))})})]}),e.jsxs("div",{className:"downloads-container",children:[e.jsx(Be,{mode:"wait",children:e.jsx(z.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:"downloads-grid",children:f().map((g,D)=>e.jsxs(z.div,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},transition:{delay:D*.05},className:`download-card ${g.status}`,children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"item-icon",children:[M(t),g.isHuggingFace&&e.jsx("div",{className:"hf-indicator",title:"Hugging Face",children:e.jsx(Ks,{size:12})})]}),e.jsxs("div",{className:"item-info",children:[e.jsx("h3",{className:"item-name",children:g.name}),e.jsx("p",{className:"item-description",children:g.description}),e.jsxs("div",{className:"item-meta",children:[e.jsx("span",{className:"item-size",children:g.size}),e.jsx("span",{className:"item-date",children:g.createdAt}),g.downloads>0&&e.jsxs("span",{className:"item-downloads",children:["📥 ",g.downloads]}),g.isHuggingFace&&e.jsx("span",{className:"hf-badge",children:"HF"})]})]}),e.jsxs("div",{className:"item-status",children:[J(g.status),e.jsx("span",{className:"status-text",children:$(g.status)}),g.status==="downloading"&&g.progress>0&&e.jsxs("div",{className:"progress-indicator",children:[e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${He((g==null?void 0:g.progress)??0,0,100)}%`}})}),e.jsxs("span",{className:"progress-text",children:[Le(He((g==null?void 0:g.progress)??0,0,100)),"%"]})]}),g.error&&e.jsxs("div",{className:"error-message",title:g.error,children:[e.jsx(Xe,{size:12}),e.jsx("span",{children:"خطا"})]})]})]}),e.jsxs("div",{className:"card-actions",children:[g.status==="ready"||g.status==="completed"?e.jsxs(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},className:"action-btn view-btn",onClick:()=>G(g),title:"مشاهده جزئیات",children:[e.jsx(Ss,{size:16}),e.jsx("span",{children:"مشاهده"})]}):g.status==="downloading"?e.jsxs(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},className:"action-btn cancel-btn",onClick:()=>k(g.id),title:"توقف دانلود",children:[e.jsx(Qn,{size:16}),e.jsx("span",{children:"توقف"})]}):e.jsxs(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},className:"action-btn download-btn",onClick:()=>O(g),title:"دانلود مجدد",children:[e.jsx(Te,{size:16}),e.jsx("span",{children:"دانلود"})]}),e.jsxs(z.button,{whileHover:{scale:1.05},whileTap:{scale:.95},className:"action-btn delete-btn",onClick:()=>Z(g.id),title:"حذف منبع",children:[e.jsx(Zs,{size:16}),e.jsx("span",{children:"حذف"})]})]})]},g.id))},`${t}-${o}-${i}`)}),f().length===0&&e.jsxs("div",{className:"empty-state",children:[e.jsx(hs,{className:"empty-icon",size:64}),e.jsx("h3",{className:"empty-title",children:i||o!=="all"?"نتیجه‌ای یافت نشد":"منبعی یافت نشد"}),e.jsx("p",{className:"empty-description",children:i||o!=="all"?"با تغییر فیلترها یا عبارت جستجو دوباره امتحان کنید":`هنوز هیچ ${t==="models"?"مدلی":t==="datasets"?"دیتاستی":"منبع TTS"} دانلود نکرده‌اید`}),!i&&o==="all"&&e.jsxs("button",{className:"browse-btn",onClick:()=>{t==="models"?window.location.href="/models":t==="datasets"&&(window.location.href="/datasets")},children:[e.jsx(ks,{size:16}),e.jsx("span",{children:t==="models"?"مرور مدل‌ها":t==="datasets"?"مرور دیتاست‌ها":"مرور منابع TTS"})]})]})]})]})};function zl(){const[t,s]=c.useState("dashboard"),[a,r]=c.useState(!1),[n,l]=c.useState([]),[i,p]=c.useState({}),[o,u]=c.useState(0),d=c.useRef(0),[x,h]=c.useState([]),[j,m]=c.useState([]),[N,f]=c.useState([]),[M,J]=c.useState("real"),$=(k,P="info")=>{d.current+=1;const g=`toast-${Date.now()}-${d.current}`,D={id:g,message:k,type:P};l(V=>[...V,D]),setTimeout(()=>{l(V=>V.filter(F=>F.id!==g))},5e3)},Z=k=>{l(P=>P.filter(g=>g.id!==k))},G=k=>{p(P=>({...P,...k})),u(P=>P+1)};c.useEffect(()=>{(async()=>{try{const g=await(await fetch("/api/health")).json();if(J(g.ok?"real":"simulated"),g.ok){const V=await(await fetch("/api/models")).json(),ne=(V.items||V.data||V||[]).map(se=>({...se,downloaded:se.status==="ready"||se.status==="downloaded"||!!se.localPath||se.downloaded}));h(ne);const I=await(await fetch("/api/datasets")).json(),le=(I.items||I.data||I||[]).map(se=>({...se,downloaded:se.status==="ready"||se.status==="downloaded"||!!se.localPath||se.downloaded,path:se.localPath||se.path||se.id}));m(le);try{const te=await(await fetch("/api/teachers")).json();te.ok&&f(te.data||[])}catch{f([])}}else h([{id:"model-1",name:"Persian GPT Base",downloaded:!0},{id:"model-2",name:"BERT Persian",downloaded:!0}]),m([{id:"dataset-1",name:"Persian News Corpus",downloaded:!0,path:"/data/persian-news"},{id:"dataset-2",name:"Poetry Dataset",downloaded:!0,path:"/data/poetry"}]),f([])}catch(P){console.error("Failed to fetch training data:",P),J("simulated"),h([{id:"model-1",name:"Persian GPT Base",downloaded:!0},{id:"model-2",name:"BERT Persian",downloaded:!0}]),m([{id:"dataset-1",name:"Persian News Corpus",downloaded:!0,path:"/data/persian-news"},{id:"dataset-2",name:"Poetry Dataset",downloaded:!0,path:"/data/poetry"}]),f([])}})()},[o]);const O=async k=>{try{const P={baseModel:k.modelId,datasets:k.datasetIds,teacherModel:k.teacherId||null,config:{}},D=await(await fetch("/api/training/start",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(P)})).json();return D.ok?($("Training started successfully","success"),{jobId:D.jobId}):($("Failed to start training: "+(D.error||"Unknown error"),"error"),null)}catch(P){return console.error("Training start error:",P),$("Failed to start training: "+P.message,"error"),null}},q=async k=>{var P,g,D;try{const V=await fetch(`/api/training/status/${k}`);if(V.ok){const F=await V.json();return{status:F.status||"IDLE",progress:F.progress||0,epoch:(P=F.metrics)==null?void 0:P.epoch,loss:(g=F.metrics)==null?void 0:g.trainLoss,acc:(D=F.metrics)==null?void 0:D.accuracy,eta:F.eta||F.estimated_time_remaining}}return null}catch(V){return console.error("Status poll error:",V),null}},E=()=>{switch(t){case"dashboard":return e.jsx(Sa,{onNavigate:s});case"models":return e.jsx(ml,{});case"training":return e.jsx(xl,{models:x,datasets:j,teachers:N,mode:M,onStartTraining:O,onPollStatus:q,onRefreshData:()=>u(k=>k+1)});case"analysis":return e.jsx(gl,{});case"exports":return e.jsx(fl,{});case"users":return e.jsx(yl,{});case"kitchen":return e.jsx(vl,{});case"settings":return e.jsx(jl,{onToast:$,onUpdate:G});case"downloader":return e.jsx(El,{});default:return e.jsx(Sa,{})}};return e.jsx(Io,{children:e.jsxs("div",{className:"app",children:[e.jsx(Uo,{currentPage:t,onPageChange:s},o),e.jsxs("div",{className:"main-wrapper",children:[e.jsxs("div",{className:"app-header-nav",children:[e.jsxs("div",{className:"nav-brand",children:[e.jsx("h1",{children:Tl(t)}),e.jsx("span",{children:"سیستم آموزش مدل‌های فارسی"})]}),e.jsx("div",{className:"search-bar-container",children:e.jsx("input",{type:"text",placeholder:"جستجو در مدل‌ها، داده‌ها، آموزش‌ها..."})}),e.jsxs("div",{className:"nav-icons",children:[e.jsx("button",{className:"nav-icon",title:"تنظیمات سریع",onClick:()=>s("settings"),type:"button",children:e.jsx(Ds,{size:18})}),e.jsx("button",{className:"nav-icon",title:"اعلان‌ها",type:"button",children:e.jsx(Rt,{size:18})}),e.jsx("button",{className:"nav-icon",title:"راهنما",type:"button",children:e.jsx(Hn,{size:18})})]}),e.jsxs("div",{className:"user-profile-section",children:[e.jsx("div",{className:"user-avatar",children:e.jsx(ni,{size:20})}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",children:"علی محمدی"}),e.jsx("span",{className:"user-role",children:"مدیر سیستم"})]})]})]}),e.jsx("div",{className:"main-content",children:E()}),e.jsxs("div",{className:"footer glass-container",children:[e.jsxs("div",{className:"footer-left",children:[e.jsx("span",{children:"© 1404 - Persian Model Trainer"}),e.jsx("span",{className:"version-badge",children:"ورژن 2.5.0"})]}),e.jsxs("div",{className:"footer-links",children:[e.jsx("a",{href:"/docs",className:"footer-link",children:"مستندات"}),e.jsx("a",{href:"/support",className:"footer-link",children:"پشتیبانی"}),e.jsx("a",{href:"/about",className:"footer-link",children:"درباره ما"})]}),e.jsx("div",{className:"footer-status",children:e.jsxs("span",{className:"status-online",children:[e.jsx("span",{className:"status-dot"}),"سیستم آنلاین"]})})]})]}),e.jsx(Oo,{isVisible:a,onToggle:()=>r(!a)}),e.jsx(gr,{}),e.jsx("div",{className:"toast-container",children:n.map(k=>e.jsxs("div",{className:`toast toast-${k.type}`,onClick:()=>Z(k.id),children:[e.jsxs("div",{className:"toast-icon",children:[k.type==="success"&&e.jsx(ke,{size:20}),k.type==="error"&&e.jsx(us,{size:20}),k.type==="info"&&e.jsx(Xe,{size:20})]}),e.jsx("div",{className:"toast-message",children:k.message})]},k.id))})]})})}const Tl=t=>({dashboard:"داشبورد",models:"مدل‌ها",training:"آموزش",analysis:"آنالیز و گزارش‌گیری",exports:"خروجی‌ها",users:"کاربران",kitchen:"آشپزخانه مدل‌سازی",settings:"تنظیمات",downloader:"منابع دانلود شده"})[t]||"داشبورد";document.documentElement.setAttribute("dir","rtl");document.documentElement.setAttribute("lang","fa");"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(t=>{console.log("✅ Service Worker registered successfully:",t.scope)}).catch(t=>{console.error("❌ Service Worker registration failed:",t)})});Mt.createRoot(document.getElementById("root")).render(e.jsx(Vs.StrictMode,{children:e.jsxs(Go,{children:[e.jsx(zl,{}),e.jsx(Mn,{position:"top-right",toastOptions:{duration:4e3,style:{background:"#363636",color:"#fff",direction:"rtl",textAlign:"right"}}})]})}));
