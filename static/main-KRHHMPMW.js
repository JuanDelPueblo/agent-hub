var HM=Object.defineProperty,UM=Object.defineProperties;var zM=Object.getOwnPropertyDescriptors;var kb=Object.getOwnPropertySymbols;var $M=Object.prototype.hasOwnProperty,WM=Object.prototype.propertyIsEnumerable;var Ab=(t,n,e)=>n in t?HM(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e,y=(t,n)=>{for(var e in n||={})$M.call(n,e)&&Ab(t,e,n[e]);if(kb)for(var e of kb(n))WM.call(n,e)&&Ab(t,e,n[e]);return t},J=(t,n)=>UM(t,zM(n));var P=(t,n,e)=>new Promise((i,r)=>{var o=l=>{try{s(e.next(l))}catch(d){r(d)}},a=l=>{try{s(e.throw(l))}catch(d){r(d)}},s=l=>l.done?i(l.value):Promise.resolve(l.value).then(o,a);s((e=e.apply(t,n)).next())});var Kt=null,id=!1,eo=1,GM=null,gt=Symbol("SIGNAL");function ce(t){let n=Kt;return Kt=t,n}function rd(){return Kt}var pr={version:0,lastCleanEpoch:0,dirty:!1,producers:void 0,producersTail:void 0,consumers:void 0,consumersTail:void 0,recomputing:!1,consumerAllowSignalWrites:!1,consumerIsAlwaysLive:!1,kind:"unknown",producerMustRecompute:()=>!1,producerRecomputeValue:()=>{},consumerMarkedDirty:()=>{},consumerOnSignalRead:()=>{}};function gr(t){if(id)throw new Error("");if(Kt===null)return;Kt.consumerOnSignalRead(t);let n=Kt.producersTail;if(n!==void 0&&n.producer===t)return;let e,i=Kt.recomputing;if(i&&(e=n!==void 0?n.nextProducer:Kt.producers,e!==void 0&&e.producer===t)){Kt.producersTail=e,e.lastReadVersion=t.version,e.knownValidAtEpoch=eo;return}let r=t.consumersTail;if(r!==void 0&&r.consumer===Kt&&(!i||r.knownValidAtEpoch===eo))return;let o=la(Kt),a={producer:t,consumer:Kt,nextProducer:e,prevConsumer:void 0,knownValidAtEpoch:eo,lastReadVersion:t.version,nextConsumer:void 0};Kt.producersTail=a,n!==void 0?n.nextProducer=a:Kt.producers=a,o&&Fb(t,a)}function Rb(){eo++}function io(t){if(!(la(t)&&!t.dirty)&&!(!t.dirty&&t.lastCleanEpoch===eo)){if(!t.producerMustRecompute(t)&&!sa(t)){aa(t);return}t.producerRecomputeValue(t),aa(t)}}function Dh(t){if(t.consumers===void 0)return;let n=id;id=!0;try{for(let e=t.consumers;e!==void 0;e=e.nextConsumer){let i=e.consumer;i.dirty||qM(i)}}finally{id=n}}function Eh(){return Kt?.consumerAllowSignalWrites!==!1}function qM(t){t.dirty=!0,Dh(t),t.consumerMarkedDirty?.(t)}function aa(t){t.dirty=!1,t.lastCleanEpoch=eo}function Li(t){return t&&Ob(t),ce(t)}function Ob(t){if(t.producersTail?.knownValidAtEpoch===eo){let n=t.producers;for(;n!==void 0;)n.knownValidAtEpoch=null,n=n.nextProducer}t.producersTail=void 0,t.recomputing=!0}function _r(t,n){ce(n),t&&Pb(t)}function Pb(t){t.recomputing=!1;let n=t.producersTail,e=n!==void 0?n.nextProducer:t.producers;if(e!==void 0){if(la(t))do e=Mh(e);while(e!==void 0);n!==void 0?n.nextProducer=void 0:t.producers=void 0}}function sa(t){for(let n=t.producers;n!==void 0;n=n.nextProducer){let e=n.producer,i=n.lastReadVersion;if(i!==e.version||(io(e),i!==e.version))return!0}return!1}function vr(t){if(la(t)){let n=t.producers;for(;n!==void 0;)n=Mh(n)}t.producers=void 0,t.producersTail=void 0,t.consumers=void 0,t.consumersTail=void 0}function Fb(t,n){let e=t.consumersTail,i=la(t);if(e!==void 0?(n.nextConsumer=e.nextConsumer,e.nextConsumer=n):(n.nextConsumer=void 0,t.consumers=n),n.prevConsumer=e,t.consumersTail=n,!i)for(let r=t.producers;r!==void 0;r=r.nextProducer)Fb(r.producer,r)}function Mh(t){let n=t.producer,e=t.nextProducer,i=t.nextConsumer,r=t.prevConsumer;if(t.nextConsumer=void 0,t.prevConsumer=void 0,i!==void 0?i.prevConsumer=r:n.consumersTail=r,r!==void 0)r.nextConsumer=i;else if(n.consumers=i,!la(n)){let o=n.producers;for(;o!==void 0;)o=Mh(o)}return e}function la(t){return t.consumerIsAlwaysLive||t.consumers!==void 0}function Qs(t){GM?.(t)}function Xs(t,n){return Object.is(t,n)}function Ks(t,n){let e=Object.create(YM);e.computation=t,n!==void 0&&(e.equal=n);let i=()=>{if(io(e),gr(e),e.value===mi)throw e.error;return e.value};return i[gt]=e,Qs(e),i}var to=Symbol("UNSET"),no=Symbol("COMPUTING"),mi=Symbol("ERRORED"),YM=J(y({},pr),{value:to,dirty:!0,error:null,equal:Xs,kind:"computed",producerMustRecompute(t){return t.value===to||t.value===no},producerRecomputeValue(t){if(t.value===no)throw new Error("");let n=t.value;t.value=no;let e=Li(t),i,r=!1;try{i=t.computation(),ce(null),r=n!==to&&n!==mi&&i!==mi&&t.equal(n,i)}catch(o){i=mi,t.error=o}finally{_r(t,e)}if(r){t.value=n;return}t.value=i,t.version++}});function ZM(){throw new Error}var Lb=ZM;function jb(t){Lb(t)}function Ih(t){Lb=t}var QM=null;function Nh(t,n){let e=Object.create(ca);e.value=t,n!==void 0&&(e.equal=n);let i=()=>Vb(e);return i[gt]=e,Qs(e),[i,a=>br(e,a),a=>od(e,a)]}function Vb(t){return gr(t),t.value}function br(t,n){Eh()||jb(t),t.equal(t.value,n)||(t.value=n,XM(t))}function od(t,n){Eh()||jb(t),br(t,n(t.value))}var ca=J(y({},pr),{equal:Xs,value:void 0,kind:"signal"});function XM(t){t.version++,Rb(),Dh(t),QM?.(t)}var Th=J(y({},pr),{consumerIsAlwaysLive:!0,consumerAllowSignalWrites:!0,dirty:!0,kind:"effect"});function kh(t){if(t.dirty=!1,t.version>0&&!sa(t))return;t.version++;let n=Li(t);try{t.cleanup(),t.fn()}finally{_r(t,n)}}var Ah;function ad(){return Ah}function fi(t){let n=Ah;return Ah=t,n}var Bb=Symbol("NotFound");function da(t){return t===Bb||t?.name==="\u0275NotFound"}function Rh(t,n,e){let i=Object.create(KM);i.source=t,i.computation=n,e!=null&&(i.equal=e);let o=()=>{if(io(i),gr(i),i.value===mi)throw i.error;return i.value};return o[gt]=i,Qs(i),o}function Oh(t,n){io(t),br(t,n),aa(t)}function Hb(t,n){if(io(t),t.value===mi)throw t.error;od(t,n),aa(t)}var KM=J(y({},pr),{value:to,dirty:!0,error:null,equal:Xs,kind:"linkedSignal",producerMustRecompute(t){return t.value===to||t.value===no},producerRecomputeValue(t){if(t.value===no)throw new Error("");let n=t.value;t.value=no;let e=Li(t),i,r=!1;try{let o=t.source(),a=n!==to&&n!==mi,s=a?{source:t.sourceValue,value:n}:void 0;i=t.computation(o,s),t.sourceValue=o,ce(null),r=a&&i!==mi&&t.equal(n,i)}catch(o){i=mi,t.error=o}finally{_r(t,e)}if(r){t.value=n;return}t.value=i,t.version++}});function Ub(t){let n=ce(null);try{return t()}finally{ce(n)}}function we(t){return typeof t=="function"}function ua(t){let e=t(i=>{Error.call(i),i.stack=new Error().stack});return e.prototype=Object.create(Error.prototype),e.prototype.constructor=e,e}var sd=ua(t=>function(e){t(this),this.message=e?`${e.length} errors occurred during unsubscription:
${e.map((i,r)=>`${r+1}) ${i.toString()}`).join(`
  `)}`:"",this.name="UnsubscriptionError",this.errors=e});function ro(t,n){if(t){let e=t.indexOf(n);0<=e&&t.splice(e,1)}}var ue=class t{constructor(n){this.initialTeardown=n,this.closed=!1,this._parentage=null,this._finalizers=null}unsubscribe(){let n;if(!this.closed){this.closed=!0;let{_parentage:e}=this;if(e)if(this._parentage=null,Array.isArray(e))for(let o of e)o.remove(this);else e.remove(this);let{initialTeardown:i}=this;if(we(i))try{i()}catch(o){n=o instanceof sd?o.errors:[o]}let{_finalizers:r}=this;if(r){this._finalizers=null;for(let o of r)try{zb(o)}catch(a){n=n??[],a instanceof sd?n=[...n,...a.errors]:n.push(a)}}if(n)throw new sd(n)}}add(n){var e;if(n&&n!==this)if(this.closed)zb(n);else{if(n instanceof t){if(n.closed||n._hasParent(this))return;n._addParent(this)}(this._finalizers=(e=this._finalizers)!==null&&e!==void 0?e:[]).push(n)}}_hasParent(n){let{_parentage:e}=this;return e===n||Array.isArray(e)&&e.includes(n)}_addParent(n){let{_parentage:e}=this;this._parentage=Array.isArray(e)?(e.push(n),e):e?[e,n]:n}_removeParent(n){let{_parentage:e}=this;e===n?this._parentage=null:Array.isArray(e)&&ro(e,n)}remove(n){let{_finalizers:e}=this;e&&ro(e,n),n instanceof t&&n._removeParent(this)}};ue.EMPTY=(()=>{let t=new ue;return t.closed=!0,t})();var Ph=ue.EMPTY;function ld(t){return t instanceof ue||t&&"closed"in t&&we(t.remove)&&we(t.add)&&we(t.unsubscribe)}function zb(t){we(t)?t():t.unsubscribe()}var Gn={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1};var ma={setTimeout(t,n,...e){let{delegate:i}=ma;return i?.setTimeout?i.setTimeout(t,n,...e):setTimeout(t,n,...e)},clearTimeout(t){let{delegate:n}=ma;return(n?.clearTimeout||clearTimeout)(t)},delegate:void 0};function cd(t){ma.setTimeout(()=>{let{onUnhandledError:n}=Gn;if(n)n(t);else throw t})}function oo(){}var $b=Fh("C",void 0,void 0);function Wb(t){return Fh("E",void 0,t)}function Gb(t){return Fh("N",t,void 0)}function Fh(t,n,e){return{kind:t,value:n,error:e}}var ao=null;function fa(t){if(Gn.useDeprecatedSynchronousErrorHandling){let n=!ao;if(n&&(ao={errorThrown:!1,error:null}),t(),n){let{errorThrown:e,error:i}=ao;if(ao=null,e)throw i}}else t()}function qb(t){Gn.useDeprecatedSynchronousErrorHandling&&ao&&(ao.errorThrown=!0,ao.error=t)}var so=class extends ue{constructor(n){super(),this.isStopped=!1,n?(this.destination=n,ld(n)&&n.add(this)):this.destination=tI}static create(n,e,i){return new qn(n,e,i)}next(n){this.isStopped?jh(Gb(n),this):this._next(n)}error(n){this.isStopped?jh(Wb(n),this):(this.isStopped=!0,this._error(n))}complete(){this.isStopped?jh($b,this):(this.isStopped=!0,this._complete())}unsubscribe(){this.closed||(this.isStopped=!0,super.unsubscribe(),this.destination=null)}_next(n){this.destination.next(n)}_error(n){try{this.destination.error(n)}finally{this.unsubscribe()}}_complete(){try{this.destination.complete()}finally{this.unsubscribe()}}},JM=Function.prototype.bind;function Lh(t,n){return JM.call(t,n)}var Vh=class{constructor(n){this.partialObserver=n}next(n){let{partialObserver:e}=this;if(e.next)try{e.next(n)}catch(i){dd(i)}}error(n){let{partialObserver:e}=this;if(e.error)try{e.error(n)}catch(i){dd(i)}else dd(n)}complete(){let{partialObserver:n}=this;if(n.complete)try{n.complete()}catch(e){dd(e)}}},qn=class extends so{constructor(n,e,i){super();let r;if(we(n)||!n)r={next:n??void 0,error:e??void 0,complete:i??void 0};else{let o;this&&Gn.useDeprecatedNextContext?(o=Object.create(n),o.unsubscribe=()=>this.unsubscribe(),r={next:n.next&&Lh(n.next,o),error:n.error&&Lh(n.error,o),complete:n.complete&&Lh(n.complete,o)}):r=n}this.destination=new Vh(r)}};function dd(t){Gn.useDeprecatedSynchronousErrorHandling?qb(t):cd(t)}function eI(t){throw t}function jh(t,n){let{onStoppedNotification:e}=Gn;e&&ma.setTimeout(()=>e(t,n))}var tI={closed:!0,next:oo,error:eI,complete:oo};var ha=typeof Symbol=="function"&&Symbol.observable||"@@observable";function _n(t){return t}function ud(...t){return Bh(t)}function Bh(t){return t.length===0?_n:t.length===1?t[0]:function(e){return t.reduce((i,r)=>r(i),e)}}var de=class t{constructor(n){n&&(this._subscribe=n)}lift(n){let e=new t;return e.source=this,e.operator=n,e}subscribe(n,e,i){let r=iI(n)?n:new qn(n,e,i);return fa(()=>{let{operator:o,source:a}=this;r.add(o?o.call(r,a):a?this._subscribe(r):this._trySubscribe(r))}),r}_trySubscribe(n){try{return this._subscribe(n)}catch(e){n.error(e)}}forEach(n,e){return e=Yb(e),new e((i,r)=>{let o=new qn({next:a=>{try{n(a)}catch(s){r(s),o.unsubscribe()}},error:r,complete:i});this.subscribe(o)})}_subscribe(n){var e;return(e=this.source)===null||e===void 0?void 0:e.subscribe(n)}[ha](){return this}pipe(...n){return Bh(n)(this)}toPromise(n){return n=Yb(n),new n((e,i)=>{let r;this.subscribe(o=>r=o,o=>i(o),()=>e(r))})}};de.create=t=>new de(t);function Yb(t){var n;return(n=t??Gn.Promise)!==null&&n!==void 0?n:Promise}function nI(t){return t&&we(t.next)&&we(t.error)&&we(t.complete)}function iI(t){return t&&t instanceof so||nI(t)&&ld(t)}function rI(t){return we(t?.lift)}function be(t){return n=>{if(rI(n))return n.lift(function(e){try{return t(e,this)}catch(i){this.error(i)}});throw new TypeError("Unable to lift unknown Observable type")}}function Se(t,n,e,i,r){return new Hh(t,n,e,i,r)}var Hh=class extends so{constructor(n,e,i,r,o,a){super(n),this.onFinalize=o,this.shouldUnsubscribe=a,this._next=e?function(s){try{e(s)}catch(l){n.error(l)}}:super._next,this._error=r?function(s){try{r(s)}catch(l){n.error(l)}finally{this.unsubscribe()}}:super._error,this._complete=i?function(){try{i()}catch(s){n.error(s)}finally{this.unsubscribe()}}:super._complete}unsubscribe(){var n;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){let{closed:e}=this;super.unsubscribe(),!e&&((n=this.onFinalize)===null||n===void 0||n.call(this))}}};var Zb=ua(t=>function(){t(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"});var I=class extends de{constructor(){super(),this.closed=!1,this.currentObservers=null,this.observers=[],this.isStopped=!1,this.hasError=!1,this.thrownError=null}lift(n){let e=new md(this,this);return e.operator=n,e}_throwIfClosed(){if(this.closed)throw new Zb}next(n){fa(()=>{if(this._throwIfClosed(),!this.isStopped){this.currentObservers||(this.currentObservers=Array.from(this.observers));for(let e of this.currentObservers)e.next(n)}})}error(n){fa(()=>{if(this._throwIfClosed(),!this.isStopped){this.hasError=this.isStopped=!0,this.thrownError=n;let{observers:e}=this;for(;e.length;)e.shift().error(n)}})}complete(){fa(()=>{if(this._throwIfClosed(),!this.isStopped){this.isStopped=!0;let{observers:n}=this;for(;n.length;)n.shift().complete()}})}unsubscribe(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null}get observed(){var n;return((n=this.observers)===null||n===void 0?void 0:n.length)>0}_trySubscribe(n){return this._throwIfClosed(),super._trySubscribe(n)}_subscribe(n){return this._throwIfClosed(),this._checkFinalizedStatuses(n),this._innerSubscribe(n)}_innerSubscribe(n){let{hasError:e,isStopped:i,observers:r}=this;return e||i?Ph:(this.currentObservers=null,r.push(n),new ue(()=>{this.currentObservers=null,ro(r,n)}))}_checkFinalizedStatuses(n){let{hasError:e,thrownError:i,isStopped:r}=this;e?n.error(i):r&&n.complete()}asObservable(){let n=new de;return n.source=this,n}};I.create=(t,n)=>new md(t,n);var md=class extends I{constructor(n,e){super(),this.destination=n,this.source=e}next(n){var e,i;(i=(e=this.destination)===null||e===void 0?void 0:e.next)===null||i===void 0||i.call(e,n)}error(n){var e,i;(i=(e=this.destination)===null||e===void 0?void 0:e.error)===null||i===void 0||i.call(e,n)}complete(){var n,e;(e=(n=this.destination)===null||n===void 0?void 0:n.complete)===null||e===void 0||e.call(n)}_subscribe(n){var e,i;return(i=(e=this.source)===null||e===void 0?void 0:e.subscribe(n))!==null&&i!==void 0?i:Ph}};var Et=class extends I{constructor(n){super(),this._value=n}get value(){return this.getValue()}_subscribe(n){let e=super._subscribe(n);return!e.closed&&n.next(this._value),e}getValue(){let{hasError:n,thrownError:e,_value:i}=this;if(n)throw e;return this._throwIfClosed(),i}next(n){super.next(this._value=n)}};var Js={now(){return(Js.delegate||Date).now()},delegate:void 0};var ji=class extends I{constructor(n=1/0,e=1/0,i=Js){super(),this._bufferSize=n,this._windowTime=e,this._timestampProvider=i,this._buffer=[],this._infiniteTimeWindow=!0,this._infiniteTimeWindow=e===1/0,this._bufferSize=Math.max(1,n),this._windowTime=Math.max(1,e)}next(n){let{isStopped:e,_buffer:i,_infiniteTimeWindow:r,_timestampProvider:o,_windowTime:a}=this;e||(i.push(n),!r&&i.push(o.now()+a)),this._trimBuffer(),super.next(n)}_subscribe(n){this._throwIfClosed(),this._trimBuffer();let e=this._innerSubscribe(n),{_infiniteTimeWindow:i,_buffer:r}=this,o=r.slice();for(let a=0;a<o.length&&!n.closed;a+=i?1:2)n.next(o[a]);return this._checkFinalizedStatuses(n),e}_trimBuffer(){let{_bufferSize:n,_timestampProvider:e,_buffer:i,_infiniteTimeWindow:r}=this,o=(r?1:2)*n;if(n<1/0&&o<i.length&&i.splice(0,i.length-o),!r){let a=e.now(),s=0;for(let l=1;l<i.length&&i[l]<=a;l+=2)s=l;s&&i.splice(0,s+1)}}};var fd=class extends ue{constructor(n,e){super()}schedule(n,e=0){return this}};var el={setInterval(t,n,...e){let{delegate:i}=el;return i?.setInterval?i.setInterval(t,n,...e):setInterval(t,n,...e)},clearInterval(t){let{delegate:n}=el;return(n?.clearInterval||clearInterval)(t)},delegate:void 0};var hd=class extends fd{constructor(n,e){super(n,e),this.scheduler=n,this.work=e,this.pending=!1}schedule(n,e=0){var i;if(this.closed)return this;this.state=n;let r=this.id,o=this.scheduler;return r!=null&&(this.id=this.recycleAsyncId(o,r,e)),this.pending=!0,this.delay=e,this.id=(i=this.id)!==null&&i!==void 0?i:this.requestAsyncId(o,this.id,e),this}requestAsyncId(n,e,i=0){return el.setInterval(n.flush.bind(n,this),i)}recycleAsyncId(n,e,i=0){if(i!=null&&this.delay===i&&this.pending===!1)return e;e!=null&&el.clearInterval(e)}execute(n,e){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;let i=this._execute(n,e);if(i)return i;this.pending===!1&&this.id!=null&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))}_execute(n,e){let i=!1,r;try{this.work(n)}catch(o){i=!0,r=o||new Error("Scheduled action threw falsy error")}if(i)return this.unsubscribe(),r}unsubscribe(){if(!this.closed){let{id:n,scheduler:e}=this,{actions:i}=e;this.work=this.state=this.scheduler=null,this.pending=!1,ro(i,this),n!=null&&(this.id=this.recycleAsyncId(e,n,null)),this.delay=null,super.unsubscribe()}}};var Uh=(()=>{class t{constructor(e,i=t.now){this.schedulerActionCtor=e,this.now=i}schedule(e,i=0,r){return new this.schedulerActionCtor(this,e).schedule(r,i)}}return t.now=Js.now,t})();var pd=class extends Uh{constructor(n,e=Uh.now){super(n,e),this.actions=[],this._active=!1}flush(n){let{actions:e}=this;if(this._active){e.push(n);return}let i;this._active=!0;do if(i=n.execute(n.state,n.delay))break;while(n=e.shift());if(this._active=!1,i){for(;n=e.shift();)n.unsubscribe();throw i}}};var lo=new pd(hd),Qb=lo;var at=new de(t=>t.complete());function gd(t){return t&&we(t.schedule)}function zh(t){return t[t.length-1]}function _d(t){return we(zh(t))?t.pop():void 0}function hi(t){return gd(zh(t))?t.pop():void 0}function Xb(t,n){return typeof zh(t)=="number"?t.pop():n}function Jb(t,n,e,i){function r(o){return o instanceof e?o:new e(function(a){a(o)})}return new(e||(e=Promise))(function(o,a){function s(u){try{d(i.next(u))}catch(h){a(h)}}function l(u){try{d(i.throw(u))}catch(h){a(h)}}function d(u){u.done?o(u.value):r(u.value).then(s,l)}d((i=i.apply(t,n||[])).next())})}function Kb(t){var n=typeof Symbol=="function"&&Symbol.iterator,e=n&&t[n],i=0;if(e)return e.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&i>=t.length&&(t=void 0),{value:t&&t[i++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}function co(t){return this instanceof co?(this.v=t,this):new co(t)}function ey(t,n,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=e.apply(t,n||[]),r,o=[];return r=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),s("next"),s("throw"),s("return",a),r[Symbol.asyncIterator]=function(){return this},r;function a(v){return function(S){return Promise.resolve(S).then(v,h)}}function s(v,S){i[v]&&(r[v]=function(A){return new Promise(function(oe,ae){o.push([v,A,oe,ae])>1||l(v,A)})},S&&(r[v]=S(r[v])))}function l(v,S){try{d(i[v](S))}catch(A){_(o[0][3],A)}}function d(v){v.value instanceof co?Promise.resolve(v.value.v).then(u,h):_(o[0][2],v)}function u(v){l("next",v)}function h(v){l("throw",v)}function _(v,S){v(S),o.shift(),o.length&&l(o[0][0],o[0][1])}}function ty(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=t[Symbol.asyncIterator],e;return n?n.call(t):(t=typeof Kb=="function"?Kb(t):t[Symbol.iterator](),e={},i("next"),i("throw"),i("return"),e[Symbol.asyncIterator]=function(){return this},e);function i(o){e[o]=t[o]&&function(a){return new Promise(function(s,l){a=t[o](a),r(s,l,a.done,a.value)})}}function r(o,a,s,l){Promise.resolve(l).then(function(d){o({value:d,done:s})},a)}}var vd=(t=>t&&typeof t.length=="number"&&typeof t!="function");function bd(t){return we(t?.then)}function yd(t){return we(t[ha])}function Cd(t){return Symbol.asyncIterator&&we(t?.[Symbol.asyncIterator])}function wd(t){return new TypeError(`You provided ${t!==null&&typeof t=="object"?"an invalid object":`'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)}function oI(){return typeof Symbol!="function"||!Symbol.iterator?"@@iterator":Symbol.iterator}var Sd=oI();function xd(t){return we(t?.[Sd])}function Dd(t){return ey(this,arguments,function*(){let e=t.getReader();try{for(;;){let{value:i,done:r}=yield co(e.read());if(r)return yield co(void 0);yield yield co(i)}}finally{e.releaseLock()}})}function Ed(t){return we(t?.getReader)}function Ge(t){if(t instanceof de)return t;if(t!=null){if(yd(t))return aI(t);if(vd(t))return sI(t);if(bd(t))return lI(t);if(Cd(t))return ny(t);if(xd(t))return cI(t);if(Ed(t))return dI(t)}throw wd(t)}function aI(t){return new de(n=>{let e=t[ha]();if(we(e.subscribe))return e.subscribe(n);throw new TypeError("Provided object does not correctly implement Symbol.observable")})}function sI(t){return new de(n=>{for(let e=0;e<t.length&&!n.closed;e++)n.next(t[e]);n.complete()})}function lI(t){return new de(n=>{t.then(e=>{n.closed||(n.next(e),n.complete())},e=>n.error(e)).then(null,cd)})}function cI(t){return new de(n=>{for(let e of t)if(n.next(e),n.closed)return;n.complete()})}function ny(t){return new de(n=>{uI(t,n).catch(e=>n.error(e))})}function dI(t){return ny(Dd(t))}function uI(t,n){var e,i,r,o;return Jb(this,void 0,void 0,function*(){try{for(e=ty(t);i=yield e.next(),!i.done;){let a=i.value;if(n.next(a),n.closed)return}}catch(a){r={error:a}}finally{try{i&&!i.done&&(o=e.return)&&(yield o.call(e))}finally{if(r)throw r.error}}n.complete()})}function un(t,n,e,i=0,r=!1){let o=n.schedule(function(){e(),r?t.add(this.schedule(null,i)):this.unsubscribe()},i);if(t.add(o),!r)return o}function Md(t,n=0){return be((e,i)=>{e.subscribe(Se(i,r=>un(i,t,()=>i.next(r),n),()=>un(i,t,()=>i.complete(),n),r=>un(i,t,()=>i.error(r),n)))})}function Id(t,n=0){return be((e,i)=>{i.add(t.schedule(()=>e.subscribe(i),n))})}function iy(t,n){return Ge(t).pipe(Id(n),Md(n))}function ry(t,n){return Ge(t).pipe(Id(n),Md(n))}function oy(t,n){return new de(e=>{let i=0;return n.schedule(function(){i===t.length?e.complete():(e.next(t[i++]),e.closed||this.schedule())})})}function ay(t,n){return new de(e=>{let i;return un(e,n,()=>{i=t[Sd](),un(e,n,()=>{let r,o;try{({value:r,done:o}=i.next())}catch(a){e.error(a);return}o?e.complete():e.next(r)},0,!0)}),()=>we(i?.return)&&i.return()})}function Nd(t,n){if(!t)throw new Error("Iterable cannot be null");return new de(e=>{un(e,n,()=>{let i=t[Symbol.asyncIterator]();un(e,n,()=>{i.next().then(r=>{r.done?e.complete():e.next(r.value)})},0,!0)})})}function sy(t,n){return Nd(Dd(t),n)}function ly(t,n){if(t!=null){if(yd(t))return iy(t,n);if(vd(t))return oy(t,n);if(bd(t))return ry(t,n);if(Cd(t))return Nd(t,n);if(xd(t))return ay(t,n);if(Ed(t))return sy(t,n)}throw wd(t)}function st(t,n){return n?ly(t,n):Ge(t)}function ie(...t){let n=hi(t);return st(t,n)}function tl(t,n){let e=we(t)?t:()=>t,i=r=>r.error(e());return new de(n?r=>n.schedule(i,0,r):i)}function nl(t){return!!t&&(t instanceof de||we(t.lift)&&we(t.subscribe))}var Vi=ua(t=>function(){t(this),this.name="EmptyError",this.message="no elements in sequence"});function $h(t,n){let e=typeof n=="object";return new Promise((i,r)=>{let o=new qn({next:a=>{i(a),o.unsubscribe()},error:r,complete:()=>{e?i(n.defaultValue):r(new Vi)}});t.subscribe(o)})}function cy(t){return t instanceof Date&&!isNaN(t)}function ee(t,n){return be((e,i)=>{let r=0;e.subscribe(Se(i,o=>{i.next(t.call(n,o,r++))}))})}var{isArray:mI}=Array;function fI(t,n){return mI(n)?t(...n):t(n)}function Td(t){return ee(n=>fI(t,n))}var{isArray:hI}=Array,{getPrototypeOf:pI,prototype:gI,keys:_I}=Object;function kd(t){if(t.length===1){let n=t[0];if(hI(n))return{args:n,keys:null};if(vI(n)){let e=_I(n);return{args:e.map(i=>n[i]),keys:e}}}return{args:t,keys:null}}function vI(t){return t&&typeof t=="object"&&pI(t)===gI}function Ad(t,n){return t.reduce((e,i,r)=>(e[i]=n[r],e),{})}function il(...t){let n=hi(t),e=_d(t),{args:i,keys:r}=kd(t);if(i.length===0)return st([],n);let o=new de(bI(i,n,r?a=>Ad(r,a):_n));return e?o.pipe(Td(e)):o}function bI(t,n,e=_n){return i=>{dy(n,()=>{let{length:r}=t,o=new Array(r),a=r,s=r;for(let l=0;l<r;l++)dy(n,()=>{let d=st(t[l],n),u=!1;d.subscribe(Se(i,h=>{o[l]=h,u||(u=!0,s--),s||i.next(e(o.slice()))},()=>{--a||i.complete()}))},i)},i)}}function dy(t,n,e){t?un(e,t,n):n()}function uy(t,n,e,i,r,o,a,s){let l=[],d=0,u=0,h=!1,_=()=>{h&&!l.length&&!d&&n.complete()},v=A=>d<i?S(A):l.push(A),S=A=>{o&&n.next(A),d++;let oe=!1;Ge(e(A,u++)).subscribe(Se(n,ae=>{r?.(ae),o?v(ae):n.next(ae)},()=>{oe=!0},void 0,()=>{if(oe)try{for(d--;l.length&&d<i;){let ae=l.shift();a?un(n,a,()=>S(ae)):S(ae)}_()}catch(ae){n.error(ae)}}))};return t.subscribe(Se(n,v,()=>{h=!0,_()})),()=>{s?.()}}function Pt(t,n,e=1/0){return we(n)?Pt((i,r)=>ee((o,a)=>n(i,o,r,a))(Ge(t(i,r))),e):(typeof n=="number"&&(e=n),be((i,r)=>uy(i,r,t,e)))}function yr(t=1/0){return Pt(_n,t)}function my(){return yr(1)}function pi(...t){return my()(st(t,hi(t)))}function Yn(t){return new de(n=>{Ge(t()).subscribe(n)})}function rl(...t){let n=_d(t),{args:e,keys:i}=kd(t),r=new de(o=>{let{length:a}=e;if(!a){o.complete();return}let s=new Array(a),l=a,d=a;for(let u=0;u<a;u++){let h=!1;Ge(e[u]).subscribe(Se(o,_=>{h||(h=!0,d--),s[u]=_},()=>l--,void 0,()=>{(!l||!h)&&(d||o.next(i?Ad(i,s):s),o.complete())}))}});return n?r.pipe(Td(n)):r}function uo(t=0,n,e=Qb){let i=-1;return n!=null&&(gd(n)?e=n:i=n),new de(r=>{let o=cy(t)?+t-e.now():t;o<0&&(o=0);let a=0;return e.schedule(function(){r.closed||(r.next(a++),0<=i?this.schedule(void 0,i):r.complete())},o)})}function ft(...t){let n=hi(t),e=Xb(t,1/0),i=t;return i.length?i.length===1?Ge(i[0]):yr(e)(st(i,n)):at}function me(t,n){return be((e,i)=>{let r=0;e.subscribe(Se(i,o=>t.call(n,o,r++)&&i.next(o)))})}function fy(t){return be((n,e)=>{let i=!1,r=null,o=null,a=!1,s=()=>{if(o?.unsubscribe(),o=null,i){i=!1;let d=r;r=null,e.next(d)}a&&e.complete()},l=()=>{o=null,a&&e.complete()};n.subscribe(Se(e,d=>{i=!0,r=d,o||Ge(t(d)).subscribe(o=Se(e,s,l))},()=>{a=!0,(!i||!o||o.closed)&&e.complete()}))})}function pa(t,n=lo){return fy(()=>uo(t,n))}function Cr(t){return be((n,e)=>{let i=null,r=!1,o;i=n.subscribe(Se(e,void 0,void 0,a=>{o=Ge(t(a,Cr(t)(n))),i?(i.unsubscribe(),i=null,o.subscribe(e)):r=!0})),r&&(i.unsubscribe(),i=null,o.subscribe(e))})}function mo(t,n){return we(n)?Pt(t,n,1):Pt(t,1)}function Zn(t,n=lo){return be((e,i)=>{let r=null,o=null,a=null,s=()=>{if(r){r.unsubscribe(),r=null;let d=o;o=null,i.next(d)}};function l(){let d=a+t,u=n.now();if(u<d){r=this.schedule(void 0,d-u),i.add(r);return}s()}e.subscribe(Se(i,d=>{o=d,a=n.now(),r||(r=n.schedule(l,t),i.add(r))},()=>{s(),i.complete()},void 0,()=>{o=r=null}))})}function hy(t){return be((n,e)=>{let i=!1;n.subscribe(Se(e,r=>{i=!0,e.next(r)},()=>{i||e.next(t),e.complete()}))})}function je(t){return t<=0?()=>at:be((n,e)=>{let i=0;n.subscribe(Se(e,r=>{++i<=t&&(e.next(r),t<=i&&e.complete())}))})}function py(){return be((t,n)=>{t.subscribe(Se(n,oo))})}function ga(t){return ee(()=>t)}function Wh(t,n){return n?e=>pi(n.pipe(je(1),py()),e.pipe(Wh(t))):Pt((e,i)=>Ge(t(e,i)).pipe(je(1),ga(e)))}function Gh(t,n=lo){let e=uo(t,n);return Wh(()=>e)}function Rd(t,n=_n){return t=t??yI,be((e,i)=>{let r,o=!0;e.subscribe(Se(i,a=>{let s=n(a);(o||!t(r,s))&&(o=!1,r=s,i.next(a))}))})}function yI(t,n){return t===n}function gy(t=CI){return be((n,e)=>{let i=!1;n.subscribe(Se(e,r=>{i=!0,e.next(r)},()=>i?e.complete():e.error(t())))})}function CI(){return new Vi}function fo(t){return be((n,e)=>{try{n.subscribe(e)}finally{e.add(t)}})}function Bi(t,n){let e=arguments.length>=2;return i=>i.pipe(t?me((r,o)=>t(r,o,i)):_n,je(1),e?hy(n):gy(()=>new Vi))}function Od(t){return t<=0?()=>at:be((n,e)=>{let i=[];n.subscribe(Se(e,r=>{i.push(r),t<i.length&&i.shift()},()=>{for(let r of i)e.next(r);e.complete()},void 0,()=>{i=null}))})}function Pd(){return be((t,n)=>{let e,i=!1;t.subscribe(Se(n,r=>{let o=e;e=r,i&&n.next([o,r]),i=!0}))})}function ol(t={}){let{connector:n=()=>new I,resetOnError:e=!0,resetOnComplete:i=!0,resetOnRefCountZero:r=!0}=t;return o=>{let a,s,l,d=0,u=!1,h=!1,_=()=>{s?.unsubscribe(),s=void 0},v=()=>{_(),a=l=void 0,u=h=!1},S=()=>{let A=a;v(),A?.unsubscribe()};return be((A,oe)=>{d++,!h&&!u&&_();let ae=l=l??n();oe.add(()=>{d--,d===0&&!h&&!u&&(s=qh(S,r))}),ae.subscribe(oe),!a&&d>0&&(a=new qn({next:Ke=>ae.next(Ke),error:Ke=>{h=!0,_(),s=qh(v,e,Ke),ae.error(Ke)},complete:()=>{u=!0,_(),s=qh(v,i),ae.complete()}}),Ge(A).subscribe(a))})(o)}}function qh(t,n,...e){if(n===!0){t();return}if(n===!1)return;let i=new qn({next:()=>{i.unsubscribe(),t()}});return Ge(n(...e)).subscribe(i)}function Fd(t,n,e){let i,r=!1;return t&&typeof t=="object"?{bufferSize:i=1/0,windowTime:n=1/0,refCount:r=!1,scheduler:e}=t:i=t??1/0,ol({connector:()=>new ji(i,n,e),resetOnError:!0,resetOnComplete:!1,resetOnRefCountZero:r})}function ho(t){return me((n,e)=>t<=e)}function Ze(...t){let n=hi(t);return be((e,i)=>{(n?pi(t,e,n):pi(t,e)).subscribe(i)})}function _t(t,n){return be((e,i)=>{let r=null,o=0,a=!1,s=()=>a&&!r&&i.complete();e.subscribe(Se(i,l=>{r?.unsubscribe();let d=0,u=o++;Ge(t(l,u)).subscribe(r=Se(i,h=>i.next(n?n(l,h,u,d++):h),()=>{r=null,s()}))},()=>{a=!0,s()}))})}function pe(t){return be((n,e)=>{Ge(t).subscribe(Se(e,()=>e.complete(),oo)),!e.closed&&n.subscribe(e)})}function Yh(t,n=!1){return be((e,i)=>{let r=0;e.subscribe(Se(i,o=>{let a=t(o,r++);(a||n)&&i.next(o),!a&&i.complete()}))})}function Ft(t,n,e){let i=we(t)||n||e?{next:t,error:n,complete:e}:t;return i?be((r,o)=>{var a;(a=i.subscribe)===null||a===void 0||a.call(i);let s=!0;r.subscribe(Se(o,l=>{var d;(d=i.next)===null||d===void 0||d.call(i,l),o.next(l)},()=>{var l;s=!1,(l=i.complete)===null||l===void 0||l.call(i),o.complete()},l=>{var d;s=!1,(d=i.error)===null||d===void 0||d.call(i,l),o.error(l)},()=>{var l,d;s&&((l=i.unsubscribe)===null||l===void 0||l.call(i)),(d=i.finalize)===null||d===void 0||d.call(i)}))}):_n}var zd="https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss",H=class extends Error{code;constructor(n,e){super(_i(n,e)),this.code=n}};function wI(t){return`NG0${Math.abs(t)}`}function _i(t,n){return`${wI(t)}${n?": "+n:""}`}function He(t){for(let n in t)if(t[n]===He)return n;throw Error("")}function wy(t,n){for(let e in n)Object.hasOwn(n,e)&&!Object.hasOwn(t,e)&&(t[e]=n[e])}function ml(t){if(typeof t=="string")return t;if(Array.isArray(t))return`[${t.map(ml).join(", ")}]`;if(t==null)return""+t;let n=t.overriddenName||t.name;if(n)return`${n}`;let e=t.toString();if(e==null)return""+e;let i=e.indexOf(`
`);return i>=0?e.slice(0,i):e}function $d(t,n){return t?n?`${t} ${n}`:t:n||""}var SI=He({__forward_ref__:He});function en(t){return t.__forward_ref__=en,t}function At(t){return cp(t)?t():t}function cp(t){return typeof t=="function"&&Object.hasOwn(t,SI)&&t.__forward_ref__===en}function fe(t){return{token:t.token,providedIn:t.providedIn||null,factory:t.factory,value:void 0}}function Z(t){return{providers:t.providers||[],imports:t.imports||[]}}function fl(t){return xI(t,Wd)}function dp(t){return fl(t)!==null}function xI(t,n){return Object.hasOwn(t,n)&&t[n]||null}function DI(t){let n=t?.[Wd]??null;return n||null}function Qh(t){return t&&Object.hasOwn(t,jd)?t[jd]:null}var Wd=He({\u0275prov:He}),jd=He({\u0275inj:He}),C=class{_desc;ngMetadataName="InjectionToken";\u0275prov;constructor(n,e){this._desc=n,this.\u0275prov=void 0,typeof e=="number"?this.__NG_ELEMENT_ID__=e:e!==void 0&&(this.\u0275prov=fe({token:this,providedIn:e.providedIn||"root",factory:e.factory}))}get multi(){return this}toString(){return`InjectionToken ${this._desc}`}};function up(t){return t&&!!t.\u0275providers}var hl=He({\u0275cmp:He}),pl=He({\u0275dir:He}),mp=He({\u0275pipe:He}),fp=He({\u0275mod:He}),ll=He({\u0275fac:He}),Co=He({__NG_ELEMENT_ID__:He}),_y=He({__NG_ENV_ID__:He});function Sy(t){return qd(t,"@NgModule"),t[fp]||null}function Sr(t){return qd(t,"@Component"),t[hl]||null}function Gd(t){return qd(t,"@Directive"),t[pl]||null}function xy(t){return qd(t,"@Pipe"),t[mp]||null}function qd(t,n){if(t==null)throw new H(-919,!1)}function ba(t){return typeof t=="string"?t:t==null?"":String(t)}var Dy=He({ngErrorCode:He}),EI=He({ngErrorMessage:He}),MI=He({ngTokenPath:He});function hp(t,n){return Ey("",-200,n)}function Yd(t,n){throw new H(-201,!1)}function Ey(t,n,e){let i=new H(n,t);return i[Dy]=n,i[EI]=t,e&&(i[MI]=e),i}function II(t){return t[Dy]}var Xh;function My(){return Xh}function vn(t){let n=Xh;return Xh=t,n}function pp(t,n,e){let i=fl(t);if(i&&i.providedIn=="root")return i.value===void 0?i.value=i.factory():i.value;if(e&8)return null;if(n!==void 0)return n;Yd(t,"")}var xr=globalThis;var NI={},po=NI,TI="__NG_DI_FLAG__",Kh=class{injector;constructor(n){this.injector=n}retrieve(n,e){let i=go(e)||0;try{return this.injector.get(n,i&8?null:po,i)}catch(r){if(da(r))return r;throw r}}};function kI(t,n=0){let e=ad();if(e===void 0)throw new H(-203,!1);if(e===null)return pp(t,void 0,n);{let i=AI(n),r=e.retrieve(t,i);if(da(r)){if(i.optional)return null;throw r}return r}}function te(t,n=0){return(My()||kI)(At(t),n)}function c(t,n){return te(t,go(n))}function go(t){return typeof t>"u"||typeof t=="number"?t:0|(t.optional&&8)|(t.host&&1)|(t.self&&2)|(t.skipSelf&&4)}function AI(t){return{optional:!!(t&8),host:!!(t&1),self:!!(t&2),skipSelf:!!(t&4)}}function Jh(t){let n=[];for(let e=0;e<t.length;e++){let i=At(t[e]);if(Array.isArray(i)){if(i.length===0)throw new H(900,!1);let r,o=0;for(let a=0;a<i.length;a++){let s=i[a],l=RI(s);typeof l=="number"?l===-1?r=s.token:o|=l:r=s}n.push(te(r,o))}else n.push(te(i))}return n}function RI(t){return t[TI]}function _o(t,n){let e=Object.hasOwn(t,ll);return e?t[ll]:null}function Iy(t,n,e){if(t.length!==n.length)return!1;for(let i=0;i<t.length;i++){let r=t[i],o=n[i];if(e&&(r=e(r),o=e(o)),o!==r)return!1}return!0}function Ny(t){return t.flat(Number.POSITIVE_INFINITY)}function Zd(t,n){t.forEach(e=>Array.isArray(e)?Zd(e,n):n(e))}function gp(t,n,e){n>=t.length?t.push(e):t.splice(n,0,e)}function gl(t,n){return n>=t.length-1?t.pop():t.splice(n,1)[0]}function Ty(t,n){let e=[];for(let i=0;i<t;i++)e.push(n);return e}function ky(t,n,e,i){let r=t.length;if(r==n)t.push(e,i);else if(r===1)t.push(i,t[0]),t[0]=e;else{for(r--,t.push(t[r-1],t[r]);r>n;){let o=r-2;t[r]=t[o],r--}t[n]=e,t[n+1]=i}}function Qd(t,n,e){let i=ya(t,n);return i>=0?t[i|1]=e:(i=~i,ky(t,i,n,e)),i}function Xd(t,n){let e=ya(t,n);if(e>=0)return t[e|1]}function ya(t,n){return OI(t,n,1)}function OI(t,n,e){let i=0,r=t.length>>e;for(;r!==i;){let o=i+(r-i>>1),a=t[o<<e];if(n===a)return o<<e;a>n?r=o:i=o+1}return~(r<<e)}var Dr={},Wt=[],Ca=new C(""),_l=new C("",-1),_p=new C(""),va=class{get(n,e=po){if(e===po){let r=Ey("",-201);throw r.name="\u0275NotFound",r}return e}};function $i(t){return{\u0275providers:t}}function Ay(...t){return{\u0275providers:vp(!0,t),\u0275fromNgModule:!0}}function vp(t,...n){let e=[],i=new Set,r,o=a=>{e.push(a)};return Zd(n,a=>{let s=a;Vd(s,o,[],i)&&(r||=[],r.push(s))}),r!==void 0&&Ry(r,o),e}function Ry(t,n){for(let e=0;e<t.length;e++){let{ngModule:i,providers:r}=t[e];bp(r,o=>{n(o,i)})}}function Vd(t,n,e,i){if(t=At(t),!t)return!1;let r=null,o=Qh(t),a=!o&&Sr(t);if(!o&&!a){let l=t.ngModule;if(o=Qh(l),o)r=l;else return!1}else{if(a&&!a.standalone)return!1;r=t}let s=i.has(r);if(a){if(s)return!1;if(i.add(r),a.dependencies){let l=typeof a.dependencies=="function"?a.dependencies():a.dependencies;for(let d of l)Vd(d,n,e,i)}}else if(o){if(o.imports!=null&&!s){i.add(r);let d;Zd(o.imports,u=>{Vd(u,n,e,i)&&(d||=[],d.push(u))}),d!==void 0&&Ry(d,n)}if(!s){let d=_o(r)||(()=>new r);n({provide:r,useFactory:d,deps:Wt},r),n({provide:_p,useValue:r,multi:!0},r),n({provide:Ca,useValue:()=>te(r),multi:!0},r)}let l=o.providers;if(l!=null&&!s){let d=t;bp(l,u=>{n(u,d)})}}else return!1;return r!==t&&t.providers!==void 0}function bp(t,n){for(let e of t)up(e)&&(e=e.\u0275providers),Array.isArray(e)?bp(e,n):n(e)}var PI=He({provide:String,useValue:He});function Oy(t){return t!==null&&typeof t=="object"&&PI in t}function FI(t){return!!(t&&t.useExisting)}function LI(t){return!!(t&&t.useFactory)}function vo(t){return typeof t=="function"}function Py(t){return!!t.useClass}var vl=new C(""),Ld={},vy={},Zh;function wa(){return Zh===void 0&&(Zh=new va),Zh}var qe=class{},bo=class extends qe{parent;source;scopes;records=new Map;_ngOnDestroyHooks=new Set;_onDestroyHooks=[];get destroyed(){return this._destroyed}_destroyed=!1;injectorDefTypes;constructor(n,e,i,r){super(),this.parent=e,this.source=i,this.scopes=r,tp(n,a=>this.processProvider(a)),this.records.set(_l,_a(void 0,this)),r.has("environment")&&this.records.set(qe,_a(void 0,this));let o=this.records.get(vl);o!=null&&typeof o.value=="string"&&this.scopes.add(o.value),this.injectorDefTypes=new Set(this.get(_p,Wt,{self:!0}))}retrieve(n,e){let i=go(e)||0;try{return this.get(n,po,i)}catch(r){if(da(r))return r;throw r}}destroy(){al(this),this._destroyed=!0;let n=ce(null);try{for(let i of this._ngOnDestroyHooks)i.ngOnDestroy();let e=this._onDestroyHooks;this._onDestroyHooks=[];for(let i of e)i()}finally{this.records.clear(),this._ngOnDestroyHooks.clear(),this.injectorDefTypes.clear(),ce(n)}}onDestroy(n){return al(this),this._onDestroyHooks.push(n),()=>this.removeOnDestroy(n)}runInContext(n){al(this);let e=fi(this),i=vn(void 0),r;try{return n()}finally{fi(e),vn(i)}}get(n,e=po,i){if(al(this),Object.hasOwn(n,_y))return n[_y](this);let r=go(i),o,a=fi(this),s=vn(void 0);try{if(!(r&4)){let d=this.records.get(n);if(d===void 0){let u=UI(n)&&fl(n);u&&this.injectableDefInScope(u)?d=_a(ep(n),Ld):d=null,this.records.set(n,d)}if(d!=null)return this.hydrate(n,d,r)}let l=r&2?wa():this.parent;return e=r&8&&e===po?null:e,l.get(n,e)}catch(l){let d=II(l);throw d===-200||d===-201?new H(d,null):l}finally{vn(s),fi(a)}}resolveInjectorInitializers(){let n=ce(null),e=fi(this),i=vn(void 0),r;try{let o=this.get(Ca,Wt,{self:!0});for(let a of o)a()}finally{fi(e),vn(i),ce(n)}}toString(){return"R3Injector[...]"}processProvider(n){n=At(n);let e=vo(n)?n:At(n&&n.provide),i=VI(n);if(!vo(n)&&n.multi===!0){let r=this.records.get(e);r||(r=_a(void 0,Ld,!0),r.factory=()=>Jh(r.multi),this.records.set(e,r)),e=n,r.multi.push(n)}this.records.set(e,i)}hydrate(n,e,i){let r=ce(null);try{if(e.value===vy)throw hp("");return e.value===Ld&&(e.value=vy,e.value=e.factory(void 0,i)),typeof e.value=="object"&&e.value&&HI(e.value)&&this._ngOnDestroyHooks.add(e.value),e.value}finally{ce(r)}}injectableDefInScope(n){if(!n.providedIn)return!1;let e=At(n.providedIn);return typeof e=="string"?e==="any"||this.scopes.has(e):this.injectorDefTypes.has(e)}removeOnDestroy(n){let e=this._onDestroyHooks.indexOf(n);e!==-1&&this._onDestroyHooks.splice(e,1)}};function ep(t){let n=fl(t),e=n!==null?n.factory:_o(t);if(e!==null)return e;if(t instanceof C)throw new H(-204,!1);if(t instanceof Function)return jI(t);throw new H(-204,!1)}function jI(t){if(t.length>0)throw new H(-204,!1);let e=DI(t);return e!==null?()=>e.factory(t):()=>new t}function VI(t){if(Oy(t))return _a(void 0,t.useValue);{let n=yp(t);return _a(n,Ld)}}function yp(t,n,e){let i;if(vo(t)){let r=At(t);return _o(r)||ep(r)}else if(Oy(t))i=()=>At(t.useValue);else if(LI(t))i=()=>t.useFactory(...Jh(t.deps||[]));else if(FI(t))i=(r,o)=>te(At(t.useExisting),o!==void 0&&o&8?8:void 0);else{let r=At(t&&(t.useClass||t.provide));if(BI(t))i=()=>new r(...Jh(t.deps));else return _o(r)||ep(r)}return i}function al(t){if(t.destroyed)throw new H(-205,!1)}function _a(t,n,e=!1){return{factory:t,value:n,multi:e?[]:void 0}}function BI(t){return!!t.deps}function HI(t){return t!==null&&typeof t=="object"&&typeof t.ngOnDestroy=="function"}function UI(t){return typeof t=="function"||typeof t=="object"&&t.ngMetadataName==="InjectionToken"}function tp(t,n){for(let e of t)Array.isArray(e)?tp(e,n):e&&up(e)?tp(e.\u0275providers,n):n(e)}function Ot(t,n){let e;t instanceof bo?(al(t),e=t):e=new Kh(t);let i,r=fi(e),o=vn(void 0);try{return n()}finally{fi(r),vn(o)}}function Fy(){return My()!==void 0||ad()!=null}var Qn=0,re=1,he=2,Rt=3,kn=4,Ut=5,wo=6,Sa=7,St=8,vi=9,Xn=10,Ue=11,xa=12,Cp=13,Er=14,tn=15,Mr=16,So=17,bi=18,yi=19,wp=20,Hi=21,Kd=22,Ui=23,bn=24,xo=25,Ci=26,vt=27,Ly=1,Sp=6,Do=7,bl=8,Eo=9,ht=10;function Wi(t){return Array.isArray(t)&&typeof t[Ly]=="object"}function An(t){return Array.isArray(t)&&t[Ly]===!0}function xp(t){return(t.flags&4)!==0}function wi(t){return t.componentOffset>-1}function Da(t){return(t.flags&1)===1}function Kn(t){return!!t.template}function Ea(t){return(t[he]&512)!==0}function Mo(t){return(t[he]&256)===256}var Oe=(function(t){return t[t.NONE=0]="NONE",t[t.HTML=1]="HTML",t[t.STYLE=2]="STYLE",t[t.SCRIPT=3]="SCRIPT",t[t.URL=4]="URL",t[t.RESOURCE_URL=5]="RESOURCE_URL",t[t.ATTRIBUTE_NO_BINDING=6]="ATTRIBUTE_NO_BINDING",t})(Oe||{}),sl,yo="svg",Jd="math",np="",by="*",ip=()=>Object.create(null);function zI(){return sl||(sl=ip(),wr(Oe.HTML,void 0,[["iframe",["srcdoc"]],["*",["innerHTML","outerHTML"]]]),wr(Oe.STYLE,void 0,[["*",["style"]]]),wr(Oe.URL,void 0,[["*",["formAction"]],["area",["href"]],["a",["href","xlink:href"]],["form",["action"]],["img",["src"]],["video",["src"]]]),wr(Oe.URL,Jd,[["*",["href","xlink:href"]]]),wr(Oe.RESOURCE_URL,void 0,[["base",["href"]],["embed",["src"]],["frame",["src"]],["iframe",["src"]],["link",["href"]],["object",["codebase","data"]]]),wr(Oe.URL,yo,[["a",["href","xlink:href"]]]),wr(Oe.ATTRIBUTE_NO_BINDING,yo,[["animate",["attributeName","values","to","from"]],["set",["to","attributeName"]],["animateMotion",["attributeName"]],["animateTransform",["attributeName"]]]),wr(Oe.ATTRIBUTE_NO_BINDING,void 0,[["unknown",["attributeName","values","to","from","sandbox","allow","allowFullscreen","referrerPolicy","csp","fetchPriority","credentialless"]],["iframe",["sandbox","allow","allowFullscreen","referrerPolicy","csp","fetchPriority","credentialless"]]]),sl)}function wr(t,n,e){let i=n??np;for(let[r,o]of e){let a=r.toLowerCase();for(let s of o){let l=s.toLowerCase(),d=sl[l]??=ip(),u=d[i]??=ip();u[a]=t}}}function jy(t,n,e){let r=zI()[n.toLowerCase()];if(!r)return Oe.NONE;let o=t.toLowerCase(),a;if(e){let s=r[e];s&&(a=s[o]??s[by])}if(a===void 0){let s=r[np];s&&(a=s[o]??s[by])}if(a===void 0&&(!e||e===np)){let s=r[yo];s&&(a=s[o])}return a??Oe.NONE}function zt(t){for(;Array.isArray(t);)t=t[Qn];return t}function Dp(t,n){return zt(n[t])}function mn(t,n){return zt(n[t.index])}function eu(t,n){return t.data[n]}function Vy(t,n){return t[n]}function Rn(t,n){let e=n[t];return Wi(e)?e:e[Qn]}function By(t){return(t[he]&4)===4}function tu(t){return(t[he]&128)===128}function Hy(t){return An(t[Rt])}function yn(t,n){return n==null?null:t[n]}function Ep(t){t[So]=0}function Mp(t){t[he]&1024||(t[he]|=1024,tu(t)&&Io(t))}function Uy(t,n){for(;t>0;)n=n[Er],t--;return n}function yl(t){return!!(t[he]&9216||t[bn]?.dirty)}function nu(t){t[Xn].changeDetectionScheduler?.notify(8),t[he]&64&&(t[he]|=1024),yl(t)&&Io(t)}function Io(t){t[Xn].changeDetectionScheduler?.notify(0);let n=zi(t);for(;n!==null&&!(n[he]&8192||(n[he]|=8192,!tu(n)));)n=zi(n)}function iu(t,n){if(Mo(t))throw new H(911,!1);t[Hi]===null&&(t[Hi]=[]),t[Hi].push(n)}function zy(t,n){if(t[Hi]===null)return;let e=t[Hi].indexOf(n);e!==-1&&t[Hi].splice(e,1)}function zi(t){let n=t[Rt];return An(n)?n[Rt]:n}function Ip(t){return t[Sa]??=[]}function Np(t){return t.cleanup??=[]}function $y(t,n,e,i){let r=Ip(n);r.push(e),t.firstCreatePass&&Np(t).push(i,r.length-1)}var De={lFrame:n0(null),bindingsEnabled:!0,skipHydrationRootTNode:null};var rp=!1;function Wy(){return De.lFrame.elementDepthCount}function Gy(){De.lFrame.elementDepthCount++}function Tp(){De.lFrame.elementDepthCount--}function ru(){return De.bindingsEnabled}function kp(){return De.skipHydrationRootTNode!==null}function Ap(t){return De.skipHydrationRootTNode===t}function Rp(){De.skipHydrationRootTNode=null}function le(){return De.lFrame.lView}function Qe(){return De.lFrame.tView}function W(t){return De.lFrame.contextLView=t,t[St]}function G(t){return De.lFrame.contextLView=null,t}function Mt(){let t=Op();for(;t!==null&&t.type===64;)t=t.parent;return t}function Op(){return De.lFrame.currentTNode}function qy(){let t=De.lFrame,n=t.currentTNode;return t.isParent?n:n.parent}function Ma(t,n){let e=De.lFrame;e.currentTNode=t,e.isParent=n}function Pp(){return De.lFrame.isParent}function Fp(){De.lFrame.isParent=!1}function Yy(){return De.lFrame.contextLView}function Lp(){return rp}function cl(t){let n=rp;return rp=t,n}function ou(){let t=De.lFrame,n=t.bindingRootIndex;return n===-1&&(n=t.bindingRootIndex=t.tView.bindingStartIndex),n}function Zy(){return De.lFrame.bindingIndex}function Qy(t){return De.lFrame.bindingIndex=t}function Gi(){return De.lFrame.bindingIndex++}function au(t){let n=De.lFrame,e=n.bindingIndex;return n.bindingIndex=n.bindingIndex+t,e}function Xy(){return De.lFrame.inI18n}function Ky(t,n){let e=De.lFrame;e.bindingIndex=e.bindingRootIndex=t,su(n)}function Jy(){return De.lFrame.currentDirectiveIndex}function su(t){De.lFrame.currentDirectiveIndex=t}function e0(t){let n=De.lFrame.currentDirectiveIndex;return n===-1?null:t[n]}function lu(){return De.lFrame.currentQueryIndex}function Cl(t){De.lFrame.currentQueryIndex=t}function $I(t){let n=t[re];return n.type===2?n.declTNode:n.type===1?t[Ut]:null}function jp(t,n,e){if(e&4){let r=n,o=t;for(;r=r.parent,r===null&&!(e&1);)if(r=$I(o),r===null||(o=o[Er],r.type&10))break;if(r===null)return!1;n=r,t=o}let i=De.lFrame=t0();return i.currentTNode=n,i.lView=t,!0}function cu(t){let n=t0(),e=t[re];De.lFrame=n,n.currentTNode=e.firstChild,n.lView=t,n.tView=e,n.contextLView=t,n.bindingIndex=e.bindingStartIndex,n.inI18n=!1}function t0(){let t=De.lFrame,n=t===null?null:t.child;return n===null?n0(t):n}function n0(t){let n={currentTNode:null,isParent:!0,lView:null,tView:null,selectedIndex:-1,contextLView:null,elementDepthCount:0,currentNamespace:null,currentDirectiveIndex:-1,bindingRootIndex:-1,bindingIndex:-1,currentQueryIndex:0,parent:t,child:null,inI18n:!1};return t!==null&&(t.child=n),n}function i0(){let t=De.lFrame;return De.lFrame=t.parent,t.currentTNode=null,t.lView=null,t}var Vp=i0;function du(){let t=i0();t.isParent=!0,t.tView=null,t.selectedIndex=-1,t.contextLView=null,t.elementDepthCount=0,t.currentDirectiveIndex=-1,t.currentNamespace=null,t.bindingRootIndex=-1,t.bindingIndex=-1,t.currentQueryIndex=0}function r0(t){return(De.lFrame.contextLView=Uy(t,De.lFrame.contextLView))[St]}function Jn(){return De.lFrame.selectedIndex}function Ir(t){De.lFrame.selectedIndex=t}function Nr(){let t=De.lFrame;return eu(t.tView,t.selectedIndex)}function fn(){De.lFrame.currentNamespace=yo}function wl(){WI()}function WI(){De.lFrame.currentNamespace=null}function Bp(){return De.lFrame.currentNamespace}var o0=!0;function uu(){return o0}function Sl(t){o0=t}function op(t,n=null,e=null,i){let r=Hp(t,n,e,i);return r.resolveInjectorInitializers(),r}function Hp(t,n=null,e=null,i,r=new Set){let o=[e||Wt,Ay(t)],a;return new bo(o,n||wa(),a||null,r)}var K=class t{static THROW_IF_NOT_FOUND=po;static NULL=new va;static create(n,e){if(Array.isArray(n))return op({name:""},e,n,"");{let i=n.name??"";return op({name:i},n.parent,n.providers,i)}}static \u0275prov=fe({token:t,providedIn:"any",factory:()=>te(_l)});static __NG_ELEMENT_ID__=-1},X=new C(""),Je=class{static __NG_ELEMENT_ID__=GI;static __NG_ENV_ID__=n=>n},Bd=class extends Je{_lView;constructor(n){super(),this._lView=n}get destroyed(){return Mo(this._lView)}onDestroy(n){let e=this._lView;return iu(e,n),()=>zy(e,n)}};function GI(){return new Bd(le())}var a0=!1,s0=new C(""),qi=(()=>{class t{taskId=0;pendingTasks=new Set;destroyed=!1;pendingTask=new Et(!1);debugTaskTracker=c(s0,{optional:!0});get hasPendingTasks(){return this.destroyed?!1:this.pendingTask.value}get hasPendingTasksObservable(){return this.destroyed?new de(e=>{e.next(!1),e.complete()}):this.pendingTask}add(){!this.hasPendingTasks&&!this.destroyed&&this.pendingTask.next(!0);let e=this.taskId++;return this.pendingTasks.add(e),this.debugTaskTracker?.add(e),e}has(e){return this.pendingTasks.has(e)}remove(e){this.pendingTasks.delete(e),this.debugTaskTracker?.remove(e),this.pendingTasks.size===0&&this.hasPendingTasks&&this.pendingTask.next(!1)}ngOnDestroy(){this.pendingTasks.clear(),this.hasPendingTasks&&this.pendingTask.next(!1),this.destroyed=!0,this.pendingTask.unsubscribe()}static \u0275prov=fe({token:t,providedIn:"root",factory:()=>new t})}return t})(),ap=class extends I{__isAsync;destroyRef=void 0;pendingTasks=void 0;constructor(n=!1){super(),this.__isAsync=n,Fy()&&(this.destroyRef=c(Je,{optional:!0})??void 0,this.pendingTasks=c(qi,{optional:!0})??void 0)}emit(n){let e=ce(null);try{super.next(n)}finally{ce(e)}}subscribe(n,e,i){let r=n,o=e||(()=>null),a=i;if(n&&typeof n=="object"){let l=n;r=l.next?.bind(l),o=l.error?.bind(l),a=l.complete?.bind(l)}this.__isAsync&&(o=this.wrapInTimeout(o),r&&(r=this.wrapInTimeout(r)),a&&(a=this.wrapInTimeout(a)));let s=super.subscribe({next:r,error:o,complete:a});return n instanceof ue&&n.add(s),s}wrapInTimeout(n){return e=>{let i=this.pendingTasks?.add();setTimeout(()=>{try{n(e)}finally{i!==void 0&&this.pendingTasks?.remove(i)}})}}},O=ap;function Hd(...t){}function Up(t){let n,e;function i(){t=Hd;try{e!==void 0&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(e),n!==void 0&&clearTimeout(n)}catch(r){}}return n=setTimeout(()=>{t(),i()}),typeof requestAnimationFrame=="function"&&(e=requestAnimationFrame(()=>{t(),i()})),()=>i()}function l0(t){return queueMicrotask(()=>t()),()=>{t=Hd}}var zp="isAngularZone",dl=zp+"_ID",qI=0,$=class t{hasPendingMacrotasks=!1;hasPendingMicrotasks=!1;isStable=!0;onUnstable=new O(!1);onMicrotaskEmpty=new O(!1);onStable=new O(!1);onError=new O(!1);constructor(n){let{enableLongStackTrace:e=!1,shouldCoalesceEventChangeDetection:i=!1,shouldCoalesceRunChangeDetection:r=!1,scheduleInRootZone:o=a0}=n;if(typeof Zone>"u")throw new H(908,!1);Zone.assertZonePatched();let a=this;a._nesting=0,a._outer=a._inner=Zone.current,Zone.TaskTrackingZoneSpec&&(a._inner=a._inner.fork(new Zone.TaskTrackingZoneSpec)),e&&Zone.longStackTraceZoneSpec&&(a._inner=a._inner.fork(Zone.longStackTraceZoneSpec)),a.shouldCoalesceEventChangeDetection=!r&&i,a.shouldCoalesceRunChangeDetection=r,a.callbackScheduled=!1,a.scheduleInRootZone=o,QI(a)}static isInAngularZone(){return typeof Zone<"u"&&Zone.current.get(zp)===!0}static assertInAngularZone(){if(!t.isInAngularZone())throw new H(909,!1)}static assertNotInAngularZone(){if(t.isInAngularZone())throw new H(909,!1)}run(n,e,i){return this._inner.run(n,e,i)}runTask(n,e,i,r){let o=this._inner,a=o.scheduleEventTask("NgZoneEvent: "+r,n,YI,Hd,Hd);try{return o.runTask(a,e,i)}finally{o.cancelTask(a)}}runGuarded(n,e,i){return this._inner.runGuarded(n,e,i)}runOutsideAngular(n){return this._outer.run(n)}},YI={};function $p(t){if(t._nesting==0&&!t.hasPendingMicrotasks&&!t.isStable)try{t._nesting++,t.onMicrotaskEmpty.emit(null)}finally{if(t._nesting--,!t.hasPendingMicrotasks)try{t.runOutsideAngular(()=>t.onStable.emit(null))}finally{t.isStable=!0}}}function ZI(t){if(t.isCheckStableRunning||t.callbackScheduled)return;t.callbackScheduled=!0;function n(){Up(()=>{t.callbackScheduled=!1,sp(t),t.isCheckStableRunning=!0,$p(t),t.isCheckStableRunning=!1})}t.scheduleInRootZone?Zone.root.run(()=>{n()}):t._outer.run(()=>{n()}),sp(t)}function QI(t){let n=()=>{ZI(t)},e=qI++;t._inner=t._inner.fork({name:"angular",properties:{[zp]:!0,[dl]:e,[dl+e]:!0},onInvokeTask:(i,r,o,a,s,l)=>{if(XI(l))return i.invokeTask(o,a,s,l);try{return yy(t),i.invokeTask(o,a,s,l)}finally{(t.shouldCoalesceEventChangeDetection&&a.type==="eventTask"||t.shouldCoalesceRunChangeDetection)&&n(),Cy(t)}},onInvoke:(i,r,o,a,s,l,d)=>{try{return yy(t),i.invoke(o,a,s,l,d)}finally{t.shouldCoalesceRunChangeDetection&&!t.callbackScheduled&&!KI(l)&&n(),Cy(t)}},onHasTask:(i,r,o,a)=>{i.hasTask(o,a),r===o&&(a.change=="microTask"?(t._hasPendingMicrotasks=a.microTask,sp(t),$p(t)):a.change=="macroTask"&&(t.hasPendingMacrotasks=a.macroTask))},onHandleError:(i,r,o,a)=>(i.handleError(o,a),t.runOutsideAngular(()=>t.onError.emit(a)),!1)})}function sp(t){t._hasPendingMicrotasks||(t.shouldCoalesceEventChangeDetection||t.shouldCoalesceRunChangeDetection)&&t.callbackScheduled===!0?t.hasPendingMicrotasks=!0:t.hasPendingMicrotasks=!1}function yy(t){t._nesting++,t.isStable&&(t.isStable=!1,t.onUnstable.emit(null))}function Cy(t){t._nesting--,$p(t)}var ul=class{hasPendingMicrotasks=!1;hasPendingMacrotasks=!1;isStable=!0;onUnstable=new O;onMicrotaskEmpty=new O;onStable=new O;onError=new O;run(n,e,i){return n.apply(e,i)}runGuarded(n,e,i){return n.apply(e,i)}runOutsideAngular(n){return n()}runTask(n,e,i,r){return n.apply(e,i)}};function XI(t){return c0(t,"__ignore_ng_zone__")}function KI(t){return c0(t,"__scheduler_tick__")}function c0(t,n){return!Array.isArray(t)||t.length!==1?!1:t[0]?.data?.[n]===!0}var Jt=class{_console=console;handleError(n){this._console.error("ERROR",n)}},On=new C("",{factory:()=>{let t=c($),n=c(qe),e;return i=>{t.runOutsideAngular(()=>{n.destroyed&&!e?setTimeout(()=>{throw i}):(e??=n.get(Jt),e.handleError(i))})}}}),d0={provide:Ca,useValue:()=>{let t=c(Jt,{optional:!0})},multi:!0};function T(t,n){let[e,i,r]=Nh(t,n?.equal),o=e,a=o[gt];return o.set=i,o.update=r,o.asReadonly=mu.bind(o),o}function mu(){let t=this[gt];if(t.readonlyFn===void 0){let n=()=>this();n[gt]=t,t.readonlyFn=n}return t.readonlyFn}var Yi=new C("",{factory:()=>JI}),JI="ng";var fu=new C(""),No=new C("",{providedIn:"platform",factory:()=>"unknown"}),xl=new C(""),Tr=new C("",{factory:()=>c(X).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce")||null});var Ia=(()=>{class t{view;node;constructor(e,i){this.view=e,this.node=i}static __NG_ELEMENT_ID__=eN}return t})();function eN(){return new Ia(le(),Mt())}var gi=class{},Dl=new C("",{factory:()=>!0});var Wp=new C(""),hu=(()=>{class t{static \u0275prov=fe({token:t,providedIn:"root",factory:()=>new lp})}return t})(),lp=class{dirtyEffectCount=0;queues=new Map;add(n){this.enqueue(n),this.schedule(n)}schedule(n){n.dirty&&this.dirtyEffectCount++}remove(n){let e=n.zone,i=this.queues.get(e);i.has(n)&&(i.delete(n),n.dirty&&this.dirtyEffectCount--)}enqueue(n){let e=n.zone;this.queues.has(e)||this.queues.set(e,new Set);let i=this.queues.get(e);i.has(n)||i.add(n)}flush(){for(;this.dirtyEffectCount>0;){let n=!1;for(let[e,i]of this.queues)e===null?n||=this.flushQueue(i):n||=e.run(()=>this.flushQueue(i));n||(this.dirtyEffectCount=0)}}flushQueue(n){let e=!1;for(let i of n)i.dirty&&(this.dirtyEffectCount--,e=!0,i.run());return e}},Ud=class{[gt];constructor(n){this[gt]=n}destroy(){this[gt].destroy()}};function Lt(t,n){let e=n?.injector??c(K),i=n?.manualCleanup!==!0?e.get(Je):null,r,o=e.get(Ia,null,{optional:!0}),a=e.get(gi);return o!==null?(r=m0(o.view,a,t),i instanceof Bd&&i._lView===o.view&&(i=null)):r=iN(t,e.get(hu),a),r.injector=e,i!==null&&(r.onDestroyFns=[i.onDestroy(()=>r.destroy())]),new Ud(r)}var u0=J(y({},Th),{cleanupFns:void 0,zone:null,onDestroyFns:null,run(){let t=cl(!1);try{kh(this)}finally{cl(t)}},cleanup(){if(!this.cleanupFns?.length)return;let t=ce(null);try{for(;this.cleanupFns.length;)this.cleanupFns.pop()()}finally{this.cleanupFns=[],ce(t)}}}),tN=J(y({},u0),{consumerMarkedDirty(){this.scheduler.schedule(this),this.notifier.notify(12)},destroy(){if(vr(this),this.onDestroyFns!==null)for(let t of this.onDestroyFns)t();this.cleanup(),this.scheduler.remove(this)}}),nN=J(y({},u0),{consumerMarkedDirty(){this.view[he]|=8192,Io(this.view),this.notifier.notify(13)},destroy(){if(vr(this),this.onDestroyFns!==null)for(let t of this.onDestroyFns)t();this.cleanup(),this.view[Ui]?.delete(this)}});function m0(t,n,e){let i=Object.create(nN);return i.view=t,i.zone=typeof Zone<"u"?Zone.current:null,i.notifier=n,i.fn=f0(i,e),t[Ui]??=new Set,t[Ui].add(i),i.consumerMarkedDirty(i),i}function iN(t,n,e){let i=Object.create(tN);return i.fn=f0(i,t),i.scheduler=n,i.notifier=e,i.zone=typeof Zone<"u"?Zone.current:null,i.scheduler.add(i),i.notifier.notify(12),i}function f0(t,n){return()=>{n(e=>(t.cleanupFns??=[]).push(e))}}function hn(t){return typeof t=="function"&&t[gt]!==void 0}function pu(t){return hn(t)&&typeof t.set=="function"}var Na=(()=>{class t{internalPendingTasks=c(qi);scheduler=c(gi);errorHandler=c(On);add(){let e=this.internalPendingTasks.add();return()=>{this.internalPendingTasks.has(e)&&(this.scheduler.notify(11),this.internalPendingTasks.remove(e))}}run(e){let i=this.add();try{e().catch(this.errorHandler).finally(i)}catch(r){this.errorHandler(r),i()}}static \u0275prov=fe({token:t,providedIn:"root",factory:()=>new t})}return t})();var Bu=Symbol("InputSignalNode#UNSET"),nC=J(y({},ca),{transformFn:void 0,applyValueToInputSignal(t,n){br(t,n)}});function Pl(t){return{toString:t}.toString()}var Ae=(function(t){return t[t.TemplateCreateStart=0]="TemplateCreateStart",t[t.TemplateCreateEnd=1]="TemplateCreateEnd",t[t.TemplateUpdateStart=2]="TemplateUpdateStart",t[t.TemplateUpdateEnd=3]="TemplateUpdateEnd",t[t.LifecycleHookStart=4]="LifecycleHookStart",t[t.LifecycleHookEnd=5]="LifecycleHookEnd",t[t.OutputStart=6]="OutputStart",t[t.OutputEnd=7]="OutputEnd",t[t.BootstrapApplicationStart=8]="BootstrapApplicationStart",t[t.BootstrapApplicationEnd=9]="BootstrapApplicationEnd",t[t.BootstrapComponentStart=10]="BootstrapComponentStart",t[t.BootstrapComponentEnd=11]="BootstrapComponentEnd",t[t.ChangeDetectionStart=12]="ChangeDetectionStart",t[t.ChangeDetectionEnd=13]="ChangeDetectionEnd",t[t.ChangeDetectionSyncStart=14]="ChangeDetectionSyncStart",t[t.ChangeDetectionSyncEnd=15]="ChangeDetectionSyncEnd",t[t.AfterRenderHooksStart=16]="AfterRenderHooksStart",t[t.AfterRenderHooksEnd=17]="AfterRenderHooksEnd",t[t.ComponentStart=18]="ComponentStart",t[t.ComponentEnd=19]="ComponentEnd",t[t.DeferBlockStateStart=20]="DeferBlockStateStart",t[t.DeferBlockStateEnd=21]="DeferBlockStateEnd",t[t.DynamicComponentStart=22]="DynamicComponentStart",t[t.DynamicComponentEnd=23]="DynamicComponentEnd",t[t.HostBindingsUpdateStart=24]="HostBindingsUpdateStart",t[t.HostBindingsUpdateEnd=25]="HostBindingsUpdateEnd",t})(Ae||{}),xu=class{previousValue;currentValue;firstChange;constructor(n,e,i){this.previousValue=n,this.currentValue=e,this.firstChange=i}isFirstChange(){return this.firstChange}};function iC(t,n,e,i){n!==null?n.applyValueToInputSignal(n,i):t[e]=i}var rC=null,Ne=(()=>{rC=h0;let t=()=>h0;return t.ngInherit=!0,t})();function fN(){return rC}function h0(t){return t.type.prototype.ngOnChanges&&(t.setInput=pN),hN}function hN(){let t=oC(this),n=t?.current;if(n){let e=t.previous;if(e===Dr)t.previous=n;else for(let i in n)e[i]=n[i];t.current=null,this.ngOnChanges(n)}}function pN(t,n,e,i,r){let o=this.declaredInputs[i],a=oC(t)||gN(t,{previous:Dr,current:null}),s=a.current||(a.current={}),l=a.previous,d=l[o];s[o]=new xu(d&&d.currentValue,e,l===Dr),iC(t,n,r,e)}var ng="__ngSimpleChanges__";function oC(t){return Object.hasOwn(t,ng)&&t[ng]||null}function gN(t,n){return t[ng]=n}var p0=[];var ze=function(t,n=null,e){for(let i=0;i<p0.length;i++){let r=p0[i];r(t,n,e)}};function _N(t,n,e){let{ngOnChanges:i,ngOnInit:r,ngDoCheck:o}=n.type.prototype;if(i){let a=fN()(n);(e.preOrderHooks??=[]).push(t,a),(e.preOrderCheckHooks??=[]).push(t,a)}r&&(e.preOrderHooks??=[]).push(0-t,r),o&&((e.preOrderHooks??=[]).push(t,o),(e.preOrderCheckHooks??=[]).push(t,o))}function aC(t,n){for(let e=n.directiveStart,i=n.directiveEnd;e<i;e++){let o=t.data[e].type.prototype,{ngAfterContentInit:a,ngAfterContentChecked:s,ngAfterViewInit:l,ngAfterViewChecked:d,ngOnDestroy:u}=o;a&&(t.contentHooks??=[]).push(-e,a),s&&((t.contentHooks??=[]).push(e,s),(t.contentCheckHooks??=[]).push(e,s)),l&&(t.viewHooks??=[]).push(-e,l),d&&((t.viewHooks??=[]).push(e,d),(t.viewCheckHooks??=[]).push(e,d)),u!=null&&(t.destroyHooks??=[]).push(e,u)}}function yu(t,n,e){sC(t,n,3,e)}function Cu(t,n,e,i){(t[he]&3)===e&&sC(t,n,e,i)}function Gp(t,n){let e=t[he];(e&3)===n&&(e&=16383,e+=1,t[he]=e)}function sC(t,n,e,i){let r=i!==void 0?t[So]&65535:0,o=i??-1,a=n.length-1,s=0;for(let l=r;l<a;l++)if(typeof n[l+1]=="number"){if(s=n[l],i!=null&&s>=i)break}else n[l]<0&&(t[So]+=65536),(s<o||o==-1)&&(vN(t,e,n,l),t[So]=(t[So]&4294901760)+l+2),l++}function g0(t,n){ze(Ae.LifecycleHookStart,t,n);let e=ce(null);try{n.call(t)}finally{ce(e),ze(Ae.LifecycleHookEnd,t,n)}}function vN(t,n,e,i){let r=e[i]<0,o=e[i+1],a=r?-e[i]:e[i],s=t[a];r?t[he]>>14<t[So]>>16&&(t[he]&3)===n&&(t[he]+=16384,g0(s,o)):g0(s,o)}var ka=-1,Ao=class{factory;name;injectImpl;resolving=!1;canSeeViewProviders;multi;componentProviders;index;providerFactory;constructor(n,e,i,r){this.factory=n,this.name=r,this.canSeeViewProviders=e,this.injectImpl=i}};function bN(t){return(t.flags&8)!==0}function yN(t){return(t.flags&16)!==0}function CN(t,n,e){let i=0;for(;i<e.length;){let r=e[i];if(typeof r=="number"){if(r!==0)break;i++;let o=e[i++],a=e[i++],s=e[i++];t.setAttribute(n,a,s,o)}else{let o=r,a=e[++i];wN(o)?t.setProperty(n,o,a):t.setAttribute(n,o,a),i++}}return i}function lC(t){return t===3||t===4||t===6}function wN(t){return t.charCodeAt(0)===64}function Aa(t,n){if(!(n===null||n.length===0))if(t===null||t.length===0)t=n.slice();else{let e=-1;for(let i=0;i<n.length;i++){let r=n[i];typeof r=="number"?e=r:e===0||(e===-1||e===2?_0(t,e,r,null,n[++i]):_0(t,e,r,null,null))}}return t}function _0(t,n,e,i,r){let o=0,a=t.length;if(n===-1)a=-1;else for(;o<t.length;){let s=t[o++];if(typeof s=="number"){if(s===n){a=-1;break}else if(s>n){a=o-1;break}}}for(;o<t.length;){let s=t[o];if(typeof s=="number")break;if(s===e){r!==null&&(t[o+1]=r);return}o++,r!==null&&o++}a!==-1&&(t.splice(a,0,n),o=a+1),t.splice(o++,0,e),r!==null&&t.splice(o++,0,r)}function cC(t){return t!==ka}function Du(t){return t&32767}function SN(t){return t>>16}function Eu(t,n){let e=SN(t),i=n;for(;e>0;)i=i[Er],e--;return i}var ig=!0;function v0(t){let n=ig;return ig=t,n}var xN=256,dC=xN-1,uC=5,DN=0,Si={};function EN(t,n,e){let i;typeof e=="string"?i=e.charCodeAt(0)||0:Object.hasOwn(e,Co)&&(i=e[Co]),i==null&&(i=e[Co]=DN++);let r=i&dC,o=1<<r;n.data[t+(r>>uC)]|=o}function Mu(t,n){let e=mC(t,n);if(e!==-1)return e;let i=n[re];i.firstCreatePass&&(t.injectorIndex=n.length,qp(i.data,t),qp(n,null),qp(i.blueprint,null));let r=Vg(t,n),o=t.injectorIndex;if(cC(r)){let a=Du(r),s=Eu(r,n),l=s[re].data;for(let d=0;d<8;d++)n[o+d]=s[a+d]|l[a+d]}return n[o+8]=r,o}function qp(t,n){t.push(0,0,0,0,0,0,0,0,n)}function mC(t,n){return t.injectorIndex===-1||t.parent&&t.parent.injectorIndex===t.injectorIndex||n[t.injectorIndex+8]===null?-1:t.injectorIndex}function Vg(t,n){if(t.parent&&t.parent.injectorIndex!==-1)return t.parent.injectorIndex;let e=0,i=null,r=n;for(;r!==null;){if(i=_C(r),i===null)return ka;if(e++,r=r[Er],i.injectorIndex!==-1)return i.injectorIndex|e<<16}return ka}function rg(t,n,e){EN(t,n,e)}function MN(t,n){if(n==="class")return t.classes;if(n==="style")return t.styles;let e=t.attrs;if(e){let i=e.length,r=0;for(;r<i;){let o=e[r];if(lC(o))break;if(o===0)r=r+2;else if(typeof o=="number")for(r++;r<i&&typeof e[r]=="string";)r++;else{if(o===n)return e[r+1];r=r+2}}}return null}function fC(t,n,e){if(e&8||t!==void 0)return t;Yd(n,"NodeInjector")}function hC(t,n,e,i){if(e&8&&i===void 0&&(i=null),(e&3)===0){let r=t[vi],o=vn(void 0);try{return r?r.get(n,i,e&8):pp(n,i,e&8)}finally{vn(o)}}return fC(i,n,e)}function pC(t,n,e,i=0,r){if(t!==null){if(n[he]&2048&&!(i&2)){let a=kN(t,n,e,i,Si);if(a!==Si)return a}let o=gC(t,n,e,i,Si);if(o!==Si)return o}return hC(n,e,i,r)}function gC(t,n,e,i,r){let o=NN(e);if(typeof o=="function"){if(!jp(n,t,i))return i&1?fC(r,e,i):hC(n,e,i,r);try{let a;if(a=o(i),a==null&&!(i&8))Yd(e);else return a}finally{Vp()}}else if(typeof o=="number"){let a=null,s=mC(t,n),l=ka,d=i&1?n[tn][Ut]:null;for((s===-1||i&4)&&(l=s===-1?Vg(t,n):n[s+8],l===ka||!y0(i,!1)?s=-1:(a=n[re],s=Du(l),n=Eu(l,n)));s!==-1;){let u=n[re];if(b0(o,s,u.data)){let h=IN(s,n,e,a,i,d);if(h!==Si)return h}l=n[s+8],l!==ka&&y0(i,n[re].data[s+8]===d)&&b0(o,s,n)?(a=u,s=Du(l),n=Eu(l,n)):s=-1}}return r}function IN(t,n,e,i,r,o){let a=n[re],s=a.data[t+8],l=i==null?wi(s)&&ig:i!=a&&(s.type&3)!==0,d=r&1&&o===s,u=wu(s,a,e,l,d);return u!==null?Nl(n,a,u,s,r):Si}function wu(t,n,e,i,r){let o=t.providerIndexes,a=n.data,s=o&1048575,l=t.directiveStart,d=t.directiveEnd,u=o>>20,h=i?s:s+u,_=r?s+u:d;for(let v=h;v<_;v++){let S=a[v];if(v<l&&e===S||v>=l&&S.type===e)return v}if(r){let v=a[l];if(v&&Kn(v)&&v.type===e)return l}return null}function Nl(t,n,e,i,r){let o=t[e],a=n.data;if(o instanceof Ao){let s=o;if(s.resolving)throw hp("");let l=v0(s.canSeeViewProviders);s.resolving=!0;let d=a[e].type||a[e],u,h=s.injectImpl?vn(s.injectImpl):null,_=jp(t,i,0);try{o=t[e]=s.factory(void 0,r,a,t,i),n.firstCreatePass&&e>=i.directiveStart&&_N(e,a[e],n)}finally{h!==null&&vn(h),v0(l),s.resolving=!1,Vp()}}return o}function NN(t){if(typeof t=="string")return t.charCodeAt(0)||0;let n=Object.hasOwn(t,Co)?t[Co]:void 0;return typeof n=="number"?n>=0?n&dC:TN:n}function b0(t,n,e){let i=1<<t;return!!(e[n+(t>>uC)]&i)}function y0(t,n){return!(t&2)&&!(t&1&&n)}var kr=class{_tNode;_lView;constructor(n,e){this._tNode=n,this._lView=e}get(n,e,i){return pC(this._tNode,this._lView,n,go(i),e)}};function TN(){return new kr(Mt(),le())}function Ye(t){return Pl(()=>{let n=t.prototype.constructor,e=n[ll]||og(n),i=Object.prototype,r=Object.getPrototypeOf(t.prototype).constructor;for(;r&&r!==i;){let o=r[ll]||og(r);if(o&&o!==e)return o;r=Object.getPrototypeOf(r)}return o=>new o})}function og(t){return cp(t)?()=>{let n=og(At(t));return n&&n()}:_o(t)}function kN(t,n,e,i,r){let o=t,a=n;for(;o!==null&&a!==null&&a[he]&2048&&!Ea(a);){let s=gC(o,a,e,i|2,Si);if(s!==Si)return s;i&=-5;let l=o.parent;if(!l){let d=a[wp];if(d){let u=d.get(e,Si,i);if(u!==Si)return u}l=_C(a),a=a[Er]}o=l}return r}function _C(t){let n=t[re],e=n.type;return e===2?n.declTNode:e===1?t[Ut]:null}function Fl(t){return MN(Mt(),t)}function q(t){return{token:t.token,providedIn:t.autoProvided===!1?null:"root",factory:t.factory,value:void 0}}function AN(){return ja(Mt(),le())}function ja(t,n){return new L(mn(t,n))}var L=(()=>{class t{nativeElement;constructor(e){this.nativeElement=e}static __NG_ELEMENT_ID__=AN}return t})();function vC(t){return t instanceof L?t.nativeElement:t}function RN(){return this._results[Symbol.iterator]()}var pn=class{_emitDistinctChangesOnly;dirty=!0;_onDirty=void 0;_results=[];_changesDetected=!1;_changes=void 0;length=0;first=void 0;last=void 0;get changes(){return this._changes??=new I}constructor(n=!1){this._emitDistinctChangesOnly=n}get(n){return this._results[n]}map(n){return this._results.map(n)}filter(n){return this._results.filter(n)}find(n){return this._results.find(n)}reduce(n,e){return this._results.reduce(n,e)}forEach(n){this._results.forEach(n)}some(n){return this._results.some(n)}toArray(){return this._results.slice()}toString(){return this._results.toString()}reset(n,e){this.dirty=!1;let i=Ny(n);(this._changesDetected=!Iy(this._results,i,e))&&(this._results=i,this.length=i.length,this.last=i[this.length-1],this.first=i[0])}notifyOnChanges(){this._changes!==void 0&&(this._changesDetected||!this._emitDistinctChangesOnly)&&this._changes.next(this)}onDirty(n){this._onDirty=n}setDirty(){this.dirty=!0,this._onDirty?.()}destroy(){this._changes!==void 0&&(this._changes.complete(),this._changes.unsubscribe())}[Symbol.iterator]=RN};function bC(t){return(t.flags&128)===128}var Bg=(function(t){return t[t.OnPush=0]="OnPush",t[t.Eager=1]="Eager",t[t.Default=1]="Default",t})(Bg||{}),yC=new Map,ON=0;function PN(){return ON++}function FN(t){yC.set(t[yi],t)}function ag(t){yC.delete(t[yi])}var C0="__ngContext__";function Ra(t,n){Wi(n)?(t[C0]=n[yi],FN(n)):t[C0]=n}function CC(t){return SC(t[xa])}function wC(t){return SC(t[kn])}function SC(t){for(;t!==null&&!An(t);)t=t[kn];return t}var sg;function Hg(t){sg=t}function xC(){if(sg!==void 0)return sg;if(typeof document<"u")return document;throw new H(210,!1)}var DC="r";var EC="di";var MC=!1,IC=new C("",{factory:()=>MC});var w0=new WeakMap;function LN(t,n){if(t==null||typeof t!="object")return;let e=w0.get(t);e||(e=new WeakSet,w0.set(t,e)),e.add(n)}var jN=(t,n,e,i)=>{};function VN(t,n,e,i){jN(t,n,e,i)}function Hu(t){return(t.flags&32)===32}var BN=()=>null;function NC(t,n,e=!1){return BN(t,n,e)}function TC(t,n){let e=t.contentQueries;if(e!==null){let i=ce(null);try{for(let r=0;r<e.length;r+=2){let o=e[r],a=e[r+1];if(a!==-1){let s=t.data[a];Cl(o),s.contentQueries(2,n[a],a)}}}finally{ce(i)}}}function lg(t,n,e){Cl(0);let i=ce(null);try{n(t,e)}finally{ce(i)}}function Ug(t,n,e){if(xp(n)){let i=ce(null);try{let r=n.directiveStart,o=n.directiveEnd;for(let a=r;a<o;a++){let s=t.data[a];if(s.contentQueries){let l=e[a];s.contentQueries(1,l,a)}}}finally{ce(i)}}}var ni=(function(t){return t[t.Emulated=0]="Emulated",t[t.None=2]="None",t[t.ShadowDom=3]="ShadowDom",t[t.ExperimentalIsolatedShadowDom=4]="ExperimentalIsolatedShadowDom",t})(ni||{});var HN={"http://www.w3.org/2000/svg":yo,"http://www.w3.org/1998/Math/MathML":Jd},gu;function UN(){if(gu===void 0&&(gu=null,xr.trustedTypes))try{gu=xr.trustedTypes.createPolicy("angular",{createHTML:t=>t,createScript:t=>t,createScriptURL:t=>t})}catch(t){}return gu}function Uu(t){return UN()?.createHTML(t)||t}var _u;function zN(){if(_u===void 0&&(_u=null,xr.trustedTypes))try{_u=xr.trustedTypes.createPolicy("angular#unsafe-bypass",{createHTML:t=>t,createScript:t=>t,createScriptURL:t=>t})}catch(t){}return _u}function S0(t){return zN()?.createScriptURL(t)||t}var Zi=class{changingThisBreaksApplicationSecurity;constructor(n){this.changingThisBreaksApplicationSecurity=n}toString(){return`SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${zd})`}},cg=class extends Zi{getTypeName(){return"HTML"}},dg=class extends Zi{getTypeName(){return"Style"}},ug=class extends Zi{getTypeName(){return"Script"}},mg=class extends Zi{getTypeName(){return"URL"}},fg=class extends Zi{getTypeName(){return"ResourceURL"}};function Pn(t){return t instanceof Zi?t.changingThisBreaksApplicationSecurity:t}function Qi(t,n){let e=kC(t);if(e!=null&&e!==n){if(e==="ResourceURL"&&n==="URL")return!0;throw new Error(`Required a safe ${n}, got a ${e} (see ${zd})`)}return e===n}function kC(t){return t instanceof Zi&&t.getTypeName()||null}function zg(t){return new cg(t)}function $g(t){return new dg(t)}function Wg(t){return new ug(t)}function Gg(t){return new mg(t)}function qg(t){return new fg(t)}function $N(t){let n=new pg(t);return WN()?new hg(n):n}var hg=class{inertDocumentHelper;constructor(n){this.inertDocumentHelper=n}getInertBodyElement(n){n="<body><remove></remove>"+n;try{let e=new window.DOMParser().parseFromString(Uu(n),"text/html").body;return e===null?this.inertDocumentHelper.getInertBodyElement(n):(e.firstChild?.remove(),e)}catch(e){return null}}},pg=class{defaultDoc;inertDocument;constructor(n){this.defaultDoc=n,this.inertDocument=this.defaultDoc.implementation.createHTMLDocument("sanitization-inert")}getInertBodyElement(n){let e=this.inertDocument.createElement("template");return e.innerHTML=Uu(n),e}};function WN(){try{return!!new window.DOMParser().parseFromString(Uu(""),"text/html")}catch(t){return!1}}var GN=/^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;function Ll(t){return t=String(t),t.match(GN)?t:"unsafe:"+t}function Xi(t){let n=Object.create(null);for(let e of t.split(","))n[e]=!0;return n}function jl(...t){let n=Object.create(null);for(let e of t)for(let i in e)Object.hasOwn(e,i)&&(n[i]=!0);return n}var AC=Xi("area,br,col,hr,img,wbr"),RC=Xi("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),OC=Xi("rp,rt"),qN=jl(OC,RC),YN=jl(RC,Xi("address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul")),ZN=jl(OC,Xi("a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video")),x0=jl(AC,YN,ZN,qN),PC=Xi("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),QN=Xi("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"),XN=Xi("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"),KN=jl(PC,QN,XN),JN=Xi("script,style,template"),gg=class{sanitizedSomething=!1;buf=[];sanitizeChildren(n){let e=n.firstChild,i=!0,r=[];for(;e;){if(e.nodeType===Node.ELEMENT_NODE?i=this.startElement(e):e.nodeType===Node.TEXT_NODE?this.chars(e.nodeValue):this.sanitizedSomething=!0,i&&e.firstChild){r.push(e),e=nT(e);continue}for(;e;){e.nodeType===Node.ELEMENT_NODE&&this.endElement(e);let o=tT(e);if(o){e=o;break}e=r.pop()}}return this.buf.join("")}startElement(n){let e=D0(n).toLowerCase();if(!Object.hasOwn(x0,e))return this.sanitizedSomething=!0,!Object.hasOwn(JN,e);this.buf.push("<"),this.buf.push(e);let i=n.attributes;for(let r=0;r<i.length;r++){let o=i.item(r),a=o.name,s=a.toLowerCase();if(!Object.hasOwn(KN,s)){this.sanitizedSomething=!0;continue}let l=o.value;PC[s]&&(l=Ll(l)),this.buf.push(" ",a,'="',E0(l),'"')}return this.buf.push(">"),!0}endElement(n){let e=D0(n).toLowerCase();Object.hasOwn(x0,e)&&!Object.hasOwn(AC,e)&&(this.buf.push("</"),this.buf.push(e),this.buf.push(">"))}chars(n){this.buf.push(E0(n))}};function eT(t,n){return(t.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY)!==Node.DOCUMENT_POSITION_CONTAINED_BY}function tT(t){let n=t.nextSibling;if(n&&t!==n.previousSibling)throw FC(n);return n}function nT(t){let n=t.firstChild;if(n&&eT(t,n))throw FC(n);return n}function D0(t){let n=t.nodeName;return typeof n=="string"?n:"FORM"}function FC(t){return new Error(`Failed to sanitize html because the element is clobbered: ${t.outerHTML}`)}var iT=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,rT=/([^\#-~ |!])/g;function E0(t){return t.replace(/&/g,"&amp;").replace(iT,function(n){let e=n.charCodeAt(0),i=n.charCodeAt(1);return"&#"+((e-55296)*1024+(i-56320)+65536)+";"}).replace(rT,function(n){return"&#"+n.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}var vu;function Yg(t,n){let e=null;try{vu=vu||$N(t);let i=n?String(n):"";e=vu.getInertBodyElement(i);let r=5,o=i;do{if(r===0)throw new Error("Failed to sanitize html because the input is unstable");r--,i=o,o=e.innerHTML,e=vu.getInertBodyElement(i)}while(i!==o);let s=new gg().sanitizeChildren(M0(e)||e);return Uu(s)}finally{if(e){let i=M0(e)||e;for(;i.firstChild;)i.firstChild.remove()}}}function M0(t){return"content"in t&&oT(t)?t.content:null}function oT(t){return t.nodeType===Node.ELEMENT_NODE&&t.nodeName==="TEMPLATE"}var aT=/^>|^->|<!--|-->|--!>|<!-$/g,sT=/(<|>)/g,lT="\u200B$1\u200B";function cT(t){return t.replace(aT,n=>n.replace(sT,lT))}function dT(t,n){return t.createText(n)}function uT(t,n,e){t.setValue(n,e)}function mT(t,n){return t.createComment(cT(n))}function LC(t,n,e){return t.createElement(n,e)}function To(t,n,e,i,r){t.insertBefore(n,e,i,r)}function jC(t,n,e){t.appendChild(n,e)}function I0(t,n,e,i,r){i!==null?To(t,n,e,i,r):jC(t,n,e)}function VC(t,n,e,i){t.removeChild(null,n,e,i)}function fT(t,n,e){t.setAttribute(n,"style",e)}function hT(t,n,e){e===""?t.removeAttribute(n,"class"):t.setAttribute(n,"class",e)}function BC(t,n,e){let{mergedAttrs:i,classes:r,styles:o}=e;i!==null&&CN(t,n,i),r!==null&&hT(t,n,r),o!==null&&fT(t,n,o)}function pT(t,n=!0){if(t[0]!=":")return[null,t];let e=t.indexOf(":",1);if(e===-1){if(n)throw new Error(`Unsupported format "${t}" expecting ":namespace:name"`);return[null,t]}return[t.slice(1,e),t.slice(e+1)]}function HC(t){let n=zC();return n?n.sanitize(Oe.URL,t)||"":Qi(t,"URL")?Pn(t):Ll(ba(t))}function UC(t){let n=zC();if(n)return S0(n.sanitize(Oe.RESOURCE_URL,t)||"");if(Qi(t,"ResourceURL"))return S0(Pn(t));throw new H(904,!1)}function gT(t,n){switch(_T(t,n)){case Oe.RESOURCE_URL:return UC;case Oe.URL:return HC;default:return null}}function Zg(t,n,e){return gT(n,e)?.(t)??t}function zC(){let t=le();return t&&t[Xn].sanitizer}function _T(t,n){let[e,i]=vT(t);return jy(i,n,e)}function vT(t){t=t.toLowerCase();let n=pT(t,!1);if(n[0])return n;let i=Jn()===-1?null:Nr(),r=i?.namespace;if(t==="#host"&&i?.type===2){let o=mn(i,le());if(o.tagName&&(t=o.tagName.toLowerCase()),r==null){let a=o.namespaceURI;r=a&&HN[a]}}return[r,t]}function bT(t){return t instanceof Function?t():t}function yT(t,n,e){let i=t.length;for(;;){let r=t.indexOf(n,e);if(r===-1)return r;if(r===0||t.charCodeAt(r-1)<=32){let o=n.length;if(r+o===i||t.charCodeAt(r+o)<=32)return r}e=r+1}}var $C="ng-template";function CT(t,n,e,i){let r=0;if(i){for(;r<n.length&&typeof n[r]=="string";r+=2)if(n[r]==="class"&&yT(n[r+1].toLowerCase(),e,0)!==-1)return!0}else if(Qg(t))return!1;if(r=n.indexOf(1,r),r>-1){let o;for(;++r<n.length&&typeof(o=n[r])=="string";)if(o.toLowerCase()===e)return!0}return!1}function Qg(t){return t.type===4&&t.value!==$C}function wT(t,n,e){let i=t.type===4&&!e?$C:t.value;return n===i}function ST(t,n,e){let i=4,r=t.attrs,o=r!==null?ET(r):0,a=!1;for(let s=0;s<n.length;s++){let l=n[s];if(typeof l=="number"){if(!a&&!ei(i)&&!ei(l))return!1;if(a&&ei(l))continue;a=!1,i=l|i&1;continue}if(!a)if(i&4){if(i=2|i&1,l!==""&&!wT(t,l,e)||l===""&&n.length===1){if(ei(i))return!1;a=!0}}else if(i&8){if(r===null||!CT(t,r,l,e)){if(ei(i))return!1;a=!0}}else{let d=n[++s],u=xT(l,r,Qg(t),e);if(u===-1){if(ei(i))return!1;a=!0;continue}if(d!==""){let h;if(u>o?h="":h=r[u+1].toLowerCase(),i&2&&d!==h){if(ei(i))return!1;a=!0}}}}return ei(i)||a}function ei(t){return(t&1)===0}function xT(t,n,e,i){if(n===null)return-1;let r=0;if(i||!e){let o=!1;for(;r<n.length;){let a=n[r];if(a===t)return r;if(a===3||a===6)o=!0;else if(a===1||a===2){let s=n[++r];for(;typeof s=="string";)s=n[++r];continue}else{if(a===4)break;if(a===0){r+=4;continue}}r+=o?1:2}return-1}else return MT(n,t)}function WC(t,n,e=!1){for(let i=0;i<n.length;i++)if(ST(t,n[i],e))return!0;return!1}function DT(t){let n=t.attrs;if(n!=null){let e=n.indexOf(5);if((e&1)===0)return n[e+1]}return null}function ET(t){for(let n=0;n<t.length;n++){let e=t[n];if(lC(e))return n}return t.length}function MT(t,n){let e=t.indexOf(4);if(e>-1)for(e++;e<t.length;){let i=t[e];if(typeof i=="number")return-1;if(i===n)return e;e++}return-1}function IT(t,n){e:for(let e=0;e<n.length;e++){let i=n[e];if(t.length===i.length){for(let r=0;r<t.length;r++)if(t[r]!==i[r])continue e;return!0}}return!1}function N0(t,n){return t?":not("+n.trim()+")":n}function NT(t){let n=t[0],e=1,i=2,r="",o=!1;for(;e<t.length;){let a=t[e];if(typeof a=="string")if(i&2){let s=t[++e];r+="["+a+(s.length>0?'="'+s+'"':"")+"]"}else i&8?r+="."+a:i&4&&(r+=" "+a);else r!==""&&!ei(a)&&(n+=N0(o,r),r=""),i=a,o=o||!ei(i);e++}return r!==""&&(n+=N0(o,r)),n}function TT(t){return t.map(NT).join(",")}function kT(t){let n=[],e=[],i=1,r=2;for(;i<t.length;){let o=t[i];if(typeof o=="string")r===2?o!==""&&n.push(o,t[++i]):r===8&&e.push(o);else{if(!ei(r))break;r=o}i++}return e.length&&n.push(1,...e),n}var nn={},xi=(function(t){return t[t.Important=1]="Important",t[t.DashCase=2]="DashCase",t})(xi||{}),AT;function Xg(t,n){return AT(t,n)}var Ar=new Set;var cG=typeof document<"u"&&typeof document?.documentElement?.getAnimations=="function";var _g=new WeakMap;function GC(t){return t?t[Er]??t:null}var El=new WeakSet;function RT(t,n,e){let i=_g.get(t);if(!i||i.length===0)return;let r=n.parentNode,o=n.previousSibling,a=GC(e);for(let s=i.length-1;s>=0;s--){let{el:l,declarationView:d}=i[s],u=l.parentNode;l===n?(i.splice(s,1),El.add(l),l.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}}))):o&&l===o?(i.splice(s,1),l.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}})),l.parentNode?.removeChild(l)):u&&r&&u!==r&&(a===null||d===null||a===d)&&(i.splice(s,1),l.dispatchEvent(new CustomEvent("animationend",{detail:{cancel:!0}})),l.parentNode?.removeChild(l))}}function OT(t,n,e){let i=GC(e),r=_g.get(t);r?r.some(o=>o.el===n)||r.push({el:n,declarationView:i}):_g.set(t,[{el:n,declarationView:i}])}var zu=(function(t){return t[t.CHANGE_DETECTION=0]="CHANGE_DETECTION",t[t.AFTER_NEXT_RENDER=1]="AFTER_NEXT_RENDER",t})(zu||{}),Ei=new C(""),T0=new Set;function Ki(t){T0.has(t)||(T0.add(t),performance?.mark?.("mark_feature_usage",{detail:{feature:t}}))}var $u=(()=>{class t{impl=null;execute(){this.impl?.execute()}static \u0275prov=fe({token:t,providedIn:"root",factory:()=>new t})}return t})(),Kg=[0,1,2,3],Jg=(()=>{class t{ngZone=c($);scheduler=c(gi);errorHandler=c(Jt,{optional:!0});sequences=new Set;deferredRegistrations=new Set;executing=!1;constructor(){c(Ei,{optional:!0})}execute(){let e=this.sequences.size>0;e&&ze(Ae.AfterRenderHooksStart),this.executing=!0;for(let i of Kg)for(let r of this.sequences)if(!(r.erroredOrDestroyed||!r.hooks[i]))try{r.pipelinedValue=this.ngZone.runOutsideAngular(()=>this.maybeTrace(()=>{let o=r.hooks[i];return o(r.pipelinedValue)},r.snapshot))}catch(o){r.erroredOrDestroyed=!0,this.errorHandler?.handleError(o)}this.executing=!1;for(let i of this.sequences)i.afterRun(),i.once&&(this.sequences.delete(i),i.destroy());for(let i of this.deferredRegistrations)this.sequences.add(i);this.deferredRegistrations.size>0&&this.scheduler.notify(7),this.deferredRegistrations.clear(),e&&ze(Ae.AfterRenderHooksEnd)}register(e){let{view:i}=e;i!==void 0?((i[xo]??=[]).push(e),Io(i),i[he]|=8192):this.executing?this.deferredRegistrations.add(e):this.addSequence(e)}addSequence(e){this.sequences.add(e),this.scheduler.notify(7)}unregister(e){this.executing&&this.sequences.has(e)?(e.erroredOrDestroyed=!0,e.pipelinedValue=void 0,e.once=!0):(this.sequences.delete(e),this.deferredRegistrations.delete(e))}maybeTrace(e,i){return i?i.run(zu.AFTER_NEXT_RENDER,e):e()}static \u0275prov=fe({token:t,providedIn:"root",factory:()=>new t})}return t})(),Tl=class{impl;hooks;view;once;snapshot;erroredOrDestroyed=!1;pipelinedValue=void 0;unregisterOnDestroy;constructor(n,e,i,r,o,a=null){this.impl=n,this.hooks=e,this.view=i,this.once=r,this.snapshot=a,this.unregisterOnDestroy=o?.onDestroy(()=>this.destroy())}afterRun(){this.erroredOrDestroyed=!1,this.pipelinedValue=void 0,this.snapshot?.dispose(),this.snapshot=null}destroy(){this.impl.unregister(this),this.unregisterOnDestroy?.();let n=this.view?.[xo];n&&(this.view[xo]=n.filter(e=>e!==this))}};function ct(t,n){let e=n?.injector??c(K);return Ki("NgAfterNextRender"),FT(t,e,n,!0)}function PT(t){return t instanceof Function?[void 0,void 0,t,void 0]:[t.earlyRead,t.write,t.mixedReadWrite,t.read]}function FT(t,n,e,i){let r=n.get($u);r.impl??=n.get(Jg);let o=n.get(Ei,null,{optional:!0}),a=e?.manualCleanup!==!0?n.get(Je):null,s=n.get(Ia,null,{optional:!0}),l=new Tl(r.impl,PT(t),s?.view,i,a,o?.snapshot(null));return r.impl.register(l),l}var e_=new C("",{factory:()=>{let t=c(qe),n=new Set;return t.onDestroy(()=>n.clear()),{queue:n,isScheduled:!1,scheduler:null,injector:t}}});function qC(t,n,e){let i=t.get(e_);if(Array.isArray(n))for(let r of n)i.queue.add(r),e?.detachedLeaveAnimationFns?.push(r);else i.queue.add(n),e?.detachedLeaveAnimationFns?.push(n);i.scheduler&&i.scheduler(t)}function LT(t,n){let e=t.get(e_);if(Array.isArray(n))for(let i of n)e.queue.delete(i);else e.queue.delete(n)}function jT(t,n){let e=t.get(e_);if(n.detachedLeaveAnimationFns){for(let i of n.detachedLeaveAnimationFns)e.queue.delete(i);n.detachedLeaveAnimationFns=void 0}}function VT(t,n){for(let[e,i]of n)qC(t,i.animateFns)}function k0(t,n,e,i){let r=t?.[Ci]?.enter;n!==null&&r&&r.has(e.index)&&VT(i,r)}function A0(t,n,e,i){try{e.get(_l)}catch(a){return i(!1)}let r=t?.[Ci];r?.enter?.has(n.index)&&LT(e,r.enter.get(n.index).animateFns);let o=BT(t,n,r);if(o.size===0){let a=!1;if(t){let s=[];Wu(t,n,s),a=s.length>0}if(!a)return i(!1)}t&&Ar.add(t[yi]),qC(e,()=>HT(t,n,r||void 0,o,i),r||void 0)}function BT(t,n,e){let i=new Map,r=e?.leave;if(r&&r.has(n.index)&&i.set(n.index,r.get(n.index)),t&&r)for(let[o,a]of r){if(i.has(o))continue;let l=t[re].data[o].parent;for(;l;){if(l===n){i.set(o,a);break}l=l.parent}}return i}function HT(t,n,e,i,r){let o=[];if(e&&e.leave)for(let[a]of i){if(!e.leave.has(a))continue;let s=e.leave.get(a);for(let l of s.animateFns){let{promise:d}=l();o.push(d)}e.detachedLeaveAnimationFns=void 0}if(t&&Wu(t,n,o),o.length>0){let a=e||t?.[Ci];if(a){let s=a.running;s&&o.push(s),a.running=Promise.allSettled(o),zT(t,a.running,r)}else Promise.allSettled(o).then(()=>{t&&Ar.delete(t[yi]),r(!0)})}else t&&Ar.delete(t[yi]),r(!1)}function Wu(t,n,e){if(n.type&12){let r=t[n.index];if(An(r))for(let o=ht;o<r.length;o++){let a=r[o];a[re].type===2&&UT(a,e)}}let i=n.child;for(;i;)Wu(t,i,e),i=i.next}function UT(t,n){let e=t[Ci];if(e&&e.leave)for(let r of e.leave.values())for(let o of r.animateFns){let{promise:a}=o();n.push(a)}let i=t[re].firstChild;for(;i;)Wu(t,i,n),i=i.next}function zT(t,n,e){n.then(()=>{t[Ci]?.running===n&&(t[Ci].running=void 0,Ar.delete(t[yi])),e(!0)})}function Ta(t,n,e,i,r,o,a,s){if(r!=null){let l,d=!1;An(r)?l=r:Wi(r)&&(d=!0,r=r[Qn]);let u=zt(r);t===0&&i!==null?(k0(s,i,o,e),a==null?jC(n,i,u):To(n,i,u,a||null,!0)):t===1&&i!==null?(k0(s,i,o,e),To(n,i,u,a||null,!0),RT(o,u,s)):t===2?(s?.[Ci]?.leave?.has(o.index)&&OT(o,u,s),El.delete(u),A0(s,o,e,h=>{if(El.has(u)){El.delete(u);return}VC(n,u,d,h)})):t===3&&(El.delete(u),A0(s,o,e,()=>{n.destroyNode(u)})),l!=null&&ek(n,t,e,l,o,i,a)}}function $T(t,n){YC(t,n),n[Qn]=null,n[Ut]=null}function WT(t,n,e,i,r,o){i[Qn]=r,i[Ut]=n,qu(t,i,e,1,r,o)}function YC(t,n){n[Xn].changeDetectionScheduler?.notify(9),qu(t,n,n[Ue],2,null,null)}function GT(t){let n=t[xa];if(!n)return Yp(t[re],t);for(;n;){let e=null;if(Wi(n))e=n[xa];else{let i=n[ht];i&&(e=i)}if(!e){for(;n&&!n[kn]&&n!==t;)Wi(n)&&Yp(n[re],n),n=n[Rt];n===null&&(n=t),Wi(n)&&Yp(n[re],n),e=n&&n[kn]}n=e}}function t_(t,n){let e=t[Eo],i=e.indexOf(n);e.splice(i,1)}function Gu(t,n){if(Mo(n))return;let e=n[Ue];e.destroyNode&&qu(t,n,e,3,null,null),GT(n)}function Yp(t,n){if(Mo(n))return;let e=ce(null);try{n[he]&=-129,n[he]|=256,n[bn]&&vr(n[bn]),YT(t,n),qT(t,n),n[re].type===1&&n[Ue].destroy();let i=n[Mr];if(i!==null&&An(n[Rt])){i!==n[Rt]&&t_(i,n);let r=n[bi];r!==null&&r.detachView(t)}ag(n)}finally{ce(e)}}function qT(t,n){let e=t.cleanup,i=n[Sa];if(e!==null)for(let a=0;a<e.length-1;a+=2)if(typeof e[a]=="string"){let s=e[a+3];s>=0?i[s]():i[-s].unsubscribe(),a+=2}else{let s=i[e[a+1]];e[a].call(s)}i!==null&&(n[Sa]=null);let r=n[Hi];if(r!==null){n[Hi]=null;for(let a=0;a<r.length;a++){let s=r[a];s()}}let o=n[Ui];if(o!==null){n[Ui]=null;for(let a of o)a.destroy()}}function YT(t,n){let e;if(t!=null&&(e=t.destroyHooks)!=null)for(let i=0;i<e.length;i+=2){let r=n[e[i]];if(!(r instanceof Ao)){let o=e[i+1];if(Array.isArray(o))for(let a=0;a<o.length;a+=2){let s=r[o[a]],l=o[a+1];ze(Ae.LifecycleHookStart,s,l);try{l.call(s)}finally{ze(Ae.LifecycleHookEnd,s,l)}}else{ze(Ae.LifecycleHookStart,r,o);try{o.call(r)}finally{ze(Ae.LifecycleHookEnd,r,o)}}}}}function ZC(t,n,e){if(n===null)throw new H(510,!1);return ZT(t,n.parent,e)}function ZT(t,n,e){let i=n;for(;i!==null&&i.type&168;)n=i,i=n.parent;if(i===null)return e[Qn];if(wi(i)){let{encapsulation:r}=t.data[i.directiveStart+i.componentOffset];if(r===ni.None||r===ni.Emulated)return null}return mn(i,e)}function QC(t,n,e){return XT(t,n,e)}function QT(t,n,e){return t.type&40?mn(t,e):null}var XT=QT,R0;function n_(t,n,e,i){let r=ZC(t,i,n),o=n[Ue],a=i.parent||n[Ut],s=QC(a,i,n);if(r!=null)if(Array.isArray(e))for(let l=0;l<e.length;l++)I0(o,r,e[l],s,!1);else I0(o,r,e,s,!1);R0!==void 0&&R0(o,i,n,e,r)}function Ml(t,n){if(n!==null){let e=n.type;if(e&3)return mn(n,t);if(e&4)return vg(-1,t[n.index]);if(e&8){let i=n.child;if(i!==null)return Ml(t,i);{let r=t[n.index];return An(r)?vg(-1,r):zt(r)}}else{if(e&128)return Ml(t,n.next);if(e&32)return Xg(n,t)()||zt(t[n.index]);{let i=XC(t,n);if(i!==null){if(Array.isArray(i))return i[0];let r=zi(t[tn]);return Ml(r,i)}else return Ml(t,n.next)}}}return null}function XC(t,n){if(n!==null){let i=t[tn][Ut],r=n.projection;return i.projection[r]}return null}function vg(t,n){let e=ht+t+1;if(e<n.length){let i=n[e],r=i[re].firstChild;if(r!==null)return Ml(i,r)}return n[Do]}function i_(t,n,e,i,r,o,a){for(;e!=null;){let s=i[vi];if(e.type===128){e=e.next;continue}let l=i[e.index],d=e.type;if(a&&n===0&&(l&&Ra(zt(l),i),e.flags|=2),!Hu(e))if(d&8)i_(t,n,e.child,i,r,o,!1),Ta(n,t,s,r,l,e,o,i);else if(d&32){let u=Xg(e,i),h;for(;h=u();)Ta(n,t,s,r,h,e,o,i);Ta(n,t,s,r,l,e,o,i)}else d&16?KC(t,n,i,e,r,o):Ta(n,t,s,r,l,e,o,i);e=a?e.projectionNext:e.next}}function qu(t,n,e,i,r,o){t.type===3?KT(e,i,n,r,o):i_(e,i,t.firstChild,n,r,o,!1)}function KT(t,n,e,i,r){let a=e[re].firstChild,s=a.next,l=zt(e[a.index]),d=zt(e[s.index]),u=s.index+1,h=e[u];if(n===1||n===0)i!==null&&(h&&h.hasChildNodes()?To(t,i,h,r,!0):(To(t,i,l,r,!0),To(t,i,d,r,!0)));else if(n===2){if(h||(h=document.createDocumentFragment(),e[u]=h),l&&l.parentNode===h)return;let _=l;for(;_!==null;){let v=_.nextSibling;if(h.appendChild(_),_===d)break;_=v}}}function JT(t,n,e){let i=n[Ue],r=ZC(t,e,n),o=e.parent||n[Ut],a=QC(o,e,n);KC(i,0,n,e,r,a)}function KC(t,n,e,i,r,o){let a=e[tn],l=a[Ut].projection[i.projection];if(Array.isArray(l))for(let d=0;d<l.length;d++){let u=l[d];Ta(n,t,e[vi],r,u,i,o,e)}else{let d=l,u=a[Rt];bC(i)&&(d.flags|=128),i_(t,n,d,u,r,o,!0)}}function ek(t,n,e,i,r,o,a){let s=i[Do],l=zt(i);if(s!==l&&Ta(n,t,e,o,s,r,a),(i[he]&4)===0)for(let d=ht;d<i.length;d++){let u=i[d];qu(u[re],u,t,n,o,s)}}function tk(t,n,e,i,r){if(n)r?t.addClass(e,i):t.removeClass(e,i);else{let o=i.indexOf("-")===-1?void 0:xi.DashCase;r==null?t.removeStyle(e,i,o):(typeof r=="string"&&r.endsWith("!important")&&(r=r.slice(0,-10),o|=xi.Important),t.setStyle(e,i,r,o))}}function r_(t,n,e,i,r,o,a,s,l,d,u){let h=vt+i,_=h+r,v=nk(h,_),S=typeof d=="function"?d():d;return v[re]={type:t,blueprint:v,template:e,queries:null,viewQuery:s,declTNode:n,data:v.slice().fill(null,h),bindingStartIndex:h,expandoStartIndex:_,hostBindingOpCodes:null,firstCreatePass:!0,firstUpdatePass:!0,staticViewQueries:!1,staticContentQueries:!1,preOrderHooks:null,preOrderCheckHooks:null,contentHooks:null,contentCheckHooks:null,viewHooks:null,viewCheckHooks:null,destroyHooks:null,cleanup:null,contentQueries:null,components:null,directiveRegistry:typeof o=="function"?o():o,pipeRegistry:typeof a=="function"?a():a,firstChild:null,schemas:l,consts:S,incompleteFirstPass:!1,ssrId:u}}function nk(t,n){let e=[];for(let i=0;i<n;i++)e.push(i<t?null:nn);return e}function ik(t){let n=t.tView;return n===null||n.incompleteFirstPass?t.tView=r_(1,null,t.template,t.decls,t.vars,t.directiveDefs,t.pipeDefs,t.viewQuery,t.schemas,t.consts,t.id):n}function o_(t,n,e,i,r,o,a,s,l,d,u){let h=n.blueprint.slice();return h[Qn]=r,h[he]=i|4|128|8|64|1024,(d!==null||t&&t[he]&2048)&&(h[he]|=2048),Ep(h),h[Rt]=h[Er]=t,h[St]=e,h[Xn]=a||t&&t[Xn],h[Ue]=s||t&&t[Ue],h[vi]=l||t&&t[vi]||null,h[Ut]=o,h[yi]=PN(),h[wo]=u,h[wp]=d,h[tn]=n.type==2?t[tn]:h,h}function rk(t,n,e){let i=mn(n,t),r=ik(e),o=t[Xn].rendererFactory,a=a_(t,o_(t,r,null,JC(e),i,n,null,o.createRenderer(i,e),null,null,null));return t[n.index]=a}function JC(t){let n=16;return t.signals?n=4096:t.onPush&&(n=64),n}function ew(t,n,e,i){if(e===0)return-1;let r=n.length;for(let o=0;o<e;o++)n.push(i),t.blueprint.push(i),t.data.push(null);return r}function a_(t,n){return t[xa]?t[Cp][kn]=n:t[xa]=n,t[Cp]=n,n}function p(t=1){tw(Qe(),le(),Jn()+t,!1)}function tw(t,n,e,i){if(!i)if((n[he]&3)===3){let o=t.preOrderCheckHooks;o!==null&&yu(n,o,e)}else{let o=t.preOrderHooks;o!==null&&Cu(n,o,0,e)}Ir(e)}var Vl=(function(t){return t[t.None=0]="None",t[t.SignalBased=1]="SignalBased",t[t.HasDecoratorInputTransform=2]="HasDecoratorInputTransform",t})(Vl||{});function Ro(t,n,e,i){let r=ce(null);try{let[o,a,s]=t.inputs[e],l=null;(a&Vl.SignalBased)!==0&&(l=n[o][gt]),l!==null&&l.transformFn!==void 0?i=l.transformFn(i):s!==null&&(i=s.call(n,i)),t.setInput!==null?t.setInput(n,l,i,e,o):iC(n,l,o,i)}finally{ce(r)}}function nw(t,n,e,i,r){let o=Jn(),a=i&2;try{Ir(-1),a&&n.length>vt&&tw(t,n,vt,!1);let s=a?Ae.TemplateUpdateStart:Ae.TemplateCreateStart;ze(s,r,e),e(i,r)}finally{Ir(o);let s=a?Ae.TemplateUpdateEnd:Ae.TemplateCreateEnd;ze(s,r,e)}}function Yu(t,n,e){ck(t,n,e),(e.flags&64)===64&&dk(t,n,e)}function Bl(t,n,e=mn){let i=n.localNames;if(i!==null){let r=n.index+1;for(let o=0;o<i.length;o+=2){let a=i[o+1],s=a===-1?e(n,t):t[a];t[r++]=s}}}function ok(t,n,e,i){let o=i.get(IC,MC)||e===ni.ShadowDom||e===ni.ExperimentalIsolatedShadowDom,a=t.selectRootElement(n,o);return ak(a),a}function ak(t){sk(t)}var sk=()=>null;function lk(t){return t==="class"?"className":t==="for"?"htmlFor":t==="formaction"?"formAction":t==="innerHtml"?"innerHTML":t==="readonly"?"readOnly":t==="tabindex"?"tabIndex":t}function iw(t,n,e,i,r,o){let a=n[re];if(Zu(t,a,n,e,i)){wi(t)&&ow(n,t.index);return}t.type&3&&(e=lk(e)),rw(t,n,e,i,r,o)}function rw(t,n,e,i,r,o){if(t.type&3){let a=mn(t,n);i=o!=null?o(i,t.value||"",e):i,r.setProperty(a,e,i)}else t.type&12}function ow(t,n){let e=Rn(n,t);e[he]&16||(e[he]|=64)}function ck(t,n,e){let i=e.directiveStart,r=e.directiveEnd;wi(e)&&rk(n,e,t.data[i+e.componentOffset]),t.firstCreatePass||Mu(e,n);let o=e.initialInputs;for(let a=i;a<r;a++){let s=t.data[a],l=Nl(n,t,a,e);if(Ra(l,n),o!==null&&fk(n,a-i,l,s,e,o),Kn(s)){let d=Rn(e.index,n);d[St]=Nl(n,t,a,e)}}}function dk(t,n,e){let i=e.directiveStart,r=e.directiveEnd,o=e.index,a=Jy();try{Ir(o);for(let s=i;s<r;s++){let l=t.data[s],d=n[s];su(s),(l.hostBindings!==null||l.hostVars!==0||l.hostAttrs!==null)&&uk(l,d)}}finally{Ir(-1),su(a)}}function uk(t,n){t.hostBindings!==null&&t.hostBindings(1,n)}function s_(t,n){let e=t.directiveRegistry,i=null;if(e)for(let r=0;r<e.length;r++){let o=e[r];WC(n,o.selectors,!1)&&(i??=[],Kn(o)?i.unshift(o):i.push(o))}return i}function mk(t,n,e,i,r,o){let a=mn(t,n);aw(n[Ue],a,o,t.value,e,i,r)}function aw(t,n,e,i,r,o,a){if(o==null)a?.(o,i||"",r),t.removeAttribute(n,r,e);else{let s=a==null?ba(o):a(o,i||"",r);t.setAttribute(n,r,s,e)}}function fk(t,n,e,i,r,o){let a=o[n];if(a!==null)for(let s=0;s<a.length;s+=2){let l=a[s],d=a[s+1];Ro(i,e,l,d)}}function l_(t,n,e,i,r){let o=vt+e,a=n[re],s=r(a,n,t,i,e);n[o]=s,Ma(t,!0);let l=t.type===2;return l?(BC(n[Ue],s,t),(Wy()===0||Da(t))&&Ra(s,n),Gy()):Ra(s,n),uu()&&(!l||!Hu(t))&&n_(a,n,s,t),t}function c_(t){let n=t;return Pp()?Fp():(n=n.parent,Ma(n,!1)),n}function hk(t,n){let e=t[vi];if(!e)return;let i;try{i=e.get(On,null)}catch(r){i=null}i?.(n)}function Zu(t,n,e,i,r){let o=t.inputs?.[i],a=t.hostDirectiveInputs?.[i],s=!1;if(a)for(let l=0;l<a.length;l+=2){let d=a[l],u=a[l+1],h=n.data[d];Ro(h,e[d],u,r),s=!0}if(o)for(let l of o){let d=e[l],u=n.data[l];Ro(u,d,i,r),s=!0}return s}function pk(t,n,e,i,r,o){let a=null,s=null,l=null,d=!1,u=t.directiveToIndex.get(i.type);if(typeof u=="number"?a=u:[a,s,l]=u,s!==null&&l!==null&&t.hostDirectiveInputs&&Object.hasOwn(t.hostDirectiveInputs,r)){let h=t.hostDirectiveInputs[r];for(let _=0;_<h.length;_+=2){let v=h[_];if(v>=s&&v<=l){let S=n.data[v],A=h[_+1];Ro(S,e[v],A,o),d=!0}else if(v>l)break}}return a!==null&&Object.hasOwn(i.inputs,r)&&(Ro(i,e[a],r,o),d=!0),d}function gk(t,n){let e=Rn(n,t),i=e[re];_k(i,e);let r=e[Qn];r!==null&&e[wo]===null&&(e[wo]=NC(r,e[vi])),ze(Ae.ComponentStart);try{d_(i,e,e[St])}finally{ze(Ae.ComponentEnd,e[St])}}function _k(t,n){for(let e=n.length;e<t.blueprint.length;e++)n.push(t.blueprint[e])}function d_(t,n,e){cu(n);try{let i=t.viewQuery;i!==null&&lg(1,i,e);let r=t.template;r!==null&&nw(t,n,r,1,e),t.firstCreatePass&&(t.firstCreatePass=!1),n[bi]?.finishViewCreation(t),t.staticContentQueries&&TC(t,n),t.staticViewQueries&&lg(2,t.viewQuery,e);let o=t.components;o!==null&&vk(n,o)}catch(i){throw t.firstCreatePass&&(t.incompleteFirstPass=!0,t.firstCreatePass=!1),i}finally{n[he]&=-5,du()}}function vk(t,n){for(let e=0;e<n.length;e++)gk(t,n[e])}function Hl(t,n,e,i){let r=ce(null);try{let o=n.tView,s=t[he]&4096?4096:16,l=o_(t,o,e,s,null,n,null,null,i?.injector??null,i?.embeddedViewInjector??null,i?.dehydratedView??null),d=t[n.index];l[Mr]=d;let u=t[bi];return u!==null&&(l[bi]=u.createEmbeddedView(o)),d_(o,l,e),l}finally{ce(r)}}function Oa(t,n){return!n||n.firstChild===null||bC(t)}function kl(t,n,e,i,r=!1){if(t.type===3){let o=t.firstChild,a=o.next,s=zt(n[o.index]),l=zt(n[a.index]),d=s;for(;d!==null&&(i.push(d),d!==l);)d=d.nextSibling;return i}for(;e!==null;){if(e.type===128){e=r?e.projectionNext:e.next;continue}let o=n[e.index];if(o!==null)if(An(o)){let s=o[Do];s!==o[Qn]&&i.push(zt(o)),o[he]&4||sw(o,i),i.push(s)}else i.push(zt(o));let a=e.type;if(a&8)kl(t,n,e.child,i);else if(a&32){let s=Xg(e,n),l;for(;l=s();)i.push(l)}else if(a&16){let s=XC(n,e);if(Array.isArray(s))i.push(...s);else{let l=zi(n[tn]);kl(l[re],l,s,i,!0)}}e=r?e.projectionNext:e.next}return i}function sw(t,n){for(let e=ht;e<t.length;e++){let i=t[e],r=i[re].firstChild;r!==null&&kl(i[re],i,r,n)}}function lw(t){if(t[xo]!==null){for(let n of t[xo])n.impl.addSequence(n);t[xo].length=0}}var cw=[];function bk(t){return t[bn]??yk(t)}function yk(t){let n=cw.pop()??Object.create(wk);return n.lView=t,n}function Ck(t){t.lView[bn]!==t&&(t.lView=null,cw.push(t))}var wk=J(y({},pr),{consumerIsAlwaysLive:!0,kind:"template",consumerMarkedDirty:t=>{Io(t.lView)},consumerOnSignalRead(){this.lView[bn]=this}});function Sk(t){let n=t[bn]??Object.create(xk);return n.lView=t,n}var xk=J(y({},pr),{consumerIsAlwaysLive:!0,kind:"template",consumerMarkedDirty:t=>{let n=zi(t.lView);for(;n&&!dw(n[re]);)n=zi(n);n&&Mp(n)},consumerOnSignalRead(){this.lView[bn]=this}});function dw(t){return t.type!==2}function uw(t){if(t[Ui]===null)return;let n=!0;for(;n;){let e=!1;for(let i of t[Ui])if(i.dirty&&(e=!0,i.zone===null||Zone.current===i.zone?i.run():i.zone.run(()=>i.run()),t[Ui]===null))return;n=e&&!!(t[he]&8192)}}var Dk=100;function mw(t,n=0){let i=t[Xn].rendererFactory,r=!1;r||i.begin?.();try{Ek(t,n)}finally{r||i.end?.()}}function Ek(t,n){let e=Lp();try{cl(!0),bg(t,n);let i=0;for(;yl(t);){if(i===Dk)throw new H(103,!1);i++,bg(t,1)}}finally{cl(e)}}function Mk(t,n,e,i){if(Mo(n))return;let r=n[he],o=!1,a=!1;cu(n);let s=!0,l=null,d=null;o||(dw(t)?(d=bk(n),l=Li(d)):rd()===null?(s=!1,d=Sk(n),l=Li(d)):n[bn]&&(vr(n[bn]),n[bn]=null));try{Ep(n),Qy(t.bindingStartIndex),e!==null&&nw(t,n,e,2,i);let u=(r&3)===3;if(!o)if(u){let v=t.preOrderCheckHooks;v!==null&&yu(n,v,null)}else{let v=t.preOrderHooks;v!==null&&Cu(n,v,0,null),Gp(n,0)}if(a||Ik(n),uw(n),fw(n,0),t.contentQueries!==null&&TC(t,n),!o)if(u){let v=t.contentCheckHooks;v!==null&&yu(n,v)}else{let v=t.contentHooks;v!==null&&Cu(n,v,1),Gp(n,1)}Tk(t,n);let h=t.components;h!==null&&pw(n,h,0);let _=t.viewQuery;if(_!==null&&lg(2,_,i),!o)if(u){let v=t.viewCheckHooks;v!==null&&yu(n,v)}else{let v=t.viewHooks;v!==null&&Cu(n,v,2),Gp(n,2)}if(t.firstUpdatePass===!0&&(t.firstUpdatePass=!1),n[Kd]){for(let v of n[Kd])v();n[Kd]=null}o||(lw(n),n[he]&=-73)}catch(u){throw o||Io(n),u}finally{d!==null&&(_r(d,l),s&&Ck(d)),du()}}function fw(t,n){for(let e=CC(t);e!==null;e=wC(e))for(let i=ht;i<e.length;i++){let r=e[i];hw(r,n)}}function Ik(t){for(let n=CC(t);n!==null;n=wC(n)){if(!(n[he]&2))continue;let e=n[Eo];for(let i=0;i<e.length;i++){let r=e[i];Mp(r)}}}function Nk(t,n,e){ze(Ae.ComponentStart);let i=Rn(n,t);try{hw(i,e)}finally{ze(Ae.ComponentEnd,i[St])}}function hw(t,n){tu(t)&&bg(t,n)}function bg(t,n){let i=t[re],r=t[he],o=t[bn],a=!!(n===0&&r&16);if(a||=!!(r&64&&n===0),a||=!!(r&1024),a||=!!(o?.dirty&&sa(o)),a||=!1,o&&(o.dirty=!1),t[he]&=-9217,a)Mk(i,t,i.template,t[St]);else if(r&8192){let s=ce(null);try{uw(t),fw(t,1);let l=i.components;l!==null&&pw(t,l,1),lw(t)}finally{ce(s)}}}function pw(t,n,e){for(let i=0;i<n.length;i++)Nk(t,n[i],e)}function Tk(t,n){let e=t.hostBindingOpCodes;if(e!==null)try{for(let i=0;i<e.length;i++){let r=e[i];if(r<0)Ir(~r);else{let o=r,a=e[++i],s=e[++i];Ky(a,o);let l=n[o];ze(Ae.HostBindingsUpdateStart,l);try{s(2,l)}finally{ze(Ae.HostBindingsUpdateEnd,l)}}}}finally{Ir(-1)}}function u_(t,n){let e=Lp()?64:1088;for(t[Xn].changeDetectionScheduler?.notify(n);t;){t[he]|=e;let i=zi(t);if(Ea(t)&&!i)return t;t=i}return null}function gw(t,n,e,i){return[t,!0,0,n,null,i,null,e,null,null]}function _w(t,n){let e=ht+n;if(e<t.length)return t[e]}function Ul(t,n,e,i=!0){let r=n[re];if(kk(r,n,t,e),i){let a=vg(e,t),s=n[Ue],l=s.parentNode(t[Do]);l!==null&&WT(r,t[Ut],s,n,l,a)}let o=n[wo];o!==null&&o.firstChild!==null&&(o.firstChild=null)}function vw(t,n){let e=Al(t,n);return e!==void 0&&Gu(e[re],e),e}function Al(t,n){if(t.length<=ht)return;let e=ht+n,i=t[e];if(i){let r=i[Mr];r!==null&&r!==t&&t_(r,i),n>0&&(t[e-1][kn]=i[kn]);let o=gl(t,ht+n);$T(i[re],i);let a=o[bi];a!==null&&a.detachView(o[re]),i[Rt]=null,i[kn]=null,i[he]&=-129}return i}function kk(t,n,e,i){let r=ht+i,o=e.length;i>0&&(e[r-1][kn]=n),i<o-ht?(n[kn]=e[r],gp(e,ht+i,n)):(e.push(n),n[kn]=null),n[Rt]=e;let a=n[Mr];a!==null&&e!==a&&bw(a,n);let s=n[bi];s!==null&&s.insertView(t),nu(n),n[he]|=128}function bw(t,n){let e=t[Eo],i=n[Rt];if(Wi(i))t[he]|=2;else{let r=i[Rt][tn];n[tn]!==r&&(t[he]|=2)}e===null?t[Eo]=[n]:e.push(n)}var Rr=class{_lView;_cdRefInjectingView;_appRef=null;_attachedToViewContainer=!1;exhaustive;get rootNodes(){let n=this._lView,e=n[re];return kl(e,n,e.firstChild,[])}constructor(n,e){this._lView=n,this._cdRefInjectingView=e}get context(){return this._lView[St]}set context(n){this._lView[St]=n}get destroyed(){return Mo(this._lView)}destroy(){if(this._appRef)this._appRef.detachView(this);else if(this._attachedToViewContainer){let n=this._lView[Rt];if(An(n)){let e=n[bl],i=e?e.indexOf(this):-1;i>-1&&(Al(n,i),gl(e,i))}this._attachedToViewContainer=!1}Gu(this._lView[re],this._lView)}onDestroy(n){iu(this._lView,n)}markForCheck(){u_(this._cdRefInjectingView||this._lView,4)}detach(){this._lView[he]&=-129}reattach(){nu(this._lView),this._lView[he]|=128}detectChanges(){this._lView[he]|=1024,mw(this._lView)}checkNoChanges(){}attachToViewContainerRef(){if(this._appRef)throw new H(902,!1);this._attachedToViewContainer=!0}detachFromAppRef(){this._appRef=null;let n=Ea(this._lView),e=this._lView[Mr];e!==null&&!n&&t_(e,this._lView),YC(this._lView[re],this._lView)}attachToAppRef(n){if(this._attachedToViewContainer)throw new H(902,!1);this._appRef=n;let e=Ea(this._lView),i=this._lView[Mr];i!==null&&!e&&bw(i,this._lView),nu(this._lView)}};var bt=(()=>{class t{_declarationLView;_declarationTContainer;elementRef;static __NG_ELEMENT_ID__=Ak;constructor(e,i,r){this._declarationLView=e,this._declarationTContainer=i,this.elementRef=r}get ssrId(){return this._declarationTContainer.tView?.ssrId||null}createEmbeddedView(e,i){return this.createEmbeddedViewImpl(e,i)}createEmbeddedViewImpl(e,i,r){let o=Hl(this._declarationLView,this._declarationTContainer,e,{embeddedViewInjector:i,dehydratedView:r});return new Rr(o)}}return t})();function Ak(){return Qu(Mt(),le())}function Qu(t,n){return t.type&4?new bt(n,t,ja(t,n)):null}function Va(t,n,e,i,r){let o=t.data[n];if(o===null)o=Rk(t,n,e,i,r),Xy()&&(o.flags|=32);else if(o.type&64){o.type=e,o.value=i,o.attrs=r;let a=qy();o.injectorIndex=a===null?-1:a.injectorIndex}return Ma(o,!0),o}function Rk(t,n,e,i,r){let o=Op(),a=Pp(),s=a?o:o&&o.parent,l=t.data[n]=Pk(t,s,e,n,i,r);return Ok(t,l,o,a),l}function Ok(t,n,e,i){t.firstChild===null&&(t.firstChild=n),e!==null&&(i?e.child==null&&n.parent!==null&&(e.child=n):e.next===null&&(e.next=n,n.prev=e))}function Pk(t,n,e,i,r,o){let a=n?n.injectorIndex:-1,s=0;return kp()&&(s|=128),{type:e,index:i,insertBeforeIndex:null,injectorIndex:a,directiveStart:-1,directiveEnd:-1,directiveStylingLast:-1,componentOffset:-1,controlDirectiveIndex:-1,customControlIndex:-1,propertyBindings:null,flags:s,providerIndexes:0,value:r,namespace:Bp(),attrs:o,mergedAttrs:null,localNames:null,initialInputs:null,inputs:null,hostDirectiveInputs:null,outputs:null,hostDirectiveOutputs:null,directiveToIndex:null,tView:null,next:null,prev:null,projectionNext:null,child:null,parent:n,projection:null,styles:null,stylesWithoutHost:null,residualStyles:void 0,classes:null,classesWithoutHost:null,residualClasses:void 0,classBindings:0,styleBindings:0}}function Fk(t){let n=t[Sp]??[],i=t[Rt][Ue],r=[];for(let o of n)o.data[EC]!==void 0?r.push(o):Lk(o,i);t[Sp]=r}function Lk(t,n){let e=0,i=t.firstChild;if(i){let r=t.data[DC];for(;e<r;){let o=i.nextSibling;VC(n,i,!1),i=o,e++}}}var jk=()=>null,Vk=()=>null;function Iu(t,n){return jk(t,n)}function yw(t,n,e){return Vk(t,n,e)}var Cw=class{},It=class{},xe=class{destroyNode=null;static __NG_ELEMENT_ID__=()=>Bk()};function Bk(){let t=le(),n=Mt(),e=Rn(n.index,t);return(Wi(e)?e:t)[Ue]}var ww=(()=>{class t{static \u0275prov=fe({token:t,providedIn:"root",factory:()=>null})}return t})();function Sw(t){return t.debugInfo?.className||t.type.name||null}var Su={},Nu=class{injector;parentInjector;constructor(n,e){this.injector=n,this.parentInjector=e}get(n,e,i){let r=this.injector.get(n,Su,i);return r!==Su||e===Su?r:this.parentInjector.get(n,e,i)}};function m_(t,n,e){return t[n]=e}function Hk(t,n){return t[n]}function Cn(t,n,e){if(e===nn)return!1;let i=t[n];return Object.is(i,e)?!1:(t[n]=e,!0)}function xw(t,n,e,i){let r=Cn(t,n,e);return Cn(t,n+1,i)||r}function ko(t,n,e){return function i(r){let o=i.__ngNativeEl__;o!==void 0&&LN(r,o);let a=wi(t)?Rn(t.index,n):n;u_(a,5);let s=n[St],l=O0(n,s,e,r),d=i.__ngNextListenerFn__;for(;d;)l=O0(n,s,d,r)&&l,d=d.__ngNextListenerFn__;return l}}function O0(t,n,e,i){let r=ce(null);try{return ze(Ae.OutputStart,n,e),e(i)!==!1}catch(o){return hk(t,o),!1}finally{ze(Ae.OutputEnd,n,e),ce(r)}}function f_(t,n,e,i,r,o,a,s){let l=Da(t),d=!1,u=null;if(!i&&l&&(u=zk(n,e,o,t.index)),u!==null){let h=u.__ngLastListenerFn__||u;h.__ngNextListenerFn__=a,u.__ngLastListenerFn__=a,d=!0}else{let h=mn(t,e),_=i?i(h):h;VN(e,_,o,s),i||(s.__ngNativeEl__=h);let v=r.listen(_,o,s);if(!Uk(o)){let S=i?A=>i(zt(A[t.index])):t.index;Dw(S,n,e,o,s,v,!1)}}return d}function Uk(t){return t.startsWith("animation")||t.startsWith("transition")}function zk(t,n,e,i){let r=t.cleanup;if(r!=null)for(let o=0;o<r.length-1;o+=2){let a=r[o];if(a===e&&r[o+1]===i){let s=n[Sa],l=r[o+2];return s&&s.length>l?s[l]:null}typeof a=="string"&&(o+=2)}return null}function Dw(t,n,e,i,r,o,a){let s=n.firstCreatePass?Np(n):null,l=Ip(e),d=l.length;l.push(r,o),s&&s.push(i,t,d,(d+1)*(a?-1:1))}function P0(t,n,e,i,r){let o=null,a=null,s=null,l=!1,d=t.directiveToIndex.get(e.type);if(typeof d=="number"?o=d:[o,a,s]=d,a!==null&&s!==null&&t.hostDirectiveOutputs&&Object.hasOwn(t.hostDirectiveOutputs,i)){let u=t.hostDirectiveOutputs[i];for(let h=0;h<u.length;h+=2){let _=u[h];if(_>=a&&_<=s)l=!0,Tu(t,n,_,u[h+1],i,r);else if(_>s)break}}return Object.hasOwn(e.outputs,i)&&(l=!0,Tu(t,n,o,i,i,r)),l}function Tu(t,n,e,i,r,o){let a=n[e],s=n[re],d=s.data[e].outputs[i],h=a[d].subscribe(o);Dw(t.index,s,n,r,o,h,!0)}function ii(){$k()}function $k(){let t=le(),n=Qe(),e=Mt();if(n.firstCreatePass&&Gk(n,e),e.controlDirectiveIndex===-1)return;Ki("NgSignalForms");let i=t[e.controlDirectiveIndex];n.data[e.controlDirectiveIndex].controlDef.create(i,new ku(t,n,e))}function ri(){Wk()}function Wk(){let t=le(),n=Qe(),e=Nr();if(e.controlDirectiveIndex===-1)return;let i=n.data[e.controlDirectiveIndex].controlDef,r=t[e.controlDirectiveIndex];i.update(r,new ku(t,n,e))}var ku=class{lView;tView;tNode;hasPassThrough;constructor(n,e,i){this.lView=n,this.tView=e,this.tNode=i,this.hasPassThrough=!!(i.flags&4096)}get customControl(){return this.tNode.customControlIndex!==-1?this.lView[this.tNode.customControlIndex]:void 0}get nativeElement(){return mn(this.tNode,this.lView)}get descriptor(){return`<${this.tNode.value}>`}listenToCustomControlOutput(n,e){let i=this.tView.data[this.tNode.customControlIndex];P0(this.tNode,this.lView,i,n,ko(this.tNode,this.lView,e))}listenToCustomControlModel(n){let e=this.tNode.flags&1024?"valueChange":"checkedChange",i=this.tView.data[this.tNode.customControlIndex];P0(this.tNode,this.lView,i,e,ko(this.tNode,this.lView,n))}listenToDom(n,e){f_(this.tNode,this.tView,this.lView,void 0,this.lView[Ue],n,e,ko(this.tNode,this.lView,e))}setInputOnDirectives(n,e,i){let r=this.tNode.inputs?.[n],o=this.tNode.hostDirectiveInputs?.[n];if(!r&&!o)return!1;let a=!1;if(r)for(let s of r){if(s===this.tNode.controlDirectiveIndex)continue;let l=this.lView[s],d=this.tView.data[s];(!i||i(L0(l,d,n)))&&(Ro(d,l,n,e),a=!0)}if(o)for(let s=0;s<o.length;s+=2){let l=o[s];if(l===this.tNode.controlDirectiveIndex)continue;let d=this.lView[l],u=o[s+1],h=this.tView.data[l];(!i||i(L0(d,h,n)))&&(Ro(h,d,u,e),a=!0)}return a}setCustomControlModelInput(n){let e=this.tView.data[this.tNode.customControlIndex],i=this.tNode.flags&1024?"value":"checked";pk(this.tNode,this.tView,this.lView,e,i,n)}customControlHasInput(n){if(this.tNode.customControlIndex===-1)return!1;let e=this.tView.data[this.tNode.customControlIndex];return(e.signalFormsInputPresence??=this._buildCustomControlInputCache(e))[n]===!0}_buildCustomControlInputCache(n){let e={};for(let i in n.inputs)e[i]=!0;if(n.hostDirectives!==null){let i=[...n.hostDirectives];for(;i.length>0;){let r=i.shift();if(typeof r!="function"){for(let a in r.inputs)e[r.inputs[a]]=!0;let o=F0(r.directive);o!==null&&i.push(...o);continue}for(let o of r()){if(typeof o=="function")continue;if(o.inputs)for(let s=0;s<o.inputs.length;s+=2){let l=o.inputs[s+1]||o.inputs[s];e[l]=!0}let a=F0(o.directive);a!==null&&i.push(...a)}}}return e}};function F0(t){return typeof t=="function"&&"\u0275dir"in t?t.\u0275dir.hostDirectives??null:null}function L0(t,n,e){if(!n.inputs||!Object.hasOwn(n.inputs,e))return;let[i,r]=n.inputs[e];if((r&Vl.SignalBased)!==0){let a=t[i][gt];return a.value===Bu?void 0:a.value}return t[i]}function Gk(t,n,e){for(let r=n.directiveStart;r<n.directiveEnd;r++)if(t.data[r].controlDef){n.controlDirectiveIndex=r;break}if(n.controlDirectiveIndex===-1)return;let i=t.data[n.controlDirectiveIndex].controlDef;if(i.passThroughInput&&(n.inputs?.[i.passThroughInput]?.length??0)>1){n.flags|=4096;return}qk(t,n)}function qk(t,n){for(let e=n.directiveStart;e<n.directiveEnd;e++){let i=t.data[e];if(!(n.directiveToIndex&&!n.directiveToIndex.has(i.type))){if(j0(i,"value")){n.flags|=1024,n.customControlIndex=e;return}if(j0(i,"checked")){n.flags|=2048,n.customControlIndex=e;return}}}if(n.hostDirectiveInputs!==null&&n.hostDirectiveOutputs!==null&&n.directiveToIndex!==null){let e=(i,r)=>{let o=n.hostDirectiveInputs[i],a=n.hostDirectiveOutputs[i+"Change"];if(!o||!a)return!1;for(let s=0;s<o.length;s+=2){let l=o[s];for(let d=0;d<a.length;d+=2){let u=a[d];if(l===u)for(let h of n.directiveToIndex.values()){if(!Array.isArray(h))continue;let[_,v,S]=h;if(l>=v&&l<=S)return n.flags|=r,n.customControlIndex=_,!0}}}return!1};if(e("value",1024)||e("checked",2048))return}}function j0(t,n){return Yk(t,n)&&Zk(t,n+"Change")}function Yk(t,n){return n in t.inputs}function Zk(t,n){return n in t.outputs}var yg=Symbol("BINDING");var Po=new C("");function Au(t,n,e){let i=e?t.styles:null,r=e?t.classes:null,o=0;if(n!==null)for(let a=0;a<n.length;a++){let s=n[a];if(typeof s=="number")o=s;else if(o==1)r=$d(r,s);else if(o==2){let l=s,d=n[++a];i=$d(i,l+": "+d+";")}}e?t.styles=i:t.stylesWithoutHost=i,e?t.classes=r:t.classesWithoutHost=r}function ne(t,n=0){let e=le();if(e===null)return te(t,n);let i=Mt();return pC(i,e,At(t),n)}function zl(){let t="invalid";throw new Error(t)}function Ew(t,n,e,i,r){let o=i===null?null:{"":-1},a=r(t,e);if(a!==null){let s=a,l=null,d=null;for(let u of a)if(u.resolveHostDirectives!==null){[s,l,d]=u.resolveHostDirectives(a);break}Kk(t,n,e,s,o,l,d)}o!==null&&i!==null&&Qk(e,i,o)}function Qk(t,n,e){let i=t.localNames=[];for(let r=0;r<n.length;r+=2){let o=e[n[r+1]];if(o==null)throw new H(-301,!1);i.push(n[r],o)}}function Xk(t,n,e){n.componentOffset=e,(t.components??=[]).push(n.index)}function Kk(t,n,e,i,r,o,a){let s=i.length,l=null;for(let _=0;_<s;_++){let v=i[_];l===null&&Kn(v)&&(l=v,Xk(t,e,_)),rg(Mu(e,n),t,v.type)}rA(e,t.data.length,s),l?.viewProvidersResolver&&l.viewProvidersResolver(l);for(let _=0;_<s;_++){let v=i[_];v.providersResolver&&v.providersResolver(v)}let d=!1,u=!1,h=ew(t,n,s,null);s>0&&(e.directiveToIndex=new Map);for(let _=0;_<s;_++){let v=i[_];if(e.mergedAttrs=Aa(e.mergedAttrs,v.hostAttrs),eA(t,e,n,h,v),iA(h,v,r),a!==null&&a.has(v)){let[A,oe]=a.get(v);e.directiveToIndex.set(v.type,[h,A+e.directiveStart,oe+e.directiveStart])}else(o===null||!o.has(v))&&e.directiveToIndex.set(v.type,h);v.contentQueries!==null&&(e.flags|=4),(v.hostBindings!==null||v.hostAttrs!==null||v.hostVars!==0)&&(e.flags|=64);let S=v.type.prototype;!d&&(S.ngOnChanges||S.ngOnInit||S.ngDoCheck)&&((t.preOrderHooks??=[]).push(e.index),d=!0),!u&&(S.ngOnChanges||S.ngDoCheck)&&((t.preOrderCheckHooks??=[]).push(e.index),u=!0),h++}Jk(t,e,o)}function Jk(t,n,e){for(let i=n.directiveStart;i<n.directiveEnd;i++){let r=t.data[i];if(e===null||!e.has(r))V0(0,n,r,i),V0(1,n,r,i),H0(n,i,!1);else{let o=e.get(r);B0(0,n,o,i),B0(1,n,o,i),H0(n,i,!0)}}}function V0(t,n,e,i){let r=t===0?e.inputs:e.outputs;for(let o in r)if(Object.hasOwn(r,o)){let a;t===0?a=n.inputs??={}:a=n.outputs??={},a[o]??=[],a[o].push(i),Mw(n,o)}}function B0(t,n,e,i){let r=t===0?e.inputs:e.outputs;for(let o in r)if(Object.hasOwn(r,o)){let a=r[o],s;t===0?s=n.hostDirectiveInputs??={}:s=n.hostDirectiveOutputs??={},s[a]??=[],s[a].push(i,o),Mw(n,a)}}function Mw(t,n){n==="class"?t.flags|=8:n==="style"&&(t.flags|=16)}function H0(t,n,e){let{attrs:i,inputs:r,hostDirectiveInputs:o}=t;if(i===null||!e&&r===null||e&&o===null||Qg(t)){t.initialInputs??=[],t.initialInputs.push(null);return}let a=null,s=0;for(;s<i.length;){let l=i[s];if(l===0){s+=4;continue}else if(l===5){s+=2;continue}else if(typeof l=="number")break;if(!e&&Object.hasOwn(r,l)){let d=r[l];for(let u of d)if(u===n){a??=[],a.push(l,i[s+1]);break}}else if(e&&Object.hasOwn(o,l)){let d=o[l];for(let u=0;u<d.length;u+=2)if(d[u]===n){a??=[],a.push(d[u+1],i[s+1]);break}}s+=2}t.initialInputs??=[],t.initialInputs.push(a)}function eA(t,n,e,i,r){t.data[i]=r;let o=r.factory||(r.factory=_o(r.type,!0)),a=new Ao(o,Kn(r),ne,null);t.blueprint[i]=a,e[i]=a,tA(t,n,i,ew(t,e,r.hostVars,nn),r)}function tA(t,n,e,i,r){let o=r.hostBindings;if(o){let a=t.hostBindingOpCodes;a===null&&(a=t.hostBindingOpCodes=[]);let s=~n.index;nA(a)!=s&&a.push(s),a.push(e,i,o)}}function nA(t){let n=t.length;for(;n>0;){let e=t[--n];if(typeof e=="number"&&e<0)return e}return 0}function iA(t,n,e){if(e){if(n.exportAs)for(let i=0;i<n.exportAs.length;i++)e[n.exportAs[i]]=t;Kn(n)&&(e[""]=t)}}function rA(t,n,e){t.flags|=1,t.directiveStart=n,t.directiveEnd=n+e,t.providerIndexes=n}function h_(t,n,e,i,r,o,a,s){let l=n[re],d=l.consts,u=yn(d,a),h=Va(l,t,e,i,u);return o&&Ew(l,n,h,yn(d,s),r),h.mergedAttrs=Aa(h.mergedAttrs,h.attrs),h.attrs!==null&&Au(h,h.attrs,!1),h.mergedAttrs!==null&&Au(h,h.mergedAttrs,!0),l.queries!==null&&l.queries.elementStart(l,h),h}function p_(t,n){aC(t,n),xp(n)&&t.queries.elementEnd(n)}function oA(t,n,e,i,r,o){let a=n.consts,s=yn(a,r),l=Va(n,t,e,i,s);if(l.mergedAttrs=Aa(l.mergedAttrs,l.attrs),o!=null){let d=yn(a,o);l.localNames=[];for(let u=0;u<d.length;u+=2)l.localNames.push(d[u],-1)}return l.attrs!==null&&Au(l,l.attrs,!1),l.mergedAttrs!==null&&Au(l,l.mergedAttrs,!0),n.queries!==null&&n.queries.elementStart(n,l),l}var Iw=typeof ShadowRoot<"u",aA=typeof Document<"u";function sA(t){return Object.keys(t).map(n=>{let[e,i,r]=t[n],o={propName:e,templateName:n,isSignal:(i&Vl.SignalBased)!==0};return r&&(o.transform=r),o})}function lA(t){return Object.keys(t).map(n=>({propName:t[n],templateName:n}))}function cA(t,n,e){let i=n instanceof qe?n:n?.injector;return i&&t.getStandaloneInjector!==null&&(i=t.getStandaloneInjector(i)||i),i?new Nu(e,i):e}function dA(t){let n=t.get(It,null);if(n===null)throw new H(407,!1);let e=t.get(ww,null),i=t.get(gi,null),r=t.get(Ei,null,{optional:!0});return{rendererFactory:n,sanitizer:e,changeDetectionScheduler:i,ngReflect:!1,tracingService:r}}function uA(t,n,e){let i=Nw(t);return LC(n,i,i==="svg"?yo:i==="math"?Jd:e)}function mA(t){if((t&&"localName"in t&&typeof t.localName=="string"?t.localName:t?.tagName)?.toLowerCase()==="script")throw new H(905,!1)}function Nw(t){return(t.selectors[0][0]||"div").toLowerCase()}var Pa=class{componentDef;ngModule;selector;componentType;ngContentSelectors;isBoundToModule;cachedInputs=null;cachedOutputs=null;get inputs(){return this.cachedInputs??=sA(this.componentDef.inputs),this.cachedInputs}get outputs(){return this.cachedOutputs??=lA(this.componentDef.outputs),this.cachedOutputs}constructor(n,e){this.componentDef=n,this.ngModule=e,this.componentType=n.type,this.selector=TT(n.selectors),this.ngContentSelectors=n.ngContentSelectors??[],this.isBoundToModule=!!e}create(n,e,i,r,o,a,s){ze(Ae.DynamicComponentStart);let l=ce(null);try{let d=this.componentDef,u=cA(d,r||this.ngModule,n),h=dA(u),_=h.tracingService;return _&&_.componentCreate?_.componentCreate(Sw(d),()=>this.createComponentRef(h,u,e,i,o,a,s)):this.createComponentRef(h,u,e,i,o,a,s)}finally{ce(l)}}createComponentRef(n,e,i,r,o,a,s){let l=this.componentDef,d=fA(r,l,a,o),u=n.rendererFactory.createRenderer(null,l),h=r?ok(u,r,l.encapsulation,e):uA(l,u,s??null);mA(h);let _=e.get(Po,null),v=hA(h,()=>e.get(X,null)??xC());_&&_.addHost(v);let S=a?.some(U0)||o?.some(ae=>typeof ae!="function"&&ae.bindings.some(U0)),A=o_(null,d,null,512|JC(l),null,null,n,u,e,null,NC(h,e,!0));_&&Iw&&v instanceof ShadowRoot&&iu(A,()=>{_.removeHost(v)}),A[vt]=h,cu(A);let oe=null;try{let ae=h_(vt,A,2,"#host",()=>d.directiveRegistry,!0,0);BC(u,h,ae),Ra(h,A),Yu(d,A,ae),Ug(d,ae,A),p_(d,ae),i!==void 0&&gA(ae,this.ngContentSelectors,i),oe=Rn(ae.index,A),A[St]=oe[St],d_(d,A,null)}catch(ae){throw oe!==null&&ag(oe),ag(A),ae}finally{ze(Ae.DynamicComponentEnd),du()}return new Ru(this.componentType,A,!!S)}};function fA(t,n,e,i){let r=t?["ng-version","22.1.6"]:kT(n.selectors[0]),o=null,a=null,s=0;if(e)for(let u of e)s+=u[yg].requiredVars,u.create&&(u.targetIdx=0,(o??=[]).push(u)),u.update&&(u.targetIdx=0,(a??=[]).push(u));if(i)for(let u=0;u<i.length;u++){let h=i[u];if(typeof h!="function")for(let _ of h.bindings){s+=_[yg].requiredVars;let v=u+1;_.create&&(_.targetIdx=v,(o??=[]).push(_)),_.update&&(_.targetIdx=v,(a??=[]).push(_))}}let l=[n];if(i)for(let u of i){let h=typeof u=="function"?u:u.type,_=Gd(h);l.push(_)}return r_(0,null,pA(o,a),1,s,l,null,null,null,[r],null)}function hA(t,n){let e=t.getRootNode?.();return aA&&e instanceof Document?e.head:e&&Iw&&e instanceof ShadowRoot?e:n().head}function pA(t,n){return!t&&!n?null:e=>{if(e&1&&t)for(let i of t)i.create();if(e&2&&n)for(let i of n)i.update()}}function U0(t){let n=t[yg].kind;return n==="input"||n==="twoWay"}var Ru=class extends Cw{_rootLView;_hasInputBindings;instance;hostView;changeDetectorRef;componentType;location;previousInputValues=null;_tNode;constructor(n,e,i){super(),this._rootLView=e,this._hasInputBindings=i,this._tNode=eu(e[re],vt),this.location=ja(this._tNode,e),this.instance=Rn(this._tNode.index,e)[St],this.hostView=this.changeDetectorRef=new Rr(e,void 0),this.componentType=n}setInput(n,e){this._hasInputBindings;let i=this._tNode;if(this.previousInputValues??=new Map,this.previousInputValues.has(n)&&Object.is(this.previousInputValues.get(n),e))return;let r=this._rootLView,o=Zu(i,r[re],r,n,e);this.previousInputValues.set(n,e);let a=Rn(i.index,r);u_(a,1)}get injector(){return new kr(this._tNode,this._rootLView)}destroy(){this.hostView.destroy()}onDestroy(n){this.hostView.onDestroy(n)}};function gA(t,n,e){let i=t.projection=[];for(let r=0;r<n.length;r++){let o=e[r];i.push(o!=null&&o.length?Array.from(o):null)}}var pt=(()=>{class t{static __NG_ELEMENT_ID__=_A}return t})();function _A(){let t=Mt();return Tw(t,le())}var Cg=class t extends pt{_lContainer;_hostTNode;_hostLView;constructor(n,e,i){super(),this._lContainer=n,this._hostTNode=e,this._hostLView=i}get element(){return ja(this._hostTNode,this._hostLView)}get injector(){return new kr(this._hostTNode,this._hostLView)}get parentInjector(){let n=Vg(this._hostTNode,this._hostLView);if(cC(n)){let e=Eu(n,this._hostLView),i=Du(n),r=e[re].data[i+8];return new kr(r,e)}else return new kr(null,this._hostLView)}clear(){for(;this.length>0;)this.remove(this.length-1)}get(n){let e=z0(this._lContainer);return e!==null&&e[n]||null}get length(){return this._lContainer.length-ht}createEmbeddedView(n,e,i){let r,o;typeof i=="number"?r=i:i!=null&&(r=i.index,o=i.injector);let a=Iu(this._lContainer,n.ssrId),s=n.createEmbeddedViewImpl(e||{},o,a);return this.insertImpl(s,r,Oa(this._hostTNode,a)),s}createComponent(n,e,i,r,o,a,s){let l,d=e||{};l=d.index,i=d.injector,r=d.projectableNodes,o=d.environmentInjector||d.ngModuleRef,a=d.directives,s=d.bindings;let u=new Pa(Sr(n)),h=i||this.parentInjector;if(!o&&u.ngModule==null){let ae=this.parentInjector.get(qe,null);ae&&(o=ae)}let _=Sr(u.componentType??{}),v=Iu(this._lContainer,_?.id??null),S=v?.firstChild??null,A=u.create(h,r,S,o,a,s,this._getHostElementNamespace());return this.insertImpl(A.hostView,l,Oa(this._hostTNode,v)),A}_getHostElementNamespace(){if(this._hostTNode.type&2){let n=this._hostTNode.parent??this._hostLView[Ut];return n!==null&&n.type&2&&typeof n.value=="string"&&n.value.toLowerCase()==="foreignobject"?null:n?.namespace??null}return this._hostTNode.namespace}insert(n,e){return this.insertImpl(n,e,!0)}insertImpl(n,e,i){let r=n._lView;if(Hy(r)){let s=this.indexOf(n);if(s!==-1)this.detach(s);else{let l=r[Rt],d=new t(l,l[Ut],l[Rt]);d.detach(d.indexOf(n))}}let o=this._adjustIndex(e),a=this._lContainer;return Ul(a,r,o,i),n.attachToViewContainerRef(),gp(Zp(a),o,n),n}move(n,e){return this.insert(n,e)}indexOf(n){let e=z0(this._lContainer);return e!==null?e.indexOf(n):-1}remove(n){let e=this._adjustIndex(n,-1),i=Al(this._lContainer,e);i&&(gl(Zp(this._lContainer),e),Gu(i[re],i))}detach(n){let e=this._adjustIndex(n,-1),i=Al(this._lContainer,e);return i&&gl(Zp(this._lContainer),e)!=null?new Rr(i):null}_adjustIndex(n,e=0){return n??this.length+e}};function z0(t){return t[bl]}function Zp(t){return t[bl]||(t[bl]=[])}function Tw(t,n){let e,i=n[t.index];return An(i)?e=i:(e=gw(i,n,null,t),n[t.index]=e,a_(n,e)),bA(e,n,t,i),new Cg(e,t,n)}function vA(t,n){let e=t[Ue],i=e.createComment(""),r=mn(n,t),o=e.parentNode(r);return To(e,o,i,e.nextSibling(r),!1),i}var bA=wA,yA=()=>!1;function CA(t,n,e){return yA(t,n,e)}function wA(t,n,e,i){if(t[Do])return;let r;e.type&8?r=zt(i):r=vA(n,e),t[Do]=r}var wg=class t{queryList;matches=null;constructor(n){this.queryList=n}clone(){return new t(this.queryList)}setDirty(){this.queryList.setDirty()}},Sg=class t{queries;constructor(n=[]){this.queries=n}createEmbeddedView(n){let e=n.queries;if(e!==null){let i=n.contentQueries!==null?n.contentQueries[0]:e.length,r=[];for(let o=0;o<i;o++){let a=e.getByIndex(o),s=this.queries[a.indexInDeclarationView];r.push(s.clone())}return new t(r)}return null}insertView(n){this.dirtyQueriesWithMatches(n)}detachView(n){this.dirtyQueriesWithMatches(n)}finishViewCreation(n){this.dirtyQueriesWithMatches(n)}dirtyQueriesWithMatches(n){for(let e=0;e<this.queries.length;e++)__(n,e).matches!==null&&this.queries[e].setDirty()}},Ou=class{flags;read;predicate;constructor(n,e,i=null){this.flags=e,this.read=i,typeof n=="string"?this.predicate=MA(n):this.predicate=n}},xg=class t{queries;constructor(n=[]){this.queries=n}elementStart(n,e){for(let i=0;i<this.queries.length;i++)this.queries[i].elementStart(n,e)}elementEnd(n){for(let e=0;e<this.queries.length;e++)this.queries[e].elementEnd(n)}embeddedTView(n){let e=null;for(let i=0;i<this.length;i++){let r=e!==null?e.length:0,o=this.getByIndex(i).embeddedTView(n,r);o&&(o.indexInDeclarationView=i,e!==null?e.push(o):e=[o])}return e!==null?new t(e):null}template(n,e){for(let i=0;i<this.queries.length;i++)this.queries[i].template(n,e)}getByIndex(n){return this.queries[n]}get length(){return this.queries.length}track(n){this.queries.push(n)}},Dg=class t{metadata;matches=null;indexInDeclarationView=-1;crossesNgTemplate=!1;_declarationNodeIndex;_appliesToNextNode=!0;constructor(n,e=-1){this.metadata=n,this._declarationNodeIndex=e}elementStart(n,e){this.isApplyingToNode(e)&&this.matchTNode(n,e)}elementEnd(n){this._declarationNodeIndex===n.index&&(this._appliesToNextNode=!1)}template(n,e){this.elementStart(n,e)}embeddedTView(n,e){return this.isApplyingToNode(n)?(this.crossesNgTemplate=!0,this.addMatch(-n.index,e),new t(this.metadata)):null}isApplyingToNode(n){if(this._appliesToNextNode&&(this.metadata.flags&1)!==1){let e=this._declarationNodeIndex,i=n.parent;for(;i!==null&&i.type&8&&i.index!==e;)i=i.parent;return e===(i!==null?i.index:-1)}return this._appliesToNextNode}matchTNode(n,e){let i=this.metadata.predicate;if(Array.isArray(i))for(let r=0;r<i.length;r++){let o=i[r];this.matchTNodeWithReadOption(n,e,SA(e,o)),this.matchTNodeWithReadOption(n,e,wu(e,n,o,!1,!1))}else i===bt?e.type&4&&this.matchTNodeWithReadOption(n,e,-1):this.matchTNodeWithReadOption(n,e,wu(e,n,i,!1,!1))}matchTNodeWithReadOption(n,e,i){if(i!==null){let r=this.metadata.read;if(r!==null)if(r===L||r===pt||r===bt&&e.type&4)this.addMatch(e.index,-2);else{let o=wu(e,n,r,!1,!1);o!==null&&this.addMatch(e.index,o)}else this.addMatch(e.index,i)}}addMatch(n,e){this.matches===null?this.matches=[n,e]:this.matches.push(n,e)}};function SA(t,n){let e=t.localNames;if(e!==null){for(let i=0;i<e.length;i+=2)if(e[i]===n)return e[i+1]}return null}function xA(t,n){return t.type&11?ja(t,n):t.type&4?Qu(t,n):null}function DA(t,n,e,i){return e===-1?xA(n,t):e===-2?EA(t,n,i):Nl(t,t[re],e,n)}function EA(t,n,e){if(e===L)return ja(n,t);if(e===bt)return Qu(n,t);if(e===pt)return Tw(n,t)}function kw(t,n,e,i){let r=n[bi].queries[i];if(r.matches===null){let o=t.data,a=e.matches,s=[];for(let l=0;a!==null&&l<a.length;l+=2){let d=a[l];if(d<0)s.push(null);else{let u=o[d];s.push(DA(n,u,a[l+1],e.metadata.read))}}r.matches=s}return r.matches}function Eg(t,n,e,i){let r=t.queries.getByIndex(e),o=r.matches;if(o!==null){let a=kw(t,n,r,e);for(let s=0;s<o.length;s+=2){let l=o[s];if(l>0)i.push(a[s/2]);else{let d=o[s+1],u=n[-l];for(let h=ht;h<u.length;h++){let _=u[h];_[Mr]===_[Rt]&&Eg(_[re],_,d,i)}if(u[Eo]!==null){let h=u[Eo];for(let _=0;_<h.length;_++){let v=h[_];Eg(v[re],v,d,i)}}}}}return i}function g_(t,n){return t[bi].queries[n].queryList}function Aw(t,n,e){let i=new pn((e&4)===4);return $y(t,n,i,i.destroy),(n[bi]??=new Sg).queries.push(new wg(i))-1}function Rw(t,n,e){let i=Qe();return i.firstCreatePass&&(Pw(i,new Ou(t,n,e),-1),(n&2)===2&&(i.staticViewQueries=!0)),Aw(i,le(),n)}function Ow(t,n,e,i){let r=Qe();if(r.firstCreatePass){let o=Mt();Pw(r,new Ou(n,e,i),o.index),IA(r,t),(e&2)===2&&(r.staticContentQueries=!0)}return Aw(r,le(),e)}function MA(t){return t.split(",").map(n=>n.trim())}function Pw(t,n,e){t.queries===null&&(t.queries=new xg),t.queries.track(new Dg(n,e))}function IA(t,n){let e=t.contentQueries||(t.contentQueries=[]),i=e.length?e[e.length-1]:-1;n!==i&&e.push(t.queries.length-1,n)}function __(t,n){return t.queries.getByIndex(n)}function Fw(t,n){let e=t[re],i=__(e,n);return i.crossesNgTemplate?Eg(e,t,n,[]):kw(e,t,i,n)}function Lw(t,n,e){let i,r=Ks(()=>{i._dirtyCounter();let o=NA(i,t);if(n&&o===void 0)throw new H(-951,!1);return o});return i=r[gt],i._dirtyCounter=T(0),i._flatValue=void 0,r}function v_(t){return Lw(!0,!1,t)}function b_(t){return Lw(!0,!0,t)}function jw(t,n){let e=t[gt];e._lView=le(),e._queryIndex=n,e._queryList=g_(e._lView,n),e._queryList.onDirty(()=>e._dirtyCounter.update(i=>i+1))}function NA(t,n){let e=t._lView,i=t._queryIndex;if(e===void 0||i===void 0||e[he]&4)return n?void 0:Wt;let r=g_(e,i),o=Fw(e,i);return r.reset(o,vC),n?r.first:r._changesDetected||t._flatValue===void 0?t._flatValue=r.toArray():t._flatValue}function Ji(t){return!!t&&typeof t.then=="function"}function y_(t){return!!t&&typeof t.subscribe=="function"}var Di=class{},Xu=class{};var Pu=class extends Di{ngModuleType;_parent;_bootstrapComponents=[];_r3Injector;instance;destroyCbs=[];constructor(n,e,i,r=!0){super(),this.ngModuleType=n,this._parent=e;let o=Sy(n);this._bootstrapComponents=bT(o.bootstrap),this._r3Injector=Hp(n,e,[{provide:Di,useValue:this},...i],ml(n),new Set(["environment"])),r&&this.resolveInjectorInitializers()}resolveInjectorInitializers(){this._r3Injector.resolveInjectorInitializers(),this.instance=this._r3Injector.get(this.ngModuleType)}get injector(){return this._r3Injector}destroy(){let n=this._r3Injector;!n.destroyed&&n.destroy(),this.destroyCbs.forEach(e=>e()),this.destroyCbs=null}onDestroy(n){this.destroyCbs.push(n)}},Fu=class extends Xu{moduleType;constructor(n){super(),this.moduleType=n}create(n){return new Pu(this.moduleType,n,[])}};var Rl=class extends Di{injector;instance=null;constructor(n){super();let e=new bo([...n.providers,{provide:Di,useValue:this}],n.parent||wa(),n.debugName,new Set(["environment"]));this.injector=e,n.runEnvironmentInitializers&&e.resolveInjectorInitializers()}destroy(){this.injector.destroy()}onDestroy(n){this.injector.onDestroy(n)}};function $l(t,n,e=null){return new Rl({providers:t,parent:n,debugName:e,runEnvironmentInitializers:!0}).injector}var TA=(()=>{class t{_injector;cachedInjectors=new Map;constructor(e){this._injector=e}getOrCreateStandaloneInjector(e){if(!e.standalone)return null;if(!this.cachedInjectors.has(e)){let i=vp(!1,e.type),r=i.length>0?$l([i],this._injector,""):null;this.cachedInjectors.set(e,r)}return this.cachedInjectors.get(e)}ngOnDestroy(){try{for(let e of this.cachedInjectors.values())e!==null&&e.destroy()}finally{this.cachedInjectors.clear()}}static \u0275prov=fe({token:t,providedIn:"environment",factory:()=>new t(te(qe))})}return t})();function x(t){return Pl(()=>{let n=Vw(t),e=J(y({},n),{decls:t.decls,vars:t.vars,template:t.template,consts:t.consts||null,ngContentSelectors:t.ngContentSelectors,onPush:t.changeDetection!==Bg.Eager,directiveDefs:null,pipeDefs:null,dependencies:n.standalone&&t.dependencies||null,getStandaloneInjector:n.standalone?r=>r.get(TA).getOrCreateStandaloneInjector(e):null,getExternalStyles:null,signals:t.signals??!1,data:t.data||{},encapsulation:t.encapsulation||ni.Emulated,styles:t.styles||Wt,_:null,schemas:t.schemas||null,tView:null,id:""});n.standalone&&Ki("NgStandalone"),Bw(e);let i=t.dependencies;return e.directiveDefs=$0(i,kA),e.pipeDefs=$0(i,xy),e.id=OA(e),e})}function kA(t){return Sr(t)||Gd(t)}function Q(t){return Pl(()=>({type:t.type,bootstrap:t.bootstrap||Wt,declarations:t.declarations||Wt,imports:t.imports||Wt,exports:t.exports||Wt,transitiveCompileScopes:null,schemas:t.schemas||null,id:t.id||null}))}function AA(t,n){if(t==null)return Dr;let e={};for(let i in t)if(Object.hasOwn(t,i)){let r=t[i],o,a,s,l;Array.isArray(r)?(s=r[0],o=r[1],a=r[2]??o,l=r[3]||null):(o=r,a=r,s=Vl.None,l=null),e[o]=[i,s,l],n[o]=a}return e}function RA(t){if(t==null)return Dr;let n={};for(let e in t)Object.hasOwn(t,e)&&(n[t[e]]=e);return n}function R(t){return Pl(()=>{let n=Vw(t);return Bw(n),n})}function Vw(t){let n={};return{type:t.type,providersResolver:null,viewProvidersResolver:null,factory:null,hostBindings:t.hostBindings||null,hostVars:t.hostVars||0,hostAttrs:t.hostAttrs||null,contentQueries:t.contentQueries||null,declaredInputs:n,inputConfig:t.inputs||Dr,exportAs:t.exportAs||null,standalone:t.standalone??!0,signals:t.signals===!0,selectors:t.selectors||Wt,viewQuery:t.viewQuery||null,features:t.features||null,setInput:null,resolveHostDirectives:null,hostDirectives:null,controlDef:null,signalFormsInputPresence:null,inputs:AA(t.inputs,n),outputs:RA(t.outputs),debugInfo:null}}function Bw(t){t.features?.forEach(n=>n(t))}function $0(t,n){return t?()=>{let e=typeof t=="function"?t():t,i=[];for(let r of e){let o=n(r);o!==null&&i.push(o)}return i}:null}function OA(t){let n=0,e=typeof t.consts=="function"?"":t.consts,i=[t.selectors,t.ngContentSelectors,t.hostVars,t.hostAttrs,e,t.vars,t.decls,t.encapsulation,t.standalone,t.signals,t.exportAs,JSON.stringify(t.inputs),JSON.stringify(t.outputs),Object.getOwnPropertyNames(t.type.prototype),!!t.contentQueries,!!t.viewQuery];for(let o of i.join("|"))n=Math.imul(31,n)+o.charCodeAt(0)<<0;return n+=2147483648,"c"+n}var Hw=new C("");var C_=(()=>{class t{resolve;reject;initialized=!1;done=!1;donePromise=new Promise((e,i)=>{this.resolve=e,this.reject=i});appInits=c(Hw,{optional:!0})??[];injector=c(K);constructor(){}runInitializers(){if(this.initialized)return;let e=[];for(let r of this.appInits){let o=Ot(this.injector,r);if(Ji(o))e.push(o);else if(y_(o)){let a=new Promise((s,l)=>{o.subscribe({complete:s,error:l})});e.push(a)}}let i=()=>{this.done=!0,this.resolve()};Promise.all(e).then(()=>{i()}).catch(r=>{this.reject(r)}),e.length===0&&i(),this.initialized=!0}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function Ku(t){return n=>{n.controlDef={create:(e,i)=>{e?.\u0275ngControlCreate(i)},update:(e,i)=>{e?.\u0275ngControlUpdate?.(i)},passThroughInput:t}}}function w_(t){let n=e=>{let i=Array.isArray(t);e.hostDirectives===null?(e.resolveHostDirectives=PA,e.hostDirectives=i?t.map(Mg):[t]):i?e.hostDirectives.unshift(...t.map(Mg)):e.hostDirectives.unshift(t)};return n.ngInherit=!0,n}function PA(t){let n=[],e=!1,i=null,r=null;for(let o=0;o<t.length;o++){let a=t[o];if(a.hostDirectives!==null){let s=n.length;i??=new Map,r??=new Map,Uw(a,n,i,t),r.set(a,[s,n.length-1])}o===0&&Kn(a)&&(e=!0,n.push(a))}for(let o=e?1:0;o<t.length;o++)n.push(t[o]);return i!==null&&i.forEach((o,a)=>{FA(a.declaredInputs,o.inputs)}),[n,i,r]}function Uw(t,n,e,i){if(t.hostDirectives!==null)for(let r of t.hostDirectives)if(typeof r=="function"){let o=r();for(let a of o)W0(Mg(a),n,e,i)}else W0(r,n,e,i)}function W0(t,n,e,i){let r=Gd(t.directive);if(Uw(r,n,e,i),e.has(r)){let o=e.get(r);G0(o,t.inputs,"input"),G0(o,t.outputs,"output")}else i.includes(r)||(e.set(r,t),n.push(r))}function G0(t,n,e){let i=e==="input"?t.inputs:t.outputs;Object.keys(n).forEach(r=>{let o=n[r];(!Object.hasOwn(i,r)||i[r]===o)&&(i[r]=o)})}function Mg(t){return typeof t=="function"?{directive:At(t),inputs:{},outputs:{}}:{directive:At(t.directive),inputs:q0(t.inputs),outputs:q0(t.outputs)}}function q0(t){let n={};if(t!==void 0&&t.length>0)for(let e=0;e<t.length;e+=2)n[t[e]]=t[e+1];return n}function FA(t,n){for(let e in n)if(Object.hasOwn(n,e)){let i=n[e],r=t[e];t[i]=r}}function LA(t){return Object.getPrototypeOf(t.prototype).constructor}function ge(t){let n=LA(t.type),e=!0,i=[t];for(;n&&n!==Function.prototype&&n!==Object.prototype;){let r,o=Object.hasOwn(n,hl)?n[hl]:void 0,a=Object.hasOwn(n,pl)?n[pl]:void 0;if(Kn(t))r=o??a;else{if(o)throw new H(903,!1);r=a}if(r){if(e){i.push(r);let l=t;l.inputs=Qp(t.inputs),l.declaredInputs=Qp(t.declaredInputs),l.outputs=Qp(t.outputs);let d=r.hostBindings;d&&UA(t,d);let u=r.viewQuery,h=r.contentQueries;if(u&&BA(t,u),h&&HA(t,h),jA(t,r),wy(t.outputs,r.outputs),Kn(r)&&r.data.animation){let _=t.data;_.animation=(_.animation||[]).concat(r.data.animation)}}let s=r.features;if(s)for(let l=0;l<s.length;l++){let d=s[l];d&&d.ngInherit&&d(t),d===ge&&(e=!1)}}n=Object.getPrototypeOf(n)}VA(i)}function jA(t,n){for(let e in n.inputs){if(!Object.hasOwn(n.inputs,e)||Object.hasOwn(t.inputs,e))continue;let i=n.inputs[e];i!==void 0&&(t.inputs[e]=i,t.declaredInputs[e]=n.declaredInputs[e])}}function VA(t){let n=0,e=null;for(let i=t.length-1;i>=0;i--){let r=t[i];r.hostVars=n+=r.hostVars,r.hostAttrs=Aa(r.hostAttrs,e=Aa(e,r.hostAttrs))}}function Qp(t){return t===Dr?{}:t===Wt?[]:t}function BA(t,n){let e=t.viewQuery;e?t.viewQuery=(i,r)=>{n(i,r),e(i,r)}:t.viewQuery=n}function HA(t,n){let e=t.contentQueries;e?t.contentQueries=(i,r,o)=>{n(i,r,o),e(i,r,o)}:t.contentQueries=n}function UA(t,n){let e=t.hostBindings;e?t.hostBindings=(i,r)=>{n(i,r),e(i,r)}:t.hostBindings=n}function zw(t,n,e,i,r,o,a,s){if(e.firstCreatePass){t.mergedAttrs=Aa(t.mergedAttrs,t.attrs);let u=t.tView=r_(2,t,r,o,a,e.directiveRegistry,e.pipeRegistry,null,e.schemas,e.consts,null);e.queries!==null&&(e.queries.template(e,t),u.queries=e.queries.embeddedTView(t))}s&&(t.flags|=s),Ma(t,!1);let l=$A(e,n,t,i);uu()&&n_(e,n,l,t),Ra(l,n);let d=gw(l,n,l,t);n[i+vt]=d,a_(n,d),CA(d,t,n)}function zA(t,n,e,i,r,o,a,s,l,d,u){let h=e+vt,_;return n.firstCreatePass?(_=Va(n,h,4,a||null,s||null),ru()&&Ew(n,t,_,yn(n.consts,d),s_),aC(n,_)):_=n.data[h],zw(_,t,n,e,i,r,o,l),Da(_)&&Yu(n,t,_),d!=null&&Bl(t,_,u),_}function Fa(t,n,e,i,r,o,a,s,l,d,u){let h=e+vt,_;if(n.firstCreatePass){if(_=Va(n,h,4,a||null,s||null),d!=null){let v=yn(n.consts,d);_.localNames=[];for(let S=0;S<v.length;S+=2)_.localNames.push(v[S],-1)}}else _=n.data[h];return zw(_,t,n,e,i,r,o,l),d!=null&&Bl(t,_,u),_}function yt(t,n,e,i,r,o,a,s){let l=le(),d=Qe(),u=yn(d.consts,o);return zA(l,d,t,n,e,i,r,u,void 0,a,s),yt}function Ba(t,n,e,i,r,o,a,s){let l=le(),d=Qe(),u=yn(d.consts,o);return Fa(l,d,t,n,e,i,r,u,void 0,a,s),Ba}var $A=WA;function WA(t,n,e,i){return Sl(!0),n[Ue].createComment("")}var Ju=(()=>{class t{log(e){console.log(e)}warn(e){console.warn(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"platform"})}return t})();var S_=new C("");var Wl=new C("");function $w(){Ih(()=>{let t="";throw new H(600,t)})}var GA=10;var rn=(()=>{class t{_runningTick=!1;_destroyed=!1;_destroyListeners=[];_views=[];internalErrorHandler=c(On);afterRenderManager=c($u);zonelessEnabled=c(Dl);rootEffectScheduler=c(hu);dirtyFlags=0;tracingSnapshot=null;allTestViews=new Set;autoDetectTestViews=new Set;includeAllTestViews=!1;afterTick=new I;get allViews(){return[...(this.includeAllTestViews?this.allTestViews:this.autoDetectTestViews).keys(),...this._views]}get destroyed(){return this._destroyed}componentTypes=[];components=[];internalPendingTask=c(qi);get isStable(){return this.internalPendingTask.hasPendingTasksObservable.pipe(ee(e=>!e))}constructor(){c(Ei,{optional:!0})}whenStable(){let e;return new Promise(i=>{e=this.isStable.subscribe({next:r=>{r&&i()}})}).finally(()=>{e.unsubscribe()})}_injector=c(qe);_rendererFactory=null;get injector(){return this._injector}bootstrap(e,i){return this.bootstrapImpl(e,i)}bootstrapImpl(e,i,r=K.NULL){return this._injector.get($).run(()=>{if(ze(Ae.BootstrapComponentStart),!this._injector.get(C_).done){let ae="";throw new H(405,ae)}let s=Sr(e),l=this._injector.get(Di),d=new Pa(s,l);this.componentTypes.push(e);let{hostElement:u,directives:h,bindings:_}=qA(i),v=u||d.selector,S=d.create(r,[],v,l.injector,h,_),A=S.location.nativeElement,oe=S.injector.get(S_,null);return oe?.registerApplication(A),S.onDestroy(()=>{this.detachView(S.hostView),Il(this.components,S),oe?.unregisterApplication(A)}),this._loadComponent(S),ze(Ae.BootstrapComponentEnd,S),S})}tick(){this.zonelessEnabled||(this.dirtyFlags|=1),this._tick()}_tick(){ze(Ae.ChangeDetectionStart),this.tracingSnapshot!==null?this.tracingSnapshot.run(zu.CHANGE_DETECTION,this.tickImpl):this.tickImpl()}tickImpl=()=>{if(this._runningTick)throw ze(Ae.ChangeDetectionEnd),new H(101,!1);let e=ce(null);try{this._runningTick=!0,this.synchronize()}finally{this._runningTick=!1,this.tracingSnapshot?.dispose(),this.tracingSnapshot=null,ce(e),this.afterTick.next(),ze(Ae.ChangeDetectionEnd)}};synchronize(){this._rendererFactory===null&&!this._injector.destroyed&&(this._rendererFactory=this._injector.get(It,null,{optional:!0}));let e=0;for(;this.dirtyFlags!==0&&e++<GA;){ze(Ae.ChangeDetectionSyncStart);try{this.synchronizeOnce()}finally{ze(Ae.ChangeDetectionSyncEnd)}}}synchronizeOnce(){this.dirtyFlags&16&&(this.dirtyFlags&=-17,this.rootEffectScheduler.flush());let e=!1;if(this.dirtyFlags&7){let i=!!(this.dirtyFlags&1);this.dirtyFlags&=-8,this.dirtyFlags|=8;for(let{_lView:r}of this.allViews){if(!i&&!yl(r))continue;let o=i&&!this.zonelessEnabled?0:1;mw(r,o),e=!0}if(this.dirtyFlags&=-5,this.syncDirtyFlagsWithViews(),this.dirtyFlags&23)return}e||(this._rendererFactory?.begin?.(),this._rendererFactory?.end?.()),this.dirtyFlags&8&&(this.dirtyFlags&=-9,this.afterRenderManager.execute()),this.syncDirtyFlagsWithViews()}syncDirtyFlagsWithViews(){if(this.allViews.some(({_lView:e})=>yl(e))){this.dirtyFlags|=2;return}else this.dirtyFlags&=-8}attachView(e){let i=e;this._views.push(i),i.attachToAppRef(this)}detachView(e){let i=e;Il(this._views,i),i.detachFromAppRef()}_loadComponent(e){this.attachView(e.hostView);try{this.tick()}catch(r){this.internalErrorHandler(r)}this.components.push(e),this._injector.get(Wl,[]).forEach(r=>r(e))}ngOnDestroy(){if(!this._destroyed)try{this._destroyListeners.forEach(e=>e()),this._views.slice().forEach(e=>e.destroy())}finally{this._destroyed=!0,this._views=[],this._destroyListeners=[]}}onDestroy(e){return this._destroyListeners.push(e),()=>Il(this._destroyListeners,e)}destroy(){if(this._destroyed)throw new H(406,!1);let e=this._injector;e.destroy&&!e.destroyed&&e.destroy()}get viewCount(){return this._views.length}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function qA(t){return t===void 0||typeof t=="string"||t instanceof Element?{hostElement:t}:t}function Il(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}function em(t,n){let e=le(),i=Gi();if(Cn(e,i,n)){let r=Qe(),o=Nr();if(Zu(o,r,e,t,n))wi(o)&&ow(e,o.index);else{let s=mn(o,e);aw(e[Ue],s,null,o.value,t,n,null)}}return em}function j(t,n,e,i){let r=le(),o=Gi();if(Cn(r,o,n)){let a=Qe(),s=Nr();mk(s,r,t,n,e,i)}return j}var Ig=class{destroy(n){}updateValue(n,e){}swap(n,e){let i=Math.min(n,e),r=Math.max(n,e),o=this.detach(r);if(r-i>1){let a=this.detach(i);this.attach(i,o),this.attach(r,a)}else this.attach(i,o)}move(n,e){this.attach(e,this.detach(n))}};function Xp(t,n,e,i,r){return t===e&&Object.is(n,i)?1:Object.is(r(t,n),r(e,i))?-1:0}function YA(t,n,e,i){let r,o,a=0,s=t.length-1,l=void 0;if(Array.isArray(n)){ce(i);let d=n.length-1;for(ce(null);a<=s&&a<=d;){let u=t.at(a),h=n[a],_=Xp(a,u,a,h,e);if(_!==0){_<0&&t.updateValue(a,h),a++;continue}let v=t.at(s),S=n[d],A=Xp(s,v,d,S,e);if(A!==0){A<0&&t.updateValue(s,S),s--,d--;continue}let oe=e(a,u),ae=e(s,v),Ke=e(a,h);if(Object.is(Ke,ae)){let kt=e(d,S);Object.is(kt,oe)?(t.swap(a,s),t.updateValue(s,S),d--,s--):t.move(s,a),t.updateValue(a,h),a++;continue}if(r??=new Lu,o??=Z0(t,a,s,e),Ng(t,r,a,Ke))t.updateValue(a,h),a++,s++;else if(o.has(Ke))r.set(oe,t.detach(a)),s--;else{let kt=t.create(a,n[a]);t.attach(a,kt),a++,s++}}for(;a<=d;)Y0(t,r,e,a,n[a]),a++}else if(n!=null){ce(i);let d=n[Symbol.iterator]();ce(null);let u=d.next();for(;!u.done&&a<=s;){let h=t.at(a),_=u.value,v=Xp(a,h,a,_,e);if(v!==0)v<0&&t.updateValue(a,_),a++,u=d.next();else{r??=new Lu,o??=Z0(t,a,s,e);let S=e(a,_);if(Ng(t,r,a,S))t.updateValue(a,_),a++,s++,u=d.next();else if(!o.has(S))t.attach(a,t.create(a,_)),a++,s++,u=d.next();else{let A=e(a,h);r.set(A,t.detach(a)),s--}}}for(;!u.done;)Y0(t,r,e,t.length,u.value),u=d.next()}for(;a<=s;)t.destroy(t.detach(s--));r?.forEach(d=>{t.destroy(d)})}function Ng(t,n,e,i){return n!==void 0&&n.has(i)?(t.attach(e,n.get(i)),n.delete(i),!0):!1}function Y0(t,n,e,i,r){if(Ng(t,n,i,e(i,r)))t.updateValue(i,r);else{let o=t.create(i,r);t.attach(i,o)}}function Z0(t,n,e,i){let r=new Set;for(let o=n;o<=e;o++)r.add(i(o,t.at(o)));return r}var Lu=class{kvMap=new Map;_vMap=void 0;has(n){return this.kvMap.has(n)}delete(n){if(!this.has(n))return!1;let e=this.kvMap.get(n);return this._vMap!==void 0&&this._vMap.has(e)?(this.kvMap.set(n,this._vMap.get(e)),this._vMap.delete(e)):this.kvMap.delete(n),!0}get(n){return this.kvMap.get(n)}set(n,e){if(this.kvMap.has(n)){let i=this.kvMap.get(n);this._vMap===void 0&&(this._vMap=new Map);let r=this._vMap;for(;r.has(i);)i=r.get(i);r.set(i,e)}else this.kvMap.set(n,e)}forEach(n){for(let[e,i]of this.kvMap)if(n(i,e),this._vMap!==void 0){let r=this._vMap;for(;r.has(i);)i=r.get(i),n(i,e)}}};function D(t,n,e,i,r,o,a,s){Ki("NgControlFlow");let l=le(),d=Qe(),u=yn(d.consts,o);return Fa(l,d,t,n,e,i,r,u,256,a,s),x_}function x_(t,n,e,i,r,o,a,s){Ki("NgControlFlow");let l=le(),d=Qe(),u=yn(d.consts,o);return Fa(l,d,t,n,e,i,r,u,512,a,s),x_}function E(t,n){Ki("NgControlFlow");let e=le(),i=Gi(),r=e[i]!==nn?e[i]:-1,o=r!==-1?ju(e,vt+r):void 0,a=0;if(Cn(e,i,t)){let s=ce(null);try{if(o!==void 0&&vw(o,a),t!==-1){let l=vt+t,d=ju(e,l),u=Rg(e[re],l),h=yw(d,u,e),_=Hl(e,u,n,{dehydratedView:h});Ul(d,_,a,Oa(u,h))}}finally{ce(s)}}else if(o!==void 0){let s=_w(o,a);s!==void 0&&(s[St]=n)}}var Tg=class{lContainer;$implicit;$index;constructor(n,e,i){this.lContainer=n,this.$implicit=e,this.$index=i}get $count(){return this.lContainer.length-ht}};function Ha(t){return t}function Ua(t,n){return n}var kg=class{hasEmptyBlock;trackByFn;liveCollection;constructor(n,e,i){this.hasEmptyBlock=n,this.trackByFn=e,this.liveCollection=i}};function nt(t,n,e,i,r,o,a,s,l,d,u,h,_){Ki("NgControlFlow");let v=le(),S=Qe(),A=l!==void 0,oe=le(),ae=s?a.bind(oe[tn][St]):a,Ke=new kg(A,ae);oe[vt+t]=Ke,Fa(v,S,t+1,n,e,i,r,yn(S.consts,o),256),A&&Fa(v,S,t+2,l,d,u,h,yn(S.consts,_),512)}var Ag=class extends Ig{lContainer;hostLView;templateTNode;operationsCounter=void 0;needsIndexUpdate=!1;constructor(n,e,i){super(),this.lContainer=n,this.hostLView=e,this.templateTNode=i}get length(){return this.lContainer.length-ht}at(n){return this.getLView(n)[St].$implicit}attach(n,e){let i=e[wo];this.needsIndexUpdate||=n!==this.length,Ul(this.lContainer,e,n,Oa(this.templateTNode,i)),ZA(this.lContainer,n)}detach(n){return this.needsIndexUpdate||=n!==this.length-1,QA(this.lContainer,n),XA(this.lContainer,n)}create(n,e){let i=Iu(this.lContainer,this.templateTNode.tView.ssrId);return Hl(this.hostLView,this.templateTNode,new Tg(this.lContainer,e,n),{dehydratedView:i})}destroy(n){Gu(n[re],n)}updateValue(n,e){this.getLView(n)[St].$implicit=e}reset(){this.needsIndexUpdate=!1}updateIndexes(){if(this.needsIndexUpdate)for(let n=0;n<this.length;n++)this.getLView(n)[St].$index=n}getLView(n){return KA(this.lContainer,n)}};function it(t){let n=ce(null),e=Jn();try{let i=le(),r=i[re],o=i[e],a=e+1,s=ju(i,a);if(o.liveCollection===void 0){let d=Rg(r,a);o.liveCollection=new Ag(s,i,d)}else o.liveCollection.reset();let l=o.liveCollection;if(YA(l,t,o.trackByFn,n),l.updateIndexes(),o.hasEmptyBlock){let d=Gi(),u=l.length===0;if(Cn(i,d,u)){let h=e+2,_=ju(i,h);if(u){let v=Rg(r,h),S=yw(_,v,i),A=Hl(i,v,void 0,{dehydratedView:S});Ul(_,A,0,Oa(v,S))}else r.firstUpdatePass&&Fk(_),vw(_,0)}}}finally{ce(n)}}function ju(t,n){return t[n]}function ZA(t,n){if(t.length<=ht)return;let e=ht+n,i=t[e],r=i?i[Ci]:void 0;if(i&&r&&r.detachedLeaveAnimationFns&&r.detachedLeaveAnimationFns.length>0){let o=i[vi];jT(o,r),Ar.delete(i[yi]),r.detachedLeaveAnimationFns=void 0}}function QA(t,n){if(t.length<=ht)return;let e=ht+n,i=t[e],r=i?i[Ci]:void 0;r&&r.leave&&r.leave.size>0&&(r.detachedLeaveAnimationFns=[])}function XA(t,n){return Al(t,n)}function KA(t,n){return _w(t,n)}function Rg(t,n){return eu(t,n)}function M(t,n,e){let i=le(),r=Gi();if(Cn(i,r,n)){let o=Qe(),a=Nr();iw(a,i,t,n,i[Ue],e)}return M}function Og(t,n,e,i,r){Zu(n,t,e,r?"class":"style",i)}function m(t,n,e,i){let r=le(),o=r[re],a=t+vt,s=o.firstCreatePass?h_(a,r,2,n,s_,ru(),e,i):o.data[a];if(wi(s)){let l=r[Xn].tracingService;if(l&&l.componentCreate){let d=o.data[s.directiveStart+s.componentOffset];return l.componentCreate(Sw(d),()=>(Q0(t,n,r,s,i),m))}}return Q0(t,n,r,s,i),m}function Q0(t,n,e,i,r){if(l_(i,e,t,n,Ww),Da(i)){let o=e[re];Yu(o,e,i),Ug(o,i,e)}r!=null&&Bl(e,i)}function f(){let t=Qe(),n=Mt(),e=c_(n);return t.firstCreatePass&&p_(t,e),Ap(e)&&Rp(),Tp(),e.classesWithoutHost!=null&&bN(e)&&Og(t,e,le(),e.classesWithoutHost,!0),e.stylesWithoutHost!=null&&yN(e)&&Og(t,e,le(),e.stylesWithoutHost,!1),f}function V(t,n,e,i){return m(t,n,e,i),f(),V}function Ve(t,n,e,i){let r=le(),o=r[re],a=t+vt,s=o.firstCreatePass?oA(a,o,2,n,e,i):o.data[a];return l_(s,r,t,n,Ww),i!=null&&Bl(r,s),Ve}function Xe(){let t=Mt(),n=c_(t);return Ap(n)&&Rp(),Tp(),Xe}function xt(t,n,e,i){return Ve(t,n,e,i),Xe(),xt}var Ww=(t,n,e,i,r)=>(Sl(!0),LC(n[Ue],i,Bp()));function D_(t,n,e){let i=le(),r=i[re],o=t+vt,a=r.firstCreatePass?h_(o,i,8,"ng-container",s_,ru(),n,e):r.data[o];if(l_(a,i,t,"ng-container",JA),Da(a)){let s=i[re];Yu(s,i,a),Ug(s,a,i)}return e!=null&&Bl(i,a),D_}function E_(){let t=Qe(),n=Mt(),e=c_(n);return t.firstCreatePass&&p_(t,e),E_}function za(t,n,e){return D_(t,n,e),E_(),za}var JA=(t,n,e,i,r)=>(Sl(!0),mT(n[Ue],""));function se(){return le()}function Gt(t,n,e){let i=le(),r=Gi();if(Cn(i,r,n)){let o=Qe(),a=Nr();rw(a,i,t,n,i[Ue],e)}return Gt}var Gl="en-US";var eR=Gl;function Gw(t){typeof t=="string"&&(eR=t.toLowerCase().replace(/_/g,"-"))}function w(t,n,e){let i=le(),r=Qe(),o=Mt();return qw(r,i,i[Ue],o,t,n,e),w}function $a(t,n,e){let i=le(),r=Qe(),o=Mt();return(o.type&3||e)&&f_(o,r,i,e,i[Ue],t,n,ko(o,i,n)),$a}function qw(t,n,e,i,r,o,a){let s=!0,l=null;if((i.type&3||a)&&(l??=ko(i,n,o),f_(i,t,n,a,e,r,o,l)&&(s=!1)),s){let d=i.outputs?.[r],u=i.hostDirectiveOutputs?.[r];if(u&&u.length)for(let h=0;h<u.length;h+=2){let _=u[h],v=u[h+1];l??=ko(i,n,o),Tu(i,n,_,v,r,l)}if(d&&d.length)for(let h of d)l??=ko(i,n,o),Tu(i,n,h,r,r,l)}}function b(t=1){return r0(t)}function tR(t,n){let e=null,i=DT(t);for(let r=0;r<n.length;r++){let o=n[r];if(o==="*"){e=r;continue}if(i===null?WC(t,o,!0):IT(i,o))return r}return e}function ve(t){let n=le()[tn][Ut];if(!n.projection){let e=t?t.length:1,i=n.projection=Ty(e,null),r=i.slice(),o=n.child;for(;o!==null;){if(o.type!==128){let a=t?tR(o,t):0;a!==null&&(r[a]?r[a].projectionNext=o:i[a]=o,r[a]=o)}o=o.next}}}function B(t,n=0,e,i,r,o){let a=le(),s=Qe(),l=i?t+1:null;l!==null&&Fa(a,s,l,i,r,o,null,e);let d=Va(s,vt+t,16,null,e||null);d.projection===null&&(d.projection=n),Fp();let h=!a[wo]||kp();a[tn][Ut].projection[d.projection]===null&&l!==null?nR(a,s,l):h&&!Hu(d)&&JT(s,a,d)}function nR(t,n,e){let i=vt+e,r=n.data[i],o=t[i],a=Iu(o,r.tView.ssrId),s=Hl(t,r,void 0,{dehydratedView:a});Ul(o,s,0,Oa(r,a))}function dt(t,n,e,i){return Ow(t,n,e,i),dt}function Te(t,n,e){return Rw(t,n,e),Te}function U(t){let n=le(),e=Qe(),i=lu();Cl(i+1);let r=__(e,i);if(t.dirty&&By(n)===((r.metadata.flags&2)===2)){if(r.matches===null)t.reset([]);else{let o=Fw(n,i);t.reset(o,vC),t.notifyOnChanges()}return!0}return!1}function z(){return g_(le(),lu())}function tm(t,n,e,i,r){return jw(n,Ow(t,e,i,r)),tm}function nm(t,n,e,i){return jw(t,Rw(n,e,i)),nm}function im(t=1){Cl(lu()+t)}function rt(t){let n=Yy();return Vy(n,vt+t)}function bu(t,n){return t<<17|n<<2}function Oo(t){return t>>17&32767}function iR(t){return(t&2)==2}function rR(t,n){return t&131071|n<<17}function Pg(t){return t|2}function La(t){return(t&131068)>>2}function Kp(t,n){return t&-131069|n<<2}function oR(t){return(t&1)===1}function Fg(t){return t|1}function aR(t,n,e,i,r,o){let a=o?n.classBindings:n.styleBindings,s=Oo(a),l=La(a);t[i]=e;let d=!1,u;if(Array.isArray(e)){let h=e;u=h[1],(u===null||ya(h,u)>0)&&(d=!0)}else u=e;if(r)if(l!==0){let _=Oo(t[s+1]);t[i+1]=bu(_,s),_!==0&&(t[_+1]=Kp(t[_+1],i)),t[s+1]=rR(t[s+1],i)}else t[i+1]=bu(s,0),s!==0&&(t[s+1]=Kp(t[s+1],i)),s=i;else t[i+1]=bu(l,0),s===0?s=i:t[l+1]=Kp(t[l+1],i),l=i;d&&(t[i+1]=Pg(t[i+1])),X0(t,u,i,!0),X0(t,u,i,!1),sR(n,u,t,i,o),a=bu(s,l),o?n.classBindings=a:n.styleBindings=a}function sR(t,n,e,i,r){let o=r?t.residualClasses:t.residualStyles;o!=null&&typeof n=="string"&&ya(o,n)>=0&&(e[i+1]=Fg(e[i+1]))}function X0(t,n,e,i){let r=t[e+1],o=n===null,a=i?Oo(r):La(r),s=!1;for(;a!==0&&(s===!1||o);){let l=t[a],d=t[a+1];lR(l,n)&&(s=!0,t[a+1]=i?Fg(d):Pg(d)),a=i?Oo(d):La(d)}s&&(t[e+1]=i?Pg(r):Fg(r))}function lR(t,n){return t===null||n==null||(Array.isArray(t)?t[1]:t)===n?!0:Array.isArray(t)&&typeof n=="string"?ya(t,n)>=0:!1}var ti={textEnd:0,key:0,keyEnd:0,value:0,valueEnd:0};function cR(t){return t.substring(ti.key,ti.keyEnd)}function dR(t){return uR(t),Yw(t,Zw(t,0,ti.textEnd))}function Yw(t,n){let e=ti.textEnd;return e===n?-1:(n=ti.keyEnd=mR(t,ti.key=n,e),Zw(t,n,e))}function uR(t){ti.key=0,ti.keyEnd=0,ti.value=0,ti.valueEnd=0,ti.textEnd=t.length}function Zw(t,n,e){for(;n<e&&t.charCodeAt(n)<=32;)n++;return n}function mR(t,n,e){for(;n<e&&t.charCodeAt(n)>32;)n++;return n}function jt(t,n,e){return Qw(t,n,e,!1),jt}function N(t,n){return Qw(t,n,null,!0),N}function et(t){hR(yR,fR,t,!0)}function fR(t,n){for(let e=dR(n);e>=0;e=Yw(n,e))Qd(t,cR(n),!0)}function Qw(t,n,e,i){let r=le(),o=Qe(),a=au(2);if(o.firstUpdatePass&&Kw(o,t,a,i),n!==nn&&Cn(r,a,n)){let s=o.data[Jn()];Jw(o,s,r,r[Ue],t,r[a+1]=wR(n,e),i,a)}}function hR(t,n,e,i){let r=Qe(),o=au(2);r.firstUpdatePass&&Kw(r,null,o,i);let a=le();if(e!==nn&&Cn(a,o,e)){let s=r.data[Jn()];if(eS(s,i)&&!Xw(r,o)){let l=i?s.classesWithoutHost:s.stylesWithoutHost;l!==null&&(e=$d(l,e||"")),Og(r,s,a,e,i)}else CR(r,s,a,a[Ue],a[o+1],a[o+1]=bR(t,n,e),i,o)}}function Xw(t,n){return n>=t.expandoStartIndex}function Kw(t,n,e,i){let r=t.data;if(r[e+1]===null){let o=r[Jn()],a=Xw(t,e);eS(o,i)&&n===null&&!a&&(n=!1),n=pR(r,o,n,i),aR(r,o,n,e,a,i)}}function pR(t,n,e,i){let r=e0(t),o=i?n.residualClasses:n.residualStyles;if(r===null)(i?n.classBindings:n.styleBindings)===0&&(e=Jp(null,t,n,e,i),e=Ol(e,n.attrs,i),o=null);else{let a=n.directiveStylingLast;if(a===-1||t[a]!==r)if(e=Jp(r,t,n,e,i),o===null){let l=gR(t,n,i);l!==void 0&&Array.isArray(l)&&(l=Jp(null,t,n,l[1],i),l=Ol(l,n.attrs,i),_R(t,n,i,l))}else o=vR(t,n,i)}return o!==void 0&&(i?n.residualClasses=o:n.residualStyles=o),e}function gR(t,n,e){let i=e?n.classBindings:n.styleBindings;if(La(i)!==0)return t[Oo(i)]}function _R(t,n,e,i){let r=e?n.classBindings:n.styleBindings;t[Oo(r)]=i}function vR(t,n,e){let i,r=n.directiveEnd;for(let o=1+n.directiveStylingLast;o<r;o++){let a=t[o].hostAttrs;i=Ol(i,a,e)}return Ol(i,n.attrs,e)}function Jp(t,n,e,i,r){let o=null,a=e.directiveEnd,s=e.directiveStylingLast;for(s===-1?s=e.directiveStart:s++;s<a&&(o=n[s],i=Ol(i,o.hostAttrs,r),o!==t);)s++;return t!==null&&(e.directiveStylingLast=s),i}function Ol(t,n,e){let i=e?1:2,r=-1;if(n!==null)for(let o=0;o<n.length;o++){let a=n[o];typeof a=="number"?r=a:r===i&&(Array.isArray(t)||(t=t===void 0?[]:["",t]),Qd(t,a,e?!0:n[++o]))}return t===void 0?null:t}function bR(t,n,e){if(e==null||e==="")return Wt;let i=[],r=Pn(e);if(Array.isArray(r))for(let o=0;o<r.length;o++)t(i,r[o],!0);else if(r instanceof Set)for(let o of r)t(i,o,!0);else if(typeof r=="object")for(let o in r)Object.hasOwn(r,o)&&t(i,o,r[o]);else typeof r=="string"&&n(i,r);return i}function yR(t,n,e){let i=String(n);i!==""&&!i.includes(" ")&&Qd(t,i,e)}function CR(t,n,e,i,r,o,a,s){r===nn&&(r=Wt);let l=0,d=0,u=0<r.length?r[0]:null,h=0<o.length?o[0]:null;for(;u!==null||h!==null;){let _=l<r.length?r[l+1]:void 0,v=d<o.length?o[d+1]:void 0,S=null,A;u===h?(l+=2,d+=2,_!==v&&(S=h,A=v)):h===null||u!==null&&u<h?(l+=2,S=u):(d+=2,S=h,A=v),S!==null&&Jw(t,n,e,i,S,A,a,s),u=l<r.length?r[l]:null,h=d<o.length?o[d]:null}}function Jw(t,n,e,i,r,o,a,s){if(!(n.type&3))return;let l=t.data,d=l[s+1],u=oR(d)?K0(l,n,e,r,La(d),a):void 0;if(!Vu(u)){Vu(o)||iR(d)&&(o=K0(l,null,e,r,s,a));let h=Dp(Jn(),e);tk(i,a,h,r,o)}}function K0(t,n,e,i,r,o){let a=n===null,s;for(;r>0;){let l=t[r],d=Array.isArray(l),u=d?l[1]:l,h=u===null,_=e[r+1];_===nn&&(_=h?Wt:void 0);let v=h?Xd(_,i):u===i?_:void 0;if(d&&!Vu(v)&&(v=Xd(l,i)),Vu(v)&&(s=v,a))return s;let S=t[r+1];r=a?Oo(S):La(S)}if(n!==null){let l=o?n.residualClasses:n.residualStyles;l!=null&&(s=Xd(l,i))}return s}function Vu(t){return t!==void 0}function wR(t,n){return t==null||t===""||(typeof n=="string"?t=Pn(t)+n:typeof t=="object"&&(t=ml(Pn(t)))),t}function eS(t,n){return(t.flags&(n?8:16))!==0}function g(t,n=""){let e=le(),i=Qe(),r=t+vt,o=i.firstCreatePass?Va(i,r,1,n,null):i.data[r],a=SR(i,e,o,n);e[r]=a,uu()&&n_(i,e,a,o),Ma(o,!1)}var SR=(t,n,e,i)=>(Sl(!0),dT(n[Ue],i));function xR(t,n,e,i=""){return Cn(t,Gi(),e)?n+ba(e)+i:nn}function DR(t,n,e,i,r,o=""){let a=Zy(),s=xw(t,a,e,r);return au(2),s?n+ba(e)+i+ba(r)+o:nn}function k(t){return ut("",t),k}function ut(t,n,e){let i=le(),r=xR(i,t,n,e);return r!==nn&&tS(i,Jn(),r),ut}function Wa(t,n,e,i,r){let o=le(),a=DR(o,t,n,e,i,r);return a!==nn&&tS(o,Jn(),a),Wa}function tS(t,n,e){let i=Dp(n,t);uT(t[Ue],i,e)}function oi(t,n,e){pu(n)&&(n=n());let i=le(),r=Gi();if(Cn(i,r,n)){let o=Qe(),a=Nr();iw(a,i,t,n,i[Ue],e)}return oi}function Mi(t,n){let e=pu(t);return e&&t.set(n),e}function ai(t,n){let e=le(),i=Qe(),r=Mt();return qw(i,e,e[Ue],r,t,n),ai}function J0(t,n,e){let i=Qe();i.firstCreatePass&&nS(n,i.data,i.blueprint,Kn(t),e)}function nS(t,n,e,i,r){if(t=At(t),Array.isArray(t))for(let o=0;o<t.length;o++)nS(t[o],n,e,i,r);else{let o=Qe(),a=le(),s=Mt(),l=vo(t)?t:At(t.provide),d=yp(t),u=s.providerIndexes&1048575,h=s.directiveStart,_=s.providerIndexes>>20;if(vo(t)||!t.multi){let v=new Ao(d,r,ne,null),S=tg(l,n,r?u:u+_,h);S===-1?(rg(Mu(s,a),o,l),eg(o,t,n.length),n.push(l),s.directiveStart++,s.directiveEnd++,r&&(s.providerIndexes+=1048576),e.push(v),a.push(v)):(e[S]=v,a[S]=v)}else{let v=tg(l,n,u+_,h),S=tg(l,n,u,u+_),A=v>=0&&e[v],oe=S>=0&&e[S];if(r&&!oe||!r&&!A){rg(Mu(s,a),o,l);let ae=IR(r?MR:ER,e.length,r,i,d,t);!r&&oe&&(e[S].providerFactory=ae),eg(o,t,n.length,0),n.push(l),s.directiveStart++,s.directiveEnd++,r&&(s.providerIndexes+=1048576),e.push(ae),a.push(ae)}else{let ae=iS(e[r?S:v],d,!r&&i);eg(o,t,v>-1?v:S,ae)}!r&&i&&oe&&e[S].componentProviders++}}}function eg(t,n,e,i){let r=vo(n),o=Py(n);if(r||o){let l=(o?At(n.useClass):n).prototype.ngOnDestroy;if(l){let d=t.destroyHooks||(t.destroyHooks=[]);if(!r&&n.multi){let u=d.indexOf(e);u===-1?d.push(e,[i,l]):d[u+1].push(i,l)}else d.push(e,l)}}}function iS(t,n,e){return e&&t.componentProviders++,t.multi.push(n)-1}function tg(t,n,e,i){for(let r=e;r<i;r++)if(n[r]===t)return r;return-1}function ER(t,n,e,i,r){return Lg(this.multi,[])}function MR(t,n,e,i,r){let o=this.multi,a;if(this.providerFactory){let s=this.providerFactory.componentProviders,l=Nl(i,i[re],this.providerFactory.index,r);a=l.slice(0,s),Lg(o,a);for(let d=s;d<l.length;d++)a.push(l[d])}else a=[],Lg(o,a);return a}function Lg(t,n){for(let e=0;e<t.length;e++){let i=t[e];n.push(i())}return n}function IR(t,n,e,i,r,o){let a=new Ao(t,e,ne,null);return a.multi=[],a.index=n,a.componentProviders=0,iS(a,r,i&&!e),a}function Ie(t,n){return e=>{e.providersResolver=(i,r)=>J0(i,r?r(t):t,!1),n&&(e.viewProvidersResolver=(i,r)=>J0(i,r?r(n):n,!0))}}function ql(t,n){let e=ou()+t,i=le();return i[e]===nn?m_(i,e,n()):Hk(i,e)}function Fo(t,n,e){return NR(le(),ou(),t,n,e)}function Yl(t,n,e,i){return TR(le(),ou(),t,n,e,i)}function rS(t,n){let e=t[n];return e===nn?void 0:e}function NR(t,n,e,i,r,o){let a=n+e;return Cn(t,a,r)?m_(t,a+1,o?i.call(o,r):i(r)):rS(t,a+1)}function TR(t,n,e,i,r,o,a){let s=n+e;return xw(t,s,r,o)?m_(t,s+2,a?i.call(a,r,o):i(r,o)):rS(t,s+2)}function Ga(t,n){return Qu(t,n)}var oS=(()=>{class t{applicationErrorHandler=c(On);appRef=c(rn);taskService=c(qi);ngZone=c($);zonelessEnabled=c(Dl);tracing=c(Ei,{optional:!0});zoneIsDefined=typeof Zone<"u"&&!!Zone.root.run;schedulerTickApplyArgs=[{data:{__scheduler_tick__:!0}}];subscriptions=new ue;angularZoneId=this.zoneIsDefined?this.ngZone._inner?.get(dl):null;scheduleInRootZone=!this.zonelessEnabled&&this.zoneIsDefined&&(c(Wp,{optional:!0})??!1);cancelScheduledCallback=null;useMicrotaskScheduler=!1;runningTick=!1;pendingRenderTaskId=null;constructor(){this.subscriptions.add(this.appRef.afterTick.subscribe(()=>{let e=this.taskService.add();if(!this.runningTick&&(this.cleanup(),!this.zonelessEnabled||this.appRef.includeAllTestViews)){this.taskService.remove(e);return}this.switchToMicrotaskScheduler(),this.taskService.remove(e)})),this.subscriptions.add(this.ngZone.onUnstable.subscribe(()=>{this.runningTick||this.cleanup()}))}switchToMicrotaskScheduler(){this.ngZone.runOutsideAngular(()=>{let e=this.taskService.add();this.useMicrotaskScheduler=!0,queueMicrotask(()=>{this.useMicrotaskScheduler=!1,this.taskService.remove(e)})})}notify(e){if(!this.zonelessEnabled&&e===5)return;switch(e){case 0:case 2:{this.appRef.dirtyFlags|=2;break}case 3:case 4:case 5:case 1:{this.appRef.dirtyFlags|=4;break}case 6:{this.appRef.dirtyFlags|=2;break}case 12:{this.appRef.dirtyFlags|=16;break}case 13:{this.appRef.dirtyFlags|=2;break}case 11:break;default:this.appRef.dirtyFlags|=8}if(this.appRef.tracingSnapshot=this.tracing?.snapshot(this.appRef.tracingSnapshot)??null,!this.shouldScheduleTick())return;let i=this.useMicrotaskScheduler?l0:Up;this.pendingRenderTaskId=this.taskService.add(),this.scheduleInRootZone?this.cancelScheduledCallback=Zone.root.run(()=>i(()=>this.tick())):this.cancelScheduledCallback=this.ngZone.runOutsideAngular(()=>i(()=>this.tick()))}shouldScheduleTick(){return!(this.appRef.destroyed||this.pendingRenderTaskId!==null||this.runningTick||this.appRef._runningTick||!this.zonelessEnabled&&this.zoneIsDefined&&Zone.current.get(dl+this.angularZoneId))}tick(){if(this.runningTick||this.appRef.destroyed)return;if(this.appRef.dirtyFlags===0){this.cleanup();return}!this.zonelessEnabled&&this.appRef.dirtyFlags&7&&(this.appRef.dirtyFlags|=1);let e=this.taskService.add();try{this.ngZone.run(()=>{this.runningTick=!0,this.appRef._tick()},void 0,this.schedulerTickApplyArgs)}catch(i){this.applicationErrorHandler(i)}finally{this.taskService.remove(e),this.cleanup()}}ngOnDestroy(){this.subscriptions.unsubscribe(),this.cleanup()}cleanup(){if(this.runningTick=!1,this.cancelScheduledCallback?.(),this.cancelScheduledCallback=null,this.pendingRenderTaskId!==null){let e=this.pendingRenderTaskId;this.pendingRenderTaskId=null,this.taskService.remove(e)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function aS(){return[{provide:gi,useExisting:oS},{provide:$,useClass:ul},{provide:Dl,useValue:!0}]}var M_=(()=>{class t{compileModuleSync(e){return new Fu(e)}compileModuleAsync(e){return Promise.resolve(this.compileModuleSync(e))}clearCache(){}clearCacheFor(e){}getModuleId(e){}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function kR(){return typeof $localize<"u"&&$localize.locale||Gl}var rm=new C("",{factory:()=>c(rm,{optional:!0,skipSelf:!0})||kR()});function ke(t,n){return Ks(t,n?.equal)}function Ee(t){return Ub(t)}var sS=class t extends Error{_brand;constructor(n){super(n)}static IDLE=new t("IDLE");static LOADING=new t("LOADING")},AR=t=>t;function om(t,n){if(typeof t=="function"){let e=Rh(t,AR,n?.equal);return lS(e,n?.debugName,n?.set)}else{let e=Rh(t.source,t.computation,t.equal);return lS(e,t.debugName,t.set)}}function lS(t,n,e){let i=t[gt],r=t;if(e!==void 0){let o=a=>Oh(i,a);r.set=a=>e(a,o),r.update=a=>e(a(Ee(t)),o)}else r.set=o=>Oh(i,o),r.update=o=>Hb(i,o);return r.asReadonly=mu.bind(t),r}function hS(t,n){let e=Object.create(nC);e.value=t,e.transformFn=n?.transform;function i(){if(gr(e),e.value===Bu){let r=null;throw new H(-950,r)}return e.value}return i[gt]=e,i}var wn=class{attributeName;constructor(n){this.attributeName=n}__NG_ELEMENT_ID__=()=>Fl(this.attributeName);toString(){return`HostAttributeToken ${this.attributeName}`}};function k_(t){return ZR(t)?t.default:t}function ZR(t){return t&&typeof t=="object"&&"default"in t}function cS(t,n){return hS(t,n)}function QR(t){return hS(Bu,t)}var Lo=(cS.required=QR,cS);function dS(t,n){return v_(n)}function XR(t,n){return b_(n)}var Ql=(dS.required=XR,dS);function uS(t,n){return v_(n)}function KR(t,n){return b_(n)}var pS=(uS.required=KR,uS);var JR=1e4;var uZ=JR-1e3;var Me=(()=>{class t{static __NG_ELEMENT_ID__=e1}return t})();function e1(t){return t1(Mt(),le(),(t&16)===16)}function t1(t,n,e){if(wi(t)&&!e){let i=Rn(t.index,n);return new Rr(i,i)}else if(t.type&175){let i=n[tn];return new Rr(i,n)}return null}var N_=new C(""),n1=new C("");function Zl(t){return!t.moduleRef}function i1(t){let n=Zl(t)?t.r3Injector:t.moduleRef.injector,e=n.get($);return e.run(()=>{Zl(t)?t.r3Injector.resolveInjectorInitializers():t.moduleRef.resolveInjectorInitializers();let i=n.get(On),r;if(e.runOutsideAngular(()=>{r=e.onError.subscribe({next:i})}),Zl(t)){let o=()=>n.destroy(),a=t.platformInjector.get(N_);a.add(o),n.onDestroy(()=>{r.unsubscribe(),a.delete(o)})}else{let o=()=>t.moduleRef.destroy(),a=t.platformInjector.get(N_);a.add(o),t.moduleRef.onDestroy(()=>{Il(t.allPlatformModules,t.moduleRef),r.unsubscribe(),a.delete(o)})}return o1(i,e,()=>{let o=n.get(qi),a=o.add(),s=n.get(C_);return s.runInitializers(),s.donePromise.then(()=>{let l=n.get(rm,Gl);if(Gw(l||Gl),!n.get(n1,!0))return Zl(t)?n.get(rn):(t.allPlatformModules.push(t.moduleRef),t.moduleRef);if(Zl(t)){let u=n.get(rn);return t.rootComponent!==void 0&&u.bootstrap(t.rootComponent),u}else return r1?.(t.moduleRef,t.allPlatformModules),t.moduleRef}).finally(()=>{o.remove(a)})})})}var r1;function o1(t,n,e){try{let i=e();return Ji(i)?i.catch(r=>{throw n.runOutsideAngular(()=>t(r)),r}):i}catch(i){throw n.runOutsideAngular(()=>t(i)),i}}var am=null;function a1(t=[],n){return K.create({name:n,providers:[{provide:vl,useValue:"platform"},{provide:N_,useValue:new Set([()=>am=null])},...t]})}function s1(t=[]){if(am)return am;let n=a1(t);return am=n,$w(),l1(n),n}function l1(t){let n=t.get(fu,null);Ot(t,()=>{n?.forEach(e=>e())})}function gS(t){let{rootComponent:n,appProviders:e,platformProviders:i,platformRef:r}=t;ze(Ae.BootstrapApplicationStart);try{let o=r?.injector??s1(i),a=[aS(),d0,...e||[]],s=new Rl({providers:a,parent:o,debugName:"",runEnvironmentInitializers:!1});return i1({r3Injector:s.injector,platformInjector:o,rootComponent:n})}catch(o){return Promise.reject(o)}finally{ze(Ae.BootstrapApplicationEnd)}}function Y(t){return typeof t=="boolean"?t:t!=null&&t!=="false"}function Nt(t,n=NaN){return!isNaN(parseFloat(t))&&!isNaN(Number(t))?Number(t):n}var I_=Symbol("NOT_SET"),_S=new Set,c1=J(y({},ca),{kind:"afterRenderEffectPhase",consumerIsAlwaysLive:!0,consumerAllowSignalWrites:!0,value:I_,cleanup:null,consumerMarkedDirty(){if(this.sequence.impl.executing){if(this.sequence.lastPhase===null||this.sequence.lastPhase<this.phase)return;this.sequence.erroredOrDestroyed=!0}this.sequence.scheduler.notify(7)},phaseFn(t){if(this.sequence.lastPhase=this.phase,!this.dirty)return this.signal;if(this.dirty=!1,this.value!==I_&&!sa(this))return this.signal;try{for(let r of this.cleanup??_S)r()}finally{this.cleanup?.clear()}let n=[];t!==void 0&&n.push(t),n.push(this.registerCleanupFn);let e=Li(this),i;try{i=this.userFn.apply(null,n)}finally{_r(this,e)}return(this.value===I_||!this.equal(this.value,i))&&(this.value=i,this.version++),this.signal}}),T_=class extends Tl{scheduler;lastPhase=null;nodes=[void 0,void 0,void 0,void 0];onDestroyFns=null;constructor(n,e,i,r,o,a=null){super(n,[void 0,void 0,void 0,void 0],i,!1,o.get(Je),a),this.scheduler=r;for(let s of Kg){let l=e[s];if(l===void 0)continue;let d=Object.create(c1);d.sequence=this,d.phase=s,d.userFn=l,d.dirty=!0,d.signal=()=>(gr(d),d.value),d.signal[gt]=d,d.registerCleanupFn=u=>(d.cleanup??=new Set).add(u),this.nodes[s]=d,this.hooks[s]=u=>d.phaseFn(u)}}afterRun(){super.afterRun(),this.lastPhase=null}destroy(){if(this.onDestroyFns!==null)for(let n of this.onDestroyFns)n();super.destroy();for(let n of this.nodes)if(n)try{for(let e of n.cleanup??_S)e()}finally{vr(n)}}};function A_(t,n){let e=n?.injector??c(K),i=e.get(gi),r=e.get($u),o=e.get(Ei,null,{optional:!0});r.impl??=e.get(Jg);let a=t;typeof a=="function"&&(a={mixedReadWrite:t});let s=e.get(Ia,null,{optional:!0}),l=new T_(r.impl,[a.earlyRead,a.write,a.mixedReadWrite,a.read],s?.view,i,e,o?.snapshot(null));return r.impl.register(l),l}function sm(t,n){let e=Sr(t),i=n.elementInjector||wa();return new Pa(e).create(i,n.projectableNodes,n.hostElement,n.environmentInjector,n.directives,n.bindings)}var vS=null;function Fn(){return vS}function R_(t){vS??=t}var Xl=class{},qa=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(i){return new(i||t)};static \u0275prov=fe({token:t,factory:()=>c(bS),providedIn:"platform"})}return t})();var bS=(()=>{class t extends qa{_location;_history;_doc=c(X);constructor(){super(),this._location=window.location,this._history=window.history}getBaseHrefFromDOM(){return Fn().getBaseHref(this._doc)}onPopState(e){let i=Fn().getGlobalEventTarget(this._doc,"window");return i.addEventListener("popstate",e,!1),()=>i.removeEventListener("popstate",e)}onHashChange(e){let i=Fn().getGlobalEventTarget(this._doc,"window");return i.addEventListener("hashchange",e,!1),()=>i.removeEventListener("hashchange",e)}get href(){return this._location.href}get protocol(){return this._location.protocol}get hostname(){return this._location.hostname}get port(){return this._location.port}get pathname(){return this._location.pathname}get search(){return this._location.search}get hash(){return this._location.hash}set pathname(e){this._location.pathname=e}pushState(e,i,r){this._history.pushState(e,i,r)}replaceState(e,i,r){this._history.replaceState(e,i,r)}forward(){this._history.forward()}back(){this._history.back()}historyGo(e=0){this._history.go(e)}getState(){return this._history.state}static \u0275fac=function(i){return new(i||t)};static \u0275prov=fe({token:t,factory:()=>new t,providedIn:"platform"})}return t})();function wS(t,n){return t?n?t.endsWith("/")?n.startsWith("/")?t+n.slice(1):t+n:n.startsWith("/")?t+n:`${t}/${n}`:t:n}function yS(t){let n=t.search(/#|\?|$/);return t[n-1]==="/"?t.slice(0,n-1)+t.slice(n):t}function Or(t){return t&&t[0]!=="?"?`?${t}`:t}var Ya=(()=>{class t{historyGo(e){throw new Error("")}static \u0275fac=function(i){return new(i||t)};static \u0275prov=fe({token:t,factory:()=>c(u1),providedIn:"root"})}return t})(),d1=new C(""),u1=(()=>{class t extends Ya{_platformLocation;_baseHref;_removeListenerFns=[];constructor(e,i){super(),this._platformLocation=e,this._baseHref=i??this._platformLocation.getBaseHrefFromDOM()??c(X).location?.origin??""}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(e){this._removeListenerFns.push(this._platformLocation.onPopState(e),this._platformLocation.onHashChange(e))}getBaseHref(){return this._baseHref}prepareExternalUrl(e){return wS(this._baseHref,e)}path(e=!1){let i=this._platformLocation.pathname+Or(this._platformLocation.search),r=this._platformLocation.hash;return r&&e?`${i}${r}`:i}pushState(e,i,r,o){let a=this.prepareExternalUrl(r+Or(o));this._platformLocation.pushState(e,i,a)}replaceState(e,i,r,o){let a=this.prepareExternalUrl(r+Or(o));this._platformLocation.replaceState(e,i,a)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(e=0){this._platformLocation.historyGo?.(e)}static \u0275fac=function(i){return new(i||t)(te(qa),te(d1,8))};static \u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var Pr=(()=>{class t{_subject=new I;_basePath;_locationStrategy;_urlChangeListeners=[];_urlChangeSubscription=null;constructor(e){this._locationStrategy=e;let i=this._locationStrategy.getBaseHref();this._basePath=h1(yS(CS(i))),this._locationStrategy.onPopState(r=>{let o={url:this.path(!0),pop:!0,state:r.state,type:r.type};r.hasUAVisualTransition&&(o.hasUAVisualTransition=!0),this._subject.next(o)})}ngOnDestroy(){this._urlChangeSubscription?.unsubscribe(),this._urlChangeListeners=[]}path(e=!1){return this.normalize(this._locationStrategy.path(e))}getState(){return this._locationStrategy.getState()}isCurrentPathEqualTo(e,i=""){return this.path()==this.normalize(e+Or(i))}normalize(e){return t.stripTrailingSlash(f1(this._basePath,CS(e)))}prepareExternalUrl(e){return e&&e[0]!=="/"&&(e="/"+e),this._locationStrategy.prepareExternalUrl(e)}go(e,i="",r=null){this._locationStrategy.pushState(r,"",e,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+Or(i)),r)}replaceState(e,i="",r=null){this._locationStrategy.replaceState(r,"",e,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(e+Or(i)),r)}forward(){this._locationStrategy.forward()}back(){this._locationStrategy.back()}historyGo(e=0){this._locationStrategy.historyGo?.(e)}onUrlChange(e){return this._urlChangeListeners.push(e),this._urlChangeSubscription??=this.subscribe(i=>{this._notifyUrlChangeListeners(i.url,i.state)}),()=>{let i=this._urlChangeListeners.indexOf(e);this._urlChangeListeners.splice(i,1),this._urlChangeListeners.length===0&&(this._urlChangeSubscription?.unsubscribe(),this._urlChangeSubscription=null)}}_notifyUrlChangeListeners(e="",i){this._urlChangeListeners.forEach(r=>r(e,i))}subscribe(e,i,r){return this._subject.subscribe({next:e,error:i??void 0,complete:r??void 0})}static normalizeQueryParams=Or;static joinWithSlash=wS;static stripTrailingSlash=yS;static \u0275fac=function(i){return new(i||t)(te(Ya))};static \u0275prov=fe({token:t,factory:()=>m1(),providedIn:"root"})}return t})();function m1(){return new Pr(te(Ya))}function f1(t,n){if(!t||!n.startsWith(t))return n;let e=n.substring(t.length);return e===""||["/",";","?","#"].includes(e[0])?e:n}function CS(t){return t.replace(/\/index\.html$/,"")}function h1(t){if(new RegExp("^(https?:)?//").test(t)){let[,e]=t.split(/\/\/[^\/]+/);return e}return t}var Kl=(()=>{class t{_viewContainerRef;_viewRef=null;ngTemplateOutletContext=null;ngTemplateOutlet=null;ngTemplateOutletInjector=null;injector=c(K);constructor(e){this._viewContainerRef=e}ngOnChanges(e){if(this._shouldRecreateView(e)){let i=this._viewContainerRef;if(this._viewRef&&i.remove(i.indexOf(this._viewRef)),!this.ngTemplateOutlet){this._viewRef=null;return}let r=this._createContextForwardProxy();this._viewRef=i.createEmbeddedView(this.ngTemplateOutlet,r,{injector:this._getInjector()})}}_getInjector(){return this.ngTemplateOutletInjector==="outlet"?this.injector:this.ngTemplateOutletInjector??void 0}_shouldRecreateView(e){return!!e.ngTemplateOutlet||!!e.ngTemplateOutletInjector}_createContextForwardProxy(){return new Proxy({},{set:(e,i,r)=>this.ngTemplateOutletContext?Reflect.set(this.ngTemplateOutletContext,i,r):!1,get:(e,i,r)=>{if(this.ngTemplateOutletContext)return Reflect.get(this.ngTemplateOutletContext,i,r)}})}static \u0275fac=function(i){return new(i||t)(ne(pt))};static \u0275dir=R({type:t,selectors:[["","ngTemplateOutlet",""]],inputs:{ngTemplateOutletContext:"ngTemplateOutletContext",ngTemplateOutlet:"ngTemplateOutlet",ngTemplateOutletInjector:"ngTemplateOutletInjector"},features:[Ne]})}return t})();var lm=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();function Jl(t,n){n=encodeURIComponent(n);for(let e of t.split(";")){let i=e.indexOf("="),[r,o]=i==-1?[e,""]:[e.slice(0,i),e.slice(i+1)];if(r.trim()!==n)continue;let a=o;try{a=decodeURIComponent(o)}catch(s){}return a.length>1&&a[0]==='"'&&a[a.length-1]==='"'&&(a=a.slice(1,-1)),a}return null}var O_="browser";function SS(t){return t===O_}var ec=class{_doc;constructor(n){this._doc=n}manager},cm=(()=>{class t extends ec{constructor(e){super(e)}supports(e){return!0}addEventListener(e,i,r,o){return e.addEventListener(i,r,o),()=>this.removeEventListener(e,i,r,o)}removeEventListener(e,i,r,o){return e.removeEventListener(i,r,o)}static \u0275fac=function(i){return new(i||t)(te(X))};static \u0275prov=fe({token:t,factory:t.\u0275fac})}return t})(),mm=new C(""),j_=(()=>{class t{_zone;_plugins;_eventNameToPlugin=new Map;constructor(e,i){this._zone=i,e.forEach(a=>{a.manager=this});let r=e.filter(a=>!(a instanceof cm));this._plugins=r.slice().reverse();let o=e.find(a=>a instanceof cm);o&&this._plugins.push(o)}addEventListener(e,i,r,o){return this._findPluginFor(i).addEventListener(e,i,r,o)}getZone(){return this._zone}_findPluginFor(e){let i=this._eventNameToPlugin.get(e);if(i)return i;if(i=this._plugins.find(o=>o.supports(e)),!i)throw new H(-5101,!1);return this._eventNameToPlugin.set(e,i),i}static \u0275fac=function(i){return new(i||t)(te(mm),te($))};static \u0275prov=fe({token:t,factory:t.\u0275fac})}return t})(),P_="ng-app-id";function xS(t){for(let n of t)n.remove()}function DS(t,n){let e=n.createElement("style");return e.textContent=t,e}function b1(t,n,e,i){let r=t.head?.querySelectorAll(`style[${P_}="${n}"],link[${P_}="${n}"]`);if(!r||r.length===0)return!1;for(let o of r)o.removeAttribute(P_),o instanceof HTMLLinkElement?i.set(o.href.slice(o.href.lastIndexOf("/")+1),{usage:0,elements:[o]}):o.textContent&&e.set(o.textContent,{usage:0,elements:[o]});return!0}function L_(t,n){let e=n.createElement("link");return e.setAttribute("rel","stylesheet"),e.setAttribute("href",t),e}var V_=(()=>{class t{doc;appId;nonce;inline=new Map;external=new Map;hosts=new Set;constructor(e,i,r,o={}){this.doc=e,this.appId=i,this.nonce=r,b1(e,i,this.inline,this.external)&&this.hosts.add(e.head)}addStyles(e,i){for(let r of e)this.addUsage(r,this.inline,DS);i?.forEach(r=>this.addUsage(r,this.external,L_))}removeStyles(e,i){for(let r of e)this.removeUsage(r,this.inline);i?.forEach(r=>this.removeUsage(r,this.external))}addUsage(e,i,r){let o=i.get(e);o?o.usage++:i.set(e,{usage:1,elements:[...this.hosts].map(a=>this.addElement(a,r(e,this.doc)))})}removeUsage(e,i){let r=i.get(e);r&&(r.usage--,r.usage<=0&&(xS(r.elements),i.delete(e)))}ngOnDestroy(){for(let[,{elements:e}]of[...this.inline,...this.external])xS(e);this.hosts.clear()}addHost(e){if(!this.hosts.has(e)){this.hosts.add(e);for(let[i,{elements:r}]of this.inline)r.push(this.addElement(e,DS(i,this.doc)));for(let[i,{elements:r}]of this.external)r.push(this.addElement(e,L_(i,this.doc)))}}removeHost(e){this.hosts.delete(e);for(let i of[...this.inline.values(),...this.external.values()]){let r=[];for(let o of i.elements)o.parentNode===e?o.remove():r.push(o);i.elements=r}}addElement(e,i){return this.nonce&&i.setAttribute("nonce",this.nonce),e.appendChild(i)}static \u0275fac=function(i){return new(i||t)(te(X),te(Yi),te(Tr,8),te(No))};static \u0275prov=fe({token:t,factory:t.\u0275fac})}return t})(),F_={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/",math:"http://www.w3.org/1998/Math/MathML"},B_=/%COMP%/g;var MS="%COMP%",y1=`_nghost-${MS}`,C1=`_ngcontent-${MS}`,w1=!0,S1=new C("",{factory:()=>w1}),x1=new C("");function D1(t){return C1.replace(B_,t)}function E1(t){return y1.replace(B_,t)}function IS(t,n){return n.map(e=>e.replace(B_,t))}var H_=(()=>{class t{eventManager;sharedStylesHost;appId;removeStylesOnCompDestroy;doc;ngZone;nonce;tracingService;rendererByCompId=new Map;defaultRenderer;cssVarNamespace;constructor(e,i,r,o,a,s,l=null,d=null,u=null){this.eventManager=e,this.sharedStylesHost=i,this.appId=r,this.removeStylesOnCompDestroy=o,this.doc=a,this.ngZone=s,this.nonce=l,this.tracingService=d,this.cssVarNamespace=u??"",this.defaultRenderer=new tc(e,a,s,this.tracingService,this.cssVarNamespace)}createRenderer(e,i){if(!e||!i)return this.defaultRenderer;let r=this.getOrCreateRenderer(e,i);return r instanceof um?r.applyToHost(e):r instanceof nc&&r.applyStyles(),r}getOrCreateRenderer(e,i){let r=this.rendererByCompId,o=r.get(i.id);if(!o){let a=this.doc,s=this.ngZone,l=this.eventManager,d=this.sharedStylesHost,u=this.removeStylesOnCompDestroy,h=this.tracingService;switch(i.encapsulation){case ni.Emulated:o=new um(l,d,i,this.appId,u,a,s,h,this.cssVarNamespace);break;case ni.ShadowDom:return new dm(l,e,i,a,s,this.nonce,h,this.cssVarNamespace,d);case ni.ExperimentalIsolatedShadowDom:return new dm(l,e,i,a,s,this.nonce,h,this.cssVarNamespace);default:o=new nc(l,d,i,u,a,s,h,this.cssVarNamespace);break}r.set(i.id,o)}return o}ngOnDestroy(){this.rendererByCompId.clear()}componentReplaced(e){this.rendererByCompId.delete(e)}static \u0275fac=function(i){return new(i||t)(te(j_),te(Po),te(Yi),te(S1),te(X),te($),te(Tr),te(Ei,8),te(x1,8))};static \u0275prov=fe({token:t,factory:t.\u0275fac})}return t})(),tc=class{eventManager;doc;ngZone;tracingService;cssVarNamespace;data=Object.create(null);throwOnSyntheticProps=!0;constructor(n,e,i,r,o=""){this.eventManager=n,this.doc=e,this.ngZone=i,this.tracingService=r,this.cssVarNamespace=o}destroy(){}destroyNode=null;createElement(n,e){return e?this.doc.createElementNS(F_[e]||e,n):this.doc.createElement(n)}createComment(n){return this.doc.createComment(n)}createText(n){return this.doc.createTextNode(n)}appendChild(n,e){(ES(n)?n.content:n).appendChild(e)}insertBefore(n,e,i){if(n){let r=ES(n)?n.content:n;if(i!=null&&i.parentNode!==r)throw new H(-5106,!1);r.insertBefore(e,i)}}removeChild(n,e){e.remove()}selectRootElement(n,e){let i=typeof n=="string"?this.doc.querySelector(n):n;if(!i)throw new H(-5104,!1);return e||(i.textContent=""),i}parentNode(n){return n.parentNode}nextSibling(n){return n.nextSibling}setAttribute(n,e,i,r){if(r){e=r+":"+e;let o=F_[r];o?n.setAttributeNS(o,e,i):n.setAttribute(e,i)}else n.setAttribute(e,i)}removeAttribute(n,e,i){if(i){let r=F_[i];r?n.removeAttributeNS(r,e):n.removeAttribute(`${i}:${e}`)}else n.removeAttribute(e)}addClass(n,e){n.classList.add(e)}removeClass(n,e){n.classList.remove(e)}setStyle(n,e,i,r){let o=e.startsWith("--");o&&(e=e.replace("%NS%",this.cssVarNamespace)),o||r&(xi.DashCase|xi.Important)?n.style.setProperty(e,i,r&xi.Important?"important":""):n.style[e]=i}removeStyle(n,e,i){let r=e.startsWith("--");r&&(e=e.replace("%NS%",this.cssVarNamespace)),r||i&xi.DashCase?n.style.removeProperty(e):n.style[e]=""}setProperty(n,e,i){n!=null&&(n[e]=i)}setValue(n,e){n.nodeValue=e}listen(n,e,i,r){if(typeof n=="string"&&(n=Fn().getGlobalEventTarget(this.doc,n),!n))throw new H(-5102,!1);let o=this.decoratePreventDefault(i);return this.tracingService?.wrapEventListener&&(o=this.tracingService.wrapEventListener(n,e,o)),this.eventManager.addEventListener(n,e,o,r)}decoratePreventDefault(n){return e=>{if(e==="__ngUnwrap__")return n;n(e)===!1&&e.preventDefault()}}};function ES(t){return t.tagName==="TEMPLATE"&&t.content!==void 0}var dm=class extends tc{hostEl;sharedStylesHost;shadowRoot;constructor(n,e,i,r,o,a,s,l,d){super(n,r,o,s,l),this.hostEl=e,this.sharedStylesHost=d,this.shadowRoot=e.attachShadow({mode:"open"}),this.sharedStylesHost&&this.sharedStylesHost.addHost(this.shadowRoot);let u=i.styles;u=IS(i.id,u).map(_=>_.replace(/%NS%/g,l));for(let _ of u){let v=document.createElement("style");a&&v.setAttribute("nonce",a),v.textContent=_,this.shadowRoot.appendChild(v)}let h=i.getExternalStyles?.();if(h)for(let _ of h){let v=L_(_,r);a&&v.setAttribute("nonce",a),this.shadowRoot.appendChild(v)}}nodeOrShadowRoot(n){return n===this.hostEl?this.shadowRoot:n}appendChild(n,e){return super.appendChild(this.nodeOrShadowRoot(n),e)}insertBefore(n,e,i){return super.insertBefore(this.nodeOrShadowRoot(n),e,i)}removeChild(n,e){return super.removeChild(null,e)}parentNode(n){return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)))}destroy(){this.sharedStylesHost&&this.sharedStylesHost.removeHost(this.shadowRoot)}},nc=class extends tc{sharedStylesHost;removeStylesOnCompDestroy;styles;styleUrls;constructor(n,e,i,r,o,a,s,l,d){super(n,o,a,s,l),this.sharedStylesHost=e,this.removeStylesOnCompDestroy=r;let u=i.styles,h=d?IS(d,u):u;this.styles=h.map(_=>_.replace(/%NS%/g,l)),this.styleUrls=i.getExternalStyles?.(d)}applyStyles(){this.sharedStylesHost.addStyles(this.styles,this.styleUrls)}destroy(){this.removeStylesOnCompDestroy&&Ar.size===0&&this.sharedStylesHost.removeStyles(this.styles,this.styleUrls)}},um=class extends nc{contentAttr;hostAttr;constructor(n,e,i,r,o,a,s,l,d){let u=r+"-"+i.id;super(n,e,i,o,a,s,l,d,u),this.contentAttr=D1(u),this.hostAttr=E1(u)}applyToHost(n){this.applyStyles(),this.setAttribute(n,this.hostAttr,"")}createElement(n,e){let i=super.createElement(n,e);return super.setAttribute(i,this.contentAttr,""),i}};var fm=class t extends Xl{supportsDOMEvents=!0;static makeCurrent(){R_(new t)}onAndCancel(n,e,i,r){return n.addEventListener(e,i,r),()=>{n.removeEventListener(e,i,r)}}dispatchEvent(n,e){n.dispatchEvent(e)}remove(n){n.remove()}createElement(n,e){return e=e||this.getDefaultDocument(),e.createElement(n)}createHtmlDocument(){return document.implementation.createHTMLDocument("fakeTitle")}getDefaultDocument(){return document}isElementNode(n){return n.nodeType===Node.ELEMENT_NODE}isShadowRoot(n){return n instanceof DocumentFragment}getGlobalEventTarget(n,e){return e==="window"?window:e==="document"?n:e==="body"?n.body:null}getBaseHref(n){let e=M1();return e==null?null:I1(e)}resetBaseElement(){ic=null}getUserAgent(){return window.navigator.userAgent}getCookie(n){return Jl(document.cookie,n)}},ic=null;function M1(){return ic=ic||document.head.querySelector("base"),ic?ic.getAttribute("href"):null}function I1(t){return new URL(t,document.baseURI).pathname}var NS=["alt","control","meta","shift"],N1={"\b":"Backspace","	":"Tab","\x7F":"Delete","\x1B":"Escape",Del:"Delete",Esc:"Escape",Left:"ArrowLeft",Right:"ArrowRight",Up:"ArrowUp",Down:"ArrowDown",Menu:"ContextMenu",Scroll:"ScrollLock",Win:"OS"},T1={alt:t=>t.altKey,control:t=>t.ctrlKey,meta:t=>t.metaKey,shift:t=>t.shiftKey},TS=(()=>{class t extends ec{constructor(e){super(e)}supports(e){return t.parseEventName(e)!=null}addEventListener(e,i,r,o){let a=t.parseEventName(i),s=t.eventCallback(a.fullKey,r,this.manager.getZone());return this.manager.getZone().runOutsideAngular(()=>Fn().onAndCancel(e,a.domEventName,s,o))}static parseEventName(e){let i=e.toLowerCase().split("."),r=i.shift();if(i.length===0||!(r==="keydown"||r==="keyup"))return null;let o=t._normalizeKey(i.pop()),a="",s=i.indexOf("code");if(s>-1&&(i.splice(s,1),a="code."),NS.forEach(d=>{let u=i.indexOf(d);u>-1&&(i.splice(u,1),a+=d+".")}),a+=o,i.length!=0||o.length===0)return null;let l={};return l.domEventName=r,l.fullKey=a,l}static matchEventFullKeyCode(e,i){let r=N1[e.key]||e.key,o="";return i.indexOf("code.")>-1&&(r=e.code,o="code."),r==null||!r?!1:(r=r.toLowerCase(),r===" "?r="space":r==="."&&(r="dot"),NS.forEach(a=>{if(a!==r){let s=T1[a];s(e)&&(o+=a+".")}}),o+=r,o===i)}static eventCallback(e,i,r){return o=>{t.matchEventFullKeyCode(o,e)&&r.runGuarded(()=>i(o))}}static _normalizeKey(e){return e==="esc"?"escape":e}static \u0275fac=function(i){return new(i||t)(te(X))};static \u0275prov=fe({token:t,factory:t.\u0275fac})}return t})();function U_(t,n,e){return P(this,null,function*(){let i=y({rootComponent:t},k1(n,e));return gS(i)})}function k1(t,n){return{platformRef:n?.platformRef,appProviders:[...F1,...t?.providers??[]],platformProviders:P1}}function A1(){fm.makeCurrent()}function R1(){return new Jt}function O1(){return Hg(document),document}var P1=[{provide:No,useValue:O_},{provide:fu,useValue:A1,multi:!0},{provide:X,useFactory:O1}];var F1=[{provide:vl,useValue:"root"},{provide:Jt,useFactory:R1},{provide:mm,useClass:cm,multi:!0},{provide:mm,useClass:TS,multi:!0},H_,{provide:Po,useClass:V_},{provide:V_,useExisting:Po},j_,{provide:It,useExisting:H_},[]];var nr=class t{headers;normalizedNames=new Map;lazyInit;lazyUpdate=null;constructor(n){n?typeof n=="string"?this.lazyInit=()=>{this.headers=new Map,n.split(`
`).forEach(e=>{let i=e.indexOf(":");if(i>0){let r=e.slice(0,i),o=e.slice(i+1).trim();this.addHeaderEntry(r,o)}})}:typeof Headers<"u"&&n instanceof Headers?(this.headers=new Map,n.forEach((e,i)=>{this.addHeaderEntry(i,e)})):this.lazyInit=()=>{this.headers=new Map,Object.entries(n).forEach(([e,i])=>{this.setHeaderEntries(e,i)})}:this.headers=new Map}has(n){return this.init(),this.headers.has(n.toLowerCase())}get(n){this.init();let e=this.headers.get(n.toLowerCase());return e&&e.length>0?e[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(n){return this.init(),this.headers.get(n.toLowerCase())||null}append(n,e){return this.clone({name:n,value:e,op:"a"})}set(n,e){return this.clone({name:n,value:e,op:"s"})}delete(n,e){return this.clone({name:n,value:e,op:"d"})}maybeSetNormalizedName(n,e){this.normalizedNames.has(e)||this.normalizedNames.set(e,n)}init(){this.lazyInit&&(this.lazyInit instanceof t?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(n=>this.applyUpdate(n)),this.lazyUpdate=null))}copyFrom(n){n.init();for(let[e,i]of n.headers.entries())this.headers.set(e,i),this.normalizedNames.set(e,n.normalizedNames.get(e))}clone(n){let e=new t;return e.lazyInit=this.lazyInit&&this.lazyInit instanceof t?this.lazyInit:this,e.lazyUpdate=(this.lazyUpdate||[]).concat([n]),e}applyUpdate(n){let e=n.name.toLowerCase();switch(n.op){case"a":case"s":let i=n.value;if(typeof i=="string"&&(i=[i]),i.length===0)return;this.maybeSetNormalizedName(n.name,e);let r=n.op==="a"?(this.headers.get(e)||[]).slice():[];r.push(...i),this.headers.set(e,r);break;case"d":let o=n.value;if(o===void 0)this.headers.delete(e),this.normalizedNames.delete(e);else{let a=Array.isArray(o)?o:[o],s=this.headers.get(e);if(!s)return;s=s.filter(l=>a.indexOf(l)===-1),s.length===0?(this.headers.delete(e),this.normalizedNames.delete(e)):this.headers.set(e,s)}break}}addHeaderEntry(n,e){let i=n.toLowerCase();this.maybeSetNormalizedName(n,i),this.headers.has(i)?this.headers.get(i).push(e):this.headers.set(i,[e])}setHeaderEntries(n,e){let i=(Array.isArray(e)?e:[e]).map(o=>o.toString()),r=n.toLowerCase();this.headers.set(r,i),this.maybeSetNormalizedName(n,r)}forEach(n){this.init(),Array.from(this.normalizedNames.keys()).forEach(e=>n(this.normalizedNames.get(e),this.headers.get(e)))}};var pm=class{map=new Map;set(n,e){return this.map.set(n,e),this}get(n){return this.map.has(n)||this.map.set(n,n.defaultValue()),this.map.get(n)}delete(n){return this.map.delete(n),this}has(n){return this.map.has(n)}keys(){return this.map.keys()}},gm=class{encodeKey(n){return kS(n)}encodeValue(n){return kS(n)}decodeKey(n){return decodeURIComponent(n)}decodeValue(n){return decodeURIComponent(n)}};function L1(t,n){let e=new Map;return t.length>0&&t.replace(/^\?/,"").split("&").forEach(r=>{let o=r.indexOf("="),[a,s]=o==-1?[n.decodeKey(r),""]:[n.decodeKey(r.slice(0,o)),n.decodeValue(r.slice(o+1))],l=e.get(a)||[];l.push(s),e.set(a,l)}),e}var j1=/%(\d[a-f0-9])/gi,V1={40:"@","3A":":",24:"$","2C":",","3B":";","3D":"=","3F":"?","2F":"/"};function kS(t){return encodeURIComponent(t).replace(j1,(n,e)=>V1[e]??n)}function hm(t){return`${t}`}var tr=class t{map;encoder;updates=null;cloneFrom=null;constructor(n={}){if(this.encoder=n.encoder||new gm,n.fromString){if(n.fromObject)throw new H(2805,!1);this.map=L1(n.fromString,this.encoder)}else n.fromObject?(this.map=new Map,Object.keys(n.fromObject).forEach(e=>{let i=n.fromObject[e],r=Array.isArray(i)?i.map(hm):[hm(i)];this.map.set(e,r)})):this.map=null}has(n){return this.init(),this.map.has(n)}get(n){this.init();let e=this.map.get(n);return e?e[0]:null}getAll(n){return this.init(),this.map.get(n)||null}keys(){return this.init(),Array.from(this.map.keys())}append(n,e){return this.clone({param:n,value:e,op:"a"})}appendAll(n){let e=[];return Object.keys(n).forEach(i=>{let r=n[i];Array.isArray(r)?r.forEach(o=>{e.push({param:i,value:o,op:"a"})}):e.push({param:i,value:r,op:"a"})}),this.clone(e)}set(n,e){return this.clone({param:n,value:e,op:"s"})}delete(n,e){return this.clone({param:n,value:e,op:"d"})}toString(){return this.init(),this.keys().map(n=>{let e=this.encoder.encodeKey(n);return this.map.get(n).map(i=>e+"="+this.encoder.encodeValue(i)).join("&")}).filter(n=>n!=="").join("&")}clone(n){let e=new t({encoder:this.encoder});return e.cloneFrom=this.cloneFrom||this,e.updates=(this.updates||[]).concat(n),e}init(){if(this.map===null&&(this.map=new Map),this.cloneFrom!==null){this.cloneFrom.init();for(let[n,e]of this.cloneFrom.map.entries())this.map.set(n,e);this.updates.forEach(n=>{switch(n.op){case"a":case"s":let e=n.op==="a"?(this.map.get(n.param)||[]).slice():[];e.push(hm(n.value)),this.map.set(n.param,e);break;case"d":if(n.value!==void 0){let i=(this.map.get(n.param)||[]).slice(),r=i.indexOf(hm(n.value));r!==-1&&i.splice(r,1),i.length>0?this.map.set(n.param,i):this.map.delete(n.param)}else{this.map.delete(n.param);break}}}),this.cloneFrom=this.updates=null}}};function B1(t){switch(t){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}function AS(t){return typeof ArrayBuffer<"u"&&t instanceof ArrayBuffer}function RS(t){return typeof Blob<"u"&&t instanceof Blob}function OS(t){return typeof FormData<"u"&&t instanceof FormData}function H1(t){return typeof URLSearchParams<"u"&&t instanceof URLSearchParams}var z_="Content-Type",PS="Accept",jS="text/plain",VS="application/json",U1=`${VS}, ${jS}, */*`,Za=class t{url;body=null;headers;context;reportProgress=!1;reportUploadProgress=!1;reportDownloadProgress=!1;withCredentials=!1;credentials;keepalive=!1;cache;priority;mode;redirect;referrer;integrity;referrerPolicy;responseType="json";method;params;urlWithParams;transferCache;timeout;constructor(n,e,i,r){this.url=e,this.method=n.toUpperCase();let o;if(B1(this.method)||r?(this.body=i!==void 0?i:null,o=r):o=i,o){if(this.reportProgress=!!o.reportProgress,this.reportUploadProgress=!!o.reportUploadProgress,this.reportDownloadProgress=!!o.reportDownloadProgress,this.withCredentials=!!o.withCredentials,this.keepalive=!!o.keepalive,o.responseType&&(this.responseType=o.responseType),o.headers&&(this.headers=o.headers),o.context&&(this.context=o.context),o.params&&(this.params=o.params),o.priority&&(this.priority=o.priority),o.cache&&(this.cache=o.cache),o.credentials&&(this.credentials=o.credentials),typeof o.timeout=="number"){if(o.timeout<1||!Number.isInteger(o.timeout))throw new H(2822,"");this.timeout=o.timeout}o.mode&&(this.mode=o.mode),o.redirect&&(this.redirect=o.redirect),o.integrity&&(this.integrity=o.integrity),o.referrer!==void 0&&(this.referrer=o.referrer),o.referrerPolicy&&(this.referrerPolicy=o.referrerPolicy),this.transferCache=o.transferCache}if(this.headers??=new nr,this.context??=new pm,!this.params)this.params=new tr,this.urlWithParams=e;else{let a=this.params.toString();if(a.length===0)this.urlWithParams=e;else{let s=e,l="",d=e.indexOf("#");d!==-1&&(l=e.substring(d),s=e.substring(0,d));let u=s.indexOf("?"),h=u===-1?"?":u<s.length-1?"&":"";this.urlWithParams=s+h+a+l}}}serializeBody(){return this.body===null?null:typeof this.body=="string"||AS(this.body)||RS(this.body)||OS(this.body)||H1(this.body)?this.body:this.body instanceof tr?this.body.toString():typeof this.body=="object"||typeof this.body=="boolean"||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return this.body===null||OS(this.body)?null:RS(this.body)?this.body.type||null:AS(this.body)?null:typeof this.body=="string"?jS:this.body instanceof tr?"application/x-www-form-urlencoded;charset=UTF-8":typeof this.body=="object"||typeof this.body=="number"||typeof this.body=="boolean"?VS:null}clone(n={}){let e=n.method||this.method,i=n.url||this.url,r=n.responseType||this.responseType,o=n.keepalive??this.keepalive,a=n.priority||this.priority,s=n.cache||this.cache,l=n.mode||this.mode,d=n.redirect||this.redirect,u=n.credentials||this.credentials,h=n.referrer??this.referrer,_=n.integrity||this.integrity,v=n.referrerPolicy||this.referrerPolicy,S=n.transferCache??this.transferCache,A=n.timeout??this.timeout,oe=n.body!==void 0?n.body:this.body,ae=n.withCredentials??this.withCredentials,Ke=n.reportProgress??this.reportProgress,kt=n.reportUploadProgress??this.reportUploadProgress,qs=n.reportDownloadProgress??this.reportDownloadProgress,fr=n.headers||this.headers,Ys=n.params||this.params,Zs=n.context??this.context;return n.setHeaders!==void 0&&(fr=Object.keys(n.setHeaders).reduce((oa,hr)=>oa.set(hr,n.setHeaders[hr]),fr)),n.setParams&&(Ys=Object.keys(n.setParams).reduce((oa,hr)=>oa.set(hr,n.setParams[hr]),Ys)),new t(e,i,oe,{params:Ys,headers:fr,context:Zs,reportProgress:Ke,reportUploadProgress:kt,reportDownloadProgress:qs,responseType:r,withCredentials:ae,transferCache:S,keepalive:o,cache:s,priority:a,timeout:A,mode:l,redirect:d,credentials:u,referrer:h,integrity:_,referrerPolicy:v})}},jo=(function(t){return t[t.Sent=0]="Sent",t[t.UploadProgress=1]="UploadProgress",t[t.ResponseHeader=2]="ResponseHeader",t[t.DownloadProgress=3]="DownloadProgress",t[t.Response=4]="Response",t[t.User=5]="User",t})(jo||{}),Qa=class{headers;status;statusText;url;ok;type;redirected;responseType;constructor(n,e=200,i="OK"){this.headers=n.headers||new nr,this.status=n.status!==void 0?n.status:e,this.statusText=n.statusText||i,this.url=n.url||null,this.redirected=n.redirected,this.responseType=n.responseType,this.ok=this.status>=200&&this.status<300}},_m=class t extends Qa{constructor(n={}){super(n)}type=jo.ResponseHeader;clone(n={}){return new t({headers:n.headers||this.headers,status:n.status!==void 0?n.status:this.status,statusText:n.statusText||this.statusText,url:n.url||this.url||void 0})}},rc=class t extends Qa{body;constructor(n={}){super(n),this.body=n.body!==void 0?n.body:null}type=jo.Response;clone(n={}){return new t({body:n.body!==void 0?n.body:this.body,headers:n.headers||this.headers,status:n.status!==void 0?n.status:this.status,statusText:n.statusText||this.statusText,url:n.url||this.url||void 0,redirected:n.redirected??this.redirected,responseType:n.responseType??this.responseType})}},er=class extends Qa{name="HttpErrorResponse";message;error;ok=!1;constructor(n){super(n,0,"Unknown Error"),this.status>=200&&this.status<300?this.message=`Http failure during parsing for ${n.url||"(unknown url)"}`:this.message=`Http failure response for ${n.url||"(unknown url)"}: ${n.status} ${n.statusText}`,this.error=n.error||null}},z1=200;var $1=/^\)\]\}',?\n/,kX=1024*1024,BS=new C("",{factory:()=>null}),vm=(()=>{class t{fetchImpl=c(W_,{optional:!0})?.fetch??((...e)=>globalThis.fetch(...e));ngZone=c($);destroyRef=c(Je);maxResponseSize=c(BS);handle(e){return new de(i=>{let r=new AbortController,o=!1,a={next:l=>{l.type===jo.Response&&(o=!0),i.next(l)},error:l=>{o=!0,i.error(l)},complete:()=>{o=!0,i.complete()}};this.doRequest(e,r.signal,a).then(G_,l=>a.error(new er({error:l})));let s;return e.timeout&&(s=this.ngZone.runOutsideAngular(()=>setTimeout(()=>{r.signal.aborted||r.abort(new DOMException("signal timed out","TimeoutError"))},e.timeout))),()=>{s!==void 0&&clearTimeout(s),!o&&!r.signal.aborted&&r.abort()}})}doRequest(e,i,r){return P(this,null,function*(){let o=this.createRequestInit(e),a;try{let oe=this.ngZone.runOutsideAngular(()=>this.fetchImpl(e.urlWithParams,y({signal:i},o)));W1(oe),r.next({type:jo.Sent}),a=yield oe}catch(oe){r.error(new er({error:oe,status:oe.status??0,statusText:oe.statusText,url:e.urlWithParams,headers:oe.headers}));return}let s=new nr(a.headers),l=a.statusText,d=a.url||e.urlWithParams,u=a.status,h=null,_=e.reportProgress||e.reportDownloadProgress;if(_&&r.next(new _m({headers:s,status:u,statusText:l,url:d})),a.body){let oe=a.headers.get(z_)??"",ae=a.headers.get("content-length"),Ke=ae!==null?Number(ae):NaN;this.maxResponseSize!==null&&Number.isFinite(Ke)&&Ke>this.maxResponseSize&&(yield a.body.cancel(),FS(this.maxResponseSize));let kt=[],qs=a.body.getReader(),fr=0,Ys,Zs,oa=typeof Zone<"u"&&Zone.current,hr=!1;if(yield this.ngZone.runOutsideAngular(()=>P(this,null,function*(){for(;;){if(this.destroyRef.destroyed){yield qs.cancel(),hr=!0;break}let{done:Sh,value:xh}=yield qs.read();if(Sh)break;if(kt.push(xh),fr+=xh.length,this.maxResponseSize!==null&&fr>this.maxResponseSize&&(yield qs.cancel(),FS(this.maxResponseSize)),_){Zs=e.responseType==="text"?(Zs??"")+(Ys??=LS(oe)).decode(xh,{stream:!0}):void 0;let Tb=()=>r.next({type:jo.DownloadProgress,total:Number.isFinite(Ke)?Ke:void 0,loaded:fr,partialText:Zs});oa?oa.run(Tb):Tb()}}})),hr){r.complete();return}let BM=this.concatChunks(kt,fr);try{h=this.parseBody(e,BM,oe,u)}catch(Sh){r.error(new er({error:Sh,headers:new nr(a.headers),status:a.status,statusText:a.statusText,url:a.url||e.urlWithParams}));return}}u===0&&(u=h?z1:0);let v=u>=200&&u<300,S=a.redirected,A=a.type;v?(r.next(new rc({body:h,headers:s,status:u,statusText:l,url:d,redirected:S,responseType:A})),r.complete()):r.error(new er({error:h,headers:s,status:u,statusText:l,url:d,redirected:S,responseType:A}))})}parseBody(e,i,r,o){switch(e.responseType){case"json":let a=new TextDecoder().decode(i).replace($1,"");if(a==="")return null;try{return JSON.parse(a)}catch(s){if(o<200||o>=300)return a;throw s}case"text":return LS(r).decode(i);case"blob":return new Blob([i],{type:r});case"arraybuffer":return i.buffer}}createRequestInit(e){if(e.reportUploadProgress)throw new H(2824,!1);let i={},r;if(r=e.credentials,e.withCredentials&&(r="include"),e.headers.forEach((o,a)=>i[o]=a.join(",")),e.headers.has(PS)||(i[PS]=U1),!e.headers.has(z_)){let o=e.detectContentTypeHeader();o!==null&&(i[z_]=o)}return{body:e.serializeBody(),method:e.method,headers:i,credentials:r,keepalive:e.keepalive,cache:e.cache,priority:e.priority,mode:e.mode,redirect:e.redirect,referrer:e.referrer,integrity:e.integrity,referrerPolicy:e.referrerPolicy}}concatChunks(e,i){let r=new Uint8Array(i),o=0;for(let a of e)r.set(a,o),o+=a.length;return r}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),W_=class{};function G_(){}function W1(t){t.then(G_,G_)}function FS(t){throw new H(-2825,!1)}var G1=/charset=\s*["']?([^;"'\s]+)["']?/i;function LS(t){let n=t.match(G1);if(n!==null)try{return new TextDecoder(n[1])}catch(e){}return new TextDecoder}var q1=new C("",{factory:()=>!0}),Y1="XSRF-TOKEN",Z1=new C("",{factory:()=>Y1}),Q1="X-XSRF-TOKEN",X1=new C("",{factory:()=>Q1}),K1=(()=>{class t{cookieName=c(Z1);doc=c(X);lastCookieString="";lastToken=null;parseCount=0;getToken(){let e=this.doc.cookie||"";return e!==this.lastCookieString&&(this.parseCount++,this.lastToken=Jl(e,this.cookieName),this.lastCookieString=e),this.lastToken}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),HS=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=fe({token:t,factory:function(i){let r=null;return i?r=new(i||t):r=te(K1),r},providedIn:"root"})}return t})();function US(t,n){if(!c(q1)||t.method==="GET"||t.method==="HEAD")return n(t);try{let r=c(qa).href,{origin:o}=new URL(r),{origin:a}=new URL(t.url,o);if(o!==a)return n(t)}catch(r){return n(t)}let e=c(HS).getToken(),i=c(X1);return e!=null&&!t.headers.has(i)&&(t=t.clone({headers:t.headers.set(i,e)})),n(t)}function J1(t,n){return n(t)}function eO(t,n,e){return(i,r)=>Ot(e,()=>n(i,o=>t(o,r)))}var zS=new C("",{factory:()=>[US]}),$S=new C(""),WS=new C("",{factory:()=>!0});var q_=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=fe({token:t,factory:function(i){let r=null;return i?r=new(i||t):r=te(vm),r},providedIn:"root"})}return t})();var bm=(()=>{class t{backend;injector;chain=null;pendingTasks=c(Na);contributeToStability=c(WS);constructor(e,i){this.backend=e,this.injector=i}handle(e){if(this.chain===null){let r=this.injector.get(ym,null,{skipSelf:!0}),o=r!==null&&this.backend===r,a=this.injector.get($S,[],o?{self:!0}:void 0),s=Array.from(new Set([...this.injector.get(zS),...a]));this.chain=s.reduceRight((l,d)=>eO(l,d,this.injector),J1)}let i=this.chain;if(this.contributeToStability){let r=this.pendingTasks.add();return Ee(()=>i(e,o=>this.backend.handle(o))).pipe(fo(r))}else return Ee(()=>i(e,r=>this.backend.handle(r)))}static \u0275fac=function(i){return new(i||t)(te(q_),te(qe))};static \u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),ym=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=fe({token:t,factory:function(i){let r=null;return i?r=new(i||t):r=te(bm),r},providedIn:"root"})}return t})();function $_(t,n){return y({body:n},t)}var Xa=(()=>{class t{handler;constructor(e){this.handler=e}request(e,i,r={}){let o;if(e instanceof Za)o=e;else{let l;r.headers instanceof nr?l=r.headers:l=new nr(r.headers);let d;r.params&&(r.params instanceof tr?d=r.params:d=new tr({fromObject:r.params})),o=new Za(e,i,r.body!==void 0?r.body:null,{headers:l,context:r.context,params:d,reportProgress:r.reportProgress,reportUploadProgress:r.reportUploadProgress,reportDownloadProgress:r.reportDownloadProgress,responseType:r.responseType||"json",withCredentials:r.withCredentials,transferCache:r.transferCache,keepalive:r.keepalive,priority:r.priority,cache:r.cache,mode:r.mode,redirect:r.redirect,credentials:r.credentials,referrer:r.referrer,referrerPolicy:r.referrerPolicy,integrity:r.integrity,timeout:r.timeout})}let a=ie(o).pipe(mo(l=>this.handler.handle(l)));if(e instanceof Za||r.observe==="events")return a;let s=a.pipe(me(l=>l instanceof rc));switch(r.observe||"body"){case"body":switch(o.responseType){case"arraybuffer":return s.pipe(ee(l=>{if(l.body!==null&&!(l.body instanceof ArrayBuffer))throw new H(2806,!1);return l.body}));case"blob":return s.pipe(ee(l=>{if(l.body!==null&&!(l.body instanceof Blob))throw new H(2807,!1);return l.body}));case"text":return s.pipe(ee(l=>{if(l.body!==null&&typeof l.body!="string")throw new H(2808,!1);return l.body}));default:return s.pipe(ee(l=>l.body))}case"response":return s;default:throw new H(2809,!1)}}delete(e,i={}){return this.request("DELETE",e,i)}get(e,i={}){return this.request("GET",e,i)}head(e,i={}){return this.request("HEAD",e,i)}jsonp(e,i){return this.request("JSONP",e,{params:new tr().append(i,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(e,i={}){return this.request("OPTIONS",e,i)}patch(e,i,r={}){return this.request("PATCH",e,$_(r,i))}post(e,i,r={}){return this.request("POST",e,$_(r,i))}put(e,i,r={}){return this.request("PUT",e,$_(r,i))}static \u0275fac=function(i){return new(i||t)(te(ym))};static \u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function Y_(...t){let n=[Xa,vm,bm,{provide:ym,useExisting:bm},{provide:q_,useFactory:()=>c(vm)},{provide:zS,useValue:US,multi:!0}];for(let e of t)n.push(...e.\u0275providers);return $i(n)}var GS=(()=>{class t{_doc;constructor(e){this._doc=e}getTitle(){return this._doc.title}setTitle(e){this._doc.title=e||""}static \u0275fac=function(i){return new(i||t)(te(X))};static \u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();var oc=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=fe({token:t,factory:function(i){let r=null;return i?r=new(i||t):r=te(nO),r},providedIn:"root"})}return t})(),nO=(()=>{class t extends oc{_doc=c(X);sanitize(e,i){if(i==null)return null;switch(e){case Oe.NONE:return i;case Oe.HTML:return Qi(i,"HTML")?Pn(i):Yg(this._doc,String(i)).toString();case Oe.STYLE:return Qi(i,"Style")?Pn(i):i;case Oe.SCRIPT:if(Qi(i,"Script"))return Pn(i);throw new H(5200,!1);case Oe.URL:return Qi(i,"URL")?Pn(i):Ll(String(i));case Oe.RESOURCE_URL:if(Qi(i,"ResourceURL"))return Pn(i);throw new H(-5201,!1);default:throw new H(5202,!1)}}bypassSecurityTrustHtml(e){return zg(e)}bypassSecurityTrustStyle(e){return $g(e)}bypassSecurityTrustScript(e){return Wg(e)}bypassSecurityTrustUrl(e){return Gg(e)}bypassSecurityTrustResourceUrl(e){return qg(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var ye="primary",bc=Symbol("RouteTitle"),J_=class{params;constructor(n){this.params=n||{}}has(n){return Object.hasOwn(this.params,n)}get(n){if(this.has(n)){let e=this.params[n];return Array.isArray(e)?e[0]:e}return null}getAll(n){if(this.has(n)){let e=this.params[n];return Array.isArray(e)?e:[e]}return[]}get keys(){return Object.keys(this.params)}};function Bo(t){return new J_(t)}function Z_(t,n,e){for(let i=0;i<t.length;i++){let r=t[i],o=n[i];if(r[0]===":")e[r.substring(1)]=o;else if(r!==o.path)return!1}return!0}function ex(t,n,e){let i=e.path.split("/"),r=i.indexOf("**");if(r===-1){if(i.length>t.length||e.pathMatch==="full"&&(n.hasChildren()||i.length<t.length))return null;let l={},d=t.slice(0,i.length);return Z_(i,d,l)?{consumed:d,posParams:l}:null}if(r!==i.lastIndexOf("**"))return null;let o=i.slice(0,r),a=i.slice(r+1);if(o.length+a.length>t.length||e.pathMatch==="full"&&n.hasChildren()&&e.path!=="**")return null;let s={};return!Z_(o,t.slice(0,o.length),s)||!Z_(a,t.slice(t.length-a.length),s)?null:{consumed:t,posParams:s}}function Em(t){return new Promise((n,e)=>{t.pipe(Bi()).subscribe({next:i=>n(i),error:i=>e(i)})})}function rO(t,n){if(t.length!==n.length)return!1;for(let e=0;e<t.length;++e)if(!Ii(t[e],n[e]))return!1;return!0}function Ii(t,n){let e=t?ev(t):void 0,i=n?ev(n):void 0;if(!e||!i||e.length!=i.length)return!1;let r;for(let o=0;o<e.length;o++)if(r=e[o],!tx(t[r],n[r]))return!1;return!0}function ev(t){return[...Object.keys(t),...Object.getOwnPropertySymbols(t)]}function tx(t,n){if(Array.isArray(t)&&Array.isArray(n)){if(t.length!==n.length)return!1;let e=[...t].sort(),i=[...n].sort();return e.every((r,o)=>i[o]===r)}else return t===n}function oO(t){return t.length>0?t[t.length-1]:null}function $o(t){return nl(t)?t:Ji(t)?st(Promise.resolve(t)):ie(t)}function nx(t){return nl(t)?Em(t):Promise.resolve(t)}var aO={exact:rx,subset:ox},ix={exact:sO,subset:lO,ignored:()=>!0},pv={paths:"exact",fragment:"ignored",matrixParams:"ignored",queryParams:"exact"},ts={paths:"subset",fragment:"ignored",matrixParams:"ignored",queryParams:"subset"};function gv(t,n,e){let i=t instanceof on?t:n.parseUrl(t);return ke(()=>tv(n.lastSuccessfulNavigation()?.finalUrl??new on,i,y(y({},ts),e)))}function tv(t,n,e){return aO[e.paths](t.root,n.root,e.matrixParams)&&ix[e.queryParams](t.queryParams,n.queryParams)&&!(e.fragment==="exact"&&t.fragment!==n.fragment)}function sO(t,n){return Ii(t,n)}function rx(t,n,e){if(!Vo(t.segments,n.segments)||!Sm(t.segments,n.segments,e)||t.numberOfChildren!==n.numberOfChildren)return!1;for(let i in n.children)if(!t.children[i]||!rx(t.children[i],n.children[i],e))return!1;return!0}function lO(t,n){return Object.keys(n).length<=Object.keys(t).length&&Object.keys(n).every(e=>tx(t[e],n[e]))}function ox(t,n,e){return ax(t,n,n.segments,e)}function ax(t,n,e,i){if(t.segments.length>e.length){let r=t.segments.slice(0,e.length);return!(!Vo(r,e)||n.hasChildren()||!Sm(r,e,i))}else if(t.segments.length===e.length){if(!Vo(t.segments,e)||!Sm(t.segments,e,i))return!1;for(let r in n.children)if(!t.children[r]||!ox(t.children[r],n.children[r],i))return!1;return!0}else{let r=e.slice(0,t.segments.length),o=e.slice(t.segments.length);return!Vo(t.segments,r)||!Sm(t.segments,r,i)||!t.children[ye]?!1:ax(t.children[ye],n,o,i)}}function Sm(t,n,e){return n.every((i,r)=>ix[e](t[r].parameters,i.parameters))}var on=class{root;queryParams;fragment;_queryParamMap;constructor(n=new Be([],{}),e={},i=null){this.root=n,this.queryParams=e,this.fragment=i}get queryParamMap(){return this._queryParamMap??=Bo(this.queryParams),this._queryParamMap}toString(){return uO.serialize(this)}},Be=class{segments;children;parent=null;constructor(n,e){this.segments=n,this.children=e,Object.values(e).forEach(i=>i.parent=this)}hasChildren(){return this.numberOfChildren>0}get numberOfChildren(){return Object.keys(this.children).length}toString(){return xm(this)}},Fr=class{path;parameters;_parameterMap;constructor(n,e){this.path=n,this.parameters=e}get parameterMap(){return this._parameterMap??=Bo(this.parameters),this._parameterMap}toString(){return lx(this)}};function cO(t,n){return Vo(t,n)&&t.every((e,i)=>Ii(e.parameters,n[i].parameters))}function Vo(t,n){return t.length!==n.length?!1:t.every((e,i)=>e.path===n[i].path)}function dO(t,n){let e=[];return Object.entries(t.children).forEach(([i,r])=>{i===ye&&(e=e.concat(n(r,i)))}),Object.entries(t.children).forEach(([i,r])=>{i!==ye&&(e=e.concat(n(r,i)))}),e}var ss=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:()=>new Lr})}return t})(),Lr=class{parse(n){let e=new iv(n);return new on(e.parseRootSegment(),e.parseQueryParams(),e.parseFragment())}serialize(n){let e=`/${ac(n.root,!0)}`,i=hO(n.queryParams),r=typeof n.fragment=="string"?`#${mO(n.fragment)}`:"";return`${e}${i}${r}`}},uO=new Lr;function xm(t){return t.segments.map(n=>lx(n)).join("/")}function ac(t,n){if(!t.hasChildren())return xm(t);if(n){let e=t.children[ye]?ac(t.children[ye],!1):"",i=[];return Object.entries(t.children).forEach(([r,o])=>{r!==ye&&i.push(`${r}:${ac(o,!1)}`)}),i.length>0?`${e}(${i.join("//")})`:e}else{let e=dO(t,(i,r)=>r===ye?[ac(t.children[ye],!1)]:[`${r}:${ac(i,!1)}`]);return Object.keys(t.children).length===1&&t.children[ye]!=null?`${xm(t)}/${e[0]}`:`${xm(t)}/(${e.join("//")})`}}function sx(t){return encodeURIComponent(t).replace(/%40/g,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",")}function Cm(t){return sx(t).replace(/%3B/gi,";")}function mO(t){return encodeURI(t)}function nv(t){return sx(t).replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/%26/gi,"&")}function Dm(t){return decodeURIComponent(t)}function YS(t){return Dm(t.replace(/\+/g,"%20"))}function lx(t){return`${nv(t.path)}${fO(t.parameters)}`}function fO(t){return Object.entries(t).map(([n,e])=>`;${nv(n)}=${nv(e)}`).join("")}function hO(t){let n=Object.entries(t).map(([e,i])=>Array.isArray(i)?i.map(r=>`${Cm(e)}=${Cm(r)}`).join("&"):`${Cm(e)}=${Cm(i)}`).filter(e=>e);return n.length?`?${n.join("&")}`:""}var pO=/^[^\/()?;#]+/;function Q_(t){let n=t.match(pO);return n?n[0]:""}var gO=/^[^\/()?;=#]+/;function _O(t){let n=t.match(gO);return n?n[0]:""}var vO=/^[^=?&#]+/;function bO(t){let n=t.match(vO);return n?n[0]:""}var yO=/^[^&#]+/;function CO(t){let n=t.match(yO);return n?n[0]:""}var iv=class{url;remaining;constructor(n){this.url=n,this.remaining=n}parseRootSegment(){for(;this.consumeOptional("/"););return this.remaining===""||this.peekStartsWith("?")||this.peekStartsWith("#")?new Be([],{}):new Be([],this.parseChildren())}parseQueryParams(){let n={};if(this.consumeOptional("?"))do this.parseQueryParam(n);while(this.consumeOptional("&"));return n}parseFragment(){return this.consumeOptional("#")?decodeURIComponent(this.remaining):null}parseChildren(n=0){if(n>50)throw new H(4010,!1);if(this.remaining==="")return{};this.consumeOptional("/");let e=[];for(this.peekStartsWith("(")||e.push(this.parseSegment());this.peekStartsWith("/")&&!this.peekStartsWith("//")&&!this.peekStartsWith("/(");)this.capture("/"),e.push(this.parseSegment());let i={};this.peekStartsWith("/(")&&(this.capture("/"),i=this.parseParens(!0,n));let r={};return this.peekStartsWith("(")&&(r=this.parseParens(!1,n)),(e.length>0||Object.keys(i).length>0)&&(r[ye]=new Be(e,i)),r}parseSegment(){let n=Q_(this.remaining);if(n===""&&this.peekStartsWith(";"))throw new H(4009,!1);return this.capture(n),new Fr(Dm(n),this.parseMatrixParams())}parseMatrixParams(){let n={};for(;this.consumeOptional(";");)this.parseParam(n);return n}parseParam(n){let e=_O(this.remaining);if(!e)return;this.capture(e);let i="";if(this.consumeOptional("=")){let r=Q_(this.remaining);r&&(i=r,this.capture(i))}n[Dm(e)]=Dm(i)}parseQueryParam(n){let e=bO(this.remaining);if(!e)return;this.capture(e);let i="";if(this.consumeOptional("=")){let a=CO(this.remaining);a&&(i=a,this.capture(i))}let r=YS(e),o=YS(i);if(Object.hasOwn(n,r)){let a=n[r];Array.isArray(a)||(a=[a],n[r]=a),a.push(o)}else n[r]=o}parseParens(n,e){let i=Object.create(null);for(this.capture("(");!this.consumeOptional(")")&&this.remaining.length>0;){let r=Q_(this.remaining),o=this.remaining[r.length];if(o!=="/"&&o!==")"&&o!==";")throw new H(4010,!1);let a;r.indexOf(":")>-1?(a=r.slice(0,r.indexOf(":")),this.capture(a),this.capture(":")):n&&(a=ye);let s=this.parseChildren(e+1);i[a??ye]=Object.keys(s).length===1&&s[ye]?s[ye]:new Be([],s),this.consumeOptional("//")}return i}peekStartsWith(n){return this.remaining.startsWith(n)}consumeOptional(n){return this.peekStartsWith(n)?(this.remaining=this.remaining.substring(n.length),!0):!1}capture(n){if(!this.consumeOptional(n))throw new H(4011,!1)}};function cx(t){return t.segments.length>0?new Be([],{[ye]:t}):t}function dx(t){let n=Object.create(null);for(let[i,r]of Object.entries(t.children)){let o=dx(r);if(i===ye&&o.segments.length===0&&o.hasChildren())for(let[a,s]of Object.entries(o.children))n[a]=s;else(o.segments.length>0||o.hasChildren())&&(n[i]=o)}let e=new Be(t.segments,n);return wO(e)}function wO(t){if(t.numberOfChildren===1&&t.children[ye]){let n=t.children[ye];return new Be(t.segments.concat(n.segments),n.children)}return t}function jr(t){return t instanceof on}function ux(t,n,e=null,i=null,r=new Lr){let o=mx(t);return fx(o,n,e,i,r)}function mx(t){let n;function e(o){let a={};for(let l of o.children){let d=e(l);a[l.outlet]=d}let s=new Be(o.url,a);return o===t&&(n=s),s}let i=e(t.root),r=cx(i);return n??r}function fx(t,n,e,i,r){let o=t;for(;o.parent;)o=o.parent;if(n.length===0)return X_(o,o,o,e,i,r);let a=SO(n);if(a.toRoot())return X_(o,o,new Be([],{}),e,i,r);let s=xO(a,o,t),l=s.processChildren?lc(s.segmentGroup,s.index,a.commands):px(s.segmentGroup,s.index,a.commands);return X_(o,s.segmentGroup,l,e,i,r)}function Mm(t){return typeof t=="object"&&t!=null&&!t.outlets&&!t.segmentPath}function uc(t){return typeof t=="object"&&t!=null&&t.outlets}function ZS(t,n,e){t||="\u0275";let i=new on;return i.queryParams={[t]:n},e.parse(e.serialize(i)).queryParams[t]}function X_(t,n,e,i,r,o){let a={};for(let[d,u]of Object.entries(i??{}))a[d]=Array.isArray(u)?u.map(h=>ZS(d,h,o)):ZS(d,u,o);let s;t===n?s=e:s=hx(t,n,e);let l=cx(dx(s));return new on(l,a,r)}function hx(t,n,e){let i=Object.create(null);return Object.entries(t.children).forEach(([r,o])=>{o===n?i[r]=e:i[r]=hx(o,n,e)}),new Be(t.segments,i)}var Im=class{isAbsolute;numberOfDoubleDots;commands;constructor(n,e,i){if(this.isAbsolute=n,this.numberOfDoubleDots=e,this.commands=i,n&&i.length>0&&Mm(i[0]))throw new H(4003,!1);let r=i.find(uc);if(r&&r!==oO(i))throw new H(4004,!1)}toRoot(){return this.isAbsolute&&this.commands.length===1&&this.commands[0]=="/"}};function SO(t){if(typeof t[0]=="string"&&t.length===1&&t[0]==="/")return new Im(!0,0,t);let n=0,e=!1,i=t.reduce((r,o,a)=>{if(typeof o=="object"&&o!=null){if(o.outlets){let s={};return Object.entries(o.outlets).forEach(([l,d])=>{s[l]=typeof d=="string"?d.split("/"):d}),[...r,{outlets:s}]}if(o.segmentPath)return[...r,o.segmentPath]}return typeof o!="string"?[...r,o]:a===0?(o.split("/").forEach((s,l)=>{l==0&&s==="."||(l==0&&s===""?e=!0:s===".."?n++:s!=""&&r.push(s))}),r):[...r,o]},[]);return new Im(e,n,i)}var Ja=class{segmentGroup;processChildren;index;constructor(n,e,i){this.segmentGroup=n,this.processChildren=e,this.index=i}};function xO(t,n,e){if(t.isAbsolute)return new Ja(n,!0,0);if(!e)return new Ja(n,!1,NaN);if(e.parent===null)return new Ja(e,!0,0);let i=Mm(t.commands[0])?0:1,r=e.segments.length-1+i;return DO(e,r,t.numberOfDoubleDots)}function DO(t,n,e){let i=t,r=n,o=e;for(;o>r;){if(o-=r,i=i.parent,!i)throw new H(4005,!1);r=i.segments.length}return new Ja(i,!1,r-o)}function EO(t){return uc(t[0])?t[0].outlets:{[ye]:t}}function px(t,n,e){if(t??=new Be([],{}),t.segments.length===0&&t.hasChildren())return lc(t,n,e);let i=MO(t,n,e),r=e.slice(i.commandIndex);if(i.match&&i.pathIndex<t.segments.length){let o=new Be(t.segments.slice(0,i.pathIndex),{});return o.children[ye]=new Be(t.segments.slice(i.pathIndex),t.children),lc(o,0,r)}else return i.match&&r.length===0?new Be(t.segments,{}):i.match&&!t.hasChildren()?rv(t,n,e):i.match?lc(t,0,r):rv(t,n,e)}function lc(t,n,e){if(e.length===0)return new Be(t.segments,{});{let i=EO(e),r=Object.create(null);if(Object.keys(i).some(o=>o!==ye)&&t.children[ye]&&t.numberOfChildren===1&&t.children[ye].segments.length===0){let o=lc(t.children[ye],n,e);return new Be(t.segments,o.children)}return Object.entries(i).forEach(([o,a])=>{typeof a=="string"&&(a=[a]),a!==null&&(r[o]=px(t.children[o],n,a))}),Object.entries(t.children).forEach(([o,a])=>{i[o]===void 0&&(r[o]=a)}),new Be(t.segments,r)}}function MO(t,n,e){let i=0,r=n,o={match:!1,pathIndex:0,commandIndex:0};for(;r<t.segments.length;){if(i>=e.length)return o;let a=t.segments[r],s=e[i];if(uc(s))break;let l=`${s}`,d=i<e.length-1?e[i+1]:null;if(r>0&&l===void 0)break;if(l&&d&&typeof d=="object"&&d.outlets===void 0){if(!XS(l,d,a))return o;i+=2}else{if(!XS(l,{},a))return o;i++}r++}return{match:!0,pathIndex:r,commandIndex:i}}function rv(t,n,e){let i=t.segments.slice(0,n),r=0;for(;r<e.length;){let o=e[r];if(uc(o)){let l=IO(o.outlets);return new Be(i,l)}if(r===0&&Mm(e[0])){let l=t.segments[n];i.push(new Fr(l.path,QS(e[0]))),r++;continue}let a=uc(o)?o.outlets[ye]:`${o}`,s=r<e.length-1?e[r+1]:null;a&&s&&Mm(s)?(i.push(new Fr(a,QS(s))),r+=2):(i.push(new Fr(a,{})),r++)}return new Be(i,{})}function IO(t){let n={};return Object.entries(t).forEach(([e,i])=>{typeof i=="string"&&(i=[i]),i!==null&&(n[e]=rv(new Be([],{}),0,i))}),n}function QS(t){let n={};return Object.entries(t).forEach(([e,i])=>n[e]=`${i}`),n}function XS(t,n,e){return t==e.path&&Ii(n,e.parameters)}var cc="imperative",Vt=(function(t){return t[t.NavigationStart=0]="NavigationStart",t[t.NavigationEnd=1]="NavigationEnd",t[t.NavigationCancel=2]="NavigationCancel",t[t.NavigationError=3]="NavigationError",t[t.RoutesRecognized=4]="RoutesRecognized",t[t.ResolveStart=5]="ResolveStart",t[t.ResolveEnd=6]="ResolveEnd",t[t.GuardsCheckStart=7]="GuardsCheckStart",t[t.GuardsCheckEnd=8]="GuardsCheckEnd",t[t.RouteConfigLoadStart=9]="RouteConfigLoadStart",t[t.RouteConfigLoadEnd=10]="RouteConfigLoadEnd",t[t.ChildActivationStart=11]="ChildActivationStart",t[t.ChildActivationEnd=12]="ChildActivationEnd",t[t.ActivationStart=13]="ActivationStart",t[t.ActivationEnd=14]="ActivationEnd",t[t.Scroll=15]="Scroll",t[t.NavigationSkipped=16]="NavigationSkipped",t})(Vt||{}),xn=class{id;url;constructor(n,e){this.id=n,this.url=e}},Ho=class extends xn{type=Vt.NavigationStart;navigationTrigger;restoredState;constructor(n,e,i="imperative",r=null){super(n,e),this.navigationTrigger=i,this.restoredState=r}toString(){return`NavigationStart(id: ${this.id}, url: '${this.url}')`}},Dn=class extends xn{urlAfterRedirects;type=Vt.NavigationEnd;constructor(n,e,i){super(n,e),this.urlAfterRedirects=i}toString(){return`NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`}},qt=(function(t){return t[t.Redirect=0]="Redirect",t[t.SupersededByNewNavigation=1]="SupersededByNewNavigation",t[t.NoDataFromResolver=2]="NoDataFromResolver",t[t.GuardRejected=3]="GuardRejected",t[t.Aborted=4]="Aborted",t})(qt||{}),mc=(function(t){return t[t.IgnoredSameUrlNavigation=0]="IgnoredSameUrlNavigation",t[t.IgnoredByUrlHandlingStrategy=1]="IgnoredByUrlHandlingStrategy",t})(mc||{}),Ln=class extends xn{reason;code;type=Vt.NavigationCancel;constructor(n,e,i,r){super(n,e),this.reason=i,this.code=r}toString(){return`NavigationCancel(id: ${this.id}, url: '${this.url}')`}};function gx(t){return t instanceof Ln&&(t.code===qt.Redirect||t.code===qt.SupersededByNewNavigation)}var rr=class extends xn{reason;code;type=Vt.NavigationSkipped;constructor(n,e,i,r){super(n,e),this.reason=i,this.code=r}},Uo=class extends xn{error;target;type=Vt.NavigationError;constructor(n,e,i,r){super(n,e),this.error=i,this.target=r}toString(){return`NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`}},fc=class extends xn{urlAfterRedirects;state;type=Vt.RoutesRecognized;constructor(n,e,i,r){super(n,e),this.urlAfterRedirects=i,this.state=r}toString(){return`RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}},Nm=class extends xn{urlAfterRedirects;state;type=Vt.GuardsCheckStart;constructor(n,e,i,r){super(n,e),this.urlAfterRedirects=i,this.state=r}toString(){return`GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}},Tm=class extends xn{urlAfterRedirects;state;shouldActivate;type=Vt.GuardsCheckEnd;constructor(n,e,i,r,o){super(n,e),this.urlAfterRedirects=i,this.state=r,this.shouldActivate=o}toString(){return`GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`}},km=class extends xn{urlAfterRedirects;state;type=Vt.ResolveStart;constructor(n,e,i,r){super(n,e),this.urlAfterRedirects=i,this.state=r}toString(){return`ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}},Am=class extends xn{urlAfterRedirects;state;type=Vt.ResolveEnd;constructor(n,e,i,r){super(n,e),this.urlAfterRedirects=i,this.state=r}toString(){return`ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`}},Rm=class{route;type=Vt.RouteConfigLoadStart;constructor(n){this.route=n}toString(){return`RouteConfigLoadStart(path: ${this.route.path})`}},Om=class{route;type=Vt.RouteConfigLoadEnd;constructor(n){this.route=n}toString(){return`RouteConfigLoadEnd(path: ${this.route.path})`}},Pm=class{snapshot;type=Vt.ChildActivationStart;constructor(n){this.snapshot=n}toString(){return`ChildActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`}},Fm=class{snapshot;type=Vt.ChildActivationEnd;constructor(n){this.snapshot=n}toString(){return`ChildActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`}},Lm=class{snapshot;type=Vt.ActivationStart;constructor(n){this.snapshot=n}toString(){return`ActivationStart(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`}},jm=class{snapshot;type=Vt.ActivationEnd;constructor(n){this.snapshot=n}toString(){return`ActivationEnd(path: '${this.snapshot.routeConfig&&this.snapshot.routeConfig.path||""}')`}};var ns=class{},hc=class{},is=class{url;navigationBehaviorOptions;constructor(n,e){this.url=n,this.navigationBehaviorOptions=e}};function NO(t){return!(t instanceof ns)&&!(t instanceof is)&&!(t instanceof hc)}var Vm=class{rootInjector;outlet=null;route=null;children;attachRef=null;get injector(){return this.route?.snapshot._environmentInjector??this.rootInjector}constructor(n){this.rootInjector=n,this.children=new zo(this.rootInjector)}resetChildren(){this.children=new zo(this.rootInjector)}},zo=(()=>{class t{rootInjector;contexts=new Map;constructor(e){this.rootInjector=e}onChildOutletCreated(e,i){let r=this.getOrCreateContext(e);r.outlet=i,this.contexts.set(e,r)}onChildOutletDestroyed(e){let i=this.getContext(e);i&&(i.outlet=null,i.attachRef=null)}onOutletDeactivated(){let e=this.contexts;return this.contexts=new Map,e}onOutletReAttached(e){this.contexts=e}getOrCreateContext(e){let i=this.getContext(e);return i||(i=new Vm(this.rootInjector),this.contexts.set(e,i)),i}getContext(e){return this.contexts.get(e)||null}static \u0275fac=function(i){return new(i||t)(te(qe))};static \u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),Bm=class{_root;constructor(n){this._root=n}get root(){return this._root.value}parent(n){let e=this.pathFromRoot(n);return e.length>1?e[e.length-2]:null}children(n){let e=ov(n,this._root);return e?e.children.map(i=>i.value):[]}firstChild(n){let e=ov(n,this._root);return e&&e.children.length>0?e.children[0].value:null}siblings(n){let e=av(n,this._root);return e.length<2?[]:e[e.length-2].children.map(r=>r.value).filter(r=>r!==n)}pathFromRoot(n){return av(n,this._root).map(e=>e.value)}};function ov(t,n){if(t===n.value)return n;for(let e of n.children){let i=ov(t,e);if(i)return i}return null}function av(t,n){if(t===n.value)return[n];for(let e of n.children){let i=av(t,e);if(i.length)return i.unshift(n),i}return[]}var Sn=class{value;children;constructor(n,e){this.value=n,this.children=e}toString(){return`TreeNode(${this.value})`}};function Ka(t){let n={};return t&&t.children.forEach(e=>n[e.value.outlet]=e),n}var pc=class extends Bm{snapshot;constructor(n,e){super(n),this.snapshot=e,vv(this,n)}toString(){return this.snapshot.toString()}};function _x(t,n){let e=TO(t,n),i=new Et([new Fr("",{})]),r=new Et({}),o=new Et({}),a=new Et({}),s=new Et(""),l=new En(i,r,a,s,o,ye,t,e.root);return l.snapshot=e.root,new pc(new Sn(l,[]),e)}function TO(t,n){let e={},i={},r={},a=new rs([],e,r,"",i,ye,t,null,{},n);return new gc("",new Sn(a,[]))}var En=class{urlSubject;paramsSubject;queryParamsSubject;fragmentSubject;dataSubject;outlet;component;snapshot;_futureSnapshot;_routerState;_paramMap;_queryParamMap;title;url;params;queryParams;fragment;data;resources;_localInjector;pending;paramsSignal;queryParamsSignal;paramMapSignal;queryParamMapSignal;fragmentSignal;dataSignal;constructor(n,e,i,r,o,a,s,l){this.urlSubject=n,this.paramsSubject=e,this.queryParamsSubject=i,this.fragmentSubject=r,this.dataSubject=o,this.outlet=a,this.component=s,this._futureSnapshot=l,this.title=this.dataSubject?.pipe(ee(d=>d[bc]))??ie(void 0),this.url=n,this.params=e,this.queryParams=i,this.fragment=r,this.data=o}get routeConfig(){return this._futureSnapshot.routeConfig}get root(){return this._routerState.root}get parent(){return this._routerState.parent(this)}get firstChild(){return this._routerState.firstChild(this)}get children(){return this._routerState.children(this)}get pathFromRoot(){return this._routerState.pathFromRoot(this)}get paramMap(){return this._paramMap??=this.params.pipe(ee(n=>Bo(n))),this._paramMap}get queryParamMap(){return this._queryParamMap??=this.queryParams.pipe(ee(n=>Bo(n))),this._queryParamMap}toString(){return this.snapshot?this.snapshot.toString():`Future(${this._futureSnapshot})`}_setPending(n){this._futureSnapshot=n,this.pending?.set(!0)}},kO="always";function _v(t,n,e){let i,{routeConfig:r}=t;return n!==null&&(e==="always"||r?.path===""||!n.component&&!n.routeConfig?.loadComponent)?i={params:y(y({},n.params),t.params),data:y(y({},n.data),t.data),resolve:y(y(y(y({},t.data),n.data),r?.data),t._resolvedData)}:i={params:y({},t.params),data:y({},t.data),resolve:y(y({},t.data),t._resolvedData??{})},r&&bx(r)&&(i.resolve[bc]=r.title),i}var rs=class{url;params;queryParams;fragment;data;outlet;component;routeConfig;_resolve;_resolvedData;_routerState;_paramMap;_queryParamMap;_environmentInjector;resources;get title(){return this.data?.[bc]}constructor(n,e,i,r,o,a,s,l,d,u){this.url=n,this.params=e,this.queryParams=i,this.fragment=r,this.data=o,this.outlet=a,this.component=s,this.routeConfig=l,this._resolve=d,this._environmentInjector=u}get root(){return this._routerState.root}get parent(){return this._routerState.parent(this)}get firstChild(){return this._routerState.firstChild(this)}get children(){return this._routerState.children(this)}get pathFromRoot(){return this._routerState.pathFromRoot(this)}get paramMap(){return this._paramMap??=Bo(this.params),this._paramMap}get queryParamMap(){return this._queryParamMap??=Bo(this.queryParams),this._queryParamMap}toString(){let n=this.url.map(i=>i.toString()).join("/"),e=this.routeConfig?this.routeConfig.path:"";return`Route(url:'${n}', path:'${e}')`}},gc=class extends Bm{url;constructor(n,e){super(e),this.url=n,vv(this,e)}toString(){return vx(this._root)}};function vv(t,n){n.value._routerState=t,n.children.forEach(e=>vv(t,e))}function vx(t){let n=t.children.length>0?` { ${t.children.map(vx).join(", ")} } `:"";return`${t.value}${n}`}function K_(t){if(t.snapshot){let n=t.snapshot,e=t._futureSnapshot;t.snapshot=e,Ii(n.queryParams,e.queryParams)||t.queryParamsSubject.next(e.queryParams),n.fragment!==e.fragment&&t.fragmentSubject.next(e.fragment),Ii(n.params,e.params)||t.paramsSubject.next(e.params),rO(n.url,e.url)||t.urlSubject.next(e.url),Ii(n.data,e.data)||t.dataSubject.next(e.data)}else t.snapshot=t._futureSnapshot,t.dataSubject.next(t._futureSnapshot.data)}function sv(t,n){let e=Ii(t.params,n.params)&&cO(t.url,n.url),i=!t.parent!=!n.parent;return e&&!i&&(!t.parent||sv(t.parent,n.parent))}function bx(t){return typeof t.title=="string"||t.title===null}var yx=new C(""),yc=(()=>{class t{activated=null;get activatedComponentRef(){return this.activated}_activatedRoute=null;name=ye;activateEvents=new O;deactivateEvents=new O;attachEvents=new O;detachEvents=new O;routerOutletData=Lo();parentContexts=c(zo);location=c(pt);changeDetector=c(Me);inputBinder=c($m,{optional:!0});supportsBindingToComponentInputs=!0;ngOnChanges(e){if(e.name){let{firstChange:i,previousValue:r}=e.name;if(i)return;this.isTrackedInParentContexts(r)&&(this.deactivate(),this.parentContexts.onChildOutletDestroyed(r)),this.initializeOutletWithName()}}ngOnDestroy(){this.isTrackedInParentContexts(this.name)&&this.parentContexts.onChildOutletDestroyed(this.name),this.inputBinder?.unsubscribeFromRouteData(this)}isTrackedInParentContexts(e){return this.parentContexts.getContext(e)?.outlet===this}ngOnInit(){this.initializeOutletWithName()}initializeOutletWithName(){if(this.parentContexts.onChildOutletCreated(this.name,this),this.activated)return;let e=this.parentContexts.getContext(this.name);e?.route&&(e.attachRef?this.attach(e.attachRef,e.route):this.activateWith(e.route,e.injector))}get isActivated(){return!!this.activated}get component(){if(!this.activated)throw new H(4012,!1);return this.activated.instance}get activatedRoute(){if(!this.activated)throw new H(4012,!1);return this._activatedRoute}get activatedRouteData(){return this._activatedRoute?this._activatedRoute.snapshot.data:{}}detach(){if(!this.activated)throw new H(4012,!1);this.location.detach();let e=this.activated;return this.activated=null,this._activatedRoute=null,this.detachEvents.emit(e.instance),e}attach(e,i){this.activated=e,this._activatedRoute=i,this.location.insert(e.hostView),this.inputBinder?.bindActivatedRouteToOutletComponent(this,this.location.injector),this.attachEvents.emit(e.instance)}deactivate(){if(this.activated){let e=this.component;this.activated.destroy(),this.activated=null,this._activatedRoute=null,this.deactivateEvents.emit(e)}}activateWith(e,i){if(this.isActivated)throw new H(4013,!1);this._activatedRoute=e;let r=this.location,a=e.snapshot.component,s=this.parentContexts.getOrCreateContext(this.name).children,l=new lv(e,s,r.injector,this.routerOutletData);this.activated=r.createComponent(a,{index:r.length,injector:l,environmentInjector:i}),this.changeDetector.markForCheck(),this.inputBinder?.bindActivatedRouteToOutletComponent(this,this.location.injector),this.activateEvents.emit(this.activated.instance)}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["router-outlet"]],inputs:{name:"name",routerOutletData:[1,"routerOutletData"]},outputs:{activateEvents:"activate",deactivateEvents:"deactivate",attachEvents:"attach",detachEvents:"detach"},exportAs:["outlet"],features:[Ne]})}return t})(),lv=class{route;childContexts;parent;outletData;constructor(n,e,i,r){this.route=n,this.childContexts=e,this.parent=i,this.outletData=r}get(n,e){return n===En?this.route:n===zo?this.childContexts:n===yx?this.outletData:this.parent.get(n,e)}},$m=new C("");var bv=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["ng-component"]],exportAs:["emptyRouterOutlet"],decls:1,vars:0,template:function(i,r){i&1&&V(0,"router-outlet")},dependencies:[yc],encapsulation:2,changeDetection:1})}return t})();function yv(t){let n=t.children&&t.children.map(yv),e=n?J(y({},t),{children:n}):y({},t);return!e.component&&!e.loadComponent&&(n||e.loadChildren)&&e.outlet&&e.outlet!==ye&&(e.component=bv),e}function AO(t,n,e){let i=new Set,r=_c(t,n._root,e?e._root:void 0,i);return{newlyCreatedRoutes:i,state:new pc(r,n)}}function _c(t,n,e,i){if(e&&t.shouldReuseRoute(n.value,e.value.snapshot)){let r=e.value;r._setPending(n.value);let o=RO(t,n,e,i);return new Sn(r,o)}else{if(t.shouldAttach(n.value)){let a=t.retrieve(n.value);if(a!==null){let s=a.route;return s.value._setPending(n.value),s.children=n.children.map(l=>_c(t,l,void 0,i)),s}}let r=OO(n.value);r._setPending(n.value),i.add(r);let o=n.children.map(a=>_c(t,a,void 0,i));return new Sn(r,o)}}function RO(t,n,e,i){return n.children.map(r=>{for(let o of e.children)if(t.shouldReuseRoute(r.value,o.value.snapshot))return _c(t,r,o,i);return _c(t,r,void 0,i)})}function OO(t){return new En(new Et(t.url),new Et(t.params),new Et(t.queryParams),new Et(t.fragment),new Et(t.data),t.outlet,t.component,t)}var os=class{redirectTo;navigationBehaviorOptions;constructor(n,e){this.redirectTo=n,this.navigationBehaviorOptions=e}},Cx="ngNavigationCancelingError";function Hm(t,n){let{redirectTo:e,navigationBehaviorOptions:i}=jr(n)?{redirectTo:n,navigationBehaviorOptions:void 0}:n,r=wx(!1,qt.Redirect);return r.url=e,r.navigationBehaviorOptions=i,r}function wx(t,n){let e=new Error(`NavigationCancelingError: ${t||""}`);return e[Cx]=!0,e.cancellationCode=n,e}function PO(t){return Sx(t)&&jr(t.url)}function Sx(t){return!!t&&t[Cx]}var cv=class{routeReuseStrategy;futureState;currState;forwardEvent;inputBindingEnabled;constructor(n,e,i,r,o){this.routeReuseStrategy=n,this.futureState=e,this.currState=i,this.forwardEvent=r,this.inputBindingEnabled=o}activate(n){let e=this.futureState._root,i=this.currState?this.currState._root:null;this.deactivateChildRoutes(e,i,n),K_(this.futureState.root),this.activateChildRoutes(e,i,n)}deactivateChildRoutes(n,e,i){let r=Ka(e);n.children.forEach(o=>{let a=o.value.outlet;this.deactivateRoutes(o,r[a],i),delete r[a]}),Object.values(r).forEach(o=>{this.deactivateRouteAndItsChildren(o,i)})}deactivateRoutes(n,e,i){let r=n.value,o=e?e.value:null;if(r===o)if(r.component){let a=i.getContext(r.outlet);a&&this.deactivateChildRoutes(n,e,a.children)}else this.deactivateChildRoutes(n,e,i);else o&&this.deactivateRouteAndItsChildren(e,i)}deactivateRouteAndItsChildren(n,e){n.value.component&&this.routeReuseStrategy.shouldDetach(n.value.snapshot)?this.detachAndStoreRouteSubtree(n,e):this.deactivateRouteAndOutlet(n,e)}detachAndStoreRouteSubtree(n,e){let i=e.getContext(n.value.outlet),r=i&&n.value.component?i.children:e,o=Ka(n);for(let a of Object.values(o))this.deactivateRouteAndItsChildren(a,r);if(i&&i.outlet){let a=i.outlet.detach(),s=i.children.contexts;i.resetChildren(),this.routeReuseStrategy.store(n.value.snapshot,{componentRef:a,route:n,contexts:s})}}deactivateRouteAndOutlet(n,e){let i=e.getContext(n.value.outlet),r=i&&n.value.component?i.children:e,o=Ka(n);for(let a of Object.values(o))this.deactivateRouteAndItsChildren(a,r);i&&(i.outlet&&(i.outlet.deactivate(),i.children.onOutletDeactivated()),i.attachRef=null,i.route=null),n.value._localInjector?.destroy()}activateChildRoutes(n,e,i){let r=Ka(e);n.children.forEach(o=>{this.activateRoutes(o,r[o.value.outlet],i),this.forwardEvent(new jm(o.value.snapshot))}),n.children.length&&this.forwardEvent(new Fm(n.value.snapshot))}activateRoutes(n,e,i){let r=n.value,o=e?e.value:null;if(K_(r),r===o)if(r.component){let a=i.getOrCreateContext(r.outlet);this.activateChildRoutes(n,e,a.children)}else this.activateChildRoutes(n,e,i);else if(r.component){let a=i.getOrCreateContext(r.outlet);if(this.routeReuseStrategy.shouldAttach(r.snapshot)){let s=this.routeReuseStrategy.retrieve(r.snapshot);this.routeReuseStrategy.store(r.snapshot,null),a.children.onOutletReAttached(s.contexts),a.attachRef=s.componentRef,a.route=s.route.value,a.outlet&&a.outlet.attach(s.componentRef,s.route.value),K_(s.route.value),this.activateChildRoutes(n,null,a.children)}else a.attachRef=null,a.route=r,a.outlet&&a.outlet.activateWith(r,a.injector),this.activateChildRoutes(n,null,a.children)}else this.activateChildRoutes(n,null,i)}},Um=class{path;route;constructor(n){this.path=n,this.route=this.path[this.path.length-1]}},es=class{component;route;constructor(n,e){this.component=n,this.route=e}};function FO(t,n,e){let i=t._root,r=n?n._root:null;return sc(i,r,e,[i.value])}function LO(t){let n=t.routeConfig?t.routeConfig.canActivateChild:null;return!n||n.length===0?null:{node:t,guards:n}}function ls(t,n){let e=Symbol(),i=n.get(t,e);return i===e?typeof t=="function"&&!dp(t)?t:n.get(t):i}function sc(t,n,e,i,r={canDeactivateChecks:[],canActivateChecks:[]}){let o=Ka(n);return t.children.forEach(a=>{jO(a,o[a.value.outlet],e,i.concat([a.value]),r),delete o[a.value.outlet]}),Object.entries(o).forEach(([a,s])=>dc(s,e.getContext(a),e,r)),r}function jO(t,n,e,i,r={canDeactivateChecks:[],canActivateChecks:[]}){let o=t.value,a=n?n.value:null,s=e?e.getContext(t.value.outlet):null;if(a&&o.routeConfig===a.routeConfig){let l=VO(a,o,o.routeConfig.runGuardsAndResolvers);l?r.canActivateChecks.push(new Um(i)):(o.data=a.data,o._resolvedData=a._resolvedData),o.component?sc(t,n,s?s.children:null,i,r):sc(t,n,e,i,r),l&&s&&s.outlet&&s.outlet.isActivated&&r.canDeactivateChecks.push(new es(s.outlet.component,a))}else a&&dc(n,s,e,r),r.canActivateChecks.push(new Um(i)),o.component?sc(t,null,s?s.children:null,i,r):sc(t,null,e,i,r);return r}function VO(t,n,e){if(typeof e=="function")return Ot(n._environmentInjector,()=>e(t,n));switch(e){case"pathParamsChange":return!Vo(t.url,n.url);case"pathParamsOrQueryParamsChange":return!Vo(t.url,n.url)||!Ii(t.queryParams,n.queryParams);case"always":return!0;case"paramsOrQueryParamsChange":return!sv(t,n)||!Ii(t.queryParams,n.queryParams);default:return!sv(t,n)}}function dc(t,n,e,i){let r=Ka(t),o=t.value;Object.entries(r).forEach(([a,s])=>{o.component?n?dc(s,n.children.getContext(a),n.children,i):dc(s,null,null,i):dc(s,e?e.getContext(a):null,e,i)}),o.component?n&&n.outlet&&n.outlet.isActivated?i.canDeactivateChecks.push(new es(n.outlet.component,o)):i.canDeactivateChecks.push(new es(null,o)):i.canDeactivateChecks.push(new es(null,o))}function Cc(t){return typeof t=="function"}function BO(t){return typeof t=="boolean"}function HO(t){return t&&Cc(t.canLoad)}function UO(t){return t&&Cc(t.canActivate)}function zO(t){return t&&Cc(t.canActivateChild)}function $O(t){return t&&Cc(t.canDeactivate)}function WO(t){return t&&Cc(t.canMatch)}function xx(t){return t instanceof Vi||t?.name==="EmptyError"}var wm=Symbol("INITIAL_VALUE");function as(){return _t(t=>il(t.map(n=>n.pipe(je(1),Ze(wm)))).pipe(ee(n=>{for(let e of n)if(e!==!0){if(e===wm)return wm;if(e===!1||GO(e))return e}return!0}),me(n=>n!==wm),je(1)))}function GO(t){return jr(t)||t instanceof os}function Dx(t){return t.aborted?ie(void 0).pipe(je(1)):new de(n=>{let e=()=>{n.next(),n.complete()};return t.addEventListener("abort",e),()=>t.removeEventListener("abort",e)})}function Ex(t){return pe(Dx(t))}function qO(t){return Pt(n=>{let{targetSnapshot:e,currentSnapshot:i,guards:{canActivateChecks:r,canDeactivateChecks:o}}=n;return o.length===0&&r.length===0?ie(J(y({},n),{guardsResult:!0})):YO(o,e,i).pipe(Pt(a=>a&&BO(a)?ZO(e,r,t):ie(a)),ee(a=>J(y({},n),{guardsResult:a})))})}function YO(t,n,e){return st(t).pipe(Pt(i=>eP(i.component,i.route,e,n)),Bi(i=>i!==!0,!0))}function ZO(t,n,e){return st(n).pipe(mo(i=>pi(XO(i.route.parent,e),QO(i.route,e),JO(t,i.path),KO(t,i.route))),Bi(i=>i!==!0,!0))}function QO(t,n){return t!==null&&n&&n(new Lm(t)),ie(!0)}function XO(t,n){return t!==null&&n&&n(new Pm(t)),ie(!0)}function KO(t,n){let e=n.routeConfig?n.routeConfig.canActivate:null;if(!e||e.length===0)return ie(!0);let i=e.map(r=>Yn(()=>{let o=n._environmentInjector,a=ls(r,o),s=UO(a)?a.canActivate(n,t):Ot(o,()=>a(n,t));return $o(s).pipe(Bi())}));return ie(i).pipe(as())}function JO(t,n){let e=n[n.length-1],r=n.slice(0,n.length-1).reverse().map(o=>LO(o)).filter(o=>o!==null).map(o=>Yn(()=>{let a=o.guards.map(s=>{let l=o.node._environmentInjector,d=ls(s,l),u=zO(d)?d.canActivateChild(e,t):Ot(l,()=>d(e,t));return $o(u).pipe(Bi())});return ie(a).pipe(as())}));return ie(r).pipe(as())}function eP(t,n,e,i){let r=n&&n.routeConfig?n.routeConfig.canDeactivate:null;if(!r||r.length===0)return ie(!0);let o=r.map(a=>{let s=n._environmentInjector,l=ls(a,s),d=$O(l)?l.canDeactivate(t,n,e,i):Ot(s,()=>l(t,n,e,i));return $o(d).pipe(Bi())});return ie(o).pipe(as())}function tP(t,n,e,i,r){let o=n.canLoad;if(o===void 0||o.length===0)return ie(!0);let a=o.map(s=>{let l=ls(s,t),d=HO(l)?l.canLoad(n,e):Ot(t,()=>l(n,e)),u=$o(d);return r?u.pipe(Ex(r)):u});return ie(a).pipe(as(),Mx(i))}function Mx(t){return ud(Ft(n=>{if(typeof n!="boolean")throw Hm(t,n)}),ee(n=>n===!0))}function nP(t,n,e,i,r,o){let a=n.canMatch;if(!a||a.length===0)return ie(!0);let s=a.map(l=>{let d=ls(l,t),u=WO(d)?d.canMatch(n,e,r):Ot(t,()=>d(n,e,r));return $o(u).pipe(Ex(o))});return ie(s).pipe(as(),Mx(i))}var ir=class t extends Error{segmentGroup;constructor(n){super(),this.segmentGroup=n||null,Object.setPrototypeOf(this,t.prototype)}},vc=class t extends Error{urlTree;constructor(n){super(),this.urlTree=n,Object.setPrototypeOf(this,t.prototype)}};function iP(t){throw new H(4e3,!1)}function rP(t){throw wx(!1,qt.GuardRejected)}var dv=class{urlSerializer;urlTree;constructor(n,e){this.urlSerializer=n,this.urlTree=e}lineralizeSegments(n,e){return P(this,null,function*(){let i=[],r=e.root;for(;;){if(i=i.concat(r.segments),r.numberOfChildren===0)return i;if(r.numberOfChildren>1||!r.children[ye])throw iP(`${n.redirectTo}`);r=r.children[ye]}})}applyRedirectCommands(n,e,i,r,o){return P(this,null,function*(){let a=yield oP(e,r,o);if(a instanceof on)throw new vc(a);let s=this.applyRedirectCreateUrlTree(a,this.urlSerializer.parse(a),n,i);if(a[0]==="/")throw new vc(s);return s})}applyRedirectCreateUrlTree(n,e,i,r){let o=this.createSegmentGroup(n,e.root,i,r);return new on(o,this.createQueryParams(e.queryParams,this.urlTree.queryParams),e.fragment)}createQueryParams(n,e){let i={};return Object.entries(n).forEach(([r,o])=>{if(typeof o=="string"&&o[0]===":"){let s=o.substring(1);i[r]=e[s]}else i[r]=o}),i}createSegmentGroup(n,e,i,r){let o=this.createSegments(n,e.segments,i,r),a=Object.create(null);return Object.entries(e.children).forEach(([s,l])=>{a[s]=this.createSegmentGroup(n,l,i,r)}),new Be(o,a)}createSegments(n,e,i,r){return e.map(o=>o.path[0]===":"?this.findPosParam(n,o,r):this.findOrReturn(o,i))}findPosParam(n,e,i){let r=i[e.path.substring(1)];if(!r)throw new H(4001,!1);return r}findOrReturn(n,e){let i=0;for(let r of e){if(r.path===n.path)return e.splice(i),r;i++}return n}};function oP(t,n,e){if(typeof t=="string")return Promise.resolve(t);let i=t;return Em($o(Ot(e,()=>i(n))))}function aP(t,n){return t.providers&&!t._injector&&(t._injector=$l(t.providers,n,`Route: ${t.path}`)),t._injector??n}function si(t){return t.outlet||ye}function sP(t,n){let e=t.filter(i=>si(i)===n);return e.push(...t.filter(i=>si(i)!==n)),e}var uv={matched:!1,consumedSegments:[],remainingSegments:[],parameters:{},positionalParamSegments:{}};function Ix(t){return{routeConfig:t.routeConfig,url:t.url,params:t.params,queryParams:t.queryParams,fragment:t.fragment,data:t.data,outlet:t.outlet,title:t.title,paramMap:t.paramMap,queryParamMap:t.queryParamMap}}function lP(t,n,e,i,r,o,a){let s=Nx(t,n,e);if(!s.matched)return ie(s);let l=Ix(o(s));return i=aP(n,i),nP(i,n,e,r,l,a).pipe(ee(d=>d===!0?s:y({},uv)))}function Nx(t,n,e){if(n.path==="")return n.pathMatch==="full"&&(t.hasChildren()||e.length>0)?y({},uv):{matched:!0,consumedSegments:[],remainingSegments:e,parameters:{},positionalParamSegments:{}};let r=(n.matcher||ex)(e,t,n);if(!r)return y({},uv);let o={};Object.entries(r.posParams??{}).forEach(([s,l])=>{o[s]=l.path});let a=r.consumed.length>0?y(y({},o),r.consumed[r.consumed.length-1].parameters):o;return{matched:!0,consumedSegments:r.consumed,remainingSegments:e.slice(r.consumed.length),parameters:a,positionalParamSegments:r.posParams??{}}}function KS(t,n,e,i,r){return e.length>0&&uP(t,e,i,r)?{segmentGroup:new Be(n,dP(i,new Be(e,t.children))),slicedSegments:[]}:e.length===0&&mP(t,e,i)?{segmentGroup:new Be(t.segments,cP(t,e,i,t.children)),slicedSegments:e}:{segmentGroup:new Be(t.segments,t.children),slicedSegments:e}}function cP(t,n,e,i){let r={};for(let o of e)if(Wm(t,n,o)&&!i[si(o)]){let a=new Be([],{});r[si(o)]=a}return y(y({},i),r)}function dP(t,n){let e={};e[ye]=n;for(let i of t)if(i.path===""&&si(i)!==ye){let r=new Be([],{});e[si(i)]=r}return e}function uP(t,n,e,i){return e.some(r=>!Wm(t,n,r)||!(si(r)!==ye)?!1:!(i!==void 0&&si(r)===i))}function mP(t,n,e){return e.some(i=>Wm(t,n,i))}function Wm(t,n,e){return(t.hasChildren()||n.length>0)&&e.pathMatch==="full"?!1:e.path===""}function fP(t,n,e){return n.length===0&&!t.children[e]}var mv=class{};function hP(t,n,e,i,r,o,a,s){return P(this,null,function*(){return new fv(t,n,e,i,r,a,o,s).recognize()})}var pP=31,fv=class{injector;configLoader;rootComponentType;config;urlTree;paramsInheritanceStrategy;urlSerializer;abortSignal;applyRedirects;absoluteRedirectCount=0;allowRedirects=!0;constructor(n,e,i,r,o,a,s,l){this.injector=n,this.configLoader=e,this.rootComponentType=i,this.config=r,this.urlTree=o,this.paramsInheritanceStrategy=a,this.urlSerializer=s,this.abortSignal=l,this.applyRedirects=new dv(this.urlSerializer,this.urlTree)}noMatchError(n){return new H(4002,`'${n.segmentGroup}'`)}recognize(){return P(this,null,function*(){let n=KS(this.urlTree.root,[],[],this.config).segmentGroup,{children:e,rootSnapshot:i}=yield this.match(n),r=new Sn(i,e),o=new gc("",r),a=ux(i,[],this.urlTree.queryParams,this.urlTree.fragment);return a.queryParams=this.urlTree.queryParams,o.url=this.urlSerializer.serialize(a),{state:o,tree:a}})}match(n){return P(this,null,function*(){let e=new rs([],Object.freeze({}),Object.freeze(y({},this.urlTree.queryParams)),this.urlTree.fragment,Object.freeze({}),ye,this.rootComponentType,null,{},this.injector);try{return{children:yield this.processSegmentGroup(this.injector,this.config,n,ye,e),rootSnapshot:e}}catch(i){if(i instanceof vc)return this.urlTree=i.urlTree,this.match(i.urlTree.root);throw i instanceof ir?this.noMatchError(i):i}})}processSegmentGroup(n,e,i,r,o){return P(this,null,function*(){if(i.segments.length===0&&i.hasChildren())return this.processChildren(n,e,i,o);let a=yield this.processSegment(n,e,i,i.segments,r,!0,o);return a instanceof Sn?[a]:[]})}processChildren(n,e,i,r){return P(this,null,function*(){let o=[];for(let l of Object.keys(i.children))l==="primary"?o.unshift(l):o.push(l);let a=[];for(let l of o){let d=i.children[l],u=sP(e,l),h=yield this.processSegmentGroup(n,u,d,l,r);a.push(...h)}let s=Tx(a);return gP(s),s})}processSegment(n,e,i,r,o,a,s){return P(this,null,function*(){for(let l of e)try{return yield this.processSegmentAgainstRoute(l._injector??n,e,l,i,r,o,a,s)}catch(d){if(d instanceof ir||xx(d))continue;throw d}if(fP(i,r,o))return new mv;throw new ir(i)})}processSegmentAgainstRoute(n,e,i,r,o,a,s,l){return P(this,null,function*(){if(si(i)!==a&&(a===ye||!Wm(r,o,i)))throw new ir(r);if(i.redirectTo===void 0)return this.matchSegmentAgainstRoute(n,r,i,o,a,l);if(this.allowRedirects&&s)return this.expandSegmentAgainstRouteUsingRedirect(n,r,e,i,o,a,l);throw new ir(r)})}expandSegmentAgainstRouteUsingRedirect(n,e,i,r,o,a,s){return P(this,null,function*(){let{matched:l,parameters:d,consumedSegments:u,positionalParamSegments:h,remainingSegments:_}=Nx(e,r,o);if(!l)throw new ir(e);typeof r.redirectTo=="string"&&r.redirectTo[0]==="/"&&(this.absoluteRedirectCount++,this.absoluteRedirectCount>pP&&(this.allowRedirects=!1));let v=this.createSnapshot(n,r,o,d,s);if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);let S=yield this.applyRedirects.applyRedirectCommands(u,r.redirectTo,h,Ix(v),n),A=yield this.applyRedirects.lineralizeSegments(r,S);return this.processSegment(n,i,e,A.concat(_),a,!1,s)})}createSnapshot(n,e,i,r,o){let a=new rs(i,r,Object.freeze(y({},this.urlTree.queryParams)),this.urlTree.fragment,vP(e),si(e),e.component??e._loadedComponent??null,e,bP(e),n),s=_v(a,o,this.paramsInheritanceStrategy);return a.params=Object.freeze(s.params),a.data=Object.freeze(s.data),a}matchSegmentAgainstRoute(n,e,i,r,o,a){return P(this,null,function*(){if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);let s=kt=>this.createSnapshot(n,i,kt.consumedSegments,kt.parameters,a),l=yield Em(lP(e,i,r,n,this.urlSerializer,s,this.abortSignal));if(i.path==="**"&&(e.children={}),!l?.matched)throw new ir(e);n=i._injector??n;let{routes:d}=yield this.getChildConfig(n,i,r),u=i._loadedInjector??n,{parameters:h,consumedSegments:_,remainingSegments:v}=l,S=this.createSnapshot(n,i,_,h,a),{segmentGroup:A,slicedSegments:oe}=KS(e,_,v,d,o);if(oe.length===0&&A.hasChildren()){let kt=yield this.processChildren(u,d,A,S);return new Sn(S,kt)}if(d.length===0&&oe.length===0)return new Sn(S,[]);let ae=si(i)===o,Ke=yield this.processSegment(u,d,A,oe,ae?ye:o,!0,S);return new Sn(S,Ke instanceof Sn?[Ke]:[])})}getChildConfig(n,e,i){return P(this,null,function*(){if(e.children)return{routes:e.children,injector:n};if(e.loadChildren){if(e._loadedRoutes!==void 0){let o=e._loadedNgModuleFactory;return o&&!e._loadedInjector&&(e._loadedInjector=o.create(n).injector),{routes:e._loadedRoutes,injector:e._loadedInjector}}if(this.abortSignal.aborted)throw new Error(this.abortSignal.reason);if(yield Em(tP(n,e,i,this.urlSerializer,this.abortSignal))){let o=yield this.configLoader.loadChildren(n,e);return e._loadedRoutes=o.routes,e._loadedInjector=o.injector,e._loadedNgModuleFactory=o.factory,o}throw rP(e)}return{routes:[],injector:n}})}};function gP(t){t.sort((n,e)=>n.value.outlet===ye?-1:e.value.outlet===ye?1:n.value.outlet.localeCompare(e.value.outlet))}function _P(t){let n=t.value.routeConfig;return n&&n.path===""}function Tx(t){let n=[],e=new Set;for(let i of t){if(!_P(i)){n.push(i);continue}let r=n.find(o=>i.value.routeConfig===o.value.routeConfig);r!==void 0?(r.children.push(...i.children),e.add(r)):n.push(i)}for(let i of e){let r=Tx(i.children);n.push(new Sn(i.value,r))}return n.filter(i=>!e.has(i))}function vP(t){return t.data||{}}function bP(t){return t.resolve||{}}function yP(t,n,e,i,r,o,a){return Pt(s=>P(null,null,function*(){let{state:l,tree:d}=yield hP(t,n,e,i,s.extractedUrl,r,o,a);return J(y({},s),{targetSnapshot:l,urlAfterRedirects:d})}))}function CP(t){return Pt(n=>{let{targetSnapshot:e,guards:{canActivateChecks:i}}=n;if(!i.length)return ie(n);let r=new Set(i.map(s=>s.route)),o=new Set;for(let s of r)if(!o.has(s))for(let l of kx(s))o.add(l);let a=0;return st(o).pipe(mo(s=>r.has(s)?wP(s,e,t):(s.data=_v(s,s.parent,t).resolve,ie(void 0))),Ft(()=>a++),Od(1),Pt(s=>a===o.size?ie(n):at))})}function kx(t){let n=t.children.map(e=>kx(e)).flat();return[t,...n]}function wP(t,n,e){let i=t.routeConfig,r=t._resolve;return i?.title!==void 0&&!bx(i)&&(r[bc]=i.title),Yn(()=>(t.data=_v(t,t.parent,e).resolve,SP(r,t,n).pipe(ee(o=>(t._resolvedData=o,t.data=y(y({},t.data),o),null)))))}function SP(t,n,e){let i=ev(t);if(i.length===0)return ie({});let r={};return st(i).pipe(Pt(o=>xP(t[o],n,e).pipe(Bi(),Ft(a=>{if(a instanceof os)throw Hm(new Lr,a);r[o]=a}))),Od(1),ee(()=>r),Cr(o=>xx(o)?at:tl(o)))}function xP(t,n,e){let i=n._environmentInjector,r=ls(t,i),o=r.resolve?r.resolve(n,e):Ot(i,()=>r(n,e));return $o(o)}var Ax=new C("");function hv(t){return _t(n=>{let e=t(n);return e?st(e).pipe(ee(()=>n)):ie(n)})}var Cv=(()=>{class t{buildTitle(e){let i,r=e.root;for(;r!==void 0;)i=this.getResolvedTitleForRoute(r)??i,r=r.children.find(o=>o.outlet===ye);return i}getResolvedTitleForRoute(e){return e.data[bc]}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:()=>c(Rx)})}return t})(),Rx=(()=>{class t extends Cv{title;constructor(e){super(),this.title=e}updateTitle(e){let i=this.buildTitle(e);i!==void 0&&this.title.setTitle(i)}static \u0275fac=function(i){return new(i||t)(te(GS))};static \u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})(),cs=new C("",{factory:()=>({})}),wc=new C(""),Ox=(()=>{class t{componentLoaders=new WeakMap;childrenLoaders=new WeakMap;onLoadStartListener;onLoadEndListener;compiler=c(M_);loadComponent(e,i){return P(this,null,function*(){if(this.componentLoaders.get(i))return this.componentLoaders.get(i);if(i._loadedComponent)return Promise.resolve(i._loadedComponent);this.onLoadStartListener&&this.onLoadStartListener(i);let r=P(this,null,function*(){try{let o=yield nx(Ot(e,()=>i.loadComponent())),a=yield Fx(k_(o));return this.onLoadEndListener&&this.onLoadEndListener(i),i._loadedComponent=a,a}finally{this.componentLoaders.delete(i)}});return this.componentLoaders.set(i,r),r})}loadChildren(e,i){if(this.childrenLoaders.get(i))return this.childrenLoaders.get(i);if(i._loadedRoutes)return Promise.resolve({routes:i._loadedRoutes,injector:i._loadedInjector});this.onLoadStartListener&&this.onLoadStartListener(i);let r=P(this,null,function*(){try{let o=yield Px(i,this.compiler,e,this.onLoadEndListener);return i._loadedRoutes=o.routes,i._loadedInjector=o.injector,i._loadedNgModuleFactory=o.factory,o}finally{this.childrenLoaders.delete(i)}});return this.childrenLoaders.set(i,r),r}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function Px(t,n,e,i){return P(this,null,function*(){let r=yield nx(Ot(e,()=>t.loadChildren())),o=yield Fx(k_(r)),a;o instanceof Xu||Array.isArray(o)?a=o:a=yield n.compileModuleAsync(o),i&&i(t);let s,l,d=!1,u;return Array.isArray(a)?(l=a,d=!0):(s=a.create(e).injector,u=a,l=s.get(wc,[],{optional:!0,self:!0}).flat()),{routes:l.map(yv),injector:s,factory:u}})}function Fx(t){return P(this,null,function*(){return t})}var Gm=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:()=>c(DP)})}return t})(),DP=(()=>{class t{shouldProcessUrl(e){return!0}extract(e){return e}merge(e,i){return e}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),Lx=new C("");var EP=()=>{},jx=new C(""),Vx=(()=>{class t{currentNavigation=T(null,{equal:()=>!1});currentTransition=null;lastSuccessfulNavigation=T(null);events=new I;transitionAbortWithErrorSubject=new I;configLoader=c(Ox);environmentInjector=c(qe);destroyRef=c(Je);urlSerializer=c(ss);rootContexts=c(zo);location=c(Pr);inputBindingEnabled=c($m,{optional:!0})!==null;titleStrategy=c(Cv);options=c(cs,{optional:!0})||{};paramsInheritanceStrategy=this.options.paramsInheritanceStrategy||kO;urlHandlingStrategy=c(Gm);createViewTransition=c(Lx,{optional:!0});navigationErrorHandler=c(jx,{optional:!0});routerResourcesFeature=c(Ax,{optional:!0});navigationId=0;get hasRequestedNavigation(){return this.navigationId!==0}transitions;afterPreactivation=()=>ie(void 0);rootComponentType=null;destroyed=!1;constructor(){let e=r=>this.events.next(new Rm(r)),i=r=>this.events.next(new Om(r));this.configLoader.onLoadEndListener=i,this.configLoader.onLoadStartListener=e,this.destroyRef.onDestroy(()=>{this.destroyed=!0})}complete(){this.transitions?.complete()}handleNavigationRequest(e){let i=++this.navigationId;Ee(()=>{this.transitions?.next(J(y({},e),{extractedUrl:this.urlHandlingStrategy.extract(e.rawUrl),targetSnapshot:null,targetRouterState:null,guards:{canActivateChecks:[],canDeactivateChecks:[]},guardsResult:null,id:i,routesRecognizeHandler:{},beforeActivateHandler:{}}))})}setupNavigations(e){return this.transitions=new Et(null),this.transitions.pipe(me(i=>i!==null),_t(i=>{let r=!0,o=!1,a=new AbortController,s=()=>!o&&this.currentTransition?.id===i.id;return ie(i).pipe(_t(l=>{if(this.navigationId>i.id)return this.cancelNavigationTransition(i,"",qt.SupersededByNewNavigation),at;this.currentTransition=i;let d=this.lastSuccessfulNavigation();this.currentNavigation.set({id:l.id,initialUrl:l.rawUrl,extractedUrl:l.extractedUrl,targetBrowserUrl:typeof l.extras.browserUrl=="string"?this.urlSerializer.parse(l.extras.browserUrl):l.extras.browserUrl,trigger:l.source,extras:l.extras,previousNavigation:d?J(y({},d),{previousNavigation:null}):null,abort:()=>a.abort(),routesRecognizeHandler:l.routesRecognizeHandler,beforeActivateHandler:l.beforeActivateHandler});let u=!e.navigated||this.isUpdatingInternalState()||this.isUpdatedBrowserUrl(),h=l.extras.onSameUrlNavigation??e.onSameUrlNavigation;if(!u&&h!=="reload")return this.events.next(new rr(l.id,this.urlSerializer.serialize(l.rawUrl),"",mc.IgnoredSameUrlNavigation)),l.resolve(!1),at;if(this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))return ie(l).pipe(_t(_=>(this.events.next(new Ho(_.id,this.urlSerializer.serialize(_.extractedUrl),_.source,_.restoredState)),_.id!==this.navigationId?at:Promise.resolve(_))),yP(this.environmentInjector,this.configLoader,this.rootComponentType,e.config,this.urlSerializer,this.paramsInheritanceStrategy,a.signal),Ft(_=>{i.targetSnapshot=_.targetSnapshot,i.urlAfterRedirects=_.urlAfterRedirects,this.currentNavigation.update(v=>(v.finalUrl=_.urlAfterRedirects,v)),this.events.next(new hc)}),_t(_=>st(i.routesRecognizeHandler.deferredHandle??ie(void 0)).pipe(ee(()=>_))),Ft(()=>{let _=new fc(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot);this.events.next(_)}));if(u&&this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)){let{id:_,extractedUrl:v,source:S,restoredState:A,extras:oe}=l,ae=new Ho(_,this.urlSerializer.serialize(v),S,A);this.events.next(ae);let Ke=_x(this.rootComponentType,this.environmentInjector).snapshot;return this.currentTransition=i=J(y({},l),{targetSnapshot:Ke,urlAfterRedirects:v,extras:J(y({},oe),{skipLocationChange:!1,replaceUrl:!1})}),this.currentNavigation.update(kt=>(kt.finalUrl=v,kt)),ie(i)}else return this.events.next(new rr(l.id,this.urlSerializer.serialize(l.extractedUrl),"",mc.IgnoredByUrlHandlingStrategy)),l.resolve(!1),at}),ee(l=>{let d=new Nm(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot);return this.events.next(d),this.currentTransition=i=J(y({},l),{guards:FO(l.targetSnapshot,l.currentSnapshot,this.rootContexts)}),i}),qO(l=>this.events.next(l)),_t(l=>{if(i.guardsResult=l.guardsResult,l.guardsResult&&typeof l.guardsResult!="boolean")throw Hm(this.urlSerializer,l.guardsResult);let d=new Tm(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot,!!l.guardsResult);if(this.events.next(d),!s())return at;if(!l.guardsResult)return this.cancelNavigationTransition(l,"",qt.GuardRejected),at;if(l.guards.canActivateChecks.length===0)return ie(l);let u=new km(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot);if(this.events.next(u),!s())return at;let h=!1;return ie(l).pipe(CP(this.paramsInheritanceStrategy),Ft({next:()=>{h=!0;let _=new Am(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects),l.targetSnapshot);this.events.next(_)},complete:()=>{h||this.cancelNavigationTransition(l,"",qt.NoDataFromResolver)}}))}),hv(l=>{let d=h=>{let _=[];if(h.routeConfig?._loadedComponent)h.component=h.routeConfig?._loadedComponent;else if(h.routeConfig?.loadComponent){let v=h._environmentInjector;_.push(this.configLoader.loadComponent(v,h.routeConfig).then(S=>{h.component=S}))}for(let v of h.children)_.push(...d(v));return _},u=d(l.targetSnapshot.root);return u.length===0?ie(l):st(Promise.all(u).then(()=>l))}),_t(l=>{let{newlyCreatedRoutes:d,state:u}=AO(e.routeReuseStrategy,l.targetSnapshot,l.currentRouterState);return this.currentTransition=i=l=J(y({},l),{targetRouterState:u,newlyCreatedRoutes:d}),this.currentNavigation.update(h=>(h.targetRouterState=u,h)),ie(l)}),this.routerResourcesFeature?.setupAndRunResources(a.signal)??(l=>l),hv(()=>this.afterPreactivation()),_t(()=>{let{currentSnapshot:l,targetSnapshot:d}=i,u=this.createViewTransition?.(this.environmentInjector,l.root,d.root,i.hasUAVisualTransition);return u?st(u).pipe(ee(()=>i)):ie(i)}),je(1),_t(l=>{r=!1,this.events.next(new ns);let d=i.beforeActivateHandler.deferredHandle;return d?st(d.then(()=>l)):ie(l)}),Ft(l=>{new cv(e.routeReuseStrategy,i.targetRouterState,i.currentRouterState,d=>this.events.next(d),this.inputBindingEnabled).activate(this.rootContexts),l.newlyCreatedRoutes?.clear(),s()&&(Bx(l.targetRouterState),o=!0,this.currentNavigation.update(d=>(d.abort=EP,d)),this.lastSuccessfulNavigation.set(Ee(this.currentNavigation)),this.events.next(new Dn(l.id,this.urlSerializer.serialize(l.extractedUrl),this.urlSerializer.serialize(l.urlAfterRedirects))),this.titleStrategy?.updateTitle(l.targetRouterState.snapshot),l.resolve(!0))}),pe(Dx(a.signal).pipe(me(()=>!o&&r),Ft(()=>{this.cancelNavigationTransition(i,a.signal.reason+"",qt.Aborted)}))),Ft({complete:()=>{o=!0}}),pe(this.transitionAbortWithErrorSubject.pipe(Ft(l=>{throw l}))),fo(()=>{a.abort(),o||this.cancelNavigationTransition(i,"",qt.SupersededByNewNavigation),this.currentTransition?.id===i.id&&(this.currentNavigation.set(null),this.currentTransition=null)}),Cr(l=>{if(o=!0,JS(i),this.destroyed)return i.resolve(!1),at;if(Sx(l))this.events.next(new Ln(i.id,this.urlSerializer.serialize(i.extractedUrl),l.message,l.cancellationCode)),PO(l)?this.events.next(new is(l.url,l.navigationBehaviorOptions)):i.resolve(!1);else{let d=new Uo(i.id,this.urlSerializer.serialize(i.extractedUrl),l,i.targetSnapshot??void 0);try{let u=Ot(this.environmentInjector,()=>this.navigationErrorHandler?.(d));if(u instanceof os){let{message:h,cancellationCode:_}=Hm(this.urlSerializer,u);this.events.next(new Ln(i.id,this.urlSerializer.serialize(i.extractedUrl),h,_)),this.events.next(new is(u.redirectTo,u.navigationBehaviorOptions))}else throw this.events.next(d),l}catch(u){this.options.resolveNavigationPromiseOnError?i.resolve(!1):i.reject(u)}}return at}))}))}cancelNavigationTransition(e,i,r){JS(e);let o=new Ln(e.id,this.urlSerializer.serialize(e.extractedUrl),i,r);this.events.next(o),e.resolve(!1)}isUpdatingInternalState(){return this.currentTransition?.extractedUrl.toString()!==this.currentTransition?.currentUrlTree.toString()}isUpdatedBrowserUrl(){let e=this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))),i=Ee(this.currentNavigation),r=i?.targetBrowserUrl??i?.extractedUrl;return e.toString()!==r?.toString()&&!i?.extras.skipLocationChange}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function MP(t){return t!==cc}function JS(t){for(let n of t.newlyCreatedRoutes??[])n._localInjector?.destroy(),n._localInjector=void 0;Bx(t.targetRouterState)}function Bx(t){if(!t)return;let n=e=>{e.value.pending?.set(!1),e.children.forEach(n)};n(t._root)}var Hx=new C("");var Ux=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:()=>c(IP)})}return t})(),zm=class{shouldDetach(n){return!1}store(n,e){}shouldAttach(n){return!1}retrieve(n){return null}shouldReuseRoute(n,e){return n.routeConfig===e.routeConfig}shouldDestroyInjector(n){return!0}},IP=(()=>{class t extends zm{static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),qm=(()=>{class t{urlSerializer=c(ss);options=c(cs,{optional:!0})||{};canceledNavigationResolution=this.options.canceledNavigationResolution||"replace";location=c(Pr);urlHandlingStrategy=c(Gm);urlUpdateStrategy=this.options.urlUpdateStrategy||"deferred";currentUrlTree=new on;getCurrentUrlTree(){return this.currentUrlTree}rawUrlTree=this.currentUrlTree;getRawUrlTree(){return this.rawUrlTree}createBrowserPath({finalUrl:e,initialUrl:i,targetBrowserUrl:r}){let o=e!==void 0?this.urlHandlingStrategy.merge(e,i):i,a=r??o;return a instanceof on?this.urlSerializer.serialize(a):a}routerUrlState(e){return e?.targetBrowserUrl===void 0||e?.finalUrl===void 0?{}:{\u0275routerUrl:this.urlSerializer.serialize(e.finalUrl)}}commitTransition({targetRouterState:e,finalUrl:i,initialUrl:r}){i&&e?(this.currentUrlTree=i,this.rawUrlTree=this.urlHandlingStrategy.merge(i,r),this.routerState=e):this.rawUrlTree=r}routerState=_x(null,c(qe));getRouterState(){return this.routerState}_stateMemento=this.createStateMemento();get stateMemento(){return this._stateMemento}updateStateMemento(){this._stateMemento=this.createStateMemento()}createStateMemento(){return{rawUrlTree:this.rawUrlTree,currentUrlTree:this.currentUrlTree,routerState:this.routerState}}restoredState(){return this.location.getState()}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:()=>c(NP)})}return t})(),NP=(()=>{class t extends qm{currentPageId=0;lastSuccessfulId=-1;get browserPageId(){return this.canceledNavigationResolution!=="computed"?this.currentPageId:this.restoredState()?.\u0275routerPageId??this.currentPageId}registerNonRouterCurrentEntryChangeListener(e){return this.location.subscribe(i=>{i.type==="popstate"&&setTimeout(()=>{e(i.url,i.state,"popstate",{replaceUrl:!0},i.hasUAVisualTransition)})})}handleRouterEvent(e,i){e instanceof Ho?this.updateStateMemento():e instanceof rr?this.commitTransition(i):e instanceof fc?this.urlUpdateStrategy==="eager"&&(i.extras.skipLocationChange||this.setBrowserUrl(this.createBrowserPath(i),i)):e instanceof ns?(this.commitTransition(i),this.urlUpdateStrategy==="deferred"&&!i.extras.skipLocationChange&&this.setBrowserUrl(this.createBrowserPath(i),i)):e instanceof Ln&&!gx(e)?this.restoreHistory(i):e instanceof Uo?this.restoreHistory(i,!0):e instanceof Dn&&(this.lastSuccessfulId=e.id,this.currentPageId=this.browserPageId)}setBrowserUrl(e,i){let{extras:r,id:o}=i,{replaceUrl:a,state:s}=r;if(this.location.isCurrentPathEqualTo(e)||a){let l=this.browserPageId,d=y(y({},s),this.generateNgRouterState(o,l,i));this.location.replaceState(e,"",d)}else{let l=y(y({},s),this.generateNgRouterState(o,this.browserPageId+1,i));this.location.go(e,"",l)}}restoreHistory(e,i=!1){if(this.canceledNavigationResolution==="computed"){let r=this.browserPageId,o=this.currentPageId-r;o!==0?this.location.historyGo(o):this.getCurrentUrlTree()===e.finalUrl&&o===0&&(this.resetInternalState(e),this.resetUrlToCurrentUrlTree())}else this.canceledNavigationResolution==="replace"&&(i&&this.resetInternalState(e),this.resetUrlToCurrentUrlTree())}resetInternalState({finalUrl:e}){this.routerState=this.stateMemento.routerState,this.currentUrlTree=this.stateMemento.currentUrlTree,this.rawUrlTree=this.urlHandlingStrategy.merge(this.currentUrlTree,e??this.rawUrlTree)}resetUrlToCurrentUrlTree(){this.location.replaceState(this.urlSerializer.serialize(this.getRawUrlTree()),"",this.generateNgRouterState(this.lastSuccessfulId,this.currentPageId))}generateNgRouterState(e,i,r){return this.canceledNavigationResolution==="computed"?y({navigationId:e,\u0275routerPageId:i},this.routerUrlState(r)):y({navigationId:e},this.routerUrlState(r))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function wv(t,n){t.events.pipe(me(e=>e instanceof Dn||e instanceof Ln||e instanceof Uo||e instanceof rr),ee(e=>e instanceof Dn||e instanceof rr?0:(e instanceof Ln?e.code===qt.Redirect||e.code===qt.SupersededByNewNavigation:!1)?2:1),me(e=>e!==2),je(1)).subscribe(()=>{n()})}var an=(()=>{class t{get currentUrlTree(){return this.stateManager.getCurrentUrlTree()}get rawUrlTree(){return this.stateManager.getRawUrlTree()}disposed=!1;nonRouterCurrentEntryChangeSubscription;console=c(Ju);stateManager=c(qm);options=c(cs,{optional:!0})||{};pendingTasks=c(qi);urlUpdateStrategy=this.options.urlUpdateStrategy||"deferred";navigationTransitions=c(Vx);urlSerializer=c(ss);location=c(Pr);urlHandlingStrategy=c(Gm);injector=c(qe);_events=new I;get events(){return this._events}get routerState(){return this.stateManager.getRouterState()}navigated=!1;routeReuseStrategy=c(Ux);injectorCleanup=c(Hx,{optional:!0});onSameUrlNavigation=this.options.onSameUrlNavigation||"ignore";config=c(wc,{optional:!0})?.flat()??[];componentInputBindingEnabled=!!c($m,{optional:!0});currentNavigation=this.navigationTransitions.currentNavigation.asReadonly();constructor(){this.resetConfig(this.config),this.navigationTransitions.setupNavigations(this).subscribe({error:e=>{}}),this.subscribeToNavigationEvents()}eventsSubscription=new ue;subscribeToNavigationEvents(){let e=this.navigationTransitions.events.subscribe(i=>{try{let r=this.navigationTransitions.currentTransition,o=Ee(this.navigationTransitions.currentNavigation);if(r!==null&&o!==null){if(this.stateManager.handleRouterEvent(i,o),i instanceof Ln&&i.code!==qt.Redirect&&i.code!==qt.SupersededByNewNavigation)this.navigated=!0;else if(i instanceof Dn)this.navigated=!0,this.injectorCleanup?.(this.routeReuseStrategy,this.routerState,this.config);else if(i instanceof is){let a=i.navigationBehaviorOptions,s=this.urlHandlingStrategy.merge(i.url,r.currentRawUrl),l=y({scroll:r.extras.scroll,browserUrl:r.extras.browserUrl,info:r.extras.info,skipLocationChange:r.extras.skipLocationChange,replaceUrl:r.extras.replaceUrl||this.urlUpdateStrategy==="eager"||MP(r.source)},a);this.scheduleNavigation(s,cc,null,l,r.hasUAVisualTransition,{resolve:r.resolve,reject:r.reject,promise:r.promise})}}NO(i)&&this._events.next(i)}catch(r){this.navigationTransitions.transitionAbortWithErrorSubject.next(r)}});this.eventsSubscription.add(e)}resetRootComponentType(e){this.routerState.root.component=e,this.navigationTransitions.rootComponentType=e}initialNavigation(){this.setUpLocationChangeListener(),this.navigationTransitions.hasRequestedNavigation||this.navigateToSyncWithBrowser(this.location.path(!0),cc,this.stateManager.restoredState(),{replaceUrl:!0})}setUpLocationChangeListener(){this.nonRouterCurrentEntryChangeSubscription??=this.stateManager.registerNonRouterCurrentEntryChangeListener((e,i,r,o,a)=>{this.navigateToSyncWithBrowser(e,r,i,o,a)})}navigateToSyncWithBrowser(e,i,r,o,a){let s=r?.navigationId?r:null,l=r?.\u0275routerUrl??e;if(r?.\u0275routerUrl&&(o=J(y({},o),{browserUrl:e})),r){let u=y({},r);delete u.navigationId,delete u.\u0275routerPageId,delete u.\u0275routerUrl,Object.keys(u).length!==0&&(o.state=u)}let d=this.parseUrl(l);this.scheduleNavigation(d,i,s,o,a).catch(u=>{this.disposed||this.injector.get(On)(u)})}get url(){return this.serializeUrl(this.currentUrlTree)}getCurrentNavigation(){return Ee(this.navigationTransitions.currentNavigation)}get lastSuccessfulNavigation(){return this.navigationTransitions.lastSuccessfulNavigation}resetConfig(e){this.config=e.map(yv),this.navigated=!1}ngOnDestroy(){this.dispose()}dispose(){this._events.unsubscribe(),this.navigationTransitions.complete(),this.nonRouterCurrentEntryChangeSubscription?.unsubscribe(),this.nonRouterCurrentEntryChangeSubscription=void 0,this.disposed=!0,this.eventsSubscription.unsubscribe()}createUrlTree(e,i={}){let{relativeTo:r,queryParams:o,fragment:a,queryParamsHandling:s,preserveFragment:l}=i,d=l?this.currentUrlTree.fragment:a,u=null;switch(s??this.options.defaultQueryParamsHandling){case"merge":u=y(y({},this.currentUrlTree.queryParams),o);break;case"preserve":u=this.currentUrlTree.queryParams;break;default:u=o||null}u!==null&&(u=this.removeEmptyProps(u));let h;try{let _=r?r.snapshot:this.routerState.snapshot.root;h=mx(_)}catch(_){(typeof e[0]!="string"||e[0][0]!=="/")&&(e=[]),h=this.currentUrlTree.root}return fx(h,e,u,d??null,this.urlSerializer)}navigateByUrl(e,i={skipLocationChange:!1}){let r=jr(e)?e:this.parseUrl(e),o=this.urlHandlingStrategy.merge(r,this.rawUrlTree);return this.scheduleNavigation(o,cc,null,i)}navigate(e,i={skipLocationChange:!1}){return TP(e),this.navigateByUrl(this.createUrlTree(e,i),i)}serializeUrl(e){return this.urlSerializer.serialize(e)}parseUrl(e){try{return this.urlSerializer.parse(e)}catch(i){return this.console.warn(_i(4018,!1)),this.urlSerializer.parse("/")}}isActive(e,i){let r;if(i===!0?r=y({},pv):i===!1?r=y({},ts):r=y(y({},ts),i),jr(e))return tv(this.currentUrlTree,e,r);let o=this.parseUrl(e);return tv(this.currentUrlTree,o,r)}removeEmptyProps(e){return Object.entries(e).reduce((i,[r,o])=>(o!=null&&(i[r]=o),i),{})}scheduleNavigation(e,i,r,o,a,s){if(this.disposed)return Promise.resolve(!1);let l,d,u;s?(l=s.resolve,d=s.reject,u=s.promise):u=new Promise((_,v)=>{l=_,d=v});let h=this.pendingTasks.add();return wv(this,()=>{queueMicrotask(()=>this.pendingTasks.remove(h))}),this.navigationTransitions.handleNavigationRequest({source:i,restoredState:r,currentUrlTree:this.currentUrlTree,currentRawUrl:this.currentUrlTree,rawUrl:e,extras:o,hasUAVisualTransition:a,resolve:l,reject:d,promise:u,currentSnapshot:this.routerState.snapshot,currentRouterState:this.routerState}),u.catch(Promise.reject.bind(Promise))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function TP(t){for(let n=0;n<t.length;n++)if(t[n]==null)throw new H(4008,!1)}var AP=(()=>{class t{router=c(an);stateManager=c(qm);fragment=T("");queryParams=T({});path=T("");serializer=c(ss);constructor(){this.updateState(),this.router.events?.subscribe(e=>{e instanceof Dn&&this.updateState()})}updateState(){let{fragment:e,root:i,queryParams:r}=this.stateManager.getCurrentUrlTree();this.fragment.set(e),this.queryParams.set(r),this.path.set(this.serializer.serialize(new on(i)))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),Ni=(()=>{class t{router;route;tabIndexAttribute;renderer;el;locationStrategy;hrefAttributeValue=c(new wn("href"),{optional:!0});reactiveHref=om(()=>this.isAnchorElement?this.computeHref(this._urlTree()):this.hrefAttributeValue);get href(){return Ee(this.reactiveHref)}set href(e){this.reactiveHref.set(e)}set target(e){this._target.set(e)}get target(){return Ee(this._target)}_target=T(void 0);set queryParams(e){this._queryParams.set(e)}get queryParams(){return Ee(this._queryParams)}_queryParams=T(void 0,{equal:()=>!1});set fragment(e){this._fragment.set(e)}get fragment(){return Ee(this._fragment)}_fragment=T(void 0);set queryParamsHandling(e){this._queryParamsHandling.set(e)}get queryParamsHandling(){return Ee(this._queryParamsHandling)}_queryParamsHandling=T(void 0);set state(e){this._state.set(e)}get state(){return Ee(this._state)}_state=T(void 0,{equal:()=>!1});set info(e){this._info.set(e)}get info(){return Ee(this._info)}_info=T(void 0,{equal:()=>!1});set relativeTo(e){this._relativeTo.set(e)}get relativeTo(){return Ee(this._relativeTo)}_relativeTo=T(void 0);set preserveFragment(e){this._preserveFragment.set(e)}get preserveFragment(){return Ee(this._preserveFragment)}_preserveFragment=T(!1);set skipLocationChange(e){this._skipLocationChange.set(e)}get skipLocationChange(){return Ee(this._skipLocationChange)}_skipLocationChange=T(!1);set replaceUrl(e){this._replaceUrl.set(e)}get replaceUrl(){return Ee(this._replaceUrl)}_replaceUrl=T(!1);browserUrl=Lo(void 0);isAnchorElement;onChanges=new I;applicationErrorHandler=c(On);options=c(cs,{optional:!0});reactiveRouterState=c(AP);constructor(e,i,r,o,a,s){this.router=e,this.route=i,this.tabIndexAttribute=r,this.renderer=o,this.el=a,this.locationStrategy=s;let l=a.nativeElement.tagName?.toLowerCase();this.isAnchorElement=l==="a"||l==="area"||!!(typeof customElements=="object"&&customElements.get(l)?.observedAttributes?.includes?.("href"))}setTabIndexIfNotOnNativeEl(e){this.tabIndexAttribute!=null||this.isAnchorElement||this.applyAttributeValue("tabindex",e)}ngOnChanges(e){this.onChanges.next(this)}routerLinkInput=T(null);set routerLink(e){e==null?(this.routerLinkInput.set(null),this.setTabIndexIfNotOnNativeEl(null)):(jr(e)?this.routerLinkInput.set(e):this.routerLinkInput.set(Array.isArray(e)?e:[e]),this.setTabIndexIfNotOnNativeEl("0"))}onClick(e,i,r,o,a){let s=this._urlTree();if(s===null||this.isAnchorElement&&(e!==0||i||r||o||a||typeof this.target=="string"&&this.target!="_self"))return!0;let l=this.browserUrl(),d=y({skipLocationChange:this.skipLocationChange,replaceUrl:this.replaceUrl,state:this.state,info:this.info},l!==void 0&&{browserUrl:l});return this.router.navigateByUrl(s,d)?.catch(u=>{this.applicationErrorHandler(u)}),!this.isAnchorElement}ngOnDestroy(){}applyAttributeValue(e,i){let r=this.renderer,o=this.el.nativeElement;i!==null?r.setAttribute(o,e,i):r.removeAttribute(o,e)}_urlTree=ke(()=>{this.reactiveRouterState.path(),this._preserveFragment()&&this.reactiveRouterState.fragment();let e=r=>r==="preserve"||r==="merge";(e(this._queryParamsHandling())||e(this.options?.defaultQueryParamsHandling))&&this.reactiveRouterState.queryParams();let i=this.routerLinkInput();return i===null||!this.router.createUrlTree?null:jr(i)?i:this.router.createUrlTree(i,{relativeTo:this._relativeTo()!==void 0?this._relativeTo():this.route,queryParams:this._queryParams(),fragment:this._fragment(),queryParamsHandling:this._queryParamsHandling(),preserveFragment:this._preserveFragment()})},{equal:(e,i)=>this.computeHref(e)===this.computeHref(i)});get urlTree(){return Ee(this._urlTree)}computeHref(e){return e!==null&&this.locationStrategy?this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(e))??"":null}static \u0275fac=function(i){return new(i||t)(ne(an),ne(En),Fl("tabindex"),ne(xe),ne(L),ne(Ya))};static \u0275dir=R({type:t,selectors:[["","routerLink",""]],hostVars:2,hostBindings:function(i,r){i&1&&w("click",function(a){return r.onClick(a.button,a.ctrlKey,a.shiftKey,a.altKey,a.metaKey)}),i&2&&j("href",r.reactiveHref(),Zg)("target",r._target())},inputs:{target:"target",queryParams:"queryParams",fragment:"fragment",queryParamsHandling:"queryParamsHandling",state:"state",info:"info",relativeTo:"relativeTo",preserveFragment:[2,"preserveFragment","preserveFragment",Y],skipLocationChange:[2,"skipLocationChange","skipLocationChange",Y],replaceUrl:[2,"replaceUrl","replaceUrl",Y],browserUrl:[1,"browserUrl"],routerLink:"routerLink"},features:[Ne]})}return t})(),Sv=(()=>{class t{router;element;renderer;cdr;links;classes=[];routerEventsSubscription;linkInputChangesSubscription;_isActive=!1;get isActive(){return this._isActive}routerLinkActiveOptions={exact:!1};ariaCurrentWhenActive;isActiveChange=new O;link=c(Ni,{optional:!0});constructor(e,i,r,o){this.router=e,this.element=i,this.renderer=r,this.cdr=o,this.routerEventsSubscription=e.events.subscribe(a=>{a instanceof Dn&&this.update()})}ngAfterContentInit(){ie(this.links.changes,ie(null)).pipe(yr()).subscribe(e=>{this.update(),this.subscribeToEachLinkOnChanges()})}subscribeToEachLinkOnChanges(){this.linkInputChangesSubscription?.unsubscribe();let e=[...this.links.toArray(),this.link].filter(i=>!!i).map(i=>i.onChanges);this.linkInputChangesSubscription=st(e).pipe(yr()).subscribe(i=>{this._isActive!==this.isLinkActive(this.router)(i)&&this.update()})}set routerLinkActive(e){if(e==null){this.classes=[];return}let i=Array.isArray(e)?e:e.split(" ");this.classes=i.filter(r=>!!r)}ngOnChanges(e){this.update()}ngOnDestroy(){this.routerEventsSubscription.unsubscribe(),this.linkInputChangesSubscription?.unsubscribe()}update(){!this.links||!this.router.navigated||this.routerLinkActiveOptions===null&&!this._isActive||queueMicrotask(()=>{let e=this.hasActiveLinks();this.classes.forEach(i=>{e?this.renderer.addClass(this.element.nativeElement,i):this.renderer.removeClass(this.element.nativeElement,i)}),e&&this.ariaCurrentWhenActive!==void 0?this.renderer.setAttribute(this.element.nativeElement,"aria-current",this.ariaCurrentWhenActive.toString()):this.renderer.removeAttribute(this.element.nativeElement,"aria-current"),this._isActive!==e&&(this._isActive=e,this.cdr.markForCheck(),this.isActiveChange.emit(e))})}isLinkActive(e){let i=this.routerLinkActiveOptions;if(i===null)return()=>!1;let r;return i===void 0?r=y({},ts):RP(i)?r=i:i.exact??!1?r=y({},pv):r=y({},ts),o=>{let a=o.urlTree;return a?Ee(gv(a,e,r)):!1}}hasActiveLinks(){let e=this.isLinkActive(this.router);return this.link&&e(this.link)||this.links.some(e)}static \u0275fac=function(i){return new(i||t)(ne(an),ne(L),ne(xe),ne(Me))};static \u0275dir=R({type:t,selectors:[["","routerLinkActive",""]],contentQueries:function(i,r,o){if(i&1&&dt(o,Ni,5),i&2){let a;U(a=z())&&(r.links=a)}},inputs:{routerLinkActiveOptions:"routerLinkActiveOptions",ariaCurrentWhenActive:"ariaCurrentWhenActive",routerLinkActive:"routerLinkActive"},outputs:{isActiveChange:"isActiveChange"},exportAs:["routerLinkActive"],features:[Ne]})}return t})();function RP(t){let n=t;return!!(n.paths||n.matrixParams||n.queryParams||n.fragment)}var OP=new C("");function xv(t,...n){return $i([{provide:wc,multi:!0,useValue:t},{provide:En,useFactory:PP},{provide:Wl,multi:!0,useFactory:FP},n.map(e=>e.\u0275providers)])}function PP(){return c(an).routerState.root}function FP(){let t=c(K);return n=>{let e=t.get(rn);if(n!==e.components[0])return;let i=t.get(an),r=t.get(LP);t.get(jP)===1&&i.initialNavigation(),t.get(VP,null,{optional:!0})?.setUpPreloading(),t.get(OP,null,{optional:!0})?.init(),i.resetRootComponentType(e.componentTypes[0]),r.closed||(r.next(),r.complete(),r.unsubscribe())}}var LP=new C("",{factory:()=>new I}),jP=new C("",{factory:()=>1});var VP=new C("");var Dv;try{Dv=typeof Intl<"u"&&Intl.v8BreakIterator}catch(t){Dv=!1}var Ce=(()=>{class t{_platformId=c(No);isBrowser=this._platformId?SS(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||Dv)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function ds(t){return Array.isArray(t)?t:[t]}var zx=new Set,Wo,us=(()=>{class t{_platform=c(Ce);_nonce=c(Tr,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):HP}matchMedia(e){return(this._platform.WEBKIT||this._platform.BLINK)&&BP(e,this._nonce),this._matchMedia(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function BP(t,n){if(!zx.has(t))try{Wo||(Wo=document.createElement("style"),n&&Wo.setAttribute("nonce",n),Wo.setAttribute("type","text/css"),document.head.appendChild(Wo)),Wo.sheet&&(Wo.sheet.insertRule(`@media ${t.replace(/[{}]/g,"")} {body{ }}`,0),zx.add(t))}catch(e){console.error(e)}}function HP(t){return{matches:t==="all"||t==="",media:t,addListener:()=>{},removeListener:()=>{}}}var Go=(()=>{class t{_mediaMatcher=c(us);_zone=c($);_queries=new Map;_destroySubject=new I;ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(e){return $x(ds(e)).some(r=>this._registerQuery(r).mql.matches)}observe(e){let r=$x(ds(e)).map(a=>this._registerQuery(a).observable),o=il(r);return o=pi(o.pipe(je(1)),o.pipe(ho(1),Zn(0))),o.pipe(ee(a=>{let s={matches:!1,breakpoints:{}};return a.forEach(({matches:l,query:d})=>{s.matches=s.matches||l,s.breakpoints[d]=l}),s}))}_registerQuery(e){if(this._queries.has(e))return this._queries.get(e);let i=this._mediaMatcher.matchMedia(e),o={observable:new de(a=>{let s=l=>this._zone.run(()=>a.next(l));return i.addListener(s),()=>{i.removeListener(s)}}).pipe(Ze(i),ee(({matches:a})=>({query:e,matches:a})),pe(this._destroySubject)),mql:i};return this._queries.set(e,o),o}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function $x(t){return t.map(n=>n.split(",")).reduce((n,e)=>n.concat(e)).map(n=>n.trim())}function Ym(t){t||(t=c(Je));let n=new de(e=>{if(t.destroyed){e.next();return}return t.onDestroy(e.next.bind(e))});return e=>e.pipe(pe(n))}function Zm(t,n){let i=!n?.manualCleanup?n?.injector?.get(Je)??c(Je):null,r=zP(n?.equal),o;n?.requireSync?o=T({kind:0},{equal:r}):o=T({kind:1,value:n?.initialValue},{equal:r});let a,s=t.subscribe({next:l=>o.set({kind:1,value:l}),error:l=>{o.set({kind:2,error:l}),a?.()},complete:()=>{a?.()}});if(n?.requireSync&&o().kind===0)throw new H(601,!1);return a=i?.onDestroy(s.unsubscribe.bind(s)),ke(()=>{let l=o();switch(l.kind){case 1:return l.value;case 2:throw l.error;case 0:throw new H(601,!1)}},{equal:n?.equal})}function zP(t=Object.is){return(n,e)=>n.kind===1&&e.kind===1&&t(n.value,e.value)}function qo(t){return t.buttons===0||t.detail===0}function Yo(t){let n=t.touches&&t.touches[0]||t.changedTouches&&t.changedTouches[0];return!!n&&n.identifier===-1&&(n.radiusX==null||n.radiusX===1)&&(n.radiusY==null||n.radiusY===1)}var Ev;function Wx(){if(Ev==null){let t=typeof document<"u"?document.head:null;Ev=!!(t&&(t.createShadowRoot||t.attachShadow))}return Ev}function Mv(t){if(Wx()){let n=t.getRootNode?t.getRootNode():null;if(typeof ShadowRoot<"u"&&ShadowRoot&&n instanceof ShadowRoot)return n}return null}function ms(){let t=typeof document<"u"&&document?document.activeElement:null;for(;t&&t.shadowRoot;){let n=t.shadowRoot.activeElement;if(n===t)break;t=n}return t}function $t(t){if(t.composedPath)try{return t.composedPath()[0]}catch(n){}return t.target}var Sc;function Gx(){if(Sc==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>Sc=!0}))}finally{Sc=Sc||!1}return Sc}function fs(t){return Gx()?t:!!t.capture}function Bt(t,n=0){return qx(t)?Number(t):arguments.length===2?n:0}function qx(t){return!isNaN(parseFloat(t))&&!isNaN(Number(t))}function sn(t){return t instanceof L?t.nativeElement:t}var Yx=new C("cdk-input-modality-detector-options"),Zx={ignoreKeys:[18,17,224,91,16]},Qx=650,Iv={passive:!0,capture:!0},Xx=(()=>{class t{_platform=c(Ce);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new Et(null);_options;_lastTouchMs=0;_onKeydown=e=>{this._options?.ignoreKeys?.some(i=>i===e.keyCode)||(this._modality.next("keyboard"),this._mostRecentTarget=$t(e))};_onMousedown=e=>{Date.now()-this._lastTouchMs<Qx||(this._modality.next(qo(e)?"keyboard":"mouse"),this._mostRecentTarget=$t(e))};_onTouchstart=e=>{if(Yo(e)){this._modality.next("keyboard");return}this._lastTouchMs=Date.now(),this._modality.next("touch"),this._mostRecentTarget=$t(e)};constructor(){let e=c($),i=c(X),r=c(Yx,{optional:!0});if(this._options=y(y({},Zx),r),this.modalityDetected=this._modality.pipe(ho(1)),this.modalityChanged=this.modalityDetected.pipe(Rd()),this._platform.isBrowser){let o=c(It).createRenderer(null,null);this._listenerCleanups=e.runOutsideAngular(()=>[o.listen(i,"keydown",this._onKeydown,Iv),o.listen(i,"mousedown",this._onMousedown,Iv),o.listen(i,"touchstart",this._onTouchstart,Iv)])}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(e=>e())}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),xc=(function(t){return t[t.IMMEDIATE=0]="IMMEDIATE",t[t.EVENTUAL=1]="EVENTUAL",t})(xc||{}),Kx=new C("cdk-focus-monitor-default-options"),Qm=fs({passive:!0,capture:!0}),Ht=(()=>{class t{_ngZone=c($);_platform=c(Ce);_inputModalityDetector=c(Xx);_origin=null;_lastFocusOrigin=null;_windowFocused=!1;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=!1;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=!0,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=!1)};_document=c(X);_stopInputModalityDetector=new I;constructor(){let e=c(Kx,{optional:!0});this._detectionMode=e?.detectionMode||xc.IMMEDIATE}_rootNodeFocusAndBlurListener=e=>{let i=$t(e);for(let r=i;r;r=r.parentElement)e.type==="focus"?this._onFocus(e,r):this._onBlur(e,r)};monitor(e,i=!1){let r=sn(e);if(!this._platform.isBrowser||r.nodeType!==1)return ie();let o=Mv(r)||this._document,a=this._elementInfo.get(r);if(a)return i&&(a.checkChildren=!0),a.subject;let s={checkChildren:i,subject:new I,rootNode:o};return this._elementInfo.set(r,s),this._registerGlobalListeners(s),s.subject}stopMonitoring(e){let i=sn(e),r=this._elementInfo.get(i);r&&(r.subject.complete(),this._setClasses(i),this._elementInfo.delete(i),this._removeGlobalListeners(r))}focusVia(e,i,r){let o=sn(e),a=this._document.activeElement;o===a?this._getClosestElementsInfo(o).forEach(([s,l])=>this._originChanged(s,i,l)):(this._setOrigin(i),typeof o.focus=="function"&&o.focus(r))}ngOnDestroy(){this._elementInfo.forEach((e,i)=>this.stopMonitoring(i))}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(e){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(e)?"touch":"program":this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:e&&this._isLastInteractionFromInputLabel(e)?"mouse":"program"}_shouldBeAttributedToTouch(e){return this._detectionMode===xc.EVENTUAL||!!e?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(e,i){e.classList.toggle("cdk-focused",!!i),e.classList.toggle("cdk-touch-focused",i==="touch"),e.classList.toggle("cdk-keyboard-focused",i==="keyboard"),e.classList.toggle("cdk-mouse-focused",i==="mouse"),e.classList.toggle("cdk-program-focused",i==="program")}_setOrigin(e,i=!1){this._ngZone.runOutsideAngular(()=>{if(this._origin=e,this._originFromTouchInteraction=e==="touch"&&i,this._detectionMode===xc.IMMEDIATE){clearTimeout(this._originTimeoutId);let r=this._originFromTouchInteraction?Qx:1;this._originTimeoutId=setTimeout(()=>this._origin=null,r)}})}_onFocus(e,i){let r=this._elementInfo.get(i),o=$t(e);!r||!r.checkChildren&&i!==o||this._originChanged(i,this._getFocusOrigin(o),r)}_onBlur(e,i){let r=this._elementInfo.get(i);!r||r.checkChildren&&e.relatedTarget instanceof Node&&i.contains(e.relatedTarget)||(this._setClasses(i),this._emitOrigin(r,null))}_emitOrigin(e,i){e.subject.observers.length&&this._ngZone.run(()=>e.subject.next(i))}_registerGlobalListeners(e){if(!this._platform.isBrowser)return;let i=e.rootNode,r=this._rootNodeFocusListenerCount.get(i)||0;r||this._ngZone.runOutsideAngular(()=>{i.addEventListener("focus",this._rootNodeFocusAndBlurListener,Qm),i.addEventListener("blur",this._rootNodeFocusAndBlurListener,Qm)}),this._rootNodeFocusListenerCount.set(i,r+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener("focus",this._windowFocusListener)}),this._inputModalityDetector.modalityDetected.pipe(pe(this._stopInputModalityDetector)).subscribe(o=>{this._setOrigin(o,!0)}))}_removeGlobalListeners(e){let i=e.rootNode;if(this._rootNodeFocusListenerCount.has(i)){let r=this._rootNodeFocusListenerCount.get(i);r>1?this._rootNodeFocusListenerCount.set(i,r-1):(i.removeEventListener("focus",this._rootNodeFocusAndBlurListener,Qm),i.removeEventListener("blur",this._rootNodeFocusAndBlurListener,Qm),this._rootNodeFocusListenerCount.delete(i))}--this._monitoredElementCount||(this._getWindow().removeEventListener("focus",this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId))}_originChanged(e,i,r){this._setClasses(e,i),this._emitOrigin(r,i),this._lastFocusOrigin=i}_getClosestElementsInfo(e){let i=[];return this._elementInfo.forEach((r,o)=>{(o===e||r.checkChildren&&o.contains(e))&&i.push([o,r])}),i}_isLastInteractionFromInputLabel(e){let{_mostRecentTarget:i,mostRecentModality:r}=this._inputModalityDetector;if(r!=="mouse"||!i||i===e||e.nodeName!=="INPUT"&&e.nodeName!=="TEXTAREA"||e.disabled)return!1;let o=e.labels;if(o){for(let a=0;a<o.length;a++)if(o[a].contains(i))return!0}return!1}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),Nv=(()=>{class t{_elementRef=c(L);_focusMonitor=c(Ht);_monitorSubscription;_focusOrigin=null;cdkFocusChange=new O;get focusOrigin(){return this._focusOrigin}ngAfterViewInit(){let e=this._elementRef.nativeElement;this._monitorSubscription=this._focusMonitor.monitor(e,e.nodeType===1&&e.hasAttribute("cdkMonitorSubtreeFocus")).subscribe(i=>{this._focusOrigin=i,this.cdkFocusChange.emit(i)})}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef),this._monitorSubscription?.unsubscribe()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdkMonitorElementFocus",""],["","cdkMonitorSubtreeFocus",""]],outputs:{cdkFocusChange:"cdkFocusChange"},exportAs:["cdkMonitorFocus"]})}return t})();var Xm=new WeakMap,tt=(()=>{class t{_appRef;_injector=c(K);_environmentInjector=c(qe);load(e){let i=this._appRef=this._appRef||this._injector.get(rn),r=Xm.get(i);r||(r={loaders:new Set,refs:[]},Xm.set(i,r),i.onDestroy(()=>{Xm.get(i)?.refs.forEach(o=>o.destroy()),Xm.delete(i)})),r.loaders.has(e)||(r.loaders.add(e),r.refs.push(sm(e,{environmentInjector:this._environmentInjector})))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var hs=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["ng-component"]],exportAs:["cdkVisuallyHidden"],decls:0,vars:0,template:function(i,r){},styles:[`.cdk-visually-hidden {
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
`],encapsulation:2})}return t})(),Km;function $P(){if(Km===void 0&&(Km=null,typeof window<"u")){let t=window;if(t.trustedTypes!==void 0)try{Km=t.trustedTypes.createPolicy("angular#components",{createHTML:n=>n})}catch(n){console.error(n)}}return Km}function Zo(t){return $P()?.createHTML(t)||t}function Jx(t,n,e){let i=e.sanitize(Oe.HTML,n);t.innerHTML=Zo(i||"")}function WP(t){if(t.type==="characterData"&&t.target instanceof Comment)return!0;if(t.type==="childList"){for(let n=0;n<t.addedNodes.length;n++)if(!(t.addedNodes[n]instanceof Comment))return!1;for(let n=0;n<t.removedNodes.length;n++)if(!(t.removedNodes[n]instanceof Comment))return!1;return!0}return!1}var eD=(()=>{class t{create(e){return typeof MutationObserver>"u"?null:new MutationObserver(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),tD=(()=>{class t{_mutationObserverFactory=c(eD);_observedElements=new Map;_ngZone=c($);ngOnDestroy(){this._observedElements.forEach((e,i)=>this._cleanupObserver(i))}observe(e){let i=sn(e);return new de(r=>{let a=this._observeElement(i).pipe(ee(s=>s.filter(l=>!WP(l))),me(s=>!!s.length)).subscribe(s=>{this._ngZone.run(()=>{r.next(s)})});return()=>{a.unsubscribe(),this._unobserveElement(i)}})}_observeElement(e){return this._ngZone.runOutsideAngular(()=>{if(this._observedElements.has(e))this._observedElements.get(e).count++;else{let i=new I,r=this._mutationObserverFactory.create(o=>i.next(o));r&&r.observe(e,{characterData:!0,childList:!0,subtree:!0}),this._observedElements.set(e,{observer:r,stream:i,count:1})}return this._observedElements.get(e).stream})}_unobserveElement(e){this._observedElements.has(e)&&(this._observedElements.get(e).count--,this._observedElements.get(e).count||this._cleanupObserver(e))}_cleanupObserver(e){if(this._observedElements.has(e)){let{observer:i,stream:r}=this._observedElements.get(e);i&&i.disconnect(),r.complete(),this._observedElements.delete(e)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),Jm=(()=>{class t{_contentObserver=c(tD);_elementRef=c(L);event=new O;get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._disabled?this._unsubscribe():this._subscribe()}_disabled=!1;get debounce(){return this._debounce}set debounce(e){this._debounce=Bt(e),this._subscribe()}_debounce;_currentSubscription=null;ngAfterContentInit(){!this._currentSubscription&&!this.disabled&&this._subscribe()}ngOnDestroy(){this._unsubscribe()}_subscribe(){this._unsubscribe();let e=this._contentObserver.observe(this._elementRef);this._currentSubscription=(this.debounce?e.pipe(Zn(this.debounce)):e).subscribe(this.event)}_unsubscribe(){this._currentSubscription?.unsubscribe()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdkObserveContent",""]],inputs:{disabled:[2,"cdkObserveContentDisabled","disabled",Y],debounce:"debounce"},outputs:{event:"cdkObserveContent"},exportAs:["cdkObserveContent"]})}return t})(),ps=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({providers:[eD]})}return t})();var gs=(()=>{class t{_platform=c(Ce);isDisabled(e){return e.hasAttribute("disabled")}isVisible(e){return qP(e)&&getComputedStyle(e).visibility==="visible"}isTabbable(e){if(!this._platform.isBrowser)return!1;let i=GP(tF(e));if(i&&(nD(i)===-1||!this.isVisible(i)))return!1;let r=e.nodeName.toLowerCase(),o=nD(e);return e.hasAttribute("contenteditable")?o!==-1:r==="iframe"||r==="object"||this._platform.WEBKIT&&this._platform.IOS&&!JP(e)?!1:r==="audio"?e.hasAttribute("controls")?o!==-1:!1:r==="video"?o===-1?!1:o!==null?!0:this._platform.FIREFOX||e.hasAttribute("controls"):e.tabIndex>=0}isFocusable(e,i){return eF(e)&&!this.isDisabled(e)&&(i?.ignoreVisibility||this.isVisible(e))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function GP(t){try{return t.frameElement}catch(n){return null}}function qP(t){return!!(t.offsetWidth||t.offsetHeight||typeof t.getClientRects=="function"&&t.getClientRects().length)}function YP(t){let n=t.nodeName.toLowerCase();return n==="input"||n==="select"||n==="button"||n==="textarea"}function ZP(t){return XP(t)&&t.type=="hidden"}function QP(t){return KP(t)&&t.hasAttribute("href")}function XP(t){return t.nodeName.toLowerCase()=="input"}function KP(t){return t.nodeName.toLowerCase()=="a"}function oD(t){if(!t.hasAttribute("tabindex")||t.tabIndex===void 0)return!1;let n=t.getAttribute("tabindex");return!!(n&&!isNaN(parseInt(n,10)))}function nD(t){if(!oD(t))return null;let n=parseInt(t.getAttribute("tabindex")||"",10);return isNaN(n)?-1:n}function JP(t){let n=t.nodeName.toLowerCase(),e=n==="input"&&t.type;return e==="text"||e==="password"||n==="select"||n==="textarea"}function eF(t){return ZP(t)?!1:YP(t)||QP(t)||t.hasAttribute("contenteditable")||oD(t)}function tF(t){return t.ownerDocument&&t.ownerDocument.defaultView||window}var ef=class{_element;_checker;_ngZone;_document;_injector;_startAnchor=null;_endAnchor=null;_hasAttached=!1;startAnchorListener=()=>{!this.focusLastTabbableElement()&&this._checker.isFocusable(this._element)&&this._element.focus()};endAnchorListener=()=>{!this.focusFirstTabbableElement()&&this._checker.isFocusable(this._element)&&this._element.focus()};get enabled(){return this._enabled}set enabled(n){this._enabled=n,this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(n,this._startAnchor),this._toggleAnchorTabIndex(n,this._endAnchor))}_enabled=!0;constructor(n,e,i,r,o=!1,a){this._element=n,this._checker=e,this._ngZone=i,this._document=r,this._injector=a,o||this.attachAnchors()}destroy(){let n=this._startAnchor,e=this._endAnchor;n&&(n.removeEventListener("focus",this.startAnchorListener),n.remove()),e&&(e.removeEventListener("focus",this.endAnchorListener),e.remove()),this._startAnchor=this._endAnchor=null,this._hasAttached=!1}attachAnchors(){return this._hasAttached?!0:(this._ngZone.runOutsideAngular(()=>{this._startAnchor||(this._startAnchor=this._createAnchor(),this._startAnchor.addEventListener("focus",this.startAnchorListener)),this._endAnchor||(this._endAnchor=this._createAnchor(),this._endAnchor.addEventListener("focus",this.endAnchorListener))}),this._element.parentNode&&(this._element.parentNode.insertBefore(this._startAnchor,this._element),this._element.parentNode.insertBefore(this._endAnchor,this._element.nextSibling),this._hasAttached=!0),this._hasAttached)}focusInitialElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusInitialElement(n)))})}focusFirstTabbableElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusFirstTabbableElement(n)))})}focusLastTabbableElementWhenReady(n){return new Promise(e=>{this._executeOnStable(()=>e(this.focusLastTabbableElement(n)))})}_getRegionBoundary(n){let e=this._element.querySelectorAll(`[cdk-focus-region-${n}], [cdkFocusRegion${n}], [cdk-focus-${n}]`);return n=="start"?e.length?e[0]:this._getFirstTabbableElement(this._element):e.length?e[e.length-1]:this._getLastTabbableElement(this._element)}focusInitialElement(n){let e=this._element.querySelector("[cdk-focus-initial], [cdkFocusInitial]");if(e){if(!this._checker.isFocusable(e)){let i=this._getFirstTabbableElement(e);return i?.focus(n),!!i}return e.focus(n),!0}return this.focusFirstTabbableElement(n)}focusFirstTabbableElement(n){let e=this._getRegionBoundary("start");return e&&e.focus(n),!!e}focusLastTabbableElement(n){let e=this._getRegionBoundary("end");return e&&e.focus(n),!!e}hasAttached(){return this._hasAttached}_getFirstTabbableElement(n){if(this._checker.isFocusable(n)&&this._checker.isTabbable(n))return n;let e=n.children;for(let i=0;i<e.length;i++){let r=e[i].nodeType===this._document.ELEMENT_NODE?this._getFirstTabbableElement(e[i]):null;if(r)return r}return null}_getLastTabbableElement(n){if(this._checker.isFocusable(n)&&this._checker.isTabbable(n))return n;let e=n.children;for(let i=e.length-1;i>=0;i--){let r=e[i].nodeType===this._document.ELEMENT_NODE?this._getLastTabbableElement(e[i]):null;if(r)return r}return null}_createAnchor(){let n=this._document.createElement("div");return this._toggleAnchorTabIndex(this._enabled,n),n.classList.add("cdk-visually-hidden"),n.classList.add("cdk-focus-trap-anchor"),n.setAttribute("aria-hidden","true"),n}_toggleAnchorTabIndex(n,e){n?e.setAttribute("tabindex","0"):e.removeAttribute("tabindex")}toggleAnchors(n){this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(n,this._startAnchor),this._toggleAnchorTabIndex(n,this._endAnchor))}_executeOnStable(n){ct(n,{injector:this._injector})}},Dc=(()=>{class t{_checker=c(gs);_ngZone=c($);_document=c(X);_injector=c(K);constructor(){c(tt).load(hs)}create(e,i=!1){return new ef(e,this._checker,this._ngZone,this._document,i,this._injector)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var aD=new C("liveAnnouncerElement",{providedIn:"root",factory:()=>null}),sD=new C("LIVE_ANNOUNCER_DEFAULT_OPTIONS"),nF=0,kv=(()=>{class t{_ngZone=c($);_defaultOptions=c(sD,{optional:!0});_liveElement;_document=c(X);_sanitizer=c(oc);_previousTimeout;_currentPromise;_currentResolve;constructor(){let e=c(aD,{optional:!0});this._liveElement=e||this._createLiveElement()}announce(e,...i){let r=this._defaultOptions,o,a;return i.length===1&&typeof i[0]=="number"?a=i[0]:[o,a]=i,this.clear(),clearTimeout(this._previousTimeout),o||(o=r&&r.politeness?r.politeness:"polite"),a==null&&r&&(a=r.duration),this._liveElement.setAttribute("aria-live",o),this._liveElement.id&&this._exposeAnnouncerToModals(this._liveElement.id),this._ngZone.runOutsideAngular(()=>(this._currentPromise||(this._currentPromise=new Promise(s=>this._currentResolve=s)),clearTimeout(this._previousTimeout),this._previousTimeout=setTimeout(()=>{!e||typeof e=="string"?this._liveElement.textContent=e:Jx(this._liveElement,e,this._sanitizer),typeof a=="number"&&(this._previousTimeout=setTimeout(()=>this.clear(),a)),this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0},100),this._currentPromise))}clear(){this._liveElement&&(this._liveElement.textContent="")}ngOnDestroy(){clearTimeout(this._previousTimeout),this._liveElement?.remove(),this._liveElement=null,this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0}_createLiveElement(){let e="cdk-live-announcer-element",i=this._document.getElementsByClassName(e),r=this._document.createElement("div");for(let o=0;o<i.length;o++)i[o].remove();return r.classList.add(e),r.classList.add("cdk-visually-hidden"),r.setAttribute("aria-atomic","true"),r.setAttribute("aria-live","polite"),r.id=`cdk-live-announcer-${nF++}`,this._document.body.appendChild(r),r}_exposeAnnouncerToModals(e){let i=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let r=0;r<i.length;r++){let o=i[r],a=o.getAttribute("aria-owns");a?a.indexOf(e)===-1&&o.setAttribute("aria-owns",a+" "+e):o.setAttribute("aria-owns",e)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var Vr=(function(t){return t[t.NONE=0]="NONE",t[t.BLACK_ON_WHITE=1]="BLACK_ON_WHITE",t[t.WHITE_ON_BLACK=2]="WHITE_ON_BLACK",t})(Vr||{}),iD="cdk-high-contrast-black-on-white",rD="cdk-high-contrast-white-on-black",Tv="cdk-high-contrast-active",lD=(()=>{class t{_platform=c(Ce);_hasCheckedHighContrastMode=!1;_document=c(X);_breakpointSubscription;constructor(){this._breakpointSubscription=c(Go).observe("(forced-colors: active)").subscribe(()=>{this._hasCheckedHighContrastMode&&(this._hasCheckedHighContrastMode=!1,this._applyBodyHighContrastModeCssClasses())})}getHighContrastMode(){if(!this._platform.isBrowser)return Vr.NONE;let e=this._document.createElement("div");e.style.backgroundColor="rgb(1,2,3)",e.style.position="absolute",this._document.body.appendChild(e);let i=this._document.defaultView||window,r=i&&i.getComputedStyle?i.getComputedStyle(e):null,o=(r&&r.backgroundColor||"").replace(/ /g,"");switch(e.remove(),o){case"rgb(0,0,0)":case"rgb(45,50,54)":case"rgb(32,32,32)":return Vr.WHITE_ON_BLACK;case"rgb(255,255,255)":case"rgb(255,250,239)":return Vr.BLACK_ON_WHITE}return Vr.NONE}ngOnDestroy(){this._breakpointSubscription.unsubscribe()}_applyBodyHighContrastModeCssClasses(){if(!this._hasCheckedHighContrastMode&&this._platform.isBrowser&&this._document.body){let e=this._document.body.classList;e.remove(Tv,iD,rD),this._hasCheckedHighContrastMode=!0;let i=this.getHighContrastMode();i===Vr.BLACK_ON_WHITE?e.add(Tv,iD):i===Vr.WHITE_ON_BLACK&&e.add(Tv,rD)}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),Ec=(()=>{class t{constructor(){c(lD)._applyBodyHighContrastModeCssClasses()}static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ps]})}return t})();var iF=200,tf=class{_letterKeyStream=new I;_items=[];_selectedItemIndex=-1;_pressedLetters=[];_skipPredicateFn;_selectedItem=new I;selectedItem=this._selectedItem;constructor(n,e){let i=typeof e?.debounceInterval=="number"?e.debounceInterval:iF;e?.skipPredicate&&(this._skipPredicateFn=e.skipPredicate),this.setItems(n),this._setupKeyHandler(i)}destroy(){this._pressedLetters=[],this._letterKeyStream.complete(),this._selectedItem.complete()}setCurrentSelectedItemIndex(n){this._selectedItemIndex=n}setItems(n){this._items=n}handleKey(n){let e=n.keyCode;n.key&&n.key.length===1?this._letterKeyStream.next(n.key.toLocaleUpperCase()):(e>=65&&e<=90||e>=48&&e<=57)&&this._letterKeyStream.next(String.fromCharCode(e))}isTyping(){return this._pressedLetters.length>0}reset(){this._pressedLetters=[]}_setupKeyHandler(n){this._letterKeyStream.pipe(Ft(e=>this._pressedLetters.push(e)),Zn(n),me(()=>this._pressedLetters.length>0),ee(()=>this._pressedLetters.join("").toLocaleUpperCase())).subscribe(e=>{for(let i=1;i<this._items.length+1;i++){let r=(this._selectedItemIndex+i)%this._items.length,o=this._items[r];if(!this._skipPredicateFn?.(o)&&o.getLabel?.().toLocaleUpperCase().trim().indexOf(e)===0){this._selectedItem.next(o);break}}this._pressedLetters=[]})}};function mt(t,...n){return n.length?n.some(e=>t[e]):t.altKey||t.shiftKey||t.ctrlKey||t.metaKey}var _s=class{_items;_activeItemIndex=T(-1);_activeItem=T(null);_wrap=!1;_typeaheadSubscription=ue.EMPTY;_itemChangesSubscription;_vertical=!0;_horizontal=null;_allowedModifierKeys=[];_homeAndEnd=!1;_pageUpAndDown={enabled:!1,delta:10};_effectRef;_typeahead;_skipPredicateFn=n=>n.disabled;constructor(n,e){this._items=n,n instanceof pn?this._itemChangesSubscription=n.changes.subscribe(i=>this._itemsChanged(i.toArray())):hn(n)&&(this._effectRef=Lt(()=>this._itemsChanged(n()),{injector:e}))}tabOut=new I;change=new I;skipPredicate(n){return this._skipPredicateFn=n,this}withWrap(n=!0){return this._wrap=n,this}withVerticalOrientation(n=!0){return this._vertical=n,this}withHorizontalOrientation(n){return this._horizontal=n,this}withAllowedModifierKeys(n){return this._allowedModifierKeys=n,this}withTypeAhead(n=200){this._typeaheadSubscription.unsubscribe();let e=this._getItemsArray();return this._typeahead=new tf(e,{debounceInterval:typeof n=="number"?n:void 0,skipPredicate:i=>this._skipPredicateFn(i)}),this._typeaheadSubscription=this._typeahead.selectedItem.subscribe(i=>{this.setActiveItem(i)}),this}cancelTypeahead(){return this._typeahead?.reset(),this}withHomeAndEnd(n=!0){return this._homeAndEnd=n,this}withPageUpDown(n=!0,e=10){return this._pageUpAndDown={enabled:n,delta:e},this}setActiveItem(n){let e=this._activeItem();this.updateActiveItem(n),this._activeItem()!==e&&this.change.next(this._activeItemIndex())}onKeydown(n){let e=n.keyCode,r=["altKey","ctrlKey","metaKey","shiftKey"].every(o=>!n[o]||this._allowedModifierKeys.indexOf(o)>-1);switch(e){case 9:this.tabOut.next();return;case 40:if(this._vertical&&r){this.setNextItemActive();break}else return;case 38:if(this._vertical&&r){this.setPreviousItemActive();break}else return;case 39:if(this._horizontal&&r){this._horizontal==="rtl"?this.setPreviousItemActive():this.setNextItemActive();break}else return;case 37:if(this._horizontal&&r){this._horizontal==="rtl"?this.setNextItemActive():this.setPreviousItemActive();break}else return;case 36:if(this._homeAndEnd&&r){this.setFirstItemActive();break}else return;case 35:if(this._homeAndEnd&&r){this.setLastItemActive();break}else return;case 33:if(this._pageUpAndDown.enabled&&r){let o=this._activeItemIndex()-this._pageUpAndDown.delta;this._setActiveItemByIndex(o>0?o:0,1);break}else return;case 34:if(this._pageUpAndDown.enabled&&r){let o=this._activeItemIndex()+this._pageUpAndDown.delta,a=this._getItemsArray().length;this._setActiveItemByIndex(o<a?o:a-1,-1);break}else return;default:(r||mt(n,"shiftKey"))&&this._typeahead?.handleKey(n);return}this._typeahead?.reset(),n.preventDefault()}get activeItemIndex(){return this._activeItemIndex()}get activeItem(){return this._activeItem()}isTyping(){return!!this._typeahead&&this._typeahead.isTyping()}setFirstItemActive(){this._setActiveItemByIndex(0,1)}setLastItemActive(){this._setActiveItemByIndex(this._getItemsArray().length-1,-1)}setNextItemActive(){this._activeItemIndex()<0?this.setFirstItemActive():this._setActiveItemByDelta(1)}setPreviousItemActive(){this._activeItemIndex()<0&&this._wrap?this.setLastItemActive():this._setActiveItemByDelta(-1)}updateActiveItem(n){let e=this._getItemsArray(),i=typeof n=="number"?n:e.indexOf(n),r=e[i];this._activeItem.set(r??null),this._activeItemIndex.set(i),this._typeahead?.setCurrentSelectedItemIndex(i)}destroy(){this._typeaheadSubscription.unsubscribe(),this._itemChangesSubscription?.unsubscribe(),this._effectRef?.destroy(),this._typeahead?.destroy(),this.tabOut.complete(),this.change.complete()}_setActiveItemByDelta(n){this._wrap?this._setActiveInWrapMode(n):this._setActiveInDefaultMode(n)}_setActiveInWrapMode(n){let e=this._getItemsArray();for(let i=1;i<=e.length;i++){let r=(this._activeItemIndex()+n*i+e.length)%e.length,o=e[r];if(!this._skipPredicateFn(o)){this.setActiveItem(r);return}}}_setActiveInDefaultMode(n){this._setActiveItemByIndex(this._activeItemIndex()+n,n)}_setActiveItemByIndex(n,e){let i=this._getItemsArray();if(i[n]){for(;this._skipPredicateFn(i[n]);)if(n+=e,!i[n])return;this.setActiveItem(n)}}_getItemsArray(){return hn(this._items)?this._items():this._items instanceof pn?this._items.toArray():this._items}_itemsChanged(n){this._typeahead?.setItems(n);let e=this._activeItem();if(e){let i=n.indexOf(e);i>-1&&i!==this._activeItemIndex()&&(this._activeItemIndex.set(i),this._typeahead?.setCurrentSelectedItemIndex(i))}}};var kc=class extends _s{setActiveItem(n){this.activeItem&&this.activeItem.setInactiveStyles(),super.setActiveItem(n),this.activeItem&&this.activeItem.setActiveStyles()}};var Br=class extends _s{_origin="program";setFocusOrigin(n){return this._origin=n,this}setActiveItem(n){super.setActiveItem(n),this.activeItem&&this.activeItem.focus(this._origin)}};var dD=new Map,$e=class t{_appId=c(Yi);static _infix=`a${Math.floor(Math.random()*1e5).toString()}`;getId(n,e=!1){this._appId!=="ng"&&(n+=this._appId);let i=dD.get(n);return i===void 0?i=0:i++,dD.set(n,i),`${n}${e?t._infix+"-":""}${i}`}static \u0275fac=function(e){return new(e||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})};var mD=" ";function rF(t,n,e){let i=rf(t,n);e=e.trim(),!i.some(r=>r.trim()===e)&&(i.push(e),t.setAttribute(n,i.join(mD)))}function oF(t,n,e){let i=rf(t,n);e=e.trim();let r=i.filter(o=>o!==e);r.length?t.setAttribute(n,r.join(mD)):t.removeAttribute(n)}function rf(t,n){return t.getAttribute(n)?.match(/\S+/g)??[]}var fD="cdk-describedby-message",nf="cdk-describedby-host",Rv=0,hD=(()=>{class t{_platform=c(Ce);_document=c(X);_messageRegistry=new Map;_messagesContainer=null;_id=`${Rv++}`;constructor(){c(tt).load(hs),this._id=c(Yi)+"-"+Rv++}describe(e,i,r){if(!this._canBeDescribed(e,i))return;let o=Av(i,r);typeof i!="string"?(uD(i,this._id),this._messageRegistry.set(o,{messageElement:i,referenceCount:0})):this._messageRegistry.has(o)||this._createMessageElement(i,r),this._isElementDescribedByMessage(e,o)||this._addMessageReference(e,o)}removeDescription(e,i,r){if(!i||!this._isElementNode(e))return;let o=Av(i,r);if(this._isElementDescribedByMessage(e,o)&&this._removeMessageReference(e,o),typeof i=="string"){let a=this._messageRegistry.get(o);a&&a.referenceCount===0&&this._deleteMessageElement(o)}this._messagesContainer?.childNodes.length===0&&(this._messagesContainer.remove(),this._messagesContainer=null)}ngOnDestroy(){let e=this._document.querySelectorAll(`[${nf}="${this._id}"]`);for(let i=0;i<e.length;i++)this._removeCdkDescribedByReferenceIds(e[i]),e[i].removeAttribute(nf);this._messagesContainer?.remove(),this._messagesContainer=null,this._messageRegistry.clear()}_createMessageElement(e,i){let r=this._document.createElement("div");uD(r,this._id),r.textContent=e,i&&r.setAttribute("role",i),this._createMessagesContainer(),this._messagesContainer.appendChild(r),this._messageRegistry.set(Av(e,i),{messageElement:r,referenceCount:0})}_deleteMessageElement(e){this._messageRegistry.get(e)?.messageElement?.remove(),this._messageRegistry.delete(e)}_createMessagesContainer(){if(this._messagesContainer)return;let e="cdk-describedby-message-container",i=this._document.querySelectorAll(`.${e}[platform="server"]`);for(let o=0;o<i.length;o++)i[o].remove();let r=this._document.createElement("div");r.style.visibility="hidden",r.classList.add(e),r.classList.add("cdk-visually-hidden"),this._platform.isBrowser||r.setAttribute("platform","server"),this._document.body.appendChild(r),this._messagesContainer=r}_removeCdkDescribedByReferenceIds(e){let i=rf(e,"aria-describedby").filter(r=>r.indexOf(fD)!=0);e.setAttribute("aria-describedby",i.join(" "))}_addMessageReference(e,i){let r=this._messageRegistry.get(i);rF(e,"aria-describedby",r.messageElement.id),e.setAttribute(nf,this._id),r.referenceCount++}_removeMessageReference(e,i){let r=this._messageRegistry.get(i);r.referenceCount--,oF(e,"aria-describedby",r.messageElement.id),e.removeAttribute(nf)}_isElementDescribedByMessage(e,i){let r=rf(e,"aria-describedby"),o=this._messageRegistry.get(i),a=o&&o.messageElement.id;return!!a&&r.indexOf(a)!=-1}_canBeDescribed(e,i){if(!this._isElementNode(e))return!1;if(i&&typeof i=="object")return!0;let r=i==null?"":`${i}`.trim(),o=e.getAttribute("aria-label");return r?!o||o.trim()!==r:!1}_isElementNode(e){return e.nodeType===this._document.ELEMENT_NODE}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function Av(t,n){return typeof t=="string"?`${n||""}/${t}`:t}function uD(t,n){t.id||(t.id=`${fD}-${n}-${Rv++}`)}var li=(function(t){return t[t.NORMAL=0]="NORMAL",t[t.NEGATED=1]="NEGATED",t[t.INVERTED=2]="INVERTED",t})(li||{}),of,Qo;function af(){if(Qo==null){if(typeof document!="object"||!document||typeof Element!="function"||!Element)return Qo=!1,Qo;if(document.documentElement?.style&&"scrollBehavior"in document.documentElement.style)Qo=!0;else{let t=Element.prototype.scrollTo;t?Qo=!/\{\s*\[native code\]\s*\}/.test(t.toString()):Qo=!1}}return Qo}function vs(){if(typeof document!="object"||!document)return li.NORMAL;if(of==null){let t=document.createElement("div"),n=t.style;t.dir="rtl",n.width="1px",n.overflow="auto",n.visibility="hidden",n.pointerEvents="none",n.position="absolute";let e=document.createElement("div"),i=e.style;i.width="2px",i.height="1px",t.appendChild(e),document.body.appendChild(t),of=li.NORMAL,t.scrollLeft===0&&(t.scrollLeft=1,of=t.scrollLeft===0?li.NEGATED:li.INVERTED),t.remove()}return of}function Ov(){return typeof __karma__<"u"&&!!__karma__||typeof jasmine<"u"&&!!jasmine||typeof jest<"u"&&!!jest||typeof Mocha<"u"&&!!Mocha}var bs,pD=["color","button","checkbox","date","datetime-local","email","file","hidden","image","month","number","password","radio","range","reset","search","submit","tel","text","time","url","week"];function Pv(){if(bs)return bs;if(typeof document!="object"||!document)return bs=new Set(pD),bs;let t=document.createElement("input");return bs=new Set(pD.filter(n=>(t.setAttribute("type",n),t.type===n))),bs}var aF=new C("MATERIAL_ANIMATIONS"),gD=null;function Ac(){return c(aF,{optional:!0})?.animationsDisabled||c(xl,{optional:!0})==="NoopAnimations"?"di-disabled":(gD??=c(us).matchMedia("(prefers-reduced-motion)").matches,gD?"reduced-motion":"enabled")}function Re(){return Ac()!=="enabled"}function Dt(t){return t==null?"":typeof t=="string"?t:`${t}px`}function lt(t){return t!=null&&`${t}`!="false"}var jn=(function(t){return t[t.FADING_IN=0]="FADING_IN",t[t.VISIBLE=1]="VISIBLE",t[t.FADING_OUT=2]="FADING_OUT",t[t.HIDDEN=3]="HIDDEN",t})(jn||{}),Fv=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=jn.HIDDEN;constructor(n,e,i,r=!1){this._renderer=n,this.element=e,this.config=i,this._animationForciblyDisabledThroughCss=r}fadeOut(){this._renderer.fadeOutRipple(this)}},_D=fs({passive:!0,capture:!0}),Lv=class{_events=new Map;addHandler(n,e,i,r){let o=this._events.get(e);if(o){let a=o.get(i);a?a.add(r):o.set(i,new Set([r]))}else this._events.set(e,new Map([[i,new Set([r])]])),n.runOutsideAngular(()=>{document.addEventListener(e,this._delegateEventHandler,_D)})}removeHandler(n,e,i){let r=this._events.get(n);if(!r)return;let o=r.get(e);o&&(o.delete(i),o.size===0&&r.delete(e),r.size===0&&(this._events.delete(n),document.removeEventListener(n,this._delegateEventHandler,_D)))}_delegateEventHandler=n=>{let e=$t(n);e&&this._events.get(n.type)?.forEach((i,r)=>{(r===e||r.contains(e))&&i.forEach(o=>o.handleEvent(n))})}},Rc={enterDuration:225,exitDuration:150},sF=800,vD=fs({passive:!0,capture:!0}),bD=["mousedown","touchstart"],yD=["mouseup","mouseleave","touchend","touchcancel"],lF=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(i,r){},styles:[`.mat-ripple {
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
`],encapsulation:2})}return t})(),Xo=class t{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=!1;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=!1;_containerRect=null;static _eventManager=new Lv;constructor(n,e,i,r,o){this._target=n,this._ngZone=e,this._platform=r,r.isBrowser&&(this._containerElement=sn(i)),o&&o.get(tt).load(lF)}fadeInRipple(n,e,i={}){let r=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),o=y(y({},Rc),i.animation);i.centered&&(n=r.left+r.width/2,e=r.top+r.height/2);let a=i.radius||cF(n,e,r),s=n-r.left,l=e-r.top,d=o.enterDuration,u=document.createElement("div");u.classList.add("mat-ripple-element"),u.style.left=`${s-a}px`,u.style.top=`${l-a}px`,u.style.height=`${a*2}px`,u.style.width=`${a*2}px`,i.color!=null&&(u.style.backgroundColor=i.color),u.style.transitionDuration=`${d}ms`,this._containerElement.appendChild(u);let h=window.getComputedStyle(u),_=h.transitionProperty,v=h.transitionDuration,S=_==="none"||v==="0s"||v==="0s, 0s"||r.width===0&&r.height===0,A=new Fv(this,u,i,S);u.style.transform="scale3d(1, 1, 1)",A.state=jn.FADING_IN,i.persistent||(this._mostRecentTransientRipple=A);let oe=null;return!S&&(d||o.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let ae=()=>{oe&&(oe.fallbackTimer=null),clearTimeout(kt),this._finishRippleTransition(A)},Ke=()=>this._destroyRipple(A),kt=setTimeout(Ke,d+100);u.addEventListener("transitionend",ae),u.addEventListener("transitioncancel",Ke),oe={onTransitionEnd:ae,onTransitionCancel:Ke,fallbackTimer:kt}}),this._activeRipples.set(A,oe),(S||!d)&&this._finishRippleTransition(A),A}fadeOutRipple(n){if(n.state===jn.FADING_OUT||n.state===jn.HIDDEN)return;let e=n.element,i=y(y({},Rc),n.config.animation);e.style.transitionDuration=`${i.exitDuration}ms`,e.style.opacity="0",n.state=jn.FADING_OUT,(n._animationForciblyDisabledThroughCss||!i.exitDuration)&&this._finishRippleTransition(n)}fadeOutAll(){this._getActiveRipples().forEach(n=>n.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(n=>{n.config.persistent||n.fadeOut()})}setupTriggerEvents(n){let e=sn(n);!this._platform.isBrowser||!e||e===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=e,bD.forEach(i=>{t._eventManager.addHandler(this._ngZone,i,e,this)}))}handleEvent(n){n.type==="mousedown"?this._onMousedown(n):n.type==="touchstart"?this._onTouchStart(n):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{yD.forEach(e=>{this._triggerElement.addEventListener(e,this,vD)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(n){n.state===jn.FADING_IN?this._startFadeOutTransition(n):n.state===jn.FADING_OUT&&this._destroyRipple(n)}_startFadeOutTransition(n){let e=n===this._mostRecentTransientRipple,{persistent:i}=n.config;n.state=jn.VISIBLE,!i&&(!e||!this._isPointerDown)&&n.fadeOut()}_destroyRipple(n){let e=this._activeRipples.get(n)??null;this._activeRipples.delete(n),this._activeRipples.size||(this._containerRect=null),n===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),n.state=jn.HIDDEN,e!==null&&(n.element.removeEventListener("transitionend",e.onTransitionEnd),n.element.removeEventListener("transitioncancel",e.onTransitionCancel),e.fallbackTimer!==null&&clearTimeout(e.fallbackTimer)),n.element.remove()}_onMousedown(n){let e=qo(n),i=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+sF;!this._target.rippleDisabled&&!e&&!i&&(this._isPointerDown=!0,this.fadeInRipple(n.clientX,n.clientY,this._target.rippleConfig))}_onTouchStart(n){if(!this._target.rippleDisabled&&!Yo(n)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let e=n.changedTouches;if(e)for(let i=0;i<e.length;i++)this.fadeInRipple(e[i].clientX,e[i].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(n=>{let e=n.state===jn.VISIBLE||n.config.terminateOnPointerUp&&n.state===jn.FADING_IN;!n.config.persistent&&e&&n.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let n=this._triggerElement;n&&(bD.forEach(e=>t._eventManager.removeHandler(e,n,this)),this._pointerUpEventsRegistered&&(yD.forEach(e=>n.removeEventListener(e,this,vD)),this._pointerUpEventsRegistered=!1))}};function cF(t,n,e){let i=Math.max(Math.abs(t-e.left),Math.abs(t-e.right)),r=Math.max(Math.abs(n-e.top),Math.abs(n-e.bottom));return Math.sqrt(i*i+r*r)}var ys=new C("mat-ripple-global-options"),or=(()=>{class t{_elementRef=c(L);_animationsDisabled=Re();color;unbounded=!1;centered=!1;radius=0;animation;get disabled(){return this._disabled}set disabled(e){e&&this.fadeOutAllNonPersistent(),this._disabled=e,this._setupTriggerEventsIfEnabled()}_disabled=!1;get trigger(){return this._trigger||this._elementRef.nativeElement}set trigger(e){this._trigger=e,this._setupTriggerEventsIfEnabled()}_trigger;_rippleRenderer;_globalOptions;_isInitialized=!1;constructor(){let e=c($),i=c(Ce),r=c(ys,{optional:!0}),o=c(K);this._globalOptions=r||{},this._rippleRenderer=new Xo(this,e,this._elementRef,i,o)}ngOnInit(){this._isInitialized=!0,this._setupTriggerEventsIfEnabled()}ngOnDestroy(){this._rippleRenderer._removeTriggerEvents()}fadeOutAll(){this._rippleRenderer.fadeOutAll()}fadeOutAllNonPersistent(){this._rippleRenderer.fadeOutAllNonPersistent()}get rippleConfig(){return{centered:this.centered,radius:this.radius,color:this.color,animation:y(y(y({},this._globalOptions.animation),this._animationsDisabled?{enterDuration:0,exitDuration:0}:{}),this.animation),terminateOnPointerUp:this._globalOptions.terminateOnPointerUp}}get rippleDisabled(){return this.disabled||!!this._globalOptions.disabled}_setupTriggerEventsIfEnabled(){!this.disabled&&this._isInitialized&&this._rippleRenderer.setupTriggerEvents(this.trigger)}launch(e,i=0,r){return typeof e=="number"?this._rippleRenderer.fadeInRipple(e,i,y(y({},this.rippleConfig),r)):this._rippleRenderer.fadeInRipple(0,0,y(y({},this.rippleConfig),e))}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","mat-ripple",""],["","matRipple",""]],hostAttrs:[1,"mat-ripple"],hostVars:2,hostBindings:function(i,r){i&2&&N("mat-ripple-unbounded",r.unbounded)},inputs:{color:[0,"matRippleColor","color"],unbounded:[0,"matRippleUnbounded","unbounded"],centered:[0,"matRippleCentered","centered"],radius:[0,"matRippleRadius","radius"],animation:[0,"matRippleAnimation","animation"],disabled:[0,"matRippleDisabled","disabled"],trigger:[0,"matRippleTrigger","trigger"]},exportAs:["matRipple"]})}return t})();var dF={capture:!0},uF=["focus","mousedown","mouseenter","touchstart"],jv="mat-ripple-loader-uninitialized",Vv="mat-ripple-loader-class-name",CD="mat-ripple-loader-centered",sf="mat-ripple-loader-disabled",wD=(()=>{class t{_document=c(X);_animationsDisabled=Re();_globalRippleOptions=c(ys,{optional:!0});_platform=c(Ce);_ngZone=c($);_injector=c(K);_eventCleanups;_hosts=new Map;constructor(){let e=c(It).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>uF.map(i=>e.listen(this._document,i,this._onInteraction,dF)))}ngOnDestroy(){let e=this._hosts.keys();for(let i of e)this.destroyRipple(i);this._eventCleanups.forEach(i=>i())}configureRipple(e,i){e.setAttribute(jv,this._globalRippleOptions?.namespace??""),(i.className||!e.hasAttribute(Vv))&&e.setAttribute(Vv,i.className||""),i.centered&&e.setAttribute(CD,""),i.disabled&&e.setAttribute(sf,"")}setDisabled(e,i){let r=this._hosts.get(e);r?(r.target.rippleDisabled=i,!i&&!r.hasSetUpEvents&&(r.hasSetUpEvents=!0,r.renderer.setupTriggerEvents(e))):i?e.setAttribute(sf,""):e.removeAttribute(sf)}_onInteraction=e=>{let i=$t(e);if(i instanceof HTMLElement){let r=i.closest(`[${jv}="${this._globalRippleOptions?.namespace??""}"]`);r&&this._createRipple(r)}};_createRipple(e){if(!this._document||this._hosts.has(e))return;e.querySelector(".mat-ripple")?.remove();let i=this._document.createElement("span");i.classList.add("mat-ripple",e.getAttribute(Vv)),e.append(i);let r=this._globalRippleOptions,o=this._animationsDisabled?0:r?.animation?.enterDuration??Rc.enterDuration,a=this._animationsDisabled?0:r?.animation?.exitDuration??Rc.exitDuration,s={rippleDisabled:this._animationsDisabled||r?.disabled||e.hasAttribute(sf),rippleConfig:{centered:e.hasAttribute(CD),terminateOnPointerUp:r?.terminateOnPointerUp,animation:{enterDuration:o,exitDuration:a}}},l=new Xo(s,this._ngZone,i,this._platform,this._injector),d=!s.rippleDisabled;d&&l.setupTriggerEvents(e),this._hosts.set(e,{target:s,renderer:l,hasSetUpEvents:d}),e.removeAttribute(jv)}destroyRipple(e){let i=this._hosts.get(e);i&&(i.renderer._removeTriggerEvents(),this._hosts.delete(e))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var gn=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["structural-styles"]],decls:0,vars:0,template:function(i,r){},styles:[`.mat-focus-indicator {
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
`],encapsulation:2})}return t})();var mF=["*",[["","progressIndicator",""]]],fF=["*","[progressIndicator]"];function hF(t,n){t&1&&(Ve(0,"div",1),B(1,1),Xe())}var pF=new C("MAT_BUTTON_CONFIG");function SD(t){return t==null?void 0:Nt(t)}var lf=(()=>{class t{_elementRef=c(L);_ngZone=c($);_animationsDisabled=Re();_config=c(pF,{optional:!0});_focusMonitor=c(Ht);_cleanupClick;_renderer=c(xe);_rippleLoader=c(wD);_isAnchor;_isFab=!1;color;get disableRipple(){return this._disableRipple}set disableRipple(e){this._disableRipple=e,this._updateRippleDisabled()}_disableRipple=!1;get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._updateRippleDisabled()}_disabled=!1;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(e){this.tabIndex=e}showProgress=Lo(!1,{transform:Y});constructor(){c(tt).load(gn);let e=this._elementRef.nativeElement;this._isAnchor=e.tagName==="A",this.disabledInteractive=this._config?.disabledInteractive??!1,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(e,{className:"mat-mdc-button-ripple"})}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0),this._isAnchor&&this._setupAsAnchor()}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement)}focus(e="program",i){e?this._focusMonitor.focusVia(this._elementRef.nativeElement,e,i):this._elementRef.nativeElement.focus(i)}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:!0}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled)}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,"click",e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}))}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,hostAttrs:[1,"mat-mdc-button-base"],hostVars:15,hostBindings:function(i,r){i&2&&(j("disabled",r._getDisabledAttribute())("aria-disabled",r._getAriaDisabled())("tabindex",r._getTabIndex()),et(r.color?"mat-"+r.color:""),N("mat-mdc-button-progress-indicator-shown",r.showProgress())("mat-mdc-button-disabled",r.disabled)("mat-mdc-button-disabled-interactive",r.disabledInteractive)("mat-unthemed",!r.color)("_mat-animation-noopable",r._animationsDisabled))},inputs:{color:"color",disableRipple:[2,"disableRipple","disableRipple",Y],disabled:[2,"disabled","disabled",Y],ariaDisabled:[2,"aria-disabled","ariaDisabled",Y],disabledInteractive:[2,"disabledInteractive","disabledInteractive",Y],tabIndex:[2,"tabIndex","tabIndex",SD],_tabindex:[2,"tabindex","_tabindex",SD],showProgress:[1,"showProgress"]}})}return t})(),Mn=(()=>{class t extends lf{constructor(){super(),this._rippleLoader.configureRipple(this._elementRef.nativeElement,{centered:!0})}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["button","mat-icon-button",""],["a","mat-icon-button",""],["button","matIconButton",""],["a","matIconButton",""]],hostAttrs:[1,"mdc-icon-button","mat-mdc-icon-button"],exportAs:["matButton","matAnchor"],features:[ge],ngContentSelectors:fF,decls:5,vars:1,consts:[[1,"mat-mdc-button-persistent-ripple","mdc-icon-button__ripple"],[1,"mat-mdc-button-progress-indicator-container"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(i,r){i&1&&(ve(mF),xt(0,"span",0),B(1),D(2,hF,2,0,"div",1),xt(3,"span",2)(4,"span",3)),i&2&&(p(2),E(r.showProgress()?2:-1))},styles:[`.mat-mdc-icon-button {
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
`],encapsulation:2})}return t})();var gF=new C("cdk-dir-doc",{providedIn:"root",factory:()=>c(X)}),_F=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function xD(t){let n=t?.toLowerCase()||"";return n==="auto"&&typeof navigator<"u"&&navigator?.language?_F.test(navigator.language)?"rtl":"ltr":n==="rtl"?"rtl":"ltr"}var wt=(()=>{class t{get value(){return this.valueSignal()}valueSignal=T("ltr");change=new O;constructor(){let e=c(gF,{optional:!0});if(e){let i=e.body?e.body.dir:null,r=e.documentElement?e.documentElement.dir:null;this.valueSignal.set(xD(i||r||"ltr"))}}ngOnDestroy(){this.change.complete()}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var _e=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();var Hr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[_e]})}return t})();var ED=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""]],[["","progressIndicator",""]]],MD=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]","[progressIndicator]"];function vF(t,n){t&1&&(Ve(0,"div",2),B(1,3),Xe())}function bF(t,n){t&1&&(Ve(0,"div",2),B(1,3),Xe())}var DD=new Map([["text",["mat-mdc-button"]],["filled",["mdc-button--unelevated","mat-mdc-unelevated-button"]],["elevated",["mdc-button--raised","mat-mdc-raised-button"]],["outlined",["mdc-button--outlined","mat-mdc-outlined-button"]],["tonal",["mat-tonal-button"]]]),ot=(()=>{class t extends lf{get appearance(){return this._appearance}set appearance(e){this.setAppearance(e||this._config?.defaultAppearance||"text")}_appearance=null;constructor(){super();let e=yF(this._elementRef.nativeElement);e&&this.setAppearance(e)}setAppearance(e){if(e===this._appearance)return;let i=this._elementRef.nativeElement.classList,r=this._appearance?DD.get(this._appearance):null,o=DD.get(e);r&&i.remove(...r),i.add(...o),this._appearance=e}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["button","matButton",""],["a","matButton",""],["button","mat-button",""],["button","mat-raised-button",""],["button","mat-flat-button",""],["button","mat-stroked-button",""],["a","mat-button",""],["a","mat-raised-button",""],["a","mat-flat-button",""],["a","mat-stroked-button",""]],hostAttrs:[1,"mdc-button"],inputs:{appearance:[0,"matButton","appearance"]},exportAs:["matButton","matAnchor"],features:[ge],ngContentSelectors:MD,decls:8,vars:5,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-mdc-button-progress-indicator-container"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(i,r){i&1&&(ve(ED),xt(0,"span",0),B(1),Ve(2,"span",1),B(3,1),Xe(),B(4,2),D(5,vF,2,0,"div",2),xt(6,"span",3)(7,"span",4)),i&2&&(N("mdc-button__ripple",!r._isFab)("mdc-fab__ripple",r._isFab),p(5),E(r.showProgress()?5:-1))},styles:[`.mat-mdc-button-base {
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
`],encapsulation:2})}return t})();function yF(t){return t.hasAttribute("mat-raised-button")?"elevated":t.hasAttribute("mat-stroked-button")?"outlined":t.hasAttribute("mat-flat-button")?"filled":t.hasAttribute("mat-button")?"text":null}var CF=new C("mat-mdc-fab-default-options",{providedIn:"root",factory:()=>Bv}),Bv={color:"accent"},Cs=(()=>{class t extends lf{_options=c(CF,{optional:!0});_isFab=!0;extended=!1;constructor(){super(),this._options=this._options||Bv,this.color=this._options.color||Bv.color}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["button","mat-fab",""],["a","mat-fab",""],["button","matFab",""],["a","matFab",""]],hostAttrs:[1,"mdc-fab","mat-mdc-fab-base","mat-mdc-fab"],hostVars:4,hostBindings:function(i,r){i&2&&N("mdc-fab--extended",r.extended)("mat-mdc-extended-fab",r.extended)},inputs:{extended:[2,"extended","extended",Y]},exportAs:["matButton","matAnchor"],features:[ge],ngContentSelectors:MD,decls:8,vars:5,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-mdc-button-progress-indicator-container"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(i,r){i&1&&(ve(ED),xt(0,"span",0),B(1),Ve(2,"span",1),B(3,1),Xe(),B(4,2),D(5,bF,2,0,"div",2),xt(6,"span",3)(7,"span",4)),i&2&&(N("mdc-button__ripple",!r._isFab)("mdc-fab__ripple",r._isFab),p(5),E(r.showProgress()?5:-1))},styles:[`.mat-mdc-fab-base {
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
`],encapsulation:2})}return t})();var Pe=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[Hr,_e]})}return t})();function ID(t){return Error(`Unable to find icon with the name "${t}"`)}function wF(){return Error("Could not find HttpClient for use with Angular Material icons. Please add provideHttpClient() to your providers.")}function ND(t){return Error(`The URL provided to MatIconRegistry was not trusted as a resource URL via Angular's DomSanitizer. Attempted URL was "${t}".`)}function TD(t){return Error(`The literal provided to MatIconRegistry was not trusted as safe HTML by Angular's DomSanitizer. Attempted literal was "${t}".`)}var ar=class{url;svgText;options;svgElement=null;constructor(n,e,i){this.url=n,this.svgText=e,this.options=i}},AD=(()=>{class t{_httpClient;_sanitizer;_errorHandler;_document;_svgIconConfigs=new Map;_iconSetConfigs=new Map;_cachedIconsByUrl=new Map;_inProgressUrlFetches=new Map;_fontCssClassesByAlias=new Map;_resolvers=[];_defaultFontSetClass=["material-icons","mat-ligature-font"];constructor(e,i,r,o){this._httpClient=e,this._sanitizer=i,this._errorHandler=o,this._document=r}addSvgIcon(e,i,r){return this.addSvgIconInNamespace("",e,i,r)}addSvgIconLiteral(e,i,r){return this.addSvgIconLiteralInNamespace("",e,i,r)}addSvgIconInNamespace(e,i,r,o){return this._addSvgIconConfig(e,i,new ar(r,null,o))}addSvgIconResolver(e){return this._resolvers.push(e),this}addSvgIconLiteralInNamespace(e,i,r,o){let a=this._sanitizer.sanitize(Oe.HTML,r);if(!a)throw TD(r);let s=Zo(a);return this._addSvgIconConfig(e,i,new ar("",s,o))}addSvgIconSet(e,i){return this.addSvgIconSetInNamespace("",e,i)}addSvgIconSetLiteral(e,i){return this.addSvgIconSetLiteralInNamespace("",e,i)}addSvgIconSetInNamespace(e,i,r){return this._addSvgIconSetConfig(e,new ar(i,null,r))}addSvgIconSetLiteralInNamespace(e,i,r){let o=this._sanitizer.sanitize(Oe.HTML,i);if(!o)throw TD(i);let a=Zo(o);return this._addSvgIconSetConfig(e,new ar("",a,r))}registerFontClassAlias(e,i=e){return this._fontCssClassesByAlias.set(e,i),this}classNameForFontAlias(e){return this._fontCssClassesByAlias.get(e)||e}setDefaultFontSetClass(...e){return this._defaultFontSetClass=e,this}getDefaultFontSetClass(){return this._defaultFontSetClass}getSvgIconFromUrl(e){let i=this._sanitizer.sanitize(Oe.RESOURCE_URL,e);if(!i)throw ND(e);let r=this._cachedIconsByUrl.get(i);return r?ie(cf(r)):this._loadSvgIconFromConfig(new ar(e,null)).pipe(Ft(o=>this._cachedIconsByUrl.set(i,o)),ee(o=>cf(o)))}getNamedSvgIcon(e,i=""){let r=kD(i,e),o=this._svgIconConfigs.get(r);if(o)return this._getSvgFromConfig(o);if(o=this._getIconConfigFromResolvers(i,e),o)return this._svgIconConfigs.set(r,o),this._getSvgFromConfig(o);let a=this._iconSetConfigs.get(i);return a?this._getSvgFromIconSetConfigs(e,a):tl(ID(r))}ngOnDestroy(){this._resolvers=[],this._svgIconConfigs.clear(),this._iconSetConfigs.clear(),this._cachedIconsByUrl.clear()}_getSvgFromConfig(e){return e.svgText?ie(cf(this._svgElementFromConfig(e))):this._loadSvgIconFromConfig(e).pipe(ee(i=>cf(i)))}_getSvgFromIconSetConfigs(e,i){let r=this._extractIconWithNameFromAnySet(e,i);if(r)return ie(r);let o=i.filter(a=>!a.svgText).map(a=>this._loadSvgIconSetFromConfig(a).pipe(Cr(s=>{let d=`Loading icon set URL: ${this._sanitizer.sanitize(Oe.RESOURCE_URL,a.url)} failed: ${s.message}`;return this._errorHandler.handleError(new Error(d)),ie(null)})));return rl(o).pipe(ee(()=>{let a=this._extractIconWithNameFromAnySet(e,i);if(!a)throw ID(e);return a}))}_extractIconWithNameFromAnySet(e,i){for(let r=i.length-1;r>=0;r--){let o=i[r];if(o.svgText&&o.svgText.toString().indexOf(e)>-1){let a=this._svgElementFromConfig(o),s=this._extractSvgIconFromSet(a,e,o.options);if(s)return s}}return null}_loadSvgIconFromConfig(e){return this._fetchIcon(e).pipe(Ft(i=>e.svgText=i),ee(()=>this._svgElementFromConfig(e)))}_loadSvgIconSetFromConfig(e){return e.svgText?ie(null):this._fetchIcon(e).pipe(Ft(i=>e.svgText=i))}_extractSvgIconFromSet(e,i,r){let o=e.querySelector(`[id="${i}"]`);if(!o)return null;let a=o.cloneNode(!0);if(a.removeAttribute("id"),a.nodeName.toLowerCase()==="svg")return this._setSvgAttributes(a,r);if(a.nodeName.toLowerCase()==="symbol")return this._setSvgAttributes(this._toSvgElement(a),r);let s=this._svgElementFromString(Zo("<svg></svg>"));return s.appendChild(a),this._setSvgAttributes(s,r)}_svgElementFromString(e){let i=this._document.createElement("DIV");i.innerHTML=e;let r=i.querySelector("svg");if(!r)throw Error("<svg> tag not found");return r}_toSvgElement(e){let i=this._svgElementFromString(Zo("<svg></svg>")),r=e.attributes;for(let o=0;o<r.length;o++){let{name:a,value:s}=r[o];a!=="id"&&i.setAttribute(a,s)}for(let o=0;o<e.childNodes.length;o++)e.childNodes[o].nodeType===this._document.ELEMENT_NODE&&i.appendChild(e.childNodes[o].cloneNode(!0));return i}_setSvgAttributes(e,i){return e.setAttribute("fit",""),e.setAttribute("height","100%"),e.setAttribute("width","100%"),e.setAttribute("preserveAspectRatio","xMidYMid meet"),e.setAttribute("focusable","false"),i&&i.viewBox&&e.setAttribute("viewBox",i.viewBox),e}_fetchIcon(e){let{url:i,options:r}=e,o=r?.withCredentials??!1;if(!this._httpClient)throw wF();if(i==null)throw Error(`Cannot fetch icon from URL "${i}".`);let a=this._sanitizer.sanitize(Oe.RESOURCE_URL,i);if(!a)throw ND(i);let s=this._inProgressUrlFetches.get(a);if(s)return s;let l=this._httpClient.get(a,{responseType:"text",withCredentials:o}).pipe(ee(d=>Zo(d)),fo(()=>this._inProgressUrlFetches.delete(a)),ol());return this._inProgressUrlFetches.set(a,l),l}_addSvgIconConfig(e,i,r){return this._svgIconConfigs.set(kD(e,i),r),this}_addSvgIconSetConfig(e,i){let r=this._iconSetConfigs.get(e);return r?r.push(i):this._iconSetConfigs.set(e,[i]),this}_svgElementFromConfig(e){if(!e.svgElement){let i=this._svgElementFromString(e.svgText);this._setSvgAttributes(i,e.options),e.svgElement=i}return e.svgElement}_getIconConfigFromResolvers(e,i){for(let r=0;r<this._resolvers.length;r++){let o=this._resolvers[r](i,e);if(o)return SF(o)?new ar(o.url,null,o.options):new ar(o,null)}}static \u0275fac=function(i){return new(i||t)(te(Xa,8),te(oc),te(X,8),te(Jt))};static \u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"root"})}return t})();function cf(t){return t.cloneNode(!0)}function kD(t,n){return t+":"+n}function SF(t){return!!(t.url&&t.options)}var xF=["*"],DF=new C("MAT_ICON_DEFAULT_OPTIONS"),EF=new C("mat-icon-location",{providedIn:"root",factory:()=>{let t=c(X),n=t?t.location:null;return{getPathname:()=>n?n.pathname+n.search:""}}}),RD=["clip-path","color-profile","src","cursor","fill","filter","marker","marker-start","marker-mid","marker-end","mask","stroke"],MF=RD.map(t=>`[${t}]`).join(", "),IF=/^url\(['"]?#(.*?)['"]?\)$/,We=(()=>{class t{_elementRef=c(L);_iconRegistry=c(AD);_location=c(EF);_errorHandler=c(Jt);_defaultColor;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;inline=!1;get svgIcon(){return this._svgIcon}set svgIcon(e){e!==this._svgIcon&&(e?this._updateSvgIcon(e):this._svgIcon&&this._clearSvgElement(),this._svgIcon=e)}_svgIcon;get fontSet(){return this._fontSet}set fontSet(e){let i=this._cleanupFontValue(e);i!==this._fontSet&&(this._fontSet=i,this._updateFontIconClasses())}_fontSet;get fontIcon(){return this._fontIcon}set fontIcon(e){let i=this._cleanupFontValue(e);i!==this._fontIcon&&(this._fontIcon=i,this._updateFontIconClasses())}_fontIcon;_previousFontSetClass=[];_previousFontIconClass;_svgName=null;_svgNamespace=null;_previousPath;_elementsWithExternalReferences;_currentIconFetch=ue.EMPTY;constructor(){let e=c(new wn("aria-hidden"),{optional:!0}),i=c(DF,{optional:!0});i&&(i.color&&(this.color=this._defaultColor=i.color),i.fontSet&&(this.fontSet=i.fontSet)),e||this._elementRef.nativeElement.setAttribute("aria-hidden","true")}_splitIconName(e){if(!e)return["",""];let i=e.split(":");switch(i.length){case 1:return["",i[0]];case 2:return i;default:throw Error(`Invalid icon name: "${e}"`)}}ngOnInit(){this._updateFontIconClasses()}ngAfterViewChecked(){let e=this._elementsWithExternalReferences;if(e&&e.size){let i=this._location.getPathname();i!==this._previousPath&&(this._previousPath=i,this._prependPathToReferences(i))}}ngOnDestroy(){this._currentIconFetch.unsubscribe(),this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear()}_usingFontIcon(){return!this.svgIcon}_setSvgElement(e){this._clearSvgElement();let i=this._location.getPathname();this._previousPath=i,this._cacheChildrenWithExternalReferences(e),this._prependPathToReferences(i),this._elementRef.nativeElement.appendChild(e)}_clearSvgElement(){let e=this._elementRef.nativeElement,i=e.childNodes.length;for(this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear();i--;){let r=e.childNodes[i];(r.nodeType!==1||r.nodeName.toLowerCase()==="svg")&&r.remove()}}_updateFontIconClasses(){if(!this._usingFontIcon())return;let e=this._elementRef.nativeElement,i=(this.fontSet?this._iconRegistry.classNameForFontAlias(this.fontSet).split(/ +/):this._iconRegistry.getDefaultFontSetClass()).filter(r=>r.length>0);this._previousFontSetClass.forEach(r=>e.classList.remove(r)),i.forEach(r=>e.classList.add(r)),this._previousFontSetClass=i,this.fontIcon!==this._previousFontIconClass&&!i.includes("mat-ligature-font")&&(this._previousFontIconClass&&e.classList.remove(this._previousFontIconClass),this.fontIcon&&e.classList.add(this.fontIcon),this._previousFontIconClass=this.fontIcon)}_cleanupFontValue(e){return typeof e=="string"?e.trim().split(" ")[0]:e}_prependPathToReferences(e){let i=this._elementsWithExternalReferences;i&&i.forEach((r,o)=>{r.forEach(a=>{o.setAttribute(a.name,`url('${e}#${a.value}')`)})})}_cacheChildrenWithExternalReferences(e){let i=e.querySelectorAll(MF),r=this._elementsWithExternalReferences=this._elementsWithExternalReferences||new Map;for(let o=0;o<i.length;o++)RD.forEach(a=>{let s=i[o],l=s.getAttribute(a),d=l?l.match(IF):null;if(d){let u=r.get(s);u||(u=[],r.set(s,u)),u.push({name:a,value:d[1]})}})}_updateSvgIcon(e){if(this._svgNamespace=null,this._svgName=null,this._currentIconFetch.unsubscribe(),e){let[i,r]=this._splitIconName(e);i&&(this._svgNamespace=i),r&&(this._svgName=r),this._currentIconFetch=this._iconRegistry.getNamedSvgIcon(r,i).pipe(je(1)).subscribe(o=>this._setSvgElement(o),o=>{let a=`Error retrieving icon ${i}:${r}! ${o.message}`;this._errorHandler.handleError(new Error(a))})}}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-icon"]],hostAttrs:["role","img",1,"mat-icon","notranslate"],hostVars:10,hostBindings:function(i,r){i&2&&(j("data-mat-icon-type",r._usingFontIcon()?"font":"svg")("data-mat-icon-name",r._svgName||r.fontIcon)("data-mat-icon-namespace",r._svgNamespace||r.fontSet)("fontIcon",r._usingFontIcon()?r.fontIcon:null),et(r.color?"mat-"+r.color:""),N("mat-icon-inline",r.inline)("mat-icon-no-color",r.color!=="primary"&&r.color!=="accent"&&r.color!=="warn"))},inputs:{color:"color",inline:[2,"inline","inline",Y],svgIcon:"svgIcon",fontSet:"fontSet",fontIcon:"fontIcon"},exportAs:["matIcon"],ngContentSelectors:xF,decls:1,vars:0,template:function(i,r){i&1&&(ve(),B(0))},styles:[`mat-icon, mat-icon.mat-primary, mat-icon.mat-accent, mat-icon.mat-warn {
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
`],encapsulation:2})}return t})(),Fe=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[_e]})}return t})();var NF=20,Ur=(()=>{class t{_ngZone=c($);_platform=c(Ce);_renderer=c(It).createRenderer(null,null);_cleanupGlobalListener;_scrolled=new I;_scrolledCount=0;scrollContainers=new Map;register(e){this.scrollContainers.has(e)||this.scrollContainers.set(e,e.elementScrolled().subscribe(()=>this._scrolled.next(e)))}deregister(e){let i=this.scrollContainers.get(e);i&&(i.unsubscribe(),this.scrollContainers.delete(e))}scrolled(e=NF){return this._platform.isBrowser?new de(i=>{this._cleanupGlobalListener||(this._cleanupGlobalListener=this._ngZone.runOutsideAngular(()=>this._renderer.listen("document","scroll",()=>this._scrolled.next())));let r=e>0?this._scrolled.pipe(pa(e)).subscribe(i):this._scrolled.subscribe(i);return this._scrolledCount++,()=>{r.unsubscribe(),this._scrolledCount--,this._scrolledCount||(this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0)}}):ie()}ngOnDestroy(){this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0,this.scrollContainers.forEach((e,i)=>this.deregister(i)),this._scrolled.complete()}ancestorScrolled(e,i){let r=this.getAncestorScrollContainers(e);return this.scrolled(i).pipe(me(o=>!o||r.indexOf(o)>-1))}getAncestorScrollContainers(e){let i=[];return this.scrollContainers.forEach((r,o)=>{this._targetContainsElement(o,e)&&i.push(o)}),i}_targetContainsElement(e,i){let r=sn(i),o=e.getElementRef().nativeElement;do if(r==o)return!0;while(r=r.parentElement);return!1}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),ci=(()=>{class t{elementRef=c(L);scrollDispatcher=c(Ur);ngZone=c($);dir=c(wt,{optional:!0});_scrollElement=this.elementRef.nativeElement;_destroyed=new I;_renderer=c(xe);_cleanupScroll;_elementScrolled=new I;ngOnInit(){this._cleanupScroll=this.ngZone.runOutsideAngular(()=>this._renderer.listen(this._scrollElement,"scroll",e=>this._elementScrolled.next(e))),this.scrollDispatcher.register(this)}ngOnDestroy(){this._cleanupScroll?.(),this._elementScrolled.complete(),this.scrollDispatcher.deregister(this),this._destroyed.next(),this._destroyed.complete()}elementScrolled(){return this._elementScrolled}getElementRef(){return this.elementRef}scrollTo(e){let i=this.elementRef.nativeElement,r=this.dir&&this.dir.value=="rtl";e.left==null&&(e.left=r?e.end:e.start),e.right==null&&(e.right=r?e.start:e.end),e.bottom!=null&&(e.top=i.scrollHeight-i.clientHeight-e.bottom),r&&vs()!=li.NORMAL?(e.left!=null&&(e.right=i.scrollWidth-i.clientWidth-e.left),vs()==li.INVERTED?e.left=e.right:vs()==li.NEGATED&&(e.left=e.right?-e.right:e.right)):e.right!=null&&(e.left=i.scrollWidth-i.clientWidth-e.right),this._applyScrollToOptions(e)}_applyScrollToOptions(e){let i=this.elementRef.nativeElement;af()?i.scrollTo(e):(e.top!=null&&(i.scrollTop=e.top),e.left!=null&&(i.scrollLeft=e.left))}measureScrollOffset(e){let i="left",r="right",o=this.elementRef.nativeElement;if(e=="top")return o.scrollTop;if(e=="bottom")return o.scrollHeight-o.clientHeight-o.scrollTop;let a=this.dir&&this.dir.value=="rtl";return e=="start"?e=a?r:i:e=="end"&&(e=a?i:r),a&&vs()==li.INVERTED?e==i?o.scrollWidth-o.clientWidth-o.scrollLeft:o.scrollLeft:a&&vs()==li.NEGATED?e==i?o.scrollLeft+o.scrollWidth-o.clientWidth:-o.scrollLeft:e==i?o.scrollLeft:o.scrollWidth-o.clientWidth-o.scrollLeft}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdk-scrollable",""],["","cdkScrollable",""]]})}return t})(),TF=20,In=(()=>{class t{_platform=c(Ce);_listeners;_viewportSize=null;_change=new I;_document=c(X);constructor(){let e=c($),i=c(It).createRenderer(null,null);e.runOutsideAngular(()=>{if(this._platform.isBrowser){let r=o=>this._change.next(o);this._listeners=[i.listen("window","resize",r),i.listen("window","orientationchange",r)]}this.change().subscribe(()=>this._viewportSize=null)})}ngOnDestroy(){this._listeners?.forEach(e=>e()),this._change.complete()}getViewportSize(){this._viewportSize||this._updateViewportSize();let e={width:this._viewportSize.width,height:this._viewportSize.height};return this._platform.isBrowser||(this._viewportSize=null),e}getViewportRect(){let e=this.getViewportScrollPosition(),{width:i,height:r}=this.getViewportSize();return{top:e.top,left:e.left,bottom:e.top+r,right:e.left+i,height:r,width:i}}getViewportScrollPosition(){if(!this._platform.isBrowser)return{top:0,left:0};let e=this._document,i=this._getWindow(),r=e.documentElement,o=r.getBoundingClientRect(),a=-o.top||e.body?.scrollTop||i.scrollY||r.scrollTop||0,s=-o.left||e.body?.scrollLeft||i.scrollX||r.scrollLeft||0;return{top:a,left:s}}change(e=TF){return e>0?this._change.pipe(pa(e)):this._change}_getWindow(){return this._document.defaultView||window}_updateViewportSize(){let e=this._getWindow();this._viewportSize=this._platform.isBrowser?{width:e.innerWidth,height:e.innerHeight}:{width:0,height:0}}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var Vn=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})(),Hv=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[_e,Vn,_e,Vn]})}return t})();var uf=["*"],AF=["content"],OD=[[["mat-drawer"],["mat-sidenav"]],[["mat-drawer-content"],["mat-sidenav-content"]],"*"],PD=["mat-drawer, mat-sidenav","mat-drawer-content, mat-sidenav-content","*"];function RF(t,n){if(t&1){let e=se();m(0,"div",1),w("click",function(){W(e);let r=b();return G(r._onBackdropClicked())}),f()}if(t&2){let e=b();N("mat-drawer-shown",e._isShowingBackdrop())}}function OF(t,n){t&1&&(m(0,"mat-drawer-content"),B(1,2),f())}function PF(t,n){if(t&1){let e=se();m(0,"div",1),w("click",function(){W(e);let r=b();return G(r._onBackdropClicked())}),f()}if(t&2){let e=b();N("mat-drawer-shown",e._isShowingBackdrop())}}function FF(t,n){t&1&&(m(0,"mat-sidenav-content"),B(1,2),f())}var LF=`.mat-drawer-container {
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
`;var jF=new C("MAT_DRAWER_DEFAULT_AUTOSIZE",{providedIn:"root",factory:()=>!1}),Uv=new C("MAT_DRAWER_CONTAINER"),Ko=(()=>{class t extends ci{_platform=c(Ce);_changeDetectorRef=c(Me);_element=c(L);_ngZone=c($);_isInert=!1;_container=c(Pc);ngAfterContentInit(){this._container._contentMarginChanges.subscribe(()=>this._changeDetectorRef.markForCheck())}_drawerToggled(e){e.opened?this._ngZone.runOutsideAngular(()=>{e._animationEnd.pipe(Gh(50),je(1)).subscribe(()=>this._updateInert())}):this._updateInert()}_drawerModeChanged(){this._updateInert()}_updateInert(){let e=this._container._isShowingBackdrop();if(e!==this._isInert){let i=this._element.nativeElement;this._isInert=e,e?i.setAttribute("inert","true"):i.removeAttribute("inert")}}_shouldBeHidden(){if(this._platform.isBrowser)return!1;let{start:e,end:i}=this._container;return e!=null&&e.mode!=="over"&&e.opened||i!=null&&i.mode!=="over"&&i.opened}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275cmp=x({type:t,selectors:[["mat-drawer-content"]],hostAttrs:[1,"mat-drawer-content"],hostVars:6,hostBindings:function(i,r){i&2&&(jt("margin-left",r._container._contentMargins.left,"px")("margin-right",r._container._contentMargins.right,"px"),N("mat-drawer-content-hidden",r._shouldBeHidden()))},features:[Ie([{provide:ci,useExisting:t}]),ge],ngContentSelectors:uf,decls:1,vars:0,template:function(i,r){i&1&&(ve(),B(0))},encapsulation:2})}return t})(),Oc=(()=>{class t{_elementRef=c(L);_focusTrapFactory=c(Dc);_focusMonitor=c(Ht);_platform=c(Ce);_ngZone=c($);_renderer=c(xe);_interactivityChecker=c(gs);_doc=c(X);_isAnimating=!1;_container=c(Uv,{optional:!0});_focusTrap=null;_elementFocusedBeforeDrawerWasOpened=null;_eventCleanups;_isAttached=!1;_anchor=null;get position(){return this._position}set position(e){e=e==="end"?"end":"start",e!==this._position&&(this._isAttached&&this._updatePositionInParent(e),this._position=e,this.onPositionChanged.emit())}_position="start";get mode(){return this._mode}set mode(e){this._mode=e,this._updateFocusTrapState(),this._modeChanged.next(),this._getContent()?._drawerModeChanged()}_mode="over";get disableClose(){return this._disableClose}set disableClose(e){this._disableClose=lt(e)}_disableClose=!1;get autoFocus(){let e=this._autoFocus;return e??(this.mode==="side"?"dialog":"first-tabbable")}set autoFocus(e){(e==="true"||e==="false"||e==null)&&(e=lt(e)),this._autoFocus=e}_autoFocus;get opened(){return this._opened()}set opened(e){this.toggle(lt(e))}_opened=T(!1);_openedVia=null;_animationStarted=new I;_animationEnd=new I;openedChange=new O(!0);_openedStream=this.openedChange.pipe(me(e=>e),ee(()=>{}));openedStart=this._animationStarted.pipe(me(()=>this.opened),ga(void 0));_closedStream=this.openedChange.pipe(me(e=>!e),ee(()=>{}));closedStart=this._animationStarted.pipe(me(()=>!this.opened),ga(void 0));_destroyed=new I;onPositionChanged=new O;_content;_modeChanged=new I;_injector=c(K);_changeDetectorRef=c(Me);constructor(){this.openedChange.pipe(pe(this._destroyed)).subscribe(e=>{e?(this._elementFocusedBeforeDrawerWasOpened=this._doc.activeElement,this._takeFocus()):this._isFocusWithinDrawer()&&this._restoreFocus(this._openedVia||"program")}),this._eventCleanups=this._ngZone.runOutsideAngular(()=>{let e=this._renderer,i=this._elementRef.nativeElement;return[e.listen(i,"keydown",r=>{r.keyCode===27&&!this.disableClose&&!mt(r)&&this._ngZone.run(()=>{this.close(),r.stopPropagation(),r.preventDefault()})}),e.listen(i,"transitionend",this._handleTransitionEvent),e.listen(i,"transitioncancel",this._handleTransitionEvent)]}),this._animationEnd.subscribe(()=>{this.openedChange.emit(this.opened)})}_focusByCssSelector(e,i){let r=this._elementRef.nativeElement.querySelector(e);r&&(this._interactivityChecker.isFocusable(r)||(r.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let o=()=>{a(),s(),r.removeAttribute("tabindex")},a=this._renderer.listen(r,"blur",o),s=this._renderer.listen(r,"mousedown",o)})),r.focus(i))}_takeFocus(){if(!this._focusTrap)return;let e=this._elementRef.nativeElement;switch(this.autoFocus){case!1:case"dialog":return;case!0:case"first-tabbable":ct(()=>{let i=this._isAnimating?{preventScroll:!0}:void 0;!this._focusTrap.focusInitialElement(i)&&typeof e.focus=="function"&&e.focus(i)},{injector:this._injector});break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');break;default:this._focusByCssSelector(this.autoFocus);break}}_restoreFocus(e){this.autoFocus!=="dialog"&&(this._elementFocusedBeforeDrawerWasOpened?this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened,e):this._elementRef.nativeElement.blur(),this._elementFocusedBeforeDrawerWasOpened=null)}_isFocusWithinDrawer(){let e=this._doc.activeElement;return!!e&&this._elementRef.nativeElement.contains(e)}ngAfterViewInit(){this._isAttached=!0,this._position==="end"&&this._updatePositionInParent("end"),this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._updateFocusTrapState())}ngOnDestroy(){this._eventCleanups.forEach(e=>e()),this._focusTrap?.destroy(),this._anchor?.remove(),this._anchor=null,this._animationStarted.complete(),this._animationEnd.complete(),this._modeChanged.complete(),this._destroyed.next(),this._destroyed.complete()}open(e){return this.toggle(!0,e)}close(){return this.toggle(!1)}_closeViaBackdropClick(){return this._setOpen(!1,!0,"mouse")}toggle(e=!this.opened,i){e&&i&&(this._openedVia=i);let r=this._setOpen(e,!e&&this._isFocusWithinDrawer(),this._openedVia||"program");return e||(this._openedVia=null),r}_setOpen(e,i,r){return e===this.opened?Promise.resolve(e?"open":"close"):(this._opened.set(e),this._getContent()?._drawerToggled(this),this._container?._transitionsEnabled?this._isAnimating?(this._setIsAnimating(!1),this._simulateAnimation()):(this._setIsAnimating(!0),setTimeout(()=>this._animationStarted.next())):this._simulateAnimation(),this._elementRef.nativeElement.classList.toggle("mat-drawer-opened",e),!e&&i&&this._restoreFocus(r),this._changeDetectorRef.markForCheck(),this._updateFocusTrapState(),new Promise(o=>{this.openedChange.pipe(je(1)).subscribe(a=>o(a?"open":"close"))}))}_getContent(){return this._container?._content||this._container?._userContent}_setIsAnimating(e){e!==this._isAnimating&&(this._isAnimating=e,this._elementRef.nativeElement.classList.toggle("mat-drawer-animating",e))}_simulateAnimation(){setTimeout(()=>{this._animationStarted.next(),this._animationEnd.next()})}_getWidth(){return this._elementRef.nativeElement.offsetWidth||0}_updateFocusTrapState(){this._focusTrap&&(this._focusTrap.enabled=this.opened&&!!this._container?._isShowingBackdrop())}_updatePositionInParent(e){if(!this._platform.isBrowser)return;let i=this._elementRef.nativeElement,r=i.parentNode;e==="end"?(this._anchor||(this._anchor=this._doc.createComment("mat-drawer-anchor"),r.insertBefore(this._anchor,i)),r.appendChild(i)):this._anchor&&this._anchor.parentNode.insertBefore(i,this._anchor)}_handleTransitionEvent=e=>{let i=this._elementRef.nativeElement;e.target===i&&this._ngZone.run(()=>{e.type==="transitionend"&&this._setIsAnimating(!1),this._animationEnd.next(e)})};static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-drawer"]],viewQuery:function(i,r){if(i&1&&Te(AF,5),i&2){let o;U(o=z())&&(r._content=o.first)}},hostAttrs:[1,"mat-drawer"],hostVars:12,hostBindings:function(i,r){i&2&&(j("align",null)("tabIndex",r.mode!=="side"?"-1":null),jt("visibility",!r._container&&!r.opened?"hidden":null),N("mat-drawer-end",r.position==="end")("mat-drawer-over",r.mode==="over")("mat-drawer-push",r.mode==="push")("mat-drawer-side",r.mode==="side"))},inputs:{position:"position",mode:"mode",disableClose:"disableClose",autoFocus:"autoFocus",opened:"opened"},outputs:{openedChange:"openedChange",_openedStream:"opened",openedStart:"openedStart",_closedStream:"closed",closedStart:"closedStart",onPositionChanged:"positionChanged"},exportAs:["matDrawer"],ngContentSelectors:uf,decls:3,vars:0,consts:[["content",""],["cdkScrollable","",1,"mat-drawer-inner-container"]],template:function(i,r){i&1&&(ve(),m(0,"div",1,0),B(2),f())},dependencies:[ci],encapsulation:2})}return t})(),Pc=(()=>{class t{_dir=c(wt,{optional:!0});_element=c(L);_ngZone=c($);_changeDetectorRef=c(Me);_animationDisabled=Re();_transitionsEnabled=!1;_allDrawers;_drawers=new pn;_content;_userContent;get start(){return this._start}get end(){return this._end}get autosize(){return this._autosize}set autosize(e){this._autosize=lt(e)}_autosize=c(jF);get hasBackdrop(){return this._drawerHasBackdrop(this._start)||this._drawerHasBackdrop(this._end)}set hasBackdrop(e){this._backdropOverride=e==null?null:lt(e)}_backdropOverride=null;backdropClick=new O;_start=null;_end=null;_left=null;_right=null;_destroyed=new I;_doCheckSubject=new I;_contentMargins={left:null,right:null};_contentMarginChanges=new I;get scrollable(){return this._userContent||this._content}_injector=c(K);constructor(){let e=c(Ce),i=c(In);this._dir?.change.pipe(pe(this._destroyed)).subscribe(()=>{this._validateDrawers(),this.updateContentMargins()}),i.change().pipe(pe(this._destroyed)).subscribe(()=>this.updateContentMargins()),!this._animationDisabled&&e.isBrowser&&this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._element.nativeElement.classList.add("mat-drawer-transition"),this._transitionsEnabled=!0},200)})}ngAfterContentInit(){this._allDrawers.changes.pipe(Ze(this._allDrawers),pe(this._destroyed)).subscribe(e=>{this._drawers.reset(e.filter(i=>!i._container||i._container===this)),this._drawers.notifyOnChanges()}),this._drawers.changes.pipe(Ze(null)).subscribe(()=>{this._validateDrawers(),this._drawers.forEach(e=>{this._watchDrawerToggle(e),this._watchDrawerPosition(e),this._watchDrawerMode(e)}),(!this._drawers.length||this._isDrawerOpen(this._start)||this._isDrawerOpen(this._end))&&this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),this._ngZone.runOutsideAngular(()=>{this._doCheckSubject.pipe(Zn(10),pe(this._destroyed)).subscribe(()=>this.updateContentMargins())})}ngOnDestroy(){this._contentMarginChanges.complete(),this._doCheckSubject.complete(),this._drawers.destroy(),this._destroyed.next(),this._destroyed.complete()}open(){this._drawers.forEach(e=>e.open())}close(){this._drawers.forEach(e=>e.close())}updateContentMargins(){let e=0,i=0;if(this._left&&this._left.opened){if(this._left.mode=="side")e+=this._left._getWidth();else if(this._left.mode=="push"){let r=this._left._getWidth();e+=r,i-=r}}if(this._right&&this._right.opened){if(this._right.mode=="side")i+=this._right._getWidth();else if(this._right.mode=="push"){let r=this._right._getWidth();i+=r,e-=r}}e=e||null,i=i||null,(e!==this._contentMargins.left||i!==this._contentMargins.right)&&(this._contentMargins={left:e,right:i},this._ngZone.run(()=>this._contentMarginChanges.next(this._contentMargins)))}ngDoCheck(){this._autosize&&this._isPushed()&&this._ngZone.runOutsideAngular(()=>this._doCheckSubject.next())}_watchDrawerToggle(e){e._animationStarted.pipe(pe(this._drawers.changes)).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),e.mode!=="side"&&e.openedChange.pipe(pe(this._drawers.changes)).subscribe(()=>this._setContainerClass(e.opened))}_watchDrawerPosition(e){e.onPositionChanged.pipe(pe(this._drawers.changes)).subscribe(()=>{ct({read:()=>this._validateDrawers()},{injector:this._injector})})}_watchDrawerMode(e){e._modeChanged.pipe(pe(ft(this._drawers.changes,this._destroyed))).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()})}_setContainerClass(e){let i=this._element.nativeElement.classList,r="mat-drawer-container-has-open";e?i.add(r):i.remove(r)}_validateDrawers(){this._start=this._end=null,this._drawers.forEach(e=>{e.position=="end"?(this._end!=null,this._end=e):(this._start!=null,this._start=e)}),this._right=this._left=null,this._dir&&this._dir.value==="rtl"?(this._left=this._end,this._right=this._start):(this._left=this._start,this._right=this._end)}_isPushed(){return this._isDrawerOpen(this._start)&&this._start.mode!="over"||this._isDrawerOpen(this._end)&&this._end.mode!="over"}_onBackdropClicked(){this.backdropClick.emit(),this._closeModalDrawersViaBackdrop()}_closeModalDrawersViaBackdrop(){[this._start,this._end].filter(e=>e&&!e.disableClose&&this._drawerHasBackdrop(e)).forEach(e=>e._closeViaBackdropClick())}_isShowingBackdrop(){return this._isDrawerOpen(this._start)&&this._drawerHasBackdrop(this._start)||this._isDrawerOpen(this._end)&&this._drawerHasBackdrop(this._end)}_isDrawerOpen(e){return e!=null&&e.opened}_drawerHasBackdrop(e){return this._backdropOverride==null?!!e&&e.mode!=="side":this._backdropOverride}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-drawer-container"]],contentQueries:function(i,r,o){if(i&1&&dt(o,Ko,5)(o,Oc,5),i&2){let a;U(a=z())&&(r._content=a.first),U(a=z())&&(r._allDrawers=a)}},viewQuery:function(i,r){if(i&1&&Te(Ko,5),i&2){let o;U(o=z())&&(r._userContent=o.first)}},hostAttrs:[1,"mat-drawer-container"],hostVars:2,hostBindings:function(i,r){i&2&&N("mat-drawer-container-explicit-backdrop",r._backdropOverride)},inputs:{autosize:"autosize",hasBackdrop:"hasBackdrop"},outputs:{backdropClick:"backdropClick"},exportAs:["matDrawerContainer"],features:[Ie([{provide:Uv,useExisting:t}])],ngContentSelectors:PD,decls:4,vars:2,consts:[[1,"mat-drawer-backdrop",3,"mat-drawer-shown"],[1,"mat-drawer-backdrop",3,"click"]],template:function(i,r){i&1&&(ve(OD),D(0,RF,1,2,"div",0),B(1),B(2,1),D(3,OF,2,0,"mat-drawer-content")),i&2&&(E(r.hasBackdrop?0:-1),p(3),E(r._content?-1:3))},dependencies:[Ko],styles:[`.mat-drawer-container {
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
`],encapsulation:2})}return t})(),df=(()=>{class t extends Ko{static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275cmp=x({type:t,selectors:[["mat-sidenav-content"]],hostAttrs:[1,"mat-drawer-content","mat-sidenav-content"],features:[Ie([{provide:ci,useExisting:t},{provide:Ko,useExisting:t}]),ge],ngContentSelectors:uf,decls:1,vars:0,template:function(i,r){i&1&&(ve(),B(0))},encapsulation:2})}return t})(),zv=(()=>{class t extends Oc{get fixedInViewport(){return this._fixedInViewport}set fixedInViewport(e){this._fixedInViewport=lt(e)}_fixedInViewport=!1;get fixedTopGap(){return this._fixedTopGap}set fixedTopGap(e){this._fixedTopGap=Bt(e)}_fixedTopGap=0;get fixedBottomGap(){return this._fixedBottomGap}set fixedBottomGap(e){this._fixedBottomGap=Bt(e)}_fixedBottomGap=0;static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275cmp=x({type:t,selectors:[["mat-sidenav"]],hostAttrs:[1,"mat-drawer","mat-sidenav"],hostVars:16,hostBindings:function(i,r){i&2&&(j("tabIndex",r.mode!=="side"?"-1":null)("align",null),jt("top",r.fixedInViewport?r.fixedTopGap:null,"px")("bottom",r.fixedInViewport?r.fixedBottomGap:null,"px"),N("mat-drawer-end",r.position==="end")("mat-drawer-over",r.mode==="over")("mat-drawer-push",r.mode==="push")("mat-drawer-side",r.mode==="side")("mat-sidenav-fixed",r.fixedInViewport))},inputs:{fixedInViewport:"fixedInViewport",fixedTopGap:"fixedTopGap",fixedBottomGap:"fixedBottomGap"},exportAs:["matSidenav"],features:[Ie([{provide:Oc,useExisting:t}]),ge],ngContentSelectors:uf,decls:3,vars:0,consts:[["content",""],["cdkScrollable","",1,"mat-drawer-inner-container"]],template:function(i,r){i&1&&(ve(),m(0,"div",1,0),B(2),f())},dependencies:[ci],encapsulation:2})}return t})(),FD=(()=>{class t extends Pc{_allDrawers=void 0;_content=void 0;static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275cmp=x({type:t,selectors:[["mat-sidenav-container"]],contentQueries:function(i,r,o){if(i&1&&dt(o,df,5)(o,zv,5),i&2){let a;U(a=z())&&(r._content=a.first),U(a=z())&&(r._allDrawers=a)}},hostAttrs:[1,"mat-drawer-container","mat-sidenav-container"],hostVars:2,hostBindings:function(i,r){i&2&&N("mat-drawer-container-explicit-backdrop",r._backdropOverride)},exportAs:["matSidenavContainer"],features:[Ie([{provide:Uv,useExisting:t},{provide:Pc,useExisting:t}]),ge],ngContentSelectors:PD,decls:4,vars:2,consts:[[1,"mat-drawer-backdrop",3,"mat-drawer-shown"],[1,"mat-drawer-backdrop",3,"click"]],template:function(i,r){i&1&&(ve(OD),D(0,PF,1,2,"div",0),B(1),B(2,1),D(3,FF,2,0,"mat-sidenav-content")),i&2&&(E(r.hasBackdrop?0:-1),p(3),E(r._content?-1:3))},dependencies:[df],styles:[LF],encapsulation:2})}return t})(),mf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[Vn,_e,Vn]})}return t})();var VF=["*",[["mat-toolbar-row"]]],BF=["*","mat-toolbar-row"],HF=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-toolbar-row"]],hostAttrs:[1,"mat-toolbar-row"],exportAs:["matToolbarRow"]})}return t})(),jD=(()=>{class t{_elementRef=c(L);_platform=c(Ce);_document=c(X);color;_toolbarRows;ngAfterViewInit(){this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe(()=>this._checkToolbarMixedModes()))}_checkToolbarMixedModes(){this._toolbarRows.length}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-toolbar"]],contentQueries:function(i,r,o){if(i&1&&dt(o,HF,5),i&2){let a;U(a=z())&&(r._toolbarRows=a)}},hostAttrs:[1,"mat-toolbar"],hostVars:6,hostBindings:function(i,r){i&2&&(et(r.color?"mat-"+r.color:""),N("mat-toolbar-multiple-rows",r._toolbarRows.length>0)("mat-toolbar-single-row",r._toolbarRows.length===0))},inputs:{color:"color"},exportAs:["matToolbar"],ngContentSelectors:BF,decls:2,vars:0,template:function(i,r){i&1&&(ve(VF),B(0),B(1,1))},styles:[`.mat-toolbar {
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
`],encapsulation:2})}return t})();var VD=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[_e]})}return t})();var $v=class extends Error{constructor(e,i){super(i);this.status=e;this.name="ApiError"}},ws=class t{constructor(){this.http=c(Xa)}request(i){return P(this,arguments,function*(n,e={}){try{return yield $h(this.http.request(e.method??"GET",n,{body:e.body}))}catch(r){if(r instanceof er){let o=`Request failed: ${r.status} ${r.statusText}`;throw r.error&&typeof r.error.error=="string"&&(o=r.error.error),new $v(r.status,o)}throw r}})}fetchProjects(){return this.request("/api/projects")}createProject(n,e){return this.request("/api/projects",{method:"POST",body:{name:n,path:e}})}editProject(n,e,i){return this.request(`/api/projects/${encodeURIComponent(n)}`,{method:"PATCH",body:{name:e,path:i}})}deleteProject(n){return P(this,null,function*(){yield this.request(`/api/projects/${encodeURIComponent(n)}`,{method:"DELETE"})})}cloneProject(n){return this.request("/api/projects/clone",{method:"POST",body:n})}fetchDirectories(n){let e=n?`/api/filesystem/directories?path=${encodeURIComponent(n)}`:"/api/filesystem/directories";return this.request(e)}fetchChats(n){return this.request(`/api/projects/${encodeURIComponent(n)}/chats`)}createChat(n,e,i){return this.request(`/api/projects/${encodeURIComponent(n)}/chats`,{method:"POST",body:{agent:e,title:i||void 0}})}fetchChat(n){return this.request(`/api/chats/${encodeURIComponent(n)}`)}editChat(n,e){return this.request(`/api/chats/${encodeURIComponent(n)}`,{method:"PATCH",body:e})}deleteChat(n){return P(this,null,function*(){yield this.request(`/api/chats/${encodeURIComponent(n)}`,{method:"DELETE"})})}promptChat(n,e){return P(this,null,function*(){yield this.request(`/api/chats/${encodeURIComponent(n)}/prompt`,{method:"POST",body:{text:e}})})}resumeChat(n){return this.request(`/api/chats/${encodeURIComponent(n)}/resume`,{method:"POST"})}stopChat(n){return P(this,null,function*(){yield this.request(`/api/chats/${encodeURIComponent(n)}/stop`,{method:"POST"})})}cancelChat(n){return P(this,null,function*(){yield this.request(`/api/chats/${encodeURIComponent(n)}/cancel`,{method:"POST"})})}respondPermission(n,e,i){return P(this,null,function*(){yield this.request(`/api/chats/${encodeURIComponent(n)}/permission`,{method:"POST",body:{id:e,granted:i}})})}fetchChatConfig(n){return this.request(`/api/chats/${encodeURIComponent(n)}/config`)}setChatConfig(n,e,i){return this.request(`/api/chats/${encodeURIComponent(n)}/config`,{method:"PATCH",body:{id:e,value:i}})}fetchAgents(){return this.request("/api/agents")}fetchStatus(){return this.request("/api/status")}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"root"})}};var ff=class t{constructor(){this.status=T("connecting");this.events=new I;this.socket=null;this.reconnectTimer=null;this.destroyed=!1;this.lastSequence=0}connect(){if(this.destroyed||typeof window>"u"||this.socket)return;this.status.set("connecting");let n=window.location.protocol==="https:"?"wss:":"ws:";try{this.socket=new WebSocket(`${n}//${window.location.host}/ws`)}catch(e){this.socket=null,this.scheduleReconnect();return}this.socket.addEventListener("open",()=>{this.status.set("connected"),this.send({type:"subscribe",from_seq:this.lastSequence>0?this.lastSequence+1:0})}),this.socket.addEventListener("message",e=>{try{let i=JSON.parse(String(e.data));if(typeof i.seq!="number"||i.seq<=this.lastSequence)return;this.lastSequence=i.seq,this.events.next(i)}catch(i){}}),this.socket.addEventListener("close",()=>{this.socket=null,this.status.set("disconnected"),this.scheduleReconnect()}),this.socket.addEventListener("error",()=>{this.socket?.close()})}send(n){this.socket?.readyState===WebSocket.OPEN&&this.socket.send(JSON.stringify(n))}destroy(){this.destroyed=!0,this.reconnectTimer&&clearTimeout(this.reconnectTimer),this.reconnectTimer=null,this.socket?.close(),this.socket=null,this.events.complete()}ngOnDestroy(){this.destroy()}scheduleReconnect(){this.destroyed||this.reconnectTimer||(this.reconnectTimer=setTimeout(()=>{this.reconnectTimer=null,this.connect()},2e3))}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"root"})}};var Fc=class{constructor(n=[]){this.nextId=1;this.seenSeqs=new Set;this.items=[];this.currentTurn=null;for(let e of n)this.ingest(e)}ingest(n){if(typeof n.seq=="number"){if(this.seenSeqs.has(n.seq))return null;this.seenSeqs.add(n.seq)}let e=n.payload;if(!e)return null;if(this.isTurnScoped(e.type)){let i=this.ensureCurrentTurn(n);return this.mergeTurnEvent(i,n),e.type==="turn_complete"&&(i.status="complete",i.completedAt=n.timestamp,i.stopReason=this.stringValue(e.stop_reason??e.stopReason)??null,this.currentTurn=null),i}if(e.type==="user_message"){this.currentTurn&&(this.currentTurn.status="complete",this.currentTurn=null);let i={id:this.nextId++,type:"user_message",text:this.stringValue(e.text)??"",timestamp:n.timestamp};return this.items.push(i),i}if(e.type==="error"){let i={id:this.nextId++,type:"error",message:this.stringValue(e.message)??"Unknown error",timestamp:n.timestamp};return this.items.push(i),i}if(e.type==="state_change"){if(!this.shouldDisplayStateChange(e))return null;let i={id:this.nextId++,type:"state_change",process:this.stringValue(e.process)??"",turn:this.stringValue(e.turn)??"",timestamp:n.timestamp};return this.items.push(i),i}return null}isTurnScoped(n){return["message_chunk","thought_chunk","tool_call","tool_call_update","plan","permission_request","permission_response","turn_complete"].includes(n)}shouldDisplayStateChange(n){return["DEAD","STARTING","STOPPED"].includes(this.stringValue(n.process)??"")||this.stringValue(n.turn)==="CANCELLING"}ensureCurrentTurn(n){if(this.currentTurn)return this.currentTurn;let e={id:this.nextId++,type:"turn",agent:n.agent||"Agent",timestamp:n.timestamp,completedAt:null,status:"in_progress",stopReason:null,entries:[]};return this.items.push(e),this.currentTurn=e,e}mergeTurnEvent(n,e){let i=e.payload,r=n.entries[n.entries.length-1];if(i.type==="message_chunk"||i.type==="thought_chunk"){let o=this.stringValue(i.text)??"";r&&r.type===i.type?r.text+=o:n.entries.push({id:this.nextId++,type:i.type,text:o});return}if(i.type==="tool_call"){let o=this.stringValue(i.id??i.toolCallId??i.tool_call_id)??String(this.nextId);n.entries.push({id:this.nextId++,type:"tool_call",toolCallId:o,title:this.stringValue(i.title)??"Tool Call",status:this.stringValue(i.status)??"in_progress",output:null});return}if(i.type==="tool_call_update"){let o=this.stringValue(i.id??i.toolCallId??i.tool_call_id)??"",a=this.findToolCall(n,o);if(a){let s=this.stringValue(i.status);s&&(a.status=s),i.output!==void 0&&i.output!==null&&(a.output=(a.output||"")+String(i.output))}else n.entries.push({id:this.nextId++,type:"tool_call",toolCallId:o,title:this.stringValue(i.title)??"Tool Call",status:this.stringValue(i.status)??"in_progress",output:i.output==null?null:String(i.output)});return}if(i.type==="plan"){let a=Array.isArray(i.entries)?i.entries:[],s=n.entries[n.entries.length-1];s?.type==="plan"?s.entries=a:n.entries.push({id:this.nextId++,type:"plan",entries:a});return}if(i.type==="permission_request"){n.entries.push({id:this.nextId++,type:"permission_request",requestId:this.stringValue(i.id)??"",method:this.stringValue(i.method)??"",description:this.stringValue(i.description)??"",responded:!1});return}if(i.type==="permission_response"){let o=this.stringValue(i.id),a=s=>{for(let l of s)if(l.type==="permission_request"&&(!o||l.requestId===o))return l.responded=!0,l.decision=i.granted?"Allowed":"Denied",!0;return!1};if(a(n.entries))return;for(let s of this.items)if(s.type==="turn"&&a(s.entries))return}}findToolCall(n,e){return n.entries.slice().reverse().find(i=>i.type==="tool_call"&&i.toolCallId===e)}stringValue(n){return typeof n=="string"?n:n==null?void 0:String(n)}};var Le=class t{constructor(){this.socket=c(ff);this.projects=T([]);this.chatsByProject=T({});this.activeProjectId=T(null);this.activeChatId=T(null);this.configOptionsByChat=T({});this.configLoadedByChat=T({});this.reducersByChat=T({});this.agents=T(["codex","claude","opencode","antigravity"]);this.loadingProjects=T(!1);this.projectsError=T(null);this.loadingChats=T(new Set);this.connectingChats=T(new Set);this.connectErrors=T({});this.isMobileDrawerOpen=T(!1);this.showArchived=T(!1);this.wsStatus=this.socket.status;this.activeProject=ke(()=>{let n=this.activeProjectId();return n?this.projects().find(e=>e.id===n)??null:null});this.activeChat=ke(()=>{let n=this.activeProjectId(),e=this.activeChatId();return!n||!e?null:this.chatsByProject()[n]?.find(i=>i.id===e)??null});this.router=c(an);this.api=c(ws);this.emptyReducer=new Fc;this.inFlightConnections=new Map;this.inFlightConfigs=new Map;this.inFlightChats=new Map;this.activeReducer=ke(()=>{let n=this.activeChatId();return n?this.reducersByChat()[n]??this.emptyReducer:this.emptyReducer});this.socket.events.subscribe(n=>this.handleIncomingEvent(n)),this.router.events.pipe(me(n=>n instanceof Dn)).subscribe(n=>this.syncRoute(n.urlAfterRedirects)),this.syncRoute(this.router.url||(typeof window<"u"?window.location.pathname:"/")),this.socket.connect(),this.initialize()}setMobileDrawerOpen(n){this.isMobileDrawerOpen.set(n)}setShowArchived(n){this.showArchived.set(n)}loadProjects(){return P(this,null,function*(){this.loadingProjects.set(!0);try{this.projects.set(yield this.api.fetchProjects()),this.projectsError.set(null)}catch(n){this.projectsError.set(this.errorMessage(n,"Failed to load projects")),console.error("Failed to load projects",n)}finally{this.loadingProjects.set(!1)}})}loadAgents(){return P(this,null,function*(){try{this.agents.set(yield this.api.fetchAgents())}catch(n){}})}loadChats(n){let e=this.inFlightChats.get(n);if(e)return e;let i=P(this,null,function*(){this.setSetValue(this.loadingChats,n,!0);try{let r=yield this.api.fetchChats(n);this.chatsByProject.update(o=>J(y({},o),{[n]:r}))}catch(r){console.error("Failed to load chats for project",n,r)}finally{this.setSetValue(this.loadingChats,n,!1),this.inFlightChats.delete(n)}});return this.inFlightChats.set(n,i),i}findChat(n){for(let e of Object.values(this.chatsByProject())){let i=e.find(r=>r.id===n);if(i)return i}return null}autoConnectChat(n){return P(this,null,function*(){let e=this.findChat(n);e&&(e.process_state!=="RUNNING"?yield this.connectChat(n).catch(()=>{}):this.configLoadedByChat()[n]||(yield this.loadChatConfig(n).catch(()=>{})))})}loadChatConfig(n){let e=this.inFlightConfigs.get(n);if(e)return e;let i=P(this,null,function*(){this.setSetValue(this.connectingChats,n,!0),this.clearError(n);try{let r=this.normalizeConfigOptions(yield this.api.fetchChatConfig(n));return this.configOptionsByChat.update(o=>J(y({},o),{[n]:r})),this.configLoadedByChat.update(o=>J(y({},o),{[n]:!0})),r}catch(r){throw this.setError(n,this.errorMessage(r,"Failed to load agent configuration")),r}finally{this.setSetValue(this.connectingChats,n,!1),this.inFlightConfigs.delete(n)}});return this.inFlightConfigs.set(n,i),i}retryConnection(n){return this.findChat(n)?.process_state==="RUNNING"?this.loadChatConfig(n).then(()=>{}).catch(()=>{}):this.connectChat(n).then(()=>{}).catch(()=>{})}connectChat(n){let e=this.inFlightConnections.get(n);if(e)return e;let i=P(this,null,function*(){this.setSetValue(this.connectingChats,n,!0),this.clearError(n);try{let r;try{r=yield this.api.resumeChat(n)}catch(o){let a=this.findChat(n);throw(!a||a.process_state!=="RUNNING")&&this.setError(n,this.errorMessage(o,"Failed to connect to agent")),o}this.applyChatPatch(n,r),this.clearError(n);try{yield this.fetchConfig(n)}catch(o){throw this.setError(n,this.errorMessage(o,"Failed to load agent configuration")),o}return r}finally{this.setSetValue(this.connectingChats,n,!1),this.inFlightConnections.delete(n)}});return this.inFlightConnections.set(n,i),i}fetchConfig(n){return P(this,null,function*(){let e=this.normalizeConfigOptions(yield this.api.fetchChatConfig(n));return this.configOptionsByChat.update(i=>J(y({},i),{[n]:e})),this.configLoadedByChat.update(i=>J(y({},i),{[n]:!0})),e})}sendPrompt(n,e){return P(this,null,function*(){yield this.api.promptChat(n,e),this.applyChatPatch(n,{turn_state:"PROMPTING"})})}cancelActiveTurn(n){return P(this,null,function*(){yield this.api.cancelChat(n),this.applyChatPatch(n,{turn_state:"CANCELLING"})})}stopChatProcess(n){return P(this,null,function*(){yield this.api.stopChat(n),this.applyChatPatch(n,{process_state:"STOPPED",turn_state:"IDLE"})})}setChatPolicy(n,e){return P(this,null,function*(){this.applyChatPatch(n,yield this.api.editChat(n,{permission_policy:e}))})}renameChat(n,e){return P(this,null,function*(){this.applyChatPatch(n,yield this.api.editChat(n,{title:e}))})}archiveChat(n,e){return P(this,null,function*(){this.applyChatPatch(n,yield this.api.editChat(n,{archived:e}))})}deleteChat(n){return P(this,null,function*(){let e=this.findChat(n);yield this.api.deleteChat(n),this.chatsByProject.update(i=>{let r=y({},i);for(let[o,a]of Object.entries(r))r[o]=a.filter(s=>s.id!==n);return r}),this.removeChatState(n),this.activeChatId()===n&&this.router.navigate(e?.project_id?["/projects",e.project_id]:["/"])})}setChatConfig(n,e,i){return P(this,null,function*(){let r=this.normalizeConfigOptions(yield this.api.setChatConfig(n,e,i));this.configOptionsByChat.update(o=>J(y({},o),{[n]:r})),this.configLoadedByChat.update(o=>J(y({},o),{[n]:!0}))})}createProject(n,e){return P(this,null,function*(){let i=yield this.api.createProject(n,e);return this.projects.update(r=>[i,...r]),i})}cloneProject(n){return P(this,null,function*(){let e=yield this.api.cloneProject(n);return this.projects.update(i=>[e,...i.filter(r=>r.id!==e.id)]),e})}createChat(n,e,i){return P(this,null,function*(){let r=yield this.api.createChat(n,e,i);return this.chatsByProject.update(o=>J(y({},o),{[n]:[...o[n]??[],r]})),this.projects.update(o=>o.map(a=>a.id===n?J(y({},a),{chat_count:(a.chat_count??0)+1}):a)),r})}editProject(n,e,i){return P(this,null,function*(){let r=yield this.api.editProject(n,e,i);return this.projects.update(o=>o.map(a=>a.id===n?y(y({},a),r):a)),r})}deleteProject(n){return P(this,null,function*(){yield this.api.deleteProject(n),this.projects.update(e=>e.filter(i=>i.id!==n)),this.chatsByProject.update(e=>{let i=y({},e);return delete i[n],i}),this.activeProjectId()===n&&(this.activeProjectId.set(null),this.activeChatId.set(null),this.router.navigate(["/"]))})}respondPermission(n,e,i){return this.api.respondPermission(n,e,i)}initialize(){return P(this,null,function*(){typeof window>"u"||(yield Promise.all([this.loadProjects(),this.loadAgents()]))})}syncRoute(n){let e=n.split("?")[0].replace(/\/+$/,"").split("/").filter(Boolean),i=e[0]==="projects"?e[1]??null:null,r=i&&e[2]==="chats"?e[3]??null:null;if(this.activeProjectId.set(i),this.activeChatId.set(r),!i){this.setMobileDrawerOpen(!1);return}this.loadChats(i).then(()=>{r&&this.autoConnectChat(r)})}handleIncomingEvent(n){let{session_id:e,payload:i}=n;if(i.type==="metadata_changed"){this.loadProjects();for(let a of Object.keys(this.chatsByProject()))this.loadChats(a);return}if(i.type==="config_options"&&e){let a=this.normalizeConfigOptions(i.options);this.configOptionsByChat.update(s=>J(y({},s),{[e]:a})),this.configLoadedByChat.update(s=>J(y({},s),{[e]:!0}));return}if(!e)return;let r=y({},this.reducersByChat()),o=r[e]??new Fc;if(o.ingest(n),r[e]=o,this.reducersByChat.set(r),i.type==="state_change"){let a=this.processState(i.process),s=this.turnState(i.turn);this.applyChatPatch(e,y(y({},a?{process_state:a}:{}),s?{turn_state:s}:{}))}}applyChatPatch(n,e){this.chatsByProject.update(i=>{let r=y({},i);for(let[o,a]of Object.entries(r))r[o]=a.map(s=>s.id===n?y(y({},s),e):s);return r})}removeChatState(n){this.reducersByChat.update(e=>{let i=y({},e);return delete i[n],i}),this.configOptionsByChat.update(e=>{let i=y({},e);return delete i[n],i}),this.configLoadedByChat.update(e=>{let i=y({},e);return delete i[n],i}),this.connectErrors.update(e=>{let i=y({},e);return delete i[n],i})}setError(n,e){this.connectErrors.update(i=>J(y({},i),{[n]:e}))}clearError(n){this.connectErrors.update(e=>{if(!(n in e))return e;let i=y({},e);return delete i[n],i})}setSetValue(n,e,i){n.update(r=>{let o=new Set(r);return i?o.add(e):o.delete(e),o})}normalizeConfigOptions(n){return Array.isArray(n)?n.map(e=>{let i=e??{},o=(Array.isArray(i.options)?i.options:void 0)?.map(a=>{let s=a??{};return Array.isArray(s.options)?{group:String(s.group??s.name??""),options:s.options.map(l=>{let d=l??{};return{value:d.value,name:String(d.name??d.label??d.value??"")}})}:{value:s.value,name:String(s.name??s.label??s.value??"")}});return{id:String(i.id??""),name:String(i.name??i.label??i.id??""),type:String(i.type??""),currentValue:i.currentValue??i.current_value,description:typeof i.description=="string"?i.description:void 0,options:o}}):[]}processState(n){return["STARTING","RUNNING","STOPPED","DEAD"].includes(String(n))?String(n):void 0}turnState(n){return["IDLE","PROMPTING","CANCELLING"].includes(String(n))?String(n):void 0}errorMessage(n,e){return n instanceof Error&&n.message?n.message:e}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"root"})}};var Wv=(()=>{class t{get vertical(){return this._vertical}set vertical(e){this._vertical=lt(e)}_vertical=!1;get inset(){return this._inset}set inset(e){this._inset=lt(e)}_inset=!1;static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-divider"]],hostAttrs:["role","separator",1,"mat-divider"],hostVars:7,hostBindings:function(i,r){i&2&&(j("aria-orientation",r.vertical?"vertical":"horizontal"),N("mat-divider-vertical",r.vertical)("mat-divider-horizontal",!r.vertical)("mat-divider-inset",r.inset))},inputs:{vertical:"vertical",inset:"inset"},decls:0,vars:0,template:function(i,r){},styles:[`.mat-divider {
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
`],encapsulation:2})}return t})(),Ss=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[_e]})}return t})();var Lc=class{_multiple;_emitChanges;compareWith;_selection=new Set;_deselectedToEmit=[];_selectedToEmit=[];_selected=null;get selected(){return this._selected||(this._selected=Array.from(this._selection.values())),this._selected}changed=new I;bulk={select:n=>this._select(n),deselect:n=>this._deselect(n),setSelection:n=>this._setSelection(n)};constructor(n=!1,e,i=!0,r){this._multiple=n,this._emitChanges=i,this.compareWith=r,e&&e.length&&(n?e.forEach(o=>this._markSelected(o)):this._markSelected(e[0]),this._selectedToEmit.length=0)}select(...n){return this._select(n)}deselect(...n){return this._deselect(n)}setSelection(...n){return this._setSelection(n)}toggle(n){return this.isSelected(n)?this.deselect(n):this.select(n)}clear(n=!0){this._unmarkAll();let e=this._hasQueuedChanges();return n&&this._emitChangeEvent(),e}isSelected(n){return this._selection.has(this._getConcreteValue(n))}isEmpty(){return this._selection.size===0}hasValue(){return!this.isEmpty()}sort(n){this._multiple&&this.selected&&this._selected.sort(n)}isMultipleSelection(){return this._multiple}_select(n){this._verifyValueAssignment(n),n.forEach(i=>this._markSelected(i));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_deselect(n){this._verifyValueAssignment(n),n.forEach(i=>this._unmarkSelected(i));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_setSelection(n){this._verifyValueAssignment(n);let e=this.selected,i=new Set(n.map(o=>this._getConcreteValue(o)));n.forEach(o=>this._markSelected(o)),e.filter(o=>!i.has(this._getConcreteValue(o,i))).forEach(o=>this._unmarkSelected(o));let r=this._hasQueuedChanges();return this._emitChangeEvent(),r}_emitChangeEvent(){this._selected=null,(this._selectedToEmit.length||this._deselectedToEmit.length)&&(this.changed.next({source:this,added:this._selectedToEmit,removed:this._deselectedToEmit}),this._deselectedToEmit=[],this._selectedToEmit=[])}_markSelected(n){n=this._getConcreteValue(n),this.isSelected(n)||(this._multiple||this._unmarkAll(),this.isSelected(n)||this._selection.add(n),this._emitChanges&&this._selectedToEmit.push(n))}_unmarkSelected(n){n=this._getConcreteValue(n),this.isSelected(n)&&(this._selection.delete(n),this._emitChanges&&this._deselectedToEmit.push(n))}_unmarkAll(){this.isEmpty()||this._selection.forEach(n=>this._unmarkSelected(n))}_verifyValueAssignment(n){n.length>1&&this._multiple}_hasQueuedChanges(){return!!(this._deselectedToEmit.length||this._selectedToEmit.length)}_getConcreteValue(n,e){if(this.compareWith){e=e??this._selection;for(let i of e)if(this.compareWith(n,i))return i;return n}else return n}};var jc=(()=>{class t{_listeners=[];notify(e,i){for(let r of this._listeners)r(e,i)}listen(e){return this._listeners.push(e),()=>{this._listeners=this._listeners.filter(i=>e!==i)}}ngOnDestroy(){this._listeners=[]}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var GD=(()=>{class t{_renderer;_elementRef;onChange=e=>{};onTouched=()=>{};constructor(e,i){this._renderer=e,this._elementRef=i}setProperty(e,i){this._renderer.setProperty(this._elementRef.nativeElement,e,i)}registerOnTouched(e){this.onTouched=e}registerOnChange(e){this.onChange=e}setDisabledState(e){this.setProperty("disabled",e)}static \u0275fac=function(i){return new(i||t)(ne(xe),ne(L))};static \u0275dir=R({type:t})}return t})(),zF=(()=>{class t extends GD{static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275dir=R({type:t,features:[ge]})}return t})(),$c=new C("");var $F={provide:$c,useExisting:en(()=>Ti),multi:!0};function WF(){let t=Fn()?Fn().getUserAgent():"";return/android (\d+)/.test(t.toLowerCase())}var GF=new C(""),Ti=(()=>{class t extends GD{_compositionMode;_composing=!1;constructor(e,i,r){super(e,i),this._compositionMode=r,this._compositionMode==null&&(this._compositionMode=!WF())}writeValue(e){let i=e??"";this.setProperty("value",i)}_handleInput(e){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(e)}_compositionStart(){this._composing=!0}_compositionEnd(e){this._composing=!1,this._compositionMode&&this.onChange(e)}static \u0275fac=function(i){return new(i||t)(ne(xe),ne(L),ne(GF,8))};static \u0275dir=R({type:t,selectors:[["input","formControlName","",3,"type","checkbox",3,"ngNoCva",""],["textarea","formControlName","",3,"ngNoCva",""],["input","formControl","",3,"type","checkbox",3,"ngNoCva",""],["textarea","formControl","",3,"ngNoCva",""],["input","ngModel","",3,"type","checkbox",3,"ngNoCva",""],["textarea","ngModel","",3,"ngNoCva",""],["","ngDefaultControl",""]],hostBindings:function(i,r){i&1&&w("input",function(a){return r._handleInput(a.target.value)})("blur",function(){return r.onTouched()})("compositionstart",function(){return r._compositionStart()})("compositionend",function(a){return r._compositionEnd(a.target.value)})},standalone:!1,features:[Ie([$F]),ge]})}return t})();function Zv(t){return t==null||Qv(t)===0}function Qv(t){return t==null?null:Array.isArray(t)||typeof t=="string"?t.length:t instanceof Set?t.size:null}var ea=new C(""),Ef=new C(""),qF=/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,Jo=class{static min(n){return YF(n)}static max(n){return ZF(n)}static required(n){return qD(n)}static requiredTrue(n){return QF(n)}static email(n){return XF(n)}static minLength(n){return KF(n)}static maxLength(n){return JF(n)}static pattern(n){return eL(n)}static nullValidator(n){return pf()}static compose(n){return JD(n)}static composeAsync(n){return eE(n)}};function YF(t){return n=>{if(n.value==null||t==null)return null;let e=parseFloat(n.value);return!isNaN(e)&&e<t?{min:{min:t,actual:n.value}}:null}}function ZF(t){return n=>{if(n.value==null||t==null)return null;let e=parseFloat(n.value);return!isNaN(e)&&e>t?{max:{max:t,actual:n.value}}:null}}function qD(t){return Zv(t.value)?{required:!0}:null}function QF(t){return t.value===!0?null:{required:!0}}function XF(t){return Zv(t.value)||qF.test(t.value)?null:{email:!0}}function KF(t){return n=>{let e=n.value?.length??Qv(n.value);return e===null||e===0?null:e<t?{minlength:{requiredLength:t,actualLength:e}}:null}}function JF(t){return n=>{let e=n.value?.length??Qv(n.value);return e!==null&&e>t?{maxlength:{requiredLength:t,actualLength:e}}:null}}function eL(t){if(!t)return pf;let n,e;return typeof t=="string"?(e="",t.charAt(0)!=="^"&&(e+="^"),e+=t,t.charAt(t.length-1)!=="$"&&(e+="$"),n=new RegExp(e)):(e=t.toString(),n=t),i=>{if(Zv(i.value))return null;let r=i.value;return n.test(r)?null:{pattern:{requiredPattern:e,actualValue:r}}}}function pf(t){return null}function YD(t){return t!=null}function ZD(t){return Ji(t)?st(t):t}function QD(t){let n={};return t.forEach(e=>{n=e!=null?y(y({},n),e):n}),Object.keys(n).length===0?null:n}function XD(t,n){return n.map(e=>e(t))}function tL(t){return!t.validate}function KD(t){return t.map(n=>tL(n)?n:e=>n.validate(e))}function JD(t){if(!t)return null;let n=t.filter(YD);return n.length==0?null:function(e){return QD(XD(e,n))}}function Xv(t){return t!=null?JD(KD(t)):null}function eE(t){if(!t)return null;let n=t.filter(YD);return n.length==0?null:function(e){let i=XD(e,n).map(ZD);return rl(i).pipe(ee(QD))}}function Kv(t){return t!=null?eE(KD(t)):null}function BD(t,n){return t===null?[n]:Array.isArray(t)?[...t,n]:[t,n]}function tE(t){return t._rawValidators}function nE(t){return t._rawAsyncValidators}function Gv(t){return t?Array.isArray(t)?t:[t]:[]}function gf(t,n){return Array.isArray(t)?t.includes(n):t===n}function HD(t,n){let e=Gv(n);return Gv(t).forEach(r=>{gf(e,r)||e.push(r)}),e}function UD(t,n){return Gv(n).filter(e=>!gf(t,e))}var _f=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(n){this._rawValidators=n||[],this._composedValidatorFn=Xv(this._rawValidators)}_setAsyncValidators(n){this._rawAsyncValidators=n||[],this._composedAsyncValidatorFn=Kv(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(n){this._onDestroyCallbacks.push(n)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(n=>n()),this._onDestroyCallbacks=[]}reset(n=void 0){this.control?.reset(n)}hasError(n,e){return this.control?this.control.hasError(n,e):!1}getError(n,e){return this.control?this.control.getError(n,e):null}},zr=class extends _f{name;get formDirective(){return null}get path(){return null}};var Vc="VALID",hf="INVALID",xs="PENDING",Bc="DISABLED",$r=class{},vf=class extends $r{value;source;constructor(n,e){super(),this.value=n,this.source=e}},Uc=class extends $r{pristine;source;constructor(n,e){super(),this.pristine=n,this.source=e}},zc=class extends $r{touched;source;constructor(n,e){super(),this.touched=n,this.source=e}},Ds=class extends $r{status;source;constructor(n,e){super(),this.status=n,this.source=e}},bf=class extends $r{source;constructor(n){super(),this.source=n}},Es=class extends $r{source;constructor(n){super(),this.source=n}};function iE(t){return(Mf(t)?t.validators:t)||null}function nL(t){return Array.isArray(t)?Xv(t):t||null}function rE(t,n){return(Mf(n)?n.asyncValidators:t)||null}function iL(t){return Array.isArray(t)?Kv(t):t||null}function Mf(t){return t!=null&&!Array.isArray(t)&&typeof t=="object"}function rL(t,n,e){let i=t.controls;if(!(n?Object.keys(i):i).length)throw new H(1e3,"");if(!oE(i,e))throw new H(1001,"")}function oL(t,n,e){t._forEachChild((i,r)=>{if(e[r]===void 0)throw new H(-1002,"")})}var yf=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_hasRequired=T(!1);_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(n,e){this._assignValidators(n),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(n){this._rawValidators=this._composedValidatorFn=n,this._updateHasRequiredValidator()}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(n){this._rawAsyncValidators=this._composedAsyncValidatorFn=n}get parent(){return this._parent}get status(){return Ee(this.statusReactive)}set status(n){Ee(()=>this.statusReactive.set(n))}_status=ke(()=>this.statusReactive());statusReactive=T(void 0);get valid(){return this.status===Vc}get invalid(){return this.status===hf}get pending(){return this.status===xs}get disabled(){return this.status===Bc}get enabled(){return this.status!==Bc}errors;get pristine(){return Ee(this.pristineReactive)}set pristine(n){Ee(()=>this.pristineReactive.set(n))}_pristine=ke(()=>this.pristineReactive());pristineReactive=T(!0);get dirty(){return!this.pristine}get touched(){return Ee(this.touchedReactive)}set touched(n){Ee(()=>this.touchedReactive.set(n))}_touched=ke(()=>this.touchedReactive());touchedReactive=T(!1);get untouched(){return!this.touched}_events=new I;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(n){this._assignValidators(n)}setAsyncValidators(n){this._assignAsyncValidators(n)}addValidators(n){this.setValidators(HD(n,this._rawValidators))}addAsyncValidators(n){this.setAsyncValidators(HD(n,this._rawAsyncValidators))}removeValidators(n){this.setValidators(UD(n,this._rawValidators))}removeAsyncValidators(n){this.setAsyncValidators(UD(n,this._rawAsyncValidators))}hasValidator(n){return gf(this._rawValidators,n)}hasAsyncValidator(n){return gf(this._rawAsyncValidators,n)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(n={}){let e=this.touched===!1;this.touched=!0;let i=n.sourceControl??this;n.onlySelf||this._parent?.markAsTouched(J(y({},n),{sourceControl:i})),e&&n.emitEvent!==!1&&this._events.next(new zc(!0,i))}markAllAsDirty(n={}){this.markAsDirty({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsDirty(n))}markAllAsTouched(n={}){this.markAsTouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(n))}markAsUntouched(n={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=n.sourceControl??this;this._forEachChild(r=>{r.markAsUntouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:i})}),n.onlySelf||this._parent?._updateTouched(n,i),e&&n.emitEvent!==!1&&this._events.next(new zc(!1,i))}markAsDirty(n={}){let e=this.pristine===!0;this.pristine=!1;let i=n.sourceControl??this;n.onlySelf||this._parent?.markAsDirty(J(y({},n),{sourceControl:i})),e&&n.emitEvent!==!1&&this._events.next(new Uc(!1,i))}markAsPristine(n={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=n.sourceControl??this;this._forEachChild(r=>{r.markAsPristine({onlySelf:!0,emitEvent:n.emitEvent})}),n.onlySelf||this._parent?._updatePristine(n,i),e&&n.emitEvent!==!1&&this._events.next(new Uc(!0,i))}markAsPending(n={}){this.status=xs;let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new Ds(this.status,e)),this.statusChanges.emit(this.status)),n.onlySelf||this._parent?.markAsPending(J(y({},n),{sourceControl:e}))}disable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=Bc,this.errors=null,this._forEachChild(r=>{r.disable(J(y({},n),{onlySelf:!0}))}),this._updateValue();let i=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new vf(this.value,i)),this._events.next(new Ds(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(J(y({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(r=>r(!0))}enable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=Vc,this._forEachChild(i=>{i.enable(J(y({},n),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent}),this._updateAncestors(J(y({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(n,e){n.onlySelf||(this._parent?.updateValueAndValidity(n),n.skipPristineCheck||this._parent?._updatePristine({},e),this._parent?._updateTouched({},e))}setParent(n){this._parent=n}getRawValue(){return this.value}updateValueAndValidity(n={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===Vc||this.status===xs)&&this._runAsyncValidator(i,n.emitEvent)}let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new vf(this.value,e)),this._events.next(new Ds(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),n.onlySelf||this._parent?.updateValueAndValidity(J(y({},n),{sourceControl:e}))}_updateTreeValidity(n={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(n)),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?Bc:Vc}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(n,e){if(this.asyncValidator){this.status=xs,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1,shouldHaveEmitted:n!==!1};let i=ZD(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(r=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(r,{emitEvent:e,shouldHaveEmitted:n})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let n=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,n}return!1}setErrors(n,e={}){this.errors=n,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(n){let e=n;return e==null||(Array.isArray(e)||(e=e.split(".")),e.length===0)?null:e.reduce((i,r)=>i&&i._find(r),this)}getError(n,e){let i=e?this.get(e):this;return i?.errors?i.errors[n]:null}hasError(n,e){return!!this.getError(n,e)}get root(){let n=this;for(;n._parent;)n=n._parent;return n}_updateControlsErrors(n,e,i){this.status=this._calculateStatus(),n&&this.statusChanges.emit(this.status),(n||i)&&this._events.next(new Ds(this.status,e)),this._parent&&this._parent._updateControlsErrors(n,e,i)}_initObservables(){this.valueChanges=new O,this.statusChanges=new O}_calculateStatus(){return this._allControlsDisabled()?Bc:this.errors?hf:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(xs)?xs:this._anyControlsHaveStatus(hf)?hf:Vc}_anyControlsHaveStatus(n){return this._anyControls(e=>e.status===n)}_anyControlsDirty(){return this._anyControls(n=>n.dirty)}_anyControlsTouched(){return this._anyControls(n=>n.touched)}_updatePristine(n,e){let i=!this._anyControlsDirty(),r=this.pristine!==i;this.pristine=i,n.onlySelf||this._parent?._updatePristine(n,e),r&&this._events.next(new Uc(this.pristine,e))}_updateTouched(n={},e){this.touched=this._anyControlsTouched(),this._events.next(new zc(this.touched,e)),n.onlySelf||this._parent?._updateTouched(n,e)}_onDisabledChange=[];_registerOnCollectionChange(n){this._onCollectionChange=n}_setUpdateStrategy(n){Mf(n)&&n.updateOn!=null&&(this._updateOn=n.updateOn)}_parentMarkedDirty(n){return!n&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(n){return null}_assignValidators(n){this._rawValidators=Array.isArray(n)?n.slice():n,this._composedValidatorFn=nL(this._rawValidators),this._updateHasRequiredValidator()}_assignAsyncValidators(n){this._rawAsyncValidators=Array.isArray(n)?n.slice():n,this._composedAsyncValidatorFn=iL(this._rawAsyncValidators)}_updateHasRequiredValidator(){Ee(()=>this._hasRequired.set(this.hasValidator(Jo.required)))}};function oE(t,n){return Object.hasOwn(t,n)}function aL(t){return t.tagName==="INPUT"||t.tagName==="SELECT"||t.tagName==="TEXTAREA"}function sL(t,n,e,i){switch(e){case"name":t.setAttribute(n,e,i);break;case"disabled":case"readonly":case"required":i?t.setAttribute(n,e,""):t.removeAttribute(n,e);break;case"max":case"min":case"minLength":case"maxLength":i!==void 0?t.setAttribute(n,e,i.toString()):t.removeAttribute(n,e);break}}var qv=class{kind;context;control;message;constructor({kind:n,context:e,control:i}){this.kind=n,this.context=e,this.control=i}};var lL=(()=>{class t{_validator=pf;_onChange;_enabled;ngOnChanges(e){if(this.inputName in e){let i=this.normalizeInput(e[this.inputName].currentValue);this._enabled=this.enabled(i),this._validator=this._enabled?this.createValidator(i):pf,this._onChange?.()}}validate(e){return this._validator(e)}registerOnValidatorChange(e){this._onChange=e}enabled(e){return e!=null}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,features:[Ne]})}return t})();var cL={provide:ea,useExisting:en(()=>aE),multi:!0};var aE=(()=>{class t extends lL{required;inputName="required";normalizeInput=Y;createValidator=e=>qD;enabled(e){return e}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","required","","formControlName","",3,"type","checkbox"],["","required","","formControl","",3,"type","checkbox"],["","required","","ngModel","",3,"type","checkbox"]],hostVars:1,hostBindings:function(i,r){i&2&&j("required",r._enabled?"":null)},inputs:{required:"required"},standalone:!1,features:[Ie([cL]),ge]})}return t})();var dL=new C(""),Ms=new C("",{factory:()=>If}),If="always";function uL(t,n){return[...n.path,t]}function Yv(t,n,e=If){Jv(t,n),n.valueAccessor.writeValue(t.value),(t.disabled||e==="always")&&n.valueAccessor.setDisabledState?.(t.disabled),fL(t,n),pL(t,n),hL(t,n),mL(t,n)}function Cf(t,n,e=!0){let i=()=>{};n?.valueAccessor?.registerOnChange(i),n?.valueAccessor?.registerOnTouched(i),Sf(t,n),t&&(n._invokeOnDestroyCallbacks(),t._registerOnCollectionChange(()=>{}))}function wf(t,n){t.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(n)})}function mL(t,n){if(n.valueAccessor.setDisabledState){let e=i=>{n.valueAccessor.setDisabledState(i)};t.registerOnDisabledChange(e),n._registerOnDestroy(()=>{t._unregisterOnDisabledChange(e)})}}function Jv(t,n){let e=tE(t);n.validator!==null?t.setValidators(BD(e,n.validator)):typeof e=="function"&&t.setValidators([e]);let i=nE(t);n.asyncValidator!==null?t.setAsyncValidators(BD(i,n.asyncValidator)):typeof i=="function"&&t.setAsyncValidators([i]);let r=()=>t.updateValueAndValidity();wf(n._rawValidators,r),wf(n._rawAsyncValidators,r)}function Sf(t,n){let e=!1;if(t!==null){if(n.validator!==null){let r=tE(t);if(Array.isArray(r)&&r.length>0){let o=r.filter(a=>a!==n.validator);o.length!==r.length&&(e=!0,t.setValidators(o))}}if(n.asyncValidator!==null){let r=nE(t);if(Array.isArray(r)&&r.length>0){let o=r.filter(a=>a!==n.asyncValidator);o.length!==r.length&&(e=!0,t.setAsyncValidators(o))}}}let i=()=>{};return wf(n._rawValidators,i),wf(n._rawAsyncValidators,i),e}function fL(t,n){n.valueAccessor.registerOnChange(e=>{t._pendingValue=e,t._pendingChange=!0,t._pendingDirty=!0,t.updateOn==="change"&&sE(t,n)})}function hL(t,n){n.valueAccessor.registerOnTouched(()=>{t._pendingTouched=!0,t.updateOn==="blur"&&t._pendingChange&&sE(t,n),t.updateOn!=="submit"&&t.markAsTouched()})}function sE(t,n){t._pendingDirty&&t.markAsDirty(),t.setValue(t._pendingValue,{emitModelToViewChange:!1}),n.viewToModelUpdate(t._pendingValue),t._pendingChange=!1}function pL(t,n){let e=(i,r)=>{n.valueAccessor.writeValue(i),r&&n.viewToModelUpdate(i)};t.registerOnChange(e),n._registerOnDestroy(()=>{t._unregisterOnChange(e)})}function lE(t,n){t==null,Jv(t,n)}function gL(t,n){return Sf(t,n)}function cE(t,n){if(!Object.hasOwn(t,"model"))return!1;let e=t.model;return e.isFirstChange()?!0:!Object.is(n,e.currentValue)}function _L(t){return Object.getPrototypeOf(t.constructor)===zF}function dE(t,n){t._syncPendingControls(),n.forEach(e=>{let i=e.control;i.updateOn==="submit"&&i._pendingChange&&(e.viewToModelUpdate(i._pendingValue),i._pendingChange=!1)})}function vL(t,n){if(!n)return null;Array.isArray(n);let e,i,r;return n.forEach(o=>{o.constructor===Ti?e=o:_L(o)?i=o:r=o}),r||i||e||null}function bL(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}var uE={provide:dL,useFactory:()=>{let t=c(Bn,{self:!0});return{setParseErrors:n=>{t.setParseErrorSource(n)},set onReset(n){t.onReset=n}}}},Bn=class extends _f{_parent=null;name=null;valueAccessor=null;isCustomControlBased=!1;userOnReset;resetSubscription;set onReset(n){this.userOnReset=n,this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.control&&(this.resetSubscription=this.control.events.subscribe(e=>{e instanceof Es&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription?.add(this.resetSubscription))}isNativeFormElement=!1;rawValueAccessors;_selectedValueAccessor=null;get selectedValueAccessor(){return this._selectedValueAccessor??=vL(this,this.rawValueAccessors)}parseErrorsValidator=null;renderer;injector;requiredValidatorViaDi;subscription;customControlBindings=null;constructor(n,e,i){super(),this.injector=n,this.renderer=e,this.rawValueAccessors=i,this.injector?.get(Je)?.onDestroy(()=>{this.removeParseErrorsValidator(this.control),this.subscription?.unsubscribe()})}setupCustomControl(){this.subscription?.unsubscribe();let n=this.injector?.get(Me);if(!this.control||!n)return;let e=n.markForCheck.bind(n);this.subscription=new ue,this.subscription.add(this.control.valueChanges.subscribe(e)),this.subscription.add(this.control.statusChanges.subscribe(e)),this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.userOnReset&&(this.resetSubscription=this.control.events.subscribe(i=>{i instanceof Es&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription.add(this.resetSubscription)),this.parseErrorsValidator&&this.control.addValidators(this.parseErrorsValidator)}ngControlCreate(n){!n.nativeElement.hasAttribute?.("ngNoCva")&&(this.rawValueAccessors&&this.rawValueAccessors.length>0||this.valueAccessor!==null)||!n.customControl||(this.isCustomControlBased=!0,n.listenToCustomControlModel(r=>{this.control?.setValue(r,{emitModelToViewChange:!1}),this.control?.markAsDirty(),this.viewToModelUpdate(r)}),n.listenToCustomControlOutput("touch",()=>{this.control?.markAsTouched()}),this.customControlBindings={},this.isNativeFormElement=aL(n.nativeElement),this.requiredValidatorViaDi=this._rawValidators.find(r=>r instanceof aE))}ngControlUpdate(n,e){if(!this.isCustomControlBased)return;let i=this.control,r=this.customControlBindings;Object.is(r.value,i.value)||(r.value=i.value,n.setCustomControlModelInput(i.value)),this.bindControlProperty(n,r,"touched",i.touched),this.bindControlProperty(n,r,"dirty",i.dirty),this.bindControlProperty(n,r,"valid",i.valid),this.bindControlProperty(n,r,"invalid",i.invalid),this.bindControlProperty(n,r,"pending",i.pending),this.bindControlProperty(n,r,"disabled",i.disabled),this.shouldBindRequired&&this.bindControlProperty(n,r,"required",this.isRequired);let o=i.errors;if(r.errors!==o){r.errors=o;let a=this._convertErrors(o);n.setInputOnDirectives("errors",a)}}get isRequired(){return(this.requiredValidatorViaDi?._enabled||this.control?._hasRequired())??!1}get shouldBindRequired(){return!0}bindControlProperty(n,e,i,r){if(e[i]===r)return;e[i]=r;let o=n.setInputOnDirectives(i,r);this.isNativeFormElement&&!o&&(i==="disabled"||i==="required")&&this.renderer&&sL(this.renderer,n.nativeElement,i,r)}_convertErrors(n){if(n===null)return[];let e=this.control;return Object.entries(n).map(([i,r])=>new qv({context:r,kind:i,control:e}))}setParseErrorSource(n){if(n===void 0)return;let e=null,i=ke(()=>{let r=n();return r.length===0?null:r.reduce((o,a)=>(o[a.kind]=a,o),{})});this.parseErrorsValidator=(()=>e).bind(this),Lt(()=>{e=i(),this.control?.updateValueAndValidity({emitEvent:!1})},{injector:this.injector})}removeParseErrorsValidator(n){this.parseErrorsValidator&&(n?.removeValidators(this.parseErrorsValidator),n?.updateValueAndValidity({emitEvent:!1}))}},xf=class{_cd;constructor(n){this._cd=n}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}};var Wr=(()=>{class t extends xf{constructor(e){super(e)}static \u0275fac=function(i){return new(i||t)(ne(Bn,2))};static \u0275dir=R({type:t,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(i,r){i&2&&N("ng-untouched",r.isUntouched)("ng-touched",r.isTouched)("ng-pristine",r.isPristine)("ng-dirty",r.isDirty)("ng-valid",r.isValid)("ng-invalid",r.isInvalid)("ng-pending",r.isPending)},standalone:!1,features:[ge]})}return t})(),mE=(()=>{class t extends xf{constructor(e){super(e)}static \u0275fac=function(i){return new(i||t)(ne(zr,10))};static \u0275dir=R({type:t,selectors:[["","formGroupName",""],["","formArrayName",""],["","ngModelGroup",""],["","formGroup",""],["","formArray",""],["form",3,"ngNoForm",""],["","ngForm",""]],hostVars:16,hostBindings:function(i,r){i&2&&N("ng-untouched",r.isUntouched)("ng-touched",r.isTouched)("ng-pristine",r.isPristine)("ng-dirty",r.isDirty)("ng-valid",r.isValid)("ng-invalid",r.isInvalid)("ng-pending",r.isPending)("ng-submitted",r.isSubmitted)},standalone:!1,features:[ge]})}return t})(),Df=class extends yf{constructor(n,e,i){super(iE(e),rE(i,e)),this.controls=n,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;registerControl(n,e){let i=this._find(n);return i||(this.controls[n]=e,e.setParent(this),e._registerOnCollectionChange(this._onCollectionChange),e)}addControl(n,e,i={}){this.registerControl(n,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}removeControl(n,e={}){let i=this._find(n);i&&i._registerOnCollectionChange(()=>{}),delete this.controls[n],this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}setControl(n,e,i={}){let r=this._find(n);r&&r._registerOnCollectionChange(()=>{}),delete this.controls[n],e&&this.registerControl(n,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}contains(n){return this._find(n)?.enabled===!0}setValue(n,e={}){Ee(()=>{oL(this,!0,n),Object.keys(n).forEach(i=>{rL(this,!0,i),this.controls[i].setValue(n[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)})}patchValue(n,e={}){n!=null&&(Object.keys(n).forEach(i=>{let r=this._find(i);r&&r.patchValue(n[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(n={},e={}){this._forEachChild((i,r)=>{i.reset(n?n[r]:null,J(y({},e),{onlySelf:!0}))}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e),e?.emitEvent!==!1&&this._events.next(new Es(this))}getRawValue(){return this._reduceChildren({},(n,e,i)=>(n[i]=e.getRawValue(),n))}_syncPendingControls(){let n=this._reduceChildren(!1,(e,i)=>i._syncPendingControls()?!0:e);return n&&this.updateValueAndValidity({onlySelf:!0}),n}_forEachChild(n){Object.keys(this.controls).forEach(e=>{let i=this.controls[e];i&&n(i,e)})}_setUpControls(){this._forEachChild(n=>{n.setParent(this),n._registerOnCollectionChange(this._onCollectionChange)})}_updateValue(){this.value=this._reduceValue()}_anyControls(n){for(let[e,i]of Object.entries(this.controls))if(this.contains(e)&&n(i))return!0;return!1}_reduceValue(){let n={};return this._reduceChildren(n,(e,i,r)=>((i.enabled||this.disabled)&&(e[r]=i.value),e))}_reduceChildren(n,e){let i=n;return this._forEachChild((r,o)=>{i=e(i,r,o)}),i}_allControlsDisabled(){for(let n of Object.keys(this.controls))if(this.controls[n].enabled)return!1;return Object.keys(this.controls).length>0||this.disabled}_find(n){return oE(this.controls,n)?this.controls[n]:null}};var yL={provide:zr,useExisting:en(()=>Wc)},Hc=Promise.resolve(),Wc=(()=>{class t extends zr{callSetDisabledState;get submitted(){return Ee(this.submittedReactive)}_submitted=ke(()=>this.submittedReactive());submittedReactive=T(!1);_directives=new Set;form;ngSubmit=new O;options;constructor(e,i,r){super(),this.callSetDisabledState=r,this.form=new Df({},Xv(e),Kv(i))}ngAfterViewInit(){this._setUpdateStrategy()}get formDirective(){return this}get control(){return this.form}get path(){return[]}get controls(){return this.form.controls}addControl(e){Hc.then(()=>{let i=this._findContainer(e.path);e.control=i.registerControl(e.name,e.control),e._setupWithForm(this.callSetDisabledState),e.control.updateValueAndValidity({emitEvent:!1}),this._directives.add(e)})}getControl(e){return this.form.get(e.path)}removeControl(e){Hc.then(()=>{this._findContainer(e.path)?.removeControl(e.name),this._directives.delete(e)})}addFormGroup(e){Hc.then(()=>{let i=this._findContainer(e.path),r=new Df({});lE(r,e),i.registerControl(e.name,r),r.updateValueAndValidity({emitEvent:!1})})}removeFormGroup(e){Hc.then(()=>{this._findContainer(e.path)?.removeControl?.(e.name)})}getFormGroup(e){return this.form.get(e.path)}updateModel(e,i){Hc.then(()=>{this.form.get(e.path).setValue(i)})}setValue(e){this.control.setValue(e)}onSubmit(e){return this.submittedReactive.set(!0),dE(this.form,this._directives),this.ngSubmit.emit(e),this.form._events.next(new bf(this.control)),e?.target?.method==="dialog"}onReset(){this.resetForm()}resetForm(e=void 0){this.form.reset(e),this.submittedReactive.set(!1)}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.form._updateOn=this.options.updateOn)}_findContainer(e){return e.pop(),e.length?this.form.get(e):this.form}static \u0275fac=function(i){return new(i||t)(ne(ea,10),ne(Ef,10),ne(Ms,8))};static \u0275dir=R({type:t,selectors:[["form",3,"ngNoForm","",3,"formGroup","",3,"formArray",""],["ng-form"],["","ngForm",""]],hostBindings:function(i,r){i&1&&w("submit",function(a){return r.onSubmit(a)})("reset",function(){return r.onReset()})},inputs:{options:[0,"ngFormOptions","options"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[Ie([yL]),ge]})}return t})();function zD(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}function $D(t){return typeof t=="object"&&t!==null&&Object.keys(t).length===2&&"value"in t&&"disabled"in t}var Nf=class extends yf{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(n=null,e,i){super(iE(e),rE(i,e)),this._applyFormState(n),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),Mf(e)&&(e.nonNullable||e.initialValueIsDefault)&&($D(n)?this.defaultValue=n.value:this.defaultValue=n)}setValue(n,e={}){Ee(()=>{this.value=this._pendingValue=n,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)})}patchValue(n,e={}){this.setValue(n,e)}reset(n=this.defaultValue,e={}){this._applyFormState(n),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),e.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,e?.emitEvent!==!1&&this._events.next(new Es(this))}_updateValue(){}_anyControls(n){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(n){this._onChange.push(n)}_unregisterOnChange(n){zD(this._onChange,n)}registerOnDisabledChange(n){this._onDisabledChange.push(n)}_unregisterOnDisabledChange(n){zD(this._onDisabledChange,n)}_forEachChild(n){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(n){$D(n)?(this.value=this._pendingValue=n.value,n.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=n}};var CL=t=>t instanceof Nf;var wL=(()=>{class t extends zr{callSetDisabledState;get submitted(){return Ee(this._submittedReactive)}set submitted(e){this._submittedReactive.set(e)}_submitted=ke(()=>this._submittedReactive());_submittedReactive=T(!1);_oldForm;_onCollectionChange=()=>this._updateDomValue();directives=[];constructor(e,i,r){super(),this.callSetDisabledState=r,this._setValidators(e),this._setAsyncValidators(i)}ngOnChanges(e){this.onChanges(e)}ngOnDestroy(){this.onDestroy()}onChanges(e){this._checkFormPresent(),Object.hasOwn(e,"form")&&(this._updateValidators(),this._updateDomValue(),this._updateRegistrations(),this._oldForm=this.form)}onDestroy(){this.form&&(Sf(this.form,this),this.form._onCollectionChange===this._onCollectionChange&&this.form._registerOnCollectionChange(()=>{}))}get formDirective(){return this}get path(){return[]}addControl(e){let i=this.form.get(e.path);return e._setupWithForm(i,this.callSetDisabledState),i.updateValueAndValidity({emitEvent:!1}),this.directives.push(e),i}getControl(e){return this.form.get(e.path)}removeControl(e){Cf(e.control||null,e,!1),bL(this.directives,e)}addFormGroup(e){this._setUpFormContainer(e)}removeFormGroup(e){this._cleanUpFormContainer(e)}getFormGroup(e){return this.form.get(e.path)}getFormArray(e){return this.form.get(e.path)}addFormArray(e){this._setUpFormContainer(e)}removeFormArray(e){this._cleanUpFormContainer(e)}updateModel(e,i){this.form.get(e.path).setValue(i)}onReset(){this.resetForm()}resetForm(e=void 0,i={}){this.form.reset(e,i),this._submittedReactive.set(!1)}onSubmit(e){return this.submitted=!0,dE(this.form,this.directives),this.ngSubmit.emit(e),this.form._events.next(new bf(this.control)),e?.target?.method==="dialog"}_updateDomValue(){this.directives.forEach(e=>{let i=e.control,r=this.form.get(e.path);i!==r&&(Cf(i||null,e),CL(r)&&e._setupWithForm(r,this.callSetDisabledState))}),this.form._updateTreeValidity({emitEvent:!1})}_setUpFormContainer(e){let i=this.form.get(e.path);lE(i,e),i.updateValueAndValidity({emitEvent:!1})}_cleanUpFormContainer(e){let i=this.form?.get(e.path);i&&gL(i,e)&&i.updateValueAndValidity({emitEvent:!1})}_updateRegistrations(){this.form._registerOnCollectionChange(this._onCollectionChange),this._oldForm?._registerOnCollectionChange(()=>{})}_updateValidators(){Jv(this.form,this),this._oldForm&&Sf(this._oldForm,this)}_checkFormPresent(){this.form}static \u0275fac=function(i){return new(i||t)(ne(ea,10),ne(Ef,10),ne(Ms,8))};static \u0275dir=R({type:t,features:[ge,Ne]})}return t})(),SL={provide:zr,useExisting:en(()=>Gc)},Gc=(()=>{class t extends wL{form=null;ngSubmit=new O;get control(){return this.form}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","formGroup",""]],hostBindings:function(i,r){i&1&&w("submit",function(a){return r.onSubmit(a)})("reset",function(){return r.onReset()})},inputs:{form:[0,"formGroup","form"]},outputs:{ngSubmit:"ngSubmit"},exportAs:["ngForm"],standalone:!1,features:[Ie([SL]),ge]})}return t})(),xL={provide:Bn,useExisting:en(()=>ta)},WD=Promise.resolve(),ta=(()=>{class t extends Bn{_changeDetectorRef;callSetDisabledState;control=new Nf;static ngAcceptInputType_isDisabled;_registered=!1;_ngModelInjector;viewModel;name="";isDisabled;model;options;update=new O;constructor(e,i,r,o,a,s,l,d){super(l,d,o),this._changeDetectorRef=a,this.callSetDisabledState=s,this._parent=e,this._setValidators(i),this._setAsyncValidators(r)}ngOnChanges(e){if(this._registered,this._checkForErrors(),!this._registered||"name"in e){if(this._registered&&(this._checkName(),this.formDirective)){let i=e.name.previousValue;this.formDirective.removeControl({name:i,path:this._getPath(i)})}this._setUpControl()}"isDisabled"in e&&this._updateDisabled(e),cE(e,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective?.removeControl(this)}\u0275ngControlCreate(e){super.ngControlCreate(e)}\u0275ngControlUpdate(e){super.ngControlUpdate(e,!1)}get shouldBindRequired(){return!1}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,Yv(this.control,this,this.callSetDisabledState)),this.control.updateValueAndValidity({emitEvent:!1})}_setupWithForm(e){this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,Yv(this.control,this,e))}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(e){WD.then(()=>{this.control.setValue(e,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(e){let i=e.isDisabled.currentValue,r=i!==0&&Y(i);WD.then(()=>{r&&!this.control.disabled?this.control.disable():!r&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(e){return this._parent?uL(e,this._parent):[e]}static \u0275fac=function(i){return new(i||t)(ne(zr,9),ne(ea,10),ne(Ef,10),ne($c,10),ne(Me,8),ne(Ms,8),ne(K,8),ne(xe,8))};static \u0275dir=R({type:t,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],standalone:!1,features:[Ie([xL,uE]),ge,Ne,Ku(null)]})}return t})();var fE=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["form",3,"ngNoForm","",3,"ngNativeValidate",""]],hostAttrs:["novalidate",""],standalone:!1})}return t})();var hE=new C(""),DL={provide:Bn,useExisting:en(()=>eb)},eb=(()=>{class t extends Bn{_ngModelWarningConfig;callSetDisabledState;viewModel;form;set isDisabled(e){}model;update=new O;static _ngModelWarningSentOnce=!1;_ngModelWarningSent=!1;constructor(e,i,r,o,a,s,l){super(l,s,r),this._ngModelWarningConfig=o,this.callSetDisabledState=a,this._setValidators(e),this._setAsyncValidators(i)}ngOnChanges(e){if(this._isControlChanged(e)){let i=e.form.previousValue;i&&(Cf(i,this,!1),this.removeParseErrorsValidator(i)),this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,Yv(this.form,this,this.callSetDisabledState)),this.form.updateValueAndValidity({emitEvent:!1})}cE(e,this.viewModel)&&(this.form.setValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.form&&Cf(this.form,this,!1)}get path(){return[]}get control(){return this.form}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_isControlChanged(e){return Object.hasOwn(e,"form")}\u0275ngControlCreate(e){super.ngControlCreate(e)}\u0275ngControlUpdate(e){super.ngControlUpdate(e,!0)}static \u0275fac=function(i){return new(i||t)(ne(ea,10),ne(Ef,10),ne($c,10),ne(hE,8),ne(Ms,8),ne(xe,8),ne(K,8))};static \u0275dir=R({type:t,selectors:[["","formControl",""]],inputs:{form:[0,"formControl","form"],isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"]},outputs:{update:"ngModelChange"},exportAs:["ngForm"],standalone:!1,features:[Ie([DL,uE]),ge,Ne,Ku(null)]})}return t})();var pE=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();var Gr=(()=>{class t{static withConfig(e){return{ngModule:t,providers:[{provide:Ms,useValue:e.callSetDisabledState??If}]}}static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[pE]})}return t})(),gE=(()=>{class t{static withConfig(e){return{ngModule:t,providers:[{provide:hE,useValue:e.warnOnNgModelWithFormControl??"always"},{provide:Ms,useValue:e.callSetDisabledState??If}]}}static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[pE]})}return t})();var _E=(()=>{class t{_animationsDisabled=Re();state="unchecked";disabled=!1;appearance="full";static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-pseudo-checkbox"]],hostAttrs:[1,"mat-pseudo-checkbox"],hostVars:12,hostBindings:function(i,r){i&2&&N("mat-pseudo-checkbox-indeterminate",r.state==="indeterminate")("mat-pseudo-checkbox-checked",r.state==="checked")("mat-pseudo-checkbox-disabled",r.disabled)("mat-pseudo-checkbox-minimal",r.appearance==="minimal")("mat-pseudo-checkbox-full",r.appearance==="full")("_mat-animation-noopable",r._animationsDisabled)},inputs:{state:"state",disabled:"disabled",appearance:"appearance"},decls:0,vars:0,template:function(i,r){},styles:[`.mat-pseudo-checkbox {
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
`],encapsulation:2})}return t})();var kf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[_e]})}return t})();var EL=["*"],ML=`.mdc-list {
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
`,IL=["unscopedContent"],NL=["text"],TL=[[["","matListItemAvatar",""],["","matListItemIcon",""]],[["","matListItemTitle",""]],[["","matListItemLine",""]],"*",[["","matListItemMeta",""]],[["mat-divider"]]],kL=["[matListItemAvatar],[matListItemIcon]","[matListItemTitle]","[matListItemLine]","*","[matListItemMeta]","mat-divider"];var AL=new C("ListOption"),qc=(()=>{class t{_elementRef=c(L);static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","matListItemTitle",""]],hostAttrs:[1,"mat-mdc-list-item-title","mdc-list-item__primary-text"]})}return t})(),RL=(()=>{class t{_elementRef=c(L);static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","matListItemLine",""]],hostAttrs:[1,"mat-mdc-list-item-line","mdc-list-item__secondary-text"]})}return t})(),nb=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","matListItemMeta",""]],hostAttrs:[1,"mat-mdc-list-item-meta","mdc-list-item__end"]})}return t})(),vE=(()=>{class t{_listOption=c(AL,{optional:!0});_isAlignedAtStart(){return!this._listOption||this._listOption?._getTogglePosition()==="after"}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,hostVars:4,hostBindings:function(i,r){i&2&&N("mdc-list-item__start",r._isAlignedAtStart())("mdc-list-item__end",!r._isAlignedAtStart())}})}return t})(),OL=(()=>{class t extends vE{static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","matListItemAvatar",""]],hostAttrs:[1,"mat-mdc-list-item-avatar"],features:[ge]})}return t})(),Yc=(()=>{class t extends vE{static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","matListItemIcon",""]],hostAttrs:[1,"mat-mdc-list-item-icon"],features:[ge]})}return t})(),PL=new C("MAT_LIST_CONFIG"),tb=(()=>{class t{_isNonInteractive=!0;get disableRipple(){return this._disableRipple}set disableRipple(e){this._disableRipple=lt(e)}_disableRipple=!1;get disabled(){return this._disabled()}set disabled(e){this._disabled.set(lt(e))}_disabled=T(!1);_defaultOptions=c(PL,{optional:!0});static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,hostVars:1,hostBindings:function(i,r){i&2&&j("aria-disabled",r.disabled)},inputs:{disableRipple:"disableRipple",disabled:"disabled"}})}return t})(),FL=(()=>{class t{_elementRef=c(L);_ngZone=c($);_listBase=c(tb,{optional:!0});_platform=c(Ce);_hostElement;_isButtonElement;_noopAnimations=Re();_avatars;_icons;set lines(e){this._explicitLines=Bt(e,null),this._updateItemLines(!1)}_explicitLines=null;get disableRipple(){return this.disabled||this._disableRipple||this._noopAnimations||!!this._listBase?.disableRipple}set disableRipple(e){this._disableRipple=lt(e)}_disableRipple=!1;get disabled(){return this._disabled()||!!this._listBase?.disabled}set disabled(e){this._disabled.set(lt(e))}_disabled=T(!1);_subscriptions=new ue;_rippleRenderer=null;_hasUnscopedTextContent=!1;rippleConfig;get rippleDisabled(){return this.disableRipple||!!this.rippleConfig.disabled}constructor(){c(tt).load(gn);let e=c(ys,{optional:!0});this.rippleConfig=e||{},this._hostElement=this._elementRef.nativeElement,this._isButtonElement=this._hostElement.nodeName.toLowerCase()==="button",this._listBase&&!this._listBase._isNonInteractive&&this._initInteractiveListItem(),this._isButtonElement&&!this._hostElement.hasAttribute("type")&&this._hostElement.setAttribute("type","button")}ngAfterViewInit(){this._monitorProjectedLinesAndTitle(),this._updateItemLines(!0)}ngOnDestroy(){this._subscriptions.unsubscribe(),this._rippleRenderer!==null&&this._rippleRenderer._removeTriggerEvents()}_hasIconOrAvatar(){return!!(this._avatars.length||this._icons.length)}_initInteractiveListItem(){this._hostElement.classList.add("mat-mdc-list-item-interactive"),this._rippleRenderer=new Xo(this,this._ngZone,this._hostElement,this._platform,c(K)),this._rippleRenderer.setupTriggerEvents(this._hostElement)}_monitorProjectedLinesAndTitle(){this._ngZone.runOutsideAngular(()=>{this._subscriptions.add(ft(this._lines.changes,this._titles.changes).subscribe(()=>this._updateItemLines(!1)))})}_updateItemLines(e){if(!this._lines||!this._titles||!this._unscopedContent)return;e&&this._checkDomForUnscopedTextContent();let i=this._explicitLines??this._inferLinesFromContent(),r=this._unscopedContent.nativeElement;if(this._hostElement.classList.toggle("mat-mdc-list-item-single-line",i<=1),this._hostElement.classList.toggle("mdc-list-item--with-one-line",i<=1),this._hostElement.classList.toggle("mdc-list-item--with-two-lines",i===2),this._hostElement.classList.toggle("mdc-list-item--with-three-lines",i===3),this._hasUnscopedTextContent){let o=this._titles.length===0&&i===1;r.classList.toggle("mdc-list-item__primary-text",o),r.classList.toggle("mdc-list-item__secondary-text",!o)}else r.classList.remove("mdc-list-item__primary-text"),r.classList.remove("mdc-list-item__secondary-text")}_inferLinesFromContent(){let e=this._titles.length+this._lines.length;return this._hasUnscopedTextContent&&(e+=1),e}_checkDomForUnscopedTextContent(){this._hasUnscopedTextContent=Array.from(this._unscopedContent.nativeElement.childNodes).filter(e=>e.nodeType!==e.COMMENT_NODE).some(e=>!!(e.textContent&&e.textContent.trim()))}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,contentQueries:function(i,r,o){if(i&1&&dt(o,OL,4)(o,Yc,4),i&2){let a;U(a=z())&&(r._avatars=a),U(a=z())&&(r._icons=a)}},hostVars:4,hostBindings:function(i,r){i&2&&(j("aria-disabled",r.disabled)("disabled",r._isButtonElement&&r.disabled||null),N("mdc-list-item--disabled",r.disabled))},inputs:{lines:"lines",disableRipple:"disableRipple",disabled:"disabled"}})}return t})();var Af=(()=>{class t extends FL{_lines;_titles;_meta;_unscopedContent;_itemText;get activated(){return this._activated}set activated(e){this._activated=lt(e)}_activated=!1;_getAriaCurrent(){return this._hostElement.nodeName==="A"&&this._activated?"page":null}_hasBothLeadingAndTrailing(){return this._meta.length!==0&&(this._avatars.length!==0||this._icons.length!==0)}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275cmp=x({type:t,selectors:[["mat-list-item"],["a","mat-list-item",""],["button","mat-list-item",""]],contentQueries:function(i,r,o){if(i&1&&dt(o,RL,5)(o,qc,5)(o,nb,5),i&2){let a;U(a=z())&&(r._lines=a),U(a=z())&&(r._titles=a),U(a=z())&&(r._meta=a)}},viewQuery:function(i,r){if(i&1&&Te(IL,5)(NL,5),i&2){let o;U(o=z())&&(r._unscopedContent=o.first),U(o=z())&&(r._itemText=o.first)}},hostAttrs:[1,"mat-mdc-list-item","mdc-list-item"],hostVars:13,hostBindings:function(i,r){i&2&&(j("aria-current",r._getAriaCurrent()),N("mdc-list-item--activated",r.activated)("mdc-list-item--with-leading-avatar",r._avatars.length!==0)("mdc-list-item--with-leading-icon",r._icons.length!==0)("mdc-list-item--with-trailing-meta",r._meta.length!==0)("mat-mdc-list-item-both-leading-and-trailing",r._hasBothLeadingAndTrailing())("_mat-animation-noopable",r._noopAnimations))},inputs:{activated:"activated"},exportAs:["matListItem"],features:[ge],ngContentSelectors:kL,decls:10,vars:0,consts:[["unscopedContent",""],[1,"mdc-list-item__content"],[1,"mat-mdc-list-item-unscoped-content",3,"cdkObserveContent"],[1,"mat-focus-indicator"]],template:function(i,r){i&1&&(ve(TL),B(0),m(1,"span",1),B(2,1),B(3,2),m(4,"span",2,0),w("cdkObserveContent",function(){return r._updateItemLines(!0)}),B(6,3),f()(),B(7,4),B(8,5),V(9,"div",3))},dependencies:[Jm],encapsulation:2})}return t})();var bE=(()=>{class t extends tb{_isNonInteractive=!1;static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275cmp=x({type:t,selectors:[["mat-nav-list"]],hostAttrs:["role","navigation",1,"mat-mdc-nav-list","mat-mdc-list-base","mdc-list"],exportAs:["matNavList"],features:[Ie([{provide:tb,useExisting:t}]),ge],ngContentSelectors:EL,decls:1,vars:0,template:function(i,r){i&1&&(ve(),B(0))},styles:[ML],encapsulation:2})}return t})();var Rf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ps,Hr,kf,_e,Ss]})}return t})();var Zc=class{_attachedHost=null;attach(n){return this._attachedHost=n,n.attach(this)}detach(){let n=this._attachedHost;n!=null&&(this._attachedHost=null,n.detach())}get isAttached(){return this._attachedHost!=null}setAttachedHost(n){this._attachedHost=n}},qr=class extends Zc{component;viewContainerRef;injector;projectableNodes;bindings;directives;constructor(n,e,i,r,o,a){super(),this.component=n,this.viewContainerRef=e,this.injector=i,this.projectableNodes=r,this.bindings=o||null,this.directives=a||null}},cn=class extends Zc{templateRef;viewContainerRef;context;injector;constructor(n,e,i,r){super(),this.templateRef=n,this.viewContainerRef=e,this.context=i,this.injector=r}get origin(){return this.templateRef.elementRef}attach(n,e=this.context){return this.context=e,super.attach(n)}detach(){return this.context=void 0,super.detach()}},rb=class extends Zc{element;constructor(n){super(),this.element=n instanceof L?n.nativeElement:n}},Is=class{_attachedPortal=null;_disposeFn=null;_isDisposed=!1;hasAttached(){return!!this._attachedPortal}attach(n){if(n instanceof qr)return this._attachedPortal=n,this.attachComponentPortal(n);if(n instanceof cn)return this._attachedPortal=n,this.attachTemplatePortal(n);if(this.attachDomPortal&&n instanceof rb)return this._attachedPortal=n,this.attachDomPortal(n)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn()}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=!0}setDisposeFn(n){this._disposeFn=n}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null)}},Ns=class extends Is{outletElement;_appRef;_defaultInjector;constructor(n,e,i){super(),this.outletElement=n,this._appRef=e,this._defaultInjector=i}attachComponentPortal(n){let e;if(n.viewContainerRef){let i=n.injector||n.viewContainerRef.injector,r=i.get(Di,null,{optional:!0})||void 0;e=n.viewContainerRef.createComponent(n.component,{index:n.viewContainerRef.length,injector:i,ngModuleRef:r,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0,directives:n.directives||void 0}),this.setDisposeFn(()=>e.destroy())}else{let i=this._appRef,r=n.injector||this._defaultInjector||K.NULL,o=r.get(qe,i.injector);e=sm(n.component,{elementInjector:r,environmentInjector:o,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0,directives:n.directives||void 0}),i.attachView(e.hostView),this.setDisposeFn(()=>{i.viewCount>0&&i.detachView(e.hostView),e.destroy()})}return this.outletElement.appendChild(this._getComponentRootNode(e)),this._attachedPortal=n,e}attachTemplatePortal(n){let e=n.viewContainerRef,i=e.createEmbeddedView(n.templateRef,n.context,{injector:n.injector});return i.rootNodes.forEach(r=>this.outletElement.appendChild(r)),i.detectChanges(),this.setDisposeFn(()=>{let r=e.indexOf(i);r!==-1&&e.remove(r)}),this._attachedPortal=n,i}attachDomPortal=n=>{let e=n.element;e.parentNode;let i=this.outletElement.ownerDocument.createComment("dom-portal");e.parentNode.insertBefore(i,e),this.outletElement.appendChild(e),this._attachedPortal=n,super.setDisposeFn(()=>{i.parentNode&&i.parentNode.replaceChild(e,i)})};dispose(){super.dispose(),this.outletElement.remove()}_getComponentRootNode(n){return n.hostView.rootNodes[0]}},yE=(()=>{class t extends cn{constructor(){let e=c(bt),i=c(pt);super(e,i)}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdkPortal",""]],exportAs:["cdkPortal"],features:[ge]})}return t})(),ki=(()=>{class t extends Is{_moduleRef=c(Di,{optional:!0});_document=c(X);_viewContainerRef=c(pt);_isInitialized=!1;_attachedRef=null;get portal(){return this._attachedPortal}set portal(e){this.hasAttached()&&!e&&!this._isInitialized||(this.hasAttached()&&super.detach(),e&&super.attach(e),this._attachedPortal=e||null)}attached=new O;get attachedRef(){return this._attachedRef}ngOnInit(){this._isInitialized=!0}ngOnDestroy(){super.dispose(),this._attachedRef=this._attachedPortal=null}attachComponentPortal(e){e.setAttachedHost(this);let i=e.viewContainerRef!=null?e.viewContainerRef:this._viewContainerRef,r=i.createComponent(e.component,{index:i.length,injector:e.injector||i.injector,projectableNodes:e.projectableNodes||void 0,ngModuleRef:this._moduleRef||void 0,bindings:e.bindings||void 0,directives:e.directives||void 0});return i!==this._viewContainerRef&&this._getRootNode().appendChild(r.hostView.rootNodes[0]),super.setDisposeFn(()=>r.destroy()),this._attachedPortal=e,this._attachedRef=r,this.attached.emit(r),r}attachTemplatePortal(e){e.setAttachedHost(this);let i=this._viewContainerRef.createEmbeddedView(e.templateRef,e.context,{injector:e.injector});return super.setDisposeFn(()=>this._viewContainerRef.clear()),this._attachedPortal=e,this._attachedRef=i,this.attached.emit(i),i}attachDomPortal=e=>{let i=e.element;i.parentNode;let r=this._document.createComment("dom-portal");e.setAttachedHost(this),i.parentNode.insertBefore(r,i),this._getRootNode().appendChild(i),this._attachedPortal=e,super.setDisposeFn(()=>{r.parentNode&&r.parentNode.replaceChild(i,r)})};_getRootNode(){let e=this._viewContainerRef.element.nativeElement;return e.nodeType===e.ELEMENT_NODE?e:e.parentNode}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","cdkPortalOutlet",""]],inputs:{portal:[0,"cdkPortalOutlet","portal"]},outputs:{attached:"attached"},exportAs:["cdkPortalOutlet"],features:[ge]})}return t})(),sr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();var CE=af();function As(t){return new Of(t.get(In),t.get(X))}var Of=class{_viewportRuler;_previousHTMLStyles={top:"",left:""};_previousScrollPosition;_isEnabled=!1;_document;constructor(n,e){this._viewportRuler=n,this._document=e}attach(){}enable(){if(this._canBeEnabled()){let n=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=n.style.left||"",this._previousHTMLStyles.top=n.style.top||"",n.style.left=Dt(-this._previousScrollPosition.left),n.style.top=Dt(-this._previousScrollPosition.top),n.classList.add("cdk-global-scrollblock"),this._isEnabled=!0}}disable(){if(this._isEnabled){let n=this._document.documentElement,e=this._document.body,i=n.style,r=e.style,o=i.scrollBehavior||"",a=r.scrollBehavior||"";this._isEnabled=!1,i.left=this._previousHTMLStyles.left,i.top=this._previousHTMLStyles.top,n.classList.remove("cdk-global-scrollblock"),CE&&(i.scrollBehavior=r.scrollBehavior="auto"),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),CE&&(i.scrollBehavior=o,r.scrollBehavior=a)}}_canBeEnabled(){if(this._document.documentElement.classList.contains("cdk-global-scrollblock")||this._isEnabled)return!1;let e=this._document.documentElement,i=this._viewportRuler.getViewportSize();return e.scrollHeight>i.height||e.scrollWidth>i.width}};function IE(t,n){return new Pf(t.get(Ur),t.get($),t.get(In),n)}var Pf=class{_scrollDispatcher;_ngZone;_viewportRuler;_config;_scrollSubscription=null;_overlayRef;_initialScrollPosition;constructor(n,e,i,r){this._scrollDispatcher=n,this._ngZone=e,this._viewportRuler=i,this._config=r}attach(n){this._overlayRef,this._overlayRef=n}enable(){if(this._scrollSubscription)return;let n=this._scrollDispatcher.scrolled(0).pipe(me(e=>!e||!this._overlayRef.overlayElement.contains(e.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=n.subscribe(()=>{let e=this._viewportRuler.getViewportScrollPosition().top;Math.abs(e-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition()})):this._scrollSubscription=n.subscribe(this._detach)}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}_detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach())}};var Qc=class{enable(){}disable(){}attach(){}};function ab(t,n){return n.some(e=>{let i=t.bottom<e.top,r=t.top>e.bottom,o=t.right<e.left,a=t.left>e.right;return i||r||o||a})}function wE(t,n){return n.some(e=>{let i=t.top<e.top,r=t.bottom>e.bottom,o=t.left<e.left,a=t.right>e.right;return i||r||o||a})}function cr(t,n){return new Ff(t.get(Ur),t.get(In),t.get($),n)}var Ff=class{_scrollDispatcher;_viewportRuler;_ngZone;_config;_scrollSubscription=null;_overlayRef;constructor(n,e,i,r){this._scrollDispatcher=n,this._viewportRuler=e,this._ngZone=i,this._config=r}attach(n){this._overlayRef,this._overlayRef=n}enable(){if(!this._scrollSubscription){let n=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(n).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let e=this._overlayRef.overlayElement.getBoundingClientRect(),{width:i,height:r}=this._viewportRuler.getViewportSize();ab(e,[{width:i,height:r,bottom:r,right:i,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()))}})}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null)}detach(){this.disable(),this._overlayRef=null}},NE=(()=>{class t{_injector=c(K);noop=()=>new Qc;close=e=>IE(this._injector,e);block=()=>As(this._injector);reposition=e=>cr(this._injector,e);static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),lr=class{positionStrategy;scrollStrategy=new Qc;panelClass="";hasBackdrop=!1;backdropClass="cdk-overlay-dark-backdrop";disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=!1;usePopover;eventPredicate;constructor(n){if(n){let e=Object.keys(n);for(let i of e)n[i]!==void 0&&(this[i]=n[i])}}};var Lf=class{connectionPair;scrollableViewProperties;constructor(n,e){this.connectionPair=n,this.scrollableViewProperties=e}};var TE=(()=>{class t{_attachedOverlays=[];_document=c(X);_isAttached=!1;ngOnDestroy(){this.detach()}add(e){this.remove(e),this._attachedOverlays.push(e)}remove(e){let i=this._attachedOverlays.indexOf(e);i>-1&&this._attachedOverlays.splice(i,1),this._attachedOverlays.length===0&&this.detach()}canReceiveEvent(e,i,r){return r.observers.length<1?!1:e.eventPredicate?e.eventPredicate(i):!0}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),kE=(()=>{class t extends TE{_ngZone=c($);_renderer=c(It).createRenderer(null,null);_cleanupKeydown;add(e){super.add(e),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen("body","keydown",this._keydownListener)}),this._isAttached=!0)}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=!1)}_keydownListener=e=>{let i=this._attachedOverlays;for(let r=i.length-1;r>-1;r--){let o=i[r];if(this.canReceiveEvent(o,e,o._keydownEvents)){this._ngZone.run(()=>o._keydownEvents.next(e));break}}};static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),AE=(()=>{class t extends TE{_platform=c(Ce);_ngZone=c($);_renderer=c(It).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=!1;_pointerDownEventTarget=null;_cleanups;add(e){if(super.add(e),!this._isAttached){let i=this._document.body,r={capture:!0},o=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[o.listen(i,"pointerdown",this._pointerDownListener,r),o.listen(i,"click",this._clickListener,r),o.listen(i,"auxclick",this._clickListener,r),o.listen(i,"contextmenu",this._clickListener,r)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=i.style.cursor,i.style.cursor="pointer",this._cursorStyleIsSet=!0),this._isAttached=!0}}detach(){this._isAttached&&(this._cleanups?.forEach(e=>e()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=!1),this._isAttached=!1)}_pointerDownListener=e=>{this._pointerDownEventTarget=$t(e)};_clickListener=e=>{let i=$t(e),r=e.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:i;this._pointerDownEventTarget=null;let o=this._attachedOverlays.slice();for(let a=o.length-1;a>-1;a--){let s=o[a],l=s._outsidePointerEvents;if(!(!s.hasAttached()||!this.canReceiveEvent(s,e,l))){if(SE(s.overlayElement,i)||SE(s.overlayElement,r))break;this._ngZone?this._ngZone.run(()=>l.next(e)):l.next(e)}}};static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function SE(t,n){let e=typeof ShadowRoot<"u"&&ShadowRoot,i=n;for(;i;){if(i===t)return!0;i=e&&i instanceof ShadowRoot?i.host:i.parentNode}return!1}var RE=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["ng-component"]],hostAttrs:["cdk-overlay-style-loader",""],decls:0,vars:0,template:function(i,r){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
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
`],encapsulation:2})}return t})(),Bf=(()=>{class t{_platform=c(Ce);_containerElement;_document=c(X);_styleLoader=c(tt);ngOnDestroy(){this._containerElement?.remove()}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let e="cdk-overlay-container";if(this._platform.isBrowser||Ov()){let r=this._document.querySelectorAll(`.${e}[platform="server"], .${e}[platform="test"]`);for(let o=0;o<r.length;o++)r[o].remove()}let i=this._document.createElement("div");i.classList.add(e),Ov()?i.setAttribute("platform","test"):this._platform.isBrowser||i.setAttribute("platform","server"),this._document.body.appendChild(i),this._containerElement=i}_loadStyles(){this._styleLoader.load(RE)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),sb=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(n,e,i,r){this._renderer=e,this._ngZone=i,this.element=n.createElement("div"),this.element.classList.add("cdk-overlay-backdrop"),this._cleanupClick=e.listen(this.element,"click",r)}detach(){this._ngZone.runOutsideAngular(()=>{let n=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(n,"transitionend",this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),n.style.pointerEvents="none",n.classList.remove("cdk-overlay-backdrop-showing")})}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove()}};function lb(t){return t&&t.nodeType===1}var ob=new Set;var Ts=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new I;_attachments=new I;_detachments=new I;_positionStrategy;_scrollStrategy;_locationChanges=ue.EMPTY;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=!1;_previousHostParent;_keydownEvents=new I;_outsidePointerEvents=new I;_afterNextRenderRef;constructor(n,e,i,r,o,a,s,l,d,u=!1,h,_){this._portalOutlet=n,this._host=e,this._pane=i,this._config=r,this._ngZone=o,this._keyboardDispatcher=a,this._document=s,this._location=l,this._outsideClickDispatcher=d,this._animationsDisabled=u,this._injector=h,this._renderer=_,r.scrollStrategy&&(this._scrollStrategy=r.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=r.positionStrategy}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(n){if(this._disposed)return null;this._attachHost();let e=this._portalOutlet.attach(n);return this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),ob.add(this),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=ct(()=>{this.hasAttached()&&this.updatePosition()},{injector:this._injector}),this._togglePointerEvents(!0),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!0),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof e?.onDestroy=="function"&&e.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()))}),e}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(!1),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let n=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),ob.delete(this),n}dispose(){if(this._disposed)return;let n=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,n&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=!0,ob.delete(this)}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply()}updatePositionStrategy(n){n!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=n,this.hasAttached()&&(n.attach(this),this.updatePosition()))}updateSize(n){this._config=y(y({},this._config),n),this._updateElementSize()}setDirection(n){this._config=J(y({},this._config),{direction:n}),this._updateElementDirection()}addPanelClass(n){this._pane&&this._toggleClasses(this._pane,n,!0)}removePanelClass(n){this._pane&&this._toggleClasses(this._pane,n,!1)}getDirection(){let n=this._config.direction;return n?typeof n=="string"?n:n.value:"ltr"}updateScrollStrategy(n){n!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=n,this.hasAttached()&&(n.attach(this),n.enable()))}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection())}_updateElementSize(){if(!this._pane)return;let n=this._pane.style;n.width=Dt(this._config.width),n.height=Dt(this._config.height),n.minWidth=Dt(this._config.minWidth),n.minHeight=Dt(this._config.minHeight),n.maxWidth=Dt(this._config.maxWidth),n.maxHeight=Dt(this._config.maxHeight)}_togglePointerEvents(n){this._pane.style.pointerEvents=n?"":"none"}_attachHost(){if(!this._host.parentElement){let n=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;lb(n)?n.after(this._host):n?.type==="parent"?n.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host)}if(this._config.usePopover)try{this._host.showPopover()}catch(n){}}_attachBackdrop(){let n="cdk-overlay-backdrop-showing";this._backdropRef?.dispose(),this._backdropRef=new sb(this._document,this._renderer,this._ngZone,e=>{this._backdropClick.next(e)}),this._animationsDisabled&&this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,!0),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(n))}):this._backdropRef.element.classList.add(n)}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host)}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach()}_toggleClasses(n,e,i){let r=ds(e||[]).filter(o=>!!o);r.length&&(i?n.classList.add(...r):n.classList.remove(...r))}_detachContentWhenEmpty(){let n=!1;try{this._detachContentAfterRenderRef=ct(()=>{n=!0,this._detachContent()},{injector:this._injector})}catch(e){if(n)throw e;this._detachContent()}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent()}),this._detachContentMutationObserver.observe(this._pane,{childList:!0}))}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!1),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent())}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect()}_disposeScrollStrategy(){let n=this._scrollStrategy;n?.disable(),n?.detach?.()}},xE="cdk-overlay-connected-position-bounding-box",LL=/([A-Za-z%]+)$/;function ia(t,n){return new jf(n,t.get(In),t.get(X),t.get(Ce),t.get(Bf))}var jf=class{_viewportRuler;_document;_platform;_overlayContainer;_overlayRef;_isInitialRender=!1;_lastBoundingBoxSize={width:0,height:0};_isPushed=!1;_canPush=!0;_growAfterOpen=!1;_hasFlexibleDimensions=!0;_positionLocked=!1;_originRect;_overlayRect;_viewportRect;_containerRect;_viewportMargin=0;_scrollables=[];_preferredPositions=[];_origin;_pane;_isDisposed=!1;_boundingBox=null;_lastPosition=null;_lastScrollVisibility=null;_positionChanges=new I;_resizeSubscription=ue.EMPTY;_offsetX=0;_offsetY=0;_transformOriginSelector;_appliedPanelClasses=[];_previousPushAmount=null;_popoverLocation="global";positionChanges=this._positionChanges;get positions(){return this._preferredPositions}constructor(n,e,i,r,o){this._viewportRuler=e,this._document=i,this._platform=r,this._overlayContainer=o,this.setOrigin(n)}attach(n){this._overlayRef&&this._overlayRef,this._validatePositions(),n.hostElement.classList.add(xE),this._overlayRef=n,this._boundingBox=n.hostElement,this._pane=n.overlayElement,this._isDisposed=!1,this._isInitialRender=!0,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=!0,this.apply()})}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._getContainerRect();let n=this._originRect,e=this._overlayRect,i=this._viewportRect,r=this._containerRect,o=[],a;for(let s of this._preferredPositions){let l=this._getOriginPoint(n,r,s),d=this._getOverlayPoint(l,e,s),u=this._getOverlayFit(d,e,i,s);if(u.isCompletelyWithinViewport){this._isPushed=!1,this._applyPosition(s,l);return}if(this._canFitWithFlexibleDimensions(u,d,i)){o.push({position:s,origin:l,overlayRect:e,boundingBoxRect:this._calculateBoundingBoxRect(l,s)});continue}(!a||a.overlayFit.visibleArea<u.visibleArea)&&(a={overlayFit:u,overlayPoint:d,originPoint:l,position:s,overlayRect:e})}if(o.length){let s=null,l=-1;for(let d of o){let u=d.boundingBoxRect.width*d.boundingBoxRect.height*(d.position.weight||1);u>l&&(l=u,s=d)}this._isPushed=!1,this._applyPosition(s.position,s.origin);return}if(this._canPush){this._isPushed=!0,this._applyPosition(a.position,a.originPoint);return}this._applyPosition(a.position,a.originPoint)}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe()}dispose(){this._isDisposed||(this._boundingBox&&na(this._boundingBox.style,{top:"",left:"",right:"",bottom:"",height:"",width:"",alignItems:"",justifyContent:""}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(xE),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=!0)}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let n=this._lastPosition;n?(this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._getContainerRect(),this._applyPosition(n,this._getOriginPoint(this._originRect,this._containerRect,n))):this.apply()}withScrollableContainers(n){return this._scrollables=n,this}withPositions(n){return this._preferredPositions=n,n.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(n){return this._viewportMargin=n,this}withFlexibleDimensions(n=!0){return this._hasFlexibleDimensions=n,this}withGrowAfterOpen(n=!0){return this._growAfterOpen=n,this}withPush(n=!0){return this._canPush=n,this}withLockedPosition(n=!0){return this._positionLocked=n,this}setOrigin(n){return this._origin=n,this}withDefaultOffsetX(n){return this._offsetX=n,this}withDefaultOffsetY(n){return this._offsetY=n,this}withTransformOriginOn(n){return this._transformOriginSelector=n,this}withPopoverLocation(n){return this._popoverLocation=n,this}getPopoverInsertionPoint(){return this._popoverLocation==="global"?null:this._popoverLocation!=="inline"?this._popoverLocation:this._origin instanceof L?this._origin.nativeElement:lb(this._origin)?this._origin:null}_getOriginPoint(n,e,i){let r;if(i.originX=="center")r=n.left+n.width/2;else{let a=this._isRtl()?n.right:n.left,s=this._isRtl()?n.left:n.right;r=i.originX=="start"?a:s}e.left<0&&(r-=e.left);let o;return i.originY=="center"?o=n.top+n.height/2:o=i.originY=="top"?n.top:n.bottom,e.top<0&&(o-=e.top),{x:r,y:o}}_getOverlayPoint(n,e,i){let r;i.overlayX=="center"?r=-e.width/2:i.overlayX==="start"?r=this._isRtl()?-e.width:0:r=this._isRtl()?0:-e.width;let o;return i.overlayY=="center"?o=-e.height/2:o=i.overlayY=="top"?0:-e.height,{x:n.x+r,y:n.y+o}}_getOverlayFit(n,e,i,r){let o=EE(e),{x:a,y:s}=n,l=this._getOffset(r,"x"),d=this._getOffset(r,"y");l&&(a+=l),d&&(s+=d);let u=0-a,h=a+o.width-i.width,_=0-s,v=s+o.height-i.height,S=this._subtractOverflows(o.width,u,h),A=this._subtractOverflows(o.height,_,v),oe=S*A;return{visibleArea:oe,isCompletelyWithinViewport:o.width*o.height===oe,fitsInViewportVertically:A===o.height,fitsInViewportHorizontally:S==o.width}}_canFitWithFlexibleDimensions(n,e,i){if(this._hasFlexibleDimensions){let r=i.bottom-e.y,o=i.right-e.x,a=DE(this._overlayRef.getConfig().minHeight),s=DE(this._overlayRef.getConfig().minWidth),l=n.fitsInViewportVertically||a!=null&&a<=r,d=n.fitsInViewportHorizontally||s!=null&&s<=o;return l&&d}return!1}_pushOverlayOnScreen(n,e,i){if(this._previousPushAmount&&this._positionLocked)return{x:n.x+this._previousPushAmount.x,y:n.y+this._previousPushAmount.y};let r=EE(e),o=this._viewportRect,a=Math.max(n.x+r.width-o.width,0),s=Math.max(n.y+r.height-o.height,0),l=Math.max(o.top-i.top-n.y,0),d=Math.max(o.left-i.left-n.x,0),u=0,h=0;return r.width<=o.width?u=d||-a:u=n.x<this._getViewportMarginStart()?o.left-i.left-n.x:0,r.height<=o.height?h=l||-s:h=n.y<this._getViewportMarginTop()?o.top-i.top-n.y:0,this._previousPushAmount={x:u,y:h},{x:n.x+u,y:n.y+h}}_applyPosition(n,e){if(this._setTransformOrigin(n),this._setOverlayElementStyles(e,n),this._setBoundingBoxStyles(e,n),n.panelClass&&this._addPanelClasses(n.panelClass),this._positionChanges.observers.length){let i=this._getScrollVisibility();if(n!==this._lastPosition||!this._lastScrollVisibility||!jL(this._lastScrollVisibility,i)){let r=new Lf(n,i);this._positionChanges.next(r)}this._lastScrollVisibility=i}this._lastPosition=n,this._isInitialRender=!1}_setTransformOrigin(n){if(!this._transformOriginSelector)return;let e=this._boundingBox.querySelectorAll(this._transformOriginSelector),i,r=n.overlayY;n.overlayX==="center"?i="center":this._isRtl()?i=n.overlayX==="start"?"right":"left":i=n.overlayX==="start"?"left":"right";for(let o=0;o<e.length;o++)e[o].style.transformOrigin=`${i} ${r}`}_calculateBoundingBoxRect(n,e){let i=this._viewportRect,r=this._isRtl(),o,a,s;if(e.overlayY==="top")a=n.y,o=i.height-a+this._getViewportMarginBottom();else if(e.overlayY==="bottom")s=i.height-n.y+this._getViewportMarginTop()+this._getViewportMarginBottom(),o=i.height-s+this._getViewportMarginTop();else{let v=Math.min(i.bottom-n.y+i.top,n.y),S=this._lastBoundingBoxSize.height;o=v*2,a=n.y-v,o>S&&!this._isInitialRender&&!this._growAfterOpen&&(a=n.y-S/2)}let l=e.overlayX==="start"&&!r||e.overlayX==="end"&&r,d=e.overlayX==="end"&&!r||e.overlayX==="start"&&r,u,h,_;if(d)_=i.width-n.x+this._getViewportMarginStart()+this._getViewportMarginEnd(),u=n.x-this._getViewportMarginStart();else if(l)h=n.x,u=i.right-n.x-this._getViewportMarginEnd();else{let v=Math.min(i.right-n.x+i.left,n.x),S=this._lastBoundingBoxSize.width;u=v*2,h=n.x-v,u>S&&!this._isInitialRender&&!this._growAfterOpen&&(h=n.x-S/2)}return{top:a,left:h,bottom:s,right:_,width:u,height:o}}_setBoundingBoxStyles(n,e){let i=this._calculateBoundingBoxRect(n,e);!this._isInitialRender&&!this._growAfterOpen&&(i.height=Math.min(i.height,this._lastBoundingBoxSize.height),i.width=Math.min(i.width,this._lastBoundingBoxSize.width));let r={};if(this._hasExactPosition())r.top=r.left="0",r.bottom=r.right="auto",r.maxHeight=r.maxWidth="",r.width=r.height="100%";else{let o=this._overlayRef.getConfig().maxHeight,a=this._overlayRef.getConfig().maxWidth;r.width=Dt(i.width),r.height=Dt(i.height),r.top=Dt(i.top)||"auto",r.bottom=Dt(i.bottom)||"auto",r.left=Dt(i.left)||"auto",r.right=Dt(i.right)||"auto",e.overlayX==="center"?r.alignItems="center":r.alignItems=e.overlayX==="end"?"flex-end":"flex-start",e.overlayY==="center"?r.justifyContent="center":r.justifyContent=e.overlayY==="bottom"?"flex-end":"flex-start",o&&(r.maxHeight=Dt(o)),a&&(r.maxWidth=Dt(a))}this._lastBoundingBoxSize=i,na(this._boundingBox.style,r)}_resetBoundingBoxStyles(){na(this._boundingBox.style,{top:"0",left:"0",right:"0",bottom:"0",height:"",width:"",alignItems:"",justifyContent:""})}_resetOverlayElementStyles(){na(this._pane.style,{top:"",left:"",bottom:"",right:"",position:"",transform:""})}_setOverlayElementStyles(n,e){let i={},r=this._hasExactPosition(),o=this._hasFlexibleDimensions,a=this._overlayRef.getConfig();if(r){let u=this._viewportRuler.getViewportScrollPosition();na(i,this._getExactOverlayY(e,n,u)),na(i,this._getExactOverlayX(e,n,u))}else i.position="static";let s="",l=this._getOffset(e,"x"),d=this._getOffset(e,"y");l&&(s+=`translateX(${l}px) `),d&&(s+=`translateY(${d}px)`),i.transform=s.trim(),a.maxHeight&&(r?i.maxHeight=Dt(a.maxHeight):o&&(i.maxHeight="")),a.maxWidth&&(r?i.maxWidth=Dt(a.maxWidth):o&&(i.maxWidth="")),na(this._pane.style,i)}_getExactOverlayY(n,e,i){let r={top:"",bottom:""},o=this._getOverlayPoint(e,this._overlayRect,n);if(this._isPushed&&(o=this._pushOverlayOnScreen(o,this._overlayRect,i)),n.overlayY==="bottom"){let a=this._document.documentElement.clientHeight;r.bottom=`${a-(o.y+this._overlayRect.height)}px`}else r.top=Dt(o.y);return r}_getExactOverlayX(n,e,i){let r={left:"",right:""},o=this._getOverlayPoint(e,this._overlayRect,n);this._isPushed&&(o=this._pushOverlayOnScreen(o,this._overlayRect,i));let a;if(this._isRtl()?a=n.overlayX==="end"?"left":"right":a=n.overlayX==="end"?"right":"left",a==="right"){let s=this._document.documentElement.clientWidth;r.right=`${s-(o.x+this._overlayRect.width)}px`}else r.left=Dt(o.x);return r}_getScrollVisibility(){let n=this._getOriginRect(),e=this._pane.getBoundingClientRect(),i=this._scrollables.map(r=>r.getElementRef().nativeElement.getBoundingClientRect());return{isOriginClipped:wE(n,i),isOriginOutsideView:ab(n,i),isOverlayClipped:wE(e,i),isOverlayOutsideView:ab(e,i)}}_subtractOverflows(n,...e){return e.reduce((i,r)=>i-Math.max(r,0),n)}_getNarrowedViewportRect(){let n=this._document.documentElement.clientWidth,e=this._document.documentElement.clientHeight,i=this._viewportRuler.getViewportScrollPosition();return{top:i.top+this._getViewportMarginTop(),left:i.left+this._getViewportMarginStart(),right:i.left+n-this._getViewportMarginEnd(),bottom:i.top+e-this._getViewportMarginBottom(),width:n-this._getViewportMarginStart()-this._getViewportMarginEnd(),height:e-this._getViewportMarginTop()-this._getViewportMarginBottom()}}_isRtl(){return this._overlayRef.getDirection()==="rtl"}_hasExactPosition(){return!this._hasFlexibleDimensions||this._isPushed}_getOffset(n,e){return e==="x"?n.offsetX==null?this._offsetX:n.offsetX:n.offsetY==null?this._offsetY:n.offsetY}_validatePositions(){}_addPanelClasses(n){this._pane&&ds(n).forEach(e=>{e!==""&&this._appliedPanelClasses.indexOf(e)===-1&&(this._appliedPanelClasses.push(e),this._pane.classList.add(e))})}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(n=>{this._pane.classList.remove(n)}),this._appliedPanelClasses=[])}_getViewportMarginStart(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.start??0}_getViewportMarginEnd(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.end??0}_getViewportMarginTop(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.top??0}_getViewportMarginBottom(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.bottom??0}_getOriginRect(){let n=this._origin;if(n instanceof L)return n.nativeElement.getBoundingClientRect();if(n instanceof Element)return n.getBoundingClientRect();let e=n.width||0,i=n.height||0;return{top:n.y,bottom:n.y+i,left:n.x,right:n.x+e,height:i,width:e}}_getContainerRect(){let n=this._overlayRef.getConfig().usePopover&&this._popoverLocation!=="global",e=this._overlayContainer.getContainerElement();n&&(e.style.display="block");let i=e.getBoundingClientRect();return n&&(e.style.display=""),i}};function na(t,n){for(let e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);return t}function DE(t){if(typeof t!="number"&&t!=null){let[n,e]=t.split(LL);return!e||e==="px"?parseFloat(n):null}return t||null}function EE(t){return{top:Math.floor(t.top),right:Math.floor(t.right),bottom:Math.floor(t.bottom),left:Math.floor(t.left),width:Math.floor(t.width),height:Math.floor(t.height)}}function jL(t,n){return t===n?!0:t.isOriginClipped===n.isOriginClipped&&t.isOriginOutsideView===n.isOriginOutsideView&&t.isOverlayClipped===n.isOverlayClipped&&t.isOverlayOutsideView===n.isOverlayOutsideView}var ME="cdk-global-overlay-wrapper";function Rs(t){return new Vf}var Vf=class{_overlayRef;_cssPosition="static";_topOffset="";_bottomOffset="";_alignItems="";_xPosition="";_xOffset="";_width="";_height="";_isDisposed=!1;attach(n){let e=n.getConfig();this._overlayRef=n,this._width&&!e.width&&n.updateSize({width:this._width}),this._height&&!e.height&&n.updateSize({height:this._height}),n.hostElement.classList.add(ME),this._isDisposed=!1}top(n=""){return this._bottomOffset="",this._topOffset=n,this._alignItems="flex-start",this}left(n=""){return this._xOffset=n,this._xPosition="left",this}bottom(n=""){return this._topOffset="",this._bottomOffset=n,this._alignItems="flex-end",this}right(n=""){return this._xOffset=n,this._xPosition="right",this}start(n=""){return this._xOffset=n,this._xPosition="start",this}end(n=""){return this._xOffset=n,this._xPosition="end",this}width(n=""){return this._overlayRef?this._overlayRef.updateSize({width:n}):this._width=n,this}height(n=""){return this._overlayRef?this._overlayRef.updateSize({height:n}):this._height=n,this}centerHorizontally(n=""){return this.left(n),this._xPosition="center",this}centerVertically(n=""){return this.top(n),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let n=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement.style,i=this._overlayRef.getConfig(),{width:r,height:o,maxWidth:a,maxHeight:s}=i,l=(r==="100%"||r==="100vw")&&(!a||a==="100%"||a==="100vw"),d=(o==="100%"||o==="100vh")&&(!s||s==="100%"||s==="100vh"),u=this._xPosition,h=this._xOffset,_=this._overlayRef.getConfig().direction==="rtl",v="",S="",A="";l?A="flex-start":u==="center"?(A="center",_?S=h:v=h):_?u==="left"||u==="end"?(A="flex-end",v=h):(u==="right"||u==="start")&&(A="flex-start",S=h):u==="left"||u==="start"?(A="flex-start",v=h):(u==="right"||u==="end")&&(A="flex-end",S=h),n.position=this._cssPosition,n.marginLeft=l?"0":v,n.marginTop=d?"0":this._topOffset,n.marginBottom=this._bottomOffset,n.marginRight=l?"0":S,e.justifyContent=A,e.alignItems=d?"flex-start":this._alignItems}dispose(){if(this._isDisposed||!this._overlayRef)return;let n=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement,i=e.style;e.classList.remove(ME),i.justifyContent=i.alignItems=n.marginTop=n.marginBottom=n.marginLeft=n.marginRight=n.position="",this._overlayRef=null,this._isDisposed=!0}},OE=(()=>{class t{_injector=c(K);global(){return Rs()}flexibleConnectedTo(e){return ia(this._injector,e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),Xc=new C("OVERLAY_DEFAULT_CONFIG");function dr(t,n){t.get(tt).load(RE);let e=t.get(Bf),i=t.get(X),r=t.get($e),o=t.get(rn),a=t.get(wt),s=t.get(xe,null,{optional:!0})||t.get(It).createRenderer(null,null),l=new lr(n),d=t.get(Xc,null,{optional:!0})?.usePopover??!0;l.direction=l.direction||a.value,!i.body||!("showPopover"in i.body)?l.usePopover=!1:l.usePopover=n?.usePopover??d;let u=i.createElement("div"),h=i.createElement("div");u.id=r.getId("cdk-overlay-"),u.classList.add("cdk-overlay-pane"),h.appendChild(u),l.usePopover&&(h.setAttribute("popover","manual"),h.classList.add("cdk-overlay-popover"));let _=l.usePopover?l.positionStrategy?.getPopoverInsertionPoint?.():null;return lb(_)?_.after(h):_?.type==="parent"?_.element.appendChild(h):e.getContainerElement().appendChild(h),new Ts(new Ns(u,o,t),h,u,l,t.get($),t.get(kE),i,t.get(Pr),t.get(AE),n?.disableAnimations??t.get(xl,null,{optional:!0})==="NoopAnimations",t.get(qe),s)}var PE=(()=>{class t{scrollStrategies=c(NE);_positionBuilder=c(OE);_injector=c(K);create(e){return dr(this._injector,e)}position(){return this._positionBuilder}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})(),VL=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"}],BL=new C("cdk-connected-overlay-scroll-strategy",{providedIn:"root",factory:()=>{let t=c(K);return()=>cr(t)}}),ks=(()=>{class t{elementRef=c(L);static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdk-overlay-origin",""],["","overlay-origin",""],["","cdkOverlayOrigin",""]],exportAs:["cdkOverlayOrigin"]})}return t})(),FE=new C("cdk-connected-overlay-default-config"),Hf=(()=>{class t{_dir=c(wt,{optional:!0});_injector=c(K);_overlayRef;_templatePortal;_backdropSubscription=ue.EMPTY;_attachSubscription=ue.EMPTY;_detachSubscription=ue.EMPTY;_positionSubscription=ue.EMPTY;_offsetX;_offsetY;_position;_scrollStrategyFactory=c(BL);_ngZone=c($);origin;positions;positionStrategy;get offsetX(){return this._offsetX}set offsetX(e){this._offsetX=e,this._position&&this._updatePositionStrategy(this._position)}get offsetY(){return this._offsetY}set offsetY(e){this._offsetY=e,this._position&&this._updatePositionStrategy(this._position)}width;height;minWidth;minHeight;backdropClass;panelClass;viewportMargin=0;scrollStrategy;open=!1;disableClose=!1;transformOriginSelector;hasBackdrop=!1;lockPosition=!1;flexibleDimensions=!1;growAfterOpen=!1;push=!1;disposeOnNavigation=!1;usePopover;matchWidth=!1;set _config(e){typeof e!="string"&&this._assignConfig(e)}backdropClick=new O;positionChange=new O;attach=new O;detach=new O;overlayKeydown=new O;overlayOutsideClick=new O;constructor(){let e=c(bt),i=c(pt),r=c(FE,{optional:!0}),o=c(Xc,{optional:!0});this.usePopover=o?.usePopover===!1?null:"global",this._templatePortal=new cn(e,i),this.scrollStrategy=this._scrollStrategyFactory(),r&&this._assignConfig(r)}get overlayRef(){return this._overlayRef}get dir(){return this._dir?this._dir.value:"ltr"}ngOnDestroy(){this._attachSubscription.unsubscribe(),this._detachSubscription.unsubscribe(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this._overlayRef?.dispose()}ngOnChanges(e){this._position&&(this._updatePositionStrategy(this._position),this._overlayRef?.updateSize({width:this._getWidth(),minWidth:this.minWidth,height:this.height,minHeight:this.minHeight}),e.origin&&this.open&&this._position.apply()),e.open&&(this.open?this.attachOverlay():this.detachOverlay())}_createOverlay(){(!this.positions||!this.positions.length)&&(this.positions=VL);let e=this._overlayRef=dr(this._injector,this._buildConfig());this._attachSubscription=e.attachments().subscribe(()=>this.attach.emit()),this._detachSubscription=e.detachments().subscribe(()=>this.detach.emit()),e.keydownEvents().subscribe(i=>{this.overlayKeydown.next(i),i.keyCode===27&&!this.disableClose&&!mt(i)&&(i.preventDefault(),this.detachOverlay())}),this._overlayRef.outsidePointerEvents().subscribe(i=>{let r=this._getOriginElement(),o=$t(i);(!r||r!==o&&!r.contains(o))&&this.overlayOutsideClick.next(i)})}_buildConfig(){let e=this._position=this.positionStrategy||this._createPositionStrategy(),i=new lr({direction:this._dir||"ltr",positionStrategy:e,scrollStrategy:this.scrollStrategy,hasBackdrop:this.hasBackdrop,disposeOnNavigation:this.disposeOnNavigation,usePopover:!!this.usePopover});return(this.height||this.height===0)&&(i.height=this.height),(this.minWidth||this.minWidth===0)&&(i.minWidth=this.minWidth),(this.minHeight||this.minHeight===0)&&(i.minHeight=this.minHeight),this.backdropClass&&(i.backdropClass=this.backdropClass),this.panelClass&&(i.panelClass=this.panelClass),i}_updatePositionStrategy(e){let i=this.positions.map(r=>({originX:r.originX,originY:r.originY,overlayX:r.overlayX,overlayY:r.overlayY,offsetX:r.offsetX||this.offsetX,offsetY:r.offsetY||this.offsetY,panelClass:r.panelClass||void 0}));return e.setOrigin(this._getOrigin()).withPositions(i).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector).withPopoverLocation(this.usePopover===null?"global":this.usePopover)}_createPositionStrategy(){let e=ia(this._injector,this._getOrigin());return this._updatePositionStrategy(e),e}_getOrigin(){return this.origin instanceof ks?this.origin.elementRef:this.origin}_getOriginElement(){return this.origin instanceof ks?this.origin.elementRef.nativeElement:this.origin instanceof L?this.origin.nativeElement:typeof Element<"u"&&this.origin instanceof Element?this.origin:null}_getWidth(){return this.width?this.width:this.matchWidth?this._getOriginElement()?.getBoundingClientRect?.().width:void 0}attachOverlay(){this._overlayRef||this._createOverlay();let e=this._overlayRef;e.getConfig().hasBackdrop=this.hasBackdrop,e.updateSize({width:this._getWidth()}),e.hasAttached()||e.attach(this._templatePortal),this.hasBackdrop?this._backdropSubscription=e.backdropClick().subscribe(i=>this.backdropClick.emit(i)):this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.positionChange.observers.length>0&&(this._positionSubscription=this._position.positionChanges.pipe(Yh(()=>this.positionChange.observers.length>0)).subscribe(i=>{this._ngZone.run(()=>this.positionChange.emit(i)),this.positionChange.observers.length===0&&this._positionSubscription.unsubscribe()})),this.open=!0}detachOverlay(){this._overlayRef?.detach(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.open=!1}_assignConfig(e){this.origin=e.origin??this.origin,this.positions=e.positions??this.positions,this.positionStrategy=e.positionStrategy??this.positionStrategy,this.offsetX=e.offsetX??this.offsetX,this.offsetY=e.offsetY??this.offsetY,this.width=e.width??this.width,this.height=e.height??this.height,this.minWidth=e.minWidth??this.minWidth,this.minHeight=e.minHeight??this.minHeight,this.backdropClass=e.backdropClass??this.backdropClass,this.panelClass=e.panelClass??this.panelClass,this.viewportMargin=e.viewportMargin??this.viewportMargin,this.scrollStrategy=e.scrollStrategy??this.scrollStrategy,this.disableClose=e.disableClose??this.disableClose,this.transformOriginSelector=e.transformOriginSelector??this.transformOriginSelector,this.hasBackdrop=e.hasBackdrop??this.hasBackdrop,this.lockPosition=e.lockPosition??this.lockPosition,this.flexibleDimensions=e.flexibleDimensions??this.flexibleDimensions,this.growAfterOpen=e.growAfterOpen??this.growAfterOpen,this.push=e.push??this.push,this.disposeOnNavigation=e.disposeOnNavigation??this.disposeOnNavigation,this.usePopover=e.usePopover??this.usePopover,this.matchWidth=e.matchWidth??this.matchWidth}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","cdk-connected-overlay",""],["","connected-overlay",""],["","cdkConnectedOverlay",""]],inputs:{origin:[0,"cdkConnectedOverlayOrigin","origin"],positions:[0,"cdkConnectedOverlayPositions","positions"],positionStrategy:[0,"cdkConnectedOverlayPositionStrategy","positionStrategy"],offsetX:[0,"cdkConnectedOverlayOffsetX","offsetX"],offsetY:[0,"cdkConnectedOverlayOffsetY","offsetY"],width:[0,"cdkConnectedOverlayWidth","width"],height:[0,"cdkConnectedOverlayHeight","height"],minWidth:[0,"cdkConnectedOverlayMinWidth","minWidth"],minHeight:[0,"cdkConnectedOverlayMinHeight","minHeight"],backdropClass:[0,"cdkConnectedOverlayBackdropClass","backdropClass"],panelClass:[0,"cdkConnectedOverlayPanelClass","panelClass"],viewportMargin:[0,"cdkConnectedOverlayViewportMargin","viewportMargin"],scrollStrategy:[0,"cdkConnectedOverlayScrollStrategy","scrollStrategy"],open:[0,"cdkConnectedOverlayOpen","open"],disableClose:[0,"cdkConnectedOverlayDisableClose","disableClose"],transformOriginSelector:[0,"cdkConnectedOverlayTransformOriginOn","transformOriginSelector"],hasBackdrop:[2,"cdkConnectedOverlayHasBackdrop","hasBackdrop",Y],lockPosition:[2,"cdkConnectedOverlayLockPosition","lockPosition",Y],flexibleDimensions:[2,"cdkConnectedOverlayFlexibleDimensions","flexibleDimensions",Y],growAfterOpen:[2,"cdkConnectedOverlayGrowAfterOpen","growAfterOpen",Y],push:[2,"cdkConnectedOverlayPush","push",Y],disposeOnNavigation:[2,"cdkConnectedOverlayDisposeOnNavigation","disposeOnNavigation",Y],usePopover:[0,"cdkConnectedOverlayUsePopover","usePopover"],matchWidth:[2,"cdkConnectedOverlayMatchWidth","matchWidth",Y],_config:[0,"cdkConnectedOverlay","_config"]},outputs:{backdropClick:"backdropClick",positionChange:"positionChange",attach:"attach",detach:"detach",overlayKeydown:"overlayKeydown",overlayOutsideClick:"overlayOutsideClick"},exportAs:["cdkConnectedOverlay"],features:[Ne]})}return t})(),ui=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({providers:[PE],imports:[_e,sr,Hv,Hv]})}return t})();var HL=["tooltip"],UL=20;var zL=new C("mat-tooltip-scroll-strategy",{providedIn:"root",factory:()=>{let t=c(K);return()=>cr(t,{scrollThrottle:UL})}}),$L=new C("mat-tooltip-default-options",{providedIn:"root",factory:()=>({showDelay:0,hideDelay:0,touchendHideDelay:1500})});var LE="tooltip-panel",WL={passive:!0},GL=8,qL=8,YL=24,ZL=200,ur=(()=>{class t{_elementRef=c(L);_ngZone=c($);_platform=c(Ce);_ariaDescriber=c(hD);_focusMonitor=c(Ht);_dir=c(wt);_injector=c(K);_viewContainerRef=c(pt);_mediaMatcher=c(us);_document=c(X);_renderer=c(xe);_animationsDisabled=Re();_defaultOptions=c($L,{optional:!0});_overlayRef=null;_tooltipInstance=null;_overlayPanelClass;_portal;_position="below";_positionAtOrigin=!1;_disabled=!1;_tooltipClass;_viewInitialized=!1;_pointerExitEventsInitialized=!1;_tooltipComponent=jE;_viewportMargin=8;_currentPosition;_cssClassPrefix="mat-mdc";_ariaDescriptionPending=!1;_dirSubscribed=!1;get position(){return this._position}set position(e){e!==this._position&&(this._position=e,this._overlayRef&&(this._updatePosition(this._overlayRef),this._tooltipInstance?.show(0),this._overlayRef.updatePosition()))}get positionAtOrigin(){return this._positionAtOrigin}set positionAtOrigin(e){this._positionAtOrigin=lt(e),this._detach(),this._overlayRef=null}get disabled(){return this._disabled}set disabled(e){let i=lt(e);this._disabled!==i&&(this._disabled=i,i?this.hide(0):this._setupPointerEnterEventsIfNeeded(),this._syncAriaDescription(this.message))}get showDelay(){return this._showDelay}set showDelay(e){this._showDelay=Bt(e)}_showDelay;get hideDelay(){return this._hideDelay}set hideDelay(e){this._hideDelay=Bt(e),this._tooltipInstance&&(this._tooltipInstance._mouseLeaveHideDelay=this._hideDelay)}_hideDelay;touchGestures="auto";get message(){return this._message}set message(e){let i=this._message;this._message=e!=null?String(e).trim():"",!this._message&&this._isTooltipVisible()?this.hide(0):(this._setupPointerEnterEventsIfNeeded(),this._updateTooltipMessage()),this._syncAriaDescription(i)}_message="";get tooltipClass(){return this._tooltipClass}set tooltipClass(e){this._tooltipClass=e,this._tooltipInstance&&this._setTooltipClass(this._tooltipClass)}_eventCleanups=[];_touchstartTimeout=null;_destroyed=new I;_isDestroyed=!1;constructor(){let e=this._defaultOptions;e&&(this._showDelay=e.showDelay,this._hideDelay=e.hideDelay,e.position&&(this.position=e.position),e.positionAtOrigin&&(this.positionAtOrigin=e.positionAtOrigin),e.touchGestures&&(this.touchGestures=e.touchGestures),e.tooltipClass&&(this.tooltipClass=e.tooltipClass)),this._viewportMargin=GL}ngAfterViewInit(){this._viewInitialized=!0,this._setupPointerEnterEventsIfNeeded(),this._focusMonitor.monitor(this._elementRef).pipe(pe(this._destroyed)).subscribe(e=>{e?e==="keyboard"&&this._ngZone.run(()=>this.show()):this._ngZone.run(()=>this.hide(0))})}ngOnDestroy(){let e=this._elementRef.nativeElement;this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this._overlayRef&&(this._overlayRef.dispose(),this._tooltipInstance=null),this._eventCleanups.forEach(i=>i()),this._eventCleanups.length=0,this._destroyed.next(),this._destroyed.complete(),this._isDestroyed=!0,this._ariaDescriber.removeDescription(e,this.message,"tooltip"),this._focusMonitor.stopMonitoring(e)}show(e=this.showDelay,i){if(this.disabled||!this.message||this._isTooltipVisible()){this._tooltipInstance?._cancelPendingAnimations();return}let r=this._createOverlay(i);this._detach(),this._portal=this._portal||new qr(this._tooltipComponent,this._viewContainerRef);let o=this._tooltipInstance=r.attach(this._portal).instance;o._triggerElement=this._elementRef.nativeElement,o._mouseLeaveHideDelay=this._hideDelay,o.afterHidden().pipe(pe(this._destroyed)).subscribe(()=>this._detach()),this._setTooltipClass(this._tooltipClass),this._updateTooltipMessage(),o.show(e)}hide(e=this.hideDelay){let i=this._tooltipInstance;i&&(i.isVisible()?i.hide(e):(i._cancelPendingAnimations(),this._detach()))}toggle(e){this._isTooltipVisible()?this.hide():this.show(void 0,e)}_isTooltipVisible(){return!!this._tooltipInstance&&this._tooltipInstance.isVisible()}_createOverlay(e){if(this._overlayRef){let a=this._overlayRef.getConfig().positionStrategy;if((!this.positionAtOrigin||!e)&&a._origin instanceof L)return this._overlayRef;this._detach()}let i=this._injector.get(Ur).getAncestorScrollContainers(this._elementRef),r=`${this._cssClassPrefix}-${LE}`,o=ia(this._injector,this.positionAtOrigin?e||this._elementRef:this._elementRef).withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`).withFlexibleDimensions(!1).withViewportMargin(this._viewportMargin).withScrollableContainers(i).withPopoverLocation("global");return o.positionChanges.pipe(pe(this._destroyed)).subscribe(a=>{this._updateCurrentPositionClass(a.connectionPair),this._tooltipInstance&&a.scrollableViewProperties.isOverlayClipped&&this._tooltipInstance.isVisible()&&this._ngZone.run(()=>this.hide(0))}),this._overlayRef=dr(this._injector,{direction:this._dir,positionStrategy:o,panelClass:this._overlayPanelClass?[...this._overlayPanelClass,r]:r,scrollStrategy:this._injector.get(zL)(),disableAnimations:this._animationsDisabled,eventPredicate:this._overlayEventPredicate}),this._updatePosition(this._overlayRef),this._overlayRef.detachments().pipe(pe(this._destroyed)).subscribe(()=>this._detach()),this._overlayRef.outsidePointerEvents().pipe(pe(this._destroyed)).subscribe(()=>this._tooltipInstance?._handleBodyInteraction()),this._overlayRef.keydownEvents().pipe(pe(this._destroyed)).subscribe(a=>{a.preventDefault(),a.stopPropagation(),this._ngZone.run(()=>this.hide(0))}),this._defaultOptions?.disableTooltipInteractivity&&this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`),this._dirSubscribed||(this._dirSubscribed=!0,this._dir.change.pipe(pe(this._destroyed)).subscribe(()=>{this._overlayRef&&this._updatePosition(this._overlayRef)})),this._overlayRef}_detach(){this._overlayRef&&this._overlayRef.hasAttached()&&this._overlayRef.detach(),this._tooltipInstance=null}_updatePosition(e){let i=e.getConfig().positionStrategy,r=this._getOrigin(),o=this._getOverlayPosition();i.withPositions([this._addOffset(y(y({},r.main),o.main)),this._addOffset(y(y({},r.fallback),o.fallback))])}_addOffset(e){let i=qL,r=!this._dir||this._dir.value=="ltr";return e.originY==="top"?e.offsetY=-i:e.originY==="bottom"?e.offsetY=i:e.originX==="start"?e.offsetX=r?-i:i:e.originX==="end"&&(e.offsetX=r?i:-i),e}_getOrigin(){let e=!this._dir||this._dir.value=="ltr",i=this.position,r;i=="above"||i=="below"?r={originX:"center",originY:i=="above"?"top":"bottom"}:i=="before"||i=="left"&&e||i=="right"&&!e?r={originX:"start",originY:"center"}:(i=="after"||i=="right"&&e||i=="left"&&!e)&&(r={originX:"end",originY:"center"});let{x:o,y:a}=this._invertPosition(r.originX,r.originY);return{main:r,fallback:{originX:o,originY:a}}}_getOverlayPosition(){let e=!this._dir||this._dir.value=="ltr",i=this.position,r;i=="above"?r={overlayX:"center",overlayY:"bottom"}:i=="below"?r={overlayX:"center",overlayY:"top"}:i=="before"||i=="left"&&e||i=="right"&&!e?r={overlayX:"end",overlayY:"center"}:(i=="after"||i=="right"&&e||i=="left"&&!e)&&(r={overlayX:"start",overlayY:"center"});let{x:o,y:a}=this._invertPosition(r.overlayX,r.overlayY);return{main:r,fallback:{overlayX:o,overlayY:a}}}_updateTooltipMessage(){this._tooltipInstance&&(this._tooltipInstance.message=this.message,this._tooltipInstance._markForCheck(),ct(()=>{this._tooltipInstance&&this._overlayRef.updatePosition()},{injector:this._injector}))}_setTooltipClass(e){this._tooltipInstance&&(this._tooltipInstance.tooltipClass=e instanceof Set?Array.from(e):e,this._tooltipInstance._markForCheck())}_invertPosition(e,i){return this.position==="above"||this.position==="below"?i==="top"?i="bottom":i==="bottom"&&(i="top"):e==="end"?e="start":e==="start"&&(e="end"),{x:e,y:i}}_updateCurrentPositionClass(e){let{overlayY:i,originX:r,originY:o}=e,a;if(i==="center"?this._dir&&this._dir.value==="rtl"?a=r==="end"?"left":"right":a=r==="start"?"left":"right":a=i==="bottom"&&o==="top"?"above":"below",a!==this._currentPosition){let s=this._overlayRef;if(s){let l=`${this._cssClassPrefix}-${LE}-`;s.removePanelClass(l+this._currentPosition),s.addPanelClass(l+a)}this._currentPosition=a}}_setupPointerEnterEventsIfNeeded(){this._disabled||!this.message||!this._viewInitialized||this._eventCleanups.length||(this._isTouchPlatform()?this.touchGestures!=="off"&&(this._disableNativeGesturesIfNecessary(),this._addListener("touchstart",e=>{let i=e.targetTouches?.[0],r=i?{x:i.clientX,y:i.clientY}:void 0;this._setupPointerExitEventsIfNeeded(),this._touchstartTimeout&&clearTimeout(this._touchstartTimeout);let o=500;this._touchstartTimeout=setTimeout(()=>{this._touchstartTimeout=null,this.show(void 0,r)},this._defaultOptions?.touchLongPressShowDelay??o)})):this._addListener("mouseenter",e=>{this._setupPointerExitEventsIfNeeded();let i;e.x!==void 0&&e.y!==void 0&&(i=e),this.show(void 0,i)}))}_setupPointerExitEventsIfNeeded(){if(!this._pointerExitEventsInitialized){if(this._pointerExitEventsInitialized=!0,!this._isTouchPlatform())this._addListener("mouseleave",e=>{let i=e.relatedTarget;(!i||!this._overlayRef?.overlayElement.contains(i))&&this.hide()}),this._addListener("wheel",e=>{if(this._isTooltipVisible()){let i=this._document.elementFromPoint(e.clientX,e.clientY),r=this._elementRef.nativeElement;i!==r&&!r.contains(i)&&this.hide()}});else if(this.touchGestures!=="off"){this._disableNativeGesturesIfNecessary();let e=()=>{this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this.hide(this._defaultOptions?.touchendHideDelay)};this._addListener("touchend",e),this._addListener("touchcancel",e)}}}_addListener(e,i){this._eventCleanups.push(this._renderer.listen(this._elementRef.nativeElement,e,i,WL))}_isTouchPlatform(){let e=this._defaultOptions?.detectHoverCapability;return typeof e=="function"?!e():this._platform.IOS||this._platform.ANDROID?!0:this._platform.isBrowser?!!e&&this._mediaMatcher.matchMedia("(any-hover: none)").matches:!1}_disableNativeGesturesIfNecessary(){let e=this.touchGestures;if(e!=="off"){let i=this._elementRef.nativeElement,r=i.style;(e==="on"||i.nodeName!=="INPUT"&&i.nodeName!=="TEXTAREA")&&(r.userSelect=r.msUserSelect=r.webkitUserSelect=r.MozUserSelect="none"),(e==="on"||!i.draggable)&&(r.webkitUserDrag="none"),r.touchAction="none",r.webkitTapHighlightColor="transparent"}}_syncAriaDescription(e){this._ariaDescriptionPending||(this._ariaDescriptionPending=!0,this._ariaDescriber.removeDescription(this._elementRef.nativeElement,e,"tooltip"),this._isDestroyed||ct({write:()=>{this._ariaDescriptionPending=!1,this.message&&!this.disabled&&this._ariaDescriber.describe(this._elementRef.nativeElement,this.message,"tooltip")}},{injector:this._injector}))}_overlayEventPredicate=e=>e.type==="keydown"?this._isTooltipVisible()&&e.keyCode===27&&!mt(e):!0;static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","matTooltip",""]],hostAttrs:[1,"mat-mdc-tooltip-trigger"],hostVars:2,hostBindings:function(i,r){i&2&&N("mat-mdc-tooltip-disabled",r.disabled)},inputs:{position:[0,"matTooltipPosition","position"],positionAtOrigin:[0,"matTooltipPositionAtOrigin","positionAtOrigin"],disabled:[0,"matTooltipDisabled","disabled"],showDelay:[0,"matTooltipShowDelay","showDelay"],hideDelay:[0,"matTooltipHideDelay","hideDelay"],touchGestures:[0,"matTooltipTouchGestures","touchGestures"],message:[0,"matTooltip","message"],tooltipClass:[0,"matTooltipClass","tooltipClass"]},exportAs:["matTooltip"]})}return t})(),jE=(()=>{class t{_changeDetectorRef=c(Me);_elementRef=c(L);_isMultiline=!1;message;tooltipClass;_showTimeoutId;_hideTimeoutId;_triggerElement;_mouseLeaveHideDelay;_animationsDisabled=Re();_tooltip;_closeOnInteraction=!1;_isVisible=!1;_onHide=new I;_showAnimation="mat-mdc-tooltip-show";_hideAnimation="mat-mdc-tooltip-hide";show(e){this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=setTimeout(()=>{this._toggleVisibility(!0),this._showTimeoutId=void 0},e)}hide(e){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId=setTimeout(()=>{this._toggleVisibility(!1),this._hideTimeoutId=void 0},e)}afterHidden(){return this._onHide}isVisible(){return this._isVisible}ngOnDestroy(){this._cancelPendingAnimations(),this._onHide.complete(),this._triggerElement=null}_handleBodyInteraction(){this._closeOnInteraction&&this.hide(0)}_markForCheck(){this._changeDetectorRef.markForCheck()}_handleMouseLeave({relatedTarget:e}){(!e||!this._triggerElement.contains(e))&&(this.isVisible()?this.hide(this._mouseLeaveHideDelay):this._finalizeAnimation(!1))}_onShow(){this._isMultiline=this._isTooltipMultiline(),this._markForCheck()}_isTooltipMultiline(){let e=this._elementRef.nativeElement.getBoundingClientRect();return e.height>YL&&e.width>=ZL}_handleAnimationEnd({animationName:e}){(e===this._showAnimation||e===this._hideAnimation)&&this._finalizeAnimation(e===this._showAnimation)}_cancelPendingAnimations(){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=this._hideTimeoutId=void 0}_finalizeAnimation(e){e?this._closeOnInteraction=!0:this.isVisible()||this._onHide.next()}_toggleVisibility(e){let i=this._tooltip.nativeElement,r=this._showAnimation,o=this._hideAnimation;if(i.classList.remove(e?o:r),i.classList.add(e?r:o),this._isVisible!==e&&(this._isVisible=e,this._changeDetectorRef.markForCheck()),e&&!this._animationsDisabled&&typeof getComputedStyle=="function"){let a=getComputedStyle(i);(a.getPropertyValue("animation-duration")==="0s"||a.getPropertyValue("animation-name")==="none")&&(this._animationsDisabled=!0)}e&&this._onShow(),this._animationsDisabled&&(i.classList.add("_mat-animation-noopable"),this._finalizeAnimation(e))}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-tooltip-component"]],viewQuery:function(i,r){if(i&1&&Te(HL,7),i&2){let o;U(o=z())&&(r._tooltip=o.first)}},hostAttrs:["aria-hidden","true"],hostBindings:function(i,r){i&1&&w("mouseleave",function(a){return r._handleMouseLeave(a)})},decls:4,vars:5,consts:[["tooltip",""],[1,"mdc-tooltip","mat-mdc-tooltip",3,"animationend"],[1,"mat-mdc-tooltip-surface","mdc-tooltip__surface"]],template:function(i,r){i&1&&(Ve(0,"div",1,0),$a("animationend",function(a){return r._handleAnimationEnd(a)}),Ve(2,"div",2),g(3),Xe()()),i&2&&(et(r.tooltipClass),N("mdc-tooltip--multiline",r._isMultiline),p(3),k(r.message))},styles:[`.mat-mdc-tooltip {
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
`],encapsulation:2})}return t})();var Yr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[Ec,ui,_e,Vn]})}return t})();function QL(t,n){}var Zr=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;positionStrategy;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;scrollStrategy;closeOnNavigation=!0;closeOnDestroy=!0;closeOnOverlayDetachments=!0;disableAnimations=!1;providers;container;templateContext;bindings};var db=(()=>{class t extends Is{_elementRef=c(L);_focusTrapFactory=c(Dc);_config;_interactivityChecker=c(gs);_ngZone=c($);_focusMonitor=c(Ht);_renderer=c(xe);_changeDetectorRef=c(Me);_injector=c(K);_platform=c(Ce);_document=c(X);_portalOutlet;_focusTrapped=new I;_focusTrap=null;_elementFocusedBeforeDialogWasOpened=null;_closeInteractionType=null;_ariaLabelledByQueue=[];_isDestroyed=!1;constructor(){super(),this._config=c(Zr,{optional:!0})||new Zr,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(e){this._ariaLabelledByQueue.push(e),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(e){let i=this._ariaLabelledByQueue.indexOf(e);i>-1&&(this._ariaLabelledByQueue.splice(i,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._focusTrapped.complete(),this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(e){this._portalOutlet.hasAttached();let i=this._portalOutlet.attachComponentPortal(e);return this._contentAttached(),i}attachTemplatePortal(e){this._portalOutlet.hasAttached();let i=this._portalOutlet.attachTemplatePortal(e);return this._contentAttached(),i}attachDomPortal=e=>{this._portalOutlet.hasAttached();let i=this._portalOutlet.attachDomPortal(e);return this._contentAttached(),i};_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(e,i){this._interactivityChecker.isFocusable(e)||(e.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let r=()=>{o(),a(),e.removeAttribute("tabindex")},o=this._renderer.listen(e,"blur",r),a=this._renderer.listen(e,"mousedown",r)})),e.focus(i)}_focusByCssSelector(e,i){let r=this._elementRef.nativeElement.querySelector(e);r&&this._forceFocus(r,i)}_trapFocus(e){this._isDestroyed||ct(()=>{let i=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case"dialog":this._containsFocus()||i.focus(e);break;case!0:case"first-tabbable":this._focusTrap?.focusInitialElement(e)||this._focusDialogContainer(e);break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]',e);break;default:this._focusByCssSelector(this._config.autoFocus,e);break}this._focusTrapped.next()},{injector:this._injector})}_restoreFocus(){let e=this._config.restoreFocus,i=null;if(typeof e=="string"?i=this._document.querySelector(e):typeof e=="boolean"?i=e?this._elementFocusedBeforeDialogWasOpened:null:e&&(i=e),this._config.restoreFocus&&i&&typeof i.focus=="function"){let r=ms(),o=this._elementRef.nativeElement;(!r||r===this._document.body||r===o||o.contains(r))&&(this._focusMonitor?(this._focusMonitor.focusVia(i,this._closeInteractionType),this._closeInteractionType=null):i.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(e){this._elementRef.nativeElement.focus?.(e)}_containsFocus(){let e=this._elementRef.nativeElement,i=ms();return e===i||e.contains(i)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=ms()))}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["cdk-dialog-container"]],viewQuery:function(i,r){if(i&1&&Te(ki,7),i&2){let o;U(o=z())&&(r._portalOutlet=o.first)}},hostAttrs:["tabindex","-1",1,"cdk-dialog-container"],hostVars:6,hostBindings:function(i,r){i&2&&j("id",r._config.id||null)("role",r._config.role)("aria-modal",r._config.ariaModal)("aria-labelledby",r._config.ariaLabel?null:r._ariaLabelledByQueue[0])("aria-label",r._config.ariaLabel)("aria-describedby",r._config.ariaDescribedBy||null)},features:[ge],decls:1,vars:0,consts:[["cdkPortalOutlet",""]],template:function(i,r){i&1&&yt(0,QL,0,0,"ng-template",0)},dependencies:[ki],styles:[`.cdk-dialog-container {
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
`],encapsulation:2,changeDetection:1})}return t})(),ra=class{overlayRef;config;componentInstance=null;componentRef=null;containerInstance;disableClose;closed=new I;backdropClick;keydownEvents;outsidePointerEvents;id;_detachSubscription;constructor(n,e){this.overlayRef=n,this.config=e,this.disableClose=e.disableClose,this.backdropClick=n.backdropClick(),this.keydownEvents=n.keydownEvents(),this.outsidePointerEvents=n.outsidePointerEvents(),this.id=e.id,this.keydownEvents.subscribe(i=>{i.keyCode===27&&!this.disableClose&&!mt(i)&&(i.preventDefault(),this.close(void 0,{focusOrigin:"keyboard"}))}),this.backdropClick.subscribe(()=>{!this.disableClose&&this._canClose()?this.close(void 0,{focusOrigin:"mouse"}):this.containerInstance._recaptureFocus?.()}),this._detachSubscription=n.detachments().subscribe(()=>{e.closeOnOverlayDetachments!==!1&&this.close()})}close(n,e){if(this._canClose(n)){let i=this.closed;this.containerInstance._closeInteractionType=e?.focusOrigin||"program",this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),i.next(n),i.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(n="",e=""){return this.overlayRef.updateSize({width:n,height:e}),this}addPanelClass(n){return this.overlayRef.addPanelClass(n),this}removePanelClass(n){return this.overlayRef.removePanelClass(n),this}_canClose(n){let e=this.config;return!!this.containerInstance&&(!e.closePredicate||e.closePredicate(n,e,this.componentInstance))}},XL=new C("DialogScrollStrategy",{providedIn:"root",factory:()=>{let t=c(K);return()=>As(t)}}),KL=new C("DialogData"),JL=new C("DefaultDialogConfig");function e2(t){let n=T(t),e=new O;return{valueSignal:n,get value(){return n()},change:e,ngOnDestroy(){e.complete()}}}var ub=(()=>{class t{_injector=c(K);_defaultOptions=c(JL,{optional:!0});_parentDialog=c(t,{optional:!0,skipSelf:!0});_overlayContainer=c(Bf);_idGenerator=c($e);_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new I;_afterOpenedAtThisLevel=new I;_ariaHiddenElements=new Map;_scrollStrategy=c(XL);get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}afterAllClosed=Yn(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(Ze(void 0)));open(e,i){let r=this._defaultOptions||new Zr;i=y(y({},r),i),i.id=i.id||this._idGenerator.getId("cdk-dialog-"),i.id&&this.getDialogById(i.id);let o=this._getOverlayConfig(i),a=dr(this._injector,o),s=new ra(a,i),l=this._attachContainer(a,s,i);if(s.containerInstance=l,!this.openDialogs.length){let d=this._overlayContainer.getContainerElement();l._focusTrapped?l._focusTrapped.pipe(je(1)).subscribe(()=>{this._hideNonDialogContentFromAssistiveTechnology(d)}):this._hideNonDialogContentFromAssistiveTechnology(d)}return this._attachDialogContent(e,s,l,i),this.openDialogs.push(s),s.closed.subscribe(()=>this._removeOpenDialog(s,!0)),this.afterOpened.next(s),s}closeAll(){cb(this.openDialogs,e=>e.close())}getDialogById(e){return this.openDialogs.find(i=>i.id===e)}ngOnDestroy(){cb(this._openDialogsAtThisLevel,e=>{e.config.closeOnDestroy===!1&&this._removeOpenDialog(e,!1)}),cb(this._openDialogsAtThisLevel,e=>e.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(e){let i=new lr({positionStrategy:e.positionStrategy||Rs().centerHorizontally().centerVertically(),scrollStrategy:e.scrollStrategy||this._scrollStrategy(),panelClass:e.panelClass,hasBackdrop:e.hasBackdrop,direction:e.direction,minWidth:e.minWidth,minHeight:e.minHeight,maxWidth:e.maxWidth,maxHeight:e.maxHeight,width:e.width,height:e.height,disposeOnNavigation:e.closeOnNavigation,disableAnimations:e.disableAnimations});return e.backdropClass&&(i.backdropClass=e.backdropClass),i}_attachContainer(e,i,r){let o=r.injector||r.viewContainerRef?.injector,a=[{provide:Zr,useValue:r},{provide:ra,useValue:i},{provide:Ts,useValue:e}],s;r.container?typeof r.container=="function"?s=r.container:(s=r.container.type,a.push(...r.container.providers(r))):s=db;let l=new qr(s,r.viewContainerRef,K.create({parent:o||this._injector,providers:a}));return e.attach(l).instance}_attachDialogContent(e,i,r,o){if(e instanceof bt){let a=this._createInjector(o,i,r,void 0),s={$implicit:o.data,dialogRef:i};o.templateContext&&(s=y(y({},s),typeof o.templateContext=="function"?o.templateContext():o.templateContext)),r.attachTemplatePortal(new cn(e,null,s,a))}else{let a=this._createInjector(o,i,r,this._injector),s=r.attachComponentPortal(new qr(e,o.viewContainerRef,a,null,o.bindings));i.componentRef=s,i.componentInstance=s.instance}}_createInjector(e,i,r,o){let a=e.injector||e.viewContainerRef?.injector,s=[{provide:KL,useValue:e.data},{provide:ra,useValue:i}];return e.providers&&(typeof e.providers=="function"?s.push(...e.providers(i,e,r)):s.push(...e.providers)),e.direction&&(!a||!a.get(wt,null,{optional:!0}))&&s.push({provide:wt,useValue:e2(e.direction)}),K.create({parent:a||o,providers:s})}_removeOpenDialog(e,i){let r=this.openDialogs.indexOf(e);r>-1&&(this.openDialogs.splice(r,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((o,a)=>{o?a.setAttribute("aria-hidden",o):a.removeAttribute("aria-hidden")}),this._ariaHiddenElements.clear(),i&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(e){if(e.parentElement){let i=e.parentElement.children;for(let r=i.length-1;r>-1;r--){let o=i[r];o!==e&&o.nodeName!=="SCRIPT"&&o.nodeName!=="STYLE"&&!o.hasAttribute("aria-live")&&!o.hasAttribute("popover")&&(this._ariaHiddenElements.set(o,o.getAttribute("aria-hidden")),o.setAttribute("aria-hidden","true"))}}}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();function cb(t,n){let e=t.length;for(;e--;)n(t[e])}var VE=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({providers:[ub],imports:[ui,sr,Ec,sr]})}return t})();function t2(t,n){}var $f=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;position;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;delayFocusTrap=!0;scrollStrategy;closeOnNavigation=!0;enterAnimationDuration;exitAnimationDuration;bindings},mb="mdc-dialog--open",BE="mdc-dialog--opening",HE="mdc-dialog--closing",n2=150,i2=75,r2=(()=>{class t extends db{_animationStateChanged=new O;_animationsEnabled=!Re();_actionSectionCount=0;_hostElement=this._elementRef.nativeElement;_enterAnimationDuration=this._animationsEnabled?zE(this._config.enterAnimationDuration)??n2:0;_exitAnimationDuration=this._animationsEnabled?zE(this._config.exitAnimationDuration)??i2:0;_animationTimer=null;_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:"opening",totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(UE,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(BE,mb)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add(mb),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:"closing",totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove(mb),this._animationsEnabled?(this._hostElement.style.setProperty(UE,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(HE)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(e){this._actionSectionCount+=e,this._changeDetectorRef.markForCheck()}_finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)};_finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:"closed",totalTime:this._exitAnimationDuration})};_clearAnimationClasses(){this._hostElement.classList.remove(BE,HE)}_waitForAnimationToComplete(e,i){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(i,e)}_requestAnimationFrame(e){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(e):e()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(e){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:"opened",totalTime:e})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(e){let i=super.attachComponentPortal(e);return i.location.nativeElement.classList.add("mat-mdc-dialog-component-host"),i}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275cmp=x({type:t,selectors:[["mat-dialog-container"]],hostAttrs:["tabindex","-1",1,"mat-mdc-dialog-container","mdc-dialog"],hostVars:10,hostBindings:function(i,r){i&2&&(Gt("id",r._config.id),j("aria-modal",r._config.ariaModal)("role",r._config.role)("aria-labelledby",r._config.ariaLabel?null:r._ariaLabelledByQueue[0])("aria-label",r._config.ariaLabel)("aria-describedby",r._config.ariaDescribedBy||null),N("_mat-animation-noopable",!r._animationsEnabled)("mat-mdc-dialog-container-with-actions",r._actionSectionCount>0))},features:[ge],decls:3,vars:0,consts:[[1,"mat-mdc-dialog-inner-container","mdc-dialog__container"],[1,"mat-mdc-dialog-surface","mdc-dialog__surface"],["cdkPortalOutlet",""]],template:function(i,r){i&1&&(m(0,"div",0)(1,"div",1),yt(2,t2,0,0,"ng-template",2),f()())},dependencies:[ki],styles:[`.mat-mdc-dialog-container {
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
`],encapsulation:2,changeDetection:1})}return t})(),UE="--mat-dialog-transition-duration";function zE(t){return t==null?null:typeof t=="number"?t:t.endsWith("ms")?Bt(t.substring(0,t.length-2)):t.endsWith("s")?Bt(t.substring(0,t.length-1))*1e3:t==="0"?0:null}var zf=(function(t){return t[t.OPEN=0]="OPEN",t[t.CLOSING=1]="CLOSING",t[t.CLOSED=2]="CLOSED",t})(zf||{}),Zt=class{_ref;_config;_containerInstance;componentInstance;componentRef=null;disableClose;id;_afterOpened=new ji(1);_beforeClosed=new ji(1);_result;_closeFallbackTimeout;_state=zf.OPEN;_closeInteractionType;constructor(n,e,i){this._ref=n,this._config=e,this._containerInstance=i,this.disableClose=e.disableClose,this.id=n.id,n.addPanelClass("mat-mdc-dialog-panel"),i._animationStateChanged.pipe(me(r=>r.state==="opened"),je(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),i._animationStateChanged.pipe(me(r=>r.state==="closed"),je(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),n.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),ft(this.backdropClick(),this.keydownEvents().pipe(me(r=>r.keyCode===27&&!this.disableClose&&!mt(r)))).subscribe(r=>{this.disableClose||(r.preventDefault(),o2(this,r.type==="keydown"?"keyboard":"mouse"))})}close(n){let e=this._config.closePredicate;e&&!e(n,this._config,this.componentInstance)||(this._result=n,this._containerInstance._animationStateChanged.pipe(me(i=>i.state==="closing"),je(1)).subscribe(i=>{this._beforeClosed.next(n),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),i.totalTime+100)}),this._state=zf.CLOSING,this._containerInstance._startExitAnimation())}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(n){let e=this._ref.config.positionStrategy;return n&&(n.left||n.right)?n.left?e.left(n.left):e.right(n.right):e.centerHorizontally(),n&&(n.top||n.bottom)?n.top?e.top(n.top):e.bottom(n.bottom):e.centerVertically(),this._ref.updatePosition(),this}updateSize(n="",e=""){return this._ref.updateSize(n,e),this}addPanelClass(n){return this._ref.addPanelClass(n),this}removePanelClass(n){return this._ref.removePanelClass(n),this}getState(){return this._state}_finishDialogClose(){this._state=zf.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function o2(t,n,e){return t._closeInteractionType=n,t.close(e)}var Nn=new C("MatMdcDialogData"),a2=new C("mat-mdc-dialog-default-options"),s2=new C("mat-mdc-dialog-scroll-strategy",{providedIn:"root",factory:()=>{let t=c(K);return()=>As(t)}}),Ai=(()=>{class t{_defaultOptions=c(a2,{optional:!0});_scrollStrategy=c(s2);_parentDialog=c(t,{optional:!0,skipSelf:!0});_idGenerator=c($e);_injector=c(K);_dialog=c(ub);_animationsDisabled=Re();_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new I;_afterOpenedAtThisLevel=new I;dialogConfigClass=$f;_dialogRefConstructor;_dialogContainerType;_dialogDataToken;get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let e=this._parentDialog;return e?e._getAfterAllClosed():this._afterAllClosedAtThisLevel}afterAllClosed=Yn(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(Ze(void 0)));constructor(){this._dialogRefConstructor=Zt,this._dialogContainerType=r2,this._dialogDataToken=Nn}open(e,i){let r;i=y(y({},this._defaultOptions||new $f),i),i.id=i.id||this._idGenerator.getId("mat-mdc-dialog-"),i.scrollStrategy=i.scrollStrategy||this._scrollStrategy();let o=this._dialog.open(e,J(y({},i),{positionStrategy:Rs(this._injector).centerHorizontally().centerVertically(),disableClose:!0,closePredicate:void 0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,disableAnimations:this._animationsDisabled||i.enterAnimationDuration?.toLocaleString()==="0"||i.exitAnimationDuration?.toString()==="0",container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:i},{provide:Zr,useValue:i}]},templateContext:()=>({dialogRef:r}),providers:(a,s,l)=>(r=new this._dialogRefConstructor(a,i,l),r.updatePosition(i?.position),[{provide:this._dialogContainerType,useValue:l},{provide:this._dialogDataToken,useValue:s.data},{provide:this._dialogRefConstructor,useValue:r},{provide:ra,useValue:null}])}));return r.componentRef=o.componentRef,r.componentInstance=o.componentInstance,this.openDialogs.push(r),this.afterOpened.next(r),r.afterClosed().subscribe(()=>{let a=this.openDialogs.indexOf(r);a>-1&&(this.openDialogs.splice(a,1),this.openDialogs.length||this._getAfterAllClosed().next())}),r}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(e){return this.openDialogs.find(i=>i.id===e)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(e){let i=e.length;for(;i--;)e[i].close()}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var $E=(()=>{class t{_dialogRef=c(Zt,{optional:!0});_elementRef=c(L);_dialog=c(Ai);ngOnInit(){this._dialogRef||(this._dialogRef=l2(this._elementRef,this._dialog.openDialogs)),this._dialogRef&&Promise.resolve().then(()=>{this._onAdd()})}ngOnDestroy(){this._dialogRef?._containerInstance&&Promise.resolve().then(()=>{this._onRemove()})}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t})}return t})(),Hn=(()=>{class t extends $E{id=c($e).getId("mat-mdc-dialog-title-");_onAdd(){this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id)}_onRemove(){this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id)}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","mat-dialog-title",""],["","matDialogTitle",""]],hostAttrs:[1,"mat-mdc-dialog-title","mdc-dialog__title"],hostVars:1,hostBindings:function(i,r){i&2&&Gt("id",r.id)},inputs:{id:"id"},exportAs:["matDialogTitle"],features:[ge]})}return t})(),Un=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","mat-dialog-content",""],["mat-dialog-content"],["","matDialogContent",""]],hostAttrs:[1,"mat-mdc-dialog-content","mdc-dialog__content"],features:[w_([ci])]})}return t})(),zn=(()=>{class t extends $E{align;_onAdd(){this._dialogRef._containerInstance?._updateActionSectionCount?.(1)}_onRemove(){this._dialogRef._containerInstance?._updateActionSectionCount?.(-1)}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","mat-dialog-actions",""],["mat-dialog-actions"],["","matDialogActions",""]],hostAttrs:[1,"mat-mdc-dialog-actions","mdc-dialog__actions"],hostVars:6,hostBindings:function(i,r){i&2&&N("mat-mdc-dialog-actions-align-start",r.align==="start")("mat-mdc-dialog-actions-align-center",r.align==="center")("mat-mdc-dialog-actions-align-end",r.align==="end")},inputs:{align:"align"},features:[ge]})}return t})();function l2(t,n){let e=t.nativeElement.parentElement;for(;e&&!e.classList.contains("mat-mdc-dialog-container");)e=e.parentElement;return e?n.find(i=>i.id===e.id):null}var Tt=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({providers:[Ai],imports:[VE,ui,sr,_e]})}return t})();var c2=["*"];var d2=[[["","mat-card-avatar",""],["","matCardAvatar",""]],[["mat-card-title"],["mat-card-subtitle"],["","mat-card-title",""],["","mat-card-subtitle",""],["","matCardTitle",""],["","matCardSubtitle",""]],"*"],u2=["[mat-card-avatar], [matCardAvatar]",`mat-card-title, mat-card-subtitle,
      [mat-card-title], [mat-card-subtitle],
      [matCardTitle], [matCardSubtitle]`,"*"],m2=new C("MAT_CARD_CONFIG"),Ri=(()=>{class t{appearance;constructor(){let e=c(m2,{optional:!0});this.appearance=e?.appearance||"raised"}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-card"]],hostAttrs:[1,"mat-mdc-card","mdc-card"],hostVars:8,hostBindings:function(i,r){i&2&&N("mat-mdc-card-outlined",r.appearance==="outlined")("mdc-card--outlined",r.appearance==="outlined")("mat-mdc-card-filled",r.appearance==="filled")("mdc-card--filled",r.appearance==="filled")},inputs:{appearance:"appearance"},exportAs:["matCard"],ngContentSelectors:c2,decls:1,vars:0,template:function(i,r){i&1&&(ve(),B(0))},styles:[`.mat-mdc-card {
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
`],encapsulation:2})}return t})(),Qr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-card-title"],["","mat-card-title",""],["","matCardTitle",""]],hostAttrs:[1,"mat-mdc-card-title"]})}return t})();var Ps=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-card-content"]],hostAttrs:[1,"mat-mdc-card-content"]})}return t})(),Wf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-card-subtitle"],["","mat-card-subtitle",""],["","matCardSubtitle",""]],hostAttrs:[1,"mat-mdc-card-subtitle"]})}return t})(),WE=(()=>{class t{align="start";static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-card-actions"]],hostAttrs:[1,"mat-mdc-card-actions","mdc-card__actions"],hostVars:2,hostBindings:function(i,r){i&2&&N("mat-mdc-card-actions-align-end",r.align==="end")},inputs:{align:"align"},exportAs:["matCardActions"]})}return t})(),Fs=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-card-header"]],hostAttrs:[1,"mat-mdc-card-header"],ngContentSelectors:u2,decls:4,vars:0,consts:[[1,"mat-mdc-card-header-text"]],template:function(i,r){i&1&&(ve(d2),B(0),Ve(1,"div",0),B(2,1),Xe(),B(3,2))},encapsulation:2})}return t})();var Gf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","mat-card-avatar",""],["","matCardAvatar",""]],hostAttrs:[1,"mat-mdc-card-avatar"]})}return t})();var $n=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[_e]})}return t})();var f2=["determinateSpinner"];function h2(t,n){if(t&1&&(fn(),m(0,"svg",11),V(1,"circle",12),f()),t&2){let e=b();j("viewBox",e._viewBox()),p(),jt("stroke-dasharray",e._strokeCircumference(),"px")("stroke-dashoffset",e._strokeCircumference()/2,"px")("stroke-width",e._circleStrokeWidth(),"%"),j("r",e._circleRadius())}}var p2=new C("mat-progress-spinner-default-options",{providedIn:"root",factory:()=>({diameter:GE})}),GE=100,g2=10,Qt=(()=>{class t{_elementRef=c(L);_noopAnimations;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor="primary";_determinateCircle;constructor(){let e=c(p2),i=Ac(),r=this._elementRef.nativeElement;this._noopAnimations=i==="di-disabled"&&!!e&&!e._forceAnimations,this.mode=r.nodeName.toLowerCase()==="mat-spinner"?"indeterminate":"determinate",!this._noopAnimations&&i==="reduced-motion"&&r.classList.add("mat-progress-spinner-reduced-motion"),e&&(e.color&&(this.color=this._defaultColor=e.color),e.diameter&&(this.diameter=e.diameter),e.strokeWidth&&(this.strokeWidth=e.strokeWidth))}mode;get value(){return this.mode==="determinate"?this._value:0}set value(e){this._value=Math.max(0,Math.min(100,e||0))}_value=0;get diameter(){return this._diameter}set diameter(e){this._diameter=e||0}_diameter=GE;get strokeWidth(){return this._strokeWidth??this.diameter/10}set strokeWidth(e){this._strokeWidth=e||0}_strokeWidth;_circleRadius(){return(this.diameter-g2)/2}_viewBox(){let e=this._circleRadius()*2+this.strokeWidth;return`0 0 ${e} ${e}`}_strokeCircumference(){return 2*Math.PI*this._circleRadius()}_strokeDashOffset(){return this.mode==="determinate"?this._strokeCircumference()*(100-this._value)/100:null}_circleStrokeWidth(){return this.strokeWidth/this.diameter*100}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-progress-spinner"],["mat-spinner"]],viewQuery:function(i,r){if(i&1&&Te(f2,5),i&2){let o;U(o=z())&&(r._determinateCircle=o.first)}},hostAttrs:["role","progressbar","tabindex","-1",1,"mat-mdc-progress-spinner","mdc-circular-progress"],hostVars:18,hostBindings:function(i,r){i&2&&(j("aria-valuemin",0)("aria-valuemax",100)("aria-valuenow",r.mode==="determinate"?r.value:null)("mode",r.mode),et("mat-"+r.color),jt("width",r.diameter,"px")("height",r.diameter,"px")("--%NS%mat-progress-spinner-size",r.diameter+"px")("--%NS%mat-progress-spinner-active-indicator-width",r.diameter+"px"),N("_mat-animation-noopable",r._noopAnimations)("mdc-circular-progress--indeterminate",r.mode==="indeterminate"))},inputs:{color:"color",mode:"mode",value:[2,"value","value",Nt],diameter:[2,"diameter","diameter",Nt],strokeWidth:[2,"strokeWidth","strokeWidth",Nt]},exportAs:["matProgressSpinner"],decls:14,vars:11,consts:[["circle",""],["determinateSpinner",""],["aria-hidden","true",1,"mdc-circular-progress__determinate-container"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__determinate-circle-graphic"],["cx","50%","cy","50%",1,"mdc-circular-progress__determinate-circle"],["aria-hidden","true",1,"mdc-circular-progress__indeterminate-container"],[1,"mdc-circular-progress__spinner-layer"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-left"],[3,"ngTemplateOutlet"],[1,"mdc-circular-progress__gap-patch"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-right"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__indeterminate-circle-graphic"],["cx","50%","cy","50%"]],template:function(i,r){if(i&1&&(yt(0,h2,2,8,"ng-template",null,0,Ga),m(2,"div",2,1),fn(),m(4,"svg",3),V(5,"circle",4),f()(),wl(),m(6,"div",5)(7,"div",6)(8,"div",7),za(9,8),f(),m(10,"div",9),za(11,8),f(),m(12,"div",10),za(13,8),f()()()),i&2){let o=rt(1);p(4),j("viewBox",r._viewBox()),p(),jt("stroke-dasharray",r._strokeCircumference(),"px")("stroke-dashoffset",r._strokeDashOffset(),"px")("stroke-width",r._circleStrokeWidth(),"%"),j("r",r._circleRadius()),p(4),M("ngTemplateOutlet",o),p(2),M("ngTemplateOutlet",o),p(2),M("ngTemplateOutlet",o)}},dependencies:[Kl],styles:[`.mat-mdc-progress-spinner {
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
`],encapsulation:2})}return t})();var Xt=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[_e]})}return t})();function _2(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=b();p(),k(e.errorMessage())}}function v2(t,n){if(t&1){let e=se();m(0,"button",9),w("click",function(){let r=W(e).$implicit,o=b();return G(o.selectedAgent.set(r))}),m(1,"mat-icon"),g(2),f(),m(3,"span"),g(4),f()()}if(t&2){let e=n.$implicit,i=b();N("selected",i.selectedAgent()===e),j("aria-selected",i.selectedAgent()===e),p(2),k(i.agentIcon(e)),p(2),k(e)}}function b2(t,n){t&1&&(m(0,"p",4),g(1,"No agents are configured."),f())}function y2(t,n){t&1&&V(0,"mat-spinner",8)}function C2(t,n){t&1&&g(0," Start chat ")}var Ls=class t{constructor(n){this.state=c(Le);this.dialogRef=c(Zt);this.router=c(an);this.selectedAgent=T("");this.creating=T(!1);this.errorMessage=T("");this.projectId=n.projectId,this.selectedAgent.set(this.state.agents()[0]??"codex")}agentIcon(n){let e=n.toLowerCase();return e.includes("codex")?"terminal":e.includes("claude")?"smart_toy":e.includes("opencode")?"code":e.includes("gemini")||e.includes("antigravity")?"psychology":"robot_2"}create(){return P(this,null,function*(){if(!(!this.projectId||!this.selectedAgent())){this.creating.set(!0),this.errorMessage.set("");try{let n=yield this.state.createChat(this.projectId,this.selectedAgent());this.dialogRef.close(n),yield this.router.navigate(["/projects",this.projectId,"chats",n.id])}catch(n){this.errorMessage.set(n instanceof Error?n.message:"Failed to create chat")}finally{this.creating.set(!1)}}})}static{this.\u0275fac=function(e){return new(e||t)(ne(Nn))}}static{this.\u0275cmp=x({type:t,selectors:[["hub-agent-picker"]],decls:14,vars:5,consts:[["mat-dialog-title",""],["role","alert",1,"error-box"],["role","listbox","aria-label","Available agents",1,"agent-grid"],["mat-stroked-button","","role","option","type","button",1,"agent-option",3,"selected"],[1,"empty"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","color","primary","type","button",3,"click","disabled"],["diameter","18"],["mat-stroked-button","","role","option","type","button",1,"agent-option",3,"click"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"Select agent"),f(),m(2,"mat-dialog-content"),D(3,_2,2,1,"div",1),m(4,"div",2),nt(5,v2,5,5,"button",3,Ua,!1,b2,2,0,"p",4),f()(),m(8,"mat-dialog-actions",5)(9,"button",6),w("click",function(){return i.dialogRef.close()}),g(10,"Cancel"),f(),m(11,"button",7),w("click",function(){return i.create()}),D(12,y2,1,0,"mat-spinner",8)(13,C2,1,0),f()()),e&2&&(p(3),E(i.errorMessage()?3:-1),p(2),it(i.state.agents()),p(4),M("disabled",i.creating()),p(2),M("disabled",!i.selectedAgent()||i.creating()),p(),E(i.creating()?12:13))},dependencies:[Pe,ot,$n,Tt,Hn,zn,Un,Fe,We,Xt,Qt],styles:["mat-dialog-content[_ngcontent-%COMP%]{min-width:min(480px,100vw - 48px)}.agent-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;padding:12px 0}.agent-option[_ngcontent-%COMP%]{min-height:112px;display:flex;flex-direction:column;gap:8px;justify-content:center;border-radius:16px;text-transform:capitalize}.agent-option[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary);font-size:30px;width:30px;height:30px}.agent-option.selected[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-primary-container);border-color:var(--%NS%mat-sys-primary)}.empty[_ngcontent-%COMP%]{grid-column:1/-1;color:var(--%NS%mat-sys-outline);text-align:center}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:12px;background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};var fb=class{_box;_destroyed=new I;_resizeSubject=new I;_resizeObserver;_elementObservables=new Map;constructor(n){this._box=n,typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(e=>this._resizeSubject.next(e)))}observe(n){return this._elementObservables.has(n)||this._elementObservables.set(n,new de(e=>{let i=this._resizeSubject.subscribe(e);return this._resizeObserver?.observe(n,{box:this._box}),()=>{this._resizeObserver?.unobserve(n),i.unsubscribe(),this._elementObservables.delete(n)}}).pipe(me(e=>e.some(i=>i.target===n)),Fd({bufferSize:1,refCount:!0}),pe(this._destroyed))),this._elementObservables.get(n)}destroy(){this._destroyed.next(),this._destroyed.complete(),this._resizeSubject.complete(),this._elementObservables.clear()}},qf=(()=>{class t{_cleanupErrorListener;_observers=new Map;_ngZone=c($);constructor(){typeof ResizeObserver<"u"}ngOnDestroy(){for(let[,e]of this._observers)e.destroy();this._observers.clear(),this._cleanupErrorListener?.()}observe(e,i){let r=i?.box||"content-box";return this._observers.has(r)||this._observers.set(r,new fb(r)),this._observers.get(r).observe(e)}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var w2=["notch"],S2=["*"],qE=["iconPrefixContainer"],YE=["textPrefixContainer"],ZE=["iconSuffixContainer"],QE=["textSuffixContainer"],x2=["textField"],D2=["*",[["mat-label"]],[["","matPrefix",""],["","matIconPrefix",""]],[["","matTextPrefix",""]],[["","matTextSuffix",""]],[["","matSuffix",""],["","matIconSuffix",""]],[["mat-error"],["","matError",""]],[["mat-hint",3,"align","end"]],[["mat-hint","align","end"]]],E2=["*","mat-label","[matPrefix], [matIconPrefix]","[matTextPrefix]","[matTextSuffix]","[matSuffix], [matIconSuffix]","mat-error, [matError]","mat-hint:not([align='end'])","mat-hint[align='end']"];function M2(t,n){t&1&&V(0,"span",21)}function I2(t,n){if(t&1&&(m(0,"label",20),B(1,1),D(2,M2,1,0,"span",21),f()),t&2){let e=b(2);M("floating",e._shouldLabelFloat())("monitorResize",e._hasOutline())("id",e._labelId),j("for",e._control.disableAutomaticLabeling?null:e._control.id),p(2),E(!e.hideRequiredMarker&&e._control.required?2:-1)}}function N2(t,n){if(t&1&&D(0,I2,3,5,"label",20),t&2){let e=b();E(e._hasFloatingLabel()?0:-1)}}function T2(t,n){t&1&&V(0,"div",7)}function k2(t,n){}function A2(t,n){if(t&1&&yt(0,k2,0,0,"ng-template",13),t&2){b(2);let e=rt(1);M("ngTemplateOutlet",e)}}function R2(t,n){if(t&1&&(m(0,"div",9),D(1,A2,1,1,null,13),f()),t&2){let e=b();M("matFormFieldNotchedOutlineOpen",e._shouldLabelFloat()),p(),E(e._forceDisplayInfixLabel()?-1:1)}}function O2(t,n){t&1&&(m(0,"div",10,2),B(2,2),f())}function P2(t,n){t&1&&(m(0,"div",11,3),B(2,3),f())}function F2(t,n){}function L2(t,n){if(t&1&&yt(0,F2,0,0,"ng-template",13),t&2){b();let e=rt(1);M("ngTemplateOutlet",e)}}function j2(t,n){t&1&&(m(0,"div",14,4),B(2,4),f())}function V2(t,n){t&1&&(m(0,"div",15,5),B(2,5),f())}function B2(t,n){t&1&&V(0,"div",16)}function H2(t,n){t&1&&(m(0,"div",18),B(1,6),f())}function U2(t,n){if(t&1&&(m(0,"mat-hint",22),g(1),f()),t&2){let e=b(2);M("id",e._hintLabelId),p(),k(e.hintLabel)}}function z2(t,n){if(t&1&&(m(0,"div",19),D(1,U2,2,2,"mat-hint",22),B(2,7),V(3,"div",23),B(4,8),f()),t&2){let e=b();p(),E(e.hintLabel?1:-1)}}var Tn=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-label"]]})}return t})(),$2=new C("MatError");var Jc=(()=>{class t{align="start";id=c($e).getId("mat-mdc-hint-");static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-hint"]],hostAttrs:[1,"mat-mdc-form-field-hint","mat-mdc-form-field-bottom-align"],hostVars:4,hostBindings:function(i,r){i&2&&(Gt("id",r.id),j("align",null),N("mat-mdc-form-field-hint-end",r.align==="end"))},inputs:{align:"align",id:"id"}})}return t})(),W2=new C("MatPrefix");var G2=new C("MatSuffix");var iM=new C("FloatingLabelParent"),XE=(()=>{class t{_elementRef=c(L);get floating(){return this._floating}set floating(e){this._floating=e,this.monitorResize&&this._handleResize()}_floating=!1;get monitorResize(){return this._monitorResize}set monitorResize(e){this._monitorResize=e,this._monitorResize?this._subscribeToResize():this._resizeSubscription.unsubscribe()}_monitorResize=!1;_resizeObserver=c(qf);_ngZone=c($);_parent=c(iM);_resizeSubscription=new ue;ngOnDestroy(){this._resizeSubscription.unsubscribe()}getWidth(){return q2(this._elementRef.nativeElement)}get element(){return this._elementRef.nativeElement}_handleResize(){setTimeout(()=>this._parent._handleLabelResized())}_subscribeToResize(){this._resizeSubscription.unsubscribe(),this._ngZone.runOutsideAngular(()=>{this._resizeSubscription=this._resizeObserver.observe(this._elementRef.nativeElement,{box:"border-box"}).subscribe(()=>this._handleResize())})}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["label","matFormFieldFloatingLabel",""]],hostAttrs:[1,"mdc-floating-label","mat-mdc-floating-label"],hostVars:2,hostBindings:function(i,r){i&2&&N("mdc-floating-label--float-above",r.floating)},inputs:{floating:"floating",monitorResize:"monitorResize"}})}return t})();function q2(t){let n=t;if(n.offsetParent!==null)return n.scrollWidth;let e=n.cloneNode(!0);e.style.setProperty("position","absolute"),e.style.setProperty("transform","translate(-9999px, -9999px)"),document.documentElement.appendChild(e);let i=e.scrollWidth;return e.remove(),i}var KE="mdc-line-ripple--active",Yf="mdc-line-ripple--deactivating",JE=(()=>{class t{_elementRef=c(L);_cleanupTransitionEnd;constructor(){let e=c($),i=c(xe);e.runOutsideAngular(()=>{this._cleanupTransitionEnd=i.listen(this._elementRef.nativeElement,"transitionend",this._handleTransitionEnd)})}activate(){let e=this._elementRef.nativeElement.classList;e.remove(Yf),e.add(KE)}deactivate(){this._elementRef.nativeElement.classList.add(Yf)}_handleTransitionEnd=e=>{let i=this._elementRef.nativeElement.classList,r=i.contains(Yf);e.propertyName==="opacity"&&r&&i.remove(KE,Yf)};ngOnDestroy(){this._cleanupTransitionEnd()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["div","matFormFieldLineRipple",""]],hostAttrs:[1,"mdc-line-ripple"]})}return t})(),eM=(()=>{class t{_elementRef=c(L);_ngZone=c($);open=!1;_notch;ngAfterViewInit(){let e=this._elementRef.nativeElement,i=e.querySelector(".mdc-floating-label");i?(e.classList.add("mdc-notched-outline--upgraded"),typeof requestAnimationFrame=="function"&&(i.style.transitionDuration="0s",this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>i.style.transitionDuration="")}))):e.classList.add("mdc-notched-outline--no-label")}_setNotchWidth(e){let i=this._notch.nativeElement;!this.open||!e?i.style.width="":i.style.width=`calc(${e}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`}_setMaxWidth(e){this._notch.nativeElement.style.setProperty("--mat-form-field-notch-max-width",`calc(100% - ${e}px)`)}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["div","matFormFieldNotchedOutline",""]],viewQuery:function(i,r){if(i&1&&Te(w2,5),i&2){let o;U(o=z())&&(r._notch=o.first)}},hostAttrs:[1,"mdc-notched-outline"],hostVars:2,hostBindings:function(i,r){i&2&&N("mdc-notched-outline--notched",r.open)},inputs:{open:[0,"matFormFieldNotchedOutlineOpen","open"]},ngContentSelectors:S2,decls:5,vars:0,consts:[["notch",""],[1,"mat-mdc-notch-piece","mdc-notched-outline__leading"],[1,"mat-mdc-notch-piece","mdc-notched-outline__notch"],[1,"mat-mdc-notch-piece","mdc-notched-outline__trailing"]],template:function(i,r){i&1&&(ve(),xt(0,"div",1),Ve(1,"div",2,0),B(3),Xe(),xt(4,"div",3))},encapsulation:2})}return t})(),ed=(()=>{class t{value=null;stateChanges;id;placeholder;ngControl=null;focused=!1;empty=!1;shouldLabelFloat=!1;required=!1;disabled=!1;errorState=!1;controlType;autofilled;userAriaDescribedBy;disableAutomaticLabeling;describedByIds;static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t})}return t})();var td=new C("MatFormField"),Y2=new C("MAT_FORM_FIELD_DEFAULT_OPTIONS"),tM="fill",Z2="auto",nM="fixed",Q2="translateY(-50%)",Wn=(()=>{class t{_elementRef=c(L);_changeDetectorRef=c(Me);_platform=c(Ce);_idGenerator=c($e);_ngZone=c($);_defaults=c(Y2,{optional:!0});_currentDirection;_textField;_iconPrefixContainer;_textPrefixContainer;_iconSuffixContainer;_textSuffixContainer;_floatingLabel;_notchedOutline;_lineRipple;_iconPrefixContainerSignal=Ql("iconPrefixContainer");_textPrefixContainerSignal=Ql("textPrefixContainer");_iconSuffixContainerSignal=Ql("iconSuffixContainer");_textSuffixContainerSignal=Ql("textSuffixContainer");_prefixSuffixContainers=ke(()=>[this._iconPrefixContainerSignal(),this._textPrefixContainerSignal(),this._iconSuffixContainerSignal(),this._textSuffixContainerSignal()].map(e=>e?.nativeElement).filter(e=>e!==void 0));_formFieldControl;_prefixChildren;_suffixChildren;_errorChildren;_hintChildren;_labelChild=pS(Tn);get hideRequiredMarker(){return this._hideRequiredMarker}set hideRequiredMarker(e){this._hideRequiredMarker=lt(e)}_hideRequiredMarker=!1;color="primary";get floatLabel(){return this._floatLabel||this._defaults?.floatLabel||Z2}set floatLabel(e){e!==this._floatLabel&&(this._floatLabel=e,this._changeDetectorRef.markForCheck())}_floatLabel;get appearance(){return this._appearanceSignal()}set appearance(e){let i=e||this._defaults?.appearance||tM;this._appearanceSignal.set(i)}_appearanceSignal=T(tM);get subscriptSizing(){return this._subscriptSizing||this._defaults?.subscriptSizing||nM}set subscriptSizing(e){this._subscriptSizing=e||this._defaults?.subscriptSizing||nM}_subscriptSizing=null;get hintLabel(){return this._hintLabel}set hintLabel(e){this._hintLabel=e,this._processHints()}_hintLabel="";_hasIconPrefix=!1;_hasTextPrefix=!1;_hasIconSuffix=!1;_hasTextSuffix=!1;_labelId=this._idGenerator.getId("mat-mdc-form-field-label-");_hintLabelId=this._idGenerator.getId("mat-mdc-hint-");_describedByIds;get _control(){return this._explicitFormFieldControl||this._formFieldControl}set _control(e){this._explicitFormFieldControl=e}_destroyed=new I;_isFocused=null;_explicitFormFieldControl;_previousControl=null;_previousControlValidatorFn=null;_stateChanges;_valueChanges;_describedByChanges;_outlineLabelOffsetResizeObserver=null;_animationsDisabled=Re();constructor(){let e=this._defaults,i=c(wt);e&&(e.appearance&&(this.appearance=e.appearance),this._hideRequiredMarker=!!e?.hideRequiredMarker,e.color&&(this.color=e.color)),Lt(()=>this._currentDirection=i.valueSignal()),this._syncOutlineLabelOffset()}ngAfterViewInit(){this._updateFocusState(),this._animationsDisabled||this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-form-field-animations-enabled")},300)}),this._changeDetectorRef.detectChanges()}ngAfterContentInit(){this._assertFormFieldControl(),this._initializeSubscript(),this._initializePrefixAndSuffix()}ngAfterContentChecked(){this._assertFormFieldControl(),this._control!==this._previousControl&&(this._initializeControl(this._previousControl),this._control.ngControl&&this._control.ngControl.control&&(this._previousControlValidatorFn=this._control.ngControl.control.validator),this._previousControl=this._control,this._changeDetectorRef.markForCheck()),this._control.ngControl&&this._control.ngControl.control&&this._control.ngControl.control.validator!==this._previousControlValidatorFn&&this._changeDetectorRef.markForCheck()}ngOnDestroy(){this._outlineLabelOffsetResizeObserver?.disconnect(),this._stateChanges?.unsubscribe(),this._valueChanges?.unsubscribe(),this._describedByChanges?.unsubscribe(),this._destroyed.next(),this._destroyed.complete()}getLabelId=ke(()=>this._hasFloatingLabel()?this._labelId:null);getConnectedOverlayOrigin(){return this._textField||this._elementRef}_animateAndLockLabel(){this._hasFloatingLabel()&&(this.floatLabel="always")}_initializeControl(e){let i=this._control,r="mat-mdc-form-field-type-";e&&this._elementRef.nativeElement.classList.remove(r+e.controlType),i.controlType&&this._elementRef.nativeElement.classList.add(r+i.controlType),this._stateChanges?.unsubscribe(),this._stateChanges=i.stateChanges.subscribe(()=>{this._updateFocusState(),this._changeDetectorRef.markForCheck()}),this._describedByChanges?.unsubscribe(),this._describedByChanges=i.stateChanges.pipe(Ze([void 0,void 0]),ee(()=>[i.errorState,i.userAriaDescribedBy]),Pd(),me(([[o,a],[s,l]])=>o!==s||a!==l)).subscribe(()=>this._syncDescribedByIds()),this._valueChanges?.unsubscribe(),i.ngControl&&i.ngControl.valueChanges&&(this._valueChanges=i.ngControl.valueChanges.pipe(pe(this._destroyed)).subscribe(()=>this._changeDetectorRef.markForCheck()))}_checkPrefixAndSuffixTypes(){this._hasIconPrefix=!!this._prefixChildren.find(e=>!e._isText),this._hasTextPrefix=!!this._prefixChildren.find(e=>e._isText),this._hasIconSuffix=!!this._suffixChildren.find(e=>!e._isText),this._hasTextSuffix=!!this._suffixChildren.find(e=>e._isText)}_initializePrefixAndSuffix(){this._checkPrefixAndSuffixTypes(),ft(this._prefixChildren.changes,this._suffixChildren.changes).subscribe(()=>{this._checkPrefixAndSuffixTypes(),this._changeDetectorRef.markForCheck()})}_initializeSubscript(){this._hintChildren.changes.subscribe(()=>{this._processHints(),this._changeDetectorRef.markForCheck()}),this._errorChildren.changes.subscribe(()=>{this._syncDescribedByIds(),this._changeDetectorRef.markForCheck()}),this._validateHints(),this._syncDescribedByIds()}_assertFormFieldControl(){this._control}_updateFocusState(){let e=this._control.focused;e&&!this._isFocused?(this._isFocused=!0,this._lineRipple?.activate()):!e&&(this._isFocused||this._isFocused===null)&&(this._isFocused=!1,this._lineRipple?.deactivate()),this._elementRef.nativeElement.classList.toggle("mat-focused",e),this._textField?.nativeElement.classList.toggle("mdc-text-field--focused",e)}_syncOutlineLabelOffset(){A_({earlyRead:()=>{if(this._appearanceSignal()!=="outline")return this._outlineLabelOffsetResizeObserver?.disconnect(),null;if(globalThis.ResizeObserver){this._outlineLabelOffsetResizeObserver||=new globalThis.ResizeObserver(()=>{this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset())});for(let e of this._prefixSuffixContainers())this._outlineLabelOffsetResizeObserver.observe(e,{box:"border-box"})}return this._getOutlinedLabelOffset()},write:e=>this._writeOutlinedLabelStyles(e())})}_shouldAlwaysFloat(){return this.floatLabel==="always"}_hasOutline(){return this.appearance==="outline"}_forceDisplayInfixLabel(){return!this._platform.isBrowser&&this._prefixChildren.length&&!this._shouldLabelFloat()}_hasFloatingLabel=ke(()=>!!this._labelChild());_shouldLabelFloat(){return this._hasFloatingLabel()?this._control.shouldLabelFloat||this._shouldAlwaysFloat():!1}_shouldForward(e){let i=this._control?this._control.ngControl:null;return i&&i[e]}_getSubscriptMessageType(){return this._errorChildren&&this._errorChildren.length>0&&this._control.errorState?"error":"hint"}_handleLabelResized(){this._refreshOutlineNotchWidth()}_refreshOutlineNotchWidth(){!this._hasOutline()||!this._floatingLabel||!this._shouldLabelFloat()?this._notchedOutline?._setNotchWidth(0):this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth())}_processHints(){this._validateHints(),this._syncDescribedByIds()}_validateHints(){this._hintChildren}_syncDescribedByIds(){if(this._control){let e=[];if(this._control.userAriaDescribedBy&&typeof this._control.userAriaDescribedBy=="string"&&e.push(...this._control.userAriaDescribedBy.split(" ")),this._getSubscriptMessageType()==="hint"){let o=this._hintChildren?this._hintChildren.find(s=>s.align==="start"):null,a=this._hintChildren?this._hintChildren.find(s=>s.align==="end"):null;o?e.push(o.id):this._hintLabel&&e.push(this._hintLabelId),a&&e.push(a.id)}else this._errorChildren&&e.push(...this._errorChildren.map(o=>o.id));let i=this._control.describedByIds,r;if(i){let o=this._describedByIds||e;r=e.concat(i.filter(a=>a&&!o.includes(a)))}else r=e;this._control.setDescribedByIds(r),this._describedByIds=e}}_getOutlinedLabelOffset(){if(!this._hasOutline()||!this._floatingLabel)return null;if(!this._iconPrefixContainer&&!this._textPrefixContainer)return["",null];if(!this._isAttachedToDom())return null;let e=this._iconPrefixContainer?.nativeElement,i=this._textPrefixContainer?.nativeElement,r=this._iconSuffixContainer?.nativeElement,o=this._textSuffixContainer?.nativeElement,a=e?.getBoundingClientRect().width??0,s=i?.getBoundingClientRect().width??0,l=r?.getBoundingClientRect().width??0,d=o?.getBoundingClientRect().width??0,u=this._currentDirection==="rtl"?"-1":"1",h=`${a+s}px`,v=`calc(${u} * (${h} + var(--mat-mdc-form-field-label-offset-x, 0px)))`,S=`var(--mat-mdc-form-field-label-transform, ${Q2} translateX(${v}))`,A=a+s+l+d;return[S,A]}_writeOutlinedLabelStyles(e){if(e!==null){let[i,r]=e;this._floatingLabel&&(this._floatingLabel.element.style.transform=i),r!==null&&this._notchedOutline?._setMaxWidth(r)}}_isAttachedToDom(){let e=this._elementRef.nativeElement;if(e.getRootNode){let i=e.getRootNode();return i&&i!==e}return document.documentElement.contains(e)}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-form-field"]],contentQueries:function(i,r,o){if(i&1&&(tm(o,r._labelChild,Tn,5),dt(o,ed,5)(o,W2,5)(o,G2,5)(o,$2,5)(o,Jc,5)),i&2){im();let a;U(a=z())&&(r._formFieldControl=a.first),U(a=z())&&(r._prefixChildren=a),U(a=z())&&(r._suffixChildren=a),U(a=z())&&(r._errorChildren=a),U(a=z())&&(r._hintChildren=a)}},viewQuery:function(i,r){if(i&1&&(nm(r._iconPrefixContainerSignal,qE,5)(r._textPrefixContainerSignal,YE,5)(r._iconSuffixContainerSignal,ZE,5)(r._textSuffixContainerSignal,QE,5),Te(x2,5)(qE,5)(YE,5)(ZE,5)(QE,5)(XE,5)(eM,5)(JE,5)),i&2){im(4);let o;U(o=z())&&(r._textField=o.first),U(o=z())&&(r._iconPrefixContainer=o.first),U(o=z())&&(r._textPrefixContainer=o.first),U(o=z())&&(r._iconSuffixContainer=o.first),U(o=z())&&(r._textSuffixContainer=o.first),U(o=z())&&(r._floatingLabel=o.first),U(o=z())&&(r._notchedOutline=o.first),U(o=z())&&(r._lineRipple=o.first)}},hostAttrs:[1,"mat-mdc-form-field"],hostVars:38,hostBindings:function(i,r){i&2&&N("mat-mdc-form-field-label-always-float",r._shouldAlwaysFloat())("mat-mdc-form-field-has-icon-prefix",r._hasIconPrefix)("mat-mdc-form-field-has-icon-suffix",r._hasIconSuffix)("mat-form-field-invalid",r._control.errorState)("mat-form-field-disabled",r._control.disabled)("mat-form-field-autofilled",r._control.autofilled)("mat-form-field-appearance-fill",r.appearance=="fill")("mat-form-field-appearance-outline",r.appearance=="outline")("mat-form-field-hide-placeholder",r._hasFloatingLabel()&&!r._shouldLabelFloat())("mat-primary",r.color!=="accent"&&r.color!=="warn")("mat-accent",r.color==="accent")("mat-warn",r.color==="warn")("ng-untouched",r._shouldForward("untouched"))("ng-touched",r._shouldForward("touched"))("ng-pristine",r._shouldForward("pristine"))("ng-dirty",r._shouldForward("dirty"))("ng-valid",r._shouldForward("valid"))("ng-invalid",r._shouldForward("invalid"))("ng-pending",r._shouldForward("pending"))},inputs:{hideRequiredMarker:"hideRequiredMarker",color:"color",floatLabel:"floatLabel",appearance:"appearance",subscriptSizing:"subscriptSizing",hintLabel:"hintLabel"},exportAs:["matFormField"],features:[Ie([{provide:td,useExisting:t},{provide:iM,useExisting:t}])],ngContentSelectors:E2,decls:18,vars:21,consts:[["labelTemplate",""],["textField",""],["iconPrefixContainer",""],["textPrefixContainer",""],["textSuffixContainer",""],["iconSuffixContainer",""],[1,"mat-mdc-text-field-wrapper","mdc-text-field",3,"click"],[1,"mat-mdc-form-field-focus-overlay"],[1,"mat-mdc-form-field-flex"],["matFormFieldNotchedOutline","",3,"matFormFieldNotchedOutlineOpen"],[1,"mat-mdc-form-field-icon-prefix"],[1,"mat-mdc-form-field-text-prefix"],[1,"mat-mdc-form-field-infix"],[3,"ngTemplateOutlet"],[1,"mat-mdc-form-field-text-suffix"],[1,"mat-mdc-form-field-icon-suffix"],["matFormFieldLineRipple",""],["aria-atomic","true","aria-live","polite",1,"mat-mdc-form-field-subscript-wrapper","mat-mdc-form-field-bottom-align"],[1,"mat-mdc-form-field-error-wrapper"],[1,"mat-mdc-form-field-hint-wrapper"],["matFormFieldFloatingLabel","",3,"floating","monitorResize","id"],["aria-hidden","true",1,"mat-mdc-form-field-required-marker","mdc-floating-label--required"],[3,"id"],[1,"mat-mdc-form-field-hint-spacer"]],template:function(i,r){if(i&1&&(ve(D2),yt(0,N2,1,1,"ng-template",null,0,Ga),m(2,"div",6,1),w("click",function(a){return r._control.onContainerClick(a)}),D(4,T2,1,0,"div",7),m(5,"div",8),D(6,R2,2,2,"div",9),D(7,O2,3,0,"div",10),D(8,P2,3,0,"div",11),m(9,"div",12),D(10,L2,1,1,null,13),B(11),f(),D(12,j2,3,0,"div",14),D(13,V2,3,0,"div",15),f(),D(14,B2,1,0,"div",16),f(),m(15,"div",17),D(16,H2,2,0,"div",18)(17,z2,5,1,"div",19),f()),i&2){let o;p(2),N("mdc-text-field--filled",!r._hasOutline())("mdc-text-field--outlined",r._hasOutline())("mdc-text-field--no-label",!r._hasFloatingLabel())("mdc-text-field--disabled",r._control.disabled)("mdc-text-field--invalid",r._control.errorState),p(2),E(!r._hasOutline()&&!r._control.disabled?4:-1),p(2),E(r._hasOutline()?6:-1),p(),E(r._hasIconPrefix?7:-1),p(),E(r._hasTextPrefix?8:-1),p(2),E(!r._hasOutline()||r._forceDisplayInfixLabel()?10:-1),p(2),E(r._hasTextSuffix?12:-1),p(),E(r._hasIconSuffix?13:-1),p(),E(r._hasOutline()?-1:14),p(),N("mat-mdc-form-field-subscript-dynamic-size",r.subscriptSizing==="dynamic");let a=r._getSubscriptMessageType();p(),E((o=a)==="error"?16:o==="hint"?17:-1)}},dependencies:[XE,eM,Kl,JE,Jc],styles:[`.mdc-text-field {
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
`],encapsulation:2})}return t})();var dn=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ps,Wn,_e]})}return t})();var rM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["ng-component"]],hostAttrs:["cdk-text-field-style-loader",""],decls:0,vars:0,template:function(i,r){},styles:[`textarea.cdk-textarea-autosize {
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
`],encapsulation:2})}return t})(),X2={passive:!0},oM=(()=>{class t{_platform=c(Ce);_ngZone=c($);_renderer=c(It).createRenderer(null,null);_styleLoader=c(tt);_monitoredElements=new Map;monitor(e){if(!this._platform.isBrowser)return at;this._styleLoader.load(rM);let i=sn(e),r=this._monitoredElements.get(i);if(r)return r.subject;let o=new I,a="cdk-text-field-autofilled",s=d=>{d.animationName==="cdk-text-field-autofill-start"&&!i.classList.contains(a)?(i.classList.add(a),this._ngZone.run(()=>o.next({target:d.target,isAutofilled:!0}))):d.animationName==="cdk-text-field-autofill-end"&&i.classList.contains(a)&&(i.classList.remove(a),this._ngZone.run(()=>o.next({target:d.target,isAutofilled:!1})))},l=this._ngZone.runOutsideAngular(()=>(i.classList.add("cdk-text-field-autofill-monitored"),this._renderer.listen(i,"animationstart",s,X2)));return this._monitoredElements.set(i,{subject:o,unlisten:l}),o}stopMonitoring(e){let i=sn(e),r=this._monitoredElements.get(i);r&&(r.unlisten(),r.subject.complete(),i.classList.remove("cdk-text-field-autofill-monitored"),i.classList.remove("cdk-text-field-autofilled"),this._monitoredElements.delete(i))}ngOnDestroy(){this._monitoredElements.forEach((e,i)=>this.stopMonitoring(i))}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var aM=(()=>{class t{_elementRef=c(L);_platform=c(Ce);_ngZone=c($);_renderer=c(xe);_resizeEvents=new I;_previousValue;_initialHeight;_destroyed=new I;_listenerCleanups;_minRows;_maxRows;_enabled=!0;_previousMinRows=-1;_textareaElement;get minRows(){return this._minRows}set minRows(e){this._minRows=Bt(e),this._setMinHeight()}get maxRows(){return this._maxRows}set maxRows(e){this._maxRows=Bt(e),this._setMaxHeight()}get enabled(){return this._enabled}set enabled(e){this._enabled!==e&&((this._enabled=e)?this.resizeToFitContent(!0):this.reset())}get placeholder(){return this._textareaElement.placeholder}set placeholder(e){this._cachedPlaceholderHeight=void 0,e?this._textareaElement.setAttribute("placeholder",e):this._textareaElement.removeAttribute("placeholder"),this._cacheTextareaPlaceholderHeight()}_cachedLineHeight;_cachedPlaceholderHeight;_document=c(X);_hasFocus=!1;_isViewInited=!1;constructor(){c(tt).load(rM),this._textareaElement=this._elementRef.nativeElement}_setMinHeight(){let e=this.minRows&&this._cachedLineHeight?`${this.minRows*this._cachedLineHeight}px`:null;e&&(this._textareaElement.style.minHeight=e)}_setMaxHeight(){let e=this.maxRows&&this._cachedLineHeight?`${this.maxRows*this._cachedLineHeight}px`:null;e&&(this._textareaElement.style.maxHeight=e)}ngAfterViewInit(){this._platform.isBrowser&&(this._initialHeight=this._textareaElement.style.height,this.resizeToFitContent(),this._ngZone.runOutsideAngular(()=>{this._listenerCleanups=[this._renderer.listen("window","resize",()=>this._resizeEvents.next()),this._renderer.listen(this._textareaElement,"focus",this._handleFocusEvent),this._renderer.listen(this._textareaElement,"blur",this._handleFocusEvent)],this._resizeEvents.pipe(pa(16)).subscribe(()=>{this._cachedLineHeight=this._cachedPlaceholderHeight=void 0,this.resizeToFitContent(!0)})}),this._isViewInited=!0,this.resizeToFitContent(!0))}ngOnDestroy(){this._listenerCleanups?.forEach(e=>e()),this._resizeEvents.complete(),this._destroyed.next(),this._destroyed.complete()}_cacheTextareaLineHeight(){if(this._cachedLineHeight)return;let e=this._textareaElement.cloneNode(!1),i=e.style;e.rows=1,i.position="absolute",i.visibility="hidden",i.border="none",i.padding="0",i.height="",i.minHeight="",i.maxHeight="",i.top=i.bottom=i.left=i.right="auto",i.overflow="hidden",this._textareaElement.parentNode.appendChild(e),this._cachedLineHeight=e.clientHeight,e.remove(),this._setMinHeight(),this._setMaxHeight()}_measureScrollHeight(){let e=this._textareaElement,i=e.style.marginBottom||"",r=this._platform.FIREFOX,o=this._hasFocus,a=r?"cdk-textarea-autosize-measuring-firefox":"cdk-textarea-autosize-measuring";o&&(e.style.marginBottom=`${e.clientHeight}px`),e.classList.add(a);let s=e.scrollHeight-4;return e.classList.remove(a),o&&(e.style.marginBottom=i),s}_cacheTextareaPlaceholderHeight(){if(!this._isViewInited||this._cachedPlaceholderHeight!=null)return;if(!this.placeholder){this._cachedPlaceholderHeight=0;return}let e=this._textareaElement.value;this._textareaElement.value=this._textareaElement.placeholder,this._cachedPlaceholderHeight=this._measureScrollHeight(),this._textareaElement.value=e}_handleFocusEvent=e=>{this._hasFocus=e.type==="focus"};ngDoCheck(){this._platform.isBrowser&&this.resizeToFitContent()}resizeToFitContent(e=!1){if(!this._enabled||(this._cacheTextareaLineHeight(),this._cacheTextareaPlaceholderHeight(),!this._cachedLineHeight))return;let i=this._elementRef.nativeElement,r=i.value;if(!e&&this._minRows===this._previousMinRows&&r===this._previousValue)return;let o=this._measureScrollHeight(),a=Math.max(o,this._cachedPlaceholderHeight||0);i.style.height=`${a}px`,this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame<"u"?requestAnimationFrame(()=>this._scrollToCaretPosition(i)):setTimeout(()=>this._scrollToCaretPosition(i))}),this._previousValue=r,this._previousMinRows=this._minRows}reset(){this._initialHeight!==void 0&&(this._textareaElement.style.height=this._initialHeight)}_noopInputHandler(){}_scrollToCaretPosition(e){let{selectionStart:i,selectionEnd:r}=e;!this._destroyed.isStopped&&this._hasFocus&&e.setSelectionRange(i,r)}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["textarea","cdkTextareaAutosize",""]],hostAttrs:["rows","1",1,"cdk-textarea-autosize"],hostBindings:function(i,r){i&1&&w("input",function(){return r._noopInputHandler()})},inputs:{minRows:[0,"cdkAutosizeMinRows","minRows"],maxRows:[0,"cdkAutosizeMaxRows","maxRows"],enabled:[2,"cdkTextareaAutosize","enabled",Y],placeholder:"placeholder"},exportAs:["cdkTextareaAutosize"]})}return t})(),Zf=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();var Qf=new C("");var sM=new C("MAT_INPUT_VALUE_ACCESSOR");var Xf=(()=>{class t{isErrorState(e,i){return!!(e&&e.invalid&&(e.touched||i&&i.submitted))}isSignalErrorState(e){if(!e)return!1;let i=e().invalid(),r=e().touched();return i&&r}static \u0275fac=function(i){return new(i||t)};static \u0275prov=q({token:t,factory:t.\u0275fac})}return t})();var js=class{_defaultMatcher;_parentFormGroup;_parentForm;_stateChanges;errorState=!1;matcher;ngControl;formField;constructor(n,e,i,r,o){this._defaultMatcher=n,this._parentFormGroup=i,this._parentForm=r,this._stateChanges=o,e?hn(e.field)&&!e.updateValueAndValidity?(this.formField=e,this.ngControl=null):(this.formField=null,this.ngControl=e):this.ngControl=this.formField=null}updateErrorState(){let n=this.errorState,e=this._getCurrentErrorState(this.matcher||this._defaultMatcher);e!==n&&(this.errorState=e,this._stateChanges.next())}_getCurrentErrorState(n){if(this.formField&&n?.isSignalErrorState)return n.isSignalErrorState(this.formField.field())??!1;let e=this._parentFormGroup||this._parentForm,i=this.ngControl?this.ngControl.control:null;return n?.isErrorState(i,e)??!1}};var J2=["button","checkbox","file","hidden","image","radio","range","reset","submit"],ej=new C("MAT_INPUT_CONFIG"),Kr=(()=>{class t{_elementRef=c(L);_platform=c(Ce);ngControl=c(Bn,{optional:!0,self:!0});_autofillMonitor=c(oM);_ngZone=c($);_formField=c(td,{optional:!0});_renderer=c(xe);_uid=c($e).getId("mat-input-");_previousNativeValue;_inputValueAccessor;_signalBasedValueAccessor;_previousPlaceholder=null;_errorStateTracker;_config=c(ej,{optional:!0});_cleanupIosKeyup;_cleanupWebkitWheel;_isServer=!1;_isNativeSelect=!1;_isTextarea=!1;_isInFormField=!1;focused=!1;stateChanges=new I;controlType="mat-input";autofilled=!1;get disabled(){return this._disabled}set disabled(e){this._disabled=lt(e),this.focused&&(this.focused=!1,this.stateChanges.next())}_disabled=!1;get id(){return this._id}set id(e){this._id=e||this._uid}_id;placeholder;name;get required(){return this._required??this.ngControl?.control?.hasValidator(Jo.required)??!1}set required(e){this._required=lt(e)}_required;get type(){return this._type}set type(e){this._type=e||"text",this._validateType(),!this._isTextarea&&Pv().has(this._type)&&(this._elementRef.nativeElement.type=this._type)}_type="text";get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}userAriaDescribedBy;get value(){return this._signalBasedValueAccessor?this._signalBasedValueAccessor.value():this._inputValueAccessor.value}set value(e){e!==this.value&&(this._signalBasedValueAccessor?this._signalBasedValueAccessor.value.set(e):this._inputValueAccessor.value=e,this.stateChanges.next())}get readonly(){return this._readonly}set readonly(e){this._readonly=lt(e)}_readonly=!1;disabledInteractive;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}_neverEmptyInputTypes=["date","datetime","datetime-local","month","time","week"].filter(e=>Pv().has(e));constructor(){let e=c(Wc,{optional:!0}),i=c(Gc,{optional:!0}),r=c(Xf),o=c(sM,{optional:!0,self:!0}),a=c(Qf,{optional:!0,self:!0}),s=this._elementRef.nativeElement,l=s.nodeName.toLowerCase();o?hn(o.value)?this._signalBasedValueAccessor=o:this._inputValueAccessor=o:this._inputValueAccessor=s,this._previousNativeValue=this.value,this.id=this.id,this._platform.IOS&&this._ngZone.runOutsideAngular(()=>{this._cleanupIosKeyup=this._renderer.listen(s,"keyup",this._iOSKeyupListener)}),this._errorStateTracker=new js(r,a||this.ngControl,i,e,this.stateChanges),this._isServer=!this._platform.isBrowser,this._isNativeSelect=l==="select",this._isTextarea=l==="textarea",this._isInFormField=!!this._formField,this.disabledInteractive=this._config?.disabledInteractive||!1,this._isNativeSelect&&(this.controlType=s.multiple?"mat-native-select-multiple":"mat-native-select"),this._signalBasedValueAccessor&&Lt(()=>{this._signalBasedValueAccessor.value(),this.stateChanges.next()})}ngAfterViewInit(){this._platform.isBrowser&&this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(e=>{this.autofilled=e.isAutofilled,this.stateChanges.next()})}ngOnChanges(){this.stateChanges.next()}ngOnDestroy(){this.stateChanges.complete(),this._platform.isBrowser&&this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),this._cleanupIosKeyup?.(),this._cleanupWebkitWheel?.()}ngDoCheck(){this.ngControl&&(this.updateErrorState(),this.ngControl.disabled!==null&&this.ngControl.disabled!==this.disabled&&(this.disabled=this.ngControl.disabled,this.stateChanges.next())),this._dirtyCheckNativeValue(),this._dirtyCheckPlaceholder()}focus(e){this._elementRef.nativeElement.focus(e)}updateErrorState(){this._errorStateTracker.updateErrorState()}_focusChanged(e){if(e!==this.focused){if(!this._isNativeSelect&&e&&this.disabled&&this.disabledInteractive){let i=this._elementRef.nativeElement;i.type==="number"?(i.type="text",i.setSelectionRange(0,0),i.type="number"):i.setSelectionRange(0,0)}this.focused=e,this.stateChanges.next()}}_onInput(){}_dirtyCheckNativeValue(){let e=this._elementRef.nativeElement.value;this._previousNativeValue!==e&&(this._previousNativeValue=e,this.stateChanges.next())}_dirtyCheckPlaceholder(){let e=this._getPlaceholder();if(e!==this._previousPlaceholder){let i=this._elementRef.nativeElement;this._previousPlaceholder=e,e?i.setAttribute("placeholder",e):i.removeAttribute("placeholder")}}_getPlaceholder(){return this.placeholder||null}_validateType(){J2.indexOf(this._type)>-1}_isNeverEmpty(){return this._neverEmptyInputTypes.indexOf(this._type)>-1}_isBadInput(){let e=this._elementRef.nativeElement.validity;return e&&e.badInput}get empty(){return!this._isNeverEmpty()&&!this._elementRef.nativeElement.value&&!this._isBadInput()&&!this.autofilled}get shouldLabelFloat(){if(this._isNativeSelect){let e=this._elementRef.nativeElement,i=e.options[0];return this.focused||e.multiple||!this.empty||!!(e.selectedIndex>-1&&i&&i.label)}else return this.focused&&!this.disabled||!this.empty}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let i=this._elementRef.nativeElement;e.length?i.setAttribute("aria-describedby",e.join(" ")):i.removeAttribute("aria-describedby")}onContainerClick(){this.focused||this.focus()}_isInlineSelect(){let e=this._elementRef.nativeElement;return this._isNativeSelect&&(e.multiple||e.size>1)}_iOSKeyupListener=e=>{let i=e.target;!i.value&&i.selectionStart===0&&i.selectionEnd===0&&(i.setSelectionRange(1,1),i.setSelectionRange(0,0))};_getReadonlyAttribute(){return this._isNativeSelect?null:this.readonly||this.disabled&&this.disabledInteractive?"true":null}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["input","matInput",""],["textarea","matInput",""],["select","matNativeControl",""],["input","matNativeControl",""],["textarea","matNativeControl",""]],hostAttrs:[1,"mat-mdc-input-element"],hostVars:21,hostBindings:function(i,r){i&1&&w("focus",function(){return r._focusChanged(!0)})("blur",function(){return r._focusChanged(!1)})("input",function(){return r._onInput()}),i&2&&(Gt("id",r.id)("disabled",r.disabled&&!r.disabledInteractive)("required",r.required),j("name",r.name||null)("readonly",r._getReadonlyAttribute())("aria-disabled",r.disabled&&r.disabledInteractive?"true":null)("aria-invalid",r.empty&&r.required?null:r.errorState)("aria-required",r.required)("id",r.id),N("mat-input-server",r._isServer)("mat-mdc-form-field-textarea-control",r._isInFormField&&r._isTextarea)("mat-mdc-form-field-input-control",r._isInFormField)("mat-mdc-input-disabled-interactive",r.disabledInteractive)("mdc-text-field__input",r._isInFormField)("mat-mdc-native-select-inline",r._isInlineSelect()))},inputs:{disabled:"disabled",id:"id",placeholder:"placeholder",name:"name",required:"required",type:"type",errorStateMatcher:"errorStateMatcher",userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],value:"value",readonly:"readonly",disabledInteractive:[2,"disabledInteractive","disabledInteractive",Y]},exportAs:["matInput"],features:[Ie([{provide:ed,useExisting:t}]),Ne]})}return t})(),Jr=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[dn,dn,Zf,_e]})}return t})();function tj(t,n){t&1&&xt(0,"div",2)}var nj=new C("MAT_PROGRESS_BAR_DEFAULT_OPTIONS");var Jf=(()=>{class t{_elementRef=c(L);_ngZone=c($);_changeDetectorRef=c(Me);_renderer=c(xe);_cleanupTransitionEnd;constructor(){let e=Ac(),i=c(nj,{optional:!0});this._isNoopAnimation=e==="di-disabled",e==="reduced-motion"&&this._elementRef.nativeElement.classList.add("mat-progress-bar-reduced-motion"),i&&(i.color&&(this.color=this._defaultColor=i.color),this.mode=i.mode||this.mode)}_isNoopAnimation;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor="primary";get value(){return this._value}set value(e){this._value=lM(e||0),this._changeDetectorRef.markForCheck()}_value=0;get bufferValue(){return this._bufferValue||0}set bufferValue(e){this._bufferValue=lM(e||0),this._changeDetectorRef.markForCheck()}_bufferValue=0;animationEnd=new O;get mode(){return this._mode}set mode(e){this._mode=e,this._changeDetectorRef.markForCheck()}_mode="determinate";ngAfterViewInit(){this._ngZone.runOutsideAngular(()=>{this._cleanupTransitionEnd=this._renderer.listen(this._elementRef.nativeElement,"transitionend",this._transitionendHandler)})}ngOnDestroy(){this._cleanupTransitionEnd?.()}_getPrimaryBarTransform(){return`scaleX(${this._isIndeterminate()?1:this.value/100})`}_getBufferBarFlexBasis(){return`${this.mode==="buffer"?this.bufferValue:100}%`}_isIndeterminate(){return this.mode==="indeterminate"||this.mode==="query"}_transitionendHandler=e=>{this.animationEnd.observers.length===0||!e.target||!e.target.classList.contains("mdc-linear-progress__primary-bar")||(this.mode==="determinate"||this.mode==="buffer")&&this._ngZone.run(()=>this.animationEnd.next({value:this.value}))};static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-progress-bar"]],hostAttrs:["role","progressbar","aria-valuemin","0","aria-valuemax","100","tabindex","-1",1,"mat-mdc-progress-bar","mdc-linear-progress"],hostVars:10,hostBindings:function(i,r){i&2&&(j("aria-valuenow",r._isIndeterminate()?null:r.value)("mode",r.mode),et("mat-"+r.color),N("_mat-animation-noopable",r._isNoopAnimation)("mdc-linear-progress--animation-ready",!r._isNoopAnimation)("mdc-linear-progress--indeterminate",r._isIndeterminate()))},inputs:{color:"color",value:[2,"value","value",Nt],bufferValue:[2,"bufferValue","bufferValue",Nt],mode:"mode"},outputs:{animationEnd:"animationEnd"},exportAs:["matProgressBar"],decls:7,vars:5,consts:[["aria-hidden","true",1,"mdc-linear-progress__buffer"],[1,"mdc-linear-progress__buffer-bar"],[1,"mdc-linear-progress__buffer-dots"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__primary-bar"],[1,"mdc-linear-progress__bar-inner"],["aria-hidden","true",1,"mdc-linear-progress__bar","mdc-linear-progress__secondary-bar"]],template:function(i,r){i&1&&(Ve(0,"div",0),xt(1,"div",1),D(2,tj,1,0,"div",2),Xe(),Ve(3,"div",3),xt(4,"span",4),Xe(),Ve(5,"div",5),xt(6,"span",4),Xe()),i&2&&(p(),jt("flex-basis",r._getBufferBarFlexBasis()),p(),E(r.mode==="buffer"?2:-1),p(),jt("transform",r._getPrimaryBarTransform()))},styles:[`.mat-mdc-progress-bar {
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
`],encapsulation:2})}return t})();function lM(t,n=0,e=100){return Math.max(n,Math.min(e,t))}var eh=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[_e]})}return t})();var bb=["*"];function ij(t,n){t&1&&B(0)}var rj=["tabListContainer"],oj=["tabList"],aj=["tabListInner"],sj=["nextPaginator"],lj=["previousPaginator"],cj=["content"];function dj(t,n){}var uj=["tabBodyWrapper"],mj=["tabHeader"];function fj(t,n){}function hj(t,n){if(t&1&&yt(0,fj,0,0,"ng-template",12),t&2){let e=b().$implicit;M("cdkPortalOutlet",e.templateLabel)}}function pj(t,n){if(t&1&&g(0),t&2){let e=b().$implicit;k(e.textLabel)}}function gj(t,n){if(t&1){let e=se();m(0,"div",7,2),w("click",function(){let r=W(e),o=r.$implicit,a=r.$index,s=b(),l=rt(1);return G(s._handleClick(o,l,a))})("cdkFocusChange",function(r){let o=W(e).$index,a=b();return G(a._tabFocusChanged(r,o))}),V(2,"span",8)(3,"div",9),m(4,"span",10)(5,"span",11),D(6,hj,1,1,null,12)(7,pj,1,1),f()()()}if(t&2){let e=n.$implicit,i=n.$index,r=rt(1),o=b();et(e.labelClass),N("mdc-tab--active",o.selectedIndex===i),M("id",o._getTabLabelId(e,i))("disabled",e.disabled)("fitInkBarToContent",o.fitInkBarToContent),j("tabIndex",o._getTabIndex(i))("aria-posinset",i+1)("aria-setsize",o._tabs.length)("aria-controls",o._getTabContentId(i))("aria-selected",o.selectedIndex===i)("aria-label",e.ariaLabel||null)("aria-labelledby",!e.ariaLabel&&e.ariaLabelledby?e.ariaLabelledby:null),p(3),M("matRippleTrigger",r)("matRippleDisabled",e.disabled||o.disableRipple),p(3),E(e.templateLabel?6:7)}}function _j(t,n){t&1&&B(0)}function vj(t,n){if(t&1){let e=se();m(0,"mat-tab-body",13),w("_onCentered",function(){W(e);let r=b();return G(r._removeTabBodyWrapperHeight())})("_onCentering",function(r){W(e);let o=b();return G(o._setTabBodyWrapperHeight(r))})("_beforeCentering",function(r){W(e);let o=b();return G(o._bodyCentered(r))}),f()}if(t&2){let e=n.$implicit,i=n.$index,r=b();et(e.bodyClass),M("id",r._getTabContentId(i))("content",e.content)("position",e.position)("animationDuration",r._bodyAnimationDuration)("preserveContent",r.preserveContent),j("tabindex",r.contentTabIndex!=null&&r.selectedIndex===i?r.contentTabIndex:null)("aria-labelledby",r._getTabLabelId(e,i))("aria-hidden",r.selectedIndex!==i)}}var bj=new C("MatTabContent"),yj=(()=>{class t{template=c(bt);static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","matTabContent",""]],features:[Ie([{provide:bj,useExisting:t}])]})}return t})(),Cj=new C("MatTabLabel"),fM=new C("MAT_TAB"),wj=(()=>{class t extends yE{_closestTab=c(fM,{optional:!0});static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","mat-tab-label",""],["","matTabLabel",""]],features:[Ie([{provide:Cj,useExisting:t}]),ge]})}return t})(),hM=new C("MAT_TAB_GROUP"),yb=(()=>{class t{_viewContainerRef=c(pt);_closestTabGroup=c(hM,{optional:!0});disabled=!1;get templateLabel(){return this._templateLabel}set templateLabel(e){this._setTemplateLabelInput(e)}_templateLabel;_explicitContent=void 0;_implicitContent;textLabel="";ariaLabel;ariaLabelledby;labelClass;bodyClass;id=null;_contentPortal=null;get content(){return this._contentPortal}_stateChanges=new I;position=null;origin=null;isActive=!1;constructor(){c(tt).load(gn)}ngOnChanges(e){(e.hasOwnProperty("textLabel")||e.hasOwnProperty("disabled"))&&this._stateChanges.next()}ngOnDestroy(){this._stateChanges.complete()}ngOnInit(){this._contentPortal=new cn(this._explicitContent||this._implicitContent,this._viewContainerRef)}_setTemplateLabelInput(e){e&&e._closestTab===this&&(this._templateLabel=e)}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-tab"]],contentQueries:function(i,r,o){if(i&1&&dt(o,wj,5)(o,yj,7,bt),i&2){let a;U(a=z())&&(r.templateLabel=a.first),U(a=z())&&(r._explicitContent=a.first)}},viewQuery:function(i,r){if(i&1&&Te(bt,7),i&2){let o;U(o=z())&&(r._implicitContent=o.first)}},hostAttrs:["hidden",""],hostVars:1,hostBindings:function(i,r){i&2&&j("id",null)},inputs:{disabled:[2,"disabled","disabled",Y],textLabel:[0,"label","textLabel"],ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],labelClass:"labelClass",bodyClass:"bodyClass",id:"id"},exportAs:["matTab"],features:[Ie([{provide:fM,useExisting:t}]),Ne],ngContentSelectors:bb,decls:1,vars:0,template:function(i,r){i&1&&(ve(),Ba(0,ij,1,0,"ng-template"))},encapsulation:2,changeDetection:1})}return t})(),hb="mdc-tab-indicator--active",dM="mdc-tab-indicator--no-transition",gb=class{_items;_currentItem;constructor(n){this._items=n}hide(){this._items.forEach(n=>n.deactivateInkBar()),this._currentItem=void 0}alignToElement(n){let e=this._items.find(r=>r.elementRef.nativeElement===n),i=this._currentItem;if(e!==i&&(i?.deactivateInkBar(),e)){let r=i?.elementRef.nativeElement.getBoundingClientRect?.();e.activateInkBar(r),this._currentItem=e}}},Sj=(()=>{class t{_elementRef=c(L);_inkBarElement=null;_inkBarContentElement=null;_fitToContent=!1;get fitInkBarToContent(){return this._fitToContent}set fitInkBarToContent(e){this._fitToContent!==e&&(this._fitToContent=e,this._inkBarElement&&this._appendInkBarElement())}activateInkBar(e){let i=this._elementRef.nativeElement;if(!e||!i.getBoundingClientRect||!this._inkBarContentElement){i.classList.add(hb);return}let r=i.getBoundingClientRect(),o=e.width/r.width,a=e.left-r.left;i.classList.add(dM),this._inkBarContentElement.style.setProperty("transform",`translateX(${a}px) scaleX(${o})`),i.getBoundingClientRect(),i.classList.remove(dM),i.classList.add(hb),this._inkBarContentElement.style.setProperty("transform","")}deactivateInkBar(){this._elementRef.nativeElement.classList.remove(hb)}ngOnInit(){this._createInkBarElement()}ngOnDestroy(){this._inkBarElement?.remove(),this._inkBarElement=this._inkBarContentElement=null}_createInkBarElement(){let e=this._elementRef.nativeElement.ownerDocument||document,i=this._inkBarElement=e.createElement("span"),r=this._inkBarContentElement=e.createElement("span");i.className="mdc-tab-indicator",r.className="mdc-tab-indicator__content mdc-tab-indicator__content--underline",i.appendChild(this._inkBarContentElement),this._appendInkBarElement()}_appendInkBarElement(){this._inkBarElement;let e=this._fitToContent?this._elementRef.nativeElement.querySelector(".mdc-tab__content"):this._elementRef.nativeElement;e.appendChild(this._inkBarElement)}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,inputs:{fitInkBarToContent:[2,"fitInkBarToContent","fitInkBarToContent",Y]}})}return t})();var pM=(()=>{class t extends Sj{elementRef=c(L);disabled=!1;focus(){this.elementRef.nativeElement.focus()}getOffsetLeft(){return this.elementRef.nativeElement.offsetLeft}getOffsetWidth(){return this.elementRef.nativeElement.offsetWidth}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","matTabLabelWrapper",""]],hostVars:3,hostBindings:function(i,r){i&2&&(j("aria-disabled",!!r.disabled),N("mat-mdc-tab-disabled",r.disabled))},inputs:{disabled:[2,"disabled","disabled",Y]},features:[ge]})}return t})(),uM={passive:!0},xj=650,Dj=100;function pb(t){let n=t+"";return/^[0-9]+(?:\.[0-9]+)?$/.test(n)?`${t}ms`:/^[0-9]+(?:\.[0-9]+)?(?:ms|s)$/.test(n)?n:""}var Ej=(()=>{class t{_elementRef=c(L);_changeDetectorRef=c(Me);_viewportRuler=c(In);_dir=c(wt,{optional:!0});_ngZone=c($);_platform=c(Ce);_sharedResizeObserver=c(qf);_injector=c(K);_renderer=c(xe);_animationsDisabled=Re();_eventCleanups;_scrollDistance=0;_selectedIndexChanged=!1;_destroyed=new I;_showPaginationControls=!1;_disableScrollAfter=!0;_disableScrollBefore=!0;_tabLabelCount;_scrollDistanceChanged=!1;_keyManager;_currentTextContent;_stopScrolling=new I;disablePagination=!1;get selectedIndex(){return this._selectedIndex}set selectedIndex(e){let i=isNaN(e)?0:e;this._selectedIndex!=i&&(this._selectedIndexChanged=!0,this._selectedIndex=i,this._keyManager&&this._keyManager.updateActiveItem(i))}_selectedIndex=0;selectFocusedIndex=new O;indexFocused=new O;constructor(){this._eventCleanups=this._ngZone.runOutsideAngular(()=>[this._renderer.listen(this._elementRef.nativeElement,"mouseleave",()=>this._stopInterval())])}ngAfterViewInit(){this._eventCleanups.push(this._renderer.listen(this._previousPaginator.nativeElement,"touchstart",()=>this._handlePaginatorPress("before"),uM),this._renderer.listen(this._nextPaginator.nativeElement,"touchstart",()=>this._handlePaginatorPress("after"),uM))}ngAfterContentInit(){let e=this._dir?this._dir.change:ie("ltr"),i=this._sharedResizeObserver.observe(this._elementRef.nativeElement).pipe(Zn(32),pe(this._destroyed)),r=this._viewportRuler.change(150).pipe(pe(this._destroyed)),o=()=>{this.updatePagination(),this._alignInkBarToSelectedTab()};this._keyManager=new Br(this._items).withHorizontalOrientation(this._getLayoutDirection()).withHomeAndEnd().withWrap().skipPredicate(()=>!1),this._keyManager.updateActiveItem(Math.max(this._selectedIndex,0)),ct(o,{injector:this._injector}),ft(e,r,i,this._items.changes,this._itemsResized()).pipe(pe(this._destroyed)).subscribe(()=>{this._ngZone.run(()=>{Promise.resolve().then(()=>{this._scrollDistance=Math.max(0,Math.min(this._getMaxScrollDistance(),this._scrollDistance)),o()})}),this._keyManager?.withHorizontalOrientation(this._getLayoutDirection())}),this._keyManager.change.subscribe(a=>{this.indexFocused.emit(a),this._setTabFocus(a)})}_itemsResized(){return typeof ResizeObserver!="function"?at:this._items.changes.pipe(Ze(this._items),_t(e=>new de(i=>this._ngZone.runOutsideAngular(()=>{let r=new ResizeObserver(o=>i.next(o));return e.forEach(o=>r.observe(o.elementRef.nativeElement)),()=>{r.disconnect()}}))),ho(1),me(e=>e.some(i=>i.contentRect.width>0&&i.contentRect.height>0)))}ngAfterContentChecked(){this._tabLabelCount!=this._items.length&&(this.updatePagination(),this._tabLabelCount=this._items.length,this._changeDetectorRef.markForCheck()),this._selectedIndexChanged&&(this._scrollToLabel(this._selectedIndex),this._checkScrollingControls(),this._alignInkBarToSelectedTab(),this._selectedIndexChanged=!1,this._changeDetectorRef.markForCheck()),this._scrollDistanceChanged&&(this._updateTabScrollPosition(),this._scrollDistanceChanged=!1,this._changeDetectorRef.markForCheck())}ngOnDestroy(){this._eventCleanups.forEach(e=>e()),this._keyManager?.destroy(),this._destroyed.next(),this._destroyed.complete(),this._stopScrolling.complete()}_handleKeydown(e){if(!mt(e))switch(e.keyCode){case 13:case 32:if(this.focusIndex!==this.selectedIndex){let i=this._items.get(this.focusIndex);i&&!i.disabled&&(this.selectFocusedIndex.emit(this.focusIndex),this._itemSelected(e))}break;default:this._keyManager?.onKeydown(e)}}_onContentChanges(){let e=this._elementRef.nativeElement.textContent;e!==this._currentTextContent&&(this._currentTextContent=e||"",this._ngZone.run(()=>{this.updatePagination(),this._alignInkBarToSelectedTab(),this._changeDetectorRef.markForCheck()}))}updatePagination(){this._checkPaginationEnabled(),this._checkScrollingControls(),this._updateTabScrollPosition()}get focusIndex(){return this._keyManager?this._keyManager.activeItemIndex:0}set focusIndex(e){!this._isValidIndex(e)||this.focusIndex===e||!this._keyManager||this._keyManager.setActiveItem(e)}_isValidIndex(e){return this._items?!!this._items.toArray()[e]:!0}_setTabFocus(e){if(this._showPaginationControls&&this._scrollToLabel(e),this._items&&this._items.length){this._items.toArray()[e].focus();let i=this._tabListContainer.nativeElement;this._getLayoutDirection()=="ltr"?i.scrollLeft=0:i.scrollLeft=i.scrollWidth-i.offsetWidth}}_getLayoutDirection(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}_updateTabScrollPosition(){if(this.disablePagination)return;let e=this.scrollDistance,i=this._getLayoutDirection()==="ltr"?-e:e;this._tabList.nativeElement.style.transform=`translateX(${Math.round(i)}px)`,(this._platform.TRIDENT||this._platform.EDGE)&&(this._tabListContainer.nativeElement.scrollLeft=0)}get scrollDistance(){return this._scrollDistance}set scrollDistance(e){this._scrollTo(e)}_scrollHeader(e){let i=this._tabListContainer.nativeElement.offsetWidth,r=(e=="before"?-1:1)*i/3;return this._scrollTo(this._scrollDistance+r)}_handlePaginatorClick(e){this._stopInterval(),this._scrollHeader(e)}_scrollToLabel(e){if(this.disablePagination)return;let i=this._items?this._items.toArray()[e]:null;if(!i)return;let r=this._tabListContainer.nativeElement.offsetWidth,{offsetLeft:o,offsetWidth:a}=i.elementRef.nativeElement,s,l;this._getLayoutDirection()=="ltr"?(s=o,l=s+a):(l=this._tabListInner.nativeElement.offsetWidth-o,s=l-a);let d=this.scrollDistance,u=this.scrollDistance+r;s<d?this.scrollDistance-=d-s:l>u&&(this.scrollDistance+=Math.min(l-u,s-d))}_checkPaginationEnabled(){if(this.disablePagination)this._showPaginationControls=!1;else{let e=this._tabListInner.nativeElement.scrollWidth,i=this._elementRef.nativeElement.offsetWidth,r=e-i>=5;r||(this.scrollDistance=0),r!==this._showPaginationControls&&(this._showPaginationControls=r,this._changeDetectorRef.markForCheck())}}_checkScrollingControls(){this.disablePagination?this._disableScrollAfter=this._disableScrollBefore=!0:(this._disableScrollBefore=this.scrollDistance==0,this._disableScrollAfter=this.scrollDistance==this._getMaxScrollDistance(),this._changeDetectorRef.markForCheck())}_getMaxScrollDistance(){let e=this._tabListInner.nativeElement.scrollWidth,i=this._tabListContainer.nativeElement.offsetWidth;return e-i||0}_alignInkBarToSelectedTab(){let e=this._items&&this._items.length?this._items.toArray()[this.selectedIndex]:null,i=e?e.elementRef.nativeElement:null;i?this._inkBar.alignToElement(i):this._inkBar.hide()}_stopInterval(){this._stopScrolling.next()}_handlePaginatorPress(e,i){i&&i.button!=null&&i.button!==0||(this._stopInterval(),uo(xj,Dj).pipe(pe(ft(this._stopScrolling,this._destroyed))).subscribe(()=>{let{maxScrollDistance:r,distance:o}=this._scrollHeader(e);(o===0||o>=r)&&this._stopInterval()}))}_scrollTo(e){if(this.disablePagination)return{maxScrollDistance:0,distance:0};let i=this._getMaxScrollDistance();return this._scrollDistance=Math.max(0,Math.min(i,e)),this._scrollDistanceChanged=!0,this._checkScrollingControls(),{maxScrollDistance:i,distance:this._scrollDistance}}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,inputs:{disablePagination:[2,"disablePagination","disablePagination",Y],selectedIndex:[2,"selectedIndex","selectedIndex",Nt]},outputs:{selectFocusedIndex:"selectFocusedIndex",indexFocused:"indexFocused"}})}return t})(),Mj=(()=>{class t extends Ej{_items;_tabListContainer;_tabList;_tabListInner;_nextPaginator;_previousPaginator;_inkBar;ariaLabel;ariaLabelledby;disableRipple=!1;ngAfterContentInit(){this._inkBar=new gb(this._items),super.ngAfterContentInit()}_itemSelected(e){e.preventDefault()}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275cmp=x({type:t,selectors:[["mat-tab-header"]],contentQueries:function(i,r,o){if(i&1&&dt(o,pM,4),i&2){let a;U(a=z())&&(r._items=a)}},viewQuery:function(i,r){if(i&1&&Te(rj,7)(oj,7)(aj,7)(sj,5)(lj,5),i&2){let o;U(o=z())&&(r._tabListContainer=o.first),U(o=z())&&(r._tabList=o.first),U(o=z())&&(r._tabListInner=o.first),U(o=z())&&(r._nextPaginator=o.first),U(o=z())&&(r._previousPaginator=o.first)}},hostAttrs:[1,"mat-mdc-tab-header"],hostVars:4,hostBindings:function(i,r){i&2&&N("mat-mdc-tab-header-pagination-controls-enabled",r._showPaginationControls)("mat-mdc-tab-header-rtl",r._getLayoutDirection()=="rtl")},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],disableRipple:[2,"disableRipple","disableRipple",Y]},features:[ge],ngContentSelectors:bb,decls:13,vars:10,consts:[["previousPaginator",""],["tabListContainer",""],["tabList",""],["tabListInner",""],["nextPaginator",""],["mat-ripple","",1,"mat-mdc-tab-header-pagination","mat-mdc-tab-header-pagination-before",3,"click","mousedown","touchend","matRippleDisabled"],[1,"mat-mdc-tab-header-pagination-chevron"],[1,"mat-mdc-tab-label-container",3,"keydown"],["role","tablist",1,"mat-mdc-tab-list",3,"cdkObserveContent"],[1,"mat-mdc-tab-labels"],["mat-ripple","",1,"mat-mdc-tab-header-pagination","mat-mdc-tab-header-pagination-after",3,"mousedown","click","touchend","matRippleDisabled"]],template:function(i,r){i&1&&(ve(),m(0,"div",5,0),w("click",function(){return r._handlePaginatorClick("before")})("mousedown",function(a){return r._handlePaginatorPress("before",a)})("touchend",function(){return r._stopInterval()}),V(2,"div",6),f(),m(3,"div",7,1),w("keydown",function(a){return r._handleKeydown(a)}),m(5,"div",8,2),w("cdkObserveContent",function(){return r._onContentChanges()}),m(7,"div",9,3),B(9),f()()(),m(10,"div",10,4),w("mousedown",function(a){return r._handlePaginatorPress("after",a)})("click",function(){return r._handlePaginatorClick("after")})("touchend",function(){return r._stopInterval()}),V(12,"div",6),f()),i&2&&(N("mat-mdc-tab-header-pagination-disabled",r._disableScrollBefore),M("matRippleDisabled",r._disableScrollBefore||r.disableRipple),p(3),N("_mat-animation-noopable",r._animationsDisabled),p(2),j("aria-label",r.ariaLabel||null)("aria-labelledby",r.ariaLabelledby||null),p(5),N("mat-mdc-tab-header-pagination-disabled",r._disableScrollAfter),M("matRippleDisabled",r._disableScrollAfter||r.disableRipple))},dependencies:[or,Jm],styles:[`.mat-mdc-tab-header {
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
`],encapsulation:2,changeDetection:1})}return t})(),Ij=new C("MAT_TABS_CONFIG"),mM=(()=>{class t extends ki{_host=c(_b);_ngZone=c($);_centeringSub=ue.EMPTY;_leavingSub=ue.EMPTY;ngOnInit(){super.ngOnInit(),this._centeringSub=this._host._beforeCentering.pipe(Ze(this._host._isCenterPosition())).subscribe(e=>{this._host._content&&e&&!this.hasAttached()&&this._ngZone.run(()=>{Promise.resolve().then(),this.attach(this._host._content)})}),this._leavingSub=this._host._afterLeavingCenter.subscribe(()=>{this._host.preserveContent||this._ngZone.run(()=>this.detach())})}ngOnDestroy(){super.ngOnDestroy(),this._centeringSub.unsubscribe(),this._leavingSub.unsubscribe()}static \u0275fac=(()=>{let e;return function(r){return(e||(e=Ye(t)))(r||t)}})();static \u0275dir=R({type:t,selectors:[["","matTabBodyHost",""]],features:[ge]})}return t})(),_b=(()=>{class t{_elementRef=c(L);_dir=c(wt,{optional:!0});_ngZone=c($);_injector=c(K);_renderer=c(xe);_diAnimationsDisabled=Re();_eventCleanups;_initialized=!1;_fallbackTimer;_positionIndex;_dirChangeSubscription=ue.EMPTY;_position;_previousPosition;_onCentering=new O;_beforeCentering=new O;_afterLeavingCenter=new O;_onCentered=new O(!0);_portalHost;_contentElement;_content;animationDuration="500ms";preserveContent=!1;set position(e){this._positionIndex=e,this._computePositionAnimationState()}constructor(){if(this._dir){let e=c(Me);this._dirChangeSubscription=this._dir.change.subscribe(i=>{this._computePositionAnimationState(i),e.markForCheck()})}}ngOnInit(){this._bindTransitionEvents(),this._position==="center"&&(this._setActiveClass(!0),ct(()=>this._onCentering.emit(this._elementRef.nativeElement.clientHeight),{injector:this._injector})),this._initialized=!0}ngOnDestroy(){clearTimeout(this._fallbackTimer),this._eventCleanups?.forEach(e=>e()),this._dirChangeSubscription.unsubscribe()}_bindTransitionEvents(){this._ngZone.runOutsideAngular(()=>{let e=this._elementRef.nativeElement,i=r=>{r.target===this._contentElement?.nativeElement&&(this._elementRef.nativeElement.classList.remove("mat-tab-body-animating"),r.type==="transitionend"&&this._transitionDone())};this._eventCleanups=[this._renderer.listen(e,"transitionstart",r=>{r.target===this._contentElement?.nativeElement&&(this._elementRef.nativeElement.classList.add("mat-tab-body-animating"),this._transitionStarted())}),this._renderer.listen(e,"transitionend",i),this._renderer.listen(e,"transitioncancel",i)]})}_transitionStarted(){clearTimeout(this._fallbackTimer);let e=this._position==="center";this._beforeCentering.emit(e),e&&this._onCentering.emit(this._elementRef.nativeElement.clientHeight)}_transitionDone(){this._position==="center"?this._onCentered.emit():this._previousPosition==="center"&&this._afterLeavingCenter.emit()}_setActiveClass(e){this._elementRef.nativeElement.classList.toggle("mat-mdc-tab-body-active",e)}_getLayoutDirection(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}_isCenterPosition(){return this._positionIndex===0}_computePositionAnimationState(e=this._getLayoutDirection()){this._previousPosition=this._position,this._positionIndex<0?this._position=e=="ltr"?"left":"right":this._positionIndex>0?this._position=e=="ltr"?"right":"left":this._position="center",this._animationsDisabled()?this._simulateTransitionEvents():this._initialized&&(this._position==="center"||this._previousPosition==="center")&&(clearTimeout(this._fallbackTimer),this._fallbackTimer=this._ngZone.runOutsideAngular(()=>setTimeout(()=>this._simulateTransitionEvents(),100)))}_simulateTransitionEvents(){this._transitionStarted(),ct(()=>this._transitionDone(),{injector:this._injector})}_animationsDisabled(){return this._diAnimationsDisabled||this.animationDuration==="0ms"||this.animationDuration==="0s"}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-tab-body"]],viewQuery:function(i,r){if(i&1&&Te(mM,5)(cj,5),i&2){let o;U(o=z())&&(r._portalHost=o.first),U(o=z())&&(r._contentElement=o.first)}},hostAttrs:[1,"mat-mdc-tab-body"],hostVars:1,hostBindings:function(i,r){i&2&&j("inert",r._position==="center"?null:"")},inputs:{_content:[0,"content","_content"],animationDuration:"animationDuration",preserveContent:"preserveContent",position:"position"},outputs:{_onCentering:"_onCentering",_beforeCentering:"_beforeCentering",_onCentered:"_onCentered"},decls:3,vars:6,consts:[["content",""],["cdkScrollable","",1,"mat-mdc-tab-body-content"],["matTabBodyHost",""]],template:function(i,r){i&1&&(m(0,"div",1,0),yt(2,dj,0,0,"ng-template",2),f()),i&2&&N("mat-tab-body-content-left",r._position==="left")("mat-tab-body-content-right",r._position==="right")("mat-tab-body-content-can-animate",r._position==="center"||r._previousPosition==="center")},dependencies:[mM,ci],styles:[`.mat-mdc-tab-body {
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
`],encapsulation:2,changeDetection:1})}return t})(),gM=(()=>{class t{_elementRef=c(L);_changeDetectorRef=c(Me);_ngZone=c($);_tabsSubscription=ue.EMPTY;_tabLabelSubscription=ue.EMPTY;_tabBodySubscription=ue.EMPTY;_diAnimationsDisabled=Re();_bodyAnimationDuration;_headerAnimationDuration;_allTabs;_tabBodies;_tabBodyWrapper;_tabHeader;_tabs=new pn;_indexToSelect=0;_lastFocusedTabIndex=null;_tabBodyWrapperHeight=0;color;get fitInkBarToContent(){return this._fitInkBarToContent}set fitInkBarToContent(e){this._fitInkBarToContent=e,this._changeDetectorRef.markForCheck()}_fitInkBarToContent=!1;stretchTabs=!0;alignTabs=null;dynamicHeight=!1;get selectedIndex(){return this._selectedIndex}set selectedIndex(e){this._indexToSelect=isNaN(e)?null:e}_selectedIndex=null;headerPosition="above";get animationDuration(){return this._animationDuration}set animationDuration(e){this._animationDuration=e,e&&typeof e=="object"?(this._bodyAnimationDuration=pb(e.body),this._headerAnimationDuration=pb(e.header)):this._headerAnimationDuration=this._bodyAnimationDuration=pb(e)}_animationDuration;get contentTabIndex(){return this._contentTabIndex}set contentTabIndex(e){this._contentTabIndex=isNaN(e)?null:e}_contentTabIndex=null;disablePagination=!1;disableRipple=!1;preserveContent=!1;get backgroundColor(){return this._backgroundColor}set backgroundColor(e){let i=this._elementRef.nativeElement.classList;i.remove("mat-tabs-with-background",`mat-background-${this.backgroundColor}`),e&&i.add("mat-tabs-with-background",`mat-background-${e}`),this._backgroundColor=e}_backgroundColor;ariaLabel;ariaLabelledby;selectedIndexChange=new O;focusChange=new O;animationDone=new O;selectedTabChange=new O(!0);_groupId;_isServer=!c(Ce).isBrowser;constructor(){let e=c(Ij,{optional:!0});this._groupId=c($e).getId("mat-tab-group-"),this.animationDuration=e&&e.animationDuration?e.animationDuration:"500ms",this.disablePagination=e&&e.disablePagination!=null?e.disablePagination:!1,this.dynamicHeight=e&&e.dynamicHeight!=null?e.dynamicHeight:!1,e?.contentTabIndex!=null&&(this.contentTabIndex=e.contentTabIndex),this.preserveContent=!!e?.preserveContent,this.fitInkBarToContent=e&&e.fitInkBarToContent!=null?e.fitInkBarToContent:!1,this.stretchTabs=e&&e.stretchTabs!=null?e.stretchTabs:!0,this.alignTabs=e&&e.alignTabs!=null?e.alignTabs:null}ngAfterContentChecked(){let e=this._indexToSelect=this._clampTabIndex(this._indexToSelect);if(this._selectedIndex!=e){let i=this._selectedIndex==null;if(!i){this.selectedTabChange.emit(this._createChangeEvent(e));let r=this._tabBodyWrapper.nativeElement;r.style.minHeight=r.clientHeight+"px"}Promise.resolve().then(()=>{this._tabs.forEach((r,o)=>r.isActive=o===e),i||(this.selectedIndexChange.emit(e),this._tabBodyWrapper.nativeElement.style.minHeight="")})}this._tabs.forEach((i,r)=>{i.position=r-e,this._selectedIndex!=null&&i.position==0&&!i.origin&&(i.origin=e-this._selectedIndex)}),this._selectedIndex!==e&&(this._selectedIndex=e,this._lastFocusedTabIndex=null,this._changeDetectorRef.markForCheck())}ngAfterContentInit(){this._subscribeToAllTabChanges(),this._subscribeToTabLabels(),this._tabsSubscription=this._tabs.changes.subscribe(()=>{let e=this._clampTabIndex(this._indexToSelect);if(e===this._selectedIndex){let i=this._tabs.toArray(),r;for(let o=0;o<i.length;o++)if(i[o].isActive){this._indexToSelect=this._selectedIndex=o,this._lastFocusedTabIndex=null,r=i[o];break}!r&&i[e]&&Promise.resolve().then(()=>{i[e].isActive=!0,this.selectedTabChange.emit(this._createChangeEvent(e))})}this._changeDetectorRef.markForCheck()})}ngAfterViewInit(){this._tabBodySubscription=this._tabBodies.changes.subscribe(()=>this._bodyCentered(!0))}_subscribeToAllTabChanges(){this._allTabs.changes.pipe(Ze(this._allTabs)).subscribe(e=>{this._tabs.reset(e.filter(i=>i._closestTabGroup===this||!i._closestTabGroup)),this._tabs.notifyOnChanges()})}ngOnDestroy(){this._tabs.destroy(),this._tabsSubscription.unsubscribe(),this._tabLabelSubscription.unsubscribe(),this._tabBodySubscription.unsubscribe()}realignInkBar(){this._tabHeader&&this._tabHeader._alignInkBarToSelectedTab()}updatePagination(){this._tabHeader&&this._tabHeader.updatePagination()}focusTab(e){let i=this._tabHeader;i&&(i.focusIndex=e)}_focusChanged(e){this._lastFocusedTabIndex=e,this.focusChange.emit(this._createChangeEvent(e))}_createChangeEvent(e){let i=new vb;return i.index=e,this._tabs&&this._tabs.length&&(i.tab=this._tabs.toArray()[e]),i}_subscribeToTabLabels(){this._tabLabelSubscription&&this._tabLabelSubscription.unsubscribe(),this._tabLabelSubscription=ft(...this._tabs.map(e=>e._stateChanges)).subscribe(()=>this._changeDetectorRef.markForCheck())}_clampTabIndex(e){return Math.min(this._tabs.length-1,Math.max(e||0,0))}_getTabLabelId(e,i){return e.id||`${this._groupId}-label-${i}`}_getTabContentId(e){return`${this._groupId}-content-${e}`}_setTabBodyWrapperHeight(e){if(!this.dynamicHeight||!this._tabBodyWrapperHeight){this._tabBodyWrapperHeight=e;return}let i=this._tabBodyWrapper.nativeElement;i.style.height=this._tabBodyWrapperHeight+"px",this._tabBodyWrapper.nativeElement.offsetHeight&&(i.style.height=e+"px")}_removeTabBodyWrapperHeight(){let e=this._tabBodyWrapper.nativeElement;this._tabBodyWrapperHeight=e.clientHeight,e.style.height="",this._ngZone.run(()=>this.animationDone.emit())}_handleClick(e,i,r){i.focusIndex=r,e.disabled||(this.selectedIndex=r)}_getTabIndex(e){let i=this._lastFocusedTabIndex??this.selectedIndex;return e===i?0:-1}_tabFocusChanged(e,i){e&&e!=="mouse"&&e!=="touch"&&(this._tabHeader.focusIndex=i)}_bodyCentered(e){e&&this._tabBodies?.forEach((i,r)=>i._setActiveClass(r===this._selectedIndex))}_bodyAnimationsDisabled(){return this._diAnimationsDisabled||this._bodyAnimationDuration==="0"||this._bodyAnimationDuration==="0ms"}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-tab-group"]],contentQueries:function(i,r,o){if(i&1&&dt(o,yb,5),i&2){let a;U(a=z())&&(r._allTabs=a)}},viewQuery:function(i,r){if(i&1&&Te(uj,5)(mj,5)(_b,5),i&2){let o;U(o=z())&&(r._tabBodyWrapper=o.first),U(o=z())&&(r._tabHeader=o.first),U(o=z())&&(r._tabBodies=o)}},hostAttrs:[1,"mat-mdc-tab-group"],hostVars:13,hostBindings:function(i,r){i&2&&(j("mat-align-tabs",r.alignTabs),et("mat-"+(r.color||"primary")),jt("--%NS%mat-tab-body-animation-duration",r._bodyAnimationDuration)("--%NS%mat-tab-header-animation-duration",r._headerAnimationDuration),N("mat-mdc-tab-group-dynamic-height",r.dynamicHeight)("mat-mdc-tab-group-inverted-header",r.headerPosition==="below")("mat-mdc-tab-group-stretch-tabs",r.stretchTabs))},inputs:{color:"color",fitInkBarToContent:[2,"fitInkBarToContent","fitInkBarToContent",Y],stretchTabs:[2,"mat-stretch-tabs","stretchTabs",Y],alignTabs:[0,"mat-align-tabs","alignTabs"],dynamicHeight:[2,"dynamicHeight","dynamicHeight",Y],selectedIndex:[2,"selectedIndex","selectedIndex",Nt],headerPosition:"headerPosition",animationDuration:"animationDuration",contentTabIndex:[2,"contentTabIndex","contentTabIndex",Nt],disablePagination:[2,"disablePagination","disablePagination",Y],disableRipple:[2,"disableRipple","disableRipple",Y],preserveContent:[2,"preserveContent","preserveContent",Y],backgroundColor:"backgroundColor",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"]},outputs:{selectedIndexChange:"selectedIndexChange",focusChange:"focusChange",animationDone:"animationDone",selectedTabChange:"selectedTabChange"},exportAs:["matTabGroup"],features:[Ie([{provide:hM,useExisting:t}])],ngContentSelectors:bb,decls:9,vars:8,consts:[["tabHeader",""],["tabBodyWrapper",""],["tabNode",""],[3,"indexFocused","selectFocusedIndex","selectedIndex","disableRipple","disablePagination","aria-label","aria-labelledby"],["role","tab","matTabLabelWrapper","","cdkMonitorElementFocus","",1,"mdc-tab","mat-mdc-tab","mat-focus-indicator",3,"id","mdc-tab--active","class","disabled","fitInkBarToContent"],[1,"mat-mdc-tab-body-wrapper"],["role","tabpanel",3,"id","class","content","position","animationDuration","preserveContent"],["role","tab","matTabLabelWrapper","","cdkMonitorElementFocus","",1,"mdc-tab","mat-mdc-tab","mat-focus-indicator",3,"click","cdkFocusChange","id","disabled","fitInkBarToContent"],[1,"mdc-tab__ripple"],["mat-ripple","",1,"mat-mdc-tab-ripple",3,"matRippleTrigger","matRippleDisabled"],[1,"mdc-tab__content"],[1,"mdc-tab__text-label"],[3,"cdkPortalOutlet"],["role","tabpanel",3,"_onCentered","_onCentering","_beforeCentering","id","content","position","animationDuration","preserveContent"]],template:function(i,r){i&1&&(ve(),m(0,"mat-tab-header",3,0),w("indexFocused",function(a){return r._focusChanged(a)})("selectFocusedIndex",function(a){return r.selectedIndex=a}),nt(2,gj,8,17,"div",4,Ua),f(),D(4,_j,1,0),m(5,"div",5,1),nt(7,vj,1,10,"mat-tab-body",6,Ua),f()),i&2&&(M("selectedIndex",r.selectedIndex||0)("disableRipple",r.disableRipple)("disablePagination",r.disablePagination),em("aria-label",r.ariaLabel)("aria-labelledby",r.ariaLabelledby),p(2),it(r._tabs),p(2),E(r._isServer?4:-1),p(),N("_mat-animation-noopable",r._bodyAnimationsDisabled()),p(2),it(r._tabs))},dependencies:[Mj,pM,Nv,or,ki,_b],styles:[`.mdc-tab {
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
`],encapsulation:2,changeDetection:1})}return t})(),vb=class{index;tab};var _M=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[_e]})}return t})();var vM=(t,n)=>n.path;function Tj(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=b();p(),k(e.error())}}function kj(t,n){if(t&1){let e=se();m(0,"button",11),w("click",function(){W(e);let r=b(),o=b();return G(o.browseTo(r.parent))}),m(1,"mat-icon"),g(2,"arrow_upward"),f()()}}function Aj(t,n){t&1&&(m(0,"span",13),g(1,"/"),f())}function Rj(t,n){if(t&1){let e=se();m(0,"button",12),w("click",function(){let r=W(e).$implicit,o=b(2);return G(o.browseTo(r.path))}),g(1),f(),D(2,Aj,2,0,"span",13)}if(t&2){let e=n.$implicit,i=n.$index,r=n.$count;p(),k(e.name),p(),E(i!==r-1?2:-1)}}function Oj(t,n){t&1&&V(0,"mat-progress-bar",6)}function Pj(t,n){if(t&1){let e=se();m(0,"button",14),w("click",function(){let r=W(e).$implicit,o=b(2);return G(o.browseTo(r.path))}),m(1,"mat-icon",15),g(2,"folder"),f(),m(3,"span",16),g(4),f(),m(5,"mat-icon",17),g(6,"chevron_right"),f()()}if(t&2){let e=n.$implicit;p(4),k(e.name)}}function Fj(t,n){t&1&&(m(0,"p",18),g(1,"No subdirectories found"),f())}function Lj(t,n){if(t&1&&D(0,Fj,2,0,"p",18),t&2){let e=b(2);E(e.loading()?-1:0)}}function jj(t,n){if(t&1){let e=se();m(0,"nav",3),D(1,kj,3,0,"button",4),nt(2,Rj,3,2,null,null,vM),f(),m(4,"div",5),D(5,Oj,1,0,"mat-progress-bar",6),nt(6,Pj,7,1,"button",7,vM,!1,Lj,1,1),f(),m(9,"div",8)(10,"span",9),g(11),f(),m(12,"button",10),w("click",function(){W(e);let r=b();return G(r.selectCurrent())}),m(13,"mat-icon"),g(14,"check"),f(),g(15," Select current folder "),f()()}if(t&2){let e=n,i=b();p(),E(e.parent?1:-1),p(),it(e.breadcrumbs),p(3),E(i.loading()?5:-1),p(),it(e.directories),p(4),M("title",e.current),p(),k(e.current)}}function Vj(t,n){t&1&&(m(0,"div",2),V(1,"mat-progress-bar",6),f())}var Vs=class t{constructor(){this.initialPath="";this.folderBrowsed=new O;this.folderSelected=new O;this.listing=T(null);this.loading=T(!1);this.error=T("");this.api=c(ws);this.loadedPath="";this.loadSequence=0}ngOnInit(){this.loadDirectory(this.initialPath||void 0)}ngOnChanges(n){n.initialPath&&!n.initialPath.firstChange&&this.initialPath&&this.browseTo(this.initialPath)}browseTo(n){!n||n===this.loadedPath||this.loadDirectory(n)}loadDirectory(n){return P(this,null,function*(){let e=++this.loadSequence;this.loadedPath=n||"",this.loading.set(!0),this.error.set("");try{let i=yield this.api.fetchDirectories(n);if(e!==this.loadSequence)return;this.listing.set(i),this.loadedPath=i.current,this.folderBrowsed.emit({path:i.current,name:i.name})}catch(i){if(e!==this.loadSequence)return;this.loadedPath=this.listing()?.current??"",this.error.set(i instanceof Error?i.message:"Failed to load directories")}finally{e===this.loadSequence&&this.loading.set(!1)}})}selectCurrent(){let n=this.listing();n&&this.folderSelected.emit({path:n.current,name:n.name})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-folder-picker"]],inputs:{initialPath:"initialPath"},outputs:{folderBrowsed:"folderBrowsed",folderSelected:"folderSelected"},features:[Ne],decls:4,vars:2,consts:[[1,"picker"],["role","alert",1,"error-box"],[1,"loading"],["aria-label","Directory path",1,"breadcrumbs"],["mat-button","","type","button","aria-label","Go to parent directory"],["aria-label","Subdirectories",1,"directory-list"],["mode","indeterminate","aria-label","Loading directories"],["mat-list-item","","type","button"],[1,"picker-actions"],[1,"current-path",3,"title"],["mat-flat-button","","color","primary","type","button",3,"click"],["mat-button","","type","button","aria-label","Go to parent directory",3,"click"],["mat-button","","type","button",1,"crumb",3,"click"],["aria-hidden","true"],["mat-list-item","","type","button",3,"click"],["matListItemIcon",""],["matListItemTitle",""],["matListItemMeta",""],[1,"empty"]],template:function(e,i){if(e&1&&(m(0,"div",0),D(1,Tj,2,1,"div",1),D(2,jj,16,5)(3,Vj,2,0,"div",2),f()),e&2){let r;p(),E(i.error()?1:-1),p(),E((r=i.listing())?2:i.loading()?3:-1,r)}},dependencies:[lm,Pe,ot,Fe,We,Rf,Af,Yc,qc,nb,eh,Jf],styles:["[_nghost-%COMP%]{display:block}.picker[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:12px}.breadcrumbs[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap;gap:2px;padding:4px;border-radius:12px;background:var(--%NS%mat-sys-surface-container-low);color:var(--%NS%mat-sys-on-surface-variant)}.breadcrumbs[_ngcontent-%COMP%]   .crumb[_ngcontent-%COMP%]{min-width:0;padding-inline:7px}.directory-list[_ngcontent-%COMP%]{min-height:170px;max-height:250px;overflow:auto;border:1px solid var(--%NS%mat-sys-outline-variant);border-radius:12px}.directory-list[_ngcontent-%COMP%]   mat-progress-bar[_ngcontent-%COMP%]{position:sticky;top:0;z-index:1}.directory-list[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:100%;text-align:left}.empty[_ngcontent-%COMP%]{padding:32px 16px;margin:0;color:var(--%NS%mat-sys-outline);text-align:center}.loading[_ngcontent-%COMP%]{min-height:170px;display:grid;align-content:center}.picker-actions[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:12px}.current-path[_ngcontent-%COMP%]{min-width:0;overflow:hidden;color:var(--%NS%mat-sys-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.78rem;text-overflow:ellipsis;white-space:nowrap}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:12px;background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){.picker-actions[_ngcontent-%COMP%]{align-items:stretch;flex-direction:column}.current-path[_ngcontent-%COMP%]{white-space:normal;overflow-wrap:anywhere}}"]})}};function Bj(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=b();p(),k(e.errorMessage)}}function Hj(t,n){if(t&1&&(m(0,"div",7),g(1,"Browsing: "),m(2,"code"),g(3),f(),V(4,"br"),g(5,"Select the current folder to use it."),f()),t&2){let e=b();p(3),k(e.browsedPath)}}function Uj(t,n){if(t&1){let e=se();m(0,"div",12)(1,"strong"),g(2,"Selected directory"),f(),m(3,"code"),g(4),f()(),m(5,"mat-form-field",9)(6,"mat-label"),g(7,"Project display name"),f(),m(8,"input",13),ai("ngModelChange",function(r){W(e);let o=b();return Mi(o.projectName,r)||(o.projectName=r),G(r)}),w("ngModelChange",function(){W(e);let r=b();return G(r.projectNameEdited=!0)}),f(),ii(),f()}if(t&2){let e=b();p(4),k(e.selectedPath),p(4),oi("ngModel",e.projectName),ri()}}function zj(t,n){if(t&1&&(m(0,"div",7),g(1,"Browsing: "),m(2,"code"),g(3),f(),V(4,"br"),g(5,"Select the current folder to use it."),f()),t&2){let e=b();p(3),k(e.cloneBrowsedPath)}}function $j(t,n){if(t&1&&(m(0,"div",12)(1,"strong"),g(2,"Parent path"),f(),m(3,"code"),g(4),f()()),t&2){let e=b();p(4),k(e.cloneParentPath)}}function Wj(t,n){t&1&&V(0,"mat-progress-bar",14)}function Gj(t,n){if(t&1){let e=se();m(0,"button",18),w("click",function(){W(e);let r=b();return G(r.createFromFolder())}),g(1,"Create project"),f()}if(t&2){let e=b();M("disabled",!e.selectedPath||!e.projectName.trim())}}function qj(t,n){if(t&1){let e=se();m(0,"button",18),w("click",function(){W(e);let r=b();return G(r.cloneRepository())}),g(1,"Clone & create"),f()}if(t&2){let e=b();M("disabled",!e.repoUrl.trim()||!e.cloneParentPath||e.cloning)}}var Bs=class t{constructor(n){this.state=c(Le);this.dialogRef=c(Zt);this.router=c(an);this.modeIndex=0;this.projectName="";this.projectNameEdited=!1;this.selectedPath="";this.browsedPath="";this.repoUrl="";this.cloneParentPath="";this.cloneBrowsedPath="";this.cloneProjectName="";this.cloning=!1;this.errorMessage=""}folderBrowsed(n){this.browsedPath=n.path}folderSelected(n){this.selectedPath=n.path,this.projectNameEdited||(this.projectName=n.name)}cloneFolderBrowsed(n){this.cloneBrowsedPath=n.path}cloneFolderSelected(n){this.cloneParentPath=n.path}createFromFolder(){return P(this,null,function*(){if(!this.selectedPath||!this.projectName.trim()){this.errorMessage="Please select a folder and specify a project name.";return}try{this.errorMessage="";let n=yield this.state.createProject(this.projectName.trim(),this.selectedPath);this.dialogRef.close(n),yield this.router.navigate(["/projects",n.id])}catch(n){this.errorMessage=n instanceof Error?n.message:"Failed to create project"}})}cloneRepository(){return P(this,null,function*(){if(!this.repoUrl.trim()||!this.cloneParentPath){this.errorMessage="Please provide repository URL and destination parent directory.";return}this.cloning=!0,this.errorMessage="";try{let n=yield this.state.cloneProject({url:this.repoUrl.trim(),parent_path:this.cloneParentPath,name:this.cloneProjectName.trim()||void 0});this.dialogRef.close(n),yield this.router.navigate(["/projects",n.id])}catch(n){this.errorMessage=n instanceof Error?n.message:"Failed to clone repository"}finally{this.cloning=!1}})}static{this.\u0275fac=function(e){return new(e||t)(ne(Nn))}}static{this.\u0275cmp=x({type:t,selectors:[["hub-project-dialog"]],decls:35,vars:11,consts:[["mat-dialog-title",""],["role","alert",1,"error-box"],[3,"selectedIndexChange","selectedIndex"],["label","Existing folder"],[1,"tab-content"],[1,"help"],[3,"folderBrowsed","folderSelected"],[1,"path-note"],["label","Clone repository"],["appearance","outline"],["matInput","","placeholder","https://github.com/org/repo.git","autocomplete","off",3,"ngModelChange","ngModel"],[1,"field-label"],[1,"selected-path"],["matInput","","autocomplete","off",3,"ngModelChange","ngModel"],["mode","indeterminate","aria-label","Cloning repository"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","color","primary","type","button",3,"disabled"],["mat-flat-button","","color","primary","type","button",3,"click","disabled"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"New project"),f(),m(2,"mat-dialog-content"),D(3,Bj,2,1,"div",1),m(4,"mat-tab-group",2),ai("selectedIndexChange",function(o){return Mi(i.modeIndex,o)||(i.modeIndex=o),o}),m(5,"mat-tab",3)(6,"div",4)(7,"p",5),g(8,"Choose a directory already available on the server."),f(),m(9,"hub-folder-picker",6),w("folderBrowsed",function(o){return i.folderBrowsed(o)})("folderSelected",function(o){return i.folderSelected(o)}),f(),D(10,Hj,6,1,"div",7),D(11,Uj,9,2),f()(),m(12,"mat-tab",8)(13,"div",4)(14,"mat-form-field",9)(15,"mat-label"),g(16,"Git repository URL (HTTPS or SSH)"),f(),m(17,"input",10),ai("ngModelChange",function(o){return Mi(i.repoUrl,o)||(i.repoUrl=o),o}),f(),ii(),m(18,"mat-hint"),g(19,"Plain HTTP URLs are not accepted by the server."),f()(),m(20,"p",11),g(21,"Destination parent directory"),f(),m(22,"hub-folder-picker",6),w("folderBrowsed",function(o){return i.cloneFolderBrowsed(o)})("folderSelected",function(o){return i.cloneFolderSelected(o)}),f(),D(23,zj,6,1,"div",7),D(24,$j,5,1,"div",12),m(25,"mat-form-field",9)(26,"mat-label"),g(27,"Project / folder name (optional)"),f(),m(28,"input",13),ai("ngModelChange",function(o){return Mi(i.cloneProjectName,o)||(i.cloneProjectName=o),o}),f(),ii(),f(),D(29,Wj,1,0,"mat-progress-bar",14),f()()()(),m(30,"mat-dialog-actions",15)(31,"button",16),w("click",function(){return i.dialogRef.close()}),g(32,"Cancel"),f(),D(33,Gj,2,1,"button",17)(34,qj,2,1,"button",17),f()),e&2&&(p(3),E(i.errorMessage?3:-1),p(),oi("selectedIndex",i.modeIndex),p(6),E(i.browsedPath&&i.browsedPath!==i.selectedPath?10:-1),p(),E(i.selectedPath?11:-1),p(6),oi("ngModel",i.repoUrl),ri(),p(6),E(i.cloneBrowsedPath&&i.cloneBrowsedPath!==i.cloneParentPath?23:-1),p(),E(i.cloneParentPath?24:-1),p(4),oi("ngModel",i.cloneProjectName),ri(),p(),E(i.cloning?29:-1),p(2),M("disabled",i.cloning),p(2),E(i.modeIndex===0?33:34))},dependencies:[Gr,Ti,Wr,ta,Vs,Pe,ot,Tt,Hn,zn,Un,dn,Wn,Tn,Jc,Fe,Jr,Kr,eh,Jf,_M,yb,gM],styles:["mat-dialog-content[_ngcontent-%COMP%]{min-width:min(600px,100vw - 48px);max-height:min(680px,70vh)}.tab-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:14px;padding:22px 4px 8px}mat-form-field[_ngcontent-%COMP%]{width:100%}.help[_ngcontent-%COMP%], .field-label[_ngcontent-%COMP%]{margin:0;color:var(--%NS%mat-sys-on-surface-variant);font-size:.9rem}.field-label[_ngcontent-%COMP%]{font-weight:600}.path-note[_ngcontent-%COMP%], .selected-path[_ngcontent-%COMP%]{padding:10px 12px;border-radius:10px;background:var(--%NS%mat-sys-surface-container);color:var(--%NS%mat-sys-on-surface-variant);font-size:.82rem}.selected-path[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px}code[_ngcontent-%COMP%]{overflow-wrap:anywhere;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:12px;background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};var th=class t{constructor(n){this.document=n;this.mode=T(this.readMode());Lt(()=>{let e=this.mode();this.document.documentElement.dataset.theme=e,typeof localStorage<"u"&&localStorage.setItem("agent-hub-theme",e)})}cycle(){let n={system:"light",light:"dark",dark:"system"};this.mode.set(n[this.mode()])}icon(){return this.mode()==="dark"?"dark_mode":this.mode()==="light"?"light_mode":"brightness_auto"}label(){return this.mode()==="dark"?"Dark theme":this.mode()==="light"?"Light theme":"Use system theme"}readMode(){if(typeof localStorage>"u")return"system";let n=localStorage.getItem("agent-hub-theme");return n==="light"||n==="dark"||n==="system"?n:"system"}static{this.\u0275fac=function(e){return new(e||t)(te(X))}}static{this.\u0275prov=fe({token:t,factory:t.\u0275fac,providedIn:"root"})}};var bM=t=>["/projects",t],Yj=()=>({exact:!0}),Zj=(t,n)=>["/projects",t,"chats",n],yM=(t,n)=>n.id;function Qj(t,n){if(t&1){let e=se();m(0,"a",18),w("click",function(){W(e);let r=b();return G(r.closeRequested.emit())}),m(1,"mat-icon",19),g(2,"folder"),f(),m(3,"span",20),g(4),f()()}if(t&2){let e=n.$implicit;M("routerLink",Fo(4,bM,e.id))("routerLinkActiveOptions",ql(6,Yj)),j("aria-label","Open project "+e.name),p(4),k(e.name)}}function Xj(t,n){t&1&&(m(0,"div",11),g(1,"No projects yet"),f())}function Kj(t,n){if(t&1){let e=se();m(0,"a",28),w("click",function(){W(e);let r=b(2);return G(r.closeRequested.emit())}),V(1,"span",29),m(2,"span",20),g(3),f(),m(4,"span",30),g(5),f()()}if(t&2){let e=n.$implicit;M("routerLink",Yl(8,Zj,e.project_id,e.id)),j("aria-label","Open chat "+(e.title||"Untitled chat")),p(),N("running",e.process_state==="RUNNING")("dead",e.process_state==="DEAD"),p(2),k(e.title||"Untitled chat"),p(2),k(e.agent)}}function Jj(t,n){t&1&&(m(0,"div",11),g(1,"No chats yet"),f())}function eV(t,n){if(t&1){let e=se();m(0,"section",12)(1,"div",21)(2,"a",22),w("click",function(){W(e);let r=b();return G(r.closeRequested.emit())}),g(3),f(),m(4,"span",23),g(5),f()(),m(6,"button",24),w("click",function(){W(e);let r=b();return G(r.newChat())}),m(7,"mat-icon"),g(8,"add_comment"),f(),g(9," New chat "),f(),m(10,"div",25)(11,"span"),g(12),f(),m(13,"button",26),w("click",function(){W(e);let r=b();return G(r.state.setShowArchived(!r.state.showArchived()))}),g(14),f()(),m(15,"mat-nav-list"),nt(16,Kj,6,11,"a",27,yM,!1,Jj,2,0,"div",11),f()()}if(t&2){let e=n,i=b();p(2),M("routerLink",Fo(7,bM,e.id)),p(),k(e.name),p(),M("title",e.path),p(),k(e.path),p(7),ut("Chats (",i.visibleChats().length,")"),p(2),ut(" ",i.state.showArchived()?"Active only":"Archived"," "),p(2),it(i.visibleChats())}}var nh=class t{constructor(){this.closeRequested=new O;this.state=c(Le);this.theme=c(th);this.dialog=c(Ai);this.router=c(an)}visibleChats(){let n=this.state.activeProjectId(),e=n?this.state.chatsByProject()[n]??[]:[];return this.state.showArchived()?e:e.filter(i=>!i.archived)}goHome(){this.router.navigate(["/"]),this.closeRequested.emit()}newProject(){this.dialog.open(Bs,{width:"min(720px, calc(100vw - 32px))"}),this.closeRequested.emit()}newChat(){let n=this.state.activeProjectId();n&&(this.dialog.open(Ls,{width:"min(560px, calc(100vw - 32px))",data:{projectId:n}}),this.closeRequested.emit())}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-navigation"]],outputs:{closeRequested:"closeRequested"},decls:33,vars:8,consts:[[1,"navigation-header"],["mat-button","","type","button","aria-label","Go to projects",1,"brand",3,"click"],[1,"brand-mark"],[1,"brand-name"],["mat-icon-button","","matTooltip","Close navigation","aria-label","Close navigation",3,"click"],[1,"navigation-body"],["aria-labelledby","projects-heading"],[1,"section-heading"],["id","projects-heading"],["mat-icon-button","","matTooltip","New project","aria-label","New project",3,"click"],["mat-list-item","","routerLinkActive","selected",3,"routerLink","routerLinkActiveOptions"],[1,"empty-navigation"],["aria-labelledby","active-project-heading",1,"active-project"],[1,"navigation-footer"],[1,"socket-state"],[1,"socket-dot"],[1,"footer-actions"],["mat-icon-button","",3,"click","matTooltip"],["mat-list-item","","routerLinkActive","selected",3,"click","routerLink","routerLinkActiveOptions"],["matListItemIcon",""],["matListItemTitle",""],[1,"project-summary"],["id","active-project-heading",3,"click","routerLink"],[3,"title"],["mat-flat-button","","color","primary",1,"new-chat-button",3,"click"],[1,"section-heading","chats-heading"],["mat-button","",1,"archive-toggle",3,"click"],["mat-list-item","","routerLinkActive","selected",3,"routerLink"],["mat-list-item","","routerLinkActive","selected",3,"click","routerLink"],["matListItemIcon","",1,"chat-status"],[1,"agent-label"]],template:function(e,i){if(e&1&&(m(0,"header",0)(1,"button",1),w("click",function(){return i.goHome()}),m(2,"span",2)(3,"mat-icon"),g(4,"hub"),f()(),m(5,"span",3),g(6,"Agent Hub"),f()(),m(7,"button",4),w("click",function(){return i.closeRequested.emit()}),m(8,"mat-icon"),g(9,"close"),f()()(),m(10,"div",5)(11,"section",6)(12,"div",7)(13,"span",8),g(14,"Projects"),f(),m(15,"button",9),w("click",function(){return i.newProject()}),m(16,"mat-icon"),g(17,"add"),f()()(),m(18,"mat-nav-list"),nt(19,Qj,5,7,"a",10,yM,!1,Xj,2,0,"div",11),f()(),D(22,eV,19,9,"section",12),f(),m(23,"footer",13)(24,"span",14),V(25,"span",15),g(26),f(),m(27,"span",16)(28,"span"),g(29,"v0.2.0"),f(),m(30,"button",17),w("click",function(){return i.theme.cycle()}),m(31,"mat-icon"),g(32),f()()()()),e&2){let r;p(19),it(i.state.projects()),p(3),E((r=i.state.activeProject())?22:-1,r),p(3),et(i.state.wsStatus()),p(),k(i.state.wsStatus()),p(4),M("matTooltip",i.theme.label()),j("aria-label",i.theme.label()),p(2),k(i.theme.icon())}},dependencies:[Pe,ot,Mn,Tt,Ss,Fe,We,Rf,bE,Af,Yc,qc,Yr,ur,Ni,Sv],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;height:100%;min-width:280px;background:var(--%NS%mat-sys-surface-container-low)}.navigation-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:18px 16px 12px}.brand[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:12px;border:0;padding:0;background:transparent;color:inherit;font:inherit;cursor:pointer}.brand-mark[_ngcontent-%COMP%]{display:grid;place-items:center;width:40px;height:40px;border-radius:16px 16px 16px 4px;background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container)}.brand-name[_ngcontent-%COMP%]{font-size:1.25rem;font-weight:600}.navigation-body[_ngcontent-%COMP%]{flex:1;overflow:auto;padding:8px 12px 20px}.section-heading[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;padding:4px 8px;color:var(--%NS%mat-sys-on-surface-variant);font-size:.8rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase}.section-heading[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{flex:0 0 auto}mat-nav-list[_ngcontent-%COMP%]{padding:0}mat-list-item[_ngcontent-%COMP%]{margin:2px 0;border-radius:12px}mat-list-item.selected[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container)}.empty-navigation[_ngcontent-%COMP%]{padding:12px;color:var(--%NS%mat-sys-outline);font-size:.875rem;text-align:center}.active-project[_ngcontent-%COMP%]{margin-top:20px}.project-summary[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:2px;padding:12px;margin-bottom:10px;border-radius:12px;background:var(--%NS%mat-sys-surface-container)}.project-summary[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:inherit;font-weight:600;text-decoration:none}.project-summary[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{overflow:hidden;color:var(--%NS%mat-sys-on-surface-variant);font-size:.75rem;text-overflow:ellipsis;white-space:nowrap}.new-chat-button[_ngcontent-%COMP%]{width:100%;margin:2px 0 16px}.chats-heading[_ngcontent-%COMP%]{padding-right:0}.archive-toggle[_ngcontent-%COMP%]{min-width:0}.chat-status[_ngcontent-%COMP%]{width:8px;height:8px;margin:0 16px 0 8px;border-radius:50%;background:var(--%NS%hub-status-stopped)}.chat-status.running[_ngcontent-%COMP%]{background:var(--%NS%hub-status-running)}.chat-status.dead[_ngcontent-%COMP%]{background:var(--%NS%hub-status-dead)}.agent-label[_ngcontent-%COMP%]{margin-left:auto;color:var(--%NS%mat-sys-on-surface-variant);font-size:.72rem;text-transform:lowercase}.navigation-footer[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 20px;border-top:1px solid var(--%NS%mat-sys-outline-variant);color:var(--%NS%mat-sys-on-surface-variant);font-size:.75rem}.socket-state[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:6px;text-transform:capitalize}.socket-dot[_ngcontent-%COMP%]{width:7px;height:7px;border-radius:50%;background:var(--%NS%hub-status-dead)}.socket-dot.connected[_ngcontent-%COMP%]{background:var(--%NS%hub-status-running)}.socket-dot.connecting[_ngcontent-%COMP%]{background:var(--%NS%hub-status-starting)}@media(min-width:840px){[_nghost-%COMP%] > .navigation-header[_ngcontent-%COMP%] > button[_ngcontent-%COMP%]:last-child{visibility:hidden}}"]})}};function tV(t,n){if(t&1){let e=se();m(0,"button",11),w("click",function(){W(e);let r=b(2),o=rt(2);return G(r.openDrawer(o))}),m(1,"mat-icon"),g(2,"menu"),f()()}}function nV(t,n){if(t&1&&(m(0,"mat-toolbar",4),D(1,tV,3,0,"button",6),m(2,"span",7),g(3),f(),V(4,"span",8),m(5,"span",9),V(6,"span",10),m(7,"span"),g(8),f()()()),t&2){let e=b();p(),E(e.compact()?1:-1),p(2),k(e.state.activeProject()?.name||"Agent Hub"),p(2),j("aria-label","WebSocket "+e.state.wsStatus()),p(),et(e.state.wsStatus()),p(2),k(e.state.wsStatus())}}var ih=class t{constructor(){this.state=c(Le);this.compact=T(!1);this.breakpointObserver=c(Go);this.destroyRef=c(Je);this.breakpointObserver.observe("(max-width: 839px)").pipe(Ym(this.destroyRef)).subscribe(({matches:n})=>{this.compact.set(n),n||this.state.setMobileDrawerOpen(!1)})}openDrawer(n){this.state.setMobileDrawerOpen(!0),n.open()}closeDrawer(n){this.state.setMobileDrawerOpen(!1),this.compact()&&n.close()}onDrawerChange(n){this.compact()&&this.state.setMobileDrawerOpen(n)}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-root"]],decls:8,vars:3,consts:[["drawer",""],[1,"hub-shell"],["aria-label","Project and chat navigation",3,"openedChange","mode","opened"],[3,"closeRequested"],[1,"top-bar"],[1,"page-content"],["mat-icon-button","","aria-label","Open navigation"],[1,"top-title"],[1,"toolbar-spacer"],[1,"socket-summary"],[1,"socket-dot"],["mat-icon-button","","aria-label","Open navigation",3,"click"]],template:function(e,i){if(e&1){let r=se();m(0,"mat-sidenav-container",1)(1,"mat-sidenav",2,0),w("openedChange",function(a){return i.onDrawerChange(a)}),m(3,"hub-navigation",3),w("closeRequested",function(){W(r);let a=rt(2);return G(i.closeDrawer(a))}),f()(),m(4,"mat-sidenav-content"),D(5,nV,9,6,"mat-toolbar",4),m(6,"main",5),V(7,"router-outlet"),f()()()}e&2&&(p(),M("mode",i.compact()?"over":"side")("opened",!i.compact()||i.state.isMobileDrawerOpen()),p(4),E(i.state.activeChatId()?-1:5))},dependencies:[Pe,Mn,Fe,We,mf,zv,FD,df,VD,jD,nh,yc],styles:["[_nghost-%COMP%]{display:block;min-height:100vh}.hub-shell[_ngcontent-%COMP%]{min-height:100vh}mat-sidenav[_ngcontent-%COMP%]{width:304px;max-width:86vw}mat-sidenav-content[_ngcontent-%COMP%]{display:flex;min-height:100vh;flex-direction:column}.top-bar[_ngcontent-%COMP%]{position:sticky;top:0;z-index:2;flex:0 0 auto;border-bottom:1px solid var(--%NS%mat-sys-outline-variant)}.top-title[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.toolbar-spacer[_ngcontent-%COMP%]{flex:1}.socket-summary[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:7px;color:var(--%NS%mat-sys-on-surface-variant);font-size:.78rem;text-transform:capitalize}.socket-dot[_ngcontent-%COMP%]{width:7px;height:7px;border-radius:50%;background:var(--%NS%hub-status-dead)}.socket-dot.connected[_ngcontent-%COMP%]{background:var(--%NS%hub-status-running)}.socket-dot.connecting[_ngcontent-%COMP%]{background:var(--%NS%hub-status-starting)}.page-content[_ngcontent-%COMP%]{display:flex;min-height:0;flex:1;flex-direction:column}"]})}};var iV=["*",[["mat-option"],["ng-container"]]],rV=["*","mat-option, ng-container"],oV=["text"],aV=[[["mat-icon"]],"*"],sV=["mat-icon","*"];function lV(t,n){if(t&1&&V(0,"mat-pseudo-checkbox",1),t&2){let e=b();M("disabled",e.disabled)("state",e.selected?"checked":"unchecked")}}function cV(t,n){if(t&1&&V(0,"mat-pseudo-checkbox",3),t&2){let e=b();M("disabled",e.disabled)}}function dV(t,n){if(t&1&&(m(0,"span",4),g(1),f()),t&2){let e=b();p(),ut("(",e.group.label,")")}}var rh=new C("MAT_OPTION_PARENT_COMPONENT"),oh=new C("MatOptgroup"),wb=(()=>{class t{label;disabled=!1;_labelId=c($e).getId("mat-optgroup-label-");_inert;constructor(){let e=c(rh,{optional:!0});this._inert=e?.inertGroups??!1}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-optgroup"]],hostAttrs:[1,"mat-mdc-optgroup"],hostVars:3,hostBindings:function(i,r){i&2&&j("role",r._inert?null:"group")("aria-disabled",r._inert?null:r.disabled.toString())("aria-labelledby",r._inert?null:r._labelId)},inputs:{label:"label",disabled:[2,"disabled","disabled",Y]},exportAs:["matOptgroup"],features:[Ie([{provide:oh,useExisting:t}])],ngContentSelectors:rV,decls:5,vars:4,consts:[["role","presentation",1,"mat-mdc-optgroup-label",3,"id"],[1,"mdc-list-item__primary-text"]],template:function(i,r){i&1&&(ve(iV),Ve(0,"span",0)(1,"span",1),g(2),B(3),Xe()(),B(4,1)),i&2&&(N("mdc-list-item--disabled",r.disabled),Gt("id",r._labelId),p(2),ut("",r.label," "))},styles:[`.mat-mdc-optgroup {
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
`],encapsulation:2})}return t})(),Cb=class{source;isUserInput;constructor(n,e=!1){this.source=n,this.isUserInput=e}},Hs=(()=>{class t{_element=c(L);_changeDetectorRef=c(Me);_parent=c(rh,{optional:!0});group=c(oh,{optional:!0});_signalDisableRipple=!1;_selected=!1;_active=!1;_mostRecentViewValue="";get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=c($e).getId("mat-option-");get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=T(!1);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return!!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new O;_text;_stateChanges=new I;constructor(){let e=c(tt);e.load(gn),e.load(hs),this._signalDisableRipple=!!this._parent&&hn(this._parent.disableRipple)}get active(){return this._active}get viewValue(){return(this._text?.nativeElement.textContent||"").trim()}select(e=!0){this._selected||(this._selected=!0,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}deselect(e=!0){this._selected&&(this._selected=!1,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}focus(e,i){let r=this._getHostElement();typeof r.focus=="function"&&r.focus(i)}setActiveStyles(){this._active||(this._active=!0,this._changeDetectorRef.markForCheck())}setInactiveStyles(){this._active&&(this._active=!1,this._changeDetectorRef.markForCheck())}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!mt(e)&&(this._selectViaInteraction(),e.preventDefault())}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:!0,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(!0))}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e)}}ngOnDestroy(){this._stateChanges.complete()}_emitSelectionChangeEvent(e=!1){this.onSelectionChange.emit(new Cb(this,e))}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-option"]],viewQuery:function(i,r){if(i&1&&Te(oV,7),i&2){let o;U(o=z())&&(r._text=o.first)}},hostAttrs:["role","option",1,"mat-mdc-option","mdc-list-item"],hostVars:11,hostBindings:function(i,r){i&1&&w("click",function(){return r._selectViaInteraction()})("keydown",function(a){return r._handleKeydown(a)}),i&2&&(Gt("id",r.id),j("aria-selected",r.selected)("aria-disabled",r.disabled.toString()),N("mdc-list-item--selected",r.selected)("mat-mdc-option-multiple",r.multiple)("mat-mdc-option-active",r.active)("mdc-list-item--disabled",r.disabled))},inputs:{value:"value",id:"id",disabled:[2,"disabled","disabled",Y]},outputs:{onSelectionChange:"onSelectionChange"},exportAs:["matOption"],ngContentSelectors:sV,decls:8,vars:5,consts:[["text",""],["aria-hidden","true",1,"mat-mdc-option-pseudo-checkbox",3,"disabled","state"],[1,"mdc-list-item__primary-text"],["state","checked","aria-hidden","true","appearance","minimal",1,"mat-mdc-option-pseudo-checkbox",3,"disabled"],[1,"cdk-visually-hidden"],["aria-hidden","true","mat-ripple","",1,"mat-mdc-option-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled"]],template:function(i,r){i&1&&(ve(aV),D(0,lV,1,2,"mat-pseudo-checkbox",1),B(1),m(2,"span",2,0),B(4,1),f(),D(5,cV,1,1,"mat-pseudo-checkbox",3),D(6,dV,2,1,"span",4),V(7,"div",5)),i&2&&(E(r.multiple?0:-1),p(5),E(!r.multiple&&r.selected&&!r.hideSingleSelectionIndicator?5:-1),p(),E(r.group&&r.group._inert?6:-1),p(),M("matRippleTrigger",r._getHostElement())("matRippleDisabled",r.disabled||r.disableRipple))},dependencies:[_E,or],styles:[`.mat-mdc-option {
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
`],encapsulation:2})}return t})();function CM(t,n,e){if(e.length){let i=n.toArray(),r=e.toArray(),o=0;for(let a=0;a<t+1;a++)i[a].group&&i[a].group===r[o]&&o++;return o}return 0}function wM(t,n,e,i){return t<e?t:t+n>e+i?Math.max(0,t-i+n):e}var Sb=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[Hr,kf,Hs,_e]})}return t})();var uV=["trigger"],mV=["panel"],fV=[[["mat-select-trigger"]],"*"],hV=["mat-select-trigger","*"];function pV(t,n){if(t&1&&(m(0,"span",4),g(1),f()),t&2){let e=b();p(),k(e.placeholder)}}function gV(t,n){t&1&&B(0)}function _V(t,n){if(t&1&&(m(0,"span",11),g(1),f()),t&2){let e=b(2);p(),k(e.triggerValue)}}function vV(t,n){if(t&1&&(m(0,"span",5),D(1,gV,1,0)(2,_V,2,1,"span",11),f()),t&2){let e=b();p(),E(e.customTrigger?1:2)}}function bV(t,n){if(t&1){let e=se();m(0,"div",12,1),w("keydown",function(r){W(e);let o=b();return G(o._handleKeydown(r))}),B(2,1),f()}if(t&2){let e=b();et(e.panelClass),N("mat-select-panel-animations-enabled",!e._animationsDisabled)("mat-primary",e._parentFormField?.color==="primary")("mat-accent",e._parentFormField?.color==="accent")("mat-warn",e._parentFormField?.color==="warn")("mat-undefined",!e._parentFormField?.color),j("id",e.id+"-panel")("aria-multiselectable",e.multiple)("aria-label",e.ariaLabel||null)("aria-labelledby",e._getPanelAriaLabelledby())}}var yV=new C("mat-select-scroll-strategy",{providedIn:"root",factory:()=>{let t=c(K);return()=>cr(t)}}),CV=new C("MAT_SELECT_CONFIG"),wV=new C("MatSelectTrigger"),xb=class{source;value;constructor(n,e){this.source=n,this.value=e}},SM=(()=>{class t{_viewportRuler=c(In);_changeDetectorRef=c(Me);_elementRef=c(L);_dir=c(wt,{optional:!0});_idGenerator=c($e);_renderer=c(xe);_parentFormField=c(td,{optional:!0});ngControl=c(Bn,{self:!0,optional:!0});_liveAnnouncer=c(kv);_defaultOptions=c(CV,{optional:!0});_animationsDisabled=Re();_popoverLocation;_initialized=new I;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"}];_scrollOptionIntoView(e){let i=this.options.toArray()[e];if(i){let r=this.panel.nativeElement,o=CM(e,this.options,this.optionGroups),a=i._getHostElement();e===0&&o===1?r.scrollTop=0:r.scrollTop=wM(a.offsetTop,a.offsetHeight,r.scrollTop,r.offsetHeight)}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0)}_getChangeEvent(e){return new xb(this,e)}_scrollStrategyFactory=c(yV);_panelOpen=!1;_compareWith=(e,i)=>e===i;_uid=this._idGenerator.getId("mat-select-");_triggerAriaLabelledBy=null;_previousControl;_destroy=new I;_errorStateTracker;stateChanges=new I;disableAutomaticLabeling=!0;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId("mat-select-value-");_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||"";get focused(){return this._focused||this._panelOpen}_focused=!1;controlType="mat-select";trigger;panel;_overlayDir;panelClass;disabled=!1;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e)}_disableRipple=T(!1);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties()}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??!1;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next()}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(Jo.required)??!1}set required(e){this._required=e,this.stateChanges.next()}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e}_multiple=!1;disableOptionCentering=this._defaultOptions?.disableOptionCentering??!1;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection()}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e)}_value;ariaLabel="";ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next()}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<"u"?this._defaultOptions.panelWidth:"auto";canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??!1;optionSelectionChanges=Yn(()=>{let e=this.options;return e?e.changes.pipe(Ze(e),_t(()=>ft(...e.map(i=>i.onSelectionChange)))):this._initialized.pipe(_t(()=>this.optionSelectionChanges))});openedChange=new O;_openedStream=this.openedChange.pipe(me(e=>e),ee(()=>{}));_closedStream=this.openedChange.pipe(me(e=>!e),ee(()=>{}));selectionChange=new O;valueChange=new O;constructor(){let e=c(Xf),i=c(Wc,{optional:!0}),r=c(Gc,{optional:!0}),o=c(new wn("tabindex"),{optional:!0}),a=c(Xc,{optional:!0}),s=c(Qf,{optional:!0,self:!0});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new js(e,s||this.ngControl,r,i,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=o==null?0:parseInt(o)||0,this._popoverLocation=a?.usePopover===!1?null:"inline",this.id=this.id}ngOnInit(){this._selectionModel=new Lc(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(pe(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges())})}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(pe(this._destroy)).subscribe(e=>{e.added.forEach(i=>i.select()),e.removed.forEach(i=>i.deselect())}),this.options.changes.pipe(Ze(null),pe(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection()})}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),i=this.ngControl;if(e!==this._triggerAriaLabelledBy){let r=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?r.setAttribute("aria-labelledby",e):r.removeAttribute("aria-labelledby")}i&&(this._previousControl!==i.control&&(this._previousControl!==void 0&&i.disabled!==null&&i.disabled!==this.disabled&&(this.disabled=i.disabled),this._previousControl=i.control),this.updateErrorState())}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass))}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete()}toggle(){this.panelOpen?this.close():this.open()}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._panelOpen=!0,this._overlayDir.positionChange.pipe(je(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled()}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!0)))}close(){this._panelOpen&&(this._panelOpen=!1,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?"rtl":"ltr"),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!1)))}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{i(),clearTimeout(r),this._cleanupDetach=void 0};let e=this.panel.nativeElement,i=this._renderer.listen(e,"animationend",o=>{o.animationName==="_mat-select-exit"&&(this._cleanupDetach?.(),this._detachOverlay())}),r=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay()},200);e.classList.add("mat-select-panel-exit")}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck()}writeValue(e){this._assignValue(e)}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next()}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return"";if(this._multiple){let e=this._selectionModel.selected.map(i=>i.viewValue);return this._isRtl()&&e.reverse(),e.join(", ")}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState()}_isRtl(){return this._dir?this._dir.value==="rtl":!1}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e))}_handleClosedKeydown(e){let i=e.keyCode,r=i===40||i===38||i===37||i===39,o=i===13||i===32,a=this._keyManager;if(!a.isTyping()&&o&&!mt(e)||(this.multiple||e.altKey)&&r)e.preventDefault(),this.open();else if(!this.multiple){let s=this.selected;a.onKeydown(e);let l=this.selected;l&&s!==l&&this._liveAnnouncer.announce(l.viewValue,1e4)}}_handleOpenKeydown(e){let i=this._keyManager,r=e.keyCode,o=r===40||r===38,a=i.isTyping();if(o&&e.altKey)e.preventDefault(),this.close();else if(!a&&(r===13||r===32)&&i.activeItem&&!mt(e))e.preventDefault(),i.activeItem._selectViaInteraction();else if(!a&&this._multiple&&r===65&&e.ctrlKey){e.preventDefault();let s=this.options.some(l=>!l.disabled&&!l.selected);this.options.forEach(l=>{l.disabled||(s?l.select():l.deselect())})}else{let s=i.activeItemIndex;i.onKeydown(e),this._multiple&&o&&e.shiftKey&&i.activeItem&&i.activeItemIndex!==s&&i.activeItem._selectViaInteraction()}}_handleOverlayKeydown(e){e.keyCode===27&&!mt(e)&&(e.preventDefault(),this.close())}_onFocus(){this.disabled||(this._focused=!0,this.stateChanges.next())}_onBlur(){this._focused=!1,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next())}get empty(){return!this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next()})}_setSelectionByValue(e){if(this.options.forEach(i=>i.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)Array.isArray(e),e.forEach(i=>this._selectOptionByValue(i)),this._sortValues();else{let i=this._selectOptionByValue(e);i?this._keyManager.updateActiveItem(i):this.panelOpen||this._keyManager.updateActiveItem(-1)}this._changeDetectorRef.markForCheck()}_selectOptionByValue(e){let i=this.options.find(r=>{if(this._selectionModel.isSelected(r))return!1;try{return(r.value!=null||this.canSelectNullableOptions)&&this._compareWith(r.value,e)}catch(o){return!1}});return i&&this._selectionModel.select(i),i}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,!0):!1}_skipPredicate=e=>this.panelOpen?!1:e.disabled;_getOverlayWidth(e){return this.panelWidth==="auto"?(e instanceof ks?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?"":this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck()}_initKeyManager(){this._keyManager=new kc(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?"rtl":"ltr").withHomeAndEnd().withPageUpDown().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close())}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction()})}_resetOptions(){let e=ft(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(pe(e)).subscribe(i=>{this._onSelect(i.source,i.isUserInput),i.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus())}),ft(...this.options.map(i=>i._stateChanges)).pipe(pe(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next()})}_onSelect(e,i){let r=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(r!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),i&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),i&&this.focus())),r!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next()}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((i,r)=>this.sortComparator?this.sortComparator(i,r,e):e.indexOf(i)-e.indexOf(r)),this.stateChanges.next()}}_propagateChanges(e){let i;this.multiple?i=this.selected.map(r=>r.value):i=this.selected?this.selected.value:e,this._value=i,this.valueChange.emit(i),this._onChange(i),this.selectionChange.emit(this._getChangeEvent(i)),this._changeDetectorRef.markForCheck()}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let i=0;i<this.options.length;i++)if(!this.options.get(i).disabled){e=i;break}this._keyManager.setActiveItem(e)}else this._keyManager.setActiveItem(this._selectionModel.selected[0])}_canOpen(){return!this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e)}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,i=e?e+" ":"";return this.ariaLabelledby?i+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||"";return this.ariaLabelledby&&(e+=" "+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let i=this._elementRef.nativeElement;e.length?i.setAttribute("aria-describedby",e.join(" ")):i.removeAttribute("aria-describedby")}onContainerClick(e){let i=$t(e);i&&(i.tagName==="MAT-OPTION"||i.classList.contains("cdk-overlay-backdrop")||i.closest(".mat-mdc-select-panel"))||(this.focus(),this.open())}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-select"]],contentQueries:function(i,r,o){if(i&1&&dt(o,wV,5)(o,Hs,5)(o,oh,5),i&2){let a;U(a=z())&&(r.customTrigger=a.first),U(a=z())&&(r.options=a),U(a=z())&&(r.optionGroups=a)}},viewQuery:function(i,r){if(i&1&&Te(uV,5)(mV,5)(Hf,5),i&2){let o;U(o=z())&&(r.trigger=o.first),U(o=z())&&(r.panel=o.first),U(o=z())&&(r._overlayDir=o.first)}},hostAttrs:["role","combobox","aria-haspopup","listbox",1,"mat-mdc-select"],hostVars:21,hostBindings:function(i,r){i&1&&w("keydown",function(a){return r._handleKeydown(a)})("focus",function(){return r._onFocus()})("blur",function(){return r._onBlur()}),i&2&&(j("id",r.id)("tabindex",r.disabled?-1:r.tabIndex)("aria-controls",r.panelOpen?r.id+"-panel":null)("aria-expanded",r.panelOpen)("aria-label",r.ariaLabel||null)("aria-required",r.required.toString())("aria-disabled",r.disabled.toString())("aria-invalid",r.errorState)("aria-activedescendant",r._getAriaActiveDescendant()),N("mat-mdc-select-disabled",r.disabled)("mat-mdc-select-invalid",r.errorState)("mat-mdc-select-required",r.required)("mat-mdc-select-empty",r.empty)("mat-mdc-select-multiple",r.multiple)("mat-select-open",r.panelOpen))},inputs:{userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],panelClass:"panelClass",disabled:[2,"disabled","disabled",Y],disableRipple:[2,"disableRipple","disableRipple",Y],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:Nt(e)],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",Y],placeholder:"placeholder",required:[2,"required","required",Y],multiple:[2,"multiple","multiple",Y],disableOptionCentering:[2,"disableOptionCentering","disableOptionCentering",Y],compareWith:"compareWith",value:"value",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],errorStateMatcher:"errorStateMatcher",typeaheadDebounceInterval:[2,"typeaheadDebounceInterval","typeaheadDebounceInterval",Nt],sortComparator:"sortComparator",id:"id",panelWidth:"panelWidth",canSelectNullableOptions:[2,"canSelectNullableOptions","canSelectNullableOptions",Y]},outputs:{openedChange:"openedChange",_openedStream:"opened",_closedStream:"closed",selectionChange:"selectionChange",valueChange:"valueChange"},exportAs:["matSelect"],features:[Ie([{provide:ed,useExisting:t},{provide:rh,useExisting:t}]),Ne],ngContentSelectors:hV,decls:11,vars:10,consts:[["fallbackOverlayOrigin","cdkOverlayOrigin","trigger",""],["panel",""],["cdk-overlay-origin","",1,"mat-mdc-select-trigger",3,"click"],[1,"mat-mdc-select-value"],[1,"mat-mdc-select-placeholder","mat-mdc-select-min-line"],[1,"mat-mdc-select-value-text"],[1,"mat-mdc-select-arrow-wrapper"],[1,"mat-mdc-select-arrow"],["viewBox","0 0 24 24","width","24px","height","24px","focusable","false","aria-hidden","true"],["d","M7 10l5 5 5-5z"],["cdk-connected-overlay","","cdkConnectedOverlayHasBackdrop","","cdkConnectedOverlayBackdropClass","cdk-overlay-transparent-backdrop",3,"detach","backdropClick","overlayKeydown","cdkConnectedOverlayDisableClose","cdkConnectedOverlayPanelClass","cdkConnectedOverlayScrollStrategy","cdkConnectedOverlayOrigin","cdkConnectedOverlayPositions","cdkConnectedOverlayWidth","cdkConnectedOverlayFlexibleDimensions","cdkConnectedOverlayUsePopover"],[1,"mat-mdc-select-min-line"],["role","listbox","tabindex","-1",1,"mat-mdc-select-panel","mdc-menu-surface","mdc-menu-surface--open",3,"keydown"]],template:function(i,r){if(i&1&&(ve(fV),m(0,"div",2,0),w("click",function(){return r.open()}),m(3,"div",3),D(4,pV,2,1,"span",4)(5,vV,3,1,"span",5),f(),m(6,"div",6)(7,"div",7),fn(),m(8,"svg",8),V(9,"path",9),f()()()(),yt(10,bV,3,16,"ng-template",10),w("detach",function(){return r.close()})("backdropClick",function(){return r.close()})("overlayKeydown",function(a){return r._handleOverlayKeydown(a)})),i&2){let o=rt(1);p(3),j("id",r._valueId),p(),E(r.empty?4:5),p(6),M("cdkConnectedOverlayDisableClose",!0)("cdkConnectedOverlayPanelClass",r._overlayPanelClass)("cdkConnectedOverlayScrollStrategy",r._scrollStrategy)("cdkConnectedOverlayOrigin",r._preferredOverlayOrigin||o)("cdkConnectedOverlayPositions",r._positions)("cdkConnectedOverlayWidth",r._overlayWidth)("cdkConnectedOverlayFlexibleDimensions",!0)("cdkConnectedOverlayUsePopover",r._popoverLocation)}},dependencies:[ks,Hf],styles:[`@keyframes _mat-select-enter {
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
`],encapsulation:2})}return t})();var xM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[ui,Sb,_e,Vn,dn,Sb]})}return t})();var xV=["*"],DM=(()=>{class t{labelPosition="after";static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["","mat-internal-form-field",""]],hostAttrs:[1,"mdc-form-field","mat-internal-form-field"],hostVars:2,hostBindings:function(i,r){i&2&&N("mdc-form-field--align-end",r.labelPosition==="before")},inputs:{labelPosition:"labelPosition"},ngContentSelectors:xV,decls:1,vars:0,template:function(i,r){i&1&&(ve(),B(0))},styles:[`.mat-internal-form-field {
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
`],encapsulation:2})}return t})();var DV=["switch"],EV=["*"];function MV(t,n){t&1&&(m(0,"span",11),fn(),m(1,"svg",13),V(2,"path",14),f(),m(3,"svg",15),V(4,"path",16),f()())}var IV=new C("mat-slide-toggle-default-options",{providedIn:"root",factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})}),ah=class{source;checked;constructor(n,e){this.source=n,this.checked=e}},Db=(()=>{class t{_elementRef=c(L);_focusMonitor=c(Ht);_changeDetectorRef=c(Me);defaults=c(IV);_onChange=e=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(e){return new ah(this,e)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=Re();_focused=!1;name=null;id;labelPosition="after";ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(e){this._checked=e,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new O;toggleChange=new O;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){c(tt).load(gn);let e=c(new wn("tabindex"),{optional:!0}),i=this.defaults;this.tabIndex=e==null?0:parseInt(e)||0,this.color=i.color||"accent",this.id=this._uniqueId=c($e).getId("mat-mdc-slide-toggle-"),this.hideIcon=i.hideIcon??!1,this.disabledInteractive=i.disabledInteractive??!1,this._labelId=this._uniqueId+"-label"}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(e=>{e==="keyboard"||e==="program"?(this._focused=!0,this._changeDetectorRef.markForCheck()):e||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(e){e.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(e){this.checked=!!e}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}validate(e){return this.required&&e.value!==!0?{required:!0}:null}registerOnValidatorChange(e){this._validatorOnChange=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new ah(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-slide-toggle"]],viewQuery:function(i,r){if(i&1&&Te(DV,5),i&2){let o;U(o=z())&&(r._switchElement=o.first)}},hostAttrs:[1,"mat-mdc-slide-toggle"],hostVars:15,hostBindings:function(i,r){i&2&&(Gt("id",r.id),j("tabindex",null)("aria-label",null)("name",null)("aria-labelledby",null),et(r.color?"mat-"+r.color:""),N("mat-mdc-slide-toggle-focused",r._focused)("mat-mdc-slide-toggle-checked",r.checked)("mat-slide-toggle-full-width",r.fullWidth)("_mat-animation-noopable",r._noopAnimations))},inputs:{name:"name",id:"id",labelPosition:"labelPosition",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],required:[2,"required","required",Y],color:"color",disabled:[2,"disabled","disabled",Y],fullWidth:[2,"fullWidth","fullWidth",Y],disableRipple:[2,"disableRipple","disableRipple",Y],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:Nt(e)],checked:[2,"checked","checked",Y],hideIcon:[2,"hideIcon","hideIcon",Y],disabledInteractive:[2,"disabledInteractive","disabledInteractive",Y]},outputs:{change:"change",toggleChange:"toggleChange"},exportAs:["matSlideToggle"],features:[Ie([{provide:$c,useExisting:en(()=>t),multi:!0},{provide:ea,useExisting:t,multi:!0}]),Ne],ngContentSelectors:EV,decls:14,vars:27,consts:[["switch",""],["mat-internal-form-field","",3,"labelPosition"],["role","switch","type","button",1,"mdc-switch",3,"click","tabIndex","disabled"],[1,"mat-mdc-slide-toggle-touch-target"],[1,"mdc-switch__track"],[1,"mdc-switch__handle-track"],[1,"mdc-switch__handle"],[1,"mdc-switch__shadow"],[1,"mdc-elevation-overlay"],[1,"mdc-switch__ripple"],["mat-ripple","",1,"mat-mdc-slide-toggle-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled","matRippleCentered"],[1,"mdc-switch__icons"],[1,"mdc-label",3,"click","for"],["viewBox","0 0 24 24","aria-hidden","true",1,"mdc-switch__icon","mdc-switch__icon--on"],["d","M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"],["viewBox","0 0 24 24","aria-hidden","true",1,"mdc-switch__icon","mdc-switch__icon--off"],["d","M20 13H4v-2h16v2z"]],template:function(i,r){if(i&1&&(ve(),m(0,"div",1)(1,"button",2,0),w("click",function(){return r._handleClick()}),V(3,"div",3)(4,"span",4),m(5,"span",5)(6,"span",6)(7,"span",7),V(8,"span",8),f(),m(9,"span",9),V(10,"span",10),f(),D(11,MV,5,0,"span",11),f()()(),m(12,"label",12),w("click",function(a){return a.stopPropagation()}),B(13),f()()),i&2){let o=rt(2);M("labelPosition",r.labelPosition),p(),N("mdc-switch--selected",r.checked)("mdc-switch--unselected",!r.checked)("mdc-switch--checked",r.checked)("mdc-switch--disabled",r.disabled)("mat-mdc-slide-toggle-disabled-interactive",r.disabledInteractive),M("tabIndex",r.disabled&&!r.disabledInteractive?-1:r.tabIndex)("disabled",r.disabled&&!r.disabledInteractive),j("id",r.buttonId)("name",r.name)("aria-label",r.ariaLabel)("aria-labelledby",r._getAriaLabelledBy())("aria-describedby",r.ariaDescribedby)("aria-required",r.required||null)("aria-checked",r.checked)("aria-disabled",r.disabled&&r.disabledInteractive?"true":null),p(9),M("matRippleTrigger",o)("matRippleDisabled",r.disableRipple||r.disabled)("matRippleCentered",!0),p(),E(r.hideIcon?-1:11),p(),M("for",r.buttonId),j("id",r._labelId)}},dependencies:[or,DM],styles:[`.mdc-switch {
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
`],encapsulation:2})}return t})(),EM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[Db,_e]})}return t})();var TV=()=>[],kV=(t,n)=>n.id;function AV(t,n){if(t&1&&(m(0,"div",2),g(1),f()),t&2){let e=b(2);p(),k(e.errorMessage())}}function RV(t,n){t&1&&(m(0,"p",10),g(1,"No additional agent configuration options advertised."),f())}function OV(t,n){if(t&1&&(m(0,"mat-option",13),g(1),f()),t&2){let e=n.$implicit;M("value",e.value),p(),k(e.name)}}function PV(t,n){if(t&1&&(m(0,"mat-optgroup",12),nt(1,OV,2,2,"mat-option",13,Ha),f()),t&2){let e=b().$implicit;M("label",e.group),p(),it(e.options)}}function FV(t,n){if(t&1&&(m(0,"mat-option",13),g(1),f()),t&2){let e=b().$implicit;M("value",e.value),p(),k(e.name)}}function LV(t,n){if(t&1&&D(0,PV,3,1,"mat-optgroup",12)(1,FV,2,2,"mat-option",13),t&2){let e=n.$implicit,i=b(5);E(i.isGroup(e)?0:1)}}function jV(t,n){if(t&1&&(m(0,"p"),g(1),f()),t&2){let e=b(2).$implicit;p(),k(e.description)}}function VV(t,n){if(t&1){let e=se();m(0,"div",3)(1,"mat-form-field",4)(2,"mat-label"),g(3),f(),m(4,"mat-select",5),w("selectionChange",function(r){W(e);let o=b().$implicit,a=b(3);return G(a.changeOption(o,r.value))}),nt(5,LV,2,1,null,null,Ha),f()(),D(7,jV,2,1,"p"),f()}if(t&2){let e=b().$implicit;p(3),k(e.name),p(),M("value",e.currentValue),p(),it(e.options??ql(3,TV)),p(2),E(e.description?7:-1)}}function BV(t,n){if(t&1&&(m(0,"p"),g(1),f()),t&2){let e=b(2).$implicit;p(),k(e.description)}}function HV(t,n){if(t&1){let e=se();m(0,"div",11)(1,"div")(2,"strong"),g(3),f(),D(4,BV,2,1,"p"),f(),m(5,"mat-slide-toggle",14),w("change",function(r){W(e);let o=b().$implicit,a=b(3);return G(a.changeOption(o,r.checked))}),f()()}if(t&2){let e=b().$implicit;p(3),k(e.name),p(),E(e.description?4:-1),p(),M("checked",!!e.currentValue),j("aria-label",e.name)}}function UV(t,n){if(t&1&&(m(0,"div",3)(1,"strong"),g(2),f(),m(3,"div",15),g(4),f()()),t&2){let e=b().$implicit;p(2),k(e.name),p(2),Wa("",e.currentValue," (type: ",e.type,")")}}function zV(t,n){if(t&1&&D(0,VV,8,4,"div",3)(1,HV,6,4,"div",11)(2,UV,5,3,"div",3),t&2){let e=n.$implicit;E(e.type==="select"?0:e.type==="boolean"?1:2)}}function $V(t,n){if(t&1&&nt(0,zV,3,1,null,null,kV),t&2){let e=b(2);it(e.options)}}function WV(t,n){if(t&1){let e=se();m(0,"section",0)(1,"h2",1)(2,"mat-icon"),g(3,"tune"),f(),g(4," Configuration & permissions"),f(),D(5,AV,2,1,"div",2),m(6,"div",3)(7,"mat-form-field",4)(8,"mat-label"),g(9,"Permission policy"),f(),m(10,"mat-select",5),w("selectionChange",function(r){W(e);let o=b();return G(o.changePolicy(r.value))}),m(11,"mat-option",6),g(12,"Ask every time"),f(),m(13,"mat-option",7),g(14,"Read-only (deny writes)"),f(),m(15,"mat-option",8),g(16,"Auto-approve all permissions"),f(),m(17,"mat-option",9),g(18,"Deny all actions"),f()()(),m(19,"p"),g(20,"Controls whether the agent must ask before running commands or editing files."),f()(),V(21,"mat-divider"),D(22,RV,2,0,"p",10)(23,$V,2,0),f()}if(t&2){let e=b();p(5),E(e.errorMessage()?5:-1),p(5),M("value",e.chat.permission_policy),p(12),E(e.options.length?23:22)}}var sh=class t{constructor(){this.chat=null;this.options=[];this.errorMessage=T("");this.state=c(Le)}isGroup(n){return"options"in n}changePolicy(n){return P(this,null,function*(){if(this.chat){this.errorMessage.set("");try{yield this.state.setChatPolicy(this.chat.id,n)}catch(e){this.errorMessage.set(e instanceof Error?e.message:"Failed to update permission policy")}}})}changeOption(n,e){return P(this,null,function*(){if(this.chat){this.errorMessage.set("");try{yield this.state.setChatConfig(this.chat.id,n.id,e)}catch(i){this.errorMessage.set(i instanceof Error?i.message:"Failed to update agent configuration")}}})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-chat-config"]],inputs:{chat:"chat",options:"options"},decls:1,vars:1,consts:[["aria-labelledby","config-heading",1,"config"],["id","config-heading"],["role","alert",1,"error-box"],[1,"config-item"],["appearance","outline"],[3,"selectionChange","value"],["value","ask"],["value","read-only"],["value","auto-approve"],["value","deny-all"],[1,"no-options"],[1,"boolean-item"],[3,"label"],[3,"value"],[3,"change","checked"],[1,"unsupported"]],template:function(e,i){e&1&&D(0,WV,24,3,"section",0),e&2&&E(i.chat?0:-1)},dependencies:[Gr,Ss,Wv,dn,Wn,Tn,Fe,We,xM,SM,Hs,wb,EM,Db],styles:["[_nghost-%COMP%]{display:block}.config[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:18px}h2[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;margin:0;font-size:1.05rem}h2[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary)}.config-item[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:6px}mat-form-field[_ngcontent-%COMP%]{width:100%}p[_ngcontent-%COMP%]{margin:0;color:var(--%NS%mat-sys-on-surface-variant);font-size:.83rem;line-height:1.45}.no-options[_ngcontent-%COMP%]{font-style:italic}.boolean-item[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:16px}.boolean-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{display:block}.unsupported[_ngcontent-%COMP%]{padding:12px;border-radius:10px;background:var(--%NS%mat-sys-surface-container);color:var(--%NS%mat-sys-on-surface-variant);font-size:.82rem}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:12px;background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}"]})}};function GV(t,n){t&1&&V(0,"mat-spinner",7)}function qV(t,n){t&1&&(m(0,"mat-icon"),g(1,"stop"),f())}function YV(t,n){if(t&1){let e=se();m(0,"button",6),w("click",function(){W(e);let r=b();return G(r.cancel())}),D(1,GV,1,0,"mat-spinner",7)(2,qV,2,0,"mat-icon"),f()}if(t&2){let e=b();M("disabled",e.cancelling),p(),E(e.cancelling?1:2)}}function ZV(t,n){if(t&1&&(m(0,"button",4)(1,"mat-icon"),g(2,"arrow_upward"),f()()),t&2){let e=b();M("disabled",!e.canSend)}}var lh=class t{constructor(){this.chatId="";this.processState="STOPPED";this.turnState="IDLE";this.disabled=!1;this.message=new Nf("",{nonNullable:!0});this.state=c(Le)}get prompting(){return this.turnState==="PROMPTING"}get cancelling(){return this.turnState==="CANCELLING"}get canSend(){return!this.disabled&&this.processState==="RUNNING"&&!this.prompting&&this.message.value.trim().length>0}get placeholder(){return this.disabled?"Waiting for the agent connection\u2026":this.processState!=="RUNNING"?"Agent process stopped":this.prompting?"Agent is thinking\u2026":"Type a message\u2026"}ngOnChanges(n){let e=this.disabled||this.processState!=="RUNNING"||this.prompting;e&&this.message.enabled?this.message.disable({emitEvent:!1}):!e&&this.message.disabled&&this.message.enable({emitEvent:!1})}keyDown(n){(n.ctrlKey||n.metaKey)&&n.key==="Enter"&&(n.preventDefault(),this.send())}send(){return P(this,null,function*(){let n=this.message.value.trim();if(!(!n||!this.canSend)){this.message.setValue("");try{yield this.state.sendPrompt(this.chatId,n)}catch(e){console.error("Failed to send prompt",e),this.message.setValue(n)}}})}cancel(){return P(this,null,function*(){if(this.chatId)try{yield this.state.cancelActiveTurn(this.chatId)}catch(n){console.error("Failed to cancel turn",n)}})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-chat-composer"]],inputs:{chatId:"chatId",processState:"processState",turnState:"turnState",disabled:"disabled"},features:[Ne],decls:9,vars:6,consts:[[1,"composer",3,"submit"],["appearance","outline",1,"message-field"],["matInput","","cdkTextareaAutosize","",3,"keydown","formControl","cdkAutosizeMinRows","cdkAutosizeMaxRows","placeholder"],["mat-fab","","color","warn","type","button","matTooltip","Cancel active turn","aria-label","Cancel active turn",3,"disabled"],["mat-fab","","color","primary","type","submit","matTooltip","Send message (Ctrl+Enter)","aria-label","Send message",3,"disabled"],[1,"hint"],["mat-fab","","color","warn","type","button","matTooltip","Cancel active turn","aria-label","Cancel active turn",3,"click","disabled"],["diameter","22"]],template:function(e,i){e&1&&(m(0,"form",0),w("submit",function(o){return o.preventDefault(),i.send()}),m(1,"mat-form-field",1)(2,"mat-label"),g(3,"Message"),f(),m(4,"textarea",2),w("keydown",function(o){return i.keyDown(o)}),f(),ii(),f(),D(5,YV,3,2,"button",3)(6,ZV,3,1,"button",4),f(),m(7,"p",5),g(8,"Press Ctrl+Enter or Cmd+Enter to send"),f()),e&2&&(p(4),M("formControl",i.message)("cdkAutosizeMinRows",1)("cdkAutosizeMaxRows",8)("placeholder",i.placeholder),j("aria-label",i.placeholder),ri(),p(),E(i.prompting||i.cancelling?5:6))},dependencies:[gE,fE,Ti,Wr,mE,eb,Zf,aM,Pe,Cs,dn,Wn,Tn,Fe,We,Jr,Kr,Xt,Qt,Yr,ur],styles:["[_nghost-%COMP%]{display:block;padding:12px max(20px,(100% - 920px) / 2);padding-bottom:calc(12px + env(safe-area-inset-bottom));border-top:1px solid var(--%NS%mat-sys-outline-variant);background:var(--%NS%mat-sys-surface)}.composer[_ngcontent-%COMP%]{display:flex;align-items:flex-end;gap:10px;max-width:920px;margin:0 auto}.message-field[_ngcontent-%COMP%]{flex:1}textarea[_ngcontent-%COMP%]{max-height:190px}.hint[_ngcontent-%COMP%]{max-width:920px;margin:0 auto;padding:0 8px;color:var(--%NS%mat-sys-outline);font-size:.72rem;text-align:right}button[_ngcontent-%COMP%]{flex:0 0 auto;margin-bottom:4px}@media(max-width:599px){[_nghost-%COMP%]{padding-inline:12px}.hint[_ngcontent-%COMP%]{display:none}}"]})}};var QV=[[["mat-icon"],["","matMenuItemIcon",""]],"*"],XV=["mat-icon, [matMenuItemIcon]","*"];function KV(t,n){t&1&&(fn(),m(0,"svg",2),V(1,"polygon",3),f())}var JV=["*"];function eB(t,n){if(t&1){let e=se();Ve(0,"div",0),$a("click",function(){W(e);let r=b();return G(r.closed.emit("click"))})("animationstart",function(r){W(e);let o=b();return G(o._onAnimationStart(r.animationName))})("animationend",function(r){W(e);let o=b();return G(o._onAnimationDone(r.animationName))})("animationcancel",function(r){W(e);let o=b();return G(o._onAnimationDone(r.animationName))}),Ve(1,"div",1),B(2),Xe()()}if(t&2){let e=b();et(e._classList),N("mat-menu-panel-animations-disabled",e._animationsDisabled)("mat-menu-panel-exit-animation",e._panelAnimationState==="void")("mat-menu-panel-animating",e._isAnimating()),Gt("id",e.panelId),j("aria-label",e.ariaLabel||null)("aria-labelledby",e.ariaLabelledby||null)("aria-describedby",e.ariaDescribedby||null)}}var Mb=new C("MAT_MENU_PANEL"),mr=(()=>{class t{_elementRef=c(L);_document=c(X);_focusMonitor=c(Ht);_parentMenu=c(Mb,{optional:!0});_changeDetectorRef=c(Me);role="menuitem";disabled=!1;disableRipple=!1;_hovered=new I;_focused=new I;_highlighted=!1;_triggersSubmenu=!1;constructor(){c(tt).load(gn),this._parentMenu?.addItem?.(this)}focus(e,i){this._focusMonitor&&e?this._focusMonitor.focusVia(this._getHostElement(),e,i):this._getHostElement().focus(i),this._focused.next(this)}ngAfterViewInit(){this._focusMonitor&&this._focusMonitor.monitor(this._elementRef,!1)}ngOnDestroy(){this._focusMonitor&&this._focusMonitor.stopMonitoring(this._elementRef),this._parentMenu&&this._parentMenu.removeItem&&this._parentMenu.removeItem(this),this._hovered.complete(),this._focused.complete()}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._elementRef.nativeElement}_checkDisabled(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}_handleMouseEnter(){this._hovered.next(this)}getLabel(){let e=this._elementRef.nativeElement.cloneNode(!0),i=e.querySelectorAll("mat-icon, .material-icons");for(let r=0;r<i.length;r++)i[r].remove();return e.textContent?.trim()||""}_setHighlighted(e){this._highlighted=e,this._changeDetectorRef.markForCheck()}_setTriggersSubmenu(e){this._triggersSubmenu=e,this._changeDetectorRef.markForCheck()}_hasFocus(){return this._document&&this._document.activeElement===this._getHostElement()}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["","mat-menu-item",""]],hostAttrs:[1,"mat-mdc-menu-item","mat-focus-indicator"],hostVars:8,hostBindings:function(i,r){i&1&&w("click",function(a){return r._checkDisabled(a)})("mouseenter",function(){return r._handleMouseEnter()}),i&2&&(j("role",r.role)("tabindex",r._getTabIndex())("aria-disabled",r.disabled)("disabled",r.disabled||null),N("mat-mdc-menu-item-highlighted",r._highlighted)("mat-mdc-menu-item-submenu-trigger",r._triggersSubmenu))},inputs:{role:"role",disabled:[2,"disabled","disabled",Y],disableRipple:[2,"disableRipple","disableRipple",Y]},exportAs:["matMenuItem"],ngContentSelectors:XV,decls:5,vars:3,consts:[[1,"mat-mdc-menu-item-text"],["matRipple","",1,"mat-mdc-menu-ripple",3,"matRippleDisabled","matRippleTrigger"],["viewBox","0 0 5 10","focusable","false","aria-hidden","true",1,"mat-mdc-menu-submenu-icon"],["points","0,0 5,5 0,10"]],template:function(i,r){i&1&&(ve(QV),B(0),m(1,"span",0),B(2,1),f(),V(3,"div",1),D(4,KV,2,0,":svg:svg",2)),i&2&&(p(3),M("matRippleDisabled",r.disableRipple||r.disabled)("matRippleTrigger",r._getHostElement()),p(),E(r._triggersSubmenu?4:-1))},dependencies:[or],encapsulation:2})}return t})();var MM=new C("MatMenuContent"),IM=(()=>{class t{_template=c(bt);_appRef=c(rn);_injector=c(K);_viewContainerRef=c(pt);_document=c(X);_changeDetectorRef=c(Me);_portal;_outlet;_attached=new I;attach(e={}){this._portal||(this._portal=new cn(this._template,this._viewContainerRef)),this.detach(),this._outlet||(this._outlet=new Ns(this._document.createElement("div"),this._appRef,this._injector));let i=this._template.elementRef.nativeElement;i.parentNode.insertBefore(this._outlet.outletElement,i),this._changeDetectorRef.markForCheck(),this._portal.attach(this._outlet,e),this._attached.next()}detach(){this._portal?.isAttached&&this._portal.detach()}ngOnDestroy(){this.detach(),this._outlet?.dispose()}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["ng-template","matMenuContent",""]],features:[Ie([{provide:MM,useExisting:t}])]})}return t})(),tB=new C("mat-menu-default-options",{providedIn:"root",factory:()=>({overlapTrigger:!1,xPosition:"after",yPosition:"below",backdropClass:"cdk-overlay-transparent-backdrop"})}),Eb="_mat-menu-enter",ch="_mat-menu-exit",Fi=(()=>{class t{_elementRef=c(L);_changeDetectorRef=c(Me);_injector=c(K);_keyManager;_xPosition;_yPosition;_firstItemFocusRef;_exitFallbackTimeout;_animationsDisabled=Re();_allItems;_directDescendantItems=new pn;_classList={};_panelAnimationState="void";_animationDone=new I;_isAnimating=T(!1);parentMenu;direction;overlayPanelClass;backdropClass;ariaLabel;ariaLabelledby;ariaDescribedby;get xPosition(){return this._xPosition}set xPosition(e){this._xPosition=e,this.setPositionClasses()}get yPosition(){return this._yPosition}set yPosition(e){this._yPosition=e,this.setPositionClasses()}templateRef;items;lazyContent;overlapTrigger=!1;hasBackdrop;get panelClass(){return this._previousPanelClass}set panelClass(e){let i=this._previousPanelClass,r=y({},this._classList);i&&i.length&&i.split(" ").forEach(o=>{r[o]=!1}),this._previousPanelClass=e,e&&e.length&&(e.split(" ").forEach(o=>{r[o]=!0}),this._elementRef.nativeElement.className=""),this._classList=r}_previousPanelClass="";get classList(){return this.panelClass}set classList(e){this.panelClass=e}closed=new O;close=this.closed;panelId=c($e).getId("mat-menu-panel-");constructor(){let e=c(tB);this.overlayPanelClass=e.overlayPanelClass||"",this._xPosition=e.xPosition,this._yPosition=e.yPosition,this.backdropClass=e.backdropClass,this.overlapTrigger=e.overlapTrigger,this.hasBackdrop=e.hasBackdrop}ngOnInit(){this.setPositionClasses()}ngAfterContentInit(){this._updateDirectDescendants(),this._keyManager=new Br(this._directDescendantItems).withWrap().withTypeAhead().withHomeAndEnd(),this._keyManager.tabOut.subscribe(()=>this.closed.emit("tab")),this._directDescendantItems.changes.pipe(Ze(this._directDescendantItems),_t(e=>ft(...e.map(i=>i._focused)))).subscribe(e=>this._keyManager.updateActiveItem(e)),this._directDescendantItems.changes.subscribe(e=>{let i=this._keyManager;if(this._panelAnimationState==="enter"&&i.activeItem?._hasFocus()){let r=e.toArray(),o=Math.max(0,Math.min(r.length-1,i.activeItemIndex||0));r[o]&&!r[o].disabled?i.setActiveItem(o):i.setNextItemActive()}})}ngOnDestroy(){this._keyManager?.destroy(),this._directDescendantItems.destroy(),this.closed.complete(),this._firstItemFocusRef?.destroy(),clearTimeout(this._exitFallbackTimeout)}_hovered(){return this._directDescendantItems.changes.pipe(Ze(this._directDescendantItems),_t(i=>ft(...i.map(r=>r._hovered))))}addItem(e){}removeItem(e){}_handleKeydown(e){let i=e.keyCode,r=this._keyManager;switch(i){case 27:mt(e)||(e.preventDefault(),this.closed.emit("keydown"));break;case 37:this.parentMenu&&this.direction==="ltr"&&this.closed.emit("keydown");break;case 39:this.parentMenu&&this.direction==="rtl"&&this.closed.emit("keydown");break;default:(i===38||i===40)&&r.setFocusOrigin("keyboard"),r.onKeydown(e);return}}focusFirstItem(e="program"){this._firstItemFocusRef?.destroy(),this._firstItemFocusRef=ct(()=>{let i=this._resolvePanel();if(!i||!i.contains(document.activeElement)){let r=this._keyManager;r.setFocusOrigin(e).setFirstItemActive(),!r.activeItem&&i&&i.focus()}},{injector:this._injector})}resetActiveItem(){this._keyManager.setActiveItem(-1)}setElevation(e){}setPositionClasses(e=this.xPosition,i=this.yPosition){this._classList=J(y({},this._classList),{"mat-menu-before":e==="before","mat-menu-after":e==="after","mat-menu-above":i==="above","mat-menu-below":i==="below"}),this._changeDetectorRef.markForCheck()}_onAnimationDone(e){let i=e===ch;(i||e===Eb)&&(i&&(clearTimeout(this._exitFallbackTimeout),this._exitFallbackTimeout=void 0),this._animationDone.next(i?"void":"enter"),this._isAnimating.set(!1))}_onAnimationStart(e){(e===Eb||e===ch)&&this._isAnimating.set(!0)}_setIsOpen(e){if(this._panelAnimationState=e?"enter":"void",e){if(this._keyManager.activeItemIndex===0){let i=this._resolvePanel();i&&(i.scrollTop=0)}}else this._animationsDisabled||(this._exitFallbackTimeout=setTimeout(()=>this._onAnimationDone(ch),200));this._animationsDisabled&&setTimeout(()=>{this._onAnimationDone(e?Eb:ch)}),this._changeDetectorRef.markForCheck()}_updateDirectDescendants(){this._allItems.changes.pipe(Ze(this._allItems)).subscribe(e=>{this._directDescendantItems.reset(e.filter(i=>i._parentMenu===this)),this._directDescendantItems.notifyOnChanges()})}_resolvePanel(){let e=null;return this._directDescendantItems.length&&(e=this._directDescendantItems.first._getHostElement().closest('[role="menu"]')),e}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-menu"]],contentQueries:function(i,r,o){if(i&1&&dt(o,MM,5)(o,mr,5)(o,mr,4),i&2){let a;U(a=z())&&(r.lazyContent=a.first),U(a=z())&&(r._allItems=a),U(a=z())&&(r.items=a)}},viewQuery:function(i,r){if(i&1&&Te(bt,5),i&2){let o;U(o=z())&&(r.templateRef=o.first)}},hostVars:3,hostBindings:function(i,r){i&2&&j("aria-label",null)("aria-labelledby",null)("aria-describedby",null)},inputs:{backdropClass:"backdropClass",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],xPosition:"xPosition",yPosition:"yPosition",overlapTrigger:[2,"overlapTrigger","overlapTrigger",Y],hasBackdrop:[2,"hasBackdrop","hasBackdrop",e=>e==null?null:Y(e)],panelClass:[0,"class","panelClass"],classList:"classList"},outputs:{closed:"closed",close:"close"},exportAs:["matMenu"],features:[Ie([{provide:Mb,useExisting:t}])],ngContentSelectors:JV,decls:1,vars:0,consts:[["tabindex","-1","role","menu",1,"mat-mdc-menu-panel",3,"click","animationstart","animationend","animationcancel","id"],[1,"mat-mdc-menu-content"]],template:function(i,r){i&1&&(ve(),Ba(0,eB,3,12,"ng-template"))},styles:[`mat-menu {
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
`],encapsulation:2})}return t})(),nB=new C("mat-menu-scroll-strategy",{providedIn:"root",factory:()=>{let t=c(K);return()=>cr(t)}});var Us=new WeakMap,iB=(()=>{class t{_canHaveBackdrop;_element=c(L);_viewContainerRef=c(pt);_menuItemInstance=c(mr,{optional:!0,self:!0});_dir=c(wt,{optional:!0});_focusMonitor=c(Ht);_ngZone=c($);_injector=c(K);_scrollStrategy=c(nB);_changeDetectorRef=c(Me);_animationsDisabled=Re();_portal;_overlayRef=null;_menuOpen=!1;_closingActionsSubscription=ue.EMPTY;_menuCloseSubscription=ue.EMPTY;_pendingRemoval;_parentMaterialMenu;_parentInnerPadding;_openedBy=void 0;get _menu(){return this._menuInternal}set _menu(e){e!==this._menuInternal&&(this._menuInternal=e,this._menuCloseSubscription.unsubscribe(),e?(this._parentMaterialMenu,this._menuCloseSubscription=e.close.subscribe(i=>{this._destroyMenu(i),(i==="click"||i==="tab")&&this._parentMaterialMenu&&this._parentMaterialMenu.closed.emit(i)})):this._destroyMenu(),this._menuItemInstance?._setTriggersSubmenu(this._triggersSubmenu()))}_menuInternal=null;constructor(e){this._canHaveBackdrop=e;let i=c(Mb,{optional:!0});this._parentMaterialMenu=i instanceof Fi?i:void 0}ngOnDestroy(){this._menu&&this._ownsMenu(this._menu)&&Us.delete(this._menu),this._pendingRemoval?.unsubscribe(),this._menuCloseSubscription.unsubscribe(),this._closingActionsSubscription.unsubscribe(),this._overlayRef&&(this._overlayRef.dispose(),this._overlayRef=null)}get menuOpen(){return this._menuOpen}get dir(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}_triggersSubmenu(){return!!(this._menuItemInstance&&this._parentMaterialMenu&&this._menu)}_closeMenu(){this._menu?.close.emit()}_openMenu(e){if(this._triggerIsAriaDisabled())return;let i=this._menu;if(this._menuOpen||!i)return;this._pendingRemoval?.unsubscribe();let r=Us.get(i);Us.set(i,this),r&&r!==this&&r._closeMenu();let o=this._createOverlay(i),a=o.getConfig(),s=a.positionStrategy;this._setPosition(i,s),this._canHaveBackdrop?a.hasBackdrop=i.hasBackdrop==null?!this._triggersSubmenu():i.hasBackdrop:a.hasBackdrop=i.hasBackdrop??!1,o.hasAttached()||(o.attach(this._getPortal(i)),i.lazyContent?.attach(this.menuData)),this._closingActionsSubscription=this._menuClosingActions().subscribe(()=>this._closeMenu()),i.parentMenu=this._triggersSubmenu()?this._parentMaterialMenu:void 0,i.direction=this.dir,e&&i.focusFirstItem(this._openedBy||"program"),this._setIsMenuOpen(!0),i instanceof Fi&&(i._setIsOpen(!0),i._directDescendantItems.changes.pipe(pe(i.close)).subscribe(()=>{s.withLockedPosition(!1).reapplyLastPosition(),s.withLockedPosition(!0)}))}focus(e,i){this._focusMonitor&&e?this._focusMonitor.focusVia(this._element,e,i):this._element.nativeElement.focus(i)}_destroyMenu(e){let i=this._overlayRef,r=this._menu;!i||!this.menuOpen||(this._closingActionsSubscription.unsubscribe(),this._pendingRemoval?.unsubscribe(),r instanceof Fi&&this._ownsMenu(r)?(this._pendingRemoval=r._animationDone.pipe(je(1)).subscribe(()=>{i.detach(),Us.has(r)||r.lazyContent?.detach()}),r._setIsOpen(!1)):(i.detach(),r?.lazyContent?.detach()),r&&this._ownsMenu(r)&&Us.delete(r),this.restoreFocus&&(e==="keydown"||!this._openedBy||!this._triggersSubmenu())&&this.focus(this._openedBy),this._openedBy=void 0,this._setIsMenuOpen(!1))}_setIsMenuOpen(e){e!==this._menuOpen&&(this._menuOpen=e,this._menuOpen?this.menuOpened.emit():this.menuClosed.emit(),this._triggersSubmenu()&&this._menuItemInstance._setHighlighted(e),this._changeDetectorRef.markForCheck())}_createOverlay(e){if(!this._overlayRef){let i=this._getOverlayConfig(e);this._subscribeToPositions(e,i.positionStrategy),this._overlayRef=dr(this._injector,i),this._overlayRef.keydownEvents().subscribe(r=>{this._menu instanceof Fi&&this._menu._handleKeydown(r)})}return this._overlayRef}_getOverlayConfig(e){return new lr({positionStrategy:ia(this._injector,this._getOverlayOrigin()).withLockedPosition().withGrowAfterOpen().withTransformOriginOn(".mat-menu-panel, .mat-mdc-menu-panel"),backdropClass:e.backdropClass||"cdk-overlay-transparent-backdrop",panelClass:e.overlayPanelClass,scrollStrategy:this._scrollStrategy(),direction:this._dir||"ltr",disableAnimations:this._animationsDisabled})}_subscribeToPositions(e,i){e.setPositionClasses&&i.positionChanges.subscribe(r=>{this._ngZone.run(()=>{let o=r.connectionPair.overlayX==="start"?"after":"before",a=r.connectionPair.overlayY==="top"?"below":"above";e.setPositionClasses(o,a)})})}_setPosition(e,i){let[r,o]=e.xPosition==="before"?["end","start"]:["start","end"],[a,s]=e.yPosition==="above"?["bottom","top"]:["top","bottom"],[l,d]=[a,s],[u,h]=[r,o],_=0;if(this._triggersSubmenu()){if(h=r=e.xPosition==="before"?"start":"end",o=u=r==="end"?"start":"end",this._parentMaterialMenu){if(this._parentInnerPadding==null){let v=this._parentMaterialMenu.items.first;this._parentInnerPadding=v?v._getHostElement().offsetTop:0}_=a==="bottom"?this._parentInnerPadding:-this._parentInnerPadding}}else e.overlapTrigger||(l=a==="top"?"bottom":"top",d=s==="top"?"bottom":"top");i.withPositions([{originX:r,originY:l,overlayX:u,overlayY:a,offsetY:_},{originX:o,originY:l,overlayX:h,overlayY:a,offsetY:_},{originX:r,originY:d,overlayX:u,overlayY:s,offsetY:-_},{originX:o,originY:d,overlayX:h,overlayY:s,offsetY:-_}])}_menuClosingActions(){let e=this._getOutsideClickStream(this._overlayRef),i=this._overlayRef.detachments(),r=this._parentMaterialMenu?this._parentMaterialMenu.closed:ie(),o=this._parentMaterialMenu?this._parentMaterialMenu._hovered().pipe(me(a=>this._menuOpen&&a!==this._menuItemInstance)):ie();return ft(e,r,o,i)}_getPortal(e){return(!this._portal||this._portal.templateRef!==e.templateRef)&&(this._portal=new cn(e.templateRef,this._viewContainerRef)),this._portal}_ownsMenu(e){return Us.get(e)===this}_triggerIsAriaDisabled(){return Y(this._element.nativeElement.getAttribute("aria-disabled"))}static \u0275fac=function(i){zl()};static \u0275dir=R({type:t})}return t})(),zs=(()=>{class t extends iB{_cleanupTouchstart;_hoverSubscription=ue.EMPTY;get _deprecatedMatMenuTriggerFor(){return this.menu}set _deprecatedMatMenuTriggerFor(e){this.menu=e}get menu(){return this._menu}set menu(e){this._menu=e}menuData;restoreFocus=!0;menuOpened=new O;onMenuOpen=this.menuOpened;menuClosed=new O;onMenuClose=this.menuClosed;constructor(){super(!0);let e=c(xe);this._cleanupTouchstart=e.listen(this._element.nativeElement,"touchstart",i=>{Yo(i)||(this._openedBy="touch")},{passive:!0})}triggersSubmenu(){return super._triggersSubmenu()}toggleMenu(){return this.menuOpen?this.closeMenu():this.openMenu()}openMenu(){this._openMenu(!0)}closeMenu(){this._closeMenu()}updatePosition(){this._overlayRef?.updatePosition()}ngAfterContentInit(){this._handleHover()}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTouchstart(),this._hoverSubscription.unsubscribe()}_getOverlayOrigin(){return this._element}_getOutsideClickStream(e){return e.backdropClick()}_handleMousedown(e){qo(e)||(this._openedBy=e.button===0?"mouse":void 0,this.triggersSubmenu()&&e.preventDefault())}_handleKeydown(e){let i=e.keyCode;(i===13||i===32)&&(this._openedBy="keyboard"),this.triggersSubmenu()&&(i===39&&this.dir==="ltr"||i===37&&this.dir==="rtl")&&(this._openedBy="keyboard",this.openMenu())}_handleClick(e){this.triggersSubmenu()?(e.stopPropagation(),this.openMenu()):this.toggleMenu()}_handleHover(){this.triggersSubmenu()&&this._parentMaterialMenu&&(this._hoverSubscription=this._parentMaterialMenu._hovered().subscribe(e=>{e===this._menuItemInstance&&!e.disabled&&this._parentMaterialMenu?._panelAnimationState!=="void"&&(this._openedBy="mouse",this._openMenu(!1))}))}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["","mat-menu-trigger-for",""],["","matMenuTriggerFor",""]],hostAttrs:[1,"mat-mdc-menu-trigger"],hostVars:3,hostBindings:function(i,r){i&1&&w("click",function(a){return r._handleClick(a)})("mousedown",function(a){return r._handleMousedown(a)})("keydown",function(a){return r._handleKeydown(a)}),i&2&&j("aria-haspopup",r.menu?"menu":null)("aria-expanded",r.menuOpen)("aria-controls",r.menuOpen?r.menu?.panelId:null)},inputs:{_deprecatedMatMenuTriggerFor:[0,"mat-menu-trigger-for","_deprecatedMatMenuTriggerFor"],menu:[0,"matMenuTriggerFor","menu"],menuData:[0,"matMenuTriggerData","menuData"],restoreFocus:[0,"matMenuTriggerRestoreFocus","restoreFocus"]},outputs:{menuOpened:"menuOpened",onMenuOpen:"onMenuOpen",menuClosed:"menuClosed",onMenuClose:"onMenuClose"},exportAs:["matMenuTrigger"],features:[ge]})}return t})();var $s=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[Hr,ui,_e,Vn]})}return t})();function rB(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=b();p(),k(e.error)}}function oB(t,n){t&1&&V(0,"mat-spinner",6)}function aB(t,n){t&1&&g(0," Delete chat ")}var dh=class t{constructor(n){this.chat=n;this.dialogRef=c(Zt);this.state=c(Le);this.deleting=!1;this.error=""}remove(){return P(this,null,function*(){this.deleting=!0,this.error="";try{yield this.state.deleteChat(this.chat.id),this.dialogRef.close(!0)}catch(n){this.error=n instanceof Error?n.message:"Failed to delete chat"}finally{this.deleting=!1}})}static{this.\u0275fac=function(e){return new(e||t)(ne(Nn))}}static{this.\u0275cmp=x({type:t,selectors:[["hub-delete-chat-dialog"]],decls:14,vars:5,consts:[["mat-dialog-title",""],["role","alert",1,"error"],[1,"note"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","color","warn","type","button",3,"click","disabled"],["diameter","18"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"Delete chat"),f(),m(2,"mat-dialog-content"),D(3,rB,2,1,"div",1),m(4,"p"),g(5),f(),m(6,"p",2),g(7,"This action cannot be undone."),f()(),m(8,"mat-dialog-actions",3)(9,"button",4),w("click",function(){return i.dialogRef.close()}),g(10,"Cancel"),f(),m(11,"button",5),w("click",function(){return i.remove()}),D(12,oB,1,0,"mat-spinner",6)(13,aB,1,0),f()()),e&2&&(p(3),E(i.error?3:-1),p(2),ut("Are you sure you want to delete \u201C",i.chat.title||"this chat","\u201D?"),p(4),M("disabled",i.deleting),p(2),M("disabled",i.deleting),p(),E(i.deleting?12:13))},dependencies:[Pe,ot,Tt,Hn,zn,Un,Xt,Qt],styles:["mat-dialog-content[_ngcontent-%COMP%]{min-width:min(400px,100vw - 48px)}.note[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.error[_ngcontent-%COMP%]{padding:10px;border-radius:10px;background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};function sB(t,n){if(t&1&&(m(0,"div",3),g(1),f()),t&2){let e=b();p(),k(e.error)}}var uh=class t{constructor(n){this.chat=n;this.dialogRef=c(Zt);this.state=c(Le);this.saving=!1;this.error="";this.title=n.title||""}save(){return P(this,null,function*(){if(this.title.trim()){this.saving=!0,this.error="";try{yield this.state.renameChat(this.chat.id,this.title.trim()),this.dialogRef.close(!0)}catch(n){this.error=n instanceof Error?n.message:"Failed to rename chat"}finally{this.saving=!1}}})}static{this.\u0275fac=function(e){return new(e||t)(ne(Nn))}}static{this.\u0275cmp=x({type:t,selectors:[["hub-rename-chat-dialog"]],decls:13,vars:4,consts:[["mat-dialog-title",""],["appearance","outline"],["matInput","","autocomplete","off",3,"ngModelChange","keyup.enter","ngModel"],["role","alert",1,"error"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","color","primary","type","button",3,"click","disabled"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"Rename chat"),f(),m(2,"mat-dialog-content")(3,"mat-form-field",1)(4,"mat-label"),g(5,"Chat title"),f(),m(6,"input",2),ai("ngModelChange",function(o){return Mi(i.title,o)||(i.title=o),o}),w("keyup.enter",function(){return i.save()}),f(),ii(),f(),D(7,sB,2,1,"div",3),f(),m(8,"mat-dialog-actions",4)(9,"button",5),w("click",function(){return i.dialogRef.close()}),g(10,"Cancel"),f(),m(11,"button",6),w("click",function(){return i.save()}),g(12,"Save"),f()()),e&2&&(p(6),oi("ngModel",i.title),ri(),p(),E(i.error?7:-1),p(2),M("disabled",i.saving),p(2),M("disabled",!i.title.trim()||i.saving))},dependencies:[Gr,Ti,Wr,ta,Pe,ot,Tt,Hn,zn,Un,dn,Wn,Tn,Jr,Kr],styles:["mat-dialog-content[_ngcontent-%COMP%]{min-width:min(360px,100vw - 48px)}mat-form-field[_ngcontent-%COMP%]{width:100%}.error[_ngcontent-%COMP%]{padding:10px;border-radius:10px;background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};function lB(t,n){t&1&&(m(0,"span",8),g(1,"Archived"),f())}function cB(t,n){t&1&&(m(0,"span",11),g(1,"Thinking\u2026"),f())}function dB(t,n){if(t&1){let e=se();m(0,"button",22),w("click",function(){W(e);let r=b(2);return G(r.stop())}),m(1,"mat-icon"),g(2,"pause_circle"),f()()}}function uB(t,n){if(t&1){let e=se();m(0,"button",23),w("click",function(){W(e);let r=b(2);return G(r.reconnect())}),m(1,"mat-icon"),g(2,"play_circle"),f()()}}function mB(t,n){if(t&1){let e=se();m(0,"button",19),w("click",function(){W(e);let r=b(2);return G(r.stop())}),m(1,"mat-icon"),g(2,"pause"),f(),m(3,"span"),g(4,"Stop process"),f()()}}function fB(t,n){if(t&1){let e=se();m(0,"button",19),w("click",function(){W(e);let r=b(2);return G(r.reconnect())}),m(1,"mat-icon"),g(2,"play_arrow"),f(),m(3,"span"),g(4,"Reconnect ACP"),f()()}}function hB(t,n){if(t&1){let e=se();m(0,"div",3)(1,"button",4),w("click",function(){W(e);let r=b();return G(r.toggleNavigation())}),m(2,"mat-icon"),g(3,"menu"),f()(),m(4,"div",5)(5,"div",6)(6,"button",7),w("click",function(){W(e);let r=b();return G(r.rename())}),g(7),f(),D(8,lB,2,0,"span",8),f(),m(9,"div",9)(10,"span",10),g(11),f(),D(12,cB,2,0,"span",11),m(13,"span",12),V(14,"span",13),g(15),f()()()(),m(16,"div",14),D(17,dB,3,0,"button",15)(18,uB,3,0,"button",16),m(19,"button",17),w("click",function(){W(e);let r=b();return G(r.configRequested.emit())}),m(20,"mat-icon"),g(21,"tune"),f()(),m(22,"button",18)(23,"mat-icon"),g(24,"more_vert"),f()(),m(25,"mat-menu",null,0)(27,"button",19),w("click",function(){W(e);let r=b();return G(r.rename())}),m(28,"mat-icon"),g(29,"edit"),f(),m(30,"span"),g(31,"Rename chat"),f()(),D(32,mB,5,0,"button",20)(33,fB,5,0,"button",20),m(34,"button",19),w("click",function(){W(e);let r=b();return G(r.archive())}),m(35,"mat-icon"),g(36),f(),m(37,"span"),g(38),f()(),m(39,"button",19),w("click",function(){W(e);let r=b();return G(r.remove())}),m(40,"mat-icon",21),g(41,"delete"),f(),m(42,"span"),g(43,"Delete chat"),f()()()()}if(t&2){let e=rt(26),i=b();p(6),j("aria-label","Rename chat "+(i.chat.title||"Untitled chat")),p(),k(i.chat.title||"Untitled chat"),p(),E(i.chat.archived?8:-1),p(3),k(i.chat.agent),p(),E(i.chat.turn_state==="PROMPTING"?12:-1),p(),N("running",i.chat.process_state==="RUNNING")("dead",i.chat.process_state==="DEAD"),p(2),k(i.chat.process_state||"STOPPED"),p(2),E(i.chat.process_state==="RUNNING"?17:18),p(5),M("matMenuTriggerFor",e),p(10),E(i.chat.process_state==="RUNNING"?32:33),p(4),k(i.chat.archived?"unarchive":"archive"),p(2),k(i.chat.archived?"Unarchive chat":"Archive chat")}}function pB(t,n){t&1&&(m(0,"span",2),g(1,"No chat selected"),f())}var mh=class t{constructor(){this.chat=null;this.configRequested=new O;this.state=c(Le);this.dialog=c(Ai)}toggleNavigation(){this.state.setMobileDrawerOpen(!this.state.isMobileDrawerOpen())}rename(){this.chat&&this.dialog.open(uh,{width:"min(480px, calc(100vw - 32px))",data:this.chat})}stop(){return P(this,null,function*(){this.chat&&(yield this.state.stopChatProcess(this.chat.id).catch(n=>console.error("Failed to stop process",n)))})}reconnect(){return P(this,null,function*(){this.chat&&(yield this.state.retryConnection(this.chat.id))})}archive(){return P(this,null,function*(){this.chat&&(yield this.state.archiveChat(this.chat.id,!this.chat.archived).catch(n=>console.error("Failed to archive chat",n)))})}remove(){this.chat&&this.dialog.open(dh,{width:"min(520px, calc(100vw - 32px))",data:this.chat})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-chat-header"]],inputs:{chat:"chat"},outputs:{configRequested:"configRequested"},decls:3,vars:1,consts:[["actions","matMenu"],[1,"chat-header"],[1,"no-chat"],[1,"header-left"],["mat-icon-button","","aria-label","Open navigation","matTooltip","Open navigation",1,"nav-button",3,"click"],[1,"title-area"],[1,"title-line"],["mat-button","","type","button",1,"title-button",3,"click"],[1,"badge","stopped"],[1,"badges"],[1,"badge","agent"],[1,"badge","thinking"],[1,"badge"],[1,"status-dot"],[1,"header-actions"],["mat-icon-button","","matTooltip","Stop process","aria-label","Stop process"],["mat-icon-button","","matTooltip","Reconnect process","aria-label","Reconnect process"],["mat-icon-button","","matTooltip","Chat configuration","aria-label","Chat configuration",3,"click"],["mat-icon-button","","aria-label","Chat actions",3,"matMenuTriggerFor"],["mat-menu-item","","type","button",3,"click"],["mat-menu-item","","type","button"],["color","warn"],["mat-icon-button","","matTooltip","Stop process","aria-label","Stop process",3,"click"],["mat-icon-button","","matTooltip","Reconnect process","aria-label","Reconnect process",3,"click"]],template:function(e,i){e&1&&(m(0,"header",1),D(1,hB,44,15)(2,pB,2,0,"span",2),f()),e&2&&(p(),E(i.chat?1:2))},dependencies:[Pe,ot,Mn,Tt,Fe,We,$s,Fi,mr,zs,Yr,ur],styles:["[_nghost-%COMP%]{display:block;flex:0 0 auto}.chat-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:72px;padding:10px max(16px,(100% - 1120px) / 2);border-bottom:1px solid var(--%NS%mat-sys-outline-variant);background:var(--%NS%mat-sys-surface)}.header-left[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%], .title-line[_ngcontent-%COMP%], .badges[_ngcontent-%COMP%]{display:flex;align-items:center}.header-left[_ngcontent-%COMP%]{min-width:0;flex:1;gap:12px}.header-actions[_ngcontent-%COMP%]{gap:2px}.title-area[_ngcontent-%COMP%]{min-width:0}.title-line[_ngcontent-%COMP%]{min-width:0;gap:8px}.title-button[_ngcontent-%COMP%]{min-width:0;overflow:hidden;max-width:min(50vw,560px);padding-inline:4px;color:var(--%NS%mat-sys-on-surface);font-family:inherit;font-size:1.15rem;font-weight:600;line-height:1.3;text-align:left;text-overflow:ellipsis;white-space:nowrap}.title-button[_ngcontent-%COMP%]:hover{text-decoration:underline}.badges[_ngcontent-%COMP%]{flex-wrap:wrap;gap:6px;margin-top:5px}.badge[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;background:var(--%NS%mat-sys-surface-container);color:var(--%NS%mat-sys-on-surface-variant);font-size:.72rem}.badge.agent[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container)}.badge.running[_ngcontent-%COMP%]{background:var(--%NS%hub-status-running-container);color:var(--%NS%hub-status-running)}.badge.dead[_ngcontent-%COMP%]{background:var(--%NS%hub-status-dead-container);color:var(--%NS%hub-status-dead)}.badge.thinking[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container)}.status-dot[_ngcontent-%COMP%]{width:6px;height:6px;border-radius:50%;background:currentColor}.nav-button[_ngcontent-%COMP%]{display:none}.no-chat[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}@media(max-width:839px){.nav-button[_ngcontent-%COMP%]{display:inline-flex}}@media(max-width:599px){.chat-header[_ngcontent-%COMP%]{padding-inline:8px}.header-actions[_ngcontent-%COMP%] > button[_ngcontent-%COMP%]:first-child{display:none}.title-button[_ngcontent-%COMP%]{max-width:42vw}}"]})}};function gB(t,n){if(t&1&&(m(0,"div",2)(1,"mat-icon"),g(2,"check"),f(),g(3),f()),t&2){let e=b();p(3),ut(" Responded: ",e.permission.decision||"Handled")}}function _B(t,n){t&1&&V(0,"mat-spinner",6)}function vB(t,n){t&1&&g(0," Allow ")}function bB(t,n){if(t&1){let e=se();m(0,"mat-card-actions",3)(1,"button",4),w("click",function(){W(e);let r=b();return G(r.respond(!1))}),g(2,"Deny"),f(),m(3,"button",5),w("click",function(){W(e);let r=b();return G(r.respond(!0))}),D(4,_B,1,0,"mat-spinner",6)(5,vB,1,0),f()()}if(t&2){let e=b();p(),M("disabled",e.responding()),p(2),M("disabled",e.responding()),p(),E(e.responding()?4:5)}}var fh=class t{constructor(){this.chatId="";this.responding=T(!1);this.state=c(Le)}respond(n){return P(this,null,function*(){if(!(!this.chatId||!this.permission.requestId)){this.responding.set(!0);try{yield this.state.respondPermission(this.chatId,this.permission.requestId,n)}catch(e){console.error("Failed to respond to permission request",e)}finally{this.responding.set(!1)}}})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-permission-card"]],inputs:{permission:"permission",chatId:"chatId"},decls:13,vars:5,consts:[[1,"permission"],["mat-card-avatar",""],[1,"decision"],["align","end"],["mat-stroked-button","","type","button",3,"click","disabled"],["mat-flat-button","","color","primary","type","button",3,"click","disabled"],["diameter","18"]],template:function(e,i){e&1&&(m(0,"mat-card",0)(1,"mat-card-header")(2,"mat-icon",1),g(3,"shield_person"),f(),m(4,"mat-card-title"),g(5,"Permission request"),f(),m(6,"mat-card-subtitle"),g(7),f()(),m(8,"mat-card-content")(9,"pre"),g(10),f()(),D(11,gB,4,1,"div",2)(12,bB,6,3,"mat-card-actions",3),f()),e&2&&(N("responded",i.permission.responded),p(7),k(i.permission.method),p(3),k(i.permission.description||i.permission.method||"Action requested"),p(),E(i.permission.responded?11:12))},dependencies:[Pe,ot,$n,Ri,WE,Gf,Ps,Fs,Wf,Qr,Fe,We,Xt,Qt],styles:["[_nghost-%COMP%]{display:block;margin:12px 0}.permission[_ngcontent-%COMP%]{border:1px solid color-mix(in srgb,var(--%NS%mat-sys-error) 50%,transparent);background:var(--%NS%mat-sys-error-container)}.permission.responded[_ngcontent-%COMP%]{border-color:var(--%NS%mat-sys-outline-variant);background:var(--%NS%mat-sys-surface-container-low);opacity:.88}mat-card-header[_ngcontent-%COMP%]{align-items:center}mat-card-avatar[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-error)}mat-card-content[_ngcontent-%COMP%]{padding-top:12px}pre[_ngcontent-%COMP%]{margin:0;padding:12px;overflow:auto;border-radius:10px;background:color-mix(in srgb,var(--%NS%mat-sys-surface-container-lowest) 80%,transparent);white-space:pre-wrap;font:inherit}.decision[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;padding:0 16px 14px;color:var(--%NS%mat-sys-on-surface-variant);font-size:.85rem}"]})}};function yB(t,n){if(t&1&&(m(0,"li")(1,"mat-icon"),g(2),f(),m(3,"span"),g(4),f()()),t&2){let e=n.$implicit,i=b(2);N("completed",e.status==="completed"),p(2),k(i.statusIcon(e.status)),p(2),k(e.content)}}function CB(t,n){if(t&1&&(m(0,"mat-card",0)(1,"mat-card-header")(2,"mat-icon",1),g(3,"format_list_bulleted"),f(),m(4,"mat-card-title"),g(5,"Execution plan"),f()(),m(6,"mat-card-content")(7,"ul"),nt(8,yB,5,4,"li",2,Ha),f()()()),t&2){let e=b();p(8),it(e.entries)}}var hh=class t{constructor(){this.entries=[]}statusIcon(n){return n==="completed"?"check_circle":n==="in_progress"?"progress_activity":"radio_button_unchecked"}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-plan-view"]],inputs:{entries:"entries"},decls:1,vars:1,consts:[[1,"plan"],["mat-card-avatar",""],[3,"completed"]],template:function(e,i){e&1&&D(0,CB,10,0,"mat-card",0),e&2&&E(i.entries.length?0:-1)},dependencies:[$n,Ri,Gf,Ps,Fs,Qr,Fe,We],styles:["[_nghost-%COMP%]{display:block;margin:10px 0}.plan[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-tertiary-container);color:var(--%NS%mat-sys-on-tertiary-container)}mat-card-header[_ngcontent-%COMP%]{align-items:center}mat-card-avatar[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-tertiary-container)}mat-card-content[_ngcontent-%COMP%]{padding-top:6px}ul[_ngcontent-%COMP%]{display:grid;gap:8px;margin:0;padding:0;list-style:none}li[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:8px;line-height:1.4}li[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:20px;height:20px;font-size:20px;flex:0 0 auto}li.completed[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);text-decoration:line-through}"]})}};var NM=new C("CdkAccordion");var TM=(()=>{class t{accordion=c(NM,{optional:!0,skipSelf:!0});_changeDetectorRef=c(Me);_expansionDispatcher=c(jc);_openCloseAllSubscription=ue.EMPTY;closed=new O;opened=new O;destroyed=new O;expandedChange=new O;id=c($e).getId("cdk-accordion-child-");get expanded(){return this._expanded}set expanded(e){if(this._expanded!==e){if(this._expanded=e,this.expandedChange.emit(e),e){this.opened.emit();let i=this.accordion?this.accordion.id:this.id;this._expansionDispatcher.notify(this.id,i)}else this.closed.emit();this._changeDetectorRef.markForCheck()}}_expanded=!1;get disabled(){return this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=T(!1);_removeUniqueSelectionListener=()=>{};ngOnInit(){this._removeUniqueSelectionListener=this._expansionDispatcher.listen((e,i)=>{this.accordion&&!this.accordion.multi&&this.accordion.id===i&&this.id!==e&&(this.expanded=!1)}),this.accordion&&(this._openCloseAllSubscription=this._subscribeToOpenCloseAllActions())}ngOnDestroy(){this.opened.complete(),this.closed.complete(),this.destroyed.emit(),this.destroyed.complete(),this._removeUniqueSelectionListener(),this._openCloseAllSubscription.unsubscribe()}toggle(){this.disabled||(this.expanded=!this.expanded)}close(){this.disabled||(this.expanded=!1)}open(){this.disabled||(this.expanded=!0)}_subscribeToOpenCloseAllActions(){return this.accordion._openCloseAllActions.subscribe(e=>{this.disabled||(this.expanded=e)})}static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["cdk-accordion-item"],["","cdkAccordionItem",""]],inputs:{expanded:[2,"expanded","expanded",Y],disabled:[2,"disabled","disabled",Y]},outputs:{closed:"closed",opened:"opened",destroyed:"destroyed",expandedChange:"expandedChange"},exportAs:["cdkAccordionItem"],features:[Ie([{provide:NM,useValue:void 0}])]})}return t})(),kM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({})}return t})();var wB=["body"],SB=["bodyWrapper"],xB=[[["mat-expansion-panel-header"]],"*",[["mat-action-row"]]],DB=["mat-expansion-panel-header","*","mat-action-row"];function EB(t,n){}var MB=[[["mat-panel-title"]],[["mat-panel-description"]],"*"],IB=["mat-panel-title","mat-panel-description","*"];function NB(t,n){t&1&&(Ve(0,"span",1),fn(),Ve(1,"svg",2),xt(2,"path",3),Xe()())}var AM=new C("MAT_ACCORDION"),RM=new C("MAT_EXPANSION_PANEL"),TB=(()=>{class t{_template=c(bt);_expansionPanel=c(RM,{optional:!0});static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["ng-template","matExpansionPanelContent",""]]})}return t})(),OM=new C("MAT_EXPANSION_PANEL_DEFAULT_OPTIONS"),Nb=(()=>{class t extends TM{_viewContainerRef=c(pt);_animationsDisabled=Re();_document=c(X);_ngZone=c($);_elementRef=c(L);_renderer=c(xe);_cleanupTransitionEnd;get hideToggle(){return this._hideToggle||this.accordion&&this.accordion.hideToggle}set hideToggle(e){this._hideToggle=e}_hideToggle=!1;get togglePosition(){return this._togglePosition||this.accordion&&this.accordion.togglePosition}set togglePosition(e){this._togglePosition=e}_togglePosition;afterExpand=new O;afterCollapse=new O;_inputChanges=new I;accordion=c(AM,{optional:!0,skipSelf:!0});_lazyContent;_body;_bodyWrapper;_portal;_headerId=c($e).getId("mat-expansion-panel-header-");constructor(){super();let e=c(OM,{optional:!0});this._expansionDispatcher=c(jc),e&&(this.hideToggle=e.hideToggle)}_hasSpacing(){return this.accordion?this.expanded&&this.accordion.displayMode==="default":!1}_getExpandedState(){return this.expanded?"expanded":"collapsed"}toggle(){this.expanded=!this.expanded}close(){this.expanded=!1}open(){this.expanded=!0}ngAfterContentInit(){this._lazyContent&&this._lazyContent._expansionPanel===this&&this.opened.pipe(Ze(null),me(()=>this.expanded&&!this._portal),je(1)).subscribe(()=>{this._portal=new cn(this._lazyContent._template,this._viewContainerRef)}),this._setupAnimationEvents()}ngOnChanges(e){this._inputChanges.next(e)}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTransitionEnd?.(),this._inputChanges.complete()}_containsFocus(){if(this._body){let e=this._document.activeElement,i=this._body.nativeElement;return e===i||i.contains(e)}return!1}_transitionEndListener=({target:e,propertyName:i})=>{e===this._bodyWrapper?.nativeElement&&i==="grid-template-rows"&&this._ngZone.run(()=>{this.expanded?this.afterExpand.emit():this.afterCollapse.emit()})};_setupAnimationEvents(){this._ngZone.runOutsideAngular(()=>{this._animationsDisabled?(this.opened.subscribe(()=>this._ngZone.run(()=>this.afterExpand.emit())),this.closed.subscribe(()=>this._ngZone.run(()=>this.afterCollapse.emit()))):setTimeout(()=>{let e=this._elementRef.nativeElement;this._cleanupTransitionEnd=this._renderer.listen(e,"transitionend",this._transitionEndListener),e.classList.add("mat-expansion-panel-animations-enabled")},200)})}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-expansion-panel"]],contentQueries:function(i,r,o){if(i&1&&dt(o,TB,5),i&2){let a;U(a=z())&&(r._lazyContent=a.first)}},viewQuery:function(i,r){if(i&1&&Te(wB,5)(SB,5),i&2){let o;U(o=z())&&(r._body=o.first),U(o=z())&&(r._bodyWrapper=o.first)}},hostAttrs:[1,"mat-expansion-panel"],hostVars:4,hostBindings:function(i,r){i&2&&N("mat-expanded",r.expanded)("mat-expansion-panel-spacing",r._hasSpacing())},inputs:{hideToggle:[2,"hideToggle","hideToggle",Y],togglePosition:"togglePosition"},outputs:{afterExpand:"afterExpand",afterCollapse:"afterCollapse"},exportAs:["matExpansionPanel"],features:[Ie([{provide:AM,useValue:void 0},{provide:RM,useExisting:t}]),ge,Ne],ngContentSelectors:DB,decls:9,vars:4,consts:[["bodyWrapper",""],["body",""],[1,"mat-expansion-panel-content-wrapper"],["role","region",1,"mat-expansion-panel-content",3,"id"],[1,"mat-expansion-panel-body"],[3,"cdkPortalOutlet"]],template:function(i,r){i&1&&(ve(xB),B(0),m(1,"div",2,0)(3,"div",3,1)(5,"div",4),B(6,1),yt(7,EB,0,0,"ng-template",5),f(),B(8,2),f()()),i&2&&(p(),j("inert",r.expanded?null:""),p(2),M("id",r.id),j("aria-labelledby",r._headerId),p(4),M("cdkPortalOutlet",r._portal))},dependencies:[ki],styles:[`.mat-expansion-panel {
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
`],encapsulation:2})}return t})();var PM=(()=>{class t{panel=c(Nb,{host:!0});_element=c(L);_focusMonitor=c(Ht);_changeDetectorRef=c(Me);_parentChangeSubscription=ue.EMPTY;constructor(){c(tt).load(gn);let e=this.panel,i=c(OM,{optional:!0}),r=c(new wn("tabindex"),{optional:!0}),o=e.accordion?e.accordion._stateChanges.pipe(me(a=>!!(a.hideToggle||a.togglePosition))):at;this.tabIndex=parseInt(r||"")||0,this._parentChangeSubscription=ft(e.opened,e.closed,o,e._inputChanges.pipe(me(a=>!!(a.hideToggle||a.disabled||a.togglePosition)))).subscribe(()=>this._changeDetectorRef.markForCheck()),e.closed.pipe(me(()=>e._containsFocus())).subscribe(()=>this._focusMonitor.focusVia(this._element,"program")),i&&(this.expandedHeight=i.expandedHeight,this.collapsedHeight=i.collapsedHeight)}expandedHeight;collapsedHeight;tabIndex=0;get disabled(){return this.panel.disabled}_toggle(){this.disabled||this.panel.toggle()}_isExpanded(){return this.panel.expanded}_getExpandedState(){return this.panel._getExpandedState()}_getPanelId(){return this.panel.id}_getTogglePosition(){return this.panel.togglePosition}_showToggle(){return!this.panel.hideToggle&&!this.panel.disabled}_getHeaderHeight(){let e=this._isExpanded();return e&&this.expandedHeight?this.expandedHeight:!e&&this.collapsedHeight?this.collapsedHeight:null}_keydown(e){switch(e.keyCode){case 32:case 13:mt(e)||(e.preventDefault(),this._toggle());break;default:this.panel.accordion&&this.panel.accordion._handleHeaderKeydown(e);return}}focus(e,i){e?this._focusMonitor.focusVia(this._element,e,i):this._element.nativeElement.focus(i)}ngAfterViewInit(){this._focusMonitor.monitor(this._element).subscribe(e=>{e&&this.panel.accordion&&this.panel.accordion._handleHeaderFocus(this)})}ngOnDestroy(){this._parentChangeSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._element)}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=x({type:t,selectors:[["mat-expansion-panel-header"]],hostAttrs:["role","button",1,"mat-expansion-panel-header","mat-focus-indicator"],hostVars:13,hostBindings:function(i,r){i&1&&w("click",function(){return r._toggle()})("keydown",function(a){return r._keydown(a)}),i&2&&(j("id",r.panel._headerId)("tabindex",r.disabled?-1:r.tabIndex)("aria-controls",r._getPanelId())("aria-expanded",r._isExpanded())("aria-disabled",r.panel.disabled),jt("height",r._getHeaderHeight()),N("mat-expanded",r._isExpanded())("mat-expansion-toggle-indicator-after",r._getTogglePosition()==="after")("mat-expansion-toggle-indicator-before",r._getTogglePosition()==="before"))},inputs:{expandedHeight:"expandedHeight",collapsedHeight:"collapsedHeight",tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:Nt(e)]},ngContentSelectors:IB,decls:5,vars:3,consts:[[1,"mat-content"],[1,"mat-expansion-indicator"],["xmlns","http://www.w3.org/2000/svg","viewBox","0 -960 960 960","aria-hidden","true","focusable","false"],["d","M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"]],template:function(i,r){i&1&&(ve(MB),Ve(0,"span",0),B(1),B(2,1),B(3,2),Xe(),D(4,NB,3,0,"span",1)),i&2&&(N("mat-content-hide-toggle",!r._showToggle()),p(4),E(r._showToggle()?4:-1))},styles:[`.mat-expansion-panel-header {
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
`],encapsulation:2})}return t})(),FM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-panel-description"]],hostAttrs:[1,"mat-expansion-panel-header-description"]})}return t})(),LM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275dir=R({type:t,selectors:[["mat-panel-title"]],hostAttrs:[1,"mat-expansion-panel-header-title"]})}return t})();var jM=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Q({type:t});static \u0275inj=Z({imports:[kM,sr,_e]})}return t})();function AB(t,n){if(t&1&&(m(0,"pre"),g(1),f()),t&2){let e=b();p(),k(e.tool.output)}}var ph=class t{static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-tool-call"]],inputs:{tool:"tool"},decls:9,vars:4,consts:[[1,"tool",3,"disabled"]],template:function(e,i){e&1&&(m(0,"mat-expansion-panel",0)(1,"mat-expansion-panel-header")(2,"mat-panel-title")(3,"mat-icon"),g(4,"build"),f(),g(5),f(),m(6,"mat-panel-description"),g(7),f()(),D(8,AB,2,1,"pre"),f()),e&2&&(M("disabled",!i.tool.output),p(5),k(i.tool.title),p(2),k(i.tool.status),p(),E(i.tool.output?8:-1))},dependencies:[jM,Nb,PM,LM,FM,Fe,We],styles:["[_nghost-%COMP%]{display:block;margin:8px 0}.tool[_ngcontent-%COMP%]{border:1px solid var(--%NS%mat-sys-outline-variant);box-shadow:none}mat-panel-title[_ngcontent-%COMP%], mat-panel-description[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}mat-panel-title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary)}mat-panel-description[_ngcontent-%COMP%]{justify-content:flex-end;font-size:.78rem}pre[_ngcontent-%COMP%]{max-height:260px;overflow:auto;margin:0;padding:14px;border-radius:10px;background:var(--%NS%mat-sys-surface-container-lowest);white-space:pre-wrap;overflow-wrap:anywhere;font:.82rem/1.45 ui-monospace,SFMono-Regular,Consolas,monospace}"]})}};var RB=(t,n)=>n.id;function OB(t,n){if(t&1&&(m(0,"div",0)(1,"div",4),g(2),f(),m(3,"time"),g(4),f()()),t&2){let e=b();p(2),k(e.user(e.item).text),p(2),k(e.formatTime(e.user(e.item).timestamp))}}function PB(t,n){t&1&&(m(0,"span",6),V(1,"mat-spinner",8),g(2," Thinking\u2026"),f())}function FB(t,n){if(t&1&&(m(0,"div",9),g(1),f()),t&2){let e=b().$implicit;p(),k(e.text)}}function LB(t,n){if(t&1&&(m(0,"details",10)(1,"summary")(2,"mat-icon"),g(3,"psychology"),f(),g(4," Thought process"),f(),m(5,"div"),g(6),f()()),t&2){let e=b().$implicit;p(6),k(e.text)}}function jB(t,n){if(t&1&&V(0,"hub-tool-call",11),t&2){let e=b().$implicit;M("tool",e)}}function VB(t,n){if(t&1&&V(0,"hub-plan-view",12),t&2){let e=b().$implicit;M("entries",e.entries)}}function BB(t,n){if(t&1&&V(0,"hub-permission-card",13),t&2){let e=b().$implicit,i=b(2);M("permission",e)("chatId",i.chatId)}}function HB(t,n){if(t&1&&D(0,FB,2,1,"div",9)(1,LB,7,1,"details",10)(2,jB,1,1,"hub-tool-call",11)(3,VB,1,1,"hub-plan-view",12)(4,BB,1,2,"hub-permission-card",13),t&2){let e,i=n.$implicit;E((e=i.type)==="message_chunk"?0:e==="thought_chunk"?1:e==="tool_call"?2:e==="plan"?3:e==="permission_request"?4:-1)}}function UB(t,n){if(t&1&&(m(0,"article",1)(1,"header")(2,"span",5),g(3),f(),m(4,"strong"),g(5),f(),m(6,"time"),g(7),f(),D(8,PB,3,0,"span",6),f(),m(9,"div",7),nt(10,HB,5,1,null,null,RB),f()()),t&2){let e=b();p(3),k(e.turn(e.item).agent[0]||"A"),p(2),k(e.turn(e.item).agent),p(2),k(e.formatTime(e.turn(e.item).timestamp)),p(),E(e.turn(e.item).status==="in_progress"?8:-1),p(2),it(e.turn(e.item).entries)}}function zB(t,n){if(t&1&&(m(0,"div",2)(1,"mat-icon"),g(2,"error"),f(),m(3,"span"),g(4),f()()),t&2){let e=b();p(4),k(e.error(e.item).message)}}function $B(t,n){if(t&1&&(m(0,"div",3)(1,"span"),g(2),f()()),t&2){let e=b();p(2),Wa("Process: ",e.state(e.item).process," \xB7 Turn: ",e.state(e.item).turn)}}var gh=class t{constructor(){this.chatId=""}user(n){return n}turn(n){return n}error(n){return n}state(n){return n}formatTime(n){if(!n)return"";let e=new Date(n);return Number.isNaN(e.valueOf())?"":e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-message-item"]],inputs:{item:"item",chatId:"chatId"},decls:4,vars:1,consts:[[1,"user-message"],[1,"turn"],["role","alert",1,"error-message"],[1,"state-change"],[1,"user-bubble"],[1,"avatar"],[1,"thinking"],[1,"turn-body"],["diameter","14"],[1,"message-text"],[1,"thought"],[3,"tool"],[3,"entries"],[3,"permission","chatId"]],template:function(e,i){if(e&1&&D(0,OB,5,2,"div",0)(1,UB,12,4,"article",1)(2,zB,5,1,"div",2)(3,$B,3,2,"div",3),e&2){let r;E((r=i.item.type)==="user_message"?0:r==="turn"?1:r==="error"?2:r==="state_change"?3:-1)}},dependencies:[Fe,We,Xt,Qt,fh,hh,ph],styles:["[_nghost-%COMP%]{display:block;margin-bottom:26px}.user-message[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:flex-end;margin-left:18%}.user-bubble[_ngcontent-%COMP%]{max-width:100%;padding:12px 16px;border-radius:18px 18px 4px;background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container);white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.5;box-shadow:var(--%NS%mat-sys-level1)}time[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-outline);font-size:.72rem}.user-message[_ngcontent-%COMP%]   time[_ngcontent-%COMP%]{margin-top:5px;padding-right:4px}.turn[_ngcontent-%COMP%]{margin-right:3%}.turn[_ngcontent-%COMP%] > header[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;color:var(--%NS%mat-sys-on-surface-variant);font-size:.82rem}.avatar[_ngcontent-%COMP%]{display:grid;place-items:center;width:32px;height:32px;border-radius:12px 12px 12px 3px;background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);font-weight:700;text-transform:uppercase}.turn[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface)}.thinking[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:999px;background:var(--%NS%mat-sys-tertiary-container);color:var(--%NS%mat-sys-on-tertiary-container)}.turn-body[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:12px;padding:16px;border-radius:4px 20px 20px;background:var(--%NS%mat-sys-surface-container-low)}.message-text[_ngcontent-%COMP%]{white-space:pre-wrap;overflow-wrap:anywhere;font-size:1rem;line-height:1.65}.thought[_ngcontent-%COMP%]{padding:10px 12px;border:1px dashed var(--%NS%mat-sys-outline-variant);border-radius:12px;color:var(--%NS%mat-sys-on-surface-variant)}.thought[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]{display:flex;align-items:center;gap:7px;cursor:pointer;font-weight:600}.thought[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:19px;height:19px;font-size:19px}.thought[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{margin-top:9px;padding-top:9px;border-top:1px solid var(--%NS%mat-sys-outline-variant);white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.5}.error-message[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:14px;background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}.state-change[_ngcontent-%COMP%]{display:flex;justify-content:center;margin:10px 0}.state-change[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{padding:5px 10px;border-radius:999px;background:var(--%NS%mat-sys-surface-variant);color:var(--%NS%mat-sys-on-surface-variant);font-size:.75rem}@media(max-width:599px){.user-message[_ngcontent-%COMP%]{margin-left:8%}.turn[_ngcontent-%COMP%]{margin-right:0}.turn-body[_ngcontent-%COMP%]{padding:12px}}"]})}};var WB=["viewport"],GB=(t,n)=>n.id;function qB(t,n){if(t&1&&V(0,"hub-message-item",3),t&2){let e=n.$implicit,i=b();M("item",e)("chatId",i.chatId)}}function YB(t,n){if(t&1){let e=se();m(0,"div",4)(1,"button",5),w("click",function(){W(e);let r=b();return G(r.scrollToBottom(!0))}),m(2,"mat-icon"),g(3,"arrow_downward"),f(),g(4," Latest"),f()()}}var _h=class t{constructor(){this.items=[];this.chatId="";this.showScrollButton=!1;this.autoScroll=!0;this.lastLength=0}ngAfterViewChecked(){this.items.length!==this.lastLength&&(this.lastLength=this.items.length,this.autoScroll&&this.scrollToBottom())}onScroll(){let n=this.viewport?.nativeElement;if(!n)return;let e=n.scrollHeight-n.scrollTop-n.clientHeight;this.autoScroll=e<=80,this.showScrollButton=e>200}scrollToBottom(n=!1){let e=this.viewport?.nativeElement;e&&e.scrollTo({top:e.scrollHeight,behavior:n?"smooth":"auto"})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-event-stream"]],viewQuery:function(e,i){if(e&1&&Te(WB,5),e&2){let r;U(r=z())&&(i.viewport=r.first)}},inputs:{items:"items",chatId:"chatId"},decls:6,vars:1,consts:[["viewport",""],["aria-live","polite",1,"stream",3,"scroll"],[1,"stream-content"],[3,"item","chatId"],[1,"scroll-control"],["mat-fab","","extended","","color","primary","type","button","matTooltip","Scroll to latest message",3,"click"]],template:function(e,i){e&1&&(m(0,"div",1,0),w("scroll",function(){return i.onScroll()}),m(2,"div",2),nt(3,qB,1,2,"hub-message-item",3,GB),f(),D(5,YB,5,0,"div",4),f()),e&2&&(p(3),it(i.items),p(2),E(i.showScrollButton?5:-1))},dependencies:[Pe,Cs,Fe,We,Yr,ur,gh],styles:["[_nghost-%COMP%]{display:block;min-height:0;flex:1}.stream[_ngcontent-%COMP%]{position:relative;height:100%;overflow:auto;padding:28px max(20px,(100% - 920px) / 2);scroll-behavior:smooth}.stream-content[_ngcontent-%COMP%]{min-height:100%}.scroll-control[_ngcontent-%COMP%]{position:sticky;bottom:20px;display:flex;justify-content:center;height:0;overflow:visible;z-index:1}@media(max-width:599px){.stream[_ngcontent-%COMP%]{padding:20px 12px}}"]})}};function ZB(t,n){t&1&&(m(0,"section",9)(1,"mat-icon"),g(2,"chat"),f(),m(3,"h1"),g(4,"No chat selected"),f(),m(5,"p"),g(6,"Choose a chat from the navigation."),f()())}function QB(t,n){if(t&1&&(m(0,"section",9),V(1,"mat-spinner",14),m(2,"h1"),g(3),f(),m(4,"p"),g(5,"Initializing the ACP session and loading agent options."),f()()),t&2){let e=b();p(3),ut("Connecting to ",e.chat().agent,"\u2026")}}function XB(t,n){if(t&1){let e=se();m(0,"section",10)(1,"mat-icon"),g(2,"error_outline"),f(),m(3,"h1"),g(4,"Connection failed"),f(),m(5,"p"),g(6),f(),m(7,"button",15),w("click",function(){W(e);let r=b();return G(r.retry())}),g(8,"Retry connection"),f()()}if(t&2){let e=b();p(6),k(e.connectError())}}function KB(t,n){if(t&1){let e=se();m(0,"section",10)(1,"mat-icon"),g(2,"tune"),f(),m(3,"h1"),g(4,"Agent options not loaded"),f(),m(5,"p"),g(6),f(),m(7,"button",15),w("click",function(){W(e);let r=b();return G(r.retry())}),g(8,"Retry connection"),f()()}if(t&2){let e=b();p(6),ut("Agent Hub cannot read the configuration of ",e.chat().agent," yet.")}}function JB(t,n){if(t&1&&(m(0,"section",11)(1,"mat-card")(2,"mat-card-content")(3,"div",16)(4,"span",17),g(5),f(),m(6,"div")(7,"h1"),g(8),f(),m(9,"p"),g(10,"Configure agent options or send your first message to begin."),f()()(),V(11,"hub-chat-config",6),f()()()),t&2){let e=b();p(5),k(e.chat().agent[0]),p(3),ut("",e.chat().agent," connected"),p(3),M("chat",e.chat())("options",e.options())}}function eH(t,n){if(t&1&&V(0,"hub-event-stream",12),t&2){let e=b();M("items",e.items())("chatId",e.chatId)}}function tH(t,n){if(t&1&&V(0,"hub-chat-composer",13),t&2){let e=b();M("chatId",e.chatId)("processState",e.chat().process_state||"STOPPED")("turnState",e.chat().turn_state||"IDLE")("disabled",e.connecting()||!!e.connectError()||!e.configLoaded())}}var vh=class t{constructor(){this.chatIdState=T("");this.state=c(Le);this.configOpen=T(!1);this.compact=T(!1);this.breakpointObserver=c(Go);this.destroyRef=c(Je);this.chat=ke(()=>this.chatIdState()?this.state.findChat(this.chatIdState()):null);this.items=ke(()=>this.chatIdState()?this.state.reducersByChat()[this.chatIdState()]?.items??[]:[]);this.options=ke(()=>this.chatIdState()?this.state.configOptionsByChat()[this.chatIdState()]??[]:[]);this.connecting=ke(()=>this.chatIdState()?this.state.connectingChats().has(this.chatIdState()):!1);this.connectError=ke(()=>this.chatIdState()?this.state.connectErrors()[this.chatIdState()]??"":"");this.configLoaded=ke(()=>this.chatIdState()?this.state.configLoadedByChat()[this.chatIdState()]===!0:!1);this.breakpointObserver.observe("(max-width: 839px)").pipe(Ym(this.destroyRef)).subscribe(({matches:n})=>this.compact.set(n))}set chatId(n){this.chatIdState.set(n)}get chatId(){return this.chatIdState()}openConfig(n){this.configOpen.set(!0),n.open()}closeConfig(n){this.configOpen.set(!1),n.close()}retry(){this.chatId&&this.state.retryConnection(this.chatId)}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-chat-workspace"]],inputs:{chatId:"chatId"},decls:20,vars:8,consts:[["configDrawer",""],[1,"chat-layout",3,"hasBackdrop"],["position","end","aria-label","Chat configuration",3,"closed","mode","opened"],[1,"config-header"],["mat-icon-button","","aria-label","Close chat configuration",3,"click"],[1,"config-body"],[3,"chat","options"],[1,"chat-content"],[3,"configRequested","chat"],[1,"status-state"],["role","alert",1,"status-state","error-state"],[1,"welcome"],[3,"items","chatId"],[3,"chatId","processState","turnState","disabled"],["diameter","44"],["mat-flat-button","","color","primary","type","button",3,"click"],[1,"welcome-heading"],[1,"avatar"]],template:function(e,i){if(e&1){let r=se();m(0,"mat-drawer-container",1)(1,"mat-drawer",2,0),w("closed",function(){return i.configOpen.set(!1)}),m(3,"div",3)(4,"h2"),g(5,"Chat configuration"),f(),m(6,"button",4),w("click",function(){W(r);let a=rt(2);return G(i.closeConfig(a))}),m(7,"mat-icon"),g(8,"close"),f()()(),m(9,"div",5),V(10,"hub-chat-config",6),f()(),m(11,"mat-drawer-content",7)(12,"hub-chat-header",8),w("configRequested",function(){W(r);let a=rt(2);return G(i.openConfig(a))}),f(),D(13,ZB,7,0,"section",9)(14,QB,6,1,"section",9)(15,XB,9,1,"section",10)(16,KB,9,1,"section",10)(17,JB,12,4,"section",11)(18,eH,1,2,"hub-event-stream",12),D(19,tH,1,4,"hub-chat-composer",13),f()()}e&2&&(M("hasBackdrop",i.compact()),p(),M("mode",i.compact()?"over":"side")("opened",i.configOpen()),p(9),M("chat",i.chat())("options",i.options()),p(2),M("chat",i.chat()),p(),E(i.chat()?i.connecting()?14:i.connectError()?15:!i.configLoaded()&&!i.items().length?16:i.items().length?18:17:13),p(6),E(i.chat()?19:-1))},dependencies:[sh,lh,mh,_h,Pe,ot,Mn,$n,Ri,Ps,Fe,We,Xt,Qt,mf,Oc,Pc,Ko],styles:["[_nghost-%COMP%]{display:block;min-height:0;flex:1}.chat-layout[_ngcontent-%COMP%]{height:100%;min-height:calc(100vh - 1px)}.chat-content[_ngcontent-%COMP%]{display:flex;min-height:0;flex-direction:column}mat-drawer[_ngcontent-%COMP%]{width:380px;max-width:90vw}.config-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--%NS%mat-sys-outline-variant)}.config-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0;font-size:1.1rem}.config-body[_ngcontent-%COMP%]{overflow:auto;height:calc(100% - 68px);padding:20px}.status-state[_ngcontent-%COMP%]{display:grid;justify-items:center;align-content:center;gap:12px;min-height:320px;padding:40px 20px;color:var(--%NS%mat-sys-on-surface-variant);text-align:center}.status-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:48px;height:48px;font-size:48px;color:var(--%NS%mat-sys-primary)}.status-state[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .status-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0}.status-state[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface);font-size:1.35rem}.error-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-error)}.error-state[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-error)}.welcome[_ngcontent-%COMP%]{display:flex;justify-content:center;overflow:auto;flex:1;padding:28px max(20px,(100% - 920px) / 2)}.welcome[_ngcontent-%COMP%]   mat-card[_ngcontent-%COMP%]{width:100%;max-width:920px;align-self:flex-start}.welcome-heading[_ngcontent-%COMP%]{display:flex;align-items:center;gap:14px;margin-bottom:22px}.welcome-heading[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .welcome-heading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0}.welcome-heading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-top:4px;color:var(--%NS%mat-sys-on-surface-variant)}.avatar[_ngcontent-%COMP%]{display:grid;place-items:center;width:48px;height:48px;border-radius:16px 16px 16px 4px;background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);font-weight:700;text-transform:uppercase}"]})}};var bh=class t{constructor(){this.route=c(En);this.chatId=Zm(this.route.paramMap.pipe(ee(n=>n.get("chatId")??"")),{initialValue:this.route.snapshot.paramMap.get("chatId")??""})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-chat-page"]],decls:1,vars:1,consts:[[3,"chatId"]],template:function(e,i){e&1&&V(0,"hub-chat-workspace",0),e&2&&M("chatId",i.chatId())},dependencies:[vh],encapsulation:2})}};function nH(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=b();p(),k(e.errorMessage)}}function iH(t,n){t&1&&V(0,"mat-spinner",6)}function rH(t,n){t&1&&g(0," Delete project ")}var Ws=class t{constructor(n){this.project=n;this.state=c(Le);this.dialogRef=c(Zt);this.deleting=!1;this.errorMessage=""}delete(){return P(this,null,function*(){this.deleting=!0,this.errorMessage="";try{yield this.state.deleteProject(this.project.id),this.dialogRef.close(!0)}catch(n){this.errorMessage=n instanceof Error?n.message:"Failed to delete project"}finally{this.deleting=!1}})}static{this.\u0275fac=function(e){return new(e||t)(ne(Nn))}}static{this.\u0275cmp=x({type:t,selectors:[["hub-delete-project-dialog"]],decls:20,vars:5,consts:[["mat-dialog-title",""],["role","alert",1,"error-box"],[1,"note"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","color","warn","type","button",3,"click","disabled"],["diameter","18"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"Delete project"),f(),m(2,"mat-dialog-content"),D(3,nH,2,1,"div",1),m(4,"p"),g(5,"Are you sure you want to remove "),m(6,"strong"),g(7),f(),g(8," from Agent Hub?"),f(),m(9,"p",2),g(10,"Project files on disk will "),m(11,"strong"),g(12,"not"),f(),g(13," be deleted."),f()(),m(14,"mat-dialog-actions",3)(15,"button",4),w("click",function(){return i.dialogRef.close()}),g(16,"Cancel"),f(),m(17,"button",5),w("click",function(){return i.delete()}),D(18,iH,1,0,"mat-spinner",6)(19,rH,1,0),f()()),e&2&&(p(3),E(i.errorMessage?3:-1),p(4),ut("\u201C",i.project.name,"\u201D"),p(8),M("disabled",i.deleting),p(2),M("disabled",i.deleting),p(),E(i.deleting?18:19))},dependencies:[Pe,ot,Tt,Hn,zn,Un,Xt,Qt],styles:["mat-dialog-content[_ngcontent-%COMP%]{min-width:min(420px,100vw - 48px)}.note[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:12px;background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};function oH(t,n){if(t&1&&(m(0,"div",1),g(1),f()),t&2){let e=b();p(),k(e.errorMessage)}}function aH(t,n){if(t&1&&(m(0,"div",6),g(1,"Browsing: "),m(2,"code"),g(3),f(),V(4,"br"),g(5,"Select the current folder to use it."),f()),t&2){let e=b();p(3),k(e.browsedPath)}}function sH(t,n){if(t&1&&(m(0,"div",7)(1,"strong"),g(2,"Selected directory"),f(),m(3,"code"),g(4),f()()),t&2){let e=b();p(4),k(e.selectedPath)}}var Gs=class t{constructor(n){this.project=n;this.state=c(Le);this.dialogRef=c(Zt);this.browsedPath="";this.saving=!1;this.errorMessage="";this.name=n.name,this.selectedPath=n.path}save(){return P(this,null,function*(){if(!this.name.trim()||!this.selectedPath){this.errorMessage="Please provide both project name and directory path.";return}this.saving=!0,this.errorMessage="";try{yield this.state.editProject(this.project.id,this.name.trim(),this.selectedPath.trim()),this.dialogRef.close()}catch(n){this.errorMessage=n instanceof Error?n.message:"Failed to update project"}finally{this.saving=!1}})}static{this.\u0275fac=function(e){return new(e||t)(ne(Nn))}}static{this.\u0275cmp=x({type:t,selectors:[["hub-edit-project-dialog"]],decls:18,vars:7,consts:[["mat-dialog-title",""],["role","alert",1,"error-box"],["appearance","outline"],["matInput","","autocomplete","off",3,"ngModelChange","ngModel"],[1,"field-label"],[3,"folderBrowsed","folderSelected","initialPath"],[1,"path-note"],[1,"selected-path"],["align","end"],["mat-button","","type","button",3,"click","disabled"],["mat-flat-button","","color","primary","type","button",3,"click","disabled"]],template:function(e,i){e&1&&(m(0,"h2",0),g(1,"Edit project"),f(),m(2,"mat-dialog-content"),D(3,oH,2,1,"div",1),m(4,"mat-form-field",2)(5,"mat-label"),g(6,"Project display name"),f(),m(7,"input",3),ai("ngModelChange",function(o){return Mi(i.name,o)||(i.name=o),o}),f(),ii(),f(),m(8,"p",4),g(9,"Project directory"),f(),m(10,"hub-folder-picker",5),w("folderBrowsed",function(o){return i.browsedPath=o.path})("folderSelected",function(o){return i.selectedPath=o.path}),f(),D(11,aH,6,1,"div",6),D(12,sH,5,1,"div",7),f(),m(13,"mat-dialog-actions",8)(14,"button",9),w("click",function(){return i.dialogRef.close()}),g(15,"Cancel"),f(),m(16,"button",10),w("click",function(){return i.save()}),g(17,"Save changes"),f()()),e&2&&(p(3),E(i.errorMessage?3:-1),p(4),oi("ngModel",i.name),ri(),p(3),M("initialPath",i.project.path),p(),E(i.browsedPath&&i.browsedPath!==i.selectedPath?11:-1),p(),E(i.selectedPath?12:-1),p(2),M("disabled",i.saving),p(2),M("disabled",!i.name.trim()||!i.selectedPath||i.saving))},dependencies:[Gr,Ti,Wr,ta,Vs,Pe,ot,Tt,Hn,zn,Un,dn,Wn,Tn,Jr,Kr],styles:["mat-dialog-content[_ngcontent-%COMP%]{min-width:min(520px,100vw - 48px);display:flex;flex-direction:column;gap:12px}mat-form-field[_ngcontent-%COMP%]{width:100%}.field-label[_ngcontent-%COMP%]{margin:4px 0 -4px;color:var(--%NS%mat-sys-on-surface-variant);font-weight:600}.path-note[_ngcontent-%COMP%], .selected-path[_ngcontent-%COMP%], .error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:12px}.path-note[_ngcontent-%COMP%], .selected-path[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container);color:var(--%NS%mat-sys-on-surface-variant);font-size:.82rem}.selected-path[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px}code[_ngcontent-%COMP%]{overflow-wrap:anywhere;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.error-box[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}"]})}};var lH=t=>["/projects",t],cH=t=>({project:t}),dH=(t,n)=>n.id;function uH(t,n){t&1&&(m(0,"div",5),V(1,"mat-spinner",11),m(2,"span"),g(3,"Loading projects\u2026"),f()())}function mH(t,n){if(t&1&&(m(0,"div",6),g(1),f()),t&2){let e=b();p(),k(e.state.projectsError())}}function fH(t,n){if(t&1){let e=se();m(0,"mat-card",7)(1,"mat-icon"),g(2,"folder_open"),f(),m(3,"h2"),g(4,"No projects yet"),f(),m(5,"p"),g(6,"Create a project from an existing server directory or clone a Git repository."),f(),m(7,"button",4),w("click",function(){W(e);let r=b();return G(r.newProject())}),m(8,"mat-icon"),g(9,"add"),f(),g(10," Create your first project"),f()()}}function hH(t,n){if(t&1&&(m(0,"mat-card",12)(1,"a",13)(2,"div",14)(3,"mat-icon"),g(4,"folder"),f()(),m(5,"mat-card-header")(6,"mat-card-title"),g(7),f(),m(8,"mat-card-subtitle",15),g(9),f()()(),m(10,"button",16)(11,"mat-icon"),g(12,"more_vert"),f()(),m(13,"div",17)(14,"span")(15,"mat-icon"),g(16,"chat"),f(),g(17),f(),m(18,"span"),g(19),f()()()),t&2){let e=n.$implicit,i=b(2),r=rt(16);p(),M("routerLink",Fo(10,lH,e.id)),j("aria-label","Open project "+e.name),p(6),k(e.name),p(),M("title",e.path),p(),k(e.path),p(),M("matMenuTriggerFor",r)("matMenuTriggerData",Fo(12,cH,e)),j("aria-label","Actions for "+e.name),p(7),ut("",i.chatCount(e)," chats"),p(2),ut("Updated ",i.formatDate(e.updated_at))}}function pH(t,n){if(t&1&&(m(0,"div",8),nt(1,hH,20,14,"mat-card",12,dH),f()),t&2){let e=b();p(),it(e.state.projects())}}function gH(t,n){if(t&1){let e=se();m(0,"button",18),w("click",function(){let r=W(e).project,o=b();return G(o.edit(r))}),m(1,"mat-icon"),g(2,"edit"),f(),m(3,"span"),g(4,"Edit project"),f()(),m(5,"button",18),w("click",function(){let r=W(e).project,o=b();return G(o.remove(r))}),m(6,"mat-icon",19),g(7,"delete"),f(),m(8,"span"),g(9,"Delete project"),f()()}}var yh=class t{constructor(){this.state=c(Le);this.dialog=c(Ai)}newProject(){this.dialog.open(Bs,{width:"min(720px, calc(100vw - 32px))"})}edit(n){this.dialog.open(Gs,{width:"min(640px, calc(100vw - 32px))",data:n})}remove(n){this.dialog.open(Ws,{width:"min(520px, calc(100vw - 32px))",data:n})}chatCount(n){return n.chat_count??this.state.chatsByProject()[n.id]?.length??0}formatDate(n){if(!n)return"";let e=new Date(n);return Number.isNaN(e.valueOf())?"":e.toLocaleDateString([],{month:"short",day:"numeric"})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-project-list"]],decls:22,vars:1,consts:[["projectMenu","matMenu"],["aria-labelledby","projects-title",1,"projects-page"],[1,"page-header"],["id","projects-title"],["mat-flat-button","","color","primary","type","button",3,"click"],["role","status",1,"loading"],["role","alert",1,"error-box"],[1,"empty-card"],[1,"project-grid"],["matMenuContent",""],["mat-fab","","extended","","color","primary","type","button",1,"mobile-fab",3,"click"],["diameter","36"],[1,"project-card"],[1,"card-link",3,"routerLink"],[1,"project-icon"],[3,"title"],["mat-icon-button","",3,"matMenuTriggerFor","matMenuTriggerData"],[1,"card-meta"],["mat-menu-item","","type","button",3,"click"],["color","warn"]],template:function(e,i){e&1&&(m(0,"section",1)(1,"div",2)(2,"div")(3,"h1",3),g(4,"Projects"),f(),m(5,"p"),g(6,"Manage code repositories and active ACP agent sessions."),f()(),m(7,"button",4),w("click",function(){return i.newProject()}),m(8,"mat-icon"),g(9,"add"),f(),g(10," New project"),f()(),D(11,uH,4,0,"div",5)(12,mH,2,1,"div",6)(13,fH,11,0,"mat-card",7)(14,pH,3,0,"div",8),m(15,"mat-menu",null,0),yt(17,gH,10,0,"ng-template",9),f(),m(18,"button",10),w("click",function(){return i.newProject()}),m(19,"mat-icon"),g(20,"add"),f(),g(21," New project"),f()()),e&2&&(p(11),E(i.state.loadingProjects()?11:i.state.projectsError()?12:i.state.projects().length===0?13:14))},dependencies:[Pe,ot,Mn,Cs,$n,Ri,Fs,Wf,Qr,Tt,Fe,We,$s,Fi,mr,IM,zs,Xt,Qt,Ni],styles:["[_nghost-%COMP%]{display:block;height:100%;overflow:auto}.projects-page[_ngcontent-%COMP%]{max-width:1120px;margin:0 auto;padding:40px 32px 72px}.page-header[_ngcontent-%COMP%]{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:32px}h1[_ngcontent-%COMP%]{margin:0;font-size:clamp(2rem,5vw,3.1rem);line-height:1.1}.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:10px 0 0;color:var(--%NS%mat-sys-on-surface-variant);font-size:1.05rem}.project-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}.project-card[_ngcontent-%COMP%]{position:relative;min-height:190px;padding:20px;transition:box-shadow .16s ease,transform .16s ease}.project-card[_ngcontent-%COMP%]:hover{transform:translateY(-2px);box-shadow:var(--%NS%mat-sys-level2)}.card-link[_ngcontent-%COMP%]{display:block;padding-right:34px;color:inherit;text-decoration:none}.project-card[_ngcontent-%COMP%] > button[_ngcontent-%COMP%]{position:absolute;top:12px;right:12px}.project-icon[_ngcontent-%COMP%]{display:grid;place-items:center;width:48px;height:48px;margin-bottom:16px;border-radius:16px 16px 16px 4px;background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container)}mat-card-header[_ngcontent-%COMP%]{padding:0}mat-card-title[_ngcontent-%COMP%], mat-card-subtitle[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.card-meta[_ngcontent-%COMP%]{display:flex;justify-content:space-between;gap:12px;margin-top:28px;color:var(--%NS%mat-sys-on-surface-variant);font-size:.78rem}.card-meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px;min-width:0}.card-meta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:17px;height:17px;font-size:17px}.empty-card[_ngcontent-%COMP%]{display:grid;justify-items:center;gap:12px;padding:64px 24px;text-align:center}.empty-card[_ngcontent-%COMP%] > mat-icon[_ngcontent-%COMP%]{width:48px;height:48px;font-size:48px;color:var(--%NS%mat-sys-primary)}.empty-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .empty-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0}.empty-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{max-width:440px;color:var(--%NS%mat-sys-on-surface-variant)}.loading[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;gap:12px;padding:72px;color:var(--%NS%mat-sys-on-surface-variant)}.error-box[_ngcontent-%COMP%]{padding:16px;border-radius:14px;background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}.mobile-fab[_ngcontent-%COMP%]{display:none}@media(max-width:599px){.projects-page[_ngcontent-%COMP%]{padding:24px 16px 96px}.page-header[_ngcontent-%COMP%]{flex-direction:column}.page-header[_ngcontent-%COMP%] > button[_ngcontent-%COMP%]{width:100%}.project-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}.mobile-fab[_ngcontent-%COMP%]{display:inline-flex;position:fixed;right:20px;bottom:20px;z-index:4}}"]})}};var Ch=class t{static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-home-page"]],decls:1,vars:0,template:function(e,i){e&1&&V(0,"hub-project-list")},dependencies:[yh],encapsulation:2})}};var _H=(t,n)=>["/projects",t,"chats",n],vH=(t,n)=>n.id;function bH(t,n){if(t&1&&(m(0,"mat-card",13)(1,"a",14)(2,"div",15)(3,"span",16),g(4),f(),m(5,"span",17),g(6),f()(),m(7,"mat-card-title"),g(8),f()()()),t&2){let e=n.$implicit,i=b(2);p(),M("routerLink",Yl(9,_H,i.id,e.id)),j("aria-label","Open chat "+(e.title||"Untitled chat")),p(3),k(e.agent),p(),N("running",e.process_state==="RUNNING")("dead",e.process_state==="DEAD"),p(),k(e.process_state||"STOPPED"),p(2),k(e.title||"Untitled chat")}}function yH(t,n){if(t&1&&(m(0,"div",11),nt(1,bH,9,12,"mat-card",13,vH),f()),t&2){let e=b(2);p(),it(e.chats())}}function CH(t,n){if(t&1){let e=se();m(0,"mat-card",12)(1,"mat-icon"),g(2,"forum"),f(),m(3,"h2"),g(4,"No chats in this project yet"),f(),m(5,"p"),g(6,"Start a new chat with an ACP agent."),f(),m(7,"button",6),w("click",function(){W(e);let r=b(),o=b();return G(o.newChat(r.id))}),m(8,"mat-icon"),g(9,"add_comment"),f(),g(10," New chat"),f()()}}function wH(t,n){if(t&1){let e=se();m(0,"section",1)(1,"div",3)(2,"div")(3,"p",4),g(4,"Project"),f(),m(5,"h1"),g(6),f(),m(7,"code"),g(8),f()(),m(9,"div",5)(10,"button",6),w("click",function(){let r=W(e),o=b();return G(o.newChat(r.id))}),m(11,"mat-icon"),g(12,"add_comment"),f(),g(13," New chat"),f(),m(14,"button",7)(15,"mat-icon"),g(16,"more_vert"),f()(),m(17,"mat-menu",null,0)(19,"button",8),w("click",function(){let r=W(e),o=b();return G(o.edit(r))}),m(20,"mat-icon"),g(21,"edit"),f(),m(22,"span"),g(23,"Edit project"),f()(),m(24,"button",8),w("click",function(){let r=W(e),o=b();return G(o.remove(r))}),m(25,"mat-icon",9),g(26,"delete"),f(),m(27,"span"),g(28,"Delete project"),f()()()()(),m(29,"div",10)(30,"h2"),g(31,"Chats in this project"),f(),m(32,"span"),g(33),f()(),D(34,yH,3,0,"div",11)(35,CH,11,0,"mat-card",12),f()}if(t&2){let e=n,i=rt(18),r=b();p(6),k(e.name),p(2),k(e.path),p(6),M("matMenuTriggerFor",i),p(19),ut("",r.chats().length," chats"),p(),E(r.chats().length?34:35)}}function SH(t,n){t&1&&(m(0,"section",2)(1,"mat-icon"),g(2,"folder_off"),f(),m(3,"h1"),g(4,"Project not found"),f(),m(5,"p"),g(6,"This project may have been deleted or the URL is malformed."),f(),m(7,"a",18),g(8,"Back to projects"),f()())}var wh=class t{constructor(){this.route=c(En);this.state=c(Le);this.dialog=c(Ai);this.projectId=Zm(this.route.paramMap.pipe(ee(n=>n.get("projectId")??"")),{initialValue:this.route.snapshot.paramMap.get("projectId")??""});this.project=ke(()=>this.state.projects().find(n=>n.id===this.projectId())??null);this.chats=ke(()=>this.state.chatsByProject()[this.projectId()]??[]);Lt(()=>{let n=this.projectId();n&&this.state.loadChats(n)})}newChat(n){this.dialog.open(Ls,{width:"min(560px, calc(100vw - 32px))",data:{projectId:n}})}edit(n){this.dialog.open(Gs,{width:"min(640px, calc(100vw - 32px))",data:n})}remove(n){this.dialog.open(Ws,{width:"min(520px, calc(100vw - 32px))",data:n})}static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275cmp=x({type:t,selectors:[["hub-project-page"]],decls:2,vars:1,consts:[["projectActions","matMenu"],[1,"project-page"],[1,"missing"],[1,"hero"],[1,"eyebrow"],[1,"hero-actions"],["mat-flat-button","","color","primary","type","button",3,"click"],["mat-icon-button","","aria-label","Project actions",3,"matMenuTriggerFor"],["mat-menu-item","","type","button",3,"click"],["color","warn"],[1,"section-title"],[1,"chat-grid"],[1,"empty-chat"],[1,"chat-card"],[3,"routerLink"],[1,"chat-top"],[1,"agent-badge"],[1,"process-state"],["mat-flat-button","","color","primary","routerLink","/"]],template:function(e,i){if(e&1&&D(0,wH,36,5,"section",1)(1,SH,9,0,"section",2),e&2){let r;E((r=i.project())?0:1,r)}},dependencies:[Pe,ot,Mn,$n,Ri,Qr,Tt,Fe,We,$s,Fi,mr,zs,Ni],styles:["[_nghost-%COMP%]{display:block;height:100%;overflow:auto}.project-page[_ngcontent-%COMP%]{max-width:1120px;margin:0 auto;padding:40px 32px 72px}.hero[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:32px;margin-bottom:36px;border-radius:28px;background:linear-gradient(120deg,var(--%NS%mat-sys-surface-container-low),var(--%NS%mat-sys-primary-container))}.eyebrow[_ngcontent-%COMP%]{margin:0 0 6px;color:var(--%NS%mat-sys-primary);font-size:.8rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}h1[_ngcontent-%COMP%]{margin:0 0 8px;font-size:clamp(1.8rem,4vw,3rem)}code[_ngcontent-%COMP%]{overflow-wrap:anywhere;color:var(--%NS%mat-sys-on-surface-variant)}.hero-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}.section-title[_ngcontent-%COMP%]{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:16px}.section-title[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0;font-size:1.5rem}.section-title[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.chat-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}.chat-card[_ngcontent-%COMP%]{transition:transform .16s ease,box-shadow .16s ease}.chat-card[_ngcontent-%COMP%]:hover{transform:translateY(-2px);box-shadow:var(--%NS%mat-sys-level2)}.chat-card[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:block;padding:20px;color:inherit;text-decoration:none}.chat-top[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:26px}.agent-badge[_ngcontent-%COMP%]{padding:5px 10px;border-radius:999px;background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);font-size:.8rem}.process-state[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font-size:.75rem}.process-state.running[_ngcontent-%COMP%]{color:var(--%NS%hub-status-running)}.process-state.dead[_ngcontent-%COMP%]{color:var(--%NS%hub-status-dead)}.empty-chat[_ngcontent-%COMP%], .missing[_ngcontent-%COMP%]{display:grid;justify-items:center;gap:12px;padding:56px 24px;text-align:center}.empty-chat[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .missing[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:48px;height:48px;font-size:48px;color:var(--%NS%mat-sys-primary)}.empty-chat[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .empty-chat[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .missing[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .missing[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0}.empty-chat[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .missing[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}@media(max-width:599px){.project-page[_ngcontent-%COMP%]{padding:24px 16px 56px}.hero[_ngcontent-%COMP%]{align-items:stretch;flex-direction:column;padding:24px}.hero-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:first-child{flex:1}.section-title[_ngcontent-%COMP%]{align-items:flex-start;flex-direction:column;gap:4px}.chat-grid[_ngcontent-%COMP%]{grid-template-columns:1fr}}"]})}};var VM=[{path:"",component:Ch,title:"Agent Hub"},{path:"projects/:projectId",component:wh,title:"Project | Agent Hub"},{path:"projects/:projectId/chats/:chatId",component:bh,title:"Chat | Agent Hub"},{path:"**",redirectTo:""}];U_(ih,{providers:[Y_(),xv(VM)]}).catch(t=>console.error(t));
