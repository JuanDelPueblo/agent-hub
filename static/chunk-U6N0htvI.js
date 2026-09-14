var c0=Object.defineProperty;var l0=Object.defineProperties;var d0=Object.getOwnPropertyDescriptors;var sy=Object.getOwnPropertySymbols;var u0=Object.prototype.hasOwnProperty;var f0=Object.prototype.propertyIsEnumerable;var ay=(n,t,e)=>t in n?c0(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var p=(n,t)=>{for(var e in t||={})u0.call(t,e)&&ay(n,e,t[e]);if(sy)for(var e of sy(t))f0.call(t,e)&&ay(n,e,t[e]);return n};var S=(n,t)=>l0(n,d0(t));function Y(n){return typeof n==`function`}function h0(n){return Y(n?.lift)}function G(n){return t=>{if(h0(t))return t.lift(function(e){try{return n(e,this)}catch(i){this.error(i)}});throw new TypeError(`Unable to lift unknown Observable type`)}}function eo(n){let e=n(i=>{Error.call(i),i.stack=new Error().stack});return e.prototype=Object.create(Error.prototype),e.prototype.constructor=e,e}var Mc=eo(n=>function(e){n(this),this.message=e?`${e.length} errors occurred during unsubscription:
${e.map((i,r)=>`${r+1}) ${i.toString()}`).join(`
  `)}`:``,this.name=`UnsubscriptionError`,this.errors=e});function Ui(n,t){if(n){let e=n.indexOf(t);0<=e&&n.splice(e,1)}}var Q=class n{constructor(t){this.initialTeardown=t,this.closed=!1,this._parentage=null,this._finalizers=null}unsubscribe(){let t;if(!this.closed){this.closed=!0;let{_parentage:e}=this;if(e)if(this._parentage=null,Array.isArray(e))for(let o of e)o.remove(this);else e.remove(this);let{initialTeardown:i}=this;if(Y(i))try{i()}catch(o){t=o instanceof Mc?o.errors:[o]}let{_finalizers:r}=this;if(r){this._finalizers=null;for(let o of r)try{cy(o)}catch(s){t=t??[],s instanceof Mc?t=[...t,...s.errors]:t.push(s)}}if(t)throw new Mc(t)}}add(t){var e;if(t&&t!==this)if(this.closed)cy(t);else{if(t instanceof n){if(t.closed||t._hasParent(this))return;t._addParent(this)}(this._finalizers=(e=this._finalizers)!==null&&e!==void 0?e:[]).push(t)}}_hasParent(t){let{_parentage:e}=this;return e===t||Array.isArray(e)&&e.includes(t)}_addParent(t){let{_parentage:e}=this;this._parentage=Array.isArray(e)?(e.push(t),e):e?[e,t]:t}_removeParent(t){let{_parentage:e}=this;e===t?this._parentage=null:Array.isArray(e)&&Ui(e,t)}remove(t){let{_finalizers:e}=this;e&&Ui(e,t),t instanceof n&&t._removeParent(this)}};Q.EMPTY=(()=>{let n=new Q;return n.closed=!0,n})();var Tf=Q.EMPTY;function Tc(n){return n instanceof Q||n&&`closed`in n&&Y(n.remove)&&Y(n.add)&&Y(n.unsubscribe)}function cy(n){Y(n)?n():n.unsubscribe()}var Kt={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1};var to={setTimeout(n,t,...e){let{delegate:i}=to;return i?.setTimeout?i.setTimeout(n,t,...e):setTimeout(n,t,...e)},clearTimeout(n){let{delegate:t}=to;return(t?.clearTimeout||clearTimeout)(n)},delegate:void 0};function Ac(n){to.setTimeout(()=>{let{onUnhandledError:t}=Kt;if(t)t(n);else throw n})}function Hi(){}var ly=Af(`C`,void 0,void 0);function dy(n){return Af(`E`,void 0,n)}function uy(n){return Af(`N`,n,void 0)}function Af(n,t,e){return{kind:n,value:t,error:e}}var zi=null;function no(n){if(Kt.useDeprecatedSynchronousErrorHandling){let t=!zi;if(t&&(zi={errorThrown:!1,error:null}),n(),t){let{errorThrown:e,error:i}=zi;if(zi=null,e)throw i}}else n()}function fy(n){Kt.useDeprecatedSynchronousErrorHandling&&zi&&(zi.errorThrown=!0,zi.error=n)}var $i=class extends Q{constructor(t){super(),this.isStopped=!1,t?(this.destination=t,Tc(t)&&t.add(this)):this.destination=g0}static create(t,e,i){return new Qt(t,e,i)}next(t){this.isStopped?kf(uy(t),this):this._next(t)}error(t){this.isStopped?kf(dy(t),this):(this.isStopped=!0,this._error(t))}complete(){this.isStopped?kf(ly,this):(this.isStopped=!0,this._complete())}unsubscribe(){this.closed||(this.isStopped=!0,super.unsubscribe(),this.destination=null)}_next(t){this.destination.next(t)}_error(t){try{this.destination.error(t)}finally{this.unsubscribe()}}_complete(){try{this.destination.complete()}finally{this.unsubscribe()}}};var m0=Function.prototype.bind;function Rf(n,t){return m0.call(n,t)}var Of=class{constructor(t){this.partialObserver=t}next(t){let{partialObserver:e}=this;if(e.next)try{e.next(t)}catch(i){Rc(i)}}error(t){let{partialObserver:e}=this;if(e.error)try{e.error(t)}catch(i){Rc(i)}else Rc(t)}complete(){let{partialObserver:t}=this;if(t.complete)try{t.complete()}catch(e){Rc(e)}}};var Qt=class extends $i{constructor(t,e,i){super();let r;if(Y(t)||!t)r={next:t??void 0,error:e??void 0,complete:i??void 0};else{let o;this&&Kt.useDeprecatedNextContext?(o=Object.create(t),o.unsubscribe=()=>this.unsubscribe(),r={next:t.next&&Rf(t.next,o),error:t.error&&Rf(t.error,o),complete:t.complete&&Rf(t.complete,o)}):r=t}this.destination=new Of(r)}};function Rc(n){Kt.useDeprecatedSynchronousErrorHandling?fy(n):Ac(n)}function p0(n){throw n}function kf(n,t){let{onStoppedNotification:e}=Kt;e&&to.setTimeout(()=>e(n,t))}var g0={closed:!0,next:Hi,error:p0,complete:Hi};function Z(n,t,e,i,r){return new Pf(n,t,e,i,r)}var Pf=class extends $i{constructor(t,e,i,r,o,s){super(t),this.onFinalize=o,this.shouldUnsubscribe=s,this._next=e?function(a){try{e(a)}catch(c){t.error(c)}}:super._next,this._error=r?function(a){try{r(a)}catch(c){t.error(c)}finally{this.unsubscribe()}}:super._error,this._complete=i?function(){try{i()}catch(a){t.error(a)}finally{this.unsubscribe()}}:super._complete}unsubscribe(){var t;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){let{closed:e}=this;super.unsubscribe(),!e&&((t=this.onFinalize)===null||t===void 0||t.call(this))}}};function H(n,t){return G((e,i)=>{let r=0;e.subscribe(Z(i,o=>{i.next(n.call(t,o,r++))}))})}var io=typeof Symbol==`function`&&Symbol.observable||`@@observable`;function Mt(n){return n}function kc(...n){return Ff(n)}function Ff(n){return n.length===0?Mt:n.length===1?n[0]:function(e){return n.reduce((i,r)=>r(i),e)}}var V=class n{constructor(t){t&&(this._subscribe=t)}lift(t){let e=new n;return e.source=this,e.operator=t,e}subscribe(t,e,i){let r=y0(t)?t:new Qt(t,e,i);return no(()=>{let{operator:o,source:s}=this;r.add(o?o.call(r,s):s?this._subscribe(r):this._trySubscribe(r))}),r}_trySubscribe(t){try{return this._subscribe(t)}catch(e){t.error(e)}}forEach(t,e){return e=hy(e),new e((i,r)=>{let o=new Qt({next:s=>{try{t(s)}catch(a){r(a),o.unsubscribe()}},error:r,complete:i});this.subscribe(o)})}_subscribe(t){var e;return(e=this.source)===null||e===void 0?void 0:e.subscribe(t)}[io](){return this}pipe(...t){return Ff(t)(this)}toPromise(t){return t=hy(t),new t((e,i)=>{let r;this.subscribe(o=>r=o,o=>i(o),()=>e(r))})}};V.create=n=>new V(n);function hy(n){var t;return(t=n??Kt.Promise)!==null&&t!==void 0?t:Promise}function v0(n){return n&&Y(n.next)&&Y(n.error)&&Y(n.complete)}function y0(n){return n&&n instanceof $i||v0(n)&&Tc(n)}var my=eo(n=>function(){n(this),this.name=`ObjectUnsubscribedError`,this.message=`object unsubscribed`});var w=class extends V{constructor(){super(),this.closed=!1,this.currentObservers=null,this.observers=[],this.isStopped=!1,this.hasError=!1,this.thrownError=null}lift(t){let e=new Oc(this,this);return e.operator=t,e}_throwIfClosed(){if(this.closed)throw new my}next(t){no(()=>{if(this._throwIfClosed(),!this.isStopped){this.currentObservers||(this.currentObservers=Array.from(this.observers));for(let e of this.currentObservers)e.next(t)}})}error(t){no(()=>{if(this._throwIfClosed(),!this.isStopped){this.hasError=this.isStopped=!0,this.thrownError=t;let{observers:e}=this;for(;e.length;)e.shift().error(t)}})}complete(){no(()=>{if(this._throwIfClosed(),!this.isStopped){this.isStopped=!0;let{observers:t}=this;for(;t.length;)t.shift().complete()}})}unsubscribe(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null}get observed(){var t;return((t=this.observers)===null||t===void 0?void 0:t.length)>0}_trySubscribe(t){return this._throwIfClosed(),super._trySubscribe(t)}_subscribe(t){return this._throwIfClosed(),this._checkFinalizedStatuses(t),this._innerSubscribe(t)}_innerSubscribe(t){let{hasError:e,isStopped:i,observers:r}=this;return e||i?Tf:(this.currentObservers=null,r.push(t),new Q(()=>{this.currentObservers=null,Ui(r,t)}))}_checkFinalizedStatuses(t){let{hasError:e,thrownError:i,isStopped:r}=this;e?t.error(i):r&&t.complete()}asObservable(){let t=new V;return t.source=this,t}};w.create=(n,t)=>new Oc(n,t);var Oc=class extends w{constructor(t,e){super(),this.destination=t,this.source=e}next(t){var e,i;(i=(e=this.destination)===null||e===void 0?void 0:e.next)===null||i===void 0||i.call(e,t)}error(t){var e,i;(i=(e=this.destination)===null||e===void 0?void 0:e.error)===null||i===void 0||i.call(e,t)}complete(){var t,e;(e=(t=this.destination)===null||t===void 0?void 0:t.complete)===null||e===void 0||e.call(t)}_subscribe(t){var e,i;return(i=(e=this.source)===null||e===void 0?void 0:e.subscribe(t))!==null&&i!==void 0?i:Tf}};var He=class extends w{constructor(t){super(),this._value=t}get value(){return this.getValue()}_subscribe(t){let e=super._subscribe(t);return!e.closed&&t.next(this._value),e}getValue(){let{hasError:t,thrownError:e,_value:i}=this;if(t)throw e;return this._throwIfClosed(),i}next(t){super.next(this._value=t)}};var As={now(){return(As.delegate||Date).now()},delegate:void 0};var fi=class extends w{constructor(t=Infinity,e=Infinity,i=As){super(),this._bufferSize=t,this._windowTime=e,this._timestampProvider=i,this._buffer=[],this._infiniteTimeWindow=!0,this._infiniteTimeWindow=e===Infinity,this._bufferSize=Math.max(1,t),this._windowTime=Math.max(1,e)}next(t){let{isStopped:e,_buffer:i,_infiniteTimeWindow:r,_timestampProvider:o,_windowTime:s}=this;e||(i.push(t),!r&&i.push(o.now()+s)),this._trimBuffer(),super.next(t)}_subscribe(t){this._throwIfClosed(),this._trimBuffer();let e=this._innerSubscribe(t),{_infiniteTimeWindow:i,_buffer:r}=this,o=r.slice();for(let s=0;s<o.length&&!t.closed;s+=i?1:2)t.next(o[s]);return this._checkFinalizedStatuses(t),e}_trimBuffer(){let{_bufferSize:t,_timestampProvider:e,_buffer:i,_infiniteTimeWindow:r}=this,o=(r?1:2)*t;if(t<Infinity&&o<i.length&&i.splice(0,i.length-o),!r){let s=e.now(),a=0;for(let c=1;c<i.length&&i[c]<=s;c+=2)a=c;a&&i.splice(0,a+1)}}};var Pc=class extends Q{constructor(t,e){super()}schedule(t,e=0){return this}};var Rs={setInterval(n,t,...e){let{delegate:i}=Rs;return i?.setInterval?i.setInterval(n,t,...e):setInterval(n,t,...e)},clearInterval(n){let{delegate:t}=Rs;return(t?.clearInterval||clearInterval)(n)},delegate:void 0};var Fc=class extends Pc{constructor(t,e){super(t,e),this.scheduler=t,this.work=e,this.pending=!1}schedule(t,e=0){var i;if(this.closed)return this;this.state=t;let r=this.id,o=this.scheduler;return r!=null&&(this.id=this.recycleAsyncId(o,r,e)),this.pending=!0,this.delay=e,this.id=(i=this.id)!==null&&i!==void 0?i:this.requestAsyncId(o,this.id,e),this}requestAsyncId(t,e,i=0){return Rs.setInterval(t.flush.bind(t,this),i)}recycleAsyncId(t,e,i=0){if(i!=null&&this.delay===i&&this.pending===!1)return e;e!=null&&Rs.clearInterval(e)}execute(t,e){if(this.closed)return new Error(`executing a cancelled action`);this.pending=!1;let i=this._execute(t,e);if(i)return i;this.pending===!1&&this.id!=null&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))}_execute(t,e){let i=!1,r;try{this.work(t)}catch(o){i=!0,r=o||new Error(`Scheduled action threw falsy error`)}if(i)return this.unsubscribe(),r}unsubscribe(){if(!this.closed){let{id:t,scheduler:e}=this,{actions:i}=e;this.work=this.state=this.scheduler=null,this.pending=!1,Ui(i,this),t!=null&&(this.id=this.recycleAsyncId(e,t,null)),this.delay=null,super.unsubscribe()}}};var Lf=(()=>{class n{constructor(e,i=n.now){this.schedulerActionCtor=e,this.now=i}schedule(e,i=0,r){return new this.schedulerActionCtor(this,e).schedule(r,i)}}return n.now=As.now,n})();var Lc=class extends Lf{constructor(t,e=Lf.now){super(t,e),this.actions=[],this._active=!1}flush(t){let{actions:e}=this;if(this._active){e.push(t);return}let i;this._active=!0;do if(i=t.execute(t.state,t.delay))break;while(t=e.shift());if(this._active=!1,i){for(;t=e.shift();)t.unsubscribe();throw i}}};var Wi=new Lc(Fc);var py=Wi;var Re=new V(n=>n.complete());function jc(n){return n&&Y(n.schedule)}function jf(n){return n[n.length-1]}function Vc(n){return Y(jf(n))?n.pop():void 0}function pn(n){return jc(jf(n))?n.pop():void 0}function gy(n,t){return typeof jf(n)==`number`?n.pop():t}function yy(n,t,e,i){function r(o){return o instanceof e?o:new e(function(s){s(o)})}return new(e||(e=Promise))(function(o,s){function a(d){try{l(i.next(d))}catch(f){s(f)}}function c(d){try{l(i.throw(d))}catch(f){s(f)}}function l(d){d.done?o(d.value):r(d.value).then(a,c)}l((i=i.apply(n,t||[])).next())})}function vy(n){var t=typeof Symbol==`function`&&Symbol.iterator,e=t&&n[t],i=0;if(e)return e.call(n);if(n&&typeof n.length==`number`)return{next:function(){return n&&i>=n.length&&(n=void 0),{value:n&&n[i++],done:!n}}};throw new TypeError(t?`Object is not iterable.`:`Symbol.iterator is not defined.`)}function Gi(n){return this instanceof Gi?(this.v=n,this):new Gi(n)}function _y(n,t,e){if(!Symbol.asyncIterator)throw new TypeError(`Symbol.asyncIterator is not defined.`);var i=e.apply(n,t||[]),r,o=[];return r=Object.create((typeof AsyncIterator==`function`?AsyncIterator:Object).prototype),a(`next`),a(`throw`),a(`return`,s),r[Symbol.asyncIterator]=function(){return this},r;function s(m){return function(v){return Promise.resolve(v).then(m,f)}}function a(m,v){i[m]&&(r[m]=function(y){return new Promise(function(R,k){o.push([m,y,R,k])>1||c(m,y)})},v&&(r[m]=v(r[m])))}function c(m,v){try{l(i[m](v))}catch(y){h(o[0][3],y)}}function l(m){m.value instanceof Gi?Promise.resolve(m.value.v).then(d,f):h(o[0][2],m)}function d(m){c(`next`,m)}function f(m){c(`throw`,m)}function h(m,v){m(v),o.shift(),o.length&&c(o[0][0],o[0][1])}}function by(n){if(!Symbol.asyncIterator)throw new TypeError(`Symbol.asyncIterator is not defined.`);var t=n[Symbol.asyncIterator],e;return t?t.call(n):(n=typeof vy==`function`?vy(n):n[Symbol.iterator](),e={},i(`next`),i(`throw`),i(`return`),e[Symbol.asyncIterator]=function(){return this},e);function i(o){e[o]=n[o]&&function(s){return new Promise(function(a,c){s=n[o](s),r(a,c,s.done,s.value)})}}function r(o,s,a,c){Promise.resolve(c).then(function(l){o({value:l,done:a})},s)}}var Bc=(n=>n&&typeof n.length==`number`&&typeof n!=`function`);function Uc(n){return Y(n?.then)}function Hc(n){return Y(n[io])}function zc(n){return Symbol.asyncIterator&&Y(n?.[Symbol.asyncIterator])}function $c(n){return new TypeError(`You provided ${n!==null&&typeof n==`object`?`an invalid object`:`'${n}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)}function _0(){return typeof Symbol!=`function`||!Symbol.iterator?`@@iterator`:Symbol.iterator}var Wc=_0();function Gc(n){return Y(n?.[Wc])}function qc(n){return _y(this,arguments,function*(){let e=n.getReader();try{for(;;){let{value:i,done:r}=yield Gi(e.read());if(r)return yield Gi(void 0);yield yield Gi(i)}}finally{e.releaseLock()}})}function Yc(n){return Y(n?.getReader)}function ye(n){if(n instanceof V)return n;if(n!=null){if(Hc(n))return b0(n);if(Bc(n))return S0(n);if(Uc(n))return w0(n);if(zc(n))return Sy(n);if(Gc(n))return C0(n);if(Yc(n))return D0(n)}throw $c(n)}function b0(n){return new V(t=>{let e=n[io]();if(Y(e.subscribe))return e.subscribe(t);throw new TypeError(`Provided object does not correctly implement Symbol.observable`)})}function S0(n){return new V(t=>{for(let e=0;e<n.length&&!t.closed;e++)t.next(n[e]);t.complete()})}function w0(n){return new V(t=>{n.then(e=>{t.closed||(t.next(e),t.complete())},e=>t.error(e)).then(null,Ac)})}function C0(n){return new V(t=>{for(let e of n)if(t.next(e),t.closed)return;t.complete()})}function Sy(n){return new V(t=>{E0(n,t).catch(e=>t.error(e))})}function D0(n){return Sy(qc(n))}function E0(n,t){var e,i,r,o;return yy(this,void 0,void 0,function*(){try{for(e=by(n);i=yield e.next(),!i.done;){let s=i.value;if(t.next(s),t.closed)return}}catch(s){r={error:s}}finally{try{i&&!i.done&&(o=e.return)&&(yield o.call(e))}finally{if(r)throw r.error}}t.complete()})}function Dt(n,t,e,i=0,r=!1){let o=t.schedule(function(){e(),r?n.add(this.schedule(null,i)):this.unsubscribe()},i);if(n.add(o),!r)return o}function Zc(n,t=0){return G((e,i)=>{e.subscribe(Z(i,r=>Dt(i,n,()=>i.next(r),t),()=>Dt(i,n,()=>i.complete(),t),r=>Dt(i,n,()=>i.error(r),t)))})}function Kc(n,t=0){return G((e,i)=>{i.add(n.schedule(()=>e.subscribe(i),t))})}function wy(n,t){return ye(n).pipe(Kc(t),Zc(t))}function Cy(n,t){return ye(n).pipe(Kc(t),Zc(t))}function Dy(n,t){return new V(e=>{let i=0;return t.schedule(function(){i===n.length?e.complete():(e.next(n[i++]),e.closed||this.schedule())})})}function Ey(n,t){return new V(e=>{let i;return Dt(e,t,()=>{i=n[Wc](),Dt(e,t,()=>{let r,o;try{({value:r,done:o}=i.next())}catch(s){e.error(s);return}o?e.complete():e.next(r)},0,!0)}),()=>Y(i?.return)&&i.return()})}function Qc(n,t){if(!n)throw new Error(`Iterable cannot be null`);return new V(e=>{Dt(e,t,()=>{let i=n[Symbol.asyncIterator]();Dt(e,t,()=>{i.next().then(r=>{r.done?e.complete():e.next(r.value)})},0,!0)})})}function xy(n,t){return Qc(qc(n),t)}function Iy(n,t){if(n!=null){if(Hc(n))return wy(n,t);if(Bc(n))return Dy(n,t);if(Uc(n))return Cy(n,t);if(zc(n))return Qc(n,t);if(Gc(n))return Ey(n,t);if(Yc(n))return xy(n,t)}throw $c(n)}function Ee(n,t){return t?Iy(n,t):ye(n)}function F(...n){return Ee(n,pn(n))}function ks(n,t){let e=Y(n)?n:()=>n,i=r=>r.error(e());return new V(t?r=>t.schedule(i,0,r):i)}function Os(n){return!!n&&(n instanceof V||Y(n.lift)&&Y(n.subscribe))}var Ln=eo(n=>function(){n(this),this.name=`EmptyError`,this.message=`no elements in sequence`});function Vf(n,t){let e=typeof t==`object`;return new Promise((i,r)=>{let o=new Qt({next:s=>{i(s),o.unsubscribe()},error:r,complete:()=>{e?i(t.defaultValue):r(new Ln)}});n.subscribe(o)})}function Ny(n){return n instanceof Date&&!isNaN(n)}var{isArray:x0}=Array;function I0(n,t){return x0(t)?n(...t):n(t)}function Xc(n){return H(t=>I0(n,t))}var{isArray:N0}=Array,{getPrototypeOf:M0,prototype:T0,keys:A0}=Object;function Jc(n){if(n.length===1){let t=n[0];if(N0(t))return{args:t,keys:null};if(R0(t)){let e=A0(t);return{args:e.map(i=>t[i]),keys:e}}}return{args:n,keys:null}}function R0(n){return n&&typeof n==`object`&&M0(n)===T0}function el(n,t){return n.reduce((e,i,r)=>(e[i]=t[r],e),{})}function Ps(...n){let t=pn(n),e=Vc(n),{args:i,keys:r}=Jc(n);if(i.length===0)return Ee([],t);let o=new V(k0(i,t,r?s=>el(r,s):Mt));return e?o.pipe(Xc(e)):o}function k0(n,t,e=Mt){return i=>{My(t,()=>{let{length:r}=n,o=new Array(r),s=r,a=r;for(let c=0;c<r;c++)My(t,()=>{let l=Ee(n[c],t),d=!1;l.subscribe(Z(i,f=>{o[c]=f,d||(d=!0,a--),a||i.next(e(o.slice()))},()=>{--s||i.complete()}))},i)},i)}}function My(n,t,e){n?Dt(e,n,t):t()}function Ty(n,t,e,i,r,o,s,a){let c=[],l=0,d=0,f=!1,h=()=>{f&&!c.length&&!l&&t.complete()},m=y=>l<i?v(y):c.push(y),v=y=>{o&&t.next(y),l++;let R=!1;ye(e(y,d++)).subscribe(Z(t,k=>{r?.(k),o?m(k):t.next(k)},()=>{R=!0},void 0,()=>{if(R)try{for(l--;c.length&&l<i;){let k=c.shift();s?Dt(t,s,()=>v(k)):v(k)}h()}catch(k){t.error(k)}}))};return n.subscribe(Z(t,m,()=>{f=!0,h()})),()=>{a?.()}}function Ye(n,t,e=Infinity){return Y(t)?Ye((i,r)=>H((o,s)=>t(i,o,r,s))(ye(n(i,r))),e):(typeof t==`number`&&(e=t),G((i,r)=>Ty(i,r,n,e)))}function hi(n=Infinity){return Ye(Mt,n)}function Ay(){return hi(1)}function gn(...n){return Ay()(Ee(n,pn(n)))}function jn(n){return new V(t=>{ye(n()).subscribe(t)})}function Fs(...n){let t=Vc(n),{args:e,keys:i}=Jc(n),r=new V(o=>{let{length:s}=e;if(!s){o.complete();return}let a=new Array(s),c=s,l=s;for(let d=0;d<s;d++){let f=!1;ye(e[d]).subscribe(Z(o,h=>{f||(f=!0,l--),a[d]=h},()=>c--,void 0,()=>{(!c||!f)&&(l||o.next(i?el(i,a):a),o.complete())}))}});return t?r.pipe(Xc(t)):r}function Ls(n=0,t,e=py){let i=-1;return t!=null&&(jc(t)?e=t:i=t),new V(r=>{let o=Ny(n)?+n-e.now():n;o<0&&(o=0);let s=0;return e.schedule(function(){r.closed||(r.next(s++),0<=i?this.schedule(void 0,i):r.complete())},o)})}function Xt(...n){let t=pn(n),e=gy(n,Infinity),i=n;return i.length?i.length===1?ye(i[0]):hi(e)(Ee(i,t)):Re}function re(n,t){return G((e,i)=>{let r=0;e.subscribe(Z(i,o=>n.call(t,o,r++)&&i.next(o)))})}function Ry(n){return G((t,e)=>{let i=!1,r=null,o=null,s=!1,a=()=>{if(o?.unsubscribe(),o=null,i){i=!1;let l=r;r=null,e.next(l)}s&&e.complete()},c=()=>{o=null,s&&e.complete()};t.subscribe(Z(e,l=>{i=!0,r=l,o||ye(n(l)).subscribe(o=Z(e,a,c))},()=>{s=!0,(!i||!o||o.closed)&&e.complete()}))})}function ro(n,t=Wi){return Ry(()=>Ls(n,t))}function mi(n){return G((t,e)=>{let i=null,r=!1,o;i=t.subscribe(Z(e,void 0,void 0,s=>{o=ye(n(s,mi(n)(t))),i?(i.unsubscribe(),i=null,o.subscribe(e)):r=!0})),r&&(i.unsubscribe(),i=null,o.subscribe(e))})}function qi(n,t){return Y(t)?Ye(n,t,1):Ye(n,1)}function Yi(n,t=Wi){return G((e,i)=>{let r=null,o=null,s=null,a=()=>{if(r){r.unsubscribe(),r=null;let l=o;o=null,i.next(l)}};function c(){let l=s+n,d=t.now();if(d<l){r=this.schedule(void 0,l-d),i.add(r);return}a()}e.subscribe(Z(i,l=>{o=l,s=t.now(),r||(r=t.schedule(c,n),i.add(r))},()=>{a(),i.complete()},void 0,()=>{o=r=null}))})}function ky(n){return G((t,e)=>{let i=!1;t.subscribe(Z(e,r=>{i=!0,e.next(r)},()=>{i||e.next(n),e.complete()}))})}function xe(n){return n<=0?()=>Re:G((t,e)=>{let i=0;t.subscribe(Z(e,r=>{++i<=n&&(e.next(r),n<=i&&e.complete())}))})}function Oy(){return G((n,t)=>{n.subscribe(Z(t,Hi))})}function Bf(n){return H(()=>n)}function Uf(n,t){return t?e=>gn(t.pipe(xe(1),Oy()),e.pipe(Uf(n))):Ye((e,i)=>ye(n(e,i)).pipe(xe(1),Bf(e)))}function O0(n,t=Wi){let e=Ls(n,t);return Uf(()=>e)}function tl(n,t=Mt){return n=n??P0,G((e,i)=>{let r,o=!0;e.subscribe(Z(i,s=>{let a=t(s);(o||!n(r,a))&&(o=!1,r=a,i.next(s))}))})}function P0(n,t){return n===t}function Py(n=F0){return G((t,e)=>{let i=!1;t.subscribe(Z(e,r=>{i=!0,e.next(r)},()=>i?e.complete():e.error(n())))})}function F0(){return new Ln}function Zi(n){return G((t,e)=>{try{t.subscribe(e)}finally{e.add(n)}})}function Vn(n,t){let e=arguments.length>=2;return i=>i.pipe(n?re((r,o)=>n(r,o,i)):Mt,xe(1),e?ky(t):Py(()=>new Ln))}function nl(n){return n<=0?()=>Re:G((t,e)=>{let i=[];t.subscribe(Z(e,r=>{i.push(r),n<i.length&&i.shift()},()=>{for(let r of i)e.next(r);e.complete()},void 0,()=>{i=null}))})}function il(){return G((n,t)=>{let e,i=!1;n.subscribe(Z(t,r=>{let o=e;e=r,i&&t.next([o,r]),i=!0}))})}function js(n={}){let{connector:t=()=>new w,resetOnError:e=!0,resetOnComplete:i=!0,resetOnRefCountZero:r=!0}=n;return o=>{let s,a,c,l=0,d=!1,f=!1,h=()=>{a?.unsubscribe(),a=void 0},m=()=>{h(),s=c=void 0,d=f=!1},v=()=>{let y=s;m(),y?.unsubscribe()};return G((y,R)=>{l++,!f&&!d&&h();let k=c=c??t();R.add(()=>{l--,l===0&&!f&&!d&&(a=Hf(v,r))}),k.subscribe(R),!s&&l>0&&(s=new Qt({next:Se=>k.next(Se),error:Se=>{f=!0,h(),a=Hf(m,e,Se),k.error(Se)},complete:()=>{d=!0,h(),a=Hf(m,i),k.complete()}}),ye(y).subscribe(s))})(o)}}function Hf(n,t,...e){if(t===!0){n();return}if(t===!1)return;let i=new Qt({next:()=>{i.unsubscribe(),n()}});return ye(t(...e)).subscribe(i)}function rl(n,t,e){let i,r=!1;return n&&typeof n==`object`?{bufferSize:i=Infinity,windowTime:t=Infinity,refCount:r=!1,scheduler:e}=n:i=n??Infinity,js({connector:()=>new fi(i,t,e),resetOnError:!0,resetOnComplete:!1,resetOnRefCountZero:r})}function Vs(n){return re((t,e)=>n<=e)}function st(...n){let t=pn(n);return G((e,i)=>{(t?gn(n,e,t):gn(n,e)).subscribe(i)})}function et(n,t){return G((e,i)=>{let r=null,o=0,s=!1,a=()=>s&&!r&&i.complete();e.subscribe(Z(i,c=>{r?.unsubscribe();let l=0,d=o++;ye(n(c,d)).subscribe(r=Z(i,f=>i.next(t?t(c,f,d,l++):f),()=>{r=null,a()}))},()=>{s=!0,a()}))})}function at(n){return G((t,e)=>{ye(n).subscribe(Z(e,()=>e.complete(),Hi)),!e.closed&&t.subscribe(e)})}function zf(n,t=!1){return G((e,i)=>{let r=0;e.subscribe(Z(i,o=>{let s=n(o,r++);(s||t)&&i.next(o),!s&&i.complete()}))})}function Ze(n,t,e){let i=Y(n)||t||e?{next:n,error:t,complete:e}:n;return i?G((r,o)=>{var s;(s=i.subscribe)===null||s===void 0||s.call(i);let a=!0;r.subscribe(Z(o,c=>{var l;(l=i.next)===null||l===void 0||l.call(i,c),o.next(c)},()=>{var c;a=!1,(c=i.complete)===null||c===void 0||c.call(i),o.complete()},c=>{var l;a=!1,(l=i.error)===null||l===void 0||l.call(i,c),o.error(c)},()=>{var c,l;a&&((c=i.unsubscribe)===null||c===void 0||c.call(i)),(l=i.finalize)===null||l===void 0||l.call(i)}))}):Mt}var mt=null;var ol=!1;var Ki=1;var L0=null;var Ce=Symbol(`SIGNAL`);function O(n){let t=mt;return mt=n,t}function sl(){return mt}var Bn={version:0,lastCleanEpoch:0,dirty:!1,producers:void 0,producersTail:void 0,consumers:void 0,consumersTail:void 0,recomputing:!1,consumerAllowSignalWrites:!1,consumerIsAlwaysLive:!1,kind:`unknown`,producerMustRecompute:()=>!1,producerRecomputeValue:()=>{},consumerMarkedDirty:()=>{},consumerOnSignalRead:()=>{}};function pi(n){if(ol)throw new Error(``);if(mt===null)return;mt.consumerOnSignalRead(n);let t=mt.producersTail;if(t!==void 0&&t.producer===n)return;let e,i=mt.recomputing;if(i&&(e=t!==void 0?t.nextProducer:mt.producers,e!==void 0&&e.producer===n)){mt.producersTail=e,e.lastReadVersion=n.version,e.knownValidAtEpoch=Ki;return}let r=n.consumersTail;if(r!==void 0&&r.consumer===mt&&(!i||r.knownValidAtEpoch===Ki))return;let o=so(mt),s={producer:n,consumer:mt,nextProducer:e,prevConsumer:void 0,knownValidAtEpoch:Ki,lastReadVersion:n.version,nextConsumer:void 0};mt.producersTail=s,t!==void 0?t.nextProducer=s:mt.producers=s,o&&By(n,s)}function Fy(){Ki++}function Ji(n){if(!(so(n)&&!n.dirty)&&!(!n.dirty&&n.lastCleanEpoch===Ki)){if(!n.producerMustRecompute(n)&&!er(n)){oo(n);return}n.producerRecomputeValue(n),oo(n)}}function $f(n){if(n.consumers===void 0)return;let t=ol;ol=!0;try{for(let e=n.consumers;e!==void 0;e=e.nextConsumer){let i=e.consumer;i.dirty||Ly(i)}}finally{ol=t}}function Wf(){return mt?.consumerAllowSignalWrites!==!1}function Ly(n){n.dirty=!0,$f(n),n.consumerMarkedDirty?.(n)}function oo(n){n.dirty=!1,n.lastCleanEpoch=Ki}function yn(n){return n&&jy(n),O(n)}function jy(n){if(n.producersTail?.knownValidAtEpoch===Ki){let t=n.producers;for(;t!==void 0;)t.knownValidAtEpoch=null,t=t.nextProducer}n.producersTail=void 0,n.recomputing=!0}function Un(n,t){O(t),n&&Vy(n)}function Vy(n){n.recomputing=!1;let t=n.producersTail,e=t!==void 0?t.nextProducer:n.producers;if(e!==void 0){if(so(n))do e=Gf(e);while(e!==void 0);t!==void 0?t.nextProducer=void 0:n.producers=void 0}}function er(n){for(let t=n.producers;t!==void 0;t=t.nextProducer){let e=t.producer,i=t.lastReadVersion;if(i!==e.version||(Ji(e),i!==e.version))return!0}return!1}function Hn(n){if(so(n)){let t=n.producers;for(;t!==void 0;)t=Gf(t)}n.producers=void 0,n.producersTail=void 0,n.consumers=void 0,n.consumersTail=void 0}function By(n,t){let e=n.consumersTail,i=so(n);if(e!==void 0?(t.nextConsumer=e.nextConsumer,e.nextConsumer=t):(t.nextConsumer=void 0,n.consumers=t),t.prevConsumer=e,n.consumersTail=t,!i)for(let r=n.producers;r!==void 0;r=r.nextProducer)By(r.producer,r)}function Gf(n){let t=n.producer,e=n.nextProducer,i=n.nextConsumer,r=n.prevConsumer;if(n.nextConsumer=void 0,n.prevConsumer=void 0,i!==void 0?i.prevConsumer=r:t.consumersTail=r,r!==void 0)r.nextConsumer=i;else if(t.consumers=i,!so(t)){let o=t.producers;for(;o!==void 0;)o=Gf(o)}return e}function so(n){return n.consumerIsAlwaysLive||n.consumers!==void 0}function Bs(n){L0?.(n)}function Us(n,t){return Object.is(n,t)}function Hs(n,t){let e=Object.create(j0);e.computation=n,t!==void 0&&(e.equal=t);let i=()=>{if(Ji(e),pi(e),e.value===vn)throw e.error;return e.value};return i[Ce]=e,Bs(e),i}var Qi=Symbol(`UNSET`);var Xi=Symbol(`COMPUTING`);var vn=Symbol(`ERRORED`);var j0=S(p({},Bn),{value:Qi,dirty:!0,error:null,equal:Us,kind:`computed`,producerMustRecompute(n){return n.value===Qi||n.value===Xi},producerRecomputeValue(n){if(n.value===Xi)throw new Error(``);let t=n.value;n.value=Xi;let e=yn(n),i,r=!1;try{i=n.computation(),O(null),r=t!==Qi&&t!==vn&&i!==vn&&n.equal(t,i)}catch(o){i=vn,n.error=o}finally{Un(n,e)}if(r){n.value=t;return}n.value=i,n.version++}});function V0(){throw new Error}var Uy=V0;function Hy(n){Uy(n)}function qf(n){Uy=n}var B0=null;function Yf(n,t){let e=Object.create(ao);e.value=n,t!==void 0&&(e.equal=t);let i=()=>zy(e);return i[Ce]=e,Bs(e),[i,s=>gi(e,s),s=>al(e,s)]}function zy(n){return pi(n),n.value}function gi(n,t){Wf()||Hy(n),n.equal(n.value,t)||(n.value=t,U0(n))}function al(n,t){Wf()||Hy(n),gi(n,t(n.value))}var ao=S(p({},Bn),{equal:Us,value:void 0,kind:`signal`});function U0(n){n.version++,Fy(),$f(n),B0?.(n)}var Zf=S(p({},Bn),{consumerIsAlwaysLive:!0,consumerAllowSignalWrites:!0,dirty:!0,kind:`effect`});function Kf(n){if(n.dirty=!1,n.version>0&&!er(n))return;n.version++;let t=yn(n);try{n.cleanup(),n.fn()}finally{Un(n,t)}}var Qf;function cl(){return Qf}function _n(n){let t=Qf;return Qf=n,t}var $y=Symbol(`NotFound`);function co(n){return n===$y||n?.name===`ɵNotFound`}function Xf(n,t,e){let i=Object.create(H0);i.source=n,i.computation=t,e!=null&&(i.equal=e);let o=()=>{if(Ji(i),pi(i),i.value===vn)throw i.error;return i.value};return o[Ce]=i,Bs(i),o}function Jf(n,t){Ji(n),gi(n,t),oo(n)}function Wy(n,t){if(Ji(n),n.value===vn)throw n.error;al(n,t),oo(n)}var H0=S(p({},Bn),{value:Qi,dirty:!0,error:null,equal:Us,kind:`linkedSignal`,producerMustRecompute(n){return n.value===Qi||n.value===Xi},producerRecomputeValue(n){if(n.value===Xi)throw new Error(``);let t=n.value;n.value=Xi;let e=yn(n),i,r=!1;try{let o=n.source(),s=t!==Qi&&t!==vn,a=s?{source:n.sourceValue,value:t}:void 0;i=n.computation(o,a),n.sourceValue=o,O(null),r=s&&i!==vn&&n.equal(t,i)}catch(o){i=vn,n.error=o}finally{Un(n,e)}if(r){n.value=t;return}n.value=i,n.version++}});function Gy(n){let t=O(null);try{return n()}finally{O(t)}}var pl=`https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss`;var _=class extends Error{code;constructor(t,e){super(Jt(t,e)),this.code=t}};function z0(n){return`NG0${Math.abs(n)}`}function Jt(n,t){return`${z0(n)}${t?`: `+t:``}`}function me(n){for(let t in n)if(n[t]===me)return t;throw Error(``)}function Xy(n,t){for(let e in t)Object.hasOwn(t,e)&&!Object.hasOwn(n,e)&&(n[e]=t[e])}function Zs(n){if(typeof n==`string`)return n;if(Array.isArray(n))return`[${n.map(Zs).join(`, `)}]`;if(n==null)return``+n;let t=n.overriddenName||n.name;if(t)return`${t}`;let e=n.toString();if(e==null)return``+e;let i=e.indexOf(`
`);return i>=0?e.slice(0,i):e}function gl(n,t){return n?t?`${n} ${t}`:n:t||``}var $0=me({__forward_ref__:me});function Bt(n){return n.__forward_ref__=Bt,n}function ze(n){return mh(n)?n():n}function mh(n){return typeof n==`function`&&Object.hasOwn(n,$0)&&n.__forward_ref__===Bt}function W(n){return{token:n.token,providedIn:n.providedIn||null,factory:n.factory,value:void 0}}function U(n){return{providers:n.providers||[],imports:n.imports||[]}}function Ks(n){return W0(n,vl)}function ph(n){return Ks(n)!==null}function W0(n,t){return Object.hasOwn(n,t)&&n[t]||null}function G0(n){return(n?.[vl]??null)||null}function th(n){return n&&Object.hasOwn(n,dl)?n[dl]:null}var vl=me({ɵprov:me});var dl=me({ɵinj:me});var g=class{_desc;ngMetadataName=`InjectionToken`;ɵprov;constructor(t,e){this._desc=t,this.ɵprov=void 0,typeof e==`number`?this.__NG_ELEMENT_ID__=e:e!==void 0&&(this.ɵprov=W({token:this,providedIn:e.providedIn||`root`,factory:e.factory}))}get multi(){return this}toString(){return`InjectionToken ${this._desc}`}};function gh(n){return n&&!!n.ɵproviders}var Qs=me({ɵcmp:me});var Xs=me({ɵdir:me});var vh=me({ɵpipe:me});var yh=me({ɵmod:me});var Ws=me({ɵfac:me});var ar=me({__NG_ELEMENT_ID__:me});var qy=me({__NG_ENV_ID__:me});function Jy(n){return _l(n,`@NgModule`),n[yh]||null}function yi(n){return _l(n,`@Component`),n[Qs]||null}function yl(n){return _l(n,`@Directive`),n[Xs]||null}function e_(n){return _l(n,`@Pipe`),n[vh]||null}function _l(n,t){if(n==null)throw new _(-919,!1)}function cr(n){return typeof n==`string`?n:n==null?``:String(n)}var t_=me({ngErrorCode:me});var q0=me({ngErrorMessage:me});var Y0=me({ngTokenPath:me});function _h(n,t){return n_(``,-200,t)}function bl(n,t){throw new _(-201,!1)}function n_(n,t,e){let i=new _(t,n);return i[t_]=t,i[q0]=n,e&&(i[Y0]=e),i}function Z0(n){return n[t_]}var nh;function i_(){return nh}function Tt(n){let t=nh;return nh=n,t}function bh(n,t,e){let i=Ks(n);if(i&&i.providedIn==`root`)return i.value===void 0?i.value=i.factory():i.value;if(e&8)return null;if(t!==void 0)return t;bl(n,``)}var _i=globalThis;var tr={};var Q0=`__NG_DI_FLAG__`;var ih=class{injector;constructor(t){this.injector=t}retrieve(t,e){let i=nr(e)||0;try{return this.injector.get(t,i&8?null:tr,i)}catch(r){if(co(r))return r;throw r}}};function X0(n,t=0){let e=cl();if(e===void 0)throw new _(-203,!1);if(e===null)return bh(n,void 0,t);{let i=J0(t),r=e.retrieve(n,i);if(co(r)){if(i.optional)return null;throw r}return r}}function P(n,t=0){return(i_()||X0)(ze(n),t)}function u(n,t){return P(n,nr(t))}function nr(n){return typeof n>`u`||typeof n==`number`?n:0|(n.optional&&8)|(n.host&&1)|(n.self&&2)|(n.skipSelf&&4)}function J0(n){return{optional:!!(n&8),host:!!(n&1),self:!!(n&2),skipSelf:!!(n&4)}}function rh(n){let t=[];for(let e=0;e<n.length;e++){let i=ze(n[e]);if(Array.isArray(i)){if(i.length===0)throw new _(900,!1);let r,o=0;for(let s=0;s<i.length;s++){let a=i[s],c=eI(a);typeof c==`number`?c===-1?r=a.token:o|=c:r=a}t.push(P(r,o))}else t.push(P(i))}return t}function eI(n){return n[Q0]}function ir(n,t){return Object.hasOwn(n,Ws)?n[Ws]:null}function r_(n,t,e){if(n.length!==t.length)return!1;for(let i=0;i<n.length;i++){let r=n[i],o=t[i];if(e&&(r=e(r),o=e(o)),o!==r)return!1}return!0}function o_(n){return n.flat(Number.POSITIVE_INFINITY)}function Sl(n,t){n.forEach(e=>Array.isArray(e)?Sl(e,t):t(e))}function Sh(n,t,e){t>=n.length?n.push(e):n.splice(t,0,e)}function Js(n,t){return t>=n.length-1?n.pop():n.splice(t,1)[0]}function s_(n,t){let e=[];for(let i=0;i<n;i++)e.push(t);return e}function a_(n,t,e,i){let r=n.length;if(r==t)n.push(e,i);else if(r===1)n.push(i,n[0]),n[0]=e;else{for(r--,n.push(n[r-1],n[r]);r>t;)n[r]=n[r-2],r--;n[t]=e,n[t+1]=i}}function wl(n,t,e){let i=fo(n,t);return i>=0?n[i|1]=e:(i=~i,a_(n,i,t,e)),i}function Cl(n,t){let e=fo(n,t);if(e>=0)return n[e|1]}function fo(n,t){return tI(n,t,1)}function tI(n,t,e){let i=0,r=n.length>>e;for(;r!==i;){let o=i+(r-i>>1),s=n[o<<e];if(t===s)return o<<e;s>t?r=o:i=o+1}return~(r<<e)}var bi={};var ct=[];var ho=new g(``);var ea=new g(``,-1);var wh=new g(``);var uo=class{get(t,e=tr){if(e===tr){let r=n_(``,-201);throw r.name=`ɵNotFound`,r}return e}};function Sn(n){return{ɵproviders:n}}function c_(...n){return{ɵproviders:Ch(!0,n),ɵfromNgModule:!0}}function Ch(n,...t){let e=[],i=new Set,r,o=s=>{e.push(s)};return Sl(t,s=>{let a=s;ul(a,o,[],i)&&(r||=[],r.push(a))}),r!==void 0&&l_(r,o),e}function l_(n,t){for(let e=0;e<n.length;e++){let{ngModule:i,providers:r}=n[e];Dh(r,o=>{t(o,i)})}}function ul(n,t,e,i){if(n=ze(n),!n)return!1;let r=null,o=th(n),s=!o&&yi(n);if(!o&&!s){let c=n.ngModule;if(o=th(c),o)r=c;else return!1}else{if(s&&!s.standalone)return!1;r=n}let a=i.has(r);if(s){if(a)return!1;if(i.add(r),s.dependencies){let c=typeof s.dependencies==`function`?s.dependencies():s.dependencies;for(let l of c)ul(l,t,e,i)}}else if(o){if(o.imports!=null&&!a){i.add(r);let l;Sl(o.imports,d=>{ul(d,t,e,i)&&(l||=[],l.push(d))}),l!==void 0&&l_(l,t)}if(!a){let l=ir(r)||(()=>new r);t({provide:r,useFactory:l,deps:ct},r),t({provide:wh,useValue:r,multi:!0},r),t({provide:ho,useValue:()=>P(r),multi:!0},r)}let c=o.providers;if(c!=null&&!a){let l=n;Dh(c,d=>{t(d,l)})}}else return!1;return r!==n&&n.providers!==void 0}function Dh(n,t){for(let e of n)gh(e)&&(e=e.ɵproviders),Array.isArray(e)?Dh(e,t):t(e)}var nI=me({provide:String,useValue:me});function d_(n){return n!==null&&typeof n==`object`&&nI in n}function iI(n){return!!(n&&n.useExisting)}function rI(n){return!!(n&&n.useFactory)}function rr(n){return typeof n==`function`}function u_(n){return!!n.useClass}var ta=new g(``);var ll={};var Yy={};var eh;function mo(){return eh===void 0&&(eh=new uo),eh}var _e=class{};var or=class extends _e{parent;source;scopes;records=new Map;_ngOnDestroyHooks=new Set;_onDestroyHooks=[];get destroyed(){return this._destroyed}_destroyed=!1;injectorDefTypes;constructor(t,e,i,r){super(),this.parent=e,this.source=i,this.scopes=r,sh(t,s=>this.processProvider(s)),this.records.set(ea,lo(void 0,this)),r.has(`environment`)&&this.records.set(_e,lo(void 0,this));let o=this.records.get(ta);o!=null&&typeof o.value==`string`&&this.scopes.add(o.value),this.injectorDefTypes=new Set(this.get(wh,ct,{self:!0}))}retrieve(t,e){let i=nr(e)||0;try{return this.get(t,tr,i)}catch(r){if(co(r))return r;throw r}}destroy(){zs(this),this._destroyed=!0;let t=O(null);try{for(let i of this._ngOnDestroyHooks)i.ngOnDestroy();let e=this._onDestroyHooks;this._onDestroyHooks=[];for(let i of e)i()}finally{this.records.clear(),this._ngOnDestroyHooks.clear(),this.injectorDefTypes.clear(),O(t)}}onDestroy(t){return zs(this),this._onDestroyHooks.push(t),()=>this.removeOnDestroy(t)}runInContext(t){zs(this);let e=_n(this),i=Tt(void 0);try{return t()}finally{_n(e),Tt(i)}}get(t,e=tr,i){if(zs(this),Object.hasOwn(t,qy))return t[qy](this);let r=nr(i),s=_n(this),a=Tt(void 0);try{if(!(r&4)){let l=this.records.get(t);if(l===void 0){let d=lI(t)&&Ks(t);d&&this.injectableDefInScope(d)?l=lo(oh(t),ll):l=null,this.records.set(t,l)}if(l!=null)return this.hydrate(t,l,r)}let c=r&2?mo():this.parent;return e=r&8&&e===tr?null:e,c.get(t,e)}catch(c){let l=Z0(c);throw l===-200||l===-201?new _(l,null):c}finally{Tt(a),_n(s)}}resolveInjectorInitializers(){let t=O(null),e=_n(this),i=Tt(void 0);try{let o=this.get(ho,ct,{self:!0});for(let s of o)s()}finally{_n(e),Tt(i),O(t)}}toString(){return`R3Injector[...]`}processProvider(t){t=ze(t);let e=rr(t)?t:ze(t&&t.provide),i=sI(t);if(!rr(t)&&t.multi===!0){let r=this.records.get(e);r||(r=lo(void 0,ll,!0),r.factory=()=>rh(r.multi),this.records.set(e,r)),e=t,r.multi.push(t)}this.records.set(e,i)}hydrate(t,e,i){let r=O(null);try{if(e.value===Yy)throw _h(``);return e.value===ll&&(e.value=Yy,e.value=e.factory(void 0,i)),typeof e.value==`object`&&e.value&&cI(e.value)&&this._ngOnDestroyHooks.add(e.value),e.value}finally{O(r)}}injectableDefInScope(t){if(!t.providedIn)return!1;let e=ze(t.providedIn);return typeof e==`string`?e===`any`||this.scopes.has(e):this.injectorDefTypes.has(e)}removeOnDestroy(t){let e=this._onDestroyHooks.indexOf(t);e!==-1&&this._onDestroyHooks.splice(e,1)}};function oh(n){let t=Ks(n),e=t!==null?t.factory:ir(n);if(e!==null)return e;if(n instanceof g)throw new _(-204,!1);if(n instanceof Function)return oI(n);throw new _(-204,!1)}function oI(n){if(n.length>0)throw new _(-204,!1);let e=G0(n);return e!==null?()=>e.factory(n):()=>new n}function sI(n){if(d_(n))return lo(void 0,n.useValue);return lo(Eh(n),ll)}function Eh(n,t,e){let i;if(rr(n)){let r=ze(n);return ir(r)||oh(r)}else if(d_(n))i=()=>ze(n.useValue);else if(rI(n))i=()=>n.useFactory(...rh(n.deps||[]));else if(iI(n))i=(r,o)=>P(ze(n.useExisting),o!==void 0&&o&8?8:void 0);else{let r=ze(n&&(n.useClass||n.provide));if(aI(n))i=()=>new r(...rh(n.deps));else return ir(r)||oh(r)}return i}function zs(n){if(n.destroyed)throw new _(-205,!1)}function lo(n,t,e=!1){return{factory:n,value:t,multi:e?[]:void 0}}function aI(n){return!!n.deps}function cI(n){return n!==null&&typeof n==`object`&&typeof n.ngOnDestroy==`function`}function lI(n){return typeof n==`function`||typeof n==`object`&&n.ngMetadataName===`InjectionToken`}function sh(n,t){for(let e of n)Array.isArray(e)?sh(e,t):e&&gh(e)?sh(e.ɵproviders,t):t(e)}function Ie(n,t){let e;n instanceof or?(zs(n),e=n):e=new ih(n);let r=_n(e),o=Tt(void 0);try{return t()}finally{_n(r),Tt(o)}}function f_(){return i_()!==void 0||cl()!=null}var en=0;var A=1;var B=2;var $e=3;var Ut=4;var tt=5;var lr=6;var po=7;var Oe=8;var wn=9;var tn=10;var be=11;var go=12;var xh=13;var Si=14;var pt=15;var wi=16;var dr=17;var Cn=18;var Dn=19;var Ih=20;var zn=21;var Dl=22;var $n=23;var At=24;var ur=25;var En=26;var Ae=27;var h_=1;var Nh=6;var fr=7;var na=8;var hr=9;var Ne=10;function Gn(n){return Array.isArray(n)&&typeof n[h_]==`object`}function Ht(n){return Array.isArray(n)&&n[h_]===!0}function Mh(n){return(n.flags&4)!==0}function xn(n){return n.componentOffset>-1}function vo(n){return(n.flags&1)===1}function nn(n){return!!n.template}function yo(n){return(n[B]&512)!==0}function mr(n){return(n[B]&256)===256}var ce=(function(n){return n[n.NONE=0]=`NONE`,n[n.HTML=1]=`HTML`,n[n.STYLE=2]=`STYLE`,n[n.SCRIPT=3]=`SCRIPT`,n[n.URL=4]=`URL`,n[n.RESOURCE_URL=5]=`RESOURCE_URL`,n[n.ATTRIBUTE_NO_BINDING=6]=`ATTRIBUTE_NO_BINDING`,n})(ce||{});var $s;var sr=`svg`;var El=`math`;var ah=``;var Zy=`*`;var ch=()=>Object.create(null);function dI(){return $s||($s=ch(),vi(ce.HTML,void 0,[[`iframe`,[`srcdoc`]],[`*`,[`innerHTML`,`outerHTML`]]]),vi(ce.STYLE,void 0,[[`*`,[`style`]]]),vi(ce.URL,void 0,[[`*`,[`formAction`]],[`area`,[`href`]],[`a`,[`href`,`xlink:href`]],[`form`,[`action`]],[`img`,[`src`]],[`video`,[`src`]]]),vi(ce.URL,El,[[`*`,[`href`,`xlink:href`]]]),vi(ce.RESOURCE_URL,void 0,[[`base`,[`href`]],[`embed`,[`src`]],[`frame`,[`src`]],[`iframe`,[`src`]],[`link`,[`href`]],[`object`,[`codebase`,`data`]]]),vi(ce.URL,sr,[[`a`,[`href`,`xlink:href`]]]),vi(ce.ATTRIBUTE_NO_BINDING,sr,[[`animate`,[`attributeName`,`values`,`to`,`from`]],[`set`,[`to`,`attributeName`]],[`animateMotion`,[`attributeName`]],[`animateTransform`,[`attributeName`]]]),vi(ce.ATTRIBUTE_NO_BINDING,void 0,[[`unknown`,[`attributeName`,`values`,`to`,`from`,`sandbox`,`allow`,`allowFullscreen`,`referrerPolicy`,`csp`,`fetchPriority`,`credentialless`]],[`iframe`,[`sandbox`,`allow`,`allowFullscreen`,`referrerPolicy`,`csp`,`fetchPriority`,`credentialless`]]]),$s)}function vi(n,t,e){let i=t??ah;for(let[r,o]of e){let s=r.toLowerCase();for(let a of o){let c=a.toLowerCase(),l=$s[c]??=ch(),d=l[i]??=ch();d[s]=n}}}function m_(n,t,e){let r=dI()[t.toLowerCase()];if(!r)return ce.NONE;let o=n.toLowerCase(),s;if(e){let a=r[e];a&&(s=a[o]??a[Zy])}if(s===void 0){let a=r[ah];a&&(s=a[o]??a[Zy])}if(s===void 0&&(!e||e===ah)){let a=r[sr];a&&(s=a[o])}return s??ce.NONE}function nt(n){for(;Array.isArray(n);)n=n[en];return n}function Th(n,t){return nt(t[n])}function Et(n,t){return nt(t[n.index])}function xl(n,t){return n.data[t]}function p_(n,t){return n[t]}function zt(n,t){let e=t[n];return Gn(e)?e:e[en]}function g_(n){return(n[B]&4)===4}function Il(n){return(n[B]&128)===128}function v_(n){return Ht(n[$e])}function Rt(n,t){return t==null?null:n[t]}function Ah(n){n[dr]=0}function Rh(n){n[B]&1024||(n[B]|=1024,Il(n)&&pr(n))}function y_(n,t){for(;n>0;)t=t[Si],n--;return t}function ia(n){return!!(n[B]&9216||n[At]?.dirty)}function Nl(n){n[tn].changeDetectionScheduler?.notify(8),n[B]&64&&(n[B]|=1024),ia(n)&&pr(n)}function pr(n){n[tn].changeDetectionScheduler?.notify(0);let t=Wn(n);for(;t!==null&&!(t[B]&8192||(t[B]|=8192,!Il(t)));)t=Wn(t)}function Ml(n,t){if(mr(n))throw new _(911,!1);n[zn]===null&&(n[zn]=[]),n[zn].push(t)}function __(n,t){if(n[zn]===null)return;let e=n[zn].indexOf(t);e!==-1&&n[zn].splice(e,1)}function Wn(n){let t=n[$e];return Ht(t)?t[$e]:t}function kh(n){return n[po]??=[]}function Oh(n){return n.cleanup??=[]}function b_(n,t,e,i){let r=kh(t);r.push(e),n.firstCreatePass&&Oh(n).push(i,r.length-1)}var K={lFrame:R_(null),bindingsEnabled:!0,skipHydrationRootTNode:null};var lh=!1;function S_(){return K.lFrame.elementDepthCount}function w_(){K.lFrame.elementDepthCount++}function Ph(){K.lFrame.elementDepthCount--}function Tl(){return K.bindingsEnabled}function Fh(){return K.skipHydrationRootTNode!==null}function Lh(n){return K.skipHydrationRootTNode===n}function jh(){K.skipHydrationRootTNode=null}function j(){return K.lFrame.lView}function De(){return K.lFrame.tView}function gr(n){return K.lFrame.contextLView=n,n[Oe]}function vr(n){return K.lFrame.contextLView=null,n}function We(){let n=Vh();for(;n!==null&&n.type===64;)n=n.parent;return n}function Vh(){return K.lFrame.currentTNode}function C_(){let n=K.lFrame,t=n.currentTNode;return n.isParent?t:t.parent}function _o(n,t){let e=K.lFrame;e.currentTNode=n,e.isParent=t}function Bh(){return K.lFrame.isParent}function Uh(){K.lFrame.isParent=!1}function D_(){return K.lFrame.contextLView}function Hh(){return lh}function Gs(n){let t=lh;return lh=n,t}function Al(){let n=K.lFrame,t=n.bindingRootIndex;return t===-1&&(t=n.bindingRootIndex=n.tView.bindingStartIndex),t}function E_(){return K.lFrame.bindingIndex}function x_(n){return K.lFrame.bindingIndex=n}function Ci(){return K.lFrame.bindingIndex++}function Rl(n){let t=K.lFrame,e=t.bindingIndex;return t.bindingIndex=t.bindingIndex+n,e}function I_(){return K.lFrame.inI18n}function N_(n,t){let e=K.lFrame;e.bindingIndex=e.bindingRootIndex=n,kl(t)}function M_(){return K.lFrame.currentDirectiveIndex}function kl(n){K.lFrame.currentDirectiveIndex=n}function T_(n){let t=K.lFrame.currentDirectiveIndex;return t===-1?null:n[t]}function Ol(){return K.lFrame.currentQueryIndex}function ra(n){K.lFrame.currentQueryIndex=n}function uI(n){let t=n[A];return t.type===2?t.declTNode:t.type===1?n[tt]:null}function zh(n,t,e){if(e&4){let r=t,o=n;for(;r=r.parent,r===null&&!(e&1);)if(r=uI(o),r===null||(o=o[Si],r.type&10))break;if(r===null)return!1;t=r,n=o}let i=K.lFrame=A_();return i.currentTNode=t,i.lView=n,!0}function Pl(n){let t=A_(),e=n[A];K.lFrame=t,t.currentTNode=e.firstChild,t.lView=n,t.tView=e,t.contextLView=n,t.bindingIndex=e.bindingStartIndex,t.inI18n=!1}function A_(){let n=K.lFrame,t=n===null?null:n.child;return t===null?R_(n):t}function R_(n){let t={currentTNode:null,isParent:!0,lView:null,tView:null,selectedIndex:-1,contextLView:null,elementDepthCount:0,currentNamespace:null,currentDirectiveIndex:-1,bindingRootIndex:-1,bindingIndex:-1,currentQueryIndex:0,parent:n,child:null,inI18n:!1};return n!==null&&(n.child=t),t}function k_(){let n=K.lFrame;return K.lFrame=n.parent,n.currentTNode=null,n.lView=null,n}var $h=k_;function Fl(){let n=k_();n.isParent=!0,n.tView=null,n.selectedIndex=-1,n.contextLView=null,n.elementDepthCount=0,n.currentDirectiveIndex=-1,n.currentNamespace=null,n.bindingRootIndex=-1,n.bindingIndex=-1,n.currentQueryIndex=0}function O_(n){return(K.lFrame.contextLView=y_(n,K.lFrame.contextLView))[Oe]}function rn(){return K.lFrame.selectedIndex}function Di(n){K.lFrame.selectedIndex=n}function yr(){let n=K.lFrame;return xl(n.tView,n.selectedIndex)}function Ei(){K.lFrame.currentNamespace=sr}function oa(){fI()}function fI(){K.lFrame.currentNamespace=null}function Wh(){return K.lFrame.currentNamespace}var P_=!0;function Ll(){return P_}function sa(n){P_=n}function dh(n,t=null,e=null,i){let r=Gh(n,t,e,i);return r.resolveInjectorInitializers(),r}function Gh(n,t=null,e=null,i,r=new Set){return new or([e||ct,c_(n)],t||mo(),null,r)}var T=class n{static THROW_IF_NOT_FOUND=tr;static NULL=new uo;static create(t,e){if(Array.isArray(t))return dh({name:``},e,t,``);{let i=t.name??``;return dh({name:i},t.parent,t.providers,i)}}static ɵprov=W({token:n,providedIn:`any`,factory:()=>P(ea)});static __NG_ELEMENT_ID__=-1};var M=new g(``);var ke=class{static __NG_ELEMENT_ID__=hI;static __NG_ENV_ID__=t=>t};var fl=class extends ke{_lView;constructor(t){super(),this._lView=t}get destroyed(){return mr(this._lView)}onDestroy(t){let e=this._lView;return Ml(e,t),()=>__(e,t)}};function hI(){return new fl(j())}var F_=!1;var L_=new g(``);var qn=(()=>{class n{taskId=0;pendingTasks=new Set;destroyed=!1;pendingTask=new He(!1);debugTaskTracker=u(L_,{optional:!0});get hasPendingTasks(){return this.destroyed?!1:this.pendingTask.value}get hasPendingTasksObservable(){return this.destroyed?new V(e=>{e.next(!1),e.complete()}):this.pendingTask}add(){!this.hasPendingTasks&&!this.destroyed&&this.pendingTask.next(!0);let e=this.taskId++;return this.pendingTasks.add(e),this.debugTaskTracker?.add(e),e}has(e){return this.pendingTasks.has(e)}remove(e){this.pendingTasks.delete(e),this.debugTaskTracker?.remove(e),this.pendingTasks.size===0&&this.hasPendingTasks&&this.pendingTask.next(!1)}ngOnDestroy(){this.pendingTasks.clear(),this.hasPendingTasks&&this.pendingTask.next(!1),this.destroyed=!0,this.pendingTask.unsubscribe()}static ɵprov=W({token:n,providedIn:`root`,factory:()=>new n})}return n})();var uh=class extends w{__isAsync;destroyRef=void 0;pendingTasks=void 0;constructor(t=!1){super(),this.__isAsync=t,f_()&&(this.destroyRef=u(ke,{optional:!0})??void 0,this.pendingTasks=u(qn,{optional:!0})??void 0)}emit(t){let e=O(null);try{super.next(t)}finally{O(e)}}subscribe(t,e,i){let r=t,o=e||(()=>null),s=i;if(t&&typeof t==`object`){let c=t;r=c.next?.bind(c),o=c.error?.bind(c),s=c.complete?.bind(c)}this.__isAsync&&(o=this.wrapInTimeout(o),r&&(r=this.wrapInTimeout(r)),s&&(s=this.wrapInTimeout(s)));let a=super.subscribe({next:r,error:o,complete:s});return t instanceof Q&&t.add(a),a}wrapInTimeout(t){return e=>{let i=this.pendingTasks?.add();setTimeout(()=>{try{t(e)}finally{i!==void 0&&this.pendingTasks?.remove(i)}})}}};var z=uh;function hl(...n){}function qh(n){let t,e;function i(){n=hl;try{e!==void 0&&typeof cancelAnimationFrame==`function`&&cancelAnimationFrame(e),t!==void 0&&clearTimeout(t)}catch{}}return t=setTimeout(()=>{n(),i()}),typeof requestAnimationFrame==`function`&&(e=requestAnimationFrame(()=>{n(),i()})),()=>i()}function j_(n){return queueMicrotask(()=>n()),()=>{n=hl}}var Yh=`isAngularZone`;var qs=Yh+`_ID`;var mI=0;var I=class n{hasPendingMacrotasks=!1;hasPendingMicrotasks=!1;isStable=!0;onUnstable=new z(!1);onMicrotaskEmpty=new z(!1);onStable=new z(!1);onError=new z(!1);constructor(t){let{enableLongStackTrace:e=!1,shouldCoalesceEventChangeDetection:i=!1,shouldCoalesceRunChangeDetection:r=!1,scheduleInRootZone:o=F_}=t;if(typeof Zone>`u`)throw new _(908,!1);Zone.assertZonePatched();let s=this;s._nesting=0,s._outer=s._inner=Zone.current,Zone.TaskTrackingZoneSpec&&(s._inner=s._inner.fork(new Zone.TaskTrackingZoneSpec)),e&&Zone.longStackTraceZoneSpec&&(s._inner=s._inner.fork(Zone.longStackTraceZoneSpec)),s.shouldCoalesceEventChangeDetection=!r&&i,s.shouldCoalesceRunChangeDetection=r,s.callbackScheduled=!1,s.scheduleInRootZone=o,vI(s)}static isInAngularZone(){return typeof Zone<`u`&&Zone.current.get(Yh)===!0}static assertInAngularZone(){if(!n.isInAngularZone())throw new _(909,!1)}static assertNotInAngularZone(){if(n.isInAngularZone())throw new _(909,!1)}run(t,e,i){return this._inner.run(t,e,i)}runTask(t,e,i,r){let o=this._inner,s=o.scheduleEventTask(`NgZoneEvent: `+r,t,pI,hl,hl);try{return o.runTask(s,e,i)}finally{o.cancelTask(s)}}runGuarded(t,e,i){return this._inner.runGuarded(t,e,i)}runOutsideAngular(t){return this._outer.run(t)}};var pI={};function Zh(n){if(n._nesting==0&&!n.hasPendingMicrotasks&&!n.isStable)try{n._nesting++,n.onMicrotaskEmpty.emit(null)}finally{if(n._nesting--,!n.hasPendingMicrotasks)try{n.runOutsideAngular(()=>n.onStable.emit(null))}finally{n.isStable=!0}}}function gI(n){if(n.isCheckStableRunning||n.callbackScheduled)return;n.callbackScheduled=!0;function t(){qh(()=>{n.callbackScheduled=!1,fh(n),n.isCheckStableRunning=!0,Zh(n),n.isCheckStableRunning=!1})}n.scheduleInRootZone?Zone.root.run(()=>{t()}):n._outer.run(()=>{t()}),fh(n)}function vI(n){let t=()=>{gI(n)},e=mI++;n._inner=n._inner.fork({name:`angular`,properties:{[Yh]:!0,[qs]:e,[qs+e]:!0},onInvokeTask:(i,r,o,s,a,c)=>{if(yI(c))return i.invokeTask(o,s,a,c);try{return Ky(n),i.invokeTask(o,s,a,c)}finally{(n.shouldCoalesceEventChangeDetection&&s.type===`eventTask`||n.shouldCoalesceRunChangeDetection)&&t(),Qy(n)}},onInvoke:(i,r,o,s,a,c,l)=>{try{return Ky(n),i.invoke(o,s,a,c,l)}finally{n.shouldCoalesceRunChangeDetection&&!n.callbackScheduled&&!_I(c)&&t(),Qy(n)}},onHasTask:(i,r,o,s)=>{i.hasTask(o,s),r===o&&(s.change==`microTask`?(n._hasPendingMicrotasks=s.microTask,fh(n),Zh(n)):s.change==`macroTask`&&(n.hasPendingMacrotasks=s.macroTask))},onHandleError:(i,r,o,s)=>(i.handleError(o,s),n.runOutsideAngular(()=>n.onError.emit(s)),!1)})}function fh(n){n._hasPendingMicrotasks||(n.shouldCoalesceEventChangeDetection||n.shouldCoalesceRunChangeDetection)&&n.callbackScheduled===!0?n.hasPendingMicrotasks=!0:n.hasPendingMicrotasks=!1}function Ky(n){n._nesting++,n.isStable&&(n.isStable=!1,n.onUnstable.emit(null))}function Qy(n){n._nesting--,Zh(n)}var Ys=class{hasPendingMicrotasks=!1;hasPendingMacrotasks=!1;isStable=!0;onUnstable=new z;onMicrotaskEmpty=new z;onStable=new z;onError=new z;run(t,e,i){return t.apply(e,i)}runGuarded(t,e,i){return t.apply(e,i)}runOutsideAngular(t){return t()}runTask(t,e,i,r){return t.apply(e,i)}};function yI(n){return V_(n,`__ignore_ng_zone__`)}function _I(n){return V_(n,`__scheduler_tick__`)}function V_(n,t){return!Array.isArray(n)||n.length!==1?!1:n[0]?.data?.[t]===!0}var lt=class{_console=console;handleError(t){this._console.error(`ERROR`,t)}};var $t=new g(``,{factory:()=>{let n=u(I),t=u(_e),e;return i=>{n.runOutsideAngular(()=>{t.destroyed&&!e?setTimeout(()=>{throw i}):(e??=t.get(lt),e.handleError(i))})}}});var B_={provide:ho,useValue:()=>{u(lt,{optional:!0})},multi:!0};function C(n,t){let[e,i,r]=Yf(n,t?.equal),o=e;o[Ce];return o.set=i,o.update=r,o.asReadonly=jl.bind(o),o}function jl(){let n=this[Ce];if(n.readonlyFn===void 0){let t=()=>this();t[Ce]=n,n.readonlyFn=t}return n.readonlyFn}var on=new g(``,{factory:()=>bI});var bI=`ng`;var Vl=new g(``);var _r=new g(``,{providedIn:`platform`,factory:()=>`unknown`});var aa=new g(``);var Yn=new g(``,{factory:()=>u(M).body?.querySelector(`[ngCspNonce]`)?.getAttribute(`ngCspNonce`)||null});var bo=(()=>{class n{view;node;constructor(e,i){this.view=e,this.node=i}static __NG_ELEMENT_ID__=SI}return n})();function SI(){return new bo(j(),We())}var bn=class{};var ca=new g(``,{factory:()=>!0});var Kh=new g(``);var Bl=(()=>{class n{static ɵprov=W({token:n,providedIn:`root`,factory:()=>new hh})}return n})();var hh=class{dirtyEffectCount=0;queues=new Map;add(t){this.enqueue(t),this.schedule(t)}schedule(t){t.dirty&&this.dirtyEffectCount++}remove(t){let e=t.zone,i=this.queues.get(e);i.has(t)&&(i.delete(t),t.dirty&&this.dirtyEffectCount--)}enqueue(t){let e=t.zone;this.queues.has(e)||this.queues.set(e,new Set);let i=this.queues.get(e);i.has(t)||i.add(t)}flush(){for(;this.dirtyEffectCount>0;){let t=!1;for(let[e,i]of this.queues)e===null?t||=this.flushQueue(i):t||=e.run(()=>this.flushQueue(i));t||(this.dirtyEffectCount=0)}}flushQueue(t){let e=!1;for(let i of t)i.dirty&&(this.dirtyEffectCount--,e=!0,i.run());return e}};var ml=class{[Ce];constructor(t){this[Ce]=t}destroy(){this[Ce].destroy()}};function dt(n,t){let e=t?.injector??u(T),i=t?.manualCleanup!==!0?e.get(ke):null,r,o=e.get(bo,null,{optional:!0}),s=e.get(bn);return o!==null?(r=H_(o.view,s,n),i instanceof fl&&i._lView===o.view&&(i=null)):r=DI(n,e.get(Bl),s),r.injector=e,i!==null&&(r.onDestroyFns=[i.onDestroy(()=>r.destroy())]),new ml(r)}var U_=S(p({},Zf),{cleanupFns:void 0,zone:null,onDestroyFns:null,run(){let n=Gs(!1);try{Kf(this)}finally{Gs(n)}},cleanup(){if(!this.cleanupFns?.length)return;let n=O(null);try{for(;this.cleanupFns.length;)this.cleanupFns.pop()()}finally{this.cleanupFns=[],O(n)}}});var wI=S(p({},U_),{consumerMarkedDirty(){this.scheduler.schedule(this),this.notifier.notify(12)},destroy(){if(Hn(this),this.onDestroyFns!==null)for(let n of this.onDestroyFns)n();this.cleanup(),this.scheduler.remove(this)}});var CI=S(p({},U_),{consumerMarkedDirty(){this.view[B]|=8192,pr(this.view),this.notifier.notify(13)},destroy(){if(Hn(this),this.onDestroyFns!==null)for(let n of this.onDestroyFns)n();this.cleanup(),this.view[$n]?.delete(this)}});function H_(n,t,e){let i=Object.create(CI);return i.view=n,i.zone=typeof Zone<`u`?Zone.current:null,i.notifier=t,i.fn=z_(i,e),n[$n]??=new Set,n[$n].add(i),i.consumerMarkedDirty(i),i}function DI(n,t,e){let i=Object.create(wI);return i.fn=z_(i,n),i.scheduler=t,i.notifier=e,i.zone=typeof Zone<`u`?Zone.current:null,i.scheduler.add(i),i.notifier.notify(12),i}function z_(n,t){return()=>{t(e=>(n.cleanupFns??=[]).push(e))}}function sn(n){return typeof n==`function`&&n[Ce]!==void 0}var la=(()=>{class n{internalPendingTasks=u(qn);scheduler=u(bn);errorHandler=u($t);add(){let e=this.internalPendingTasks.add();return()=>{this.internalPendingTasks.has(e)&&(this.scheduler.notify(11),this.internalPendingTasks.remove(e))}}run(e){let i=this.add();try{e().catch(this.errorHandler).finally(i)}catch(r){this.errorHandler(r),i()}}static ɵprov=W({token:n,providedIn:`root`,factory:()=>new n})}return n})();var ud=Symbol(`InputSignalNode#UNSET`);var Ob=S(p({},ao),{transformFn:void 0,applyValueToInputSignal(n,t){gi(n,t)}});function _a(n){return{toString:n}.toString()}var de=(function(n){return n[n.TemplateCreateStart=0]=`TemplateCreateStart`,n[n.TemplateCreateEnd=1]=`TemplateCreateEnd`,n[n.TemplateUpdateStart=2]=`TemplateUpdateStart`,n[n.TemplateUpdateEnd=3]=`TemplateUpdateEnd`,n[n.LifecycleHookStart=4]=`LifecycleHookStart`,n[n.LifecycleHookEnd=5]=`LifecycleHookEnd`,n[n.OutputStart=6]=`OutputStart`,n[n.OutputEnd=7]=`OutputEnd`,n[n.BootstrapApplicationStart=8]=`BootstrapApplicationStart`,n[n.BootstrapApplicationEnd=9]=`BootstrapApplicationEnd`,n[n.BootstrapComponentStart=10]=`BootstrapComponentStart`,n[n.BootstrapComponentEnd=11]=`BootstrapComponentEnd`,n[n.ChangeDetectionStart=12]=`ChangeDetectionStart`,n[n.ChangeDetectionEnd=13]=`ChangeDetectionEnd`,n[n.ChangeDetectionSyncStart=14]=`ChangeDetectionSyncStart`,n[n.ChangeDetectionSyncEnd=15]=`ChangeDetectionSyncEnd`,n[n.AfterRenderHooksStart=16]=`AfterRenderHooksStart`,n[n.AfterRenderHooksEnd=17]=`AfterRenderHooksEnd`,n[n.ComponentStart=18]=`ComponentStart`,n[n.ComponentEnd=19]=`ComponentEnd`,n[n.DeferBlockStateStart=20]=`DeferBlockStateStart`,n[n.DeferBlockStateEnd=21]=`DeferBlockStateEnd`,n[n.DynamicComponentStart=22]=`DynamicComponentStart`,n[n.DynamicComponentEnd=23]=`DynamicComponentEnd`,n[n.HostBindingsUpdateStart=24]=`HostBindingsUpdateStart`,n[n.HostBindingsUpdateEnd=25]=`HostBindingsUpdateEnd`,n})(de||{});var Zl=class{previousValue;currentValue;firstChange;constructor(t,e,i){this.previousValue=t,this.currentValue=e,this.firstChange=i}isFirstChange(){return this.firstChange}};function Pb(n,t,e,i){t!==null?t.applyValueToInputSignal(t,i):n[e]=i}var Fb=null;var Be=(()=>{Fb=$_;let n=()=>$_;return n.ngInherit=!0,n})();function PI(){return Fb}function $_(n){return n.type.prototype.ngOnChanges&&(n.setInput=LI),FI}function FI(){let n=Lb(this),t=n?.current;if(t){let e=n.previous;if(e===bi)n.previous=t;else for(let i in t)e[i]=t[i];n.current=null,this.ngOnChanges(t)}}function LI(n,t,e,i,r){let o=this.declaredInputs[i],s=Lb(n)||jI(n,{previous:bi,current:null}),a=s.current||(s.current={}),c=s.previous,l=c[o];a[o]=new Zl(l&&l.currentValue,e,c===bi),Pb(n,t,r,e)}var am=`__ngSimpleChanges__`;function Lb(n){return Object.hasOwn(n,am)&&n[am]||null}function jI(n,t){return n[am]=t}var W_=[];var pe=function(n,t=null,e){for(let i=0;i<W_.length;i++){let r=W_[i];r(n,t,e)}};function VI(n,t,e){let{ngOnChanges:i,ngOnInit:r,ngDoCheck:o}=t.type.prototype;if(i){let s=PI()(t);(e.preOrderHooks??=[]).push(n,s),(e.preOrderCheckHooks??=[]).push(n,s)}r&&(e.preOrderHooks??=[]).push(0-n,r),o&&((e.preOrderHooks??=[]).push(n,o),(e.preOrderCheckHooks??=[]).push(n,o))}function jb(n,t){for(let e=t.directiveStart,i=t.directiveEnd;e<i;e++){let{ngAfterContentInit:s,ngAfterContentChecked:a,ngAfterViewInit:c,ngAfterViewChecked:l,ngOnDestroy:d}=n.data[e].type.prototype;s&&(n.contentHooks??=[]).push(-e,s),a&&((n.contentHooks??=[]).push(e,a),(n.contentCheckHooks??=[]).push(e,a)),c&&(n.viewHooks??=[]).push(-e,c),l&&((n.viewHooks??=[]).push(e,l),(n.viewCheckHooks??=[]).push(e,l)),d!=null&&(n.destroyHooks??=[]).push(e,d)}}function Wl(n,t,e){Vb(n,t,3,e)}function Gl(n,t,e,i){(n[B]&3)===e&&Vb(n,t,e,i)}function Qh(n,t){let e=n[B];(e&3)===t&&(e&=16383,e+=1,n[B]=e)}function Vb(n,t,e,i){let r=i!==void 0?n[dr]&65535:0,o=i??-1,s=t.length-1,a=0;for(let c=r;c<s;c++)if(typeof t[c+1]==`number`){if(a=t[c],i!=null&&a>=i)break}else t[c]<0&&(n[dr]+=65536),(a<o||o==-1)&&(BI(n,e,t,c),n[dr]=(n[dr]&4294901760)+c+2),c++}function G_(n,t){pe(de.LifecycleHookStart,n,t);let e=O(null);try{t.call(n)}finally{O(e),pe(de.LifecycleHookEnd,n,t)}}function BI(n,t,e,i){let r=e[i]<0,o=e[i+1],a=n[r?-e[i]:e[i]];r?n[B]>>14<n[dr]>>16&&(n[B]&3)===t&&(n[B]+=16384,G_(a,o)):G_(a,o)}var wo=-1;var wr=class{factory;name;injectImpl;resolving=!1;canSeeViewProviders;multi;componentProviders;index;providerFactory;constructor(t,e,i,r){this.factory=t,this.name=r,this.canSeeViewProviders=e,this.injectImpl=i}};function UI(n){return(n.flags&8)!==0}function HI(n){return(n.flags&16)!==0}function zI(n,t,e){let i=0;for(;i<e.length;){let r=e[i];if(typeof r==`number`){if(r!==0)break;i++;let o=e[i++],s=e[i++],a=e[i++];n.setAttribute(t,s,a,o)}else{let o=r,s=e[++i];$I(o)?n.setProperty(t,o,s):n.setAttribute(t,o,s),i++}}return i}function Bb(n){return n===3||n===4||n===6}function $I(n){return n.charCodeAt(0)===64}function Co(n,t){if(!(t===null||t.length===0))if(n===null||n.length===0)n=t.slice();else{let e=-1;for(let i=0;i<t.length;i++){let r=t[i];typeof r==`number`?e=r:e===0||(e===-1||e===2?q_(n,e,r,null,t[++i]):q_(n,e,r,null,null))}}return n}function q_(n,t,e,i,r){let o=0,s=n.length;if(t===-1)s=-1;else for(;o<n.length;){let a=n[o++];if(typeof a==`number`){if(a===t){s=-1;break}else if(a>t){s=o-1;break}}}for(;o<n.length;){let a=n[o];if(typeof a==`number`)break;if(a===e){r!==null&&(n[o+1]=r);return}o++,r!==null&&o++}s!==-1&&(n.splice(s,0,t),o=s+1),n.splice(o++,0,e),r!==null&&n.splice(o++,0,r)}function Ub(n){return n!==wo}function Kl(n){return n&32767}function WI(n){return n>>16}function Ql(n,t){let e=WI(n),i=t;for(;e>0;)i=i[Si],e--;return i}var cm=!0;function Y_(n){let t=cm;return cm=n,t}var Hb=255;var zb=5;var qI=0;var In={};function YI(n,t,e){let i;typeof e==`string`?i=e.charCodeAt(0)||0:Object.hasOwn(e,ar)&&(i=e[ar]),i??=e[ar]=qI++;let r=i&Hb,o=1<<r;t.data[n+(r>>zb)]|=o}function Xl(n,t){let e=$b(n,t);if(e!==-1)return e;let i=t[A];i.firstCreatePass&&(n.injectorIndex=t.length,Xh(i.data,n),Xh(t,null),Xh(i.blueprint,null));let r=zm(n,t),o=n.injectorIndex;if(Ub(r)){let s=Kl(r),a=Ql(r,t),c=a[A].data;for(let l=0;l<8;l++)t[o+l]=a[s+l]|c[s+l]}return t[o+8]=r,o}function Xh(n,t){n.push(0,0,0,0,0,0,0,0,t)}function $b(n,t){return n.injectorIndex===-1||n.parent&&n.parent.injectorIndex===n.injectorIndex||t[n.injectorIndex+8]===null?-1:n.injectorIndex}function zm(n,t){if(n.parent&&n.parent.injectorIndex!==-1)return n.parent.injectorIndex;let e=0,i=null,r=t;for(;r!==null;){if(i=Zb(r),i===null)return wo;if(e++,r=r[Si],i.injectorIndex!==-1)return i.injectorIndex|e<<16}return wo}function lm(n,t,e){YI(n,t,e)}function ZI(n,t){if(t===`class`)return n.classes;if(t===`style`)return n.styles;let e=n.attrs;if(e){let i=e.length,r=0;for(;r<i;){let o=e[r];if(Bb(o))break;if(o===0)r=r+2;else if(typeof o==`number`)for(r++;r<i&&typeof e[r]==`string`;)r++;else{if(o===t)return e[r+1];r=r+2}}}return null}function Wb(n,t,e){if(e&8||n!==void 0)return n;bl(t,`NodeInjector`)}function Gb(n,t,e,i){if(e&8&&i===void 0&&(i=null),(e&3)===0){let r=n[wn],o=Tt(void 0);try{return r?r.get(t,i,e&8):bh(t,i,e&8)}finally{Tt(o)}}return Wb(i,t,e)}function qb(n,t,e,i=0,r){if(n!==null){if(t[B]&2048&&!(i&2)){let s=JI(n,t,e,i,In);if(s!==In)return s}let o=Yb(n,t,e,i,In);if(o!==In)return o}return Gb(t,e,i,r)}function Yb(n,t,e,i,r){let o=QI(e);if(typeof o==`function`){if(!zh(t,n,i))return i&1?Wb(r,e,i):Gb(t,e,i,r);try{let s;if(s=o(i),s==null&&!(i&8))bl(e);else return s}finally{$h()}}else if(typeof o==`number`){let s=null,a=$b(n,t),c=wo,l=i&1?t[pt][tt]:null;for((a===-1||i&4)&&(c=a===-1?zm(n,t):t[a+8],c===wo||!K_(i,!1)?a=-1:(s=t[A],a=Kl(c),t=Ql(c,t)));a!==-1;){let d=t[A];if(Z_(o,a,d.data)){let f=KI(a,t,e,s,i,l);if(f!==In)return f}c=t[a+8],c!==wo&&K_(i,t[A].data[a+8]===l)&&Z_(o,a,t)?(s=d,a=Kl(c),t=Ql(c,t)):a=-1}}return r}function KI(n,t,e,i,r,o){let s=t[A],a=s.data[n+8],d=ql(a,s,e,i==null?xn(a)&&cm:i!=s&&(a.type&3)!==0,r&1&&o===a);return d!==null?ha(t,s,d,a,r):In}function ql(n,t,e,i,r){let o=n.providerIndexes,s=t.data,a=o&1048575,c=n.directiveStart,l=n.directiveEnd,d=o>>20,f=i?a:a+d,h=r?a+d:l;for(let m=f;m<h;m++){let v=s[m];if(m<c&&e===v||m>=c&&v.type===e)return m}if(r){let m=s[c];if(m&&nn(m)&&m.type===e)return c}return null}function ha(n,t,e,i,r){let o=n[e],s=t.data;if(o instanceof wr){let a=o;if(a.resolving)throw _h(``);let c=Y_(a.canSeeViewProviders);a.resolving=!0;s[e].type||s[e];let f=a.injectImpl?Tt(a.injectImpl):null;zh(n,i,0);try{o=n[e]=a.factory(void 0,r,s,n,i),t.firstCreatePass&&e>=i.directiveStart&&VI(e,s[e],t)}finally{f!==null&&Tt(f),Y_(c),a.resolving=!1,$h()}}return o}function QI(n){if(typeof n==`string`)return n.charCodeAt(0)||0;let t=Object.hasOwn(n,ar)?n[ar]:void 0;return typeof t==`number`?t>=0?t&Hb:XI:t}function Z_(n,t,e){let i=1<<n;return!!(e[t+(n>>zb)]&i)}function K_(n,t){return!(n&2)&&!(n&1&&t)}var xi=class{_tNode;_lView;constructor(t,e){this._tNode=t,this._lView=e}get(t,e,i){return qb(this._tNode,this._lView,t,nr(i),e)}};function XI(){return new xi(We(),j())}function Pe(n){return _a(()=>{let t=n.prototype.constructor,e=t[Ws]||dm(t),i=Object.prototype,r=Object.getPrototypeOf(n.prototype).constructor;for(;r&&r!==i;){let o=r[Ws]||dm(r);if(o&&o!==e)return o;r=Object.getPrototypeOf(r)}return o=>new o})}function dm(n){return mh(n)?()=>{let t=dm(ze(n));return t&&t()}:ir(n)}function JI(n,t,e,i,r){let o=n,s=t;for(;o!==null&&s!==null&&s[B]&2048&&!yo(s);){let a=Yb(o,s,e,i|2,In);if(a!==In)return a;i&=-5;let c=o.parent;if(!c){let l=s[Ih];if(l){let d=l.get(e,In,i);if(d!==In)return d}c=Zb(s),s=s[Si]}o=c}return r}function Zb(n){let t=n[A],e=t.type;return e===2?t.declTNode:e===1?n[tt]:null}function ba(n){return ZI(We(),n)}function b(n){return{token:n.token,providedIn:n.autoProvided===!1?null:`root`,factory:n.factory,value:void 0}}function eN(){return Mo(We(),j())}function Mo(n,t){return new N(Et(n,t))}var N=(()=>{class n{nativeElement;constructor(e){this.nativeElement=e}static __NG_ELEMENT_ID__=eN}return n})();function Kb(n){return n instanceof N?n.nativeElement:n}function tN(){return this._results[Symbol.iterator]()}var Zn=class{_emitDistinctChangesOnly;dirty=!0;_onDirty=void 0;_results=[];_changesDetected=!1;_changes=void 0;length=0;first=void 0;last=void 0;get changes(){return this._changes??=new w}constructor(t=!1){this._emitDistinctChangesOnly=t}get(t){return this._results[t]}map(t){return this._results.map(t)}filter(t){return this._results.filter(t)}find(t){return this._results.find(t)}reduce(t,e){return this._results.reduce(t,e)}forEach(t){this._results.forEach(t)}some(t){return this._results.some(t)}toArray(){return this._results.slice()}toString(){return this._results.toString()}reset(t,e){this.dirty=!1;let i=o_(t);(this._changesDetected=!r_(this._results,i,e))&&(this._results=i,this.length=i.length,this.last=i[this.length-1],this.first=i[0])}notifyOnChanges(){this._changes!==void 0&&(this._changesDetected||!this._emitDistinctChangesOnly)&&this._changes.next(this)}onDirty(t){this._onDirty=t}setDirty(){this.dirty=!0,this._onDirty?.()}destroy(){this._changes!==void 0&&(this._changes.complete(),this._changes.unsubscribe())}[Symbol.iterator]=tN};function Qb(n){return(n.flags&128)===128}var $m=(function(n){return n[n.OnPush=0]=`OnPush`,n[n.Eager=1]=`Eager`,n[n.Default=1]=`Default`,n})($m||{});var Xb=new Map;var nN=0;function iN(){return nN++}function rN(n){Xb.set(n[Dn],n)}function um(n){Xb.delete(n[Dn])}var Q_=`__ngContext__`;function Do(n,t){Gn(t)?(n[Q_]=t[Dn],rN(t)):n[Q_]=t}function Jb(n){return tS(n[go])}function eS(n){return tS(n[Ut])}function tS(n){for(;n!==null&&!Ht(n);)n=n[Ut];return n}var fm;function Wm(n){fm=n}function Gm(){if(fm!==void 0)return fm;if(typeof document<`u`)return document;throw new _(210,!1)}var nS=`r`;var iS=`di`;var rS=!1;var oS=new g(``,{factory:()=>rS});var X_=new WeakMap;function oN(n,t){if(n==null||typeof n!=`object`)return;let e=X_.get(n);e||(e=new WeakSet,X_.set(n,e)),e.add(t)}function fd(n){return(n.flags&32)===32}var cN=()=>null;function sS(n,t,e=!1){return cN(n,t,e)}function aS(n,t){let e=n.contentQueries;if(e!==null){let i=O(null);try{for(let r=0;r<e.length;r+=2){let o=e[r],s=e[r+1];if(s!==-1){let a=n.data[s];ra(o),a.contentQueries(2,t[s],s)}}}finally{O(i)}}}function hm(n,t,e){ra(0);let i=O(null);try{t(n,e)}finally{O(i)}}function qm(n,t,e){if(Mh(t)){let i=O(null);try{let r=t.directiveStart,o=t.directiveEnd;for(let s=r;s<o;s++){let a=n.data[s];if(a.contentQueries){let c=e[s];a.contentQueries(1,c,s)}}}finally{O(i)}}}var ln=(function(n){return n[n.Emulated=0]=`Emulated`,n[n.None=2]=`None`,n[n.ShadowDom=3]=`ShadowDom`,n[n.ExperimentalIsolatedShadowDom=4]=`ExperimentalIsolatedShadowDom`,n})(ln||{});var lN={"http://www.w3.org/2000/svg":sr,"http://www.w3.org/1998/Math/MathML":El};var Ul;function dN(){if(Ul===void 0&&(Ul=null,_i.trustedTypes))try{Ul=_i.trustedTypes.createPolicy(`angular`,{createHTML:n=>n,createScript:n=>n,createScriptURL:n=>n})}catch{}return Ul}function hd(n){return dN()?.createHTML(n)||n}var Hl;function cS(){if(Hl===void 0&&(Hl=null,_i.trustedTypes))try{Hl=_i.trustedTypes.createPolicy(`angular#unsafe-bypass`,{createHTML:n=>n,createScript:n=>n,createScriptURL:n=>n})}catch{}return Hl}function J_(n){return cS()?.createHTML(n)||n}function eb(n){return cS()?.createScriptURL(n)||n}var Kn=class{changingThisBreaksApplicationSecurity;constructor(t){this.changingThisBreaksApplicationSecurity=t}toString(){return`SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${pl})`}};var mm=class extends Kn{getTypeName(){return`HTML`}};var pm=class extends Kn{getTypeName(){return`Style`}};var gm=class extends Kn{getTypeName(){return`Script`}};var vm=class extends Kn{getTypeName(){return`URL`}};var ym=class extends Kn{getTypeName(){return`ResourceURL`}};function kt(n){return n instanceof Kn?n.changingThisBreaksApplicationSecurity:n}function Tn(n,t){let e=lS(n);if(e!=null&&e!==t){if(e===`ResourceURL`&&t===`URL`)return!0;throw new Error(`Required a safe ${t}, got a ${e} (see ${pl})`)}return e===t}function lS(n){return n instanceof Kn&&n.getTypeName()||null}function Ym(n){return new mm(n)}function Zm(n){return new pm(n)}function Km(n){return new gm(n)}function Qm(n){return new vm(n)}function Xm(n){return new ym(n)}function uN(n){let t=new bm(n);return fN()?new _m(t):t}var _m=class{inertDocumentHelper;constructor(t){this.inertDocumentHelper=t}getInertBodyElement(t){t=`<body><remove></remove>`+t;try{let e=new window.DOMParser().parseFromString(hd(t),`text/html`).body;return e===null?this.inertDocumentHelper.getInertBodyElement(t):(e.firstChild?.remove(),e)}catch{return null}}};var bm=class{defaultDoc;inertDocument;constructor(t){this.defaultDoc=t,this.inertDocument=this.defaultDoc.implementation.createHTMLDocument(`sanitization-inert`)}getInertBodyElement(t){let e=this.inertDocument.createElement(`template`);return e.innerHTML=hd(t),e}};function fN(){try{return!!new window.DOMParser().parseFromString(hd(``),`text/html`)}catch{return!1}}var hN=/^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;function Sa(n){return n=String(n),n.match(hN)?n:`unsafe:`+n}function Qn(n){let t=Object.create(null);for(let e of n.split(`,`))t[e]=!0;return t}function wa(...n){let t=Object.create(null);for(let e of n)for(let i in e)Object.hasOwn(e,i)&&(t[i]=!0);return t}var dS=Qn(`area,br,col,hr,img,wbr`);var uS=Qn(`colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr`);var fS=Qn(`rp,rt`);var mN=wa(fS,uS);var tb=wa(dS,wa(uS,Qn(`address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul`)),wa(fS,Qn(`a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video`)),mN);var hS=Qn(`background,cite,href,itemtype,longdesc,poster,src,xlink:href`);var _N=wa(hS,Qn(`abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width`),Qn(`aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext`));var bN=Qn(`script,style,template`);var Sm=class{sanitizedSomething=!1;buf=[];sanitizeChildren(t){let e=t.firstChild,i=!0,r=[];for(;e;){if(e.nodeType===Node.ELEMENT_NODE?i=this.startElement(e):e.nodeType===Node.TEXT_NODE?this.chars(e.nodeValue):this.sanitizedSomething=!0,i&&e.firstChild){r.push(e),e=CN(e);continue}for(;e;){e.nodeType===Node.ELEMENT_NODE&&this.endElement(e);let o=wN(e);if(o){e=o;break}e=r.pop()}}return this.buf.join(``)}startElement(t){let e=nb(t).toLowerCase();if(!Object.hasOwn(tb,e))return this.sanitizedSomething=!0,!Object.hasOwn(bN,e);this.buf.push(`<`),this.buf.push(e);let i=t.attributes;for(let r=0;r<i.length;r++){let o=i.item(r),s=o.name,a=s.toLowerCase();if(!Object.hasOwn(_N,a)){this.sanitizedSomething=!0;continue}let c=o.value;hS[a]&&(c=Sa(c)),this.buf.push(` `,s,`="`,ib(c),`"`)}return this.buf.push(`>`),!0}endElement(t){let e=nb(t).toLowerCase();Object.hasOwn(tb,e)&&!Object.hasOwn(dS,e)&&(this.buf.push(`</`),this.buf.push(e),this.buf.push(`>`))}chars(t){this.buf.push(ib(t))}};function SN(n,t){return(n.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY)!==Node.DOCUMENT_POSITION_CONTAINED_BY}function wN(n){let t=n.nextSibling;if(t&&n!==t.previousSibling)throw mS(t);return t}function CN(n){let t=n.firstChild;if(t&&SN(n,t))throw mS(t);return t}function nb(n){let t=n.nodeName;return typeof t==`string`?t:`FORM`}function mS(n){return new Error(`Failed to sanitize html because the element is clobbered: ${n.outerHTML}`)}var DN=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g;var EN=/([^\#-~ |!])/g;function ib(n){return n.replace(/&/g,`&amp;`).replace(DN,function(t){let e=t.charCodeAt(0),i=t.charCodeAt(1);return`&#`+((e-55296)*1024+(i-56320)+65536)+`;`}).replace(EN,function(t){return`&#`+t.charCodeAt(0)+`;`}).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}var zl;function md(n,t){let e=null;try{zl=zl||uN(n);let i=t?String(t):``;e=zl.getInertBodyElement(i);let r=5,o=i;do{if(r===0)throw new Error(`Failed to sanitize html because the input is unstable`);r--,i=o,o=e.innerHTML,e=zl.getInertBodyElement(i)}while(i!==o);return hd(new Sm().sanitizeChildren(rb(e)||e))}finally{if(e){let i=rb(e)||e;for(;i.firstChild;)i.firstChild.remove()}}}function rb(n){return`content`in n&&xN(n)?n.content:null}function xN(n){return n.nodeType===Node.ELEMENT_NODE&&n.nodeName===`TEMPLATE`}var IN=/^>|^->|<!--|-->|--!>|<!-$/g;var NN=/(<|>)/g;var MN=`​$1​`;function TN(n){return n.replace(IN,t=>t.replace(NN,MN))}function AN(n,t){return n.createText(t)}function RN(n,t,e){n.setValue(t,e)}function kN(n,t){return n.createComment(TN(t))}function pS(n,t,e){return n.createElement(t,e)}function br(n,t,e,i,r){n.insertBefore(t,e,i,r)}function gS(n,t,e){n.appendChild(t,e)}function ob(n,t,e,i,r){i!==null?br(n,t,e,i,r):gS(n,t,e)}function vS(n,t,e,i){n.removeChild(null,t,e,i)}function ON(n,t,e){n.setAttribute(t,`style`,e)}function PN(n,t,e){e===``?n.removeAttribute(t,`class`):n.setAttribute(t,`class`,e)}function yS(n,t,e){let{mergedAttrs:i,classes:r,styles:o}=e;i!==null&&zI(n,t,i),r!==null&&PN(n,t,r),o!==null&&ON(n,t,o)}function FN(n,t=!0){if(n[0]!=`:`)return[null,n];let e=n.indexOf(`:`,1);if(e===-1){if(t)throw new Error(`Unsupported format "${n}" expecting ":namespace:name"`);return[null,n]}return[n.slice(1,e),n.slice(e+1)]}function LN(n,t,e){if(t!==void 0&&e!==void 0&&SS(t,e)!==ce.HTML)return n;let i=ep();return i?J_(i.sanitize(ce.HTML,n)||``):Tn(n,`HTML`)?J_(kt(n)):md(Gm(),cr(n))}function _S(n){let t=ep();return t?t.sanitize(ce.URL,n)||``:Tn(n,`URL`)?kt(n):Sa(cr(n))}function bS(n){let t=ep();if(t)return eb(t.sanitize(ce.RESOURCE_URL,n)||``);if(Tn(n,`ResourceURL`))return eb(kt(n));throw new _(904,!1)}function jN(n,t){switch(SS(n,t)){case ce.RESOURCE_URL:return bS;case ce.URL:return _S;default:return null}}function Jm(n,t,e){return jN(t,e)?.(n)??n}function ep(){let n=j();return n&&n[tn].sanitizer}function SS(n,t){let[e,i]=VN(n);return m_(i,t,e)}function VN(n){n=n.toLowerCase();let t=FN(n,!1);if(t[0])return t;let i=rn()===-1?null:yr(),r=i?.namespace;if(n===`#host`&&i?.type===2){let o=Et(i,j());if(o.tagName&&(n=o.tagName.toLowerCase()),r==null){let s=o.namespaceURI;r=s&&lN[s]}}return[r,n]}function BN(n){return n instanceof Function?n():n}function UN(n,t,e){let i=n.length;for(;;){let r=n.indexOf(t,e);if(r===-1)return r;if(r===0||n.charCodeAt(r-1)<=32){let o=t.length;if(r+o===i||n.charCodeAt(r+o)<=32)return r}e=r+1}}var wS=`ng-template`;function HN(n,t,e,i){let r=0;if(i){for(;r<t.length&&typeof t[r]==`string`;r+=2)if(t[r]===`class`&&UN(t[r+1].toLowerCase(),e,0)!==-1)return!0}else if(tp(n))return!1;if(r=t.indexOf(1,r),r>-1){let o;for(;++r<t.length&&typeof(o=t[r])==`string`;)if(o.toLowerCase()===e)return!0}return!1}function tp(n){return n.type===4&&n.value!==wS}function zN(n,t,e){return t===(n.type===4&&!e?wS:n.value)}function $N(n,t,e){let i=4,r=n.attrs,o=r!==null?qN(r):0,s=!1;for(let a=0;a<t.length;a++){let c=t[a];if(typeof c==`number`){if(!s&&!an(i)&&!an(c))return!1;if(s&&an(c))continue;s=!1,i=c|i&1;continue}if(!s)if(i&4){if(i=2|i&1,c!==``&&!zN(n,c,e)||c===``&&t.length===1){if(an(i))return!1;s=!0}}else if(i&8){if(r===null||!HN(n,r,c,e)){if(an(i))return!1;s=!0}}else{let l=t[++a],d=WN(c,r,tp(n),e);if(d===-1){if(an(i))return!1;s=!0;continue}if(l!==``){let f;if(d>o?f=``:f=r[d+1].toLowerCase(),i&2&&l!==f){if(an(i))return!1;s=!0}}}}return an(i)||s}function an(n){return(n&1)===0}function WN(n,t,e,i){if(t===null)return-1;let r=0;if(i||!e){let o=!1;for(;r<t.length;){let s=t[r];if(s===n)return r;if(s===3||s===6)o=!0;else if(s===1||s===2){let a=t[++r];for(;typeof a==`string`;)a=t[++r];continue}else{if(s===4)break;if(s===0){r+=4;continue}}r+=o?1:2}return-1}else return YN(t,n)}function CS(n,t,e=!1){for(let i=0;i<t.length;i++)if($N(n,t[i],e))return!0;return!1}function GN(n){let t=n.attrs;if(t!=null){let e=t.indexOf(5);if((e&1)===0)return t[e+1]}return null}function qN(n){for(let t=0;t<n.length;t++){let e=n[t];if(Bb(e))return t}return n.length}function YN(n,t){let e=n.indexOf(4);if(e>-1)for(e++;e<n.length;){let i=n[e];if(typeof i==`number`)return-1;if(i===t)return e;e++}return-1}function ZN(n,t){e:for(let e=0;e<t.length;e++){let i=t[e];if(n.length===i.length){for(let r=0;r<n.length;r++)if(n[r]!==i[r])continue e;return!0}}return!1}function sb(n,t){return n?`:not(`+t.trim()+`)`:t}function KN(n){let t=n[0],e=1,i=2,r=``,o=!1;for(;e<n.length;){let s=n[e];if(typeof s==`string`)if(i&2){let a=n[++e];r+=`[`+s+(a.length>0?`="`+a+`"`:``)+`]`}else i&8?r+=`.`+s:i&4&&(r+=` `+s);else r!==``&&!an(s)&&(t+=sb(o,r),r=``),i=s,o=o||!an(i);e++}return r!==``&&(t+=sb(o,r)),t}function QN(n){return n.map(KN).join(`,`)}function XN(n){let t=[],e=[],i=1,r=2;for(;i<n.length;){let o=n[i];if(typeof o==`string`)r===2?o!==``&&t.push(o,n[++i]):r===8&&e.push(o);else{if(!an(r))break;r=o}i++}return e.length&&t.push(1,...e),t}var gt={};var Nn=(function(n){return n[n.Important=1]=`Important`,n[n.DashCase=2]=`DashCase`,n})(Nn||{});var JN;function np(n,t){return JN(n,t)}var Ii=new Set;typeof document<`u`&&document?.documentElement?.getAnimations;var wm=new WeakMap;function DS(n){return n?n[Si]??n:null}var da=new WeakSet;function eM(n,t,e){let i=wm.get(n);if(!i||i.length===0)return;let r=t.parentNode,o=t.previousSibling,s=DS(e);for(let a=i.length-1;a>=0;a--){let{el:c,declarationView:l}=i[a],d=c.parentNode;c===t?(i.splice(a,1),da.add(c),c.dispatchEvent(new CustomEvent(`animationend`,{detail:{cancel:!0}}))):o&&c===o?(i.splice(a,1),c.dispatchEvent(new CustomEvent(`animationend`,{detail:{cancel:!0}})),c.parentNode?.removeChild(c)):d&&r&&d!==r&&(s===null||l===null||s===l)&&(i.splice(a,1),c.dispatchEvent(new CustomEvent(`animationend`,{detail:{cancel:!0}})),c.parentNode?.removeChild(c))}}function tM(n,t,e){let i=DS(e),r=wm.get(n);r?r.some(o=>o.el===t)||r.push({el:t,declarationView:i}):wm.set(n,[{el:t,declarationView:i}])}var pd=(function(n){return n[n.CHANGE_DETECTION=0]=`CHANGE_DETECTION`,n[n.AFTER_NEXT_RENDER=1]=`AFTER_NEXT_RENDER`,n})(pd||{});var An=new g(``);var ab=new Set;function Rn(n){ab.has(n)||(ab.add(n),performance?.mark?.(`mark_feature_usage`,{detail:{feature:n}}))}var gd=(()=>{class n{impl=null;execute(){this.impl?.execute()}static ɵprov=W({token:n,providedIn:`root`,factory:()=>new n})}return n})();var ip=[0,1,2,3];var rp=(()=>{class n{ngZone=u(I);scheduler=u(bn);errorHandler=u(lt,{optional:!0});sequences=new Set;deferredRegistrations=new Set;executing=!1;constructor(){u(An,{optional:!0})}execute(){let e=this.sequences.size>0;e&&pe(de.AfterRenderHooksStart),this.executing=!0;for(let i of ip)for(let r of this.sequences)if(!(r.erroredOrDestroyed||!r.hooks[i]))try{r.pipelinedValue=this.ngZone.runOutsideAngular(()=>this.maybeTrace(()=>{let o=r.hooks[i];return o(r.pipelinedValue)},r.snapshot))}catch(o){r.erroredOrDestroyed=!0,this.errorHandler?.handleError(o)}this.executing=!1;for(let i of this.sequences)i.afterRun(),i.once&&(this.sequences.delete(i),i.destroy());for(let i of this.deferredRegistrations)this.sequences.add(i);this.deferredRegistrations.size>0&&this.scheduler.notify(7),this.deferredRegistrations.clear(),e&&pe(de.AfterRenderHooksEnd)}register(e){let{view:i}=e;i!==void 0?((i[ur]??=[]).push(e),pr(i),i[B]|=8192):this.executing?this.deferredRegistrations.add(e):this.addSequence(e)}addSequence(e){this.sequences.add(e),this.scheduler.notify(7)}unregister(e){this.executing&&this.sequences.has(e)?(e.erroredOrDestroyed=!0,e.pipelinedValue=void 0,e.once=!0):(this.sequences.delete(e),this.deferredRegistrations.delete(e))}maybeTrace(e,i){return i?i.run(pd.AFTER_NEXT_RENDER,e):e()}static ɵprov=W({token:n,providedIn:`root`,factory:()=>new n})}return n})();var ma=class{impl;hooks;view;once;snapshot;erroredOrDestroyed=!1;pipelinedValue=void 0;unregisterOnDestroy;constructor(t,e,i,r,o,s=null){this.impl=t,this.hooks=e,this.view=i,this.once=r,this.snapshot=s,this.unregisterOnDestroy=o?.onDestroy(()=>this.destroy())}afterRun(){this.erroredOrDestroyed=!1,this.pipelinedValue=void 0,this.snapshot?.dispose(),this.snapshot=null}destroy(){this.impl.unregister(this),this.unregisterOnDestroy?.();let t=this.view?.[ur];t&&(this.view[ur]=t.filter(e=>e!==this))}};function xt(n,t){let e=t?.injector??u(T);return Rn(`NgAfterNextRender`),iM(n,e,t,!0)}function nM(n){return n instanceof Function?[void 0,void 0,n,void 0]:[n.earlyRead,n.write,n.mixedReadWrite,n.read]}function iM(n,t,e,i){let r=t.get(gd);r.impl??=t.get(rp);let o=t.get(An,null,{optional:!0}),s=e?.manualCleanup!==!0?t.get(ke):null,a=t.get(bo,null,{optional:!0}),c=new ma(r.impl,nM(n),a?.view,i,s,o?.snapshot(null));return r.impl.register(c),c}var op=new g(``,{factory:()=>{let n=u(_e),t=new Set;return n.onDestroy(()=>t.clear()),{queue:t,isScheduled:!1,scheduler:null,injector:n}}});function ES(n,t,e){let i=n.get(op);if(Array.isArray(t))for(let r of t)i.queue.add(r),e?.detachedLeaveAnimationFns?.push(r);else i.queue.add(t),e?.detachedLeaveAnimationFns?.push(t);i.scheduler&&i.scheduler(n)}function rM(n,t){let e=n.get(op);if(Array.isArray(t))for(let i of t)e.queue.delete(i);else e.queue.delete(t)}function oM(n,t){let e=n.get(op);if(t.detachedLeaveAnimationFns){for(let i of t.detachedLeaveAnimationFns)e.queue.delete(i);t.detachedLeaveAnimationFns=void 0}}function sM(n,t){for(let[e,i]of t)ES(n,i.animateFns)}function cb(n,t,e,i){let r=n?.[En]?.enter;t!==null&&r&&r.has(e.index)&&sM(i,r)}function lb(n,t,e,i){try{e.get(ea)}catch{return i(!1)}let r=n?.[En];r?.enter?.has(t.index)&&rM(e,r.enter.get(t.index).animateFns);let o=aM(n,t,r);if(o.size===0){let s=!1;if(n){let a=[];vd(n,t,a),s=a.length>0}if(!s)return i(!1)}n&&Ii.add(n[Dn]),ES(e,()=>cM(n,t,r||void 0,o,i),r||void 0)}function aM(n,t,e){let i=new Map,r=e?.leave;if(r&&r.has(t.index)&&i.set(t.index,r.get(t.index)),n&&r)for(let[o,s]of r){if(i.has(o))continue;let c=n[A].data[o].parent;for(;c;){if(c===t){i.set(o,s);break}c=c.parent}}return i}function cM(n,t,e,i,r){let o=[];if(e&&e.leave)for(let[s]of i){if(!e.leave.has(s))continue;let a=e.leave.get(s);for(let c of a.animateFns){let{promise:l}=c();o.push(l)}e.detachedLeaveAnimationFns=void 0}if(n&&vd(n,t,o),o.length>0){let s=e||n?.[En];if(s){let a=s.running;a&&o.push(a),s.running=Promise.allSettled(o),dM(n,s.running,r)}else Promise.allSettled(o).then(()=>{n&&Ii.delete(n[Dn]),r(!0)})}else n&&Ii.delete(n[Dn]),r(!1)}function vd(n,t,e){if(t.type&12){let r=n[t.index];if(Ht(r))for(let o=Ne;o<r.length;o++){let s=r[o];s[A].type===2&&lM(s,e)}}let i=t.child;for(;i;)vd(n,i,e),i=i.next}function lM(n,t){let e=n[En];if(e&&e.leave)for(let r of e.leave.values())for(let o of r.animateFns){let{promise:s}=o();t.push(s)}let i=n[A].firstChild;for(;i;)vd(n,i,t),i=i.next}function dM(n,t,e){t.then(()=>{n[En]?.running===t&&(n[En].running=void 0,Ii.delete(n[Dn])),e(!0)})}function So(n,t,e,i,r,o,s,a){if(r!=null){let c,l=!1;Ht(r)?c=r:Gn(r)&&(l=!0,r=r[en]);let d=nt(r);n===0&&i!==null?(cb(a,i,o,e),s==null?gS(t,i,d):br(t,i,d,s||null,!0)):n===1&&i!==null?(cb(a,i,o,e),br(t,i,d,s||null,!0),eM(o,d,a)):n===2?(a?.[En]?.leave?.has(o.index)&&tM(o,d,a),da.delete(d),lb(a,o,e,f=>{if(da.has(d)){da.delete(d);return}vS(t,d,l,f)})):n===3&&(da.delete(d),lb(a,o,e,()=>{t.destroyNode(d)})),c!=null&&SM(t,n,e,c,o,i,s)}}function uM(n,t){xS(n,t),t[en]=null,t[tt]=null}function fM(n,t,e,i,r,o){i[en]=r,i[tt]=t,_d(n,i,e,1,r,o)}function xS(n,t){t[tn].changeDetectionScheduler?.notify(9),_d(n,t,t[be],2,null,null)}function hM(n){let t=n[go];if(!t)return Jh(n[A],n);for(;t;){let e=null;if(Gn(t))e=t[go];else{let i=t[Ne];i&&(e=i)}if(!e){for(;t&&!t[Ut]&&t!==n;)Gn(t)&&Jh(t[A],t),t=t[$e];t===null&&(t=n),Gn(t)&&Jh(t[A],t),e=t&&t[Ut]}t=e}}function sp(n,t){let e=n[hr],i=e.indexOf(t);e.splice(i,1)}function yd(n,t){if(mr(t))return;let e=t[be];e.destroyNode&&_d(n,t,e,3,null,null),hM(t)}function Jh(n,t){if(mr(t))return;let e=O(null);try{t[B]&=-129,t[B]|=256,t[At]&&Hn(t[At]),pM(n,t),mM(n,t),t[A].type===1&&t[be].destroy();let i=t[wi];if(i!==null&&Ht(t[$e])){i!==t[$e]&&sp(i,t);let r=t[Cn];r!==null&&r.detachView(n)}um(t)}finally{O(e)}}function mM(n,t){let e=n.cleanup,i=t[po];if(e!==null)for(let s=0;s<e.length-1;s+=2)if(typeof e[s]==`string`){let a=e[s+3];a>=0?i[a]():i[-a].unsubscribe(),s+=2}else{let a=i[e[s+1]];e[s].call(a)}i!==null&&(t[po]=null);let r=t[zn];if(r!==null){t[zn]=null;for(let s=0;s<r.length;s++){let a=r[s];a()}}let o=t[$n];if(o!==null){t[$n]=null;for(let s of o)s.destroy()}}function pM(n,t){let e;if(n!=null&&(e=n.destroyHooks)!=null)for(let i=0;i<e.length;i+=2){let r=t[e[i]];if(!(r instanceof wr)){let o=e[i+1];if(Array.isArray(o))for(let s=0;s<o.length;s+=2){let a=r[o[s]],c=o[s+1];pe(de.LifecycleHookStart,a,c);try{c.call(a)}finally{pe(de.LifecycleHookEnd,a,c)}}else{pe(de.LifecycleHookStart,r,o);try{o.call(r)}finally{pe(de.LifecycleHookEnd,r,o)}}}}}function IS(n,t,e){if(t===null)throw new _(510,!1);return gM(n,t.parent,e)}function gM(n,t,e){let i=t;for(;i!==null&&i.type&168;)t=i,i=t.parent;if(i===null)return e[en];if(xn(i)){let{encapsulation:r}=n.data[i.directiveStart+i.componentOffset];if(r===ln.None||r===ln.Emulated)return null}return Et(i,e)}function NS(n,t,e){return yM(n,t,e)}function vM(n,t,e){return n.type&40?Et(n,e):null}var yM=vM;var db;function ap(n,t,e,i){let r=IS(n,i,t),o=t[be],a=NS(i.parent||t[tt],i,t);if(r!=null)if(Array.isArray(e))for(let c=0;c<e.length;c++)ob(o,r,e[c],a,!1);else ob(o,r,e,a,!1);db!==void 0&&db(o,i,t,e,r)}function ua(n,t){if(t!==null){let e=t.type;if(e&3)return Et(t,n);if(e&4)return Cm(-1,n[t.index]);if(e&8){let i=t.child;if(i!==null)return ua(n,i);{let r=n[t.index];return Ht(r)?Cm(-1,r):nt(r)}}else{if(e&128)return ua(n,t.next);if(e&32)return np(t,n)()||nt(n[t.index]);{let i=MS(n,t);if(i!==null){if(Array.isArray(i))return i[0];return ua(Wn(n[pt]),i)}else return ua(n,t.next)}}}return null}function MS(n,t){if(t!==null){let i=n[pt][tt],r=t.projection;return i.projection[r]}return null}function Cm(n,t){let e=Ne+n+1;if(e<t.length){let i=t[e],r=i[A].firstChild;if(r!==null)return ua(i,r)}return t[fr]}function cp(n,t,e,i,r,o,s){for(;e!=null;){let a=i[wn];if(e.type===128){e=e.next;continue}let c=i[e.index],l=e.type;if(s&&t===0&&(c&&Do(nt(c),i),e.flags|=2),!fd(e))if(l&8)cp(n,t,e.child,i,r,o,!1),So(t,n,a,r,c,e,o,i);else if(l&32){let d=np(e,i),f;for(;f=d();)So(t,n,a,r,f,e,o,i);So(t,n,a,r,c,e,o,i)}else l&16?TS(n,t,i,e,r,o):So(t,n,a,r,c,e,o,i);e=s?e.projectionNext:e.next}}function _d(n,t,e,i,r,o){n.type===3?_M(e,i,t,r,o):cp(e,i,n.firstChild,t,r,o,!1)}function _M(n,t,e,i,r){let s=e[A].firstChild,a=s.next,c=nt(e[s.index]),l=nt(e[a.index]),d=a.index+1,f=e[d];if(t===1||t===0)i!==null&&(f&&f.hasChildNodes()?br(n,i,f,r,!0):(br(n,i,c,r,!0),br(n,i,l,r,!0)));else if(t===2){if(f||(f=document.createDocumentFragment(),e[d]=f),c&&c.parentNode===f)return;let h=c;for(;h!==null;){let m=h.nextSibling;if(f.appendChild(h),h===l)break;h=m}}}function bM(n,t,e){let i=t[be];TS(i,0,t,e,IS(n,e,t),NS(e.parent||t[tt],e,t))}function TS(n,t,e,i,r,o){let s=e[pt],c=s[tt].projection[i.projection];if(Array.isArray(c))for(let l=0;l<c.length;l++){let d=c[l];So(t,n,e[wn],r,d,i,o,e)}else{let l=c,d=s[$e];Qb(i)&&(l.flags|=128),cp(n,t,l,d,r,o,!0)}}function SM(n,t,e,i,r,o,s){let a=i[fr];if(a!==nt(i)&&So(t,n,e,o,a,r,s),(i[B]&4)===0)for(let l=Ne;l<i.length;l++){let d=i[l];_d(d[A],d,n,t,o,a)}}function wM(n,t,e,i,r){if(t)r?n.addClass(e,i):n.removeClass(e,i);else{let o=i.indexOf(`-`)===-1?void 0:Nn.DashCase;r==null?n.removeStyle(e,i,o):(typeof r==`string`&&r.endsWith(`!important`)&&(r=r.slice(0,-10),o|=Nn.Important),n.setStyle(e,i,r,o))}}function lp(n,t,e,i,r,o,s,a,c,l,d){let f=Ae+i,h=f+r,m=CM(f,h),v=typeof l==`function`?l():l;return m[A]={type:n,blueprint:m,template:e,queries:null,viewQuery:a,declTNode:t,data:m.slice().fill(null,f),bindingStartIndex:f,expandoStartIndex:h,hostBindingOpCodes:null,firstCreatePass:!0,firstUpdatePass:!0,staticViewQueries:!1,staticContentQueries:!1,preOrderHooks:null,preOrderCheckHooks:null,contentHooks:null,contentCheckHooks:null,viewHooks:null,viewCheckHooks:null,destroyHooks:null,cleanup:null,contentQueries:null,components:null,directiveRegistry:typeof o==`function`?o():o,pipeRegistry:typeof s==`function`?s():s,firstChild:null,schemas:c,consts:v,incompleteFirstPass:!1,ssrId:d}}function CM(n,t){let e=[];for(let i=0;i<t;i++)e.push(i<n?null:gt);return e}function DM(n){let t=n.tView;return t===null||t.incompleteFirstPass?n.tView=lp(1,null,n.template,n.decls,n.vars,n.directiveDefs,n.pipeDefs,n.viewQuery,n.schemas,n.consts,n.id):t}function dp(n,t,e,i,r,o,s,a,c,l,d){let f=t.blueprint.slice();return f[en]=r,f[B]=i|1228,(l!==null||n&&n[B]&2048)&&(f[B]|=2048),Ah(f),f[$e]=f[Si]=n,f[Oe]=e,f[tn]=s||n&&n[tn],f[be]=a||n&&n[be],f[wn]=c||n&&n[wn]||null,f[tt]=o,f[Dn]=iN(),f[lr]=d,f[Ih]=l,f[pt]=t.type==2?n[pt]:f,f}function EM(n,t,e){let i=Et(t,n),r=DM(e),o=n[tn].rendererFactory,s=up(n,dp(n,r,null,AS(e),i,t,null,o.createRenderer(i,e),null,null,null));return n[t.index]=s}function AS(n){let t=16;return n.signals?t=4096:n.onPush&&(t=64),t}function RS(n,t,e,i){if(e===0)return-1;let r=t.length;for(let o=0;o<e;o++)t.push(i),n.blueprint.push(i),n.data.push(null);return r}function up(n,t){return n[go]?n[xh][Ut]=t:n[go]=t,n[xh]=t,t}function le(n=1){kS(De(),j(),rn()+n,!1)}function kS(n,t,e,i){if(!i)if((t[B]&3)===3){let o=n.preOrderCheckHooks;o!==null&&Wl(t,o,e)}else{let o=n.preOrderHooks;o!==null&&Gl(t,o,0,e)}Di(e)}var Ca=(function(n){return n[n.None=0]=`None`,n[n.SignalBased=1]=`SignalBased`,n[n.HasDecoratorInputTransform=2]=`HasDecoratorInputTransform`,n})(Ca||{});function Cr(n,t,e,i){let r=O(null);try{let[o,s,a]=n.inputs[e],c=null;(s&Ca.SignalBased)!==0&&(c=t[o][Ce]),c!==null&&c.transformFn!==void 0?i=c.transformFn(i):a!==null&&(i=a.call(t,i)),n.setInput!==null?n.setInput(t,c,i,e,o):Pb(t,c,o,i)}finally{O(r)}}function OS(n,t,e,i,r){let o=rn(),s=i&2;try{Di(-1),s&&t.length>Ae&&kS(n,t,Ae,!1);pe(s?de.TemplateUpdateStart:de.TemplateCreateStart,r,e),e(i,r)}finally{Di(o);pe(s?de.TemplateUpdateEnd:de.TemplateCreateEnd,r,e)}}function bd(n,t,e){AM(n,t,e),(e.flags&64)===64&&RM(n,t,e)}function Da(n,t,e=Et){let i=t.localNames;if(i!==null){let r=t.index+1;for(let o=0;o<i.length;o+=2){let s=i[o+1],a=s===-1?e(t,n):n[s];n[r++]=a}}}function xM(n,t,e,i){let o=i.get(oS,rS)||e===ln.ShadowDom||e===ln.ExperimentalIsolatedShadowDom;return n.selectRootElement(t,o)}function MM(n){return n===`class`?`className`:n===`for`?`htmlFor`:n===`formaction`?`formAction`:n===`innerHtml`?`innerHTML`:n===`readonly`?`readOnly`:n===`tabindex`?`tabIndex`:n}function TM(n,t,e,i,r,o){let s=t[A];if(Sd(n,s,t,e,i)){xn(n)&&FS(t,n.index);return}n.type&3&&(e=MM(e)),PS(n,t,e,i,r,o)}function PS(n,t,e,i,r,o){if(n.type&3){let s=Et(n,t);i=o!=null?o(i,n.value||``,e):i,r.setProperty(s,e,i)}else n.type&12}function FS(n,t){let e=zt(t,n);e[B]&16||(e[B]|=64)}function AM(n,t,e){let i=e.directiveStart,r=e.directiveEnd;xn(e)&&EM(t,e,n.data[i+e.componentOffset]),n.firstCreatePass||Xl(e,t);let o=e.initialInputs;for(let s=i;s<r;s++){let a=n.data[s],c=ha(t,n,s,e);if(Do(c,t),o!==null&&PM(t,s-i,c,a,e,o),nn(a)){let l=zt(e.index,t);l[Oe]=ha(t,n,s,e)}}}function RM(n,t,e){let i=e.directiveStart,r=e.directiveEnd,o=e.index,s=M_();try{Di(o);for(let a=i;a<r;a++){let c=n.data[a],l=t[a];kl(a),(c.hostBindings!==null||c.hostVars!==0||c.hostAttrs!==null)&&kM(c,l)}}finally{Di(-1),kl(s)}}function kM(n,t){n.hostBindings!==null&&n.hostBindings(1,t)}function fp(n,t){let e=n.directiveRegistry,i=null;if(e)for(let r=0;r<e.length;r++){let o=e[r];CS(t,o.selectors,!1)&&(i??=[],nn(o)?i.unshift(o):i.push(o))}return i}function OM(n,t,e,i,r,o){let s=Et(n,t);LS(t[be],s,o,n.value,e,i,r)}function LS(n,t,e,i,r,o,s){if(o==null)s?.(o,i||``,r),n.removeAttribute(t,r,e);else{let a=s==null?cr(o):s(o,i||``,r);n.setAttribute(t,r,a,e)}}function PM(n,t,e,i,r,o){let s=o[t];if(s!==null)for(let a=0;a<s.length;a+=2){let c=s[a],l=s[a+1];Cr(i,e,c,l)}}function hp(n,t,e,i,r){let o=Ae+e,s=t[A],a=r(s,t,n,i,e);t[o]=a,_o(n,!0);let c=n.type===2;return c?(yS(t[be],a,n),(S_()===0||vo(n))&&Do(a,t),w_()):Do(a,t),Ll()&&(!c||!fd(n))&&ap(s,t,a,n),n}function mp(n){let t=n;return Bh()?Uh():(t=t.parent,_o(t,!1)),t}function FM(n,t){let e=n[wn];if(!e)return;let i;try{i=e.get($t,null)}catch{i=null}i?.(t)}function Sd(n,t,e,i,r){let o=n.inputs?.[i],s=n.hostDirectiveInputs?.[i],a=!1;if(s)for(let c=0;c<s.length;c+=2){let l=s[c],d=s[c+1],f=t.data[l];Cr(f,e[l],d,r),a=!0}if(o)for(let c of o){let l=e[c],d=t.data[c];Cr(d,l,i,r),a=!0}return a}function LM(n,t,e,i,r,o){let s=null,a=null,c=null,l=!1,d=n.directiveToIndex.get(i.type);if(typeof d==`number`?s=d:[s,a,c]=d,a!==null&&c!==null&&n.hostDirectiveInputs&&Object.hasOwn(n.hostDirectiveInputs,r)){let f=n.hostDirectiveInputs[r];for(let h=0;h<f.length;h+=2){let m=f[h];if(m>=a&&m<=c){let v=t.data[m],y=f[h+1];Cr(v,e[m],y,o),l=!0}else if(m>c)break}}return s!==null&&Object.hasOwn(i.inputs,r)&&(Cr(i,e[s],r,o),l=!0),l}function jM(n,t){let e=zt(t,n),i=e[A];VM(i,e);let r=e[en];r!==null&&e[lr]===null&&(e[lr]=sS(r,e[wn])),pe(de.ComponentStart);try{pp(i,e,e[Oe])}finally{pe(de.ComponentEnd,e[Oe])}}function VM(n,t){for(let e=t.length;e<n.blueprint.length;e++)t.push(n.blueprint[e])}function pp(n,t,e){Pl(t);try{let i=n.viewQuery;i!==null&&hm(1,i,e);let r=n.template;r!==null&&OS(n,t,r,1,e),n.firstCreatePass&&(n.firstCreatePass=!1),t[Cn]?.finishViewCreation(n),n.staticContentQueries&&aS(n,t),n.staticViewQueries&&hm(2,n.viewQuery,e);let o=n.components;o!==null&&BM(t,o)}catch(i){throw n.firstCreatePass&&(n.incompleteFirstPass=!0,n.firstCreatePass=!1),i}finally{t[B]&=-5,Fl()}}function BM(n,t){for(let e=0;e<t.length;e++)jM(n,t[e])}function Ea(n,t,e,i){let r=O(null);try{let o=t.tView,c=dp(n,o,e,n[B]&4096?4096:16,null,t,null,null,i?.injector??null,i?.embeddedViewInjector??null,i?.dehydratedView??null);c[wi]=n[t.index];let d=n[Cn];return d!==null&&(c[Cn]=d.createEmbeddedView(o)),pp(o,c,e),c}finally{O(r)}}function Eo(n,t){return!t||t.firstChild===null||Qb(n)}function pa(n,t,e,i,r=!1){if(n.type===3){let o=n.firstChild,s=o.next,a=nt(t[o.index]),c=nt(t[s.index]),l=a;for(;l!==null&&(i.push(l),l!==c);)l=l.nextSibling;return i}for(;e!==null;){if(e.type===128){e=r?e.projectionNext:e.next;continue}let o=t[e.index];if(o!==null)if(Ht(o)){let a=o[fr];a!==o[en]&&i.push(nt(o)),o[B]&4||jS(o,i),i.push(a)}else i.push(nt(o));let s=e.type;if(s&8)pa(n,t,e.child,i);else if(s&32){let a=np(e,t),c;for(;c=a();)i.push(c)}else if(s&16){let a=MS(t,e);if(Array.isArray(a))i.push(...a);else{let c=Wn(t[pt]);pa(c[A],c,a,i,!0)}}e=r?e.projectionNext:e.next}return i}function jS(n,t){for(let e=Ne;e<n.length;e++){let i=n[e],r=i[A].firstChild;r!==null&&pa(i[A],i,r,t)}}function VS(n){if(n[ur]!==null){for(let t of n[ur])t.impl.addSequence(t);n[ur].length=0}}var BS=[];function UM(n){return n[At]??HM(n)}function HM(n){let t=BS.pop()??Object.create($M);return t.lView=n,t}function zM(n){n.lView[At]!==n&&(n.lView=null,BS.push(n))}var $M=S(p({},Bn),{consumerIsAlwaysLive:!0,kind:`template`,consumerMarkedDirty:n=>{pr(n.lView)},consumerOnSignalRead(){this.lView[At]=this}});function WM(n){let t=n[At]??Object.create(GM);return t.lView=n,t}var GM=S(p({},Bn),{consumerIsAlwaysLive:!0,kind:`template`,consumerMarkedDirty:n=>{let t=Wn(n.lView);for(;t&&!US(t[A]);)t=Wn(t);t&&Rh(t)},consumerOnSignalRead(){this.lView[At]=this}});function US(n){return n.type!==2}function HS(n){if(n[$n]===null)return;let t=!0;for(;t;){let e=!1;for(let i of n[$n])if(i.dirty&&(e=!0,i.zone===null||Zone.current===i.zone?i.run():i.zone.run(()=>i.run()),n[$n]===null))return;t=e&&!!(n[B]&8192)}}var qM=100;function zS(n,t=0){let i=n[tn].rendererFactory;i.begin?.();try{YM(n,t)}finally{i.end?.()}}function YM(n,t){let e=Hh();try{Gs(!0),Dm(n,t);let i=0;for(;ia(n);){if(i===qM)throw new _(103,!1);i++,Dm(n,1)}}finally{Gs(e)}}function ZM(n,t,e,i){if(mr(t))return;let r=t[B];Pl(t);let a=!0,c=null,l=null;US(n)?(l=UM(t),c=yn(l)):sl()===null?(a=!1,l=WM(t),c=yn(l)):t[At]&&(Hn(t[At]),t[At]=null);try{Ah(t),x_(n.bindingStartIndex),e!==null&&OS(n,t,e,2,i);let d=(r&3)===3;if(d){let m=n.preOrderCheckHooks;m!==null&&Wl(t,m,null)}else{let m=n.preOrderHooks;m!==null&&Gl(t,m,0,null),Qh(t,0)}if(KM(t),HS(t),$S(t,0),n.contentQueries!==null&&aS(n,t),true)if(d){let m=n.contentCheckHooks;m!==null&&Wl(t,m)}else{let m=n.contentHooks;m!==null&&Gl(t,m,1),Qh(t,1)}XM(n,t);let f=n.components;f!==null&&GS(t,f,0);let h=n.viewQuery;if(h!==null&&hm(2,h,i),true)if(d){let m=n.viewCheckHooks;m!==null&&Wl(t,m)}else{let m=n.viewHooks;m!==null&&Gl(t,m,2),Qh(t,2)}if(n.firstUpdatePass===!0&&(n.firstUpdatePass=!1),t[Dl]){for(let m of t[Dl])m();t[Dl]=null}VS(t),t[B]&=-73}catch(d){throw pr(t),d}finally{l!==null&&(Un(l,c),a&&zM(l)),Fl()}}function $S(n,t){for(let e=Jb(n);e!==null;e=eS(e))for(let i=Ne;i<e.length;i++){let r=e[i];WS(r,t)}}function KM(n){for(let t=Jb(n);t!==null;t=eS(t)){if(!(t[B]&2))continue;let e=t[hr];for(let i=0;i<e.length;i++){let r=e[i];Rh(r)}}}function QM(n,t,e){pe(de.ComponentStart);let i=zt(t,n);try{WS(i,e)}finally{pe(de.ComponentEnd,i[Oe])}}function WS(n,t){Il(n)&&Dm(n,t)}function Dm(n,t){let i=n[A],r=n[B],o=n[At],s=!!(t===0&&r&16);if(s||=!!(r&64&&t===0),s||=!!(r&1024),s||=!!(o?.dirty&&er(o)),s||=!1,o&&(o.dirty=!1),n[B]&=-9217,s)ZM(i,n,i.template,n[Oe]);else if(r&8192){let a=O(null);try{HS(n),$S(n,1);let c=i.components;c!==null&&GS(n,c,1),VS(n)}finally{O(a)}}}function GS(n,t,e){for(let i=0;i<t.length;i++)QM(n,t[i],e)}function XM(n,t){let e=n.hostBindingOpCodes;if(e!==null)try{for(let i=0;i<e.length;i++){let r=e[i];if(r<0)Di(~r);else{let o=r,s=e[++i],a=e[++i];N_(s,o);let c=t[o];pe(de.HostBindingsUpdateStart,c);try{a(2,c)}finally{pe(de.HostBindingsUpdateEnd,c)}}}}finally{Di(-1)}}function gp(n,t){let e=Hh()?64:1088;for(n[tn].changeDetectionScheduler?.notify(t);n;){n[B]|=e;let i=Wn(n);if(yo(n)&&!i)return n;n=i}return null}function qS(n,t,e,i){return[n,!0,0,t,null,i,null,e,null,null]}function YS(n,t){let e=Ne+t;if(e<n.length)return n[e]}function xa(n,t,e,i=!0){let r=t[A];if(JM(r,t,n,e),i){let s=Cm(e,n),a=t[be],c=a.parentNode(n[fr]);c!==null&&fM(r,n[tt],a,t,c,s)}let o=t[lr];o!==null&&o.firstChild!==null&&(o.firstChild=null)}function ZS(n,t){let e=ga(n,t);return e!==void 0&&yd(e[A],e),e}function ga(n,t){if(n.length<=Ne)return;let e=Ne+t,i=n[e];if(i){let r=i[wi];r!==null&&r!==n&&sp(r,i),t>0&&(n[e-1][Ut]=i[Ut]);let o=Js(n,Ne+t);uM(i[A],i);let s=o[Cn];s!==null&&s.detachView(o[A]),i[$e]=null,i[Ut]=null,i[B]&=-129}return i}function JM(n,t,e,i){let r=Ne+i,o=e.length;i>0&&(e[r-1][Ut]=t),i<o-Ne?(t[Ut]=e[r],Sh(e,Ne+i,t)):(e.push(t),t[Ut]=null),t[$e]=e;let s=t[wi];s!==null&&e!==s&&KS(s,t);let a=t[Cn];a!==null&&a.insertView(n),Nl(t),t[B]|=128}function KS(n,t){let e=n[hr],i=t[$e];if(Gn(i))n[B]|=2;else{let r=i[$e][pt];t[pt]!==r&&(n[B]|=2)}e===null?n[hr]=[t]:e.push(t)}var Ni=class{_lView;_cdRefInjectingView;_appRef=null;_attachedToViewContainer=!1;exhaustive;get rootNodes(){let t=this._lView,e=t[A];return pa(e,t,e.firstChild,[])}constructor(t,e){this._lView=t,this._cdRefInjectingView=e}get context(){return this._lView[Oe]}set context(t){this._lView[Oe]=t}get destroyed(){return mr(this._lView)}destroy(){if(this._appRef)this._appRef.detachView(this);else if(this._attachedToViewContainer){let t=this._lView[$e];if(Ht(t)){let e=t[na],i=e?e.indexOf(this):-1;i>-1&&(ga(t,i),Js(e,i))}this._attachedToViewContainer=!1}yd(this._lView[A],this._lView)}onDestroy(t){Ml(this._lView,t)}markForCheck(){gp(this._cdRefInjectingView||this._lView,4)}detach(){this._lView[B]&=-129}reattach(){Nl(this._lView),this._lView[B]|=128}detectChanges(){this._lView[B]|=1024,zS(this._lView)}checkNoChanges(){}attachToViewContainerRef(){if(this._appRef)throw new _(902,!1);this._attachedToViewContainer=!0}detachFromAppRef(){this._appRef=null;let t=yo(this._lView),e=this._lView[wi];e!==null&&!t&&sp(e,this._lView),xS(this._lView[A],this._lView)}attachToAppRef(t){if(this._attachedToViewContainer)throw new _(902,!1);this._appRef=t;let e=yo(this._lView),i=this._lView[wi];i!==null&&!e&&KS(i,this._lView),Nl(this._lView)}};var ut=(()=>{class n{_declarationLView;_declarationTContainer;elementRef;static __NG_ELEMENT_ID__=eT;constructor(e,i,r){this._declarationLView=e,this._declarationTContainer=i,this.elementRef=r}get ssrId(){return this._declarationTContainer.tView?.ssrId||null}createEmbeddedView(e,i){return this.createEmbeddedViewImpl(e,i)}createEmbeddedViewImpl(e,i,r){return new Ni(Ea(this._declarationLView,this._declarationTContainer,e,{embeddedViewInjector:i,dehydratedView:r}))}}return n})();function eT(){return wd(We(),j())}function wd(n,t){return n.type&4?new ut(t,n,Mo(n,t)):null}function To(n,t,e,i,r){let o=n.data[t];if(o===null)o=tT(n,t,e,i,r),I_()&&(o.flags|=32);else if(o.type&64){o.type=e,o.value=i,o.attrs=r;let s=C_();o.injectorIndex=s===null?-1:s.injectorIndex}return _o(o,!0),o}function tT(n,t,e,i,r){let o=Vh(),s=Bh(),a=s?o:o&&o.parent,c=n.data[t]=iT(n,a,e,t,i,r);return nT(n,c,o,s),c}function nT(n,t,e,i){n.firstChild===null&&(n.firstChild=t),e!==null&&(i?e.child==null&&t.parent!==null&&(e.child=t):e.next===null&&(e.next=t,t.prev=e))}function iT(n,t,e,i,r,o){let s=t?t.injectorIndex:-1,a=0;return Fh()&&(a|=128),{type:e,index:i,insertBeforeIndex:null,injectorIndex:s,directiveStart:-1,directiveEnd:-1,directiveStylingLast:-1,componentOffset:-1,controlDirectiveIndex:-1,customControlIndex:-1,propertyBindings:null,flags:a,providerIndexes:0,value:r,namespace:Wh(),attrs:o,mergedAttrs:null,localNames:null,initialInputs:null,inputs:null,hostDirectiveInputs:null,outputs:null,hostDirectiveOutputs:null,directiveToIndex:null,tView:null,next:null,prev:null,projectionNext:null,child:null,parent:t,projection:null,styles:null,stylesWithoutHost:null,residualStyles:void 0,classes:null,classesWithoutHost:null,residualClasses:void 0,classBindings:0,styleBindings:0}}function rT(n){let t=n[Nh]??[],i=n[$e][be],r=[];for(let o of t)o.data[iS]!==void 0?r.push(o):oT(o,i);n[Nh]=r}function oT(n,t){let e=0,i=n.firstChild;if(i){let r=n.data[nS];for(;e<r;){let o=i.nextSibling;vS(t,i,!1),i=o,e++}}}var sT=()=>null;var aT=()=>null;function Jl(n,t){return sT(n,t)}function QS(n,t,e){return aT(n,t,e)}var XS=class{};var Ve=class{};var ge=class{destroyNode=null;static __NG_ELEMENT_ID__=()=>cT()};function cT(){let n=j(),e=zt(We().index,n);return(Gn(e)?e:n)[be]}var JS=(()=>{class n{static ɵprov=W({token:n,providedIn:`root`,factory:()=>null})}return n})();function ew(n){return n.debugInfo?.className||n.type.name||null}var Yl={};var ed=class{injector;parentInjector;constructor(t,e){this.injector=t,this.parentInjector=e}get(t,e,i){let r=this.injector.get(t,Yl,i);return r!==Yl||e===Yl?r:this.parentInjector.get(t,e,i)}};function vp(n,t,e){return n[t]=e}function lT(n,t){return n[t]}function Wt(n,t,e){if(e===gt)return!1;let i=n[t];return Object.is(i,e)?!1:(n[t]=e,!0)}function tw(n,t,e,i){let r=Wt(n,t,e);return Wt(n,t+1,i)||r}function Sr(n,t,e){return function i(r){let o=i.__ngNativeEl__;o!==void 0&&oN(r,o);gp(xn(n)?zt(n.index,t):t,5);let a=t[Oe],c=ub(t,a,e,r),l=i.__ngNextListenerFn__;for(;l;)c=ub(t,a,l,r)&&c,l=l.__ngNextListenerFn__;return c}}function ub(n,t,e,i){let r=O(null);try{return pe(de.OutputStart,t,e),e(i)!==!1}catch(o){return FM(n,o),!1}finally{pe(de.OutputEnd,t,e),O(r)}}function yp(n,t,e,i,r,o,s,a){let c=vo(n),l=!1,d=null;if(!i&&c&&(d=uT(t,e,o,n.index)),d!==null){let f=d.__ngLastListenerFn__||d;f.__ngNextListenerFn__=s,d.__ngLastListenerFn__=s,l=!0}else{let f=Et(n,e),h=i?i(f):f;i||(a.__ngNativeEl__=f);let m=r.listen(h,o,a);if(!dT(o))nw(i?y=>i(nt(y[n.index])):n.index,t,e,o,a,m,!1)}return l}function dT(n){return n.startsWith(`animation`)||n.startsWith(`transition`)}function uT(n,t,e,i){let r=n.cleanup;if(r!=null)for(let o=0;o<r.length-1;o+=2){let s=r[o];if(s===e&&r[o+1]===i){let a=t[po],c=r[o+2];return a&&a.length>c?a[c]:null}typeof s==`string`&&(o+=2)}return null}function nw(n,t,e,i,r,o,s){let a=t.firstCreatePass?Oh(t):null,c=kh(e),l=c.length;c.push(r,o),a&&a.push(i,n,l,(l+1)*(s?-1:1))}function fb(n,t,e,i,r){let o=null,s=null,a=null,c=!1,l=n.directiveToIndex.get(e.type);if(typeof l==`number`?o=l:[o,s,a]=l,s!==null&&a!==null&&n.hostDirectiveOutputs&&Object.hasOwn(n.hostDirectiveOutputs,i)){let d=n.hostDirectiveOutputs[i];for(let f=0;f<d.length;f+=2){let h=d[f];if(h>=s&&h<=a)c=!0,td(n,t,h,d[f+1],i,r);else if(h>a)break}}return Object.hasOwn(e.outputs,i)&&(c=!0,td(n,t,o,i,i,r)),c}function td(n,t,e,i,r,o){let s=t[e],a=t[A],f=s[a.data[e].outputs[i]].subscribe(o);nw(n.index,a,t,r,o,f,!0)}function fT(){hT()}function hT(){let n=j(),t=De(),e=We();if(t.firstCreatePass&&gT(t,e),e.controlDirectiveIndex===-1)return;Rn(`NgSignalForms`);let i=n[e.controlDirectiveIndex];t.data[e.controlDirectiveIndex].controlDef.create(i,new nd(n,t,e))}function mT(){pT()}function pT(){let n=j(),t=De(),e=yr();if(e.controlDirectiveIndex===-1)return;let i=t.data[e.controlDirectiveIndex].controlDef,r=n[e.controlDirectiveIndex];i.update(r,new nd(n,t,e))}var nd=class{lView;tView;tNode;hasPassThrough;constructor(t,e,i){this.lView=t,this.tView=e,this.tNode=i,this.hasPassThrough=!!(i.flags&4096)}get customControl(){return this.tNode.customControlIndex!==-1?this.lView[this.tNode.customControlIndex]:void 0}get nativeElement(){return Et(this.tNode,this.lView)}get descriptor(){return`<${this.tNode.value}>`}listenToCustomControlOutput(t,e){let i=this.tView.data[this.tNode.customControlIndex];fb(this.tNode,this.lView,i,t,Sr(this.tNode,this.lView,e))}listenToCustomControlModel(t){let e=this.tNode.flags&1024?`valueChange`:`checkedChange`,i=this.tView.data[this.tNode.customControlIndex];fb(this.tNode,this.lView,i,e,Sr(this.tNode,this.lView,t))}listenToDom(t,e){yp(this.tNode,this.tView,this.lView,void 0,this.lView[be],t,e,Sr(this.tNode,this.lView,e))}setInputOnDirectives(t,e,i){let r=this.tNode.inputs?.[t],o=this.tNode.hostDirectiveInputs?.[t];if(!r&&!o)return!1;let s=!1;if(r)for(let a of r){if(a===this.tNode.controlDirectiveIndex)continue;let c=this.lView[a],l=this.tView.data[a];(!i||i(mb(c,l,t)))&&(Cr(l,c,t,e),s=!0)}if(o)for(let a=0;a<o.length;a+=2){let c=o[a];if(c===this.tNode.controlDirectiveIndex)continue;let l=this.lView[c],d=o[a+1],f=this.tView.data[c];(!i||i(mb(l,f,t)))&&(Cr(f,l,d,e),s=!0)}return s}setCustomControlModelInput(t){let e=this.tView.data[this.tNode.customControlIndex],i=this.tNode.flags&1024?`value`:`checked`;LM(this.tNode,this.tView,this.lView,e,i,t)}customControlHasInput(t){if(this.tNode.customControlIndex===-1)return!1;let e=this.tView.data[this.tNode.customControlIndex];return(e.signalFormsInputPresence??=this._buildCustomControlInputCache(e))[t]===!0}_buildCustomControlInputCache(t){let e={};for(let i in t.inputs)e[i]=!0;if(t.hostDirectives!==null){let i=[...t.hostDirectives];for(;i.length>0;){let r=i.shift();if(typeof r!=`function`){for(let s in r.inputs)e[r.inputs[s]]=!0;let o=hb(r.directive);o!==null&&i.push(...o);continue}for(let o of r()){if(typeof o==`function`)continue;if(o.inputs)for(let a=0;a<o.inputs.length;a+=2){let c=o.inputs[a+1]||o.inputs[a];e[c]=!0}let s=hb(o.directive);s!==null&&i.push(...s)}}}return e}};function hb(n){return typeof n==`function`&&`ɵdir`in n?n.ɵdir.hostDirectives??null:null}function mb(n,t,e){if(!t.inputs||!Object.hasOwn(t.inputs,e))return;let[i,r]=t.inputs[e];if((r&Ca.SignalBased)!==0){let s=n[i][Ce];return s.value===ud?void 0:s.value}return n[i]}function gT(n,t,e){for(let r=t.directiveStart;r<t.directiveEnd;r++)if(n.data[r].controlDef){t.controlDirectiveIndex=r;break}if(t.controlDirectiveIndex===-1)return;let i=n.data[t.controlDirectiveIndex].controlDef;if(i.passThroughInput&&(t.inputs?.[i.passThroughInput]?.length??0)>1){t.flags|=4096;return}vT(n,t)}function vT(n,t){for(let e=t.directiveStart;e<t.directiveEnd;e++){let i=n.data[e];if(!(t.directiveToIndex&&!t.directiveToIndex.has(i.type))){if(pb(i,`value`)){t.flags|=1024,t.customControlIndex=e;return}if(pb(i,`checked`)){t.flags|=2048,t.customControlIndex=e;return}}}if(t.hostDirectiveInputs!==null&&t.hostDirectiveOutputs!==null&&t.directiveToIndex!==null){let e=(i,r)=>{let o=t.hostDirectiveInputs[i],s=t.hostDirectiveOutputs[i+`Change`];if(!o||!s)return!1;for(let a=0;a<o.length;a+=2){let c=o[a];for(let l=0;l<s.length;l+=2)if(c===s[l])for(let f of t.directiveToIndex.values()){if(!Array.isArray(f))continue;let[h,m,v]=f;if(c>=m&&c<=v)return t.flags|=r,t.customControlIndex=h,!0}}return!1};if(e(`value`,1024)||e(`checked`,2048))return}}function pb(n,t){return yT(n,t)&&_T(n,t+`Change`)}function yT(n,t){return t in n.inputs}function _T(n,t){return t in n.outputs}var Em=Symbol(`BINDING`);var Er=new g(``);function id(n,t,e){let i=e?n.styles:null,r=e?n.classes:null,o=0;if(t!==null)for(let s=0;s<t.length;s++){let a=t[s];if(typeof a==`number`)o=a;else if(o==1)r=gl(r,a);else if(o==2){let c=a,l=t[++s];i=gl(i,c+`: `+l+`;`)}}e?n.styles=i:n.stylesWithoutHost=i,e?n.classes=r:n.classesWithoutHost=r}function ne(n,t=0){let e=j();if(e===null)return P(n,t);return qb(We(),e,ze(n),t)}function Ia(){throw new Error(`invalid`)}function iw(n,t,e,i,r){let o=i===null?null:{"":-1},s=r(n,e);if(s!==null){let a=s,c=null,l=null;for(let d of s)if(d.resolveHostDirectives!==null){[a,c,l]=d.resolveHostDirectives(s);break}wT(n,t,e,a,o,c,l)}o!==null&&i!==null&&bT(e,i,o)}function bT(n,t,e){let i=n.localNames=[];for(let r=0;r<t.length;r+=2){let o=e[t[r+1]];if(o==null)throw new _(-301,!1);i.push(t[r],o)}}function ST(n,t,e){t.componentOffset=e,(n.components??=[]).push(t.index)}function wT(n,t,e,i,r,o,s){let a=i.length,c=null;for(let h=0;h<a;h++){let m=i[h];c===null&&nn(m)&&(c=m,ST(n,e,h)),lm(Xl(e,t),n,m.type)}NT(e,n.data.length,a),c?.viewProvidersResolver&&c.viewProvidersResolver(c);for(let h=0;h<a;h++){let m=i[h];m.providersResolver&&m.providersResolver(m)}let l=!1,d=!1,f=RS(n,t,a,null);a>0&&(e.directiveToIndex=new Map);for(let h=0;h<a;h++){let m=i[h];if(e.mergedAttrs=Co(e.mergedAttrs,m.hostAttrs),DT(n,e,t,f,m),IT(f,m,r),s!==null&&s.has(m)){let[y,R]=s.get(m);e.directiveToIndex.set(m.type,[f,y+e.directiveStart,R+e.directiveStart])}else(o===null||!o.has(m))&&e.directiveToIndex.set(m.type,f);m.contentQueries!==null&&(e.flags|=4),(m.hostBindings!==null||m.hostAttrs!==null||m.hostVars!==0)&&(e.flags|=64);let v=m.type.prototype;!l&&(v.ngOnChanges||v.ngOnInit||v.ngDoCheck)&&((n.preOrderHooks??=[]).push(e.index),l=!0),!d&&(v.ngOnChanges||v.ngDoCheck)&&((n.preOrderCheckHooks??=[]).push(e.index),d=!0),f++}CT(n,e,o)}function CT(n,t,e){for(let i=t.directiveStart;i<t.directiveEnd;i++){let r=n.data[i];if(e===null||!e.has(r))gb(0,t,r,i),gb(1,t,r,i),yb(t,i,!1);else{let o=e.get(r);vb(0,t,o,i),vb(1,t,o,i),yb(t,i,!0)}}}function gb(n,t,e,i){let r=n===0?e.inputs:e.outputs;for(let o in r)if(Object.hasOwn(r,o)){let s;n===0?s=t.inputs??={}:s=t.outputs??={},s[o]??=[],s[o].push(i),rw(t,o)}}function vb(n,t,e,i){let r=n===0?e.inputs:e.outputs;for(let o in r)if(Object.hasOwn(r,o)){let s=r[o],a;n===0?a=t.hostDirectiveInputs??={}:a=t.hostDirectiveOutputs??={},a[s]??=[],a[s].push(i,o),rw(t,s)}}function rw(n,t){t===`class`?n.flags|=8:t===`style`&&(n.flags|=16)}function yb(n,t,e){let{attrs:i,inputs:r,hostDirectiveInputs:o}=n;if(i===null||!e&&r===null||e&&o===null||tp(n)){n.initialInputs??=[],n.initialInputs.push(null);return}let s=null,a=0;for(;a<i.length;){let c=i[a];if(c===0){a+=4;continue}else if(c===5){a+=2;continue}else if(typeof c==`number`)break;if(!e&&Object.hasOwn(r,c)){let l=r[c];for(let d of l)if(d===t){s??=[],s.push(c,i[a+1]);break}}else if(e&&Object.hasOwn(o,c)){let l=o[c];for(let d=0;d<l.length;d+=2)if(l[d]===t){s??=[],s.push(l[d+1],i[a+1]);break}}a+=2}n.initialInputs??=[],n.initialInputs.push(s)}function DT(n,t,e,i,r){n.data[i]=r;let s=new wr(r.factory||(r.factory=ir(r.type,!0)),nn(r),ne,null);n.blueprint[i]=s,e[i]=s,ET(n,t,i,RS(n,e,r.hostVars,gt),r)}function ET(n,t,e,i,r){let o=r.hostBindings;if(o){let s=n.hostBindingOpCodes;s===null&&(s=n.hostBindingOpCodes=[]);let a=~t.index;xT(s)!=a&&s.push(a),s.push(e,i,o)}}function xT(n){let t=n.length;for(;t>0;){let e=n[--t];if(typeof e==`number`&&e<0)return e}return 0}function IT(n,t,e){if(e){if(t.exportAs)for(let i=0;i<t.exportAs.length;i++)e[t.exportAs[i]]=n;nn(t)&&(e[``]=n)}}function NT(n,t,e){n.flags|=1,n.directiveStart=t,n.directiveEnd=t+e,n.providerIndexes=t}function _p(n,t,e,i,r,o,s,a){let c=t[A],l=c.consts,f=To(c,n,e,i,Rt(l,s));return o&&iw(c,t,f,Rt(l,a),r),f.mergedAttrs=Co(f.mergedAttrs,f.attrs),f.attrs!==null&&id(f,f.attrs,!1),f.mergedAttrs!==null&&id(f,f.mergedAttrs,!0),c.queries!==null&&c.queries.elementStart(c,f),f}function bp(n,t){jb(n,t),Mh(t)&&n.queries.elementEnd(t)}function MT(n,t,e,i,r,o){let s=t.consts,c=To(t,n,e,i,Rt(s,r));if(c.mergedAttrs=Co(c.mergedAttrs,c.attrs),o!=null){let l=Rt(s,o);c.localNames=[];for(let d=0;d<l.length;d+=2)c.localNames.push(l[d],-1)}return c.attrs!==null&&id(c,c.attrs,!1),c.mergedAttrs!==null&&id(c,c.mergedAttrs,!0),t.queries!==null&&t.queries.elementStart(t,c),c}var ow=typeof ShadowRoot<`u`;var TT=typeof Document<`u`;function AT(n){return Object.keys(n).map(t=>{let[e,i,r]=n[t],o={propName:e,templateName:t,isSignal:(i&Ca.SignalBased)!==0};return r&&(o.transform=r),o})}function RT(n){return Object.keys(n).map(t=>({propName:n[t],templateName:t}))}function kT(n,t,e){let i=t instanceof _e?t:t?.injector;return i&&n.getStandaloneInjector!==null&&(i=n.getStandaloneInjector(i)||i),i?new ed(e,i):e}function OT(n){let t=n.get(Ve,null);if(t===null)throw new _(407,!1);return{rendererFactory:t,sanitizer:n.get(JS,null),changeDetectionScheduler:n.get(bn,null),ngReflect:!1,tracingService:n.get(An,null,{optional:!0})}}function PT(n,t,e){let i=sw(n);return pS(t,i,i===`svg`?sr:i===`math`?El:e)}function FT(n){if((n&&`localName`in n&&typeof n.localName==`string`?n.localName:n?.tagName)?.toLowerCase()===`script`)throw new _(905,!1)}function sw(n){return(n.selectors[0][0]||`div`).toLowerCase()}var xo=class{componentDef;ngModule;selector;componentType;ngContentSelectors;isBoundToModule;cachedInputs=null;cachedOutputs=null;get inputs(){return this.cachedInputs??=AT(this.componentDef.inputs),this.cachedInputs}get outputs(){return this.cachedOutputs??=RT(this.componentDef.outputs),this.cachedOutputs}constructor(t,e){this.componentDef=t,this.ngModule=e,this.componentType=t.type,this.selector=QN(t.selectors),this.ngContentSelectors=t.ngContentSelectors??[],this.isBoundToModule=!!e}create(t,e,i,r,o,s,a){pe(de.DynamicComponentStart);let c=O(null);try{let l=this.componentDef,d=kT(l,r||this.ngModule,t),f=OT(d),h=f.tracingService;return h&&h.componentCreate?h.componentCreate(ew(l),()=>this.createComponentRef(f,d,e,i,o,s,a)):this.createComponentRef(f,d,e,i,o,s,a)}finally{O(c)}}createComponentRef(t,e,i,r,o,s,a){let c=this.componentDef,l=LT(r,c,s,o),d=t.rendererFactory.createRenderer(null,c),f=r?xM(d,r,c.encapsulation,e):PT(c,d,a??null);FT(f);let h=e.get(Er,null),m=jT(f,()=>e.get(M,null)??Gm());h&&h.addHost(m);let v=s?.some(_b)||o?.some(k=>typeof k!=`function`&&k.bindings.some(_b)),y=dp(null,l,null,512|AS(c),null,null,t,d,e,null,sS(f,e,!0));h&&ow&&m instanceof ShadowRoot&&Ml(y,()=>{h.removeHost(m)}),y[Ae]=f,Pl(y);let R=null;try{let k=_p(Ae,y,2,`#host`,()=>l.directiveRegistry,!0,0);yS(d,f,k),Do(f,y),bd(l,y,k),qm(l,k,y),bp(l,k),i!==void 0&&BT(k,this.ngContentSelectors,i),R=zt(k.index,y),y[Oe]=R[Oe],pp(l,y,null)}catch(k){throw R!==null&&um(R),um(y),k}finally{pe(de.DynamicComponentEnd),Fl()}return new rd(this.componentType,y,!!v)}};function LT(n,t,e,i){let r=n?[`ng-version`,`22.1.6`]:XN(t.selectors[0]),o=null,s=null,a=0;if(e)for(let d of e)a+=d[Em].requiredVars,d.create&&(d.targetIdx=0,(o??=[]).push(d)),d.update&&(d.targetIdx=0,(s??=[]).push(d));if(i)for(let d=0;d<i.length;d++){let f=i[d];if(typeof f!=`function`)for(let h of f.bindings){a+=h[Em].requiredVars;let m=d+1;h.create&&(h.targetIdx=m,(o??=[]).push(h)),h.update&&(h.targetIdx=m,(s??=[]).push(h))}}let c=[t];if(i)for(let d of i){let h=yl(typeof d==`function`?d:d.type);c.push(h)}return lp(0,null,VT(o,s),1,a,c,null,null,null,[r],null)}function jT(n,t){let e=n.getRootNode?.();return TT&&e instanceof Document?e.head:e&&ow&&e instanceof ShadowRoot?e:t().head}function VT(n,t){return!n&&!t?null:e=>{if(e&1&&n)for(let i of n)i.create();if(e&2&&t)for(let i of t)i.update()}}function _b(n){let t=n[Em].kind;return t===`input`||t===`twoWay`}var rd=class extends XS{_rootLView;_hasInputBindings;instance;hostView;changeDetectorRef;componentType;location;previousInputValues=null;_tNode;constructor(t,e,i){super(),this._rootLView=e,this._hasInputBindings=i,this._tNode=xl(e[A],Ae),this.location=Mo(this._tNode,e),this.instance=zt(this._tNode.index,e)[Oe],this.hostView=this.changeDetectorRef=new Ni(e,void 0),this.componentType=t}setInput(t,e){this._hasInputBindings;let i=this._tNode;if(this.previousInputValues??=new Map,this.previousInputValues.has(t)&&Object.is(this.previousInputValues.get(t),e))return;let r=this._rootLView;Sd(i,r[A],r,t,e);this.previousInputValues.set(t,e);gp(zt(i.index,r),1)}get injector(){return new xi(this._tNode,this._rootLView)}destroy(){this.hostView.destroy()}onDestroy(t){this.hostView.onDestroy(t)}};function BT(n,t,e){let i=n.projection=[];for(let r=0;r<t.length;r++){let o=e[r];i.push(o!=null&&o.length?Array.from(o):null)}}var it=(()=>{class n{static __NG_ELEMENT_ID__=UT}return n})();function UT(){return aw(We(),j())}var xm=class n extends it{_lContainer;_hostTNode;_hostLView;constructor(t,e,i){super(),this._lContainer=t,this._hostTNode=e,this._hostLView=i}get element(){return Mo(this._hostTNode,this._hostLView)}get injector(){return new xi(this._hostTNode,this._hostLView)}get parentInjector(){let t=zm(this._hostTNode,this._hostLView);if(Ub(t)){let e=Ql(t,this._hostLView),i=Kl(t),r=e[A].data[i+8];return new xi(r,e)}else return new xi(null,this._hostLView)}clear(){for(;this.length>0;)this.remove(this.length-1)}get(t){let e=bb(this._lContainer);return e!==null&&e[t]||null}get length(){return this._lContainer.length-Ne}createEmbeddedView(t,e,i){let r,o;typeof i==`number`?r=i:i!=null&&(r=i.index,o=i.injector);let s=Jl(this._lContainer,t.ssrId),a=t.createEmbeddedViewImpl(e||{},o,s);return this.insertImpl(a,r,Eo(this._hostTNode,s)),a}createComponent(t,e,i,r,o,s,a){let c,l=e||{};c=l.index,i=l.injector,r=l.projectableNodes,o=l.environmentInjector||l.ngModuleRef,s=l.directives,a=l.bindings;let d=new xo(yi(t)),f=i||this.parentInjector;if(!o&&d.ngModule==null){let k=this.parentInjector.get(_e,null);k&&(o=k)}let h=yi(d.componentType??{}),m=Jl(this._lContainer,h?.id??null),v=m?.firstChild??null,y=d.create(f,r,v,o,s,a,this._getHostElementNamespace());return this.insertImpl(y.hostView,c,Eo(this._hostTNode,m)),y}_getHostElementNamespace(){if(this._hostTNode.type&2){let t=this._hostTNode.parent??this._hostLView[tt];return t!==null&&t.type&2&&typeof t.value==`string`&&t.value.toLowerCase()===`foreignobject`?null:t?.namespace??null}return this._hostTNode.namespace}insert(t,e){return this.insertImpl(t,e,!0)}insertImpl(t,e,i){let r=t._lView;if(v_(r)){let a=this.indexOf(t);if(a!==-1)this.detach(a);else{let c=r[$e],l=new n(c,c[tt],c[$e]);l.detach(l.indexOf(t))}}let o=this._adjustIndex(e),s=this._lContainer;return xa(s,r,o,i),t.attachToViewContainerRef(),Sh(em(s),o,t),t}move(t,e){return this.insert(t,e)}indexOf(t){let e=bb(this._lContainer);return e!==null?e.indexOf(t):-1}remove(t){let e=this._adjustIndex(t,-1),i=ga(this._lContainer,e);i&&(Js(em(this._lContainer),e),yd(i[A],i))}detach(t){let e=this._adjustIndex(t,-1),i=ga(this._lContainer,e);return i&&Js(em(this._lContainer),e)!=null?new Ni(i):null}_adjustIndex(t,e=0){return t??this.length+e}};function bb(n){return n[na]}function em(n){return n[na]||(n[na]=[])}function aw(n,t){let e,i=t[n.index];return Ht(i)?e=i:(e=qS(i,t,null,n),t[n.index]=e,up(t,e)),zT(e,t,n,i),new xm(e,n,t)}function HT(n,t){let e=n[be],i=e.createComment(``),r=Et(t,n);return br(e,e.parentNode(r),i,e.nextSibling(r),!1),i}var zT=GT;var $T=()=>!1;function WT(n,t,e){return $T(n,t,e)}function GT(n,t,e,i){if(n[fr])return;let r;e.type&8?r=nt(i):r=HT(t,e),n[fr]=r}var Im=class n{queryList;matches=null;constructor(t){this.queryList=t}clone(){return new n(this.queryList)}setDirty(){this.queryList.setDirty()}};var Nm=class n{queries;constructor(t=[]){this.queries=t}createEmbeddedView(t){let e=t.queries;if(e!==null){let i=t.contentQueries!==null?t.contentQueries[0]:e.length,r=[];for(let o=0;o<i;o++){let s=e.getByIndex(o),a=this.queries[s.indexInDeclarationView];r.push(a.clone())}return new n(r)}return null}insertView(t){this.dirtyQueriesWithMatches(t)}detachView(t){this.dirtyQueriesWithMatches(t)}finishViewCreation(t){this.dirtyQueriesWithMatches(t)}dirtyQueriesWithMatches(t){for(let e=0;e<this.queries.length;e++)wp(t,e).matches!==null&&this.queries[e].setDirty()}};var od=class{flags;read;predicate;constructor(t,e,i=null){this.flags=e,this.read=i,typeof t==`string`?this.predicate=QT(t):this.predicate=t}};var Mm=class n{queries;constructor(t=[]){this.queries=t}elementStart(t,e){for(let i=0;i<this.queries.length;i++)this.queries[i].elementStart(t,e)}elementEnd(t){for(let e=0;e<this.queries.length;e++)this.queries[e].elementEnd(t)}embeddedTView(t){let e=null;for(let i=0;i<this.length;i++){let r=e!==null?e.length:0,o=this.getByIndex(i).embeddedTView(t,r);o&&(o.indexInDeclarationView=i,e!==null?e.push(o):e=[o])}return e!==null?new n(e):null}template(t,e){for(let i=0;i<this.queries.length;i++)this.queries[i].template(t,e)}getByIndex(t){return this.queries[t]}get length(){return this.queries.length}track(t){this.queries.push(t)}};var Tm=class n{metadata;matches=null;indexInDeclarationView=-1;crossesNgTemplate=!1;_declarationNodeIndex;_appliesToNextNode=!0;constructor(t,e=-1){this.metadata=t,this._declarationNodeIndex=e}elementStart(t,e){this.isApplyingToNode(e)&&this.matchTNode(t,e)}elementEnd(t){this._declarationNodeIndex===t.index&&(this._appliesToNextNode=!1)}template(t,e){this.elementStart(t,e)}embeddedTView(t,e){return this.isApplyingToNode(t)?(this.crossesNgTemplate=!0,this.addMatch(-t.index,e),new n(this.metadata)):null}isApplyingToNode(t){if(this._appliesToNextNode&&(this.metadata.flags&1)!==1){let e=this._declarationNodeIndex,i=t.parent;for(;i!==null&&i.type&8&&i.index!==e;)i=i.parent;return e===(i!==null?i.index:-1)}return this._appliesToNextNode}matchTNode(t,e){let i=this.metadata.predicate;if(Array.isArray(i))for(let r=0;r<i.length;r++){let o=i[r];this.matchTNodeWithReadOption(t,e,qT(e,o)),this.matchTNodeWithReadOption(t,e,ql(e,t,o,!1,!1))}else i===ut?e.type&4&&this.matchTNodeWithReadOption(t,e,-1):this.matchTNodeWithReadOption(t,e,ql(e,t,i,!1,!1))}matchTNodeWithReadOption(t,e,i){if(i!==null){let r=this.metadata.read;if(r!==null)if(r===N||r===it||r===ut&&e.type&4)this.addMatch(e.index,-2);else{let o=ql(e,t,r,!1,!1);o!==null&&this.addMatch(e.index,o)}else this.addMatch(e.index,i)}}addMatch(t,e){this.matches===null?this.matches=[t,e]:this.matches.push(t,e)}};function qT(n,t){let e=n.localNames;if(e!==null){for(let i=0;i<e.length;i+=2)if(e[i]===t)return e[i+1]}return null}function YT(n,t){return n.type&11?Mo(n,t):n.type&4?wd(n,t):null}function ZT(n,t,e,i){return e===-1?YT(t,n):e===-2?KT(n,t,i):ha(n,n[A],e,t)}function KT(n,t,e){if(e===N)return Mo(t,n);if(e===ut)return wd(t,n);if(e===it)return aw(t,n)}function cw(n,t,e,i){let r=t[Cn].queries[i];if(r.matches===null){let o=n.data,s=e.matches,a=[];for(let c=0;s!==null&&c<s.length;c+=2){let l=s[c];if(l<0)a.push(null);else{let d=o[l];a.push(ZT(t,d,s[c+1],e.metadata.read))}}r.matches=a}return r.matches}function Am(n,t,e,i){let r=n.queries.getByIndex(e),o=r.matches;if(o!==null){let s=cw(n,t,r,e);for(let a=0;a<o.length;a+=2){let c=o[a];if(c>0)i.push(s[a/2]);else{let l=o[a+1],d=t[-c];for(let f=Ne;f<d.length;f++){let h=d[f];h[wi]===h[$e]&&Am(h[A],h,l,i)}if(d[hr]!==null){let f=d[hr];for(let h=0;h<f.length;h++){let m=f[h];Am(m[A],m,l,i)}}}}}return i}function Sp(n,t){return n[Cn].queries[t].queryList}function lw(n,t,e){let i=new Zn((e&4)===4);return b_(n,t,i,i.destroy),(t[Cn]??=new Nm).queries.push(new Im(i))-1}function dw(n,t,e){let i=De();return i.firstCreatePass&&(fw(i,new od(n,t,e),-1),(t&2)===2&&(i.staticViewQueries=!0)),lw(i,j(),t)}function uw(n,t,e,i){let r=De();if(r.firstCreatePass){let o=We();fw(r,new od(t,e,i),o.index),XT(r,n),(e&2)===2&&(r.staticContentQueries=!0)}return lw(r,j(),e)}function QT(n){return n.split(`,`).map(t=>t.trim())}function fw(n,t,e){n.queries===null&&(n.queries=new Mm),n.queries.track(new Tm(t,e))}function XT(n,t){let e=n.contentQueries||(n.contentQueries=[]);t!==(e.length?e[e.length-1]:-1)&&e.push(n.queries.length-1,t)}function wp(n,t){return n.queries.getByIndex(t)}function hw(n,t){let e=n[A],i=wp(e,t);return i.crossesNgTemplate?Am(e,n,t,[]):cw(e,n,i,t)}function mw(n,t,e){let i,r=Hs(()=>{i._dirtyCounter();let o=JT(i,n);if(t&&o===void 0)throw new _(-951,!1);return o});return i=r[Ce],i._dirtyCounter=C(0),i._flatValue=void 0,r}function Cp(n){return mw(!0,!1,n)}function Dp(n){return mw(!0,!0,n)}function pw(n,t){let e=n[Ce];e._lView=j(),e._queryIndex=t,e._queryList=Sp(e._lView,t),e._queryList.onDirty(()=>e._dirtyCounter.update(i=>i+1))}function JT(n,t){let e=n._lView,i=n._queryIndex;if(e===void 0||i===void 0||e[B]&4)return t?void 0:ct;let r=Sp(e,i),o=hw(e,i);return r.reset(o,Kb),t?r.first:r._changesDetected||n._flatValue===void 0?n._flatValue=r.toArray():n._flatValue}function Xn(n){return!!n&&typeof n.then==`function`}function Ep(n){return!!n&&typeof n.subscribe==`function`}var Mn=class{};var Cd=class{};var sd=class extends Mn{ngModuleType;_parent;_bootstrapComponents=[];_r3Injector;instance;destroyCbs=[];constructor(t,e,i,r=!0){super(),this.ngModuleType=t,this._parent=e;let o=Jy(t);this._bootstrapComponents=BN(o.bootstrap),this._r3Injector=Gh(t,e,[{provide:Mn,useValue:this},...i],Zs(t),new Set([`environment`])),r&&this.resolveInjectorInitializers()}resolveInjectorInitializers(){this._r3Injector.resolveInjectorInitializers(),this.instance=this._r3Injector.get(this.ngModuleType)}get injector(){return this._r3Injector}destroy(){let t=this._r3Injector;!t.destroyed&&t.destroy(),this.destroyCbs.forEach(e=>e()),this.destroyCbs=null}onDestroy(t){this.destroyCbs.push(t)}};var ad=class extends Cd{moduleType;constructor(t){super(),this.moduleType=t}create(t){return new sd(this.moduleType,t,[])}};var va=class extends Mn{injector;instance=null;constructor(t){super();let e=new or([...t.providers,{provide:Mn,useValue:this}],t.parent||mo(),t.debugName,new Set([`environment`]));this.injector=e,t.runEnvironmentInitializers&&e.resolveInjectorInitializers()}destroy(){this.injector.destroy()}onDestroy(t){this.injector.onDestroy(t)}};function Na(n,t,e=null){return new va({providers:n,parent:t,debugName:e,runEnvironmentInitializers:!0}).injector}var eA=(()=>{class n{_injector;cachedInjectors=new Map;constructor(e){this._injector=e}getOrCreateStandaloneInjector(e){if(!e.standalone)return null;if(!this.cachedInjectors.has(e)){let i=Ch(!1,e.type),r=i.length>0?Na([i],this._injector,``):null;this.cachedInjectors.set(e,r)}return this.cachedInjectors.get(e)}ngOnDestroy(){try{for(let e of this.cachedInjectors.values())e!==null&&e.destroy()}finally{this.cachedInjectors.clear()}}static ɵprov=W({token:n,providedIn:`environment`,factory:()=>new n(P(_e))})}return n})();function X(n){return _a(()=>{let t=gw(n),e=S(p({},t),{decls:n.decls,vars:n.vars,template:n.template,consts:n.consts||null,ngContentSelectors:n.ngContentSelectors,onPush:n.changeDetection!==$m.Eager,directiveDefs:null,pipeDefs:null,dependencies:t.standalone&&n.dependencies||null,getStandaloneInjector:t.standalone?r=>r.get(eA).getOrCreateStandaloneInjector(e):null,getExternalStyles:null,signals:n.signals??!1,data:n.data||{},encapsulation:n.encapsulation||ln.Emulated,styles:n.styles||ct,_:null,schemas:n.schemas||null,tView:null,id:``});t.standalone&&Rn(`NgStandalone`),vw(e);let i=n.dependencies;return e.directiveDefs=Sb(i,tA),e.pipeDefs=Sb(i,e_),e.id=rA(e),e})}function tA(n){return yi(n)||yl(n)}function $(n){return _a(()=>({type:n.type,bootstrap:n.bootstrap||ct,declarations:n.declarations||ct,imports:n.imports||ct,exports:n.exports||ct,transitiveCompileScopes:null,schemas:n.schemas||null,id:n.id||null}))}function nA(n,t){if(n==null)return bi;let e={};for(let i in n)if(Object.hasOwn(n,i)){let r=n[i],o,s,a,c;Array.isArray(r)?(a=r[0],o=r[1],s=r[2]??o,c=r[3]||null):(o=r,s=r,a=Ca.None,c=null),e[o]=[i,a,c],t[o]=s}return e}function iA(n){if(n==null)return bi;let t={};for(let e in n)Object.hasOwn(n,e)&&(t[n[e]]=e);return t}function D(n){return _a(()=>{let t=gw(n);return vw(t),t})}function gw(n){let t={};return{type:n.type,providersResolver:null,viewProvidersResolver:null,factory:null,hostBindings:n.hostBindings||null,hostVars:n.hostVars||0,hostAttrs:n.hostAttrs||null,contentQueries:n.contentQueries||null,declaredInputs:t,inputConfig:n.inputs||bi,exportAs:n.exportAs||null,standalone:n.standalone??!0,signals:n.signals===!0,selectors:n.selectors||ct,viewQuery:n.viewQuery||null,features:n.features||null,setInput:null,resolveHostDirectives:null,hostDirectives:null,controlDef:null,signalFormsInputPresence:null,inputs:nA(n.inputs,t),outputs:iA(n.outputs),debugInfo:null}}function vw(n){n.features?.forEach(t=>t(n))}function Sb(n,t){return n?()=>{let e=typeof n==`function`?n():n,i=[];for(let r of e){let o=t(r);o!==null&&i.push(o)}return i}:null}function rA(n){let t=0,e=typeof n.consts==`function`?``:n.consts,i=[n.selectors,n.ngContentSelectors,n.hostVars,n.hostAttrs,e,n.vars,n.decls,n.encapsulation,n.standalone,n.signals,n.exportAs,JSON.stringify(n.inputs),JSON.stringify(n.outputs),Object.getOwnPropertyNames(n.type.prototype),!!n.contentQueries,!!n.viewQuery];for(let o of i.join(`|`))t=Math.imul(31,t)+o.charCodeAt(0)<<0;return t+=2147483648,`c`+t}var yw=new g(``);var xp=(()=>{class n{resolve;reject;initialized=!1;done=!1;donePromise=new Promise((e,i)=>{this.resolve=e,this.reject=i});appInits=u(yw,{optional:!0})??[];injector=u(T);constructor(){}runInitializers(){if(this.initialized)return;let e=[];for(let r of this.appInits){let o=Ie(this.injector,r);if(Xn(o))e.push(o);else if(Ep(o)){let s=new Promise((a,c)=>{o.subscribe({complete:a,error:c})});e.push(s)}}let i=()=>{this.done=!0,this.resolve()};Promise.all(e).then(()=>{i()}).catch(r=>{this.reject(r)}),e.length===0&&i(),this.initialized=!0}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function Ma(n){return t=>{t.controlDef={create:(e,i)=>{e?.ɵngControlCreate(i)},update:(e,i)=>{e?.ɵngControlUpdate?.(i)},passThroughInput:n}}}function Ip(n){let t=e=>{let i=Array.isArray(n);e.hostDirectives===null?(e.resolveHostDirectives=oA,e.hostDirectives=i?n.map(Rm):[n]):i?e.hostDirectives.unshift(...n.map(Rm)):e.hostDirectives.unshift(n)};return t.ngInherit=!0,t}function oA(n){let t=[],e=!1,i=null,r=null;for(let o=0;o<n.length;o++){let s=n[o];if(s.hostDirectives!==null){let a=t.length;i??=new Map,r??=new Map,_w(s,t,i,n),r.set(s,[a,t.length-1])}o===0&&nn(s)&&(e=!0,t.push(s))}for(let o=e?1:0;o<n.length;o++)t.push(n[o]);return i!==null&&i.forEach((o,s)=>{sA(s.declaredInputs,o.inputs)}),[t,i,r]}function _w(n,t,e,i){if(n.hostDirectives!==null)for(let r of n.hostDirectives)if(typeof r==`function`){let o=r();for(let s of o)wb(Rm(s),t,e,i)}else wb(r,t,e,i)}function wb(n,t,e,i){let r=yl(n.directive);if(_w(r,t,e,i),e.has(r)){let o=e.get(r);Cb(o,n.inputs,`input`),Cb(o,n.outputs,`output`)}else i.includes(r)||(e.set(r,n),t.push(r))}function Cb(n,t,e){let i=e===`input`?n.inputs:n.outputs;Object.keys(t).forEach(r=>{let o=t[r];(!Object.hasOwn(i,r)||i[r]===o)&&(i[r]=o)})}function Rm(n){return typeof n==`function`?{directive:ze(n),inputs:{},outputs:{}}:{directive:ze(n.directive),inputs:Db(n.inputs),outputs:Db(n.outputs)}}function Db(n){let t={};if(n!==void 0&&n.length>0)for(let e=0;e<n.length;e+=2)t[n[e]]=n[e+1];return t}function sA(n,t){for(let e in t)if(Object.hasOwn(t,e)){let i=t[e];n[i]=n[e]}}function aA(n){return Object.getPrototypeOf(n.prototype).constructor}function ae(n){let t=aA(n.type),e=!0,i=[n];for(;t&&t!==Function.prototype&&t!==Object.prototype;){let r,o=Object.hasOwn(t,Qs)?t[Qs]:void 0,s=Object.hasOwn(t,Xs)?t[Xs]:void 0;if(nn(n))r=o??s;else{if(o)throw new _(903,!1);r=s}if(r){if(e){i.push(r);let c=n;c.inputs=tm(n.inputs),c.declaredInputs=tm(n.declaredInputs),c.outputs=tm(n.outputs);let l=r.hostBindings;l&&fA(n,l);let d=r.viewQuery,f=r.contentQueries;if(d&&dA(n,d),f&&uA(n,f),cA(n,r),Xy(n.outputs,r.outputs),nn(r)&&r.data.animation){let h=n.data;h.animation=(h.animation||[]).concat(r.data.animation)}}let a=r.features;if(a)for(let c=0;c<a.length;c++){let l=a[c];l&&l.ngInherit&&l(n),l===ae&&(e=!1)}}t=Object.getPrototypeOf(t)}lA(i)}function cA(n,t){for(let e in t.inputs){if(!Object.hasOwn(t.inputs,e)||Object.hasOwn(n.inputs,e))continue;let i=t.inputs[e];i!==void 0&&(n.inputs[e]=i,n.declaredInputs[e]=t.declaredInputs[e])}}function lA(n){let t=0,e=null;for(let i=n.length-1;i>=0;i--){let r=n[i];r.hostVars=t+=r.hostVars,r.hostAttrs=Co(r.hostAttrs,e=Co(e,r.hostAttrs))}}function tm(n){return n===bi?{}:n===ct?[]:n}function dA(n,t){let e=n.viewQuery;e?n.viewQuery=(i,r)=>{t(i,r),e(i,r)}:n.viewQuery=t}function uA(n,t){let e=n.contentQueries;e?n.contentQueries=(i,r,o)=>{t(i,r,o),e(i,r,o)}:n.contentQueries=t}function fA(n,t){let e=n.hostBindings;e?n.hostBindings=(i,r)=>{t(i,r),e(i,r)}:n.hostBindings=t}function bw(n,t,e,i,r,o,s,a){if(e.firstCreatePass){n.mergedAttrs=Co(n.mergedAttrs,n.attrs);let d=n.tView=lp(2,n,r,o,s,e.directiveRegistry,e.pipeRegistry,null,e.schemas,e.consts,null);e.queries!==null&&(e.queries.template(e,n),d.queries=e.queries.embeddedTView(n))}a&&(n.flags|=a),_o(n,!1);let c=mA(e,t,n,i);Ll()&&ap(e,t,c,n),Do(c,t);let l=qS(c,t,c,n);t[i+Ae]=l,up(t,l),WT(l,n,t)}function hA(n,t,e,i,r,o,s,a,c,l,d){let f=e+Ae,h;return t.firstCreatePass?(h=To(t,f,4,s||null,a||null),Tl()&&iw(t,n,h,Rt(t.consts,l),fp),jb(t,h)):h=t.data[f],bw(h,n,t,e,i,r,o,c),vo(h)&&bd(t,n,h),l!=null&&Da(n,h,d),h}function Io(n,t,e,i,r,o,s,a,c,l,d){let f=e+Ae,h;if(t.firstCreatePass){if(h=To(t,f,4,s||null,a||null),l!=null){let m=Rt(t.consts,l);h.localNames=[];for(let v=0;v<m.length;v+=2)h.localNames.push(m[v],-1)}}else h=t.data[f];return bw(h,n,t,e,i,r,o,c),l!=null&&Da(n,h,d),h}function Ot(n,t,e,i,r,o,s,a){let c=j(),l=De();return hA(c,l,n,t,e,i,r,Rt(l.consts,o),void 0,s,a),Ot}function Dd(n,t,e,i,r,o,s,a){let c=j(),l=De();return Io(c,l,n,t,e,i,r,Rt(l.consts,o),void 0,s,a),Dd}var mA=pA;function pA(n,t,e,i){return sa(!0),t[be].createComment(``)}var Ed=(()=>{class n{log(e){console.log(e)}warn(e){console.warn(e)}static ɵfac=function(i){return new(i||n)};static ɵprov=W({token:n,factory:n.ɵfac,providedIn:`platform`})}return n})();var Np=new g(``);var Ta=new g(``);function Sw(){qf(()=>{throw new _(600,``)})}var gA=10;var vt=(()=>{class n{_runningTick=!1;_destroyed=!1;_destroyListeners=[];_views=[];internalErrorHandler=u($t);afterRenderManager=u(gd);zonelessEnabled=u(ca);rootEffectScheduler=u(Bl);dirtyFlags=0;tracingSnapshot=null;allTestViews=new Set;autoDetectTestViews=new Set;includeAllTestViews=!1;afterTick=new w;get allViews(){return[...(this.includeAllTestViews?this.allTestViews:this.autoDetectTestViews).keys(),...this._views]}get destroyed(){return this._destroyed}componentTypes=[];components=[];internalPendingTask=u(qn);get isStable(){return this.internalPendingTask.hasPendingTasksObservable.pipe(H(e=>!e))}constructor(){u(An,{optional:!0})}whenStable(){let e;return new Promise(i=>{e=this.isStable.subscribe({next:r=>{r&&i()}})}).finally(()=>{e.unsubscribe()})}_injector=u(_e);_rendererFactory=null;get injector(){return this._injector}bootstrap(e,i){return this.bootstrapImpl(e,i)}bootstrapImpl(e,i,r=T.NULL){return this._injector.get(I).run(()=>{if(pe(de.BootstrapComponentStart),!this._injector.get(xp).done)throw new _(405,``);let a=yi(e),c=this._injector.get(Mn),l=new xo(a,c);this.componentTypes.push(e);let{hostElement:d,directives:f,bindings:h}=vA(i),m=d||l.selector,v=l.create(r,[],m,c.injector,f,h),y=v.location.nativeElement,R=v.injector.get(Np,null);return R?.registerApplication(y),v.onDestroy(()=>{this.detachView(v.hostView),fa(this.components,v),R?.unregisterApplication(y)}),this._loadComponent(v),pe(de.BootstrapComponentEnd,v),v})}tick(){this.zonelessEnabled||(this.dirtyFlags|=1),this._tick()}_tick(){pe(de.ChangeDetectionStart),this.tracingSnapshot!==null?this.tracingSnapshot.run(pd.CHANGE_DETECTION,this.tickImpl):this.tickImpl()}tickImpl=()=>{if(this._runningTick)throw pe(de.ChangeDetectionEnd),new _(101,!1);let e=O(null);try{this._runningTick=!0,this.synchronize()}finally{this._runningTick=!1,this.tracingSnapshot?.dispose(),this.tracingSnapshot=null,O(e),this.afterTick.next(),pe(de.ChangeDetectionEnd)}};synchronize(){this._rendererFactory===null&&!this._injector.destroyed&&(this._rendererFactory=this._injector.get(Ve,null,{optional:!0}));let e=0;for(;this.dirtyFlags!==0&&e++<gA;){pe(de.ChangeDetectionSyncStart);try{this.synchronizeOnce()}finally{pe(de.ChangeDetectionSyncEnd)}}}synchronizeOnce(){this.dirtyFlags&16&&(this.dirtyFlags&=-17,this.rootEffectScheduler.flush());let e=!1;if(this.dirtyFlags&7){let i=!!(this.dirtyFlags&1);this.dirtyFlags&=-8,this.dirtyFlags|=8;for(let{_lView:r}of this.allViews){if(!i&&!ia(r))continue;zS(r,i&&!this.zonelessEnabled?0:1),e=!0}if(this.dirtyFlags&=-5,this.syncDirtyFlagsWithViews(),this.dirtyFlags&23)return}e||(this._rendererFactory?.begin?.(),this._rendererFactory?.end?.()),this.dirtyFlags&8&&(this.dirtyFlags&=-9,this.afterRenderManager.execute()),this.syncDirtyFlagsWithViews()}syncDirtyFlagsWithViews(){if(this.allViews.some(({_lView:e})=>ia(e))){this.dirtyFlags|=2;return}else this.dirtyFlags&=-8}attachView(e){let i=e;this._views.push(i),i.attachToAppRef(this)}detachView(e){let i=e;fa(this._views,i),i.detachFromAppRef()}_loadComponent(e){this.attachView(e.hostView);try{this.tick()}catch(r){this.internalErrorHandler(r)}this.components.push(e),this._injector.get(Ta,[]).forEach(r=>r(e))}ngOnDestroy(){if(!this._destroyed)try{this._destroyListeners.forEach(e=>e()),this._views.slice().forEach(e=>e.destroy())}finally{this._destroyed=!0,this._views=[],this._destroyListeners=[]}}onDestroy(e){return this._destroyListeners.push(e),()=>fa(this._destroyListeners,e)}destroy(){if(this._destroyed)throw new _(406,!1);let e=this._injector;e.destroy&&!e.destroyed&&e.destroy()}get viewCount(){return this._views.length}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function vA(n){return n===void 0||typeof n==`string`||n instanceof Element?{hostElement:n}:n}function fa(n,t){let e=n.indexOf(t);e>-1&&n.splice(e,1)}function ww(n,t){let e=j();if(Wt(e,Ci(),t)){let r=De(),o=yr();if(Sd(o,r,e,n,t))xn(o)&&FS(e,o.index);else{let a=Et(o,e);LS(e[be],a,null,o.value,n,t,null)}}return ww}function ie(n,t,e,i){let r=j();if(Wt(r,Ci(),t)){De();OM(yr(),r,n,t,e,i)}return ie}var km=class{destroy(t){}updateValue(t,e){}swap(t,e){let i=Math.min(t,e),r=Math.max(t,e),o=this.detach(r);if(r-i>1){let s=this.detach(i);this.attach(i,o),this.attach(r,s)}else this.attach(i,o)}move(t,e){this.attach(e,this.detach(t))}};function nm(n,t,e,i,r){return n===e&&Object.is(t,i)?1:Object.is(r(n,t),r(e,i))?-1:0}function yA(n,t,e,i){let r,o,s=0,a=n.length-1;if(Array.isArray(t)){O(i);let l=t.length-1;for(O(null);s<=a&&s<=l;){let d=n.at(s),f=t[s],h=nm(s,d,s,f,e);if(h!==0){h<0&&n.updateValue(s,f),s++;continue}let m=n.at(a),v=t[l],y=nm(a,m,l,v,e);if(y!==0){y<0&&n.updateValue(a,v),a--,l--;continue}let R=e(s,d),k=e(a,m),Se=e(s,f);if(Object.is(Se,k)){let Ue=e(l,v);Object.is(Ue,R)?(n.swap(s,a),n.updateValue(a,v),l--,a--):n.move(a,s),n.updateValue(s,f),s++;continue}if(r??=new cd,o??=xb(n,s,a,e),Om(n,r,s,Se))n.updateValue(s,f),s++,a++;else if(o.has(Se))r.set(R,n.detach(s)),a--;else{let Ue=n.create(s,t[s]);n.attach(s,Ue),s++,a++}}for(;s<=l;)Eb(n,r,e,s,t[s]),s++}else if(t!=null){O(i);let l=t[Symbol.iterator]();O(null);let d=l.next();for(;!d.done&&s<=a;){let f=n.at(s),h=d.value,m=nm(s,f,s,h,e);if(m!==0)m<0&&n.updateValue(s,h),s++,d=l.next();else{r??=new cd,o??=xb(n,s,a,e);let v=e(s,h);if(Om(n,r,s,v))n.updateValue(s,h),s++,a++,d=l.next();else if(!o.has(v))n.attach(s,n.create(s,h)),s++,a++,d=l.next();else{let y=e(s,f);r.set(y,n.detach(s)),a--}}}for(;!d.done;)Eb(n,r,e,n.length,d.value),d=l.next()}for(;s<=a;)n.destroy(n.detach(a--));r?.forEach(l=>{n.destroy(l)})}function Om(n,t,e,i){return t!==void 0&&t.has(i)?(n.attach(e,t.get(i)),t.delete(i),!0):!1}function Eb(n,t,e,i,r){if(Om(n,t,i,e(i,r)))n.updateValue(i,r);else{let o=n.create(i,r);n.attach(i,o)}}function xb(n,t,e,i){let r=new Set;for(let o=t;o<=e;o++)r.add(i(o,n.at(o)));return r}var cd=class{kvMap=new Map;_vMap=void 0;has(t){return this.kvMap.has(t)}delete(t){if(!this.has(t))return!1;let e=this.kvMap.get(t);return this._vMap!==void 0&&this._vMap.has(e)?(this.kvMap.set(t,this._vMap.get(e)),this._vMap.delete(e)):this.kvMap.delete(t),!0}get(t){return this.kvMap.get(t)}set(t,e){if(this.kvMap.has(t)){let i=this.kvMap.get(t);this._vMap===void 0&&(this._vMap=new Map);let r=this._vMap;for(;r.has(i);)i=r.get(i);r.set(i,e)}else this.kvMap.set(t,e)}forEach(t){for(let[e,i]of this.kvMap)if(t(i,e),this._vMap!==void 0){let r=this._vMap;for(;r.has(i);)i=r.get(i),t(i,e)}}};function Me(n,t,e,i,r,o,s,a){Rn(`NgControlFlow`);let c=j(),l=De();return Io(c,l,n,t,e,i,r,Rt(l.consts,o),256,s,a),Mp}function Mp(n,t,e,i,r,o,s,a){Rn(`NgControlFlow`);let c=j(),l=De();return Io(c,l,n,t,e,i,r,Rt(l.consts,o),512,s,a),Mp}function Te(n,t){Rn(`NgControlFlow`);let e=j(),i=Ci(),r=e[i]!==gt?e[i]:-1,o=r!==-1?ld(e,Ae+r):void 0,s=0;if(Wt(e,i,n)){let a=O(null);try{if(o!==void 0&&ZS(o,s),n!==-1){let c=Ae+n,l=ld(e,c),d=jm(e[A],c),f=QS(l,d,e);xa(l,Ea(e,d,t,{dehydratedView:f}),s,Eo(d,f))}}finally{O(a)}}else if(o!==void 0){let a=YS(o,s);a!==void 0&&(a[Oe]=t)}}var Pm=class{lContainer;$implicit;$index;constructor(t,e,i){this.lContainer=t,this.$implicit=e,this.$index=i}get $count(){return this.lContainer.length-Ne}};function _A(n){return n}function bA(n,t){return t}var Fm=class{hasEmptyBlock;trackByFn;liveCollection;constructor(t,e,i){this.hasEmptyBlock=t,this.trackByFn=e,this.liveCollection=i}};function SA(n,t,e,i,r,o,s,a,c,l,d,f,h){Rn(`NgControlFlow`);let m=j(),v=De(),y=c!==void 0,R=j(),Se=new Fm(y,a?s.bind(R[pt][Oe]):s);R[Ae+n]=Se,Io(m,v,n+1,t,e,i,r,Rt(v.consts,o),256),y&&Io(m,v,n+2,c,l,d,f,Rt(v.consts,h),512)}var Lm=class extends km{lContainer;hostLView;templateTNode;operationsCounter=void 0;needsIndexUpdate=!1;constructor(t,e,i){super(),this.lContainer=t,this.hostLView=e,this.templateTNode=i}get length(){return this.lContainer.length-Ne}at(t){return this.getLView(t)[Oe].$implicit}attach(t,e){let i=e[lr];this.needsIndexUpdate||=t!==this.length,xa(this.lContainer,e,t,Eo(this.templateTNode,i)),CA(this.lContainer,t)}detach(t){return this.needsIndexUpdate||=t!==this.length-1,DA(this.lContainer,t),EA(this.lContainer,t)}create(t,e){let i=Jl(this.lContainer,this.templateTNode.tView.ssrId);return Ea(this.hostLView,this.templateTNode,new Pm(this.lContainer,e,t),{dehydratedView:i})}destroy(t){yd(t[A],t)}updateValue(t,e){this.getLView(t)[Oe].$implicit=e}reset(){this.needsIndexUpdate=!1}updateIndexes(){if(this.needsIndexUpdate)for(let t=0;t<this.length;t++)this.getLView(t)[Oe].$index=t}getLView(t){return xA(this.lContainer,t)}};function wA(n){let t=O(null),e=rn();try{let i=j(),r=i[A],o=i[e],s=e+1,a=ld(i,s);if(o.liveCollection===void 0)o.liveCollection=new Lm(a,i,jm(r,s));else o.liveCollection.reset();let c=o.liveCollection;if(yA(c,n,o.trackByFn,t),c.updateIndexes(),o.hasEmptyBlock){let l=Ci(),d=c.length===0;if(Wt(i,l,d)){let f=e+2,h=ld(i,f);if(d){let m=jm(r,f),v=QS(h,m,i);xa(h,Ea(i,m,void 0,{dehydratedView:v}),0,Eo(m,v))}else r.firstUpdatePass&&rT(h),ZS(h,0)}}}finally{O(t)}}function ld(n,t){return n[t]}function CA(n,t){if(n.length<=Ne)return;let i=n[Ne+t],r=i?i[En]:void 0;if(i&&r&&r.detachedLeaveAnimationFns&&r.detachedLeaveAnimationFns.length>0){let o=i[wn];oM(o,r),Ii.delete(i[Dn]),r.detachedLeaveAnimationFns=void 0}}function DA(n,t){if(n.length<=Ne)return;let i=n[Ne+t],r=i?i[En]:void 0;r&&r.leave&&r.leave.size>0&&(r.detachedLeaveAnimationFns=[])}function EA(n,t){return ga(n,t)}function xA(n,t){return YS(n,t)}function jm(n,t){return xl(n,t)}function yt(n,t,e){let i=j();if(Wt(i,Ci(),t)){De();TM(yr(),i,n,t,i[be],e)}return yt}function Vm(n,t,e,i,r){Sd(t,n,e,r?`class`:`style`,i)}function ue(n,t,e,i){let r=j(),o=r[A],s=n+Ae,a=o.firstCreatePass?_p(s,r,2,t,fp,Tl(),e,i):o.data[s];if(xn(a)){let c=r[tn].tracingService;if(c&&c.componentCreate){let l=o.data[a.directiveStart+a.componentOffset];return c.componentCreate(ew(l),()=>(Ib(n,t,r,a,i),ue))}}return Ib(n,t,r,a,i),ue}function Ib(n,t,e,i,r){if(hp(i,e,n,t,Cw),vo(i)){let o=e[A];bd(o,e,i),qm(o,i,e)}r!=null&&Da(e,i)}function ve(){let n=De(),e=mp(We());return n.firstCreatePass&&bp(n,e),Lh(e)&&jh(),Ph(),e.classesWithoutHost!=null&&UI(e)&&Vm(n,e,j(),e.classesWithoutHost,!0),e.stylesWithoutHost!=null&&HI(e)&&Vm(n,e,j(),e.stylesWithoutHost,!1),ve}function rt(n,t,e,i){return ue(n,t,e,i),ve(),rt}function ft(n,t,e,i){let r=j(),o=r[A],s=n+Ae,a=o.firstCreatePass?MT(s,o,2,t,e,i):o.data[s];return hp(a,r,n,t,Cw),i!=null&&Da(r,a),ft}function _t(){return Lh(mp(We()))&&jh(),Ph(),_t}function It(n,t,e,i){return ft(n,t,e,i),_t(),It}var Cw=(n,t,e,i,r)=>(sa(!0),pS(t[be],i,Wh()));function Tp(n,t,e){let i=j(),r=i[A],o=n+Ae,s=r.firstCreatePass?_p(o,i,8,`ng-container`,fp,Tl(),t,e):r.data[o];if(hp(s,i,n,`ng-container`,IA),vo(s)){let a=i[A];bd(a,i,s),qm(a,s,i)}return e!=null&&Da(i,s),Tp}function Ap(){let n=De(),e=mp(We());return n.firstCreatePass&&bp(n,e),Ap}function Ao(n,t,e){return Tp(n,t,e),Ap(),Ao}var IA=(n,t,e,i,r)=>(sa(!0),kN(t[be],``));function Rp(){return j()}function dn(n,t,e){let i=j();if(Wt(i,Ci(),t)){De();PS(yr(),i,n,t,i[be],e)}return dn}var Aa=`en-US`;function Dw(n){typeof n==`string`&&n.toLowerCase().replace(/_/g,`-`)}function Fe(n,t,e){let i=j(),r=De(),o=We();return MA(r,i,i[be],o,n,t,e),Fe}function xd(n,t,e){let i=j(),r=De(),o=We();return(o.type&3||e)&&yp(o,r,i,e,i[be],n,t,Sr(o,i,t)),xd}function MA(n,t,e,i,r,o,s){let a=!0,c=null;if((i.type&3||s)&&(c??=Sr(i,t,o),yp(i,n,t,s,e,r,o,c)&&(a=!1)),a){let l=i.outputs?.[r],d=i.hostDirectiveOutputs?.[r];if(d&&d.length)for(let f=0;f<d.length;f+=2){let h=d[f],m=d[f+1];c??=Sr(i,t,o),td(i,t,h,m,r,c)}if(l&&l.length)for(let f of l)c??=Sr(i,t,o),td(i,t,f,r,r,c)}}function Ke(n=1){return O_(n)}function TA(n,t){let e=null,i=GN(n);for(let r=0;r<t.length;r++){let o=t[r];if(o===`*`){e=r;continue}if(i===null?CS(n,o,!0):ZN(i,o))return r}return e}function Ge(n){let t=j()[pt][tt];if(!t.projection){let i=t.projection=s_(n?n.length:1,null),r=i.slice(),o=t.child;for(;o!==null;){if(o.type!==128){let s=n?TA(o,n):0;s!==null&&(r[s]?r[s].projectionNext=o:i[s]=o,r[s]=o)}o=o.next}}}function ee(n,t=0,e,i,r,o){let s=j(),a=De(),c=i?n+1:null;c!==null&&Io(s,a,c,i,r,o,null,e);let l=To(a,Ae+n,16,null,e||null);l.projection===null&&(l.projection=t),Uh();let f=!s[lr]||Fh();s[pt][tt].projection[l.projection]===null&&c!==null?AA(s,a,c):f&&!fd(l)&&bM(a,s,l)}function AA(n,t,e){let i=Ae+e,r=t.data[i],o=n[i],s=Jl(o,r.tView.ssrId);xa(o,Ea(n,r,void 0,{dehydratedView:s}),0,Eo(r,s))}function un(n,t,e,i){return uw(n,t,e,i),un}function Nt(n,t,e){return dw(n,t,e),Nt}function oe(n){let t=j(),e=De(),i=Ol();ra(i+1);let r=wp(e,i);if(n.dirty&&g_(t)===((r.metadata.flags&2)===2)){if(r.matches===null)n.reset([]);else{let o=hw(t,i);n.reset(o,Kb),n.notifyOnChanges()}return!0}return!1}function se(){return Sp(j(),Ol())}function Id(n,t,e,i,r){return pw(t,uw(n,e,i,r)),Id}function Nd(n,t,e,i){return pw(n,dw(t,e,i)),Nd}function Md(n=1){ra(Ol()+n)}function xr(n){return p_(D_(),Ae+n)}function $l(n,t){return n<<17|t<<2}function Dr(n){return n>>17&32767}function RA(n){return(n&2)==2}function kA(n,t){return n&131071|t<<17}function Bm(n){return n|2}function No(n){return(n&131068)>>2}function im(n,t){return n&-131069|t<<2}function OA(n){return(n&1)===1}function Um(n){return n|1}function PA(n,t,e,i,r,o){let s=o?t.classBindings:t.styleBindings,a=Dr(s),c=No(s);n[i]=e;let l=!1,d;if(Array.isArray(e)){let f=e;d=f[1],(d===null||fo(f,d)>0)&&(l=!0)}else d=e;if(r)if(c!==0){let h=Dr(n[a+1]);n[i+1]=$l(h,a),h!==0&&(n[h+1]=im(n[h+1],i)),n[a+1]=kA(n[a+1],i)}else n[i+1]=$l(a,0),a!==0&&(n[a+1]=im(n[a+1],i)),a=i;else n[i+1]=$l(c,0),a===0?a=i:n[c+1]=im(n[c+1],i),c=i;l&&(n[i+1]=Bm(n[i+1])),Nb(n,d,i,!0),Nb(n,d,i,!1),FA(t,d,n,i,o),s=$l(a,c),o?t.classBindings=s:t.styleBindings=s}function FA(n,t,e,i,r){let o=r?n.residualClasses:n.residualStyles;o!=null&&typeof t==`string`&&fo(o,t)>=0&&(e[i+1]=Um(e[i+1]))}function Nb(n,t,e,i){let r=n[e+1],o=t===null,s=i?Dr(r):No(r),a=!1;for(;s!==0&&(a===!1||o);){let c=n[s],l=n[s+1];LA(c,t)&&(a=!0,n[s+1]=i?Um(l):Bm(l)),s=i?Dr(l):No(l)}a&&(n[e+1]=i?Bm(r):Um(r))}function LA(n,t){return n===null||t==null||(Array.isArray(n)?n[1]:n)===t?!0:Array.isArray(n)&&typeof t==`string`?fo(n,t)>=0:!1}var cn={textEnd:0,key:0,keyEnd:0,value:0,valueEnd:0};function jA(n){return n.substring(cn.key,cn.keyEnd)}function VA(n){return BA(n),Ew(n,xw(n,0,cn.textEnd))}function Ew(n,t){let e=cn.textEnd;return e===t?-1:(t=cn.keyEnd=UA(n,cn.key=t,e),xw(n,t,e))}function BA(n){cn.key=0,cn.keyEnd=0,cn.value=0,cn.valueEnd=0,cn.textEnd=n.length}function xw(n,t,e){for(;t<e&&n.charCodeAt(t)<=32;)t++;return t}function UA(n,t,e){for(;t<e&&n.charCodeAt(t)>32;)t++;return t}function Ir(n,t,e){return Iw(n,t,e,!1),Ir}function J(n,t){return Iw(n,t,null,!0),J}function Jn(n){zA(ZA,HA,n,!0)}function HA(n,t){for(let e=VA(t);e>=0;e=Ew(t,e))wl(n,jA(t),!0)}function Iw(n,t,e,i){let r=j(),o=De(),s=Rl(2);if(o.firstUpdatePass&&Mw(o,n,s,i),t!==gt&&Wt(r,s,t)){let a=o.data[rn()];Tw(o,a,r,r[be],n,r[s+1]=QA(t,e),i,s)}}function zA(n,t,e,i){let r=De(),o=Rl(2);r.firstUpdatePass&&Mw(r,null,o,i);let s=j();if(e!==gt&&Wt(s,o,e)){let a=r.data[rn()];if(Aw(a,i)&&!Nw(r,o)){let c=i?a.classesWithoutHost:a.stylesWithoutHost;c!==null&&(e=gl(c,e||``)),Vm(r,a,s,e,i)}else KA(r,a,s,s[be],s[o+1],s[o+1]=YA(n,t,e),i,o)}}function Nw(n,t){return t>=n.expandoStartIndex}function Mw(n,t,e,i){let r=n.data;if(r[e+1]===null){let o=r[rn()],s=Nw(n,e);Aw(o,i)&&t===null&&!s&&(t=!1),t=$A(r,o,t,i),PA(r,o,t,e,s,i)}}function $A(n,t,e,i){let r=T_(n),o=i?t.residualClasses:t.residualStyles;if(r===null)(i?t.classBindings:t.styleBindings)===0&&(e=rm(null,n,t,e,i),e=ya(e,t.attrs,i),o=null);else{let s=t.directiveStylingLast;if(s===-1||n[s]!==r)if(e=rm(r,n,t,e,i),o===null){let c=WA(n,t,i);c!==void 0&&Array.isArray(c)&&(c=rm(null,n,t,c[1],i),c=ya(c,t.attrs,i),GA(n,t,i,c))}else o=qA(n,t,i)}return o!==void 0&&(i?t.residualClasses=o:t.residualStyles=o),e}function WA(n,t,e){let i=e?t.classBindings:t.styleBindings;if(No(i)!==0)return n[Dr(i)]}function GA(n,t,e,i){let r=e?t.classBindings:t.styleBindings;n[Dr(r)]=i}function qA(n,t,e){let i,r=t.directiveEnd;for(let o=1+t.directiveStylingLast;o<r;o++){let s=n[o].hostAttrs;i=ya(i,s,e)}return ya(i,t.attrs,e)}function rm(n,t,e,i,r){let o=null,s=e.directiveEnd,a=e.directiveStylingLast;for(a===-1?a=e.directiveStart:a++;a<s&&(o=t[a],i=ya(i,o.hostAttrs,r),o!==n);)a++;return n!==null&&(e.directiveStylingLast=a),i}function ya(n,t,e){let i=e?1:2,r=-1;if(t!==null)for(let o=0;o<t.length;o++){let s=t[o];typeof s==`number`?r=s:r===i&&(Array.isArray(n)||(n=n===void 0?[]:[``,n]),wl(n,s,e?!0:t[++o]))}return n===void 0?null:n}function YA(n,t,e){if(e==null||e===``)return ct;let i=[],r=kt(e);if(Array.isArray(r))for(let o=0;o<r.length;o++)n(i,r[o],!0);else if(r instanceof Set)for(let o of r)n(i,o,!0);else if(typeof r==`object`)for(let o in r)Object.hasOwn(r,o)&&n(i,o,r[o]);else typeof r==`string`&&t(i,r);return i}function ZA(n,t,e){let i=String(t);i!==``&&!i.includes(` `)&&wl(n,i,e)}function KA(n,t,e,i,r,o,s,a){r===gt&&(r=ct);let c=0,l=0,d=0<r.length?r[0]:null,f=0<o.length?o[0]:null;for(;d!==null||f!==null;){let h=c<r.length?r[c+1]:void 0,m=l<o.length?o[l+1]:void 0,v=null,y;d===f?(c+=2,l+=2,h!==m&&(v=f,y=m)):f===null||d!==null&&d<f?(c+=2,v=d):(l+=2,v=f,y=m),v!==null&&Tw(n,t,e,i,v,y,s,a),d=c<r.length?r[c]:null,f=l<o.length?o[l]:null}}function Tw(n,t,e,i,r,o,s,a){if(!(t.type&3))return;let c=n.data,l=c[a+1];if(!dd(OA(l)?Mb(c,t,e,r,No(l),s):void 0)){dd(o)||RA(l)&&(o=Mb(c,null,e,r,a,s));wM(i,s,Th(rn(),e),r,o)}}function Mb(n,t,e,i,r,o){let s=t===null,a;for(;r>0;){let c=n[r],l=Array.isArray(c),d=l?c[1]:c,f=d===null,h=e[r+1];h===gt&&(h=f?ct:void 0);let m=f?Cl(h,i):d===i?h:void 0;if(l&&!dd(m)&&(m=Cl(c,i)),dd(m)&&(a=m,s))return a;let v=n[r+1];r=s?Dr(v):No(v)}if(t!==null){let c=o?t.residualClasses:t.residualStyles;c!=null&&(a=Cl(c,i))}return a}function dd(n){return n!==void 0}function QA(n,t){return n==null||n===``||(typeof t==`string`?n=kt(n)+t:typeof n==`object`&&(n=Zs(kt(n)))),n}function Aw(n,t){return(n.flags&(t?8:16))!==0}function kp(n,t=``){let e=j(),i=De(),r=n+Ae,o=i.firstCreatePass?To(i,r,1,t,null):i.data[r],s=XA(i,e,o,t);e[r]=s,Ll()&&ap(i,e,s,o),_o(o,!1)}var XA=(n,t,e,i)=>(sa(!0),AN(t[be],i));function JA(n,t,e,i=``){return Wt(n,Ci(),e)?t+cr(e)+i:gt}function eR(n,t,e,i,r,o=``){let a=tw(n,E_(),e,r);return Rl(2),a?t+cr(e)+i+cr(r)+o:gt}function Td(n){return Op(``,n),Td}function Op(n,t,e){let i=j(),r=JA(i,n,t,e);return r!==gt&&kw(i,rn(),r),Op}function Rw(n,t,e,i,r){let o=j(),s=eR(o,n,t,e,i,r);return s!==gt&&kw(o,rn(),s),Rw}function kw(n,t,e){let i=Th(t,n);RN(n[be],i,e)}function Tb(n,t,e){let i=De();i.firstCreatePass&&Ow(t,i.data,i.blueprint,nn(n),e)}function Ow(n,t,e,i,r){if(n=ze(n),Array.isArray(n))for(let o=0;o<n.length;o++)Ow(n[o],t,e,i,r);else{let o=De(),s=j(),a=We(),c=rr(n)?n:ze(n.provide),l=Eh(n),d=a.providerIndexes&1048575,f=a.directiveStart,h=a.providerIndexes>>20;if(rr(n)||!n.multi){let m=new wr(l,r,ne,null),v=sm(c,t,r?d:d+h,f);v===-1?(lm(Xl(a,s),o,c),om(o,n,t.length),t.push(c),a.directiveStart++,a.directiveEnd++,r&&(a.providerIndexes+=1048576),e.push(m),s.push(m)):(e[v]=m,s[v]=m)}else{let m=sm(c,t,d+h,f),v=sm(c,t,d,d+h),y=m>=0&&e[m],R=v>=0&&e[v];if(r&&!R||!r&&!y){lm(Xl(a,s),o,c);let k=iR(r?nR:tR,e.length,r,i,l,n);!r&&R&&(e[v].providerFactory=k),om(o,n,t.length,0),t.push(c),a.directiveStart++,a.directiveEnd++,r&&(a.providerIndexes+=1048576),e.push(k),s.push(k)}else{let k=Pw(e[r?v:m],l,!r&&i);om(o,n,m>-1?m:v,k)}!r&&i&&R&&e[v].componentProviders++}}}function om(n,t,e,i){let r=rr(t),o=u_(t);if(r||o){let c=(o?ze(t.useClass):t).prototype.ngOnDestroy;if(c){let l=n.destroyHooks||(n.destroyHooks=[]);if(!r&&t.multi){let d=l.indexOf(e);d===-1?l.push(e,[i,c]):l[d+1].push(i,c)}else l.push(e,c)}}}function Pw(n,t,e){return e&&n.componentProviders++,n.multi.push(t)-1}function sm(n,t,e,i){for(let r=e;r<i;r++)if(t[r]===n)return r;return-1}function tR(n,t,e,i,r){return Hm(this.multi,[])}function nR(n,t,e,i,r){let o=this.multi,s;if(this.providerFactory){let a=this.providerFactory.componentProviders,c=ha(i,i[A],this.providerFactory.index,r);s=c.slice(0,a),Hm(o,s);for(let l=a;l<c.length;l++)s.push(c[l])}else s=[],Hm(o,s);return s}function Hm(n,t){for(let e=0;e<n.length;e++){let i=n[e];t.push(i())}return t}function iR(n,t,e,i,r,o){let s=new wr(n,e,ne,null);return s.multi=[],s.index=t,s.componentProviders=0,Pw(s,r,i&&!e),s}function Le(n,t){return e=>{e.providersResolver=(i,r)=>Tb(i,r?r(n):n,!1),t&&(e.viewProvidersResolver=(i,r)=>Tb(i,r?r(t):t,!0))}}function rR(n,t){let e=Al()+n,i=j();return i[e]===gt?vp(i,e,t()):lT(i,e)}function oR(n,t,e){return aR(j(),Al(),n,t,e)}function sR(n,t,e,i){return cR(j(),Al(),n,t,e,i)}function Fw(n,t){let e=n[t];return e===gt?void 0:e}function aR(n,t,e,i,r,o){let s=t+e;return Wt(n,s,r)?vp(n,s+1,o?i.call(o,r):i(r)):Fw(n,s+1)}function cR(n,t,e,i,r,o,s){let a=t+e;return tw(n,a,r,o)?vp(n,a+2,s?i.call(s,r,o):i(r,o)):Fw(n,a+2)}function Ro(n,t){return wd(n,t)}var Lw=(()=>{class n{applicationErrorHandler=u($t);appRef=u(vt);taskService=u(qn);ngZone=u(I);zonelessEnabled=u(ca);tracing=u(An,{optional:!0});zoneIsDefined=typeof Zone<`u`&&!!Zone.root.run;schedulerTickApplyArgs=[{data:{__scheduler_tick__:!0}}];subscriptions=new Q;angularZoneId=this.zoneIsDefined?this.ngZone._inner?.get(qs):null;scheduleInRootZone=!this.zonelessEnabled&&this.zoneIsDefined&&(u(Kh,{optional:!0})??!1);cancelScheduledCallback=null;useMicrotaskScheduler=!1;runningTick=!1;pendingRenderTaskId=null;constructor(){this.subscriptions.add(this.appRef.afterTick.subscribe(()=>{let e=this.taskService.add();if(!this.runningTick&&(this.cleanup(),!this.zonelessEnabled||this.appRef.includeAllTestViews)){this.taskService.remove(e);return}this.switchToMicrotaskScheduler(),this.taskService.remove(e)})),this.subscriptions.add(this.ngZone.onUnstable.subscribe(()=>{this.runningTick||this.cleanup()}))}switchToMicrotaskScheduler(){this.ngZone.runOutsideAngular(()=>{let e=this.taskService.add();this.useMicrotaskScheduler=!0,queueMicrotask(()=>{this.useMicrotaskScheduler=!1,this.taskService.remove(e)})})}notify(e){if(!this.zonelessEnabled&&e===5)return;switch(e){case 0:case 2:this.appRef.dirtyFlags|=2;break;case 3:case 4:case 5:case 1:this.appRef.dirtyFlags|=4;break;case 6:this.appRef.dirtyFlags|=2;break;case 12:this.appRef.dirtyFlags|=16;break;case 13:this.appRef.dirtyFlags|=2;break;case 11:break;default:this.appRef.dirtyFlags|=8}if(this.appRef.tracingSnapshot=this.tracing?.snapshot(this.appRef.tracingSnapshot)??null,!this.shouldScheduleTick())return;let i=this.useMicrotaskScheduler?j_:qh;this.pendingRenderTaskId=this.taskService.add(),this.scheduleInRootZone?this.cancelScheduledCallback=Zone.root.run(()=>i(()=>this.tick())):this.cancelScheduledCallback=this.ngZone.runOutsideAngular(()=>i(()=>this.tick()))}shouldScheduleTick(){return!(this.appRef.destroyed||this.pendingRenderTaskId!==null||this.runningTick||this.appRef._runningTick||!this.zonelessEnabled&&this.zoneIsDefined&&Zone.current.get(qs+this.angularZoneId))}tick(){if(this.runningTick||this.appRef.destroyed)return;if(this.appRef.dirtyFlags===0){this.cleanup();return}!this.zonelessEnabled&&this.appRef.dirtyFlags&7&&(this.appRef.dirtyFlags|=1);let e=this.taskService.add();try{this.ngZone.run(()=>{this.runningTick=!0,this.appRef._tick()},void 0,this.schedulerTickApplyArgs)}catch(i){this.applicationErrorHandler(i)}finally{this.taskService.remove(e),this.cleanup()}}ngOnDestroy(){this.subscriptions.unsubscribe(),this.cleanup()}cleanup(){if(this.runningTick=!1,this.cancelScheduledCallback?.(),this.cancelScheduledCallback=null,this.pendingRenderTaskId!==null){let e=this.pendingRenderTaskId;this.pendingRenderTaskId=null,this.taskService.remove(e)}}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function lR(){return Rn(`NgZoneless`),Sn([...Pp(),[]])}function Pp(){return[{provide:bn,useExisting:Lw},{provide:I,useClass:Ys},{provide:ca,useValue:!0}]}var Fp=(()=>{class n{compileModuleSync(e){return new ad(e)}compileModuleAsync(e){return Promise.resolve(this.compileModuleSync(e))}clearCache(){}clearCacheFor(e){}getModuleId(e){}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function dR(){return typeof $localize<`u`&&$localize.locale||Aa}var Ad=new g(``,{factory:()=>u(Ad,{optional:!0,skipSelf:!0})||dR()});var Rd=class{destroyed=!1;listeners=null;errorHandler=u(lt,{optional:!0});isEmitting=!1;hasNullListeners=!1;destroyRef=u(ke);constructor(){this.destroyRef.onDestroy(()=>{this.destroyed=!0,this.listeners=null})}subscribe(t){if(this.destroyed)throw new _(953,!1);return(this.listeners??=[]).push(t),{unsubscribe:()=>{let e=this.listeners?this.listeners.indexOf(t):-1;e>-1&&(this.isEmitting?(this.hasNullListeners=!0,this.listeners[e]=null):this.listeners.splice(e,1))}}}emit(t){if(this.destroyed){console.warn(Jt(953,!1));return}if(this.listeners===null)return;this.isEmitting=!0;let e=O(null);try{for(let i of this.listeners)try{i!==null&&i(t)}catch(r){this.errorHandler?.handleError(r)}}finally{this.hasNullListeners&&(this.hasNullListeners=!1,this.listeners&&uR(this.listeners)),O(e),this.isEmitting=!1}}};function uR(n){let t=n.length-1;for(;t>-1;)n[t]===null&&n.splice(t,1),t--}function x(n,t){return Hs(n,t?.equal)}function E(n){return Gy(n)}(class n extends Error{_brand;constructor(t){super(t)}static IDLE=new n(`IDLE`);static LOADING=new n(`LOADING`)});var fR=n=>n;function kn(n,t){if(typeof n==`function`)return Vw(Xf(n,fR,t?.equal),t?.debugName,t?.set);else return Vw(Xf(n.source,n.computation,n.equal),n.debugName,n.set)}function Vw(n,t,e){let i=n[Ce],r=n;if(e!==void 0){let o=s=>Jf(i,s);r.set=s=>e(s,o),r.update=s=>e(s(E(n)),o)}else r.set=o=>Jf(i,o),r.update=o=>Wy(i,o);return r.asReadonly=jl.bind(n),r}var Bw=!1;function Lp(){return Bw}function kd(n){Bw=n}function Gw(n,t){let e=Object.create(Ob);e.value=n,e.transformFn=t?.transform;function i(){if(pi(e),e.value===ud)throw new _(-950,null);return e.value}return i[Ce]=e,i}var ko=class{attributeName;constructor(t){this.attributeName=t}__NG_ELEMENT_ID__=()=>ba(this.attributeName);toString(){return`HostAttributeToken ${this.attributeName}`}};function Up(n){return MR(n)?n.default:n}function MR(n){return n&&typeof n==`object`&&`default`in n}function X5(n){return new Rd}function Uw(n,t){return Gw(n,t)}function TR(n){return Gw(ud,n)}var Mi=(Uw.required=TR,Uw);function Hw(n,t){return Cp(t)}function AR(n,t){return Dp(t)}var ka=(Hw.required=AR,Hw);function zw(n,t){return Cp(t)}function RR(n,t){return Dp(t)}var qw=(zw.required=RR,zw);var Qe=(()=>{class n{static __NG_ELEMENT_ID__=OR}return n})();function OR(n){return PR(We(),j(),(n&16)===16)}function PR(n,t,e){if(xn(n)&&!e){let i=zt(n.index,t);return new Ni(i,i)}else if(n.type&175){let i=t[pt];return new Ni(i,t)}return null}var Vp=new g(``);var FR=new g(``);function Ra(n){return!n.moduleRef}function LR(n){let t=Ra(n)?n.r3Injector:n.moduleRef.injector,e=t.get(I);return e.run(()=>{Ra(n)?n.r3Injector.resolveInjectorInitializers():n.moduleRef.resolveInjectorInitializers();let i=t.get($t),r;if(e.runOutsideAngular(()=>{r=e.onError.subscribe({next:i})}),Ra(n)){let o=()=>t.destroy(),s=n.platformInjector.get(Vp);s.add(o),t.onDestroy(()=>{r.unsubscribe(),s.delete(o)})}else{let o=()=>n.moduleRef.destroy(),s=n.platformInjector.get(Vp);s.add(o),n.moduleRef.onDestroy(()=>{fa(n.allPlatformModules,n.moduleRef),r.unsubscribe(),s.delete(o)})}return VR(i,e,()=>{let o=t.get(qn),s=o.add(),a=t.get(xp);return a.runInitializers(),a.donePromise.then(()=>{if(Dw(t.get(Ad,Aa)||Aa),!t.get(FR,!0))return Ra(n)?t.get(vt):(n.allPlatformModules.push(n.moduleRef),n.moduleRef);if(Ra(n)){let d=t.get(vt);return n.rootComponent!==void 0&&d.bootstrap(n.rootComponent),d}else return jR?.(n.moduleRef,n.allPlatformModules),n.moduleRef}).finally(()=>{o.remove(s)})})})}var jR;function VR(n,t,e){try{let i=e();return Xn(i)?i.catch(r=>{throw t.runOutsideAngular(()=>n(r)),r}):i}catch(i){throw t.runOutsideAngular(()=>n(i)),i}}var Od=null;function BR(n=[],t){return T.create({name:t,providers:[{provide:ta,useValue:`platform`},{provide:Vp,useValue:new Set([()=>Od=null])},...n]})}function UR(n=[]){if(Od)return Od;let t=BR(n);return Od=t,Sw(),HR(t),t}function HR(n){let t=n.get(Vl,null);Ie(n,()=>{t?.forEach(e=>e())})}function Yw(n){let{rootComponent:t,appProviders:e,platformProviders:i,platformRef:r}=n;pe(de.BootstrapApplicationStart);try{let o=r?.injector??UR(i);return LR({r3Injector:new va({providers:[Pp(),B_,...e||[]],parent:o,debugName:``,runEnvironmentInitializers:!1}).injector,platformInjector:o,rootComponent:t})}catch(o){return Promise.reject(o)}finally{pe(de.BootstrapApplicationEnd)}}function te(n){return typeof n==`boolean`?n:n!=null&&n!==`false`}function Oo(n,t=NaN){return!isNaN(parseFloat(n))&&!isNaN(Number(n))?Number(n):t}var jp=Symbol(`NOT_SET`);var Zw=new Set;var zR=S(p({},ao),{kind:`afterRenderEffectPhase`,consumerIsAlwaysLive:!0,consumerAllowSignalWrites:!0,value:jp,cleanup:null,consumerMarkedDirty(){if(this.sequence.impl.executing){if(this.sequence.lastPhase===null||this.sequence.lastPhase<this.phase)return;this.sequence.erroredOrDestroyed=!0}this.sequence.scheduler.notify(7)},phaseFn(n){if(this.sequence.lastPhase=this.phase,!this.dirty)return this.signal;if(this.dirty=!1,this.value!==jp&&!er(this))return this.signal;try{for(let r of this.cleanup??Zw)r()}finally{this.cleanup?.clear()}let t=[];n!==void 0&&t.push(n),t.push(this.registerCleanupFn);let e=yn(this),i;try{i=this.userFn.apply(null,t)}finally{Un(this,e)}return(this.value===jp||!this.equal(this.value,i))&&(this.value=i,this.version++),this.signal}});var Bp=class extends ma{scheduler;lastPhase=null;nodes=[void 0,void 0,void 0,void 0];onDestroyFns=null;constructor(t,e,i,r,o,s=null){super(t,[void 0,void 0,void 0,void 0],i,!1,o.get(ke),s),this.scheduler=r;for(let a of ip){let c=e[a];if(c===void 0)continue;let l=Object.create(zR);l.sequence=this,l.phase=a,l.userFn=c,l.dirty=!0,l.signal=()=>(pi(l),l.value),l.signal[Ce]=l,l.registerCleanupFn=d=>(l.cleanup??=new Set).add(d),this.nodes[a]=l,this.hooks[a]=d=>l.phaseFn(d)}}afterRun(){super.afterRun(),this.lastPhase=null}destroy(){if(this.onDestroyFns!==null)for(let t of this.onDestroyFns)t();super.destroy();for(let t of this.nodes)if(t)try{for(let e of t.cleanup??Zw)e()}finally{Hn(t)}}};function Pd(n,t){let e=t?.injector??u(T),i=e.get(bn),r=e.get(gd),o=e.get(An,null,{optional:!0});r.impl??=e.get(rp);let s=n;typeof s==`function`&&(s={mixedReadWrite:n});let a=e.get(bo,null,{optional:!0}),c=new Bp(r.impl,[s.earlyRead,s.write,s.mixedReadWrite,s.read],a?.view,i,e,o?.snapshot(null));return r.impl.register(c),c}function Fd(n,t){let e=yi(n),i=t.elementInjector||mo();return new xo(e).create(i,t.projectableNodes,t.hostElement,t.environmentInjector,t.directives,t.bindings)}var Kw=null;function Gt(){return Kw}function Hp(n){Kw??=n}var Oa=class{};var Po=(()=>{class n{historyGo(e){throw new Error(``)}static ɵfac=function(i){return new(i||n)};static ɵprov=W({token:n,factory:()=>u(Qw),providedIn:`platform`})}return n})();var Qw=(()=>{class n extends Po{_location;_history;_doc=u(M);constructor(){super(),this._location=window.location,this._history=window.history}getBaseHrefFromDOM(){return Gt().getBaseHref(this._doc)}onPopState(e){let i=Gt().getGlobalEventTarget(this._doc,`window`);return i.addEventListener(`popstate`,e,!1),()=>i.removeEventListener(`popstate`,e)}onHashChange(e){let i=Gt().getGlobalEventTarget(this._doc,`window`);return i.addEventListener(`hashchange`,e,!1),()=>i.removeEventListener(`hashchange`,e)}get href(){return this._location.href}get protocol(){return this._location.protocol}get hostname(){return this._location.hostname}get port(){return this._location.port}get pathname(){return this._location.pathname}get search(){return this._location.search}get hash(){return this._location.hash}set pathname(e){this._location.pathname=e}pushState(e,i,r){this._history.pushState(e,i,r)}replaceState(e,i,r){this._history.replaceState(e,i,r)}forward(){this._history.forward()}back(){this._history.back()}historyGo(e=0){this._history.go(e)}getState(){return this._history.state}static ɵfac=function(i){return new(i||n)};static ɵprov=W({token:n,factory:()=>new n,providedIn:`platform`})}return n})();function eC(n,t){return n?t?n.endsWith(`/`)?t.startsWith(`/`)?n+t.slice(1):n+t:t.startsWith(`/`)?n+t:`${n}/${t}`:n:t}function Xw(n){let t=n.search(/#|\?|$/);return n[t-1]===`/`?n.slice(0,t-1)+n.slice(t):n}function Ti(n){return n&&n[0]!==`?`?`?${n}`:n}var Fo=(()=>{class n{historyGo(e){throw new Error(``)}static ɵfac=function(i){return new(i||n)};static ɵprov=W({token:n,factory:()=>u(WR),providedIn:`root`})}return n})();var $R=new g(``);var WR=(()=>{class n extends Fo{_platformLocation;_baseHref;_removeListenerFns=[];constructor(e,i){super(),this._platformLocation=e,this._baseHref=i??this._platformLocation.getBaseHrefFromDOM()??u(M).location?.origin??``}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}prepareExternalUrl(e){return eC(this._baseHref,e)}path(e=!1){let i=this._platformLocation.pathname+Ti(this._platformLocation.search),r=this._platformLocation.hash;return r&&e?`${i}${r}`:i}pushState(e,i,r,o){let s=this.prepareExternalUrl(r+Ti(o));this._platformLocation.pushState(e,i,s)}replaceState(e,i,r,o){let s=this.prepareExternalUrl(r+Ti(o));this._platformLocation.replaceState(e,i,s)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static ɵfac=function(i){return new(i||n)(P(Po),P($R,8))};static ɵprov=W({token:n,factory:n.ɵfac,providedIn:`root`})}return n})();var Ai=(()=>{class n{_subject=new w;_basePath;_locationStrategy;_urlChangeListeners=[];_urlChangeSubscription=null;constructor(e){this._locationStrategy=e;let i=this._locationStrategy.getBaseHref();this._basePath=YR(Xw(Jw(i))),this._locationStrategy.onPopState(r=>{let o={url:this.path(!0),pop:!0,state:r.state,type:r.type};r.hasUAVisualTransition&&(o.hasUAVisualTransition=!0),this._subject.next(o)})}ngOnDestroy(){this._urlChangeSubscription?.unsubscribe(),this._urlChangeListeners=[]}path(e=!1){return this.normalize(this._locationStrategy.path(e))}getState(){return this._locationStrategy.getState()}isCurrentPathEqualTo(e,i=``){return this.path()==this.normalize(e+Ti(i))}normalize(e){return n.stripTrailingSlash(qR(this._basePath,Jw(e)))}prepareExternalUrl(e){return e&&e[0]!==`/`&&(e=`/`+e),this._locationStrategy.prepareExternalUrl(e)}go(e,i=``,r=null){this._locationStrategy.pushState(r,``,e,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+Ti(i)),r)}replaceState(e,i=``,r=null){this._locationStrategy.replaceState(r,``,e,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+Ti(i)),r)}forward(){this._locationStrategy.forward()}back(){this._locationStrategy.back()}historyGo(e=0){this._locationStrategy.historyGo?.(e)}onUrlChange(e){return this._urlChangeListeners.push(e),this._urlChangeSubscription??=this.subscribe(i=>{this._notifyUrlChangeListeners(i.url,i.state)}),()=>{let i=this._urlChangeListeners.indexOf(e);this._urlChangeListeners.splice(i,1),this._urlChangeListeners.length===0&&(this._urlChangeSubscription?.unsubscribe(),this._urlChangeSubscription=null)}}_notifyUrlChangeListeners(e=``,i){this._urlChangeListeners.forEach(r=>r(e,i))}subscribe(e,i,r){return this._subject.subscribe({next:e,error:i??void 0,complete:r??void 0})}static normalizeQueryParams=Ti;static joinWithSlash=eC;static stripTrailingSlash=Xw;static ɵfac=function(i){return new(i||n)(P(Fo))};static ɵprov=W({token:n,factory:()=>GR(),providedIn:`root`})}return n})();function GR(){return new Ai(P(Fo))}function qR(n,t){if(!n||!t.startsWith(n))return t;let e=t.substring(n.length);return e===``||[`/`,`;`,`?`,`#`].includes(e[0])?e:t}function Jw(n){return n.replace(/\/index\.html$/,``)}function YR(n){if(new RegExp(`^(https?:)?//`).test(n)){let[,e]=n.split(/\/\/[^\/]+/);return e}return n}var Pa=(()=>{class n{_viewContainerRef;_viewRef=null;ngTemplateOutletContext=null;ngTemplateOutlet=null;ngTemplateOutletInjector=null;injector=u(T);constructor(e){this._viewContainerRef=e}ngOnChanges(e){if(this._shouldRecreateView(e)){let i=this._viewContainerRef;if(this._viewRef&&i.remove(i.indexOf(this._viewRef)),!this.ngTemplateOutlet){this._viewRef=null;return}let r=this._createContextForwardProxy();this._viewRef=i.createEmbeddedView(this.ngTemplateOutlet,r,{injector:this._getInjector()})}}_getInjector(){return this.ngTemplateOutletInjector===`outlet`?this.injector:this.ngTemplateOutletInjector??void 0}_shouldRecreateView(e){return!!e.ngTemplateOutlet||!!e.ngTemplateOutletInjector}_createContextForwardProxy(){return new Proxy({},{set:(e,i,r)=>this.ngTemplateOutletContext?Reflect.set(this.ngTemplateOutletContext,i,r):!1,get:(e,i,r)=>{if(this.ngTemplateOutletContext)return Reflect.get(this.ngTemplateOutletContext,i,r)}})}static ɵfac=function(i){return new(i||n)(ne(it))};static ɵdir=D({type:n,selectors:[[``,`ngTemplateOutlet`,``]],inputs:{ngTemplateOutletContext:`ngTemplateOutletContext`,ngTemplateOutlet:`ngTemplateOutlet`,ngTemplateOutletInjector:`ngTemplateOutletInjector`},features:[Be]})}return n})();function Fa(n,t){t=encodeURIComponent(t);for(let e of n.split(`;`)){let i=e.indexOf(`=`),[r,o]=i==-1?[e,``]:[e.slice(0,i),e.slice(i+1)];if(r.trim()!==t)continue;let s=o;try{s=decodeURIComponent(o)}catch{}return s.length>1&&s[0]===`"`&&s[s.length-1]===`"`&&(s=s.slice(1,-1)),s}return null}var zp=`browser`;function tC(n){return n===zp}var La=class{_doc;constructor(t){this._doc=t}manager};var Ld=(()=>{class n extends La{constructor(e){super(e)}supports(e){return!0}addEventListener(e,i,r,o){return e.addEventListener(i,r,o),()=>this.removeEventListener(e,i,r,o)}removeEventListener(e,i,r,o){return e.removeEventListener(i,r,o)}static ɵfac=function(i){return new(i||n)(P(M))};static ɵprov=W({token:n,factory:n.ɵfac})}return n})();var Bd=new g(``);var qp=(()=>{class n{_zone;_plugins;_eventNameToPlugin=new Map;constructor(e,i){this._zone=i,e.forEach(s=>{s.manager=this});let r=e.filter(s=>!(s instanceof Ld));this._plugins=r.slice().reverse();let o=e.find(s=>s instanceof Ld);o&&this._plugins.push(o)}addEventListener(e,i,r,o){return this._findPluginFor(i).addEventListener(e,i,r,o)}getZone(){return this._zone}_findPluginFor(e){let i=this._eventNameToPlugin.get(e);if(i)return i;if(i=this._plugins.find(o=>o.supports(e)),!i)throw new _(-5101,!1);return this._eventNameToPlugin.set(e,i),i}static ɵfac=function(i){return new(i||n)(P(Bd),P(I))};static ɵprov=W({token:n,factory:n.ɵfac})}return n})();var $p=`ng-app-id`;function nC(n){for(let t of n)t.remove()}function iC(n,t){let e=t.createElement(`style`);return e.textContent=n,e}function ek(n,t,e,i){let r=n.head?.querySelectorAll(`style[${$p}="${t}"],link[${$p}="${t}"]`);if(!r||r.length===0)return!1;for(let o of r)o.removeAttribute($p),o instanceof HTMLLinkElement?i.set(o.href.slice(o.href.lastIndexOf(`/`)+1),{usage:0,elements:[o]}):o.textContent&&e.set(o.textContent,{usage:0,elements:[o]});return!0}function Gp(n,t){let e=t.createElement(`link`);return e.setAttribute(`rel`,`stylesheet`),e.setAttribute(`href`,n),e}var Yp=(()=>{class n{doc;appId;nonce;inline=new Map;external=new Map;hosts=new Set;constructor(e,i,r,o={}){this.doc=e,this.appId=i,this.nonce=r,ek(e,i,this.inline,this.external)&&this.hosts.add(e.head)}addStyles(e,i){for(let r of e)this.addUsage(r,this.inline,iC);i?.forEach(r=>this.addUsage(r,this.external,Gp))}removeStyles(e,i){for(let r of e)this.removeUsage(r,this.inline);i?.forEach(r=>this.removeUsage(r,this.external))}addUsage(e,i,r){let o=i.get(e);o?o.usage++:i.set(e,{usage:1,elements:[...this.hosts].map(s=>this.addElement(s,r(e,this.doc)))})}removeUsage(e,i){let r=i.get(e);r&&(r.usage--,r.usage<=0&&(nC(r.elements),i.delete(e)))}ngOnDestroy(){for(let[,{elements:e}]of[...this.inline,...this.external])nC(e);this.hosts.clear()}addHost(e){if(!this.hosts.has(e)){this.hosts.add(e);for(let[i,{elements:r}]of this.inline)r.push(this.addElement(e,iC(i,this.doc)));for(let[i,{elements:r}]of this.external)r.push(this.addElement(e,Gp(i,this.doc)))}}removeHost(e){this.hosts.delete(e);for(let i of[...this.inline.values(),...this.external.values()]){let r=[];for(let o of i.elements)o.parentNode===e?o.remove():r.push(o);i.elements=r}}addElement(e,i){return this.nonce&&i.setAttribute(`nonce`,this.nonce),e.appendChild(i)}static ɵfac=function(i){return new(i||n)(P(M),P(on),P(Yn,8),P(_r))};static ɵprov=W({token:n,factory:n.ɵfac})}return n})();var Wp={svg:`http://www.w3.org/2000/svg`,xhtml:`http://www.w3.org/1999/xhtml`,xlink:`http://www.w3.org/1999/xlink`,xml:`http://www.w3.org/XML/1998/namespace`,xmlns:`http://www.w3.org/2000/xmlns/`,math:`http://www.w3.org/1998/Math/MathML`};var Zp=/%COMP%/g;var oC=`%COMP%`;var tk=`_nghost-${oC}`;var nk=`_ngcontent-${oC}`;var ik=!0;var rk=new g(``,{factory:()=>ik});var ok=new g(``);function sk(n){return nk.replace(Zp,n)}function ak(n){return tk.replace(Zp,n)}function sC(n,t){return t.map(e=>e.replace(Zp,n))}var Kp=(()=>{class n{eventManager;sharedStylesHost;appId;removeStylesOnCompDestroy;doc;ngZone;nonce;tracingService;rendererByCompId=new Map;defaultRenderer;cssVarNamespace;constructor(e,i,r,o,s,a,c=null,l=null,d=null){this.eventManager=e,this.sharedStylesHost=i,this.appId=r,this.removeStylesOnCompDestroy=o,this.doc=s,this.ngZone=a,this.nonce=c,this.tracingService=l,this.cssVarNamespace=d??``,this.defaultRenderer=new ja(e,s,a,this.tracingService,this.cssVarNamespace)}createRenderer(e,i){if(!e||!i)return this.defaultRenderer;let r=this.getOrCreateRenderer(e,i);return r instanceof Vd?r.applyToHost(e):r instanceof Va&&r.applyStyles(),r}getOrCreateRenderer(e,i){let r=this.rendererByCompId,o=r.get(i.id);if(!o){let s=this.doc,a=this.ngZone,c=this.eventManager,l=this.sharedStylesHost,d=this.removeStylesOnCompDestroy,f=this.tracingService;switch(i.encapsulation){case ln.Emulated:o=new Vd(c,l,i,this.appId,d,s,a,f,this.cssVarNamespace);break;case ln.ShadowDom:return new jd(c,e,i,s,a,this.nonce,f,this.cssVarNamespace,l);case ln.ExperimentalIsolatedShadowDom:return new jd(c,e,i,s,a,this.nonce,f,this.cssVarNamespace);default:o=new Va(c,l,i,d,s,a,f,this.cssVarNamespace);break}r.set(i.id,o)}return o}ngOnDestroy(){this.rendererByCompId.clear()}componentReplaced(e){this.rendererByCompId.delete(e)}static ɵfac=function(i){return new(i||n)(P(qp),P(Er),P(on),P(rk),P(M),P(I),P(Yn),P(An,8),P(ok,8))};static ɵprov=W({token:n,factory:n.ɵfac})}return n})();var ja=class{eventManager;doc;ngZone;tracingService;cssVarNamespace;data=Object.create(null);throwOnSyntheticProps=!0;constructor(t,e,i,r,o=``){this.eventManager=t,this.doc=e,this.ngZone=i,this.tracingService=r,this.cssVarNamespace=o}destroy(){}destroyNode=null;createElement(t,e){return e?this.doc.createElementNS(Wp[e]||e,t):this.doc.createElement(t)}createComment(t){return this.doc.createComment(t)}createText(t){return this.doc.createTextNode(t)}appendChild(t,e){(rC(t)?t.content:t).appendChild(e)}insertBefore(t,e,i){if(t){let r=rC(t)?t.content:t;if(i!=null&&i.parentNode!==r)throw new _(-5106,!1);r.insertBefore(e,i)}}removeChild(t,e){e.remove()}selectRootElement(t,e){let i=typeof t==`string`?this.doc.querySelector(t):t;if(!i)throw new _(-5104,!1);return e||(i.textContent=``),i}parentNode(t){return t.parentNode}nextSibling(t){return t.nextSibling}setAttribute(t,e,i,r){if(r){e=r+`:`+e;let o=Wp[r];o?t.setAttributeNS(o,e,i):t.setAttribute(e,i)}else t.setAttribute(e,i)}removeAttribute(t,e,i){if(i){let r=Wp[i];r?t.removeAttributeNS(r,e):t.removeAttribute(`${i}:${e}`)}else t.removeAttribute(e)}addClass(t,e){t.classList.add(e)}removeClass(t,e){t.classList.remove(e)}setStyle(t,e,i,r){let o=e.startsWith(`--`);o&&(e=e.replace(`%NS%`,this.cssVarNamespace)),o||r&(Nn.DashCase|Nn.Important)?t.style.setProperty(e,i,r&Nn.Important?`important`:``):t.style[e]=i}removeStyle(t,e,i){let r=e.startsWith(`--`);r&&(e=e.replace(`%NS%`,this.cssVarNamespace)),r||i&Nn.DashCase?t.style.removeProperty(e):t.style[e]=``}setProperty(t,e,i){t!=null&&(t[e]=i)}setValue(t,e){t.nodeValue=e}listen(t,e,i,r){if(typeof t==`string`&&(t=Gt().getGlobalEventTarget(this.doc,t),!t))throw new _(-5102,!1);let o=this.decoratePreventDefault(i);return this.tracingService?.wrapEventListener&&(o=this.tracingService.wrapEventListener(t,e,o)),this.eventManager.addEventListener(t,e,o,r)}decoratePreventDefault(t){return e=>{if(e===`__ngUnwrap__`)return t;t(e)===!1&&e.preventDefault()}}};function rC(n){return n.tagName===`TEMPLATE`&&n.content!==void 0}var jd=class extends ja{hostEl;sharedStylesHost;shadowRoot;constructor(t,e,i,r,o,s,a,c,l){super(t,r,o,a,c),this.hostEl=e,this.sharedStylesHost=l,this.shadowRoot=e.attachShadow({mode:`open`}),this.sharedStylesHost&&this.sharedStylesHost.addHost(this.shadowRoot);let d=i.styles;d=sC(i.id,d).map(h=>h.replace(/%NS%/g,c));for(let h of d){let m=document.createElement(`style`);s&&m.setAttribute(`nonce`,s),m.textContent=h,this.shadowRoot.appendChild(m)}let f=i.getExternalStyles?.();if(f)for(let h of f){let m=Gp(h,r);s&&m.setAttribute(`nonce`,s),this.shadowRoot.appendChild(m)}}nodeOrShadowRoot(t){return t===this.hostEl?this.shadowRoot:t}appendChild(t,e){return super.appendChild(this.nodeOrShadowRoot(t),e)}insertBefore(t,e,i){return super.insertBefore(this.nodeOrShadowRoot(t),e,i)}removeChild(t,e){return super.removeChild(null,e)}parentNode(t){return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))}destroy(){this.sharedStylesHost&&this.sharedStylesHost.removeHost(this.shadowRoot)}};var Va=class extends ja{sharedStylesHost;removeStylesOnCompDestroy;styles;styleUrls;constructor(t,e,i,r,o,s,a,c,l){super(t,o,s,a,c),this.sharedStylesHost=e,this.removeStylesOnCompDestroy=r;let d=i.styles,f=l?sC(l,d):d;this.styles=f.map(h=>h.replace(/%NS%/g,c)),this.styleUrls=i.getExternalStyles?.(l)}applyStyles(){this.sharedStylesHost.addStyles(this.styles,this.styleUrls)}destroy(){this.removeStylesOnCompDestroy&&Ii.size===0&&this.sharedStylesHost.removeStyles(this.styles,this.styleUrls)}};var Vd=class extends Va{contentAttr;hostAttr;constructor(t,e,i,r,o,s,a,c,l){let d=r+`-`+i.id;super(t,e,i,o,s,a,c,l,d),this.contentAttr=sk(d),this.hostAttr=ak(d)}applyToHost(t){this.applyStyles(),this.setAttribute(t,this.hostAttr,``)}createElement(t,e){let i=super.createElement(t,e);return super.setAttribute(i,this.contentAttr,``),i}};var Ud=class n extends Oa{supportsDOMEvents=!0;static makeCurrent(){Hp(new n)}onAndCancel(t,e,i,r){return t.addEventListener(e,i,r),()=>{t.removeEventListener(e,i,r)}}dispatchEvent(t,e){t.dispatchEvent(e)}remove(t){t.remove()}createElement(t,e){return e=e||this.getDefaultDocument(),e.createElement(t)}createHtmlDocument(){return document.implementation.createHTMLDocument(`fakeTitle`)}getDefaultDocument(){return document}isElementNode(t){return t.nodeType===Node.ELEMENT_NODE}isShadowRoot(t){return t instanceof DocumentFragment}getGlobalEventTarget(t,e){return e===`window`?window:e===`document`?t:e===`body`?t.body:null}getBaseHref(t){let e=ck();return e==null?null:lk(e)}resetBaseElement(){Ba=null}getUserAgent(){return window.navigator.userAgent}getCookie(t){return Fa(document.cookie,t)}};var Ba=null;function ck(){return Ba=Ba||document.head.querySelector(`base`),Ba?Ba.getAttribute(`href`):null}function lk(n){return new URL(n,document.baseURI).pathname}var aC=[`alt`,`control`,`meta`,`shift`];var dk={"\b":`Backspace`,"	":`Tab`,"":`Delete`,"\x1B":`Escape`,Del:`Delete`,Esc:`Escape`,Left:`ArrowLeft`,Right:`ArrowRight`,Up:`ArrowUp`,Down:`ArrowDown`,Menu:`ContextMenu`,Scroll:`ScrollLock`,Win:`OS`};var uk={alt:n=>n.altKey,control:n=>n.ctrlKey,meta:n=>n.metaKey,shift:n=>n.shiftKey};var cC=(()=>{class n extends La{constructor(e){super(e)}supports(e){return n.parseEventName(e)!=null}addEventListener(e,i,r,o){let s=n.parseEventName(i),a=n.eventCallback(s.fullKey,r,this.manager.getZone());return this.manager.getZone().runOutsideAngular(()=>Gt().onAndCancel(e,s.domEventName,a,o))}static parseEventName(e){let i=e.toLowerCase().split(`.`),r=i.shift();if(i.length===0||!(r===`keydown`||r===`keyup`))return null;let o=n._normalizeKey(i.pop()),s=``,a=i.indexOf(`code`);if(a>-1&&(i.splice(a,1),s=`code.`),aC.forEach(l=>{let d=i.indexOf(l);d>-1&&(i.splice(d,1),s+=l+`.`)}),s+=o,i.length!=0||o.length===0)return null;let c={};return c.domEventName=r,c.fullKey=s,c}static matchEventFullKeyCode(e,i){let r=dk[e.key]||e.key,o=``;return i.indexOf(`code.`)>-1&&(r=e.code,o=`code.`),r==null||!r?!1:(r=r.toLowerCase(),r===` `?r=`space`:r===`.`&&(r=`dot`),aC.forEach(s=>{if(s!==r){let a=uk[s];a(e)&&(o+=s+`.`)}}),o+=r,o===i)}static eventCallback(e,i,r){return o=>{n.matchEventFullKeyCode(o,e)&&r.runGuarded(()=>i(o))}}static _normalizeKey(e){return e===`esc`?`escape`:e}static ɵfac=function(i){return new(i||n)(P(M))};static ɵprov=W({token:n,factory:n.ɵfac})}return n})();async function fk(n,t,e){return Yw(p({rootComponent:n},hk(t,e)))}function hk(n,t){return{platformRef:t?.platformRef,appProviders:[...yk,...n?.providers??[]],platformProviders:vk}}function mk(){Ud.makeCurrent()}function pk(){return new lt}function gk(){return Wm(document),document}var vk=[{provide:_r,useValue:zp},{provide:Vl,useValue:mk,multi:!0},{provide:M,useFactory:gk}];var yk=[{provide:ta,useValue:`root`},{provide:lt,useFactory:pk},{provide:Bd,useClass:Ld,multi:!0},{provide:Bd,useClass:cC,multi:!0},Kp,{provide:Er,useClass:Yp},{provide:Yp,useExisting:Er},qp,{provide:Ve,useExisting:Kp},[]];var ni=class n{headers;normalizedNames=new Map;lazyInit;lazyUpdate=null;constructor(t){t?typeof t==`string`?this.lazyInit=()=>{this.headers=new Map,t.split(`
`).forEach(e=>{let i=e.indexOf(`:`);if(i>0){let r=e.slice(0,i),o=e.slice(i+1).trim();this.addHeaderEntry(r,o)}})}:typeof Headers<`u`&&t instanceof Headers?(this.headers=new Map,t.forEach((e,i)=>{this.addHeaderEntry(i,e)})):this.lazyInit=()=>{this.headers=new Map,Object.entries(t).forEach(([e,i])=>{this.setHeaderEntries(e,i)})}:this.headers=new Map}has(t){return this.init(),this.headers.has(t.toLowerCase())}get(t){this.init();let e=this.headers.get(t.toLowerCase());return e&&e.length>0?e[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(t){return this.init(),this.headers.get(t.toLowerCase())||null}append(t,e){return this.clone({name:t,value:e,op:`a`})}set(t,e){return this.clone({name:t,value:e,op:`s`})}delete(t,e){return this.clone({name:t,value:e,op:`d`})}maybeSetNormalizedName(t,e){this.normalizedNames.has(e)||this.normalizedNames.set(e,t)}init(){this.lazyInit&&(this.lazyInit instanceof n?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(t=>this.applyUpdate(t)),this.lazyUpdate=null))}copyFrom(t){t.init();for(let[e,i]of t.headers.entries())this.headers.set(e,i),this.normalizedNames.set(e,t.normalizedNames.get(e))}clone(t){let e=new n;return e.lazyInit=this.lazyInit&&this.lazyInit instanceof n?this.lazyInit:this,e.lazyUpdate=(this.lazyUpdate||[]).concat([t]),e}applyUpdate(t){let e=t.name.toLowerCase();switch(t.op){case`a`:case`s`:let i=t.value;if(typeof i==`string`&&(i=[i]),i.length===0)return;this.maybeSetNormalizedName(t.name,e);let r=t.op===`a`?(this.headers.get(e)||[]).slice():[];r.push(...i),this.headers.set(e,r);break;case`d`:let o=t.value;if(o===void 0)this.headers.delete(e),this.normalizedNames.delete(e);else{let s=Array.isArray(o)?o:[o],a=this.headers.get(e);if(!a)return;a=a.filter(c=>s.indexOf(c)===-1),a.length===0?(this.headers.delete(e),this.normalizedNames.delete(e)):this.headers.set(e,a)}break}}addHeaderEntry(t,e){let i=t.toLowerCase();this.maybeSetNormalizedName(t,i),this.headers.has(i)?this.headers.get(i).push(e):this.headers.set(i,[e])}setHeaderEntries(t,e){let i=(Array.isArray(e)?e:[e]).map(o=>o.toString()),r=t.toLowerCase();this.headers.set(r,i),this.maybeSetNormalizedName(t,r)}forEach(t){this.init(),Array.from(this.normalizedNames.keys()).forEach(e=>t(this.normalizedNames.get(e),this.headers.get(e)))}};var zd=class{map=new Map;set(t,e){return this.map.set(t,e),this}get(t){return this.map.has(t)||this.map.set(t,t.defaultValue()),this.map.get(t)}delete(t){return this.map.delete(t),this}has(t){return this.map.has(t)}keys(){return this.map.keys()}};var $d=class{encodeKey(t){return lC(t)}encodeValue(t){return lC(t)}decodeKey(t){return decodeURIComponent(t)}decodeValue(t){return decodeURIComponent(t)}};function _k(n,t){let e=new Map;return n.length>0&&n.replace(/^\?/,``).split(`&`).forEach(r=>{let o=r.indexOf(`=`),[s,a]=o==-1?[t.decodeKey(r),``]:[t.decodeKey(r.slice(0,o)),t.decodeValue(r.slice(o+1))],c=e.get(s)||[];c.push(a),e.set(s,c)}),e}var bk=/%(\d[a-f0-9])/gi;var Sk={40:`@`,"3A":`:`,24:`$`,"2C":`,`,"3B":`;`,"3D":`=`,"3F":`?`,"2F":`/`};function lC(n){return encodeURIComponent(n).replace(bk,(t,e)=>Sk[e]??t)}function Hd(n){return`${n}`}var ti=class n{map;encoder;updates=null;cloneFrom=null;constructor(t={}){if(this.encoder=t.encoder||new $d,t.fromString){if(t.fromObject)throw new _(2805,!1);this.map=_k(t.fromString,this.encoder)}else t.fromObject?(this.map=new Map,Object.keys(t.fromObject).forEach(e=>{let i=t.fromObject[e],r=Array.isArray(i)?i.map(Hd):[Hd(i)];this.map.set(e,r)})):this.map=null}has(t){return this.init(),this.map.has(t)}get(t){this.init();let e=this.map.get(t);return e?e[0]:null}getAll(t){return this.init(),this.map.get(t)||null}keys(){return this.init(),Array.from(this.map.keys())}append(t,e){return this.clone({param:t,value:e,op:`a`})}appendAll(t){let e=[];return Object.keys(t).forEach(i=>{let r=t[i];Array.isArray(r)?r.forEach(o=>{e.push({param:i,value:o,op:`a`})}):e.push({param:i,value:r,op:`a`})}),this.clone(e)}set(t,e){return this.clone({param:t,value:e,op:`s`})}delete(t,e){return this.clone({param:t,value:e,op:`d`})}toString(){return this.init(),this.keys().map(t=>{let e=this.encoder.encodeKey(t);return this.map.get(t).map(i=>e+`=`+this.encoder.encodeValue(i)).join(`&`)}).filter(t=>t!==``).join(`&`)}clone(t){let e=new n({encoder:this.encoder});return e.cloneFrom=this.cloneFrom||this,e.updates=(this.updates||[]).concat(t),e}init(){if(this.map===null&&(this.map=new Map),this.cloneFrom!==null){this.cloneFrom.init();for(let[t,e]of this.cloneFrom.map.entries())this.map.set(t,e);this.updates.forEach(t=>{switch(t.op){case`a`:case`s`:let e=t.op===`a`?(this.map.get(t.param)||[]).slice():[];e.push(Hd(t.value)),this.map.set(t.param,e);break;case`d`:if(t.value!==void 0){let i=(this.map.get(t.param)||[]).slice(),r=i.indexOf(Hd(t.value));r!==-1&&i.splice(r,1),i.length>0?this.map.set(t.param,i):this.map.delete(t.param)}else{this.map.delete(t.param);break}}}),this.cloneFrom=this.updates=null}}};function wk(n){switch(n){case`DELETE`:case`GET`:case`HEAD`:case`OPTIONS`:case`JSONP`:return!1;default:return!0}}function dC(n){return typeof ArrayBuffer<`u`&&n instanceof ArrayBuffer}function uC(n){return typeof Blob<`u`&&n instanceof Blob}function fC(n){return typeof FormData<`u`&&n instanceof FormData}function Ck(n){return typeof URLSearchParams<`u`&&n instanceof URLSearchParams}var Qp=`Content-Type`;var hC=`Accept`;var gC=`text/plain`;var vC=`application/json`;var Dk=`${vC}, ${gC}, */*`;var Lo=class n{url;body=null;headers;context;reportProgress=!1;reportUploadProgress=!1;reportDownloadProgress=!1;withCredentials=!1;credentials;keepalive=!1;cache;priority;mode;redirect;referrer;integrity;referrerPolicy;responseType=`json`;method;params;urlWithParams;transferCache;timeout;constructor(t,e,i,r){this.url=e,this.method=t.toUpperCase();let o;if(wk(this.method)||r?(this.body=i!==void 0?i:null,o=r):o=i,o){if(this.reportProgress=!!o.reportProgress,this.reportUploadProgress=!!o.reportUploadProgress,this.reportDownloadProgress=!!o.reportDownloadProgress,this.withCredentials=!!o.withCredentials,this.keepalive=!!o.keepalive,o.responseType&&(this.responseType=o.responseType),o.headers&&(this.headers=o.headers),o.context&&(this.context=o.context),o.params&&(this.params=o.params),o.priority&&(this.priority=o.priority),o.cache&&(this.cache=o.cache),o.credentials&&(this.credentials=o.credentials),typeof o.timeout==`number`){if(o.timeout<1||!Number.isInteger(o.timeout))throw new _(2822,``);this.timeout=o.timeout}o.mode&&(this.mode=o.mode),o.redirect&&(this.redirect=o.redirect),o.integrity&&(this.integrity=o.integrity),o.referrer!==void 0&&(this.referrer=o.referrer),o.referrerPolicy&&(this.referrerPolicy=o.referrerPolicy),this.transferCache=o.transferCache}if(this.headers??=new ni,this.context??=new zd,!this.params)this.params=new ti,this.urlWithParams=e;else{let s=this.params.toString();if(s.length===0)this.urlWithParams=e;else{let a=e,c=``,l=e.indexOf(`#`);l!==-1&&(c=e.substring(l),a=e.substring(0,l));let d=a.indexOf(`?`),f=d===-1?`?`:d<a.length-1?`&`:``;this.urlWithParams=a+f+s+c}}}serializeBody(){return this.body===null?null:typeof this.body==`string`||dC(this.body)||uC(this.body)||fC(this.body)||Ck(this.body)?this.body:this.body instanceof ti?this.body.toString():typeof this.body==`object`||typeof this.body==`boolean`||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return this.body===null||fC(this.body)?null:uC(this.body)?this.body.type||null:dC(this.body)?null:typeof this.body==`string`?gC:this.body instanceof ti?`application/x-www-form-urlencoded;charset=UTF-8`:typeof this.body==`object`||typeof this.body==`number`||typeof this.body==`boolean`?vC:null}clone(t={}){let e=t.method||this.method,i=t.url||this.url,r=t.responseType||this.responseType,o=t.keepalive??this.keepalive,s=t.priority||this.priority,a=t.cache||this.cache,c=t.mode||this.mode,l=t.redirect||this.redirect,d=t.credentials||this.credentials,f=t.referrer??this.referrer,h=t.integrity||this.integrity,m=t.referrerPolicy||this.referrerPolicy,v=t.transferCache??this.transferCache,y=t.timeout??this.timeout,R=t.body!==void 0?t.body:this.body,k=t.withCredentials??this.withCredentials,Se=t.reportProgress??this.reportProgress,Ue=t.reportUploadProgress??this.reportUploadProgress,Ns=t.reportDownloadProgress??this.reportDownloadProgress,di=t.headers||this.headers,Ms=t.params||this.params,Ts=t.context??this.context;return t.setHeaders!==void 0&&(di=Object.keys(t.setHeaders).reduce((Jr,ui)=>Jr.set(ui,t.setHeaders[ui]),di)),t.setParams&&(Ms=Object.keys(t.setParams).reduce((Jr,ui)=>Jr.set(ui,t.setParams[ui]),Ms)),new n(e,i,R,{params:Ms,headers:di,context:Ts,reportProgress:Se,reportUploadProgress:Ue,reportDownloadProgress:Ns,responseType:r,withCredentials:k,transferCache:v,keepalive:o,cache:a,priority:s,timeout:y,mode:c,redirect:l,credentials:d,referrer:f,integrity:h,referrerPolicy:m})}};var Nr=(function(n){return n[n.Sent=0]=`Sent`,n[n.UploadProgress=1]=`UploadProgress`,n[n.ResponseHeader=2]=`ResponseHeader`,n[n.DownloadProgress=3]=`DownloadProgress`,n[n.Response=4]=`Response`,n[n.User=5]=`User`,n})(Nr||{});var jo=class{headers;status;statusText;url;ok;type;redirected;responseType;constructor(t,e=200,i=`OK`){this.headers=t.headers||new ni,this.status=t.status!==void 0?t.status:e,this.statusText=t.statusText||i,this.url=t.url||null,this.redirected=t.redirected,this.responseType=t.responseType,this.ok=this.status>=200&&this.status<300}};var Wd=class n extends jo{constructor(t={}){super(t)}type=Nr.ResponseHeader;clone(t={}){return new n({headers:t.headers||this.headers,status:t.status!==void 0?t.status:this.status,statusText:t.statusText||this.statusText,url:t.url||this.url||void 0})}};var Ua=class n extends jo{body;constructor(t={}){super(t),this.body=t.body!==void 0?t.body:null}type=Nr.Response;clone(t={}){return new n({body:t.body!==void 0?t.body:this.body,headers:t.headers||this.headers,status:t.status!==void 0?t.status:this.status,statusText:t.statusText||this.statusText,url:t.url||this.url||void 0,redirected:t.redirected??this.redirected,responseType:t.responseType??this.responseType})}};var ei=class extends jo{name=`HttpErrorResponse`;message;error;ok=!1;constructor(t){super(t,0,`Unknown Error`),this.status>=200&&this.status<300?this.message=`Http failure during parsing for ${t.url||`(unknown url)`}`:this.message=`Http failure response for ${t.url||`(unknown url)`}: ${t.status} ${t.statusText}`,this.error=t.error||null}};var Ek=200;var xk=/^\)\]\}',?\n/;var yC=new g(``,{factory:()=>null});var Gd=(()=>{class n{fetchImpl=u(Jp,{optional:!0})?.fetch??((...e)=>globalThis.fetch(...e));ngZone=u(I);destroyRef=u(ke);maxResponseSize=u(yC);handle(e){return new V(i=>{let r=new AbortController,o=!1,s={next:c=>{c.type===Nr.Response&&(o=!0),i.next(c)},error:c=>{o=!0,i.error(c)},complete:()=>{o=!0,i.complete()}};this.doRequest(e,r.signal,s).then(eg,c=>s.error(new ei({error:c})));let a;return e.timeout&&(a=this.ngZone.runOutsideAngular(()=>setTimeout(()=>{r.signal.aborted||r.abort(new DOMException(`signal timed out`,`TimeoutError`))},e.timeout))),()=>{a!==void 0&&clearTimeout(a),!o&&!r.signal.aborted&&r.abort()}})}async doRequest(e,i,r){let o=this.createRequestInit(e),s;try{let R=this.ngZone.runOutsideAngular(()=>this.fetchImpl(e.urlWithParams,p({signal:i},o)));Ik(R),r.next({type:Nr.Sent}),s=await R}catch(R){r.error(new ei({error:R,status:R.status??0,statusText:R.statusText,url:e.urlWithParams,headers:R.headers}));return}let a=new ni(s.headers),c=s.statusText,l=s.url||e.urlWithParams,d=s.status,f=null,h=e.reportProgress||e.reportDownloadProgress;if(h&&r.next(new Wd({headers:a,status:d,statusText:c,url:l})),s.body){let R=s.headers.get(Qp)??``,k=s.headers.get(`content-length`),Se=k!==null?Number(k):NaN;this.maxResponseSize!==null&&Number.isFinite(Se)&&Se>this.maxResponseSize&&(await s.body.cancel(),mC(this.maxResponseSize));let Ue=[],Ns=s.body.getReader(),di=0,Ms,Ts,Jr=typeof Zone<`u`&&Zone.current,ui=!1;if(await this.ngZone.runOutsideAngular(async()=>{for(;;){if(this.destroyRef.destroyed){await Ns.cancel(),ui=!0;break}let{done:Nf,value:Mf}=await Ns.read();if(Nf)break;if(Ue.push(Mf),di+=Mf.length,this.maxResponseSize!==null&&di>this.maxResponseSize&&(await Ns.cancel(),mC(this.maxResponseSize)),h){Ts=e.responseType===`text`?(Ts??``)+(Ms??=pC(R)).decode(Mf,{stream:!0}):void 0;let oy=()=>r.next({type:Nr.DownloadProgress,total:Number.isFinite(Se)?Se:void 0,loaded:di,partialText:Ts});Jr?Jr.run(oy):oy()}}}),ui){r.complete();return}let a0=this.concatChunks(Ue,di);try{f=this.parseBody(e,a0,R,d)}catch(Nf){r.error(new ei({error:Nf,headers:new ni(s.headers),status:s.status,statusText:s.statusText,url:s.url||e.urlWithParams}));return}}d===0&&(d=f?Ek:0);let m=d>=200&&d<300,v=s.redirected,y=s.type;m?(r.next(new Ua({body:f,headers:a,status:d,statusText:c,url:l,redirected:v,responseType:y})),r.complete()):r.error(new ei({error:f,headers:a,status:d,statusText:c,url:l,redirected:v,responseType:y}))}parseBody(e,i,r,o){switch(e.responseType){case`json`:let s=new TextDecoder().decode(i).replace(xk,``);if(s===``)return null;try{return JSON.parse(s)}catch(a){if(o<200||o>=300)return s;throw a}case`text`:return pC(r).decode(i);case`blob`:return new Blob([i],{type:r});case`arraybuffer`:return i.buffer}}createRequestInit(e){if(e.reportUploadProgress)throw new _(2824,!1);let i={},r;if(r=e.credentials,e.withCredentials&&(r=`include`),e.headers.forEach((o,s)=>i[o]=s.join(`,`)),e.headers.has(hC)||(i[hC]=Dk),!e.headers.has(Qp)){let o=e.detectContentTypeHeader();o!==null&&(i[Qp]=o)}return{body:e.serializeBody(),method:e.method,headers:i,credentials:r,keepalive:e.keepalive,cache:e.cache,priority:e.priority,mode:e.mode,redirect:e.redirect,referrer:e.referrer,integrity:e.integrity,referrerPolicy:e.referrerPolicy}}concatChunks(e,i){let r=new Uint8Array(i),o=0;for(let s of e)r.set(s,o),o+=s.length;return r}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var Jp=class{};function eg(){}function Ik(n){n.then(eg,eg)}function mC(n){throw new _(-2825,!1)}var Nk=/charset=\s*["']?([^;"'\s]+)["']?/i;function pC(n){let t=n.match(Nk);if(t!==null)try{return new TextDecoder(t[1])}catch{}return new TextDecoder}var Mk=new g(``,{factory:()=>!0});var Tk=`XSRF-TOKEN`;var Ak=new g(``,{factory:()=>Tk});var Rk=`X-XSRF-TOKEN`;var kk=new g(``,{factory:()=>Rk});var Ok=(()=>{class n{cookieName=u(Ak);doc=u(M);lastCookieString=``;lastToken=null;parseCount=0;getToken(){let e=this.doc.cookie||``;return e!==this.lastCookieString&&(this.parseCount++,this.lastToken=Fa(e,this.cookieName),this.lastCookieString=e),this.lastToken}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var _C=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵprov=W({token:n,factory:function(i){let r=null;return i?r=new(i||n):r=P(Ok),r},providedIn:`root`})}return n})();function bC(n,t){if(!u(Mk)||n.method===`GET`||n.method===`HEAD`)return t(n);try{let r=u(Po).href,{origin:o}=new URL(r),{origin:s}=new URL(n.url,o);if(o!==s)return t(n)}catch{return t(n)}let e=u(_C).getToken(),i=u(kk);return e!=null&&!n.headers.has(i)&&(n=n.clone({headers:n.headers.set(i,e)})),t(n)}function Pk(n,t){return t(n)}function Fk(n,t,e){return(i,r)=>Ie(e,()=>t(i,o=>n(o,r)))}var SC=new g(``,{factory:()=>[bC]});var wC=new g(``);var CC=new g(``,{factory:()=>!0});var tg=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵprov=W({token:n,factory:function(i){let r=null;return i?r=new(i||n):r=P(Gd),r},providedIn:`root`})}return n})();var qd=(()=>{class n{backend;injector;chain=null;pendingTasks=u(la);contributeToStability=u(CC);constructor(e,i){this.backend=e,this.injector=i}handle(e){if(this.chain===null){let r=this.injector.get(Yd,null,{skipSelf:!0}),o=r!==null&&this.backend===r,s=this.injector.get(wC,[],o?{self:!0}:void 0),a=Array.from(new Set([...this.injector.get(SC),...s]));this.chain=a.reduceRight((c,l)=>Fk(c,l,this.injector),Pk)}let i=this.chain;if(this.contributeToStability){let r=this.pendingTasks.add();return E(()=>i(e,o=>this.backend.handle(o))).pipe(Zi(r))}else return E(()=>i(e,r=>this.backend.handle(r)))}static ɵfac=function(i){return new(i||n)(P(tg),P(_e))};static ɵprov=W({token:n,factory:n.ɵfac,providedIn:`root`})}return n})();var Yd=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵprov=W({token:n,factory:function(i){let r=null;return i?r=new(i||n):r=P(qd),r},providedIn:`root`})}return n})();function Xp(n,t){return p({body:t},n)}var Vo=(()=>{class n{handler;constructor(e){this.handler=e}request(e,i,r={}){let o;if(e instanceof Lo)o=e;else{let c;r.headers instanceof ni?c=r.headers:c=new ni(r.headers);let l;r.params&&(r.params instanceof ti?l=r.params:l=new ti({fromObject:r.params})),o=new Lo(e,i,r.body!==void 0?r.body:null,{headers:c,context:r.context,params:l,reportProgress:r.reportProgress,reportUploadProgress:r.reportUploadProgress,reportDownloadProgress:r.reportDownloadProgress,responseType:r.responseType||`json`,withCredentials:r.withCredentials,transferCache:r.transferCache,keepalive:r.keepalive,priority:r.priority,cache:r.cache,mode:r.mode,redirect:r.redirect,credentials:r.credentials,referrer:r.referrer,referrerPolicy:r.referrerPolicy,integrity:r.integrity,timeout:r.timeout})}let s=F(o).pipe(qi(c=>this.handler.handle(c)));if(e instanceof Lo||r.observe===`events`)return s;let a=s.pipe(re(c=>c instanceof Ua));switch(r.observe||`body`){case`body`:switch(o.responseType){case`arraybuffer`:return a.pipe(H(c=>{if(c.body!==null&&!(c.body instanceof ArrayBuffer))throw new _(2806,!1);return c.body}));case`blob`:return a.pipe(H(c=>{if(c.body!==null&&!(c.body instanceof Blob))throw new _(2807,!1);return c.body}));case`text`:return a.pipe(H(c=>{if(c.body!==null&&typeof c.body!=`string`)throw new _(2808,!1);return c.body}));default:return a.pipe(H(c=>c.body))}case`response`:return a;default:throw new _(2809,!1)}}delete(e,i={}){return this.request(`DELETE`,e,i)}get(e,i={}){return this.request(`GET`,e,i)}head(e,i={}){return this.request(`HEAD`,e,i)}jsonp(e,i){return this.request(`JSONP`,e,{params:new ti().append(i,`JSONP_CALLBACK`),observe:`body`,responseType:`json`})}options(e,i={}){return this.request(`OPTIONS`,e,i)}patch(e,i,r={}){return this.request(`PATCH`,e,Xp(r,i))}post(e,i,r={}){return this.request(`POST`,e,Xp(r,i))}put(e,i,r={}){return this.request(`PUT`,e,Xp(r,i))}static ɵfac=function(i){return new(i||n)(P(Yd))};static ɵprov=W({token:n,factory:n.ɵfac,providedIn:`root`})}return n})();function Lk(...n){let t=[Vo,Gd,qd,{provide:Yd,useExisting:qd},{provide:tg,useFactory:()=>u(Gd)},{provide:SC,useValue:bC,multi:!0}];for(let e of n)t.push(...e.ɵproviders);return Sn(t)}var DC=(()=>{class n{_doc;constructor(e){this._doc=e}getTitle(){return this._doc.title}setTitle(e){this._doc.title=e||``}static ɵfac=function(i){return new(i||n)(P(M))};static ɵprov=W({token:n,factory:n.ɵfac,providedIn:`root`})}return n})();var Ha=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵprov=W({token:n,factory:function(i){let r=null;return i?r=new(i||n):r=P(Vk),r},providedIn:`root`})}return n})();var Vk=(()=>{class n extends Ha{_doc=u(M);sanitize(e,i){if(i==null)return null;switch(e){case ce.NONE:return i;case ce.HTML:return Tn(i,`HTML`)?kt(i):md(this._doc,String(i)).toString();case ce.STYLE:return Tn(i,`Style`)?kt(i):i;case ce.SCRIPT:if(Tn(i,`Script`))return kt(i);throw new _(5200,!1);case ce.URL:return Tn(i,`URL`)?kt(i):Sa(String(i));case ce.RESOURCE_URL:if(Tn(i,`ResourceURL`))return kt(i);throw new _(-5201,!1);default:throw new _(5202,!1)}}bypassSecurityTrustHtml(e){return Ym(e)}bypassSecurityTrustStyle(e){return Zm(e)}bypassSecurityTrustScript(e){return Km(e)}bypassSecurityTrustUrl(e){return Qm(e)}bypassSecurityTrustResourceUrl(e){return Xm(e)}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var q=`primary`;var nc=Symbol(`RouteTitle`);var sg=class{params;constructor(t){this.params=t||{}}has(t){return Object.hasOwn(this.params,t)}get(t){if(this.has(t)){let e=this.params[t];return Array.isArray(e)?e[0]:e}return null}getAll(t){if(this.has(t)){let e=this.params[t];return Array.isArray(e)?e:[e]}return[]}get keys(){return Object.keys(this.params)}};function Tr(n){return new sg(n)}function ng(n,t,e){for(let i=0;i<n.length;i++){let r=n[i],o=t[i];if(r[0]===`:`)e[r.substring(1)]=o;else if(r!==o.path)return!1}return!0}function RC(n,t,e){let i=e.path.split(`/`),r=i.indexOf(`**`);if(r===-1){if(i.length>n.length||e.pathMatch===`full`&&(t.hasChildren()||i.length<n.length))return null;let c={},l=n.slice(0,i.length);return ng(i,l,c)?{consumed:l,posParams:c}:null}if(r!==i.lastIndexOf(`**`))return null;let o=i.slice(0,r),s=i.slice(r+1);if(o.length+s.length>n.length||e.pathMatch===`full`&&t.hasChildren()&&e.path!==`**`)return null;let a={};return!ng(o,n.slice(0,o.length),a)||!ng(s,n.slice(n.length-s.length),a)?null:{consumed:n,posParams:a}}function eu(n){return new Promise((t,e)=>{n.pipe(Vn()).subscribe({next:i=>t(i),error:i=>e(i)})})}function Uk(n,t){if(n.length!==t.length)return!1;for(let e=0;e<n.length;++e)if(!On(n[e],t[e]))return!1;return!0}function On(n,t){let e=n?ag(n):void 0,i=t?ag(t):void 0;if(!e||!i||e.length!=i.length)return!1;let r;for(let o=0;o<e.length;o++)if(r=e[o],!kC(n[r],t[r]))return!1;return!0}function ag(n){return[...Object.keys(n),...Object.getOwnPropertySymbols(n)]}function kC(n,t){if(Array.isArray(n)&&Array.isArray(t)){if(n.length!==t.length)return!1;let e=[...n].sort(),i=[...t].sort();return e.every((r,o)=>i[o]===r)}else return n===t}function Hk(n){return n.length>0?n[n.length-1]:null}function Or(n){return Os(n)?n:Xn(n)?Ee(Promise.resolve(n)):F(n)}function OC(n){return Os(n)?eu(n):Promise.resolve(n)}var zk={exact:FC,subset:LC};var PC={exact:$k,subset:Wk,ignored:()=>!0};var wg={paths:`exact`,fragment:`ignored`,matrixParams:`ignored`,queryParams:`exact`};var zo={paths:`subset`,fragment:`ignored`,matrixParams:`ignored`,queryParams:`subset`};function Cg(n,t,e){let i=n instanceof bt?n:t.parseUrl(n);return x(()=>cg(t.lastSuccessfulNavigation()?.finalUrl??new bt,i,p(p({},zo),e)))}function cg(n,t,e){return zk[e.paths](n.root,t.root,e.matrixParams)&&PC[e.queryParams](n.queryParams,t.queryParams)&&!(e.fragment===`exact`&&n.fragment!==t.fragment)}function $k(n,t){return On(n,t)}function FC(n,t,e){if(!Mr(n.segments,t.segments)||!Qd(n.segments,t.segments,e)||n.numberOfChildren!==t.numberOfChildren)return!1;for(let i in t.children)if(!n.children[i]||!FC(n.children[i],t.children[i],e))return!1;return!0}function Wk(n,t){return Object.keys(t).length<=Object.keys(n).length&&Object.keys(t).every(e=>kC(n[e],t[e]))}function LC(n,t,e){return jC(n,t,t.segments,e)}function jC(n,t,e,i){if(n.segments.length>e.length){let r=n.segments.slice(0,e.length);return!(!Mr(r,e)||t.hasChildren()||!Qd(r,e,i))}else if(n.segments.length===e.length){if(!Mr(n.segments,e)||!Qd(n.segments,e,i))return!1;for(let r in t.children)if(!n.children[r]||!LC(n.children[r],t.children[r],i))return!1;return!0}else{let r=e.slice(0,n.segments.length),o=e.slice(n.segments.length);return!Mr(n.segments,r)||!Qd(n.segments,r,i)||!n.children[q]?!1:jC(n.children[q],t,o,i)}}function Qd(n,t,e){return t.every((i,r)=>PC[e](n[r].parameters,i.parameters))}var bt=class{root;queryParams;fragment;_queryParamMap;constructor(t=new he([],{}),e={},i=null){this.root=t,this.queryParams=e,this.fragment=i}get queryParamMap(){return this._queryParamMap??=Tr(this.queryParams),this._queryParamMap}toString(){return Yk.serialize(this)}};var he=class{segments;children;parent=null;constructor(t,e){this.segments=t,this.children=e,Object.values(e).forEach(i=>i.parent=this)}hasChildren(){return this.numberOfChildren>0}get numberOfChildren(){return Object.keys(this.children).length}toString(){return Xd(this)}};var Ri=class{path;parameters;_parameterMap;constructor(t,e){this.path=t,this.parameters=e}get parameterMap(){return this._parameterMap??=Tr(this.parameters),this._parameterMap}toString(){return BC(this)}};function Gk(n,t){return Mr(n,t)&&n.every((e,i)=>On(e.parameters,t[i].parameters))}function Mr(n,t){return n.length!==t.length?!1:n.every((e,i)=>e.path===t[i].path)}function qk(n,t){let e=[];return Object.entries(n.children).forEach(([i,r])=>{i===q&&(e=e.concat(t(r,i)))}),Object.entries(n.children).forEach(([i,r])=>{i!==q&&(e=e.concat(t(r,i)))}),e}var Zo=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:()=>new ki})}return n})();var ki=class{parse(t){let e=new dg(t);return new bt(e.parseRootSegment(),e.parseQueryParams(),e.parseFragment())}serialize(t){return`${`/${za(t.root,!0)}`}${Qk(t.queryParams)}${typeof t.fragment==`string`?`#${Zk(t.fragment)}`:``}`}};var Yk=new ki;function Xd(n){return n.segments.map(t=>BC(t)).join(`/`)}function za(n,t){if(!n.hasChildren())return Xd(n);if(t){let e=n.children[q]?za(n.children[q],!1):``,i=[];return Object.entries(n.children).forEach(([r,o])=>{r!==q&&i.push(`${r}:${za(o,!1)}`)}),i.length>0?`${e}(${i.join(`//`)})`:e}else{let e=qk(n,(i,r)=>r===q?[za(n.children[q],!1)]:[`${r}:${za(i,!1)}`]);return Object.keys(n.children).length===1&&n.children[q]!=null?`${Xd(n)}/${e[0]}`:`${Xd(n)}/(${e.join(`//`)})`}}function VC(n){return encodeURIComponent(n).replace(/%40/g,`@`).replace(/%3A/gi,`:`).replace(/%24/g,`$`).replace(/%2C/gi,`,`)}function Zd(n){return VC(n).replace(/%3B/gi,`;`)}function Zk(n){return encodeURI(n)}function lg(n){return VC(n).replace(/\(/g,`%28`).replace(/\)/g,`%29`).replace(/%26/gi,`&`)}function Jd(n){return decodeURIComponent(n)}function xC(n){return Jd(n.replace(/\+/g,`%20`))}function BC(n){return`${lg(n.path)}${Kk(n.parameters)}`}function Kk(n){return Object.entries(n).map(([t,e])=>`;${lg(t)}=${lg(e)}`).join(``)}function Qk(n){let t=Object.entries(n).map(([e,i])=>Array.isArray(i)?i.map(r=>`${Zd(e)}=${Zd(r)}`).join(`&`):`${Zd(e)}=${Zd(i)}`).filter(e=>e);return t.length?`?${t.join(`&`)}`:``}var Xk=/^[^\/()?;#]+/;function ig(n){let t=n.match(Xk);return t?t[0]:``}var Jk=/^[^\/()?;=#]+/;function eO(n){let t=n.match(Jk);return t?t[0]:``}var tO=/^[^=?&#]+/;function nO(n){let t=n.match(tO);return t?t[0]:``}var iO=/^[^&#]+/;function rO(n){let t=n.match(iO);return t?t[0]:``}var dg=class{url;remaining;constructor(t){this.url=t,this.remaining=t}parseRootSegment(){for(;this.consumeOptional(`/`););return this.remaining===``||this.peekStartsWith(`?`)||this.peekStartsWith(`#`)?new he([],{}):new he([],this.parseChildren())}parseQueryParams(){let t={};if(this.consumeOptional(`?`))do this.parseQueryParam(t);while(this.consumeOptional(`&`));return t}parseFragment(){return this.consumeOptional(`#`)?decodeURIComponent(this.remaining):null}parseChildren(t=0){if(t>50)throw new _(4010,!1);if(this.remaining===``)return{};this.consumeOptional(`/`);let e=[];for(this.peekStartsWith(`(`)||e.push(this.parseSegment());this.peekStartsWith(`/`)&&!this.peekStartsWith(`//`)&&!this.peekStartsWith(`/(`);)this.capture(`/`),e.push(this.parseSegment());let i={};this.peekStartsWith(`/(`)&&(this.capture(`/`),i=this.parseParens(!0,t));let r={};return this.peekStartsWith(`(`)&&(r=this.parseParens(!1,t)),(e.length>0||Object.keys(i).length>0)&&(r[q]=new he(e,i)),r}parseSegment(){let t=ig(this.remaining);if(t===``&&this.peekStartsWith(`;`))throw new _(4009,!1);return this.capture(t),new Ri(Jd(t),this.parseMatrixParams())}parseMatrixParams(){let t={};for(;this.consumeOptional(`;`);)this.parseParam(t);return t}parseParam(t){let e=eO(this.remaining);if(!e)return;this.capture(e);let i=``;if(this.consumeOptional(`=`)){let r=ig(this.remaining);r&&(i=r,this.capture(i))}t[Jd(e)]=Jd(i)}parseQueryParam(t){let e=nO(this.remaining);if(!e)return;this.capture(e);let i=``;if(this.consumeOptional(`=`)){let s=rO(this.remaining);s&&(i=s,this.capture(i))}let r=xC(e),o=xC(i);if(Object.hasOwn(t,r)){let s=t[r];Array.isArray(s)||(s=[s],t[r]=s),s.push(o)}else t[r]=o}parseParens(t,e){let i=Object.create(null);for(this.capture(`(`);!this.consumeOptional(`)`)&&this.remaining.length>0;){let r=ig(this.remaining),o=this.remaining[r.length];if(o!==`/`&&o!==`)`&&o!==`;`)throw new _(4010,!1);let s;r.indexOf(`:`)>-1?(s=r.slice(0,r.indexOf(`:`)),this.capture(s),this.capture(`:`)):t&&(s=q);let a=this.parseChildren(e+1);i[s??q]=Object.keys(a).length===1&&a[q]?a[q]:new he([],a),this.consumeOptional(`//`)}return i}peekStartsWith(t){return this.remaining.startsWith(t)}consumeOptional(t){return this.peekStartsWith(t)?(this.remaining=this.remaining.substring(t.length),!0):!1}capture(t){if(!this.consumeOptional(t))throw new _(4011,!1)}};function UC(n){return n.segments.length>0?new he([],{[q]:n}):n}function HC(n){let t=Object.create(null);for(let[i,r]of Object.entries(n.children)){let o=HC(r);if(i===q&&o.segments.length===0&&o.hasChildren())for(let[s,a]of Object.entries(o.children))t[s]=a;else(o.segments.length>0||o.hasChildren())&&(t[i]=o)}return oO(new he(n.segments,t))}function oO(n){if(n.numberOfChildren===1&&n.children[q]){let t=n.children[q];return new he(n.segments.concat(t.segments),t.children)}return n}function Oi(n){return n instanceof bt}function zC(n,t,e=null,i=null,r=new ki){return WC($C(n),t,e,i,r)}function $C(n){let t;function e(o){let s={};for(let c of o.children){let l=e(c);s[c.outlet]=l}let a=new he(o.url,s);return o===n&&(t=a),a}let r=UC(e(n.root));return t??r}function WC(n,t,e,i,r){let o=n;for(;o.parent;)o=o.parent;if(t.length===0)return rg(o,o,o,e,i,r);let s=sO(t);if(s.toRoot())return rg(o,o,new he([],{}),e,i,r);let a=aO(s,o,n),c=a.processChildren?Wa(a.segmentGroup,a.index,s.commands):qC(a.segmentGroup,a.index,s.commands);return rg(o,a.segmentGroup,c,e,i,r)}function tu(n){return typeof n==`object`&&n!=null&&!n.outlets&&!n.segmentPath}function Ya(n){return typeof n==`object`&&n!=null&&n.outlets}function IC(n,t,e){n||=`ɵ`;let i=new bt;return i.queryParams={[n]:t},e.parse(e.serialize(i)).queryParams[n]}function rg(n,t,e,i,r,o){let s={};for(let[l,d]of Object.entries(i??{}))s[l]=Array.isArray(d)?d.map(f=>IC(l,f,o)):IC(l,d,o);let a;n===t?a=e:a=GC(n,t,e);return new bt(UC(HC(a)),s,r)}function GC(n,t,e){let i=Object.create(null);return Object.entries(n.children).forEach(([r,o])=>{o===t?i[r]=e:i[r]=GC(o,t,e)}),new he(n.segments,i)}var nu=class{isAbsolute;numberOfDoubleDots;commands;constructor(t,e,i){if(this.isAbsolute=t,this.numberOfDoubleDots=e,this.commands=i,t&&i.length>0&&tu(i[0]))throw new _(4003,!1);let r=i.find(Ya);if(r&&r!==Hk(i))throw new _(4004,!1)}toRoot(){return this.isAbsolute&&this.commands.length===1&&this.commands[0]==`/`}};function sO(n){if(typeof n[0]==`string`&&n.length===1&&n[0]===`/`)return new nu(!0,0,n);let t=0,e=!1,i=n.reduce((r,o,s)=>{if(typeof o==`object`&&o!=null){if(o.outlets){let a={};return Object.entries(o.outlets).forEach(([c,l])=>{a[c]=typeof l==`string`?l.split(`/`):l}),[...r,{outlets:a}]}if(o.segmentPath)return[...r,o.segmentPath]}return typeof o!=`string`?[...r,o]:s===0?(o.split(`/`).forEach((a,c)=>{c==0&&a===`.`||(c==0&&a===``?e=!0:a===`..`?t++:a!=``&&r.push(a))}),r):[...r,o]},[]);return new nu(e,t,i)}var Uo=class{segmentGroup;processChildren;index;constructor(t,e,i){this.segmentGroup=t,this.processChildren=e,this.index=i}};function aO(n,t,e){if(n.isAbsolute)return new Uo(t,!0,0);if(!e)return new Uo(t,!1,NaN);if(e.parent===null)return new Uo(e,!0,0);let i=tu(n.commands[0])?0:1;return cO(e,e.segments.length-1+i,n.numberOfDoubleDots)}function cO(n,t,e){let i=n,r=t,o=e;for(;o>r;){if(o-=r,i=i.parent,!i)throw new _(4005,!1);r=i.segments.length}return new Uo(i,!1,r-o)}function lO(n){return Ya(n[0])?n[0].outlets:{[q]:n}}function qC(n,t,e){if(n??=new he([],{}),n.segments.length===0&&n.hasChildren())return Wa(n,t,e);let i=dO(n,t,e),r=e.slice(i.commandIndex);if(i.match&&i.pathIndex<n.segments.length){let o=new he(n.segments.slice(0,i.pathIndex),{});return o.children[q]=new he(n.segments.slice(i.pathIndex),n.children),Wa(o,0,r)}else return i.match&&r.length===0?new he(n.segments,{}):i.match&&!n.hasChildren()?ug(n,t,e):i.match?Wa(n,0,r):ug(n,t,e)}function Wa(n,t,e){if(e.length===0)return new he(n.segments,{});{let i=lO(e),r=Object.create(null);if(Object.keys(i).some(o=>o!==q)&&n.children[q]&&n.numberOfChildren===1&&n.children[q].segments.length===0){let o=Wa(n.children[q],t,e);return new he(n.segments,o.children)}return Object.entries(i).forEach(([o,s])=>{typeof s==`string`&&(s=[s]),s!==null&&(r[o]=qC(n.children[o],t,s))}),Object.entries(n.children).forEach(([o,s])=>{i[o]===void 0&&(r[o]=s)}),new he(n.segments,r)}}function dO(n,t,e){let i=0,r=t,o={match:!1,pathIndex:0,commandIndex:0};for(;r<n.segments.length;){if(i>=e.length)return o;let s=n.segments[r],a=e[i];if(Ya(a))break;let c=`${a}`,l=i<e.length-1?e[i+1]:null;if(r>0&&c===void 0)break;if(c&&l&&typeof l==`object`&&l.outlets===void 0){if(!MC(c,l,s))return o;i+=2}else{if(!MC(c,{},s))return o;i++}r++}return{match:!0,pathIndex:r,commandIndex:i}}function ug(n,t,e){let i=n.segments.slice(0,t),r=0;for(;r<e.length;){let o=e[r];if(Ya(o))return new he(i,uO(o.outlets));if(r===0&&tu(e[0])){let c=n.segments[t];i.push(new Ri(c.path,NC(e[0]))),r++;continue}let s=Ya(o)?o.outlets[q]:`${o}`,a=r<e.length-1?e[r+1]:null;s&&a&&tu(a)?(i.push(new Ri(s,NC(a))),r+=2):(i.push(new Ri(s,{})),r++)}return new he(i,{})}function uO(n){let t={};return Object.entries(n).forEach(([e,i])=>{typeof i==`string`&&(i=[i]),i!==null&&(t[e]=ug(new he([],{}),0,i))}),t}function NC(n){let t={};return Object.entries(n).forEach(([e,i])=>t[e]=`${i}`),t}function MC(n,t,e){return n==e.path&&On(t,e.parameters)}var Ga=`imperative`;var Xe=(function(n){return n[n.NavigationStart=0]=`NavigationStart`,n[n.NavigationEnd=1]=`NavigationEnd`,n[n.NavigationCancel=2]=`NavigationCancel`,n[n.NavigationError=3]=`NavigationError`,n[n.RoutesRecognized=4]=`RoutesRecognized`,n[n.ResolveStart=5]=`ResolveStart`,n[n.ResolveEnd=6]=`ResolveEnd`,n[n.GuardsCheckStart=7]=`GuardsCheckStart`,n[n.GuardsCheckEnd=8]=`GuardsCheckEnd`,n[n.RouteConfigLoadStart=9]=`RouteConfigLoadStart`,n[n.RouteConfigLoadEnd=10]=`RouteConfigLoadEnd`,n[n.ChildActivationStart=11]=`ChildActivationStart`,n[n.ChildActivationEnd=12]=`ChildActivationEnd`,n[n.ActivationStart=13]=`ActivationStart`,n[n.ActivationEnd=14]=`ActivationEnd`,n[n.Scroll=15]=`Scroll`,n[n.NavigationSkipped=16]=`NavigationSkipped`,n})(Xe||{});var Ft=class{id;url;constructor(t,e){this.id=t,this.url=e}};var Ar=class extends Ft{type=Xe.NavigationStart;navigationTrigger;restoredState;constructor(t,e,i=`imperative`,r=null){super(t,e),this.navigationTrigger=i,this.restoredState=r}toString(){return`NavigationStart(id: ${this.id}, url: '${this.url}')`}};var Lt=class extends Ft{urlAfterRedirects;type=Xe.NavigationEnd;constructor(t,e,i){super(t,e),this.urlAfterRedirects=i}toString(){return`NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`}};var ht=(function(n){return n[n.Redirect=0]=`Redirect`,n[n.SupersededByNewNavigation=1]=`SupersededByNewNavigation`,n[n.NoDataFromResolver=2]=`NoDataFromResolver`,n[n.GuardRejected=3]=`GuardRejected`,n[n.Aborted=4]=`Aborted`,n})(ht||{});var Za=(function(n){return n[n.IgnoredSameUrlNavigation=0]=`IgnoredSameUrlNavigation`,n[n.IgnoredByUrlHandlingStrategy=1]=`IgnoredByUrlHandlingStrategy`,n})(Za||{});var qt=class extends Ft{reason;code;type=Xe.NavigationCancel;constructor(t,e,i,r){super(t,e),this.reason=i,this.code=r}toString(){return`NavigationCancel(id: ${this.id}, url: '${this.url}')`}};function YC(n){return n instanceof qt&&(n.code===ht.Redirect||n.code===ht.SupersededByNewNavigation)}var ri=class extends Ft{reason;code;type=Xe.NavigationSkipped;constructor(t,e,i,r){super(t,e),this.reason=i,this.code=r}};var Rr=class extends Ft{error;target;type=Xe.NavigationError;constructor(t,e,i,r){super(t,e),this.error=i,this.target=r}toString(){return`NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`}};var Ka=class extends Ft{urlAfterRedirects;state;type=Xe.RoutesRecognized;constructor(t,e,i,r){super(t,e),this.urlAfterRedirects=i,this.state=r}toString(){return`RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}};var iu=class extends Ft{urlAfterRedirects;state;type=Xe.GuardsCheckStart;constructor(t,e,i,r){super(t,e),this.urlAfterRedirects=i,this.state=r}toString(){return`GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}};var ru=class extends Ft{urlAfterRedirects;state;shouldActivate;type=Xe.GuardsCheckEnd;constructor(t,e,i,r,o){super(t,e),this.urlAfterRedirects=i,this.state=r,this.shouldActivate=o}toString(){return`GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`}};var ou=class extends Ft{urlAfterRedirects;state;type=Xe.ResolveStart;constructor(t,e,i,r){super(t,e),this.urlAfterRedirects=i,this.state=r}toString(){return`ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}};var su=class extends Ft{urlAfterRedirects;state;type=Xe.ResolveEnd;constructor(t,e,i,r){super(t,e),this.urlAfterRedirects=i,this.state=r}toString(){return`ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}};var au=class{route;type=Xe.RouteConfigLoadStart;constructor(t){this.route=t}toString(){return`RouteConfigLoadStart(path: ${this.route.path})`}};var cu=class{route;type=Xe.RouteConfigLoadEnd;constructor(t){this.route=t}toString(){return`RouteConfigLoadEnd(path: ${this.route.path})`}};var lu=class{snapshot;type=Xe.ChildActivationStart;constructor(t){this.snapshot=t}toString(){return`ChildActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||``}')`}};var du=class{snapshot;type=Xe.ChildActivationEnd;constructor(t){this.snapshot=t}toString(){return`ChildActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||``}')`}};var uu=class{snapshot;type=Xe.ActivationStart;constructor(t){this.snapshot=t}toString(){return`ActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||``}')`}};var fu=class{snapshot;type=Xe.ActivationEnd;constructor(t){this.snapshot=t}toString(){return`ActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||``}')`}};var $o=class{};var Qa=class{};var Wo=class{url;navigationBehaviorOptions;constructor(t,e){this.url=t,this.navigationBehaviorOptions=e}};function fO(n){return!(n instanceof $o)&&!(n instanceof Wo)&&!(n instanceof Qa)}var hu=class{rootInjector;outlet=null;route=null;children;attachRef=null;get injector(){return this.route?.snapshot._environmentInjector??this.rootInjector}constructor(t){this.rootInjector=t,this.children=new kr(this.rootInjector)}resetChildren(){this.children=new kr(this.rootInjector)}};var kr=(()=>{class n{rootInjector;contexts=new Map;constructor(e){this.rootInjector=e}onChildOutletCreated(e,i){let r=this.getOrCreateContext(e);r.outlet=i,this.contexts.set(e,r)}onChildOutletDestroyed(e){let i=this.getContext(e);i&&(i.outlet=null,i.attachRef=null)}onOutletDeactivated(){let e=this.contexts;return this.contexts=new Map,e}onOutletReAttached(e){this.contexts=e}getOrCreateContext(e){let i=this.getContext(e);return i||(i=new hu(this.rootInjector),this.contexts.set(e,i)),i}getContext(e){return this.contexts.get(e)||null}static ɵfac=function(i){return new(i||n)(P(_e))};static ɵprov=W({token:n,factory:n.ɵfac,providedIn:`root`})}return n})();var mu=class{_root;constructor(t){this._root=t}get root(){return this._root.value}parent(t){let e=this.pathFromRoot(t);return e.length>1?e[e.length-2]:null}children(t){let e=fg(t,this._root);return e?e.children.map(i=>i.value):[]}firstChild(t){let e=fg(t,this._root);return e&&e.children.length>0?e.children[0].value:null}siblings(t){let e=hg(t,this._root);return e.length<2?[]:e[e.length-2].children.map(r=>r.value).filter(r=>r!==t)}pathFromRoot(t){return hg(t,this._root).map(e=>e.value)}};function fg(n,t){if(n===t.value)return t;for(let e of t.children){let i=fg(n,e);if(i)return i}return null}function hg(n,t){if(n===t.value)return[t];for(let e of t.children){let i=hg(n,e);if(i.length)return i.unshift(t),i}return[]}var Pt=class{value;children;constructor(t,e){this.value=t,this.children=e}toString(){return`TreeNode(${this.value})`}};function Bo(n){let t={};return n&&n.children.forEach(e=>t[e.value.outlet]=e),t}var Xa=class extends mu{snapshot;constructor(t,e){super(t),this.snapshot=e,Eg(this,t)}toString(){return this.snapshot.toString()}};function ZC(n,t){let e=hO(n,t),i=new He([new Ri(``,{})]),r=new He({}),o=new He({}),c=new oi(i,r,new He({}),new He(``),o,q,n,e.root);return c.snapshot=e.root,new Xa(new Pt(c,[]),e)}function hO(n,t){return new Ja(``,new Pt(new Go([],{},{},``,{},q,n,null,{},t),[]))}var oi=class{urlSubject;paramsSubject;queryParamsSubject;fragmentSubject;dataSubject;outlet;component;snapshot;_futureSnapshot;_routerState;_paramMap;_queryParamMap;title;url;params;queryParams;fragment;data;resources;_localInjector;pending;paramsSignal;queryParamsSignal;paramMapSignal;queryParamMapSignal;fragmentSignal;dataSignal;constructor(t,e,i,r,o,s,a,c){this.urlSubject=t,this.paramsSubject=e,this.queryParamsSubject=i,this.fragmentSubject=r,this.dataSubject=o,this.outlet=s,this.component=a,this._futureSnapshot=c,this.title=this.dataSubject?.pipe(H(l=>l[nc]))??F(void 0),this.url=t,this.params=e,this.queryParams=i,this.fragment=r,this.data=o}get routeConfig(){return this._futureSnapshot.routeConfig}get root(){return this._routerState.root}get parent(){return this._routerState.parent(this)}get firstChild(){return this._routerState.firstChild(this)}get children(){return this._routerState.children(this)}get pathFromRoot(){return this._routerState.pathFromRoot(this)}get paramMap(){return this._paramMap??=this.params.pipe(H(t=>Tr(t))),this._paramMap}get queryParamMap(){return this._queryParamMap??=this.queryParams.pipe(H(t=>Tr(t))),this._queryParamMap}toString(){return this.snapshot?this.snapshot.toString():`Future(${this._futureSnapshot})`}_setPending(t){this._futureSnapshot=t,this.pending?.set(!0)}};var mO=`always`;function Dg(n,t,e){let i,{routeConfig:r}=n;return t!==null&&(e===`always`||r?.path===``||!t.component&&!t.routeConfig?.loadComponent)?i={params:p(p({},t.params),n.params),data:p(p({},t.data),n.data),resolve:p(p(p(p({},n.data),t.data),r?.data),n._resolvedData)}:i={params:p({},n.params),data:p({},n.data),resolve:p(p({},n.data),n._resolvedData??{})},r&&QC(r)&&(i.resolve[nc]=r.title),i}var Go=class{url;params;queryParams;fragment;data;outlet;component;routeConfig;_resolve;_resolvedData;_routerState;_paramMap;_queryParamMap;_environmentInjector;resources;get title(){return this.data?.[nc]}constructor(t,e,i,r,o,s,a,c,l,d){this.url=t,this.params=e,this.queryParams=i,this.fragment=r,this.data=o,this.outlet=s,this.component=a,this.routeConfig=c,this._resolve=l,this._environmentInjector=d}get root(){return this._routerState.root}get parent(){return this._routerState.parent(this)}get firstChild(){return this._routerState.firstChild(this)}get children(){return this._routerState.children(this)}get pathFromRoot(){return this._routerState.pathFromRoot(this)}get paramMap(){return this._paramMap??=Tr(this.params),this._paramMap}get queryParamMap(){return this._queryParamMap??=Tr(this.queryParams),this._queryParamMap}toString(){return`Route(url:'${this.url.map(i=>i.toString()).join(`/`)}', path:'${this.routeConfig?this.routeConfig.path:``}')`}};var Ja=class extends mu{url;constructor(t,e){super(e),this.url=t,Eg(this,e)}toString(){return KC(this._root)}};function Eg(n,t){t.value._routerState=n,t.children.forEach(e=>Eg(n,e))}function KC(n){let t=n.children.length>0?` { ${n.children.map(KC).join(`, `)} } `:``;return`${n.value}${t}`}function og(n){if(n.snapshot){let t=n.snapshot,e=n._futureSnapshot;n.snapshot=e,On(t.queryParams,e.queryParams)||n.queryParamsSubject.next(e.queryParams),t.fragment!==e.fragment&&n.fragmentSubject.next(e.fragment),On(t.params,e.params)||n.paramsSubject.next(e.params),Uk(t.url,e.url)||n.urlSubject.next(e.url),On(t.data,e.data)||n.dataSubject.next(e.data)}else n.snapshot=n._futureSnapshot,n.dataSubject.next(n._futureSnapshot.data)}function mg(n,t){let e=On(n.params,t.params)&&Gk(n.url,t.url),i=!n.parent!=!t.parent;return e&&!i&&(!n.parent||mg(n.parent,t.parent))}function QC(n){return typeof n.title==`string`||n.title===null}var XC=new g(``);var xg=(()=>{class n{activated=null;get activatedComponentRef(){return this.activated}_activatedRoute=null;name=q;activateEvents=new z;deactivateEvents=new z;attachEvents=new z;detachEvents=new z;routerOutletData=Mi();parentContexts=u(kr);location=u(it);changeDetector=u(Qe);inputBinder=u(yu,{optional:!0});supportsBindingToComponentInputs=!0;ngOnChanges(e){if(e.name){let{firstChange:i,previousValue:r}=e.name;if(i)return;this.isTrackedInParentContexts(r)&&(this.deactivate(),this.parentContexts.onChildOutletDestroyed(r)),this.initializeOutletWithName()}}ngOnDestroy(){this.isTrackedInParentContexts(this.name)&&this.parentContexts.onChildOutletDestroyed(this.name),this.inputBinder?.unsubscribeFromRouteData(this)}isTrackedInParentContexts(e){return this.parentContexts.getContext(e)?.outlet===this}ngOnInit(){this.initializeOutletWithName()}initializeOutletWithName(){if(this.parentContexts.onChildOutletCreated(this.name,this),this.activated)return;let e=this.parentContexts.getContext(this.name);e?.route&&(e.attachRef?this.attach(e.attachRef,e.route):this.activateWith(e.route,e.injector))}get isActivated(){return!!this.activated}get component(){if(!this.activated)throw new _(4012,!1);return this.activated.instance}get activatedRoute(){if(!this.activated)throw new _(4012,!1);return this._activatedRoute}get activatedRouteData(){return this._activatedRoute?this._activatedRoute.snapshot.data:{}}detach(){if(!this.activated)throw new _(4012,!1);this.location.detach();let e=this.activated;return this.activated=null,this._activatedRoute=null,this.detachEvents.emit(e.instance),e}attach(e,i){this.activated=e,this._activatedRoute=i,this.location.insert(e.hostView),this.inputBinder?.bindActivatedRouteToOutletComponent(this,this.location.injector),this.attachEvents.emit(e.instance)}deactivate(){if(this.activated){let e=this.component;this.activated.destroy(),this.activated=null,this._activatedRoute=null,this.deactivateEvents.emit(e)}}activateWith(e,i){if(this.isActivated)throw new _(4013,!1);this._activatedRoute=e;let r=this.location,s=e.snapshot.component,a=this.parentContexts.getOrCreateContext(this.name).children,c=new pg(e,a,r.injector,this.routerOutletData);this.activated=r.createComponent(s,{index:r.length,injector:c,environmentInjector:i}),this.changeDetector.markForCheck(),this.inputBinder?.bindActivatedRouteToOutletComponent(this,this.location.injector),this.activateEvents.emit(this.activated.instance)}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`router-outlet`]],inputs:{name:`name`,routerOutletData:[1,`routerOutletData`]},outputs:{activateEvents:`activate`,deactivateEvents:`deactivate`,attachEvents:`attach`,detachEvents:`detach`},exportAs:[`outlet`],features:[Be]})}return n})();var pg=class{route;childContexts;parent;outletData;constructor(t,e,i,r){this.route=t,this.childContexts=e,this.parent=i,this.outletData=r}get(t,e){return t===oi?this.route:t===kr?this.childContexts:t===XC?this.outletData:this.parent.get(t,e)}};var yu=new g(``);var Ig=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`ng-component`]],exportAs:[`emptyRouterOutlet`],decls:1,vars:0,template:function(i,r){i&1&&rt(0,`router-outlet`)},dependencies:[xg],encapsulation:2,changeDetection:1})}return n})();function Ng(n){let t=n.children&&n.children.map(Ng),e=t?S(p({},n),{children:t}):p({},n);return!e.component&&!e.loadComponent&&(t||e.loadChildren)&&e.outlet&&e.outlet!==q&&(e.component=Ig),e}function pO(n,t,e){let i=new Set;return{newlyCreatedRoutes:i,state:new Xa(ec(n,t._root,e?e._root:void 0,i),t)}}function ec(n,t,e,i){if(e&&n.shouldReuseRoute(t.value,e.value.snapshot)){let r=e.value;r._setPending(t.value);return new Pt(r,gO(n,t,e,i))}else{if(n.shouldAttach(t.value)){let s=n.retrieve(t.value);if(s!==null){let a=s.route;return a.value._setPending(t.value),a.children=t.children.map(c=>ec(n,c,void 0,i)),a}}let r=vO(t.value);r._setPending(t.value),i.add(r);return new Pt(r,t.children.map(s=>ec(n,s,void 0,i)))}}function gO(n,t,e,i){return t.children.map(r=>{for(let o of e.children)if(n.shouldReuseRoute(r.value,o.value.snapshot))return ec(n,r,o,i);return ec(n,r,void 0,i)})}function vO(n){return new oi(new He(n.url),new He(n.params),new He(n.queryParams),new He(n.fragment),new He(n.data),n.outlet,n.component,n)}var qo=class{redirectTo;navigationBehaviorOptions;constructor(t,e){this.redirectTo=t,this.navigationBehaviorOptions=e}};var JC=`ngNavigationCancelingError`;function pu(n,t){let{redirectTo:e,navigationBehaviorOptions:i}=Oi(t)?{redirectTo:t,navigationBehaviorOptions:void 0}:t,r=eD(!1,ht.Redirect);return r.url=e,r.navigationBehaviorOptions=i,r}function eD(n,t){let e=new Error(`NavigationCancelingError: ${n||``}`);return e[JC]=!0,e.cancellationCode=t,e}function yO(n){return tD(n)&&Oi(n.url)}function tD(n){return!!n&&n[JC]}var gg=class{routeReuseStrategy;futureState;currState;forwardEvent;inputBindingEnabled;constructor(t,e,i,r,o){this.routeReuseStrategy=t,this.futureState=e,this.currState=i,this.forwardEvent=r,this.inputBindingEnabled=o}activate(t){let e=this.futureState._root,i=this.currState?this.currState._root:null;this.deactivateChildRoutes(e,i,t),og(this.futureState.root),this.activateChildRoutes(e,i,t)}deactivateChildRoutes(t,e,i){let r=Bo(e);t.children.forEach(o=>{let s=o.value.outlet;this.deactivateRoutes(o,r[s],i),delete r[s]}),Object.values(r).forEach(o=>{this.deactivateRouteAndItsChildren(o,i)})}deactivateRoutes(t,e,i){let r=t.value,o=e?e.value:null;if(r===o)if(r.component){let s=i.getContext(r.outlet);s&&this.deactivateChildRoutes(t,e,s.children)}else this.deactivateChildRoutes(t,e,i);else o&&this.deactivateRouteAndItsChildren(e,i)}deactivateRouteAndItsChildren(t,e){t.value.component&&this.routeReuseStrategy.shouldDetach(t.value.snapshot)?this.detachAndStoreRouteSubtree(t,e):this.deactivateRouteAndOutlet(t,e)}detachAndStoreRouteSubtree(t,e){let i=e.getContext(t.value.outlet),r=i&&t.value.component?i.children:e,o=Bo(t);for(let s of Object.values(o))this.deactivateRouteAndItsChildren(s,r);if(i&&i.outlet){let s=i.outlet.detach(),a=i.children.contexts;i.resetChildren(),this.routeReuseStrategy.store(t.value.snapshot,{componentRef:s,route:t,contexts:a})}}deactivateRouteAndOutlet(t,e){let i=e.getContext(t.value.outlet),r=i&&t.value.component?i.children:e,o=Bo(t);for(let s of Object.values(o))this.deactivateRouteAndItsChildren(s,r);i&&(i.outlet&&(i.outlet.deactivate(),i.children.onOutletDeactivated()),i.attachRef=null,i.route=null),t.value._localInjector?.destroy()}activateChildRoutes(t,e,i){let r=Bo(e);t.children.forEach(o=>{this.activateRoutes(o,r[o.value.outlet],i),this.forwardEvent(new fu(o.value.snapshot))}),t.children.length&&this.forwardEvent(new du(t.value.snapshot))}activateRoutes(t,e,i){let r=t.value,o=e?e.value:null;if(og(r),r===o)if(r.component){let s=i.getOrCreateContext(r.outlet);this.activateChildRoutes(t,e,s.children)}else this.activateChildRoutes(t,e,i);else if(r.component){let s=i.getOrCreateContext(r.outlet);if(this.routeReuseStrategy.shouldAttach(r.snapshot)){let a=this.routeReuseStrategy.retrieve(r.snapshot);this.routeReuseStrategy.store(r.snapshot,null),s.children.onOutletReAttached(a.contexts),s.attachRef=a.componentRef,s.route=a.route.value,s.outlet&&s.outlet.attach(a.componentRef,a.route.value),og(a.route.value),this.activateChildRoutes(t,null,s.children)}else s.attachRef=null,s.route=r,s.outlet&&s.outlet.activateWith(r,s.injector),this.activateChildRoutes(t,null,s.children)}else this.activateChildRoutes(t,null,i)}};var gu=class{path;route;constructor(t){this.path=t,this.route=this.path[this.path.length-1]}};var Ho=class{component;route;constructor(t,e){this.component=t,this.route=e}};function _O(n,t,e){let i=n._root;return $a(i,t?t._root:null,e,[i.value])}function bO(n){let t=n.routeConfig?n.routeConfig.canActivateChild:null;return!t||t.length===0?null:{node:n,guards:t}}function Ko(n,t){let e=Symbol(),i=t.get(n,e);return i===e?typeof n==`function`&&!ph(n)?n:t.get(n):i}function $a(n,t,e,i,r={canDeactivateChecks:[],canActivateChecks:[]}){let o=Bo(t);return n.children.forEach(s=>{SO(s,o[s.value.outlet],e,i.concat([s.value]),r),delete o[s.value.outlet]}),Object.entries(o).forEach(([s,a])=>qa(a,e.getContext(s),e,r)),r}function SO(n,t,e,i,r={canDeactivateChecks:[],canActivateChecks:[]}){let o=n.value,s=t?t.value:null,a=e?e.getContext(n.value.outlet):null;if(s&&o.routeConfig===s.routeConfig){let c=wO(s,o,o.routeConfig.runGuardsAndResolvers);c?r.canActivateChecks.push(new gu(i)):(o.data=s.data,o._resolvedData=s._resolvedData),o.component?$a(n,t,a?a.children:null,i,r):$a(n,t,e,i,r),c&&a&&a.outlet&&a.outlet.isActivated&&r.canDeactivateChecks.push(new Ho(a.outlet.component,s))}else s&&qa(t,a,e,r),r.canActivateChecks.push(new gu(i)),o.component?$a(n,null,a?a.children:null,i,r):$a(n,null,e,i,r);return r}function wO(n,t,e){if(typeof e==`function`)return Ie(t._environmentInjector,()=>e(n,t));switch(e){case`pathParamsChange`:return!Mr(n.url,t.url);case`pathParamsOrQueryParamsChange`:return!Mr(n.url,t.url)||!On(n.queryParams,t.queryParams);case`always`:return!0;case`paramsOrQueryParamsChange`:return!mg(n,t)||!On(n.queryParams,t.queryParams);default:return!mg(n,t)}}function qa(n,t,e,i){let r=Bo(n),o=n.value;Object.entries(r).forEach(([s,a])=>{o.component?t?qa(a,t.children.getContext(s),t.children,i):qa(a,null,null,i):qa(a,e?e.getContext(s):null,e,i)}),o.component?t&&t.outlet&&t.outlet.isActivated?i.canDeactivateChecks.push(new Ho(t.outlet.component,o)):i.canDeactivateChecks.push(new Ho(null,o)):i.canDeactivateChecks.push(new Ho(null,o))}function ic(n){return typeof n==`function`}function CO(n){return typeof n==`boolean`}function DO(n){return n&&ic(n.canLoad)}function EO(n){return n&&ic(n.canActivate)}function xO(n){return n&&ic(n.canActivateChild)}function IO(n){return n&&ic(n.canDeactivate)}function NO(n){return n&&ic(n.canMatch)}function nD(n){return n instanceof Ln||n?.name===`EmptyError`}var Kd=Symbol(`INITIAL_VALUE`);function Yo(){return et(n=>Ps(n.map(t=>t.pipe(xe(1),st(Kd)))).pipe(H(t=>{for(let e of t)if(e!==!0){if(e===Kd)return Kd;if(e===!1||MO(e))return e}return!0}),re(t=>t!==Kd),xe(1)))}function MO(n){return Oi(n)||n instanceof qo}function iD(n){return n.aborted?F(void 0).pipe(xe(1)):new V(t=>{let e=()=>{t.next(),t.complete()};return n.addEventListener(`abort`,e),()=>n.removeEventListener(`abort`,e)})}function rD(n){return at(iD(n))}function TO(n){return Ye(t=>{let{targetSnapshot:e,currentSnapshot:i,guards:{canActivateChecks:r,canDeactivateChecks:o}}=t;return o.length===0&&r.length===0?F(S(p({},t),{guardsResult:!0})):AO(o,e,i).pipe(Ye(s=>s&&CO(s)?RO(e,r,n):F(s)),H(s=>S(p({},t),{guardsResult:s})))})}function AO(n,t,e){return Ee(n).pipe(Ye(i=>LO(i.component,i.route,e,t)),Vn(i=>i!==!0,!0))}function RO(n,t,e){return Ee(t).pipe(qi(i=>gn(OO(i.route.parent,e),kO(i.route,e),FO(n,i.path),PO(n,i.route))),Vn(i=>i!==!0,!0))}function kO(n,t){return n!==null&&t&&t(new uu(n)),F(!0)}function OO(n,t){return n!==null&&t&&t(new lu(n)),F(!0)}function PO(n,t){let e=t.routeConfig?t.routeConfig.canActivate:null;if(!e||e.length===0)return F(!0);return F(e.map(r=>jn(()=>{let o=t._environmentInjector,s=Ko(r,o);return Or(EO(s)?s.canActivate(t,n):Ie(o,()=>s(t,n))).pipe(Vn())}))).pipe(Yo())}function FO(n,t){let e=t[t.length-1];return F(t.slice(0,t.length-1).reverse().map(o=>bO(o)).filter(o=>o!==null).map(o=>jn(()=>{return F(o.guards.map(a=>{let c=o.node._environmentInjector,l=Ko(a,c);return Or(xO(l)?l.canActivateChild(e,n):Ie(c,()=>l(e,n))).pipe(Vn())})).pipe(Yo())}))).pipe(Yo())}function LO(n,t,e,i){let r=t&&t.routeConfig?t.routeConfig.canDeactivate:null;if(!r||r.length===0)return F(!0);return F(r.map(s=>{let a=t._environmentInjector,c=Ko(s,a);return Or(IO(c)?c.canDeactivate(n,t,e,i):Ie(a,()=>c(n,t,e,i))).pipe(Vn())})).pipe(Yo())}function jO(n,t,e,i,r){let o=t.canLoad;if(o===void 0||o.length===0)return F(!0);return F(o.map(a=>{let c=Ko(a,n),d=Or(DO(c)?c.canLoad(t,e):Ie(n,()=>c(t,e)));return r?d.pipe(rD(r)):d})).pipe(Yo(),oD(i))}function oD(n){return kc(Ze(t=>{if(typeof t!=`boolean`)throw pu(n,t)}),H(t=>t===!0))}function VO(n,t,e,i,r,o){let s=t.canMatch;if(!s||s.length===0)return F(!0);return F(s.map(c=>{let l=Ko(c,n);return Or(NO(l)?l.canMatch(t,e,r):Ie(n,()=>l(t,e,r))).pipe(rD(o))})).pipe(Yo(),oD(i))}var ii=class n extends Error{segmentGroup;constructor(t){super(),this.segmentGroup=t||null,Object.setPrototypeOf(this,n.prototype)}};var tc=class n extends Error{urlTree;constructor(t){super(),this.urlTree=t,Object.setPrototypeOf(this,n.prototype)}};function BO(n){throw new _(4e3,!1)}function UO(n){throw eD(!1,ht.GuardRejected)}var vg=class{urlSerializer;urlTree;constructor(t,e){this.urlSerializer=t,this.urlTree=e}async lineralizeSegments(t,e){let i=[],r=e.root;for(;;){if(i=i.concat(r.segments),r.numberOfChildren===0)return i;if(r.numberOfChildren>1||!r.children[q])throw BO(`${t.redirectTo}`);r=r.children[q]}}async applyRedirectCommands(t,e,i,r,o){let s=await HO(e,r,o);if(s instanceof bt)throw new tc(s);let a=this.applyRedirectCreateUrlTree(s,this.urlSerializer.parse(s),t,i);if(s[0]===`/`)throw new tc(a);return a}applyRedirectCreateUrlTree(t,e,i,r){return new bt(this.createSegmentGroup(t,e.root,i,r),this.createQueryParams(e.queryParams,this.urlTree.queryParams),e.fragment)}createQueryParams(t,e){let i={};return Object.entries(t).forEach(([r,o])=>{if(typeof o==`string`&&o[0]===`:`){let a=o.substring(1);i[r]=e[a]}else i[r]=o}),i}createSegmentGroup(t,e,i,r){let o=this.createSegments(t,e.segments,i,r),s=Object.create(null);return Object.entries(e.children).forEach(([a,c])=>{s[a]=this.createSegmentGroup(t,c,i,r)}),new he(o,s)}createSegments(t,e,i,r){return e.map(o=>o.path[0]===`:`?this.findPosParam(t,o,r):this.findOrReturn(o,i))}findPosParam(t,e,i){let r=i[e.path.substring(1)];if(!r)throw new _(4001,!1);return r}findOrReturn(t,e){let i=0;for(let r of e){if(r.path===t.path)return e.splice(i),r;i++}return t}};function HO(n,t,e){if(typeof n==`string`)return Promise.resolve(n);let i=n;return eu(Or(Ie(e,()=>i(t))))}function zO(n,t){return n.providers&&!n._injector&&(n._injector=Na(n.providers,t,`Route: ${n.path}`)),n._injector??t}function fn(n){return n.outlet||q}function $O(n,t){let e=n.filter(i=>fn(i)===t);return e.push(...n.filter(i=>fn(i)!==t)),e}var yg={matched:!1,consumedSegments:[],remainingSegments:[],parameters:{},positionalParamSegments:{}};function sD(n){return{routeConfig:n.routeConfig,url:n.url,params:n.params,queryParams:n.queryParams,fragment:n.fragment,data:n.data,outlet:n.outlet,title:n.title,paramMap:n.paramMap,queryParamMap:n.queryParamMap}}function WO(n,t,e,i,r,o,s){let a=aD(n,t,e);if(!a.matched)return F(a);let c=sD(o(a));return i=zO(t,i),VO(i,t,e,r,c,s).pipe(H(l=>l===!0?a:p({},yg)))}function aD(n,t,e){if(t.path===``)return t.pathMatch===`full`&&(n.hasChildren()||e.length>0)?p({},yg):{matched:!0,consumedSegments:[],remainingSegments:e,parameters:{},positionalParamSegments:{}};let r=(t.matcher||RC)(e,n,t);if(!r)return p({},yg);let o={};Object.entries(r.posParams??{}).forEach(([a,c])=>{o[a]=c.path});let s=r.consumed.length>0?p(p({},o),r.consumed[r.consumed.length-1].parameters):o;return{matched:!0,consumedSegments:r.consumed,remainingSegments:e.slice(r.consumed.length),parameters:s,positionalParamSegments:r.posParams??{}}}function TC(n,t,e,i,r){return e.length>0&&YO(n,e,i,r)?{segmentGroup:new he(t,qO(i,new he(e,n.children))),slicedSegments:[]}:e.length===0&&ZO(n,e,i)?{segmentGroup:new he(n.segments,GO(n,e,i,n.children)),slicedSegments:e}:{segmentGroup:new he(n.segments,n.children),slicedSegments:e}}function GO(n,t,e,i){let r={};for(let o of e)if(_u(n,t,o)&&!i[fn(o)]){let s=new he([],{});r[fn(o)]=s}return p(p({},i),r)}function qO(n,t){let e={};e[q]=t;for(let i of n)if(i.path===``&&fn(i)!==q){let r=new he([],{});e[fn(i)]=r}return e}function YO(n,t,e,i){return e.some(r=>!_u(n,t,r)||!(fn(r)!==q)?!1:!(i!==void 0&&fn(r)===i))}function ZO(n,t,e){return e.some(i=>_u(n,t,i))}function _u(n,t,e){return(n.hasChildren()||t.length>0)&&e.pathMatch===`full`?!1:e.path===``}function KO(n,t,e){return t.length===0&&!n.children[e]}var _g=class{};async function QO(n,t,e,i,r,o,s,a){return new bg(n,t,e,i,r,s,o,a).recognize()}var XO=31;var bg=class{injector;configLoader;rootComponentType;config;urlTree;paramsInheritanceStrategy;urlSerializer;abortSignal;applyRedirects;absoluteRedirectCount=0;allowRedirects=!0;constructor(t,e,i,r,o,s,a,c){this.injector=t,this.configLoader=e,this.rootComponentType=i,this.config=r,this.urlTree=o,this.paramsInheritanceStrategy=s,this.urlSerializer=a,this.abortSignal=c,this.applyRedirects=new vg(this.urlSerializer,this.urlTree)}noMatchError(t){return new _(4002,`'${t.segmentGroup}'`)}async recognize(){let t=TC(this.urlTree.root,[],[],this.config).segmentGroup,{children:e,rootSnapshot:i}=await this.match(t),o=new Ja(``,new Pt(i,e)),s=zC(i,[],this.urlTree.queryParams,this.urlTree.fragment);return s.queryParams=this.urlTree.queryParams,o.url=this.urlSerializer.serialize(s),{state:o,tree:s}}async match(t){let e=new Go([],Object.freeze({}),Object.freeze(p({},this.urlTree.queryParams)),this.urlTree.fragment,Object.freeze({}),q,this.rootComponentType,null,{},this.injector);try{return{children:await this.processSegmentGroup(this.injector,this.config,t,q,e),rootSnapshot:e}}catch(i){if(i instanceof tc)return this.urlTree=i.urlTree,this.match(i.urlTree.root);throw i instanceof ii?this.noMatchError(i):i}}async processSegmentGroup(t,e,i,r,o){if(i.segments.length===0&&i.hasChildren())return this.processChildren(t,e,i,o);let s=await this.processSegment(t,e,i,i.segments,r,!0,o);return s instanceof Pt?[s]:[]}async processChildren(t,e,i,r){let o=[];for(let c of Object.keys(i.children))c===`primary`?o.unshift(c):o.push(c);let s=[];for(let c of o){let l=i.children[c],d=$O(e,c),f=await this.processSegmentGroup(t,d,l,c,r);s.push(...f)}let a=cD(s);return JO(a),a}async processSegment(t,e,i,r,o,s,a){for(let c of e)try{return await this.processSegmentAgainstRoute(c._injector??t,e,c,i,r,o,s,a)}catch(l){if(l instanceof ii||nD(l))continue;throw l}if(KO(i,r,o))return new _g;throw new ii(i)}async processSegmentAgainstRoute(t,e,i,r,o,s,a,c){if(fn(i)!==s&&(s===q||!_u(r,o,i)))throw new ii(r);if(i.redirectTo===void 0)return this.matchSegmentAgainstRoute(t,r,i,o,s,c);if(this.allowRedirects&&a)return this.expandSegmentAgainstRouteUsingRedirect(t,r,e,i,o,s,c);throw new ii(r)}async expandSegmentAgainstRouteUsingRedirect(t,e,i,r,o,s,a){let{matched:c,parameters:l,consumedSegments:d,positionalParamSegments:f,remainingSegments:h}=aD(e,r,o);if(!c)throw new ii(e);typeof r.redirectTo==`string`&&r.redirectTo[0]===`/`&&(this.absoluteRedirectCount++,this.absoluteRedirectCount>XO&&(this.allowRedirects=!1));let m=this.createSnapshot(t,r,o,l,a);if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);let v=await this.applyRedirects.applyRedirectCommands(d,r.redirectTo,f,sD(m),t),y=await this.applyRedirects.lineralizeSegments(r,v);return this.processSegment(t,i,e,y.concat(h),s,!1,a)}createSnapshot(t,e,i,r,o){let s=new Go(i,r,Object.freeze(p({},this.urlTree.queryParams)),this.urlTree.fragment,tP(e),fn(e),e.component??e._loadedComponent??null,e,nP(e),t),a=Dg(s,o,this.paramsInheritanceStrategy);return s.params=Object.freeze(a.params),s.data=Object.freeze(a.data),s}async matchSegmentAgainstRoute(t,e,i,r,o,s){if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);let a=Ue=>this.createSnapshot(t,i,Ue.consumedSegments,Ue.parameters,s),c=await eu(WO(e,i,r,t,this.urlSerializer,a,this.abortSignal));if(i.path===`**`&&(e.children={}),!c?.matched)throw new ii(e);t=i._injector??t;let{routes:l}=await this.getChildConfig(t,i,r),d=i._loadedInjector??t,{parameters:f,consumedSegments:h,remainingSegments:m}=c,v=this.createSnapshot(t,i,h,f,s),{segmentGroup:y,slicedSegments:R}=TC(e,h,m,l,o);if(R.length===0&&y.hasChildren())return new Pt(v,await this.processChildren(d,l,y,v));if(l.length===0&&R.length===0)return new Pt(v,[]);let k=fn(i)===o,Se=await this.processSegment(d,l,y,R,k?q:o,!0,v);return new Pt(v,Se instanceof Pt?[Se]:[])}async getChildConfig(t,e,i){if(e.children)return{routes:e.children,injector:t};if(e.loadChildren){if(e._loadedRoutes!==void 0){let o=e._loadedNgModuleFactory;return o&&!e._loadedInjector&&(e._loadedInjector=o.create(t).injector),{routes:e._loadedRoutes,injector:e._loadedInjector}}if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);if(await eu(jO(t,e,i,this.urlSerializer,this.abortSignal))){let o=await this.configLoader.loadChildren(t,e);return e._loadedRoutes=o.routes,e._loadedInjector=o.injector,e._loadedNgModuleFactory=o.factory,o}throw UO(e)}return{routes:[],injector:t}}};function JO(n){n.sort((t,e)=>t.value.outlet===q?-1:e.value.outlet===q?1:t.value.outlet.localeCompare(e.value.outlet))}function eP(n){let t=n.value.routeConfig;return t&&t.path===``}function cD(n){let t=[],e=new Set;for(let i of n){if(!eP(i)){t.push(i);continue}let r=t.find(o=>i.value.routeConfig===o.value.routeConfig);r!==void 0?(r.children.push(...i.children),e.add(r)):t.push(i)}for(let i of e){let r=cD(i.children);t.push(new Pt(i.value,r))}return t.filter(i=>!e.has(i))}function tP(n){return n.data||{}}function nP(n){return n.resolve||{}}function iP(n,t,e,i,r,o,s){return Ye(async a=>{let{state:c,tree:l}=await QO(n,t,e,i,a.extractedUrl,r,o,s);return S(p({},a),{targetSnapshot:c,urlAfterRedirects:l})})}function rP(n){return Ye(t=>{let{targetSnapshot:e,guards:{canActivateChecks:i}}=t;if(!i.length)return F(t);let r=new Set(i.map(a=>a.route)),o=new Set;for(let a of r)if(!o.has(a))for(let c of lD(a))o.add(c);let s=0;return Ee(o).pipe(qi(a=>r.has(a)?oP(a,e,n):(a.data=Dg(a,a.parent,n).resolve,F(void 0))),Ze(()=>s++),nl(1),Ye(a=>s===o.size?F(t):Re))})}function lD(n){return[n,...n.children.map(e=>lD(e)).flat()]}function oP(n,t,e){let i=n.routeConfig,r=n._resolve;return i?.title!==void 0&&!QC(i)&&(r[nc]=i.title),jn(()=>(n.data=Dg(n,n.parent,e).resolve,sP(r,n,t).pipe(H(o=>(n._resolvedData=o,n.data=p(p({},n.data),o),null)))))}function sP(n,t,e){let i=ag(n);if(i.length===0)return F({});let r={};return Ee(i).pipe(Ye(o=>aP(n[o],t,e).pipe(Vn(),Ze(s=>{if(s instanceof qo)throw pu(new ki,s);r[o]=s}))),nl(1),H(()=>r),mi(o=>nD(o)?Re:ks(o)))}function aP(n,t,e){let i=t._environmentInjector,r=Ko(n,i);return Or(r.resolve?r.resolve(t,e):Ie(i,()=>r(t,e)))}var dD=new g(``);function Sg(n){return et(t=>{let e=n(t);return e?Ee(e).pipe(H(()=>t)):F(t)})}var Mg=(()=>{class n{buildTitle(e){let i,r=e.root;for(;r!==void 0;)i=this.getResolvedTitleForRoute(r)??i,r=r.children.find(o=>o.outlet===q);return i}getResolvedTitleForRoute(e){return e.data[nc]}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:()=>u(uD)})}return n})();var uD=(()=>{class n extends Mg{title;constructor(e){super(),this.title=e}updateTitle(e){let i=this.buildTitle(e);i!==void 0&&this.title.setTitle(i)}static ɵfac=function(i){return new(i||n)(P(DC))};static ɵprov=W({token:n,factory:n.ɵfac,providedIn:`root`})}return n})();var Qo=new g(``,{factory:()=>({})});var rc=new g(``);var fD=(()=>{class n{componentLoaders=new WeakMap;childrenLoaders=new WeakMap;onLoadStartListener;onLoadEndListener;compiler=u(Fp);async loadComponent(e,i){if(this.componentLoaders.get(i))return this.componentLoaders.get(i);if(i._loadedComponent)return Promise.resolve(i._loadedComponent);this.onLoadStartListener&&this.onLoadStartListener(i);let r=(async()=>{try{let s=await mD(Up(await OC(Ie(e,()=>i.loadComponent()))));return this.onLoadEndListener&&this.onLoadEndListener(i),i._loadedComponent=s,s}finally{this.componentLoaders.delete(i)}})();return this.componentLoaders.set(i,r),r}loadChildren(e,i){if(this.childrenLoaders.get(i))return this.childrenLoaders.get(i);if(i._loadedRoutes)return Promise.resolve({routes:i._loadedRoutes,injector:i._loadedInjector});this.onLoadStartListener&&this.onLoadStartListener(i);let r=(async()=>{try{let o=await hD(i,this.compiler,e,this.onLoadEndListener);return i._loadedRoutes=o.routes,i._loadedInjector=o.injector,i._loadedNgModuleFactory=o.factory,o}finally{this.childrenLoaders.delete(i)}})();return this.childrenLoaders.set(i,r),r}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();async function hD(n,t,e,i){let o=await mD(Up(await OC(Ie(e,()=>n.loadChildren())))),s;o instanceof Cd||Array.isArray(o)?s=o:s=await t.compileModuleAsync(o),i&&i(n);let a,c,d;return Array.isArray(s)?c=s:(a=s.create(e).injector,d=s,c=a.get(rc,[],{optional:!0,self:!0}).flat()),{routes:c.map(Ng),injector:a,factory:d}}async function mD(n){return n}var bu=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:()=>u(cP)})}return n})();var cP=(()=>{class n{shouldProcessUrl(e){return!0}extract(e){return e}merge(e,i){return e}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var pD=new g(``);var lP=()=>{};var gD=new g(``);var vD=(()=>{class n{currentNavigation=C(null,{equal:()=>!1});currentTransition=null;lastSuccessfulNavigation=C(null);events=new w;transitionAbortWithErrorSubject=new w;configLoader=u(fD);environmentInjector=u(_e);destroyRef=u(ke);urlSerializer=u(Zo);rootContexts=u(kr);location=u(Ai);inputBindingEnabled=u(yu,{optional:!0})!==null;titleStrategy=u(Mg);options=u(Qo,{optional:!0})||{};paramsInheritanceStrategy=this.options.paramsInheritanceStrategy||mO;urlHandlingStrategy=u(bu);createViewTransition=u(pD,{optional:!0});navigationErrorHandler=u(gD,{optional:!0});routerResourcesFeature=u(dD,{optional:!0});navigationId=0;get hasRequestedNavigation(){return this.navigationId!==0}transitions;afterPreactivation=()=>F(void 0);rootComponentType=null;destroyed=!1;constructor(){let e=r=>this.events.next(new au(r)),i=r=>this.events.next(new cu(r));this.configLoader.onLoadEndListener=i,this.configLoader.onLoadStartListener=e,this.destroyRef.onDestroy(()=>{this.destroyed=!0})}complete(){this.transitions?.complete()}handleNavigationRequest(e){let i=++this.navigationId;E(()=>{this.transitions?.next(S(p({},e),{extractedUrl:this.urlHandlingStrategy.extract(e.rawUrl),targetSnapshot:null,targetRouterState:null,guards:{canActivateChecks:[],canDeactivateChecks:[]},guardsResult:null,id:i,routesRecognizeHandler:{},beforeActivateHandler:{}}))})}setupNavigations(e){return this.transitions=new He(null),this.transitions.pipe(re(i=>i!==null),et(i=>{let r=!0,o=!1,s=new AbortController,a=()=>!o&&this.currentTransition?.id===i.id;return F(i).pipe(et(c=>{if(this.navigationId>i.id)return this.cancelNavigationTransition(i,``,ht.SupersededByNewNavigation),Re;this.currentTransition=i;let l=this.lastSuccessfulNavigation();this.currentNavigation.set({id:c.id,initialUrl:c.rawUrl,extractedUrl:c.extractedUrl,targetBrowserUrl:typeof c.extras.browserUrl==`string`?this.urlSerializer.parse(c.extras.browserUrl):c.extras.browserUrl,trigger:c.source,extras:c.extras,previousNavigation:l?S(p({},l),{previousNavigation:null}):null,abort:()=>s.abort(),routesRecognizeHandler:c.routesRecognizeHandler,beforeActivateHandler:c.beforeActivateHandler});let d=!e.navigated||this.isUpdatingInternalState()||this.isUpdatedBrowserUrl(),f=c.extras.onSameUrlNavigation??e.onSameUrlNavigation;if(!d&&f!==`reload`)return this.events.next(new ri(c.id,this.urlSerializer.serialize(c.rawUrl),``,Za.IgnoredSameUrlNavigation)),c.resolve(!1),Re;if(this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))return F(c).pipe(et(h=>(this.events.next(new Ar(h.id,this.urlSerializer.serialize(h.extractedUrl),h.source,h.restoredState)),h.id!==this.navigationId?Re:Promise.resolve(h))),iP(this.environmentInjector,this.configLoader,this.rootComponentType,e.config,this.urlSerializer,this.paramsInheritanceStrategy,s.signal),Ze(h=>{i.targetSnapshot=h.targetSnapshot,i.urlAfterRedirects=h.urlAfterRedirects,this.currentNavigation.update(m=>(m.finalUrl=h.urlAfterRedirects,m)),this.events.next(new Qa)}),et(h=>Ee(i.routesRecognizeHandler.deferredHandle??F(void 0)).pipe(H(()=>h))),Ze(()=>{let h=new Ka(c.id,this.urlSerializer.serialize(c.extractedUrl),this.urlSerializer.serialize(c.urlAfterRedirects),c.targetSnapshot);this.events.next(h)}));if(d&&this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)){let{id:h,extractedUrl:m,source:v,restoredState:y,extras:R}=c,k=new Ar(h,this.urlSerializer.serialize(m),v,y);this.events.next(k);let Se=ZC(this.rootComponentType,this.environmentInjector).snapshot;return this.currentTransition=i=S(p({},c),{targetSnapshot:Se,urlAfterRedirects:m,extras:S(p({},R),{skipLocationChange:!1,replaceUrl:!1})}),this.currentNavigation.update(Ue=>(Ue.finalUrl=m,Ue)),F(i)}else return this.events.next(new ri(c.id,this.urlSerializer.serialize(c.extractedUrl),``,Za.IgnoredByUrlHandlingStrategy)),c.resolve(!1),Re}),H(c=>{let l=new iu(c.id,this.urlSerializer.serialize(c.extractedUrl),this.urlSerializer.serialize(c.urlAfterRedirects),c.targetSnapshot);return this.events.next(l),this.currentTransition=i=S(p({},c),{guards:_O(c.targetSnapshot,c.currentSnapshot,this.rootContexts)}),i}),TO(c=>this.events.next(c)),et(c=>{if(i.guardsResult=c.guardsResult,c.guardsResult&&typeof c.guardsResult!=`boolean`)throw pu(this.urlSerializer,c.guardsResult);let l=new ru(c.id,this.urlSerializer.serialize(c.extractedUrl),this.urlSerializer.serialize(c.urlAfterRedirects),c.targetSnapshot,!!c.guardsResult);if(this.events.next(l),!a())return Re;if(!c.guardsResult)return this.cancelNavigationTransition(c,``,ht.GuardRejected),Re;if(c.guards.canActivateChecks.length===0)return F(c);let d=new ou(c.id,this.urlSerializer.serialize(c.extractedUrl),this.urlSerializer.serialize(c.urlAfterRedirects),c.targetSnapshot);if(this.events.next(d),!a())return Re;let f=!1;return F(c).pipe(rP(this.paramsInheritanceStrategy),Ze({next:()=>{f=!0;let h=new su(c.id,this.urlSerializer.serialize(c.extractedUrl),this.urlSerializer.serialize(c.urlAfterRedirects),c.targetSnapshot);this.events.next(h)},complete:()=>{f||this.cancelNavigationTransition(c,``,ht.NoDataFromResolver)}}))}),Sg(c=>{let l=f=>{let h=[];if(f.routeConfig?._loadedComponent)f.component=f.routeConfig?._loadedComponent;else if(f.routeConfig?.loadComponent){let m=f._environmentInjector;h.push(this.configLoader.loadComponent(m,f.routeConfig).then(v=>{f.component=v}))}for(let m of f.children)h.push(...l(m));return h},d=l(c.targetSnapshot.root);return d.length===0?F(c):Ee(Promise.all(d).then(()=>c))}),et(c=>{let{newlyCreatedRoutes:l,state:d}=pO(e.routeReuseStrategy,c.targetSnapshot,c.currentRouterState);return this.currentTransition=i=c=S(p({},c),{targetRouterState:d,newlyCreatedRoutes:l}),this.currentNavigation.update(f=>(f.targetRouterState=d,f)),F(c)}),this.routerResourcesFeature?.setupAndRunResources(s.signal)??(c=>c),Sg(()=>this.afterPreactivation()),et(()=>{let{currentSnapshot:c,targetSnapshot:l}=i,d=this.createViewTransition?.(this.environmentInjector,c.root,l.root,i.hasUAVisualTransition);return d?Ee(d).pipe(H(()=>i)):F(i)}),xe(1),et(c=>{r=!1,this.events.next(new $o);let l=i.beforeActivateHandler.deferredHandle;return l?Ee(l.then(()=>c)):F(c)}),Ze(c=>{new gg(e.routeReuseStrategy,i.targetRouterState,i.currentRouterState,l=>this.events.next(l),this.inputBindingEnabled).activate(this.rootContexts),c.newlyCreatedRoutes?.clear(),a()&&(yD(c.targetRouterState),o=!0,this.currentNavigation.update(l=>(l.abort=lP,l)),this.lastSuccessfulNavigation.set(E(this.currentNavigation)),this.events.next(new Lt(c.id,this.urlSerializer.serialize(c.extractedUrl),this.urlSerializer.serialize(c.urlAfterRedirects))),this.titleStrategy?.updateTitle(c.targetRouterState.snapshot),c.resolve(!0))}),at(iD(s.signal).pipe(re(()=>!o&&r),Ze(()=>{this.cancelNavigationTransition(i,s.signal.reason+``,ht.Aborted)}))),Ze({complete:()=>{o=!0}}),at(this.transitionAbortWithErrorSubject.pipe(Ze(c=>{throw c}))),Zi(()=>{s.abort(),o||this.cancelNavigationTransition(i,``,ht.SupersededByNewNavigation),this.currentTransition?.id===i.id&&(this.currentNavigation.set(null),this.currentTransition=null)}),mi(c=>{if(o=!0,AC(i),this.destroyed)return i.resolve(!1),Re;if(tD(c))this.events.next(new qt(i.id,this.urlSerializer.serialize(i.extractedUrl),c.message,c.cancellationCode)),yO(c)?this.events.next(new Wo(c.url,c.navigationBehaviorOptions)):i.resolve(!1);else{let l=new Rr(i.id,this.urlSerializer.serialize(i.extractedUrl),c,i.targetSnapshot??void 0);try{let d=Ie(this.environmentInjector,()=>this.navigationErrorHandler?.(l));if(d instanceof qo){let{message:f,cancellationCode:h}=pu(this.urlSerializer,d);this.events.next(new qt(i.id,this.urlSerializer.serialize(i.extractedUrl),f,h)),this.events.next(new Wo(d.redirectTo,d.navigationBehaviorOptions))}else throw this.events.next(l),c}catch(d){this.options.resolveNavigationPromiseOnError?i.resolve(!1):i.reject(d)}}return Re}))}))}cancelNavigationTransition(e,i,r){AC(e);let o=new qt(e.id,this.urlSerializer.serialize(e.extractedUrl),i,r);this.events.next(o),e.resolve(!1)}isUpdatingInternalState(){return this.currentTransition?.extractedUrl.toString()!==this.currentTransition?.currentUrlTree.toString()}isUpdatedBrowserUrl(){let e=this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))),i=E(this.currentNavigation),r=i?.targetBrowserUrl??i?.extractedUrl;return e.toString()!==r?.toString()&&!i?.extras.skipLocationChange}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function dP(n){return n!==Ga}function AC(n){for(let t of n.newlyCreatedRoutes??[])t._localInjector?.destroy(),t._localInjector=void 0;yD(n.targetRouterState)}function yD(n){if(!n)return;let t=e=>{e.value.pending?.set(!1),e.children.forEach(t)};t(n._root)}var _D=new g(``);var bD=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:()=>u(uP)})}return n})();var vu=class{shouldDetach(t){return!1}store(t,e){}shouldAttach(t){return!1}retrieve(t){return null}shouldReuseRoute(t,e){return t.routeConfig===e.routeConfig}shouldDestroyInjector(t){return!0}};var uP=(()=>{class n extends vu{static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var Su=(()=>{class n{urlSerializer=u(Zo);options=u(Qo,{optional:!0})||{};canceledNavigationResolution=this.options.canceledNavigationResolution||`replace`;location=u(Ai);urlHandlingStrategy=u(bu);urlUpdateStrategy=this.options.urlUpdateStrategy||`deferred`;currentUrlTree=new bt;getCurrentUrlTree(){return this.currentUrlTree}rawUrlTree=this.currentUrlTree;getRawUrlTree(){return this.rawUrlTree}createBrowserPath({finalUrl:e,initialUrl:i,targetBrowserUrl:r}){let o=e!==void 0?this.urlHandlingStrategy.merge(e,i):i,s=r??o;return s instanceof bt?this.urlSerializer.serialize(s):s}routerUrlState(e){return e?.targetBrowserUrl===void 0||e?.finalUrl===void 0?{}:{ɵrouterUrl:this.urlSerializer.serialize(e.finalUrl)}}commitTransition({targetRouterState:e,finalUrl:i,initialUrl:r}){i&&e?(this.currentUrlTree=i,this.rawUrlTree=this.urlHandlingStrategy.merge(i,r),this.routerState=e):this.rawUrlTree=r}routerState=ZC(null,u(_e));getRouterState(){return this.routerState}_stateMemento=this.createStateMemento();get stateMemento(){return this._stateMemento}updateStateMemento(){this._stateMemento=this.createStateMemento()}createStateMemento(){return{rawUrlTree:this.rawUrlTree,currentUrlTree:this.currentUrlTree,routerState:this.routerState}}restoredState(){return this.location.getState()}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:()=>u(fP)})}return n})();var fP=(()=>{class n extends Su{currentPageId=0;lastSuccessfulId=-1;get browserPageId(){return this.canceledNavigationResolution!==`computed`?this.currentPageId:this.restoredState()?.ɵrouterPageId??this.currentPageId}registerNonRouterCurrentEntryChangeListener(e){return this.location.subscribe(i=>{i.type===`popstate`&&setTimeout(()=>{e(i.url,i.state,`popstate`,{replaceUrl:!0},i.hasUAVisualTransition)})})}handleRouterEvent(e,i){e instanceof Ar?this.updateStateMemento():e instanceof ri?this.commitTransition(i):e instanceof Ka?this.urlUpdateStrategy===`eager`&&(i.extras.skipLocationChange||this.setBrowserUrl(this.createBrowserPath(i),i)):e instanceof $o?(this.commitTransition(i),this.urlUpdateStrategy===`deferred`&&!i.extras.skipLocationChange&&this.setBrowserUrl(this.createBrowserPath(i),i)):e instanceof qt&&!YC(e)?this.restoreHistory(i):e instanceof Rr?this.restoreHistory(i,!0):e instanceof Lt&&(this.lastSuccessfulId=e.id,this.currentPageId=this.browserPageId)}setBrowserUrl(e,i){let{extras:r,id:o}=i,{replaceUrl:s,state:a}=r;if(this.location.isCurrentPathEqualTo(e)||s){let c=this.browserPageId,l=p(p({},a),this.generateNgRouterState(o,c,i));this.location.replaceState(e,``,l)}else{let c=p(p({},a),this.generateNgRouterState(o,this.browserPageId+1,i));this.location.go(e,``,c)}}restoreHistory(e,i=!1){if(this.canceledNavigationResolution===`computed`){let r=this.browserPageId,o=this.currentPageId-r;o!==0?this.location.historyGo(o):this.getCurrentUrlTree()===e.finalUrl&&o===0&&(this.resetInternalState(e),this.resetUrlToCurrentUrlTree())}else this.canceledNavigationResolution===`replace`&&(i&&this.resetInternalState(e),this.resetUrlToCurrentUrlTree())}resetInternalState({finalUrl:e}){this.routerState=this.stateMemento.routerState,this.currentUrlTree=this.stateMemento.currentUrlTree,this.rawUrlTree=this.urlHandlingStrategy.merge(this.currentUrlTree,e??this.rawUrlTree)}resetUrlToCurrentUrlTree(){this.location.replaceState(this.urlSerializer.serialize(this.getRawUrlTree()),``,this.generateNgRouterState(this.lastSuccessfulId,this.currentPageId))}generateNgRouterState(e,i,r){return this.canceledNavigationResolution===`computed`?p({navigationId:e,ɵrouterPageId:i},this.routerUrlState(r)):p({navigationId:e},this.routerUrlState(r))}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function Tg(n,t){n.events.pipe(re(e=>e instanceof Lt||e instanceof qt||e instanceof Rr||e instanceof ri),H(e=>e instanceof Lt||e instanceof ri?0:(e instanceof qt?e.code===ht.Redirect||e.code===ht.SupersededByNewNavigation:!1)?2:1),re(e=>e!==2),xe(1)).subscribe(()=>{t()})}var si=(()=>{class n{get currentUrlTree(){return this.stateManager.getCurrentUrlTree()}get rawUrlTree(){return this.stateManager.getRawUrlTree()}disposed=!1;nonRouterCurrentEntryChangeSubscription;console=u(Ed);stateManager=u(Su);options=u(Qo,{optional:!0})||{};pendingTasks=u(qn);urlUpdateStrategy=this.options.urlUpdateStrategy||`deferred`;navigationTransitions=u(vD);urlSerializer=u(Zo);location=u(Ai);urlHandlingStrategy=u(bu);injector=u(_e);_events=new w;get events(){return this._events}get routerState(){return this.stateManager.getRouterState()}navigated=!1;routeReuseStrategy=u(bD);injectorCleanup=u(_D,{optional:!0});onSameUrlNavigation=this.options.onSameUrlNavigation||`ignore`;config=u(rc,{optional:!0})?.flat()??[];componentInputBindingEnabled=!!u(yu,{optional:!0});currentNavigation=this.navigationTransitions.currentNavigation.asReadonly();constructor(){this.resetConfig(this.config),this.navigationTransitions.setupNavigations(this).subscribe({error:e=>{}}),this.subscribeToNavigationEvents()}eventsSubscription=new Q;subscribeToNavigationEvents(){let e=this.navigationTransitions.events.subscribe(i=>{try{let r=this.navigationTransitions.currentTransition,o=E(this.navigationTransitions.currentNavigation);if(r!==null&&o!==null){if(this.stateManager.handleRouterEvent(i,o),i instanceof qt&&i.code!==ht.Redirect&&i.code!==ht.SupersededByNewNavigation)this.navigated=!0;else if(i instanceof Lt)this.navigated=!0,this.injectorCleanup?.(this.routeReuseStrategy,this.routerState,this.config);else if(i instanceof Wo){let s=i.navigationBehaviorOptions,a=this.urlHandlingStrategy.merge(i.url,r.currentRawUrl),c=p({scroll:r.extras.scroll,browserUrl:r.extras.browserUrl,info:r.extras.info,skipLocationChange:r.extras.skipLocationChange,replaceUrl:r.extras.replaceUrl||this.urlUpdateStrategy===`eager`||dP(r.source)},s);this.scheduleNavigation(a,Ga,null,c,r.hasUAVisualTransition,{resolve:r.resolve,reject:r.reject,promise:r.promise})}}fO(i)&&this._events.next(i)}catch(r){this.navigationTransitions.transitionAbortWithErrorSubject.next(r)}});this.eventsSubscription.add(e)}resetRootComponentType(e){this.routerState.root.component=e,this.navigationTransitions.rootComponentType=e}initialNavigation(){this.setUpLocationChangeListener(),this.navigationTransitions.hasRequestedNavigation||this.navigateToSyncWithBrowser(this.location.path(!0),Ga,this.stateManager.restoredState(),{replaceUrl:!0})}setUpLocationChangeListener(){this.nonRouterCurrentEntryChangeSubscription??=this.stateManager.registerNonRouterCurrentEntryChangeListener((e,i,r,o,s)=>{this.navigateToSyncWithBrowser(e,r,i,o,s)})}navigateToSyncWithBrowser(e,i,r,o,s){let a=r?.navigationId?r:null,c=r?.ɵrouterUrl??e;if(r?.ɵrouterUrl&&(o=S(p({},o),{browserUrl:e})),r){let d=p({},r);delete d.navigationId,delete d.ɵrouterPageId,delete d.ɵrouterUrl,Object.keys(d).length!==0&&(o.state=d)}let l=this.parseUrl(c);this.scheduleNavigation(l,i,a,o,s).catch(d=>{this.disposed||this.injector.get($t)(d)})}get url(){return this.serializeUrl(this.currentUrlTree)}getCurrentNavigation(){return E(this.navigationTransitions.currentNavigation)}get lastSuccessfulNavigation(){return this.navigationTransitions.lastSuccessfulNavigation}resetConfig(e){this.config=e.map(Ng),this.navigated=!1}ngOnDestroy(){this.dispose()}dispose(){this._events.unsubscribe(),this.navigationTransitions.complete(),this.nonRouterCurrentEntryChangeSubscription?.unsubscribe(),this.nonRouterCurrentEntryChangeSubscription=void 0,this.disposed=!0,this.eventsSubscription.unsubscribe()}createUrlTree(e,i={}){let{relativeTo:r,queryParams:o,fragment:s,queryParamsHandling:a,preserveFragment:c}=i,l=c?this.currentUrlTree.fragment:s,d=null;switch(a??this.options.defaultQueryParamsHandling){case`merge`:d=p(p({},this.currentUrlTree.queryParams),o);break;case`preserve`:d=this.currentUrlTree.queryParams;break;default:d=o||null}d!==null&&(d=this.removeEmptyProps(d));let f;try{f=$C(r?r.snapshot:this.routerState.snapshot.root)}catch{(typeof e[0]!=`string`||e[0][0]!==`/`)&&(e=[]),f=this.currentUrlTree.root}return WC(f,e,d,l??null,this.urlSerializer)}navigateByUrl(e,i={skipLocationChange:!1}){let r=Oi(e)?e:this.parseUrl(e),o=this.urlHandlingStrategy.merge(r,this.rawUrlTree);return this.scheduleNavigation(o,Ga,null,i)}navigate(e,i={skipLocationChange:!1}){return hP(e),this.navigateByUrl(this.createUrlTree(e,i),i)}serializeUrl(e){return this.urlSerializer.serialize(e)}parseUrl(e){try{return this.urlSerializer.parse(e)}catch{return this.console.warn(Jt(4018,!1)),this.urlSerializer.parse(`/`)}}isActive(e,i){let r;if(i===!0?r=p({},wg):i===!1?r=p({},zo):r=p(p({},zo),i),Oi(e))return cg(this.currentUrlTree,e,r);let o=this.parseUrl(e);return cg(this.currentUrlTree,o,r)}removeEmptyProps(e){return Object.entries(e).reduce((i,[r,o])=>(o!=null&&(i[r]=o),i),{})}scheduleNavigation(e,i,r,o,s,a){if(this.disposed)return Promise.resolve(!1);let c,l,d;a?(c=a.resolve,l=a.reject,d=a.promise):d=new Promise((h,m)=>{c=h,l=m});let f=this.pendingTasks.add();return Tg(this,()=>{queueMicrotask(()=>this.pendingTasks.remove(f))}),this.navigationTransitions.handleNavigationRequest({source:i,restoredState:r,currentUrlTree:this.currentUrlTree,currentRawUrl:this.currentUrlTree,rawUrl:e,extras:o,hasUAVisualTransition:s,resolve:c,reject:l,promise:d,currentSnapshot:this.routerState.snapshot,currentRouterState:this.routerState}),d.catch(Promise.reject.bind(Promise))}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function hP(n){for(let t=0;t<n.length;t++)if(n[t]==null)throw new _(4008,!1)}var pP=(()=>{class n{router=u(si);stateManager=u(Su);fragment=C(``);queryParams=C({});path=C(``);serializer=u(Zo);constructor(){this.updateState(),this.router.events?.subscribe(e=>{e instanceof Lt&&this.updateState()})}updateState(){let{fragment:e,root:i,queryParams:r}=this.stateManager.getCurrentUrlTree();this.fragment.set(e),this.queryParams.set(r),this.path.set(this.serializer.serialize(new bt(i)))}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var wu=(()=>{class n{router;route;tabIndexAttribute;renderer;el;locationStrategy;hrefAttributeValue=u(new ko(`href`),{optional:!0});reactiveHref=kn(()=>this.isAnchorElement?this.computeHref(this._urlTree()):this.hrefAttributeValue);get href(){return E(this.reactiveHref)}set href(e){this.reactiveHref.set(e)}set target(e){this._target.set(e)}get target(){return E(this._target)}_target=C(void 0);set queryParams(e){this._queryParams.set(e)}get queryParams(){return E(this._queryParams)}_queryParams=C(void 0,{equal:()=>!1});set fragment(e){this._fragment.set(e)}get fragment(){return E(this._fragment)}_fragment=C(void 0);set queryParamsHandling(e){this._queryParamsHandling.set(e)}get queryParamsHandling(){return E(this._queryParamsHandling)}_queryParamsHandling=C(void 0);set state(e){this._state.set(e)}get state(){return E(this._state)}_state=C(void 0,{equal:()=>!1});set info(e){this._info.set(e)}get info(){return E(this._info)}_info=C(void 0,{equal:()=>!1});set relativeTo(e){this._relativeTo.set(e)}get relativeTo(){return E(this._relativeTo)}_relativeTo=C(void 0);set preserveFragment(e){this._preserveFragment.set(e)}get preserveFragment(){return E(this._preserveFragment)}_preserveFragment=C(!1);set skipLocationChange(e){this._skipLocationChange.set(e)}get skipLocationChange(){return E(this._skipLocationChange)}_skipLocationChange=C(!1);set replaceUrl(e){this._replaceUrl.set(e)}get replaceUrl(){return E(this._replaceUrl)}_replaceUrl=C(!1);browserUrl=Mi(void 0);isAnchorElement;onChanges=new w;applicationErrorHandler=u($t);options=u(Qo,{optional:!0});reactiveRouterState=u(pP);constructor(e,i,r,o,s,a){this.router=e,this.route=i,this.tabIndexAttribute=r,this.renderer=o,this.el=s,this.locationStrategy=a;let c=s.nativeElement.tagName?.toLowerCase();this.isAnchorElement=c===`a`||c===`area`||!!(typeof customElements==`object`&&customElements.get(c)?.observedAttributes?.includes?.(`href`))}setTabIndexIfNotOnNativeEl(e){this.tabIndexAttribute!=null||this.isAnchorElement||this.applyAttributeValue(`tabindex`,e)}ngOnChanges(e){this.onChanges.next(this)}routerLinkInput=C(null);set routerLink(e){e==null?(this.routerLinkInput.set(null),this.setTabIndexIfNotOnNativeEl(null)):(Oi(e)?this.routerLinkInput.set(e):this.routerLinkInput.set(Array.isArray(e)?e:[e]),this.setTabIndexIfNotOnNativeEl(`0`))}onClick(e,i,r,o,s){let a=this._urlTree();if(a===null||this.isAnchorElement&&(e!==0||i||r||o||s||typeof this.target==`string`&&this.target!=`_self`))return!0;let c=this.browserUrl(),l=p({skipLocationChange:this.skipLocationChange,replaceUrl:this.replaceUrl,state:this.state,info:this.info},c!==void 0&&{browserUrl:c});return this.router.navigateByUrl(a,l)?.catch(d=>{this.applicationErrorHandler(d)}),!this.isAnchorElement}ngOnDestroy(){}applyAttributeValue(e,i){let r=this.renderer,o=this.el.nativeElement;i!==null?r.setAttribute(o,e,i):r.removeAttribute(o,e)}_urlTree=x(()=>{this.reactiveRouterState.path(),this._preserveFragment()&&this.reactiveRouterState.fragment();let e=r=>r===`preserve`||r===`merge`;(e(this._queryParamsHandling())||e(this.options?.defaultQueryParamsHandling))&&this.reactiveRouterState.queryParams();let i=this.routerLinkInput();return i===null||!this.router.createUrlTree?null:Oi(i)?i:this.router.createUrlTree(i,{relativeTo:this._relativeTo()!==void 0?this._relativeTo():this.route,queryParams:this._queryParams(),fragment:this._fragment(),queryParamsHandling:this._queryParamsHandling(),preserveFragment:this._preserveFragment()})},{equal:(e,i)=>this.computeHref(e)===this.computeHref(i)});get urlTree(){return E(this._urlTree)}computeHref(e){return e!==null&&this.locationStrategy?this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(e))??``:null}static ɵfac=function(i){return new(i||n)(ne(si),ne(oi),ba(`tabindex`),ne(ge),ne(N),ne(Fo))};static ɵdir=D({type:n,selectors:[[``,`routerLink`,``]],hostVars:2,hostBindings:function(i,r){i&1&&Fe(`click`,function(s){return r.onClick(s.button,s.ctrlKey,s.shiftKey,s.altKey,s.metaKey)}),i&2&&ie(`href`,r.reactiveHref(),Jm)(`target`,r._target())},inputs:{target:`target`,queryParams:`queryParams`,fragment:`fragment`,queryParamsHandling:`queryParamsHandling`,state:`state`,info:`info`,relativeTo:`relativeTo`,preserveFragment:[2,`preserveFragment`,`preserveFragment`,te],skipLocationChange:[2,`skipLocationChange`,`skipLocationChange`,te],replaceUrl:[2,`replaceUrl`,`replaceUrl`,te],browserUrl:[1,`browserUrl`],routerLink:`routerLink`},features:[Be]})}return n})();var gP=(()=>{class n{router;element;renderer;cdr;links;classes=[];routerEventsSubscription;linkInputChangesSubscription;_isActive=!1;get isActive(){return this._isActive}routerLinkActiveOptions={exact:!1};ariaCurrentWhenActive;isActiveChange=new z;link=u(wu,{optional:!0});constructor(e,i,r,o){this.router=e,this.element=i,this.renderer=r,this.cdr=o,this.routerEventsSubscription=e.events.subscribe(s=>{s instanceof Lt&&this.update()})}ngAfterContentInit(){F(this.links.changes,F(null)).pipe(hi()).subscribe(e=>{this.update(),this.subscribeToEachLinkOnChanges()})}subscribeToEachLinkOnChanges(){this.linkInputChangesSubscription?.unsubscribe();let e=[...this.links.toArray(),this.link].filter(i=>!!i).map(i=>i.onChanges);this.linkInputChangesSubscription=Ee(e).pipe(hi()).subscribe(i=>{this._isActive!==this.isLinkActive(this.router)(i)&&this.update()})}set routerLinkActive(e){if(e==null){this.classes=[];return}let i=Array.isArray(e)?e:e.split(` `);this.classes=i.filter(r=>!!r)}ngOnChanges(e){this.update()}ngOnDestroy(){this.routerEventsSubscription.unsubscribe(),this.linkInputChangesSubscription?.unsubscribe()}update(){!this.links||!this.router.navigated||this.routerLinkActiveOptions===null&&!this._isActive||queueMicrotask(()=>{let e=this.hasActiveLinks();this.classes.forEach(i=>{e?this.renderer.addClass(this.element.nativeElement,i):this.renderer.removeClass(this.element.nativeElement,i)}),e&&this.ariaCurrentWhenActive!==void 0?this.renderer.setAttribute(this.element.nativeElement,`aria-current`,this.ariaCurrentWhenActive.toString()):this.renderer.removeAttribute(this.element.nativeElement,`aria-current`),this._isActive!==e&&(this._isActive=e,this.cdr.markForCheck(),this.isActiveChange.emit(e))})}isLinkActive(e){let i=this.routerLinkActiveOptions;if(i===null)return()=>!1;let r;return i===void 0?r=p({},zo):vP(i)?r=i:i.exact??!1?r=p({},wg):r=p({},zo),o=>{let s=o.urlTree;return s?E(Cg(s,e,r)):!1}}hasActiveLinks(){let e=this.isLinkActive(this.router);return this.link&&e(this.link)||this.links.some(e)}static ɵfac=function(i){return new(i||n)(ne(si),ne(N),ne(ge),ne(Qe))};static ɵdir=D({type:n,selectors:[[``,`routerLinkActive`,``]],contentQueries:function(i,r,o){if(i&1&&un(o,wu,5),i&2){let s;oe(s=se())&&(r.links=s)}},inputs:{routerLinkActiveOptions:`routerLinkActiveOptions`,ariaCurrentWhenActive:`ariaCurrentWhenActive`,routerLinkActive:`routerLinkActive`},outputs:{isActiveChange:`isActiveChange`},exportAs:[`routerLinkActive`],features:[Be]})}return n})();function vP(n){let t=n;return!!(t.paths||t.matrixParams||t.queryParams||t.fragment)}var yP=new g(``);function _P(n,...t){return Sn([{provide:rc,multi:!0,useValue:n},{provide:oi,useFactory:bP},{provide:Ta,multi:!0,useFactory:SP},t.map(e=>e.ɵproviders)])}function bP(){return u(si).routerState.root}function SP(){let n=u(T);return t=>{let e=n.get(vt);if(t!==e.components[0])return;let i=n.get(si),r=n.get(wP);n.get(CP)===1&&i.initialNavigation(),n.get(DP,null,{optional:!0})?.setUpPreloading(),n.get(yP,null,{optional:!0})?.init(),i.resetRootComponentType(e.componentTypes[0]),r.closed||(r.next(),r.complete(),r.unsubscribe())}}var wP=new g(``,{factory:()=>new w});var CP=new g(``,{factory:()=>1});var DP=new g(``);var Ag;try{Ag=typeof Intl<`u`&&Intl.v8BreakIterator}catch{Ag=!1}var fe=(()=>{class n{_platformId=u(_r);isBrowser=this._platformId?tC(this._platformId):typeof document==`object`&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||Ag)&&typeof CSS<`u`&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!(`MSStream`in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function Xo(n){return Array.isArray(n)?n:[n]}var SD=new Set;var Pr;var Cu=(()=>{class n{_platform=u(fe);_nonce=u(Yn,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):xP}matchMedia(e){return(this._platform.WEBKIT||this._platform.BLINK)&&EP(e,this._nonce),this._matchMedia(e)}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function EP(n,t){if(!SD.has(n))try{Pr||(Pr=document.createElement(`style`),t&&Pr.setAttribute(`nonce`,t),Pr.setAttribute(`type`,`text/css`),document.head.appendChild(Pr)),Pr.sheet&&(Pr.sheet.insertRule(`@media ${n.replace(/[{}]/g,``)} {body{ }}`,0),SD.add(n))}catch(e){console.error(e)}}function xP(n){return{matches:n===`all`||n===``,media:n,addListener:()=>{},removeListener:()=>{}}}var Rg=(()=>{class n{_mediaMatcher=u(Cu);_zone=u(I);_queries=new Map;_destroySubject=new w;ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(e){return wD(Xo(e)).some(r=>this._registerQuery(r).mql.matches)}observe(e){let o=Ps(wD(Xo(e)).map(s=>this._registerQuery(s).observable));return o=gn(o.pipe(xe(1)),o.pipe(Vs(1),Yi(0))),o.pipe(H(s=>{let a={matches:!1,breakpoints:{}};return s.forEach(({matches:c,query:l})=>{a.matches=a.matches||c,a.breakpoints[l]=c}),a}))}_registerQuery(e){if(this._queries.has(e))return this._queries.get(e);let i=this._mediaMatcher.matchMedia(e),o={observable:new V(s=>{let a=c=>this._zone.run(()=>s.next(c));return i.addListener(a),()=>{i.removeListener(a)}}).pipe(st(i),H(({matches:s})=>({query:e,matches:s})),at(this._destroySubject)),mql:i};return this._queries.set(e,o),o}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function wD(n){return n.map(t=>t.split(`,`)).reduce((t,e)=>t.concat(e)).map(t=>t.trim())}function Fr(n){return n.buttons===0||n.detail===0}function Lr(n){let t=n.touches&&n.touches[0]||n.changedTouches&&n.changedTouches[0];return!!t&&t.identifier===-1&&(t.radiusX==null||t.radiusX===1)&&(t.radiusY==null||t.radiusY===1)}var kg;function CD(){if(kg==null){let n=typeof document<`u`?document.head:null;kg=!!(n&&(n.createShadowRoot||n.attachShadow))}return kg}function Og(n){if(CD()){let t=n.getRootNode?n.getRootNode():null;if(typeof ShadowRoot<`u`&&ShadowRoot&&t instanceof ShadowRoot)return t}return null}function Jo(){let n=typeof document<`u`&&document?document.activeElement:null;for(;n&&n.shadowRoot;){let t=n.shadowRoot.activeElement;if(t===n)break;n=t}return n}function St(n){if(n.composedPath)try{return n.composedPath()[0]}catch{}return n.target}var oc;function DD(){if(oc==null&&typeof window<`u`)try{window.addEventListener(`test`,null,Object.defineProperty({},"passive",{get:()=>oc=!0}))}finally{oc=oc||!1}return oc}function es(n){return DD()?n:!!n.capture}function Yt(n,t=0){return ED(n)?Number(n):arguments.length===2?t:0}function ED(n){return!isNaN(parseFloat(n))&&!isNaN(Number(n))}function wt(n){return n instanceof N?n.nativeElement:n}var xD=new g(`cdk-input-modality-detector-options`);var ID={ignoreKeys:[18,17,224,91,16]};var ND=650;var Pg={passive:!0,capture:!0};var MD=(()=>{class n{_platform=u(fe);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new He(null);_options;_lastTouchMs=0;_onKeydown=e=>{this._options?.ignoreKeys?.some(i=>i===e.keyCode)||(this._modality.next(`keyboard`),this._mostRecentTarget=St(e))};_onMousedown=e=>{Date.now()-this._lastTouchMs<ND||(this._modality.next(Fr(e)?`keyboard`:`mouse`),this._mostRecentTarget=St(e))};_onTouchstart=e=>{if(Lr(e)){this._modality.next(`keyboard`);return}this._lastTouchMs=Date.now(),this._modality.next(`touch`),this._mostRecentTarget=St(e)};constructor(){let e=u(I),i=u(M),r=u(xD,{optional:!0});if(this._options=p(p({},ID),r),this.modalityDetected=this._modality.pipe(Vs(1)),this.modalityChanged=this.modalityDetected.pipe(tl()),this._platform.isBrowser){let o=u(Ve).createRenderer(null,null);this._listenerCleanups=e.runOutsideAngular(()=>[o.listen(i,`keydown`,this._onKeydown,Pg),o.listen(i,`mousedown`,this._onMousedown,Pg),o.listen(i,`touchstart`,this._onTouchstart,Pg)])}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(e=>e())}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var sc=(function(n){return n[n.IMMEDIATE=0]=`IMMEDIATE`,n[n.EVENTUAL=1]=`EVENTUAL`,n})(sc||{});var TD=new g(`cdk-focus-monitor-default-options`);var Du=es({passive:!0,capture:!0});var ai=(()=>{class n{_ngZone=u(I);_platform=u(fe);_inputModalityDetector=u(MD);_origin=null;_lastFocusOrigin=null;_windowFocused=!1;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=!1;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=!0,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=!1)};_document=u(M);_stopInputModalityDetector=new w;constructor(){let e=u(TD,{optional:!0});this._detectionMode=e?.detectionMode||sc.IMMEDIATE}_rootNodeFocusAndBlurListener=e=>{let i=St(e);for(let r=i;r;r=r.parentElement)e.type===`focus`?this._onFocus(e,r):this._onBlur(e,r)};monitor(e,i=!1){let r=wt(e);if(!this._platform.isBrowser||r.nodeType!==1)return F();let o=Og(r)||this._document,s=this._elementInfo.get(r);if(s)return i&&(s.checkChildren=!0),s.subject;let a={checkChildren:i,subject:new w,rootNode:o};return this._elementInfo.set(r,a),this._registerGlobalListeners(a),a.subject}stopMonitoring(e){let i=wt(e),r=this._elementInfo.get(i);r&&(r.subject.complete(),this._setClasses(i),this._elementInfo.delete(i),this._removeGlobalListeners(r))}focusVia(e,i,r){let o=wt(e);o===this._document.activeElement?this._getClosestElementsInfo(o).forEach(([a,c])=>this._originChanged(a,i,c)):(this._setOrigin(i),typeof o.focus==`function`&&o.focus(r))}ngOnDestroy(){this._elementInfo.forEach((e,i)=>this.stopMonitoring(i))}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(e){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(e)?`touch`:`program`:this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:e&&this._isLastInteractionFromInputLabel(e)?`mouse`:`program`}_shouldBeAttributedToTouch(e){return this._detectionMode===sc.EVENTUAL||!!e?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(e,i){e.classList.toggle(`cdk-focused`,!!i),e.classList.toggle(`cdk-touch-focused`,i===`touch`),e.classList.toggle(`cdk-keyboard-focused`,i===`keyboard`),e.classList.toggle(`cdk-mouse-focused`,i===`mouse`),e.classList.toggle(`cdk-program-focused`,i===`program`)}_setOrigin(e,i=!1){this._ngZone.runOutsideAngular(()=>{if(this._origin=e,this._originFromTouchInteraction=e===`touch`&&i,this._detectionMode===sc.IMMEDIATE){clearTimeout(this._originTimeoutId);let r=this._originFromTouchInteraction?ND:1;this._originTimeoutId=setTimeout(()=>this._origin=null,r)}})}_onFocus(e,i){let r=this._elementInfo.get(i),o=St(e);!r||!r.checkChildren&&i!==o||this._originChanged(i,this._getFocusOrigin(o),r)}_onBlur(e,i){let r=this._elementInfo.get(i);!r||r.checkChildren&&e.relatedTarget instanceof Node&&i.contains(e.relatedTarget)||(this._setClasses(i),this._emitOrigin(r,null))}_emitOrigin(e,i){e.subject.observers.length&&this._ngZone.run(()=>e.subject.next(i))}_registerGlobalListeners(e){if(!this._platform.isBrowser)return;let i=e.rootNode,r=this._rootNodeFocusListenerCount.get(i)||0;r||this._ngZone.runOutsideAngular(()=>{i.addEventListener(`focus`,this._rootNodeFocusAndBlurListener,Du),i.addEventListener(`blur`,this._rootNodeFocusAndBlurListener,Du)}),this._rootNodeFocusListenerCount.set(i,r+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener(`focus`,this._windowFocusListener)}),this._inputModalityDetector.modalityDetected.pipe(at(this._stopInputModalityDetector)).subscribe(o=>{this._setOrigin(o,!0)}))}_removeGlobalListeners(e){let i=e.rootNode;if(this._rootNodeFocusListenerCount.has(i)){let r=this._rootNodeFocusListenerCount.get(i);r>1?this._rootNodeFocusListenerCount.set(i,r-1):(i.removeEventListener(`focus`,this._rootNodeFocusAndBlurListener,Du),i.removeEventListener(`blur`,this._rootNodeFocusAndBlurListener,Du),this._rootNodeFocusListenerCount.delete(i))}--this._monitoredElementCount||(this._getWindow().removeEventListener(`focus`,this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId))}_originChanged(e,i,r){this._setClasses(e,i),this._emitOrigin(r,i),this._lastFocusOrigin=i}_getClosestElementsInfo(e){let i=[];return this._elementInfo.forEach((r,o)=>{(o===e||r.checkChildren&&o.contains(e))&&i.push([o,r])}),i}_isLastInteractionFromInputLabel(e){let{_mostRecentTarget:i,mostRecentModality:r}=this._inputModalityDetector;if(r!==`mouse`||!i||i===e||e.nodeName!==`INPUT`&&e.nodeName!==`TEXTAREA`||e.disabled)return!1;let o=e.labels;if(o){for(let s=0;s<o.length;s++)if(o[s].contains(i))return!0}return!1}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var IP=(()=>{class n{_elementRef=u(N);_focusMonitor=u(ai);_monitorSubscription;_focusOrigin=null;cdkFocusChange=new z;get focusOrigin(){return this._focusOrigin}ngAfterViewInit(){let e=this._elementRef.nativeElement;this._monitorSubscription=this._focusMonitor.monitor(e,e.nodeType===1&&e.hasAttribute(`cdkMonitorSubtreeFocus`)).subscribe(i=>{this._focusOrigin=i,this.cdkFocusChange.emit(i)})}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef),this._monitorSubscription?.unsubscribe()}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`cdkMonitorElementFocus`,``],[``,`cdkMonitorSubtreeFocus`,``]],outputs:{cdkFocusChange:`cdkFocusChange`},exportAs:[`cdkMonitorFocus`]})}return n})();var Eu=new WeakMap;var qe=(()=>{class n{_appRef;_injector=u(T);_environmentInjector=u(_e);load(e){let i=this._appRef=this._appRef||this._injector.get(vt),r=Eu.get(i);r||(r={loaders:new Set,refs:[]},Eu.set(i,r),i.onDestroy(()=>{Eu.get(i)?.refs.forEach(o=>o.destroy()),Eu.delete(i)})),r.loaders.has(e)||(r.loaders.add(e),r.refs.push(Fd(e,{environmentInjector:this._environmentInjector})))}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var Iu=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`ng-component`]],exportAs:[`cdkVisuallyHidden`],decls:0,vars:0,template:function(i,r){},styles:[`.cdk-visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
  outline: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  left: 0;
}
[dir=rtl] .cdk-visually-hidden {
  left: auto;
  right: 0;
}
`],encapsulation:2})}return n})();var xu;function NP(){if(xu===void 0&&(xu=null,typeof window<`u`)){let n=window;if(n.trustedTypes!==void 0)try{xu=n.trustedTypes.createPolicy(`angular#components`,{createHTML:t=>t})}catch(t){console.error(t)}}return xu}function jr(n){return NP()?.createHTML(n)||n}function AD(n,t,e){n.innerHTML=jr(e.sanitize(ce.HTML,t)||``)}function MP(n){if(n.type===`characterData`&&n.target instanceof Comment)return!0;if(n.type===`childList`){for(let t=0;t<n.addedNodes.length;t++)if(!(n.addedNodes[t]instanceof Comment))return!1;for(let t=0;t<n.removedNodes.length;t++)if(!(n.removedNodes[t]instanceof Comment))return!1;return!0}return!1}var RD=(()=>{class n{create(e){return typeof MutationObserver>`u`?null:new MutationObserver(e)}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var kD=(()=>{class n{_mutationObserverFactory=u(RD);_observedElements=new Map;_ngZone=u(I);ngOnDestroy(){this._observedElements.forEach((e,i)=>this._cleanupObserver(i))}observe(e){let i=wt(e);return new V(r=>{let s=this._observeElement(i).pipe(H(a=>a.filter(c=>!MP(c))),re(a=>!!a.length)).subscribe(a=>{this._ngZone.run(()=>{r.next(a)})});return()=>{s.unsubscribe(),this._unobserveElement(i)}})}_observeElement(e){return this._ngZone.runOutsideAngular(()=>{if(this._observedElements.has(e))this._observedElements.get(e).count++;else{let i=new w,r=this._mutationObserverFactory.create(o=>i.next(o));r&&r.observe(e,{characterData:!0,childList:!0,subtree:!0}),this._observedElements.set(e,{observer:r,stream:i,count:1})}return this._observedElements.get(e).stream})}_unobserveElement(e){this._observedElements.has(e)&&(this._observedElements.get(e).count--,this._observedElements.get(e).count||this._cleanupObserver(e))}_cleanupObserver(e){if(this._observedElements.has(e)){let{observer:i,stream:r}=this._observedElements.get(e);i&&i.disconnect(),r.complete(),this._observedElements.delete(e)}}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var OD=(()=>{class n{_contentObserver=u(kD);_elementRef=u(N);event=new z;get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._disabled?this._unsubscribe():this._subscribe()}_disabled=!1;get debounce(){return this._debounce}set debounce(e){this._debounce=Yt(e),this._subscribe()}_debounce;_currentSubscription=null;ngAfterContentInit(){!this._currentSubscription&&!this.disabled&&this._subscribe()}ngOnDestroy(){this._unsubscribe()}_subscribe(){this._unsubscribe();let e=this._contentObserver.observe(this._elementRef);this._currentSubscription=(this.debounce?e.pipe(Yi(this.debounce)):e).subscribe(this.event)}_unsubscribe(){this._currentSubscription?.unsubscribe()}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`cdkObserveContent`,``]],inputs:{disabled:[2,`cdkObserveContentDisabled`,`disabled`,te],debounce:`debounce`},outputs:{event:`cdkObserveContent`},exportAs:[`cdkObserveContent`]})}return n})();var ts=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({providers:[RD]})}return n})();var Mu=(()=>{class n{_platform=u(fe);isDisabled(e){return e.hasAttribute(`disabled`)}isVisible(e){return AP(e)&&getComputedStyle(e).visibility===`visible`}isTabbable(e){if(!this._platform.isBrowser)return!1;let i=TP(VP(e));if(i&&(PD(i)===-1||!this.isVisible(i)))return!1;let r=e.nodeName.toLowerCase(),o=PD(e);return e.hasAttribute(`contenteditable`)?o!==-1:r===`iframe`||r===`object`||this._platform.WEBKIT&&this._platform.IOS&&!LP(e)?!1:r===`audio`?e.hasAttribute(`controls`)?o!==-1:!1:r===`video`?o===-1?!1:o!==null?!0:this._platform.FIREFOX||e.hasAttribute(`controls`):e.tabIndex>=0}isFocusable(e,i){return jP(e)&&!this.isDisabled(e)&&(i?.ignoreVisibility||this.isVisible(e))}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function TP(n){try{return n.frameElement}catch{return null}}function AP(n){return!!(n.offsetWidth||n.offsetHeight||typeof n.getClientRects==`function`&&n.getClientRects().length)}function RP(n){let t=n.nodeName.toLowerCase();return t===`input`||t===`select`||t===`button`||t===`textarea`}function kP(n){return PP(n)&&n.type==`hidden`}function OP(n){return FP(n)&&n.hasAttribute(`href`)}function PP(n){return n.nodeName.toLowerCase()==`input`}function FP(n){return n.nodeName.toLowerCase()==`a`}function jD(n){if(!n.hasAttribute(`tabindex`)||n.tabIndex===void 0)return!1;let t=n.getAttribute(`tabindex`);return!!(t&&!isNaN(parseInt(t,10)))}function PD(n){if(!jD(n))return null;let t=parseInt(n.getAttribute(`tabindex`)||``,10);return isNaN(t)?-1:t}function LP(n){let t=n.nodeName.toLowerCase(),e=t===`input`&&n.type;return e===`text`||e===`password`||t===`select`||t===`textarea`}function jP(n){return kP(n)?!1:RP(n)||OP(n)||n.hasAttribute(`contenteditable`)||jD(n)}function VP(n){return n.ownerDocument&&n.ownerDocument.defaultView||window}var Nu=class{_element;_checker;_ngZone;_document;_injector;_startAnchor=null;_endAnchor=null;_hasAttached=!1;startAnchorListener=()=>{!this.focusLastTabbableElement()&&this._checker.isFocusable(this._element)&&this._element.focus()};endAnchorListener=()=>{!this.focusFirstTabbableElement()&&this._checker.isFocusable(this._element)&&this._element.focus()};get enabled(){return this._enabled}set enabled(t){this._enabled=t,this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(t,this._startAnchor),this._toggleAnchorTabIndex(t,this._endAnchor))}_enabled=!0;constructor(t,e,i,r,o=!1,s){this._element=t,this._checker=e,this._ngZone=i,this._document=r,this._injector=s,o||this.attachAnchors()}destroy(){let t=this._startAnchor,e=this._endAnchor;t&&(t.removeEventListener(`focus`,this.startAnchorListener),t.remove()),e&&(e.removeEventListener(`focus`,this.endAnchorListener),e.remove()),this._startAnchor=this._endAnchor=null,this._hasAttached=!1}attachAnchors(){return this._hasAttached?!0:(this._ngZone.runOutsideAngular(()=>{this._startAnchor||(this._startAnchor=this._createAnchor(),this._startAnchor.addEventListener(`focus`,this.startAnchorListener)),this._endAnchor||(this._endAnchor=this._createAnchor(),this._endAnchor.addEventListener(`focus`,this.endAnchorListener))}),this._element.parentNode&&(this._element.parentNode.insertBefore(this._startAnchor,this._element),this._element.parentNode.insertBefore(this._endAnchor,this._element.nextSibling),this._hasAttached=!0),this._hasAttached)}focusInitialElementWhenReady(t){return new Promise(e=>{this._executeOnStable(()=>e(this.focusInitialElement(t)))})}focusFirstTabbableElementWhenReady(t){return new Promise(e=>{this._executeOnStable(()=>e(this.focusFirstTabbableElement(t)))})}focusLastTabbableElementWhenReady(t){return new Promise(e=>{this._executeOnStable(()=>e(this.focusLastTabbableElement(t)))})}_getRegionBoundary(t){let e=this._element.querySelectorAll(`[cdk-focus-region-${t}], [cdkFocusRegion${t}], [cdk-focus-${t}]`);return t==`start`?e.length?e[0]:this._getFirstTabbableElement(this._element):e.length?e[e.length-1]:this._getLastTabbableElement(this._element)}focusInitialElement(t){let e=this._element.querySelector(`[cdk-focus-initial], [cdkFocusInitial]`);if(e){if(!this._checker.isFocusable(e)){let i=this._getFirstTabbableElement(e);return i?.focus(t),!!i}return e.focus(t),!0}return this.focusFirstTabbableElement(t)}focusFirstTabbableElement(t){let e=this._getRegionBoundary(`start`);return e&&e.focus(t),!!e}focusLastTabbableElement(t){let e=this._getRegionBoundary(`end`);return e&&e.focus(t),!!e}hasAttached(){return this._hasAttached}_getFirstTabbableElement(t){if(this._checker.isFocusable(t)&&this._checker.isTabbable(t))return t;let e=t.children;for(let i=0;i<e.length;i++){let r=e[i].nodeType===this._document.ELEMENT_NODE?this._getFirstTabbableElement(e[i]):null;if(r)return r}return null}_getLastTabbableElement(t){if(this._checker.isFocusable(t)&&this._checker.isTabbable(t))return t;let e=t.children;for(let i=e.length-1;i>=0;i--){let r=e[i].nodeType===this._document.ELEMENT_NODE?this._getLastTabbableElement(e[i]):null;if(r)return r}return null}_createAnchor(){let t=this._document.createElement(`div`);return this._toggleAnchorTabIndex(this._enabled,t),t.classList.add(`cdk-visually-hidden`),t.classList.add(`cdk-focus-trap-anchor`),t.setAttribute(`aria-hidden`,`true`),t}_toggleAnchorTabIndex(t,e){t?e.setAttribute(`tabindex`,`0`):e.removeAttribute(`tabindex`)}toggleAnchors(t){this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(t,this._startAnchor),this._toggleAnchorTabIndex(t,this._endAnchor))}_executeOnStable(t){xt(t,{injector:this._injector})}};var Lg=(()=>{class n{_checker=u(Mu);_ngZone=u(I);_document=u(M);_injector=u(T);constructor(){u(qe).load(Iu)}create(e,i=!1){return new Nu(e,this._checker,this._ngZone,this._document,i,this._injector)}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var VD=new g(`liveAnnouncerElement`,{providedIn:`root`,factory:()=>null});var BD=new g(`LIVE_ANNOUNCER_DEFAULT_OPTIONS`);var BP=0;var UP=(()=>{class n{_ngZone=u(I);_defaultOptions=u(BD,{optional:!0});_liveElement;_document=u(M);_sanitizer=u(Ha);_previousTimeout;_currentPromise;_currentResolve;constructor(){let e=u(VD,{optional:!0});this._liveElement=e||this._createLiveElement()}announce(e,...i){let r=this._defaultOptions,o,s;return i.length===1&&typeof i[0]==`number`?s=i[0]:[o,s]=i,this.clear(),clearTimeout(this._previousTimeout),o||(o=r&&r.politeness?r.politeness:`polite`),s==null&&r&&(s=r.duration),this._liveElement.setAttribute(`aria-live`,o),this._liveElement.id&&this._exposeAnnouncerToModals(this._liveElement.id),this._ngZone.runOutsideAngular(()=>(this._currentPromise||(this._currentPromise=new Promise(a=>this._currentResolve=a)),clearTimeout(this._previousTimeout),this._previousTimeout=setTimeout(()=>{!e||typeof e==`string`?this._liveElement.textContent=e:AD(this._liveElement,e,this._sanitizer),typeof s==`number`&&(this._previousTimeout=setTimeout(()=>this.clear(),s)),this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0},100),this._currentPromise))}clear(){this._liveElement&&(this._liveElement.textContent=``)}ngOnDestroy(){clearTimeout(this._previousTimeout),this._liveElement?.remove(),this._liveElement=null,this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0}_createLiveElement(){let e=`cdk-live-announcer-element`,i=this._document.getElementsByClassName(e),r=this._document.createElement(`div`);for(let o=0;o<i.length;o++)i[o].remove();return r.classList.add(e),r.classList.add(`cdk-visually-hidden`),r.setAttribute(`aria-atomic`,`true`),r.setAttribute(`aria-live`,`polite`),r.id=`cdk-live-announcer-${BP++}`,this._document.body.appendChild(r),r}_exposeAnnouncerToModals(e){let i=this._document.querySelectorAll(`body > .cdk-overlay-container [aria-modal="true"]`);for(let r=0;r<i.length;r++){let o=i[r],s=o.getAttribute(`aria-owns`);s?s.indexOf(e)===-1&&o.setAttribute(`aria-owns`,s+` `+e):o.setAttribute(`aria-owns`,e)}}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var Pi=(function(n){return n[n.NONE=0]=`NONE`,n[n.BLACK_ON_WHITE=1]=`BLACK_ON_WHITE`,n[n.WHITE_ON_BLACK=2]=`WHITE_ON_BLACK`,n})(Pi||{});var FD=`cdk-high-contrast-black-on-white`;var LD=`cdk-high-contrast-white-on-black`;var Fg=`cdk-high-contrast-active`;var UD=(()=>{class n{_platform=u(fe);_hasCheckedHighContrastMode=!1;_document=u(M);_breakpointSubscription;constructor(){this._breakpointSubscription=u(Rg).observe(`(forced-colors: active)`).subscribe(()=>{this._hasCheckedHighContrastMode&&(this._hasCheckedHighContrastMode=!1,this._applyBodyHighContrastModeCssClasses())})}getHighContrastMode(){if(!this._platform.isBrowser)return Pi.NONE;let e=this._document.createElement(`div`);e.style.backgroundColor=`rgb(1,2,3)`,e.style.position=`absolute`,this._document.body.appendChild(e);let i=this._document.defaultView||window,r=i&&i.getComputedStyle?i.getComputedStyle(e):null,o=(r&&r.backgroundColor||``).replace(/ /g,``);switch(e.remove(),o){case`rgb(0,0,0)`:case`rgb(45,50,54)`:case`rgb(32,32,32)`:return Pi.WHITE_ON_BLACK;case`rgb(255,255,255)`:case`rgb(255,250,239)`:return Pi.BLACK_ON_WHITE}return Pi.NONE}ngOnDestroy(){this._breakpointSubscription.unsubscribe()}_applyBodyHighContrastModeCssClasses(){if(!this._hasCheckedHighContrastMode&&this._platform.isBrowser&&this._document.body){let e=this._document.body.classList;e.remove(Fg,FD,LD),this._hasCheckedHighContrastMode=!0;let i=this.getHighContrastMode();i===Pi.BLACK_ON_WHITE?e.add(Fg,FD):i===Pi.WHITE_ON_BLACK&&e.add(Fg,LD)}}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var jg=(()=>{class n{constructor(){u(UD)._applyBodyHighContrastModeCssClasses()}static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[ts]})}return n})();var HP=200;var Tu=class{_letterKeyStream=new w;_items=[];_selectedItemIndex=-1;_pressedLetters=[];_skipPredicateFn;_selectedItem=new w;selectedItem=this._selectedItem;constructor(t,e){let i=typeof e?.debounceInterval==`number`?e.debounceInterval:HP;e?.skipPredicate&&(this._skipPredicateFn=e.skipPredicate),this.setItems(t),this._setupKeyHandler(i)}destroy(){this._pressedLetters=[],this._letterKeyStream.complete(),this._selectedItem.complete()}setCurrentSelectedItemIndex(t){this._selectedItemIndex=t}setItems(t){this._items=t}handleKey(t){let e=t.keyCode;t.key&&t.key.length===1?this._letterKeyStream.next(t.key.toLocaleUpperCase()):(e>=65&&e<=90||e>=48&&e<=57)&&this._letterKeyStream.next(String.fromCharCode(e))}isTyping(){return this._pressedLetters.length>0}reset(){this._pressedLetters=[]}_setupKeyHandler(t){this._letterKeyStream.pipe(Ze(e=>this._pressedLetters.push(e)),Yi(t),re(()=>this._pressedLetters.length>0),H(()=>this._pressedLetters.join(``).toLocaleUpperCase())).subscribe(e=>{for(let i=1;i<this._items.length+1;i++){let r=(this._selectedItemIndex+i)%this._items.length,o=this._items[r];if(!this._skipPredicateFn?.(o)&&o.getLabel?.().toLocaleUpperCase().trim().indexOf(e)===0){this._selectedItem.next(o);break}}this._pressedLetters=[]})}};function Pn(n,...t){return t.length?t.some(e=>n[e]):n.altKey||n.shiftKey||n.ctrlKey||n.metaKey}var ns=class{_items;_activeItemIndex=C(-1);_activeItem=C(null);_wrap=!1;_typeaheadSubscription=Q.EMPTY;_itemChangesSubscription;_vertical=!0;_horizontal=null;_allowedModifierKeys=[];_homeAndEnd=!1;_pageUpAndDown={enabled:!1,delta:10};_effectRef;_typeahead;_skipPredicateFn=t=>t.disabled;constructor(t,e){this._items=t,t instanceof Zn?this._itemChangesSubscription=t.changes.subscribe(i=>this._itemsChanged(i.toArray())):sn(t)&&(this._effectRef=dt(()=>this._itemsChanged(t()),{injector:e}))}tabOut=new w;change=new w;skipPredicate(t){return this._skipPredicateFn=t,this}withWrap(t=!0){return this._wrap=t,this}withVerticalOrientation(t=!0){return this._vertical=t,this}withHorizontalOrientation(t){return this._horizontal=t,this}withAllowedModifierKeys(t){return this._allowedModifierKeys=t,this}withTypeAhead(t=200){this._typeaheadSubscription.unsubscribe();let e=this._getItemsArray();return this._typeahead=new Tu(e,{debounceInterval:typeof t==`number`?t:void 0,skipPredicate:i=>this._skipPredicateFn(i)}),this._typeaheadSubscription=this._typeahead.selectedItem.subscribe(i=>{this.setActiveItem(i)}),this}cancelTypeahead(){return this._typeahead?.reset(),this}withHomeAndEnd(t=!0){return this._homeAndEnd=t,this}withPageUpDown(t=!0,e=10){return this._pageUpAndDown={enabled:t,delta:e},this}setActiveItem(t){let e=this._activeItem();this.updateActiveItem(t),this._activeItem()!==e&&this.change.next(this._activeItemIndex())}onKeydown(t){let e=t.keyCode,r=[`altKey`,`ctrlKey`,`metaKey`,`shiftKey`].every(o=>!t[o]||this._allowedModifierKeys.indexOf(o)>-1);switch(e){case 9:this.tabOut.next();return;case 40:if(this._vertical&&r){this.setNextItemActive();break}else return;case 38:if(this._vertical&&r){this.setPreviousItemActive();break}else return;case 39:if(this._horizontal&&r){this._horizontal===`rtl`?this.setPreviousItemActive():this.setNextItemActive();break}else return;case 37:if(this._horizontal&&r){this._horizontal===`rtl`?this.setNextItemActive():this.setPreviousItemActive();break}else return;case 36:if(this._homeAndEnd&&r){this.setFirstItemActive();break}else return;case 35:if(this._homeAndEnd&&r){this.setLastItemActive();break}else return;case 33:if(this._pageUpAndDown.enabled&&r){let o=this._activeItemIndex()-this._pageUpAndDown.delta;this._setActiveItemByIndex(o>0?o:0,1);break}else return;case 34:if(this._pageUpAndDown.enabled&&r){let o=this._activeItemIndex()+this._pageUpAndDown.delta,s=this._getItemsArray().length;this._setActiveItemByIndex(o<s?o:s-1,-1);break}else return;default:(r||Pn(t,`shiftKey`))&&this._typeahead?.handleKey(t);return}this._typeahead?.reset(),t.preventDefault()}get activeItemIndex(){return this._activeItemIndex()}get activeItem(){return this._activeItem()}isTyping(){return!!this._typeahead&&this._typeahead.isTyping()}setFirstItemActive(){this._setActiveItemByIndex(0,1)}setLastItemActive(){this._setActiveItemByIndex(this._getItemsArray().length-1,-1)}setNextItemActive(){this._activeItemIndex()<0?this.setFirstItemActive():this._setActiveItemByDelta(1)}setPreviousItemActive(){this._activeItemIndex()<0&&this._wrap?this.setLastItemActive():this._setActiveItemByDelta(-1)}updateActiveItem(t){let e=this._getItemsArray(),i=typeof t==`number`?t:e.indexOf(t),r=e[i];this._activeItem.set(r??null),this._activeItemIndex.set(i),this._typeahead?.setCurrentSelectedItemIndex(i)}destroy(){this._typeaheadSubscription.unsubscribe(),this._itemChangesSubscription?.unsubscribe(),this._effectRef?.destroy(),this._typeahead?.destroy(),this.tabOut.complete(),this.change.complete()}_setActiveItemByDelta(t){this._wrap?this._setActiveInWrapMode(t):this._setActiveInDefaultMode(t)}_setActiveInWrapMode(t){let e=this._getItemsArray();for(let i=1;i<=e.length;i++){let r=(this._activeItemIndex()+t*i+e.length)%e.length,o=e[r];if(!this._skipPredicateFn(o)){this.setActiveItem(r);return}}}_setActiveInDefaultMode(t){this._setActiveItemByIndex(this._activeItemIndex()+t,t)}_setActiveItemByIndex(t,e){let i=this._getItemsArray();if(i[t]){for(;this._skipPredicateFn(i[t]);)if(t+=e,!i[t])return;this.setActiveItem(t)}}_getItemsArray(){return sn(this._items)?this._items():this._items instanceof Zn?this._items.toArray():this._items}_itemsChanged(t){this._typeahead?.setItems(t);let e=this._activeItem();if(e){let i=t.indexOf(e);i>-1&&i!==this._activeItemIndex()&&(this._activeItemIndex.set(i),this._typeahead?.setCurrentSelectedItemIndex(i))}}};var Ug=class extends ns{setActiveItem(t){this.activeItem&&this.activeItem.setInactiveStyles(),super.setActiveItem(t),this.activeItem&&this.activeItem.setActiveStyles()}};var ac=class extends ns{_origin=`program`;setFocusOrigin(t){return this._origin=t,this}setActiveItem(t){super.setActiveItem(t),this.activeItem&&this.activeItem.focus(this._origin)}};var $D=new Map;var ot=class n{_appId=u(on);static _infix=`a${Math.floor(Math.random()*1e5).toString()}`;getId(t,e=!1){this._appId!==`ng`&&(t+=this._appId);let i=$D.get(t);return i===void 0?i=0:i++,$D.set(t,i),`${t}${e?n._infix+`-`:``}${i}`}static ɵfac=function(e){return new(e||n)};static ɵprov=b({token:n,factory:n.ɵfac})};var GD=` `;function zP(n,t,e){let i=Ru(n,t);e=e.trim(),!i.some(r=>r.trim()===e)&&(i.push(e),n.setAttribute(t,i.join(GD)))}function $P(n,t,e){let i=Ru(n,t);e=e.trim();let r=i.filter(o=>o!==e);r.length?n.setAttribute(t,r.join(GD)):n.removeAttribute(t)}function Ru(n,t){return n.getAttribute(t)?.match(/\S+/g)??[]}var qD=`cdk-describedby-message`;var Au=`cdk-describedby-host`;var zg=0;var fQ=(()=>{class n{_platform=u(fe);_document=u(M);_messageRegistry=new Map;_messagesContainer=null;_id=`${zg++}`;constructor(){u(qe).load(Iu),this._id=u(on)+`-`+zg++}describe(e,i,r){if(!this._canBeDescribed(e,i))return;let o=Hg(i,r);typeof i!=`string`?(WD(i,this._id),this._messageRegistry.set(o,{messageElement:i,referenceCount:0})):this._messageRegistry.has(o)||this._createMessageElement(i,r),this._isElementDescribedByMessage(e,o)||this._addMessageReference(e,o)}removeDescription(e,i,r){if(!i||!this._isElementNode(e))return;let o=Hg(i,r);if(this._isElementDescribedByMessage(e,o)&&this._removeMessageReference(e,o),typeof i==`string`){let s=this._messageRegistry.get(o);s&&s.referenceCount===0&&this._deleteMessageElement(o)}this._messagesContainer?.childNodes.length===0&&(this._messagesContainer.remove(),this._messagesContainer=null)}ngOnDestroy(){let e=this._document.querySelectorAll(`[${Au}="${this._id}"]`);for(let i=0;i<e.length;i++)this._removeCdkDescribedByReferenceIds(e[i]),e[i].removeAttribute(Au);this._messagesContainer?.remove(),this._messagesContainer=null,this._messageRegistry.clear()}_createMessageElement(e,i){let r=this._document.createElement(`div`);WD(r,this._id),r.textContent=e,i&&r.setAttribute(`role`,i),this._createMessagesContainer(),this._messagesContainer.appendChild(r),this._messageRegistry.set(Hg(e,i),{messageElement:r,referenceCount:0})}_deleteMessageElement(e){this._messageRegistry.get(e)?.messageElement?.remove(),this._messageRegistry.delete(e)}_createMessagesContainer(){if(this._messagesContainer)return;let e=`cdk-describedby-message-container`,i=this._document.querySelectorAll(`.${e}[platform="server"]`);for(let o=0;o<i.length;o++)i[o].remove();let r=this._document.createElement(`div`);r.style.visibility=`hidden`,r.classList.add(e),r.classList.add(`cdk-visually-hidden`),this._platform.isBrowser||r.setAttribute(`platform`,`server`),this._document.body.appendChild(r),this._messagesContainer=r}_removeCdkDescribedByReferenceIds(e){let i=Ru(e,`aria-describedby`).filter(r=>r.indexOf(qD)!=0);e.setAttribute(`aria-describedby`,i.join(` `))}_addMessageReference(e,i){let r=this._messageRegistry.get(i);zP(e,`aria-describedby`,r.messageElement.id),e.setAttribute(Au,this._id),r.referenceCount++}_removeMessageReference(e,i){let r=this._messageRegistry.get(i);r.referenceCount--,$P(e,`aria-describedby`,r.messageElement.id),e.removeAttribute(Au)}_isElementDescribedByMessage(e,i){let r=Ru(e,`aria-describedby`),o=this._messageRegistry.get(i),s=o&&o.messageElement.id;return!!s&&r.indexOf(s)!=-1}_canBeDescribed(e,i){if(!this._isElementNode(e))return!1;if(i&&typeof i==`object`)return!0;let r=i==null?``:`${i}`.trim(),o=e.getAttribute(`aria-label`);return r?!o||o.trim()!==r:!1}_isElementNode(e){return e.nodeType===this._document.ELEMENT_NODE}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function Hg(n,t){return typeof n==`string`?`${t||``}/${n}`:n}function WD(n,t){n.id||(n.id=`${qD}-${t}-${zg++}`)}var hn=(function(n){return n[n.NORMAL=0]=`NORMAL`,n[n.NEGATED=1]=`NEGATED`,n[n.INVERTED=2]=`INVERTED`,n})(hn||{});var ku;var Vr;function Ou(){if(Vr==null){if(typeof document!=`object`||!document||typeof Element!=`function`||!Element)return Vr=!1,Vr;if(document.documentElement?.style&&`scrollBehavior`in document.documentElement.style)Vr=!0;else{let n=Element.prototype.scrollTo;n?Vr=!/\{\s*\[native code\]\s*\}/.test(n.toString()):Vr=!1}}return Vr}function is(){if(typeof document!=`object`||!document)return hn.NORMAL;if(ku==null){let n=document.createElement(`div`),t=n.style;n.dir=`rtl`,t.width=`1px`,t.overflow=`auto`,t.visibility=`hidden`,t.pointerEvents=`none`,t.position=`absolute`;let e=document.createElement(`div`),i=e.style;i.width=`2px`,i.height=`1px`,n.appendChild(e),document.body.appendChild(n),ku=hn.NORMAL,n.scrollLeft===0&&(n.scrollLeft=1,ku=n.scrollLeft===0?hn.NEGATED:hn.INVERTED),n.remove()}return ku}function $g(){return typeof __karma__<`u`&&!!__karma__||typeof jasmine<`u`&&!!jasmine||typeof jest<`u`&&!!jest||typeof Mocha<`u`&&!!Mocha}var rs;var YD=[`color`,`button`,`checkbox`,`date`,`datetime-local`,`email`,`file`,`hidden`,`image`,`month`,`number`,`password`,`radio`,`range`,`reset`,`search`,`submit`,`tel`,`text`,`time`,`url`,`week`];function Wg(){if(rs)return rs;if(typeof document!=`object`||!document)return rs=new Set(YD),rs;let n=document.createElement(`input`);return rs=new Set(YD.filter(t=>(n.setAttribute(`type`,t),n.type===t))),rs}var WP=new g(`MATERIAL_ANIMATIONS`);var ZD=null;function Gg(){return u(WP,{optional:!0})?.animationsDisabled||u(aa,{optional:!0})===`NoopAnimations`?`di-disabled`:(ZD??=u(Cu).matchMedia(`(prefers-reduced-motion)`).matches,ZD?`reduced-motion`:`enabled`)}function Je(){return Gg()!==`enabled`}function je(n){return n==null?``:typeof n==`string`?n:`${n}px`}function Ct(n){return n!=null&&`${n}`!=`false`}var Zt=(function(n){return n[n.FADING_IN=0]=`FADING_IN`,n[n.VISIBLE=1]=`VISIBLE`,n[n.FADING_OUT=2]=`FADING_OUT`,n[n.HIDDEN=3]=`HIDDEN`,n})(Zt||{});var qg=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=Zt.HIDDEN;constructor(t,e,i,r=!1){this._renderer=t,this.element=e,this.config=i,this._animationForciblyDisabledThroughCss=r}fadeOut(){this._renderer.fadeOutRipple(this)}};var KD=es({passive:!0,capture:!0});var Yg=class{_events=new Map;addHandler(t,e,i,r){let o=this._events.get(e);if(o){let s=o.get(i);s?s.add(r):o.set(i,new Set([r]))}else this._events.set(e,new Map([[i,new Set([r])]])),t.runOutsideAngular(()=>{document.addEventListener(e,this._delegateEventHandler,KD)})}removeHandler(t,e,i){let r=this._events.get(t);if(!r)return;let o=r.get(e);o&&(o.delete(i),o.size===0&&r.delete(e),r.size===0&&(this._events.delete(t),document.removeEventListener(t,this._delegateEventHandler,KD)))}_delegateEventHandler=t=>{let e=St(t);e&&this._events.get(t.type)?.forEach((i,r)=>{(r===e||r.contains(e))&&i.forEach(o=>o.handleEvent(t))})}};var cc={enterDuration:225,exitDuration:150};var GP=800;var QD=es({passive:!0,capture:!0});var XD=[`mousedown`,`touchstart`];var JD=[`mouseup`,`mouseleave`,`touchend`,`touchcancel`];var qP=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`ng-component`]],hostAttrs:[`mat-ripple-style-loader`,``],decls:0,vars:0,template:function(i,r){},styles:[`.mat-ripple {
  overflow: hidden;
  position: relative;
}
.mat-ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-ripple.mat-ripple-unbounded {
  overflow: visible;
}

.mat-ripple-element {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: scale3d(0, 0, 0);
  background-color: var(--%NS%mat-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 10%, transparent));
}
@media (forced-colors: active) {
  .mat-ripple-element {
    display: none;
  }
}
.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {
  display: none;
}
`],encapsulation:2})}return n})();var Br=class n{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=!1;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=!1;_containerRect=null;static _eventManager=new Yg;constructor(t,e,i,r,o){this._target=t,this._ngZone=e,this._platform=r,r.isBrowser&&(this._containerElement=wt(i)),o&&o.get(qe).load(qP)}fadeInRipple(t,e,i={}){let r=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),o=p(p({},cc),i.animation);i.centered&&(t=r.left+r.width/2,e=r.top+r.height/2);let s=i.radius||YP(t,e,r),a=t-r.left,c=e-r.top,l=o.enterDuration,d=document.createElement(`div`);d.classList.add(`mat-ripple-element`),d.style.left=`${a-s}px`,d.style.top=`${c-s}px`,d.style.height=`${s*2}px`,d.style.width=`${s*2}px`,i.color!=null&&(d.style.backgroundColor=i.color),d.style.transitionDuration=`${l}ms`,this._containerElement.appendChild(d);let f=window.getComputedStyle(d),h=f.transitionProperty,m=f.transitionDuration,v=h===`none`||m===`0s`||m===`0s, 0s`||r.width===0&&r.height===0,y=new qg(this,d,i,v);d.style.transform=`scale3d(1, 1, 1)`,y.state=Zt.FADING_IN,i.persistent||(this._mostRecentTransientRipple=y);let R=null;return!v&&(l||o.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let k=()=>{R&&(R.fallbackTimer=null),clearTimeout(Ue),this._finishRippleTransition(y)},Se=()=>this._destroyRipple(y),Ue=setTimeout(Se,l+100);d.addEventListener(`transitionend`,k),d.addEventListener(`transitioncancel`,Se),R={onTransitionEnd:k,onTransitionCancel:Se,fallbackTimer:Ue}}),this._activeRipples.set(y,R),(v||!l)&&this._finishRippleTransition(y),y}fadeOutRipple(t){if(t.state===Zt.FADING_OUT||t.state===Zt.HIDDEN)return;let e=t.element,i=p(p({},cc),t.config.animation);e.style.transitionDuration=`${i.exitDuration}ms`,e.style.opacity=`0`,t.state=Zt.FADING_OUT,(t._animationForciblyDisabledThroughCss||!i.exitDuration)&&this._finishRippleTransition(t)}fadeOutAll(){this._getActiveRipples().forEach(t=>t.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(t=>{t.config.persistent||t.fadeOut()})}setupTriggerEvents(t){let e=wt(t);!this._platform.isBrowser||!e||e===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=e,XD.forEach(i=>{n._eventManager.addHandler(this._ngZone,i,e,this)}))}handleEvent(t){t.type===`mousedown`?this._onMousedown(t):t.type===`touchstart`?this._onTouchStart(t):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{JD.forEach(e=>{this._triggerElement.addEventListener(e,this,QD)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(t){t.state===Zt.FADING_IN?this._startFadeOutTransition(t):t.state===Zt.FADING_OUT&&this._destroyRipple(t)}_startFadeOutTransition(t){let e=t===this._mostRecentTransientRipple,{persistent:i}=t.config;t.state=Zt.VISIBLE,!i&&(!e||!this._isPointerDown)&&t.fadeOut()}_destroyRipple(t){let e=this._activeRipples.get(t)??null;this._activeRipples.delete(t),this._activeRipples.size||(this._containerRect=null),t===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),t.state=Zt.HIDDEN,e!==null&&(t.element.removeEventListener(`transitionend`,e.onTransitionEnd),t.element.removeEventListener(`transitioncancel`,e.onTransitionCancel),e.fallbackTimer!==null&&clearTimeout(e.fallbackTimer)),t.element.remove()}_onMousedown(t){let e=Fr(t),i=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+GP;!this._target.rippleDisabled&&!e&&!i&&(this._isPointerDown=!0,this.fadeInRipple(t.clientX,t.clientY,this._target.rippleConfig))}_onTouchStart(t){if(!this._target.rippleDisabled&&!Lr(t)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let e=t.changedTouches;if(e)for(let i=0;i<e.length;i++)this.fadeInRipple(e[i].clientX,e[i].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(t=>{let e=t.state===Zt.VISIBLE||t.config.terminateOnPointerUp&&t.state===Zt.FADING_IN;!t.config.persistent&&e&&t.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let t=this._triggerElement;t&&(XD.forEach(e=>n._eventManager.removeHandler(e,t,this)),this._pointerUpEventsRegistered&&(JD.forEach(e=>t.removeEventListener(e,this,QD)),this._pointerUpEventsRegistered=!1))}};function YP(n,t,e){let i=Math.max(Math.abs(n-e.left),Math.abs(n-e.right)),r=Math.max(Math.abs(t-e.top),Math.abs(t-e.bottom));return Math.sqrt(i*i+r*r)}var lc=new g(`mat-ripple-global-options`);var eE=(()=>{class n{_elementRef=u(N);_animationsDisabled=Je();color;unbounded=!1;centered=!1;radius=0;animation;get disabled(){return this._disabled}set disabled(e){e&&this.fadeOutAllNonPersistent(),this._disabled=e,this._setupTriggerEventsIfEnabled()}_disabled=!1;get trigger(){return this._trigger||this._elementRef.nativeElement}set trigger(e){this._trigger=e,this._setupTriggerEventsIfEnabled()}_trigger;_rippleRenderer;_globalOptions;_isInitialized=!1;constructor(){let e=u(I),i=u(fe),r=u(lc,{optional:!0}),o=u(T);this._globalOptions=r||{},this._rippleRenderer=new Br(this,e,this._elementRef,i,o)}ngOnInit(){this._isInitialized=!0,this._setupTriggerEventsIfEnabled()}ngOnDestroy(){this._rippleRenderer._removeTriggerEvents()}fadeOutAll(){this._rippleRenderer.fadeOutAll()}fadeOutAllNonPersistent(){this._rippleRenderer.fadeOutAllNonPersistent()}get rippleConfig(){return{centered:this.centered,radius:this.radius,color:this.color,animation:p(p(p({},this._globalOptions.animation),this._animationsDisabled?{enterDuration:0,exitDuration:0}:{}),this.animation),terminateOnPointerUp:this._globalOptions.terminateOnPointerUp}}get rippleDisabled(){return this.disabled||!!this._globalOptions.disabled}_setupTriggerEventsIfEnabled(){!this.disabled&&this._isInitialized&&this._rippleRenderer.setupTriggerEvents(this.trigger)}launch(e,i=0,r){return typeof e==`number`?this._rippleRenderer.fadeInRipple(e,i,p(p({},this.rippleConfig),r)):this._rippleRenderer.fadeInRipple(0,0,p(p({},this.rippleConfig),e))}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`mat-ripple`,``],[``,`matRipple`,``]],hostAttrs:[1,`mat-ripple`],hostVars:2,hostBindings:function(i,r){i&2&&J(`mat-ripple-unbounded`,r.unbounded)},inputs:{color:[0,`matRippleColor`,`color`],unbounded:[0,`matRippleUnbounded`,`unbounded`],centered:[0,`matRippleCentered`,`centered`],radius:[0,`matRippleRadius`,`radius`],animation:[0,`matRippleAnimation`,`animation`],disabled:[0,`matRippleDisabled`,`disabled`],trigger:[0,`matRippleTrigger`,`trigger`]},exportAs:[`matRipple`]})}return n})();var ZP={capture:!0};var KP=[`focus`,`mousedown`,`mouseenter`,`touchstart`];var Zg=`mat-ripple-loader-uninitialized`;var Kg=`mat-ripple-loader-class-name`;var tE=`mat-ripple-loader-centered`;var Pu=`mat-ripple-loader-disabled`;var nE=(()=>{class n{_document=u(M);_animationsDisabled=Je();_globalRippleOptions=u(lc,{optional:!0});_platform=u(fe);_ngZone=u(I);_injector=u(T);_eventCleanups;_hosts=new Map;constructor(){let e=u(Ve).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>KP.map(i=>e.listen(this._document,i,this._onInteraction,ZP)))}ngOnDestroy(){let e=this._hosts.keys();for(let i of e)this.destroyRipple(i);this._eventCleanups.forEach(i=>i())}configureRipple(e,i){e.setAttribute(Zg,this._globalRippleOptions?.namespace??``),(i.className||!e.hasAttribute(Kg))&&e.setAttribute(Kg,i.className||``),i.centered&&e.setAttribute(tE,``),i.disabled&&e.setAttribute(Pu,``)}setDisabled(e,i){let r=this._hosts.get(e);r?(r.target.rippleDisabled=i,!i&&!r.hasSetUpEvents&&(r.hasSetUpEvents=!0,r.renderer.setupTriggerEvents(e))):i?e.setAttribute(Pu,``):e.removeAttribute(Pu)}_onInteraction=e=>{let i=St(e);if(i instanceof HTMLElement){let r=i.closest(`[${Zg}="${this._globalRippleOptions?.namespace??``}"]`);r&&this._createRipple(r)}};_createRipple(e){if(!this._document||this._hosts.has(e))return;e.querySelector(`.mat-ripple`)?.remove();let i=this._document.createElement(`span`);i.classList.add(`mat-ripple`,e.getAttribute(Kg)),e.append(i);let r=this._globalRippleOptions,o=this._animationsDisabled?0:r?.animation?.enterDuration??cc.enterDuration,s=this._animationsDisabled?0:r?.animation?.exitDuration??cc.exitDuration,a={rippleDisabled:this._animationsDisabled||r?.disabled||e.hasAttribute(Pu),rippleConfig:{centered:e.hasAttribute(tE),terminateOnPointerUp:r?.terminateOnPointerUp,animation:{enterDuration:o,exitDuration:s}}},c=new Br(a,this._ngZone,i,this._platform,this._injector),l=!a.rippleDisabled;l&&c.setupTriggerEvents(e),this._hosts.set(e,{target:a,renderer:c,hasSetUpEvents:l}),e.removeAttribute(Zg)}destroyRipple(e){let i=this._hosts.get(e);i&&(i.renderer._removeTriggerEvents(),this._hosts.delete(e))}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var os=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`structural-styles`]],decls:0,vars:0,template:function(i,r){},styles:[`.mat-focus-indicator {
  position: relative;
}
.mat-focus-indicator::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  display: var(--%NS%mat-focus-indicator-display, none);
  border-width: var(--%NS%mat-focus-indicator-border-width, 3px);
  border-style: var(--%NS%mat-focus-indicator-border-style, solid);
  border-color: var(--%NS%mat-focus-indicator-border-color, transparent);
  border-radius: var(--%NS%mat-focus-indicator-border-radius, 4px);
}
.mat-focus-indicator:focus-visible::before {
  content: "";
}

@media (forced-colors: active) {
  html {
    --%NS%mat-focus-indicator-display: block;
    --%NS%mat-focus-indicator-fallback-border-style: none;
  }
}
`],encapsulation:2})}return n})();var QP=[`*`,[[``,`progressIndicator`,``]]];var XP=[`*`,`[progressIndicator]`];function JP(n,t){n&1&&(ft(0,`div`,1),ee(1,1),_t())}var eF=new g(`MAT_BUTTON_CONFIG`);function iE(n){return n==null?void 0:Oo(n)}var Fu=(()=>{class n{_elementRef=u(N);_ngZone=u(I);_animationsDisabled=Je();_config=u(eF,{optional:!0});_focusMonitor=u(ai);_cleanupClick;_renderer=u(ge);_rippleLoader=u(nE);_isAnchor;_isFab=!1;color;get disableRipple(){return this._disableRipple}set disableRipple(e){this._disableRipple=e,this._updateRippleDisabled()}_disableRipple=!1;get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._updateRippleDisabled()}_disabled=!1;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(e){this.tabIndex=e}showProgress=Mi(!1,{transform:te});constructor(){u(qe).load(os);let e=this._elementRef.nativeElement;this._isAnchor=e.tagName===`A`,this.disabledInteractive=this._config?.disabledInteractive??!1,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(e,{className:`mat-mdc-button-ripple`})}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0),this._isAnchor&&this._setupAsAnchor()}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement)}focus(e=`program`,i){e?this._focusMonitor.focusVia(this._elementRef.nativeElement,e,i):this._elementRef.nativeElement.focus(i)}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:!0}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled)}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,`click`,e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}))}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,hostAttrs:[1,`mat-mdc-button-base`],hostVars:15,hostBindings:function(i,r){i&2&&(ie(`disabled`,r._getDisabledAttribute())(`aria-disabled`,r._getAriaDisabled())(`tabindex`,r._getTabIndex()),Jn(r.color?`mat-`+r.color:``),J(`mat-mdc-button-progress-indicator-shown`,r.showProgress())(`mat-mdc-button-disabled`,r.disabled)(`mat-mdc-button-disabled-interactive`,r.disabledInteractive)(`mat-unthemed`,!r.color)(`_mat-animation-noopable`,r._animationsDisabled))},inputs:{color:`color`,disableRipple:[2,`disableRipple`,`disableRipple`,te],disabled:[2,`disabled`,`disabled`,te],ariaDisabled:[2,`aria-disabled`,`ariaDisabled`,te],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,te],tabIndex:[2,`tabIndex`,`tabIndex`,iE],_tabindex:[2,`tabindex`,`_tabindex`,iE],showProgress:[1,`showProgress`]}})}return n})();var tF=(()=>{class n extends Fu{constructor(){super(),this._rippleLoader.configureRipple(this._elementRef.nativeElement,{centered:!0})}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`button`,`mat-icon-button`,``],[`a`,`mat-icon-button`,``],[`button`,`matIconButton`,``],[`a`,`matIconButton`,``]],hostAttrs:[1,`mdc-icon-button`,`mat-mdc-icon-button`],exportAs:[`matButton`,`matAnchor`],features:[ae],ngContentSelectors:XP,decls:5,vars:1,consts:[[1,`mat-mdc-button-persistent-ripple`,`mdc-icon-button__ripple`],[1,`mat-mdc-button-progress-indicator-container`],[1,`mat-focus-indicator`],[1,`mat-mdc-button-touch-target`]],template:function(i,r){i&1&&(Ge(QP),It(0,`span`,0),ee(1),Me(2,JP,2,0,`div`,1),It(3,`span`,2)(4,`span`,3)),i&2&&(le(2),Te(r.showProgress()?2:-1))},styles:[`.mat-mdc-icon-button {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: transparent;
  fill: currentColor;
  text-decoration: none;
  cursor: pointer;
  z-index: 0;
  overflow: visible;
  border-radius: var(--%NS%mat-icon-button-container-shape, var(--%NS%mat-sys-corner-full, 50%));
  flex-shrink: 0;
  text-align: center;
  width: var(--%NS%mat-icon-button-state-layer-size, 40px);
  height: var(--%NS%mat-icon-button-state-layer-size, 40px);
  padding: calc(calc(var(--%NS%mat-icon-button-state-layer-size, 40px) - var(--%NS%mat-icon-button-icon-size, 24px)) / 2);
  font-size: var(--%NS%mat-icon-button-icon-size, 24px);
  color: var(--%NS%mat-icon-button-icon-color, var(--%NS%mat-sys-on-surface-variant));
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-icon-button .mat-mdc-button-ripple,
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-icon-button .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-icon-button .mdc-button__label,
.mat-mdc-icon-button .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-icon-button .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
}
.mat-mdc-icon-button:focus-visible > .mat-focus-indicator::before {
  content: "";
  border-radius: inherit;
}
.mat-mdc-icon-button .mat-ripple-element {
  background-color: var(--%NS%mat-icon-button-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface-variant) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-icon-button-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-icon-button-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-icon-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-icon-button-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-icon-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-icon-button-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-icon-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-icon-button-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-icon-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-icon-button-touch-target-size, 48px);
  display: var(--%NS%mat-icon-button-touch-target-display, block);
  left: 50%;
  width: var(--%NS%mat-icon-button-touch-target-size, 48px);
  transform: translate(-50%, -50%);
}
.mat-mdc-icon-button._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-icon-button[disabled], .mat-mdc-icon-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-icon-button-disabled-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-icon-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-icon-button img,
.mat-mdc-icon-button svg {
  width: var(--%NS%mat-icon-button-icon-size, 24px);
  height: var(--%NS%mat-icon-button-icon-size, 24px);
  vertical-align: baseline;
}
.mat-mdc-icon-button .mat-mdc-button-progress-indicator-container .mdc-circular-progress__determinate-circle-graphic {
  width: inherit;
  height: inherit;
}
.mat-mdc-icon-button .mat-mdc-button-progress-indicator-container .mdc-circular-progress__indeterminate-circle-graphic {
  height: 100%;
}
.mat-mdc-icon-button .mat-mdc-button-persistent-ripple {
  border-radius: var(--%NS%mat-icon-button-container-shape, var(--%NS%mat-sys-corner-full, 50%));
}
.mat-mdc-icon-button[hidden] {
  display: none;
}
.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before {
  background: transparent;
  opacity: 1;
}

.mat-mdc-button-progress-indicator-container {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.mat-mdc-button-progress-indicator-shown mat-icon {
  visibility: hidden;
}
`,`@media (forced-colors: active) {
  .mat-mdc-button:not(.mdc-button--outlined),
  .mat-mdc-unelevated-button:not(.mdc-button--outlined),
  .mat-mdc-raised-button:not(.mdc-button--outlined),
  .mat-mdc-outlined-button:not(.mdc-button--outlined),
  .mat-mdc-button-base.mat-tonal-button,
  .mat-mdc-icon-button.mat-mdc-icon-button,
  .mat-mdc-outlined-button .mdc-button__ripple {
    outline: solid 1px;
  }
}
`],encapsulation:2})}return n})();var nF=new g(`cdk-dir-doc`,{providedIn:`root`,factory:()=>u(M)});var iF=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function rE(n){let t=n?.toLowerCase()||``;return t===`auto`&&typeof navigator<`u`&&navigator?.language?iF.test(navigator.language)?`rtl`:`ltr`:t===`rtl`?`rtl`:`ltr`}var jt=(()=>{class n{get value(){return this.valueSignal()}valueSignal=C(`ltr`);change=new z;constructor(){let e=u(nF,{optional:!0});if(e){let i=e.body?e.body.dir:null,r=e.documentElement?e.documentElement.dir:null;this.valueSignal.set(rE(i||r||`ltr`))}}ngOnDestroy(){this.change.complete()}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var we=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({})}return n})();var ss=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[we]})}return n})();var sE=[[[``,8,`material-icons`,3,`iconPositionEnd`,``],[`mat-icon`,3,`iconPositionEnd`,``],[``,`matButtonIcon`,``,3,`iconPositionEnd`,``]],`*`,[[``,`iconPositionEnd`,``,8,`material-icons`],[`mat-icon`,`iconPositionEnd`,``],[``,`matButtonIcon`,``,`iconPositionEnd`,``]],[[``,`progressIndicator`,``]]];var aE=[`.material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])`,`*`,`.material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]`,`[progressIndicator]`];function rF(n,t){n&1&&(ft(0,`div`,2),ee(1,3),_t())}function oF(n,t){n&1&&(ft(0,`div`,2),ee(1,3),_t())}var oE=new Map([[`text`,[`mat-mdc-button`]],[`filled`,[`mdc-button--unelevated`,`mat-mdc-unelevated-button`]],[`elevated`,[`mdc-button--raised`,`mat-mdc-raised-button`]],[`outlined`,[`mdc-button--outlined`,`mat-mdc-outlined-button`]],[`tonal`,[`mat-tonal-button`]]]);var CX=(()=>{class n extends Fu{get appearance(){return this._appearance}set appearance(e){this.setAppearance(e||this._config?.defaultAppearance||`text`)}_appearance=null;constructor(){super();let e=sF(this._elementRef.nativeElement);e&&this.setAppearance(e)}setAppearance(e){if(e===this._appearance)return;let i=this._elementRef.nativeElement.classList,r=this._appearance?oE.get(this._appearance):null,o=oE.get(e);r&&i.remove(...r),i.add(...o),this._appearance=e}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`button`,`matButton`,``],[`a`,`matButton`,``],[`button`,`mat-button`,``],[`button`,`mat-raised-button`,``],[`button`,`mat-flat-button`,``],[`button`,`mat-stroked-button`,``],[`a`,`mat-button`,``],[`a`,`mat-raised-button`,``],[`a`,`mat-flat-button`,``],[`a`,`mat-stroked-button`,``]],hostAttrs:[1,`mdc-button`],inputs:{appearance:[0,`matButton`,`appearance`]},exportAs:[`matButton`,`matAnchor`],features:[ae],ngContentSelectors:aE,decls:8,vars:5,consts:[[1,`mat-mdc-button-persistent-ripple`],[1,`mdc-button__label`],[1,`mat-mdc-button-progress-indicator-container`],[1,`mat-focus-indicator`],[1,`mat-mdc-button-touch-target`]],template:function(i,r){i&1&&(Ge(sE),It(0,`span`,0),ee(1),ft(2,`span`,1),ee(3,1),_t(),ee(4,2),Me(5,rF,2,0,`div`,2),It(6,`span`,3)(7,`span`,4)),i&2&&(J(`mdc-button__ripple`,!r._isFab)(`mdc-fab__ripple`,r._isFab),le(5),Te(r.showProgress()?5:-1))},styles:[`.mat-mdc-button-base {
  text-decoration: none;
}
.mat-mdc-button-base .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
@media (hover: none) {
  .mat-mdc-button-base:hover > span.mat-mdc-button-persistent-ripple::before {
    opacity: 0;
  }
}

.mdc-button {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  border: none;
  outline: none;
  line-height: inherit;
  -webkit-appearance: none;
  overflow: visible;
  vertical-align: middle;
  background: transparent;
  padding: 0 8px;
}
.mdc-button::-moz-focus-inner {
  padding: 0;
  border: 0;
}
.mdc-button:active {
  outline: none;
}
.mdc-button:hover {
  cursor: pointer;
}
.mdc-button:disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-button[hidden] {
  display: none;
}
.mdc-button .mdc-button__label {
  position: relative;
}

.mat-mdc-button {
  padding: 0 var(--%NS%mat-button-text-horizontal-padding, 12px);
  height: var(--%NS%mat-button-text-container-height, 40px);
  font-family: var(--%NS%mat-button-text-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-text-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-button-text-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  text-transform: var(--%NS%mat-button-text-label-text-transform);
  font-weight: var(--%NS%mat-button-text-label-text-weight, var(--%NS%mat-sys-label-large-weight));
}
.mat-mdc-button, .mat-mdc-button .mdc-button__ripple {
  border-radius: var(--%NS%mat-button-text-container-shape, var(--%NS%mat-sys-corner-full));
}
.mat-mdc-button:not(:disabled) {
  color: var(--%NS%mat-button-text-label-text-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-button[disabled], .mat-mdc-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-button:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding: 0 var(--%NS%mat-button-text-with-icon-horizontal-padding, 16px);
}
.mat-mdc-button > .mat-icon {
  margin-right: var(--%NS%mat-button-text-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-text-icon-offset, -4px);
}
[dir=rtl] .mat-mdc-button > .mat-icon {
  margin-right: var(--%NS%mat-button-text-icon-offset, -4px);
  margin-left: var(--%NS%mat-button-text-icon-spacing, 8px);
}
.mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-text-icon-offset, -4px);
  margin-left: var(--%NS%mat-button-text-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-text-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-text-icon-offset, -4px);
}
.mat-mdc-button .mat-ripple-element {
  background-color: var(--%NS%mat-button-text-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-text-state-layer-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-text-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-text-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-text-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-text-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-button-text-touch-target-size, 48px);
  display: var(--%NS%mat-button-text-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-unelevated-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--%NS%mat-button-filled-container-height, 40px);
  font-family: var(--%NS%mat-button-filled-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-filled-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-button-filled-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  text-transform: var(--%NS%mat-button-filled-label-text-transform);
  font-weight: var(--%NS%mat-button-filled-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  padding: 0 var(--%NS%mat-button-filled-horizontal-padding, 24px);
}
.mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--%NS%mat-button-filled-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-filled-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--%NS%mat-button-filled-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-filled-icon-spacing, 8px);
}
.mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-filled-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-filled-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-filled-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-filled-icon-offset, -8px);
}
.mat-mdc-unelevated-button .mat-ripple-element {
  background-color: var(--%NS%mat-button-filled-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-filled-state-layer-color, var(--%NS%mat-sys-on-primary));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-filled-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-unelevated-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-filled-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-unelevated-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-filled-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-unelevated-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-filled-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-unelevated-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-button-filled-touch-target-size, 48px);
  display: var(--%NS%mat-button-filled-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-unelevated-button:not(:disabled) {
  color: var(--%NS%mat-button-filled-label-text-color, var(--%NS%mat-sys-on-primary));
  background-color: var(--%NS%mat-button-filled-container-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-unelevated-button, .mat-mdc-unelevated-button .mdc-button__ripple {
  border-radius: var(--%NS%mat-button-filled-container-shape, var(--%NS%mat-sys-corner-full));
}
.mat-mdc-unelevated-button .mat-mdc-button-progress-indicator-container {
  --%NS%mat-progress-spinner-active-indicator-color: var(--%NS%mat-button-filled-progress-active-indicator-color, var(--%NS%mat-sys-on-primary));
}
.mat-mdc-unelevated-button[disabled], .mat-mdc-unelevated-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-filled-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-raised-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--%NS%mat-button-protected-container-elevation-shadow, var(--%NS%mat-sys-level1));
  height: var(--%NS%mat-button-protected-container-height, 40px);
  font-family: var(--%NS%mat-button-protected-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-protected-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-button-protected-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  text-transform: var(--%NS%mat-button-protected-label-text-transform);
  font-weight: var(--%NS%mat-button-protected-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  padding: 0 var(--%NS%mat-button-protected-horizontal-padding, 24px);
}
.mat-mdc-raised-button > .mat-icon {
  margin-right: var(--%NS%mat-button-protected-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-protected-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-raised-button > .mat-icon {
  margin-right: var(--%NS%mat-button-protected-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-protected-icon-spacing, 8px);
}
.mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-protected-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-protected-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-protected-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-protected-icon-offset, -8px);
}
.mat-mdc-raised-button .mat-ripple-element {
  background-color: var(--%NS%mat-button-protected-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-protected-state-layer-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-protected-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-raised-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-protected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-raised-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-protected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-raised-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-protected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-raised-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-button-protected-touch-target-size, 48px);
  display: var(--%NS%mat-button-protected-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-raised-button:not(:disabled) {
  color: var(--%NS%mat-button-protected-label-text-color, var(--%NS%mat-sys-primary));
  background-color: var(--%NS%mat-button-protected-container-color, var(--%NS%mat-sys-surface));
}
.mat-mdc-raised-button, .mat-mdc-raised-button .mdc-button__ripple {
  border-radius: var(--%NS%mat-button-protected-container-shape, var(--%NS%mat-sys-corner-full));
}
@media (hover: hover) {
  .mat-mdc-raised-button:hover {
    box-shadow: var(--%NS%mat-button-protected-hover-container-elevation-shadow, var(--%NS%mat-sys-level2));
  }
}
.mat-mdc-raised-button:focus {
  box-shadow: var(--%NS%mat-button-protected-focus-container-elevation-shadow, var(--%NS%mat-sys-level1));
}
.mat-mdc-raised-button:active, .mat-mdc-raised-button:focus:active {
  box-shadow: var(--%NS%mat-button-protected-pressed-container-elevation-shadow, var(--%NS%mat-sys-level1));
}
.mat-mdc-raised-button[disabled], .mat-mdc-raised-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-protected-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-raised-button[disabled].mat-mdc-button-disabled, .mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled {
  box-shadow: var(--%NS%mat-button-protected-disabled-container-elevation-shadow, var(--%NS%mat-sys-level0));
}
.mat-mdc-raised-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-outlined-button {
  border-style: solid;
  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--%NS%mat-button-outlined-container-height, 40px);
  font-family: var(--%NS%mat-button-outlined-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-outlined-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-button-outlined-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  text-transform: var(--%NS%mat-button-outlined-label-text-transform);
  font-weight: var(--%NS%mat-button-outlined-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  border-radius: var(--%NS%mat-button-outlined-container-shape, var(--%NS%mat-sys-corner-full));
  border-width: var(--%NS%mat-button-outlined-outline-width, 1px);
  padding: 0 var(--%NS%mat-button-outlined-horizontal-padding, 24px);
}
.mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--%NS%mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-outlined-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--%NS%mat-button-outlined-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-outlined-icon-spacing, 8px);
}
.mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-outlined-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-outlined-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-outlined-icon-offset, -8px);
}
.mat-mdc-outlined-button .mat-ripple-element {
  background-color: var(--%NS%mat-button-outlined-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-outlined-state-layer-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-outlined-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-outlined-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-outlined-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-outlined-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-outlined-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-outlined-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-outlined-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-outlined-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-button-outlined-touch-target-size, 48px);
  display: var(--%NS%mat-button-outlined-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-outlined-button:not(:disabled) {
  color: var(--%NS%mat-button-outlined-label-text-color, var(--%NS%mat-sys-primary));
  border-color: var(--%NS%mat-button-outlined-outline-color, var(--%NS%mat-sys-outline));
}
.mat-mdc-outlined-button[disabled], .mat-mdc-outlined-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  border-color: var(--%NS%mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-tonal-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--%NS%mat-button-tonal-container-height, 40px);
  font-family: var(--%NS%mat-button-tonal-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-tonal-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-button-tonal-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  text-transform: var(--%NS%mat-button-tonal-label-text-transform);
  font-weight: var(--%NS%mat-button-tonal-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  padding: 0 var(--%NS%mat-button-tonal-horizontal-padding, 24px);
}
.mat-tonal-button:not(:disabled) {
  color: var(--%NS%mat-button-tonal-label-text-color, var(--%NS%mat-sys-on-secondary-container));
  background-color: var(--%NS%mat-button-tonal-container-color, var(--%NS%mat-sys-secondary-container));
}
.mat-tonal-button, .mat-tonal-button .mdc-button__ripple {
  border-radius: var(--%NS%mat-button-tonal-container-shape, var(--%NS%mat-sys-corner-full));
}
.mat-tonal-button[disabled], .mat-tonal-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-tonal-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-tonal-button > .mat-icon {
  margin-right: var(--%NS%mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-tonal-icon-offset, -8px);
}
[dir=rtl] .mat-tonal-button > .mat-icon {
  margin-right: var(--%NS%mat-button-tonal-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-tonal-icon-spacing, 8px);
}
.mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-tonal-icon-offset, -8px);
  margin-left: var(--%NS%mat-button-tonal-icon-spacing, 8px);
}
[dir=rtl] .mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--%NS%mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--%NS%mat-button-tonal-icon-offset, -8px);
}
.mat-tonal-button .mat-ripple-element {
  background-color: var(--%NS%mat-button-tonal-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-secondary-container) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-tonal-state-layer-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-button-tonal-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-tonal-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-tonal-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-tonal-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-tonal-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-tonal-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-button-tonal-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}
.mat-tonal-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-button-tonal-touch-target-size, 48px);
  display: var(--%NS%mat-button-tonal-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-button,
.mat-mdc-unelevated-button,
.mat-mdc-raised-button,
.mat-mdc-outlined-button,
.mat-tonal-button {
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-button .mdc-button__label,
.mat-mdc-button .mat-icon,
.mat-mdc-unelevated-button .mdc-button__label,
.mat-mdc-unelevated-button .mat-icon,
.mat-mdc-raised-button .mdc-button__label,
.mat-mdc-raised-button .mat-icon,
.mat-mdc-outlined-button .mdc-button__label,
.mat-mdc-outlined-button .mat-icon,
.mat-tonal-button .mdc-button__label,
.mat-tonal-button .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-button .mat-focus-indicator,
.mat-mdc-unelevated-button .mat-focus-indicator,
.mat-mdc-raised-button .mat-focus-indicator,
.mat-mdc-outlined-button .mat-focus-indicator,
.mat-tonal-button .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
}
.mat-mdc-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-unelevated-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-raised-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-outlined-button:focus-visible > .mat-focus-indicator::before,
.mat-tonal-button:focus-visible > .mat-focus-indicator::before {
  content: "";
  border-radius: inherit;
}
.mat-mdc-button._mat-animation-noopable,
.mat-mdc-unelevated-button._mat-animation-noopable,
.mat-mdc-raised-button._mat-animation-noopable,
.mat-mdc-outlined-button._mat-animation-noopable,
.mat-tonal-button._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-button > .mat-icon,
.mat-mdc-unelevated-button > .mat-icon,
.mat-mdc-raised-button > .mat-icon,
.mat-mdc-outlined-button > .mat-icon,
.mat-tonal-button > .mat-icon {
  display: inline-block;
  position: relative;
  vertical-align: top;
  font-size: 1.125rem;
  height: 1.125rem;
  width: 1.125rem;
}

.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mdc-button__ripple {
  top: -1px;
  left: -1px;
  bottom: -1px;
  right: -1px;
}

.mat-mdc-unelevated-button .mat-focus-indicator::before,
.mat-tonal-button .mat-focus-indicator::before,
.mat-mdc-raised-button .mat-focus-indicator::before {
  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px) * -1);
}

.mat-mdc-outlined-button .mat-focus-indicator::before {
  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 3px) * -1);
}

.mat-mdc-button-progress-indicator-container {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.mat-mdc-button-progress-indicator-shown mat-icon,
.mat-mdc-button-progress-indicator-shown [matButtonIcon],
.mat-mdc-button-progress-indicator-shown .mdc-button__label {
  visibility: hidden;
}
`,`@media (forced-colors: active) {
  .mat-mdc-button:not(.mdc-button--outlined),
  .mat-mdc-unelevated-button:not(.mdc-button--outlined),
  .mat-mdc-raised-button:not(.mdc-button--outlined),
  .mat-mdc-outlined-button:not(.mdc-button--outlined),
  .mat-mdc-button-base.mat-tonal-button,
  .mat-mdc-icon-button.mat-mdc-icon-button,
  .mat-mdc-outlined-button .mdc-button__ripple {
    outline: solid 1px;
  }
}
`],encapsulation:2})}return n})();function sF(n){return n.hasAttribute(`mat-raised-button`)?`elevated`:n.hasAttribute(`mat-stroked-button`)?`outlined`:n.hasAttribute(`mat-flat-button`)?`filled`:n.hasAttribute(`mat-button`)?`text`:null}var aF=new g(`mat-mdc-fab-default-options`,{providedIn:`root`,factory:()=>Qg});var Qg={color:`accent`};var DX=(()=>{class n extends Fu{_options=u(aF,{optional:!0});_isFab=!0;extended=!1;constructor(){super(),this._options=this._options||Qg,this.color=this._options.color||Qg.color}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`button`,`mat-fab`,``],[`a`,`mat-fab`,``],[`button`,`matFab`,``],[`a`,`matFab`,``]],hostAttrs:[1,`mdc-fab`,`mat-mdc-fab-base`,`mat-mdc-fab`],hostVars:4,hostBindings:function(i,r){i&2&&J(`mdc-fab--extended`,r.extended)(`mat-mdc-extended-fab`,r.extended)},inputs:{extended:[2,`extended`,`extended`,te]},exportAs:[`matButton`,`matAnchor`],features:[ae],ngContentSelectors:aE,decls:8,vars:5,consts:[[1,`mat-mdc-button-persistent-ripple`],[1,`mdc-button__label`],[1,`mat-mdc-button-progress-indicator-container`],[1,`mat-focus-indicator`],[1,`mat-mdc-button-touch-target`]],template:function(i,r){i&1&&(Ge(sE),It(0,`span`,0),ee(1),ft(2,`span`,1),ee(3,1),_t(),ee(4,2),Me(5,oF,2,0,`div`,2),It(6,`span`,3)(7,`span`,4)),i&2&&(J(`mdc-button__ripple`,!r._isFab)(`mdc-fab__ripple`,r._isFab),le(5),Te(r.showProgress()?5:-1))},styles:[`.mat-mdc-fab-base {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 56px;
  height: 56px;
  padding: 0;
  border: none;
  fill: currentColor;
  text-decoration: none;
  cursor: pointer;
  -moz-appearance: none;
  -webkit-appearance: none;
  overflow: visible;
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 15ms linear 30ms, transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-fab-base .mat-mdc-button-ripple,
.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,
.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-fab-base .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-fab-base .mdc-button__label,
.mat-mdc-fab-base .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-fab-base .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-mdc-fab-base:focus-visible > .mat-focus-indicator::before {
  content: "";
}
.mat-mdc-fab-base._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-fab-base::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}
.mat-mdc-fab-base[hidden] {
  display: none;
}
.mat-mdc-fab-base::-moz-focus-inner {
  padding: 0;
  border: 0;
}
.mat-mdc-fab-base:active, .mat-mdc-fab-base:focus {
  outline: none;
}
.mat-mdc-fab-base:hover {
  cursor: pointer;
}
.mat-mdc-fab-base > svg {
  width: 100%;
}
.mat-mdc-fab-base .mat-icon, .mat-mdc-fab-base .material-icons {
  transition: transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);
  fill: currentColor;
  will-change: transform;
}
.mat-mdc-fab-base .mat-focus-indicator::before {
  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px) * -1);
  border-radius: calc(var(--%NS%mat-fab-container-shape, var(--%NS%mat-sys-corner-large)) + calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px));
}
.mat-mdc-fab-base[disabled], .mat-mdc-fab-base.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-fab-base[disabled], .mat-mdc-fab-base[disabled]:focus, .mat-mdc-fab-base.mat-mdc-button-disabled, .mat-mdc-fab-base.mat-mdc-button-disabled:focus {
  box-shadow: none;
}
.mat-mdc-fab-base.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-fab {
  background-color: var(--%NS%mat-fab-container-color, var(--%NS%mat-sys-primary-container));
  border-radius: var(--%NS%mat-fab-container-shape, var(--%NS%mat-sys-corner-large));
  color: var(--%NS%mat-fab-foreground-color, var(--%NS%mat-sys-on-primary-container, inherit));
  box-shadow: var(--%NS%mat-fab-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
@media (hover: hover) {
  .mat-mdc-fab:hover {
    box-shadow: var(--%NS%mat-fab-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));
  }
}
.mat-mdc-fab:focus {
  box-shadow: var(--%NS%mat-fab-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-fab:active, .mat-mdc-fab:focus:active {
  box-shadow: var(--%NS%mat-fab-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-fab[disabled], .mat-mdc-fab.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-fab-disabled-state-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-fab.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-fab .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-fab-touch-target-size, 48px);
  display: var(--%NS%mat-fab-touch-target-display, block);
  left: 50%;
  width: var(--%NS%mat-fab-touch-target-size, 48px);
  transform: translate(-50%, -50%);
}
.mat-mdc-fab .mat-ripple-element {
  background-color: var(--%NS%mat-fab-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-primary-container) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-fab .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-fab-state-layer-color, var(--%NS%mat-sys-on-primary-container));
}
.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-fab-disabled-state-layer-color);
}
.mat-mdc-fab:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-fab:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}

.mat-mdc-mini-fab {
  width: 40px;
  height: 40px;
  background-color: var(--%NS%mat-fab-small-container-color, var(--%NS%mat-sys-primary-container));
  border-radius: var(--%NS%mat-fab-small-container-shape, var(--%NS%mat-sys-corner-medium));
  color: var(--%NS%mat-fab-small-foreground-color, var(--%NS%mat-sys-on-primary-container, inherit));
  box-shadow: var(--%NS%mat-fab-small-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
@media (hover: hover) {
  .mat-mdc-mini-fab:hover {
    box-shadow: var(--%NS%mat-fab-small-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));
  }
}
.mat-mdc-mini-fab:focus {
  box-shadow: var(--%NS%mat-fab-small-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-mini-fab:active, .mat-mdc-mini-fab:focus:active {
  box-shadow: var(--%NS%mat-fab-small-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-mini-fab .mat-focus-indicator::before {
  border-radius: calc(var(--%NS%mat-fab-small-container-shape, var(--%NS%mat-sys-corner-medium)) + calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px));
}
.mat-mdc-mini-fab[disabled], .mat-mdc-mini-fab.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--%NS%mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-mini-fab .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--%NS%mat-fab-small-touch-target-size, 48px);
  display: var(--%NS%mat-fab-small-touch-target-display);
  left: 50%;
  width: var(--%NS%mat-fab-small-touch-target-size, 48px);
  transform: translate(-50%, -50%);
}
.mat-mdc-mini-fab .mat-ripple-element {
  background-color: var(--%NS%mat-fab-small-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-primary-container) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-fab-small-state-layer-color, var(--%NS%mat-sys-on-primary-container));
}
.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--%NS%mat-fab-small-disabled-state-layer-color);
}
.mat-mdc-mini-fab:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-small-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-mini-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-small-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mat-mdc-mini-fab:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--%NS%mat-fab-small-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
}

.mat-mdc-extended-fab {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  padding-left: 20px;
  padding-right: 20px;
  width: auto;
  max-width: 100%;
  line-height: normal;
  box-shadow: var(--%NS%mat-fab-extended-container-elevation-shadow, var(--%NS%mat-sys-level3));
  height: var(--%NS%mat-fab-extended-container-height, 56px);
  border-radius: var(--%NS%mat-fab-extended-container-shape, var(--%NS%mat-sys-corner-large));
  font-family: var(--%NS%mat-fab-extended-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-fab-extended-label-text-size, var(--%NS%mat-sys-label-large-size));
  font-weight: var(--%NS%mat-fab-extended-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  letter-spacing: var(--%NS%mat-fab-extended-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
}
@media (hover: hover) {
  .mat-mdc-extended-fab:hover {
    box-shadow: var(--%NS%mat-fab-extended-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));
  }
}
.mat-mdc-extended-fab:focus {
  box-shadow: var(--%NS%mat-fab-extended-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-extended-fab:active, .mat-mdc-extended-fab:focus:active {
  box-shadow: var(--%NS%mat-fab-extended-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));
}
.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab[disabled]:focus, .mat-mdc-extended-fab.mat-mdc-button-disabled, .mat-mdc-extended-fab.mat-mdc-button-disabled:focus {
  box-shadow: none;
}
.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
[dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .mat-icon, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-icons,
.mat-mdc-extended-fab > .mat-icon,
.mat-mdc-extended-fab > .material-icons {
  margin-left: -8px;
  margin-right: 12px;
}
.mat-mdc-extended-fab .mdc-button__label + .mat-icon,
.mat-mdc-extended-fab .mdc-button__label + .material-icons, [dir=rtl] .mat-mdc-extended-fab > .mat-icon, [dir=rtl] .mat-mdc-extended-fab > .material-icons {
  margin-left: 12px;
  margin-right: -8px;
}
.mat-mdc-extended-fab .mat-mdc-button-touch-target {
  width: 100%;
}

.mat-mdc-button-progress-indicator-container {
  position: absolute;
  inset-inline-start: 0;
  margin-block-start: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.mat-mdc-button-progress-indicator-shown mat-icon,
.mat-mdc-button-progress-indicator-shown [matButtonIcon],
.mat-mdc-button-progress-indicator-shown .mdc-button__label {
  visibility: hidden;
}
`],encapsulation:2})}return n})();var EX=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[ss,we]})}return n})();function cE(n){return Error(`Unable to find icon with the name "${n}"`)}function cF(){return Error(`Could not find HttpClient for use with Angular Material icons. Please add provideHttpClient() to your providers.`)}function lE(n){return Error(`The URL provided to MatIconRegistry was not trusted as a resource URL via Angular's DomSanitizer. Attempted URL was "${n}".`)}function dE(n){return Error(`The literal provided to MatIconRegistry was not trusted as safe HTML by Angular's DomSanitizer. Attempted literal was "${n}".`)}var ci=class{url;svgText;options;svgElement=null;constructor(t,e,i){this.url=t,this.svgText=e,this.options=i}};var fE=(()=>{class n{_httpClient;_sanitizer;_errorHandler;_document;_svgIconConfigs=new Map;_iconSetConfigs=new Map;_cachedIconsByUrl=new Map;_inProgressUrlFetches=new Map;_fontCssClassesByAlias=new Map;_resolvers=[];_defaultFontSetClass=[`material-icons`,`mat-ligature-font`];constructor(e,i,r,o){this._httpClient=e,this._sanitizer=i,this._errorHandler=o,this._document=r}addSvgIcon(e,i,r){return this.addSvgIconInNamespace(``,e,i,r)}addSvgIconLiteral(e,i,r){return this.addSvgIconLiteralInNamespace(``,e,i,r)}addSvgIconInNamespace(e,i,r,o){return this._addSvgIconConfig(e,i,new ci(r,null,o))}addSvgIconResolver(e){return this._resolvers.push(e),this}addSvgIconLiteralInNamespace(e,i,r,o){let s=this._sanitizer.sanitize(ce.HTML,r);if(!s)throw dE(r);let a=jr(s);return this._addSvgIconConfig(e,i,new ci(``,a,o))}addSvgIconSet(e,i){return this.addSvgIconSetInNamespace(``,e,i)}addSvgIconSetLiteral(e,i){return this.addSvgIconSetLiteralInNamespace(``,e,i)}addSvgIconSetInNamespace(e,i,r){return this._addSvgIconSetConfig(e,new ci(i,null,r))}addSvgIconSetLiteralInNamespace(e,i,r){let o=this._sanitizer.sanitize(ce.HTML,i);if(!o)throw dE(i);let s=jr(o);return this._addSvgIconSetConfig(e,new ci(``,s,r))}registerFontClassAlias(e,i=e){return this._fontCssClassesByAlias.set(e,i),this}classNameForFontAlias(e){return this._fontCssClassesByAlias.get(e)||e}setDefaultFontSetClass(...e){return this._defaultFontSetClass=e,this}getDefaultFontSetClass(){return this._defaultFontSetClass}getSvgIconFromUrl(e){let i=this._sanitizer.sanitize(ce.RESOURCE_URL,e);if(!i)throw lE(e);let r=this._cachedIconsByUrl.get(i);return r?F(Lu(r)):this._loadSvgIconFromConfig(new ci(e,null)).pipe(Ze(o=>this._cachedIconsByUrl.set(i,o)),H(o=>Lu(o)))}getNamedSvgIcon(e,i=``){let r=uE(i,e),o=this._svgIconConfigs.get(r);if(o)return this._getSvgFromConfig(o);if(o=this._getIconConfigFromResolvers(i,e),o)return this._svgIconConfigs.set(r,o),this._getSvgFromConfig(o);let s=this._iconSetConfigs.get(i);return s?this._getSvgFromIconSetConfigs(e,s):ks(cE(r))}ngOnDestroy(){this._resolvers=[],this._svgIconConfigs.clear(),this._iconSetConfigs.clear(),this._cachedIconsByUrl.clear()}_getSvgFromConfig(e){return e.svgText?F(Lu(this._svgElementFromConfig(e))):this._loadSvgIconFromConfig(e).pipe(H(i=>Lu(i)))}_getSvgFromIconSetConfigs(e,i){let r=this._extractIconWithNameFromAnySet(e,i);if(r)return F(r);return Fs(i.filter(s=>!s.svgText).map(s=>this._loadSvgIconSetFromConfig(s).pipe(mi(a=>{let l=`Loading icon set URL: ${this._sanitizer.sanitize(ce.RESOURCE_URL,s.url)} failed: ${a.message}`;return this._errorHandler.handleError(new Error(l)),F(null)})))).pipe(H(()=>{let s=this._extractIconWithNameFromAnySet(e,i);if(!s)throw cE(e);return s}))}_extractIconWithNameFromAnySet(e,i){for(let r=i.length-1;r>=0;r--){let o=i[r];if(o.svgText&&o.svgText.toString().indexOf(e)>-1){let s=this._svgElementFromConfig(o),a=this._extractSvgIconFromSet(s,e,o.options);if(a)return a}}return null}_loadSvgIconFromConfig(e){return this._fetchIcon(e).pipe(Ze(i=>e.svgText=i),H(()=>this._svgElementFromConfig(e)))}_loadSvgIconSetFromConfig(e){return e.svgText?F(null):this._fetchIcon(e).pipe(Ze(i=>e.svgText=i))}_extractSvgIconFromSet(e,i,r){let o=e.querySelector(`[id="${i}"]`);if(!o)return null;let s=o.cloneNode(!0);if(s.removeAttribute(`id`),s.nodeName.toLowerCase()===`svg`)return this._setSvgAttributes(s,r);if(s.nodeName.toLowerCase()===`symbol`)return this._setSvgAttributes(this._toSvgElement(s),r);let a=this._svgElementFromString(jr(`<svg></svg>`));return a.appendChild(s),this._setSvgAttributes(a,r)}_svgElementFromString(e){let i=this._document.createElement(`DIV`);i.innerHTML=e;let r=i.querySelector(`svg`);if(!r)throw Error(`<svg> tag not found`);return r}_toSvgElement(e){let i=this._svgElementFromString(jr(`<svg></svg>`)),r=e.attributes;for(let o=0;o<r.length;o++){let{name:s,value:a}=r[o];s!==`id`&&i.setAttribute(s,a)}for(let o=0;o<e.childNodes.length;o++)e.childNodes[o].nodeType===this._document.ELEMENT_NODE&&i.appendChild(e.childNodes[o].cloneNode(!0));return i}_setSvgAttributes(e,i){return e.setAttribute(`fit`,``),e.setAttribute(`height`,`100%`),e.setAttribute(`width`,`100%`),e.setAttribute(`preserveAspectRatio`,`xMidYMid meet`),e.setAttribute(`focusable`,`false`),i&&i.viewBox&&e.setAttribute(`viewBox`,i.viewBox),e}_fetchIcon(e){let{url:i,options:r}=e,o=r?.withCredentials??!1;if(!this._httpClient)throw cF();if(i==null)throw Error(`Cannot fetch icon from URL "${i}".`);let s=this._sanitizer.sanitize(ce.RESOURCE_URL,i);if(!s)throw lE(i);let a=this._inProgressUrlFetches.get(s);if(a)return a;let c=this._httpClient.get(s,{responseType:`text`,withCredentials:o}).pipe(H(l=>jr(l)),Zi(()=>this._inProgressUrlFetches.delete(s)),js());return this._inProgressUrlFetches.set(s,c),c}_addSvgIconConfig(e,i,r){return this._svgIconConfigs.set(uE(e,i),r),this}_addSvgIconSetConfig(e,i){let r=this._iconSetConfigs.get(e);return r?r.push(i):this._iconSetConfigs.set(e,[i]),this}_svgElementFromConfig(e){if(!e.svgElement){let i=this._svgElementFromString(e.svgText);this._setSvgAttributes(i,e.options),e.svgElement=i}return e.svgElement}_getIconConfigFromResolvers(e,i){for(let r=0;r<this._resolvers.length;r++){let o=this._resolvers[r](i,e);if(o)return lF(o)?new ci(o.url,null,o.options):new ci(o,null)}}static ɵfac=function(i){return new(i||n)(P(Vo,8),P(Ha),P(M,8),P(lt))};static ɵprov=W({token:n,factory:n.ɵfac,providedIn:`root`})}return n})();function Lu(n){return n.cloneNode(!0)}function uE(n,t){return n+`:`+t}function lF(n){return!!(n.url&&n.options)}var dF=[`*`];var uF=new g(`MAT_ICON_DEFAULT_OPTIONS`);var fF=new g(`mat-icon-location`,{providedIn:`root`,factory:()=>{let n=u(M),t=n?n.location:null;return{getPathname:()=>t?t.pathname+t.search:``}}});var hE=[`clip-path`,`color-profile`,`src`,`cursor`,`fill`,`filter`,`marker`,`marker-start`,`marker-mid`,`marker-end`,`mask`,`stroke`];var hF=hE.map(n=>`[${n}]`).join(`, `);var mF=/^url\(['"]?#(.*?)['"]?\)$/;var $X=(()=>{class n{_elementRef=u(N);_iconRegistry=u(fE);_location=u(fF);_errorHandler=u(lt);_defaultColor;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;inline=!1;get svgIcon(){return this._svgIcon}set svgIcon(e){e!==this._svgIcon&&(e?this._updateSvgIcon(e):this._svgIcon&&this._clearSvgElement(),this._svgIcon=e)}_svgIcon;get fontSet(){return this._fontSet}set fontSet(e){let i=this._cleanupFontValue(e);i!==this._fontSet&&(this._fontSet=i,this._updateFontIconClasses())}_fontSet;get fontIcon(){return this._fontIcon}set fontIcon(e){let i=this._cleanupFontValue(e);i!==this._fontIcon&&(this._fontIcon=i,this._updateFontIconClasses())}_fontIcon;_previousFontSetClass=[];_previousFontIconClass;_svgName=null;_svgNamespace=null;_previousPath;_elementsWithExternalReferences;_currentIconFetch=Q.EMPTY;constructor(){let e=u(new ko(`aria-hidden`),{optional:!0}),i=u(uF,{optional:!0});i&&(i.color&&(this.color=this._defaultColor=i.color),i.fontSet&&(this.fontSet=i.fontSet)),e||this._elementRef.nativeElement.setAttribute(`aria-hidden`,`true`)}_splitIconName(e){if(!e)return[``,``];let i=e.split(`:`);switch(i.length){case 1:return[``,i[0]];case 2:return i;default:throw Error(`Invalid icon name: "${e}"`)}}ngOnInit(){this._updateFontIconClasses()}ngAfterViewChecked(){let e=this._elementsWithExternalReferences;if(e&&e.size){let i=this._location.getPathname();i!==this._previousPath&&(this._previousPath=i,this._prependPathToReferences(i))}}ngOnDestroy(){this._currentIconFetch.unsubscribe(),this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear()}_usingFontIcon(){return!this.svgIcon}_setSvgElement(e){this._clearSvgElement();let i=this._location.getPathname();this._previousPath=i,this._cacheChildrenWithExternalReferences(e),this._prependPathToReferences(i),this._elementRef.nativeElement.appendChild(e)}_clearSvgElement(){let e=this._elementRef.nativeElement,i=e.childNodes.length;for(this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear();i--;){let r=e.childNodes[i];(r.nodeType!==1||r.nodeName.toLowerCase()===`svg`)&&r.remove()}}_updateFontIconClasses(){if(!this._usingFontIcon())return;let e=this._elementRef.nativeElement,i=(this.fontSet?this._iconRegistry.classNameForFontAlias(this.fontSet).split(/ +/):this._iconRegistry.getDefaultFontSetClass()).filter(r=>r.length>0);this._previousFontSetClass.forEach(r=>e.classList.remove(r)),i.forEach(r=>e.classList.add(r)),this._previousFontSetClass=i,this.fontIcon!==this._previousFontIconClass&&!i.includes(`mat-ligature-font`)&&(this._previousFontIconClass&&e.classList.remove(this._previousFontIconClass),this.fontIcon&&e.classList.add(this.fontIcon),this._previousFontIconClass=this.fontIcon)}_cleanupFontValue(e){return typeof e==`string`?e.trim().split(` `)[0]:e}_prependPathToReferences(e){let i=this._elementsWithExternalReferences;i&&i.forEach((r,o)=>{r.forEach(s=>{o.setAttribute(s.name,`url('${e}#${s.value}')`)})})}_cacheChildrenWithExternalReferences(e){let i=e.querySelectorAll(hF),r=this._elementsWithExternalReferences=this._elementsWithExternalReferences||new Map;for(let o=0;o<i.length;o++)hE.forEach(s=>{let a=i[o],c=a.getAttribute(s),l=c?c.match(mF):null;if(l){let d=r.get(a);d||(d=[],r.set(a,d)),d.push({name:s,value:l[1]})}})}_updateSvgIcon(e){if(this._svgNamespace=null,this._svgName=null,this._currentIconFetch.unsubscribe(),e){let[i,r]=this._splitIconName(e);i&&(this._svgNamespace=i),r&&(this._svgName=r),this._currentIconFetch=this._iconRegistry.getNamedSvgIcon(r,i).pipe(xe(1)).subscribe(o=>this._setSvgElement(o),o=>{let s=`Error retrieving icon ${i}:${r}! ${o.message}`;this._errorHandler.handleError(new Error(s))})}}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`mat-icon`]],hostAttrs:[`role`,`img`,1,`mat-icon`,`notranslate`],hostVars:10,hostBindings:function(i,r){i&2&&(ie(`data-mat-icon-type`,r._usingFontIcon()?`font`:`svg`)(`data-mat-icon-name`,r._svgName||r.fontIcon)(`data-mat-icon-namespace`,r._svgNamespace||r.fontSet)(`fontIcon`,r._usingFontIcon()?r.fontIcon:null),Jn(r.color?`mat-`+r.color:``),J(`mat-icon-inline`,r.inline)(`mat-icon-no-color`,r.color!==`primary`&&r.color!==`accent`&&r.color!==`warn`))},inputs:{color:`color`,inline:[2,`inline`,`inline`,te],svgIcon:`svgIcon`,fontSet:`fontSet`,fontIcon:`fontIcon`},exportAs:[`matIcon`],ngContentSelectors:dF,decls:1,vars:0,template:function(i,r){i&1&&(Ge(),ee(0))},styles:[`mat-icon, mat-icon.mat-primary, mat-icon.mat-accent, mat-icon.mat-warn {
  color: var(--%NS%mat-icon-color, inherit);
}

.mat-icon {
  -webkit-user-select: none;
  user-select: none;
  background-repeat: no-repeat;
  display: inline-block;
  fill: currentColor;
  height: 24px;
  width: 24px;
  overflow: hidden;
}
.mat-icon.mat-icon-inline {
  font-size: inherit;
  height: inherit;
  line-height: inherit;
  width: inherit;
}
.mat-icon.mat-ligature-font[fontIcon]::before {
  content: attr(fontIcon);
}

[dir=rtl] .mat-icon-rtl-mirror {
  transform: scale(-1, 1);
}

.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,
.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon {
  display: block;
}
.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,
.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon {
  margin: auto;
}
`],encapsulation:2})}return n})();var WX=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[we]})}return n})();var Xg={idle:`Idle`,working:`Working…`,waiting:`Waiting for you`,error:`Error`};function qX(n,t,e=Date.now()){if(n!==`working`||!t)return Xg[n];let i=Date.parse(t);return Number.isFinite(i)?`${Xg[n]} ${pF(e-i)}`:Xg[n]}function pF(n){let t=Math.max(0,Math.floor(n/1e3)),e=Math.floor(t/3600),i=Math.floor(t%3600/60),r=t%60;return e>0?`${e}h ${i}m ${r}s`:i>0?`${i}m ${r}s`:`${r}s`}function YX(n){if(!n)return``;let t=new Date(n);return Number.isNaN(t.valueOf())?``:t.toLocaleString([],{dateStyle:`medium`,timeStyle:`short`})}function pE(n){let t=n.items??[];return gF(t)?`waiting`:n.connectError||n.rejectedConfig||vF(t,n.turnState)?`error`:n.turnState===`PROMPTING`||n.turnState===`CANCELLING`?`working`:`idle`}function gF(n){for(let t=n.length-1;t>=0;t-=1){let e=n[t];if(e.type!==`turn`)continue;let i=e;return i.status!==`in_progress`?!1:i.entries.some(r=>r.type===`permission_request`&&!r.responded)}return!1}function vF(n,t){if(n.length===0)return!1;let e=mE(n,a=>a.type===`turn`),i=mE(n,a=>a.type===`error`),r=e>=0?n[e]:null,o=t===`PROMPTING`||t===`CANCELLING`;if(r&&r.status===`in_progress`)return i>e;if(o)return!1;let s=n[n.length-1];if(s.type===`error`)return!0;if(s.type===`turn`){let a=s;return a.status===`complete`&&yF(a.stopReason)}return!1}function yF(n){if(!n)return!1;let t=n.toLowerCase();return t===`error`||t===`timeout`||t.includes(`error`)||t.includes(`fail`)}function mE(n,t){for(let e=n.length-1;e>=0;e-=1)if(t(n[e]))return e;return-1}var Ur=class extends Error{constructor(e,i,r,o){super(i);this.status=e;this.code=r;this.details=o;this.name=`ApiError`}};var as=class n{constructor(){this.http=u(Vo)}async request(t,e={}){try{return await Vf(this.http.request(e.method??`GET`,t,{body:e.body}))}catch(i){if(i instanceof ei){let r=`Request failed: ${i.status} ${i.statusText}`;i.error&&typeof i.error.error==`string`&&(r=i.error.error);let o=typeof i.error?.code==`string`?i.error.code:void 0,s=i.error?.details&&typeof i.error.details==`object`?i.error.details:void 0;throw new Ur(i.status,r,o,s)}throw i}}fetchProjects(){return this.request(`/api/projects`)}createProject(t,e){return this.request(`/api/projects`,{method:`POST`,body:{name:t,path:e}})}editProject(t,e,i){return this.request(`/api/projects/${encodeURIComponent(t)}`,{method:`PATCH`,body:{name:e,path:i}})}async deleteProject(t){await this.request(`/api/projects/${encodeURIComponent(t)}`,{method:`DELETE`})}cloneProject(t){return this.request(`/api/projects/clone`,{method:`POST`,body:t})}fetchDirectories(t){let e=t?`/api/filesystem/directories?path=${encodeURIComponent(t)}`:`/api/filesystem/directories`;return this.request(e)}fetchChats(t){return this.request(`/api/projects/${encodeURIComponent(t)}/chats`)}fetchWorkspaceOptions(t){return this.request(`/api/projects/${encodeURIComponent(t)}/workspace-options`)}createChat(t,e,i,r){return this.request(`/api/projects/${encodeURIComponent(t)}/chats`,{method:`POST`,body:p({agent:e,title:i||void 0},r?{workspace:r}:{})})}fetchChat(t){return this.request(`/api/chats/${encodeURIComponent(t)}`)}fetchChatHistory(t,e,i){let r=new URLSearchParams;e!==void 0&&r.set(`before_seq`,String(e)),i!==void 0&&r.set(`through_seq`,String(i));let o=r.toString()?`?${r.toString()}`:``;return this.request(`/api/chats/${encodeURIComponent(t)}/history${o}`)}editChat(t,e){return this.request(`/api/chats/${encodeURIComponent(t)}`,{method:`PATCH`,body:e})}async deleteChat(t){await this.request(`/api/chats/${encodeURIComponent(t)}`,{method:`DELETE`})}async promptChat(t,e){await this.request(`/api/chats/${encodeURIComponent(t)}/prompt`,{method:`POST`,body:{text:e}})}resumeChat(t){return this.request(`/api/chats/${encodeURIComponent(t)}/resume`,{method:`POST`})}async stopChat(t){await this.request(`/api/chats/${encodeURIComponent(t)}/stop`,{method:`POST`})}async cancelChat(t){await this.request(`/api/chats/${encodeURIComponent(t)}/cancel`,{method:`POST`})}async respondPermission(t,e,i){await this.request(`/api/chats/${encodeURIComponent(t)}/permission`,{method:`POST`,body:{id:e,granted:i}})}fetchChatConfig(t){return this.request(`/api/chats/${encodeURIComponent(t)}/config`)}setChatConfig(t,e,i){return this.request(`/api/chats/${encodeURIComponent(t)}/config`,{method:`PATCH`,body:{id:e,value:i}})}async clearSavedConfig(t,e){await this.request(`/api/chats/${encodeURIComponent(t)}/config/${encodeURIComponent(e)}`,{method:`DELETE`})}fetchAgents(){return this.request(`/api/agents`)}fetchStatus(){return this.request(`/api/status`)}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵprov=b({token:n,factory:n.ɵfac})}};var cs=class n{constructor(){this.status=C(`connecting`);this.events=new w;this.replayGaps=new w;this.errorMessage=C(``);this.baseline=C(null);this.socket=null;this.reconnectTimer=null;this.destroyed=!1;this.fatal=!1;this.lastSequence=0;this.baselineEstablished=!1;this.baselineWaiters=[]}waitForBaseline(){let t=this.baseline();return t!==null?Promise.resolve(t):new Promise(e=>this.baselineWaiters.push({resolve:e}))}connect(){if(this.destroyed||typeof window>`u`||this.socket)return;this.status.set(`connecting`);let t=window.location.protocol===`https:`?`wss:`:`ws:`;try{this.socket=new WebSocket(`${t}//${window.location.host}/ws`)}catch{this.socket=null,this.scheduleReconnect();return}this.socket.addEventListener(`open`,()=>{this.status.set(`connected`),this.send({type:`subscribe`,from_seq:this.baselineEstablished?this.lastSequence+1:0})}),this.socket.addEventListener(`message`,e=>{try{let i=JSON.parse(String(e.data));if(i.type===`stream_error`||i.type===`replay_gap`){i.type===`replay_gap`&&this.replayGaps.next(),this.fatal=!0,this.errorMessage.set(i.error??`Durable event history could not be replayed`),this.status.set(`error`),this.socket?.close();return}if(i.type===`subscribed`){if(typeof i.through_seq==`number`){this.lastSequence=Math.max(this.lastSequence,i.through_seq),this.baselineEstablished=!0,this.baseline.set(i.through_seq);let r=this.baselineWaiters;this.baselineWaiters=[];for(let o of r)o.resolve(i.through_seq)}return}if(typeof i.seq!=`number`||i.seq<=this.lastSequence)return;this.lastSequence=i.seq,this.events.next(i)}catch{}}),this.socket.addEventListener(`close`,()=>{this.socket=null,this.fatal||(this.status.set(`disconnected`),this.scheduleReconnect())}),this.socket.addEventListener(`error`,()=>{this.socket?.close()})}send(t){this.socket?.readyState===WebSocket.OPEN&&this.socket.send(JSON.stringify(t))}destroy(){this.destroyed=!0,this.reconnectTimer&&clearTimeout(this.reconnectTimer),this.reconnectTimer=null,this.socket?.close(),this.socket=null,this.events.complete(),this.replayGaps.complete()}ngOnDestroy(){this.destroy()}scheduleReconnect(){this.destroyed||this.reconnectTimer||(this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null,this.connect()},2e3))}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵprov=b({token:n,factory:n.ɵfac})}};var Hr=class{constructor(t=[]){this.nextId=1;this.eventsBySeq=new Map;this.itemList=C([]);this.items=this.itemList.asReadonly();this.turnStart=C(null);this.turnStartedAt=this.turnStart.asReadonly();this.turnStartSource=null;this.currentTurnId=null;for(let e of t)this.eventsBySeq.set(e.seq,e);this.rebuild()}ingest(t){return typeof t.seq!=`number`||this.eventsBySeq.has(t.seq)||(this.eventsBySeq.set(t.seq,t),this.rebuild(),!t.payload||t.payload.type===`state_change`)?null:this.itemList().at(-1)??null}rebuild(){this.nextId=1,this.currentTurnId=null,this.turnStart.set(null),this.turnStartSource=null,this.itemList.set([]);let t=[...this.eventsBySeq.values()].sort((e,i)=>e.seq-i.seq);for(let e of t)this.ingestOrdered(e)}ingestOrdered(t){let e=t.payload;return e?(e.type===`user_message`?(this.turnStart.set(t.timestamp),this.turnStartSource=`user`):e.type===`state_change`&&e.turn===`PROMPTING`&&this.turnStartSource!==`user`?(this.turnStart.set(t.timestamp),this.turnStartSource=`state`):e.type===`turn_complete`?(this.turnStart.set(null),this.turnStartSource=null):this.isTurnScoped(e.type)&&!this.turnStart()&&(this.turnStart.set(t.timestamp),this.turnStartSource=`inferred`),this.isTurnScoped(e.type)?this.ingestTurnEvent(t):e.type===`user_message`?(this.closeCurrentTurn(),this.append({id:this.nextId++,type:`user_message`,text:this.stringValue(e.text)??``,timestamp:t.timestamp})):e.type===`error`?this.append({id:this.nextId++,type:`error`,message:this.stringValue(e.message)??`Unknown error`,timestamp:t.timestamp}):(e.type,null)):null}append(t){return this.itemList.update(e=>[...e,t]),t}closeCurrentTurn(){let t=this.openTurn();if(!t)return;let e=S(p({},t),{status:`complete`});this.itemList.update(i=>i.map(r=>r.id===e.id?e:r)),this.currentTurnId=null}openTurn(){if(this.currentTurnId===null)return null;let t=this.itemList().find(e=>e.id===this.currentTurnId);return t&&t.type===`turn`?t:null}ingestTurnEvent(t){let e=t.payload,i=this.openTurn(),r=i===null,o=i??{id:this.nextId++,type:`turn`,agent:t.agent||`Agent`,timestamp:t.timestamp,completedAt:null,status:`in_progress`,stopReason:null,entries:[]},s=this.applyTurnEvent(o,t),a=s!==o;e.type===`turn_complete`&&(s=S(p({},s),{status:`complete`,completedAt:t.timestamp,stopReason:this.stringValue(e.stop_reason??e.stopReason)??null}));let c=s;return this.itemList.update(l=>{let d=r?[...l,c]:l.map(f=>f.id===c.id?c:f);return e.type===`permission_response`&&!a?this.markPermissionInItems(d,c.id,e):d}),this.currentTurnId=e.type===`turn_complete`?null:c.id,c}isTurnScoped(t){return[`message_chunk`,`thought_chunk`,`tool_call`,`tool_call_update`,`plan`,`permission_request`,`permission_response`,`turn_complete`].includes(t)}applyTurnEvent(t,e){let i=e.payload,r=t.entries,o=r[r.length-1];if(i.type===`message_chunk`||i.type===`thought_chunk`){let s=this.stringValue(i.text)??``;if(o&&o.type===i.type){let a=S(p({},o),{text:o.text+s});return S(p({},t),{entries:[...r.slice(0,-1),a]})}return S(p({},t),{entries:[...r,{id:this.nextId++,type:i.type,text:s}]})}if(i.type===`tool_call`){let s=this.stringValue(i.id??i.toolCallId??i.tool_call_id)??String(this.nextId),a=this.stringValue(i.kind),c=this.stringValue(i.parent_id??i.parentId);return S(p({},t),{entries:[...r,{id:this.nextId++,type:`tool_call`,toolCallId:s,title:this.stringValue(i.title)??`Tool Call`,status:this.stringValue(i.status)??`in_progress`,output:null,kind:a,parentId:c}]})}if(i.type===`tool_call_update`){let s=this.stringValue(i.id??i.toolCallId??i.tool_call_id)??``,a=this.findToolCallIndex(r,s);if(a>=0){let c=r[a],l=this.stringValue(i.status),d=this.stringValue(i.title),f=this.stringValue(i.kind),h=S(p({},c),{title:d??c.title,kind:f??c.kind,status:l??c.status,output:i.output!==void 0&&i.output!==null?(c.output||``)+String(i.output):c.output}),m=[...r];return m[a]=h,S(p({},t),{entries:m})}return S(p({},t),{entries:[...r,{id:this.nextId++,type:`tool_call`,toolCallId:s,title:this.stringValue(i.title)??`Tool Call`,status:this.stringValue(i.status)??`in_progress`,output:i.output==null?null:String(i.output),kind:this.stringValue(i.kind),parentId:this.stringValue(i.parent_id??i.parentId)}]})}if(i.type===`plan`){let a=Array.isArray(i.entries)?i.entries:[];if(o?.type===`plan`){let c=S(p({},o),{entries:a});return S(p({},t),{entries:[...r.slice(0,-1),c]})}return S(p({},t),{entries:[...r,{id:this.nextId++,type:`plan`,entries:a}]})}if(i.type===`permission_request`)return S(p({},t),{entries:[...r,{id:this.nextId++,type:`permission_request`,requestId:this.stringValue(i.id)??``,method:this.stringValue(i.method)??``,description:this.stringValue(i.description)??``,title:this.stringValue(i.title),kind:this.stringValue(i.kind),responded:!1}]});if(i.type===`permission_response`){let s=this.markPermission(r,i);return s?S(p({},t),{entries:s}):t}return t}markPermission(t,e){let i=this.stringValue(e.id),r=t.findIndex(s=>s.type===`permission_request`&&(!i||s.requestId===i));if(r<0)return null;let o=[...t];return o[r]=S(p({},o[r]),{responded:!0,decision:e.granted?`Allowed`:`Denied`}),o}markPermissionInItems(t,e,i){for(let r=0;r<t.length;r+=1){let o=t[r];if(o.type!==`turn`||o.id===e)continue;let s=this.markPermission(o.entries,i);if(!s)continue;let a=[...t];return a[r]=S(p({},o),{entries:s}),a}return t}findToolCallIndex(t,e){for(let i=t.length-1;i>=0;i-=1){let r=t[i];if(r.type===`tool_call`&&r.toolCallId===e)return i}return-1}stringValue(t){return typeof t==`string`?t:t==null?void 0:String(t)}};function ju(n,t){let e=Date.parse(n.updated_at),i=Date.parse(t.updated_at),r=Number.isFinite(e)?e:Number.NEGATIVE_INFINITY;return(Number.isFinite(i)?i:Number.NEGATIVE_INFINITY)-r||t.id.localeCompare(n.id)}var Vu=class n{constructor(){this.api=u(as);this.socket=u(cs);this.chatsByProject=C({});this.configOptionsByChat=C({});this.configLoadedByChat=C({});this.reducersByChat=C({});this.loadingChats=C(new Set);this.connectingChats=C(new Set);this.connectErrors=C({});this.rejectedConfigByChat=C({});this.historyLoadingByChat=C(new Set);this.historyHasOlderByChat=C({});this.historyErrors=C({});this.inFlightConnections=new Map;this.inFlightConfigs=new Map;this.inFlightChats=new Map;this.inFlightHistory=new Map;this.historyCursors=C({});this.historyLoaded=new Set}loadChats(t){let e=this.inFlightChats.get(t);if(e)return e;let i=(async()=>{this.setSetValue(this.loadingChats,t,!0);try{let r=await this.api.fetchChats(t);this.chatsByProject.update(o=>S(p({},o),{[t]:[...r].sort(ju)}))}catch(r){console.error(`Failed to load chats for project`,t,r)}finally{this.setSetValue(this.loadingChats,t,!1),this.inFlightChats.delete(t)}})();return this.inFlightChats.set(t,i),i}findChat(t){for(let e of Object.values(this.chatsByProject())){let i=e.find(r=>r.id===t);if(i)return i}return null}async autoConnectChat(t){this.findChat(t)&&(this.loadChatHistory(t),this.configLoadedByChat()[t]||await this.loadChatConfig(t).catch(()=>{}))}loadChatHistory(t){return this.historyLoaded.has(t)?Promise.resolve():this.requestHistory(t,void 0,!0)}loadOlderHistory(t){if(!this.historyHasOlderByChat()[t])return Promise.resolve();let e=this.historyCursors()[t];return e==null?Promise.resolve():this.requestHistory(t,e)}retryHistory(t){return this.historyLoaded.has(t)?this.loadOlderHistory(t):this.loadChatHistory(t)}loadChatConfig(t){let e=this.inFlightConfigs.get(t);if(e)return e;let i=(async()=>{this.setSetValue(this.connectingChats,t,!0),this.clearError(t);try{let r=this.normalizeConfigOptions(await this.api.fetchChatConfig(t));return this.setConfig(t,r),r}catch(r){if(this.setError(t,this.errorMessage(r,`Failed to load agent configuration`)),r instanceof Ur&&r.code?.toLowerCase()===`saved_config_rejected`){let o=r.details?.option_id??r.details?.optionId;typeof o==`string`&&this.rejectedConfigByChat.update(s=>S(p({},s),{[t]:o}))}throw r}finally{this.setSetValue(this.connectingChats,t,!1),this.inFlightConfigs.delete(t)}})();return this.inFlightConfigs.set(t,i),i}retryConnection(t){return this.loadChatConfig(t).then(()=>{}).catch(()=>{})}connectChat(t){let e=this.inFlightConnections.get(t);if(e)return e;let i=(async()=>{this.setSetValue(this.connectingChats,t,!0),this.clearError(t);try{let r;try{r=await this.api.resumeChat(t)}catch(o){let s=this.findChat(t);if((!s||s.process_state!==`RUNNING`)&&(this.setError(t,this.errorMessage(o,`Failed to connect to agent`)),o instanceof Ur&&o.code===`saved_config_rejected`)){let a=o.details?.option_id;typeof a==`string`&&this.rejectedConfigByChat.update(c=>S(p({},c),{[t]:a}))}throw o}this.applyChatPatch(t,r),this.clearError(t);try{await this.fetchConfig(t)}catch(o){throw this.setError(t,this.errorMessage(o,`Failed to load agent configuration`)),o}return r}finally{this.setSetValue(this.connectingChats,t,!1),this.inFlightConnections.delete(t)}})();return this.inFlightConnections.set(t,i),i}async fetchConfig(t){let e=this.normalizeConfigOptions(await this.api.fetchChatConfig(t));return this.setConfig(t,e),e}async sendPrompt(t,e){try{await this.api.promptChat(t,e),this.clearError(t),this.applyChatPatch(t,{turn_state:`PROMPTING`})}catch(i){if(i instanceof Ur&&i.code?.toLowerCase()===`saved_config_rejected`){let r=i.details?.option_id??i.details?.optionId;typeof r==`string`&&this.rejectedConfigByChat.update(o=>S(p({},o),{[t]:r}))}throw this.setError(t,this.errorMessage(i,`Failed to send prompt`)),i}}async cancelActiveTurn(t){await this.api.cancelChat(t),this.applyChatPatch(t,{turn_state:`CANCELLING`})}async stopChatProcess(t){await this.api.stopChat(t),this.applyChatPatch(t,{process_state:`STOPPED`,turn_state:`IDLE`})}async setChatPolicy(t,e){this.applyChatPatch(t,await this.api.editChat(t,{permission_policy:e}))}async renameChat(t,e){this.applyChatPatch(t,await this.api.editChat(t,{title:e}))}async archiveChat(t,e){this.applyChatPatch(t,await this.api.editChat(t,{archived:e}))}async deleteChat(t){let e=this.findChat(t);return await this.api.deleteChat(t),this.chatsByProject.update(i=>{let r=p({},i);for(let[o,s]of Object.entries(r))r[o]=s.filter(a=>a.id!==t);return r}),this.removeChatState(t),e}async setChatConfig(t,e,i){let r=this.normalizeConfigOptions(await this.api.setChatConfig(t,e,i));this.setConfig(t,r)}async resetRejectedConfig(t){let e=this.rejectedConfigByChat()[t];e&&(await this.api.clearSavedConfig(t,e),this.rejectedConfigByChat.update(i=>{let r=p({},i);return delete r[t],r}),await this.retryConnection(t))}async createChat(t,e,i,r){let o=await this.api.createChat(t,e,i,r);return this.chatsByProject.update(s=>S(p({},s),{[t]:[...s[t]??[],o].sort(ju)})),o}respondPermission(t,e,i){return this.api.respondPermission(t,e,i)}removeProject(t){this.chatsByProject.update(e=>{let i=p({},e);return delete i[t],i})}handleIncomingEvent(t){let{session_id:e,payload:i}=t;if(i.type===`config_options`&&e){this.setConfig(e,this.normalizeConfigOptions(i.options));return}if(!e)return;let r=p({},this.reducersByChat()),o=r[e]??new Hr;if(o.ingest(t),r[e]=o,this.reducersByChat.set(r),i.type===`user_message`&&(this.applyChatActivity(e,t.timestamp),this.applyChatPatch(e,{turn_started_at:t.timestamp})),i.type===`turn_complete`&&this.applyChatPatch(e,{turn_started_at:null}),i.type===`state_change`){let s=this.processState(i.process),a=this.turnState(i.turn);this.applyChatPatch(e,p(p({},s?{process_state:s}:{}),a?{turn_state:a}:{}))}}resetEventHistory(){this.reducersByChat.set({})}chatActivity(t){let e=this.findChat(t),i=this.reducersByChat()[t]?.items()??[];return pE({turnState:e?.turn_state,connectError:this.connectErrors()[t],rejectedConfig:this.rejectedConfigByChat()[t],items:i})}chatTurnStartedAt(t){let e=this.findChat(t);return e&&Object.prototype.hasOwnProperty.call(e,`turn_started_at`)?e.turn_started_at??null:this.reducersByChat()[t]?.turnStartedAt()??null}setConfig(t,e){this.configOptionsByChat.update(i=>S(p({},i),{[t]:e})),this.configLoadedByChat.update(i=>S(p({},i),{[t]:!0}))}applyChatPatch(t,e){this.chatsByProject.update(i=>{let r=p({},i);for(let[o,s]of Object.entries(r))r[o]=s.map(a=>a.id===t?p(p({},a),e):a).sort(ju);return r})}applyChatActivity(t,e){this.chatsByProject.update(i=>{let r=p({},i);for(let[o,s]of Object.entries(r))r[o]=s.map(a=>{if(a.id!==t)return a;let c=Date.parse(a.updated_at),l=Date.parse(e);return!Number.isFinite(c)||l>=c?S(p({},a),{updated_at:e}):a}).sort(ju);return r})}removeChatState(t){this.historyLoaded.delete(t);for(let e of[this.reducersByChat,this.configOptionsByChat,this.configLoadedByChat,this.connectErrors,this.rejectedConfigByChat,this.historyHasOlderByChat,this.historyErrors,this.historyCursors])e.update(i=>{let r=p({},i);return delete r[t],r})}requestHistory(t,e,i=!1){let r=this.inFlightHistory.get(t);if(r)return r;let o=(async()=>{this.setSetValue(this.historyLoadingByChat,t,!0),this.historyErrors.update(s=>{if(!(t in s))return s;let a=p({},s);return delete a[t],a});try{let s=i?await this.socket.waitForBaseline():void 0,a=i?await this.api.fetchChatHistory(t,e,s):await this.api.fetchChatHistory(t,e),c=p({},this.reducersByChat()),l=c[t]??new Hr;for(let d of a.events)l.ingest(d);c[t]=l,this.reducersByChat.set(c),this.historyLoaded.add(t),this.historyHasOlderByChat.update(d=>S(p({},d),{[t]:a.has_older})),this.historyCursors.update(d=>S(p({},d),{[t]:a.next_cursor}))}catch(s){this.historyErrors.update(a=>S(p({},a),{[t]:this.errorMessage(s,`Failed to load chat history`)}))}finally{this.setSetValue(this.historyLoadingByChat,t,!1),this.inFlightHistory.delete(t)}})();return this.inFlightHistory.set(t,o),o}setError(t,e){this.connectErrors.update(i=>S(p({},i),{[t]:e}))}clearError(t){this.connectErrors.update(e=>{if(!(t in e))return e;let i=p({},e);return delete i[t],i})}setSetValue(t,e,i){t.update(r=>{let o=new Set(r);return i?o.add(e):o.delete(e),o})}normalizeConfigOptions(t){return Array.isArray(t)?t.map(e=>{let i=e??{},o=(Array.isArray(i.options)?i.options:void 0)?.map(s=>{let a=s??{};return Array.isArray(a.options)?{group:String(a.group??a.name??``),options:a.options.map(c=>{let l=c??{};return{value:l.value,name:String(l.name??l.label??l.value??``)}})}:{value:a.value,name:String(a.name??a.label??a.value??``)}});return{id:String(i.id??``),name:String(i.name??i.label??i.id??``),type:String(i.type??``),currentValue:i.currentValue??i.current_value,description:typeof i.description==`string`?i.description:void 0,options:o}}):[]}processState(t){return[`STARTING`,`RUNNING`,`STOPPED`,`DEAD`].includes(String(t))?String(t):void 0}turnState(t){return[`IDLE`,`PROMPTING`,`CANCELLING`].includes(String(t))?String(t):void 0}errorMessage(t,e){return t instanceof Error&&t.message?t.message:e}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵprov=b({token:n,factory:n.ɵfac})}};var Bu=class n{constructor(){this.api=u(as);this.projects=C([]);this.agents=C([`codex`,`claude`,`opencode`,`antigravity`]);this.loading=C(!1);this.error=C(null)}async loadProjects(){this.loading.set(!0);try{this.projects.set(await this.api.fetchProjects()),this.error.set(null)}catch(t){this.error.set(t instanceof Error&&t.message?t.message:`Failed to load projects`),console.error(`Failed to load projects`,t)}finally{this.loading.set(!1)}}async loadAgents(){try{this.agents.set(await this.api.fetchAgents())}catch{}}async createProject(t,e){let i=await this.api.createProject(t,e);return this.projects.update(r=>[i,...r]),i}async cloneProject(t){let e=await this.api.cloneProject(t);return this.projects.update(i=>[e,...i.filter(r=>r.id!==e.id)]),e}async editProject(t,e,i){let r=await this.api.editProject(t,e,i);return this.projects.update(o=>o.map(s=>s.id===t?p(p({},s),r):s)),r}async deleteProject(t){await this.api.deleteProject(t),this.projects.update(e=>e.filter(i=>i.id!==t))}incrementChatCount(t){this.projects.update(e=>e.map(i=>i.id===t?S(p({},i),{chat_count:(i.chat_count??0)+1}):i))}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵprov=b({token:n,factory:n.ɵfac})}};var Uu=class n{constructor(){this.activeProjectId=C(null);this.activeChatId=C(null);this.isMobileDrawerOpen=C(!1);this.showArchived=C(!1)}setRoute(t,e){this.activeProjectId.set(t),this.activeChatId.set(e)}setMobileDrawerOpen(t){this.isMobileDrawerOpen.set(t)}setShowArchived(t){this.showArchived.set(t)}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵprov=b({token:n,factory:n.ɵfac})}};var gE=class n{constructor(){this.projectStore=u(Bu);this.chatStore=u(Vu);this.uiStore=u(Uu);this.projects=this.projectStore.projects;this.agents=this.projectStore.agents;this.loadingProjects=this.projectStore.loading;this.projectsError=this.projectStore.error;this.chatsByProject=this.chatStore.chatsByProject;this.configOptionsByChat=this.chatStore.configOptionsByChat;this.configLoadedByChat=this.chatStore.configLoadedByChat;this.reducersByChat=this.chatStore.reducersByChat;this.loadingChats=this.chatStore.loadingChats;this.connectingChats=this.chatStore.connectingChats;this.connectErrors=this.chatStore.connectErrors;this.rejectedConfigByChat=this.chatStore.rejectedConfigByChat;this.historyLoadingByChat=this.chatStore.historyLoadingByChat;this.historyHasOlderByChat=this.chatStore.historyHasOlderByChat;this.historyErrors=this.chatStore.historyErrors;this.activeProjectId=this.uiStore.activeProjectId;this.activeChatId=this.uiStore.activeChatId;this.isMobileDrawerOpen=this.uiStore.isMobileDrawerOpen;this.showArchived=this.uiStore.showArchived;this.socket=u(cs);this.router=u(si);this.emptyReducer=new Hr;this.wsStatus=this.socket.status;this.wsError=this.socket.errorMessage;this.activeProject=x(()=>{let t=this.activeProjectId();return t?this.projects().find(e=>e.id===t)??null:null});this.activeChat=x(()=>{let t=this.activeProjectId(),e=this.activeChatId();return!t||!e?null:this.chatsByProject()[t]?.find(i=>i.id===e)??null});this.activeReducer=x(()=>{let t=this.activeChatId();return t?this.reducersByChat()[t]??this.emptyReducer:this.emptyReducer});this.socket.events.subscribe(t=>this.handleIncomingEvent(t)),this.socket.replayGaps.subscribe(()=>this.chatStore.resetEventHistory()),this.router.events.pipe(re(t=>t instanceof Lt)).subscribe(t=>this.syncRoute(t.urlAfterRedirects)),this.syncRoute(this.router.url||(typeof window<`u`?window.location.pathname:`/`)),this.socket.connect(),this.initialize()}setMobileDrawerOpen(t){this.uiStore.setMobileDrawerOpen(t)}setShowArchived(t){this.uiStore.setShowArchived(t)}loadProjects(){return this.projectStore.loadProjects()}loadAgents(){return this.projectStore.loadAgents()}loadChats(t){return this.chatStore.loadChats(t)}findChat(t){return this.chatStore.findChat(t)}chatActivity(t){return this.chatStore.chatActivity(t)}chatTurnStartedAt(t){return this.chatStore.chatTurnStartedAt(t)}autoConnectChat(t){return this.chatStore.autoConnectChat(t)}loadChatHistory(t){return this.chatStore.loadChatHistory(t)}loadOlderHistory(t){return this.chatStore.loadOlderHistory(t)}retryHistory(t){return this.chatStore.retryHistory(t)}loadChatConfig(t){return this.chatStore.loadChatConfig(t)}retryConnection(t){return this.chatStore.retryConnection(t)}resetRejectedConfig(t){return this.chatStore.resetRejectedConfig(t)}connectChat(t){return this.chatStore.connectChat(t)}fetchConfig(t){return this.chatStore.fetchConfig(t)}sendPrompt(t,e){return this.chatStore.sendPrompt(t,e)}cancelActiveTurn(t){return this.chatStore.cancelActiveTurn(t)}stopChatProcess(t){return this.chatStore.stopChatProcess(t)}setChatPolicy(t,e){return this.chatStore.setChatPolicy(t,e)}renameChat(t,e){return this.chatStore.renameChat(t,e)}archiveChat(t,e){return this.chatStore.archiveChat(t,e)}async deleteChat(t){let e=await this.chatStore.deleteChat(t);this.activeChatId()===t&&this.router.navigate(e?.project_id?[`/projects`,e.project_id]:[`/`])}setChatConfig(t,e,i){return this.chatStore.setChatConfig(t,e,i)}createProject(t,e){return this.projectStore.createProject(t,e)}cloneProject(t){return this.projectStore.cloneProject(t)}async createChat(t,e,i,r){let o=await this.chatStore.createChat(t,e,i,r);return this.projectStore.incrementChatCount(t),o}editProject(t,e,i){return this.projectStore.editProject(t,e,i)}async deleteProject(t){await this.projectStore.deleteProject(t),this.chatStore.removeProject(t),this.activeProjectId()===t&&(this.uiStore.setRoute(null,null),this.router.navigate([`/`]))}respondPermission(t,e,i){return this.chatStore.respondPermission(t,e,i)}async initialize(){typeof window>`u`||await Promise.all([this.loadProjects(),this.loadAgents()])}syncRoute(t){let e=t.split(`?`)[0].replace(/\/+$/,``).split(`/`).filter(Boolean),i=e[0]===`projects`?e[1]??null:null,r=i&&e[2]===`chats`?e[3]??null:null;if(this.uiStore.setRoute(i,r),!i){this.setMobileDrawerOpen(!1);return}this.loadChats(i).then(()=>{r&&this.autoConnectChat(r)})}handleIncomingEvent(t){if(t.payload.type===`metadata_changed`){this.loadProjects();for(let e of Object.keys(this.chatsByProject()))this.loadChats(e);return}this.chatStore.handleIncomingEvent(t)}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵprov=b({token:n,factory:n.ɵfac})}};var dc=class{_attachedHost=null;attach(t){return this._attachedHost=t,t.attach(this)}detach(){let t=this._attachedHost;t!=null&&(this._attachedHost=null,t.detach())}get isAttached(){return this._attachedHost!=null}setAttachedHost(t){this._attachedHost=t}};var ls=class extends dc{component;viewContainerRef;injector;projectableNodes;bindings;directives;constructor(t,e,i,r,o,s){super(),this.component=t,this.viewContainerRef=e,this.injector=i,this.projectableNodes=r,this.bindings=o||null,this.directives=s||null}};var mn=class extends dc{templateRef;viewContainerRef;context;injector;constructor(t,e,i,r){super(),this.templateRef=t,this.viewContainerRef=e,this.context=i,this.injector=r}get origin(){return this.templateRef.elementRef}attach(t,e=this.context){return this.context=e,super.attach(t)}detach(){return this.context=void 0,super.detach()}};var Jg=class extends dc{element;constructor(t){super(),this.element=t instanceof N?t.nativeElement:t}};var ds=class{_attachedPortal=null;_disposeFn=null;_isDisposed=!1;hasAttached(){return!!this._attachedPortal}attach(t){if(t instanceof ls)return this._attachedPortal=t,this.attachComponentPortal(t);if(t instanceof mn)return this._attachedPortal=t,this.attachTemplatePortal(t);if(this.attachDomPortal&&t instanceof Jg)return this._attachedPortal=t,this.attachDomPortal(t)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn()}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=!0}setDisposeFn(t){this._disposeFn=t}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null)}};var us=class extends ds{outletElement;_appRef;_defaultInjector;constructor(t,e,i){super(),this.outletElement=t,this._appRef=e,this._defaultInjector=i}attachComponentPortal(t){let e;if(t.viewContainerRef){let i=t.injector||t.viewContainerRef.injector,r=i.get(Mn,null,{optional:!0})||void 0;e=t.viewContainerRef.createComponent(t.component,{index:t.viewContainerRef.length,injector:i,ngModuleRef:r,projectableNodes:t.projectableNodes||void 0,bindings:t.bindings||void 0,directives:t.directives||void 0}),this.setDisposeFn(()=>e.destroy())}else{let i=this._appRef,r=t.injector||this._defaultInjector||T.NULL,o=r.get(_e,i.injector);e=Fd(t.component,{elementInjector:r,environmentInjector:o,projectableNodes:t.projectableNodes||void 0,bindings:t.bindings||void 0,directives:t.directives||void 0}),i.attachView(e.hostView),this.setDisposeFn(()=>{i.viewCount>0&&i.detachView(e.hostView),e.destroy()})}return this.outletElement.appendChild(this._getComponentRootNode(e)),this._attachedPortal=t,e}attachTemplatePortal(t){let e=t.viewContainerRef,i=e.createEmbeddedView(t.templateRef,t.context,{injector:t.injector});return i.rootNodes.forEach(r=>this.outletElement.appendChild(r)),i.detectChanges(),this.setDisposeFn(()=>{let r=e.indexOf(i);r!==-1&&e.remove(r)}),this._attachedPortal=t,i}attachDomPortal=t=>{let e=t.element;e.parentNode;let i=this.outletElement.ownerDocument.createComment(`dom-portal`);e.parentNode.insertBefore(i,e),this.outletElement.appendChild(e),this._attachedPortal=t,super.setDisposeFn(()=>{i.parentNode&&i.parentNode.replaceChild(e,i)})};dispose(){super.dispose(),this.outletElement.remove()}_getComponentRootNode(t){return t.hostView.rootNodes[0]}};var HJ=(()=>{class n extends mn{constructor(){let e=u(ut),i=u(it);super(e,i)}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`cdkPortal`,``]],exportAs:[`cdkPortal`],features:[ae]})}return n})();var uc=(()=>{class n extends ds{_moduleRef=u(Mn,{optional:!0});_document=u(M);_viewContainerRef=u(it);_isInitialized=!1;_attachedRef=null;get portal(){return this._attachedPortal}set portal(e){this.hasAttached()&&!e&&!this._isInitialized||(this.hasAttached()&&super.detach(),e&&super.attach(e),this._attachedPortal=e||null)}attached=new z;get attachedRef(){return this._attachedRef}ngOnInit(){this._isInitialized=!0}ngOnDestroy(){super.dispose(),this._attachedRef=this._attachedPortal=null}attachComponentPortal(e){e.setAttachedHost(this);let i=e.viewContainerRef!=null?e.viewContainerRef:this._viewContainerRef,r=i.createComponent(e.component,{index:i.length,injector:e.injector||i.injector,projectableNodes:e.projectableNodes||void 0,ngModuleRef:this._moduleRef||void 0,bindings:e.bindings||void 0,directives:e.directives||void 0});return i!==this._viewContainerRef&&this._getRootNode().appendChild(r.hostView.rootNodes[0]),super.setDisposeFn(()=>r.destroy()),this._attachedPortal=e,this._attachedRef=r,this.attached.emit(r),r}attachTemplatePortal(e){e.setAttachedHost(this);let i=this._viewContainerRef.createEmbeddedView(e.templateRef,e.context,{injector:e.injector});return super.setDisposeFn(()=>this._viewContainerRef.clear()),this._attachedPortal=e,this._attachedRef=i,this.attached.emit(i),i}attachDomPortal=e=>{let i=e.element;i.parentNode;let r=this._document.createComment(`dom-portal`);e.setAttachedHost(this),i.parentNode.insertBefore(r,i),this._getRootNode().appendChild(i),this._attachedPortal=e,super.setDisposeFn(()=>{r.parentNode&&r.parentNode.replaceChild(i,r)})};_getRootNode(){let e=this._viewContainerRef.element.nativeElement;return e.nodeType===e.ELEMENT_NODE?e:e.parentNode}static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵdir=D({type:n,selectors:[[``,`cdkPortalOutlet`,``]],inputs:{portal:[0,`cdkPortalOutlet`,`portal`]},outputs:{attached:`attached`},exportAs:[`cdkPortalOutlet`],features:[ae]})}return n})();var zr=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({})}return n})();var _F=20;var fs=(()=>{class n{_ngZone=u(I);_platform=u(fe);_renderer=u(Ve).createRenderer(null,null);_cleanupGlobalListener;_scrolled=new w;_scrolledCount=0;scrollContainers=new Map;register(e){this.scrollContainers.has(e)||this.scrollContainers.set(e,e.elementScrolled().subscribe(()=>this._scrolled.next(e)))}deregister(e){let i=this.scrollContainers.get(e);i&&(i.unsubscribe(),this.scrollContainers.delete(e))}scrolled(e=_F){return this._platform.isBrowser?new V(i=>{this._cleanupGlobalListener||(this._cleanupGlobalListener=this._ngZone.runOutsideAngular(()=>this._renderer.listen(`document`,`scroll`,()=>this._scrolled.next())));let r=e>0?this._scrolled.pipe(ro(e)).subscribe(i):this._scrolled.subscribe(i);return this._scrolledCount++,()=>{r.unsubscribe(),this._scrolledCount--,this._scrolledCount||(this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0)}}):F()}ngOnDestroy(){this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0,this.scrollContainers.forEach((e,i)=>this.deregister(i)),this._scrolled.complete()}ancestorScrolled(e,i){let r=this.getAncestorScrollContainers(e);return this.scrolled(i).pipe(re(o=>!o||r.indexOf(o)>-1))}getAncestorScrollContainers(e){let i=[];return this.scrollContainers.forEach((r,o)=>{this._targetContainsElement(o,e)&&i.push(o)}),i}_targetContainsElement(e,i){let r=wt(i),o=e.getElementRef().nativeElement;do if(r==o)return!0;while(r=r.parentElement);return!1}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var ev=(()=>{class n{elementRef=u(N);scrollDispatcher=u(fs);ngZone=u(I);dir=u(jt,{optional:!0});_scrollElement=this.elementRef.nativeElement;_destroyed=new w;_renderer=u(ge);_cleanupScroll;_elementScrolled=new w;ngOnInit(){this._cleanupScroll=this.ngZone.runOutsideAngular(()=>this._renderer.listen(this._scrollElement,`scroll`,e=>this._elementScrolled.next(e))),this.scrollDispatcher.register(this)}ngOnDestroy(){this._cleanupScroll?.(),this._elementScrolled.complete(),this.scrollDispatcher.deregister(this),this._destroyed.next(),this._destroyed.complete()}elementScrolled(){return this._elementScrolled}getElementRef(){return this.elementRef}scrollTo(e){let i=this.elementRef.nativeElement,r=this.dir&&this.dir.value==`rtl`;e.left??=r?e.end:e.start,e.right??=r?e.start:e.end,e.bottom!=null&&(e.top=i.scrollHeight-i.clientHeight-e.bottom),r&&is()!=hn.NORMAL?(e.left!=null&&(e.right=i.scrollWidth-i.clientWidth-e.left),is()==hn.INVERTED?e.left=e.right:is()==hn.NEGATED&&(e.left=e.right?-e.right:e.right)):e.right!=null&&(e.left=i.scrollWidth-i.clientWidth-e.right),this._applyScrollToOptions(e)}_applyScrollToOptions(e){let i=this.elementRef.nativeElement;Ou()?i.scrollTo(e):(e.top!=null&&(i.scrollTop=e.top),e.left!=null&&(i.scrollLeft=e.left))}measureScrollOffset(e){let i=`left`,r=`right`,o=this.elementRef.nativeElement;if(e==`top`)return o.scrollTop;if(e==`bottom`)return o.scrollHeight-o.clientHeight-o.scrollTop;let s=this.dir&&this.dir.value==`rtl`;return e==`start`?e=s?r:i:e==`end`&&(e=s?i:r),s&&is()==hn.INVERTED?e==i?o.scrollWidth-o.clientWidth-o.scrollLeft:o.scrollLeft:s&&is()==hn.NEGATED?e==i?o.scrollLeft+o.scrollWidth-o.clientWidth:-o.scrollLeft:e==i?o.scrollLeft:o.scrollWidth-o.clientWidth-o.scrollLeft}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`cdk-scrollable`,``],[``,`cdkScrollable`,``]]})}return n})();var bF=20;var $r=(()=>{class n{_platform=u(fe);_listeners;_viewportSize=null;_change=new w;_document=u(M);constructor(){let e=u(I),i=u(Ve).createRenderer(null,null);e.runOutsideAngular(()=>{if(this._platform.isBrowser){let r=o=>this._change.next(o);this._listeners=[i.listen(`window`,`resize`,r),i.listen(`window`,`orientationchange`,r)]}this.change().subscribe(()=>this._viewportSize=null)})}ngOnDestroy(){this._listeners?.forEach(e=>e()),this._change.complete()}getViewportSize(){this._viewportSize||this._updateViewportSize();let e={width:this._viewportSize.width,height:this._viewportSize.height};return this._platform.isBrowser||(this._viewportSize=null),e}getViewportRect(){let e=this.getViewportScrollPosition(),{width:i,height:r}=this.getViewportSize();return{top:e.top,left:e.left,bottom:e.top+r,right:e.left+i,height:r,width:i}}getViewportScrollPosition(){if(!this._platform.isBrowser)return{top:0,left:0};let e=this._document,i=this._getWindow(),r=e.documentElement,o=r.getBoundingClientRect();return{top:-o.top||e.body?.scrollTop||i.scrollY||r.scrollTop||0,left:-o.left||e.body?.scrollLeft||i.scrollX||r.scrollLeft||0}}change(e=bF){return e>0?this._change.pipe(ro(e)):this._change}_getWindow(){return this._document.defaultView||window}_updateViewportSize(){let e=this._getWindow();this._viewportSize=this._platform.isBrowser?{width:e.innerWidth,height:e.innerHeight}:{width:0,height:0}}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var fc=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({})}return n})();var tv=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[we,fc,we,fc]})}return n})();var vE=Ou();function ms(n){return new Hu(n.get($r),n.get(M))}var Hu=class{_viewportRuler;_previousHTMLStyles={top:``,left:``};_previousScrollPosition;_isEnabled=!1;_document;constructor(t,e){this._viewportRuler=t,this._document=e}attach(){}enable(){if(this._canBeEnabled()){let t=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=t.style.left||``,this._previousHTMLStyles.top=t.style.top||``,t.style.left=je(-this._previousScrollPosition.left),t.style.top=je(-this._previousScrollPosition.top),t.classList.add(`cdk-global-scrollblock`),this._isEnabled=!0}}disable(){if(this._isEnabled){let t=this._document.documentElement,e=this._document.body,i=t.style,r=e.style,o=i.scrollBehavior||``,s=r.scrollBehavior||``;this._isEnabled=!1,i.left=this._previousHTMLStyles.left,i.top=this._previousHTMLStyles.top,t.classList.remove(`cdk-global-scrollblock`),vE&&(i.scrollBehavior=r.scrollBehavior=`auto`),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),vE&&(i.scrollBehavior=o,r.scrollBehavior=s)}}_canBeEnabled(){if(this._document.documentElement.classList.contains(`cdk-global-scrollblock`)||this._isEnabled)return!1;let e=this._document.documentElement,i=this._viewportRuler.getViewportSize();return e.scrollHeight>i.height||e.scrollWidth>i.width}};function DE(n,t){return new zu(n.get(fs),n.get(I),n.get($r),t)}var zu=class{_scrollDispatcher;_ngZone;_viewportRuler;_config;_scrollSubscription=null;_overlayRef;_initialScrollPosition;constructor(t,e,i,r){this._scrollDispatcher=t,this._ngZone=e,this._viewportRuler=i,this._config=r}attach(t){this._overlayRef,this._overlayRef=t}enable(){if(this._scrollSubscription)return;let t=this._scrollDispatcher.scrolled(0).pipe(re(e=>!e||!this._overlayRef.overlayElement.contains(e.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=t.subscribe(()=>{let e=this._viewportRuler.getViewportScrollPosition().top;Math.abs(e-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition()})):this._scrollSubscription=t.subscribe(this._detach)}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}_detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach())}};var hc=class{enable(){}disable(){}attach(){}};function iv(n,t){return t.some(e=>{let i=n.bottom<e.top,r=n.top>e.bottom,o=n.right<e.left,s=n.left>e.right;return i||r||o||s})}function yE(n,t){return t.some(e=>{let i=n.top<e.top,r=n.bottom>e.bottom,o=n.left<e.left,s=n.right>e.right;return i||r||o||s})}function pc(n,t){return new $u(n.get(fs),n.get($r),n.get(I),t)}var $u=class{_scrollDispatcher;_viewportRuler;_ngZone;_config;_scrollSubscription=null;_overlayRef;constructor(t,e,i,r){this._scrollDispatcher=t,this._viewportRuler=e,this._ngZone=i,this._config=r}attach(t){this._overlayRef,this._overlayRef=t}enable(){if(!this._scrollSubscription){let t=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(t).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let e=this._overlayRef.overlayElement.getBoundingClientRect(),{width:i,height:r}=this._viewportRuler.getViewportSize();iv(e,[{width:i,height:r,bottom:r,right:i,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()))}})}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}};var EE=(()=>{class n{_injector=u(T);noop=()=>new hc;close=e=>DE(this._injector,e);block=()=>ms(this._injector);reposition=e=>pc(this._injector,e);static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var li=class{positionStrategy;scrollStrategy=new hc;panelClass=``;hasBackdrop=!1;backdropClass=`cdk-overlay-dark-backdrop`;disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=!1;usePopover;eventPredicate;constructor(t){if(t){let e=Object.keys(t);for(let i of e)t[i]!==void 0&&(this[i]=t[i])}}};var Wu=class{connectionPair;scrollableViewProperties;constructor(t,e){this.connectionPair=t,this.scrollableViewProperties=e}};var xE=(()=>{class n{_attachedOverlays=[];_document=u(M);_isAttached=!1;ngOnDestroy(){this.detach()}add(e){this.remove(e),this._attachedOverlays.push(e)}remove(e){let i=this._attachedOverlays.indexOf(e);i>-1&&this._attachedOverlays.splice(i,1),this._attachedOverlays.length===0&&this.detach()}canReceiveEvent(e,i,r){return r.observers.length<1?!1:e.eventPredicate?e.eventPredicate(i):!0}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var IE=(()=>{class n extends xE{_ngZone=u(I);_renderer=u(Ve).createRenderer(null,null);_cleanupKeydown;add(e){super.add(e),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen(`body`,`keydown`,this._keydownListener)}),this._isAttached=!0)}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=!1)}_keydownListener=e=>{let i=this._attachedOverlays;for(let r=i.length-1;r>-1;r--){let o=i[r];if(this.canReceiveEvent(o,e,o._keydownEvents)){this._ngZone.run(()=>o._keydownEvents.next(e));break}}};static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var NE=(()=>{class n extends xE{_platform=u(fe);_ngZone=u(I);_renderer=u(Ve).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=!1;_pointerDownEventTarget=null;_cleanups;add(e){if(super.add(e),!this._isAttached){let i=this._document.body,r={capture:!0},o=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[o.listen(i,`pointerdown`,this._pointerDownListener,r),o.listen(i,`click`,this._clickListener,r),o.listen(i,`auxclick`,this._clickListener,r),o.listen(i,`contextmenu`,this._clickListener,r)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=i.style.cursor,i.style.cursor=`pointer`,this._cursorStyleIsSet=!0),this._isAttached=!0}}detach(){this._isAttached&&(this._cleanups?.forEach(e=>e()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=!1),this._isAttached=!1)}_pointerDownListener=e=>{this._pointerDownEventTarget=St(e)};_clickListener=e=>{let i=St(e),r=e.type===`click`&&this._pointerDownEventTarget?this._pointerDownEventTarget:i;this._pointerDownEventTarget=null;let o=this._attachedOverlays.slice();for(let s=o.length-1;s>-1;s--){let a=o[s],c=a._outsidePointerEvents;if(!(!a.hasAttached()||!this.canReceiveEvent(a,e,c))){if(_E(a.overlayElement,i)||_E(a.overlayElement,r))break;this._ngZone?this._ngZone.run(()=>c.next(e)):c.next(e)}}};static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function _E(n,t){let e=typeof ShadowRoot<`u`&&ShadowRoot,i=t;for(;i;){if(i===n)return!0;i=e&&i instanceof ShadowRoot?i.host:i.parentNode}return!1}var ME=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`ng-component`]],hostAttrs:[`cdk-overlay-style-loader`,``],decls:0,vars:0,template:function(i,r){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
  pointer-events: none;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.cdk-overlay-container {
  position: fixed;
}
@layer cdk-overlay {
  .cdk-overlay-container {
    z-index: 1000;
  }
}
.cdk-overlay-container:empty {
  display: none;
}

.cdk-global-overlay-wrapper {
  display: flex;
  position: absolute;
}
@layer cdk-overlay {
  .cdk-global-overlay-wrapper {
    z-index: 1000;
  }
}

.cdk-overlay-pane {
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  display: flex;
  max-width: 100%;
  max-height: 100%;
}
@layer cdk-overlay {
  .cdk-overlay-pane {
    z-index: 1000;
  }
}

.cdk-overlay-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  opacity: 0;
  touch-action: manipulation;
}
@layer cdk-overlay {
  .cdk-overlay-backdrop {
    z-index: 1000;
    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}
@media (prefers-reduced-motion) {
  .cdk-overlay-backdrop {
    transition-duration: 1ms;
  }
}

.cdk-overlay-backdrop-showing {
  opacity: 1;
}
@media (forced-colors: active) {
  .cdk-overlay-backdrop-showing {
    opacity: 0.6;
  }
}

@layer cdk-overlay {
  .cdk-overlay-dark-backdrop {
    background: rgba(0, 0, 0, 0.32);
  }
}

.cdk-overlay-transparent-backdrop {
  transition: visibility 1ms linear, opacity 1ms linear;
  visibility: hidden;
  opacity: 1;
}
.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {
  opacity: 0;
  visibility: visible;
}

.cdk-overlay-backdrop-noop-animation {
  transition: none;
}

.cdk-overlay-connected-position-bounding-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 1px;
  min-height: 1px;
}
@layer cdk-overlay {
  .cdk-overlay-connected-position-bounding-box {
    z-index: 1000;
  }
}

.cdk-global-scrollblock {
  position: fixed;
  width: 100%;
  overflow-y: scroll;
}

.cdk-overlay-popover {
  background: none;
  border: none;
  padding: 0;
  outline: 0;
  overflow: visible;
  position: fixed;
  pointer-events: none;
  white-space: normal;
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  inset: auto;
  top: 0;
  left: 0;
}
.cdk-overlay-popover::backdrop {
  display: none;
}
.cdk-overlay-popover .cdk-overlay-backdrop {
  position: fixed;
  z-index: auto;
}
`],encapsulation:2})}return n})();var Yu=(()=>{class n{_platform=u(fe);_containerElement;_document=u(M);_styleLoader=u(qe);ngOnDestroy(){this._containerElement?.remove()}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let e=`cdk-overlay-container`;if(this._platform.isBrowser||$g()){let r=this._document.querySelectorAll(`.${e}[platform="server"], .${e}[platform="test"]`);for(let o=0;o<r.length;o++)r[o].remove()}let i=this._document.createElement(`div`);i.classList.add(e),$g()?i.setAttribute(`platform`,`test`):this._platform.isBrowser||i.setAttribute(`platform`,`server`),this._document.body.appendChild(i),this._containerElement=i}_loadStyles(){this._styleLoader.load(ME)}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var rv=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(t,e,i,r){this._renderer=e,this._ngZone=i,this.element=t.createElement(`div`),this.element.classList.add(`cdk-overlay-backdrop`),this._cleanupClick=e.listen(this.element,`click`,r)}detach(){this._ngZone.runOutsideAngular(()=>{let t=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(t,`transitionend`,this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),t.style.pointerEvents=`none`,t.classList.remove(`cdk-overlay-backdrop-showing`)})}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove()}};function sv(n){return n&&n.nodeType===1}var nv=new Set;var hs=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new w;_attachments=new w;_detachments=new w;_positionStrategy;_scrollStrategy;_locationChanges=Q.EMPTY;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=!1;_previousHostParent;_keydownEvents=new w;_outsidePointerEvents=new w;_afterNextRenderRef;constructor(t,e,i,r,o,s,a,c,l,d=!1,f,h){this._portalOutlet=t,this._host=e,this._pane=i,this._config=r,this._ngZone=o,this._keyboardDispatcher=s,this._document=a,this._location=c,this._outsideClickDispatcher=l,this._animationsDisabled=d,this._injector=f,this._renderer=h,r.scrollStrategy&&(this._scrollStrategy=r.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=r.positionStrategy}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(t){if(this._disposed)return null;this._attachHost();let e=this._portalOutlet.attach(t);return this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),nv.add(this),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=xt(()=>{this.hasAttached()&&this.updatePosition()},{injector:this._injector}),this._togglePointerEvents(!0),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!0),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof e?.onDestroy==`function`&&e.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()))}),e}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(!1),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let t=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),nv.delete(this),t}dispose(){if(this._disposed)return;let t=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,t&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=!0,nv.delete(this)}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply()}updatePositionStrategy(t){t!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=t,this.hasAttached()&&(t.attach(this),this.updatePosition()))}updateSize(t){this._config=p(p({},this._config),t),this._updateElementSize()}setDirection(t){this._config=S(p({},this._config),{direction:t}),this._updateElementDirection()}addPanelClass(t){this._pane&&this._toggleClasses(this._pane,t,!0)}removePanelClass(t){this._pane&&this._toggleClasses(this._pane,t,!1)}getDirection(){let t=this._config.direction;return t?typeof t==`string`?t:t.value:`ltr`}updateScrollStrategy(t){t!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=t,this.hasAttached()&&(t.attach(this),t.enable()))}_updateElementDirection(){this._host.setAttribute(`dir`,this.getDirection())}_updateElementSize(){if(!this._pane)return;let t=this._pane.style;t.width=je(this._config.width),t.height=je(this._config.height),t.minWidth=je(this._config.minWidth),t.minHeight=je(this._config.minHeight),t.maxWidth=je(this._config.maxWidth),t.maxHeight=je(this._config.maxHeight)}_togglePointerEvents(t){this._pane.style.pointerEvents=t?``:`none`}_attachHost(){if(!this._host.parentElement){let t=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;sv(t)?t.after(this._host):t?.type===`parent`?t.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host)}if(this._config.usePopover)try{this._host.showPopover()}catch{}}_attachBackdrop(){let t=`cdk-overlay-backdrop-showing`;this._backdropRef?.dispose(),this._backdropRef=new rv(this._document,this._renderer,this._ngZone,e=>{this._backdropClick.next(e)}),this._animationsDisabled&&this._backdropRef.element.classList.add(`cdk-overlay-backdrop-noop-animation`),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,!0),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<`u`?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(t))}):this._backdropRef.element.classList.add(t)}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host)}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach()}_toggleClasses(t,e,i){let r=Xo(e||[]).filter(o=>!!o);r.length&&(i?t.classList.add(...r):t.classList.remove(...r))}_detachContentWhenEmpty(){let t=!1;try{this._detachContentAfterRenderRef=xt(()=>{t=!0,this._detachContent()},{injector:this._injector})}catch(e){if(t)throw e;this._detachContent()}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent()}),this._detachContentMutationObserver.observe(this._pane,{childList:!0}))}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!1),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent())}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect()}_disposeScrollStrategy(){let t=this._scrollStrategy;t?.disable(),t?.detach?.()}};var bE=`cdk-overlay-connected-position-bounding-box`;var wF=/([A-Za-z%]+)$/;function gc(n,t){return new Gu(t,n.get($r),n.get(M),n.get(fe),n.get(Yu))}var Gu=class{_viewportRuler;_document;_platform;_overlayContainer;_overlayRef;_isInitialRender=!1;_lastBoundingBoxSize={width:0,height:0};_isPushed=!1;_canPush=!0;_growAfterOpen=!1;_hasFlexibleDimensions=!0;_positionLocked=!1;_originRect;_overlayRect;_viewportRect;_containerRect;_viewportMargin=0;_scrollables=[];_preferredPositions=[];_origin;_pane;_isDisposed=!1;_boundingBox=null;_lastPosition=null;_lastScrollVisibility=null;_positionChanges=new w;_resizeSubscription=Q.EMPTY;_offsetX=0;_offsetY=0;_transformOriginSelector;_appliedPanelClasses=[];_previousPushAmount=null;_popoverLocation=`global`;positionChanges=this._positionChanges;get positions(){return this._preferredPositions}constructor(t,e,i,r,o){this._viewportRuler=e,this._document=i,this._platform=r,this._overlayContainer=o,this.setOrigin(t)}attach(t){this._overlayRef&&this._overlayRef,this._validatePositions(),t.hostElement.classList.add(bE),this._overlayRef=t,this._boundingBox=t.hostElement,this._pane=t.overlayElement,this._isDisposed=!1,this._isInitialRender=!0,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=!0,this.apply()})}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._getContainerRect();let t=this._originRect,e=this._overlayRect,i=this._viewportRect,r=this._containerRect,o=[],s;for(let a of this._preferredPositions){let c=this._getOriginPoint(t,r,a),l=this._getOverlayPoint(c,e,a),d=this._getOverlayFit(l,e,i,a);if(d.isCompletelyWithinViewport){this._isPushed=!1,this._applyPosition(a,c);return}if(this._canFitWithFlexibleDimensions(d,l,i)){o.push({position:a,origin:c,overlayRect:e,boundingBoxRect:this._calculateBoundingBoxRect(c,a)});continue}(!s||s.overlayFit.visibleArea<d.visibleArea)&&(s={overlayFit:d,overlayPoint:l,originPoint:c,position:a,overlayRect:e})}if(o.length){let a=null,c=-1;for(let l of o){let d=l.boundingBoxRect.width*l.boundingBoxRect.height*(l.position.weight||1);d>c&&(c=d,a=l)}this._isPushed=!1,this._applyPosition(a.position,a.origin);return}if(this._canPush){this._isPushed=!0,this._applyPosition(s.position,s.originPoint);return}this._applyPosition(s.position,s.originPoint)}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe()}dispose(){this._isDisposed||(this._boundingBox&&Wr(this._boundingBox.style,{top:``,left:``,right:``,bottom:``,height:``,width:``,alignItems:``,justifyContent:``}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(bE),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=!0)}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let t=this._lastPosition;t?(this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._getContainerRect(),this._applyPosition(t,this._getOriginPoint(this._originRect,this._containerRect,t))):this.apply()}withScrollableContainers(t){return this._scrollables=t,this}withPositions(t){return this._preferredPositions=t,t.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(t){return this._viewportMargin=t,this}withFlexibleDimensions(t=!0){return this._hasFlexibleDimensions=t,this}withGrowAfterOpen(t=!0){return this._growAfterOpen=t,this}withPush(t=!0){return this._canPush=t,this}withLockedPosition(t=!0){return this._positionLocked=t,this}setOrigin(t){return this._origin=t,this}withDefaultOffsetX(t){return this._offsetX=t,this}withDefaultOffsetY(t){return this._offsetY=t,this}withTransformOriginOn(t){return this._transformOriginSelector=t,this}withPopoverLocation(t){return this._popoverLocation=t,this}getPopoverInsertionPoint(){return this._popoverLocation===`global`?null:this._popoverLocation!==`inline`?this._popoverLocation:this._origin instanceof N?this._origin.nativeElement:sv(this._origin)?this._origin:null}_getOriginPoint(t,e,i){let r;if(i.originX==`center`)r=t.left+t.width/2;else{let s=this._isRtl()?t.right:t.left,a=this._isRtl()?t.left:t.right;r=i.originX==`start`?s:a}e.left<0&&(r-=e.left);let o;return i.originY==`center`?o=t.top+t.height/2:o=i.originY==`top`?t.top:t.bottom,e.top<0&&(o-=e.top),{x:r,y:o}}_getOverlayPoint(t,e,i){let r;i.overlayX==`center`?r=-e.width/2:i.overlayX===`start`?r=this._isRtl()?-e.width:0:r=this._isRtl()?0:-e.width;let o;return i.overlayY==`center`?o=-e.height/2:o=i.overlayY==`top`?0:-e.height,{x:t.x+r,y:t.y+o}}_getOverlayFit(t,e,i,r){let o=wE(e),{x:s,y:a}=t,c=this._getOffset(r,`x`),l=this._getOffset(r,`y`);c&&(s+=c),l&&(a+=l);let d=0-s,f=s+o.width-i.width,h=0-a,m=a+o.height-i.height,v=this._subtractOverflows(o.width,d,f),y=this._subtractOverflows(o.height,h,m),R=v*y;return{visibleArea:R,isCompletelyWithinViewport:o.width*o.height===R,fitsInViewportVertically:y===o.height,fitsInViewportHorizontally:v==o.width}}_canFitWithFlexibleDimensions(t,e,i){if(this._hasFlexibleDimensions){let r=i.bottom-e.y,o=i.right-e.x,s=SE(this._overlayRef.getConfig().minHeight),a=SE(this._overlayRef.getConfig().minWidth),c=t.fitsInViewportVertically||s!=null&&s<=r,l=t.fitsInViewportHorizontally||a!=null&&a<=o;return c&&l}return!1}_pushOverlayOnScreen(t,e,i){if(this._previousPushAmount&&this._positionLocked)return{x:t.x+this._previousPushAmount.x,y:t.y+this._previousPushAmount.y};let r=wE(e),o=this._viewportRect,s=Math.max(t.x+r.width-o.width,0),a=Math.max(t.y+r.height-o.height,0),c=Math.max(o.top-i.top-t.y,0),l=Math.max(o.left-i.left-t.x,0),d=0,f=0;return r.width<=o.width?d=l||-s:d=t.x<this._getViewportMarginStart()?o.left-i.left-t.x:0,r.height<=o.height?f=c||-a:f=t.y<this._getViewportMarginTop()?o.top-i.top-t.y:0,this._previousPushAmount={x:d,y:f},{x:t.x+d,y:t.y+f}}_applyPosition(t,e){if(this._setTransformOrigin(t),this._setOverlayElementStyles(e,t),this._setBoundingBoxStyles(e,t),t.panelClass&&this._addPanelClasses(t.panelClass),this._positionChanges.observers.length){let i=this._getScrollVisibility();if(t!==this._lastPosition||!this._lastScrollVisibility||!CF(this._lastScrollVisibility,i)){let r=new Wu(t,i);this._positionChanges.next(r)}this._lastScrollVisibility=i}this._lastPosition=t,this._isInitialRender=!1}_setTransformOrigin(t){if(!this._transformOriginSelector)return;let e=this._boundingBox.querySelectorAll(this._transformOriginSelector),i,r=t.overlayY;t.overlayX===`center`?i=`center`:this._isRtl()?i=t.overlayX===`start`?`right`:`left`:i=t.overlayX===`start`?`left`:`right`;for(let o=0;o<e.length;o++)e[o].style.transformOrigin=`${i} ${r}`}_calculateBoundingBoxRect(t,e){let i=this._viewportRect,r=this._isRtl(),o,s,a;if(e.overlayY===`top`)s=t.y,o=i.height-s+this._getViewportMarginBottom();else if(e.overlayY===`bottom`)a=i.height-t.y+this._getViewportMarginTop()+this._getViewportMarginBottom(),o=i.height-a+this._getViewportMarginTop();else{let m=Math.min(i.bottom-t.y+i.top,t.y),v=this._lastBoundingBoxSize.height;o=m*2,s=t.y-m,o>v&&!this._isInitialRender&&!this._growAfterOpen&&(s=t.y-v/2)}let c=e.overlayX===`start`&&!r||e.overlayX===`end`&&r,l=e.overlayX===`end`&&!r||e.overlayX===`start`&&r,d,f,h;if(l)h=i.width-t.x+this._getViewportMarginStart()+this._getViewportMarginEnd(),d=t.x-this._getViewportMarginStart();else if(c)f=t.x,d=i.right-t.x-this._getViewportMarginEnd();else{let m=Math.min(i.right-t.x+i.left,t.x),v=this._lastBoundingBoxSize.width;d=m*2,f=t.x-m,d>v&&!this._isInitialRender&&!this._growAfterOpen&&(f=t.x-v/2)}return{top:s,left:f,bottom:a,right:h,width:d,height:o}}_setBoundingBoxStyles(t,e){let i=this._calculateBoundingBoxRect(t,e);!this._isInitialRender&&!this._growAfterOpen&&(i.height=Math.min(i.height,this._lastBoundingBoxSize.height),i.width=Math.min(i.width,this._lastBoundingBoxSize.width));let r={};if(this._hasExactPosition())r.top=r.left=`0`,r.bottom=r.right=`auto`,r.maxHeight=r.maxWidth=``,r.width=r.height=`100%`;else{let o=this._overlayRef.getConfig().maxHeight,s=this._overlayRef.getConfig().maxWidth;r.width=je(i.width),r.height=je(i.height),r.top=je(i.top)||`auto`,r.bottom=je(i.bottom)||`auto`,r.left=je(i.left)||`auto`,r.right=je(i.right)||`auto`,e.overlayX===`center`?r.alignItems=`center`:r.alignItems=e.overlayX===`end`?`flex-end`:`flex-start`,e.overlayY===`center`?r.justifyContent=`center`:r.justifyContent=e.overlayY===`bottom`?`flex-end`:`flex-start`,o&&(r.maxHeight=je(o)),s&&(r.maxWidth=je(s))}this._lastBoundingBoxSize=i,Wr(this._boundingBox.style,r)}_resetBoundingBoxStyles(){Wr(this._boundingBox.style,{top:`0`,left:`0`,right:`0`,bottom:`0`,height:``,width:``,alignItems:``,justifyContent:``})}_resetOverlayElementStyles(){Wr(this._pane.style,{top:``,left:``,bottom:``,right:``,position:``,transform:``})}_setOverlayElementStyles(t,e){let i={},r=this._hasExactPosition(),o=this._hasFlexibleDimensions,s=this._overlayRef.getConfig();if(r){let d=this._viewportRuler.getViewportScrollPosition();Wr(i,this._getExactOverlayY(e,t,d)),Wr(i,this._getExactOverlayX(e,t,d))}else i.position=`static`;let a=``,c=this._getOffset(e,`x`),l=this._getOffset(e,`y`);c&&(a+=`translateX(${c}px) `),l&&(a+=`translateY(${l}px)`),i.transform=a.trim(),s.maxHeight&&(r?i.maxHeight=je(s.maxHeight):o&&(i.maxHeight=``)),s.maxWidth&&(r?i.maxWidth=je(s.maxWidth):o&&(i.maxWidth=``)),Wr(this._pane.style,i)}_getExactOverlayY(t,e,i){let r={top:``,bottom:``},o=this._getOverlayPoint(e,this._overlayRect,t);if(this._isPushed&&(o=this._pushOverlayOnScreen(o,this._overlayRect,i)),t.overlayY===`bottom`)r.bottom=`${this._document.documentElement.clientHeight-(o.y+this._overlayRect.height)}px`;else r.top=je(o.y);return r}_getExactOverlayX(t,e,i){let r={left:``,right:``},o=this._getOverlayPoint(e,this._overlayRect,t);this._isPushed&&(o=this._pushOverlayOnScreen(o,this._overlayRect,i));let s;if(this._isRtl()?s=t.overlayX===`end`?`left`:`right`:s=t.overlayX===`end`?`right`:`left`,s===`right`)r.right=`${this._document.documentElement.clientWidth-(o.x+this._overlayRect.width)}px`;else r.left=je(o.x);return r}_getScrollVisibility(){let t=this._getOriginRect(),e=this._pane.getBoundingClientRect(),i=this._scrollables.map(r=>r.getElementRef().nativeElement.getBoundingClientRect());return{isOriginClipped:yE(t,i),isOriginOutsideView:iv(t,i),isOverlayClipped:yE(e,i),isOverlayOutsideView:iv(e,i)}}_subtractOverflows(t,...e){return e.reduce((i,r)=>i-Math.max(r,0),t)}_getNarrowedViewportRect(){let t=this._document.documentElement.clientWidth,e=this._document.documentElement.clientHeight,i=this._viewportRuler.getViewportScrollPosition();return{top:i.top+this._getViewportMarginTop(),left:i.left+this._getViewportMarginStart(),right:i.left+t-this._getViewportMarginEnd(),bottom:i.top+e-this._getViewportMarginBottom(),width:t-this._getViewportMarginStart()-this._getViewportMarginEnd(),height:e-this._getViewportMarginTop()-this._getViewportMarginBottom()}}_isRtl(){return this._overlayRef.getDirection()===`rtl`}_hasExactPosition(){return!this._hasFlexibleDimensions||this._isPushed}_getOffset(t,e){return e===`x`?t.offsetX==null?this._offsetX:t.offsetX:t.offsetY==null?this._offsetY:t.offsetY}_validatePositions(){}_addPanelClasses(t){this._pane&&Xo(t).forEach(e=>{e!==``&&this._appliedPanelClasses.indexOf(e)===-1&&(this._appliedPanelClasses.push(e),this._pane.classList.add(e))})}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(t=>{this._pane.classList.remove(t)}),this._appliedPanelClasses=[])}_getViewportMarginStart(){return typeof this._viewportMargin==`number`?this._viewportMargin:this._viewportMargin?.start??0}_getViewportMarginEnd(){return typeof this._viewportMargin==`number`?this._viewportMargin:this._viewportMargin?.end??0}_getViewportMarginTop(){return typeof this._viewportMargin==`number`?this._viewportMargin:this._viewportMargin?.top??0}_getViewportMarginBottom(){return typeof this._viewportMargin==`number`?this._viewportMargin:this._viewportMargin?.bottom??0}_getOriginRect(){let t=this._origin;if(t instanceof N)return t.nativeElement.getBoundingClientRect();if(t instanceof Element)return t.getBoundingClientRect();let e=t.width||0,i=t.height||0;return{top:t.y,bottom:t.y+i,left:t.x,right:t.x+e,height:i,width:e}}_getContainerRect(){let t=this._overlayRef.getConfig().usePopover&&this._popoverLocation!==`global`,e=this._overlayContainer.getContainerElement();t&&(e.style.display=`block`);let i=e.getBoundingClientRect();return t&&(e.style.display=``),i}};function Wr(n,t){for(let e in t)t.hasOwnProperty(e)&&(n[e]=t[e]);return n}function SE(n){if(typeof n!=`number`&&n!=null){let[t,e]=n.split(wF);return!e||e===`px`?parseFloat(t):null}return n||null}function wE(n){return{top:Math.floor(n.top),right:Math.floor(n.right),bottom:Math.floor(n.bottom),left:Math.floor(n.left),width:Math.floor(n.width),height:Math.floor(n.height)}}function CF(n,t){return n===t?!0:n.isOriginClipped===t.isOriginClipped&&n.isOriginOutsideView===t.isOriginOutsideView&&n.isOverlayClipped===t.isOverlayClipped&&n.isOverlayOutsideView===t.isOverlayOutsideView}var CE=`cdk-global-overlay-wrapper`;function ps(n){return new qu}var qu=class{_overlayRef;_cssPosition=`static`;_topOffset=``;_bottomOffset=``;_alignItems=``;_xPosition=``;_xOffset=``;_width=``;_height=``;_isDisposed=!1;attach(t){let e=t.getConfig();this._overlayRef=t,this._width&&!e.width&&t.updateSize({width:this._width}),this._height&&!e.height&&t.updateSize({height:this._height}),t.hostElement.classList.add(CE),this._isDisposed=!1}top(t=``){return this._bottomOffset=``,this._topOffset=t,this._alignItems=`flex-start`,this}left(t=``){return this._xOffset=t,this._xPosition=`left`,this}bottom(t=``){return this._topOffset=``,this._bottomOffset=t,this._alignItems=`flex-end`,this}right(t=``){return this._xOffset=t,this._xPosition=`right`,this}start(t=``){return this._xOffset=t,this._xPosition=`start`,this}end(t=``){return this._xOffset=t,this._xPosition=`end`,this}width(t=``){return this._overlayRef?this._overlayRef.updateSize({width:t}):this._width=t,this}height(t=``){return this._overlayRef?this._overlayRef.updateSize({height:t}):this._height=t,this}centerHorizontally(t=``){return this.left(t),this._xPosition=`center`,this}centerVertically(t=``){return this.top(t),this._alignItems=`center`,this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let t=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement.style,{width:r,height:o,maxWidth:s,maxHeight:a}=this._overlayRef.getConfig(),c=(r===`100%`||r===`100vw`)&&(!s||s===`100%`||s===`100vw`),l=(o===`100%`||o===`100vh`)&&(!a||a===`100%`||a===`100vh`),d=this._xPosition,f=this._xOffset,h=this._overlayRef.getConfig().direction===`rtl`,m=``,v=``,y=``;c?y=`flex-start`:d===`center`?(y=`center`,h?v=f:m=f):h?d===`left`||d===`end`?(y=`flex-end`,m=f):(d===`right`||d===`start`)&&(y=`flex-start`,v=f):d===`left`||d===`start`?(y=`flex-start`,m=f):(d===`right`||d===`end`)&&(y=`flex-end`,v=f),t.position=this._cssPosition,t.marginLeft=c?`0`:m,t.marginTop=l?`0`:this._topOffset,t.marginBottom=this._bottomOffset,t.marginRight=c?`0`:v,e.justifyContent=y,e.alignItems=l?`flex-start`:this._alignItems}dispose(){if(this._isDisposed||!this._overlayRef)return;let t=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement,i=e.style;e.classList.remove(CE),i.justifyContent=i.alignItems=t.marginTop=t.marginBottom=t.marginLeft=t.marginRight=t.position=``,this._overlayRef=null,this._isDisposed=!0}};var TE=(()=>{class n{_injector=u(T);global(){return ps()}flexibleConnectedTo(e){return gc(this._injector,e)}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var av=new g(`OVERLAY_DEFAULT_CONFIG`);function Gr(n,t){n.get(qe).load(ME);let e=n.get(Yu),i=n.get(M),r=n.get(ot),o=n.get(vt),s=n.get(jt),a=n.get(ge,null,{optional:!0})||n.get(Ve).createRenderer(null,null),c=new li(t),l=n.get(av,null,{optional:!0})?.usePopover??!0;c.direction=c.direction||s.value,!i.body||!(`showPopover`in i.body)?c.usePopover=!1:c.usePopover=t?.usePopover??l;let d=i.createElement(`div`),f=i.createElement(`div`);d.id=r.getId(`cdk-overlay-`),d.classList.add(`cdk-overlay-pane`),f.appendChild(d),c.usePopover&&(f.setAttribute(`popover`,`manual`),f.classList.add(`cdk-overlay-popover`));let h=c.usePopover?c.positionStrategy?.getPopoverInsertionPoint?.():null;return sv(h)?h.after(f):h?.type===`parent`?h.element.appendChild(f):e.getContainerElement().appendChild(f),new hs(new us(d,o,n),f,d,c,n.get(I),n.get(IE),i,n.get(Ai),n.get(NE),t?.disableAnimations??n.get(aa,null,{optional:!0})===`NoopAnimations`,n.get(_e),a)}var AE=(()=>{class n{scrollStrategies=u(EE);_positionBuilder=u(TE);_injector=u(T);create(e){return Gr(this._injector,e)}position(){return this._positionBuilder}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var DF=[{originX:`start`,originY:`bottom`,overlayX:`start`,overlayY:`top`},{originX:`start`,originY:`top`,overlayX:`start`,overlayY:`bottom`},{originX:`end`,originY:`top`,overlayX:`end`,overlayY:`bottom`},{originX:`end`,originY:`bottom`,overlayX:`end`,overlayY:`top`}];var EF=new g(`cdk-connected-overlay-scroll-strategy`,{providedIn:`root`,factory:()=>{let n=u(T);return()=>pc(n)}});var ov=(()=>{class n{elementRef=u(N);static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`cdk-overlay-origin`,``],[``,`overlay-origin`,``],[``,`cdkOverlayOrigin`,``]],exportAs:[`cdkOverlayOrigin`]})}return n})();var RE=new g(`cdk-connected-overlay-default-config`);var xF=(()=>{class n{_dir=u(jt,{optional:!0});_injector=u(T);_overlayRef;_templatePortal;_backdropSubscription=Q.EMPTY;_attachSubscription=Q.EMPTY;_detachSubscription=Q.EMPTY;_positionSubscription=Q.EMPTY;_offsetX;_offsetY;_position;_scrollStrategyFactory=u(EF);_ngZone=u(I);origin;positions;positionStrategy;get offsetX(){return this._offsetX}set offsetX(e){this._offsetX=e,this._position&&this._updatePositionStrategy(this._position)}get offsetY(){return this._offsetY}set offsetY(e){this._offsetY=e,this._position&&this._updatePositionStrategy(this._position)}width;height;minWidth;minHeight;backdropClass;panelClass;viewportMargin=0;scrollStrategy;open=!1;disableClose=!1;transformOriginSelector;hasBackdrop=!1;lockPosition=!1;flexibleDimensions=!1;growAfterOpen=!1;push=!1;disposeOnNavigation=!1;usePopover;matchWidth=!1;set _config(e){typeof e!=`string`&&this._assignConfig(e)}backdropClick=new z;positionChange=new z;attach=new z;detach=new z;overlayKeydown=new z;overlayOutsideClick=new z;constructor(){let e=u(ut),i=u(it),r=u(RE,{optional:!0}),o=u(av,{optional:!0});this.usePopover=o?.usePopover===!1?null:`global`,this._templatePortal=new mn(e,i),this.scrollStrategy=this._scrollStrategyFactory(),r&&this._assignConfig(r)}get overlayRef(){return this._overlayRef}get dir(){return this._dir?this._dir.value:`ltr`}ngOnDestroy(){this._attachSubscription.unsubscribe(),this._detachSubscription.unsubscribe(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this._overlayRef?.dispose()}ngOnChanges(e){this._position&&(this._updatePositionStrategy(this._position),this._overlayRef?.updateSize({width:this._getWidth(),minWidth:this.minWidth,height:this.height,minHeight:this.minHeight}),e.origin&&this.open&&this._position.apply()),e.open&&(this.open?this.attachOverlay():this.detachOverlay())}_createOverlay(){(!this.positions||!this.positions.length)&&(this.positions=DF);let e=this._overlayRef=Gr(this._injector,this._buildConfig());this._attachSubscription=e.attachments().subscribe(()=>this.attach.emit()),this._detachSubscription=e.detachments().subscribe(()=>this.detach.emit()),e.keydownEvents().subscribe(i=>{this.overlayKeydown.next(i),i.keyCode===27&&!this.disableClose&&!Pn(i)&&(i.preventDefault(),this.detachOverlay())}),this._overlayRef.outsidePointerEvents().subscribe(i=>{let r=this._getOriginElement(),o=St(i);(!r||r!==o&&!r.contains(o))&&this.overlayOutsideClick.next(i)})}_buildConfig(){let e=this._position=this.positionStrategy||this._createPositionStrategy(),i=new li({direction:this._dir||`ltr`,positionStrategy:e,scrollStrategy:this.scrollStrategy,hasBackdrop:this.hasBackdrop,disposeOnNavigation:this.disposeOnNavigation,usePopover:!!this.usePopover});return(this.height||this.height===0)&&(i.height=this.height),(this.minWidth||this.minWidth===0)&&(i.minWidth=this.minWidth),(this.minHeight||this.minHeight===0)&&(i.minHeight=this.minHeight),this.backdropClass&&(i.backdropClass=this.backdropClass),this.panelClass&&(i.panelClass=this.panelClass),i}_updatePositionStrategy(e){let i=this.positions.map(r=>({originX:r.originX,originY:r.originY,overlayX:r.overlayX,overlayY:r.overlayY,offsetX:r.offsetX||this.offsetX,offsetY:r.offsetY||this.offsetY,panelClass:r.panelClass||void 0}));return e.setOrigin(this._getOrigin()).withPositions(i).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector).withPopoverLocation(this.usePopover===null?`global`:this.usePopover)}_createPositionStrategy(){let e=gc(this._injector,this._getOrigin());return this._updatePositionStrategy(e),e}_getOrigin(){return this.origin instanceof ov?this.origin.elementRef:this.origin}_getOriginElement(){return this.origin instanceof ov?this.origin.elementRef.nativeElement:this.origin instanceof N?this.origin.nativeElement:typeof Element<`u`&&this.origin instanceof Element?this.origin:null}_getWidth(){return this.width?this.width:this.matchWidth?this._getOriginElement()?.getBoundingClientRect?.().width:void 0}attachOverlay(){this._overlayRef||this._createOverlay();let e=this._overlayRef;e.getConfig().hasBackdrop=this.hasBackdrop,e.updateSize({width:this._getWidth()}),e.hasAttached()||e.attach(this._templatePortal),this.hasBackdrop?this._backdropSubscription=e.backdropClick().subscribe(i=>this.backdropClick.emit(i)):this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.positionChange.observers.length>0&&(this._positionSubscription=this._position.positionChanges.pipe(zf(()=>this.positionChange.observers.length>0)).subscribe(i=>{this._ngZone.run(()=>this.positionChange.emit(i)),this.positionChange.observers.length===0&&this._positionSubscription.unsubscribe()})),this.open=!0}detachOverlay(){this._overlayRef?.detach(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.open=!1}_assignConfig(e){this.origin=e.origin??this.origin,this.positions=e.positions??this.positions,this.positionStrategy=e.positionStrategy??this.positionStrategy,this.offsetX=e.offsetX??this.offsetX,this.offsetY=e.offsetY??this.offsetY,this.width=e.width??this.width,this.height=e.height??this.height,this.minWidth=e.minWidth??this.minWidth,this.minHeight=e.minHeight??this.minHeight,this.backdropClass=e.backdropClass??this.backdropClass,this.panelClass=e.panelClass??this.panelClass,this.viewportMargin=e.viewportMargin??this.viewportMargin,this.scrollStrategy=e.scrollStrategy??this.scrollStrategy,this.disableClose=e.disableClose??this.disableClose,this.transformOriginSelector=e.transformOriginSelector??this.transformOriginSelector,this.hasBackdrop=e.hasBackdrop??this.hasBackdrop,this.lockPosition=e.lockPosition??this.lockPosition,this.flexibleDimensions=e.flexibleDimensions??this.flexibleDimensions,this.growAfterOpen=e.growAfterOpen??this.growAfterOpen,this.push=e.push??this.push,this.disposeOnNavigation=e.disposeOnNavigation??this.disposeOnNavigation,this.usePopover=e.usePopover??this.usePopover,this.matchWidth=e.matchWidth??this.matchWidth}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`cdk-connected-overlay`,``],[``,`connected-overlay`,``],[``,`cdkConnectedOverlay`,``]],inputs:{origin:[0,`cdkConnectedOverlayOrigin`,`origin`],positions:[0,`cdkConnectedOverlayPositions`,`positions`],positionStrategy:[0,`cdkConnectedOverlayPositionStrategy`,`positionStrategy`],offsetX:[0,`cdkConnectedOverlayOffsetX`,`offsetX`],offsetY:[0,`cdkConnectedOverlayOffsetY`,`offsetY`],width:[0,`cdkConnectedOverlayWidth`,`width`],height:[0,`cdkConnectedOverlayHeight`,`height`],minWidth:[0,`cdkConnectedOverlayMinWidth`,`minWidth`],minHeight:[0,`cdkConnectedOverlayMinHeight`,`minHeight`],backdropClass:[0,`cdkConnectedOverlayBackdropClass`,`backdropClass`],panelClass:[0,`cdkConnectedOverlayPanelClass`,`panelClass`],viewportMargin:[0,`cdkConnectedOverlayViewportMargin`,`viewportMargin`],scrollStrategy:[0,`cdkConnectedOverlayScrollStrategy`,`scrollStrategy`],open:[0,`cdkConnectedOverlayOpen`,`open`],disableClose:[0,`cdkConnectedOverlayDisableClose`,`disableClose`],transformOriginSelector:[0,`cdkConnectedOverlayTransformOriginOn`,`transformOriginSelector`],hasBackdrop:[2,`cdkConnectedOverlayHasBackdrop`,`hasBackdrop`,te],lockPosition:[2,`cdkConnectedOverlayLockPosition`,`lockPosition`,te],flexibleDimensions:[2,`cdkConnectedOverlayFlexibleDimensions`,`flexibleDimensions`,te],growAfterOpen:[2,`cdkConnectedOverlayGrowAfterOpen`,`growAfterOpen`,te],push:[2,`cdkConnectedOverlayPush`,`push`,te],disposeOnNavigation:[2,`cdkConnectedOverlayDisposeOnNavigation`,`disposeOnNavigation`,te],usePopover:[0,`cdkConnectedOverlayUsePopover`,`usePopover`],matchWidth:[2,`cdkConnectedOverlayMatchWidth`,`matchWidth`,te],_config:[0,`cdkConnectedOverlay`,`_config`]},outputs:{backdropClick:`backdropClick`,positionChange:`positionChange`,attach:`attach`,detach:`detach`,overlayKeydown:`overlayKeydown`,overlayOutsideClick:`overlayOutsideClick`},exportAs:[`cdkConnectedOverlay`],features:[Be]})}return n})();var qr=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({providers:[AE],imports:[we,zr,tv,tv]})}return n})();var MF=[[[`mat-icon`],[``,`matMenuItemIcon`,``]],`*`];var TF=[`mat-icon, [matMenuItemIcon]`,`*`];function AF(n,t){n&1&&(Ei(),ue(0,`svg`,2),rt(1,`polygon`,3),ve())}var RF=[`*`];function kF(n,t){if(n&1){let e=Rp();ft(0,`div`,0),xd(`click`,function(){gr(e);return vr(Ke().closed.emit(`click`))})(`animationstart`,function(r){gr(e);return vr(Ke()._onAnimationStart(r.animationName))})(`animationend`,function(r){gr(e);return vr(Ke()._onAnimationDone(r.animationName))})(`animationcancel`,function(r){gr(e);return vr(Ke()._onAnimationDone(r.animationName))}),ft(1,`div`,1),ee(2),_t()()}if(n&2){let e=Ke();Jn(e._classList),J(`mat-menu-panel-animations-disabled`,e._animationsDisabled)(`mat-menu-panel-exit-animation`,e._panelAnimationState===`void`)(`mat-menu-panel-animating`,e._isAnimating()),dn(`id`,e.panelId),ie(`aria-label`,e.ariaLabel||null)(`aria-labelledby`,e.ariaLabelledby||null)(`aria-describedby`,e.ariaDescribedby||null)}}var dv=new g(`MAT_MENU_PANEL`);var lv=(()=>{class n{_elementRef=u(N);_document=u(M);_focusMonitor=u(ai);_parentMenu=u(dv,{optional:!0});_changeDetectorRef=u(Qe);role=`menuitem`;disabled=!1;disableRipple=!1;_hovered=new w;_focused=new w;_highlighted=!1;_triggersSubmenu=!1;constructor(){u(qe).load(os),this._parentMenu?.addItem?.(this)}focus(e,i){this._focusMonitor&&e?this._focusMonitor.focusVia(this._getHostElement(),e,i):this._getHostElement().focus(i),this._focused.next(this)}ngAfterViewInit(){this._focusMonitor&&this._focusMonitor.monitor(this._elementRef,!1)}ngOnDestroy(){this._focusMonitor&&this._focusMonitor.stopMonitoring(this._elementRef),this._parentMenu&&this._parentMenu.removeItem&&this._parentMenu.removeItem(this),this._hovered.complete(),this._focused.complete()}_getTabIndex(){return this.disabled?`-1`:`0`}_getHostElement(){return this._elementRef.nativeElement}_checkDisabled(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}_handleMouseEnter(){this._hovered.next(this)}getLabel(){let e=this._elementRef.nativeElement.cloneNode(!0),i=e.querySelectorAll(`mat-icon, .material-icons`);for(let r=0;r<i.length;r++)i[r].remove();return e.textContent?.trim()||``}_setHighlighted(e){this._highlighted=e,this._changeDetectorRef.markForCheck()}_setTriggersSubmenu(e){this._triggersSubmenu=e,this._changeDetectorRef.markForCheck()}_hasFocus(){return this._document&&this._document.activeElement===this._getHostElement()}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[``,`mat-menu-item`,``]],hostAttrs:[1,`mat-mdc-menu-item`,`mat-focus-indicator`],hostVars:8,hostBindings:function(i,r){i&1&&Fe(`click`,function(s){return r._checkDisabled(s)})(`mouseenter`,function(){return r._handleMouseEnter()}),i&2&&(ie(`role`,r.role)(`tabindex`,r._getTabIndex())(`aria-disabled`,r.disabled)(`disabled`,r.disabled||null),J(`mat-mdc-menu-item-highlighted`,r._highlighted)(`mat-mdc-menu-item-submenu-trigger`,r._triggersSubmenu))},inputs:{role:`role`,disabled:[2,`disabled`,`disabled`,te],disableRipple:[2,`disableRipple`,`disableRipple`,te]},exportAs:[`matMenuItem`],ngContentSelectors:TF,decls:5,vars:3,consts:[[1,`mat-mdc-menu-item-text`],[`matRipple`,``,1,`mat-mdc-menu-ripple`,3,`matRippleDisabled`,`matRippleTrigger`],[`viewBox`,`0 0 5 10`,`focusable`,`false`,`aria-hidden`,`true`,1,`mat-mdc-menu-submenu-icon`],[`points`,`0,0 5,5 0,10`]],template:function(i,r){i&1&&(Ge(MF),ee(0),ue(1,`span`,0),ee(2,1),ve(),rt(3,`div`,1),Me(4,AF,2,0,`:svg:svg`,2)),i&2&&(le(3),yt(`matRippleDisabled`,r.disableRipple||r.disabled)(`matRippleTrigger`,r._getHostElement()),le(),Te(r._triggersSubmenu?4:-1))},dependencies:[eE],encapsulation:2})}return n})();var kE=new g(`MatMenuContent`);var bte=(()=>{class n{_template=u(ut);_appRef=u(vt);_injector=u(T);_viewContainerRef=u(it);_document=u(M);_changeDetectorRef=u(Qe);_portal;_outlet;_attached=new w;attach(e={}){this._portal||(this._portal=new mn(this._template,this._viewContainerRef)),this.detach(),this._outlet||(this._outlet=new us(this._document.createElement(`div`),this._appRef,this._injector));let i=this._template.elementRef.nativeElement;i.parentNode.insertBefore(this._outlet.outletElement,i),this._changeDetectorRef.markForCheck(),this._portal.attach(this._outlet,e),this._attached.next()}detach(){this._portal?.isAttached&&this._portal.detach()}ngOnDestroy(){this.detach(),this._outlet?.dispose()}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`ng-template`,`matMenuContent`,``]],features:[Le([{provide:kE,useExisting:n}])]})}return n})();var OF=new g(`mat-menu-default-options`,{providedIn:`root`,factory:()=>({overlapTrigger:!1,xPosition:`after`,yPosition:`below`,backdropClass:`cdk-overlay-transparent-backdrop`})});var cv=`_mat-menu-enter`;var Zu=`_mat-menu-exit`;var Ku=(()=>{class n{_elementRef=u(N);_changeDetectorRef=u(Qe);_injector=u(T);_keyManager;_xPosition;_yPosition;_firstItemFocusRef;_exitFallbackTimeout;_animationsDisabled=Je();_allItems;_directDescendantItems=new Zn;_classList={};_panelAnimationState=`void`;_animationDone=new w;_isAnimating=C(!1);parentMenu;direction;overlayPanelClass;backdropClass;ariaLabel;ariaLabelledby;ariaDescribedby;get xPosition(){return this._xPosition}set xPosition(e){this._xPosition=e,this.setPositionClasses()}get yPosition(){return this._yPosition}set yPosition(e){this._yPosition=e,this.setPositionClasses()}templateRef;items;lazyContent;overlapTrigger=!1;hasBackdrop;get panelClass(){return this._previousPanelClass}set panelClass(e){let i=this._previousPanelClass,r=p({},this._classList);i&&i.length&&i.split(` `).forEach(o=>{r[o]=!1}),this._previousPanelClass=e,e&&e.length&&(e.split(` `).forEach(o=>{r[o]=!0}),this._elementRef.nativeElement.className=``),this._classList=r}_previousPanelClass=``;get classList(){return this.panelClass}set classList(e){this.panelClass=e}closed=new z;close=this.closed;panelId=u(ot).getId(`mat-menu-panel-`);constructor(){let e=u(OF);this.overlayPanelClass=e.overlayPanelClass||``,this._xPosition=e.xPosition,this._yPosition=e.yPosition,this.backdropClass=e.backdropClass,this.overlapTrigger=e.overlapTrigger,this.hasBackdrop=e.hasBackdrop}ngOnInit(){this.setPositionClasses()}ngAfterContentInit(){this._updateDirectDescendants(),this._keyManager=new ac(this._directDescendantItems).withWrap().withTypeAhead().withHomeAndEnd(),this._keyManager.tabOut.subscribe(()=>this.closed.emit(`tab`)),this._directDescendantItems.changes.pipe(st(this._directDescendantItems),et(e=>Xt(...e.map(i=>i._focused)))).subscribe(e=>this._keyManager.updateActiveItem(e)),this._directDescendantItems.changes.subscribe(e=>{let i=this._keyManager;if(this._panelAnimationState===`enter`&&i.activeItem?._hasFocus()){let r=e.toArray(),o=Math.max(0,Math.min(r.length-1,i.activeItemIndex||0));r[o]&&!r[o].disabled?i.setActiveItem(o):i.setNextItemActive()}})}ngOnDestroy(){this._keyManager?.destroy(),this._directDescendantItems.destroy(),this.closed.complete(),this._firstItemFocusRef?.destroy(),clearTimeout(this._exitFallbackTimeout)}_hovered(){return this._directDescendantItems.changes.pipe(st(this._directDescendantItems),et(i=>Xt(...i.map(r=>r._hovered))))}addItem(e){}removeItem(e){}_handleKeydown(e){let i=e.keyCode,r=this._keyManager;switch(i){case 27:Pn(e)||(e.preventDefault(),this.closed.emit(`keydown`));break;case 37:this.parentMenu&&this.direction===`ltr`&&this.closed.emit(`keydown`);break;case 39:this.parentMenu&&this.direction===`rtl`&&this.closed.emit(`keydown`);break;default:(i===38||i===40)&&r.setFocusOrigin(`keyboard`),r.onKeydown(e);return}}focusFirstItem(e=`program`){this._firstItemFocusRef?.destroy(),this._firstItemFocusRef=xt(()=>{let i=this._resolvePanel();if(!i||!i.contains(document.activeElement)){let r=this._keyManager;r.setFocusOrigin(e).setFirstItemActive(),!r.activeItem&&i&&i.focus()}},{injector:this._injector})}resetActiveItem(){this._keyManager.setActiveItem(-1)}setElevation(e){}setPositionClasses(e=this.xPosition,i=this.yPosition){this._classList=S(p({},this._classList),{"mat-menu-before":e===`before`,"mat-menu-after":e===`after`,"mat-menu-above":i===`above`,"mat-menu-below":i===`below`}),this._changeDetectorRef.markForCheck()}_onAnimationDone(e){let i=e===Zu;(i||e===cv)&&(i&&(clearTimeout(this._exitFallbackTimeout),this._exitFallbackTimeout=void 0),this._animationDone.next(i?`void`:`enter`),this._isAnimating.set(!1))}_onAnimationStart(e){(e===cv||e===Zu)&&this._isAnimating.set(!0)}_setIsOpen(e){if(this._panelAnimationState=e?`enter`:`void`,e){if(this._keyManager.activeItemIndex===0){let i=this._resolvePanel();i&&(i.scrollTop=0)}}else this._animationsDisabled||(this._exitFallbackTimeout=setTimeout(()=>this._onAnimationDone(Zu),200));this._animationsDisabled&&setTimeout(()=>{this._onAnimationDone(e?cv:Zu)}),this._changeDetectorRef.markForCheck()}_updateDirectDescendants(){this._allItems.changes.pipe(st(this._allItems)).subscribe(e=>{this._directDescendantItems.reset(e.filter(i=>i._parentMenu===this)),this._directDescendantItems.notifyOnChanges()})}_resolvePanel(){let e=null;return this._directDescendantItems.length&&(e=this._directDescendantItems.first._getHostElement().closest(`[role="menu"]`)),e}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`mat-menu`]],contentQueries:function(i,r,o){if(i&1&&un(o,kE,5)(o,lv,5)(o,lv,4),i&2){let s;oe(s=se())&&(r.lazyContent=s.first),oe(s=se())&&(r._allItems=s),oe(s=se())&&(r.items=s)}},viewQuery:function(i,r){if(i&1&&Nt(ut,5),i&2){let o;oe(o=se())&&(r.templateRef=o.first)}},hostVars:3,hostBindings:function(i,r){i&2&&ie(`aria-label`,null)(`aria-labelledby`,null)(`aria-describedby`,null)},inputs:{backdropClass:`backdropClass`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],xPosition:`xPosition`,yPosition:`yPosition`,overlapTrigger:[2,`overlapTrigger`,`overlapTrigger`,te],hasBackdrop:[2,`hasBackdrop`,`hasBackdrop`,e=>e==null?null:te(e)],panelClass:[0,`class`,`panelClass`],classList:`classList`},outputs:{closed:`closed`,close:`close`},exportAs:[`matMenu`],features:[Le([{provide:dv,useExisting:n}])],ngContentSelectors:RF,decls:1,vars:0,consts:[[`tabindex`,`-1`,`role`,`menu`,1,`mat-mdc-menu-panel`,3,`click`,`animationstart`,`animationend`,`animationcancel`,`id`],[1,`mat-mdc-menu-content`]],template:function(i,r){i&1&&(Ge(),Dd(0,kF,3,12,`ng-template`))},styles:[`mat-menu {
  display: none;
}

.mat-mdc-menu-content {
  margin: 0;
  padding: 8px 0;
  outline: 0;
}
.mat-mdc-menu-content,
.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  flex: 1;
  white-space: normal;
  font-family: var(--%NS%mat-menu-item-label-text-font, var(--%NS%mat-sys-label-large-font));
  line-height: var(--%NS%mat-menu-item-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-size: var(--%NS%mat-menu-item-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-menu-item-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  font-weight: var(--%NS%mat-menu-item-label-text-weight, var(--%NS%mat-sys-label-large-weight));
}

@keyframes _mat-menu-enter {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-menu-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-menu-panel {
  min-width: 112px;
  max-width: 280px;
  overflow: auto;
  box-sizing: border-box;
  outline: 0;
  animation: _mat-menu-enter 120ms cubic-bezier(0, 0, 0.2, 1);
  border-radius: var(--%NS%mat-menu-container-shape, var(--%NS%mat-sys-corner-extra-small));
  background-color: var(--%NS%mat-menu-container-color, var(--%NS%mat-sys-surface-container));
  box-shadow: var(--%NS%mat-menu-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  will-change: transform, opacity;
}
.mat-mdc-menu-panel.mat-menu-panel-exit-animation {
  animation: _mat-menu-exit 100ms 25ms linear forwards;
}
.mat-mdc-menu-panel.mat-menu-panel-animations-disabled {
  animation: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating {
  pointer-events: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating:has(.mat-mdc-menu-content:empty) {
  display: none;
}
@media (forced-colors: active) {
  .mat-mdc-menu-panel {
    outline: solid 1px;
  }
}
.mat-mdc-menu-panel .mat-divider {
  border-top-color: var(--%NS%mat-menu-divider-color, var(--%NS%mat-sys-surface-variant));
  margin-bottom: var(--%NS%mat-menu-divider-bottom-spacing, 8px);
  margin-top: var(--%NS%mat-menu-divider-top-spacing, 8px);
}

.mat-mdc-menu-item {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
  box-sizing: border-box;
  color: inherit;
  font-size: inherit;
  background: none;
  text-decoration: none;
  margin: 0;
  min-height: 48px;
  padding-left: var(--%NS%mat-menu-item-leading-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-trailing-spacing, 12px);
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  outline: none;
  border: none;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-menu-item::-moz-focus-inner {
  border: 0;
}
[dir=rtl] .mat-mdc-menu-item {
  padding-left: var(--%NS%mat-menu-item-trailing-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-leading-spacing, 12px);
}
.mat-mdc-menu-item:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding-left: var(--%NS%mat-menu-item-with-icon-leading-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-with-icon-trailing-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-item:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding-left: var(--%NS%mat-menu-item-with-icon-trailing-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-with-icon-leading-spacing, 12px);
}
.mat-mdc-menu-item, .mat-mdc-menu-item:visited, .mat-mdc-menu-item:link {
  color: var(--%NS%mat-menu-item-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-menu-item .mat-icon-no-color,
.mat-mdc-menu-item .mat-mdc-menu-submenu-icon {
  color: var(--%NS%mat-menu-item-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-menu-item[disabled] {
  cursor: default;
  opacity: 0.38;
}
.mat-mdc-menu-item[disabled]::after {
  display: block;
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.mat-mdc-menu-item:focus {
  outline: 0;
}
.mat-mdc-menu-item .mat-icon {
  flex-shrink: 0;
  margin-right: var(--%NS%mat-menu-item-spacing, 12px);
  height: var(--%NS%mat-menu-item-icon-size, 24px);
  width: var(--%NS%mat-menu-item-icon-size, 24px);
}
[dir=rtl] .mat-mdc-menu-item {
  text-align: right;
}
[dir=rtl] .mat-mdc-menu-item .mat-icon {
  margin-right: 0;
  margin-left: var(--%NS%mat-menu-item-spacing, 12px);
}
.mat-mdc-menu-item:not([disabled]):hover {
  background-color: var(--%NS%mat-menu-item-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-menu-item:not([disabled]).cdk-program-focused, .mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused, .mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted {
  background-color: var(--%NS%mat-menu-item-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));
}
@media (forced-colors: active) {
  .mat-mdc-menu-item {
    margin-top: 1px;
  }
}

.mat-mdc-menu-submenu-icon {
  width: var(--%NS%mat-menu-item-icon-size, 24px);
  height: 10px;
  fill: currentColor;
  padding-left: var(--%NS%mat-menu-item-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-submenu-icon {
  padding-right: var(--%NS%mat-menu-item-spacing, 12px);
  padding-left: 0;
}
[dir=rtl] .mat-mdc-menu-submenu-icon polygon {
  transform: scaleX(-1);
  transform-origin: center;
}
@media (forced-colors: active) {
  .mat-mdc-menu-submenu-icon {
    fill: CanvasText;
  }
}

.mat-mdc-menu-item .mat-mdc-menu-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
`],encapsulation:2})}return n})();var PF=new g(`mat-menu-scroll-strategy`,{providedIn:`root`,factory:()=>{let n=u(T);return()=>pc(n)}});var gs=new WeakMap;var FF=(()=>{class n{_canHaveBackdrop;_element=u(N);_viewContainerRef=u(it);_menuItemInstance=u(lv,{optional:!0,self:!0});_dir=u(jt,{optional:!0});_focusMonitor=u(ai);_ngZone=u(I);_injector=u(T);_scrollStrategy=u(PF);_changeDetectorRef=u(Qe);_animationsDisabled=Je();_portal;_overlayRef=null;_menuOpen=!1;_closingActionsSubscription=Q.EMPTY;_menuCloseSubscription=Q.EMPTY;_pendingRemoval;_parentMaterialMenu;_parentInnerPadding;_openedBy=void 0;get _menu(){return this._menuInternal}set _menu(e){e!==this._menuInternal&&(this._menuInternal=e,this._menuCloseSubscription.unsubscribe(),e?(this._parentMaterialMenu,this._menuCloseSubscription=e.close.subscribe(i=>{this._destroyMenu(i),(i===`click`||i===`tab`)&&this._parentMaterialMenu&&this._parentMaterialMenu.closed.emit(i)})):this._destroyMenu(),this._menuItemInstance?._setTriggersSubmenu(this._triggersSubmenu()))}_menuInternal=null;constructor(e){this._canHaveBackdrop=e;let i=u(dv,{optional:!0});this._parentMaterialMenu=i instanceof Ku?i:void 0}ngOnDestroy(){this._menu&&this._ownsMenu(this._menu)&&gs.delete(this._menu),this._pendingRemoval?.unsubscribe(),this._menuCloseSubscription.unsubscribe(),this._closingActionsSubscription.unsubscribe(),this._overlayRef&&(this._overlayRef.dispose(),this._overlayRef=null)}get menuOpen(){return this._menuOpen}get dir(){return this._dir&&this._dir.value===`rtl`?`rtl`:`ltr`}_triggersSubmenu(){return!!(this._menuItemInstance&&this._parentMaterialMenu&&this._menu)}_closeMenu(){this._menu?.close.emit()}_openMenu(e){if(this._triggerIsAriaDisabled())return;let i=this._menu;if(this._menuOpen||!i)return;this._pendingRemoval?.unsubscribe();let r=gs.get(i);gs.set(i,this),r&&r!==this&&r._closeMenu();let o=this._createOverlay(i),s=o.getConfig(),a=s.positionStrategy;this._setPosition(i,a),this._canHaveBackdrop?s.hasBackdrop=i.hasBackdrop==null?!this._triggersSubmenu():i.hasBackdrop:s.hasBackdrop=i.hasBackdrop??!1,o.hasAttached()||(o.attach(this._getPortal(i)),i.lazyContent?.attach(this.menuData)),this._closingActionsSubscription=this._menuClosingActions().subscribe(()=>this._closeMenu()),i.parentMenu=this._triggersSubmenu()?this._parentMaterialMenu:void 0,i.direction=this.dir,e&&i.focusFirstItem(this._openedBy||`program`),this._setIsMenuOpen(!0),i instanceof Ku&&(i._setIsOpen(!0),i._directDescendantItems.changes.pipe(at(i.close)).subscribe(()=>{a.withLockedPosition(!1).reapplyLastPosition(),a.withLockedPosition(!0)}))}focus(e,i){this._focusMonitor&&e?this._focusMonitor.focusVia(this._element,e,i):this._element.nativeElement.focus(i)}_destroyMenu(e){let i=this._overlayRef,r=this._menu;!i||!this.menuOpen||(this._closingActionsSubscription.unsubscribe(),this._pendingRemoval?.unsubscribe(),r instanceof Ku&&this._ownsMenu(r)?(this._pendingRemoval=r._animationDone.pipe(xe(1)).subscribe(()=>{i.detach(),gs.has(r)||r.lazyContent?.detach()}),r._setIsOpen(!1)):(i.detach(),r?.lazyContent?.detach()),r&&this._ownsMenu(r)&&gs.delete(r),this.restoreFocus&&(e===`keydown`||!this._openedBy||!this._triggersSubmenu())&&this.focus(this._openedBy),this._openedBy=void 0,this._setIsMenuOpen(!1))}_setIsMenuOpen(e){e!==this._menuOpen&&(this._menuOpen=e,this._menuOpen?this.menuOpened.emit():this.menuClosed.emit(),this._triggersSubmenu()&&this._menuItemInstance._setHighlighted(e),this._changeDetectorRef.markForCheck())}_createOverlay(e){if(!this._overlayRef){let i=this._getOverlayConfig(e);this._subscribeToPositions(e,i.positionStrategy),this._overlayRef=Gr(this._injector,i),this._overlayRef.keydownEvents().subscribe(r=>{this._menu instanceof Ku&&this._menu._handleKeydown(r)})}return this._overlayRef}_getOverlayConfig(e){return new li({positionStrategy:gc(this._injector,this._getOverlayOrigin()).withLockedPosition().withGrowAfterOpen().withTransformOriginOn(`.mat-menu-panel, .mat-mdc-menu-panel`),backdropClass:e.backdropClass||`cdk-overlay-transparent-backdrop`,panelClass:e.overlayPanelClass,scrollStrategy:this._scrollStrategy(),direction:this._dir||`ltr`,disableAnimations:this._animationsDisabled})}_subscribeToPositions(e,i){e.setPositionClasses&&i.positionChanges.subscribe(r=>{this._ngZone.run(()=>{let o=r.connectionPair.overlayX===`start`?`after`:`before`,s=r.connectionPair.overlayY===`top`?`below`:`above`;e.setPositionClasses(o,s)})})}_setPosition(e,i){let[r,o]=e.xPosition===`before`?[`end`,`start`]:[`start`,`end`],[s,a]=e.yPosition===`above`?[`bottom`,`top`]:[`top`,`bottom`],[c,l]=[s,a],[d,f]=[r,o],h=0;if(this._triggersSubmenu()){if(f=r=e.xPosition===`before`?`start`:`end`,o=d=r===`end`?`start`:`end`,this._parentMaterialMenu){if(this._parentInnerPadding==null){let m=this._parentMaterialMenu.items.first;this._parentInnerPadding=m?m._getHostElement().offsetTop:0}h=s===`bottom`?this._parentInnerPadding:-this._parentInnerPadding}}else e.overlapTrigger||(c=s===`top`?`bottom`:`top`,l=a===`top`?`bottom`:`top`);i.withPositions([{originX:r,originY:c,overlayX:d,overlayY:s,offsetY:h},{originX:o,originY:c,overlayX:f,overlayY:s,offsetY:h},{originX:r,originY:l,overlayX:d,overlayY:a,offsetY:-h},{originX:o,originY:l,overlayX:f,overlayY:a,offsetY:-h}])}_menuClosingActions(){let e=this._getOutsideClickStream(this._overlayRef),i=this._overlayRef.detachments();return Xt(e,this._parentMaterialMenu?this._parentMaterialMenu.closed:F(),this._parentMaterialMenu?this._parentMaterialMenu._hovered().pipe(re(s=>this._menuOpen&&s!==this._menuItemInstance)):F(),i)}_getPortal(e){return(!this._portal||this._portal.templateRef!==e.templateRef)&&(this._portal=new mn(e.templateRef,this._viewContainerRef)),this._portal}_ownsMenu(e){return gs.get(e)===this}_triggerIsAriaDisabled(){return te(this._element.nativeElement.getAttribute(`aria-disabled`))}static ɵfac=function(i){Ia()};static ɵdir=D({type:n})}return n})();var Ste=(()=>{class n extends FF{_cleanupTouchstart;_hoverSubscription=Q.EMPTY;get _deprecatedMatMenuTriggerFor(){return this.menu}set _deprecatedMatMenuTriggerFor(e){this.menu=e}get menu(){return this._menu}set menu(e){this._menu=e}menuData;restoreFocus=!0;menuOpened=new z;onMenuOpen=this.menuOpened;menuClosed=new z;onMenuClose=this.menuClosed;constructor(){super(!0);let e=u(ge);this._cleanupTouchstart=e.listen(this._element.nativeElement,`touchstart`,i=>{Lr(i)||(this._openedBy=`touch`)},{passive:!0})}triggersSubmenu(){return super._triggersSubmenu()}toggleMenu(){return this.menuOpen?this.closeMenu():this.openMenu()}openMenu(){this._openMenu(!0)}closeMenu(){this._closeMenu()}updatePosition(){this._overlayRef?.updatePosition()}ngAfterContentInit(){this._handleHover()}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTouchstart(),this._hoverSubscription.unsubscribe()}_getOverlayOrigin(){return this._element}_getOutsideClickStream(e){return e.backdropClick()}_handleMousedown(e){Fr(e)||(this._openedBy=e.button===0?`mouse`:void 0,this.triggersSubmenu()&&e.preventDefault())}_handleKeydown(e){let i=e.keyCode;(i===13||i===32)&&(this._openedBy=`keyboard`),this.triggersSubmenu()&&(i===39&&this.dir===`ltr`||i===37&&this.dir===`rtl`)&&(this._openedBy=`keyboard`,this.openMenu())}_handleClick(e){this.triggersSubmenu()?(e.stopPropagation(),this.openMenu()):this.toggleMenu()}_handleHover(){this.triggersSubmenu()&&this._parentMaterialMenu&&(this._hoverSubscription=this._parentMaterialMenu._hovered().subscribe(e=>{e===this._menuItemInstance&&!e.disabled&&this._parentMaterialMenu?._panelAnimationState!==`void`&&(this._openedBy=`mouse`,this._openMenu(!1))}))}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`mat-menu-trigger-for`,``],[``,`matMenuTriggerFor`,``]],hostAttrs:[1,`mat-mdc-menu-trigger`],hostVars:3,hostBindings:function(i,r){i&1&&Fe(`click`,function(s){return r._handleClick(s)})(`mousedown`,function(s){return r._handleMousedown(s)})(`keydown`,function(s){return r._handleKeydown(s)}),i&2&&ie(`aria-haspopup`,r.menu?`menu`:null)(`aria-expanded`,r.menuOpen)(`aria-controls`,r.menuOpen?r.menu?.panelId:null)},inputs:{_deprecatedMatMenuTriggerFor:[0,`mat-menu-trigger-for`,`_deprecatedMatMenuTriggerFor`],menu:[0,`matMenuTriggerFor`,`menu`],menuData:[0,`matMenuTriggerData`,`menuData`],restoreFocus:[0,`matMenuTriggerRestoreFocus`,`restoreFocus`]},outputs:{menuOpened:`menuOpened`,onMenuOpen:`onMenuOpen`,menuClosed:`menuClosed`,onMenuClose:`onMenuClose`},exportAs:[`matMenuTrigger`],features:[ae]})}return n})();var wte=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[ss,qr,we,fc]})}return n})();function LF(n,t){}var Fi=class{viewContainerRef;injector;id;role=`dialog`;panelClass=``;hasBackdrop=!0;backdropClass=``;disableClose=!1;closePredicate;width=``;height=``;minWidth;minHeight;maxWidth;maxHeight;positionStrategy;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus=`first-tabbable`;restoreFocus=!0;scrollStrategy;closeOnNavigation=!0;closeOnDestroy=!0;closeOnOverlayDetachments=!0;disableAnimations=!1;providers;container;templateContext;bindings};var fv=(()=>{class n extends ds{_elementRef=u(N);_focusTrapFactory=u(Lg);_config;_interactivityChecker=u(Mu);_ngZone=u(I);_focusMonitor=u(ai);_renderer=u(ge);_changeDetectorRef=u(Qe);_injector=u(T);_platform=u(fe);_document=u(M);_portalOutlet;_focusTrapped=new w;_focusTrap=null;_elementFocusedBeforeDialogWasOpened=null;_closeInteractionType=null;_ariaLabelledByQueue=[];_isDestroyed=!1;constructor(){super(),this._config=u(Fi,{optional:!0})||new Fi,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(e){this._ariaLabelledByQueue.push(e),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(e){let i=this._ariaLabelledByQueue.indexOf(e);i>-1&&(this._ariaLabelledByQueue.splice(i,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._focusTrapped.complete(),this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(e){this._portalOutlet.hasAttached();let i=this._portalOutlet.attachComponentPortal(e);return this._contentAttached(),i}attachTemplatePortal(e){this._portalOutlet.hasAttached();let i=this._portalOutlet.attachTemplatePortal(e);return this._contentAttached(),i}attachDomPortal=e=>{this._portalOutlet.hasAttached();let i=this._portalOutlet.attachDomPortal(e);return this._contentAttached(),i};_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(e,i){this._interactivityChecker.isFocusable(e)||(e.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let r=()=>{o(),s(),e.removeAttribute(`tabindex`)},o=this._renderer.listen(e,`blur`,r),s=this._renderer.listen(e,`mousedown`,r)})),e.focus(i)}_focusByCssSelector(e,i){let r=this._elementRef.nativeElement.querySelector(e);r&&this._forceFocus(r,i)}_trapFocus(e){this._isDestroyed||xt(()=>{let i=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case`dialog`:this._containsFocus()||i.focus(e);break;case!0:case`first-tabbable`:this._focusTrap?.focusInitialElement(e)||this._focusDialogContainer(e);break;case`first-heading`:this._focusByCssSelector(`h1, h2, h3, h4, h5, h6, [role="heading"]`,e);break;default:this._focusByCssSelector(this._config.autoFocus,e);break}this._focusTrapped.next()},{injector:this._injector})}_restoreFocus(){let e=this._config.restoreFocus,i=null;if(typeof e==`string`?i=this._document.querySelector(e):typeof e==`boolean`?i=e?this._elementFocusedBeforeDialogWasOpened:null:e&&(i=e),this._config.restoreFocus&&i&&typeof i.focus==`function`){let r=Jo(),o=this._elementRef.nativeElement;(!r||r===this._document.body||r===o||o.contains(r))&&(this._focusMonitor?(this._focusMonitor.focusVia(i,this._closeInteractionType),this._closeInteractionType=null):i.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(e){this._elementRef.nativeElement.focus?.(e)}_containsFocus(){let e=this._elementRef.nativeElement,i=Jo();return e===i||e.contains(i)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=Jo()))}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`cdk-dialog-container`]],viewQuery:function(i,r){if(i&1&&Nt(uc,7),i&2){let o;oe(o=se())&&(r._portalOutlet=o.first)}},hostAttrs:[`tabindex`,`-1`,1,`cdk-dialog-container`],hostVars:6,hostBindings:function(i,r){i&2&&ie(`id`,r._config.id||null)(`role`,r._config.role)(`aria-modal`,r._config.ariaModal)(`aria-labelledby`,r._config.ariaLabel?null:r._ariaLabelledByQueue[0])(`aria-label`,r._config.ariaLabel)(`aria-describedby`,r._config.ariaDescribedBy||null)},features:[ae],decls:1,vars:0,consts:[[`cdkPortalOutlet`,``]],template:function(i,r){i&1&&Ot(0,LF,0,0,`ng-template`,0)},dependencies:[uc],styles:[`.cdk-dialog-container {
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
`],encapsulation:2,changeDetection:1})}return n})();var Yr=class{overlayRef;config;componentInstance=null;componentRef=null;containerInstance;disableClose;closed=new w;backdropClick;keydownEvents;outsidePointerEvents;id;_detachSubscription;constructor(t,e){this.overlayRef=t,this.config=e,this.disableClose=e.disableClose,this.backdropClick=t.backdropClick(),this.keydownEvents=t.keydownEvents(),this.outsidePointerEvents=t.outsidePointerEvents(),this.id=e.id,this.keydownEvents.subscribe(i=>{i.keyCode===27&&!this.disableClose&&!Pn(i)&&(i.preventDefault(),this.close(void 0,{focusOrigin:`keyboard`}))}),this.backdropClick.subscribe(()=>{!this.disableClose&&this._canClose()?this.close(void 0,{focusOrigin:`mouse`}):this.containerInstance._recaptureFocus?.()}),this._detachSubscription=t.detachments().subscribe(()=>{e.closeOnOverlayDetachments!==!1&&this.close()})}close(t,e){if(this._canClose(t)){let i=this.closed;this.containerInstance._closeInteractionType=e?.focusOrigin||`program`,this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),i.next(t),i.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(t=``,e=``){return this.overlayRef.updateSize({width:t,height:e}),this}addPanelClass(t){return this.overlayRef.addPanelClass(t),this}removePanelClass(t){return this.overlayRef.removePanelClass(t),this}_canClose(t){let e=this.config;return!!this.containerInstance&&(!e.closePredicate||e.closePredicate(t,e,this.componentInstance))}};var jF=new g(`DialogScrollStrategy`,{providedIn:`root`,factory:()=>{let n=u(T);return()=>ms(n)}});var VF=new g(`DialogData`);var BF=new g(`DefaultDialogConfig`);function UF(n){let t=C(n),e=new z;return{valueSignal:t,get value(){return t()},change:e,ngOnDestroy(){e.complete()}}}var hv=(()=>{class n{_injector=u(T);_defaultOptions=u(BF,{optional:!0});_parentDialog=u(n,{optional:!0,skipSelf:!0});_overlayContainer=u(Yu);_idGenerator=u(ot);_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new w;_afterOpenedAtThisLevel=new w;_ariaHiddenElements=new Map;_scrollStrategy=u(jF);get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}afterAllClosed=jn(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(st(void 0)));open(e,i){i=p(p({},this._defaultOptions||new Fi),i),i.id=i.id||this._idGenerator.getId(`cdk-dialog-`),i.id&&this.getDialogById(i.id);let o=this._getOverlayConfig(i),s=Gr(this._injector,o),a=new Yr(s,i),c=this._attachContainer(s,a,i);if(a.containerInstance=c,!this.openDialogs.length){let l=this._overlayContainer.getContainerElement();c._focusTrapped?c._focusTrapped.pipe(xe(1)).subscribe(()=>{this._hideNonDialogContentFromAssistiveTechnology(l)}):this._hideNonDialogContentFromAssistiveTechnology(l)}return this._attachDialogContent(e,a,c,i),this.openDialogs.push(a),a.closed.subscribe(()=>this._removeOpenDialog(a,!0)),this.afterOpened.next(a),a}closeAll(){uv(this.openDialogs,e=>e.close())}getDialogById(e){return this.openDialogs.find(i=>i.id===e)}ngOnDestroy(){uv(this._openDialogsAtThisLevel,e=>{e.config.closeOnDestroy===!1&&this._removeOpenDialog(e,!1)}),uv(this._openDialogsAtThisLevel,e=>e.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(e){let i=new li({positionStrategy:e.positionStrategy||ps().centerHorizontally().centerVertically(),scrollStrategy:e.scrollStrategy||this._scrollStrategy(),panelClass:e.panelClass,hasBackdrop:e.hasBackdrop,direction:e.direction,minWidth:e.minWidth,minHeight:e.minHeight,maxWidth:e.maxWidth,maxHeight:e.maxHeight,width:e.width,height:e.height,disposeOnNavigation:e.closeOnNavigation,disableAnimations:e.disableAnimations});return e.backdropClass&&(i.backdropClass=e.backdropClass),i}_attachContainer(e,i,r){let o=r.injector||r.viewContainerRef?.injector,s=[{provide:Fi,useValue:r},{provide:Yr,useValue:i},{provide:hs,useValue:e}],a;r.container?typeof r.container==`function`?a=r.container:(a=r.container.type,s.push(...r.container.providers(r))):a=fv;let c=new ls(a,r.viewContainerRef,T.create({parent:o||this._injector,providers:s}));return e.attach(c).instance}_attachDialogContent(e,i,r,o){if(e instanceof ut){let s=this._createInjector(o,i,r,void 0),a={$implicit:o.data,dialogRef:i};o.templateContext&&(a=p(p({},a),typeof o.templateContext==`function`?o.templateContext():o.templateContext)),r.attachTemplatePortal(new mn(e,null,a,s))}else{let s=this._createInjector(o,i,r,this._injector),a=r.attachComponentPortal(new ls(e,o.viewContainerRef,s,null,o.bindings));i.componentRef=a,i.componentInstance=a.instance}}_createInjector(e,i,r,o){let s=e.injector||e.viewContainerRef?.injector,a=[{provide:VF,useValue:e.data},{provide:Yr,useValue:i}];return e.providers&&(typeof e.providers==`function`?a.push(...e.providers(i,e,r)):a.push(...e.providers)),e.direction&&(!s||!s.get(jt,null,{optional:!0}))&&a.push({provide:jt,useValue:UF(e.direction)}),T.create({parent:s||o,providers:a})}_removeOpenDialog(e,i){let r=this.openDialogs.indexOf(e);r>-1&&(this.openDialogs.splice(r,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((o,s)=>{o?s.setAttribute(`aria-hidden`,o):s.removeAttribute(`aria-hidden`)}),this._ariaHiddenElements.clear(),i&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(e){if(e.parentElement){let i=e.parentElement.children;for(let r=i.length-1;r>-1;r--){let o=i[r];o!==e&&o.nodeName!==`SCRIPT`&&o.nodeName!==`STYLE`&&!o.hasAttribute(`aria-live`)&&!o.hasAttribute(`popover`)&&(this._ariaHiddenElements.set(o,o.getAttribute(`aria-hidden`)),o.setAttribute(`aria-hidden`,`true`))}}}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();function uv(n,t){let e=n.length;for(;e--;)t(n[e])}var OE=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({providers:[hv],imports:[qr,zr,jg,zr]})}return n})();function HF(n,t){}var Xu=class{viewContainerRef;injector;id;role=`dialog`;panelClass=``;hasBackdrop=!0;backdropClass=``;disableClose=!1;closePredicate;width=``;height=``;minWidth;minHeight;maxWidth;maxHeight;position;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus=`first-tabbable`;restoreFocus=!0;delayFocusTrap=!0;scrollStrategy;closeOnNavigation=!0;enterAnimationDuration;exitAnimationDuration;bindings};var mv=`mdc-dialog--open`;var PE=`mdc-dialog--opening`;var FE=`mdc-dialog--closing`;var zF=150;var $F=75;var WF=(()=>{class n extends fv{_animationStateChanged=new z;_animationsEnabled=!Je();_actionSectionCount=0;_hostElement=this._elementRef.nativeElement;_enterAnimationDuration=this._animationsEnabled?jE(this._config.enterAnimationDuration)??zF:0;_exitAnimationDuration=this._animationsEnabled?jE(this._config.exitAnimationDuration)??$F:0;_animationTimer=null;_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:`opening`,totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(LE,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(PE,mv)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add(mv),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:`closing`,totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove(mv),this._animationsEnabled?(this._hostElement.style.setProperty(LE,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(FE)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(e){this._actionSectionCount+=e,this._changeDetectorRef.markForCheck()}_finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)};_finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:`closed`,totalTime:this._exitAnimationDuration})};_clearAnimationClasses(){this._hostElement.classList.remove(PE,FE)}_waitForAnimationToComplete(e,i){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(i,e)}_requestAnimationFrame(e){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame==`function`?requestAnimationFrame(e):e()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(e){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:`opened`,totalTime:e})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(e){let i=super.attachComponentPortal(e);return i.location.nativeElement.classList.add(`mat-mdc-dialog-component-host`),i}static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵcmp=X({type:n,selectors:[[`mat-dialog-container`]],hostAttrs:[`tabindex`,`-1`,1,`mat-mdc-dialog-container`,`mdc-dialog`],hostVars:10,hostBindings:function(i,r){i&2&&(dn(`id`,r._config.id),ie(`aria-modal`,r._config.ariaModal)(`role`,r._config.role)(`aria-labelledby`,r._config.ariaLabel?null:r._ariaLabelledByQueue[0])(`aria-label`,r._config.ariaLabel)(`aria-describedby`,r._config.ariaDescribedBy||null),J(`_mat-animation-noopable`,!r._animationsEnabled)(`mat-mdc-dialog-container-with-actions`,r._actionSectionCount>0))},features:[ae],decls:3,vars:0,consts:[[1,`mat-mdc-dialog-inner-container`,`mdc-dialog__container`],[1,`mat-mdc-dialog-surface`,`mdc-dialog__surface`],[`cdkPortalOutlet`,``]],template:function(i,r){i&1&&(ue(0,`div`,0)(1,`div`,1),Ot(2,HF,0,0,`ng-template`,2),ve()())},dependencies:[uc],styles:[`.mat-mdc-dialog-container {
  width: 100%;
  height: 100%;
  display: block;
  box-sizing: border-box;
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  outline: 0;
}

.cdk-overlay-pane.mat-mdc-dialog-panel {
  max-width: var(--%NS%mat-dialog-container-max-width, 560px);
  min-width: var(--%NS%mat-dialog-container-min-width, 280px);
}
@media (max-width: 599px) {
  .cdk-overlay-pane.mat-mdc-dialog-panel {
    max-width: var(--%NS%mat-dialog-container-small-max-width, calc(100vw - 32px));
  }
}

.mat-mdc-dialog-inner-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  height: 100%;
  opacity: 0;
  transition: opacity linear var(--%NS%mat-dialog-transition-duration, 0ms);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
}
.mdc-dialog--closing .mat-mdc-dialog-inner-container {
  transition: opacity 75ms linear;
  transform: none;
}
.mdc-dialog--open .mat-mdc-dialog-inner-container {
  opacity: 1;
}
._mat-animation-noopable .mat-mdc-dialog-inner-container {
  transition: none;
}

.mat-mdc-dialog-surface {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  outline: 0;
  transform: scale(0.8);
  transition: transform var(--%NS%mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  box-shadow: var(--%NS%mat-dialog-container-elevation-shadow, none);
  border-radius: var(--%NS%mat-dialog-container-shape, var(--%NS%mat-sys-corner-extra-large, 4px));
  background-color: var(--%NS%mat-dialog-container-color, var(--%NS%mat-sys-surface, white));
}
[dir=rtl] .mat-mdc-dialog-surface {
  text-align: right;
}
.mdc-dialog--open .mat-mdc-dialog-surface, .mdc-dialog--closing .mat-mdc-dialog-surface {
  transform: none;
}
._mat-animation-noopable .mat-mdc-dialog-surface {
  transition: none;
}
.mat-mdc-dialog-surface::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}

.mat-mdc-dialog-title {
  display: block;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  margin: 0 0 1px;
  padding: var(--%NS%mat-dialog-headline-padding, 6px 24px 13px);
}
.mat-mdc-dialog-title::before {
  display: inline-block;
  width: 0;
  height: 40px;
  content: "";
  vertical-align: 0;
}
[dir=rtl] .mat-mdc-dialog-title {
  text-align: right;
}
.mat-mdc-dialog-container .mat-mdc-dialog-title {
  color: var(--%NS%mat-dialog-subhead-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
  font-family: var(--%NS%mat-dialog-subhead-font, var(--%NS%mat-sys-headline-small-font, inherit));
  line-height: var(--%NS%mat-dialog-subhead-line-height, var(--%NS%mat-sys-headline-small-line-height, 1.5rem));
  font-size: var(--%NS%mat-dialog-subhead-size, var(--%NS%mat-sys-headline-small-size, 1rem));
  font-weight: var(--%NS%mat-dialog-subhead-weight, var(--%NS%mat-sys-headline-small-weight, 400));
  letter-spacing: var(--%NS%mat-dialog-subhead-tracking, var(--%NS%mat-sys-headline-small-tracking, 0.03125em));
}

.mat-mdc-dialog-content {
  display: block;
  flex-grow: 1;
  box-sizing: border-box;
  margin: 0;
  overflow: auto;
  max-height: 65vh;
}
.mat-mdc-dialog-content > :first-child {
  margin-top: 0;
}
.mat-mdc-dialog-content > :last-child {
  margin-bottom: 0;
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  color: var(--%NS%mat-dialog-supporting-text-color, var(--%NS%mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));
  font-family: var(--%NS%mat-dialog-supporting-text-font, var(--%NS%mat-sys-body-medium-font, inherit));
  line-height: var(--%NS%mat-dialog-supporting-text-line-height, var(--%NS%mat-sys-body-medium-line-height, 1.5rem));
  font-size: var(--%NS%mat-dialog-supporting-text-size, var(--%NS%mat-sys-body-medium-size, 1rem));
  font-weight: var(--%NS%mat-dialog-supporting-text-weight, var(--%NS%mat-sys-body-medium-weight, 400));
  letter-spacing: var(--%NS%mat-dialog-supporting-text-tracking, var(--%NS%mat-sys-body-medium-tracking, 0.03125em));
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  padding: var(--%NS%mat-dialog-content-padding, 20px 24px);
}
.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content {
  padding: var(--%NS%mat-dialog-with-actions-content-padding, 20px 24px 0);
}
.mat-mdc-dialog-container .mat-mdc-dialog-title + .mat-mdc-dialog-content {
  padding-top: 0;
}

.mat-mdc-dialog-actions {
  display: flex;
  position: relative;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  min-height: 52px;
  margin: 0;
  border-top: 1px solid transparent;
  padding: var(--%NS%mat-dialog-actions-padding, 16px 24px);
  justify-content: var(--%NS%mat-dialog-actions-alignment, flex-end);
}
@media (forced-colors: active) {
  .mat-mdc-dialog-actions {
    border-top-color: CanvasText;
  }
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start, .mat-mdc-dialog-actions[align=start] {
  justify-content: start;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center, .mat-mdc-dialog-actions[align=center] {
  justify-content: center;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end, .mat-mdc-dialog-actions[align=end] {
  justify-content: flex-end;
}
.mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
.mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 8px;
}
[dir=rtl] .mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 0;
  margin-right: 8px;
}

.mat-mdc-dialog-component-host {
  display: contents;
}
`],encapsulation:2,changeDetection:1})}return n})();var LE=`--mat-dialog-transition-duration`;function jE(n){return n==null?null:typeof n==`number`?n:n.endsWith(`ms`)?Yt(n.substring(0,n.length-2)):n.endsWith(`s`)?Yt(n.substring(0,n.length-1))*1e3:n===`0`?0:null}var Qu=(function(n){return n[n.OPEN=0]=`OPEN`,n[n.CLOSING=1]=`CLOSING`,n[n.CLOSED=2]=`CLOSED`,n})(Qu||{});var Ju=class{_ref;_config;_containerInstance;componentInstance;componentRef=null;disableClose;id;_afterOpened=new fi(1);_beforeClosed=new fi(1);_result;_closeFallbackTimeout;_state=Qu.OPEN;_closeInteractionType;constructor(t,e,i){this._ref=t,this._config=e,this._containerInstance=i,this.disableClose=e.disableClose,this.id=t.id,t.addPanelClass(`mat-mdc-dialog-panel`),i._animationStateChanged.pipe(re(r=>r.state===`opened`),xe(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),i._animationStateChanged.pipe(re(r=>r.state===`closed`),xe(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),t.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),Xt(this.backdropClick(),this.keydownEvents().pipe(re(r=>r.keyCode===27&&!this.disableClose&&!Pn(r)))).subscribe(r=>{this.disableClose||(r.preventDefault(),GF(this,r.type===`keydown`?`keyboard`:`mouse`))})}close(t){let e=this._config.closePredicate;e&&!e(t,this._config,this.componentInstance)||(this._result=t,this._containerInstance._animationStateChanged.pipe(re(i=>i.state===`closing`),xe(1)).subscribe(i=>{this._beforeClosed.next(t),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),i.totalTime+100)}),this._state=Qu.CLOSING,this._containerInstance._startExitAnimation())}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(t){let e=this._ref.config.positionStrategy;return t&&(t.left||t.right)?t.left?e.left(t.left):e.right(t.right):e.centerHorizontally(),t&&(t.top||t.bottom)?t.top?e.top(t.top):e.bottom(t.bottom):e.centerVertically(),this._ref.updatePosition(),this}updateSize(t=``,e=``){return this._ref.updateSize(t,e),this}addPanelClass(t){return this._ref.addPanelClass(t),this}removePanelClass(t){return this._ref.removePanelClass(t),this}getState(){return this._state}_finishDialogClose(){this._state=Qu.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function GF(n,t,e){return n._closeInteractionType=t,n.close(e)}var qF=new g(`MatMdcDialogData`);var YF=new g(`mat-mdc-dialog-default-options`);var ZF=new g(`mat-mdc-dialog-scroll-strategy`,{providedIn:`root`,factory:()=>{let n=u(T);return()=>ms(n)}});var VE=(()=>{class n{_defaultOptions=u(YF,{optional:!0});_scrollStrategy=u(ZF);_parentDialog=u(n,{optional:!0,skipSelf:!0});_idGenerator=u(ot);_injector=u(T);_dialog=u(hv);_animationsDisabled=Je();_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new w;_afterOpenedAtThisLevel=new w;dialogConfigClass=Xu;_dialogRefConstructor;_dialogContainerType;_dialogDataToken;get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}afterAllClosed=jn(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(st(void 0)));constructor(){this._dialogRefConstructor=Ju,this._dialogContainerType=WF,this._dialogDataToken=qF}open(e,i){let r;i=p(p({},this._defaultOptions||new Xu),i),i.id=i.id||this._idGenerator.getId(`mat-mdc-dialog-`),i.scrollStrategy=i.scrollStrategy||this._scrollStrategy();let o=this._dialog.open(e,S(p({},i),{positionStrategy:ps(this._injector).centerHorizontally().centerVertically(),disableClose:!0,closePredicate:void 0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,disableAnimations:this._animationsDisabled||i.enterAnimationDuration?.toLocaleString()===`0`||i.exitAnimationDuration?.toString()===`0`,container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:i},{provide:Fi,useValue:i}]},templateContext:()=>({dialogRef:r}),providers:(s,a,c)=>(r=new this._dialogRefConstructor(s,i,c),r.updatePosition(i?.position),[{provide:this._dialogContainerType,useValue:c},{provide:this._dialogDataToken,useValue:a.data},{provide:this._dialogRefConstructor,useValue:r},{provide:Yr,useValue:null}])}));return r.componentRef=o.componentRef,r.componentInstance=o.componentInstance,this.openDialogs.push(r),this.afterOpened.next(r),r.afterClosed().subscribe(()=>{let s=this.openDialogs.indexOf(r);s>-1&&(this.openDialogs.splice(s,1),this.openDialogs.length||this._getAfterAllClosed().next())}),r}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(e){return this.openDialogs.find(i=>i.id===e)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(e){let i=e.length;for(;i--;)e[i].close()}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var BE=(()=>{class n{_dialogRef=u(Ju,{optional:!0});_elementRef=u(N);_dialog=u(VE);ngOnInit(){this._dialogRef||(this._dialogRef=KF(this._elementRef,this._dialog.openDialogs)),this._dialogRef&&Promise.resolve().then(()=>{this._onAdd()})}ngOnDestroy(){this._dialogRef?._containerInstance&&Promise.resolve().then(()=>{this._onRemove()})}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n})}return n})();var lne=(()=>{class n extends BE{id=u(ot).getId(`mat-mdc-dialog-title-`);_onAdd(){this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id)}_onRemove(){this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id)}static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵdir=D({type:n,selectors:[[``,`mat-dialog-title`,``],[``,`matDialogTitle`,``]],hostAttrs:[1,`mat-mdc-dialog-title`,`mdc-dialog__title`],hostVars:1,hostBindings:function(i,r){i&2&&dn(`id`,r.id)},inputs:{id:`id`},exportAs:[`matDialogTitle`],features:[ae]})}return n})();var dne=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`mat-dialog-content`,``],[`mat-dialog-content`],[``,`matDialogContent`,``]],hostAttrs:[1,`mat-mdc-dialog-content`,`mdc-dialog__content`],features:[Ip([ev])]})}return n})();var une=(()=>{class n extends BE{align;_onAdd(){this._dialogRef._containerInstance?._updateActionSectionCount?.(1)}_onRemove(){this._dialogRef._containerInstance?._updateActionSectionCount?.(-1)}static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵdir=D({type:n,selectors:[[``,`mat-dialog-actions`,``],[`mat-dialog-actions`],[``,`matDialogActions`,``]],hostAttrs:[1,`mat-mdc-dialog-actions`,`mdc-dialog__actions`],hostVars:6,hostBindings:function(i,r){i&2&&J(`mat-mdc-dialog-actions-align-start`,r.align===`start`)(`mat-mdc-dialog-actions-align-center`,r.align===`center`)(`mat-mdc-dialog-actions-align-end`,r.align===`end`)},inputs:{align:`align`},features:[ae]})}return n})();function KF(n,t){let e=n.nativeElement.parentElement;for(;e&&!e.classList.contains(`mat-mdc-dialog-container`);)e=e.parentElement;return e?t.find(i=>i.id===e.id):null}var fne=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({providers:[VE],imports:[OE,qr,zr,we]})}return n})();var QF=[`determinateSpinner`];function XF(n,t){if(n&1&&(Ei(),ue(0,`svg`,11),rt(1,`circle`,12),ve()),n&2){let e=Ke();ie(`viewBox`,e._viewBox()),le(),Ir(`stroke-dasharray`,e._strokeCircumference(),`px`)(`stroke-dashoffset`,e._strokeCircumference()/2,`px`)(`stroke-width`,e._circleStrokeWidth(),`%`),ie(`r`,e._circleRadius())}}var JF=new g(`mat-progress-spinner-default-options`,{providedIn:`root`,factory:()=>({diameter:UE})});var UE=100;var eL=10;var Dne=(()=>{class n{_elementRef=u(N);_noopAnimations;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor=`primary`;_determinateCircle;constructor(){let e=u(JF),i=Gg(),r=this._elementRef.nativeElement;this._noopAnimations=i===`di-disabled`&&!!e&&!e._forceAnimations,this.mode=r.nodeName.toLowerCase()===`mat-spinner`?`indeterminate`:`determinate`,!this._noopAnimations&&i===`reduced-motion`&&r.classList.add(`mat-progress-spinner-reduced-motion`),e&&(e.color&&(this.color=this._defaultColor=e.color),e.diameter&&(this.diameter=e.diameter),e.strokeWidth&&(this.strokeWidth=e.strokeWidth))}mode;get value(){return this.mode===`determinate`?this._value:0}set value(e){this._value=Math.max(0,Math.min(100,e||0))}_value=0;get diameter(){return this._diameter}set diameter(e){this._diameter=e||0}_diameter=UE;get strokeWidth(){return this._strokeWidth??this.diameter/10}set strokeWidth(e){this._strokeWidth=e||0}_strokeWidth;_circleRadius(){return(this.diameter-eL)/2}_viewBox(){let e=this._circleRadius()*2+this.strokeWidth;return`0 0 ${e} ${e}`}_strokeCircumference(){return 2*Math.PI*this._circleRadius()}_strokeDashOffset(){return this.mode===`determinate`?this._strokeCircumference()*(100-this._value)/100:null}_circleStrokeWidth(){return this.strokeWidth/this.diameter*100}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`mat-progress-spinner`],[`mat-spinner`]],viewQuery:function(i,r){if(i&1&&Nt(QF,5),i&2){let o;oe(o=se())&&(r._determinateCircle=o.first)}},hostAttrs:[`role`,`progressbar`,`tabindex`,`-1`,1,`mat-mdc-progress-spinner`,`mdc-circular-progress`],hostVars:18,hostBindings:function(i,r){i&2&&(ie(`aria-valuemin`,0)(`aria-valuemax`,100)(`aria-valuenow`,r.mode===`determinate`?r.value:null)(`mode`,r.mode),Jn(`mat-`+r.color),Ir(`width`,r.diameter,`px`)(`height`,r.diameter,`px`)(`--%NS%mat-progress-spinner-size`,r.diameter+`px`)(`--%NS%mat-progress-spinner-active-indicator-width`,r.diameter+`px`),J(`_mat-animation-noopable`,r._noopAnimations)(`mdc-circular-progress--indeterminate`,r.mode===`indeterminate`))},inputs:{color:`color`,mode:`mode`,value:[2,`value`,`value`,Oo],diameter:[2,`diameter`,`diameter`,Oo],strokeWidth:[2,`strokeWidth`,`strokeWidth`,Oo]},exportAs:[`matProgressSpinner`],decls:14,vars:11,consts:[[`circle`,``],[`determinateSpinner`,``],[`aria-hidden`,`true`,1,`mdc-circular-progress__determinate-container`],[`xmlns`,`http://www.w3.org/2000/svg`,`focusable`,`false`,1,`mdc-circular-progress__determinate-circle-graphic`],[`cx`,`50%`,`cy`,`50%`,1,`mdc-circular-progress__determinate-circle`],[`aria-hidden`,`true`,1,`mdc-circular-progress__indeterminate-container`],[1,`mdc-circular-progress__spinner-layer`],[1,`mdc-circular-progress__circle-clipper`,`mdc-circular-progress__circle-left`],[3,`ngTemplateOutlet`],[1,`mdc-circular-progress__gap-patch`],[1,`mdc-circular-progress__circle-clipper`,`mdc-circular-progress__circle-right`],[`xmlns`,`http://www.w3.org/2000/svg`,`focusable`,`false`,1,`mdc-circular-progress__indeterminate-circle-graphic`],[`cx`,`50%`,`cy`,`50%`]],template:function(i,r){if(i&1&&(Ot(0,XF,2,8,`ng-template`,null,0,Ro),ue(2,`div`,2,1),Ei(),ue(4,`svg`,3),rt(5,`circle`,4),ve()(),oa(),ue(6,`div`,5)(7,`div`,6)(8,`div`,7),Ao(9,8),ve(),ue(10,`div`,9),Ao(11,8),ve(),ue(12,`div`,10),Ao(13,8),ve()()()),i&2){let o=xr(1);le(4),ie(`viewBox`,r._viewBox()),le(),Ir(`stroke-dasharray`,r._strokeCircumference(),`px`)(`stroke-dashoffset`,r._strokeDashOffset(),`px`)(`stroke-width`,r._circleStrokeWidth(),`%`),ie(`r`,r._circleRadius()),le(4),yt(`ngTemplateOutlet`,o),le(2),yt(`ngTemplateOutlet`,o),le(2),yt(`ngTemplateOutlet`,o)}},dependencies:[Pa],styles:[`.mat-mdc-progress-spinner {
  --%NS%mat-progress-spinner-animation-multiplier: 1;
  display: block;
  overflow: hidden;
  line-height: 0;
  position: relative;
  direction: ltr;
  transition: opacity 250ms cubic-bezier(0.4, 0, 0.6, 1);
}
.mat-mdc-progress-spinner circle {
  stroke-width: var(--%NS%mat-progress-spinner-active-indicator-width, 4px);
}
.mat-mdc-progress-spinner._mat-animation-noopable, .mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__determinate-circle {
  transition: none !important;
}
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-circle-graphic,
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__spinner-layer,
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container {
  animation: none !important;
}
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container circle {
  stroke-dasharray: 0 !important;
}
@media (forced-colors: active) {
  .mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic,
  .mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle {
    stroke: currentColor;
    stroke: CanvasText;
  }
}

.mat-progress-spinner-reduced-motion {
  --%NS%mat-progress-spinner-animation-multiplier: 1.25;
}

.mdc-circular-progress__determinate-container,
.mdc-circular-progress__indeterminate-circle-graphic,
.mdc-circular-progress__indeterminate-container,
.mdc-circular-progress__spinner-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.mdc-circular-progress__determinate-container {
  transform: rotate(-90deg);
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__determinate-container {
  opacity: 0;
}

.mdc-circular-progress__indeterminate-container {
  font-size: 0;
  letter-spacing: 0;
  white-space: nowrap;
  opacity: 0;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__indeterminate-container {
  opacity: 1;
  animation: mdc-circular-progress-container-rotate calc(1568.2352941176ms * var(--%NS%mat-progress-spinner-animation-multiplier)) linear infinite;
}

.mdc-circular-progress__determinate-circle-graphic,
.mdc-circular-progress__indeterminate-circle-graphic {
  fill: transparent;
}

.mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,
.mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic {
  stroke: var(--%NS%mat-progress-spinner-active-indicator-color, var(--%NS%mat-sys-primary));
}
@media (forced-colors: active) {
  .mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,
  .mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic {
    stroke: CanvasText;
  }
}

.mdc-circular-progress__determinate-circle {
  transition: stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);
}

.mdc-circular-progress__gap-patch {
  position: absolute;
  top: 0;
  left: 47.5%;
  box-sizing: border-box;
  width: 5%;
  height: 100%;
  overflow: hidden;
}

.mdc-circular-progress__gap-patch .mdc-circular-progress__indeterminate-circle-graphic {
  left: -900%;
  width: 2000%;
  transform: rotate(180deg);
}
.mdc-circular-progress__circle-clipper .mdc-circular-progress__indeterminate-circle-graphic {
  width: 200%;
}
.mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic {
  left: -100%;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-left .mdc-circular-progress__indeterminate-circle-graphic {
  animation: mdc-circular-progress-left-spin calc(1333ms * var(--%NS%mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic {
  animation: mdc-circular-progress-right-spin calc(1333ms * var(--%NS%mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.mdc-circular-progress__circle-clipper {
  display: inline-flex;
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
}

.mdc-circular-progress--indeterminate .mdc-circular-progress__spinner-layer {
  animation: mdc-circular-progress-spinner-layer-rotate calc(5332ms * var(--%NS%mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

@keyframes mdc-circular-progress-container-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes mdc-circular-progress-spinner-layer-rotate {
  12.5% {
    transform: rotate(135deg);
  }
  25% {
    transform: rotate(270deg);
  }
  37.5% {
    transform: rotate(405deg);
  }
  50% {
    transform: rotate(540deg);
  }
  62.5% {
    transform: rotate(675deg);
  }
  75% {
    transform: rotate(810deg);
  }
  87.5% {
    transform: rotate(945deg);
  }
  100% {
    transform: rotate(1080deg);
  }
}
@keyframes mdc-circular-progress-left-spin {
  from {
    transform: rotate(265deg);
  }
  50% {
    transform: rotate(130deg);
  }
  to {
    transform: rotate(265deg);
  }
}
@keyframes mdc-circular-progress-right-spin {
  from {
    transform: rotate(-265deg);
  }
  50% {
    transform: rotate(-130deg);
  }
  to {
    transform: rotate(-265deg);
  }
}
`],encapsulation:2})}return n})();var Ene=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[we]})}return n})();var pv=class{_box;_destroyed=new w;_resizeSubject=new w;_resizeObserver;_elementObservables=new Map;constructor(t){this._box=t,typeof ResizeObserver<`u`&&(this._resizeObserver=new ResizeObserver(e=>this._resizeSubject.next(e)))}observe(t){return this._elementObservables.has(t)||this._elementObservables.set(t,new V(e=>{let i=this._resizeSubject.subscribe(e);return this._resizeObserver?.observe(t,{box:this._box}),()=>{this._resizeObserver?.unobserve(t),i.unsubscribe(),this._elementObservables.delete(t)}}).pipe(re(e=>e.some(i=>i.target===t)),rl({bufferSize:1,refCount:!0}),at(this._destroyed))),this._elementObservables.get(t)}destroy(){this._destroyed.next(),this._destroyed.complete(),this._resizeSubject.complete(),this._elementObservables.clear()}};var HE=(()=>{class n{_cleanupErrorListener;_observers=new Map;_ngZone=u(I);constructor(){}ngOnDestroy(){for(let[,e]of this._observers)e.destroy();this._observers.clear(),this._cleanupErrorListener?.()}observe(e,i){let r=i?.box||`content-box`;return this._observers.has(r)||this._observers.set(r,new pv(r)),this._observers.get(r).observe(e)}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var tL=[`notch`];var nL=[`*`];var zE=[`iconPrefixContainer`];var $E=[`textPrefixContainer`];var WE=[`iconSuffixContainer`];var GE=[`textSuffixContainer`];var iL=[`textField`];var rL=[`*`,[[`mat-label`]],[[``,`matPrefix`,``],[``,`matIconPrefix`,``]],[[``,`matTextPrefix`,``]],[[``,`matTextSuffix`,``]],[[``,`matSuffix`,``],[``,`matIconSuffix`,``]],[[`mat-error`],[``,`matError`,``]],[[`mat-hint`,3,`align`,`end`]],[[`mat-hint`,`align`,`end`]]];var oL=[`*`,`mat-label`,`[matPrefix], [matIconPrefix]`,`[matTextPrefix]`,`[matTextSuffix]`,`[matSuffix], [matIconSuffix]`,`mat-error, [matError]`,`mat-hint:not([align='end'])`,`mat-hint[align='end']`];function sL(n,t){n&1&&rt(0,`span`,21)}function aL(n,t){if(n&1&&(ue(0,`label`,20),ee(1,1),Me(2,sL,1,0,`span`,21),ve()),n&2){let e=Ke(2);yt(`floating`,e._shouldLabelFloat())(`monitorResize`,e._hasOutline())(`id`,e._labelId),ie(`for`,e._control.disableAutomaticLabeling?null:e._control.id),le(2),Te(!e.hideRequiredMarker&&e._control.required?2:-1)}}function cL(n,t){if(n&1&&Me(0,aL,3,5,`label`,20),n&2)Te(Ke()._hasFloatingLabel()?0:-1)}function lL(n,t){n&1&&rt(0,`div`,7)}function dL(n,t){}function uL(n,t){if(n&1&&Ot(0,dL,0,0,`ng-template`,13),n&2){Ke(2);yt(`ngTemplateOutlet`,xr(1))}}function fL(n,t){if(n&1&&(ue(0,`div`,9),Me(1,uL,1,1,null,13),ve()),n&2){let e=Ke();yt(`matFormFieldNotchedOutlineOpen`,e._shouldLabelFloat()),le(),Te(e._forceDisplayInfixLabel()?-1:1)}}function hL(n,t){n&1&&(ue(0,`div`,10,2),ee(2,2),ve())}function mL(n,t){n&1&&(ue(0,`div`,11,3),ee(2,3),ve())}function pL(n,t){}function gL(n,t){if(n&1&&Ot(0,pL,0,0,`ng-template`,13),n&2){Ke();yt(`ngTemplateOutlet`,xr(1))}}function vL(n,t){n&1&&(ue(0,`div`,14,4),ee(2,4),ve())}function yL(n,t){n&1&&(ue(0,`div`,15,5),ee(2,5),ve())}function _L(n,t){n&1&&rt(0,`div`,16)}function bL(n,t){n&1&&(ue(0,`div`,18),ee(1,6),ve())}function SL(n,t){if(n&1&&(ue(0,`mat-hint`,22),kp(1),ve()),n&2){let e=Ke(2);yt(`id`,e._hintLabelId),le(),Td(e.hintLabel)}}function wL(n,t){if(n&1&&(ue(0,`div`,19),Me(1,SL,2,2,`mat-hint`,22),ee(2,7),rt(3,`div`,23),ee(4,8),ve()),n&2){let e=Ke();le(),Te(e.hintLabel?1:-1)}}var gv=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`mat-label`]]})}return n})();var CL=new g(`MatError`);var vv=(()=>{class n{align=`start`;id=u(ot).getId(`mat-mdc-hint-`);static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`mat-hint`]],hostAttrs:[1,`mat-mdc-form-field-hint`,`mat-mdc-form-field-bottom-align`],hostVars:4,hostBindings:function(i,r){i&2&&(dn(`id`,r.id),ie(`align`,null),J(`mat-mdc-form-field-hint-end`,r.align===`end`))},inputs:{align:`align`,id:`id`}})}return n})();var DL=new g(`MatPrefix`);var EL=new g(`MatSuffix`);var JE=new g(`FloatingLabelParent`);var qE=(()=>{class n{_elementRef=u(N);get floating(){return this._floating}set floating(e){this._floating=e,this.monitorResize&&this._handleResize()}_floating=!1;get monitorResize(){return this._monitorResize}set monitorResize(e){this._monitorResize=e,this._monitorResize?this._subscribeToResize():this._resizeSubscription.unsubscribe()}_monitorResize=!1;_resizeObserver=u(HE);_ngZone=u(I);_parent=u(JE);_resizeSubscription=new Q;ngOnDestroy(){this._resizeSubscription.unsubscribe()}getWidth(){return xL(this._elementRef.nativeElement)}get element(){return this._elementRef.nativeElement}_handleResize(){setTimeout(()=>this._parent._handleLabelResized())}_subscribeToResize(){this._resizeSubscription.unsubscribe(),this._ngZone.runOutsideAngular(()=>{this._resizeSubscription=this._resizeObserver.observe(this._elementRef.nativeElement,{box:`border-box`}).subscribe(()=>this._handleResize())})}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`label`,`matFormFieldFloatingLabel`,``]],hostAttrs:[1,`mdc-floating-label`,`mat-mdc-floating-label`],hostVars:2,hostBindings:function(i,r){i&2&&J(`mdc-floating-label--float-above`,r.floating)},inputs:{floating:`floating`,monitorResize:`monitorResize`}})}return n})();function xL(n){let t=n;if(t.offsetParent!==null)return t.scrollWidth;let e=t.cloneNode(!0);e.style.setProperty(`position`,`absolute`),e.style.setProperty(`transform`,`translate(-9999px, -9999px)`),document.documentElement.appendChild(e);let i=e.scrollWidth;return e.remove(),i}var YE=`mdc-line-ripple--active`;var ef=`mdc-line-ripple--deactivating`;var ZE=(()=>{class n{_elementRef=u(N);_cleanupTransitionEnd;constructor(){let e=u(I),i=u(ge);e.runOutsideAngular(()=>{this._cleanupTransitionEnd=i.listen(this._elementRef.nativeElement,`transitionend`,this._handleTransitionEnd)})}activate(){let e=this._elementRef.nativeElement.classList;e.remove(ef),e.add(YE)}deactivate(){this._elementRef.nativeElement.classList.add(ef)}_handleTransitionEnd=e=>{let i=this._elementRef.nativeElement.classList,r=i.contains(ef);e.propertyName===`opacity`&&r&&i.remove(YE,ef)};ngOnDestroy(){this._cleanupTransitionEnd()}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`div`,`matFormFieldLineRipple`,``]],hostAttrs:[1,`mdc-line-ripple`]})}return n})();var KE=(()=>{class n{_elementRef=u(N);_ngZone=u(I);open=!1;_notch;ngAfterViewInit(){let e=this._elementRef.nativeElement,i=e.querySelector(`.mdc-floating-label`);i?(e.classList.add(`mdc-notched-outline--upgraded`),typeof requestAnimationFrame==`function`&&(i.style.transitionDuration=`0s`,this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>i.style.transitionDuration=``)}))):e.classList.add(`mdc-notched-outline--no-label`)}_setNotchWidth(e){let i=this._notch.nativeElement;!this.open||!e?i.style.width=``:i.style.width=`calc(${e}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`}_setMaxWidth(e){this._notch.nativeElement.style.setProperty(`--mat-form-field-notch-max-width`,`calc(100% - ${e}px)`)}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`div`,`matFormFieldNotchedOutline`,``]],viewQuery:function(i,r){if(i&1&&Nt(tL,5),i&2){let o;oe(o=se())&&(r._notch=o.first)}},hostAttrs:[1,`mdc-notched-outline`],hostVars:2,hostBindings:function(i,r){i&2&&J(`mdc-notched-outline--notched`,r.open)},inputs:{open:[0,`matFormFieldNotchedOutlineOpen`,`open`]},ngContentSelectors:nL,decls:5,vars:0,consts:[[`notch`,``],[1,`mat-mdc-notch-piece`,`mdc-notched-outline__leading`],[1,`mat-mdc-notch-piece`,`mdc-notched-outline__notch`],[1,`mat-mdc-notch-piece`,`mdc-notched-outline__trailing`]],template:function(i,r){i&1&&(Ge(),It(0,`div`,1),ft(1,`div`,2,0),ee(3),_t(),It(4,`div`,3))},encapsulation:2})}return n})();var yv=(()=>{class n{value=null;stateChanges;id;placeholder;ngControl=null;focused=!1;empty=!1;shouldLabelFloat=!1;required=!1;disabled=!1;errorState=!1;controlType;autofilled;userAriaDescribedBy;disableAutomaticLabeling;describedByIds;static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n})}return n})();var _v=new g(`MatFormField`);var IL=new g(`MAT_FORM_FIELD_DEFAULT_OPTIONS`);var QE=`fill`;var NL=`auto`;var XE=`fixed`;var ML=`translateY(-50%)`;var ex=(()=>{class n{_elementRef=u(N);_changeDetectorRef=u(Qe);_platform=u(fe);_idGenerator=u(ot);_ngZone=u(I);_defaults=u(IL,{optional:!0});_currentDirection;_textField;_iconPrefixContainer;_textPrefixContainer;_iconSuffixContainer;_textSuffixContainer;_floatingLabel;_notchedOutline;_lineRipple;_iconPrefixContainerSignal=ka(`iconPrefixContainer`);_textPrefixContainerSignal=ka(`textPrefixContainer`);_iconSuffixContainerSignal=ka(`iconSuffixContainer`);_textSuffixContainerSignal=ka(`textSuffixContainer`);_prefixSuffixContainers=x(()=>[this._iconPrefixContainerSignal(),this._textPrefixContainerSignal(),this._iconSuffixContainerSignal(),this._textSuffixContainerSignal()].map(e=>e?.nativeElement).filter(e=>e!==void 0));_formFieldControl;_prefixChildren;_suffixChildren;_errorChildren;_hintChildren;_labelChild=qw(gv);get hideRequiredMarker(){return this._hideRequiredMarker}set hideRequiredMarker(e){this._hideRequiredMarker=Ct(e)}_hideRequiredMarker=!1;color=`primary`;get floatLabel(){return this._floatLabel||this._defaults?.floatLabel||NL}set floatLabel(e){e!==this._floatLabel&&(this._floatLabel=e,this._changeDetectorRef.markForCheck())}_floatLabel;get appearance(){return this._appearanceSignal()}set appearance(e){let i=e||this._defaults?.appearance||QE;this._appearanceSignal.set(i)}_appearanceSignal=C(QE);get subscriptSizing(){return this._subscriptSizing||this._defaults?.subscriptSizing||XE}set subscriptSizing(e){this._subscriptSizing=e||this._defaults?.subscriptSizing||XE}_subscriptSizing=null;get hintLabel(){return this._hintLabel}set hintLabel(e){this._hintLabel=e,this._processHints()}_hintLabel=``;_hasIconPrefix=!1;_hasTextPrefix=!1;_hasIconSuffix=!1;_hasTextSuffix=!1;_labelId=this._idGenerator.getId(`mat-mdc-form-field-label-`);_hintLabelId=this._idGenerator.getId(`mat-mdc-hint-`);_describedByIds;get _control(){return this._explicitFormFieldControl||this._formFieldControl}set _control(e){this._explicitFormFieldControl=e}_destroyed=new w;_isFocused=null;_explicitFormFieldControl;_previousControl=null;_previousControlValidatorFn=null;_stateChanges;_valueChanges;_describedByChanges;_outlineLabelOffsetResizeObserver=null;_animationsDisabled=Je();constructor(){let e=this._defaults,i=u(jt);e&&(e.appearance&&(this.appearance=e.appearance),this._hideRequiredMarker=!!e?.hideRequiredMarker,e.color&&(this.color=e.color)),dt(()=>this._currentDirection=i.valueSignal()),this._syncOutlineLabelOffset()}ngAfterViewInit(){this._updateFocusState(),this._animationsDisabled||this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._elementRef.nativeElement.classList.add(`mat-form-field-animations-enabled`)},300)}),this._changeDetectorRef.detectChanges()}ngAfterContentInit(){this._assertFormFieldControl(),this._initializeSubscript(),this._initializePrefixAndSuffix()}ngAfterContentChecked(){this._assertFormFieldControl(),this._control!==this._previousControl&&(this._initializeControl(this._previousControl),this._control.ngControl&&this._control.ngControl.control&&(this._previousControlValidatorFn=this._control.ngControl.control.validator),this._previousControl=this._control,this._changeDetectorRef.markForCheck()),this._control.ngControl&&this._control.ngControl.control&&this._control.ngControl.control.validator!==this._previousControlValidatorFn&&this._changeDetectorRef.markForCheck()}ngOnDestroy(){this._outlineLabelOffsetResizeObserver?.disconnect(),this._stateChanges?.unsubscribe(),this._valueChanges?.unsubscribe(),this._describedByChanges?.unsubscribe(),this._destroyed.next(),this._destroyed.complete()}getLabelId=x(()=>this._hasFloatingLabel()?this._labelId:null);getConnectedOverlayOrigin(){return this._textField||this._elementRef}_animateAndLockLabel(){this._hasFloatingLabel()&&(this.floatLabel=`always`)}_initializeControl(e){let i=this._control,r=`mat-mdc-form-field-type-`;e&&this._elementRef.nativeElement.classList.remove(r+e.controlType),i.controlType&&this._elementRef.nativeElement.classList.add(r+i.controlType),this._stateChanges?.unsubscribe(),this._stateChanges=i.stateChanges.subscribe(()=>{this._updateFocusState(),this._changeDetectorRef.markForCheck()}),this._describedByChanges?.unsubscribe(),this._describedByChanges=i.stateChanges.pipe(st([void 0,void 0]),H(()=>[i.errorState,i.userAriaDescribedBy]),il(),re(([[o,s],[a,c]])=>o!==a||s!==c)).subscribe(()=>this._syncDescribedByIds()),this._valueChanges?.unsubscribe(),i.ngControl&&i.ngControl.valueChanges&&(this._valueChanges=i.ngControl.valueChanges.pipe(at(this._destroyed)).subscribe(()=>this._changeDetectorRef.markForCheck()))}_checkPrefixAndSuffixTypes(){this._hasIconPrefix=!!this._prefixChildren.find(e=>!e._isText),this._hasTextPrefix=!!this._prefixChildren.find(e=>e._isText),this._hasIconSuffix=!!this._suffixChildren.find(e=>!e._isText),this._hasTextSuffix=!!this._suffixChildren.find(e=>e._isText)}_initializePrefixAndSuffix(){this._checkPrefixAndSuffixTypes(),Xt(this._prefixChildren.changes,this._suffixChildren.changes).subscribe(()=>{this._checkPrefixAndSuffixTypes(),this._changeDetectorRef.markForCheck()})}_initializeSubscript(){this._hintChildren.changes.subscribe(()=>{this._processHints(),this._changeDetectorRef.markForCheck()}),this._errorChildren.changes.subscribe(()=>{this._syncDescribedByIds(),this._changeDetectorRef.markForCheck()}),this._validateHints(),this._syncDescribedByIds()}_assertFormFieldControl(){this._control}_updateFocusState(){let e=this._control.focused;e&&!this._isFocused?(this._isFocused=!0,this._lineRipple?.activate()):!e&&(this._isFocused||this._isFocused===null)&&(this._isFocused=!1,this._lineRipple?.deactivate()),this._elementRef.nativeElement.classList.toggle(`mat-focused`,e),this._textField?.nativeElement.classList.toggle(`mdc-text-field--focused`,e)}_syncOutlineLabelOffset(){Pd({earlyRead:()=>{if(this._appearanceSignal()!==`outline`)return this._outlineLabelOffsetResizeObserver?.disconnect(),null;if(globalThis.ResizeObserver){this._outlineLabelOffsetResizeObserver||=new globalThis.ResizeObserver(()=>{this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset())});for(let e of this._prefixSuffixContainers())this._outlineLabelOffsetResizeObserver.observe(e,{box:`border-box`})}return this._getOutlinedLabelOffset()},write:e=>this._writeOutlinedLabelStyles(e())})}_shouldAlwaysFloat(){return this.floatLabel===`always`}_hasOutline(){return this.appearance===`outline`}_forceDisplayInfixLabel(){return!this._platform.isBrowser&&this._prefixChildren.length&&!this._shouldLabelFloat()}_hasFloatingLabel=x(()=>!!this._labelChild());_shouldLabelFloat(){return this._hasFloatingLabel()?this._control.shouldLabelFloat||this._shouldAlwaysFloat():!1}_shouldForward(e){let i=this._control?this._control.ngControl:null;return i&&i[e]}_getSubscriptMessageType(){return this._errorChildren&&this._errorChildren.length>0&&this._control.errorState?`error`:`hint`}_handleLabelResized(){this._refreshOutlineNotchWidth()}_refreshOutlineNotchWidth(){!this._hasOutline()||!this._floatingLabel||!this._shouldLabelFloat()?this._notchedOutline?._setNotchWidth(0):this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth())}_processHints(){this._validateHints(),this._syncDescribedByIds()}_validateHints(){this._hintChildren}_syncDescribedByIds(){if(this._control){let e=[];if(this._control.userAriaDescribedBy&&typeof this._control.userAriaDescribedBy==`string`&&e.push(...this._control.userAriaDescribedBy.split(` `)),this._getSubscriptMessageType()===`hint`){let o=this._hintChildren?this._hintChildren.find(a=>a.align===`start`):null,s=this._hintChildren?this._hintChildren.find(a=>a.align===`end`):null;o?e.push(o.id):this._hintLabel&&e.push(this._hintLabelId),s&&e.push(s.id)}else this._errorChildren&&e.push(...this._errorChildren.map(o=>o.id));let i=this._control.describedByIds,r;if(i){let o=this._describedByIds||e;r=e.concat(i.filter(s=>s&&!o.includes(s)))}else r=e;this._control.setDescribedByIds(r),this._describedByIds=e}}_getOutlinedLabelOffset(){if(!this._hasOutline()||!this._floatingLabel)return null;if(!this._iconPrefixContainer&&!this._textPrefixContainer)return[``,null];if(!this._isAttachedToDom())return null;let e=this._iconPrefixContainer?.nativeElement,i=this._textPrefixContainer?.nativeElement,r=this._iconSuffixContainer?.nativeElement,o=this._textSuffixContainer?.nativeElement,s=e?.getBoundingClientRect().width??0,a=i?.getBoundingClientRect().width??0,c=r?.getBoundingClientRect().width??0,l=o?.getBoundingClientRect().width??0;return[`var(--mat-mdc-form-field-label-transform, ${ML} translateX(${`calc(${this._currentDirection===`rtl`?`-1`:`1`} * (${`${s+a}px`} + var(--mat-mdc-form-field-label-offset-x, 0px)))`}))`,s+a+c+l]}_writeOutlinedLabelStyles(e){if(e!==null){let[i,r]=e;this._floatingLabel&&(this._floatingLabel.element.style.transform=i),r!==null&&this._notchedOutline?._setMaxWidth(r)}}_isAttachedToDom(){let e=this._elementRef.nativeElement;if(e.getRootNode){let i=e.getRootNode();return i&&i!==e}return document.documentElement.contains(e)}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`mat-form-field`]],contentQueries:function(i,r,o){if(i&1&&(Id(o,r._labelChild,gv,5),un(o,yv,5)(o,DL,5)(o,EL,5)(o,CL,5)(o,vv,5)),i&2){Md();let s;oe(s=se())&&(r._formFieldControl=s.first),oe(s=se())&&(r._prefixChildren=s),oe(s=se())&&(r._suffixChildren=s),oe(s=se())&&(r._errorChildren=s),oe(s=se())&&(r._hintChildren=s)}},viewQuery:function(i,r){if(i&1&&(Nd(r._iconPrefixContainerSignal,zE,5)(r._textPrefixContainerSignal,$E,5)(r._iconSuffixContainerSignal,WE,5)(r._textSuffixContainerSignal,GE,5),Nt(iL,5)(zE,5)($E,5)(WE,5)(GE,5)(qE,5)(KE,5)(ZE,5)),i&2){Md(4);let o;oe(o=se())&&(r._textField=o.first),oe(o=se())&&(r._iconPrefixContainer=o.first),oe(o=se())&&(r._textPrefixContainer=o.first),oe(o=se())&&(r._iconSuffixContainer=o.first),oe(o=se())&&(r._textSuffixContainer=o.first),oe(o=se())&&(r._floatingLabel=o.first),oe(o=se())&&(r._notchedOutline=o.first),oe(o=se())&&(r._lineRipple=o.first)}},hostAttrs:[1,`mat-mdc-form-field`],hostVars:38,hostBindings:function(i,r){i&2&&J(`mat-mdc-form-field-label-always-float`,r._shouldAlwaysFloat())(`mat-mdc-form-field-has-icon-prefix`,r._hasIconPrefix)(`mat-mdc-form-field-has-icon-suffix`,r._hasIconSuffix)(`mat-form-field-invalid`,r._control.errorState)(`mat-form-field-disabled`,r._control.disabled)(`mat-form-field-autofilled`,r._control.autofilled)(`mat-form-field-appearance-fill`,r.appearance==`fill`)(`mat-form-field-appearance-outline`,r.appearance==`outline`)(`mat-form-field-hide-placeholder`,r._hasFloatingLabel()&&!r._shouldLabelFloat())(`mat-primary`,r.color!==`accent`&&r.color!==`warn`)(`mat-accent`,r.color===`accent`)(`mat-warn`,r.color===`warn`)(`ng-untouched`,r._shouldForward(`untouched`))(`ng-touched`,r._shouldForward(`touched`))(`ng-pristine`,r._shouldForward(`pristine`))(`ng-dirty`,r._shouldForward(`dirty`))(`ng-valid`,r._shouldForward(`valid`))(`ng-invalid`,r._shouldForward(`invalid`))(`ng-pending`,r._shouldForward(`pending`))},inputs:{hideRequiredMarker:`hideRequiredMarker`,color:`color`,floatLabel:`floatLabel`,appearance:`appearance`,subscriptSizing:`subscriptSizing`,hintLabel:`hintLabel`},exportAs:[`matFormField`],features:[Le([{provide:_v,useExisting:n},{provide:JE,useExisting:n}])],ngContentSelectors:oL,decls:18,vars:21,consts:[[`labelTemplate`,``],[`textField`,``],[`iconPrefixContainer`,``],[`textPrefixContainer`,``],[`textSuffixContainer`,``],[`iconSuffixContainer`,``],[1,`mat-mdc-text-field-wrapper`,`mdc-text-field`,3,`click`],[1,`mat-mdc-form-field-focus-overlay`],[1,`mat-mdc-form-field-flex`],[`matFormFieldNotchedOutline`,``,3,`matFormFieldNotchedOutlineOpen`],[1,`mat-mdc-form-field-icon-prefix`],[1,`mat-mdc-form-field-text-prefix`],[1,`mat-mdc-form-field-infix`],[3,`ngTemplateOutlet`],[1,`mat-mdc-form-field-text-suffix`],[1,`mat-mdc-form-field-icon-suffix`],[`matFormFieldLineRipple`,``],[`aria-atomic`,`true`,`aria-live`,`polite`,1,`mat-mdc-form-field-subscript-wrapper`,`mat-mdc-form-field-bottom-align`],[1,`mat-mdc-form-field-error-wrapper`],[1,`mat-mdc-form-field-hint-wrapper`],[`matFormFieldFloatingLabel`,``,3,`floating`,`monitorResize`,`id`],[`aria-hidden`,`true`,1,`mat-mdc-form-field-required-marker`,`mdc-floating-label--required`],[3,`id`],[1,`mat-mdc-form-field-hint-spacer`]],template:function(i,r){if(i&1&&(Ge(rL),Ot(0,cL,1,1,`ng-template`,null,0,Ro),ue(2,`div`,6,1),Fe(`click`,function(s){return r._control.onContainerClick(s)}),Me(4,lL,1,0,`div`,7),ue(5,`div`,8),Me(6,fL,2,2,`div`,9),Me(7,hL,3,0,`div`,10),Me(8,mL,3,0,`div`,11),ue(9,`div`,12),Me(10,gL,1,1,null,13),ee(11),ve(),Me(12,vL,3,0,`div`,14),Me(13,yL,3,0,`div`,15),ve(),Me(14,_L,1,0,`div`,16),ve(),ue(15,`div`,17),Me(16,bL,2,0,`div`,18)(17,wL,5,1,`div`,19),ve()),i&2){let o;le(2),J(`mdc-text-field--filled`,!r._hasOutline())(`mdc-text-field--outlined`,r._hasOutline())(`mdc-text-field--no-label`,!r._hasFloatingLabel())(`mdc-text-field--disabled`,r._control.disabled)(`mdc-text-field--invalid`,r._control.errorState),le(2),Te(!r._hasOutline()&&!r._control.disabled?4:-1),le(2),Te(r._hasOutline()?6:-1),le(),Te(r._hasIconPrefix?7:-1),le(),Te(r._hasTextPrefix?8:-1),le(2),Te(!r._hasOutline()||r._forceDisplayInfixLabel()?10:-1),le(2),Te(r._hasTextSuffix?12:-1),le(),Te(r._hasIconSuffix?13:-1),le(),Te(r._hasOutline()?-1:14),le(),J(`mat-mdc-form-field-subscript-dynamic-size`,r.subscriptSizing===`dynamic`);let s=r._getSubscriptMessageType();le(),Te((o=s)===`error`?16:o===`hint`?17:-1)}},dependencies:[qE,KE,Pa,ZE,vv],styles:[`.mdc-text-field {
  display: inline-flex;
  align-items: baseline;
  padding: 0 16px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  will-change: opacity, transform, color;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.mdc-text-field__input {
  width: 100%;
  min-width: 0;
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  height: 28px;
}
.mdc-text-field__input::-webkit-calendar-picker-indicator, .mdc-text-field__input::-webkit-search-cancel-button {
  display: none;
}
.mdc-text-field__input::-ms-clear {
  display: none;
}
.mdc-text-field__input:focus {
  outline: none;
}
.mdc-text-field__input:invalid {
  box-shadow: none;
}
.mdc-text-field__input::placeholder {
  opacity: 0;
}
.mdc-text-field__input::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field__input::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field__input:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  opacity: 1;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input {
  height: 100%;
}
.mdc-text-field--outlined .mdc-text-field__input {
  display: flex;
  border: none !important;
  background-color: transparent;
}
.mdc-text-field--disabled .mdc-text-field__input {
  pointer-events: auto;
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--%NS%mat-form-field-filled-input-text-color, var(--%NS%mat-sys-on-surface));
  caret-color: var(--%NS%mat-form-field-filled-caret-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--%NS%mat-form-field-outlined-input-text-color, var(--%NS%mat-sys-on-surface));
  caret-color: var(--%NS%mat-form-field-outlined-caret-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--%NS%mat-form-field-filled-error-caret-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--outlined.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--%NS%mat-form-field-outlined-error-caret-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--%NS%mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--%NS%mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-text-field__input {
    background-color: Window;
  }
}

.mdc-text-field--filled {
  height: 56px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-filled-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-top-right-radius: var(--%NS%mat-form-field-filled-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) {
  background-color: var(--%NS%mat-form-field-filled-container-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled {
  background-color: var(--%NS%mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 4%, transparent));
}

.mdc-text-field--outlined {
  height: 56px;
  overflow: visible;
  padding-right: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
  padding-left: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)) + 4px);
}
[dir=rtl] .mdc-text-field--outlined {
  padding-right: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)) + 4px);
  padding-left: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
}

.mdc-floating-label {
  position: absolute;
  left: 0;
  transform-origin: left top;
  line-height: 1.15rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
  overflow: hidden;
  will-change: transform;
}
[dir=rtl] .mdc-floating-label {
  right: 0;
  left: auto;
  transform-origin: right top;
  text-align: right;
}
.mdc-text-field .mdc-floating-label {
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.mdc-notched-outline .mdc-floating-label {
  display: inline-block;
  position: relative;
  max-width: 100%;
}
.mdc-text-field--outlined .mdc-floating-label {
  left: 4px;
  right: auto;
}
[dir=rtl] .mdc-text-field--outlined .mdc-floating-label {
  left: auto;
  right: 4px;
}
.mdc-text-field--filled .mdc-floating-label {
  left: 16px;
  right: auto;
}
[dir=rtl] .mdc-text-field--filled .mdc-floating-label {
  left: auto;
  right: 16px;
}
.mdc-text-field--disabled .mdc-floating-label {
  cursor: default;
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-floating-label {
    z-index: 1;
  }
}
.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label {
  display: none;
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-focus-label-text-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-hover-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-focus-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-hover-label-text-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--filled .mdc-floating-label {
  font-family: var(--%NS%mat-form-field-filled-label-text-font, var(--%NS%mat-sys-body-large-font));
  font-size: var(--%NS%mat-form-field-filled-label-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-form-field-filled-label-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-form-field-filled-label-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-focus-label-text-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-focus-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-hover-label-text-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--outlined .mdc-floating-label {
  font-family: var(--%NS%mat-form-field-outlined-label-text-font, var(--%NS%mat-sys-body-large-font));
  font-size: var(--%NS%mat-form-field-outlined-label-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-form-field-outlined-label-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-form-field-outlined-label-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}

.mdc-floating-label--float-above {
  cursor: auto;
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--filled .mdc-floating-label--float-above {
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--outlined .mdc-floating-label--float-above {
  transform: translateY(-37.25px) scale(1);
  font-size: 0.75rem;
}
.mdc-notched-outline .mdc-floating-label--float-above {
  text-overflow: clip;
}
.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: 133.3333333333%;
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  transform: translateY(-34.75px) scale(0.75);
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: 1rem;
}

.mdc-floating-label--%NS%required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 1px;
  margin-right: 0;
  content: "*";
}
[dir=rtl] .mdc-floating-label--%NS%required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 0;
  margin-right: 1px;
}

.mdc-notched-outline {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 100%;
  text-align: left;
  pointer-events: none;
}
[dir=rtl] .mdc-notched-outline {
  text-align: right;
}
.mdc-text-field--outlined .mdc-notched-outline {
  z-index: 1;
}

.mat-mdc-notch-piece {
  box-sizing: border-box;
  height: 100%;
  pointer-events: none;
  border: none;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
.mdc-text-field--focused .mat-mdc-notch-piece {
  border-width: 2px;
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-outline-color, var(--%NS%mat-sys-outline));
  border-width: var(--%NS%mat-form-field-outlined-outline-width, 1px);
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-hover-outline-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-focus-outline-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-outline-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-hover-outline-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-focus-outline-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece {
  border-width: var(--%NS%mat-form-field-outlined-focus-outline-width, 2px);
}

.mdc-notched-outline__leading {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
  width: max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
}
[dir=rtl] .mdc-notched-outline__leading {
  border-left: none;
  border-right: 1px solid;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-top-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}

.mdc-notched-outline__trailing {
  flex-grow: 1;
  border-left: none;
  border-right: 1px solid;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
[dir=rtl] .mdc-notched-outline__trailing {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}

.mdc-notched-outline__notch {
  flex: 0 0 auto;
  width: auto;
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch {
  max-width: min(var(--%NS%mat-form-field-notch-max-width, 100%), calc(100% - max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  max-width: min(100%, calc(100% - max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 1px;
}
.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 2px;
}
.mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 0;
  padding-right: 8px;
  border-top: none;
}
[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 8px;
  padding-right: 0;
}
.mdc-notched-outline--no-label .mdc-notched-outline__notch {
  display: none;
}

.mdc-line-ripple::before, .mdc-line-ripple::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom-style: solid;
  content: "";
}
.mdc-line-ripple::before {
  z-index: 1;
  border-bottom-width: var(--%NS%mat-form-field-filled-active-indicator-height, 1px);
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-active-indicator-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-hover-active-indicator-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-active-indicator-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-hover-active-indicator-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-line-ripple::after {
  transform: scaleX(0);
  opacity: 0;
  z-index: 2;
}
.mdc-text-field--filled .mdc-line-ripple::after {
  border-bottom-width: var(--%NS%mat-form-field-filled-focus-active-indicator-height, 2px);
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--%NS%mat-form-field-filled-focus-active-indicator-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--filled.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-focus-active-indicator-color, var(--%NS%mat-sys-error));
}

.mdc-line-ripple--%NS%active::after {
  transform: scaleX(1);
  opacity: 1;
}

.mdc-line-ripple--%NS%deactivating::after {
  opacity: 0;
}

.mdc-text-field--disabled {
  pointer-events: none;
}

.mat-mdc-form-field-textarea-control {
  vertical-align: middle;
  resize: vertical;
  box-sizing: border-box;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  overflow: auto;
}

.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font: inherit;
  letter-spacing: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  border: none;
}

.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  line-height: normal;
  pointer-events: all;
  will-change: auto;
}

.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label {
  cursor: inherit;
}

.mdc-text-field--%NS%no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,
.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control {
  height: auto;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color] {
  height: 23px;
}

.mat-mdc-text-field-wrapper {
  height: auto;
  flex: auto;
  will-change: auto;
}

.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-left: 0;
  --%NS%mat-mdc-form-field-label-offset-x: -16px;
}

.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

[dir=rtl] .mat-mdc-text-field-wrapper {
  padding-left: 16px;
  padding-right: 16px;
}
[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-left: 0;
}
[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

.mat-form-field-disabled .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
  opacity: 1;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label {
  left: auto;
  right: auto;
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input {
  display: inline-block;
}

.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch {
  padding-top: 0;
}

.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: 1px solid transparent;
}

[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: none;
  border-right: 1px solid transparent;
}

.mat-mdc-form-field-infix {
  min-height: var(--%NS%mat-form-field-container-height, 56px);
  padding-top: var(--%NS%mat-form-field-filled-with-label-container-padding-top, 24px);
  padding-bottom: var(--%NS%mat-form-field-filled-with-label-container-padding-bottom, 8px);
}
.mdc-text-field--outlined .mat-mdc-form-field-infix, .mdc-text-field--no-label .mat-mdc-form-field-infix {
  padding-top: var(--%NS%mat-form-field-container-vertical-padding, 16px);
  padding-bottom: var(--%NS%mat-form-field-container-vertical-padding, 16px);
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {
  top: calc(var(--%NS%mat-form-field-container-height, 56px) / 2);
}

.mdc-text-field--filled .mat-mdc-floating-label {
  display: var(--%NS%mat-form-field-filled-label-display, block);
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  --%NS%mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--%NS%mat-form-field-container-height, 56px) / 2) * -1))
    scale(var(--%NS%mat-mdc-form-field-floating-label-scale, 0.75));
  transform: var(--%NS%mat-mdc-form-field-label-transform);
}

@keyframes _mat-form-field-subscript-animation {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.mat-mdc-form-field-subscript-wrapper {
  box-sizing: border-box;
  width: 100%;
  position: relative;
}

.mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-error-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 16px;
  opacity: 1;
  transform: translateY(0);
  animation: _mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2);
}

.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper {
  position: static;
}

.mat-mdc-form-field-bottom-align::before {
  content: "";
  display: inline-block;
  height: 16px;
}

.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before {
  content: unset;
}

.mat-mdc-form-field-hint-end {
  order: 1;
}

.mat-mdc-form-field-hint-wrapper {
  display: flex;
}

.mat-mdc-form-field-hint-spacer {
  flex: 1 0 1em;
}

.mat-mdc-form-field-error {
  display: block;
  color: var(--%NS%mat-form-field-error-text-color, var(--%NS%mat-sys-error));
}

.mat-mdc-form-field-subscript-wrapper,
.mat-mdc-form-field-bottom-align::before {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--%NS%mat-form-field-subscript-text-font, var(--%NS%mat-sys-body-small-font));
  line-height: var(--%NS%mat-form-field-subscript-text-line-height, var(--%NS%mat-sys-body-small-line-height));
  font-size: var(--%NS%mat-form-field-subscript-text-size, var(--%NS%mat-sys-body-small-size));
  letter-spacing: var(--%NS%mat-form-field-subscript-text-tracking, var(--%NS%mat-sys-body-small-tracking));
  font-weight: var(--%NS%mat-form-field-subscript-text-weight, var(--%NS%mat-sys-body-small-weight));
}

.mat-mdc-form-field-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  background-color: var(--%NS%mat-form-field-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay {
  opacity: var(--%NS%mat-form-field-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay {
  opacity: var(--%NS%mat-form-field-focus-state-layer-opacity, 0);
}

select.mat-mdc-form-field-input-control {
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: transparent;
  display: inline-flex;
  box-sizing: border-box;
}
select.mat-mdc-form-field-input-control:not(:disabled) {
  cursor: pointer;
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option {
  color: var(--%NS%mat-form-field-select-option-text-color, var(--%NS%mat-sys-neutral10));
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled {
  color: var(--%NS%mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--%NS%mat-sys-neutral10) 38%, transparent));
}

.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -2.5px;
  pointer-events: none;
  color: var(--%NS%mat-form-field-enabled-select-arrow-color, var(--%NS%mat-sys-on-surface-variant));
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  right: auto;
  left: 0;
}
.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-form-field-focus-select-arrow-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 15px;
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 0;
  padding-left: 15px;
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill .mat-mdc-text-field-wrapper {
    outline: solid 1px;
  }
}
@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper {
    outline-color: GrayText;
  }
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper {
    outline: dashed 3px;
  }
}

@media (forced-colors: active) {
  .mat-mdc-form-field.mat-focused .mdc-notched-outline {
    border: dashed 3px;
  }
}

.mat-mdc-form-field-input-control[type=date], .mat-mdc-form-field-input-control[type=datetime], .mat-mdc-form-field-input-control[type=datetime-local], .mat-mdc-form-field-input-control[type=month], .mat-mdc-form-field-input-control[type=week], .mat-mdc-form-field-input-control[type=time] {
  line-height: 1;
}
.mat-mdc-form-field-input-control::-webkit-datetime-edit {
  line-height: 1;
  padding: 0;
  margin-bottom: -2px;
}

.mat-mdc-form-field {
  --%NS%mat-mdc-form-field-floating-label-scale: 0.75;
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--%NS%mat-form-field-container-text-font, var(--%NS%mat-sys-body-large-font));
  line-height: var(--%NS%mat-form-field-container-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  font-size: var(--%NS%mat-form-field-container-text-size, var(--%NS%mat-sys-body-large-size));
  letter-spacing: var(--%NS%mat-form-field-container-text-tracking, var(--%NS%mat-sys-body-large-tracking));
  font-weight: var(--%NS%mat-form-field-container-text-weight, var(--%NS%mat-sys-body-large-weight));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above {
  font-size: calc(var(--%NS%mat-form-field-outlined-label-text-populated-size) * var(--%NS%mat-mdc-form-field-floating-label-scale));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: var(--%NS%mat-form-field-outlined-label-text-populated-size);
}
[dir=rtl] .mat-mdc-form-field {
  text-align: right;
}

.mat-mdc-form-field-flex {
  display: inline-flex;
  align-items: baseline;
  box-sizing: border-box;
  width: 100%;
}

.mat-mdc-text-field-wrapper {
  width: 100%;
  z-index: 0;
}

.mat-mdc-form-field-icon-prefix,
.mat-mdc-form-field-icon-suffix {
  align-self: center;
  line-height: 0;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}
.mat-mdc-form-field-icon-prefix > .mat-icon,
.mat-mdc-form-field-icon-suffix > .mat-icon {
  padding: 0 12px;
  box-sizing: content-box;
}

.mat-mdc-form-field-icon-prefix {
  color: var(--%NS%mat-form-field-leading-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-prefix {
  color: var(--%NS%mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-trailing-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-invalid .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-trailing-icon-color, var(--%NS%mat-sys-error));
}
.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-hover-trailing-icon-color, var(--%NS%mat-sys-on-error-container));
}
.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-focus-trailing-icon-color, var(--%NS%mat-sys-error));
}

.mat-mdc-form-field-icon-prefix,
[dir=rtl] .mat-mdc-form-field-icon-suffix {
  padding: 0 4px 0 0;
}

.mat-mdc-form-field-icon-suffix,
[dir=rtl] .mat-mdc-form-field-icon-prefix {
  padding: 0 0 0 4px;
}

.mat-mdc-form-field-subscript-wrapper .mat-icon,
.mat-mdc-form-field label .mat-icon {
  width: 1em;
  height: 1em;
  font-size: inherit;
}

.mat-mdc-form-field-infix {
  flex: auto;
  min-width: 0;
  width: 180px;
  position: relative;
  box-sizing: border-box;
}
.mat-mdc-form-field-infix:has(textarea[cols]) {
  width: auto;
}

.mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: -1px;
  -webkit-clip-path: inset(-9em -999em -9em 1px);
  clip-path: inset(-9em -999em -9em 1px);
}
[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: 0;
  margin-right: -1px;
  -webkit-clip-path: inset(-9em 1px -9em -999em);
  clip-path: inset(-9em 1px -9em -999em);
}

.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input {
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--%NS%filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before {
  transition-duration: 75ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after {
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper {
  animation-duration: 300ms;
}

.mdc-notched-outline .mdc-floating-label {
  max-width: calc(100% + 1px);
}

.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: calc(133.3333333333% + 1px);
}
`],encapsulation:2})}return n})();var bv=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[ts,ex,we]})}return n})();var sx=(()=>{class n{_renderer;_elementRef;onChange=e=>{};onTouched=()=>{};constructor(e,i){this._renderer=e,this._elementRef=i}setProperty(e,i){this._renderer.setProperty(this._elementRef.nativeElement,e,i)}registerOnTouched(e){this.onTouched=e}registerOnChange(e){this.onChange=e}setDisabledState(e){this.setProperty(`disabled`,e)}static ɵfac=function(i){return new(i||n)(ne(ge),ne(N))};static ɵdir=D({type:n})}return n})();var TL=(()=>{class n extends sx{static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵdir=D({type:n,features:[ae]})}return n})();var ff=new g(``);var AL={provide:ff,useExisting:Bt(()=>ax),multi:!0};function RL(){let n=Gt()?Gt().getUserAgent():``;return/android (\d+)/.test(n.toLowerCase())}var kL=new g(``);var ax=(()=>{class n extends sx{_compositionMode;_composing=!1;constructor(e,i,r){super(e,i),this._compositionMode=r,this._compositionMode??=!RL()}writeValue(e){let i=e??``;this.setProperty(`value`,i)}_handleInput(e){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(e)}_compositionStart(){this._composing=!0}_compositionEnd(e){this._composing=!1,this._compositionMode&&this.onChange(e)}static ɵfac=function(i){return new(i||n)(ne(ge),ne(N),ne(kL,8))};static ɵdir=D({type:n,selectors:[[`input`,`formControlName`,``,3,`type`,`checkbox`,3,`ngNoCva`,``],[`textarea`,`formControlName`,``,3,`ngNoCva`,``],[`input`,`formControl`,``,3,`type`,`checkbox`,3,`ngNoCva`,``],[`textarea`,`formControl`,``,3,`ngNoCva`,``],[`input`,`ngModel`,``,3,`type`,`checkbox`,3,`ngNoCva`,``],[`textarea`,`ngModel`,``,3,`ngNoCva`,``],[``,`ngDefaultControl`,``]],hostBindings:function(i,r){i&1&&Fe(`input`,function(s){return r._handleInput(s.target.value)})(`blur`,function(){return r.onTouched()})(`compositionstart`,function(){return r._compositionStart()})(`compositionend`,function(s){return r._compositionEnd(s.target.value)})},standalone:!1,features:[Le([AL]),ae]})}return n})();function Cv(n){return n==null||Dv(n)===0}function Dv(n){return n==null?null:Array.isArray(n)||typeof n==`string`?n.length:n instanceof Set?n.size:null}var Ss=new g(``);var Ev=new g(``);var OL=/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;var Li=class{static min(t){return PL(t)}static max(t){return FL(t)}static required(t){return cx(t)}static requiredTrue(t){return LL(t)}static email(t){return jL(t)}static minLength(t){return VL(t)}static maxLength(t){return BL(t)}static pattern(t){return UL(t)}static nullValidator(t){return nf()}static compose(t){return mx(t)}static composeAsync(t){return px(t)}};function PL(n){return t=>{if(t.value==null||n==null)return null;let e=parseFloat(t.value);return!isNaN(e)&&e<n?{min:{min:n,actual:t.value}}:null}}function FL(n){return t=>{if(t.value==null||n==null)return null;let e=parseFloat(t.value);return!isNaN(e)&&e>n?{max:{max:n,actual:t.value}}:null}}function cx(n){return Cv(n.value)?{required:!0}:null}function LL(n){return n.value===!0?null:{required:!0}}function jL(n){return Cv(n.value)||OL.test(n.value)?null:{email:!0}}function VL(n){return t=>{let e=t.value?.length??Dv(t.value);return e===null||e===0?null:e<n?{minlength:{requiredLength:n,actualLength:e}}:null}}function BL(n){return t=>{let e=t.value?.length??Dv(t.value);return e!==null&&e>n?{maxlength:{requiredLength:n,actualLength:e}}:null}}function UL(n){if(!n)return nf;let t,e;return typeof n==`string`?(e=``,n.charAt(0)!==`^`&&(e+=`^`),e+=n,n.charAt(n.length-1)!==`$`&&(e+=`$`),t=new RegExp(e)):(e=n.toString(),t=n),i=>{if(Cv(i.value))return null;let r=i.value;return t.test(r)?null:{pattern:{requiredPattern:e,actualValue:r}}}}function nf(n){return null}function lx(n){return n!=null}function dx(n){return Xn(n)?Ee(n):n}function ux(n){let t={};return n.forEach(e=>{t=e!=null?p(p({},t),e):t}),Object.keys(t).length===0?null:t}function fx(n,t){return t.map(e=>e(n))}function HL(n){return!n.validate}function hx(n){return n.map(t=>HL(t)?t:e=>t.validate(e))}function mx(n){if(!n)return null;let t=n.filter(lx);return t.length==0?null:function(e){return ux(fx(e,t))}}function xv(n){return n!=null?mx(hx(n)):null}function px(n){if(!n)return null;let t=n.filter(lx);return t.length==0?null:function(e){return Fs(fx(e,t).map(dx)).pipe(H(ux))}}function Iv(n){return n!=null?px(hx(n)):null}function tx(n,t){return n===null?[t]:Array.isArray(n)?[...n,t]:[n,t]}function gx(n){return n._rawValidators}function vx(n){return n._rawAsyncValidators}function Sv(n){return n?Array.isArray(n)?n:[n]:[]}function rf(n,t){return Array.isArray(n)?n.includes(t):n===t}function nx(n,t){let e=Sv(t);return Sv(n).forEach(r=>{rf(e,r)||e.push(r)}),e}function ix(n,t){return Sv(t).filter(e=>!rf(n,e))}var of=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(t){this._rawValidators=t||[],this._composedValidatorFn=xv(this._rawValidators)}_setAsyncValidators(t){this._rawAsyncValidators=t||[],this._composedAsyncValidatorFn=Iv(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(t){this._onDestroyCallbacks.push(t)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(t=>t()),this._onDestroyCallbacks=[]}reset(t=void 0){this.control?.reset(t)}hasError(t,e){return this.control?this.control.hasError(t,e):!1}getError(t,e){return this.control?this.control.getError(t,e):null}};var Zr=class extends of{name;get formDirective(){return null}get path(){return null}};var vc=`VALID`;var tf=`INVALID`;var vs=`PENDING`;var yc=`DISABLED`;var ji=class{};var sf=class extends ji{value;source;constructor(t,e){super(),this.value=t,this.source=e}};var bc=class extends ji{pristine;source;constructor(t,e){super(),this.pristine=t,this.source=e}};var Sc=class extends ji{touched;source;constructor(t,e){super(),this.touched=t,this.source=e}};var ys=class extends ji{status;source;constructor(t,e){super(),this.status=t,this.source=e}};var af=class extends ji{source;constructor(t){super(),this.source=t}};var _s=class extends ji{source;constructor(t){super(),this.source=t}};function yx(n){return(hf(n)?n.validators:n)||null}function zL(n){return Array.isArray(n)?xv(n):n||null}function _x(n,t){return(hf(t)?t.asyncValidators:n)||null}function $L(n){return Array.isArray(n)?Iv(n):n||null}function hf(n){return n!=null&&!Array.isArray(n)&&typeof n==`object`}function WL(n,t,e){let i=n.controls;if(!(t?Object.keys(i):i).length)throw new _(1e3,``);if(!bx(i,e))throw new _(1001,``)}function GL(n,t,e){n._forEachChild((i,r)=>{if(e[r]===void 0)throw new _(-1002,``)})}var bs=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_hasRequired=C(!1);_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(t,e){this._assignValidators(t),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(t){this._rawValidators=this._composedValidatorFn=t,this._updateHasRequiredValidator()}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(t){this._rawAsyncValidators=this._composedAsyncValidatorFn=t}get parent(){return this._parent}get status(){return E(this.statusReactive)}set status(t){E(()=>this.statusReactive.set(t))}_status=x(()=>this.statusReactive());statusReactive=C(void 0);get valid(){return this.status===vc}get invalid(){return this.status===tf}get pending(){return this.status===vs}get disabled(){return this.status===yc}get enabled(){return this.status!==yc}errors;get pristine(){return E(this.pristineReactive)}set pristine(t){E(()=>this.pristineReactive.set(t))}_pristine=x(()=>this.pristineReactive());pristineReactive=C(!0);get dirty(){return!this.pristine}get touched(){return E(this.touchedReactive)}set touched(t){E(()=>this.touchedReactive.set(t))}_touched=x(()=>this.touchedReactive());touchedReactive=C(!1);get untouched(){return!this.touched}_events=new w;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:`change`}setValidators(t){this._assignValidators(t)}setAsyncValidators(t){this._assignAsyncValidators(t)}addValidators(t){this.setValidators(nx(t,this._rawValidators))}addAsyncValidators(t){this.setAsyncValidators(nx(t,this._rawAsyncValidators))}removeValidators(t){this.setValidators(ix(t,this._rawValidators))}removeAsyncValidators(t){this.setAsyncValidators(ix(t,this._rawAsyncValidators))}hasValidator(t){return rf(this._rawValidators,t)}hasAsyncValidator(t){return rf(this._rawAsyncValidators,t)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(t={}){let e=this.touched===!1;this.touched=!0;let i=t.sourceControl??this;t.onlySelf||this._parent?.markAsTouched(S(p({},t),{sourceControl:i})),e&&t.emitEvent!==!1&&this._events.next(new Sc(!0,i))}markAllAsDirty(t={}){this.markAsDirty({onlySelf:!0,emitEvent:t.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsDirty(t))}markAllAsTouched(t={}){this.markAsTouched({onlySelf:!0,emitEvent:t.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(t))}markAsUntouched(t={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=t.sourceControl??this;this._forEachChild(r=>{r.markAsUntouched({onlySelf:!0,emitEvent:t.emitEvent,sourceControl:i})}),t.onlySelf||this._parent?._updateTouched(t,i),e&&t.emitEvent!==!1&&this._events.next(new Sc(!1,i))}markAsDirty(t={}){let e=this.pristine===!0;this.pristine=!1;let i=t.sourceControl??this;t.onlySelf||this._parent?.markAsDirty(S(p({},t),{sourceControl:i})),e&&t.emitEvent!==!1&&this._events.next(new bc(!1,i))}markAsPristine(t={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=t.sourceControl??this;this._forEachChild(r=>{r.markAsPristine({onlySelf:!0,emitEvent:t.emitEvent})}),t.onlySelf||this._parent?._updatePristine(t,i),e&&t.emitEvent!==!1&&this._events.next(new bc(!0,i))}markAsPending(t={}){this.status=vs;let e=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new ys(this.status,e)),this.statusChanges.emit(this.status)),t.onlySelf||this._parent?.markAsPending(S(p({},t),{sourceControl:e}))}disable(t={}){let e=this._parentMarkedDirty(t.onlySelf);this.status=yc,this.errors=null,this._forEachChild(r=>{r.disable(S(p({},t),{onlySelf:!0}))}),this._updateValue();let i=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new sf(this.value,i)),this._events.next(new ys(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(S(p({},t),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(r=>r(!0))}enable(t={}){let e=this._parentMarkedDirty(t.onlySelf);this.status=vc,this._forEachChild(i=>{i.enable(S(p({},t),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:t.emitEvent}),this._updateAncestors(S(p({},t),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(t,e){t.onlySelf||(this._parent?.updateValueAndValidity(t),t.skipPristineCheck||this._parent?._updatePristine({},e),this._parent?._updateTouched({},e))}setParent(t){this._parent=t}getRawValue(){return this.value}updateValueAndValidity(t={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===vc||this.status===vs)&&this._runAsyncValidator(i,t.emitEvent)}let e=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new sf(this.value,e)),this._events.next(new ys(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),t.onlySelf||this._parent?.updateValueAndValidity(S(p({},t),{sourceControl:e}))}_updateTreeValidity(t={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(t)),this.updateValueAndValidity({onlySelf:!0,emitEvent:t.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?yc:vc}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(t,e){if(this.asyncValidator){this.status=vs,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1,shouldHaveEmitted:t!==!1};let i=dx(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(r=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(r,{emitEvent:e,shouldHaveEmitted:t})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let t=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,t}return!1}setErrors(t,e={}){this.errors=t,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(t){let e=t;return e==null||(Array.isArray(e)||(e=e.split(`.`)),e.length===0)?null:e.reduce((i,r)=>i&&i._find(r),this)}getError(t,e){let i=e?this.get(e):this;return i?.errors?i.errors[t]:null}hasError(t,e){return!!this.getError(t,e)}get root(){let t=this;for(;t._parent;)t=t._parent;return t}_updateControlsErrors(t,e,i){this.status=this._calculateStatus(),t&&this.statusChanges.emit(this.status),(t||i)&&this._events.next(new ys(this.status,e)),this._parent&&this._parent._updateControlsErrors(t,e,i)}_initObservables(){this.valueChanges=new z,this.statusChanges=new z}_calculateStatus(){return this._allControlsDisabled()?yc:this.errors?tf:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(vs)?vs:this._anyControlsHaveStatus(tf)?tf:vc}_anyControlsHaveStatus(t){return this._anyControls(e=>e.status===t)}_anyControlsDirty(){return this._anyControls(t=>t.dirty)}_anyControlsTouched(){return this._anyControls(t=>t.touched)}_updatePristine(t,e){let i=!this._anyControlsDirty(),r=this.pristine!==i;this.pristine=i,t.onlySelf||this._parent?._updatePristine(t,e),r&&this._events.next(new bc(this.pristine,e))}_updateTouched(t={},e){this.touched=this._anyControlsTouched(),this._events.next(new Sc(this.touched,e)),t.onlySelf||this._parent?._updateTouched(t,e)}_onDisabledChange=[];_registerOnCollectionChange(t){this._onCollectionChange=t}_setUpdateStrategy(t){hf(t)&&t.updateOn!=null&&(this._updateOn=t.updateOn)}_parentMarkedDirty(t){return!t&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(t){return null}_assignValidators(t){this._rawValidators=Array.isArray(t)?t.slice():t,this._composedValidatorFn=zL(this._rawValidators),this._updateHasRequiredValidator()}_assignAsyncValidators(t){this._rawAsyncValidators=Array.isArray(t)?t.slice():t,this._composedAsyncValidatorFn=$L(this._rawAsyncValidators)}_updateHasRequiredValidator(){E(()=>this._hasRequired.set(this.hasValidator(Li.required)))}};function bx(n,t){return Object.hasOwn(n,t)}function Nv(n){return n.tagName===`INPUT`||n.tagName===`SELECT`||n.tagName===`TEXTAREA`}function Sx(n){if(n.tagName!==`INPUT`)return!1;let t=n.type;return t===`number`||t===`range`||t===`date`||t===`month`}function wx(n){return n.tagName===`INPUT`||n.tagName===`TEXTAREA`}function Cc(n,t,e,i){switch(e){case`name`:n.setAttribute(t,e,i);break;case`disabled`:case`readonly`:case`required`:i?n.setAttribute(t,e,``):n.removeAttribute(t,e);break;case`max`:case`min`:case`minLength`:case`maxLength`:i!==void 0?n.setAttribute(t,e,i.toString()):n.removeAttribute(t,e);break}}var wv=class{kind;context;control;message;constructor({kind:t,context:e,control:i}){this.kind=t,this.context=e,this.control=i}};var qL=(()=>{class n{_validator=nf;_onChange;_enabled;ngOnChanges(e){if(this.inputName in e){let i=this.normalizeInput(e[this.inputName].currentValue);this._enabled=this.enabled(i),this._validator=this._enabled?this.createValidator(i):nf,this._onChange?.()}}validate(e){return this._validator(e)}registerOnValidatorChange(e){this._onChange=e}enabled(e){return e!=null}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,features:[Be]})}return n})();var YL={provide:Ss,useExisting:Bt(()=>Cx),multi:!0};var Cx=(()=>{class n extends qL{required;inputName=`required`;normalizeInput=te;createValidator=e=>cx;enabled(e){return e}static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵdir=D({type:n,selectors:[[``,`required`,``,`formControlName`,``,3,`type`,`checkbox`],[``,`required`,``,`formControl`,``,3,`type`,`checkbox`],[``,`required`,``,`ngModel`,``,3,`type`,`checkbox`]],hostVars:1,hostBindings:function(i,r){i&2&&ie(`required`,r._enabled?``:null)},inputs:{required:`required`},standalone:!1,features:[Le([YL]),ae]})}return n})();var Mv=new g(``);var mf=new g(``,{factory:()=>Tv});var Tv=`always`;function ZL(n,t,e=Tv){Av(n,t),t.valueAccessor.writeValue(n.value),(n.disabled||e===`always`)&&t.valueAccessor.setDisabledState?.(n.disabled),QL(n,t),JL(n,t),XL(n,t),KL(n,t)}function cf(n,t,e=!0){let i=()=>{};t?.valueAccessor?.registerOnChange(i),t?.valueAccessor?.registerOnTouched(i),df(n,t),n&&(t._invokeOnDestroyCallbacks(),n._registerOnCollectionChange(()=>{}))}function lf(n,t){n.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(t)})}function KL(n,t){if(t.valueAccessor.setDisabledState){let e=i=>{t.valueAccessor.setDisabledState(i)};n.registerOnDisabledChange(e),t._registerOnDestroy(()=>{n._unregisterOnDisabledChange(e)})}}function Av(n,t){let e=gx(n);t.validator!==null?n.setValidators(tx(e,t.validator)):typeof e==`function`&&n.setValidators([e]);let i=vx(n);t.asyncValidator!==null?n.setAsyncValidators(tx(i,t.asyncValidator)):typeof i==`function`&&n.setAsyncValidators([i]);let r=()=>n.updateValueAndValidity();lf(t._rawValidators,r),lf(t._rawAsyncValidators,r)}function df(n,t){let e=!1;if(n!==null){if(t.validator!==null){let r=gx(n);if(Array.isArray(r)&&r.length>0){let o=r.filter(s=>s!==t.validator);o.length!==r.length&&(e=!0,n.setValidators(o))}}if(t.asyncValidator!==null){let r=vx(n);if(Array.isArray(r)&&r.length>0){let o=r.filter(s=>s!==t.asyncValidator);o.length!==r.length&&(e=!0,n.setAsyncValidators(o))}}}let i=()=>{};return lf(t._rawValidators,i),lf(t._rawAsyncValidators,i),e}function QL(n,t){t.valueAccessor.registerOnChange(e=>{n._pendingValue=e,n._pendingChange=!0,n._pendingDirty=!0,n.updateOn===`change`&&Dx(n,t)})}function XL(n,t){t.valueAccessor.registerOnTouched(()=>{n._pendingTouched=!0,n.updateOn===`blur`&&n._pendingChange&&Dx(n,t),n.updateOn!==`submit`&&n.markAsTouched()})}function Dx(n,t){n._pendingDirty&&n.markAsDirty(),n.setValue(n._pendingValue,{emitModelToViewChange:!1}),t.viewToModelUpdate(n._pendingValue),n._pendingChange=!1}function JL(n,t){let e=(i,r)=>{t.valueAccessor.writeValue(i),r&&t.viewToModelUpdate(i)};n.registerOnChange(e),t._registerOnDestroy(()=>{n._unregisterOnChange(e)})}function Ex(n,t){Av(n,t)}function e1(n,t){return df(n,t)}function t1(n,t){if(!Object.hasOwn(n,`model`))return!1;let e=n.model;return e.isFirstChange()?!0:!Object.is(t,e.currentValue)}function n1(n){return Object.getPrototypeOf(n.constructor)===TL}function xx(n,t){n._syncPendingControls(),t.forEach(e=>{let i=e.control;i.updateOn===`submit`&&i._pendingChange&&(e.viewToModelUpdate(i._pendingValue),i._pendingChange=!1)})}function Rv(n,t){if(!t)return null;let e,i,r;return t.forEach(o=>{o.constructor===ax?e=o:n1(o)?i=o:r=o}),r||i||e||null}function i1(n,t){let e=n.indexOf(t);e>-1&&n.splice(e,1)}var r1={provide:Mv,useFactory:()=>{let n=u(Fn,{self:!0});return{setParseErrors:t=>{n.setParseErrorSource(t)},set onReset(t){n.onReset=t}}}};var Fn=class extends of{_parent=null;name=null;valueAccessor=null;isCustomControlBased=!1;userOnReset;resetSubscription;set onReset(t){this.userOnReset=t,this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.control&&(this.resetSubscription=this.control.events.subscribe(e=>{e instanceof _s&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription?.add(this.resetSubscription))}isNativeFormElement=!1;rawValueAccessors;_selectedValueAccessor=null;get selectedValueAccessor(){return this._selectedValueAccessor??=Rv(this,this.rawValueAccessors)}parseErrorsValidator=null;renderer;injector;requiredValidatorViaDi;subscription;customControlBindings=null;constructor(t,e,i){super(),this.injector=t,this.renderer=e,this.rawValueAccessors=i,this.injector?.get(ke)?.onDestroy(()=>{this.removeParseErrorsValidator(this.control),this.subscription?.unsubscribe()})}setupCustomControl(){this.subscription?.unsubscribe();let t=this.injector?.get(Qe);if(!this.control||!t)return;let e=t.markForCheck.bind(t);this.subscription=new Q,this.subscription.add(this.control.valueChanges.subscribe(e)),this.subscription.add(this.control.statusChanges.subscribe(e)),this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.userOnReset&&(this.resetSubscription=this.control.events.subscribe(i=>{i instanceof _s&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription.add(this.resetSubscription)),this.parseErrorsValidator&&this.control.addValidators(this.parseErrorsValidator)}ngControlCreate(t){!t.nativeElement.hasAttribute?.(`ngNoCva`)&&(this.rawValueAccessors&&this.rawValueAccessors.length>0||this.valueAccessor!==null)||!t.customControl||(this.isCustomControlBased=!0,t.listenToCustomControlModel(r=>{this.control?.setValue(r,{emitModelToViewChange:!1}),this.control?.markAsDirty(),this.viewToModelUpdate(r)}),t.listenToCustomControlOutput(`touch`,()=>{this.control?.markAsTouched()}),this.customControlBindings={},this.isNativeFormElement=Nv(t.nativeElement),this.requiredValidatorViaDi=this._rawValidators.find(r=>r instanceof Cx))}ngControlUpdate(t,e){if(!this.isCustomControlBased)return;let i=this.control,r=this.customControlBindings;Object.is(r.value,i.value)||(r.value=i.value,t.setCustomControlModelInput(i.value)),this.bindControlProperty(t,r,`touched`,i.touched),this.bindControlProperty(t,r,`dirty`,i.dirty),this.bindControlProperty(t,r,`valid`,i.valid),this.bindControlProperty(t,r,`invalid`,i.invalid),this.bindControlProperty(t,r,`pending`,i.pending),this.bindControlProperty(t,r,`disabled`,i.disabled),this.shouldBindRequired&&this.bindControlProperty(t,r,`required`,this.isRequired);let o=i.errors;if(r.errors!==o){r.errors=o;let s=this._convertErrors(o);t.setInputOnDirectives(`errors`,s)}}get isRequired(){return(this.requiredValidatorViaDi?._enabled||this.control?._hasRequired())??!1}get shouldBindRequired(){return!0}bindControlProperty(t,e,i,r){if(e[i]===r)return;e[i]=r;let o=t.setInputOnDirectives(i,r);this.isNativeFormElement&&!o&&(i===`disabled`||i===`required`)&&this.renderer&&Cc(this.renderer,t.nativeElement,i,r)}_convertErrors(t){if(t===null)return[];let e=this.control;return Object.entries(t).map(([i,r])=>new wv({context:r,kind:i,control:e}))}setParseErrorSource(t){if(t===void 0)return;let e=null,i=x(()=>{let r=t();return r.length===0?null:r.reduce((o,s)=>(o[s.kind]=s,o),{})});this.parseErrorsValidator=(()=>e).bind(this),dt(()=>{e=i(),this.control?.updateValueAndValidity({emitEvent:!1})},{injector:this.injector})}removeParseErrorsValidator(t){this.parseErrorsValidator&&(t?.removeValidators(this.parseErrorsValidator),t?.updateValueAndValidity({emitEvent:!1}))}};var uf=class{_cd;constructor(t){this._cd=t}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}};var _ie=(()=>{class n extends uf{constructor(e){super(e)}static ɵfac=function(i){return new(i||n)(ne(Fn,2))};static ɵdir=D({type:n,selectors:[[``,`formControlName`,``],[``,`ngModel`,``],[``,`formControl`,``]],hostVars:14,hostBindings:function(i,r){i&2&&J(`ng-untouched`,r.isUntouched)(`ng-touched`,r.isTouched)(`ng-pristine`,r.isPristine)(`ng-dirty`,r.isDirty)(`ng-valid`,r.isValid)(`ng-invalid`,r.isInvalid)(`ng-pending`,r.isPending)},standalone:!1,features:[ae]})}return n})();var bie=(()=>{class n extends uf{constructor(e){super(e)}static ɵfac=function(i){return new(i||n)(ne(Zr,10))};static ɵdir=D({type:n,selectors:[[``,`formGroupName`,``],[``,`formArrayName`,``],[``,`ngModelGroup`,``],[``,`formGroup`,``],[``,`formArray`,``],[`form`,3,`ngNoForm`,``],[``,`ngForm`,``]],hostVars:16,hostBindings:function(i,r){i&2&&J(`ng-untouched`,r.isUntouched)(`ng-touched`,r.isTouched)(`ng-pristine`,r.isPristine)(`ng-dirty`,r.isDirty)(`ng-valid`,r.isValid)(`ng-invalid`,r.isInvalid)(`ng-pending`,r.isPending)(`ng-submitted`,r.isSubmitted)},standalone:!1,features:[ae]})}return n})();var wc=class extends bs{constructor(t,e,i){super(yx(e),_x(i,e)),this.controls=t,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;registerControl(t,e){return this._find(t)||(this.controls[t]=e,e.setParent(this),e._registerOnCollectionChange(this._onCollectionChange),e)}addControl(t,e,i={}){this.registerControl(t,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}removeControl(t,e={}){let i=this._find(t);i&&i._registerOnCollectionChange(()=>{}),delete this.controls[t],this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}setControl(t,e,i={}){let r=this._find(t);r&&r._registerOnCollectionChange(()=>{}),delete this.controls[t],e&&this.registerControl(t,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}contains(t){return this._find(t)?.enabled===!0}setValue(t,e={}){E(()=>{GL(this,!0,t),Object.keys(t).forEach(i=>{WL(this,!0,i),this.controls[i].setValue(t[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)})}patchValue(t,e={}){t!=null&&(Object.keys(t).forEach(i=>{let r=this._find(i);r&&r.patchValue(t[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(t={},e={}){this._forEachChild((i,r)=>{i.reset(t?t[r]:null,S(p({},e),{onlySelf:!0}))}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e),e?.emitEvent!==!1&&this._events.next(new _s(this))}getRawValue(){return this._reduceChildren({},(t,e,i)=>(t[i]=e.getRawValue(),t))}_syncPendingControls(){let t=this._reduceChildren(!1,(e,i)=>i._syncPendingControls()?!0:e);return t&&this.updateValueAndValidity({onlySelf:!0}),t}_forEachChild(t){Object.keys(this.controls).forEach(e=>{let i=this.controls[e];i&&t(i,e)})}_setUpControls(){this._forEachChild(t=>{t.setParent(this),t._registerOnCollectionChange(this._onCollectionChange)})}_updateValue(){this.value=this._reduceValue()}_anyControls(t){for(let[e,i]of Object.entries(this.controls))if(this.contains(e)&&t(i))return!0;return!1}_reduceValue(){return this._reduceChildren({},(e,i,r)=>((i.enabled||this.disabled)&&(e[r]=i.value),e))}_reduceChildren(t,e){let i=t;return this._forEachChild((r,o)=>{i=e(i,r,o)}),i}_allControlsDisabled(){for(let t of Object.keys(this.controls))if(this.controls[t].enabled)return!1;return Object.keys(this.controls).length>0||this.disabled}_find(t){return bx(this.controls,t)?this.controls[t]:null}};var o1={provide:Zr,useExisting:Bt(()=>kv)};var _c=Promise.resolve();var kv=(()=>{class n extends Zr{callSetDisabledState;get submitted(){return E(this.submittedReactive)}_submitted=x(()=>this.submittedReactive());submittedReactive=C(!1);_directives=new Set;form;ngSubmit=new z;options;constructor(e,i,r){super(),this.callSetDisabledState=r,this.form=new wc({},xv(e),Iv(i))}ngAfterViewInit(){this._setUpdateStrategy()}get formDirective(){return this}get control(){return this.form}get path(){return[]}get controls(){return this.form.controls}addControl(e){_c.then(()=>{e.control=this._findContainer(e.path).registerControl(e.name,e.control),e._setupWithForm(this.callSetDisabledState),e.control.updateValueAndValidity({emitEvent:!1}),this._directives.add(e)})}getControl(e){return this.form.get(e.path)}removeControl(e){_c.then(()=>{this._findContainer(e.path)?.removeControl(e.name),this._directives.delete(e)})}addFormGroup(e){_c.then(()=>{let i=this._findContainer(e.path),r=new wc({});Ex(r,e),i.registerControl(e.name,r),r.updateValueAndValidity({emitEvent:!1})})}removeFormGroup(e){_c.then(()=>{this._findContainer(e.path)?.removeControl?.(e.name)})}getFormGroup(e){return this.form.get(e.path)}updateModel(e,i){_c.then(()=>{this.form.get(e.path).setValue(i)})}setValue(e){this.control.setValue(e)}onSubmit(e){return this.submittedReactive.set(!0),xx(this.form,this._directives),this.ngSubmit.emit(e),this.form._events.next(new af(this.control)),e?.target?.method===`dialog`}onReset(){this.resetForm()}resetForm(e=void 0){this.form.reset(e),this.submittedReactive.set(!1)}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.form._updateOn=this.options.updateOn)}_findContainer(e){return e.pop(),e.length?this.form.get(e):this.form}static ɵfac=function(i){return new(i||n)(ne(Ss,10),ne(Ev,10),ne(mf,8))};static ɵdir=D({type:n,selectors:[[`form`,3,`ngNoForm`,``,3,`formGroup`,``,3,`formArray`,``],[`ng-form`],[``,`ngForm`,``]],hostBindings:function(i,r){i&1&&Fe(`submit`,function(s){return r.onSubmit(s)})(`reset`,function(){return r.onReset()})},inputs:{options:[0,`ngFormOptions`,`options`]},outputs:{ngSubmit:`ngSubmit`},exportAs:[`ngForm`],standalone:!1,features:[Le([o1]),ae]})}return n})();function rx(n,t){let e=n.indexOf(t);e>-1&&n.splice(e,1)}function ox(n){return typeof n==`object`&&n!==null&&Object.keys(n).length===2&&`value`in n&&`disabled`in n}var s1=class extends bs{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(t=null,e,i){super(yx(e),_x(i,e)),this._applyFormState(t),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),hf(e)&&(e.nonNullable||e.initialValueIsDefault)&&(ox(t)?this.defaultValue=t.value:this.defaultValue=t)}setValue(t,e={}){E(()=>{this.value=this._pendingValue=t,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)})}patchValue(t,e={}){this.setValue(t,e)}reset(t=this.defaultValue,e={}){this._applyFormState(t),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),e.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,e?.emitEvent!==!1&&this._events.next(new _s(this))}_updateValue(){}_anyControls(t){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(t){this._onChange.push(t)}_unregisterOnChange(t){rx(this._onChange,t)}registerOnDisabledChange(t){this._onDisabledChange.push(t)}_unregisterOnDisabledChange(t){rx(this._onDisabledChange,t)}_forEachChild(t){}_syncPendingControls(){return this.updateOn===`submit`&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(t){ox(t)?(this.value=this._pendingValue=t.value,t.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=t}};var a1=n=>n instanceof s1;var c1=(()=>{class n extends Zr{callSetDisabledState;get submitted(){return E(this._submittedReactive)}set submitted(e){this._submittedReactive.set(e)}_submitted=x(()=>this._submittedReactive());_submittedReactive=C(!1);_oldForm;_onCollectionChange=()=>this._updateDomValue();directives=[];constructor(e,i,r){super(),this.callSetDisabledState=r,this._setValidators(e),this._setAsyncValidators(i)}ngOnChanges(e){this.onChanges(e)}ngOnDestroy(){this.onDestroy()}onChanges(e){this._checkFormPresent(),Object.hasOwn(e,`form`)&&(this._updateValidators(),this._updateDomValue(),this._updateRegistrations(),this._oldForm=this.form)}onDestroy(){this.form&&(df(this.form,this),this.form._onCollectionChange===this._onCollectionChange&&this.form._registerOnCollectionChange(()=>{}))}get formDirective(){return this}get path(){return[]}addControl(e){let i=this.form.get(e.path);return e._setupWithForm(i,this.callSetDisabledState),i.updateValueAndValidity({emitEvent:!1}),this.directives.push(e),i}getControl(e){return this.form.get(e.path)}removeControl(e){cf(e.control||null,e,!1),i1(this.directives,e)}addFormGroup(e){this._setUpFormContainer(e)}removeFormGroup(e){this._cleanUpFormContainer(e)}getFormGroup(e){return this.form.get(e.path)}getFormArray(e){return this.form.get(e.path)}addFormArray(e){this._setUpFormContainer(e)}removeFormArray(e){this._cleanUpFormContainer(e)}updateModel(e,i){this.form.get(e.path).setValue(i)}onReset(){this.resetForm()}resetForm(e=void 0,i={}){this.form.reset(e,i),this._submittedReactive.set(!1)}onSubmit(e){return this.submitted=!0,xx(this.form,this.directives),this.ngSubmit.emit(e),this.form._events.next(new af(this.control)),e?.target?.method===`dialog`}_updateDomValue(){this.directives.forEach(e=>{let i=e.control,r=this.form.get(e.path);i!==r&&(cf(i||null,e),a1(r)&&e._setupWithForm(r,this.callSetDisabledState))}),this.form._updateTreeValidity({emitEvent:!1})}_setUpFormContainer(e){let i=this.form.get(e.path);Ex(i,e),i.updateValueAndValidity({emitEvent:!1})}_cleanUpFormContainer(e){let i=this.form?.get(e.path);i&&e1(i,e)&&i.updateValueAndValidity({emitEvent:!1})}_updateRegistrations(){this.form._registerOnCollectionChange(this._onCollectionChange),this._oldForm?._registerOnCollectionChange(()=>{})}_updateValidators(){Av(this.form,this),this._oldForm&&df(this._oldForm,this)}_checkFormPresent(){this.form}static ɵfac=function(i){return new(i||n)(ne(Ss,10),ne(Ev,10),ne(mf,8))};static ɵdir=D({type:n,features:[ae,Be]})}return n})();var l1={provide:Zr,useExisting:Bt(()=>Ov)};var Ov=(()=>{class n extends c1{form=null;ngSubmit=new z;get control(){return this.form}static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵdir=D({type:n,selectors:[[``,`formGroup`,``]],hostBindings:function(i,r){i&1&&Fe(`submit`,function(s){return r.onSubmit(s)})(`reset`,function(){return r.onReset()})},inputs:{form:[0,`formGroup`,`form`]},outputs:{ngSubmit:`ngSubmit`},exportAs:[`ngForm`],standalone:!1,features:[Le([l1]),ae]})}return n})();var wie=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`form`,3,`ngNoForm`,``,3,`ngNativeValidate`,``]],hostAttrs:[`novalidate`,``],standalone:!1})}return n})();var Ix=new g(``);var d1={provide:Fn,useExisting:Bt(()=>u1)};var u1=(()=>{class n extends Fn{_ngModelWarningConfig;callSetDisabledState;viewModel;form;set isDisabled(e){}model;update=new z;static _ngModelWarningSentOnce=!1;_ngModelWarningSent=!1;constructor(e,i,r,o,s,a,c){super(c,a,r),this._ngModelWarningConfig=o,this.callSetDisabledState=s,this._setValidators(e),this._setAsyncValidators(i)}ngOnChanges(e){if(this._isControlChanged(e)){let i=e.form.previousValue;i&&(cf(i,this,!1),this.removeParseErrorsValidator(i)),this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,ZL(this.form,this,this.callSetDisabledState)),this.form.updateValueAndValidity({emitEvent:!1})}t1(e,this.viewModel)&&(this.form.setValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.form&&cf(this.form,this,!1)}get path(){return[]}get control(){return this.form}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_isControlChanged(e){return Object.hasOwn(e,`form`)}ɵngControlCreate(e){super.ngControlCreate(e)}ɵngControlUpdate(e){super.ngControlUpdate(e,!0)}static ɵfac=function(i){return new(i||n)(ne(Ss,10),ne(Ev,10),ne(ff,10),ne(Ix,8),ne(mf,8),ne(ge,8),ne(T,8))};static ɵdir=D({type:n,selectors:[[``,`formControl`,``]],inputs:{form:[0,`formControl`,`form`],isDisabled:[0,`disabled`,`isDisabled`],model:[0,`ngModel`,`model`]},outputs:{update:`ngModelChange`},exportAs:[`ngForm`],standalone:!1,features:[Le([d1,r1]),ae,Be,Ma(null)]})}return n})();var f1=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({})}return n})();var Cie=(()=>{class n{static withConfig(e){return{ngModule:n,providers:[{provide:Ix,useValue:e.warnOnNgModelWithFormControl??`always`},{provide:mf,useValue:e.callSetDisabledState??Tv}]}}static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[f1]})}return n})();var Rx=Symbol(`FIELD_TREE`);var Fv=0;function h1(){return Fv}function Vi(n,t){return(...e)=>{try{return Fv=t,n(...e)}finally{Fv=0}}}function m1(n){return!n}function Nx(n){return n}function Qr(n){return Array.isArray(n)}function pf(n){return(typeof n==`object`||typeof n==`function`)&&n!=null}var Kr=Symbol();var Cf=Symbol();var Ec=class{predicates;fns=[];constructor(t){this.predicates=t}push(t){this.fns.push(Mx(this.predicates,t))}mergeIn(t){let e=this.predicates?t.fns.map(i=>Mx(this.predicates,i)):t.fns;this.fns.push(...e)}hasRules(){return this.fns.length>0}};var gf=class extends Ec{get defaultValue(){return!1}compute(t){return this.fns.some(e=>{let i=e(t);return i&&i!==Cf})}};var Cs=class n extends Ec{ignore;static ignoreNull(t){return new n(t,e=>e===null)}constructor(t,e){super(t),this.ignore=e}get defaultValue(){return[]}compute(t){return this.fns.reduce((e,i)=>{let r=i(t);return r===void 0||r===Cf?e:Qr(r)?[...e,...this.ignore?r.filter(o=>!this.ignore(o)):r]:this.ignore&&this.ignore(r)?e:[...e,r]},[])}};var Lv=class extends Cs{constructor(t){super(t,void 0)}};var jv=class extends Ec{key;get defaultValue(){return this.key.reducer.getInitial()}constructor(t,e){super(t),this.key=e}compute(t){if(this.fns.length===0)return this.key.reducer.getInitial();let e=this.key.reducer.getInitial();for(let i=0;i<this.fns.length;i++){let r=this.fns[i](t);r!==Cf&&(e=this.key.reducer.reduce(e,r))}return e}};function Mx(n,t){return n.length===0?t:e=>{for(let i of n){let r=e.stateOf(i.path),o=E(r.structure.pathKeys).length-i.depth;for(let s=0;s<o;s++)r=r.structure.parent;if(!i.fn(r.context))return Cf}return t(e)}}var Ds=class{predicates;hidden;disabledReasons;readonly;syncErrors;syncTreeErrors;asyncErrors;metadata=new Map;constructor(t){this.predicates=t,this.hidden=new gf(t),this.disabledReasons=new Lv(t),this.readonly=new gf(t),this.syncErrors=Cs.ignoreNull(t),this.syncTreeErrors=Cs.ignoreNull(t),this.asyncErrors=Cs.ignoreNull(t)}hasAnyLogic(){return this.hidden.hasRules()||this.disabledReasons.hasRules()||this.readonly.hasRules()||this.syncErrors.hasRules()||this.syncTreeErrors.hasRules()||this.asyncErrors.hasRules()||this.metadata.size>0}hasMetadata(t){return this.metadata.has(t)}hasMetadataKeys(){return this.metadata.size>0}getMetadataKeys(){return this.metadata.keys()}getMetadata(t){return this.metadata.has(t)||this.metadata.set(t,new jv(this.predicates,t)),this.metadata.get(t)}mergeIn(t){this.hidden.mergeIn(t.hidden),this.disabledReasons.mergeIn(t.disabledReasons),this.readonly.mergeIn(t.readonly),this.syncErrors.mergeIn(t.syncErrors),this.syncTreeErrors.mergeIn(t.syncTreeErrors),this.asyncErrors.mergeIn(t.asyncErrors);for(let e of t.getMetadataKeys()){let i=t.metadata.get(e);this.getMetadata(e).mergeIn(i)}}};var vf=class{depth;constructor(t){this.depth=t}build(){return new yf(this,[],0)}};var Es=class n extends vf{constructor(t){super(t)}current;all=[];addHiddenRule(t){this.getCurrent().addHiddenRule(t)}addDisabledReasonRule(t){this.getCurrent().addDisabledReasonRule(t)}addReadonlyRule(t){this.getCurrent().addReadonlyRule(t)}addSyncErrorRule(t){this.getCurrent().addSyncErrorRule(t)}addSyncTreeErrorRule(t){this.getCurrent().addSyncTreeErrorRule(t)}addAsyncErrorRule(t){this.getCurrent().addAsyncErrorRule(t)}addMetadataRule(t,e){this.getCurrent().addMetadataRule(t,e)}getChild(t){if(t===Kr){let e=this.getCurrent().children;e.size>(e.has(Kr)?1:0)&&(this.current=void 0)}return this.getCurrent().getChild(t)}hasLogic(t){return this===t?!0:this.all.some(({builder:e})=>e.hasLogic(t))}hasRules(){return this.all.length>0}anyChildHasLogic(){return this.all.some(({builder:t})=>t.anyChildHasLogic())}mergeIn(t,e){e?this.all.push({builder:t,predicate:{fn:Vi(e.fn,this.depth),path:e.path}}):this.all.push({builder:t}),this.current=void 0}getCurrent(){return this.current===void 0&&(this.current=new xc(this.depth),this.all.push({builder:this.current})),this.current}static newRoot(){return new n(0)}};var xc=class extends vf{logic=new Ds([]);children=new Map;constructor(t){super(t)}addHiddenRule(t){this.logic.hidden.push(Vi(t,this.depth))}addDisabledReasonRule(t){this.logic.disabledReasons.push(Vi(t,this.depth))}addReadonlyRule(t){this.logic.readonly.push(Vi(t,this.depth))}addSyncErrorRule(t){this.logic.syncErrors.push(Vi(t,this.depth))}addSyncTreeErrorRule(t){this.logic.syncTreeErrors.push(Vi(t,this.depth))}addAsyncErrorRule(t){this.logic.asyncErrors.push(Vi(t,this.depth))}addMetadataRule(t,e){this.logic.getMetadata(t).push(Vi(e,this.depth))}getChild(t){return this.children.has(t)||this.children.set(t,new Es(this.depth+1)),this.children.get(t)}hasLogic(t){return this===t}hasRules(){return this.logic.hasAnyLogic()||this.children.size>0}anyChildHasLogic(){for(let t of this.children.values())if(t.hasRules())return!0;return!1}};var yf=class n{builder;predicates;depth;logic;constructor(t,e,i){this.builder=t,this.predicates=e,this.depth=i,this.logic=t?p1(t,e,i):new Ds([])}getChild(t){let e=this.builder?kx(this.builder,t):[];if(e.length===0)return new n(void 0,[],this.depth+1);if(e.length===1){let{builder:i,predicates:r}=e[0];return new n(i,[...this.predicates,...r.map(o=>Bv(o,this.depth))],this.depth+1)}else return new Vv(e.map(({builder:r,predicates:o})=>new n(r,[...this.predicates,...o.map(s=>Bv(s,this.depth))],this.depth+1)))}hasLogic(t){return this.builder?this.builder.hasLogic(t):!1}hasRules(){return this.builder?this.builder.hasRules():!1}anyChildHasLogic(){return this.builder?this.builder.anyChildHasLogic():!1}};var Vv=class n{all;logic;constructor(t){this.all=t,this.logic=new Ds([]);for(let e of t)this.logic.mergeIn(e.logic)}getChild(t){return new n(this.all.flatMap(e=>e.getChild(t)))}hasLogic(t){return this.all.some(e=>e.hasLogic(t))}hasRules(){return this.all.some(t=>t.hasRules())}anyChildHasLogic(){return this.all.some(t=>t.anyChildHasLogic())}};function kx(n,t){if(n instanceof Es)return n.all.flatMap(({builder:e,predicate:i})=>{let r=kx(e,t);return i?r.map(({builder:o,predicates:s})=>({builder:o,predicates:[...s,i]})):r});if(n instanceof xc)return[...t!==Kr&&n.children.has(Kr)?[{builder:n.getChild(Kr),predicates:[]}]:[],...n.children.has(t)?[{builder:n.getChild(t),predicates:[]}]:[]];throw new _(1909,!1)}function p1(n,t,e){let i=new Ds(t);if(n instanceof Es){let r=n.all.map(({builder:o,predicate:s})=>new yf(o,s?[...t,Bv(s,e)]:t,e));for(let o of r)i.mergeIn(o.logic)}else if(n instanceof xc)i.mergeIn(n.logic);else throw new _(1909,!1);return i}function Bv(n,t){return S(p({},n),{depth:t})}var Ox=Symbol(`PATH`);var xs=class n{keys;parent;keyInParent;root;children=new Map;fieldPathProxy=new Proxy(this,g1);logicBuilder;constructor(t,e,i,r){this.keys=t,this.parent=i,this.keyInParent=r,this.root=e??this,i||(this.logicBuilder=Es.newRoot())}get builder(){return this.logicBuilder?this.logicBuilder:this.parent.builder.getChild(this.keyInParent)}getChild(t){return this.children.has(t)||this.children.set(t,new n([...this.keys,t],this.root,this,t)),this.children.get(t)}mergeIn(t,e){let i=t.compile();this.builder.mergeIn(i.builder,e)}static unwrapFieldPath(t){return t[Ox]}static newRoot(){return new n([],void 0,void 0,void 0)}};var g1={get(n,t){return t===Ox?n:n.getChild(t).fieldPathProxy}};var Pv;var Dc=new Map;var _f=class n{schemaFn;constructor(t){this.schemaFn=t}compile(){if(Dc.has(this))return Dc.get(this);let t=xs.newRoot();Dc.set(this,t);let e=Pv;try{Pv=t,this.schemaFn(t.fieldPathProxy)}finally{Pv=e}return t}static create(t){return t instanceof n?t:new n(t)}static rootCompile(t){try{return Dc.clear(),t===void 0?xs.newRoot():t instanceof n?t.compile():new n(t).compile()}finally{Dc.clear()}}};function v1(n){return n instanceof _f||typeof n==`function`}var Is={list(){return{reduce:(n,t)=>t===void 0?n:[...n,t],getInitial:()=>[]}},min(){return{reduce:(n,t)=>n===void 0||t===void 0?n??t:t<n?t:n,getInitial:()=>{}}},max(){return{reduce:(n,t)=>n===void 0||t===void 0?n??t:t>n?t:n,getInitial:()=>{}}},or(){return{reduce:(n,t)=>n||t,getInitial:()=>!1}},and(){return{reduce:(n,t)=>n&&t,getInitial:()=>!0}},override:y1};function y1(n){return{reduce:(t,e)=>e,getInitial:()=>n?.()}}var Qv=Symbol(`IS_ASYNC_VALIDATION_RESOURCE`);var bf=class{reducer;create;brand;[Qv];constructor(t,e){this.reducer=t,this.create=e}};function Xr(n){return new bf(n??Is.override())}function Xv(){return Xr()}var Px=Xr(Is.or());var Fx=Xv();var Lx=Xv();var jx=Xr(Is.max());var Vx=Xr(Is.min());var Bx=Xr(Is.list());function Vt(n,t){if(n===t)return!0;if(!n||!t||n.length!==t.length)return!1;for(let e=0;e<n.length;e++)if(!Object.is(n[e],t[e]))return!1;return!0}function _1(n){return n.errors().length>0?`invalid`:n.pending()?`unknown`:`valid`}var Uv=class{node;constructor(t){this.node=t}rawSyncTreeErrors=x(()=>this.shouldSkipValidation()?[]:[...this.node.logicNode.logic.syncTreeErrors.compute(this.node.context),...this.node.structure.parent?.validationState.rawSyncTreeErrors()??[]],{equal:Vt});syncErrors=x(()=>this.shouldSkipValidation()?[]:[...this.node.logicNode.logic.syncErrors.compute(this.node.context),...this.syncTreeErrors(),...b1(this.node.submitState.submissionErrors())],{equal:Vt});syncValid=x(()=>this.shouldSkipValidation()?!0:this.node.structure.reduceChildren(this.syncErrors().length===0,(t,e)=>e&&t.validationState.syncValid(),m1));syncTreeErrors=x(()=>this.rawSyncTreeErrors().filter(t=>t.fieldTree===this.node.fieldTree),{equal:Vt});rawAsyncErrors=x(()=>this.shouldSkipValidation()?[]:[...this.node.logicNode.logic.asyncErrors.compute(this.node.context),...this.node.structure.parent?.validationState.rawAsyncErrors()??[]],{equal:Vt});asyncErrors=x(()=>this.shouldSkipValidation()?[]:this.rawAsyncErrors().filter(t=>t===`pending`||t.fieldTree===this.node.fieldTree),{equal:Vt});parseErrors=x(()=>this.node.formFieldBindings().flatMap(t=>t.parseErrors()),{equal:Vt});errors=x(()=>[...this.parseErrors(),...this.syncErrors(),...this.asyncErrors().filter(t=>t!==`pending`)],{equal:Vt});errorSummary=x(()=>{let t=this.node.structure.reduceChildren(this.errors(),(e,i)=>[...i,...e.errorSummary()]);return E(()=>t.sort(S1)),t},{equal:Vt});pending=x(()=>this.node.structure.reduceChildren(this.asyncErrors().includes(`pending`),(t,e)=>e||t.validationState.pending()));status=x(()=>{if(this.shouldSkipValidation())return`valid`;let t=_1(this);return this.node.structure.reduceChildren(t,(e,i)=>i===`invalid`||e.validationState.status()===`invalid`?`invalid`:i===`unknown`||e.validationState.status()===`unknown`?`unknown`:`valid`,e=>e===`invalid`)});valid=x(()=>this.status()===`valid`);invalid=x(()=>this.status()===`invalid`);shouldSkipValidation=x(()=>this.node.hidden()||this.node.disabled()||this.node.readonly()||this.node.structure.isOrphaned())};function b1(n){return n===void 0?[]:Qr(n)?n:[n]}function Tx(n){return n.formField?n.formField.element:n.fieldTree().formFieldBindings().reduce((t,e)=>!t||!e.element?t??e.element:t.compareDocumentPosition(e.element)&Node.DOCUMENT_POSITION_PRECEDING?e.element:t,void 0)}function S1(n,t){let e=Tx(n),i=Tx(t);return e===i?0:e===void 0||i===void 0?e===void 0?1:-1:e.compareDocumentPosition(i)&Node.DOCUMENT_POSITION_PRECEDING?1:-1}var Hv=Xr();var zv=class{node;cache=new WeakMap;constructor(t){this.node=t,this.fieldTreeOf=this.fieldTreeOf.bind(this),this.stateOf=this.stateOf.bind(this)}resolve(t){if(!this.cache.has(t)){let e=x(()=>{let i=xs.unwrapFieldPath(t),r=this.node,o=h1();for(;o>0||!r.structure.logic.hasLogic(i.root.builder);)if(o--,r=r.structure.parent,r===void 0)throw new _(1900,!1);for(let s of i.keys)if(r=r.structure.getChild(s),r===void 0)throw new _(1901,!1);return r.fieldTree});this.cache.set(t,e)}return this.cache.get(t)()}get fieldTree(){return this.node.fieldProxy}get state(){return this.node}get value(){return this.node.structure.value}get key(){return this.node.structure.keyInParent}get pathKeys(){return this.node.structure.pathKeys}index=x(()=>{let t=this.key();if(!Qr(E(this.node.structure.parent.value)))throw new _(1906,!1);return Number(t)});fieldTreeOf(t){return this.resolve(t)}stateOf(t){return this.resolve(t)()}valueOf=t=>{let e=this.resolve(t)().value();if(e instanceof bs)throw new _(1907,!1);return e}};var $v=class{node;metadata=new Map;constructor(t){this.node=t}runMetadataCreateLifecycle(){if(!this.node.logicNode.logic.hasMetadataKeys())return;let t=Lp();t&&kd(!1);try{E(()=>Ie(this.node.structure.injector,()=>{for(let e of this.node.logicNode.logic.getMetadataKeys())if(e.create){let i=this.node.logicNode.logic.getMetadata(e),r=e.create(this.node,x(()=>i.compute(this.node.context)));this.metadata.set(e,r)}}))}finally{t&&kd(!0)}}get(t){if(this.has(t)&&!this.metadata.has(t)){if(t.create)throw new _(1912,!1);let e=this.node.logicNode.logic.getMetadata(t);this.metadata.set(t,x(()=>e.compute(this.node.context)))}return this.metadata.get(t)}has(t){return this.node.logicNode.logic.hasMetadata(t)}};var w1={get(n,t,e){if(t===Rx)return!0;let i=n(),r=i.structure.getChild(t);if(r!==void 0)return r.fieldTree;let o=E(i.value);if(Qr(o)){if(t===`length`)return i.value().length;if(t===Symbol.iterator)return()=>(i.value(),Array.prototype[Symbol.iterator].apply(i.fieldTree))}if(pf(o)&&t===Symbol.iterator)return function*(){for(let s in e)yield[s,e[s]]}},getOwnPropertyDescriptor(n,t){let e=E(n().value),i=Reflect.getOwnPropertyDescriptor(e,t);return i&&!i.configurable&&(i.configurable=!0),i},ownKeys(n){let t=E(n().value);return typeof t==`object`&&t!==null?Reflect.ownKeys(t):[]}};function C1(n,t){let e=x(()=>n()[t()]);return e[Ce]=n[Ce],e.set=i=>{Object.is(E(e),i)||n.update(r=>D1(r,i,t()))},e.update=i=>{e.set(i(E(e)))},e.asReadonly=()=>e,e}function D1(n,t,e){if(Qr(n)){let i=[...n];return i[e]=t,i}else return S(p({},n),{[e]:t})}var ws=Symbol(``);var Ux=x(()=>!1);var Sf=class{logic;node;createChildNode;identitySymbol=Symbol();_injector=void 0;_anyChildHasLogic;get injector(){return this._injector??=T.create({providers:[],parent:this.fieldManager.injector}),this._injector}constructor(t,e,i){this.logic=t,this.node=e,this.createChildNode=i}children(){this.ensureChildrenMap();let t=this.childrenMap();return t===void 0?[]:Array.from(t.byPropertyKey.values()).map(e=>E(e.reader))}materializedChildren(){let t=this.childrenMap();return t===void 0?[]:Array.from(t.byPropertyKey.values()).map(e=>e.node)}_areChildrenMaterialized(){return E(this.childrenMap)!==void 0}ensureChildrenMap(){this._areChildrenMaterialized()||E(()=>{this.childrenMap.update(t=>this.computeChildrenMap(this.value(),t,!0))})}getChild(t){this.ensureChildrenMap();let e=t.toString(),i=E(this.childrenMap)?.byPropertyKey.get(e)?.reader;return i||(i=this.createReader(e)),i()}reduceChildren(t,e,i){let r=this.childrenMap();if(!r)return t;let o=t;for(let s of r.byPropertyKey.values()){if(i?.(o))break;o=e(E(s.reader),o)}return o}destroy(){this.injector.destroy()}createKeyOrOrphanSignals(t,e,i){if(t===`root`)return{keyInParent:Hx,isOrphaned:Ux};let r=this.parent,o=i,s=x(()=>{if(r.structure.isOrphaned())return ws;let l=r.structure.childrenMap();if(!l)return ws;let d=l.byPropertyKey.get(o);if(d&&d.node===this.node)return o;if(e===void 0)return ws;for(let[f,h]of l.byPropertyKey)if(h.node===this.node)return o=f;return ws}),a=x(()=>s()===ws);return{keyInParent:x(()=>{let l=s();if(l===ws)throw e===void 0?new _(-1902,!1):new _(1904,!1);return l}),isOrphaned:a}}createChildrenMap(){return kn({source:this.value,computation:(t,e)=>this.computeChildrenMap(t,e?.value,!1)})}computeChildrenMap(t,e,i){if(!pf(t)||!i&&e===void 0&&!(this._anyChildHasLogic??=this.logic.anyChildHasLogic()))return;e??={byPropertyKey:new Map};let r,o=Qr(t);e!==void 0&&(o?r=x1(e,t,this.identitySymbol):r=I1(e,t));for(let s of Object.keys(t)){let a,c=t[s];if(c===void 0){e.byPropertyKey.has(s)&&(r??=p({},e),r.byPropertyKey.delete(s));continue}o&&pf(c)&&!Qr(c)&&(a=c[this.identitySymbol]??=Symbol(``));let l;a&&(e.byTrackingKey?.has(a)||(r??=p({},e),r.byTrackingKey??=new Map,r.byTrackingKey.set(a,this.createChildNode(s,a,o))),l=(r??e).byTrackingKey.get(a));let d=e.byPropertyKey.get(s);d===void 0?(r??=p({},e),r.byPropertyKey.set(s,{reader:this.createReader(s),node:l??this.createChildNode(s,a,o)})):l&&l!==d.node&&(r??=p({},e),d.node=l)}return r??e}createReader(t){return x(()=>this.childrenMap()?.byPropertyKey.get(t)?.node)}};var Wv=class extends Sf{fieldManager;value;get parent(){}get root(){return this.node}get pathKeys(){return E1}get keyInParent(){return Hx}isOrphaned=Ux;childrenMap;constructor(t,e,i,r,o){super(e,t,o),this.fieldManager=i,this.value=r,this.childrenMap=this.createChildrenMap()}};var Gv=class extends Sf{logic;parent;root;pathKeys;keyInParent;value;childrenMap;isOrphaned;get fieldManager(){return this.root.structure.fieldManager}constructor(t,e,i,r,o,s){super(e,t,s),this.logic=e,this.parent=i,this.root=this.parent.structure.root;let a=this.createKeyOrOrphanSignals(`child`,r,o);this.isOrphaned=a.isOrphaned,this.keyInParent=a.keyInParent,this.pathKeys=x(()=>[...i.structure.pathKeys(),this.keyInParent()]),this.value=C1(this.parent.structure.value,this.keyInParent),this.childrenMap=this.createChildrenMap(),this.fieldManager.structures.add(this)}};var E1=x(()=>[]);var Hx=x(()=>{throw new _(1905,!1)});function x1(n,t,e){let i,r=new Set(n.byPropertyKey.keys()),o=n.byTrackingKey&&new Set(n.byTrackingKey.keys());for(let s=0;s<t.length;s++){let a=t[s];r.delete(s.toString()),o&&pf(a)&&Object.hasOwn(a,e)&&o.delete(a[e])}if(r.size>0){i??=p({},n);for(let s of r)i.byPropertyKey.delete(s)}if(o&&o.size>0){i??=p({},n);for(let s of o)i.byTrackingKey.delete(s)}return i}function I1(n,t){let e;for(let i of n.byPropertyKey.keys())Object.hasOwn(t,i)||(e??=p({},n),e.byPropertyKey.delete(i));return e}var qv=class{node;selfSubmitting=C(!1);submissionErrors;constructor(t){this.node=t,this.submissionErrors=kn({source:this.node.structure.value,computation:()=>[]})}submitting=x(()=>this.selfSubmitting()||(this.node.structure.parent?.submitting()??!1))};var Ic=class{structure;validationState;metadataState;nodeState;submitState;fieldAdapter;controlValue;_context=void 0;get context(){return this._context??=new zv(this)}fieldProxy=new Proxy(()=>this,w1);pathNode;constructor(t){this.pathNode=t.pathNode,this.fieldAdapter=t.fieldAdapter,this.structure=this.fieldAdapter.createStructure(this,t),this.validationState=this.fieldAdapter.createValidationState(this,t),this.nodeState=this.fieldAdapter.createNodeState(this,t),this.metadataState=new $v(this),this.submitState=new qv(this),this.controlValue=this.controlValueSignal(),this.metadataState.runMetadataCreateLifecycle()}focusBoundControl(t){this.getBindingForFocus()?.focus(t)}getBindingForFocus(){return this.formFieldBindings().filter(e=>e.focus!==void 0).reduce(Ax,void 0)||this.structure.children().map(e=>e.getBindingForFocus()).reduce(Ax,void 0)}pendingSync=kn({source:()=>this.value(),computation:(t,e)=>{e?.value?.abort()}});get fieldTree(){return this.fieldProxy}get logicNode(){return this.structure.logic}get value(){return this.structure.value}get keyInParent(){return this.structure.keyInParent}get errors(){return this.validationState.errors}get parseErrors(){return this.validationState.parseErrors}get errorSummary(){return this.validationState.errorSummary}get pending(){return this.validationState.pending}get valid(){return this.validationState.valid}get invalid(){return this.validationState.invalid}get dirty(){return this.nodeState.dirty}get touched(){return this.nodeState.touched}get disabled(){return this.nodeState.disabled}get disabledReasons(){return this.nodeState.disabledReasons}get hidden(){return this.nodeState.hidden}get readonly(){return this.nodeState.readonly}get formFieldBindings(){return this.nodeState.formFieldBindings}get submitting(){return this.submitState.submitting}get name(){return this.nodeState.name}get max(){let t=this.metadata(Lx)?.();return t?this.metadata(t):void 0}get maxLength(){return this.metadata(Vx)}get min(){let t=this.metadata(Fx)?.();return t?this.metadata(t):void 0}get minLength(){return this.metadata(jx)}get pattern(){return this.metadata(Bx)??N1}get required(){return this.metadata(Px)??M1}metadata(t){return this.metadataState.get(t)}getError(t){return this.errors().find(e=>e.kind===t)}hasMetadata(t){return this.metadataState.has(t)}markAsTouched(t){this.structure.isOrphaned()||E(()=>{this.markAsTouchedInternal(t),this.flushSync()})}markAsTouchedInternal(t){if(!this.structure.isOrphaned()&&!this.validationState.shouldSkipValidation()&&(this.nodeState.markAsTouched(),!t?.skipDescendants))for(let e of this.structure.children())e.markAsTouchedInternal()}markAsDirty(){this.nodeState.markAsDirty()}markAsPristine(){this.nodeState.markAsPristine()}markAsUntouched(){this.nodeState.markAsUntouched()}reset(t){E(()=>this._reset(t))}_reset(t){this.pendingSync()?.abort(),t!==void 0&&this.value.set(t),this.controlValue.rawSet(this.value()),this.nodeState.markAsUntouched(),this.nodeState.markAsPristine();for(let e of this.formFieldBindings())e.reset();for(let e of this.structure.materializedChildren())e._reset()}reloadValidation(){E(()=>this._reloadValidation())}_reloadValidation(){let t=this.logicNode.logic.getMetadataKeys();for(let e of t)e[Qv]&&this.metadata(e).reload?.();for(let e of this.structure.children())e._reloadValidation()}controlValueSignal(){let t=kn(this.value);t.rawSet=t.set,t.set=i=>{t.rawSet(i),this.markAsDirty(),this.debounceSync()};let e=t.update;return t.update=i=>{e(i),this.markAsDirty(),this.debounceSync()},t}sync(){this.value.set(this.controlValue())}flushSync(){let t=this.pendingSync();t&&!t.signal.aborted&&(t.abort(),this.sync())}async debounceSync(){let t=E(()=>(this.pendingSync()?.abort(),this.nodeState.debouncer()));if(t){let e=new AbortController,i=t(e.signal);if(i&&(this.pendingSync.set(e),await i,e.signal.aborted))return}this.structure.isOrphaned()||this.sync()}static newRoot(t,e,i,r){return r.newRoot(t,e,i,r)}createStructure(t){return t.kind===`root`?new Wv(this,t.logic,t.fieldManager,t.value,this.newChild.bind(this)):new Gv(this,t.logic,t.parent,t.identityInParent,t.initialKeyInParent,this.newChild.bind(this))}newChild(t,e,i){let r,o;return i?(r=this.pathNode.getChild(Kr),o=this.structure.logic.getChild(Kr)):(r=this.pathNode.getChild(t),o=this.structure.logic.getChild(t)),this.fieldAdapter.newChild({kind:`child`,parent:this,pathNode:r,logic:o,initialKeyInParent:t,identityInParent:e,fieldAdapter:this.fieldAdapter})}};var N1=x(()=>[]);var M1=x(()=>!1);function Ax(n,t){return n?t&&n.element.compareDocumentPosition(t.element)&Node.DOCUMENT_POSITION_PRECEDING?t:n:t}var Yv=class{node;selfTouched=C(!1);selfDirty=C(!1);markAsTouched(){this.selfTouched.set(!0)}markAsDirty(){this.selfDirty.set(!0)}markAsPristine(){this.selfDirty.set(!1)}markAsUntouched(){this.selfTouched.set(!1)}formFieldBindings=C([]);constructor(t){this.node=t}dirty=x(()=>{let t=this.selfDirty()&&!this.isNonInteractive();return this.node.structure.reduceChildren(t,(e,i)=>i||e.nodeState.dirty(),Nx)});touched=x(()=>{let t=this.selfTouched()&&!this.isNonInteractive();return this.node.structure.reduceChildren(t,(e,i)=>i||e.nodeState.touched(),Nx)});disabledReasons=x(()=>[...this.node.structure.parent?.nodeState.disabledReasons()??[],...this.node.logicNode.logic.disabledReasons.compute(this.node.context)],{equal:Vt});disabled=x(()=>!!this.disabledReasons().length);readonly=x(()=>(this.node.structure.parent?.nodeState.readonly()||this.node.logicNode.logic.readonly.compute(this.node.context))??!1);hidden=x(()=>(this.node.structure.parent?.nodeState.hidden()||this.node.logicNode.logic.hidden.compute(this.node.context))??!1);name=x(()=>{let t=this.node.structure.parent;return t?`${t.name()}.${this.node.structure.keyInParent()}`:this.node.structure.fieldManager.rootName});debouncer=x(()=>{if(this.node.logicNode.logic.hasMetadata(Hv)){let e=this.node.logicNode.logic.getMetadata(Hv).compute(this.node.context);if(e)return i=>e(this.node.context,i)}return this.node.structure.parent?.nodeState.debouncer?.()});isNonInteractive=x(()=>this.hidden()||this.disabled()||this.readonly())};var Zv=class{newRoot(t,e,i,r){return new Ic({kind:`root`,fieldManager:t,value:e,pathNode:i,logic:i.builder.build(),fieldAdapter:r})}newChild(t){return new Ic(t)}createNodeState(t){return new Yv(t)}createValidationState(t){return new Uv(t)}createStructure(t,e){return t.createStructure(e)}};var Kv=class{injector;rootName;submitOptions;constructor(t,e,i){this.injector=t,this.rootName=e??`${this.injector.get(on)}.form${T1++}`,this.submitOptions=i}structures=new Set;createFieldManagementEffect(t){dt(()=>{let e=new Set;this.markStructuresLive(t,e);for(let i of this.structures)e.has(i)||(this.structures.delete(i),E(()=>i.destroy()))},{injector:this.injector})}markStructuresLive(t,e){e.add(t);for(let i of t.children())this.markStructuresLive(i.structure,e)}};var T1=0;var zx=new g(``);function A1(n){let t,e,i;return n.length===3?[t,e,i]=n:n.length===2?v1(n[1])?[t,e]=n:[t,i]=n:[t]=n,[t,e,i]}function R1(...n){let[t,e,i]=A1(n),r=i?.injector??u(T),o=Ie(r,()=>_f.rootCompile(e)),s=new Kv(r,i?.name,i?.submission),a=i?.adapter??new Zv,c=Ic.newRoot(s,t,o,a);s.createFieldManagementEffect(c.structure);let{experimentalWebMcpTool:l}=i??{};if(l){let d=Ie(r,()=>u(zx,{optional:!0}));d&&Ie(r,()=>d(c.fieldTree,{name:l.name,description:l.description}))}return c.fieldTree}var wf=class{kind=`compat`;control;fieldTree;context;message;constructor({context:t,kind:e,control:i}){this.context=t,this.kind=e,this.control=i}};function $x(n){if(n.length===0)return null;let t={};for(let e of n)t[e.kind]=e instanceof wf?e.context:e;return t}function Wx(n,t){return n===null?[]:Object.entries(n).map(([e,i])=>new wf({context:i,kind:e,control:t}))}var k1=new g(``);function Gx(n){return n===void 0?[]:Array.isArray(n)?n:[n]}var Jv=class{__brand=void 0;kind=``;fieldTree;message;constructor(t){t&&Object.assign(this,t)}};var Df=class extends Jv{kind=`parse`};function O1(n,t,e){let i=kn({source:n,computation:()=>[],equal:Vt}),r=s=>{let a=e(s);i.set(Gx(a.error)),a.value!==void 0&&t(a.value),i.set(Gx(a.error))},o=()=>{i.set([])};return{errors:i.asReadonly(),setRawValue:r,reset:o}}var ey=class{field;constructor(t){this.field=t}control=this;get value(){return this.field().controlValue()}get valid(){return this.field().valid()}get invalid(){return this.field().invalid()}get pending(){return this.field().pending()}get disabled(){return this.field().disabled()}get enabled(){return!this.field().disabled()}get errors(){return $x(this.field().errors())}get pristine(){return!this.field().dirty()}get dirty(){return this.field().dirty()}get touched(){return this.field().touched()}get untouched(){return!this.field().touched()}get status(){if(this.field().disabled())return`DISABLED`;if(this.field().valid())return`VALID`;if(this.field().invalid())return`INVALID`;if(this.field().pending())return`PENDING`;throw new _(1910,!1)}valueAccessor=null;hasValidator(t){return t===Li.required?this.field().required():!1}updateValueAndValidity(){}};var ty={disabled:`disabled`,disabledReasons:`disabledReasons`,dirty:`dirty`,errors:`errors`,hidden:`hidden`,invalid:`invalid`,max:`max`,maxLength:`maxLength`,min:`min`,minLength:`minLength`,name:`name`,pattern:`pattern`,pending:`pending`,readonly:`readonly`,required:`required`,touched:`touched`};var P1=(()=>{let n={};for(let t of Object.keys(ty))n[ty[t]]=t;return n})();function ny(n,t){return n[P1[t]]?.()}var iy=Object.values(ty);function xf(){return{}}function Bi(n,t,e){return n[t]!==e?(n[t]=e,!0):!1}function F1(n,t,e){let i;if(Zx(n)&&e.isBadInput(n))return{error:new Df};switch(n.type){case`checkbox`:return{value:n.checked};case`number`:case`range`:case`datetime-local`:if(i=E(t),typeof i==`number`||i===null)return{value:n.value===``?null:n.valueAsNumber};break;case`date`:case`month`:case`time`:case`week`:if(i=E(t),i===null||i instanceof Date)return{value:n.valueAsDate};if(typeof i==`number`)return{value:n.valueAsNumber};break}if(n.tagName===`INPUT`&&n.type===`text`&&(i??=E(t),typeof i==`number`||i===null)){if(n.value===``)return{value:null};let r=Number(n.value);return Number.isNaN(r)?{error:new Df}:{value:r}}return{value:n.value}}function qx(n,t){switch(n.type){case`checkbox`:n.checked=t;return;case`radio`:n.checked=t===n.value;return;case`number`:case`range`:case`datetime-local`:if(typeof t==`number`){Yx(n,t);return}else if(t===null){n.value=``;return}break;case`date`:case`month`:case`time`:case`week`:if(t===null||t instanceof Date){n.valueAsDate=t;return}else if(typeof t==`number`){Yx(n,t);return}}if(n.tagName===`INPUT`&&n.type===`text`){if(typeof t==`number`){n.value=isNaN(t)?``:String(t);return}if(t===null){n.value=``;return}}n.value=t}function Yx(n,t){isNaN(t)?n.value=``:n.valueAsNumber=t}function Zx(n){return n.tagName===`INPUT`}function L1(n){return n.type===`date`||n.type===`datetime-local`||n.type===`month`||n.type===`time`||n.type===`week`}function j1(n,t){let e=n.getUTCFullYear(),i=String(n.getUTCMonth()+1).padStart(2,`0`);if(t===`month`)return`${e}-${i}`;return`${e}-${i}-${String(n.getUTCDate()).padStart(2,`0`)}`}function Kx(n,t,e){return t instanceof Date&&(n===`min`||n===`max`)&&(e===`date`||e===`month`)?j1(t,e):t}function V1(n,t){n.listenToCustomControlModel(i=>t.state().controlValue.set(i)),n.listenToCustomControlOutput(`touch`,()=>t.state().markAsTouched()),t.registerAsBinding(n.customControl);let e=xf();return()=>{let i=t.state(),r=i.controlValue();Bi(e,`controlValue`,r)&&n.setCustomControlModelInput(r);for(let o of iy){let s;if(o===`errors`?s=t.errors():s=ny(i,o),Bi(e,o,s)&&(n.setInputOnDirectives(o,s),t.elementAcceptsNativeProperty(o)&&!n.customControlHasInput(o))){let a=Kx(o,s,t.nativeFormElement.type);Cc(t.renderer,t.nativeFormElement,o,a)}}}}function B1(n){return typeof n==`object`&&n!==null}function U1(n,t){let e=xf();t.controlValueAccessor.registerOnChange(r=>{e.controlValue=r,t.state().controlValue.set(r)}),t.controlValueAccessor.registerOnTouched(()=>t.state().markAsTouched());let i=t.injector.get(Ss,null,{optional:!0,self:!0});if(i){let r;for(let c of i)B1(c)&&c.registerOnValidatorChange&&(r??=C(0),c.registerOnValidatorChange(()=>{r.update(l=>l+1)}));let o=i.map(c=>typeof c==`function`?c:c.validate.bind(c)),s=Li.compose(o),a=x(()=>{r?.();return Wx(s?s(t.interopNgControl.control):null,t.interopNgControl.control)});t.parseErrorsSource.set(a)}return t.registerAsBinding({reset:()=>{let r=t.state().value();e.controlValue=r,E(()=>t.controlValueAccessor.writeValue(r))}}),()=>{let r=t.state(),o=r.controlValue();Bi(e,`controlValue`,o)&&E(()=>t.controlValueAccessor.writeValue(o));for(let s of iy){let a=ny(r,s);if(Bi(e,s,a)){let c=n.setInputOnDirectives(s,a,s===`name`?H1:void 0);s===`disabled`&&t.controlValueAccessor.setDisabledState?E(()=>t.controlValueAccessor.setDisabledState(a)):!c&&t.elementAcceptsNativeProperty(s)&&Cc(t.renderer,t.nativeFormElement,s,a)}}}}function H1(n){return n==null}function z1(n,t,e){if(typeof MutationObserver!=`function`)return;let i=new MutationObserver(r=>{r.some(o=>$1(o))&&t()});i.observe(n,{attributes:!0,attributeFilter:[`value`],characterData:!0,childList:!0,subtree:!0}),e.onDestroy(()=>i.disconnect())}function $1(n){if(n.type===`childList`||n.type===`characterData`){if(n.target instanceof Comment)return!1;for(let t of n.addedNodes)if(!(t instanceof Comment))return!0;for(let t of n.removedNodes)if(!(t instanceof Comment))return!0;return!1}return n.type===`attributes`&&n.target instanceof HTMLOptionElement}function W1(n,t,e,i){let r=!1,o=t.nativeFormElement,s=O1(()=>t.state().value(),c=>t.state().controlValue.set(c),c=>F1(o,t.state().value,i));e.set(s.errors),t.onReset=()=>{s.reset();let c=t.state().value();a.controlValue=c,qx(o,c)},n.listenToDom(`input`,()=>s.setRawValue(void 0)),n.listenToDom(`blur`,()=>t.state().markAsTouched()),Zx(o)&&L1(o)&&i.watchValidity(t.destroyRef,o,()=>s.setRawValue(void 0)),t.registerAsBinding(),o.tagName===`SELECT`&&z1(o,()=>{r&&(o.value=t.state().controlValue())},t.destroyRef);let a=xf();return()=>{let c=t.state();for(let h of iy){let m=ny(c,h);if(Bi(a,h,m)&&(n.setInputOnDirectives(h,m),t.elementAcceptsNativeProperty(h))){let v=Kx(h,m,o.type);Cc(t.renderer,o,h,v)}}let l=c.controlValue(),d=Bi(a,`controlValue`,l),f=o.type===`radio`&&Bi(a,`radioValue`,o.value);(d||f)&&qx(o,l),r=!0}}var Qx=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵprov=W({token:n,factory:e=>G1.ɵfac(e),providedIn:`root`})}return n})();var G1=(()=>{class n extends Qx{document=u(M);cspNonce=u(Yn,{optional:!0});injectedStyles=new WeakMap;watchValidity(e,i,r){let o=i.getRootNode();this.injectedStyles.has(o)||this.injectedStyles.set(o,this.createTransitionStyle(o));let s=a=>{let c=a;(c.animationName===`ng-valid`||c.animationName===`ng-invalid`)&&r()};i.addEventListener(`animationstart`,s),e.onDestroy(()=>{i.removeEventListener(`animationstart`,s)})}isBadInput(e){return e.validity?.badInput??!1}createTransitionStyle(e){let i=this.document.createElement(`style`);return this.cspNonce&&(i.nonce=this.cspNonce),i.textContent=`
      @keyframes ng-valid {}
      @keyframes ng-invalid {}
      input:valid, textarea:valid {
        animation: ng-valid 0.001s;
      }
      input:invalid, textarea:invalid {
        animation: ng-invalid 0.001s;
      }
    `,e.nodeType===9?e.head?.appendChild(i):e.appendChild(i),i}ngOnDestroy(){this.injectedStyles.get(this.document)?.remove()}static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵprov=W({token:n,factory:n.ɵfac})}return n})();var q1=Symbol();var Ef=new g(``);var rre=(()=>{class n{field=Mi.required({alias:`formField`});state=x(()=>this.field()());renderer=u(ge);destroyRef=u(ke);injector=u(T);element=u(N).nativeElement;elementIsNativeFormElement=Nv(this.element);elementAcceptsTextualValues=wx(this.element);_elementAcceptsMinMax;nativeFormElement=this.elementIsNativeFormElement?this.element:void 0;focuser=e=>this.element.focus(e);controlValueAccessors=u(ff,{optional:!0,self:!0});config=u(k1,{optional:!0});validityMonitor=u(Qx);parseErrorsSource=C(void 0);_interopNgControl;get interopNgControl(){return this._interopNgControl??=new ey(this.state)}parseErrors=x(()=>this.parseErrorsSource()?.().map(e=>S(p({},e),{fieldTree:E(this.state).fieldTree,formField:this}))??[],{equal:Vt});errors=x(()=>this.state().errors().filter(e=>!e.formField||e.formField===this),{equal:Vt});isFieldBinding=!1;resetter=()=>{};parseErrorsResetCallback;setParseErrors(e){this.parseErrorsSource.set(e)}set onReset(e){this.parseErrorsResetCallback=e}get onReset(){return this.parseErrorsResetCallback}get controlValueAccessor(){return!this.controlValueAccessors||this.controlValueAccessors.length===0?this.interopNgControl?.valueAccessor??void 0:Rv(this.interopNgControl,this.controlValueAccessors)??void 0}installClassBindingEffect(){let e=Object.entries(this.config?.classes??{}).map(([r,o])=>[r,x(()=>o(this))]);if(e.length===0)return;let i=xf();Pd({write:()=>{for(let[r,o]of e){let s=o();Bi(i,r,s)&&(s?this.renderer.addClass(this.element,r):this.renderer.removeClass(this.element,r))}}},{injector:this.injector})}focus(e){this.focuser(e)}reset(){this.resetter(),this.parseErrorsResetCallback?.(this.state().value())}registerAsBinding(e){if(this.isFieldBinding)throw new _(1913,!1);this.isFieldBinding=!0,this.installClassBindingEffect(),e?.focus&&(this.focuser=i=>e.focus(i)),e?.reset&&(this.resetter=()=>e.reset()),dt(i=>{let r=this.state();r.nodeState.formFieldBindings.update(o=>[...o,this]),i(()=>{r.nodeState.formFieldBindings.update(o=>o.filter(s=>s!==this))})},{injector:this.injector})}[q1];ɵngControlCreate(e){if(!e.hasPassThrough)if(this.controlValueAccessor)this.ɵngControlUpdate=U1(e,this);else if(e.customControl)this.ɵngControlUpdate=V1(e,this);else if(this.elementIsNativeFormElement)this.ɵngControlUpdate=W1(e,this,this.parseErrorsSource,this.validityMonitor);else throw new _(1914,!1)}ɵngControlUpdate;elementAcceptsNativeProperty(e){if(!this.elementIsNativeFormElement)return!1;switch(e){case`min`:case`max`:return this._elementAcceptsMinMax??=Sx(this.element);case`minLength`:case`maxLength`:return this.elementAcceptsTextualValues;case`disabled`:case`required`:case`readonly`:case`name`:return!0;default:return!1}}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`formField`,``]],inputs:{field:[1,`formField`,`field`]},exportAs:[`formField`],features:[Le([{provide:Ef,useExisting:n},{provide:Fn,useFactory:()=>u(n).interopNgControl},{provide:Mv,useFactory:()=>u(Ef,{self:!0})}]),Ma(`formField`)]})}return n})();var Xx=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`ng-component`]],hostAttrs:[`cdk-text-field-style-loader`,``],decls:0,vars:0,template:function(i,r){},styles:[`textarea.cdk-textarea-autosize {
  resize: none;
}

textarea.cdk-textarea-autosize-measuring {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: auto !important;
  overflow: hidden !important;
}

textarea.cdk-textarea-autosize-measuring-firefox {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: 0 !important;
}

@keyframes cdk-text-field-autofill-start { /*!*/ }
@keyframes cdk-text-field-autofill-end { /*!*/ }
.cdk-text-field-autofill-monitored:-webkit-autofill {
  animation: cdk-text-field-autofill-start 0s 1ms;
}

.cdk-text-field-autofill-monitored:not(:-webkit-autofill) {
  animation: cdk-text-field-autofill-end 0s 1ms;
}
`],encapsulation:2})}return n})();var Y1={passive:!0};var Jx=(()=>{class n{_platform=u(fe);_ngZone=u(I);_renderer=u(Ve).createRenderer(null,null);_styleLoader=u(qe);_monitoredElements=new Map;monitor(e){if(!this._platform.isBrowser)return Re;this._styleLoader.load(Xx);let i=wt(e),r=this._monitoredElements.get(i);if(r)return r.subject;let o=new w,s=`cdk-text-field-autofilled`,a=l=>{l.animationName===`cdk-text-field-autofill-start`&&!i.classList.contains(s)?(i.classList.add(s),this._ngZone.run(()=>o.next({target:l.target,isAutofilled:!0}))):l.animationName===`cdk-text-field-autofill-end`&&i.classList.contains(s)&&(i.classList.remove(s),this._ngZone.run(()=>o.next({target:l.target,isAutofilled:!1})))},c=this._ngZone.runOutsideAngular(()=>(i.classList.add(`cdk-text-field-autofill-monitored`),this._renderer.listen(i,`animationstart`,a,Y1)));return this._monitoredElements.set(i,{subject:o,unlisten:c}),o}stopMonitoring(e){let i=wt(e),r=this._monitoredElements.get(i);r&&(r.unlisten(),r.subject.complete(),i.classList.remove(`cdk-text-field-autofill-monitored`),i.classList.remove(`cdk-text-field-autofilled`),this._monitoredElements.delete(i))}ngOnDestroy(){this._monitoredElements.forEach((e,i)=>this.stopMonitoring(i))}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var Sre=(()=>{class n{_elementRef=u(N);_platform=u(fe);_ngZone=u(I);_renderer=u(ge);_resizeEvents=new w;_previousValue;_initialHeight;_destroyed=new w;_listenerCleanups;_minRows;_maxRows;_enabled=!0;_previousMinRows=-1;_textareaElement;get minRows(){return this._minRows}set minRows(e){this._minRows=Yt(e),this._setMinHeight()}get maxRows(){return this._maxRows}set maxRows(e){this._maxRows=Yt(e),this._setMaxHeight()}get enabled(){return this._enabled}set enabled(e){this._enabled!==e&&((this._enabled=e)?this.resizeToFitContent(!0):this.reset())}get placeholder(){return this._textareaElement.placeholder}set placeholder(e){this._cachedPlaceholderHeight=void 0,e?this._textareaElement.setAttribute(`placeholder`,e):this._textareaElement.removeAttribute(`placeholder`),this._cacheTextareaPlaceholderHeight()}_cachedLineHeight;_cachedPlaceholderHeight;_document=u(M);_hasFocus=!1;_isViewInited=!1;constructor(){u(qe).load(Xx),this._textareaElement=this._elementRef.nativeElement}_setMinHeight(){let e=this.minRows&&this._cachedLineHeight?`${this.minRows*this._cachedLineHeight}px`:null;e&&(this._textareaElement.style.minHeight=e)}_setMaxHeight(){let e=this.maxRows&&this._cachedLineHeight?`${this.maxRows*this._cachedLineHeight}px`:null;e&&(this._textareaElement.style.maxHeight=e)}ngAfterViewInit(){this._platform.isBrowser&&(this._initialHeight=this._textareaElement.style.height,this.resizeToFitContent(),this._ngZone.runOutsideAngular(()=>{this._listenerCleanups=[this._renderer.listen(`window`,`resize`,()=>this._resizeEvents.next()),this._renderer.listen(this._textareaElement,`focus`,this._handleFocusEvent),this._renderer.listen(this._textareaElement,`blur`,this._handleFocusEvent)],this._resizeEvents.pipe(ro(16)).subscribe(()=>{this._cachedLineHeight=this._cachedPlaceholderHeight=void 0,this.resizeToFitContent(!0)})}),this._isViewInited=!0,this.resizeToFitContent(!0))}ngOnDestroy(){this._listenerCleanups?.forEach(e=>e()),this._resizeEvents.complete(),this._destroyed.next(),this._destroyed.complete()}_cacheTextareaLineHeight(){if(this._cachedLineHeight)return;let e=this._textareaElement.cloneNode(!1),i=e.style;e.rows=1,i.position=`absolute`,i.visibility=`hidden`,i.border=`none`,i.padding=`0`,i.height=``,i.minHeight=``,i.maxHeight=``,i.top=i.bottom=i.left=i.right=`auto`,i.overflow=`hidden`,this._textareaElement.parentNode.appendChild(e),this._cachedLineHeight=e.clientHeight,e.remove(),this._setMinHeight(),this._setMaxHeight()}_measureScrollHeight(){let e=this._textareaElement,i=e.style.marginBottom||``,r=this._platform.FIREFOX,o=this._hasFocus,s=r?`cdk-textarea-autosize-measuring-firefox`:`cdk-textarea-autosize-measuring`;o&&(e.style.marginBottom=`${e.clientHeight}px`),e.classList.add(s);let a=e.scrollHeight-4;return e.classList.remove(s),o&&(e.style.marginBottom=i),a}_cacheTextareaPlaceholderHeight(){if(!this._isViewInited||this._cachedPlaceholderHeight!=null)return;if(!this.placeholder){this._cachedPlaceholderHeight=0;return}let e=this._textareaElement.value;this._textareaElement.value=this._textareaElement.placeholder,this._cachedPlaceholderHeight=this._measureScrollHeight(),this._textareaElement.value=e}_handleFocusEvent=e=>{this._hasFocus=e.type===`focus`};ngDoCheck(){this._platform.isBrowser&&this.resizeToFitContent()}resizeToFitContent(e=!1){if(!this._enabled||(this._cacheTextareaLineHeight(),this._cacheTextareaPlaceholderHeight(),!this._cachedLineHeight))return;let i=this._elementRef.nativeElement,r=i.value;if(!e&&this._minRows===this._previousMinRows&&r===this._previousValue)return;let o=this._measureScrollHeight(),s=Math.max(o,this._cachedPlaceholderHeight||0);i.style.height=`${s}px`,this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame<`u`?requestAnimationFrame(()=>this._scrollToCaretPosition(i)):setTimeout(()=>this._scrollToCaretPosition(i))}),this._previousValue=r,this._previousMinRows=this._minRows}reset(){this._initialHeight!==void 0&&(this._textareaElement.style.height=this._initialHeight)}_noopInputHandler(){}_scrollToCaretPosition(e){let{selectionStart:i,selectionEnd:r}=e;!this._destroyed.isStopped&&this._hasFocus&&e.setSelectionRange(i,r)}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`textarea`,`cdkTextareaAutosize`,``]],hostAttrs:[`rows`,`1`,1,`cdk-textarea-autosize`],hostBindings:function(i,r){i&1&&Fe(`input`,function(){return r._noopInputHandler()})},inputs:{minRows:[0,`cdkAutosizeMinRows`,`minRows`],maxRows:[0,`cdkAutosizeMaxRows`,`maxRows`],enabled:[2,`cdkTextareaAutosize`,`enabled`,te],placeholder:`placeholder`},exportAs:[`cdkTextareaAutosize`]})}return n})();var e0=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({})}return n})();var t0=new g(`MAT_INPUT_VALUE_ACCESSOR`);var n0=(()=>{class n{isErrorState(e,i){return!!(e&&e.invalid&&(e.touched||i&&i.submitted))}isSignalErrorState(e){if(!e)return!1;let i=e().invalid(),r=e().touched();return i&&r}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var If=class{_defaultMatcher;_parentFormGroup;_parentForm;_stateChanges;errorState=!1;matcher;ngControl;formField;constructor(t,e,i,r,o){this._defaultMatcher=t,this._parentFormGroup=i,this._parentForm=r,this._stateChanges=o,e?sn(e.field)&&!e.updateValueAndValidity?(this.formField=e,this.ngControl=null):(this.formField=null,this.ngControl=e):this.ngControl=this.formField=null}updateErrorState(){let t=this.errorState,e=this._getCurrentErrorState(this.matcher||this._defaultMatcher);e!==t&&(this.errorState=e,this._stateChanges.next())}_getCurrentErrorState(t){if(this.formField&&t?.isSignalErrorState)return t.isSignalErrorState(this.formField.field())??!1;let e=this._parentFormGroup||this._parentForm,i=this.ngControl?this.ngControl.control:null;return t?.isErrorState(i,e)??!1}};var Z1=[`button`,`checkbox`,`file`,`hidden`,`image`,`radio`,`range`,`reset`,`submit`];var K1=new g(`MAT_INPUT_CONFIG`);var Wre=(()=>{class n{_elementRef=u(N);_platform=u(fe);ngControl=u(Fn,{optional:!0,self:!0});_autofillMonitor=u(Jx);_ngZone=u(I);_formField=u(_v,{optional:!0});_renderer=u(ge);_uid=u(ot).getId(`mat-input-`);_previousNativeValue;_inputValueAccessor;_signalBasedValueAccessor;_previousPlaceholder=null;_errorStateTracker;_config=u(K1,{optional:!0});_cleanupIosKeyup;_cleanupWebkitWheel;_isServer=!1;_isNativeSelect=!1;_isTextarea=!1;_isInFormField=!1;focused=!1;stateChanges=new w;controlType=`mat-input`;autofilled=!1;get disabled(){return this._disabled}set disabled(e){this._disabled=Ct(e),this.focused&&(this.focused=!1,this.stateChanges.next())}_disabled=!1;get id(){return this._id}set id(e){this._id=e||this._uid}_id;placeholder;name;get required(){return this._required??this.ngControl?.control?.hasValidator(Li.required)??!1}set required(e){this._required=Ct(e)}_required;get type(){return this._type}set type(e){this._type=e||`text`,this._validateType(),!this._isTextarea&&Wg().has(this._type)&&(this._elementRef.nativeElement.type=this._type)}_type=`text`;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}userAriaDescribedBy;get value(){return this._signalBasedValueAccessor?this._signalBasedValueAccessor.value():this._inputValueAccessor.value}set value(e){e!==this.value&&(this._signalBasedValueAccessor?this._signalBasedValueAccessor.value.set(e):this._inputValueAccessor.value=e,this.stateChanges.next())}get readonly(){return this._readonly}set readonly(e){this._readonly=Ct(e)}_readonly=!1;disabledInteractive;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}_neverEmptyInputTypes=[`date`,`datetime`,`datetime-local`,`month`,`time`,`week`].filter(e=>Wg().has(e));constructor(){let e=u(kv,{optional:!0}),i=u(Ov,{optional:!0}),r=u(n0),o=u(t0,{optional:!0,self:!0}),s=u(Ef,{optional:!0,self:!0}),a=this._elementRef.nativeElement,c=a.nodeName.toLowerCase();o?sn(o.value)?this._signalBasedValueAccessor=o:this._inputValueAccessor=o:this._inputValueAccessor=a,this._previousNativeValue=this.value,this.id=this.id,this._platform.IOS&&this._ngZone.runOutsideAngular(()=>{this._cleanupIosKeyup=this._renderer.listen(a,`keyup`,this._iOSKeyupListener)}),this._errorStateTracker=new If(r,s||this.ngControl,i,e,this.stateChanges),this._isServer=!this._platform.isBrowser,this._isNativeSelect=c===`select`,this._isTextarea=c===`textarea`,this._isInFormField=!!this._formField,this.disabledInteractive=this._config?.disabledInteractive||!1,this._isNativeSelect&&(this.controlType=a.multiple?`mat-native-select-multiple`:`mat-native-select`),this._signalBasedValueAccessor&&dt(()=>{this._signalBasedValueAccessor.value(),this.stateChanges.next()})}ngAfterViewInit(){this._platform.isBrowser&&this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(e=>{this.autofilled=e.isAutofilled,this.stateChanges.next()})}ngOnChanges(){this.stateChanges.next()}ngOnDestroy(){this.stateChanges.complete(),this._platform.isBrowser&&this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),this._cleanupIosKeyup?.(),this._cleanupWebkitWheel?.()}ngDoCheck(){this.ngControl&&(this.updateErrorState(),this.ngControl.disabled!==null&&this.ngControl.disabled!==this.disabled&&(this.disabled=this.ngControl.disabled,this.stateChanges.next())),this._dirtyCheckNativeValue(),this._dirtyCheckPlaceholder()}focus(e){this._elementRef.nativeElement.focus(e)}updateErrorState(){this._errorStateTracker.updateErrorState()}_focusChanged(e){if(e!==this.focused){if(!this._isNativeSelect&&e&&this.disabled&&this.disabledInteractive){let i=this._elementRef.nativeElement;i.type===`number`?(i.type=`text`,i.setSelectionRange(0,0),i.type=`number`):i.setSelectionRange(0,0)}this.focused=e,this.stateChanges.next()}}_onInput(){}_dirtyCheckNativeValue(){let e=this._elementRef.nativeElement.value;this._previousNativeValue!==e&&(this._previousNativeValue=e,this.stateChanges.next())}_dirtyCheckPlaceholder(){let e=this._getPlaceholder();if(e!==this._previousPlaceholder){let i=this._elementRef.nativeElement;this._previousPlaceholder=e,e?i.setAttribute(`placeholder`,e):i.removeAttribute(`placeholder`)}}_getPlaceholder(){return this.placeholder||null}_validateType(){Z1.indexOf(this._type)}_isNeverEmpty(){return this._neverEmptyInputTypes.indexOf(this._type)>-1}_isBadInput(){let e=this._elementRef.nativeElement.validity;return e&&e.badInput}get empty(){return!this._isNeverEmpty()&&!this._elementRef.nativeElement.value&&!this._isBadInput()&&!this.autofilled}get shouldLabelFloat(){if(this._isNativeSelect){let e=this._elementRef.nativeElement,i=e.options[0];return this.focused||e.multiple||!this.empty||!!(e.selectedIndex>-1&&i&&i.label)}else return this.focused&&!this.disabled||!this.empty}get describedByIds(){return this._elementRef.nativeElement.getAttribute(`aria-describedby`)?.split(` `)||[]}setDescribedByIds(e){let i=this._elementRef.nativeElement;e.length?i.setAttribute(`aria-describedby`,e.join(` `)):i.removeAttribute(`aria-describedby`)}onContainerClick(){this.focused||this.focus()}_isInlineSelect(){let e=this._elementRef.nativeElement;return this._isNativeSelect&&(e.multiple||e.size>1)}_iOSKeyupListener=e=>{let i=e.target;!i.value&&i.selectionStart===0&&i.selectionEnd===0&&(i.setSelectionRange(1,1),i.setSelectionRange(0,0))};_getReadonlyAttribute(){return this._isNativeSelect?null:this.readonly||this.disabled&&this.disabledInteractive?`true`:null}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`input`,`matInput`,``],[`textarea`,`matInput`,``],[`select`,`matNativeControl`,``],[`input`,`matNativeControl`,``],[`textarea`,`matNativeControl`,``]],hostAttrs:[1,`mat-mdc-input-element`],hostVars:21,hostBindings:function(i,r){i&1&&Fe(`focus`,function(){return r._focusChanged(!0)})(`blur`,function(){return r._focusChanged(!1)})(`input`,function(){return r._onInput()}),i&2&&(dn(`id`,r.id)(`disabled`,r.disabled&&!r.disabledInteractive)(`required`,r.required),ie(`name`,r.name||null)(`readonly`,r._getReadonlyAttribute())(`aria-disabled`,r.disabled&&r.disabledInteractive?`true`:null)(`aria-invalid`,r.empty&&r.required?null:r.errorState)(`aria-required`,r.required)(`id`,r.id),J(`mat-input-server`,r._isServer)(`mat-mdc-form-field-textarea-control`,r._isInFormField&&r._isTextarea)(`mat-mdc-form-field-input-control`,r._isInFormField)(`mat-mdc-input-disabled-interactive`,r.disabledInteractive)(`mdc-text-field__input`,r._isInFormField)(`mat-mdc-native-select-inline`,r._isInlineSelect()))},inputs:{disabled:`disabled`,id:`id`,placeholder:`placeholder`,name:`name`,required:`required`,type:`type`,errorStateMatcher:`errorStateMatcher`,userAriaDescribedBy:[0,`aria-describedby`,`userAriaDescribedBy`],value:`value`,readonly:`readonly`,disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,te]},exportAs:[`matInput`],features:[Le([{provide:yv,useExisting:n}]),Be]})}return n})();var Gre=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[bv,bv,e0,we]})}return n})();var Q1=(()=>{class n{get vertical(){return this._vertical}set vertical(e){this._vertical=Ct(e)}_vertical=!1;get inset(){return this._inset}set inset(e){this._inset=Ct(e)}_inset=!1;static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`mat-divider`]],hostAttrs:[`role`,`separator`,1,`mat-divider`],hostVars:7,hostBindings:function(i,r){i&2&&(ie(`aria-orientation`,r.vertical?`vertical`:`horizontal`),J(`mat-divider-vertical`,r.vertical)(`mat-divider-horizontal`,!r.vertical)(`mat-divider-inset`,r.inset))},inputs:{vertical:`vertical`,inset:`inset`},decls:0,vars:0,template:function(i,r){},styles:[`.mat-divider {
  display: block;
  margin: 0;
  border-top-style: solid;
  border-top-color: var(--%NS%mat-divider-color, var(--%NS%mat-sys-outline-variant));
  border-top-width: var(--%NS%mat-divider-width, 1px);
}
.mat-divider.mat-divider-vertical {
  border-top: 0;
  border-right-style: solid;
  border-right-color: var(--%NS%mat-divider-color, var(--%NS%mat-sys-outline-variant));
  border-right-width: var(--%NS%mat-divider-width, 1px);
}
.mat-divider.mat-divider-inset {
  margin-left: 80px;
}
[dir=rtl] .mat-divider.mat-divider-inset {
  margin-left: auto;
  margin-right: 80px;
}
`],encapsulation:2})}return n})();var i0=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[we]})}return n})();var ry=class{_multiple;_emitChanges;compareWith;_selection=new Set;_deselectedToEmit=[];_selectedToEmit=[];_selected=null;get selected(){return this._selected||(this._selected=Array.from(this._selection.values())),this._selected}changed=new w;bulk={select:t=>this._select(t),deselect:t=>this._deselect(t),setSelection:t=>this._setSelection(t)};constructor(t=!1,e,i=!0,r){this._multiple=t,this._emitChanges=i,this.compareWith=r,e&&e.length&&(t?e.forEach(o=>this._markSelected(o)):this._markSelected(e[0]),this._selectedToEmit.length=0)}select(...t){return this._select(t)}deselect(...t){return this._deselect(t)}setSelection(...t){return this._setSelection(t)}toggle(t){return this.isSelected(t)?this.deselect(t):this.select(t)}clear(t=!0){this._unmarkAll();let e=this._hasQueuedChanges();return t&&this._emitChangeEvent(),e}isSelected(t){return this._selection.has(this._getConcreteValue(t))}isEmpty(){return this._selection.size===0}hasValue(){return!this.isEmpty()}sort(t){this._multiple&&this.selected&&this._selected.sort(t)}isMultipleSelection(){return this._multiple}_select(t){this._verifyValueAssignment(t),t.forEach(i=>this._markSelected(i));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_deselect(t){this._verifyValueAssignment(t),t.forEach(i=>this._unmarkSelected(i));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_setSelection(t){this._verifyValueAssignment(t);let e=this.selected,i=new Set(t.map(o=>this._getConcreteValue(o)));t.forEach(o=>this._markSelected(o)),e.filter(o=>!i.has(this._getConcreteValue(o,i))).forEach(o=>this._unmarkSelected(o));let r=this._hasQueuedChanges();return this._emitChangeEvent(),r}_emitChangeEvent(){this._selected=null,(this._selectedToEmit.length||this._deselectedToEmit.length)&&(this.changed.next({source:this,added:this._selectedToEmit,removed:this._deselectedToEmit}),this._deselectedToEmit=[],this._selectedToEmit=[])}_markSelected(t){t=this._getConcreteValue(t),this.isSelected(t)||(this._multiple||this._unmarkAll(),this.isSelected(t)||this._selection.add(t),this._emitChanges&&this._selectedToEmit.push(t))}_unmarkSelected(t){t=this._getConcreteValue(t),this.isSelected(t)&&(this._selection.delete(t),this._emitChanges&&this._deselectedToEmit.push(t))}_unmarkAll(){this.isEmpty()||this._selection.forEach(t=>this._unmarkSelected(t))}_verifyValueAssignment(t){t.length>1&&this._multiple}_hasQueuedChanges(){return!!(this._deselectedToEmit.length||this._selectedToEmit.length)}_getConcreteValue(t,e){if(this.compareWith){e=e??this._selection;for(let i of e)if(this.compareWith(t,i))return i;return t}else return t}};var X1=(()=>{class n{_listeners=[];notify(e,i){for(let r of this._listeners)r(e,i)}listen(e){return this._listeners.push(e),()=>{this._listeners=this._listeners.filter(i=>e!==i)}}ngOnDestroy(){this._listeners=[]}static ɵfac=function(i){return new(i||n)};static ɵprov=b({token:n,factory:n.ɵfac})}return n})();var ooe=(()=>{class n{_animationsDisabled=Je();state=`unchecked`;disabled=!1;appearance=`full`;static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`mat-pseudo-checkbox`]],hostAttrs:[1,`mat-pseudo-checkbox`],hostVars:12,hostBindings:function(i,r){i&2&&J(`mat-pseudo-checkbox-indeterminate`,r.state===`indeterminate`)(`mat-pseudo-checkbox-checked`,r.state===`checked`)(`mat-pseudo-checkbox-disabled`,r.disabled)(`mat-pseudo-checkbox-minimal`,r.appearance===`minimal`)(`mat-pseudo-checkbox-full`,r.appearance===`full`)(`_mat-animation-noopable`,r._animationsDisabled)},inputs:{state:`state`,disabled:`disabled`,appearance:`appearance`},decls:0,vars:0,template:function(i,r){},styles:[`.mat-pseudo-checkbox {
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1), background-color 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox::after {
  position: absolute;
  opacity: 0;
  content: "";
  border-bottom: 2px solid currentColor;
  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-pseudo-checkbox._mat-animation-noopable::after {
  transition: none;
}

.mat-pseudo-checkbox-disabled {
  cursor: default;
}

.mat-pseudo-checkbox-indeterminate::after {
  left: 1px;
  opacity: 1;
  border-radius: 2px;
}

.mat-pseudo-checkbox-checked::after {
  left: 1px;
  border-left: 2px solid currentColor;
  transform: rotate(-45deg);
  opacity: 1;
  box-sizing: content-box;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  color: var(--%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--%NS%mat-sys-primary));
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-pseudo-checkbox-full {
  border-color: var(--%NS%mat-pseudo-checkbox-full-unselected-icon-color, var(--%NS%mat-sys-on-surface-variant));
  border-width: 2px;
  border-style: solid;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled {
  border-color: var(--%NS%mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {
  background-color: var(--%NS%mat-pseudo-checkbox-full-selected-icon-color, var(--%NS%mat-sys-primary));
  border-color: transparent;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  color: var(--%NS%mat-pseudo-checkbox-full-selected-checkmark-color, var(--%NS%mat-sys-on-primary));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {
  background-color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));
}

.mat-pseudo-checkbox {
  width: 18px;
  height: 18px;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after {
  width: 14px;
  height: 6px;
  transform-origin: center;
  top: -4.2426406871px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  top: 8px;
  width: 16px;
}

.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after {
  width: 10px;
  height: 4px;
  transform-origin: center;
  top: -2.8284271247px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  top: 6px;
  width: 12px;
}
`],encapsulation:2})}return n})();var r0=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[we]})}return n})();var o0=[`*`];var J1=`.mdc-list {
  margin: 0;
  padding: 8px 0;
  list-style-type: none;
}
.mdc-list:focus {
  outline: none;
}

.mdc-list-item {
  display: flex;
  position: relative;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
  align-items: stretch;
  cursor: pointer;
  padding-left: 16px;
  padding-right: 16px;
  background-color: var(--%NS%mat-list-list-item-container-color, transparent);
  border-radius: var(--%NS%mat-list-list-item-container-shape, var(--%NS%mat-sys-corner-none));
}
.mdc-list-item.mdc-list-item--selected {
  background-color: var(--%NS%mat-list-list-item-selected-container-color);
}
.mdc-list-item:focus {
  outline: 0;
}
.mdc-list-item.mdc-list-item--disabled {
  cursor: auto;
}
.mdc-list-item.mdc-list-item--with-one-line {
  height: var(--%NS%mat-list-list-item-one-line-container-height, 48px);
}
.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__start {
  align-self: center;
  margin-top: 0;
}
.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__end {
  align-self: center;
  margin-top: 0;
}
.mdc-list-item.mdc-list-item--with-two-lines {
  height: var(--%NS%mat-list-list-item-two-line-container-height, 64px);
}
.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start {
  align-self: flex-start;
  margin-top: 16px;
}
.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__end {
  align-self: center;
  margin-top: 0;
}
.mdc-list-item.mdc-list-item--with-three-lines {
  height: var(--%NS%mat-list-list-item-three-line-container-height, 88px);
}
.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__start {
  align-self: flex-start;
  margin-top: 16px;
}
.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__end {
  align-self: flex-start;
  margin-top: 16px;
}
.mdc-list-item.mdc-list-item--%NS%selected::before, .mdc-list-item.mdc-list-item--%NS%selected:focus::before, .mdc-list-item:not(.mdc-list-item--selected):focus::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  content: "";
  pointer-events: none;
}

a.mdc-list-item {
  color: inherit;
  text-decoration: none;
}

.mdc-list-item__start {
  fill: currentColor;
  flex-shrink: 0;
  pointer-events: none;
}
.mdc-list-item--with-leading-icon .mdc-list-item__start {
  color: var(--%NS%mat-list-list-item-leading-icon-color, var(--%NS%mat-sys-on-surface-variant));
  width: var(--%NS%mat-list-list-item-leading-icon-size, 24px);
  height: var(--%NS%mat-list-list-item-leading-icon-size, 24px);
  margin-left: 16px;
  margin-right: 32px;
}
[dir=rtl] .mdc-list-item--with-leading-icon .mdc-list-item__start {
  margin-left: 32px;
  margin-right: 16px;
}
.mdc-list-item--%NS%with-leading-icon:hover .mdc-list-item__start {
  color: var(--%NS%mat-list-list-item-hover-leading-icon-color);
}
.mdc-list-item--with-leading-avatar .mdc-list-item__start {
  width: var(--%NS%mat-list-list-item-leading-avatar-size, 40px);
  height: var(--%NS%mat-list-list-item-leading-avatar-size, 40px);
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 50%;
}
.mdc-list-item--with-leading-avatar .mdc-list-item__start, [dir=rtl] .mdc-list-item--with-leading-avatar .mdc-list-item__start {
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 50%;
}

.mdc-list-item__end {
  flex-shrink: 0;
  pointer-events: none;
}
.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  font-family: var(--%NS%mat-list-list-item-trailing-supporting-text-font, var(--%NS%mat-sys-label-small-font));
  line-height: var(--%NS%mat-list-list-item-trailing-supporting-text-line-height, var(--%NS%mat-sys-label-small-line-height));
  font-size: var(--%NS%mat-list-list-item-trailing-supporting-text-size, var(--%NS%mat-sys-label-small-size));
  font-weight: var(--%NS%mat-list-list-item-trailing-supporting-text-weight, var(--%NS%mat-sys-label-small-weight));
  letter-spacing: var(--%NS%mat-list-list-item-trailing-supporting-text-tracking, var(--%NS%mat-sys-label-small-tracking));
}
.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  color: var(--%NS%mat-list-list-item-trailing-icon-color, var(--%NS%mat-sys-on-surface-variant));
  width: var(--%NS%mat-list-list-item-trailing-icon-size, 24px);
  height: var(--%NS%mat-list-list-item-trailing-icon-size, 24px);
}
.mdc-list-item--%NS%with-trailing-icon:hover .mdc-list-item__end {
  color: var(--%NS%mat-list-list-item-hover-trailing-icon-color);
}
.mdc-list-item.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  color: var(--%NS%mat-list-list-item-trailing-supporting-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-list-item--selected.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  color: var(--%NS%mat-list-list-item-selected-trailing-icon-color, var(--%NS%mat-sys-primary));
}

.mdc-list-item__content {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  align-self: center;
  flex: 1;
  pointer-events: none;
}
.mdc-list-item--with-two-lines .mdc-list-item__content, .mdc-list-item--with-three-lines .mdc-list-item__content {
  align-self: stretch;
}

.mdc-list-item__primary-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: var(--%NS%mat-list-list-item-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-list-list-item-label-text-font, var(--%NS%mat-sys-body-large-font));
  line-height: var(--%NS%mat-list-list-item-label-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  font-size: var(--%NS%mat-list-list-item-label-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-list-list-item-label-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-list-list-item-label-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}
.mdc-list-item:hover .mdc-list-item__primary-text {
  color: var(--%NS%mat-list-list-item-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mdc-list-item:focus .mdc-list-item__primary-text {
  color: var(--%NS%mat-list-list-item-focus-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mdc-list-item--with-two-lines .mdc-list-item__primary-text, .mdc-list-item--with-three-lines .mdc-list-item__primary-text {
  display: block;
  margin-top: 0;
  line-height: normal;
  margin-bottom: -20px;
}
.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::before {
  display: inline-block;
  width: 0;
  height: 28px;
  content: "";
  vertical-align: 0;
}
.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::after {
  display: inline-block;
  width: 0;
  height: 20px;
  content: "";
  vertical-align: -20px;
}

.mdc-list-item__secondary-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  margin-top: 0;
  color: var(--%NS%mat-list-list-item-supporting-text-color, var(--%NS%mat-sys-on-surface-variant));
  font-family: var(--%NS%mat-list-list-item-supporting-text-font, var(--%NS%mat-sys-body-medium-font));
  line-height: var(--%NS%mat-list-list-item-supporting-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-list-list-item-supporting-text-size, var(--%NS%mat-sys-body-medium-size));
  font-weight: var(--%NS%mat-list-list-item-supporting-text-weight, var(--%NS%mat-sys-body-medium-weight));
  letter-spacing: var(--%NS%mat-list-list-item-supporting-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
}
.mdc-list-item__secondary-text::before {
  display: inline-block;
  width: 0;
  height: 20px;
  content: "";
  vertical-align: 0;
}
.mdc-list-item--with-three-lines .mdc-list-item__secondary-text {
  white-space: normal;
  line-height: 20px;
}
.mdc-list-item--with-overline .mdc-list-item__secondary-text {
  white-space: nowrap;
  line-height: auto;
}

.mdc-list-item--with-leading-radio.mdc-list-item,
.mdc-list-item--with-leading-checkbox.mdc-list-item,
.mdc-list-item--with-leading-icon.mdc-list-item,
.mdc-list-item--with-leading-avatar.mdc-list-item {
  padding-left: 0;
  padding-right: 16px;
}
[dir=rtl] .mdc-list-item--with-leading-radio.mdc-list-item,
[dir=rtl] .mdc-list-item--with-leading-checkbox.mdc-list-item,
[dir=rtl] .mdc-list-item--with-leading-icon.mdc-list-item,
[dir=rtl] .mdc-list-item--with-leading-avatar.mdc-list-item {
  padding-left: 16px;
  padding-right: 0;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {
  display: block;
  margin-top: 0;
  line-height: normal;
  margin-bottom: -20px;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {
  display: inline-block;
  width: 0;
  height: 32px;
  content: "";
  vertical-align: 0;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {
  display: inline-block;
  width: 0;
  height: 20px;
  content: "";
  vertical-align: -20px;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  display: block;
  margin-top: 0;
  line-height: normal;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before {
  display: inline-block;
  width: 0;
  height: 32px;
  content: "";
  vertical-align: 0;
}

.mdc-list-item--with-trailing-icon.mdc-list-item, [dir=rtl] .mdc-list-item--with-trailing-icon.mdc-list-item {
  padding-left: 0;
  padding-right: 0;
}
.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  margin-left: 16px;
  margin-right: 16px;
}

.mdc-list-item--with-trailing-meta.mdc-list-item {
  padding-left: 16px;
  padding-right: 0;
}
[dir=rtl] .mdc-list-item--with-trailing-meta.mdc-list-item {
  padding-left: 0;
  padding-right: 16px;
}
.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  -webkit-user-select: none;
  user-select: none;
  margin-left: 28px;
  margin-right: 16px;
}
[dir=rtl] .mdc-list-item--with-trailing-meta .mdc-list-item__end {
  margin-left: 16px;
  margin-right: 28px;
}
.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end {
  display: block;
  line-height: normal;
  align-self: flex-start;
  margin-top: 0;
}
.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end::before, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end::before {
  display: inline-block;
  width: 0;
  height: 28px;
  content: "";
  vertical-align: 0;
}

.mdc-list-item--with-leading-radio .mdc-list-item__start,
.mdc-list-item--with-leading-checkbox .mdc-list-item__start {
  margin-left: 8px;
  margin-right: 24px;
}
[dir=rtl] .mdc-list-item--with-leading-radio .mdc-list-item__start,
[dir=rtl] .mdc-list-item--with-leading-checkbox .mdc-list-item__start {
  margin-left: 24px;
  margin-right: 8px;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__start,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__start {
  align-self: flex-start;
  margin-top: 8px;
}

.mdc-list-item--with-trailing-radio.mdc-list-item,
.mdc-list-item--with-trailing-checkbox.mdc-list-item {
  padding-left: 16px;
  padding-right: 0;
}
[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item,
[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item {
  padding-left: 0;
  padding-right: 16px;
}
.mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,
.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,
.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {
  padding-left: 0;
}
[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, [dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,
[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,
[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {
  padding-right: 0;
}
.mdc-list-item--with-trailing-radio .mdc-list-item__end,
.mdc-list-item--with-trailing-checkbox .mdc-list-item__end {
  margin-left: 24px;
  margin-right: 8px;
}
[dir=rtl] .mdc-list-item--with-trailing-radio .mdc-list-item__end,
[dir=rtl] .mdc-list-item--with-trailing-checkbox .mdc-list-item__end {
  margin-left: 8px;
  margin-right: 24px;
}
.mdc-list-item--with-trailing-radio.mdc-list-item--with-three-lines .mdc-list-item__end,
.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-three-lines .mdc-list-item__end {
  align-self: flex-start;
  margin-top: 8px;
}

.mdc-list-group__subheader {
  margin: 0.75rem 16px;
}

.mdc-list-item--disabled .mdc-list-item__start,
.mdc-list-item--disabled .mdc-list-item__content,
.mdc-list-item--disabled .mdc-list-item__end {
  opacity: 1;
}
.mdc-list-item--disabled .mdc-list-item__primary-text,
.mdc-list-item--disabled .mdc-list-item__secondary-text {
  opacity: var(--%NS%mat-list-list-item-disabled-label-text-opacity, 0.3);
}
.mdc-list-item--disabled.mdc-list-item--with-leading-icon .mdc-list-item__start {
  color: var(--%NS%mat-list-list-item-disabled-leading-icon-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-list-list-item-disabled-leading-icon-opacity, 0.38);
}
.mdc-list-item--disabled.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  color: var(--%NS%mat-list-list-item-disabled-trailing-icon-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-list-list-item-disabled-trailing-icon-opacity, 0.38);
}

.mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing, [dir=rtl] .mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing {
  padding-left: 0;
  padding-right: 0;
}

.mdc-list-item.mdc-list-item--disabled .mdc-list-item__primary-text {
  color: var(--%NS%mat-list-list-item-disabled-label-text-color, var(--%NS%mat-sys-on-surface));
}

.mdc-list-item:hover::before {
  background-color: var(--%NS%mat-list-list-item-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-list-list-item-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}

.mdc-list-item.mdc-list-item--%NS%disabled::before {
  background-color: var(--%NS%mat-list-list-item-disabled-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-list-list-item-disabled-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}

.mdc-list-item:focus::before {
  background-color: var(--%NS%mat-list-list-item-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-list-list-item-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}

.mdc-list-item--disabled .mdc-radio,
.mdc-list-item--disabled .mdc-checkbox {
  opacity: var(--%NS%mat-list-list-item-disabled-label-text-opacity, 0.3);
}

.mdc-list-item--with-leading-avatar .mat-mdc-list-item-avatar {
  border-radius: var(--%NS%mat-list-list-item-leading-avatar-shape, var(--%NS%mat-sys-corner-full));
  background-color: var(--%NS%mat-list-list-item-leading-avatar-color, var(--%NS%mat-sys-primary-container));
}

.mat-mdc-list-item-icon {
  font-size: var(--%NS%mat-list-list-item-leading-icon-size, 24px);
}

@media (forced-colors: active) {
  a.mdc-list-item--%NS%activated::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  a.mdc-list-item--activated [dir=rtl]::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-list-base {
  display: block;
}
.mat-mdc-list-base .mdc-list-item__start,
.mat-mdc-list-base .mdc-list-item__end,
.mat-mdc-list-base .mdc-list-item__content {
  pointer-events: auto;
}

.mat-mdc-list-item,
.mat-mdc-list-option {
  width: 100%;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-list-item:not(.mat-mdc-list-item-interactive),
.mat-mdc-list-option:not(.mat-mdc-list-item-interactive) {
  cursor: default;
}
.mat-mdc-list-item .mat-divider-inset,
.mat-mdc-list-option .mat-divider-inset {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,
.mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {
  margin-left: 72px;
}
[dir=rtl] .mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,
[dir=rtl] .mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {
  margin-right: 72px;
}

.mat-mdc-list-item-interactive::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  content: "";
  opacity: 0;
  pointer-events: none;
  border-radius: inherit;
}

.mat-mdc-list-item > .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-list-item:focus-visible > .mat-focus-indicator::before {
  content: "";
}

.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-line.mdc-list-item__secondary-text {
  white-space: nowrap;
  line-height: normal;
}
.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-unscoped-content.mdc-list-item__secondary-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

mat-action-list button {
  background: none;
  color: inherit;
  border: none;
  font: inherit;
  outline: inherit;
  -webkit-tap-highlight-color: transparent;
  text-align: start;
}
mat-action-list button::-moz-focus-inner {
  border: 0;
}

.mdc-list-item--with-leading-icon .mdc-list-item__start {
  margin-inline-start: var(--%NS%mat-list-list-item-leading-icon-start-space, 16px);
  margin-inline-end: var(--%NS%mat-list-list-item-leading-icon-end-space, 16px);
}

.mat-mdc-nav-list .mat-mdc-list-item {
  border-radius: var(--%NS%mat-list-active-indicator-shape, var(--%NS%mat-sys-corner-full));
  --%NS%mat-focus-indicator-border-radius: var(--%NS%mat-list-active-indicator-shape, var(--%NS%mat-sys-corner-full));
}
.mat-mdc-nav-list .mat-mdc-list-item.mdc-list-item--activated {
  background-color: var(--%NS%mat-list-active-indicator-color, var(--%NS%mat-sys-secondary-container));
}
`;var ej=[`unscopedContent`];var tj=[`text`];var nj=[[[``,`matListItemAvatar`,``],[``,`matListItemIcon`,``]],[[``,`matListItemTitle`,``]],[[``,`matListItemLine`,``]],`*`,[[``,`matListItemMeta`,``]],[[`mat-divider`]]];var ij=[`[matListItemAvatar],[matListItemIcon]`,`[matListItemTitle]`,`[matListItemLine]`,`*`,`[matListItemMeta]`,`mat-divider`];var rj=new g(`ListOption`);var oj=(()=>{class n{_elementRef=u(N);static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`matListItemTitle`,``]],hostAttrs:[1,`mat-mdc-list-item-title`,`mdc-list-item__primary-text`]})}return n})();var sj=(()=>{class n{_elementRef=u(N);static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`matListItemLine`,``]],hostAttrs:[1,`mat-mdc-list-item-line`,`mdc-list-item__secondary-text`]})}return n})();var aj=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[``,`matListItemMeta`,``]],hostAttrs:[1,`mat-mdc-list-item-meta`,`mdc-list-item__end`]})}return n})();var s0=(()=>{class n{_listOption=u(rj,{optional:!0});_isAlignedAtStart(){return!this._listOption||this._listOption?._getTogglePosition()===`after`}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,hostVars:4,hostBindings:function(i,r){i&2&&J(`mdc-list-item__start`,r._isAlignedAtStart())(`mdc-list-item__end`,!r._isAlignedAtStart())}})}return n})();var cj=(()=>{class n extends s0{static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵdir=D({type:n,selectors:[[``,`matListItemAvatar`,``]],hostAttrs:[1,`mat-mdc-list-item-avatar`],features:[ae]})}return n})();var lj=(()=>{class n extends s0{static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵdir=D({type:n,selectors:[[``,`matListItemIcon`,``]],hostAttrs:[1,`mat-mdc-list-item-icon`],features:[ae]})}return n})();var dj=new g(`MAT_LIST_CONFIG`);var Nc=(()=>{class n{_isNonInteractive=!0;get disableRipple(){return this._disableRipple}set disableRipple(e){this._disableRipple=Ct(e)}_disableRipple=!1;get disabled(){return this._disabled()}set disabled(e){this._disabled.set(Ct(e))}_disabled=C(!1);_defaultOptions=u(dj,{optional:!0});static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,hostVars:1,hostBindings:function(i,r){i&2&&ie(`aria-disabled`,r.disabled)},inputs:{disableRipple:`disableRipple`,disabled:`disabled`}})}return n})();var uj=(()=>{class n{_elementRef=u(N);_ngZone=u(I);_listBase=u(Nc,{optional:!0});_platform=u(fe);_hostElement;_isButtonElement;_noopAnimations=Je();_avatars;_icons;set lines(e){this._explicitLines=Yt(e,null),this._updateItemLines(!1)}_explicitLines=null;get disableRipple(){return this.disabled||this._disableRipple||this._noopAnimations||!!this._listBase?.disableRipple}set disableRipple(e){this._disableRipple=Ct(e)}_disableRipple=!1;get disabled(){return this._disabled()||!!this._listBase?.disabled}set disabled(e){this._disabled.set(Ct(e))}_disabled=C(!1);_subscriptions=new Q;_rippleRenderer=null;_hasUnscopedTextContent=!1;rippleConfig;get rippleDisabled(){return this.disableRipple||!!this.rippleConfig.disabled}constructor(){u(qe).load(os);let e=u(lc,{optional:!0});this.rippleConfig=e||{},this._hostElement=this._elementRef.nativeElement,this._isButtonElement=this._hostElement.nodeName.toLowerCase()===`button`,this._listBase&&!this._listBase._isNonInteractive&&this._initInteractiveListItem(),this._isButtonElement&&!this._hostElement.hasAttribute(`type`)&&this._hostElement.setAttribute(`type`,`button`)}ngAfterViewInit(){this._monitorProjectedLinesAndTitle(),this._updateItemLines(!0)}ngOnDestroy(){this._subscriptions.unsubscribe(),this._rippleRenderer!==null&&this._rippleRenderer._removeTriggerEvents()}_hasIconOrAvatar(){return!!(this._avatars.length||this._icons.length)}_initInteractiveListItem(){this._hostElement.classList.add(`mat-mdc-list-item-interactive`),this._rippleRenderer=new Br(this,this._ngZone,this._hostElement,this._platform,u(T)),this._rippleRenderer.setupTriggerEvents(this._hostElement)}_monitorProjectedLinesAndTitle(){this._ngZone.runOutsideAngular(()=>{this._subscriptions.add(Xt(this._lines.changes,this._titles.changes).subscribe(()=>this._updateItemLines(!1)))})}_updateItemLines(e){if(!this._lines||!this._titles||!this._unscopedContent)return;e&&this._checkDomForUnscopedTextContent();let i=this._explicitLines??this._inferLinesFromContent(),r=this._unscopedContent.nativeElement;if(this._hostElement.classList.toggle(`mat-mdc-list-item-single-line`,i<=1),this._hostElement.classList.toggle(`mdc-list-item--with-one-line`,i<=1),this._hostElement.classList.toggle(`mdc-list-item--with-two-lines`,i===2),this._hostElement.classList.toggle(`mdc-list-item--with-three-lines`,i===3),this._hasUnscopedTextContent){let o=this._titles.length===0&&i===1;r.classList.toggle(`mdc-list-item__primary-text`,o),r.classList.toggle(`mdc-list-item__secondary-text`,!o)}else r.classList.remove(`mdc-list-item__primary-text`),r.classList.remove(`mdc-list-item__secondary-text`)}_inferLinesFromContent(){let e=this._titles.length+this._lines.length;return this._hasUnscopedTextContent&&(e+=1),e}_checkDomForUnscopedTextContent(){this._hasUnscopedTextContent=Array.from(this._unscopedContent.nativeElement.childNodes).filter(e=>e.nodeType!==e.COMMENT_NODE).some(e=>!!(e.textContent&&e.textContent.trim()))}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,contentQueries:function(i,r,o){if(i&1&&un(o,cj,4)(o,lj,4),i&2){let s;oe(s=se())&&(r._avatars=s),oe(s=se())&&(r._icons=s)}},hostVars:4,hostBindings:function(i,r){i&2&&(ie(`aria-disabled`,r.disabled)(`disabled`,r._isButtonElement&&r.disabled||null),J(`mdc-list-item--disabled`,r.disabled))},inputs:{lines:`lines`,disableRipple:`disableRipple`,disabled:`disabled`}})}return n})();var Toe=(()=>{class n extends Nc{_isNonInteractive=!1;static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵcmp=X({type:n,selectors:[[`mat-action-list`]],hostAttrs:[`role`,`group`,1,`mat-mdc-action-list`,`mat-mdc-list-base`,`mdc-list`],exportAs:[`matActionList`],features:[Le([{provide:Nc,useExisting:n}]),ae],ngContentSelectors:o0,decls:1,vars:0,template:function(i,r){i&1&&(Ge(),ee(0))},styles:[`.mdc-list {
  margin: 0;
  padding: 8px 0;
  list-style-type: none;
}
.mdc-list:focus {
  outline: none;
}

.mdc-list-item {
  display: flex;
  position: relative;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
  align-items: stretch;
  cursor: pointer;
  padding-left: 16px;
  padding-right: 16px;
  background-color: var(--%NS%mat-list-list-item-container-color, transparent);
  border-radius: var(--%NS%mat-list-list-item-container-shape, var(--%NS%mat-sys-corner-none));
}
.mdc-list-item.mdc-list-item--selected {
  background-color: var(--%NS%mat-list-list-item-selected-container-color);
}
.mdc-list-item:focus {
  outline: 0;
}
.mdc-list-item.mdc-list-item--disabled {
  cursor: auto;
}
.mdc-list-item.mdc-list-item--with-one-line {
  height: var(--%NS%mat-list-list-item-one-line-container-height, 48px);
}
.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__start {
  align-self: center;
  margin-top: 0;
}
.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__end {
  align-self: center;
  margin-top: 0;
}
.mdc-list-item.mdc-list-item--with-two-lines {
  height: var(--%NS%mat-list-list-item-two-line-container-height, 64px);
}
.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start {
  align-self: flex-start;
  margin-top: 16px;
}
.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__end {
  align-self: center;
  margin-top: 0;
}
.mdc-list-item.mdc-list-item--with-three-lines {
  height: var(--%NS%mat-list-list-item-three-line-container-height, 88px);
}
.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__start {
  align-self: flex-start;
  margin-top: 16px;
}
.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__end {
  align-self: flex-start;
  margin-top: 16px;
}
.mdc-list-item.mdc-list-item--%NS%selected::before, .mdc-list-item.mdc-list-item--%NS%selected:focus::before, .mdc-list-item:not(.mdc-list-item--selected):focus::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  content: "";
  pointer-events: none;
}

a.mdc-list-item {
  color: inherit;
  text-decoration: none;
}

.mdc-list-item__start {
  fill: currentColor;
  flex-shrink: 0;
  pointer-events: none;
}
.mdc-list-item--with-leading-icon .mdc-list-item__start {
  color: var(--%NS%mat-list-list-item-leading-icon-color, var(--%NS%mat-sys-on-surface-variant));
  width: var(--%NS%mat-list-list-item-leading-icon-size, 24px);
  height: var(--%NS%mat-list-list-item-leading-icon-size, 24px);
  margin-left: 16px;
  margin-right: 32px;
}
[dir=rtl] .mdc-list-item--with-leading-icon .mdc-list-item__start {
  margin-left: 32px;
  margin-right: 16px;
}
.mdc-list-item--%NS%with-leading-icon:hover .mdc-list-item__start {
  color: var(--%NS%mat-list-list-item-hover-leading-icon-color);
}
.mdc-list-item--with-leading-avatar .mdc-list-item__start {
  width: var(--%NS%mat-list-list-item-leading-avatar-size, 40px);
  height: var(--%NS%mat-list-list-item-leading-avatar-size, 40px);
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 50%;
}
.mdc-list-item--with-leading-avatar .mdc-list-item__start, [dir=rtl] .mdc-list-item--with-leading-avatar .mdc-list-item__start {
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 50%;
}

.mdc-list-item__end {
  flex-shrink: 0;
  pointer-events: none;
}
.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  font-family: var(--%NS%mat-list-list-item-trailing-supporting-text-font, var(--%NS%mat-sys-label-small-font));
  line-height: var(--%NS%mat-list-list-item-trailing-supporting-text-line-height, var(--%NS%mat-sys-label-small-line-height));
  font-size: var(--%NS%mat-list-list-item-trailing-supporting-text-size, var(--%NS%mat-sys-label-small-size));
  font-weight: var(--%NS%mat-list-list-item-trailing-supporting-text-weight, var(--%NS%mat-sys-label-small-weight));
  letter-spacing: var(--%NS%mat-list-list-item-trailing-supporting-text-tracking, var(--%NS%mat-sys-label-small-tracking));
}
.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  color: var(--%NS%mat-list-list-item-trailing-icon-color, var(--%NS%mat-sys-on-surface-variant));
  width: var(--%NS%mat-list-list-item-trailing-icon-size, 24px);
  height: var(--%NS%mat-list-list-item-trailing-icon-size, 24px);
}
.mdc-list-item--%NS%with-trailing-icon:hover .mdc-list-item__end {
  color: var(--%NS%mat-list-list-item-hover-trailing-icon-color);
}
.mdc-list-item.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  color: var(--%NS%mat-list-list-item-trailing-supporting-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-list-item--selected.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  color: var(--%NS%mat-list-list-item-selected-trailing-icon-color, var(--%NS%mat-sys-primary));
}

.mdc-list-item__content {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  align-self: center;
  flex: 1;
  pointer-events: none;
}
.mdc-list-item--with-two-lines .mdc-list-item__content, .mdc-list-item--with-three-lines .mdc-list-item__content {
  align-self: stretch;
}

.mdc-list-item__primary-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: var(--%NS%mat-list-list-item-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-list-list-item-label-text-font, var(--%NS%mat-sys-body-large-font));
  line-height: var(--%NS%mat-list-list-item-label-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  font-size: var(--%NS%mat-list-list-item-label-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-list-list-item-label-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-list-list-item-label-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}
.mdc-list-item:hover .mdc-list-item__primary-text {
  color: var(--%NS%mat-list-list-item-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mdc-list-item:focus .mdc-list-item__primary-text {
  color: var(--%NS%mat-list-list-item-focus-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mdc-list-item--with-two-lines .mdc-list-item__primary-text, .mdc-list-item--with-three-lines .mdc-list-item__primary-text {
  display: block;
  margin-top: 0;
  line-height: normal;
  margin-bottom: -20px;
}
.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::before {
  display: inline-block;
  width: 0;
  height: 28px;
  content: "";
  vertical-align: 0;
}
.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::after {
  display: inline-block;
  width: 0;
  height: 20px;
  content: "";
  vertical-align: -20px;
}

.mdc-list-item__secondary-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  margin-top: 0;
  color: var(--%NS%mat-list-list-item-supporting-text-color, var(--%NS%mat-sys-on-surface-variant));
  font-family: var(--%NS%mat-list-list-item-supporting-text-font, var(--%NS%mat-sys-body-medium-font));
  line-height: var(--%NS%mat-list-list-item-supporting-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-list-list-item-supporting-text-size, var(--%NS%mat-sys-body-medium-size));
  font-weight: var(--%NS%mat-list-list-item-supporting-text-weight, var(--%NS%mat-sys-body-medium-weight));
  letter-spacing: var(--%NS%mat-list-list-item-supporting-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
}
.mdc-list-item__secondary-text::before {
  display: inline-block;
  width: 0;
  height: 20px;
  content: "";
  vertical-align: 0;
}
.mdc-list-item--with-three-lines .mdc-list-item__secondary-text {
  white-space: normal;
  line-height: 20px;
}
.mdc-list-item--with-overline .mdc-list-item__secondary-text {
  white-space: nowrap;
  line-height: auto;
}

.mdc-list-item--with-leading-radio.mdc-list-item,
.mdc-list-item--with-leading-checkbox.mdc-list-item,
.mdc-list-item--with-leading-icon.mdc-list-item,
.mdc-list-item--with-leading-avatar.mdc-list-item {
  padding-left: 0;
  padding-right: 16px;
}
[dir=rtl] .mdc-list-item--with-leading-radio.mdc-list-item,
[dir=rtl] .mdc-list-item--with-leading-checkbox.mdc-list-item,
[dir=rtl] .mdc-list-item--with-leading-icon.mdc-list-item,
[dir=rtl] .mdc-list-item--with-leading-avatar.mdc-list-item {
  padding-left: 16px;
  padding-right: 0;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {
  display: block;
  margin-top: 0;
  line-height: normal;
  margin-bottom: -20px;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {
  display: inline-block;
  width: 0;
  height: 32px;
  content: "";
  vertical-align: 0;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {
  display: inline-block;
  width: 0;
  height: 20px;
  content: "";
  vertical-align: -20px;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  display: block;
  margin-top: 0;
  line-height: normal;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,
.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,
.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before {
  display: inline-block;
  width: 0;
  height: 32px;
  content: "";
  vertical-align: 0;
}

.mdc-list-item--with-trailing-icon.mdc-list-item, [dir=rtl] .mdc-list-item--with-trailing-icon.mdc-list-item {
  padding-left: 0;
  padding-right: 0;
}
.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  margin-left: 16px;
  margin-right: 16px;
}

.mdc-list-item--with-trailing-meta.mdc-list-item {
  padding-left: 16px;
  padding-right: 0;
}
[dir=rtl] .mdc-list-item--with-trailing-meta.mdc-list-item {
  padding-left: 0;
  padding-right: 16px;
}
.mdc-list-item--with-trailing-meta .mdc-list-item__end {
  -webkit-user-select: none;
  user-select: none;
  margin-left: 28px;
  margin-right: 16px;
}
[dir=rtl] .mdc-list-item--with-trailing-meta .mdc-list-item__end {
  margin-left: 16px;
  margin-right: 28px;
}
.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end {
  display: block;
  line-height: normal;
  align-self: flex-start;
  margin-top: 0;
}
.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end::before, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end::before {
  display: inline-block;
  width: 0;
  height: 28px;
  content: "";
  vertical-align: 0;
}

.mdc-list-item--with-leading-radio .mdc-list-item__start,
.mdc-list-item--with-leading-checkbox .mdc-list-item__start {
  margin-left: 8px;
  margin-right: 24px;
}
[dir=rtl] .mdc-list-item--with-leading-radio .mdc-list-item__start,
[dir=rtl] .mdc-list-item--with-leading-checkbox .mdc-list-item__start {
  margin-left: 24px;
  margin-right: 8px;
}
.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__start,
.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__start {
  align-self: flex-start;
  margin-top: 8px;
}

.mdc-list-item--with-trailing-radio.mdc-list-item,
.mdc-list-item--with-trailing-checkbox.mdc-list-item {
  padding-left: 16px;
  padding-right: 0;
}
[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item,
[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item {
  padding-left: 0;
  padding-right: 16px;
}
.mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,
.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,
.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {
  padding-left: 0;
}
[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, [dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,
[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,
[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {
  padding-right: 0;
}
.mdc-list-item--with-trailing-radio .mdc-list-item__end,
.mdc-list-item--with-trailing-checkbox .mdc-list-item__end {
  margin-left: 24px;
  margin-right: 8px;
}
[dir=rtl] .mdc-list-item--with-trailing-radio .mdc-list-item__end,
[dir=rtl] .mdc-list-item--with-trailing-checkbox .mdc-list-item__end {
  margin-left: 8px;
  margin-right: 24px;
}
.mdc-list-item--with-trailing-radio.mdc-list-item--with-three-lines .mdc-list-item__end,
.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-three-lines .mdc-list-item__end {
  align-self: flex-start;
  margin-top: 8px;
}

.mdc-list-group__subheader {
  margin: 0.75rem 16px;
}

.mdc-list-item--disabled .mdc-list-item__start,
.mdc-list-item--disabled .mdc-list-item__content,
.mdc-list-item--disabled .mdc-list-item__end {
  opacity: 1;
}
.mdc-list-item--disabled .mdc-list-item__primary-text,
.mdc-list-item--disabled .mdc-list-item__secondary-text {
  opacity: var(--%NS%mat-list-list-item-disabled-label-text-opacity, 0.3);
}
.mdc-list-item--disabled.mdc-list-item--with-leading-icon .mdc-list-item__start {
  color: var(--%NS%mat-list-list-item-disabled-leading-icon-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-list-list-item-disabled-leading-icon-opacity, 0.38);
}
.mdc-list-item--disabled.mdc-list-item--with-trailing-icon .mdc-list-item__end {
  color: var(--%NS%mat-list-list-item-disabled-trailing-icon-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-list-list-item-disabled-trailing-icon-opacity, 0.38);
}

.mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing, [dir=rtl] .mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing {
  padding-left: 0;
  padding-right: 0;
}

.mdc-list-item.mdc-list-item--disabled .mdc-list-item__primary-text {
  color: var(--%NS%mat-list-list-item-disabled-label-text-color, var(--%NS%mat-sys-on-surface));
}

.mdc-list-item:hover::before {
  background-color: var(--%NS%mat-list-list-item-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-list-list-item-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}

.mdc-list-item.mdc-list-item--%NS%disabled::before {
  background-color: var(--%NS%mat-list-list-item-disabled-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-list-list-item-disabled-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}

.mdc-list-item:focus::before {
  background-color: var(--%NS%mat-list-list-item-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-list-list-item-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}

.mdc-list-item--disabled .mdc-radio,
.mdc-list-item--disabled .mdc-checkbox {
  opacity: var(--%NS%mat-list-list-item-disabled-label-text-opacity, 0.3);
}

.mdc-list-item--with-leading-avatar .mat-mdc-list-item-avatar {
  border-radius: var(--%NS%mat-list-list-item-leading-avatar-shape, var(--%NS%mat-sys-corner-full));
  background-color: var(--%NS%mat-list-list-item-leading-avatar-color, var(--%NS%mat-sys-primary-container));
}

.mat-mdc-list-item-icon {
  font-size: var(--%NS%mat-list-list-item-leading-icon-size, 24px);
}

@media (forced-colors: active) {
  a.mdc-list-item--%NS%activated::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  a.mdc-list-item--activated [dir=rtl]::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-list-base {
  display: block;
}
.mat-mdc-list-base .mdc-list-item__start,
.mat-mdc-list-base .mdc-list-item__end,
.mat-mdc-list-base .mdc-list-item__content {
  pointer-events: auto;
}

.mat-mdc-list-item,
.mat-mdc-list-option {
  width: 100%;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-list-item:not(.mat-mdc-list-item-interactive),
.mat-mdc-list-option:not(.mat-mdc-list-item-interactive) {
  cursor: default;
}
.mat-mdc-list-item .mat-divider-inset,
.mat-mdc-list-option .mat-divider-inset {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,
.mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {
  margin-left: 72px;
}
[dir=rtl] .mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,
[dir=rtl] .mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {
  margin-right: 72px;
}

.mat-mdc-list-item-interactive::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  content: "";
  opacity: 0;
  pointer-events: none;
  border-radius: inherit;
}

.mat-mdc-list-item > .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-list-item:focus-visible > .mat-focus-indicator::before {
  content: "";
}

.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-line.mdc-list-item__secondary-text {
  white-space: nowrap;
  line-height: normal;
}
.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-unscoped-content.mdc-list-item__secondary-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

mat-action-list button {
  background: none;
  color: inherit;
  border: none;
  font: inherit;
  outline: inherit;
  -webkit-tap-highlight-color: transparent;
  text-align: start;
}
mat-action-list button::-moz-focus-inner {
  border: 0;
}

.mdc-list-item--with-leading-icon .mdc-list-item__start {
  margin-inline-start: var(--%NS%mat-list-list-item-leading-icon-start-space, 16px);
  margin-inline-end: var(--%NS%mat-list-list-item-leading-icon-end-space, 16px);
}

.mat-mdc-nav-list .mat-mdc-list-item {
  border-radius: var(--%NS%mat-list-active-indicator-shape, var(--%NS%mat-sys-corner-full));
  --%NS%mat-focus-indicator-border-radius: var(--%NS%mat-list-active-indicator-shape, var(--%NS%mat-sys-corner-full));
}
.mat-mdc-nav-list .mat-mdc-list-item.mdc-list-item--activated {
  background-color: var(--%NS%mat-list-active-indicator-color, var(--%NS%mat-sys-secondary-container));
}
`],encapsulation:2})}return n})();var Aoe=(()=>{class n extends uj{_lines;_titles;_meta;_unscopedContent;_itemText;get activated(){return this._activated}set activated(e){this._activated=Ct(e)}_activated=!1;_getAriaCurrent(){return this._hostElement.nodeName===`A`&&this._activated?`page`:null}_hasBothLeadingAndTrailing(){return this._meta.length!==0&&(this._avatars.length!==0||this._icons.length!==0)}static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵcmp=X({type:n,selectors:[[`mat-list-item`],[`a`,`mat-list-item`,``],[`button`,`mat-list-item`,``]],contentQueries:function(i,r,o){if(i&1&&un(o,sj,5)(o,oj,5)(o,aj,5),i&2){let s;oe(s=se())&&(r._lines=s),oe(s=se())&&(r._titles=s),oe(s=se())&&(r._meta=s)}},viewQuery:function(i,r){if(i&1&&Nt(ej,5)(tj,5),i&2){let o;oe(o=se())&&(r._unscopedContent=o.first),oe(o=se())&&(r._itemText=o.first)}},hostAttrs:[1,`mat-mdc-list-item`,`mdc-list-item`],hostVars:13,hostBindings:function(i,r){i&2&&(ie(`aria-current`,r._getAriaCurrent()),J(`mdc-list-item--activated`,r.activated)(`mdc-list-item--with-leading-avatar`,r._avatars.length!==0)(`mdc-list-item--with-leading-icon`,r._icons.length!==0)(`mdc-list-item--with-trailing-meta`,r._meta.length!==0)(`mat-mdc-list-item-both-leading-and-trailing`,r._hasBothLeadingAndTrailing())(`_mat-animation-noopable`,r._noopAnimations))},inputs:{activated:`activated`},exportAs:[`matListItem`],features:[ae],ngContentSelectors:ij,decls:10,vars:0,consts:[[`unscopedContent`,``],[1,`mdc-list-item__content`],[1,`mat-mdc-list-item-unscoped-content`,3,`cdkObserveContent`],[1,`mat-focus-indicator`]],template:function(i,r){i&1&&(Ge(nj),ee(0),ue(1,`span`,1),ee(2,1),ee(3,2),ue(4,`span`,2,0),Fe(`cdkObserveContent`,function(){return r._updateItemLines(!0)}),ee(6,3),ve()(),ee(7,4),ee(8,5),rt(9,`div`,3))},dependencies:[OD],encapsulation:2})}return n})();var Roe=(()=>{class n extends Nc{_isNonInteractive=!1;static ɵfac=(()=>{let e;return function(r){return(e||(e=Pe(n)))(r||n)}})();static ɵcmp=X({type:n,selectors:[[`mat-nav-list`]],hostAttrs:[`role`,`navigation`,1,`mat-mdc-nav-list`,`mat-mdc-list-base`,`mdc-list`],exportAs:[`matNavList`],features:[Le([{provide:Nc,useExisting:n}]),ae],ngContentSelectors:o0,decls:1,vars:0,template:function(i,r){i&1&&(Ge(),ee(0))},styles:[J1],encapsulation:2})}return n})();var koe=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[ts,ss,r0,we,i0]})}return n})();export{Mi as $,lR as $n,wu as $r,_t as $t,HJ as A,fne as An,se as Ar,Toe as At,Jn as B,i0 as Bn,uc as Br,Wre as Bt,Fn as C,ex as Cn,rR as Cr,Sre as Ct,Gre as D,fe as Dn,ry as Dr,T as Dt,Gr as E,fc as En,rt as Er,Ste as Et,Ir as F,gP as Fn,st as Fr,V as Ft,Le as G,jt as Gn,ve as Gr,YX as Gt,Ke as H,it as Hn,un as Hr,X1 as Ht,It as I,gc as In,tF as Ir,VE as It,Lk as J,ke as Jn,w as Jr,Zn as Jt,Lg as K,ju as Kn,vr as Kr,Yi as Kt,Iu as L,ge as Ln,te as Lr,Vs as Lt,I as M,ft as Mn,sj as Mr,UP as Mt,IP as N,g as Nn,sn as Nr,Ug as Nt,H as O,ff as On,s1 as Or,Td as Ot,If as P,gE as Pn,ss as Pr,Ur as Pt,Me as Q,kv as Qn,wte as Qr,_ie as Qt,J as R,gr as Rn,u as Rr,W as Rt,Fe as S,ev as Sn,r0 as Sr,SA as St,Gg as T,fT as Tn,rre as Tr,St as Tt,Ku as U,jg as Un,une as Ur,X5 as Ut,Ju as V,ie as Vn,ue as Vr,X as Vt,LN as W,jn as Wn,ut as Wr,Xt as Wt,M as X,koe as Xn,we as Xr,_A as Xt,Ls as Y,ko as Yn,wA as Yr,_ as Yt,Md as Z,kp as Zn,wie as Zr,_P as Zt,EX as _,dt as _n,pc as _r,Rg as _t,Be as a,xg as ai,as as an,mT as ar,OD as at,Ene as b,ee as bn,qe as br,Rw as bt,C as c,yt as ci,ax as cn,oR as cr,Ot as ct,Ct as d,zr as di,bie as dn,oj as dr,Pn as dt,ww as ei,_v as en,le as er,Mu as et,Cu as f,bte as fn,ooe as fr,Q as ft,Dne as g,dne as gn,p as gr,Re as gt,Dd as h,dn as hn,ov as hr,R1 as ht,Aoe as i,xe as ii,aj as in,lv as ir,O0 as it,Ha as j,fs as jn,si as jr,U as jt,HE as k,fk as kn,sR as kr,Te as kt,CX as l,yv as li,b as ln,oe as lr,Ov as lt,DX as m,ce as mn,ot as mr,Qe as mt,$X as n,xF as ni,ae as nn,lne as nr,Nd as nt,Bf as o,xr as oi,at as on,mn as or,Oo as ot,D as p,bv as pn,os as pr,Q1 as pt,Li as q,ka as qn,vv as qr,Yt as qt,$r as r,xd as ri,ai as rn,ls as rr,Nt as rt,Bt as s,xt as si,av as sn,n0 as sr,Op as st,$ as t,x as ti,ac as tn,lj as tr,N as tt,Cie as u,z as ui,bA as un,oi as ur,Pe as ut,Ef as v,e0 as vn,qF as vr,Roe as vt,Ge as w,fQ as wn,re as wr,Ss as wt,F as x,et as xn,qr as xr,S as xt,Ei as y,eE as yn,qX as yr,Rp as yt,Je as z,gv as zn,u1 as zr,WX as zt};