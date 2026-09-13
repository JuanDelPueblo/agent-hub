var PM=Object.defineProperty,FM=Object.defineProperties;var LM=Object.getOwnPropertyDescriptors;var Nb=Object.getOwnPropertySymbols;var jM=Object.prototype.hasOwnProperty,VM=Object.prototype.propertyIsEnumerable;var Ib=(t,n,e)=>n in t?PM(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e,b=(t,n)=>{for(var e in n||={})jM.call(n,e)&&Ib(t,e,n[e]);if(Nb)for(var e of Nb(n))VM.call(n,e)&&Ib(t,e,n[e]);return t},V=(t,n)=>FM(t,LM(n));var Xt=null,nd=!1,Qr=1,BM=null,pt=Symbol("SIGNAL");function se(t){let n=Xt;return Xt=t,n}function id(){return Xt}var ur={version:0,lastCleanEpoch:0,dirty:!1,producers:void 0,producersTail:void 0,consumers:void 0,consumersTail:void 0,recomputing:!1,consumerAllowSignalWrites:!1,consumerIsAlwaysLive:!1,kind:"unknown",producerMustRecompute:()=>!1,producerRecomputeValue:()=>{},consumerMarkedDirty:()=>{},consumerOnSignalRead:()=>{}};function mr(t){if(nd)throw new Error("");if(Xt===null)return;Xt.consumerOnSignalRead(t);let n=Xt.producersTail;if(n!==void 0&&n.producer===t)return;let e,i=Xt.recomputing;if(i&&(e=n!==void 0?n.nextProducer:Xt.producers,e!==void 0&&e.producer===t)){Xt.producersTail=e,e.lastReadVersion=t.version,e.knownValidAtEpoch=Qr;return}let r=t.consumersTail;if(r!==void 0&&r.consumer===Xt&&(!i||r.knownValidAtEpoch===Qr))return;let o=oa(Xt),a={producer:t,consumer:Xt,nextProducer:e,prevConsumer:void 0,knownValidAtEpoch:Qr,lastReadVersion:t.version,nextConsumer:void 0};Xt.producersTail=a,n!==void 0?n.nextProducer=a:Xt.producers=a,o&&Rb(t,a)}function Tb(){Qr++}function Jr(t){if(!(oa(t)&&!t.dirty)&&!(!t.dirty&&t.lastCleanEpoch===Qr)){if(!t.producerMustRecompute(t)&&!ra(t)){ia(t);return}t.producerRecomputeValue(t),ia(t)}}function yh(t){if(t.consumers===void 0)return;let n=nd;nd=!0;try{for(let e=t.consumers;e!==void 0;e=e.nextConsumer){let i=e.consumer;i.dirty||HM(i)}}finally{nd=n}}function Ch(){return Xt?.consumerAllowSignalWrites!==!1}function HM(t){t.dirty=!0,yh(t),t.consumerMarkedDirty?.(t)}function ia(t){t.dirty=!1,t.lastCleanEpoch=Qr}function Fi(t){return t&&kb(t),se(t)}function kb(t){if(t.producersTail?.knownValidAtEpoch===Qr){let n=t.producers;for(;n!==void 0;)n.knownValidAtEpoch=null,n=n.nextProducer}t.producersTail=void 0,t.recomputing=!0}function fr(t,n){se(n),t&&Ab(t)}function Ab(t){t.recomputing=!1;let n=t.producersTail,e=n!==void 0?n.nextProducer:t.producers;if(e!==void 0){if(oa(t))do e=wh(e);while(e!==void 0);n!==void 0?n.nextProducer=void 0:t.producers=void 0}}function ra(t){for(let n=t.producers;n!==void 0;n=n.nextProducer){let e=n.producer,i=n.lastReadVersion;if(i!==e.version||(Jr(e),i!==e.version))return!0}return!1}function hr(t){if(oa(t)){let n=t.producers;for(;n!==void 0;)n=wh(n)}t.producers=void 0,t.producersTail=void 0,t.consumers=void 0,t.consumersTail=void 0}function Rb(t,n){let e=t.consumersTail,i=oa(t);if(e!==void 0?(n.nextConsumer=e.nextConsumer,e.nextConsumer=n):(n.nextConsumer=void 0,t.consumers=n),n.prevConsumer=e,t.consumersTail=n,!i)for(let r=t.producers;r!==void 0;r=r.nextProducer)Rb(r.producer,r)}function wh(t){let n=t.producer,e=t.nextProducer,i=t.nextConsumer,r=t.prevConsumer;if(t.nextConsumer=void 0,t.prevConsumer=void 0,i!==void 0?i.prevConsumer=r:n.consumersTail=r,r!==void 0)r.nextConsumer=i;else if(n.consumers=i,!oa(n)){let o=n.producers;for(;o!==void 0;)o=wh(o)}return e}function oa(t){return t.consumerIsAlwaysLive||t.consumers!==void 0}function Qs(t){BM?.(t)}function Xs(t,n){return Object.is(t,n)}function Ks(t,n){let e=Object.create(UM);e.computation=t,n!==void 0&&(e.equal=n);let i=()=>{if(Jr(e),mr(e),e.value===di)throw e.error;return e.value};return i[pt]=e,Qs(e),i}var Xr=Symbol("UNSET"),Kr=Symbol("COMPUTING"),di=Symbol("ERRORED"),UM=V(b({},ur),{value:Xr,dirty:!0,error:null,equal:Xs,kind:"computed",producerMustRecompute(t){return t.value===Xr||t.value===Kr},producerRecomputeValue(t){if(t.value===Kr)throw new Error("");let n=t.value;t.value=Kr;let e=Fi(t),i,r=!1;try{i=t.computation(),se(null),r=n!==Xr&&n!==di&&i!==di&&t.equal(n,i)}catch(o){i=di,t.error=o}finally{fr(t,e)}if(r){t.value=n;return}t.value=i,t.version++}});function zM(){throw new Error}var Ob=zM;function Pb(t){Ob(t)}function Sh(t){Ob=t}var $M=null;function xh(t,n){let e=Object.create(aa);e.value=t,n!==void 0&&(e.equal=n);let i=()=>Fb(e);return i[pt]=e,Qs(e),[i,a=>pr(e,a),a=>rd(e,a)]}function Fb(t){return mr(t),t.value}function pr(t,n){Ch()||Pb(t),t.equal(t.value,n)||(t.value=n,WM(t))}function rd(t,n){Ch()||Pb(t),pr(t,n(t.value))}var aa=V(b({},ur),{equal:Xs,value:void 0,kind:"signal"});function WM(t){t.version++,Tb(),yh(t),$M?.(t)}var Dh=V(b({},ur),{consumerIsAlwaysLive:!0,consumerAllowSignalWrites:!0,dirty:!0,kind:"effect"});function Eh(t){if(t.dirty=!1,t.version>0&&!ra(t))return;t.version++;let n=Fi(t);try{t.cleanup(),t.fn()}finally{fr(t,n)}}var Mh;function od(){return Mh}function ui(t){let n=Mh;return Mh=t,n}var Lb=Symbol("NotFound");function sa(t){return t===Lb||t?.name==="\u0275NotFound"}function Nh(t,n,e){let i=Object.create(GM);i.source=t,i.computation=n,e!=null&&(i.equal=e);let o=()=>{if(Jr(i),mr(i),i.value===di)throw i.error;return i.value};return o[pt]=i,Qs(i),o}function Ih(t,n){Jr(t),pr(t,n),ia(t)}function jb(t,n){if(Jr(t),t.value===di)throw t.error;rd(t,n),ia(t)}var GM=V(b({},ur),{value:Xr,dirty:!0,error:null,equal:Xs,kind:"linkedSignal",producerMustRecompute(t){return t.value===Xr||t.value===Kr},producerRecomputeValue(t){if(t.value===Kr)throw new Error("");let n=t.value;t.value=Kr;let e=Fi(t),i,r=!1;try{let o=t.source(),a=n!==Xr&&n!==di,s=a?{source:t.sourceValue,value:n}:void 0;i=t.computation(o,s),t.sourceValue=o,se(null),r=a&&i!==di&&t.equal(n,i)}catch(o){i=di,t.error=o}finally{fr(t,e)}if(r){t.value=n;return}t.value=i,t.version++}});function Vb(t){let n=se(null);try{return t()}finally{se(n)}}function Ce(t){return typeof t=="function"}function la(t){let e=t(i=>{Error.call(i),i.stack=new Error().stack});return e.prototype=Object.create(Error.prototype),e.prototype.constructor=e,e}var ad=la(t=>function(e){t(this),this.message=e?`${e.length} errors occurred during unsubscription:
${e.map((i,r)=>`${r+1}) ${i.toString()}`).join(`
  `)}`:"",this.name="UnsubscriptionError",this.errors=e});function eo(t,n){if(t){let e=t.indexOf(n);0<=e&&t.splice(e,1)}}var ce=class t{constructor(n){this.initialTeardown=n,this.closed=!1,this._parentage=null,this._finalizers=null}unsubscribe(){let n;if(!this.closed){this.closed=!0;let{_parentage:e}=this;if(e)if(this._parentage=null,Array.isArray(e))for(let o of e)o.remove(this);else e.remove(this);let{initialTeardown:i}=this;if(Ce(i))try{i()}catch(o){n=o instanceof ad?o.errors:[o]}let{_finalizers:r}=this;if(r){this._finalizers=null;for(let o of r)try{Bb(o)}catch(a){n=n??[],a instanceof ad?n=[...n,...a.errors]:n.push(a)}}if(n)throw new ad(n)}}add(n){var e;if(n&&n!==this)if(this.closed)Bb(n);else{if(n instanceof t){if(n.closed||n._hasParent(this))return;n._addParent(this)}(this._finalizers=(e=this._finalizers)!==null&&e!==void 0?e:[]).push(n)}}_hasParent(n){let{_parentage:e}=this;return e===n||Array.isArray(e)&&e.includes(n)}_addParent(n){let{_parentage:e}=this;this._parentage=Array.isArray(e)?(e.push(n),e):e?[e,n]:n}_removeParent(n){let{_parentage:e}=this;e===n?this._parentage=null:Array.isArray(e)&&eo(e,n)}remove(n){let{_finalizers:e}=this;e&&eo(e,n),n instanceof t&&n._removeParent(this)}};ce.EMPTY=(()=>{let t=new ce;return t.closed=!0,t})();var Th=ce.EMPTY;function sd(t){return t instanceof ce||t&&"closed"in t&&Ce(t.remove)&&Ce(t.add)&&Ce(t.unsubscribe)}function Bb(t){Ce(t)?t():t.unsubscribe()}var Gn={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1};var ca={setTimeout(t,n,...e){let{delegate:i}=ca;return i?.setTimeout?i.setTimeout(t,n,...e):setTimeout(t,n,...e)},clearTimeout(t){let{delegate:n}=ca;return(n?.clearTimeout||clearTimeout)(t)},delegate:void 0};function ld(t){ca.setTimeout(()=>{let{onUnhandledError:n}=Gn;if(n)n(t);else throw t})}function to(){}var Hb=kh("C",void 0,void 0);function Ub(t){return kh("E",void 0,t)}function zb(t){return kh("N",t,void 0)}function kh(t,n,e){return{kind:t,value:n,error:e}}var no=null;function da(t){if(Gn.useDeprecatedSynchronousErrorHandling){let n=!no;if(n&&(no={errorThrown:!1,error:null}),t(),n){let{errorThrown:e,error:i}=no;if(no=null,e)throw i}}else t()}function $b(t){Gn.useDeprecatedSynchronousErrorHandling&&no&&(no.errorThrown=!0,no.error=t)}var io=class extends ce{constructor(n){super(),this.isStopped=!1,n?(this.destination=n,sd(n)&&n.add(this)):this.destination=ZM}static create(n,e,i){return new qn(n,e,i)}next(n){this.isStopped?Rh(zb(n),this):this._next(n)}error(n){this.isStopped?Rh(Ub(n),this):(this.isStopped=!0,this._error(n))}complete(){this.isStopped?Rh(Hb,this):(this.isStopped=!0,this._complete())}unsubscribe(){this.closed||(this.isStopped=!0,super.unsubscribe(),this.destination=null)}_next(n){this.destination.next(n)}_error(n){try{this.destination.error(n)}finally{this.unsubscribe()}}_complete(){try{this.destination.complete()}finally{this.unsubscribe()}}},qM=Function.prototype.bind;function Ah(t,n){return qM.call(t,n)}var Oh=class{constructor(n){this.partialObserver=n}next(n){let{partialObserver:e}=this;if(e.next)try{e.next(n)}catch(i){cd(i)}}error(n){let{partialObserver:e}=this;if(e.error)try{e.error(n)}catch(i){cd(i)}else cd(n)}complete(){let{partialObserver:n}=this;if(n.complete)try{n.complete()}catch(e){cd(e)}}},qn=class extends io{constructor(n,e,i){super();let r;if(Ce(n)||!n)r={next:n??void 0,error:e??void 0,complete:i??void 0};else{let o;this&&Gn.useDeprecatedNextContext?(o=Object.create(n),o.unsubscribe=()=>this.unsubscribe(),r={next:n.next&&Ah(n.next,o),error:n.error&&Ah(n.error,o),complete:n.complete&&Ah(n.complete,o)}):r=n}this.destination=new Oh(r)}};function cd(t){Gn.useDeprecatedSynchronousErrorHandling?$b(t):ld(t)}function YM(t){throw t}function Rh(t,n){let{onStoppedNotification:e}=Gn;e&&ca.setTimeout(()=>e(t,n))}var ZM={closed:!0,next:to,error:YM,complete:to};var ua=typeof Symbol=="function"&&Symbol.observable||"@@observable";function gn(t){return t}function dd(...t){return Ph(t)}function Ph(t){return t.length===0?gn:t.length===1?t[0]:function(e){return t.reduce((i,r)=>r(i),e)}}var le=class t{constructor(n){n&&(this._subscribe=n)}lift(n){let e=new t;return e.source=this,e.operator=n,e}subscribe(n,e,i){let r=XM(n)?n:new qn(n,e,i);return da(()=>{let{operator:o,source:a}=this;r.add(o?o.call(r,a):a?this._subscribe(r):this._trySubscribe(r))}),r}_trySubscribe(n){try{return this._subscribe(n)}catch(e){n.error(e)}}forEach(n,e){return e=Wb(e),new e((i,r)=>{let o=new qn({next:a=>{try{n(a)}catch(s){r(s),o.unsubscribe()}},error:r,complete:i});this.subscribe(o)})}_subscribe(n){var e;return(e=this.source)===null||e===void 0?void 0:e.subscribe(n)}[ua](){return this}pipe(...n){return Ph(n)(this)}toPromise(n){return n=Wb(n),new n((e,i)=>{let r;this.subscribe(o=>r=o,o=>i(o),()=>e(r))})}};le.create=t=>new le(t);function Wb(t){var n;return(n=t??Gn.Promise)!==null&&n!==void 0?n:Promise}function QM(t){return t&&Ce(t.next)&&Ce(t.error)&&Ce(t.complete)}function XM(t){return t&&t instanceof io||QM(t)&&sd(t)}function KM(t){return Ce(t?.lift)}function ve(t){return n=>{if(KM(n))return n.lift(function(e){try{return t(e,this)}catch(i){this.error(i)}});throw new TypeError("Unable to lift unknown Observable type")}}function we(t,n,e,i,r){return new Fh(t,n,e,i,r)}var Fh=class extends io{constructor(n,e,i,r,o,a){super(n),this.onFinalize=o,this.shouldUnsubscribe=a,this._next=e?function(s){try{e(s)}catch(l){n.error(l)}}:super._next,this._error=r?function(s){try{r(s)}catch(l){n.error(l)}finally{this.unsubscribe()}}:super._error,this._complete=i?function(){try{i()}catch(s){n.error(s)}finally{this.unsubscribe()}}:super._complete}unsubscribe(){var n;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){let{closed:e}=this;super.unsubscribe(),!e&&((n=this.onFinalize)===null||n===void 0||n.call(this))}}};var Gb=la(t=>function(){t(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"});var I=class extends le{constructor(){super(),this.closed=!1,this.currentObservers=null,this.observers=[],this.isStopped=!1,this.hasError=!1,this.thrownError=null}lift(n){let e=new ud(this,this);return e.operator=n,e}_throwIfClosed(){if(this.closed)throw new Gb}next(n){da(()=>{if(this._throwIfClosed(),!this.isStopped){this.currentObservers||(this.currentObservers=Array.from(this.observers));for(let e of this.currentObservers)e.next(n)}})}error(n){da(()=>{if(this._throwIfClosed(),!this.isStopped){this.hasError=this.isStopped=!0,this.thrownError=n;let{observers:e}=this;for(;e.length;)e.shift().error(n)}})}complete(){da(()=>{if(this._throwIfClosed(),!this.isStopped){this.isStopped=!0;let{observers:n}=this;for(;n.length;)n.shift().complete()}})}unsubscribe(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null}get observed(){var n;return((n=this.observers)===null||n===void 0?void 0:n.length)>0}_trySubscribe(n){return this._throwIfClosed(),super._trySubscribe(n)}_subscribe(n){return this._throwIfClosed(),this._checkFinalizedStatuses(n),this._innerSubscribe(n)}_innerSubscribe(n){let{hasError:e,isStopped:i,observers:r}=this;return e||i?Th:(this.currentObservers=null,r.push(n),new ce(()=>{this.currentObservers=null,eo(r,n)}))}_checkFinalizedStatuses(n){let{hasError:e,thrownError:i,isStopped:r}=this;e?n.error(i):r&&n.complete()}asObservable(){let n=new le;return n.source=this,n}};I.create=(t,n)=>new ud(t,n);var ud=class extends I{constructor(n,e){super(),this.destination=n,this.source=e}next(n){var e,i;(i=(e=this.destination)===null||e===void 0?void 0:e.next)===null||i===void 0||i.call(e,n)}error(n){var e,i;(i=(e=this.destination)===null||e===void 0?void 0:e.error)===null||i===void 0||i.call(e,n)}complete(){var n,e;(e=(n=this.destination)===null||n===void 0?void 0:n.complete)===null||e===void 0||e.call(n)}_subscribe(n){var e,i;return(i=(e=this.source)===null||e===void 0?void 0:e.subscribe(n))!==null&&i!==void 0?i:Th}};var Et=class extends I{constructor(n){super(),this._value=n}get value(){return this.getValue()}_subscribe(n){let e=super._subscribe(n);return!e.closed&&n.next(this._value),e}getValue(){let{hasError:n,thrownError:e,_value:i}=this;if(n)throw e;return this._throwIfClosed(),i}next(n){super.next(this._value=n)}};var Js={now(){return(Js.delegate||Date).now()},delegate:void 0};var Li=class extends I{constructor(n=1/0,e=1/0,i=Js){super(),this._bufferSize=n,this._windowTime=e,this._timestampProvider=i,this._buffer=[],this._infiniteTimeWindow=!0,this._infiniteTimeWindow=e===1/0,this._bufferSize=Math.max(1,n),this._windowTime=Math.max(1,e)}next(n){let{isStopped:e,_buffer:i,_infiniteTimeWindow:r,_timestampProvider:o,_windowTime:a}=this;e||(i.push(n),!r&&i.push(o.now()+a)),this._trimBuffer(),super.next(n)}_subscribe(n){this._throwIfClosed(),this._trimBuffer();let e=this._innerSubscribe(n),{_infiniteTimeWindow:i,_buffer:r}=this,o=r.slice();for(let a=0;a<o.length&&!n.closed;a+=i?1:2)n.next(o[a]);return this._checkFinalizedStatuses(n),e}_trimBuffer(){let{_bufferSize:n,_timestampProvider:e,_buffer:i,_infiniteTimeWindow:r}=this,o=(r?1:2)*n;if(n<1/0&&o<i.length&&i.splice(0,i.length-o),!r){let a=e.now(),s=0;for(let l=1;l<i.length&&i[l]<=a;l+=2)s=l;s&&i.splice(0,s+1)}}};var md=class extends ce{constructor(n,e){super()}schedule(n,e=0){return this}};var el={setInterval(t,n,...e){let{delegate:i}=el;return i?.setInterval?i.setInterval(t,n,...e):setInterval(t,n,...e)},clearInterval(t){let{delegate:n}=el;return(n?.clearInterval||clearInterval)(t)},delegate:void 0};var fd=class extends md{constructor(n,e){super(n,e),this.scheduler=n,this.work=e,this.pending=!1}schedule(n,e=0){var i;if(this.closed)return this;this.state=n;let r=this.id,o=this.scheduler;return r!=null&&(this.id=this.recycleAsyncId(o,r,e)),this.pending=!0,this.delay=e,this.id=(i=this.id)!==null&&i!==void 0?i:this.requestAsyncId(o,this.id,e),this}requestAsyncId(n,e,i=0){return el.setInterval(n.flush.bind(n,this),i)}recycleAsyncId(n,e,i=0){if(i!=null&&this.delay===i&&this.pending===!1)return e;e!=null&&el.clearInterval(e)}execute(n,e){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;let i=this._execute(n,e);if(i)return i;this.pending===!1&&this.id!=null&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))}_execute(n,e){let i=!1,r;try{this.work(n)}catch(o){i=!0,r=o||new Error("Scheduled action threw falsy error")}if(i)return this.unsubscribe(),r}unsubscribe(){if(!this.closed){let{id:n,scheduler:e}=this,{actions:i}=e;this.work=this.state=this.scheduler=null,this.pending=!1,eo(i,this),n!=null&&(this.id=this.recycleAsyncId(e,n,null)),this.delay=null,super.unsubscribe()}}};var Lh=(()=>{class t{constructor(e,i=t.now){this.schedulerActionCtor=e,this.now=i}schedule(e,i=0,r){return new this.schedulerActionCtor(this,e).schedule(r,i)}}return t.now=Js.now,t})();var hd=class extends Lh{constructor(n,e=Lh.now){super(n,e),this.actions=[],this._active=!1}flush(n){let{actions:e}=this;if(this._active){e.push(n);return}let i;this._active=!0;do if(i=n.execute(n.state,n.delay))break;while(n=e.shift());if(this._active=!1,i){for(;n=e.shift();)n.unsubscribe();throw i}}};var ro=new hd(fd),qb=ro;var at=new le(t=>t.complete());function pd(t){return t&&Ce(t.schedule)}function jh(t){return t[t.length-1]}function gd(t){return Ce(jh(t))?t.pop():void 0}function mi(t){return pd(jh(t))?t.pop():void 0}function Yb(t,n){return typeof jh(t)=="number"?t.pop():n}function Qb(t,n,e,i){function r(o){return o instanceof e?o:new e(function(a){a(o)})}return new(e||(e=Promise))(function(o,a){function s(u){try{d(i.next(u))}catch(h){a(h)}}function l(u){try{d(i.throw(u))}catch(h){a(h)}}function d(u){u.done?o(u.value):r(u.value).then(s,l)}d((i=i.apply(t,n||[])).next())})}function Zb(t){var n=typeof Symbol=="function"&&Symbol.iterator,e=n&&t[n],i=0;if(e)return e.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&i>=t.length&&(t=void 0),{value:t&&t[i++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}function oo(t){return this instanceof oo?(this.v=t,this):new oo(t)}function Xb(t,n,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=e.apply(t,n||[]),r,o=[];return r=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),s("next"),s("throw"),s("return",a),r[Symbol.asyncIterator]=function(){return this},r;function a(v){return function(x){return Promise.resolve(x).then(v,h)}}function s(v,x){i[v]&&(r[v]=function(A){return new Promise(function(re,oe){o.push([v,A,re,oe])>1||l(v,A)})},x&&(r[v]=x(r[v])))}function l(v,x){try{d(i[v](x))}catch(A){_(o[0][3],A)}}function d(v){v.value instanceof oo?Promise.resolve(v.value.v).then(u,h):_(o[0][2],v)}function u(v){l("next",v)}function h(v){l("throw",v)}function _(v,x){v(x),o.shift(),o.length&&l(o[0][0],o[0][1])}}function Kb(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=t[Symbol.asyncIterator],e;return n?n.call(t):(t=typeof Zb=="function"?Zb(t):t[Symbol.iterator](),e={},i("next"),i("throw"),i("return"),e[Symbol.asyncIterator]=function(){return this},e);function i(o){e[o]=t[o]&&function(a){return new Promise(function(s,l){a=t[o](a),r(s,l,a.done,a.value)})}}function r(o,a,s,l){Promise.resolve(l).then(function(d){o({value:d,done:s})},a)}}var _d=(t=>t&&typeof t.length=="number"&&typeof t!="function");function vd(t){return Ce(t?.then)}function bd(t){return Ce(t[ua])}function yd(t){return Symbol.asyncIterator&&Ce(t?.[Symbol.asyncIterator])}function Cd(t){return new TypeError(`You provided ${t!==null&&typeof t=="object"?"an invalid object":`'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)}function JM(){return typeof Symbol!="function"||!Symbol.iterator?"@@iterator":Symbol.iterator}var wd=JM();function Sd(t){return Ce(t?.[wd])}function xd(t){return Xb(this,arguments,function*(){let e=t.getReader();try{for(;;){let{value:i,done:r}=yield oo(e.read());if(r)return yield oo(void 0);yield yield oo(i)}}finally{e.releaseLock()}})}function Dd(t){return Ce(t?.getReader)}function $e(t){if(t instanceof le)return t;if(t!=null){if(bd(t))return eN(t);if(_d(t))return tN(t);if(vd(t))return nN(t);if(yd(t))return Jb(t);if(Sd(t))return iN(t);if(Dd(t))return rN(t)}throw Cd(t)}function eN(t){return new le(n=>{let e=t[ua]();if(Ce(e.subscribe))return e.subscribe(n);throw new TypeError("Provided object does not correctly implement Symbol.observable")})}function tN(t){return new le(n=>{for(let e=0;e<t.length&&!n.closed;e++)n.next(t[e]);n.complete()})}function nN(t){return new le(n=>{t.then(e=>{n.closed||(n.next(e),n.complete())},e=>n.error(e)).then(null,ld)})}function iN(t){return new le(n=>{for(let e of t)if(n.next(e),n.closed)return;n.complete()})}function Jb(t){return new le(n=>{oN(t,n).catch(e=>n.error(e))})}function rN(t){return Jb(xd(t))}function oN(t,n){var e,i,r,o;return Qb(this,void 0,void 0,function*(){try{for(e=Kb(t);i=yield e.next(),!i.done;){let a=i.value;if(n.next(a),n.closed)return}}catch(a){r={error:a}}finally{try{i&&!i.done&&(o=e.return)&&(yield o.call(e))}finally{if(r)throw r.error}}n.complete()})}function un(t,n,e,i=0,r=!1){let o=n.schedule(function(){e(),r?t.add(this.schedule(null,i)):this.unsubscribe()},i);if(t.add(o),!r)return o}function Ed(t,n=0){return ve((e,i)=>{e.subscribe(we(i,r=>un(i,t,()=>i.next(r),n),()=>un(i,t,()=>i.complete(),n),r=>un(i,t,()=>i.error(r),n)))})}function Md(t,n=0){return ve((e,i)=>{i.add(t.schedule(()=>e.subscribe(i),n))})}function ey(t,n){return $e(t).pipe(Md(n),Ed(n))}function ty(t,n){return $e(t).pipe(Md(n),Ed(n))}function ny(t,n){return new le(e=>{let i=0;return n.schedule(function(){i===t.length?e.complete():(e.next(t[i++]),e.closed||this.schedule())})})}function iy(t,n){return new le(e=>{let i;return un(e,n,()=>{i=t[wd](),un(e,n,()=>{let r,o;try{({value:r,done:o}=i.next())}catch(a){e.error(a);return}o?e.complete():e.next(r)},0,!0)}),()=>Ce(i?.return)&&i.return()})}function Nd(t,n){if(!t)throw new Error("Iterable cannot be null");return new le(e=>{un(e,n,()=>{let i=t[Symbol.asyncIterator]();un(e,n,()=>{i.next().then(r=>{r.done?e.complete():e.next(r.value)})},0,!0)})})}function ry(t,n){return Nd(xd(t),n)}function oy(t,n){if(t!=null){if(bd(t))return ey(t,n);if(_d(t))return ny(t,n);if(vd(t))return ty(t,n);if(yd(t))return Nd(t,n);if(Sd(t))return iy(t,n);if(Dd(t))return ry(t,n)}throw Cd(t)}function st(t,n){return n?oy(t,n):$e(t)}function ne(...t){let n=mi(t);return st(t,n)}function tl(t,n){let e=Ce(t)?t:()=>t,i=r=>r.error(e());return new le(n?r=>n.schedule(i,0,r):i)}function nl(t){return!!t&&(t instanceof le||Ce(t.lift)&&Ce(t.subscribe))}var ji=la(t=>function(){t(this),this.name="EmptyError",this.message="no elements in sequence"});function Vh(t,n){let e=typeof n=="object";return new Promise((i,r)=>{let o=new qn({next:a=>{i(a),o.unsubscribe()},error:r,complete:()=>{e?i(n.defaultValue):r(new ji)}});t.subscribe(o)})}function ay(t){return t instanceof Date&&!isNaN(t)}function J(t,n){return ve((e,i)=>{let r=0;e.subscribe(we(i,o=>{i.next(t.call(n,o,r++))}))})}var{isArray:aN}=Array;function sN(t,n){return aN(n)?t(...n):t(n)}function Id(t){return J(n=>sN(t,n))}var{isArray:lN}=Array,{getPrototypeOf:cN,prototype:dN,keys:uN}=Object;function Td(t){if(t.length===1){let n=t[0];if(lN(n))return{args:n,keys:null};if(mN(n)){let e=uN(n);return{args:e.map(i=>n[i]),keys:e}}}return{args:t,keys:null}}function mN(t){return t&&typeof t=="object"&&cN(t)===dN}function kd(t,n){return t.reduce((e,i,r)=>(e[i]=n[r],e),{})}function il(...t){let n=mi(t),e=gd(t),{args:i,keys:r}=Td(t);if(i.length===0)return st([],n);let o=new le(fN(i,n,r?a=>kd(r,a):gn));return e?o.pipe(Id(e)):o}function fN(t,n,e=gn){return i=>{sy(n,()=>{let{length:r}=t,o=new Array(r),a=r,s=r;for(let l=0;l<r;l++)sy(n,()=>{let d=st(t[l],n),u=!1;d.subscribe(we(i,h=>{o[l]=h,u||(u=!0,s--),s||i.next(e(o.slice()))},()=>{--a||i.complete()}))},i)},i)}}function sy(t,n,e){t?un(e,t,n):n()}function ly(t,n,e,i,r,o,a,s){let l=[],d=0,u=0,h=!1,_=()=>{h&&!l.length&&!d&&n.complete()},v=A=>d<i?x(A):l.push(A),x=A=>{o&&n.next(A),d++;let re=!1;$e(e(A,u++)).subscribe(we(n,oe=>{r?.(oe),o?v(oe):n.next(oe)},()=>{re=!0},void 0,()=>{if(re)try{for(d--;l.length&&d<i;){let oe=l.shift();a?un(n,a,()=>x(oe)):x(oe)}_()}catch(oe){n.error(oe)}}))};return t.subscribe(we(n,v,()=>{h=!0,_()})),()=>{s?.()}}function Pt(t,n,e=1/0){return Ce(n)?Pt((i,r)=>J((o,a)=>n(i,o,r,a))($e(t(i,r))),e):(typeof n=="number"&&(e=n),ve((i,r)=>ly(i,r,t,e)))}function gr(t=1/0){return Pt(gn,t)}function cy(){return gr(1)}function fi(...t){return cy()(st(t,mi(t)))}function Yn(t){return new le(n=>{$e(t()).subscribe(n)})}function rl(...t){let n=gd(t),{args:e,keys:i}=Td(t),r=new le(o=>{let{length:a}=e;if(!a){o.complete();return}let s=new Array(a),l=a,d=a;for(let u=0;u<a;u++){let h=!1;$e(e[u]).subscribe(we(o,_=>{h||(h=!0,d--),s[u]=_},()=>l--,void 0,()=>{(!l||!h)&&(d||o.next(i?kd(i,s):s),o.complete())}))}});return n?r.pipe(Id(n)):r}function ao(t=0,n,e=qb){let i=-1;return n!=null&&(pd(n)?e=n:i=n),new le(r=>{let o=ay(t)?+t-e.now():t;o<0&&(o=0);let a=0;return e.schedule(function(){r.closed||(r.next(a++),0<=i?this.schedule(void 0,i):r.complete())},o)})}function mt(...t){let n=mi(t),e=Yb(t,1/0),i=t;return i.length?i.length===1?$e(i[0]):gr(e)(st(i,n)):at}function ue(t,n){return ve((e,i)=>{let r=0;e.subscribe(we(i,o=>t.call(n,o,r++)&&i.next(o)))})}function dy(t){return ve((n,e)=>{let i=!1,r=null,o=null,a=!1,s=()=>{if(o?.unsubscribe(),o=null,i){i=!1;let d=r;r=null,e.next(d)}a&&e.complete()},l=()=>{o=null,a&&e.complete()};n.subscribe(we(e,d=>{i=!0,r=d,o||$e(t(d)).subscribe(o=we(e,s,l))},()=>{a=!0,(!i||!o||o.closed)&&e.complete()}))})}function ma(t,n=ro){return dy(()=>ao(t,n))}function _r(t){return ve((n,e)=>{let i=null,r=!1,o;i=n.subscribe(we(e,void 0,void 0,a=>{o=$e(t(a,_r(t)(n))),i?(i.unsubscribe(),i=null,o.subscribe(e)):r=!0})),r&&(i.unsubscribe(),i=null,o.subscribe(e))})}function so(t,n){return Ce(n)?Pt(t,n,1):Pt(t,1)}function Zn(t,n=ro){return ve((e,i)=>{let r=null,o=null,a=null,s=()=>{if(r){r.unsubscribe(),r=null;let d=o;o=null,i.next(d)}};function l(){let d=a+t,u=n.now();if(u<d){r=this.schedule(void 0,d-u),i.add(r);return}s()}e.subscribe(we(i,d=>{o=d,a=n.now(),r||(r=n.schedule(l,t),i.add(r))},()=>{s(),i.complete()},void 0,()=>{o=r=null}))})}function uy(t){return ve((n,e)=>{let i=!1;n.subscribe(we(e,r=>{i=!0,e.next(r)},()=>{i||e.next(t),e.complete()}))})}function Le(t){return t<=0?()=>at:ve((n,e)=>{let i=0;n.subscribe(we(e,r=>{++i<=t&&(e.next(r),t<=i&&e.complete())}))})}function my(){return ve((t,n)=>{t.subscribe(we(n,to))})}function fa(t){return J(()=>t)}function Bh(t,n){return n?e=>fi(n.pipe(Le(1),my()),e.pipe(Bh(t))):Pt((e,i)=>$e(t(e,i)).pipe(Le(1),fa(e)))}function Hh(t,n=ro){let e=ao(t,n);return Bh(()=>e)}function Ad(t,n=gn){return t=t??hN,ve((e,i)=>{let r,o=!0;e.subscribe(we(i,a=>{let s=n(a);(o||!t(r,s))&&(o=!1,r=s,i.next(a))}))})}function hN(t,n){return t===n}function fy(t=pN){return ve((n,e)=>{let i=!1;n.subscribe(we(e,r=>{i=!0,e.next(r)},()=>i?e.complete():e.error(t())))})}function pN(){return new ji}function lo(t){return ve((n,e)=>{try{n.subscribe(e)}finally{e.add(t)}})}function Vi(t,n){let e=arguments.length>=2;return i=>i.pipe(t?ue((r,o)=>t(r,o,i)):gn,Le(1),e?uy(n):fy(()=>new ji))}function Rd(t){return t<=0?()=>at:ve((n,e)=>{let i=[];n.subscribe(we(e,r=>{i.push(r),t<i.length&&i.shift()},()=>{for(let r of i)e.next(r);e.complete()},void 0,()=>{i=null}))})}function Od(){return ve((t,n)=>{let e,i=!1;t.subscribe(we(n,r=>{let o=e;e=r,i&&n.next([o,r]),i=!0}))})}function ol(t={}){let{connector:n=()=>new I,resetOnError:e=!0,resetOnComplete:i=!0,resetOnRefCountZero:r=!0}=t;return o=>{let a,s,l,d=0,u=!1,h=!1,_=()=>{s?.unsubscribe(),s=void 0},v=()=>{_(),a=l=void 0,u=h=!1},x=()=>{let A=a;v(),A?.unsubscribe()};return ve((A,re)=>{d++,!h&&!u&&_();let oe=l=l??n();re.add(()=>{d--,d===0&&!h&&!u&&(s=Uh(x,r))}),oe.subscribe(re),!a&&d>0&&(a=new qn({next:Qe=>oe.next(Qe),error:Qe=>{h=!0,_(),s=Uh(v,e,Qe),oe.error(Qe)},complete:()=>{u=!0,_(),s=Uh(v,i),oe.complete()}}),$e(A).subscribe(a))})(o)}}function Uh(t,n,...e){if(n===!0){t();return}if(n===!1)return;let i=new qn({next:()=>{i.unsubscribe(),t()}});return $e(n(...e)).subscribe(i)}function Pd(t,n,e){let i,r=!1;return t&&typeof t=="object"?{bufferSize:i=1/0,windowTime:n=1/0,refCount:r=!1,scheduler:e}=t:i=t??1/0,ol({connector:()=>new Li(i,n,e),resetOnError:!0,resetOnComplete:!1,resetOnRefCountZero:r})}function co(t){return ue((n,e)=>t<=e)}function qe(...t){let n=mi(t);return ve((e,i)=>{(n?fi(t,e,n):fi(t,e)).subscribe(i)})}function gt(t,n){return ve((e,i)=>{let r=null,o=0,a=!1,s=()=>a&&!r&&i.complete();e.subscribe(we(i,l=>{r?.unsubscribe();let d=0,u=o++;$e(t(l,u)).subscribe(r=we(i,h=>i.next(n?n(l,h,u,d++):h),()=>{r=null,s()}))},()=>{a=!0,s()}))})}function he(t){return ve((n,e)=>{$e(t).subscribe(we(e,()=>e.complete(),to)),!e.closed&&n.subscribe(e)})}function zh(t,n=!1){return ve((e,i)=>{let r=0;e.subscribe(we(i,o=>{let a=t(o,r++);(a||n)&&i.next(o),!a&&i.complete()}))})}function Ft(t,n,e){let i=Ce(t)||n||e?{next:t,error:n,complete:e}:t;return i?ve((r,o)=>{var a;(a=i.subscribe)===null||a===void 0||a.call(i);let s=!0;r.subscribe(we(o,l=>{var d;(d=i.next)===null||d===void 0||d.call(i,l),o.next(l)},()=>{var l;s=!1,(l=i.complete)===null||l===void 0||l.call(i),o.complete()},l=>{var d;s=!1,(d=i.error)===null||d===void 0||d.call(i,l),o.error(l)},()=>{var l,d;s&&((l=i.unsubscribe)===null||l===void 0||l.call(i)),(d=i.finalize)===null||d===void 0||d.call(i)}))}):gn}var Ud="https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss",H=class extends Error{code;constructor(n,e){super(pi(n,e)),this.code=n}};function gN(t){return`NG0${Math.abs(t)}`}function pi(t,n){return`${gN(t)}${n?": "+n:""}`}function Be(t){for(let n in t)if(t[n]===Be)return n;throw Error("")}function by(t,n){for(let e in n)Object.hasOwn(n,e)&&!Object.hasOwn(t,e)&&(t[e]=n[e])}function ml(t){if(typeof t=="string")return t;if(Array.isArray(t))return`[${t.map(ml).join(", ")}]`;if(t==null)return""+t;let n=t.overriddenName||t.name;if(n)return`${n}`;let e=t.toString();if(e==null)return""+e;let i=e.indexOf(`
`);return i>=0?e.slice(0,i):e}function zd(t,n){return t?n?`${t} ${n}`:t:n||""}var _N=Be({__forward_ref__:Be});function Jt(t){return t.__forward_ref__=Jt,t}function kt(t){return rp(t)?t():t}function rp(t){return typeof t=="function"&&Object.hasOwn(t,_N)&&t.__forward_ref__===Jt}function me(t){return{token:t.token,providedIn:t.providedIn||null,factory:t.factory,value:void 0}}function Z(t){return{providers:t.providers||[],imports:t.imports||[]}}function fl(t){return vN(t,$d)}function op(t){return fl(t)!==null}function vN(t,n){return Object.hasOwn(t,n)&&t[n]||null}function bN(t){let n=t?.[$d]??null;return n||null}function Wh(t){return t&&Object.hasOwn(t,Ld)?t[Ld]:null}var $d=Be({\u0275prov:Be}),Ld=Be({\u0275inj:Be}),C=class{_desc;ngMetadataName="InjectionToken";\u0275prov;constructor(n,e){this._desc=n,this.\u0275prov=void 0,typeof e=="number"?this.__NG_ELEMENT_ID__=e:e!==void 0&&(this.\u0275prov=me({token:this,providedIn:e.providedIn||"root",factory:e.factory}))}get multi(){return this}toString(){return`InjectionToken ${this._desc}`}};function ap(t){return t&&!!t.\u0275providers}var hl=Be({\u0275cmp:Be}),pl=Be({\u0275dir:Be}),sp=Be({\u0275pipe:Be}),lp=Be({\u0275mod:Be}),ll=Be({\u0275fac:Be}),_o=Be({__NG_ELEMENT_ID__:Be}),hy=Be({__NG_ENV_ID__:Be});function yy(t){return Gd(t,"@NgModule"),t[lp]||null}function br(t){return Gd(t,"@Component"),t[hl]||null}function Wd(t){return Gd(t,"@Directive"),t[pl]||null}function Cy(t){return Gd(t,"@Pipe"),t[sp]||null}function Gd(t,n){if(t==null)throw new H(-919,!1)}function ga(t){return typeof t=="string"?t:t==null?"":String(t)}var wy=Be({ngErrorCode:Be}),yN=Be({ngErrorMessage:Be}),CN=Be({ngTokenPath:Be});function cp(t,n){return Sy("",-200,n)}function qd(t,n){throw new H(-201,!1)}function Sy(t,n,e){let i=new H(n,t);return i[wy]=n,i[yN]=t,e&&(i[CN]=e),i}function wN(t){return t[wy]}var Gh;function xy(){return Gh}function _n(t){let n=Gh;return Gh=t,n}function dp(t,n,e){let i=fl(t);if(i&&i.providedIn=="root")return i.value===void 0?i.value=i.factory():i.value;if(e&8)return null;if(n!==void 0)return n;qd(t,"")}var yr=globalThis;var SN={},uo=SN,xN="__NG_DI_FLAG__",qh=class{injector;constructor(n){this.injector=n}retrieve(n,e){let i=mo(e)||0;try{return this.injector.get(n,i&8?null:uo,i)}catch(r){if(sa(r))return r;throw r}}};function DN(t,n=0){let e=od();if(e===void 0)throw new H(-203,!1);if(e===null)return dp(t,void 0,n);{let i=EN(n),r=e.retrieve(t,i);if(sa(r)){if(i.optional)return null;throw r}return r}}function ee(t,n=0){return(xy()||DN)(kt(t),n)}function c(t,n){return ee(t,mo(n))}function mo(t){return typeof t>"u"||typeof t=="number"?t:0|(t.optional&&8)|(t.host&&1)|(t.self&&2)|(t.skipSelf&&4)}function EN(t){return{optional:!!(t&8),host:!!(t&1),self:!!(t&2),skipSelf:!!(t&4)}}function Yh(t){let n=[];for(let e=0;e<t.length;e++){let i=kt(t[e]);if(Array.isArray(i)){if(i.length===0)throw new H(900,!1);let r,o=0;for(let a=0;a<i.length;a++){let s=i[a],l=MN(s);typeof l=="number"?l===-1?r=s.token:o|=l:r=s}n.push(ee(r,o))}else n.push(ee(i))}return n}function MN(t){return t[xN]}function fo(t,n){let e=Object.hasOwn(t,ll);return e?t[ll]:null}function Dy(t,n,e){if(t.length!==n.length)return!1;for(let i=0;i<t.length;i++){let r=t[i],o=n[i];if(e&&(r=e(r),o=e(o)),o!==r)return!1}return!0}function Ey(t){return t.flat(Number.POSITIVE_INFINITY)}function Yd(t,n){t.forEach(e=>Array.isArray(e)?Yd(e,n):n(e))}function up(t,n,e){n>=t.length?t.push(e):t.splice(n,0,e)}function gl(t,n){return n>=t.length-1?t.pop():t.splice(n,1)[0]}function My(t,n){let e=[];for(let i=0;i<t;i++)e.push(n);return e}function Ny(t,n,e,i){let r=t.length;if(r==n)t.push(e,i);else if(r===1)t.push(i,t[0]),t[0]=e;else{for(r--,t.push(t[r-1],t[r]);r>n;){let o=r-2;t[r]=t[o],r--}t[n]=e,t[n+1]=i}}function Zd(t,n,e){let i=_a(t,n);return i>=0?t[i|1]=e:(i=~i,Ny(t,i,n,e)),i}function Qd(t,n){let e=_a(t,n);if(e>=0)return t[e|1]}function _a(t,n){return NN(t,n,1)}function NN(t,n,e){let i=0,r=t.length>>e;for(;r!==i;){let o=i+(r-i>>1),a=t[o<<e];if(n===a)return o<<e;a>n?r=o:i=o+1}return~(r<<e)}var Cr={},$t=[],va=new C(""),_l=new C("",-1),mp=new C(""),pa=class{get(n,e=uo){if(e===uo){let r=Sy("",-201);throw r.name="\u0275NotFound",r}return e}};function gi(t){return{\u0275providers:t}}function Iy(...t){return{\u0275providers:fp(!0,t),\u0275fromNgModule:!0}}function fp(t,...n){let e=[],i=new Set,r,o=a=>{e.push(a)};return Yd(n,a=>{let s=a;jd(s,o,[],i)&&(r||=[],r.push(s))}),r!==void 0&&Ty(r,o),e}function Ty(t,n){for(let e=0;e<t.length;e++){let{ngModule:i,providers:r}=t[e];hp(r,o=>{n(o,i)})}}function jd(t,n,e,i){if(t=kt(t),!t)return!1;let r=null,o=Wh(t),a=!o&&br(t);if(!o&&!a){let l=t.ngModule;if(o=Wh(l),o)r=l;else return!1}else{if(a&&!a.standalone)return!1;r=t}let s=i.has(r);if(a){if(s)return!1;if(i.add(r),a.dependencies){let l=typeof a.dependencies=="function"?a.dependencies():a.dependencies;for(let d of l)jd(d,n,e,i)}}else if(o){if(o.imports!=null&&!s){i.add(r);let d;Yd(o.imports,u=>{jd(u,n,e,i)&&(d||=[],d.push(u))}),d!==void 0&&Ty(d,n)}if(!s){let d=fo(r)||(()=>new r);n({provide:r,useFactory:d,deps:$t},r),n({provide:mp,useValue:r,multi:!0},r),n({provide:va,useValue:()=>ee(r),multi:!0},r)}let l=o.providers;if(l!=null&&!s){let d=t;hp(l,u=>{n(u,d)})}}else return!1;return r!==t&&t.providers!==void 0}function hp(t,n){for(let e of t)ap(e)&&(e=e.\u0275providers),Array.isArray(e)?hp(e,n):n(e)}var IN=Be({provide:String,useValue:Be});function ky(t){return t!==null&&typeof t=="object"&&IN in t}function TN(t){return!!(t&&t.useExisting)}function kN(t){return!!(t&&t.useFactory)}function ho(t){return typeof t=="function"}function Ay(t){return!!t.useClass}var vl=new C(""),Fd={},py={},$h;function ba(){return $h===void 0&&($h=new pa),$h}var We=class{},po=class extends We{parent;source;scopes;records=new Map;_ngOnDestroyHooks=new Set;_onDestroyHooks=[];get destroyed(){return this._destroyed}_destroyed=!1;injectorDefTypes;constructor(n,e,i,r){super(),this.parent=e,this.source=i,this.scopes=r,Qh(n,a=>this.processProvider(a)),this.records.set(_l,ha(void 0,this)),r.has("environment")&&this.records.set(We,ha(void 0,this));let o=this.records.get(vl);o!=null&&typeof o.value=="string"&&this.scopes.add(o.value),this.injectorDefTypes=new Set(this.get(mp,$t,{self:!0}))}retrieve(n,e){let i=mo(e)||0;try{return this.get(n,uo,i)}catch(r){if(sa(r))return r;throw r}}destroy(){al(this),this._destroyed=!0;let n=se(null);try{for(let i of this._ngOnDestroyHooks)i.ngOnDestroy();let e=this._onDestroyHooks;this._onDestroyHooks=[];for(let i of e)i()}finally{this.records.clear(),this._ngOnDestroyHooks.clear(),this.injectorDefTypes.clear(),se(n)}}onDestroy(n){return al(this),this._onDestroyHooks.push(n),()=>this.removeOnDestroy(n)}runInContext(n){al(this);let e=ui(this),i=_n(void 0),r;try{return n()}finally{ui(e),_n(i)}}get(n,e=uo,i){if(al(this),Object.hasOwn(n,hy))return n[hy](this);let r=mo(i),o,a=ui(this),s=_n(void 0);try{if(!(r&4)){let d=this.records.get(n);if(d===void 0){let u=FN(n)&&fl(n);u&&this.injectableDefInScope(u)?d=ha(Zh(n),Fd):d=null,this.records.set(n,d)}if(d!=null)return this.hydrate(n,d,r)}let l=r&2?ba():this.parent;return e=r&8&&e===uo?null:e,l.get(n,e)}catch(l){let d=wN(l);throw d===-200||d===-201?new H(d,null):l}finally{_n(s),ui(a)}}resolveInjectorInitializers(){let n=se(null),e=ui(this),i=_n(void 0),r;try{let o=this.get(va,$t,{self:!0});for(let a of o)a()}finally{ui(e),_n(i),se(n)}}toString(){return"R3Injector[...]"}processProvider(n){n=kt(n);let e=ho(n)?n:kt(n&&n.provide),i=RN(n);if(!ho(n)&&n.multi===!0){let r=this.records.get(e);r||(r=ha(void 0,Fd,!0),r.factory=()=>Yh(r.multi),this.records.set(e,r)),e=n,r.multi.push(n)}this.records.set(e,i)}hydrate(n,e,i){let r=se(null);try{if(e.value===py)throw cp("");return e.value===Fd&&(e.value=py,e.value=e.factory(void 0,i)),typeof e.value=="object"&&e.value&&PN(e.value)&&this._ngOnDestroyHooks.add(e.value),e.value}finally{se(r)}}injectableDefInScope(n){if(!n.providedIn)return!1;let e=kt(n.providedIn);return typeof e=="string"?e==="any"||this.scopes.has(e):this.injectorDefTypes.has(e)}removeOnDestroy(n){let e=this._onDestroyHooks.indexOf(n);e!==-1&&this._onDestroyHooks.splice(e,1)}};function Zh(t){let n=fl(t),e=n!==null?n.factory:fo(t);if(e!==null)return e;if(t instanceof C)throw new H(-204,!1);if(t instanceof Function)return AN(t);throw new H(-204,!1)}function AN(t){if(t.length>0)throw new H(-204,!1);let e=bN(t);return e!==null?()=>e.factory(t):()=>new t}function RN(t){if(ky(t))return ha(void 0,t.useValue);{let n=pp(t);return ha(n,Fd)}}function pp(t,n,e){let i;if(ho(t)){let r=kt(t);return fo(r)||Zh(r)}else if(ky(t))i=()=>kt(t.useValue);else if(kN(t))i=()=>t.useFactory(...Yh(t.deps||[]));else if(TN(t))i=(r,o)=>ee(kt(t.useExisting),o!==void 0&&o&8?8:void 0);else{let r=kt(t&&(t.useClass||t.provide));if(ON(t))i=()=>new r(...Yh(t.deps));else return fo(r)||Zh(r)}return i}function al(t){if(t.destroyed)throw new H(-205,!1)}function ha(t,n,e=!1){return{factory:t,value:n,multi:e?[]:void 0}}function ON(t){return!!t.deps}function PN(t){return t!==null&&typeof t=="object"&&typeof t.ngOnDestroy=="function"}function FN(t){return typeof t=="function"||typeof t=="object"&&t.ngMetadataName==="InjectionToken"}function Qh(t,n){for(let e of t)Array.isArray(e)?Qh(e,n):e&&ap(e)?Qh(e.\u0275providers,n):n(e)}function Rt(t,n){let e;t instanceof po?(al(t),e=t):e=new qh(t);let i,r=ui(e),o=_n(void 0);try{return n()}finally{ui(r),_n(o)}}function Ry(){return xy()!==void 0||od()!=null}var Qn=0,ie=1,fe=2,At=3,Tn=4,Ht=5,vo=6,ya=7,St=8,_i=9,Xn=10,Ye=11,Ca=12,gp=13,wr=14,en=15,Sr=16,bo=17,vi=18,bi=19,_p=20,Bi=21,Xd=22,Hi=23,vn=24,yo=25,yi=26,_t=27,Oy=1,vp=6,Co=7,bl=8,wo=9,ft=10;function zi(t){return Array.isArray(t)&&typeof t[Oy]=="object"}function kn(t){return Array.isArray(t)&&t[Oy]===!0}function bp(t){return(t.flags&4)!==0}function Ci(t){return t.componentOffset>-1}function wa(t){return(t.flags&1)===1}function Kn(t){return!!t.template}function Sa(t){return(t[fe]&512)!==0}function So(t){return(t[fe]&256)===256}var ke=(function(t){return t[t.NONE=0]="NONE",t[t.HTML=1]="HTML",t[t.STYLE=2]="STYLE",t[t.SCRIPT=3]="SCRIPT",t[t.URL=4]="URL",t[t.RESOURCE_URL=5]="RESOURCE_URL",t[t.ATTRIBUTE_NO_BINDING=6]="ATTRIBUTE_NO_BINDING",t})(ke||{}),sl,go="svg",Kd="math",Xh="",gy="*",Kh=()=>Object.create(null);function LN(){return sl||(sl=Kh(),vr(ke.HTML,void 0,[["iframe",["srcdoc"]],["*",["innerHTML","outerHTML"]]]),vr(ke.STYLE,void 0,[["*",["style"]]]),vr(ke.URL,void 0,[["*",["formAction"]],["area",["href"]],["a",["href","xlink:href"]],["form",["action"]],["img",["src"]],["video",["src"]]]),vr(ke.URL,Kd,[["*",["href","xlink:href"]]]),vr(ke.RESOURCE_URL,void 0,[["base",["href"]],["embed",["src"]],["frame",["src"]],["iframe",["src"]],["link",["href"]],["object",["codebase","data"]]]),vr(ke.URL,go,[["a",["href","xlink:href"]]]),vr(ke.ATTRIBUTE_NO_BINDING,go,[["animate",["attributeName","values","to","from"]],["set",["to","attributeName"]],["animateMotion",["attributeName"]],["animateTransform",["attributeName"]]]),vr(ke.ATTRIBUTE_NO_BINDING,void 0,[["unknown",["attributeName","values","to","from","sandbox","allow","allowFullscreen","referrerPolicy","csp","fetchPriority","credentialless"]],["iframe",["sandbox","allow","allowFullscreen","referrerPolicy","csp","fetchPriority","credentialless"]]]),sl)}function vr(t,n,e){let i=n??Xh;for(let[r,o]of e){let a=r.toLowerCase();for(let s of o){let l=s.toLowerCase(),d=sl[l]??=Kh(),u=d[i]??=Kh();u[a]=t}}}function Py(t,n,e){let r=LN()[n.toLowerCase()];if(!r)return ke.NONE;let o=t.toLowerCase(),a;if(e){let s=r[e];s&&(a=s[o]??s[gy])}if(a===void 0){let s=r[Xh];s&&(a=s[o]??s[gy])}if(a===void 0&&(!e||e===Xh)){let s=r[go];s&&(a=s[o])}return a??ke.NONE}function Ut(t){for(;Array.isArray(t);)t=t[Qn];return t}function yp(t,n){return Ut(n[t])}function mn(t,n){return Ut(n[t.index])}function Jd(t,n){return t.data[n]}function Fy(t,n){return t[n]}function An(t,n){let e=n[t];return zi(e)?e:e[Qn]}function Ly(t){return(t[fe]&4)===4}function eu(t){return(t[fe]&128)===128}function jy(t){return kn(t[At])}function bn(t,n){return n==null?null:t[n]}function Cp(t){t[bo]=0}function wp(t){t[fe]&1024||(t[fe]|=1024,eu(t)&&xo(t))}function Vy(t,n){for(;t>0;)n=n[wr],t--;return n}function yl(t){return!!(t[fe]&9216||t[vn]?.dirty)}function tu(t){t[Xn].changeDetectionScheduler?.notify(8),t[fe]&64&&(t[fe]|=1024),yl(t)&&xo(t)}function xo(t){t[Xn].changeDetectionScheduler?.notify(0);let n=Ui(t);for(;n!==null&&!(n[fe]&8192||(n[fe]|=8192,!eu(n)));)n=Ui(n)}function nu(t,n){if(So(t))throw new H(911,!1);t[Bi]===null&&(t[Bi]=[]),t[Bi].push(n)}function By(t,n){if(t[Bi]===null)return;let e=t[Bi].indexOf(n);e!==-1&&t[Bi].splice(e,1)}function Ui(t){let n=t[At];return kn(n)?n[At]:n}function Sp(t){return t[ya]??=[]}function xp(t){return t.cleanup??=[]}function Hy(t,n,e,i){let r=Sp(n);r.push(e),t.firstCreatePass&&xp(t).push(i,r.length-1)}var xe={lFrame:Jy(null),bindingsEnabled:!0,skipHydrationRootTNode:null};var Jh=!1;function Uy(){return xe.lFrame.elementDepthCount}function zy(){xe.lFrame.elementDepthCount++}function Dp(){xe.lFrame.elementDepthCount--}function iu(){return xe.bindingsEnabled}function Ep(){return xe.skipHydrationRootTNode!==null}function Mp(t){return xe.skipHydrationRootTNode===t}function Np(){xe.skipHydrationRootTNode=null}function de(){return xe.lFrame.lView}function et(){return xe.lFrame.tView}function q(t){return xe.lFrame.contextLView=t,t[St]}function Y(t){return xe.lFrame.contextLView=null,t}function Ot(){let t=Ip();for(;t!==null&&t.type===64;)t=t.parent;return t}function Ip(){return xe.lFrame.currentTNode}function $y(){let t=xe.lFrame,n=t.currentTNode;return t.isParent?n:n.parent}function xa(t,n){let e=xe.lFrame;e.currentTNode=t,e.isParent=n}function Tp(){return xe.lFrame.isParent}function kp(){xe.lFrame.isParent=!1}function Wy(){return xe.lFrame.contextLView}function Ap(){return Jh}function cl(t){let n=Jh;return Jh=t,n}function ru(){let t=xe.lFrame,n=t.bindingRootIndex;return n===-1&&(n=t.bindingRootIndex=t.tView.bindingStartIndex),n}function Gy(){return xe.lFrame.bindingIndex}function qy(t){return xe.lFrame.bindingIndex=t}function xr(){return xe.lFrame.bindingIndex++}function ou(t){let n=xe.lFrame,e=n.bindingIndex;return n.bindingIndex=n.bindingIndex+t,e}function Yy(){return xe.lFrame.inI18n}function Zy(t,n){let e=xe.lFrame;e.bindingIndex=e.bindingRootIndex=t,au(n)}function Qy(){return xe.lFrame.currentDirectiveIndex}function au(t){xe.lFrame.currentDirectiveIndex=t}function Xy(t){let n=xe.lFrame.currentDirectiveIndex;return n===-1?null:t[n]}function su(){return xe.lFrame.currentQueryIndex}function Cl(t){xe.lFrame.currentQueryIndex=t}function jN(t){let n=t[ie];return n.type===2?n.declTNode:n.type===1?t[Ht]:null}function Rp(t,n,e){if(e&4){let r=n,o=t;for(;r=r.parent,r===null&&!(e&1);)if(r=jN(o),r===null||(o=o[wr],r.type&10))break;if(r===null)return!1;n=r,t=o}let i=xe.lFrame=Ky();return i.currentTNode=n,i.lView=t,!0}function lu(t){let n=Ky(),e=t[ie];xe.lFrame=n,n.currentTNode=e.firstChild,n.lView=t,n.tView=e,n.contextLView=t,n.bindingIndex=e.bindingStartIndex,n.inI18n=!1}function Ky(){let t=xe.lFrame,n=t===null?null:t.child;return n===null?Jy(t):n}function Jy(t){let n={currentTNode:null,isParent:!0,lView:null,tView:null,selectedIndex:-1,contextLView:null,elementDepthCount:0,currentNamespace:null,currentDirectiveIndex:-1,bindingRootIndex:-1,bindingIndex:-1,currentQueryIndex:0,parent:t,child:null,inI18n:!1};return t!==null&&(t.child=n),n}function e0(){let t=xe.lFrame;return xe.lFrame=t.parent,t.currentTNode=null,t.lView=null,t}var Op=e0;function cu(){let t=e0();t.isParent=!0,t.tView=null,t.selectedIndex=-1,t.contextLView=null,t.elementDepthCount=0,t.currentDirectiveIndex=-1,t.currentNamespace=null,t.bindingRootIndex=-1,t.bindingIndex=-1,t.currentQueryIndex=0}function t0(t){return(xe.lFrame.contextLView=Vy(t,xe.lFrame.contextLView))[St]}function Jn(){return xe.lFrame.selectedIndex}function Dr(t){xe.lFrame.selectedIndex=t}function Do(){let t=xe.lFrame;return Jd(t.tView,t.selectedIndex)}function fn(){xe.lFrame.currentNamespace=go}function wl(){VN()}function VN(){xe.lFrame.currentNamespace=null}function Pp(){return xe.lFrame.currentNamespace}var n0=!0;function du(){return n0}function Sl(t){n0=t}function ep(t,n=null,e=null,i){let r=Fp(t,n,e,i);return r.resolveInjectorInitializers(),r}function Fp(t,n=null,e=null,i,r=new Set){let o=[e||$t,Iy(t)],a;return new po(o,n||ba(),a||null,r)}var X=class t{static THROW_IF_NOT_FOUND=uo;static NULL=new pa;static create(n,e){if(Array.isArray(n))return ep({name:""},e,n,"");{let i=n.name??"";return ep({name:i},n.parent,n.providers,i)}}static \u0275prov=me({token:t,providedIn:"any",factory:()=>ee(_l)});static __NG_ELEMENT_ID__=-1},K=new C(""),Xe=class{static __NG_ELEMENT_ID__=BN;static __NG_ENV_ID__=n=>n},Vd=class extends Xe{_lView;constructor(n){super(),this._lView=n}get destroyed(){return So(this._lView)}onDestroy(n){let e=this._lView;return nu(e,n),()=>By(e,n)}};function BN(){return new Vd(de())}var i0=!1,r0=new C(""),$i=(()=>{class t{taskId=0;pendingTasks=new Set;destroyed=!1;pendingTask=new Et(!1);debugTaskTracker=c(r0,{optional:!0});get hasPendingTasks(){return this.destroyed?!1:this.pendingTask.value}get hasPendingTasksObservable(){return this.destroyed?new le(e=>{e.next(!1),e.complete()}):this.pendingTask}add(){!this.hasPendingTasks&&!this.destroyed&&this.pendingTask.next(!0);let e=this.taskId++;return this.pendingTasks.add(e),this.debugTaskTracker?.add(e),e}has(e){return this.pendingTasks.has(e)}remove(e){this.pendingTasks.delete(e),this.debugTaskTracker?.remove(e),this.pendingTasks.size===0&&this.hasPendingTasks&&this.pendingTask.next(!1)}ngOnDestroy(){this.pendingTasks.clear(),this.hasPendingTasks&&this.pendingTask.next(!1),this.destroyed=!0,this.pendingTask.unsubscribe()}static \u0275prov=me({token:t,providedIn:"root",factory:()=>new t})}return t})(),tp=class extends I{__isAsync;destroyRef=void 0;pendingTasks=void 0;constructor(n=!1){super(),this.__isAsync=n,Ry()&&(this.destroyRef=c(Xe,{optional:!0})??void 0,this.pendingTasks=c($i,{optional:!0})??void 0)}emit(n){let e=se(null);try{super.next(n)}finally{se(e)}}subscribe(n,e,i){let r=n,o=e||(()=>null),a=i;if(n&&typeof n=="object"){let l=n;r=l.next?.bind(l),o=l.error?.bind(l),a=l.complete?.bind(l)}this.__isAsync&&(o=this.wrapInTimeout(o),r&&(r=this.wrapInTimeout(r)),a&&(a=this.wrapInTimeout(a)));let s=super.subscribe({next:r,error:o,complete:a});return n instanceof ce&&n.add(s),s}wrapInTimeout(n){return e=>{let i=this.pendingTasks?.add();setTimeout(()=>{try{n(e)}finally{i!==void 0&&this.pendingTasks?.remove(i)}})}}},O=tp;function Bd(...t){}function Lp(t){let n,e;function i(){t=Bd;try{e!==void 0&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(e),n!==void 0&&clearTimeout(n)}catch{}}return n=setTimeout(()=>{t(),i()}),typeof requestAnimationFrame=="function"&&(e=requestAnimationFrame(()=>{t(),i()})),()=>i()}function o0(t){return queueMicrotask(()=>t()),()=>{t=Bd}}var jp="isAngularZone",dl=jp+"_ID",HN=0,U=class t{hasPendingMacrotasks=!1;hasPendingMicrotasks=!1;isStable=!0;onUnstable=new O(!1);onMicrotaskEmpty=new O(!1);onStable=new O(!1);onError=new O(!1);constructor(n){let{enableLongStackTrace:e=!1,shouldCoalesceEventChangeDetection:i=!1,shouldCoalesceRunChangeDetection:r=!1,scheduleInRootZone:o=i0}=n;if(typeof Zone>"u")throw new H(908,!1);Zone.assertZonePatched();let a=this;a._nesting=0,a._outer=a._inner=Zone.current,Zone.TaskTrackingZoneSpec&&(a._inner=a._inner.fork(new Zone.TaskTrackingZoneSpec)),e&&Zone.longStackTraceZoneSpec&&(a._inner=a._inner.fork(Zone.longStackTraceZoneSpec)),a.shouldCoalesceEventChangeDetection=!r&&i,a.shouldCoalesceRunChangeDetection=r,a.callbackScheduled=!1,a.scheduleInRootZone=o,$N(a)}static isInAngularZone(){return typeof Zone<"u"&&Zone.current.get(jp)===!0}static assertInAngularZone(){if(!t.isInAngularZone())throw new H(909,!1)}static assertNotInAngularZone(){if(t.isInAngularZone())throw new H(909,!1)}run(n,e,i){return this._inner.run(n,e,i)}runTask(n,e,i,r){let o=this._inner,a=o.scheduleEventTask("NgZoneEvent: "+r,n,UN,Bd,Bd);try{return o.runTask(a,e,i)}finally{o.cancelTask(a)}}runGuarded(n,e,i){return this._inner.runGuarded(n,e,i)}runOutsideAngular(n){return this._outer.run(n)}},UN={};function Vp(t){if(t._nesting==0&&!t.hasPendingMicrotasks&&!t.isStable)try{t._nesting++,t.onMicrotaskEmpty.emit(null)}finally{if(t._nesting--,!t.hasPendingMicrotasks)try{t.runOutsideAngular(()=>t.onStable.emit(null))}finally{t.isStable=!0}}}function zN(t){if(t.isCheckStableRunning||t.callbackScheduled)return;t.callbackScheduled=!0;function n(){Lp(()=>{t.callbackScheduled=!1,np(t),t.isCheckStableRunning=!0,Vp(t),t.isCheckStableRunning=!1})}t.scheduleInRootZone?Zone.root.run(()=>{n()}):t._outer.run(()=>{n()}),np(t)}function $N(t){let n=()=>{zN(t)},e=HN++;t._inner=t._inner.fork({name:"angular",properties:{[jp]:!0,[dl]:e,[dl+e]:!0},onInvokeTask:(i,r,o,a,s,l)=>{if(WN(l))return i.invokeTask(o,a,s,l);try{return _y(t),i.invokeTask(o,a,s,l)}finally{(t.shouldCoalesceEventChangeDetection&&a.type==="eventTask"||t.shouldCoalesceRunChangeDetection)&&n(),vy(t)}},onInvoke:(i,r,o,a,s,l,d)=>{try{return _y(t),i.invoke(o,a,s,l,d)}finally{t.shouldCoalesceRunChangeDetection&&!t.callbackScheduled&&!GN(l)&&n(),vy(t)}},onHasTask:(i,r,o,a)=>{i.hasTask(o,a),r===o&&(a.change=="microTask"?(t._hasPendingMicrotasks=a.microTask,np(t),Vp(t)):a.change=="macroTask"&&(t.hasPendingMacrotasks=a.macroTask))},onHandleError:(i,r,o,a)=>(i.handleError(o,a),t.runOutsideAngular(()=>t.onError.emit(a)),!1)})}function np(t){t._hasPendingMicrotasks||(t.shouldCoalesceEventChangeDetection||t.shouldCoalesceRunChangeDetection)&&t.callbackScheduled===!0?t.hasPendingMicrotasks=!0:t.hasPendingMicrotasks=!1}function _y(t){t._nesting++,t.isStable&&(t.isStable=!1,t.onUnstable.emit(null))}function vy(t){t._nesting--,Vp(t)}var ul=class{hasPendingMicrotasks=!1;hasPendingMacrotasks=!1;isStable=!0;onUnstable=new O;onMicrotaskEmpty=new O;onStable=new O;onError=new O;run(n,e,i){return n.apply(e,i)}runGuarded(n,e,i){return n.apply(e,i)}runOutsideAngular(n){return n()}runTask(n,e,i,r){return n.apply(e,i)}};function WN(t){return a0(t,"__ignore_ng_zone__")}function GN(t){return a0(t,"__scheduler_tick__")}function a0(t,n){return!Array.isArray(t)||t.length!==1?!1:t[0]?.data?.[n]===!0}var Kt=class{_console=console;handleError(n){this._console.error("ERROR",n)}},Rn=new C("",{factory:()=>{let t=c(U),n=c(We),e;return i=>{t.runOutsideAngular(()=>{n.destroyed&&!e?setTimeout(()=>{throw i}):(e??=n.get(Kt),e.handleError(i))})}}}),s0={provide:va,useValue:()=>{let t=c(Kt,{optional:!0})},multi:!0};function S(t,n){let[e,i,r]=xh(t,n?.equal),o=e,a=o[pt];return o.set=i,o.update=r,o.asReadonly=uu.bind(o),o}function uu(){let t=this[pt];if(t.readonlyFn===void 0){let n=()=>this();n[pt]=t,t.readonlyFn=n}return t.readonlyFn}var Wi=new C("",{factory:()=>qN}),qN="ng";var mu=new C(""),Eo=new C("",{providedIn:"platform",factory:()=>"unknown"}),xl=new C(""),Er=new C("",{factory:()=>c(K).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce")||null});var Da=(()=>{class t{view;node;constructor(e,i){this.view=e,this.node=i}static __NG_ELEMENT_ID__=YN}return t})();function YN(){return new Da(de(),Ot())}var hi=class{},Dl=new C("",{factory:()=>!0});var Bp=new C(""),fu=(()=>{class t{static \u0275prov=me({token:t,providedIn:"root",factory:()=>new ip})}return t})(),ip=class{dirtyEffectCount=0;queues=new Map;add(n){this.enqueue(n),this.schedule(n)}schedule(n){n.dirty&&this.dirtyEffectCount++}remove(n){let e=n.zone,i=this.queues.get(e);i.has(n)&&(i.delete(n),n.dirty&&this.dirtyEffectCount--)}enqueue(n){let e=n.zone;this.queues.has(e)||this.queues.set(e,new Set);let i=this.queues.get(e);i.has(n)||i.add(n)}flush(){for(;this.dirtyEffectCount>0;){let n=!1;for(let[e,i]of this.queues)e===null?n||=this.flushQueue(i):n||=e.run(()=>this.flushQueue(i));n||(this.dirtyEffectCount=0)}}flushQueue(n){let e=!1;for(let i of n)i.dirty&&(this.dirtyEffectCount--,e=!0,i.run());return e}},Hd=class{[pt];constructor(n){this[pt]=n}destroy(){this[pt].destroy()}};function vt(t,n){let e=n?.injector??c(X),i=n?.manualCleanup!==!0?e.get(Xe):null,r,o=e.get(Da,null,{optional:!0}),a=e.get(hi);return o!==null?(r=c0(o.view,a,t),i instanceof Vd&&i._lView===o.view&&(i=null)):r=XN(t,e.get(fu),a),r.injector=e,i!==null&&(r.onDestroyFns=[i.onDestroy(()=>r.destroy())]),new Hd(r)}var l0=V(b({},Dh),{cleanupFns:void 0,zone:null,onDestroyFns:null,run(){let t=cl(!1);try{Eh(this)}finally{cl(t)}},cleanup(){if(!this.cleanupFns?.length)return;let t=se(null);try{for(;this.cleanupFns.length;)this.cleanupFns.pop()()}finally{this.cleanupFns=[],se(t)}}}),ZN=V(b({},l0),{consumerMarkedDirty(){this.scheduler.schedule(this),this.notifier.notify(12)},destroy(){if(hr(this),this.onDestroyFns!==null)for(let t of this.onDestroyFns)t();this.cleanup(),this.scheduler.remove(this)}}),QN=V(b({},l0),{consumerMarkedDirty(){this.view[fe]|=8192,xo(this.view),this.notifier.notify(13)},destroy(){if(hr(this),this.onDestroyFns!==null)for(let t of this.onDestroyFns)t();this.cleanup(),this.view[Hi]?.delete(this)}});function c0(t,n,e){let i=Object.create(QN);return i.view=t,i.zone=typeof Zone<"u"?Zone.current:null,i.notifier=n,i.fn=d0(i,e),t[Hi]??=new Set,t[Hi].add(i),i.consumerMarkedDirty(i),i}function XN(t,n,e){let i=Object.create(ZN);return i.fn=d0(i,t),i.scheduler=n,i.notifier=e,i.zone=typeof Zone<"u"?Zone.current:null,i.scheduler.add(i),i.notifier.notify(12),i}function d0(t,n){return()=>{n(e=>(t.cleanupFns??=[]).push(e))}}function yn(t){return typeof t=="function"&&t[pt]!==void 0}var Ea=(()=>{class t{internalPendingTasks=c($i);scheduler=c(hi);errorHandler=c(Rn);add(){let e=this.internalPendingTasks.add();return()=>{this.internalPendingTasks.has(e)&&(this.scheduler.notify(11),this.internalPendingTasks.remove(e))}}run(e){let i=this.add();try{e().catch(this.errorHandler).finally(i)}catch(r){this.errorHandler(r),i()}}static \u0275prov=me({token:t,providedIn:"root",factory:()=>new t})}return t})();var ju=Symbol("InputSignalNode#UNSET"),J0=V(b({},aa),{transformFn:void 0,applyValueToInputSignal(t,n){pr(t,n)}});function Pl(t){return{toString:t}.toString()}var Ie=(function(t){return t[t.TemplateCreateStart=0]="TemplateCreateStart",t[t.TemplateCreateEnd=1]="TemplateCreateEnd",t[t.TemplateUpdateStart=2]="TemplateUpdateStart",t[t.TemplateUpdateEnd=3]="TemplateUpdateEnd",t[t.LifecycleHookStart=4]="LifecycleHookStart",t[t.LifecycleHookEnd=5]="LifecycleHookEnd",t[t.OutputStart=6]="OutputStart",t[t.OutputEnd=7]="OutputEnd",t[t.BootstrapApplicationStart=8]="BootstrapApplicationStart",t[t.BootstrapApplicationEnd=9]="BootstrapApplicationEnd",t[t.BootstrapComponentStart=10]="BootstrapComponentStart",t[t.BootstrapComponentEnd=11]="BootstrapComponentEnd",t[t.ChangeDetectionStart=12]="ChangeDetectionStart",t[t.ChangeDetectionEnd=13]="ChangeDetectionEnd",t[t.ChangeDetectionSyncStart=14]="ChangeDetectionSyncStart",t[t.ChangeDetectionSyncEnd=15]="ChangeDetectionSyncEnd",t[t.AfterRenderHooksStart=16]="AfterRenderHooksStart",t[t.AfterRenderHooksEnd=17]="AfterRenderHooksEnd",t[t.ComponentStart=18]="ComponentStart",t[t.ComponentEnd=19]="ComponentEnd",t[t.DeferBlockStateStart=20]="DeferBlockStateStart",t[t.DeferBlockStateEnd=21]="DeferBlockStateEnd",t[t.DynamicComponentStart=22]="DynamicComponentStart",t[t.DynamicComponentEnd=23]="DynamicComponentEnd",t[t.HostBindingsUpdateStart=24]="HostBindingsUpdateStart",t[t.HostBindingsUpdateEnd=25]="HostBindingsUpdateEnd",t})(Ie||{}),wu=class{previousValue;currentValue;firstChange;constructor(n,e,i){this.previousValue=n,this.currentValue=e,this.firstChange=i}isFirstChange(){return this.firstChange}};function eC(t,n,e,i){n!==null?n.applyValueToInputSignal(n,i):t[e]=i}var tC=null,Ae=(()=>{tC=u0;let t=()=>u0;return t.ngInherit=!0,t})();function lI(){return tC}function u0(t){return t.type.prototype.ngOnChanges&&(t.setInput=dI),cI}function cI(){let t=nC(this),n=t?.current;if(n){let e=t.previous;if(e===Cr)t.previous=n;else for(let i in n)e[i]=n[i];t.current=null,this.ngOnChanges(n)}}function dI(t,n,e,i,r){let o=this.declaredInputs[i],a=nC(t)||uI(t,{previous:Cr,current:null}),s=a.current||(a.current={}),l=a.previous,d=l[o];s[o]=new wu(d&&d.currentValue,e,l===Cr),eC(t,n,r,e)}var Xp="__ngSimpleChanges__";function nC(t){return Object.hasOwn(t,Xp)&&t[Xp]||null}function uI(t,n){return t[Xp]=n}var m0=[];var He=function(t,n=null,e){for(let i=0;i<m0.length;i++){let r=m0[i];r(t,n,e)}};function mI(t,n,e){let{ngOnChanges:i,ngOnInit:r,ngDoCheck:o}=n.type.prototype;if(i){let a=lI()(n);(e.preOrderHooks??=[]).push(t,a),(e.preOrderCheckHooks??=[]).push(t,a)}r&&(e.preOrderHooks??=[]).push(0-t,r),o&&((e.preOrderHooks??=[]).push(t,o),(e.preOrderCheckHooks??=[]).push(t,o))}function iC(t,n){for(let e=n.directiveStart,i=n.directiveEnd;e<i;e++){let o=t.data[e].type.prototype,{ngAfterContentInit:a,ngAfterContentChecked:s,ngAfterViewInit:l,ngAfterViewChecked:d,ngOnDestroy:u}=o;a&&(t.contentHooks??=[]).push(-e,a),s&&((t.contentHooks??=[]).push(e,s),(t.contentCheckHooks??=[]).push(e,s)),l&&(t.viewHooks??=[]).push(-e,l),d&&((t.viewHooks??=[]).push(e,d),(t.viewCheckHooks??=[]).push(e,d)),u!=null&&(t.destroyHooks??=[]).push(e,u)}}function vu(t,n,e){rC(t,n,3,e)}function bu(t,n,e,i){(t[fe]&3)===e&&rC(t,n,e,i)}function Hp(t,n){let e=t[fe];(e&3)===n&&(e&=16383,e+=1,t[fe]=e)}function rC(t,n,e,i){let r=i!==void 0?t[bo]&65535:0,o=i??-1,a=n.length-1,s=0;for(let l=r;l<a;l++)if(typeof n[l+1]=="number"){if(s=n[l],i!=null&&s>=i)break}else n[l]<0&&(t[bo]+=65536),(s<o||o==-1)&&(fI(t,e,n,l),t[bo]=(t[bo]&4294901760)+l+2),l++}function f0(t,n){He(Ie.LifecycleHookStart,t,n);let e=se(null);try{n.call(t)}finally{se(e),He(Ie.LifecycleHookEnd,t,n)}}function fI(t,n,e,i){let r=e[i]<0,o=e[i+1],a=r?-e[i]:e[i],s=t[a];r?t[fe]>>14<t[bo]>>16&&(t[fe]&3)===n&&(t[fe]+=16384,f0(s,o)):f0(s,o)}var Na=-1,Io=class{factory;name;injectImpl;resolving=!1;canSeeViewProviders;multi;componentProviders;index;providerFactory;constructor(n,e,i,r){this.factory=n,this.name=r,this.canSeeViewProviders=e,this.injectImpl=i}};function hI(t){return(t.flags&8)!==0}function pI(t){return(t.flags&16)!==0}function gI(t,n,e){let i=0;for(;i<e.length;){let r=e[i];if(typeof r=="number"){if(r!==0)break;i++;let o=e[i++],a=e[i++],s=e[i++];t.setAttribute(n,a,s,o)}else{let o=r,a=e[++i];_I(o)?t.setProperty(n,o,a):t.setAttribute(n,o,a),i++}}return i}function oC(t){return t===3||t===4||t===6}function _I(t){return t.charCodeAt(0)===64}function Ia(t,n){if(!(n===null||n.length===0))if(t===null||t.length===0)t=n.slice();else{let e=-1;for(let i=0;i<n.length;i++){let r=n[i];typeof r=="number"?e=r:e===0||(e===-1||e===2?h0(t,e,r,null,n[++i]):h0(t,e,r,null,null))}}return t}function h0(t,n,e,i,r){let o=0,a=t.length;if(n===-1)a=-1;else for(;o<t.length;){let s=t[o++];if(typeof s=="number"){if(s===n){a=-1;break}else if(s>n){a=o-1;break}}}for(;o<t.length;){let s=t[o];if(typeof s=="number")break;if(s===e){r!==null&&(t[o+1]=r);return}o++,r!==null&&o++}a!==-1&&(t.splice(a,0,n),o=a+1),t.splice(o++,0,e),r!==null&&t.splice(o++,0,r)}function aC(t){return t!==Na}function Su(t){return t&32767}function vI(t){return t>>16}function xu(t,n){let e=vI(t),i=n;for(;e>0;)i=i[wr],e--;return i}var Kp=!0;function p0(t){let n=Kp;return Kp=t,n}var bI=256,sC=bI-1,lC=5,yI=0,wi={};function CI(t,n,e){let i;typeof e=="string"?i=e.charCodeAt(0)||0:Object.hasOwn(e,_o)&&(i=e[_o]),i==null&&(i=e[_o]=yI++);let r=i&sC,o=1<<r;n.data[t+(r>>lC)]|=o}function Du(t,n){let e=cC(t,n);if(e!==-1)return e;let i=n[ie];i.firstCreatePass&&(t.injectorIndex=n.length,Up(i.data,t),Up(n,null),Up(i.blueprint,null));let r=Og(t,n),o=t.injectorIndex;if(aC(r)){let a=Su(r),s=xu(r,n),l=s[ie].data;for(let d=0;d<8;d++)n[o+d]=s[a+d]|l[a+d]}return n[o+8]=r,o}function Up(t,n){t.push(0,0,0,0,0,0,0,0,n)}function cC(t,n){return t.injectorIndex===-1||t.parent&&t.parent.injectorIndex===t.injectorIndex||n[t.injectorIndex+8]===null?-1:t.injectorIndex}function Og(t,n){if(t.parent&&t.parent.injectorIndex!==-1)return t.parent.injectorIndex;let e=0,i=null,r=n;for(;r!==null;){if(i=hC(r),i===null)return Na;if(e++,r=r[wr],i.injectorIndex!==-1)return i.injectorIndex|e<<16}return Na}function Jp(t,n,e){CI(t,n,e)}function wI(t,n){if(n==="class")return t.classes;if(n==="style")return t.styles;let e=t.attrs;if(e){let i=e.length,r=0;for(;r<i;){let o=e[r];if(oC(o))break;if(o===0)r=r+2;else if(typeof o=="number")for(r++;r<i&&typeof e[r]=="string";)r++;else{if(o===n)return e[r+1];r=r+2}}}return null}function dC(t,n,e){if(e&8||t!==void 0)return t;qd(n,"NodeInjector")}function uC(t,n,e,i){if(e&8&&i===void 0&&(i=null),(e&3)===0){let r=t[_i],o=_n(void 0);try{return r?r.get(n,i,e&8):dp(n,i,e&8)}finally{_n(o)}}return dC(i,n,e)}function mC(t,n,e,i=0,r){if(t!==null){if(n[fe]&2048&&!(i&2)){let a=EI(t,n,e,i,wi);if(a!==wi)return a}let o=fC(t,n,e,i,wi);if(o!==wi)return o}return uC(n,e,i,r)}function fC(t,n,e,i,r){let o=xI(e);if(typeof o=="function"){if(!Rp(n,t,i))return i&1?dC(r,e,i):uC(n,e,i,r);try{let a;if(a=o(i),a==null&&!(i&8))qd(e);else return a}finally{Op()}}else if(typeof o=="number"){let a=null,s=cC(t,n),l=Na,d=i&1?n[en][Ht]:null;for((s===-1||i&4)&&(l=s===-1?Og(t,n):n[s+8],l===Na||!_0(i,!1)?s=-1:(a=n[ie],s=Su(l),n=xu(l,n)));s!==-1;){let u=n[ie];if(g0(o,s,u.data)){let h=SI(s,n,e,a,i,d);if(h!==wi)return h}l=n[s+8],l!==Na&&_0(i,n[ie].data[s+8]===d)&&g0(o,s,n)?(a=u,s=Su(l),n=xu(l,n)):s=-1}}return r}function SI(t,n,e,i,r,o){let a=n[ie],s=a.data[t+8],l=i==null?Ci(s)&&Kp:i!=a&&(s.type&3)!==0,d=r&1&&o===s,u=yu(s,a,e,l,d);return u!==null?Il(n,a,u,s,r):wi}function yu(t,n,e,i,r){let o=t.providerIndexes,a=n.data,s=o&1048575,l=t.directiveStart,d=t.directiveEnd,u=o>>20,h=i?s:s+u,_=r?s+u:d;for(let v=h;v<_;v++){let x=a[v];if(v<l&&e===x||v>=l&&x.type===e)return v}if(r){let v=a[l];if(v&&Kn(v)&&v.type===e)return l}return null}function Il(t,n,e,i,r){let o=t[e],a=n.data;if(o instanceof Io){let s=o;if(s.resolving)throw cp("");let l=p0(s.canSeeViewProviders);s.resolving=!0;let d=a[e].type||a[e],u,h=s.injectImpl?_n(s.injectImpl):null,_=Rp(t,i,0);try{o=t[e]=s.factory(void 0,r,a,t,i),n.firstCreatePass&&e>=i.directiveStart&&mI(e,a[e],n)}finally{h!==null&&_n(h),p0(l),s.resolving=!1,Op()}}return o}function xI(t){if(typeof t=="string")return t.charCodeAt(0)||0;let n=Object.hasOwn(t,_o)?t[_o]:void 0;return typeof n=="number"?n>=0?n&sC:DI:n}function g0(t,n,e){let i=1<<t;return!!(e[n+(t>>lC)]&i)}function _0(t,n){return!(t&2)&&!(t&1&&n)}var Mr=class{_tNode;_lView;constructor(n,e){this._tNode=n,this._lView=e}get(n,e,i){return mC(this._tNode,this._lView,n,mo(i),e)}};function DI(){return new Mr(Ot(),de())}function Ge(t){return Pl(()=>{let n=t.prototype.constructor,e=n[ll]||eg(n),i=Object.prototype,r=Object.getPrototypeOf(t.prototype).constructor;for(;r&&r!==i;){let o=r[ll]||eg(r);if(o&&o!==e)return o;r=Object.getPrototypeOf(r)}return o=>new o})}function eg(t){return rp(t)?()=>{let n=eg(kt(t));return n&&n()}:fo(t)}function EI(t,n,e,i,r){let o=t,a=n;for(;o!==null&&a!==null&&a[fe]&2048&&!Sa(a);){let s=fC(o,a,e,i|2,wi);if(s!==wi)return s;i&=-5;let l=o.parent;if(!l){let d=a[_p];if(d){let u=d.get(e,wi,i);if(u!==wi)return u}l=hC(a),a=a[wr]}o=l}return r}function hC(t){let n=t[ie],e=n.type;return e===2?n.declTNode:e===1?t[Ht]:null}function Fl(t){return wI(Ot(),t)}function W(t){return{token:t.token,providedIn:t.autoProvided===!1?null:"root",factory:t.factory,value:void 0}}function MI(){return Pa(Ot(),de())}function Pa(t,n){return new F(mn(t,n))}var F=(()=>{class t{nativeElement;constructor(e){this.nativeElement=e}static __NG_ELEMENT_ID__=MI}return t})();function pC(t){return t instanceof F?t.nativeElement:t}function NI(){return this._results[Symbol.iterator]()}var hn=class{_emitDistinctChangesOnly;dirty=!0;_onDirty=void 0;_results=[];_changesDetected=!1;_changes=void 0;length=0;first=void 0;last=void 0;get changes(){return this._changes??=new I}constructor(n=!1){this._emitDistinctChangesOnly=n}get(n){return this._results[n]}map(n){return this._results.map(n)}filter(n){return this._results.filter(n)}find(n){return this._results.find(n)}reduce(n,e){return this._results.reduce(n,e)}forEach(n){this._results.forEach(n)}some(n){return this._results.some(n)}toArray(){return this._results.slice()}toString(){return this._results.toString()}reset(n,e){this.dirty=!1;let i=Ey(n);(this._changesDetected=!Dy(this._results,i,e))&&(this._results=i,this.length=i.length,this.last=i[this.length-1],this.first=i[0])}notifyOnChanges(){this._changes!==void 0&&(this._changesDetected||!this._emitDistinctChangesOnly)&&this._changes.next(this)}onDirty(n){this._onDirty=n}setDirty(){this.dirty=!0,this._onDirty?.()}destroy(){this._changes!==void 0&&(this._changes.complete(),this._changes.unsubscribe())}[Symbol.iterator]=NI};function gC(t){return(t.flags&128)===128}var Pg=(function(t){return t[t.OnPush=0]="OnPush",t[t.Eager=1]="Eager",t[t.Default=1]="Default",t})(Pg||{}),_C=new Map,II=0;function TI(){return II++}function kI(t){_C.set(t[bi],t)}function tg(t){_C.delete(t[bi])}var v0="__ngContext__";function Ta(t,n){zi(n)?(t[v0]=n[bi],kI(n)):t[v0]=n}function vC(t){return yC(t[Ca])}function bC(t){return yC(t[Tn])}function yC(t){for(;t!==null&&!kn(t);)t=t[Tn];return t}var ng;function Fg(t){ng=t}function CC(){if(ng!==void 0)return ng;if(typeof document<"u")return document;throw new H(210,!1)}var wC="r";var SC="di";var xC=!1,DC=new C("",{factory:()=>xC});var b0=new WeakMap;function AI(t,n){if(t==null||typeof t!="object")return;let e=b0.get(t);e||(e=new WeakSet,b0.set(t,e)),e.add(n)}var RI=(t,n,e,i)=>{};function OI(t,n,e,i){RI(t,n,e,i)}function Vu(t){return(t.flags&32)===32}var PI=()=>null;function EC(t,n,e=!1){return PI(t,n,e)}function MC(t,n){let e=t.contentQueries;if(e!==null){let i=se(null);try{for(let r=0;r<e.length;r+=2){let o=e[r],a=e[r+1];if(a!==-1){let s=t.data[a];Cl(o),s.contentQueries(2,n[a],a)}}}finally{se(i)}}}function ig(t,n,e){Cl(0);let i=se(null);try{n(t,e)}finally{se(i)}}function Lg(t,n,e){if(bp(n)){let i=se(null);try{let r=n.directiveStart,o=n.directiveEnd;for(let a=r;a<o;a++){let s=t.data[a];if(s.contentQueries){let l=e[a];s.contentQueries(1,l,a)}}}finally{se(i)}}}var ni=(function(t){return t[t.Emulated=0]="Emulated",t[t.None=2]="None",t[t.ShadowDom=3]="ShadowDom",t[t.ExperimentalIsolatedShadowDom=4]="ExperimentalIsolatedShadowDom",t})(ni||{});var FI={"http://www.w3.org/2000/svg":go,"http://www.w3.org/1998/Math/MathML":Kd},hu;function LI(){if(hu===void 0&&(hu=null,yr.trustedTypes))try{hu=yr.trustedTypes.createPolicy("angular",{createHTML:t=>t,createScript:t=>t,createScriptURL:t=>t})}catch{}return hu}function Bu(t){return LI()?.createHTML(t)||t}var pu;function jI(){if(pu===void 0&&(pu=null,yr.trustedTypes))try{pu=yr.trustedTypes.createPolicy("angular#unsafe-bypass",{createHTML:t=>t,createScript:t=>t,createScriptURL:t=>t})}catch{}return pu}function y0(t){return jI()?.createScriptURL(t)||t}var Gi=class{changingThisBreaksApplicationSecurity;constructor(n){this.changingThisBreaksApplicationSecurity=n}toString(){return`SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Ud})`}},rg=class extends Gi{getTypeName(){return"HTML"}},og=class extends Gi{getTypeName(){return"Style"}},ag=class extends Gi{getTypeName(){return"Script"}},sg=class extends Gi{getTypeName(){return"URL"}},lg=class extends Gi{getTypeName(){return"ResourceURL"}};function On(t){return t instanceof Gi?t.changingThisBreaksApplicationSecurity:t}function qi(t,n){let e=NC(t);if(e!=null&&e!==n){if(e==="ResourceURL"&&n==="URL")return!0;throw new Error(`Required a safe ${n}, got a ${e} (see ${Ud})`)}return e===n}function NC(t){return t instanceof Gi&&t.getTypeName()||null}function jg(t){return new rg(t)}function Vg(t){return new og(t)}function Bg(t){return new ag(t)}function Hg(t){return new sg(t)}function Ug(t){return new lg(t)}function VI(t){let n=new dg(t);return BI()?new cg(n):n}var cg=class{inertDocumentHelper;constructor(n){this.inertDocumentHelper=n}getInertBodyElement(n){n="<body><remove></remove>"+n;try{let e=new window.DOMParser().parseFromString(Bu(n),"text/html").body;return e===null?this.inertDocumentHelper.getInertBodyElement(n):(e.firstChild?.remove(),e)}catch{return null}}},dg=class{defaultDoc;inertDocument;constructor(n){this.defaultDoc=n,this.inertDocument=this.defaultDoc.implementation.createHTMLDocument("sanitization-inert")}getInertBodyElement(n){let e=this.inertDocument.createElement("template");return e.innerHTML=Bu(n),e}};function BI(){try{return!!new window.DOMParser().parseFromString(Bu(""),"text/html")}catch{return!1}}var HI=/^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;function Ll(t){return t=String(t),t.match(HI)?t:"unsafe:"+t}function Yi(t){let n=Object.create(null);for(let e of t.split(","))n[e]=!0;return n}function jl(...t){let n=Object.create(null);for(let e of t)for(let i in e)Object.hasOwn(e,i)&&(n[i]=!0);return n}var IC=Yi("area,br,col,hr,img,wbr"),TC=Yi("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),kC=Yi("rp,rt"),UI=jl(kC,TC),zI=jl(TC,Yi("address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul")),$I=jl(kC,Yi("a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video")),C0=jl(IC,zI,$I,UI),AC=Yi("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),WI=Yi("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"),GI=Yi("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"),qI=jl(AC,WI,GI),YI=Yi("script,style,template"),ug=class{sanitizedSomething=!1;buf=[];sanitizeChildren(n){let e=n.firstChild,i=!0,r=[];for(;e;){if(e.nodeType===Node.ELEMENT_NODE?i=this.startElement(e):e.nodeType===Node.TEXT_NODE?this.chars(e.nodeValue):this.sanitizedSomething=!0,i&&e.firstChild){r.push(e),e=XI(e);continue}for(;e;){e.nodeType===Node.ELEMENT_NODE&&this.endElement(e);let o=QI(e);if(o){e=o;break}e=r.pop()}}return this.buf.join("")}startElement(n){let e=w0(n).toLowerCase();if(!Object.hasOwn(C0,e))return this.sanitizedSomething=!0,!Object.hasOwn(YI,e);this.buf.push("<"),this.buf.push(e);let i=n.attributes;for(let r=0;r<i.length;r++){let o=i.item(r),a=o.name,s=a.toLowerCase();if(!Object.hasOwn(qI,s)){this.sanitizedSomething=!0;continue}let l=o.value;AC[s]&&(l=Ll(l)),this.buf.push(" ",a,'="',S0(l),'"')}return this.buf.push(">"),!0}endElement(n){let e=w0(n).toLowerCase();Object.hasOwn(C0,e)&&!Object.hasOwn(IC,e)&&(this.buf.push("</"),this.buf.push(e),this.buf.push(">"))}chars(n){this.buf.push(S0(n))}};function ZI(t,n){return(t.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY)!==Node.DOCUMENT_POSITION_CONTAINED_BY}function QI(t){let n=t.nextSibling;if(n&&t!==n.previousSibling)throw RC(n);return n}function XI(t){let n=t.firstChild;if(n&&ZI(t,n))throw RC(n);return n}function w0(t){let n=t.nodeName;return typeof n=="string"?n:"FORM"}function RC(t){return new Error(`Failed to sanitize html because the element is clobbered: ${t.outerHTML}`)}var KI=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,JI=/([^\#-~ |!])/g;function S0(t){return t.replace(/&/g,"&amp;").replace(KI,function(n){let e=n.charCodeAt(0),i=n.charCodeAt(1);return"&#"+((e-55296)*1024+(i-56320)+65536)+";"}).replace(JI,function(n){return"&#"+n.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}var gu;function zg(t,n){let e=null;try{gu=gu||VI(t);let i=n?String(n):"";e=gu.getInertBodyElement(i);let r=5,o=i;do{if(r===0)throw new Error("Failed to sanitize html because the input is unstable");r--,i=o,o=e.innerHTML,e=gu.getInertBodyElement(i)}while(i!==o);let s=new ug().sanitizeChildren(x0(e)||e);return Bu(s)}finally{if(e){let i=x0(e)||e;for(;i.firstChild;)i.firstChild.remove()}}}function x0(t){return"content"in t&&eT(t)?t.content:null}function eT(t){return t.nodeType===Node.ELEMENT_NODE&&t.nodeName==="TEMPLATE"}var tT=/^>|^->|<!--|-->|--!>|<!-$/g,nT=/(<|>)/g,iT="\u200B$1\u200B";function rT(t){return t.replace(tT,n=>n.replace(nT,iT))}function oT(t,n){return t.createText(n)}function aT(t,n,e){t.setValue(n,e)}function sT(t,n){return t.createComment(rT(n))}function OC(t,n,e){return t.createElement(n,e)}function Mo(t,n,e,i,r){t.insertBefore(n,e,i,r)}function PC(t,n,e){t.appendChild(n,e)}function D0(t,n,e,i,r){i!==null?Mo(t,n,e,i,r):PC(t,n,e)}function FC(t,n,e,i){t.removeChild(null,n,e,i)}function lT(t,n,e){t.setAttribute(n,"style",e)}function cT(t,n,e){e===""?t.removeAttribute(n,"class"):t.setAttribute(n,"class",e)}function LC(t,n,e){let{mergedAttrs:i,classes:r,styles:o}=e;i!==null&&gI(t,n,i),r!==null&&cT(t,n,r),o!==null&&lT(t,n,o)}function dT(t,n=!0){if(t[0]!=":")return[null,t];let e=t.indexOf(":",1);if(e===-1){if(n)throw new Error(`Unsupported format "${t}" expecting ":namespace:name"`);return[null,t]}return[t.slice(1,e),t.slice(e+1)]}function jC(t){let n=BC();return n?n.sanitize(ke.URL,t)||"":qi(t,"URL")?On(t):Ll(ga(t))}function VC(t){let n=BC();if(n)return y0(n.sanitize(ke.RESOURCE_URL,t)||"");if(qi(t,"ResourceURL"))return y0(On(t));throw new H(904,!1)}function uT(t,n){switch(mT(t,n)){case ke.RESOURCE_URL:return VC;case ke.URL:return jC;default:return null}}function $g(t,n,e){return uT(n,e)?.(t)??t}function BC(){let t=de();return t&&t[Xn].sanitizer}function mT(t,n){let[e,i]=fT(t);return Py(i,n,e)}function fT(t){t=t.toLowerCase();let n=dT(t,!1);if(n[0])return n;let i=Jn()===-1?null:Do(),r=i?.namespace;if(t==="#host"&&i?.type===2){let o=mn(i,de());if(o.tagName&&(t=o.tagName.toLowerCase()),r==null){let a=o.namespaceURI;r=a&&FI[a]}}return[r,t]}function hT(t){return t instanceof Function?t():t}function pT(t,n,e){let i=t.length;for(;;){let r=t.indexOf(n,e);if(r===-1)return r;if(r===0||t.charCodeAt(r-1)<=32){let o=n.length;if(r+o===i||t.charCodeAt(r+o)<=32)return r}e=r+1}}var HC="ng-template";function gT(t,n,e,i){let r=0;if(i){for(;r<n.length&&typeof n[r]=="string";r+=2)if(n[r]==="class"&&pT(n[r+1].toLowerCase(),e,0)!==-1)return!0}else if(Wg(t))return!1;if(r=n.indexOf(1,r),r>-1){let o;for(;++r<n.length&&typeof(o=n[r])=="string";)if(o.toLowerCase()===e)return!0}return!1}function Wg(t){return t.type===4&&t.value!==HC}function _T(t,n,e){let i=t.type===4&&!e?HC:t.value;return n===i}function vT(t,n,e){let i=4,r=t.attrs,o=r!==null?CT(r):0,a=!1;for(let s=0;s<n.length;s++){let l=n[s];if(typeof l=="number"){if(!a&&!ei(i)&&!ei(l))return!1;if(a&&ei(l))continue;a=!1,i=l|i&1;continue}if(!a)if(i&4){if(i=2|i&1,l!==""&&!_T(t,l,e)||l===""&&n.length===1){if(ei(i))return!1;a=!0}}else if(i&8){if(r===null||!gT(t,r,l,e)){if(ei(i))return!1;a=!0}}else{let d=n[++s],u=bT(l,r,Wg(t),e);if(u===-1){if(ei(i))return!1;a=!0;continue}if(d!==""){let h;if(u>o?h="":h=r[u+1].toLowerCase(),i&2&&d!==h){if(ei(i))return!1;a=!0}}}}return ei(i)||a}function ei(t){return(t&1)===0}function bT(t,n,e,i){if(n===null)return-1;let r=0;if(i||!e){let o=!1;for(;r<n.length;){let a=n[r];if(a===t)return r;if(a===3||a===6)o=!0;else if(a===1||a===2){let s=n[++r];for(;typeof s=="string";)s=n[++r];continue}else{if(a===4)break;if(a===0){r+=4;continue}}r+=o?1:2}return-1}else return wT(n,t)}function UC(t,n,e=!1){for(let i=0;i<n.length;i++)if(vT(t,n[i],e))return!0;return!1}function yT(t){let n=t.attrs;if(n!=null){let e=n.indexOf(5);if((e&1)===0)return n[e+1]}return null}function CT(t){for(let n=0;n<t.length;n++){let e=t[n];if(oC(e))return n}return t.length}function wT(t,n){let e=t.indexOf(4);if(e>-1)for(e++;e<t.length;){let i=t[e];if(typeof i=="number")return-1;if(i===n)return e;e++}return-1}function ST(t,n){e:for(let e=0;e<n.length;e++){let i=n[e];if(t.length===i.length){for(let r=0;r<t.length;r++)if(t[r]!==i[r])continue e;return!0}}return!1}function E0(t,n){return t?":not("+n.trim()+")":n}function xT(t){let n=t[0],e=1,i=2,r="",o=!1;for(;e<t.length;){let a=t[e];if(typeof a=="string")if(i&2){let s=t[++e];r+="["+a+(s.length>0?'="'+s+'"':"")+"]"}else i&8?r+="."+a:i&4&&(r+=" "+a);else r!==""&&!ei(a)&&(n+=E0(o,r),r=""),i=a,o=o||!ei(i);e++}return r!==""&&(n+=E0(o,r)),n}function DT(t){return t.map(xT).join(",")}function ET(t){let n=[],e=[],i=1,r=2;for(;i<t.length;){let o=t[i];if(typeof o=="string")r===2?o!==""&&n.push(o,t[++i]):r===8&&e.push(o);else{if(!ei(r))break;r=o}i++}return e.length&&n.push(1,...e),n}var tn={},Si=(function(t){return t[t.Important=1]="Important",t[t.DashCase=2]="DashCase",t})(Si||{}),MT;function Gg(t,n){return MT(t,n)}var Nr=new Set;var oG=typeof document<"u"&&typeof document?.documentElement?.getAnimations=="function";var mg=new WeakMap;function zC(t){return t?t[wr]??t:null}var El=new WeakSet;function NT(t,n,e){let i=mg.get(t);if(!i||i.length===0)return;let r=n.parentNode,o=n.previousSibling,a=zC(e);for(let s=i.length-1;s>=0;s--){let{el:l,declarationView:d}=i[s],u=l.parentNode;l===n?(i.splice(s,1),El.add(l),l.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}}))):o&&l===o?(i.splice(s,1),l.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}})),l.parentNode?.removeChild(l)):u&&r&&u!==r&&(a===null||d===null||a===d)&&(i.splice(s,1),l.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}})),l.parentNode?.removeChild(l))}}function IT(t,n,e){let i=zC(e),r=mg.get(t);r?r.some(o=>o.el===n)||r.push({el:n,declarationView:i}):mg.set(t,[{el:n,declarationView:i}])}var Hu=(function(t){return t[t.CHANGE_DETECTION=0]="CHANGE_DETECTION",t[t.AFTER_NEXT_RENDER=1]="AFTER_NEXT_RENDER",t})(Hu||{}),Di=new C(""),M0=new Set;function Ei(t){M0.has(t)||(M0.add(t),performance?.mark?.("mark_feature_usage",{detail:{feature:t}}))}var Uu=(()=>{class t{impl=null;execute(){this.impl?.execute()}static \u0275prov=me({token:t,providedIn:"root",factory:()=>new t})}return t})(),qg=[0,1,2,3],Yg=(()=>{class t{ngZone=c(U);scheduler=c(hi);errorHandler=c(Kt,{optional:!0});sequences=new Set;deferredRegistrations=new Set;executing=!1;constructor(){c(Di,{optional:!0})}execute(){let e=this.sequences.size>0;e&&He(Ie.AfterRenderHooksStart),this.executing=!0;for(let i of qg)for(let r of this.sequences)if(!(r.erroredOrDestroyed||!r.hooks[i]))try{r.pipelinedValue=this.ngZone.runOutsideAngular(()=>this.maybeTrace(()=>{let o=r.hooks[i];return o(r.pipelinedValue)},r.snapshot))}catch(o){r.erroredOrDestroyed=!0,this.errorHandler?.handleError(o)}this.executing=!1;for(let i of this.sequences)i.afterRun(),i.once&&(this.sequences.delete(i),i.destroy());for(let i of this.deferredRegistrations)this.sequences.add(i);this.deferredRegistrations.size>0&&this.scheduler.notify(7),this.deferredRegistrations.clear(),e&&He(Ie.AfterRenderHooksEnd)}register(e){let{view:i}=e;i!==void 0?((i[yo]??=[]).push(e),xo(i),i[fe]|=8192):this.executing?this.deferredRegistrations.add(e):this.addSequence(e)}addSequence(e){this.sequences.add(e),this.scheduler.notify(7)}unregister(e){this.executing&&this.sequences.has(e)?(e.erroredOrDestroyed=!0,e.pipelinedValue=void 0,e.once=!0):(this.sequences.delete(e),this.deferredRegistrations.delete(e))}maybeTrace(e,i){return i?i.run(Hu.AFTER_NEXT_RENDER,e):e()}static \u0275prov=me({token:t,providedIn:"root",factory:()=>new t})}return t})(),Tl=class{impl;hooks;view;once;snapshot;erroredOrDestroyed=!1;pipelinedValue=void 0;unregisterOnDestroy;constructor(n,e,i,r,o,a=null){this.impl=n,this.hooks=e,this.view=i,this.once=r,this.snapshot=a,this.unregisterOnDestroy=o?.onDestroy(()=>this.destroy())}afterRun(){this.erroredOrDestroyed=!1,this.pipelinedValue=void 0,this.snapshot?.dispose(),this.snapshot=null}destroy(){this.impl.unregister(this),this.unregisterOnDestroy?.();let n=this.view?.[yo];n&&(this.view[yo]=n.filter(e=>e!==this))}};function tt(t,n){let e=n?.injector??c(X);return Ei("NgAfterNextRender"),kT(t,e,n,!0)}function TT(t){return t instanceof Function?[void 0,void 0,t,void 0]:[t.earlyRead,t.write,t.mixedReadWrite,t.read]}function kT(t,n,e,i){let r=n.get(Uu);r.impl??=n.get(Yg);let o=n.get(Di,null,{optional:!0}),a=e?.manualCleanup!==!0?n.get(Xe):null,s=n.get(Da,null,{optional:!0}),l=new Tl(r.impl,TT(t),s?.view,i,a,o?.snapshot(null));return r.impl.register(l),l}var Zg=new C("",{factory:()=>{let t=c(We),n=new Set;return t.onDestroy(()=>n.clear()),{queue:n,isScheduled:!1,scheduler:null,injector:t}}});function $C(t,n,e){let i=t.get(Zg);if(Array.isArray(n))for(let r of n)i.queue.add(r),e?.detachedLeaveAnimationFns?.push(r);else i.queue.add(n),e?.detachedLeaveAnimationFns?.push(n);i.scheduler&&i.scheduler(t)}function AT(t,n){let e=t.get(Zg);if(Array.isArray(n))for(let i of n)e.queue.delete(i);else e.queue.delete(n)}function RT(t,n){let e=t.get(Zg);if(n.detachedLeaveAnimationFns){for(let i of n.detachedLeaveAnimationFns)e.queue.delete(i);n.detachedLeaveAnimationFns=void 0}}function OT(t,n){for(let[e,i]of n)$C(t,i.animateFns)}function N0(t,n,e,i){let r=t?.[yi]?.enter;n!==null&&r&&r.has(e.index)&&OT(i,r)}function I0(t,n,e,i){try{e.get(_l)}catch{return i(!1)}let r=t?.[yi];r?.enter?.has(n.index)&&AT(e,r.enter.get(n.index).animateFns);let o=PT(t,n,r);if(o.size===0){let a=!1;if(t){let s=[];zu(t,n,s),a=s.length>0}if(!a)return i(!1)}t&&Nr.add(t[bi]),$C(e,()=>FT(t,n,r||void 0,o,i),r||void 0)}function PT(t,n,e){let i=new Map,r=e?.leave;if(r&&r.has(n.index)&&i.set(n.index,r.get(n.index)),t&&r)for(let[o,a]of r){if(i.has(o))continue;let l=t[ie].data[o].parent;for(;l;){if(l===n){i.set(o,a);break}l=l.parent}}return i}function FT(t,n,e,i,r){let o=[];if(e&&e.leave)for(let[a]of i){if(!e.leave.has(a))continue;let s=e.leave.get(a);for(let l of s.animateFns){let{promise:d}=l();o.push(d)}e.detachedLeaveAnimationFns=void 0}if(t&&zu(t,n,o),o.length>0){let a=e||t?.[yi];if(a){let s=a.running;s&&o.push(s),a.running=Promise.allSettled(o),jT(t,a.running,r)}else Promise.allSettled(o).then(()=>{t&&Nr.delete(t[bi]),r(!0)})}else t&&Nr.delete(t[bi]),r(!1)}function zu(t,n,e){if(n.type&12){let r=t[n.index];if(kn(r))for(let o=ft;o<r.length;o++){let a=r[o];a[ie].type===2&&LT(a,e)}}let i=n.child;for(;i;)zu(t,i,e),i=i.next}function LT(t,n){let e=t[yi];if(e&&e.leave)for(let r of e.leave.values())for(let o of r.animateFns){let{promise:a}=o();n.push(a)}let i=t[ie].firstChild;for(;i;)zu(t,i,n),i=i.next}function jT(t,n,e){n.then(()=>{t[yi]?.running===n&&(t[yi].running=void 0,Nr.delete(t[bi])),e(!0)})}function Ma(t,n,e,i,r,o,a,s){if(r!=null){let l,d=!1;kn(r)?l=r:zi(r)&&(d=!0,r=r[Qn]);let u=Ut(r);t===0&&i!==null?(N0(s,i,o,e),a==null?PC(n,i,u):Mo(n,i,u,a||null,!0)):t===1&&i!==null?(N0(s,i,o,e),Mo(n,i,u,a||null,!0),NT(o,u,s)):t===2?(s?.[yi]?.leave?.has(o.index)&&IT(o,u,s),El.delete(u),I0(s,o,e,h=>{if(El.has(u)){El.delete(u);return}FC(n,u,d,h)})):t===3&&(El.delete(u),I0(s,o,e,()=>{n.destroyNode(u)})),l!=null&&ZT(n,t,e,l,o,i,a)}}function VT(t,n){WC(t,n),n[Qn]=null,n[Ht]=null}function BT(t,n,e,i,r,o){i[Qn]=r,i[Ht]=n,Wu(t,i,e,1,r,o)}function WC(t,n){n[Xn].changeDetectionScheduler?.notify(9),Wu(t,n,n[Ye],2,null,null)}function HT(t){let n=t[Ca];if(!n)return zp(t[ie],t);for(;n;){let e=null;if(zi(n))e=n[Ca];else{let i=n[ft];i&&(e=i)}if(!e){for(;n&&!n[Tn]&&n!==t;)zi(n)&&zp(n[ie],n),n=n[At];n===null&&(n=t),zi(n)&&zp(n[ie],n),e=n&&n[Tn]}n=e}}function Qg(t,n){let e=t[wo],i=e.indexOf(n);e.splice(i,1)}function $u(t,n){if(So(n))return;let e=n[Ye];e.destroyNode&&Wu(t,n,e,3,null,null),HT(n)}function zp(t,n){if(So(n))return;let e=se(null);try{n[fe]&=-129,n[fe]|=256,n[vn]&&hr(n[vn]),zT(t,n),UT(t,n),n[ie].type===1&&n[Ye].destroy();let i=n[Sr];if(i!==null&&kn(n[At])){i!==n[At]&&Qg(i,n);let r=n[vi];r!==null&&r.detachView(t)}tg(n)}finally{se(e)}}function UT(t,n){let e=t.cleanup,i=n[ya];if(e!==null)for(let a=0;a<e.length-1;a+=2)if(typeof e[a]=="string"){let s=e[a+3];s>=0?i[s]():i[-s].unsubscribe(),a+=2}else{let s=i[e[a+1]];e[a].call(s)}i!==null&&(n[ya]=null);let r=n[Bi];if(r!==null){n[Bi]=null;for(let a=0;a<r.length;a++){let s=r[a];s()}}let o=n[Hi];if(o!==null){n[Hi]=null;for(let a of o)a.destroy()}}function zT(t,n){let e;if(t!=null&&(e=t.destroyHooks)!=null)for(let i=0;i<e.length;i+=2){let r=n[e[i]];if(!(r instanceof Io)){let o=e[i+1];if(Array.isArray(o))for(let a=0;a<o.length;a+=2){let s=r[o[a]],l=o[a+1];He(Ie.LifecycleHookStart,s,l);try{l.call(s)}finally{He(Ie.LifecycleHookEnd,s,l)}}else{He(Ie.LifecycleHookStart,r,o);try{o.call(r)}finally{He(Ie.LifecycleHookEnd,r,o)}}}}}function GC(t,n,e){if(n===null)throw new H(510,!1);return $T(t,n.parent,e)}function $T(t,n,e){let i=n;for(;i!==null&&i.type&168;)n=i,i=n.parent;if(i===null)return e[Qn];if(Ci(i)){let{encapsulation:r}=t.data[i.directiveStart+i.componentOffset];if(r===ni.None||r===ni.Emulated)return null}return mn(i,e)}function qC(t,n,e){return GT(t,n,e)}function WT(t,n,e){return t.type&40?mn(t,e):null}var GT=WT,T0;function Xg(t,n,e,i){let r=GC(t,i,n),o=n[Ye],a=i.parent||n[Ht],s=qC(a,i,n);if(r!=null)if(Array.isArray(e))for(let l=0;l<e.length;l++)D0(o,r,e[l],s,!1);else D0(o,r,e,s,!1);T0!==void 0&&T0(o,i,n,e,r)}function Ml(t,n){if(n!==null){let e=n.type;if(e&3)return mn(n,t);if(e&4)return fg(-1,t[n.index]);if(e&8){let i=n.child;if(i!==null)return Ml(t,i);{let r=t[n.index];return kn(r)?fg(-1,r):Ut(r)}}else{if(e&128)return Ml(t,n.next);if(e&32)return Gg(n,t)()||Ut(t[n.index]);{let i=YC(t,n);if(i!==null){if(Array.isArray(i))return i[0];let r=Ui(t[en]);return Ml(r,i)}else return Ml(t,n.next)}}}return null}function YC(t,n){if(n!==null){let i=t[en][Ht],r=n.projection;return i.projection[r]}return null}function fg(t,n){let e=ft+t+1;if(e<n.length){let i=n[e],r=i[ie].firstChild;if(r!==null)return Ml(i,r)}return n[Co]}function Kg(t,n,e,i,r,o,a){for(;e!=null;){let s=i[_i];if(e.type===128){e=e.next;continue}let l=i[e.index],d=e.type;if(a&&n===0&&(l&&Ta(Ut(l),i),e.flags|=2),!Vu(e))if(d&8)Kg(t,n,e.child,i,r,o,!1),Ma(n,t,s,r,l,e,o,i);else if(d&32){let u=Gg(e,i),h;for(;h=u();)Ma(n,t,s,r,h,e,o,i);Ma(n,t,s,r,l,e,o,i)}else d&16?ZC(t,n,i,e,r,o):Ma(n,t,s,r,l,e,o,i);e=a?e.projectionNext:e.next}}function Wu(t,n,e,i,r,o){t.type===3?qT(e,i,n,r,o):Kg(e,i,t.firstChild,n,r,o,!1)}function qT(t,n,e,i,r){let a=e[ie].firstChild,s=a.next,l=Ut(e[a.index]),d=Ut(e[s.index]),u=s.index+1,h=e[u];if(n===1||n===0)i!==null&&(h&&h.hasChildNodes()?Mo(t,i,h,r,!0):(Mo(t,i,l,r,!0),Mo(t,i,d,r,!0)));else if(n===2){if(h||(h=document.createDocumentFragment(),e[u]=h),l&&l.parentNode===h)return;let _=l;for(;_!==null;){let v=_.nextSibling;if(h.appendChild(_),_===d)break;_=v}}}function YT(t,n,e){let i=n[Ye],r=GC(t,e,n),o=e.parent||n[Ht],a=qC(o,e,n);ZC(i,0,n,e,r,a)}function ZC(t,n,e,i,r,o){let a=e[en],l=a[Ht].projection[i.projection];if(Array.isArray(l))for(let d=0;d<l.length;d++){let u=l[d];Ma(n,t,e[_i],r,u,i,o,e)}else{let d=l,u=a[At];gC(i)&&(d.flags|=128),Kg(t,n,d,u,r,o,!0)}}function ZT(t,n,e,i,r,o,a){let s=i[Co],l=Ut(i);if(s!==l&&Ma(n,t,e,o,s,r,a),(i[fe]&4)===0)for(let d=ft;d<i.length;d++){let u=i[d];Wu(u[ie],u,t,n,o,s)}}function QT(t,n,e,i,r){if(n)r?t.addClass(e,i):t.removeClass(e,i);else{let o=i.indexOf("-")===-1?void 0:Si.DashCase;r==null?t.removeStyle(e,i,o):(typeof r=="string"&&r.endsWith("!important")&&(r=r.slice(0,-10),o|=Si.Important),t.setStyle(e,i,r,o))}}function Jg(t,n,e,i,r,o,a,s,l,d,u){let h=_t+i,_=h+r,v=XT(h,_),x=typeof d=="function"?d():d;return v[ie]={type:t,blueprint:v,template:e,queries:null,viewQuery:s,declTNode:n,data:v.slice().fill(null,h),bindingStartIndex:h,expandoStartIndex:_,hostBindingOpCodes:null,firstCreatePass:!0,firstUpdatePass:!0,staticViewQueries:!1,staticContentQueries:!1,preOrderHooks:null,preOrderCheckHooks:null,contentHooks:null,contentCheckHooks:null,viewHooks:null,viewCheckHooks:null,destroyHooks:null,cleanup:null,contentQueries:null,components:null,directiveRegistry:typeof o=="function"?o():o,pipeRegistry:typeof a=="function"?a():a,firstChild:null,schemas:l,consts:x,incompleteFirstPass:!1,ssrId:u}}function XT(t,n){let e=[];for(let i=0;i<n;i++)e.push(i<t?null:tn);return e}function KT(t){let n=t.tView;return n===null||n.incompleteFirstPass?t.tView=Jg(1,null,t.template,t.decls,t.vars,t.directiveDefs,t.pipeDefs,t.viewQuery,t.schemas,t.consts,t.id):n}function e_(t,n,e,i,r,o,a,s,l,d,u){let h=n.blueprint.slice();return h[Qn]=r,h[fe]=i|4|128|8|64|1024,(d!==null||t&&t[fe]&2048)&&(h[fe]|=2048),Cp(h),h[At]=h[wr]=t,h[St]=e,h[Xn]=a||t&&t[Xn],h[Ye]=s||t&&t[Ye],h[_i]=l||t&&t[_i]||null,h[Ht]=o,h[bi]=TI(),h[vo]=u,h[_p]=d,h[en]=n.type==2?t[en]:h,h}function JT(t,n,e){let i=mn(n,t),r=KT(e),o=t[Xn].rendererFactory,a=t_(t,e_(t,r,null,QC(e),i,n,null,o.createRenderer(i,e),null,null,null));return t[n.index]=a}function QC(t){let n=16;return t.signals?n=4096:t.onPush&&(n=64),n}function XC(t,n,e,i){if(e===0)return-1;let r=n.length;for(let o=0;o<e;o++)n.push(i),t.blueprint.push(i),t.data.push(null);return r}function t_(t,n){return t[Ca]?t[gp][Tn]=n:t[Ca]=n,t[gp]=n,n}function p(t=1){KC(et(),de(),Jn()+t,!1)}function KC(t,n,e,i){if(!i)if((n[fe]&3)===3){let o=t.preOrderCheckHooks;o!==null&&vu(n,o,e)}else{let o=t.preOrderHooks;o!==null&&bu(n,o,0,e)}Dr(e)}var Vl=(function(t){return t[t.None=0]="None",t[t.SignalBased=1]="SignalBased",t[t.HasDecoratorInputTransform=2]="HasDecoratorInputTransform",t})(Vl||{});function To(t,n,e,i){let r=se(null);try{let[o,a,s]=t.inputs[e],l=null;(a&Vl.SignalBased)!==0&&(l=n[o][pt]),l!==null&&l.transformFn!==void 0?i=l.transformFn(i):s!==null&&(i=s.call(n,i)),t.setInput!==null?t.setInput(n,l,i,e,o):eC(n,l,o,i)}finally{se(r)}}function JC(t,n,e,i,r){let o=Jn(),a=i&2;try{Dr(-1),a&&n.length>_t&&KC(t,n,_t,!1);let s=a?Ie.TemplateUpdateStart:Ie.TemplateCreateStart;He(s,r,e),e(i,r)}finally{Dr(o);let s=a?Ie.TemplateUpdateEnd:Ie.TemplateCreateEnd;He(s,r,e)}}function Gu(t,n,e){ok(t,n,e),(e.flags&64)===64&&ak(t,n,e)}function Bl(t,n,e=mn){let i=n.localNames;if(i!==null){let r=n.index+1;for(let o=0;o<i.length;o+=2){let a=i[o+1],s=a===-1?e(n,t):t[a];t[r++]=s}}}function ek(t,n,e,i){let o=i.get(DC,xC)||e===ni.ShadowDom||e===ni.ExperimentalIsolatedShadowDom,a=t.selectRootElement(n,o);return tk(a),a}function tk(t){nk(t)}var nk=()=>null;function ik(t){return t==="class"?"className":t==="for"?"htmlFor":t==="formaction"?"formAction":t==="innerHtml"?"innerHTML":t==="readonly"?"readOnly":t==="tabindex"?"tabIndex":t}function rk(t,n,e,i,r,o){let a=n[ie];if(qu(t,a,n,e,i)){Ci(t)&&tw(n,t.index);return}t.type&3&&(e=ik(e)),ew(t,n,e,i,r,o)}function ew(t,n,e,i,r,o){if(t.type&3){let a=mn(t,n);i=o!=null?o(i,t.value||"",e):i,r.setProperty(a,e,i)}else t.type&12}function tw(t,n){let e=An(n,t);e[fe]&16||(e[fe]|=64)}function ok(t,n,e){let i=e.directiveStart,r=e.directiveEnd;Ci(e)&&JT(n,e,t.data[i+e.componentOffset]),t.firstCreatePass||Du(e,n);let o=e.initialInputs;for(let a=i;a<r;a++){let s=t.data[a],l=Il(n,t,a,e);if(Ta(l,n),o!==null&&ck(n,a-i,l,s,e,o),Kn(s)){let d=An(e.index,n);d[St]=Il(n,t,a,e)}}}function ak(t,n,e){let i=e.directiveStart,r=e.directiveEnd,o=e.index,a=Qy();try{Dr(o);for(let s=i;s<r;s++){let l=t.data[s],d=n[s];au(s),(l.hostBindings!==null||l.hostVars!==0||l.hostAttrs!==null)&&sk(l,d)}}finally{Dr(-1),au(a)}}function sk(t,n){t.hostBindings!==null&&t.hostBindings(1,n)}function n_(t,n){let e=t.directiveRegistry,i=null;if(e)for(let r=0;r<e.length;r++){let o=e[r];UC(n,o.selectors,!1)&&(i??=[],Kn(o)?i.unshift(o):i.push(o))}return i}function lk(t,n,e,i,r,o){let a=mn(t,n);nw(n[Ye],a,o,t.value,e,i,r)}function nw(t,n,e,i,r,o,a){if(o==null)a?.(o,i||"",r),t.removeAttribute(n,r,e);else{let s=a==null?ga(o):a(o,i||"",r);t.setAttribute(n,r,s,e)}}function ck(t,n,e,i,r,o){let a=o[n];if(a!==null)for(let s=0;s<a.length;s+=2){let l=a[s],d=a[s+1];To(i,e,l,d)}}function i_(t,n,e,i,r){let o=_t+e,a=n[ie],s=r(a,n,t,i,e);n[o]=s,xa(t,!0);let l=t.type===2;return l?(LC(n[Ye],s,t),(Uy()===0||wa(t))&&Ta(s,n),zy()):Ta(s,n),du()&&(!l||!Vu(t))&&Xg(a,n,s,t),t}function r_(t){let n=t;return Tp()?kp():(n=n.parent,xa(n,!1)),n}function dk(t,n){let e=t[_i];if(!e)return;let i;try{i=e.get(Rn,null)}catch{i=null}i?.(n)}function qu(t,n,e,i,r){let o=t.inputs?.[i],a=t.hostDirectiveInputs?.[i],s=!1;if(a)for(let l=0;l<a.length;l+=2){let d=a[l],u=a[l+1],h=n.data[d];To(h,e[d],u,r),s=!0}if(o)for(let l of o){let d=e[l],u=n.data[l];To(u,d,i,r),s=!0}return s}function uk(t,n,e,i,r,o){let a=null,s=null,l=null,d=!1,u=t.directiveToIndex.get(i.type);if(typeof u=="number"?a=u:[a,s,l]=u,s!==null&&l!==null&&t.hostDirectiveInputs&&Object.hasOwn(t.hostDirectiveInputs,r)){let h=t.hostDirectiveInputs[r];for(let _=0;_<h.length;_+=2){let v=h[_];if(v>=s&&v<=l){let x=n.data[v],A=h[_+1];To(x,e[v],A,o),d=!0}else if(v>l)break}}return a!==null&&Object.hasOwn(i.inputs,r)&&(To(i,e[a],r,o),d=!0),d}function mk(t,n){let e=An(n,t),i=e[ie];fk(i,e);let r=e[Qn];r!==null&&e[vo]===null&&(e[vo]=EC(r,e[_i])),He(Ie.ComponentStart);try{o_(i,e,e[St])}finally{He(Ie.ComponentEnd,e[St])}}function fk(t,n){for(let e=n.length;e<t.blueprint.length;e++)n.push(t.blueprint[e])}function o_(t,n,e){lu(n);try{let i=t.viewQuery;i!==null&&ig(1,i,e);let r=t.template;r!==null&&JC(t,n,r,1,e),t.firstCreatePass&&(t.firstCreatePass=!1),n[vi]?.finishViewCreation(t),t.staticContentQueries&&MC(t,n),t.staticViewQueries&&ig(2,t.viewQuery,e);let o=t.components;o!==null&&hk(n,o)}catch(i){throw t.firstCreatePass&&(t.incompleteFirstPass=!0,t.firstCreatePass=!1),i}finally{n[fe]&=-5,cu()}}function hk(t,n){for(let e=0;e<n.length;e++)mk(t,n[e])}function Hl(t,n,e,i){let r=se(null);try{let o=n.tView,s=t[fe]&4096?4096:16,l=e_(t,o,e,s,null,n,null,null,i?.injector??null,i?.embeddedViewInjector??null,i?.dehydratedView??null),d=t[n.index];l[Sr]=d;let u=t[vi];return u!==null&&(l[vi]=u.createEmbeddedView(o)),o_(o,l,e),l}finally{se(r)}}function ka(t,n){return!n||n.firstChild===null||gC(t)}function kl(t,n,e,i,r=!1){if(t.type===3){let o=t.firstChild,a=o.next,s=Ut(n[o.index]),l=Ut(n[a.index]),d=s;for(;d!==null&&(i.push(d),d!==l);)d=d.nextSibling;return i}for(;e!==null;){if(e.type===128){e=r?e.projectionNext:e.next;continue}let o=n[e.index];if(o!==null)if(kn(o)){let s=o[Co];s!==o[Qn]&&i.push(Ut(o)),o[fe]&4||iw(o,i),i.push(s)}else i.push(Ut(o));let a=e.type;if(a&8)kl(t,n,e.child,i);else if(a&32){let s=Gg(e,n),l;for(;l=s();)i.push(l)}else if(a&16){let s=YC(n,e);if(Array.isArray(s))i.push(...s);else{let l=Ui(n[en]);kl(l[ie],l,s,i,!0)}}e=r?e.projectionNext:e.next}return i}function iw(t,n){for(let e=ft;e<t.length;e++){let i=t[e],r=i[ie].firstChild;r!==null&&kl(i[ie],i,r,n)}}function rw(t){if(t[yo]!==null){for(let n of t[yo])n.impl.addSequence(n);t[yo].length=0}}var ow=[];function pk(t){return t[vn]??gk(t)}function gk(t){let n=ow.pop()??Object.create(vk);return n.lView=t,n}function _k(t){t.lView[vn]!==t&&(t.lView=null,ow.push(t))}var vk=V(b({},ur),{consumerIsAlwaysLive:!0,kind:"template",consumerMarkedDirty:t=>{xo(t.lView)},consumerOnSignalRead(){this.lView[vn]=this}});function bk(t){let n=t[vn]??Object.create(yk);return n.lView=t,n}var yk=V(b({},ur),{consumerIsAlwaysLive:!0,kind:"template",consumerMarkedDirty:t=>{let n=Ui(t.lView);for(;n&&!aw(n[ie]);)n=Ui(n);n&&wp(n)},consumerOnSignalRead(){this.lView[vn]=this}});function aw(t){return t.type!==2}function sw(t){if(t[Hi]===null)return;let n=!0;for(;n;){let e=!1;for(let i of t[Hi])if(i.dirty&&(e=!0,i.zone===null||Zone.current===i.zone?i.run():i.zone.run(()=>i.run()),t[Hi]===null))return;n=e&&!!(t[fe]&8192)}}var Ck=100;function lw(t,n=0){let i=t[Xn].rendererFactory,r=!1;r||i.begin?.();try{wk(t,n)}finally{r||i.end?.()}}function wk(t,n){let e=Ap();try{cl(!0),hg(t,n);let i=0;for(;yl(t);){if(i===Ck)throw new H(103,!1);i++,hg(t,1)}}finally{cl(e)}}function Sk(t,n,e,i){if(So(n))return;let r=n[fe],o=!1,a=!1;lu(n);let s=!0,l=null,d=null;o||(aw(t)?(d=pk(n),l=Fi(d)):id()===null?(s=!1,d=bk(n),l=Fi(d)):n[vn]&&(hr(n[vn]),n[vn]=null));try{Cp(n),qy(t.bindingStartIndex),e!==null&&JC(t,n,e,2,i);let u=(r&3)===3;if(!o)if(u){let v=t.preOrderCheckHooks;v!==null&&vu(n,v,null)}else{let v=t.preOrderHooks;v!==null&&bu(n,v,0,null),Hp(n,0)}if(a||xk(n),sw(n),cw(n,0),t.contentQueries!==null&&MC(t,n),!o)if(u){let v=t.contentCheckHooks;v!==null&&vu(n,v)}else{let v=t.contentHooks;v!==null&&bu(n,v,1),Hp(n,1)}Ek(t,n);let h=t.components;h!==null&&uw(n,h,0);let _=t.viewQuery;if(_!==null&&ig(2,_,i),!o)if(u){let v=t.viewCheckHooks;v!==null&&vu(n,v)}else{let v=t.viewHooks;v!==null&&bu(n,v,2),Hp(n,2)}if(t.firstUpdatePass===!0&&(t.firstUpdatePass=!1),n[Xd]){for(let v of n[Xd])v();n[Xd]=null}o||(rw(n),n[fe]&=-73)}catch(u){throw o||xo(n),u}finally{d!==null&&(fr(d,l),s&&_k(d)),cu()}}function cw(t,n){for(let e=vC(t);e!==null;e=bC(e))for(let i=ft;i<e.length;i++){let r=e[i];dw(r,n)}}function xk(t){for(let n=vC(t);n!==null;n=bC(n)){if(!(n[fe]&2))continue;let e=n[wo];for(let i=0;i<e.length;i++){let r=e[i];wp(r)}}}function Dk(t,n,e){He(Ie.ComponentStart);let i=An(n,t);try{dw(i,e)}finally{He(Ie.ComponentEnd,i[St])}}function dw(t,n){eu(t)&&hg(t,n)}function hg(t,n){let i=t[ie],r=t[fe],o=t[vn],a=!!(n===0&&r&16);if(a||=!!(r&64&&n===0),a||=!!(r&1024),a||=!!(o?.dirty&&ra(o)),a||=!1,o&&(o.dirty=!1),t[fe]&=-9217,a)Sk(i,t,i.template,t[St]);else if(r&8192){let s=se(null);try{sw(t),cw(t,1);let l=i.components;l!==null&&uw(t,l,1),rw(t)}finally{se(s)}}}function uw(t,n,e){for(let i=0;i<n.length;i++)Dk(t,n[i],e)}function Ek(t,n){let e=t.hostBindingOpCodes;if(e!==null)try{for(let i=0;i<e.length;i++){let r=e[i];if(r<0)Dr(~r);else{let o=r,a=e[++i],s=e[++i];Zy(a,o);let l=n[o];He(Ie.HostBindingsUpdateStart,l);try{s(2,l)}finally{He(Ie.HostBindingsUpdateEnd,l)}}}}finally{Dr(-1)}}function a_(t,n){let e=Ap()?64:1088;for(t[Xn].changeDetectionScheduler?.notify(n);t;){t[fe]|=e;let i=Ui(t);if(Sa(t)&&!i)return t;t=i}return null}function mw(t,n,e,i){return[t,!0,0,n,null,i,null,e,null,null]}function fw(t,n){let e=ft+n;if(e<t.length)return t[e]}function Ul(t,n,e,i=!0){let r=n[ie];if(Mk(r,n,t,e),i){let a=fg(e,t),s=n[Ye],l=s.parentNode(t[Co]);l!==null&&BT(r,t[Ht],s,n,l,a)}let o=n[vo];o!==null&&o.firstChild!==null&&(o.firstChild=null)}function hw(t,n){let e=Al(t,n);return e!==void 0&&$u(e[ie],e),e}function Al(t,n){if(t.length<=ft)return;let e=ft+n,i=t[e];if(i){let r=i[Sr];r!==null&&r!==t&&Qg(r,i),n>0&&(t[e-1][Tn]=i[Tn]);let o=gl(t,ft+n);VT(i[ie],i);let a=o[vi];a!==null&&a.detachView(o[ie]),i[At]=null,i[Tn]=null,i[fe]&=-129}return i}function Mk(t,n,e,i){let r=ft+i,o=e.length;i>0&&(e[r-1][Tn]=n),i<o-ft?(n[Tn]=e[r],up(e,ft+i,n)):(e.push(n),n[Tn]=null),n[At]=e;let a=n[Sr];a!==null&&e!==a&&pw(a,n);let s=n[vi];s!==null&&s.insertView(t),tu(n),n[fe]|=128}function pw(t,n){let e=t[wo],i=n[At];if(zi(i))t[fe]|=2;else{let r=i[At][en];n[en]!==r&&(t[fe]|=2)}e===null?t[wo]=[n]:e.push(n)}var Ir=class{_lView;_cdRefInjectingView;_appRef=null;_attachedToViewContainer=!1;exhaustive;get rootNodes(){let n=this._lView,e=n[ie];return kl(e,n,e.firstChild,[])}constructor(n,e){this._lView=n,this._cdRefInjectingView=e}get context(){return this._lView[St]}set context(n){this._lView[St]=n}get destroyed(){return So(this._lView)}destroy(){if(this._appRef)this._appRef.detachView(this);else if(this._attachedToViewContainer){let n=this._lView[At];if(kn(n)){let e=n[bl],i=e?e.indexOf(this):-1;i>-1&&(Al(n,i),gl(e,i))}this._attachedToViewContainer=!1}$u(this._lView[ie],this._lView)}onDestroy(n){nu(this._lView,n)}markForCheck(){a_(this._cdRefInjectingView||this._lView,4)}detach(){this._lView[fe]&=-129}reattach(){tu(this._lView),this._lView[fe]|=128}detectChanges(){this._lView[fe]|=1024,lw(this._lView)}checkNoChanges(){}attachToViewContainerRef(){if(this._appRef)throw new H(902,!1);this._attachedToViewContainer=!0}detachFromAppRef(){this._appRef=null;let n=Sa(this._lView),e=this._lView[Sr];e!==null&&!n&&Qg(e,this._lView),WC(this._lView[ie],this._lView)}attachToAppRef(n){if(this._attachedToViewContainer)throw new H(902,!1);this._appRef=n;let e=Sa(this._lView),i=this._lView[Sr];i!==null&&!e&&pw(i,this._lView),tu(this._lView)}};var bt=(()=>{class t{_declarationLView;_declarationTContainer;elementRef;static __NG_ELEMENT_ID__=Nk;constructor(e,i,r){this._declarationLView=e,this._declarationTContainer=i,this.elementRef=r}get ssrId(){return this._declarationTContainer.tView?.ssrId||null}createEmbeddedView(e,i){return this.createEmbeddedViewImpl(e,i)}createEmbeddedViewImpl(e,i,r){let o=Hl(this._declarationLView,this._declarationTContainer,e,{embeddedViewInjector:i,dehydratedView:r});return new Ir(o)}}return t})();function Nk(){return Yu(Ot(),de())}function Yu(t,n){return t.type&4?new bt(n,t,Pa(t,n)):null}function Fa(t,n,e,i,r){let o=t.data[n];if(o===null)o=Ik(t,n,e,i,r),Yy()&&(o.flags|=32);else if(o.type&64){o.type=e,o.value=i,o.attrs=r;let a=$y();o.injectorIndex=a===null?-1:a.injectorIndex}return xa(o,!0),o}function Ik(t,n,e,i,r){let o=Ip(),a=Tp(),s=a?o:o&&o.parent,l=t.data[n]=kk(t,s,e,n,i,r);return Tk(t,l,o,a),l}function Tk(t,n,e,i){t.firstChild===null&&(t.firstChild=n),e!==null&&(i?e.child==null&&n.parent!==null&&(e.child=n):e.next===null&&(e.next=n,n.prev=e))}function kk(t,n,e,i,r,o){let a=n?n.injectorIndex:-1,s=0;return Ep()&&(s|=128),{type:e,index:i,insertBeforeIndex:null,injectorIndex:a,directiveStart:-1,directiveEnd:-1,directiveStylingLast:-1,componentOffset:-1,controlDirectiveIndex:-1,customControlIndex:-1,propertyBindings:null,flags:s,providerIndexes:0,value:r,namespace:Pp(),attrs:o,mergedAttrs:null,localNames:null,initialInputs:null,inputs:null,hostDirectiveInputs:null,outputs:null,hostDirectiveOutputs:null,directiveToIndex:null,tView:null,next:null,prev:null,projectionNext:null,child:null,parent:n,projection:null,styles:null,stylesWithoutHost:null,residualStyles:void 0,classes:null,classesWithoutHost:null,residualClasses:void 0,classBindings:0,styleBindings:0}}function Ak(t){let n=t[vp]??[],i=t[At][Ye],r=[];for(let o of n)o.data[SC]!==void 0?r.push(o):Rk(o,i);t[vp]=r}function Rk(t,n){let e=0,i=t.firstChild;if(i){let r=t.data[wC];for(;e<r;){let o=i.nextSibling;FC(n,i,!1),i=o,e++}}}var Ok=()=>null,Pk=()=>null;function Eu(t,n){return Ok(t,n)}function gw(t,n,e){return Pk(t,n,e)}var _w=class{},Mt=class{},Se=class{destroyNode=null;static __NG_ELEMENT_ID__=()=>Fk()};function Fk(){let t=de(),n=Ot(),e=An(n.index,t);return(zi(e)?e:t)[Ye]}var vw=(()=>{class t{static \u0275prov=me({token:t,providedIn:"root",factory:()=>null})}return t})();function bw(t){return t.debugInfo?.className||t.type.name||null}var Cu={},Mu=class{injector;parentInjector;constructor(n,e){this.injector=n,this.parentInjector=e}get(n,e,i){let r=this.injector.get(n,Cu,i);return r!==Cu||e===Cu?r:this.parentInjector.get(n,e,i)}};function s_(t,n,e){return t[n]=e}function Lk(t,n){return t[n]}function Pn(t,n,e){if(e===tn)return!1;let i=t[n];return Object.is(i,e)?!1:(t[n]=e,!0)}function yw(t,n,e,i){let r=Pn(t,n,e);return Pn(t,n+1,i)||r}function No(t,n,e){return function i(r){let o=i.__ngNativeEl__;o!==void 0&&AI(r,o);let a=Ci(t)?An(t.index,n):n;a_(a,5);let s=n[St],l=k0(n,s,e,r),d=i.__ngNextListenerFn__;for(;d;)l=k0(n,s,d,r)&&l,d=d.__ngNextListenerFn__;return l}}function k0(t,n,e,i){let r=se(null);try{return He(Ie.OutputStart,n,e),e(i)!==!1}catch(o){return dk(t,o),!1}finally{He(Ie.OutputEnd,n,e),se(r)}}function l_(t,n,e,i,r,o,a,s){let l=wa(t),d=!1,u=null;if(!i&&l&&(u=Vk(n,e,o,t.index)),u!==null){let h=u.__ngLastListenerFn__||u;h.__ngNextListenerFn__=a,u.__ngLastListenerFn__=a,d=!0}else{let h=mn(t,e),_=i?i(h):h;OI(e,_,o,s),i||(s.__ngNativeEl__=h);let v=r.listen(_,o,s);if(!jk(o)){let x=i?A=>i(Ut(A[t.index])):t.index;Cw(x,n,e,o,s,v,!1)}}return d}function jk(t){return t.startsWith("animation")||t.startsWith("transition")}function Vk(t,n,e,i){let r=t.cleanup;if(r!=null)for(let o=0;o<r.length-1;o+=2){let a=r[o];if(a===e&&r[o+1]===i){let s=n[ya],l=r[o+2];return s&&s.length>l?s[l]:null}typeof a=="string"&&(o+=2)}return null}function Cw(t,n,e,i,r,o,a){let s=n.firstCreatePass?xp(n):null,l=Sp(e),d=l.length;l.push(r,o),s&&s.push(i,t,d,(d+1)*(a?-1:1))}function A0(t,n,e,i,r){let o=null,a=null,s=null,l=!1,d=t.directiveToIndex.get(e.type);if(typeof d=="number"?o=d:[o,a,s]=d,a!==null&&s!==null&&t.hostDirectiveOutputs&&Object.hasOwn(t.hostDirectiveOutputs,i)){let u=t.hostDirectiveOutputs[i];for(let h=0;h<u.length;h+=2){let _=u[h];if(_>=a&&_<=s)l=!0,Nu(t,n,_,u[h+1],i,r);else if(_>s)break}}return Object.hasOwn(e.outputs,i)&&(l=!0,Nu(t,n,o,i,i,r)),l}function Nu(t,n,e,i,r,o){let a=n[e],s=n[ie],d=s.data[e].outputs[i],h=a[d].subscribe(o);Cw(t.index,s,n,r,o,h,!0)}function ii(){Bk()}function Bk(){let t=de(),n=et(),e=Ot();if(n.firstCreatePass&&Uk(n,e),e.controlDirectiveIndex===-1)return;Ei("NgSignalForms");let i=t[e.controlDirectiveIndex];n.data[e.controlDirectiveIndex].controlDef.create(i,new Iu(t,n,e))}function ri(){Hk()}function Hk(){let t=de(),n=et(),e=Do();if(e.controlDirectiveIndex===-1)return;let i=n.data[e.controlDirectiveIndex].controlDef,r=t[e.controlDirectiveIndex];i.update(r,new Iu(t,n,e))}var Iu=class{lView;tView;tNode;hasPassThrough;constructor(n,e,i){this.lView=n,this.tView=e,this.tNode=i,this.hasPassThrough=!!(i.flags&4096)}get customControl(){return this.tNode.customControlIndex!==-1?this.lView[this.tNode.customControlIndex]:void 0}get nativeElement(){return mn(this.tNode,this.lView)}get descriptor(){return`<${this.tNode.value}>`}listenToCustomControlOutput(n,e){let i=this.tView.data[this.tNode.customControlIndex];A0(this.tNode,this.lView,i,n,No(this.tNode,this.lView,e))}listenToCustomControlModel(n){let e=this.tNode.flags&1024?"valueChange":"checkedChange",i=this.tView.data[this.tNode.customControlIndex];A0(this.tNode,this.lView,i,e,No(this.tNode,this.lView,n))}listenToDom(n,e){l_(this.tNode,this.tView,this.lView,void 0,this.lView[Ye],n,e,No(this.tNode,this.lView,e))}setInputOnDirectives(n,e,i){let r=this.tNode.inputs?.[n],o=this.tNode.hostDirectiveInputs?.[n];if(!r&&!o)return!1;let a=!1;if(r)for(let s of r){if(s===this.tNode.controlDirectiveIndex)continue;let l=this.lView[s],d=this.tView.data[s];(!i||i(O0(l,d,n)))&&(To(d,l,n,e),a=!0)}if(o)for(let s=0;s<o.length;s+=2){let l=o[s];if(l===this.tNode.controlDirectiveIndex)continue;let d=this.lView[l],u=o[s+1],h=this.tView.data[l];(!i||i(O0(d,h,n)))&&(To(h,d,u,e),a=!0)}return a}setCustomControlModelInput(n){let e=this.tView.data[this.tNode.customControlIndex],i=this.tNode.flags&1024?"value":"checked";uk(this.tNode,this.tView,this.lView,e,i,n)}customControlHasInput(n){if(this.tNode.customControlIndex===-1)return!1;let e=this.tView.data[this.tNode.customControlIndex];return(e.signalFormsInputPresence??=this._buildCustomControlInputCache(e))[n]===!0}_buildCustomControlInputCache(n){let e={};for(let i in n.inputs)e[i]=!0;if(n.hostDirectives!==null){let i=[...n.hostDirectives];for(;i.length>0;){let r=i.shift();if(typeof r!="function"){for(let a in r.inputs)e[r.inputs[a]]=!0;let o=R0(r.directive);o!==null&&i.push(...o);continue}for(let o of r()){if(typeof o=="function")continue;if(o.inputs)for(let s=0;s<o.inputs.length;s+=2){let l=o.inputs[s+1]||o.inputs[s];e[l]=!0}let a=R0(o.directive);a!==null&&i.push(...a)}}}return e}};function R0(t){return typeof t=="function"&&"\u0275dir"in t?t.\u0275dir.hostDirectives??null:null}function O0(t,n,e){if(!n.inputs||!Object.hasOwn(n.inputs,e))return;let[i,r]=n.inputs[e];if((r&Vl.SignalBased)!==0){let a=t[i][pt];return a.value===ju?void 0:a.value}return t[i]}function Uk(t,n,e){for(let r=n.directiveStart;r<n.directiveEnd;r++)if(t.data[r].controlDef){n.controlDirectiveIndex=r;break}if(n.controlDirectiveIndex===-1)return;let i=t.data[n.controlDirectiveIndex].controlDef;if(i.passThroughInput&&(n.inputs?.[i.passThroughInput]?.length??0)>1){n.flags|=4096;return}zk(t,n)}function zk(t,n){for(let e=n.directiveStart;e<n.directiveEnd;e++){let i=t.data[e];if(!(n.directiveToIndex&&!n.directiveToIndex.has(i.type))){if(P0(i,"value")){n.flags|=1024,n.customControlIndex=e;return}if(P0(i,"checked")){n.flags|=2048,n.customControlIndex=e;return}}}if(n.hostDirectiveInputs!==null&&n.hostDirectiveOutputs!==null&&n.directiveToIndex!==null){let e=(i,r)=>{let o=n.hostDirectiveInputs[i],a=n.hostDirectiveOutputs[i+"Change"];if(!o||!a)return!1;for(let s=0;s<o.length;s+=2){let l=o[s];for(let d=0;d<a.length;d+=2){let u=a[d];if(l===u)for(let h of n.directiveToIndex.values()){if(!Array.isArray(h))continue;let[_,v,x]=h;if(l>=v&&l<=x)return n.flags|=r,n.customControlIndex=_,!0}}}return!1};if(e("value",1024)||e("checked",2048))return}}function P0(t,n){return $k(t,n)&&Wk(t,n+"Change")}function $k(t,n){return n in t.inputs}function Wk(t,n){return n in t.outputs}var pg=Symbol("BINDING");var Ao=new C("");function Tu(t,n,e){let i=e?t.styles:null,r=e?t.classes:null,o=0;if(n!==null)for(let a=0;a<n.length;a++){let s=n[a];if(typeof s=="number")o=s;else if(o==1)r=zd(r,s);else if(o==2){let l=s,d=n[++a];i=zd(i,l+": "+d+";")}}e?t.styles=i:t.stylesWithoutHost=i,e?t.classes=r:t.classesWithoutHost=r}function te(t,n=0){let e=de();if(e===null)return ee(t,n);let i=Ot();return mC(i,e,kt(t),n)}function zl(){let t="invalid";throw new Error(t)}function ww(t,n,e,i,r){let o=i===null?null:{"":-1},a=r(t,e);if(a!==null){let s=a,l=null,d=null;for(let u of a)if(u.resolveHostDirectives!==null){[s,l,d]=u.resolveHostDirectives(a);break}Yk(t,n,e,s,o,l,d)}o!==null&&i!==null&&Gk(e,i,o)}function Gk(t,n,e){let i=t.localNames=[];for(let r=0;r<n.length;r+=2){let o=e[n[r+1]];if(o==null)throw new H(-301,!1);i.push(n[r],o)}}function qk(t,n,e){n.componentOffset=e,(t.components??=[]).push(n.index)}function Yk(t,n,e,i,r,o,a){let s=i.length,l=null;for(let _=0;_<s;_++){let v=i[_];l===null&&Kn(v)&&(l=v,qk(t,e,_)),Jp(Du(e,n),t,v.type)}eA(e,t.data.length,s),l?.viewProvidersResolver&&l.viewProvidersResolver(l);for(let _=0;_<s;_++){let v=i[_];v.providersResolver&&v.providersResolver(v)}let d=!1,u=!1,h=XC(t,n,s,null);s>0&&(e.directiveToIndex=new Map);for(let _=0;_<s;_++){let v=i[_];if(e.mergedAttrs=Ia(e.mergedAttrs,v.hostAttrs),Qk(t,e,n,h,v),Jk(h,v,r),a!==null&&a.has(v)){let[A,re]=a.get(v);e.directiveToIndex.set(v.type,[h,A+e.directiveStart,re+e.directiveStart])}else(o===null||!o.has(v))&&e.directiveToIndex.set(v.type,h);v.contentQueries!==null&&(e.flags|=4),(v.hostBindings!==null||v.hostAttrs!==null||v.hostVars!==0)&&(e.flags|=64);let x=v.type.prototype;!d&&(x.ngOnChanges||x.ngOnInit||x.ngDoCheck)&&((t.preOrderHooks??=[]).push(e.index),d=!0),!u&&(x.ngOnChanges||x.ngDoCheck)&&((t.preOrderCheckHooks??=[]).push(e.index),u=!0),h++}Zk(t,e,o)}function Zk(t,n,e){for(let i=n.directiveStart;i<n.directiveEnd;i++){let r=t.data[i];if(e===null||!e.has(r))F0(0,n,r,i),F0(1,n,r,i),j0(n,i,!1);else{let o=e.get(r);L0(0,n,o,i),L0(1,n,o,i),j0(n,i,!0)}}}function F0(t,n,e,i){let r=t===0?e.inputs:e.outputs;for(let o in r)if(Object.hasOwn(r,o)){let a;t===0?a=n.inputs??={}:a=n.outputs??={},a[o]??=[],a[o].push(i),Sw(n,o)}}function L0(t,n,e,i){let r=t===0?e.inputs:e.outputs;for(let o in r)if(Object.hasOwn(r,o)){let a=r[o],s;t===0?s=n.hostDirectiveInputs??={}:s=n.hostDirectiveOutputs??={},s[a]??=[],s[a].push(i,o),Sw(n,a)}}function Sw(t,n){n==="class"?t.flags|=8:n==="style"&&(t.flags|=16)}function j0(t,n,e){let{attrs:i,inputs:r,hostDirectiveInputs:o}=t;if(i===null||!e&&r===null||e&&o===null||Wg(t)){t.initialInputs??=[],t.initialInputs.push(null);return}let a=null,s=0;for(;s<i.length;){let l=i[s];if(l===0){s+=4;continue}else if(l===5){s+=2;continue}else if(typeof l=="number")break;if(!e&&Object.hasOwn(r,l)){let d=r[l];for(let u of d)if(u===n){a??=[],a.push(l,i[s+1]);break}}else if(e&&Object.hasOwn(o,l)){let d=o[l];for(let u=0;u<d.length;u+=2)if(d[u]===n){a??=[],a.push(d[u+1],i[s+1]);break}}s+=2}t.initialInputs??=[],t.initialInputs.push(a)}function Qk(t,n,e,i,r){t.data[i]=r;let o=r.factory||(r.factory=fo(r.type,!0)),a=new Io(o,Kn(r),te,null);t.blueprint[i]=a,e[i]=a,Xk(t,n,i,XC(t,e,r.hostVars,tn),r)}function Xk(t,n,e,i,r){let o=r.hostBindings;if(o){let a=t.hostBindingOpCodes;a===null&&(a=t.hostBindingOpCodes=[]);let s=~n.index;Kk(a)!=s&&a.push(s),a.push(e,i,o)}}function Kk(t){let n=t.length;for(;n>0;){let e=t[--n];if(typeof e=="number"&&e<0)return e}return 0}function Jk(t,n,e){if(e){if(n.exportAs)for(let i=0;i<n.exportAs.length;i++)e[n.exportAs[i]]=t;Kn(n)&&(e[""]=t)}}function eA(t,n,e){t.flags|=1,t.directiveStart=n,t.directiveEnd=n+e,t.providerIndexes=n}function c_(t,n,e,i,r,o,a,s){let l=n[ie],d=l.consts,u=bn(d,a),h=Fa(l,t,e,i,u);return o&&ww(l,n,h,bn(d,s),r),h.mergedAttrs=Ia(h.mergedAttrs,h.attrs),h.attrs!==null&&Tu(h,h.attrs,!1),h.mergedAttrs!==null&&Tu(h,h.mergedAttrs,!0),l.queries!==null&&l.queries.elementStart(l,h),h}function d_(t,n){iC(t,n),bp(n)&&t.queries.elementEnd(n)}function tA(t,n,e,i,r,o){let a=n.consts,s=bn(a,r),l=Fa(n,t,e,i,s);if(l.mergedAttrs=Ia(l.mergedAttrs,l.attrs),o!=null){let d=bn(a,o);l.localNames=[];for(let u=0;u<d.length;u+=2)l.localNames.push(d[u],-1)}return l.attrs!==null&&Tu(l,l.attrs,!1),l.mergedAttrs!==null&&Tu(l,l.mergedAttrs,!0),n.queries!==null&&n.queries.elementStart(n,l),l}var xw=typeof ShadowRoot<"u",nA=typeof Document<"u";function iA(t){return Object.keys(t).map(n=>{let[e,i,r]=t[n],o={propName:e,templateName:n,isSignal:(i&Vl.SignalBased)!==0};return r&&(o.transform=r),o})}function rA(t){return Object.keys(t).map(n=>({propName:t[n],templateName:n}))}function oA(t,n,e){let i=n instanceof We?n:n?.injector;return i&&t.getStandaloneInjector!==null&&(i=t.getStandaloneInjector(i)||i),i?new Mu(e,i):e}function aA(t){let n=t.get(Mt,null);if(n===null)throw new H(407,!1);let e=t.get(vw,null),i=t.get(hi,null),r=t.get(Di,null,{optional:!0});return{rendererFactory:n,sanitizer:e,changeDetectionScheduler:i,ngReflect:!1,tracingService:r}}function sA(t,n,e){let i=Dw(t);return OC(n,i,i==="svg"?go:i==="math"?Kd:e)}function lA(t){if((t&&"localName"in t&&typeof t.localName=="string"?t.localName:t?.tagName)?.toLowerCase()==="script")throw new H(905,!1)}function Dw(t){return(t.selectors[0][0]||"div").toLowerCase()}var Aa=class{componentDef;ngModule;selector;componentType;ngContentSelectors;isBoundToModule;cachedInputs=null;cachedOutputs=null;get inputs(){return this.cachedInputs??=iA(this.componentDef.inputs),this.cachedInputs}get outputs(){return this.cachedOutputs??=rA(this.componentDef.outputs),this.cachedOutputs}constructor(n,e){this.componentDef=n,this.ngModule=e,this.componentType=n.type,this.selector=DT(n.selectors),this.ngContentSelectors=n.ngContentSelectors??[],this.isBoundToModule=!!e}create(n,e,i,r,o,a,s){He(Ie.DynamicComponentStart);let l=se(null);try{let d=this.componentDef,u=oA(d,r||this.ngModule,n),h=aA(u),_=h.tracingService;return _&&_.componentCreate?_.componentCreate(bw(d),()=>this.createComponentRef(h,u,e,i,o,a,s)):this.createComponentRef(h,u,e,i,o,a,s)}finally{se(l)}}createComponentRef(n,e,i,r,o,a,s){let l=this.componentDef,d=cA(r,l,a,o),u=n.rendererFactory.createRenderer(null,l),h=r?ek(u,r,l.encapsulation,e):sA(l,u,s??null);lA(h);let _=e.get(Ao,null),v=dA(h,()=>e.get(K,null)??CC());_&&_.addHost(v);let x=a?.some(V0)||o?.some(oe=>typeof oe!="function"&&oe.bindings.some(V0)),A=e_(null,d,null,512|QC(l),null,null,n,u,e,null,EC(h,e,!0));_&&xw&&v instanceof ShadowRoot&&nu(A,()=>{_.removeHost(v)}),A[_t]=h,lu(A);let re=null;try{let oe=c_(_t,A,2,"#host",()=>d.directiveRegistry,!0,0);LC(u,h,oe),Ta(h,A),Gu(d,A,oe),Lg(d,oe,A),d_(d,oe),i!==void 0&&mA(oe,this.ngContentSelectors,i),re=An(oe.index,A),A[St]=re[St],o_(d,A,null)}catch(oe){throw re!==null&&tg(re),tg(A),oe}finally{He(Ie.DynamicComponentEnd),cu()}return new ku(this.componentType,A,!!x)}};function cA(t,n,e,i){let r=t?["ng-version","22.1.6"]:ET(n.selectors[0]),o=null,a=null,s=0;if(e)for(let u of e)s+=u[pg].requiredVars,u.create&&(u.targetIdx=0,(o??=[]).push(u)),u.update&&(u.targetIdx=0,(a??=[]).push(u));if(i)for(let u=0;u<i.length;u++){let h=i[u];if(typeof h!="function")for(let _ of h.bindings){s+=_[pg].requiredVars;let v=u+1;_.create&&(_.targetIdx=v,(o??=[]).push(_)),_.update&&(_.targetIdx=v,(a??=[]).push(_))}}let l=[n];if(i)for(let u of i){let h=typeof u=="function"?u:u.type,_=Wd(h);l.push(_)}return Jg(0,null,uA(o,a),1,s,l,null,null,null,[r],null)}function dA(t,n){let e=t.getRootNode?.();return nA&&e instanceof Document?e.head:e&&xw&&e instanceof ShadowRoot?e:n().head}function uA(t,n){return!t&&!n?null:e=>{if(e&1&&t)for(let i of t)i.create();if(e&2&&n)for(let i of n)i.update()}}function V0(t){let n=t[pg].kind;return n==="input"||n==="twoWay"}var ku=class extends _w{_rootLView;_hasInputBindings;instance;hostView;changeDetectorRef;componentType;location;previousInputValues=null;_tNode;constructor(n,e,i){super(),this._rootLView=e,this._hasInputBindings=i,this._tNode=Jd(e[ie],_t),this.location=Pa(this._tNode,e),this.instance=An(this._tNode.index,e)[St],this.hostView=this.changeDetectorRef=new Ir(e,void 0),this.componentType=n}setInput(n,e){this._hasInputBindings;let i=this._tNode;if(this.previousInputValues??=new Map,this.previousInputValues.has(n)&&Object.is(this.previousInputValues.get(n),e))return;let r=this._rootLView,o=qu(i,r[ie],r,n,e);this.previousInputValues.set(n,e);let a=An(i.index,r);a_(a,1)}get injector(){return new Mr(this._tNode,this._rootLView)}destroy(){this.hostView.destroy()}onDestroy(n){this.hostView.onDestroy(n)}};function mA(t,n,e){let i=t.projection=[];for(let r=0;r<n.length;r++){let o=e[r];i.push(o!=null&&o.length?Array.from(o):null)}}var ht=(()=>{class t{static __NG_ELEMENT_ID__=fA}return t})();function fA(){let t=Ot();return Ew(t,de())}var gg=class t extends ht{_lContainer;_hostTNode;_hostLView;constructor(n,e,i){super(),this._lContainer=n,this._hostTNode=e,this._hostLView=i}get element(){return Pa(this._hostTNode,this._hostLView)}get injector(){return new Mr(this._hostTNode,this._hostLView)}get parentInjector(){let n=Og(this._hostTNode,this._hostLView);if(aC(n)){let e=xu(n,this._hostLView),i=Su(n),r=e[ie].data[i+8];return new Mr(r,e)}else return new Mr(null,this._hostLView)}clear(){for(;this.length>0;)this.remove(this.length-1)}get(n){let e=B0(this._lContainer);return e!==null&&e[n]||null}get length(){return this._lContainer.length-ft}createEmbeddedView(n,e,i){let r,o;typeof i=="number"?r=i:i!=null&&(r=i.index,o=i.injector);let a=Eu(this._lContainer,n.ssrId),s=n.createEmbeddedViewImpl(e||{},o,a);return this.insertImpl(s,r,ka(this._hostTNode,a)),s}createComponent(n,e,i,r,o,a,s){let l,d=e||{};l=d.index,i=d.injector,r=d.projectableNodes,o=d.environmentInjector||d.ngModuleRef,a=d.directives,s=d.bindings;let u=new Aa(br(n)),h=i||this.parentInjector;if(!o&&u.ngModule==null){let oe=this.parentInjector.get(We,null);oe&&(o=oe)}let _=br(u.componentType??{}),v=Eu(this._lContainer,_?.id??null),x=v?.firstChild??null,A=u.create(h,r,x,o,a,s,this._getHostElementNamespace());return this.insertImpl(A.hostView,l,ka(this._hostTNode,v)),A}_getHostElementNamespace(){if(this._hostTNode.type&2){let n=this._hostTNode.parent??this._hostLView[Ht];return n!==null&&n.type&2&&typeof n.value=="string"&&n.value.toLowerCase()==="foreignobject"?null:n?.namespace??null}return this._hostTNode.namespace}insert(n,e){return this.insertImpl(n,e,!0)}insertImpl(n,e,i){let r=n._lView;if(jy(r)){let s=this.indexOf(n);if(s!==-1)this.detach(s);else{let l=r[At],d=new t(l,l[Ht],l[At]);d.detach(d.indexOf(n))}}let o=this._adjustIndex(e),a=this._lContainer;return Ul(a,r,o,i),n.attachToViewContainerRef(),up($p(a),o,n),n}move(n,e){return this.insert(n,e)}indexOf(n){let e=B0(this._lContainer);return e!==null?e.indexOf(n):-1}remove(n){let e=this._adjustIndex(n,-1),i=Al(this._lContainer,e);i&&(gl($p(this._lContainer),e),$u(i[ie],i))}detach(n){let e=this._adjustIndex(n,-1),i=Al(this._lContainer,e);return i&&gl($p(this._lContainer),e)!=null?new Ir(i):null}_adjustIndex(n,e=0){return n??this.length+e}};function B0(t){return t[bl]}function $p(t){return t[bl]||(t[bl]=[])}function Ew(t,n){let e,i=n[t.index];return kn(i)?e=i:(e=mw(i,n,null,t),n[t.index]=e,t_(n,e)),pA(e,n,t,i),new gg(e,t,n)}function hA(t,n){let e=t[Ye],i=e.createComment(""),r=mn(n,t),o=e.parentNode(r);return Mo(e,o,i,e.nextSibling(r),!1),i}var pA=vA,gA=()=>!1;function _A(t,n,e){return gA(t,n,e)}function vA(t,n,e,i){if(t[Co])return;let r;e.type&8?r=Ut(i):r=hA(n,e),t[Co]=r}var _g=class t{queryList;matches=null;constructor(n){this.queryList=n}clone(){return new t(this.queryList)}setDirty(){this.queryList.setDirty()}},vg=class t{queries;constructor(n=[]){this.queries=n}createEmbeddedView(n){let e=n.queries;if(e!==null){let i=n.contentQueries!==null?n.contentQueries[0]:e.length,r=[];for(let o=0;o<i;o++){let a=e.getByIndex(o),s=this.queries[a.indexInDeclarationView];r.push(s.clone())}return new t(r)}return null}insertView(n){this.dirtyQueriesWithMatches(n)}detachView(n){this.dirtyQueriesWithMatches(n)}finishViewCreation(n){this.dirtyQueriesWithMatches(n)}dirtyQueriesWithMatches(n){for(let e=0;e<this.queries.length;e++)m_(n,e).matches!==null&&this.queries[e].setDirty()}},Au=class{flags;read;predicate;constructor(n,e,i=null){this.flags=e,this.read=i,typeof n=="string"?this.predicate=SA(n):this.predicate=n}},bg=class t{queries;constructor(n=[]){this.queries=n}elementStart(n,e){for(let i=0;i<this.queries.length;i++)this.queries[i].elementStart(n,e)}elementEnd(n){for(let e=0;e<this.queries.length;e++)this.queries[e].elementEnd(n)}embeddedTView(n){let e=null;for(let i=0;i<this.length;i++){let r=e!==null?e.length:0,o=this.getByIndex(i).embeddedTView(n,r);o&&(o.indexInDeclarationView=i,e!==null?e.push(o):e=[o])}return e!==null?new t(e):null}template(n,e){for(let i=0;i<this.queries.length;i++)this.queries[i].template(n,e)}getByIndex(n){return this.queries[n]}get length(){return this.queries.length}track(n){this.queries.push(n)}},yg=class t{metadata;matches=null;indexInDeclarationView=-1;crossesNgTemplate=!1;_declarationNodeIndex;_appliesToNextNode=!0;constructor(n,e=-1){this.metadata=n,this._declarationNodeIndex=e}elementStart(n,e){this.isApplyingToNode(e)&&this.matchTNode(n,e)}elementEnd(n){this._declarationNodeIndex===n.index&&(this._appliesToNextNode=!1)}template(n,e){this.elementStart(n,e)}embeddedTView(n,e){return this.isApplyingToNode(n)?(this.crossesNgTemplate=!0,this.addMatch(-n.index,e),new t(this.metadata)):null}isApplyingToNode(n){if(this._appliesToNextNode&&(this.metadata.flags&1)!==1){let e=this._declarationNodeIndex,i=n.parent;for(;i!==null&&i.type&8&&i.index!==e;)i=i.parent;return e===(i!==null?i.index:-1)}return this._appliesToNextNode}matchTNode(n,e){let i=this.metadata.predicate;if(Array.isArray(i))for(let r=0;r<i.length;r++){let o=i[r];this.matchTNodeWithReadOption(n,e,bA(e,o)),this.matchTNodeWithReadOption(n,e,yu(e,n,o,!1,!1))}else i===bt?e.type&4&&this.matchTNodeWithReadOption(n,e,-1):this.matchTNodeWithReadOption(n,e,yu(e,n,i,!1,!1))}matchTNodeWithReadOption(n,e,i){if(i!==null){let r=this.metadata.read;if(r!==null)if(r===F||r===ht||r===bt&&e.type&4)this.addMatch(e.index,-2);else{let o=yu(e,n,r,!1,!1);o!==null&&this.addMatch(e.index,o)}else this.addMatch(e.index,i)}}addMatch(n,e){this.matches===null?this.matches=[n,e]:this.matches.push(n,e)}};function bA(t,n){let e=t.localNames;if(e!==null){for(let i=0;i<e.length;i+=2)if(e[i]===n)return e[i+1]}return null}function yA(t,n){return t.type&11?Pa(t,n):t.type&4?Yu(t,n):null}function CA(t,n,e,i){return e===-1?yA(n,t):e===-2?wA(t,n,i):Il(t,t[ie],e,n)}function wA(t,n,e){if(e===F)return Pa(n,t);if(e===bt)return Yu(n,t);if(e===ht)return Ew(n,t)}function Mw(t,n,e,i){let r=n[vi].queries[i];if(r.matches===null){let o=t.data,a=e.matches,s=[];for(let l=0;a!==null&&l<a.length;l+=2){let d=a[l];if(d<0)s.push(null);else{let u=o[d];s.push(CA(n,u,a[l+1],e.metadata.read))}}r.matches=s}return r.matches}function Cg(t,n,e,i){let r=t.queries.getByIndex(e),o=r.matches;if(o!==null){let a=Mw(t,n,r,e);for(let s=0;s<o.length;s+=2){let l=o[s];if(l>0)i.push(a[s/2]);else{let d=o[s+1],u=n[-l];for(let h=ft;h<u.length;h++){let _=u[h];_[Sr]===_[At]&&Cg(_[ie],_,d,i)}if(u[wo]!==null){let h=u[wo];for(let _=0;_<h.length;_++){let v=h[_];Cg(v[ie],v,d,i)}}}}}return i}function u_(t,n){return t[vi].queries[n].queryList}function Nw(t,n,e){let i=new hn((e&4)===4);return Hy(t,n,i,i.destroy),(n[vi]??=new vg).queries.push(new _g(i))-1}function Iw(t,n,e){let i=et();return i.firstCreatePass&&(kw(i,new Au(t,n,e),-1),(n&2)===2&&(i.staticViewQueries=!0)),Nw(i,de(),n)}function Tw(t,n,e,i){let r=et();if(r.firstCreatePass){let o=Ot();kw(r,new Au(n,e,i),o.index),xA(r,t),(e&2)===2&&(r.staticContentQueries=!0)}return Nw(r,de(),e)}function SA(t){return t.split(",").map(n=>n.trim())}function kw(t,n,e){t.queries===null&&(t.queries=new bg),t.queries.track(new yg(n,e))}function xA(t,n){let e=t.contentQueries||(t.contentQueries=[]),i=e.length?e[e.length-1]:-1;n!==i&&e.push(t.queries.length-1,n)}function m_(t,n){return t.queries.getByIndex(n)}function Aw(t,n){let e=t[ie],i=m_(e,n);return i.crossesNgTemplate?Cg(e,t,n,[]):Mw(e,t,i,n)}function Rw(t,n,e){let i,r=Ks(()=>{i._dirtyCounter();let o=DA(i,t);if(n&&o===void 0)throw new H(-951,!1);return o});return i=r[pt],i._dirtyCounter=S(0),i._flatValue=void 0,r}function f_(t){return Rw(!0,!1,t)}function h_(t){return Rw(!0,!0,t)}function Ow(t,n){let e=t[pt];e._lView=de(),e._queryIndex=n,e._queryList=u_(e._lView,n),e._queryList.onDirty(()=>e._dirtyCounter.update(i=>i+1))}function DA(t,n){let e=t._lView,i=t._queryIndex;if(e===void 0||i===void 0||e[fe]&4)return n?void 0:$t;let r=u_(e,i),o=Aw(e,i);return r.reset(o,pC),n?r.first:r._changesDetected||t._flatValue===void 0?t._flatValue=r.toArray():t._flatValue}function Zi(t){return!!t&&typeof t.then=="function"}function p_(t){return!!t&&typeof t.subscribe=="function"}var xi=class{},Zu=class{};var Ru=class extends xi{ngModuleType;_parent;_bootstrapComponents=[];_r3Injector;instance;destroyCbs=[];constructor(n,e,i,r=!0){super(),this.ngModuleType=n,this._parent=e;let o=yy(n);this._bootstrapComponents=hT(o.bootstrap),this._r3Injector=Fp(n,e,[{provide:xi,useValue:this},...i],ml(n),new Set(["environment"])),r&&this.resolveInjectorInitializers()}resolveInjectorInitializers(){this._r3Injector.resolveInjectorInitializers(),this.instance=this._r3Injector.get(this.ngModuleType)}get injector(){return this._r3Injector}destroy(){let n=this._r3Injector;!n.destroyed&&n.destroy(),this.destroyCbs.forEach(e=>e()),this.destroyCbs=null}onDestroy(n){this.destroyCbs.push(n)}},Ou=class extends Zu{moduleType;constructor(n){super(),this.moduleType=n}create(n){return new Ru(this.moduleType,n,[])}};var Rl=class extends xi{injector;instance=null;constructor(n){super();let e=new po([...n.providers,{provide:xi,useValue:this}],n.parent||ba(),n.debugName,new Set(["environment"]));this.injector=e,n.runEnvironmentInitializers&&e.resolveInjectorInitializers()}destroy(){this.injector.destroy()}onDestroy(n){this.injector.onDestroy(n)}};function $l(t,n,e=null){return new Rl({providers:t,parent:n,debugName:e,runEnvironmentInitializers:!0}).injector}var EA=(()=>{class t{_injector;cachedInjectors=new Map;constructor(e){this._injector=e}getOrCreateStandaloneInjector(e){if(!e.standalone)return null;if(!this.cachedInjectors.has(e)){let i=fp(!1,e.type),r=i.length>0?$l([i],this._injector,""):null;this.cachedInjectors.set(e,r)}return this.cachedInjectors.get(e)}ngOnDestroy(){try{for(let e of this.cachedInjectors.values())e!==null&&e.destroy()}finally{this.cachedInjectors.clear()}}static \u0275prov=me({token:t,providedIn:"environment",factory:()=>new t(ee(We))})}return t})();function D(t){return Pl(()=>{let n=Pw(t),e=V(b({},n),{decls:t.decls,vars:t.vars,template:t.template,consts:t.consts||null,ngContentSelectors:t.ngContentSelectors,onPush:t.changeDetection!==Pg.Eager,directiveDefs:null,pipeDefs:null,dependencies:n.standalone&&t.dependencies||null,getStandaloneInjector:n.standalone?r=>r.get(EA).getOrCreateStandaloneInjector(e):null,getExternalStyles:null,signals:t.signals??!1,data:t.data||{},encapsulation:t.encapsulation||ni.Emulated,styles:t.styles||$t,_:null,schemas:t.schemas||null,tView:null,id:""});n.standalone&&Ei("NgStandalone"),Fw(e);let i=t.dependencies;return e.directiveDefs=H0(i,MA),e.pipeDefs=H0(i,Cy),e.id=TA(e),e})}function MA(t){return br(t)||Wd(t)}function Q(t){return Pl(()=>({type:t.type,bootstrap:t.bootstrap||$t,declarations:t.declarations||$t,imports:t.imports||$t,exports:t.exports||$t,transitiveCompileScopes:null,schemas:t.schemas||null,id:t.id||null}))}function NA(t,n){if(t==null)return Cr;let e={};for(let i in t)if(Object.hasOwn(t,i)){let r=t[i],o,a,s,l;Array.isArray(r)?(s=r[0],o=r[1],a=r[2]??o,l=r[3]||null):(o=r,a=r,s=Vl.None,l=null),e[o]=[i,s,l],n[o]=a}return e}function IA(t){if(t==null)return Cr;let n={};for(let e in t)Object.hasOwn(t,e)&&(n[t[e]]=e);return n}function R(t){return Pl(()=>{let n=Pw(t);return Fw(n),n})}function Pw(t){let n={};return{type:t.type,providersResolver:null,viewProvidersResolver:null,factory:null,hostBindings:t.hostBindings||null,hostVars:t.hostVars||0,hostAttrs:t.hostAttrs||null,contentQueries:t.contentQueries||null,declaredInputs:n,inputConfig:t.inputs||Cr,exportAs:t.exportAs||null,standalone:t.standalone??!0,signals:t.signals===!0,selectors:t.selectors||$t,viewQuery:t.viewQuery||null,features:t.features||null,setInput:null,resolveHostDirectives:null,hostDirectives:null,controlDef:null,signalFormsInputPresence:null,inputs:NA(t.inputs,n),outputs:IA(t.outputs),debugInfo:null}}function Fw(t){t.features?.forEach(n=>n(t))}function H0(t,n){return t?()=>{let e=typeof t=="function"?t():t,i=[];for(let r of e){let o=n(r);o!==null&&i.push(o)}return i}:null}function TA(t){let n=0,e=typeof t.consts=="function"?"":t.consts,i=[t.selectors,t.ngContentSelectors,t.hostVars,t.hostAttrs,e,t.vars,t.decls,t.encapsulation,t.standalone,t.signals,t.exportAs,JSON.stringify(t.inputs),JSON.stringify(t.outputs),Object.getOwnPropertyNames(t.type.prototype),!!t.contentQueries,!!t.viewQuery];for(let o of i.join("|"))n=Math.imul(31,n)+o.charCodeAt(0)<<0;return n+=2147483648,"c"+n}var Lw=new C("");var g_=(()=>{class t{resolve;reject;initialized=!1;done=!1;donePromise=new Promise((e,i)=>{this.resolve=e,this.reject=i});appInits=c(Lw,{optional:!0})??[];injector=c(X);constructor(){}runInitializers(){if(this.initialized)return;let e=[];for(let r of this.appInits){let o=Rt(this.injector,r);if(Zi(o))e.push(o);else if(p_(o)){let a=new Promise((s,l)=>{o.subscribe({complete:s,error:l})});e.push(a)}}let i=()=>{this.done=!0,this.resolve()};Promise.all(e).then(()=>{i()}).catch(r=>{this.reject(r)}),e.length===0&&i(),this.initialized=!0}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function Qu(t){return n=>{n.controlDef={create:(e,i)=>{e?.\u0275ngControlCreate(i)},update:(e,i)=>{e?.\u0275ngControlUpdate?.(i)},passThroughInput:t}}}function __(t){let n=e=>{let i=Array.isArray(t);e.hostDirectives===null?(e.resolveHostDirectives=kA,e.hostDirectives=i?t.map(wg):[t]):i?e.hostDirectives.unshift(...t.map(wg)):e.hostDirectives.unshift(t)};return n.ngInherit=!0,n}function kA(t){let n=[],e=!1,i=null,r=null;for(let o=0;o<t.length;o++){let a=t[o];if(a.hostDirectives!==null){let s=n.length;i??=new Map,r??=new Map,jw(a,n,i,t),r.set(a,[s,n.length-1])}o===0&&Kn(a)&&(e=!0,n.push(a))}for(let o=e?1:0;o<t.length;o++)n.push(t[o]);return i!==null&&i.forEach((o,a)=>{AA(a.declaredInputs,o.inputs)}),[n,i,r]}function jw(t,n,e,i){if(t.hostDirectives!==null)for(let r of t.hostDirectives)if(typeof r=="function"){let o=r();for(let a of o)U0(wg(a),n,e,i)}else U0(r,n,e,i)}function U0(t,n,e,i){let r=Wd(t.directive);if(jw(r,n,e,i),e.has(r)){let o=e.get(r);z0(o,t.inputs,"input"),z0(o,t.outputs,"output")}else i.includes(r)||(e.set(r,t),n.push(r))}function z0(t,n,e){let i=e==="input"?t.inputs:t.outputs;Object.keys(n).forEach(r=>{let o=n[r];(!Object.hasOwn(i,r)||i[r]===o)&&(i[r]=o)})}function wg(t){return typeof t=="function"?{directive:kt(t),inputs:{},outputs:{}}:{directive:kt(t.directive),inputs:$0(t.inputs),outputs:$0(t.outputs)}}function $0(t){let n={};if(t!==void 0&&t.length>0)for(let e=0;e<t.length;e+=2)n[t[e]]=t[e+1];return n}function AA(t,n){for(let e in n)if(Object.hasOwn(n,e)){let i=n[e],r=t[e];t[i]=r}}function RA(t){return Object.getPrototypeOf(t.prototype).constructor}function pe(t){let n=RA(t.type),e=!0,i=[t];for(;n&&n!==Function.prototype&&n!==Object.prototype;){let r,o=Object.hasOwn(n,hl)?n[hl]:void 0,a=Object.hasOwn(n,pl)?n[pl]:void 0;if(Kn(t))r=o??a;else{if(o)throw new H(903,!1);r=a}if(r){if(e){i.push(r);let l=t;l.inputs=Wp(t.inputs),l.declaredInputs=Wp(t.declaredInputs),l.outputs=Wp(t.outputs);let d=r.hostBindings;d&&jA(t,d);let u=r.viewQuery,h=r.contentQueries;if(u&&FA(t,u),h&&LA(t,h),OA(t,r),by(t.outputs,r.outputs),Kn(r)&&r.data.animation){let _=t.data;_.animation=(_.animation||[]).concat(r.data.animation)}}let s=r.features;if(s)for(let l=0;l<s.length;l++){let d=s[l];d&&d.ngInherit&&d(t),d===pe&&(e=!1)}}n=Object.getPrototypeOf(n)}PA(i)}function OA(t,n){for(let e in n.inputs){if(!Object.hasOwn(n.inputs,e)||Object.hasOwn(t.inputs,e))continue;let i=n.inputs[e];i!==void 0&&(t.inputs[e]=i,t.declaredInputs[e]=n.declaredInputs[e])}}function PA(t){let n=0,e=null;for(let i=t.length-1;i>=0;i--){let r=t[i];r.hostVars=n+=r.hostVars,r.hostAttrs=Ia(r.hostAttrs,e=Ia(e,r.hostAttrs))}}function Wp(t){return t===Cr?{}:t===$t?[]:t}function FA(t,n){let e=t.viewQuery;e?t.viewQuery=(i,r)=>{n(i,r),e(i,r)}:t.viewQuery=n}function LA(t,n){let e=t.contentQueries;e?t.contentQueries=(i,r,o)=>{n(i,r,o),e(i,r,o)}:t.contentQueries=n}function jA(t,n){let e=t.hostBindings;e?t.hostBindings=(i,r)=>{n(i,r),e(i,r)}:t.hostBindings=n}function Vw(t,n,e,i,r,o,a,s){if(e.firstCreatePass){t.mergedAttrs=Ia(t.mergedAttrs,t.attrs);let u=t.tView=Jg(2,t,r,o,a,e.directiveRegistry,e.pipeRegistry,null,e.schemas,e.consts,null);e.queries!==null&&(e.queries.template(e,t),u.queries=e.queries.embeddedTView(t))}s&&(t.flags|=s),xa(t,!1);let l=BA(e,n,t,i);du()&&Xg(e,n,l,t),Ta(l,n);let d=mw(l,n,l,t);n[i+_t]=d,t_(n,d),_A(d,t,n)}function VA(t,n,e,i,r,o,a,s,l,d,u){let h=e+_t,_;return n.firstCreatePass?(_=Fa(n,h,4,a||null,s||null),iu()&&ww(n,t,_,bn(n.consts,d),n_),iC(n,_)):_=n.data[h],Vw(_,t,n,e,i,r,o,l),wa(_)&&Gu(n,t,_),d!=null&&Bl(t,_,u),_}function Ra(t,n,e,i,r,o,a,s,l,d,u){let h=e+_t,_;if(n.firstCreatePass){if(_=Fa(n,h,4,a||null,s||null),d!=null){let v=bn(n.consts,d);_.localNames=[];for(let x=0;x<v.length;x+=2)_.localNames.push(v[x],-1)}}else _=n.data[h];return Vw(_,t,n,e,i,r,o,l),d!=null&&Bl(t,_,u),_}function yt(t,n,e,i,r,o,a,s){let l=de(),d=et(),u=bn(d.consts,o);return VA(l,d,t,n,e,i,r,u,void 0,a,s),yt}function La(t,n,e,i,r,o,a,s){let l=de(),d=et(),u=bn(d.consts,o);return Ra(l,d,t,n,e,i,r,u,void 0,a,s),La}var BA=HA;function HA(t,n,e,i){return Sl(!0),n[Ye].createComment("")}var Xu=(()=>{class t{log(e){console.log(e)}warn(e){console.warn(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"platform"})}return t})();var v_=new C("");var Wl=new C("");function Bw(){Sh(()=>{let t="";throw new H(600,t)})}var UA=10;var nn=(()=>{class t{_runningTick=!1;_destroyed=!1;_destroyListeners=[];_views=[];internalErrorHandler=c(Rn);afterRenderManager=c(Uu);zonelessEnabled=c(Dl);rootEffectScheduler=c(fu);dirtyFlags=0;tracingSnapshot=null;allTestViews=new Set;autoDetectTestViews=new Set;includeAllTestViews=!1;afterTick=new I;get allViews(){return[...(this.includeAllTestViews?this.allTestViews:this.autoDetectTestViews).keys(),...this._views]}get destroyed(){return this._destroyed}componentTypes=[];components=[];internalPendingTask=c($i);get isStable(){return this.internalPendingTask.hasPendingTasksObservable.pipe(J(e=>!e))}constructor(){c(Di,{optional:!0})}whenStable(){let e;return new Promise(i=>{e=this.isStable.subscribe({next:r=>{r&&i()}})}).finally(()=>{e.unsubscribe()})}_injector=c(We);_rendererFactory=null;get injector(){return this._injector}bootstrap(e,i){return this.bootstrapImpl(e,i)}bootstrapImpl(e,i,r=X.NULL){return this._injector.get(U).run(()=>{if(He(Ie.BootstrapComponentStart),!this._injector.get(g_).done){let oe="";throw new H(405,oe)}let s=br(e),l=this._injector.get(xi),d=new Aa(s,l);this.componentTypes.push(e);let{hostElement:u,directives:h,bindings:_}=zA(i),v=u||d.selector,x=d.create(r,[],v,l.injector,h,_),A=x.location.nativeElement,re=x.injector.get(v_,null);return re?.registerApplication(A),x.onDestroy(()=>{this.detachView(x.hostView),Nl(this.components,x),re?.unregisterApplication(A)}),this._loadComponent(x),He(Ie.BootstrapComponentEnd,x),x})}tick(){this.zonelessEnabled||(this.dirtyFlags|=1),this._tick()}_tick(){He(Ie.ChangeDetectionStart),this.tracingSnapshot!==null?this.tracingSnapshot.run(Hu.CHANGE_DETECTION,this.tickImpl):this.tickImpl()}tickImpl=()=>{if(this._runningTick)throw He(Ie.ChangeDetectionEnd),new H(101,!1);let e=se(null);try{this._runningTick=!0,this.synchronize()}finally{this._runningTick=!1,this.tracingSnapshot?.dispose(),this.tracingSnapshot=null,se(e),this.afterTick.next(),He(Ie.ChangeDetectionEnd)}};synchronize(){this._rendererFactory===null&&!this._injector.destroyed&&(this._rendererFactory=this._injector.get(Mt,null,{optional:!0}));let e=0;for(;this.dirtyFlags!==0&&e++<UA;){He(Ie.ChangeDetectionSyncStart);try{this.synchronizeOnce()}finally{He(Ie.ChangeDetectionSyncEnd)}}}synchronizeOnce(){this.dirtyFlags&16&&(this.dirtyFlags&=-17,this.rootEffectScheduler.flush());let e=!1;if(this.dirtyFlags&7){let i=!!(this.dirtyFlags&1);this.dirtyFlags&=-8,this.dirtyFlags|=8;for(let{_lView:r}of this.allViews){if(!i&&!yl(r))continue;let o=i&&!this.zonelessEnabled?0:1;lw(r,o),e=!0}if(this.dirtyFlags&=-5,this.syncDirtyFlagsWithViews(),this.dirtyFlags&23)return}e||(this._rendererFactory?.begin?.(),this._rendererFactory?.end?.()),this.dirtyFlags&8&&(this.dirtyFlags&=-9,this.afterRenderManager.execute()),this.syncDirtyFlagsWithViews()}syncDirtyFlagsWithViews(){if(this.allViews.some(({_lView:e})=>yl(e))){this.dirtyFlags|=2;return}else this.dirtyFlags&=-8}attachView(e){let i=e;this._views.push(i),i.attachToAppRef(this)}detachView(e){let i=e;Nl(this._views,i),i.detachFromAppRef()}_loadComponent(e){this.attachView(e.hostView);try{this.tick()}catch(r){this.internalErrorHandler(r)}this.components.push(e),this._injector.get(Wl,[]).forEach(r=>r(e))}ngOnDestroy(){if(!this._destroyed)try{this._destroyListeners.forEach(e=>e()),this._views.slice().forEach(e=>e.destroy())}finally{this._destroyed=!0,this._views=[],this._destroyListeners=[]}}onDestroy(e){return this._destroyListeners.push(e),()=>Nl(this._destroyListeners,e)}destroy(){if(this._destroyed)throw new H(406,!1);let e=this._injector;e.destroy&&!e.destroyed&&e.destroy()}get viewCount(){return this._views.length}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function zA(t){return t===void 0||typeof t=="string"||t instanceof Element?{hostElement:t}:t}function Nl(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}function Ku(t,n){let e=de(),i=xr();if(Pn(e,i,n)){let r=et(),o=Do();if(qu(o,r,e,t,n))Ci(o)&&tw(e,o.index);else{let s=mn(o,e);nw(e[Ye],s,null,o.value,t,n,null)}}return Ku}function L(t,n,e,i){let r=de(),o=xr();if(Pn(r,o,n)){let a=et(),s=Do();lk(s,r,t,n,e,i)}return L}var Sg=class{destroy(n){}updateValue(n,e){}swap(n,e){let i=Math.min(n,e),r=Math.max(n,e),o=this.detach(r);if(r-i>1){let a=this.detach(i);this.attach(i,o),this.attach(r,a)}else this.attach(i,o)}move(n,e){this.attach(e,this.detach(n))}};function Gp(t,n,e,i,r){return t===e&&Object.is(n,i)?1:Object.is(r(t,n),r(e,i))?-1:0}function $A(t,n,e,i){let r,o,a=0,s=t.length-1,l=void 0;if(Array.isArray(n)){se(i);let d=n.length-1;for(se(null);a<=s&&a<=d;){let u=t.at(a),h=n[a],_=Gp(a,u,a,h,e);if(_!==0){_<0&&t.updateValue(a,h),a++;continue}let v=t.at(s),x=n[d],A=Gp(s,v,d,x,e);if(A!==0){A<0&&t.updateValue(s,x),s--,d--;continue}let re=e(a,u),oe=e(s,v),Qe=e(a,h);if(Object.is(Qe,oe)){let Tt=e(d,x);Object.is(Tt,re)?(t.swap(a,s),t.updateValue(s,x),d--,s--):t.move(s,a),t.updateValue(a,h),a++;continue}if(r??=new Pu,o??=G0(t,a,s,e),xg(t,r,a,Qe))t.updateValue(a,h),a++,s++;else if(o.has(Qe))r.set(re,t.detach(a)),s--;else{let Tt=t.create(a,n[a]);t.attach(a,Tt),a++,s++}}for(;a<=d;)W0(t,r,e,a,n[a]),a++}else if(n!=null){se(i);let d=n[Symbol.iterator]();se(null);let u=d.next();for(;!u.done&&a<=s;){let h=t.at(a),_=u.value,v=Gp(a,h,a,_,e);if(v!==0)v<0&&t.updateValue(a,_),a++,u=d.next();else{r??=new Pu,o??=G0(t,a,s,e);let x=e(a,_);if(xg(t,r,a,x))t.updateValue(a,_),a++,s++,u=d.next();else if(!o.has(x))t.attach(a,t.create(a,_)),a++,s++,u=d.next();else{let A=e(a,h);r.set(A,t.detach(a)),s--}}}for(;!u.done;)W0(t,r,e,t.length,u.value),u=d.next()}for(;a<=s;)t.destroy(t.detach(s--));r?.forEach(d=>{t.destroy(d)})}function xg(t,n,e,i){return n!==void 0&&n.has(i)?(t.attach(e,n.get(i)),n.delete(i),!0):!1}function W0(t,n,e,i,r){if(xg(t,n,i,e(i,r)))t.updateValue(i,r);else{let o=t.create(i,r);t.attach(i,o)}}function G0(t,n,e,i){let r=new Set;for(let o=n;o<=e;o++)r.add(i(o,t.at(o)));return r}var Pu=class{kvMap=new Map;_vMap=void 0;has(n){return this.kvMap.has(n)}delete(n){if(!this.has(n))return!1;let e=this.kvMap.get(n);return this._vMap!==void 0&&this._vMap.has(e)?(this.kvMap.set(n,this._vMap.get(e)),this._vMap.delete(e)):this.kvMap.delete(n),!0}get(n){return this.kvMap.get(n)}set(n,e){if(this.kvMap.has(n)){let i=this.kvMap.get(n);this._vMap===void 0&&(this._vMap=new Map);let r=this._vMap;for(;r.has(i);)i=r.get(i);r.set(i,e)}else this.kvMap.set(n,e)}forEach(n){for(let[e,i]of this.kvMap)if(n(i,e),this._vMap!==void 0){let r=this._vMap;for(;r.has(i);)i=r.get(i),n(i,e)}}};function E(t,n,e,i,r,o,a,s){Ei("NgControlFlow");let l=de(),d=et(),u=bn(d.consts,o);return Ra(l,d,t,n,e,i,r,u,256,a,s),b_}function b_(t,n,e,i,r,o,a,s){Ei("NgControlFlow");let l=de(),d=et(),u=bn(d.consts,o);return Ra(l,d,t,n,e,i,r,u,512,a,s),b_}function M(t,n){Ei("NgControlFlow");let e=de(),i=xr(),r=e[i]!==tn?e[i]:-1,o=r!==-1?Fu(e,_t+r):void 0,a=0;if(Pn(e,i,t)){let s=se(null);try{if(o!==void 0&&hw(o,a),t!==-1){let l=_t+t,d=Fu(e,l),u=Ng(e[ie],l),h=gw(d,u,e),_=Hl(e,u,n,{dehydratedView:h});Ul(d,_,a,ka(u,h))}}finally{se(s)}}else if(o!==void 0){let s=fw(o,a);s!==void 0&&(s[St]=n)}}var Dg=class{lContainer;$implicit;$index;constructor(n,e,i){this.lContainer=n,this.$implicit=e,this.$index=i}get $count(){return this.lContainer.length-ft}};function ja(t){return t}function Va(t,n){return n}var Eg=class{hasEmptyBlock;trackByFn;liveCollection;constructor(n,e,i){this.hasEmptyBlock=n,this.trackByFn=e,this.liveCollection=i}};function nt(t,n,e,i,r,o,a,s,l,d,u,h,_){Ei("NgControlFlow");let v=de(),x=et(),A=l!==void 0,re=de(),oe=s?a.bind(re[en][St]):a,Qe=new Eg(A,oe);re[_t+t]=Qe,Ra(v,x,t+1,n,e,i,r,bn(x.consts,o),256),A&&Ra(v,x,t+2,l,d,u,h,bn(x.consts,_),512)}var Mg=class extends Sg{lContainer;hostLView;templateTNode;operationsCounter=void 0;needsIndexUpdate=!1;constructor(n,e,i){super(),this.lContainer=n,this.hostLView=e,this.templateTNode=i}get length(){return this.lContainer.length-ft}at(n){return this.getLView(n)[St].$implicit}attach(n,e){let i=e[vo];this.needsIndexUpdate||=n!==this.length,Ul(this.lContainer,e,n,ka(this.templateTNode,i)),WA(this.lContainer,n)}detach(n){return this.needsIndexUpdate||=n!==this.length-1,GA(this.lContainer,n),qA(this.lContainer,n)}create(n,e){let i=Eu(this.lContainer,this.templateTNode.tView.ssrId);return Hl(this.hostLView,this.templateTNode,new Dg(this.lContainer,e,n),{dehydratedView:i})}destroy(n){$u(n[ie],n)}updateValue(n,e){this.getLView(n)[St].$implicit=e}reset(){this.needsIndexUpdate=!1}updateIndexes(){if(this.needsIndexUpdate)for(let n=0;n<this.length;n++)this.getLView(n)[St].$index=n}getLView(n){return YA(this.lContainer,n)}};function it(t){let n=se(null),e=Jn();try{let i=de(),r=i[ie],o=i[e],a=e+1,s=Fu(i,a);if(o.liveCollection===void 0){let d=Ng(r,a);o.liveCollection=new Mg(s,i,d)}else o.liveCollection.reset();let l=o.liveCollection;if($A(l,t,o.trackByFn,n),l.updateIndexes(),o.hasEmptyBlock){let d=xr(),u=l.length===0;if(Pn(i,d,u)){let h=e+2,_=Fu(i,h);if(u){let v=Ng(r,h),x=gw(_,v,i),A=Hl(i,v,void 0,{dehydratedView:x});Ul(_,A,0,ka(v,x))}else r.firstUpdatePass&&Ak(_),hw(_,0)}}}finally{se(n)}}function Fu(t,n){return t[n]}function WA(t,n){if(t.length<=ft)return;let e=ft+n,i=t[e],r=i?i[yi]:void 0;if(i&&r&&r.detachedLeaveAnimationFns&&r.detachedLeaveAnimationFns.length>0){let o=i[_i];RT(o,r),Nr.delete(i[bi]),r.detachedLeaveAnimationFns=void 0}}function GA(t,n){if(t.length<=ft)return;let e=ft+n,i=t[e],r=i?i[yi]:void 0;r&&r.leave&&r.leave.size>0&&(r.detachedLeaveAnimationFns=[])}function qA(t,n){return Al(t,n)}function YA(t,n){return fw(t,n)}function Ng(t,n){return Jd(t,n)}function N(t,n,e){let i=de(),r=xr();if(Pn(i,r,n)){let o=et(),a=Do();rk(a,i,t,n,i[Ye],e)}return N}function Ig(t,n,e,i,r){qu(n,t,e,r?"class":"style",i)}function m(t,n,e,i){let r=de(),o=r[ie],a=t+_t,s=o.firstCreatePass?c_(a,r,2,n,n_,iu(),e,i):o.data[a];if(Ci(s)){let l=r[Xn].tracingService;if(l&&l.componentCreate){let d=o.data[s.directiveStart+s.componentOffset];return l.componentCreate(bw(d),()=>(q0(t,n,r,s,i),m))}}return q0(t,n,r,s,i),m}function q0(t,n,e,i,r){if(i_(i,e,t,n,Hw),wa(i)){let o=e[ie];Gu(o,e,i),Lg(o,i,e)}r!=null&&Bl(e,i)}function f(){let t=et(),n=Ot(),e=r_(n);return t.firstCreatePass&&d_(t,e),Mp(e)&&Np(),Dp(),e.classesWithoutHost!=null&&hI(e)&&Ig(t,e,de(),e.classesWithoutHost,!0),e.stylesWithoutHost!=null&&pI(e)&&Ig(t,e,de(),e.stylesWithoutHost,!1),f}function j(t,n,e,i){return m(t,n,e,i),f(),j}function je(t,n,e,i){let r=de(),o=r[ie],a=t+_t,s=o.firstCreatePass?tA(a,o,2,n,e,i):o.data[a];return i_(s,r,t,n,Hw),i!=null&&Bl(r,s),je}function Ze(){let t=Ot(),n=r_(t);return Mp(n)&&Np(),Dp(),Ze}function xt(t,n,e,i){return je(t,n,e,i),Ze(),xt}var Hw=(t,n,e,i,r)=>(Sl(!0),OC(n[Ye],i,Pp()));function y_(t,n,e){let i=de(),r=i[ie],o=t+_t,a=r.firstCreatePass?c_(o,i,8,"ng-container",n_,iu(),n,e):r.data[o];if(i_(a,i,t,"ng-container",ZA),wa(a)){let s=i[ie];Gu(s,i,a),Lg(s,a,i)}return e!=null&&Bl(i,a),y_}function C_(){let t=et(),n=Ot(),e=r_(n);return t.firstCreatePass&&d_(t,e),C_}function Ba(t,n,e){return y_(t,n,e),C_(),Ba}var ZA=(t,n,e,i,r)=>(Sl(!0),sT(n[Ye],""));function ae(){return de()}function Wt(t,n,e){let i=de(),r=xr();if(Pn(i,r,n)){let o=et(),a=Do();ew(a,i,t,n,i[Ye],e)}return Wt}var Gl="en-US";var QA=Gl;function Uw(t){typeof t=="string"&&(QA=t.toLowerCase().replace(/_/g,"-"))}function w(t,n,e){let i=de(),r=et(),o=Ot();return XA(r,i,i[Ye],o,t,n,e),w}function Ha(t,n,e){let i=de(),r=et(),o=Ot();return(o.type&3||e)&&l_(o,r,i,e,i[Ye],t,n,No(o,i,n)),Ha}function XA(t,n,e,i,r,o,a){let s=!0,l=null;if((i.type&3||a)&&(l??=No(i,n,o),l_(i,t,n,a,e,r,o,l)&&(s=!1)),s){let d=i.outputs?.[r],u=i.hostDirectiveOutputs?.[r];if(u&&u.length)for(let h=0;h<u.length;h+=2){let _=u[h],v=u[h+1];l??=No(i,n,o),Nu(i,n,_,v,r,l)}if(d&&d.length)for(let h of d)l??=No(i,n,o),Nu(i,n,h,r,r,l)}}function y(t=1){return t0(t)}function KA(t,n){let e=null,i=yT(t);for(let r=0;r<n.length;r++){let o=n[r];if(o==="*"){e=r;continue}if(i===null?UC(t,o,!0):ST(i,o))return r}return e}function _e(t){let n=de()[en][Ht];if(!n.projection){let e=t?t.length:1,i=n.projection=My(e,null),r=i.slice(),o=n.child;for(;o!==null;){if(o.type!==128){let a=t?KA(o,t):0;a!==null&&(r[a]?r[a].projectionNext=o:i[a]=o,r[a]=o)}o=o.next}}}function B(t,n=0,e,i,r,o){let a=de(),s=et(),l=i?t+1:null;l!==null&&Ra(a,s,l,i,r,o,null,e);let d=Fa(s,_t+t,16,null,e||null);d.projection===null&&(d.projection=n),kp();let h=!a[vo]||Ep();a[en][Ht].projection[d.projection]===null&&l!==null?JA(a,s,l):h&&!Vu(d)&&YT(s,a,d)}function JA(t,n,e){let i=_t+e,r=n.data[i],o=t[i],a=Eu(o,r.tView.ssrId),s=Hl(t,r,void 0,{dehydratedView:a});Ul(o,s,0,ka(r,a))}function ct(t,n,e,i){return Tw(t,n,e,i),ct}function Re(t,n,e){return Iw(t,n,e),Re}function z(t){let n=de(),e=et(),i=su();Cl(i+1);let r=m_(e,i);if(t.dirty&&Ly(n)===((r.metadata.flags&2)===2)){if(r.matches===null)t.reset([]);else{let o=Aw(n,i);t.reset(o,pC),t.notifyOnChanges()}return!0}return!1}function $(){return u_(de(),su())}function Ju(t,n,e,i,r){return Ow(n,Tw(t,e,i,r)),Ju}function Ua(t,n,e,i){return Ow(t,Iw(n,e,i)),Ua}function za(t=1){Cl(su()+t)}function rt(t){let n=Wy();return Fy(n,_t+t)}function _u(t,n){return t<<17|n<<2}function ko(t){return t>>17&32767}function eR(t){return(t&2)==2}function tR(t,n){return t&131071|n<<17}function Tg(t){return t|2}function Oa(t){return(t&131068)>>2}function qp(t,n){return t&-131069|n<<2}function nR(t){return(t&1)===1}function kg(t){return t|1}function iR(t,n,e,i,r,o){let a=o?n.classBindings:n.styleBindings,s=ko(a),l=Oa(a);t[i]=e;let d=!1,u;if(Array.isArray(e)){let h=e;u=h[1],(u===null||_a(h,u)>0)&&(d=!0)}else u=e;if(r)if(l!==0){let _=ko(t[s+1]);t[i+1]=_u(_,s),_!==0&&(t[_+1]=qp(t[_+1],i)),t[s+1]=tR(t[s+1],i)}else t[i+1]=_u(s,0),s!==0&&(t[s+1]=qp(t[s+1],i)),s=i;else t[i+1]=_u(l,0),s===0?s=i:t[l+1]=qp(t[l+1],i),l=i;d&&(t[i+1]=Tg(t[i+1])),Y0(t,u,i,!0),Y0(t,u,i,!1),rR(n,u,t,i,o),a=_u(s,l),o?n.classBindings=a:n.styleBindings=a}function rR(t,n,e,i,r){let o=r?t.residualClasses:t.residualStyles;o!=null&&typeof n=="string"&&_a(o,n)>=0&&(e[i+1]=kg(e[i+1]))}function Y0(t,n,e,i){let r=t[e+1],o=n===null,a=i?ko(r):Oa(r),s=!1;for(;a!==0&&(s===!1||o);){let l=t[a],d=t[a+1];oR(l,n)&&(s=!0,t[a+1]=i?kg(d):Tg(d)),a=i?ko(d):Oa(d)}s&&(t[e+1]=i?Tg(r):kg(r))}function oR(t,n){return t===null||n==null||(Array.isArray(t)?t[1]:t)===n?!0:Array.isArray(t)&&typeof n=="string"?_a(t,n)>=0:!1}var ti={textEnd:0,key:0,keyEnd:0,value:0,valueEnd:0};function aR(t){return t.substring(ti.key,ti.keyEnd)}function sR(t){return lR(t),zw(t,$w(t,0,ti.textEnd))}function zw(t,n){let e=ti.textEnd;return e===n?-1:(n=ti.keyEnd=cR(t,ti.key=n,e),$w(t,n,e))}function lR(t){ti.key=0,ti.keyEnd=0,ti.value=0,ti.valueEnd=0,ti.textEnd=t.length}function $w(t,n,e){for(;n<e&&t.charCodeAt(n)<=32;)n++;return n}function cR(t,n,e){for(;n<e&&t.charCodeAt(n)>32;)n++;return n}function Lt(t,n,e){return Ww(t,n,e,!1),Lt}function T(t,n){return Ww(t,n,null,!0),T}function Ke(t){uR(_R,dR,t,!0)}function dR(t,n){for(let e=sR(n);e>=0;e=zw(n,e))Zd(t,aR(n),!0)}function Ww(t,n,e,i){let r=de(),o=et(),a=ou(2);if(o.firstUpdatePass&&qw(o,t,a,i),n!==tn&&Pn(r,a,n)){let s=o.data[Jn()];Yw(o,s,r,r[Ye],t,r[a+1]=bR(n,e),i,a)}}function uR(t,n,e,i){let r=et(),o=ou(2);r.firstUpdatePass&&qw(r,null,o,i);let a=de();if(e!==tn&&Pn(a,o,e)){let s=r.data[Jn()];if(Zw(s,i)&&!Gw(r,o)){let l=i?s.classesWithoutHost:s.stylesWithoutHost;l!==null&&(e=zd(l,e||"")),Ig(r,s,a,e,i)}else vR(r,s,a,a[Ye],a[o+1],a[o+1]=gR(t,n,e),i,o)}}function Gw(t,n){return n>=t.expandoStartIndex}function qw(t,n,e,i){let r=t.data;if(r[e+1]===null){let o=r[Jn()],a=Gw(t,e);Zw(o,i)&&n===null&&!a&&(n=!1),n=mR(r,o,n,i),iR(r,o,n,e,a,i)}}function mR(t,n,e,i){let r=Xy(t),o=i?n.residualClasses:n.residualStyles;if(r===null)(i?n.classBindings:n.styleBindings)===0&&(e=Yp(null,t,n,e,i),e=Ol(e,n.attrs,i),o=null);else{let a=n.directiveStylingLast;if(a===-1||t[a]!==r)if(e=Yp(r,t,n,e,i),o===null){let l=fR(t,n,i);l!==void 0&&Array.isArray(l)&&(l=Yp(null,t,n,l[1],i),l=Ol(l,n.attrs,i),hR(t,n,i,l))}else o=pR(t,n,i)}return o!==void 0&&(i?n.residualClasses=o:n.residualStyles=o),e}function fR(t,n,e){let i=e?n.classBindings:n.styleBindings;if(Oa(i)!==0)return t[ko(i)]}function hR(t,n,e,i){let r=e?n.classBindings:n.styleBindings;t[ko(r)]=i}function pR(t,n,e){let i,r=n.directiveEnd;for(let o=1+n.directiveStylingLast;o<r;o++){let a=t[o].hostAttrs;i=Ol(i,a,e)}return Ol(i,n.attrs,e)}function Yp(t,n,e,i,r){let o=null,a=e.directiveEnd,s=e.directiveStylingLast;for(s===-1?s=e.directiveStart:s++;s<a&&(o=n[s],i=Ol(i,o.hostAttrs,r),o!==t);)s++;return t!==null&&(e.directiveStylingLast=s),i}function Ol(t,n,e){let i=e?1:2,r=-1;if(n!==null)for(let o=0;o<n.length;o++){let a=n[o];typeof a=="number"?r=a:r===i&&(Array.isArray(t)||(t=t===void 0?[]:["",t]),Zd(t,a,e?!0:n[++o]))}return t===void 0?null:t}function gR(t,n,e){if(e==null||e==="")return $t;let i=[],r=On(e);if(Array.isArray(r))for(let o=0;o<r.length;o++)t(i,r[o],!0);else if(r instanceof Set)for(let o of r)t(i,o,!0);else if(typeof r=="object")for(let o in r)Object.hasOwn(r,o)&&t(i,o,r[o]);else typeof r=="string"&&n(i,r);return i}function _R(t,n,e){let i=String(n);i!==""&&!i.includes(" ")&&Zd(t,i,e)}function vR(t,n,e,i,r,o,a,s){r===tn&&(r=$t);let l=0,d=0,u=0<r.length?r[0]:null,h=0<o.length?o[0]:null;for(;u!==null||h!==null;){let _=l<r.length?r[l+1]:void 0,v=d<o.length?o[d+1]:void 0,x=null,A;u===h?(l+=2,d+=2,_!==v&&(x=h,A=v)):h===null||u!==null&&u<h?(l+=2,x=u):(d+=2,x=h,A=v),x!==null&&Yw(t,n,e,i,x,A,a,s),u=l<r.length?r[l]:null,h=d<o.length?o[d]:null}}function Yw(t,n,e,i,r,o,a,s){if(!(n.type&3))return;let l=t.data,d=l[s+1],u=nR(d)?Z0(l,n,e,r,Oa(d),a):void 0;if(!Lu(u)){Lu(o)||eR(d)&&(o=Z0(l,null,e,r,s,a));let h=yp(Jn(),e);QT(i,a,h,r,o)}}function Z0(t,n,e,i,r,o){let a=n===null,s;for(;r>0;){let l=t[r],d=Array.isArray(l),u=d?l[1]:l,h=u===null,_=e[r+1];_===tn&&(_=h?$t:void 0);let v=h?Qd(_,i):u===i?_:void 0;if(d&&!Lu(v)&&(v=Qd(l,i)),Lu(v)&&(s=v,a))return s;let x=t[r+1];r=a?ko(x):Oa(x)}if(n!==null){let l=o?n.residualClasses:n.residualStyles;l!=null&&(s=Qd(l,i))}return s}function Lu(t){return t!==void 0}function bR(t,n){return t==null||t===""||(typeof n=="string"?t=On(t)+n:typeof t=="object"&&(t=ml(On(t)))),t}function Zw(t,n){return(t.flags&(n?8:16))!==0}function g(t,n=""){let e=de(),i=et(),r=t+_t,o=i.firstCreatePass?Fa(i,r,1,n,null):i.data[r],a=yR(i,e,o,n);e[r]=a,du()&&Xg(i,e,a,o),xa(o,!1)}var yR=(t,n,e,i)=>(Sl(!0),oT(n[Ye],i));function CR(t,n,e,i=""){return Pn(t,xr(),e)?n+ga(e)+i:tn}function wR(t,n,e,i,r,o=""){let a=Gy(),s=yw(t,a,e,r);return ou(2),s?n+ga(e)+i+ga(r)+o:tn}function k(t){return dt("",t),k}function dt(t,n,e){let i=de(),r=CR(i,t,n,e);return r!==tn&&Qw(i,Jn(),r),dt}function $a(t,n,e,i,r){let o=de(),a=wR(o,t,n,e,i,r);return a!==tn&&Qw(o,Jn(),a),$a}function Qw(t,n,e){let i=yp(n,t);aT(t[Ye],i,e)}function Q0(t,n,e){let i=et();i.firstCreatePass&&Xw(n,i.data,i.blueprint,Kn(t),e)}function Xw(t,n,e,i,r){if(t=kt(t),Array.isArray(t))for(let o=0;o<t.length;o++)Xw(t[o],n,e,i,r);else{let o=et(),a=de(),s=Ot(),l=ho(t)?t:kt(t.provide),d=pp(t),u=s.providerIndexes&1048575,h=s.directiveStart,_=s.providerIndexes>>20;if(ho(t)||!t.multi){let v=new Io(d,r,te,null),x=Qp(l,n,r?u:u+_,h);x===-1?(Jp(Du(s,a),o,l),Zp(o,t,n.length),n.push(l),s.directiveStart++,s.directiveEnd++,r&&(s.providerIndexes+=1048576),e.push(v),a.push(v)):(e[x]=v,a[x]=v)}else{let v=Qp(l,n,u+_,h),x=Qp(l,n,u,u+_),A=v>=0&&e[v],re=x>=0&&e[x];if(r&&!re||!r&&!A){Jp(Du(s,a),o,l);let oe=DR(r?xR:SR,e.length,r,i,d,t);!r&&re&&(e[x].providerFactory=oe),Zp(o,t,n.length,0),n.push(l),s.directiveStart++,s.directiveEnd++,r&&(s.providerIndexes+=1048576),e.push(oe),a.push(oe)}else{let oe=Kw(e[r?x:v],d,!r&&i);Zp(o,t,v>-1?v:x,oe)}!r&&i&&re&&e[x].componentProviders++}}}function Zp(t,n,e,i){let r=ho(n),o=Ay(n);if(r||o){let l=(o?kt(n.useClass):n).prototype.ngOnDestroy;if(l){let d=t.destroyHooks||(t.destroyHooks=[]);if(!r&&n.multi){let u=d.indexOf(e);u===-1?d.push(e,[i,l]):d[u+1].push(i,l)}else d.push(e,l)}}}function Kw(t,n,e){return e&&t.componentProviders++,t.multi.push(n)-1}function Qp(t,n,e,i){for(let r=e;r<i;r++)if(n[r]===t)return r;return-1}function SR(t,n,e,i,r){return Ag(this.multi,[])}function xR(t,n,e,i,r){let o=this.multi,a;if(this.providerFactory){let s=this.providerFactory.componentProviders,l=Il(i,i[ie],this.providerFactory.index,r);a=l.slice(0,s),Ag(o,a);for(let d=s;d<l.length;d++)a.push(l[d])}else a=[],Ag(o,a);return a}function Ag(t,n){for(let e=0;e<t.length;e++){let i=t[e];n.push(i())}return n}function DR(t,n,e,i,r,o){let a=new Io(t,e,te,null);return a.multi=[],a.index=n,a.componentProviders=0,Kw(a,r,i&&!e),a}function Ne(t,n){return e=>{e.providersResolver=(i,r)=>Q0(i,r?r(t):t,!1),n&&(e.viewProvidersResolver=(i,r)=>Q0(i,r?r(n):n,!0))}}function ql(t,n){let e=ru()+t,i=de();return i[e]===tn?s_(i,e,n()):Lk(i,e)}function Ro(t,n,e){return ER(de(),ru(),t,n,e)}function Yl(t,n,e,i){return MR(de(),ru(),t,n,e,i)}function Jw(t,n){let e=t[n];return e===tn?void 0:e}function ER(t,n,e,i,r,o){let a=n+e;return Pn(t,a,r)?s_(t,a+1,o?i.call(o,r):i(r)):Jw(t,a+1)}function MR(t,n,e,i,r,o,a){let s=n+e;return yw(t,s,r,o)?s_(t,s+2,a?i.call(a,r,o):i(r,o)):Jw(t,s+2)}function Wa(t,n){return Yu(t,n)}var eS=(()=>{class t{applicationErrorHandler=c(Rn);appRef=c(nn);taskService=c($i);ngZone=c(U);zonelessEnabled=c(Dl);tracing=c(Di,{optional:!0});zoneIsDefined=typeof Zone<"u"&&!!Zone.root.run;schedulerTickApplyArgs=[{data:{__scheduler_tick__:!0}}];subscriptions=new ce;angularZoneId=this.zoneIsDefined?this.ngZone._inner?.get(dl):null;scheduleInRootZone=!this.zonelessEnabled&&this.zoneIsDefined&&(c(Bp,{optional:!0})??!1);cancelScheduledCallback=null;useMicrotaskScheduler=!1;runningTick=!1;pendingRenderTaskId=null;constructor(){this.subscriptions.add(this.appRef.afterTick.subscribe(()=>{let e=this.taskService.add();if(!this.runningTick&&(this.cleanup(),!this.zonelessEnabled||this.appRef.includeAllTestViews)){this.taskService.remove(e);return}this.switchToMicrotaskScheduler(),this.taskService.remove(e)})),this.subscriptions.add(this.ngZone.onUnstable.subscribe(()=>{this.runningTick||this.cleanup()}))}switchToMicrotaskScheduler(){this.ngZone.runOutsideAngular(()=>{let e=this.taskService.add();this.useMicrotaskScheduler=!0,queueMicrotask(()=>{this.useMicrotaskScheduler=!1,this.taskService.remove(e)})})}notify(e){if(!this.zonelessEnabled&&e===5)return;switch(e){case 0:case 2:{this.appRef.dirtyFlags|=2;break}case 3:case 4:case 5:case 1:{this.appRef.dirtyFlags|=4;break}case 6:{this.appRef.dirtyFlags|=2;break}case 12:{this.appRef.dirtyFlags|=16;break}case 13:{this.appRef.dirtyFlags|=2;break}case 11:break;default:this.appRef.dirtyFlags|=8}if(this.appRef.tracingSnapshot=this.tracing?.snapshot(this.appRef.tracingSnapshot)??null,!this.shouldScheduleTick())return;let i=this.useMicrotaskScheduler?o0:Lp;this.pendingRenderTaskId=this.taskService.add(),this.scheduleInRootZone?this.cancelScheduledCallback=Zone.root.run(()=>i(()=>this.tick())):this.cancelScheduledCallback=this.ngZone.runOutsideAngular(()=>i(()=>this.tick()))}shouldScheduleTick(){return!(this.appRef.destroyed||this.pendingRenderTaskId!==null||this.runningTick||this.appRef._runningTick||!this.zonelessEnabled&&this.zoneIsDefined&&Zone.current.get(dl+this.angularZoneId))}tick(){if(this.runningTick||this.appRef.destroyed)return;if(this.appRef.dirtyFlags===0){this.cleanup();return}!this.zonelessEnabled&&this.appRef.dirtyFlags&7&&(this.appRef.dirtyFlags|=1);let e=this.taskService.add();try{this.ngZone.run(()=>{this.runningTick=!0,this.appRef._tick()},void 0,this.schedulerTickApplyArgs)}catch(i){this.applicationErrorHandler(i)}finally{this.taskService.remove(e),this.cleanup()}}ngOnDestroy(){this.subscriptions.unsubscribe(),this.cleanup()}cleanup(){if(this.runningTick=!1,this.cancelScheduledCallback?.(),this.cancelScheduledCallback=null,this.pendingRenderTaskId!==null){let e=this.pendingRenderTaskId;this.pendingRenderTaskId=null,this.taskService.remove(e)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function w_(){return Ei("NgZoneless"),gi([...S_(),[]])}function S_(){return[{provide:hi,useExisting:eS},{provide:U,useClass:ul},{provide:Dl,useValue:!0}]}var x_=(()=>{class t{compileModuleSync(e){return new Ou(e)}compileModuleAsync(e){return Promise.resolve(this.compileModuleSync(e))}clearCache(){}clearCacheFor(e){}getModuleId(e){}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function NR(){return typeof $localize<"u"&&$localize.locale||Gl}var em=new C("",{factory:()=>c(em,{optional:!0,skipSelf:!0})||NR()});function De(t,n){return Ks(t,n?.equal)}function Ee(t){return Vb(t)}var tS=class t extends Error{_brand;constructor(n){super(n)}static IDLE=new t("IDLE");static LOADING=new t("LOADING")},IR=t=>t;function tm(t,n){if(typeof t=="function"){let e=Nh(t,IR,n?.equal);return nS(e,n?.debugName,n?.set)}else{let e=Nh(t.source,t.computation,t.equal);return nS(e,t.debugName,t.set)}}function nS(t,n,e){let i=t[pt],r=t;if(e!==void 0){let o=a=>Ih(i,a);r.set=a=>e(a,o),r.update=a=>e(a(Ee(t)),o)}else r.set=o=>Ih(i,o),r.update=o=>jb(i,o);return r.asReadonly=uu.bind(t),r}function lS(t,n){let e=Object.create(J0);e.value=t,e.transformFn=n?.transform;function i(){if(mr(e),e.value===ju){let r=null;throw new H(-950,r)}return e.value}return i[pt]=e,i}var Cn=class{attributeName;constructor(n){this.attributeName=n}__NG_ELEMENT_ID__=()=>Fl(this.attributeName);toString(){return`HostAttributeToken ${this.attributeName}`}};function N_(t){return GR(t)?t.default:t}function GR(t){return t&&typeof t=="object"&&"default"in t}function iS(t,n){return lS(t,n)}function qR(t){return lS(ju,t)}var rn=(iS.required=qR,iS);function rS(t,n){return f_(n)}function YR(t,n){return h_(n)}var Oo=(rS.required=YR,rS);function oS(t,n){return f_(n)}function ZR(t,n){return h_(n)}var cS=(oS.required=ZR,oS);var QR=1e4;var lZ=QR-1e3;var Me=(()=>{class t{static __NG_ELEMENT_ID__=XR}return t})();function XR(t){return KR(Ot(),de(),(t&16)===16)}function KR(t,n,e){if(Ci(t)&&!e){let i=An(t.index,n);return new Ir(i,i)}else if(t.type&175){let i=n[en];return new Ir(i,n)}return null}var E_=new C(""),JR=new C("");function Zl(t){return!t.moduleRef}function e1(t){let n=Zl(t)?t.r3Injector:t.moduleRef.injector,e=n.get(U);return e.run(()=>{Zl(t)?t.r3Injector.resolveInjectorInitializers():t.moduleRef.resolveInjectorInitializers();let i=n.get(Rn),r;if(e.runOutsideAngular(()=>{r=e.onError.subscribe({next:i})}),Zl(t)){let o=()=>n.destroy(),a=t.platformInjector.get(E_);a.add(o),n.onDestroy(()=>{r.unsubscribe(),a.delete(o)})}else{let o=()=>t.moduleRef.destroy(),a=t.platformInjector.get(E_);a.add(o),t.moduleRef.onDestroy(()=>{Nl(t.allPlatformModules,t.moduleRef),r.unsubscribe(),a.delete(o)})}return n1(i,e,()=>{let o=n.get($i),a=o.add(),s=n.get(g_);return s.runInitializers(),s.donePromise.then(()=>{let l=n.get(em,Gl);if(Uw(l||Gl),!n.get(JR,!0))return Zl(t)?n.get(nn):(t.allPlatformModules.push(t.moduleRef),t.moduleRef);if(Zl(t)){let u=n.get(nn);return t.rootComponent!==void 0&&u.bootstrap(t.rootComponent),u}else return t1?.(t.moduleRef,t.allPlatformModules),t.moduleRef}).finally(()=>{o.remove(a)})})})}var t1;function n1(t,n,e){try{let i=e();return Zi(i)?i.catch(r=>{throw n.runOutsideAngular(()=>t(r)),r}):i}catch(i){throw n.runOutsideAngular(()=>t(i)),i}}var nm=null;function i1(t=[],n){return X.create({name:n,providers:[{provide:vl,useValue:"platform"},{provide:E_,useValue:new Set([()=>nm=null])},...t]})}function r1(t=[]){if(nm)return nm;let n=i1(t);return nm=n,Bw(),o1(n),n}function o1(t){let n=t.get(mu,null);Rt(t,()=>{n?.forEach(e=>e())})}function dS(t){let{rootComponent:n,appProviders:e,platformProviders:i,platformRef:r}=t;He(Ie.BootstrapApplicationStart);try{let o=r?.injector??r1(i),a=[S_(),s0,...e||[]],s=new Rl({providers:a,parent:o,debugName:"",runEnvironmentInitializers:!1});return e1({r3Injector:s.injector,platformInjector:o,rootComponent:n})}catch(o){return Promise.reject(o)}finally{He(Ie.BootstrapApplicationEnd)}}function G(t){return typeof t=="boolean"?t:t!=null&&t!=="false"}function Nt(t,n=NaN){return!isNaN(parseFloat(t))&&!isNaN(Number(t))?Number(t):n}var D_=Symbol("NOT_SET"),uS=new Set,a1=V(b({},aa),{kind:"afterRenderEffectPhase",consumerIsAlwaysLive:!0,consumerAllowSignalWrites:!0,value:D_,cleanup:null,consumerMarkedDirty(){if(this.sequence.impl.executing){if(this.sequence.lastPhase===null||this.sequence.lastPhase<this.phase)return;this.sequence.erroredOrDestroyed=!0}this.sequence.scheduler.notify(7)},phaseFn(t){if(this.sequence.lastPhase=this.phase,!this.dirty)return this.signal;if(this.dirty=!1,this.value!==D_&&!ra(this))return this.signal;try{for(let r of this.cleanup??uS)r()}finally{this.cleanup?.clear()}let n=[];t!==void 0&&n.push(t),n.push(this.registerCleanupFn);let e=Fi(this),i;try{i=this.userFn.apply(null,n)}finally{fr(this,e)}return(this.value===D_||!this.equal(this.value,i))&&(this.value=i,this.version++),this.signal}}),M_=class extends Tl{scheduler;lastPhase=null;nodes=[void 0,void 0,void 0,void 0];onDestroyFns=null;constructor(n,e,i,r,o,a=null){super(n,[void 0,void 0,void 0,void 0],i,!1,o.get(Xe),a),this.scheduler=r;for(let s of qg){let l=e[s];if(l===void 0)continue;let d=Object.create(a1);d.sequence=this,d.phase=s,d.userFn=l,d.dirty=!0,d.signal=()=>(mr(d),d.value),d.signal[pt]=d,d.registerCleanupFn=u=>(d.cleanup??=new Set).add(u),this.nodes[s]=d,this.hooks[s]=u=>d.phaseFn(u)}}afterRun(){super.afterRun(),this.lastPhase=null}destroy(){if(this.onDestroyFns!==null)for(let n of this.onDestroyFns)n();super.destroy();for(let n of this.nodes)if(n)try{for(let e of n.cleanup??uS)e()}finally{hr(n)}}};function I_(t,n){let e=n?.injector??c(X),i=e.get(hi),r=e.get(Uu),o=e.get(Di,null,{optional:!0});r.impl??=e.get(Yg);let a=t;typeof a=="function"&&(a={mixedReadWrite:t});let s=e.get(Da,null,{optional:!0}),l=new M_(r.impl,[a.earlyRead,a.write,a.mixedReadWrite,a.read],s?.view,i,e,o?.snapshot(null));return r.impl.register(l),l}function im(t,n){let e=br(t),i=n.elementInjector||ba();return new Aa(e).create(i,n.projectableNodes,n.hostElement,n.environmentInjector,n.directives,n.bindings)}var mS=null;function Fn(){return mS}function T_(t){mS??=t}var Ql=class{},Ga=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(i){return new(i||t)};static \u0275prov=me({token:t,factory:()=>c(fS),providedIn:"platform"})}return t})();var fS=(()=>{class t extends Ga{_location;_history;_doc=c(K);constructor(){super(),this._location=window.location,this._history=window.history}getBaseHrefFromDOM(){return Fn().getBaseHref(this._doc)}onPopState(e){let i=Fn().getGlobalEventTarget(this._doc,"window");return i.addEventListener("popstate",e,!1),()=>i.removeEventListener("popstate",e)}onHashChange(e){let i=Fn().getGlobalEventTarget(this._doc,"window");return i.addEventListener("hashchange",e,!1),()=>i.removeEventListener("hashchange",e)}get href(){return this._location.href}get protocol(){return this._location.protocol}get hostname(){return this._location.hostname}get port(){return this._location.port}get pathname(){return this._location.pathname}get search(){return this._location.search}get hash(){return this._location.hash}set pathname(e){this._location.pathname=e}pushState(e,i,r){this._history.pushState(e,i,r)}replaceState(e,i,r){this._history.replaceState(e,i,r)}forward(){this._history.forward()}back(){this._history.back()}historyGo(e=0){this._history.go(e)}getState(){return this._history.state}static \u0275fac=function(i){return new(i||t)};static \u0275prov=me({token:t,factory:()=>new t,providedIn:"platform"})}return t})();function gS(t,n){return t?n?t.endsWith("/")?n.startsWith("/")?t+n.slice(1):t+n:n.startsWith("/")?t+n:`${t}/${n}`:t:n}function hS(t){let n=t.search(/#|\?|$/);return t[n-1]==="/"?t.slice(0,n-1)+t.slice(n):t}function Tr(t){return t&&t[0]!=="?"?`?${t}`:t}var qa=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(i){return new(i||t)};static \u0275prov=me({token:t,factory:()=>c(l1),providedIn:"root"})}return t})(),s1=new C(""),l1=(()=>{class t extends qa{_platformLocation;_baseHref;_removeListenerFns=[];constructor(e,i){super(),this._platformLocation=e,this._baseHref=i??this._platformLocation.getBaseHrefFromDOM()??c(K).location?.origin??""}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}prepareExternalUrl(e){return gS(this._baseHref,e)}path(e=!1){let i=this._platformLocation.pathname+Tr(this._platformLocation.search),r=this._platformLocation.hash;return r&&e?`${i}${r}`:i}pushState(e,i,r,o){let a=this.prepareExternalUrl(r+Tr(o));this._platformLocation.pushState(e,i,a)}replaceState(e,i,r,o){let a=this.prepareExternalUrl(r+Tr(o));this._platformLocation.replaceState(e,i,a)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static \u0275fac=function(i){return new(i||t)(ee(Ga),ee(s1,8))};static \u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var kr=(()=>{class t{_subject=new I;_basePath;_locationStrategy;_urlChangeListeners=[];_urlChangeSubscription=null;constructor(e){this._locationStrategy=e;let i=this._locationStrategy.getBaseHref();this._basePath=u1(hS(pS(i))),this._locationStrategy.onPopState(r=>{let o={url:this.path(!0),pop:!0,state:r.state,type:r.type};r.hasUAVisualTransition&&(o.hasUAVisualTransition=!0),this._subject.next(o)})}ngOnDestroy(){this._urlChangeSubscription?.unsubscribe(),this._urlChangeListeners=[]}path(e=!1){return this.normalize(this._locationStrategy.path(e))}getState(){return this._locationStrategy.getState()}isCurrentPathEqualTo(e,i=""){return this.path()==this.normalize(e+Tr(i))}normalize(e){return t.stripTrailingSlash(d1(this._basePath,pS(e)))}prepareExternalUrl(e){return e&&e[0]!=="/"&&(e="/"+e),this._locationStrategy.prepareExternalUrl(e)}go(e,i="",r=null){this._locationStrategy.pushState(r,"",e,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+Tr(i)),r)}replaceState(e,i="",r=null){this._locationStrategy.replaceState(r,"",e,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+Tr(i)),r)}forward(){this._locationStrategy.forward()}back(){this._locationStrategy.back()}historyGo(e=0){this._locationStrategy.historyGo?.(e)}onUrlChange(e){return this._urlChangeListeners.push(e),this._urlChangeSubscription??=this.subscribe(i=>{this._notifyUrlChangeListeners(i.url,i.state)}),()=>{let i=this._urlChangeListeners.indexOf(e);this._urlChangeListeners.splice(i,1),this._urlChangeListeners.length===0&&(this._urlChangeSubscription?.unsubscribe(),this._urlChangeSubscription=null)}}_notifyUrlChangeListeners(e="",i){this._urlChangeListeners.forEach(r=>r(e,i))}subscribe(e,i,r){return this._subject.subscribe({next:e,error:i??void 0,complete:r??void 0})}static normalizeQueryParams=Tr;static joinWithSlash=gS;static stripTrailingSlash=hS;static \u0275fac=function(i){return new(i||t)(ee(qa))};static \u0275prov=me({token:t,factory:()=>c1(),providedIn:"root"})}return t})();function c1(){return new kr(ee(qa))}function d1(t,n){if(!t||!n.startsWith(t))return n;let e=n.substring(t.length);return e===""||["/",";","?","#"].includes(e[0])?e:n}function pS(t){return t.replace(/\/index\.html$/,"")}function u1(t){if(new RegExp("^(https?:)?//").test(t)){let[,e]=t.split(/\/\/[^\/]+/);return e}return t}var Xl=(()=>{class t{_viewContainerRef;_viewRef=null;ngTemplateOutletContext=null;ngTemplateOutlet=null;ngTemplateOutletInjector=null;injector=c(X);constructor(e){this._viewContainerRef=e}ngOnChanges(e){if(this._shouldRecreateView(e)){let i=this._viewContainerRef;if(this._viewRef&&i.remove(i.indexOf(this._viewRef)),!this.ngTemplateOutlet){this._viewRef=null;return}let r=this._createContextForwardProxy();this._viewRef=i.createEmbeddedView(this.ngTemplateOutlet,r,{injector:this._getInjector()})}}_getInjector(){return this.ngTemplateOutletInjector==="outlet"?this.injector:this.ngTemplateOutletInjector??void 0}_shouldRecreateView(e){return!!e.ngTemplateOutlet||!!e.ngTemplateOutletInjector}_createContextForwardProxy(){return new Proxy({},{set:(e,i,r)=>this.ngTemplateOutletContext?Reflect.set(this.ngTemplateOutletContext,i,r):!1,get:(e,i,r)=>{if(this.ngTemplateOutletContext)return Reflect.get(this.ngTemplateOutletContext,i,r)}})}static \u0275fac=function(i){return new(i||t)(te(ht))};static \u0275dir=R({type:t,selectors:[["","ngTemplateOutlet",""]],inputs:{ngTemplateOutletContext:"ngTemplateOutletContext",ngTemplateOutlet:"ngTemplateOutlet",ngTemplateOutletInjector:"ngTemplateOutletInjector"},features:[Ae]})}return t})();var rm=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();function Kl(t,n){n=encodeURIComponent(n);for(let e of t.split(";")){let i=e.indexOf("="),[r,o]=i==-1?[e,""]:[e.slice(0,i),e.slice(i+1)];if(r.trim()!==n)continue;let a=o;try{a=decodeURIComponent(o)}catch{}return a.length>1&&a[0]==='"'&&a[a.length-1]==='"'&&(a=a.slice(1,-1)),a}return null}var k_="browser";function _S(t){return t===k_}var Jl=class{_doc;constructor(n){this._doc=n}manager},om=(()=>{class t extends Jl{constructor(e){super(e)}supports(e){return!0}addEventListener(e,i,r,o){return e.addEventListener(i,r,o),()=>this.removeEventListener(e,i,r,o)}removeEventListener(e,i,r,o){return e.removeEventListener(i,r,o)}static \u0275fac=function(i){return new(i||t)(ee(K))};static \u0275prov=me({token:t,factory:t.\u0275fac})}return t})(),lm=new C(""),P_=(()=>{class t{_zone;_plugins;_eventNameToPlugin=new Map;constructor(e,i){this._zone=i,e.forEach(a=>{a.manager=this});let r=e.filter(a=>!(a instanceof om));this._plugins=r.slice().reverse();let o=e.find(a=>a instanceof om);o&&this._plugins.push(o)}addEventListener(e,i,r,o){return this._findPluginFor(i).addEventListener(e,i,r,o)}getZone(){return this._zone}_findPluginFor(e){let i=this._eventNameToPlugin.get(e);if(i)return i;if(i=this._plugins.find(o=>o.supports(e)),!i)throw new H(-5101,!1);return this._eventNameToPlugin.set(e,i),i}static \u0275fac=function(i){return new(i||t)(ee(lm),ee(U))};static \u0275prov=me({token:t,factory:t.\u0275fac})}return t})(),A_="ng-app-id";function vS(t){for(let n of t)n.remove()}function bS(t,n){let e=n.createElement("style");return e.textContent=t,e}function g1(t,n,e,i){let r=t.head?.querySelectorAll(`style[${A_}="${n}"],link[${A_}="${n}"]`);if(!r||r.length===0)return!1;for(let o of r)o.removeAttribute(A_),o instanceof HTMLLinkElement?i.set(o.href.slice(o.href.lastIndexOf("/")+1),{usage:0,elements:[o]}):o.textContent&&e.set(o.textContent,{usage:0,elements:[o]});return!0}function O_(t,n){let e=n.createElement("link");return e.setAttribute("rel","stylesheet"),e.setAttribute("href",t),e}var F_=(()=>{class t{doc;appId;nonce;inline=new Map;external=new Map;hosts=new Set;constructor(e,i,r,o={}){this.doc=e,this.appId=i,this.nonce=r,g1(e,i,this.inline,this.external)&&this.hosts.add(e.head)}addStyles(e,i){for(let r of e)this.addUsage(r,this.inline,bS);i?.forEach(r=>this.addUsage(r,this.external,O_))}removeStyles(e,i){for(let r of e)this.removeUsage(r,this.inline);i?.forEach(r=>this.removeUsage(r,this.external))}addUsage(e,i,r){let o=i.get(e);o?o.usage++:i.set(e,{usage:1,elements:[...this.hosts].map(a=>this.addElement(a,r(e,this.doc)))})}removeUsage(e,i){let r=i.get(e);r&&(r.usage--,r.usage<=0&&(vS(r.elements),i.delete(e)))}ngOnDestroy(){for(let[,{elements:e}]of[...this.inline,...this.external])vS(e);this.hosts.clear()}addHost(e){if(!this.hosts.has(e)){this.hosts.add(e);for(let[i,{elements:r}]of this.inline)r.push(this.addElement(e,bS(i,this.doc)));for(let[i,{elements:r}]of this.external)r.push(this.addElement(e,O_(i,this.doc)))}}removeHost(e){this.hosts.delete(e);for(let i of[...this.inline.values(),...this.external.values()]){let r=[];for(let o of i.elements)o.parentNode===e?o.remove():r.push(o);i.elements=r}}addElement(e,i){return this.nonce&&i.setAttribute("nonce",this.nonce),e.appendChild(i)}static \u0275fac=function(i){return new(i||t)(ee(K),ee(Wi),ee(Er,8),ee(Eo))};static \u0275prov=me({token:t,factory:t.\u0275fac})}return t})(),R_={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/",math:"http://www.w3.org/1998/Math/MathML"},L_=/%COMP%/g;var CS="%COMP%",_1=`_nghost-${CS}`,v1=`_ngcontent-${CS}`,b1=!0,y1=new C("",{factory:()=>b1}),C1=new C("");function w1(t){return v1.replace(L_,t)}function S1(t){return _1.replace(L_,t)}function wS(t,n){return n.map(e=>e.replace(L_,t))}var j_=(()=>{class t{eventManager;sharedStylesHost;appId;removeStylesOnCompDestroy;doc;ngZone;nonce;tracingService;rendererByCompId=new Map;defaultRenderer;cssVarNamespace;constructor(e,i,r,o,a,s,l=null,d=null,u=null){this.eventManager=e,this.sharedStylesHost=i,this.appId=r,this.removeStylesOnCompDestroy=o,this.doc=a,this.ngZone=s,this.nonce=l,this.tracingService=d,this.cssVarNamespace=u??"",this.defaultRenderer=new ec(e,a,s,this.tracingService,this.cssVarNamespace)}createRenderer(e,i){if(!e||!i)return this.defaultRenderer;let r=this.getOrCreateRenderer(e,i);return r instanceof sm?r.applyToHost(e):r instanceof tc&&r.applyStyles(),r}getOrCreateRenderer(e,i){let r=this.rendererByCompId,o=r.get(i.id);if(!o){let a=this.doc,s=this.ngZone,l=this.eventManager,d=this.sharedStylesHost,u=this.removeStylesOnCompDestroy,h=this.tracingService;switch(i.encapsulation){case ni.Emulated:o=new sm(l,d,i,this.appId,u,a,s,h,this.cssVarNamespace);break;case ni.ShadowDom:return new am(l,e,i,a,s,this.nonce,h,this.cssVarNamespace,d);case ni.ExperimentalIsolatedShadowDom:return new am(l,e,i,a,s,this.nonce,h,this.cssVarNamespace);default:o=new tc(l,d,i,u,a,s,h,this.cssVarNamespace);break}r.set(i.id,o)}return o}ngOnDestroy(){this.rendererByCompId.clear()}componentReplaced(e){this.rendererByCompId.delete(e)}static \u0275fac=function(i){return new(i||t)(ee(P_),ee(Ao),ee(Wi),ee(y1),ee(K),ee(U),ee(Er),ee(Di,8),ee(C1,8))};static \u0275prov=me({token:t,factory:t.\u0275fac})}return t})(),ec=class{eventManager;doc;ngZone;tracingService;cssVarNamespace;data=Object.create(null);throwOnSyntheticProps=!0;constructor(n,e,i,r,o=""){this.eventManager=n,this.doc=e,this.ngZone=i,this.tracingService=r,this.cssVarNamespace=o}destroy(){}destroyNode=null;createElement(n,e){return e?this.doc.createElementNS(R_[e]||e,n):this.doc.createElement(n)}createComment(n){return this.doc.createComment(n)}createText(n){return this.doc.createTextNode(n)}appendChild(n,e){(yS(n)?n.content:n).appendChild(e)}insertBefore(n,e,i){if(n){let r=yS(n)?n.content:n;if(i!=null&&i.parentNode!==r)throw new H(-5106,!1);r.insertBefore(e,i)}}removeChild(n,e){e.remove()}selectRootElement(n,e){let i=typeof n=="string"?this.doc.querySelector(n):n;if(!i)throw new H(-5104,!1);return e||(i.textContent=""),i}parentNode(n){return n.parentNode}nextSibling(n){return n.nextSibling}setAttribute(n,e,i,r){if(r){e=r+":"+e;let o=R_[r];o?n.setAttributeNS(o,e,i):n.setAttribute(e,i)}else n.setAttribute(e,i)}removeAttribute(n,e,i){if(i){let r=R_[i];r?n.removeAttributeNS(r,e):n.removeAttribute(`${i}:${e}`)}else n.removeAttribute(e)}addClass(n,e){n.classList.add(e)}removeClass(n,e){n.classList.remove(e)}setStyle(n,e,i,r){let o=e.startsWith("--");o&&(e=e.replace("%NS%",this.cssVarNamespace)),o||r&(Si.DashCase|Si.Important)?n.style.setProperty(e,i,r&Si.Important?"important":""):n.style[e]=i}removeStyle(n,e,i){let r=e.startsWith("--");r&&(e=e.replace("%NS%",this.cssVarNamespace)),r||i&Si.DashCase?n.style.removeProperty(e):n.style[e]=""}setProperty(n,e,i){n!=null&&(n[e]=i)}setValue(n,e){n.nodeValue=e}listen(n,e,i,r){if(typeof n=="string"&&(n=Fn().getGlobalEventTarget(this.doc,n),!n))throw new H(-5102,!1);let o=this.decoratePreventDefault(i);return this.tracingService?.wrapEventListener&&(o=this.tracingService.wrapEventListener(n,e,o)),this.eventManager.addEventListener(n,e,o,r)}decoratePreventDefault(n){return e=>{if(e==="__ngUnwrap__")return n;n(e)===!1&&e.preventDefault()}}};function yS(t){return t.tagName==="TEMPLATE"&&t.content!==void 0}var am=class extends ec{hostEl;sharedStylesHost;shadowRoot;constructor(n,e,i,r,o,a,s,l,d){super(n,r,o,s,l),this.hostEl=e,this.sharedStylesHost=d,this.shadowRoot=e.attachShadow({mode:"open"}),this.sharedStylesHost&&this.sharedStylesHost.addHost(this.shadowRoot);let u=i.styles;u=wS(i.id,u).map(_=>_.replace(/%NS%/g,l));for(let _ of u){let v=document.createElement("style");a&&v.setAttribute("nonce",a),v.textContent=_,this.shadowRoot.appendChild(v)}let h=i.getExternalStyles?.();if(h)for(let _ of h){let v=O_(_,r);a&&v.setAttribute("nonce",a),this.shadowRoot.appendChild(v)}}nodeOrShadowRoot(n){return n===this.hostEl?this.shadowRoot:n}appendChild(n,e){return super.appendChild(this.nodeOrShadowRoot(n),e)}insertBefore(n,e,i){return super.insertBefore(this.nodeOrShadowRoot(n),e,i)}removeChild(n,e){return super.removeChild(null,e)}parentNode(n){return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)))}destroy(){this.sharedStylesHost&&this.sharedStylesHost.removeHost(this.shadowRoot)}},tc=class extends ec{sharedStylesHost;removeStylesOnCompDestroy;styles;styleUrls;constructor(n,e,i,r,o,a,s,l,d){super(n,o,a,s,l),this.sharedStylesHost=e,this.removeStylesOnCompDestroy=r;let u=i.styles,h=d?wS(d,u):u;this.styles=h.map(_=>_.replace(/%NS%/g,l)),this.styleUrls=i.getExternalStyles?.(d)}applyStyles(){this.sharedStylesHost.addStyles(this.styles,this.styleUrls)}destroy(){this.removeStylesOnCompDestroy&&Nr.size===0&&this.sharedStylesHost.removeStyles(this.styles,this.styleUrls)}},sm=class extends tc{contentAttr;hostAttr;constructor(n,e,i,r,o,a,s,l,d){let u=r+"-"+i.id;super(n,e,i,o,a,s,l,d,u),this.contentAttr=w1(u),this.hostAttr=S1(u)}applyToHost(n){this.applyStyles(),this.setAttribute(n,this.hostAttr,"")}createElement(n,e){let i=super.createElement(n,e);return super.setAttribute(i,this.contentAttr,""),i}};var cm=class t extends Ql{supportsDOMEvents=!0;static makeCurrent(){T_(new t)}onAndCancel(n,e,i,r){return n.addEventListener(e,i,r),()=>{n.removeEventListener(e,i,r)}}dispatchEvent(n,e){n.dispatchEvent(e)}remove(n){n.remove()}createElement(n,e){return e=e||this.getDefaultDocument(),e.createElement(n)}createHtmlDocument(){return document.implementation.createHTMLDocument("fakeTitle")}getDefaultDocument(){return document}isElementNode(n){return n.nodeType===Node.ELEMENT_NODE}isShadowRoot(n){return n instanceof DocumentFragment}getGlobalEventTarget(n,e){return e==="window"?window:e==="document"?n:e==="body"?n.body:null}getBaseHref(n){let e=x1();return e==null?null:D1(e)}resetBaseElement(){nc=null}getUserAgent(){return window.navigator.userAgent}getCookie(n){return Kl(document.cookie,n)}},nc=null;function x1(){return nc=nc||document.head.querySelector("base"),nc?nc.getAttribute("href"):null}function D1(t){return new URL(t,document.baseURI).pathname}var SS=["alt","control","meta","shift"],E1={"\b":"Backspace","	":"Tab","\x7F":"Delete","\x1B":"Escape",Del:"Delete",Esc:"Escape",Left:"ArrowLeft",Right:"ArrowRight",Up:"ArrowUp",Down:"ArrowDown",Menu:"ContextMenu",Scroll:"ScrollLock",Win:"OS"},M1={alt:t=>t.altKey,control:t=>t.ctrlKey,meta:t=>t.metaKey,shift:t=>t.shiftKey},xS=(()=>{class t extends Jl{constructor(e){super(e)}supports(e){return t.parseEventName(e)!=null}addEventListener(e,i,r,o){let a=t.parseEventName(i),s=t.eventCallback(a.fullKey,r,this.manager.getZone());return this.manager.getZone().runOutsideAngular(()=>Fn().onAndCancel(e,a.domEventName,s,o))}static parseEventName(e){let i=e.toLowerCase().split("."),r=i.shift();if(i.length===0||!(r==="keydown"||r==="keyup"))return null;let o=t._normalizeKey(i.pop()),a="",s=i.indexOf("code");if(s>-1&&(i.splice(s,1),a="code."),SS.forEach(d=>{let u=i.indexOf(d);u>-1&&(i.splice(u,1),a+=d+".")}),a+=o,i.length!=0||o.length===0)return null;let l={};return l.domEventName=r,l.fullKey=a,l}static matchEventFullKeyCode(e,i){let r=E1[e.key]||e.key,o="";return i.indexOf("code.")>-1&&(r=e.code,o="code."),r==null||!r?!1:(r=r.toLowerCase(),r===" "?r="space":r==="."&&(r="dot"),SS.forEach(a=>{if(a!==r){let s=M1[a];s(e)&&(o+=a+".")}}),o+=r,o===i)}static eventCallback(e,i,r){return o=>{t.matchEventFullKeyCode(o,e)&&r.runGuarded(()=>i(o))}}static _normalizeKey(e){return e==="esc"?"escape":e}static \u0275fac=function(i){return new(i||t)(ee(K))};static \u0275prov=me({token:t,factory:t.\u0275fac})}return t})();async function V_(t,n,e){let i=b({rootComponent:t},N1(n,e));return dS(i)}function N1(t,n){return{platformRef:n?.platformRef,appProviders:[...R1,...t?.providers??[]],platformProviders:A1}}function I1(){cm.makeCurrent()}function T1(){return new Kt}function k1(){return Fg(document),document}var A1=[{provide:Eo,useValue:k_},{provide:mu,useValue:I1,multi:!0},{provide:K,useFactory:k1}];var R1=[{provide:vl,useValue:"root"},{provide:Kt,useFactory:T1},{provide:lm,useClass:om,multi:!0},{provide:lm,useClass:xS,multi:!0},j_,{provide:Ao,useClass:F_},{provide:F_,useExisting:Ao},P_,{provide:Mt,useExisting:j_},[]];var Ki=class t{headers;normalizedNames=new Map;lazyInit;lazyUpdate=null;constructor(n){n?typeof n=="string"?this.lazyInit=()=>{this.headers=new Map,n.split(`
`).forEach(e=>{let i=e.indexOf(":");if(i>0){let r=e.slice(0,i),o=e.slice(i+1).trim();this.addHeaderEntry(r,o)}})}:typeof Headers<"u"&&n instanceof Headers?(this.headers=new Map,n.forEach((e,i)=>{this.addHeaderEntry(i,e)})):this.lazyInit=()=>{this.headers=new Map,Object.entries(n).forEach(([e,i])=>{this.setHeaderEntries(e,i)})}:this.headers=new Map}has(n){return this.init(),this.headers.has(n.toLowerCase())}get(n){this.init();let e=this.headers.get(n.toLowerCase());return e&&e.length>0?e[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(n){return this.init(),this.headers.get(n.toLowerCase())||null}append(n,e){return this.clone({name:n,value:e,op:"a"})}set(n,e){return this.clone({name:n,value:e,op:"s"})}delete(n,e){return this.clone({name:n,value:e,op:"d"})}maybeSetNormalizedName(n,e){this.normalizedNames.has(e)||this.normalizedNames.set(e,n)}init(){this.lazyInit&&(this.lazyInit instanceof t?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(n=>this.applyUpdate(n)),this.lazyUpdate=null))}copyFrom(n){n.init();for(let[e,i]of n.headers.entries())this.headers.set(e,i),this.normalizedNames.set(e,n.normalizedNames.get(e))}clone(n){let e=new t;return e.lazyInit=this.lazyInit&&this.lazyInit instanceof t?this.lazyInit:this,e.lazyUpdate=(this.lazyUpdate||[]).concat([n]),e}applyUpdate(n){let e=n.name.toLowerCase();switch(n.op){case"a":case"s":let i=n.value;if(typeof i=="string"&&(i=[i]),i.length===0)return;this.maybeSetNormalizedName(n.name,e);let r=n.op==="a"?(this.headers.get(e)||[]).slice():[];r.push(...i),this.headers.set(e,r);break;case"d":let o=n.value;if(o===void 0)this.headers.delete(e),this.normalizedNames.delete(e);else{let a=Array.isArray(o)?o:[o],s=this.headers.get(e);if(!s)return;s=s.filter(l=>a.indexOf(l)===-1),s.length===0?(this.headers.delete(e),this.normalizedNames.delete(e)):this.headers.set(e,s)}break}}addHeaderEntry(n,e){let i=n.toLowerCase();this.maybeSetNormalizedName(n,i),this.headers.has(i)?this.headers.get(i).push(e):this.headers.set(i,[e])}setHeaderEntries(n,e){let i=(Array.isArray(e)?e:[e]).map(o=>o.toString()),r=n.toLowerCase();this.headers.set(r,i),this.maybeSetNormalizedName(n,r)}forEach(n){this.init(),Array.from(this.normalizedNames.keys()).forEach(e=>n(this.normalizedNames.get(e),this.headers.get(e)))}};var um=class{map=new Map;set(n,e){return this.map.set(n,e),this}get(n){return this.map.has(n)||this.map.set(n,n.defaultValue()),this.map.get(n)}delete(n){return this.map.delete(n),this}has(n){return this.map.has(n)}keys(){return this.map.keys()}},mm=class{encodeKey(n){return DS(n)}encodeValue(n){return DS(n)}decodeKey(n){return decodeURIComponent(n)}decodeValue(n){return decodeURIComponent(n)}};function O1(t,n){let e=new Map;return t.length>0&&t.replace(/^\?/,"").split("&").forEach(r=>{let o=r.indexOf("="),[a,s]=o==-1?[n.decodeKey(r),""]:[n.decodeKey(r.slice(0,o)),n.decodeValue(r.slice(o+1))],l=e.get(a)||[];l.push(s),e.set(a,l)}),e}var P1=/%(\d[a-f0-9])/gi,F1={40:"@","3A":":",24:"$","2C":",","3B":";","3D":"=","3F":"?","2F":"/"};function DS(t){return encodeURIComponent(t).replace(P1,(n,e)=>F1[e]??n)}function dm(t){return`${t}`}var Xi=class t{map;encoder;updates=null;cloneFrom=null;constructor(n={}){if(this.encoder=n.encoder||new mm,n.fromString){if(n.fromObject)throw new H(2805,!1);this.map=O1(n.fromString,this.encoder)}else n.fromObject?(this.map=new Map,Object.keys(n.fromObject).forEach(e=>{let i=n.fromObject[e],r=Array.isArray(i)?i.map(dm):[dm(i)];this.map.set(e,r)})):this.map=null}has(n){return this.init(),this.map.has(n)}get(n){this.init();let e=this.map.get(n);return e?e[0]:null}getAll(n){return this.init(),this.map.get(n)||null}keys(){return this.init(),Array.from(this.map.keys())}append(n,e){return this.clone({param:n,value:e,op:"a"})}appendAll(n){let e=[];return Object.keys(n).forEach(i=>{let r=n[i];Array.isArray(r)?r.forEach(o=>{e.push({param:i,value:o,op:"a"})}):e.push({param:i,value:r,op:"a"})}),this.clone(e)}set(n,e){return this.clone({param:n,value:e,op:"s"})}delete(n,e){return this.clone({param:n,value:e,op:"d"})}toString(){return this.init(),this.keys().map(n=>{let e=this.encoder.encodeKey(n);return this.map.get(n).map(i=>e+"="+this.encoder.encodeValue(i)).join("&")}).filter(n=>n!=="").join("&")}clone(n){let e=new t({encoder:this.encoder});return e.cloneFrom=this.cloneFrom||this,e.updates=(this.updates||[]).concat(n),e}init(){if(this.map===null&&(this.map=new Map),this.cloneFrom!==null){this.cloneFrom.init();for(let[n,e]of this.cloneFrom.map.entries())this.map.set(n,e);this.updates.forEach(n=>{switch(n.op){case"a":case"s":let e=n.op==="a"?(this.map.get(n.param)||[]).slice():[];e.push(dm(n.value)),this.map.set(n.param,e);break;case"d":if(n.value!==void 0){let i=(this.map.get(n.param)||[]).slice(),r=i.indexOf(dm(n.value));r!==-1&&i.splice(r,1),i.length>0?this.map.set(n.param,i):this.map.delete(n.param)}else{this.map.delete(n.param);break}}}),this.cloneFrom=this.updates=null}}};function L1(t){switch(t){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}function ES(t){return typeof ArrayBuffer<"u"&&t instanceof ArrayBuffer}function MS(t){return typeof Blob<"u"&&t instanceof Blob}function NS(t){return typeof FormData<"u"&&t instanceof FormData}function j1(t){return typeof URLSearchParams<"u"&&t instanceof URLSearchParams}var B_="Content-Type",IS="Accept",AS="text/plain",RS="application/json",V1=`${RS}, ${AS}, */*`,Ya=class t{url;body=null;headers;context;reportProgress=!1;reportUploadProgress=!1;reportDownloadProgress=!1;withCredentials=!1;credentials;keepalive=!1;cache;priority;mode;redirect;referrer;integrity;referrerPolicy;responseType="json";method;params;urlWithParams;transferCache;timeout;constructor(n,e,i,r){this.url=e,this.method=n.toUpperCase();let o;if(L1(this.method)||r?(this.body=i!==void 0?i:null,o=r):o=i,o){if(this.reportProgress=!!o.reportProgress,this.reportUploadProgress=!!o.reportUploadProgress,this.reportDownloadProgress=!!o.reportDownloadProgress,this.withCredentials=!!o.withCredentials,this.keepalive=!!o.keepalive,o.responseType&&(this.responseType=o.responseType),o.headers&&(this.headers=o.headers),o.context&&(this.context=o.context),o.params&&(this.params=o.params),o.priority&&(this.priority=o.priority),o.cache&&(this.cache=o.cache),o.credentials&&(this.credentials=o.credentials),typeof o.timeout=="number"){if(o.timeout<1||!Number.isInteger(o.timeout))throw new H(2822,"");this.timeout=o.timeout}o.mode&&(this.mode=o.mode),o.redirect&&(this.redirect=o.redirect),o.integrity&&(this.integrity=o.integrity),o.referrer!==void 0&&(this.referrer=o.referrer),o.referrerPolicy&&(this.referrerPolicy=o.referrerPolicy),this.transferCache=o.transferCache}if(this.headers??=new Ki,this.context??=new um,!this.params)this.params=new Xi,this.urlWithParams=e;else{let a=this.params.toString();if(a.length===0)this.urlWithParams=e;else{let s=e,l="",d=e.indexOf("#");d!==-1&&(l=e.substring(d),s=e.substring(0,d));let u=s.indexOf("?"),h=u===-1?"?":u<s.length-1?"&":"";this.urlWithParams=s+h+a+l}}}serializeBody(){return this.body===null?null:typeof this.body=="string"||ES(this.body)||MS(this.body)||NS(this.body)||j1(this.body)?this.body:this.body instanceof Xi?this.body.toString():typeof this.body=="object"||typeof this.body=="boolean"||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return this.body===null||NS(this.body)?null:MS(this.body)?this.body.type||null:ES(this.body)?null:typeof this.body=="string"?AS:this.body instanceof Xi?"application/x-www-form-urlencoded;charset=UTF-8":typeof this.body=="object"||typeof this.body=="number"||typeof this.body=="boolean"?RS:null}clone(n={}){let e=n.method||this.method,i=n.url||this.url,r=n.responseType||this.responseType,o=n.keepalive??this.keepalive,a=n.priority||this.priority,s=n.cache||this.cache,l=n.mode||this.mode,d=n.redirect||this.redirect,u=n.credentials||this.credentials,h=n.referrer??this.referrer,_=n.integrity||this.integrity,v=n.referrerPolicy||this.referrerPolicy,x=n.transferCache??this.transferCache,A=n.timeout??this.timeout,re=n.body!==void 0?n.body:this.body,oe=n.withCredentials??this.withCredentials,Qe=n.reportProgress??this.reportProgress,Tt=n.reportUploadProgress??this.reportUploadProgress,qs=n.reportDownloadProgress??this.reportDownloadProgress,cr=n.headers||this.headers,Ys=n.params||this.params,Zs=n.context??this.context;return n.setHeaders!==void 0&&(cr=Object.keys(n.setHeaders).reduce((na,dr)=>na.set(dr,n.setHeaders[dr]),cr)),n.setParams&&(Ys=Object.keys(n.setParams).reduce((na,dr)=>na.set(dr,n.setParams[dr]),Ys)),new t(e,i,re,{params:Ys,headers:cr,context:Zs,reportProgress:Qe,reportUploadProgress:Tt,reportDownloadProgress:qs,responseType:r,withCredentials:oe,transferCache:x,keepalive:o,cache:s,priority:a,timeout:A,mode:l,redirect:d,credentials:u,referrer:h,integrity:_,referrerPolicy:v})}},Po=(function(t){return t[t.Sent=0]="Sent",t[t.UploadProgress=1]="UploadProgress",t[t.ResponseHeader=2]="ResponseHeader",t[t.DownloadProgress=3]="DownloadProgress",t[t.Response=4]="Response",t[t.User=5]="User",t})(Po||{}),Za=class{headers;status;statusText;url;ok;type;redirected;responseType;constructor(n,e=200,i="OK"){this.headers=n.headers||new Ki,this.status=n.status!==void 0?n.status:e,this.statusText=n.statusText||i,this.url=n.url||null,this.redirected=n.redirected,this.responseType=n.responseType,this.ok=this.status>=200&&this.status<300}},fm=class t extends Za{constructor(n={}){super(n)}type=Po.ResponseHeader;clone(n={}){return new t({headers:n.headers||this.headers,status:n.status!==void 0?n.status:this.status,statusText:n.statusText||this.statusText,url:n.url||this.url||void 0})}},ic=class t extends Za{body;constructor(n={}){super(n),this.body=n.body!==void 0?n.body:null}type=Po.Response;clone(n={}){return new t({body:n.body!==void 0?n.body:this.body,headers:n.headers||this.headers,status:n.status!==void 0?n.status:this.status,statusText:n.statusText||this.statusText,url:n.url||this.url||void 0,redirected:n.redirected??this.redirected,responseType:n.responseType??this.responseType})}},Qi=class extends Za{name="HttpErrorResponse";message;error;ok=!1;constructor(n){super(n,0,"Unknown Error"),this.status>=200&&this.status<300?this.message=`Http failure during parsing for ${n.url||"(unknown url)"}`:this.message=`Http failure response for ${n.url||"(unknown url)"}: ${n.status} ${n.statusText}`,this.error=n.error||null}},B1=200;var H1=/^\)\]\}',?\n/,NX=1024*1024,OS=new C("",{factory:()=>null}),hm=(()=>{class t{fetchImpl=c(U_,{optional:!0})?.fetch??((...e)=>globalThis.fetch(...e));ngZone=c(U);destroyRef=c(Xe);maxResponseSize=c(OS);handle(e){return new le(i=>{let r=new AbortController,o=!1,a={next:l=>{l.type===Po.Response&&(o=!0),i.next(l)},error:l=>{o=!0,i.error(l)},complete:()=>{o=!0,i.complete()}};this.doRequest(e,r.signal,a).then(z_,l=>a.error(new Qi({error:l})));let s;return e.timeout&&(s=this.ngZone.runOutsideAngular(()=>setTimeout(()=>{r.signal.aborted||r.abort(new DOMException("signal timed out","TimeoutError"))},e.timeout))),()=>{s!==void 0&&clearTimeout(s),!o&&!r.signal.aborted&&r.abort()}})}async doRequest(e,i,r){let o=this.createRequestInit(e),a;try{let re=this.ngZone.runOutsideAngular(()=>this.fetchImpl(e.urlWithParams,b({signal:i},o)));U1(re),r.next({type:Po.Sent}),a=await re}catch(re){r.error(new Qi({error:re,status:re.status??0,statusText:re.statusText,url:e.urlWithParams,headers:re.headers}));return}let s=new Ki(a.headers),l=a.statusText,d=a.url||e.urlWithParams,u=a.status,h=null,_=e.reportProgress||e.reportDownloadProgress;if(_&&r.next(new fm({headers:s,status:u,statusText:l,url:d})),a.body){let re=a.headers.get(B_)??"",oe=a.headers.get("content-length"),Qe=oe!==null?Number(oe):NaN;this.maxResponseSize!==null&&Number.isFinite(Qe)&&Qe>this.maxResponseSize&&(await a.body.cancel(),TS(this.maxResponseSize));let Tt=[],qs=a.body.getReader(),cr=0,Ys,Zs,na=typeof Zone<"u"&&Zone.current,dr=!1;if(await this.ngZone.runOutsideAngular(async()=>{for(;;){if(this.destroyRef.destroyed){await qs.cancel(),dr=!0;break}let{done:vh,value:bh}=await qs.read();if(vh)break;if(Tt.push(bh),cr+=bh.length,this.maxResponseSize!==null&&cr>this.maxResponseSize&&(await qs.cancel(),TS(this.maxResponseSize)),_){Zs=e.responseType==="text"?(Zs??"")+(Ys??=kS(re)).decode(bh,{stream:!0}):void 0;let Mb=()=>r.next({type:Po.DownloadProgress,total:Number.isFinite(Qe)?Qe:void 0,loaded:cr,partialText:Zs});na?na.run(Mb):Mb()}}}),dr){r.complete();return}let OM=this.concatChunks(Tt,cr);try{h=this.parseBody(e,OM,re,u)}catch(vh){r.error(new Qi({error:vh,headers:new Ki(a.headers),status:a.status,statusText:a.statusText,url:a.url||e.urlWithParams}));return}}u===0&&(u=h?B1:0);let v=u>=200&&u<300,x=a.redirected,A=a.type;v?(r.next(new ic({body:h,headers:s,status:u,statusText:l,url:d,redirected:x,responseType:A})),r.complete()):r.error(new Qi({error:h,headers:s,status:u,statusText:l,url:d,redirected:x,responseType:A}))}parseBody(e,i,r,o){switch(e.responseType){case"json":let a=new TextDecoder().decode(i).replace(H1,"");if(a==="")return null;try{return JSON.parse(a)}catch(s){if(o<200||o>=300)return a;throw s}case"text":return kS(r).decode(i);case"blob":return new Blob([i],{type:r});case"arraybuffer":return i.buffer}}createRequestInit(e){if(e.reportUploadProgress)throw new H(2824,!1);let i={},r;if(r=e.credentials,e.withCredentials&&(r="include"),e.headers.forEach((o,a)=>i[o]=a.join(",")),e.headers.has(IS)||(i[IS]=V1),!e.headers.has(B_)){let o=e.detectContentTypeHeader();o!==null&&(i[B_]=o)}return{body:e.serializeBody(),method:e.method,headers:i,credentials:r,keepalive:e.keepalive,cache:e.cache,priority:e.priority,mode:e.mode,redirect:e.redirect,referrer:e.referrer,integrity:e.integrity,referrerPolicy:e.referrerPolicy}}concatChunks(e,i){let r=new Uint8Array(i),o=0;for(let a of e)r.set(a,o),o+=a.length;return r}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),U_=class{};function z_(){}function U1(t){t.then(z_,z_)}function TS(t){throw new H(-2825,!1)}var z1=/charset=\s*["']?([^;"'\s]+)["']?/i;function kS(t){let n=t.match(z1);if(n!==null)try{return new TextDecoder(n[1])}catch{}return new TextDecoder}var $1=new C("",{factory:()=>!0}),W1="XSRF-TOKEN",G1=new C("",{factory:()=>W1}),q1="X-XSRF-TOKEN",Y1=new C("",{factory:()=>q1}),Z1=(()=>{class t{cookieName=c(G1);doc=c(K);lastCookieString="";lastToken=null;parseCount=0;getToken(){let e=this.doc.cookie||"";return e!==this.lastCookieString&&(this.parseCount++,this.lastToken=Kl(e,this.cookieName),this.lastCookieString=e),this.lastToken}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),PS=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=me({token:t,factory:function(i){let r=null;return i?r=new(i||t):r=ee(Z1),r},providedIn:"root"})}return t})();function FS(t,n){if(!c($1)||t.method==="GET"||t.method==="HEAD")return n(t);try{let r=c(Ga).href,{origin:o}=new URL(r),{origin:a}=new URL(t.url,o);if(o!==a)return n(t)}catch{return n(t)}let e=c(PS).getToken(),i=c(Y1);return e!=null&&!t.headers.has(i)&&(t=t.clone({headers:t.headers.set(i,e)})),n(t)}function Q1(t,n){return n(t)}function X1(t,n,e){return(i,r)=>Rt(e,()=>n(i,o=>t(o,r)))}var LS=new C("",{factory:()=>[FS]}),jS=new C(""),VS=new C("",{factory:()=>!0});var $_=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=me({token:t,factory:function(i){let r=null;return i?r=new(i||t):r=ee(hm),r},providedIn:"root"})}return t})();var pm=(()=>{class t{backend;injector;chain=null;pendingTasks=c(Ea);contributeToStability=c(VS);constructor(e,i){this.backend=e,this.injector=i}handle(e){if(this.chain===null){let r=this.injector.get(gm,null,{skipSelf:!0}),o=r!==null&&this.backend===r,a=this.injector.get(jS,[],o?{self:!0}:void 0),s=Array.from(new Set([...this.injector.get(LS),...a]));this.chain=s.reduceRight((l,d)=>X1(l,d,this.injector),Q1)}let i=this.chain;if(this.contributeToStability){let r=this.pendingTasks.add();return Ee(()=>i(e,o=>this.backend.handle(o))).pipe(lo(r))}else return Ee(()=>i(e,r=>this.backend.handle(r)))}static \u0275fac=function(i){return new(i||t)(ee($_),ee(We))};static \u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),gm=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=me({token:t,factory:function(i){let r=null;return i?r=new(i||t):r=ee(pm),r},providedIn:"root"})}return t})();function H_(t,n){return b({body:n},t)}var Qa=(()=>{class t{handler;constructor(e){this.handler=e}request(e,i,r={}){let o;if(e instanceof Ya)o=e;else{let l;r.headers instanceof Ki?l=r.headers:l=new Ki(r.headers);let d;r.params&&(r.params instanceof Xi?d=r.params:d=new Xi({fromObject:r.params})),o=new Ya(e,i,r.body!==void 0?r.body:null,{headers:l,context:r.context,params:d,reportProgress:r.reportProgress,reportUploadProgress:r.reportUploadProgress,reportDownloadProgress:r.reportDownloadProgress,responseType:r.responseType||"json",withCredentials:r.withCredentials,transferCache:r.transferCache,keepalive:r.keepalive,priority:r.priority,cache:r.cache,mode:r.mode,redirect:r.redirect,credentials:r.credentials,referrer:r.referrer,referrerPolicy:r.referrerPolicy,integrity:r.integrity,timeout:r.timeout})}let a=ne(o).pipe(so(l=>this.handler.handle(l)));if(e instanceof Ya||r.observe==="events")return a;let s=a.pipe(ue(l=>l instanceof ic));switch(r.observe||"body"){case"body":switch(o.responseType){case"arraybuffer":return s.pipe(J(l=>{if(l.body!==null&&!(l.body instanceof ArrayBuffer))throw new H(2806,!1);return l.body}));case"blob":return s.pipe(J(l=>{if(l.body!==null&&!(l.body instanceof Blob))throw new H(2807,!1);return l.body}));case"text":return s.pipe(J(l=>{if(l.body!==null&&typeof l.body!="string")throw new H(2808,!1);return l.body}));default:return s.pipe(J(l=>l.body))}case"response":return s;default:throw new H(2809,!1)}}delete(e,i={}){return this.request("DELETE",e,i)}get(e,i={}){return this.request("GET",e,i)}head(e,i={}){return this.request("HEAD",e,i)}jsonp(e,i){return this.request("JSONP",e,{params:new Xi().append(i,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(e,i={}){return this.request("OPTIONS",e,i)}patch(e,i,r={}){return this.request("PATCH",e,H_(r,i))}post(e,i,r={}){return this.request("POST",e,H_(r,i))}put(e,i,r={}){return this.request("PUT",e,H_(r,i))}static \u0275fac=function(i){return new(i||t)(ee(gm))};static \u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function W_(...t){let n=[Qa,hm,pm,{provide:gm,useExisting:pm},{provide:$_,useFactory:()=>c(hm)},{provide:LS,useValue:FS,multi:!0}];for(let e of t)n.push(...e.\u0275providers);return gi(n)}var BS=(()=>{class t{_doc;constructor(e){this._doc=e}getTitle(){return this._doc.title}setTitle(e){this._doc.title=e||""}static \u0275fac=function(i){return new(i||t)(ee(K))};static \u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var rc=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=me({token:t,factory:function(i){let r=null;return i?r=new(i||t):r=ee(J1),r},providedIn:"root"})}return t})(),J1=(()=>{class t extends rc{_doc=c(K);sanitize(e,i){if(i==null)return null;switch(e){case ke.NONE:return i;case ke.HTML:return qi(i,"HTML")?On(i):zg(this._doc,String(i)).toString();case ke.STYLE:return qi(i,"Style")?On(i):i;case ke.SCRIPT:if(qi(i,"Script"))return On(i);throw new H(5200,!1);case ke.URL:return qi(i,"URL")?On(i):Ll(String(i));case ke.RESOURCE_URL:if(qi(i,"ResourceURL"))return On(i);throw new H(-5201,!1);default:throw new H(5202,!1)}}bypassSecurityTrustHtml(e){return jg(e)}bypassSecurityTrustStyle(e){return Vg(e)}bypassSecurityTrustScript(e){return Bg(e)}bypassSecurityTrustUrl(e){return Hg(e)}bypassSecurityTrustResourceUrl(e){return Ug(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var be="primary",vc=Symbol("RouteTitle"),Q_=class{params;constructor(n){this.params=n||{}}has(n){return Object.hasOwn(this.params,n)}get(n){if(this.has(n)){let e=this.params[n];return Array.isArray(e)?e[0]:e}return null}getAll(n){if(this.has(n)){let e=this.params[n];return Array.isArray(e)?e:[e]}return[]}get keys(){return Object.keys(this.params)}};function Lo(t){return new Q_(t)}function G_(t,n,e){for(let i=0;i<t.length;i++){let r=t[i],o=n[i];if(r[0]===":")e[r.substring(1)]=o;else if(r!==o.path)return!1}return!0}function YS(t,n,e){let i=e.path.split("/"),r=i.indexOf("**");if(r===-1){if(i.length>t.length||e.pathMatch==="full"&&(n.hasChildren()||i.length<t.length))return null;let l={},d=t.slice(0,i.length);return G_(i,d,l)?{consumed:d,posParams:l}:null}if(r!==i.lastIndexOf("**"))return null;let o=i.slice(0,r),a=i.slice(r+1);if(o.length+a.length>t.length||e.pathMatch==="full"&&n.hasChildren()&&e.path!=="**")return null;let s={};return!G_(o,t.slice(0,o.length),s)||!G_(a,t.slice(t.length-a.length),s)?null:{consumed:t,posParams:s}}function wm(t){return new Promise((n,e)=>{t.pipe(Vi()).subscribe({next:i=>n(i),error:i=>e(i)})})}function tO(t,n){if(t.length!==n.length)return!1;for(let e=0;e<t.length;++e)if(!Mi(t[e],n[e]))return!1;return!0}function Mi(t,n){let e=t?X_(t):void 0,i=n?X_(n):void 0;if(!e||!i||e.length!=i.length)return!1;let r;for(let o=0;o<e.length;o++)if(r=e[o],!ZS(t[r],n[r]))return!1;return!0}function X_(t){return[...Object.keys(t),...Object.getOwnPropertySymbols(t)]}function ZS(t,n){if(Array.isArray(t)&&Array.isArray(n)){if(t.length!==n.length)return!1;let e=[...t].sort(),i=[...n].sort();return e.every((r,o)=>i[o]===r)}else return t===n}function nO(t){return t.length>0?t[t.length-1]:null}function Ho(t){return nl(t)?t:Zi(t)?st(Promise.resolve(t)):ne(t)}function QS(t){return nl(t)?wm(t):Promise.resolve(t)}var iO={exact:KS,subset:JS},XS={exact:rO,subset:oO,ignored:()=>!0},mv={paths:"exact",fragment:"ignored",matrixParams:"ignored",queryParams:"exact"},es={paths:"subset",fragment:"ignored",matrixParams:"ignored",queryParams:"subset"};function fv(t,n,e){let i=t instanceof on?t:n.parseUrl(t);return De(()=>K_(n.lastSuccessfulNavigation()?.finalUrl??new on,i,b(b({},es),e)))}function K_(t,n,e){return iO[e.paths](t.root,n.root,e.matrixParams)&&XS[e.queryParams](t.queryParams,n.queryParams)&&!(e.fragment==="exact"&&t.fragment!==n.fragment)}function rO(t,n){return Mi(t,n)}function KS(t,n,e){if(!Fo(t.segments,n.segments)||!bm(t.segments,n.segments,e)||t.numberOfChildren!==n.numberOfChildren)return!1;for(let i in n.children)if(!t.children[i]||!KS(t.children[i],n.children[i],e))return!1;return!0}function oO(t,n){return Object.keys(n).length<=Object.keys(t).length&&Object.keys(n).every(e=>ZS(t[e],n[e]))}function JS(t,n,e){return ex(t,n,n.segments,e)}function ex(t,n,e,i){if(t.segments.length>e.length){let r=t.segments.slice(0,e.length);return!(!Fo(r,e)||n.hasChildren()||!bm(r,e,i))}else if(t.segments.length===e.length){if(!Fo(t.segments,e)||!bm(t.segments,e,i))return!1;for(let r in n.children)if(!t.children[r]||!JS(t.children[r],n.children[r],i))return!1;return!0}else{let r=e.slice(0,t.segments.length),o=e.slice(t.segments.length);return!Fo(t.segments,r)||!bm(t.segments,r,i)||!t.children[be]?!1:ex(t.children[be],n,o,i)}}function bm(t,n,e){return n.every((i,r)=>XS[e](t[r].parameters,i.parameters))}var on=class{root;queryParams;fragment;_queryParamMap;constructor(n=new Ve([],{}),e={},i=null){this.root=n,this.queryParams=e,this.fragment=i}get queryParamMap(){return this._queryParamMap??=Lo(this.queryParams),this._queryParamMap}toString(){return lO.serialize(this)}},Ve=class{segments;children;parent=null;constructor(n,e){this.segments=n,this.children=e,Object.values(e).forEach(i=>i.parent=this)}hasChildren(){return this.numberOfChildren>0}get numberOfChildren(){return Object.keys(this.children).length}toString(){return ym(this)}},Ar=class{path;parameters;_parameterMap;constructor(n,e){this.path=n,this.parameters=e}get parameterMap(){return this._parameterMap??=Lo(this.parameters),this._parameterMap}toString(){return nx(this)}};function aO(t,n){return Fo(t,n)&&t.every((e,i)=>Mi(e.parameters,n[i].parameters))}function Fo(t,n){return t.length!==n.length?!1:t.every((e,i)=>e.path===n[i].path)}function sO(t,n){let e=[];return Object.entries(t.children).forEach(([i,r])=>{i===be&&(e=e.concat(n(r,i)))}),Object.entries(t.children).forEach(([i,r])=>{i!==be&&(e=e.concat(n(r,i)))}),e}var as=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:()=>new Rr})}return t})(),Rr=class{parse(n){let e=new ev(n);return new on(e.parseRootSegment(),e.parseQueryParams(),e.parseFragment())}serialize(n){let e=`/${oc(n.root,!0)}`,i=uO(n.queryParams),r=typeof n.fragment=="string"?`#${cO(n.fragment)}`:"";return`${e}${i}${r}`}},lO=new Rr;function ym(t){return t.segments.map(n=>nx(n)).join("/")}function oc(t,n){if(!t.hasChildren())return ym(t);if(n){let e=t.children[be]?oc(t.children[be],!1):"",i=[];return Object.entries(t.children).forEach(([r,o])=>{r!==be&&i.push(`${r}:${oc(o,!1)}`)}),i.length>0?`${e}(${i.join("//")})`:e}else{let e=sO(t,(i,r)=>r===be?[oc(t.children[be],!1)]:[`${r}:${oc(i,!1)}`]);return Object.keys(t.children).length===1&&t.children[be]!=null?`${ym(t)}/${e[0]}`:`${ym(t)}/(${e.join("//")})`}}function tx(t){return encodeURIComponent(t).replace(/%40/g,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",")}function _m(t){return tx(t).replace(/%3B/gi,";")}function cO(t){return encodeURI(t)}function J_(t){return tx(t).replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/%26/gi,"&")}function Cm(t){return decodeURIComponent(t)}function US(t){return Cm(t.replace(/\+/g,"%20"))}function nx(t){return`${J_(t.path)}${dO(t.parameters)}`}function dO(t){return Object.entries(t).map(([n,e])=>`;${J_(n)}=${J_(e)}`).join("")}function uO(t){let n=Object.entries(t).map(([e,i])=>Array.isArray(i)?i.map(r=>`${_m(e)}=${_m(r)}`).join("&"):`${_m(e)}=${_m(i)}`).filter(e=>e);return n.length?`?${n.join("&")}`:""}var mO=/^[^\/()?;#]+/;function q_(t){let n=t.match(mO);return n?n[0]:""}var fO=/^[^\/()?;=#]+/;function hO(t){let n=t.match(fO);return n?n[0]:""}var pO=/^[^=?&#]+/;function gO(t){let n=t.match(pO);return n?n[0]:""}var _O=/^[^&#]+/;function vO(t){let n=t.match(_O);return n?n[0]:""}var ev=class{url;remaining;constructor(n){this.url=n,this.remaining=n}parseRootSegment(){for(;this.consumeOptional("/"););return this.remaining===""||this.peekStartsWith("?")||this.peekStartsWith("#")?new Ve([],{}):new Ve([],this.parseChildren())}parseQueryParams(){let n={};if(this.consumeOptional("?"))do this.parseQueryParam(n);while(this.consumeOptional("&"));return n}parseFragment(){return this.consumeOptional("#")?decodeURIComponent(this.remaining):null}parseChildren(n=0){if(n>50)throw new H(4010,!1);if(this.remaining==="")return{};this.consumeOptional("/");let e=[];for(this.peekStartsWith("(")||e.push(this.parseSegment());this.peekStartsWith("/")&&!this.peekStartsWith("//")&&!this.peekStartsWith("/(");)this.capture("/"),e.push(this.parseSegment());let i={};this.peekStartsWith("/(")&&(this.capture("/"),i=this.parseParens(!0,n));let r={};return this.peekStartsWith("(")&&(r=this.parseParens(!1,n)),(e.length>0||Object.keys(i).length>0)&&(r[be]=new Ve(e,i)),r}parseSegment(){let n=q_(this.remaining);if(n===""&&this.peekStartsWith(";"))throw new H(4009,!1);return this.capture(n),new Ar(Cm(n),this.parseMatrixParams())}parseMatrixParams(){let n={};for(;this.consumeOptional(";");)this.parseParam(n);return n}parseParam(n){let e=hO(this.remaining);if(!e)return;this.capture(e);let i="";if(this.consumeOptional("=")){let r=q_(this.remaining);r&&(i=r,this.capture(i))}n[Cm(e)]=Cm(i)}parseQueryParam(n){let e=gO(this.remaining);if(!e)return;this.capture(e);let i="";if(this.consumeOptional("=")){let a=vO(this.remaining);a&&(i=a,this.capture(i))}let r=US(e),o=US(i);if(Object.hasOwn(n,r)){let a=n[r];Array.isArray(a)||(a=[a],n[r]=a),a.push(o)}else n[r]=o}parseParens(n,e){let i=Object.create(null);for(this.capture("(");!this.consumeOptional(")")&&this.remaining.length>0;){let r=q_(this.remaining),o=this.remaining[r.length];if(o!=="/"&&o!==")"&&o!==";")throw new H(4010,!1);let a;r.indexOf(":")>-1?(a=r.slice(0,r.indexOf(":")),this.capture(a),this.capture(":")):n&&(a=be);let s=this.parseChildren(e+1);i[a??be]=Object.keys(s).length===1&&s[be]?s[be]:new Ve([],s),this.consumeOptional("//")}return i}peekStartsWith(n){return this.remaining.startsWith(n)}consumeOptional(n){return this.peekStartsWith(n)?(this.remaining=this.remaining.substring(n.length),!0):!1}capture(n){if(!this.consumeOptional(n))throw new H(4011,!1)}};function ix(t){return t.segments.length>0?new Ve([],{[be]:t}):t}function rx(t){let n=Object.create(null);for(let[i,r]of Object.entries(t.children)){let o=rx(r);if(i===be&&o.segments.length===0&&o.hasChildren())for(let[a,s]of Object.entries(o.children))n[a]=s;else(o.segments.length>0||o.hasChildren())&&(n[i]=o)}let e=new Ve(t.segments,n);return bO(e)}function bO(t){if(t.numberOfChildren===1&&t.children[be]){let n=t.children[be];return new Ve(t.segments.concat(n.segments),n.children)}return t}function Or(t){return t instanceof on}function ox(t,n,e=null,i=null,r=new Rr){let o=ax(t);return sx(o,n,e,i,r)}function ax(t){let n;function e(o){let a={};for(let l of o.children){let d=e(l);a[l.outlet]=d}let s=new Ve(o.url,a);return o===t&&(n=s),s}let i=e(t.root),r=ix(i);return n??r}function sx(t,n,e,i,r){let o=t;for(;o.parent;)o=o.parent;if(n.length===0)return Y_(o,o,o,e,i,r);let a=yO(n);if(a.toRoot())return Y_(o,o,new Ve([],{}),e,i,r);let s=CO(a,o,t),l=s.processChildren?sc(s.segmentGroup,s.index,a.commands):cx(s.segmentGroup,s.index,a.commands);return Y_(o,s.segmentGroup,l,e,i,r)}function Sm(t){return typeof t=="object"&&t!=null&&!t.outlets&&!t.segmentPath}function dc(t){return typeof t=="object"&&t!=null&&t.outlets}function zS(t,n,e){t||="\u0275";let i=new on;return i.queryParams={[t]:n},e.parse(e.serialize(i)).queryParams[t]}function Y_(t,n,e,i,r,o){let a={};for(let[d,u]of Object.entries(i??{}))a[d]=Array.isArray(u)?u.map(h=>zS(d,h,o)):zS(d,u,o);let s;t===n?s=e:s=lx(t,n,e);let l=ix(rx(s));return new on(l,a,r)}function lx(t,n,e){let i=Object.create(null);return Object.entries(t.children).forEach(([r,o])=>{o===n?i[r]=e:i[r]=lx(o,n,e)}),new Ve(t.segments,i)}var xm=class{isAbsolute;numberOfDoubleDots;commands;constructor(n,e,i){if(this.isAbsolute=n,this.numberOfDoubleDots=e,this.commands=i,n&&i.length>0&&Sm(i[0]))throw new H(4003,!1);let r=i.find(dc);if(r&&r!==nO(i))throw new H(4004,!1)}toRoot(){return this.isAbsolute&&this.commands.length===1&&this.commands[0]=="/"}};function yO(t){if(typeof t[0]=="string"&&t.length===1&&t[0]==="/")return new xm(!0,0,t);let n=0,e=!1,i=t.reduce((r,o,a)=>{if(typeof o=="object"&&o!=null){if(o.outlets){let s={};return Object.entries(o.outlets).forEach(([l,d])=>{s[l]=typeof d=="string"?d.split("/"):d}),[...r,{outlets:s}]}if(o.segmentPath)return[...r,o.segmentPath]}return typeof o!="string"?[...r,o]:a===0?(o.split("/").forEach((s,l)=>{l==0&&s==="."||(l==0&&s===""?e=!0:s===".."?n++:s!=""&&r.push(s))}),r):[...r,o]},[]);return new xm(e,n,i)}var Ka=class{segmentGroup;processChildren;index;constructor(n,e,i){this.segmentGroup=n,this.processChildren=e,this.index=i}};function CO(t,n,e){if(t.isAbsolute)return new Ka(n,!0,0);if(!e)return new Ka(n,!1,NaN);if(e.parent===null)return new Ka(e,!0,0);let i=Sm(t.commands[0])?0:1,r=e.segments.length-1+i;return wO(e,r,t.numberOfDoubleDots)}function wO(t,n,e){let i=t,r=n,o=e;for(;o>r;){if(o-=r,i=i.parent,!i)throw new H(4005,!1);r=i.segments.length}return new Ka(i,!1,r-o)}function SO(t){return dc(t[0])?t[0].outlets:{[be]:t}}function cx(t,n,e){if(t??=new Ve([],{}),t.segments.length===0&&t.hasChildren())return sc(t,n,e);let i=xO(t,n,e),r=e.slice(i.commandIndex);if(i.match&&i.pathIndex<t.segments.length){let o=new Ve(t.segments.slice(0,i.pathIndex),{});return o.children[be]=new Ve(t.segments.slice(i.pathIndex),t.children),sc(o,0,r)}else return i.match&&r.length===0?new Ve(t.segments,{}):i.match&&!t.hasChildren()?tv(t,n,e):i.match?sc(t,0,r):tv(t,n,e)}function sc(t,n,e){if(e.length===0)return new Ve(t.segments,{});{let i=SO(e),r=Object.create(null);if(Object.keys(i).some(o=>o!==be)&&t.children[be]&&t.numberOfChildren===1&&t.children[be].segments.length===0){let o=sc(t.children[be],n,e);return new Ve(t.segments,o.children)}return Object.entries(i).forEach(([o,a])=>{typeof a=="string"&&(a=[a]),a!==null&&(r[o]=cx(t.children[o],n,a))}),Object.entries(t.children).forEach(([o,a])=>{i[o]===void 0&&(r[o]=a)}),new Ve(t.segments,r)}}function xO(t,n,e){let i=0,r=n,o={match:!1,pathIndex:0,commandIndex:0};for(;r<t.segments.length;){if(i>=e.length)return o;let a=t.segments[r],s=e[i];if(dc(s))break;let l=`${s}`,d=i<e.length-1?e[i+1]:null;if(r>0&&l===void 0)break;if(l&&d&&typeof d=="object"&&d.outlets===void 0){if(!WS(l,d,a))return o;i+=2}else{if(!WS(l,{},a))return o;i++}r++}return{match:!0,pathIndex:r,commandIndex:i}}function tv(t,n,e){let i=t.segments.slice(0,n),r=0;for(;r<e.length;){let o=e[r];if(dc(o)){let l=DO(o.outlets);return new Ve(i,l)}if(r===0&&Sm(e[0])){let l=t.segments[n];i.push(new Ar(l.path,$S(e[0]))),r++;continue}let a=dc(o)?o.outlets[be]:`${o}`,s=r<e.length-1?e[r+1]:null;a&&s&&Sm(s)?(i.push(new Ar(a,$S(s))),r+=2):(i.push(new Ar(a,{})),r++)}return new Ve(i,{})}function DO(t){let n={};return Object.entries(t).forEach(([e,i])=>{typeof i=="string"&&(i=[i]),i!==null&&(n[e]=tv(new Ve([],{}),0,i))}),n}function $S(t){let n={};return Object.entries(t).forEach(([e,i])=>n[e]=`${i}`),n}function WS(t,n,e){return t==e.path&&Mi(n,e.parameters)}var lc="imperative",jt=(function(t){return t[t.NavigationStart=0]="NavigationStart",t[t.NavigationEnd=1]="NavigationEnd",t[t.NavigationCancel=2]="NavigationCancel",t[t.NavigationError=3]="NavigationError",t[t.RoutesRecognized=4]="RoutesRecognized",t[t.ResolveStart=5]="ResolveStart",t[t.ResolveEnd=6]="ResolveEnd",t[t.GuardsCheckStart=7]="GuardsCheckStart",t[t.GuardsCheckEnd=8]="GuardsCheckEnd",t[t.RouteConfigLoadStart=9]="RouteConfigLoadStart",t[t.RouteConfigLoadEnd=10]="RouteConfigLoadEnd",t[t.ChildActivationStart=11]="ChildActivationStart",t[t.ChildActivationEnd=12]="ChildActivationEnd",t[t.ActivationStart=13]="ActivationStart",t[t.ActivationEnd=14]="ActivationEnd",t[t.Scroll=15]="Scroll",t[t.NavigationSkipped=16]="NavigationSkipped",t})(jt||{}),Sn=class{id;url;constructor(n,e){this.id=n,this.url=e}},jo=class extends Sn{type=jt.NavigationStart;navigationTrigger;restoredState;constructor(n,e,i="imperative",r=null){super(n,e),this.navigationTrigger=i,this.restoredState=r}toString(){return`NavigationStart(id: ${this.id}, url: '${this.url}')`}},xn=class extends Sn{urlAfterRedirects;type=jt.NavigationEnd;constructor(n,e,i){super(n,e),this.urlAfterRedirects=i}toString(){return`NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`}},Gt=(function(t){return t[t.Redirect=0]="Redirect",t[t.SupersededByNewNavigation=1]="SupersededByNewNavigation",t[t.NoDataFromResolver=2]="NoDataFromResolver",t[t.GuardRejected=3]="GuardRejected",t[t.Aborted=4]="Aborted",t})(Gt||{}),uc=(function(t){return t[t.IgnoredSameUrlNavigation=0]="IgnoredSameUrlNavigation",t[t.IgnoredByUrlHandlingStrategy=1]="IgnoredByUrlHandlingStrategy",t})(uc||{}),Ln=class extends Sn{reason;code;type=jt.NavigationCancel;constructor(n,e,i,r){super(n,e),this.reason=i,this.code=r}toString(){return`NavigationCancel(id: ${this.id}, url: '${this.url}')`}};function dx(t){return t instanceof Ln&&(t.code===Gt.Redirect||t.code===Gt.SupersededByNewNavigation)}var er=class extends Sn{reason;code;type=jt.NavigationSkipped;constructor(n,e,i,r){super(n,e),this.reason=i,this.code=r}},Vo=class extends Sn{error;target;type=jt.NavigationError;constructor(n,e,i,r){super(n,e),this.error=i,this.target=r}toString(){return`NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`}},mc=class extends Sn{urlAfterRedirects;state;type=jt.RoutesRecognized;constructor(n,e,i,r){super(n,e),this.urlAfterRedirects=i,this.state=r}toString(){return`RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}},Dm=class extends Sn{urlAfterRedirects;state;type=jt.GuardsCheckStart;constructor(n,e,i,r){super(n,e),this.urlAfterRedirects=i,this.state=r}toString(){return`GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}},Em=class extends Sn{urlAfterRedirects;state;shouldActivate;type=jt.GuardsCheckEnd;constructor(n,e,i,r,o){super(n,e),this.urlAfterRedirects=i,this.state=r,this.shouldActivate=o}toString(){return`GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`}},Mm=class extends Sn{urlAfterRedirects;state;type=jt.ResolveStart;constructor(n,e,i,r){super(n,e),this.urlAfterRedirects=i,this.state=r}toString(){return`ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}},Nm=class extends Sn{urlAfterRedirects;state;type=jt.ResolveEnd;constructor(n,e,i,r){super(n,e),this.urlAfterRedirects=i,this.state=r}toString(){return`ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}},Im=class{route;type=jt.RouteConfigLoadStart;constructor(n){this.route=n}toString(){return`RouteConfigLoadStart(path: ${this.route.path})`}},Tm=class{route;type=jt.RouteConfigLoadEnd;constructor(n){this.route=n}toString(){return`RouteConfigLoadEnd(path: ${this.route.path})`}},km=class{snapshot;type=jt.ChildActivationStart;constructor(n){this.snapshot=n}toString(){return`ChildActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`}},Am=class{snapshot;type=jt.ChildActivationEnd;constructor(n){this.snapshot=n}toString(){return`ChildActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`}},Rm=class{snapshot;type=jt.ActivationStart;constructor(n){this.snapshot=n}toString(){return`ActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`}},Om=class{snapshot;type=jt.ActivationEnd;constructor(n){this.snapshot=n}toString(){return`ActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`}};var ts=class{},fc=class{},ns=class{url;navigationBehaviorOptions;constructor(n,e){this.url=n,this.navigationBehaviorOptions=e}};function EO(t){return!(t instanceof ts)&&!(t instanceof ns)&&!(t instanceof fc)}var Pm=class{rootInjector;outlet=null;route=null;children;attachRef=null;get injector(){return this.route?.snapshot._environmentInjector??this.rootInjector}constructor(n){this.rootInjector=n,this.children=new Bo(this.rootInjector)}resetChildren(){this.children=new Bo(this.rootInjector)}},Bo=(()=>{class t{rootInjector;contexts=new Map;constructor(e){this.rootInjector=e}onChildOutletCreated(e,i){let r=this.getOrCreateContext(e);r.outlet=i,this.contexts.set(e,r)}onChildOutletDestroyed(e){let i=this.getContext(e);i&&(i.outlet=null,i.attachRef=null)}onOutletDeactivated(){let e=this.contexts;return this.contexts=new Map,e}onOutletReAttached(e){this.contexts=e}getOrCreateContext(e){let i=this.getContext(e);return i||(i=new Pm(this.rootInjector),this.contexts.set(e,i)),i}getContext(e){return this.contexts.get(e)||null}static \u0275fac=function(i){return new(i||t)(ee(We))};static \u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),Fm=class{_root;constructor(n){this._root=n}get root(){return this._root.value}parent(n){let e=this.pathFromRoot(n);return e.length>1?e[e.length-2]:null}children(n){let e=nv(n,this._root);return e?e.children.map(i=>i.value):[]}firstChild(n){let e=nv(n,this._root);return e&&e.children.length>0?e.children[0].value:null}siblings(n){let e=iv(n,this._root);return e.length<2?[]:e[e.length-2].children.map(r=>r.value).filter(r=>r!==n)}pathFromRoot(n){return iv(n,this._root).map(e=>e.value)}};function nv(t,n){if(t===n.value)return n;for(let e of n.children){let i=nv(t,e);if(i)return i}return null}function iv(t,n){if(t===n.value)return[n];for(let e of n.children){let i=iv(t,e);if(i.length)return i.unshift(n),i}return[]}var wn=class{value;children;constructor(n,e){this.value=n,this.children=e}toString(){return`TreeNode(${this.value})`}};function Xa(t){let n={};return t&&t.children.forEach(e=>n[e.value.outlet]=e),n}var hc=class extends Fm{snapshot;constructor(n,e){super(n),this.snapshot=e,pv(this,n)}toString(){return this.snapshot.toString()}};function ux(t,n){let e=MO(t,n),i=new Et([new Ar("",{})]),r=new Et({}),o=new Et({}),a=new Et({}),s=new Et(""),l=new Dn(i,r,a,s,o,be,t,e.root);return l.snapshot=e.root,new hc(new wn(l,[]),e)}function MO(t,n){let e={},i={},r={},a=new is([],e,r,"",i,be,t,null,{},n);return new pc("",new wn(a,[]))}var Dn=class{urlSubject;paramsSubject;queryParamsSubject;fragmentSubject;dataSubject;outlet;component;snapshot;_futureSnapshot;_routerState;_paramMap;_queryParamMap;title;url;params;queryParams;fragment;data;resources;_localInjector;pending;paramsSignal;queryParamsSignal;paramMapSignal;queryParamMapSignal;fragmentSignal;dataSignal;constructor(n,e,i,r,o,a,s,l){this.urlSubject=n,this.paramsSubject=e,this.queryParamsSubject=i,this.fragmentSubject=r,this.dataSubject=o,this.outlet=a,this.component=s,this._futureSnapshot=l,this.title=this.dataSubject?.pipe(J(d=>d[vc]))??ne(void 0),this.url=n,this.params=e,this.queryParams=i,this.fragment=r,this.data=o}get routeConfig(){return this._futureSnapshot.routeConfig}get root(){return this._routerState.root}get parent(){return this._routerState.parent(this)}get firstChild(){return this._routerState.firstChild(this)}get children(){return this._routerState.children(this)}get pathFromRoot(){return this._routerState.pathFromRoot(this)}get paramMap(){return this._paramMap??=this.params.pipe(J(n=>Lo(n))),this._paramMap}get queryParamMap(){return this._queryParamMap??=this.queryParams.pipe(J(n=>Lo(n))),this._queryParamMap}toString(){return this.snapshot?this.snapshot.toString():`Future(${this._futureSnapshot})`}_setPending(n){this._futureSnapshot=n,this.pending?.set(!0)}},NO="always";function hv(t,n,e){let i,{routeConfig:r}=t;return n!==null&&(e==="always"||r?.path===""||!n.component&&!n.routeConfig?.loadComponent)?i={params:b(b({},n.params),t.params),data:b(b({},n.data),t.data),resolve:b(b(b(b({},t.data),n.data),r?.data),t._resolvedData)}:i={params:b({},t.params),data:b({},t.data),resolve:b(b({},t.data),t._resolvedData??{})},r&&fx(r)&&(i.resolve[vc]=r.title),i}var is=class{url;params;queryParams;fragment;data;outlet;component;routeConfig;_resolve;_resolvedData;_routerState;_paramMap;_queryParamMap;_environmentInjector;resources;get title(){return this.data?.[vc]}constructor(n,e,i,r,o,a,s,l,d,u){this.url=n,this.params=e,this.queryParams=i,this.fragment=r,this.data=o,this.outlet=a,this.component=s,this.routeConfig=l,this._resolve=d,this._environmentInjector=u}get root(){return this._routerState.root}get parent(){return this._routerState.parent(this)}get firstChild(){return this._routerState.firstChild(this)}get children(){return this._routerState.children(this)}get pathFromRoot(){return this._routerState.pathFromRoot(this)}get paramMap(){return this._paramMap??=Lo(this.params),this._paramMap}get queryParamMap(){return this._queryParamMap??=Lo(this.queryParams),this._queryParamMap}toString(){let n=this.url.map(i=>i.toString()).join("/"),e=this.routeConfig?this.routeConfig.path:"";return`Route(url:'${n}', path:'${e}')`}},pc=class extends Fm{url;constructor(n,e){super(e),this.url=n,pv(this,e)}toString(){return mx(this._root)}};function pv(t,n){n.value._routerState=t,n.children.forEach(e=>pv(t,e))}function mx(t){let n=t.children.length>0?` { ${t.children.map(mx).join(", ")} } `:"";return`${t.value}${n}`}function Z_(t){if(t.snapshot){let n=t.snapshot,e=t._futureSnapshot;t.snapshot=e,Mi(n.queryParams,e.queryParams)||t.queryParamsSubject.next(e.queryParams),n.fragment!==e.fragment&&t.fragmentSubject.next(e.fragment),Mi(n.params,e.params)||t.paramsSubject.next(e.params),tO(n.url,e.url)||t.urlSubject.next(e.url),Mi(n.data,e.data)||t.dataSubject.next(e.data)}else t.snapshot=t._futureSnapshot,t.dataSubject.next(t._futureSnapshot.data)}function rv(t,n){let e=Mi(t.params,n.params)&&aO(t.url,n.url),i=!t.parent!=!n.parent;return e&&!i&&(!t.parent||rv(t.parent,n.parent))}function fx(t){return typeof t.title=="string"||t.title===null}var hx=new C(""),bc=(()=>{class t{activated=null;get activatedComponentRef(){return this.activated}_activatedRoute=null;name=be;activateEvents=new O;deactivateEvents=new O;attachEvents=new O;detachEvents=new O;routerOutletData=rn();parentContexts=c(Bo);location=c(ht);changeDetector=c(Me);inputBinder=c(Bm,{optional:!0});supportsBindingToComponentInputs=!0;ngOnChanges(e){if(e.name){let{firstChange:i,previousValue:r}=e.name;if(i)return;this.isTrackedInParentContexts(r)&&(this.deactivate(),this.parentContexts.onChildOutletDestroyed(r)),this.initializeOutletWithName()}}ngOnDestroy(){this.isTrackedInParentContexts(this.name)&&this.parentContexts.onChildOutletDestroyed(this.name),this.inputBinder?.unsubscribeFromRouteData(this)}isTrackedInParentContexts(e){return this.parentContexts.getContext(e)?.outlet===this}ngOnInit(){this.initializeOutletWithName()}initializeOutletWithName(){if(this.parentContexts.onChildOutletCreated(this.name,this),this.activated)return;let e=this.parentContexts.getContext(this.name);e?.route&&(e.attachRef?this.attach(e.attachRef,e.route):this.activateWith(e.route,e.injector))}get isActivated(){return!!this.activated}get component(){if(!this.activated)throw new H(4012,!1);return this.activated.instance}get activatedRoute(){if(!this.activated)throw new H(4012,!1);return this._activatedRoute}get activatedRouteData(){return this._activatedRoute?this._activatedRoute.snapshot.data:{}}detach(){if(!this.activated)throw new H(4012,!1);this.location.detach();let e=this.activated;return this.activated=null,this._activatedRoute=null,this.detachEvents.emit(e.instance),e}attach(e,i){this.activated=e,this._activatedRoute=i,this.location.insert(e.hostView),this.inputBinder?.bindActivatedRouteToOutletComponent(this,this.location.injector),this.attachEvents.emit(e.instance)}deactivate(){if(this.activated){let e=this.component;this.activated.destroy(),this.activated=null,this._activatedRoute=null,this.deactivateEvents.emit(e)}}activateWith(e,i){if(this.isActivated)throw new H(4013,!1);this._activatedRoute=e;let r=this.location,a=e.snapshot.component,s=this.parentContexts.getOrCreateContext(this.name).children,l=new ov(e,s,r.injector,this.routerOutletData);this.activated=r.createComponent(a,{index:r.length,injector:l,environmentInjector:i}),this.changeDetector.markForCheck(),this.inputBinder?.bindActivatedRouteToOutletComponent(this,this.location.injector),this.activateEvents.emit(this.activated.instance)}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["router-outlet"]],inputs:{name:"name",routerOutletData:[1,"routerOutletData"]},outputs:{activateEvents:"activate",deactivateEvents:"deactivate",attachEvents:"attach",detachEvents:"detach"},exportAs:["outlet"],features:[Ae]})}return t})(),ov=class{route;childContexts;parent;outletData;constructor(n,e,i,r){this.route=n,this.childContexts=e,this.parent=i,this.outletData=r}get(n,e){return n===Dn?this.route:n===Bo?this.childContexts:n===hx?this.outletData:this.parent.get(n,e)}},Bm=new C("");var gv=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["ng-component"]],exportAs:["emptyRouterOutlet"],decls:1,vars:0,template:function(i,r){i&1&&j(0,"router-outlet")},dependencies:[bc],encapsulation:2,changeDetection:1})}return t})();function _v(t){let n=t.children&&t.children.map(_v),e=n?V(b({},t),{children:n}):b({},t);return!e.component&&!e.loadComponent&&(n||e.loadChildren)&&e.outlet&&e.outlet!==be&&(e.component=gv),e}function IO(t,n,e){let i=new Set,r=gc(t,n._root,e?e._root:void 0,i);return{newlyCreatedRoutes:i,state:new hc(r,n)}}function gc(t,n,e,i){if(e&&t.shouldReuseRoute(n.value,e.value.snapshot)){let r=e.value;r._setPending(n.value);let o=TO(t,n,e,i);return new wn(r,o)}else{if(t.shouldAttach(n.value)){let a=t.retrieve(n.value);if(a!==null){let s=a.route;return s.value._setPending(n.value),s.children=n.children.map(l=>gc(t,l,void 0,i)),s}}let r=kO(n.value);r._setPending(n.value),i.add(r);let o=n.children.map(a=>gc(t,a,void 0,i));return new wn(r,o)}}function TO(t,n,e,i){return n.children.map(r=>{for(let o of e.children)if(t.shouldReuseRoute(r.value,o.value.snapshot))return gc(t,r,o,i);return gc(t,r,void 0,i)})}function kO(t){return new Dn(new Et(t.url),new Et(t.params),new Et(t.queryParams),new Et(t.fragment),new Et(t.data),t.outlet,t.component,t)}var rs=class{redirectTo;navigationBehaviorOptions;constructor(n,e){this.redirectTo=n,this.navigationBehaviorOptions=e}},px="ngNavigationCancelingError";function Lm(t,n){let{redirectTo:e,navigationBehaviorOptions:i}=Or(n)?{redirectTo:n,navigationBehaviorOptions:void 0}:n,r=gx(!1,Gt.Redirect);return r.url=e,r.navigationBehaviorOptions=i,r}function gx(t,n){let e=new Error(`NavigationCancelingError: ${t||""}`);return e[px]=!0,e.cancellationCode=n,e}function AO(t){return _x(t)&&Or(t.url)}function _x(t){return!!t&&t[px]}var av=class{routeReuseStrategy;futureState;currState;forwardEvent;inputBindingEnabled;constructor(n,e,i,r,o){this.routeReuseStrategy=n,this.futureState=e,this.currState=i,this.forwardEvent=r,this.inputBindingEnabled=o}activate(n){let e=this.futureState._root,i=this.currState?this.currState._root:null;this.deactivateChildRoutes(e,i,n),Z_(this.futureState.root),this.activateChildRoutes(e,i,n)}deactivateChildRoutes(n,e,i){let r=Xa(e);n.children.forEach(o=>{let a=o.value.outlet;this.deactivateRoutes(o,r[a],i),delete r[a]}),Object.values(r).forEach(o=>{this.deactivateRouteAndItsChildren(o,i)})}deactivateRoutes(n,e,i){let r=n.value,o=e?e.value:null;if(r===o)if(r.component){let a=i.getContext(r.outlet);a&&this.deactivateChildRoutes(n,e,a.children)}else this.deactivateChildRoutes(n,e,i);else o&&this.deactivateRouteAndItsChildren(e,i)}deactivateRouteAndItsChildren(n,e){n.value.component&&this.routeReuseStrategy.shouldDetach(n.value.snapshot)?this.detachAndStoreRouteSubtree(n,e):this.deactivateRouteAndOutlet(n,e)}detachAndStoreRouteSubtree(n,e){let i=e.getContext(n.value.outlet),r=i&&n.value.component?i.children:e,o=Xa(n);for(let a of Object.values(o))this.deactivateRouteAndItsChildren(a,r);if(i&&i.outlet){let a=i.outlet.detach(),s=i.children.contexts;i.resetChildren(),this.routeReuseStrategy.store(n.value.snapshot,{componentRef:a,route:n,contexts:s})}}deactivateRouteAndOutlet(n,e){let i=e.getContext(n.value.outlet),r=i&&n.value.component?i.children:e,o=Xa(n);for(let a of Object.values(o))this.deactivateRouteAndItsChildren(a,r);i&&(i.outlet&&(i.outlet.deactivate(),i.children.onOutletDeactivated()),i.attachRef=null,i.route=null),n.value._localInjector?.destroy()}activateChildRoutes(n,e,i){let r=Xa(e);n.children.forEach(o=>{this.activateRoutes(o,r[o.value.outlet],i),this.forwardEvent(new Om(o.value.snapshot))}),n.children.length&&this.forwardEvent(new Am(n.value.snapshot))}activateRoutes(n,e,i){let r=n.value,o=e?e.value:null;if(Z_(r),r===o)if(r.component){let a=i.getOrCreateContext(r.outlet);this.activateChildRoutes(n,e,a.children)}else this.activateChildRoutes(n,e,i);else if(r.component){let a=i.getOrCreateContext(r.outlet);if(this.routeReuseStrategy.shouldAttach(r.snapshot)){let s=this.routeReuseStrategy.retrieve(r.snapshot);this.routeReuseStrategy.store(r.snapshot,null),a.children.onOutletReAttached(s.contexts),a.attachRef=s.componentRef,a.route=s.route.value,a.outlet&&a.outlet.attach(s.componentRef,s.route.value),Z_(s.route.value),this.activateChildRoutes(n,null,a.children)}else a.attachRef=null,a.route=r,a.outlet&&a.outlet.activateWith(r,a.injector),this.activateChildRoutes(n,null,a.children)}else this.activateChildRoutes(n,null,i)}},jm=class{path;route;constructor(n){this.path=n,this.route=this.path[this.path.length-1]}},Ja=class{component;route;constructor(n,e){this.component=n,this.route=e}};function RO(t,n,e){let i=t._root,r=n?n._root:null;return ac(i,r,e,[i.value])}function OO(t){let n=t.routeConfig?t.routeConfig.canActivateChild:null;return!n||n.length===0?null:{node:t,guards:n}}function ss(t,n){let e=Symbol(),i=n.get(t,e);return i===e?typeof t=="function"&&!op(t)?t:n.get(t):i}function ac(t,n,e,i,r={canDeactivateChecks:[],canActivateChecks:[]}){let o=Xa(n);return t.children.forEach(a=>{PO(a,o[a.value.outlet],e,i.concat([a.value]),r),delete o[a.value.outlet]}),Object.entries(o).forEach(([a,s])=>cc(s,e.getContext(a),e,r)),r}function PO(t,n,e,i,r={canDeactivateChecks:[],canActivateChecks:[]}){let o=t.value,a=n?n.value:null,s=e?e.getContext(t.value.outlet):null;if(a&&o.routeConfig===a.routeConfig){let l=FO(a,o,o.routeConfig.runGuardsAndResolvers);l?r.canActivateChecks.push(new jm(i)):(o.data=a.data,o._resolvedData=a._resolvedData),o.component?ac(t,n,s?s.children:null,i,r):ac(t,n,e,i,r),l&&s&&s.outlet&&s.outlet.isActivated&&r.canDeactivateChecks.push(new Ja(s.outlet.component,a))}else a&&cc(n,s,e,r),r.canActivateChecks.push(new jm(i)),o.component?ac(t,null,s?s.children:null,i,r):ac(t,null,e,i,r);return r}function FO(t,n,e){if(typeof e=="function")return Rt(n._environmentInjector,()=>e(t,n));switch(e){case"pathParamsChange":return!Fo(t.url,n.url);case"pathParamsOrQueryParamsChange":return!Fo(t.url,n.url)||!Mi(t.queryParams,n.queryParams);case"always":return!0;case"paramsOrQueryParamsChange":return!rv(t,n)||!Mi(t.queryParams,n.queryParams);default:return!rv(t,n)}}function cc(t,n,e,i){let r=Xa(t),o=t.value;Object.entries(r).forEach(([a,s])=>{o.component?n?cc(s,n.children.getContext(a),n.children,i):cc(s,null,null,i):cc(s,e?e.getContext(a):null,e,i)}),o.component?n&&n.outlet&&n.outlet.isActivated?i.canDeactivateChecks.push(new Ja(n.outlet.component,o)):i.canDeactivateChecks.push(new Ja(null,o)):i.canDeactivateChecks.push(new Ja(null,o))}function yc(t){return typeof t=="function"}function LO(t){return typeof t=="boolean"}function jO(t){return t&&yc(t.canLoad)}function VO(t){return t&&yc(t.canActivate)}function BO(t){return t&&yc(t.canActivateChild)}function HO(t){return t&&yc(t.canDeactivate)}function UO(t){return t&&yc(t.canMatch)}function vx(t){return t instanceof ji||t?.name==="EmptyError"}var vm=Symbol("INITIAL_VALUE");function os(){return gt(t=>il(t.map(n=>n.pipe(Le(1),qe(vm)))).pipe(J(n=>{for(let e of n)if(e!==!0){if(e===vm)return vm;if(e===!1||zO(e))return e}return!0}),ue(n=>n!==vm),Le(1)))}function zO(t){return Or(t)||t instanceof rs}function bx(t){return t.aborted?ne(void 0).pipe(Le(1)):new le(n=>{let e=()=>{n.next(),n.complete()};return t.addEventListener("abort",e),()=>t.removeEventListener("abort",e)})}function yx(t){return he(bx(t))}function $O(t){return Pt(n=>{let{targetSnapshot:e,currentSnapshot:i,guards:{canActivateChecks:r,canDeactivateChecks:o}}=n;return o.length===0&&r.length===0?ne(V(b({},n),{guardsResult:!0})):WO(o,e,i).pipe(Pt(a=>a&&LO(a)?GO(e,r,t):ne(a)),J(a=>V(b({},n),{guardsResult:a})))})}function WO(t,n,e){return st(t).pipe(Pt(i=>XO(i.component,i.route,e,n)),Vi(i=>i!==!0,!0))}function GO(t,n,e){return st(n).pipe(so(i=>fi(YO(i.route.parent,e),qO(i.route,e),QO(t,i.path),ZO(t,i.route))),Vi(i=>i!==!0,!0))}function qO(t,n){return t!==null&&n&&n(new Rm(t)),ne(!0)}function YO(t,n){return t!==null&&n&&n(new km(t)),ne(!0)}function ZO(t,n){let e=n.routeConfig?n.routeConfig.canActivate:null;if(!e||e.length===0)return ne(!0);let i=e.map(r=>Yn(()=>{let o=n._environmentInjector,a=ss(r,o),s=VO(a)?a.canActivate(n,t):Rt(o,()=>a(n,t));return Ho(s).pipe(Vi())}));return ne(i).pipe(os())}function QO(t,n){let e=n[n.length-1],r=n.slice(0,n.length-1).reverse().map(o=>OO(o)).filter(o=>o!==null).map(o=>Yn(()=>{let a=o.guards.map(s=>{let l=o.node._environmentInjector,d=ss(s,l),u=BO(d)?d.canActivateChild(e,t):Rt(l,()=>d(e,t));return Ho(u).pipe(Vi())});return ne(a).pipe(os())}));return ne(r).pipe(os())}function XO(t,n,e,i){let r=n&&n.routeConfig?n.routeConfig.canDeactivate:null;if(!r||r.length===0)return ne(!0);let o=r.map(a=>{let s=n._environmentInjector,l=ss(a,s),d=HO(l)?l.canDeactivate(t,n,e,i):Rt(s,()=>l(t,n,e,i));return Ho(d).pipe(Vi())});return ne(o).pipe(os())}function KO(t,n,e,i,r){let o=n.canLoad;if(o===void 0||o.length===0)return ne(!0);let a=o.map(s=>{let l=ss(s,t),d=jO(l)?l.canLoad(n,e):Rt(t,()=>l(n,e)),u=Ho(d);return r?u.pipe(yx(r)):u});return ne(a).pipe(os(),Cx(i))}function Cx(t){return dd(Ft(n=>{if(typeof n!="boolean")throw Lm(t,n)}),J(n=>n===!0))}function JO(t,n,e,i,r,o){let a=n.canMatch;if(!a||a.length===0)return ne(!0);let s=a.map(l=>{let d=ss(l,t),u=UO(d)?d.canMatch(n,e,r):Rt(t,()=>d(n,e,r));return Ho(u).pipe(yx(o))});return ne(s).pipe(os(),Cx(i))}var Ji=class t extends Error{segmentGroup;constructor(n){super(),this.segmentGroup=n||null,Object.setPrototypeOf(this,t.prototype)}},_c=class t extends Error{urlTree;constructor(n){super(),this.urlTree=n,Object.setPrototypeOf(this,t.prototype)}};function eP(t){throw new H(4e3,!1)}function tP(t){throw gx(!1,Gt.GuardRejected)}var sv=class{urlSerializer;urlTree;constructor(n,e){this.urlSerializer=n,this.urlTree=e}async lineralizeSegments(n,e){let i=[],r=e.root;for(;;){if(i=i.concat(r.segments),r.numberOfChildren===0)return i;if(r.numberOfChildren>1||!r.children[be])throw eP(`${n.redirectTo}`);r=r.children[be]}}async applyRedirectCommands(n,e,i,r,o){let a=await nP(e,r,o);if(a instanceof on)throw new _c(a);let s=this.applyRedirectCreateUrlTree(a,this.urlSerializer.parse(a),n,i);if(a[0]==="/")throw new _c(s);return s}applyRedirectCreateUrlTree(n,e,i,r){let o=this.createSegmentGroup(n,e.root,i,r);return new on(o,this.createQueryParams(e.queryParams,this.urlTree.queryParams),e.fragment)}createQueryParams(n,e){let i={};return Object.entries(n).forEach(([r,o])=>{if(typeof o=="string"&&o[0]===":"){let s=o.substring(1);i[r]=e[s]}else i[r]=o}),i}createSegmentGroup(n,e,i,r){let o=this.createSegments(n,e.segments,i,r),a=Object.create(null);return Object.entries(e.children).forEach(([s,l])=>{a[s]=this.createSegmentGroup(n,l,i,r)}),new Ve(o,a)}createSegments(n,e,i,r){return e.map(o=>o.path[0]===":"?this.findPosParam(n,o,r):this.findOrReturn(o,i))}findPosParam(n,e,i){let r=i[e.path.substring(1)];if(!r)throw new H(4001,!1);return r}findOrReturn(n,e){let i=0;for(let r of e){if(r.path===n.path)return e.splice(i),r;i++}return n}};function nP(t,n,e){if(typeof t=="string")return Promise.resolve(t);let i=t;return wm(Ho(Rt(e,()=>i(n))))}function iP(t,n){return t.providers&&!t._injector&&(t._injector=$l(t.providers,n,`Route: ${t.path}`)),t._injector??n}function oi(t){return t.outlet||be}function rP(t,n){let e=t.filter(i=>oi(i)===n);return e.push(...t.filter(i=>oi(i)!==n)),e}var lv={matched:!1,consumedSegments:[],remainingSegments:[],parameters:{},positionalParamSegments:{}};function wx(t){return{routeConfig:t.routeConfig,url:t.url,params:t.params,queryParams:t.queryParams,fragment:t.fragment,data:t.data,outlet:t.outlet,title:t.title,paramMap:t.paramMap,queryParamMap:t.queryParamMap}}function oP(t,n,e,i,r,o,a){let s=Sx(t,n,e);if(!s.matched)return ne(s);let l=wx(o(s));return i=iP(n,i),JO(i,n,e,r,l,a).pipe(J(d=>d===!0?s:b({},lv)))}function Sx(t,n,e){if(n.path==="")return n.pathMatch==="full"&&(t.hasChildren()||e.length>0)?b({},lv):{matched:!0,consumedSegments:[],remainingSegments:e,parameters:{},positionalParamSegments:{}};let r=(n.matcher||YS)(e,t,n);if(!r)return b({},lv);let o={};Object.entries(r.posParams??{}).forEach(([s,l])=>{o[s]=l.path});let a=r.consumed.length>0?b(b({},o),r.consumed[r.consumed.length-1].parameters):o;return{matched:!0,consumedSegments:r.consumed,remainingSegments:e.slice(r.consumed.length),parameters:a,positionalParamSegments:r.posParams??{}}}function GS(t,n,e,i,r){return e.length>0&&lP(t,e,i,r)?{segmentGroup:new Ve(n,sP(i,new Ve(e,t.children))),slicedSegments:[]}:e.length===0&&cP(t,e,i)?{segmentGroup:new Ve(t.segments,aP(t,e,i,t.children)),slicedSegments:e}:{segmentGroup:new Ve(t.segments,t.children),slicedSegments:e}}function aP(t,n,e,i){let r={};for(let o of e)if(Hm(t,n,o)&&!i[oi(o)]){let a=new Ve([],{});r[oi(o)]=a}return b(b({},i),r)}function sP(t,n){let e={};e[be]=n;for(let i of t)if(i.path===""&&oi(i)!==be){let r=new Ve([],{});e[oi(i)]=r}return e}function lP(t,n,e,i){return e.some(r=>!Hm(t,n,r)||!(oi(r)!==be)?!1:!(i!==void 0&&oi(r)===i))}function cP(t,n,e){return e.some(i=>Hm(t,n,i))}function Hm(t,n,e){return(t.hasChildren()||n.length>0)&&e.pathMatch==="full"?!1:e.path===""}function dP(t,n,e){return n.length===0&&!t.children[e]}var cv=class{};async function uP(t,n,e,i,r,o,a,s){return new dv(t,n,e,i,r,a,o,s).recognize()}var mP=31,dv=class{injector;configLoader;rootComponentType;config;urlTree;paramsInheritanceStrategy;urlSerializer;abortSignal;applyRedirects;absoluteRedirectCount=0;allowRedirects=!0;constructor(n,e,i,r,o,a,s,l){this.injector=n,this.configLoader=e,this.rootComponentType=i,this.config=r,this.urlTree=o,this.paramsInheritanceStrategy=a,this.urlSerializer=s,this.abortSignal=l,this.applyRedirects=new sv(this.urlSerializer,this.urlTree)}noMatchError(n){return new H(4002,`'${n.segmentGroup}'`)}async recognize(){let n=GS(this.urlTree.root,[],[],this.config).segmentGroup,{children:e,rootSnapshot:i}=await this.match(n),r=new wn(i,e),o=new pc("",r),a=ox(i,[],this.urlTree.queryParams,this.urlTree.fragment);return a.queryParams=this.urlTree.queryParams,o.url=this.urlSerializer.serialize(a),{state:o,tree:a}}async match(n){let e=new is([],Object.freeze({}),Object.freeze(b({},this.urlTree.queryParams)),this.urlTree.fragment,Object.freeze({}),be,this.rootComponentType,null,{},this.injector);try{return{children:await this.processSegmentGroup(this.injector,this.config,n,be,e),rootSnapshot:e}}catch(i){if(i instanceof _c)return this.urlTree=i.urlTree,this.match(i.urlTree.root);throw i instanceof Ji?this.noMatchError(i):i}}async processSegmentGroup(n,e,i,r,o){if(i.segments.length===0&&i.hasChildren())return this.processChildren(n,e,i,o);let a=await this.processSegment(n,e,i,i.segments,r,!0,o);return a instanceof wn?[a]:[]}async processChildren(n,e,i,r){let o=[];for(let l of Object.keys(i.children))l==="primary"?o.unshift(l):o.push(l);let a=[];for(let l of o){let d=i.children[l],u=rP(e,l),h=await this.processSegmentGroup(n,u,d,l,r);a.push(...h)}let s=xx(a);return fP(s),s}async processSegment(n,e,i,r,o,a,s){for(let l of e)try{return await this.processSegmentAgainstRoute(l._injector??n,e,l,i,r,o,a,s)}catch(d){if(d instanceof Ji||vx(d))continue;throw d}if(dP(i,r,o))return new cv;throw new Ji(i)}async processSegmentAgainstRoute(n,e,i,r,o,a,s,l){if(oi(i)!==a&&(a===be||!Hm(r,o,i)))throw new Ji(r);if(i.redirectTo===void 0)return this.matchSegmentAgainstRoute(n,r,i,o,a,l);if(this.allowRedirects&&s)return this.expandSegmentAgainstRouteUsingRedirect(n,r,e,i,o,a,l);throw new Ji(r)}async expandSegmentAgainstRouteUsingRedirect(n,e,i,r,o,a,s){let{matched:l,parameters:d,consumedSegments:u,positionalParamSegments:h,remainingSegments:_}=Sx(e,r,o);if(!l)throw new Ji(e);typeof r.redirectTo=="string"&&r.redirectTo[0]==="/"&&(this.absoluteRedirectCount++,this.absoluteRedirectCount>mP&&(this.allowRedirects=!1));let v=this.createSnapshot(n,r,o,d,s);if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);let x=await this.applyRedirects.applyRedirectCommands(u,r.redirectTo,h,wx(v),n),A=await this.applyRedirects.lineralizeSegments(r,x);return this.processSegment(n,i,e,A.concat(_),a,!1,s)}createSnapshot(n,e,i,r,o){let a=new is(i,r,Object.freeze(b({},this.urlTree.queryParams)),this.urlTree.fragment,pP(e),oi(e),e.component??e._loadedComponent??null,e,gP(e),n),s=hv(a,o,this.paramsInheritanceStrategy);return a.params=Object.freeze(s.params),a.data=Object.freeze(s.data),a}async matchSegmentAgainstRoute(n,e,i,r,o,a){if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);let s=Tt=>this.createSnapshot(n,i,Tt.consumedSegments,Tt.parameters,a),l=await wm(oP(e,i,r,n,this.urlSerializer,s,this.abortSignal));if(i.path==="**"&&(e.children={}),!l?.matched)throw new Ji(e);n=i._injector??n;let{routes:d}=await this.getChildConfig(n,i,r),u=i._loadedInjector??n,{parameters:h,consumedSegments:_,remainingSegments:v}=l,x=this.createSnapshot(n,i,_,h,a),{segmentGroup:A,slicedSegments:re}=GS(e,_,v,d,o);if(re.length===0&&A.hasChildren()){let Tt=await this.processChildren(u,d,A,x);return new wn(x,Tt)}if(d.length===0&&re.length===0)return new wn(x,[]);let oe=oi(i)===o,Qe=await this.processSegment(u,d,A,re,oe?be:o,!0,x);return new wn(x,Qe instanceof wn?[Qe]:[])}async getChildConfig(n,e,i){if(e.children)return{routes:e.children,injector:n};if(e.loadChildren){if(e._loadedRoutes!==void 0){let o=e._loadedNgModuleFactory;return o&&!e._loadedInjector&&(e._loadedInjector=o.create(n).injector),{routes:e._loadedRoutes,injector:e._loadedInjector}}if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);if(await wm(KO(n,e,i,this.urlSerializer,this.abortSignal))){let o=await this.configLoader.loadChildren(n,e);return e._loadedRoutes=o.routes,e._loadedInjector=o.injector,e._loadedNgModuleFactory=o.factory,o}throw tP(e)}return{routes:[],injector:n}}};function fP(t){t.sort((n,e)=>n.value.outlet===be?-1:e.value.outlet===be?1:n.value.outlet.localeCompare(e.value.outlet))}function hP(t){let n=t.value.routeConfig;return n&&n.path===""}function xx(t){let n=[],e=new Set;for(let i of t){if(!hP(i)){n.push(i);continue}let r=n.find(o=>i.value.routeConfig===o.value.routeConfig);r!==void 0?(r.children.push(...i.children),e.add(r)):n.push(i)}for(let i of e){let r=xx(i.children);n.push(new wn(i.value,r))}return n.filter(i=>!e.has(i))}function pP(t){return t.data||{}}function gP(t){return t.resolve||{}}function _P(t,n,e,i,r,o,a){return Pt(async s=>{let{state:l,tree:d}=await uP(t,n,e,i,s.extractedUrl,r,o,a);return V(b({},s),{targetSnapshot:l,urlAfterRedirects:d})})}function vP(t){return Pt(n=>{let{targetSnapshot:e,guards:{canActivateChecks:i}}=n;if(!i.length)return ne(n);let r=new Set(i.map(s=>s.route)),o=new Set;for(let s of r)if(!o.has(s))for(let l of Dx(s))o.add(l);let a=0;return st(o).pipe(so(s=>r.has(s)?bP(s,e,t):(s.data=hv(s,s.parent,t).resolve,ne(void 0))),Ft(()=>a++),Rd(1),Pt(s=>a===o.size?ne(n):at))})}function Dx(t){let n=t.children.map(e=>Dx(e)).flat();return[t,...n]}function bP(t,n,e){let i=t.routeConfig,r=t._resolve;return i?.title!==void 0&&!fx(i)&&(r[vc]=i.title),Yn(()=>(t.data=hv(t,t.parent,e).resolve,yP(r,t,n).pipe(J(o=>(t._resolvedData=o,t.data=b(b({},t.data),o),null)))))}function yP(t,n,e){let i=X_(t);if(i.length===0)return ne({});let r={};return st(i).pipe(Pt(o=>CP(t[o],n,e).pipe(Vi(),Ft(a=>{if(a instanceof rs)throw Lm(new Rr,a);r[o]=a}))),Rd(1),J(()=>r),_r(o=>vx(o)?at:tl(o)))}function CP(t,n,e){let i=n._environmentInjector,r=ss(t,i),o=r.resolve?r.resolve(n,e):Rt(i,()=>r(n,e));return Ho(o)}var Ex=new C("");function uv(t){return gt(n=>{let e=t(n);return e?st(e).pipe(J(()=>n)):ne(n)})}var vv=(()=>{class t{buildTitle(e){let i,r=e.root;for(;r!==void 0;)i=this.getResolvedTitleForRoute(r)??i,r=r.children.find(o=>o.outlet===be);return i}getResolvedTitleForRoute(e){return e.data[vc]}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:()=>c(Mx)})}return t})(),Mx=(()=>{class t extends vv{title;constructor(e){super(),this.title=e}updateTitle(e){let i=this.buildTitle(e);i!==void 0&&this.title.setTitle(i)}static \u0275fac=function(i){return new(i||t)(ee(BS))};static \u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),ls=new C("",{factory:()=>({})}),Cc=new C(""),Nx=(()=>{class t{componentLoaders=new WeakMap;childrenLoaders=new WeakMap;onLoadStartListener;onLoadEndListener;compiler=c(x_);async loadComponent(e,i){if(this.componentLoaders.get(i))return this.componentLoaders.get(i);if(i._loadedComponent)return Promise.resolve(i._loadedComponent);this.onLoadStartListener&&this.onLoadStartListener(i);let r=(async()=>{try{let o=await QS(Rt(e,()=>i.loadComponent())),a=await Tx(N_(o));return this.onLoadEndListener&&this.onLoadEndListener(i),i._loadedComponent=a,a}finally{this.componentLoaders.delete(i)}})();return this.componentLoaders.set(i,r),r}loadChildren(e,i){if(this.childrenLoaders.get(i))return this.childrenLoaders.get(i);if(i._loadedRoutes)return Promise.resolve({routes:i._loadedRoutes,injector:i._loadedInjector});this.onLoadStartListener&&this.onLoadStartListener(i);let r=(async()=>{try{let o=await Ix(i,this.compiler,e,this.onLoadEndListener);return i._loadedRoutes=o.routes,i._loadedInjector=o.injector,i._loadedNgModuleFactory=o.factory,o}finally{this.childrenLoaders.delete(i)}})();return this.childrenLoaders.set(i,r),r}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();async function Ix(t,n,e,i){let r=await QS(Rt(e,()=>t.loadChildren())),o=await Tx(N_(r)),a;o instanceof Zu||Array.isArray(o)?a=o:a=await n.compileModuleAsync(o),i&&i(t);let s,l,d=!1,u;return Array.isArray(a)?(l=a,d=!0):(s=a.create(e).injector,u=a,l=s.get(Cc,[],{optional:!0,self:!0}).flat()),{routes:l.map(_v),injector:s,factory:u}}async function Tx(t){return t}var Um=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:()=>c(wP)})}return t})(),wP=(()=>{class t{shouldProcessUrl(e){return!0}extract(e){return e}merge(e,i){return e}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),kx=new C("");var SP=()=>{},Ax=new C(""),Rx=(()=>{class t{currentNavigation=S(null,{equal:()=>!1});currentTransition=null;lastSuccessfulNavigation=S(null);events=new I;transitionAbortWithErrorSubject=new I;configLoader=c(Nx);environmentInjector=c(We);destroyRef=c(Xe);urlSerializer=c(as);rootContexts=c(Bo);location=c(kr);inputBindingEnabled=c(Bm,{optional:!0})!==null;titleStrategy=c(vv);options=c(ls,{optional:!0})||{};paramsInheritanceStrategy=this.options.paramsInheritanceStrategy||NO;urlHandlingStrategy=c(Um);createViewTransition=c(kx,{optional:!0});navigationErrorHandler=c(Ax,{optional:!0});routerResourcesFeature=c(Ex,{optional:!0});navigationId=0;get hasRequestedNavigation(){return this.navigationId!==0}transitions;afterPreactivation=()=>ne(void 0);rootComponentType=null;destroyed=!1;constructor(){let e=r=>this.events.next(new Im(r)),i=r=>this.events.next(new Tm(r));this.configLoader.onLoadEndListener=i,this.configLoader.onLoadStartListener=e,this.destroyRef.onDestroy(()=>{this.destroyed=!0})}complete(){this.transitions?.complete()}handleNavigationRequest(e){let i=++this.navigationId;Ee(()=>{this.transitions?.next(V(b({},e),{extractedUrl:this.urlHandlingStrategy.extract(e.rawUrl),targetSnapshot:null,targetRouterState:null,guards:{canActivateChecks:[],canDeactivateChecks:[]},guardsResult:null,id:i,routesRecognizeHandler:{},beforeActivateHandler:{}}))})}setupNavigations(e){return this.transitions=new Et(null),this.transitions.pipe(ue(i=>i!==null),gt(i=>{let r=!0,o=!1,a=new AbortController,s=()=>!o&&this.currentTransition?.id===i.id;return ne(i).pipe(gt(l=>{if(this.navigationId>i.id)return this.cancelNavigationTransition(i,"",Gt.SupersededByNewNavigation),at;this.currentTransition=i;let d=this.lastSuccessfulNavigation();this.currentNavigation.set({id:l.id,initialUrl:l.rawUrl,extractedUrl:l.extractedUrl,targetBrowserUrl:typeof l.extras.browserUrl=="string"?this.urlSerializer.parse(l.extras.browserUrl):l.extras.browserUrl,trigger:l.source,extras:l.extras,previousNavigation:d?V(b({},d),{previousNavigation:null}):null,abort:()=>a.abort(),routesRecognizeHandler:l.routesRecognizeHandler,beforeActivateHandler:l.beforeActivateHandler});let u=!e.navigated||this.isUpdatingInternalState()||this.isUpdatedBrowserUrl(),h=l.extras.onSameUrlNavigation??e.onSameUrlNavigation;if(!u&&h!=="reload")return this.events.next(new er(l.id,this.urlSerializer.serialize(l.rawUrl),"",uc.IgnoredSameUrlNavigation)),l.resolve(!1),at;if(this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))return ne(l).pipe(gt(_=>(this.events.next(new jo(_.id,this.urlSerializer.serialize(_.extractedUrl),_.source,_.restoredState)),_.id!==this.navigationId?at:Promise.resolve(_))),_P(this.environmentInjector,this.configLoader,this.rootComponentType,e.config,this.urlSerializer,this.paramsInheritanceStrategy,a.signal),Ft(_=>{i.targetSnapshot=_.targetSnapshot,i.urlAfterRedirects=_.urlAfterRedirects,this.currentNavigation.update(v=>(v.finalUrl=_.urlAfterRedirects,v)),this.events.next(new fc)}),gt(_=>st(i.routesRecognizeHandler.deferredHandle??ne(void 0)).pipe(J(()=>_))),Ft(()=>{let _=new mc(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot);this.events.next(_)}));if(u&&this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)){let{id:_,extractedUrl:v,source:x,restoredState:A,extras:re}=l,oe=new jo(_,this.urlSerializer.serialize(v),x,A);this.events.next(oe);let Qe=ux(this.rootComponentType,this.environmentInjector).snapshot;return this.currentTransition=i=V(b({},l),{targetSnapshot:Qe,urlAfterRedirects:v,extras:V(b({},re),{skipLocationChange:!1,replaceUrl:!1})}),this.currentNavigation.update(Tt=>(Tt.finalUrl=v,Tt)),ne(i)}else return this.events.next(new er(l.id,this.urlSerializer.serialize(l.extractedUrl),"",uc.IgnoredByUrlHandlingStrategy)),l.resolve(!1),at}),J(l=>{let d=new Dm(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot);return this.events.next(d),this.currentTransition=i=V(b({},l),{guards:RO(l.targetSnapshot,l.currentSnapshot,this.rootContexts)}),i}),$O(l=>this.events.next(l)),gt(l=>{if(i.guardsResult=l.guardsResult,l.guardsResult&&typeof l.guardsResult!="boolean")throw Lm(this.urlSerializer,l.guardsResult);let d=new Em(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot,!!l.guardsResult);if(this.events.next(d),!s())return at;if(!l.guardsResult)return this.cancelNavigationTransition(l,"",Gt.GuardRejected),at;if(l.guards.canActivateChecks.length===0)return ne(l);let u=new Mm(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot);if(this.events.next(u),!s())return at;let h=!1;return ne(l).pipe(vP(this.paramsInheritanceStrategy),Ft({next:()=>{h=!0;let _=new Nm(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot);this.events.next(_)},complete:()=>{h||this.cancelNavigationTransition(l,"",Gt.NoDataFromResolver)}}))}),uv(l=>{let d=h=>{let _=[];if(h.routeConfig?._loadedComponent)h.component=h.routeConfig?._loadedComponent;else if(h.routeConfig?.loadComponent){let v=h._environmentInjector;_.push(this.configLoader.loadComponent(v,h.routeConfig).then(x=>{h.component=x}))}for(let v of h.children)_.push(...d(v));return _},u=d(l.targetSnapshot.root);return u.length===0?ne(l):st(Promise.all(u).then(()=>l))}),gt(l=>{let{newlyCreatedRoutes:d,state:u}=IO(e.routeReuseStrategy,l.targetSnapshot,l.currentRouterState);return this.currentTransition=i=l=V(b({},l),{targetRouterState:u,newlyCreatedRoutes:d}),this.currentNavigation.update(h=>(h.targetRouterState=u,h)),ne(l)}),this.routerResourcesFeature?.setupAndRunResources(a.signal)??(l=>l),uv(()=>this.afterPreactivation()),gt(()=>{let{currentSnapshot:l,targetSnapshot:d}=i,u=this.createViewTransition?.(this.environmentInjector,l.root,d.root,i.hasUAVisualTransition);return u?st(u).pipe(J(()=>i)):ne(i)}),Le(1),gt(l=>{r=!1,this.events.next(new ts);let d=i.beforeActivateHandler.deferredHandle;return d?st(d.then(()=>l)):ne(l)}),Ft(l=>{new av(e.routeReuseStrategy,i.targetRouterState,i.currentRouterState,d=>this.events.next(d),this.inputBindingEnabled).activate(this.rootContexts),l.newlyCreatedRoutes?.clear(),s()&&(Ox(l.targetRouterState),o=!0,this.currentNavigation.update(d=>(d.abort=SP,d)),this.lastSuccessfulNavigation.set(Ee(this.currentNavigation)),this.events.next(new xn(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects))),this.titleStrategy?.updateTitle(l.targetRouterState.snapshot),l.resolve(!0))}),he(bx(a.signal).pipe(ue(()=>!o&&r),Ft(()=>{this.cancelNavigationTransition(i,a.signal.reason+"",Gt.Aborted)}))),Ft({complete:()=>{o=!0}}),he(this.transitionAbortWithErrorSubject.pipe(Ft(l=>{throw l}))),lo(()=>{a.abort(),o||this.cancelNavigationTransition(i,"",Gt.SupersededByNewNavigation),this.currentTransition?.id===i.id&&(this.currentNavigation.set(null),this.currentTransition=null)}),_r(l=>{if(o=!0,qS(i),this.destroyed)return i.resolve(!1),at;if(_x(l))this.events.next(new Ln(i.id,this.urlSerializer.serialize(i.extractedUrl),l.message,l.cancellationCode)),AO(l)?this.events.next(new ns(l.url,l.navigationBehaviorOptions)):i.resolve(!1);else{let d=new Vo(i.id,this.urlSerializer.serialize(i.extractedUrl),l,i.targetSnapshot??void 0);try{let u=Rt(this.environmentInjector,()=>this.navigationErrorHandler?.(d));if(u instanceof rs){let{message:h,cancellationCode:_}=Lm(this.urlSerializer,u);this.events.next(new Ln(i.id,this.urlSerializer.serialize(i.extractedUrl),h,_)),this.events.next(new ns(u.redirectTo,u.navigationBehaviorOptions))}else throw this.events.next(d),l}catch(u){this.options.resolveNavigationPromiseOnError?i.resolve(!1):i.reject(u)}}return at}))}))}cancelNavigationTransition(e,i,r){qS(e);let o=new Ln(e.id,this.urlSerializer.serialize(e.extractedUrl),i,r);this.events.next(o),e.resolve(!1)}isUpdatingInternalState(){return this.currentTransition?.extractedUrl.toString()!==this.currentTransition?.currentUrlTree.toString()}isUpdatedBrowserUrl(){let e=this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))),i=Ee(this.currentNavigation),r=i?.targetBrowserUrl??i?.extractedUrl;return e.toString()!==r?.toString()&&!i?.extras.skipLocationChange}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function xP(t){return t!==lc}function qS(t){for(let n of t.newlyCreatedRoutes??[])n._localInjector?.destroy(),n._localInjector=void 0;Ox(t.targetRouterState)}function Ox(t){if(!t)return;let n=e=>{e.value.pending?.set(!1),e.children.forEach(n)};n(t._root)}var Px=new C("");var Fx=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:()=>c(DP)})}return t})(),Vm=class{shouldDetach(n){return!1}store(n,e){}shouldAttach(n){return!1}retrieve(n){return null}shouldReuseRoute(n,e){return n.routeConfig===e.routeConfig}shouldDestroyInjector(n){return!0}},DP=(()=>{class t extends Vm{static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),zm=(()=>{class t{urlSerializer=c(as);options=c(ls,{optional:!0})||{};canceledNavigationResolution=this.options.canceledNavigationResolution||"replace";location=c(kr);urlHandlingStrategy=c(Um);urlUpdateStrategy=this.options.urlUpdateStrategy||"deferred";currentUrlTree=new on;getCurrentUrlTree(){return this.currentUrlTree}rawUrlTree=this.currentUrlTree;getRawUrlTree(){return this.rawUrlTree}createBrowserPath({finalUrl:e,initialUrl:i,targetBrowserUrl:r}){let o=e!==void 0?this.urlHandlingStrategy.merge(e,i):i,a=r??o;return a instanceof on?this.urlSerializer.serialize(a):a}routerUrlState(e){return e?.targetBrowserUrl===void 0||e?.finalUrl===void 0?{}:{\u0275routerUrl:this.urlSerializer.serialize(e.finalUrl)}}commitTransition({targetRouterState:e,finalUrl:i,initialUrl:r}){i&&e?(this.currentUrlTree=i,this.rawUrlTree=this.urlHandlingStrategy.merge(i,r),this.routerState=e):this.rawUrlTree=r}routerState=ux(null,c(We));getRouterState(){return this.routerState}_stateMemento=this.createStateMemento();get stateMemento(){return this._stateMemento}updateStateMemento(){this._stateMemento=this.createStateMemento()}createStateMemento(){return{rawUrlTree:this.rawUrlTree,currentUrlTree:this.currentUrlTree,routerState:this.routerState}}restoredState(){return this.location.getState()}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:()=>c(EP)})}return t})(),EP=(()=>{class t extends zm{currentPageId=0;lastSuccessfulId=-1;get browserPageId(){return this.canceledNavigationResolution!=="computed"?this.currentPageId:this.restoredState()?.\u0275routerPageId??this.currentPageId}registerNonRouterCurrentEntryChangeListener(e){return this.location.subscribe(i=>{i.type==="popstate"&&setTimeout(()=>{e(i.url,i.state,"popstate",{replaceUrl:!0},i.hasUAVisualTransition)})})}handleRouterEvent(e,i){e instanceof jo?this.updateStateMemento():e instanceof er?this.commitTransition(i):e instanceof mc?this.urlUpdateStrategy==="eager"&&(i.extras.skipLocationChange||this.setBrowserUrl(this.createBrowserPath(i),i)):e instanceof ts?(this.commitTransition(i),this.urlUpdateStrategy==="deferred"&&!i.extras.skipLocationChange&&this.setBrowserUrl(this.createBrowserPath(i),i)):e instanceof Ln&&!dx(e)?this.restoreHistory(i):e instanceof Vo?this.restoreHistory(i,!0):e instanceof xn&&(this.lastSuccessfulId=e.id,this.currentPageId=this.browserPageId)}setBrowserUrl(e,i){let{extras:r,id:o}=i,{replaceUrl:a,state:s}=r;if(this.location.isCurrentPathEqualTo(e)||a){let l=this.browserPageId,d=b(b({},s),this.generateNgRouterState(o,l,i));this.location.replaceState(e,"",d)}else{let l=b(b({},s),this.generateNgRouterState(o,this.browserPageId+1,i));this.location.go(e,"",l)}}restoreHistory(e,i=!1){if(this.canceledNavigationResolution==="computed"){let r=this.browserPageId,o=this.currentPageId-r;o!==0?this.location.historyGo(o):this.getCurrentUrlTree()===e.finalUrl&&o===0&&(this.resetInternalState(e),this.resetUrlToCurrentUrlTree())}else this.canceledNavigationResolution==="replace"&&(i&&this.resetInternalState(e),this.resetUrlToCurrentUrlTree())}resetInternalState({finalUrl:e}){this.routerState=this.stateMemento.routerState,this.currentUrlTree=this.stateMemento.currentUrlTree,this.rawUrlTree=this.urlHandlingStrategy.merge(this.currentUrlTree,e??this.rawUrlTree)}resetUrlToCurrentUrlTree(){this.location.replaceState(this.urlSerializer.serialize(this.getRawUrlTree()),"",this.generateNgRouterState(this.lastSuccessfulId,this.currentPageId))}generateNgRouterState(e,i,r){return this.canceledNavigationResolution==="computed"?b({navigationId:e,\u0275routerPageId:i},this.routerUrlState(r)):b({navigationId:e},this.routerUrlState(r))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function bv(t,n){t.events.pipe(ue(e=>e instanceof xn||e instanceof Ln||e instanceof Vo||e instanceof er),J(e=>e instanceof xn||e instanceof er?0:(e instanceof Ln?e.code===Gt.Redirect||e.code===Gt.SupersededByNewNavigation:!1)?2:1),ue(e=>e!==2),Le(1)).subscribe(()=>{n()})}var an=(()=>{class t{get currentUrlTree(){return this.stateManager.getCurrentUrlTree()}get rawUrlTree(){return this.stateManager.getRawUrlTree()}disposed=!1;nonRouterCurrentEntryChangeSubscription;console=c(Xu);stateManager=c(zm);options=c(ls,{optional:!0})||{};pendingTasks=c($i);urlUpdateStrategy=this.options.urlUpdateStrategy||"deferred";navigationTransitions=c(Rx);urlSerializer=c(as);location=c(kr);urlHandlingStrategy=c(Um);injector=c(We);_events=new I;get events(){return this._events}get routerState(){return this.stateManager.getRouterState()}navigated=!1;routeReuseStrategy=c(Fx);injectorCleanup=c(Px,{optional:!0});onSameUrlNavigation=this.options.onSameUrlNavigation||"ignore";config=c(Cc,{optional:!0})?.flat()??[];componentInputBindingEnabled=!!c(Bm,{optional:!0});currentNavigation=this.navigationTransitions.currentNavigation.asReadonly();constructor(){this.resetConfig(this.config),this.navigationTransitions.setupNavigations(this).subscribe({error:e=>{}}),this.subscribeToNavigationEvents()}eventsSubscription=new ce;subscribeToNavigationEvents(){let e=this.navigationTransitions.events.subscribe(i=>{try{let r=this.navigationTransitions.currentTransition,o=Ee(this.navigationTransitions.currentNavigation);if(r!==null&&o!==null){if(this.stateManager.handleRouterEvent(i,o),i instanceof Ln&&i.code!==Gt.Redirect&&i.code!==Gt.SupersededByNewNavigation)this.navigated=!0;else if(i instanceof xn)this.navigated=!0,this.injectorCleanup?.(this.routeReuseStrategy,this.routerState,this.config);else if(i instanceof ns){let a=i.navigationBehaviorOptions,s=this.urlHandlingStrategy.merge(i.url,r.currentRawUrl),l=b({scroll:r.extras.scroll,browserUrl:r.extras.browserUrl,info:r.extras.info,skipLocationChange:r.extras.skipLocationChange,replaceUrl:r.extras.replaceUrl||this.urlUpdateStrategy==="eager"||xP(r.source)},a);this.scheduleNavigation(s,lc,null,l,r.hasUAVisualTransition,{resolve:r.resolve,reject:r.reject,promise:r.promise})}}EO(i)&&this._events.next(i)}catch(r){this.navigationTransitions.transitionAbortWithErrorSubject.next(r)}});this.eventsSubscription.add(e)}resetRootComponentType(e){this.routerState.root.component=e,this.navigationTransitions.rootComponentType=e}initialNavigation(){this.setUpLocationChangeListener(),this.navigationTransitions.hasRequestedNavigation||this.navigateToSyncWithBrowser(this.location.path(!0),lc,this.stateManager.restoredState(),{replaceUrl:!0})}setUpLocationChangeListener(){this.nonRouterCurrentEntryChangeSubscription??=this.stateManager.registerNonRouterCurrentEntryChangeListener((e,i,r,o,a)=>{this.navigateToSyncWithBrowser(e,r,i,o,a)})}navigateToSyncWithBrowser(e,i,r,o,a){let s=r?.navigationId?r:null,l=r?.\u0275routerUrl??e;if(r?.\u0275routerUrl&&(o=V(b({},o),{browserUrl:e})),r){let u=b({},r);delete u.navigationId,delete u.\u0275routerPageId,delete u.\u0275routerUrl,Object.keys(u).length!==0&&(o.state=u)}let d=this.parseUrl(l);this.scheduleNavigation(d,i,s,o,a).catch(u=>{this.disposed||this.injector.get(Rn)(u)})}get url(){return this.serializeUrl(this.currentUrlTree)}getCurrentNavigation(){return Ee(this.navigationTransitions.currentNavigation)}get lastSuccessfulNavigation(){return this.navigationTransitions.lastSuccessfulNavigation}resetConfig(e){this.config=e.map(_v),this.navigated=!1}ngOnDestroy(){this.dispose()}dispose(){this._events.unsubscribe(),this.navigationTransitions.complete(),this.nonRouterCurrentEntryChangeSubscription?.unsubscribe(),this.nonRouterCurrentEntryChangeSubscription=void 0,this.disposed=!0,this.eventsSubscription.unsubscribe()}createUrlTree(e,i={}){let{relativeTo:r,queryParams:o,fragment:a,queryParamsHandling:s,preserveFragment:l}=i,d=l?this.currentUrlTree.fragment:a,u=null;switch(s??this.options.defaultQueryParamsHandling){case"merge":u=b(b({},this.currentUrlTree.queryParams),o);break;case"preserve":u=this.currentUrlTree.queryParams;break;default:u=o||null}u!==null&&(u=this.removeEmptyProps(u));let h;try{let _=r?r.snapshot:this.routerState.snapshot.root;h=ax(_)}catch{(typeof e[0]!="string"||e[0][0]!=="/")&&(e=[]),h=this.currentUrlTree.root}return sx(h,e,u,d??null,this.urlSerializer)}navigateByUrl(e,i={skipLocationChange:!1}){let r=Or(e)?e:this.parseUrl(e),o=this.urlHandlingStrategy.merge(r,this.rawUrlTree);return this.scheduleNavigation(o,lc,null,i)}navigate(e,i={skipLocationChange:!1}){return MP(e),this.navigateByUrl(this.createUrlTree(e,i),i)}serializeUrl(e){return this.urlSerializer.serialize(e)}parseUrl(e){try{return this.urlSerializer.parse(e)}catch{return this.console.warn(pi(4018,!1)),this.urlSerializer.parse("/")}}isActive(e,i){let r;if(i===!0?r=b({},mv):i===!1?r=b({},es):r=b(b({},es),i),Or(e))return K_(this.currentUrlTree,e,r);let o=this.parseUrl(e);return K_(this.currentUrlTree,o,r)}removeEmptyProps(e){return Object.entries(e).reduce((i,[r,o])=>(o!=null&&(i[r]=o),i),{})}scheduleNavigation(e,i,r,o,a,s){if(this.disposed)return Promise.resolve(!1);let l,d,u;s?(l=s.resolve,d=s.reject,u=s.promise):u=new Promise((_,v)=>{l=_,d=v});let h=this.pendingTasks.add();return bv(this,()=>{queueMicrotask(()=>this.pendingTasks.remove(h))}),this.navigationTransitions.handleNavigationRequest({source:i,restoredState:r,currentUrlTree:this.currentUrlTree,currentRawUrl:this.currentUrlTree,rawUrl:e,extras:o,hasUAVisualTransition:a,resolve:l,reject:d,promise:u,currentSnapshot:this.routerState.snapshot,currentRouterState:this.routerState}),u.catch(Promise.reject.bind(Promise))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function MP(t){for(let n=0;n<t.length;n++)if(t[n]==null)throw new H(4008,!1)}var IP=(()=>{class t{router=c(an);stateManager=c(zm);fragment=S("");queryParams=S({});path=S("");serializer=c(as);constructor(){this.updateState(),this.router.events?.subscribe(e=>{e instanceof xn&&this.updateState()})}updateState(){let{fragment:e,root:i,queryParams:r}=this.stateManager.getCurrentUrlTree();this.fragment.set(e),this.queryParams.set(r),this.path.set(this.serializer.serialize(new on(i)))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),Ni=(()=>{class t{router;route;tabIndexAttribute;renderer;el;locationStrategy;hrefAttributeValue=c(new Cn("href"),{optional:!0});reactiveHref=tm(()=>this.isAnchorElement?this.computeHref(this._urlTree()):this.hrefAttributeValue);get href(){return Ee(this.reactiveHref)}set href(e){this.reactiveHref.set(e)}set target(e){this._target.set(e)}get target(){return Ee(this._target)}_target=S(void 0);set queryParams(e){this._queryParams.set(e)}get queryParams(){return Ee(this._queryParams)}_queryParams=S(void 0,{equal:()=>!1});set fragment(e){this._fragment.set(e)}get fragment(){return Ee(this._fragment)}_fragment=S(void 0);set queryParamsHandling(e){this._queryParamsHandling.set(e)}get queryParamsHandling(){return Ee(this._queryParamsHandling)}_queryParamsHandling=S(void 0);set state(e){this._state.set(e)}get state(){return Ee(this._state)}_state=S(void 0,{equal:()=>!1});set info(e){this._info.set(e)}get info(){return Ee(this._info)}_info=S(void 0,{equal:()=>!1});set relativeTo(e){this._relativeTo.set(e)}get relativeTo(){return Ee(this._relativeTo)}_relativeTo=S(void 0);set preserveFragment(e){this._preserveFragment.set(e)}get preserveFragment(){return Ee(this._preserveFragment)}_preserveFragment=S(!1);set skipLocationChange(e){this._skipLocationChange.set(e)}get skipLocationChange(){return Ee(this._skipLocationChange)}_skipLocationChange=S(!1);set replaceUrl(e){this._replaceUrl.set(e)}get replaceUrl(){return Ee(this._replaceUrl)}_replaceUrl=S(!1);browserUrl=rn(void 0);isAnchorElement;onChanges=new I;applicationErrorHandler=c(Rn);options=c(ls,{optional:!0});reactiveRouterState=c(IP);constructor(e,i,r,o,a,s){this.router=e,this.route=i,this.tabIndexAttribute=r,this.renderer=o,this.el=a,this.locationStrategy=s;let l=a.nativeElement.tagName?.toLowerCase();this.isAnchorElement=l==="a"||l==="area"||!!(typeof customElements=="object"&&customElements.get(l)?.observedAttributes?.includes?.("href"))}setTabIndexIfNotOnNativeEl(e){this.tabIndexAttribute!=null||this.isAnchorElement||this.applyAttributeValue("tabindex",e)}ngOnChanges(e){this.onChanges.next(this)}routerLinkInput=S(null);set routerLink(e){e==null?(this.routerLinkInput.set(null),this.setTabIndexIfNotOnNativeEl(null)):(Or(e)?this.routerLinkInput.set(e):this.routerLinkInput.set(Array.isArray(e)?e:[e]),this.setTabIndexIfNotOnNativeEl("0"))}onClick(e,i,r,o,a){let s=this._urlTree();if(s===null||this.isAnchorElement&&(e!==0||i||r||o||a||typeof this.target=="string"&&this.target!="_self"))return!0;let l=this.browserUrl(),d=b({skipLocationChange:this.skipLocationChange,replaceUrl:this.replaceUrl,state:this.state,info:this.info},l!==void 0&&{browserUrl:l});return this.router.navigateByUrl(s,d)?.catch(u=>{this.applicationErrorHandler(u)}),!this.isAnchorElement}ngOnDestroy(){}applyAttributeValue(e,i){let r=this.renderer,o=this.el.nativeElement;i!==null?r.setAttribute(o,e,i):r.removeAttribute(o,e)}_urlTree=De(()=>{this.reactiveRouterState.path(),this._preserveFragment()&&this.reactiveRouterState.fragment();let e=r=>r==="preserve"||r==="merge";(e(this._queryParamsHandling())||e(this.options?.defaultQueryParamsHandling))&&this.reactiveRouterState.queryParams();let i=this.routerLinkInput();return i===null||!this.router.createUrlTree?null:Or(i)?i:this.router.createUrlTree(i,{relativeTo:this._relativeTo()!==void 0?this._relativeTo():this.route,queryParams:this._queryParams(),fragment:this._fragment(),queryParamsHandling:this._queryParamsHandling(),preserveFragment:this._preserveFragment()})},{equal:(e,i)=>this.computeHref(e)===this.computeHref(i)});get urlTree(){return Ee(this._urlTree)}computeHref(e){return e!==null&&this.locationStrategy?this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(e))??"":null}static \u0275fac=function(i){return new(i||t)(te(an),te(Dn),Fl("tabindex"),te(Se),te(F),te(qa))};static \u0275dir=R({type:t,selectors:[["","routerLink",""]],hostVars:2,hostBindings:function(i,r){i&1&&w("click",function(a){return r.onClick(a.button,a.ctrlKey,a.shiftKey,a.altKey,a.metaKey)}),i&2&&L("href",r.reactiveHref(),$g)("target",r._target())},inputs:{target:"target",queryParams:"queryParams",fragment:"fragment",queryParamsHandling:"queryParamsHandling",state:"state",info:"info",relativeTo:"relativeTo",preserveFragment:[2,"preserveFragment","preserveFragment",G],skipLocationChange:[2,"skipLocationChange","skipLocationChange",G],replaceUrl:[2,"replaceUrl","replaceUrl",G],browserUrl:[1,"browserUrl"],routerLink:"routerLink"},features:[Ae]})}return t})(),yv=(()=>{class t{router;element;renderer;cdr;links;classes=[];routerEventsSubscription;linkInputChangesSubscription;_isActive=!1;get isActive(){return this._isActive}routerLinkActiveOptions={exact:!1};ariaCurrentWhenActive;isActiveChange=new O;link=c(Ni,{optional:!0});constructor(e,i,r,o){this.router=e,this.element=i,this.renderer=r,this.cdr=o,this.routerEventsSubscription=e.events.subscribe(a=>{a instanceof xn&&this.update()})}ngAfterContentInit(){ne(this.links.changes,ne(null)).pipe(gr()).subscribe(e=>{this.update(),this.subscribeToEachLinkOnChanges()})}subscribeToEachLinkOnChanges(){this.linkInputChangesSubscription?.unsubscribe();let e=[...this.links.toArray(),this.link].filter(i=>!!i).map(i=>i.onChanges);this.linkInputChangesSubscription=st(e).pipe(gr()).subscribe(i=>{this._isActive!==this.isLinkActive(this.router)(i)&&this.update()})}set routerLinkActive(e){if(e==null){this.classes=[];return}let i=Array.isArray(e)?e:e.split(" ");this.classes=i.filter(r=>!!r)}ngOnChanges(e){this.update()}ngOnDestroy(){this.routerEventsSubscription.unsubscribe(),this.linkInputChangesSubscription?.unsubscribe()}update(){!this.links||!this.router.navigated||this.routerLinkActiveOptions===null&&!this._isActive||queueMicrotask(()=>{let e=this.hasActiveLinks();this.classes.forEach(i=>{e?this.renderer.addClass(this.element.nativeElement,i):this.renderer.removeClass(this.element.nativeElement,i)}),e&&this.ariaCurrentWhenActive!==void 0?this.renderer.setAttribute(this.element.nativeElement,"aria-current",this.ariaCurrentWhenActive.toString()):this.renderer.removeAttribute(this.element.nativeElement,"aria-current"),this._isActive!==e&&(this._isActive=e,this.cdr.markForCheck(),this.isActiveChange.emit(e))})}isLinkActive(e){let i=this.routerLinkActiveOptions;if(i===null)return()=>!1;let r;return i===void 0?r=b({},es):TP(i)?r=i:i.exact??!1?r=b({},mv):r=b({},es),o=>{let a=o.urlTree;return a?Ee(fv(a,e,r)):!1}}hasActiveLinks(){let e=this.isLinkActive(this.router);return this.link&&e(this.link)||this.links.some(e)}static \u0275fac=function(i){return new(i||t)(te(an),te(F),te(Se),te(Me))};static \u0275dir=R({type:t,selectors:[["","routerLinkActive",""]],contentQueries:function(i,r,o){if(i&1&&ct(o,Ni,5),i&2){let a;z(a=$())&&(r.links=a)}},inputs:{routerLinkActiveOptions:"routerLinkActiveOptions",ariaCurrentWhenActive:"ariaCurrentWhenActive",routerLinkActive:"routerLinkActive"},outputs:{isActiveChange:"isActiveChange"},exportAs:["routerLinkActive"],features:[Ae]})}return t})();function TP(t){let n=t;return!!(n.paths||n.matrixParams||n.queryParams||n.fragment)}var kP=new C("");function Cv(t,...n){return gi([{provide:Cc,multi:!0,useValue:t},{provide:Dn,useFactory:AP},{provide:Wl,multi:!0,useFactory:RP},n.map(e=>e.\u0275providers)])}function AP(){return c(an).routerState.root}function RP(){let t=c(X);return n=>{let e=t.get(nn);if(n!==e.components[0])return;let i=t.get(an),r=t.get(OP);t.get(PP)===1&&i.initialNavigation(),t.get(FP,null,{optional:!0})?.setUpPreloading(),t.get(kP,null,{optional:!0})?.init(),i.resetRootComponentType(e.componentTypes[0]),r.closed||(r.next(),r.complete(),r.unsubscribe())}}var OP=new C("",{factory:()=>new I}),PP=new C("",{factory:()=>1});var FP=new C("");var wv;try{wv=typeof Intl<"u"&&Intl.v8BreakIterator}catch{wv=!1}var ye=(()=>{class t{_platformId=c(Eo);isBrowser=this._platformId?_S(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||wv)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function cs(t){return Array.isArray(t)?t:[t]}var Lx=new Set,Uo,ds=(()=>{class t{_platform=c(ye);_nonce=c(Er,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):jP}matchMedia(e){return(this._platform.WEBKIT||this._platform.BLINK)&&LP(e,this._nonce),this._matchMedia(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function LP(t,n){if(!Lx.has(t))try{Uo||(Uo=document.createElement("style"),n&&Uo.setAttribute("nonce",n),Uo.setAttribute("type","text/css"),document.head.appendChild(Uo)),Uo.sheet&&(Uo.sheet.insertRule(`@media ${t.replace(/[{}]/g,"")} {body{ }}`,0),Lx.add(t))}catch(e){console.error(e)}}function jP(t){return{matches:t==="all"||t==="",media:t,addListener:()=>{},removeListener:()=>{}}}var zo=(()=>{class t{_mediaMatcher=c(ds);_zone=c(U);_queries=new Map;_destroySubject=new I;ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(e){return jx(cs(e)).some(r=>this._registerQuery(r).mql.matches)}observe(e){let r=jx(cs(e)).map(a=>this._registerQuery(a).observable),o=il(r);return o=fi(o.pipe(Le(1)),o.pipe(co(1),Zn(0))),o.pipe(J(a=>{let s={matches:!1,breakpoints:{}};return a.forEach(({matches:l,query:d})=>{s.matches=s.matches||l,s.breakpoints[d]=l}),s}))}_registerQuery(e){if(this._queries.has(e))return this._queries.get(e);let i=this._mediaMatcher.matchMedia(e),o={observable:new le(a=>{let s=l=>this._zone.run(()=>a.next(l));return i.addListener(s),()=>{i.removeListener(s)}}).pipe(qe(i),J(({matches:a})=>({query:e,matches:a})),he(this._destroySubject)),mql:i};return this._queries.set(e,o),o}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function jx(t){return t.map(n=>n.split(",")).reduce((n,e)=>n.concat(e)).map(n=>n.trim())}function $m(t){t||(t=c(Xe));let n=new le(e=>{if(t.destroyed){e.next();return}return t.onDestroy(e.next.bind(e))});return e=>e.pipe(he(n))}function us(t,n){let i=!n?.manualCleanup?n?.injector?.get(Xe)??c(Xe):null,r=BP(n?.equal),o;n?.requireSync?o=S({kind:0},{equal:r}):o=S({kind:1,value:n?.initialValue},{equal:r});let a,s=t.subscribe({next:l=>o.set({kind:1,value:l}),error:l=>{o.set({kind:2,error:l}),a?.()},complete:()=>{a?.()}});if(n?.requireSync&&o().kind===0)throw new H(601,!1);return a=i?.onDestroy(s.unsubscribe.bind(s)),De(()=>{let l=o();switch(l.kind){case 1:return l.value;case 2:throw l.error;case 0:throw new H(601,!1)}},{equal:n?.equal})}function BP(t=Object.is){return(n,e)=>n.kind===1&&e.kind===1&&t(n.value,e.value)}function $o(t){return t.buttons===0||t.detail===0}function Wo(t){let n=t.touches&&t.touches[0]||t.changedTouches&&t.changedTouches[0];return!!n&&n.identifier===-1&&(n.radiusX==null||n.radiusX===1)&&(n.radiusY==null||n.radiusY===1)}var Sv;function Vx(){if(Sv==null){let t=typeof document<"u"?document.head:null;Sv=!!(t&&(t.createShadowRoot||t.attachShadow))}return Sv}function xv(t){if(Vx()){let n=t.getRootNode?t.getRootNode():null;if(typeof ShadowRoot<"u"&&ShadowRoot&&n instanceof ShadowRoot)return n}return null}function ms(){let t=typeof document<"u"&&document?document.activeElement:null;for(;t&&t.shadowRoot;){let n=t.shadowRoot.activeElement;if(n===t)break;t=n}return t}function zt(t){if(t.composedPath)try{return t.composedPath()[0]}catch{}return t.target}var wc;function Bx(){if(wc==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>wc=!0}))}finally{wc=wc||!1}return wc}function fs(t){return Bx()?t:!!t.capture}function Vt(t,n=0){return Hx(t)?Number(t):arguments.length===2?n:0}function Hx(t){return!isNaN(parseFloat(t))&&!isNaN(Number(t))}function sn(t){return t instanceof F?t.nativeElement:t}var Ux=new C("cdk-input-modality-detector-options"),zx={ignoreKeys:[18,17,224,91,16]},$x=650,Dv={passive:!0,capture:!0},Wx=(()=>{class t{_platform=c(ye);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new Et(null);_options;_lastTouchMs=0;_onKeydown=e=>{this._options?.ignoreKeys?.some(i=>i===e.keyCode)||(this._modality.next("keyboard"),this._mostRecentTarget=zt(e))};_onMousedown=e=>{Date.now()-this._lastTouchMs<$x||(this._modality.next($o(e)?"keyboard":"mouse"),this._mostRecentTarget=zt(e))};_onTouchstart=e=>{if(Wo(e)){this._modality.next("keyboard");return}this._lastTouchMs=Date.now(),this._modality.next("touch"),this._mostRecentTarget=zt(e)};constructor(){let e=c(U),i=c(K),r=c(Ux,{optional:!0});if(this._options=b(b({},zx),r),this.modalityDetected=this._modality.pipe(co(1)),this.modalityChanged=this.modalityDetected.pipe(Ad()),this._platform.isBrowser){let o=c(Mt).createRenderer(null,null);this._listenerCleanups=e.runOutsideAngular(()=>[o.listen(i,"keydown",this._onKeydown,Dv),o.listen(i,"mousedown",this._onMousedown,Dv),o.listen(i,"touchstart",this._onTouchstart,Dv)])}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(e=>e())}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),Sc=(function(t){return t[t.IMMEDIATE=0]="IMMEDIATE",t[t.EVENTUAL=1]="EVENTUAL",t})(Sc||{}),Gx=new C("cdk-focus-monitor-default-options"),Wm=fs({passive:!0,capture:!0}),Bt=(()=>{class t{_ngZone=c(U);_platform=c(ye);_inputModalityDetector=c(Wx);_origin=null;_lastFocusOrigin=null;_windowFocused=!1;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=!1;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=!0,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=!1)};_document=c(K);_stopInputModalityDetector=new I;constructor(){let e=c(Gx,{optional:!0});this._detectionMode=e?.detectionMode||Sc.IMMEDIATE}_rootNodeFocusAndBlurListener=e=>{let i=zt(e);for(let r=i;r;r=r.parentElement)e.type==="focus"?this._onFocus(e,r):this._onBlur(e,r)};monitor(e,i=!1){let r=sn(e);if(!this._platform.isBrowser||r.nodeType!==1)return ne();let o=xv(r)||this._document,a=this._elementInfo.get(r);if(a)return i&&(a.checkChildren=!0),a.subject;let s={checkChildren:i,subject:new I,rootNode:o};return this._elementInfo.set(r,s),this._registerGlobalListeners(s),s.subject}stopMonitoring(e){let i=sn(e),r=this._elementInfo.get(i);r&&(r.subject.complete(),this._setClasses(i),this._elementInfo.delete(i),this._removeGlobalListeners(r))}focusVia(e,i,r){let o=sn(e),a=this._document.activeElement;o===a?this._getClosestElementsInfo(o).forEach(([s,l])=>this._originChanged(s,i,l)):(this._setOrigin(i),typeof o.focus=="function"&&o.focus(r))}ngOnDestroy(){this._elementInfo.forEach((e,i)=>this.stopMonitoring(i))}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(e){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(e)?"touch":"program":this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:e&&this._isLastInteractionFromInputLabel(e)?"mouse":"program"}_shouldBeAttributedToTouch(e){return this._detectionMode===Sc.EVENTUAL||!!e?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(e,i){e.classList.toggle("cdk-focused",!!i),e.classList.toggle("cdk-touch-focused",i==="touch"),e.classList.toggle("cdk-keyboard-focused",i==="keyboard"),e.classList.toggle("cdk-mouse-focused",i==="mouse"),e.classList.toggle("cdk-program-focused",i==="program")}_setOrigin(e,i=!1){this._ngZone.runOutsideAngular(()=>{if(this._origin=e,this._originFromTouchInteraction=e==="touch"&&i,this._detectionMode===Sc.IMMEDIATE){clearTimeout(this._originTimeoutId);let r=this._originFromTouchInteraction?$x:1;this._originTimeoutId=setTimeout(()=>this._origin=null,r)}})}_onFocus(e,i){let r=this._elementInfo.get(i),o=zt(e);!r||!r.checkChildren&&i!==o||this._originChanged(i,this._getFocusOrigin(o),r)}_onBlur(e,i){let r=this._elementInfo.get(i);!r||r.checkChildren&&e.relatedTarget instanceof Node&&i.contains(e.relatedTarget)||(this._setClasses(i),this._emitOrigin(r,null))}_emitOrigin(e,i){e.subject.observers.length&&this._ngZone.run(()=>e.subject.next(i))}_registerGlobalListeners(e){if(!this._platform.isBrowser)return;let i=e.rootNode,r=this._rootNodeFocusListenerCount.get(i)||0;r||this._ngZone.runOutsideAngular(()=>{i.addEventListener("focus",this._rootNodeFocusAndBlurListener,Wm),i.addEventListener("blur",this._rootNodeFocusAndBlurListener,Wm)}),this._rootNodeFocusListenerCount.set(i,r+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener("focus",this._windowFocusListener)}),this._inputModalityDetector.modalityDetected.pipe(he(this._stopInputModalityDetector)).subscribe(o=>{this._setOrigin(o,!0)}))}_removeGlobalListeners(e){let i=e.rootNode;if(this._rootNodeFocusListenerCount.has(i)){let r=this._rootNodeFocusListenerCount.get(i);r>1?this._rootNodeFocusListenerCount.set(i,r-1):(i.removeEventListener("focus",this._rootNodeFocusAndBlurListener,Wm),i.removeEventListener("blur",this._rootNodeFocusAndBlurListener,Wm),this._rootNodeFocusListenerCount.delete(i))}--this._monitoredElementCount||(this._getWindow().removeEventListener("focus",this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId))}_originChanged(e,i,r){this._setClasses(e,i),this._emitOrigin(r,i),this._lastFocusOrigin=i}_getClosestElementsInfo(e){let i=[];return this._elementInfo.forEach((r,o)=>{(o===e||r.checkChildren&&o.contains(e))&&i.push([o,r])}),i}_isLastInteractionFromInputLabel(e){let{_mostRecentTarget:i,mostRecentModality:r}=this._inputModalityDetector;if(r!=="mouse"||!i||i===e||e.nodeName!=="INPUT"&&e.nodeName!=="TEXTAREA"||e.disabled)return!1;let o=e.labels;if(o){for(let a=0;a<o.length;a++)if(o[a].contains(i))return!0}return!1}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),Ev=(()=>{class t{_elementRef=c(F);_focusMonitor=c(Bt);_monitorSubscription;_focusOrigin=null;cdkFocusChange=new O;get focusOrigin(){return this._focusOrigin}ngAfterViewInit(){let e=this._elementRef.nativeElement;this._monitorSubscription=this._focusMonitor.monitor(e,e.nodeType===1&&e.hasAttribute("cdkMonitorSubtreeFocus")).subscribe(i=>{this._focusOrigin=i,this.cdkFocusChange.emit(i)})}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef),this._monitorSubscription?.unsubscribe()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdkMonitorElementFocus",""],["","cdkMonitorSubtreeFocus",""]],outputs:{cdkFocusChange:"cdkFocusChange"},exportAs:["cdkMonitorFocus"]})}return t})();var Gm=new WeakMap,Je=(()=>{class t{_appRef;_injector=c(X);_environmentInjector=c(We);load(e){let i=this._appRef=this._appRef||this._injector.get(nn),r=Gm.get(i);r||(r={loaders:new Set,refs:[]},Gm.set(i,r),i.onDestroy(()=>{Gm.get(i)?.refs.forEach(o=>o.destroy()),Gm.delete(i)})),r.loaders.has(e)||(r.loaders.add(e),r.refs.push(im(e,{environmentInjector:this._environmentInjector})))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var hs=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["ng-component"]],exportAs:["cdkVisuallyHidden"],decls:0,vars:0,template:function(i,r){},styles:[`.cdk-visually-hidden {
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
`],encapsulation:2})}return t})(),qm;function HP(){if(qm===void 0&&(qm=null,typeof window<"u")){let t=window;if(t.trustedTypes!==void 0)try{qm=t.trustedTypes.createPolicy("angular#components",{createHTML:n=>n})}catch(n){console.error(n)}}return qm}function Go(t){return HP()?.createHTML(t)||t}function qx(t,n,e){let i=e.sanitize(ke.HTML,n);t.innerHTML=Go(i||"")}function UP(t){if(t.type==="characterData"&&t.target instanceof Comment)return!0;if(t.type==="childList"){for(let n=0;n<t.addedNodes.length;n++)if(!(t.addedNodes[n]instanceof Comment))return!1;for(let n=0;n<t.removedNodes.length;n++)if(!(t.removedNodes[n]instanceof Comment))return!1;return!0}return!1}var Yx=(()=>{class t{create(e){return typeof MutationObserver>"u"?null:new MutationObserver(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),Zx=(()=>{class t{_mutationObserverFactory=c(Yx);_observedElements=new Map;_ngZone=c(U);ngOnDestroy(){this._observedElements.forEach((e,i)=>this._cleanupObserver(i))}observe(e){let i=sn(e);return new le(r=>{let a=this._observeElement(i).pipe(J(s=>s.filter(l=>!UP(l))),ue(s=>!!s.length)).subscribe(s=>{this._ngZone.run(()=>{r.next(s)})});return()=>{a.unsubscribe(),this._unobserveElement(i)}})}_observeElement(e){return this._ngZone.runOutsideAngular(()=>{if(this._observedElements.has(e))this._observedElements.get(e).count++;else{let i=new I,r=this._mutationObserverFactory.create(o=>i.next(o));r&&r.observe(e,{characterData:!0,childList:!0,subtree:!0}),this._observedElements.set(e,{observer:r,stream:i,count:1})}return this._observedElements.get(e).stream})}_unobserveElement(e){this._observedElements.has(e)&&(this._observedElements.get(e).count--,this._observedElements.get(e).count||this._cleanupObserver(e))}_cleanupObserver(e){if(this._observedElements.has(e)){let{observer:i,stream:r}=this._observedElements.get(e);i&&i.disconnect(),r.complete(),this._observedElements.delete(e)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),Ym=(()=>{class t{_contentObserver=c(Zx);_elementRef=c(F);event=new O;get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._disabled?this._unsubscribe():this._subscribe()}_disabled=!1;get debounce(){return this._debounce}set debounce(e){this._debounce=Vt(e),this._subscribe()}_debounce;_currentSubscription=null;ngAfterContentInit(){!this._currentSubscription&&!this.disabled&&this._subscribe()}ngOnDestroy(){this._unsubscribe()}_subscribe(){this._unsubscribe();let e=this._contentObserver.observe(this._elementRef);this._currentSubscription=(this.debounce?e.pipe(Zn(this.debounce)):e).subscribe(this.event)}_unsubscribe(){this._currentSubscription?.unsubscribe()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdkObserveContent",""]],inputs:{disabled:[2,"cdkObserveContentDisabled","disabled",G],debounce:"debounce"},outputs:{event:"cdkObserveContent"},exportAs:["cdkObserveContent"]})}return t})(),ps=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({providers:[Yx]})}return t})();var gs=(()=>{class t{_platform=c(ye);isDisabled(e){return e.hasAttribute("disabled")}isVisible(e){return $P(e)&&getComputedStyle(e).visibility==="visible"}isTabbable(e){if(!this._platform.isBrowser)return!1;let i=zP(KP(e));if(i&&(Qx(i)===-1||!this.isVisible(i)))return!1;let r=e.nodeName.toLowerCase(),o=Qx(e);return e.hasAttribute("contenteditable")?o!==-1:r==="iframe"||r==="object"||this._platform.WEBKIT&&this._platform.IOS&&!QP(e)?!1:r==="audio"?e.hasAttribute("controls")?o!==-1:!1:r==="video"?o===-1?!1:o!==null?!0:this._platform.FIREFOX||e.hasAttribute("controls"):e.tabIndex>=0}isFocusable(e,i){return XP(e)&&!this.isDisabled(e)&&(i?.ignoreVisibility||this.isVisible(e))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function zP(t){try{return t.frameElement}catch{return null}}function $P(t){return!!(t.offsetWidth||t.offsetHeight||typeof t.getClientRects=="function"&&t.getClientRects().length)}function WP(t){let n=t.nodeName.toLowerCase();return n==="input"||n==="select"||n==="button"||n==="textarea"}function GP(t){return YP(t)&&t.type=="hidden"}function qP(t){return ZP(t)&&t.hasAttribute("href")}function YP(t){return t.nodeName.toLowerCase()=="input"}function ZP(t){return t.nodeName.toLowerCase()=="a"}function Jx(t){if(!t.hasAttribute("tabindex")||t.tabIndex===void 0)return!1;let n=t.getAttribute("tabindex");return!!(n&&!isNaN(parseInt(n,10)))}function Qx(t){if(!Jx(t))return null;let n=parseInt(t.getAttribute("tabindex")||"",10);return isNaN(n)?-1:n}function QP(t){let n=t.nodeName.toLowerCase(),e=n==="input"&&t.type;return e==="text"||e==="password"||n==="select"||n==="textarea"}function XP(t){return GP(t)?!1:WP(t)||qP(t)||t.hasAttribute("contenteditable")||Jx(t)}function KP(t){return t.ownerDocument&&t.ownerDocument.defaultView||window}var Zm=class{_element;_checker;_ngZone;_document;_injector;_startAnchor=null;_endAnchor=null;_hasAttached=!1;startAnchorListener=()=>{!this.focusLastTabbableElement()&&this._checker.isFocusable(this._element)&&this._element.focus()};endAnchorListener=()=>{!this.focusFirstTabbableElement()&&this._checker.isFocusable(this._element)&&this._element.focus()};get enabled(){return this._enabled}set enabled(n){this._enabled=n,this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(n,this._startAnchor),this._toggleAnchorTabIndex(n,this._endAnchor))}_enabled=!0;constructor(n,e,i,r,o=!1,a){this._element=n,this._checker=e,this._ngZone=i,this._document=r,this._injector=a,o||this.attachAnchors()}destroy(){let n=this._startAnchor,e=this._endAnchor;n&&(n.removeEventListener("focus",this.startAnchorListener),n.remove()),e&&(e.removeEventListener("focus",this.endAnchorListener),e.remove()),this._startAnchor=this._endAnchor=null,this._hasAttached=!1}attachAnchors(){return this._hasAttached?!0:(this._ngZone.runOutsideAngular(()=>{this._startAnchor||(this._startAnchor=this._createAnchor(),this._startAnchor.addEventListener("focus",this.startAnchorListener)),this._endAnchor||(this._endAnchor=this._createAnchor(),this._endAnchor.addEventListener("focus",this.endAnchorListener))}),this._element.parentNode&&(this._element.parentNode.insertBefore(this._startAnchor,this._element),this._element.parentNode.insertBefore(this._endAnchor,this._element.nextSibling),this._hasAttached=!0),this._hasAttached)}focusInitialElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusInitialElement(n)))})}focusFirstTabbableElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusFirstTabbableElement(n)))})}focusLastTabbableElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusLastTabbableElement(n)))})}_getRegionBoundary(n){let e=this._element.querySelectorAll(`[cdk-focus-region-${n}], [cdkFocusRegion${n}], [cdk-focus-${n}]`);return n=="start"?e.length?e[0]:this._getFirstTabbableElement(this._element):e.length?e[e.length-1]:this._getLastTabbableElement(this._element)}focusInitialElement(n){let e=this._element.querySelector("[cdk-focus-initial], [cdkFocusInitial]");if(e){if(!this._checker.isFocusable(e)){let i=this._getFirstTabbableElement(e);return i?.focus(n),!!i}return e.focus(n),!0}return this.focusFirstTabbableElement(n)}focusFirstTabbableElement(n){let e=this._getRegionBoundary("start");return e&&e.focus(n),!!e}focusLastTabbableElement(n){let e=this._getRegionBoundary("end");return e&&e.focus(n),!!e}hasAttached(){return this._hasAttached}_getFirstTabbableElement(n){if(this._checker.isFocusable(n)&&this._checker.isTabbable(n))return n;let e=n.children;for(let i=0;i<e.length;i++){let r=e[i].nodeType===this._document.ELEMENT_NODE?this._getFirstTabbableElement(e[i]):null;if(r)return r}return null}_getLastTabbableElement(n){if(this._checker.isFocusable(n)&&this._checker.isTabbable(n))return n;let e=n.children;for(let i=e.length-1;i>=0;i--){let r=e[i].nodeType===this._document.ELEMENT_NODE?this._getLastTabbableElement(e[i]):null;if(r)return r}return null}_createAnchor(){let n=this._document.createElement("div");return this._toggleAnchorTabIndex(this._enabled,n),n.classList.add("cdk-visually-hidden"),n.classList.add("cdk-focus-trap-anchor"),n.setAttribute("aria-hidden","true"),n}_toggleAnchorTabIndex(n,e){n?e.setAttribute("tabindex","0"):e.removeAttribute("tabindex")}toggleAnchors(n){this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(n,this._startAnchor),this._toggleAnchorTabIndex(n,this._endAnchor))}_executeOnStable(n){tt(n,{injector:this._injector})}},xc=(()=>{class t{_checker=c(gs);_ngZone=c(U);_document=c(K);_injector=c(X);constructor(){c(Je).load(hs)}create(e,i=!1){return new Zm(e,this._checker,this._ngZone,this._document,i,this._injector)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var eD=new C("liveAnnouncerElement",{providedIn:"root",factory:()=>null}),tD=new C("LIVE_ANNOUNCER_DEFAULT_OPTIONS"),JP=0,Nv=(()=>{class t{_ngZone=c(U);_defaultOptions=c(tD,{optional:!0});_liveElement;_document=c(K);_sanitizer=c(rc);_previousTimeout;_currentPromise;_currentResolve;constructor(){let e=c(eD,{optional:!0});this._liveElement=e||this._createLiveElement()}announce(e,...i){let r=this._defaultOptions,o,a;return i.length===1&&typeof i[0]=="number"?a=i[0]:[o,a]=i,this.clear(),clearTimeout(this._previousTimeout),o||(o=r&&r.politeness?r.politeness:"polite"),a==null&&r&&(a=r.duration),this._liveElement.setAttribute("aria-live",o),this._liveElement.id&&this._exposeAnnouncerToModals(this._liveElement.id),this._ngZone.runOutsideAngular(()=>(this._currentPromise||(this._currentPromise=new Promise(s=>this._currentResolve=s)),clearTimeout(this._previousTimeout),this._previousTimeout=setTimeout(()=>{!e||typeof e=="string"?this._liveElement.textContent=e:qx(this._liveElement,e,this._sanitizer),typeof a=="number"&&(this._previousTimeout=setTimeout(()=>this.clear(),a)),this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0},100),this._currentPromise))}clear(){this._liveElement&&(this._liveElement.textContent="")}ngOnDestroy(){clearTimeout(this._previousTimeout),this._liveElement?.remove(),this._liveElement=null,this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0}_createLiveElement(){let e="cdk-live-announcer-element",i=this._document.getElementsByClassName(e),r=this._document.createElement("div");for(let o=0;o<i.length;o++)i[o].remove();return r.classList.add(e),r.classList.add("cdk-visually-hidden"),r.setAttribute("aria-atomic","true"),r.setAttribute("aria-live","polite"),r.id=`cdk-live-announcer-${JP++}`,this._document.body.appendChild(r),r}_exposeAnnouncerToModals(e){let i=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let r=0;r<i.length;r++){let o=i[r],a=o.getAttribute("aria-owns");a?a.indexOf(e)===-1&&o.setAttribute("aria-owns",a+" "+e):o.setAttribute("aria-owns",e)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var Pr=(function(t){return t[t.NONE=0]="NONE",t[t.BLACK_ON_WHITE=1]="BLACK_ON_WHITE",t[t.WHITE_ON_BLACK=2]="WHITE_ON_BLACK",t})(Pr||{}),Xx="cdk-high-contrast-black-on-white",Kx="cdk-high-contrast-white-on-black",Mv="cdk-high-contrast-active",nD=(()=>{class t{_platform=c(ye);_hasCheckedHighContrastMode=!1;_document=c(K);_breakpointSubscription;constructor(){this._breakpointSubscription=c(zo).observe("(forced-colors: active)").subscribe(()=>{this._hasCheckedHighContrastMode&&(this._hasCheckedHighContrastMode=!1,this._applyBodyHighContrastModeCssClasses())})}getHighContrastMode(){if(!this._platform.isBrowser)return Pr.NONE;let e=this._document.createElement("div");e.style.backgroundColor="rgb(1,2,3)",e.style.position="absolute",this._document.body.appendChild(e);let i=this._document.defaultView||window,r=i&&i.getComputedStyle?i.getComputedStyle(e):null,o=(r&&r.backgroundColor||"").replace(/ /g,"");switch(e.remove(),o){case"rgb(0,0,0)":case"rgb(45,50,54)":case"rgb(32,32,32)":return Pr.WHITE_ON_BLACK;case"rgb(255,255,255)":case"rgb(255,250,239)":return Pr.BLACK_ON_WHITE}return Pr.NONE}ngOnDestroy(){this._breakpointSubscription.unsubscribe()}_applyBodyHighContrastModeCssClasses(){if(!this._hasCheckedHighContrastMode&&this._platform.isBrowser&&this._document.body){let e=this._document.body.classList;e.remove(Mv,Xx,Kx),this._hasCheckedHighContrastMode=!0;let i=this.getHighContrastMode();i===Pr.BLACK_ON_WHITE?e.add(Mv,Xx):i===Pr.WHITE_ON_BLACK&&e.add(Mv,Kx)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),Dc=(()=>{class t{constructor(){c(nD)._applyBodyHighContrastModeCssClasses()}static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ps]})}return t})();var eF=200,Qm=class{_letterKeyStream=new I;_items=[];_selectedItemIndex=-1;_pressedLetters=[];_skipPredicateFn;_selectedItem=new I;selectedItem=this._selectedItem;constructor(n,e){let i=typeof e?.debounceInterval=="number"?e.debounceInterval:eF;e?.skipPredicate&&(this._skipPredicateFn=e.skipPredicate),this.setItems(n),this._setupKeyHandler(i)}destroy(){this._pressedLetters=[],this._letterKeyStream.complete(),this._selectedItem.complete()}setCurrentSelectedItemIndex(n){this._selectedItemIndex=n}setItems(n){this._items=n}handleKey(n){let e=n.keyCode;n.key&&n.key.length===1?this._letterKeyStream.next(n.key.toLocaleUpperCase()):(e>=65&&e<=90||e>=48&&e<=57)&&this._letterKeyStream.next(String.fromCharCode(e))}isTyping(){return this._pressedLetters.length>0}reset(){this._pressedLetters=[]}_setupKeyHandler(n){this._letterKeyStream.pipe(Ft(e=>this._pressedLetters.push(e)),Zn(n),ue(()=>this._pressedLetters.length>0),J(()=>this._pressedLetters.join("").toLocaleUpperCase())).subscribe(e=>{for(let i=1;i<this._items.length+1;i++){let r=(this._selectedItemIndex+i)%this._items.length,o=this._items[r];if(!this._skipPredicateFn?.(o)&&o.getLabel?.().toLocaleUpperCase().trim().indexOf(e)===0){this._selectedItem.next(o);break}}this._pressedLetters=[]})}};function ut(t,...n){return n.length?n.some(e=>t[e]):t.altKey||t.shiftKey||t.ctrlKey||t.metaKey}var _s=class{_items;_activeItemIndex=S(-1);_activeItem=S(null);_wrap=!1;_typeaheadSubscription=ce.EMPTY;_itemChangesSubscription;_vertical=!0;_horizontal=null;_allowedModifierKeys=[];_homeAndEnd=!1;_pageUpAndDown={enabled:!1,delta:10};_effectRef;_typeahead;_skipPredicateFn=n=>n.disabled;constructor(n,e){this._items=n,n instanceof hn?this._itemChangesSubscription=n.changes.subscribe(i=>this._itemsChanged(i.toArray())):yn(n)&&(this._effectRef=vt(()=>this._itemsChanged(n()),{injector:e}))}tabOut=new I;change=new I;skipPredicate(n){return this._skipPredicateFn=n,this}withWrap(n=!0){return this._wrap=n,this}withVerticalOrientation(n=!0){return this._vertical=n,this}withHorizontalOrientation(n){return this._horizontal=n,this}withAllowedModifierKeys(n){return this._allowedModifierKeys=n,this}withTypeAhead(n=200){this._typeaheadSubscription.unsubscribe();let e=this._getItemsArray();return this._typeahead=new Qm(e,{debounceInterval:typeof n=="number"?n:void 0,skipPredicate:i=>this._skipPredicateFn(i)}),this._typeaheadSubscription=this._typeahead.selectedItem.subscribe(i=>{this.setActiveItem(i)}),this}cancelTypeahead(){return this._typeahead?.reset(),this}withHomeAndEnd(n=!0){return this._homeAndEnd=n,this}withPageUpDown(n=!0,e=10){return this._pageUpAndDown={enabled:n,delta:e},this}setActiveItem(n){let e=this._activeItem();this.updateActiveItem(n),this._activeItem()!==e&&this.change.next(this._activeItemIndex())}onKeydown(n){let e=n.keyCode,r=["altKey","ctrlKey","metaKey","shiftKey"].every(o=>!n[o]||this._allowedModifierKeys.indexOf(o)>-1);switch(e){case 9:this.tabOut.next();return;case 40:if(this._vertical&&r){this.setNextItemActive();break}else return;case 38:if(this._vertical&&r){this.setPreviousItemActive();break}else return;case 39:if(this._horizontal&&r){this._horizontal==="rtl"?this.setPreviousItemActive():this.setNextItemActive();break}else return;case 37:if(this._horizontal&&r){this._horizontal==="rtl"?this.setNextItemActive():this.setPreviousItemActive();break}else return;case 36:if(this._homeAndEnd&&r){this.setFirstItemActive();break}else return;case 35:if(this._homeAndEnd&&r){this.setLastItemActive();break}else return;case 33:if(this._pageUpAndDown.enabled&&r){let o=this._activeItemIndex()-this._pageUpAndDown.delta;this._setActiveItemByIndex(o>0?o:0,1);break}else return;case 34:if(this._pageUpAndDown.enabled&&r){let o=this._activeItemIndex()+this._pageUpAndDown.delta,a=this._getItemsArray().length;this._setActiveItemByIndex(o<a?o:a-1,-1);break}else return;default:(r||ut(n,"shiftKey"))&&this._typeahead?.handleKey(n);return}this._typeahead?.reset(),n.preventDefault()}get activeItemIndex(){return this._activeItemIndex()}get activeItem(){return this._activeItem()}isTyping(){return!!this._typeahead&&this._typeahead.isTyping()}setFirstItemActive(){this._setActiveItemByIndex(0,1)}setLastItemActive(){this._setActiveItemByIndex(this._getItemsArray().length-1,-1)}setNextItemActive(){this._activeItemIndex()<0?this.setFirstItemActive():this._setActiveItemByDelta(1)}setPreviousItemActive(){this._activeItemIndex()<0&&this._wrap?this.setLastItemActive():this._setActiveItemByDelta(-1)}updateActiveItem(n){let e=this._getItemsArray(),i=typeof n=="number"?n:e.indexOf(n),r=e[i];this._activeItem.set(r??null),this._activeItemIndex.set(i),this._typeahead?.setCurrentSelectedItemIndex(i)}destroy(){this._typeaheadSubscription.unsubscribe(),this._itemChangesSubscription?.unsubscribe(),this._effectRef?.destroy(),this._typeahead?.destroy(),this.tabOut.complete(),this.change.complete()}_setActiveItemByDelta(n){this._wrap?this._setActiveInWrapMode(n):this._setActiveInDefaultMode(n)}_setActiveInWrapMode(n){let e=this._getItemsArray();for(let i=1;i<=e.length;i++){let r=(this._activeItemIndex()+n*i+e.length)%e.length,o=e[r];if(!this._skipPredicateFn(o)){this.setActiveItem(r);return}}}_setActiveInDefaultMode(n){this._setActiveItemByIndex(this._activeItemIndex()+n,n)}_setActiveItemByIndex(n,e){let i=this._getItemsArray();if(i[n]){for(;this._skipPredicateFn(i[n]);)if(n+=e,!i[n])return;this.setActiveItem(n)}}_getItemsArray(){return yn(this._items)?this._items():this._items instanceof hn?this._items.toArray():this._items}_itemsChanged(n){this._typeahead?.setItems(n);let e=this._activeItem();if(e){let i=n.indexOf(e);i>-1&&i!==this._activeItemIndex()&&(this._activeItemIndex.set(i),this._typeahead?.setCurrentSelectedItemIndex(i))}}};var Tc=class extends _s{setActiveItem(n){this.activeItem&&this.activeItem.setInactiveStyles(),super.setActiveItem(n),this.activeItem&&this.activeItem.setActiveStyles()}};var Fr=class extends _s{_origin="program";setFocusOrigin(n){return this._origin=n,this}setActiveItem(n){super.setActiveItem(n),this.activeItem&&this.activeItem.focus(this._origin)}};var rD=new Map,Ue=class t{_appId=c(Wi);static _infix=`a${Math.floor(Math.random()*1e5).toString()}`;getId(n,e=!1){this._appId!=="ng"&&(n+=this._appId);let i=rD.get(n);return i===void 0?i=0:i++,rD.set(n,i),`${n}${e?t._infix+"-":""}${i}`}static \u0275fac=function(e){return new(e||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})};var aD=" ";function tF(t,n,e){let i=Km(t,n);e=e.trim(),!i.some(r=>r.trim()===e)&&(i.push(e),t.setAttribute(n,i.join(aD)))}function nF(t,n,e){let i=Km(t,n);e=e.trim();let r=i.filter(o=>o!==e);r.length?t.setAttribute(n,r.join(aD)):t.removeAttribute(n)}function Km(t,n){return t.getAttribute(n)?.match(/\S+/g)??[]}var sD="cdk-describedby-message",Xm="cdk-describedby-host",Tv=0,lD=(()=>{class t{_platform=c(ye);_document=c(K);_messageRegistry=new Map;_messagesContainer=null;_id=`${Tv++}`;constructor(){c(Je).load(hs),this._id=c(Wi)+"-"+Tv++}describe(e,i,r){if(!this._canBeDescribed(e,i))return;let o=Iv(i,r);typeof i!="string"?(oD(i,this._id),this._messageRegistry.set(o,{messageElement:i,referenceCount:0})):this._messageRegistry.has(o)||this._createMessageElement(i,r),this._isElementDescribedByMessage(e,o)||this._addMessageReference(e,o)}removeDescription(e,i,r){if(!i||!this._isElementNode(e))return;let o=Iv(i,r);if(this._isElementDescribedByMessage(e,o)&&this._removeMessageReference(e,o),typeof i=="string"){let a=this._messageRegistry.get(o);a&&a.referenceCount===0&&this._deleteMessageElement(o)}this._messagesContainer?.childNodes.length===0&&(this._messagesContainer.remove(),this._messagesContainer=null)}ngOnDestroy(){let e=this._document.querySelectorAll(`[${Xm}="${this._id}"]`);for(let i=0;i<e.length;i++)this._removeCdkDescribedByReferenceIds(e[i]),e[i].removeAttribute(Xm);this._messagesContainer?.remove(),this._messagesContainer=null,this._messageRegistry.clear()}_createMessageElement(e,i){let r=this._document.createElement("div");oD(r,this._id),r.textContent=e,i&&r.setAttribute("role",i),this._createMessagesContainer(),this._messagesContainer.appendChild(r),this._messageRegistry.set(Iv(e,i),{messageElement:r,referenceCount:0})}_deleteMessageElement(e){this._messageRegistry.get(e)?.messageElement?.remove(),this._messageRegistry.delete(e)}_createMessagesContainer(){if(this._messagesContainer)return;let e="cdk-describedby-message-container",i=this._document.querySelectorAll(`.${e}[platform="server"]`);for(let o=0;o<i.length;o++)i[o].remove();let r=this._document.createElement("div");r.style.visibility="hidden",r.classList.add(e),r.classList.add("cdk-visually-hidden"),this._platform.isBrowser||r.setAttribute("platform","server"),this._document.body.appendChild(r),this._messagesContainer=r}_removeCdkDescribedByReferenceIds(e){let i=Km(e,"aria-describedby").filter(r=>r.indexOf(sD)!=0);e.setAttribute("aria-describedby",i.join(" "))}_addMessageReference(e,i){let r=this._messageRegistry.get(i);tF(e,"aria-describedby",r.messageElement.id),e.setAttribute(Xm,this._id),r.referenceCount++}_removeMessageReference(e,i){let r=this._messageRegistry.get(i);r.referenceCount--,nF(e,"aria-describedby",r.messageElement.id),e.removeAttribute(Xm)}_isElementDescribedByMessage(e,i){let r=Km(e,"aria-describedby"),o=this._messageRegistry.get(i),a=o&&o.messageElement.id;return!!a&&r.indexOf(a)!=-1}_canBeDescribed(e,i){if(!this._isElementNode(e))return!1;if(i&&typeof i=="object")return!0;let r=i==null?"":`${i}`.trim(),o=e.getAttribute("aria-label");return r?!o||o.trim()!==r:!1}_isElementNode(e){return e.nodeType===this._document.ELEMENT_NODE}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function Iv(t,n){return typeof t=="string"?`${n||""}/${t}`:t}function oD(t,n){t.id||(t.id=`${sD}-${n}-${Tv++}`)}var ai=(function(t){return t[t.NORMAL=0]="NORMAL",t[t.NEGATED=1]="NEGATED",t[t.INVERTED=2]="INVERTED",t})(ai||{}),Jm,qo;function ef(){if(qo==null){if(typeof document!="object"||!document||typeof Element!="function"||!Element)return qo=!1,qo;if(document.documentElement?.style&&"scrollBehavior"in document.documentElement.style)qo=!0;else{let t=Element.prototype.scrollTo;t?qo=!/\{\s*\[native code\]\s*\}/.test(t.toString()):qo=!1}}return qo}function vs(){if(typeof document!="object"||!document)return ai.NORMAL;if(Jm==null){let t=document.createElement("div"),n=t.style;t.dir="rtl",n.width="1px",n.overflow="auto",n.visibility="hidden",n.pointerEvents="none",n.position="absolute";let e=document.createElement("div"),i=e.style;i.width="2px",i.height="1px",t.appendChild(e),document.body.appendChild(t),Jm=ai.NORMAL,t.scrollLeft===0&&(t.scrollLeft=1,Jm=t.scrollLeft===0?ai.NEGATED:ai.INVERTED),t.remove()}return Jm}function kv(){return typeof __karma__<"u"&&!!__karma__||typeof jasmine<"u"&&!!jasmine||typeof jest<"u"&&!!jest||typeof Mocha<"u"&&!!Mocha}var bs,cD=["color","button","checkbox","date","datetime-local","email","file","hidden","image","month","number","password","radio","range","reset","search","submit","tel","text","time","url","week"];function Av(){if(bs)return bs;if(typeof document!="object"||!document)return bs=new Set(cD),bs;let t=document.createElement("input");return bs=new Set(cD.filter(n=>(t.setAttribute("type",n),t.type===n))),bs}var iF=new C("MATERIAL_ANIMATIONS"),dD=null;function kc(){return c(iF,{optional:!0})?.animationsDisabled||c(xl,{optional:!0})==="NoopAnimations"?"di-disabled":(dD??=c(ds).matchMedia("(prefers-reduced-motion)").matches,dD?"reduced-motion":"enabled")}function Te(){return kc()!=="enabled"}function Dt(t){return t==null?"":typeof t=="string"?t:`${t}px`}function lt(t){return t!=null&&`${t}`!="false"}var jn=(function(t){return t[t.FADING_IN=0]="FADING_IN",t[t.VISIBLE=1]="VISIBLE",t[t.FADING_OUT=2]="FADING_OUT",t[t.HIDDEN=3]="HIDDEN",t})(jn||{}),Rv=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=jn.HIDDEN;constructor(n,e,i,r=!1){this._renderer=n,this.element=e,this.config=i,this._animationForciblyDisabledThroughCss=r}fadeOut(){this._renderer.fadeOutRipple(this)}},uD=fs({passive:!0,capture:!0}),Ov=class{_events=new Map;addHandler(n,e,i,r){let o=this._events.get(e);if(o){let a=o.get(i);a?a.add(r):o.set(i,new Set([r]))}else this._events.set(e,new Map([[i,new Set([r])]])),n.runOutsideAngular(()=>{document.addEventListener(e,this._delegateEventHandler,uD)})}removeHandler(n,e,i){let r=this._events.get(n);if(!r)return;let o=r.get(e);o&&(o.delete(i),o.size===0&&r.delete(e),r.size===0&&(this._events.delete(n),document.removeEventListener(n,this._delegateEventHandler,uD)))}_delegateEventHandler=n=>{let e=zt(n);e&&this._events.get(n.type)?.forEach((i,r)=>{(r===e||r.contains(e))&&i.forEach(o=>o.handleEvent(n))})}},Ac={enterDuration:225,exitDuration:150},rF=800,mD=fs({passive:!0,capture:!0}),fD=["mousedown","touchstart"],hD=["mouseup","mouseleave","touchend","touchcancel"],oF=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(i,r){},styles:[`.mat-ripple {
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
`],encapsulation:2})}return t})(),Yo=class t{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=!1;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=!1;_containerRect=null;static _eventManager=new Ov;constructor(n,e,i,r,o){this._target=n,this._ngZone=e,this._platform=r,r.isBrowser&&(this._containerElement=sn(i)),o&&o.get(Je).load(oF)}fadeInRipple(n,e,i={}){let r=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),o=b(b({},Ac),i.animation);i.centered&&(n=r.left+r.width/2,e=r.top+r.height/2);let a=i.radius||aF(n,e,r),s=n-r.left,l=e-r.top,d=o.enterDuration,u=document.createElement("div");u.classList.add("mat-ripple-element"),u.style.left=`${s-a}px`,u.style.top=`${l-a}px`,u.style.height=`${a*2}px`,u.style.width=`${a*2}px`,i.color!=null&&(u.style.backgroundColor=i.color),u.style.transitionDuration=`${d}ms`,this._containerElement.appendChild(u);let h=window.getComputedStyle(u),_=h.transitionProperty,v=h.transitionDuration,x=_==="none"||v==="0s"||v==="0s, 0s"||r.width===0&&r.height===0,A=new Rv(this,u,i,x);u.style.transform="scale3d(1, 1, 1)",A.state=jn.FADING_IN,i.persistent||(this._mostRecentTransientRipple=A);let re=null;return!x&&(d||o.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let oe=()=>{re&&(re.fallbackTimer=null),clearTimeout(Tt),this._finishRippleTransition(A)},Qe=()=>this._destroyRipple(A),Tt=setTimeout(Qe,d+100);u.addEventListener("transitionend",oe),u.addEventListener("transitioncancel",Qe),re={onTransitionEnd:oe,onTransitionCancel:Qe,fallbackTimer:Tt}}),this._activeRipples.set(A,re),(x||!d)&&this._finishRippleTransition(A),A}fadeOutRipple(n){if(n.state===jn.FADING_OUT||n.state===jn.HIDDEN)return;let e=n.element,i=b(b({},Ac),n.config.animation);e.style.transitionDuration=`${i.exitDuration}ms`,e.style.opacity="0",n.state=jn.FADING_OUT,(n._animationForciblyDisabledThroughCss||!i.exitDuration)&&this._finishRippleTransition(n)}fadeOutAll(){this._getActiveRipples().forEach(n=>n.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(n=>{n.config.persistent||n.fadeOut()})}setupTriggerEvents(n){let e=sn(n);!this._platform.isBrowser||!e||e===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=e,fD.forEach(i=>{t._eventManager.addHandler(this._ngZone,i,e,this)}))}handleEvent(n){n.type==="mousedown"?this._onMousedown(n):n.type==="touchstart"?this._onTouchStart(n):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{hD.forEach(e=>{this._triggerElement.addEventListener(e,this,mD)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(n){n.state===jn.FADING_IN?this._startFadeOutTransition(n):n.state===jn.FADING_OUT&&this._destroyRipple(n)}_startFadeOutTransition(n){let e=n===this._mostRecentTransientRipple,{persistent:i}=n.config;n.state=jn.VISIBLE,!i&&(!e||!this._isPointerDown)&&n.fadeOut()}_destroyRipple(n){let e=this._activeRipples.get(n)??null;this._activeRipples.delete(n),this._activeRipples.size||(this._containerRect=null),n===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),n.state=jn.HIDDEN,e!==null&&(n.element.removeEventListener("transitionend",e.onTransitionEnd),n.element.removeEventListener("transitioncancel",e.onTransitionCancel),e.fallbackTimer!==null&&clearTimeout(e.fallbackTimer)),n.element.remove()}_onMousedown(n){let e=$o(n),i=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+rF;!this._target.rippleDisabled&&!e&&!i&&(this._isPointerDown=!0,this.fadeInRipple(n.clientX,n.clientY,this._target.rippleConfig))}_onTouchStart(n){if(!this._target.rippleDisabled&&!Wo(n)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let e=n.changedTouches;if(e)for(let i=0;i<e.length;i++)this.fadeInRipple(e[i].clientX,e[i].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(n=>{let e=n.state===jn.VISIBLE||n.config.terminateOnPointerUp&&n.state===jn.FADING_IN;!n.config.persistent&&e&&n.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let n=this._triggerElement;n&&(fD.forEach(e=>t._eventManager.removeHandler(e,n,this)),this._pointerUpEventsRegistered&&(hD.forEach(e=>n.removeEventListener(e,this,mD)),this._pointerUpEventsRegistered=!1))}};function aF(t,n,e){let i=Math.max(Math.abs(t-e.left),Math.abs(t-e.right)),r=Math.max(Math.abs(n-e.top),Math.abs(n-e.bottom));return Math.sqrt(i*i+r*r)}var ys=new C("mat-ripple-global-options"),tr=(()=>{class t{_elementRef=c(F);_animationsDisabled=Te();color;unbounded=!1;centered=!1;radius=0;animation;get disabled(){return this._disabled}set disabled(e){e&&this.fadeOutAllNonPersistent(),this._disabled=e,this._setupTriggerEventsIfEnabled()}_disabled=!1;get trigger(){return this._trigger||this._elementRef.nativeElement}set trigger(e){this._trigger=e,this._setupTriggerEventsIfEnabled()}_trigger;_rippleRenderer;_globalOptions;_isInitialized=!1;constructor(){let e=c(U),i=c(ye),r=c(ys,{optional:!0}),o=c(X);this._globalOptions=r||{},this._rippleRenderer=new Yo(this,e,this._elementRef,i,o)}ngOnInit(){this._isInitialized=!0,this._setupTriggerEventsIfEnabled()}ngOnDestroy(){this._rippleRenderer._removeTriggerEvents()}fadeOutAll(){this._rippleRenderer.fadeOutAll()}fadeOutAllNonPersistent(){this._rippleRenderer.fadeOutAllNonPersistent()}get rippleConfig(){return{centered:this.centered,radius:this.radius,color:this.color,animation:b(b(b({},this._globalOptions.animation),this._animationsDisabled?{enterDuration:0,exitDuration:0}:{}),this.animation),terminateOnPointerUp:this._globalOptions.terminateOnPointerUp}}get rippleDisabled(){return this.disabled||!!this._globalOptions.disabled}_setupTriggerEventsIfEnabled(){!this.disabled&&this._isInitialized&&this._rippleRenderer.setupTriggerEvents(this.trigger)}launch(e,i=0,r){return typeof e=="number"?this._rippleRenderer.fadeInRipple(e,i,b(b({},this.rippleConfig),r)):this._rippleRenderer.fadeInRipple(0,0,b(b({},this.rippleConfig),e))}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","mat-ripple",""],["","matRipple",""]],hostAttrs:[1,"mat-ripple"],hostVars:2,hostBindings:function(i,r){i&2&&T("mat-ripple-unbounded",r.unbounded)},inputs:{color:[0,"matRippleColor","color"],unbounded:[0,"matRippleUnbounded","unbounded"],centered:[0,"matRippleCentered","centered"],radius:[0,"matRippleRadius","radius"],animation:[0,"matRippleAnimation","animation"],disabled:[0,"matRippleDisabled","disabled"],trigger:[0,"matRippleTrigger","trigger"]},exportAs:["matRipple"]})}return t})();var sF={capture:!0},lF=["focus","mousedown","mouseenter","touchstart"],Pv="mat-ripple-loader-uninitialized",Fv="mat-ripple-loader-class-name",pD="mat-ripple-loader-centered",tf="mat-ripple-loader-disabled",gD=(()=>{class t{_document=c(K);_animationsDisabled=Te();_globalRippleOptions=c(ys,{optional:!0});_platform=c(ye);_ngZone=c(U);_injector=c(X);_eventCleanups;_hosts=new Map;constructor(){let e=c(Mt).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>lF.map(i=>e.listen(this._document,i,this._onInteraction,sF)))}ngOnDestroy(){let e=this._hosts.keys();for(let i of e)this.destroyRipple(i);this._eventCleanups.forEach(i=>i())}configureRipple(e,i){e.setAttribute(Pv,this._globalRippleOptions?.namespace??""),(i.className||!e.hasAttribute(Fv))&&e.setAttribute(Fv,i.className||""),i.centered&&e.setAttribute(pD,""),i.disabled&&e.setAttribute(tf,"")}setDisabled(e,i){let r=this._hosts.get(e);r?(r.target.rippleDisabled=i,!i&&!r.hasSetUpEvents&&(r.hasSetUpEvents=!0,r.renderer.setupTriggerEvents(e))):i?e.setAttribute(tf,""):e.removeAttribute(tf)}_onInteraction=e=>{let i=zt(e);if(i instanceof HTMLElement){let r=i.closest(`[${Pv}="${this._globalRippleOptions?.namespace??""}"]`);r&&this._createRipple(r)}};_createRipple(e){if(!this._document||this._hosts.has(e))return;e.querySelector(".mat-ripple")?.remove();let i=this._document.createElement("span");i.classList.add("mat-ripple",e.getAttribute(Fv)),e.append(i);let r=this._globalRippleOptions,o=this._animationsDisabled?0:r?.animation?.enterDuration??Ac.enterDuration,a=this._animationsDisabled?0:r?.animation?.exitDuration??Ac.exitDuration,s={rippleDisabled:this._animationsDisabled||r?.disabled||e.hasAttribute(tf),rippleConfig:{centered:e.hasAttribute(pD),terminateOnPointerUp:r?.terminateOnPointerUp,animation:{enterDuration:o,exitDuration:a}}},l=new Yo(s,this._ngZone,i,this._platform,this._injector),d=!s.rippleDisabled;d&&l.setupTriggerEvents(e),this._hosts.set(e,{target:s,renderer:l,hasSetUpEvents:d}),e.removeAttribute(Pv)}destroyRipple(e){let i=this._hosts.get(e);i&&(i.renderer._removeTriggerEvents(),this._hosts.delete(e))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var pn=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["structural-styles"]],decls:0,vars:0,template:function(i,r){},styles:[`.mat-focus-indicator {
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
`],encapsulation:2})}return t})();var cF=["*",[["","progressIndicator",""]]],dF=["*","[progressIndicator]"];function uF(t,n){t&1&&(je(0,"div",1),B(1,1),Ze())}var mF=new C("MAT_BUTTON_CONFIG");function _D(t){return t==null?void 0:Nt(t)}var nf=(()=>{class t{_elementRef=c(F);_ngZone=c(U);_animationsDisabled=Te();_config=c(mF,{optional:!0});_focusMonitor=c(Bt);_cleanupClick;_renderer=c(Se);_rippleLoader=c(gD);_isAnchor;_isFab=!1;color;get disableRipple(){return this._disableRipple}set disableRipple(e){this._disableRipple=e,this._updateRippleDisabled()}_disableRipple=!1;get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._updateRippleDisabled()}_disabled=!1;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(e){this.tabIndex=e}showProgress=rn(!1,{transform:G});constructor(){c(Je).load(pn);let e=this._elementRef.nativeElement;this._isAnchor=e.tagName==="A",this.disabledInteractive=this._config?.disabledInteractive??!1,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(e,{className:"mat-mdc-button-ripple"})}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0),this._isAnchor&&this._setupAsAnchor()}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement)}focus(e="program",i){e?this._focusMonitor.focusVia(this._elementRef.nativeElement,e,i):this._elementRef.nativeElement.focus(i)}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:!0}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled)}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,"click",e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}))}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,hostAttrs:[1,"mat-mdc-button-base"],hostVars:15,hostBindings:function(i,r){i&2&&(L("disabled",r._getDisabledAttribute())("aria-disabled",r._getAriaDisabled())("tabindex",r._getTabIndex()),Ke(r.color?"mat-"+r.color:""),T("mat-mdc-button-progress-indicator-shown",r.showProgress())("mat-mdc-button-disabled",r.disabled)("mat-mdc-button-disabled-interactive",r.disabledInteractive)("mat-unthemed",!r.color)("_mat-animation-noopable",r._animationsDisabled))},inputs:{color:"color",disableRipple:[2,"disableRipple","disableRipple",G],disabled:[2,"disabled","disabled",G],ariaDisabled:[2,"aria-disabled","ariaDisabled",G],disabledInteractive:[2,"disabledInteractive","disabledInteractive",G],tabIndex:[2,"tabIndex","tabIndex",_D],_tabindex:[2,"tabindex","_tabindex",_D],showProgress:[1,"showProgress"]}})}return t})(),En=(()=>{class t extends nf{constructor(){super(),this._rippleLoader.configureRipple(this._elementRef.nativeElement,{centered:!0})}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["button","mat-icon-button",""],["a","mat-icon-button",""],["button","matIconButton",""],["a","matIconButton",""]],hostAttrs:[1,"mdc-icon-button","mat-mdc-icon-button"],exportAs:["matButton","matAnchor"],features:[pe],ngContentSelectors:dF,decls:5,vars:1,consts:[[1,"mat-mdc-button-persistent-ripple","mdc-icon-button__ripple"],[1,"mat-mdc-button-progress-indicator-container"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(i,r){i&1&&(_e(cF),xt(0,"span",0),B(1),E(2,uF,2,0,"div",1),xt(3,"span",2)(4,"span",3)),i&2&&(p(2),M(r.showProgress()?2:-1))},styles:[`.mat-mdc-icon-button {
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
`],encapsulation:2})}return t})();var fF=new C("cdk-dir-doc",{providedIn:"root",factory:()=>c(K)}),hF=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function vD(t){let n=t?.toLowerCase()||"";return n==="auto"&&typeof navigator<"u"&&navigator?.language?hF.test(navigator.language)?"rtl":"ltr":n==="rtl"?"rtl":"ltr"}var wt=(()=>{class t{get value(){return this.valueSignal()}valueSignal=S("ltr");change=new O;constructor(){let e=c(fF,{optional:!0});if(e){let i=e.body?e.body.dir:null,r=e.documentElement?e.documentElement.dir:null;this.valueSignal.set(vD(i||r||"ltr"))}}ngOnDestroy(){this.change.complete()}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var ge=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();var Lr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ge]})}return t})();var yD=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""]],[["","progressIndicator",""]]],CD=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]","[progressIndicator]"];function pF(t,n){t&1&&(je(0,"div",2),B(1,3),Ze())}function gF(t,n){t&1&&(je(0,"div",2),B(1,3),Ze())}var bD=new Map([["text",["mat-mdc-button"]],["filled",["mdc-button--unelevated","mat-mdc-unelevated-button"]],["elevated",["mdc-button--raised","mat-mdc-raised-button"]],["outlined",["mdc-button--outlined","mat-mdc-outlined-button"]],["tonal",["mat-tonal-button"]]]),ot=(()=>{class t extends nf{get appearance(){return this._appearance}set appearance(e){this.setAppearance(e||this._config?.defaultAppearance||"text")}_appearance=null;constructor(){super();let e=_F(this._elementRef.nativeElement);e&&this.setAppearance(e)}setAppearance(e){if(e===this._appearance)return;let i=this._elementRef.nativeElement.classList,r=this._appearance?bD.get(this._appearance):null,o=bD.get(e);r&&i.remove(...r),i.add(...o),this._appearance=e}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["button","matButton",""],["a","matButton",""],["button","mat-button",""],["button","mat-raised-button",""],["button","mat-flat-button",""],["button","mat-stroked-button",""],["a","mat-button",""],["a","mat-raised-button",""],["a","mat-flat-button",""],["a","mat-stroked-button",""]],hostAttrs:[1,"mdc-button"],inputs:{appearance:[0,"matButton","appearance"]},exportAs:["matButton","matAnchor"],features:[pe],ngContentSelectors:CD,decls:8,vars:5,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-mdc-button-progress-indicator-container"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(i,r){i&1&&(_e(yD),xt(0,"span",0),B(1),je(2,"span",1),B(3,1),Ze(),B(4,2),E(5,pF,2,0,"div",2),xt(6,"span",3)(7,"span",4)),i&2&&(T("mdc-button__ripple",!r._isFab)("mdc-fab__ripple",r._isFab),p(5),M(r.showProgress()?5:-1))},styles:[`.mat-mdc-button-base {
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
`],encapsulation:2})}return t})();function _F(t){return t.hasAttribute("mat-raised-button")?"elevated":t.hasAttribute("mat-stroked-button")?"outlined":t.hasAttribute("mat-flat-button")?"filled":t.hasAttribute("mat-button")?"text":null}var vF=new C("mat-mdc-fab-default-options",{providedIn:"root",factory:()=>Lv}),Lv={color:"accent"},Cs=(()=>{class t extends nf{_options=c(vF,{optional:!0});_isFab=!0;extended=!1;constructor(){super(),this._options=this._options||Lv,this.color=this._options.color||Lv.color}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["button","mat-fab",""],["a","mat-fab",""],["button","matFab",""],["a","matFab",""]],hostAttrs:[1,"mdc-fab","mat-mdc-fab-base","mat-mdc-fab"],hostVars:4,hostBindings:function(i,r){i&2&&T("mdc-fab--extended",r.extended)("mat-mdc-extended-fab",r.extended)},inputs:{extended:[2,"extended","extended",G]},exportAs:["matButton","matAnchor"],features:[pe],ngContentSelectors:CD,decls:8,vars:5,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-mdc-button-progress-indicator-container"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(i,r){i&1&&(_e(yD),xt(0,"span",0),B(1),je(2,"span",1),B(3,1),Ze(),B(4,2),E(5,gF,2,0,"div",2),xt(6,"span",3)(7,"span",4)),i&2&&(T("mdc-button__ripple",!r._isFab)("mdc-fab__ripple",r._isFab),p(5),M(r.showProgress()?5:-1))},styles:[`.mat-mdc-fab-base {
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
`],encapsulation:2})}return t})();var Oe=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[Lr,ge]})}return t})();function wD(t){return Error(`Unable to find icon with the name "${t}"`)}function bF(){return Error("Could not find HttpClient for use with Angular Material icons. Please add provideHttpClient() to your providers.")}function SD(t){return Error(`The URL provided to MatIconRegistry was not trusted as a resource URL via Angular's DomSanitizer. Attempted URL was "${t}".`)}function xD(t){return Error(`The literal provided to MatIconRegistry was not trusted as safe HTML by Angular's DomSanitizer. Attempted literal was "${t}".`)}var nr=class{url;svgText;options;svgElement=null;constructor(n,e,i){this.url=n,this.svgText=e,this.options=i}},ED=(()=>{class t{_httpClient;_sanitizer;_errorHandler;_document;_svgIconConfigs=new Map;_iconSetConfigs=new Map;_cachedIconsByUrl=new Map;_inProgressUrlFetches=new Map;_fontCssClassesByAlias=new Map;_resolvers=[];_defaultFontSetClass=["material-icons","mat-ligature-font"];constructor(e,i,r,o){this._httpClient=e,this._sanitizer=i,this._errorHandler=o,this._document=r}addSvgIcon(e,i,r){return this.addSvgIconInNamespace("",e,i,r)}addSvgIconLiteral(e,i,r){return this.addSvgIconLiteralInNamespace("",e,i,r)}addSvgIconInNamespace(e,i,r,o){return this._addSvgIconConfig(e,i,new nr(r,null,o))}addSvgIconResolver(e){return this._resolvers.push(e),this}addSvgIconLiteralInNamespace(e,i,r,o){let a=this._sanitizer.sanitize(ke.HTML,r);if(!a)throw xD(r);let s=Go(a);return this._addSvgIconConfig(e,i,new nr("",s,o))}addSvgIconSet(e,i){return this.addSvgIconSetInNamespace("",e,i)}addSvgIconSetLiteral(e,i){return this.addSvgIconSetLiteralInNamespace("",e,i)}addSvgIconSetInNamespace(e,i,r){return this._addSvgIconSetConfig(e,new nr(i,null,r))}addSvgIconSetLiteralInNamespace(e,i,r){let o=this._sanitizer.sanitize(ke.HTML,i);if(!o)throw xD(i);let a=Go(o);return this._addSvgIconSetConfig(e,new nr("",a,r))}registerFontClassAlias(e,i=e){return this._fontCssClassesByAlias.set(e,i),this}classNameForFontAlias(e){return this._fontCssClassesByAlias.get(e)||e}setDefaultFontSetClass(...e){return this._defaultFontSetClass=e,this}getDefaultFontSetClass(){return this._defaultFontSetClass}getSvgIconFromUrl(e){let i=this._sanitizer.sanitize(ke.RESOURCE_URL,e);if(!i)throw SD(e);let r=this._cachedIconsByUrl.get(i);return r?ne(rf(r)):this._loadSvgIconFromConfig(new nr(e,null)).pipe(Ft(o=>this._cachedIconsByUrl.set(i,o)),J(o=>rf(o)))}getNamedSvgIcon(e,i=""){let r=DD(i,e),o=this._svgIconConfigs.get(r);if(o)return this._getSvgFromConfig(o);if(o=this._getIconConfigFromResolvers(i,e),o)return this._svgIconConfigs.set(r,o),this._getSvgFromConfig(o);let a=this._iconSetConfigs.get(i);return a?this._getSvgFromIconSetConfigs(e,a):tl(wD(r))}ngOnDestroy(){this._resolvers=[],this._svgIconConfigs.clear(),this._iconSetConfigs.clear(),this._cachedIconsByUrl.clear()}_getSvgFromConfig(e){return e.svgText?ne(rf(this._svgElementFromConfig(e))):this._loadSvgIconFromConfig(e).pipe(J(i=>rf(i)))}_getSvgFromIconSetConfigs(e,i){let r=this._extractIconWithNameFromAnySet(e,i);if(r)return ne(r);let o=i.filter(a=>!a.svgText).map(a=>this._loadSvgIconSetFromConfig(a).pipe(_r(s=>{let d=`Loading icon set URL: ${this._sanitizer.sanitize(ke.RESOURCE_URL,a.url)} failed: ${s.message}`;return this._errorHandler.handleError(new Error(d)),ne(null)})));return rl(o).pipe(J(()=>{let a=this._extractIconWithNameFromAnySet(e,i);if(!a)throw wD(e);return a}))}_extractIconWithNameFromAnySet(e,i){for(let r=i.length-1;r>=0;r--){let o=i[r];if(o.svgText&&o.svgText.toString().indexOf(e)>-1){let a=this._svgElementFromConfig(o),s=this._extractSvgIconFromSet(a,e,o.options);if(s)return s}}return null}_loadSvgIconFromConfig(e){return this._fetchIcon(e).pipe(Ft(i=>e.svgText=i),J(()=>this._svgElementFromConfig(e)))}_loadSvgIconSetFromConfig(e){return e.svgText?ne(null):this._fetchIcon(e).pipe(Ft(i=>e.svgText=i))}_extractSvgIconFromSet(e,i,r){let o=e.querySelector(`[id="${i}"]`);if(!o)return null;let a=o.cloneNode(!0);if(a.removeAttribute("id"),a.nodeName.toLowerCase()==="svg")return this._setSvgAttributes(a,r);if(a.nodeName.toLowerCase()==="symbol")return this._setSvgAttributes(this._toSvgElement(a),r);let s=this._svgElementFromString(Go("<svg></svg>"));return s.appendChild(a),this._setSvgAttributes(s,r)}_svgElementFromString(e){let i=this._document.createElement("DIV");i.innerHTML=e;let r=i.querySelector("svg");if(!r)throw Error("<svg> tag not found");return r}_toSvgElement(e){let i=this._svgElementFromString(Go("<svg></svg>")),r=e.attributes;for(let o=0;o<r.length;o++){let{name:a,value:s}=r[o];a!=="id"&&i.setAttribute(a,s)}for(let o=0;o<e.childNodes.length;o++)e.childNodes[o].nodeType===this._document.ELEMENT_NODE&&i.appendChild(e.childNodes[o].cloneNode(!0));return i}_setSvgAttributes(e,i){return e.setAttribute("fit",""),e.setAttribute("height","100%"),e.setAttribute("width","100%"),e.setAttribute("preserveAspectRatio","xMidYMid meet"),e.setAttribute("focusable","false"),i&&i.viewBox&&e.setAttribute("viewBox",i.viewBox),e}_fetchIcon(e){let{url:i,options:r}=e,o=r?.withCredentials??!1;if(!this._httpClient)throw bF();if(i==null)throw Error(`Cannot fetch icon from URL "${i}".`);let a=this._sanitizer.sanitize(ke.RESOURCE_URL,i);if(!a)throw SD(i);let s=this._inProgressUrlFetches.get(a);if(s)return s;let l=this._httpClient.get(a,{responseType:"text",withCredentials:o}).pipe(J(d=>Go(d)),lo(()=>this._inProgressUrlFetches.delete(a)),ol());return this._inProgressUrlFetches.set(a,l),l}_addSvgIconConfig(e,i,r){return this._svgIconConfigs.set(DD(e,i),r),this}_addSvgIconSetConfig(e,i){let r=this._iconSetConfigs.get(e);return r?r.push(i):this._iconSetConfigs.set(e,[i]),this}_svgElementFromConfig(e){if(!e.svgElement){let i=this._svgElementFromString(e.svgText);this._setSvgAttributes(i,e.options),e.svgElement=i}return e.svgElement}_getIconConfigFromResolvers(e,i){for(let r=0;r<this._resolvers.length;r++){let o=this._resolvers[r](i,e);if(o)return yF(o)?new nr(o.url,null,o.options):new nr(o,null)}}static \u0275fac=function(i){return new(i||t)(ee(Qa,8),ee(rc),ee(K,8),ee(Kt))};static \u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function rf(t){return t.cloneNode(!0)}function DD(t,n){return t+":"+n}function yF(t){return!!(t.url&&t.options)}var CF=["*"],wF=new C("MAT_ICON_DEFAULT_OPTIONS"),SF=new C("mat-icon-location",{providedIn:"root",factory:()=>{let t=c(K),n=t?t.location:null;return{getPathname:()=>n?n.pathname+n.search:""}}}),MD=["clip-path","color-profile","src","cursor","fill","filter","marker","marker-start","marker-mid","marker-end","mask","stroke"],xF=MD.map(t=>`[${t}]`).join(", "),DF=/^url\(['"]?#(.*?)['"]?\)$/,ze=(()=>{class t{_elementRef=c(F);_iconRegistry=c(ED);_location=c(SF);_errorHandler=c(Kt);_defaultColor;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;inline=!1;get svgIcon(){return this._svgIcon}set svgIcon(e){e!==this._svgIcon&&(e?this._updateSvgIcon(e):this._svgIcon&&this._clearSvgElement(),this._svgIcon=e)}_svgIcon;get fontSet(){return this._fontSet}set fontSet(e){let i=this._cleanupFontValue(e);i!==this._fontSet&&(this._fontSet=i,this._updateFontIconClasses())}_fontSet;get fontIcon(){return this._fontIcon}set fontIcon(e){let i=this._cleanupFontValue(e);i!==this._fontIcon&&(this._fontIcon=i,this._updateFontIconClasses())}_fontIcon;_previousFontSetClass=[];_previousFontIconClass;_svgName=null;_svgNamespace=null;_previousPath;_elementsWithExternalReferences;_currentIconFetch=ce.EMPTY;constructor(){let e=c(new Cn("aria-hidden"),{optional:!0}),i=c(wF,{optional:!0});i&&(i.color&&(this.color=this._defaultColor=i.color),i.fontSet&&(this.fontSet=i.fontSet)),e||this._elementRef.nativeElement.setAttribute("aria-hidden","true")}_splitIconName(e){if(!e)return["",""];let i=e.split(":");switch(i.length){case 1:return["",i[0]];case 2:return i;default:throw Error(`Invalid icon name: "${e}"`)}}ngOnInit(){this._updateFontIconClasses()}ngAfterViewChecked(){let e=this._elementsWithExternalReferences;if(e&&e.size){let i=this._location.getPathname();i!==this._previousPath&&(this._previousPath=i,this._prependPathToReferences(i))}}ngOnDestroy(){this._currentIconFetch.unsubscribe(),this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear()}_usingFontIcon(){return!this.svgIcon}_setSvgElement(e){this._clearSvgElement();let i=this._location.getPathname();this._previousPath=i,this._cacheChildrenWithExternalReferences(e),this._prependPathToReferences(i),this._elementRef.nativeElement.appendChild(e)}_clearSvgElement(){let e=this._elementRef.nativeElement,i=e.childNodes.length;for(this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear();i--;){let r=e.childNodes[i];(r.nodeType!==1||r.nodeName.toLowerCase()==="svg")&&r.remove()}}_updateFontIconClasses(){if(!this._usingFontIcon())return;let e=this._elementRef.nativeElement,i=(this.fontSet?this._iconRegistry.classNameForFontAlias(this.fontSet).split(/ +/):this._iconRegistry.getDefaultFontSetClass()).filter(r=>r.length>0);this._previousFontSetClass.forEach(r=>e.classList.remove(r)),i.forEach(r=>e.classList.add(r)),this._previousFontSetClass=i,this.fontIcon!==this._previousFontIconClass&&!i.includes("mat-ligature-font")&&(this._previousFontIconClass&&e.classList.remove(this._previousFontIconClass),this.fontIcon&&e.classList.add(this.fontIcon),this._previousFontIconClass=this.fontIcon)}_cleanupFontValue(e){return typeof e=="string"?e.trim().split(" ")[0]:e}_prependPathToReferences(e){let i=this._elementsWithExternalReferences;i&&i.forEach((r,o)=>{r.forEach(a=>{o.setAttribute(a.name,`url('${e}#${a.value}')`)})})}_cacheChildrenWithExternalReferences(e){let i=e.querySelectorAll(xF),r=this._elementsWithExternalReferences=this._elementsWithExternalReferences||new Map;for(let o=0;o<i.length;o++)MD.forEach(a=>{let s=i[o],l=s.getAttribute(a),d=l?l.match(DF):null;if(d){let u=r.get(s);u||(u=[],r.set(s,u)),u.push({name:a,value:d[1]})}})}_updateSvgIcon(e){if(this._svgNamespace=null,this._svgName=null,this._currentIconFetch.unsubscribe(),e){let[i,r]=this._splitIconName(e);i&&(this._svgNamespace=i),r&&(this._svgName=r),this._currentIconFetch=this._iconRegistry.getNamedSvgIcon(r,i).pipe(Le(1)).subscribe(o=>this._setSvgElement(o),o=>{let a=`Error retrieving icon ${i}:${r}! ${o.message}`;this._errorHandler.handleError(new Error(a))})}}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-icon"]],hostAttrs:["role","img",1,"mat-icon","notranslate"],hostVars:10,hostBindings:function(i,r){i&2&&(L("data-mat-icon-type",r._usingFontIcon()?"font":"svg")("data-mat-icon-name",r._svgName||r.fontIcon)("data-mat-icon-namespace",r._svgNamespace||r.fontSet)("fontIcon",r._usingFontIcon()?r.fontIcon:null),Ke(r.color?"mat-"+r.color:""),T("mat-icon-inline",r.inline)("mat-icon-no-color",r.color!=="primary"&&r.color!=="accent"&&r.color!=="warn"))},inputs:{color:"color",inline:[2,"inline","inline",G],svgIcon:"svgIcon",fontSet:"fontSet",fontIcon:"fontIcon"},exportAs:["matIcon"],ngContentSelectors:CF,decls:1,vars:0,template:function(i,r){i&1&&(_e(),B(0))},styles:[`mat-icon, mat-icon.mat-primary, mat-icon.mat-accent, mat-icon.mat-warn {
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
`],encapsulation:2})}return t})(),Pe=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ge]})}return t})();var EF=20,jr=(()=>{class t{_ngZone=c(U);_platform=c(ye);_renderer=c(Mt).createRenderer(null,null);_cleanupGlobalListener;_scrolled=new I;_scrolledCount=0;scrollContainers=new Map;register(e){this.scrollContainers.has(e)||this.scrollContainers.set(e,e.elementScrolled().subscribe(()=>this._scrolled.next(e)))}deregister(e){let i=this.scrollContainers.get(e);i&&(i.unsubscribe(),this.scrollContainers.delete(e))}scrolled(e=EF){return this._platform.isBrowser?new le(i=>{this._cleanupGlobalListener||(this._cleanupGlobalListener=this._ngZone.runOutsideAngular(()=>this._renderer.listen("document","scroll",()=>this._scrolled.next())));let r=e>0?this._scrolled.pipe(ma(e)).subscribe(i):this._scrolled.subscribe(i);return this._scrolledCount++,()=>{r.unsubscribe(),this._scrolledCount--,this._scrolledCount||(this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0)}}):ne()}ngOnDestroy(){this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0,this.scrollContainers.forEach((e,i)=>this.deregister(i)),this._scrolled.complete()}ancestorScrolled(e,i){let r=this.getAncestorScrollContainers(e);return this.scrolled(i).pipe(ue(o=>!o||r.indexOf(o)>-1))}getAncestorScrollContainers(e){let i=[];return this.scrollContainers.forEach((r,o)=>{this._targetContainsElement(o,e)&&i.push(o)}),i}_targetContainsElement(e,i){let r=sn(i),o=e.getElementRef().nativeElement;do if(r==o)return!0;while(r=r.parentElement);return!1}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),si=(()=>{class t{elementRef=c(F);scrollDispatcher=c(jr);ngZone=c(U);dir=c(wt,{optional:!0});_scrollElement=this.elementRef.nativeElement;_destroyed=new I;_renderer=c(Se);_cleanupScroll;_elementScrolled=new I;ngOnInit(){this._cleanupScroll=this.ngZone.runOutsideAngular(()=>this._renderer.listen(this._scrollElement,"scroll",e=>this._elementScrolled.next(e))),this.scrollDispatcher.register(this)}ngOnDestroy(){this._cleanupScroll?.(),this._elementScrolled.complete(),this.scrollDispatcher.deregister(this),this._destroyed.next(),this._destroyed.complete()}elementScrolled(){return this._elementScrolled}getElementRef(){return this.elementRef}scrollTo(e){let i=this.elementRef.nativeElement,r=this.dir&&this.dir.value=="rtl";e.left==null&&(e.left=r?e.end:e.start),e.right==null&&(e.right=r?e.start:e.end),e.bottom!=null&&(e.top=i.scrollHeight-i.clientHeight-e.bottom),r&&vs()!=ai.NORMAL?(e.left!=null&&(e.right=i.scrollWidth-i.clientWidth-e.left),vs()==ai.INVERTED?e.left=e.right:vs()==ai.NEGATED&&(e.left=e.right?-e.right:e.right)):e.right!=null&&(e.left=i.scrollWidth-i.clientWidth-e.right),this._applyScrollToOptions(e)}_applyScrollToOptions(e){let i=this.elementRef.nativeElement;ef()?i.scrollTo(e):(e.top!=null&&(i.scrollTop=e.top),e.left!=null&&(i.scrollLeft=e.left))}measureScrollOffset(e){let i="left",r="right",o=this.elementRef.nativeElement;if(e=="top")return o.scrollTop;if(e=="bottom")return o.scrollHeight-o.clientHeight-o.scrollTop;let a=this.dir&&this.dir.value=="rtl";return e=="start"?e=a?r:i:e=="end"&&(e=a?i:r),a&&vs()==ai.INVERTED?e==i?o.scrollWidth-o.clientWidth-o.scrollLeft:o.scrollLeft:a&&vs()==ai.NEGATED?e==i?o.scrollLeft+o.scrollWidth-o.clientWidth:-o.scrollLeft:e==i?o.scrollLeft:o.scrollWidth-o.clientWidth-o.scrollLeft}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdk-scrollable",""],["","cdkScrollable",""]]})}return t})(),MF=20,Mn=(()=>{class t{_platform=c(ye);_listeners;_viewportSize=null;_change=new I;_document=c(K);constructor(){let e=c(U),i=c(Mt).createRenderer(null,null);e.runOutsideAngular(()=>{if(this._platform.isBrowser){let r=o=>this._change.next(o);this._listeners=[i.listen("window","resize",r),i.listen("window","orientationchange",r)]}this.change().subscribe(()=>this._viewportSize=null)})}ngOnDestroy(){this._listeners?.forEach(e=>e()),this._change.complete()}getViewportSize(){this._viewportSize||this._updateViewportSize();let e={width:this._viewportSize.width,height:this._viewportSize.height};return this._platform.isBrowser||(this._viewportSize=null),e}getViewportRect(){let e=this.getViewportScrollPosition(),{width:i,height:r}=this.getViewportSize();return{top:e.top,left:e.left,bottom:e.top+r,right:e.left+i,height:r,width:i}}getViewportScrollPosition(){if(!this._platform.isBrowser)return{top:0,left:0};let e=this._document,i=this._getWindow(),r=e.documentElement,o=r.getBoundingClientRect(),a=-o.top||e.body?.scrollTop||i.scrollY||r.scrollTop||0,s=-o.left||e.body?.scrollLeft||i.scrollX||r.scrollLeft||0;return{top:a,left:s}}change(e=MF){return e>0?this._change.pipe(ma(e)):this._change}_getWindow(){return this._document.defaultView||window}_updateViewportSize(){let e=this._getWindow();this._viewportSize=this._platform.isBrowser?{width:e.innerWidth,height:e.innerHeight}:{width:0,height:0}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var Vn=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})(),jv=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ge,Vn,ge,Vn]})}return t})();var af=["*"],IF=["content"],ND=[[["mat-drawer"],["mat-sidenav"]],[["mat-drawer-content"],["mat-sidenav-content"]],"*"],ID=["mat-drawer, mat-sidenav","mat-drawer-content, mat-sidenav-content","*"];function TF(t,n){if(t&1){let e=ae();m(0,"div",1),w("click",function(){q(e);let r=y();return Y(r._onBackdropClicked())}),f()}if(t&2){let e=y();T("mat-drawer-shown",e._isShowingBackdrop())}}function kF(t,n){t&1&&(m(0,"mat-drawer-content"),B(1,2),f())}function AF(t,n){if(t&1){let e=ae();m(0,"div",1),w("click",function(){q(e);let r=y();return Y(r._onBackdropClicked())}),f()}if(t&2){let e=y();T("mat-drawer-shown",e._isShowingBackdrop())}}function RF(t,n){t&1&&(m(0,"mat-sidenav-content"),B(1,2),f())}var OF=`.mat-drawer-container {
  position: relative;
  z-index: 1;
  color: var(--%NS%mat-sidenav-content-text-color, var(--%NS%mat-sys-on-background));
  background-color: var(--%NS%mat-sidenav-content-background-color, var(--%NS%mat-sys-background));
  box-sizing: border-box;
  display: block;
  overflow: hidden;
}
.mat-drawer-container[fullscreen] {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-drawer-container[fullscreen].mat-drawer-container-has-open {
  overflow: hidden;
}
.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side {
  z-index: 3;
}
.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,
.mat-drawer-container.ng-animate-disabled .mat-drawer-content, .ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,
.ng-animate-disabled .mat-drawer-container .mat-drawer-content {
  transition: none;
}

.mat-drawer-backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  z-index: 3;
  visibility: hidden;
}
.mat-drawer-backdrop.mat-drawer-shown {
  visibility: visible;
  background-color: var(--%NS%mat-sidenav-scrim-color, color-mix(in srgb, var(--%NS%mat-sys-neutral-variant20) 40%, transparent));
}
.mat-drawer-transition .mat-drawer-backdrop {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: background-color, visibility;
}
@media (forced-colors: active) {
  .mat-drawer-backdrop {
    opacity: 0.5;
  }
}

.mat-drawer-content {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  overflow: auto;
}
.mat-drawer-content.mat-drawer-content-hidden {
  opacity: 0;
}
.mat-drawer-transition .mat-drawer-content {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: transform, margin-left, margin-right;
}

.mat-drawer {
  position: relative;
  z-index: 4;
  color: var(--%NS%mat-sidenav-container-text-color, var(--%NS%mat-sys-on-surface-variant));
  box-shadow: var(--%NS%mat-sidenav-container-elevation-shadow, none);
  background-color: var(--%NS%mat-sidenav-container-background-color, var(--%NS%mat-sys-surface));
  border-top-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  width: var(--%NS%mat-sidenav-container-width, 360px);
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  outline: 0;
  box-sizing: border-box;
  overflow-y: auto;
  transform: translate3d(-100%, 0, 0);
}
@media (forced-colors: active) {
  .mat-drawer, [dir=rtl] .mat-drawer.mat-drawer-end {
    border-right: solid 1px currentColor;
  }
}
@media (forced-colors: active) {
  [dir=rtl] .mat-drawer, .mat-drawer.mat-drawer-end {
    border-left: solid 1px currentColor;
    border-right: none;
  }
}
.mat-drawer.mat-drawer-side {
  z-index: 2;
}
.mat-drawer.mat-drawer-end {
  right: 0;
  transform: translate3d(100%, 0, 0);
  border-top-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
[dir=rtl] .mat-drawer {
  border-top-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform: translate3d(100%, 0, 0);
}
[dir=rtl] .mat-drawer.mat-drawer-end {
  border-top-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  left: 0;
  right: auto;
  transform: translate3d(-100%, 0, 0);
}
.mat-drawer-transition .mat-drawer {
  transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) {
  visibility: hidden;
  box-shadow: none;
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container {
  display: none;
}
.mat-drawer.mat-drawer-opened.mat-drawer-opened {
  transform: none;
}

.mat-drawer-side {
  box-shadow: none;
  border-right-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
}
.mat-drawer-side.mat-drawer-end {
  border-left-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side {
  border-left-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side.mat-drawer-end {
  border-right-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
  border-left: none;
}

.mat-drawer-inner-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.mat-sidenav-fixed {
  position: fixed;
}
`;var PF=new C("MAT_DRAWER_DEFAULT_AUTOSIZE",{providedIn:"root",factory:()=>!1}),Vv=new C("MAT_DRAWER_CONTAINER"),Zo=(()=>{class t extends si{_platform=c(ye);_changeDetectorRef=c(Me);_element=c(F);_ngZone=c(U);_isInert=!1;_container=c(Oc);ngAfterContentInit(){this._container._contentMarginChanges.subscribe(()=>this._changeDetectorRef.markForCheck())}_drawerToggled(e){e.opened?this._ngZone.runOutsideAngular(()=>{e._animationEnd.pipe(Hh(50),Le(1)).subscribe(()=>this._updateInert())}):this._updateInert()}_drawerModeChanged(){this._updateInert()}_updateInert(){let e=this._container._isShowingBackdrop();if(e!==this._isInert){let i=this._element.nativeElement;this._isInert=e,e?i.setAttribute("inert","true"):i.removeAttribute("inert")}}_shouldBeHidden(){if(this._platform.isBrowser)return!1;let{start:e,end:i}=this._container;return e!=null&&e.mode!=="over"&&e.opened||i!=null&&i.mode!=="over"&&i.opened}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275cmp=D({type:t,selectors:[["mat-drawer-content"]],hostAttrs:[1,"mat-drawer-content"],hostVars:6,hostBindings:function(i,r){i&2&&(Lt("margin-left",r._container._contentMargins.left,"px")("margin-right",r._container._contentMargins.right,"px"),T("mat-drawer-content-hidden",r._shouldBeHidden()))},features:[Ne([{provide:si,useExisting:t}]),pe],ngContentSelectors:af,decls:1,vars:0,template:function(i,r){i&1&&(_e(),B(0))},encapsulation:2})}return t})(),Rc=(()=>{class t{_elementRef=c(F);_focusTrapFactory=c(xc);_focusMonitor=c(Bt);_platform=c(ye);_ngZone=c(U);_renderer=c(Se);_interactivityChecker=c(gs);_doc=c(K);_isAnimating=!1;_container=c(Vv,{optional:!0});_focusTrap=null;_elementFocusedBeforeDrawerWasOpened=null;_eventCleanups;_isAttached=!1;_anchor=null;get position(){return this._position}set position(e){e=e==="end"?"end":"start",e!==this._position&&(this._isAttached&&this._updatePositionInParent(e),this._position=e,this.onPositionChanged.emit())}_position="start";get mode(){return this._mode}set mode(e){this._mode=e,this._updateFocusTrapState(),this._modeChanged.next(),this._getContent()?._drawerModeChanged()}_mode="over";get disableClose(){return this._disableClose}set disableClose(e){this._disableClose=lt(e)}_disableClose=!1;get autoFocus(){let e=this._autoFocus;return e??(this.mode==="side"?"dialog":"first-tabbable")}set autoFocus(e){(e==="true"||e==="false"||e==null)&&(e=lt(e)),this._autoFocus=e}_autoFocus;get opened(){return this._opened()}set opened(e){this.toggle(lt(e))}_opened=S(!1);_openedVia=null;_animationStarted=new I;_animationEnd=new I;openedChange=new O(!0);_openedStream=this.openedChange.pipe(ue(e=>e),J(()=>{}));openedStart=this._animationStarted.pipe(ue(()=>this.opened),fa(void 0));_closedStream=this.openedChange.pipe(ue(e=>!e),J(()=>{}));closedStart=this._animationStarted.pipe(ue(()=>!this.opened),fa(void 0));_destroyed=new I;onPositionChanged=new O;_content;_modeChanged=new I;_injector=c(X);_changeDetectorRef=c(Me);constructor(){this.openedChange.pipe(he(this._destroyed)).subscribe(e=>{e?(this._elementFocusedBeforeDrawerWasOpened=this._doc.activeElement,this._takeFocus()):this._isFocusWithinDrawer()&&this._restoreFocus(this._openedVia||"program")}),this._eventCleanups=this._ngZone.runOutsideAngular(()=>{let e=this._renderer,i=this._elementRef.nativeElement;return[e.listen(i,"keydown",r=>{r.keyCode===27&&!this.disableClose&&!ut(r)&&this._ngZone.run(()=>{this.close(),r.stopPropagation(),r.preventDefault()})}),e.listen(i,"transitionend",this._handleTransitionEvent),e.listen(i,"transitioncancel",this._handleTransitionEvent)]}),this._animationEnd.subscribe(()=>{this.openedChange.emit(this.opened)})}_focusByCssSelector(e,i){let r=this._elementRef.nativeElement.querySelector(e);r&&(this._interactivityChecker.isFocusable(r)||(r.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let o=()=>{a(),s(),r.removeAttribute("tabindex")},a=this._renderer.listen(r,"blur",o),s=this._renderer.listen(r,"mousedown",o)})),r.focus(i))}_takeFocus(){if(!this._focusTrap)return;let e=this._elementRef.nativeElement;switch(this.autoFocus){case!1:case"dialog":return;case!0:case"first-tabbable":tt(()=>{let i=this._isAnimating?{preventScroll:!0}:void 0;!this._focusTrap.focusInitialElement(i)&&typeof e.focus=="function"&&e.focus(i)},{injector:this._injector});break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');break;default:this._focusByCssSelector(this.autoFocus);break}}_restoreFocus(e){this.autoFocus!=="dialog"&&(this._elementFocusedBeforeDrawerWasOpened?this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened,e):this._elementRef.nativeElement.blur(),this._elementFocusedBeforeDrawerWasOpened=null)}_isFocusWithinDrawer(){let e=this._doc.activeElement;return!!e&&this._elementRef.nativeElement.contains(e)}ngAfterViewInit(){this._isAttached=!0,this._position==="end"&&this._updatePositionInParent("end"),this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._updateFocusTrapState())}ngOnDestroy(){this._eventCleanups.forEach(e=>e()),this._focusTrap?.destroy(),this._anchor?.remove(),this._anchor=null,this._animationStarted.complete(),this._animationEnd.complete(),this._modeChanged.complete(),this._destroyed.next(),this._destroyed.complete()}open(e){return this.toggle(!0,e)}close(){return this.toggle(!1)}_closeViaBackdropClick(){return this._setOpen(!1,!0,"mouse")}toggle(e=!this.opened,i){e&&i&&(this._openedVia=i);let r=this._setOpen(e,!e&&this._isFocusWithinDrawer(),this._openedVia||"program");return e||(this._openedVia=null),r}_setOpen(e,i,r){return e===this.opened?Promise.resolve(e?"open":"close"):(this._opened.set(e),this._getContent()?._drawerToggled(this),this._container?._transitionsEnabled?this._isAnimating?(this._setIsAnimating(!1),this._simulateAnimation()):(this._setIsAnimating(!0),setTimeout(()=>this._animationStarted.next())):this._simulateAnimation(),this._elementRef.nativeElement.classList.toggle("mat-drawer-opened",e),!e&&i&&this._restoreFocus(r),this._changeDetectorRef.markForCheck(),this._updateFocusTrapState(),new Promise(o=>{this.openedChange.pipe(Le(1)).subscribe(a=>o(a?"open":"close"))}))}_getContent(){return this._container?._content||this._container?._userContent}_setIsAnimating(e){e!==this._isAnimating&&(this._isAnimating=e,this._elementRef.nativeElement.classList.toggle("mat-drawer-animating",e))}_simulateAnimation(){setTimeout(()=>{this._animationStarted.next(),this._animationEnd.next()})}_getWidth(){return this._elementRef.nativeElement.offsetWidth||0}_updateFocusTrapState(){this._focusTrap&&(this._focusTrap.enabled=this.opened&&!!this._container?._isShowingBackdrop())}_updatePositionInParent(e){if(!this._platform.isBrowser)return;let i=this._elementRef.nativeElement,r=i.parentNode;e==="end"?(this._anchor||(this._anchor=this._doc.createComment("mat-drawer-anchor"),r.insertBefore(this._anchor,i)),r.appendChild(i)):this._anchor&&this._anchor.parentNode.insertBefore(i,this._anchor)}_handleTransitionEvent=e=>{let i=this._elementRef.nativeElement;e.target===i&&this._ngZone.run(()=>{e.type==="transitionend"&&this._setIsAnimating(!1),this._animationEnd.next(e)})};static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-drawer"]],viewQuery:function(i,r){if(i&1&&Re(IF,5),i&2){let o;z(o=$())&&(r._content=o.first)}},hostAttrs:[1,"mat-drawer"],hostVars:12,hostBindings:function(i,r){i&2&&(L("align",null)("tabIndex",r.mode!=="side"?"-1":null),Lt("visibility",!r._container&&!r.opened?"hidden":null),T("mat-drawer-end",r.position==="end")("mat-drawer-over",r.mode==="over")("mat-drawer-push",r.mode==="push")("mat-drawer-side",r.mode==="side"))},inputs:{position:"position",mode:"mode",disableClose:"disableClose",autoFocus:"autoFocus",opened:"opened"},outputs:{openedChange:"openedChange",_openedStream:"opened",openedStart:"openedStart",_closedStream:"closed",closedStart:"closedStart",onPositionChanged:"positionChanged"},exportAs:["matDrawer"],ngContentSelectors:af,decls:3,vars:0,consts:[["content",""],["cdkScrollable","",1,"mat-drawer-inner-container"]],template:function(i,r){i&1&&(_e(),m(0,"div",1,0),B(2),f())},dependencies:[si],encapsulation:2})}return t})(),Oc=(()=>{class t{_dir=c(wt,{optional:!0});_element=c(F);_ngZone=c(U);_changeDetectorRef=c(Me);_animationDisabled=Te();_transitionsEnabled=!1;_allDrawers;_drawers=new hn;_content;_userContent;get start(){return this._start}get end(){return this._end}get autosize(){return this._autosize}set autosize(e){this._autosize=lt(e)}_autosize=c(PF);get hasBackdrop(){return this._drawerHasBackdrop(this._start)||this._drawerHasBackdrop(this._end)}set hasBackdrop(e){this._backdropOverride=e==null?null:lt(e)}_backdropOverride=null;backdropClick=new O;_start=null;_end=null;_left=null;_right=null;_destroyed=new I;_doCheckSubject=new I;_contentMargins={left:null,right:null};_contentMarginChanges=new I;get scrollable(){return this._userContent||this._content}_injector=c(X);constructor(){let e=c(ye),i=c(Mn);this._dir?.change.pipe(he(this._destroyed)).subscribe(()=>{this._validateDrawers(),this.updateContentMargins()}),i.change().pipe(he(this._destroyed)).subscribe(()=>this.updateContentMargins()),!this._animationDisabled&&e.isBrowser&&this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._element.nativeElement.classList.add("mat-drawer-transition"),this._transitionsEnabled=!0},200)})}ngAfterContentInit(){this._allDrawers.changes.pipe(qe(this._allDrawers),he(this._destroyed)).subscribe(e=>{this._drawers.reset(e.filter(i=>!i._container||i._container===this)),this._drawers.notifyOnChanges()}),this._drawers.changes.pipe(qe(null)).subscribe(()=>{this._validateDrawers(),this._drawers.forEach(e=>{this._watchDrawerToggle(e),this._watchDrawerPosition(e),this._watchDrawerMode(e)}),(!this._drawers.length||this._isDrawerOpen(this._start)||this._isDrawerOpen(this._end))&&this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),this._ngZone.runOutsideAngular(()=>{this._doCheckSubject.pipe(Zn(10),he(this._destroyed)).subscribe(()=>this.updateContentMargins())})}ngOnDestroy(){this._contentMarginChanges.complete(),this._doCheckSubject.complete(),this._drawers.destroy(),this._destroyed.next(),this._destroyed.complete()}open(){this._drawers.forEach(e=>e.open())}close(){this._drawers.forEach(e=>e.close())}updateContentMargins(){let e=0,i=0;if(this._left&&this._left.opened){if(this._left.mode=="side")e+=this._left._getWidth();else if(this._left.mode=="push"){let r=this._left._getWidth();e+=r,i-=r}}if(this._right&&this._right.opened){if(this._right.mode=="side")i+=this._right._getWidth();else if(this._right.mode=="push"){let r=this._right._getWidth();i+=r,e-=r}}e=e||null,i=i||null,(e!==this._contentMargins.left||i!==this._contentMargins.right)&&(this._contentMargins={left:e,right:i},this._ngZone.run(()=>this._contentMarginChanges.next(this._contentMargins)))}ngDoCheck(){this._autosize&&this._isPushed()&&this._ngZone.runOutsideAngular(()=>this._doCheckSubject.next())}_watchDrawerToggle(e){e._animationStarted.pipe(he(this._drawers.changes)).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),e.mode!=="side"&&e.openedChange.pipe(he(this._drawers.changes)).subscribe(()=>this._setContainerClass(e.opened))}_watchDrawerPosition(e){e.onPositionChanged.pipe(he(this._drawers.changes)).subscribe(()=>{tt({read:()=>this._validateDrawers()},{injector:this._injector})})}_watchDrawerMode(e){e._modeChanged.pipe(he(mt(this._drawers.changes,this._destroyed))).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()})}_setContainerClass(e){let i=this._element.nativeElement.classList,r="mat-drawer-container-has-open";e?i.add(r):i.remove(r)}_validateDrawers(){this._start=this._end=null,this._drawers.forEach(e=>{e.position=="end"?(this._end!=null,this._end=e):(this._start!=null,this._start=e)}),this._right=this._left=null,this._dir&&this._dir.value==="rtl"?(this._left=this._end,this._right=this._start):(this._left=this._start,this._right=this._end)}_isPushed(){return this._isDrawerOpen(this._start)&&this._start.mode!="over"||this._isDrawerOpen(this._end)&&this._end.mode!="over"}_onBackdropClicked(){this.backdropClick.emit(),this._closeModalDrawersViaBackdrop()}_closeModalDrawersViaBackdrop(){[this._start,this._end].filter(e=>e&&!e.disableClose&&this._drawerHasBackdrop(e)).forEach(e=>e._closeViaBackdropClick())}_isShowingBackdrop(){return this._isDrawerOpen(this._start)&&this._drawerHasBackdrop(this._start)||this._isDrawerOpen(this._end)&&this._drawerHasBackdrop(this._end)}_isDrawerOpen(e){return e!=null&&e.opened}_drawerHasBackdrop(e){return this._backdropOverride==null?!!e&&e.mode!=="side":this._backdropOverride}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-drawer-container"]],contentQueries:function(i,r,o){if(i&1&&ct(o,Zo,5)(o,Rc,5),i&2){let a;z(a=$())&&(r._content=a.first),z(a=$())&&(r._allDrawers=a)}},viewQuery:function(i,r){if(i&1&&Re(Zo,5),i&2){let o;z(o=$())&&(r._userContent=o.first)}},hostAttrs:[1,"mat-drawer-container"],hostVars:2,hostBindings:function(i,r){i&2&&T("mat-drawer-container-explicit-backdrop",r._backdropOverride)},inputs:{autosize:"autosize",hasBackdrop:"hasBackdrop"},outputs:{backdropClick:"backdropClick"},exportAs:["matDrawerContainer"],features:[Ne([{provide:Vv,useExisting:t}])],ngContentSelectors:ID,decls:4,vars:2,consts:[[1,"mat-drawer-backdrop",3,"mat-drawer-shown"],[1,"mat-drawer-backdrop",3,"click"]],template:function(i,r){i&1&&(_e(ND),E(0,TF,1,2,"div",0),B(1),B(2,1),E(3,kF,2,0,"mat-drawer-content")),i&2&&(M(r.hasBackdrop?0:-1),p(3),M(r._content?-1:3))},dependencies:[Zo],styles:[`.mat-drawer-container {
  position: relative;
  z-index: 1;
  color: var(--%NS%mat-sidenav-content-text-color, var(--%NS%mat-sys-on-background));
  background-color: var(--%NS%mat-sidenav-content-background-color, var(--%NS%mat-sys-background));
  box-sizing: border-box;
  display: block;
  overflow: hidden;
}
.mat-drawer-container[fullscreen] {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.mat-drawer-container[fullscreen].mat-drawer-container-has-open {
  overflow: hidden;
}
.mat-drawer-container.mat-drawer-container-explicit-backdrop .mat-drawer-side {
  z-index: 3;
}
.mat-drawer-container.ng-animate-disabled .mat-drawer-backdrop,
.mat-drawer-container.ng-animate-disabled .mat-drawer-content, .ng-animate-disabled .mat-drawer-container .mat-drawer-backdrop,
.ng-animate-disabled .mat-drawer-container .mat-drawer-content {
  transition: none;
}

.mat-drawer-backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  z-index: 3;
  visibility: hidden;
}
.mat-drawer-backdrop.mat-drawer-shown {
  visibility: visible;
  background-color: var(--%NS%mat-sidenav-scrim-color, color-mix(in srgb, var(--%NS%mat-sys-neutral-variant20) 40%, transparent));
}
.mat-drawer-transition .mat-drawer-backdrop {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: background-color, visibility;
}
@media (forced-colors: active) {
  .mat-drawer-backdrop {
    opacity: 0.5;
  }
}

.mat-drawer-content {
  position: relative;
  z-index: 1;
  display: block;
  height: 100%;
  overflow: auto;
}
.mat-drawer-content.mat-drawer-content-hidden {
  opacity: 0;
}
.mat-drawer-transition .mat-drawer-content {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: transform, margin-left, margin-right;
}

.mat-drawer {
  position: relative;
  z-index: 4;
  color: var(--%NS%mat-sidenav-container-text-color, var(--%NS%mat-sys-on-surface-variant));
  box-shadow: var(--%NS%mat-sidenav-container-elevation-shadow, none);
  background-color: var(--%NS%mat-sidenav-container-background-color, var(--%NS%mat-sys-surface));
  border-top-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  width: var(--%NS%mat-sidenav-container-width, 360px);
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  outline: 0;
  box-sizing: border-box;
  overflow-y: auto;
  transform: translate3d(-100%, 0, 0);
}
@media (forced-colors: active) {
  .mat-drawer, [dir=rtl] .mat-drawer.mat-drawer-end {
    border-right: solid 1px currentColor;
  }
}
@media (forced-colors: active) {
  [dir=rtl] .mat-drawer, .mat-drawer.mat-drawer-end {
    border-left: solid 1px currentColor;
    border-right: none;
  }
}
.mat-drawer.mat-drawer-side {
  z-index: 2;
}
.mat-drawer.mat-drawer-end {
  right: 0;
  transform: translate3d(100%, 0, 0);
  border-top-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
[dir=rtl] .mat-drawer {
  border-top-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-left-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transform: translate3d(100%, 0, 0);
}
[dir=rtl] .mat-drawer.mat-drawer-end {
  border-top-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-bottom-right-radius: var(--%NS%mat-sidenav-container-shape, var(--%NS%mat-sys-corner-large));
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  left: 0;
  right: auto;
  transform: translate3d(-100%, 0, 0);
}
.mat-drawer-transition .mat-drawer {
  transition: transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) {
  visibility: hidden;
  box-shadow: none;
}
.mat-drawer:not(.mat-drawer-opened):not(.mat-drawer-animating) .mat-drawer-inner-container {
  display: none;
}
.mat-drawer.mat-drawer-opened.mat-drawer-opened {
  transform: none;
}

.mat-drawer-side {
  box-shadow: none;
  border-right-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
}
.mat-drawer-side.mat-drawer-end {
  border-left-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side {
  border-left-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-left-width: 1px;
  border-left-style: solid;
  border-right: none;
}
[dir=rtl] .mat-drawer-side.mat-drawer-end {
  border-right-color: var(--%NS%mat-sidenav-container-divider-color, transparent);
  border-right-width: 1px;
  border-right-style: solid;
  border-left: none;
}

.mat-drawer-inner-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.mat-sidenav-fixed {
  position: fixed;
}
`],encapsulation:2})}return t})(),of=(()=>{class t extends Zo{static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275cmp=D({type:t,selectors:[["mat-sidenav-content"]],hostAttrs:[1,"mat-drawer-content","mat-sidenav-content"],features:[Ne([{provide:si,useExisting:t},{provide:Zo,useExisting:t}]),pe],ngContentSelectors:af,decls:1,vars:0,template:function(i,r){i&1&&(_e(),B(0))},encapsulation:2})}return t})(),Bv=(()=>{class t extends Rc{get fixedInViewport(){return this._fixedInViewport}set fixedInViewport(e){this._fixedInViewport=lt(e)}_fixedInViewport=!1;get fixedTopGap(){return this._fixedTopGap}set fixedTopGap(e){this._fixedTopGap=Vt(e)}_fixedTopGap=0;get fixedBottomGap(){return this._fixedBottomGap}set fixedBottomGap(e){this._fixedBottomGap=Vt(e)}_fixedBottomGap=0;static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275cmp=D({type:t,selectors:[["mat-sidenav"]],hostAttrs:[1,"mat-drawer","mat-sidenav"],hostVars:16,hostBindings:function(i,r){i&2&&(L("tabIndex",r.mode!=="side"?"-1":null)("align",null),Lt("top",r.fixedInViewport?r.fixedTopGap:null,"px")("bottom",r.fixedInViewport?r.fixedBottomGap:null,"px"),T("mat-drawer-end",r.position==="end")("mat-drawer-over",r.mode==="over")("mat-drawer-push",r.mode==="push")("mat-drawer-side",r.mode==="side")("mat-sidenav-fixed",r.fixedInViewport))},inputs:{fixedInViewport:"fixedInViewport",fixedTopGap:"fixedTopGap",fixedBottomGap:"fixedBottomGap"},exportAs:["matSidenav"],features:[Ne([{provide:Rc,useExisting:t}]),pe],ngContentSelectors:af,decls:3,vars:0,consts:[["content",""],["cdkScrollable","",1,"mat-drawer-inner-container"]],template:function(i,r){i&1&&(_e(),m(0,"div",1,0),B(2),f())},dependencies:[si],encapsulation:2})}return t})(),TD=(()=>{class t extends Oc{_allDrawers=void 0;_content=void 0;static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275cmp=D({type:t,selectors:[["mat-sidenav-container"]],contentQueries:function(i,r,o){if(i&1&&ct(o,of,5)(o,Bv,5),i&2){let a;z(a=$())&&(r._content=a.first),z(a=$())&&(r._allDrawers=a)}},hostAttrs:[1,"mat-drawer-container","mat-sidenav-container"],hostVars:2,hostBindings:function(i,r){i&2&&T("mat-drawer-container-explicit-backdrop",r._backdropOverride)},exportAs:["matSidenavContainer"],features:[Ne([{provide:Vv,useExisting:t},{provide:Oc,useExisting:t}]),pe],ngContentSelectors:ID,decls:4,vars:2,consts:[[1,"mat-drawer-backdrop",3,"mat-drawer-shown"],[1,"mat-drawer-backdrop",3,"click"]],template:function(i,r){i&1&&(_e(ND),E(0,AF,1,2,"div",0),B(1),B(2,1),E(3,RF,2,0,"mat-sidenav-content")),i&2&&(M(r.hasBackdrop?0:-1),p(3),M(r._content?-1:3))},dependencies:[of],styles:[OF],encapsulation:2})}return t})(),sf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[Vn,ge,Vn]})}return t})();var FF=["*",[["mat-toolbar-row"]]],LF=["*","mat-toolbar-row"],jF=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-toolbar-row"]],hostAttrs:[1,"mat-toolbar-row"],exportAs:["matToolbarRow"]})}return t})(),AD=(()=>{class t{_elementRef=c(F);_platform=c(ye);_document=c(K);color;_toolbarRows;ngAfterViewInit(){this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe(()=>this._checkToolbarMixedModes()))}_checkToolbarMixedModes(){this._toolbarRows.length}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-toolbar"]],contentQueries:function(i,r,o){if(i&1&&ct(o,jF,5),i&2){let a;z(a=$())&&(r._toolbarRows=a)}},hostAttrs:[1,"mat-toolbar"],hostVars:6,hostBindings:function(i,r){i&2&&(Ke(r.color?"mat-"+r.color:""),T("mat-toolbar-multiple-rows",r._toolbarRows.length>0)("mat-toolbar-single-row",r._toolbarRows.length===0))},inputs:{color:"color"},exportAs:["matToolbar"],ngContentSelectors:LF,decls:2,vars:0,template:function(i,r){i&1&&(_e(FF),B(0),B(1,1))},styles:[`.mat-toolbar {
  background: var(--%NS%mat-toolbar-container-background-color, var(--%NS%mat-sys-surface));
  color: var(--%NS%mat-toolbar-container-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-toolbar, .mat-toolbar h1, .mat-toolbar h2, .mat-toolbar h3, .mat-toolbar h4, .mat-toolbar h5, .mat-toolbar h6 {
  font-family: var(--%NS%mat-toolbar-title-text-font, var(--%NS%mat-sys-title-large-font));
  font-size: var(--%NS%mat-toolbar-title-text-size, var(--%NS%mat-sys-title-large-size));
  line-height: var(--%NS%mat-toolbar-title-text-line-height, var(--%NS%mat-sys-title-large-line-height));
  font-weight: var(--%NS%mat-toolbar-title-text-weight, var(--%NS%mat-sys-title-large-weight));
  letter-spacing: var(--%NS%mat-toolbar-title-text-tracking, var(--%NS%mat-sys-title-large-tracking));
  margin: 0;
}
@media (forced-colors: active) {
  .mat-toolbar {
    outline: solid 1px;
  }
}
.mat-toolbar .mat-form-field-underline,
.mat-toolbar .mat-form-field-ripple,
.mat-toolbar .mat-focused .mat-form-field-ripple {
  background-color: currentColor;
}
.mat-toolbar .mat-form-field-label,
.mat-toolbar .mat-focused .mat-form-field-label,
.mat-toolbar .mat-select-value,
.mat-toolbar .mat-select-arrow,
.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow {
  color: inherit;
}
.mat-toolbar .mat-input-element {
  caret-color: currentColor;
}
.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed {
  --%NS%mat-button-text-label-text-color: var(--%NS%mat-toolbar-container-text-color, var(--%NS%mat-sys-on-surface));
  --%NS%mat-button-outlined-label-text-color: var(--%NS%mat-toolbar-container-text-color, var(--%NS%mat-sys-on-surface));
}

.mat-toolbar-row, .mat-toolbar-single-row {
  display: flex;
  box-sizing: border-box;
  padding: 0 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  height: var(--%NS%mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-row, .mat-toolbar-single-row {
    height: var(--%NS%mat-toolbar-mobile-height, 56px);
  }
}

.mat-toolbar-multiple-rows {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  min-height: var(--%NS%mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-multiple-rows {
    min-height: var(--%NS%mat-toolbar-mobile-height, 56px);
  }
}
`],encapsulation:2})}return t})();var RD=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ge]})}return t})();var Hv=class extends Error{constructor(e,i){super(i);this.status=e;this.name="ApiError"}},ws=class t{constructor(){this.http=c(Qa)}async request(n,e={}){try{return await Vh(this.http.request(e.method??"GET",n,{body:e.body}))}catch(i){if(i instanceof Qi){let r=`Request failed: ${i.status} ${i.statusText}`;throw i.error&&typeof i.error.error=="string"&&(r=i.error.error),new Hv(i.status,r)}throw i}}fetchProjects(){return this.request("/api/projects")}createProject(n,e){return this.request("/api/projects",{method:"POST",body:{name:n,path:e}})}editProject(n,e,i){return this.request(`/api/projects/${encodeURIComponent(n)}`,{method:"PATCH",body:{name:e,path:i}})}async deleteProject(n){await this.request(`/api/projects/${encodeURIComponent(n)}`,{method:"DELETE"})}cloneProject(n){return this.request("/api/projects/clone",{method:"POST",body:n})}fetchDirectories(n){let e=n?`/api/filesystem/directories?path=${encodeURIComponent(n)}`:"/api/filesystem/directories";return this.request(e)}fetchChats(n){return this.request(`/api/projects/${encodeURIComponent(n)}/chats`)}createChat(n,e,i){return this.request(`/api/projects/${encodeURIComponent(n)}/chats`,{method:"POST",body:{agent:e,title:i||void 0}})}fetchChat(n){return this.request(`/api/chats/${encodeURIComponent(n)}`)}editChat(n,e){return this.request(`/api/chats/${encodeURIComponent(n)}`,{method:"PATCH",body:e})}async deleteChat(n){await this.request(`/api/chats/${encodeURIComponent(n)}`,{method:"DELETE"})}async promptChat(n,e){await this.request(`/api/chats/${encodeURIComponent(n)}/prompt`,{method:"POST",body:{text:e}})}resumeChat(n){return this.request(`/api/chats/${encodeURIComponent(n)}/resume`,{method:"POST"})}async stopChat(n){await this.request(`/api/chats/${encodeURIComponent(n)}/stop`,{method:"POST"})}async cancelChat(n){await this.request(`/api/chats/${encodeURIComponent(n)}/cancel`,{method:"POST"})}async respondPermission(n,e,i){await this.request(`/api/chats/${encodeURIComponent(n)}/permission`,{method:"POST",body:{id:e,granted:i}})}fetchChatConfig(n){return this.request(`/api/chats/${encodeURIComponent(n)}/config`)}setChatConfig(n,e,i){return this.request(`/api/chats/${encodeURIComponent(n)}/config`,{method:"PATCH",body:{id:e,value:i}})}fetchAgents(){return this.request("/api/agents")}fetchStatus(){return this.request("/api/status")}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"root"})}};var lf=class t{constructor(){this.status=S("connecting");this.events=new I;this.socket=null;this.reconnectTimer=null;this.destroyed=!1;this.lastSequence=0}connect(){if(this.destroyed||typeof window>"u"||this.socket)return;this.status.set("connecting");let n=window.location.protocol==="https:"?"wss:":"ws:";try{this.socket=new WebSocket(`${n}//${window.location.host}/ws`)}catch{this.socket=null,this.scheduleReconnect();return}this.socket.addEventListener("open",()=>{this.status.set("connected"),this.send({type:"subscribe",from_seq:this.lastSequence>0?this.lastSequence+1:0})}),this.socket.addEventListener("message",e=>{try{let i=JSON.parse(String(e.data));if(typeof i.seq!="number"||i.seq<=this.lastSequence)return;this.lastSequence=i.seq,this.events.next(i)}catch{}}),this.socket.addEventListener("close",()=>{this.socket=null,this.status.set("disconnected"),this.scheduleReconnect()}),this.socket.addEventListener("error",()=>{this.socket?.close()})}send(n){this.socket?.readyState===WebSocket.OPEN&&this.socket.send(JSON.stringify(n))}destroy(){this.destroyed=!0,this.reconnectTimer&&clearTimeout(this.reconnectTimer),this.reconnectTimer=null,this.socket?.close(),this.socket=null,this.events.complete()}ngOnDestroy(){this.destroy()}scheduleReconnect(){this.destroyed||this.reconnectTimer||(this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null,this.connect()},2e3))}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"root"})}};var Pc=class{constructor(n=[]){this.nextId=1;this.seenSeqs=new Set;this.itemList=S([]);this.items=this.itemList.asReadonly();this.currentTurnId=null;for(let e of n)this.ingest(e)}ingest(n){if(typeof n.seq=="number"){if(this.seenSeqs.has(n.seq))return null;this.seenSeqs.add(n.seq)}let e=n.payload;return e?this.isTurnScoped(e.type)?this.ingestTurnEvent(n):e.type==="user_message"?(this.closeCurrentTurn(),this.append({id:this.nextId++,type:"user_message",text:this.stringValue(e.text)??"",timestamp:n.timestamp})):e.type==="error"?this.append({id:this.nextId++,type:"error",message:this.stringValue(e.message)??"Unknown error",timestamp:n.timestamp}):e.type==="state_change"&&this.shouldDisplayStateChange(e)?this.append({id:this.nextId++,type:"state_change",process:this.stringValue(e.process)??"",turn:this.stringValue(e.turn)??"",timestamp:n.timestamp}):null:null}append(n){return this.itemList.update(e=>[...e,n]),n}closeCurrentTurn(){let n=this.openTurn();if(!n)return;let e=V(b({},n),{status:"complete"});this.itemList.update(i=>i.map(r=>r.id===e.id?e:r)),this.currentTurnId=null}openTurn(){if(this.currentTurnId===null)return null;let n=this.itemList().find(e=>e.id===this.currentTurnId);return n&&n.type==="turn"?n:null}ingestTurnEvent(n){let e=n.payload,i=this.openTurn(),r=i===null,o=i??{id:this.nextId++,type:"turn",agent:n.agent||"Agent",timestamp:n.timestamp,completedAt:null,status:"in_progress",stopReason:null,entries:[]},a=this.applyTurnEvent(o,n),s=a!==o;e.type==="turn_complete"&&(a=V(b({},a),{status:"complete",completedAt:n.timestamp,stopReason:this.stringValue(e.stop_reason??e.stopReason)??null}));let l=a;return this.itemList.update(d=>{let u=r?[...d,l]:d.map(h=>h.id===l.id?l:h);return e.type==="permission_response"&&!s?this.markPermissionInItems(u,l.id,e):u}),this.currentTurnId=e.type==="turn_complete"?null:l.id,l}isTurnScoped(n){return["message_chunk","thought_chunk","tool_call","tool_call_update","plan","permission_request","permission_response","turn_complete"].includes(n)}shouldDisplayStateChange(n){return["DEAD","STARTING","STOPPED"].includes(this.stringValue(n.process)??"")||this.stringValue(n.turn)==="CANCELLING"}applyTurnEvent(n,e){let i=e.payload,r=n.entries,o=r[r.length-1];if(i.type==="message_chunk"||i.type==="thought_chunk"){let a=this.stringValue(i.text)??"";if(o&&o.type===i.type){let s=V(b({},o),{text:o.text+a});return V(b({},n),{entries:[...r.slice(0,-1),s]})}return V(b({},n),{entries:[...r,{id:this.nextId++,type:i.type,text:a}]})}if(i.type==="tool_call"){let a=this.stringValue(i.id??i.toolCallId??i.tool_call_id)??String(this.nextId);return V(b({},n),{entries:[...r,{id:this.nextId++,type:"tool_call",toolCallId:a,title:this.stringValue(i.title)??"Tool Call",status:this.stringValue(i.status)??"in_progress",output:null}]})}if(i.type==="tool_call_update"){let a=this.stringValue(i.id??i.toolCallId??i.tool_call_id)??"",s=this.findToolCallIndex(r,a);if(s>=0){let l=r[s],d=this.stringValue(i.status),u=V(b({},l),{status:d??l.status,output:i.output!==void 0&&i.output!==null?(l.output||"")+String(i.output):l.output}),h=[...r];return h[s]=u,V(b({},n),{entries:h})}return V(b({},n),{entries:[...r,{id:this.nextId++,type:"tool_call",toolCallId:a,title:this.stringValue(i.title)??"Tool Call",status:this.stringValue(i.status)??"in_progress",output:i.output==null?null:String(i.output)}]})}if(i.type==="plan"){let s=Array.isArray(i.entries)?i.entries:[];if(o?.type==="plan"){let l=V(b({},o),{entries:s});return V(b({},n),{entries:[...r.slice(0,-1),l]})}return V(b({},n),{entries:[...r,{id:this.nextId++,type:"plan",entries:s}]})}if(i.type==="permission_request")return V(b({},n),{entries:[...r,{id:this.nextId++,type:"permission_request",requestId:this.stringValue(i.id)??"",method:this.stringValue(i.method)??"",description:this.stringValue(i.description)??"",responded:!1}]});if(i.type==="permission_response"){let a=this.markPermission(r,i);return a?V(b({},n),{entries:a}):n}return n}markPermission(n,e){let i=this.stringValue(e.id),r=n.findIndex(a=>a.type==="permission_request"&&(!i||a.requestId===i));if(r<0)return null;let o=[...n];return o[r]=V(b({},o[r]),{responded:!0,decision:e.granted?"Allowed":"Denied"}),o}markPermissionInItems(n,e,i){for(let r=0;r<n.length;r+=1){let o=n[r];if(o.type!=="turn"||o.id===e)continue;let a=this.markPermission(o.entries,i);if(!a)continue;let s=[...n];return s[r]=V(b({},o),{entries:a}),s}return n}findToolCallIndex(n,e){for(let i=n.length-1;i>=0;i-=1){let r=n[i];if(r.type==="tool_call"&&r.toolCallId===e)return i}return-1}stringValue(n){return typeof n=="string"?n:n==null?void 0:String(n)}};var Fe=class t{constructor(){this.socket=c(lf);this.projects=S([]);this.chatsByProject=S({});this.activeProjectId=S(null);this.activeChatId=S(null);this.configOptionsByChat=S({});this.configLoadedByChat=S({});this.reducersByChat=S({});this.agents=S(["codex","claude","opencode","antigravity"]);this.loadingProjects=S(!1);this.projectsError=S(null);this.loadingChats=S(new Set);this.connectingChats=S(new Set);this.connectErrors=S({});this.isMobileDrawerOpen=S(!1);this.showArchived=S(!1);this.wsStatus=this.socket.status;this.activeProject=De(()=>{let n=this.activeProjectId();return n?this.projects().find(e=>e.id===n)??null:null});this.activeChat=De(()=>{let n=this.activeProjectId(),e=this.activeChatId();return!n||!e?null:this.chatsByProject()[n]?.find(i=>i.id===e)??null});this.router=c(an);this.api=c(ws);this.emptyReducer=new Pc;this.inFlightConnections=new Map;this.inFlightConfigs=new Map;this.inFlightChats=new Map;this.activeReducer=De(()=>{let n=this.activeChatId();return n?this.reducersByChat()[n]??this.emptyReducer:this.emptyReducer});this.socket.events.subscribe(n=>this.handleIncomingEvent(n)),this.router.events.pipe(ue(n=>n instanceof xn)).subscribe(n=>this.syncRoute(n.urlAfterRedirects)),this.syncRoute(this.router.url||(typeof window<"u"?window.location.pathname:"/")),this.socket.connect(),this.initialize()}setMobileDrawerOpen(n){this.isMobileDrawerOpen.set(n)}setShowArchived(n){this.showArchived.set(n)}async loadProjects(){this.loadingProjects.set(!0);try{this.projects.set(await this.api.fetchProjects()),this.projectsError.set(null)}catch(n){this.projectsError.set(this.errorMessage(n,"Failed to load projects")),console.error("Failed to load projects",n)}finally{this.loadingProjects.set(!1)}}async loadAgents(){try{this.agents.set(await this.api.fetchAgents())}catch{}}loadChats(n){let e=this.inFlightChats.get(n);if(e)return e;let i=(async()=>{this.setSetValue(this.loadingChats,n,!0);try{let r=await this.api.fetchChats(n);this.chatsByProject.update(o=>V(b({},o),{[n]:r}))}catch(r){console.error("Failed to load chats for project",n,r)}finally{this.setSetValue(this.loadingChats,n,!1),this.inFlightChats.delete(n)}})();return this.inFlightChats.set(n,i),i}findChat(n){for(let e of Object.values(this.chatsByProject())){let i=e.find(r=>r.id===n);if(i)return i}return null}async autoConnectChat(n){let e=this.findChat(n);e&&(e.process_state!=="RUNNING"?await this.connectChat(n).catch(()=>{}):this.configLoadedByChat()[n]||await this.loadChatConfig(n).catch(()=>{}))}loadChatConfig(n){let e=this.inFlightConfigs.get(n);if(e)return e;let i=(async()=>{this.setSetValue(this.connectingChats,n,!0),this.clearError(n);try{let r=this.normalizeConfigOptions(await this.api.fetchChatConfig(n));return this.configOptionsByChat.update(o=>V(b({},o),{[n]:r})),this.configLoadedByChat.update(o=>V(b({},o),{[n]:!0})),r}catch(r){throw this.setError(n,this.errorMessage(r,"Failed to load agent configuration")),r}finally{this.setSetValue(this.connectingChats,n,!1),this.inFlightConfigs.delete(n)}})();return this.inFlightConfigs.set(n,i),i}retryConnection(n){return this.findChat(n)?.process_state==="RUNNING"?this.loadChatConfig(n).then(()=>{}).catch(()=>{}):this.connectChat(n).then(()=>{}).catch(()=>{})}connectChat(n){let e=this.inFlightConnections.get(n);if(e)return e;let i=(async()=>{this.setSetValue(this.connectingChats,n,!0),this.clearError(n);try{let r;try{r=await this.api.resumeChat(n)}catch(o){let a=this.findChat(n);throw(!a||a.process_state!=="RUNNING")&&this.setError(n,this.errorMessage(o,"Failed to connect to agent")),o}this.applyChatPatch(n,r),this.clearError(n);try{await this.fetchConfig(n)}catch(o){throw this.setError(n,this.errorMessage(o,"Failed to load agent configuration")),o}return r}finally{this.setSetValue(this.connectingChats,n,!1),this.inFlightConnections.delete(n)}})();return this.inFlightConnections.set(n,i),i}async fetchConfig(n){let e=this.normalizeConfigOptions(await this.api.fetchChatConfig(n));return this.configOptionsByChat.update(i=>V(b({},i),{[n]:e})),this.configLoadedByChat.update(i=>V(b({},i),{[n]:!0})),e}async sendPrompt(n,e){await this.api.promptChat(n,e),this.applyChatPatch(n,{turn_state:"PROMPTING"})}async cancelActiveTurn(n){await this.api.cancelChat(n),this.applyChatPatch(n,{turn_state:"CANCELLING"})}async stopChatProcess(n){await this.api.stopChat(n),this.applyChatPatch(n,{process_state:"STOPPED",turn_state:"IDLE"})}async setChatPolicy(n,e){this.applyChatPatch(n,await this.api.editChat(n,{permission_policy:e}))}async renameChat(n,e){this.applyChatPatch(n,await this.api.editChat(n,{title:e}))}async archiveChat(n,e){this.applyChatPatch(n,await this.api.editChat(n,{archived:e}))}async deleteChat(n){let e=this.findChat(n);await this.api.deleteChat(n),this.chatsByProject.update(i=>{let r=b({},i);for(let[o,a]of Object.entries(r))r[o]=a.filter(s=>s.id!==n);return r}),this.removeChatState(n),this.activeChatId()===n&&this.router.navigate(e?.project_id?["/projects",e.project_id]:["/"])}async setChatConfig(n,e,i){let r=this.normalizeConfigOptions(await this.api.setChatConfig(n,e,i));this.configOptionsByChat.update(o=>V(b({},o),{[n]:r})),this.configLoadedByChat.update(o=>V(b({},o),{[n]:!0}))}async createProject(n,e){let i=await this.api.createProject(n,e);return this.projects.update(r=>[i,...r]),i}async cloneProject(n){let e=await this.api.cloneProject(n);return this.projects.update(i=>[e,...i.filter(r=>r.id!==e.id)]),e}async createChat(n,e,i){let r=await this.api.createChat(n,e,i);return this.chatsByProject.update(o=>V(b({},o),{[n]:[...o[n]??[],r]})),this.projects.update(o=>o.map(a=>a.id===n?V(b({},a),{chat_count:(a.chat_count??0)+1}):a)),r}async editProject(n,e,i){let r=await this.api.editProject(n,e,i);return this.projects.update(o=>o.map(a=>a.id===n?b(b({},a),r):a)),r}async deleteProject(n){await this.api.deleteProject(n),this.projects.update(e=>e.filter(i=>i.id!==n)),this.chatsByProject.update(e=>{let i=b({},e);return delete i[n],i}),this.activeProjectId()===n&&(this.activeProjectId.set(null),this.activeChatId.set(null),this.router.navigate(["/"]))}respondPermission(n,e,i){return this.api.respondPermission(n,e,i)}async initialize(){typeof window>"u"||await Promise.all([this.loadProjects(),this.loadAgents()])}syncRoute(n){let e=n.split("?")[0].replace(/\/+$/,"").split("/").filter(Boolean),i=e[0]==="projects"?e[1]??null:null,r=i&&e[2]==="chats"?e[3]??null:null;if(this.activeProjectId.set(i),this.activeChatId.set(r),!i){this.setMobileDrawerOpen(!1);return}this.loadChats(i).then(()=>{r&&this.autoConnectChat(r)})}handleIncomingEvent(n){let{session_id:e,payload:i}=n;if(i.type==="metadata_changed"){this.loadProjects();for(let a of Object.keys(this.chatsByProject()))this.loadChats(a);return}if(i.type==="config_options"&&e){let a=this.normalizeConfigOptions(i.options);this.configOptionsByChat.update(s=>V(b({},s),{[e]:a})),this.configLoadedByChat.update(s=>V(b({},s),{[e]:!0}));return}if(!e)return;let r=b({},this.reducersByChat()),o=r[e]??new Pc;if(o.ingest(n),r[e]=o,this.reducersByChat.set(r),i.type==="state_change"){let a=this.processState(i.process),s=this.turnState(i.turn);this.applyChatPatch(e,b(b({},a?{process_state:a}:{}),s?{turn_state:s}:{}))}}applyChatPatch(n,e){this.chatsByProject.update(i=>{let r=b({},i);for(let[o,a]of Object.entries(r))r[o]=a.map(s=>s.id===n?b(b({},s),e):s);return r})}removeChatState(n){this.reducersByChat.update(e=>{let i=b({},e);return delete i[n],i}),this.configOptionsByChat.update(e=>{let i=b({},e);return delete i[n],i}),this.configLoadedByChat.update(e=>{let i=b({},e);return delete i[n],i}),this.connectErrors.update(e=>{let i=b({},e);return delete i[n],i})}setError(n,e){this.connectErrors.update(i=>V(b({},i),{[n]:e}))}clearError(n){this.connectErrors.update(e=>{if(!(n in e))return e;let i=b({},e);return delete i[n],i})}setSetValue(n,e,i){n.update(r=>{let o=new Set(r);return i?o.add(e):o.delete(e),o})}normalizeConfigOptions(n){return Array.isArray(n)?n.map(e=>{let i=e??{},o=(Array.isArray(i.options)?i.options:void 0)?.map(a=>{let s=a??{};return Array.isArray(s.options)?{group:String(s.group??s.name??""),options:s.options.map(l=>{let d=l??{};return{value:d.value,name:String(d.name??d.label??d.value??"")}})}:{value:s.value,name:String(s.name??s.label??s.value??"")}});return{id:String(i.id??""),name:String(i.name??i.label??i.id??""),type:String(i.type??""),currentValue:i.currentValue??i.current_value,description:typeof i.description=="string"?i.description:void 0,options:o}}):[]}processState(n){return["STARTING","RUNNING","STOPPED","DEAD"].includes(String(n))?String(n):void 0}turnState(n){return["IDLE","PROMPTING","CANCELLING"].includes(String(n))?String(n):void 0}errorMessage(n,e){return n instanceof Error&&n.message?n.message:e}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"root"})}};var Uv=(()=>{class t{get vertical(){return this._vertical}set vertical(e){this._vertical=lt(e)}_vertical=!1;get inset(){return this._inset}set inset(e){this._inset=lt(e)}_inset=!1;static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-divider"]],hostAttrs:["role","separator",1,"mat-divider"],hostVars:7,hostBindings:function(i,r){i&2&&(L("aria-orientation",r.vertical?"vertical":"horizontal"),T("mat-divider-vertical",r.vertical)("mat-divider-horizontal",!r.vertical)("mat-divider-inset",r.inset))},inputs:{vertical:"vertical",inset:"inset"},decls:0,vars:0,template:function(i,r){},styles:[`.mat-divider {
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
`],encapsulation:2})}return t})(),Ss=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ge]})}return t})();var Fc=class{_multiple;_emitChanges;compareWith;_selection=new Set;_deselectedToEmit=[];_selectedToEmit=[];_selected=null;get selected(){return this._selected||(this._selected=Array.from(this._selection.values())),this._selected}changed=new I;bulk={select:n=>this._select(n),deselect:n=>this._deselect(n),setSelection:n=>this._setSelection(n)};constructor(n=!1,e,i=!0,r){this._multiple=n,this._emitChanges=i,this.compareWith=r,e&&e.length&&(n?e.forEach(o=>this._markSelected(o)):this._markSelected(e[0]),this._selectedToEmit.length=0)}select(...n){return this._select(n)}deselect(...n){return this._deselect(n)}setSelection(...n){return this._setSelection(n)}toggle(n){return this.isSelected(n)?this.deselect(n):this.select(n)}clear(n=!0){this._unmarkAll();let e=this._hasQueuedChanges();return n&&this._emitChangeEvent(),e}isSelected(n){return this._selection.has(this._getConcreteValue(n))}isEmpty(){return this._selection.size===0}hasValue(){return!this.isEmpty()}sort(n){this._multiple&&this.selected&&this._selected.sort(n)}isMultipleSelection(){return this._multiple}_select(n){this._verifyValueAssignment(n),n.forEach(i=>this._markSelected(i));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_deselect(n){this._verifyValueAssignment(n),n.forEach(i=>this._unmarkSelected(i));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_setSelection(n){this._verifyValueAssignment(n);let e=this.selected,i=new Set(n.map(o=>this._getConcreteValue(o)));n.forEach(o=>this._markSelected(o)),e.filter(o=>!i.has(this._getConcreteValue(o,i))).forEach(o=>this._unmarkSelected(o));let r=this._hasQueuedChanges();return this._emitChangeEvent(),r}_emitChangeEvent(){this._selected=null,(this._selectedToEmit.length||this._deselectedToEmit.length)&&(this.changed.next({source:this,added:this._selectedToEmit,removed:this._deselectedToEmit}),this._deselectedToEmit=[],this._selectedToEmit=[])}_markSelected(n){n=this._getConcreteValue(n),this.isSelected(n)||(this._multiple||this._unmarkAll(),this.isSelected(n)||this._selection.add(n),this._emitChanges&&this._selectedToEmit.push(n))}_unmarkSelected(n){n=this._getConcreteValue(n),this.isSelected(n)&&(this._selection.delete(n),this._emitChanges&&this._deselectedToEmit.push(n))}_unmarkAll(){this.isEmpty()||this._selection.forEach(n=>this._unmarkSelected(n))}_verifyValueAssignment(n){n.length>1&&this._multiple}_hasQueuedChanges(){return!!(this._deselectedToEmit.length||this._selectedToEmit.length)}_getConcreteValue(n,e){if(this.compareWith){e=e??this._selection;for(let i of e)if(this.compareWith(n,i))return i;return n}else return n}};var Lc=(()=>{class t{_listeners=[];notify(e,i){for(let r of this._listeners)r(e,i)}listen(e){return this._listeners.push(e),()=>{this._listeners=this._listeners.filter(i=>e!==i)}}ngOnDestroy(){this._listeners=[]}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var BD=(()=>{class t{_renderer;_elementRef;onChange=e=>{};onTouched=()=>{};constructor(e,i){this._renderer=e,this._elementRef=i}setProperty(e,i){this._renderer.setProperty(this._elementRef.nativeElement,e,i)}registerOnTouched(e){this.onTouched=e}registerOnChange(e){this.onChange=e}setDisabledState(e){this.setProperty("disabled",e)}static \u0275fac=function(i){return new(i||t)(te(Se),te(F))};static \u0275dir=R({type:t})}return t})(),BF=(()=>{class t extends BD{static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275dir=R({type:t,features:[pe]})}return t})(),zc=new C("");var HF={provide:zc,useExisting:Jt(()=>Ii),multi:!0};function UF(){let t=Fn()?Fn().getUserAgent():"";return/android (\d+)/.test(t.toLowerCase())}var zF=new C(""),Ii=(()=>{class t extends BD{_compositionMode;_composing=!1;constructor(e,i,r){super(e,i),this._compositionMode=r,this._compositionMode==null&&(this._compositionMode=!UF())}writeValue(e){let i=e??"";this.setProperty("value",i)}_handleInput(e){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(e)}_compositionStart(){this._composing=!0}_compositionEnd(e){this._composing=!1,this._compositionMode&&this.onChange(e)}static \u0275fac=function(i){return new(i||t)(te(Se),te(F),te(zF,8))};static \u0275dir=R({type:t,selectors:[["input","formControlName","",3,"type","checkbox",3,"ngNoCva",""],["textarea","formControlName","",3,"ngNoCva",""],["input","formControl","",3,"type","checkbox",3,"ngNoCva",""],["textarea","formControl","",3,"ngNoCva",""],["input","ngModel","",3,"type","checkbox",3,"ngNoCva",""],["textarea","ngModel","",3,"ngNoCva",""],["","ngDefaultControl",""]],hostBindings:function(i,r){i&1&&w("input",function(a){return r._handleInput(a.target.value)})("blur",function(){return r.onTouched()})("compositionstart",function(){return r._compositionStart()})("compositionend",function(a){return r._compositionEnd(a.target.value)})},standalone:!1,features:[Ne([HF]),pe]})}return t})();function Gv(t){return t==null||qv(t)===0}function qv(t){return t==null?null:Array.isArray(t)||typeof t=="string"?t.length:t instanceof Set?t.size:null}var Xo=new C(""),Cf=new C(""),$F=/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,Qo=class{static min(n){return WF(n)}static max(n){return GF(n)}static required(n){return HD(n)}static requiredTrue(n){return qF(n)}static email(n){return YF(n)}static minLength(n){return ZF(n)}static maxLength(n){return QF(n)}static pattern(n){return XF(n)}static nullValidator(n){return df()}static compose(n){return qD(n)}static composeAsync(n){return YD(n)}};function WF(t){return n=>{if(n.value==null||t==null)return null;let e=parseFloat(n.value);return!isNaN(e)&&e<t?{min:{min:t,actual:n.value}}:null}}function GF(t){return n=>{if(n.value==null||t==null)return null;let e=parseFloat(n.value);return!isNaN(e)&&e>t?{max:{max:t,actual:n.value}}:null}}function HD(t){return Gv(t.value)?{required:!0}:null}function qF(t){return t.value===!0?null:{required:!0}}function YF(t){return Gv(t.value)||$F.test(t.value)?null:{email:!0}}function ZF(t){return n=>{let e=n.value?.length??qv(n.value);return e===null||e===0?null:e<t?{minlength:{requiredLength:t,actualLength:e}}:null}}function QF(t){return n=>{let e=n.value?.length??qv(n.value);return e!==null&&e>t?{maxlength:{requiredLength:t,actualLength:e}}:null}}function XF(t){if(!t)return df;let n,e;return typeof t=="string"?(e="",t.charAt(0)!=="^"&&(e+="^"),e+=t,t.charAt(t.length-1)!=="$"&&(e+="$"),n=new RegExp(e)):(e=t.toString(),n=t),i=>{if(Gv(i.value))return null;let r=i.value;return n.test(r)?null:{pattern:{requiredPattern:e,actualValue:r}}}}function df(t){return null}function UD(t){return t!=null}function zD(t){return Zi(t)?st(t):t}function $D(t){let n={};return t.forEach(e=>{n=e!=null?b(b({},n),e):n}),Object.keys(n).length===0?null:n}function WD(t,n){return n.map(e=>e(t))}function KF(t){return!t.validate}function GD(t){return t.map(n=>KF(n)?n:e=>n.validate(e))}function qD(t){if(!t)return null;let n=t.filter(UD);return n.length==0?null:function(e){return $D(WD(e,n))}}function Yv(t){return t!=null?qD(GD(t)):null}function YD(t){if(!t)return null;let n=t.filter(UD);return n.length==0?null:function(e){let i=WD(e,n).map(zD);return rl(i).pipe(J($D))}}function Zv(t){return t!=null?YD(GD(t)):null}function OD(t,n){return t===null?[n]:Array.isArray(t)?[...t,n]:[t,n]}function ZD(t){return t._rawValidators}function QD(t){return t._rawAsyncValidators}function zv(t){return t?Array.isArray(t)?t:[t]:[]}function uf(t,n){return Array.isArray(t)?t.includes(n):t===n}function PD(t,n){let e=zv(n);return zv(t).forEach(r=>{uf(e,r)||e.push(r)}),e}function FD(t,n){return zv(n).filter(e=>!uf(t,e))}var mf=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(n){this._rawValidators=n||[],this._composedValidatorFn=Yv(this._rawValidators)}_setAsyncValidators(n){this._rawAsyncValidators=n||[],this._composedAsyncValidatorFn=Zv(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(n){this._onDestroyCallbacks.push(n)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(n=>n()),this._onDestroyCallbacks=[]}reset(n=void 0){this.control?.reset(n)}hasError(n,e){return this.control?this.control.hasError(n,e):!1}getError(n,e){return this.control?this.control.getError(n,e):null}},Vr=class extends mf{name;get formDirective(){return null}get path(){return null}};var jc="VALID",cf="INVALID",xs="PENDING",Vc="DISABLED",Br=class{},ff=class extends Br{value;source;constructor(n,e){super(),this.value=n,this.source=e}},Hc=class extends Br{pristine;source;constructor(n,e){super(),this.pristine=n,this.source=e}},Uc=class extends Br{touched;source;constructor(n,e){super(),this.touched=n,this.source=e}},Ds=class extends Br{status;source;constructor(n,e){super(),this.status=n,this.source=e}},hf=class extends Br{source;constructor(n){super(),this.source=n}},Es=class extends Br{source;constructor(n){super(),this.source=n}};function XD(t){return(wf(t)?t.validators:t)||null}function JF(t){return Array.isArray(t)?Yv(t):t||null}function KD(t,n){return(wf(n)?n.asyncValidators:t)||null}function eL(t){return Array.isArray(t)?Zv(t):t||null}function wf(t){return t!=null&&!Array.isArray(t)&&typeof t=="object"}function tL(t,n,e){let i=t.controls;if(!(n?Object.keys(i):i).length)throw new H(1e3,"");if(!JD(i,e))throw new H(1001,"")}function nL(t,n,e){t._forEachChild((i,r)=>{if(e[r]===void 0)throw new H(-1002,"")})}var pf=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_hasRequired=S(!1);_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(n,e){this._assignValidators(n),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(n){this._rawValidators=this._composedValidatorFn=n,this._updateHasRequiredValidator()}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(n){this._rawAsyncValidators=this._composedAsyncValidatorFn=n}get parent(){return this._parent}get status(){return Ee(this.statusReactive)}set status(n){Ee(()=>this.statusReactive.set(n))}_status=De(()=>this.statusReactive());statusReactive=S(void 0);get valid(){return this.status===jc}get invalid(){return this.status===cf}get pending(){return this.status===xs}get disabled(){return this.status===Vc}get enabled(){return this.status!==Vc}errors;get pristine(){return Ee(this.pristineReactive)}set pristine(n){Ee(()=>this.pristineReactive.set(n))}_pristine=De(()=>this.pristineReactive());pristineReactive=S(!0);get dirty(){return!this.pristine}get touched(){return Ee(this.touchedReactive)}set touched(n){Ee(()=>this.touchedReactive.set(n))}_touched=De(()=>this.touchedReactive());touchedReactive=S(!1);get untouched(){return!this.touched}_events=new I;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(n){this._assignValidators(n)}setAsyncValidators(n){this._assignAsyncValidators(n)}addValidators(n){this.setValidators(PD(n,this._rawValidators))}addAsyncValidators(n){this.setAsyncValidators(PD(n,this._rawAsyncValidators))}removeValidators(n){this.setValidators(FD(n,this._rawValidators))}removeAsyncValidators(n){this.setAsyncValidators(FD(n,this._rawAsyncValidators))}hasValidator(n){return uf(this._rawValidators,n)}hasAsyncValidator(n){return uf(this._rawAsyncValidators,n)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(n={}){let e=this.touched===!1;this.touched=!0;let i=n.sourceControl??this;n.onlySelf||this._parent?.markAsTouched(V(b({},n),{sourceControl:i})),e&&n.emitEvent!==!1&&this._events.next(new Uc(!0,i))}markAllAsDirty(n={}){this.markAsDirty({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsDirty(n))}markAllAsTouched(n={}){this.markAsTouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(n))}markAsUntouched(n={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=n.sourceControl??this;this._forEachChild(r=>{r.markAsUntouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:i})}),n.onlySelf||this._parent?._updateTouched(n,i),e&&n.emitEvent!==!1&&this._events.next(new Uc(!1,i))}markAsDirty(n={}){let e=this.pristine===!0;this.pristine=!1;let i=n.sourceControl??this;n.onlySelf||this._parent?.markAsDirty(V(b({},n),{sourceControl:i})),e&&n.emitEvent!==!1&&this._events.next(new Hc(!1,i))}markAsPristine(n={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=n.sourceControl??this;this._forEachChild(r=>{r.markAsPristine({onlySelf:!0,emitEvent:n.emitEvent})}),n.onlySelf||this._parent?._updatePristine(n,i),e&&n.emitEvent!==!1&&this._events.next(new Hc(!0,i))}markAsPending(n={}){this.status=xs;let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new Ds(this.status,e)),this.statusChanges.emit(this.status)),n.onlySelf||this._parent?.markAsPending(V(b({},n),{sourceControl:e}))}disable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=Vc,this.errors=null,this._forEachChild(r=>{r.disable(V(b({},n),{onlySelf:!0}))}),this._updateValue();let i=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new ff(this.value,i)),this._events.next(new Ds(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(V(b({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(r=>r(!0))}enable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=jc,this._forEachChild(i=>{i.enable(V(b({},n),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent}),this._updateAncestors(V(b({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(n,e){n.onlySelf||(this._parent?.updateValueAndValidity(n),n.skipPristineCheck||this._parent?._updatePristine({},e),this._parent?._updateTouched({},e))}setParent(n){this._parent=n}getRawValue(){return this.value}updateValueAndValidity(n={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===jc||this.status===xs)&&this._runAsyncValidator(i,n.emitEvent)}let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new ff(this.value,e)),this._events.next(new Ds(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),n.onlySelf||this._parent?.updateValueAndValidity(V(b({},n),{sourceControl:e}))}_updateTreeValidity(n={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(n)),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?Vc:jc}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(n,e){if(this.asyncValidator){this.status=xs,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1,shouldHaveEmitted:n!==!1};let i=zD(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(r=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(r,{emitEvent:e,shouldHaveEmitted:n})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let n=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,n}return!1}setErrors(n,e={}){this.errors=n,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(n){let e=n;return e==null||(Array.isArray(e)||(e=e.split(".")),e.length===0)?null:e.reduce((i,r)=>i&&i._find(r),this)}getError(n,e){let i=e?this.get(e):this;return i?.errors?i.errors[n]:null}hasError(n,e){return!!this.getError(n,e)}get root(){let n=this;for(;n._parent;)n=n._parent;return n}_updateControlsErrors(n,e,i){this.status=this._calculateStatus(),n&&this.statusChanges.emit(this.status),(n||i)&&this._events.next(new Ds(this.status,e)),this._parent&&this._parent._updateControlsErrors(n,e,i)}_initObservables(){this.valueChanges=new O,this.statusChanges=new O}_calculateStatus(){return this._allControlsDisabled()?Vc:this.errors?cf:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(xs)?xs:this._anyControlsHaveStatus(cf)?cf:jc}_anyControlsHaveStatus(n){return this._anyControls(e=>e.status===n)}_anyControlsDirty(){return this._anyControls(n=>n.dirty)}_anyControlsTouched(){return this._anyControls(n=>n.touched)}_updatePristine(n,e){let i=!this._anyControlsDirty(),r=this.pristine!==i;this.pristine=i,n.onlySelf||this._parent?._updatePristine(n,e),r&&this._events.next(new Hc(this.pristine,e))}_updateTouched(n={},e){this.touched=this._anyControlsTouched(),this._events.next(new Uc(this.touched,e)),n.onlySelf||this._parent?._updateTouched(n,e)}_onDisabledChange=[];_registerOnCollectionChange(n){this._onCollectionChange=n}_setUpdateStrategy(n){wf(n)&&n.updateOn!=null&&(this._updateOn=n.updateOn)}_parentMarkedDirty(n){return!n&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(n){return null}_assignValidators(n){this._rawValidators=Array.isArray(n)?n.slice():n,this._composedValidatorFn=JF(this._rawValidators),this._updateHasRequiredValidator()}_assignAsyncValidators(n){this._rawAsyncValidators=Array.isArray(n)?n.slice():n,this._composedAsyncValidatorFn=eL(this._rawAsyncValidators)}_updateHasRequiredValidator(){Ee(()=>this._hasRequired.set(this.hasValidator(Qo.required)))}};function JD(t,n){return Object.hasOwn(t,n)}function iL(t){return t.tagName==="INPUT"||t.tagName==="SELECT"||t.tagName==="TEXTAREA"}function rL(t,n,e,i){switch(e){case"name":t.setAttribute(n,e,i);break;case"disabled":case"readonly":case"required":i?t.setAttribute(n,e,""):t.removeAttribute(n,e);break;case"max":case"min":case"minLength":case"maxLength":i!==void 0?t.setAttribute(n,e,i.toString()):t.removeAttribute(n,e);break}}var $v=class{kind;context;control;message;constructor({kind:n,context:e,control:i}){this.kind=n,this.context=e,this.control=i}};var oL=(()=>{class t{_validator=df;_onChange;_enabled;ngOnChanges(e){if(this.inputName in e){let i=this.normalizeInput(e[this.inputName].currentValue);this._enabled=this.enabled(i),this._validator=this._enabled?this.createValidator(i):df,this._onChange?.()}}validate(e){return this._validator(e)}registerOnValidatorChange(e){this._onChange=e}enabled(e){return e!=null}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,features:[Ae]})}return t})();var aL={provide:Xo,useExisting:Jt(()=>eE),multi:!0};var eE=(()=>{class t extends oL{required;inputName="required";normalizeInput=G;createValidator=e=>HD;enabled(e){return e}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","required","","formControlName","",3,"type","checkbox"],["","required","","formControl","",3,"type","checkbox"],["","required","","ngModel","",3,"type","checkbox"]],hostVars:1,hostBindings:function(i,r){i&2&&L("required",r._enabled?"":null)},inputs:{required:"required"},standalone:!1,features:[Ne([aL]),pe]})}return t})();var sL=new C(""),Ms=new C("",{factory:()=>Sf}),Sf="always";function lL(t,n){return[...n.path,t]}function Wv(t,n,e=Sf){Qv(t,n),n.valueAccessor.writeValue(t.value),(t.disabled||e==="always")&&n.valueAccessor.setDisabledState?.(t.disabled),dL(t,n),mL(t,n),uL(t,n),cL(t,n)}function gf(t,n,e=!0){let i=()=>{};n?.valueAccessor?.registerOnChange(i),n?.valueAccessor?.registerOnTouched(i),vf(t,n),t&&(n._invokeOnDestroyCallbacks(),t._registerOnCollectionChange(()=>{}))}function _f(t,n){t.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(n)})}function cL(t,n){if(n.valueAccessor.setDisabledState){let e=i=>{n.valueAccessor.setDisabledState(i)};t.registerOnDisabledChange(e),n._registerOnDestroy(()=>{t._unregisterOnDisabledChange(e)})}}function Qv(t,n){let e=ZD(t);n.validator!==null?t.setValidators(OD(e,n.validator)):typeof e=="function"&&t.setValidators([e]);let i=QD(t);n.asyncValidator!==null?t.setAsyncValidators(OD(i,n.asyncValidator)):typeof i=="function"&&t.setAsyncValidators([i]);let r=()=>t.updateValueAndValidity();_f(n._rawValidators,r),_f(n._rawAsyncValidators,r)}function vf(t,n){let e=!1;if(t!==null){if(n.validator!==null){let r=ZD(t);if(Array.isArray(r)&&r.length>0){let o=r.filter(a=>a!==n.validator);o.length!==r.length&&(e=!0,t.setValidators(o))}}if(n.asyncValidator!==null){let r=QD(t);if(Array.isArray(r)&&r.length>0){let o=r.filter(a=>a!==n.asyncValidator);o.length!==r.length&&(e=!0,t.setAsyncValidators(o))}}}let i=()=>{};return _f(n._rawValidators,i),_f(n._rawAsyncValidators,i),e}function dL(t,n){n.valueAccessor.registerOnChange(e=>{t._pendingValue=e,t._pendingChange=!0,t._pendingDirty=!0,t.updateOn==="change"&&tE(t,n)})}function uL(t,n){n.valueAccessor.registerOnTouched(()=>{t._pendingTouched=!0,t.updateOn==="blur"&&t._pendingChange&&tE(t,n),t.updateOn!=="submit"&&t.markAsTouched()})}function tE(t,n){t._pendingDirty&&t.markAsDirty(),t.setValue(t._pendingValue,{emitModelToViewChange:!1}),n.viewToModelUpdate(t._pendingValue),t._pendingChange=!1}function mL(t,n){let e=(i,r)=>{n.valueAccessor.writeValue(i),r&&n.viewToModelUpdate(i)};t.registerOnChange(e),n._registerOnDestroy(()=>{t._unregisterOnChange(e)})}function nE(t,n){t==null,Qv(t,n)}function fL(t,n){return vf(t,n)}function iE(t,n){if(!Object.hasOwn(t,"model"))return!1;let e=t.model;return e.isFirstChange()?!0:!Object.is(n,e.currentValue)}function hL(t){return Object.getPrototypeOf(t.constructor)===BF}function rE(t,n){t._syncPendingControls(),n.forEach(e=>{let i=e.control;i.updateOn==="submit"&&i._pendingChange&&(e.viewToModelUpdate(i._pendingValue),i._pendingChange=!1)})}function pL(t,n){if(!n)return null;Array.isArray(n);let e,i,r;return n.forEach(o=>{o.constructor===Ii?e=o:hL(o)?i=o:r=o}),r||i||e||null}function gL(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}var oE={provide:sL,useFactory:()=>{let t=c(Bn,{self:!0});return{setParseErrors:n=>{t.setParseErrorSource(n)},set onReset(n){t.onReset=n}}}},Bn=class extends mf{_parent=null;name=null;valueAccessor=null;isCustomControlBased=!1;userOnReset;resetSubscription;set onReset(n){this.userOnReset=n,this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.control&&(this.resetSubscription=this.control.events.subscribe(e=>{e instanceof Es&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription?.add(this.resetSubscription))}isNativeFormElement=!1;rawValueAccessors;_selectedValueAccessor=null;get selectedValueAccessor(){return this._selectedValueAccessor??=pL(this,this.rawValueAccessors)}parseErrorsValidator=null;renderer;injector;requiredValidatorViaDi;subscription;customControlBindings=null;constructor(n,e,i){super(),this.injector=n,this.renderer=e,this.rawValueAccessors=i,this.injector?.get(Xe)?.onDestroy(()=>{this.removeParseErrorsValidator(this.control),this.subscription?.unsubscribe()})}setupCustomControl(){this.subscription?.unsubscribe();let n=this.injector?.get(Me);if(!this.control||!n)return;let e=n.markForCheck.bind(n);this.subscription=new ce,this.subscription.add(this.control.valueChanges.subscribe(e)),this.subscription.add(this.control.statusChanges.subscribe(e)),this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.userOnReset&&(this.resetSubscription=this.control.events.subscribe(i=>{i instanceof Es&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription.add(this.resetSubscription)),this.parseErrorsValidator&&this.control.addValidators(this.parseErrorsValidator)}ngControlCreate(n){!n.nativeElement.hasAttribute?.("ngNoCva")&&(this.rawValueAccessors&&this.rawValueAccessors.length>0||this.valueAccessor!==null)||!n.customControl||(this.isCustomControlBased=!0,n.listenToCustomControlModel(r=>{this.control?.setValue(r,{emitModelToViewChange:!1}),this.control?.markAsDirty(),this.viewToModelUpdate(r)}),n.listenToCustomControlOutput("touch",()=>{this.control?.markAsTouched()}),this.customControlBindings={},this.isNativeFormElement=iL(n.nativeElement),this.requiredValidatorViaDi=this._rawValidators.find(r=>r instanceof eE))}ngControlUpdate(n,e){if(!this.isCustomControlBased)return;let i=this.control,r=this.customControlBindings;Object.is(r.value,i.value)||(r.value=i.value,n.setCustomControlModelInput(i.value)),this.bindControlProperty(n,r,"touched",i.touched),this.bindControlProperty(n,r,"dirty",i.dirty),this.bindControlProperty(n,r,"valid",i.valid),this.bindControlProperty(n,r,"invalid",i.invalid),this.bindControlProperty(n,r,"pending",i.pending),this.bindControlProperty(n,r,"disabled",i.disabled),this.shouldBindRequired&&this.bindControlProperty(n,r,"required",this.isRequired);let o=i.errors;if(r.errors!==o){r.errors=o;let a=this._convertErrors(o);n.setInputOnDirectives("errors",a)}}get isRequired(){return(this.requiredValidatorViaDi?._enabled||this.control?._hasRequired())??!1}get shouldBindRequired(){return!0}bindControlProperty(n,e,i,r){if(e[i]===r)return;e[i]=r;let o=n.setInputOnDirectives(i,r);this.isNativeFormElement&&!o&&(i==="disabled"||i==="required")&&this.renderer&&rL(this.renderer,n.nativeElement,i,r)}_convertErrors(n){if(n===null)return[];let e=this.control;return Object.entries(n).map(([i,r])=>new $v({context:r,kind:i,control:e}))}setParseErrorSource(n){if(n===void 0)return;let e=null,i=De(()=>{let r=n();return r.length===0?null:r.reduce((o,a)=>(o[a.kind]=a,o),{})});this.parseErrorsValidator=(()=>e).bind(this),vt(()=>{e=i(),this.control?.updateValueAndValidity({emitEvent:!1})},{injector:this.injector})}removeParseErrorsValidator(n){this.parseErrorsValidator&&(n?.removeValidators(this.parseErrorsValidator),n?.updateValueAndValidity({emitEvent:!1}))}},bf=class{_cd;constructor(n){this._cd=n}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}};var Hr=(()=>{class t extends bf{constructor(e){super(e)}static \u0275fac=function(i){return new(i||t)(te(Bn,2))};static \u0275dir=R({type:t,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(i,r){i&2&&T("ng-untouched",r.isUntouched)("ng-touched",r.isTouched)("ng-pristine",r.isPristine)("ng-dirty",r.isDirty)("ng-valid",r.isValid)("ng-invalid",r.isInvalid)("ng-pending",r.isPending)},standalone:!1,features:[pe]})}return t})(),aE=(()=>{class t extends bf{constructor(e){super(e)}static \u0275fac=function(i){return new(i||t)(te(Vr,10))};static \u0275dir=R({type:t,selectors:[["","formGroupName",""],["","formArrayName",""],["","ngModelGroup",""],["","formGroup",""],["","formArray",""],["form",3,"ngNoForm",""],["","ngForm",""]],hostVars:16,hostBindings:function(i,r){i&2&&T("ng-untouched",r.isUntouched)("ng-touched",r.isTouched)("ng-pristine",r.isPristine)("ng-dirty",r.isDirty)("ng-valid",r.isValid)("ng-invalid",r.isInvalid)("ng-pending",r.isPending)("ng-submitted",r.isSubmitted)},standalone:!1,features:[pe]})}return t})(),yf=class extends pf{constructor(n,e,i){super(XD(e),KD(i,e)),this.controls=n,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;registerControl(n,e){let i=this._find(n);return i||(this.controls[n]=e,e.setParent(this),e._registerOnCollectionChange(this._onCollectionChange),e)}addControl(n,e,i={}){this.registerControl(n,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}removeControl(n,e={}){let i=this._find(n);i&&i._registerOnCollectionChange(()=>{}),delete this.controls[n],this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}setControl(n,e,i={}){let r=this._find(n);r&&r._registerOnCollectionChange(()=>{}),delete this.controls[n],e&&this.registerControl(n,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}contains(n){return this._find(n)?.enabled===!0}setValue(n,e={}){Ee(()=>{nL(this,!0,n),Object.keys(n).forEach(i=>{tL(this,!0,i),this.controls[i].setValue(n[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)})}patchValue(n,e={}){n!=null&&(Object.keys(n).forEach(i=>{let r=this._find(i);r&&r.patchValue(n[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(n={},e={}){this._forEachChild((i,r)=>{i.reset(n?n[r]:null,V(b({},e),{onlySelf:!0}))}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e),e?.emitEvent!==!1&&this._events.next(new Es(this))}getRawValue(){return this._reduceChildren({},(n,e,i)=>(n[i]=e.getRawValue(),n))}_syncPendingControls(){let n=this._reduceChildren(!1,(e,i)=>i._syncPendingControls()?!0:e);return n&&this.updateValueAndValidity({onlySelf:!0}),n}_forEachChild(n){Object.keys(this.controls).forEach(e=>{let i=this.controls[e];i&&n(i,e)})}_setUpControls(){this._forEachChild(n=>{n.setParent(this),n._registerOnCollectionChange(this._onCollectionChange)})}_updateValue(){this.value=this._reduceValue()}_anyControls(n){for(let[e,i]of Object.entries(this.controls))if(this.contains(e)&&n(i))return!0;return!1}_reduceValue(){let n={};return this._reduceChildren(n,(e,i,r)=>((i.enabled||this.disabled)&&(e[r]=i.value),e))}_reduceChildren(n,e){let i=n;return this._forEachChild((r,o)=>{i=e(i,r,o)}),i}_allControlsDisabled(){for(let n of Object.keys(this.controls))if(this.controls[n].enabled)return!1;return Object.keys(this.controls).length>0||this.disabled}_find(n){return JD(this.controls,n)?this.controls[n]:null}};var _L={provide:Vr,useExisting:Jt(()=>$c)},Bc=Promise.resolve(),$c=(()=>{class t extends Vr{callSetDisabledState;get submitted(){return Ee(this.submittedReactive)}_submitted=De(()=>this.submittedReactive());submittedReactive=S(!1);_directives=new Set;form;ngSubmit=new O;options;constructor(e,i,r){super(),this.callSetDisabledState=r,this.form=new yf({},Yv(e),Zv(i))}ngAfterViewInit(){this._setUpdateStrategy()}get formDirective(){return this}get control(){return this.form}get path(){return[]}get controls(){return this.form.controls}addControl(e){Bc.then(()=>{let i=this._findContainer(e.path);e.control=i.registerControl(e.name,e.control),e._setupWithForm(this.callSetDisabledState),e.control.updateValueAndValidity({emitEvent:!1}),this._directives.add(e)})}getControl(e){return this.form.get(e.path)}removeControl(e){Bc.then(()=>{this._findContainer(e.path)?.removeControl(e.name),this._directives.delete(e)})}addFormGroup(e){Bc.then(()=>{let i=this._findContainer(e.path),r=new yf({});nE(r,e),i.registerControl(e.name,r),r.updateValueAndValidity({emitEvent:!1})})}removeFormGroup(e){Bc.then(()=>{this._findContainer(e.path)?.removeControl?.(e.name)})}getFormGroup(e){return this.form.get(e.path)}updateModel(e,i){Bc.then(()=>{this.form.get(e.path).setValue(i)})}setValue(e){this.control.setValue(e)}onSubmit(e){return this.submittedReactive.set(!0),rE(this.form,this._directives),this.ngSubmit.emit(e),this.form._events.next(new hf(this.control)),e?.target?.method==="dialog"}onReset(){this.resetForm()}resetForm(e=void 0){this.form.reset(e),this.submittedReactive.set(!1)}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.form._updateOn=this.options.updateOn)}_findContainer(e){return e.pop(),e.length?this.form.get(e):this.form}static \u0275fac=function(i){return new(i||t)(te(Xo,10),te(Cf,10),te(Ms,8))};static \u0275dir=R({type:t,selectors:[["form",3,"ngNoForm","",3,"formGroup","",3,"formArray",""],["ng-form"],["","ngForm",""]],hostBindings:function(i,r){i&1&&w("submit",function(a){return r.onSubmit(a)})("reset",function(){return r.onReset()})},inputs:{options:[0,"ngFormOptions","options"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[Ne([_L]),pe]})}return t})();function LD(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}function jD(t){return typeof t=="object"&&t!==null&&Object.keys(t).length===2&&"value"in t&&"disabled"in t}var xf=class extends pf{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(n=null,e,i){super(XD(e),KD(i,e)),this._applyFormState(n),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),wf(e)&&(e.nonNullable||e.initialValueIsDefault)&&(jD(n)?this.defaultValue=n.value:this.defaultValue=n)}setValue(n,e={}){Ee(()=>{this.value=this._pendingValue=n,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)})}patchValue(n,e={}){this.setValue(n,e)}reset(n=this.defaultValue,e={}){this._applyFormState(n),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),e.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,e?.emitEvent!==!1&&this._events.next(new Es(this))}_updateValue(){}_anyControls(n){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(n){this._onChange.push(n)}_unregisterOnChange(n){LD(this._onChange,n)}registerOnDisabledChange(n){this._onDisabledChange.push(n)}_unregisterOnDisabledChange(n){LD(this._onDisabledChange,n)}_forEachChild(n){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(n){jD(n)?(this.value=this._pendingValue=n.value,n.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=n}};var vL=t=>t instanceof xf;var bL=(()=>{class t extends Vr{callSetDisabledState;get submitted(){return Ee(this._submittedReactive)}set submitted(e){this._submittedReactive.set(e)}_submitted=De(()=>this._submittedReactive());_submittedReactive=S(!1);_oldForm;_onCollectionChange=()=>this._updateDomValue();directives=[];constructor(e,i,r){super(),this.callSetDisabledState=r,this._setValidators(e),this._setAsyncValidators(i)}ngOnChanges(e){this.onChanges(e)}ngOnDestroy(){this.onDestroy()}onChanges(e){this._checkFormPresent(),Object.hasOwn(e,"form")&&(this._updateValidators(),this._updateDomValue(),this._updateRegistrations(),this._oldForm=this.form)}onDestroy(){this.form&&(vf(this.form,this),this.form._onCollectionChange===this._onCollectionChange&&this.form._registerOnCollectionChange(()=>{}))}get formDirective(){return this}get path(){return[]}addControl(e){let i=this.form.get(e.path);return e._setupWithForm(i,this.callSetDisabledState),i.updateValueAndValidity({emitEvent:!1}),this.directives.push(e),i}getControl(e){return this.form.get(e.path)}removeControl(e){gf(e.control||null,e,!1),gL(this.directives,e)}addFormGroup(e){this._setUpFormContainer(e)}removeFormGroup(e){this._cleanUpFormContainer(e)}getFormGroup(e){return this.form.get(e.path)}getFormArray(e){return this.form.get(e.path)}addFormArray(e){this._setUpFormContainer(e)}removeFormArray(e){this._cleanUpFormContainer(e)}updateModel(e,i){this.form.get(e.path).setValue(i)}onReset(){this.resetForm()}resetForm(e=void 0,i={}){this.form.reset(e,i),this._submittedReactive.set(!1)}onSubmit(e){return this.submitted=!0,rE(this.form,this.directives),this.ngSubmit.emit(e),this.form._events.next(new hf(this.control)),e?.target?.method==="dialog"}_updateDomValue(){this.directives.forEach(e=>{let i=e.control,r=this.form.get(e.path);i!==r&&(gf(i||null,e),vL(r)&&e._setupWithForm(r,this.callSetDisabledState))}),this.form._updateTreeValidity({emitEvent:!1})}_setUpFormContainer(e){let i=this.form.get(e.path);nE(i,e),i.updateValueAndValidity({emitEvent:!1})}_cleanUpFormContainer(e){let i=this.form?.get(e.path);i&&fL(i,e)&&i.updateValueAndValidity({emitEvent:!1})}_updateRegistrations(){this.form._registerOnCollectionChange(this._onCollectionChange),this._oldForm?._registerOnCollectionChange(()=>{})}_updateValidators(){Qv(this.form,this),this._oldForm&&vf(this._oldForm,this)}_checkFormPresent(){this.form}static \u0275fac=function(i){return new(i||t)(te(Xo,10),te(Cf,10),te(Ms,8))};static \u0275dir=R({type:t,features:[pe,Ae]})}return t})(),yL={provide:Vr,useExisting:Jt(()=>Wc)},Wc=(()=>{class t extends bL{form=null;ngSubmit=new O;get control(){return this.form}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","formGroup",""]],hostBindings:function(i,r){i&1&&w("submit",function(a){return r.onSubmit(a)})("reset",function(){return r.onReset()})},inputs:{form:[0,"formGroup","form"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[Ne([yL]),pe]})}return t})(),CL={provide:Bn,useExisting:Jt(()=>Ko)},VD=Promise.resolve(),Ko=(()=>{class t extends Bn{_changeDetectorRef;callSetDisabledState;control=new xf;static ngAcceptInputType_isDisabled;_registered=!1;_ngModelInjector;viewModel;name="";isDisabled;model;options;update=new O;constructor(e,i,r,o,a,s,l,d){super(l,d,o),this._changeDetectorRef=a,this.callSetDisabledState=s,this._parent=e,this._setValidators(i),this._setAsyncValidators(r)}ngOnChanges(e){if(this._registered,this._checkForErrors(),!this._registered||"name"in e){if(this._registered&&(this._checkName(),this.formDirective)){let i=e.name.previousValue;this.formDirective.removeControl({name:i,path:this._getPath(i)})}this._setUpControl()}"isDisabled"in e&&this._updateDisabled(e),iE(e,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective?.removeControl(this)}\u0275ngControlCreate(e){super.ngControlCreate(e)}\u0275ngControlUpdate(e){super.ngControlUpdate(e,!1)}get shouldBindRequired(){return!1}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,Wv(this.control,this,this.callSetDisabledState)),this.control.updateValueAndValidity({emitEvent:!1})}_setupWithForm(e){this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,Wv(this.control,this,e))}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(e){VD.then(()=>{this.control.setValue(e,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(e){let i=e.isDisabled.currentValue,r=i!==0&&G(i);VD.then(()=>{r&&!this.control.disabled?this.control.disable():!r&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(e){return this._parent?lL(e,this._parent):[e]}static \u0275fac=function(i){return new(i||t)(te(Vr,9),te(Xo,10),te(Cf,10),te(zc,10),te(Me,8),te(Ms,8),te(X,8),te(Se,8))};static \u0275dir=R({type:t,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],standalone:!1,features:[Ne([CL,oE]),pe,Ae,Qu(null)]})}return t})();var sE=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["form",3,"ngNoForm","",3,"ngNativeValidate",""]],hostAttrs:["novalidate",""],standalone:!1})}return t})();var lE=new C(""),wL={provide:Bn,useExisting:Jt(()=>Xv)},Xv=(()=>{class t extends Bn{_ngModelWarningConfig;callSetDisabledState;viewModel;form;set isDisabled(e){}model;update=new O;static _ngModelWarningSentOnce=!1;_ngModelWarningSent=!1;constructor(e,i,r,o,a,s,l){super(l,s,r),this._ngModelWarningConfig=o,this.callSetDisabledState=a,this._setValidators(e),this._setAsyncValidators(i)}ngOnChanges(e){if(this._isControlChanged(e)){let i=e.form.previousValue;i&&(gf(i,this,!1),this.removeParseErrorsValidator(i)),this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,Wv(this.form,this,this.callSetDisabledState)),this.form.updateValueAndValidity({emitEvent:!1})}iE(e,this.viewModel)&&(this.form.setValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.form&&gf(this.form,this,!1)}get path(){return[]}get control(){return this.form}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_isControlChanged(e){return Object.hasOwn(e,"form")}\u0275ngControlCreate(e){super.ngControlCreate(e)}\u0275ngControlUpdate(e){super.ngControlUpdate(e,!0)}static \u0275fac=function(i){return new(i||t)(te(Xo,10),te(Cf,10),te(zc,10),te(lE,8),te(Ms,8),te(Se,8),te(X,8))};static \u0275dir=R({type:t,selectors:[["","formControl",""]],inputs:{form:[0,"formControl","form"],isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"]},outputs:{update:"ngModelChange"},exportAs:["ngForm"],standalone:!1,features:[Ne([wL,oE]),pe,Ae,Qu(null)]})}return t})();var cE=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();var Ur=(()=>{class t{static withConfig(e){return{ngModule:t,providers:[{provide:Ms,useValue:e.callSetDisabledState??Sf}]}}static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[cE]})}return t})(),dE=(()=>{class t{static withConfig(e){return{ngModule:t,providers:[{provide:lE,useValue:e.warnOnNgModelWithFormControl??"always"},{provide:Ms,useValue:e.callSetDisabledState??Sf}]}}static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[cE]})}return t})();var uE=(()=>{class t{_animationsDisabled=Te();state="unchecked";disabled=!1;appearance="full";static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-pseudo-checkbox"]],hostAttrs:[1,"mat-pseudo-checkbox"],hostVars:12,hostBindings:function(i,r){i&2&&T("mat-pseudo-checkbox-indeterminate",r.state==="indeterminate")("mat-pseudo-checkbox-checked",r.state==="checked")("mat-pseudo-checkbox-disabled",r.disabled)("mat-pseudo-checkbox-minimal",r.appearance==="minimal")("mat-pseudo-checkbox-full",r.appearance==="full")("_mat-animation-noopable",r._animationsDisabled)},inputs:{state:"state",disabled:"disabled",appearance:"appearance"},decls:0,vars:0,template:function(i,r){},styles:[`.mat-pseudo-checkbox {
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
`],encapsulation:2})}return t})();var Ef=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ge]})}return t})();var SL=["*"],xL=`.mdc-list {
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
`,DL=["unscopedContent"],EL=["text"],ML=[[["","matListItemAvatar",""],["","matListItemIcon",""]],[["","matListItemTitle",""]],[["","matListItemLine",""]],"*",[["","matListItemMeta",""]],[["mat-divider"]]],NL=["[matListItemAvatar],[matListItemIcon]","[matListItemTitle]","[matListItemLine]","*","[matListItemMeta]","mat-divider"];var IL=new C("ListOption"),Gc=(()=>{class t{_elementRef=c(F);static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","matListItemTitle",""]],hostAttrs:[1,"mat-mdc-list-item-title","mdc-list-item__primary-text"]})}return t})(),TL=(()=>{class t{_elementRef=c(F);static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","matListItemLine",""]],hostAttrs:[1,"mat-mdc-list-item-line","mdc-list-item__secondary-text"]})}return t})(),Jv=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","matListItemMeta",""]],hostAttrs:[1,"mat-mdc-list-item-meta","mdc-list-item__end"]})}return t})(),mE=(()=>{class t{_listOption=c(IL,{optional:!0});_isAlignedAtStart(){return!this._listOption||this._listOption?._getTogglePosition()==="after"}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,hostVars:4,hostBindings:function(i,r){i&2&&T("mdc-list-item__start",r._isAlignedAtStart())("mdc-list-item__end",!r._isAlignedAtStart())}})}return t})(),kL=(()=>{class t extends mE{static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","matListItemAvatar",""]],hostAttrs:[1,"mat-mdc-list-item-avatar"],features:[pe]})}return t})(),qc=(()=>{class t extends mE{static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","matListItemIcon",""]],hostAttrs:[1,"mat-mdc-list-item-icon"],features:[pe]})}return t})(),AL=new C("MAT_LIST_CONFIG"),Kv=(()=>{class t{_isNonInteractive=!0;get disableRipple(){return this._disableRipple}set disableRipple(e){this._disableRipple=lt(e)}_disableRipple=!1;get disabled(){return this._disabled()}set disabled(e){this._disabled.set(lt(e))}_disabled=S(!1);_defaultOptions=c(AL,{optional:!0});static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,hostVars:1,hostBindings:function(i,r){i&2&&L("aria-disabled",r.disabled)},inputs:{disableRipple:"disableRipple",disabled:"disabled"}})}return t})(),RL=(()=>{class t{_elementRef=c(F);_ngZone=c(U);_listBase=c(Kv,{optional:!0});_platform=c(ye);_hostElement;_isButtonElement;_noopAnimations=Te();_avatars;_icons;set lines(e){this._explicitLines=Vt(e,null),this._updateItemLines(!1)}_explicitLines=null;get disableRipple(){return this.disabled||this._disableRipple||this._noopAnimations||!!this._listBase?.disableRipple}set disableRipple(e){this._disableRipple=lt(e)}_disableRipple=!1;get disabled(){return this._disabled()||!!this._listBase?.disabled}set disabled(e){this._disabled.set(lt(e))}_disabled=S(!1);_subscriptions=new ce;_rippleRenderer=null;_hasUnscopedTextContent=!1;rippleConfig;get rippleDisabled(){return this.disableRipple||!!this.rippleConfig.disabled}constructor(){c(Je).load(pn);let e=c(ys,{optional:!0});this.rippleConfig=e||{},this._hostElement=this._elementRef.nativeElement,this._isButtonElement=this._hostElement.nodeName.toLowerCase()==="button",this._listBase&&!this._listBase._isNonInteractive&&this._initInteractiveListItem(),this._isButtonElement&&!this._hostElement.hasAttribute("type")&&this._hostElement.setAttribute("type","button")}ngAfterViewInit(){this._monitorProjectedLinesAndTitle(),this._updateItemLines(!0)}ngOnDestroy(){this._subscriptions.unsubscribe(),this._rippleRenderer!==null&&this._rippleRenderer._removeTriggerEvents()}_hasIconOrAvatar(){return!!(this._avatars.length||this._icons.length)}_initInteractiveListItem(){this._hostElement.classList.add("mat-mdc-list-item-interactive"),this._rippleRenderer=new Yo(this,this._ngZone,this._hostElement,this._platform,c(X)),this._rippleRenderer.setupTriggerEvents(this._hostElement)}_monitorProjectedLinesAndTitle(){this._ngZone.runOutsideAngular(()=>{this._subscriptions.add(mt(this._lines.changes,this._titles.changes).subscribe(()=>this._updateItemLines(!1)))})}_updateItemLines(e){if(!this._lines||!this._titles||!this._unscopedContent)return;e&&this._checkDomForUnscopedTextContent();let i=this._explicitLines??this._inferLinesFromContent(),r=this._unscopedContent.nativeElement;if(this._hostElement.classList.toggle("mat-mdc-list-item-single-line",i<=1),this._hostElement.classList.toggle("mdc-list-item--with-one-line",i<=1),this._hostElement.classList.toggle("mdc-list-item--with-two-lines",i===2),this._hostElement.classList.toggle("mdc-list-item--with-three-lines",i===3),this._hasUnscopedTextContent){let o=this._titles.length===0&&i===1;r.classList.toggle("mdc-list-item__primary-text",o),r.classList.toggle("mdc-list-item__secondary-text",!o)}else r.classList.remove("mdc-list-item__primary-text"),r.classList.remove("mdc-list-item__secondary-text")}_inferLinesFromContent(){let e=this._titles.length+this._lines.length;return this._hasUnscopedTextContent&&(e+=1),e}_checkDomForUnscopedTextContent(){this._hasUnscopedTextContent=Array.from(this._unscopedContent.nativeElement.childNodes).filter(e=>e.nodeType!==e.COMMENT_NODE).some(e=>!!(e.textContent&&e.textContent.trim()))}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,contentQueries:function(i,r,o){if(i&1&&ct(o,kL,4)(o,qc,4),i&2){let a;z(a=$())&&(r._avatars=a),z(a=$())&&(r._icons=a)}},hostVars:4,hostBindings:function(i,r){i&2&&(L("aria-disabled",r.disabled)("disabled",r._isButtonElement&&r.disabled||null),T("mdc-list-item--disabled",r.disabled))},inputs:{lines:"lines",disableRipple:"disableRipple",disabled:"disabled"}})}return t})();var Mf=(()=>{class t extends RL{_lines;_titles;_meta;_unscopedContent;_itemText;get activated(){return this._activated}set activated(e){this._activated=lt(e)}_activated=!1;_getAriaCurrent(){return this._hostElement.nodeName==="A"&&this._activated?"page":null}_hasBothLeadingAndTrailing(){return this._meta.length!==0&&(this._avatars.length!==0||this._icons.length!==0)}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275cmp=D({type:t,selectors:[["mat-list-item"],["a","mat-list-item",""],["button","mat-list-item",""]],contentQueries:function(i,r,o){if(i&1&&ct(o,TL,5)(o,Gc,5)(o,Jv,5),i&2){let a;z(a=$())&&(r._lines=a),z(a=$())&&(r._titles=a),z(a=$())&&(r._meta=a)}},viewQuery:function(i,r){if(i&1&&Re(DL,5)(EL,5),i&2){let o;z(o=$())&&(r._unscopedContent=o.first),z(o=$())&&(r._itemText=o.first)}},hostAttrs:[1,"mat-mdc-list-item","mdc-list-item"],hostVars:13,hostBindings:function(i,r){i&2&&(L("aria-current",r._getAriaCurrent()),T("mdc-list-item--activated",r.activated)("mdc-list-item--with-leading-avatar",r._avatars.length!==0)("mdc-list-item--with-leading-icon",r._icons.length!==0)("mdc-list-item--with-trailing-meta",r._meta.length!==0)("mat-mdc-list-item-both-leading-and-trailing",r._hasBothLeadingAndTrailing())("_mat-animation-noopable",r._noopAnimations))},inputs:{activated:"activated"},exportAs:["matListItem"],features:[pe],ngContentSelectors:NL,decls:10,vars:0,consts:[["unscopedContent",""],[1,"mdc-list-item__content"],[1,"mat-mdc-list-item-unscoped-content",3,"cdkObserveContent"],[1,"mat-focus-indicator"]],template:function(i,r){i&1&&(_e(ML),B(0),m(1,"span",1),B(2,1),B(3,2),m(4,"span",2,0),w("cdkObserveContent",function(){return r._updateItemLines(!0)}),B(6,3),f()(),B(7,4),B(8,5),j(9,"div",3))},dependencies:[Ym],encapsulation:2})}return t})();var fE=(()=>{class t extends Kv{_isNonInteractive=!1;static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275cmp=D({type:t,selectors:[["mat-nav-list"]],hostAttrs:["role","navigation",1,"mat-mdc-nav-list","mat-mdc-list-base","mdc-list"],exportAs:["matNavList"],features:[Ne([{provide:Kv,useExisting:t}]),pe],ngContentSelectors:SL,decls:1,vars:0,template:function(i,r){i&1&&(_e(),B(0))},styles:[xL],encapsulation:2})}return t})();var Nf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ps,Lr,Ef,ge,Ss]})}return t})();var Yc=class{_attachedHost=null;attach(n){return this._attachedHost=n,n.attach(this)}detach(){let n=this._attachedHost;n!=null&&(this._attachedHost=null,n.detach())}get isAttached(){return this._attachedHost!=null}setAttachedHost(n){this._attachedHost=n}},zr=class extends Yc{component;viewContainerRef;injector;projectableNodes;bindings;directives;constructor(n,e,i,r,o,a){super(),this.component=n,this.viewContainerRef=e,this.injector=i,this.projectableNodes=r,this.bindings=o||null,this.directives=a||null}},cn=class extends Yc{templateRef;viewContainerRef;context;injector;constructor(n,e,i,r){super(),this.templateRef=n,this.viewContainerRef=e,this.context=i,this.injector=r}get origin(){return this.templateRef.elementRef}attach(n,e=this.context){return this.context=e,super.attach(n)}detach(){return this.context=void 0,super.detach()}},tb=class extends Yc{element;constructor(n){super(),this.element=n instanceof F?n.nativeElement:n}},Ns=class{_attachedPortal=null;_disposeFn=null;_isDisposed=!1;hasAttached(){return!!this._attachedPortal}attach(n){if(n instanceof zr)return this._attachedPortal=n,this.attachComponentPortal(n);if(n instanceof cn)return this._attachedPortal=n,this.attachTemplatePortal(n);if(this.attachDomPortal&&n instanceof tb)return this._attachedPortal=n,this.attachDomPortal(n)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn()}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=!0}setDisposeFn(n){this._disposeFn=n}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null)}},Is=class extends Ns{outletElement;_appRef;_defaultInjector;constructor(n,e,i){super(),this.outletElement=n,this._appRef=e,this._defaultInjector=i}attachComponentPortal(n){let e;if(n.viewContainerRef){let i=n.injector||n.viewContainerRef.injector,r=i.get(xi,null,{optional:!0})||void 0;e=n.viewContainerRef.createComponent(n.component,{index:n.viewContainerRef.length,injector:i,ngModuleRef:r,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0,directives:n.directives||void 0}),this.setDisposeFn(()=>e.destroy())}else{let i=this._appRef,r=n.injector||this._defaultInjector||X.NULL,o=r.get(We,i.injector);e=im(n.component,{elementInjector:r,environmentInjector:o,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0,directives:n.directives||void 0}),i.attachView(e.hostView),this.setDisposeFn(()=>{i.viewCount>0&&i.detachView(e.hostView),e.destroy()})}return this.outletElement.appendChild(this._getComponentRootNode(e)),this._attachedPortal=n,e}attachTemplatePortal(n){let e=n.viewContainerRef,i=e.createEmbeddedView(n.templateRef,n.context,{injector:n.injector});return i.rootNodes.forEach(r=>this.outletElement.appendChild(r)),i.detectChanges(),this.setDisposeFn(()=>{let r=e.indexOf(i);r!==-1&&e.remove(r)}),this._attachedPortal=n,i}attachDomPortal=n=>{let e=n.element;e.parentNode;let i=this.outletElement.ownerDocument.createComment("dom-portal");e.parentNode.insertBefore(i,e),this.outletElement.appendChild(e),this._attachedPortal=n,super.setDisposeFn(()=>{i.parentNode&&i.parentNode.replaceChild(e,i)})};dispose(){super.dispose(),this.outletElement.remove()}_getComponentRootNode(n){return n.hostView.rootNodes[0]}},hE=(()=>{class t extends cn{constructor(){let e=c(bt),i=c(ht);super(e,i)}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdkPortal",""]],exportAs:["cdkPortal"],features:[pe]})}return t})(),Ti=(()=>{class t extends Ns{_moduleRef=c(xi,{optional:!0});_document=c(K);_viewContainerRef=c(ht);_isInitialized=!1;_attachedRef=null;get portal(){return this._attachedPortal}set portal(e){this.hasAttached()&&!e&&!this._isInitialized||(this.hasAttached()&&super.detach(),e&&super.attach(e),this._attachedPortal=e||null)}attached=new O;get attachedRef(){return this._attachedRef}ngOnInit(){this._isInitialized=!0}ngOnDestroy(){super.dispose(),this._attachedRef=this._attachedPortal=null}attachComponentPortal(e){e.setAttachedHost(this);let i=e.viewContainerRef!=null?e.viewContainerRef:this._viewContainerRef,r=i.createComponent(e.component,{index:i.length,injector:e.injector||i.injector,projectableNodes:e.projectableNodes||void 0,ngModuleRef:this._moduleRef||void 0,bindings:e.bindings||void 0,directives:e.directives||void 0});return i!==this._viewContainerRef&&this._getRootNode().appendChild(r.hostView.rootNodes[0]),super.setDisposeFn(()=>r.destroy()),this._attachedPortal=e,this._attachedRef=r,this.attached.emit(r),r}attachTemplatePortal(e){e.setAttachedHost(this);let i=this._viewContainerRef.createEmbeddedView(e.templateRef,e.context,{injector:e.injector});return super.setDisposeFn(()=>this._viewContainerRef.clear()),this._attachedPortal=e,this._attachedRef=i,this.attached.emit(i),i}attachDomPortal=e=>{let i=e.element;i.parentNode;let r=this._document.createComment("dom-portal");e.setAttachedHost(this),i.parentNode.insertBefore(r,i),this._getRootNode().appendChild(i),this._attachedPortal=e,super.setDisposeFn(()=>{r.parentNode&&r.parentNode.replaceChild(i,r)})};_getRootNode(){let e=this._viewContainerRef.element.nativeElement;return e.nodeType===e.ELEMENT_NODE?e:e.parentNode}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","cdkPortalOutlet",""]],inputs:{portal:[0,"cdkPortalOutlet","portal"]},outputs:{attached:"attached"},exportAs:["cdkPortalOutlet"],features:[pe]})}return t})(),ir=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();var pE=ef();function As(t){return new If(t.get(Mn),t.get(K))}var If=class{_viewportRuler;_previousHTMLStyles={top:"",left:""};_previousScrollPosition;_isEnabled=!1;_document;constructor(n,e){this._viewportRuler=n,this._document=e}attach(){}enable(){if(this._canBeEnabled()){let n=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=n.style.left||"",this._previousHTMLStyles.top=n.style.top||"",n.style.left=Dt(-this._previousScrollPosition.left),n.style.top=Dt(-this._previousScrollPosition.top),n.classList.add("cdk-global-scrollblock"),this._isEnabled=!0}}disable(){if(this._isEnabled){let n=this._document.documentElement,e=this._document.body,i=n.style,r=e.style,o=i.scrollBehavior||"",a=r.scrollBehavior||"";this._isEnabled=!1,i.left=this._previousHTMLStyles.left,i.top=this._previousHTMLStyles.top,n.classList.remove("cdk-global-scrollblock"),pE&&(i.scrollBehavior=r.scrollBehavior="auto"),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),pE&&(i.scrollBehavior=o,r.scrollBehavior=a)}}_canBeEnabled(){if(this._document.documentElement.classList.contains("cdk-global-scrollblock")||this._isEnabled)return!1;let e=this._document.documentElement,i=this._viewportRuler.getViewportSize();return e.scrollHeight>i.height||e.scrollWidth>i.width}};function wE(t,n){return new Tf(t.get(jr),t.get(U),t.get(Mn),n)}var Tf=class{_scrollDispatcher;_ngZone;_viewportRuler;_config;_scrollSubscription=null;_overlayRef;_initialScrollPosition;constructor(n,e,i,r){this._scrollDispatcher=n,this._ngZone=e,this._viewportRuler=i,this._config=r}attach(n){this._overlayRef,this._overlayRef=n}enable(){if(this._scrollSubscription)return;let n=this._scrollDispatcher.scrolled(0).pipe(ue(e=>!e||!this._overlayRef.overlayElement.contains(e.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=n.subscribe(()=>{let e=this._viewportRuler.getViewportScrollPosition().top;Math.abs(e-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition()})):this._scrollSubscription=n.subscribe(this._detach)}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}_detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach())}};var Zc=class{enable(){}disable(){}attach(){}};function ib(t,n){return n.some(e=>{let i=t.bottom<e.top,r=t.top>e.bottom,o=t.right<e.left,a=t.left>e.right;return i||r||o||a})}function gE(t,n){return n.some(e=>{let i=t.top<e.top,r=t.bottom>e.bottom,o=t.left<e.left,a=t.right>e.right;return i||r||o||a})}function or(t,n){return new kf(t.get(jr),t.get(Mn),t.get(U),n)}var kf=class{_scrollDispatcher;_viewportRuler;_ngZone;_config;_scrollSubscription=null;_overlayRef;constructor(n,e,i,r){this._scrollDispatcher=n,this._viewportRuler=e,this._ngZone=i,this._config=r}attach(n){this._overlayRef,this._overlayRef=n}enable(){if(!this._scrollSubscription){let n=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(n).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let e=this._overlayRef.overlayElement.getBoundingClientRect(),{width:i,height:r}=this._viewportRuler.getViewportSize();ib(e,[{width:i,height:r,bottom:r,right:i,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()))}})}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}},SE=(()=>{class t{_injector=c(X);noop=()=>new Zc;close=e=>wE(this._injector,e);block=()=>As(this._injector);reposition=e=>or(this._injector,e);static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),rr=class{positionStrategy;scrollStrategy=new Zc;panelClass="";hasBackdrop=!1;backdropClass="cdk-overlay-dark-backdrop";disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=!1;usePopover;eventPredicate;constructor(n){if(n){let e=Object.keys(n);for(let i of e)n[i]!==void 0&&(this[i]=n[i])}}};var Af=class{connectionPair;scrollableViewProperties;constructor(n,e){this.connectionPair=n,this.scrollableViewProperties=e}};var xE=(()=>{class t{_attachedOverlays=[];_document=c(K);_isAttached=!1;ngOnDestroy(){this.detach()}add(e){this.remove(e),this._attachedOverlays.push(e)}remove(e){let i=this._attachedOverlays.indexOf(e);i>-1&&this._attachedOverlays.splice(i,1),this._attachedOverlays.length===0&&this.detach()}canReceiveEvent(e,i,r){return r.observers.length<1?!1:e.eventPredicate?e.eventPredicate(i):!0}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),DE=(()=>{class t extends xE{_ngZone=c(U);_renderer=c(Mt).createRenderer(null,null);_cleanupKeydown;add(e){super.add(e),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen("body","keydown",this._keydownListener)}),this._isAttached=!0)}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=!1)}_keydownListener=e=>{let i=this._attachedOverlays;for(let r=i.length-1;r>-1;r--){let o=i[r];if(this.canReceiveEvent(o,e,o._keydownEvents)){this._ngZone.run(()=>o._keydownEvents.next(e));break}}};static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),EE=(()=>{class t extends xE{_platform=c(ye);_ngZone=c(U);_renderer=c(Mt).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=!1;_pointerDownEventTarget=null;_cleanups;add(e){if(super.add(e),!this._isAttached){let i=this._document.body,r={capture:!0},o=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[o.listen(i,"pointerdown",this._pointerDownListener,r),o.listen(i,"click",this._clickListener,r),o.listen(i,"auxclick",this._clickListener,r),o.listen(i,"contextmenu",this._clickListener,r)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=i.style.cursor,i.style.cursor="pointer",this._cursorStyleIsSet=!0),this._isAttached=!0}}detach(){this._isAttached&&(this._cleanups?.forEach(e=>e()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=!1),this._isAttached=!1)}_pointerDownListener=e=>{this._pointerDownEventTarget=zt(e)};_clickListener=e=>{let i=zt(e),r=e.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:i;this._pointerDownEventTarget=null;let o=this._attachedOverlays.slice();for(let a=o.length-1;a>-1;a--){let s=o[a],l=s._outsidePointerEvents;if(!(!s.hasAttached()||!this.canReceiveEvent(s,e,l))){if(_E(s.overlayElement,i)||_E(s.overlayElement,r))break;this._ngZone?this._ngZone.run(()=>l.next(e)):l.next(e)}}};static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function _E(t,n){let e=typeof ShadowRoot<"u"&&ShadowRoot,i=n;for(;i;){if(i===t)return!0;i=e&&i instanceof ShadowRoot?i.host:i.parentNode}return!1}var ME=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["ng-component"]],hostAttrs:["cdk-overlay-style-loader",""],decls:0,vars:0,template:function(i,r){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
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
`],encapsulation:2})}return t})(),Pf=(()=>{class t{_platform=c(ye);_containerElement;_document=c(K);_styleLoader=c(Je);ngOnDestroy(){this._containerElement?.remove()}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let e="cdk-overlay-container";if(this._platform.isBrowser||kv()){let r=this._document.querySelectorAll(`.${e}[platform="server"], .${e}[platform="test"]`);for(let o=0;o<r.length;o++)r[o].remove()}let i=this._document.createElement("div");i.classList.add(e),kv()?i.setAttribute("platform","test"):this._platform.isBrowser||i.setAttribute("platform","server"),this._document.body.appendChild(i),this._containerElement=i}_loadStyles(){this._styleLoader.load(ME)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),rb=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(n,e,i,r){this._renderer=e,this._ngZone=i,this.element=n.createElement("div"),this.element.classList.add("cdk-overlay-backdrop"),this._cleanupClick=e.listen(this.element,"click",r)}detach(){this._ngZone.runOutsideAngular(()=>{let n=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(n,"transitionend",this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),n.style.pointerEvents="none",n.classList.remove("cdk-overlay-backdrop-showing")})}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove()}};function ob(t){return t&&t.nodeType===1}var nb=new Set;var Ts=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new I;_attachments=new I;_detachments=new I;_positionStrategy;_scrollStrategy;_locationChanges=ce.EMPTY;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=!1;_previousHostParent;_keydownEvents=new I;_outsidePointerEvents=new I;_afterNextRenderRef;constructor(n,e,i,r,o,a,s,l,d,u=!1,h,_){this._portalOutlet=n,this._host=e,this._pane=i,this._config=r,this._ngZone=o,this._keyboardDispatcher=a,this._document=s,this._location=l,this._outsideClickDispatcher=d,this._animationsDisabled=u,this._injector=h,this._renderer=_,r.scrollStrategy&&(this._scrollStrategy=r.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=r.positionStrategy}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(n){if(this._disposed)return null;this._attachHost();let e=this._portalOutlet.attach(n);return this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),nb.add(this),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=tt(()=>{this.hasAttached()&&this.updatePosition()},{injector:this._injector}),this._togglePointerEvents(!0),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!0),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof e?.onDestroy=="function"&&e.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()))}),e}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(!1),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let n=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),nb.delete(this),n}dispose(){if(this._disposed)return;let n=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,n&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=!0,nb.delete(this)}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply()}updatePositionStrategy(n){n!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=n,this.hasAttached()&&(n.attach(this),this.updatePosition()))}updateSize(n){this._config=b(b({},this._config),n),this._updateElementSize()}setDirection(n){this._config=V(b({},this._config),{direction:n}),this._updateElementDirection()}addPanelClass(n){this._pane&&this._toggleClasses(this._pane,n,!0)}removePanelClass(n){this._pane&&this._toggleClasses(this._pane,n,!1)}getDirection(){let n=this._config.direction;return n?typeof n=="string"?n:n.value:"ltr"}updateScrollStrategy(n){n!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=n,this.hasAttached()&&(n.attach(this),n.enable()))}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection())}_updateElementSize(){if(!this._pane)return;let n=this._pane.style;n.width=Dt(this._config.width),n.height=Dt(this._config.height),n.minWidth=Dt(this._config.minWidth),n.minHeight=Dt(this._config.minHeight),n.maxWidth=Dt(this._config.maxWidth),n.maxHeight=Dt(this._config.maxHeight)}_togglePointerEvents(n){this._pane.style.pointerEvents=n?"":"none"}_attachHost(){if(!this._host.parentElement){let n=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;ob(n)?n.after(this._host):n?.type==="parent"?n.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host)}if(this._config.usePopover)try{this._host.showPopover()}catch{}}_attachBackdrop(){let n="cdk-overlay-backdrop-showing";this._backdropRef?.dispose(),this._backdropRef=new rb(this._document,this._renderer,this._ngZone,e=>{this._backdropClick.next(e)}),this._animationsDisabled&&this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,!0),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(n))}):this._backdropRef.element.classList.add(n)}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host)}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach()}_toggleClasses(n,e,i){let r=cs(e||[]).filter(o=>!!o);r.length&&(i?n.classList.add(...r):n.classList.remove(...r))}_detachContentWhenEmpty(){let n=!1;try{this._detachContentAfterRenderRef=tt(()=>{n=!0,this._detachContent()},{injector:this._injector})}catch(e){if(n)throw e;this._detachContent()}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent()}),this._detachContentMutationObserver.observe(this._pane,{childList:!0}))}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!1),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent())}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect()}_disposeScrollStrategy(){let n=this._scrollStrategy;n?.disable(),n?.detach?.()}},vE="cdk-overlay-connected-position-bounding-box",OL=/([A-Za-z%]+)$/;function ea(t,n){return new Rf(n,t.get(Mn),t.get(K),t.get(ye),t.get(Pf))}var Rf=class{_viewportRuler;_document;_platform;_overlayContainer;_overlayRef;_isInitialRender=!1;_lastBoundingBoxSize={width:0,height:0};_isPushed=!1;_canPush=!0;_growAfterOpen=!1;_hasFlexibleDimensions=!0;_positionLocked=!1;_originRect;_overlayRect;_viewportRect;_containerRect;_viewportMargin=0;_scrollables=[];_preferredPositions=[];_origin;_pane;_isDisposed=!1;_boundingBox=null;_lastPosition=null;_lastScrollVisibility=null;_positionChanges=new I;_resizeSubscription=ce.EMPTY;_offsetX=0;_offsetY=0;_transformOriginSelector;_appliedPanelClasses=[];_previousPushAmount=null;_popoverLocation="global";positionChanges=this._positionChanges;get positions(){return this._preferredPositions}constructor(n,e,i,r,o){this._viewportRuler=e,this._document=i,this._platform=r,this._overlayContainer=o,this.setOrigin(n)}attach(n){this._overlayRef&&this._overlayRef,this._validatePositions(),n.hostElement.classList.add(vE),this._overlayRef=n,this._boundingBox=n.hostElement,this._pane=n.overlayElement,this._isDisposed=!1,this._isInitialRender=!0,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=!0,this.apply()})}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._getContainerRect();let n=this._originRect,e=this._overlayRect,i=this._viewportRect,r=this._containerRect,o=[],a;for(let s of this._preferredPositions){let l=this._getOriginPoint(n,r,s),d=this._getOverlayPoint(l,e,s),u=this._getOverlayFit(d,e,i,s);if(u.isCompletelyWithinViewport){this._isPushed=!1,this._applyPosition(s,l);return}if(this._canFitWithFlexibleDimensions(u,d,i)){o.push({position:s,origin:l,overlayRect:e,boundingBoxRect:this._calculateBoundingBoxRect(l,s)});continue}(!a||a.overlayFit.visibleArea<u.visibleArea)&&(a={overlayFit:u,overlayPoint:d,originPoint:l,position:s,overlayRect:e})}if(o.length){let s=null,l=-1;for(let d of o){let u=d.boundingBoxRect.width*d.boundingBoxRect.height*(d.position.weight||1);u>l&&(l=u,s=d)}this._isPushed=!1,this._applyPosition(s.position,s.origin);return}if(this._canPush){this._isPushed=!0,this._applyPosition(a.position,a.originPoint);return}this._applyPosition(a.position,a.originPoint)}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe()}dispose(){this._isDisposed||(this._boundingBox&&Jo(this._boundingBox.style,{top:"",left:"",right:"",bottom:"",height:"",width:"",alignItems:"",justifyContent:""}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(vE),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=!0)}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let n=this._lastPosition;n?(this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._getContainerRect(),this._applyPosition(n,this._getOriginPoint(this._originRect,this._containerRect,n))):this.apply()}withScrollableContainers(n){return this._scrollables=n,this}withPositions(n){return this._preferredPositions=n,n.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(n){return this._viewportMargin=n,this}withFlexibleDimensions(n=!0){return this._hasFlexibleDimensions=n,this}withGrowAfterOpen(n=!0){return this._growAfterOpen=n,this}withPush(n=!0){return this._canPush=n,this}withLockedPosition(n=!0){return this._positionLocked=n,this}setOrigin(n){return this._origin=n,this}withDefaultOffsetX(n){return this._offsetX=n,this}withDefaultOffsetY(n){return this._offsetY=n,this}withTransformOriginOn(n){return this._transformOriginSelector=n,this}withPopoverLocation(n){return this._popoverLocation=n,this}getPopoverInsertionPoint(){return this._popoverLocation==="global"?null:this._popoverLocation!=="inline"?this._popoverLocation:this._origin instanceof F?this._origin.nativeElement:ob(this._origin)?this._origin:null}_getOriginPoint(n,e,i){let r;if(i.originX=="center")r=n.left+n.width/2;else{let a=this._isRtl()?n.right:n.left,s=this._isRtl()?n.left:n.right;r=i.originX=="start"?a:s}e.left<0&&(r-=e.left);let o;return i.originY=="center"?o=n.top+n.height/2:o=i.originY=="top"?n.top:n.bottom,e.top<0&&(o-=e.top),{x:r,y:o}}_getOverlayPoint(n,e,i){let r;i.overlayX=="center"?r=-e.width/2:i.overlayX==="start"?r=this._isRtl()?-e.width:0:r=this._isRtl()?0:-e.width;let o;return i.overlayY=="center"?o=-e.height/2:o=i.overlayY=="top"?0:-e.height,{x:n.x+r,y:n.y+o}}_getOverlayFit(n,e,i,r){let o=yE(e),{x:a,y:s}=n,l=this._getOffset(r,"x"),d=this._getOffset(r,"y");l&&(a+=l),d&&(s+=d);let u=0-a,h=a+o.width-i.width,_=0-s,v=s+o.height-i.height,x=this._subtractOverflows(o.width,u,h),A=this._subtractOverflows(o.height,_,v),re=x*A;return{visibleArea:re,isCompletelyWithinViewport:o.width*o.height===re,fitsInViewportVertically:A===o.height,fitsInViewportHorizontally:x==o.width}}_canFitWithFlexibleDimensions(n,e,i){if(this._hasFlexibleDimensions){let r=i.bottom-e.y,o=i.right-e.x,a=bE(this._overlayRef.getConfig().minHeight),s=bE(this._overlayRef.getConfig().minWidth),l=n.fitsInViewportVertically||a!=null&&a<=r,d=n.fitsInViewportHorizontally||s!=null&&s<=o;return l&&d}return!1}_pushOverlayOnScreen(n,e,i){if(this._previousPushAmount&&this._positionLocked)return{x:n.x+this._previousPushAmount.x,y:n.y+this._previousPushAmount.y};let r=yE(e),o=this._viewportRect,a=Math.max(n.x+r.width-o.width,0),s=Math.max(n.y+r.height-o.height,0),l=Math.max(o.top-i.top-n.y,0),d=Math.max(o.left-i.left-n.x,0),u=0,h=0;return r.width<=o.width?u=d||-a:u=n.x<this._getViewportMarginStart()?o.left-i.left-n.x:0,r.height<=o.height?h=l||-s:h=n.y<this._getViewportMarginTop()?o.top-i.top-n.y:0,this._previousPushAmount={x:u,y:h},{x:n.x+u,y:n.y+h}}_applyPosition(n,e){if(this._setTransformOrigin(n),this._setOverlayElementStyles(e,n),this._setBoundingBoxStyles(e,n),n.panelClass&&this._addPanelClasses(n.panelClass),this._positionChanges.observers.length){let i=this._getScrollVisibility();if(n!==this._lastPosition||!this._lastScrollVisibility||!PL(this._lastScrollVisibility,i)){let r=new Af(n,i);this._positionChanges.next(r)}this._lastScrollVisibility=i}this._lastPosition=n,this._isInitialRender=!1}_setTransformOrigin(n){if(!this._transformOriginSelector)return;let e=this._boundingBox.querySelectorAll(this._transformOriginSelector),i,r=n.overlayY;n.overlayX==="center"?i="center":this._isRtl()?i=n.overlayX==="start"?"right":"left":i=n.overlayX==="start"?"left":"right";for(let o=0;o<e.length;o++)e[o].style.transformOrigin=`${i} ${r}`}_calculateBoundingBoxRect(n,e){let i=this._viewportRect,r=this._isRtl(),o,a,s;if(e.overlayY==="top")a=n.y,o=i.height-a+this._getViewportMarginBottom();else if(e.overlayY==="bottom")s=i.height-n.y+this._getViewportMarginTop()+this._getViewportMarginBottom(),o=i.height-s+this._getViewportMarginTop();else{let v=Math.min(i.bottom-n.y+i.top,n.y),x=this._lastBoundingBoxSize.height;o=v*2,a=n.y-v,o>x&&!this._isInitialRender&&!this._growAfterOpen&&(a=n.y-x/2)}let l=e.overlayX==="start"&&!r||e.overlayX==="end"&&r,d=e.overlayX==="end"&&!r||e.overlayX==="start"&&r,u,h,_;if(d)_=i.width-n.x+this._getViewportMarginStart()+this._getViewportMarginEnd(),u=n.x-this._getViewportMarginStart();else if(l)h=n.x,u=i.right-n.x-this._getViewportMarginEnd();else{let v=Math.min(i.right-n.x+i.left,n.x),x=this._lastBoundingBoxSize.width;u=v*2,h=n.x-v,u>x&&!this._isInitialRender&&!this._growAfterOpen&&(h=n.x-x/2)}return{top:a,left:h,bottom:s,right:_,width:u,height:o}}_setBoundingBoxStyles(n,e){let i=this._calculateBoundingBoxRect(n,e);!this._isInitialRender&&!this._growAfterOpen&&(i.height=Math.min(i.height,this._lastBoundingBoxSize.height),i.width=Math.min(i.width,this._lastBoundingBoxSize.width));let r={};if(this._hasExactPosition())r.top=r.left="0",r.bottom=r.right="auto",r.maxHeight=r.maxWidth="",r.width=r.height="100%";else{let o=this._overlayRef.getConfig().maxHeight,a=this._overlayRef.getConfig().maxWidth;r.width=Dt(i.width),r.height=Dt(i.height),r.top=Dt(i.top)||"auto",r.bottom=Dt(i.bottom)||"auto",r.left=Dt(i.left)||"auto",r.right=Dt(i.right)||"auto",e.overlayX==="center"?r.alignItems="center":r.alignItems=e.overlayX==="end"?"flex-end":"flex-start",e.overlayY==="center"?r.justifyContent="center":r.justifyContent=e.overlayY==="bottom"?"flex-end":"flex-start",o&&(r.maxHeight=Dt(o)),a&&(r.maxWidth=Dt(a))}this._lastBoundingBoxSize=i,Jo(this._boundingBox.style,r)}_resetBoundingBoxStyles(){Jo(this._boundingBox.style,{top:"0",left:"0",right:"0",bottom:"0",height:"",width:"",alignItems:"",justifyContent:""})}_resetOverlayElementStyles(){Jo(this._pane.style,{top:"",left:"",bottom:"",right:"",position:"",transform:""})}_setOverlayElementStyles(n,e){let i={},r=this._hasExactPosition(),o=this._hasFlexibleDimensions,a=this._overlayRef.getConfig();if(r){let u=this._viewportRuler.getViewportScrollPosition();Jo(i,this._getExactOverlayY(e,n,u)),Jo(i,this._getExactOverlayX(e,n,u))}else i.position="static";let s="",l=this._getOffset(e,"x"),d=this._getOffset(e,"y");l&&(s+=`translateX(${l}px) `),d&&(s+=`translateY(${d}px)`),i.transform=s.trim(),a.maxHeight&&(r?i.maxHeight=Dt(a.maxHeight):o&&(i.maxHeight="")),a.maxWidth&&(r?i.maxWidth=Dt(a.maxWidth):o&&(i.maxWidth="")),Jo(this._pane.style,i)}_getExactOverlayY(n,e,i){let r={top:"",bottom:""},o=this._getOverlayPoint(e,this._overlayRect,n);if(this._isPushed&&(o=this._pushOverlayOnScreen(o,this._overlayRect,i)),n.overlayY==="bottom"){let a=this._document.documentElement.clientHeight;r.bottom=`${a-(o.y+this._overlayRect.height)}px`}else r.top=Dt(o.y);return r}_getExactOverlayX(n,e,i){let r={left:"",right:""},o=this._getOverlayPoint(e,this._overlayRect,n);this._isPushed&&(o=this._pushOverlayOnScreen(o,this._overlayRect,i));let a;if(this._isRtl()?a=n.overlayX==="end"?"left":"right":a=n.overlayX==="end"?"right":"left",a==="right"){let s=this._document.documentElement.clientWidth;r.right=`${s-(o.x+this._overlayRect.width)}px`}else r.left=Dt(o.x);return r}_getScrollVisibility(){let n=this._getOriginRect(),e=this._pane.getBoundingClientRect(),i=this._scrollables.map(r=>r.getElementRef().nativeElement.getBoundingClientRect());return{isOriginClipped:gE(n,i),isOriginOutsideView:ib(n,i),isOverlayClipped:gE(e,i),isOverlayOutsideView:ib(e,i)}}_subtractOverflows(n,...e){return e.reduce((i,r)=>i-Math.max(r,0),n)}_getNarrowedViewportRect(){let n=this._document.documentElement.clientWidth,e=this._document.documentElement.clientHeight,i=this._viewportRuler.getViewportScrollPosition();return{top:i.top+this._getViewportMarginTop(),left:i.left+this._getViewportMarginStart(),right:i.left+n-this._getViewportMarginEnd(),bottom:i.top+e-this._getViewportMarginBottom(),width:n-this._getViewportMarginStart()-this._getViewportMarginEnd(),height:e-this._getViewportMarginTop()-this._getViewportMarginBottom()}}_isRtl(){return this._overlayRef.getDirection()==="rtl"}_hasExactPosition(){return!this._hasFlexibleDimensions||this._isPushed}_getOffset(n,e){return e==="x"?n.offsetX==null?this._offsetX:n.offsetX:n.offsetY==null?this._offsetY:n.offsetY}_validatePositions(){}_addPanelClasses(n){this._pane&&cs(n).forEach(e=>{e!==""&&this._appliedPanelClasses.indexOf(e)===-1&&(this._appliedPanelClasses.push(e),this._pane.classList.add(e))})}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(n=>{this._pane.classList.remove(n)}),this._appliedPanelClasses=[])}_getViewportMarginStart(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.start??0}_getViewportMarginEnd(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.end??0}_getViewportMarginTop(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.top??0}_getViewportMarginBottom(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.bottom??0}_getOriginRect(){let n=this._origin;if(n instanceof F)return n.nativeElement.getBoundingClientRect();if(n instanceof Element)return n.getBoundingClientRect();let e=n.width||0,i=n.height||0;return{top:n.y,bottom:n.y+i,left:n.x,right:n.x+e,height:i,width:e}}_getContainerRect(){let n=this._overlayRef.getConfig().usePopover&&this._popoverLocation!=="global",e=this._overlayContainer.getContainerElement();n&&(e.style.display="block");let i=e.getBoundingClientRect();return n&&(e.style.display=""),i}};function Jo(t,n){for(let e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);return t}function bE(t){if(typeof t!="number"&&t!=null){let[n,e]=t.split(OL);return!e||e==="px"?parseFloat(n):null}return t||null}function yE(t){return{top:Math.floor(t.top),right:Math.floor(t.right),bottom:Math.floor(t.bottom),left:Math.floor(t.left),width:Math.floor(t.width),height:Math.floor(t.height)}}function PL(t,n){return t===n?!0:t.isOriginClipped===n.isOriginClipped&&t.isOriginOutsideView===n.isOriginOutsideView&&t.isOverlayClipped===n.isOverlayClipped&&t.isOverlayOutsideView===n.isOverlayOutsideView}var CE="cdk-global-overlay-wrapper";function Rs(t){return new Of}var Of=class{_overlayRef;_cssPosition="static";_topOffset="";_bottomOffset="";_alignItems="";_xPosition="";_xOffset="";_width="";_height="";_isDisposed=!1;attach(n){let e=n.getConfig();this._overlayRef=n,this._width&&!e.width&&n.updateSize({width:this._width}),this._height&&!e.height&&n.updateSize({height:this._height}),n.hostElement.classList.add(CE),this._isDisposed=!1}top(n=""){return this._bottomOffset="",this._topOffset=n,this._alignItems="flex-start",this}left(n=""){return this._xOffset=n,this._xPosition="left",this}bottom(n=""){return this._topOffset="",this._bottomOffset=n,this._alignItems="flex-end",this}right(n=""){return this._xOffset=n,this._xPosition="right",this}start(n=""){return this._xOffset=n,this._xPosition="start",this}end(n=""){return this._xOffset=n,this._xPosition="end",this}width(n=""){return this._overlayRef?this._overlayRef.updateSize({width:n}):this._width=n,this}height(n=""){return this._overlayRef?this._overlayRef.updateSize({height:n}):this._height=n,this}centerHorizontally(n=""){return this.left(n),this._xPosition="center",this}centerVertically(n=""){return this.top(n),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let n=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement.style,i=this._overlayRef.getConfig(),{width:r,height:o,maxWidth:a,maxHeight:s}=i,l=(r==="100%"||r==="100vw")&&(!a||a==="100%"||a==="100vw"),d=(o==="100%"||o==="100vh")&&(!s||s==="100%"||s==="100vh"),u=this._xPosition,h=this._xOffset,_=this._overlayRef.getConfig().direction==="rtl",v="",x="",A="";l?A="flex-start":u==="center"?(A="center",_?x=h:v=h):_?u==="left"||u==="end"?(A="flex-end",v=h):(u==="right"||u==="start")&&(A="flex-start",x=h):u==="left"||u==="start"?(A="flex-start",v=h):(u==="right"||u==="end")&&(A="flex-end",x=h),n.position=this._cssPosition,n.marginLeft=l?"0":v,n.marginTop=d?"0":this._topOffset,n.marginBottom=this._bottomOffset,n.marginRight=l?"0":x,e.justifyContent=A,e.alignItems=d?"flex-start":this._alignItems}dispose(){if(this._isDisposed||!this._overlayRef)return;let n=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement,i=e.style;e.classList.remove(CE),i.justifyContent=i.alignItems=n.marginTop=n.marginBottom=n.marginLeft=n.marginRight=n.position="",this._overlayRef=null,this._isDisposed=!0}},NE=(()=>{class t{_injector=c(X);global(){return Rs()}flexibleConnectedTo(e){return ea(this._injector,e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),Qc=new C("OVERLAY_DEFAULT_CONFIG");function ar(t,n){t.get(Je).load(ME);let e=t.get(Pf),i=t.get(K),r=t.get(Ue),o=t.get(nn),a=t.get(wt),s=t.get(Se,null,{optional:!0})||t.get(Mt).createRenderer(null,null),l=new rr(n),d=t.get(Qc,null,{optional:!0})?.usePopover??!0;l.direction=l.direction||a.value,!i.body||!("showPopover"in i.body)?l.usePopover=!1:l.usePopover=n?.usePopover??d;let u=i.createElement("div"),h=i.createElement("div");u.id=r.getId("cdk-overlay-"),u.classList.add("cdk-overlay-pane"),h.appendChild(u),l.usePopover&&(h.setAttribute("popover","manual"),h.classList.add("cdk-overlay-popover"));let _=l.usePopover?l.positionStrategy?.getPopoverInsertionPoint?.():null;return ob(_)?_.after(h):_?.type==="parent"?_.element.appendChild(h):e.getContainerElement().appendChild(h),new Ts(new Is(u,o,t),h,u,l,t.get(U),t.get(DE),i,t.get(kr),t.get(EE),n?.disableAnimations??t.get(xl,null,{optional:!0})==="NoopAnimations",t.get(We),s)}var IE=(()=>{class t{scrollStrategies=c(SE);_positionBuilder=c(NE);_injector=c(X);create(e){return ar(this._injector,e)}position(){return this._positionBuilder}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})(),FL=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"}],LL=new C("cdk-connected-overlay-scroll-strategy",{providedIn:"root",factory:()=>{let t=c(X);return()=>or(t)}}),ks=(()=>{class t{elementRef=c(F);static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdk-overlay-origin",""],["","overlay-origin",""],["","cdkOverlayOrigin",""]],exportAs:["cdkOverlayOrigin"]})}return t})(),TE=new C("cdk-connected-overlay-default-config"),Ff=(()=>{class t{_dir=c(wt,{optional:!0});_injector=c(X);_overlayRef;_templatePortal;_backdropSubscription=ce.EMPTY;_attachSubscription=ce.EMPTY;_detachSubscription=ce.EMPTY;_positionSubscription=ce.EMPTY;_offsetX;_offsetY;_position;_scrollStrategyFactory=c(LL);_ngZone=c(U);origin;positions;positionStrategy;get offsetX(){return this._offsetX}set offsetX(e){this._offsetX=e,this._position&&this._updatePositionStrategy(this._position)}get offsetY(){return this._offsetY}set offsetY(e){this._offsetY=e,this._position&&this._updatePositionStrategy(this._position)}width;height;minWidth;minHeight;backdropClass;panelClass;viewportMargin=0;scrollStrategy;open=!1;disableClose=!1;transformOriginSelector;hasBackdrop=!1;lockPosition=!1;flexibleDimensions=!1;growAfterOpen=!1;push=!1;disposeOnNavigation=!1;usePopover;matchWidth=!1;set _config(e){typeof e!="string"&&this._assignConfig(e)}backdropClick=new O;positionChange=new O;attach=new O;detach=new O;overlayKeydown=new O;overlayOutsideClick=new O;constructor(){let e=c(bt),i=c(ht),r=c(TE,{optional:!0}),o=c(Qc,{optional:!0});this.usePopover=o?.usePopover===!1?null:"global",this._templatePortal=new cn(e,i),this.scrollStrategy=this._scrollStrategyFactory(),r&&this._assignConfig(r)}get overlayRef(){return this._overlayRef}get dir(){return this._dir?this._dir.value:"ltr"}ngOnDestroy(){this._attachSubscription.unsubscribe(),this._detachSubscription.unsubscribe(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this._overlayRef?.dispose()}ngOnChanges(e){this._position&&(this._updatePositionStrategy(this._position),this._overlayRef?.updateSize({width:this._getWidth(),minWidth:this.minWidth,height:this.height,minHeight:this.minHeight}),e.origin&&this.open&&this._position.apply()),e.open&&(this.open?this.attachOverlay():this.detachOverlay())}_createOverlay(){(!this.positions||!this.positions.length)&&(this.positions=FL);let e=this._overlayRef=ar(this._injector,this._buildConfig());this._attachSubscription=e.attachments().subscribe(()=>this.attach.emit()),this._detachSubscription=e.detachments().subscribe(()=>this.detach.emit()),e.keydownEvents().subscribe(i=>{this.overlayKeydown.next(i),i.keyCode===27&&!this.disableClose&&!ut(i)&&(i.preventDefault(),this.detachOverlay())}),this._overlayRef.outsidePointerEvents().subscribe(i=>{let r=this._getOriginElement(),o=zt(i);(!r||r!==o&&!r.contains(o))&&this.overlayOutsideClick.next(i)})}_buildConfig(){let e=this._position=this.positionStrategy||this._createPositionStrategy(),i=new rr({direction:this._dir||"ltr",positionStrategy:e,scrollStrategy:this.scrollStrategy,hasBackdrop:this.hasBackdrop,disposeOnNavigation:this.disposeOnNavigation,usePopover:!!this.usePopover});return(this.height||this.height===0)&&(i.height=this.height),(this.minWidth||this.minWidth===0)&&(i.minWidth=this.minWidth),(this.minHeight||this.minHeight===0)&&(i.minHeight=this.minHeight),this.backdropClass&&(i.backdropClass=this.backdropClass),this.panelClass&&(i.panelClass=this.panelClass),i}_updatePositionStrategy(e){let i=this.positions.map(r=>({originX:r.originX,originY:r.originY,overlayX:r.overlayX,overlayY:r.overlayY,offsetX:r.offsetX||this.offsetX,offsetY:r.offsetY||this.offsetY,panelClass:r.panelClass||void 0}));return e.setOrigin(this._getOrigin()).withPositions(i).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector).withPopoverLocation(this.usePopover===null?"global":this.usePopover)}_createPositionStrategy(){let e=ea(this._injector,this._getOrigin());return this._updatePositionStrategy(e),e}_getOrigin(){return this.origin instanceof ks?this.origin.elementRef:this.origin}_getOriginElement(){return this.origin instanceof ks?this.origin.elementRef.nativeElement:this.origin instanceof F?this.origin.nativeElement:typeof Element<"u"&&this.origin instanceof Element?this.origin:null}_getWidth(){return this.width?this.width:this.matchWidth?this._getOriginElement()?.getBoundingClientRect?.().width:void 0}attachOverlay(){this._overlayRef||this._createOverlay();let e=this._overlayRef;e.getConfig().hasBackdrop=this.hasBackdrop,e.updateSize({width:this._getWidth()}),e.hasAttached()||e.attach(this._templatePortal),this.hasBackdrop?this._backdropSubscription=e.backdropClick().subscribe(i=>this.backdropClick.emit(i)):this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.positionChange.observers.length>0&&(this._positionSubscription=this._position.positionChanges.pipe(zh(()=>this.positionChange.observers.length>0)).subscribe(i=>{this._ngZone.run(()=>this.positionChange.emit(i)),this.positionChange.observers.length===0&&this._positionSubscription.unsubscribe()})),this.open=!0}detachOverlay(){this._overlayRef?.detach(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.open=!1}_assignConfig(e){this.origin=e.origin??this.origin,this.positions=e.positions??this.positions,this.positionStrategy=e.positionStrategy??this.positionStrategy,this.offsetX=e.offsetX??this.offsetX,this.offsetY=e.offsetY??this.offsetY,this.width=e.width??this.width,this.height=e.height??this.height,this.minWidth=e.minWidth??this.minWidth,this.minHeight=e.minHeight??this.minHeight,this.backdropClass=e.backdropClass??this.backdropClass,this.panelClass=e.panelClass??this.panelClass,this.viewportMargin=e.viewportMargin??this.viewportMargin,this.scrollStrategy=e.scrollStrategy??this.scrollStrategy,this.disableClose=e.disableClose??this.disableClose,this.transformOriginSelector=e.transformOriginSelector??this.transformOriginSelector,this.hasBackdrop=e.hasBackdrop??this.hasBackdrop,this.lockPosition=e.lockPosition??this.lockPosition,this.flexibleDimensions=e.flexibleDimensions??this.flexibleDimensions,this.growAfterOpen=e.growAfterOpen??this.growAfterOpen,this.push=e.push??this.push,this.disposeOnNavigation=e.disposeOnNavigation??this.disposeOnNavigation,this.usePopover=e.usePopover??this.usePopover,this.matchWidth=e.matchWidth??this.matchWidth}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdk-connected-overlay",""],["","connected-overlay",""],["","cdkConnectedOverlay",""]],inputs:{origin:[0,"cdkConnectedOverlayOrigin","origin"],positions:[0,"cdkConnectedOverlayPositions","positions"],positionStrategy:[0,"cdkConnectedOverlayPositionStrategy","positionStrategy"],offsetX:[0,"cdkConnectedOverlayOffsetX","offsetX"],offsetY:[0,"cdkConnectedOverlayOffsetY","offsetY"],width:[0,"cdkConnectedOverlayWidth","width"],height:[0,"cdkConnectedOverlayHeight","height"],minWidth:[0,"cdkConnectedOverlayMinWidth","minWidth"],minHeight:[0,"cdkConnectedOverlayMinHeight","minHeight"],backdropClass:[0,"cdkConnectedOverlayBackdropClass","backdropClass"],panelClass:[0,"cdkConnectedOverlayPanelClass","panelClass"],viewportMargin:[0,"cdkConnectedOverlayViewportMargin","viewportMargin"],scrollStrategy:[0,"cdkConnectedOverlayScrollStrategy","scrollStrategy"],open:[0,"cdkConnectedOverlayOpen","open"],disableClose:[0,"cdkConnectedOverlayDisableClose","disableClose"],transformOriginSelector:[0,"cdkConnectedOverlayTransformOriginOn","transformOriginSelector"],hasBackdrop:[2,"cdkConnectedOverlayHasBackdrop","hasBackdrop",G],lockPosition:[2,"cdkConnectedOverlayLockPosition","lockPosition",G],flexibleDimensions:[2,"cdkConnectedOverlayFlexibleDimensions","flexibleDimensions",G],growAfterOpen:[2,"cdkConnectedOverlayGrowAfterOpen","growAfterOpen",G],push:[2,"cdkConnectedOverlayPush","push",G],disposeOnNavigation:[2,"cdkConnectedOverlayDisposeOnNavigation","disposeOnNavigation",G],usePopover:[0,"cdkConnectedOverlayUsePopover","usePopover"],matchWidth:[2,"cdkConnectedOverlayMatchWidth","matchWidth",G],_config:[0,"cdkConnectedOverlay","_config"]},outputs:{backdropClick:"backdropClick",positionChange:"positionChange",attach:"attach",detach:"detach",overlayKeydown:"overlayKeydown",overlayOutsideClick:"overlayOutsideClick"},exportAs:["cdkConnectedOverlay"],features:[Ae]})}return t})(),ci=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({providers:[IE],imports:[ge,ir,jv,jv]})}return t})();var jL=["tooltip"],VL=20;var BL=new C("mat-tooltip-scroll-strategy",{providedIn:"root",factory:()=>{let t=c(X);return()=>or(t,{scrollThrottle:VL})}}),HL=new C("mat-tooltip-default-options",{providedIn:"root",factory:()=>({showDelay:0,hideDelay:0,touchendHideDelay:1500})});var kE="tooltip-panel",UL={passive:!0},zL=8,$L=8,WL=24,GL=200,sr=(()=>{class t{_elementRef=c(F);_ngZone=c(U);_platform=c(ye);_ariaDescriber=c(lD);_focusMonitor=c(Bt);_dir=c(wt);_injector=c(X);_viewContainerRef=c(ht);_mediaMatcher=c(ds);_document=c(K);_renderer=c(Se);_animationsDisabled=Te();_defaultOptions=c(HL,{optional:!0});_overlayRef=null;_tooltipInstance=null;_overlayPanelClass;_portal;_position="below";_positionAtOrigin=!1;_disabled=!1;_tooltipClass;_viewInitialized=!1;_pointerExitEventsInitialized=!1;_tooltipComponent=AE;_viewportMargin=8;_currentPosition;_cssClassPrefix="mat-mdc";_ariaDescriptionPending=!1;_dirSubscribed=!1;get position(){return this._position}set position(e){e!==this._position&&(this._position=e,this._overlayRef&&(this._updatePosition(this._overlayRef),this._tooltipInstance?.show(0),this._overlayRef.updatePosition()))}get positionAtOrigin(){return this._positionAtOrigin}set positionAtOrigin(e){this._positionAtOrigin=lt(e),this._detach(),this._overlayRef=null}get disabled(){return this._disabled}set disabled(e){let i=lt(e);this._disabled!==i&&(this._disabled=i,i?this.hide(0):this._setupPointerEnterEventsIfNeeded(),this._syncAriaDescription(this.message))}get showDelay(){return this._showDelay}set showDelay(e){this._showDelay=Vt(e)}_showDelay;get hideDelay(){return this._hideDelay}set hideDelay(e){this._hideDelay=Vt(e),this._tooltipInstance&&(this._tooltipInstance._mouseLeaveHideDelay=this._hideDelay)}_hideDelay;touchGestures="auto";get message(){return this._message}set message(e){let i=this._message;this._message=e!=null?String(e).trim():"",!this._message&&this._isTooltipVisible()?this.hide(0):(this._setupPointerEnterEventsIfNeeded(),this._updateTooltipMessage()),this._syncAriaDescription(i)}_message="";get tooltipClass(){return this._tooltipClass}set tooltipClass(e){this._tooltipClass=e,this._tooltipInstance&&this._setTooltipClass(this._tooltipClass)}_eventCleanups=[];_touchstartTimeout=null;_destroyed=new I;_isDestroyed=!1;constructor(){let e=this._defaultOptions;e&&(this._showDelay=e.showDelay,this._hideDelay=e.hideDelay,e.position&&(this.position=e.position),e.positionAtOrigin&&(this.positionAtOrigin=e.positionAtOrigin),e.touchGestures&&(this.touchGestures=e.touchGestures),e.tooltipClass&&(this.tooltipClass=e.tooltipClass)),this._viewportMargin=zL}ngAfterViewInit(){this._viewInitialized=!0,this._setupPointerEnterEventsIfNeeded(),this._focusMonitor.monitor(this._elementRef).pipe(he(this._destroyed)).subscribe(e=>{e?e==="keyboard"&&this._ngZone.run(()=>this.show()):this._ngZone.run(()=>this.hide(0))})}ngOnDestroy(){let e=this._elementRef.nativeElement;this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this._overlayRef&&(this._overlayRef.dispose(),this._tooltipInstance=null),this._eventCleanups.forEach(i=>i()),this._eventCleanups.length=0,this._destroyed.next(),this._destroyed.complete(),this._isDestroyed=!0,this._ariaDescriber.removeDescription(e,this.message,"tooltip"),this._focusMonitor.stopMonitoring(e)}show(e=this.showDelay,i){if(this.disabled||!this.message||this._isTooltipVisible()){this._tooltipInstance?._cancelPendingAnimations();return}let r=this._createOverlay(i);this._detach(),this._portal=this._portal||new zr(this._tooltipComponent,this._viewContainerRef);let o=this._tooltipInstance=r.attach(this._portal).instance;o._triggerElement=this._elementRef.nativeElement,o._mouseLeaveHideDelay=this._hideDelay,o.afterHidden().pipe(he(this._destroyed)).subscribe(()=>this._detach()),this._setTooltipClass(this._tooltipClass),this._updateTooltipMessage(),o.show(e)}hide(e=this.hideDelay){let i=this._tooltipInstance;i&&(i.isVisible()?i.hide(e):(i._cancelPendingAnimations(),this._detach()))}toggle(e){this._isTooltipVisible()?this.hide():this.show(void 0,e)}_isTooltipVisible(){return!!this._tooltipInstance&&this._tooltipInstance.isVisible()}_createOverlay(e){if(this._overlayRef){let a=this._overlayRef.getConfig().positionStrategy;if((!this.positionAtOrigin||!e)&&a._origin instanceof F)return this._overlayRef;this._detach()}let i=this._injector.get(jr).getAncestorScrollContainers(this._elementRef),r=`${this._cssClassPrefix}-${kE}`,o=ea(this._injector,this.positionAtOrigin?e||this._elementRef:this._elementRef).withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`).withFlexibleDimensions(!1).withViewportMargin(this._viewportMargin).withScrollableContainers(i).withPopoverLocation("global");return o.positionChanges.pipe(he(this._destroyed)).subscribe(a=>{this._updateCurrentPositionClass(a.connectionPair),this._tooltipInstance&&a.scrollableViewProperties.isOverlayClipped&&this._tooltipInstance.isVisible()&&this._ngZone.run(()=>this.hide(0))}),this._overlayRef=ar(this._injector,{direction:this._dir,positionStrategy:o,panelClass:this._overlayPanelClass?[...this._overlayPanelClass,r]:r,scrollStrategy:this._injector.get(BL)(),disableAnimations:this._animationsDisabled,eventPredicate:this._overlayEventPredicate}),this._updatePosition(this._overlayRef),this._overlayRef.detachments().pipe(he(this._destroyed)).subscribe(()=>this._detach()),this._overlayRef.outsidePointerEvents().pipe(he(this._destroyed)).subscribe(()=>this._tooltipInstance?._handleBodyInteraction()),this._overlayRef.keydownEvents().pipe(he(this._destroyed)).subscribe(a=>{a.preventDefault(),a.stopPropagation(),this._ngZone.run(()=>this.hide(0))}),this._defaultOptions?.disableTooltipInteractivity&&this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`),this._dirSubscribed||(this._dirSubscribed=!0,this._dir.change.pipe(he(this._destroyed)).subscribe(()=>{this._overlayRef&&this._updatePosition(this._overlayRef)})),this._overlayRef}_detach(){this._overlayRef&&this._overlayRef.hasAttached()&&this._overlayRef.detach(),this._tooltipInstance=null}_updatePosition(e){let i=e.getConfig().positionStrategy,r=this._getOrigin(),o=this._getOverlayPosition();i.withPositions([this._addOffset(b(b({},r.main),o.main)),this._addOffset(b(b({},r.fallback),o.fallback))])}_addOffset(e){let i=$L,r=!this._dir||this._dir.value=="ltr";return e.originY==="top"?e.offsetY=-i:e.originY==="bottom"?e.offsetY=i:e.originX==="start"?e.offsetX=r?-i:i:e.originX==="end"&&(e.offsetX=r?i:-i),e}_getOrigin(){let e=!this._dir||this._dir.value=="ltr",i=this.position,r;i=="above"||i=="below"?r={originX:"center",originY:i=="above"?"top":"bottom"}:i=="before"||i=="left"&&e||i=="right"&&!e?r={originX:"start",originY:"center"}:(i=="after"||i=="right"&&e||i=="left"&&!e)&&(r={originX:"end",originY:"center"});let{x:o,y:a}=this._invertPosition(r.originX,r.originY);return{main:r,fallback:{originX:o,originY:a}}}_getOverlayPosition(){let e=!this._dir||this._dir.value=="ltr",i=this.position,r;i=="above"?r={overlayX:"center",overlayY:"bottom"}:i=="below"?r={overlayX:"center",overlayY:"top"}:i=="before"||i=="left"&&e||i=="right"&&!e?r={overlayX:"end",overlayY:"center"}:(i=="after"||i=="right"&&e||i=="left"&&!e)&&(r={overlayX:"start",overlayY:"center"});let{x:o,y:a}=this._invertPosition(r.overlayX,r.overlayY);return{main:r,fallback:{overlayX:o,overlayY:a}}}_updateTooltipMessage(){this._tooltipInstance&&(this._tooltipInstance.message=this.message,this._tooltipInstance._markForCheck(),tt(()=>{this._tooltipInstance&&this._overlayRef.updatePosition()},{injector:this._injector}))}_setTooltipClass(e){this._tooltipInstance&&(this._tooltipInstance.tooltipClass=e instanceof Set?Array.from(e):e,this._tooltipInstance._markForCheck())}_invertPosition(e,i){return this.position==="above"||this.position==="below"?i==="top"?i="bottom":i==="bottom"&&(i="top"):e==="end"?e="start":e==="start"&&(e="end"),{x:e,y:i}}_updateCurrentPositionClass(e){let{overlayY:i,originX:r,originY:o}=e,a;if(i==="center"?this._dir&&this._dir.value==="rtl"?a=r==="end"?"left":"right":a=r==="start"?"left":"right":a=i==="bottom"&&o==="top"?"above":"below",a!==this._currentPosition){let s=this._overlayRef;if(s){let l=`${this._cssClassPrefix}-${kE}-`;s.removePanelClass(l+this._currentPosition),s.addPanelClass(l+a)}this._currentPosition=a}}_setupPointerEnterEventsIfNeeded(){this._disabled||!this.message||!this._viewInitialized||this._eventCleanups.length||(this._isTouchPlatform()?this.touchGestures!=="off"&&(this._disableNativeGesturesIfNecessary(),this._addListener("touchstart",e=>{let i=e.targetTouches?.[0],r=i?{x:i.clientX,y:i.clientY}:void 0;this._setupPointerExitEventsIfNeeded(),this._touchstartTimeout&&clearTimeout(this._touchstartTimeout);let o=500;this._touchstartTimeout=setTimeout(()=>{this._touchstartTimeout=null,this.show(void 0,r)},this._defaultOptions?.touchLongPressShowDelay??o)})):this._addListener("mouseenter",e=>{this._setupPointerExitEventsIfNeeded();let i;e.x!==void 0&&e.y!==void 0&&(i=e),this.show(void 0,i)}))}_setupPointerExitEventsIfNeeded(){if(!this._pointerExitEventsInitialized){if(this._pointerExitEventsInitialized=!0,!this._isTouchPlatform())this._addListener("mouseleave",e=>{let i=e.relatedTarget;(!i||!this._overlayRef?.overlayElement.contains(i))&&this.hide()}),this._addListener("wheel",e=>{if(this._isTooltipVisible()){let i=this._document.elementFromPoint(e.clientX,e.clientY),r=this._elementRef.nativeElement;i!==r&&!r.contains(i)&&this.hide()}});else if(this.touchGestures!=="off"){this._disableNativeGesturesIfNecessary();let e=()=>{this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this.hide(this._defaultOptions?.touchendHideDelay)};this._addListener("touchend",e),this._addListener("touchcancel",e)}}}_addListener(e,i){this._eventCleanups.push(this._renderer.listen(this._elementRef.nativeElement,e,i,UL))}_isTouchPlatform(){let e=this._defaultOptions?.detectHoverCapability;return typeof e=="function"?!e():this._platform.IOS||this._platform.ANDROID?!0:this._platform.isBrowser?!!e&&this._mediaMatcher.matchMedia("(any-hover: none)").matches:!1}_disableNativeGesturesIfNecessary(){let e=this.touchGestures;if(e!=="off"){let i=this._elementRef.nativeElement,r=i.style;(e==="on"||i.nodeName!=="INPUT"&&i.nodeName!=="TEXTAREA")&&(r.userSelect=r.msUserSelect=r.webkitUserSelect=r.MozUserSelect="none"),(e==="on"||!i.draggable)&&(r.webkitUserDrag="none"),r.touchAction="none",r.webkitTapHighlightColor="transparent"}}_syncAriaDescription(e){this._ariaDescriptionPending||(this._ariaDescriptionPending=!0,this._ariaDescriber.removeDescription(this._elementRef.nativeElement,e,"tooltip"),this._isDestroyed||tt({write:()=>{this._ariaDescriptionPending=!1,this.message&&!this.disabled&&this._ariaDescriber.describe(this._elementRef.nativeElement,this.message,"tooltip")}},{injector:this._injector}))}_overlayEventPredicate=e=>e.type==="keydown"?this._isTooltipVisible()&&e.keyCode===27&&!ut(e):!0;static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","matTooltip",""]],hostAttrs:[1,"mat-mdc-tooltip-trigger"],hostVars:2,hostBindings:function(i,r){i&2&&T("mat-mdc-tooltip-disabled",r.disabled)},inputs:{position:[0,"matTooltipPosition","position"],positionAtOrigin:[0,"matTooltipPositionAtOrigin","positionAtOrigin"],disabled:[0,"matTooltipDisabled","disabled"],showDelay:[0,"matTooltipShowDelay","showDelay"],hideDelay:[0,"matTooltipHideDelay","hideDelay"],touchGestures:[0,"matTooltipTouchGestures","touchGestures"],message:[0,"matTooltip","message"],tooltipClass:[0,"matTooltipClass","tooltipClass"]},exportAs:["matTooltip"]})}return t})(),AE=(()=>{class t{_changeDetectorRef=c(Me);_elementRef=c(F);_isMultiline=!1;message;tooltipClass;_showTimeoutId;_hideTimeoutId;_triggerElement;_mouseLeaveHideDelay;_animationsDisabled=Te();_tooltip;_closeOnInteraction=!1;_isVisible=!1;_onHide=new I;_showAnimation="mat-mdc-tooltip-show";_hideAnimation="mat-mdc-tooltip-hide";show(e){this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=setTimeout(()=>{this._toggleVisibility(!0),this._showTimeoutId=void 0},e)}hide(e){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId=setTimeout(()=>{this._toggleVisibility(!1),this._hideTimeoutId=void 0},e)}afterHidden(){return this._onHide}isVisible(){return this._isVisible}ngOnDestroy(){this._cancelPendingAnimations(),this._onHide.complete(),this._triggerElement=null}_handleBodyInteraction(){this._closeOnInteraction&&this.hide(0)}_markForCheck(){this._changeDetectorRef.markForCheck()}_handleMouseLeave({relatedTarget:e}){(!e||!this._triggerElement.contains(e))&&(this.isVisible()?this.hide(this._mouseLeaveHideDelay):this._finalizeAnimation(!1))}_onShow(){this._isMultiline=this._isTooltipMultiline(),this._markForCheck()}_isTooltipMultiline(){let e=this._elementRef.nativeElement.getBoundingClientRect();return e.height>WL&&e.width>=GL}_handleAnimationEnd({animationName:e}){(e===this._showAnimation||e===this._hideAnimation)&&this._finalizeAnimation(e===this._showAnimation)}_cancelPendingAnimations(){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=this._hideTimeoutId=void 0}_finalizeAnimation(e){e?this._closeOnInteraction=!0:this.isVisible()||this._onHide.next()}_toggleVisibility(e){let i=this._tooltip.nativeElement,r=this._showAnimation,o=this._hideAnimation;if(i.classList.remove(e?o:r),i.classList.add(e?r:o),this._isVisible!==e&&(this._isVisible=e,this._changeDetectorRef.markForCheck()),e&&!this._animationsDisabled&&typeof getComputedStyle=="function"){let a=getComputedStyle(i);(a.getPropertyValue("animation-duration")==="0s"||a.getPropertyValue("animation-name")==="none")&&(this._animationsDisabled=!0)}e&&this._onShow(),this._animationsDisabled&&(i.classList.add("_mat-animation-noopable"),this._finalizeAnimation(e))}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-tooltip-component"]],viewQuery:function(i,r){if(i&1&&Re(jL,7),i&2){let o;z(o=$())&&(r._tooltip=o.first)}},hostAttrs:["aria-hidden","true"],hostBindings:function(i,r){i&1&&w("mouseleave",function(a){return r._handleMouseLeave(a)})},decls:4,vars:5,consts:[["tooltip",""],[1,"mdc-tooltip","mat-mdc-tooltip",3,"animationend"],[1,"mat-mdc-tooltip-surface","mdc-tooltip__surface"]],template:function(i,r){i&1&&(je(0,"div",1,0),Ha("animationend",function(a){return r._handleAnimationEnd(a)}),je(2,"div",2),g(3),Ze()()),i&2&&(Ke(r.tooltipClass),T("mdc-tooltip--multiline",r._isMultiline),p(3),k(r.message))},styles:[`.mat-mdc-tooltip {
  position: relative;
  transform: scale(0);
  display: inline-flex;
}
.mat-mdc-tooltip::before {
  content: "";
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  position: absolute;
}
.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before {
  top: -8px;
}
.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before {
  bottom: -8px;
}
.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before {
  left: -8px;
}
.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before {
  right: -8px;
}
.mat-mdc-tooltip._mat-animation-noopable {
  animation: none;
  transform: scale(1);
}

.mat-mdc-tooltip-surface {
  word-break: normal;
  overflow-wrap: anywhere;
  padding: 4px 8px;
  min-width: 40px;
  max-width: 200px;
  min-height: 24px;
  max-height: 40vh;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  will-change: transform, opacity;
  background-color: var(--%NS%mat-tooltip-container-color, var(--%NS%mat-sys-inverse-surface));
  color: var(--%NS%mat-tooltip-supporting-text-color, var(--%NS%mat-sys-inverse-on-surface));
  border-radius: var(--%NS%mat-tooltip-container-shape, var(--%NS%mat-sys-corner-extra-small));
  font-family: var(--%NS%mat-tooltip-supporting-text-font, var(--%NS%mat-sys-body-small-font));
  font-size: var(--%NS%mat-tooltip-supporting-text-size, var(--%NS%mat-sys-body-small-size));
  font-weight: var(--%NS%mat-tooltip-supporting-text-weight, var(--%NS%mat-sys-body-small-weight));
  line-height: var(--%NS%mat-tooltip-supporting-text-line-height, var(--%NS%mat-sys-body-small-line-height));
  letter-spacing: var(--%NS%mat-tooltip-supporting-text-tracking, var(--%NS%mat-sys-body-small-tracking));
}
.mat-mdc-tooltip-surface::before {
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
.mdc-tooltip--multiline .mat-mdc-tooltip-surface {
  text-align: left;
}
[dir=rtl] .mdc-tooltip--multiline .mat-mdc-tooltip-surface {
  text-align: right;
}

.mat-mdc-tooltip-panel {
  line-height: normal;
}
.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive {
  pointer-events: none;
}

@keyframes mat-mdc-tooltip-show {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes mat-mdc-tooltip-hide {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
.mat-mdc-tooltip-show {
  animation: mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards;
}

.mat-mdc-tooltip-hide {
  animation: mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards;
}
`],encapsulation:2})}return t})();var $r=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[Dc,ci,ge,Vn]})}return t})();function qL(t,n){}var Wr=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;positionStrategy;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;scrollStrategy;closeOnNavigation=!0;closeOnDestroy=!0;closeOnOverlayDetachments=!0;disableAnimations=!1;providers;container;templateContext;bindings};var sb=(()=>{class t extends Ns{_elementRef=c(F);_focusTrapFactory=c(xc);_config;_interactivityChecker=c(gs);_ngZone=c(U);_focusMonitor=c(Bt);_renderer=c(Se);_changeDetectorRef=c(Me);_injector=c(X);_platform=c(ye);_document=c(K);_portalOutlet;_focusTrapped=new I;_focusTrap=null;_elementFocusedBeforeDialogWasOpened=null;_closeInteractionType=null;_ariaLabelledByQueue=[];_isDestroyed=!1;constructor(){super(),this._config=c(Wr,{optional:!0})||new Wr,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(e){this._ariaLabelledByQueue.push(e),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(e){let i=this._ariaLabelledByQueue.indexOf(e);i>-1&&(this._ariaLabelledByQueue.splice(i,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._focusTrapped.complete(),this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(e){this._portalOutlet.hasAttached();let i=this._portalOutlet.attachComponentPortal(e);return this._contentAttached(),i}attachTemplatePortal(e){this._portalOutlet.hasAttached();let i=this._portalOutlet.attachTemplatePortal(e);return this._contentAttached(),i}attachDomPortal=e=>{this._portalOutlet.hasAttached();let i=this._portalOutlet.attachDomPortal(e);return this._contentAttached(),i};_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(e,i){this._interactivityChecker.isFocusable(e)||(e.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let r=()=>{o(),a(),e.removeAttribute("tabindex")},o=this._renderer.listen(e,"blur",r),a=this._renderer.listen(e,"mousedown",r)})),e.focus(i)}_focusByCssSelector(e,i){let r=this._elementRef.nativeElement.querySelector(e);r&&this._forceFocus(r,i)}_trapFocus(e){this._isDestroyed||tt(()=>{let i=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case"dialog":this._containsFocus()||i.focus(e);break;case!0:case"first-tabbable":this._focusTrap?.focusInitialElement(e)||this._focusDialogContainer(e);break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]',e);break;default:this._focusByCssSelector(this._config.autoFocus,e);break}this._focusTrapped.next()},{injector:this._injector})}_restoreFocus(){let e=this._config.restoreFocus,i=null;if(typeof e=="string"?i=this._document.querySelector(e):typeof e=="boolean"?i=e?this._elementFocusedBeforeDialogWasOpened:null:e&&(i=e),this._config.restoreFocus&&i&&typeof i.focus=="function"){let r=ms(),o=this._elementRef.nativeElement;(!r||r===this._document.body||r===o||o.contains(r))&&(this._focusMonitor?(this._focusMonitor.focusVia(i,this._closeInteractionType),this._closeInteractionType=null):i.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(e){this._elementRef.nativeElement.focus?.(e)}_containsFocus(){let e=this._elementRef.nativeElement,i=ms();return e===i||e.contains(i)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=ms()))}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["cdk-dialog-container"]],viewQuery:function(i,r){if(i&1&&Re(Ti,7),i&2){let o;z(o=$())&&(r._portalOutlet=o.first)}},hostAttrs:["tabindex","-1",1,"cdk-dialog-container"],hostVars:6,hostBindings:function(i,r){i&2&&L("id",r._config.id||null)("role",r._config.role)("aria-modal",r._config.ariaModal)("aria-labelledby",r._config.ariaLabel?null:r._ariaLabelledByQueue[0])("aria-label",r._config.ariaLabel)("aria-describedby",r._config.ariaDescribedBy||null)},features:[pe],decls:1,vars:0,consts:[["cdkPortalOutlet",""]],template:function(i,r){i&1&&yt(0,qL,0,0,"ng-template",0)},dependencies:[Ti],styles:[`.cdk-dialog-container {
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
`],encapsulation:2,changeDetection:1})}return t})(),ta=class{overlayRef;config;componentInstance=null;componentRef=null;containerInstance;disableClose;closed=new I;backdropClick;keydownEvents;outsidePointerEvents;id;_detachSubscription;constructor(n,e){this.overlayRef=n,this.config=e,this.disableClose=e.disableClose,this.backdropClick=n.backdropClick(),this.keydownEvents=n.keydownEvents(),this.outsidePointerEvents=n.outsidePointerEvents(),this.id=e.id,this.keydownEvents.subscribe(i=>{i.keyCode===27&&!this.disableClose&&!ut(i)&&(i.preventDefault(),this.close(void 0,{focusOrigin:"keyboard"}))}),this.backdropClick.subscribe(()=>{!this.disableClose&&this._canClose()?this.close(void 0,{focusOrigin:"mouse"}):this.containerInstance._recaptureFocus?.()}),this._detachSubscription=n.detachments().subscribe(()=>{e.closeOnOverlayDetachments!==!1&&this.close()})}close(n,e){if(this._canClose(n)){let i=this.closed;this.containerInstance._closeInteractionType=e?.focusOrigin||"program",this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),i.next(n),i.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(n="",e=""){return this.overlayRef.updateSize({width:n,height:e}),this}addPanelClass(n){return this.overlayRef.addPanelClass(n),this}removePanelClass(n){return this.overlayRef.removePanelClass(n),this}_canClose(n){let e=this.config;return!!this.containerInstance&&(!e.closePredicate||e.closePredicate(n,e,this.componentInstance))}},YL=new C("DialogScrollStrategy",{providedIn:"root",factory:()=>{let t=c(X);return()=>As(t)}}),ZL=new C("DialogData"),QL=new C("DefaultDialogConfig");function XL(t){let n=S(t),e=new O;return{valueSignal:n,get value(){return n()},change:e,ngOnDestroy(){e.complete()}}}var lb=(()=>{class t{_injector=c(X);_defaultOptions=c(QL,{optional:!0});_parentDialog=c(t,{optional:!0,skipSelf:!0});_overlayContainer=c(Pf);_idGenerator=c(Ue);_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new I;_afterOpenedAtThisLevel=new I;_ariaHiddenElements=new Map;_scrollStrategy=c(YL);get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}afterAllClosed=Yn(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(qe(void 0)));open(e,i){let r=this._defaultOptions||new Wr;i=b(b({},r),i),i.id=i.id||this._idGenerator.getId("cdk-dialog-"),i.id&&this.getDialogById(i.id);let o=this._getOverlayConfig(i),a=ar(this._injector,o),s=new ta(a,i),l=this._attachContainer(a,s,i);if(s.containerInstance=l,!this.openDialogs.length){let d=this._overlayContainer.getContainerElement();l._focusTrapped?l._focusTrapped.pipe(Le(1)).subscribe(()=>{this._hideNonDialogContentFromAssistiveTechnology(d)}):this._hideNonDialogContentFromAssistiveTechnology(d)}return this._attachDialogContent(e,s,l,i),this.openDialogs.push(s),s.closed.subscribe(()=>this._removeOpenDialog(s,!0)),this.afterOpened.next(s),s}closeAll(){ab(this.openDialogs,e=>e.close())}getDialogById(e){return this.openDialogs.find(i=>i.id===e)}ngOnDestroy(){ab(this._openDialogsAtThisLevel,e=>{e.config.closeOnDestroy===!1&&this._removeOpenDialog(e,!1)}),ab(this._openDialogsAtThisLevel,e=>e.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(e){let i=new rr({positionStrategy:e.positionStrategy||Rs().centerHorizontally().centerVertically(),scrollStrategy:e.scrollStrategy||this._scrollStrategy(),panelClass:e.panelClass,hasBackdrop:e.hasBackdrop,direction:e.direction,minWidth:e.minWidth,minHeight:e.minHeight,maxWidth:e.maxWidth,maxHeight:e.maxHeight,width:e.width,height:e.height,disposeOnNavigation:e.closeOnNavigation,disableAnimations:e.disableAnimations});return e.backdropClass&&(i.backdropClass=e.backdropClass),i}_attachContainer(e,i,r){let o=r.injector||r.viewContainerRef?.injector,a=[{provide:Wr,useValue:r},{provide:ta,useValue:i},{provide:Ts,useValue:e}],s;r.container?typeof r.container=="function"?s=r.container:(s=r.container.type,a.push(...r.container.providers(r))):s=sb;let l=new zr(s,r.viewContainerRef,X.create({parent:o||this._injector,providers:a}));return e.attach(l).instance}_attachDialogContent(e,i,r,o){if(e instanceof bt){let a=this._createInjector(o,i,r,void 0),s={$implicit:o.data,dialogRef:i};o.templateContext&&(s=b(b({},s),typeof o.templateContext=="function"?o.templateContext():o.templateContext)),r.attachTemplatePortal(new cn(e,null,s,a))}else{let a=this._createInjector(o,i,r,this._injector),s=r.attachComponentPortal(new zr(e,o.viewContainerRef,a,null,o.bindings));i.componentRef=s,i.componentInstance=s.instance}}_createInjector(e,i,r,o){let a=e.injector||e.viewContainerRef?.injector,s=[{provide:ZL,useValue:e.data},{provide:ta,useValue:i}];return e.providers&&(typeof e.providers=="function"?s.push(...e.providers(i,e,r)):s.push(...e.providers)),e.direction&&(!a||!a.get(wt,null,{optional:!0}))&&s.push({provide:wt,useValue:XL(e.direction)}),X.create({parent:a||o,providers:s})}_removeOpenDialog(e,i){let r=this.openDialogs.indexOf(e);r>-1&&(this.openDialogs.splice(r,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((o,a)=>{o?a.setAttribute("aria-hidden",o):a.removeAttribute("aria-hidden")}),this._ariaHiddenElements.clear(),i&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(e){if(e.parentElement){let i=e.parentElement.children;for(let r=i.length-1;r>-1;r--){let o=i[r];o!==e&&o.nodeName!=="SCRIPT"&&o.nodeName!=="STYLE"&&!o.hasAttribute("aria-live")&&!o.hasAttribute("popover")&&(this._ariaHiddenElements.set(o,o.getAttribute("aria-hidden")),o.setAttribute("aria-hidden","true"))}}}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();function ab(t,n){let e=t.length;for(;e--;)n(t[e])}var RE=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({providers:[lb],imports:[ci,ir,Dc,ir]})}return t})();function KL(t,n){}var Vf=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;position;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;delayFocusTrap=!0;scrollStrategy;closeOnNavigation=!0;enterAnimationDuration;exitAnimationDuration;bindings},cb="mdc-dialog--open",OE="mdc-dialog--opening",PE="mdc-dialog--closing",JL=150,e2=75,t2=(()=>{class t extends sb{_animationStateChanged=new O;_animationsEnabled=!Te();_actionSectionCount=0;_hostElement=this._elementRef.nativeElement;_enterAnimationDuration=this._animationsEnabled?LE(this._config.enterAnimationDuration)??JL:0;_exitAnimationDuration=this._animationsEnabled?LE(this._config.exitAnimationDuration)??e2:0;_animationTimer=null;_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:"opening",totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(FE,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(OE,cb)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add(cb),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:"closing",totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove(cb),this._animationsEnabled?(this._hostElement.style.setProperty(FE,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(PE)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(e){this._actionSectionCount+=e,this._changeDetectorRef.markForCheck()}_finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)};_finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:"closed",totalTime:this._exitAnimationDuration})};_clearAnimationClasses(){this._hostElement.classList.remove(OE,PE)}_waitForAnimationToComplete(e,i){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(i,e)}_requestAnimationFrame(e){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(e):e()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(e){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:"opened",totalTime:e})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(e){let i=super.attachComponentPortal(e);return i.location.nativeElement.classList.add("mat-mdc-dialog-component-host"),i}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275cmp=D({type:t,selectors:[["mat-dialog-container"]],hostAttrs:["tabindex","-1",1,"mat-mdc-dialog-container","mdc-dialog"],hostVars:10,hostBindings:function(i,r){i&2&&(Wt("id",r._config.id),L("aria-modal",r._config.ariaModal)("role",r._config.role)("aria-labelledby",r._config.ariaLabel?null:r._ariaLabelledByQueue[0])("aria-label",r._config.ariaLabel)("aria-describedby",r._config.ariaDescribedBy||null),T("_mat-animation-noopable",!r._animationsEnabled)("mat-mdc-dialog-container-with-actions",r._actionSectionCount>0))},features:[pe],decls:3,vars:0,consts:[[1,"mat-mdc-dialog-inner-container","mdc-dialog__container"],[1,"mat-mdc-dialog-surface","mdc-dialog__surface"],["cdkPortalOutlet",""]],template:function(i,r){i&1&&(m(0,"div",0)(1,"div",1),yt(2,KL,0,0,"ng-template",2),f()())},dependencies:[Ti],styles:[`.mat-mdc-dialog-container {
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
`],encapsulation:2,changeDetection:1})}return t})(),FE="--mat-dialog-transition-duration";function LE(t){return t==null?null:typeof t=="number"?t:t.endsWith("ms")?Vt(t.substring(0,t.length-2)):t.endsWith("s")?Vt(t.substring(0,t.length-1))*1e3:t==="0"?0:null}var jf=(function(t){return t[t.OPEN=0]="OPEN",t[t.CLOSING=1]="CLOSING",t[t.CLOSED=2]="CLOSED",t})(jf||{}),Yt=class{_ref;_config;_containerInstance;componentInstance;componentRef=null;disableClose;id;_afterOpened=new Li(1);_beforeClosed=new Li(1);_result;_closeFallbackTimeout;_state=jf.OPEN;_closeInteractionType;constructor(n,e,i){this._ref=n,this._config=e,this._containerInstance=i,this.disableClose=e.disableClose,this.id=n.id,n.addPanelClass("mat-mdc-dialog-panel"),i._animationStateChanged.pipe(ue(r=>r.state==="opened"),Le(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),i._animationStateChanged.pipe(ue(r=>r.state==="closed"),Le(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),n.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),mt(this.backdropClick(),this.keydownEvents().pipe(ue(r=>r.keyCode===27&&!this.disableClose&&!ut(r)))).subscribe(r=>{this.disableClose||(r.preventDefault(),n2(this,r.type==="keydown"?"keyboard":"mouse"))})}close(n){let e=this._config.closePredicate;e&&!e(n,this._config,this.componentInstance)||(this._result=n,this._containerInstance._animationStateChanged.pipe(ue(i=>i.state==="closing"),Le(1)).subscribe(i=>{this._beforeClosed.next(n),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),i.totalTime+100)}),this._state=jf.CLOSING,this._containerInstance._startExitAnimation())}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(n){let e=this._ref.config.positionStrategy;return n&&(n.left||n.right)?n.left?e.left(n.left):e.right(n.right):e.centerHorizontally(),n&&(n.top||n.bottom)?n.top?e.top(n.top):e.bottom(n.bottom):e.centerVertically(),this._ref.updatePosition(),this}updateSize(n="",e=""){return this._ref.updateSize(n,e),this}addPanelClass(n){return this._ref.addPanelClass(n),this}removePanelClass(n){return this._ref.removePanelClass(n),this}getState(){return this._state}_finishDialogClose(){this._state=jf.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function n2(t,n,e){return t._closeInteractionType=n,t.close(e)}var Nn=new C("MatMdcDialogData"),i2=new C("mat-mdc-dialog-default-options"),r2=new C("mat-mdc-dialog-scroll-strategy",{providedIn:"root",factory:()=>{let t=c(X);return()=>As(t)}}),ki=(()=>{class t{_defaultOptions=c(i2,{optional:!0});_scrollStrategy=c(r2);_parentDialog=c(t,{optional:!0,skipSelf:!0});_idGenerator=c(Ue);_injector=c(X);_dialog=c(lb);_animationsDisabled=Te();_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new I;_afterOpenedAtThisLevel=new I;dialogConfigClass=Vf;_dialogRefConstructor;_dialogContainerType;_dialogDataToken;get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}afterAllClosed=Yn(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(qe(void 0)));constructor(){this._dialogRefConstructor=Yt,this._dialogContainerType=t2,this._dialogDataToken=Nn}open(e,i){let r;i=b(b({},this._defaultOptions||new Vf),i),i.id=i.id||this._idGenerator.getId("mat-mdc-dialog-"),i.scrollStrategy=i.scrollStrategy||this._scrollStrategy();let o=this._dialog.open(e,V(b({},i),{positionStrategy:Rs(this._injector).centerHorizontally().centerVertically(),disableClose:!0,closePredicate:void 0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,disableAnimations:this._animationsDisabled||i.enterAnimationDuration?.toLocaleString()==="0"||i.exitAnimationDuration?.toString()==="0",container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:i},{provide:Wr,useValue:i}]},templateContext:()=>({dialogRef:r}),providers:(a,s,l)=>(r=new this._dialogRefConstructor(a,i,l),r.updatePosition(i?.position),[{provide:this._dialogContainerType,useValue:l},{provide:this._dialogDataToken,useValue:s.data},{provide:this._dialogRefConstructor,useValue:r},{provide:ta,useValue:null}])}));return r.componentRef=o.componentRef,r.componentInstance=o.componentInstance,this.openDialogs.push(r),this.afterOpened.next(r),r.afterClosed().subscribe(()=>{let a=this.openDialogs.indexOf(r);a>-1&&(this.openDialogs.splice(a,1),this.openDialogs.length||this._getAfterAllClosed().next())}),r}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(e){return this.openDialogs.find(i=>i.id===e)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(e){let i=e.length;for(;i--;)e[i].close()}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var jE=(()=>{class t{_dialogRef=c(Yt,{optional:!0});_elementRef=c(F);_dialog=c(ki);ngOnInit(){this._dialogRef||(this._dialogRef=o2(this._elementRef,this._dialog.openDialogs)),this._dialogRef&&Promise.resolve().then(()=>{this._onAdd()})}ngOnDestroy(){this._dialogRef?._containerInstance&&Promise.resolve().then(()=>{this._onRemove()})}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t})}return t})(),Hn=(()=>{class t extends jE{id=c(Ue).getId("mat-mdc-dialog-title-");_onAdd(){this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id)}_onRemove(){this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id)}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","mat-dialog-title",""],["","matDialogTitle",""]],hostAttrs:[1,"mat-mdc-dialog-title","mdc-dialog__title"],hostVars:1,hostBindings:function(i,r){i&2&&Wt("id",r.id)},inputs:{id:"id"},exportAs:["matDialogTitle"],features:[pe]})}return t})(),Un=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","mat-dialog-content",""],["mat-dialog-content"],["","matDialogContent",""]],hostAttrs:[1,"mat-mdc-dialog-content","mdc-dialog__content"],features:[__([si])]})}return t})(),zn=(()=>{class t extends jE{align;_onAdd(){this._dialogRef._containerInstance?._updateActionSectionCount?.(1)}_onRemove(){this._dialogRef._containerInstance?._updateActionSectionCount?.(-1)}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","mat-dialog-actions",""],["mat-dialog-actions"],["","matDialogActions",""]],hostAttrs:[1,"mat-mdc-dialog-actions","mdc-dialog__actions"],hostVars:6,hostBindings:function(i,r){i&2&&T("mat-mdc-dialog-actions-align-start",r.align==="start")("mat-mdc-dialog-actions-align-center",r.align==="center")("mat-mdc-dialog-actions-align-end",r.align==="end")},inputs:{align:"align"},features:[pe]})}return t})();function o2(t,n){let e=t.nativeElement.parentElement;for(;e&&!e.classList.contains("mat-mdc-dialog-container");)e=e.parentElement;return e?n.find(i=>i.id===e.id):null}var It=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({providers:[ki],imports:[RE,ci,ir,ge]})}return t})();var a2=["*"];var s2=[[["","mat-card-avatar",""],["","matCardAvatar",""]],[["mat-card-title"],["mat-card-subtitle"],["","mat-card-title",""],["","mat-card-subtitle",""],["","matCardTitle",""],["","matCardSubtitle",""]],"*"],l2=["[mat-card-avatar], [matCardAvatar]",`mat-card-title, mat-card-subtitle,
      [mat-card-title], [mat-card-subtitle],
      [matCardTitle], [matCardSubtitle]`,"*"],c2=new C("MAT_CARD_CONFIG"),Ai=(()=>{class t{appearance;constructor(){let e=c(c2,{optional:!0});this.appearance=e?.appearance||"raised"}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-card"]],hostAttrs:[1,"mat-mdc-card","mdc-card"],hostVars:8,hostBindings:function(i,r){i&2&&T("mat-mdc-card-outlined",r.appearance==="outlined")("mdc-card--outlined",r.appearance==="outlined")("mat-mdc-card-filled",r.appearance==="filled")("mdc-card--filled",r.appearance==="filled")},inputs:{appearance:"appearance"},exportAs:["matCard"],ngContentSelectors:a2,decls:1,vars:0,template:function(i,r){i&1&&(_e(),B(0))},styles:[`.mat-mdc-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  border-style: solid;
  border-width: 0;
  background-color: var(--%NS%mat-card-elevated-container-color, var(--%NS%mat-sys-surface-container-low));
  border-color: var(--%NS%mat-card-elevated-container-color, var(--%NS%mat-sys-surface-container-low));
  border-radius: var(--%NS%mat-card-elevated-container-shape, var(--%NS%mat-sys-corner-medium));
  box-shadow: var(--%NS%mat-card-elevated-container-elevation, var(--%NS%mat-sys-level1));
}
.mat-mdc-card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: solid 1px transparent;
  content: "";
  display: block;
  pointer-events: none;
  box-sizing: border-box;
  border-radius: var(--%NS%mat-card-elevated-container-shape, var(--%NS%mat-sys-corner-medium));
}

.mat-mdc-card-outlined {
  background-color: var(--%NS%mat-card-outlined-container-color, var(--%NS%mat-sys-surface));
  border-radius: var(--%NS%mat-card-outlined-container-shape, var(--%NS%mat-sys-corner-medium));
  border-width: var(--%NS%mat-card-outlined-outline-width, 1px);
  border-color: var(--%NS%mat-card-outlined-outline-color, var(--%NS%mat-sys-outline-variant));
  box-shadow: var(--%NS%mat-card-outlined-container-elevation, var(--%NS%mat-sys-level0));
}
.mat-mdc-card-outlined::after {
  border: none;
}

.mat-mdc-card-filled {
  background-color: var(--%NS%mat-card-filled-container-color, var(--%NS%mat-sys-surface-container-highest));
  border-radius: var(--%NS%mat-card-filled-container-shape, var(--%NS%mat-sys-corner-medium));
  box-shadow: var(--%NS%mat-card-filled-container-elevation, var(--%NS%mat-sys-level0));
}

.mdc-card__media {
  position: relative;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.mdc-card__media::before {
  display: block;
  content: "";
}
.mdc-card__media:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.mdc-card__media:last-child {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.mat-mdc-card-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  min-height: 52px;
  padding: 8px;
}

.mat-mdc-card-title {
  font-family: var(--%NS%mat-card-title-text-font, var(--%NS%mat-sys-title-large-font));
  line-height: var(--%NS%mat-card-title-text-line-height, var(--%NS%mat-sys-title-large-line-height));
  font-size: var(--%NS%mat-card-title-text-size, var(--%NS%mat-sys-title-large-size));
  letter-spacing: var(--%NS%mat-card-title-text-tracking, var(--%NS%mat-sys-title-large-tracking));
  font-weight: var(--%NS%mat-card-title-text-weight, var(--%NS%mat-sys-title-large-weight));
}

.mat-mdc-card-subtitle {
  color: var(--%NS%mat-card-subtitle-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-card-subtitle-text-font, var(--%NS%mat-sys-title-medium-font));
  line-height: var(--%NS%mat-card-subtitle-text-line-height, var(--%NS%mat-sys-title-medium-line-height));
  font-size: var(--%NS%mat-card-subtitle-text-size, var(--%NS%mat-sys-title-medium-size));
  letter-spacing: var(--%NS%mat-card-subtitle-text-tracking, var(--%NS%mat-sys-title-medium-tracking));
  font-weight: var(--%NS%mat-card-subtitle-text-weight, var(--%NS%mat-sys-title-medium-weight));
}

.mat-mdc-card-title,
.mat-mdc-card-subtitle {
  display: block;
  margin: 0;
}
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title,
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle {
  padding: 16px 16px 0;
}

.mat-mdc-card-header {
  display: flex;
  padding: 16px 16px 0;
}

.mat-mdc-card-content {
  display: block;
  padding: 0 16px;
}
.mat-mdc-card-content:first-child {
  padding-top: 16px;
}
.mat-mdc-card-content:last-child {
  padding-bottom: 16px;
}

.mat-mdc-card-title-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.mat-mdc-card-avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-bottom: 16px;
  object-fit: cover;
}
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle,
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title {
  line-height: normal;
}

.mat-mdc-card-sm-image {
  width: 80px;
  height: 80px;
}

.mat-mdc-card-md-image {
  width: 112px;
  height: 112px;
}

.mat-mdc-card-lg-image {
  width: 152px;
  height: 152px;
}

.mat-mdc-card-xl-image {
  width: 240px;
  height: 240px;
}

.mat-mdc-card-subtitle ~ .mat-mdc-card-title,
.mat-mdc-card-title ~ .mat-mdc-card-subtitle,
.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,
.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,
.mat-mdc-card-title-group .mat-mdc-card-title,
.mat-mdc-card-title-group .mat-mdc-card-subtitle {
  padding-top: 0;
}

.mat-mdc-card-content > :last-child:not(.mat-mdc-card-footer) {
  margin-bottom: 0;
}

.mat-mdc-card-actions-align-end {
  justify-content: flex-end;
}
`],encapsulation:2})}return t})(),Gr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-card-title"],["","mat-card-title",""],["","matCardTitle",""]],hostAttrs:[1,"mat-mdc-card-title"]})}return t})();var Ps=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-card-content"]],hostAttrs:[1,"mat-mdc-card-content"]})}return t})(),Bf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-card-subtitle"],["","mat-card-subtitle",""],["","matCardSubtitle",""]],hostAttrs:[1,"mat-mdc-card-subtitle"]})}return t})(),VE=(()=>{class t{align="start";static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-card-actions"]],hostAttrs:[1,"mat-mdc-card-actions","mdc-card__actions"],hostVars:2,hostBindings:function(i,r){i&2&&T("mat-mdc-card-actions-align-end",r.align==="end")},inputs:{align:"align"},exportAs:["matCardActions"]})}return t})(),Fs=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-card-header"]],hostAttrs:[1,"mat-mdc-card-header"],ngContentSelectors:l2,decls:4,vars:0,consts:[[1,"mat-mdc-card-header-text"]],template:function(i,r){i&1&&(_e(s2),B(0),je(1,"div",0),B(2,1),Ze(),B(3,2))},encapsulation:2})}return t})();var Hf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","mat-card-avatar",""],["","matCardAvatar",""]],hostAttrs:[1,"mat-mdc-card-avatar"]})}return t})();var $n=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ge]})}return t})();var d2=["determinateSpinner"];function u2(t,n){if(t&1&&(fn(),m(0,"svg",11),j(1,"circle",12),f()),t&2){let e=y();L("viewBox",e._viewBox()),p(),Lt("stroke-dasharray",e._strokeCircumference(),"px")("stroke-dashoffset",e._strokeCircumference()/2,"px")("stroke-width",e._circleStrokeWidth(),"%"),L("r",e._circleRadius())}}var m2=new C("mat-progress-spinner-default-options",{providedIn:"root",factory:()=>({diameter:BE})}),BE=100,f2=10,Zt=(()=>{class t{_elementRef=c(F);_noopAnimations;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor="primary";_determinateCircle;constructor(){let e=c(m2),i=kc(),r=this._elementRef.nativeElement;this._noopAnimations=i==="di-disabled"&&!!e&&!e._forceAnimations,this.mode=r.nodeName.toLowerCase()==="mat-spinner"?"indeterminate":"determinate",!this._noopAnimations&&i==="reduced-motion"&&r.classList.add("mat-progress-spinner-reduced-motion"),e&&(e.color&&(this.color=this._defaultColor=e.color),e.diameter&&(this.diameter=e.diameter),e.strokeWidth&&(this.strokeWidth=e.strokeWidth))}mode;get value(){return this.mode==="determinate"?this._value:0}set value(e){this._value=Math.max(0,Math.min(100,e||0))}_value=0;get diameter(){return this._diameter}set diameter(e){this._diameter=e||0}_diameter=BE;get strokeWidth(){return this._strokeWidth??this.diameter/10}set strokeWidth(e){this._strokeWidth=e||0}_strokeWidth;_circleRadius(){return(this.diameter-f2)/2}_viewBox(){let e=this._circleRadius()*2+this.strokeWidth;return`0 0 ${e} ${e}`}_strokeCircumference(){return 2*Math.PI*this._circleRadius()}_strokeDashOffset(){return this.mode==="determinate"?this._strokeCircumference()*(100-this._value)/100:null}_circleStrokeWidth(){return this.strokeWidth/this.diameter*100}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-progress-spinner"],["mat-spinner"]],viewQuery:function(i,r){if(i&1&&Re(d2,5),i&2){let o;z(o=$())&&(r._determinateCircle=o.first)}},hostAttrs:["role","progressbar","tabindex","-1",1,"mat-mdc-progress-spinner","mdc-circular-progress"],hostVars:18,hostBindings:function(i,r){i&2&&(L("aria-valuemin",0)("aria-valuemax",100)("aria-valuenow",r.mode==="determinate"?r.value:null)("mode",r.mode),Ke("mat-"+r.color),Lt("width",r.diameter,"px")("height",r.diameter,"px")("--%NS%mat-progress-spinner-size",r.diameter+"px")("--%NS%mat-progress-spinner-active-indicator-width",r.diameter+"px"),T("_mat-animation-noopable",r._noopAnimations)("mdc-circular-progress--indeterminate",r.mode==="indeterminate"))},inputs:{color:"color",mode:"mode",value:[2,"value","value",Nt],diameter:[2,"diameter","diameter",Nt],strokeWidth:[2,"strokeWidth","strokeWidth",Nt]},exportAs:["matProgressSpinner"],decls:14,vars:11,consts:[["circle",""],["determinateSpinner",""],["aria-hidden","true",1,"mdc-circular-progress__determinate-container"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__determinate-circle-graphic"],["cx","50%","cy","50%",1,"mdc-circular-progress__determinate-circle"],["aria-hidden","true",1,"mdc-circular-progress__indeterminate-container"],[1,"mdc-circular-progress__spinner-layer"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-left"],[3,"ngTemplateOutlet"],[1,"mdc-circular-progress__gap-patch"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-right"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__indeterminate-circle-graphic"],["cx","50%","cy","50%"]],template:function(i,r){if(i&1&&(yt(0,u2,2,8,"ng-template",null,0,Wa),m(2,"div",2,1),fn(),m(4,"svg",3),j(5,"circle",4),f()(),wl(),m(6,"div",5)(7,"div",6)(8,"div",7),Ba(9,8),f(),m(10,"div",9),Ba(11,8),f(),m(12,"div",10),Ba(13,8),f()()()),i&2){let o=rt(1);p(4),L("viewBox",r._viewBox()),p(),Lt("stroke-dasharray",r._strokeCircumference(),"px")("stroke-dashoffset",r._strokeDashOffset(),"px")("stroke-width",r._circleStrokeWidth(),"%"),L("r",r._circleRadius()),p(4),N("ngTemplateOutlet",o),p(2),N("ngTemplateOutlet",o),p(2),N("ngTemplateOutlet",o)}},dependencies:[Xl],styles:[`.mat-mdc-progress-spinner {
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
`],encapsulation:2})}return t})();var Qt=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ge]})}return t})();function h2(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=y();p(),k(e.errorMessage())}}function p2(t,n){if(t&1){let e=ae();m(0,"button",9),w("click",function(){let r=q(e).$implicit,o=y();return Y(o.selectedAgent.set(r))}),m(1,"mat-icon"),g(2),f(),m(3,"span"),g(4),f()()}if(t&2){let e=n.$implicit,i=y();T("selected",i.selectedAgent()===e),L("aria-selected",i.selectedAgent()===e),p(2),k(i.agentIcon(e)),p(2),k(e)}}function g2(t,n){t&1&&(m(0,"p",4),g(1,"No agents are configured."),f())}function _2(t,n){t&1&&j(0,"mat-spinner",8)}function v2(t,n){t&1&&g(0," Start chat ")}var Ls=class t{constructor(n){this.state=c(Fe);this.dialogRef=c(Yt);this.router=c(an);this.selectedAgent=S("");this.creating=S(!1);this.errorMessage=S("");this.projectId=n.projectId,this.selectedAgent.set(this.state.agents()[0]??"codex")}agentIcon(n){let e=n.toLowerCase();return e.includes("codex")?"terminal":e.includes("claude")?"smart_toy":e.includes("opencode")?"code":e.includes("gemini")||e.includes("antigravity")?"psychology":"robot_2"}async create(){if(!(!this.projectId||!this.selectedAgent())){this.creating.set(!0),this.errorMessage.set("");try{let n=await this.state.createChat(this.projectId,this.selectedAgent());this.dialogRef.close(n),await this.router.navigate(["/projects",this.projectId,"chats",n.id])}catch(n){this.errorMessage.set(n instanceof Error?n.message:"Failed to create chat")}finally{this.creating.set(!1)}}}static{this.\u0275fac=function(e){return new(e||t)(te(Nn))}}static{this.\u0275cmp=D({type:t,selectors:[["hub-agent-picker"]],decls:14,vars:5,consts:[["mat-dialog-title",""],["role","alert",1,"error-box"],["role","listbox","aria-label","Available agents",1,"agent-grid"],["mat-stroked-button","","role","option","type","button",1,"agent-option",3,"selected"],[1,"empty"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","type","button",3,"click","disabled"],["diameter","18"],["mat-stroked-button","","role","option","type","button",1,"agent-option",3,"click"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"Select agent"),f(),m(2,"mat-dialog-content"),E(3,h2,2,1,"div",1),m(4,"div",2),nt(5,p2,5,5,"button",3,Va,!1,g2,2,0,"p",4),f()(),m(8,"mat-dialog-actions",5)(9,"button",6),w("click",function(){return i.dialogRef.close()}),g(10,"Cancel"),f(),m(11,"button",7),w("click",function(){return i.create()}),E(12,_2,1,0,"mat-spinner",8)(13,v2,1,0),f()()),e&2&&(p(3),M(i.errorMessage()?3:-1),p(2),it(i.state.agents()),p(4),N("disabled",i.creating()),p(2),N("disabled",!i.selectedAgent()||i.creating()),p(),M(i.creating()?12:13))},dependencies:[Oe,ot,$n,It,Hn,zn,Un,Pe,ze,Qt,Zt],styles:["mat-dialog-content[_ngcontent-%COMP%]{min-width:min(480px,100vw - 48px)}.agent-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;padding:12px 0}.agent-option[_ngcontent-%COMP%]{min-height:112px;display:flex;flex-direction:column;gap:8px;justify-content:center;border-radius:var(--%NS%mat-sys-corner-large);text-transform:capitalize}.agent-option[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary);font-size:30px;width:30px;height:30px}.agent-option.selected[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-primary-container);border-color:var(--%NS%mat-sys-primary);color:var(--%NS%mat-sys-on-primary-container)}.empty[_ngcontent-%COMP%]{grid-column:1/-1;padding:24px 0;color:var(--%NS%mat-sys-on-surface-variant);text-align:center}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};var db=class{_box;_destroyed=new I;_resizeSubject=new I;_resizeObserver;_elementObservables=new Map;constructor(n){this._box=n,typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(e=>this._resizeSubject.next(e)))}observe(n){return this._elementObservables.has(n)||this._elementObservables.set(n,new le(e=>{let i=this._resizeSubject.subscribe(e);return this._resizeObserver?.observe(n,{box:this._box}),()=>{this._resizeObserver?.unobserve(n),i.unsubscribe(),this._elementObservables.delete(n)}}).pipe(ue(e=>e.some(i=>i.target===n)),Pd({bufferSize:1,refCount:!0}),he(this._destroyed))),this._elementObservables.get(n)}destroy(){this._destroyed.next(),this._destroyed.complete(),this._resizeSubject.complete(),this._elementObservables.clear()}},Uf=(()=>{class t{_cleanupErrorListener;_observers=new Map;_ngZone=c(U);constructor(){typeof ResizeObserver<"u"}ngOnDestroy(){for(let[,e]of this._observers)e.destroy();this._observers.clear(),this._cleanupErrorListener?.()}observe(e,i){let r=i?.box||"content-box";return this._observers.has(r)||this._observers.set(r,new db(r)),this._observers.get(r).observe(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var b2=["notch"],y2=["*"],HE=["iconPrefixContainer"],UE=["textPrefixContainer"],zE=["iconSuffixContainer"],$E=["textSuffixContainer"],C2=["textField"],w2=["*",[["mat-label"]],[["","matPrefix",""],["","matIconPrefix",""]],[["","matTextPrefix",""]],[["","matTextSuffix",""]],[["","matSuffix",""],["","matIconSuffix",""]],[["mat-error"],["","matError",""]],[["mat-hint",3,"align","end"]],[["mat-hint","align","end"]]],S2=["*","mat-label","[matPrefix], [matIconPrefix]","[matTextPrefix]","[matTextSuffix]","[matSuffix], [matIconSuffix]","mat-error, [matError]","mat-hint:not([align='end'])","mat-hint[align='end']"];function x2(t,n){t&1&&j(0,"span",21)}function D2(t,n){if(t&1&&(m(0,"label",20),B(1,1),E(2,x2,1,0,"span",21),f()),t&2){let e=y(2);N("floating",e._shouldLabelFloat())("monitorResize",e._hasOutline())("id",e._labelId),L("for",e._control.disableAutomaticLabeling?null:e._control.id),p(2),M(!e.hideRequiredMarker&&e._control.required?2:-1)}}function E2(t,n){if(t&1&&E(0,D2,3,5,"label",20),t&2){let e=y();M(e._hasFloatingLabel()?0:-1)}}function M2(t,n){t&1&&j(0,"div",7)}function N2(t,n){}function I2(t,n){if(t&1&&yt(0,N2,0,0,"ng-template",13),t&2){y(2);let e=rt(1);N("ngTemplateOutlet",e)}}function T2(t,n){if(t&1&&(m(0,"div",9),E(1,I2,1,1,null,13),f()),t&2){let e=y();N("matFormFieldNotchedOutlineOpen",e._shouldLabelFloat()),p(),M(e._forceDisplayInfixLabel()?-1:1)}}function k2(t,n){t&1&&(m(0,"div",10,2),B(2,2),f())}function A2(t,n){t&1&&(m(0,"div",11,3),B(2,3),f())}function R2(t,n){}function O2(t,n){if(t&1&&yt(0,R2,0,0,"ng-template",13),t&2){y();let e=rt(1);N("ngTemplateOutlet",e)}}function P2(t,n){t&1&&(m(0,"div",14,4),B(2,4),f())}function F2(t,n){t&1&&(m(0,"div",15,5),B(2,5),f())}function L2(t,n){t&1&&j(0,"div",16)}function j2(t,n){t&1&&(m(0,"div",18),B(1,6),f())}function V2(t,n){if(t&1&&(m(0,"mat-hint",22),g(1),f()),t&2){let e=y(2);N("id",e._hintLabelId),p(),k(e.hintLabel)}}function B2(t,n){if(t&1&&(m(0,"div",19),E(1,V2,2,2,"mat-hint",22),B(2,7),j(3,"div",23),B(4,8),f()),t&2){let e=y();p(),M(e.hintLabel?1:-1)}}var In=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-label"]]})}return t})(),H2=new C("MatError");var Kc=(()=>{class t{align="start";id=c(Ue).getId("mat-mdc-hint-");static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-hint"]],hostAttrs:[1,"mat-mdc-form-field-hint","mat-mdc-form-field-bottom-align"],hostVars:4,hostBindings:function(i,r){i&2&&(Wt("id",r.id),L("align",null),T("mat-mdc-form-field-hint-end",r.align==="end"))},inputs:{align:"align",id:"id"}})}return t})(),U2=new C("MatPrefix");var z2=new C("MatSuffix");var XE=new C("FloatingLabelParent"),WE=(()=>{class t{_elementRef=c(F);get floating(){return this._floating}set floating(e){this._floating=e,this.monitorResize&&this._handleResize()}_floating=!1;get monitorResize(){return this._monitorResize}set monitorResize(e){this._monitorResize=e,this._monitorResize?this._subscribeToResize():this._resizeSubscription.unsubscribe()}_monitorResize=!1;_resizeObserver=c(Uf);_ngZone=c(U);_parent=c(XE);_resizeSubscription=new ce;ngOnDestroy(){this._resizeSubscription.unsubscribe()}getWidth(){return $2(this._elementRef.nativeElement)}get element(){return this._elementRef.nativeElement}_handleResize(){setTimeout(()=>this._parent._handleLabelResized())}_subscribeToResize(){this._resizeSubscription.unsubscribe(),this._ngZone.runOutsideAngular(()=>{this._resizeSubscription=this._resizeObserver.observe(this._elementRef.nativeElement,{box:"border-box"}).subscribe(()=>this._handleResize())})}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["label","matFormFieldFloatingLabel",""]],hostAttrs:[1,"mdc-floating-label","mat-mdc-floating-label"],hostVars:2,hostBindings:function(i,r){i&2&&T("mdc-floating-label--float-above",r.floating)},inputs:{floating:"floating",monitorResize:"monitorResize"}})}return t})();function $2(t){let n=t;if(n.offsetParent!==null)return n.scrollWidth;let e=n.cloneNode(!0);e.style.setProperty("position","absolute"),e.style.setProperty("transform","translate(-9999px, -9999px)"),document.documentElement.appendChild(e);let i=e.scrollWidth;return e.remove(),i}var GE="mdc-line-ripple--active",zf="mdc-line-ripple--deactivating",qE=(()=>{class t{_elementRef=c(F);_cleanupTransitionEnd;constructor(){let e=c(U),i=c(Se);e.runOutsideAngular(()=>{this._cleanupTransitionEnd=i.listen(this._elementRef.nativeElement,"transitionend",this._handleTransitionEnd)})}activate(){let e=this._elementRef.nativeElement.classList;e.remove(zf),e.add(GE)}deactivate(){this._elementRef.nativeElement.classList.add(zf)}_handleTransitionEnd=e=>{let i=this._elementRef.nativeElement.classList,r=i.contains(zf);e.propertyName==="opacity"&&r&&i.remove(GE,zf)};ngOnDestroy(){this._cleanupTransitionEnd()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["div","matFormFieldLineRipple",""]],hostAttrs:[1,"mdc-line-ripple"]})}return t})(),YE=(()=>{class t{_elementRef=c(F);_ngZone=c(U);open=!1;_notch;ngAfterViewInit(){let e=this._elementRef.nativeElement,i=e.querySelector(".mdc-floating-label");i?(e.classList.add("mdc-notched-outline--upgraded"),typeof requestAnimationFrame=="function"&&(i.style.transitionDuration="0s",this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>i.style.transitionDuration="")}))):e.classList.add("mdc-notched-outline--no-label")}_setNotchWidth(e){let i=this._notch.nativeElement;!this.open||!e?i.style.width="":i.style.width=`calc(${e}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`}_setMaxWidth(e){this._notch.nativeElement.style.setProperty("--mat-form-field-notch-max-width",`calc(100% - ${e}px)`)}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["div","matFormFieldNotchedOutline",""]],viewQuery:function(i,r){if(i&1&&Re(b2,5),i&2){let o;z(o=$())&&(r._notch=o.first)}},hostAttrs:[1,"mdc-notched-outline"],hostVars:2,hostBindings:function(i,r){i&2&&T("mdc-notched-outline--notched",r.open)},inputs:{open:[0,"matFormFieldNotchedOutlineOpen","open"]},ngContentSelectors:y2,decls:5,vars:0,consts:[["notch",""],[1,"mat-mdc-notch-piece","mdc-notched-outline__leading"],[1,"mat-mdc-notch-piece","mdc-notched-outline__notch"],[1,"mat-mdc-notch-piece","mdc-notched-outline__trailing"]],template:function(i,r){i&1&&(_e(),xt(0,"div",1),je(1,"div",2,0),B(3),Ze(),xt(4,"div",3))},encapsulation:2})}return t})(),Jc=(()=>{class t{value=null;stateChanges;id;placeholder;ngControl=null;focused=!1;empty=!1;shouldLabelFloat=!1;required=!1;disabled=!1;errorState=!1;controlType;autofilled;userAriaDescribedBy;disableAutomaticLabeling;describedByIds;static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t})}return t})();var ed=new C("MatFormField"),W2=new C("MAT_FORM_FIELD_DEFAULT_OPTIONS"),ZE="fill",G2="auto",QE="fixed",q2="translateY(-50%)",Wn=(()=>{class t{_elementRef=c(F);_changeDetectorRef=c(Me);_platform=c(ye);_idGenerator=c(Ue);_ngZone=c(U);_defaults=c(W2,{optional:!0});_currentDirection;_textField;_iconPrefixContainer;_textPrefixContainer;_iconSuffixContainer;_textSuffixContainer;_floatingLabel;_notchedOutline;_lineRipple;_iconPrefixContainerSignal=Oo("iconPrefixContainer");_textPrefixContainerSignal=Oo("textPrefixContainer");_iconSuffixContainerSignal=Oo("iconSuffixContainer");_textSuffixContainerSignal=Oo("textSuffixContainer");_prefixSuffixContainers=De(()=>[this._iconPrefixContainerSignal(),this._textPrefixContainerSignal(),this._iconSuffixContainerSignal(),this._textSuffixContainerSignal()].map(e=>e?.nativeElement).filter(e=>e!==void 0));_formFieldControl;_prefixChildren;_suffixChildren;_errorChildren;_hintChildren;_labelChild=cS(In);get hideRequiredMarker(){return this._hideRequiredMarker}set hideRequiredMarker(e){this._hideRequiredMarker=lt(e)}_hideRequiredMarker=!1;color="primary";get floatLabel(){return this._floatLabel||this._defaults?.floatLabel||G2}set floatLabel(e){e!==this._floatLabel&&(this._floatLabel=e,this._changeDetectorRef.markForCheck())}_floatLabel;get appearance(){return this._appearanceSignal()}set appearance(e){let i=e||this._defaults?.appearance||ZE;this._appearanceSignal.set(i)}_appearanceSignal=S(ZE);get subscriptSizing(){return this._subscriptSizing||this._defaults?.subscriptSizing||QE}set subscriptSizing(e){this._subscriptSizing=e||this._defaults?.subscriptSizing||QE}_subscriptSizing=null;get hintLabel(){return this._hintLabel}set hintLabel(e){this._hintLabel=e,this._processHints()}_hintLabel="";_hasIconPrefix=!1;_hasTextPrefix=!1;_hasIconSuffix=!1;_hasTextSuffix=!1;_labelId=this._idGenerator.getId("mat-mdc-form-field-label-");_hintLabelId=this._idGenerator.getId("mat-mdc-hint-");_describedByIds;get _control(){return this._explicitFormFieldControl||this._formFieldControl}set _control(e){this._explicitFormFieldControl=e}_destroyed=new I;_isFocused=null;_explicitFormFieldControl;_previousControl=null;_previousControlValidatorFn=null;_stateChanges;_valueChanges;_describedByChanges;_outlineLabelOffsetResizeObserver=null;_animationsDisabled=Te();constructor(){let e=this._defaults,i=c(wt);e&&(e.appearance&&(this.appearance=e.appearance),this._hideRequiredMarker=!!e?.hideRequiredMarker,e.color&&(this.color=e.color)),vt(()=>this._currentDirection=i.valueSignal()),this._syncOutlineLabelOffset()}ngAfterViewInit(){this._updateFocusState(),this._animationsDisabled||this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-form-field-animations-enabled")},300)}),this._changeDetectorRef.detectChanges()}ngAfterContentInit(){this._assertFormFieldControl(),this._initializeSubscript(),this._initializePrefixAndSuffix()}ngAfterContentChecked(){this._assertFormFieldControl(),this._control!==this._previousControl&&(this._initializeControl(this._previousControl),this._control.ngControl&&this._control.ngControl.control&&(this._previousControlValidatorFn=this._control.ngControl.control.validator),this._previousControl=this._control,this._changeDetectorRef.markForCheck()),this._control.ngControl&&this._control.ngControl.control&&this._control.ngControl.control.validator!==this._previousControlValidatorFn&&this._changeDetectorRef.markForCheck()}ngOnDestroy(){this._outlineLabelOffsetResizeObserver?.disconnect(),this._stateChanges?.unsubscribe(),this._valueChanges?.unsubscribe(),this._describedByChanges?.unsubscribe(),this._destroyed.next(),this._destroyed.complete()}getLabelId=De(()=>this._hasFloatingLabel()?this._labelId:null);getConnectedOverlayOrigin(){return this._textField||this._elementRef}_animateAndLockLabel(){this._hasFloatingLabel()&&(this.floatLabel="always")}_initializeControl(e){let i=this._control,r="mat-mdc-form-field-type-";e&&this._elementRef.nativeElement.classList.remove(r+e.controlType),i.controlType&&this._elementRef.nativeElement.classList.add(r+i.controlType),this._stateChanges?.unsubscribe(),this._stateChanges=i.stateChanges.subscribe(()=>{this._updateFocusState(),this._changeDetectorRef.markForCheck()}),this._describedByChanges?.unsubscribe(),this._describedByChanges=i.stateChanges.pipe(qe([void 0,void 0]),J(()=>[i.errorState,i.userAriaDescribedBy]),Od(),ue(([[o,a],[s,l]])=>o!==s||a!==l)).subscribe(()=>this._syncDescribedByIds()),this._valueChanges?.unsubscribe(),i.ngControl&&i.ngControl.valueChanges&&(this._valueChanges=i.ngControl.valueChanges.pipe(he(this._destroyed)).subscribe(()=>this._changeDetectorRef.markForCheck()))}_checkPrefixAndSuffixTypes(){this._hasIconPrefix=!!this._prefixChildren.find(e=>!e._isText),this._hasTextPrefix=!!this._prefixChildren.find(e=>e._isText),this._hasIconSuffix=!!this._suffixChildren.find(e=>!e._isText),this._hasTextSuffix=!!this._suffixChildren.find(e=>e._isText)}_initializePrefixAndSuffix(){this._checkPrefixAndSuffixTypes(),mt(this._prefixChildren.changes,this._suffixChildren.changes).subscribe(()=>{this._checkPrefixAndSuffixTypes(),this._changeDetectorRef.markForCheck()})}_initializeSubscript(){this._hintChildren.changes.subscribe(()=>{this._processHints(),this._changeDetectorRef.markForCheck()}),this._errorChildren.changes.subscribe(()=>{this._syncDescribedByIds(),this._changeDetectorRef.markForCheck()}),this._validateHints(),this._syncDescribedByIds()}_assertFormFieldControl(){this._control}_updateFocusState(){let e=this._control.focused;e&&!this._isFocused?(this._isFocused=!0,this._lineRipple?.activate()):!e&&(this._isFocused||this._isFocused===null)&&(this._isFocused=!1,this._lineRipple?.deactivate()),this._elementRef.nativeElement.classList.toggle("mat-focused",e),this._textField?.nativeElement.classList.toggle("mdc-text-field--focused",e)}_syncOutlineLabelOffset(){I_({earlyRead:()=>{if(this._appearanceSignal()!=="outline")return this._outlineLabelOffsetResizeObserver?.disconnect(),null;if(globalThis.ResizeObserver){this._outlineLabelOffsetResizeObserver||=new globalThis.ResizeObserver(()=>{this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset())});for(let e of this._prefixSuffixContainers())this._outlineLabelOffsetResizeObserver.observe(e,{box:"border-box"})}return this._getOutlinedLabelOffset()},write:e=>this._writeOutlinedLabelStyles(e())})}_shouldAlwaysFloat(){return this.floatLabel==="always"}_hasOutline(){return this.appearance==="outline"}_forceDisplayInfixLabel(){return!this._platform.isBrowser&&this._prefixChildren.length&&!this._shouldLabelFloat()}_hasFloatingLabel=De(()=>!!this._labelChild());_shouldLabelFloat(){return this._hasFloatingLabel()?this._control.shouldLabelFloat||this._shouldAlwaysFloat():!1}_shouldForward(e){let i=this._control?this._control.ngControl:null;return i&&i[e]}_getSubscriptMessageType(){return this._errorChildren&&this._errorChildren.length>0&&this._control.errorState?"error":"hint"}_handleLabelResized(){this._refreshOutlineNotchWidth()}_refreshOutlineNotchWidth(){!this._hasOutline()||!this._floatingLabel||!this._shouldLabelFloat()?this._notchedOutline?._setNotchWidth(0):this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth())}_processHints(){this._validateHints(),this._syncDescribedByIds()}_validateHints(){this._hintChildren}_syncDescribedByIds(){if(this._control){let e=[];if(this._control.userAriaDescribedBy&&typeof this._control.userAriaDescribedBy=="string"&&e.push(...this._control.userAriaDescribedBy.split(" ")),this._getSubscriptMessageType()==="hint"){let o=this._hintChildren?this._hintChildren.find(s=>s.align==="start"):null,a=this._hintChildren?this._hintChildren.find(s=>s.align==="end"):null;o?e.push(o.id):this._hintLabel&&e.push(this._hintLabelId),a&&e.push(a.id)}else this._errorChildren&&e.push(...this._errorChildren.map(o=>o.id));let i=this._control.describedByIds,r;if(i){let o=this._describedByIds||e;r=e.concat(i.filter(a=>a&&!o.includes(a)))}else r=e;this._control.setDescribedByIds(r),this._describedByIds=e}}_getOutlinedLabelOffset(){if(!this._hasOutline()||!this._floatingLabel)return null;if(!this._iconPrefixContainer&&!this._textPrefixContainer)return["",null];if(!this._isAttachedToDom())return null;let e=this._iconPrefixContainer?.nativeElement,i=this._textPrefixContainer?.nativeElement,r=this._iconSuffixContainer?.nativeElement,o=this._textSuffixContainer?.nativeElement,a=e?.getBoundingClientRect().width??0,s=i?.getBoundingClientRect().width??0,l=r?.getBoundingClientRect().width??0,d=o?.getBoundingClientRect().width??0,u=this._currentDirection==="rtl"?"-1":"1",h=`${a+s}px`,v=`calc(${u} * (${h} + var(--mat-mdc-form-field-label-offset-x, 0px)))`,x=`var(--mat-mdc-form-field-label-transform, ${q2} translateX(${v}))`,A=a+s+l+d;return[x,A]}_writeOutlinedLabelStyles(e){if(e!==null){let[i,r]=e;this._floatingLabel&&(this._floatingLabel.element.style.transform=i),r!==null&&this._notchedOutline?._setMaxWidth(r)}}_isAttachedToDom(){let e=this._elementRef.nativeElement;if(e.getRootNode){let i=e.getRootNode();return i&&i!==e}return document.documentElement.contains(e)}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-form-field"]],contentQueries:function(i,r,o){if(i&1&&(Ju(o,r._labelChild,In,5),ct(o,Jc,5)(o,U2,5)(o,z2,5)(o,H2,5)(o,Kc,5)),i&2){za();let a;z(a=$())&&(r._formFieldControl=a.first),z(a=$())&&(r._prefixChildren=a),z(a=$())&&(r._suffixChildren=a),z(a=$())&&(r._errorChildren=a),z(a=$())&&(r._hintChildren=a)}},viewQuery:function(i,r){if(i&1&&(Ua(r._iconPrefixContainerSignal,HE,5)(r._textPrefixContainerSignal,UE,5)(r._iconSuffixContainerSignal,zE,5)(r._textSuffixContainerSignal,$E,5),Re(C2,5)(HE,5)(UE,5)(zE,5)($E,5)(WE,5)(YE,5)(qE,5)),i&2){za(4);let o;z(o=$())&&(r._textField=o.first),z(o=$())&&(r._iconPrefixContainer=o.first),z(o=$())&&(r._textPrefixContainer=o.first),z(o=$())&&(r._iconSuffixContainer=o.first),z(o=$())&&(r._textSuffixContainer=o.first),z(o=$())&&(r._floatingLabel=o.first),z(o=$())&&(r._notchedOutline=o.first),z(o=$())&&(r._lineRipple=o.first)}},hostAttrs:[1,"mat-mdc-form-field"],hostVars:38,hostBindings:function(i,r){i&2&&T("mat-mdc-form-field-label-always-float",r._shouldAlwaysFloat())("mat-mdc-form-field-has-icon-prefix",r._hasIconPrefix)("mat-mdc-form-field-has-icon-suffix",r._hasIconSuffix)("mat-form-field-invalid",r._control.errorState)("mat-form-field-disabled",r._control.disabled)("mat-form-field-autofilled",r._control.autofilled)("mat-form-field-appearance-fill",r.appearance=="fill")("mat-form-field-appearance-outline",r.appearance=="outline")("mat-form-field-hide-placeholder",r._hasFloatingLabel()&&!r._shouldLabelFloat())("mat-primary",r.color!=="accent"&&r.color!=="warn")("mat-accent",r.color==="accent")("mat-warn",r.color==="warn")("ng-untouched",r._shouldForward("untouched"))("ng-touched",r._shouldForward("touched"))("ng-pristine",r._shouldForward("pristine"))("ng-dirty",r._shouldForward("dirty"))("ng-valid",r._shouldForward("valid"))("ng-invalid",r._shouldForward("invalid"))("ng-pending",r._shouldForward("pending"))},inputs:{hideRequiredMarker:"hideRequiredMarker",color:"color",floatLabel:"floatLabel",appearance:"appearance",subscriptSizing:"subscriptSizing",hintLabel:"hintLabel"},exportAs:["matFormField"],features:[Ne([{provide:ed,useExisting:t},{provide:XE,useExisting:t}])],ngContentSelectors:S2,decls:18,vars:21,consts:[["labelTemplate",""],["textField",""],["iconPrefixContainer",""],["textPrefixContainer",""],["textSuffixContainer",""],["iconSuffixContainer",""],[1,"mat-mdc-text-field-wrapper","mdc-text-field",3,"click"],[1,"mat-mdc-form-field-focus-overlay"],[1,"mat-mdc-form-field-flex"],["matFormFieldNotchedOutline","",3,"matFormFieldNotchedOutlineOpen"],[1,"mat-mdc-form-field-icon-prefix"],[1,"mat-mdc-form-field-text-prefix"],[1,"mat-mdc-form-field-infix"],[3,"ngTemplateOutlet"],[1,"mat-mdc-form-field-text-suffix"],[1,"mat-mdc-form-field-icon-suffix"],["matFormFieldLineRipple",""],["aria-atomic","true","aria-live","polite",1,"mat-mdc-form-field-subscript-wrapper","mat-mdc-form-field-bottom-align"],[1,"mat-mdc-form-field-error-wrapper"],[1,"mat-mdc-form-field-hint-wrapper"],["matFormFieldFloatingLabel","",3,"floating","monitorResize","id"],["aria-hidden","true",1,"mat-mdc-form-field-required-marker","mdc-floating-label--required"],[3,"id"],[1,"mat-mdc-form-field-hint-spacer"]],template:function(i,r){if(i&1&&(_e(w2),yt(0,E2,1,1,"ng-template",null,0,Wa),m(2,"div",6,1),w("click",function(a){return r._control.onContainerClick(a)}),E(4,M2,1,0,"div",7),m(5,"div",8),E(6,T2,2,2,"div",9),E(7,k2,3,0,"div",10),E(8,A2,3,0,"div",11),m(9,"div",12),E(10,O2,1,1,null,13),B(11),f(),E(12,P2,3,0,"div",14),E(13,F2,3,0,"div",15),f(),E(14,L2,1,0,"div",16),f(),m(15,"div",17),E(16,j2,2,0,"div",18)(17,B2,5,1,"div",19),f()),i&2){let o;p(2),T("mdc-text-field--filled",!r._hasOutline())("mdc-text-field--outlined",r._hasOutline())("mdc-text-field--no-label",!r._hasFloatingLabel())("mdc-text-field--disabled",r._control.disabled)("mdc-text-field--invalid",r._control.errorState),p(2),M(!r._hasOutline()&&!r._control.disabled?4:-1),p(2),M(r._hasOutline()?6:-1),p(),M(r._hasIconPrefix?7:-1),p(),M(r._hasTextPrefix?8:-1),p(2),M(!r._hasOutline()||r._forceDisplayInfixLabel()?10:-1),p(2),M(r._hasTextSuffix?12:-1),p(),M(r._hasIconSuffix?13:-1),p(),M(r._hasOutline()?-1:14),p(),T("mat-mdc-form-field-subscript-dynamic-size",r.subscriptSizing==="dynamic");let a=r._getSubscriptMessageType();p(),M((o=a)==="error"?16:o==="hint"?17:-1)}},dependencies:[WE,YE,Xl,qE,Kc],styles:[`.mdc-text-field {
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
`],encapsulation:2})}return t})();var dn=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ps,Wn,ge]})}return t})();var KE=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["ng-component"]],hostAttrs:["cdk-text-field-style-loader",""],decls:0,vars:0,template:function(i,r){},styles:[`textarea.cdk-textarea-autosize {
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
`],encapsulation:2})}return t})(),Y2={passive:!0},JE=(()=>{class t{_platform=c(ye);_ngZone=c(U);_renderer=c(Mt).createRenderer(null,null);_styleLoader=c(Je);_monitoredElements=new Map;monitor(e){if(!this._platform.isBrowser)return at;this._styleLoader.load(KE);let i=sn(e),r=this._monitoredElements.get(i);if(r)return r.subject;let o=new I,a="cdk-text-field-autofilled",s=d=>{d.animationName==="cdk-text-field-autofill-start"&&!i.classList.contains(a)?(i.classList.add(a),this._ngZone.run(()=>o.next({target:d.target,isAutofilled:!0}))):d.animationName==="cdk-text-field-autofill-end"&&i.classList.contains(a)&&(i.classList.remove(a),this._ngZone.run(()=>o.next({target:d.target,isAutofilled:!1})))},l=this._ngZone.runOutsideAngular(()=>(i.classList.add("cdk-text-field-autofill-monitored"),this._renderer.listen(i,"animationstart",s,Y2)));return this._monitoredElements.set(i,{subject:o,unlisten:l}),o}stopMonitoring(e){let i=sn(e),r=this._monitoredElements.get(i);r&&(r.unlisten(),r.subject.complete(),i.classList.remove("cdk-text-field-autofill-monitored"),i.classList.remove("cdk-text-field-autofilled"),this._monitoredElements.delete(i))}ngOnDestroy(){this._monitoredElements.forEach((e,i)=>this.stopMonitoring(i))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var eM=(()=>{class t{_elementRef=c(F);_platform=c(ye);_ngZone=c(U);_renderer=c(Se);_resizeEvents=new I;_previousValue;_initialHeight;_destroyed=new I;_listenerCleanups;_minRows;_maxRows;_enabled=!0;_previousMinRows=-1;_textareaElement;get minRows(){return this._minRows}set minRows(e){this._minRows=Vt(e),this._setMinHeight()}get maxRows(){return this._maxRows}set maxRows(e){this._maxRows=Vt(e),this._setMaxHeight()}get enabled(){return this._enabled}set enabled(e){this._enabled!==e&&((this._enabled=e)?this.resizeToFitContent(!0):this.reset())}get placeholder(){return this._textareaElement.placeholder}set placeholder(e){this._cachedPlaceholderHeight=void 0,e?this._textareaElement.setAttribute("placeholder",e):this._textareaElement.removeAttribute("placeholder"),this._cacheTextareaPlaceholderHeight()}_cachedLineHeight;_cachedPlaceholderHeight;_document=c(K);_hasFocus=!1;_isViewInited=!1;constructor(){c(Je).load(KE),this._textareaElement=this._elementRef.nativeElement}_setMinHeight(){let e=this.minRows&&this._cachedLineHeight?`${this.minRows*this._cachedLineHeight}px`:null;e&&(this._textareaElement.style.minHeight=e)}_setMaxHeight(){let e=this.maxRows&&this._cachedLineHeight?`${this.maxRows*this._cachedLineHeight}px`:null;e&&(this._textareaElement.style.maxHeight=e)}ngAfterViewInit(){this._platform.isBrowser&&(this._initialHeight=this._textareaElement.style.height,this.resizeToFitContent(),this._ngZone.runOutsideAngular(()=>{this._listenerCleanups=[this._renderer.listen("window","resize",()=>this._resizeEvents.next()),this._renderer.listen(this._textareaElement,"focus",this._handleFocusEvent),this._renderer.listen(this._textareaElement,"blur",this._handleFocusEvent)],this._resizeEvents.pipe(ma(16)).subscribe(()=>{this._cachedLineHeight=this._cachedPlaceholderHeight=void 0,this.resizeToFitContent(!0)})}),this._isViewInited=!0,this.resizeToFitContent(!0))}ngOnDestroy(){this._listenerCleanups?.forEach(e=>e()),this._resizeEvents.complete(),this._destroyed.next(),this._destroyed.complete()}_cacheTextareaLineHeight(){if(this._cachedLineHeight)return;let e=this._textareaElement.cloneNode(!1),i=e.style;e.rows=1,i.position="absolute",i.visibility="hidden",i.border="none",i.padding="0",i.height="",i.minHeight="",i.maxHeight="",i.top=i.bottom=i.left=i.right="auto",i.overflow="hidden",this._textareaElement.parentNode.appendChild(e),this._cachedLineHeight=e.clientHeight,e.remove(),this._setMinHeight(),this._setMaxHeight()}_measureScrollHeight(){let e=this._textareaElement,i=e.style.marginBottom||"",r=this._platform.FIREFOX,o=this._hasFocus,a=r?"cdk-textarea-autosize-measuring-firefox":"cdk-textarea-autosize-measuring";o&&(e.style.marginBottom=`${e.clientHeight}px`),e.classList.add(a);let s=e.scrollHeight-4;return e.classList.remove(a),o&&(e.style.marginBottom=i),s}_cacheTextareaPlaceholderHeight(){if(!this._isViewInited||this._cachedPlaceholderHeight!=null)return;if(!this.placeholder){this._cachedPlaceholderHeight=0;return}let e=this._textareaElement.value;this._textareaElement.value=this._textareaElement.placeholder,this._cachedPlaceholderHeight=this._measureScrollHeight(),this._textareaElement.value=e}_handleFocusEvent=e=>{this._hasFocus=e.type==="focus"};ngDoCheck(){this._platform.isBrowser&&this.resizeToFitContent()}resizeToFitContent(e=!1){if(!this._enabled||(this._cacheTextareaLineHeight(),this._cacheTextareaPlaceholderHeight(),!this._cachedLineHeight))return;let i=this._elementRef.nativeElement,r=i.value;if(!e&&this._minRows===this._previousMinRows&&r===this._previousValue)return;let o=this._measureScrollHeight(),a=Math.max(o,this._cachedPlaceholderHeight||0);i.style.height=`${a}px`,this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame<"u"?requestAnimationFrame(()=>this._scrollToCaretPosition(i)):setTimeout(()=>this._scrollToCaretPosition(i))}),this._previousValue=r,this._previousMinRows=this._minRows}reset(){this._initialHeight!==void 0&&(this._textareaElement.style.height=this._initialHeight)}_noopInputHandler(){}_scrollToCaretPosition(e){let{selectionStart:i,selectionEnd:r}=e;!this._destroyed.isStopped&&this._hasFocus&&e.setSelectionRange(i,r)}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["textarea","cdkTextareaAutosize",""]],hostAttrs:["rows","1",1,"cdk-textarea-autosize"],hostBindings:function(i,r){i&1&&w("input",function(){return r._noopInputHandler()})},inputs:{minRows:[0,"cdkAutosizeMinRows","minRows"],maxRows:[0,"cdkAutosizeMaxRows","maxRows"],enabled:[2,"cdkTextareaAutosize","enabled",G],placeholder:"placeholder"},exportAs:["cdkTextareaAutosize"]})}return t})(),$f=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();var Wf=new C("");var tM=new C("MAT_INPUT_VALUE_ACCESSOR");var Gf=(()=>{class t{isErrorState(e,i){return!!(e&&e.invalid&&(e.touched||i&&i.submitted))}isSignalErrorState(e){if(!e)return!1;let i=e().invalid(),r=e().touched();return i&&r}static \u0275fac=function(i){return new(i||t)};static \u0275prov=W({token:t,factory:t.\u0275fac})}return t})();var js=class{_defaultMatcher;_parentFormGroup;_parentForm;_stateChanges;errorState=!1;matcher;ngControl;formField;constructor(n,e,i,r,o){this._defaultMatcher=n,this._parentFormGroup=i,this._parentForm=r,this._stateChanges=o,e?yn(e.field)&&!e.updateValueAndValidity?(this.formField=e,this.ngControl=null):(this.formField=null,this.ngControl=e):this.ngControl=this.formField=null}updateErrorState(){let n=this.errorState,e=this._getCurrentErrorState(this.matcher||this._defaultMatcher);e!==n&&(this.errorState=e,this._stateChanges.next())}_getCurrentErrorState(n){if(this.formField&&n?.isSignalErrorState)return n.isSignalErrorState(this.formField.field())??!1;let e=this._parentFormGroup||this._parentForm,i=this.ngControl?this.ngControl.control:null;return n?.isErrorState(i,e)??!1}};var Q2=["button","checkbox","file","hidden","image","radio","range","reset","submit"],X2=new C("MAT_INPUT_CONFIG"),Yr=(()=>{class t{_elementRef=c(F);_platform=c(ye);ngControl=c(Bn,{optional:!0,self:!0});_autofillMonitor=c(JE);_ngZone=c(U);_formField=c(ed,{optional:!0});_renderer=c(Se);_uid=c(Ue).getId("mat-input-");_previousNativeValue;_inputValueAccessor;_signalBasedValueAccessor;_previousPlaceholder=null;_errorStateTracker;_config=c(X2,{optional:!0});_cleanupIosKeyup;_cleanupWebkitWheel;_isServer=!1;_isNativeSelect=!1;_isTextarea=!1;_isInFormField=!1;focused=!1;stateChanges=new I;controlType="mat-input";autofilled=!1;get disabled(){return this._disabled}set disabled(e){this._disabled=lt(e),this.focused&&(this.focused=!1,this.stateChanges.next())}_disabled=!1;get id(){return this._id}set id(e){this._id=e||this._uid}_id;placeholder;name;get required(){return this._required??this.ngControl?.control?.hasValidator(Qo.required)??!1}set required(e){this._required=lt(e)}_required;get type(){return this._type}set type(e){this._type=e||"text",this._validateType(),!this._isTextarea&&Av().has(this._type)&&(this._elementRef.nativeElement.type=this._type)}_type="text";get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}userAriaDescribedBy;get value(){return this._signalBasedValueAccessor?this._signalBasedValueAccessor.value():this._inputValueAccessor.value}set value(e){e!==this.value&&(this._signalBasedValueAccessor?this._signalBasedValueAccessor.value.set(e):this._inputValueAccessor.value=e,this.stateChanges.next())}get readonly(){return this._readonly}set readonly(e){this._readonly=lt(e)}_readonly=!1;disabledInteractive;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}_neverEmptyInputTypes=["date","datetime","datetime-local","month","time","week"].filter(e=>Av().has(e));constructor(){let e=c($c,{optional:!0}),i=c(Wc,{optional:!0}),r=c(Gf),o=c(tM,{optional:!0,self:!0}),a=c(Wf,{optional:!0,self:!0}),s=this._elementRef.nativeElement,l=s.nodeName.toLowerCase();o?yn(o.value)?this._signalBasedValueAccessor=o:this._inputValueAccessor=o:this._inputValueAccessor=s,this._previousNativeValue=this.value,this.id=this.id,this._platform.IOS&&this._ngZone.runOutsideAngular(()=>{this._cleanupIosKeyup=this._renderer.listen(s,"keyup",this._iOSKeyupListener)}),this._errorStateTracker=new js(r,a||this.ngControl,i,e,this.stateChanges),this._isServer=!this._platform.isBrowser,this._isNativeSelect=l==="select",this._isTextarea=l==="textarea",this._isInFormField=!!this._formField,this.disabledInteractive=this._config?.disabledInteractive||!1,this._isNativeSelect&&(this.controlType=s.multiple?"mat-native-select-multiple":"mat-native-select"),this._signalBasedValueAccessor&&vt(()=>{this._signalBasedValueAccessor.value(),this.stateChanges.next()})}ngAfterViewInit(){this._platform.isBrowser&&this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(e=>{this.autofilled=e.isAutofilled,this.stateChanges.next()})}ngOnChanges(){this.stateChanges.next()}ngOnDestroy(){this.stateChanges.complete(),this._platform.isBrowser&&this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),this._cleanupIosKeyup?.(),this._cleanupWebkitWheel?.()}ngDoCheck(){this.ngControl&&(this.updateErrorState(),this.ngControl.disabled!==null&&this.ngControl.disabled!==this.disabled&&(this.disabled=this.ngControl.disabled,this.stateChanges.next())),this._dirtyCheckNativeValue(),this._dirtyCheckPlaceholder()}focus(e){this._elementRef.nativeElement.focus(e)}updateErrorState(){this._errorStateTracker.updateErrorState()}_focusChanged(e){if(e!==this.focused){if(!this._isNativeSelect&&e&&this.disabled&&this.disabledInteractive){let i=this._elementRef.nativeElement;i.type==="number"?(i.type="text",i.setSelectionRange(0,0),i.type="number"):i.setSelectionRange(0,0)}this.focused=e,this.stateChanges.next()}}_onInput(){}_dirtyCheckNativeValue(){let e=this._elementRef.nativeElement.value;this._previousNativeValue!==e&&(this._previousNativeValue=e,this.stateChanges.next())}_dirtyCheckPlaceholder(){let e=this._getPlaceholder();if(e!==this._previousPlaceholder){let i=this._elementRef.nativeElement;this._previousPlaceholder=e,e?i.setAttribute("placeholder",e):i.removeAttribute("placeholder")}}_getPlaceholder(){return this.placeholder||null}_validateType(){Q2.indexOf(this._type)>-1}_isNeverEmpty(){return this._neverEmptyInputTypes.indexOf(this._type)>-1}_isBadInput(){let e=this._elementRef.nativeElement.validity;return e&&e.badInput}get empty(){return!this._isNeverEmpty()&&!this._elementRef.nativeElement.value&&!this._isBadInput()&&!this.autofilled}get shouldLabelFloat(){if(this._isNativeSelect){let e=this._elementRef.nativeElement,i=e.options[0];return this.focused||e.multiple||!this.empty||!!(e.selectedIndex>-1&&i&&i.label)}else return this.focused&&!this.disabled||!this.empty}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let i=this._elementRef.nativeElement;e.length?i.setAttribute("aria-describedby",e.join(" ")):i.removeAttribute("aria-describedby")}onContainerClick(){this.focused||this.focus()}_isInlineSelect(){let e=this._elementRef.nativeElement;return this._isNativeSelect&&(e.multiple||e.size>1)}_iOSKeyupListener=e=>{let i=e.target;!i.value&&i.selectionStart===0&&i.selectionEnd===0&&(i.setSelectionRange(1,1),i.setSelectionRange(0,0))};_getReadonlyAttribute(){return this._isNativeSelect?null:this.readonly||this.disabled&&this.disabledInteractive?"true":null}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["input","matInput",""],["textarea","matInput",""],["select","matNativeControl",""],["input","matNativeControl",""],["textarea","matNativeControl",""]],hostAttrs:[1,"mat-mdc-input-element"],hostVars:21,hostBindings:function(i,r){i&1&&w("focus",function(){return r._focusChanged(!0)})("blur",function(){return r._focusChanged(!1)})("input",function(){return r._onInput()}),i&2&&(Wt("id",r.id)("disabled",r.disabled&&!r.disabledInteractive)("required",r.required),L("name",r.name||null)("readonly",r._getReadonlyAttribute())("aria-disabled",r.disabled&&r.disabledInteractive?"true":null)("aria-invalid",r.empty&&r.required?null:r.errorState)("aria-required",r.required)("id",r.id),T("mat-input-server",r._isServer)("mat-mdc-form-field-textarea-control",r._isInFormField&&r._isTextarea)("mat-mdc-form-field-input-control",r._isInFormField)("mat-mdc-input-disabled-interactive",r.disabledInteractive)("mdc-text-field__input",r._isInFormField)("mat-mdc-native-select-inline",r._isInlineSelect()))},inputs:{disabled:"disabled",id:"id",placeholder:"placeholder",name:"name",required:"required",type:"type",errorStateMatcher:"errorStateMatcher",userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],value:"value",readonly:"readonly",disabledInteractive:[2,"disabledInteractive","disabledInteractive",G]},exportAs:["matInput"],features:[Ne([{provide:Jc,useExisting:t}]),Ae]})}return t})(),Zr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[dn,dn,$f,ge]})}return t})();function K2(t,n){t&1&&xt(0,"div",2)}var J2=new C("MAT_PROGRESS_BAR_DEFAULT_OPTIONS");var Yf=(()=>{class t{_elementRef=c(F);_ngZone=c(U);_changeDetectorRef=c(Me);_renderer=c(Se);_cleanupTransitionEnd;constructor(){let e=kc(),i=c(J2,{optional:!0});this._isNoopAnimation=e==="di-disabled",e==="reduced-motion"&&this._elementRef.nativeElement.classList.add("mat-progress-bar-reduced-motion"),i&&(i.color&&(this.color=this._defaultColor=i.color),this.mode=i.mode||this.mode)}_isNoopAnimation;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor="primary";get value(){return this._value}set value(e){this._value=nM(e||0),this._changeDetectorRef.markForCheck()}_value=0;get bufferValue(){return this._bufferValue||0}set bufferValue(e){this._bufferValue=nM(e||0),this._changeDetectorRef.markForCheck()}_bufferValue=0;animationEnd=new O;get mode(){return this._mode}set mode(e){this._mode=e,this._changeDetectorRef.markForCheck()}_mode="determinate";ngAfterViewInit(){this._ngZone.runOutsideAngular(()=>{this._cleanupTransitionEnd=this._renderer.listen(this._elementRef.nativeElement,"transitionend",this._transitionendHandler)})}ngOnDestroy(){this._cleanupTransitionEnd?.()}_getPrimaryBarTransform(){return`scaleX(${this._isIndeterminate()?1:this.value/100})`}_getBufferBarFlexBasis(){return`${this.mode==="buffer"?this.bufferValue:100}%`}_isIndeterminate(){return this.mode==="indeterminate"||this.mode==="query"}_transitionendHandler=e=>{this.animationEnd.observers.length===0||!e.target||!e.target.classList.contains("mdc-linear-progress__primary-bar")||(this.mode==="determinate"||this.mode==="buffer")&&this._ngZone.run(()=>this.animationEnd.next({value:this.value}))};static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-progress-bar"]],hostAttrs:["role","progressbar","aria-valuemin","0","aria-valuemax","100","tabindex","-1",1,"mat-mdc-progress-bar","mdc-linear-progress"],hostVars:10,hostBindings:function(i,r){i&2&&(L("aria-valuenow",r._isIndeterminate()?null:r.value)("mode",r.mode),Ke("mat-"+r.color),T("_mat-animation-noopable",r._isNoopAnimation)("mdc-linear-progress--animation-ready",!r._isNoopAnimation)("mdc-linear-progress--indeterminate",r._isIndeterminate()))},inputs:{color:"color",value:[2,"value","value",Nt],bufferValue:[2,"bufferValue","bufferValue",Nt],mode:"mode"},outputs:{animationEnd:"animationEnd"},exportAs:["matProgressBar"],decls:7,vars:5,consts:[["aria-hidden","true",1,"mdc-linear-progress__buffer"],[1,"mdc-linear-progress__buffer-bar"],[1,"mdc-linear-progress__buffer-dots"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__primary-bar"],[1,"mdc-linear-progress__bar-inner"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__secondary-bar"]],template:function(i,r){i&1&&(je(0,"div",0),xt(1,"div",1),E(2,K2,1,0,"div",2),Ze(),je(3,"div",3),xt(4,"span",4),Ze(),je(5,"div",5),xt(6,"span",4),Ze()),i&2&&(p(),Lt("flex-basis",r._getBufferBarFlexBasis()),p(),M(r.mode==="buffer"?2:-1),p(),Lt("transform",r._getPrimaryBarTransform()))},styles:[`.mat-mdc-progress-bar {
  --%NS%mat-progress-bar-animation-multiplier: 1;
  display: block;
  text-align: start;
}
.mat-mdc-progress-bar[mode=query] {
  transform: scaleX(-1);
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-dots,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__secondary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__bar-inner.mdc-linear-progress__bar-inner {
  animation: none;
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-bar {
  transition: transform 1ms;
}

.mat-progress-bar-reduced-motion {
  --%NS%mat-progress-bar-animation-multiplier: 2;
}

.mdc-linear-progress {
  position: relative;
  width: 100%;
  transform: translateZ(0);
  outline: 1px solid transparent;
  overflow-x: hidden;
  transition: opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: max(var(--%NS%mat-progress-bar-track-height, 4px), var(--%NS%mat-progress-bar-active-indicator-height, 4px));
}
@media (forced-colors: active) {
  .mdc-linear-progress {
    outline-color: CanvasText;
  }
}

.mdc-linear-progress__bar {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  animation: none;
  transform-origin: top left;
  transition: transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: var(--%NS%mat-progress-bar-active-indicator-height, 4px);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__bar {
  transition: none;
}
[dir=rtl] .mdc-linear-progress__bar {
  right: 0;
  transform-origin: center right;
}

.mdc-linear-progress__bar-inner {
  display: inline-block;
  position: absolute;
  width: 100%;
  animation: none;
  border-top-style: solid;
  border-color: var(--%NS%mat-progress-bar-active-indicator-color, var(--%NS%mat-sys-primary));
  border-top-width: var(--%NS%mat-progress-bar-active-indicator-height, 4px);
}

.mdc-linear-progress__buffer {
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  overflow: hidden;
  height: var(--%NS%mat-progress-bar-track-height, 4px);
  border-radius: var(--%NS%mat-progress-bar-track-shape, var(--%NS%mat-sys-corner-none));
}

.mdc-linear-progress__buffer-dots {
  background-image: radial-gradient(circle, var(--%NS%mat-progress-bar-track-color, var(--%NS%mat-sys-surface-variant)) calc(var(--%NS%mat-progress-bar-track-height, 4px) / 2), transparent 0);
  background-repeat: repeat-x;
  background-size: calc(calc(var(--%NS%mat-progress-bar-track-height, 4px) / 2) * 5);
  background-position: left;
  flex: auto;
  transform: rotate(180deg);
  animation: mdc-linear-progress-buffering calc(250ms * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
@media (forced-colors: active) {
  .mdc-linear-progress__buffer-dots {
    background-color: ButtonBorder;
  }
}
[dir=rtl] .mdc-linear-progress__buffer-dots {
  animation: mdc-linear-progress-buffering-reverse calc(250ms * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
  transform: rotate(0);
}

.mdc-linear-progress__buffer-bar {
  flex: 0 1 100%;
  transition: flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  background-color: var(--%NS%mat-progress-bar-track-color, var(--%NS%mat-sys-surface-variant));
}

.mdc-linear-progress__primary-bar {
  transform: scaleX(0);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  left: -145.166611%;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation: mdc-linear-progress-primary-indeterminate-translate calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-primary-indeterminate-scale calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation-name: mdc-linear-progress-primary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  right: -145.166611%;
  left: auto;
}

.mdc-linear-progress__secondary-bar {
  display: none;
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  left: -54.888891%;
  display: block;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation: mdc-linear-progress-secondary-indeterminate-translate calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-secondary-indeterminate-scale calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation-name: mdc-linear-progress-secondary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  right: -54.888891%;
  left: auto;
}

@keyframes mdc-linear-progress-buffering {
  from {
    transform: rotate(180deg) translateX(calc(var(--%NS%mat-progress-bar-track-height, 4px) * -2.5));
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(83.67142%);
  }
  100% {
    transform: translateX(200.611057%);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-scale {
  0% {
    transform: scaleX(0.08);
  }
  36.65% {
    animation-timing-function: cubic-bezier(0.334731, 0.12482, 0.785844, 1);
    transform: scaleX(0.08);
  }
  69.15% {
    animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);
    transform: scaleX(0.661479);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(84.386165%);
  }
  100% {
    transform: translateX(160.277782%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-scale {
  0% {
    animation-timing-function: cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);
    transform: scaleX(0.08);
  }
  19.15% {
    animation-timing-function: cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);
    transform: scaleX(0.457104);
  }
  44.15% {
    animation-timing-function: cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);
    transform: scaleX(0.72796);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(-83.67142%);
  }
  100% {
    transform: translateX(-200.611057%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(-37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(-84.386165%);
  }
  100% {
    transform: translateX(-160.277782%);
  }
}
@keyframes mdc-linear-progress-buffering-reverse {
  from {
    transform: translateX(-10px);
  }
}
`],encapsulation:2})}return t})();function nM(t,n=0,e=100){return Math.max(n,Math.min(e,t))}var Zf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ge]})}return t})();var gb=["*"];function ej(t,n){t&1&&B(0)}var tj=["tabListContainer"],nj=["tabList"],ij=["tabListInner"],rj=["nextPaginator"],oj=["previousPaginator"],aj=["content"];function sj(t,n){}var lj=["tabBodyWrapper"],cj=["tabHeader"];function dj(t,n){}function uj(t,n){if(t&1&&yt(0,dj,0,0,"ng-template",12),t&2){let e=y().$implicit;N("cdkPortalOutlet",e.templateLabel)}}function mj(t,n){if(t&1&&g(0),t&2){let e=y().$implicit;k(e.textLabel)}}function fj(t,n){if(t&1){let e=ae();m(0,"div",7,2),w("click",function(){let r=q(e),o=r.$implicit,a=r.$index,s=y(),l=rt(1);return Y(s._handleClick(o,l,a))})("cdkFocusChange",function(r){let o=q(e).$index,a=y();return Y(a._tabFocusChanged(r,o))}),j(2,"span",8)(3,"div",9),m(4,"span",10)(5,"span",11),E(6,uj,1,1,null,12)(7,mj,1,1),f()()()}if(t&2){let e=n.$implicit,i=n.$index,r=rt(1),o=y();Ke(e.labelClass),T("mdc-tab--active",o.selectedIndex===i),N("id",o._getTabLabelId(e,i))("disabled",e.disabled)("fitInkBarToContent",o.fitInkBarToContent),L("tabIndex",o._getTabIndex(i))("aria-posinset",i+1)("aria-setsize",o._tabs.length)("aria-controls",o._getTabContentId(i))("aria-selected",o.selectedIndex===i)("aria-label",e.ariaLabel||null)("aria-labelledby",!e.ariaLabel&&e.ariaLabelledby?e.ariaLabelledby:null),p(3),N("matRippleTrigger",r)("matRippleDisabled",e.disabled||o.disableRipple),p(3),M(e.templateLabel?6:7)}}function hj(t,n){t&1&&B(0)}function pj(t,n){if(t&1){let e=ae();m(0,"mat-tab-body",13),w("_onCentered",function(){q(e);let r=y();return Y(r._removeTabBodyWrapperHeight())})("_onCentering",function(r){q(e);let o=y();return Y(o._setTabBodyWrapperHeight(r))})("_beforeCentering",function(r){q(e);let o=y();return Y(o._bodyCentered(r))}),f()}if(t&2){let e=n.$implicit,i=n.$index,r=y();Ke(e.bodyClass),N("id",r._getTabContentId(i))("content",e.content)("position",e.position)("animationDuration",r._bodyAnimationDuration)("preserveContent",r.preserveContent),L("tabindex",r.contentTabIndex!=null&&r.selectedIndex===i?r.contentTabIndex:null)("aria-labelledby",r._getTabLabelId(e,i))("aria-hidden",r.selectedIndex!==i)}}var gj=new C("MatTabContent"),_j=(()=>{class t{template=c(bt);static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","matTabContent",""]],features:[Ne([{provide:gj,useExisting:t}])]})}return t})(),vj=new C("MatTabLabel"),sM=new C("MAT_TAB"),bj=(()=>{class t extends hE{_closestTab=c(sM,{optional:!0});static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","mat-tab-label",""],["","matTabLabel",""]],features:[Ne([{provide:vj,useExisting:t}]),pe]})}return t})(),lM=new C("MAT_TAB_GROUP"),_b=(()=>{class t{_viewContainerRef=c(ht);_closestTabGroup=c(lM,{optional:!0});disabled=!1;get templateLabel(){return this._templateLabel}set templateLabel(e){this._setTemplateLabelInput(e)}_templateLabel;_explicitContent=void 0;_implicitContent;textLabel="";ariaLabel;ariaLabelledby;labelClass;bodyClass;id=null;_contentPortal=null;get content(){return this._contentPortal}_stateChanges=new I;position=null;origin=null;isActive=!1;constructor(){c(Je).load(pn)}ngOnChanges(e){(e.hasOwnProperty("textLabel")||e.hasOwnProperty("disabled"))&&this._stateChanges.next()}ngOnDestroy(){this._stateChanges.complete()}ngOnInit(){this._contentPortal=new cn(this._explicitContent||this._implicitContent,this._viewContainerRef)}_setTemplateLabelInput(e){e&&e._closestTab===this&&(this._templateLabel=e)}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-tab"]],contentQueries:function(i,r,o){if(i&1&&ct(o,bj,5)(o,_j,7,bt),i&2){let a;z(a=$())&&(r.templateLabel=a.first),z(a=$())&&(r._explicitContent=a.first)}},viewQuery:function(i,r){if(i&1&&Re(bt,7),i&2){let o;z(o=$())&&(r._implicitContent=o.first)}},hostAttrs:["hidden",""],hostVars:1,hostBindings:function(i,r){i&2&&L("id",null)},inputs:{disabled:[2,"disabled","disabled",G],textLabel:[0,"label","textLabel"],ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],labelClass:"labelClass",bodyClass:"bodyClass",id:"id"},exportAs:["matTab"],features:[Ne([{provide:sM,useExisting:t}]),Ae],ngContentSelectors:gb,decls:1,vars:0,template:function(i,r){i&1&&(_e(),La(0,ej,1,0,"ng-template"))},encapsulation:2,changeDetection:1})}return t})(),ub="mdc-tab-indicator--active",rM="mdc-tab-indicator--no-transition",fb=class{_items;_currentItem;constructor(n){this._items=n}hide(){this._items.forEach(n=>n.deactivateInkBar()),this._currentItem=void 0}alignToElement(n){let e=this._items.find(r=>r.elementRef.nativeElement===n),i=this._currentItem;if(e!==i&&(i?.deactivateInkBar(),e)){let r=i?.elementRef.nativeElement.getBoundingClientRect?.();e.activateInkBar(r),this._currentItem=e}}},yj=(()=>{class t{_elementRef=c(F);_inkBarElement=null;_inkBarContentElement=null;_fitToContent=!1;get fitInkBarToContent(){return this._fitToContent}set fitInkBarToContent(e){this._fitToContent!==e&&(this._fitToContent=e,this._inkBarElement&&this._appendInkBarElement())}activateInkBar(e){let i=this._elementRef.nativeElement;if(!e||!i.getBoundingClientRect||!this._inkBarContentElement){i.classList.add(ub);return}let r=i.getBoundingClientRect(),o=e.width/r.width,a=e.left-r.left;i.classList.add(rM),this._inkBarContentElement.style.setProperty("transform",`translateX(${a}px) scaleX(${o})`),i.getBoundingClientRect(),i.classList.remove(rM),i.classList.add(ub),this._inkBarContentElement.style.setProperty("transform","")}deactivateInkBar(){this._elementRef.nativeElement.classList.remove(ub)}ngOnInit(){this._createInkBarElement()}ngOnDestroy(){this._inkBarElement?.remove(),this._inkBarElement=this._inkBarContentElement=null}_createInkBarElement(){let e=this._elementRef.nativeElement.ownerDocument||document,i=this._inkBarElement=e.createElement("span"),r=this._inkBarContentElement=e.createElement("span");i.className="mdc-tab-indicator",r.className="mdc-tab-indicator__content mdc-tab-indicator__content--underline",i.appendChild(this._inkBarContentElement),this._appendInkBarElement()}_appendInkBarElement(){this._inkBarElement;let e=this._fitToContent?this._elementRef.nativeElement.querySelector(".mdc-tab__content"):this._elementRef.nativeElement;e.appendChild(this._inkBarElement)}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,inputs:{fitInkBarToContent:[2,"fitInkBarToContent","fitInkBarToContent",G]}})}return t})();var cM=(()=>{class t extends yj{elementRef=c(F);disabled=!1;focus(){this.elementRef.nativeElement.focus()}getOffsetLeft(){return this.elementRef.nativeElement.offsetLeft}getOffsetWidth(){return this.elementRef.nativeElement.offsetWidth}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","matTabLabelWrapper",""]],hostVars:3,hostBindings:function(i,r){i&2&&(L("aria-disabled",!!r.disabled),T("mat-mdc-tab-disabled",r.disabled))},inputs:{disabled:[2,"disabled","disabled",G]},features:[pe]})}return t})(),oM={passive:!0},Cj=650,wj=100;function mb(t){let n=t+"";return/^[0-9]+(?:\.[0-9]+)?$/.test(n)?`${t}ms`:/^[0-9]+(?:\.[0-9]+)?(?:ms|s)$/.test(n)?n:""}var Sj=(()=>{class t{_elementRef=c(F);_changeDetectorRef=c(Me);_viewportRuler=c(Mn);_dir=c(wt,{optional:!0});_ngZone=c(U);_platform=c(ye);_sharedResizeObserver=c(Uf);_injector=c(X);_renderer=c(Se);_animationsDisabled=Te();_eventCleanups;_scrollDistance=0;_selectedIndexChanged=!1;_destroyed=new I;_showPaginationControls=!1;_disableScrollAfter=!0;_disableScrollBefore=!0;_tabLabelCount;_scrollDistanceChanged=!1;_keyManager;_currentTextContent;_stopScrolling=new I;disablePagination=!1;get selectedIndex(){return this._selectedIndex}set selectedIndex(e){let i=isNaN(e)?0:e;this._selectedIndex!=i&&(this._selectedIndexChanged=!0,this._selectedIndex=i,this._keyManager&&this._keyManager.updateActiveItem(i))}_selectedIndex=0;selectFocusedIndex=new O;indexFocused=new O;constructor(){this._eventCleanups=this._ngZone.runOutsideAngular(()=>[this._renderer.listen(this._elementRef.nativeElement,"mouseleave",()=>this._stopInterval())])}ngAfterViewInit(){this._eventCleanups.push(this._renderer.listen(this._previousPaginator.nativeElement,"touchstart",()=>this._handlePaginatorPress("before"),oM),this._renderer.listen(this._nextPaginator.nativeElement,"touchstart",()=>this._handlePaginatorPress("after"),oM))}ngAfterContentInit(){let e=this._dir?this._dir.change:ne("ltr"),i=this._sharedResizeObserver.observe(this._elementRef.nativeElement).pipe(Zn(32),he(this._destroyed)),r=this._viewportRuler.change(150).pipe(he(this._destroyed)),o=()=>{this.updatePagination(),this._alignInkBarToSelectedTab()};this._keyManager=new Fr(this._items).withHorizontalOrientation(this._getLayoutDirection()).withHomeAndEnd().withWrap().skipPredicate(()=>!1),this._keyManager.updateActiveItem(Math.max(this._selectedIndex,0)),tt(o,{injector:this._injector}),mt(e,r,i,this._items.changes,this._itemsResized()).pipe(he(this._destroyed)).subscribe(()=>{this._ngZone.run(()=>{Promise.resolve().then(()=>{this._scrollDistance=Math.max(0,Math.min(this._getMaxScrollDistance(),this._scrollDistance)),o()})}),this._keyManager?.withHorizontalOrientation(this._getLayoutDirection())}),this._keyManager.change.subscribe(a=>{this.indexFocused.emit(a),this._setTabFocus(a)})}_itemsResized(){return typeof ResizeObserver!="function"?at:this._items.changes.pipe(qe(this._items),gt(e=>new le(i=>this._ngZone.runOutsideAngular(()=>{let r=new ResizeObserver(o=>i.next(o));return e.forEach(o=>r.observe(o.elementRef.nativeElement)),()=>{r.disconnect()}}))),co(1),ue(e=>e.some(i=>i.contentRect.width>0&&i.contentRect.height>0)))}ngAfterContentChecked(){this._tabLabelCount!=this._items.length&&(this.updatePagination(),this._tabLabelCount=this._items.length,this._changeDetectorRef.markForCheck()),this._selectedIndexChanged&&(this._scrollToLabel(this._selectedIndex),this._checkScrollingControls(),this._alignInkBarToSelectedTab(),this._selectedIndexChanged=!1,this._changeDetectorRef.markForCheck()),this._scrollDistanceChanged&&(this._updateTabScrollPosition(),this._scrollDistanceChanged=!1,this._changeDetectorRef.markForCheck())}ngOnDestroy(){this._eventCleanups.forEach(e=>e()),this._keyManager?.destroy(),this._destroyed.next(),this._destroyed.complete(),this._stopScrolling.complete()}_handleKeydown(e){if(!ut(e))switch(e.keyCode){case 13:case 32:if(this.focusIndex!==this.selectedIndex){let i=this._items.get(this.focusIndex);i&&!i.disabled&&(this.selectFocusedIndex.emit(this.focusIndex),this._itemSelected(e))}break;default:this._keyManager?.onKeydown(e)}}_onContentChanges(){let e=this._elementRef.nativeElement.textContent;e!==this._currentTextContent&&(this._currentTextContent=e||"",this._ngZone.run(()=>{this.updatePagination(),this._alignInkBarToSelectedTab(),this._changeDetectorRef.markForCheck()}))}updatePagination(){this._checkPaginationEnabled(),this._checkScrollingControls(),this._updateTabScrollPosition()}get focusIndex(){return this._keyManager?this._keyManager.activeItemIndex:0}set focusIndex(e){!this._isValidIndex(e)||this.focusIndex===e||!this._keyManager||this._keyManager.setActiveItem(e)}_isValidIndex(e){return this._items?!!this._items.toArray()[e]:!0}_setTabFocus(e){if(this._showPaginationControls&&this._scrollToLabel(e),this._items&&this._items.length){this._items.toArray()[e].focus();let i=this._tabListContainer.nativeElement;this._getLayoutDirection()=="ltr"?i.scrollLeft=0:i.scrollLeft=i.scrollWidth-i.offsetWidth}}_getLayoutDirection(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}_updateTabScrollPosition(){if(this.disablePagination)return;let e=this.scrollDistance,i=this._getLayoutDirection()==="ltr"?-e:e;this._tabList.nativeElement.style.transform=`translateX(${Math.round(i)}px)`,(this._platform.TRIDENT||this._platform.EDGE)&&(this._tabListContainer.nativeElement.scrollLeft=0)}get scrollDistance(){return this._scrollDistance}set scrollDistance(e){this._scrollTo(e)}_scrollHeader(e){let i=this._tabListContainer.nativeElement.offsetWidth,r=(e=="before"?-1:1)*i/3;return this._scrollTo(this._scrollDistance+r)}_handlePaginatorClick(e){this._stopInterval(),this._scrollHeader(e)}_scrollToLabel(e){if(this.disablePagination)return;let i=this._items?this._items.toArray()[e]:null;if(!i)return;let r=this._tabListContainer.nativeElement.offsetWidth,{offsetLeft:o,offsetWidth:a}=i.elementRef.nativeElement,s,l;this._getLayoutDirection()=="ltr"?(s=o,l=s+a):(l=this._tabListInner.nativeElement.offsetWidth-o,s=l-a);let d=this.scrollDistance,u=this.scrollDistance+r;s<d?this.scrollDistance-=d-s:l>u&&(this.scrollDistance+=Math.min(l-u,s-d))}_checkPaginationEnabled(){if(this.disablePagination)this._showPaginationControls=!1;else{let e=this._tabListInner.nativeElement.scrollWidth,i=this._elementRef.nativeElement.offsetWidth,r=e-i>=5;r||(this.scrollDistance=0),r!==this._showPaginationControls&&(this._showPaginationControls=r,this._changeDetectorRef.markForCheck())}}_checkScrollingControls(){this.disablePagination?this._disableScrollAfter=this._disableScrollBefore=!0:(this._disableScrollBefore=this.scrollDistance==0,this._disableScrollAfter=this.scrollDistance==this._getMaxScrollDistance(),this._changeDetectorRef.markForCheck())}_getMaxScrollDistance(){let e=this._tabListInner.nativeElement.scrollWidth,i=this._tabListContainer.nativeElement.offsetWidth;return e-i||0}_alignInkBarToSelectedTab(){let e=this._items&&this._items.length?this._items.toArray()[this.selectedIndex]:null,i=e?e.elementRef.nativeElement:null;i?this._inkBar.alignToElement(i):this._inkBar.hide()}_stopInterval(){this._stopScrolling.next()}_handlePaginatorPress(e,i){i&&i.button!=null&&i.button!==0||(this._stopInterval(),ao(Cj,wj).pipe(he(mt(this._stopScrolling,this._destroyed))).subscribe(()=>{let{maxScrollDistance:r,distance:o}=this._scrollHeader(e);(o===0||o>=r)&&this._stopInterval()}))}_scrollTo(e){if(this.disablePagination)return{maxScrollDistance:0,distance:0};let i=this._getMaxScrollDistance();return this._scrollDistance=Math.max(0,Math.min(i,e)),this._scrollDistanceChanged=!0,this._checkScrollingControls(),{maxScrollDistance:i,distance:this._scrollDistance}}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,inputs:{disablePagination:[2,"disablePagination","disablePagination",G],selectedIndex:[2,"selectedIndex","selectedIndex",Nt]},outputs:{selectFocusedIndex:"selectFocusedIndex",indexFocused:"indexFocused"}})}return t})(),xj=(()=>{class t extends Sj{_items;_tabListContainer;_tabList;_tabListInner;_nextPaginator;_previousPaginator;_inkBar;ariaLabel;ariaLabelledby;disableRipple=!1;ngAfterContentInit(){this._inkBar=new fb(this._items),super.ngAfterContentInit()}_itemSelected(e){e.preventDefault()}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275cmp=D({type:t,selectors:[["mat-tab-header"]],contentQueries:function(i,r,o){if(i&1&&ct(o,cM,4),i&2){let a;z(a=$())&&(r._items=a)}},viewQuery:function(i,r){if(i&1&&Re(tj,7)(nj,7)(ij,7)(rj,5)(oj,5),i&2){let o;z(o=$())&&(r._tabListContainer=o.first),z(o=$())&&(r._tabList=o.first),z(o=$())&&(r._tabListInner=o.first),z(o=$())&&(r._nextPaginator=o.first),z(o=$())&&(r._previousPaginator=o.first)}},hostAttrs:[1,"mat-mdc-tab-header"],hostVars:4,hostBindings:function(i,r){i&2&&T("mat-mdc-tab-header-pagination-controls-enabled",r._showPaginationControls)("mat-mdc-tab-header-rtl",r._getLayoutDirection()=="rtl")},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],disableRipple:[2,"disableRipple","disableRipple",G]},features:[pe],ngContentSelectors:gb,decls:13,vars:10,consts:[["previousPaginator",""],["tabListContainer",""],["tabList",""],["tabListInner",""],["nextPaginator",""],["mat-ripple","",1,"mat-mdc-tab-header-pagination","mat-mdc-tab-header-pagination-before",3,"click","mousedown","touchend","matRippleDisabled"],[1,"mat-mdc-tab-header-pagination-chevron"],[1,"mat-mdc-tab-label-container",3,"keydown"],["role","tablist",1,"mat-mdc-tab-list",3,"cdkObserveContent"],[1,"mat-mdc-tab-labels"],["mat-ripple","",1,"mat-mdc-tab-header-pagination","mat-mdc-tab-header-pagination-after",3,"mousedown","click","touchend","matRippleDisabled"]],template:function(i,r){i&1&&(_e(),m(0,"div",5,0),w("click",function(){return r._handlePaginatorClick("before")})("mousedown",function(a){return r._handlePaginatorPress("before",a)})("touchend",function(){return r._stopInterval()}),j(2,"div",6),f(),m(3,"div",7,1),w("keydown",function(a){return r._handleKeydown(a)}),m(5,"div",8,2),w("cdkObserveContent",function(){return r._onContentChanges()}),m(7,"div",9,3),B(9),f()()(),m(10,"div",10,4),w("mousedown",function(a){return r._handlePaginatorPress("after",a)})("click",function(){return r._handlePaginatorClick("after")})("touchend",function(){return r._stopInterval()}),j(12,"div",6),f()),i&2&&(T("mat-mdc-tab-header-pagination-disabled",r._disableScrollBefore),N("matRippleDisabled",r._disableScrollBefore||r.disableRipple),p(3),T("_mat-animation-noopable",r._animationsDisabled),p(2),L("aria-label",r.ariaLabel||null)("aria-labelledby",r.ariaLabelledby||null),p(5),T("mat-mdc-tab-header-pagination-disabled",r._disableScrollAfter),N("matRippleDisabled",r._disableScrollAfter||r.disableRipple))},dependencies:[tr,Ym],styles:[`.mat-mdc-tab-header {
  display: flex;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.mdc-tab-indicator .mdc-tab-indicator__content {
  transition-duration: var(--%NS%mat-tab-header-animation-duration, 250ms);
}

.mat-mdc-tab-header-pagination {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: none;
  justify-content: center;
  align-items: center;
  min-width: 32px;
  cursor: pointer;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
  box-sizing: content-box;
  outline: 0;
}
.mat-mdc-tab-header-pagination::-moz-focus-inner {
  border: 0;
}
.mat-mdc-tab-header-pagination .mat-ripple-element {
  opacity: 0.12;
  background-color: var(--%NS%mat-tab-inactive-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab-header-pagination-controls-enabled .mat-mdc-tab-header-pagination {
  display: flex;
}

.mat-mdc-tab-header-pagination-before,
.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after {
  padding-left: 4px;
}
.mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron {
  transform: rotate(-135deg);
}

.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before,
.mat-mdc-tab-header-pagination-after {
  padding-right: 4px;
}
.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron {
  transform: rotate(45deg);
}

.mat-mdc-tab-header-pagination-chevron {
  border-style: solid;
  border-width: 2px 2px 0 0;
  height: 8px;
  width: 8px;
  border-color: var(--%NS%mat-tab-pagination-icon-color, var(--%NS%mat-sys-on-surface));
}

.mat-mdc-tab-header-pagination-disabled {
  box-shadow: none;
  cursor: default;
  pointer-events: none;
}
.mat-mdc-tab-header-pagination-disabled .mat-mdc-tab-header-pagination-chevron {
  opacity: 0.4;
}

.mat-mdc-tab-list {
  flex-grow: 1;
  position: relative;
  transition: transform 500ms cubic-bezier(0.35, 0, 0.25, 1);
}
._mat-animation-noopable .mat-mdc-tab-list {
  transition: none;
}

.mat-mdc-tab-label-container {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  z-index: 1;
  border-bottom-style: solid;
  border-bottom-width: var(--%NS%mat-tab-divider-height, 1px);
  border-bottom-color: var(--%NS%mat-tab-divider-color, var(--%NS%mat-sys-surface-variant));
}
.mat-mdc-tab-group-inverted-header .mat-mdc-tab-label-container {
  border-bottom: none;
  border-top-style: solid;
  border-top-width: var(--%NS%mat-tab-divider-height, 1px);
  border-top-color: var(--%NS%mat-tab-divider-color, var(--%NS%mat-sys-surface-variant));
}

.mat-mdc-tab-labels {
  display: flex;
  flex: 1 0 auto;
}
[mat-align-tabs=center] > .mat-mdc-tab-header .mat-mdc-tab-labels {
  justify-content: center;
}
[mat-align-tabs=end] > .mat-mdc-tab-header .mat-mdc-tab-labels {
  justify-content: flex-end;
}
.cdk-drop-list .mat-mdc-tab-labels, .mat-mdc-tab-labels.cdk-drop-list {
  min-height: var(--%NS%mat-tab-container-height, 48px);
}

.mat-mdc-tab::before {
  margin: 5px;
}
@media (forced-colors: active) {
  .mat-mdc-tab[aria-disabled=true] {
    color: GrayText;
  }
}
`],encapsulation:2,changeDetection:1})}return t})(),Dj=new C("MAT_TABS_CONFIG"),aM=(()=>{class t extends Ti{_host=c(hb);_ngZone=c(U);_centeringSub=ce.EMPTY;_leavingSub=ce.EMPTY;ngOnInit(){super.ngOnInit(),this._centeringSub=this._host._beforeCentering.pipe(qe(this._host._isCenterPosition())).subscribe(e=>{this._host._content&&e&&!this.hasAttached()&&this._ngZone.run(()=>{Promise.resolve().then(),this.attach(this._host._content)})}),this._leavingSub=this._host._afterLeavingCenter.subscribe(()=>{this._host.preserveContent||this._ngZone.run(()=>this.detach())})}ngOnDestroy(){super.ngOnDestroy(),this._centeringSub.unsubscribe(),this._leavingSub.unsubscribe()}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ge(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","matTabBodyHost",""]],features:[pe]})}return t})(),hb=(()=>{class t{_elementRef=c(F);_dir=c(wt,{optional:!0});_ngZone=c(U);_injector=c(X);_renderer=c(Se);_diAnimationsDisabled=Te();_eventCleanups;_initialized=!1;_fallbackTimer;_positionIndex;_dirChangeSubscription=ce.EMPTY;_position;_previousPosition;_onCentering=new O;_beforeCentering=new O;_afterLeavingCenter=new O;_onCentered=new O(!0);_portalHost;_contentElement;_content;animationDuration="500ms";preserveContent=!1;set position(e){this._positionIndex=e,this._computePositionAnimationState()}constructor(){if(this._dir){let e=c(Me);this._dirChangeSubscription=this._dir.change.subscribe(i=>{this._computePositionAnimationState(i),e.markForCheck()})}}ngOnInit(){this._bindTransitionEvents(),this._position==="center"&&(this._setActiveClass(!0),tt(()=>this._onCentering.emit(this._elementRef.nativeElement.clientHeight),{injector:this._injector})),this._initialized=!0}ngOnDestroy(){clearTimeout(this._fallbackTimer),this._eventCleanups?.forEach(e=>e()),this._dirChangeSubscription.unsubscribe()}_bindTransitionEvents(){this._ngZone.runOutsideAngular(()=>{let e=this._elementRef.nativeElement,i=r=>{r.target===this._contentElement?.nativeElement&&(this._elementRef.nativeElement.classList.remove("mat-tab-body-animating"),r.type==="transitionend"&&this._transitionDone())};this._eventCleanups=[this._renderer.listen(e,"transitionstart",r=>{r.target===this._contentElement?.nativeElement&&(this._elementRef.nativeElement.classList.add("mat-tab-body-animating"),this._transitionStarted())}),this._renderer.listen(e,"transitionend",i),this._renderer.listen(e,"transitioncancel",i)]})}_transitionStarted(){clearTimeout(this._fallbackTimer);let e=this._position==="center";this._beforeCentering.emit(e),e&&this._onCentering.emit(this._elementRef.nativeElement.clientHeight)}_transitionDone(){this._position==="center"?this._onCentered.emit():this._previousPosition==="center"&&this._afterLeavingCenter.emit()}_setActiveClass(e){this._elementRef.nativeElement.classList.toggle("mat-mdc-tab-body-active",e)}_getLayoutDirection(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}_isCenterPosition(){return this._positionIndex===0}_computePositionAnimationState(e=this._getLayoutDirection()){this._previousPosition=this._position,this._positionIndex<0?this._position=e=="ltr"?"left":"right":this._positionIndex>0?this._position=e=="ltr"?"right":"left":this._position="center",this._animationsDisabled()?this._simulateTransitionEvents():this._initialized&&(this._position==="center"||this._previousPosition==="center")&&(clearTimeout(this._fallbackTimer),this._fallbackTimer=this._ngZone.runOutsideAngular(()=>setTimeout(()=>this._simulateTransitionEvents(),100)))}_simulateTransitionEvents(){this._transitionStarted(),tt(()=>this._transitionDone(),{injector:this._injector})}_animationsDisabled(){return this._diAnimationsDisabled||this.animationDuration==="0ms"||this.animationDuration==="0s"}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-tab-body"]],viewQuery:function(i,r){if(i&1&&Re(aM,5)(aj,5),i&2){let o;z(o=$())&&(r._portalHost=o.first),z(o=$())&&(r._contentElement=o.first)}},hostAttrs:[1,"mat-mdc-tab-body"],hostVars:1,hostBindings:function(i,r){i&2&&L("inert",r._position==="center"?null:"")},inputs:{_content:[0,"content","_content"],animationDuration:"animationDuration",preserveContent:"preserveContent",position:"position"},outputs:{_onCentering:"_onCentering",_beforeCentering:"_beforeCentering",_onCentered:"_onCentered"},decls:3,vars:6,consts:[["content",""],["cdkScrollable","",1,"mat-mdc-tab-body-content"],["matTabBodyHost",""]],template:function(i,r){i&1&&(m(0,"div",1,0),yt(2,sj,0,0,"ng-template",2),f()),i&2&&T("mat-tab-body-content-left",r._position==="left")("mat-tab-body-content-right",r._position==="right")("mat-tab-body-content-can-animate",r._position==="center"||r._previousPosition==="center")},dependencies:[aM,si],styles:[`.mat-mdc-tab-body {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  overflow: hidden;
  outline: 0;
  flex-basis: 100%;
}
.mat-mdc-tab-body.mat-mdc-tab-body-active {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
  flex-grow: 1;
}
.mat-mdc-tab-group.mat-mdc-tab-group-dynamic-height .mat-mdc-tab-body.mat-mdc-tab-body-active {
  overflow-y: hidden;
}

.mat-mdc-tab-body-content {
  height: 100%;
  overflow: auto;
  transform: none;
  visibility: hidden;
}
.mat-tab-body-animating > .mat-mdc-tab-body-content, .mat-mdc-tab-body-active > .mat-mdc-tab-body-content {
  visibility: visible;
}
.mat-tab-body-animating > .mat-mdc-tab-body-content {
  min-height: 1px;
}
.mat-mdc-tab-group-dynamic-height .mat-mdc-tab-body-content {
  overflow: hidden;
}

.mat-tab-body-content-can-animate {
  transition: transform var(--%NS%mat-tab-body-animation-duration) 1ms cubic-bezier(0.35, 0, 0.25, 1);
}
.mat-mdc-tab-body-wrapper._mat-animation-noopable .mat-tab-body-content-can-animate {
  transition: none;
}

.mat-tab-body-content-left {
  transform: translate3d(-100%, 0, 0);
}

.mat-tab-body-content-right {
  transform: translate3d(100%, 0, 0);
}
`],encapsulation:2,changeDetection:1})}return t})(),dM=(()=>{class t{_elementRef=c(F);_changeDetectorRef=c(Me);_ngZone=c(U);_tabsSubscription=ce.EMPTY;_tabLabelSubscription=ce.EMPTY;_tabBodySubscription=ce.EMPTY;_diAnimationsDisabled=Te();_bodyAnimationDuration;_headerAnimationDuration;_allTabs;_tabBodies;_tabBodyWrapper;_tabHeader;_tabs=new hn;_indexToSelect=0;_lastFocusedTabIndex=null;_tabBodyWrapperHeight=0;color;get fitInkBarToContent(){return this._fitInkBarToContent}set fitInkBarToContent(e){this._fitInkBarToContent=e,this._changeDetectorRef.markForCheck()}_fitInkBarToContent=!1;stretchTabs=!0;alignTabs=null;dynamicHeight=!1;get selectedIndex(){return this._selectedIndex}set selectedIndex(e){this._indexToSelect=isNaN(e)?null:e}_selectedIndex=null;headerPosition="above";get animationDuration(){return this._animationDuration}set animationDuration(e){this._animationDuration=e,e&&typeof e=="object"?(this._bodyAnimationDuration=mb(e.body),this._headerAnimationDuration=mb(e.header)):this._headerAnimationDuration=this._bodyAnimationDuration=mb(e)}_animationDuration;get contentTabIndex(){return this._contentTabIndex}set contentTabIndex(e){this._contentTabIndex=isNaN(e)?null:e}_contentTabIndex=null;disablePagination=!1;disableRipple=!1;preserveContent=!1;get backgroundColor(){return this._backgroundColor}set backgroundColor(e){let i=this._elementRef.nativeElement.classList;i.remove("mat-tabs-with-background",`mat-background-${this.backgroundColor}`),e&&i.add("mat-tabs-with-background",`mat-background-${e}`),this._backgroundColor=e}_backgroundColor;ariaLabel;ariaLabelledby;selectedIndexChange=new O;focusChange=new O;animationDone=new O;selectedTabChange=new O(!0);_groupId;_isServer=!c(ye).isBrowser;constructor(){let e=c(Dj,{optional:!0});this._groupId=c(Ue).getId("mat-tab-group-"),this.animationDuration=e&&e.animationDuration?e.animationDuration:"500ms",this.disablePagination=e&&e.disablePagination!=null?e.disablePagination:!1,this.dynamicHeight=e&&e.dynamicHeight!=null?e.dynamicHeight:!1,e?.contentTabIndex!=null&&(this.contentTabIndex=e.contentTabIndex),this.preserveContent=!!e?.preserveContent,this.fitInkBarToContent=e&&e.fitInkBarToContent!=null?e.fitInkBarToContent:!1,this.stretchTabs=e&&e.stretchTabs!=null?e.stretchTabs:!0,this.alignTabs=e&&e.alignTabs!=null?e.alignTabs:null}ngAfterContentChecked(){let e=this._indexToSelect=this._clampTabIndex(this._indexToSelect);if(this._selectedIndex!=e){let i=this._selectedIndex==null;if(!i){this.selectedTabChange.emit(this._createChangeEvent(e));let r=this._tabBodyWrapper.nativeElement;r.style.minHeight=r.clientHeight+"px"}Promise.resolve().then(()=>{this._tabs.forEach((r,o)=>r.isActive=o===e),i||(this.selectedIndexChange.emit(e),this._tabBodyWrapper.nativeElement.style.minHeight="")})}this._tabs.forEach((i,r)=>{i.position=r-e,this._selectedIndex!=null&&i.position==0&&!i.origin&&(i.origin=e-this._selectedIndex)}),this._selectedIndex!==e&&(this._selectedIndex=e,this._lastFocusedTabIndex=null,this._changeDetectorRef.markForCheck())}ngAfterContentInit(){this._subscribeToAllTabChanges(),this._subscribeToTabLabels(),this._tabsSubscription=this._tabs.changes.subscribe(()=>{let e=this._clampTabIndex(this._indexToSelect);if(e===this._selectedIndex){let i=this._tabs.toArray(),r;for(let o=0;o<i.length;o++)if(i[o].isActive){this._indexToSelect=this._selectedIndex=o,this._lastFocusedTabIndex=null,r=i[o];break}!r&&i[e]&&Promise.resolve().then(()=>{i[e].isActive=!0,this.selectedTabChange.emit(this._createChangeEvent(e))})}this._changeDetectorRef.markForCheck()})}ngAfterViewInit(){this._tabBodySubscription=this._tabBodies.changes.subscribe(()=>this._bodyCentered(!0))}_subscribeToAllTabChanges(){this._allTabs.changes.pipe(qe(this._allTabs)).subscribe(e=>{this._tabs.reset(e.filter(i=>i._closestTabGroup===this||!i._closestTabGroup)),this._tabs.notifyOnChanges()})}ngOnDestroy(){this._tabs.destroy(),this._tabsSubscription.unsubscribe(),this._tabLabelSubscription.unsubscribe(),this._tabBodySubscription.unsubscribe()}realignInkBar(){this._tabHeader&&this._tabHeader._alignInkBarToSelectedTab()}updatePagination(){this._tabHeader&&this._tabHeader.updatePagination()}focusTab(e){let i=this._tabHeader;i&&(i.focusIndex=e)}_focusChanged(e){this._lastFocusedTabIndex=e,this.focusChange.emit(this._createChangeEvent(e))}_createChangeEvent(e){let i=new pb;return i.index=e,this._tabs&&this._tabs.length&&(i.tab=this._tabs.toArray()[e]),i}_subscribeToTabLabels(){this._tabLabelSubscription&&this._tabLabelSubscription.unsubscribe(),this._tabLabelSubscription=mt(...this._tabs.map(e=>e._stateChanges)).subscribe(()=>this._changeDetectorRef.markForCheck())}_clampTabIndex(e){return Math.min(this._tabs.length-1,Math.max(e||0,0))}_getTabLabelId(e,i){return e.id||`${this._groupId}-label-${i}`}_getTabContentId(e){return`${this._groupId}-content-${e}`}_setTabBodyWrapperHeight(e){if(!this.dynamicHeight||!this._tabBodyWrapperHeight){this._tabBodyWrapperHeight=e;return}let i=this._tabBodyWrapper.nativeElement;i.style.height=this._tabBodyWrapperHeight+"px",this._tabBodyWrapper.nativeElement.offsetHeight&&(i.style.height=e+"px")}_removeTabBodyWrapperHeight(){let e=this._tabBodyWrapper.nativeElement;this._tabBodyWrapperHeight=e.clientHeight,e.style.height="",this._ngZone.run(()=>this.animationDone.emit())}_handleClick(e,i,r){i.focusIndex=r,e.disabled||(this.selectedIndex=r)}_getTabIndex(e){let i=this._lastFocusedTabIndex??this.selectedIndex;return e===i?0:-1}_tabFocusChanged(e,i){e&&e!=="mouse"&&e!=="touch"&&(this._tabHeader.focusIndex=i)}_bodyCentered(e){e&&this._tabBodies?.forEach((i,r)=>i._setActiveClass(r===this._selectedIndex))}_bodyAnimationsDisabled(){return this._diAnimationsDisabled||this._bodyAnimationDuration==="0"||this._bodyAnimationDuration==="0ms"}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-tab-group"]],contentQueries:function(i,r,o){if(i&1&&ct(o,_b,5),i&2){let a;z(a=$())&&(r._allTabs=a)}},viewQuery:function(i,r){if(i&1&&Re(lj,5)(cj,5)(hb,5),i&2){let o;z(o=$())&&(r._tabBodyWrapper=o.first),z(o=$())&&(r._tabHeader=o.first),z(o=$())&&(r._tabBodies=o)}},hostAttrs:[1,"mat-mdc-tab-group"],hostVars:13,hostBindings:function(i,r){i&2&&(L("mat-align-tabs",r.alignTabs),Ke("mat-"+(r.color||"primary")),Lt("--%NS%mat-tab-body-animation-duration",r._bodyAnimationDuration)("--%NS%mat-tab-header-animation-duration",r._headerAnimationDuration),T("mat-mdc-tab-group-dynamic-height",r.dynamicHeight)("mat-mdc-tab-group-inverted-header",r.headerPosition==="below")("mat-mdc-tab-group-stretch-tabs",r.stretchTabs))},inputs:{color:"color",fitInkBarToContent:[2,"fitInkBarToContent","fitInkBarToContent",G],stretchTabs:[2,"mat-stretch-tabs","stretchTabs",G],alignTabs:[0,"mat-align-tabs","alignTabs"],dynamicHeight:[2,"dynamicHeight","dynamicHeight",G],selectedIndex:[2,"selectedIndex","selectedIndex",Nt],headerPosition:"headerPosition",animationDuration:"animationDuration",contentTabIndex:[2,"contentTabIndex","contentTabIndex",Nt],disablePagination:[2,"disablePagination","disablePagination",G],disableRipple:[2,"disableRipple","disableRipple",G],preserveContent:[2,"preserveContent","preserveContent",G],backgroundColor:"backgroundColor",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"]},outputs:{selectedIndexChange:"selectedIndexChange",focusChange:"focusChange",animationDone:"animationDone",selectedTabChange:"selectedTabChange"},exportAs:["matTabGroup"],features:[Ne([{provide:lM,useExisting:t}])],ngContentSelectors:gb,decls:9,vars:8,consts:[["tabHeader",""],["tabBodyWrapper",""],["tabNode",""],[3,"indexFocused","selectFocusedIndex","selectedIndex","disableRipple","disablePagination","aria-label","aria-labelledby"],["role","tab","matTabLabelWrapper","","cdkMonitorElementFocus","",1,"mdc-tab","mat-mdc-tab","mat-focus-indicator",3,"id","mdc-tab--active","class","disabled","fitInkBarToContent"],[1,"mat-mdc-tab-body-wrapper"],["role","tabpanel",3,"id","class","content","position","animationDuration","preserveContent"],["role","tab","matTabLabelWrapper","","cdkMonitorElementFocus","",1,"mdc-tab","mat-mdc-tab","mat-focus-indicator",3,"click","cdkFocusChange","id","disabled","fitInkBarToContent"],[1,"mdc-tab__ripple"],["mat-ripple","",1,"mat-mdc-tab-ripple",3,"matRippleTrigger","matRippleDisabled"],[1,"mdc-tab__content"],[1,"mdc-tab__text-label"],[3,"cdkPortalOutlet"],["role","tabpanel",3,"_onCentered","_onCentering","_beforeCentering","id","content","position","animationDuration","preserveContent"]],template:function(i,r){i&1&&(_e(),m(0,"mat-tab-header",3,0),w("indexFocused",function(a){return r._focusChanged(a)})("selectFocusedIndex",function(a){return r.selectedIndex=a}),nt(2,fj,8,17,"div",4,Va),f(),E(4,hj,1,0),m(5,"div",5,1),nt(7,pj,1,10,"mat-tab-body",6,Va),f()),i&2&&(N("selectedIndex",r.selectedIndex||0)("disableRipple",r.disableRipple)("disablePagination",r.disablePagination),Ku("aria-label",r.ariaLabel)("aria-labelledby",r.ariaLabelledby),p(2),it(r._tabs),p(2),M(r._isServer?4:-1),p(),T("_mat-animation-noopable",r._bodyAnimationsDisabled()),p(2),it(r._tabs))},dependencies:[xj,cM,Ev,tr,Ti,hb],styles:[`.mdc-tab {
  min-width: 90px;
  padding: 0 24px;
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  box-sizing: border-box;
  border: none;
  outline: none;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  z-index: 1;
  touch-action: manipulation;
}

.mdc-tab__content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: inherit;
  pointer-events: none;
}

.mdc-tab__text-label {
  transition: 150ms color linear;
  display: inline-block;
  line-height: 1;
  z-index: 2;
}

.mdc-tab--active .mdc-tab__text-label {
  transition-delay: 100ms;
}

._mat-animation-noopable .mdc-tab__text-label {
  transition: none;
}

.mdc-tab-indicator {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.mdc-tab-indicator__content {
  transition: var(--%NS%mat-tab-header-animation-duration, 250ms) transform cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left;
  opacity: 0;
}

.mdc-tab-indicator__content--underline {
  align-self: flex-end;
  box-sizing: border-box;
  width: 100%;
  border-top-style: solid;
}

.mdc-tab-indicator--active .mdc-tab-indicator__content {
  opacity: 1;
}

._mat-animation-noopable .mdc-tab-indicator__content, .mdc-tab-indicator--no-transition .mdc-tab-indicator__content {
  transition: none;
}

.mat-mdc-tab-ripple.mat-mdc-tab-ripple {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
}

.mat-mdc-tab {
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: none;
  background: none;
  height: var(--%NS%mat-tab-container-height, 48px);
  font-family: var(--%NS%mat-tab-label-text-font, var(--%NS%mat-sys-title-small-font));
  font-size: var(--%NS%mat-tab-label-text-size, var(--%NS%mat-sys-title-small-size));
  letter-spacing: var(--%NS%mat-tab-label-text-tracking, var(--%NS%mat-sys-title-small-tracking));
  line-height: var(--%NS%mat-tab-label-text-line-height, var(--%NS%mat-sys-title-small-line-height));
  font-weight: var(--%NS%mat-tab-label-text-weight, var(--%NS%mat-sys-title-small-weight));
}
.mat-mdc-tab.mdc-tab {
  flex-grow: 0;
}
.mat-mdc-tab .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-active-indicator-color, var(--%NS%mat-sys-primary));
  border-top-width: var(--%NS%mat-tab-active-indicator-height, 2px);
  border-radius: var(--%NS%mat-tab-active-indicator-shape, 0);
}
.mat-mdc-tab:hover .mdc-tab__text-label {
  color: var(--%NS%mat-tab-inactive-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab:focus .mdc-tab__text-label {
  color: var(--%NS%mat-tab-inactive-focus-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--active .mdc-tab__text-label {
  color: var(--%NS%mat-tab-active-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--active .mdc-tab__ripple::before,
.mat-mdc-tab.mdc-tab--active .mat-ripple-element {
  background-color: var(--%NS%mat-tab-active-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--%NS%active:hover .mdc-tab__text-label {
  color: var(--%NS%mat-tab-active-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--%NS%active:hover .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-active-hover-indicator-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-tab.mdc-tab--%NS%active:focus .mdc-tab__text-label {
  color: var(--%NS%mat-tab-active-focus-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--%NS%active:focus .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-active-focus-indicator-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-tab.mat-mdc-tab-disabled {
  opacity: 0.4;
  pointer-events: none;
}
.mat-mdc-tab.mat-mdc-tab-disabled .mdc-tab__content {
  pointer-events: none;
}
.mat-mdc-tab.mat-mdc-tab-disabled .mdc-tab__ripple::before,
.mat-mdc-tab.mat-mdc-tab-disabled .mat-ripple-element {
  background-color: var(--%NS%mat-tab-disabled-ripple-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-tab .mdc-tab__ripple::before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  pointer-events: none;
  background-color: var(--%NS%mat-tab-inactive-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab .mdc-tab__text-label {
  color: var(--%NS%mat-tab-inactive-label-text-color, var(--%NS%mat-sys-on-surface));
  display: inline-flex;
  align-items: center;
}
.mat-mdc-tab .mdc-tab__content {
  position: relative;
  pointer-events: auto;
}
.mat-mdc-tab:hover .mdc-tab__ripple::before {
  opacity: 0.04;
}
.mat-mdc-tab.cdk-program-focused .mdc-tab__ripple::before, .mat-mdc-tab.cdk-keyboard-focused .mdc-tab__ripple::before {
  opacity: 0.12;
}
.mat-mdc-tab .mat-ripple-element {
  opacity: 0.12;
  background-color: var(--%NS%mat-tab-inactive-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab-group.mat-mdc-tab-group-stretch-tabs > .mat-mdc-tab-header .mat-mdc-tab {
  flex-grow: 1;
}

.mat-mdc-tab-group {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination {
  background-color: var(--%NS%mat-tab-background-color);
}
.mat-mdc-tab-group.mat-tabs-with-background.mat-primary > .mat-mdc-tab-header .mat-mdc-tab .mdc-tab__text-label {
  color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background.mat-primary > .mat-mdc-tab-header .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background:not(.mat-primary) > .mat-mdc-tab-header .mat-mdc-tab:not(.mdc-tab--active) .mdc-tab__text-label {
  color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background:not(.mat-primary) > .mat-mdc-tab-header .mat-mdc-tab:not(.mdc-tab--active) .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-focus-indicator::before, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-focus-indicator::before {
  border-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-ripple-element, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mdc-tab__ripple::before, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-ripple-element, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mdc-tab__ripple::before {
  background-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-mdc-tab-header-pagination-chevron, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron {
  color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-mdc-tab-group-inverted-header {
  flex-direction: column-reverse;
}
.mat-mdc-tab-group.mat-mdc-tab-group-inverted-header .mdc-tab-indicator__content--underline {
  align-self: flex-start;
}

.mat-mdc-tab-body-wrapper {
  position: relative;
  overflow: hidden;
  display: flex;
  transition: height 500ms cubic-bezier(0.35, 0, 0.25, 1);
}
.mat-mdc-tab-body-wrapper._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
`],encapsulation:2,changeDetection:1})}return t})(),pb=class{index;tab};var uM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ge]})}return t})();var mM=(t,n)=>n.path;function Mj(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=y();p(),k(e.error())}}function Nj(t,n){if(t&1){let e=ae();m(0,"button",11),w("click",function(){q(e);let r=y(),o=y();return Y(o.browseTo(r.parent))}),m(1,"mat-icon"),g(2,"arrow_upward"),f()()}}function Ij(t,n){t&1&&(m(0,"span",13),g(1,"/"),f())}function Tj(t,n){if(t&1){let e=ae();m(0,"button",12),w("click",function(){let r=q(e).$implicit,o=y(2);return Y(o.browseTo(r.path))}),g(1),f(),E(2,Ij,2,0,"span",13)}if(t&2){let e=n.$implicit,i=n.$index,r=n.$count;p(),k(e.name),p(),M(i!==r-1?2:-1)}}function kj(t,n){t&1&&j(0,"mat-progress-bar",6)}function Aj(t,n){if(t&1){let e=ae();m(0,"button",14),w("click",function(){let r=q(e).$implicit,o=y(2);return Y(o.browseTo(r.path))}),m(1,"mat-icon",15),g(2,"folder"),f(),m(3,"span",16),g(4),f(),m(5,"mat-icon",17),g(6,"chevron_right"),f()()}if(t&2){let e=n.$implicit;p(4),k(e.name)}}function Rj(t,n){t&1&&(m(0,"p",18),g(1,"No subdirectories found"),f())}function Oj(t,n){if(t&1&&E(0,Rj,2,0,"p",18),t&2){let e=y(2);M(e.loading()?-1:0)}}function Pj(t,n){if(t&1){let e=ae();m(0,"nav",3),E(1,Nj,3,0,"button",4),nt(2,Tj,3,2,null,null,mM),f(),m(4,"div",5),E(5,kj,1,0,"mat-progress-bar",6),nt(6,Aj,7,1,"button",7,mM,!1,Oj,1,1),f(),m(9,"div",8)(10,"span",9),g(11),f(),m(12,"button",10),w("click",function(){q(e);let r=y();return Y(r.selectCurrent())}),m(13,"mat-icon"),g(14,"check"),f(),g(15," Select current folder "),f()()}if(t&2){let e=n,i=y();p(),M(e.parent?1:-1),p(),it(e.breadcrumbs),p(3),M(i.loading()?5:-1),p(),it(e.directories),p(4),N("title",e.current),p(),k(e.current)}}function Fj(t,n){t&1&&(m(0,"div",2),j(1,"mat-progress-bar",6),f())}var Vs=class t{constructor(){this.initialPath="";this.folderBrowsed=new O;this.folderSelected=new O;this.listing=S(null);this.loading=S(!1);this.error=S("");this.api=c(ws);this.loadedPath="";this.loadSequence=0}ngOnInit(){this.loadDirectory(this.initialPath||void 0)}ngOnChanges(n){n.initialPath&&!n.initialPath.firstChange&&this.initialPath&&this.browseTo(this.initialPath)}browseTo(n){!n||n===this.loadedPath||this.loadDirectory(n)}async loadDirectory(n){let e=++this.loadSequence;this.loadedPath=n||"",this.loading.set(!0),this.error.set("");try{let i=await this.api.fetchDirectories(n);if(e!==this.loadSequence)return;this.listing.set(i),this.loadedPath=i.current,this.folderBrowsed.emit({path:i.current,name:i.name})}catch(i){if(e!==this.loadSequence)return;this.loadedPath=this.listing()?.current??"",this.error.set(i instanceof Error?i.message:"Failed to load directories")}finally{e===this.loadSequence&&this.loading.set(!1)}}selectCurrent(){let n=this.listing();n&&this.folderSelected.emit({path:n.current,name:n.name})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-folder-picker"]],inputs:{initialPath:"initialPath"},outputs:{folderBrowsed:"folderBrowsed",folderSelected:"folderSelected"},features:[Ae],decls:4,vars:2,consts:[[1,"picker"],["role","alert",1,"error-box"],[1,"loading"],["aria-label","Directory path",1,"breadcrumbs"],["mat-button","","type","button","aria-label","Go to parent directory"],["aria-label","Subdirectories",1,"directory-list"],["mode","indeterminate","aria-label","Loading directories"],["mat-list-item","","type","button"],[1,"picker-actions"],[1,"current-path",3,"title"],["mat-flat-button","","type","button",3,"click"],["mat-button","","type","button","aria-label","Go to parent directory",3,"click"],["mat-button","","type","button",1,"crumb",3,"click"],["aria-hidden","true"],["mat-list-item","","type","button",3,"click"],["matListItemIcon",""],["matListItemTitle",""],["matListItemMeta",""],[1,"empty"]],template:function(e,i){if(e&1&&(m(0,"div",0),E(1,Mj,2,1,"div",1),E(2,Pj,16,5)(3,Fj,2,0,"div",2),f()),e&2){let r;p(),M(i.error()?1:-1),p(),M((r=i.listing())?2:i.loading()?3:-1,r)}},dependencies:[rm,Oe,ot,Pe,ze,Nf,Mf,qc,Gc,Jv,Zf,Yf],styles:["[_nghost-%COMP%]{display:block}.picker[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:12px}.breadcrumbs[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap;gap:2px;padding:4px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-surface-container-low);color:var(--%NS%mat-sys-on-surface-variant)}.breadcrumbs[_ngcontent-%COMP%]   .crumb[_ngcontent-%COMP%]{min-width:0;padding-inline:7px}.directory-list[_ngcontent-%COMP%]{min-height:170px;max-height:250px;overflow:auto;border:1px solid var(--%NS%mat-sys-outline-variant);border-radius:var(--%NS%mat-sys-corner-medium)}.directory-list[_ngcontent-%COMP%]   mat-progress-bar[_ngcontent-%COMP%]{position:sticky;top:0;z-index:1}.directory-list[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:100%;text-align:left}.empty[_ngcontent-%COMP%]{padding:32px 16px;margin:0;color:var(--%NS%mat-sys-on-surface-variant);text-align:center}.loading[_ngcontent-%COMP%]{min-height:170px;display:grid;align-content:center}.picker-actions[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:12px}.current-path[_ngcontent-%COMP%]{min-width:0;overflow:hidden;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-medium);text-overflow:ellipsis;white-space:nowrap}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){.picker-actions[_ngcontent-%COMP%]{align-items:stretch;flex-direction:column}.current-path[_ngcontent-%COMP%]{white-space:normal;overflow-wrap:anywhere}}"]})}};function Lj(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=y();p(),k(e.errorMessage())}}function jj(t,n){if(t&1&&(m(0,"div",7),g(1,"Browsing: "),m(2,"code"),g(3),f(),j(4,"br"),g(5,"Select the current folder to use it."),f()),t&2){let e=y();p(3),k(e.browsedPath())}}function Vj(t,n){if(t&1){let e=ae();m(0,"div",12)(1,"strong"),g(2,"Selected directory"),f(),m(3,"code"),g(4),f()(),m(5,"mat-form-field",9)(6,"mat-label"),g(7,"Project display name"),f(),m(8,"input",13),w("ngModelChange",function(r){q(e);let o=y();return Y(o.editProjectName(r))}),f(),ii(),f()}if(t&2){let e=y();p(4),k(e.selectedPath()),p(4),N("ngModel",e.projectName()),ri()}}function Bj(t,n){if(t&1&&(m(0,"div",7),g(1,"Browsing: "),m(2,"code"),g(3),f(),j(4,"br"),g(5,"Select the current folder to use it."),f()),t&2){let e=y();p(3),k(e.cloneBrowsedPath())}}function Hj(t,n){if(t&1&&(m(0,"div",12)(1,"strong"),g(2,"Parent path"),f(),m(3,"code"),g(4),f()()),t&2){let e=y();p(4),k(e.cloneParentPath())}}function Uj(t,n){t&1&&j(0,"mat-progress-bar",14)}function zj(t,n){if(t&1){let e=ae();m(0,"button",18),w("click",function(){q(e);let r=y();return Y(r.createFromFolder())}),g(1,"Create project"),f()}if(t&2){let e=y();N("disabled",!e.selectedPath()||!e.projectName().trim())}}function $j(t,n){if(t&1){let e=ae();m(0,"button",18),w("click",function(){q(e);let r=y();return Y(r.cloneRepository())}),g(1,"Clone & create"),f()}if(t&2){let e=y();N("disabled",!e.repoUrl().trim()||!e.cloneParentPath()||e.cloning())}}var Bs=class t{constructor(n){this.state=c(Fe);this.dialogRef=c(Yt);this.router=c(an);this.modeIndex=S(0);this.projectName=S("");this.selectedPath=S("");this.browsedPath=S("");this.repoUrl=S("");this.cloneParentPath=S("");this.cloneBrowsedPath=S("");this.cloneProjectName=S("");this.cloning=S(!1);this.errorMessage=S("");this.projectNameEdited=!1}editProjectName(n){this.projectNameEdited=!0,this.projectName.set(n)}folderBrowsed(n){this.browsedPath.set(n.path)}folderSelected(n){this.selectedPath.set(n.path),this.projectNameEdited||this.projectName.set(n.name)}async createFromFolder(){if(!this.selectedPath()||!this.projectName().trim()){this.errorMessage.set("Please select a folder and specify a project name.");return}try{this.errorMessage.set("");let n=await this.state.createProject(this.projectName().trim(),this.selectedPath());this.dialogRef.close(n),await this.router.navigate(["/projects",n.id])}catch(n){this.errorMessage.set(n instanceof Error?n.message:"Failed to create project")}}async cloneRepository(){if(!this.repoUrl().trim()||!this.cloneParentPath()){this.errorMessage.set("Please provide repository URL and destination parent directory.");return}this.cloning.set(!0),this.errorMessage.set("");try{let n=await this.state.cloneProject({url:this.repoUrl().trim(),parent_path:this.cloneParentPath(),name:this.cloneProjectName().trim()||void 0});this.dialogRef.close(n),await this.router.navigate(["/projects",n.id])}catch(n){this.errorMessage.set(n instanceof Error?n.message:"Failed to clone repository")}finally{this.cloning.set(!1)}}static{this.\u0275fac=function(e){return new(e||t)(te(Nn))}}static{this.\u0275cmp=D({type:t,selectors:[["hub-project-dialog"]],decls:35,vars:11,consts:[["mat-dialog-title",""],["role","alert",1,"error-box"],[3,"selectedIndexChange","selectedIndex"],["label","Existing folder"],[1,"tab-content"],[1,"help"],[3,"folderBrowsed","folderSelected"],[1,"path-note"],["label","Clone repository"],["appearance","outline"],["matInput","","placeholder","https://github.com/org/repo.git","autocomplete","off",3,"ngModelChange","ngModel"],[1,"field-label"],[1,"selected-path"],["matInput","","autocomplete","off",3,"ngModelChange","ngModel"],["mode","indeterminate","aria-label","Cloning repository"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","type","button",3,"disabled"],["mat-flat-button","","type","button",3,"click","disabled"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"New project"),f(),m(2,"mat-dialog-content"),E(3,Lj,2,1,"div",1),m(4,"mat-tab-group",2),w("selectedIndexChange",function(o){return i.modeIndex.set(o)}),m(5,"mat-tab",3)(6,"div",4)(7,"p",5),g(8,"Choose a directory already available on the server."),f(),m(9,"hub-folder-picker",6),w("folderBrowsed",function(o){return i.folderBrowsed(o)})("folderSelected",function(o){return i.folderSelected(o)}),f(),E(10,jj,6,1,"div",7),E(11,Vj,9,2),f()(),m(12,"mat-tab",8)(13,"div",4)(14,"mat-form-field",9)(15,"mat-label"),g(16,"Git repository URL (HTTPS or SSH)"),f(),m(17,"input",10),w("ngModelChange",function(o){return i.repoUrl.set(o)}),f(),ii(),m(18,"mat-hint"),g(19,"Plain HTTP URLs are not accepted by the server."),f()(),m(20,"p",11),g(21,"Destination parent directory"),f(),m(22,"hub-folder-picker",6),w("folderBrowsed",function(o){return i.cloneBrowsedPath.set(o.path)})("folderSelected",function(o){return i.cloneParentPath.set(o.path)}),f(),E(23,Bj,6,1,"div",7),E(24,Hj,5,1,"div",12),m(25,"mat-form-field",9)(26,"mat-label"),g(27,"Project / folder name (optional)"),f(),m(28,"input",13),w("ngModelChange",function(o){return i.cloneProjectName.set(o)}),f(),ii(),f(),E(29,Uj,1,0,"mat-progress-bar",14),f()()()(),m(30,"mat-dialog-actions",15)(31,"button",16),w("click",function(){return i.dialogRef.close()}),g(32,"Cancel"),f(),E(33,zj,2,1,"button",17)(34,$j,2,1,"button",17),f()),e&2&&(p(3),M(i.errorMessage()?3:-1),p(),N("selectedIndex",i.modeIndex()),p(6),M(i.browsedPath()&&i.browsedPath()!==i.selectedPath()?10:-1),p(),M(i.selectedPath()?11:-1),p(6),N("ngModel",i.repoUrl()),ri(),p(6),M(i.cloneBrowsedPath()&&i.cloneBrowsedPath()!==i.cloneParentPath()?23:-1),p(),M(i.cloneParentPath()?24:-1),p(4),N("ngModel",i.cloneProjectName()),ri(),p(),M(i.cloning()?29:-1),p(2),N("disabled",i.cloning()),p(2),M(i.modeIndex()===0?33:34))},dependencies:[Ur,Ii,Hr,Ko,Vs,Oe,ot,It,Hn,zn,Un,dn,Wn,In,Kc,Pe,Zr,Yr,Zf,Yf,uM,_b,dM],styles:["mat-dialog-content[_ngcontent-%COMP%]{min-width:min(600px,100vw - 48px);max-height:min(680px,70vh)}.tab-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:14px;padding:22px 4px 8px}mat-form-field[_ngcontent-%COMP%]{width:100%}.help[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.field-label[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-title-small)}.path-note[_ngcontent-%COMP%], .selected-path[_ngcontent-%COMP%]{padding:10px 12px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-surface-container);color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-small)}.selected-path[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px}code[_ngcontent-%COMP%]{overflow-wrap:anywhere}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};var Qf=class t{constructor(n){this.document=n;this.mode=S(this.readMode());vt(()=>{let e=this.mode();this.document.documentElement.dataset.theme=e,typeof localStorage<"u"&&localStorage.setItem("agent-hub-theme",e)})}cycle(){let n={system:"light",light:"dark",dark:"system"};this.mode.set(n[this.mode()])}icon(){return this.mode()==="dark"?"dark_mode":this.mode()==="light"?"light_mode":"brightness_auto"}label(){return this.mode()==="dark"?"Dark theme":this.mode()==="light"?"Light theme":"Use system theme"}readMode(){if(typeof localStorage>"u")return"system";let n=localStorage.getItem("agent-hub-theme");return n==="light"||n==="dark"||n==="system"?n:"system"}static{this.\u0275fac=function(e){return new(e||t)(ee(K))}}static{this.\u0275prov=me({token:t,factory:t.\u0275fac,providedIn:"root"})}};var fM=t=>["/projects",t],Wj=()=>({exact:!0}),Gj=(t,n)=>["/projects",t,"chats",n],hM=(t,n)=>n.id;function qj(t,n){if(t&1){let e=ae();m(0,"a",18),w("click",function(){q(e);let r=y();return Y(r.closeRequested.emit())}),m(1,"mat-icon",19),g(2,"folder"),f(),m(3,"span",20),g(4),f()()}if(t&2){let e=n.$implicit;N("routerLink",Ro(4,fM,e.id))("routerLinkActiveOptions",ql(6,Wj)),L("aria-label","Open project "+e.name),p(4),k(e.name)}}function Yj(t,n){t&1&&(m(0,"div",11),g(1,"No projects yet"),f())}function Zj(t,n){if(t&1){let e=ae();m(0,"a",28),w("click",function(){q(e);let r=y(2);return Y(r.closeRequested.emit())}),j(1,"span",29),m(2,"span",20),g(3),f(),m(4,"span",30),g(5),f()()}if(t&2){let e=n.$implicit;N("routerLink",Yl(8,Gj,e.project_id,e.id)),L("aria-label","Open chat "+(e.title||"Untitled chat")),p(),T("running",e.process_state==="RUNNING")("dead",e.process_state==="DEAD"),p(2),k(e.title||"Untitled chat"),p(2),k(e.agent)}}function Qj(t,n){t&1&&(m(0,"div",11),g(1,"No chats yet"),f())}function Xj(t,n){if(t&1){let e=ae();m(0,"section",12)(1,"div",21)(2,"a",22),w("click",function(){q(e);let r=y();return Y(r.closeRequested.emit())}),g(3),f(),m(4,"span",23),g(5),f()(),m(6,"button",24),w("click",function(){q(e);let r=y();return Y(r.newChat())}),m(7,"mat-icon"),g(8,"add_comment"),f(),g(9," New chat "),f(),m(10,"div",25)(11,"span"),g(12),f(),m(13,"button",26),w("click",function(){q(e);let r=y();return Y(r.state.setShowArchived(!r.state.showArchived()))}),g(14),f()(),m(15,"mat-nav-list"),nt(16,Zj,6,11,"a",27,hM,!1,Qj,2,0,"div",11),f()()}if(t&2){let e=n,i=y();p(2),N("routerLink",Ro(7,fM,e.id)),p(),k(e.name),p(),N("title",e.path),p(),k(e.path),p(7),dt("Chats (",i.visibleChats().length,")"),p(2),dt(" ",i.state.showArchived()?"Active only":"Archived"," "),p(2),it(i.visibleChats())}}var Xf=class t{constructor(){this.closeRequested=new O;this.state=c(Fe);this.theme=c(Qf);this.dialog=c(ki);this.router=c(an)}visibleChats(){let n=this.state.activeProjectId(),e=n?this.state.chatsByProject()[n]??[]:[];return this.state.showArchived()?e:e.filter(i=>!i.archived)}goHome(){this.router.navigate(["/"]),this.closeRequested.emit()}newProject(){this.dialog.open(Bs,{width:"min(720px, calc(100vw - 32px))"}),this.closeRequested.emit()}newChat(){let n=this.state.activeProjectId();n&&(this.dialog.open(Ls,{width:"min(560px, calc(100vw - 32px))",data:{projectId:n}}),this.closeRequested.emit())}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-navigation"]],outputs:{closeRequested:"closeRequested"},decls:33,vars:8,consts:[[1,"navigation-header"],["mat-button","","type","button","aria-label","Go to projects",1,"brand",3,"click"],[1,"brand-mark"],[1,"brand-name"],["mat-icon-button","","matTooltip","Close navigation","aria-label","Close navigation",3,"click"],[1,"navigation-body"],["aria-labelledby","projects-heading"],[1,"section-heading"],["id","projects-heading"],["mat-icon-button","","matTooltip","New project","aria-label","New project",3,"click"],["mat-list-item","","routerLinkActive","selected",3,"routerLink","routerLinkActiveOptions"],[1,"empty-navigation"],["aria-labelledby","active-project-heading",1,"active-project"],[1,"navigation-footer"],[1,"socket-state"],[1,"socket-dot"],[1,"footer-actions"],["mat-icon-button","",3,"click","matTooltip"],["mat-list-item","","routerLinkActive","selected",3,"click","routerLink","routerLinkActiveOptions"],["matListItemIcon",""],["matListItemTitle",""],[1,"project-summary"],["id","active-project-heading",3,"click","routerLink"],[3,"title"],["mat-flat-button","",1,"new-chat-button",3,"click"],[1,"section-heading","chats-heading"],["mat-button","",1,"archive-toggle",3,"click"],["mat-list-item","","routerLinkActive","selected",3,"routerLink"],["mat-list-item","","routerLinkActive","selected",3,"click","routerLink"],["matListItemIcon","",1,"chat-status"],[1,"agent-label"]],template:function(e,i){if(e&1&&(m(0,"header",0)(1,"button",1),w("click",function(){return i.goHome()}),m(2,"span",2)(3,"mat-icon"),g(4,"hub"),f()(),m(5,"span",3),g(6,"Agent Hub"),f()(),m(7,"button",4),w("click",function(){return i.closeRequested.emit()}),m(8,"mat-icon"),g(9,"close"),f()()(),m(10,"div",5)(11,"section",6)(12,"div",7)(13,"span",8),g(14,"Projects"),f(),m(15,"button",9),w("click",function(){return i.newProject()}),m(16,"mat-icon"),g(17,"add"),f()()(),m(18,"mat-nav-list"),nt(19,qj,5,7,"a",10,hM,!1,Yj,2,0,"div",11),f()(),E(22,Xj,19,9,"section",12),f(),m(23,"footer",13)(24,"span",14),j(25,"span",15),g(26),f(),m(27,"span",16)(28,"span"),g(29,"v0.2.0"),f(),m(30,"button",17),w("click",function(){return i.theme.cycle()}),m(31,"mat-icon"),g(32),f()()()()),e&2){let r;p(19),it(i.state.projects()),p(3),M((r=i.state.activeProject())?22:-1,r),p(3),Ke(i.state.wsStatus()),p(),k(i.state.wsStatus()),p(4),N("matTooltip",i.theme.label()),L("aria-label",i.theme.label()),p(2),k(i.theme.icon())}},dependencies:[Oe,ot,En,It,Ss,Pe,ze,Nf,fE,Mf,qc,Gc,$r,sr,Ni,yv],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;height:100%;min-width:280px;background:var(--%NS%mat-sys-surface-container-low)}.navigation-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:18px 16px 12px}.brand[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:12px;border:0;padding:0;background:transparent;color:inherit;font:inherit;cursor:pointer}.brand-mark[_ngcontent-%COMP%]{display:grid;place-items:center;width:40px;height:40px;border-radius:16px 16px 16px 4px;background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container)}.brand-name[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-large)}.navigation-body[_ngcontent-%COMP%]{flex:1;overflow:auto;padding:8px 12px 20px}.section-heading[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;padding:4px 8px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-large);letter-spacing:.06em;text-transform:uppercase}.section-heading[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{flex:0 0 auto}mat-nav-list[_ngcontent-%COMP%]{padding:0}mat-list-item[_ngcontent-%COMP%]{margin:2px 0;border-radius:var(--%NS%mat-sys-corner-full)}mat-list-item.selected[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container)}.empty-navigation[_ngcontent-%COMP%]{padding:12px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-medium);text-align:center}.active-project[_ngcontent-%COMP%]{margin-top:20px}.project-summary[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:2px;padding:12px;margin-bottom:10px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-surface-container)}.project-summary[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:inherit;font:var(--%NS%mat-sys-title-small);text-decoration:none}.project-summary[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{overflow:hidden;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small);text-overflow:ellipsis;white-space:nowrap}.new-chat-button[_ngcontent-%COMP%]{width:100%;margin:2px 0 16px}.chats-heading[_ngcontent-%COMP%]{padding-right:0}.archive-toggle[_ngcontent-%COMP%]{min-width:0}.chat-status[_ngcontent-%COMP%]{width:8px;height:8px;margin:0 16px 0 8px;border-radius:50%;background:var(--%NS%hub-status-stopped)}.chat-status.running[_ngcontent-%COMP%]{background:var(--%NS%hub-status-running)}.chat-status.dead[_ngcontent-%COMP%]{background:var(--%NS%hub-status-dead)}.agent-label[_ngcontent-%COMP%]{margin-left:auto;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small);text-transform:lowercase}.navigation-footer[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 20px;border-top:1px solid var(--%NS%mat-sys-outline-variant);color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-medium)}.socket-state[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:6px;text-transform:capitalize}.socket-dot[_ngcontent-%COMP%]{width:7px;height:7px;border-radius:50%;background:var(--%NS%hub-status-dead)}.socket-dot.connected[_ngcontent-%COMP%]{background:var(--%NS%hub-status-running)}.socket-dot.connecting[_ngcontent-%COMP%]{background:var(--%NS%hub-status-starting)}@media(min-width:840px){[_nghost-%COMP%] > .navigation-header[_ngcontent-%COMP%] > button[_ngcontent-%COMP%]:last-child{display:none}}"]})}};function Kj(t,n){if(t&1){let e=ae();m(0,"button",11),w("click",function(){q(e);let r=y(2),o=rt(2);return Y(r.openDrawer(o))}),m(1,"mat-icon"),g(2,"menu"),f()()}}function Jj(t,n){if(t&1&&(m(0,"mat-toolbar",4),E(1,Kj,3,0,"button",6),m(2,"span",7),g(3),f(),j(4,"span",8),m(5,"span",9),j(6,"span",10),m(7,"span"),g(8),f()()()),t&2){let e=y();p(),M(e.compact()?1:-1),p(2),k(e.state.activeProject()?.name||"Agent Hub"),p(2),L("aria-label","WebSocket "+e.state.wsStatus()),p(),Ke(e.state.wsStatus()),p(2),k(e.state.wsStatus())}}var Kf=class t{constructor(){this.state=c(Fe);this.compact=S(!1);this.breakpointObserver=c(zo);this.destroyRef=c(Xe);this.breakpointObserver.observe("(max-width: 839px)").pipe($m(this.destroyRef)).subscribe(({matches:n})=>{this.compact.set(n),n||this.state.setMobileDrawerOpen(!1)})}openDrawer(n){this.state.setMobileDrawerOpen(!0),n.open()}closeDrawer(n){this.state.setMobileDrawerOpen(!1),this.compact()&&n.close()}onDrawerChange(n){this.compact()&&this.state.setMobileDrawerOpen(n)}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-root"]],decls:8,vars:3,consts:[["drawer",""],[1,"hub-shell"],["aria-label","Project and chat navigation",3,"openedChange","mode","opened"],[3,"closeRequested"],[1,"top-bar"],[1,"page-content"],["mat-icon-button","","aria-label","Open navigation"],[1,"top-title"],[1,"toolbar-spacer"],[1,"socket-summary"],[1,"socket-dot"],["mat-icon-button","","aria-label","Open navigation",3,"click"]],template:function(e,i){if(e&1){let r=ae();m(0,"mat-sidenav-container",1)(1,"mat-sidenav",2,0),w("openedChange",function(a){return i.onDrawerChange(a)}),m(3,"hub-navigation",3),w("closeRequested",function(){q(r);let a=rt(2);return Y(i.closeDrawer(a))}),f()(),m(4,"mat-sidenav-content"),E(5,Jj,9,6,"mat-toolbar",4),m(6,"main",5),j(7,"router-outlet"),f()()()}e&2&&(p(),N("mode",i.compact()?"over":"side")("opened",!i.compact()||i.state.isMobileDrawerOpen()),p(4),M(i.state.activeChatId()?-1:5))},dependencies:[Oe,En,Pe,ze,sf,Bv,TD,of,RD,AD,Xf,bc],styles:["[_nghost-%COMP%]{display:block;height:100dvh}.hub-shell[_ngcontent-%COMP%]{height:100%}mat-sidenav[_ngcontent-%COMP%]{width:304px;max-width:86vw;border-right:1px solid var(--%NS%mat-sys-outline-variant)}mat-sidenav-content[_ngcontent-%COMP%]{display:flex;height:100%;min-height:0;flex-direction:column}.top-bar[_ngcontent-%COMP%]{flex:0 0 auto;gap:8px;border-bottom:1px solid var(--%NS%mat-sys-outline-variant);background:var(--%NS%mat-sys-surface)}.top-title[_ngcontent-%COMP%]{overflow:hidden;font:var(--%NS%mat-sys-title-medium);text-overflow:ellipsis;white-space:nowrap}.toolbar-spacer[_ngcontent-%COMP%]{flex:1}.socket-summary[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:7px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-medium);text-transform:capitalize}.socket-dot[_ngcontent-%COMP%]{width:7px;height:7px;border-radius:50%;background:var(--%NS%hub-status-dead)}.socket-dot.connected[_ngcontent-%COMP%]{background:var(--%NS%hub-status-running)}.socket-dot.connecting[_ngcontent-%COMP%]{background:var(--%NS%hub-status-starting)}.page-content[_ngcontent-%COMP%]{display:flex;min-height:0;flex:1;flex-direction:column}"]})}};var eV=["*",[["mat-option"],["ng-container"]]],tV=["*","mat-option, ng-container"],nV=["text"],iV=[[["mat-icon"]],"*"],rV=["mat-icon","*"];function oV(t,n){if(t&1&&j(0,"mat-pseudo-checkbox",1),t&2){let e=y();N("disabled",e.disabled)("state",e.selected?"checked":"unchecked")}}function aV(t,n){if(t&1&&j(0,"mat-pseudo-checkbox",3),t&2){let e=y();N("disabled",e.disabled)}}function sV(t,n){if(t&1&&(m(0,"span",4),g(1),f()),t&2){let e=y();p(),dt("(",e.group.label,")")}}var Jf=new C("MAT_OPTION_PARENT_COMPONENT"),eh=new C("MatOptgroup"),bb=(()=>{class t{label;disabled=!1;_labelId=c(Ue).getId("mat-optgroup-label-");_inert;constructor(){let e=c(Jf,{optional:!0});this._inert=e?.inertGroups??!1}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-optgroup"]],hostAttrs:[1,"mat-mdc-optgroup"],hostVars:3,hostBindings:function(i,r){i&2&&L("role",r._inert?null:"group")("aria-disabled",r._inert?null:r.disabled.toString())("aria-labelledby",r._inert?null:r._labelId)},inputs:{label:"label",disabled:[2,"disabled","disabled",G]},exportAs:["matOptgroup"],features:[Ne([{provide:eh,useExisting:t}])],ngContentSelectors:tV,decls:5,vars:4,consts:[["role","presentation",1,"mat-mdc-optgroup-label",3,"id"],[1,"mdc-list-item__primary-text"]],template:function(i,r){i&1&&(_e(eV),je(0,"span",0)(1,"span",1),g(2),B(3),Ze()(),B(4,1)),i&2&&(T("mdc-list-item--disabled",r.disabled),Wt("id",r._labelId),p(2),dt("",r.label," "))},styles:[`.mat-mdc-optgroup {
  color: var(--%NS%mat-optgroup-label-text-color, var(--%NS%mat-sys-on-surface-variant));
  font-family: var(--%NS%mat-optgroup-label-text-font, var(--%NS%mat-sys-title-small-font));
  line-height: var(--%NS%mat-optgroup-label-text-line-height, var(--%NS%mat-sys-title-small-line-height));
  font-size: var(--%NS%mat-optgroup-label-text-size, var(--%NS%mat-sys-title-small-size));
  letter-spacing: var(--%NS%mat-optgroup-label-text-tracking, var(--%NS%mat-sys-title-small-tracking));
  font-weight: var(--%NS%mat-optgroup-label-text-weight, var(--%NS%mat-sys-title-small-weight));
}

.mat-mdc-optgroup-label {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 48px;
  padding: 0 16px;
  outline: none;
}
.mat-mdc-optgroup-label.mdc-list-item--disabled {
  opacity: 0.38;
}
.mat-mdc-optgroup-label .mdc-list-item__primary-text {
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  white-space: normal;
  color: inherit;
}
`],encapsulation:2})}return t})(),vb=class{source;isUserInput;constructor(n,e=!1){this.source=n,this.isUserInput=e}},Hs=(()=>{class t{_element=c(F);_changeDetectorRef=c(Me);_parent=c(Jf,{optional:!0});group=c(eh,{optional:!0});_signalDisableRipple=!1;_selected=!1;_active=!1;_mostRecentViewValue="";get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=c(Ue).getId("mat-option-");get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=S(!1);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return!!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new O;_text;_stateChanges=new I;constructor(){let e=c(Je);e.load(pn),e.load(hs),this._signalDisableRipple=!!this._parent&&yn(this._parent.disableRipple)}get active(){return this._active}get viewValue(){return(this._text?.nativeElement.textContent||"").trim()}select(e=!0){this._selected||(this._selected=!0,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}deselect(e=!0){this._selected&&(this._selected=!1,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}focus(e,i){let r=this._getHostElement();typeof r.focus=="function"&&r.focus(i)}setActiveStyles(){this._active||(this._active=!0,this._changeDetectorRef.markForCheck())}setInactiveStyles(){this._active&&(this._active=!1,this._changeDetectorRef.markForCheck())}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!ut(e)&&(this._selectViaInteraction(),e.preventDefault())}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:!0,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(!0))}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e)}}ngOnDestroy(){this._stateChanges.complete()}_emitSelectionChangeEvent(e=!1){this.onSelectionChange.emit(new vb(this,e))}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-option"]],viewQuery:function(i,r){if(i&1&&Re(nV,7),i&2){let o;z(o=$())&&(r._text=o.first)}},hostAttrs:["role","option",1,"mat-mdc-option","mdc-list-item"],hostVars:11,hostBindings:function(i,r){i&1&&w("click",function(){return r._selectViaInteraction()})("keydown",function(a){return r._handleKeydown(a)}),i&2&&(Wt("id",r.id),L("aria-selected",r.selected)("aria-disabled",r.disabled.toString()),T("mdc-list-item--selected",r.selected)("mat-mdc-option-multiple",r.multiple)("mat-mdc-option-active",r.active)("mdc-list-item--disabled",r.disabled))},inputs:{value:"value",id:"id",disabled:[2,"disabled","disabled",G]},outputs:{onSelectionChange:"onSelectionChange"},exportAs:["matOption"],ngContentSelectors:rV,decls:8,vars:5,consts:[["text",""],["aria-hidden","true",1,"mat-mdc-option-pseudo-checkbox",3,"disabled","state"],[1,"mdc-list-item__primary-text"],["state","checked","aria-hidden","true","appearance","minimal",1,"mat-mdc-option-pseudo-checkbox",3,"disabled"],[1,"cdk-visually-hidden"],["aria-hidden","true","mat-ripple","",1,"mat-mdc-option-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled"]],template:function(i,r){i&1&&(_e(iV),E(0,oV,1,2,"mat-pseudo-checkbox",1),B(1),m(2,"span",2,0),B(4,1),f(),E(5,aV,1,1,"mat-pseudo-checkbox",3),E(6,sV,2,1,"span",4),j(7,"div",5)),i&2&&(M(r.multiple?0:-1),p(5),M(!r.multiple&&r.selected&&!r.hideSingleSelectionIndicator?5:-1),p(),M(r.group&&r.group._inert?6:-1),p(),N("matRippleTrigger",r._getHostElement())("matRippleDisabled",r.disabled||r.disableRipple))},dependencies:[uE,tr],styles:[`.mat-mdc-option {
  -webkit-user-select: none;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 48px;
  padding: 0 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--%NS%mat-option-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-option-label-text-font, var(--%NS%mat-sys-label-large-font));
  line-height: var(--%NS%mat-option-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-size: var(--%NS%mat-option-label-text-size, var(--%NS%mat-sys-body-large-size));
  letter-spacing: var(--%NS%mat-option-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  font-weight: var(--%NS%mat-option-label-text-weight, var(--%NS%mat-sys-body-large-weight));
}
.mat-mdc-option:hover:not(.mdc-list-item--disabled) {
  background-color: var(--%NS%mat-option-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {
  background-color: var(--%NS%mat-option-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));
  outline: 0;
}
.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {
  background-color: var(--%NS%mat-option-selected-state-layer-color, var(--%NS%mat-sys-secondary-container));
}
.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {
  color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-option .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-option.mdc-list-item {
  align-items: center;
  background: transparent;
}
.mat-mdc-option.mdc-list-item--disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {
  opacity: 0.38;
}
.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 32px;
}
[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 16px;
  padding-right: 32px;
}
.mat-mdc-option .mat-icon,
.mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-icon,
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 0;
  margin-left: 16px;
}
.mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-left: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-right: 16px;
  margin-left: 0;
}
.mat-mdc-option .mat-mdc-option-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-option .mdc-list-item__primary-text {
  white-space: normal;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  margin-right: auto;
}
[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {
  margin-right: 0;
  margin-left: auto;
}
@media (forced-colors: active) {
  .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
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
  [dir=rtl] .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-option-multiple {
  --%NS%mat-list-list-item-selected-container-color: var(--%NS%mat-list-list-item-container-color, transparent);
}

.mat-mdc-option-active .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})}return t})();function pM(t,n,e){if(e.length){let i=n.toArray(),r=e.toArray(),o=0;for(let a=0;a<t+1;a++)i[a].group&&i[a].group===r[o]&&o++;return o}return 0}function gM(t,n,e,i){return t<e?t:t+n>e+i?Math.max(0,t-i+n):e}var yb=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[Lr,Ef,Hs,ge]})}return t})();var lV=["trigger"],cV=["panel"],dV=[[["mat-select-trigger"]],"*"],uV=["mat-select-trigger","*"];function mV(t,n){if(t&1&&(m(0,"span",4),g(1),f()),t&2){let e=y();p(),k(e.placeholder)}}function fV(t,n){t&1&&B(0)}function hV(t,n){if(t&1&&(m(0,"span",11),g(1),f()),t&2){let e=y(2);p(),k(e.triggerValue)}}function pV(t,n){if(t&1&&(m(0,"span",5),E(1,fV,1,0)(2,hV,2,1,"span",11),f()),t&2){let e=y();p(),M(e.customTrigger?1:2)}}function gV(t,n){if(t&1){let e=ae();m(0,"div",12,1),w("keydown",function(r){q(e);let o=y();return Y(o._handleKeydown(r))}),B(2,1),f()}if(t&2){let e=y();Ke(e.panelClass),T("mat-select-panel-animations-enabled",!e._animationsDisabled)("mat-primary",e._parentFormField?.color==="primary")("mat-accent",e._parentFormField?.color==="accent")("mat-warn",e._parentFormField?.color==="warn")("mat-undefined",!e._parentFormField?.color),L("id",e.id+"-panel")("aria-multiselectable",e.multiple)("aria-label",e.ariaLabel||null)("aria-labelledby",e._getPanelAriaLabelledby())}}var _V=new C("mat-select-scroll-strategy",{providedIn:"root",factory:()=>{let t=c(X);return()=>or(t)}}),vV=new C("MAT_SELECT_CONFIG"),bV=new C("MatSelectTrigger"),Cb=class{source;value;constructor(n,e){this.source=n,this.value=e}},_M=(()=>{class t{_viewportRuler=c(Mn);_changeDetectorRef=c(Me);_elementRef=c(F);_dir=c(wt,{optional:!0});_idGenerator=c(Ue);_renderer=c(Se);_parentFormField=c(ed,{optional:!0});ngControl=c(Bn,{self:!0,optional:!0});_liveAnnouncer=c(Nv);_defaultOptions=c(vV,{optional:!0});_animationsDisabled=Te();_popoverLocation;_initialized=new I;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"}];_scrollOptionIntoView(e){let i=this.options.toArray()[e];if(i){let r=this.panel.nativeElement,o=pM(e,this.options,this.optionGroups),a=i._getHostElement();e===0&&o===1?r.scrollTop=0:r.scrollTop=gM(a.offsetTop,a.offsetHeight,r.scrollTop,r.offsetHeight)}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0)}_getChangeEvent(e){return new Cb(this,e)}_scrollStrategyFactory=c(_V);_panelOpen=!1;_compareWith=(e,i)=>e===i;_uid=this._idGenerator.getId("mat-select-");_triggerAriaLabelledBy=null;_previousControl;_destroy=new I;_errorStateTracker;stateChanges=new I;disableAutomaticLabeling=!0;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId("mat-select-value-");_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||"";get focused(){return this._focused||this._panelOpen}_focused=!1;controlType="mat-select";trigger;panel;_overlayDir;panelClass;disabled=!1;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e)}_disableRipple=S(!1);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties()}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??!1;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next()}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(Qo.required)??!1}set required(e){this._required=e,this.stateChanges.next()}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e}_multiple=!1;disableOptionCentering=this._defaultOptions?.disableOptionCentering??!1;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection()}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e)}_value;ariaLabel="";ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next()}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<"u"?this._defaultOptions.panelWidth:"auto";canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??!1;optionSelectionChanges=Yn(()=>{let e=this.options;return e?e.changes.pipe(qe(e),gt(()=>mt(...e.map(i=>i.onSelectionChange)))):this._initialized.pipe(gt(()=>this.optionSelectionChanges))});openedChange=new O;_openedStream=this.openedChange.pipe(ue(e=>e),J(()=>{}));_closedStream=this.openedChange.pipe(ue(e=>!e),J(()=>{}));selectionChange=new O;valueChange=new O;constructor(){let e=c(Gf),i=c($c,{optional:!0}),r=c(Wc,{optional:!0}),o=c(new Cn("tabindex"),{optional:!0}),a=c(Qc,{optional:!0}),s=c(Wf,{optional:!0,self:!0});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new js(e,s||this.ngControl,r,i,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=o==null?0:parseInt(o)||0,this._popoverLocation=a?.usePopover===!1?null:"inline",this.id=this.id}ngOnInit(){this._selectionModel=new Fc(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(he(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges())})}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(he(this._destroy)).subscribe(e=>{e.added.forEach(i=>i.select()),e.removed.forEach(i=>i.deselect())}),this.options.changes.pipe(qe(null),he(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection()})}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),i=this.ngControl;if(e!==this._triggerAriaLabelledBy){let r=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?r.setAttribute("aria-labelledby",e):r.removeAttribute("aria-labelledby")}i&&(this._previousControl!==i.control&&(this._previousControl!==void 0&&i.disabled!==null&&i.disabled!==this.disabled&&(this.disabled=i.disabled),this._previousControl=i.control),this.updateErrorState())}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass))}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete()}toggle(){this.panelOpen?this.close():this.open()}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._panelOpen=!0,this._overlayDir.positionChange.pipe(Le(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled()}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!0)))}close(){this._panelOpen&&(this._panelOpen=!1,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?"rtl":"ltr"),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!1)))}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{i(),clearTimeout(r),this._cleanupDetach=void 0};let e=this.panel.nativeElement,i=this._renderer.listen(e,"animationend",o=>{o.animationName==="_mat-select-exit"&&(this._cleanupDetach?.(),this._detachOverlay())}),r=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay()},200);e.classList.add("mat-select-panel-exit")}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck()}writeValue(e){this._assignValue(e)}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next()}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return"";if(this._multiple){let e=this._selectionModel.selected.map(i=>i.viewValue);return this._isRtl()&&e.reverse(),e.join(", ")}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState()}_isRtl(){return this._dir?this._dir.value==="rtl":!1}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e))}_handleClosedKeydown(e){let i=e.keyCode,r=i===40||i===38||i===37||i===39,o=i===13||i===32,a=this._keyManager;if(!a.isTyping()&&o&&!ut(e)||(this.multiple||e.altKey)&&r)e.preventDefault(),this.open();else if(!this.multiple){let s=this.selected;a.onKeydown(e);let l=this.selected;l&&s!==l&&this._liveAnnouncer.announce(l.viewValue,1e4)}}_handleOpenKeydown(e){let i=this._keyManager,r=e.keyCode,o=r===40||r===38,a=i.isTyping();if(o&&e.altKey)e.preventDefault(),this.close();else if(!a&&(r===13||r===32)&&i.activeItem&&!ut(e))e.preventDefault(),i.activeItem._selectViaInteraction();else if(!a&&this._multiple&&r===65&&e.ctrlKey){e.preventDefault();let s=this.options.some(l=>!l.disabled&&!l.selected);this.options.forEach(l=>{l.disabled||(s?l.select():l.deselect())})}else{let s=i.activeItemIndex;i.onKeydown(e),this._multiple&&o&&e.shiftKey&&i.activeItem&&i.activeItemIndex!==s&&i.activeItem._selectViaInteraction()}}_handleOverlayKeydown(e){e.keyCode===27&&!ut(e)&&(e.preventDefault(),this.close())}_onFocus(){this.disabled||(this._focused=!0,this.stateChanges.next())}_onBlur(){this._focused=!1,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next())}get empty(){return!this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next()})}_setSelectionByValue(e){if(this.options.forEach(i=>i.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)Array.isArray(e),e.forEach(i=>this._selectOptionByValue(i)),this._sortValues();else{let i=this._selectOptionByValue(e);i?this._keyManager.updateActiveItem(i):this.panelOpen||this._keyManager.updateActiveItem(-1)}this._changeDetectorRef.markForCheck()}_selectOptionByValue(e){let i=this.options.find(r=>{if(this._selectionModel.isSelected(r))return!1;try{return(r.value!=null||this.canSelectNullableOptions)&&this._compareWith(r.value,e)}catch{return!1}});return i&&this._selectionModel.select(i),i}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,!0):!1}_skipPredicate=e=>this.panelOpen?!1:e.disabled;_getOverlayWidth(e){return this.panelWidth==="auto"?(e instanceof ks?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?"":this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck()}_initKeyManager(){this._keyManager=new Tc(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?"rtl":"ltr").withHomeAndEnd().withPageUpDown().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close())}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction()})}_resetOptions(){let e=mt(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(he(e)).subscribe(i=>{this._onSelect(i.source,i.isUserInput),i.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus())}),mt(...this.options.map(i=>i._stateChanges)).pipe(he(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next()})}_onSelect(e,i){let r=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(r!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),i&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),i&&this.focus())),r!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next()}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((i,r)=>this.sortComparator?this.sortComparator(i,r,e):e.indexOf(i)-e.indexOf(r)),this.stateChanges.next()}}_propagateChanges(e){let i;this.multiple?i=this.selected.map(r=>r.value):i=this.selected?this.selected.value:e,this._value=i,this.valueChange.emit(i),this._onChange(i),this.selectionChange.emit(this._getChangeEvent(i)),this._changeDetectorRef.markForCheck()}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let i=0;i<this.options.length;i++)if(!this.options.get(i).disabled){e=i;break}this._keyManager.setActiveItem(e)}else this._keyManager.setActiveItem(this._selectionModel.selected[0])}_canOpen(){return!this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e)}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,i=e?e+" ":"";return this.ariaLabelledby?i+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||"";return this.ariaLabelledby&&(e+=" "+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let i=this._elementRef.nativeElement;e.length?i.setAttribute("aria-describedby",e.join(" ")):i.removeAttribute("aria-describedby")}onContainerClick(e){let i=zt(e);i&&(i.tagName==="MAT-OPTION"||i.classList.contains("cdk-overlay-backdrop")||i.closest(".mat-mdc-select-panel"))||(this.focus(),this.open())}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-select"]],contentQueries:function(i,r,o){if(i&1&&ct(o,bV,5)(o,Hs,5)(o,eh,5),i&2){let a;z(a=$())&&(r.customTrigger=a.first),z(a=$())&&(r.options=a),z(a=$())&&(r.optionGroups=a)}},viewQuery:function(i,r){if(i&1&&Re(lV,5)(cV,5)(Ff,5),i&2){let o;z(o=$())&&(r.trigger=o.first),z(o=$())&&(r.panel=o.first),z(o=$())&&(r._overlayDir=o.first)}},hostAttrs:["role","combobox","aria-haspopup","listbox",1,"mat-mdc-select"],hostVars:21,hostBindings:function(i,r){i&1&&w("keydown",function(a){return r._handleKeydown(a)})("focus",function(){return r._onFocus()})("blur",function(){return r._onBlur()}),i&2&&(L("id",r.id)("tabindex",r.disabled?-1:r.tabIndex)("aria-controls",r.panelOpen?r.id+"-panel":null)("aria-expanded",r.panelOpen)("aria-label",r.ariaLabel||null)("aria-required",r.required.toString())("aria-disabled",r.disabled.toString())("aria-invalid",r.errorState)("aria-activedescendant",r._getAriaActiveDescendant()),T("mat-mdc-select-disabled",r.disabled)("mat-mdc-select-invalid",r.errorState)("mat-mdc-select-required",r.required)("mat-mdc-select-empty",r.empty)("mat-mdc-select-multiple",r.multiple)("mat-select-open",r.panelOpen))},inputs:{userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],panelClass:"panelClass",disabled:[2,"disabled","disabled",G],disableRipple:[2,"disableRipple","disableRipple",G],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:Nt(e)],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",G],placeholder:"placeholder",required:[2,"required","required",G],multiple:[2,"multiple","multiple",G],disableOptionCentering:[2,"disableOptionCentering","disableOptionCentering",G],compareWith:"compareWith",value:"value",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],errorStateMatcher:"errorStateMatcher",typeaheadDebounceInterval:[2,"typeaheadDebounceInterval","typeaheadDebounceInterval",Nt],sortComparator:"sortComparator",id:"id",panelWidth:"panelWidth",canSelectNullableOptions:[2,"canSelectNullableOptions","canSelectNullableOptions",G]},outputs:{openedChange:"openedChange",_openedStream:"opened",_closedStream:"closed",selectionChange:"selectionChange",valueChange:"valueChange"},exportAs:["matSelect"],features:[Ne([{provide:Jc,useExisting:t},{provide:Jf,useExisting:t}]),Ae],ngContentSelectors:uV,decls:11,vars:10,consts:[["fallbackOverlayOrigin","cdkOverlayOrigin","trigger",""],["panel",""],["cdk-overlay-origin","",1,"mat-mdc-select-trigger",3,"click"],[1,"mat-mdc-select-value"],[1,"mat-mdc-select-placeholder","mat-mdc-select-min-line"],[1,"mat-mdc-select-value-text"],[1,"mat-mdc-select-arrow-wrapper"],[1,"mat-mdc-select-arrow"],["viewBox","0 0 24 24","width","24px","height","24px","focusable","false","aria-hidden","true"],["d","M7 10l5 5 5-5z"],["cdk-connected-overlay","","cdkConnectedOverlayHasBackdrop","","cdkConnectedOverlayBackdropClass","cdk-overlay-transparent-backdrop",3,"detach","backdropClick","overlayKeydown","cdkConnectedOverlayDisableClose","cdkConnectedOverlayPanelClass","cdkConnectedOverlayScrollStrategy","cdkConnectedOverlayOrigin","cdkConnectedOverlayPositions","cdkConnectedOverlayWidth","cdkConnectedOverlayFlexibleDimensions","cdkConnectedOverlayUsePopover"],[1,"mat-mdc-select-min-line"],["role","listbox","tabindex","-1",1,"mat-mdc-select-panel","mdc-menu-surface","mdc-menu-surface--open",3,"keydown"]],template:function(i,r){if(i&1&&(_e(dV),m(0,"div",2,0),w("click",function(){return r.open()}),m(3,"div",3),E(4,mV,2,1,"span",4)(5,pV,3,1,"span",5),f(),m(6,"div",6)(7,"div",7),fn(),m(8,"svg",8),j(9,"path",9),f()()()(),yt(10,gV,3,16,"ng-template",10),w("detach",function(){return r.close()})("backdropClick",function(){return r.close()})("overlayKeydown",function(a){return r._handleOverlayKeydown(a)})),i&2){let o=rt(1);p(3),L("id",r._valueId),p(),M(r.empty?4:5),p(6),N("cdkConnectedOverlayDisableClose",!0)("cdkConnectedOverlayPanelClass",r._overlayPanelClass)("cdkConnectedOverlayScrollStrategy",r._scrollStrategy)("cdkConnectedOverlayOrigin",r._preferredOverlayOrigin||o)("cdkConnectedOverlayPositions",r._positions)("cdkConnectedOverlayWidth",r._overlayWidth)("cdkConnectedOverlayFlexibleDimensions",!0)("cdkConnectedOverlayUsePopover",r._popoverLocation)}},dependencies:[ks,Ff],styles:[`@keyframes _mat-select-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-select-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-select {
  display: inline-block;
  width: 100%;
  outline: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--%NS%mat-select-enabled-trigger-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-select-trigger-text-font, var(--%NS%mat-sys-body-large-font));
  line-height: var(--%NS%mat-select-trigger-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  font-size: var(--%NS%mat-select-trigger-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-select-trigger-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-select-trigger-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}

div.mat-mdc-select-panel {
  box-shadow: var(--%NS%mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}

.mat-mdc-select-disabled {
  color: var(--%NS%mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-select-disabled .mat-mdc-select-placeholder {
  color: var(--%NS%mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-select-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.mat-mdc-select-disabled .mat-mdc-select-trigger {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

.mat-mdc-select-value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mat-mdc-select-value-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mat-mdc-select-arrow-wrapper {
  height: 24px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {
  transform: none;
}

.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,
.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-select-invalid-arrow-color, var(--%NS%mat-sys-error));
}

.mat-mdc-select-arrow {
  width: 10px;
  height: 5px;
  position: relative;
  color: var(--%NS%mat-select-enabled-arrow-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {
  color: var(--%NS%mat-select-focused-arrow-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {
  color: var(--%NS%mat-select-disabled-arrow-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-select-open .mat-mdc-select-arrow {
  transform: rotate(180deg);
}
.mat-form-field-animations-enabled .mat-mdc-select-arrow {
  transition: transform 80ms linear;
}
.mat-mdc-select-arrow svg {
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (forced-colors: active) {
  .mat-mdc-select-arrow svg {
    fill: CanvasText;
  }
  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {
    fill: GrayText;
  }
}

div.mat-mdc-select-panel {
  width: 100%;
  max-height: 275px;
  outline: 0;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  transform-origin: top center;
  border-radius: 0 0 4px 4px;
  position: relative;
  background-color: var(--%NS%mat-select-panel-background-color, var(--%NS%mat-sys-surface-container));
}
.mat-mdc-select-panel-above div.mat-mdc-select-panel {
  border-radius: 4px 4px 0 0;
  transform-origin: bottom center;
}
@media (forced-colors: active) {
  div.mat-mdc-select-panel {
    outline: solid 1px;
  }
}

.mat-select-panel-animations-enabled {
  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1);
}
.mat-select-panel-animations-enabled.mat-select-panel-exit {
  animation: _mat-select-exit 100ms linear;
}

.mat-mdc-select-placeholder {
  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--%NS%mat-select-placeholder-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {
  transition: none;
}
.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {
  color: transparent;
  -webkit-text-fill-color: transparent;
  transition: none;
  display: block;
}

.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {
  cursor: pointer;
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {
  max-width: calc(100% - 18px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {
  max-width: calc(100% / 0.75 - 24px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {
  max-width: calc(100% - 60px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {
  max-width: calc(100% - 24px);
}

.mat-mdc-select-min-line:empty::before {
  content: " ";
  white-space: pre;
  width: 1px;
  display: inline-block;
  visibility: hidden;
}

.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {
  transform: var(--%NS%mat-select-arrow-transform, translateY(-8px));
}
`],encapsulation:2})}return t})();var vM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ci,yb,ge,Vn,dn,yb]})}return t})();var CV=["*"],bM=(()=>{class t{labelPosition="after";static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["","mat-internal-form-field",""]],hostAttrs:[1,"mdc-form-field","mat-internal-form-field"],hostVars:2,hostBindings:function(i,r){i&2&&T("mdc-form-field--align-end",r.labelPosition==="before")},inputs:{labelPosition:"labelPosition"},ngContentSelectors:CV,decls:1,vars:0,template:function(i,r){i&1&&(_e(),B(0))},styles:[`.mat-internal-form-field {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
.mat-internal-form-field > label, .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
  order: 0;
}
[dir=rtl] .mat-internal-form-field > label, [dir=rtl] .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
}

.mdc-form-field--align-end > label, .mdc-form-field--align-end > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
  order: -1;
}
[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label, [dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
}
`],encapsulation:2})}return t})();var wV=["switch"],SV=["*"];function xV(t,n){t&1&&(m(0,"span",11),fn(),m(1,"svg",13),j(2,"path",14),f(),m(3,"svg",15),j(4,"path",16),f()())}var DV=new C("mat-slide-toggle-default-options",{providedIn:"root",factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})}),th=class{source;checked;constructor(n,e){this.source=n,this.checked=e}},wb=(()=>{class t{_elementRef=c(F);_focusMonitor=c(Bt);_changeDetectorRef=c(Me);defaults=c(DV);_onChange=e=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(e){return new th(this,e)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=Te();_focused=!1;name=null;id;labelPosition="after";ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(e){this._checked=e,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new O;toggleChange=new O;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){c(Je).load(pn);let e=c(new Cn("tabindex"),{optional:!0}),i=this.defaults;this.tabIndex=e==null?0:parseInt(e)||0,this.color=i.color||"accent",this.id=this._uniqueId=c(Ue).getId("mat-mdc-slide-toggle-"),this.hideIcon=i.hideIcon??!1,this.disabledInteractive=i.disabledInteractive??!1,this._labelId=this._uniqueId+"-label"}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(e=>{e==="keyboard"||e==="program"?(this._focused=!0,this._changeDetectorRef.markForCheck()):e||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(e){e.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(e){this.checked=!!e}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}validate(e){return this.required&&e.value!==!0?{required:!0}:null}registerOnValidatorChange(e){this._validatorOnChange=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new th(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-slide-toggle"]],viewQuery:function(i,r){if(i&1&&Re(wV,5),i&2){let o;z(o=$())&&(r._switchElement=o.first)}},hostAttrs:[1,"mat-mdc-slide-toggle"],hostVars:15,hostBindings:function(i,r){i&2&&(Wt("id",r.id),L("tabindex",null)("aria-label",null)("name",null)("aria-labelledby",null),Ke(r.color?"mat-"+r.color:""),T("mat-mdc-slide-toggle-focused",r._focused)("mat-mdc-slide-toggle-checked",r.checked)("mat-slide-toggle-full-width",r.fullWidth)("_mat-animation-noopable",r._noopAnimations))},inputs:{name:"name",id:"id",labelPosition:"labelPosition",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],required:[2,"required","required",G],color:"color",disabled:[2,"disabled","disabled",G],fullWidth:[2,"fullWidth","fullWidth",G],disableRipple:[2,"disableRipple","disableRipple",G],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:Nt(e)],checked:[2,"checked","checked",G],hideIcon:[2,"hideIcon","hideIcon",G],disabledInteractive:[2,"disabledInteractive","disabledInteractive",G]},outputs:{change:"change",toggleChange:"toggleChange"},exportAs:["matSlideToggle"],features:[Ne([{provide:zc,useExisting:Jt(()=>t),multi:!0},{provide:Xo,useExisting:t,multi:!0}]),Ae],ngContentSelectors:SV,decls:14,vars:27,consts:[["switch",""],["mat-internal-form-field","",3,"labelPosition"],["role","switch","type","button",1,"mdc-switch",3,"click","tabIndex","disabled"],[1,"mat-mdc-slide-toggle-touch-target"],[1,"mdc-switch__track"],[1,"mdc-switch__handle-track"],[1,"mdc-switch__handle"],[1,"mdc-switch__shadow"],[1,"mdc-elevation-overlay"],[1,"mdc-switch__ripple"],["mat-ripple","",1,"mat-mdc-slide-toggle-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled","matRippleCentered"],[1,"mdc-switch__icons"],[1,"mdc-label",3,"click","for"],["viewBox","0 0 24 24","aria-hidden","true",1,"mdc-switch__icon","mdc-switch__icon--on"],["d","M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"],["viewBox","0 0 24 24","aria-hidden","true",1,"mdc-switch__icon","mdc-switch__icon--off"],["d","M20 13H4v-2h16v2z"]],template:function(i,r){if(i&1&&(_e(),m(0,"div",1)(1,"button",2,0),w("click",function(){return r._handleClick()}),j(3,"div",3)(4,"span",4),m(5,"span",5)(6,"span",6)(7,"span",7),j(8,"span",8),f(),m(9,"span",9),j(10,"span",10),f(),E(11,xV,5,0,"span",11),f()()(),m(12,"label",12),w("click",function(a){return a.stopPropagation()}),B(13),f()()),i&2){let o=rt(2);N("labelPosition",r.labelPosition),p(),T("mdc-switch--selected",r.checked)("mdc-switch--unselected",!r.checked)("mdc-switch--checked",r.checked)("mdc-switch--disabled",r.disabled)("mat-mdc-slide-toggle-disabled-interactive",r.disabledInteractive),N("tabIndex",r.disabled&&!r.disabledInteractive?-1:r.tabIndex)("disabled",r.disabled&&!r.disabledInteractive),L("id",r.buttonId)("name",r.name)("aria-label",r.ariaLabel)("aria-labelledby",r._getAriaLabelledBy())("aria-describedby",r.ariaDescribedby)("aria-required",r.required||null)("aria-checked",r.checked)("aria-disabled",r.disabled&&r.disabledInteractive?"true":null),p(9),N("matRippleTrigger",o)("matRippleDisabled",r.disableRipple||r.disabled)("matRippleCentered",!0),p(),M(r.hideIcon?-1:11),p(),N("for",r.buttonId),L("id",r._labelId)}},dependencies:[tr,bM],styles:[`.mdc-switch {
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 0;
  position: relative;
  width: var(--%NS%mat-slide-toggle-track-width, 52px);
}
.mdc-switch.mdc-switch--disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-switch.mat-mdc-slide-toggle-disabled-interactive {
  pointer-events: auto;
}

.mdc-switch__track {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: var(--%NS%mat-slide-toggle-track-height, 32px);
  border-radius: var(--%NS%mat-slide-toggle-track-shape, var(--%NS%mat-sys-corner-full));
}
.mdc-switch--disabled.mdc-switch .mdc-switch__track {
  opacity: var(--%NS%mat-slide-toggle-disabled-track-opacity, 0.12);
}
.mdc-switch__track::before, .mdc-switch__track::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  width: 100%;
  border-width: var(--%NS%mat-slide-toggle-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-track-outline-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--selected .mdc-switch__track::before, .mdc-switch--selected .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-selected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-selected-track-outline-color, transparent);
}
.mdc-switch--disabled .mdc-switch__track::before, .mdc-switch--disabled .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-color, var(--%NS%mat-sys-on-surface));
}
@media (forced-colors: active) {
  .mdc-switch__track {
    border-color: currentColor;
  }
}
.mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: translateX(0);
  background: var(--%NS%mat-slide-toggle-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch--selected .mdc-switch__track::before {
  transform: translateX(-100%);
}
.mdc-switch--selected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-hover-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-focus-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:active .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-track-color, var(--%NS%mat-sys-surface-variant));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::before, .mdc-switch.mdc-switch--disabled .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch__track::after {
  transform: translateX(-100%);
  background: var(--%NS%mat-slide-toggle-selected-track-color, var(--%NS%mat-sys-primary));
}
[dir=rtl] .mdc-switch__track::after {
  transform: translateX(100%);
}
.mdc-switch--selected .mdc-switch__track::after {
  transform: translateX(0);
}
.mdc-switch--selected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:active .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-track-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::after, .mdc-switch.mdc-switch--disabled .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-track-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch__handle-track {
  height: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  left: 0;
  right: auto;
  transform: translateX(0);
  width: calc(100% - var(--%NS%mat-slide-toggle-handle-width));
}
[dir=rtl] .mdc-switch__handle-track {
  left: auto;
  right: 0;
}
.mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(-100%);
}

.mdc-switch__handle {
  display: flex;
  pointer-events: auto;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: auto;
  transition: width 75ms cubic-bezier(0.4, 0, 0.2, 1), height 75ms cubic-bezier(0.4, 0, 0.2, 1), margin 75ms cubic-bezier(0.4, 0, 0.2, 1);
  width: var(--%NS%mat-slide-toggle-handle-width);
  height: var(--%NS%mat-slide-toggle-handle-height);
  border-radius: var(--%NS%mat-slide-toggle-handle-shape, var(--%NS%mat-sys-corner-full));
}
[dir=rtl] .mdc-switch__handle {
  left: auto;
  right: 0;
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  margin: var(--%NS%mat-slide-toggle-unselected-handle-horizontal-margin, 0 8px);
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-unselected-with-icon-handle-horizontal-margin, 0 4px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  margin: var(--%NS%mat-slide-toggle-selected-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-selected-with-icon-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch__handle:has(.mdc-switch__icons) {
  width: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
}
.mat-mdc-slide-toggle .mdc-switch:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
  height: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%selected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-selected-pressed-handle-horizontal-margin, 0 22px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%unselected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-unselected-pressed-handle-horizontal-margin, 0 2px);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-handle-opacity, 1);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-handle-opacity, 0.38);
}
.mdc-switch__handle::before, .mdc-switch__handle::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  width: 100%;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1), border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}
@media (forced-colors: active) {
  .mdc-switch__handle::before, .mdc-switch__handle::after {
    border-color: currentColor;
  }
}
.mdc-switch--%NS%selected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-handle-color, var(--%NS%mat-sys-on-primary));
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-handle-color, var(--%NS%mat-sys-primary-container));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:hover:not(:focus):not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:focus:not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:active .mdc-switch__handle::after, .mdc-switch--selected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-handle-color, var(--%NS%mat-sys-surface));
}
.mdc-switch--%NS%unselected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-handle-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--%NS%unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-handle-color, var(--%NS%mat-sys-on-surface));
}
.mdc-switch__handle::before {
  background: var(--%NS%mat-slide-toggle-handle-surface-color);
}

.mdc-switch__shadow {
  border-radius: inherit;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.mdc-switch:enabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-handle-elevation-shadow);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__shadow, .mdc-switch.mdc-switch--disabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-disabled-handle-elevation-shadow);
}

.mdc-switch__ripple {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  width: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
  height: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
}
.mdc-switch__ripple::after {
  content: "";
  opacity: 0;
}
.mdc-switch--disabled .mdc-switch__ripple::after {
  display: none;
}
.mat-mdc-slide-toggle-disabled-interactive .mdc-switch__ripple::after {
  display: block;
}
.mdc-switch:hover .mdc-switch__ripple::after {
  transition: 75ms opacity cubic-bezier(0, 0, 0.2, 1);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:focus .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:active .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:hover:not(:focus) .mdc-switch__ripple::after, .mdc-switch--%NS%unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}

.mdc-switch__icons {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 1;
  transform: translateZ(0);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-icon-opacity, 0.38);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-icon-opacity, 0.38);
}

.mdc-switch__icon {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1);
}
.mdc-switch--unselected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-selected-icon-color, var(--%NS%mat-sys-on-primary-container));
}
.mdc-switch--selected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-selected-icon-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch--selected .mdc-switch__icon--on,
.mdc-switch--unselected .mdc-switch__icon--off {
  opacity: 1;
  transition: opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1);
}

.mat-mdc-slide-toggle {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  -webkit-tap-highlight-color: transparent;
  outline: 0;
}
.mat-mdc-slide-toggle .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple,
.mat-mdc-slide-toggle .mdc-switch__ripple::after {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple:not(:empty),
.mat-mdc-slide-toggle .mdc-switch__ripple::after:not(:empty) {
  transform: translateZ(0);
}
.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mat-focus-indicator::before {
  content: "";
}
.mat-mdc-slide-toggle .mat-internal-form-field {
  color: var(--%NS%mat-slide-toggle-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-slide-toggle-label-text-font, var(--%NS%mat-sys-body-medium-font));
  line-height: var(--%NS%mat-slide-toggle-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-slide-toggle-label-text-size, var(--%NS%mat-sys-body-medium-size));
  letter-spacing: var(--%NS%mat-slide-toggle-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
  font-weight: var(--%NS%mat-slide-toggle-label-text-weight, var(--%NS%mat-sys-body-medium-weight));
}
.mat-mdc-slide-toggle .mat-ripple-element {
  opacity: 0.12;
}
.mat-mdc-slide-toggle .mat-focus-indicator::before {
  border-radius: 50%;
}
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle-track,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__icon,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::after,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::after {
  transition: none;
}
.mat-mdc-slide-toggle .mdc-switch:enabled + .mdc-label {
  cursor: pointer;
}
.mat-mdc-slide-toggle .mdc-switch--disabled + label {
  color: var(--%NS%mat-slide-toggle-disabled-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-slide-toggle label:empty {
  display: none;
}

.mat-slide-toggle-full-width {
  width: 100%;
}
.mat-slide-toggle-full-width .mat-internal-form-field {
  width: 100%;
  justify-content: space-between;
}
.mat-slide-toggle-full-width .mat-internal-form-field label {
  margin: 0;
  flex-grow: 1;
  text-align: end;
}
.mat-slide-toggle-full-width .mdc-form-field--align-end label {
  text-align: start;
}

.mat-mdc-slide-toggle-touch-target {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--%NS%mat-slide-toggle-touch-target-size, 48px);
  width: 100%;
  transform: translate(-50%, -50%);
  display: var(--%NS%mat-slide-toggle-touch-target-display, block);
}
[dir=rtl] .mat-mdc-slide-toggle-touch-target {
  left: auto;
  right: 50%;
  transform: translate(50%, -50%);
}
`],encapsulation:2})}return t})(),yM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[wb,ge]})}return t})();var MV=()=>[],NV=(t,n)=>n.id;function IV(t,n){if(t&1&&(m(0,"div",2),g(1),f()),t&2){let e=y(2);p(),k(e.errorMessage())}}function TV(t,n){t&1&&(m(0,"p",10),g(1,"No additional agent configuration options advertised."),f())}function kV(t,n){if(t&1&&(m(0,"mat-option",13),g(1),f()),t&2){let e=n.$implicit;N("value",e.value),p(),k(e.name)}}function AV(t,n){if(t&1&&(m(0,"mat-optgroup",12),nt(1,kV,2,2,"mat-option",13,ja),f()),t&2){let e=y().$implicit;N("label",e.group),p(),it(e.options)}}function RV(t,n){if(t&1&&(m(0,"mat-option",13),g(1),f()),t&2){let e=y().$implicit;N("value",e.value),p(),k(e.name)}}function OV(t,n){if(t&1&&E(0,AV,3,1,"mat-optgroup",12)(1,RV,2,2,"mat-option",13),t&2){let e=n.$implicit,i=y(5);M(i.isGroup(e)?0:1)}}function PV(t,n){if(t&1&&(m(0,"p"),g(1),f()),t&2){let e=y(2).$implicit;p(),k(e.description)}}function FV(t,n){if(t&1){let e=ae();m(0,"div",3)(1,"mat-form-field",4)(2,"mat-label"),g(3),f(),m(4,"mat-select",5),w("selectionChange",function(r){q(e);let o=y().$implicit,a=y(3);return Y(a.changeOption(o,r.value))}),nt(5,OV,2,1,null,null,ja),f()(),E(7,PV,2,1,"p"),f()}if(t&2){let e=y().$implicit;p(3),k(e.name),p(),N("value",e.currentValue),p(),it(e.options??ql(3,MV)),p(2),M(e.description?7:-1)}}function LV(t,n){if(t&1&&(m(0,"p"),g(1),f()),t&2){let e=y(2).$implicit;p(),k(e.description)}}function jV(t,n){if(t&1){let e=ae();m(0,"div",11)(1,"div")(2,"strong"),g(3),f(),E(4,LV,2,1,"p"),f(),m(5,"mat-slide-toggle",14),w("change",function(r){q(e);let o=y().$implicit,a=y(3);return Y(a.changeOption(o,r.checked))}),f()()}if(t&2){let e=y().$implicit;p(3),k(e.name),p(),M(e.description?4:-1),p(),N("checked",!!e.currentValue),L("aria-label",e.name)}}function VV(t,n){if(t&1&&(m(0,"div",3)(1,"strong"),g(2),f(),m(3,"div",15),g(4),f()()),t&2){let e=y().$implicit;p(2),k(e.name),p(2),$a("",e.currentValue," (type: ",e.type,")")}}function BV(t,n){if(t&1&&E(0,FV,8,4,"div",3)(1,jV,6,4,"div",11)(2,VV,5,3,"div",3),t&2){let e=n.$implicit;M(e.type==="select"?0:e.type==="boolean"?1:2)}}function HV(t,n){if(t&1&&nt(0,BV,3,1,null,null,NV),t&2){let e=y(2);it(e.options)}}function UV(t,n){if(t&1){let e=ae();m(0,"section",0)(1,"h2",1)(2,"mat-icon"),g(3,"tune"),f(),g(4," Configuration & permissions"),f(),E(5,IV,2,1,"div",2),m(6,"div",3)(7,"mat-form-field",4)(8,"mat-label"),g(9,"Permission policy"),f(),m(10,"mat-select",5),w("selectionChange",function(r){q(e);let o=y();return Y(o.changePolicy(r.value))}),m(11,"mat-option",6),g(12,"Ask every time"),f(),m(13,"mat-option",7),g(14,"Read-only (deny writes)"),f(),m(15,"mat-option",8),g(16,"Auto-approve all permissions"),f(),m(17,"mat-option",9),g(18,"Deny all actions"),f()()(),m(19,"p"),g(20,"Controls whether the agent must ask before running commands or editing files."),f()(),j(21,"mat-divider"),E(22,TV,2,0,"p",10)(23,HV,2,0),f()}if(t&2){let e=y();p(5),M(e.errorMessage()?5:-1),p(5),N("value",e.chat.permission_policy),p(12),M(e.options.length?23:22)}}var nh=class t{constructor(){this.chat=null;this.options=[];this.errorMessage=S("");this.state=c(Fe)}isGroup(n){return"options"in n}async changePolicy(n){if(this.chat){this.errorMessage.set("");try{await this.state.setChatPolicy(this.chat.id,n)}catch(e){this.errorMessage.set(e instanceof Error?e.message:"Failed to update permission policy")}}}async changeOption(n,e){if(this.chat){this.errorMessage.set("");try{await this.state.setChatConfig(this.chat.id,n.id,e)}catch(i){this.errorMessage.set(i instanceof Error?i.message:"Failed to update agent configuration")}}}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-chat-config"]],inputs:{chat:"chat",options:"options"},decls:1,vars:1,consts:[["aria-labelledby","config-heading",1,"config"],["id","config-heading"],["role","alert",1,"error-box"],[1,"config-item"],["appearance","outline"],[3,"selectionChange","value"],["value","ask"],["value","read-only"],["value","auto-approve"],["value","deny-all"],[1,"no-options"],[1,"boolean-item"],[3,"label"],[3,"value"],[3,"change","checked"],[1,"unsupported"]],template:function(e,i){e&1&&E(0,UV,24,3,"section",0),e&2&&M(i.chat?0:-1)},dependencies:[Ur,Ss,Uv,dn,Wn,In,Pe,ze,vM,_M,Hs,bb,yM,wb],styles:["[_nghost-%COMP%]{display:block}.config[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:18px}h2[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;font:var(--%NS%mat-sys-title-medium)}h2[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary)}.config-item[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:6px}mat-form-field[_ngcontent-%COMP%]{width:100%}p[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-small)}.no-options[_ngcontent-%COMP%]{font-style:italic}.boolean-item[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:16px}.boolean-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{display:block}.unsupported[_ngcontent-%COMP%]{padding:12px;border-radius:var(--%NS%mat-sys-corner-small);background:var(--%NS%mat-sys-surface-container);color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-small)}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}"]})}};function zV(t,n){t&1&&j(0,"mat-spinner",8)}function $V(t,n){t&1&&(m(0,"mat-icon"),g(1,"stop"),f())}function WV(t,n){if(t&1){let e=ae();m(0,"button",7),w("click",function(){q(e);let r=y();return Y(r.cancel())}),E(1,zV,1,0,"mat-spinner",8)(2,$V,2,0,"mat-icon"),f()}if(t&2){let e=y();N("disabled",e.cancelling()),p(),M(e.cancelling()?1:2)}}function GV(t,n){if(t&1&&(m(0,"button",5)(1,"mat-icon"),g(2,"arrow_upward"),f()()),t&2){let e=y();N("disabled",!e.canSend())}}var ih=class t{constructor(){this.chatId=rn("");this.processState=rn("STOPPED");this.turnState=rn("IDLE");this.disabled=rn(!1);this.message=new xf("",{nonNullable:!0});this.state=c(Fe);this.text=us(this.message.valueChanges,{initialValue:this.message.value});this.prompting=De(()=>this.turnState()==="PROMPTING");this.cancelling=De(()=>this.turnState()==="CANCELLING");this.unavailable=De(()=>this.disabled()||this.processState()!=="RUNNING"||this.prompting());this.canSend=De(()=>!this.unavailable()&&this.text().trim().length>0);this.placeholder=De(()=>this.disabled()?"Waiting for the agent connection\u2026":this.processState()!=="RUNNING"?"Agent process stopped":this.prompting()?"Agent is thinking\u2026":"Type a message\u2026");vt(()=>{let n=this.unavailable();n&&this.message.enabled?this.message.disable({emitEvent:!1}):!n&&this.message.disabled&&this.message.enable({emitEvent:!1})})}keyDown(n){(n.ctrlKey||n.metaKey)&&n.key==="Enter"&&(n.preventDefault(),this.send())}async send(){let n=this.message.value.trim();if(!(!n||!this.canSend())){this.message.setValue("");try{await this.state.sendPrompt(this.chatId(),n)}catch(e){console.error("Failed to send prompt",e),this.message.setValue(n)}}}async cancel(){if(this.chatId())try{await this.state.cancelActiveTurn(this.chatId())}catch(n){console.error("Failed to cancel turn",n)}}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-chat-composer"]],inputs:{chatId:[1,"chatId"],processState:[1,"processState"],turnState:[1,"turnState"],disabled:[1,"disabled"]},decls:10,vars:6,consts:[[1,"composer-column"],[1,"composer",3,"submit"],["appearance","outline","subscriptSizing","dynamic",1,"message-field"],["matInput","","cdkTextareaAutosize","",3,"keydown","formControl","cdkAutosizeMinRows","cdkAutosizeMaxRows","placeholder"],["matFab","","type","button","matTooltip","Cancel active turn","aria-label","Cancel active turn",1,"action","cancel",3,"disabled"],["matFab","","type","submit","matTooltip","Send message (Ctrl+Enter)","aria-label","Send message",1,"action",3,"disabled"],[1,"hint"],["matFab","","type","button","matTooltip","Cancel active turn","aria-label","Cancel active turn",1,"action","cancel",3,"click","disabled"],["diameter","22"]],template:function(e,i){e&1&&(m(0,"div",0)(1,"form",1),w("submit",function(o){return o.preventDefault(),i.send()}),m(2,"mat-form-field",2)(3,"mat-label"),g(4,"Message"),f(),m(5,"textarea",3),w("keydown",function(o){return i.keyDown(o)}),f(),ii(),f(),E(6,WV,3,2,"button",4)(7,GV,3,1,"button",5),f(),m(8,"p",6),g(9,"Press Ctrl+Enter or Cmd+Enter to send"),f()()),e&2&&(p(5),N("formControl",i.message)("cdkAutosizeMinRows",1)("cdkAutosizeMaxRows",8)("placeholder",i.placeholder()),L("aria-label",i.placeholder()),ri(),p(),M(i.prompting()||i.cancelling()?6:7))},dependencies:[dE,sE,Ii,Hr,aE,Xv,$f,eM,Oe,Cs,dn,Wn,In,Pe,ze,Zr,Yr,Qt,Zt,$r,sr],styles:["[_nghost-%COMP%]{display:block;flex:0 0 auto;padding:12px max(var(--%NS%hub-gutter),(100% - var(--%NS%hub-measure)) / 2);padding-bottom:calc(12px + env(safe-area-inset-bottom));border-top:1px solid var(--%NS%mat-sys-outline-variant);background:var(--%NS%mat-sys-surface)}.composer-column[_ngcontent-%COMP%]{max-width:var(--%NS%hub-measure);margin:0 auto}.composer[_ngcontent-%COMP%]{display:flex;align-items:flex-end;gap:12px}.message-field[_ngcontent-%COMP%]{min-width:0;flex:1}textarea[_ngcontent-%COMP%]{max-height:190px}.action[_ngcontent-%COMP%]{flex:0 0 auto}.cancel[_ngcontent-%COMP%]{--%NS%mat-fab-container-color: var(--%NS%mat-sys-error-container);--%NS%mat-fab-icon-color: var(--%NS%mat-sys-on-error-container);--%NS%mat-fab-state-layer-color: var(--%NS%mat-sys-on-error-container)}.hint[_ngcontent-%COMP%]{padding:6px 4px 0;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-small)}@media(max-width:599px){[_nghost-%COMP%]{padding-inline:16px}.hint[_ngcontent-%COMP%]{display:none}}"]})}};var qV=[[["mat-icon"],["","matMenuItemIcon",""]],"*"],YV=["mat-icon, [matMenuItemIcon]","*"];function ZV(t,n){t&1&&(fn(),m(0,"svg",2),j(1,"polygon",3),f())}var QV=["*"];function XV(t,n){if(t&1){let e=ae();je(0,"div",0),Ha("click",function(){q(e);let r=y();return Y(r.closed.emit("click"))})("animationstart",function(r){q(e);let o=y();return Y(o._onAnimationStart(r.animationName))})("animationend",function(r){q(e);let o=y();return Y(o._onAnimationDone(r.animationName))})("animationcancel",function(r){q(e);let o=y();return Y(o._onAnimationDone(r.animationName))}),je(1,"div",1),B(2),Ze()()}if(t&2){let e=y();Ke(e._classList),T("mat-menu-panel-animations-disabled",e._animationsDisabled)("mat-menu-panel-exit-animation",e._panelAnimationState==="void")("mat-menu-panel-animating",e._isAnimating()),Wt("id",e.panelId),L("aria-label",e.ariaLabel||null)("aria-labelledby",e.ariaLabelledby||null)("aria-describedby",e.ariaDescribedby||null)}}var xb=new C("MAT_MENU_PANEL"),lr=(()=>{class t{_elementRef=c(F);_document=c(K);_focusMonitor=c(Bt);_parentMenu=c(xb,{optional:!0});_changeDetectorRef=c(Me);role="menuitem";disabled=!1;disableRipple=!1;_hovered=new I;_focused=new I;_highlighted=!1;_triggersSubmenu=!1;constructor(){c(Je).load(pn),this._parentMenu?.addItem?.(this)}focus(e,i){this._focusMonitor&&e?this._focusMonitor.focusVia(this._getHostElement(),e,i):this._getHostElement().focus(i),this._focused.next(this)}ngAfterViewInit(){this._focusMonitor&&this._focusMonitor.monitor(this._elementRef,!1)}ngOnDestroy(){this._focusMonitor&&this._focusMonitor.stopMonitoring(this._elementRef),this._parentMenu&&this._parentMenu.removeItem&&this._parentMenu.removeItem(this),this._hovered.complete(),this._focused.complete()}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._elementRef.nativeElement}_checkDisabled(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}_handleMouseEnter(){this._hovered.next(this)}getLabel(){let e=this._elementRef.nativeElement.cloneNode(!0),i=e.querySelectorAll("mat-icon, .material-icons");for(let r=0;r<i.length;r++)i[r].remove();return e.textContent?.trim()||""}_setHighlighted(e){this._highlighted=e,this._changeDetectorRef.markForCheck()}_setTriggersSubmenu(e){this._triggersSubmenu=e,this._changeDetectorRef.markForCheck()}_hasFocus(){return this._document&&this._document.activeElement===this._getHostElement()}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["","mat-menu-item",""]],hostAttrs:[1,"mat-mdc-menu-item","mat-focus-indicator"],hostVars:8,hostBindings:function(i,r){i&1&&w("click",function(a){return r._checkDisabled(a)})("mouseenter",function(){return r._handleMouseEnter()}),i&2&&(L("role",r.role)("tabindex",r._getTabIndex())("aria-disabled",r.disabled)("disabled",r.disabled||null),T("mat-mdc-menu-item-highlighted",r._highlighted)("mat-mdc-menu-item-submenu-trigger",r._triggersSubmenu))},inputs:{role:"role",disabled:[2,"disabled","disabled",G],disableRipple:[2,"disableRipple","disableRipple",G]},exportAs:["matMenuItem"],ngContentSelectors:YV,decls:5,vars:3,consts:[[1,"mat-mdc-menu-item-text"],["matRipple","",1,"mat-mdc-menu-ripple",3,"matRippleDisabled","matRippleTrigger"],["viewBox","0 0 5 10","focusable","false","aria-hidden","true",1,"mat-mdc-menu-submenu-icon"],["points","0,0 5,5 0,10"]],template:function(i,r){i&1&&(_e(qV),B(0),m(1,"span",0),B(2,1),f(),j(3,"div",1),E(4,ZV,2,0,":svg:svg",2)),i&2&&(p(3),N("matRippleDisabled",r.disableRipple||r.disabled)("matRippleTrigger",r._getHostElement()),p(),M(r._triggersSubmenu?4:-1))},dependencies:[tr],encapsulation:2})}return t})();var CM=new C("MatMenuContent"),wM=(()=>{class t{_template=c(bt);_appRef=c(nn);_injector=c(X);_viewContainerRef=c(ht);_document=c(K);_changeDetectorRef=c(Me);_portal;_outlet;_attached=new I;attach(e={}){this._portal||(this._portal=new cn(this._template,this._viewContainerRef)),this.detach(),this._outlet||(this._outlet=new Is(this._document.createElement("div"),this._appRef,this._injector));let i=this._template.elementRef.nativeElement;i.parentNode.insertBefore(this._outlet.outletElement,i),this._changeDetectorRef.markForCheck(),this._portal.attach(this._outlet,e),this._attached.next()}detach(){this._portal?.isAttached&&this._portal.detach()}ngOnDestroy(){this.detach(),this._outlet?.dispose()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["ng-template","matMenuContent",""]],features:[Ne([{provide:CM,useExisting:t}])]})}return t})(),KV=new C("mat-menu-default-options",{providedIn:"root",factory:()=>({overlapTrigger:!1,xPosition:"after",yPosition:"below",backdropClass:"cdk-overlay-transparent-backdrop"})}),Sb="_mat-menu-enter",rh="_mat-menu-exit",Pi=(()=>{class t{_elementRef=c(F);_changeDetectorRef=c(Me);_injector=c(X);_keyManager;_xPosition;_yPosition;_firstItemFocusRef;_exitFallbackTimeout;_animationsDisabled=Te();_allItems;_directDescendantItems=new hn;_classList={};_panelAnimationState="void";_animationDone=new I;_isAnimating=S(!1);parentMenu;direction;overlayPanelClass;backdropClass;ariaLabel;ariaLabelledby;ariaDescribedby;get xPosition(){return this._xPosition}set xPosition(e){this._xPosition=e,this.setPositionClasses()}get yPosition(){return this._yPosition}set yPosition(e){this._yPosition=e,this.setPositionClasses()}templateRef;items;lazyContent;overlapTrigger=!1;hasBackdrop;get panelClass(){return this._previousPanelClass}set panelClass(e){let i=this._previousPanelClass,r=b({},this._classList);i&&i.length&&i.split(" ").forEach(o=>{r[o]=!1}),this._previousPanelClass=e,e&&e.length&&(e.split(" ").forEach(o=>{r[o]=!0}),this._elementRef.nativeElement.className=""),this._classList=r}_previousPanelClass="";get classList(){return this.panelClass}set classList(e){this.panelClass=e}closed=new O;close=this.closed;panelId=c(Ue).getId("mat-menu-panel-");constructor(){let e=c(KV);this.overlayPanelClass=e.overlayPanelClass||"",this._xPosition=e.xPosition,this._yPosition=e.yPosition,this.backdropClass=e.backdropClass,this.overlapTrigger=e.overlapTrigger,this.hasBackdrop=e.hasBackdrop}ngOnInit(){this.setPositionClasses()}ngAfterContentInit(){this._updateDirectDescendants(),this._keyManager=new Fr(this._directDescendantItems).withWrap().withTypeAhead().withHomeAndEnd(),this._keyManager.tabOut.subscribe(()=>this.closed.emit("tab")),this._directDescendantItems.changes.pipe(qe(this._directDescendantItems),gt(e=>mt(...e.map(i=>i._focused)))).subscribe(e=>this._keyManager.updateActiveItem(e)),this._directDescendantItems.changes.subscribe(e=>{let i=this._keyManager;if(this._panelAnimationState==="enter"&&i.activeItem?._hasFocus()){let r=e.toArray(),o=Math.max(0,Math.min(r.length-1,i.activeItemIndex||0));r[o]&&!r[o].disabled?i.setActiveItem(o):i.setNextItemActive()}})}ngOnDestroy(){this._keyManager?.destroy(),this._directDescendantItems.destroy(),this.closed.complete(),this._firstItemFocusRef?.destroy(),clearTimeout(this._exitFallbackTimeout)}_hovered(){return this._directDescendantItems.changes.pipe(qe(this._directDescendantItems),gt(i=>mt(...i.map(r=>r._hovered))))}addItem(e){}removeItem(e){}_handleKeydown(e){let i=e.keyCode,r=this._keyManager;switch(i){case 27:ut(e)||(e.preventDefault(),this.closed.emit("keydown"));break;case 37:this.parentMenu&&this.direction==="ltr"&&this.closed.emit("keydown");break;case 39:this.parentMenu&&this.direction==="rtl"&&this.closed.emit("keydown");break;default:(i===38||i===40)&&r.setFocusOrigin("keyboard"),r.onKeydown(e);return}}focusFirstItem(e="program"){this._firstItemFocusRef?.destroy(),this._firstItemFocusRef=tt(()=>{let i=this._resolvePanel();if(!i||!i.contains(document.activeElement)){let r=this._keyManager;r.setFocusOrigin(e).setFirstItemActive(),!r.activeItem&&i&&i.focus()}},{injector:this._injector})}resetActiveItem(){this._keyManager.setActiveItem(-1)}setElevation(e){}setPositionClasses(e=this.xPosition,i=this.yPosition){this._classList=V(b({},this._classList),{"mat-menu-before":e==="before","mat-menu-after":e==="after","mat-menu-above":i==="above","mat-menu-below":i==="below"}),this._changeDetectorRef.markForCheck()}_onAnimationDone(e){let i=e===rh;(i||e===Sb)&&(i&&(clearTimeout(this._exitFallbackTimeout),this._exitFallbackTimeout=void 0),this._animationDone.next(i?"void":"enter"),this._isAnimating.set(!1))}_onAnimationStart(e){(e===Sb||e===rh)&&this._isAnimating.set(!0)}_setIsOpen(e){if(this._panelAnimationState=e?"enter":"void",e){if(this._keyManager.activeItemIndex===0){let i=this._resolvePanel();i&&(i.scrollTop=0)}}else this._animationsDisabled||(this._exitFallbackTimeout=setTimeout(()=>this._onAnimationDone(rh),200));this._animationsDisabled&&setTimeout(()=>{this._onAnimationDone(e?Sb:rh)}),this._changeDetectorRef.markForCheck()}_updateDirectDescendants(){this._allItems.changes.pipe(qe(this._allItems)).subscribe(e=>{this._directDescendantItems.reset(e.filter(i=>i._parentMenu===this)),this._directDescendantItems.notifyOnChanges()})}_resolvePanel(){let e=null;return this._directDescendantItems.length&&(e=this._directDescendantItems.first._getHostElement().closest('[role="menu"]')),e}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-menu"]],contentQueries:function(i,r,o){if(i&1&&ct(o,CM,5)(o,lr,5)(o,lr,4),i&2){let a;z(a=$())&&(r.lazyContent=a.first),z(a=$())&&(r._allItems=a),z(a=$())&&(r.items=a)}},viewQuery:function(i,r){if(i&1&&Re(bt,5),i&2){let o;z(o=$())&&(r.templateRef=o.first)}},hostVars:3,hostBindings:function(i,r){i&2&&L("aria-label",null)("aria-labelledby",null)("aria-describedby",null)},inputs:{backdropClass:"backdropClass",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],xPosition:"xPosition",yPosition:"yPosition",overlapTrigger:[2,"overlapTrigger","overlapTrigger",G],hasBackdrop:[2,"hasBackdrop","hasBackdrop",e=>e==null?null:G(e)],panelClass:[0,"class","panelClass"],classList:"classList"},outputs:{closed:"closed",close:"close"},exportAs:["matMenu"],features:[Ne([{provide:xb,useExisting:t}])],ngContentSelectors:QV,decls:1,vars:0,consts:[["tabindex","-1","role","menu",1,"mat-mdc-menu-panel",3,"click","animationstart","animationend","animationcancel","id"],[1,"mat-mdc-menu-content"]],template:function(i,r){i&1&&(_e(),La(0,XV,3,12,"ng-template"))},styles:[`mat-menu {
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
`],encapsulation:2})}return t})(),JV=new C("mat-menu-scroll-strategy",{providedIn:"root",factory:()=>{let t=c(X);return()=>or(t)}});var Us=new WeakMap,eB=(()=>{class t{_canHaveBackdrop;_element=c(F);_viewContainerRef=c(ht);_menuItemInstance=c(lr,{optional:!0,self:!0});_dir=c(wt,{optional:!0});_focusMonitor=c(Bt);_ngZone=c(U);_injector=c(X);_scrollStrategy=c(JV);_changeDetectorRef=c(Me);_animationsDisabled=Te();_portal;_overlayRef=null;_menuOpen=!1;_closingActionsSubscription=ce.EMPTY;_menuCloseSubscription=ce.EMPTY;_pendingRemoval;_parentMaterialMenu;_parentInnerPadding;_openedBy=void 0;get _menu(){return this._menuInternal}set _menu(e){e!==this._menuInternal&&(this._menuInternal=e,this._menuCloseSubscription.unsubscribe(),e?(this._parentMaterialMenu,this._menuCloseSubscription=e.close.subscribe(i=>{this._destroyMenu(i),(i==="click"||i==="tab")&&this._parentMaterialMenu&&this._parentMaterialMenu.closed.emit(i)})):this._destroyMenu(),this._menuItemInstance?._setTriggersSubmenu(this._triggersSubmenu()))}_menuInternal=null;constructor(e){this._canHaveBackdrop=e;let i=c(xb,{optional:!0});this._parentMaterialMenu=i instanceof Pi?i:void 0}ngOnDestroy(){this._menu&&this._ownsMenu(this._menu)&&Us.delete(this._menu),this._pendingRemoval?.unsubscribe(),this._menuCloseSubscription.unsubscribe(),this._closingActionsSubscription.unsubscribe(),this._overlayRef&&(this._overlayRef.dispose(),this._overlayRef=null)}get menuOpen(){return this._menuOpen}get dir(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}_triggersSubmenu(){return!!(this._menuItemInstance&&this._parentMaterialMenu&&this._menu)}_closeMenu(){this._menu?.close.emit()}_openMenu(e){if(this._triggerIsAriaDisabled())return;let i=this._menu;if(this._menuOpen||!i)return;this._pendingRemoval?.unsubscribe();let r=Us.get(i);Us.set(i,this),r&&r!==this&&r._closeMenu();let o=this._createOverlay(i),a=o.getConfig(),s=a.positionStrategy;this._setPosition(i,s),this._canHaveBackdrop?a.hasBackdrop=i.hasBackdrop==null?!this._triggersSubmenu():i.hasBackdrop:a.hasBackdrop=i.hasBackdrop??!1,o.hasAttached()||(o.attach(this._getPortal(i)),i.lazyContent?.attach(this.menuData)),this._closingActionsSubscription=this._menuClosingActions().subscribe(()=>this._closeMenu()),i.parentMenu=this._triggersSubmenu()?this._parentMaterialMenu:void 0,i.direction=this.dir,e&&i.focusFirstItem(this._openedBy||"program"),this._setIsMenuOpen(!0),i instanceof Pi&&(i._setIsOpen(!0),i._directDescendantItems.changes.pipe(he(i.close)).subscribe(()=>{s.withLockedPosition(!1).reapplyLastPosition(),s.withLockedPosition(!0)}))}focus(e,i){this._focusMonitor&&e?this._focusMonitor.focusVia(this._element,e,i):this._element.nativeElement.focus(i)}_destroyMenu(e){let i=this._overlayRef,r=this._menu;!i||!this.menuOpen||(this._closingActionsSubscription.unsubscribe(),this._pendingRemoval?.unsubscribe(),r instanceof Pi&&this._ownsMenu(r)?(this._pendingRemoval=r._animationDone.pipe(Le(1)).subscribe(()=>{i.detach(),Us.has(r)||r.lazyContent?.detach()}),r._setIsOpen(!1)):(i.detach(),r?.lazyContent?.detach()),r&&this._ownsMenu(r)&&Us.delete(r),this.restoreFocus&&(e==="keydown"||!this._openedBy||!this._triggersSubmenu())&&this.focus(this._openedBy),this._openedBy=void 0,this._setIsMenuOpen(!1))}_setIsMenuOpen(e){e!==this._menuOpen&&(this._menuOpen=e,this._menuOpen?this.menuOpened.emit():this.menuClosed.emit(),this._triggersSubmenu()&&this._menuItemInstance._setHighlighted(e),this._changeDetectorRef.markForCheck())}_createOverlay(e){if(!this._overlayRef){let i=this._getOverlayConfig(e);this._subscribeToPositions(e,i.positionStrategy),this._overlayRef=ar(this._injector,i),this._overlayRef.keydownEvents().subscribe(r=>{this._menu instanceof Pi&&this._menu._handleKeydown(r)})}return this._overlayRef}_getOverlayConfig(e){return new rr({positionStrategy:ea(this._injector,this._getOverlayOrigin()).withLockedPosition().withGrowAfterOpen().withTransformOriginOn(".mat-menu-panel, .mat-mdc-menu-panel"),backdropClass:e.backdropClass||"cdk-overlay-transparent-backdrop",panelClass:e.overlayPanelClass,scrollStrategy:this._scrollStrategy(),direction:this._dir||"ltr",disableAnimations:this._animationsDisabled})}_subscribeToPositions(e,i){e.setPositionClasses&&i.positionChanges.subscribe(r=>{this._ngZone.run(()=>{let o=r.connectionPair.overlayX==="start"?"after":"before",a=r.connectionPair.overlayY==="top"?"below":"above";e.setPositionClasses(o,a)})})}_setPosition(e,i){let[r,o]=e.xPosition==="before"?["end","start"]:["start","end"],[a,s]=e.yPosition==="above"?["bottom","top"]:["top","bottom"],[l,d]=[a,s],[u,h]=[r,o],_=0;if(this._triggersSubmenu()){if(h=r=e.xPosition==="before"?"start":"end",o=u=r==="end"?"start":"end",this._parentMaterialMenu){if(this._parentInnerPadding==null){let v=this._parentMaterialMenu.items.first;this._parentInnerPadding=v?v._getHostElement().offsetTop:0}_=a==="bottom"?this._parentInnerPadding:-this._parentInnerPadding}}else e.overlapTrigger||(l=a==="top"?"bottom":"top",d=s==="top"?"bottom":"top");i.withPositions([{originX:r,originY:l,overlayX:u,overlayY:a,offsetY:_},{originX:o,originY:l,overlayX:h,overlayY:a,offsetY:_},{originX:r,originY:d,overlayX:u,overlayY:s,offsetY:-_},{originX:o,originY:d,overlayX:h,overlayY:s,offsetY:-_}])}_menuClosingActions(){let e=this._getOutsideClickStream(this._overlayRef),i=this._overlayRef.detachments(),r=this._parentMaterialMenu?this._parentMaterialMenu.closed:ne(),o=this._parentMaterialMenu?this._parentMaterialMenu._hovered().pipe(ue(a=>this._menuOpen&&a!==this._menuItemInstance)):ne();return mt(e,r,o,i)}_getPortal(e){return(!this._portal||this._portal.templateRef!==e.templateRef)&&(this._portal=new cn(e.templateRef,this._viewContainerRef)),this._portal}_ownsMenu(e){return Us.get(e)===this}_triggerIsAriaDisabled(){return G(this._element.nativeElement.getAttribute("aria-disabled"))}static \u0275fac=function(i){zl()};static \u0275dir=R({type:t})}return t})(),zs=(()=>{class t extends eB{_cleanupTouchstart;_hoverSubscription=ce.EMPTY;get _deprecatedMatMenuTriggerFor(){return this.menu}set _deprecatedMatMenuTriggerFor(e){this.menu=e}get menu(){return this._menu}set menu(e){this._menu=e}menuData;restoreFocus=!0;menuOpened=new O;onMenuOpen=this.menuOpened;menuClosed=new O;onMenuClose=this.menuClosed;constructor(){super(!0);let e=c(Se);this._cleanupTouchstart=e.listen(this._element.nativeElement,"touchstart",i=>{Wo(i)||(this._openedBy="touch")},{passive:!0})}triggersSubmenu(){return super._triggersSubmenu()}toggleMenu(){return this.menuOpen?this.closeMenu():this.openMenu()}openMenu(){this._openMenu(!0)}closeMenu(){this._closeMenu()}updatePosition(){this._overlayRef?.updatePosition()}ngAfterContentInit(){this._handleHover()}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTouchstart(),this._hoverSubscription.unsubscribe()}_getOverlayOrigin(){return this._element}_getOutsideClickStream(e){return e.backdropClick()}_handleMousedown(e){$o(e)||(this._openedBy=e.button===0?"mouse":void 0,this.triggersSubmenu()&&e.preventDefault())}_handleKeydown(e){let i=e.keyCode;(i===13||i===32)&&(this._openedBy="keyboard"),this.triggersSubmenu()&&(i===39&&this.dir==="ltr"||i===37&&this.dir==="rtl")&&(this._openedBy="keyboard",this.openMenu())}_handleClick(e){this.triggersSubmenu()?(e.stopPropagation(),this.openMenu()):this.toggleMenu()}_handleHover(){this.triggersSubmenu()&&this._parentMaterialMenu&&(this._hoverSubscription=this._parentMaterialMenu._hovered().subscribe(e=>{e===this._menuItemInstance&&!e.disabled&&this._parentMaterialMenu?._panelAnimationState!=="void"&&(this._openedBy="mouse",this._openMenu(!1))}))}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","mat-menu-trigger-for",""],["","matMenuTriggerFor",""]],hostAttrs:[1,"mat-mdc-menu-trigger"],hostVars:3,hostBindings:function(i,r){i&1&&w("click",function(a){return r._handleClick(a)})("mousedown",function(a){return r._handleMousedown(a)})("keydown",function(a){return r._handleKeydown(a)}),i&2&&L("aria-haspopup",r.menu?"menu":null)("aria-expanded",r.menuOpen)("aria-controls",r.menuOpen?r.menu?.panelId:null)},inputs:{_deprecatedMatMenuTriggerFor:[0,"mat-menu-trigger-for","_deprecatedMatMenuTriggerFor"],menu:[0,"matMenuTriggerFor","menu"],menuData:[0,"matMenuTriggerData","menuData"],restoreFocus:[0,"matMenuTriggerRestoreFocus","restoreFocus"]},outputs:{menuOpened:"menuOpened",onMenuOpen:"onMenuOpen",menuClosed:"menuClosed",onMenuClose:"onMenuClose"},exportAs:["matMenuTrigger"],features:[pe]})}return t})();var $s=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[Lr,ci,ge,Vn]})}return t})();function tB(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=y();p(),k(e.error())}}function nB(t,n){t&1&&j(0,"mat-spinner",6)}function iB(t,n){t&1&&g(0," Delete chat ")}var oh=class t{constructor(n){this.chat=n;this.dialogRef=c(Yt);this.state=c(Fe);this.deleting=S(!1);this.error=S("")}async remove(){this.deleting.set(!0),this.error.set("");try{await this.state.deleteChat(this.chat.id),this.dialogRef.close(!0)}catch(n){this.error.set(n instanceof Error?n.message:"Failed to delete chat")}finally{this.deleting.set(!1)}}static{this.\u0275fac=function(e){return new(e||t)(te(Nn))}}static{this.\u0275cmp=D({type:t,selectors:[["hub-delete-chat-dialog"]],decls:14,vars:5,consts:[["mat-dialog-title",""],["role","alert",1,"error"],[1,"note"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","type","button",1,"destructive",3,"click","disabled"],["diameter","18"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"Delete chat"),f(),m(2,"mat-dialog-content"),E(3,tB,2,1,"div",1),m(4,"p"),g(5),f(),m(6,"p",2),g(7,"This action cannot be undone."),f()(),m(8,"mat-dialog-actions",3)(9,"button",4),w("click",function(){return i.dialogRef.close()}),g(10,"Cancel"),f(),m(11,"button",5),w("click",function(){return i.remove()}),E(12,nB,1,0,"mat-spinner",6)(13,iB,1,0),f()()),e&2&&(p(3),M(i.error()?3:-1),p(2),dt("Are you sure you want to delete \u201C",i.chat.title||"this chat","\u201D?"),p(4),N("disabled",i.deleting()),p(2),N("disabled",i.deleting()),p(),M(i.deleting()?12:13))},dependencies:[Oe,ot,It,Hn,zn,Un,Qt,Zt],styles:["mat-dialog-content[_ngcontent-%COMP%]{display:flex;min-width:min(400px,100vw - 48px);flex-direction:column;gap:8px}.note[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.error[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}.destructive[_ngcontent-%COMP%]{--%NS%mat-button-filled-container-color: var(--%NS%mat-sys-error);--%NS%mat-button-filled-label-text-color: var(--%NS%mat-sys-on-error);--%NS%mat-button-filled-state-layer-color: var(--%NS%mat-sys-on-error)}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};function rB(t,n){if(t&1&&(m(0,"div",3),g(1),f()),t&2){let e=y();p(),k(e.error())}}var ah=class t{constructor(n){this.chat=n;this.dialogRef=c(Yt);this.state=c(Fe);this.title=S("");this.saving=S(!1);this.error=S("");this.title.set(n.title||"")}async save(){let n=this.title().trim();if(n){this.saving.set(!0),this.error.set("");try{await this.state.renameChat(this.chat.id,n),this.dialogRef.close(!0)}catch(e){this.error.set(e instanceof Error?e.message:"Failed to rename chat")}finally{this.saving.set(!1)}}}static{this.\u0275fac=function(e){return new(e||t)(te(Nn))}}static{this.\u0275cmp=D({type:t,selectors:[["hub-rename-chat-dialog"]],decls:13,vars:4,consts:[["mat-dialog-title",""],["appearance","outline"],["matInput","","autocomplete","off",3,"ngModelChange","keyup.enter","ngModel"],["role","alert",1,"error"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","type","button",3,"click","disabled"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"Rename chat"),f(),m(2,"mat-dialog-content")(3,"mat-form-field",1)(4,"mat-label"),g(5,"Chat title"),f(),m(6,"input",2),w("ngModelChange",function(o){return i.title.set(o)})("keyup.enter",function(){return i.save()}),f(),ii(),f(),E(7,rB,2,1,"div",3),f(),m(8,"mat-dialog-actions",4)(9,"button",5),w("click",function(){return i.dialogRef.close()}),g(10,"Cancel"),f(),m(11,"button",6),w("click",function(){return i.save()}),g(12,"Save"),f()()),e&2&&(p(6),N("ngModel",i.title()),ri(),p(),M(i.error()?7:-1),p(2),N("disabled",i.saving()),p(2),N("disabled",!i.title().trim()||i.saving()))},dependencies:[Ur,Ii,Hr,Ko,Oe,ot,It,Hn,zn,Un,dn,Wn,In,Zr,Yr],styles:["mat-dialog-content[_ngcontent-%COMP%]{min-width:min(360px,100vw - 48px)}mat-form-field[_ngcontent-%COMP%]{width:100%}.error[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};function oB(t,n){t&1&&(m(0,"span",8),g(1,"Archived"),f())}function aB(t,n){t&1&&(m(0,"span",11),g(1,"Thinking\u2026"),f())}function sB(t,n){if(t&1){let e=ae();m(0,"button",22),w("click",function(){q(e);let r=y(2);return Y(r.stop())}),m(1,"mat-icon"),g(2,"pause_circle"),f()()}}function lB(t,n){if(t&1){let e=ae();m(0,"button",23),w("click",function(){q(e);let r=y(2);return Y(r.reconnect())}),m(1,"mat-icon"),g(2,"play_circle"),f()()}}function cB(t,n){if(t&1){let e=ae();m(0,"button",19),w("click",function(){q(e);let r=y(2);return Y(r.stop())}),m(1,"mat-icon"),g(2,"pause"),f(),m(3,"span"),g(4,"Stop process"),f()()}}function dB(t,n){if(t&1){let e=ae();m(0,"button",19),w("click",function(){q(e);let r=y(2);return Y(r.reconnect())}),m(1,"mat-icon"),g(2,"play_arrow"),f(),m(3,"span"),g(4,"Reconnect ACP"),f()()}}function uB(t,n){if(t&1){let e=ae();m(0,"div",3)(1,"button",4),w("click",function(){q(e);let r=y();return Y(r.toggleNavigation())}),m(2,"mat-icon"),g(3,"menu"),f()(),m(4,"div",5)(5,"div",6)(6,"button",7),w("click",function(){q(e);let r=y();return Y(r.rename())}),g(7),f(),E(8,oB,2,0,"span",8),f(),m(9,"div",9)(10,"span",10),g(11),f(),E(12,aB,2,0,"span",11),m(13,"span",12),j(14,"span",13),g(15),f()()()(),m(16,"div",14),E(17,sB,3,0,"button",15)(18,lB,3,0,"button",16),m(19,"button",17),w("click",function(){q(e);let r=y();return Y(r.configRequested.emit())}),m(20,"mat-icon"),g(21,"tune"),f()(),m(22,"button",18)(23,"mat-icon"),g(24,"more_vert"),f()(),m(25,"mat-menu",null,0)(27,"button",19),w("click",function(){q(e);let r=y();return Y(r.rename())}),m(28,"mat-icon"),g(29,"edit"),f(),m(30,"span"),g(31,"Rename chat"),f()(),E(32,cB,5,0,"button",20)(33,dB,5,0,"button",20),m(34,"button",19),w("click",function(){q(e);let r=y();return Y(r.archive())}),m(35,"mat-icon"),g(36),f(),m(37,"span"),g(38),f()(),m(39,"button",19),w("click",function(){q(e);let r=y();return Y(r.remove())}),m(40,"mat-icon",21),g(41,"delete"),f(),m(42,"span"),g(43,"Delete chat"),f()()()()}if(t&2){let e=rt(26),i=y();p(6),L("aria-label","Rename chat "+(i.chat.title||"Untitled chat")),p(),k(i.chat.title||"Untitled chat"),p(),M(i.chat.archived?8:-1),p(3),k(i.chat.agent),p(),M(i.chat.turn_state==="PROMPTING"?12:-1),p(),T("running",i.chat.process_state==="RUNNING")("dead",i.chat.process_state==="DEAD"),p(2),k(i.chat.process_state||"STOPPED"),p(2),M(i.chat.process_state==="RUNNING"?17:18),p(5),N("matMenuTriggerFor",e),p(10),M(i.chat.process_state==="RUNNING"?32:33),p(4),k(i.chat.archived?"unarchive":"archive"),p(2),k(i.chat.archived?"Unarchive chat":"Archive chat")}}function mB(t,n){t&1&&(m(0,"span",2),g(1,"No chat selected"),f())}var sh=class t{constructor(){this.chat=null;this.configRequested=new O;this.state=c(Fe);this.dialog=c(ki)}toggleNavigation(){this.state.setMobileDrawerOpen(!this.state.isMobileDrawerOpen())}rename(){this.chat&&this.dialog.open(ah,{width:"min(480px, calc(100vw - 32px))",data:this.chat})}async stop(){this.chat&&await this.state.stopChatProcess(this.chat.id).catch(n=>console.error("Failed to stop process",n))}async reconnect(){this.chat&&await this.state.retryConnection(this.chat.id)}async archive(){this.chat&&await this.state.archiveChat(this.chat.id,!this.chat.archived).catch(n=>console.error("Failed to archive chat",n))}remove(){this.chat&&this.dialog.open(oh,{width:"min(520px, calc(100vw - 32px))",data:this.chat})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-chat-header"]],inputs:{chat:"chat"},outputs:{configRequested:"configRequested"},decls:3,vars:1,consts:[["actions","matMenu"],[1,"chat-header"],[1,"no-chat"],[1,"header-left"],["mat-icon-button","","aria-label","Open navigation","matTooltip","Open navigation",1,"nav-button",3,"click"],[1,"title-area"],[1,"title-line"],["mat-button","","type","button",1,"title-button",3,"click"],[1,"badge","stopped"],[1,"badges"],[1,"badge","agent"],[1,"badge","thinking"],[1,"badge"],[1,"status-dot"],[1,"header-actions"],["mat-icon-button","","matTooltip","Stop process","aria-label","Stop process"],["mat-icon-button","","matTooltip","Reconnect process","aria-label","Reconnect process"],["mat-icon-button","","matTooltip","Chat configuration","aria-label","Chat configuration",3,"click"],["mat-icon-button","","aria-label","Chat actions",3,"matMenuTriggerFor"],["mat-menu-item","","type","button",3,"click"],["mat-menu-item","","type","button"],[1,"destructive-icon"],["mat-icon-button","","matTooltip","Stop process","aria-label","Stop process",3,"click"],["mat-icon-button","","matTooltip","Reconnect process","aria-label","Reconnect process",3,"click"]],template:function(e,i){e&1&&(m(0,"header",1),E(1,uB,44,15)(2,mB,2,0,"span",2),f()),e&2&&(p(),M(i.chat?1:2))},dependencies:[Oe,ot,En,It,Pe,ze,$s,Pi,lr,zs,$r,sr],styles:[".destructive-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-error)}[_nghost-%COMP%]{display:block;flex:0 0 auto;padding-inline:max(var(--%NS%hub-gutter),(100% - var(--%NS%hub-measure)) / 2);border-bottom:1px solid var(--%NS%mat-sys-outline-variant);background:var(--%NS%mat-sys-surface)}.chat-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:72px;max-width:var(--%NS%hub-measure);margin:0 auto;padding-block:10px}.header-left[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%], .title-line[_ngcontent-%COMP%], .badges[_ngcontent-%COMP%]{display:flex;align-items:center}.header-left[_ngcontent-%COMP%]{min-width:0;flex:1;gap:12px}.header-actions[_ngcontent-%COMP%]{flex:0 0 auto;gap:2px}.title-area[_ngcontent-%COMP%]{min-width:0}.title-line[_ngcontent-%COMP%]{min-width:0;gap:8px}.title-button[_ngcontent-%COMP%]{min-width:0;overflow:hidden;max-width:min(50vw,560px);padding-inline:0;color:var(--%NS%mat-sys-on-surface);font:var(--%NS%mat-sys-title-medium);text-align:left;text-overflow:ellipsis;white-space:nowrap}.title-button[_ngcontent-%COMP%]:hover{text-decoration:underline}.badges[_ngcontent-%COMP%]{flex-wrap:wrap;gap:6px;margin-top:4px}.badge[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:var(--%NS%mat-sys-corner-full);background:var(--%NS%mat-sys-surface-container-high);color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small)}.badge.agent[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container)}.badge.running[_ngcontent-%COMP%]{background:var(--%NS%hub-status-running-container);color:var(--%NS%hub-status-running)}.badge.dead[_ngcontent-%COMP%]{background:var(--%NS%hub-status-dead-container);color:var(--%NS%hub-status-dead)}.badge.thinking[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container)}.status-dot[_ngcontent-%COMP%]{width:6px;height:6px;border-radius:50%;background:currentColor}.nav-button[_ngcontent-%COMP%]{display:none}.no-chat[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}@media(max-width:839px){.nav-button[_ngcontent-%COMP%]{display:inline-flex}}@media(max-width:599px){[_nghost-%COMP%]{padding-inline:16px}.header-actions[_ngcontent-%COMP%] > button[_ngcontent-%COMP%]:first-child{display:none}.title-button[_ngcontent-%COMP%]{max-width:42vw}}"]})}};function fB(t,n){if(t&1&&(m(0,"div",2)(1,"mat-icon"),g(2,"check"),f(),g(3),f()),t&2){let e=y();p(3),dt(" Responded: ",e.permission.decision||"Handled")}}function hB(t,n){t&1&&j(0,"mat-spinner",6)}function pB(t,n){t&1&&g(0," Allow ")}function gB(t,n){if(t&1){let e=ae();m(0,"mat-card-actions",3)(1,"button",4),w("click",function(){q(e);let r=y();return Y(r.respond(!1))}),g(2,"Deny"),f(),m(3,"button",5),w("click",function(){q(e);let r=y();return Y(r.respond(!0))}),E(4,hB,1,0,"mat-spinner",6)(5,pB,1,0),f()()}if(t&2){let e=y();p(),N("disabled",e.responding()),p(2),N("disabled",e.responding()),p(),M(e.responding()?4:5)}}var lh=class t{constructor(){this.chatId="";this.responding=S(!1);this.state=c(Fe)}async respond(n){if(!(!this.chatId||!this.permission.requestId)){this.responding.set(!0);try{await this.state.respondPermission(this.chatId,this.permission.requestId,n)}catch(e){console.error("Failed to respond to permission request",e)}finally{this.responding.set(!1)}}}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-permission-card"]],inputs:{permission:"permission",chatId:"chatId"},decls:13,vars:5,consts:[[1,"permission"],["mat-card-avatar",""],[1,"decision"],["align","end"],["mat-stroked-button","","type","button",3,"click","disabled"],["mat-flat-button","","type","button",3,"click","disabled"],["diameter","18"]],template:function(e,i){e&1&&(m(0,"mat-card",0)(1,"mat-card-header")(2,"mat-icon",1),g(3,"shield_person"),f(),m(4,"mat-card-title"),g(5,"Permission request"),f(),m(6,"mat-card-subtitle"),g(7),f()(),m(8,"mat-card-content")(9,"pre"),g(10),f()(),E(11,fB,4,1,"div",2)(12,gB,6,3,"mat-card-actions",3),f()),e&2&&(T("responded",i.permission.responded),p(7),k(i.permission.method),p(3),k(i.permission.description||i.permission.method||"Action requested"),p(),M(i.permission.responded?11:12))},dependencies:[Oe,ot,$n,Ai,VE,Hf,Ps,Fs,Bf,Gr,Pe,ze,Qt,Zt],styles:["[_nghost-%COMP%]{display:block;margin:12px 0}.permission[_ngcontent-%COMP%]{border:1px solid color-mix(in srgb,var(--%NS%mat-sys-error) 50%,transparent);background:var(--%NS%mat-sys-error-container)}.permission.responded[_ngcontent-%COMP%]{border-color:var(--%NS%mat-sys-outline-variant);background:var(--%NS%mat-sys-surface-container-low);opacity:.88}mat-card-header[_ngcontent-%COMP%]{align-items:center}mat-card-avatar[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-error)}mat-card-content[_ngcontent-%COMP%]{padding-top:12px}pre[_ngcontent-%COMP%]{margin:0;padding:12px;overflow:auto;border-radius:var(--%NS%mat-sys-corner-small);background:color-mix(in srgb,var(--%NS%mat-sys-surface-container-lowest) 80%,transparent);white-space:pre-wrap;font:inherit}.decision[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;padding:0 16px 14px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-medium)}"]})}};function _B(t,n){if(t&1&&(m(0,"li")(1,"mat-icon"),g(2),f(),m(3,"span"),g(4),f()()),t&2){let e=n.$implicit,i=y(2);T("completed",e.status==="completed"),p(2),k(i.statusIcon(e.status)),p(2),k(e.content)}}function vB(t,n){if(t&1&&(m(0,"mat-card",0)(1,"mat-card-header")(2,"mat-icon",1),g(3,"format_list_bulleted"),f(),m(4,"mat-card-title"),g(5,"Execution plan"),f()(),m(6,"mat-card-content")(7,"ul"),nt(8,_B,5,4,"li",2,ja),f()()()),t&2){let e=y();p(8),it(e.entries)}}var ch=class t{constructor(){this.entries=[]}statusIcon(n){return n==="completed"?"check_circle":n==="in_progress"?"progress_activity":"radio_button_unchecked"}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-plan-view"]],inputs:{entries:"entries"},decls:1,vars:1,consts:[[1,"plan"],["mat-card-avatar",""],[3,"completed"]],template:function(e,i){e&1&&E(0,vB,10,0,"mat-card",0),e&2&&M(i.entries.length?0:-1)},dependencies:[$n,Ai,Hf,Ps,Fs,Gr,Pe,ze],styles:["[_nghost-%COMP%]{display:block;margin:10px 0}.plan[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-tertiary-container);color:var(--%NS%mat-sys-on-tertiary-container)}mat-card-header[_ngcontent-%COMP%]{align-items:center}mat-card-avatar[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-tertiary-container)}mat-card-content[_ngcontent-%COMP%]{padding-top:6px}ul[_ngcontent-%COMP%]{display:grid;gap:8px;margin:0;padding:0;list-style:none}li[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:8px;line-height:1.4}li[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:20px;height:20px;font-size:20px;flex:0 0 auto}li.completed[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);text-decoration:line-through}"]})}};var SM=new C("CdkAccordion");var xM=(()=>{class t{accordion=c(SM,{optional:!0,skipSelf:!0});_changeDetectorRef=c(Me);_expansionDispatcher=c(Lc);_openCloseAllSubscription=ce.EMPTY;closed=new O;opened=new O;destroyed=new O;expandedChange=new O;id=c(Ue).getId("cdk-accordion-child-");get expanded(){return this._expanded}set expanded(e){if(this._expanded!==e){if(this._expanded=e,this.expandedChange.emit(e),e){this.opened.emit();let i=this.accordion?this.accordion.id:this.id;this._expansionDispatcher.notify(this.id,i)}else this.closed.emit();this._changeDetectorRef.markForCheck()}}_expanded=!1;get disabled(){return this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=S(!1);_removeUniqueSelectionListener=()=>{};ngOnInit(){this._removeUniqueSelectionListener=this._expansionDispatcher.listen((e,i)=>{this.accordion&&!this.accordion.multi&&this.accordion.id===i&&this.id!==e&&(this.expanded=!1)}),this.accordion&&(this._openCloseAllSubscription=this._subscribeToOpenCloseAllActions())}ngOnDestroy(){this.opened.complete(),this.closed.complete(),this.destroyed.emit(),this.destroyed.complete(),this._removeUniqueSelectionListener(),this._openCloseAllSubscription.unsubscribe()}toggle(){this.disabled||(this.expanded=!this.expanded)}close(){this.disabled||(this.expanded=!1)}open(){this.disabled||(this.expanded=!0)}_subscribeToOpenCloseAllActions(){return this.accordion._openCloseAllActions.subscribe(e=>{this.disabled||(this.expanded=e)})}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["cdk-accordion-item"],["","cdkAccordionItem",""]],inputs:{expanded:[2,"expanded","expanded",G],disabled:[2,"disabled","disabled",G]},outputs:{closed:"closed",opened:"opened",destroyed:"destroyed",expandedChange:"expandedChange"},exportAs:["cdkAccordionItem"],features:[Ne([{provide:SM,useValue:void 0}])]})}return t})(),DM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();var bB=["body"],yB=["bodyWrapper"],CB=[[["mat-expansion-panel-header"]],"*",[["mat-action-row"]]],wB=["mat-expansion-panel-header","*","mat-action-row"];function SB(t,n){}var xB=[[["mat-panel-title"]],[["mat-panel-description"]],"*"],DB=["mat-panel-title","mat-panel-description","*"];function EB(t,n){t&1&&(je(0,"span",1),fn(),je(1,"svg",2),xt(2,"path",3),Ze()())}var EM=new C("MAT_ACCORDION"),MM=new C("MAT_EXPANSION_PANEL"),MB=(()=>{class t{_template=c(bt);_expansionPanel=c(MM,{optional:!0});static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["ng-template","matExpansionPanelContent",""]]})}return t})(),NM=new C("MAT_EXPANSION_PANEL_DEFAULT_OPTIONS"),Eb=(()=>{class t extends xM{_viewContainerRef=c(ht);_animationsDisabled=Te();_document=c(K);_ngZone=c(U);_elementRef=c(F);_renderer=c(Se);_cleanupTransitionEnd;get hideToggle(){return this._hideToggle||this.accordion&&this.accordion.hideToggle}set hideToggle(e){this._hideToggle=e}_hideToggle=!1;get togglePosition(){return this._togglePosition||this.accordion&&this.accordion.togglePosition}set togglePosition(e){this._togglePosition=e}_togglePosition;afterExpand=new O;afterCollapse=new O;_inputChanges=new I;accordion=c(EM,{optional:!0,skipSelf:!0});_lazyContent;_body;_bodyWrapper;_portal;_headerId=c(Ue).getId("mat-expansion-panel-header-");constructor(){super();let e=c(NM,{optional:!0});this._expansionDispatcher=c(Lc),e&&(this.hideToggle=e.hideToggle)}_hasSpacing(){return this.accordion?this.expanded&&this.accordion.displayMode==="default":!1}_getExpandedState(){return this.expanded?"expanded":"collapsed"}toggle(){this.expanded=!this.expanded}close(){this.expanded=!1}open(){this.expanded=!0}ngAfterContentInit(){this._lazyContent&&this._lazyContent._expansionPanel===this&&this.opened.pipe(qe(null),ue(()=>this.expanded&&!this._portal),Le(1)).subscribe(()=>{this._portal=new cn(this._lazyContent._template,this._viewContainerRef)}),this._setupAnimationEvents()}ngOnChanges(e){this._inputChanges.next(e)}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTransitionEnd?.(),this._inputChanges.complete()}_containsFocus(){if(this._body){let e=this._document.activeElement,i=this._body.nativeElement;return e===i||i.contains(e)}return!1}_transitionEndListener=({target:e,propertyName:i})=>{e===this._bodyWrapper?.nativeElement&&i==="grid-template-rows"&&this._ngZone.run(()=>{this.expanded?this.afterExpand.emit():this.afterCollapse.emit()})};_setupAnimationEvents(){this._ngZone.runOutsideAngular(()=>{this._animationsDisabled?(this.opened.subscribe(()=>this._ngZone.run(()=>this.afterExpand.emit())),this.closed.subscribe(()=>this._ngZone.run(()=>this.afterCollapse.emit()))):setTimeout(()=>{let e=this._elementRef.nativeElement;this._cleanupTransitionEnd=this._renderer.listen(e,"transitionend",this._transitionEndListener),e.classList.add("mat-expansion-panel-animations-enabled")},200)})}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-expansion-panel"]],contentQueries:function(i,r,o){if(i&1&&ct(o,MB,5),i&2){let a;z(a=$())&&(r._lazyContent=a.first)}},viewQuery:function(i,r){if(i&1&&Re(bB,5)(yB,5),i&2){let o;z(o=$())&&(r._body=o.first),z(o=$())&&(r._bodyWrapper=o.first)}},hostAttrs:[1,"mat-expansion-panel"],hostVars:4,hostBindings:function(i,r){i&2&&T("mat-expanded",r.expanded)("mat-expansion-panel-spacing",r._hasSpacing())},inputs:{hideToggle:[2,"hideToggle","hideToggle",G],togglePosition:"togglePosition"},outputs:{afterExpand:"afterExpand",afterCollapse:"afterCollapse"},exportAs:["matExpansionPanel"],features:[Ne([{provide:EM,useValue:void 0},{provide:MM,useExisting:t}]),pe,Ae],ngContentSelectors:wB,decls:9,vars:4,consts:[["bodyWrapper",""],["body",""],[1,"mat-expansion-panel-content-wrapper"],["role","region",1,"mat-expansion-panel-content",3,"id"],[1,"mat-expansion-panel-body"],[3,"cdkPortalOutlet"]],template:function(i,r){i&1&&(_e(CB),B(0),m(1,"div",2,0)(3,"div",3,1)(5,"div",4),B(6,1),yt(7,SB,0,0,"ng-template",5),f(),B(8,2),f()()),i&2&&(p(),L("inert",r.expanded?null:""),p(2),N("id",r.id),L("aria-labelledby",r._headerId),p(4),N("cdkPortalOutlet",r._portal))},dependencies:[Ti],styles:[`.mat-expansion-panel {
  box-sizing: content-box;
  display: block;
  margin: 0;
  overflow: hidden;
}
.mat-expansion-panel.mat-expansion-panel-animations-enabled {
  transition: margin 225ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel {
  position: relative;
  background: var(--%NS%mat-expansion-container-background-color, var(--%NS%mat-sys-surface));
  color: var(--%NS%mat-expansion-container-text-color, var(--%NS%mat-sys-on-surface));
  border-radius: var(--%NS%mat-expansion-container-shape, 12px);
}
.mat-expansion-panel:not([class*=mat-elevation-z]) {
  box-shadow: var(--%NS%mat-expansion-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}
.mat-accordion .mat-expansion-panel:not(.mat-expanded), .mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing) {
  border-radius: 0;
}
.mat-accordion .mat-expansion-panel:first-of-type {
  border-top-right-radius: var(--%NS%mat-expansion-container-shape, 12px);
  border-top-left-radius: var(--%NS%mat-expansion-container-shape, 12px);
}
.mat-accordion .mat-expansion-panel:last-of-type {
  border-bottom-right-radius: var(--%NS%mat-expansion-container-shape, 12px);
  border-bottom-left-radius: var(--%NS%mat-expansion-container-shape, 12px);
}
@media (forced-colors: active) {
  .mat-expansion-panel {
    outline: solid 1px;
  }
}

.mat-expansion-panel-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  grid-template-columns: 100%;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-content-wrapper {
  transition: grid-template-rows 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
  grid-template-rows: 1fr;
}
@supports not (grid-template-rows: 0fr) {
  .mat-expansion-panel-content-wrapper {
    height: 0;
  }
  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
    height: auto;
  }
}
@media print {
  .mat-expansion-panel-content-wrapper {
    height: 0;
  }
  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
    height: auto;
  }
}

.mat-expansion-panel-content {
  display: flex;
  flex-direction: column;
  overflow: visible;
  min-height: 0;
  visibility: hidden;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-content {
  transition: visibility 190ms linear;
}
.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper > .mat-expansion-panel-content {
  visibility: visible;
}
.mat-expansion-panel-content {
  font-family: var(--%NS%mat-expansion-container-text-font, var(--%NS%mat-sys-body-large-font));
  font-size: var(--%NS%mat-expansion-container-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-expansion-container-text-weight, var(--%NS%mat-sys-body-large-weight));
  line-height: var(--%NS%mat-expansion-container-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  letter-spacing: var(--%NS%mat-expansion-container-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}

.mat-expansion-panel-body {
  padding: 0 24px 16px;
}

.mat-expansion-panel-spacing {
  margin: 16px 0;
}
.mat-accordion > .mat-expansion-panel-spacing:first-child, .mat-accordion > *:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {
  margin-top: 0;
}
.mat-accordion > .mat-expansion-panel-spacing:last-child, .mat-accordion > *:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {
  margin-bottom: 0;
}

.mat-action-row {
  border-top-style: solid;
  border-top-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 16px 8px 16px 24px;
  border-top-color: var(--%NS%mat-expansion-actions-divider-color, var(--%NS%mat-sys-outline));
}
.mat-action-row .mat-button-base,
.mat-action-row .mat-mdc-button-base {
  margin-left: 8px;
}
[dir=rtl] .mat-action-row .mat-button-base,
[dir=rtl] .mat-action-row .mat-mdc-button-base {
  margin-left: 0;
  margin-right: 8px;
}
`],encapsulation:2})}return t})();var IM=(()=>{class t{panel=c(Eb,{host:!0});_element=c(F);_focusMonitor=c(Bt);_changeDetectorRef=c(Me);_parentChangeSubscription=ce.EMPTY;constructor(){c(Je).load(pn);let e=this.panel,i=c(NM,{optional:!0}),r=c(new Cn("tabindex"),{optional:!0}),o=e.accordion?e.accordion._stateChanges.pipe(ue(a=>!!(a.hideToggle||a.togglePosition))):at;this.tabIndex=parseInt(r||"")||0,this._parentChangeSubscription=mt(e.opened,e.closed,o,e._inputChanges.pipe(ue(a=>!!(a.hideToggle||a.disabled||a.togglePosition)))).subscribe(()=>this._changeDetectorRef.markForCheck()),e.closed.pipe(ue(()=>e._containsFocus())).subscribe(()=>this._focusMonitor.focusVia(this._element,"program")),i&&(this.expandedHeight=i.expandedHeight,this.collapsedHeight=i.collapsedHeight)}expandedHeight;collapsedHeight;tabIndex=0;get disabled(){return this.panel.disabled}_toggle(){this.disabled||this.panel.toggle()}_isExpanded(){return this.panel.expanded}_getExpandedState(){return this.panel._getExpandedState()}_getPanelId(){return this.panel.id}_getTogglePosition(){return this.panel.togglePosition}_showToggle(){return!this.panel.hideToggle&&!this.panel.disabled}_getHeaderHeight(){let e=this._isExpanded();return e&&this.expandedHeight?this.expandedHeight:!e&&this.collapsedHeight?this.collapsedHeight:null}_keydown(e){switch(e.keyCode){case 32:case 13:ut(e)||(e.preventDefault(),this._toggle());break;default:this.panel.accordion&&this.panel.accordion._handleHeaderKeydown(e);return}}focus(e,i){e?this._focusMonitor.focusVia(this._element,e,i):this._element.nativeElement.focus(i)}ngAfterViewInit(){this._focusMonitor.monitor(this._element).subscribe(e=>{e&&this.panel.accordion&&this.panel.accordion._handleHeaderFocus(this)})}ngOnDestroy(){this._parentChangeSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._element)}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=D({type:t,selectors:[["mat-expansion-panel-header"]],hostAttrs:["role","button",1,"mat-expansion-panel-header","mat-focus-indicator"],hostVars:13,hostBindings:function(i,r){i&1&&w("click",function(){return r._toggle()})("keydown",function(a){return r._keydown(a)}),i&2&&(L("id",r.panel._headerId)("tabindex",r.disabled?-1:r.tabIndex)("aria-controls",r._getPanelId())("aria-expanded",r._isExpanded())("aria-disabled",r.panel.disabled),Lt("height",r._getHeaderHeight()),T("mat-expanded",r._isExpanded())("mat-expansion-toggle-indicator-after",r._getTogglePosition()==="after")("mat-expansion-toggle-indicator-before",r._getTogglePosition()==="before"))},inputs:{expandedHeight:"expandedHeight",collapsedHeight:"collapsedHeight",tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:Nt(e)]},ngContentSelectors:DB,decls:5,vars:3,consts:[[1,"mat-content"],[1,"mat-expansion-indicator"],["xmlns","http://www.w3.org/2000/svg","viewBox","0 -960 960 960","aria-hidden","true","focusable","false"],["d","M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"]],template:function(i,r){i&1&&(_e(xB),je(0,"span",0),B(1),B(2,1),B(3,2),Ze(),E(4,EB,3,0,"span",1)),i&2&&(T("mat-content-hide-toggle",!r._showToggle()),p(4),M(r._showToggle()?4:-1))},styles:[`.mat-expansion-panel-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
  border-radius: inherit;
  outline: 0;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-header {
  transition: height 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel-header::before {
  border-radius: inherit;
}
.mat-expansion-panel-header {
  height: var(--%NS%mat-expansion-header-collapsed-state-height, 48px);
  font-family: var(--%NS%mat-expansion-header-text-font, var(--%NS%mat-sys-title-medium-font));
  font-size: var(--%NS%mat-expansion-header-text-size, var(--%NS%mat-sys-title-medium-size));
  font-weight: var(--%NS%mat-expansion-header-text-weight, var(--%NS%mat-sys-title-medium-weight));
  line-height: var(--%NS%mat-expansion-header-text-line-height, var(--%NS%mat-sys-title-medium-line-height));
  letter-spacing: var(--%NS%mat-expansion-header-text-tracking, var(--%NS%mat-sys-title-medium-tracking));
}
.mat-expansion-panel-header.mat-expanded {
  height: var(--%NS%mat-expansion-header-expanded-state-height, 64px);
}
.mat-expansion-panel-header[aria-disabled=true] {
  color: var(--%NS%mat-expansion-header-disabled-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-expansion-panel-header:not([aria-disabled=true]) {
  cursor: pointer;
}
.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {
  background: var(--%NS%mat-expansion-header-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
@media (hover: none) {
  .mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {
    background: var(--%NS%mat-expansion-container-background-color, var(--%NS%mat-sys-surface));
  }
}
.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused, .mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused {
  background: var(--%NS%mat-expansion-header-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));
}
.mat-expansion-panel-header._mat-animation-noopable {
  transition: none;
}
.mat-expansion-panel-header.mat-expanded:focus, .mat-expansion-panel-header.mat-expanded:hover {
  background: inherit;
}
.mat-expansion-panel-header.mat-expansion-toggle-indicator-before {
  flex-direction: row-reverse;
}
.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {
  margin: 0 16px 0 0;
}
[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {
  margin: 0 0 0 16px;
}

.mat-content {
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
}
.mat-content.mat-content-hide-toggle {
  margin-right: 8px;
}
[dir=rtl] .mat-content.mat-content-hide-toggle {
  margin-right: 0;
  margin-left: 8px;
}
.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {
  margin-left: 24px;
  margin-right: 0;
}
[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {
  margin-right: 24px;
  margin-left: 0;
}

.mat-expansion-panel-header-title {
  color: var(--%NS%mat-expansion-header-text-color, var(--%NS%mat-sys-on-surface));
}

.mat-expansion-panel-header-title,
.mat-expansion-panel-header-description {
  display: flex;
  flex-grow: 1;
  flex-basis: 0;
  margin-right: 16px;
  align-items: center;
}
[dir=rtl] .mat-expansion-panel-header-title,
[dir=rtl] .mat-expansion-panel-header-description {
  margin-right: 0;
  margin-left: 16px;
}
.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,
.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description {
  color: inherit;
}

.mat-expansion-panel-header-description {
  flex-grow: 2;
  color: var(--%NS%mat-expansion-header-description-color, var(--%NS%mat-sys-on-surface-variant));
}

.mat-expansion-panel-animations-enabled .mat-expansion-indicator {
  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel-header.mat-expanded .mat-expansion-indicator {
  transform: rotate(180deg);
}
.mat-expansion-indicator::after {
  border-style: solid;
  border-width: 0 2px 2px 0;
  content: "";
  padding: 3px;
  transform: rotate(45deg);
  vertical-align: middle;
  color: var(--%NS%mat-expansion-header-indicator-color, var(--%NS%mat-sys-on-surface-variant));
  display: var(--%NS%mat-expansion-legacy-header-indicator-display, none);
}
.mat-expansion-indicator svg {
  width: 24px;
  height: 24px;
  margin: 0 -8px;
  vertical-align: middle;
  fill: var(--%NS%mat-expansion-header-indicator-color, var(--%NS%mat-sys-on-surface-variant));
  display: var(--%NS%mat-expansion-header-indicator-display, inline-block);
}

@media (forced-colors: active) {
  .mat-expansion-panel-content {
    border-top: 1px solid;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
`],encapsulation:2})}return t})(),TM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-panel-description"]],hostAttrs:[1,"mat-expansion-panel-header-description"]})}return t})(),kM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-panel-title"]],hostAttrs:[1,"mat-expansion-panel-header-title"]})}return t})();var AM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[DM,ir,ge]})}return t})();function IB(t,n){if(t&1&&(m(0,"pre"),g(1),f()),t&2){let e=y();p(),k(e.tool.output)}}var dh=class t{static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-tool-call"]],inputs:{tool:"tool"},decls:9,vars:4,consts:[[1,"tool",3,"disabled"]],template:function(e,i){e&1&&(m(0,"mat-expansion-panel",0)(1,"mat-expansion-panel-header")(2,"mat-panel-title")(3,"mat-icon"),g(4,"build"),f(),g(5),f(),m(6,"mat-panel-description"),g(7),f()(),E(8,IB,2,1,"pre"),f()),e&2&&(N("disabled",!i.tool.output),p(5),k(i.tool.title),p(2),k(i.tool.status),p(),M(i.tool.output?8:-1))},dependencies:[AM,Eb,IM,kM,TM,Pe,ze],styles:["[_nghost-%COMP%]{display:block;margin:8px 0}.tool[_ngcontent-%COMP%]{border:1px solid var(--%NS%mat-sys-outline-variant);box-shadow:none}mat-panel-title[_ngcontent-%COMP%], mat-panel-description[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}mat-panel-title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary)}mat-panel-description[_ngcontent-%COMP%]{justify-content:flex-end;font:var(--%NS%mat-sys-label-medium)}pre[_ngcontent-%COMP%]{max-height:260px;overflow:auto;margin:0;padding:14px;border-radius:var(--%NS%mat-sys-corner-small);background:var(--%NS%mat-sys-surface-container-lowest);white-space:pre-wrap;overflow-wrap:anywhere;font:.82rem/1.45 ui-monospace,SFMono-Regular,Consolas,monospace}"]})}};var TB=(t,n)=>n.id;function kB(t,n){if(t&1&&(m(0,"div",0)(1,"div",4),g(2),f(),m(3,"time"),g(4),f()()),t&2){let e=y();p(2),k(e.user(e.item).text),p(2),k(e.formatTime(e.user(e.item).timestamp))}}function AB(t,n){t&1&&(m(0,"span",6),j(1,"mat-spinner",8),g(2," Thinking\u2026"),f())}function RB(t,n){if(t&1&&(m(0,"div",9),g(1),f()),t&2){let e=y().$implicit;p(),k(e.text)}}function OB(t,n){if(t&1&&(m(0,"details",10)(1,"summary")(2,"mat-icon"),g(3,"psychology"),f(),g(4," Thought process"),f(),m(5,"div"),g(6),f()()),t&2){let e=y().$implicit;p(6),k(e.text)}}function PB(t,n){if(t&1&&j(0,"hub-tool-call",11),t&2){let e=y().$implicit;N("tool",e)}}function FB(t,n){if(t&1&&j(0,"hub-plan-view",12),t&2){let e=y().$implicit;N("entries",e.entries)}}function LB(t,n){if(t&1&&j(0,"hub-permission-card",13),t&2){let e=y().$implicit,i=y(2);N("permission",e)("chatId",i.chatId)}}function jB(t,n){if(t&1&&E(0,RB,2,1,"div",9)(1,OB,7,1,"details",10)(2,PB,1,1,"hub-tool-call",11)(3,FB,1,1,"hub-plan-view",12)(4,LB,1,2,"hub-permission-card",13),t&2){let e,i=n.$implicit;M((e=i.type)==="message_chunk"?0:e==="thought_chunk"?1:e==="tool_call"?2:e==="plan"?3:e==="permission_request"?4:-1)}}function VB(t,n){if(t&1&&(m(0,"article",1)(1,"header")(2,"span",5),g(3),f(),m(4,"strong"),g(5),f(),m(6,"time"),g(7),f(),E(8,AB,3,0,"span",6),f(),m(9,"div",7),nt(10,jB,5,1,null,null,TB),f()()),t&2){let e=y();p(3),k(e.turn(e.item).agent[0]||"A"),p(2),k(e.turn(e.item).agent),p(2),k(e.formatTime(e.turn(e.item).timestamp)),p(),M(e.turn(e.item).status==="in_progress"?8:-1),p(2),it(e.turn(e.item).entries)}}function BB(t,n){if(t&1&&(m(0,"div",2)(1,"mat-icon"),g(2,"error"),f(),m(3,"span"),g(4),f()()),t&2){let e=y();p(4),k(e.error(e.item).message)}}function HB(t,n){if(t&1&&(m(0,"div",3)(1,"span"),g(2),f()()),t&2){let e=y();p(2),$a("Process: ",e.state(e.item).process," \xB7 Turn: ",e.state(e.item).turn)}}var uh=class t{constructor(){this.chatId=""}user(n){return n}turn(n){return n}error(n){return n}state(n){return n}formatTime(n){if(!n)return"";let e=new Date(n);return Number.isNaN(e.valueOf())?"":e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-message-item"]],inputs:{item:"item",chatId:"chatId"},decls:4,vars:1,consts:[[1,"user-message"],[1,"turn"],["role","alert",1,"error-message"],[1,"state-change"],[1,"user-bubble"],[1,"avatar"],[1,"thinking"],[1,"turn-body"],["diameter","14"],[1,"message-text"],[1,"thought"],[3,"tool"],[3,"entries"],[3,"permission","chatId"]],template:function(e,i){if(e&1&&E(0,kB,5,2,"div",0)(1,VB,12,4,"article",1)(2,BB,5,1,"div",2)(3,HB,3,2,"div",3),e&2){let r;M((r=i.item.type)==="user_message"?0:r==="turn"?1:r==="error"?2:r==="state_change"?3:-1)}},dependencies:[Pe,ze,Qt,Zt,lh,ch,dh],styles:["[_nghost-%COMP%]{display:block;margin-bottom:26px}.user-message[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:flex-end}.user-bubble[_ngcontent-%COMP%]{max-width:min(100%,640px);padding:12px 16px;border-radius:18px 18px 4px;background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container);white-space:pre-wrap;overflow-wrap:anywhere;font:var(--%NS%mat-sys-body-large);box-shadow:var(--%NS%mat-sys-level1)}time[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small)}.user-message[_ngcontent-%COMP%]   time[_ngcontent-%COMP%]{margin-top:5px;padding-right:4px}.turn[_ngcontent-%COMP%] > header[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-large)}.avatar[_ngcontent-%COMP%]{display:grid;place-items:center;width:32px;height:32px;flex:0 0 auto;border-radius:12px 12px 12px 3px;background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);font-weight:700;text-transform:uppercase}.turn[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface)}.thinking[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:var(--%NS%mat-sys-corner-full);background:var(--%NS%mat-sys-tertiary-container);color:var(--%NS%mat-sys-on-tertiary-container)}.turn-body[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:12px;padding:16px;border-radius:4px 20px 20px;background:var(--%NS%mat-sys-surface-container-low)}.message-text[_ngcontent-%COMP%]{white-space:pre-wrap;overflow-wrap:anywhere;font:var(--%NS%mat-sys-body-large)}.thought[_ngcontent-%COMP%]{padding:10px 12px;border:1px dashed var(--%NS%mat-sys-outline-variant);border-radius:var(--%NS%mat-sys-corner-medium);color:var(--%NS%mat-sys-on-surface-variant)}.thought[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]{display:flex;align-items:center;gap:7px;cursor:pointer;font:var(--%NS%mat-sys-label-large)}.thought[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:19px;height:19px;font-size:19px}.thought[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{margin-top:9px;padding-top:9px;border-top:1px solid var(--%NS%mat-sys-outline-variant);white-space:pre-wrap;overflow-wrap:anywhere;font:var(--%NS%mat-sys-body-medium)}.error-message[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}.state-change[_ngcontent-%COMP%]{display:flex;justify-content:center;margin:10px 0}.state-change[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{padding:5px 10px;border-radius:var(--%NS%mat-sys-corner-full);background:var(--%NS%mat-sys-surface-container-high);color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small)}@media(max-width:599px){.turn-body[_ngcontent-%COMP%]{padding:12px}}"]})}};var UB=["viewport"],zB=(t,n)=>n.id;function $B(t,n){if(t&1&&j(0,"hub-message-item",3),t&2){let e=n.$implicit,i=y();N("item",e)("chatId",i.chatId())}}function WB(t,n){if(t&1){let e=ae();m(0,"div",4)(1,"button",5),w("click",function(){q(e);let r=y();return Y(r.scrollToBottom(!0))}),m(2,"mat-icon"),g(3,"arrow_downward"),f(),g(4," Latest "),f()()}}var mh=class t{constructor(){this.items=rn([]);this.chatId=rn("");this.showScrollButton=S(!1);this.viewport=Oo("viewport");this.injector=c(X);this.autoScroll=!0;vt(()=>{this.items(),this.autoScroll&&tt({read:()=>this.scrollToBottom()},{injector:this.injector})})}onScroll(){let n=this.viewport()?.nativeElement;if(!n)return;let e=n.scrollHeight-n.scrollTop-n.clientHeight;this.autoScroll=e<=80,this.showScrollButton.set(e>200)}scrollToBottom(n=!1){let e=this.viewport()?.nativeElement;e&&(e.scrollTo({top:e.scrollHeight,behavior:n?"smooth":"auto"}),this.autoScroll=!0,this.showScrollButton.set(!1))}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-event-stream"]],viewQuery:function(e,i){e&1&&Ua(i.viewport,UB,5),e&2&&za()},inputs:{items:[1,"items"],chatId:[1,"chatId"]},decls:6,vars:1,consts:[["viewport",""],["aria-live","polite",1,"stream",3,"scroll"],[1,"stream-content"],[3,"item","chatId"],[1,"scroll-control"],["matFab","","extended","","type","button","matTooltip","Scroll to latest message",3,"click"]],template:function(e,i){e&1&&(m(0,"div",1,0),w("scroll",function(){return i.onScroll()}),m(2,"div",2),nt(3,$B,1,2,"hub-message-item",3,zB),f()(),E(5,WB,5,0,"div",4)),e&2&&(p(3),it(i.items()),p(2),M(i.showScrollButton()?5:-1))},dependencies:[Oe,Cs,Pe,ze,$r,sr,uh],styles:["[_nghost-%COMP%]{position:relative;display:block;min-height:0;flex:1}.stream[_ngcontent-%COMP%]{height:100%;overflow:auto;overscroll-behavior:contain;padding:28px max(var(--%NS%hub-gutter),(100% - var(--%NS%hub-measure)) / 2)}.stream-content[_ngcontent-%COMP%]{max-width:var(--%NS%hub-measure);margin:0 auto}.scroll-control[_ngcontent-%COMP%]{position:absolute;right:0;bottom:20px;left:0;display:flex;justify-content:center;pointer-events:none;z-index:1}.scroll-control[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{pointer-events:auto}@media(max-width:599px){.stream[_ngcontent-%COMP%]{padding:20px 16px}}"]})}};function GB(t,n){t&1&&(m(0,"section",9)(1,"mat-icon"),g(2,"chat"),f(),m(3,"h1"),g(4,"No chat selected"),f(),m(5,"p"),g(6,"Choose a chat from the navigation."),f()())}function qB(t,n){if(t&1&&(m(0,"section",9),j(1,"mat-spinner",14),m(2,"h1"),g(3),f(),m(4,"p"),g(5,"Initializing the ACP session and loading agent options."),f()()),t&2){let e=y();p(3),dt("Connecting to ",e.chat().agent,"\u2026")}}function YB(t,n){if(t&1){let e=ae();m(0,"section",10)(1,"mat-icon"),g(2,"error_outline"),f(),m(3,"h1"),g(4,"Connection failed"),f(),m(5,"p"),g(6),f(),m(7,"button",15),w("click",function(){q(e);let r=y();return Y(r.retry())}),g(8,"Retry connection"),f()()}if(t&2){let e=y();p(6),k(e.connectError())}}function ZB(t,n){if(t&1){let e=ae();m(0,"section",10)(1,"mat-icon"),g(2,"tune"),f(),m(3,"h1"),g(4,"Agent options not loaded"),f(),m(5,"p"),g(6),f(),m(7,"button",15),w("click",function(){q(e);let r=y();return Y(r.retry())}),g(8,"Retry connection"),f()()}if(t&2){let e=y();p(6),dt("Agent Hub cannot read the configuration of ",e.chat().agent," yet.")}}function QB(t,n){if(t&1&&(m(0,"section",11)(1,"mat-card")(2,"mat-card-content")(3,"div",16)(4,"span",17),g(5),f(),m(6,"div")(7,"h1"),g(8),f(),m(9,"p"),g(10,"Configure agent options or send your first message to begin."),f()()(),j(11,"hub-chat-config",6),f()()()),t&2){let e=y();p(5),k(e.chat().agent[0]),p(3),dt("",e.chat().agent," connected"),p(3),N("chat",e.chat())("options",e.options())}}function XB(t,n){if(t&1&&j(0,"hub-event-stream",12),t&2){let e=y();N("items",e.items())("chatId",e.chatId)}}function KB(t,n){if(t&1&&j(0,"hub-chat-composer",13),t&2){let e=y();N("chatId",e.chatId)("processState",e.chat().process_state||"STOPPED")("turnState",e.chat().turn_state||"IDLE")("disabled",e.connecting()||!!e.connectError()||!e.configLoaded())}}var fh=class t{constructor(){this.chatIdState=S("");this.state=c(Fe);this.configOpen=S(!1);this.compact=S(!1);this.breakpointObserver=c(zo);this.destroyRef=c(Xe);this.chat=De(()=>this.chatIdState()?this.state.findChat(this.chatIdState()):null);this.items=De(()=>this.chatIdState()?this.state.reducersByChat()[this.chatIdState()]?.items()??[]:[]);this.options=De(()=>this.chatIdState()?this.state.configOptionsByChat()[this.chatIdState()]??[]:[]);this.connecting=De(()=>this.chatIdState()?this.state.connectingChats().has(this.chatIdState()):!1);this.connectError=De(()=>this.chatIdState()?this.state.connectErrors()[this.chatIdState()]??"":"");this.configLoaded=De(()=>this.chatIdState()?this.state.configLoadedByChat()[this.chatIdState()]===!0:!1);this.breakpointObserver.observe("(max-width: 839px)").pipe($m(this.destroyRef)).subscribe(({matches:n})=>this.compact.set(n))}set chatId(n){this.chatIdState.set(n)}get chatId(){return this.chatIdState()}openConfig(n){this.configOpen.set(!0),n.open()}closeConfig(n){this.configOpen.set(!1),n.close()}retry(){this.chatId&&this.state.retryConnection(this.chatId)}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-chat-workspace"]],inputs:{chatId:"chatId"},decls:20,vars:8,consts:[["configDrawer",""],[1,"chat-layout",3,"hasBackdrop"],["position","end","aria-label","Chat configuration",3,"closed","mode","opened"],[1,"config-header"],["mat-icon-button","","aria-label","Close chat configuration",3,"click"],[1,"config-body"],[3,"chat","options"],[1,"chat-content"],[3,"configRequested","chat"],[1,"status-state"],["role","alert",1,"status-state","error-state"],[1,"welcome"],[3,"items","chatId"],[3,"chatId","processState","turnState","disabled"],["diameter","44"],["mat-flat-button","","type","button",3,"click"],[1,"welcome-heading"],[1,"avatar"]],template:function(e,i){if(e&1){let r=ae();m(0,"mat-drawer-container",1)(1,"mat-drawer",2,0),w("closed",function(){return i.configOpen.set(!1)}),m(3,"div",3)(4,"h2"),g(5,"Chat configuration"),f(),m(6,"button",4),w("click",function(){q(r);let a=rt(2);return Y(i.closeConfig(a))}),m(7,"mat-icon"),g(8,"close"),f()()(),m(9,"div",5),j(10,"hub-chat-config",6),f()(),m(11,"mat-drawer-content",7)(12,"hub-chat-header",8),w("configRequested",function(){q(r);let a=rt(2);return Y(i.openConfig(a))}),f(),E(13,GB,7,0,"section",9)(14,qB,6,1,"section",9)(15,YB,9,1,"section",10)(16,ZB,9,1,"section",10)(17,QB,12,4,"section",11)(18,XB,1,2,"hub-event-stream",12),E(19,KB,1,4,"hub-chat-composer",13),f()()}e&2&&(N("hasBackdrop",i.compact()),p(),N("mode",i.compact()?"over":"side")("opened",i.configOpen()),p(9),N("chat",i.chat())("options",i.options()),p(2),N("chat",i.chat()),p(),M(i.chat()?i.connecting()?14:i.connectError()?15:!i.configLoaded()&&!i.items().length?16:i.items().length?18:17:13),p(6),M(i.chat()?19:-1))},dependencies:[nh,ih,sh,mh,Oe,ot,En,$n,Ai,Ps,Pe,ze,Qt,Zt,sf,Rc,Oc,Zo],styles:["[_nghost-%COMP%]{display:flex;min-height:0;flex:1;flex-direction:column}.chat-layout[_ngcontent-%COMP%]{height:100%;min-height:0;flex:1}.chat-content[_ngcontent-%COMP%]{display:flex;height:100%;min-height:0;flex-direction:column;overflow:hidden}mat-drawer[_ngcontent-%COMP%]{display:flex;width:380px;max-width:90vw;flex-direction:column;border-left:1px solid var(--%NS%mat-sys-outline-variant)}.config-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex:0 0 auto;padding:14px 16px;border-bottom:1px solid var(--%NS%mat-sys-outline-variant)}.config-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-medium)}.config-body[_ngcontent-%COMP%]{min-height:0;flex:1;overflow:auto;padding:20px}.status-state[_ngcontent-%COMP%]{display:grid;justify-items:center;align-content:center;gap:12px;min-height:0;flex:1;padding:40px 20px;color:var(--%NS%mat-sys-on-surface-variant);text-align:center}.status-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:48px;height:48px;font-size:48px;color:var(--%NS%mat-sys-primary)}.status-state[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-small);color:var(--%NS%mat-sys-on-surface)}.error-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .error-state[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-error)}.welcome[_ngcontent-%COMP%]{display:flex;justify-content:center;min-height:0;overflow:auto;flex:1;padding:28px max(var(--%NS%hub-gutter),(100% - var(--%NS%hub-measure)) / 2)}.welcome[_ngcontent-%COMP%]   mat-card[_ngcontent-%COMP%]{width:100%;max-width:var(--%NS%hub-measure);align-self:flex-start}.welcome-heading[_ngcontent-%COMP%]{display:flex;align-items:center;gap:14px;margin-bottom:22px}.welcome-heading[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-small)}.welcome-heading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-top:4px;color:var(--%NS%mat-sys-on-surface-variant)}.avatar[_ngcontent-%COMP%]{display:grid;place-items:center;width:48px;height:48px;flex:0 0 auto;border-radius:16px 16px 16px 4px;background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);font-weight:700;text-transform:uppercase}@media(max-width:599px){.welcome[_ngcontent-%COMP%]{padding-inline:16px}}"]})}};var hh=class t{constructor(){this.route=c(Dn);this.chatId=us(this.route.paramMap.pipe(J(n=>n.get("chatId")??"")),{initialValue:this.route.snapshot.paramMap.get("chatId")??""})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-chat-page"]],decls:1,vars:1,consts:[[3,"chatId"]],template:function(e,i){e&1&&j(0,"hub-chat-workspace",0),e&2&&N("chatId",i.chatId())},dependencies:[fh],styles:["[_nghost-%COMP%]{display:flex;min-height:0;flex:1;flex-direction:column}"]})}};function JB(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=y();p(),k(e.errorMessage())}}function eH(t,n){t&1&&j(0,"mat-spinner",6)}function tH(t,n){t&1&&g(0," Delete project ")}var Ws=class t{constructor(n){this.project=n;this.state=c(Fe);this.dialogRef=c(Yt);this.deleting=S(!1);this.errorMessage=S("")}async delete(){this.deleting.set(!0),this.errorMessage.set("");try{await this.state.deleteProject(this.project.id),this.dialogRef.close(!0)}catch(n){this.errorMessage.set(n instanceof Error?n.message:"Failed to delete project")}finally{this.deleting.set(!1)}}static{this.\u0275fac=function(e){return new(e||t)(te(Nn))}}static{this.\u0275cmp=D({type:t,selectors:[["hub-delete-project-dialog"]],decls:20,vars:5,consts:[["mat-dialog-title",""],["role","alert",1,"error-box"],[1,"note"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","type","button",1,"destructive",3,"click","disabled"],["diameter","18"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"Delete project"),f(),m(2,"mat-dialog-content"),E(3,JB,2,1,"div",1),m(4,"p"),g(5,"Are you sure you want to remove "),m(6,"strong"),g(7),f(),g(8," from Agent Hub?"),f(),m(9,"p",2),g(10,"Project files on disk will "),m(11,"strong"),g(12,"not"),f(),g(13," be deleted."),f()(),m(14,"mat-dialog-actions",3)(15,"button",4),w("click",function(){return i.dialogRef.close()}),g(16,"Cancel"),f(),m(17,"button",5),w("click",function(){return i.delete()}),E(18,eH,1,0,"mat-spinner",6)(19,tH,1,0),f()()),e&2&&(p(3),M(i.errorMessage()?3:-1),p(4),dt("\u201C",i.project.name,"\u201D"),p(8),N("disabled",i.deleting()),p(2),N("disabled",i.deleting()),p(),M(i.deleting()?18:19))},dependencies:[Oe,ot,It,Hn,zn,Un,Qt,Zt],styles:["mat-dialog-content[_ngcontent-%COMP%]{display:flex;min-width:min(420px,100vw - 48px);flex-direction:column;gap:8px}.note[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}.destructive[_ngcontent-%COMP%]{--%NS%mat-button-filled-container-color: var(--%NS%mat-sys-error);--%NS%mat-button-filled-label-text-color: var(--%NS%mat-sys-on-error);--%NS%mat-button-filled-state-layer-color: var(--%NS%mat-sys-on-error)}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};function nH(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=y();p(),k(e.errorMessage())}}function iH(t,n){if(t&1&&(m(0,"div",6),g(1,"Browsing: "),m(2,"code"),g(3),f(),j(4,"br"),g(5,"Select the current folder to use it."),f()),t&2){let e=y();p(3),k(e.browsedPath())}}function rH(t,n){if(t&1&&(m(0,"div",7)(1,"strong"),g(2,"Selected directory"),f(),m(3,"code"),g(4),f()()),t&2){let e=y();p(4),k(e.selectedPath())}}var Gs=class t{constructor(n){this.project=n;this.state=c(Fe);this.dialogRef=c(Yt);this.name=S("");this.selectedPath=S("");this.browsedPath=S("");this.saving=S(!1);this.errorMessage=S("");this.canSave=De(()=>!!this.name().trim()&&!!this.selectedPath()&&!this.saving());this.name.set(n.name),this.selectedPath.set(n.path)}async save(){if(!this.name().trim()||!this.selectedPath()){this.errorMessage.set("Please provide both project name and directory path.");return}this.saving.set(!0),this.errorMessage.set("");try{await this.state.editProject(this.project.id,this.name().trim(),this.selectedPath().trim()),this.dialogRef.close()}catch(n){this.errorMessage.set(n instanceof Error?n.message:"Failed to update project")}finally{this.saving.set(!1)}}static{this.\u0275fac=function(e){return new(e||t)(te(Nn))}}static{this.\u0275cmp=D({type:t,selectors:[["hub-edit-project-dialog"]],decls:18,vars:7,consts:[["mat-dialog-title",""],["role","alert",1,"error-box"],["appearance","outline"],["matInput","","autocomplete","off",3,"ngModelChange","ngModel"],[1,"field-label"],[3,"folderBrowsed","folderSelected","initialPath"],[1,"path-note"],[1,"selected-path"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","type","button",3,"click","disabled"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"Edit project"),f(),m(2,"mat-dialog-content"),E(3,nH,2,1,"div",1),m(4,"mat-form-field",2)(5,"mat-label"),g(6,"Project display name"),f(),m(7,"input",3),w("ngModelChange",function(o){return i.name.set(o)}),f(),ii(),f(),m(8,"p",4),g(9,"Project directory"),f(),m(10,"hub-folder-picker",5),w("folderBrowsed",function(o){return i.browsedPath.set(o.path)})("folderSelected",function(o){return i.selectedPath.set(o.path)}),f(),E(11,iH,6,1,"div",6),E(12,rH,5,1,"div",7),f(),m(13,"mat-dialog-actions",8)(14,"button",9),w("click",function(){return i.dialogRef.close()}),g(15,"Cancel"),f(),m(16,"button",10),w("click",function(){return i.save()}),g(17,"Save changes"),f()()),e&2&&(p(3),M(i.errorMessage()?3:-1),p(4),N("ngModel",i.name()),ri(),p(3),N("initialPath",i.project.path),p(),M(i.browsedPath()&&i.browsedPath()!==i.selectedPath()?11:-1),p(),M(i.selectedPath()?12:-1),p(2),N("disabled",i.saving()),p(2),N("disabled",!i.canSave()))},dependencies:[Ur,Ii,Hr,Ko,Vs,Oe,ot,It,Hn,zn,Un,dn,Wn,In,Zr,Yr],styles:["mat-dialog-content[_ngcontent-%COMP%]{display:flex;min-width:min(520px,100vw - 48px);flex-direction:column;gap:12px}mat-form-field[_ngcontent-%COMP%]{width:100%}.field-label[_ngcontent-%COMP%]{margin:4px 0 -4px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-title-small)}.path-note[_ngcontent-%COMP%], .selected-path[_ngcontent-%COMP%], .error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium)}.path-note[_ngcontent-%COMP%], .selected-path[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container);color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-small)}.selected-path[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px}code[_ngcontent-%COMP%]{overflow-wrap:anywhere}.error-box[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};var oH=t=>["/projects",t],aH=t=>({project:t}),sH=(t,n)=>n.id;function lH(t,n){t&1&&(m(0,"div",5),j(1,"mat-spinner",11),m(2,"span"),g(3,"Loading projects\u2026"),f()())}function cH(t,n){if(t&1&&(m(0,"div",6),g(1),f()),t&2){let e=y();p(),k(e.state.projectsError())}}function dH(t,n){if(t&1){let e=ae();m(0,"mat-card",7)(1,"mat-icon"),g(2,"folder_open"),f(),m(3,"h2"),g(4,"No projects yet"),f(),m(5,"p"),g(6,"Create a project from an existing server directory or clone a Git repository."),f(),m(7,"button",4),w("click",function(){q(e);let r=y();return Y(r.newProject())}),m(8,"mat-icon"),g(9,"add"),f(),g(10," Create your first project"),f()()}}function uH(t,n){if(t&1&&(m(0,"mat-card",12)(1,"a",13)(2,"div",14)(3,"mat-icon"),g(4,"folder"),f()(),m(5,"mat-card-header")(6,"mat-card-title"),g(7),f(),m(8,"mat-card-subtitle",15),g(9),f()()(),m(10,"button",16)(11,"mat-icon"),g(12,"more_vert"),f()(),m(13,"div",17)(14,"span")(15,"mat-icon"),g(16,"chat"),f(),g(17),f(),m(18,"span"),g(19),f()()()),t&2){let e=n.$implicit,i=y(2),r=rt(16);p(),N("routerLink",Ro(10,oH,e.id)),L("aria-label","Open project "+e.name),p(6),k(e.name),p(),N("title",e.path),p(),k(e.path),p(),N("matMenuTriggerFor",r)("matMenuTriggerData",Ro(12,aH,e)),L("aria-label","Actions for "+e.name),p(7),dt("",i.chatCount(e)," chats"),p(2),dt("Updated ",i.formatDate(e.updated_at))}}function mH(t,n){if(t&1&&(m(0,"div",8),nt(1,uH,20,14,"mat-card",12,sH),f()),t&2){let e=y();p(),it(e.state.projects())}}function fH(t,n){if(t&1){let e=ae();m(0,"button",18),w("click",function(){let r=q(e).project,o=y();return Y(o.edit(r))}),m(1,"mat-icon"),g(2,"edit"),f(),m(3,"span"),g(4,"Edit project"),f()(),m(5,"button",18),w("click",function(){let r=q(e).project,o=y();return Y(o.remove(r))}),m(6,"mat-icon",19),g(7,"delete"),f(),m(8,"span"),g(9,"Delete project"),f()()}}var ph=class t{constructor(){this.state=c(Fe);this.dialog=c(ki)}newProject(){this.dialog.open(Bs,{width:"min(720px, calc(100vw - 32px))"})}edit(n){this.dialog.open(Gs,{width:"min(640px, calc(100vw - 32px))",data:n})}remove(n){this.dialog.open(Ws,{width:"min(520px, calc(100vw - 32px))",data:n})}chatCount(n){return n.chat_count??this.state.chatsByProject()[n.id]?.length??0}formatDate(n){if(!n)return"";let e=new Date(n);return Number.isNaN(e.valueOf())?"":e.toLocaleDateString([],{month:"short",day:"numeric"})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-project-list"]],decls:22,vars:1,consts:[["projectMenu","matMenu"],["aria-labelledby","projects-title",1,"projects-page"],[1,"page-header"],["id","projects-title"],["mat-flat-button","","type","button",3,"click"],["role","status",1,"loading"],["role","alert",1,"error-box"],[1,"empty-card"],[1,"project-grid"],["matMenuContent",""],["mat-fab","","extended","","type","button",1,"mobile-fab",3,"click"],["diameter","36"],[1,"project-card"],[1,"card-link",3,"routerLink"],[1,"project-icon"],[3,"title"],["mat-icon-button","",3,"matMenuTriggerFor","matMenuTriggerData"],[1,"card-meta"],["mat-menu-item","","type","button",3,"click"],[1,"destructive-icon"]],template:function(e,i){e&1&&(m(0,"section",1)(1,"div",2)(2,"div")(3,"h1",3),g(4,"Projects"),f(),m(5,"p"),g(6,"Manage code repositories and active ACP agent sessions."),f()(),m(7,"button",4),w("click",function(){return i.newProject()}),m(8,"mat-icon"),g(9,"add"),f(),g(10," New project"),f()(),E(11,lH,4,0,"div",5)(12,cH,2,1,"div",6)(13,dH,11,0,"mat-card",7)(14,mH,3,0,"div",8),m(15,"mat-menu",null,0),yt(17,fH,10,0,"ng-template",9),f(),m(18,"button",10),w("click",function(){return i.newProject()}),m(19,"mat-icon"),g(20,"add"),f(),g(21," New project"),f()()),e&2&&(p(11),M(i.state.loadingProjects()?11:i.state.projectsError()?12:i.state.projects().length===0?13:14))},dependencies:[Oe,ot,En,Cs,$n,Ai,Fs,Bf,Gr,It,Pe,ze,$s,Pi,lr,wM,zs,Qt,Zt,Ni],styles:[".destructive-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-error)}[_nghost-%COMP%]{display:block;min-height:0;flex:1;overflow:auto}.projects-page[_ngcontent-%COMP%]{max-width:1120px;margin:0 auto;padding:40px 32px 72px}.page-header[_ngcontent-%COMP%]{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:32px}h1[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-display-small);letter-spacing:var(--%NS%mat-sys-display-small-tracking)}.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-top:10px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-large)}.project-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}.project-card[_ngcontent-%COMP%]{position:relative;min-height:190px;padding:20px;transition:box-shadow .16s ease,transform .16s ease}.project-card[_ngcontent-%COMP%]:hover{transform:translateY(-2px);box-shadow:var(--%NS%mat-sys-level2)}.card-link[_ngcontent-%COMP%]{display:block;padding-right:34px;color:inherit;text-decoration:none}.project-card[_ngcontent-%COMP%] > button[_ngcontent-%COMP%]{position:absolute;top:12px;right:12px}.project-icon[_ngcontent-%COMP%]{display:grid;place-items:center;width:48px;height:48px;margin-bottom:16px;border-radius:16px 16px 16px 4px;background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container)}mat-card-header[_ngcontent-%COMP%]{padding:0}mat-card-title[_ngcontent-%COMP%], mat-card-subtitle[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.card-meta[_ngcontent-%COMP%]{display:flex;justify-content:space-between;gap:12px;margin-top:28px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-medium)}.card-meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px;min-width:0}.card-meta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:17px;height:17px;font-size:17px}.empty-card[_ngcontent-%COMP%]{display:grid;justify-items:center;gap:12px;padding:64px 24px;text-align:center}.empty-card[_ngcontent-%COMP%] > mat-icon[_ngcontent-%COMP%]{width:48px;height:48px;font-size:48px;color:var(--%NS%mat-sys-primary)}.empty-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .empty-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0}.empty-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{max-width:440px;color:var(--%NS%mat-sys-on-surface-variant)}.loading[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;gap:12px;padding:72px;color:var(--%NS%mat-sys-on-surface-variant)}.error-box[_ngcontent-%COMP%]{padding:16px;border-radius:var(--%NS%mat-sys-corner-large);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}.mobile-fab[_ngcontent-%COMP%]{display:none}@media(max-width:599px){.projects-page[_ngcontent-%COMP%]{padding:24px 16px 96px}.page-header[_ngcontent-%COMP%]{flex-direction:column}.page-header[_ngcontent-%COMP%] > button[_ngcontent-%COMP%]{width:100%}.project-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}.mobile-fab[_ngcontent-%COMP%]{display:inline-flex;position:fixed;right:20px;bottom:20px;z-index:4}}"]})}};var gh=class t{static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-home-page"]],decls:1,vars:0,template:function(e,i){e&1&&j(0,"hub-project-list")},dependencies:[ph],styles:["[_nghost-%COMP%]{display:flex;min-height:0;flex:1;flex-direction:column}"]})}};var hH=(t,n)=>["/projects",t,"chats",n],pH=(t,n)=>n.id;function gH(t,n){if(t&1&&(m(0,"mat-card",13)(1,"a",14)(2,"div",15)(3,"span",16),g(4),f(),m(5,"span",17),g(6),f()(),m(7,"mat-card-title"),g(8),f()()()),t&2){let e=n.$implicit,i=y(2);p(),N("routerLink",Yl(9,hH,i.id,e.id)),L("aria-label","Open chat "+(e.title||"Untitled chat")),p(3),k(e.agent),p(),T("running",e.process_state==="RUNNING")("dead",e.process_state==="DEAD"),p(),k(e.process_state||"STOPPED"),p(2),k(e.title||"Untitled chat")}}function _H(t,n){if(t&1&&(m(0,"div",11),nt(1,gH,9,12,"mat-card",13,pH),f()),t&2){let e=y(2);p(),it(e.chats())}}function vH(t,n){if(t&1){let e=ae();m(0,"mat-card",12)(1,"mat-icon"),g(2,"forum"),f(),m(3,"h2"),g(4,"No chats in this project yet"),f(),m(5,"p"),g(6,"Start a new chat with an ACP agent."),f(),m(7,"button",6),w("click",function(){q(e);let r=y(),o=y();return Y(o.newChat(r.id))}),m(8,"mat-icon"),g(9,"add_comment"),f(),g(10," New chat"),f()()}}function bH(t,n){if(t&1){let e=ae();m(0,"section",1)(1,"div",3)(2,"div")(3,"p",4),g(4,"Project"),f(),m(5,"h1"),g(6),f(),m(7,"code"),g(8),f()(),m(9,"div",5)(10,"button",6),w("click",function(){let r=q(e),o=y();return Y(o.newChat(r.id))}),m(11,"mat-icon"),g(12,"add_comment"),f(),g(13," New chat"),f(),m(14,"button",7)(15,"mat-icon"),g(16,"more_vert"),f()(),m(17,"mat-menu",null,0)(19,"button",8),w("click",function(){let r=q(e),o=y();return Y(o.edit(r))}),m(20,"mat-icon"),g(21,"edit"),f(),m(22,"span"),g(23,"Edit project"),f()(),m(24,"button",8),w("click",function(){let r=q(e),o=y();return Y(o.remove(r))}),m(25,"mat-icon",9),g(26,"delete"),f(),m(27,"span"),g(28,"Delete project"),f()()()()(),m(29,"div",10)(30,"h2"),g(31,"Chats in this project"),f(),m(32,"span"),g(33),f()(),E(34,_H,3,0,"div",11)(35,vH,11,0,"mat-card",12),f()}if(t&2){let e=n,i=rt(18),r=y();p(6),k(e.name),p(2),k(e.path),p(6),N("matMenuTriggerFor",i),p(19),dt("",r.chats().length," chats"),p(),M(r.chats().length?34:35)}}function yH(t,n){t&1&&(m(0,"section",2)(1,"mat-icon"),g(2,"folder_off"),f(),m(3,"h1"),g(4,"Project not found"),f(),m(5,"p"),g(6,"This project may have been deleted or the URL is malformed."),f(),m(7,"a",18),g(8,"Back to projects"),f()())}var _h=class t{constructor(){this.route=c(Dn);this.state=c(Fe);this.dialog=c(ki);this.projectId=us(this.route.paramMap.pipe(J(n=>n.get("projectId")??"")),{initialValue:this.route.snapshot.paramMap.get("projectId")??""});this.project=De(()=>this.state.projects().find(n=>n.id===this.projectId())??null);this.chats=De(()=>this.state.chatsByProject()[this.projectId()]??[]);vt(()=>{let n=this.projectId();n&&this.state.loadChats(n)})}newChat(n){this.dialog.open(Ls,{width:"min(560px, calc(100vw - 32px))",data:{projectId:n}})}edit(n){this.dialog.open(Gs,{width:"min(640px, calc(100vw - 32px))",data:n})}remove(n){this.dialog.open(Ws,{width:"min(520px, calc(100vw - 32px))",data:n})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=D({type:t,selectors:[["hub-project-page"]],decls:2,vars:1,consts:[["projectActions","matMenu"],[1,"project-page"],[1,"missing"],[1,"hero"],[1,"eyebrow"],[1,"hero-actions"],["mat-flat-button","","type","button",3,"click"],["mat-icon-button","","aria-label","Project actions",3,"matMenuTriggerFor"],["mat-menu-item","","type","button",3,"click"],[1,"destructive-icon"],[1,"section-title"],[1,"chat-grid"],[1,"empty-chat"],[1,"chat-card"],[3,"routerLink"],[1,"chat-top"],[1,"agent-badge"],[1,"process-state"],["mat-flat-button","","routerLink","/"]],template:function(e,i){if(e&1&&E(0,bH,36,5,"section",1)(1,yH,9,0,"section",2),e&2){let r;M((r=i.project())?0:1,r)}},dependencies:[Oe,ot,En,$n,Ai,Gr,It,Pe,ze,$s,Pi,lr,zs,Ni],styles:[".destructive-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-error)}[_nghost-%COMP%]{display:block;min-height:0;flex:1;overflow:auto}.project-page[_ngcontent-%COMP%]{max-width:1120px;margin:0 auto;padding:40px 32px 72px}.hero[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:32px;margin-bottom:36px;border-radius:var(--%NS%mat-sys-corner-extra-large);background:linear-gradient(120deg,var(--%NS%mat-sys-surface-container-low),var(--%NS%mat-sys-primary-container))}.eyebrow[_ngcontent-%COMP%]{margin-bottom:6px;color:var(--%NS%mat-sys-primary);font:var(--%NS%mat-sys-label-large);letter-spacing:.08em;text-transform:uppercase}h1[_ngcontent-%COMP%]{margin-bottom:8px;font:var(--%NS%mat-sys-display-small);letter-spacing:var(--%NS%mat-sys-display-small-tracking)}code[_ngcontent-%COMP%]{overflow-wrap:anywhere;color:var(--%NS%mat-sys-on-surface-variant)}.hero-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}.section-title[_ngcontent-%COMP%]{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:16px}.section-title[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-small);letter-spacing:var(--%NS%mat-sys-headline-small-tracking)}.section-title[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.chat-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}.chat-card[_ngcontent-%COMP%]{transition:transform .16s ease,box-shadow .16s ease}.chat-card[_ngcontent-%COMP%]:hover{transform:translateY(-2px);box-shadow:var(--%NS%mat-sys-level2)}.chat-card[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:block;padding:20px;color:inherit;text-decoration:none}.chat-top[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:26px}.agent-badge[_ngcontent-%COMP%]{padding:5px 10px;border-radius:var(--%NS%mat-sys-corner-full);background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);font:var(--%NS%mat-sys-label-medium)}.process-state[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small)}.process-state.running[_ngcontent-%COMP%]{color:var(--%NS%hub-status-running)}.process-state.dead[_ngcontent-%COMP%]{color:var(--%NS%hub-status-dead)}.empty-chat[_ngcontent-%COMP%], .missing[_ngcontent-%COMP%]{display:grid;justify-items:center;gap:12px;padding:56px 24px;text-align:center}.empty-chat[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .missing[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:48px;height:48px;font-size:48px;color:var(--%NS%mat-sys-primary)}.empty-chat[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .empty-chat[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .missing[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .missing[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0}.empty-chat[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .missing[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}@media(max-width:599px){.project-page[_ngcontent-%COMP%]{padding:24px 16px 56px}.hero[_ngcontent-%COMP%]{align-items:stretch;flex-direction:column;padding:24px}.hero-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:first-child{flex:1}.section-title[_ngcontent-%COMP%]{align-items:flex-start;flex-direction:column;gap:4px}.chat-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}}"]})}};var RM=[{path:"",component:gh,title:"Agent Hub"},{path:"projects/:projectId",component:_h,title:"Project | Agent Hub"},{path:"projects/:projectId/chats/:chatId",component:hh,title:"Chat | Agent Hub"},{path:"**",redirectTo:""}];V_(Kf,{providers:[w_(),W_(),Cv(RM)]}).catch(t=>console.error(t));
