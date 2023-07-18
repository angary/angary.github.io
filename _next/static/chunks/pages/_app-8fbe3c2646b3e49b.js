(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{2720:function(e,t,n){"use strict";n.d(t,{n:function(){return s}});var o,r,a=n(7294),i=function(){return(i=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}).apply(this,arguments)},s=(0,a.createContext)(void 0),l="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML",c="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.js";t.Z=function(e){var t=e.config,n=e.version,n=void 0===n?3:n,d=e.src,d=void 0===d?2===n?l:c:d,u=e.onStartup,h=e.onLoad,m=e.onError,f=e.typesettingOptions,v=e.renderMode,v=void 0===v?"post":v,p=e.hideUntilTypeset,e=e.children,y=(0,a.useContext)(s);if(void 0!==(null==y?void 0:y.version)&&(null==y?void 0:y.version)!==n)throw Error("Cannot nest MathJaxContexts with different versions. MathJaxContexts should not be nested at all but if they are, they cannot have different versions. Stick with one version of MathJax in your app and avoid using more than one MathJaxContext.");if(2===n&&void 0!==r||3===n&&void 0!==o)throw Error("Cannot use MathJax versions 2 and 3 simultaneously in the same app due to how MathJax is set up in the browser; either you have multiple MathJaxContexts with different versions or you have mounted and unmounted MathJaxContexts with different versions. Please stick with one version of MathJax in your app. File an issue in the project Github page if you need this feature.");var w=(0,a.useRef)(y),y=(0,a.useRef)((null==y?void 0:y.version)||null);if(null===y.current)y.current=n;else if(y.current!==n)throw Error("Cannot change version of MathJax in a MathJaxContext after it has mounted. Reload the page with a new version when this must happen.");var x=d||(2===n?l:c);function g(e,n){t&&(window.MathJax=t);var o=document.createElement("script");o.type="text/javascript",o.src=x,o.async=!1,o.addEventListener("load",function(){var t=window.MathJax;u&&u(t),e(t),h&&h()}),o.addEventListener("error",function(e){return n(e)}),document.getElementsByTagName("head")[0].appendChild(o)}return void 0===w.current&&(y={typesettingOptions:f,renderMode:v,hideUntilTypeset:p},2===n?void 0===o&&("undefined"!=typeof window?(o=new Promise(g)).catch(function(e){if(!m)throw Error("Failed to download MathJax version 2 from '".concat(x,"' due to: ").concat(e));m(e)}):(o=Promise.reject()).catch(function(e){})):void 0===r&&("undefined"!=typeof window?(r=new Promise(g)).catch(function(e){if(!m)throw Error("Failed to download MathJax version 3 from '".concat(x,"' due to: ").concat(e));m(e)}):(r=Promise.reject()).catch(function(e){})),w.current=i(i({},y),2===n?{version:2,promise:o}:{version:3,promise:r})),a.createElement(s.Provider,{value:w.current},e)}},2010:function(e,t,n){"use strict";n.d(t,{F:function(){return c},f:function(){return d}});var o=n(7294);let r=["light","dark"],a="(prefers-color-scheme: dark)",i="undefined"==typeof window,s=(0,o.createContext)(void 0),l={setTheme:e=>{},themes:[]},c=()=>{var e;return null!==(e=(0,o.useContext)(s))&&void 0!==e?e:l},d=e=>(0,o.useContext)(s)?o.createElement(o.Fragment,null,e.children):o.createElement(h,e),u=["light","dark"],h=({forcedTheme:e,disableTransitionOnChange:t=!1,enableSystem:n=!0,enableColorScheme:i=!0,storageKey:l="theme",themes:c=u,defaultTheme:d=n?"system":"light",attribute:h="data-theme",value:y,children:w,nonce:x})=>{let[g,$]=(0,o.useState)(()=>f(l,d)),[b,C]=(0,o.useState)(()=>f(l)),E=y?Object.values(y):c,M=(0,o.useCallback)(e=>{let o=e;if(!o)return;"system"===e&&n&&(o=p());let a=y?y[o]:o,s=t?v():null,l=document.documentElement;if("class"===h?(l.classList.remove(...E),a&&l.classList.add(a)):a?l.setAttribute(h,a):l.removeAttribute(h),i){let e=r.includes(d)?d:null,t=r.includes(o)?o:e;l.style.colorScheme=t}null==s||s()},[]),T=(0,o.useCallback)(e=>{$(e);try{localStorage.setItem(l,e)}catch(e){}},[e]),S=(0,o.useCallback)(t=>{let o=p(t);C(o),"system"===g&&n&&!e&&M("system")},[g,e]);(0,o.useEffect)(()=>{let e=window.matchMedia(a);return e.addListener(S),S(e),()=>e.removeListener(S)},[S]),(0,o.useEffect)(()=>{let e=e=>{e.key===l&&T(e.newValue||d)};return window.addEventListener("storage",e),()=>window.removeEventListener("storage",e)},[T]),(0,o.useEffect)(()=>{M(null!=e?e:g)},[e,g]);let j=(0,o.useMemo)(()=>({theme:g,setTheme:T,forcedTheme:e,resolvedTheme:"system"===g?b:g,themes:n?[...c,"system"]:c,systemTheme:n?b:void 0}),[g,T,e,b,n,c]);return o.createElement(s.Provider,{value:j},o.createElement(m,{forcedTheme:e,disableTransitionOnChange:t,enableSystem:n,enableColorScheme:i,storageKey:l,themes:c,defaultTheme:d,attribute:h,value:y,children:w,attrs:E,nonce:x}),w)},m=(0,o.memo)(({forcedTheme:e,storageKey:t,attribute:n,enableSystem:i,enableColorScheme:s,defaultTheme:l,value:c,attrs:d,nonce:u})=>{let h="system"===l,m="class"===n?`var d=document.documentElement,c=d.classList;c.remove(${d.map(e=>`'${e}'`).join(",")});`:`var d=document.documentElement,n='${n}',s='setAttribute';`,f=s?r.includes(l)&&l?`if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${l}'`:"if(e==='light'||e==='dark')d.style.colorScheme=e":"",v=(e,t=!1,o=!0)=>{let a=c?c[e]:e,i=t?e+"|| ''":`'${a}'`,l="";return s&&o&&!t&&r.includes(e)&&(l+=`d.style.colorScheme = '${e}';`),"class"===n?l+=t||a?`c.add(${i})`:"null":a&&(l+=`d[s](n,${i})`),l},p=e?`!function(){${m}${v(e)}}()`:i?`!function(){try{${m}var e=localStorage.getItem('${t}');if('system'===e||(!e&&${h})){var t='${a}',m=window.matchMedia(t);if(m.media!==t||m.matches){${v("dark")}}else{${v("light")}}}else if(e){${c?`var x=${JSON.stringify(c)};`:""}${v(c?"x[e]":"e",!0)}}${h?"":"else{"+v(l,!1,!1)+"}"}${f}}catch(e){}}()`:`!function(){try{${m}var e=localStorage.getItem('${t}');if(e){${c?`var x=${JSON.stringify(c)};`:""}${v(c?"x[e]":"e",!0)}}else{${v(l,!1,!1)};}${f}}catch(t){}}();`;return o.createElement("script",{nonce:u,dangerouslySetInnerHTML:{__html:p}})},()=>!0),f=(e,t)=>{let n;if(!i){try{n=localStorage.getItem(e)||void 0}catch(e){}return n||t}},v=()=>{let e=document.createElement("style");return e.appendChild(document.createTextNode("*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(e),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(e)},1)}},p=e=>(e||(e=window.matchMedia(a)),e.matches?"dark":"light")},6840:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return n(3310)}])},3310:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return s}});var o=n(5893),r=n(2720),a=n(2010);n(7952);let i={loader:{load:["[tex]/html"]},tex:{packages:{"[+]":["html"]},inlineMath:[["$","$"],["\\(","\\)"]],displayMath:[["$$","$$"],["\\[","\\]"]]}};function s(e){let{Component:t,pageProps:n}=e;return(0,o.jsx)(r.Z,{version:3,config:i,children:(0,o.jsx)(a.f,{children:(0,o.jsx)(t,{...n})})})}},7952:function(){}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return t(6840),t(6885)}),_N_E=e.O()}]);