(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ft=globalThis,ho=ft.ShadowRoot&&(ft.ShadyCSS===void 0||ft.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,po=Symbol(),Mo=new WeakMap;let ar=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==po)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ho&&e===void 0){const o=t!==void 0&&t.length===1;o&&(e=Mo.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&Mo.set(t,e))}return e}toString(){return this.cssText}};const ai=r=>new ar(typeof r=="string"?r:r+"",void 0,po),g=(r,...e)=>{const t=r.length===1?r[0]:e.reduce((o,i,s)=>o+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[s+1],r[0]);return new ar(t,r,po)},ni=(r,e)=>{if(ho)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const o=document.createElement("style"),i=ft.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=t.cssText,r.appendChild(o)}},Lo=ho?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return ai(t)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:li,defineProperty:di,getOwnPropertyDescriptor:ci,getOwnPropertyNames:hi,getOwnPropertySymbols:pi,getPrototypeOf:ui}=Object,xt=globalThis,Bo=xt.trustedTypes,mi=Bo?Bo.emptyScript:"",fi=xt.reactiveElementPolyfillSupport,Ne=(r,e)=>r,vt={toAttribute(r,e){switch(e){case Boolean:r=r?mi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},uo=(r,e)=>!li(r,e),No={attribute:!0,type:String,converter:vt,reflect:!1,useDefault:!1,hasChanged:uo};Symbol.metadata??=Symbol("metadata"),xt.litPropertyMetadata??=new WeakMap;let Se=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=No){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,t);i!==void 0&&di(this.prototype,e,i)}}static getPropertyDescriptor(e,t,o){const{get:i,set:s}=ci(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){const h=i?.call(this);s?.call(this,a),this.requestUpdate(e,h,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??No}static _$Ei(){if(this.hasOwnProperty(Ne("elementProperties")))return;const e=ui(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Ne("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ne("properties"))){const t=this.properties,o=[...hi(t),...pi(t)];for(const i of o)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[o,i]of t)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[t,o]of this.elementProperties){const i=this._$Eu(t,o);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const i of o)t.unshift(Lo(i))}else e!==void 0&&t.push(Lo(e));return t}static _$Eu(e,t){const o=t.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ni(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(i!==void 0&&o.reflect===!0){const s=(o.converter?.toAttribute!==void 0?o.converter:vt).toAttribute(t,o.type);this._$Em=e,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,t){const o=this.constructor,i=o._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const s=o.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:vt;this._$Em=i;const h=a.fromAttribute(t,s.type);this[i]=h??this._$Ej?.get(i)??h,this._$Em=null}}requestUpdate(e,t,o,i=!1,s){if(e!==void 0){const a=this.constructor;if(i===!1&&(s=this[e]),o??=a.getPropertyOptions(e),!((o.hasChanged??uo)(s,t)||o.useDefault&&o.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,o))))return;this.C(e,t,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:i,wrapped:s},a){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),s!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[i,s]of o){const{wrapped:a}=s,h=this[i];a!==!0||this._$AL.has(i)||h===void 0||this.C(i,void 0,s,h)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(t)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};Se.elementStyles=[],Se.shadowRootOptions={mode:"open"},Se[Ne("elementProperties")]=new Map,Se[Ne("finalized")]=new Map,fi?.({ReactiveElement:Se}),(xt.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mo=globalThis,Fo=r=>r,gt=mo.trustedTypes,Uo=gt?gt.createPolicy("lit-html",{createHTML:r=>r}):void 0,nr="$lit$",pe=`lit$${Math.random().toFixed(9).slice(2)}$`,lr="?"+pe,vi=`<${lr}>`,we=document,Ue=()=>we.createComment(""),qe=r=>r===null||typeof r!="object"&&typeof r!="function",fo=Array.isArray,gi=r=>fo(r)||typeof r?.[Symbol.iterator]=="function",It=`[ 	
\f\r]`,Le=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qo=/-->/g,Ho=/>/g,xe=RegExp(`>|${It}(?:([^\\s"'>=/]+)(${It}*=${It}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Vo=/'/g,Wo=/"/g,dr=/^(?:script|style|textarea|title)$/i,bi=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),l=bi(1),V=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Go=new WeakMap,_e=we.createTreeWalker(we,129);function cr(r,e){if(!fo(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Uo!==void 0?Uo.createHTML(e):e}const yi=(r,e)=>{const t=r.length-1,o=[];let i,s=e===2?"<svg>":e===3?"<math>":"",a=Le;for(let h=0;h<t;h++){const c=r[h];let u,m,v=-1,$=0;for(;$<c.length&&(a.lastIndex=$,m=a.exec(c),m!==null);)$=a.lastIndex,a===Le?m[1]==="!--"?a=qo:m[1]!==void 0?a=Ho:m[2]!==void 0?(dr.test(m[2])&&(i=RegExp("</"+m[2],"g")),a=xe):m[3]!==void 0&&(a=xe):a===xe?m[0]===">"?(a=i??Le,v=-1):m[1]===void 0?v=-2:(v=a.lastIndex-m[2].length,u=m[1],a=m[3]===void 0?xe:m[3]==='"'?Wo:Vo):a===Wo||a===Vo?a=xe:a===qo||a===Ho?a=Le:(a=xe,i=void 0);const _=a===xe&&r[h+1].startsWith("/>")?" ":"";s+=a===Le?c+vi:v>=0?(o.push(u),c.slice(0,v)+nr+c.slice(v)+pe+_):c+pe+(v===-2?h:_)}return[cr(r,s+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class He{constructor({strings:e,_$litType$:t},o){let i;this.parts=[];let s=0,a=0;const h=e.length-1,c=this.parts,[u,m]=yi(e,t);if(this.el=He.createElement(u,o),_e.currentNode=this.el.content,t===2||t===3){const v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(i=_e.nextNode())!==null&&c.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(const v of i.getAttributeNames())if(v.endsWith(nr)){const $=m[a++],_=i.getAttribute(v).split(pe),A=/([.?@])?(.*)/.exec($);c.push({type:1,index:s,name:A[2],strings:_,ctor:A[1]==="."?_i:A[1]==="?"?wi:A[1]==="@"?$i:_t}),i.removeAttribute(v)}else v.startsWith(pe)&&(c.push({type:6,index:s}),i.removeAttribute(v));if(dr.test(i.tagName)){const v=i.textContent.split(pe),$=v.length-1;if($>0){i.textContent=gt?gt.emptyScript:"";for(let _=0;_<$;_++)i.append(v[_],Ue()),_e.nextNode(),c.push({type:2,index:++s});i.append(v[$],Ue())}}}else if(i.nodeType===8)if(i.data===lr)c.push({type:2,index:s});else{let v=-1;for(;(v=i.data.indexOf(pe,v+1))!==-1;)c.push({type:7,index:s}),v+=pe.length-1}s++}}static createElement(e,t){const o=we.createElement("template");return o.innerHTML=e,o}}function Te(r,e,t=r,o){if(e===V)return e;let i=o!==void 0?t._$Co?.[o]:t._$Cl;const s=qe(e)?void 0:e._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(r),i._$AT(r,t,o)),o!==void 0?(t._$Co??=[])[o]=i:t._$Cl=i),i!==void 0&&(e=Te(r,i._$AS(r,e.values),i,o)),e}class xi{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,i=(e?.creationScope??we).importNode(t,!0);_e.currentNode=i;let s=_e.nextNode(),a=0,h=0,c=o[0];for(;c!==void 0;){if(a===c.index){let u;c.type===2?u=new Qe(s,s.nextSibling,this,e):c.type===1?u=new c.ctor(s,c.name,c.strings,this,e):c.type===6&&(u=new Ci(s,this,e)),this._$AV.push(u),c=o[++h]}a!==c?.index&&(s=_e.nextNode(),a++)}return _e.currentNode=we,i}p(e){let t=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class Qe{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Te(this,e,t),qe(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==V&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):gi(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&qe(this._$AH)?this._$AA.nextSibling.data=e:this.T(we.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,i=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=He.createElement(cr(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(t);else{const s=new xi(i,this),a=s.u(this.options);s.p(t),this.T(a),this._$AH=s}}_$AC(e){let t=Go.get(e.strings);return t===void 0&&Go.set(e.strings,t=new He(e)),t}k(e){fo(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,i=0;for(const s of e)i===t.length?t.push(o=new Qe(this.O(Ue()),this.O(Ue()),this,this.options)):o=t[i],o._$AI(s),i++;i<t.length&&(this._$AR(o&&o._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const o=Fo(e).nextSibling;Fo(e).remove(),e=o}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class _t{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,i,s){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=p}_$AI(e,t=this,o,i){const s=this.strings;let a=!1;if(s===void 0)e=Te(this,e,t,0),a=!qe(e)||e!==this._$AH&&e!==V,a&&(this._$AH=e);else{const h=e;let c,u;for(e=s[0],c=0;c<s.length-1;c++)u=Te(this,h[o+c],t,c),u===V&&(u=this._$AH[c]),a||=!qe(u)||u!==this._$AH[c],u===p?e=p:e!==p&&(e+=(u??"")+s[c+1]),this._$AH[c]=u}a&&!i&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class _i extends _t{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}}class wi extends _t{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}}class $i extends _t{constructor(e,t,o,i,s){super(e,t,o,i,s),this.type=5}_$AI(e,t=this){if((e=Te(this,e,t,0)??p)===V)return;const o=this._$AH,i=e===p&&o!==p||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==p&&(o===p||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class Ci{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){Te(this,e)}}const Ei=mo.litHtmlPolyfillSupport;Ei?.(He,Qe),(mo.litHtmlVersions??=[]).push("3.3.3");const vo=(r,e,t)=>{const o=t?.renderBefore??e;let i=o._$litPart$;if(i===void 0){const s=t?.renderBefore??null;o._$litPart$=i=new Qe(e.insertBefore(Ue(),s),s,void 0,t??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const go=globalThis;let b=class extends Se{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=vo(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};b._$litElement$=!0,b.finalized=!0,go.litElementHydrateSupport?.({LitElement:b});const ki=go.litElementPolyfillSupport;ki?.({LitElement:b});(go.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const x=r=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(r,e)}):customElements.define(r,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ai={attribute:!0,type:String,converter:vt,reflect:!1,hasChanged:uo},Pi=(r=Ai,e,t)=>{const{kind:o,metadata:i}=t;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),o==="setter"&&((r=Object.create(r)).wrapped=!0),s.set(t.name,r),o==="accessor"){const{name:a}=t;return{set(h){const c=e.get.call(this);e.set.call(this,h),this.requestUpdate(a,c,r,!0,h)},init(h){return h!==void 0&&this.C(a,void 0,r,h),h}}}if(o==="setter"){const{name:a}=t;return function(h){const c=this[a];e.call(this,h),this.requestUpdate(a,c,r,!0,h)}}throw Error("Unsupported decorator location: "+o)};function d(r){return(e,t)=>typeof t=="object"?Pi(r,e,t):((o,i,s)=>{const a=i.hasOwnProperty(s);return i.constructor.createProperty(s,o),a?Object.getOwnPropertyDescriptor(i,s):void 0})(r,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function f(r){return d({...r,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=(r,e,t)=>(t.configurable=!0,t.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(r,e,t),t);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function S(r,e){return(t,o,i)=>{const s=a=>a.renderRoot?.querySelector(r)??null;return wt(t,o,{get(){return s(this)}})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Si;function Ii(r){return(e,t)=>wt(e,t,{get(){return(this.renderRoot??(Si??=document.createDocumentFragment())).querySelectorAll(r)}})}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function te(r){return(e,t)=>{const{slot:o,selector:i}=r??{},s="slot"+(o?`[name=${o}]`:":not([name])");return wt(e,t,{get(){const a=this.renderRoot?.querySelector(s),h=a?.assignedElements(r)??[];return i===void 0?h:h.filter(c=>c.matches(i))}})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function hr(r){return(e,t)=>{const{slot:o}=r??{},i="slot"+(o?`[name=${o}]`:":not([name])");return wt(e,t,{get(){return this.renderRoot?.querySelector(i)?.assignedNodes(r)??[]}})}}class Ti extends Error{constructor(e,t){super(t),this.status=e,this.name="ApiError"}}async function D(r,e={}){const t=new Headers(e.headers||{});e.body&&typeof e.body=="string"&&!t.has("content-type")&&t.set("content-type","application/json");const o=await fetch(r,{...e,headers:t});if(!o.ok){let i=`Request failed: ${o.status} ${o.statusText}`;try{const s=await o.json();s&&s.error&&(i=s.error)}catch{}throw new Ti(o.status,i)}return o.status===204||o.headers.get("content-length")==="0"?null:o.json()}const I={async fetchProjects(){return D("/api/projects")},async createProject(r,e){return D("/api/projects",{method:"POST",body:JSON.stringify({name:r,path:e})})},async editProject(r,e,t){return D(`/api/projects/${r}`,{method:"PATCH",body:JSON.stringify({name:e,path:t})})},async deleteProject(r){await D(`/api/projects/${r}`,{method:"DELETE"})},async cloneProject(r){return D("/api/projects/clone",{method:"POST",body:JSON.stringify(r)})},async fetchDirectories(r){const e=r?`/api/filesystem/directories?path=${encodeURIComponent(r)}`:"/api/filesystem/directories";return D(e)},async fetchChats(r){return D(`/api/projects/${r}/chats`)},async createChat(r,e,t){return D(`/api/projects/${r}/chats`,{method:"POST",body:JSON.stringify({agent:e,title:t||void 0})})},async fetchChat(r){return D(`/api/chats/${r}`)},async editChat(r,e){return D(`/api/chats/${r}`,{method:"PATCH",body:JSON.stringify(e)})},async deleteChat(r){await D(`/api/chats/${r}`,{method:"DELETE"})},async promptChat(r,e){await D(`/api/chats/${r}/prompt`,{method:"POST",body:JSON.stringify({text:e})})},async resumeChat(r){return D(`/api/chats/${r}/resume`,{method:"POST"})},async stopChat(r){await D(`/api/chats/${r}/stop`,{method:"POST"})},async cancelChat(r){await D(`/api/chats/${r}/cancel`,{method:"POST"})},async respondPermission(r,e,t){await D(`/api/chats/${r}/permission`,{method:"POST",body:JSON.stringify({id:e,granted:t})})},async fetchChatConfig(r){return D(`/api/chats/${r}/config`)},async setChatConfig(r,e,t){return D(`/api/chats/${r}/config`,{method:"PATCH",body:JSON.stringify({id:e,value:t})})},async fetchAgents(){return D("/api/agents")}};class Tt{constructor(e=[]){this.nextId=1,this.seenSeqs=new Set,this.items=[],this.currentTurn=null;for(const t of e)this.ingest(t)}ingest(e){if(typeof e.seq=="number"){if(this.seenSeqs.has(e.seq))return null;this.seenSeqs.add(e.seq)}const t=e.payload;if(!t)return null;if(this.isTurnScoped(t.type)){const o=this.ensureCurrentTurn(e);return this.mergeTurnEvent(o,e),t.type==="turn_complete"&&(o.status="complete",o.completedAt=e.timestamp,o.stopReason=t.stop_reason||t.stopReason||null,this.currentTurn=null),o}if(t.type==="user_message"){this.currentTurn&&(this.currentTurn.status="complete",this.currentTurn=null);const o={id:this.nextId++,type:"user_message",text:t.text||"",timestamp:e.timestamp};return this.items.push(o),o}if(t.type==="error"){const o={id:this.nextId++,type:"error",message:t.message||"Unknown error",timestamp:e.timestamp};return this.items.push(o),o}if(t.type==="state_change"){if(this.shouldDisplayStateChange(t)){const o={id:this.nextId++,type:"state_change",process:t.process,turn:t.turn,timestamp:e.timestamp};return this.items.push(o),o}return null}return null}isTurnScoped(e){return e==="message_chunk"||e==="thought_chunk"||e==="tool_call"||e==="tool_call_update"||e==="plan"||e==="permission_request"||e==="permission_response"||e==="turn_complete"}shouldDisplayStateChange(e){return e.process==="DEAD"||e.process==="STARTING"||e.process==="STOPPED"?!0:e.turn==="CANCELLING"}ensureCurrentTurn(e){if(this.currentTurn)return this.currentTurn;const t={id:this.nextId++,type:"turn",agent:e.agent||"Agent",timestamp:e.timestamp,completedAt:null,status:"in_progress",stopReason:null,entries:[]};return this.items.push(t),this.currentTurn=t,t}mergeTurnEvent(e,t){const o=t.payload,i=e.entries[e.entries.length-1];if(o.type==="message_chunk"||o.type==="thought_chunk"){const s=o.text||"";i&&i.type===o.type?i.text+=s:e.entries.push({id:this.nextId++,type:o.type,text:s});return}if(o.type==="tool_call"){const s=o.id||o.toolCallId||o.tool_call_id||String(this.nextId);e.entries.push({id:this.nextId++,type:"tool_call",toolCallId:s,title:o.title||"Tool Call",status:o.status||"in_progress",output:null});return}if(o.type==="tool_call_update"){const s=o.id||o.toolCallId||o.tool_call_id||"",a=this.findToolCall(e,s);a?(o.status&&(a.status=o.status),o.output!==void 0&&o.output!==null&&(a.output=(a.output||"")+o.output)):e.entries.push({id:this.nextId++,type:"tool_call",toolCallId:s,title:o.title||"Tool Call",status:o.status||"in_progress",output:o.output||null});return}if(o.type==="plan"){const s=e.entries[e.entries.length-1];s&&s.type==="plan"?s.entries=o.entries||[]:e.entries.push({id:this.nextId++,type:"plan",entries:o.entries||[]});return}if(o.type==="permission_request"){e.entries.push({id:this.nextId++,type:"permission_request",requestId:o.id||"",method:o.method||"",description:o.description||"",responded:!1});return}if(o.type==="permission_response"){const s=o.id,a=h=>{for(const c of h)if(c.type==="permission_request"&&(!s||c.requestId===s))return c.responded=!0,c.decision=o.granted?"Allowed":"Denied",!0;return!1};if(e&&a(e.entries))return;for(const h of this.items)if(h.type==="turn"&&a(h.entries))return;return}}findToolCall(e,t){return e.entries.slice().reverse().find(o=>o.type==="tool_call"&&o.toolCallId===t)}}class Oi{constructor(){this.ws=null,this.lastSeq=0,this.reconnectTimer=null,this.eventCallbacks=new Set,this.statusCallbacks=new Set,this.isDestroyed=!1,this.connect()}onEvent(e){return this.eventCallbacks.add(e),()=>this.eventCallbacks.delete(e)}onStatus(e){return this.statusCallbacks.add(e),()=>this.statusCallbacks.delete(e)}notifyStatus(e){for(const t of this.statusCallbacks)t(e)}connect(){if(this.isDestroyed||typeof window>"u")return;this.notifyStatus("connecting");const e=window.location.protocol==="https:"?"wss:":"ws:",t=window.location.host,o=`${e}//${t}/ws`;try{this.ws=new WebSocket(o)}catch{this.scheduleReconnect();return}this.ws.onopen=()=>{this.notifyStatus("connected");const i=this.lastSeq>0?this.lastSeq+1:0;this.send({type:"subscribe",from_seq:i})},this.ws.onmessage=i=>{try{const s=JSON.parse(i.data);if(s.seq){if(s.seq<=this.lastSeq)return;this.lastSeq=s.seq;for(const a of this.eventCallbacks)a(s)}}catch{}},this.ws.onclose=()=>{this.notifyStatus("disconnected"),this.scheduleReconnect()},this.ws.onerror=()=>{this.ws&&this.ws.close()}}scheduleReconnect(){this.isDestroyed||this.reconnectTimer||(this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null,this.connect()},2e3))}send(e){this.ws&&this.ws.readyState===WebSocket.OPEN&&this.ws.send(JSON.stringify(e))}destroy(){this.isDestroyed=!0,this.reconnectTimer&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null),this.ws&&(this.ws.close(),this.ws=null),this.eventCallbacks.clear(),this.statusCallbacks.clear()}}class ji{constructor(){this.listeners=new Set,this.currentRoute={name:"home"};const e=typeof window<"u"?window.location.pathname:"/";this.currentRoute=this.parseRoute(e),typeof window<"u"&&window.addEventListener("popstate",()=>{this.currentRoute=this.parseRoute(window.location.pathname),this.notify()})}parseRoute(e){const o=(e.replace(/\/+$/,"")||"/").split("/").filter(Boolean);return o.length===0?{name:"home"}:o[0]==="projects"&&o[1]&&o[2]==="chats"&&o[3]?{name:"chat",projectId:o[1],chatId:o[3]}:o[0]==="projects"&&o[1]?{name:"project",projectId:o[1]}:{name:"home"}}navigate(e,t=!1){if(typeof window<"u"){if(window.location.pathname===e)return;t?window.history.replaceState(null,"",e):window.history.pushState(null,"",e)}this.currentRoute=this.parseRoute(e),this.notify()}subscribe(e){return this.listeners.add(e),e(this.currentRoute),()=>this.listeners.delete(e)}notify(){for(const e of this.listeners)e(this.currentRoute)}}const W=new ji;class zi{constructor(){this.projects=[],this.chatsByProject={},this.activeProjectId=null,this.activeChatId=null,this.configOptionsByChat={},this.reducersByChat={},this.wsStatus="connecting",this.agents=["codex","claude","opencode","antigravity"],this.isMobileDrawerOpen=!1,this.isConfigOpen=!1,this.showArchived=!1,this.connectingChats=new Set,this.connectErrors={},this.inFlightConnections=new Map,this.listeners=new Set,this.ws=new Oi,this.ws.onStatus(e=>{this.wsStatus=e,this.notify()}),this.ws.onEvent(e=>{this.handleIncomingEvent(e)}),W.subscribe(e=>{e.name==="home"?(this.activeProjectId=null,this.activeChatId=null,this.notify()):e.name==="project"?(this.activeProjectId=e.projectId,this.activeChatId=null,this.loadChats(e.projectId),this.notify()):e.name==="chat"&&(this.activeProjectId=e.projectId,this.activeChatId=e.chatId,this.loadChats(e.projectId).then(()=>{this.autoConnectActiveChat()}),this.notify())}),this.init()}async init(){typeof window>"u"||await Promise.all([this.loadProjects(),this.loadAgents()])}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){for(const e of this.listeners)e()}get activeChat(){return!this.activeProjectId||!this.activeChatId?null:(this.chatsByProject[this.activeProjectId]||[]).find(t=>t.id===this.activeChatId)||null}get activeProject(){return this.activeProjectId&&this.projects.find(e=>e.id===this.activeProjectId)||null}get activeReducer(){return this.activeChatId?(this.reducersByChat[this.activeChatId]||(this.reducersByChat[this.activeChatId]=new Tt),this.reducersByChat[this.activeChatId]):new Tt}async loadProjects(){try{this.projects=await I.fetchProjects(),this.notify()}catch(e){console.error("Failed to load projects",e)}}async loadAgents(){try{this.agents=await I.fetchAgents(),this.notify()}catch{}}async loadChats(e){try{const t=await I.fetchChats(e);this.chatsByProject[e]=t,this.notify()}catch(t){console.error("Failed to load chats for project",e,t)}}async autoConnectActiveChat(){const e=this.activeChat;if(e){if(this.inFlightConnections.has(e.id))return this.inFlightConnections.get(e.id);if(e.process_state!=="RUNNING")try{await this.connectChat(e.id)}catch{}else this.fetchConfig(e.id)}}connectChat(e){const t=this.inFlightConnections.get(e);if(t)return t;const o=(async()=>{this.connectingChats.add(e),delete this.connectErrors[e],this.notify();try{const i=await I.resumeChat(e);return this.activeProjectId&&this.chatsByProject[this.activeProjectId]&&(this.chatsByProject[this.activeProjectId]=this.chatsByProject[this.activeProjectId].map(s=>s.id===e?{...s,...i}:s)),delete this.connectErrors[e],await this.fetchConfig(e),i}catch(i){const s=this.chatsByProject[this.activeProjectId||""]?.find(a=>a.id===e);throw(!s||s.process_state!=="RUNNING")&&(this.connectErrors[e]=i?.message||"Failed to connect to agent"),i}finally{this.connectingChats.delete(e),this.inFlightConnections.delete(e),this.notify()}})();return this.inFlightConnections.set(e,o),o}async fetchConfig(e){try{const t=await I.fetchChatConfig(e);this.configOptionsByChat[e]=t,this.notify()}catch{}}async sendPrompt(e,t){await I.promptChat(e,t),this.activeProjectId&&this.chatsByProject[this.activeProjectId]&&(this.chatsByProject[this.activeProjectId]=this.chatsByProject[this.activeProjectId].map(o=>o.id===e?{...o,turn_state:"PROMPTING"}:o),this.notify())}async cancelActiveTurn(e){await I.cancelChat(e),this.activeProjectId&&this.chatsByProject[this.activeProjectId]&&(this.chatsByProject[this.activeProjectId]=this.chatsByProject[this.activeProjectId].map(t=>t.id===e?{...t,turn_state:"CANCELLING"}:t),this.notify())}async stopChatProcess(e){await I.stopChat(e),this.activeProjectId&&this.chatsByProject[this.activeProjectId]&&(this.chatsByProject[this.activeProjectId]=this.chatsByProject[this.activeProjectId].map(t=>t.id===e?{...t,process_state:"STOPPED",turn_state:"IDLE"}:t),this.notify())}async setChatPolicy(e,t){const o=await I.editChat(e,{permission_policy:t});this.activeProjectId&&this.chatsByProject[this.activeProjectId]&&(this.chatsByProject[this.activeProjectId]=this.chatsByProject[this.activeProjectId].map(i=>i.id===e?{...i,...o}:i),this.notify())}async renameChat(e,t){const o=await I.editChat(e,{title:t});this.activeProjectId&&this.chatsByProject[this.activeProjectId]&&(this.chatsByProject[this.activeProjectId]=this.chatsByProject[this.activeProjectId].map(i=>i.id===e?{...i,...o}:i),this.notify())}async archiveChat(e,t){const o=await I.editChat(e,{archived:t});this.activeProjectId&&this.chatsByProject[this.activeProjectId]&&(this.chatsByProject[this.activeProjectId]=this.chatsByProject[this.activeProjectId].map(i=>i.id===e?{...i,...o}:i),this.notify())}async deleteChat(e){await I.deleteChat(e),this.activeProjectId&&this.chatsByProject[this.activeProjectId]&&(this.chatsByProject[this.activeProjectId]=this.chatsByProject[this.activeProjectId].filter(t=>t.id!==e)),delete this.reducersByChat[e],delete this.configOptionsByChat[e],this.activeChatId===e&&(this.activeProjectId?W.navigate(`/projects/${this.activeProjectId}`):W.navigate("/")),this.notify()}async setChatConfig(e,t,o){const i=await I.setChatConfig(e,t,o);this.configOptionsByChat[e]=i,this.notify()}async createProject(e,t){const o=await I.createProject(e,t);return this.projects=[o,...this.projects],this.notify(),o}async createChat(e,t){const o=await I.createChat(e,t);return this.chatsByProject[e]||(this.chatsByProject[e]=[]),this.chatsByProject[e]=[...this.chatsByProject[e],o],this.projects=this.projects.map(i=>i.id===e?{...i,chat_count:(i.chat_count||0)+1}:i),this.notify(),o}async editProject(e,t,o){const i=await I.editProject(e,t,o);return this.projects=this.projects.map(s=>s.id===e?{...s,...i}:s),this.notify(),i}async deleteProject(e){await I.deleteProject(e),this.projects=this.projects.filter(t=>t.id!==e),delete this.chatsByProject[e],this.activeProjectId===e&&(this.activeProjectId=null,this.activeChatId=null,W.navigate("/")),this.notify()}async respondPermission(e,t,o){await I.respondPermission(e,t,o)}handleIncomingEvent(e){const{session_id:t,payload:o}=e;if(o.type==="metadata_changed"){this.loadProjects();for(const i of Object.keys(this.chatsByProject))this.loadChats(i);this.activeProjectId&&!this.chatsByProject[this.activeProjectId]&&this.loadChats(this.activeProjectId);return}if(o.type==="config_options"){t&&(this.configOptionsByChat[t]=o.options||[],this.notify());return}if(t){if(this.reducersByChat[t]||(this.reducersByChat[t]=new Tt),this.reducersByChat[t].ingest(e),o.type==="state_change")for(const i of Object.keys(this.chatsByProject))this.chatsByProject[i]=this.chatsByProject[i].map(s=>s.id===t?{...s,process_state:o.process||s.process_state,turn_state:o.turn||s.turn_state}:s);this.notify()}}}const y=new zi;function n(r,e,t,o){var i=arguments.length,s=i<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(r,e,t,o);else for(var h=r.length-1;h>=0;h--)(a=r[h])&&(s=(i<3?a(s):i>3?a(e,t,s):a(e,t))||s);return i>3&&s&&Object.defineProperty(e,t,s),s}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ri extends b{connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true")}render(){return l`<span class="shadow"></span>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const pr=g`:host,.shadow,.shadow::before,.shadow::after{border-radius:inherit;inset:0;position:absolute;transition-duration:inherit;transition-property:inherit;transition-timing-function:inherit}:host{display:flex;pointer-events:none;transition-property:box-shadow,opacity}.shadow::before,.shadow::after{content:"";transition-property:box-shadow,opacity;--_level: var(--md-elevation-level, 0);--_shadow-color: var(--md-elevation-shadow-color, var(--md-sys-color-shadow, #000))}.shadow::before{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0px var(--_shadow-color);opacity:.3}.shadow::after{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);opacity:.15}
`;pr.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Dt=class extends Ri{};Dt.styles=[pr];Dt=n([x("md-elevation")],Dt);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ur=Symbol("attachableController");let mr;mr=new MutationObserver(r=>{for(const e of r)e.target[ur]?.hostConnected()});class fr{get htmlFor(){return this.host.getAttribute("for")}set htmlFor(e){e===null?this.host.removeAttribute("for"):this.host.setAttribute("for",e)}get control(){return this.host.hasAttribute("for")?!this.htmlFor||!this.host.isConnected?null:this.host.getRootNode().querySelector(`#${this.htmlFor}`):this.currentControl||this.host.parentElement}set control(e){e?this.attach(e):this.detach()}constructor(e,t){this.host=e,this.onControlChange=t,this.currentControl=null,e.addController(this),e[ur]=this,mr?.observe(e,{attributeFilter:["for"]})}attach(e){e!==this.currentControl&&(this.setCurrentControl(e),this.host.removeAttribute("for"))}detach(){this.setCurrentControl(null),this.host.setAttribute("for","")}hostConnected(){this.setCurrentControl(this.control)}hostDisconnected(){this.setCurrentControl(null)}setCurrentControl(e){this.onControlChange(this.currentControl,e),this.currentControl=e}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Di=["focusin","focusout","pointerdown"];class bo extends b{constructor(){super(...arguments),this.visible=!1,this.inward=!1,this.attachableController=new fr(this,this.onControlChange.bind(this))}get htmlFor(){return this.attachableController.htmlFor}set htmlFor(e){this.attachableController.htmlFor=e}get control(){return this.attachableController.control}set control(e){this.attachableController.control=e}attach(e){this.attachableController.attach(e)}detach(){this.attachableController.detach()}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true")}handleEvent(e){if(!e[Ko]){switch(e.type){default:return;case"focusin":this.visible=this.control?.matches(":focus-visible")??!1;break;case"focusout":case"pointerdown":this.visible=!1;break}e[Ko]=!0}}onControlChange(e,t){for(const o of Di)e?.removeEventListener(o,this),t?.addEventListener(o,this)}update(e){e.has("visible")&&this.dispatchEvent(new Event("visibility-changed")),super.update(e)}}n([d({type:Boolean,reflect:!0})],bo.prototype,"visible",void 0);n([d({type:Boolean,reflect:!0})],bo.prototype,"inward",void 0);const Ko=Symbol("handledByFocusRing");/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const vr=g`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`;vr.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Mt=class extends bo{};Mt.styles=[vr];Mt=n([x("md-focus-ring")],Mt);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const he={ATTRIBUTE:1,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},yo=r=>(...e)=>({_$litDirective$:r,values:e});let xo=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,o){this._$Ct=e,this._$AM=t,this._$Ci=o}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const F=yo(class extends xo{constructor(r){if(super(r),r.type!==he.ATTRIBUTE||r.name!=="class"||r.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(r){return" "+Object.keys(r).filter(e=>r[e]).join(" ")+" "}update(r,[e]){if(this.st===void 0){this.st=new Set,r.strings!==void 0&&(this.nt=new Set(r.strings.join(" ").split(/\s/).filter(o=>o!=="")));for(const o in e)e[o]&&!this.nt?.has(o)&&this.st.add(o);return this.render(e)}const t=r.element.classList;for(const o of this.st)o in e||(t.remove(o),this.st.delete(o));for(const o in e){const i=!!e[o];i===this.st.has(o)||this.nt?.has(o)||(i?(t.add(o),this.st.add(o)):(t.remove(o),this.st.delete(o)))}return V}});/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ee={STANDARD:"cubic-bezier(0.2, 0, 0, 1)",EMPHASIZED:"cubic-bezier(.3,0,0,1)",EMPHASIZED_ACCELERATE:"cubic-bezier(.3,0,.8,.15)"};function Mi(){let r=null;return{start(){return r?.abort(),r=new AbortController,r.signal},finish(){r=null}}}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Li=450,Yo=225,Bi=.2,Ni=10,Fi=75,Ui=.35,qi="::after",Hi="forwards";var N;(function(r){r[r.INACTIVE=0]="INACTIVE",r[r.TOUCH_DELAY=1]="TOUCH_DELAY",r[r.HOLDING=2]="HOLDING",r[r.WAITING_FOR_CLICK=3]="WAITING_FOR_CLICK"})(N||(N={}));const Vi=["click","contextmenu","pointercancel","pointerdown","pointerenter","pointerleave","pointerup"],Wi=150,Gi=window.matchMedia("(forced-colors: active)");class et extends b{constructor(){super(...arguments),this.disabled=!1,this.hovered=!1,this.pressed=!1,this.rippleSize="",this.rippleScale="",this.initialSize=0,this.state=N.INACTIVE,this.attachableController=new fr(this,this.onControlChange.bind(this))}get htmlFor(){return this.attachableController.htmlFor}set htmlFor(e){this.attachableController.htmlFor=e}get control(){return this.attachableController.control}set control(e){this.attachableController.control=e}attach(e){this.attachableController.attach(e)}detach(){this.attachableController.detach()}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true")}render(){const e={hovered:this.hovered,pressed:this.pressed};return l`<div class="surface ${F(e)}"></div>`}update(e){e.has("disabled")&&this.disabled&&(this.hovered=!1,this.pressed=!1),super.update(e)}handlePointerenter(e){this.shouldReactToEvent(e)&&(this.hovered=!0)}handlePointerleave(e){this.shouldReactToEvent(e)&&(this.hovered=!1,this.state!==N.INACTIVE&&this.endPressAnimation())}handlePointerup(e){if(this.shouldReactToEvent(e)){if(this.state===N.HOLDING){this.state=N.WAITING_FOR_CLICK;return}if(this.state===N.TOUCH_DELAY){this.state=N.WAITING_FOR_CLICK,this.startPressAnimation(this.rippleStartEvent);return}}}async handlePointerdown(e){if(this.shouldReactToEvent(e)){if(this.rippleStartEvent=e,!this.isTouch(e)){this.state=N.WAITING_FOR_CLICK,this.startPressAnimation(e);return}this.state=N.TOUCH_DELAY,await new Promise(t=>{setTimeout(t,Wi)}),this.state===N.TOUCH_DELAY&&(this.state=N.HOLDING,this.startPressAnimation(e))}}handleClick(){if(!this.disabled){if(this.state===N.WAITING_FOR_CLICK){this.endPressAnimation();return}this.state===N.INACTIVE&&(this.startPressAnimation(),this.endPressAnimation())}}handlePointercancel(e){this.shouldReactToEvent(e)&&this.endPressAnimation()}handleContextmenu(){this.disabled||this.endPressAnimation()}determineRippleSize(){const{height:e,width:t}=this.getBoundingClientRect(),o=Math.max(e,t),i=Math.max(Ui*o,Fi),s=this.currentCSSZoom??1,a=Math.floor(o*Bi/s),c=Math.sqrt(t**2+e**2)+Ni;this.initialSize=a;const u=(c+i)/a;this.rippleScale=`${u/s}`,this.rippleSize=`${a}px`}getNormalizedPointerEventCoords(e){const{scrollX:t,scrollY:o}=window,{left:i,top:s}=this.getBoundingClientRect(),a=t+i,h=o+s,{pageX:c,pageY:u}=e,m=this.currentCSSZoom??1;return{x:(c-a)/m,y:(u-h)/m}}getTranslationCoordinates(e){const{height:t,width:o}=this.getBoundingClientRect(),i=this.currentCSSZoom??1,s={x:(o/i-this.initialSize)/2,y:(t/i-this.initialSize)/2};let a;return e instanceof PointerEvent?a=this.getNormalizedPointerEventCoords(e):a={x:o/i/2,y:t/i/2},a={x:a.x-this.initialSize/2,y:a.y-this.initialSize/2},{startPoint:a,endPoint:s}}startPressAnimation(e){if(!this.mdRoot)return;this.pressed=!0,this.growAnimation?.cancel(),this.determineRippleSize();const{startPoint:t,endPoint:o}=this.getTranslationCoordinates(e),i=`${t.x}px, ${t.y}px`,s=`${o.x}px, ${o.y}px`;this.growAnimation=this.mdRoot.animate({top:[0,0],left:[0,0],height:[this.rippleSize,this.rippleSize],width:[this.rippleSize,this.rippleSize],transform:[`translate(${i}) scale(1)`,`translate(${s}) scale(${this.rippleScale})`]},{pseudoElement:qi,duration:Li,easing:ee.STANDARD,fill:Hi})}async endPressAnimation(){this.rippleStartEvent=void 0,this.state=N.INACTIVE;const e=this.growAnimation;let t=1/0;if(typeof e?.currentTime=="number"?t=e.currentTime:e?.currentTime&&(t=e.currentTime.to("ms").value),t>=Yo){this.pressed=!1;return}await new Promise(o=>{setTimeout(o,Yo-t)}),this.growAnimation===e&&(this.pressed=!1)}shouldReactToEvent(e){if(this.disabled||!e.isPrimary||this.rippleStartEvent&&this.rippleStartEvent.pointerId!==e.pointerId)return!1;if(e.type==="pointerenter"||e.type==="pointerleave")return!this.isTouch(e);const t=e.buttons===1;return this.isTouch(e)||t}isTouch({pointerType:e}){return e==="touch"}async handleEvent(e){if(!Gi?.matches)switch(e.type){case"click":this.handleClick();break;case"contextmenu":this.handleContextmenu();break;case"pointercancel":this.handlePointercancel(e);break;case"pointerdown":await this.handlePointerdown(e);break;case"pointerenter":this.handlePointerenter(e);break;case"pointerleave":this.handlePointerleave(e);break;case"pointerup":this.handlePointerup(e);break}}onControlChange(e,t){for(const o of Vi)e?.removeEventListener(o,this),t?.addEventListener(o,this)}}n([d({type:Boolean,reflect:!0})],et.prototype,"disabled",void 0);n([f()],et.prototype,"hovered",void 0);n([f()],et.prototype,"pressed",void 0);n([S(".surface")],et.prototype,"mdRoot",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const gr=g`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`;gr.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Lt=class extends et{};Lt.styles=[gr];Lt=n([x("md-ripple")],Lt);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const br=["role","ariaAtomic","ariaAutoComplete","ariaBusy","ariaChecked","ariaColCount","ariaColIndex","ariaColSpan","ariaCurrent","ariaDisabled","ariaExpanded","ariaHasPopup","ariaHidden","ariaInvalid","ariaKeyShortcuts","ariaLabel","ariaLevel","ariaLive","ariaModal","ariaMultiLine","ariaMultiSelectable","ariaOrientation","ariaPlaceholder","ariaPosInSet","ariaPressed","ariaReadOnly","ariaRequired","ariaRoleDescription","ariaRowCount","ariaRowIndex","ariaRowSpan","ariaSelected","ariaSetSize","ariaSort","ariaValueMax","ariaValueMin","ariaValueNow","ariaValueText"],Ki=br.map(yr);function Ot(r){return Ki.includes(r)}function yr(r){return r.replace("aria","aria-").replace(/Elements?/g,"").toLowerCase()}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const lt=Symbol("privateIgnoreAttributeChangesFor");function oe(r){var e;class t extends r{constructor(){super(...arguments),this[e]=new Set}attributeChangedCallback(i,s,a){if(!Ot(i)){super.attributeChangedCallback(i,s,a);return}if(this[lt].has(i))return;this[lt].add(i),this.removeAttribute(i),this[lt].delete(i);const h=Nt(i);a===null?delete this.dataset[h]:this.dataset[h]=a,this.requestUpdate(Nt(i),s)}getAttribute(i){return Ot(i)?super.getAttribute(Bt(i)):super.getAttribute(i)}removeAttribute(i){super.removeAttribute(i),Ot(i)&&(super.removeAttribute(Bt(i)),this.requestUpdate())}}return e=lt,Yi(t),t}function Yi(r){for(const e of br){const t=yr(e),o=Bt(t),i=Nt(t);r.createProperty(e,{attribute:t,noAccessor:!0}),r.createProperty(Symbol(o),{attribute:o,noAccessor:!0}),Object.defineProperty(r.prototype,e,{configurable:!0,enumerable:!0,get(){return this.dataset[i]??null},set(s){const a=this.dataset[i]??null;s!==a&&(s===null?delete this.dataset[i]:this.dataset[i]=s,this.requestUpdate(e,a))}})}}function Bt(r){return`data-${r}`}function Nt(r){return r.replace(/-\w/,e=>e[1].toUpperCase())}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function xr(r){const e=new MouseEvent("click",{bubbles:!0});return r.dispatchEvent(e),e}function _r(r){return r.currentTarget!==r.target||r.composedPath()[0]!==r.target||r.target.disabled?!1:!Xi(r)}function Xi(r){const e=Ft;return e&&(r.preventDefault(),r.stopImmediatePropagation()),Zi(),e}let Ft=!1;async function Zi(){Ft=!0,await null,Ft=!1}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const H=Symbol("internals"),jt=Symbol("privateInternals");function tt(r){class e extends r{get[H](){return this[jt]||(this[jt]=this.attachInternals()),this[jt]}}return e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ie=Symbol("getFormValue"),Ut=Symbol("getFormState");function ot(r){class e extends r{get form(){return this[H].form}get labels(){return this[H].labels}get name(){return this.getAttribute("name")??""}set name(o){this.setAttribute("name",o)}get disabled(){return this.hasAttribute("disabled")}set disabled(o){this.toggleAttribute("disabled",!!o)}attributeChangedCallback(o,i,s){if(o==="name"||o==="disabled"){const a=o==="disabled"?i!==null:i;this.requestUpdate(o,a);return}super.attributeChangedCallback(o,i,s)}requestUpdate(o,i,s){super.requestUpdate(o,i,s),this[H].setFormValue(this[Ie](),this[Ut]())}[Ie](){return this.getAttribute("value")}[Ut](){return this[Ie]()}formDisabledCallback(o){this.disabled=o}}return e.formAssociated=!0,n([d({noAccessor:!0})],e.prototype,"name",null),n([d({type:Boolean,noAccessor:!0})],e.prototype,"disabled",null),e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const wr=Symbol("dispatchHooks");function _o(r,e){const t=r[wr];if(!t)throw new Error(`'${r.type}' event needs setupDispatchHooks().`);t.addEventListener("after",e,{once:!0})}const Xo=new WeakMap;function wo(r,...e){let t=Xo.get(r);t||(t=new Set,Xo.set(r,t));for(const o of e)t.has(o)||(r.addEventListener(o,i=>{const s=new EventTarget;i[wr]=s;const a=new AbortController,h=()=>{a.abort(),s.dispatchEvent(new Event("after"))},c=v=>function(){v.call(this),h()};i.stopPropagation=c(i.stopPropagation),i.stopImmediatePropagation=c(i.stopImmediatePropagation);const u=i.composedPath();let m;i.composed&&i.bubbles?m=u[u.length-1]:i.bubbles?m=u[0].getRootNode():m=u[0],m.addEventListener(o,()=>{h()},{once:!0,signal:a.signal})},{capture:!0}),t.add(o))}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function $r(r){class e extends r{get name(){return this.getAttribute("name")??""}set name(o){this.setAttribute("name",o)}constructor(...o){super(...o),this.type="submit",this.value="",wo(this,"click"),this.addEventListener("click",async i=>{const s=this.type==="reset",a=this.type==="submit",h=this[H],{form:c}=h;!c||!(a||s)||_o(i,()=>{if(!i.defaultPrevented){if(s){c.reset();return}c.addEventListener("submit",u=>{Object.defineProperty(u,"submitter",{configurable:!0,enumerable:!0,get:()=>this})},{capture:!0,once:!0}),h.setFormValue(this.value),c.requestSubmit()}})})}}return n([d()],e.prototype,"type",void 0),n([d({reflect:!0})],e.prototype,"value",void 0),e}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ji=oe($r(ot(tt(b))));class K extends Ji{constructor(){super(),this.softDisabled=!1,this.href="",this.download="",this.target="",this.trailingIcon=!1,this.hasIcon=!1,this.addEventListener("click",this.handleClick.bind(this))}focus(){this.buttonElement?.focus()}blur(){this.buttonElement?.blur()}render(){const e=this.disabled||this.softDisabled,t=this.href?this.renderLink():this.renderButton(),o=this.href?"link":"button";return l`
      ${this.renderElevationOrOutline?.()}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${o}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${o}
        ?disabled="${e}"></md-ripple>
      ${t}
    `}renderButton(){const{ariaLabel:e,ariaHasPopup:t,ariaExpanded:o}=this;return l`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled||p}
      aria-label="${e||p}"
      aria-haspopup="${t||p}"
      aria-expanded="${o||p}">
      ${this.renderContent()}
    </button>`}renderLink(){const{ariaLabel:e,ariaHasPopup:t,ariaExpanded:o}=this;return l`<a
      id="link"
      class="button"
      aria-label="${e||p}"
      aria-haspopup="${t||p}"
      aria-expanded="${o||p}"
      aria-disabled=${this.disabled||this.softDisabled||p}
      tabindex="${this.disabled&&!this.softDisabled?-1:p}"
      href=${this.href}
      download=${this.download||p}
      target=${this.target||p}
      >${this.renderContent()}
    </a>`}renderContent(){const e=l`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;return l`
      <span class="touch"></span>
      ${this.trailingIcon?p:e}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon?e:p}
    `}handleClick(e){if(this.softDisabled||this.disabled&&this.href){e.stopImmediatePropagation(),e.preventDefault();return}!_r(e)||!this.buttonElement||(this.focus(),xr(this.buttonElement))}handleSlotChange(){this.hasIcon=this.assignedIcons.length>0}}K.shadowRootOptions={mode:"open",delegatesFocus:!0};n([d({type:Boolean,attribute:"soft-disabled",reflect:!0})],K.prototype,"softDisabled",void 0);n([d()],K.prototype,"href",void 0);n([d()],K.prototype,"download",void 0);n([d()],K.prototype,"target",void 0);n([d({type:Boolean,attribute:"trailing-icon",reflect:!0})],K.prototype,"trailingIcon",void 0);n([d({type:Boolean,attribute:"has-icon",reflect:!0})],K.prototype,"hasIcon",void 0);n([S(".button")],K.prototype,"buttonElement",void 0);n([te({slot:"icon",flatten:!0})],K.prototype,"assignedIcons",void 0);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Qi extends K{renderElevationOrOutline(){return l`<md-elevation part="elevation"></md-elevation>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Cr=g`:host{--_container-color: var(--md-filled-button-container-color, var(--md-sys-color-primary, #6750a4));--_container-elevation: var(--md-filled-button-container-elevation, 0);--_container-height: var(--md-filled-button-container-height, 40px);--_container-shadow-color: var(--md-filled-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color: var(--md-filled-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation: var(--md-filled-button-disabled-container-elevation, 0);--_disabled-container-opacity: var(--md-filled-button-disabled-container-opacity, 0.12);--_disabled-label-text-color: var(--md-filled-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation: var(--md-filled-button-focus-container-elevation, 0);--_focus-label-text-color: var(--md-filled-button-focus-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-container-elevation: var(--md-filled-button-hover-container-elevation, 1);--_hover-label-text-color: var(--md-filled-button-hover-label-text-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-color: var(--md-filled-button-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-opacity: var(--md-filled-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filled-button-label-text-color, var(--md-sys-color-on-primary, #fff));--_label-text-font: var(--md-filled-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filled-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filled-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-container-elevation: var(--md-filled-button-pressed-container-elevation, 0);--_pressed-label-text-color: var(--md-filled-button-pressed-label-text-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-color: var(--md-filled-button-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-opacity: var(--md-filled-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-filled-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-button-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-icon-color: var(--md-filled-button-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-color: var(--md-filled-button-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-size: var(--md-filled-button-icon-size, 18px);--_pressed-icon-color: var(--md-filled-button-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_container-shape-start-start: var(--md-filled-button-container-shape-start-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-button-container-shape-start-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-button-container-shape-end-end, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-button-container-shape-end-start, var(--md-filled-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-filled-button-leading-space, 24px);--_trailing-space: var(--md-filled-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-filled-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-filled-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-filled-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-filled-button-with-trailing-icon-trailing-space, 16px)}
`;Cr.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Er=g`md-elevation{transition-duration:280ms}:host(:is([disabled],[soft-disabled])) md-elevation{transition:none}md-elevation{--md-elevation-level: var(--_container-elevation);--md-elevation-shadow-color: var(--_container-shadow-color)}:host(:focus-within) md-elevation{--md-elevation-level: var(--_focus-container-elevation)}:host(:hover) md-elevation{--md-elevation-level: var(--_hover-container-elevation)}:host(:active) md-elevation{--md-elevation-level: var(--_pressed-container-elevation)}:host(:is([disabled],[soft-disabled])) md-elevation{--md-elevation-level: var(--_disabled-container-elevation)}
`;Er.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const $t=g`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);box-sizing:border-box;cursor:pointer;display:inline-flex;gap:8px;min-height:var(--_container-height);outline:none;padding-block:calc((var(--_container-height) - max(var(--_label-text-line-height),var(--_icon-size)))/2);padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space);place-content:center;place-items:center;position:relative;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-overflow:ellipsis;text-wrap:nowrap;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:top;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){cursor:default;pointer-events:none}.button{border-radius:inherit;cursor:inherit;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;min-width:calc(64px - var(--_leading-space) - var(--_trailing-space));width:100%;z-index:0;height:100%;font:inherit;color:var(--_label-text-color);padding:0;gap:inherit;text-transform:inherit}.button::-moz-focus-inner{padding:0;border:0}:host(:hover) .button{color:var(--_hover-label-text-color)}:host(:focus-within) .button{color:var(--_focus-label-text-color)}:host(:active) .button{color:var(--_pressed-label-text-color)}.background{background:var(--_container-color);border-radius:inherit;inset:0;position:absolute}.label{overflow:hidden}:is(.button,.label,.label slot),.label ::slotted(*){text-overflow:inherit}:host(:is([disabled],[soft-disabled])) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}:host(:is([disabled],[soft-disabled])) .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors: active){.background{border:1px solid CanvasText}:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1;--_disabled-container-opacity: 1;--_disabled-label-text-color: GrayText;--_disabled-label-text-opacity: 1}}:host([has-icon]:not([trailing-icon])){padding-inline-start:var(--_with-leading-icon-leading-space);padding-inline-end:var(--_with-leading-icon-trailing-space)}:host([has-icon][trailing-icon]){padding-inline-start:var(--_with-trailing-icon-leading-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;flex-shrink:0;color:var(--_icon-color);font-size:var(--_icon-size);inline-size:var(--_icon-size);block-size:var(--_icon-size)}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus-within) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host(:is([disabled],[soft-disabled])) ::slotted([slot=icon]){color:var(--_disabled-icon-color);opacity:var(--_disabled-icon-opacity)}.touch{position:absolute;top:50%;height:max(48px,100%);left:0;right:0;transform:translateY(-50%)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}:host([touch-target=none]) .touch{display:none}
`;$t.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let qt=class extends Qi{};qt.styles=[$t,Er,Cr];qt=n([x("md-filled-button")],qt);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class es extends K{}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const kr=g`:host{--_container-height: var(--md-text-button-container-height, 40px);--_disabled-label-text-color: var(--md-text-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-text-button-disabled-label-text-opacity, 0.38);--_focus-label-text-color: var(--md-text-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-text-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-text-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-text-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-text-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-text-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-text-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-text-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-text-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-text-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-text-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-text-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-text-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-text-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-text-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-text-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-text-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-text-button-icon-size, 18px);--_pressed-icon-color: var(--md-text-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-text-button-container-shape-start-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-text-button-container-shape-start-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-text-button-container-shape-end-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-text-button-container-shape-end-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-text-button-leading-space, 12px);--_trailing-space: var(--md-text-button-trailing-space, 12px);--_with-leading-icon-leading-space: var(--md-text-button-with-leading-icon-leading-space, 12px);--_with-leading-icon-trailing-space: var(--md-text-button-with-leading-icon-trailing-space, 16px);--_with-trailing-icon-leading-space: var(--md-text-button-with-trailing-icon-leading-space, 16px);--_with-trailing-icon-trailing-space: var(--md-text-button-with-trailing-icon-trailing-space, 12px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}
`;kr.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Ht=class extends es{};Ht.styles=[$t,kr];Ht=n([x("md-text-button")],Ht);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ar=Symbol.for(""),ts=r=>{if(r?.r===Ar)return r?._$litStatic$},ue=(r,...e)=>({_$litStatic$:e.reduce((t,o,i)=>t+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+r[i+1],r[0]),r:Ar}),Zo=new Map,os=r=>(e,...t)=>{const o=t.length;let i,s;const a=[],h=[];let c,u=0,m=!1;for(;u<o;){for(c=e[u];u<o&&(s=t[u],(i=ts(s))!==void 0);)c+=i+e[++u],m=!0;u!==o&&h.push(s),a.push(c),u++}if(u===o&&a.push(e[o]),m){const v=a.join("$$lit$$");(e=Zo.get(v))===void 0&&(a.raw=a,Zo.set(v,e=a)),t=h}return r(e,...t)},Ct=os(l);/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Jo(r,e=!0){return e&&getComputedStyle(r).getPropertyValue("direction").trim()==="rtl"}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const rs=oe($r(ot(tt(b))));class Y extends rs{constructor(){super(),this.softDisabled=!1,this.flipIconInRtl=!1,this.href="",this.download="",this.target="",this.ariaLabelSelected="",this.toggle=!1,this.selected=!1,this.flipIcon=Jo(this,this.flipIconInRtl),wo(this,"click"),this.addEventListener("click",e=>{if(this.softDisabled||this.disabled&&this.href){e.stopImmediatePropagation(),e.preventDefault();return}const t=this.selected;_o(e,()=>{!this.toggle||this.disabled||e.defaultPrevented||(this.selected=!t,this.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0})))})})}willUpdate(){this.href&&(this.disabled=!1,this.softDisabled=!1)}render(){const e=this.href?ue`div`:ue`button`,{ariaLabel:t,ariaHasPopup:o,ariaExpanded:i}=this,s=t&&this.ariaLabelSelected,a=this.toggle?this.selected:p;let h=p;return this.href||(h=s&&this.selected?this.ariaLabelSelected:t),Ct`<${e}
        class="icon-button ${F(this.getRenderClasses())}"
        id="button"
        aria-label="${h||p}"
        aria-haspopup="${!this.href&&o||p}"
        aria-expanded="${!this.href&&i||p}"
        aria-pressed="${a}"
        aria-disabled=${!this.href&&this.softDisabled||p}
        ?disabled="${!this.href&&this.disabled}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${this.selected?p:this.renderIcon()}
        ${this.selected?this.renderSelectedIcon():p}
        ${this.href?this.renderLink():this.renderTouchTarget()}
  </${e}>`}renderLink(){const{ariaLabel:e}=this;return l`
      <a
        class="link"
        id="link"
        href="${this.href}"
        download="${this.download||p}"
        target="${this.target||p}"
        aria-label="${e||p}">
        ${this.renderTouchTarget()}
      </a>
    `}getRenderClasses(){return{"flip-icon":this.flipIcon,selected:this.toggle&&this.selected}}renderIcon(){return l`<span class="icon"><slot></slot></span>`}renderSelectedIcon(){return l`<span class="icon icon--selected"
      ><slot name="selected"><slot></slot></slot
    ></span>`}renderTouchTarget(){return l`<span class="touch"></span>`}renderFocusRing(){return l`<md-focus-ring
      part="focus-ring"
      for=${this.href?"link":"button"}></md-focus-ring>`}renderRipple(){const e=!this.href&&(this.disabled||this.softDisabled);return l`<md-ripple
      for=${this.href?"link":p}
      ?disabled="${e}"></md-ripple>`}connectedCallback(){this.flipIcon=Jo(this,this.flipIconInRtl),super.connectedCallback()}}Y.shadowRootOptions={mode:"open",delegatesFocus:!0};n([d({type:Boolean,attribute:"soft-disabled",reflect:!0})],Y.prototype,"softDisabled",void 0);n([d({type:Boolean,attribute:"flip-icon-in-rtl"})],Y.prototype,"flipIconInRtl",void 0);n([d()],Y.prototype,"href",void 0);n([d()],Y.prototype,"download",void 0);n([d()],Y.prototype,"target",void 0);n([d({attribute:"aria-label-selected"})],Y.prototype,"ariaLabelSelected",void 0);n([d({type:Boolean})],Y.prototype,"toggle",void 0);n([d({type:Boolean,reflect:!0})],Y.prototype,"selected",void 0);n([f()],Y.prototype,"flipIcon",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const $o=g`:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);height:var(--_container-height);width:var(--_container-width);justify-content:center}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) max(0px,(48px - var(--_container-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){pointer-events:none}.icon-button{place-items:center;background:none;border:none;box-sizing:border-box;cursor:pointer;display:flex;place-content:center;outline:none;padding:0;position:relative;text-decoration:none;user-select:none;z-index:0;flex:1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.icon ::slotted(*){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size);font-weight:inherit}md-ripple{z-index:-1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.flip-icon .icon{transform:scaleX(-1)}.icon{display:inline-flex}.link{display:grid;height:100%;outline:none;place-items:center;position:absolute;width:100%}.touch{position:absolute;height:max(48px,100%);width:max(48px,100%)}:host([touch-target=none]) .touch{display:none}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1}}
`;$o.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Pr=g`:host{--_disabled-icon-color: var(--md-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-icon-button-disabled-icon-opacity, 0.38);--_icon-size: var(--md-icon-button-icon-size, 24px);--_selected-focus-icon-color: var(--md-icon-button-selected-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-icon-color: var(--md-icon-button-selected-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-color: var(--md-icon-button-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-opacity: var(--md-icon-button-selected-hover-state-layer-opacity, 0.08);--_selected-icon-color: var(--md-icon-button-selected-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-icon-color: var(--md-icon-button-selected-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-color: var(--md-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-opacity: var(--md-icon-button-selected-pressed-state-layer-opacity, 0.12);--_state-layer-height: var(--md-icon-button-state-layer-height, 40px);--_state-layer-shape: var(--md-icon-button-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));--_state-layer-width: var(--md-icon-button-state-layer-width, 40px);--_focus-icon-color: var(--md-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-icon-button-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-icon-button-pressed-state-layer-opacity, 0.12);--_container-shape-start-start: 0;--_container-shape-start-end: 0;--_container-shape-end-end: 0;--_container-shape-end-start: 0;--_container-height: 0;--_container-width: 0;height:var(--_state-layer-height);width:var(--_state-layer-width)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_state-layer-height))/2) max(0px,(48px - var(--_state-layer-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_state-layer-shape);--md-focus-ring-shape-start-end: var(--_state-layer-shape);--md-focus-ring-shape-end-end: var(--_state-layer-shape);--md-focus-ring-shape-end-start: var(--_state-layer-shape)}.standard{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.standard:hover{color:var(--_hover-icon-color)}.standard:focus{color:var(--_focus-icon-color)}.standard:active{color:var(--_pressed-icon-color)}.standard:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}md-ripple{border-radius:var(--_state-layer-shape)}.standard:is(:disabled,[aria-disabled=true]){opacity:var(--_disabled-icon-opacity)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}
`;Pr.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Vt=class extends Y{getRenderClasses(){return{...super.getRenderClasses(),standard:!0}}};Vt.styles=[$o,Pr];Vt=n([x("md-icon-button")],Vt);var is=Object.defineProperty,ss=Object.getOwnPropertyDescriptor,Co=(r,e,t,o)=>{for(var i=o>1?void 0:o?ss(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&is(e,t,i),i};let Ve=class extends b{constructor(){super(...arguments),this.isOpen=!1,this.showArchived=!1}connectedCallback(){super.connectedCallback(),this.unsubscribeStore=y.subscribe(()=>{this.requestUpdate()})}disconnectedCallback(){this.unsubscribeStore&&this.unsubscribeStore(),super.disconnectedCallback()}closeMobileDrawer(){y.isMobileDrawerOpen=!1}handleGoHome(){W.navigate("/"),this.closeMobileDrawer()}handleSelectProject(r){W.navigate(`/projects/${r}`),this.closeMobileDrawer()}handleSelectChat(r,e){W.navigate(`/projects/${r}/chats/${e}`),this.closeMobileDrawer()}handleNewProject(){this.dispatchEvent(new CustomEvent("open-new-project",{bubbles:!0,composed:!0})),this.closeMobileDrawer()}handleNewChat(){this.dispatchEvent(new CustomEvent("open-agent-picker",{bubbles:!0,composed:!0})),this.closeMobileDrawer()}render(){const{projects:r,activeProjectId:e,activeChatId:t,chatsByProject:o,wsStatus:i}=y,s=y.activeProject,a=e?o[e]||[]:[],h=this.showArchived?a:a.filter(c=>!c.archived);return l`
      <div class="drawer-header">
        <div class="brand" @click=${this.handleGoHome}>
          <div class="brand-icon">
            <span class="icon">hub</span>
          </div>
          <span class="brand-title">Agent Hub</span>
        </div>
        <md-icon-button class="close-btn" @click=${this.closeMobileDrawer}>
          <span class="icon">close</span>
        </md-icon-button>
      </div>

      <div class="drawer-body">
        <!-- Projects Section -->
        <div>
          <div class="section-title">
            <span>Projects</span>
            <md-icon-button
              title="New Project"
              style="--md-icon-button-size: 28px; width: 28px; height: 28px;"
              @click=${this.handleNewProject}
            >
              <span class="icon" style="font-size: 16px;">add</span>
            </md-icon-button>
          </div>

          <ul class="nav-list">
            ${r.map(c=>l`
                <li
                  class="nav-item ${e===c.id&&!t?"active":""}"
                  @click=${()=>this.handleSelectProject(c.id)}
                >
                  <div class="nav-item-left">
                    <span class="icon" style="color: var(--md-sys-color-outline);">
                      folder
                    </span>
                    <span class="nav-item-title">${c.name}</span>
                  </div>
                </li>
              `)}
          </ul>
        </div>

        <!-- Chats Section for Active Project -->
        ${s?l`
              <div>
                <div class="project-header">
                  <div class="project-name-row">
                    <span>${s.name}</span>
                  </div>
                  <div class="project-path" title=${s.path}>
                    ${s.path}
                  </div>
                </div>

                <md-filled-button
                  class="new-chat-btn"
                  @click=${this.handleNewChat}
                >
                  <span class="icon" slot="icon">add_comment</span>
                  New Chat
                </md-filled-button>

                <div class="section-title">
                  <span>Chats (${h.length})</span>
                  <md-text-button
                    style="--md-text-button-container-height: 24px; font-size: 0.6875rem;"
                    @click=${()=>this.showArchived=!this.showArchived}
                  >
                    ${this.showArchived?"Active only":"Archived"}
                  </md-text-button>
                </div>

                <ul class="nav-list">
                  ${h.map(c=>{const u=c.process_state==="RUNNING",m=c.process_state==="DEAD";return l`
                      <li
                        class="nav-item ${t===c.id?"active":""}"
                        @click=${()=>this.handleSelectChat(c.project_id,c.id)}
                      >
                        <div class="nav-item-left">
                          <span
                            class="status-dot ${u?"running":m?"dead":"stopped"}"
                          ></span>
                          <span class="nav-item-title" title=${c.title}>
                            ${c.title||"Untitled chat"}
                          </span>
                        </div>
                        <span class="agent-pill">${c.agent}</span>
                      </li>
                    `})}
                  ${h.length===0?l`
                        <li
                          style="padding: 12px; font-size: 0.8125rem; color: var(--md-sys-color-outline); text-align: center;"
                        >
                          No chats yet
                        </li>
                      `:null}
                </ul>
              </div>
            `:null}
      </div>

      <div class="footer">
        <div class="ws-indicator">
          <span class="ws-dot ${i}"></span>
          <span style="text-transform: capitalize;">${i}</span>
        </div>
        <span>Agent Hub v0.2.0</span>
      </div>
    `}};Ve.styles=g`
    :host {
      display: flex;
      flex-direction: column;
      width: 280px;
      height: 100%;
      background-color: var(--md-sys-color-surface-container-low);
      border-right: 1px solid var(--md-sys-color-outline-variant);
      box-sizing: border-box;
      flex-shrink: 0;
      z-index: 100;
    }

    .drawer-header {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }

    .brand-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .brand-title {
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: -0.2px;
      color: var(--md-sys-color-on-surface);
    }

    .close-btn {
      display: none;
    }

    @media (max-width: 839px) {
      .close-btn {
        display: inline-flex;
      }
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--md-sys-color-on-surface-variant);
      padding: 4px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .project-header {
      padding: 8px 12px;
      background-color: var(--md-sys-color-surface-container);
      border-radius: 12px;
      margin-bottom: 8px;
    }

    .project-name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      font-size: 0.9375rem;
    }

    .project-path {
      font-size: 0.75rem;
      color: var(--md-sys-color-outline);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      min-height: 48px;
      box-sizing: border-box;
      border-radius: 8px;
      cursor: pointer;
      color: var(--md-sys-color-on-surface);
      font-size: 0.875rem;
      transition: background-color 0.15s ease;
      user-select: none;
      text-decoration: none;
    }

    .nav-item:hover {
      background-color: var(--md-sys-color-surface-container);
    }

    .nav-item.active {
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      font-weight: 600;
    }

    .nav-item-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1;
    }

    .nav-item-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-dot.running {
      background-color: var(--hub-status-running, #34a853);
    }

    .status-dot.stopped {
      background-color: var(--hub-status-stopped, #9aa0a6);
    }

    .status-dot.dead {
      background-color: var(--hub-status-dead, #ea4335);
    }

    .agent-pill {
      font-size: 0.6875rem;
      padding: 1px 6px;
      border-radius: 4px;
      background-color: var(--md-sys-color-surface-container-high);
      color: var(--md-sys-color-on-surface-variant);
      text-transform: lowercase;
      flex-shrink: 0;
    }

    .actions-row {
      display: flex;
      gap: 8px;
      padding: 0 4px;
    }

    .new-chat-btn {
      width: 100%;
      margin: 4px 0 12px 0;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 18px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }

    .footer {
      padding: 12px 16px;
      border-top: 1px solid var(--md-sys-color-outline-variant);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .ws-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .ws-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .ws-dot.connected {
      background-color: #34a853;
    }

    .ws-dot.connecting {
      background-color: #fbbc04;
    }

    .ws-dot.disconnected {
      background-color: #ea4335;
    }
  `;Co([d({type:Boolean})],Ve.prototype,"isOpen",2);Co([f()],Ve.prototype,"showArchived",2);Ve=Co([x("navigation-drawer")],Ve);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const as=oe(b);class rt extends as{constructor(){super(...arguments),this.size="medium",this.label="",this.lowered=!1}render(){const{ariaLabel:e}=this;return l`
      <button
        class="fab ${F(this.getRenderClasses())}"
        aria-label=${e||p}>
        <md-elevation part="elevation"></md-elevation>
        <md-focus-ring part="focus-ring"></md-focus-ring>
        <md-ripple class="ripple"></md-ripple>
        ${this.renderTouchTarget()} ${this.renderIcon()} ${this.renderLabel()}
      </button>
    `}getRenderClasses(){const e=!!this.label;return{lowered:this.lowered,small:this.size==="small"&&!e,large:this.size==="large"&&!e,extended:e}}renderTouchTarget(){return l`<div class="touch-target"></div>`}renderLabel(){return this.label?l`<span class="label">${this.label}</span>`:""}renderIcon(){const{ariaLabel:e}=this;return l`<span class="icon">
      <slot
        name="icon"
        aria-hidden=${e||this.label?"true":p}>
        <span></span>
      </slot>
    </span>`}}rt.shadowRootOptions={mode:"open",delegatesFocus:!0};n([d({reflect:!0})],rt.prototype,"size",void 0);n([d()],rt.prototype,"label",void 0);n([d({type:Boolean})],rt.prototype,"lowered",void 0);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Sr extends rt{constructor(){super(...arguments),this.variant="surface"}getRenderClasses(){return{...super.getRenderClasses(),primary:this.variant==="primary",secondary:this.variant==="secondary",tertiary:this.variant==="tertiary"}}}n([d()],Sr.prototype,"variant",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ir=g`:host{--_container-color: var(--md-fab-container-color, var(--md-sys-color-surface-container-high, #ece6f0));--_container-elevation: var(--md-fab-container-elevation, 3);--_container-height: var(--md-fab-container-height, 56px);--_container-shadow-color: var(--md-fab-container-shadow-color, var(--md-sys-color-shadow, #000));--_container-width: var(--md-fab-container-width, 56px);--_focus-container-elevation: var(--md-fab-focus-container-elevation, 3);--_focus-icon-color: var(--md-fab-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-container-elevation: var(--md-fab-hover-container-elevation, 4);--_hover-icon-color: var(--md-fab-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-fab-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-fab-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-fab-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-fab-icon-size, 24px);--_lowered-container-color: var(--md-fab-lowered-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_lowered-container-elevation: var(--md-fab-lowered-container-elevation, 1);--_lowered-focus-container-elevation: var(--md-fab-lowered-focus-container-elevation, 1);--_lowered-hover-container-elevation: var(--md-fab-lowered-hover-container-elevation, 2);--_lowered-pressed-container-elevation: var(--md-fab-lowered-pressed-container-elevation, 1);--_pressed-container-elevation: var(--md-fab-pressed-container-elevation, 3);--_pressed-icon-color: var(--md-fab-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-fab-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-fab-pressed-state-layer-opacity, 0.12);--_focus-label-text-color: var(--md-fab-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-fab-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-color: var(--md-fab-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-fab-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-fab-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-fab-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-fab-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_large-container-height: var(--md-fab-large-container-height, 96px);--_large-container-width: var(--md-fab-large-container-width, 96px);--_large-icon-size: var(--md-fab-large-icon-size, 36px);--_pressed-label-text-color: var(--md-fab-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_primary-container-color: var(--md-fab-primary-container-color, var(--md-sys-color-primary-container, #eaddff));--_primary-focus-icon-color: var(--md-fab-primary-focus-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-focus-label-text-color: var(--md-fab-primary-focus-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-hover-icon-color: var(--md-fab-primary-hover-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-hover-label-text-color: var(--md-fab-primary-hover-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-hover-state-layer-color: var(--md-fab-primary-hover-state-layer-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-icon-color: var(--md-fab-primary-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-label-text-color: var(--md-fab-primary-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-pressed-icon-color: var(--md-fab-primary-pressed-icon-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-pressed-label-text-color: var(--md-fab-primary-pressed-label-text-color, var(--md-sys-color-on-primary-container, #21005d));--_primary-pressed-state-layer-color: var(--md-fab-primary-pressed-state-layer-color, var(--md-sys-color-on-primary-container, #21005d));--_secondary-container-color: var(--md-fab-secondary-container-color, var(--md-sys-color-secondary-container, #e8def8));--_secondary-focus-icon-color: var(--md-fab-secondary-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-focus-label-text-color: var(--md-fab-secondary-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-hover-icon-color: var(--md-fab-secondary-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-hover-label-text-color: var(--md-fab-secondary-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-hover-state-layer-color: var(--md-fab-secondary-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-icon-color: var(--md-fab-secondary-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-label-text-color: var(--md-fab-secondary-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-pressed-icon-color: var(--md-fab-secondary-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-pressed-label-text-color: var(--md-fab-secondary-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_secondary-pressed-state-layer-color: var(--md-fab-secondary-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_small-container-height: var(--md-fab-small-container-height, 40px);--_small-container-width: var(--md-fab-small-container-width, 40px);--_small-icon-size: var(--md-fab-small-icon-size, 24px);--_tertiary-container-color: var(--md-fab-tertiary-container-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_tertiary-focus-icon-color: var(--md-fab-tertiary-focus-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-focus-label-text-color: var(--md-fab-tertiary-focus-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-hover-icon-color: var(--md-fab-tertiary-hover-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-hover-label-text-color: var(--md-fab-tertiary-hover-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-hover-state-layer-color: var(--md-fab-tertiary-hover-state-layer-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-icon-color: var(--md-fab-tertiary-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-label-text-color: var(--md-fab-tertiary-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-pressed-icon-color: var(--md-fab-tertiary-pressed-icon-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-pressed-label-text-color: var(--md-fab-tertiary-pressed-label-text-color, var(--md-sys-color-on-tertiary-container, #31111d));--_tertiary-pressed-state-layer-color: var(--md-fab-tertiary-pressed-state-layer-color, var(--md-sys-color-on-tertiary-container, #31111d));--_container-shape-start-start: var(--md-fab-container-shape-start-start, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-start-end: var(--md-fab-container-shape-start-end, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-end-end: var(--md-fab-container-shape-end-end, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_container-shape-end-start: var(--md-fab-container-shape-end-start, var(--md-fab-container-shape, var(--md-sys-shape-corner-large, 16px)));--_large-container-shape-start-start: var(--md-fab-large-container-shape-start-start, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-start-end: var(--md-fab-large-container-shape-start-end, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-end-end: var(--md-fab-large-container-shape-end-end, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_large-container-shape-end-start: var(--md-fab-large-container-shape-end-start, var(--md-fab-large-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));--_small-container-shape-start-start: var(--md-fab-small-container-shape-start-start, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));--_small-container-shape-start-end: var(--md-fab-small-container-shape-start-end, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));--_small-container-shape-end-end: var(--md-fab-small-container-shape-end-end, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));--_small-container-shape-end-start: var(--md-fab-small-container-shape-end-start, var(--md-fab-small-container-shape, var(--md-sys-shape-corner-medium, 12px)));cursor:pointer}:host([size=small][touch-target=wrapper]){margin:max(0px,48px - var(--_small-container-height))}.fab .icon ::slotted(*){color:var(--_icon-color)}.fab:focus{color:var(--_focus-icon-color)}.fab:hover{color:var(--_hover-icon-color)}.fab:active{color:var(--_pressed-icon-color)}.fab{cursor:inherit}.fab.primary{background-color:var(--_primary-container-color);--md-ripple-hover-color: var(--_primary-hover-state-layer-color);--md-ripple-pressed-color: var(--_primary-pressed-state-layer-color)}.fab.primary .icon ::slotted(*){color:var(--_primary-icon-color)}.fab.primary:focus{color:var(--_primary-focus-icon-color)}.fab.primary:hover{color:var(--_primary-hover-icon-color)}.fab.primary:active{color:var(--_primary-pressed-icon-color)}.fab.primary .label{color:var(--_primary-label-text-color)}.fab:hover .fab.primary .label{color:var(--_primary-hover-label-text-color)}.fab:focus .fab.primary .label{color:var(--_primary-focus-label-text-color)}.fab:active .fab.primary .label{color:var(--_primary-pressed-label-text-color)}.fab.secondary{background-color:var(--_secondary-container-color);--md-ripple-hover-color: var(--_secondary-hover-state-layer-color);--md-ripple-pressed-color: var(--_secondary-pressed-state-layer-color)}.fab.secondary .icon ::slotted(*){color:var(--_secondary-icon-color)}.fab.secondary:focus{color:var(--_secondary-focus-icon-color)}.fab.secondary:hover{color:var(--_secondary-hover-icon-color)}.fab.secondary:active{color:var(--_secondary-pressed-icon-color)}.fab.secondary .label{color:var(--_secondary-label-text-color)}.fab:hover .fab.secondary .label{color:var(--_secondary-hover-label-text-color)}.fab:focus .fab.secondary .label{color:var(--_secondary-focus-label-text-color)}.fab:active .fab.secondary .label{color:var(--_secondary-pressed-label-text-color)}.fab.tertiary{background-color:var(--_tertiary-container-color);--md-ripple-hover-color: var(--_tertiary-hover-state-layer-color);--md-ripple-pressed-color: var(--_tertiary-pressed-state-layer-color)}.fab.tertiary .icon ::slotted(*){color:var(--_tertiary-icon-color)}.fab.tertiary:focus{color:var(--_tertiary-focus-icon-color)}.fab.tertiary:hover{color:var(--_tertiary-hover-icon-color)}.fab.tertiary:active{color:var(--_tertiary-pressed-icon-color)}.fab.tertiary .label{color:var(--_tertiary-label-text-color)}.fab:hover .fab.tertiary .label{color:var(--_tertiary-hover-label-text-color)}.fab:focus .fab.tertiary .label{color:var(--_tertiary-focus-label-text-color)}.fab:active .fab.tertiary .label{color:var(--_tertiary-pressed-label-text-color)}.fab.extended slot span{padding-inline-start:4px}.fab.small{width:var(--_small-container-width);height:var(--_small-container-height)}.fab.small .icon ::slotted(*){width:var(--_small-icon-size);height:var(--_small-icon-size);font-size:var(--_small-icon-size)}.fab.small,.fab.small .ripple{border-start-start-radius:var(--_small-container-shape-start-start);border-start-end-radius:var(--_small-container-shape-start-end);border-end-start-radius:var(--_small-container-shape-end-start);border-end-end-radius:var(--_small-container-shape-end-end)}.fab.small md-focus-ring{--md-focus-ring-shape-start-start: var(--_small-container-shape-start-start);--md-focus-ring-shape-start-end: var(--_small-container-shape-start-end);--md-focus-ring-shape-end-end: var(--_small-container-shape-end-end);--md-focus-ring-shape-end-start: var(--_small-container-shape-end-start)}
`;Ir.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Tr=g`@media(forced-colors: active){.fab{border:1px solid ButtonText}.fab.extended{padding-inline-start:15px;padding-inline-end:19px}md-focus-ring{--md-focus-ring-outward-offset: 3px}}
`;Tr.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Or=g`:host{--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity);display:inline-flex;-webkit-tap-highlight-color:rgba(0,0,0,0)}:host([size=medium][touch-target=wrapper]){margin:max(0px,48px - var(--_container-height))}:host([size=large][touch-target=wrapper]){margin:max(0px,48px - var(--_large-container-height))}.fab,.icon,.icon ::slotted(*){display:flex}.fab{align-items:center;justify-content:center;vertical-align:middle;padding:0;position:relative;height:var(--_container-height);transition-property:background-color;border-width:0px;outline:none;z-index:0;text-transform:inherit}.fab.extended{width:inherit;box-sizing:border-box;padding-inline-start:16px;padding-inline-end:20px}.fab:not(.extended){width:var(--_container-width)}.fab.large{width:var(--_large-container-width);height:var(--_large-container-height)}.fab.large .icon ::slotted(*){width:var(--_large-icon-size);height:var(--_large-icon-size);font-size:var(--_large-icon-size)}.fab.large,.fab.large .ripple{border-start-start-radius:var(--_large-container-shape-start-start);border-start-end-radius:var(--_large-container-shape-start-end);border-end-start-radius:var(--_large-container-shape-end-start);border-end-end-radius:var(--_large-container-shape-end-end)}.fab.large md-focus-ring{--md-focus-ring-shape-start-start: var(--_large-container-shape-start-start);--md-focus-ring-shape-start-end: var(--_large-container-shape-start-end);--md-focus-ring-shape-end-end: var(--_large-container-shape-end-end);--md-focus-ring-shape-end-start: var(--_large-container-shape-end-start)}.fab{--md-elevation-level: var(--_container-elevation);--md-elevation-shadow-color: var(--_container-shadow-color)}.fab:focus{--md-elevation-level: var(--_focus-container-elevation)}.fab:hover{--md-elevation-level: var(--_hover-container-elevation)}.fab:active{--md-elevation-level: var(--_pressed-container-elevation)}.fab.lowered{background-color:var(--_lowered-container-color);--md-elevation-level: var(--_lowered-container-elevation)}.fab.lowered:focus{--md-elevation-level: var(--_lowered-focus-container-elevation)}.fab.lowered:hover{--md-elevation-level: var(--_lowered-hover-container-elevation)}.fab.lowered:active{--md-elevation-level: var(--_lowered-pressed-container-elevation)}.fab{background-color:var(--_container-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color)}.fab .label{color:var(--_label-text-color)}.fab:hover .fab .label{color:var(--_hover-label-text-color)}.fab:focus .fab .label{color:var(--_focus-label-text-color)}.fab:active .fab .label{color:var(--_pressed-label-text-color)}.label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight)}.fab.extended .icon ::slotted(*){margin-inline-end:12px}.ripple{overflow:hidden}.ripple,md-elevation{z-index:-1}.touch-target{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}:host([touch-target=none]) .touch-target{display:none}md-elevation,.fab{transition-duration:280ms;transition-timing-function:cubic-bezier(0.2, 0, 0, 1)}.fab,.ripple{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}.icon ::slotted(*){width:var(--_icon-size);height:var(--_icon-size);font-size:var(--_icon-size)}
`;Or.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Wt=class extends Sr{};Wt.styles=[Or,Ir,Tr];Wt=n([x("md-fab")],Wt);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class ns extends K{renderElevationOrOutline(){return l`<div class="outline"></div>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const jr=g`:host{--_container-height: var(--md-outlined-button-container-height, 40px);--_disabled-label-text-color: var(--md-outlined-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-button-disabled-label-text-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-button-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-button-disabled-outline-opacity, 0.12);--_focus-label-text-color: var(--md-outlined-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-outlined-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-outlined-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-outlined-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-outlined-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-outlined-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-outlined-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-outlined-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_outline-color: var(--md-outlined-button-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-button-outline-width, 1px);--_pressed-label-text-color: var(--md-outlined-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-outline-color: var(--md-outlined-button-pressed-outline-color, var(--md-sys-color-outline, #79747e));--_pressed-state-layer-color: var(--md-outlined-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-outlined-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-outlined-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-outlined-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-outlined-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-outlined-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-outlined-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-outlined-button-icon-size, 18px);--_pressed-icon-color: var(--md-outlined-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-outlined-button-container-shape-start-start, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-outlined-button-container-shape-start-end, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-outlined-button-container-shape-end-end, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-outlined-button-container-shape-end-start, var(--md-outlined-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-outlined-button-leading-space, 24px);--_trailing-space: var(--md-outlined-button-trailing-space, 24px);--_with-leading-icon-leading-space: var(--md-outlined-button-with-leading-icon-leading-space, 16px);--_with-leading-icon-trailing-space: var(--md-outlined-button-with-leading-icon-trailing-space, 24px);--_with-trailing-icon-leading-space: var(--md-outlined-button-with-trailing-icon-leading-space, 24px);--_with-trailing-icon-trailing-space: var(--md-outlined-button-with-trailing-icon-trailing-space, 16px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}.outline{inset:0;border-style:solid;position:absolute;box-sizing:border-box;border-color:var(--_outline-color);border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}:host(:active) .outline{border-color:var(--_pressed-outline-color)}:host(:is([disabled],[soft-disabled])) .outline{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])) .background{border-color:GrayText}:host(:is([disabled],[soft-disabled])) .outline{opacity:1}}.outline,md-ripple{border-width:var(--_outline-width)}md-ripple{inline-size:calc(100% - 2*var(--_outline-width));block-size:calc(100% - 2*var(--_outline-width));border-style:solid;border-color:rgba(0,0,0,0)}
`;jr.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Gt=class extends ns{};Gt.styles=[$t,jr];Gt=n([x("md-outlined-button")],Gt);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zr="important",ls=" !"+zr,Oe=yo(class extends xo{constructor(r){if(super(r),r.type!==he.ATTRIBUTE||r.name!=="style"||r.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(r){return Object.keys(r).reduce((e,t)=>{const o=r[t];return o==null?e:e+`${t=t.includes("-")?t:t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(r,[e]){const{style:t}=r.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(const o of this.ft)e[o]==null&&(this.ft.delete(o),o.includes("-")?t.removeProperty(o):t[o]=null);for(const o in e){const i=e[o];if(i!=null){this.ft.add(o);const s=typeof i=="string"&&i.endsWith(ls);o.includes("-")||s?t.setProperty(o,s?i.slice(0,-11):i,s?zr:""):t[o]=i}}return V}});/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function Rr(r,e=le){const t=Eo(r,e);return t&&(t.tabIndex=0,t.focus()),t}function Dr(r,e=le){const t=Mr(r,e);return t&&(t.tabIndex=0,t.focus()),t}function Fe(r,e=le){for(let t=0;t<r.length;t++){const o=r[t];if(o.tabIndex===0&&e(o))return{item:o,index:t}}return null}function Eo(r,e=le){for(const t of r)if(e(t))return t;return null}function Mr(r,e=le){for(let t=r.length-1;t>=0;t--){const o=r[t];if(e(o))return o}return null}function ds(r,e,t=le,o=!0){for(let i=1;i<r.length;i++){const s=(i+e)%r.length;if(s<e&&!o)return null;const a=r[s];if(t(a))return a}return r[e]?r[e]:null}function cs(r,e,t=le,o=!0){for(let i=1;i<r.length;i++){const s=(e-i+r.length)%r.length;if(s>e&&!o)return null;const a=r[s];if(t(a))return a}return r[e]?r[e]:null}function Qo(r,e,t=le,o=!0){if(e){const i=ds(r,e.index,t,o);return i&&(i.tabIndex=0,i.focus()),i}else return Rr(r,t)}function er(r,e,t=le,o=!0){if(e){const i=cs(r,e.index,t,o);return i&&(i.tabIndex=0,i.focus()),i}else return Dr(r,t)}function le(r){return!r.disabled}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const B={ArrowDown:"ArrowDown",ArrowLeft:"ArrowLeft",ArrowUp:"ArrowUp",ArrowRight:"ArrowRight",Home:"Home",End:"End"};class hs{constructor(e){this.handleKeydown=m=>{const v=m.key;if(m.defaultPrevented||!this.isNavigableKey(v))return;const $=this.items;if(!$.length)return;const _=Fe($,this.isActivatable);m.preventDefault();const A=this.isRtl(),C=A?B.ArrowRight:B.ArrowLeft,P=A?B.ArrowLeft:B.ArrowRight;let z=null;switch(v){case B.ArrowDown:case P:z=Qo($,_,this.isActivatable,this.wrapNavigation());break;case B.ArrowUp:case C:z=er($,_,this.isActivatable,this.wrapNavigation());break;case B.Home:z=Rr($,this.isActivatable);break;case B.End:z=Dr($,this.isActivatable);break}z&&_&&_.item!==z&&(_.item.tabIndex=-1)},this.onDeactivateItems=()=>{const m=this.items;for(const v of m)this.deactivateItem(v)},this.onRequestActivation=m=>{this.onDeactivateItems();const v=m.target;this.activateItem(v),v.focus()},this.onSlotchange=()=>{const m=this.items;let v=!1;for(const _ of m){if(!_.disabled&&_.tabIndex>-1&&!v){v=!0,_.tabIndex=0;continue}_.tabIndex=-1}if(v)return;const $=Eo(m,this.isActivatable);$&&($.tabIndex=0)};const{isItem:t,getPossibleItems:o,isRtl:i,deactivateItem:s,activateItem:a,isNavigableKey:h,isActivatable:c,wrapNavigation:u}=e;this.isItem=t,this.getPossibleItems=o,this.isRtl=i,this.deactivateItem=s,this.activateItem=a,this.isNavigableKey=h,this.isActivatable=c,this.wrapNavigation=u??(()=>!0)}get items(){const e=this.getPossibleItems(),t=[];for(const o of e){if(this.isItem(o)){t.push(o);continue}const s=o.item;s&&this.isItem(s)&&t.push(s)}return t}activateNextItem(){const e=this.items,t=Fe(e,this.isActivatable);return t&&(t.item.tabIndex=-1),Qo(e,t,this.isActivatable,this.wrapNavigation())}activatePreviousItem(){const e=this.items,t=Fe(e,this.isActivatable);return t&&(t.item.tabIndex=-1),er(e,t,this.isActivatable,this.wrapNavigation())}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function ps(r,e){return new CustomEvent("close-menu",{bubbles:!0,composed:!0,detail:{initiator:r,reason:e,itemPath:[r]}})}const tr=ps,Kt={SPACE:"Space",ENTER:"Enter"},or={CLICK_SELECTION:"click-selection",KEYDOWN:"keydown"},us={ESCAPE:"Escape",SPACE:Kt.SPACE,ENTER:Kt.ENTER};function Lr(r){return Object.values(us).some(e=>e===r)}function ms(r){return Object.values(Kt).some(e=>e===r)}function Yt(r,e){const t=new Event("md-contains",{bubbles:!0,composed:!0});let o=[];const i=a=>{o=a.composedPath()};return e.addEventListener("md-contains",i),r.dispatchEvent(t),e.removeEventListener("md-contains",i),o.length>0}const Z={NONE:"none",LIST_ROOT:"list-root",FIRST_ITEM:"first-item",LAST_ITEM:"last-item"};/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const rr={END_START:"end-start",START_START:"start-start"};class fs{constructor(e,t){this.host=e,this.getProperties=t,this.surfaceStylesInternal={display:"none"},this.lastValues={isOpen:!1},this.host.addController(this)}get surfaceStyles(){return this.surfaceStylesInternal}async position(){const{surfaceEl:e,anchorEl:t,anchorCorner:o,surfaceCorner:i,positioning:s,xOffset:a,yOffset:h,disableBlockFlip:c,disableInlineFlip:u,repositionStrategy:m}=this.getProperties(),v=o.toLowerCase().trim(),$=i.toLowerCase().trim();if(!e||!t)return;const _=window.innerWidth,A=window.innerHeight,C=document.createElement("div");C.style.opacity="0",C.style.position="fixed",C.style.display="block",C.style.inset="0",document.body.appendChild(C);const P=C.getBoundingClientRect();C.remove();const z=window.innerHeight-P.bottom,E=window.innerWidth-P.right;this.surfaceStylesInternal={display:"block",opacity:"0"},this.host.requestUpdate(),await this.host.updateComplete,e.popover&&e.isConnected&&e.showPopover();const M=e.getSurfacePositionClientRect?e.getSurfacePositionClientRect():e.getBoundingClientRect(),L=t.getSurfacePositionClientRect?t.getSurfacePositionClientRect():t.getBoundingClientRect(),[R,de]=$.split("-"),[ce,ye]=v.split("-"),at=getComputedStyle(e).direction==="ltr";let{blockInset:Ae,blockOutOfBoundsCorrection:Q,surfaceBlockProperty:Ro}=this.calculateBlock({surfaceRect:M,anchorRect:L,anchorBlock:ce,surfaceBlock:R,yOffset:h,positioning:s,windowInnerHeight:A,blockScrollbarHeight:z});if(Q&&!c){const Pt=R==="start"?"end":"start",St=ce==="start"?"end":"start",ie=this.calculateBlock({surfaceRect:M,anchorRect:L,anchorBlock:St,surfaceBlock:Pt,yOffset:h,positioning:s,windowInnerHeight:A,blockScrollbarHeight:z});Q>ie.blockOutOfBoundsCorrection&&(Ae=ie.blockInset,Q=ie.blockOutOfBoundsCorrection,Ro=ie.surfaceBlockProperty)}let{inlineInset:nt,inlineOutOfBoundsCorrection:Pe,surfaceInlineProperty:Do}=this.calculateInline({surfaceRect:M,anchorRect:L,anchorInline:ye,surfaceInline:de,xOffset:a,positioning:s,isLTR:at,windowInnerWidth:_,inlineScrollbarWidth:E});if(Pe&&!u){const Pt=de==="start"?"end":"start",St=ye==="start"?"end":"start",ie=this.calculateInline({surfaceRect:M,anchorRect:L,anchorInline:St,surfaceInline:Pt,xOffset:a,positioning:s,isLTR:at,windowInnerWidth:_,inlineScrollbarWidth:E});Math.abs(Pe)>Math.abs(ie.inlineOutOfBoundsCorrection)&&(nt=ie.inlineInset,Pe=ie.inlineOutOfBoundsCorrection,Do=ie.surfaceInlineProperty)}m==="move"&&(Ae=Ae-Q,nt=nt-Pe),this.surfaceStylesInternal={display:"block",opacity:"1",[Ro]:`${Ae}px`,[Do]:`${nt}px`},m==="resize"&&(Q&&(this.surfaceStylesInternal.height=`${M.height-Q}px`),Pe&&(this.surfaceStylesInternal.width=`${M.width-Pe}px`)),this.host.requestUpdate()}calculateBlock(e){const{surfaceRect:t,anchorRect:o,anchorBlock:i,surfaceBlock:s,yOffset:a,positioning:h,windowInnerHeight:c,blockScrollbarHeight:u}=e,m=h==="fixed"||h==="document"?1:0,v=h==="document"?1:0,$=s==="start"?1:0,_=s==="end"?1:0,C=(i!==s?1:0)*o.height+a,P=$*o.top+_*(c-o.bottom-u),z=$*window.scrollY-_*window.scrollY,E=Math.abs(Math.min(0,c-P-C-t.height));return{blockInset:m*P+v*z+C,blockOutOfBoundsCorrection:E,surfaceBlockProperty:s==="start"?"inset-block-start":"inset-block-end"}}calculateInline(e){const{isLTR:t,surfaceInline:o,anchorInline:i,anchorRect:s,surfaceRect:a,xOffset:h,positioning:c,windowInnerWidth:u,inlineScrollbarWidth:m}=e,v=c==="fixed"||c==="document"?1:0,$=c==="document"?1:0,_=t?1:0,A=t?0:1,C=o==="start"?1:0,P=o==="end"?1:0,E=(i!==o?1:0)*s.width+h,M=C*s.left+P*(u-s.right-m),L=C*(u-s.right-m)+P*s.left,R=_*M+A*L,de=C*window.scrollX-P*window.scrollX,ce=P*window.scrollX-C*window.scrollX,ye=_*de+A*ce,at=Math.abs(Math.min(0,u-R-E-a.width)),Ae=v*R+E+$*ye;let Q=o==="start"?"inset-inline-start":"inset-inline-end";return(c==="document"||c==="fixed")&&(o==="start"&&t||o==="end"&&!t?Q="left":Q="right"),{inlineInset:Ae,inlineOutOfBoundsCorrection:at,surfaceInlineProperty:Q}}hostUpdate(){this.onUpdate()}hostUpdated(){this.onUpdate()}async onUpdate(){const e=this.getProperties();let t=!1;for(const[a,h]of Object.entries(e))if(t=t||h!==this.lastValues[a],t)break;const o=this.lastValues.isOpen!==e.isOpen,i=!!e.anchorEl,s=!!e.surfaceEl;t&&i&&s&&(this.lastValues.isOpen=e.isOpen,e.isOpen?(this.lastValues=e,await this.position(),e.onOpen()):o&&(await e.beforeClose(),this.close(),e.onClose()))}close(){this.surfaceStylesInternal={display:"none"},this.host.requestUpdate();const e=this.getProperties().surfaceEl;e?.popover&&e?.isConnected&&e.hidePopover()}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const q={INDEX:0,ITEM:1,TEXT:2};class vs{constructor(e){this.getProperties=e,this.typeaheadRecords=[],this.typaheadBuffer="",this.cancelTypeaheadTimeout=0,this.isTypingAhead=!1,this.lastActiveRecord=null,this.onKeydown=t=>{this.isTypingAhead?this.typeahead(t):this.beginTypeahead(t)},this.endTypeahead=()=>{this.isTypingAhead=!1,this.typaheadBuffer="",this.typeaheadRecords=[]}}get items(){return this.getProperties().getItems()}get active(){return this.getProperties().active}beginTypeahead(e){this.active&&(e.code==="Space"||e.code==="Enter"||e.code.startsWith("Arrow")||e.code==="Escape"||(this.isTypingAhead=!0,this.typeaheadRecords=this.items.map((t,o)=>[o,t,t.typeaheadText.trim().toLowerCase()]),this.lastActiveRecord=this.typeaheadRecords.find(t=>t[q.ITEM].tabIndex===0)??null,this.lastActiveRecord&&(this.lastActiveRecord[q.ITEM].tabIndex=-1),this.typeahead(e)))}typeahead(e){if(e.defaultPrevented)return;if(clearTimeout(this.cancelTypeaheadTimeout),e.code==="Enter"||e.code.startsWith("Arrow")||e.code==="Escape"){this.endTypeahead(),this.lastActiveRecord&&(this.lastActiveRecord[q.ITEM].tabIndex=-1);return}e.code==="Space"&&e.preventDefault(),this.cancelTypeaheadTimeout=setTimeout(this.endTypeahead,this.getProperties().typeaheadBufferTime),this.typaheadBuffer+=e.key.toLowerCase();const t=this.lastActiveRecord?this.lastActiveRecord[q.INDEX]:-1,o=this.typeaheadRecords.length,i=c=>(c[q.INDEX]+o-t)%o,s=this.typeaheadRecords.filter(c=>!c[q.ITEM].disabled&&c[q.TEXT].startsWith(this.typaheadBuffer)).sort((c,u)=>i(c)-i(u));if(s.length===0){clearTimeout(this.cancelTypeaheadTimeout),this.lastActiveRecord&&(this.lastActiveRecord[q.ITEM].tabIndex=-1),this.endTypeahead();return}const a=this.typaheadBuffer.length===1;let h;this.lastActiveRecord===s[0]&&a?h=s[1]??s[0]:h=s[0],this.lastActiveRecord&&(this.lastActiveRecord[q.ITEM].tabIndex=-1),this.lastActiveRecord=h,h[q.ITEM].tabIndex=0,h[q.ITEM].focus()}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Br=200,Nr=new Set([B.ArrowDown,B.ArrowUp,B.Home,B.End]),gs=new Set([B.ArrowLeft,B.ArrowRight,...Nr]);function bs(r=document){let e=r.activeElement;for(;e&&e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}class T extends b{get openDirection(){return this.menuCorner.split("-")[0]==="start"?"DOWN":"UP"}get anchorElement(){return this.anchor?this.getRootNode().querySelector(`#${this.anchor}`):this.currentAnchorElement}set anchorElement(e){this.currentAnchorElement=e,this.requestUpdate("anchorElement")}constructor(){super(),this.anchor="",this.positioning="absolute",this.quick=!1,this.hasOverflow=!1,this.open=!1,this.xOffset=0,this.yOffset=0,this.noHorizontalFlip=!1,this.noVerticalFlip=!1,this.typeaheadDelay=Br,this.anchorCorner=rr.END_START,this.menuCorner=rr.START_START,this.stayOpenOnOutsideClick=!1,this.stayOpenOnFocusout=!1,this.skipRestoreFocus=!1,this.defaultFocus=Z.FIRST_ITEM,this.noNavigationWrap=!1,this.typeaheadActive=!0,this.isSubmenu=!1,this.pointerPath=[],this.isRepositioning=!1,this.openCloseAnimationSignal=Mi(),this.listController=new hs({isItem:e=>e.hasAttribute("md-menu-item"),getPossibleItems:()=>this.slotItems,isRtl:()=>getComputedStyle(this).direction==="rtl",deactivateItem:e=>{e.selected=!1,e.tabIndex=-1},activateItem:e=>{e.selected=!0,e.tabIndex=0},isNavigableKey:e=>{if(!this.isSubmenu)return gs.has(e);const o=getComputedStyle(this).direction==="rtl"?B.ArrowLeft:B.ArrowRight;return e===o?!0:Nr.has(e)},wrapNavigation:()=>!this.noNavigationWrap}),this.lastFocusedElement=null,this.typeaheadController=new vs(()=>({getItems:()=>this.items,typeaheadBufferTime:this.typeaheadDelay,active:this.typeaheadActive})),this.currentAnchorElement=null,this.internals=this.attachInternals(),this.menuPositionController=new fs(this,()=>({anchorCorner:this.anchorCorner,surfaceCorner:this.menuCorner,surfaceEl:this.surfaceEl,anchorEl:this.anchorElement,positioning:this.positioning==="popover"?"document":this.positioning,isOpen:this.open,xOffset:this.xOffset,yOffset:this.yOffset,disableBlockFlip:this.noVerticalFlip,disableInlineFlip:this.noHorizontalFlip,onOpen:this.onOpened,beforeClose:this.beforeClose,onClose:this.onClosed,repositionStrategy:this.hasOverflow&&this.positioning!=="popover"?"move":"resize"})),this.onWindowResize=()=>{this.isRepositioning||this.positioning!=="document"&&this.positioning!=="fixed"&&this.positioning!=="popover"||(this.isRepositioning=!0,this.reposition(),this.isRepositioning=!1)},this.handleFocusout=async e=>{const t=this.anchorElement;if(this.stayOpenOnFocusout||!this.open||this.pointerPath.includes(t))return;if(e.relatedTarget){if(Yt(e.relatedTarget,this)||this.pointerPath.length!==0&&Yt(e.relatedTarget,t))return}else if(this.pointerPath.includes(this))return;const o=this.skipRestoreFocus;this.skipRestoreFocus=!0,this.close(),await this.updateComplete,this.skipRestoreFocus=o},this.onOpened=async()=>{this.lastFocusedElement=bs();const e=this.items,t=Fe(e);t&&this.defaultFocus!==Z.NONE&&(t.item.tabIndex=-1);let o=!this.quick;switch(this.quick?this.dispatchEvent(new Event("opening")):o=!!await this.animateOpen(),this.defaultFocus){case Z.FIRST_ITEM:const i=Eo(e);i&&(i.tabIndex=0,i.focus(),await i.updateComplete);break;case Z.LAST_ITEM:const s=Mr(e);s&&(s.tabIndex=0,s.focus(),await s.updateComplete);break;case Z.LIST_ROOT:this.focus();break;default:case Z.NONE:break}o||this.dispatchEvent(new Event("opened"))},this.beforeClose=async()=>{this.open=!1,this.skipRestoreFocus||this.lastFocusedElement?.focus?.(),this.quick||await this.animateClose()},this.onClosed=()=>{this.quick&&(this.dispatchEvent(new Event("closing")),this.dispatchEvent(new Event("closed")))},this.onWindowPointerdown=e=>{this.pointerPath=e.composedPath()},this.onDocumentClick=e=>{if(!this.open)return;const t=e.composedPath();!this.stayOpenOnOutsideClick&&!t.includes(this)&&!t.includes(this.anchorElement)&&(this.open=!1)},this.internals.role="menu",this.addEventListener("keydown",this.handleKeydown),this.addEventListener("keydown",this.captureKeydown,{capture:!0}),this.addEventListener("focusout",this.handleFocusout)}get items(){return this.listController.items}willUpdate(e){if(e.has("open")){if(this.open){this.removeAttribute("aria-hidden");return}this.setAttribute("aria-hidden","true")}}update(e){e.has("open")&&(this.open?this.setUpGlobalEventListeners():this.cleanUpGlobalEventListeners()),e.has("positioning")&&this.positioning==="popover"&&!this.showPopover&&(this.positioning="fixed"),super.update(e)}connectedCallback(){super.connectedCallback(),this.open&&this.setUpGlobalEventListeners()}disconnectedCallback(){super.disconnectedCallback(),this.cleanUpGlobalEventListeners()}getBoundingClientRect(){return this.surfaceEl?this.surfaceEl.getBoundingClientRect():super.getBoundingClientRect()}getClientRects(){return this.surfaceEl?this.surfaceEl.getClientRects():super.getClientRects()}render(){return this.renderSurface()}renderSurface(){return l`
      <div
        class="menu ${F(this.getSurfaceClasses())}"
        style=${Oe(this.menuPositionController.surfaceStyles)}
        popover=${this.positioning==="popover"?"manual":p}>
        ${this.renderElevation()}
        <div class="items">
          <div class="item-padding"> ${this.renderMenuItems()} </div>
        </div>
      </div>
    `}renderMenuItems(){return l`<slot
      @close-menu=${this.onCloseMenu}
      @deactivate-items=${this.onDeactivateItems}
      @request-activation=${this.onRequestActivation}
      @deactivate-typeahead=${this.handleDeactivateTypeahead}
      @activate-typeahead=${this.handleActivateTypeahead}
      @stay-open-on-focusout=${this.handleStayOpenOnFocusout}
      @close-on-focusout=${this.handleCloseOnFocusout}
      @slotchange=${this.listController.onSlotchange}></slot>`}renderElevation(){return l`<md-elevation part="elevation"></md-elevation>`}getSurfaceClasses(){return{open:this.open,fixed:this.positioning==="fixed","has-overflow":this.hasOverflow}}captureKeydown(e){e.target===this&&!e.defaultPrevented&&Lr(e.code)&&(e.preventDefault(),this.close()),this.typeaheadController.onKeydown(e)}async animateOpen(){const e=this.surfaceEl,t=this.slotEl;if(!e||!t)return!0;const o=this.openDirection;this.dispatchEvent(new Event("opening")),e.classList.toggle("animating",!0);const i=this.openCloseAnimationSignal.start(),s=e.offsetHeight,a=o==="UP",h=this.items,c=500,u=50,m=250,v=(c-m)/h.length,$=e.animate([{height:"0px"},{height:`${s}px`}],{duration:c,easing:ee.EMPHASIZED}),_=t.animate([{transform:a?`translateY(-${s}px)`:""},{transform:""}],{duration:c,easing:ee.EMPHASIZED}),A=e.animate([{opacity:0},{opacity:1}],u),C=[];for(let E=0;E<h.length;E++){const M=a?h.length-1-E:E,L=h[M],R=L.animate([{opacity:0},{opacity:1}],{duration:m,delay:v*E});L.classList.toggle("md-menu-hidden",!0),R.addEventListener("finish",()=>{L.classList.toggle("md-menu-hidden",!1)}),C.push([L,R])}let P=E=>{};const z=new Promise(E=>{P=E});return i.addEventListener("abort",()=>{$.cancel(),_.cancel(),A.cancel(),C.forEach(([E,M])=>{E.classList.toggle("md-menu-hidden",!1),M.cancel()}),P(!0)}),$.addEventListener("finish",()=>{e.classList.toggle("animating",!1),this.openCloseAnimationSignal.finish(),P(!1)}),await z}animateClose(){let e;const t=new Promise(R=>{e=R}),o=this.surfaceEl,i=this.slotEl;if(!o||!i)return e(!1),t;const a=this.openDirection==="UP";this.dispatchEvent(new Event("closing")),o.classList.toggle("animating",!0);const h=this.openCloseAnimationSignal.start(),c=o.offsetHeight,u=this.items,m=150,v=50,$=m-v,_=50,A=50,C=.35,P=(m-A-_)/u.length,z=o.animate([{height:`${c}px`},{height:`${c*C}px`}],{duration:m,easing:ee.EMPHASIZED_ACCELERATE}),E=i.animate([{transform:""},{transform:a?`translateY(-${c*(1-C)}px)`:""}],{duration:m,easing:ee.EMPHASIZED_ACCELERATE}),M=o.animate([{opacity:1},{opacity:0}],{duration:v,delay:$}),L=[];for(let R=0;R<u.length;R++){const de=a?R:u.length-1-R,ce=u[de],ye=ce.animate([{opacity:1},{opacity:0}],{duration:_,delay:A+P*R});ye.addEventListener("finish",()=>{ce.classList.toggle("md-menu-hidden",!0)}),L.push([ce,ye])}return h.addEventListener("abort",()=>{z.cancel(),E.cancel(),M.cancel(),L.forEach(([R,de])=>{de.cancel(),R.classList.toggle("md-menu-hidden",!1)}),e(!1)}),z.addEventListener("finish",()=>{o.classList.toggle("animating",!1),L.forEach(([R])=>{R.classList.toggle("md-menu-hidden",!1)}),this.openCloseAnimationSignal.finish(),this.dispatchEvent(new Event("closed")),e(!0)}),t}handleKeydown(e){this.pointerPath=[],this.listController.handleKeydown(e)}setUpGlobalEventListeners(){document.addEventListener("click",this.onDocumentClick,{capture:!0}),window.addEventListener("pointerdown",this.onWindowPointerdown),document.addEventListener("resize",this.onWindowResize,{passive:!0}),window.addEventListener("resize",this.onWindowResize,{passive:!0})}cleanUpGlobalEventListeners(){document.removeEventListener("click",this.onDocumentClick,{capture:!0}),window.removeEventListener("pointerdown",this.onWindowPointerdown),document.removeEventListener("resize",this.onWindowResize),window.removeEventListener("resize",this.onWindowResize)}onCloseMenu(){this.close()}onDeactivateItems(e){e.stopPropagation(),this.listController.onDeactivateItems()}onRequestActivation(e){e.stopPropagation(),this.listController.onRequestActivation(e)}handleDeactivateTypeahead(e){e.stopPropagation(),this.typeaheadActive=!1}handleActivateTypeahead(e){e.stopPropagation(),this.typeaheadActive=!0}handleStayOpenOnFocusout(e){e.stopPropagation(),this.stayOpenOnFocusout=!0}handleCloseOnFocusout(e){e.stopPropagation(),this.stayOpenOnFocusout=!1}close(){this.open=!1,this.slotItems.forEach(t=>{t.close?.()})}show(){this.open=!0}activateNextItem(){return this.listController.activateNextItem()??null}activatePreviousItem(){return this.listController.activatePreviousItem()??null}reposition(){this.open&&this.menuPositionController.position()}}n([S(".menu")],T.prototype,"surfaceEl",void 0);n([S("slot")],T.prototype,"slotEl",void 0);n([d()],T.prototype,"anchor",void 0);n([d()],T.prototype,"positioning",void 0);n([d({type:Boolean})],T.prototype,"quick",void 0);n([d({type:Boolean,attribute:"has-overflow"})],T.prototype,"hasOverflow",void 0);n([d({type:Boolean,reflect:!0})],T.prototype,"open",void 0);n([d({type:Number,attribute:"x-offset"})],T.prototype,"xOffset",void 0);n([d({type:Number,attribute:"y-offset"})],T.prototype,"yOffset",void 0);n([d({type:Boolean,attribute:"no-horizontal-flip"})],T.prototype,"noHorizontalFlip",void 0);n([d({type:Boolean,attribute:"no-vertical-flip"})],T.prototype,"noVerticalFlip",void 0);n([d({type:Number,attribute:"typeahead-delay"})],T.prototype,"typeaheadDelay",void 0);n([d({attribute:"anchor-corner"})],T.prototype,"anchorCorner",void 0);n([d({attribute:"menu-corner"})],T.prototype,"menuCorner",void 0);n([d({type:Boolean,attribute:"stay-open-on-outside-click"})],T.prototype,"stayOpenOnOutsideClick",void 0);n([d({type:Boolean,attribute:"stay-open-on-focusout"})],T.prototype,"stayOpenOnFocusout",void 0);n([d({type:Boolean,attribute:"skip-restore-focus"})],T.prototype,"skipRestoreFocus",void 0);n([d({attribute:"default-focus"})],T.prototype,"defaultFocus",void 0);n([d({type:Boolean,attribute:"no-navigation-wrap"})],T.prototype,"noNavigationWrap",void 0);n([te({flatten:!0})],T.prototype,"slotItems",void 0);n([f()],T.prototype,"typeaheadActive",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Fr=g`:host{--md-elevation-level: var(--md-menu-container-elevation, 2);--md-elevation-shadow-color: var(--md-menu-container-shadow-color, var(--md-sys-color-shadow, #000));min-width:112px;color:unset;display:contents}md-focus-ring{--md-focus-ring-shape: var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px))}.menu{border-radius:var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px));display:none;inset:auto;border:none;padding:0px;overflow:visible;background-color:rgba(0,0,0,0);color:inherit;opacity:0;z-index:20;position:absolute;user-select:none;max-height:inherit;height:inherit;min-width:inherit;max-width:inherit;scrollbar-width:inherit}.menu::backdrop{display:none}.fixed{position:fixed}.items{display:block;list-style-type:none;margin:0;outline:none;box-sizing:border-box;background-color:var(--md-menu-container-color, var(--md-sys-color-surface-container, #f3edf7));height:inherit;max-height:inherit;overflow:auto;min-width:inherit;max-width:inherit;border-radius:inherit;scrollbar-width:inherit}.item-padding{padding-block:var(--md-menu-top-space, 8px) var(--md-menu-bottom-space, 8px)}.has-overflow:not([popover]) .items{overflow:visible}.has-overflow.animating .items,.animating .items{overflow:hidden}.has-overflow.animating .items{pointer-events:none}.animating ::slotted(.md-menu-hidden){opacity:0}slot{display:block;height:inherit;max-height:inherit}::slotted(:is(md-divider,[role=separator])){margin:8px 0}@media(forced-colors: active){.menu{border-style:solid;border-color:CanvasText;border-width:1px}}
`;Fr.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Xt=class extends T{};Xt.styles=[Fr];Xt=n([x("md-menu")],Xt);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class ko extends b{constructor(){super(...arguments),this.multiline=!1}render(){return l`
      <slot name="container"></slot>
      <slot class="non-text" name="start"></slot>
      <div class="text">
        <slot name="overline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          class="default-slot"
          @slotchange=${this.handleTextSlotChange}></slot>
        <slot name="headline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          name="supporting-text"
          @slotchange=${this.handleTextSlotChange}></slot>
      </div>
      <slot class="non-text" name="trailing-supporting-text"></slot>
      <slot class="non-text" name="end"></slot>
    `}handleTextSlotChange(){let e=!1,t=0;for(const o of this.textSlots)if(ys(o)&&(t+=1),t>1){e=!0;break}this.multiline=e}}n([d({type:Boolean,reflect:!0})],ko.prototype,"multiline",void 0);n([Ii(".text slot")],ko.prototype,"textSlots",void 0);function ys(r){for(const e of r.assignedNodes({flatten:!0})){const t=e.nodeType===Node.ELEMENT_NODE,o=e.nodeType===Node.TEXT_NODE&&e.textContent?.match(/\S/);if(t||o)return!0}return!1}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ur=g`:host{color:var(--md-sys-color-on-surface, #1d1b20);font-family:var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-large-size, 1rem);font-weight:var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-large-line-height, 1.5rem);align-items:center;box-sizing:border-box;display:flex;gap:16px;min-height:56px;overflow:hidden;padding:12px 16px;position:relative;text-overflow:ellipsis}:host([multiline]){min-height:72px}[name=overline]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-medium-size, 0.875rem);font-weight:var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-medium-line-height, 1.25rem)}[name=trailing-supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=container]::slotted(*){inset:0;position:absolute}.default-slot{display:inline}.default-slot,.text ::slotted(*){overflow:hidden;text-overflow:ellipsis}.text{display:flex;flex:1;flex-direction:column;overflow:hidden}
`;Ur.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Zt=class extends ko{};Zt.styles=[Ur];Zt=n([x("md-item")],Zt);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class qr{constructor(e,t){this.host=e,this.internalTypeaheadText=null,this.onClick=()=>{this.host.keepOpen||this.host.dispatchEvent(tr(this.host,{kind:or.CLICK_SELECTION}))},this.onKeydown=o=>{if(this.host.href&&o.code==="Enter"){const s=this.getInteractiveElement();s instanceof HTMLAnchorElement&&s.click()}if(o.defaultPrevented)return;const i=o.code;this.host.keepOpen&&i!=="Escape"||Lr(i)&&(o.preventDefault(),this.host.dispatchEvent(tr(this.host,{kind:or.KEYDOWN,key:i})))},this.getHeadlineElements=t.getHeadlineElements,this.getSupportingTextElements=t.getSupportingTextElements,this.getDefaultElements=t.getDefaultElements,this.getInteractiveElement=t.getInteractiveElement,this.host.addController(this)}get typeaheadText(){if(this.internalTypeaheadText!==null)return this.internalTypeaheadText;const e=this.getHeadlineElements(),t=[];return e.forEach(o=>{o.textContent&&o.textContent.trim()&&t.push(o.textContent.trim())}),t.length===0&&this.getDefaultElements().forEach(o=>{o.textContent&&o.textContent.trim()&&t.push(o.textContent.trim())}),t.length===0&&this.getSupportingTextElements().forEach(o=>{o.textContent&&o.textContent.trim()&&t.push(o.textContent.trim())}),t.join(" ")}get tagName(){switch(this.host.type){case"link":return"a";case"button":return"button";default:case"menuitem":case"option":return"li"}}get role(){return this.host.type==="option"?"option":"menuitem"}hostConnected(){this.host.toggleAttribute("md-menu-item",!0)}hostUpdate(){this.host.href&&(this.host.type="link")}setTypeaheadText(e){this.internalTypeaheadText=e}}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const xs=oe(b);class U extends xs{constructor(){super(...arguments),this.disabled=!1,this.type="menuitem",this.href="",this.target="",this.keepOpen=!1,this.selected=!1,this.menuItemController=new qr(this,{getHeadlineElements:()=>this.headlineElements,getSupportingTextElements:()=>this.supportingTextElements,getDefaultElements:()=>this.defaultElements,getInteractiveElement:()=>this.listItemRoot})}get typeaheadText(){return this.menuItemController.typeaheadText}set typeaheadText(e){this.menuItemController.setTypeaheadText(e)}render(){return this.renderListItem(l`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `)}renderListItem(e){const t=this.type==="link";let o;switch(this.menuItemController.tagName){case"a":o=ue`a`;break;case"button":o=ue`button`;break;default:case"li":o=ue`li`;break}const i=t&&this.target?this.target:p;return Ct`
      <${o}
        id="item"
        tabindex=${this.disabled&&!t?-1:0}
        role=${this.menuItemController.role}
        aria-label=${this.ariaLabel||p}
        aria-selected=${this.ariaSelected||p}
        aria-checked=${this.ariaChecked||p}
        aria-expanded=${this.ariaExpanded||p}
        aria-haspopup=${this.ariaHasPopup||p}
        class="list-item ${F(this.getRenderClasses())}"
        href=${this.href||p}
        target=${i}
        @click=${this.menuItemController.onClick}
        @keydown=${this.menuItemController.onKeydown}
      >${e}</${o}>
    `}renderRipple(){return l` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`}renderFocusRing(){return l` <md-focus-ring
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`}getRenderClasses(){return{disabled:this.disabled,selected:this.selected}}renderBody(){return l`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `}focus(){this.listItemRoot?.focus()}}U.shadowRootOptions={...b.shadowRootOptions,delegatesFocus:!0};n([d({type:Boolean,reflect:!0})],U.prototype,"disabled",void 0);n([d()],U.prototype,"type",void 0);n([d()],U.prototype,"href",void 0);n([d()],U.prototype,"target",void 0);n([d({type:Boolean,attribute:"keep-open"})],U.prototype,"keepOpen",void 0);n([d({type:Boolean})],U.prototype,"selected",void 0);n([S(".list-item")],U.prototype,"listItemRoot",void 0);n([te({slot:"headline"})],U.prototype,"headlineElements",void 0);n([te({slot:"supporting-text"})],U.prototype,"supportingTextElements",void 0);n([hr({slot:""})],U.prototype,"defaultElements",void 0);n([d({attribute:"typeahead-text"})],U.prototype,"typeaheadText",null);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ao=g`:host{display:flex;gap:16px;--md-ripple-hover-color: var(--md-menu-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-menu-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-menu-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-menu-item-pressed-state-layer-opacity, 0.12)}:host([disabled]){opacity:var(--md-menu-item-disabled-opacity, 0.3);pointer-events:none}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;gap:inherit;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.list-item:not(.disabled){cursor:pointer}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;color:var(--md-menu-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-menu-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-menu-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-menu-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-menu-item-one-line-container-height, 56px);padding-top:var(--md-menu-item-top-space, 12px);padding-bottom:var(--md-menu-item-bottom-space, 12px);padding-inline-start:var(--md-menu-item-leading-space, 16px);padding-inline-end:var(--md-menu-item-trailing-space, 16px);gap:inherit}md-item[multiline]{min-height:var(--md-menu-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-menu-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-menu-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-menu-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-menu-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-menu-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-menu-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-menu-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-menu-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}.list-item{background-color:var(--md-menu-item-container-color, transparent)}.list-item.selected{background-color:var(--md-menu-item-selected-container-color, var(--md-sys-color-secondary-container, #e8def8))}.selected:not(.disabled) ::slotted(*){color:var(--md-menu-item-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b))}@media(forced-colors: active){:host([disabled]),:host([disabled]) slot{color:GrayText;opacity:1}.list-item{position:relative}.list-item.selected::before{content:"";position:absolute;inset:0;box-sizing:border-box;border-radius:inherit;pointer-events:none;border:3px double CanvasText}}
`;Ao.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Jt=class extends U{};Jt.styles=[Ao];Jt=n([x("md-menu-item")],Jt);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Et extends b{constructor(){super(...arguments),this.inset=!1,this.insetStart=!1,this.insetEnd=!1}}n([d({type:Boolean,reflect:!0})],Et.prototype,"inset",void 0);n([d({type:Boolean,reflect:!0,attribute:"inset-start"})],Et.prototype,"insetStart",void 0);n([d({type:Boolean,reflect:!0,attribute:"inset-end"})],Et.prototype,"insetEnd",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Hr=g`:host{box-sizing:border-box;color:var(--md-divider-color, var(--md-sys-color-outline-variant, #cac4d0));display:flex;height:var(--md-divider-thickness, 1px);width:100%}:host([inset]),:host([inset-start]){padding-inline-start:16px}:host([inset]),:host([inset-end]){padding-inline-end:16px}:host::before{background:currentColor;content:"";height:100%;width:100%}@media(forced-colors: active){:host::before{background:CanvasText}}
`;Hr.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let Qt=class extends Et{};Qt.styles=[Hr];Qt=n([x("md-divider")],Qt);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function kt(r,e){e.bubbles&&(!r.shadowRoot||e.composed)&&e.stopPropagation();const t=Reflect.construct(e.constructor,[e.type,e]),o=r.dispatchEvent(t);return o||e.preventDefault(),o}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const _s={dialog:[[[{transform:"translateY(-50px)"},{transform:"translateY(0)"}],{duration:500,easing:ee.EMPHASIZED}]],scrim:[[[{opacity:0},{opacity:.32}],{duration:500,easing:"linear"}]],container:[[[{opacity:0},{opacity:1}],{duration:50,easing:"linear",pseudoElement:"::before"}],[[{height:"35%"},{height:"100%"}],{duration:500,easing:ee.EMPHASIZED,pseudoElement:"::before"}]],headline:[[[{opacity:0},{opacity:0,offset:.2},{opacity:1}],{duration:250,easing:"linear",fill:"forwards"}]],content:[[[{opacity:0},{opacity:0,offset:.2},{opacity:1}],{duration:250,easing:"linear",fill:"forwards"}]],actions:[[[{opacity:0},{opacity:0,offset:.5},{opacity:1}],{duration:300,easing:"linear",fill:"forwards"}]]},ws={dialog:[[[{transform:"translateY(0)"},{transform:"translateY(-50px)"}],{duration:150,easing:ee.EMPHASIZED_ACCELERATE}]],scrim:[[[{opacity:.32},{opacity:0}],{duration:150,easing:"linear"}]],container:[[[{height:"100%"},{height:"35%"}],{duration:150,easing:ee.EMPHASIZED_ACCELERATE,pseudoElement:"::before"}],[[{opacity:"1"},{opacity:"0"}],{delay:100,duration:50,easing:"linear",pseudoElement:"::before"}]],headline:[[[{opacity:1},{opacity:0}],{duration:100,easing:"linear",fill:"forwards"}]],content:[[[{opacity:1},{opacity:0}],{duration:100,easing:"linear",fill:"forwards"}]],actions:[[[{opacity:1},{opacity:0}],{duration:100,easing:"linear",fill:"forwards"}]]};/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const $s=oe(b);class j extends $s{get open(){return this.isOpen}set open(e){e!==this.isOpen&&(this.isOpen=e,e?(this.setAttribute("open",""),this.show()):(this.removeAttribute("open"),this.close()))}constructor(){super(),this.quick=!1,this.returnValue="",this.noFocusTrap=!1,this.getOpenAnimation=()=>_s,this.getCloseAnimation=()=>ws,this.isOpen=!1,this.isOpening=!1,this.isConnectedPromise=this.getIsConnectedPromise(),this.isAtScrollTop=!1,this.isAtScrollBottom=!1,this.nextClickIsFromContent=!1,this.hasHeadline=!1,this.hasActions=!1,this.hasIcon=!1,this.escapePressedWithoutCancel=!1,this.treewalker=document.createTreeWalker(this,NodeFilter.SHOW_ELEMENT),this.addEventListener("submit",this.handleSubmit)}async show(){this.isOpening=!0,await this.isConnectedPromise,await this.updateComplete;const e=this.dialog;if(e.open||!this.isOpening){this.isOpening=!1;return}if(!this.dispatchEvent(new Event("open",{cancelable:!0}))){this.open=!1,this.isOpening=!1;return}e.showModal(),this.open=!0,this.scroller&&(this.scroller.scrollTop=0),this.querySelector("[autofocus]")?.focus(),await this.animateDialog(this.getOpenAnimation()),this.dispatchEvent(new Event("opened")),this.isOpening=!1}async close(e=this.returnValue){if(this.isOpening=!1,!this.isConnected){this.open=!1;return}await this.updateComplete;const t=this.dialog;if(!t.open||this.isOpening){this.open=!1;return}const o=this.returnValue;if(this.returnValue=e,!this.dispatchEvent(new Event("close",{cancelable:!0}))){this.returnValue=o;return}await this.animateDialog(this.getCloseAnimation()),t.close(e),this.open=!1,this.dispatchEvent(new Event("closed"))}connectedCallback(){super.connectedCallback(),this.isConnectedPromiseResolve()}disconnectedCallback(){super.disconnectedCallback(),this.isConnectedPromise=this.getIsConnectedPromise()}render(){const e=this.open&&!(this.isAtScrollTop&&this.isAtScrollBottom),t={"has-headline":this.hasHeadline,"has-actions":this.hasActions,"has-icon":this.hasIcon,scrollable:e,"show-top-divider":e&&!this.isAtScrollTop,"show-bottom-divider":e&&!this.isAtScrollBottom},o=this.open&&!this.noFocusTrap,i=l`
      <div
        class="focus-trap"
        tabindex="0"
        aria-hidden="true"
        @focus=${this.handleFocusTrapFocus}></div>
    `,{ariaLabel:s}=this;return l`
      <div class="scrim"></div>
      <dialog
        class=${F(t)}
        aria-label=${s||p}
        aria-labelledby=${this.hasHeadline?"headline":p}
        role=${this.type==="alert"?"alertdialog":p}
        @cancel=${this.handleCancel}
        @click=${this.handleDialogClick}
        @close=${this.handleClose}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue||p}>
        ${o?i:p}
        <div class="container" @click=${this.handleContentClick}>
          <div class="headline">
            <div class="icon" aria-hidden="true">
              <slot name="icon" @slotchange=${this.handleIconChange}></slot>
            </div>
            <h2 id="headline" aria-hidden=${!this.hasHeadline||p}>
              <slot
                name="headline"
                @slotchange=${this.handleHeadlineChange}></slot>
            </h2>
            <md-divider></md-divider>
          </div>
          <div class="scroller">
            <div class="content">
              <div class="top anchor"></div>
              <slot name="content"></slot>
              <div class="bottom anchor"></div>
            </div>
          </div>
          <div class="actions">
            <md-divider></md-divider>
            <slot name="actions" @slotchange=${this.handleActionsChange}></slot>
          </div>
        </div>
        ${o?i:p}
      </dialog>
    `}firstUpdated(){this.intersectionObserver=new IntersectionObserver(e=>{for(const t of e)this.handleAnchorIntersection(t)},{root:this.scroller}),this.intersectionObserver.observe(this.topAnchor),this.intersectionObserver.observe(this.bottomAnchor)}handleDialogClick(){if(this.nextClickIsFromContent){this.nextClickIsFromContent=!1;return}this.dispatchEvent(new Event("cancel",{cancelable:!0}))&&this.close()}handleContentClick(){this.nextClickIsFromContent=!0}handleSubmit(e){const t=e.target,{submitter:o}=e;t.getAttribute("method")!=="dialog"||!o||this.close(o.getAttribute("value")??this.returnValue)}handleCancel(e){if(e.target!==this.dialog)return;this.escapePressedWithoutCancel=!1;const t=!kt(this,e);e.preventDefault(),!t&&this.close()}handleClose(){this.escapePressedWithoutCancel&&(this.escapePressedWithoutCancel=!1,this.dialog?.dispatchEvent(new Event("cancel",{cancelable:!0})))}handleKeydown(e){e.key==="Escape"&&(this.escapePressedWithoutCancel=!0,setTimeout(()=>{this.escapePressedWithoutCancel=!1}))}async animateDialog(e){if(this.cancelAnimations?.abort(),this.cancelAnimations=new AbortController,this.quick)return;const{dialog:t,scrim:o,container:i,headline:s,content:a,actions:h}=this;if(!t||!o||!i||!s||!a||!h)return;const{container:c,dialog:u,scrim:m,headline:v,content:$,actions:_}=e,A=[[t,u??[]],[o,m??[]],[i,c??[]],[s,v??[]],[a,$??[]],[h,_??[]]],C=[];for(const[P,z]of A)for(const E of z){const M=P.animate(...E);this.cancelAnimations.signal.addEventListener("abort",()=>{M.cancel()}),C.push(M)}await Promise.all(C.map(P=>P.finished.catch(()=>{})))}handleHeadlineChange(e){const t=e.target;this.hasHeadline=t.assignedElements().length>0}handleActionsChange(e){const t=e.target;this.hasActions=t.assignedElements().length>0}handleIconChange(e){const t=e.target;this.hasIcon=t.assignedElements().length>0}handleAnchorIntersection(e){const{target:t,isIntersecting:o}=e;t===this.topAnchor&&(this.isAtScrollTop=o),t===this.bottomAnchor&&(this.isAtScrollBottom=o)}getIsConnectedPromise(){return new Promise(e=>{this.isConnectedPromiseResolve=e})}handleFocusTrapFocus(e){const[t,o]=this.getFirstAndLastFocusableChildren();if(!t||!o){this.dialog?.focus();return}const i=e.target===this.firstFocusTrap,s=!i,a=e.relatedTarget===t,h=e.relatedTarget===o,c=!a&&!h;if(s&&h||i&&c){t.focus();return}if(i&&a||s&&c){o.focus();return}}getFirstAndLastFocusableChildren(){if(!this.treewalker)return[null,null];let e=null,t=null;for(this.treewalker.currentNode=this.treewalker.root;this.treewalker.nextNode();){const o=this.treewalker.currentNode;Cs(o)&&(e||(e=o),t=o)}return[e,t]}}n([d({type:Boolean})],j.prototype,"open",null);n([d({type:Boolean})],j.prototype,"quick",void 0);n([d({attribute:!1})],j.prototype,"returnValue",void 0);n([d()],j.prototype,"type",void 0);n([d({type:Boolean,attribute:"no-focus-trap"})],j.prototype,"noFocusTrap",void 0);n([S("dialog")],j.prototype,"dialog",void 0);n([S(".scrim")],j.prototype,"scrim",void 0);n([S(".container")],j.prototype,"container",void 0);n([S(".headline")],j.prototype,"headline",void 0);n([S(".content")],j.prototype,"content",void 0);n([S(".actions")],j.prototype,"actions",void 0);n([f()],j.prototype,"isAtScrollTop",void 0);n([f()],j.prototype,"isAtScrollBottom",void 0);n([S(".scroller")],j.prototype,"scroller",void 0);n([S(".top.anchor")],j.prototype,"topAnchor",void 0);n([S(".bottom.anchor")],j.prototype,"bottomAnchor",void 0);n([S(".focus-trap")],j.prototype,"firstFocusTrap",void 0);n([f()],j.prototype,"hasHeadline",void 0);n([f()],j.prototype,"hasActions",void 0);n([f()],j.prototype,"hasIcon",void 0);function Cs(r){const e=":is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true])",t=":not(:disabled,[disabled])";return r.matches(e+t+':not([tabindex^="-"])')?!0:!r.localName.includes("-")||!r.matches(t)?!1:r.shadowRoot?.delegatesFocus??!1}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Vr=g`:host{border-start-start-radius:var(--md-dialog-container-shape-start-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-start-end-radius:var(--md-dialog-container-shape-start-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-end-radius:var(--md-dialog-container-shape-end-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-start-radius:var(--md-dialog-container-shape-end-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));display:contents;margin:auto;max-height:min(560px,100% - 48px);max-width:min(560px,100% - 48px);min-height:140px;min-width:280px;position:fixed;height:fit-content;width:fit-content}dialog{background:rgba(0,0,0,0);border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit}dialog[open]{display:flex}::backdrop{background:none}.scrim{background:var(--md-sys-color-scrim, #000);display:none;inset:0;opacity:32%;pointer-events:none;position:fixed;z-index:1}:host([open]) .scrim{display:flex}h2{all:unset;align-self:stretch}.headline{align-items:center;color:var(--md-dialog-headline-color, var(--md-sys-color-on-surface, #1d1b20));display:flex;flex-direction:column;font-family:var(--md-dialog-headline-font, var(--md-sys-typescale-headline-small-font, var(--md-ref-typeface-brand, Roboto)));font-size:var(--md-dialog-headline-size, var(--md-sys-typescale-headline-small-size, 1.5rem));line-height:var(--md-dialog-headline-line-height, var(--md-sys-typescale-headline-small-line-height, 2rem));font-weight:var(--md-dialog-headline-weight, var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400)));position:relative}slot[name=headline]::slotted(*){align-items:center;align-self:stretch;box-sizing:border-box;display:flex;gap:8px;padding:24px 24px 0}.icon{display:flex}slot[name=icon]::slotted(*){color:var(--md-dialog-icon-color, var(--md-sys-color-secondary, #625b71));fill:currentColor;font-size:var(--md-dialog-icon-size, 24px);margin-top:24px;height:var(--md-dialog-icon-size, 24px);width:var(--md-dialog-icon-size, 24px)}.has-icon slot[name=headline]::slotted(*){justify-content:center;padding-top:16px}.scrollable slot[name=headline]::slotted(*){padding-bottom:16px}.scrollable.has-headline slot[name=content]::slotted(*){padding-top:8px}.container{border-radius:inherit;display:flex;flex-direction:column;flex-grow:1;overflow:hidden;position:relative;transform-origin:top}.container::before{background:var(--md-dialog-container-color, var(--md-sys-color-surface-container-high, #ece6f0));border-radius:inherit;content:"";inset:0;position:absolute}.scroller{display:flex;flex:1;flex-direction:column;overflow:hidden;z-index:1}.scrollable .scroller{overflow-y:scroll}.content{color:var(--md-dialog-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-dialog-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-dialog-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-dialog-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));flex:1;font-weight:var(--md-dialog-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)));height:min-content;position:relative}slot[name=content]::slotted(*){box-sizing:border-box;padding:24px}.anchor{position:absolute}.top.anchor{top:0}.bottom.anchor{bottom:0}.actions{position:relative}slot[name=actions]::slotted(*){box-sizing:border-box;display:flex;gap:8px;justify-content:flex-end;padding:16px 24px 24px}.has-actions slot[name=content]::slotted(*){padding-bottom:8px}md-divider{display:none;position:absolute}.has-headline.show-top-divider .headline md-divider,.has-actions.show-bottom-divider .actions md-divider{display:flex}.headline md-divider{bottom:0}.actions md-divider{top:0}@media(forced-colors: active){dialog{outline:2px solid WindowText}}
`;Vr.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let eo=class extends j{};eo.styles=[Vr];eo=n([x("md-dialog")],eo);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class O extends b{constructor(){super(...arguments),this.disabled=!1,this.error=!1,this.focused=!1,this.label="",this.noAsterisk=!1,this.populated=!1,this.required=!1,this.resizable=!1,this.supportingText="",this.errorText="",this.count=-1,this.max=-1,this.hasStart=!1,this.hasEnd=!1,this.isAnimating=!1,this.refreshErrorAlert=!1,this.disableTransitions=!1}get counterText(){const e=this.count??-1,t=this.max??-1;return e<0||t<=0?"":`${e} / ${t}`}get supportingOrErrorText(){return this.error&&this.errorText?this.errorText:this.supportingText}reannounceError(){this.refreshErrorAlert=!0}update(e){e.has("disabled")&&e.get("disabled")!==void 0&&(this.disableTransitions=!0),this.disabled&&this.focused&&(e.set("focused",!0),this.focused=!1),this.animateLabelIfNeeded({wasFocused:e.get("focused"),wasPopulated:e.get("populated")}),super.update(e)}render(){const e=this.renderLabel(!0),t=this.renderLabel(!1),o=this.renderOutline?.(e),i={disabled:this.disabled,"disable-transitions":this.disableTransitions,error:this.error&&!this.disabled,focused:this.focused,"with-start":this.hasStart,"with-end":this.hasEnd,populated:this.populated,resizable:this.resizable,required:this.required,"no-label":!this.label};return l`
      <div class="field ${F(i)}">
        <div class="container-overflow">
          ${this.renderBackground?.()}
          <slot name="container"></slot>
          ${this.renderStateLayer?.()} ${this.renderIndicator?.()} ${o}
          <div class="container">
            <div class="start">
              <slot name="start"></slot>
            </div>
            <div class="middle">
              <div class="label-wrapper">
                ${t} ${o?p:e}
              </div>
              <div class="content">
                <slot></slot>
              </div>
            </div>
            <div class="end">
              <slot name="end"></slot>
            </div>
          </div>
        </div>
        ${this.renderSupportingText()}
      </div>
    `}updated(e){(e.has("supportingText")||e.has("errorText")||e.has("count")||e.has("max"))&&this.updateSlottedAriaDescribedBy(),this.refreshErrorAlert&&requestAnimationFrame(()=>{this.refreshErrorAlert=!1}),this.disableTransitions&&requestAnimationFrame(()=>{this.disableTransitions=!1})}renderSupportingText(){const{supportingOrErrorText:e,counterText:t}=this;if(!e&&!t)return p;const o=l`<span>${e}</span>`,i=t?l`<span class="counter">${t}</span>`:p,a=this.error&&this.errorText&&!this.refreshErrorAlert?"alert":p;return l`
      <div class="supporting-text" role=${a}>${o}${i}</div>
      <slot
        name="aria-describedby"
        @slotchange=${this.updateSlottedAriaDescribedBy}></slot>
    `}updateSlottedAriaDescribedBy(){for(const e of this.slottedAriaDescribedBy)vo(l`${this.supportingOrErrorText} ${this.counterText}`,e),e.setAttribute("hidden","")}renderLabel(e){if(!this.label)return p;let t;e?t=this.focused||this.populated||this.isAnimating:t=!this.focused&&!this.populated&&!this.isAnimating;const o={hidden:!t,floating:e,resting:!e},i=`${this.label}${this.required&&!this.noAsterisk?"*":""}`;return l`
      <span class="label ${F(o)}" aria-hidden=${!t}
        >${i}</span
      >
    `}animateLabelIfNeeded({wasFocused:e,wasPopulated:t}){if(!this.label)return;e??=this.focused,t??=this.populated;const o=e||t,i=this.focused||this.populated;if(o===i)return;const s=this.getLabelKeyframes();s.length&&(this.isAnimating=!0,this.labelAnimation?.cancel(),this.labelAnimation=this.floatingLabelEl?.animate(s,{duration:150,easing:ee.STANDARD}),this.labelAnimation?.addEventListener("finish",()=>{this.isAnimating=!1}))}getLabelKeyframes(){const{floatingLabelEl:e,restingLabelEl:t}=this;if(!e||!t)return[];const{x:o,y:i,height:s}=e.getBoundingClientRect(),{x:a,y:h,height:c}=t.getBoundingClientRect(),u=e.scrollWidth,m=t.scrollWidth;if(u===0||m===0)return[];const v=m/u,$=a-o,_=h-i+Math.round((c-s*v)/2),A=`translateX(${$}px) translateY(${_}px) scale(${v})`,C="translateX(0) translateY(0) scale(1)",P=t.clientWidth,E=m>P?`${P/v}px`:"";return this.focused||this.populated?[{transform:A,width:E},{transform:C,width:E}]:[{transform:C,width:E},{transform:A,width:E}]}getSurfacePositionClientRect(){return this.containerEl.getBoundingClientRect()}}n([d({type:Boolean})],O.prototype,"disabled",void 0);n([d({type:Boolean})],O.prototype,"error",void 0);n([d({type:Boolean})],O.prototype,"focused",void 0);n([d()],O.prototype,"label",void 0);n([d({type:Boolean,attribute:"no-asterisk"})],O.prototype,"noAsterisk",void 0);n([d({type:Boolean})],O.prototype,"populated",void 0);n([d({type:Boolean})],O.prototype,"required",void 0);n([d({type:Boolean})],O.prototype,"resizable",void 0);n([d({attribute:"supporting-text"})],O.prototype,"supportingText",void 0);n([d({attribute:"error-text"})],O.prototype,"errorText",void 0);n([d({type:Number})],O.prototype,"count",void 0);n([d({type:Number})],O.prototype,"max",void 0);n([d({type:Boolean,attribute:"has-start"})],O.prototype,"hasStart",void 0);n([d({type:Boolean,attribute:"has-end"})],O.prototype,"hasEnd",void 0);n([te({slot:"aria-describedby"})],O.prototype,"slottedAriaDescribedBy",void 0);n([f()],O.prototype,"isAnimating",void 0);n([f()],O.prototype,"refreshErrorAlert",void 0);n([f()],O.prototype,"disableTransitions",void 0);n([S(".label.floating")],O.prototype,"floatingLabelEl",void 0);n([S(".label.resting")],O.prototype,"restingLabelEl",void 0);n([S(".container")],O.prototype,"containerEl",void 0);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Es extends O{renderOutline(e){return l`
      <div class="outline">
        <div class="outline-start"></div>
        <div class="outline-notch">
          <div class="outline-panel-inactive"></div>
          <div class="outline-panel-active"></div>
          <div class="outline-label">${e}</div>
        </div>
        <div class="outline-end"></div>
      </div>
    `}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Wr=g`@layer styles{:host{--_bottom-space: var(--md-outlined-field-bottom-space, 16px);--_content-color: var(--md-outlined-field-content-color, var(--md-sys-color-on-surface, #1d1b20));--_content-font: var(--md-outlined-field-content-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_content-line-height: var(--md-outlined-field-content-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_content-size: var(--md-outlined-field-content-size, var(--md-sys-typescale-body-large-size, 1rem));--_content-space: var(--md-outlined-field-content-space, 16px);--_content-weight: var(--md-outlined-field-content-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_disabled-content-color: var(--md-outlined-field-disabled-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-content-opacity: var(--md-outlined-field-disabled-content-opacity, 0.38);--_disabled-label-text-color: var(--md-outlined-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-field-disabled-label-text-opacity, 0.38);--_disabled-leading-content-color: var(--md-outlined-field-disabled-leading-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-content-opacity: var(--md-outlined-field-disabled-leading-content-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-field-disabled-outline-opacity, 0.12);--_disabled-outline-width: var(--md-outlined-field-disabled-outline-width, 1px);--_disabled-supporting-text-color: var(--md-outlined-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-outlined-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-content-color: var(--md-outlined-field-disabled-trailing-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-content-opacity: var(--md-outlined-field-disabled-trailing-content-opacity, 0.38);--_error-content-color: var(--md-outlined-field-error-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-content-color: var(--md-outlined-field-error-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-outlined-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-content-color: var(--md-outlined-field-error-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-outline-color: var(--md-outlined-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_error-focus-supporting-text-color: var(--md-outlined-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-content-color: var(--md-outlined-field-error-focus-trailing-content-color, var(--md-sys-color-error, #b3261e));--_error-hover-content-color: var(--md-outlined-field-error-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-outlined-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-content-color: var(--md-outlined-field-error-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-outline-color: var(--md-outlined-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-supporting-text-color: var(--md-outlined-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-content-color: var(--md-outlined-field-error-hover-trailing-content-color, var(--md-sys-color-on-error-container, #410e0b));--_error-label-text-color: var(--md-outlined-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-content-color: var(--md-outlined-field-error-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-outline-color: var(--md-outlined-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_error-supporting-text-color: var(--md-outlined-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-content-color: var(--md-outlined-field-error-trailing-content-color, var(--md-sys-color-error, #b3261e));--_focus-content-color: var(--md-outlined-field-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-outlined-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-content-color: var(--md-outlined-field-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-outline-color: var(--md-outlined-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_focus-outline-width: var(--md-outlined-field-focus-outline-width, 3px);--_focus-supporting-text-color: var(--md-outlined-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-content-color: var(--md-outlined-field-focus-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-content-color: var(--md-outlined-field-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-outlined-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-leading-content-color: var(--md-outlined-field-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-outline-color: var(--md-outlined-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-outline-width: var(--md-outlined-field-hover-outline-width, 1px);--_hover-supporting-text-color: var(--md-outlined-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-content-color: var(--md-outlined-field-hover-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-outlined-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-outlined-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-padding-bottom: var(--md-outlined-field-label-text-padding-bottom, 8px);--_label-text-populated-line-height: var(--md-outlined-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-outlined-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-outlined-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-outlined-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-content-color: var(--md-outlined-field-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-space: var(--md-outlined-field-leading-space, 16px);--_outline-color: var(--md-outlined-field-outline-color, var(--md-sys-color-outline, #79747e));--_outline-label-padding: var(--md-outlined-field-outline-label-padding, 4px);--_outline-width: var(--md-outlined-field-outline-width, 1px);--_supporting-text-color: var(--md-outlined-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-outlined-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-leading-space: var(--md-outlined-field-supporting-text-leading-space, 16px);--_supporting-text-line-height: var(--md-outlined-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-outlined-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-top-space: var(--md-outlined-field-supporting-text-top-space, 4px);--_supporting-text-trailing-space: var(--md-outlined-field-supporting-text-trailing-space, 16px);--_supporting-text-weight: var(--md-outlined-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_top-space: var(--md-outlined-field-top-space, 16px);--_trailing-content-color: var(--md-outlined-field-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-space: var(--md-outlined-field-trailing-space, 16px);--_with-leading-content-leading-space: var(--md-outlined-field-with-leading-content-leading-space, 12px);--_with-trailing-content-trailing-space: var(--md-outlined-field-with-trailing-content-trailing-space, 12px);--_container-shape-start-start: var(--md-outlined-field-container-shape-start-start, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-outlined-field-container-shape-start-end, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-outlined-field-container-shape-end-end, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-start: var(--md-outlined-field-container-shape-end-start, var(--md-outlined-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)))}.outline{border-color:var(--_outline-color);border-radius:inherit;display:flex;pointer-events:none;height:100%;position:absolute;width:100%;z-index:1}.outline-start::before,.outline-start::after,.outline-panel-inactive::before,.outline-panel-inactive::after,.outline-panel-active::before,.outline-panel-active::after,.outline-end::before,.outline-end::after{border:inherit;content:"";inset:0;position:absolute}.outline-start,.outline-end{border:inherit;border-radius:inherit;box-sizing:border-box;position:relative}.outline-start::before,.outline-start::after,.outline-end::before,.outline-end::after{border-bottom-style:solid;border-top-style:solid}.outline-start::after,.outline-end::after{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .outline-start::after,.focused .outline-end::after{opacity:1}.outline-start::before,.outline-start::after{border-inline-start-style:solid;border-inline-end-style:none;border-start-start-radius:inherit;border-start-end-radius:0;border-end-start-radius:inherit;border-end-end-radius:0;margin-inline-end:var(--_outline-label-padding)}.outline-end{flex-grow:1;margin-inline-start:calc(-1*var(--_outline-label-padding))}.outline-end::before,.outline-end::after{border-inline-start-style:none;border-inline-end-style:solid;border-start-start-radius:0;border-start-end-radius:inherit;border-end-start-radius:0;border-end-end-radius:inherit}.outline-notch{align-items:flex-start;border:inherit;display:flex;margin-inline-start:calc(-1*var(--_outline-label-padding));margin-inline-end:var(--_outline-label-padding);max-width:calc(100% - var(--_leading-space) - var(--_trailing-space));padding:0 var(--_outline-label-padding);position:relative}.no-label .outline-notch{display:none}.outline-panel-inactive,.outline-panel-active{border:inherit;border-bottom-style:solid;inset:0;position:absolute}.outline-panel-inactive::before,.outline-panel-inactive::after,.outline-panel-active::before,.outline-panel-active::after{border-top-style:solid;border-bottom:none;bottom:auto;transform:scaleX(1);transition:transform 150ms cubic-bezier(0.2, 0, 0, 1)}.outline-panel-inactive::before,.outline-panel-active::before{right:50%;transform-origin:top left}.outline-panel-inactive::after,.outline-panel-active::after{left:50%;transform-origin:top right}.populated .outline-panel-inactive::before,.populated .outline-panel-inactive::after,.populated .outline-panel-active::before,.populated .outline-panel-active::after,.focused .outline-panel-inactive::before,.focused .outline-panel-inactive::after,.focused .outline-panel-active::before,.focused .outline-panel-active::after{transform:scaleX(0)}.outline-panel-active{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .outline-panel-active{opacity:1}.outline-label{display:flex;max-width:100%;transform:translateY(calc(-100% + var(--_label-text-padding-bottom)))}.outline-start,.field:not(.with-start) .content ::slotted(*){padding-inline-start:max(var(--_leading-space),max(var(--_container-shape-start-start),var(--_container-shape-end-start)) + var(--_outline-label-padding))}.field:not(.with-start) .label-wrapper{margin-inline-start:max(var(--_leading-space),max(var(--_container-shape-start-start),var(--_container-shape-end-start)) + var(--_outline-label-padding))}.field:not(.with-end) .content ::slotted(*){padding-inline-end:max(var(--_trailing-space),max(var(--_container-shape-start-end),var(--_container-shape-end-end)))}.field:not(.with-end) .label-wrapper{margin-inline-end:max(var(--_trailing-space),max(var(--_container-shape-start-end),var(--_container-shape-end-end)))}.outline-start::before,.outline-end::before,.outline-panel-inactive,.outline-panel-inactive::before,.outline-panel-inactive::after{border-width:var(--_outline-width)}:hover .outline{border-color:var(--_hover-outline-color);color:var(--_hover-outline-color)}:hover .outline-start::before,:hover .outline-end::before,:hover .outline-panel-inactive,:hover .outline-panel-inactive::before,:hover .outline-panel-inactive::after{border-width:var(--_hover-outline-width)}.focused .outline{border-color:var(--_focus-outline-color);color:var(--_focus-outline-color)}.outline-start::after,.outline-end::after,.outline-panel-active,.outline-panel-active::before,.outline-panel-active::after{border-width:var(--_focus-outline-width)}.disabled .outline{border-color:var(--_disabled-outline-color);color:var(--_disabled-outline-color)}.disabled .outline-start,.disabled .outline-end,.disabled .outline-panel-inactive{opacity:var(--_disabled-outline-opacity)}.disabled .outline-start::before,.disabled .outline-end::before,.disabled .outline-panel-inactive,.disabled .outline-panel-inactive::before,.disabled .outline-panel-inactive::after{border-width:var(--_disabled-outline-width)}.error .outline{border-color:var(--_error-outline-color);color:var(--_error-outline-color)}.error:hover .outline{border-color:var(--_error-hover-outline-color);color:var(--_error-hover-outline-color)}.error.focused .outline{border-color:var(--_error-focus-outline-color);color:var(--_error-focus-outline-color)}.resizable .container{bottom:var(--_focus-outline-width);inset-inline-end:var(--_focus-outline-width);clip-path:inset(var(--_focus-outline-width) 0 0 var(--_focus-outline-width))}.resizable .container>*{top:var(--_focus-outline-width);inset-inline-start:var(--_focus-outline-width)}.resizable .container:dir(rtl){clip-path:inset(var(--_focus-outline-width) var(--_focus-outline-width) 0 0)}}@layer hcm{@media(forced-colors: active){.disabled .outline{border-color:GrayText;color:GrayText}.disabled :is(.outline-start,.outline-end,.outline-panel-inactive){opacity:1}}}
`;Wr.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Gr=g`:host{display:inline-flex;resize:both}.field{display:flex;flex:1;flex-direction:column;writing-mode:horizontal-tb;max-width:100%}.container-overflow{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-end-radius:var(--_container-shape-end-end);border-end-start-radius:var(--_container-shape-end-start);display:flex;height:100%;position:relative}.container{align-items:center;border-radius:inherit;display:flex;flex:1;max-height:100%;min-height:100%;min-width:min-content;position:relative}.field,.container-overflow{resize:inherit}.resizable:not(.disabled) .container{resize:inherit;overflow:hidden}.disabled{pointer-events:none}slot[name=container]{border-radius:inherit}slot[name=container]::slotted(*){border-radius:inherit;inset:0;pointer-events:none;position:absolute}@layer styles{.start,.middle,.end{display:flex;box-sizing:border-box;height:100%;position:relative}.start{color:var(--_leading-content-color)}.end{color:var(--_trailing-content-color)}.start,.end{align-items:center;justify-content:center}.with-start .start{margin-inline:var(--_with-leading-content-leading-space) var(--_content-space)}.with-end .end{margin-inline:var(--_content-space) var(--_with-trailing-content-trailing-space)}.middle{align-items:stretch;align-self:baseline;flex:1}.content{color:var(--_content-color);display:flex;flex:1;opacity:0;transition:opacity 83ms cubic-bezier(0.2, 0, 0, 1)}.no-label .content,.focused .content,.populated .content{opacity:1;transition-delay:67ms}:is(.disabled,.disable-transitions) .content{transition:none}.content ::slotted(*){all:unset;color:currentColor;font-family:var(--_content-font);font-size:var(--_content-size);line-height:var(--_content-line-height);font-weight:var(--_content-weight);width:100%;overflow-wrap:revert;white-space:revert}.content ::slotted(:not(textarea)){padding-top:var(--_top-space);padding-bottom:var(--_bottom-space)}.content ::slotted(textarea){margin-top:var(--_top-space);margin-bottom:var(--_bottom-space)}:hover .content{color:var(--_hover-content-color)}:hover .start{color:var(--_hover-leading-content-color)}:hover .end{color:var(--_hover-trailing-content-color)}.focused .content{color:var(--_focus-content-color)}.focused .start{color:var(--_focus-leading-content-color)}.focused .end{color:var(--_focus-trailing-content-color)}.disabled .content{color:var(--_disabled-content-color)}.disabled.no-label .content,.disabled.focused .content,.disabled.populated .content{opacity:var(--_disabled-content-opacity)}.disabled .start{color:var(--_disabled-leading-content-color);opacity:var(--_disabled-leading-content-opacity)}.disabled .end{color:var(--_disabled-trailing-content-color);opacity:var(--_disabled-trailing-content-opacity)}.error .content{color:var(--_error-content-color)}.error .start{color:var(--_error-leading-content-color)}.error .end{color:var(--_error-trailing-content-color)}.error:hover .content{color:var(--_error-hover-content-color)}.error:hover .start{color:var(--_error-hover-leading-content-color)}.error:hover .end{color:var(--_error-hover-trailing-content-color)}.error.focused .content{color:var(--_error-focus-content-color)}.error.focused .start{color:var(--_error-focus-leading-content-color)}.error.focused .end{color:var(--_error-focus-trailing-content-color)}}@layer hcm{@media(forced-colors: active){.disabled :is(.start,.content,.end){color:GrayText;opacity:1}}}@layer styles{.label{box-sizing:border-box;color:var(--_label-text-color);overflow:hidden;max-width:100%;text-overflow:ellipsis;white-space:nowrap;z-index:1;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);width:min-content}.label-wrapper{inset:0;pointer-events:none;position:absolute}.label.resting{position:absolute;top:var(--_top-space)}.label.floating{font-size:var(--_label-text-populated-size);line-height:var(--_label-text-populated-line-height);transform-origin:top left}.label.hidden{opacity:0}.no-label .label{display:none}.label-wrapper{inset:0;position:absolute;text-align:initial}:hover .label{color:var(--_hover-label-text-color)}.focused .label{color:var(--_focus-label-text-color)}.disabled .label{color:var(--_disabled-label-text-color)}.disabled .label:not(.hidden){opacity:var(--_disabled-label-text-opacity)}.error .label{color:var(--_error-label-text-color)}.error:hover .label{color:var(--_error-hover-label-text-color)}.error.focused .label{color:var(--_error-focus-label-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .label:not(.hidden){color:GrayText;opacity:1}}}@layer styles{.supporting-text{color:var(--_supporting-text-color);display:flex;font-family:var(--_supporting-text-font);font-size:var(--_supporting-text-size);line-height:var(--_supporting-text-line-height);font-weight:var(--_supporting-text-weight);gap:16px;justify-content:space-between;padding-inline-start:var(--_supporting-text-leading-space);padding-inline-end:var(--_supporting-text-trailing-space);padding-top:var(--_supporting-text-top-space)}.supporting-text :nth-child(2){flex-shrink:0}:hover .supporting-text{color:var(--_hover-supporting-text-color)}.focus .supporting-text{color:var(--_focus-supporting-text-color)}.disabled .supporting-text{color:var(--_disabled-supporting-text-color);opacity:var(--_disabled-supporting-text-opacity)}.error .supporting-text{color:var(--_error-supporting-text-color)}.error:hover .supporting-text{color:var(--_error-hover-supporting-text-color)}.error.focus .supporting-text{color:var(--_error-focus-supporting-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .supporting-text{color:GrayText;opacity:1}}}
`;Gr.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let to=class extends Es{};to.styles=[Gr,Wr];to=n([x("md-outlined-field")],to);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Kr=g`:host{--_caret-color: var(--md-outlined-text-field-caret-color, var(--md-sys-color-primary, #6750a4));--_disabled-input-text-color: var(--md-outlined-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-input-text-opacity: var(--md-outlined-text-field-disabled-input-text-opacity, 0.38);--_disabled-label-text-color: var(--md-outlined-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-outlined-text-field-disabled-label-text-opacity, 0.38);--_disabled-leading-icon-color: var(--md-outlined-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-outlined-text-field-disabled-leading-icon-opacity, 0.38);--_disabled-outline-color: var(--md-outlined-text-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-outlined-text-field-disabled-outline-opacity, 0.12);--_disabled-outline-width: var(--md-outlined-text-field-disabled-outline-width, 1px);--_disabled-supporting-text-color: var(--md-outlined-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-outlined-text-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-icon-color: var(--md-outlined-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-outlined-text-field-disabled-trailing-icon-opacity, 0.38);--_error-focus-caret-color: var(--md-outlined-text-field-error-focus-caret-color, var(--md-sys-color-error, #b3261e));--_error-focus-input-text-color: var(--md-outlined-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-outlined-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-icon-color: var(--md-outlined-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-outline-color: var(--md-outlined-text-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_error-focus-supporting-text-color: var(--md-outlined-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-icon-color: var(--md-outlined-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_error-hover-input-text-color: var(--md-outlined-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-outlined-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-icon-color: var(--md-outlined-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-outline-color: var(--md-outlined-text-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-supporting-text-color: var(--md-outlined-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-icon-color: var(--md-outlined-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_error-input-text-color: var(--md-outlined-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-label-text-color: var(--md-outlined-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-icon-color: var(--md-outlined-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-outline-color: var(--md-outlined-text-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_error-supporting-text-color: var(--md-outlined-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-icon-color: var(--md-outlined-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_focus-input-text-color: var(--md-outlined-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-outlined-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-icon-color: var(--md-outlined-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-outline-color: var(--md-outlined-text-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_focus-outline-width: var(--md-outlined-text-field-focus-outline-width, 3px);--_focus-supporting-text-color: var(--md-outlined-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-icon-color: var(--md-outlined-text-field-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-input-text-color: var(--md-outlined-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-outlined-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-leading-icon-color: var(--md-outlined-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-outline-color: var(--md-outlined-text-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-outline-width: var(--md-outlined-text-field-hover-outline-width, 1px);--_hover-supporting-text-color: var(--md-outlined-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-outlined-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-color: var(--md-outlined-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_input-text-font: var(--md-outlined-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_input-text-line-height: var(--md-outlined-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_input-text-placeholder-color: var(--md-outlined-text-field-input-text-placeholder-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-prefix-color: var(--md-outlined-text-field-input-text-prefix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-size: var(--md-outlined-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_input-text-suffix-color: var(--md-outlined-text-field-input-text-suffix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-weight: var(--md-outlined-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_label-text-color: var(--md-outlined-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-outlined-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-outlined-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-outlined-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-outlined-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-outlined-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-outlined-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-icon-color: var(--md-outlined-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-icon-size: var(--md-outlined-text-field-leading-icon-size, 24px);--_outline-color: var(--md-outlined-text-field-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-outlined-text-field-outline-width, 1px);--_supporting-text-color: var(--md-outlined-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-outlined-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-line-height: var(--md-outlined-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-outlined-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-weight: var(--md-outlined-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_trailing-icon-color: var(--md-outlined-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-size: var(--md-outlined-text-field-trailing-icon-size, 24px);--_container-shape-start-start: var(--md-outlined-text-field-container-shape-start-start, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-outlined-text-field-container-shape-start-end, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-outlined-text-field-container-shape-end-end, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-start: var(--md-outlined-text-field-container-shape-end-start, var(--md-outlined-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_icon-input-space: var(--md-outlined-text-field-icon-input-space, 16px);--_leading-space: var(--md-outlined-text-field-leading-space, 16px);--_trailing-space: var(--md-outlined-text-field-trailing-space, 16px);--_top-space: var(--md-outlined-text-field-top-space, 16px);--_bottom-space: var(--md-outlined-text-field-bottom-space, 16px);--_input-text-prefix-trailing-space: var(--md-outlined-text-field-input-text-prefix-trailing-space, 2px);--_input-text-suffix-leading-space: var(--md-outlined-text-field-input-text-suffix-leading-space, 2px);--_focus-caret-color: var(--md-outlined-text-field-focus-caret-color, var(--md-sys-color-primary, #6750a4));--_with-leading-icon-leading-space: var(--md-outlined-text-field-with-leading-icon-leading-space, 12px);--_with-trailing-icon-trailing-space: var(--md-outlined-text-field-with-trailing-icon-trailing-space, 12px);--md-outlined-field-bottom-space: var(--_bottom-space);--md-outlined-field-container-shape-end-end: var(--_container-shape-end-end);--md-outlined-field-container-shape-end-start: var(--_container-shape-end-start);--md-outlined-field-container-shape-start-end: var(--_container-shape-start-end);--md-outlined-field-container-shape-start-start: var(--_container-shape-start-start);--md-outlined-field-content-color: var(--_input-text-color);--md-outlined-field-content-font: var(--_input-text-font);--md-outlined-field-content-line-height: var(--_input-text-line-height);--md-outlined-field-content-size: var(--_input-text-size);--md-outlined-field-content-space: var(--_icon-input-space);--md-outlined-field-content-weight: var(--_input-text-weight);--md-outlined-field-disabled-content-color: var(--_disabled-input-text-color);--md-outlined-field-disabled-content-opacity: var(--_disabled-input-text-opacity);--md-outlined-field-disabled-label-text-color: var(--_disabled-label-text-color);--md-outlined-field-disabled-label-text-opacity: var(--_disabled-label-text-opacity);--md-outlined-field-disabled-leading-content-color: var(--_disabled-leading-icon-color);--md-outlined-field-disabled-leading-content-opacity: var(--_disabled-leading-icon-opacity);--md-outlined-field-disabled-outline-color: var(--_disabled-outline-color);--md-outlined-field-disabled-outline-opacity: var(--_disabled-outline-opacity);--md-outlined-field-disabled-outline-width: var(--_disabled-outline-width);--md-outlined-field-disabled-supporting-text-color: var(--_disabled-supporting-text-color);--md-outlined-field-disabled-supporting-text-opacity: var(--_disabled-supporting-text-opacity);--md-outlined-field-disabled-trailing-content-color: var(--_disabled-trailing-icon-color);--md-outlined-field-disabled-trailing-content-opacity: var(--_disabled-trailing-icon-opacity);--md-outlined-field-error-content-color: var(--_error-input-text-color);--md-outlined-field-error-focus-content-color: var(--_error-focus-input-text-color);--md-outlined-field-error-focus-label-text-color: var(--_error-focus-label-text-color);--md-outlined-field-error-focus-leading-content-color: var(--_error-focus-leading-icon-color);--md-outlined-field-error-focus-outline-color: var(--_error-focus-outline-color);--md-outlined-field-error-focus-supporting-text-color: var(--_error-focus-supporting-text-color);--md-outlined-field-error-focus-trailing-content-color: var(--_error-focus-trailing-icon-color);--md-outlined-field-error-hover-content-color: var(--_error-hover-input-text-color);--md-outlined-field-error-hover-label-text-color: var(--_error-hover-label-text-color);--md-outlined-field-error-hover-leading-content-color: var(--_error-hover-leading-icon-color);--md-outlined-field-error-hover-outline-color: var(--_error-hover-outline-color);--md-outlined-field-error-hover-supporting-text-color: var(--_error-hover-supporting-text-color);--md-outlined-field-error-hover-trailing-content-color: var(--_error-hover-trailing-icon-color);--md-outlined-field-error-label-text-color: var(--_error-label-text-color);--md-outlined-field-error-leading-content-color: var(--_error-leading-icon-color);--md-outlined-field-error-outline-color: var(--_error-outline-color);--md-outlined-field-error-supporting-text-color: var(--_error-supporting-text-color);--md-outlined-field-error-trailing-content-color: var(--_error-trailing-icon-color);--md-outlined-field-focus-content-color: var(--_focus-input-text-color);--md-outlined-field-focus-label-text-color: var(--_focus-label-text-color);--md-outlined-field-focus-leading-content-color: var(--_focus-leading-icon-color);--md-outlined-field-focus-outline-color: var(--_focus-outline-color);--md-outlined-field-focus-outline-width: var(--_focus-outline-width);--md-outlined-field-focus-supporting-text-color: var(--_focus-supporting-text-color);--md-outlined-field-focus-trailing-content-color: var(--_focus-trailing-icon-color);--md-outlined-field-hover-content-color: var(--_hover-input-text-color);--md-outlined-field-hover-label-text-color: var(--_hover-label-text-color);--md-outlined-field-hover-leading-content-color: var(--_hover-leading-icon-color);--md-outlined-field-hover-outline-color: var(--_hover-outline-color);--md-outlined-field-hover-outline-width: var(--_hover-outline-width);--md-outlined-field-hover-supporting-text-color: var(--_hover-supporting-text-color);--md-outlined-field-hover-trailing-content-color: var(--_hover-trailing-icon-color);--md-outlined-field-label-text-color: var(--_label-text-color);--md-outlined-field-label-text-font: var(--_label-text-font);--md-outlined-field-label-text-line-height: var(--_label-text-line-height);--md-outlined-field-label-text-populated-line-height: var(--_label-text-populated-line-height);--md-outlined-field-label-text-populated-size: var(--_label-text-populated-size);--md-outlined-field-label-text-size: var(--_label-text-size);--md-outlined-field-label-text-weight: var(--_label-text-weight);--md-outlined-field-leading-content-color: var(--_leading-icon-color);--md-outlined-field-leading-space: var(--_leading-space);--md-outlined-field-outline-color: var(--_outline-color);--md-outlined-field-outline-width: var(--_outline-width);--md-outlined-field-supporting-text-color: var(--_supporting-text-color);--md-outlined-field-supporting-text-font: var(--_supporting-text-font);--md-outlined-field-supporting-text-line-height: var(--_supporting-text-line-height);--md-outlined-field-supporting-text-size: var(--_supporting-text-size);--md-outlined-field-supporting-text-weight: var(--_supporting-text-weight);--md-outlined-field-top-space: var(--_top-space);--md-outlined-field-trailing-content-color: var(--_trailing-icon-color);--md-outlined-field-trailing-space: var(--_trailing-space);--md-outlined-field-with-leading-content-leading-space: var(--_with-leading-icon-leading-space);--md-outlined-field-with-trailing-content-trailing-space: var(--_with-trailing-icon-trailing-space)}
`;Kr.styleSheet;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ks=r=>r.strings===void 0,As={},Ps=(r,e=As)=>r._$AH=e;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ir=yo(class extends xo{constructor(r){if(super(r),r.type!==he.PROPERTY&&r.type!==he.ATTRIBUTE&&r.type!==he.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!ks(r))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(r,[e]){if(e===V||e===p)return e;const t=r.element,o=r.name;if(r.type===he.PROPERTY){if(e===t[o])return V}else if(r.type===he.BOOLEAN_ATTRIBUTE){if(!!e===t.hasAttribute(o))return V}else if(r.type===he.ATTRIBUTE&&t.getAttribute(o)===e+"")return V;return Ps(r),e}});/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ss={fromAttribute(r){return r??""},toAttribute(r){return r||null}};/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const We=Symbol("createValidator"),Ge=Symbol("getValidityAnchor"),zt=Symbol("privateValidator"),se=Symbol("privateSyncValidity"),dt=Symbol("privateCustomValidationMessage");function Po(r){var e;class t extends r{constructor(){super(...arguments),this[e]=""}get validity(){return this[se](),this[H].validity}get validationMessage(){return this[se](),this[H].validationMessage}get willValidate(){return this[se](),this[H].willValidate}checkValidity(){return this[se](),this[H].checkValidity()}reportValidity(){return this[se](),this[H].reportValidity()}setCustomValidity(i){this[dt]=i,this[se]()}requestUpdate(i,s,a){super.requestUpdate(i,s,a),this[se]()}firstUpdated(i){super.firstUpdated(i),this[se]()}[(e=dt,se)](){this[zt]||(this[zt]=this[We]());const{validity:i,validationMessage:s}=this[zt].getValidity(),a=!!this[dt],h=this[dt]||s;this[H].setValidity({...i,customError:a},h,this[Ge]()??void 0)}[We](){throw new Error("Implement [createValidator]")}[Ge](){throw new Error("Implement [getValidityAnchor]")}}return t}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const bt=Symbol("onReportValidity"),ct=Symbol("privateCleanupFormListeners"),ht=Symbol("privateDoNotReportInvalid"),pt=Symbol("privateIsSelfReportingValidity"),ut=Symbol("privateCallOnReportValidity");function Yr(r){var e,t,o;class i extends r{constructor(...a){super(...a),this[e]=new AbortController,this[t]=!1,this[o]=!1,this.addEventListener("invalid",h=>{this[ht]||!h.isTrusted||this.addEventListener("invalid",()=>{this[ut](h)},{once:!0})},{capture:!0})}checkValidity(){this[ht]=!0;const a=super.checkValidity();return this[ht]=!1,a}reportValidity(){this[pt]=!0;const a=super.reportValidity();return a&&this[ut](null),this[pt]=!1,a}[(e=ct,t=ht,o=pt,ut)](a){const h=a?.defaultPrevented;h||(this[bt](a),!(!h&&a?.defaultPrevented))||(this[pt]||Os(this[H].form,this))&&this.focus()}[bt](a){throw new Error("Implement [onReportValidity]")}formAssociatedCallback(a){super.formAssociatedCallback&&super.formAssociatedCallback(a),this[ct].abort(),a&&(this[ct]=new AbortController,Is(this,a,()=>{this[ut](null)},this[ct].signal))}}return i}function Is(r,e,t,o){const i=Ts(e);let s=!1,a,h=!1;i.addEventListener("before",()=>{h=!0,a=new AbortController,s=!1,r.addEventListener("invalid",()=>{s=!0},{signal:a.signal})},{signal:o}),i.addEventListener("after",()=>{h=!1,a?.abort(),!s&&t()},{signal:o}),e.addEventListener("submit",()=>{h||t()},{signal:o})}const Rt=new WeakMap;function Ts(r){if(!Rt.has(r)){const e=new EventTarget;Rt.set(r,e);for(const t of["reportValidity","requestSubmit"]){const o=r[t];r[t]=function(){e.dispatchEvent(new Event("before"));const i=Reflect.apply(o,this,arguments);return e.dispatchEvent(new Event("after")),i}}}return Rt.get(r)}function Os(r,e){if(!r)return!0;let t;for(const o of r.elements)if(o.matches(":invalid")){t=o;break}return t===e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class So{constructor(e){this.getCurrentState=e,this.currentValidity={validity:{},validationMessage:""}}getValidity(){const e=this.getCurrentState();if(!(!this.prevState||!this.equals(this.prevState,e)))return this.currentValidity;const{validity:o,validationMessage:i}=this.computeValidity(e);return this.prevState=this.copy(e),this.currentValidity={validationMessage:i,validity:{badInput:o.badInput,customError:o.customError,patternMismatch:o.patternMismatch,rangeOverflow:o.rangeOverflow,rangeUnderflow:o.rangeUnderflow,stepMismatch:o.stepMismatch,tooLong:o.tooLong,tooShort:o.tooShort,typeMismatch:o.typeMismatch,valueMissing:o.valueMissing}},this.currentValidity}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class js extends So{computeValidity({state:e,renderedControl:t}){let o=t;Be(e)&&!o?(o=this.inputControl||document.createElement("input"),this.inputControl=o):o||(o=this.textAreaControl||document.createElement("textarea"),this.textAreaControl=o);const i=Be(e)?o:null;if(i&&(i.type=e.type),o.value!==e.value&&(o.value=e.value),o.required=e.required,i){const s=e;s.pattern?i.pattern=s.pattern:i.removeAttribute("pattern"),s.min?i.min=s.min:i.removeAttribute("min"),s.max?i.max=s.max:i.removeAttribute("max"),s.step?i.step=s.step:i.removeAttribute("step")}return(e.minLength??-1)>-1?o.setAttribute("minlength",String(e.minLength)):o.removeAttribute("minlength"),(e.maxLength??-1)>-1?o.setAttribute("maxlength",String(e.maxLength)):o.removeAttribute("maxlength"),{validity:o.validity,validationMessage:o.validationMessage}}equals({state:e},{state:t}){const o=e.type===t.type&&e.value===t.value&&e.required===t.required&&e.minLength===t.minLength&&e.maxLength===t.maxLength;return!Be(e)||!Be(t)?o:o&&e.pattern===t.pattern&&e.min===t.min&&e.max===t.max&&e.step===t.step}copy({state:e}){return{state:Be(e)?this.copyInput(e):this.copyTextArea(e),renderedControl:null}}copyInput(e){const{type:t,pattern:o,min:i,max:s,step:a}=e;return{...this.copySharedState(e),type:t,pattern:o,min:i,max:s,step:a}}copyTextArea(e){return{...this.copySharedState(e),type:e.type}}copySharedState({value:e,required:t,minLength:o,maxLength:i}){return{value:e,required:t,minLength:o,maxLength:i}}}function Be(r){return r.type!=="textarea"}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const zs=oe(Yr(Po(ot(tt(b)))));class w extends zs{constructor(){super(...arguments),this.error=!1,this.errorText="",this.label="",this.noAsterisk=!1,this.required=!1,this.value="",this.prefixText="",this.suffixText="",this.hasLeadingIcon=!1,this.hasTrailingIcon=!1,this.supportingText="",this.textDirection="",this.rows=2,this.cols=20,this.inputMode="",this.max="",this.maxLength=-1,this.min="",this.minLength=-1,this.noSpinner=!1,this.pattern="",this.placeholder="",this.readOnly=!1,this.multiple=!1,this.step="",this.type="text",this.autocomplete="",this.dirty=!1,this.focused=!1,this.nativeError=!1,this.nativeErrorText=""}get selectionDirection(){return this.getInputOrTextarea().selectionDirection}set selectionDirection(e){this.getInputOrTextarea().selectionDirection=e}get selectionEnd(){return this.getInputOrTextarea().selectionEnd}set selectionEnd(e){this.getInputOrTextarea().selectionEnd=e}get selectionStart(){return this.getInputOrTextarea().selectionStart}set selectionStart(e){this.getInputOrTextarea().selectionStart=e}get valueAsNumber(){const e=this.getInput();return e?e.valueAsNumber:NaN}set valueAsNumber(e){const t=this.getInput();t&&(t.valueAsNumber=e,this.value=t.value)}get valueAsDate(){const e=this.getInput();return e?e.valueAsDate:null}set valueAsDate(e){const t=this.getInput();t&&(t.valueAsDate=e,this.value=t.value)}get hasError(){return this.error||this.nativeError}select(){this.getInputOrTextarea().select()}setRangeText(...e){this.getInputOrTextarea().setRangeText(...e),this.value=this.getInputOrTextarea().value}setSelectionRange(e,t,o){this.getInputOrTextarea().setSelectionRange(e,t,o)}showPicker(){const e=this.getInput();e&&e.showPicker()}stepDown(e){const t=this.getInput();t&&(t.stepDown(e),this.value=t.value)}stepUp(e){const t=this.getInput();t&&(t.stepUp(e),this.value=t.value)}reset(){this.dirty=!1,this.value=this.getAttribute("value")??"",this.nativeError=!1,this.nativeErrorText=""}attributeChangedCallback(e,t,o){e==="value"&&this.dirty||super.attributeChangedCallback(e,t,o)}render(){const e={disabled:this.disabled,error:!this.disabled&&this.hasError,textarea:this.type==="textarea","no-spinner":this.noSpinner};return l`
      <span class="text-field ${F(e)}">
        ${this.renderField()}
      </span>
    `}updated(e){const t=this.getInputOrTextarea().value;this.value!==t&&(this.value=t)}renderField(){return Ct`<${this.fieldTag}
      class="field"
      count=${this.value.length}
      ?disabled=${this.disabled}
      ?error=${this.hasError}
      error-text=${this.getErrorText()}
      ?focused=${this.focused}
      ?has-end=${this.hasTrailingIcon}
      ?has-start=${this.hasLeadingIcon}
      label=${this.label}
      ?no-asterisk=${this.noAsterisk}
      max=${this.maxLength}
      ?populated=${!!this.value}
      ?required=${this.required}
      ?resizable=${this.type==="textarea"}
      supporting-text=${this.supportingText}
    >
      ${this.renderLeadingIcon()}
      ${this.renderInputOrTextarea()}
      ${this.renderTrailingIcon()}
      <div id="description" slot="aria-describedby"></div>
      <slot name="container" slot="container"></slot>
    </${this.fieldTag}>`}renderLeadingIcon(){return l`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `}renderTrailingIcon(){return l`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `}renderInputOrTextarea(){const e={direction:this.textDirection},t=this.ariaLabel||this.label||p,o=this.autocomplete,i=(this.maxLength??-1)>-1,s=(this.minLength??-1)>-1;if(this.type==="textarea")return l`
        <textarea
          class="input"
          style=${Oe(e)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${t}
          autocomplete=${o||p}
          name=${this.name||p}
          ?disabled=${this.disabled}
          maxlength=${i?this.maxLength:p}
          minlength=${s?this.minLength:p}
          placeholder=${this.placeholder||p}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          rows=${this.rows}
          cols=${this.cols}
          .value=${ir(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent}></textarea>
      `;const a=this.renderPrefix(),h=this.renderSuffix(),c=this.inputMode;return l`
      <div class="input-wrapper">
        ${a}
        <input
          class="input"
          style=${Oe(e)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${t}
          autocomplete=${o||p}
          name=${this.name||p}
          ?disabled=${this.disabled}
          inputmode=${c||p}
          max=${this.max||p}
          maxlength=${i?this.maxLength:p}
          min=${this.min||p}
          minlength=${s?this.minLength:p}
          pattern=${this.pattern||p}
          placeholder=${this.placeholder||p}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          ?multiple=${this.multiple}
          step=${this.step||p}
          type=${this.type}
          .value=${ir(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent} />
        ${h}
      </div>
    `}renderPrefix(){return this.renderAffix(this.prefixText,!1)}renderSuffix(){return this.renderAffix(this.suffixText,!0)}renderAffix(e,t){return e?l`<span class="${F({suffix:t,prefix:!t})}">${e}</span>`:p}getErrorText(){return this.error?this.errorText:this.nativeErrorText}handleFocusChange(){this.focused=this.inputOrTextarea?.matches(":focus")??!1}handleInput(e){this.dirty=!0,this.value=e.target.value}redispatchEvent(e){kt(this,e)}getInputOrTextarea(){return this.inputOrTextarea||(this.connectedCallback(),this.scheduleUpdate()),this.isUpdatePending&&this.scheduleUpdate(),this.inputOrTextarea}getInput(){return this.type==="textarea"?null:this.getInputOrTextarea()}handleIconChange(){this.hasLeadingIcon=this.leadingIcons.length>0,this.hasTrailingIcon=this.trailingIcons.length>0}[Ie](){return this.value}formResetCallback(){this.reset()}formStateRestoreCallback(e){this.value=e}focus(){this.getInputOrTextarea().focus()}[We](){return new js(()=>({state:this,renderedControl:this.inputOrTextarea}))}[Ge](){return this.inputOrTextarea}[bt](e){e?.preventDefault();const t=this.getErrorText();this.nativeError=!!e,this.nativeErrorText=this.validationMessage,t===this.getErrorText()&&this.field?.reannounceError()}}w.shadowRootOptions={...b.shadowRootOptions,delegatesFocus:!0};n([d({type:Boolean,reflect:!0})],w.prototype,"error",void 0);n([d({attribute:"error-text"})],w.prototype,"errorText",void 0);n([d()],w.prototype,"label",void 0);n([d({type:Boolean,attribute:"no-asterisk"})],w.prototype,"noAsterisk",void 0);n([d({type:Boolean,reflect:!0})],w.prototype,"required",void 0);n([d()],w.prototype,"value",void 0);n([d({attribute:"prefix-text"})],w.prototype,"prefixText",void 0);n([d({attribute:"suffix-text"})],w.prototype,"suffixText",void 0);n([d({type:Boolean,attribute:"has-leading-icon"})],w.prototype,"hasLeadingIcon",void 0);n([d({type:Boolean,attribute:"has-trailing-icon"})],w.prototype,"hasTrailingIcon",void 0);n([d({attribute:"supporting-text"})],w.prototype,"supportingText",void 0);n([d({attribute:"text-direction"})],w.prototype,"textDirection",void 0);n([d({type:Number})],w.prototype,"rows",void 0);n([d({type:Number})],w.prototype,"cols",void 0);n([d({reflect:!0})],w.prototype,"inputMode",void 0);n([d()],w.prototype,"max",void 0);n([d({type:Number})],w.prototype,"maxLength",void 0);n([d()],w.prototype,"min",void 0);n([d({type:Number})],w.prototype,"minLength",void 0);n([d({type:Boolean,attribute:"no-spinner"})],w.prototype,"noSpinner",void 0);n([d()],w.prototype,"pattern",void 0);n([d({reflect:!0,converter:Ss})],w.prototype,"placeholder",void 0);n([d({type:Boolean,reflect:!0})],w.prototype,"readOnly",void 0);n([d({type:Boolean,reflect:!0})],w.prototype,"multiple",void 0);n([d()],w.prototype,"step",void 0);n([d({reflect:!0})],w.prototype,"type",void 0);n([d({reflect:!0})],w.prototype,"autocomplete",void 0);n([f()],w.prototype,"dirty",void 0);n([f()],w.prototype,"focused",void 0);n([f()],w.prototype,"nativeError",void 0);n([f()],w.prototype,"nativeErrorText",void 0);n([S(".input")],w.prototype,"inputOrTextarea",void 0);n([S(".field")],w.prototype,"field",void 0);n([te({slot:"leading-icon"})],w.prototype,"leadingIcons",void 0);n([te({slot:"trailing-icon"})],w.prototype,"trailingIcons",void 0);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Rs extends w{constructor(){super(...arguments),this.fieldTag=ue`md-outlined-field`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Xr=g`:host{display:inline-flex;outline:none;resize:both;text-align:start;-webkit-tap-highlight-color:rgba(0,0,0,0)}.text-field,.field{width:100%}.text-field{display:inline-flex}.field{cursor:text}.disabled .field{cursor:default}.text-field,.textarea .field{resize:inherit}slot[name=container]{border-radius:inherit}.icon{color:currentColor;display:flex;align-items:center;justify-content:center;fill:currentColor;position:relative}.icon ::slotted(*){display:flex;position:absolute}[has-start] .icon.leading{font-size:var(--_leading-icon-size);height:var(--_leading-icon-size);width:var(--_leading-icon-size)}[has-end] .icon.trailing{font-size:var(--_trailing-icon-size);height:var(--_trailing-icon-size);width:var(--_trailing-icon-size)}.input-wrapper{display:flex}.input-wrapper>*{all:inherit;padding:0}.input{caret-color:var(--_caret-color);overflow-x:hidden;text-align:inherit}.input::placeholder{color:currentColor;opacity:1}.input::-webkit-calendar-picker-indicator{display:none}.input::-webkit-search-decoration,.input::-webkit-search-cancel-button{display:none}@media(forced-colors: active){.input{background:none}}.no-spinner .input::-webkit-inner-spin-button,.no-spinner .input::-webkit-outer-spin-button{display:none}.no-spinner .input[type=number]{-moz-appearance:textfield}:focus-within .input{caret-color:var(--_focus-caret-color)}.error:focus-within .input{caret-color:var(--_error-focus-caret-color)}.text-field:not(.disabled) .prefix{color:var(--_input-text-prefix-color)}.text-field:not(.disabled) .suffix{color:var(--_input-text-suffix-color)}.text-field:not(.disabled) .input::placeholder{color:var(--_input-text-placeholder-color)}.prefix,.suffix{text-wrap:nowrap;width:min-content}.prefix{padding-inline-end:var(--_input-text-prefix-trailing-space)}.suffix{padding-inline-start:var(--_input-text-suffix-leading-space)}
`;Xr.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let oo=class extends Rs{constructor(){super(...arguments),this.fieldTag=ue`md-outlined-field`}};oo.styles=[Xr,Kr];oo=n([x("md-outlined-text-field")],oo);/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ds extends b{render(){return l`<slot></slot>`}connectedCallback(){if(super.connectedCallback(),this.getAttribute("aria-hidden")==="false"){this.removeAttribute("aria-hidden");return}this.setAttribute("aria-hidden","true")}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Zr=g`:host{font-size:var(--md-icon-size, 24px);width:var(--md-icon-size, 24px);height:var(--md-icon-size, 24px);color:inherit;font-variation-settings:inherit;font-weight:400;font-family:var(--md-icon-font, Material Symbols Outlined);display:inline-flex;font-style:normal;place-items:center;place-content:center;line-height:1;overflow:hidden;letter-spacing:normal;text-transform:none;user-select:none;white-space:nowrap;word-wrap:normal;flex-shrink:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale}::slotted(svg){fill:currentColor}::slotted(*){height:100%;width:100%}
`;Zr.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let ro=class extends Ds{};ro.styles=[Zr];ro=n([x("md-icon")],ro);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Ms=oe(b);class ze extends Ms{constructor(){super(...arguments),this.value=0,this.max=1,this.indeterminate=!1,this.fourColor=!1}render(){const{ariaLabel:e}=this;return l`
      <div
        class="progress ${F(this.getRenderClasses())}"
        role="progressbar"
        aria-label="${e||p}"
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.indeterminate?p:this.value}
        >${this.renderIndicator()}</div
      >
    `}getRenderClasses(){return{indeterminate:this.indeterminate,"four-color":this.fourColor}}}n([d({type:Number})],ze.prototype,"value",void 0);n([d({type:Number})],ze.prototype,"max",void 0);n([d({type:Boolean})],ze.prototype,"indeterminate",void 0);n([d({type:Boolean,attribute:"four-color"})],ze.prototype,"fourColor",void 0);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Ls extends ze{renderIndicator(){return this.indeterminate?this.renderIndeterminateContainer():this.renderDeterminateContainer()}renderDeterminateContainer(){const e=(1-this.value/this.max)*100;return l`
      <svg viewBox="0 0 4800 4800">
        <circle class="track" pathLength="100"></circle>
        <circle
          class="active-track"
          pathLength="100"
          stroke-dashoffset=${e}></circle>
      </svg>
    `}renderIndeterminateContainer(){return l` <div class="spinner">
      <div class="left">
        <div class="circle"></div>
      </div>
      <div class="right">
        <div class="circle"></div>
      </div>
    </div>`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Jr=g`:host{--_active-indicator-color: var(--md-circular-progress-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-width: var(--md-circular-progress-active-indicator-width, 10);--_four-color-active-indicator-four-color: var(--md-circular-progress-four-color-active-indicator-four-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_four-color-active-indicator-one-color: var(--md-circular-progress-four-color-active-indicator-one-color, var(--md-sys-color-primary, #6750a4));--_four-color-active-indicator-three-color: var(--md-circular-progress-four-color-active-indicator-three-color, var(--md-sys-color-tertiary, #7d5260));--_four-color-active-indicator-two-color: var(--md-circular-progress-four-color-active-indicator-two-color, var(--md-sys-color-primary-container, #eaddff));--_size: var(--md-circular-progress-size, 48px);display:inline-flex;vertical-align:middle;width:var(--_size);height:var(--_size);position:relative;align-items:center;justify-content:center;contain:strict;content-visibility:auto}.progress{flex:1;align-self:stretch;margin:4px}.progress,.spinner,.left,.right,.circle,svg,.track,.active-track{position:absolute;inset:0}svg{transform:rotate(-90deg)}circle{cx:50%;cy:50%;r:calc(50%*(1 - var(--_active-indicator-width)/100));stroke-width:calc(var(--_active-indicator-width)*1%);stroke-dasharray:100;fill:rgba(0,0,0,0)}.active-track{transition:stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);stroke:var(--_active-indicator-color)}.track{stroke:rgba(0,0,0,0)}.progress.indeterminate{animation:linear infinite linear-rotate;animation-duration:1568.2352941176ms}.spinner{animation:infinite both rotate-arc;animation-duration:5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.left{overflow:hidden;inset:0 50% 0 0}.right{overflow:hidden;inset:0 0 0 50%}.circle{box-sizing:border-box;border-radius:50%;border:solid calc(var(--_active-indicator-width)/100*(var(--_size) - 8px));border-color:var(--_active-indicator-color) var(--_active-indicator-color) rgba(0,0,0,0) rgba(0,0,0,0);animation:expand-arc;animation-iteration-count:infinite;animation-fill-mode:both;animation-duration:1333ms,5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.four-color .circle{animation-name:expand-arc,four-color}.left .circle{rotate:135deg;inset:0 -100% 0 0}.right .circle{rotate:100deg;inset:0 0 0 -100%;animation-delay:-666.5ms,0ms}@media(forced-colors: active){.active-track{stroke:CanvasText}.circle{border-color:CanvasText CanvasText Canvas Canvas}}@keyframes expand-arc{0%{transform:rotate(265deg)}50%{transform:rotate(130deg)}100%{transform:rotate(265deg)}}@keyframes rotate-arc{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}@keyframes linear-rotate{to{transform:rotate(360deg)}}@keyframes four-color{0%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}15%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}25%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}40%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}50%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}65%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}75%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}90%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}100%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}}
`;Jr.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let io=class extends Ls{};io.styles=[Jr];io=n([x("md-circular-progress")],io);var Bs=Object.defineProperty,Ns=Object.getOwnPropertyDescriptor,it=(r,e,t,o)=>{for(var i=o>1?void 0:o?Ns(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&Bs(e,t,i),i};let $e=class extends b{constructor(){super(...arguments),this.currentListing=null,this.loading=!1,this.errorMessage=""}connectedCallback(){super.connectedCallback(),this.loadDirectory(this.initialPath)}async loadDirectory(r){this.loading=!0,this.errorMessage="";try{this.currentListing=await I.fetchDirectories(r),this.dispatchEvent(new CustomEvent("folder-browsed",{detail:{path:this.currentListing.current,name:this.currentListing.name},bubbles:!0,composed:!0}))}catch(e){this.errorMessage=e?.message||"Failed to load directories"}finally{this.loading=!1}}handleSelect(){this.currentListing&&this.dispatchEvent(new CustomEvent("folder-selected",{detail:{path:this.currentListing.current,name:this.currentListing.name},bubbles:!0,composed:!0}))}render(){return l`
      ${this.errorMessage?l`<div class="error-container">${this.errorMessage}</div>`:""}

      <!-- Breadcrumbs -->
      ${this.currentListing?l`
            <div class="breadcrumbs">
              ${this.currentListing.parent?l`
                    <button
                      class="crumb-btn"
                      @click=${()=>this.loadDirectory(this.currentListing.parent)}
                      title="Go up one level"
                    >
                      <md-icon class="material-symbols-outlined">arrow_upward</md-icon>
                    </button>
                    <span class="crumb-separator">|</span>
                  `:""}
              ${this.currentListing.breadcrumbs.map((r,e)=>l`
                  <button
                    class="crumb-btn"
                    @click=${()=>this.loadDirectory(r.path)}
                  >
                    ${r.name}
                  </button>
                  ${e<this.currentListing.breadcrumbs.length-1?l`<span class="crumb-separator">/</span>`:""}
                `)}
            </div>
          `:""}

      <!-- Folder list -->
      <div class="folder-list">
        ${this.loading?l`
              <div class="loading-container">
                <md-circular-progress indeterminate></md-circular-progress>
              </div>
            `:this.currentListing?.directories.length===0?l`<div class="empty-state">No subdirectories found</div>`:this.currentListing?.directories.map(r=>l`
                <div
                  class="folder-item"
                  @click=${()=>this.loadDirectory(r.path)}
                >
                  <md-icon class="material-symbols-outlined">folder</md-icon>
                  <span>${r.name}</span>
                </div>
              `)}
      </div>

      <!-- Action -->
      <div class="actions">
        <md-filled-button
          @click=${this.handleSelect}
          ?disabled=${this.loading||!this.currentListing}
        >
          <md-icon slot="icon" class="material-symbols-outlined">check</md-icon>
          Select Current Folder
        </md-filled-button>
      </div>
    `}};$e.styles=g`
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
      font-family: var(--md-sys-typescale-body-font);
      max-height: 400px;
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px;
      padding: 8px 12px;
      background-color: var(--md-sys-color-surface-container-low);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: 0.85rem;
    }

    .crumb-btn {
      background: none;
      border: none;
      color: var(--md-sys-color-primary);
      cursor: pointer;
      font-size: 0.85rem;
      padding: 2px 4px;
      border-radius: 4px;
    }

    .crumb-btn:hover {
      background-color: var(--md-sys-color-surface-container-highest);
      text-decoration: underline;
    }

    .crumb-separator {
      color: var(--md-sys-color-outline);
    }

    .folder-list {
      flex: 1;
      overflow-y: auto;
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-small);
      min-height: 180px;
      max-height: 250px;
      background-color: var(--md-sys-color-surface);
    }

    .folder-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      cursor: pointer;
      border-bottom: 1px solid var(--md-sys-color-surface-container-high);
      transition: background-color 0.15s;
      font-size: 0.9rem;
      color: var(--md-sys-color-on-surface);
    }

    .folder-item:hover {
      background-color: var(--md-sys-color-surface-container);
    }

    .folder-item md-icon {
      color: var(--md-sys-color-primary);
      font-size: 20px;
    }

    .empty-state {
      padding: 32px;
      text-align: center;
      color: var(--md-sys-color-outline);
      font-size: 0.85rem;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 180px;
    }

    .error-container {
      padding: 12px;
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: 0.85rem;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
  `;it([d({type:String})],$e.prototype,"initialPath",2);it([f()],$e.prototype,"currentListing",2);it([f()],$e.prototype,"loading",2);it([f()],$e.prototype,"errorMessage",2);$e=it([x("folder-picker")],$e);var Fs=Object.defineProperty,Us=Object.getOwnPropertyDescriptor,Ee=(r,e,t,o)=>{for(var i=o>1?void 0:o?Us(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&Fs(e,t,i),i};let ae=class extends b{constructor(){super(...arguments),this.open=!1,this.project=null,this.projectName="",this.selectedPath="",this.errorMessage="",this.saving=!1}updated(r){r.has("open")&&this.open&&(this.projectName=this.project?.name||"",this.selectedPath=this.project?.path||"",this.errorMessage="",this.saving=!1),r.has("project")&&this.project&&(this.projectName||(this.projectName=this.project.name),this.selectedPath||(this.selectedPath=this.project.path))}close(){this.handleClose()}handleClose(){this.open=!1,this.dispatchEvent(new CustomEvent("dialog-closed",{bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}handleFolderBrowsed(r){this.selectedPath=r.detail.path}handleFolderSelected(r){this.selectedPath=r.detail.path}async handleSave(){if(!this.project)return;const r=this.projectName.trim(),e=this.selectedPath.trim();if(!r||!e){this.errorMessage="Please provide both project name and directory path.";return}this.saving=!0,this.errorMessage="";try{await y.editProject(this.project.id,r,e),this.handleClose()}catch(t){this.errorMessage=t?.message||"Failed to update project"}finally{this.saving=!1}}render(){return l`
      <md-dialog ?open=${this.open} @closed=${this.handleClose}>
        <div slot="headline">
          <span>Edit Project</span>
        </div>

        <div slot="content" class="dialog-content">
          ${this.errorMessage?l`<div class="error-box">${this.errorMessage}</div>`:""}

          <div class="field-group">
            <md-outlined-text-field
              label="Project Display Name"
              .value=${this.projectName}
              @input=${r=>this.projectName=r.target.value}
            ></md-outlined-text-field>
          </div>

          <div class="field-group">
            <span class="field-label">Project Directory</span>
            <folder-picker
              .initialPath=${this.selectedPath}
              @folder-browsed=${this.handleFolderBrowsed}
              @folder-selected=${this.handleFolderSelected}
            ></folder-picker>
          </div>

          ${this.selectedPath?l`
                <div class="field-group">
                  <span class="field-label">Selected Directory</span>
                  <div class="selected-path-card">${this.selectedPath}</div>
                </div>
              `:""}
        </div>

        <div slot="actions">
          <md-text-button @click=${this.handleClose} ?disabled=${this.saving}>
            Cancel
          </md-text-button>
          <md-filled-button
            @click=${this.handleSave}
            ?disabled=${!this.projectName||!this.selectedPath||this.saving}
          >
            Save Changes
          </md-filled-button>
        </div>
      </md-dialog>
    `}};ae.styles=g`
    :host {
      display: block;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 320px;
      max-width: 540px;
    }

    @media (min-width: 600px) {
      .dialog-content {
        min-width: 480px;
      }
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--md-sys-color-on-surface-variant);
    }

    .selected-path-card {
      padding: 10px 14px;
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-family: var(--md-sys-typescale-code-font);
      font-size: 0.8rem;
      word-break: break-all;
    }

    .error-box {
      padding: 10px 14px;
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: 0.85rem;
      white-space: pre-wrap;
    }
  `;Ee([d({type:Boolean})],ae.prototype,"open",2);Ee([d({type:Object})],ae.prototype,"project",2);Ee([f()],ae.prototype,"projectName",2);Ee([f()],ae.prototype,"selectedPath",2);Ee([f()],ae.prototype,"errorMessage",2);Ee([f()],ae.prototype,"saving",2);ae=Ee([x("edit-project-dialog")],ae);var qs=Object.defineProperty,Hs=Object.getOwnPropertyDescriptor,st=(r,e,t,o)=>{for(var i=o>1?void 0:o?Hs(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&qs(e,t,i),i};let Ce=class extends b{constructor(){super(...arguments),this.open=!1,this.project=null,this.errorMessage="",this.deleting=!1}updated(r){r.has("open")&&this.open&&(this.errorMessage="",this.deleting=!1)}close(){this.handleClose()}handleClose(){this.open=!1,this.dispatchEvent(new CustomEvent("dialog-closed",{bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}async handleDelete(){if(this.project){this.deleting=!0,this.errorMessage="";try{await y.deleteProject(this.project.id),this.handleClose()}catch(r){this.errorMessage=r?.message||"Failed to delete project"}finally{this.deleting=!1}}}render(){return this.project?l`
      <md-dialog ?open=${this.open} @closed=${this.handleClose}>
        <div slot="headline">
          <span>Delete Project</span>
        </div>

        <div slot="content" class="dialog-content">
          ${this.errorMessage?l`<div class="error-box">${this.errorMessage}</div>`:""}

          <p class="warning-text">
            Are you sure you want to remove project
            <strong>"${this.project.name}"</strong> from Agent Hub?
          </p>
          <p class="warning-text" style="color: var(--md-sys-color-outline); font-size: 0.85rem;">
            Project files on disk will <strong>not</strong> be deleted.
          </p>
        </div>

        <div slot="actions">
          <md-text-button @click=${this.handleClose} ?disabled=${this.deleting}>
            Cancel
          </md-text-button>
          <md-filled-button
            class="delete-btn"
            @click=${this.handleDelete}
            ?disabled=${this.deleting}
          >
            Delete Project
          </md-filled-button>
        </div>
      </md-dialog>
    `:l``}};Ce.styles=g`
    :host {
      display: block;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 280px;
      max-width: 480px;
    }

    .warning-text {
      font-size: 0.9375rem;
      color: var(--md-sys-color-on-surface);
      line-height: 1.4;
    }

    .error-box {
      padding: 10px 14px;
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: 0.85rem;
      white-space: pre-wrap;
    }

    .delete-btn {
      --md-filled-button-container-color: var(--md-sys-color-error);
      --md-filled-button-label-text-color: var(--md-sys-color-on-error);
    }
  `;st([d({type:Boolean})],Ce.prototype,"open",2);st([d({type:Object})],Ce.prototype,"project",2);st([f()],Ce.prototype,"errorMessage",2);st([f()],Ce.prototype,"deleting",2);Ce=st([x("delete-project-dialog")],Ce);var Vs=Object.defineProperty,Ws=Object.getOwnPropertyDescriptor,Re=(r,e,t,o)=>{for(var i=o>1?void 0:o?Ws(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&Vs(e,t,i),i};let me=class extends b{constructor(){super(...arguments),this.openMenuId=null,this.editingProject=null,this.isEditDialogOpen=!1,this.deletingProject=null,this.isDeleteDialogOpen=!1}connectedCallback(){super.connectedCallback(),this.unsubscribeStore=y.subscribe(()=>{this.requestUpdate()})}disconnectedCallback(){this.unsubscribeStore&&this.unsubscribeStore(),super.disconnectedCallback()}openNewProjectDialog(){this.dispatchEvent(new CustomEvent("open-new-project",{bubbles:!0,composed:!0}))}handleProjectClick(r){W.navigate(`/projects/${r.id}`)}render(){const{projects:r,chatsByProject:e}=y;return l`
      <div class="container">
        <div class="header">
          <div class="title-group">
            <h1>Projects</h1>
            <p>Manage code repositories and active ACP agent sessions</p>
          </div>
          <md-filled-button @click=${this.openNewProjectDialog}>
            <span class="icon" slot="icon" style="font-size: 20px;">add</span>
            New Project
          </md-filled-button>
        </div>

        ${r.length===0?l`
              <div class="empty-state">
                <div class="empty-icon">
                  <span class="icon" style="font-size: 32px;">folder_open</span>
                </div>
                <h2 class="empty-title">No projects yet</h2>
                <p class="empty-desc">
                  Create a project by selecting an existing directory on your
                  server or cloning a Git repository.
                </p>
                <md-filled-button @click=${this.openNewProjectDialog}>
                  <span class="icon" slot="icon" style="font-size: 20px;">add</span>
                  Create Your First Project
                </md-filled-button>
              </div>
            `:l`
              <div class="grid">
                ${r.map(t=>{const o=e[t.id]||[],i=t.chat_count!==void 0?t.chat_count:o.length;return l`
                    <div
                      class="project-card"
                      @click=${()=>this.handleProjectClick(t)}
                    >
                      <div class="card-top">
                        <div class="card-icon">
                          <span class="icon">folder</span>
                        </div>
                        <div class="card-details">
                          <h2 class="card-title">${t.name}</h2>
                          <div class="card-path" title=${t.path}>
                            ${t.path}
                          </div>
                        </div>
                        <div
                          class="menu-anchor"
                          @click=${s=>s.stopPropagation()}
                        >
                          <md-icon-button
                            id="menu-trigger-${t.id}"
                            @click=${()=>this.openMenuId=this.openMenuId===t.id?null:t.id}
                          >
                            <span class="icon">more_vert</span>
                          </md-icon-button>
                          <md-menu
                            anchor="menu-trigger-${t.id}"
                            .open=${this.openMenuId===t.id}
                            @closed=${()=>this.openMenuId=null}
                          >
                            <md-menu-item
                              @click=${()=>{this.editingProject=t,this.isEditDialogOpen=!0,this.openMenuId=null}}
                            >
                              <div slot="headline">Edit Project</div>
                            </md-menu-item>
                            <md-menu-item
                              @click=${()=>{this.deletingProject=t,this.isDeleteDialogOpen=!0,this.openMenuId=null}}
                            >
                              <div
                                slot="headline"
                                style="color: var(--md-sys-color-error)"
                              >
                                Delete Project
                              </div>
                            </md-menu-item>
                          </md-menu>
                        </div>
                      </div>

                      <div class="card-meta">
                        <span class="chat-count">
                          <span class="icon" style="font-size: 16px;">chat</span>
                          ${i} chat${i===1?"":"s"}
                        </span>
                        <span style="font-size: 0.75rem; color: var(--md-sys-color-outline)">
                          ${new Date(t.updated_at||t.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  `})}
              </div>
            `}
      </div>

      <div class="fab-container">
        <md-fab
          label="New Project"
          @click=${this.openNewProjectDialog}
        >
          <span class="icon" slot="icon">add</span>
        </md-fab>
      </div>

      <!-- Edit Project Dialog -->
      <edit-project-dialog
        .open=${this.isEditDialogOpen}
        .project=${this.editingProject}
        @dialog-closed=${()=>this.isEditDialogOpen=!1}
        @close=${()=>this.isEditDialogOpen=!1}
      ></edit-project-dialog>

      <!-- Delete Project Dialog -->
      <delete-project-dialog
        .open=${this.isDeleteDialogOpen}
        .project=${this.deletingProject}
        @dialog-closed=${()=>this.isDeleteDialogOpen=!1}
        @close=${()=>this.isDeleteDialogOpen=!1}
      ></delete-project-dialog>
    `}};me.styles=g`
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
      padding: 24px;
      box-sizing: border-box;
      background-color: var(--md-sys-color-background);
    }

    .container {
      max-width: 1080px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .title-group h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--md-sys-color-on-background);
    }

    .title-group p {
      margin: 4px 0 0;
      font-size: 0.9375rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .project-card {
      background-color: var(--md-sys-color-surface-container);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-large, 16px);
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
      position: relative;
    }

    .project-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--md-sys-elevation-level2);
      border-color: var(--md-sys-color-primary);
    }

    .card-top {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 12px;
    }

    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .card-details {
      min-width: 0;
      flex: 1;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-path {
      font-size: 0.8125rem;
      color: var(--md-sys-color-outline);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: monospace;
    }

    .menu-anchor {
      position: relative;
    }

    .card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.8125rem;
      color: var(--md-sys-color-on-surface-variant);
      padding-top: 12px;
      border-top: 1px solid var(--md-sys-color-outline-variant);
    }

    .chat-count {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 16px;
      text-align: center;
      background-color: var(--md-sys-color-surface-container-low);
      border-radius: 20px;
      border: 1px dashed var(--md-sys-color-outline-variant);
      margin-top: 32px;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: var(--md-sys-color-surface-container-high);
      color: var(--md-sys-color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      margin: 0 0 8px;
    }

    .empty-desc {
      font-size: 0.9375rem;
      color: var(--md-sys-color-on-surface-variant);
      max-width: 440px;
      margin: 0 0 24px;
      line-height: 1.4;
    }

    .fab-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 10;
      display: none;
    }

    @media (max-width: 600px) {
      .fab-container {
        display: block;
      }
      .header md-filled-button {
        display: none;
      }
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }
  `;Re([f()],me.prototype,"openMenuId",2);Re([f()],me.prototype,"editingProject",2);Re([f()],me.prototype,"isEditDialogOpen",2);Re([f()],me.prototype,"deletingProject",2);Re([f()],me.prototype,"isDeleteDialogOpen",2);me=Re([x("project-list")],me);var Gs=Object.defineProperty,Ks=Object.getOwnPropertyDescriptor,ke=(r,e,t,o)=>{for(var i=o>1?void 0:o?Ks(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&Gs(e,t,i),i};let ne=class extends b{constructor(){super(...arguments),this.chat=null,this.isConfigOpen=!1,this.isRenameOpen=!1,this.renameText="",this.isMenuOpen=!1,this.isDeleteDialogOpen=!1}toggleNavDrawer(){y.isMobileDrawerOpen=!y.isMobileDrawerOpen}toggleConfig(){this.dispatchEvent(new CustomEvent("toggle-config",{bubbles:!0,composed:!0}))}openRename(){this.chat&&(this.renameText=this.chat.title,this.isRenameOpen=!0)}async handleRenameSubmit(){this.chat&&this.renameText.trim()&&(await y.renameChat(this.chat.id,this.renameText.trim()),this.isRenameOpen=!1)}async handleStop(){this.chat&&await y.stopChatProcess(this.chat.id)}async handleReconnect(){this.chat&&await y.connectChat(this.chat.id)}async handleToggleArchive(){this.chat&&await y.archiveChat(this.chat.id,!this.chat.archived)}handleDelete(){this.isDeleteDialogOpen=!0}async handleConfirmDelete(){this.chat&&(await y.deleteChat(this.chat.id),this.isDeleteDialogOpen=!1)}render(){if(!this.chat)return l`
        <div class="header-container">
          <div class="left-section">
            <md-icon-button class="nav-toggle" @click=${this.toggleNavDrawer}>
              <span class="icon">menu</span>
            </md-icon-button>
            <span style="color: var(--md-sys-color-outline)">No chat selected</span>
          </div>
        </div>
      `;const{title:r,agent:e,process_state:t,turn_state:o,archived:i}=this.chat,s=t==="RUNNING",a=o==="PROMPTING";return l`
      <div class="header-container">
        <div class="left-section">
          <md-icon-button class="nav-toggle" @click=${this.toggleNavDrawer}>
            <span class="icon">menu</span>
          </md-icon-button>

          <div class="title-area">
            <div class="title-row">
              <span class="chat-title" @click=${this.openRename} title="Click to rename">
                ${r||"Untitled chat"}
              </span>
              ${i?l`<span class="badge stopped">Archived</span>`:null}
            </div>

            <div class="badges">
              <span class="badge agent">${e}</span>
              ${a?l`<span class="badge prompting">Thinking...</span>`:null}
              <span
                class="badge ${s?"running":t==="DEAD"?"dead":"stopped"}"
              >
                <span
                  class="status-dot ${s?"running":t==="DEAD"?"dead":"stopped"}"
                ></span>
                ${t||"STOPPED"}
              </span>
            </div>
          </div>
        </div>

        <div class="right-section">
          ${s?l`
                <md-icon-button
                  title="Stop Process"
                  @click=${this.handleStop}
                >
                  <span class="icon">pause_circle</span>
                </md-icon-button>
              `:l`
                <md-icon-button
                  title="Reconnect Process"
                  @click=${this.handleReconnect}
                >
                  <span class="icon">play_circle</span>
                </md-icon-button>
              `}

          <md-icon-button
            title="Chat Configuration"
            @click=${this.toggleConfig}
          >
            <span class="icon">tune</span>
          </md-icon-button>

          <div class="menu-anchor">
            <md-icon-button
              id="menu-trigger"
              @click=${()=>this.isMenuOpen=!this.isMenuOpen}
            >
              <span class="icon">more_vert</span>
            </md-icon-button>

            <md-menu
              id="header-menu"
              anchor="menu-trigger"
              .open=${this.isMenuOpen}
              @closed=${()=>this.isMenuOpen=!1}
            >
              <md-menu-item @click=${this.openRename}>
                <div slot="headline">Rename Chat</div>
              </md-menu-item>
              ${s?l`
                    <md-menu-item @click=${this.handleStop}>
                      <div slot="headline">Stop Process</div>
                    </md-menu-item>
                  `:l`
                    <md-menu-item @click=${this.handleReconnect}>
                      <div slot="headline">Reconnect ACP</div>
                    </md-menu-item>
                  `}
              <md-menu-item @click=${this.handleToggleArchive}>
                <div slot="headline">
                  ${i?"Unarchive Chat":"Archive Chat"}
                </div>
              </md-menu-item>
              <md-menu-item @click=${this.handleDelete}>
                <div slot="headline" style="color: var(--md-sys-color-error)">
                  Delete Chat
                </div>
              </md-menu-item>
            </md-menu>
          </div>
        </div>
      </div>

      <!-- Rename Dialog -->
      <md-dialog
        .open=${this.isRenameOpen}
        @closed=${()=>this.isRenameOpen=!1}
      >
        <div slot="headline">Rename Chat</div>
        <form slot="content" id="rename-form" method="dialog">
          <md-outlined-text-field
            label="Chat Title"
            .value=${this.renameText}
            @input=${h=>this.renameText=h.target.value}
            style="width: 100%;"
            autofocus
          ></md-outlined-text-field>
        </form>
        <div slot="actions">
          <md-text-button @click=${()=>this.isRenameOpen=!1}>
            Cancel
          </md-text-button>
          <md-filled-button @click=${this.handleRenameSubmit}>
            Save
          </md-filled-button>
        </div>
      </md-dialog>

      <!-- Delete Chat Dialog -->
      <md-dialog
        .open=${this.isDeleteDialogOpen}
        @closed=${()=>this.isDeleteDialogOpen=!1}
      >
        <div slot="headline">Delete Chat</div>
        <div slot="content">
          Are you sure you want to delete "${this.chat.title||"this chat"}"? This action cannot be undone.
        </div>
        <div slot="actions">
          <md-text-button @click=${()=>this.isDeleteDialogOpen=!1}>
            Cancel
          </md-text-button>
          <md-filled-button class="delete-btn" @click=${this.handleConfirmDelete}>
            Delete
          </md-filled-button>
        </div>
      </md-dialog>
    `}};ne.styles=g`
    :host {
      display: block;
      background-color: var(--md-sys-color-surface-container);
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      padding: 8px 16px;
      height: 64px;
      box-sizing: border-box;
    }

    .delete-btn {
      --md-filled-button-container-color: var(--md-sys-color-error);
      --md-filled-button-label-text-color: var(--md-sys-color-on-error);
    }

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      gap: 12px;
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      flex: 1;
    }

    .nav-toggle {
      display: none;
    }

    @media (max-width: 839px) {
      .nav-toggle {
        display: inline-flex;
      }
    }

    .title-area {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .chat-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }

    .chat-title:hover {
      text-decoration: underline;
    }

    .badges {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 2px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 1px 6px;
      border-radius: 6px;
      font-size: 0.6875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .badge.agent {
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
    }

    .badge.running {
      background-color: #e6f4ea;
      color: #137333;
    }

    .badge.stopped {
      background-color: #f1f3f4;
      color: #5f6368;
    }

    .badge.dead {
      background-color: #fce8e6;
      color: #c5221f;
    }

    .badge.prompting {
      background-color: #e8f0fe;
      color: #1a73e8;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
    }

    .status-dot.running {
      background-color: #34a853;
    }

    .status-dot.stopped {
      background-color: #9aa0a6;
    }

    .status-dot.dead {
      background-color: #ea4335;
    }

    .menu-anchor {
      position: relative;
    }
  `;ke([d({type:Object})],ne.prototype,"chat",2);ke([d({type:Boolean})],ne.prototype,"isConfigOpen",2);ke([f()],ne.prototype,"isRenameOpen",2);ke([f()],ne.prototype,"renameText",2);ke([f()],ne.prototype,"isMenuOpen",2);ke([f()],ne.prototype,"isDeleteDialogOpen",2);ne=ke([x("chat-header")],ne);var Ys=Object.defineProperty,Xs=Object.getOwnPropertyDescriptor,Io=(r,e,t,o)=>{for(var i=o>1?void 0:o?Xs(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&Ys(e,t,i),i};let Ke=class extends b{constructor(){super(...arguments),this.expanded=!1}render(){if(!this.tool)return l``;const r=!!this.tool.output,e=`status-${(this.tool.status||"in_progress").toLowerCase()}`;return l`
      <div class="tool-card">
        <div
          class="tool-header"
          @click=${()=>r?this.expanded=!this.expanded:null}
        >
          <div class="tool-title">
            <md-icon class="material-symbols-outlined">build</md-icon>
            <span>${this.tool.title}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="status-badge ${e}">
              ${this.tool.status}
            </span>
            ${r?l`
                  <md-icon class="material-symbols-outlined chevron ${this.expanded?"expanded":""}">
                    expand_more
                  </md-icon>
                `:""}
          </div>
        </div>

        ${r&&this.expanded?l`<div class="tool-output">${this.tool.output}</div>`:""}
      </div>
    `}};Ke.styles=g`
    :host {
      display: block;
      margin: 4px 0;
    }

    .tool-card {
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-small);
      background-color: var(--md-sys-color-surface-container-low);
      overflow: hidden;
      font-size: 0.85rem;
    }

    .tool-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      cursor: pointer;
      user-select: none;
      background-color: var(--md-sys-color-surface-container);
    }

    .tool-header:hover {
      background-color: var(--md-sys-color-surface-container-high);
    }

    .tool-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: var(--md-sys-color-on-surface);
    }

    .tool-title md-icon {
      font-size: 18px;
      color: var(--md-sys-color-primary);
    }

    .status-badge {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 999px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .status-in_progress {
      background-color: var(--status-starting-container);
      color: var(--status-starting);
    }

    .status-success, .status-completed {
      background-color: var(--status-running-container);
      color: var(--status-running);
    }

    .status-error, .status-failed {
      background-color: var(--status-dead-container);
      color: var(--status-dead);
    }

    .tool-output {
      padding: 10px 12px;
      font-family: var(--md-sys-typescale-code-font);
      font-size: 0.8rem;
      white-space: pre-wrap;
      word-break: break-all;
      background-color: var(--md-sys-color-surface-container-lowest);
      border-top: 1px solid var(--md-sys-color-outline-variant);
      max-height: 250px;
      overflow-y: auto;
      color: var(--md-sys-color-on-surface);
    }

    .chevron {
      transition: transform 0.2s ease;
      font-size: 18px;
      color: var(--md-sys-color-outline);
    }

    .chevron.expanded {
      transform: rotate(180deg);
    }
  `;Io([d({type:Object})],Ke.prototype,"tool",2);Io([f()],Ke.prototype,"expanded",2);Ke=Io([x("tool-call-view")],Ke);var Zs=Object.defineProperty,Js=Object.getOwnPropertyDescriptor,Qr=(r,e,t,o)=>{for(var i=o>1?void 0:o?Js(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&Zs(e,t,i),i};let yt=class extends b{constructor(){super(...arguments),this.entries=[]}renderStatusIcon(r){return r==="completed"?l`<span class="icon completed">check_circle</span>`:r==="in_progress"?l`<span class="icon in_progress">progress_activity</span>`:l`<span class="icon pending">radio_button_unchecked</span>`}render(){return!this.entries||this.entries.length===0?l``:l`
      <div class="plan-card">
        <div class="plan-header">
          <span class="icon">format_list_bulleted</span>
          <span>Execution Plan</span>
        </div>
        <ul class="plan-list">
          ${this.entries.map(r=>l`
              <li class="plan-item">
                ${this.renderStatusIcon(r.status)}
                <span class="content ${r.status}">${r.content}</span>
              </li>
            `)}
        </ul>
      </div>
    `}};yt.styles=g`
    :host {
      display: block;
      margin: 8px 0;
    }

    .plan-card {
      background-color: var(--md-sys-color-surface-container);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      padding: 12px 16px;
    }

    .plan-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--md-sys-color-primary);
    }

    .plan-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .plan-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.875rem;
      line-height: 1.4;
      color: var(--md-sys-color-on-surface);
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 18px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
      display: inline-block;
      margin-top: 1px;
      flex-shrink: 0;
    }

    .icon.completed {
      color: var(--hub-status-running, #34a853);
    }

    .icon.in_progress {
      color: var(--md-sys-color-primary);
      animation: spin 1.5s linear infinite;
    }

    .icon.pending {
      color: var(--md-sys-color-outline);
    }

    .content.completed {
      text-decoration: line-through;
      color: var(--md-sys-color-on-surface-variant);
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;Qr([d({type:Array})],yt.prototype,"entries",2);yt=Qr([x("plan-view")],yt);var Qs=Object.defineProperty,ea=Object.getOwnPropertyDescriptor,To=(r,e,t,o)=>{for(var i=o>1?void 0:o?ea(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&Qs(e,t,i),i};let Ye=class extends b{constructor(){super(...arguments),this.chatId=""}handleRespond(r){!this.chatId||!this.permission.requestId||y.respondPermission(this.chatId,this.permission.requestId,r)}render(){if(!this.permission)return l``;const{method:r,description:e,responded:t,decision:o}=this.permission,i=e||r||"Action requested",s=r?` (${r})`:"";return l`
      <div class="card ${t?"responded":""}">
        <div class="header">
          <span class="icon">shield_person</span>
          <span>Permission Request${s}</span>
        </div>

        <div class="tool-details">${i}</div>

        ${t?l`
              <div class="decision-badge">
                <span class="icon" style="font-size: 16px;">check</span>
                <span>Responded: ${o||"Handled"}</span>
              </div>
            `:l`
              <div class="actions">
                <md-outlined-button
                  @click=${()=>this.handleRespond(!1)}
                >
                  Deny
                </md-outlined-button>
                <md-filled-button
                  @click=${()=>this.handleRespond(!0)}
                >
                  Allow
                </md-filled-button>
              </div>
            `}
      </div>
    `}};Ye.styles=g`
    :host {
      display: block;
      margin: 12px 0;
    }

    .card {
      background-color: var(--md-sys-color-surface-container-high);
      border: 1.5px solid var(--md-sys-color-error);
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .card.responded {
      border-color: var(--md-sys-color-outline-variant);
      background-color: var(--md-sys-color-surface-container-low);
      opacity: 0.85;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: var(--md-sys-color-error);
      font-size: 0.9375rem;
    }

    .card.responded .header {
      color: var(--md-sys-color-on-surface-variant);
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }

    .tool-details {
      font-size: 0.875rem;
      background-color: var(--md-sys-color-surface-container-lowest);
      border-radius: 8px;
      padding: 10px 12px;
      font-family: monospace;
      color: var(--md-sys-color-on-surface);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 4px;
    }

    .decision-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8125rem;
      padding: 4px 10px;
      border-radius: 6px;
      background-color: var(--md-sys-color-surface-container-highest);
      color: var(--md-sys-color-on-surface-variant);
      font-weight: 500;
    }
  `;To([d({type:Object})],Ye.prototype,"permission",2);To([d({type:String})],Ye.prototype,"chatId",2);Ye=To([x("permission-card")],Ye);var ta=Object.defineProperty,oa=Object.getOwnPropertyDescriptor,Oo=(r,e,t,o)=>{for(var i=o>1?void 0:o?oa(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&ta(e,t,i),i};let Xe=class extends b{constructor(){super(...arguments),this.chatId=""}formatTime(r){if(!r)return"";try{return new Date(r).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch{return""}}renderUserMessage(r){return l`
      <div class="user-container">
        <div class="user-bubble">${r.text}</div>
        <div class="timestamp" style="margin-top: 4px; padding-right: 4px;">
          ${this.formatTime(r.timestamp)}
        </div>
      </div>
    `}renderTurn(r){const e=r.status==="in_progress",t=r.agent?r.agent[0].toUpperCase():"A";return l`
      <div class="assistant-container">
        <div class="assistant-header">
          <div class="agent-avatar">${t}</div>
          <span class="agent-name">${r.agent}</span>
          <span class="timestamp">${this.formatTime(r.timestamp)}</span>
          ${e?l`
                <span class="status-badge in_progress">
                  <span class="icon spinner">progress_activity</span>
                  <span>Thinking...</span>
                </span>
              `:null}
        </div>

        <div class="assistant-body">
          ${r.entries.map(o=>{switch(o.type){case"thought_chunk":return l`
                  <details class="thought-details">
                    <summary class="thought-summary">
                      <span class="icon">psychology</span>
                      <span>Thought Process</span>
                    </summary>
                    <div class="thought-content">${o.text}</div>
                  </details>
                `;case"tool_call":return l`<tool-call .tool=${o}></tool-call>`;case"plan":return l`<plan-view .entries=${o.entries}></plan-view>`;case"permission_request":return l`
                  <permission-card
                    .permission=${o}
                    .chatId=${this.chatId}
                  ></permission-card>
                `;case"message_chunk":return l`<div class="text-content">${o.text}</div>`;default:return l``}})}
        </div>
      </div>
    `}renderError(r){return l`
      <div class="error-container">
        <span class="icon" style="font-size: 20px;">error</span>
        <span>${r.message}</span>
      </div>
    `}renderStateChange(r){return l`
      <div class="state-change">
        <span class="state-pill">
          Process: ${r.process} · Turn: ${r.turn}
        </span>
      </div>
    `}render(){if(!this.item)return l``;switch(this.item.type){case"user_message":return this.renderUserMessage(this.item);case"turn":return this.renderTurn(this.item);case"error":return this.renderError(this.item);case"state_change":return this.renderStateChange(this.item);default:return l``}}};Xe.styles=g`
    :host {
      display: block;
      margin-bottom: 20px;
    }

    .user-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-left: 20%;
    }

    .user-bubble {
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      padding: 12px 16px;
      border-radius: 16px 16px 4px 16px;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 0.9375rem;
      line-height: 1.5;
      max-width: 100%;
      box-shadow: var(--md-sys-elevation-level1);
    }

    .assistant-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-right: 5%;
      max-width: 100%;
    }

    .assistant-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 0.8125rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .agent-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    .agent-name {
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      text-transform: capitalize;
    }

    .timestamp {
      font-size: 0.75rem;
      color: var(--md-sys-color-outline);
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.6875rem;
      font-weight: 500;
    }

    .status-badge.in_progress {
      background-color: var(--md-sys-color-tertiary-container);
      color: var(--md-sys-color-on-tertiary-container);
    }

    .assistant-body {
      background-color: var(--md-sys-color-surface-container-low);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 4px 16px 16px 16px;
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .thought-details {
      background-color: var(--md-sys-color-surface-container);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 0.875rem;
      color: var(--md-sys-color-on-surface-variant);
      border: 1px dashed var(--md-sys-color-outline-variant);
    }

    .thought-summary {
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      user-select: none;
    }

    .thought-content {
      margin-top: 8px;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: inherit;
      line-height: 1.5;
      font-style: italic;
      color: var(--md-sys-color-on-surface-variant);
      border-top: 1px solid var(--md-sys-color-outline-variant);
      padding-top: 8px;
    }

    .text-content {
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--md-sys-color-on-surface);
    }

    .error-container {
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .state-change {
      display: flex;
      justify-content: center;
      margin: 8px 0;
    }

    .state-pill {
      font-size: 0.75rem;
      padding: 4px 10px;
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      border-radius: 12px;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 16px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
      display: inline-block;
    }

    .spinner {
      animation: spin 1.2s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;Oo([d({type:Object})],Xe.prototype,"item",2);Oo([d({type:String})],Xe.prototype,"chatId",2);Xe=Oo([x("message-turn")],Xe);var ra=Object.defineProperty,ia=Object.getOwnPropertyDescriptor,At=(r,e,t,o)=>{for(var i=o>1?void 0:o?ia(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&ra(e,t,i),i};let je=class extends b{constructor(){super(...arguments),this.items=[],this.chatId="",this.showScrollToBottom=!1,this.isAutoScrollEnabled=!0,this.handleScroll=()=>{const e=this.scrollHeight-this.scrollTop-this.clientHeight;this.isAutoScrollEnabled=e<=80,this.showScrollToBottom=e>200}}connectedCallback(){super.connectedCallback(),this.addEventListener("scroll",this.handleScroll,{passive:!0})}disconnectedCallback(){this.removeEventListener("scroll",this.handleScroll),super.disconnectedCallback()}scrollToBottom(r=!1){this.scrollTo({top:this.scrollHeight,behavior:r?"smooth":"auto"})}updated(r){super.updated(r),r.has("items")&&this.isAutoScrollEnabled&&this.scrollToBottom()}render(){return l`
      <div class="stream-container">
        ${this.items.map(r=>l`
            <message-turn
              .item=${r}
              .chatId=${this.chatId}
            ></message-turn>
          `)}
      </div>

      ${this.showScrollToBottom?l`
            <div class="scroll-fab-container">
              <button
                class="scroll-btn"
                @click=${()=>this.scrollToBottom(!0)}
              >
                <span class="icon">arrow_downward</span>
                <span>Scroll to bottom</span>
              </button>
            </div>
          `:null}
    `}};je.styles=g`
    :host {
      display: block;
      position: relative;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 16px 20px;
      box-sizing: border-box;
      scroll-behavior: smooth;
    }

    .stream-container {
      max-width: 860px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      min-height: 100%;
      justify-content: flex-start;
    }

    .scroll-fab-container {
      position: sticky;
      bottom: 24px;
      display: flex;
      justify-content: center;
      pointer-events: none;
      margin-top: -56px;
      z-index: 10;
    }

    .scroll-btn {
      pointer-events: auto;
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 20px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: var(--md-sys-elevation-level2);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .scroll-btn:hover {
      background-color: var(--md-sys-color-surface-container-high);
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 18px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }
  `;At([d({type:Array})],je.prototype,"items",2);At([d({type:String})],je.prototype,"chatId",2);At([f()],je.prototype,"showScrollToBottom",2);je=At([x("event-stream")],je);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ei=g`:host{--_container-color: var(--md-filled-icon-button-container-color, var(--md-sys-color-primary, #6750a4));--_container-height: var(--md-filled-icon-button-container-height, 40px);--_container-width: var(--md-filled-icon-button-container-width, 40px);--_disabled-container-color: var(--md-filled-icon-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-icon-button-disabled-container-opacity, 0.12);--_disabled-icon-color: var(--md-filled-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-filled-icon-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-filled-icon-button-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-icon-color: var(--md-filled-icon-button-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-color: var(--md-filled-icon-button-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_hover-state-layer-opacity: var(--md-filled-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-filled-icon-button-icon-color, var(--md-sys-color-on-primary, #fff));--_icon-size: var(--md-filled-icon-button-icon-size, 24px);--_pressed-icon-color: var(--md-filled-icon-button-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-color: var(--md-filled-icon-button-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_pressed-state-layer-opacity: var(--md-filled-icon-button-pressed-state-layer-opacity, 0.12);--_selected-container-color: var(--md-filled-icon-button-selected-container-color, var(--md-sys-color-primary, #6750a4));--_toggle-selected-focus-icon-color: var(--md-filled-icon-button-toggle-selected-focus-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-hover-icon-color: var(--md-filled-icon-button-toggle-selected-hover-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-hover-state-layer-color: var(--md-filled-icon-button-toggle-selected-hover-state-layer-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-icon-color: var(--md-filled-icon-button-toggle-selected-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-pressed-icon-color: var(--md-filled-icon-button-toggle-selected-pressed-icon-color, var(--md-sys-color-on-primary, #fff));--_toggle-selected-pressed-state-layer-color: var(--md-filled-icon-button-toggle-selected-pressed-state-layer-color, var(--md-sys-color-on-primary, #fff));--_unselected-container-color: var(--md-filled-icon-button-unselected-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_toggle-focus-icon-color: var(--md-filled-icon-button-toggle-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-hover-icon-color: var(--md-filled-icon-button-toggle-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-hover-state-layer-color: var(--md-filled-icon-button-toggle-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_toggle-icon-color: var(--md-filled-icon-button-toggle-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-pressed-icon-color: var(--md-filled-icon-button-toggle-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_toggle-pressed-state-layer-color: var(--md-filled-icon-button-toggle-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-filled-icon-button-container-shape-start-start, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-filled-icon-button-container-shape-start-end, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-filled-icon-button-container-shape-end-end, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-filled-icon-button-container-shape-end-start, var(--md-filled-icon-button-container-shape, var(--md-sys-shape-corner-full, 9999px)))}.icon-button{color:var(--_icon-color)}.icon-button:hover{color:var(--_hover-icon-color)}.icon-button:focus{color:var(--_focus-icon-color)}.icon-button:active{color:var(--_pressed-icon-color)}.icon-button:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}.icon-button{--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.icon-button::before{background-color:var(--_container-color);border-radius:inherit;content:"";inset:0;position:absolute;z-index:-1}.icon-button:is(:disabled,[aria-disabled=true])::before{background-color:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.icon-button:is(:disabled,[aria-disabled=true]) .icon{opacity:var(--_disabled-icon-opacity)}.toggle-filled:not(:disabled,[aria-disabled=true]){color:var(--_toggle-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-hover-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-focus-icon-color)}.toggle-filled:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-pressed-icon-color)}.toggle-filled{--md-ripple-hover-color: var(--_toggle-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-pressed-state-layer-color)}.toggle-filled:not(:disabled,[aria-disabled=true])::before{background-color:var(--_unselected-container-color)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_toggle-selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_toggle-selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_toggle-selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_toggle-selected-pressed-icon-color)}.selected{--md-ripple-hover-color: var(--_toggle-selected-hover-state-layer-color);--md-ripple-pressed-color: var(--_toggle-selected-pressed-state-layer-color)}.selected:not(:disabled,[aria-disabled=true])::before{background-color:var(--_selected-container-color)}
`;ei.styleSheet;/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let so=class extends Y{getRenderClasses(){return{...super.getRenderClasses(),filled:!0,"toggle-filled":this.toggle}}};so.styles=[$o,ei];so=n([x("md-filled-icon-button")],so);var sa=Object.defineProperty,aa=Object.getOwnPropertyDescriptor,De=(r,e,t,o)=>{for(var i=o>1?void 0:o?aa(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&sa(e,t,i),i};let fe=class extends b{constructor(){super(...arguments),this.chatId="",this.processState="STOPPED",this.turnState="IDLE",this.disabled=!1,this.text=""}handleInput(r){const e=r.target;this.text=e.value,e.style.height="auto",e.style.height=`${Math.min(e.scrollHeight,160)}px`}handleKeyDown(r){(r.ctrlKey||r.metaKey)&&r.key==="Enter"&&(r.preventDefault(),this.send())}async send(){const r=this.text.trim();if(!r||this.disabled||this.processState!=="RUNNING"||this.turnState==="PROMPTING")return;const e=r;this.text="";const t=this.shadowRoot?.querySelector("textarea");t&&(t.value="",t.style.height="auto");try{await y.sendPrompt(this.chatId,e)}catch(o){console.error("Failed to send prompt",o)}}async cancel(){if(this.chatId)try{await y.cancelActiveTurn(this.chatId)}catch(r){console.error("Failed to cancel turn",r)}}render(){const r=this.turnState==="PROMPTING",e=this.turnState==="CANCELLING",t=this.processState!=="RUNNING",o=!t&&!r&&this.text.trim().length>0;return l`
      <div class="composer-container ${t?"disabled":""}">
        <textarea
          rows="1"
          placeholder="${t?"Agent process stopped":r?"Agent is thinking...":"Type a message... (Ctrl+Enter to send)"}"
          .value=${this.text}
          ?disabled=${this.disabled||t||r}
          @input=${this.handleInput}
          @keydown=${this.handleKeyDown}
        ></textarea>

        <div class="actions">
          ${r||e?l`
                <button
                  class="cancel-btn"
                  title="Cancel active turn"
                  ?disabled=${e}
                  @click=${this.cancel}
                >
                  <span class="icon">stop</span>
                </button>
              `:l`
                <button
                  class="send-btn"
                  title="Send message (Ctrl+Enter)"
                  ?disabled=${!o}
                  @click=${this.send}
                >
                  <span class="icon">arrow_upward</span>
                </button>
              `}
        </div>
      </div>
      <div class="hint">Press Ctrl+Enter or Cmd+Enter to send</div>
    `}};fe.styles=g`
    :host {
      display: block;
      background-color: var(--md-sys-color-surface-container);
      border-top: 1px solid var(--md-sys-color-outline-variant);
      padding: 12px 16px;
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
      box-sizing: border-box;
    }

    .composer-container {
      max-width: 860px;
      margin: 0 auto;
      display: flex;
      align-items: flex-end;
      gap: 10px;
      background-color: var(--md-sys-color-surface-container-high);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 24px;
      padding: 6px 8px 6px 16px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .composer-container:focus-within {
      border-color: var(--md-sys-color-primary);
      box-shadow: 0 0 0 1px var(--md-sys-color-primary);
    }

    .composer-container.disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    textarea {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      resize: none;
      font-family: inherit;
      font-size: 0.9375rem;
      line-height: 1.5;
      color: var(--md-sys-color-on-surface);
      min-height: 24px;
      max-height: 160px;
      padding: 6px 0;
      margin: 0;
      overflow-y: auto;
    }

    textarea::placeholder {
      color: var(--md-sys-color-on-surface-variant);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 2px;
    }

    .send-btn, .cancel-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.15s ease, transform 0.1s ease;
    }

    .send-btn {
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
    }

    .send-btn:hover:not(:disabled) {
      background-color: var(--md-sys-color-primary);
      opacity: 0.9;
    }

    .send-btn:disabled {
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-outline);
      cursor: not-allowed;
    }

    .cancel-btn {
      background-color: var(--md-sys-color-error);
      color: var(--md-sys-color-on-error);
    }

    .cancel-btn:hover {
      opacity: 0.9;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }

    .hint {
      font-size: 0.6875rem;
      color: var(--md-sys-color-outline);
      text-align: right;
      max-width: 860px;
      margin: 6px auto 0;
      padding-right: 12px;
    }

    @media (max-width: 599px) {
      .hint {
        display: none;
      }
    }
  `;De([d({type:String})],fe.prototype,"chatId",2);De([d({type:String})],fe.prototype,"processState",2);De([d({type:String})],fe.prototype,"turnState",2);De([d({type:Boolean})],fe.prototype,"disabled",2);De([f()],fe.prototype,"text",2);fe=De([x("chat-composer")],fe);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class na extends So{computeValidity(e){return this.selectControl||(this.selectControl=document.createElement("select")),vo(l`<option value=${e.value}></option>`,this.selectControl),this.selectControl.value=e.value,this.selectControl.required=e.required,{validity:this.selectControl.validity,validationMessage:this.selectControl.validationMessage}}equals(e,t){return e.value===t.value&&e.required===t.required}copy({value:e,required:t}){return{value:e,required:t}}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function la(r){const e=[];for(let t=0;t<r.length;t++){const o=r[t];o.selected&&e.push([o,t])}return e}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */var sr;const mt=Symbol("value"),da=oe(Yr(Po(ot(tt(b)))));class k extends da{get value(){return this[mt]}set value(e){this.lastUserSetValue=e,this.select(e)}get options(){return this.menu?.items??[]}get selectedIndex(){const[e,t]=(this.getSelectedOptions()??[])[0]??[];return t??-1}set selectedIndex(e){this.lastUserSetSelectedIndex=e,this.selectIndex(e)}get selectedOptions(){return(this.getSelectedOptions()??[]).map(([e])=>e)}get hasError(){return this.error||this.nativeError}constructor(){super(),this.quick=!1,this.required=!1,this.errorText="",this.label="",this.noAsterisk=!1,this.supportingText="",this.error=!1,this.menuPositioning="popover",this.clampMenuWidth=!1,this.typeaheadDelay=Br,this.hasLeadingIcon=!1,this.displayText="",this.menuAlign="start",this[sr]="",this.lastUserSetValue=null,this.lastUserSetSelectedIndex=null,this.lastSelectedOption=null,this.lastSelectedOptionRecords=[],this.nativeError=!1,this.nativeErrorText="",this.focused=!1,this.open=!1,this.defaultFocus=Z.NONE,this.prevOpen=this.open,this.selectWidth=0,this.addEventListener("focus",this.handleFocus.bind(this)),this.addEventListener("blur",this.handleBlur.bind(this))}select(e){const t=this.options.find(o=>o.value===e);t&&this.selectItem(t)}selectIndex(e){const t=this.options[e];t&&this.selectItem(t)}reset(){for(const e of this.options)e.selected=e.hasAttribute("selected");this.updateValueAndDisplayText(),this.nativeError=!1,this.nativeErrorText=""}showPicker(){this.open=!0}[(sr=mt,bt)](e){e?.preventDefault();const t=this.getErrorText();this.nativeError=!!e,this.nativeErrorText=this.validationMessage,t===this.getErrorText()&&this.field?.reannounceError()}update(e){if(this.hasUpdated||this.initUserSelection(),this.prevOpen!==this.open&&this.open){const t=this.getBoundingClientRect();this.selectWidth=t.width}this.prevOpen=this.open,super.update(e)}render(){return l`
      <span
        class="select ${F(this.getRenderClasses())}"
        @focusout=${this.handleFocusout}>
        ${this.renderField()} ${this.renderMenu()}
      </span>
    `}async firstUpdated(e){await this.menu?.updateComplete,this.lastSelectedOptionRecords.length||this.initUserSelection(),!this.lastSelectedOptionRecords.length&&!this.options.length&&setTimeout(()=>{this.updateValueAndDisplayText()}),super.firstUpdated(e)}getRenderClasses(){return{disabled:this.disabled,error:this.error,open:this.open}}renderField(){const e=this.ariaLabel||this.label;return Ct`
      <${this.fieldTag}
          aria-haspopup="listbox"
          role="combobox"
          part="field"
          id="field"
          tabindex=${this.disabled?"-1":"0"}
          aria-label=${e||p}
          aria-describedby="description"
          aria-expanded=${this.open?"true":"false"}
          aria-controls="listbox"
          class="field"
          label=${this.label}
          ?no-asterisk=${this.noAsterisk}
          .focused=${this.focused||this.open}
          .populated=${!!this.displayText}
          .disabled=${this.disabled}
          .required=${this.required}
          .error=${this.hasError}
          ?has-start=${this.hasLeadingIcon}
          has-end
          supporting-text=${this.supportingText}
          error-text=${this.getErrorText()}
          @keydown=${this.handleKeydown}
          @click=${this.handleClick}>
         ${this.renderFieldContent()}
         <div id="description" slot="aria-describedby"></div>
      </${this.fieldTag}>`}renderFieldContent(){return[this.renderLeadingIcon(),this.renderLabel(),this.renderTrailingIcon()]}renderLeadingIcon(){return l`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `}renderTrailingIcon(){return l`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}>
          <svg height="5" viewBox="7 10 10 5" focusable="false">
            <polygon
              class="down"
              stroke="none"
              fill-rule="evenodd"
              points="7 10 12 15 17 10"></polygon>
            <polygon
              class="up"
              stroke="none"
              fill-rule="evenodd"
              points="7 15 12 10 17 15"></polygon>
          </svg>
        </slot>
      </span>
    `}renderLabel(){return l`<div id="label">${this.displayText||l`&nbsp;`}</div>`}renderMenu(){const e=this.label||this.ariaLabel;return l`<div class="menu-wrapper">
      <md-menu
        id="listbox"
        .defaultFocus=${this.defaultFocus}
        role="listbox"
        tabindex="-1"
        aria-label=${e||p}
        stay-open-on-focusout
        part="menu"
        exportparts="focus-ring: menu-focus-ring"
        anchor="field"
        style=${Oe({"--__menu-min-width":`${this.selectWidth}px`,"--__menu-max-width":this.clampMenuWidth?`${this.selectWidth}px`:void 0})}
        no-navigation-wrap
        .open=${this.open}
        .quick=${this.quick}
        .positioning=${this.menuPositioning}
        .typeaheadDelay=${this.typeaheadDelay}
        .anchorCorner=${this.menuAlign==="start"?"end-start":"end-end"}
        .menuCorner=${this.menuAlign==="start"?"start-start":"start-end"}
        @opening=${this.handleOpening}
        @opened=${this.redispatchEvent}
        @closing=${this.redispatchEvent}
        @closed=${this.handleClosed}
        @close-menu=${this.handleCloseMenu}
        @request-selection=${this.handleRequestSelection}
        @request-deselection=${this.handleRequestDeselection}>
        ${this.renderMenuContent()}
      </md-menu>
    </div>`}renderMenuContent(){return l`<slot></slot>`}handleKeydown(e){if(this.open||this.disabled||!this.menu)return;const t=this.menu.typeaheadController,o=e.code==="Space"||e.code==="ArrowDown"||e.code==="ArrowUp"||e.code==="End"||e.code==="Home"||e.code==="Enter";if(!t.isTypingAhead&&o){switch(e.preventDefault(),this.open=!0,e.code){case"Space":case"ArrowDown":case"Enter":this.defaultFocus=Z.NONE;break;case"End":this.defaultFocus=Z.LAST_ITEM;break;case"ArrowUp":case"Home":this.defaultFocus=Z.FIRST_ITEM;break}return}if(e.key.length===1){t.onKeydown(e),e.preventDefault();const{lastActiveRecord:s}=t;if(!s)return;this.labelEl?.setAttribute?.("aria-live","polite"),this.selectItem(s[q.ITEM])&&this.dispatchInteractionEvents()}}handleClick(){this.open=!this.open}handleFocus(){this.focused=!0}handleBlur(){this.focused=!1}handleFocusout(e){e.relatedTarget&&Yt(e.relatedTarget,this)||(this.open=!1)}getSelectedOptions(){if(!this.menu)return this.lastSelectedOptionRecords=[],null;const e=this.menu.items;return this.lastSelectedOptionRecords=la(e),this.lastSelectedOptionRecords}async getUpdateComplete(){return await this.menu?.updateComplete,super.getUpdateComplete()}updateValueAndDisplayText(){const e=this.getSelectedOptions()??[];let t=!1;if(e.length){const[o]=e[0];t=this.lastSelectedOption!==o,this.lastSelectedOption=o,this[mt]=o.value,this.displayText=o.displayText}else t=this.lastSelectedOption!==null,this.lastSelectedOption=null,this[mt]="",this.displayText="";return t}async handleOpening(e){if(this.labelEl?.removeAttribute?.("aria-live"),this.redispatchEvent(e),this.defaultFocus!==Z.NONE)return;const t=this.menu.items,o=Fe(t)?.item;let[i]=this.lastSelectedOptionRecords[0]??[null];o&&o!==i&&(o.tabIndex=-1),i=i??t[0],i&&(i.tabIndex=0,i.focus())}redispatchEvent(e){kt(this,e)}handleClosed(e){this.open=!1,this.redispatchEvent(e)}handleCloseMenu(e){const t=e.detail.reason,o=e.detail.itemPath[0];this.open=!1;let i=!1;t.kind==="click-selection"?i=this.selectItem(o):t.kind==="keydown"&&ms(t.key)?i=this.selectItem(o):(o.tabIndex=-1,o.blur()),i&&this.dispatchInteractionEvents()}selectItem(e){return(this.getSelectedOptions()??[]).forEach(([o])=>{e!==o&&(o.selected=!1,o.tabIndex=-1)}),e.selected=!0,e.tabIndex=0,this.updateValueAndDisplayText()}handleRequestSelection(e){const t=e.target;this.lastSelectedOptionRecords.some(([o])=>o===t)||this.selectItem(t)}handleRequestDeselection(e){const t=e.target;this.lastSelectedOptionRecords.some(([o])=>o===t)&&this.updateValueAndDisplayText()}initUserSelection(){this.lastUserSetValue&&!this.lastSelectedOptionRecords.length?this.select(this.lastUserSetValue):this.lastUserSetSelectedIndex!==null&&!this.lastSelectedOptionRecords.length?this.selectIndex(this.lastUserSetSelectedIndex):this.updateValueAndDisplayText()}handleIconChange(){this.hasLeadingIcon=this.leadingIcons.length>0}dispatchInteractionEvents(){this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.dispatchEvent(new Event("change",{bubbles:!0}))}getErrorText(){return this.error?this.errorText:this.nativeErrorText}[Ie](){return this.value}formResetCallback(){this.reset()}formStateRestoreCallback(e){this.value=e}click(){this.field?.click()}[We](){return new na(()=>this)}[Ge](){return this.field}}k.shadowRootOptions={...b.shadowRootOptions,delegatesFocus:!0};n([d({type:Boolean})],k.prototype,"quick",void 0);n([d({type:Boolean})],k.prototype,"required",void 0);n([d({type:String,attribute:"error-text"})],k.prototype,"errorText",void 0);n([d()],k.prototype,"label",void 0);n([d({type:Boolean,attribute:"no-asterisk"})],k.prototype,"noAsterisk",void 0);n([d({type:String,attribute:"supporting-text"})],k.prototype,"supportingText",void 0);n([d({type:Boolean,reflect:!0})],k.prototype,"error",void 0);n([d({attribute:"menu-positioning"})],k.prototype,"menuPositioning",void 0);n([d({type:Boolean,attribute:"clamp-menu-width"})],k.prototype,"clampMenuWidth",void 0);n([d({type:Number,attribute:"typeahead-delay"})],k.prototype,"typeaheadDelay",void 0);n([d({type:Boolean,attribute:"has-leading-icon"})],k.prototype,"hasLeadingIcon",void 0);n([d({attribute:"display-text"})],k.prototype,"displayText",void 0);n([d({attribute:"menu-align"})],k.prototype,"menuAlign",void 0);n([d()],k.prototype,"value",null);n([d({type:Number,attribute:"selected-index"})],k.prototype,"selectedIndex",null);n([f()],k.prototype,"nativeError",void 0);n([f()],k.prototype,"nativeErrorText",void 0);n([f()],k.prototype,"focused",void 0);n([f()],k.prototype,"open",void 0);n([f()],k.prototype,"defaultFocus",void 0);n([S(".field")],k.prototype,"field",void 0);n([S("md-menu")],k.prototype,"menu",void 0);n([S("#label")],k.prototype,"labelEl",void 0);n([te({slot:"leading-icon",flatten:!0})],k.prototype,"leadingIcons",void 0);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class ca extends k{constructor(){super(...arguments),this.fieldTag=ue`md-outlined-field`}}/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ti=g`:host{--_text-field-disabled-input-text-color: var(--md-outlined-select-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-input-text-opacity: var(--md-outlined-select-text-field-disabled-input-text-opacity, 0.38);--_text-field-disabled-label-text-color: var(--md-outlined-select-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-label-text-opacity: var(--md-outlined-select-text-field-disabled-label-text-opacity, 0.38);--_text-field-disabled-leading-icon-color: var(--md-outlined-select-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-leading-icon-opacity: var(--md-outlined-select-text-field-disabled-leading-icon-opacity, 0.38);--_text-field-disabled-outline-color: var(--md-outlined-select-text-field-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-outline-opacity: var(--md-outlined-select-text-field-disabled-outline-opacity, 0.12);--_text-field-disabled-outline-width: var(--md-outlined-select-text-field-disabled-outline-width, 1px);--_text-field-disabled-supporting-text-color: var(--md-outlined-select-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-supporting-text-opacity: var(--md-outlined-select-text-field-disabled-supporting-text-opacity, 0.38);--_text-field-disabled-trailing-icon-color: var(--md-outlined-select-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-trailing-icon-opacity: var(--md-outlined-select-text-field-disabled-trailing-icon-opacity, 0.38);--_text-field-error-focus-input-text-color: var(--md-outlined-select-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-focus-label-text-color: var(--md-outlined-select-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-leading-icon-color: var(--md-outlined-select-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-focus-outline-color: var(--md-outlined-select-text-field-error-focus-outline-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-supporting-text-color: var(--md-outlined-select-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-trailing-icon-color: var(--md-outlined-select-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-input-text-color: var(--md-outlined-select-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-label-text-color: var(--md-outlined-select-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-leading-icon-color: var(--md-outlined-select-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-hover-outline-color: var(--md-outlined-select-text-field-error-hover-outline-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-supporting-text-color: var(--md-outlined-select-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-trailing-icon-color: var(--md-outlined-select-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-input-text-color: var(--md-outlined-select-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-label-text-color: var(--md-outlined-select-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-leading-icon-color: var(--md-outlined-select-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-outline-color: var(--md-outlined-select-text-field-error-outline-color, var(--md-sys-color-error, #b3261e));--_text-field-error-supporting-text-color: var(--md-outlined-select-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-trailing-icon-color: var(--md-outlined-select-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-focus-input-text-color: var(--md-outlined-select-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-focus-label-text-color: var(--md-outlined-select-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-leading-icon-color: var(--md-outlined-select-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-outline-color: var(--md-outlined-select-text-field-focus-outline-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-outline-width: var(--md-outlined-select-text-field-focus-outline-width, 3px);--_text-field-focus-supporting-text-color: var(--md-outlined-select-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-trailing-icon-color: var(--md-outlined-select-text-field-focus-trailing-icon-color, var(--md-sys-color-primary, #6750a4));--_text-field-hover-input-text-color: var(--md-outlined-select-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-label-text-color: var(--md-outlined-select-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-leading-icon-color: var(--md-outlined-select-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-outline-color: var(--md-outlined-select-text-field-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-outline-width: var(--md-outlined-select-text-field-hover-outline-width, 1px);--_text-field-hover-supporting-text-color: var(--md-outlined-select-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-trailing-icon-color: var(--md-outlined-select-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-input-text-color: var(--md-outlined-select-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-input-text-font: var(--md-outlined-select-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-input-text-line-height: var(--md-outlined-select-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-input-text-size: var(--md-outlined-select-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-input-text-weight: var(--md-outlined-select-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-label-text-color: var(--md-outlined-select-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-label-text-font: var(--md-outlined-select-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-label-text-line-height: var(--md-outlined-select-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-label-text-populated-line-height: var(--md-outlined-select-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-label-text-populated-size: var(--md-outlined-select-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-label-text-size: var(--md-outlined-select-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-label-text-weight: var(--md-outlined-select-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-leading-icon-color: var(--md-outlined-select-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-leading-icon-size: var(--md-outlined-select-text-field-leading-icon-size, 24px);--_text-field-outline-color: var(--md-outlined-select-text-field-outline-color, var(--md-sys-color-outline, #79747e));--_text-field-outline-width: var(--md-outlined-select-text-field-outline-width, 1px);--_text-field-supporting-text-color: var(--md-outlined-select-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-supporting-text-font: var(--md-outlined-select-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-supporting-text-line-height: var(--md-outlined-select-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-supporting-text-size: var(--md-outlined-select-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-supporting-text-weight: var(--md-outlined-select-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-trailing-icon-color: var(--md-outlined-select-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-trailing-icon-size: var(--md-outlined-select-text-field-trailing-icon-size, 24px);--_text-field-container-shape-start-start: var(--md-outlined-select-text-field-container-shape-start-start, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-start-end: var(--md-outlined-select-text-field-container-shape-start-end, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-end: var(--md-outlined-select-text-field-container-shape-end-end, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-start: var(--md-outlined-select-text-field-container-shape-end-start, var(--md-outlined-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--md-outlined-field-container-shape-end-end: var(--_text-field-container-shape-end-end);--md-outlined-field-container-shape-end-start: var(--_text-field-container-shape-end-start);--md-outlined-field-container-shape-start-end: var(--_text-field-container-shape-start-end);--md-outlined-field-container-shape-start-start: var(--_text-field-container-shape-start-start);--md-outlined-field-content-color: var(--_text-field-input-text-color);--md-outlined-field-content-font: var(--_text-field-input-text-font);--md-outlined-field-content-line-height: var(--_text-field-input-text-line-height);--md-outlined-field-content-size: var(--_text-field-input-text-size);--md-outlined-field-content-weight: var(--_text-field-input-text-weight);--md-outlined-field-disabled-content-color: var(--_text-field-disabled-input-text-color);--md-outlined-field-disabled-content-opacity: var(--_text-field-disabled-input-text-opacity);--md-outlined-field-disabled-label-text-color: var(--_text-field-disabled-label-text-color);--md-outlined-field-disabled-label-text-opacity: var(--_text-field-disabled-label-text-opacity);--md-outlined-field-disabled-leading-content-color: var(--_text-field-disabled-leading-icon-color);--md-outlined-field-disabled-leading-content-opacity: var(--_text-field-disabled-leading-icon-opacity);--md-outlined-field-disabled-outline-color: var(--_text-field-disabled-outline-color);--md-outlined-field-disabled-outline-opacity: var(--_text-field-disabled-outline-opacity);--md-outlined-field-disabled-outline-width: var(--_text-field-disabled-outline-width);--md-outlined-field-disabled-supporting-text-color: var(--_text-field-disabled-supporting-text-color);--md-outlined-field-disabled-supporting-text-opacity: var(--_text-field-disabled-supporting-text-opacity);--md-outlined-field-disabled-trailing-content-color: var(--_text-field-disabled-trailing-icon-color);--md-outlined-field-disabled-trailing-content-opacity: var(--_text-field-disabled-trailing-icon-opacity);--md-outlined-field-error-content-color: var(--_text-field-error-input-text-color);--md-outlined-field-error-focus-content-color: var(--_text-field-error-focus-input-text-color);--md-outlined-field-error-focus-label-text-color: var(--_text-field-error-focus-label-text-color);--md-outlined-field-error-focus-leading-content-color: var(--_text-field-error-focus-leading-icon-color);--md-outlined-field-error-focus-outline-color: var(--_text-field-error-focus-outline-color);--md-outlined-field-error-focus-supporting-text-color: var(--_text-field-error-focus-supporting-text-color);--md-outlined-field-error-focus-trailing-content-color: var(--_text-field-error-focus-trailing-icon-color);--md-outlined-field-error-hover-content-color: var(--_text-field-error-hover-input-text-color);--md-outlined-field-error-hover-label-text-color: var(--_text-field-error-hover-label-text-color);--md-outlined-field-error-hover-leading-content-color: var(--_text-field-error-hover-leading-icon-color);--md-outlined-field-error-hover-outline-color: var(--_text-field-error-hover-outline-color);--md-outlined-field-error-hover-supporting-text-color: var(--_text-field-error-hover-supporting-text-color);--md-outlined-field-error-hover-trailing-content-color: var(--_text-field-error-hover-trailing-icon-color);--md-outlined-field-error-label-text-color: var(--_text-field-error-label-text-color);--md-outlined-field-error-leading-content-color: var(--_text-field-error-leading-icon-color);--md-outlined-field-error-outline-color: var(--_text-field-error-outline-color);--md-outlined-field-error-supporting-text-color: var(--_text-field-error-supporting-text-color);--md-outlined-field-error-trailing-content-color: var(--_text-field-error-trailing-icon-color);--md-outlined-field-focus-content-color: var(--_text-field-focus-input-text-color);--md-outlined-field-focus-label-text-color: var(--_text-field-focus-label-text-color);--md-outlined-field-focus-leading-content-color: var(--_text-field-focus-leading-icon-color);--md-outlined-field-focus-outline-color: var(--_text-field-focus-outline-color);--md-outlined-field-focus-outline-width: var(--_text-field-focus-outline-width);--md-outlined-field-focus-supporting-text-color: var(--_text-field-focus-supporting-text-color);--md-outlined-field-focus-trailing-content-color: var(--_text-field-focus-trailing-icon-color);--md-outlined-field-hover-content-color: var(--_text-field-hover-input-text-color);--md-outlined-field-hover-label-text-color: var(--_text-field-hover-label-text-color);--md-outlined-field-hover-leading-content-color: var(--_text-field-hover-leading-icon-color);--md-outlined-field-hover-outline-color: var(--_text-field-hover-outline-color);--md-outlined-field-hover-outline-width: var(--_text-field-hover-outline-width);--md-outlined-field-hover-supporting-text-color: var(--_text-field-hover-supporting-text-color);--md-outlined-field-hover-trailing-content-color: var(--_text-field-hover-trailing-icon-color);--md-outlined-field-label-text-color: var(--_text-field-label-text-color);--md-outlined-field-label-text-font: var(--_text-field-label-text-font);--md-outlined-field-label-text-line-height: var(--_text-field-label-text-line-height);--md-outlined-field-label-text-populated-line-height: var(--_text-field-label-text-populated-line-height);--md-outlined-field-label-text-populated-size: var(--_text-field-label-text-populated-size);--md-outlined-field-label-text-size: var(--_text-field-label-text-size);--md-outlined-field-label-text-weight: var(--_text-field-label-text-weight);--md-outlined-field-leading-content-color: var(--_text-field-leading-icon-color);--md-outlined-field-outline-color: var(--_text-field-outline-color);--md-outlined-field-outline-width: var(--_text-field-outline-width);--md-outlined-field-supporting-text-color: var(--_text-field-supporting-text-color);--md-outlined-field-supporting-text-font: var(--_text-field-supporting-text-font);--md-outlined-field-supporting-text-line-height: var(--_text-field-supporting-text-line-height);--md-outlined-field-supporting-text-size: var(--_text-field-supporting-text-size);--md-outlined-field-supporting-text-weight: var(--_text-field-supporting-text-weight);--md-outlined-field-trailing-content-color: var(--_text-field-trailing-icon-color)}[has-start] .icon.leading{font-size:var(--_text-field-leading-icon-size);height:var(--_text-field-leading-icon-size);width:var(--_text-field-leading-icon-size)}.icon.trailing{font-size:var(--_text-field-trailing-icon-size);height:var(--_text-field-trailing-icon-size);width:var(--_text-field-trailing-icon-size)}
`;ti.styleSheet;/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const oi=g`:host{color:unset;min-width:210px;display:flex}.field{cursor:default;outline:none}.select{position:relative;flex-direction:column}.icon.trailing svg,.icon ::slotted(*){fill:currentColor}.icon ::slotted(*){width:inherit;height:inherit;font-size:inherit}.icon slot{display:flex;height:100%;width:100%;align-items:center;justify-content:center}.icon.trailing :is(.up,.down){opacity:0;transition:opacity 75ms linear 75ms}.select:not(.open) .down,.select.open .up{opacity:1}.field,.select,md-menu{min-width:inherit;width:inherit;max-width:inherit;display:flex}md-menu{min-width:var(--__menu-min-width);max-width:var(--__menu-max-width, inherit)}.menu-wrapper{width:0px;height:0px;max-width:inherit}md-menu ::slotted(:not[disabled]){cursor:pointer}.field,.select{width:100%}:host{display:inline-flex}:host([disabled]){pointer-events:none}
`;oi.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let ao=class extends ca{};ao.styles=[oi,ti];ao=n([x("md-outlined-select")],ao);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function ha(){return new Event("request-selection",{bubbles:!0,composed:!0})}function pa(){return new Event("request-deselection",{bubbles:!0,composed:!0})}class ua{get role(){return this.menuItemController.role}get typeaheadText(){return this.menuItemController.typeaheadText}setTypeaheadText(e){this.menuItemController.setTypeaheadText(e)}get displayText(){return this.internalDisplayText!==null?this.internalDisplayText:this.menuItemController.typeaheadText}setDisplayText(e){this.internalDisplayText=e}constructor(e,t){this.host=e,this.internalDisplayText=null,this.firstUpdate=!0,this.onClick=()=>{this.menuItemController.onClick()},this.onKeydown=o=>{this.menuItemController.onKeydown(o)},this.lastSelected=this.host.selected,this.menuItemController=new qr(e,t),e.addController(this)}hostUpdate(){this.lastSelected!==this.host.selected&&(this.host.ariaSelected=this.host.selected?"true":"false")}hostUpdated(){this.lastSelected!==this.host.selected&&!this.firstUpdate&&(this.host.selected?this.host.dispatchEvent(ha()):this.host.dispatchEvent(pa())),this.lastSelected=this.host.selected,this.firstUpdate=!1}}/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ma=oe(b);class X extends ma{constructor(){super(...arguments),this.disabled=!1,this.isMenuItem=!0,this.selected=!1,this.value="",this.type="option",this.selectOptionController=new ua(this,{getHeadlineElements:()=>this.headlineElements,getSupportingTextElements:()=>this.supportingTextElements,getDefaultElements:()=>this.defaultElements,getInteractiveElement:()=>this.listItemRoot})}get typeaheadText(){return this.selectOptionController.typeaheadText}set typeaheadText(e){this.selectOptionController.setTypeaheadText(e)}get displayText(){return this.selectOptionController.displayText}set displayText(e){this.selectOptionController.setDisplayText(e)}render(){return this.renderListItem(l`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `)}renderListItem(e){return l`
      <li
        id="item"
        tabindex=${this.disabled?-1:0}
        role=${this.selectOptionController.role}
        aria-label=${this.ariaLabel||p}
        aria-selected=${this.ariaSelected||p}
        aria-checked=${this.ariaChecked||p}
        aria-expanded=${this.ariaExpanded||p}
        aria-haspopup=${this.ariaHasPopup||p}
        class="list-item ${F(this.getRenderClasses())}"
        @click=${this.selectOptionController.onClick}
        @keydown=${this.selectOptionController.onKeydown}
        >${e}</li
      >
    `}renderRipple(){return l` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`}renderFocusRing(){return l` <md-focus-ring
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`}getRenderClasses(){return{disabled:this.disabled,selected:this.selected}}renderBody(){return l`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `}focus(){this.listItemRoot?.focus()}}X.shadowRootOptions={...b.shadowRootOptions,delegatesFocus:!0};n([d({type:Boolean,reflect:!0})],X.prototype,"disabled",void 0);n([d({type:Boolean,attribute:"md-menu-item",reflect:!0})],X.prototype,"isMenuItem",void 0);n([d({type:Boolean})],X.prototype,"selected",void 0);n([d()],X.prototype,"value",void 0);n([S(".list-item")],X.prototype,"listItemRoot",void 0);n([te({slot:"headline"})],X.prototype,"headlineElements",void 0);n([te({slot:"supporting-text"})],X.prototype,"supportingTextElements",void 0);n([hr({slot:""})],X.prototype,"defaultElements",void 0);n([d({attribute:"typeahead-text"})],X.prototype,"typeaheadText",null);n([d({attribute:"display-text"})],X.prototype,"displayText",null);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let no=class extends X{};no.styles=[Ao];no=n([x("md-select-option")],no);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class fa extends So{computeValidity(e){return this.checkboxControl||(this.checkboxControl=document.createElement("input"),this.checkboxControl.type="checkbox"),this.checkboxControl.checked=e.checked,this.checkboxControl.required=e.required,{validity:this.checkboxControl.validity,validationMessage:this.checkboxControl.validationMessage}}equals(e,t){return e.checked===t.checked&&e.required===t.required}copy({checked:e,required:t}){return{checked:e,required:t}}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const va=oe(Po(ot(tt(b))));class ge extends va{constructor(){super(),this.selected=!1,this.icons=!1,this.showOnlySelectedIcon=!1,this.required=!1,this.value="on",this.addEventListener("click",e=>{!_r(e)||!this.input||(this.focus(),xr(this.input))}),wo(this,"keydown"),this.addEventListener("keydown",e=>{_o(e,()=>{e.defaultPrevented||e.key!=="Enter"||this.disabled||!this.input||this.input.click()})})}render(){return l`
      <div class="switch ${F(this.getRenderClasses())}">
        <input
          id="switch"
          class="touch"
          type="checkbox"
          role="switch"
          aria-label=${this.ariaLabel||p}
          ?checked=${this.selected}
          ?disabled=${this.disabled}
          ?required=${this.required}
          @input=${this.handleInput}
          @change=${this.handleChange} />

        <md-focus-ring part="focus-ring" for="switch"></md-focus-ring>
        <span class="track"> ${this.renderHandle()} </span>
      </div>
    `}getRenderClasses(){return{selected:this.selected,unselected:!this.selected,disabled:this.disabled}}renderHandle(){const e={"with-icon":this.showOnlySelectedIcon?this.selected:this.icons};return l`
      ${this.renderTouchTarget()}
      <span class="handle-container">
        <md-ripple for="switch" ?disabled="${this.disabled}"></md-ripple>
        <span class="handle ${F(e)}">
          ${this.shouldShowIcons()?this.renderIcons():l``}
        </span>
      </span>
    `}renderIcons(){return l`
      <div class="icons">
        ${this.renderOnIcon()}
        ${this.showOnlySelectedIcon?l``:this.renderOffIcon()}
      </div>
    `}renderOnIcon(){return l`
      <slot class="icon icon--on" name="on-icon">
        <svg viewBox="0 0 24 24">
          <path
            d="M9.55 18.2 3.65 12.3 5.275 10.675 9.55 14.95 18.725 5.775 20.35 7.4Z" />
        </svg>
      </slot>
    `}renderOffIcon(){return l`
      <slot class="icon icon--off" name="off-icon">
        <svg viewBox="0 0 24 24">
          <path
            d="M6.4 19.2 4.8 17.6 10.4 12 4.8 6.4 6.4 4.8 12 10.4 17.6 4.8 19.2 6.4 13.6 12 19.2 17.6 17.6 19.2 12 13.6Z" />
        </svg>
      </slot>
    `}renderTouchTarget(){return l`<span class="touch"></span>`}shouldShowIcons(){return this.icons||this.showOnlySelectedIcon}handleInput(e){const t=e.target;this.selected=t.checked}handleChange(e){kt(this,e)}[Ie](){return this.selected?this.value:null}[Ut](){return String(this.selected)}formResetCallback(){this.selected=this.hasAttribute("selected")}formStateRestoreCallback(e){this.selected=e==="true"}[We](){return new fa(()=>({checked:this.selected,required:this.required}))}[Ge](){return this.input}}ge.shadowRootOptions={mode:"open",delegatesFocus:!0};n([d({type:Boolean})],ge.prototype,"selected",void 0);n([d({type:Boolean})],ge.prototype,"icons",void 0);n([d({type:Boolean,attribute:"show-only-selected-icon"})],ge.prototype,"showOnlySelectedIcon",void 0);n([d({type:Boolean})],ge.prototype,"required",void 0);n([d()],ge.prototype,"value",void 0);n([S("input")],ge.prototype,"input",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const ri=g`@layer styles, hcm;@layer styles{:host{display:inline-flex;outline:none;vertical-align:top;-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-switch-track-height, 32px))/2) 0px}md-focus-ring{--md-focus-ring-shape-start-start: var(--md-switch-track-shape-start-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));--md-focus-ring-shape-start-end: var(--md-switch-track-shape-start-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));--md-focus-ring-shape-end-end: var(--md-switch-track-shape-end-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));--md-focus-ring-shape-end-start: var(--md-switch-track-shape-end-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)))}.switch{align-items:center;display:inline-flex;flex-shrink:0;position:relative;width:var(--md-switch-track-width, 52px);height:var(--md-switch-track-height, 32px);border-start-start-radius:var(--md-switch-track-shape-start-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));border-start-end-radius:var(--md-switch-track-shape-start-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-end-radius:var(--md-switch-track-shape-end-end, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-start-radius:var(--md-switch-track-shape-end-start, var(--md-switch-track-shape, var(--md-sys-shape-corner-full, 9999px)))}input{appearance:none;background:none;height:max(100%,var(--md-switch-touch-target-size, 48px));outline:none;margin:0;position:absolute;width:max(100%,var(--md-switch-touch-target-size, 48px));z-index:1;cursor:inherit;top:50%;left:50%;transform:translate(-50%, -50%)}:host([touch-target=none]) input{display:none}}@layer styles{.track{position:absolute;width:100%;height:100%;box-sizing:border-box;border-radius:inherit;display:flex;justify-content:center;align-items:center}.track::before{content:"";display:flex;position:absolute;height:100%;width:100%;border-radius:inherit;box-sizing:border-box;transition-property:opacity,background-color;transition-timing-function:linear;transition-duration:67ms}.disabled .track{background-color:rgba(0,0,0,0);border-color:rgba(0,0,0,0)}.disabled .track::before,.disabled .track::after{transition:none;opacity:var(--md-switch-disabled-track-opacity, 0.12)}.disabled .track::before{background-clip:content-box}.selected .track::before{background-color:var(--md-switch-selected-track-color, var(--md-sys-color-primary, #6750a4))}.selected:hover .track::before{background-color:var(--md-switch-selected-hover-track-color, var(--md-sys-color-primary, #6750a4))}.selected:focus-within .track::before{background-color:var(--md-switch-selected-focus-track-color, var(--md-sys-color-primary, #6750a4))}.selected:active .track::before{background-color:var(--md-switch-selected-pressed-track-color, var(--md-sys-color-primary, #6750a4))}.selected.disabled .track{background-clip:border-box}.selected.disabled .track::before{background-color:var(--md-switch-disabled-selected-track-color, var(--md-sys-color-on-surface, #1d1b20))}.unselected .track::before{background-color:var(--md-switch-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-track-outline-color, var(--md-sys-color-outline, #79747e));border-style:solid;border-width:var(--md-switch-track-outline-width, 2px)}.unselected:hover .track::before{background-color:var(--md-switch-hover-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-hover-track-outline-color, var(--md-sys-color-outline, #79747e))}.unselected:focus-visible .track::before{background-color:var(--md-switch-focus-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-focus-track-outline-color, var(--md-sys-color-outline, #79747e))}.unselected:active .track::before{background-color:var(--md-switch-pressed-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-pressed-track-outline-color, var(--md-sys-color-outline, #79747e))}.unselected.disabled .track::before{background-color:var(--md-switch-disabled-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));border-color:var(--md-switch-disabled-track-outline-color, var(--md-sys-color-on-surface, #1d1b20))}}@layer hcm{@media(forced-colors: active){.selected .track::before{background:ButtonText;border-color:ButtonText}.disabled .track::before{border-color:GrayText;opacity:1}.disabled.selected .track::before{background:GrayText}}}@layer styles{.handle-container{display:flex;place-content:center;place-items:center;position:relative;transition:margin 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)}.selected .handle-container{margin-inline-start:calc(var(--md-switch-track-width, 52px) - var(--md-switch-track-height, 32px))}.unselected .handle-container{margin-inline-end:calc(var(--md-switch-track-width, 52px) - var(--md-switch-track-height, 32px))}.disabled .handle-container{transition:none}.handle{border-start-start-radius:var(--md-switch-handle-shape-start-start, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));border-start-end-radius:var(--md-switch-handle-shape-start-end, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-end-radius:var(--md-switch-handle-shape-end-end, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));border-end-start-radius:var(--md-switch-handle-shape-end-start, var(--md-switch-handle-shape, var(--md-sys-shape-corner-full, 9999px)));height:var(--md-switch-handle-height, 16px);width:var(--md-switch-handle-width, 16px);transform-origin:center;transition-property:height,width;transition-duration:250ms,250ms;transition-timing-function:cubic-bezier(0.2, 0, 0, 1),cubic-bezier(0.2, 0, 0, 1);z-index:0}.handle::before{content:"";display:flex;inset:0;position:absolute;border-radius:inherit;box-sizing:border-box;transition:background-color 67ms linear}.disabled .handle,.disabled .handle::before{transition:none}.selected .handle{height:var(--md-switch-selected-handle-height, 24px);width:var(--md-switch-selected-handle-width, 24px)}.handle.with-icon{height:var(--md-switch-with-icon-handle-height, 24px);width:var(--md-switch-with-icon-handle-width, 24px)}.selected:not(.disabled):active .handle,.unselected:not(.disabled):active .handle{height:var(--md-switch-pressed-handle-height, 28px);width:var(--md-switch-pressed-handle-width, 28px);transition-timing-function:linear;transition-duration:100ms}.selected .handle::before{background-color:var(--md-switch-selected-handle-color, var(--md-sys-color-on-primary, #fff))}.selected:hover .handle::before{background-color:var(--md-switch-selected-hover-handle-color, var(--md-sys-color-primary-container, #eaddff))}.selected:focus-within .handle::before{background-color:var(--md-switch-selected-focus-handle-color, var(--md-sys-color-primary-container, #eaddff))}.selected:active .handle::before{background-color:var(--md-switch-selected-pressed-handle-color, var(--md-sys-color-primary-container, #eaddff))}.selected.disabled .handle::before{background-color:var(--md-switch-disabled-selected-handle-color, var(--md-sys-color-surface, #fef7ff));opacity:var(--md-switch-disabled-selected-handle-opacity, 1)}.unselected .handle::before{background-color:var(--md-switch-handle-color, var(--md-sys-color-outline, #79747e))}.unselected:hover .handle::before{background-color:var(--md-switch-hover-handle-color, var(--md-sys-color-on-surface-variant, #49454f))}.unselected:focus-within .handle::before{background-color:var(--md-switch-focus-handle-color, var(--md-sys-color-on-surface-variant, #49454f))}.unselected:active .handle::before{background-color:var(--md-switch-pressed-handle-color, var(--md-sys-color-on-surface-variant, #49454f))}.unselected.disabled .handle::before{background-color:var(--md-switch-disabled-handle-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-switch-disabled-handle-opacity, 0.38)}md-ripple{border-radius:var(--md-switch-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));height:var(--md-switch-state-layer-size, 40px);inset:unset;width:var(--md-switch-state-layer-size, 40px)}.selected md-ripple{--md-ripple-hover-color: var(--md-switch-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-color: var(--md-switch-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-switch-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-opacity: var(--md-switch-selected-pressed-state-layer-opacity, 0.12)}.unselected md-ripple{--md-ripple-hover-color: var(--md-switch-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-color: var(--md-switch-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-switch-hover-state-layer-opacity, 0.08);--md-ripple-pressed-opacity: var(--md-switch-pressed-state-layer-opacity, 0.12)}}@layer hcm{@media(forced-colors: active){.unselected .handle::before{background:ButtonText}.disabled .handle::before{opacity:1}.disabled.unselected .handle::before{background:GrayText}}}@layer styles{.icons{position:relative;height:100%;width:100%}.icon{position:absolute;inset:0;margin:auto;display:flex;align-items:center;justify-content:center;fill:currentColor;transition:fill 67ms linear,opacity 33ms linear,transform 167ms cubic-bezier(0.2, 0, 0, 1);opacity:0}.disabled .icon{transition:none}.selected .icon--on,.unselected .icon--off{opacity:1}.unselected .handle:not(.with-icon) .icon--on{transform:rotate(-45deg)}.icon--off{width:var(--md-switch-icon-size, 16px);height:var(--md-switch-icon-size, 16px);color:var(--md-switch-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected:hover .icon--off{color:var(--md-switch-hover-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected:focus-within .icon--off{color:var(--md-switch-focus-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected:active .icon--off{color:var(--md-switch-pressed-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9))}.unselected.disabled .icon--off{color:var(--md-switch-disabled-icon-color, var(--md-sys-color-surface-container-highest, #e6e0e9));opacity:var(--md-switch-disabled-icon-opacity, 0.38)}.icon--on{width:var(--md-switch-selected-icon-size, 16px);height:var(--md-switch-selected-icon-size, 16px);color:var(--md-switch-selected-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected:hover .icon--on{color:var(--md-switch-selected-hover-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected:focus-within .icon--on{color:var(--md-switch-selected-focus-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected:active .icon--on{color:var(--md-switch-selected-pressed-icon-color, var(--md-sys-color-on-primary-container, #21005d))}.selected.disabled .icon--on{color:var(--md-switch-disabled-selected-icon-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-switch-disabled-selected-icon-opacity, 0.38)}}@layer hcm{@media(forced-colors: active){.icon--off{fill:Canvas}.icon--on{fill:ButtonText}.disabled.unselected .icon--off,.disabled.selected .icon--on{opacity:1}.disabled .icon--on{fill:GrayText}}}
`;ri.styleSheet;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let lo=class extends ge{};lo.styles=[ri];lo=n([x("md-switch")],lo);var ga=Object.defineProperty,ba=Object.getOwnPropertyDescriptor,jo=(r,e,t,o)=>{for(var i=o>1?void 0:o?ba(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&ga(e,t,i),i};let Ze=class extends b{constructor(){super(...arguments),this.chat=null,this.options=[]}async handlePolicyChange(r){const e=r.target.value;this.chat&&await y.setChatPolicy(this.chat.id,e)}async handleConfigSelect(r,e){const t=e.target.value;this.chat&&await y.setChatConfig(this.chat.id,r,t)}async handleConfigBool(r,e){const t=e.target.selected||e.target.checked;this.chat&&await y.setChatConfig(this.chat.id,r,t)}render(){return this.chat?l`
      <div class="config-title">
        <md-icon class="material-symbols-outlined">tune</md-icon>
        <span>Configuration & Permissions</span>
      </div>

      <!-- Permission Policy -->
      <div class="config-item">
        <span class="item-label">Permission Policy</span>
        <span class="item-desc">
          Controls whether the agent must ask before running commands or editing files.
        </span>
        <select
          class="native-select"
          .value=${this.chat.permission_policy}
          @change=${this.handlePolicyChange}
        >
          <option value="ask">Ask every time</option>
          <option value="read-only">Read-only (Deny all writes)</option>
          <option value="auto-approve">Auto-approve (Grant all permissions)</option>
          <option value="deny-all">Deny-all (Block all actions)</option>
        </select>
      </div>

      <md-divider></md-divider>

      <!-- ACP Dynamically Advertised Config Options -->
      ${this.options.length===0?l`
            <div class="item-desc" style="font-style: italic;">
              No additional agent configuration options advertised.
            </div>
          `:this.options.map(r=>r.type==="select"?l`
                <div class="config-item">
                  <span class="item-label">${r.name}</span>
                  ${r.description?l`<span class="item-desc">${r.description}</span>`:""}
                  <select
                    class="native-select"
                    .value=${String(r.currentValue??"")}
                    @change=${e=>this.handleConfigSelect(r.id,e)}
                  >
                    ${r.options?.map(e=>e.options&&Array.isArray(e.options)?l`
                          <optgroup label=${e.group||e.name||""}>
                            ${e.options.map(t=>l`
                                <option
                                  value=${String(t.value)}
                                  ?selected=${t.value===r.currentValue}
                                >
                                  ${t.name||t.value}
                                </option>
                              `)}
                          </optgroup>
                        `:l`
                        <option
                          value=${String(e.value)}
                          ?selected=${e.value===r.currentValue}
                        >
                          ${e.name||e.value}
                        </option>
                      `)}
                  </select>
                </div>
              `:r.type==="boolean"?l`
                <div class="config-boolean-item">
                  <div style="flex: 1;">
                    <div class="item-label">${r.name}</div>
                    ${r.description?l`<div class="item-desc">${r.description}</div>`:""}
                  </div>
                  <md-switch
                    ?selected=${!!r.currentValue}
                    @change=${e=>this.handleConfigBool(r.id,e)}
                  ></md-switch>
                </div>
              `:l`
              <div class="config-item">
                <span class="item-label">${r.name}</span>
                <div class="unsupported-type">
                  ${String(r.currentValue??"")} (type: ${r.type})
                </div>
              </div>
            `)}
    `:l``}};Ze.styles=g`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-family: var(--md-sys-typescale-body-font);
    }

    .config-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .config-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .config-boolean-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 6px 0;
    }

    .item-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--md-sys-color-on-surface);
    }

    .item-desc {
      font-size: 0.75rem;
      color: var(--md-sys-color-on-surface-variant);
      line-height: 1.3;
    }

    .unsupported-type {
      padding: 8px 12px;
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: 0.8rem;
      color: var(--md-sys-color-outline);
    }

    select.native-select {
      appearance: none;
      -webkit-appearance: none;
      background-color: var(--md-sys-color-surface-container-high);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-small);
      color: var(--md-sys-color-on-surface);
      padding: 8px 12px;
      font-size: 0.85rem;
      cursor: pointer;
      width: 100%;
      outline: none;
    }

    select.native-select:focus {
      border-color: var(--md-sys-color-primary);
    }
  `;jo([d({type:Object})],Ze.prototype,"chat",2);jo([d({type:Array})],Ze.prototype,"options",2);Ze=jo([x("chat-config")],Ze);var ya=Object.defineProperty,xa=Object.getOwnPropertyDescriptor,zo=(r,e,t,o)=>{for(var i=o>1?void 0:o?xa(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&ya(e,t,i),i};let Je=class extends b{constructor(){super(...arguments),this.chatId="",this.isConfigOpen=!1,this.handleToggleConfig=()=>{this.isConfigOpen=!this.isConfigOpen},this.handleRetryConnect=()=>{this.chatId&&y.connectChat(this.chatId)}}connectedCallback(){super.connectedCallback(),this.unsubscribeStore=y.subscribe(()=>{this.requestUpdate()})}disconnectedCallback(){this.unsubscribeStore&&this.unsubscribeStore(),super.disconnectedCallback()}render(){const r=y.activeChat;if(!r)return l`
        <div class="empty-state">
          <span class="icon" style="font-size: 48px; color: var(--md-sys-color-outline);">chat</span>
          <p>No chat selected</p>
        </div>
      `;const e=y.connectingChats.has(this.chatId),t=y.connectErrors[this.chatId],o=y.activeReducer.items,i=y.configOptionsByChat[this.chatId]||[];return l`
      <div class="main-chat-area">
        <chat-header
          .chat=${r}
          .isConfigOpen=${this.isConfigOpen}
          @toggle-config=${this.handleToggleConfig}
        ></chat-header>

        <div class="content-area">
          ${e?l`
                <div class="connecting-state">
                  <md-circular-progress indeterminate></md-circular-progress>
                  <div class="connecting-title">Connecting to ${r.agent}...</div>
                  <div class="connecting-sub">Initializing ACP session and loading tools</div>
                </div>
              `:t?l`
                <div class="error-state">
                  <span class="icon" style="font-size: 48px; color: var(--md-sys-color-error);">error_outline</span>
                  <div class="connecting-title" style="color: var(--md-sys-color-error);">Connection Failed</div>
                  <div class="connecting-sub">${t}</div>
                  <md-filled-button @click=${this.handleRetryConnect}>
                    Retry Connection
                  </md-filled-button>
                </div>
              `:o.length===0?l`
                <div class="empty-state">
                  <div class="empty-card">
                    <div class="empty-header">
                      <div class="empty-avatar">${r.agent[0]}</div>
                      <div>
                        <div class="empty-title">${r.agent} connected</div>
                        <div class="empty-desc">Configure agent options below or send your first message to begin.</div>
                      </div>
                    </div>
                    <chat-config
                      .chat=${r}
                      .options=${i}
                    ></chat-config>
                  </div>
                </div>
              `:l`
                <event-stream
                  .items=${o}
                  .chatId=${r.id}
                ></event-stream>
              `}
        </div>

        <chat-composer
          .chatId=${r.id}
          .processState=${r.process_state||"STOPPED"}
          .turnState=${r.turn_state||"IDLE"}
          .disabled=${e}
        ></chat-composer>
      </div>

      <!-- Config Side Sheet -->
      <div class="side-sheet ${this.isConfigOpen?"":"hidden"}">
        <div class="side-sheet-header">
          <span>Chat Configuration</span>
          <md-icon-button @click=${()=>this.isConfigOpen=!1}>
            <span class="icon">close</span>
          </md-icon-button>
        </div>
        <div class="side-sheet-body">
          <chat-config
            .chat=${r}
            .options=${i}
          ></chat-config>
        </div>
      </div>
    `}};Je.styles=g`
    :host {
      display: flex;
      flex-direction: row;
      height: 100%;
      width: 100%;
      overflow: hidden;
      position: relative;
      background-color: var(--md-sys-color-background);
    }

    .main-chat-area {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      min-width: 0;
      position: relative;
    }

    .content-area {
      flex: 1;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .connecting-state, .error-state, .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      text-align: center;
      gap: 16px;
      overflow-y: auto;
    }

    .connecting-title {
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--md-sys-color-on-surface);
    }

    .connecting-sub {
      font-size: 0.875rem;
      color: var(--md-sys-color-on-surface-variant);
    }

    .empty-card {
      max-width: 540px;
      width: 100%;
      background-color: var(--md-sys-color-surface-container);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 16px;
      padding: 24px;
      text-align: left;
      box-sizing: border-box;
    }

    .empty-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .empty-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.125rem;
      text-transform: uppercase;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
    }

    .empty-desc {
      font-size: 0.875rem;
      color: var(--md-sys-color-on-surface-variant);
      margin-top: 2px;
    }

    .side-sheet {
      width: 340px;
      height: 100%;
      background-color: var(--md-sys-color-surface-container-low);
      border-left: 1px solid var(--md-sys-color-outline-variant);
      display: flex;
      flex-direction: column;
      position: relative;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 20;
    }

    .side-sheet.hidden {
      display: none;
    }

    .side-sheet-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--md-sys-color-on-surface);
    }

    .side-sheet-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }

    @media (max-width: 839px) {
      .side-sheet {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 360px;
        box-shadow: var(--md-sys-elevation-level3);
      }
    }
  `;zo([d({type:String})],Je.prototype,"chatId",2);zo([f()],Je.prototype,"isConfigOpen",2);Je=zo([x("chat-view")],Je);/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class ii extends ze{constructor(){super(...arguments),this.buffer=0}renderIndicator(){const e={transform:`scaleX(${(this.indeterminate?1:this.value/this.max)*100}%)`},t=this.buffer??0,o=t>0,s={transform:`scaleX(${(this.indeterminate||!o?1:t/this.max)*100}%)`},a=this.indeterminate||!o||t>=this.max||this.value>=this.max;return l`
      <div class="dots" ?hidden=${a}></div>
      <div class="inactive-track" style=${Oe(s)}></div>
      <div class="bar primary-bar" style=${Oe(e)}>
        <div class="bar-inner"></div>
      </div>
      <div class="bar secondary-bar">
        <div class="bar-inner"></div>
      </div>
    `}}n([d({type:Number})],ii.prototype,"buffer",void 0);/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const si=g`:host{--_active-indicator-color: var(--md-linear-progress-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-height: var(--md-linear-progress-active-indicator-height, 4px);--_four-color-active-indicator-four-color: var(--md-linear-progress-four-color-active-indicator-four-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_four-color-active-indicator-one-color: var(--md-linear-progress-four-color-active-indicator-one-color, var(--md-sys-color-primary, #6750a4));--_four-color-active-indicator-three-color: var(--md-linear-progress-four-color-active-indicator-three-color, var(--md-sys-color-tertiary, #7d5260));--_four-color-active-indicator-two-color: var(--md-linear-progress-four-color-active-indicator-two-color, var(--md-sys-color-primary-container, #eaddff));--_track-color: var(--md-linear-progress-track-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_track-height: var(--md-linear-progress-track-height, 4px);--_track-shape: var(--md-linear-progress-track-shape, var(--md-sys-shape-corner-none, 0px));border-radius:var(--_track-shape);display:flex;position:relative;min-width:80px;height:var(--_track-height);content-visibility:auto;contain:strict}.progress,.dots,.inactive-track,.bar,.bar-inner{position:absolute}.progress{direction:ltr;inset:0;border-radius:inherit;overflow:hidden;display:flex;align-items:center}.bar{animation:none;width:100%;height:var(--_active-indicator-height);transform-origin:left center;transition:transform 250ms cubic-bezier(0.4, 0, 0.6, 1)}.secondary-bar{display:none}.bar-inner{inset:0;animation:none;background:var(--_active-indicator-color)}.inactive-track{background:var(--_track-color);inset:0;transition:transform 250ms cubic-bezier(0.4, 0, 0.6, 1);transform-origin:left center}.dots{inset:0;animation:linear infinite 250ms;animation-name:buffering;background-color:var(--_track-color);background-repeat:repeat-x;-webkit-mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");z-index:-1}.dots[hidden]{display:none}.indeterminate .bar{transition:none}.indeterminate .primary-bar{inset-inline-start:-145.167%}.indeterminate .secondary-bar{inset-inline-start:-54.8889%;display:block}.indeterminate .primary-bar{animation:linear infinite 2s;animation-name:primary-indeterminate-translate}.indeterminate .primary-bar>.bar-inner{animation:linear infinite 2s primary-indeterminate-scale}.indeterminate.four-color .primary-bar>.bar-inner{animation-name:primary-indeterminate-scale,four-color;animation-duration:2s,4s}.indeterminate .secondary-bar{animation:linear infinite 2s;animation-name:secondary-indeterminate-translate}.indeterminate .secondary-bar>.bar-inner{animation:linear infinite 2s secondary-indeterminate-scale}.indeterminate.four-color .secondary-bar>.bar-inner{animation-name:secondary-indeterminate-scale,four-color;animation-duration:2s,4s}:host(:dir(rtl)){transform:scale(-1)}@keyframes primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.00432);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes buffering{0%{transform:translateX(calc(var(--_track-height) / 2 * 5))}}@keyframes primary-indeterminate-translate{0%{transform:translateX(0px)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0px)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.6714%)}100%{transform:translateX(200.611%)}}@keyframes secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0px)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.6519%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.3862%)}100%{transform:translateX(160.278%)}}@keyframes four-color{0%{background:var(--_four-color-active-indicator-one-color)}15%{background:var(--_four-color-active-indicator-one-color)}25%{background:var(--_four-color-active-indicator-two-color)}40%{background:var(--_four-color-active-indicator-two-color)}50%{background:var(--_four-color-active-indicator-three-color)}65%{background:var(--_four-color-active-indicator-three-color)}75%{background:var(--_four-color-active-indicator-four-color)}90%{background:var(--_four-color-active-indicator-four-color)}100%{background:var(--_four-color-active-indicator-one-color)}}@media(forced-colors: active){:host{outline:1px solid CanvasText}.bar-inner,.dots{background-color:CanvasText}}
`;si.styleSheet;/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let co=class extends ii{};co.styles=[si];co=n([x("md-linear-progress")],co);var _a=Object.defineProperty,wa=Object.getOwnPropertyDescriptor,re=(r,e,t,o)=>{for(var i=o>1?void 0:o?wa(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&_a(e,t,i),i};let G=class extends b{constructor(){super(...arguments),this.open=!1,this.mode="folder",this.selectedPath="",this.projectName="",this.repoUrl="",this.cloneParentPath="",this.cloneProjectName="",this.isCloning=!1,this.errorMessage=""}updated(r){r.has("open")&&this.open&&(this.errorMessage="",this.isCloning=!1,this.mode="folder",this.selectedPath="",this.projectName="",this.repoUrl="",this.cloneParentPath="",this.cloneProjectName="")}show(){this.open=!0}close(){this.handleClose()}handleClose(){this.open=!1,this.dispatchEvent(new CustomEvent("dialog-closed",{bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}handleFolderBrowsed(r){this.mode==="folder"?(this.selectedPath=r.detail.path,this.projectName||(this.projectName=r.detail.name)):this.cloneParentPath=r.detail.path}handleFolderSelected(r){this.mode==="folder"?(this.selectedPath=r.detail.path,this.projectName=r.detail.name):this.cloneParentPath=r.detail.path}async handleCreateFromFolder(){if(!this.selectedPath||!this.projectName){this.errorMessage="Please select a folder and specify a project name.";return}try{this.errorMessage="";const r=await I.createProject(this.projectName,this.selectedPath);await y.loadProjects(),this.handleClose(),W.navigate(`/projects/${r.id}`)}catch(r){this.errorMessage=r?.message||"Failed to create project"}}async handleCloneRepository(){if(!this.repoUrl||!this.cloneParentPath){this.errorMessage="Please provide repository URL and destination parent directory.";return}try{this.errorMessage="",this.isCloning=!0;const r=await I.cloneProject({url:this.repoUrl,parent_path:this.cloneParentPath,name:this.cloneProjectName||void 0});await y.loadProjects(),this.handleClose(),W.navigate(`/projects/${r.id}`)}catch(r){this.errorMessage=r?.message||"Failed to clone repository"}finally{this.isCloning=!1}}render(){return l`
      <md-dialog ?open=${this.open} @closed=${this.handleClose}>
        <div slot="headline">
          <span>New Project</span>
        </div>

        <div slot="content" class="dialog-content">
          <!-- Mode Tabs -->
          <div class="mode-tabs">
            <button
              class="tab-btn ${this.mode==="folder"?"active":""}"
              @click=${()=>this.mode="folder"}
            >
              Existing Folder
            </button>
            <button
              class="tab-btn ${this.mode==="clone"?"active":""}"
              @click=${()=>this.mode="clone"}
            >
              Clone Repository
            </button>
          </div>

          ${this.errorMessage?l`<div class="error-box">${this.errorMessage}</div>`:""}

          <!-- Folder Mode -->
          ${this.mode==="folder"?l`
                <div class="field-group">
                  <span class="field-label">Select Project Directory</span>
                  <folder-picker
                    @folder-browsed=${this.handleFolderBrowsed}
                    @folder-selected=${this.handleFolderSelected}
                  ></folder-picker>
                </div>

                ${this.selectedPath?l`
                      <div class="field-group">
                        <span class="field-label">Selected Directory</span>
                        <div class="selected-path-card">${this.selectedPath}</div>
                      </div>

                      <div class="field-group">
                        <md-outlined-text-field
                          label="Project Display Name"
                          .value=${this.projectName}
                          @input=${r=>this.projectName=r.target.value}
                        ></md-outlined-text-field>
                      </div>
                    `:""}
              `:l`
                <!-- Clone Mode -->
                <div class="field-group">
                  <md-outlined-text-field
                    label="Git Repository URL (HTTPS or SSH)"
                    placeholder="https://github.com/org/repo.git or git@github.com:org/repo.git"
                    .value=${this.repoUrl}
                    @input=${r=>this.repoUrl=r.target.value}
                  ></md-outlined-text-field>
                </div>

                <div class="field-group">
                  <span class="field-label">Destination Parent Directory</span>
                  <folder-picker
                    @folder-browsed=${this.handleFolderBrowsed}
                    @folder-selected=${this.handleFolderSelected}
                  ></folder-picker>
                </div>

                ${this.cloneParentPath?l`
                      <div class="field-group">
                        <span class="field-label">Parent Path</span>
                        <div class="selected-path-card">${this.cloneParentPath}</div>
                      </div>
                    `:""}

                <div class="field-group">
                  <md-outlined-text-field
                    label="Project / Folder Name (optional, defaults from URL)"
                    .value=${this.cloneProjectName}
                    @input=${r=>this.cloneProjectName=r.target.value}
                  ></md-outlined-text-field>
                </div>

                ${this.isCloning?l`
                      <div class="field-group">
                        <span class="field-label">Cloning repository from Git...</span>
                        <md-linear-progress indeterminate></md-linear-progress>
                      </div>
                    `:""}
              `}
        </div>

        <div slot="actions">
          <md-text-button @click=${this.close} ?disabled=${this.isCloning}>
            Cancel
          </md-text-button>

          ${this.mode==="folder"?l`
                <md-filled-button
                  @click=${this.handleCreateFromFolder}
                  ?disabled=${!this.selectedPath||!this.projectName}
                >
                  Create Project
                </md-filled-button>
              `:l`
                <md-filled-button
                  @click=${this.handleCloneRepository}
                  ?disabled=${!this.repoUrl||!this.cloneParentPath||this.isCloning}
                >
                  Clone & Create
                </md-filled-button>
              `}
        </div>
      </md-dialog>
    `}};G.styles=g`
    :host {
      display: block;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 320px;
      max-width: 540px;
    }

    @media (min-width: 600px) {
      .dialog-content {
        min-width: 480px;
      }
    }

    .mode-tabs {
      display: flex;
      border-radius: var(--md-sys-shape-corner-full);
      background-color: var(--md-sys-color-surface-container-high);
      padding: 4px;
      gap: 4px;
    }

    .tab-btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: var(--md-sys-shape-corner-full);
      font-weight: 500;
      font-size: 0.85rem;
      color: var(--md-sys-color-on-surface-variant);
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background-color: var(--md-sys-color-surface);
      color: var(--md-sys-color-primary);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--md-sys-color-on-surface-variant);
    }

    .selected-path-card {
      padding: 10px 14px;
      background-color: var(--md-sys-color-surface-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-family: var(--md-sys-typescale-code-font);
      font-size: 0.8rem;
      word-break: break-all;
    }

    .error-box {
      padding: 10px 14px;
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: var(--md-sys-shape-corner-small);
      font-size: 0.85rem;
      white-space: pre-wrap;
    }
  `;re([d({type:Boolean})],G.prototype,"open",2);re([f()],G.prototype,"mode",2);re([f()],G.prototype,"selectedPath",2);re([f()],G.prototype,"projectName",2);re([f()],G.prototype,"repoUrl",2);re([f()],G.prototype,"cloneParentPath",2);re([f()],G.prototype,"cloneProjectName",2);re([f()],G.prototype,"isCloning",2);re([f()],G.prototype,"errorMessage",2);G=re([x("project-dialog")],G);var $a=Object.defineProperty,Ca=Object.getOwnPropertyDescriptor,Me=(r,e,t,o)=>{for(var i=o>1?void 0:o?Ca(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&$a(e,t,i),i};let ve=class extends b{constructor(){super(...arguments),this.projectId="",this.open=!1,this.selectedAgent="",this.creating=!1,this.errorMessage=""}updated(r){r.has("open")&&this.open&&(this.selectedAgent=y.agents[0]||"codex",this.creating=!1,this.errorMessage="")}show(r){r&&(this.projectId=r),this.open=!0}close(){this.handleClose()}handleClose(){this.open=!1,this.dispatchEvent(new CustomEvent("dialog-closed",{bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}async handleCreate(){if(!(!this.projectId||!this.selectedAgent)){this.creating=!0,this.errorMessage="";try{const r=await I.createChat(this.projectId,this.selectedAgent);await y.loadChats(this.projectId),this.handleClose(),W.navigate(`/projects/${this.projectId}/chats/${r.id}`)}catch(r){this.errorMessage=r?.message||"Failed to create chat"}finally{this.creating=!1}}}agentIcon(r){const e=r.toLowerCase();return e.includes("codex")?"terminal":e.includes("claude")?"smart_toy":e.includes("opencode")?"code":e.includes("gemini")||e.includes("antigravity")?"psychology":"robot_2"}render(){return l`
      <md-dialog ?open=${this.open} @closed=${this.handleClose}>
        <div slot="headline">Select Agent</div>

        <div slot="content">
          ${this.errorMessage?l`<div class="error-box">${this.errorMessage}</div>`:""}

          <div class="agent-grid">
            ${y.agents.map(r=>l`
                <div
                  class="agent-card ${this.selectedAgent===r?"selected":""}"
                  @click=${()=>this.selectedAgent=r}
                  role="button"
                  tabindex="0"
                  @keydown=${e=>{(e.key==="Enter"||e.key===" ")&&(this.selectedAgent=r)}}
                >
                  <md-icon class="material-symbols-outlined">
                    ${this.agentIcon(r)}
                  </md-icon>
                  <span class="name">${r}</span>
                </div>
              `)}
          </div>
        </div>

        <div slot="actions">
          <md-text-button @click=${this.handleClose} ?disabled=${this.creating}>
            Cancel
          </md-text-button>
          <md-filled-button
            @click=${this.handleCreate}
            ?disabled=${!this.selectedAgent||this.creating}
          >
            Start Chat
          </md-filled-button>
        </div>
      </md-dialog>
    `}};ve.styles=g`
    :host {
      display: block;
    }

    .agent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }

    .agent-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 16px;
      border-radius: var(--md-sys-shape-corner-medium);
      background-color: var(--md-sys-color-surface-container-low);
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      gap: 8px;
    }

    .agent-card:hover {
      background-color: var(--md-sys-color-surface-container);
      transform: translateY(-2px);
    }

    .agent-card.selected {
      background-color: var(--md-sys-color-primary-container);
      border-color: var(--md-sys-color-primary);
    }

    .agent-card md-icon {
      font-size: 32px;
      color: var(--md-sys-color-primary);
    }

    .agent-card .name {
      font-weight: 600;
      font-size: 0.95rem;
      text-transform: capitalize;
      color: var(--md-sys-color-on-surface);
    }

    .error-box {
      padding: 8px 12px;
      background-color: var(--md-sys-color-error-container);
      color: var(--md-sys-color-on-error-container);
      border-radius: 6px;
      font-size: 0.85rem;
      margin-bottom: 12px;
    }
  `;Me([d({type:String})],ve.prototype,"projectId",2);Me([d({type:Boolean})],ve.prototype,"open",2);Me([f()],ve.prototype,"selectedAgent",2);Me([f()],ve.prototype,"creating",2);Me([f()],ve.prototype,"errorMessage",2);ve=Me([x("agent-picker")],ve);var Ea=Object.defineProperty,ka=Object.getOwnPropertyDescriptor,be=(r,e,t,o)=>{for(var i=o>1?void 0:o?ka(e,t):e,s=r.length-1,a;s>=0;s--)(a=r[s])&&(i=(o?a(e,t,i):a(i))||i);return o&&i&&Ea(e,t,i),i};let J=class extends b{constructor(){super(...arguments),this.isProjectDialogOpen=!1,this.isAgentPickerOpen=!1,this.isProjectMenuOpen=!1,this.editingProject=null,this.isEditDialogOpen=!1,this.deletingProject=null,this.isDeleteDialogOpen=!1,this.openProjectDialog=()=>{this.isProjectDialogOpen=!0},this.openAgentPicker=()=>{this.isAgentPickerOpen=!0}}connectedCallback(){super.connectedCallback(),this.unsubscribeStore=y.subscribe(()=>{this.requestUpdate()})}disconnectedCallback(){this.unsubscribeStore&&this.unsubscribeStore(),super.disconnectedCallback()}handleBackdropClick(){y.isMobileDrawerOpen=!1}renderMainView(){const{activeProjectId:r,activeChatId:e,activeProject:t,chatsByProject:o}=y;if(e)return l`<chat-view .chatId=${e}></chat-view>`;if(r&&t){const i=o[r]||[];return l`
        <div class="project-overview">
          <div class="project-hero">
            <div>
              <h1 class="project-title">
                ${t.name}
              </h1>
              <div class="project-path">
                ${t.path}
              </div>
            </div>
            <div class="project-actions">
              <md-filled-button @click=${this.openAgentPicker}>
                <span class="icon" slot="icon">add_comment</span>
                New Chat
              </md-filled-button>
              <div class="menu-anchor">
                <md-icon-button
                  id="project-overview-menu-trigger"
                  @click=${()=>this.isProjectMenuOpen=!this.isProjectMenuOpen}
                >
                  <span class="icon">more_vert</span>
                </md-icon-button>
                <md-menu
                  anchor="project-overview-menu-trigger"
                  .open=${this.isProjectMenuOpen}
                  @closed=${()=>this.isProjectMenuOpen=!1}
                >
                  <md-menu-item
                    @click=${()=>{this.editingProject=t,this.isEditDialogOpen=!0,this.isProjectMenuOpen=!1}}
                  >
                    <div slot="headline">Edit Project</div>
                  </md-menu-item>
                  <md-menu-item
                    @click=${()=>{this.deletingProject=t,this.isDeleteDialogOpen=!0,this.isProjectMenuOpen=!1}}
                  >
                    <div
                      slot="headline"
                      class="danger-action"
                    >
                      Delete Project
                    </div>
                  </md-menu-item>
                </md-menu>
              </div>
            </div>
          </div>

          <h2 class="section-heading">
            Chats in this project (${i.length})
          </h2>

          <div class="chats-grid">
            ${i.map(s=>l`
                <div
                  class="chat-card"
                  @click=${()=>W.navigate(`/projects/${s.project_id}/chats/${s.id}`)}
                >
                  <div class="chat-card-header">
                    <span class="chat-agent-badge">
                      ${s.agent}
                    </span>
                    <span class="chat-state-label">
                      ${s.process_state||"STOPPED"}
                    </span>
                  </div>
                  <div class="chat-card-title">
                    ${s.title||"Untitled chat"}
                  </div>
                </div>
              `)}
            ${i.length===0?l`
                  <div class="chats-empty">
                    No chats in this project yet. Start a new chat with an
                    agent!
                  </div>
                `:null}
          </div>
        </div>
      `}return l`<project-list
      @open-new-project=${this.openProjectDialog}
    ></project-list>`}render(){const r=y.isMobileDrawerOpen,e=!y.activeChatId;return l`
      <!-- Drawer Backdrop for mobile/tablet -->
      <div
        class="drawer-backdrop ${r?"visible":""}"
        @click=${this.handleBackdropClick}
      ></div>

      <!-- Navigation Drawer -->
      <div class="drawer-wrapper ${r?"open":""}">
        <navigation-drawer
          @open-new-project=${this.openProjectDialog}
          @open-agent-picker=${this.openAgentPicker}
        ></navigation-drawer>
      </div>

      <!-- Main Content Area -->
      <div class="main-wrapper">
        <!-- Mobile Header (hidden on desktop or inside active chat) -->
        <header class="mobile-header ${e?"show":""}">
          <md-icon-button @click=${()=>y.isMobileDrawerOpen=!0}>
            <span class="icon">menu</span>
          </md-icon-button>
          <span class="mobile-title">
            ${y.activeProject?y.activeProject.name:"Agent Hub"}
          </span>
        </header>

        <div class="view-container">${this.renderMainView()}</div>
      </div>

      <!-- New Project Dialog -->
      <project-dialog
        .open=${this.isProjectDialogOpen}
        @dialog-closed=${()=>this.isProjectDialogOpen=!1}
        @close=${()=>this.isProjectDialogOpen=!1}
      ></project-dialog>

      <!-- New Chat Agent Picker Dialog -->
      <agent-picker
        .open=${this.isAgentPickerOpen}
        .projectId=${y.activeProjectId||""}
        @dialog-closed=${()=>this.isAgentPickerOpen=!1}
        @close=${()=>this.isAgentPickerOpen=!1}
      ></agent-picker>

      <!-- Edit Project Dialog -->
      <edit-project-dialog
        .open=${this.isEditDialogOpen}
        .project=${this.editingProject}
        @dialog-closed=${()=>this.isEditDialogOpen=!1}
        @close=${()=>this.isEditDialogOpen=!1}
      ></edit-project-dialog>

      <!-- Delete Project Dialog -->
      <delete-project-dialog
        .open=${this.isDeleteDialogOpen}
        .project=${this.deletingProject}
        @dialog-closed=${()=>this.isDeleteDialogOpen=!1}
        @close=${()=>this.isDeleteDialogOpen=!1}
      ></delete-project-dialog>
    `}};J.styles=g`
    :host {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: var(--md-sys-color-background);
      color: var(--md-sys-color-on-background);
      position: relative;
    }

    .main-wrapper {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      min-width: 0;
      overflow: hidden;
      position: relative;
    }

    .mobile-header {
      display: none;
      height: 56px;
      background-color: var(--md-sys-color-surface-container);
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      padding: 0 16px;
      align-items: center;
      gap: 12px;
      box-sizing: border-box;
    }

    .mobile-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .view-container {
      flex: 1;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    /* Modal drawer styles for medium and compact */
    .drawer-backdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 99;
      opacity: 0;
      transition: opacity 0.25s ease;
      pointer-events: none;
    }

    .drawer-backdrop.visible {
      opacity: 1;
      pointer-events: auto;
    }

    .drawer-wrapper {
      height: 100%;
      display: flex;
      z-index: 100;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (max-width: 839px) {
      .drawer-backdrop {
        display: block;
      }

      .drawer-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        transform: translateX(-100%);
      }

      .drawer-wrapper.open {
        transform: translateX(0);
        box-shadow: var(--md-sys-elevation-level3);
      }

      .mobile-header.show {
        display: flex;
      }
    }

    .project-overview {
      padding: 24px;
      height: 100%;
      overflow-y: auto;
      box-sizing: border-box;
      max-width: 860px;
      margin: 0 auto;
    }

    .project-hero {
      background-color: var(--md-sys-color-surface-container);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .project-title {
      margin: 0 0 6px;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .project-path {
      font-size: 0.875rem;
      color: var(--md-sys-color-outline);
      font-family: monospace;
    }

    .project-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-heading {
      font-size: 1.125rem;
      margin-bottom: 16px;
      font-weight: 600;
    }

    .chats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }

    .chat-card {
      background-color: var(--md-sys-color-surface-container-low);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      min-height: 48px;
      box-sizing: border-box;
      transition: border-color 0.15s ease, transform 0.15s ease;
    }

    .chat-card:hover {
      border-color: var(--md-sys-color-primary);
      transform: translateY(-1px);
    }

    .chat-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .chat-agent-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 6px;
      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);
      font-weight: 500;
    }

    .chat-state-label {
      font-size: 0.75rem;
      color: var(--md-sys-color-outline);
    }

    .chat-card-title {
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--md-sys-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chats-empty {
      grid-column: 1 / -1;
      padding: 32px;
      text-align: center;
      color: var(--md-sys-color-outline);
    }

    .danger-action {
      color: var(--md-sys-color-error);
    }

    .menu-anchor {
      position: relative;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
    }
  `;be([f()],J.prototype,"isProjectDialogOpen",2);be([f()],J.prototype,"isAgentPickerOpen",2);be([f()],J.prototype,"isProjectMenuOpen",2);be([f()],J.prototype,"editingProject",2);be([f()],J.prototype,"isEditDialogOpen",2);be([f()],J.prototype,"deletingProject",2);be([f()],J.prototype,"isDeleteDialogOpen",2);J=be([x("app-shell")],J);customElements.get("agent-hub-app")||customElements.define("agent-hub-app",class extends J{});console.log("Agent Hub initialized");
//# sourceMappingURL=index-XuVM3eCj.js.map
