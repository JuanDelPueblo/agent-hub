import{$ as Mi,$n as lR,$r as wu,$t as _t$1,A as HJ,An as fne,Ar as se$3,At as Toe,B as Jn,Bn as i0,Br as uc,Bt as Wre,C as Fn,Cn as ex,Cr as rR,D as Gre,Dn as fe$2,Dr as ry,Dt as T,E as Gr,En as fc,Er as rt,Et as Ste,F as Ir,Fn as gP,Fr as st,Ft as V,G as Le$1,Gn as jt$1,Gr as ve$3,H as Ke$1,Hn as it,Hr as un,I as It$1,In as gc,Ir as tF,It as VE,J as Lk,Jn as ke$3,Jr as w,Jt as Zn,K as Lg,Kn as ju,Kr as vr,Kt as Yi,L as Iu,Ln as ge$4,Lr as te$2,Lt as Vs,M as I,Mn as ft$1,Mr as sj,Mt as UP,N as IP,Nn as g,Nr as sn$1,Nt as Ug,O as H,Ot as Td,P as If,Pn as gE,Pr as ss,Pt as Ur,Q as Me$2,Qn as kv,Qr as wte,R as J,Rn as gr,Rr as u,S as Fe$2,Sn as ev,Sr as r0,St as SA,T as Gg,Tn as fT,Tr as rre,Tt as St,U as Ku,Un as jg,Ur as une,Ut as X5,V as Ju,Vn as ie$2,Vr as ue$2,Vt as X$1,Wn as jn,Wr as ut$1,Wt as Xt$1,X as M,Xn as koe,Xr as we$1,Y as Ls,Yn as ko,Yr as wA,Yt as _,Zn as kp,Zt as _P,_ as EX,_n as dt,_r as pc,_t as Rg,a as Be$1,ai as xg,an as as,ar as mT,at as OD,b as Ene,bn as ee$2,br as qe$1,c as C,ci as yt$1,ct as Ot,d as Ct,dr as oj,dt as Pn,ei as ww,en as _v,er as le$4,et as Mu,f as Cu,fr as ooe,ft as Q,g as Dne,gn as dne,gr as p,gt as Re$1,h as Dd,hn as dn$1,hr as ov,ht as R1,i as Aoe,ii as xe$3,in as aj,ir as lv,it as O0,jn as fs,jr as si$1,jt as U,k as HE,kn as fk,kr as sR,kt as Te$1,l as CX,li as yv,ln as b,lr as oe$3,lt as Ov,mr as ot,mt as Qe$1,n as $X,ni as xF,nn as ae$3,nr as lne,o as Bf,oi as xr,on as at,or as mn$1,ot as Oo,p as D$1,pn as bv,pr as os,pt as Q1,q as Li,qr as vv,qt as Yt$2,r as $r,ri as xd,rn as ai$1,rr as ls,rt as Nt,si as xt$1,sn as av,sr as n0,st as Op,t as $,ti as x,tn as ac,tr as lj,tt as N$2,ui as z,un as bA,ut as Pe,v as Ef,vr as qF,vt as Roe,w as Ge$1,wn as fQ,wr as re$3,x as F$1,xn as et,xr as qr,y as Ei,yn as eE,yr as qX,yt as Rp,z as Je$2,zn as gv,zt as WX}from"./chunk-U6N0htvI.js";function le$3(n,r){n&1&&It$1(0,`div`,2)}var ce$3=new g(`MAT_PROGRESS_BAR_DEFAULT_OPTIONS`);var ie$1=(()=>{class n{_elementRef=u(N$2);_ngZone=u(I);_changeDetectorRef=u(Qe$1);_renderer=u(ge$4);_cleanupTransitionEnd;constructor(){let e=Gg(),t=u(ce$3,{optional:!0});this._isNoopAnimation=e===`di-disabled`,e===`reduced-motion`&&this._elementRef.nativeElement.classList.add(`mat-progress-bar-reduced-motion`),t&&(t.color&&(this.color=this._defaultColor=t.color),this.mode=t.mode||this.mode)}_isNoopAnimation;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor=`primary`;get value(){return this._value}set value(e){this._value=te$1(e||0),this._changeDetectorRef.markForCheck()}_value=0;get bufferValue(){return this._bufferValue||0}set bufferValue(e){this._bufferValue=te$1(e||0),this._changeDetectorRef.markForCheck()}_bufferValue=0;animationEnd=new z;get mode(){return this._mode}set mode(e){this._mode=e,this._changeDetectorRef.markForCheck()}_mode=`determinate`;ngAfterViewInit(){this._ngZone.runOutsideAngular(()=>{this._cleanupTransitionEnd=this._renderer.listen(this._elementRef.nativeElement,`transitionend`,this._transitionendHandler)})}ngOnDestroy(){this._cleanupTransitionEnd?.()}_getPrimaryBarTransform(){return`scaleX(${this._isIndeterminate()?1:this.value/100})`}_getBufferBarFlexBasis(){return`${this.mode===`buffer`?this.bufferValue:100}%`}_isIndeterminate(){return this.mode===`indeterminate`||this.mode===`query`}_transitionendHandler=e=>{this.animationEnd.observers.length===0||!e.target||!e.target.classList.contains(`mdc-linear-progress__primary-bar`)||(this.mode===`determinate`||this.mode===`buffer`)&&this._ngZone.run(()=>this.animationEnd.next({value:this.value}))};static ɵfac=function(t){return new(t||n)};static ɵcmp=X$1({type:n,selectors:[[`mat-progress-bar`]],hostAttrs:[`role`,`progressbar`,`aria-valuemin`,`0`,`aria-valuemax`,`100`,`tabindex`,`-1`,1,`mat-mdc-progress-bar`,`mdc-linear-progress`],hostVars:10,hostBindings:function(t,i){t&2&&(ie$2(`aria-valuenow`,i._isIndeterminate()?null:i.value)(`mode`,i.mode),Jn(`mat-`+i.color),J(`_mat-animation-noopable`,i._isNoopAnimation)(`mdc-linear-progress--animation-ready`,!i._isNoopAnimation)(`mdc-linear-progress--indeterminate`,i._isIndeterminate()))},inputs:{color:`color`,value:[2,`value`,`value`,Oo],bufferValue:[2,`bufferValue`,`bufferValue`,Oo],mode:`mode`},outputs:{animationEnd:`animationEnd`},exportAs:[`matProgressBar`],decls:7,vars:5,consts:[[`aria-hidden`,`true`,1,`mdc-linear-progress__buffer`],[1,`mdc-linear-progress__buffer-bar`],[1,`mdc-linear-progress__buffer-dots`],[`aria-hidden`,`true`,1,`mdc-linear-progress__bar`,`mdc-linear-progress__primary-bar`],[1,`mdc-linear-progress__bar-inner`],[`aria-hidden`,`true`,1,`mdc-linear-progress__bar`,`mdc-linear-progress__secondary-bar`]],template:function(t,i){t&1&&(ft$1(0,`div`,0),It$1(1,`div`,1),Me$2(2,le$3,1,0,`div`,2),_t$1(),ft$1(3,`div`,3),It$1(4,`span`,4),_t$1(),ft$1(5,`div`,5),It$1(6,`span`,4),_t$1()),t&2&&(le$4(),Ir(`flex-basis`,i._getBufferBarFlexBasis()),le$4(),Te$1(i.mode===`buffer`?2:-1),le$4(),Ir(`transform`,i._getPrimaryBarTransform()))},styles:[`.mat-mdc-progress-bar {
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
`],encapsulation:2})}return n})();function te$1(n,r=0,e=100){return Math.max(r,Math.min(e,n))}var ae$2=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[we$1]})}return n})();var oe$2=(n,r)=>r.path;function pe$1(n,r){if(n&1&&(ue$2(0,`div`,1),kp(1),ve$3()),n&2){let e=Ke$1();le$4(),Td(e.error())}}function ue$1(n,r){if(n&1){let e=Rp();ue$2(0,`button`,12),Fe$2(`click`,function(){gr(e);let i=Ke$1();return vr(Ke$1().browseTo(i.parent))}),ue$2(1,`mat-icon`),kp(2,`arrow_upward`),ve$3()()}}function ge$3(n,r){n&1&&(ue$2(0,`span`,14),kp(1,`/`),ve$3())}function fe$1(n,r){if(n&1){let e=Rp();ue$2(0,`button`,13),Fe$2(`click`,function(){let i=gr(e).$implicit;return vr(Ke$1(2).browseTo(i.path))}),kp(1),ve$3(),Me$2(2,ge$3,2,0,`span`,14)}if(n&2){let e=r.$implicit,t=r.$index,i=r.$count;le$4(),Td(e.name),le$4(),Te$1(t!==i-1?2:-1)}}function _e$1(n,r){n&1&&rt(0,`mat-progress-bar`,6)}function be$1(n,r){if(n&1){let e=Rp();ue$2(0,`button`,15),Fe$2(`click`,function(){let i=gr(e).$implicit;return vr(Ke$1(2).browseTo(i.path))}),ue$2(1,`mat-icon`,16),kp(2,`folder`),ve$3(),ue$2(3,`span`,17),kp(4),ve$3(),ue$2(5,`mat-icon`,18),kp(6,`chevron_right`),ve$3()()}if(n&2){let e=r.$implicit;le$4(4),Td(e.name)}}function ye$1(n,r){n&1&&(ue$2(0,`p`,19),kp(1,`No subdirectories found`),ve$3())}function he$1(n,r){if(n&1&&Me$2(0,ye$1,2,0,`p`,19),n&2)Te$1(Ke$1(2).loading()?-1:0)}function ve$2(n,r){if(n&1){let e=Rp();ue$2(0,`nav`,3),Me$2(1,ue$1,3,0,`button`,4),SA(2,fe$1,3,2,null,null,oe$2),ve$3(),ue$2(4,`div`,5),Me$2(5,_e$1,1,0,`mat-progress-bar`,6),ue$2(6,`mat-action-list`,7),SA(7,be$1,7,1,`button`,8,oe$2,!1,he$1,1,1),ve$3()(),ue$2(10,`div`,9)(11,`span`,10),kp(12),ve$3(),ue$2(13,`button`,11),Fe$2(`click`,function(){gr(e);return vr(Ke$1().selectCurrent())}),ue$2(14,`mat-icon`),kp(15,`check`),ve$3(),kp(16,` Select current folder `),ve$3()()}if(n&2){let e=r,t=Ke$1();le$4(),Te$1(e.parent?1:-1),le$4(),wA(e.breadcrumbs),le$4(3),Te$1(t.loading()?5:-1),le$4(2),wA(e.directories),le$4(4),yt$1(`title`,e.current),le$4(),Td(e.current)}}function Ce$2(n,r){n&1&&(ue$2(0,`div`,2),rt(1,`mat-progress-bar`,6),ve$3())}var se$2=class n{constructor(){this.initialPath=Mi(``);this.folderBrowsed=X5();this.folderSelected=X5();this.listing=C(null);this.loading=C(!1);this.error=C(``);this.api=u(as);this.loadedPath=``;this.loadSequence=0;this.initialized=!1;dt(()=>{let r=this.initialPath();this.initialized?r&&this.browseTo(r):(this.initialized=!0,this.loadDirectory(r||void 0))})}browseTo(r){!r||r===this.loadedPath||this.loadDirectory(r)}async loadDirectory(r){let e=++this.loadSequence;this.loadedPath=r||``,this.loading.set(!0),this.error.set(``);try{let t=await this.api.fetchDirectories(r);if(e!==this.loadSequence)return;this.listing.set(t),this.loadedPath=t.current,this.folderBrowsed.emit({path:t.current,name:t.name})}catch(t){if(e!==this.loadSequence)return;this.loadedPath=this.listing()?.current??``,this.error.set(t instanceof Error?t.message:`Failed to load directories`)}finally{e===this.loadSequence&&this.loading.set(!1)}}selectCurrent(){let r=this.listing();r&&this.folderSelected.emit({path:r.current,name:r.name})}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X$1({type:n,selectors:[[`hub-folder-picker`]],inputs:{initialPath:[1,`initialPath`]},outputs:{folderBrowsed:`folderBrowsed`,folderSelected:`folderSelected`},decls:4,vars:2,consts:[[1,`picker`],[`role`,`alert`,1,`error-box`],[1,`loading`],[`aria-label`,`Directory path`,1,`breadcrumbs`],[`mat-button`,``,`type`,`button`,`aria-label`,`Go to parent directory`],[1,`directory-list`],[`mode`,`indeterminate`,`aria-label`,`Loading directories`],[`aria-label`,`Subdirectories`],[`mat-list-item`,``,`type`,`button`],[1,`picker-actions`],[1,`current-path`,3,`title`],[`mat-flat-button`,``,`type`,`button`,3,`click`],[`mat-button`,``,`type`,`button`,`aria-label`,`Go to parent directory`,3,`click`],[`mat-button`,``,`type`,`button`,1,`crumb`,3,`click`],[`aria-hidden`,`true`],[`mat-list-item`,``,`type`,`button`,3,`click`],[`matListItemIcon`,``],[`matListItemTitle`,``],[`matListItemMeta`,``],[1,`empty`]],template:function(e,t){if(e&1&&(ue$2(0,`div`,0),Me$2(1,pe$1,2,1,`div`,1),Me$2(2,ve$2,17,5)(3,Ce$2,2,0,`div`,2),ve$3()),e&2){let i;le$4(),Te$1(t.error()?1:-1),le$4(),Te$1((i=t.listing())?2:t.loading()?3:-1,i)}},dependencies:[EX,CX,WX,$X,koe,Toe,Aoe,lj,oj,aj,ae$2,ie$1],styles:[`[_nghost-%COMP%]{display:block}.picker[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:12px}.breadcrumbs[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap;gap:2px;padding:4px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-surface-container-low);color:var(--%NS%mat-sys-on-surface-variant)}.breadcrumbs[_ngcontent-%COMP%]   .crumb[_ngcontent-%COMP%]{--%NS%mat-button-text-label-text-color: var(--%NS%mat-sys-on-surface);min-width:0;padding-inline:7px}.breadcrumbs[_ngcontent-%COMP%]   .crumb[_ngcontent-%COMP%]:last-of-type{--%NS%mat-button-text-label-text-color: var(--%NS%mat-sys-primary)}.directory-list[_ngcontent-%COMP%]{min-height:170px;max-height:250px;overflow:auto;border:1px solid var(--%NS%mat-sys-outline-variant);border-radius:var(--%NS%mat-sys-corner-medium)}.directory-list[_ngcontent-%COMP%]   mat-progress-bar[_ngcontent-%COMP%]{position:sticky;top:0;z-index:1}.directory-list[_ngcontent-%COMP%]   mat-action-list[_ngcontent-%COMP%]{padding:4px}.directory-list[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{border-radius:var(--%NS%mat-sys-corner-medium)}.directory-list[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[matListItemIcon][_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.directory-list[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[matListItemMeta][_ngcontent-%COMP%]{width:20px;height:20px;font-size:20px;font-family:Material Symbols Outlined;color:var(--%NS%mat-sys-on-surface-variant)}.empty[_ngcontent-%COMP%]{padding:32px 16px;margin:0;color:var(--%NS%mat-sys-on-surface-variant);text-align:center}.loading[_ngcontent-%COMP%]{min-height:170px;display:grid;align-content:center}.picker-actions[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:12px}.current-path[_ngcontent-%COMP%]{min-width:0;overflow:hidden;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-medium);text-overflow:ellipsis;white-space:nowrap}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){.picker-actions[_ngcontent-%COMP%]{align-items:stretch;flex-direction:column}.current-path[_ngcontent-%COMP%]{white-space:normal;overflow-wrap:anywhere}}`]})}};var vt=[`*`];function Ne$1(a,o){a&1&&ee$2(0)}var Me$1=[`tabListContainer`];var Be=[`tabList`];var Re=[`tabListInner`];var Ee$1=[`nextPaginator`];var Le=[`previousPaginator`];var Ae=[`content`];function Fe$1(a,o){}var je=[`tabBodyWrapper`];var He=[`tabHeader`];function Oe(a,o){}function ze(a,o){if(a&1&&Ot(0,Oe,0,0,`ng-template`,12),a&2){let t=Ke$1().$implicit;yt$1(`cdkPortalOutlet`,t.templateLabel)}}function Qe(a,o){if(a&1&&kp(0),a&2){let t=Ke$1().$implicit;Td(t.textLabel)}}function Ve(a,o){if(a&1){let t=Rp();ue$2(0,`div`,7,2),Fe$2(`click`,function(){let n=gr(t),i=n.$implicit,d=n.$index,w=Ke$1(),D=xr(1);return vr(w._handleClick(i,D,d))})(`cdkFocusChange`,function(n){let i=gr(t).$index;return vr(Ke$1()._tabFocusChanged(n,i))}),rt(2,`span`,8)(3,`div`,9),ue$2(4,`span`,10)(5,`span`,11),Me$2(6,ze,1,1,null,12)(7,Qe,1,1),ve$3()()()}if(a&2){let t=o.$implicit,e=o.$index,n=xr(1),i=Ke$1();Jn(t.labelClass),J(`mdc-tab--active`,i.selectedIndex===e),yt$1(`id`,i._getTabLabelId(t,e))(`disabled`,t.disabled)(`fitInkBarToContent`,i.fitInkBarToContent),ie$2(`tabIndex`,i._getTabIndex(e))(`aria-posinset`,e+1)(`aria-setsize`,i._tabs.length)(`aria-controls`,i._getTabContentId(e))(`aria-selected`,i.selectedIndex===e)(`aria-label`,t.ariaLabel||null)(`aria-labelledby`,!t.ariaLabel&&t.ariaLabelledby?t.ariaLabelledby:null),le$4(3),yt$1(`matRippleTrigger`,n)(`matRippleDisabled`,t.disabled||i.disableRipple),le$4(3),Te$1(t.templateLabel?6:7)}}function We(a,o){a&1&&ee$2(0)}function Ge(a,o){if(a&1){let t=Rp();ue$2(0,`mat-tab-body`,13),Fe$2(`_onCentered`,function(){gr(t);return vr(Ke$1()._removeTabBodyWrapperHeight())})(`_onCentering`,function(n){gr(t);return vr(Ke$1()._setTabBodyWrapperHeight(n))})(`_beforeCentering`,function(n){gr(t);return vr(Ke$1()._bodyCentered(n))}),ve$3()}if(a&2){let t=o.$implicit,e=o.$index,n=Ke$1();Jn(t.bodyClass),yt$1(`id`,n._getTabContentId(e))(`content`,t.content)(`position`,t.position)(`animationDuration`,n._bodyAnimationDuration)(`preserveContent`,n.preserveContent),ie$2(`tabindex`,n.contentTabIndex!=null&&n.selectedIndex===e?n.contentTabIndex:null)(`aria-labelledby`,n._getTabLabelId(t,e))(`aria-hidden`,n.selectedIndex!==e)}}var $e$1=new g(`MatTabContent`);var qe=(()=>{class a{template=u(ut$1);static ɵfac=function(e){return new(e||a)};static ɵdir=D$1({type:a,selectors:[[``,`matTabContent`,``]],features:[Le$1([{provide:$e$1,useExisting:a}])]})}return a})();var Ze=new g(`MatTabLabel`);var Ce$1=new g(`MAT_TAB`);var Ue=(()=>{class a extends HJ{_closestTab=u(Ce$1,{optional:!0});static ɵfac=(()=>{let t;return function(n){return(t||(t=Pe(a)))(n||a)}})();static ɵdir=D$1({type:a,selectors:[[``,`mat-tab-label`,``],[``,`matTabLabel`,``]],features:[Le$1([{provide:Ze,useExisting:a}]),ae$3]})}return a})();var ke$2=new g(`MAT_TAB_GROUP`);var yt=(()=>{class a{_viewContainerRef=u(it);_closestTabGroup=u(ke$2,{optional:!0});disabled=!1;get templateLabel(){return this._templateLabel}set templateLabel(t){this._setTemplateLabelInput(t)}_templateLabel;_explicitContent=void 0;_implicitContent;textLabel=``;ariaLabel;ariaLabelledby;labelClass;bodyClass;id=null;_contentPortal=null;get content(){return this._contentPortal}_stateChanges=new w;position=null;origin=null;isActive=!1;constructor(){u(qe$1).load(os)}ngOnChanges(t){(t.hasOwnProperty(`textLabel`)||t.hasOwnProperty(`disabled`))&&this._stateChanges.next()}ngOnDestroy(){this._stateChanges.complete()}ngOnInit(){this._contentPortal=new mn$1(this._explicitContent||this._implicitContent,this._viewContainerRef)}_setTemplateLabelInput(t){t&&t._closestTab===this&&(this._templateLabel=t)}static ɵfac=function(e){return new(e||a)};static ɵcmp=X$1({type:a,selectors:[[`mat-tab`]],contentQueries:function(e,n,i){if(e&1&&un(i,Ue,5)(i,qe,7,ut$1),e&2){let d;oe$3(d=se$3())&&(n.templateLabel=d.first),oe$3(d=se$3())&&(n._explicitContent=d.first)}},viewQuery:function(e,n){if(e&1&&Nt(ut$1,7),e&2){let i;oe$3(i=se$3())&&(n._implicitContent=i.first)}},hostAttrs:[`hidden`,``],hostVars:1,hostBindings:function(e,n){e&2&&ie$2(`id`,null)},inputs:{disabled:[2,`disabled`,`disabled`,te$2],textLabel:[0,`label`,`textLabel`],ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],labelClass:`labelClass`,bodyClass:`bodyClass`,id:`id`},exportAs:[`matTab`],features:[Le$1([{provide:Ce$1,useExisting:a}]),Be$1],ngContentSelectors:vt,decls:1,vars:0,template:function(e,n){e&1&&(Ge$1(),Dd(0,Ne$1,1,0,`ng-template`))},encapsulation:2,changeDetection:1})}return a})();var ht=`mdc-tab-indicator--active`;var ge$2=`mdc-tab-indicator--no-transition`;var ut=class{_items;_currentItem;constructor(o){this._items=o}hide(){this._items.forEach(o=>o.deactivateInkBar()),this._currentItem=void 0}alignToElement(o){let t=this._items.find(n=>n.elementRef.nativeElement===o),e=this._currentItem;if(t!==e&&(e?.deactivateInkBar(),t)){let n=e?.elementRef.nativeElement.getBoundingClientRect?.();t.activateInkBar(n),this._currentItem=t}}};var Ke=(()=>{class a{_elementRef=u(N$2);_inkBarElement=null;_inkBarContentElement=null;_fitToContent=!1;get fitInkBarToContent(){return this._fitToContent}set fitInkBarToContent(t){this._fitToContent!==t&&(this._fitToContent=t,this._inkBarElement&&this._appendInkBarElement())}activateInkBar(t){let e=this._elementRef.nativeElement;if(!t||!e.getBoundingClientRect||!this._inkBarContentElement){e.classList.add(ht);return}let n=e.getBoundingClientRect(),i=t.width/n.width,d=t.left-n.left;e.classList.add(ge$2),this._inkBarContentElement.style.setProperty(`transform`,`translateX(${d}px) scaleX(${i})`),e.getBoundingClientRect(),e.classList.remove(ge$2),e.classList.add(ht),this._inkBarContentElement.style.setProperty(`transform`,``)}deactivateInkBar(){this._elementRef.nativeElement.classList.remove(ht)}ngOnInit(){this._createInkBarElement()}ngOnDestroy(){this._inkBarElement?.remove(),this._inkBarElement=this._inkBarContentElement=null}_createInkBarElement(){let t=this._elementRef.nativeElement.ownerDocument||document,e=this._inkBarElement=t.createElement(`span`),n=this._inkBarContentElement=t.createElement(`span`);e.className=`mdc-tab-indicator`,n.className=`mdc-tab-indicator__content mdc-tab-indicator__content--underline`,e.appendChild(this._inkBarContentElement),this._appendInkBarElement()}_appendInkBarElement(){this._inkBarElement;(this._fitToContent?this._elementRef.nativeElement.querySelector(`.mdc-tab__content`):this._elementRef.nativeElement).appendChild(this._inkBarElement)}static ɵfac=function(e){return new(e||a)};static ɵdir=D$1({type:a,inputs:{fitInkBarToContent:[2,`fitInkBarToContent`,`fitInkBarToContent`,te$2]}})}return a})();var xe$2=(()=>{class a extends Ke{elementRef=u(N$2);disabled=!1;focus(){this.elementRef.nativeElement.focus()}getOffsetLeft(){return this.elementRef.nativeElement.offsetLeft}getOffsetWidth(){return this.elementRef.nativeElement.offsetWidth}static ɵfac=(()=>{let t;return function(n){return(t||(t=Pe(a)))(n||a)}})();static ɵdir=D$1({type:a,selectors:[[``,`matTabLabelWrapper`,``]],hostVars:3,hostBindings:function(e,n){e&2&&(ie$2(`aria-disabled`,!!n.disabled),J(`mat-mdc-tab-disabled`,n.disabled))},inputs:{disabled:[2,`disabled`,`disabled`,te$2]},features:[ae$3]})}return a})();var ve$1={passive:!0};var Ye=650;var Xe=100;function _t(a){let o=a+``;return/^[0-9]+(?:\.[0-9]+)?$/.test(o)?`${a}ms`:/^[0-9]+(?:\.[0-9]+)?(?:ms|s)$/.test(o)?o:``}var Je$1=(()=>{class a{_elementRef=u(N$2);_changeDetectorRef=u(Qe$1);_viewportRuler=u($r);_dir=u(jt$1,{optional:!0});_ngZone=u(I);_platform=u(fe$2);_sharedResizeObserver=u(HE);_injector=u(T);_renderer=u(ge$4);_animationsDisabled=Je$2();_eventCleanups;_scrollDistance=0;_selectedIndexChanged=!1;_destroyed=new w;_showPaginationControls=!1;_disableScrollAfter=!0;_disableScrollBefore=!0;_tabLabelCount;_scrollDistanceChanged=!1;_keyManager;_currentTextContent;_stopScrolling=new w;disablePagination=!1;get selectedIndex(){return this._selectedIndex}set selectedIndex(t){let e=isNaN(t)?0:t;this._selectedIndex!=e&&(this._selectedIndexChanged=!0,this._selectedIndex=e,this._keyManager&&this._keyManager.updateActiveItem(e))}_selectedIndex=0;selectFocusedIndex=new z;indexFocused=new z;constructor(){this._eventCleanups=this._ngZone.runOutsideAngular(()=>[this._renderer.listen(this._elementRef.nativeElement,`mouseleave`,()=>this._stopInterval())])}ngAfterViewInit(){this._eventCleanups.push(this._renderer.listen(this._previousPaginator.nativeElement,`touchstart`,()=>this._handlePaginatorPress(`before`),ve$1),this._renderer.listen(this._nextPaginator.nativeElement,`touchstart`,()=>this._handlePaginatorPress(`after`),ve$1))}ngAfterContentInit(){let t=this._dir?this._dir.change:F$1(`ltr`),e=this._sharedResizeObserver.observe(this._elementRef.nativeElement).pipe(Yi(32),at(this._destroyed)),n=this._viewportRuler.change(150).pipe(at(this._destroyed)),i=()=>{this.updatePagination(),this._alignInkBarToSelectedTab()};this._keyManager=new ac(this._items).withHorizontalOrientation(this._getLayoutDirection()).withHomeAndEnd().withWrap().skipPredicate(()=>!1),this._keyManager.updateActiveItem(Math.max(this._selectedIndex,0)),xt$1(i,{injector:this._injector}),Xt$1(t,n,e,this._items.changes,this._itemsResized()).pipe(at(this._destroyed)).subscribe(()=>{this._ngZone.run(()=>{Promise.resolve().then(()=>{this._scrollDistance=Math.max(0,Math.min(this._getMaxScrollDistance(),this._scrollDistance)),i()})}),this._keyManager?.withHorizontalOrientation(this._getLayoutDirection())}),this._keyManager.change.subscribe(d=>{this.indexFocused.emit(d),this._setTabFocus(d)})}_itemsResized(){return typeof ResizeObserver!=`function`?Re$1:this._items.changes.pipe(st(this._items),et(t=>new V(e=>this._ngZone.runOutsideAngular(()=>{let n=new ResizeObserver(i=>e.next(i));return t.forEach(i=>n.observe(i.elementRef.nativeElement)),()=>{n.disconnect()}}))),Vs(1),re$3(t=>t.some(e=>e.contentRect.width>0&&e.contentRect.height>0)))}ngAfterContentChecked(){this._tabLabelCount!=this._items.length&&(this.updatePagination(),this._tabLabelCount=this._items.length,this._changeDetectorRef.markForCheck()),this._selectedIndexChanged&&(this._scrollToLabel(this._selectedIndex),this._checkScrollingControls(),this._alignInkBarToSelectedTab(),this._selectedIndexChanged=!1,this._changeDetectorRef.markForCheck()),this._scrollDistanceChanged&&(this._updateTabScrollPosition(),this._scrollDistanceChanged=!1,this._changeDetectorRef.markForCheck())}ngOnDestroy(){this._eventCleanups.forEach(t=>t()),this._keyManager?.destroy(),this._destroyed.next(),this._destroyed.complete(),this._stopScrolling.complete()}_handleKeydown(t){if(!Pn(t))switch(t.keyCode){case 13:case 32:if(this.focusIndex!==this.selectedIndex){let e=this._items.get(this.focusIndex);e&&!e.disabled&&(this.selectFocusedIndex.emit(this.focusIndex),this._itemSelected(t))}break;default:this._keyManager?.onKeydown(t)}}_onContentChanges(){let t=this._elementRef.nativeElement.textContent;t!==this._currentTextContent&&(this._currentTextContent=t||``,this._ngZone.run(()=>{this.updatePagination(),this._alignInkBarToSelectedTab(),this._changeDetectorRef.markForCheck()}))}updatePagination(){this._checkPaginationEnabled(),this._checkScrollingControls(),this._updateTabScrollPosition()}get focusIndex(){return this._keyManager?this._keyManager.activeItemIndex:0}set focusIndex(t){!this._isValidIndex(t)||this.focusIndex===t||!this._keyManager||this._keyManager.setActiveItem(t)}_isValidIndex(t){return this._items?!!this._items.toArray()[t]:!0}_setTabFocus(t){if(this._showPaginationControls&&this._scrollToLabel(t),this._items&&this._items.length){this._items.toArray()[t].focus();let e=this._tabListContainer.nativeElement;this._getLayoutDirection()==`ltr`?e.scrollLeft=0:e.scrollLeft=e.scrollWidth-e.offsetWidth}}_getLayoutDirection(){return this._dir&&this._dir.value===`rtl`?`rtl`:`ltr`}_updateTabScrollPosition(){if(this.disablePagination)return;let t=this.scrollDistance,e=this._getLayoutDirection()===`ltr`?-t:t;this._tabList.nativeElement.style.transform=`translateX(${Math.round(e)}px)`,(this._platform.TRIDENT||this._platform.EDGE)&&(this._tabListContainer.nativeElement.scrollLeft=0)}get scrollDistance(){return this._scrollDistance}set scrollDistance(t){this._scrollTo(t)}_scrollHeader(t){let e=this._tabListContainer.nativeElement.offsetWidth,n=(t==`before`?-1:1)*e/3;return this._scrollTo(this._scrollDistance+n)}_handlePaginatorClick(t){this._stopInterval(),this._scrollHeader(t)}_scrollToLabel(t){if(this.disablePagination)return;let e=this._items?this._items.toArray()[t]:null;if(!e)return;let n=this._tabListContainer.nativeElement.offsetWidth,{offsetLeft:i,offsetWidth:d}=e.elementRef.nativeElement,w,D;this._getLayoutDirection()==`ltr`?(w=i,D=w+d):(D=this._tabListInner.nativeElement.offsetWidth-i,w=D-d);let nt=this.scrollDistance,Ct=this.scrollDistance+n;w<nt?this.scrollDistance-=nt-w:D>Ct&&(this.scrollDistance+=Math.min(D-Ct,w-nt))}_checkPaginationEnabled(){if(this.disablePagination)this._showPaginationControls=!1;else{let n=this._tabListInner.nativeElement.scrollWidth-this._elementRef.nativeElement.offsetWidth>=5;n||(this.scrollDistance=0),n!==this._showPaginationControls&&(this._showPaginationControls=n,this._changeDetectorRef.markForCheck())}}_checkScrollingControls(){this.disablePagination?this._disableScrollAfter=this._disableScrollBefore=!0:(this._disableScrollBefore=this.scrollDistance==0,this._disableScrollAfter=this.scrollDistance==this._getMaxScrollDistance(),this._changeDetectorRef.markForCheck())}_getMaxScrollDistance(){return this._tabListInner.nativeElement.scrollWidth-this._tabListContainer.nativeElement.offsetWidth||0}_alignInkBarToSelectedTab(){let t=this._items&&this._items.length?this._items.toArray()[this.selectedIndex]:null,e=t?t.elementRef.nativeElement:null;e?this._inkBar.alignToElement(e):this._inkBar.hide()}_stopInterval(){this._stopScrolling.next()}_handlePaginatorPress(t,e){e&&e.button!=null&&e.button!==0||(this._stopInterval(),Ls(Ye,Xe).pipe(at(Xt$1(this._stopScrolling,this._destroyed))).subscribe(()=>{let{maxScrollDistance:n,distance:i}=this._scrollHeader(t);(i===0||i>=n)&&this._stopInterval()}))}_scrollTo(t){if(this.disablePagination)return{maxScrollDistance:0,distance:0};let e=this._getMaxScrollDistance();return this._scrollDistance=Math.max(0,Math.min(e,t)),this._scrollDistanceChanged=!0,this._checkScrollingControls(),{maxScrollDistance:e,distance:this._scrollDistance}}static ɵfac=function(e){return new(e||a)};static ɵdir=D$1({type:a,inputs:{disablePagination:[2,`disablePagination`,`disablePagination`,te$2],selectedIndex:[2,`selectedIndex`,`selectedIndex`,Oo]},outputs:{selectFocusedIndex:`selectFocusedIndex`,indexFocused:`indexFocused`}})}return a})();var tn=(()=>{class a extends Je$1{_items;_tabListContainer;_tabList;_tabListInner;_nextPaginator;_previousPaginator;_inkBar;ariaLabel;ariaLabelledby;disableRipple=!1;ngAfterContentInit(){this._inkBar=new ut(this._items),super.ngAfterContentInit()}_itemSelected(t){t.preventDefault()}static ɵfac=(()=>{let t;return function(n){return(t||(t=Pe(a)))(n||a)}})();static ɵcmp=X$1({type:a,selectors:[[`mat-tab-header`]],contentQueries:function(e,n,i){if(e&1&&un(i,xe$2,4),e&2){let d;oe$3(d=se$3())&&(n._items=d)}},viewQuery:function(e,n){if(e&1&&Nt(Me$1,7)(Be,7)(Re,7)(Ee$1,5)(Le,5),e&2){let i;oe$3(i=se$3())&&(n._tabListContainer=i.first),oe$3(i=se$3())&&(n._tabList=i.first),oe$3(i=se$3())&&(n._tabListInner=i.first),oe$3(i=se$3())&&(n._nextPaginator=i.first),oe$3(i=se$3())&&(n._previousPaginator=i.first)}},hostAttrs:[1,`mat-mdc-tab-header`],hostVars:4,hostBindings:function(e,n){e&2&&J(`mat-mdc-tab-header-pagination-controls-enabled`,n._showPaginationControls)(`mat-mdc-tab-header-rtl`,n._getLayoutDirection()==`rtl`)},inputs:{ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],disableRipple:[2,`disableRipple`,`disableRipple`,te$2]},features:[ae$3],ngContentSelectors:vt,decls:13,vars:10,consts:[[`previousPaginator`,``],[`tabListContainer`,``],[`tabList`,``],[`tabListInner`,``],[`nextPaginator`,``],[`mat-ripple`,``,1,`mat-mdc-tab-header-pagination`,`mat-mdc-tab-header-pagination-before`,3,`click`,`mousedown`,`touchend`,`matRippleDisabled`],[1,`mat-mdc-tab-header-pagination-chevron`],[1,`mat-mdc-tab-label-container`,3,`keydown`],[`role`,`tablist`,1,`mat-mdc-tab-list`,3,`cdkObserveContent`],[1,`mat-mdc-tab-labels`],[`mat-ripple`,``,1,`mat-mdc-tab-header-pagination`,`mat-mdc-tab-header-pagination-after`,3,`mousedown`,`click`,`touchend`,`matRippleDisabled`]],template:function(e,n){e&1&&(Ge$1(),ue$2(0,`div`,5,0),Fe$2(`click`,function(){return n._handlePaginatorClick(`before`)})(`mousedown`,function(d){return n._handlePaginatorPress(`before`,d)})(`touchend`,function(){return n._stopInterval()}),rt(2,`div`,6),ve$3(),ue$2(3,`div`,7,1),Fe$2(`keydown`,function(d){return n._handleKeydown(d)}),ue$2(5,`div`,8,2),Fe$2(`cdkObserveContent`,function(){return n._onContentChanges()}),ue$2(7,`div`,9,3),ee$2(9),ve$3()()(),ue$2(10,`div`,10,4),Fe$2(`mousedown`,function(d){return n._handlePaginatorPress(`after`,d)})(`click`,function(){return n._handlePaginatorClick(`after`)})(`touchend`,function(){return n._stopInterval()}),rt(12,`div`,6),ve$3()),e&2&&(J(`mat-mdc-tab-header-pagination-disabled`,n._disableScrollBefore),yt$1(`matRippleDisabled`,n._disableScrollBefore||n.disableRipple),le$4(3),J(`_mat-animation-noopable`,n._animationsDisabled),le$4(2),ie$2(`aria-label`,n.ariaLabel||null)(`aria-labelledby`,n.ariaLabelledby||null),le$4(5),J(`mat-mdc-tab-header-pagination-disabled`,n._disableScrollAfter),yt$1(`matRippleDisabled`,n._disableScrollAfter||n.disableRipple))},dependencies:[eE,OD],styles:[`.mat-mdc-tab-header {
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
`],encapsulation:2,changeDetection:1})}return a})();var en=new g(`MAT_TABS_CONFIG`);var ye=(()=>{class a extends uc{_host=u(ft);_ngZone=u(I);_centeringSub=Q.EMPTY;_leavingSub=Q.EMPTY;ngOnInit(){super.ngOnInit(),this._centeringSub=this._host._beforeCentering.pipe(st(this._host._isCenterPosition())).subscribe(t=>{this._host._content&&t&&!this.hasAttached()&&this._ngZone.run(()=>{Promise.resolve().then(),this.attach(this._host._content)})}),this._leavingSub=this._host._afterLeavingCenter.subscribe(()=>{this._host.preserveContent||this._ngZone.run(()=>this.detach())})}ngOnDestroy(){super.ngOnDestroy(),this._centeringSub.unsubscribe(),this._leavingSub.unsubscribe()}static ɵfac=(()=>{let t;return function(n){return(t||(t=Pe(a)))(n||a)}})();static ɵdir=D$1({type:a,selectors:[[``,`matTabBodyHost`,``]],features:[ae$3]})}return a})();var ft=(()=>{class a{_elementRef=u(N$2);_dir=u(jt$1,{optional:!0});_ngZone=u(I);_injector=u(T);_renderer=u(ge$4);_diAnimationsDisabled=Je$2();_eventCleanups;_initialized=!1;_fallbackTimer;_positionIndex;_dirChangeSubscription=Q.EMPTY;_position;_previousPosition;_onCentering=new z;_beforeCentering=new z;_afterLeavingCenter=new z;_onCentered=new z(!0);_portalHost;_contentElement;_content;animationDuration=`500ms`;preserveContent=!1;set position(t){this._positionIndex=t,this._computePositionAnimationState()}constructor(){if(this._dir){let t=u(Qe$1);this._dirChangeSubscription=this._dir.change.subscribe(e=>{this._computePositionAnimationState(e),t.markForCheck()})}}ngOnInit(){this._bindTransitionEvents(),this._position===`center`&&(this._setActiveClass(!0),xt$1(()=>this._onCentering.emit(this._elementRef.nativeElement.clientHeight),{injector:this._injector})),this._initialized=!0}ngOnDestroy(){clearTimeout(this._fallbackTimer),this._eventCleanups?.forEach(t=>t()),this._dirChangeSubscription.unsubscribe()}_bindTransitionEvents(){this._ngZone.runOutsideAngular(()=>{let t=this._elementRef.nativeElement,e=n=>{n.target===this._contentElement?.nativeElement&&(this._elementRef.nativeElement.classList.remove(`mat-tab-body-animating`),n.type===`transitionend`&&this._transitionDone())};this._eventCleanups=[this._renderer.listen(t,`transitionstart`,n=>{n.target===this._contentElement?.nativeElement&&(this._elementRef.nativeElement.classList.add(`mat-tab-body-animating`),this._transitionStarted())}),this._renderer.listen(t,`transitionend`,e),this._renderer.listen(t,`transitioncancel`,e)]})}_transitionStarted(){clearTimeout(this._fallbackTimer);let t=this._position===`center`;this._beforeCentering.emit(t),t&&this._onCentering.emit(this._elementRef.nativeElement.clientHeight)}_transitionDone(){this._position===`center`?this._onCentered.emit():this._previousPosition===`center`&&this._afterLeavingCenter.emit()}_setActiveClass(t){this._elementRef.nativeElement.classList.toggle(`mat-mdc-tab-body-active`,t)}_getLayoutDirection(){return this._dir&&this._dir.value===`rtl`?`rtl`:`ltr`}_isCenterPosition(){return this._positionIndex===0}_computePositionAnimationState(t=this._getLayoutDirection()){this._previousPosition=this._position,this._positionIndex<0?this._position=t==`ltr`?`left`:`right`:this._positionIndex>0?this._position=t==`ltr`?`right`:`left`:this._position=`center`,this._animationsDisabled()?this._simulateTransitionEvents():this._initialized&&(this._position===`center`||this._previousPosition===`center`)&&(clearTimeout(this._fallbackTimer),this._fallbackTimer=this._ngZone.runOutsideAngular(()=>setTimeout(()=>this._simulateTransitionEvents(),100)))}_simulateTransitionEvents(){this._transitionStarted(),xt$1(()=>this._transitionDone(),{injector:this._injector})}_animationsDisabled(){return this._diAnimationsDisabled||this.animationDuration===`0ms`||this.animationDuration===`0s`}static ɵfac=function(e){return new(e||a)};static ɵcmp=X$1({type:a,selectors:[[`mat-tab-body`]],viewQuery:function(e,n){if(e&1&&Nt(ye,5)(Ae,5),e&2){let i;oe$3(i=se$3())&&(n._portalHost=i.first),oe$3(i=se$3())&&(n._contentElement=i.first)}},hostAttrs:[1,`mat-mdc-tab-body`],hostVars:1,hostBindings:function(e,n){e&2&&ie$2(`inert`,n._position===`center`?null:``)},inputs:{_content:[0,`content`,`_content`],animationDuration:`animationDuration`,preserveContent:`preserveContent`,position:`position`},outputs:{_onCentering:`_onCentering`,_beforeCentering:`_beforeCentering`,_onCentered:`_onCentered`},decls:3,vars:6,consts:[[`content`,``],[`cdkScrollable`,``,1,`mat-mdc-tab-body-content`],[`matTabBodyHost`,``]],template:function(e,n){e&1&&(ue$2(0,`div`,1,0),Ot(2,Fe$1,0,0,`ng-template`,2),ve$3()),e&2&&J(`mat-tab-body-content-left`,n._position===`left`)(`mat-tab-body-content-right`,n._position===`right`)(`mat-tab-body-content-can-animate`,n._position===`center`||n._previousPosition===`center`)},dependencies:[ye,ev],styles:[`.mat-mdc-tab-body {
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
`],encapsulation:2,changeDetection:1})}return a})();var Te=(()=>{class a{_elementRef=u(N$2);_changeDetectorRef=u(Qe$1);_ngZone=u(I);_tabsSubscription=Q.EMPTY;_tabLabelSubscription=Q.EMPTY;_tabBodySubscription=Q.EMPTY;_diAnimationsDisabled=Je$2();_bodyAnimationDuration;_headerAnimationDuration;_allTabs;_tabBodies;_tabBodyWrapper;_tabHeader;_tabs=new Zn;_indexToSelect=0;_lastFocusedTabIndex=null;_tabBodyWrapperHeight=0;color;get fitInkBarToContent(){return this._fitInkBarToContent}set fitInkBarToContent(t){this._fitInkBarToContent=t,this._changeDetectorRef.markForCheck()}_fitInkBarToContent=!1;stretchTabs=!0;alignTabs=null;dynamicHeight=!1;get selectedIndex(){return this._selectedIndex}set selectedIndex(t){this._indexToSelect=isNaN(t)?null:t}_selectedIndex=null;headerPosition=`above`;get animationDuration(){return this._animationDuration}set animationDuration(t){this._animationDuration=t,t&&typeof t==`object`?(this._bodyAnimationDuration=_t(t.body),this._headerAnimationDuration=_t(t.header)):this._headerAnimationDuration=this._bodyAnimationDuration=_t(t)}_animationDuration;get contentTabIndex(){return this._contentTabIndex}set contentTabIndex(t){this._contentTabIndex=isNaN(t)?null:t}_contentTabIndex=null;disablePagination=!1;disableRipple=!1;preserveContent=!1;get backgroundColor(){return this._backgroundColor}set backgroundColor(t){let e=this._elementRef.nativeElement.classList;e.remove(`mat-tabs-with-background`,`mat-background-${this.backgroundColor}`),t&&e.add(`mat-tabs-with-background`,`mat-background-${t}`),this._backgroundColor=t}_backgroundColor;ariaLabel;ariaLabelledby;selectedIndexChange=new z;focusChange=new z;animationDone=new z;selectedTabChange=new z(!0);_groupId;_isServer=!u(fe$2).isBrowser;constructor(){let t=u(en,{optional:!0});this._groupId=u(ot).getId(`mat-tab-group-`),this.animationDuration=t&&t.animationDuration?t.animationDuration:`500ms`,this.disablePagination=t&&t.disablePagination!=null?t.disablePagination:!1,this.dynamicHeight=t&&t.dynamicHeight!=null?t.dynamicHeight:!1,t?.contentTabIndex!=null&&(this.contentTabIndex=t.contentTabIndex),this.preserveContent=!!t?.preserveContent,this.fitInkBarToContent=t&&t.fitInkBarToContent!=null?t.fitInkBarToContent:!1,this.stretchTabs=t&&t.stretchTabs!=null?t.stretchTabs:!0,this.alignTabs=t&&t.alignTabs!=null?t.alignTabs:null}ngAfterContentChecked(){let t=this._indexToSelect=this._clampTabIndex(this._indexToSelect);if(this._selectedIndex!=t){let e=this._selectedIndex==null;if(!e){this.selectedTabChange.emit(this._createChangeEvent(t));let n=this._tabBodyWrapper.nativeElement;n.style.minHeight=n.clientHeight+`px`}Promise.resolve().then(()=>{this._tabs.forEach((n,i)=>n.isActive=i===t),e||(this.selectedIndexChange.emit(t),this._tabBodyWrapper.nativeElement.style.minHeight=``)})}this._tabs.forEach((e,n)=>{e.position=n-t,this._selectedIndex!=null&&e.position==0&&!e.origin&&(e.origin=t-this._selectedIndex)}),this._selectedIndex!==t&&(this._selectedIndex=t,this._lastFocusedTabIndex=null,this._changeDetectorRef.markForCheck())}ngAfterContentInit(){this._subscribeToAllTabChanges(),this._subscribeToTabLabels(),this._tabsSubscription=this._tabs.changes.subscribe(()=>{let t=this._clampTabIndex(this._indexToSelect);if(t===this._selectedIndex){let e=this._tabs.toArray(),n;for(let i=0;i<e.length;i++)if(e[i].isActive){this._indexToSelect=this._selectedIndex=i,this._lastFocusedTabIndex=null,n=e[i];break}!n&&e[t]&&Promise.resolve().then(()=>{e[t].isActive=!0,this.selectedTabChange.emit(this._createChangeEvent(t))})}this._changeDetectorRef.markForCheck()})}ngAfterViewInit(){this._tabBodySubscription=this._tabBodies.changes.subscribe(()=>this._bodyCentered(!0))}_subscribeToAllTabChanges(){this._allTabs.changes.pipe(st(this._allTabs)).subscribe(t=>{this._tabs.reset(t.filter(e=>e._closestTabGroup===this||!e._closestTabGroup)),this._tabs.notifyOnChanges()})}ngOnDestroy(){this._tabs.destroy(),this._tabsSubscription.unsubscribe(),this._tabLabelSubscription.unsubscribe(),this._tabBodySubscription.unsubscribe()}realignInkBar(){this._tabHeader&&this._tabHeader._alignInkBarToSelectedTab()}updatePagination(){this._tabHeader&&this._tabHeader.updatePagination()}focusTab(t){let e=this._tabHeader;e&&(e.focusIndex=t)}_focusChanged(t){this._lastFocusedTabIndex=t,this.focusChange.emit(this._createChangeEvent(t))}_createChangeEvent(t){let e=new gt;return e.index=t,this._tabs&&this._tabs.length&&(e.tab=this._tabs.toArray()[t]),e}_subscribeToTabLabels(){this._tabLabelSubscription&&this._tabLabelSubscription.unsubscribe(),this._tabLabelSubscription=Xt$1(...this._tabs.map(t=>t._stateChanges)).subscribe(()=>this._changeDetectorRef.markForCheck())}_clampTabIndex(t){return Math.min(this._tabs.length-1,Math.max(t||0,0))}_getTabLabelId(t,e){return t.id||`${this._groupId}-label-${e}`}_getTabContentId(t){return`${this._groupId}-content-${t}`}_setTabBodyWrapperHeight(t){if(!this.dynamicHeight||!this._tabBodyWrapperHeight){this._tabBodyWrapperHeight=t;return}let e=this._tabBodyWrapper.nativeElement;e.style.height=this._tabBodyWrapperHeight+`px`,this._tabBodyWrapper.nativeElement.offsetHeight&&(e.style.height=t+`px`)}_removeTabBodyWrapperHeight(){let t=this._tabBodyWrapper.nativeElement;this._tabBodyWrapperHeight=t.clientHeight,t.style.height=``,this._ngZone.run(()=>this.animationDone.emit())}_handleClick(t,e,n){e.focusIndex=n,t.disabled||(this.selectedIndex=n)}_getTabIndex(t){return t===(this._lastFocusedTabIndex??this.selectedIndex)?0:-1}_tabFocusChanged(t,e){t&&t!==`mouse`&&t!==`touch`&&(this._tabHeader.focusIndex=e)}_bodyCentered(t){t&&this._tabBodies?.forEach((e,n)=>e._setActiveClass(n===this._selectedIndex))}_bodyAnimationsDisabled(){return this._diAnimationsDisabled||this._bodyAnimationDuration===`0`||this._bodyAnimationDuration===`0ms`}static ɵfac=function(e){return new(e||a)};static ɵcmp=X$1({type:a,selectors:[[`mat-tab-group`]],contentQueries:function(e,n,i){if(e&1&&un(i,yt,5),e&2){let d;oe$3(d=se$3())&&(n._allTabs=d)}},viewQuery:function(e,n){if(e&1&&Nt(je,5)(He,5)(ft,5),e&2){let i;oe$3(i=se$3())&&(n._tabBodyWrapper=i.first),oe$3(i=se$3())&&(n._tabHeader=i.first),oe$3(i=se$3())&&(n._tabBodies=i)}},hostAttrs:[1,`mat-mdc-tab-group`],hostVars:13,hostBindings:function(e,n){e&2&&(ie$2(`mat-align-tabs`,n.alignTabs),Jn(`mat-`+(n.color||`primary`)),Ir(`--%NS%mat-tab-body-animation-duration`,n._bodyAnimationDuration)(`--%NS%mat-tab-header-animation-duration`,n._headerAnimationDuration),J(`mat-mdc-tab-group-dynamic-height`,n.dynamicHeight)(`mat-mdc-tab-group-inverted-header`,n.headerPosition===`below`)(`mat-mdc-tab-group-stretch-tabs`,n.stretchTabs))},inputs:{color:`color`,fitInkBarToContent:[2,`fitInkBarToContent`,`fitInkBarToContent`,te$2],stretchTabs:[2,`mat-stretch-tabs`,`stretchTabs`,te$2],alignTabs:[0,`mat-align-tabs`,`alignTabs`],dynamicHeight:[2,`dynamicHeight`,`dynamicHeight`,te$2],selectedIndex:[2,`selectedIndex`,`selectedIndex`,Oo],headerPosition:`headerPosition`,animationDuration:`animationDuration`,contentTabIndex:[2,`contentTabIndex`,`contentTabIndex`,Oo],disablePagination:[2,`disablePagination`,`disablePagination`,te$2],disableRipple:[2,`disableRipple`,`disableRipple`,te$2],preserveContent:[2,`preserveContent`,`preserveContent`,te$2],backgroundColor:`backgroundColor`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`]},outputs:{selectedIndexChange:`selectedIndexChange`,focusChange:`focusChange`,animationDone:`animationDone`,selectedTabChange:`selectedTabChange`},exportAs:[`matTabGroup`],features:[Le$1([{provide:ke$2,useExisting:a}])],ngContentSelectors:vt,decls:9,vars:8,consts:[[`tabHeader`,``],[`tabBodyWrapper`,``],[`tabNode`,``],[3,`indexFocused`,`selectFocusedIndex`,`selectedIndex`,`disableRipple`,`disablePagination`,`aria-label`,`aria-labelledby`],[`role`,`tab`,`matTabLabelWrapper`,``,`cdkMonitorElementFocus`,``,1,`mdc-tab`,`mat-mdc-tab`,`mat-focus-indicator`,3,`id`,`mdc-tab--active`,`class`,`disabled`,`fitInkBarToContent`],[1,`mat-mdc-tab-body-wrapper`],[`role`,`tabpanel`,3,`id`,`class`,`content`,`position`,`animationDuration`,`preserveContent`],[`role`,`tab`,`matTabLabelWrapper`,``,`cdkMonitorElementFocus`,``,1,`mdc-tab`,`mat-mdc-tab`,`mat-focus-indicator`,3,`click`,`cdkFocusChange`,`id`,`disabled`,`fitInkBarToContent`],[1,`mdc-tab__ripple`],[`mat-ripple`,``,1,`mat-mdc-tab-ripple`,3,`matRippleTrigger`,`matRippleDisabled`],[1,`mdc-tab__content`],[1,`mdc-tab__text-label`],[3,`cdkPortalOutlet`],[`role`,`tabpanel`,3,`_onCentered`,`_onCentering`,`_beforeCentering`,`id`,`content`,`position`,`animationDuration`,`preserveContent`]],template:function(e,n){e&1&&(Ge$1(),ue$2(0,`mat-tab-header`,3,0),Fe$2(`indexFocused`,function(d){return n._focusChanged(d)})(`selectFocusedIndex`,function(d){return n.selectedIndex=d}),SA(2,Ve,8,17,`div`,4,bA),ve$3(),Me$2(4,We,1,0),ue$2(5,`div`,5,1),SA(7,Ge,1,10,`mat-tab-body`,6,bA),ve$3()),e&2&&(yt$1(`selectedIndex`,n.selectedIndex||0)(`disableRipple`,n.disableRipple)(`disablePagination`,n.disablePagination),ww(`aria-label`,n.ariaLabel)(`aria-labelledby`,n.ariaLabelledby),le$4(2),wA(n._tabs),le$4(2),Te$1(n._isServer?4:-1),le$4(),J(`_mat-animation-noopable`,n._bodyAnimationsDisabled()),le$4(2),wA(n._tabs))},dependencies:[tn,xe$2,IP,eE,uc,ft],styles:[`.mdc-tab {
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
`],encapsulation:2,changeDetection:1})}return a})();var gt=class{index;tab};var Se$1=(()=>{class a{static ɵfac=function(e){return new(e||a)};static ɵmod=$({type:a});static ɵinj=U({imports:[we$1]})}return a})();function an(a,o){if(a&1&&(ue$2(0,`div`,1),kp(1),ve$3()),a&2){let t=Ke$1();le$4(),Td(t.errorMessage())}}function on$1(a,o){if(a&1&&(ue$2(0,`div`,7),kp(1,`Browsing: `),ue$2(2,`code`),kp(3),ve$3(),rt(4,`br`),kp(5,`Select the current folder to use it.`),ve$3()),a&2){let t=Ke$1();le$4(3),Td(t.browsedPath())}}function rn(a,o){if(a&1){let t=Rp();ue$2(0,`div`,12)(1,`strong`),kp(2,`Selected directory`),ve$3(),ue$2(3,`code`),kp(4),ve$3()(),ue$2(5,`mat-form-field`,9)(6,`mat-label`),kp(7,`Project display name`),ve$3(),ue$2(8,`input`,18),Fe$2(`input`,function(){gr(t);return vr(Ke$1().editProjectName())}),ve$3(),fT(),ve$3()}if(a&2){let t=Ke$1();le$4(4),Td(t.selectedPath()),le$4(4),yt$1(`formField`,t.projectForm.projectName),mT()}}function sn(a,o){if(a&1&&(ue$2(0,`div`,7),kp(1,`Browsing: `),ue$2(2,`code`),kp(3),ve$3(),rt(4,`br`),kp(5,`Select the current folder to use it.`),ve$3()),a&2){let t=Ke$1();le$4(3),Td(t.cloneBrowsedPath())}}function ln(a,o){if(a&1&&(ue$2(0,`div`,12)(1,`strong`),kp(2,`Parent path`),ve$3(),ue$2(3,`code`),kp(4),ve$3()()),a&2){let t=Ke$1();le$4(4),Td(t.cloneParentPath())}}function dn(a,o){a&1&&rt(0,`mat-progress-bar`,14)}function cn(a,o){if(a&1){let t=Rp();ue$2(0,`button`,19),Fe$2(`click`,function(){gr(t);return vr(Ke$1().createFromFolder())}),kp(1,`Create project`),ve$3()}if(a&2){let t=Ke$1();yt$1(`disabled`,!t.selectedPath()||!t.projectName().trim())}}function mn(a,o){if(a&1){let t=Rp();ue$2(0,`button`,19),Fe$2(`click`,function(){gr(t);return vr(Ke$1().cloneRepository())}),kp(1,`Clone & create`),ve$3()}if(a&2){let t=Ke$1();yt$1(`disabled`,!t.repoUrl().trim()||!t.cloneParentPath()||t.cloning())}}var we=class a{constructor(){this.state=u(gE);this.dialogRef=u(Ju);this.router=u(si$1);this.modeIndex=C(0);this.formModel=C({projectName:``,repoUrl:``,cloneProjectName:``});this.projectForm=R1(this.formModel);this.projectName=this.projectForm.projectName().value;this.selectedPath=C(``);this.browsedPath=C(``);this.repoUrl=this.projectForm.repoUrl().value;this.cloneParentPath=C(``);this.cloneBrowsedPath=C(``);this.cloneProjectName=this.projectForm.cloneProjectName().value;this.cloning=C(!1);this.errorMessage=C(``);this.projectNameEdited=!1}editProjectName(){this.projectNameEdited=!0}folderBrowsed(o){this.browsedPath.set(o.path)}folderSelected(o){this.selectedPath.set(o.path),this.projectNameEdited||this.projectName.set(o.name)}async createFromFolder(){if(!this.selectedPath()||!this.projectName().trim()){this.errorMessage.set(`Please select a folder and specify a project name.`);return}try{this.errorMessage.set(``);let o=await this.state.createProject(this.projectName().trim(),this.selectedPath());this.dialogRef.close(o),await this.router.navigate([`/projects`,o.id])}catch(o){this.errorMessage.set(o instanceof Error?o.message:`Failed to create project`)}}async cloneRepository(){if(!this.repoUrl().trim()||!this.cloneParentPath()){this.errorMessage.set(`Please provide repository URL and destination parent directory.`);return}this.cloning.set(!0),this.errorMessage.set(``);try{let o=await this.state.cloneProject({url:this.repoUrl().trim(),parent_path:this.cloneParentPath(),name:this.cloneProjectName().trim()||void 0});this.dialogRef.close(o),await this.router.navigate([`/projects`,o.id])}catch(o){this.errorMessage.set(o instanceof Error?o.message:`Failed to clone repository`)}finally{this.cloning.set(!1)}}static{this.ɵfac=function(t){return new(t||a)}}static{this.ɵcmp=X$1({type:a,selectors:[[`hub-project-dialog`]],decls:35,vars:11,consts:[[`mat-dialog-title`,``],[`role`,`alert`,1,`error-box`],[3,`selectedIndexChange`,`selectedIndex`],[`label`,`Existing folder`],[1,`tab-content`],[1,`help`],[3,`folderBrowsed`,`folderSelected`],[1,`path-note`],[`label`,`Clone repository`],[`appearance`,`outline`],[`matInput`,``,`placeholder`,`https://github.com/org/repo.git`,`autocomplete`,`off`,3,`formField`],[1,`field-label`],[1,`selected-path`],[`matInput`,``,`autocomplete`,`off`,3,`formField`],[`mode`,`indeterminate`,`aria-label`,`Cloning repository`],[`align`,`end`],[`mat-button`,``,`type`,`button`,3,`click`,`disabled`],[`mat-flat-button`,``,`type`,`button`,3,`disabled`],[`matInput`,``,`autocomplete`,`off`,3,`input`,`formField`],[`mat-flat-button`,``,`type`,`button`,3,`click`,`disabled`]],template:function(t,e){t&1&&(ue$2(0,`h2`,0),kp(1,`New project`),ve$3(),ue$2(2,`mat-dialog-content`),Me$2(3,an,2,1,`div`,1),ue$2(4,`mat-tab-group`,2),Fe$2(`selectedIndexChange`,function(i){return e.modeIndex.set(i)}),ue$2(5,`mat-tab`,3)(6,`div`,4)(7,`p`,5),kp(8,`Choose a directory already available on the server.`),ve$3(),ue$2(9,`hub-folder-picker`,6),Fe$2(`folderBrowsed`,function(i){return e.folderBrowsed(i)})(`folderSelected`,function(i){return e.folderSelected(i)}),ve$3(),Me$2(10,on$1,6,1,`div`,7),Me$2(11,rn,9,2),ve$3()(),ue$2(12,`mat-tab`,8)(13,`div`,4)(14,`mat-form-field`,9)(15,`mat-label`),kp(16,`Git repository URL (HTTPS or SSH)`),ve$3(),rt(17,`input`,10),fT(),ue$2(18,`mat-hint`),kp(19,`Plain HTTP URLs are not accepted by the server.`),ve$3()(),ue$2(20,`p`,11),kp(21,`Destination parent directory`),ve$3(),ue$2(22,`hub-folder-picker`,6),Fe$2(`folderBrowsed`,function(i){return e.cloneBrowsedPath.set(i.path)})(`folderSelected`,function(i){return e.cloneParentPath.set(i.path)}),ve$3(),Me$2(23,sn,6,1,`div`,7),Me$2(24,ln,5,1,`div`,12),ue$2(25,`mat-form-field`,9)(26,`mat-label`),kp(27,`Project / folder name (optional)`),ve$3(),rt(28,`input`,13),fT(),ve$3(),Me$2(29,dn,1,0,`mat-progress-bar`,14),ve$3()()()(),ue$2(30,`mat-dialog-actions`,15)(31,`button`,16),Fe$2(`click`,function(){return e.dialogRef.close()}),kp(32,`Cancel`),ve$3(),Me$2(33,cn,2,1,`button`,17)(34,mn,2,1,`button`,17),ve$3()),t&2&&(le$4(3),Te$1(e.errorMessage()?3:-1),le$4(),yt$1(`selectedIndex`,e.modeIndex()),le$4(6),Te$1(e.browsedPath()&&e.browsedPath()!==e.selectedPath()?10:-1),le$4(),Te$1(e.selectedPath()?11:-1),le$4(6),yt$1(`formField`,e.projectForm.repoUrl),mT(),le$4(6),Te$1(e.cloneBrowsedPath()&&e.cloneBrowsedPath()!==e.cloneParentPath()?23:-1),le$4(),Te$1(e.cloneParentPath()?24:-1),le$4(4),yt$1(`formField`,e.projectForm.cloneProjectName),mT(),le$4(),Te$1(e.cloning()?29:-1),le$4(2),yt$1(`disabled`,e.cloning()),le$4(2),Te$1(e.modeIndex()===0?33:34))},dependencies:[rre,se$2,EX,CX,fne,lne,une,dne,bv,ex,gv,vv,WX,Gre,Wre,ae$2,ie$1,Se$1,yt,Te],styles:[`mat-dialog-content[_ngcontent-%COMP%]{max-height:min(680px,70vh)}.tab-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:14px;padding:22px 4px 8px}mat-form-field[_ngcontent-%COMP%]{width:100%}.help[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.field-label[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-title-small)}.path-note[_ngcontent-%COMP%], .selected-path[_ngcontent-%COMP%]{padding:10px 12px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-surface-container);color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-small)}.selected-path[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px}code[_ngcontent-%COMP%]{overflow-wrap:anywhere}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}`]})}};function Ti(n){n||(n=u(ke$3));let r=new V(e=>{if(n.destroyed){e.next();return}return n.onDestroy(e.next.bind(e))});return e=>e.pipe(at(r))}function Ii(n,r){let t=!r?.manualCleanup?r?.injector?.get(ke$3)??u(ke$3):null,i=Rt(r?.equal),o;r?.requireSync?o=C({kind:0},{equal:i}):o=C({kind:1,value:r?.initialValue},{equal:i});let a,p=n.subscribe({next:l=>o.set({kind:1,value:l}),error:l=>{o.set({kind:2,error:l}),a?.()},complete:()=>{a?.()}});if(r?.requireSync&&o().kind===0)throw new _(601,!1);return a=t?.onDestroy(p.unsubscribe.bind(p)),x(()=>{let l=o();switch(l.kind){case 1:return l.value;case 2:throw l.error;case 0:throw new _(601,!1)}},{equal:r?.equal})}function Rt(n=Object.is){return(r,e)=>r.kind===1&&e.kind===1&&n(r.value,e.value)}var At=[`tooltip`];var Pt=20;var Lt=new g(`mat-tooltip-scroll-strategy`,{providedIn:`root`,factory:()=>{let n=u(T);return()=>pc(n,{scrollThrottle:Pt})}});var Ft=new g(`mat-tooltip-default-options`,{providedIn:`root`,factory:()=>({showDelay:0,hideDelay:0,touchendHideDelay:1500})});var xt=`tooltip-panel`;var Vt={passive:!0};var jt=8;var Ht$1=8;var Bt=24;var zt$1=200;var Gt=(()=>{class n{_elementRef=u(N$2);_ngZone=u(I);_platform=u(fe$2);_ariaDescriber=u(fQ);_focusMonitor=u(ai$1);_dir=u(jt$1);_injector=u(T);_viewContainerRef=u(it);_mediaMatcher=u(Cu);_document=u(M);_renderer=u(ge$4);_animationsDisabled=Je$2();_defaultOptions=u(Ft,{optional:!0});_overlayRef=null;_tooltipInstance=null;_overlayPanelClass;_portal;_position=`below`;_positionAtOrigin=!1;_disabled=!1;_tooltipClass;_viewInitialized=!1;_pointerExitEventsInitialized=!1;_tooltipComponent=Dt;_viewportMargin=8;_currentPosition;_cssClassPrefix=`mat-mdc`;_ariaDescriptionPending=!1;_dirSubscribed=!1;get position(){return this._position}set position(e){e!==this._position&&(this._position=e,this._overlayRef&&(this._updatePosition(this._overlayRef),this._tooltipInstance?.show(0),this._overlayRef.updatePosition()))}get positionAtOrigin(){return this._positionAtOrigin}set positionAtOrigin(e){this._positionAtOrigin=Ct(e),this._detach(),this._overlayRef=null}get disabled(){return this._disabled}set disabled(e){let t=Ct(e);this._disabled!==t&&(this._disabled=t,t?this.hide(0):this._setupPointerEnterEventsIfNeeded(),this._syncAriaDescription(this.message))}get showDelay(){return this._showDelay}set showDelay(e){this._showDelay=Yt$2(e)}_showDelay;get hideDelay(){return this._hideDelay}set hideDelay(e){this._hideDelay=Yt$2(e),this._tooltipInstance&&(this._tooltipInstance._mouseLeaveHideDelay=this._hideDelay)}_hideDelay;touchGestures=`auto`;get message(){return this._message}set message(e){let t=this._message;this._message=e!=null?String(e).trim():``,!this._message&&this._isTooltipVisible()?this.hide(0):(this._setupPointerEnterEventsIfNeeded(),this._updateTooltipMessage()),this._syncAriaDescription(t)}_message=``;get tooltipClass(){return this._tooltipClass}set tooltipClass(e){this._tooltipClass=e,this._tooltipInstance&&this._setTooltipClass(this._tooltipClass)}_eventCleanups=[];_touchstartTimeout=null;_destroyed=new w;_isDestroyed=!1;constructor(){let e=this._defaultOptions;e&&(this._showDelay=e.showDelay,this._hideDelay=e.hideDelay,e.position&&(this.position=e.position),e.positionAtOrigin&&(this.positionAtOrigin=e.positionAtOrigin),e.touchGestures&&(this.touchGestures=e.touchGestures),e.tooltipClass&&(this.tooltipClass=e.tooltipClass)),this._viewportMargin=jt}ngAfterViewInit(){this._viewInitialized=!0,this._setupPointerEnterEventsIfNeeded(),this._focusMonitor.monitor(this._elementRef).pipe(at(this._destroyed)).subscribe(e=>{e?e===`keyboard`&&this._ngZone.run(()=>this.show()):this._ngZone.run(()=>this.hide(0))})}ngOnDestroy(){let e=this._elementRef.nativeElement;this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this._overlayRef&&(this._overlayRef.dispose(),this._tooltipInstance=null),this._eventCleanups.forEach(t=>t()),this._eventCleanups.length=0,this._destroyed.next(),this._destroyed.complete(),this._isDestroyed=!0,this._ariaDescriber.removeDescription(e,this.message,`tooltip`),this._focusMonitor.stopMonitoring(e)}show(e=this.showDelay,t){if(this.disabled||!this.message||this._isTooltipVisible()){this._tooltipInstance?._cancelPendingAnimations();return}let i=this._createOverlay(t);this._detach(),this._portal=this._portal||new ls(this._tooltipComponent,this._viewContainerRef);let o=this._tooltipInstance=i.attach(this._portal).instance;o._triggerElement=this._elementRef.nativeElement,o._mouseLeaveHideDelay=this._hideDelay,o.afterHidden().pipe(at(this._destroyed)).subscribe(()=>this._detach()),this._setTooltipClass(this._tooltipClass),this._updateTooltipMessage(),o.show(e)}hide(e=this.hideDelay){let t=this._tooltipInstance;t&&(t.isVisible()?t.hide(e):(t._cancelPendingAnimations(),this._detach()))}toggle(e){this._isTooltipVisible()?this.hide():this.show(void 0,e)}_isTooltipVisible(){return!!this._tooltipInstance&&this._tooltipInstance.isVisible()}_createOverlay(e){if(this._overlayRef){let a=this._overlayRef.getConfig().positionStrategy;if((!this.positionAtOrigin||!e)&&a._origin instanceof N$2)return this._overlayRef;this._detach()}let t=this._injector.get(fs).getAncestorScrollContainers(this._elementRef),i=`${this._cssClassPrefix}-${xt}`,o=gc(this._injector,this.positionAtOrigin?e||this._elementRef:this._elementRef).withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`).withFlexibleDimensions(!1).withViewportMargin(this._viewportMargin).withScrollableContainers(t).withPopoverLocation(`global`);return o.positionChanges.pipe(at(this._destroyed)).subscribe(a=>{this._updateCurrentPositionClass(a.connectionPair),this._tooltipInstance&&a.scrollableViewProperties.isOverlayClipped&&this._tooltipInstance.isVisible()&&this._ngZone.run(()=>this.hide(0))}),this._overlayRef=Gr(this._injector,{direction:this._dir,positionStrategy:o,panelClass:this._overlayPanelClass?[...this._overlayPanelClass,i]:i,scrollStrategy:this._injector.get(Lt)(),disableAnimations:this._animationsDisabled,eventPredicate:this._overlayEventPredicate}),this._updatePosition(this._overlayRef),this._overlayRef.detachments().pipe(at(this._destroyed)).subscribe(()=>this._detach()),this._overlayRef.outsidePointerEvents().pipe(at(this._destroyed)).subscribe(()=>this._tooltipInstance?._handleBodyInteraction()),this._overlayRef.keydownEvents().pipe(at(this._destroyed)).subscribe(a=>{a.preventDefault(),a.stopPropagation(),this._ngZone.run(()=>this.hide(0))}),this._defaultOptions?.disableTooltipInteractivity&&this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`),this._dirSubscribed||(this._dirSubscribed=!0,this._dir.change.pipe(at(this._destroyed)).subscribe(()=>{this._overlayRef&&this._updatePosition(this._overlayRef)})),this._overlayRef}_detach(){this._overlayRef&&this._overlayRef.hasAttached()&&this._overlayRef.detach(),this._tooltipInstance=null}_updatePosition(e){let t=e.getConfig().positionStrategy,i=this._getOrigin(),o=this._getOverlayPosition();t.withPositions([this._addOffset(p(p({},i.main),o.main)),this._addOffset(p(p({},i.fallback),o.fallback))])}_addOffset(e){let t=Ht$1,i=!this._dir||this._dir.value==`ltr`;return e.originY===`top`?e.offsetY=-t:e.originY===`bottom`?e.offsetY=t:e.originX===`start`?e.offsetX=i?-t:t:e.originX===`end`&&(e.offsetX=i?t:-t),e}_getOrigin(){let e=!this._dir||this._dir.value==`ltr`,t=this.position,i;t==`above`||t==`below`?i={originX:`center`,originY:t==`above`?`top`:`bottom`}:t==`before`||t==`left`&&e||t==`right`&&!e?i={originX:`start`,originY:`center`}:(t==`after`||t==`right`&&e||t==`left`&&!e)&&(i={originX:`end`,originY:`center`});let{x:o,y:a}=this._invertPosition(i.originX,i.originY);return{main:i,fallback:{originX:o,originY:a}}}_getOverlayPosition(){let e=!this._dir||this._dir.value==`ltr`,t=this.position,i;t==`above`?i={overlayX:`center`,overlayY:`bottom`}:t==`below`?i={overlayX:`center`,overlayY:`top`}:t==`before`||t==`left`&&e||t==`right`&&!e?i={overlayX:`end`,overlayY:`center`}:(t==`after`||t==`right`&&e||t==`left`&&!e)&&(i={overlayX:`start`,overlayY:`center`});let{x:o,y:a}=this._invertPosition(i.overlayX,i.overlayY);return{main:i,fallback:{overlayX:o,overlayY:a}}}_updateTooltipMessage(){this._tooltipInstance&&(this._tooltipInstance.message=this.message,this._tooltipInstance._markForCheck(),xt$1(()=>{this._tooltipInstance&&this._overlayRef.updatePosition()},{injector:this._injector}))}_setTooltipClass(e){this._tooltipInstance&&(this._tooltipInstance.tooltipClass=e instanceof Set?Array.from(e):e,this._tooltipInstance._markForCheck())}_invertPosition(e,t){return this.position===`above`||this.position===`below`?t===`top`?t=`bottom`:t===`bottom`&&(t=`top`):e===`end`?e=`start`:e===`start`&&(e=`end`),{x:e,y:t}}_updateCurrentPositionClass(e){let{overlayY:t,originX:i,originY:o}=e,a;if(t===`center`?this._dir&&this._dir.value===`rtl`?a=i===`end`?`left`:`right`:a=i===`start`?`left`:`right`:a=t===`bottom`&&o===`top`?`above`:`below`,a!==this._currentPosition){let p=this._overlayRef;if(p){let l=`${this._cssClassPrefix}-${xt}-`;p.removePanelClass(l+this._currentPosition),p.addPanelClass(l+a)}this._currentPosition=a}}_setupPointerEnterEventsIfNeeded(){this._disabled||!this.message||!this._viewInitialized||this._eventCleanups.length||(this._isTouchPlatform()?this.touchGestures!==`off`&&(this._disableNativeGesturesIfNecessary(),this._addListener(`touchstart`,e=>{let t=e.targetTouches?.[0],i=t?{x:t.clientX,y:t.clientY}:void 0;this._setupPointerExitEventsIfNeeded(),this._touchstartTimeout&&clearTimeout(this._touchstartTimeout);let o=500;this._touchstartTimeout=setTimeout(()=>{this._touchstartTimeout=null,this.show(void 0,i)},this._defaultOptions?.touchLongPressShowDelay??o)})):this._addListener(`mouseenter`,e=>{this._setupPointerExitEventsIfNeeded();let t;e.x!==void 0&&e.y!==void 0&&(t=e),this.show(void 0,t)}))}_setupPointerExitEventsIfNeeded(){if(!this._pointerExitEventsInitialized){if(this._pointerExitEventsInitialized=!0,!this._isTouchPlatform())this._addListener(`mouseleave`,e=>{let t=e.relatedTarget;(!t||!this._overlayRef?.overlayElement.contains(t))&&this.hide()}),this._addListener(`wheel`,e=>{if(this._isTooltipVisible()){let t=this._document.elementFromPoint(e.clientX,e.clientY),i=this._elementRef.nativeElement;t!==i&&!i.contains(t)&&this.hide()}});else if(this.touchGestures!==`off`){this._disableNativeGesturesIfNecessary();let e=()=>{this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this.hide(this._defaultOptions?.touchendHideDelay)};this._addListener(`touchend`,e),this._addListener(`touchcancel`,e)}}}_addListener(e,t){this._eventCleanups.push(this._renderer.listen(this._elementRef.nativeElement,e,t,Vt))}_isTouchPlatform(){let e=this._defaultOptions?.detectHoverCapability;return typeof e==`function`?!e():this._platform.IOS||this._platform.ANDROID?!0:this._platform.isBrowser?!!e&&this._mediaMatcher.matchMedia(`(any-hover: none)`).matches:!1}_disableNativeGesturesIfNecessary(){let e=this.touchGestures;if(e!==`off`){let t=this._elementRef.nativeElement,i=t.style;(e===`on`||t.nodeName!==`INPUT`&&t.nodeName!==`TEXTAREA`)&&(i.userSelect=i.msUserSelect=i.webkitUserSelect=i.MozUserSelect=`none`),(e===`on`||!t.draggable)&&(i.webkitUserDrag=`none`),i.touchAction=`none`,i.webkitTapHighlightColor=`transparent`}}_syncAriaDescription(e){this._ariaDescriptionPending||(this._ariaDescriptionPending=!0,this._ariaDescriber.removeDescription(this._elementRef.nativeElement,e,`tooltip`),this._isDestroyed||xt$1({write:()=>{this._ariaDescriptionPending=!1,this.message&&!this.disabled&&this._ariaDescriber.describe(this._elementRef.nativeElement,this.message,`tooltip`)}},{injector:this._injector}))}_overlayEventPredicate=e=>e.type===`keydown`?this._isTooltipVisible()&&e.keyCode===27&&!Pn(e):!0;static ɵfac=function(t){return new(t||n)};static ɵdir=D$1({type:n,selectors:[[``,`matTooltip`,``]],hostAttrs:[1,`mat-mdc-tooltip-trigger`],hostVars:2,hostBindings:function(t,i){t&2&&J(`mat-mdc-tooltip-disabled`,i.disabled)},inputs:{position:[0,`matTooltipPosition`,`position`],positionAtOrigin:[0,`matTooltipPositionAtOrigin`,`positionAtOrigin`],disabled:[0,`matTooltipDisabled`,`disabled`],showDelay:[0,`matTooltipShowDelay`,`showDelay`],hideDelay:[0,`matTooltipHideDelay`,`hideDelay`],touchGestures:[0,`matTooltipTouchGestures`,`touchGestures`],message:[0,`matTooltip`,`message`],tooltipClass:[0,`matTooltipClass`,`tooltipClass`]},exportAs:[`matTooltip`]})}return n})();var Dt=(()=>{class n{_changeDetectorRef=u(Qe$1);_elementRef=u(N$2);_isMultiline=!1;message;tooltipClass;_showTimeoutId;_hideTimeoutId;_triggerElement;_mouseLeaveHideDelay;_animationsDisabled=Je$2();_tooltip;_closeOnInteraction=!1;_isVisible=!1;_onHide=new w;_showAnimation=`mat-mdc-tooltip-show`;_hideAnimation=`mat-mdc-tooltip-hide`;show(e){this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=setTimeout(()=>{this._toggleVisibility(!0),this._showTimeoutId=void 0},e)}hide(e){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId=setTimeout(()=>{this._toggleVisibility(!1),this._hideTimeoutId=void 0},e)}afterHidden(){return this._onHide}isVisible(){return this._isVisible}ngOnDestroy(){this._cancelPendingAnimations(),this._onHide.complete(),this._triggerElement=null}_handleBodyInteraction(){this._closeOnInteraction&&this.hide(0)}_markForCheck(){this._changeDetectorRef.markForCheck()}_handleMouseLeave({relatedTarget:e}){(!e||!this._triggerElement.contains(e))&&(this.isVisible()?this.hide(this._mouseLeaveHideDelay):this._finalizeAnimation(!1))}_onShow(){this._isMultiline=this._isTooltipMultiline(),this._markForCheck()}_isTooltipMultiline(){let e=this._elementRef.nativeElement.getBoundingClientRect();return e.height>Bt&&e.width>=zt$1}_handleAnimationEnd({animationName:e}){(e===this._showAnimation||e===this._hideAnimation)&&this._finalizeAnimation(e===this._showAnimation)}_cancelPendingAnimations(){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=this._hideTimeoutId=void 0}_finalizeAnimation(e){e?this._closeOnInteraction=!0:this.isVisible()||this._onHide.next()}_toggleVisibility(e){let t=this._tooltip.nativeElement,i=this._showAnimation,o=this._hideAnimation;if(t.classList.remove(e?o:i),t.classList.add(e?i:o),this._isVisible!==e&&(this._isVisible=e,this._changeDetectorRef.markForCheck()),e&&!this._animationsDisabled&&typeof getComputedStyle==`function`){let a=getComputedStyle(t);(a.getPropertyValue(`animation-duration`)===`0s`||a.getPropertyValue(`animation-name`)===`none`)&&(this._animationsDisabled=!0)}e&&this._onShow(),this._animationsDisabled&&(t.classList.add(`_mat-animation-noopable`),this._finalizeAnimation(e))}static ɵfac=function(t){return new(t||n)};static ɵcmp=X$1({type:n,selectors:[[`mat-tooltip-component`]],viewQuery:function(t,i){if(t&1&&Nt(At,7),t&2){let o;oe$3(o=se$3())&&(i._tooltip=o.first)}},hostAttrs:[`aria-hidden`,`true`],hostBindings:function(t,i){t&1&&Fe$2(`mouseleave`,function(a){return i._handleMouseLeave(a)})},decls:4,vars:5,consts:[[`tooltip`,``],[1,`mdc-tooltip`,`mat-mdc-tooltip`,3,`animationend`],[1,`mat-mdc-tooltip-surface`,`mdc-tooltip__surface`]],template:function(t,i){t&1&&(ft$1(0,`div`,1,0),xd(`animationend`,function(a){return i._handleAnimationEnd(a)}),ft$1(2,`div`,2),kp(3),_t$1()()),t&2&&(Jn(i.tooltipClass),J(`mdc-tooltip--multiline`,i._isMultiline),le$4(3),Td(i.message))},styles:[`.mat-mdc-tooltip {
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
`],encapsulation:2})}return n})();var on=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[jg,qr,we$1,fc]})}return n})();var oe$1=class n{constructor(){this.now=C(Date.now());this.interval=setInterval(()=>this.now.set(Date.now()),1e3)}ngOnDestroy(){clearInterval(this.interval)}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵprov=b({token:n,factory:n.ɵfac})}};var kt=class n{constructor(){this.status=Mi(`idle`);this.turnStartedAt=Mi(null);this.clock=u(oe$1);this.label=x(()=>qX(this.status(),this.turnStartedAt(),this.clock.now()))}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X$1({type:n,selectors:[[`hub-chat-status-badge`]],inputs:{status:[1,`status`],turnStartedAt:[1,`turnStartedAt`]},decls:2,vars:11,consts:[[1,`chat-status`]],template:function(e,t){e&1&&(ft$1(0,`span`,0),kp(1),_t$1()),e&2&&(J(`status-idle`,t.status()===`idle`)(`status-working`,t.status()===`working`)(`status-waiting`,t.status()===`waiting`)(`status-error`,t.status()===`error`),ie$2(`data-status`,t.status())(`aria-label`,t.label()),le$4(),Td(t.label()))},styles:[`.chat-status[_ngcontent-%COMP%]{display:inline-flex;align-items:center;padding:3px 10px;border-radius:var(--%NS%mat-sys-corner-full);font:var(--%NS%mat-sys-label-small);white-space:nowrap}.status-idle[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container-high);color:var(--%NS%mat-sys-on-surface-variant)}.status-working[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container)}.status-waiting[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-tertiary-container);color:var(--%NS%mat-sys-on-tertiary-container)}.status-error[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}`]})}};var Wt$1=[`*`,[[`mat-option`],[`ng-container`]]];var Yt$1=[`*`,`mat-option, ng-container`];var qt$1=[`text`];var Ut=[[[`mat-icon`]],`*`];var Kt$1=[`mat-icon`,`*`];function Xt(n,r){if(n&1&&rt(0,`mat-pseudo-checkbox`,1),n&2){let e=Ke$1();yt$1(`disabled`,e.disabled)(`state`,e.selected?`checked`:`unchecked`)}}function Qt$1(n,r){if(n&1&&rt(0,`mat-pseudo-checkbox`,3),n&2)yt$1(`disabled`,Ke$1().disabled)}function $t(n,r){if(n&1&&(ue$2(0,`span`,4),kp(1),ve$3()),n&2){let e=Ke$1();le$4(),Op(`(`,e.group.label,`)`)}}var re$2=new g(`MAT_OPTION_PARENT_COMPONENT`);var le$2=new g(`MatOptgroup`);var Zt$1=(()=>{class n{label;disabled=!1;_labelId=u(ot).getId(`mat-optgroup-label-`);_inert;constructor(){let e=u(re$2,{optional:!0});this._inert=e?.inertGroups??!1}static ɵfac=function(t){return new(t||n)};static ɵcmp=X$1({type:n,selectors:[[`mat-optgroup`]],hostAttrs:[1,`mat-mdc-optgroup`],hostVars:3,hostBindings:function(t,i){t&2&&ie$2(`role`,i._inert?null:`group`)(`aria-disabled`,i._inert?null:i.disabled.toString())(`aria-labelledby`,i._inert?null:i._labelId)},inputs:{label:`label`,disabled:[2,`disabled`,`disabled`,te$2]},exportAs:[`matOptgroup`],features:[Le$1([{provide:le$2,useExisting:n}])],ngContentSelectors:Yt$1,decls:5,vars:4,consts:[[`role`,`presentation`,1,`mat-mdc-optgroup-label`,3,`id`],[1,`mdc-list-item__primary-text`]],template:function(t,i){t&1&&(Ge$1(Wt$1),ft$1(0,`span`,0)(1,`span`,1),kp(2),ee$2(3),_t$1()(),ee$2(4,1)),t&2&&(J(`mdc-list-item--disabled`,i.disabled),dn$1(`id`,i._labelId),le$4(2),Op(``,i.label,` `))},styles:[`.mat-mdc-optgroup {
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
`],encapsulation:2})}return n})();var xe$1=class{source;isUserInput;constructor(r,e=!1){this.source=r,this.isUserInput=e}};var ce$2=(()=>{class n{_element=u(N$2);_changeDetectorRef=u(Qe$1);_parent=u(re$2,{optional:!0});group=u(le$2,{optional:!0});_signalDisableRipple=!1;_selected=!1;_active=!1;_mostRecentViewValue=``;get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=u(ot).getId(`mat-option-`);get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=C(!1);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return!!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new z;_text;_stateChanges=new w;constructor(){let e=u(qe$1);e.load(os),e.load(Iu),this._signalDisableRipple=!!this._parent&&sn$1(this._parent.disableRipple)}get active(){return this._active}get viewValue(){return(this._text?.nativeElement.textContent||``).trim()}select(e=!0){this._selected||(this._selected=!0,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}deselect(e=!0){this._selected&&(this._selected=!1,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}focus(e,t){let i=this._getHostElement();typeof i.focus==`function`&&i.focus(t)}setActiveStyles(){this._active||(this._active=!0,this._changeDetectorRef.markForCheck())}setInactiveStyles(){this._active&&(this._active=!1,this._changeDetectorRef.markForCheck())}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!Pn(e)&&(this._selectViaInteraction(),e.preventDefault())}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:!0,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(!0))}_getTabIndex(){return this.disabled?`-1`:`0`}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e)}}ngOnDestroy(){this._stateChanges.complete()}_emitSelectionChangeEvent(e=!1){this.onSelectionChange.emit(new xe$1(this,e))}static ɵfac=function(t){return new(t||n)};static ɵcmp=X$1({type:n,selectors:[[`mat-option`]],viewQuery:function(t,i){if(t&1&&Nt(qt$1,7),t&2){let o;oe$3(o=se$3())&&(i._text=o.first)}},hostAttrs:[`role`,`option`,1,`mat-mdc-option`,`mdc-list-item`],hostVars:11,hostBindings:function(t,i){t&1&&Fe$2(`click`,function(){return i._selectViaInteraction()})(`keydown`,function(a){return i._handleKeydown(a)}),t&2&&(dn$1(`id`,i.id),ie$2(`aria-selected`,i.selected)(`aria-disabled`,i.disabled.toString()),J(`mdc-list-item--selected`,i.selected)(`mat-mdc-option-multiple`,i.multiple)(`mat-mdc-option-active`,i.active)(`mdc-list-item--disabled`,i.disabled))},inputs:{value:`value`,id:`id`,disabled:[2,`disabled`,`disabled`,te$2]},outputs:{onSelectionChange:`onSelectionChange`},exportAs:[`matOption`],ngContentSelectors:Kt$1,decls:8,vars:5,consts:[[`text`,``],[`aria-hidden`,`true`,1,`mat-mdc-option-pseudo-checkbox`,3,`disabled`,`state`],[1,`mdc-list-item__primary-text`],[`state`,`checked`,`aria-hidden`,`true`,`appearance`,`minimal`,1,`mat-mdc-option-pseudo-checkbox`,3,`disabled`],[1,`cdk-visually-hidden`],[`aria-hidden`,`true`,`mat-ripple`,``,1,`mat-mdc-option-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`]],template:function(t,i){t&1&&(Ge$1(Ut),Me$2(0,Xt,1,2,`mat-pseudo-checkbox`,1),ee$2(1),ue$2(2,`span`,2,0),ee$2(4,1),ve$3(),Me$2(5,Qt$1,1,1,`mat-pseudo-checkbox`,3),Me$2(6,$t,2,1,`span`,4),rt(7,`div`,5)),t&2&&(Te$1(i.multiple?0:-1),le$4(5),Te$1(!i.multiple&&i.selected&&!i.hideSingleSelectionIndicator?5:-1),le$4(),Te$1(i.group&&i.group._inert?6:-1),le$4(),yt$1(`matRippleTrigger`,i._getHostElement())(`matRippleDisabled`,i.disabled||i.disableRipple))},dependencies:[ooe,eE],styles:[`.mat-mdc-option {
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
`],encapsulation:2})}return n})();function Tt(n,r,e){if(e.length){let t=r.toArray(),i=e.toArray(),o=0;for(let a=0;a<n+1;a++)t[a].group&&t[a].group===i[o]&&o++;return o}return 0}function It(n,r,e,t){return n<e?n:n+r>e+t?Math.max(0,n-t+r):e}var De$1=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[ss,r0,ce$2,we$1]})}return n})();var ii=[`trigger`];var ni=[`panel`];var oi=[[[`mat-select-trigger`]],`*`];var ai=[`mat-select-trigger`,`*`];function si(n,r){if(n&1&&(ue$2(0,`span`,4),kp(1),ve$3()),n&2){let e=Ke$1();le$4(),Td(e.placeholder)}}function ri(n,r){n&1&&ee$2(0)}function li(n,r){if(n&1&&(ue$2(0,`span`,11),kp(1),ve$3()),n&2){let e=Ke$1(2);le$4(),Td(e.triggerValue)}}function ci(n,r){if(n&1&&(ue$2(0,`span`,5),Me$2(1,ri,1,0)(2,li,2,1,`span`,11),ve$3()),n&2){let e=Ke$1();le$4(),Te$1(e.customTrigger?1:2)}}function di(n,r){if(n&1){let e=Rp();ue$2(0,`div`,12,1),Fe$2(`keydown`,function(i){gr(e);return vr(Ke$1()._handleKeydown(i))}),ee$2(2,1),ve$3()}if(n&2){let e=Ke$1();Jn(e.panelClass),J(`mat-select-panel-animations-enabled`,!e._animationsDisabled)(`mat-primary`,e._parentFormField?.color===`primary`)(`mat-accent`,e._parentFormField?.color===`accent`)(`mat-warn`,e._parentFormField?.color===`warn`)(`mat-undefined`,!e._parentFormField?.color),ie$2(`id`,e.id+`-panel`)(`aria-multiselectable`,e.multiple)(`aria-label`,e.ariaLabel||null)(`aria-labelledby`,e._getPanelAriaLabelledby())}}var pi=new g(`mat-select-scroll-strategy`,{providedIn:`root`,factory:()=>{let n=u(T);return()=>pc(n)}});var mi=new g(`MAT_SELECT_CONFIG`);var hi=new g(`MatSelectTrigger`);var ke$1=class{source;value;constructor(r,e){this.source=r,this.value=e}};var po=(()=>{class n{_viewportRuler=u($r);_changeDetectorRef=u(Qe$1);_elementRef=u(N$2);_dir=u(jt$1,{optional:!0});_idGenerator=u(ot);_renderer=u(ge$4);_parentFormField=u(_v,{optional:!0});ngControl=u(Fn,{self:!0,optional:!0});_liveAnnouncer=u(UP);_defaultOptions=u(mi,{optional:!0});_animationsDisabled=Je$2();_popoverLocation;_initialized=new w;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:`start`,originY:`bottom`,overlayX:`start`,overlayY:`top`},{originX:`end`,originY:`bottom`,overlayX:`end`,overlayY:`top`},{originX:`start`,originY:`top`,overlayX:`start`,overlayY:`bottom`,panelClass:`mat-mdc-select-panel-above`},{originX:`end`,originY:`top`,overlayX:`end`,overlayY:`bottom`,panelClass:`mat-mdc-select-panel-above`}];_scrollOptionIntoView(e){let t=this.options.toArray()[e];if(t){let i=this.panel.nativeElement,o=Tt(e,this.options,this.optionGroups),a=t._getHostElement();e===0&&o===1?i.scrollTop=0:i.scrollTop=It(a.offsetTop,a.offsetHeight,i.scrollTop,i.offsetHeight)}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0)}_getChangeEvent(e){return new ke$1(this,e)}_scrollStrategyFactory=u(pi);_panelOpen=!1;_compareWith=(e,t)=>e===t;_uid=this._idGenerator.getId(`mat-select-`);_triggerAriaLabelledBy=null;_previousControl;_destroy=new w;_errorStateTracker;stateChanges=new w;disableAutomaticLabeling=!0;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId(`mat-select-value-`);_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||``;get focused(){return this._focused||this._panelOpen}_focused=!1;controlType=`mat-select`;trigger;panel;_overlayDir;panelClass;disabled=!1;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e)}_disableRipple=C(!1);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties()}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??!1;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next()}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(Li.required)??!1}set required(e){this._required=e,this.stateChanges.next()}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e}_multiple=!1;disableOptionCentering=this._defaultOptions?.disableOptionCentering??!1;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection()}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e)}_value;ariaLabel=``;ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next()}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<`u`?this._defaultOptions.panelWidth:`auto`;canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??!1;optionSelectionChanges=jn(()=>{let e=this.options;return e?e.changes.pipe(st(e),et(()=>Xt$1(...e.map(t=>t.onSelectionChange)))):this._initialized.pipe(et(()=>this.optionSelectionChanges))});openedChange=new z;_openedStream=this.openedChange.pipe(re$3(e=>e),H(()=>{}));_closedStream=this.openedChange.pipe(re$3(e=>!e),H(()=>{}));selectionChange=new z;valueChange=new z;constructor(){let e=u(n0),t=u(kv,{optional:!0}),i=u(Ov,{optional:!0}),o=u(new ko(`tabindex`),{optional:!0}),a=u(av,{optional:!0}),p=u(Ef,{optional:!0,self:!0});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new If(e,p||this.ngControl,i,t,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=o==null?0:parseInt(o)||0,this._popoverLocation=a?.usePopover===!1?null:`inline`,this.id=this.id}ngOnInit(){this._selectionModel=new ry(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(at(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges())})}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(at(this._destroy)).subscribe(e=>{e.added.forEach(t=>t.select()),e.removed.forEach(t=>t.deselect())}),this.options.changes.pipe(st(null),at(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection()})}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),t=this.ngControl;if(e!==this._triggerAriaLabelledBy){let i=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?i.setAttribute(`aria-labelledby`,e):i.removeAttribute(`aria-labelledby`)}t&&(this._previousControl!==t.control&&(this._previousControl!==void 0&&t.disabled!==null&&t.disabled!==this.disabled&&(this.disabled=t.disabled),this._previousControl=t.control),this.updateErrorState())}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass))}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete()}toggle(){this.panelOpen?this.close():this.open()}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._panelOpen=!0,this._overlayDir.positionChange.pipe(xe$3(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled()}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!0)))}close(){this._panelOpen&&(this._panelOpen=!1,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?`rtl`:`ltr`),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!1)))}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{t(),clearTimeout(i),this._cleanupDetach=void 0};let e=this.panel.nativeElement,t=this._renderer.listen(e,`animationend`,o=>{o.animationName===`_mat-select-exit`&&(this._cleanupDetach?.(),this._detachOverlay())}),i=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay()},200);e.classList.add(`mat-select-panel-exit`)}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck()}writeValue(e){this._assignValue(e)}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next()}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return``;if(this._multiple){let e=this._selectionModel.selected.map(t=>t.viewValue);return this._isRtl()&&e.reverse(),e.join(`, `)}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState()}_isRtl(){return this._dir?this._dir.value===`rtl`:!1}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e))}_handleClosedKeydown(e){let t=e.keyCode,i=t===40||t===38||t===37||t===39,o=t===13||t===32,a=this._keyManager;if(!a.isTyping()&&o&&!Pn(e)||(this.multiple||e.altKey)&&i)e.preventDefault(),this.open();else if(!this.multiple){let p=this.selected;a.onKeydown(e);let l=this.selected;l&&p!==l&&this._liveAnnouncer.announce(l.viewValue,1e4)}}_handleOpenKeydown(e){let t=this._keyManager,i=e.keyCode,o=i===40||i===38,a=t.isTyping();if(o&&e.altKey)e.preventDefault(),this.close();else if(!a&&(i===13||i===32)&&t.activeItem&&!Pn(e))e.preventDefault(),t.activeItem._selectViaInteraction();else if(!a&&this._multiple&&i===65&&e.ctrlKey){e.preventDefault();let p=this.options.some(l=>!l.disabled&&!l.selected);this.options.forEach(l=>{l.disabled||(p?l.select():l.deselect())})}else{let p=t.activeItemIndex;t.onKeydown(e),this._multiple&&o&&e.shiftKey&&t.activeItem&&t.activeItemIndex!==p&&t.activeItem._selectViaInteraction()}}_handleOverlayKeydown(e){e.keyCode===27&&!Pn(e)&&(e.preventDefault(),this.close())}_onFocus(){this.disabled||(this._focused=!0,this.stateChanges.next())}_onBlur(){this._focused=!1,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next())}get empty(){return!this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next()})}_setSelectionByValue(e){if(this.options.forEach(t=>t.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)e.forEach(t=>this._selectOptionByValue(t)),this._sortValues();else{let t=this._selectOptionByValue(e);t?this._keyManager.updateActiveItem(t):this.panelOpen||this._keyManager.updateActiveItem(-1)}this._changeDetectorRef.markForCheck()}_selectOptionByValue(e){let t=this.options.find(i=>{if(this._selectionModel.isSelected(i))return!1;try{return(i.value!=null||this.canSelectNullableOptions)&&this._compareWith(i.value,e)}catch{return!1}});return t&&this._selectionModel.select(t),t}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,!0):!1}_skipPredicate=e=>this.panelOpen?!1:e.disabled;_getOverlayWidth(e){return this.panelWidth===`auto`?(e instanceof ov?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?``:this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck()}_initKeyManager(){this._keyManager=new Ug(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?`rtl`:`ltr`).withHomeAndEnd().withPageUpDown().withAllowedModifierKeys([`shiftKey`]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close())}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction()})}_resetOptions(){let e=Xt$1(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(at(e)).subscribe(t=>{this._onSelect(t.source,t.isUserInput),t.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus())}),Xt$1(...this.options.map(t=>t._stateChanges)).pipe(at(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next()})}_onSelect(e,t){let i=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(i!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),t&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),t&&this.focus())),i!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next()}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((t,i)=>this.sortComparator?this.sortComparator(t,i,e):e.indexOf(t)-e.indexOf(i)),this.stateChanges.next()}}_propagateChanges(e){let t;this.multiple?t=this.selected.map(i=>i.value):t=this.selected?this.selected.value:e,this._value=t,this.valueChange.emit(t),this._onChange(t),this.selectionChange.emit(this._getChangeEvent(t)),this._changeDetectorRef.markForCheck()}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let t=0;t<this.options.length;t++)if(!this.options.get(t).disabled){e=t;break}this._keyManager.setActiveItem(e)}else this._keyManager.setActiveItem(this._selectionModel.selected[0])}_canOpen(){return!this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e)}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,t=e?e+` `:``;return this.ariaLabelledby?t+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||``;return this.ariaLabelledby&&(e+=` `+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute(`aria-describedby`)?.split(` `)||[]}setDescribedByIds(e){let t=this._elementRef.nativeElement;e.length?t.setAttribute(`aria-describedby`,e.join(` `)):t.removeAttribute(`aria-describedby`)}onContainerClick(e){let t=St(e);t&&(t.tagName===`MAT-OPTION`||t.classList.contains(`cdk-overlay-backdrop`)||t.closest(`.mat-mdc-select-panel`))||(this.focus(),this.open())}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static ɵfac=function(t){return new(t||n)};static ɵcmp=X$1({type:n,selectors:[[`mat-select`]],contentQueries:function(t,i,o){if(t&1&&un(o,hi,5)(o,ce$2,5)(o,le$2,5),t&2){let a;oe$3(a=se$3())&&(i.customTrigger=a.first),oe$3(a=se$3())&&(i.options=a),oe$3(a=se$3())&&(i.optionGroups=a)}},viewQuery:function(t,i){if(t&1&&Nt(ii,5)(ni,5)(xF,5),t&2){let o;oe$3(o=se$3())&&(i.trigger=o.first),oe$3(o=se$3())&&(i.panel=o.first),oe$3(o=se$3())&&(i._overlayDir=o.first)}},hostAttrs:[`role`,`combobox`,`aria-haspopup`,`listbox`,1,`mat-mdc-select`],hostVars:21,hostBindings:function(t,i){t&1&&Fe$2(`keydown`,function(a){return i._handleKeydown(a)})(`focus`,function(){return i._onFocus()})(`blur`,function(){return i._onBlur()}),t&2&&(ie$2(`id`,i.id)(`tabindex`,i.disabled?-1:i.tabIndex)(`aria-controls`,i.panelOpen?i.id+`-panel`:null)(`aria-expanded`,i.panelOpen)(`aria-label`,i.ariaLabel||null)(`aria-required`,i.required.toString())(`aria-disabled`,i.disabled.toString())(`aria-invalid`,i.errorState)(`aria-activedescendant`,i._getAriaActiveDescendant()),J(`mat-mdc-select-disabled`,i.disabled)(`mat-mdc-select-invalid`,i.errorState)(`mat-mdc-select-required`,i.required)(`mat-mdc-select-empty`,i.empty)(`mat-mdc-select-multiple`,i.multiple)(`mat-select-open`,i.panelOpen))},inputs:{userAriaDescribedBy:[0,`aria-describedby`,`userAriaDescribedBy`],panelClass:`panelClass`,disabled:[2,`disabled`,`disabled`,te$2],disableRipple:[2,`disableRipple`,`disableRipple`,te$2],tabIndex:[2,`tabIndex`,`tabIndex`,e=>e==null?0:Oo(e)],hideSingleSelectionIndicator:[2,`hideSingleSelectionIndicator`,`hideSingleSelectionIndicator`,te$2],placeholder:`placeholder`,required:[2,`required`,`required`,te$2],multiple:[2,`multiple`,`multiple`,te$2],disableOptionCentering:[2,`disableOptionCentering`,`disableOptionCentering`,te$2],compareWith:`compareWith`,value:`value`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],errorStateMatcher:`errorStateMatcher`,typeaheadDebounceInterval:[2,`typeaheadDebounceInterval`,`typeaheadDebounceInterval`,Oo],sortComparator:`sortComparator`,id:`id`,panelWidth:`panelWidth`,canSelectNullableOptions:[2,`canSelectNullableOptions`,`canSelectNullableOptions`,te$2]},outputs:{openedChange:`openedChange`,_openedStream:`opened`,_closedStream:`closed`,selectionChange:`selectionChange`,valueChange:`valueChange`},exportAs:[`matSelect`],features:[Le$1([{provide:yv,useExisting:n},{provide:re$2,useExisting:n}]),Be$1],ngContentSelectors:ai,decls:11,vars:10,consts:[[`fallbackOverlayOrigin`,`cdkOverlayOrigin`,`trigger`,``],[`panel`,``],[`cdk-overlay-origin`,``,1,`mat-mdc-select-trigger`,3,`click`],[1,`mat-mdc-select-value`],[1,`mat-mdc-select-placeholder`,`mat-mdc-select-min-line`],[1,`mat-mdc-select-value-text`],[1,`mat-mdc-select-arrow-wrapper`],[1,`mat-mdc-select-arrow`],[`viewBox`,`0 0 24 24`,`width`,`24px`,`height`,`24px`,`focusable`,`false`,`aria-hidden`,`true`],[`d`,`M7 10l5 5 5-5z`],[`cdk-connected-overlay`,``,`cdkConnectedOverlayHasBackdrop`,``,`cdkConnectedOverlayBackdropClass`,`cdk-overlay-transparent-backdrop`,3,`detach`,`backdropClick`,`overlayKeydown`,`cdkConnectedOverlayDisableClose`,`cdkConnectedOverlayPanelClass`,`cdkConnectedOverlayScrollStrategy`,`cdkConnectedOverlayOrigin`,`cdkConnectedOverlayPositions`,`cdkConnectedOverlayWidth`,`cdkConnectedOverlayFlexibleDimensions`,`cdkConnectedOverlayUsePopover`],[1,`mat-mdc-select-min-line`],[`role`,`listbox`,`tabindex`,`-1`,1,`mat-mdc-select-panel`,`mdc-menu-surface`,`mdc-menu-surface--open`,3,`keydown`]],template:function(t,i){if(t&1&&(Ge$1(oi),ue$2(0,`div`,2,0),Fe$2(`click`,function(){return i.open()}),ue$2(3,`div`,3),Me$2(4,si,2,1,`span`,4)(5,ci,3,1,`span`,5),ve$3(),ue$2(6,`div`,6)(7,`div`,7),Ei(),ue$2(8,`svg`,8),rt(9,`path`,9),ve$3()()()(),Ot(10,di,3,16,`ng-template`,10),Fe$2(`detach`,function(){return i.close()})(`backdropClick`,function(){return i.close()})(`overlayKeydown`,function(a){return i._handleOverlayKeydown(a)})),t&2){let o=xr(1);le$4(3),ie$2(`id`,i._valueId),le$4(),Te$1(i.empty?4:5),le$4(6),yt$1(`cdkConnectedOverlayDisableClose`,!0)(`cdkConnectedOverlayPanelClass`,i._overlayPanelClass)(`cdkConnectedOverlayScrollStrategy`,i._scrollStrategy)(`cdkConnectedOverlayOrigin`,i._preferredOverlayOrigin||o)(`cdkConnectedOverlayPositions`,i._positions)(`cdkConnectedOverlayWidth`,i._overlayWidth)(`cdkConnectedOverlayFlexibleDimensions`,!0)(`cdkConnectedOverlayUsePopover`,i._popoverLocation)}},dependencies:[ov,xF],styles:[`@keyframes _mat-select-enter {
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
`],encapsulation:2})}return n})();var mo=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[qr,De$1,we$1,fc,bv,De$1]})}return n})();var ae$1=()=>[];var re$1=(t,n)=>n.name;function le$1(t,n){t&1&&(ue$2(0,`div`,4),kp(1,`Loading workspace options…`),ve$3(),rt(2,`mat-progress-bar`,5))}function ce$1(t,n){if(t&1&&(ue$2(0,`div`,6),kp(1),ve$3()),t&2){let e=Ke$1(2);le$4(),Td(e.errorMessage())}}function se$1(t,n){if(t&1&&(ue$2(0,`mat-option`,9),kp(1),ve$3()),t&2){let e=n.$implicit;yt$1(`value`,e),le$4(),Td(e)}}function de(t,n){if(t&1&&(ue$2(0,`mat-option`,9),kp(1),ve$3()),t&2){let e=n.$implicit;yt$1(`value`,e.name),le$4(),Td(e.name)}}function me(t,n){t&1&&(ue$2(0,`p`,12),kp(1,`This checkout has uncommitted changes. They are not included; the selected committed branch is the source.`),ve$3())}function pe(t,n){t&1&&(ue$2(0,`p`,12),kp(1,`Changing to another branch can fail if the checkout is dirty or in use.`),ve$3())}function ge$1(t,n){if(t&1){let e=Rp();ue$2(0,`mat-form-field`,7)(1,`mat-label`),kp(2,`Workspace mode`),ve$3(),ue$2(3,`mat-select`,8),Fe$2(`selectionChange`,function(p){gr(e);return vr(Ke$1(2).selectedMode.set(p.value))}),ue$2(4,`mat-option`,10),kp(5,`Isolated worktree`),ve$3(),ue$2(6,`mat-option`,11),kp(7,`Project checkout`),ve$3()(),ue$2(8,`mat-hint`),kp(9),ve$3()(),ue$2(10,`mat-form-field`,7)(11,`mat-label`),kp(12,`Branch`),ve$3(),ue$2(13,`mat-select`,8),Fe$2(`selectionChange`,function(p){gr(e);return vr(Ke$1(2).selectedBranch.set(p.value))}),SA(14,de,2,2,`mat-option`,9,re$1),ve$3()(),Me$2(16,me,2,0,`p`,12),Me$2(17,pe,2,0,`p`,12)}if(t&2){let e=Ke$1(2);le$4(3),yt$1(`value`,e.selectedMode()),le$4(6),Td(e.selectedMode()===`managed_worktree`?`Gets its own Hub-managed branch and worktree.`:`Works directly in the real checkout, shared with other direct chats.`),le$4(4),yt$1(`value`,e.selectedBranch()),le$4(),wA(e.options()?.branches??rR(5,ae$1)),le$4(2),Te$1(e.options()?.dirty&&e.selectedMode()===`managed_worktree`?16:-1),le$4(),Te$1(e.selectedMode()===`project_checkout`?17:-1)}}function ue(t,n){if(t&1){let e=Rp();Me$2(0,ce$1,2,1,`div`,6),ue$2(1,`mat-form-field`,7)(2,`mat-label`),kp(3,`Agent`),ve$3(),ue$2(4,`mat-select`,8),Fe$2(`selectionChange`,function(p){gr(e);return vr(Ke$1().selectedAgent.set(p.value))}),SA(5,se$1,2,2,`mat-option`,9,bA),ve$3()(),Me$2(7,ge$1,18,6)}if(t&2){let e=Ke$1();Te$1(e.errorMessage()?0:-1),le$4(4),yt$1(`value`,e.selectedAgent()),le$4(),wA(e.state.agents()),le$4(2),Te$1(e.options()?.is_git?7:-1)}}function he(t,n){t&1&&kp(0,` Creating… `)}function _e(t,n){t&1&&kp(0,` Create chat `)}var N$1=class t{constructor(){this.state=u(gE);this.api=u(as);this.dialogRef=u(Ju);this.projectId=u(qF).projectId;this.options=C(null);this.selectedAgent=C(``);this.selectedMode=C(`managed_worktree`);this.selectedBranch=C(``);this.loading=C(!0);this.creating=C(!1);this.errorMessage=C(``);this.selectedAgent.set(this.state.agents()[0]??``),this.loadOptions()}async loadOptions(){try{let n=await this.api.fetchWorkspaceOptions(this.projectId);this.options.set(n);let e=n.branches.find(a=>a.current)?.name??n.branches[0]?.name??``;this.selectedBranch.set(e)}catch(n){this.errorMessage.set(this.message(n,`Failed to load workspace options.`))}finally{this.loading.set(!1)}}async create(){let n=this.options();if(!(!n||!this.selectedAgent()||this.creating()||n.is_git&&!this.selectedBranch())){this.creating.set(!0),this.errorMessage.set(``);try{let e=n.is_git?{mode:this.selectedMode(),branch:this.selectedBranch()}:void 0,a=await this.state.createChat(this.projectId,this.selectedAgent(),void 0,e);this.dialogRef.close(a)}catch(e){this.errorMessage.set(this.message(e,`Failed to create the chat.`))}finally{this.creating.set(!1)}}}message(n,e){return n instanceof Ur||n instanceof Error?n.message:e}static{this.ɵfac=function(e){return new(e||t)}}static{this.ɵcmp=X$1({type:t,selectors:[[`hub-new-chat-dialog`]],decls:11,vars:4,consts:[[`mat-dialog-title`,``],[`align`,`end`],[`mat-button`,``,`type`,`button`,3,`click`,`disabled`],[`mat-flat-button`,``,`type`,`button`,3,`click`,`disabled`],[`role`,`status`,1,`loading`],[`mode`,`indeterminate`,`aria-label`,`Loading workspace options`],[`role`,`alert`,1,`error-box`],[`appearance`,`outline`],[3,`selectionChange`,`value`],[3,`value`],[`value`,`managed_worktree`],[`value`,`project_checkout`],[`role`,`note`,1,`notice`]],template:function(e,a){e&1&&(ue$2(0,`h2`,0),kp(1,`New chat`),ve$3(),ue$2(2,`mat-dialog-content`),Me$2(3,le$1,3,0)(4,ue,8,3),ve$3(),ue$2(5,`mat-dialog-actions`,1)(6,`button`,2),Fe$2(`click`,function(){return a.dialogRef.close()}),kp(7,`Cancel`),ve$3(),ue$2(8,`button`,3),Fe$2(`click`,function(){return a.create()}),Me$2(9,he,1,0)(10,_e,1,0),ve$3()()),e&2&&(le$4(3),Te$1(a.loading()?3:4),le$4(3),yt$1(`disabled`,a.creating()),le$4(2),yt$1(`disabled`,a.loading()||a.creating()||!a.selectedAgent()||a.options()?.is_git&&!a.selectedBranch()),le$4(),Te$1(a.creating()?9:10))},dependencies:[EX,CX,fne,lne,une,dne,bv,ex,gv,vv,ae$2,ie$1,mo,po,ce$2],styles:[`mat-dialog-content[_ngcontent-%COMP%]{display:flex;min-width:min(430px,100vw - 48px);flex-direction:column;gap:12px}mat-form-field[_ngcontent-%COMP%]{width:100%}.loading[_ngcontent-%COMP%]{padding:18px 0 4px;color:var(--%NS%mat-sys-on-surface-variant)}.notice[_ngcontent-%COMP%], .error-box[_ngcontent-%COMP%]{padding:10px 12px;border-radius:var(--%NS%mat-sys-corner-medium);font:var(--%NS%mat-sys-body-small)}.notice[_ngcontent-%COMP%]{margin:0;background:var(--%NS%mat-sys-surface-container);color:var(--%NS%mat-sys-on-surface-variant)}.error-box[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}`]})}};function Ce(t,n){t&1&&rt(0,`mat-spinner`,1)}function fe(t,n){t&1&&(ue$2(0,`mat-icon`),kp(1,`add`),ve$3())}var te=class t{constructor(){this.projectId=Mi.required();this.creating=C(!1);this.router=u(si$1);this.dialog=u(VE)}open(){if(!this.projectId()||this.creating())return;this.dialog.open(N$1,{width:`min(480px, calc(100vw - 32px))`,data:{projectId:this.projectId()}}).afterClosed().subscribe(e=>{e&&this.router.navigate([`/projects`,this.projectId(),`chats`,e.id])})}static{this.ɵfac=function(e){return new(e||t)}}static{this.ɵcmp=X$1({type:t,selectors:[[`hub-new-chat-button`]],inputs:{projectId:[1,`projectId`]},decls:7,vars:2,consts:[[`mat-flat-button`,``,`type`,`button`,`aria-label`,`New chat: choose an agent`,1,`new-chat-trigger`,3,`click`,`disabled`],[`diameter`,`18`],[1,`new-chat-text`],[`iconPositionEnd`,``,1,`new-chat-caret`]],template:function(e,a){e&1&&(ue$2(0,`button`,0),Fe$2(`click`,function(){return a.open()}),Me$2(1,Ce,1,0,`mat-spinner`,1)(2,fe,2,0,`mat-icon`),ue$2(3,`span`,2),kp(4,`New chat`),ve$3(),ue$2(5,`mat-icon`,3),kp(6,`arrow_drop_down`),ve$3()()),e&2&&(yt$1(`disabled`,a.creating()),le$4(),Te$1(a.creating()?1:2))},dependencies:[EX,CX,fne,WX,$X,Ene,Dne],styles:[`[_nghost-%COMP%]{display:inline-flex;min-width:0}.new-chat-trigger[_ngcontent-%COMP%]{min-width:0;width:100%;padding-inline:16px 8px}.new-chat-text[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.new-chat-caret[_ngcontent-%COMP%]{margin-left:0;opacity:.85}.new-chat-trigger[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]{--%NS%mat-progress-spinner-active-indicator-color: currentColor}`]})}};var A=[`*`];var Se=[`content`];var ve=[[[`mat-drawer`],[`mat-sidenav`]],[[`mat-drawer-content`],[`mat-sidenav-content`]],`*`];var be=[`mat-drawer, mat-sidenav`,`mat-drawer-content, mat-sidenav-content`,`*`];function ke(r,I){if(r&1){let e=Rp();ue$2(0,`div`,1),Fe$2(`click`,function(){gr(e);return vr(Ke$1()._onBackdropClicked())}),ve$3()}if(r&2)J(`mat-drawer-shown`,Ke$1()._isShowingBackdrop())}function xe(r,I){r&1&&(ue$2(0,`mat-drawer-content`),ee$2(1,2),ve$3())}function De(r,I){if(r&1){let e=Rp();ue$2(0,`div`,1),Fe$2(`click`,function(){gr(e);return vr(Ke$1()._onBackdropClicked())}),ve$3()}if(r&2)J(`mat-drawer-shown`,Ke$1()._isShowingBackdrop())}function Me(r,I){r&1&&(ue$2(0,`mat-sidenav-content`),ee$2(1,2),ve$3())}var Ne=`.mat-drawer-container {
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
`;var Ee=new g(`MAT_DRAWER_DEFAULT_AUTOSIZE`,{providedIn:`root`,factory:()=>!1});var ee$1=new g(`MAT_DRAWER_CONTAINER`);var D=(()=>{class r extends ev{_platform=u(fe$2);_changeDetectorRef=u(Qe$1);_element=u(N$2);_ngZone=u(I);_isInert=!1;_container=u(Y);ngAfterContentInit(){this._container._contentMarginChanges.subscribe(()=>this._changeDetectorRef.markForCheck())}_drawerToggled(e){e.opened?this._ngZone.runOutsideAngular(()=>{e._animationEnd.pipe(O0(50),xe$3(1)).subscribe(()=>this._updateInert())}):this._updateInert()}_drawerModeChanged(){this._updateInert()}_updateInert(){let e=this._container._isShowingBackdrop();if(e!==this._isInert){let t=this._element.nativeElement;this._isInert=e,e?t.setAttribute(`inert`,`true`):t.removeAttribute(`inert`)}}_shouldBeHidden(){if(this._platform.isBrowser)return!1;let{start:e,end:t}=this._container;return e!=null&&e.mode!==`over`&&e.opened||t!=null&&t.mode!==`over`&&t.opened}static ɵfac=(()=>{let e;return function(n){return(e||(e=Pe(r)))(n||r)}})();static ɵcmp=X$1({type:r,selectors:[[`mat-drawer-content`]],hostAttrs:[1,`mat-drawer-content`],hostVars:6,hostBindings:function(t,n){t&2&&(Ir(`margin-left`,n._container._contentMargins.left,`px`)(`margin-right`,n._container._contentMargins.right,`px`),J(`mat-drawer-content-hidden`,n._shouldBeHidden()))},features:[Le$1([{provide:ev,useExisting:r}]),ae$3],ngContentSelectors:A,decls:1,vars:0,template:function(t,n){t&1&&(Ge$1(),ee$2(0))},encapsulation:2})}return r})();var X=(()=>{class r{_elementRef=u(N$2);_focusTrapFactory=u(Lg);_focusMonitor=u(ai$1);_platform=u(fe$2);_ngZone=u(I);_renderer=u(ge$4);_interactivityChecker=u(Mu);_doc=u(M);_isAnimating=!1;_container=u(ee$1,{optional:!0});_focusTrap=null;_elementFocusedBeforeDrawerWasOpened=null;_eventCleanups;_isAttached=!1;_anchor=null;get position(){return this._position}set position(e){e=e===`end`?`end`:`start`,e!==this._position&&(this._isAttached&&this._updatePositionInParent(e),this._position=e,this.onPositionChanged.emit())}_position=`start`;get mode(){return this._mode}set mode(e){this._mode=e,this._updateFocusTrapState(),this._modeChanged.next(),this._getContent()?._drawerModeChanged()}_mode=`over`;get disableClose(){return this._disableClose}set disableClose(e){this._disableClose=Ct(e)}_disableClose=!1;get autoFocus(){return this._autoFocus??(this.mode===`side`?`dialog`:`first-tabbable`)}set autoFocus(e){(e===`true`||e===`false`||e==null)&&(e=Ct(e)),this._autoFocus=e}_autoFocus;get opened(){return this._opened()}set opened(e){this.toggle(Ct(e))}_opened=C(!1);_openedVia=null;_animationStarted=new w;_animationEnd=new w;openedChange=new z(!0);_openedStream=this.openedChange.pipe(re$3(e=>e),H(()=>{}));openedStart=this._animationStarted.pipe(re$3(()=>this.opened),Bf(void 0));_closedStream=this.openedChange.pipe(re$3(e=>!e),H(()=>{}));closedStart=this._animationStarted.pipe(re$3(()=>!this.opened),Bf(void 0));_destroyed=new w;onPositionChanged=new z;_content;_modeChanged=new w;_injector=u(T);_changeDetectorRef=u(Qe$1);constructor(){this.openedChange.pipe(at(this._destroyed)).subscribe(e=>{e?(this._elementFocusedBeforeDrawerWasOpened=this._doc.activeElement,this._takeFocus()):this._isFocusWithinDrawer()&&this._restoreFocus(this._openedVia||`program`)}),this._eventCleanups=this._ngZone.runOutsideAngular(()=>{let e=this._renderer,t=this._elementRef.nativeElement;return[e.listen(t,`keydown`,n=>{n.keyCode===27&&!this.disableClose&&!Pn(n)&&this._ngZone.run(()=>{this.close(),n.stopPropagation(),n.preventDefault()})}),e.listen(t,`transitionend`,this._handleTransitionEvent),e.listen(t,`transitioncancel`,this._handleTransitionEvent)]}),this._animationEnd.subscribe(()=>{this.openedChange.emit(this.opened)})}_focusByCssSelector(e,t){let n=this._elementRef.nativeElement.querySelector(e);n&&(this._interactivityChecker.isFocusable(n)||(n.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let a=()=>{o(),ye(),n.removeAttribute(`tabindex`)},o=this._renderer.listen(n,`blur`,a),ye=this._renderer.listen(n,`mousedown`,a)})),n.focus(t))}_takeFocus(){if(!this._focusTrap)return;let e=this._elementRef.nativeElement;switch(this.autoFocus){case!1:case`dialog`:return;case!0:case`first-tabbable`:xt$1(()=>{let t=this._isAnimating?{preventScroll:!0}:void 0;!this._focusTrap.focusInitialElement(t)&&typeof e.focus==`function`&&e.focus(t)},{injector:this._injector});break;case`first-heading`:this._focusByCssSelector(`h1, h2, h3, h4, h5, h6, [role="heading"]`);break;default:this._focusByCssSelector(this.autoFocus);break}}_restoreFocus(e){this.autoFocus!==`dialog`&&(this._elementFocusedBeforeDrawerWasOpened?this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened,e):this._elementRef.nativeElement.blur(),this._elementFocusedBeforeDrawerWasOpened=null)}_isFocusWithinDrawer(){let e=this._doc.activeElement;return!!e&&this._elementRef.nativeElement.contains(e)}ngAfterViewInit(){this._isAttached=!0,this._position===`end`&&this._updatePositionInParent(`end`),this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._updateFocusTrapState())}ngOnDestroy(){this._eventCleanups.forEach(e=>e()),this._focusTrap?.destroy(),this._anchor?.remove(),this._anchor=null,this._animationStarted.complete(),this._animationEnd.complete(),this._modeChanged.complete(),this._destroyed.next(),this._destroyed.complete()}open(e){return this.toggle(!0,e)}close(){return this.toggle(!1)}_closeViaBackdropClick(){return this._setOpen(!1,!0,`mouse`)}toggle(e=!this.opened,t){e&&t&&(this._openedVia=t);let n=this._setOpen(e,!e&&this._isFocusWithinDrawer(),this._openedVia||`program`);return e||(this._openedVia=null),n}_setOpen(e,t,n){return e===this.opened?Promise.resolve(e?`open`:`close`):(this._opened.set(e),this._getContent()?._drawerToggled(this),this._container?._transitionsEnabled?this._isAnimating?(this._setIsAnimating(!1),this._simulateAnimation()):(this._setIsAnimating(!0),setTimeout(()=>this._animationStarted.next())):this._simulateAnimation(),this._elementRef.nativeElement.classList.toggle(`mat-drawer-opened`,e),!e&&t&&this._restoreFocus(n),this._changeDetectorRef.markForCheck(),this._updateFocusTrapState(),new Promise(a=>{this.openedChange.pipe(xe$3(1)).subscribe(o=>a(o?`open`:`close`))}))}_getContent(){return this._container?._content||this._container?._userContent}_setIsAnimating(e){e!==this._isAnimating&&(this._isAnimating=e,this._elementRef.nativeElement.classList.toggle(`mat-drawer-animating`,e))}_simulateAnimation(){setTimeout(()=>{this._animationStarted.next(),this._animationEnd.next()})}_getWidth(){return this._elementRef.nativeElement.offsetWidth||0}_updateFocusTrapState(){this._focusTrap&&(this._focusTrap.enabled=this.opened&&!!this._container?._isShowingBackdrop())}_updatePositionInParent(e){if(!this._platform.isBrowser)return;let t=this._elementRef.nativeElement,n=t.parentNode;e===`end`?(this._anchor||(this._anchor=this._doc.createComment(`mat-drawer-anchor`),n.insertBefore(this._anchor,t)),n.appendChild(t)):this._anchor&&this._anchor.parentNode.insertBefore(t,this._anchor)}_handleTransitionEvent=e=>{let t=this._elementRef.nativeElement;e.target===t&&this._ngZone.run(()=>{e.type===`transitionend`&&this._setIsAnimating(!1),this._animationEnd.next(e)})};static ɵfac=function(t){return new(t||r)};static ɵcmp=X$1({type:r,selectors:[[`mat-drawer`]],viewQuery:function(t,n){if(t&1&&Nt(Se,5),t&2){let a;oe$3(a=se$3())&&(n._content=a.first)}},hostAttrs:[1,`mat-drawer`],hostVars:12,hostBindings:function(t,n){t&2&&(ie$2(`align`,null)(`tabIndex`,n.mode!==`side`?`-1`:null),Ir(`visibility`,!n._container&&!n.opened?`hidden`:null),J(`mat-drawer-end`,n.position===`end`)(`mat-drawer-over`,n.mode===`over`)(`mat-drawer-push`,n.mode===`push`)(`mat-drawer-side`,n.mode===`side`))},inputs:{position:`position`,mode:`mode`,disableClose:`disableClose`,autoFocus:`autoFocus`,opened:`opened`},outputs:{openedChange:`openedChange`,_openedStream:`opened`,openedStart:`openedStart`,_closedStream:`closed`,closedStart:`closedStart`,onPositionChanged:`positionChanged`},exportAs:[`matDrawer`],ngContentSelectors:A,decls:3,vars:0,consts:[[`content`,``],[`cdkScrollable`,``,1,`mat-drawer-inner-container`]],template:function(t,n){t&1&&(Ge$1(),ue$2(0,`div`,1,0),ee$2(2),ve$3())},dependencies:[ev],encapsulation:2})}return r})();var Y=(()=>{class r{_dir=u(jt$1,{optional:!0});_element=u(N$2);_ngZone=u(I);_changeDetectorRef=u(Qe$1);_animationDisabled=Je$2();_transitionsEnabled=!1;_allDrawers;_drawers=new Zn;_content;_userContent;get start(){return this._start}get end(){return this._end}get autosize(){return this._autosize}set autosize(e){this._autosize=Ct(e)}_autosize=u(Ee);get hasBackdrop(){return this._drawerHasBackdrop(this._start)||this._drawerHasBackdrop(this._end)}set hasBackdrop(e){this._backdropOverride=e==null?null:Ct(e)}_backdropOverride=null;backdropClick=new z;_start=null;_end=null;_left=null;_right=null;_destroyed=new w;_doCheckSubject=new w;_contentMargins={left:null,right:null};_contentMarginChanges=new w;get scrollable(){return this._userContent||this._content}_injector=u(T);constructor(){let e=u(fe$2),t=u($r);this._dir?.change.pipe(at(this._destroyed)).subscribe(()=>{this._validateDrawers(),this.updateContentMargins()}),t.change().pipe(at(this._destroyed)).subscribe(()=>this.updateContentMargins()),!this._animationDisabled&&e.isBrowser&&this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._element.nativeElement.classList.add(`mat-drawer-transition`),this._transitionsEnabled=!0},200)})}ngAfterContentInit(){this._allDrawers.changes.pipe(st(this._allDrawers),at(this._destroyed)).subscribe(e=>{this._drawers.reset(e.filter(t=>!t._container||t._container===this)),this._drawers.notifyOnChanges()}),this._drawers.changes.pipe(st(null)).subscribe(()=>{this._validateDrawers(),this._drawers.forEach(e=>{this._watchDrawerToggle(e),this._watchDrawerPosition(e),this._watchDrawerMode(e)}),(!this._drawers.length||this._isDrawerOpen(this._start)||this._isDrawerOpen(this._end))&&this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),this._ngZone.runOutsideAngular(()=>{this._doCheckSubject.pipe(Yi(10),at(this._destroyed)).subscribe(()=>this.updateContentMargins())})}ngOnDestroy(){this._contentMarginChanges.complete(),this._doCheckSubject.complete(),this._drawers.destroy(),this._destroyed.next(),this._destroyed.complete()}open(){this._drawers.forEach(e=>e.open())}close(){this._drawers.forEach(e=>e.close())}updateContentMargins(){let e=0,t=0;if(this._left&&this._left.opened){if(this._left.mode==`side`)e+=this._left._getWidth();else if(this._left.mode==`push`){let n=this._left._getWidth();e+=n,t-=n}}if(this._right&&this._right.opened){if(this._right.mode==`side`)t+=this._right._getWidth();else if(this._right.mode==`push`){let n=this._right._getWidth();t+=n,e-=n}}e=e||null,t=t||null,(e!==this._contentMargins.left||t!==this._contentMargins.right)&&(this._contentMargins={left:e,right:t},this._ngZone.run(()=>this._contentMarginChanges.next(this._contentMargins)))}ngDoCheck(){this._autosize&&this._isPushed()&&this._ngZone.runOutsideAngular(()=>this._doCheckSubject.next())}_watchDrawerToggle(e){e._animationStarted.pipe(at(this._drawers.changes)).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),e.mode!==`side`&&e.openedChange.pipe(at(this._drawers.changes)).subscribe(()=>this._setContainerClass(e.opened))}_watchDrawerPosition(e){e.onPositionChanged.pipe(at(this._drawers.changes)).subscribe(()=>{xt$1({read:()=>this._validateDrawers()},{injector:this._injector})})}_watchDrawerMode(e){e._modeChanged.pipe(at(Xt$1(this._drawers.changes,this._destroyed))).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()})}_setContainerClass(e){let t=this._element.nativeElement.classList,n=`mat-drawer-container-has-open`;e?t.add(n):t.remove(n)}_validateDrawers(){this._start=this._end=null,this._drawers.forEach(e=>{e.position==`end`?(this._end,this._end=e):(this._start,this._start=e)}),this._right=this._left=null,this._dir&&this._dir.value===`rtl`?(this._left=this._end,this._right=this._start):(this._left=this._start,this._right=this._end)}_isPushed(){return this._isDrawerOpen(this._start)&&this._start.mode!=`over`||this._isDrawerOpen(this._end)&&this._end.mode!=`over`}_onBackdropClicked(){this.backdropClick.emit(),this._closeModalDrawersViaBackdrop()}_closeModalDrawersViaBackdrop(){[this._start,this._end].filter(e=>e&&!e.disableClose&&this._drawerHasBackdrop(e)).forEach(e=>e._closeViaBackdropClick())}_isShowingBackdrop(){return this._isDrawerOpen(this._start)&&this._drawerHasBackdrop(this._start)||this._isDrawerOpen(this._end)&&this._drawerHasBackdrop(this._end)}_isDrawerOpen(e){return e!=null&&e.opened}_drawerHasBackdrop(e){return this._backdropOverride==null?!!e&&e.mode!==`side`:this._backdropOverride}static ɵfac=function(t){return new(t||r)};static ɵcmp=X$1({type:r,selectors:[[`mat-drawer-container`]],contentQueries:function(t,n,a){if(t&1&&un(a,D,5)(a,X,5),t&2){let o;oe$3(o=se$3())&&(n._content=o.first),oe$3(o=se$3())&&(n._allDrawers=o)}},viewQuery:function(t,n){if(t&1&&Nt(D,5),t&2){let a;oe$3(a=se$3())&&(n._userContent=a.first)}},hostAttrs:[1,`mat-drawer-container`],hostVars:2,hostBindings:function(t,n){t&2&&J(`mat-drawer-container-explicit-backdrop`,n._backdropOverride)},inputs:{autosize:`autosize`,hasBackdrop:`hasBackdrop`},outputs:{backdropClick:`backdropClick`},exportAs:[`matDrawerContainer`],features:[Le$1([{provide:ee$1,useExisting:r}])],ngContentSelectors:be,decls:4,vars:2,consts:[[1,`mat-drawer-backdrop`,3,`mat-drawer-shown`],[1,`mat-drawer-backdrop`,3,`click`]],template:function(t,n){t&1&&(Ge$1(ve),Me$2(0,ke,1,2,`div`,0),ee$2(1),ee$2(2,1),Me$2(3,xe,2,0,`mat-drawer-content`)),t&2&&(Te$1(n.hasBackdrop?0:-1),le$4(3),Te$1(n._content?-1:3))},dependencies:[D],styles:[`.mat-drawer-container {
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
`],encapsulation:2})}return r})();var ge=(()=>{class r extends D{static ɵfac=(()=>{let e;return function(n){return(e||(e=Pe(r)))(n||r)}})();static ɵcmp=X$1({type:r,selectors:[[`mat-sidenav-content`]],hostAttrs:[1,`mat-drawer-content`,`mat-sidenav-content`],features:[Le$1([{provide:ev,useExisting:r},{provide:D,useExisting:r}]),ae$3],ngContentSelectors:A,decls:1,vars:0,template:function(t,n){t&1&&(Ge$1(),ee$2(0))},encapsulation:2})}return r})();var Fe=(()=>{class r extends X{get fixedInViewport(){return this._fixedInViewport}set fixedInViewport(e){this._fixedInViewport=Ct(e)}_fixedInViewport=!1;get fixedTopGap(){return this._fixedTopGap}set fixedTopGap(e){this._fixedTopGap=Yt$2(e)}_fixedTopGap=0;get fixedBottomGap(){return this._fixedBottomGap}set fixedBottomGap(e){this._fixedBottomGap=Yt$2(e)}_fixedBottomGap=0;static ɵfac=(()=>{let e;return function(n){return(e||(e=Pe(r)))(n||r)}})();static ɵcmp=X$1({type:r,selectors:[[`mat-sidenav`]],hostAttrs:[1,`mat-drawer`,`mat-sidenav`],hostVars:16,hostBindings:function(t,n){t&2&&(ie$2(`tabIndex`,n.mode!==`side`?`-1`:null)(`align`,null),Ir(`top`,n.fixedInViewport?n.fixedTopGap:null,`px`)(`bottom`,n.fixedInViewport?n.fixedBottomGap:null,`px`),J(`mat-drawer-end`,n.position===`end`)(`mat-drawer-over`,n.mode===`over`)(`mat-drawer-push`,n.mode===`push`)(`mat-drawer-side`,n.mode===`side`)(`mat-sidenav-fixed`,n.fixedInViewport))},inputs:{fixedInViewport:`fixedInViewport`,fixedTopGap:`fixedTopGap`,fixedBottomGap:`fixedBottomGap`},exportAs:[`matSidenav`],features:[Le$1([{provide:X,useExisting:r}]),ae$3],ngContentSelectors:A,decls:3,vars:0,consts:[[`content`,``],[`cdkScrollable`,``,1,`mat-drawer-inner-container`]],template:function(t,n){t&1&&(Ge$1(),ue$2(0,`div`,1,0),ee$2(2),ve$3())},dependencies:[ev],encapsulation:2})}return r})();var $e=(()=>{class r extends Y{_allDrawers=void 0;_content=void 0;static ɵfac=(()=>{let e;return function(n){return(e||(e=Pe(r)))(n||r)}})();static ɵcmp=X$1({type:r,selectors:[[`mat-sidenav-container`]],contentQueries:function(t,n,a){if(t&1&&un(a,ge,5)(a,Fe,5),t&2){let o;oe$3(o=se$3())&&(n._content=o.first),oe$3(o=se$3())&&(n._allDrawers=o)}},hostAttrs:[1,`mat-drawer-container`,`mat-sidenav-container`],hostVars:2,hostBindings:function(t,n){t&2&&J(`mat-drawer-container-explicit-backdrop`,n._backdropOverride)},exportAs:[`matSidenavContainer`],features:[Le$1([{provide:ee$1,useExisting:r},{provide:Y,useExisting:r}]),ae$3],ngContentSelectors:be,decls:4,vars:2,consts:[[1,`mat-drawer-backdrop`,3,`mat-drawer-shown`],[1,`mat-drawer-backdrop`,3,`click`]],template:function(t,n){t&1&&(Ge$1(ve),Me$2(0,De,1,2,`div`,0),ee$2(1),ee$2(2,1),Me$2(3,Me,2,0,`mat-sidenav-content`)),t&2&&(Te$1(n.hasBackdrop?0:-1),le$4(3),Te$1(n._content?-1:3))},dependencies:[ge],styles:[Ne],encapsulation:2})}return r})();var Je=(()=>{class r{static ɵfac=function(t){return new(t||r)};static ɵmod=$({type:r});static ɵinj=U({imports:[fc,we$1,fc]})}return r})();var Yt=[`*`,[[`mat-toolbar-row`]]];var Kt=[`*`,`mat-toolbar-row`];var Zt=(()=>{class n{static ɵfac=function(a){return new(a||n)};static ɵdir=D$1({type:n,selectors:[[`mat-toolbar-row`]],hostAttrs:[1,`mat-toolbar-row`],exportAs:[`matToolbarRow`]})}return n})();var Ht=(()=>{class n{_elementRef=u(N$2);_platform=u(fe$2);_document=u(M);color;_toolbarRows;ngAfterViewInit(){this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe(()=>this._checkToolbarMixedModes()))}_checkToolbarMixedModes(){this._toolbarRows.length}static ɵfac=function(a){return new(a||n)};static ɵcmp=X$1({type:n,selectors:[[`mat-toolbar`]],contentQueries:function(a,i,k){if(a&1&&un(k,Zt,5),a&2){let $;oe$3($=se$3())&&(i._toolbarRows=$)}},hostAttrs:[1,`mat-toolbar`],hostVars:6,hostBindings:function(a,i){a&2&&(Jn(i.color?`mat-`+i.color:``),J(`mat-toolbar-multiple-rows`,i._toolbarRows.length>0)(`mat-toolbar-single-row`,i._toolbarRows.length===0))},inputs:{color:`color`},exportAs:[`matToolbar`],ngContentSelectors:Kt,decls:2,vars:0,template:function(a,i){a&1&&(Ge$1(Yt),ee$2(0),ee$2(1,1))},styles:[`.mat-toolbar {
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
`],encapsulation:2})}return n})();var qt=(()=>{class n{static ɵfac=function(a){return new(a||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[we$1]})}return n})();var zt=`pueblo-hub-theme`;var Wt=`agent-hub-theme`;var N=class n{constructor(){this.document=u(M);this.mode=C(this.readMode());dt(()=>{let e=this.mode();this.document.documentElement.dataset.theme=e,typeof localStorage<`u`&&localStorage.setItem(zt,e)})}cycle(){this.mode.set({system:`light`,light:`dark`,dark:`system`}[this.mode()])}icon(){return this.mode()===`dark`?`dark_mode`:this.mode()===`light`?`light_mode`:`brightness_auto`}label(){return this.mode()===`dark`?`Dark theme`:this.mode()===`light`?`Light theme`:`Use system theme`}readMode(){if(typeof localStorage>`u`)return`system`;let e=localStorage.getItem(zt)??localStorage.getItem(Wt);return e===`light`||e===`dark`||e===`system`?e:`system`}static{this.ɵfac=function(t){return new(t||n)}}static{this.ɵprov=b({token:n,factory:n.ɵfac})}};var P=class n{constructor(){this.state=u(gE)}tooltip(){let e=this.state.wsStatus();return e===`connected`?`The event stream is live.`:e===`connecting`?`The event stream is reconnecting.`:e===`error`?this.state.wsError()||`Durable event history could not be replayed.`:`The event stream is offline. Agent updates stop until it returns.`}ariaLabel(){let e=this.state.wsStatus()===`error`?`: ${this.tooltip()}`:``;return`Event stream ${this.state.wsStatus()}${e}`}static{this.ɵfac=function(t){return new(t||n)}}static{this.ɵcmp=X$1({type:n,selectors:[[`hub-connection-status`]],decls:4,vars:5,consts:[[`role`,`status`,1,`status-chip`,3,`matTooltip`],[1,`status-dot`],[1,`status-label`]],template:function(t,a){t&1&&(ue$2(0,`span`,0),rt(1,`span`,1),ue$2(2,`span`,2),kp(3),ve$3()()),t&2&&(Jn(a.state.wsStatus()),yt$1(`matTooltip`,a.tooltip()),ie$2(`aria-label`,a.ariaLabel()),le$4(3),Td(a.state.wsStatus()))},dependencies:[on,Gt],styles:[`[_nghost-%COMP%]{display:inline-flex;min-width:0}.status-chip[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:7px;height:28px;padding-inline:10px;border-radius:var(--%NS%mat-sys-corner-full);background:var(--%NS%mat-sys-surface-container-high);color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-medium);letter-spacing:var(--%NS%mat-sys-label-medium-tracking);text-transform:capitalize}.status-label[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.status-dot[_ngcontent-%COMP%]{flex:0 0 auto;width:8px;height:8px;border-radius:50%;background:currentColor}.status-chip.connected[_ngcontent-%COMP%]{color:var(--%NS%hub-status-running);background:var(--%NS%hub-status-running-container)}.status-chip.connecting[_ngcontent-%COMP%]{color:var(--%NS%hub-status-starting)}.status-chip.disconnected[_ngcontent-%COMP%], .status-chip.error[_ngcontent-%COMP%]{color:var(--%NS%hub-status-dead);background:var(--%NS%hub-status-dead-container)}`]})}};var ee=(n,e)=>[`/projects`,n,`chats`,e];var Qt=(n,e)=>e.id;function ne(n,e){if(n&1){let t=Rp();ue$2(0,`button`,32),Fe$2(`click`,function(){let i=gr(t).$implicit;return vr(Ke$1(2).openProject(i.id))}),ue$2(1,`mat-icon`),kp(2),ve$3(),ue$2(3,`span`),kp(4),ve$3()()}if(n&2){let t=e.$implicit,a=Ke$1();J(`current`,t.id===a.id),le$4(2),Td(t.id===a.id?`folder_open`:`folder`),le$4(2),Td(t.name)}}function ae(n,e){if(n&1&&rt(0,`hub-new-chat-button`,23),n&2)yt$1(`projectId`,Ke$1().id)}function oe(n,e){n&1&&(ue$2(0,`span`,39),kp(1,`Archived`),ve$3())}function ie(n,e){if(n&1){let t=Rp();ue$2(0,`a`,33),Fe$2(`click`,function(){gr(t);return vr(Ke$1(2).closeRequested.emit())}),ue$2(1,`span`,34),kp(2),ve$3(),ue$2(3,`span`,35)(4,`span`,36)(5,`span`,37),kp(6),ve$3(),rt(7,`hub-chat-status-badge`,38),Me$2(8,oe,2,0,`span`,39),ve$3()()()}if(n&2){let t=e.$implicit,a=Ke$1(2);yt$1(`routerLink`,sR(7,ee,t.project_id,t.id)),ie$2(`aria-label`,a.chatAriaLabel(t)),le$4(2),Td(t.title||`Untitled chat`),le$4(4),Td(a.agentLabel(t.agent)),le$4(),yt$1(`status`,a.activityFor(t))(`turnStartedAt`,a.turnStartedAtFor(t)),le$4(),Te$1(t.archived?8:-1)}}function re(n,e){if(n&1&&(ue$2(0,`p`,31),kp(1),ve$3()),n&2){let t=Ke$1(2);le$4(),Op(` `,t.state.showArchived()?`No archived chats.`:`No chats yet.`,` `)}}function se(n,e){if(n&1){let t=Rp();ue$2(0,`button`,12)(1,`span`,13)(2,`span`,14)(3,`mat-icon`),kp(4,`folder`),ve$3()(),ue$2(5,`span`,15)(6,`span`,16),kp(7),ve$3(),ue$2(8,`span`,17),kp(9),ve$3()(),ue$2(10,`mat-icon`,18),kp(11,`unfold_more`),ve$3()()(),ue$2(12,`mat-menu`,19,0)(14,`div`,20),kp(15,`Projects`),ve$3(),SA(16,ne,5,4,`button`,21,Qt),rt(18,`mat-divider`),ue$2(19,`button`,22),Fe$2(`click`,function(){gr(t);return vr(Ke$1().goHome())}),ue$2(20,`mat-icon`),kp(21,`grid_view`),ve$3(),ue$2(22,`span`),kp(23,`All projects`),ve$3()(),ue$2(24,`button`,22),Fe$2(`click`,function(){gr(t);return vr(Ke$1().newProject())}),ue$2(25,`mat-icon`),kp(26,`create_new_folder`),ve$3(),ue$2(27,`span`),kp(28,`New project`),ve$3()()(),Me$2(29,ae,1,1,`hub-new-chat-button`,23),ue$2(30,`div`,24)(31,`span`,25),kp(32,`Chats`),ve$3(),ue$2(33,`span`,26),kp(34),ve$3(),rt(35,`span`,27),ue$2(36,`button`,28),Fe$2(`click`,function(){gr(t);let i=Ke$1();return vr(i.state.setShowArchived(!i.state.showArchived()))}),ue$2(37,`mat-icon`),kp(38,`inventory_2`),ve$3()()(),ue$2(39,`mat-nav-list`,29),SA(40,ie,9,10,`a`,30,Qt,!1,re,2,1,`p`,31),ve$3()}if(n&2){let t=e,a=xr(13),i=Ke$1();yt$1(`matMenuTriggerFor`,a),le$4(7),Td(t.name),le$4(),yt$1(`title`,t.path),le$4(),Td(t.path),le$4(3),yt$1(`overlapTrigger`,!1),le$4(4),wA(i.state.projects()),le$4(13),Te$1(i.showNewChat()?29:-1),le$4(5),Td(i.visibleChats().length),le$4(2),J(`on`,i.state.showArchived()),yt$1(`matTooltip`,i.state.showArchived()?`Hide archived chats`:`Show archived chats`),ie$2(`aria-pressed`,i.state.showArchived()),le$4(4),wA(i.visibleChats())}}var F=class n{constructor(){this.closeRequested=X5();this.state=u(gE);this.theme=u(N);this.dialog=u(VE);this.router=u(si$1);this.clock=u(oe$1);this.showNewChat=x(()=>this.state.activeChatId()!==null);this.visibleChats=x(()=>{let e=this.state.activeProjectId(),t=e?this.state.chatsByProject()[e]??[]:[];return[...this.state.showArchived()?t:t.filter(a=>!a.archived)].sort(ju)})}agentLabel(e){let t=e??``;return t&&t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()}activityFor(e){return this.state.chatActivity(e.id)}chatAriaLabel(e){return`Open chat ${e.title||`Untitled chat`}, ${qX(this.activityFor(e),this.state.chatTurnStartedAt(e.id),this.clock.now())}`}turnStartedAtFor(e){return this.state.chatTurnStartedAt(e.id)}async openProject(e){if(e===this.state.activeProjectId()){this.closeRequested.emit();return}let t=this.state.activeChatId()?await this.latestVisibleChat(e):null;this.router.navigate(t?[`/projects`,e,`chats`,t.id]:[`/projects`,e]),this.closeRequested.emit()}async latestVisibleChat(e){let t=this.state.chatsByProject()[e];return t||(await this.state.loadChats(e),t=this.state.chatsByProject()[e]),t?[...this.state.showArchived()?t:t.filter(i=>!i.archived)].sort(ju)[0]??null:null}goHome(){this.router.navigate([`/`]),this.closeRequested.emit()}newProject(){this.dialog.open(we,{width:`min(720px, calc(100vw - 32px))`,panelClass:`hub-wide-dialog`}),this.closeRequested.emit()}static{this.ɵfac=function(t){return new(t||n)}}static{this.ɵcmp=X$1({type:n,selectors:[[`hub-navigation`]],outputs:{closeRequested:`closeRequested`},decls:21,vars:4,consts:[[`projectMenu`,`matMenu`],[1,`drawer-header`],[`routerLink`,`/`,`aria-label`,`Pueblo Hub home`,1,`brand`,3,`click`],[1,`brand-mark`],[1,`brand-name`],[1,`header-spacer`],[`mat-icon-button`,``,`matTooltip`,`Close navigation`,`aria-label`,`Close navigation`,1,`drawer-close`,3,`click`],[1,`drawer-body`],[1,`drawer-footer`],[1,`footer-spacer`],[1,`version`],[`mat-icon-button`,``,3,`click`,`matTooltip`],[`mat-button`,``,`type`,`button`,`aria-label`,`Switch project`,1,`project-switcher`,3,`matMenuTriggerFor`],[1,`project-switcher-content`],[1,`switcher-icon`],[1,`switcher-text`],[1,`switcher-name`],[1,`switcher-path`,3,`title`],[`iconPositionEnd`,``,1,`switcher-caret`],[1,`hub-project-menu`,3,`overlapTrigger`],[`role`,`presentation`,1,`menu-heading`],[`mat-menu-item`,``,`type`,`button`,1,`project-menu-item`,3,`current`],[`mat-menu-item`,``,`type`,`button`,3,`click`],[1,`drawer-new-chat`,3,`projectId`],[1,`list-subheader`],[`id`,`chats-heading`],[1,`count`],[1,`subheader-spacer`],[`mat-icon-button`,``,`aria-label`,`Show archived chats`,1,`archive-toggle`,3,`click`,`matTooltip`],[`aria-labelledby`,`chats-heading`],[`mat-list-item`,``,`lines`,`2`,`routerLinkActive`,`selected`,3,`routerLink`],[1,`drawer-empty`],[`mat-menu-item`,``,`type`,`button`,1,`project-menu-item`,3,`click`],[`mat-list-item`,``,`lines`,`2`,`routerLinkActive`,`selected`,3,`click`,`routerLink`],[`matListItemTitle`,``,1,`chat-title`],[`matListItemLine`,``,1,`chat-meta-line`],[1,`chat-meta`],[1,`agent-badge`],[3,`status`,`turnStartedAt`],[1,`archived-tag`]],template:function(t,a){if(t&1&&(ue$2(0,`header`,1)(1,`a`,2),Fe$2(`click`,function(){return a.closeRequested.emit()}),ue$2(2,`span`,3)(3,`mat-icon`),kp(4,`hub`),ve$3()(),ue$2(5,`span`,4),kp(6,`Pueblo Hub`),ve$3()(),rt(7,`span`,5),ue$2(8,`button`,6),Fe$2(`click`,function(){return a.closeRequested.emit()}),ue$2(9,`mat-icon`),kp(10,`close`),ve$3()()(),ue$2(11,`div`,7),Me$2(12,se,43,12),ve$3(),ue$2(13,`footer`,8),rt(14,`hub-connection-status`)(15,`span`,9),ue$2(16,`span`,10),kp(17,`v0.2.0`),ve$3(),ue$2(18,`button`,11),Fe$2(`click`,function(){return a.theme.cycle()}),ue$2(19,`mat-icon`),kp(20),ve$3()()()),t&2){let i;le$4(12),Te$1((i=a.state.activeProject())?12:-1,i),le$4(6),yt$1(`matTooltip`,a.theme.label()),ie$2(`aria-label`,a.theme.label()),le$4(2),Td(a.theme.icon())}},dependencies:[kt,P,EX,CX,tF,fne,i0,Q1,WX,$X,koe,Roe,Aoe,sj,oj,wte,Ku,lv,Ste,on,Gt,te,wu,gP],styles:[`[_nghost-%COMP%]{display:flex;flex-direction:column;height:100%;background:var(--%NS%mat-sys-surface-container-low)}.drawer-header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px;height:64px;padding:0 8px 0 16px}.brand[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:12px;min-width:0;height:48px;padding:0 18px 0 10px;margin-left:-10px;border-radius:var(--%NS%mat-sys-corner-full);color:var(--%NS%mat-sys-on-surface);text-decoration:none;transition:background .12s ease}.brand[_ngcontent-%COMP%]:hover{background:var(--%NS%mat-sys-surface-container-high)}.brand[_ngcontent-%COMP%]:focus-visible{outline:3px solid var(--%NS%mat-sys-secondary);outline-offset:1px}.header-spacer[_ngcontent-%COMP%]{flex:1}.brand-mark[_ngcontent-%COMP%]{display:grid;place-items:center;flex:0 0 auto;width:36px;height:36px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container)}.brand-mark[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:20px;height:20px;font-size:20px}.brand-name[_ngcontent-%COMP%]{overflow:hidden;font:var(--%NS%mat-sys-title-medium);letter-spacing:var(--%NS%mat-sys-title-medium-tracking);text-overflow:ellipsis;white-space:nowrap}.drawer-close[_ngcontent-%COMP%]{flex:0 0 auto}.drawer-body[_ngcontent-%COMP%]{flex:1;min-height:0;overflow:auto;padding:0 12px 16px}.project-switcher[_ngcontent-%COMP%]{--%NS%mat-button-text-label-text-color: var(--%NS%mat-sys-on-surface);--%NS%mat-button-text-icon-color: var(--%NS%mat-sys-on-surface-variant);display:flex;width:100%;height:56px;padding:0 8px 0 12px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-surface-container);text-align:left}.project-switcher-content[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;width:calc(min(304px,86vw) - 44px);max-width:100%;min-width:0}.switcher-icon[_ngcontent-%COMP%]{display:grid;place-items:center;flex:0 0 auto;width:32px;height:32px;border-radius:var(--%NS%mat-sys-corner-small);background:var(--%NS%mat-sys-surface-container-highest);color:var(--%NS%mat-sys-on-surface-variant)}.switcher-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:18px;height:18px;font-size:18px}.switcher-text[_ngcontent-%COMP%]{display:flex;flex-direction:column;min-width:0;flex:1;gap:1px}.switcher-name[_ngcontent-%COMP%]{overflow:hidden;font:var(--%NS%mat-sys-title-small);letter-spacing:var(--%NS%mat-sys-title-small-tracking);text-overflow:ellipsis;white-space:nowrap}.switcher-path[_ngcontent-%COMP%]{overflow:hidden;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small);text-align:left;text-overflow:ellipsis;white-space:nowrap}.switcher-caret[_ngcontent-%COMP%]{flex:0 0 auto;width:20px;height:20px;font-size:20px;color:var(--%NS%mat-sys-on-surface-variant)}.drawer-new-chat[_ngcontent-%COMP%]{display:flex;margin:16px 0 8px}.list-subheader[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;height:40px;padding-left:16px;margin-top:8px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-title-small);letter-spacing:var(--%NS%mat-sys-title-small-tracking)}.list-subheader[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%]{padding:1px 8px;border-radius:var(--%NS%mat-sys-corner-full);background:var(--%NS%mat-sys-surface-container-high);font:var(--%NS%mat-sys-label-small)}.subheader-spacer[_ngcontent-%COMP%]{flex:1}.archive-toggle[_ngcontent-%COMP%]{--%NS%mat-icon-button-icon-color: var(--%NS%mat-sys-on-surface-variant)}.archive-toggle[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:20px;height:20px;font-size:20px}.archive-toggle.on[_ngcontent-%COMP%]{--%NS%mat-icon-button-icon-color: var(--%NS%mat-sys-on-secondary-container);background:var(--%NS%mat-sys-secondary-container)}mat-nav-list[_ngcontent-%COMP%]{padding:0}mat-list-item[_ngcontent-%COMP%]{margin-bottom:2px;border-radius:var(--%NS%mat-sys-corner-full)}mat-list-item.selected[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container)}mat-list-item.selected[_ngcontent-%COMP%]   .chat-meta[_ngcontent-%COMP%]{color:inherit;opacity:.8}.chat-title[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chat-meta-line[_ngcontent-%COMP%]{overflow:hidden}.chat-meta[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:6px;vertical-align:middle}.agent-badge[_ngcontent-%COMP%]{display:inline-flex;align-items:center;padding:2px 8px;border-radius:var(--%NS%mat-sys-corner-full);background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);font:var(--%NS%mat-sys-label-small);text-transform:capitalize}.archived-tag[_ngcontent-%COMP%]{padding:2px 6px;border-radius:var(--%NS%mat-sys-corner-full);background:var(--%NS%mat-sys-surface-container-highest);color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small);text-transform:none}mat-list-item.selected[_ngcontent-%COMP%]   .agent-badge[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container-highest);color:var(--%NS%mat-sys-on-surface)}mat-list-item.selected[_ngcontent-%COMP%]   .archived-tag[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container-high);color:var(--%NS%mat-sys-on-surface)}.drawer-empty[_ngcontent-%COMP%]{padding:20px 16px;color:var(--%NS%mat-sys-on-surface-variant);text-align:center}.drawer-footer[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;height:56px;flex:0 0 auto;padding:0 8px 0 16px;border-top:1px solid var(--%NS%mat-sys-outline-variant)}.footer-spacer[_ngcontent-%COMP%]{flex:1}.version[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-medium);letter-spacing:var(--%NS%mat-sys-label-medium-tracking)}@media(min-width:840px){.drawer-close[_ngcontent-%COMP%]{display:none}}`]})}};function le(n,e){if(n&1){let t=Rp();ue$2(0,`mat-sidenav`,4),Fe$2(`openedChange`,function(i){gr(t);return vr(Ke$1().onDrawerChange(i))}),ue$2(1,`hub-navigation`,5),Fe$2(`closeRequested`,function(){gr(t);return vr(Ke$1().closeDrawer())}),ve$3()()}if(n&2){let t=Ke$1();yt$1(`mode`,t.compact()?`over`:`side`)(`opened`,!t.compact()||t.state.isMobileDrawerOpen())}}function ce(n,e){if(n&1){let t=Rp();ue$2(0,`mat-toolbar`,2)(1,`div`,6)(2,`a`,7)(3,`span`,8)(4,`mat-icon`),kp(5,`hub`),ve$3()(),ue$2(6,`span`,9),kp(7,`Pueblo Hub`),ve$3()(),rt(8,`span`,10)(9,`hub-connection-status`),ue$2(10,`button`,11),Fe$2(`click`,function(){gr(t);return vr(Ke$1().theme.cycle())}),ue$2(11,`mat-icon`),kp(12),ve$3()()()()}if(n&2){let t=Ke$1();le$4(10),yt$1(`matTooltip`,t.theme.label()),ie$2(`aria-label`,t.theme.label()),le$4(2),Td(t.theme.icon())}}fk(class n{constructor(){this.state=u(gE);this.theme=u(N);this.compact=C(!1);this.showDrawer=x(()=>this.state.activeChatId()!==null);this.breakpointObserver=u(Rg);this.destroyRef=u(ke$3);this.breakpointObserver.observe(`(max-width: 839px)`).pipe(Ti(this.destroyRef)).subscribe(({matches:e})=>{this.compact.set(e),e||this.state.setMobileDrawerOpen(!1)})}closeDrawer(){this.state.setMobileDrawerOpen(!1)}onDrawerChange(e){this.compact()&&this.state.setMobileDrawerOpen(e)}static{this.ɵfac=function(t){return new(t||n)}}static{this.ɵcmp=X$1({type:n,selectors:[[`hub-root`]],decls:6,vars:4,consts:[[1,`hub-shell`],[`aria-label`,`Project and chat navigation`,3,`mode`,`opened`],[1,`top-bar`],[1,`page-content`],[`aria-label`,`Project and chat navigation`,3,`openedChange`,`mode`,`opened`],[3,`closeRequested`],[1,`top-bar-inner`],[`routerLink`,`/`,`aria-label`,`Pueblo Hub home`,1,`brand`],[1,`brand-mark`],[1,`brand-name`],[1,`toolbar-spacer`],[`mat-icon-button`,``,3,`click`,`matTooltip`]],template:function(t,a){t&1&&(ue$2(0,`mat-sidenav-container`,0),Me$2(1,le,2,2,`mat-sidenav`,1),ue$2(2,`mat-sidenav-content`),Me$2(3,ce,13,3,`mat-toolbar`,2),ue$2(4,`main`,3),rt(5,`router-outlet`),ve$3()()()),t&2&&(J(`no-drawer`,!a.showDrawer()),le$4(),Te$1(a.showDrawer()?1:-1),le$4(2),Te$1(a.showDrawer()?-1:3))},dependencies:[P,EX,tF,WX,$X,Je,Fe,$e,ge,qt,Ht,on,Gt,F,wu,xg],styles:[`[_nghost-%COMP%]{display:block;height:100dvh}.hub-shell[_ngcontent-%COMP%]{height:100%;background:var(--%NS%mat-sys-surface)}mat-sidenav[_ngcontent-%COMP%]{width:304px;max-width:86vw}mat-sidenav.mat-drawer-side[_ngcontent-%COMP%]{--%NS%mat-sidenav-container-shape: 0;border-right:1px solid var(--%NS%mat-sys-outline-variant)}mat-sidenav.mat-drawer-over[_ngcontent-%COMP%]{--%NS%mat-sidenav-container-shape: 0 16px 16px 0;border-right:0}mat-sidenav-content[_ngcontent-%COMP%]{display:flex;height:100%;min-height:0;flex-direction:column}.top-bar[_ngcontent-%COMP%]{flex:0 0 auto;height:72px;padding:0;background:var(--%NS%mat-sys-surface)}.top-bar-inner[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;width:100%;max-width:var(--%NS%hub-page-max);margin:0 auto;padding-inline:var(--%NS%hub-page-gutter)}.brand[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:12px;min-width:0;height:48px;padding:0 18px 0 10px;margin-left:-10px;border-radius:var(--%NS%mat-sys-corner-full);color:var(--%NS%mat-sys-on-surface);text-decoration:none;transition:background .12s ease}.brand[_ngcontent-%COMP%]:hover{background:var(--%NS%mat-sys-surface-container-high)}.brand[_ngcontent-%COMP%]:focus-visible{outline:3px solid var(--%NS%mat-sys-secondary);outline-offset:1px}.brand-mark[_ngcontent-%COMP%]{display:grid;place-items:center;flex:0 0 auto;width:36px;height:36px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container)}.brand-mark[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:20px;height:20px;font-size:20px}.brand-name[_ngcontent-%COMP%]{overflow:hidden;font:var(--%NS%mat-sys-title-medium);letter-spacing:var(--%NS%mat-sys-title-medium-tracking);text-overflow:ellipsis;white-space:nowrap}.toolbar-spacer[_ngcontent-%COMP%]{flex:1}.page-content[_ngcontent-%COMP%]{display:flex;min-height:0;flex:1;flex-direction:column}`]})}},{providers:[lR(),Lk(),_P([{path:``,loadComponent:()=>import(`./chunk-CIWBi4qF.js`).then(n=>n.HomePageComponent),title:`Pueblo Hub`},{path:`projects/:projectId`,loadComponent:()=>import(`./chunk-Bfb8CUBI.js`).then(n=>n.ProjectPageComponent),title:`Project | Pueblo Hub`},{path:`projects/:projectId/chats/:chatId`,loadComponent:()=>import(`./chunk-CngkZiqg.js`).then(n=>n.ChatPageComponent),title:`Chat | Pueblo Hub`},{path:`**`,redirectTo:``}])]}).catch(n=>console.error(n));export{te as a,Ti as c,kt as d,mo as f,se$2 as g,we as h,Y as i,Zt$1 as l,po as m,Je as n,Gt as o,on as p,X as r,Ii as s,D as t,ce$2 as u};