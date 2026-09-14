import{$ as Mi$1,$t as _t,An as fne,Ar as se,B as Jn,Bn as i0,Br as uc,Bt as Wre,Cn as ex,Cr as rR,Ct as Sre,D as Gre,Dt as T,Er as rt,Et as Ste,F as Ir$1,Fr as st,G as Le,Gr as ve,Gt as YX,H as Ke,Hn as it,Hr as un,Ht as X1,I as It$1,Ir as tF,It as VE,Jn as ke,Jr as w$1,Kr as vr$1,Ln as ge,Lr as te,M as I,Mn as ft,Nn as g,O as H,On as ff,Or as s1,Ot as Td,Pn as gE,Q as Me,Qr as wte,Qt as _ie,R as J,Rn as gr$1,Rr as u,Rt as W,S as Fe,St as SA,Tn as fT,Tr as rre,U as Ku,Ur as une,Ut as X5,V as Ju,Vn as ie$1,Vr as ue$1,Vt as X,W as LN,Wr as ut,Wt as Xt$1,X as M,Xr as we,Xt as _A,Yn as ko$1,Yr as wA,Z as Md,Zn as kp,Zr as wie,_ as EX,_n as dt,_t as Rg,a as Be$1,ar as mT,b as Ene,bn as ee,br as qe$1,bt as Rw,c as C,ci as yt,cn as ax,ct as Ot$1,di as zr$1,dn as bie,dt as Pn,er as le$1,ft as Q,g as Dne,gn as dne,gr as p,gt as Re,hn as dn$1,ht as R1,ii as xe,ir as lv,j as Ha,jt as U,kt as Te,l as CX,lr as oe,m as DX,mn as ce,mr as ot,mt as Qe$1,n as $X,nn as ae,nr as lne,nt as Nd,oi as xr$1,or as mn$1,ot as Oo$1,p as D,pn as bv,pr as os,pt as Q1,qn as ka$1,rn as ai,rt as Nt,s as Bt$1,si as xt,st as Op,t as $,ti as x,tt as N,u as Cie,ui as z,ur as oi,vn as e0,vr as qF,w as Ge$1,wr as re,wt as Ss,xt as S,y as Ei$1,yn as eE,yt as Rp,z as Je,zn as gv,zr as u1,zt as WX}from"./chunk-U6N0htvI.js";import{c as Ti$1,d as kt,f as mo$1,i as Y,l as Zt$1,m as po$1,n as Je$1,o as Gt$1,p as on,r as X$1,s as Ii$1,t as D$1,u as ce$1}from"./main-VTLFQF4T.js";import{i as w$2,n as I$1,r as _,t as A}from"./chunk-BFmxLWl5.js";var na=[`*`];var Ci=(()=>{class n{labelPosition=`after`;static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[``,`mat-internal-form-field`,``]],hostAttrs:[1,`mdc-form-field`,`mat-internal-form-field`],hostVars:2,hostBindings:function(i,a){i&2&&J(`mdc-form-field--align-end`,a.labelPosition===`before`)},inputs:{labelPosition:`labelPosition`},ngContentSelectors:na,decls:1,vars:0,template:function(i,a){i&1&&(Ge$1(),ee(0))},styles:[`.mat-internal-form-field {
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
`],encapsulation:2})}return n})();var ia=[`switch`];var aa=[`*`];function oa(n,t){n&1&&(ue$1(0,`span`,11),Ei$1(),ue$1(1,`svg`,13),rt(2,`path`,14),ve(),ue$1(3,`svg`,15),rt(4,`path`,16),ve()())}var ra=new g(`mat-slide-toggle-default-options`,{providedIn:`root`,factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})});var Tt=class{source;checked;constructor(t,e){this.source=t,this.checked=e}};var tn=(()=>{class n{_elementRef=u(N);_focusMonitor=u(ai);_changeDetectorRef=u(Qe$1);defaults=u(ra);_onChange=e=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(e){return new Tt(this,e)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=Je();_focused=!1;name=null;id;labelPosition=`after`;ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(e){this._checked=e,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new z;toggleChange=new z;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){u(qe$1).load(os);let e=u(new ko$1(`tabindex`),{optional:!0}),i=this.defaults;this.tabIndex=e==null?0:parseInt(e)||0,this.color=i.color||`accent`,this.id=this._uniqueId=u(ot).getId(`mat-mdc-slide-toggle-`),this.hideIcon=i.hideIcon??!1,this.disabledInteractive=i.disabledInteractive??!1,this._labelId=this._uniqueId+`-label`}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(e=>{e===`keyboard`||e===`program`?(this._focused=!0,this._changeDetectorRef.markForCheck()):e||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(e){e.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(e){this.checked=!!e}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}validate(e){return this.required&&e.value!==!0?{required:!0}:null}registerOnValidatorChange(e){this._validatorOnChange=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new Tt(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`mat-slide-toggle`]],viewQuery:function(i,a){if(i&1&&Nt(ia,5),i&2){let o;oe(o=se())&&(a._switchElement=o.first)}},hostAttrs:[1,`mat-mdc-slide-toggle`],hostVars:15,hostBindings:function(i,a){i&2&&(dn$1(`id`,a.id),ie$1(`tabindex`,null)(`aria-label`,null)(`name`,null)(`aria-labelledby`,null),Jn(a.color?`mat-`+a.color:``),J(`mat-mdc-slide-toggle-focused`,a._focused)(`mat-mdc-slide-toggle-checked`,a.checked)(`mat-slide-toggle-full-width`,a.fullWidth)(`_mat-animation-noopable`,a._noopAnimations))},inputs:{name:`name`,id:`id`,labelPosition:`labelPosition`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],required:[2,`required`,`required`,te],color:`color`,disabled:[2,`disabled`,`disabled`,te],fullWidth:[2,`fullWidth`,`fullWidth`,te],disableRipple:[2,`disableRipple`,`disableRipple`,te],tabIndex:[2,`tabIndex`,`tabIndex`,e=>e==null?0:Oo$1(e)],checked:[2,`checked`,`checked`,te],hideIcon:[2,`hideIcon`,`hideIcon`,te],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,te]},outputs:{change:`change`,toggleChange:`toggleChange`},exportAs:[`matSlideToggle`],features:[Le([{provide:ff,useExisting:Bt$1(()=>n),multi:!0},{provide:Ss,useExisting:n,multi:!0}]),Be$1],ngContentSelectors:aa,decls:14,vars:27,consts:[[`switch`,``],[`mat-internal-form-field`,``,3,`labelPosition`],[`role`,`switch`,`type`,`button`,1,`mdc-switch`,3,`click`,`tabIndex`,`disabled`],[1,`mat-mdc-slide-toggle-touch-target`],[1,`mdc-switch__track`],[1,`mdc-switch__handle-track`],[1,`mdc-switch__handle`],[1,`mdc-switch__shadow`],[1,`mdc-elevation-overlay`],[1,`mdc-switch__ripple`],[`mat-ripple`,``,1,`mat-mdc-slide-toggle-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mdc-switch__icons`],[1,`mdc-label`,3,`click`,`for`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--on`],[`d`,`M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--off`],[`d`,`M20 13H4v-2h16v2z`]],template:function(i,a){if(i&1&&(Ge$1(),ue$1(0,`div`,1)(1,`button`,2,0),Fe(`click`,function(){return a._handleClick()}),rt(3,`div`,3)(4,`span`,4),ue$1(5,`span`,5)(6,`span`,6)(7,`span`,7),rt(8,`span`,8),ve(),ue$1(9,`span`,9),rt(10,`span`,10),ve(),Me(11,oa,5,0,`span`,11),ve()()(),ue$1(12,`label`,12),Fe(`click`,function(l){return l.stopPropagation()}),ee(13),ve()()),i&2){let o=xr$1(2);yt(`labelPosition`,a.labelPosition),le$1(),J(`mdc-switch--selected`,a.checked)(`mdc-switch--unselected`,!a.checked)(`mdc-switch--checked`,a.checked)(`mdc-switch--disabled`,a.disabled)(`mat-mdc-slide-toggle-disabled-interactive`,a.disabledInteractive),yt(`tabIndex`,a.disabled&&!a.disabledInteractive?-1:a.tabIndex)(`disabled`,a.disabled&&!a.disabledInteractive),ie$1(`id`,a.buttonId)(`name`,a.name)(`aria-label`,a.ariaLabel)(`aria-labelledby`,a._getAriaLabelledBy())(`aria-describedby`,a.ariaDescribedby)(`aria-required`,a.required||null)(`aria-checked`,a.checked)(`aria-disabled`,a.disabled&&a.disabledInteractive?`true`:null),le$1(9),yt(`matRippleTrigger`,o)(`matRippleDisabled`,a.disableRipple||a.disabled)(`matRippleCentered`,!0),le$1(),Te(a.hideIcon?-1:11),le$1(),yt(`for`,a.buttonId),ie$1(`id`,a._labelId)}},dependencies:[eE,Ci],styles:[`.mdc-switch {
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
`],encapsulation:2})}return n})();var wi=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[tn,we]})}return n})();var ca=()=>[];var da=(n,t)=>t.id;function pa(n,t){if(n&1&&(ue$1(0,`div`,2),kp(1),ve()),n&2){let e=Ke(2);le$1(),Td(e.errorMessage())}}function ma(n,t){if(n&1&&(ue$1(0,`div`)(1,`dt`),kp(2,`Starting commit`),ve(),ue$1(3,`dd`,15),kp(4),ve()()),n&2){let e=t;le$1(3),yt(`title`,e),le$1(),Td(e.slice(0,7))}}function ha(n,t){if(n&1&&(ue$1(0,`section`,11)(1,`h3`,12)(2,`mat-icon`,13),kp(3,`account_tree`),ve(),kp(4,` Workspace`),ve(),ue$1(5,`p`),kp(6),ve(),ue$1(7,`dl`,14)(8,`div`)(9,`dt`),kp(10,`Mode`),ve(),ue$1(11,`dd`),kp(12),ve()(),ue$1(13,`div`)(14,`dt`),kp(15,`Branch`),ve(),ue$1(16,`dd`),kp(17),ve()(),Me(18,ma,5,2,`div`),ve()(),rt(19,`mat-divider`)),n&2){let e,i=t;le$1(6),Td(i.mode===`managed_worktree`?`This chat runs in its own Pueblo Hub-managed Git worktree.`:`This chat works directly in the project's checkout.`),le$1(6),Td(i.mode===`managed_worktree`?`Isolated worktree`:`Project checkout`),le$1(5),Td(i.branch??`—`),le$1(),Te((e=i.base_commit)?18:-1,e)}}function ua(n,t){n&1&&(ue$1(0,`p`,10),kp(1,`No additional agent configuration options advertised.`),ve())}function ga(n,t){if(n&1&&(ue$1(0,`mat-option`,18),kp(1),ve()),n&2){let e=t.$implicit;yt(`value`,e.value),le$1(),Td(e.name)}}function fa(n,t){if(n&1&&(ue$1(0,`mat-optgroup`,17),SA(1,ga,2,2,`mat-option`,18,_A),ve()),n&2){let e=Ke().$implicit;yt(`label`,e.group),le$1(),wA(e.options)}}function _a(n,t){if(n&1&&(ue$1(0,`mat-option`,18),kp(1),ve()),n&2){let e=Ke().$implicit;yt(`value`,e.value),le$1(),Td(e.name)}}function ba(n,t){if(n&1&&Me(0,fa,3,1,`mat-optgroup`,17)(1,_a,2,2,`mat-option`,18),n&2){let e=t.$implicit;Te(Ke(5).isGroup(e)?0:1)}}function xa(n,t){if(n&1&&(ue$1(0,`p`),kp(1),ve()),n&2){let e=Ke(2).$implicit;le$1(),Td(e.description)}}function ya(n,t){if(n&1){let e=Rp();ue$1(0,`div`,3)(1,`mat-form-field`,4)(2,`mat-label`),kp(3),ve(),ue$1(4,`mat-select`,5),Fe(`selectionChange`,function(a){gr$1(e);let o=Ke().$implicit;return vr$1(Ke(3).changeOption(o,a.value))}),SA(5,ba,2,1,null,null,_A),ve()(),Me(7,xa,2,1,`p`),ve()}if(n&2){let e=Ke().$implicit;le$1(3),Td(e.name),le$1(),yt(`value`,e.currentValue),le$1(),wA(e.options??rR(3,ca)),le$1(2),Te(e.description?7:-1)}}function va(n,t){if(n&1&&(ue$1(0,`p`),kp(1),ve()),n&2){let e=Ke(2).$implicit;le$1(),Td(e.description)}}function Ca(n,t){if(n&1){let e=Rp();ue$1(0,`div`,16)(1,`div`)(2,`strong`),kp(3),ve(),Me(4,va,2,1,`p`),ve(),ue$1(5,`mat-slide-toggle`,19),Fe(`change`,function(a){gr$1(e);let o=Ke().$implicit;return vr$1(Ke(3).changeOption(o,a.checked))}),ve()()}if(n&2){let e=Ke().$implicit;le$1(3),Td(e.name),le$1(),Te(e.description?4:-1),le$1(),yt(`checked`,!!e.currentValue),ie$1(`aria-label`,e.name)}}function wa(n,t){if(n&1&&(ue$1(0,`div`,3)(1,`strong`),kp(2),ve(),ue$1(3,`div`,20),kp(4),ve()()),n&2){let e=Ke().$implicit;le$1(2),Td(e.name),le$1(2),Rw(``,e.currentValue,` (type: `,e.type,`)`)}}function ka(n,t){if(n&1&&Me(0,ya,8,4,`div`,3)(1,Ca,6,4,`div`,16)(2,wa,5,3,`div`,3),n&2){let e=t.$implicit;Te(e.type===`select`?0:e.type===`boolean`?1:2)}}function Sa(n,t){if(n&1&&SA(0,ka,3,1,null,null,da),n&2)wA(Ke(2).additionalOptions())}function Ma(n,t){if(n&1){let e=Rp();ue$1(0,`section`,0)(1,`h2`,1)(2,`mat-icon`),kp(3,`tune`),ve(),kp(4,` Configuration & permissions`),ve(),Me(5,pa,2,1,`div`,2),Me(6,ha,20,4),ue$1(7,`div`,3)(8,`mat-form-field`,4)(9,`mat-label`),kp(10,`Permission policy`),ve(),ue$1(11,`mat-select`,5),Fe(`selectionChange`,function(a){gr$1(e);return vr$1(Ke().changePolicy(a.value))}),ue$1(12,`mat-option`,6),kp(13,`Ask every time`),ve(),ue$1(14,`mat-option`,7),kp(15,`Read-only (deny writes)`),ve(),ue$1(16,`mat-option`,8),kp(17,`Auto-approve all permissions`),ve(),ue$1(18,`mat-option`,9),kp(19,`Deny all actions`),ve()()(),ue$1(20,`p`),kp(21,`Controls whether the agent must ask before running commands or editing files.`),ve()(),rt(22,`mat-divider`),Me(23,ua,2,0,`p`,10)(24,Sa,2,0),ve()}if(n&2){let e,i=t,a=Ke();le$1(5),Te(a.errorMessage()?5:-1),le$1(),Te((e=i.workspace)?6:-1,e),le$1(5),yt(`value`,i.permission_policy),le$1(12),Te(a.additionalOptions().length?24:23)}}var Et=class n{constructor(){this.chat=Mi$1(null);this.options=Mi$1([]);this.additionalOptions=x(()=>this.options().filter(t=>!this.isComposerOption(t)));this.errorMessage=C(``);this.state=u(gE)}isGroup(t){return`options`in t}isComposerOption(t){return t.id===`model`||t.id===`reasoning_effort`||t.name.toLowerCase()===`model`||t.name.toLowerCase()===`reasoning effort`}async changePolicy(t){let e=this.chat();if(e){this.errorMessage.set(``);try{await this.state.setChatPolicy(e.id,t)}catch(i){this.errorMessage.set(i instanceof Error?i.message:`Failed to update permission policy`)}}}async changeOption(t,e){let i=this.chat();if(i){this.errorMessage.set(``);try{await this.state.setChatConfig(i.id,t.id,e)}catch(a){this.errorMessage.set(a instanceof Error?a.message:`Failed to update agent configuration`)}}}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-chat-config`]],inputs:{chat:[1,`chat`],options:[1,`options`]},decls:1,vars:1,consts:[[`aria-labelledby`,`config-heading`,1,`config`],[`id`,`config-heading`],[`role`,`alert`,1,`error-box`],[1,`config-item`],[`appearance`,`outline`],[3,`selectionChange`,`value`],[`value`,`ask`],[`value`,`read-only`],[`value`,`auto-approve`],[`value`,`deny-all`],[1,`no-options`],[`aria-labelledby`,`workspace-heading`,1,`workspace-section`],[`id`,`workspace-heading`],[`aria-hidden`,`true`],[1,`workspace-details`],[3,`title`],[1,`boolean-item`],[3,`label`],[3,`value`],[3,`change`,`checked`],[1,`unsupported`]],template:function(e,i){if(e&1&&Me(0,Ma,25,4,`section`,0),e&2){let a;Te((a=i.chat())?0:-1,a)}},dependencies:[i0,Q1,bv,ex,gv,WX,$X,mo$1,po$1,ce$1,Zt$1,wi,tn],styles:[`[_nghost-%COMP%]{display:block}.config[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:18px}h2[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;font:var(--%NS%mat-sys-title-medium)}h2[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary)}.config-item[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:6px}mat-form-field[_ngcontent-%COMP%]{width:100%}p[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-small)}.no-options[_ngcontent-%COMP%]{font-style:italic}.boolean-item[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:16px}.boolean-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{display:block}.unsupported[_ngcontent-%COMP%]{padding:12px;border-radius:var(--%NS%mat-sys-corner-small);background:var(--%NS%mat-sys-surface-container);color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-small)}.error-box[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}.workspace-section[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:8px}.workspace-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;margin:0;font:var(--%NS%mat-sys-title-small)}.workspace-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary)}.workspace-section[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0}.workspace-details[_ngcontent-%COMP%]{display:grid;gap:8px;margin:0}.workspace-details[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{display:grid;grid-template-columns:minmax(110px,.35fr) 1fr;gap:12px}.workspace-details[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-medium)}.workspace-details[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%]{min-width:0;margin:0;overflow-wrap:anywhere;font:var(--%NS%mat-sys-body-medium)}`]})}};var Si=()=>[];function Pa(n,t){if(n&1){let e=Rp();ue$1(0,`button`,13),Fe(`click`,function(){let a=gr$1(e).$implicit,o=Ke(3);return vr$1(Ke().changeOption(o,a.value))}),kp(1),ve()}if(n&2){let e=t.$implicit;le$1(),Td(e.name)}}function Ta(n,t){if(n&1&&(ue$1(0,`div`,12),kp(1),ve(),SA(2,Pa,2,1,`button`,11,_A)),n&2){let e=Ke().$implicit;le$1(),Td(e.group),le$1(),wA(e.options)}}function Ea(n,t){if(n&1){let e=Rp();ue$1(0,`button`,13),Fe(`click`,function(){gr$1(e);let a=Ke().$implicit,o=Ke();return vr$1(Ke().changeOption(o,a.value))}),kp(1),ve()}if(n&2){let e=Ke().$implicit;le$1(),Td(e.name)}}function Ia(n,t){if(n&1&&Me(0,Ta,4,1)(1,Ea,2,1,`button`,11),n&2){let e=t.$implicit;Te(Ke(2).isGroup(e)?0:1)}}function Oa(n,t){if(n&1&&(ue$1(0,`button`,10)(1,`span`),kp(2),ve(),ue$1(3,`mat-icon`),kp(4,`expand_more`),ve()(),ue$1(5,`mat-menu`,null,0),SA(7,Ia,2,1,null,null,_A),ve()),n&2){let e=t,i=xr$1(6),a=Ke();yt(`matMenuTriggerFor`,i)(`disabled`,!a.canConfigure()),ie$1(`aria-label`,`Model: `+a.optionLabel(e)),le$1(2),Td(a.optionLabel(e)),le$1(5),wA(e.options??rR(4,Si))}}function Da(n,t){if(n&1){let e=Rp();ue$1(0,`button`,13),Fe(`click`,function(){gr$1(e);let a=Ke().$implicit,o=Ke();return vr$1(Ke().changeOption(o,a.value))}),kp(1),ve()}if(n&2){let e=Ke().$implicit;le$1(),Td(e.name)}}function Aa(n,t){if(n&1&&Me(0,Da,2,1,`button`,11),n&2){let e=t.$implicit;Te(Ke(2).isGroup(e)?-1:0)}}function Ra(n,t){if(n&1&&(ue$1(0,`button`,10)(1,`span`),kp(2),ve(),ue$1(3,`mat-icon`),kp(4,`expand_more`),ve()(),ue$1(5,`mat-menu`,null,1),SA(7,Aa,1,1,null,null,_A),ve()),n&2){let e=t,i=xr$1(6),a=Ke();yt(`matMenuTriggerFor`,i)(`disabled`,!a.canConfigure()),ie$1(`aria-label`,`Reasoning effort: `+a.optionLabel(e)),le$1(2),Rw(``,e.name,`: `,a.optionLabel(e)),le$1(5),wA(e.options??rR(5,Si))}}function za(n,t){n&1&&rt(0,`mat-spinner`,15)}function $a(n,t){n&1&&(ue$1(0,`mat-icon`),kp(1,`stop`),ve())}function Fa(n,t){if(n&1){let e=Rp();ue$1(0,`button`,14),Fe(`click`,function(){gr$1(e);return vr$1(Ke().cancel())}),Me(1,za,1,0,`mat-spinner`,15)(2,$a,2,0,`mat-icon`),ve()}if(n&2){let e=Ke();yt(`disabled`,e.cancelling()),le$1(),Te(e.cancelling()?1:2)}}function La(n,t){if(n&1&&(ue$1(0,`button`,8)(1,`mat-icon`),kp(2,`arrow_upward`),ve()()),n&2)yt(`disabled`,!Ke().canSend())}var It=class n{constructor(){this.chatId=Mi$1(``);this.turnState=Mi$1(`IDLE`);this.disabled=Mi$1(!1);this.options=Mi$1([]);this.message=new s1(``,{nonNullable:!0});this.state=u(gE);this.text=Ii$1(this.message.valueChanges,{initialValue:this.message.value});this.prompting=x(()=>this.turnState()===`PROMPTING`);this.cancelling=x(()=>this.turnState()===`CANCELLING`);this.canConfigure=x(()=>!this.disabled()&&this.turnState()===`IDLE`);this.modelOption=x(()=>this.findOption(`model`,`model`));this.reasoningOption=x(()=>this.findOption(`reasoning_effort`,`reasoning effort`));this.unavailable=x(()=>this.disabled()||this.prompting()||this.cancelling());this.canSend=x(()=>!this.unavailable()&&this.text().trim().length>0);this.placeholder=x(()=>this.disabled()?`Waiting for the agent connection…`:this.prompting()?`Agent is thinking…`:this.cancelling()?`Cancelling active turn…`:`Type a message…`);dt(()=>{let t=this.unavailable();t&&this.message.enabled?this.message.disable({emitEvent:!1}):!t&&this.message.disabled&&this.message.enable({emitEvent:!1})})}keyDown(t){if(!t.isComposing){if(t.ctrlKey&&!t.metaKey&&t.key.toLowerCase()===`j`){t.preventDefault(),this.insertNewline(t);return}t.key===`Enter`&&!t.shiftKey&&(t.preventDefault(),this.send())}}insertNewline(t){let e=t.target,i=this.message.value,a=e?.selectionStart??i.length,o=e?.selectionEnd??i.length;this.message.setValue(`${i.slice(0,a)}
${i.slice(o)}`);let l=a+1;queueMicrotask(()=>{e&&e.setSelectionRange(l,l)})}async send(){let t=this.message.value.trim();if(!(!t||!this.canSend())){this.message.setValue(``);try{await this.state.sendPrompt(this.chatId(),t)}catch(e){console.error(`Failed to send prompt`,e),this.message.setValue(t)}}}async cancel(){if(this.chatId())try{await this.state.cancelActiveTurn(this.chatId())}catch(t){console.error(`Failed to cancel turn`,t)}}isGroup(t){return`options`in t}optionLabel(t){let e=t.currentValue;for(let i of t.options??[]){let o=(this.isGroup(i)?i.options:[i]).find(l=>Object.is(l.value,e));if(o)return o.name}return e==null?t.name:String(e)}async changeOption(t,e){if(this.canConfigure())try{await this.state.setChatConfig(this.chatId(),t.id,e)}catch(i){console.error(`Failed to update ${t.name}`,i)}}findOption(t,e){return this.options().find(i=>i.type===`select`&&(i.id===t||i.name.toLowerCase()===e))??null}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-chat-composer`]],inputs:{chatId:[1,`chatId`],turnState:[1,`turnState`],disabled:[1,`disabled`],options:[1,`options`]},decls:11,vars:8,consts:[[`modelMenu`,`matMenu`],[`reasoningMenu`,`matMenu`],[1,`composer-column`],[1,`composer`,3,`submit`],[`cdkTextareaAutosize`,``,1,`message-input`,3,`keydown`,`formControl`,`cdkAutosizeMinRows`,`cdkAutosizeMaxRows`,`placeholder`],[1,`composer-footer`],[1,`selectors`],[`matFab`,``,`type`,`button`,`matTooltip`,`Cancel active turn`,`aria-label`,`Cancel active turn`,1,`action`,`cancel`,3,`disabled`],[`matFab`,``,`type`,`submit`,`matTooltip`,`Send message (Enter)`,`aria-label`,`Send message`,1,`action`,3,`disabled`],[1,`hint`],[`mat-button`,``,`type`,`button`,1,`selector`,3,`matMenuTriggerFor`,`disabled`],[`mat-menu-item`,``,`type`,`button`],[1,`menu-heading`],[`mat-menu-item`,``,`type`,`button`,3,`click`],[`matFab`,``,`type`,`button`,`matTooltip`,`Cancel active turn`,`aria-label`,`Cancel active turn`,1,`action`,`cancel`,3,`click`,`disabled`],[`diameter`,`22`]],template:function(e,i){if(e&1&&(ue$1(0,`div`,2)(1,`form`,3),Fe(`submit`,function(o){return o.preventDefault(),i.send()}),ue$1(2,`textarea`,4),Fe(`keydown`,function(o){return i.keyDown(o)}),ve(),fT(),ue$1(3,`div`,5)(4,`div`,6),Me(5,Oa,9,5),Me(6,Ra,9,6),ve(),Me(7,Fa,3,2,`button`,7)(8,La,3,1,`button`,8),ve()(),ue$1(9,`p`,9),kp(10,`Press Enter to send, Shift+Enter or Ctrl+J for a new line`),ve()()),e&2){let a,o;le$1(2),yt(`formControl`,i.message)(`cdkAutosizeMinRows`,1)(`cdkAutosizeMaxRows`,8)(`placeholder`,i.placeholder()),ie$1(`aria-label`,i.placeholder()),mT(),le$1(3),Te((a=i.modelOption())?5:-1,a),le$1(),Te((o=i.reasoningOption())?6:-1,o),le$1(),Te(i.prompting()||i.cancelling()?7:8)}},dependencies:[Cie,wie,ax,_ie,bie,u1,e0,Sre,EX,CX,DX,WX,$X,wte,Ku,lv,Ste,Ene,Dne,on,Gt$1],styles:[`[_nghost-%COMP%]{display:block;flex:0 0 auto;padding:12px max(var(--%NS%hub-gutter),(100% - var(--%NS%hub-measure)) / 2);padding-bottom:calc(12px + env(safe-area-inset-bottom));border-top:1px solid var(--%NS%mat-sys-outline-variant);background:var(--%NS%mat-sys-surface)}.composer-column[_ngcontent-%COMP%]{max-width:var(--%NS%hub-measure);margin:0 auto}.composer[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px;padding:14px 10px 8px 20px;border:1px solid var(--%NS%mat-sys-outline-variant);border-radius:28px;background:var(--%NS%mat-sys-surface-container-low);transition:border-color .16s ease,box-shadow .16s ease}.composer[_ngcontent-%COMP%]:focus-within{border-color:var(--%NS%mat-sys-primary);box-shadow:0 0 0 1px var(--%NS%mat-sys-primary)}.message-input[_ngcontent-%COMP%]{display:block;width:100%;min-height:40px;max-height:190px;resize:none;border:0;outline:0;background:transparent;color:var(--%NS%mat-sys-on-surface);font:var(--%NS%mat-sys-body-large);line-height:1.5}.message-input[_ngcontent-%COMP%]::placeholder{color:var(--%NS%mat-sys-on-surface-variant);opacity:1}.composer-footer[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:12px}.selectors[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap;gap:2px;min-width:0}.selector[_ngcontent-%COMP%]{min-height:40px;padding-inline:10px;border-radius:20px;color:var(--%NS%mat-sys-on-surface-variant)}.selector[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:20px;height:20px;margin-left:2px;font-size:20px}.menu-heading[_ngcontent-%COMP%]{padding:8px 16px 4px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-medium)}.action[_ngcontent-%COMP%]{width:48px;height:48px;min-width:48px;flex:0 0 48px;padding:0}.resume-button[_ngcontent-%COMP%]{min-height:36px;border-radius:18px;gap:4px;font:var(--%NS%mat-sys-label-medium);color:var(--%NS%mat-sys-primary);border-color:var(--%NS%mat-sys-outline)}.resume-button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:18px;height:18px;font-size:18px}.cancel[_ngcontent-%COMP%]{--%NS%mat-fab-container-color: var(--%NS%mat-sys-error-container);--%NS%mat-fab-icon-color: var(--%NS%mat-sys-on-error-container);--%NS%mat-fab-state-layer-color: var(--%NS%mat-sys-on-error-container)}.hint[_ngcontent-%COMP%]{padding:6px 4px 0;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-small)}@media(max-width:599px){[_nghost-%COMP%]{padding-inline:16px}.composer[_ngcontent-%COMP%]{padding-left:14px}.selector[_ngcontent-%COMP%]{padding-inline:6px}.hint[_ngcontent-%COMP%]{display:none}}`]})}};function Va(n,t){if(n&1&&(ue$1(0,`div`,1),kp(1),ve()),n&2){let e=Ke();le$1(),Td(e.error())}}function Ba(n,t){if(n&1&&(ue$1(0,`p`,2),kp(1),ve(),ue$1(2,`p`,2),kp(3,`Chat history deletion is irreversible; the preserved Git branch is not deleted.`),ve()),n&2){let e=Ke();le$1(),Op(` The Hub-managed worktree will be removed only if it is safe and clean. Deletion is refused if uncommitted files would be lost. The Git branch is preserved`,e.workspace()?.branch?`, including “`+e.workspace()?.branch+`”.`:`.`,` `)}}function qa(n,t){n&1&&(ue$1(0,`p`,2),kp(1,`Deleting this chat does not delete or clean the project checkout. Its branch and working files are left unchanged.`),ve())}function ja(n,t){n&1&&(ue$1(0,`p`,2),kp(1,`This action cannot be undone.`),ve())}function Qa(n,t){n&1&&rt(0,`mat-spinner`,6)}function Wa(n,t){n&1&&kp(0,` Delete chat `)}var Ot=class n{constructor(){this.dialogRef=u(Ju);this.state=u(gE);this.deleting=C(!1);this.error=C(``);this.chat=u(qF);this.workspace=x(()=>this.chat.workspace??null)}async remove(){this.deleting.set(!0),this.error.set(``);try{await this.state.deleteChat(this.chat.id),this.dialogRef.close(!0)}catch(t){this.error.set(t instanceof Error?t.message:`Failed to delete chat`)}finally{this.deleting.set(!1)}}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-delete-chat-dialog`]],decls:15,vars:6,consts:[[`mat-dialog-title`,``],[`role`,`alert`,1,`error`],[1,`note`],[`align`,`end`],[`mat-button`,``,`type`,`button`,3,`click`,`disabled`],[`mat-flat-button`,``,`type`,`button`,1,`destructive`,3,`click`,`disabled`],[`diameter`,`18`]],template:function(e,i){if(e&1&&(ue$1(0,`h2`,0),kp(1,`Delete chat`),ve(),ue$1(2,`mat-dialog-content`),Me(3,Va,2,1,`div`,1),ue$1(4,`p`),kp(5),ve(),Me(6,Ba,4,1)(7,qa,2,0,`p`,2)(8,ja,2,0,`p`,2),ve(),ue$1(9,`mat-dialog-actions`,3)(10,`button`,4),Fe(`click`,function(){return i.dialogRef.close()}),kp(11,`Cancel`),ve(),ue$1(12,`button`,5),Fe(`click`,function(){return i.remove()}),Me(13,Qa,1,0,`mat-spinner`,6)(14,Wa,1,0),ve()()),e&2){let a;le$1(3),Te(i.error()?3:-1),le$1(2),Op(`Are you sure you want to delete “`,i.chat.title||`this chat`,`”?`),le$1(),Te((a=i.workspace()?.mode)===`managed_worktree`?6:a===`project_checkout`?7:8),le$1(4),yt(`disabled`,i.deleting()),le$1(2),yt(`disabled`,i.deleting()),le$1(),Te(i.deleting()?13:14)}},dependencies:[EX,CX,fne,lne,une,dne,Ene,Dne],styles:[`mat-dialog-content[_ngcontent-%COMP%]{display:flex;min-width:min(400px,100vw - 48px);max-width:520px;flex-direction:column;gap:8px}.note[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.error[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}.destructive[_ngcontent-%COMP%]{--%NS%mat-button-filled-container-color: var(--%NS%mat-sys-error);--%NS%mat-button-filled-label-text-color: var(--%NS%mat-sys-on-error);--%NS%mat-button-filled-state-layer-color: var(--%NS%mat-sys-on-error)}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}`]})}};function Ga(n,t){if(n&1&&(ue$1(0,`div`,3),kp(1),ve()),n&2){let e=Ke();le$1(),Td(e.error())}}var Dt=class n{constructor(){this.dialogRef=u(Ju);this.chat=u(qF);this.state=u(gE);this.formModel=C({title:this.chat.title||``});this.renameForm=R1(this.formModel);this.title=this.renameForm.title().value;this.saving=C(!1);this.error=C(``)}async save(){let t=this.title().trim();if(t){this.saving.set(!0),this.error.set(``);try{await this.state.renameChat(this.chat.id,t),this.dialogRef.close(!0)}catch(e){this.error.set(e instanceof Error?e.message:`Failed to rename chat`)}finally{this.saving.set(!1)}}}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-rename-chat-dialog`]],decls:13,vars:4,consts:[[`mat-dialog-title`,``],[`appearance`,`outline`],[`matInput`,``,`autocomplete`,`off`,3,`keyup.enter`,`formField`],[`role`,`alert`,1,`error`],[`align`,`end`],[`mat-button`,``,`type`,`button`,3,`click`,`disabled`],[`mat-flat-button`,``,`type`,`button`,3,`click`,`disabled`]],template:function(e,i){e&1&&(ue$1(0,`h2`,0),kp(1,`Rename chat`),ve(),ue$1(2,`mat-dialog-content`)(3,`mat-form-field`,1)(4,`mat-label`),kp(5,`Chat title`),ve(),ue$1(6,`input`,2),Fe(`keyup.enter`,function(){return i.save()}),ve(),fT(),ve(),Me(7,Ga,2,1,`div`,3),ve(),ue$1(8,`mat-dialog-actions`,4)(9,`button`,5),Fe(`click`,function(){return i.dialogRef.close()}),kp(10,`Cancel`),ve(),ue$1(11,`button`,6),Fe(`click`,function(){return i.save()}),kp(12,`Save`),ve()()),e&2&&(le$1(6),yt(`formField`,i.renameForm.title),mT(),le$1(),Te(i.error()?7:-1),le$1(2),yt(`disabled`,i.saving()),le$1(2),yt(`disabled`,!i.title().trim()||i.saving()))},dependencies:[rre,EX,CX,fne,lne,une,dne,bv,ex,gv,Gre,Wre],styles:[`mat-dialog-content[_ngcontent-%COMP%]{min-width:min(360px,100vw - 48px);padding-top:10px!important}mat-form-field[_ngcontent-%COMP%]{width:100%}.error[_ngcontent-%COMP%]{padding:12px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container);white-space:pre-wrap}@media(max-width:599px){mat-dialog-content[_ngcontent-%COMP%]{min-width:0}}`]})}};function Za(n,t){n&1&&(ue$1(0,`span`,9),kp(1,`Archived`),ve())}function Ua(n,t){if(n&1&&(ue$1(0,`span`,13)(1,`mat-icon`,20),kp(2,`account_tree`),ve(),ue$1(3,`span`,21),kp(4),ve()()),n&2){let e=Ke();yt(`matTooltip`,Ke().workspaceTooltip(e.workspace)),le$1(4),Td(t)}}function Xa(n,t){if(n&1){let e=Rp();ue$1(0,`div`,3)(1,`button`,4),Fe(`click`,function(){gr$1(e);return vr$1(Ke().toggleNavigation())}),ue$1(2,`mat-icon`),kp(3,`menu`),ve()(),ue$1(4,`div`,5)(5,`div`,6)(6,`button`,7),Fe(`click`,function(){gr$1(e);return vr$1(Ke().rename())}),ue$1(7,`span`,8),kp(8),ve()(),Me(9,Za,2,0,`span`,9),ve(),ue$1(10,`div`,10)(11,`span`,11),kp(12),ve(),rt(13,`hub-chat-status-badge`,12),Me(14,Ua,5,2,`span`,13),ve(),ue$1(15,`div`,14)(16,`span`),kp(17,`Created `),ue$1(18,`time`),kp(19),ve()(),ue$1(20,`span`),kp(21,`Last updated `),ue$1(22,`time`),kp(23),ve()()()()(),ue$1(24,`div`,15)(25,`button`,16),Fe(`click`,function(){gr$1(e);return vr$1(Ke().configRequested.emit())}),ue$1(26,`mat-icon`),kp(27,`tune`),ve()(),ue$1(28,`button`,17)(29,`mat-icon`),kp(30,`more_vert`),ve()(),ue$1(31,`mat-menu`,null,0)(33,`button`,18),Fe(`click`,function(){gr$1(e);return vr$1(Ke().rename())}),ue$1(34,`mat-icon`),kp(35,`edit`),ve(),ue$1(36,`span`),kp(37,`Rename chat`),ve()(),ue$1(38,`button`,18),Fe(`click`,function(){gr$1(e);return vr$1(Ke().archive())}),ue$1(39,`mat-icon`),kp(40),ve(),ue$1(41,`span`),kp(42),ve()(),ue$1(43,`button`,18),Fe(`click`,function(){gr$1(e);return vr$1(Ke().remove())}),ue$1(44,`mat-icon`,19),kp(45,`delete`),ve(),ue$1(46,`span`),kp(47,`Delete chat`),ve()()()()}if(n&2){let e,i=t,a=xr$1(32),o=Ke();le$1(6),ie$1(`aria-label`,`Rename chat `+(i.title||`Untitled chat`)),le$1(2),Td(i.title||`Untitled chat`),le$1(),Te(i.archived?9:-1),le$1(3),Td(o.agentLabel(i.agent)),le$1(),yt(`status`,o.activity())(`turnStartedAt`,o.turnStartedAt()),le$1(),Te((e=i.workspace?.branch)?14:-1,e),le$1(4),ie$1(`datetime`,i.created_at),le$1(),Td(o.formatDateTime(i.created_at)),le$1(3),ie$1(`datetime`,i.updated_at),le$1(),Td(o.formatDateTime(i.updated_at)),le$1(5),yt(`matMenuTriggerFor`,a),le$1(12),Td(i.archived?`unarchive`:`archive`),le$1(2),Td(i.archived?`Unarchive chat`:`Archive chat`)}}function Ka(n,t){n&1&&(ue$1(0,`span`,2),kp(1,`No chat selected`),ve())}var At=class n{constructor(){this.chat=Mi$1(null);this.configRequested=X5();this.state=u(gE);this.activity=x(()=>{let t=this.chat();return t?this.state.chatActivity(t.id):`idle`});this.turnStartedAt=x(()=>{let t=this.chat();return t?this.state.chatTurnStartedAt(t.id):null});this.dialog=u(VE)}agentLabel(t){let e=t??``;return e&&e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()}workspaceTooltip(t){return`${t.branch??``} \u2014 ${t.mode===`managed_worktree`?`Isolated worktree`:`Project checkout`}`}formatDateTime(t){return YX(t)}toggleNavigation(){this.state.setMobileDrawerOpen(!this.state.isMobileDrawerOpen())}rename(){let t=this.chat();t&&this.dialog.open(Dt,{width:`min(480px, calc(100vw - 32px))`,data:t})}async archive(){let t=this.chat();t&&await this.state.archiveChat(t.id,!t.archived).catch(e=>console.error(`Failed to archive chat`,e))}remove(){let t=this.chat();t&&this.dialog.open(Ot,{width:`min(520px, calc(100vw - 32px))`,data:t})}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-chat-header`]],inputs:{chat:[1,`chat`]},outputs:{configRequested:`configRequested`},decls:3,vars:1,consts:[[`actions`,`matMenu`],[1,`chat-header`],[1,`no-chat`],[1,`header-left`],[`mat-icon-button`,``,`aria-label`,`Open navigation`,`matTooltip`,`Open navigation`,1,`nav-button`,3,`click`],[1,`title-area`],[1,`title-line`],[`mat-button`,``,`type`,`button`,1,`title-button`,3,`click`],[1,`title-text`],[1,`badge`,`stopped`],[1,`badges`],[1,`badge`,`agent`],[3,`status`,`turnStartedAt`],[1,`badge`,`workspace-badge`,3,`matTooltip`],[1,`chat-timestamps`],[1,`header-actions`],[`mat-icon-button`,``,`matTooltip`,`Chat configuration`,`aria-label`,`Chat configuration`,3,`click`],[`mat-icon-button`,``,`aria-label`,`Chat actions`,3,`matMenuTriggerFor`],[`mat-menu-item`,``,`type`,`button`,3,`click`],[1,`destructive-icon`],[`aria-hidden`,`true`],[1,`workspace-branch`]],template:function(e,i){if(e&1&&(ue$1(0,`header`,1),Me(1,Xa,48,14)(2,Ka,2,0,`span`,2),ve()),e&2){let a;le$1(),Te((a=i.chat())?1:2,a)}},dependencies:[kt,EX,CX,tF,fne,WX,$X,wte,Ku,lv,Ste,on,Gt$1],styles:[`.destructive-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-error)}[_nghost-%COMP%]{display:block;flex:0 0 auto;padding-inline:max(var(--%NS%hub-gutter),(100% - var(--%NS%hub-measure)) / 2);border-bottom:1px solid var(--%NS%mat-sys-outline-variant);background:var(--%NS%mat-sys-surface)}.chat-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:72px;max-width:var(--%NS%hub-measure);margin:0 auto;padding-block:10px}.header-left[_ngcontent-%COMP%], .header-actions[_ngcontent-%COMP%], .title-line[_ngcontent-%COMP%], .badges[_ngcontent-%COMP%]{display:flex;align-items:center}.header-left[_ngcontent-%COMP%]{min-width:0;flex:1;gap:12px}.header-actions[_ngcontent-%COMP%]{flex:0 0 auto;gap:2px}.title-area[_ngcontent-%COMP%]{min-width:0}.title-line[_ngcontent-%COMP%]{min-width:0;gap:8px}.title-button[_ngcontent-%COMP%]{--%NS%mat-button-text-label-text-color: var(--%NS%mat-sys-on-surface);justify-content:flex-start;min-width:0;overflow:hidden;max-width:min(50vw,560px);padding-inline:12px;margin-left:-12px;font:var(--%NS%mat-sys-title-medium);letter-spacing:var(--%NS%mat-sys-title-medium-tracking);text-align:left}.title-text[_ngcontent-%COMP%]{display:block;min-width:0;max-width:min(50vw - 24px,536px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.title-button[_ngcontent-%COMP%]:hover{text-decoration:underline}.badges[_ngcontent-%COMP%]{flex-wrap:wrap;gap:6px;margin-top:4px}.chat-timestamps[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:12px;margin-top:5px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small)}.chat-timestamps[_ngcontent-%COMP%]   time[_ngcontent-%COMP%]{color:inherit}.badge[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:var(--%NS%mat-sys-corner-full);background:var(--%NS%mat-sys-surface-container-high);color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small)}.badge.agent[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);text-transform:capitalize}.workspace-badge[_ngcontent-%COMP%]{min-width:0;max-width:min(42vw,320px)}.workspace-badge[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:16px;width:16px;height:16px}.workspace-branch[_ngcontent-%COMP%]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nav-button[_ngcontent-%COMP%]{display:none}.no-chat[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}@media(max-width:839px){.nav-button[_ngcontent-%COMP%]{display:inline-flex}}@media(max-width:599px){[_nghost-%COMP%]{padding-inline:16px}.header-actions[_ngcontent-%COMP%] > button[_ngcontent-%COMP%]:first-child{display:none}.title-button[_ngcontent-%COMP%]{max-width:42vw}.title-text[_ngcontent-%COMP%]{max-width:calc(42vw - 24px)}}`]})}};var Mi=new g(`CdkAccordion`);var Ni=(()=>{class n{accordion=u(Mi,{optional:!0,skipSelf:!0});_changeDetectorRef=u(Qe$1);_expansionDispatcher=u(X1);_openCloseAllSubscription=Q.EMPTY;closed=new z;opened=new z;destroyed=new z;expandedChange=new z;id=u(ot).getId(`cdk-accordion-child-`);get expanded(){return this._expanded}set expanded(e){if(this._expanded!==e){if(this._expanded=e,this.expandedChange.emit(e),e){this.opened.emit();let i=this.accordion?this.accordion.id:this.id;this._expansionDispatcher.notify(this.id,i)}else this.closed.emit();this._changeDetectorRef.markForCheck()}}_expanded=!1;get disabled(){return this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=C(!1);_removeUniqueSelectionListener=()=>{};ngOnInit(){this._removeUniqueSelectionListener=this._expansionDispatcher.listen((e,i)=>{this.accordion&&!this.accordion.multi&&this.accordion.id===i&&this.id!==e&&(this.expanded=!1)}),this.accordion&&(this._openCloseAllSubscription=this._subscribeToOpenCloseAllActions())}ngOnDestroy(){this.opened.complete(),this.closed.complete(),this.destroyed.emit(),this.destroyed.complete(),this._removeUniqueSelectionListener(),this._openCloseAllSubscription.unsubscribe()}toggle(){this.disabled||(this.expanded=!this.expanded)}close(){this.disabled||(this.expanded=!1)}open(){this.disabled||(this.expanded=!0)}_subscribeToOpenCloseAllActions(){return this.accordion._openCloseAllActions.subscribe(e=>{this.disabled||(this.expanded=e)})}static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`cdk-accordion-item`],[``,`cdkAccordionItem`,``]],inputs:{expanded:[2,`expanded`,`expanded`,te],disabled:[2,`disabled`,`disabled`,te]},outputs:{closed:`closed`,opened:`opened`,destroyed:`destroyed`,expandedChange:`expandedChange`},exportAs:[`cdkAccordionItem`],features:[Le([{provide:Mi,useValue:void 0}])]})}return n})();var Pi=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({})}return n})();var eo=[`body`];var to=[`bodyWrapper`];var no=[[[`mat-expansion-panel-header`]],`*`,[[`mat-action-row`]]];var io=[`mat-expansion-panel-header`,`*`,`mat-action-row`];function ao(n,t){}var oo=[[[`mat-panel-title`]],[[`mat-panel-description`]],`*`];var ro=[`mat-panel-title`,`mat-panel-description`,`*`];function so(n,t){n&1&&(ft(0,`span`,1),Ei$1(),ft(1,`svg`,2),It$1(2,`path`,3),_t()())}var Ti=new g(`MAT_ACCORDION`);var Ei=new g(`MAT_EXPANSION_PANEL`);var lo=(()=>{class n{_template=u(ut);_expansionPanel=u(Ei,{optional:!0});static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`ng-template`,`matExpansionPanelContent`,``]]})}return n})();var Ii=new g(`MAT_EXPANSION_PANEL_DEFAULT_OPTIONS`);var Be=(()=>{class n extends Ni{_viewContainerRef=u(it);_animationsDisabled=Je();_document=u(M);_ngZone=u(I);_elementRef=u(N);_renderer=u(ge);_cleanupTransitionEnd;get hideToggle(){return this._hideToggle||this.accordion&&this.accordion.hideToggle}set hideToggle(e){this._hideToggle=e}_hideToggle=!1;get togglePosition(){return this._togglePosition||this.accordion&&this.accordion.togglePosition}set togglePosition(e){this._togglePosition=e}_togglePosition;afterExpand=new z;afterCollapse=new z;_inputChanges=new w$1;accordion=u(Ti,{optional:!0,skipSelf:!0});_lazyContent;_body;_bodyWrapper;_portal;_headerId=u(ot).getId(`mat-expansion-panel-header-`);constructor(){super();let e=u(Ii,{optional:!0});this._expansionDispatcher=u(X1),e&&(this.hideToggle=e.hideToggle)}_hasSpacing(){return this.accordion?this.expanded&&this.accordion.displayMode==="default":!1}_getExpandedState(){return this.expanded?`expanded`:`collapsed`}toggle(){this.expanded=!this.expanded}close(){this.expanded=!1}open(){this.expanded=!0}ngAfterContentInit(){this._lazyContent&&this._lazyContent._expansionPanel===this&&this.opened.pipe(st(null),re(()=>this.expanded&&!this._portal),xe(1)).subscribe(()=>{this._portal=new mn$1(this._lazyContent._template,this._viewContainerRef)}),this._setupAnimationEvents()}ngOnChanges(e){this._inputChanges.next(e)}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTransitionEnd?.(),this._inputChanges.complete()}_containsFocus(){if(this._body){let e=this._document.activeElement,i=this._body.nativeElement;return e===i||i.contains(e)}return!1}_transitionEndListener=({target:e,propertyName:i})=>{e===this._bodyWrapper?.nativeElement&&i===`grid-template-rows`&&this._ngZone.run(()=>{this.expanded?this.afterExpand.emit():this.afterCollapse.emit()})};_setupAnimationEvents(){this._ngZone.runOutsideAngular(()=>{this._animationsDisabled?(this.opened.subscribe(()=>this._ngZone.run(()=>this.afterExpand.emit())),this.closed.subscribe(()=>this._ngZone.run(()=>this.afterCollapse.emit()))):setTimeout(()=>{let e=this._elementRef.nativeElement;this._cleanupTransitionEnd=this._renderer.listen(e,`transitionend`,this._transitionEndListener),e.classList.add(`mat-expansion-panel-animations-enabled`)},200)})}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`mat-expansion-panel`]],contentQueries:function(i,a,o){if(i&1&&un(o,lo,5),i&2){let l;oe(l=se())&&(a._lazyContent=l.first)}},viewQuery:function(i,a){if(i&1&&Nt(eo,5)(to,5),i&2){let o;oe(o=se())&&(a._body=o.first),oe(o=se())&&(a._bodyWrapper=o.first)}},hostAttrs:[1,`mat-expansion-panel`],hostVars:4,hostBindings:function(i,a){i&2&&J(`mat-expanded`,a.expanded)(`mat-expansion-panel-spacing`,a._hasSpacing())},inputs:{hideToggle:[2,`hideToggle`,`hideToggle`,te],togglePosition:`togglePosition`},outputs:{afterExpand:`afterExpand`,afterCollapse:`afterCollapse`},exportAs:[`matExpansionPanel`],features:[Le([{provide:Ti,useValue:void 0},{provide:Ei,useExisting:n}]),ae,Be$1],ngContentSelectors:io,decls:9,vars:4,consts:[[`bodyWrapper`,``],[`body`,``],[1,`mat-expansion-panel-content-wrapper`],[`role`,`region`,1,`mat-expansion-panel-content`,3,`id`],[1,`mat-expansion-panel-body`],[3,`cdkPortalOutlet`]],template:function(i,a){i&1&&(Ge$1(no),ee(0),ue$1(1,`div`,2,0)(3,`div`,3,1)(5,`div`,4),ee(6,1),Ot$1(7,ao,0,0,`ng-template`,5),ve(),ee(8,2),ve()()),i&2&&(le$1(),ie$1(`inert`,a.expanded?null:``),le$1(2),yt(`id`,a.id),ie$1(`aria-labelledby`,a._headerId),le$1(4),yt(`cdkPortalOutlet`,a._portal))},dependencies:[uc],styles:[`.mat-expansion-panel {
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
`],encapsulation:2})}return n})();var Rt=(()=>{class n{panel=u(Be,{host:!0});_element=u(N);_focusMonitor=u(ai);_changeDetectorRef=u(Qe$1);_parentChangeSubscription=Q.EMPTY;constructor(){u(qe$1).load(os);let e=this.panel,i=u(Ii,{optional:!0}),a=u(new ko$1(`tabindex`),{optional:!0}),o=e.accordion?e.accordion._stateChanges.pipe(re(l=>!!(l.hideToggle||l.togglePosition))):Re;this.tabIndex=parseInt(a||``)||0,this._parentChangeSubscription=Xt$1(e.opened,e.closed,o,e._inputChanges.pipe(re(l=>!!(l.hideToggle||l.disabled||l.togglePosition)))).subscribe(()=>this._changeDetectorRef.markForCheck()),e.closed.pipe(re(()=>e._containsFocus())).subscribe(()=>this._focusMonitor.focusVia(this._element,`program`)),i&&(this.expandedHeight=i.expandedHeight,this.collapsedHeight=i.collapsedHeight)}expandedHeight;collapsedHeight;tabIndex=0;get disabled(){return this.panel.disabled}_toggle(){this.disabled||this.panel.toggle()}_isExpanded(){return this.panel.expanded}_getExpandedState(){return this.panel._getExpandedState()}_getPanelId(){return this.panel.id}_getTogglePosition(){return this.panel.togglePosition}_showToggle(){return!this.panel.hideToggle&&!this.panel.disabled}_getHeaderHeight(){let e=this._isExpanded();return e&&this.expandedHeight?this.expandedHeight:!e&&this.collapsedHeight?this.collapsedHeight:null}_keydown(e){switch(e.keyCode){case 32:case 13:Pn(e)||(e.preventDefault(),this._toggle());break;default:this.panel.accordion&&this.panel.accordion._handleHeaderKeydown(e);return}}focus(e,i){e?this._focusMonitor.focusVia(this._element,e,i):this._element.nativeElement.focus(i)}ngAfterViewInit(){this._focusMonitor.monitor(this._element).subscribe(e=>{e&&this.panel.accordion&&this.panel.accordion._handleHeaderFocus(this)})}ngOnDestroy(){this._parentChangeSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._element)}static ɵfac=function(i){return new(i||n)};static ɵcmp=X({type:n,selectors:[[`mat-expansion-panel-header`]],hostAttrs:[`role`,`button`,1,`mat-expansion-panel-header`,`mat-focus-indicator`],hostVars:13,hostBindings:function(i,a){i&1&&Fe(`click`,function(){return a._toggle()})(`keydown`,function(l){return a._keydown(l)}),i&2&&(ie$1(`id`,a.panel._headerId)(`tabindex`,a.disabled?-1:a.tabIndex)(`aria-controls`,a._getPanelId())(`aria-expanded`,a._isExpanded())(`aria-disabled`,a.panel.disabled),Ir$1(`height`,a._getHeaderHeight()),J(`mat-expanded`,a._isExpanded())(`mat-expansion-toggle-indicator-after`,a._getTogglePosition()===`after`)(`mat-expansion-toggle-indicator-before`,a._getTogglePosition()===`before`))},inputs:{expandedHeight:`expandedHeight`,collapsedHeight:`collapsedHeight`,tabIndex:[2,`tabIndex`,`tabIndex`,e=>e==null?0:Oo$1(e)]},ngContentSelectors:ro,decls:5,vars:3,consts:[[1,`mat-content`],[1,`mat-expansion-indicator`],[`xmlns`,`http://www.w3.org/2000/svg`,`viewBox`,`0 -960 960 960`,`aria-hidden`,`true`,`focusable`,`false`],[`d`,`M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z`]],template:function(i,a){i&1&&(Ge$1(oo),ft(0,`span`,0),ee(1),ee(2,1),ee(3,2),_t(),Me(4,so,3,0,`span`,1)),i&2&&(J(`mat-content-hide-toggle`,!a._showToggle()),le$1(4),Te(a._showToggle()?4:-1))},styles:[`.mat-expansion-panel-header {
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
`],encapsulation:2})}return n})();var Oi=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`mat-panel-description`]],hostAttrs:[1,`mat-expansion-panel-header-description`]})}return n})();var zt=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵdir=D({type:n,selectors:[[`mat-panel-title`]],hostAttrs:[1,`mat-expansion-panel-header-title`]})}return n})();var $t=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=$({type:n});static ɵinj=U({imports:[Pi,zr$1,we]})}return n})();function rn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ue=rn();function qi(n){ue=n}var me={exec:()=>null};function Ie(n){let t=[];return e=>{let i=Math.max(0,Math.min(3,e-1)),a=t[i];return a||(a=n(i),t[i]=a),a}}function w(n,t=``){let e=typeof n==`string`?n:n.source,i={replace:(a,o)=>{let l=typeof o==`string`?o:o.source;return l=l.replace(L.caret,`$1`),e=e.replace(a,l),i},getRegex:()=>new RegExp(e,t)};return i}var co=((n=``)=>{try{return!!new RegExp(`(?<=1)(?<!1)`+n)}catch{return!1}})();var L={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:n=>new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:Ie(n=>new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:Ie(n=>new RegExp(`^ {0,${n}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:Ie(n=>new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)),headingBeginRegex:Ie(n=>new RegExp(`^ {0,${n}}#`)),htmlBeginRegex:Ie(n=>new RegExp(`^ {0,${n}}(?:</?(?:${We})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`,`i`)),blockquoteBeginRegex:Ie(n=>new RegExp(`^ {0,${n}}>`))};var po=/^(?:[ \t]*(?:\n|$))+/;var mo=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;var ho=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;var Qe=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;var uo=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;var sn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/;var ji=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;var Qi=w(ji).replace(/bull/g,sn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,``).getRegex();var go=w(ji).replace(/bull/g,sn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();var ln=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/;var fo=/^[^\n]+/;var cn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;var _o=w(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace(`label`,cn).replace(`title`,/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();var bo=w(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,sn).getRegex();var We=`address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul`;var dn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/;var xo=w(`^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))`,`i`).replace(`comment`,dn).replace(`tag`,We).replace(`attribute`,/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();var Wi=n=>w(ln).replace(`hr`,Qe).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace(`list`,n).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,We).getRegex();var yo=Wi(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/);var vo=Wi(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/);var pn={blockquote:w(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace(`paragraph`,vo).getRegex(),code:mo,def:_o,fences:ho,heading:uo,hr:Qe,html:xo,lheading:Qi,list:bo,newline:po,paragraph:yo,table:me,text:fo};var Ai=w(`^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)`).replace(`hr`,Qe).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`blockquote`,` {0,3}>`).replace(`code`,`(?: {4}| {0,3}	)[^\\n]`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace(`list`,` {0,3}(?:[*+-]|1[.)])[ \\t]`).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,We).getRegex();var wo=S(p({},pn),{lheading:go,table:Ai,paragraph:w(ln).replace(`hr`,Qe).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`table`,Ai).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace(`list`,` {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]`).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,We).getRegex()});var ko=S(p({},pn),{html:w(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace(`comment`,dn).replace(/tag/g,`(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b`).getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:me,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:w(ln).replace(`hr`,Qe).replace(`heading`,` *#{1,6} *[^
]`).replace(`lheading`,Qi).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`|fences`,``).replace(`|list`,``).replace(`|html`,``).replace(`|tag`,``).getRegex()});var So=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;var Mo=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;var Gi=/^( {2,}|\\)\n(?!\s*$)[ \t]*/;var No=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;var le=/[\p{P}\p{S}]/u;var Oe=/[\s\p{P}\p{S}]/u;var Ge=/[^\s\p{P}\p{S}]/u;var Po=w(/^((?![*_])punctSpace)/,`u`).replace(/punctSpace/g,Oe).getRegex();var To=/[\p{Pi}\p{Ps}"']/u;var Zi=/(?!~)[\p{P}\p{S}]/u;var Eo=/(?!~)[\s\p{P}\p{S}]/u;var Io=/(?:[^\s\p{P}\p{S}]|~)/u;var Oo=w(/link|precode-code|html/,`g`).replace(`link`,/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace(`precode-`,co?"(?<!`)()":"(^^|[^`])").replace(`code`,/(?<b>`+)[^`]+\k<b>(?!`)/).replace(`html`,/<(?! )[^<>]*?>/).getRegex();var Ui=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/;var Do=w(Ui,`u`).replace(/punct/g,le).getRegex();var Ao=w(Ui,`u`).replace(/punct/g,Zi).getRegex();var zo=w(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,`u`).replace(/openQuote/g,To).replace(/punct/g,le).getRegex();var Xi=`^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)`;var $o=w(Xi,`gu`).replace(/notPunctSpace/g,Ge).replace(/punctSpace/g,Oe).replace(/punct/g,le).getRegex();var Fo=w(Xi,`gu`).replace(/notPunctSpace/g,Io).replace(/punctSpace/g,Eo).replace(/punct/g,Zi).getRegex();var Ho=w(`^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)`,`gu`).replace(/notPunctSpace/g,Ge).replace(/punctSpace/g,Oe).replace(/punct/g,le).getRegex();var Vo=w(`^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)`,`gu`).replace(/notPunctSpace/g,Ge).replace(/punctSpace/g,Oe).replace(/punct/g,le).getRegex();var qo=w(`^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)`,`gu`).replace(/notPunctSpace/g,Ge).replace(/punctSpace/g,Oe).replace(/punct/g,le).getRegex();var jo=w(/^~~?(?:((?!~)punct)|[^\s~])/,`u`).replace(/punct/g,le).getRegex();var Wo=w(`^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)`,`gu`).replace(/notPunctSpace/g,Ge).replace(/punctSpace/g,Oe).replace(/punct/g,le).getRegex();var Go=w(/\\(punct)/,`gu`).replace(/punct/g,le).getRegex();var Zo=w(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace(`scheme`,/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace(`email`,/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();var Uo=w(dn).replace(`(?:-->|$)`,`-->`).getRegex();var Xo=w(`^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>`).replace(`comment`,Uo).replace(`attribute`,/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();var Ki=/\[(?:\\[\s\S]|[^\[\]\\])*\]/;var Lt=w(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace(`brackets`,Ki).getRegex();var Ko=w(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace(`label`,Lt).replace(`href`,/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace(`title`,/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();var Yo=w(/^!?\[(label)\]\[(ref)\]/).replace(`label`,Lt).replace(`ref`,cn).getRegex();var Jo=w(/^!?\[(ref)\](?:\[\])?/).replace(`ref`,cn).getRegex();var Ri=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/;var er=w(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace(`brackets`,Ki).getRegex();var tr=w(`reflink|nolink(?!\\()`,`g`).replace(`reflink`,w(/^!?\[(label)\]\[(ref)\]/).replace(`label`,er).replace(`ref`,Ri).getRegex()).replace(`nolink`,w(/^!?\[(ref)\](?:\[\])?/).replace(`ref`,Ri).getRegex()).getRegex();var zi=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;var mn={_backpedal:me,anyPunctuation:Go,autolink:Zo,blockSkip:Oo,br:Gi,code:Mo,del:me,delLDelim:me,delRDelim:me,emStrongLDelim:Do,emStrongRDelimAst:$o,emStrongRDelimUnd:Vo,escape:So,link:Ko,nolink:Jo,punctuation:Po,reflink:Yo,reflinkSearch:tr,tag:Xo,text:No,url:me};var nr=S(p({},mn),{emStrongLDelim:zo,emStrongRDelimAst:Ho,emStrongRDelimUnd:qo,link:w(/^!?\[(label)\]\((.*?)\)/).replace(`label`,Lt).getRegex(),reflink:w(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace(`label`,Lt).getRegex()});var nn=S(p({},mn),{emStrongRDelimAst:Fo,emStrongLDelim:Ao,delLDelim:jo,delRDelim:Wo,url:w(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace(`protocol`,zi).replace(`email`,/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:w(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace(`protocol`,zi).getRegex()});var ir=S(p({},nn),{br:w(Gi).replace(`{2,}`,`*`).getRegex(),text:w(nn.text).replace(`\\b_`,`\\b_| {2,}\\n`).replace(/\{2,\}/g,`*`).getRegex()});var Ft={normal:pn,gfm:wo,pedantic:ko};var qe={normal:mn,gfm:nn,breaks:ir,pedantic:nr};var ar={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`};var $i=n=>ar[n];function K(n,t){if(t){if(L.escapeTest.test(n))return n.replace(L.escapeReplace,$i)}else if(L.escapeTestNoEncode.test(n))return n.replace(L.escapeReplaceNoEncode,$i);return n}function Fi(n){try{n=encodeURI(n).replace(L.percentDecode,`%`)}catch{return null}return n}function Li(n,t){let i=n.replace(L.findPipe,(o,l,c)=>{let u=!1,h=l;for(;--h>=0&&c[h]===`\\`;)u=!u;return u?`|`:` |`}).split(L.splitPipe),a=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),t)if(i.length>t)i.splice(t);else for(;i.length<t;)i.push(``);for(;a<i.length;a++)i[a]=i[a].trim().replace(L.slashPipe,`|`);return i}function de(n,t,e){let i=n.length;if(i===0)return``;let a=0;for(;a<i;){let o=n.charAt(i-a-1);if(o===t&&!e)a++;else if(o!==t&&e)a++;else break}return n.slice(0,i-a)}function Hi(n){let t=n.split(`
`),e=t.length-1;for(;e>=0&&L.blankLine.test(t[e]);)e--;return t.length-e<=2?n:t.slice(0,e+1).join(`
`)}function Ht(n){return n.toLowerCase().toUpperCase().toLowerCase()}function or(n,t){if(n.indexOf(t[1])===-1)return-1;let e=0;for(let i=0;i<n.length;i++)if(n[i]===`\\`)i++;else if(n[i]===t[0])e++;else if(n[i]===t[1]&&(e--,e<0))return i;return e>0?-2:-1}function rr(n,t=0){let e=t,i=``;for(let a of n)if(a===`	`){let o=4-e%4;i+=` `.repeat(o),e+=o}else i+=a,e++;return i}function Vi(n,t,e,i,a){let o=t.href,l=t.title||null,c=n[1].replace(a.other.outputLinkReplace,`$1`),u=n[0].charAt(0)===`!`;i.state.inLink=!0;let h=i.state.linkEmitted,v=i.state.inRawBlock;i.state.linkEmitted=!1;let y=i.inlineTokens(c),T=i.state.linkEmitted;if(i.state.linkEmitted=h,i.state.inLink=!1,!u){if(T){i.state.inRawBlock=v;return}i.state.linkEmitted=!0}return{type:u?`image`:`link`,raw:e,href:o,title:l,text:c,tokens:y}}function sr(n,t,e){let i=n.match(e.other.indentCodeCompensation);if(i===null)return t;let a=i[1];return t.split(`
`).map(o=>{let l=o.match(e.other.beginningSpace);if(l===null)return o;let[c]=l;return o.slice(Math.min(c.length,a.length))}).join(`
`)}function Bi(n,t,e,i){if(!t.includes(`<`))return!1;for(let a=0;a<t.length;a++){if(t[a]===`\\`){a++;continue}if(t[a]==="`"){let c=i.inline.code.exec(t.slice(a));if(c){a+=c[0].length-1;continue}}if(t[a]!==`<`)continue;let o=n.slice(e+a),l=i.inline.tag.exec(o)||i.inline.autolink.exec(o);if(l){if(l[0].length>t.length-a)return!0;a+=l[0].length-1}}return!1}var Vt=class{options;rules;lexer;constructor(n){this.options=n||ue}space(n){let t=this.rules.block.newline.exec(n);if(t&&t[0].length>0)return{type:`space`,raw:t[0]}}code(n){let t=this.rules.block.code.exec(n);if(t){let e=this.options.pedantic?t[0]:Hi(t[0]);return{type:`code`,raw:e,codeBlockStyle:`indented`,text:e.replace(this.rules.other.codeRemoveIndent,``)}}}fences(n){let t=this.rules.block.fences.exec(n);if(t){let e=t[0],i=sr(e,t[3]||``,this.rules);return{type:`code`,raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,`$1`):t[2],text:i}}}heading(n){let t=this.rules.block.heading.exec(n);if(t){let e=t[2].trim();if(this.rules.other.endingHash.test(e)){let i=de(e,`#`);(this.options.pedantic||!i||this.rules.other.endingSpaceTabChar.test(i))&&(e=i.trim())}return{type:`heading`,raw:de(t[0],`
`),depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(n){let t=this.rules.block.hr.exec(n);if(t)return{type:`hr`,raw:de(t[0],`
`)}}blockquote(n){let t=this.rules.block.blockquote.exec(n);if(t){let e=de(t[0],`
`).split(`
`),i=``,a=``,o=[];for(;e.length>0;){let l=!1,c=[],u;for(u=0;u<e.length;u++)if(this.rules.other.blockquoteStart.test(e[u]))c.push(e[u]),l=!0;else if(!l)c.push(e[u]);else break;e=e.slice(u);let h=c.join(`
`),v=h.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,``);i=i?`${i}
${h}`:h,a=a?`${a}
${v}`:v;let y=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(v,o,!0),this.lexer.state.top=y,e.length===0)break;let T=o.at(-1);if(T?.type===`code`)break;if(T?.type===`blockquote`){let H=T,O=e.join(`
`),ae=H.raw+`
`+O.replace(this.rules.other.blockquoteSetextReplace2,``),Ae=this.blockquote(ae);o[o.length-1]=Ae,i=`${i}
${O}`,a=a.substring(0,a.length-H.text.length)+Ae.text;break}else if(T?.type===`list`){let H=T,O=H.raw+`
`+e.join(`
`),ae=this.list(O);o[o.length-1]=ae,i=i.substring(0,i.length-T.raw.length)+ae.raw,a=a.substring(0,a.length-H.raw.length)+ae.raw,e=O.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:`blockquote`,raw:i,tokens:o,text:a}}}list(n){let t=this.rules.block.list.exec(n);if(t){let e=t[1].trim(),i=e.length>1,a={type:`list`,raw:``,ordered:i,start:i?+e.slice(0,-1):``,loose:!1,items:[]};e=i?`\\d{1,9}\\${e.slice(-1)}`:`\\${e}`,this.options.pedantic&&(e=i?e:`[*+-]`);let o=this.rules.other.listItemRegex(e),l=!1;for(;n;){let u=!1,h=``,v=``;if(!(t=o.exec(n))||this.rules.block.hr.test(n))break;h=t[0],n=n.substring(h.length);let y=rr(t[2].split(`
`,1)[0],t[1].length),T=n.split(`
`,1)[0],H=!y.trim(),O=0;if(this.options.pedantic?(O=2,v=y.trimStart()):H?O=t[1].length+1:(O=y.search(this.rules.other.nonSpaceChar),O=O>4?1:O,v=y.slice(O),O+=t[1].length),H&&this.rules.other.blankLine.test(T)&&(h+=T+`
`,n=n.substring(T.length+1),u=!0),!u){let ae=this.rules.other.nextBulletRegex(O),Ae=this.rules.other.hrRegex(O),un=this.rules.other.fencesBeginRegex(O),gn=this.rules.other.headingBeginRegex(O),ea=this.rules.other.htmlBeginRegex(O),ta=this.rules.other.blockquoteBeginRegex(O);for(;n;){let Kt=n.split(`
`,1)[0],Re;if(T=Kt,this.options.pedantic?(T=T.replace(this.rules.other.listReplaceNesting,`  `),Re=T):Re=T.replace(this.rules.other.tabCharGlobal,`    `),un.test(T)||gn.test(T)||ea.test(T)||ta.test(T)||ae.test(T)||Ae.test(T))break;if(Re.search(this.rules.other.nonSpaceChar)>=O||!T.trim())v+=`
`+Re.slice(O);else{if(H||y.replace(this.rules.other.tabCharGlobal,`    `).search(this.rules.other.nonSpaceChar)>=4||un.test(y)||gn.test(y)||Ae.test(y))break;v+=`
`+T}H=!T.trim(),h+=Kt+`
`,n=n.substring(Kt.length+1),y=Re.slice(O)}}a.loose||(l?a.loose=!0:this.rules.other.doubleBlankLine.test(h)&&(l=!0)),a.items.push({type:`list_item`,raw:h,task:!!this.options.gfm&&this.rules.other.listIsTask.test(v),loose:!1,text:v,tokens:[]}),a.raw+=h}let c=a.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;a.raw=a.raw.trimEnd();for(let u of a.items)if(this.lexer.state.top=!1,u.tokens=this.lexer.blockTokens(u.text,[]),!a.loose){let h=u.tokens.filter(y=>y.type===`space`);a.loose=h.length>0&&h.some(y=>this.rules.other.anyLine.test(y.raw))}for(let u of a.items){let h=u.tokens[0];if(u.task&&(h?.type===`text`||h?.type===`paragraph`)){u.text=u.text.replace(this.rules.other.listReplaceTask,``),h.raw=h.raw.replace(this.rules.other.listReplaceTask,``),h.text=h.text.replace(this.rules.other.listReplaceTask,``);for(let y=this.lexer.inlineQueue.length-1;y>=0;y--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[y].src)){this.lexer.inlineQueue[y].src=this.lexer.inlineQueue[y].src.replace(this.rules.other.listReplaceTask,``);break}let v=this.rules.other.listTaskCheckbox.exec(u.raw);if(v){let y={type:`checkbox`,raw:v[0]+` `,checked:v[0]!==`[ ]`};u.checked=y.checked,a.loose?u.tokens[0]&&[`paragraph`,`text`].includes(u.tokens[0].type)&&`tokens`in u.tokens[0]&&u.tokens[0].tokens?(u.tokens[0].raw=y.raw+u.tokens[0].raw,u.tokens[0].text=y.raw+u.tokens[0].text,u.tokens[0].tokens.unshift(y)):u.tokens.unshift({type:`paragraph`,raw:y.raw,text:y.raw,tokens:[y]}):u.tokens.unshift(y)}}else u.task&&(u.task=!1)}if(a.loose)for(let u of a.items){u.loose=!0;for(let h of u.tokens)h.type===`text`&&(h.type=`paragraph`)}return a}}html(n){let t=this.rules.block.html.exec(n);if(t){let e=Hi(t[0]);return{type:`html`,block:!0,raw:e,pre:t[1]===`pre`||t[1]===`script`||t[1]===`style`,text:e}}}def(n){let t=this.rules.block.def.exec(n);if(t){let e=Ht(t[1]).replace(this.rules.other.multipleSpaceGlobal,` `),i=t[2]?t[2].replace(this.rules.other.hrefBrackets,`$1`).replace(this.rules.inline.anyPunctuation,`$1`):``,a=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,`$1`):t[3];return{type:`def`,tag:e,raw:de(t[0],`
`),href:i,title:a}}}table(n){let t=this.rules.block.table.exec(n);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let e=Li(t[1]),i=t[2].replace(this.rules.other.tableAlignChars,``).split(`|`),a=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,``).split(`
`):[],o={type:`table`,raw:de(t[0],`
`),header:[],align:[],rows:[]};if(e.length===i.length){for(let l of i)this.rules.other.tableAlignRight.test(l)?o.align.push(`right`):this.rules.other.tableAlignCenter.test(l)?o.align.push(`center`):this.rules.other.tableAlignLeft.test(l)?o.align.push(`left`):o.align.push(null);for(let l=0;l<e.length;l++)o.header.push({text:e[l],tokens:this.lexer.inline(e[l]),header:!0,align:o.align[l]});for(let l of a)o.rows.push(Li(l,o.header.length).map((c,u)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:o.align[u]})));return o}}lheading(n){let t=this.rules.block.lheading.exec(n);if(t){let e=t[1].trim();return{type:`heading`,raw:de(t[0],`
`),depth:t[2].charAt(0)===`=`?1:2,text:e,tokens:this.lexer.inline(e)}}}paragraph(n){let t=this.rules.block.paragraph.exec(n);if(t){let e=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:`paragraph`,raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(n){let t=this.rules.block.text.exec(n);if(t)return{type:`text`,raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(n){let t=this.rules.inline.escape.exec(n);if(t)return{type:`escape`,raw:t[0],text:t[1]}}tag(n){let t=this.rules.inline.tag.exec(n);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:`html`,raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(n){let t=this.rules.inline.link.exec(n);if(t){let e=t[0].charAt(0)===`!`?2:1;if(!this.options.pedantic&&Bi(n,t[1],e,this.rules))return;let i=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(i)){if(!this.rules.other.endAngleBracket.test(i))return;let l=de(i.slice(0,-1),`\\`);if((i.length-l.length)%2===0)return}else{let l=or(t[2],`()`);if(l===-2)return;if(l>-1){let c=(t[0].indexOf(`!`)===0?5:4)+t[1].length+l;t[2]=t[2].substring(0,l),t[0]=t[0].substring(0,c).trim(),t[3]=``}}let a=t[2],o=``;if(this.options.pedantic){let l=this.rules.other.pedanticHrefTitle.exec(a);l&&(a=l[1],o=l[3])}else o=t[3]?t[3].slice(1,-1):``;return a=a.trim(),this.rules.other.startAngleBracket.test(a)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(i)?a=a.slice(1):a=a.slice(1,-1)),Vi(t,{href:a&&a.replace(this.rules.inline.anyPunctuation,`$1`),title:o&&o.replace(this.rules.inline.anyPunctuation,`$1`)},t[0],this.lexer,this.rules)}}reflink(n,t){let e;if((e=this.rules.inline.reflink.exec(n))||(e=this.rules.inline.nolink.exec(n))){let i=e[0].charAt(0)===`!`?2:1;if(!this.options.pedantic&&Bi(n,e[1],i,this.rules))return;let o=t[Ht((e[2]||e[1]).replace(this.rules.other.multipleSpaceGlobal,` `))];if(!o){let l=e[0].charAt(0);return{type:`text`,raw:l,text:l}}return Vi(e,o,e[0],this.lexer,this.rules)}}emStrong(n,t,e=``){let i=this.rules.inline.emStrongLDelim.exec(n);if(!(!i||!i[1]&&!i[2]&&!i[3]&&!i[4]||i[4]&&e.match(this.rules.other.unicodeAlphaNumeric))&&(!(i[1]||i[3])||!e||this.rules.inline.punctuation.exec(e))){let a=[...i[0]].length-1,o,l,c=a,u=0,h=i[0][0],v=e===h,y=h===`*`?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(y.lastIndex=0,t=t.slice(-1*n.length+a);(i=y.exec(t))!==null;){if(o=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!o)continue;if(l=[...o].length,i[3]||i[4]){c+=l;continue}else if(i[5]||i[6]){if(a%3&&!((a+l)%3)){u+=l;continue}if(v)break}if(c-=l,c>0)continue;l=Math.min(l,l+c+u);let T=[...i[0]][0].length,H=n.slice(0,a+i.index+T+l);if(Math.min(a,l)%2){let ae=H.slice(1,-1);return{type:`em`,raw:H,text:ae,tokens:this.lexer.inlineTokens(ae)}}let O=H.slice(2,-2);return{type:`strong`,raw:H,text:O,tokens:this.lexer.inlineTokens(O)}}}}codespan(n){let t=this.rules.inline.code.exec(n);if(t){let e=t[2].replace(this.rules.other.newLineCharGlobal,` `),i=this.rules.other.nonSpaceChar.test(e),a=this.rules.other.startingSpaceChar.test(e)&&this.rules.other.endingSpaceChar.test(e);return i&&a&&(e=e.substring(1,e.length-1)),{type:`codespan`,raw:t[0],text:e}}}br(n){let t=this.rules.inline.br.exec(n);if(t)return{type:`br`,raw:t[0]}}del(n,t,e=``){let i=this.rules.inline.delLDelim.exec(n);if(i&&(!i[1]||!e||this.rules.inline.punctuation.exec(e))){let a=[...i[0]].length-1,o,l,c=a,u=this.rules.inline.delRDelim;for(u.lastIndex=0,t=t.slice(-1*n.length+a);(i=u.exec(t))!==null;){if(o=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!o||(l=[...o].length,l!==a))continue;if(i[3]||i[4]){c+=l;continue}if(c-=l,c>0)continue;l=Math.min(l,l+c);let h=[...i[0]][0].length,v=n.slice(0,a+i.index+h+l),y=v.slice(a,-a);return{type:`del`,raw:v,text:y,tokens:this.lexer.inlineTokens(y)}}}}autolink(n){let t=this.rules.inline.autolink.exec(n);if(t){let e,i;return t[2]===`@`?(e=t[1],i=`mailto:`+e):(e=t[1],i=e),{type:`link`,raw:t[0],text:e,href:i,autolink:!0,tokens:[{type:`text`,raw:e,text:e}]}}}url(n){let t;if(t=this.rules.inline.url.exec(n)){let e,i;if(t[2]===`@`)e=t[0],i=`mailto:`+e;else{let a;do a=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??``;while(a!==t[0]);e=t[0],t[1]===`www.`?i=`http://`+t[0]:i=t[0]}return{type:`link`,raw:t[0],text:e,href:i,autolink:!0,tokens:[{type:`text`,raw:e,text:e}]}}}inlineText(n){let t=this.rules.inline.text.exec(n);if(t){let e=this.lexer.state.inRawBlock;return{type:`text`,raw:t[0],text:t[0],escaped:e}}}};var ne=class an{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||ue,this.options.tokenizer=this.options.tokenizer||new Vt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,top:!0};let e={other:L,block:Ft.normal,inline:qe.normal};this.options.pedantic?(e.block=Ft.pedantic,e.inline=qe.pedantic):this.options.gfm&&(e.block=Ft.gfm,this.options.breaks?e.inline=qe.breaks:e.inline=qe.gfm),this.tokenizer.rules=e}static get rules(){return{block:Ft,inline:qe}}static lex(t,e){return new an(e).lex(t)}static lexInline(t,e){return new an(e).inlineTokens(t)}lex(t){t=t.replace(L.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){let i=this.inlineQueue[e];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,e=[],i=!1){this.tokenizer.lexer=this,this.options.pedantic&&(t=t.replace(L.tabCharGlobal,`    `).replace(L.spaceLine,``));let a=Infinity;for(;t;){if(t.length<a)a=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}let o;if(this.options.extensions?.block?.some(c=>(o=c.call({lexer:this},t,e))?(t=t.substring(o.raw.length),e.push(o),!0):!1))continue;if(o=this.tokenizer.space(t)){t=t.substring(o.raw.length);let c=e.at(-1);o.raw.length===1&&c!==void 0?c.raw+=`
`:e.push(o);continue}if(o=this.tokenizer.code(t)){t=t.substring(o.raw.length);let c=e.at(-1);c?.type===`paragraph`||c?.type===`text`?(c.raw+=(c.raw.endsWith(`
`)?``:`
`)+o.raw,c.text+=`
`+o.text,this.inlineQueue.at(-1).src=c.text):e.push(o);continue}if(o=this.tokenizer.fences(t)){t=t.substring(o.raw.length),e.push(o);continue}if(o=this.tokenizer.heading(t)){t=t.substring(o.raw.length),e.push(o);continue}if(o=this.tokenizer.hr(t)){t=t.substring(o.raw.length),e.push(o);continue}if(o=this.tokenizer.blockquote(t)){t=t.substring(o.raw.length),e.push(o);continue}if(o=this.tokenizer.list(t)){t=t.substring(o.raw.length),e.push(o);continue}if(o=this.tokenizer.html(t)){t=t.substring(o.raw.length),e.push(o);continue}if(o=this.tokenizer.def(t)){t=t.substring(o.raw.length);let c=e.at(-1);c?.type===`paragraph`||c?.type===`text`?(c.raw+=(c.raw.endsWith(`
`)?``:`
`)+o.raw,c.text+=`
`+o.raw,this.inlineQueue.at(-1).src=c.text):this.tokens.links[o.tag]||(this.tokens.links[o.tag]={href:o.href,title:o.title},e.push(o));continue}if(o=this.tokenizer.table(t)){t=t.substring(o.raw.length),e.push(o);continue}if(o=this.tokenizer.lheading(t)){t=t.substring(o.raw.length),e.push(o);continue}let l=t;if(this.options.extensions?.startBlock){let c=Infinity,u=t.slice(1),h;this.options.extensions.startBlock.forEach(v=>{h=v.call({lexer:this},u),typeof h==`number`&&h>=0&&(c=Math.min(c,h))}),c<Infinity&&c>=0&&(l=t.substring(0,c+1))}if(this.state.top&&(o=this.tokenizer.paragraph(l))){let c=e.at(-1);i&&c?.type===`paragraph`?(c.raw+=(c.raw.endsWith(`
`)?``:`
`)+o.raw,c.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=c.text):e.push(o),i=l.length!==t.length,t=t.substring(o.raw.length);continue}if(o=this.tokenizer.text(t)){t=t.substring(o.raw.length);let c=e.at(-1);c?.type===`text`?(c.raw+=(c.raw.endsWith(`
`)?``:`
`)+o.raw,c.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=c.text):e.push(o);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return this.state.top=!0,e}inline(t,e=[]){return this.inlineQueue.push({src:t,tokens:e}),e}linkInText(t){if(!t.includes(`[`))return!1;let e=this.tokenizer.rules.inline.link;for(let i of t.matchAll(this.tokenizer.rules.inline.blockSkip))if(e.test(i[0])&&t.charAt(i.index-1)!==`!`)return!0;for(let i of t.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let a=i[0],o=a.lastIndexOf(`[`);if(!(a.charAt(0)===`!`||!Object.hasOwn(this.tokens.links,Ht(a.slice(o+1,-1))))&&!(o>1&&this.linkInText(a.slice(1,o-1))))return!0}return!1}inlineTokens(t,e=[]){this.tokenizer.lexer=this;let i=t;if(this.tokens.links&&t.includes(`[`)){let c=this.tokenizer.rules.inline.reflinkSearch,u=h=>{let v=h.lastIndexOf(`[`);if(!Object.hasOwn(this.tokens.links,Ht(h.slice(v+1,-1))))return h;if(v>1&&h.charAt(0)!==`!`){let y=h.slice(1,v-1);if(this.linkInText(y))return`[`+y.replace(c,u)+`][`+`a`.repeat(h.length-v-2)+`]`}return`[`+`a`.repeat(h.length-2)+`]`};i=i.replace(c,u)}i=i.replace(this.tokenizer.rules.inline.anyPunctuation,c=>`+`.repeat(c.length)),i=i.replace(this.tokenizer.rules.inline.blockSkip,(c,u,h)=>{let v=h?h.length:0;return c.slice(0,v)+`[`+`a`.repeat(c.length-v-2)+`]`}),i=this.options.hooks?.emStrongMask?.call({lexer:this},i)??i;let a=!1,o=``,l=Infinity;for(;t;){if(t.length<l)l=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}a||(o=``),a=!1;let c;if(this.options.extensions?.inline?.some(h=>(c=h.call({lexer:this},t,e))?(t=t.substring(c.raw.length),e.push(c),!0):!1))continue;if(c=this.tokenizer.escape(t)){t=t.substring(c.raw.length),e.push(c);continue}if(c=this.tokenizer.tag(t)){t=t.substring(c.raw.length),e.push(c);continue}if(c=this.tokenizer.link(t)){t=t.substring(c.raw.length),e.push(c);continue}if(c=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(c.raw.length);let h=e.at(-1);c.type===`text`&&h?.type===`text`?(h.raw+=c.raw,h.text+=c.text):e.push(c);continue}if(c=this.tokenizer.emStrong(t,i,o)){t=t.substring(c.raw.length),e.push(c);continue}if(c=this.tokenizer.codespan(t)){t=t.substring(c.raw.length),e.push(c);continue}if(c=this.tokenizer.br(t)){t=t.substring(c.raw.length),e.push(c);continue}if(c=this.tokenizer.del(t,i,o)){t=t.substring(c.raw.length),e.push(c);continue}if(c=this.tokenizer.autolink(t)){t=t.substring(c.raw.length),e.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(t))){t=t.substring(c.raw.length),e.push(c);continue}let u=t;if(this.options.extensions?.startInline){let h=Infinity,v=t.slice(1),y;this.options.extensions.startInline.forEach(T=>{y=T.call({lexer:this},v),typeof y==`number`&&y>=0&&(h=Math.min(h,y))}),h<Infinity&&h>=0&&(u=t.substring(0,h+1))}if(c=this.tokenizer.inlineText(u)){t=t.substring(c.raw.length),c.raw.slice(-1)!==`_`&&(o=c.raw.slice(-1)),a=!0;let h=e.at(-1);h?.type===`text`?(h.raw+=c.raw,h.text+=c.text):e.push(c);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return e}infiniteLoopError(t){let e=`Infinite loop on byte: `+t;if(this.options.silent)console.error(e);else throw new Error(e)}};var Bt=class{options;parser;constructor(n){this.options=n||ue}space(n){return``}code({text:n,lang:t,escaped:e}){let i=(t||``).match(L.notSpaceStart)?.[0],a=n?n.replace(L.endingNewline,``)+`
`:``;return i?`<pre><code class="language-`+K(i)+`">`+(e?a:K(a,!0))+`</code></pre>
`:`<pre><code>`+(e?a:K(a,!0))+`</code></pre>
`}blockquote({tokens:n}){return`<blockquote>
${this.parser.parse(n)}</blockquote>
`}html({text:n}){return n}def(n){return``}heading({tokens:n,depth:t}){return`<h${t}>${this.parser.parseInline(n)}</h${t}>
`}hr(n){return`<hr>
`}list(n){let t=n.ordered,e=n.start,i=``;for(let l=0;l<n.items.length;l++){let c=n.items[l];i+=this.listitem(c)}let a=t?`ol`:`ul`,o=t&&e!==1?` start="`+e+`"`:``;return`<`+a+o+`>
`+i+`</`+a+`>
`}listitem(n){return`<li>${this.parser.parse(n.tokens)}</li>
`}checkbox({checked:n}){return`<input `+(n?`checked="" `:``)+`disabled="" type="checkbox"> `}paragraph({tokens:n}){return`<p>${this.parser.parseInline(n)}</p>
`}table(n){let t=``,e=``;for(let a=0;a<n.header.length;a++)e+=this.tablecell(n.header[a]);t+=this.tablerow({text:e});let i=``;for(let a=0;a<n.rows.length;a++){let o=n.rows[a];e=``;for(let l=0;l<o.length;l++)e+=this.tablecell(o[l]);i+=this.tablerow({text:e})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+i+`</table>
`}tablerow({text:n}){return`<tr>
${n}</tr>
`}tablecell(n){let t=this.parser.parseInline(n.tokens),e=n.header?`th`:`td`;return(n.align?`<${e} align="${n.align}">`:`<${e}>`)+t+`</${e}>
`}strong({tokens:n}){return`<strong>${this.parser.parseInline(n)}</strong>`}em({tokens:n}){return`<em>${this.parser.parseInline(n)}</em>`}codespan({text:n}){return`<code>${K(n,!0)}</code>`}br(n){return`<br>`}del({tokens:n}){return`<del>${this.parser.parseInline(n)}</del>`}link({href:n,title:t,text:e,tokens:i,autolink:a}){let o=a?K(e,!0):this.parser.parseInline(i),l=Fi(n);if(l===null)return o;n=K(l,a);let c=`<a href="`+n+`"`;return t&&(c+=` title="`+K(t)+`"`),c+=`>`+o+`</a>`,c}image({href:n,title:t,text:e,tokens:i}){i&&(e=this.parser.parseInline(i,this.parser.textRenderer));let a=Fi(n);if(a===null)return K(e);n=a;let o=`<img src="${K(n)}" alt="${K(e)}"`;return t&&(o+=` title="${K(t)}"`),o+=`>`,o}text(n){return`tokens`in n&&n.tokens?this.parser.parseInline(n.tokens):`escaped`in n&&n.escaped?n.text:K(n.text)}};var hn=class{strong({text:n}){return n}em({text:n}){return n}codespan({text:n}){return n}del({text:n}){return n}html({text:n}){return n}text({text:n}){return n}link({text:n}){return``+n}image({text:n}){return``+n}br(){return``}checkbox({raw:n}){return n}};var ie=class on{options;renderer;textRenderer;constructor(t){this.options=t||ue,this.options.renderer=this.options.renderer||new Bt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new hn}static parse(t,e){return new on(e).parse(t)}static parseInline(t,e){return new on(e).parseInline(t)}parse(t){this.renderer.parser=this;let e=``;for(let i=0;i<t.length;i++){let a=t[i];if(this.options.extensions?.renderers?.[a.type]){let l=a,c=this.options.extensions.renderers[l.type].call({parser:this},l);if(c!==!1||![`space`,`hr`,`heading`,`code`,`table`,`blockquote`,`list`,`checkbox`,`html`,`def`,`paragraph`,`text`].includes(l.type)){e+=c||``;continue}}let o=a;switch(o.type){case`space`:e+=this.renderer.space(o);break;case`hr`:e+=this.renderer.hr(o);break;case`heading`:e+=this.renderer.heading(o);break;case`code`:e+=this.renderer.code(o);break;case`table`:e+=this.renderer.table(o);break;case`blockquote`:e+=this.renderer.blockquote(o);break;case`list`:e+=this.renderer.list(o);break;case`checkbox`:e+=this.renderer.checkbox(o);break;case`html`:e+=this.renderer.html(o);break;case`def`:e+=this.renderer.def(o);break;case`paragraph`:e+=this.renderer.paragraph(o);break;case`text`:e+=this.renderer.text(o);break;default:{let l=`Token with "`+o.type+`" type was not found.`;if(this.options.silent)return console.error(l),``;throw new Error(l)}}}return e}parseInline(t,e=this.renderer){this.renderer.parser=this;let i=``;for(let a=0;a<t.length;a++){let o=t[a];if(this.options.extensions?.renderers?.[o.type]){let c=this.options.extensions.renderers[o.type].call({parser:this},o);if(c!==!1||![`escape`,`html`,`link`,`image`,`checkbox`,`strong`,`em`,`codespan`,`br`,`del`,`text`].includes(o.type)){i+=c||``;continue}}let l=o;switch(l.type){case`escape`:i+=e.text(l);break;case`html`:i+=e.html(l);break;case`link`:i+=e.link(l);break;case`image`:i+=e.image(l);break;case`checkbox`:i+=e.checkbox(l);break;case`strong`:i+=e.strong(l);break;case`em`:i+=e.em(l);break;case`codespan`:i+=e.codespan(l);break;case`br`:i+=e.br(l);break;case`del`:i+=e.del(l);break;case`text`:i+=e.text(l);break;default:{let c=`Token with "`+l.type+`" type was not found.`;if(this.options.silent)return console.error(c),``;throw new Error(c)}}}return i}};var je=class{options;block;constructor(n){this.options=n||ue}static passThroughHooks=new Set([`preprocess`,`postprocess`,`processAllTokens`,`emStrongMask`]);static passThroughHooksRespectAsync=new Set([`preprocess`,`postprocess`,`processAllTokens`]);preprocess(n){return n}postprocess(n){return n}processAllTokens(n){return n}emStrongMask(n){return n}provideLexer(n=this.block){return n?ne.lex:ne.lexInline}provideParser(n=this.block){return n?ie.parse:ie.parseInline}};var lr=class{defaults=rn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=ie;Renderer=Bt;TextRenderer=hn;Lexer=ne;Tokenizer=Vt;Hooks=je;constructor(...n){this.use(...n)}walkTokens(n,t){let e=[];for(let i of n)switch(e=e.concat(t.call(this,i)),i.type){case`table`:{let a=i;for(let o of a.header)e=e.concat(this.walkTokens(o.tokens,t));for(let o of a.rows)for(let l of o)e=e.concat(this.walkTokens(l.tokens,t));break}case`list`:{let a=i;e=e.concat(this.walkTokens(a.items,t));break}default:{let a=i;this.defaults.extensions?.childTokens?.[a.type]?this.defaults.extensions.childTokens[a.type].forEach(o=>{let l=a[o].flat(Infinity);e=e.concat(this.walkTokens(l,t))}):a.tokens&&(e=e.concat(this.walkTokens(a.tokens,t)))}}return e}use(...n){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return n.forEach(e=>{let i=p({},e);if(i.async=this.defaults.async||i.async||!1,e.extensions&&(e.extensions.forEach(a=>{if(!a.name)throw new Error(`extension name required`);if(`renderer`in a){let o=t.renderers[a.name];o?t.renderers[a.name]=function(...l){let c=a.renderer.apply(this,l);return c===!1&&(c=o.apply(this,l)),c}:t.renderers[a.name]=a.renderer}if(`tokenizer`in a){if(!a.level||a.level!==`block`&&a.level!==`inline`)throw new Error(`extension level must be 'block' or 'inline'`);let o=t[a.level];o?o.unshift(a.tokenizer):t[a.level]=[a.tokenizer],a.start&&(a.level===`block`?t.startBlock?t.startBlock.push(a.start):t.startBlock=[a.start]:a.level===`inline`&&(t.startInline?t.startInline.push(a.start):t.startInline=[a.start]))}`childTokens`in a&&a.childTokens&&(t.childTokens[a.name]=a.childTokens)}),i.extensions=t),e.renderer){let a=this.defaults.renderer||new Bt(this.defaults);for(let o in e.renderer){if(!(o in a))throw new Error(`renderer '${o}' does not exist`);if([`options`,`parser`].includes(o))continue;let l=o,c=e.renderer[l],u=a[l];a[l]=(...h)=>{let v=c.apply(a,h);return v===!1&&(v=u.apply(a,h)),v||``}}i.renderer=a}if(e.tokenizer){let a=this.defaults.tokenizer||new Vt(this.defaults);for(let o in e.tokenizer){if(!(o in a))throw new Error(`tokenizer '${o}' does not exist`);if([`options`,`rules`,`lexer`].includes(o))continue;let l=o,c=e.tokenizer[l],u=a[l];a[l]=(...h)=>{let v=c.apply(a,h);return v===!1&&(v=u.apply(a,h)),v}}i.tokenizer=a}if(e.hooks){let a=this.defaults.hooks||new je;for(let o in e.hooks){if(!(o in a))throw new Error(`hook '${o}' does not exist`);if([`options`,`block`].includes(o))continue;let l=o,c=e.hooks[l],u=a[l];je.passThroughHooks.has(o)?a[l]=h=>{if(this.defaults.async&&je.passThroughHooksRespectAsync.has(o))return(async()=>{let y=await c.call(a,h);return u.call(a,y)})();let v=c.call(a,h);return u.call(a,v)}:a[l]=(...h)=>{if(this.defaults.async)return(async()=>{let y=await c.apply(a,h);return y===!1&&(y=await u.apply(a,h)),y})();let v=c.apply(a,h);return v===!1&&(v=u.apply(a,h)),v}}i.hooks=a}if(e.walkTokens){let a=this.defaults.walkTokens,o=e.walkTokens;i.walkTokens=function(l){let c=[];return c.push(o.call(this,l)),a&&(c=c.concat(a.call(this,l))),c}}this.defaults=p(p({},this.defaults),i)}),this}setOptions(n){return this.defaults=p(p({},this.defaults),n),this}lexer(n,t){return ne.lex(n,t??this.defaults)}parser(n,t){return ie.parse(n,t??this.defaults)}parseMarkdown(n){return(t,e)=>{let i=p({},e),a=p(p({},this.defaults),i),o=this.onError(!!a.silent,!!a.async);if(this.defaults.async===!0&&i.async===!1)return o(new Error(`marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.`));if(typeof t>`u`||t===null)return o(new Error(`marked(): input parameter is undefined or null`));if(typeof t!=`string`)return o(new Error(`marked(): input parameter is of type `+Object.prototype.toString.call(t)+`, string expected`));if(a.hooks&&(a.hooks.options=a,a.hooks.block=n),a.async)return(async()=>{let l=a.hooks?await a.hooks.preprocess(t):t,c=await(a.hooks?await a.hooks.provideLexer(n):n?ne.lex:ne.lexInline)(l,a),u=a.hooks?await a.hooks.processAllTokens(c):c;a.walkTokens&&await Promise.all(this.walkTokens(u,a.walkTokens));let h=await(a.hooks?await a.hooks.provideParser(n):n?ie.parse:ie.parseInline)(u,a);return a.hooks?await a.hooks.postprocess(h):h})().catch(o);try{a.hooks&&(t=a.hooks.preprocess(t));let l=(a.hooks?a.hooks.provideLexer(n):n?ne.lex:ne.lexInline)(t,a);a.hooks&&(l=a.hooks.processAllTokens(l)),a.walkTokens&&this.walkTokens(l,a.walkTokens);let c=(a.hooks?a.hooks.provideParser(n):n?ie.parse:ie.parseInline)(l,a);return a.hooks&&(c=a.hooks.postprocess(c)),c}catch(l){return o(l)}}}onError(n,t){return e=>{if(e.message+=`
Please report this to https://github.com/markedjs/marked.`,n){let i=`<p>An error occurred:</p><pre>`+K(e.message+``,!0)+`</pre>`;return t?Promise.resolve(i):i}if(t)return Promise.reject(e);throw e}}};var he=new lr;function P(n,t){return he.parse(n,t)}P.options=P.setOptions=function(n){return he.setOptions(n),P.defaults=he.defaults,qi(P.defaults),P};P.getDefaults=rn;P.defaults=ue;function cr(...n){return he.use(...n),P.defaults=he.defaults,qi(P.defaults),P}P.use=cr;P.walkTokens=function(n,t){return he.walkTokens(n,t)};P.parseInline=he.parseInline;P.Parser=ie;P.parser=ie.parse;P.Renderer=Bt;P.TextRenderer=hn;P.Lexer=ne;P.lexer=ne.lex;P.Tokenizer=Vt;P.Hooks=je;P.parse=P;P.options;P.setOptions;P.walkTokens;P.parseInline;ie.parse;ne.lex;var qt=class n{constructor(){this.sanitizer=u(Ha);P.setOptions({gfm:!0,breaks:!0})}render(t){if(!t||!t.trim())return``;try{let e=P.parse(t,{async:!1}),i=this.sanitizer.sanitize(ce.HTML,e)??``;return this.sanitizer.bypassSecurityTrustHtml(i)}catch{let e=this.sanitizer.sanitize(ce.HTML,t)??``;return this.sanitizer.bypassSecurityTrustHtml(e)}}renderString(t){if(!t||!t.trim())return``;try{let e=P.parse(t,{async:!1});return this.sanitizer.sanitize(ce.HTML,e)??``}catch{return this.sanitizer.sanitize(ce.HTML,t)??``}}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵprov=W({token:n,factory:n.ɵfac,providedIn:`root`})}};var De=class n{constructor(){this.content=Mi$1(``);this.markdown=u(qt);this.rendered=x(()=>this.markdown.render(this.content()))}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-markdown`]],inputs:{content:[1,`content`]},decls:1,vars:1,consts:[[1,`markdown-body`,3,`innerHTML`]],template:function(e,i){e&1&&It$1(0,`div`,0),e&2&&dn$1(`innerHTML`,i.rendered(),LN)},styles:[`.markdown-body{line-height:1.6;white-space:normal;word-break:break-word}.markdown-body h1,.markdown-body h2,.markdown-body h3,.markdown-body h4,.markdown-body h5,.markdown-body h6{margin-top:1rem;margin-bottom:.5rem;font-weight:600;line-height:1.25;color:inherit}.markdown-body h1{font-size:1.35rem}.markdown-body h2{font-size:1.2rem}.markdown-body h3{font-size:1.1rem}.markdown-body h4{font-size:1rem}.markdown-body p{margin-top:0;margin-bottom:.75rem}.markdown-body p:last-child{margin-bottom:0}.markdown-body ul,.markdown-body ol{margin-top:0;margin-bottom:.75rem;padding-inline-start:1.5rem}.markdown-body ul li,.markdown-body ol li{margin-bottom:.25rem}.markdown-body blockquote{margin:.75rem 0;padding:.5rem 1rem;border-left:3px solid var(--%NS%mat-sys-primary, #00639b);background-color:var(--%NS%mat-sys-surface-container-low, rgba(0, 0, 0, .03));border-radius:0 4px 4px 0}.markdown-body pre{margin:.75rem 0;padding:.75rem 1rem;background-color:var(--%NS%mat-sys-surface-container-highest, rgba(0, 0, 0, .08));color:var(--%NS%mat-sys-on-surface, inherit);border-radius:8px;overflow-x:auto;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.85rem;line-height:1.45}.markdown-body pre code{background:none;padding:0;border-radius:0;font-size:inherit;color:inherit}.markdown-body code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.85em;padding:.15em .35em;background-color:var(--%NS%mat-sys-surface-container-highest, rgba(0, 0, 0, .08));border-radius:4px}.markdown-body table{border-collapse:collapse;width:100%;margin:.75rem 0;font-size:.9rem}.markdown-body table th,.markdown-body table td{border:1px solid var(--%NS%mat-sys-outline-variant, rgba(0, 0, 0, .12));padding:.5rem .75rem;text-align:left}.markdown-body table th{background-color:var(--%NS%mat-sys-surface-container, rgba(0, 0, 0, .04));font-weight:600}.markdown-body a{color:var(--%NS%mat-sys-primary, #00639b);text-decoration:underline}.markdown-body a:hover{text-decoration:none}.markdown-body hr{border:none;border-top:1px solid var(--%NS%mat-sys-outline-variant, rgba(0, 0, 0, .12));margin:1rem 0}
`],encapsulation:2})}};function dr(n,t){if(n&1&&(ue$1(0,`div`,4),kp(1),ve()),n&2){let e=Ke();le$1(),Td(e.permission().method)}}function pr(n,t){if(n&1&&(ue$1(0,`div`,5),rt(1,`hub-markdown`,8),ve()),n&2){let e=Ke();le$1(),yt(`content`,e.permission().description)}}function mr(n,t){if(n&1&&(ue$1(0,`pre`),kp(1),ve()),n&2){let e=Ke();le$1(),Td(e.permission().description||e.permission().method||`Action requested`)}}function hr(n,t){if(n&1&&(ue$1(0,`div`,6)(1,`mat-icon`),kp(2,`check`),ve(),ue$1(3,`span`),kp(4),ve()()),n&2){let e=Ke();le$1(4),Op(`Responded: `,e.permission().decision||`Handled`)}}function ur(n,t){n&1&&rt(0,`mat-spinner`,11)}function gr(n,t){if(n&1&&kp(0),n&2)Op(` `,Ke(2).isPlanApproval()?`Approve Plan`:`Allow`,` `)}function fr(n,t){if(n&1){let e=Rp();ue$1(0,`mat-card-actions`,7)(1,`button`,9),Fe(`click`,function(){gr$1(e);return vr$1(Ke().respond(!1))}),kp(2),ve(),ue$1(3,`button`,10),Fe(`click`,function(){gr$1(e);return vr$1(Ke().respond(!0))}),Me(4,ur,1,0,`mat-spinner`,11)(5,gr,1,1),ve()()}if(n&2){let e=Ke();le$1(),yt(`disabled`,e.responding()),le$1(),Op(` `,e.isPlanApproval()?`Reject`:`Deny`,` `),le$1(),yt(`disabled`,e.responding()),le$1(),Te(e.responding()?4:5)}}var jt=class n{constructor(){this.permission=Mi$1.required();this.chatId=Mi$1(``);this.responding=C(!1);this.state=u(gE);this.isPlanApproval=x(()=>this.permission().kind===`switch_mode`||this.permission().title===`Approve Plan`);this.displayTitle=x(()=>this.permission().title||(this.isPlanApproval()?`Approve Plan`:`Permission request`));this.icon=x(()=>this.isPlanApproval()?`assignment_turned_in`:`shield_person`)}async respond(t){if(!(!this.chatId()||!this.permission().requestId)){this.responding.set(!0);try{await this.state.respondPermission(this.chatId(),this.permission().requestId,t)}catch(e){console.error(`Failed to respond to permission request`,e)}finally{this.responding.set(!1)}}}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-permission-card`]],inputs:{permission:[1,`permission`],chatId:[1,`chatId`]},decls:13,vars:9,consts:[[1,`permission`],[1,`permission-header`],[1,`permission-heading`],[1,`permission-title`],[1,`permission-method`],[1,`plan-content`],[1,`decision`],[`align`,`end`],[3,`content`],[`mat-stroked-button`,``,`type`,`button`,3,`click`,`disabled`],[`mat-flat-button`,``,`type`,`button`,3,`click`,`disabled`],[`diameter`,`18`]],template:function(e,i){e&1&&(ue$1(0,`mat-card`,0)(1,`div`,1)(2,`mat-icon`),kp(3),ve(),ue$1(4,`div`,2)(5,`div`,3),kp(6),ve(),Me(7,dr,2,1,`div`,4),ve()(),ue$1(8,`mat-card-content`),Me(9,pr,2,1,`div`,5)(10,mr,2,1,`pre`),ve(),Me(11,hr,5,1,`div`,6)(12,fr,6,4,`mat-card-actions`,7),ve()),e&2&&(J(`plan-approval`,i.isPlanApproval())(`responded`,i.permission().responded),le$1(3),Td(i.icon()),le$1(3),Td(i.displayTitle()),le$1(),Te(i.permission().method&&!i.isPlanApproval()?7:-1),le$1(2),Te(i.isPlanApproval()?9:10),le$1(2),Te(i.permission().responded?11:12))},dependencies:[EX,CX,_,w$2,I$1,A,WX,$X,Ene,Dne,De],styles:[`[_nghost-%COMP%]{display:block}.permission[_ngcontent-%COMP%]{border:1px solid color-mix(in srgb,var(--%NS%mat-sys-error) 50%,transparent);background:var(--%NS%mat-sys-error-container)}.permission.plan-approval[_ngcontent-%COMP%]{border:1px solid color-mix(in srgb,var(--%NS%mat-sys-primary) 50%,transparent);background:var(--%NS%mat-sys-surface-container-high)}.permission.responded[_ngcontent-%COMP%]{border-color:var(--%NS%mat-sys-outline-variant);background:var(--%NS%mat-sys-surface-container-low);opacity:.88}.permission-header[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:12px;padding:16px 16px 0}.permission-header[_ngcontent-%COMP%] > mat-icon[_ngcontent-%COMP%]{flex:0 0 24px;margin-top:2px;color:var(--%NS%mat-sys-error)}.permission.plan-approval[_ngcontent-%COMP%]   .permission-header[_ngcontent-%COMP%] > mat-icon[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary)}.permission-heading[_ngcontent-%COMP%]{min-width:0}.permission-title[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-large)}.permission-method[_ngcontent-%COMP%]{margin-top:2px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-medium);overflow-wrap:anywhere}mat-card-content[_ngcontent-%COMP%]{padding-top:12px}pre[_ngcontent-%COMP%]{margin:0;padding:12px;overflow:auto;border-radius:var(--%NS%mat-sys-corner-small);background:color-mix(in srgb,var(--%NS%mat-sys-surface-container-lowest) 80%,transparent);white-space:pre-wrap;font:inherit}.plan-content[_ngcontent-%COMP%]{padding:8px 12px;border-radius:var(--%NS%mat-sys-corner-small);background:var(--%NS%mat-sys-surface-container-lowest);max-height:480px;overflow-y:auto}mat-card-actions[_ngcontent-%COMP%]{gap:8px}.decision[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;padding:10px 16px 14px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-medium)}.decision[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{flex:0 0 24px}`]})}};function _r(n,t){if(n&1&&(ue$1(0,`li`)(1,`mat-icon`),kp(2),ve(),ue$1(3,`span`),kp(4),ve()()),n&2){let e=t.$implicit,i=Ke(2);J(`completed`,e.status===`completed`),le$1(2),Td(i.statusIcon(e.status)),le$1(2),Td(e.content)}}function br(n,t){if(n&1&&(ue$1(0,`mat-card`,0)(1,`div`,1)(2,`mat-icon`),kp(3,`format_list_bulleted`),ve(),ue$1(4,`span`,2),kp(5,`Execution plan`),ve()(),ue$1(6,`mat-card-content`)(7,`ul`),SA(8,_r,5,4,`li`,3,_A),ve()()()),n&2){let e=Ke();le$1(8),wA(e.entries())}}var Qt=class n{constructor(){this.entries=Mi$1([])}statusIcon(t){return t===`completed`?`check_circle`:t===`in_progress`?`progress_activity`:`radio_button_unchecked`}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-plan-view`]],inputs:{entries:[1,`entries`]},decls:1,vars:1,consts:[[1,`plan`],[1,`plan-header`],[1,`plan-title`],[3,`completed`]],template:function(e,i){e&1&&Me(0,br,10,0,`mat-card`,0),e&2&&Te(i.entries().length?0:-1)},dependencies:[_,w$2,A,WX,$X],styles:[`[_nghost-%COMP%]{display:block}.plan[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-tertiary-container);color:var(--%NS%mat-sys-on-tertiary-container)}.plan-header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;padding:16px 16px 8px}.plan-header[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{flex:0 0 24px}.plan-title[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-large)}mat-card-content[_ngcontent-%COMP%]{padding-top:4px}ul[_ngcontent-%COMP%]{display:grid;gap:8px;margin:0;padding:0;list-style:none}li[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:8px;line-height:1.4}li[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:20px;height:20px;font-size:20px;flex:0 0 auto}li.completed[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);text-decoration:line-through}`]})}};function xr(n,t){n&1&&(ue$1(0,`span`,2),kp(1,`Subagent`),ve())}function yr(n,t){if(n&1&&(ue$1(0,`pre`),kp(1),ve()),n&2){let e=Ke();le$1(),Td(e.cleanOutput())}}var Wt=class n{constructor(){this.tool=Mi$1.required();this.icon=x(()=>{switch((this.tool().kind||``).toLowerCase()){case`read`:return`description`;case`execute`:return`terminal`;case`think`:return`psychology`;case`edit`:return`edit_document`;case`delete`:return`delete`;case`search`:return`search`;default:return`build`}});this.isSubagentChild=x(()=>!!this.tool().parentId);this.cleanOutput=x(()=>{let t=this.tool().output;if(!t)return``;let e=t.trim();if(e.startsWith("```")&&e.endsWith("```")&&e.length>=6){let i=e.slice(3,-3),a=i.indexOf(`
`);return(a>=0?i.slice(a+1):i).trimEnd()}return t})}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-tool-call`]],inputs:{tool:[1,`tool`]},decls:11,vars:8,consts:[[1,`tool`,3,`disabled`],[1,`tool-title`],[1,`subagent-badge`]],template:function(e,i){e&1&&(ue$1(0,`mat-expansion-panel`,0)(1,`mat-expansion-panel-header`)(2,`mat-panel-title`)(3,`mat-icon`),kp(4),ve(),ue$1(5,`span`,1),kp(6),ve(),Me(7,xr,2,0,`span`,2),ve(),ue$1(8,`mat-panel-description`),kp(9),ve()(),Me(10,yr,2,1,`pre`),ve()),e&2&&(J(`subagent-tool`,i.isSubagentChild()),yt(`disabled`,!i.cleanOutput()),le$1(4),Td(i.icon()),le$1(2),Td(i.tool().title),le$1(),Te(i.isSubagentChild()?7:-1),le$1(2),Td(i.tool().status),le$1(),Te(i.cleanOutput()?10:-1))},dependencies:[$t,Be,Rt,zt,Oi,WX,$X],styles:[`[_nghost-%COMP%]{display:block}.tool[_ngcontent-%COMP%]{border:1px solid var(--%NS%mat-sys-outline-variant);box-shadow:none}mat-panel-title[_ngcontent-%COMP%], mat-panel-description[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}mat-panel-title[_ngcontent-%COMP%]{flex:1 1 auto;min-width:0}mat-panel-title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{flex:0 0 24px;color:var(--%NS%mat-sys-primary)}.tool-title[_ngcontent-%COMP%]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.subagent-badge[_ngcontent-%COMP%]{flex:0 0 auto;font:var(--%NS%mat-sys-label-small);background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);padding:2px 6px;border-radius:9999px;margin-left:6px;text-transform:uppercase;font-size:.65rem;letter-spacing:.5px}.subagent-tool[_ngcontent-%COMP%]{margin-left:16px;border-left:3px solid var(--%NS%mat-sys-secondary)}mat-panel-description[_ngcontent-%COMP%]{flex:0 0 auto;justify-content:flex-end;margin-left:16px;font:var(--%NS%mat-sys-label-medium)}pre[_ngcontent-%COMP%]{max-height:260px;overflow:auto;margin:0;padding:14px;border-radius:var(--%NS%mat-sys-corner-small);background:var(--%NS%mat-sys-surface-container-lowest);white-space:pre-wrap;overflow-wrap:anywhere;font:.82rem/1.45 ui-monospace,SFMono-Regular,Consolas,monospace}`]})}};var vr=(n,t)=>t.id;function Cr(n,t){if(n&1&&(ue$1(0,`div`,0),rt(1,`hub-markdown`,5),ve()),n&2){let e=Ke().$implicit;le$1(),yt(`content`,e.text)}}function wr(n,t){if(n&1&&(ue$1(0,`mat-expansion-panel`,1)(1,`mat-expansion-panel-header`)(2,`mat-panel-title`)(3,`mat-icon`),kp(4,`psychology`),ve(),ue$1(5,`span`),kp(6,`Thought process`),ve()()(),ue$1(7,`div`,6),rt(8,`hub-markdown`,5),ve()()),n&2){let e=Ke().$implicit;le$1(8),yt(`content`,e.text)}}function kr(n,t){if(n&1&&rt(0,`hub-tool-call`,2),n&2){let e=Ke().$implicit;yt(`tool`,e)}}function Sr(n,t){if(n&1&&rt(0,`hub-plan-view`,3),n&2){let e=Ke().$implicit;yt(`entries`,e.entries)}}function Mr(n,t){if(n&1&&rt(0,`hub-permission-card`,4),n&2){let e=Ke().$implicit,i=Ke();yt(`permission`,e)(`chatId`,i.chatId())}}function Nr(n,t){if(n&1&&Me(0,Cr,2,1,`div`,0)(1,wr,9,1,`mat-expansion-panel`,1)(2,kr,1,1,`hub-tool-call`,2)(3,Sr,1,1,`hub-plan-view`,3)(4,Mr,1,2,`hub-permission-card`,4),n&2){let e,i=t.$implicit;Te((e=i.type)===`message_chunk`?0:e===`thought_chunk`?1:e===`tool_call`?2:e===`plan`?3:e===`permission_request`?4:-1)}}var Gt=class n{constructor(){this.entries=Mi$1.required();this.chatId=Mi$1(``)}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-turn-entries`]],inputs:{entries:[1,`entries`],chatId:[1,`chatId`]},decls:2,vars:0,consts:[[1,`message-text`],[1,`thought`],[3,`tool`],[3,`entries`],[3,`permission`,`chatId`],[3,`content`],[1,`thought-text`]],template:function(e,i){e&1&&SA(0,Nr,5,1,null,null,vr),e&2&&wA(i.entries())},dependencies:[$t,Be,Rt,zt,WX,$X,De,jt,Qt,Wt],styles:[`[_nghost-%COMP%]{display:flex;flex-direction:column;gap:12px;padding:16px;border-radius:4px 20px 20px;background:var(--%NS%mat-sys-surface-container-low)}.message-text[_ngcontent-%COMP%]{white-space:pre-wrap;overflow-wrap:anywhere;font:var(--%NS%mat-sys-body-large)}.thought[_ngcontent-%COMP%]{border:1px solid var(--%NS%mat-sys-outline-variant);box-shadow:none;color:var(--%NS%mat-sys-on-surface-variant)}.thought[_ngcontent-%COMP%]   mat-panel-title[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px}.thought[_ngcontent-%COMP%]   mat-panel-title[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{flex:0 0 24px;color:var(--%NS%mat-sys-primary)}.thought-text[_ngcontent-%COMP%]{white-space:pre-wrap;overflow-wrap:anywhere;font:var(--%NS%mat-sys-body-medium)}@media(max-width:599px){[_nghost-%COMP%]{padding:12px}}`]})}};function Pr(n,t){if(n&1&&(ue$1(0,`div`,0)(1,`div`,3),kp(2),ve(),ue$1(3,`time`),kp(4),ve()()),n&2){let e=Ke();le$1(2),Td(e.user(e.item()).text),le$1(),ie$1(`datetime`,e.user(e.item()).timestamp),le$1(),Td(e.formatTime(e.user(e.item()).timestamp))}}function Tr(n,t){n&1&&(ue$1(0,`span`,5),rt(1,`mat-spinner`,7),kp(2,` Thinking…`),ve())}function Er(n,t){if(n&1&&(ue$1(0,`article`,1)(1,`header`)(2,`span`,4),kp(3),ve(),ue$1(4,`strong`),kp(5),ve(),ue$1(6,`time`),kp(7),ve(),Me(8,Tr,3,0,`span`,5),ve(),rt(9,`hub-turn-entries`,6),ve()),n&2){let e=Ke();le$1(3),Td(e.turn(e.item()).agent[0]||`A`),le$1(2),Td(e.turn(e.item()).agent),le$1(),ie$1(`datetime`,e.turn(e.item()).timestamp),le$1(),Td(e.formatTime(e.turn(e.item()).timestamp)),le$1(),Te(e.turn(e.item()).status===`in_progress`?8:-1),le$1(),yt(`entries`,e.turn(e.item()).entries)(`chatId`,e.chatId())}}function Ir(n,t){if(n&1&&(ue$1(0,`div`,2)(1,`mat-icon`),kp(2,`error`),ve(),ue$1(3,`span`),kp(4),ve()()),n&2){let e=Ke();le$1(4),Td(e.error(e.item()).message)}}var Zt=class n{constructor(){this.item=Mi$1.required();this.chatId=Mi$1(``)}user(t){return t}turn(t){return t}error(t){return t}formatTime(t){return YX(t)}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-message-item`]],inputs:{item:[1,`item`],chatId:[1,`chatId`]},decls:3,vars:1,consts:[[1,`user-message`],[1,`turn`],[`role`,`alert`,1,`error-message`],[1,`user-bubble`],[1,`avatar`],[1,`thinking`],[3,`entries`,`chatId`],[`diameter`,`14`]],template:function(e,i){if(e&1&&Me(0,Pr,5,3,`div`,0)(1,Er,10,7,`article`,1)(2,Ir,5,1,`div`,2),e&2){let a;Te((a=i.item().type)===`user_message`?0:a===`turn`?1:a===`error`?2:-1)}},dependencies:[WX,$X,Ene,Dne,Gt],styles:[`[_nghost-%COMP%]{display:block;margin-bottom:26px}.user-message[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:flex-end}.user-bubble[_ngcontent-%COMP%]{max-width:min(100%,640px);padding:12px 16px;border-radius:18px 18px 4px;background:var(--%NS%mat-sys-primary-container);color:var(--%NS%mat-sys-on-primary-container);white-space:pre-wrap;overflow-wrap:anywhere;font:var(--%NS%mat-sys-body-large);box-shadow:var(--%NS%mat-sys-level1)}time[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-small)}.user-message[_ngcontent-%COMP%]   time[_ngcontent-%COMP%]{margin-top:5px;padding-right:4px}.turn[_ngcontent-%COMP%] > header[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-label-large)}.avatar[_ngcontent-%COMP%]{display:grid;place-items:center;width:32px;height:32px;flex:0 0 auto;border-radius:12px 12px 12px 3px;background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);font-weight:700;text-transform:uppercase}.turn[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface)}.thinking[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:var(--%NS%mat-sys-corner-full);background:var(--%NS%mat-sys-tertiary-container);color:var(--%NS%mat-sys-on-tertiary-container)}.error-message[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:var(--%NS%mat-sys-corner-medium);background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}`]})}};var Or=[`viewport`];var Dr=(n,t)=>t.id;function Ar(n,t){n&1&&rt(0,`mat-spinner`,7)}function Rr(n,t){n&1&&(ue$1(0,`mat-icon`),kp(1,`history`),ve())}function zr(n,t){if(n&1){let e=Rp();ue$1(0,`div`,3)(1,`button`,6),Fe(`click`,function(){gr$1(e);return vr$1(Ke().requestOlder())}),Me(2,Ar,1,0,`mat-spinner`,7)(3,Rr,2,0,`mat-icon`),kp(4),ve()()}if(n&2){let e=Ke();le$1(),yt(`disabled`,e.historyLoading()),le$1(),Te(e.historyLoading()?2:3),le$1(2),Op(` `,e.historyLoading()?`Loading older history…`:`Load older history`,` `)}}function $r(n,t){if(n&1&&rt(0,`hub-message-item`,4),n&2){let e=t.$implicit,i=Ke();yt(`item`,e)(`chatId`,i.chatId())}}function Fr(n,t){if(n&1){let e=Rp();ue$1(0,`div`,5)(1,`button`,8),Fe(`click`,function(){gr$1(e);return vr$1(Ke().scrollToBottom(!0))}),ue$1(2,`mat-icon`),kp(3,`arrow_downward`),ve(),kp(4,` Latest `),ve()()}}var Ut=class n{constructor(){this.items=Mi$1([]);this.chatId=Mi$1(``);this.showScrollButton=C(!1);this.hasOlderHistory=Mi$1(!1);this.historyLoading=Mi$1(!1);this.olderRequested=X5();this.viewport=ka$1(`viewport`);this.injector=u(T);this.autoScroll=!0;this.preserveScroll=null;dt(()=>{if(this.items(),this.historyLoading())return;let t=this.preserveScroll;if(this.preserveScroll=null,t){xt({read:()=>{let e=this.viewport()?.nativeElement;e&&(e.scrollTop=t.top+e.scrollHeight-t.height)}},{injector:this.injector});return}this.autoScroll&&xt({read:()=>this.scrollToBottom()},{injector:this.injector})})}requestOlder(){let t=this.viewport()?.nativeElement;this.historyLoading()||!this.hasOlderHistory()||(t&&(this.preserveScroll={top:t.scrollTop,height:t.scrollHeight}),this.olderRequested.emit())}onScroll(){let t=this.viewport()?.nativeElement;if(!t)return;let e=t.scrollHeight-t.scrollTop-t.clientHeight;this.autoScroll=e<=80,this.showScrollButton.set(e>200)}scrollToBottom(t=!1){let e=this.viewport()?.nativeElement;e&&(e.scrollTo({top:e.scrollHeight,behavior:t?`smooth`:`auto`}),this.autoScroll=!0,this.showScrollButton.set(!1))}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-event-stream`]],viewQuery:function(e,i){e&1&&Nd(i.viewport,Or,5),e&2&&Md()},inputs:{items:[1,`items`],chatId:[1,`chatId`],hasOlderHistory:[1,`hasOlderHistory`],historyLoading:[1,`historyLoading`]},outputs:{olderRequested:`olderRequested`},decls:7,vars:2,consts:[[`viewport`,``],[`aria-live`,`polite`,1,`stream`,3,`scroll`],[1,`stream-content`],[1,`history-control`],[3,`item`,`chatId`],[1,`scroll-control`],[`mat-stroked-button`,``,`type`,`button`,3,`click`,`disabled`],[`diameter`,`18`],[`matFab`,``,`extended`,``,`type`,`button`,`matTooltip`,`Scroll to latest message`,3,`click`]],template:function(e,i){e&1&&(ue$1(0,`div`,1,0),Fe(`scroll`,function(){return i.onScroll()}),ue$1(2,`div`,2),Me(3,zr,5,3,`div`,3),SA(4,$r,1,2,`hub-message-item`,4,Dr),ve()(),Me(6,Fr,5,0,`div`,5)),e&2&&(le$1(3),Te(i.hasOlderHistory()?3:-1),le$1(),wA(i.items()),le$1(2),Te(i.showScrollButton()?6:-1))},dependencies:[EX,CX,DX,WX,$X,Ene,Dne,on,Gt$1,Zt],styles:[`[_nghost-%COMP%]{position:relative;display:block;min-height:0;flex:1}.stream[_ngcontent-%COMP%]{height:100%;overflow:auto;overscroll-behavior:contain;padding:28px max(var(--%NS%hub-gutter),(100% - var(--%NS%hub-measure)) / 2)}.stream-content[_ngcontent-%COMP%]{max-width:var(--%NS%hub-measure);margin:0 auto}.history-control[_ngcontent-%COMP%]{display:flex;justify-content:center;padding-bottom:18px}.history-control[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:8px}.scroll-control[_ngcontent-%COMP%]{position:absolute;right:0;bottom:20px;left:0;display:flex;justify-content:center;pointer-events:none;z-index:1}.scroll-control[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{pointer-events:auto}@media(max-width:599px){.stream[_ngcontent-%COMP%]{padding:20px 16px}}`]})}};function Lr(n,t){n&1&&(ue$1(0,`section`,9)(1,`mat-icon`),kp(2,`chat`),ve(),ue$1(3,`h1`),kp(4,`No chat selected`),ve(),ue$1(5,`p`),kp(6,`Choose a chat from the navigation.`),ve()())}function Hr(n,t){if(n&1){let e=Rp();ue$1(0,`button`,18),Fe(`click`,function(){gr$1(e);return vr$1(Ke(3).resetConfig())}),kp(1),ve()}if(n&2){let e=Ke(3);le$1(),Op(`Reset `,e.rejectedConfig(),` and retry`)}}function Vr(n,t){if(n&1){let e=Rp();ue$1(0,`button`,18),Fe(`click`,function(){gr$1(e);return vr$1(Ke(3).retry())}),kp(1,`Retry connection`),ve()}}function Br(n,t){if(n&1&&(ue$1(0,`div`,10)(1,`div`,15)(2,`mat-icon`),kp(3,`error_outline`),ve(),ue$1(4,`div`,16)(5,`strong`),kp(6,`Connection failed`),ve(),ue$1(7,`span`),kp(8),ve()()(),Me(9,Hr,2,1,`button`,17)(10,Vr,2,0,`button`,17),ve()),n&2){let e=Ke(2);le$1(8),Td(e.connectError()),le$1(),Te(e.rejectedConfig()?9:10)}}function qr(n,t){if(n&1){let e=Rp();ue$1(0,`div`,11)(1,`div`,15)(2,`mat-icon`),kp(3,`history`),ve(),ue$1(4,`div`,16)(5,`strong`),kp(6,`History page unavailable`),ve(),ue$1(7,`span`),kp(8),ve()()(),ue$1(9,`button`,18),Fe(`click`,function(){gr$1(e);return vr$1(Ke(2).retryHistory())}),kp(10,`Retry history`),ve()()}if(n&2){let e=Ke(2);le$1(8),Op(``,e.historyError(),` New turns and live activity remain available.`)}}function jr(n,t){n&1&&(ue$1(0,`section`,9),rt(1,`mat-spinner`,19),ue$1(2,`p`),kp(3,`Loading recent chat history…`),ve()())}function Qr(n,t){if(n&1&&(ue$1(0,`section`,12)(1,`mat-card`)(2,`mat-card-content`)(3,`div`,20)(4,`span`,21),kp(5),ve(),ue$1(6,`div`)(7,`h1`),kp(8),ve(),ue$1(9,`p`),kp(10,`Configure agent options or send your first message to begin.`),ve()()(),rt(11,`hub-chat-config`,6),ve()()()),n&2){let e=Ke(2);le$1(5),Td(e.chat().agent[0]),le$1(3),Op(``,e.chat().agent,` connected`),le$1(3),yt(`chat`,e.chat())(`options`,e.options())}}function Wr(n,t){if(n&1){let e=Rp();ue$1(0,`hub-event-stream`,22),Fe(`olderRequested`,function(){gr$1(e);return vr$1(Ke(2).loadOlderHistory())}),ve()}if(n&2){let e=Ke(2);yt(`items`,e.items())(`chatId`,e.chatId())(`hasOlderHistory`,e.hasOlderHistory())(`historyLoading`,e.historyLoading())}}function Gr(n,t){if(n&1&&(Me(0,Br,11,2,`div`,10),Me(1,qr,11,1,`div`,11),Me(2,jr,4,0,`section`,9)(3,Qr,12,4,`section`,12)(4,Wr,1,4,`hub-event-stream`,13),rt(5,`hub-chat-composer`,14)),n&2){let e=Ke();Te(e.connectError()?0:-1),le$1(),Te(e.historyError()?1:-1),le$1(),Te(e.historyLoading()&&!e.items().length?2:!e.items().length&&!e.hasOlderHistory()?3:4),le$1(3),yt(`chatId`,e.chatId())(`options`,e.options())(`turnState`,e.chat().turn_state||`IDLE`)(`disabled`,e.chat().archived)}}var Xt=class n{constructor(){this.chatId=Mi$1(``);this.state=u(gE);this.configOpen=C(!1);this.compact=C(!1);this.breakpointObserver=u(Rg);this.destroyRef=u(ke);this.chat=x(()=>this.chatId()?this.state.findChat(this.chatId()):null);this.items=x(()=>this.chatId()?this.state.reducersByChat()[this.chatId()]?.items()??[]:[]);this.options=x(()=>this.chatId()?this.state.configOptionsByChat()[this.chatId()]??[]:[]);this.connecting=x(()=>this.chatId()?this.state.connectingChats().has(this.chatId()):!1);this.connectError=x(()=>this.chatId()?this.state.connectErrors()[this.chatId()]??``:``);this.rejectedConfig=x(()=>this.chatId()?this.state.rejectedConfigByChat()[this.chatId()]??``:``);this.configLoaded=x(()=>this.chatId()?this.state.configLoadedByChat()[this.chatId()]===!0:!1);this.historyLoading=x(()=>this.chatId()?this.state.historyLoadingByChat().has(this.chatId()):!1);this.historyError=x(()=>this.chatId()?this.state.historyErrors()[this.chatId()]??``:``);this.hasOlderHistory=x(()=>this.chatId()?this.state.historyHasOlderByChat()[this.chatId()]===!0:!1);this.breakpointObserver.observe(`(max-width: 839px)`).pipe(Ti$1(this.destroyRef)).subscribe(({matches:t})=>this.compact.set(t))}openConfig(t){this.configOpen.set(!0),t.open()}closeConfig(t){this.configOpen.set(!1),t.close()}retry(){this.chatId()&&this.state.retryConnection(this.chatId())}resetConfig(){this.chatId()&&this.state.resetRejectedConfig(this.chatId())}loadOlderHistory(){this.chatId()&&this.state.loadOlderHistory(this.chatId())}retryHistory(){this.chatId()&&this.state.retryHistory(this.chatId())}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-chat-workspace`]],inputs:{chatId:[1,`chatId`]},decls:15,vars:7,consts:[[`configDrawer`,``],[1,`chat-layout`,3,`hasBackdrop`],[`position`,`end`,`aria-label`,`Chat configuration`,3,`closed`,`mode`,`opened`],[1,`config-header`],[`mat-icon-button`,``,`aria-label`,`Close chat configuration`,3,`click`],[1,`config-body`],[3,`chat`,`options`],[1,`chat-content`],[3,`configRequested`,`chat`],[1,`status-state`],[`role`,`alert`,1,`status-banner`,`error-banner`],[`role`,`status`,1,`status-banner`,`history-banner`],[1,`welcome`],[3,`items`,`chatId`,`hasOlderHistory`,`historyLoading`],[3,`chatId`,`options`,`turnState`,`disabled`],[1,`banner-content`],[1,`banner-text`],[`mat-flat-button`,``,`type`,`button`],[`mat-flat-button`,``,`type`,`button`,3,`click`],[`diameter`,`36`],[1,`welcome-heading`],[1,`avatar`],[3,`olderRequested`,`items`,`chatId`,`hasOlderHistory`,`historyLoading`]],template:function(e,i){if(e&1){let a=Rp();ue$1(0,`mat-drawer-container`,1)(1,`mat-drawer`,2,0),Fe(`closed`,function(){return i.configOpen.set(!1)}),ue$1(3,`div`,3)(4,`h2`),kp(5,`Chat configuration`),ve(),ue$1(6,`button`,4),Fe(`click`,function(){gr$1(a);let l=xr$1(2);return vr$1(i.closeConfig(l))}),ue$1(7,`mat-icon`),kp(8,`close`),ve()()(),ue$1(9,`div`,5),rt(10,`hub-chat-config`,6),ve()(),ue$1(11,`mat-drawer-content`,7)(12,`hub-chat-header`,8),Fe(`configRequested`,function(){gr$1(a);let l=xr$1(2);return vr$1(i.openConfig(l))}),ve(),Me(13,Lr,7,0,`section`,9)(14,Gr,6,7),ve()()}e&2&&(yt(`hasBackdrop`,i.compact()),le$1(),yt(`mode`,i.compact()?`over`:`side`)(`opened`,i.configOpen()),le$1(9),yt(`chat`,i.chat())(`options`,i.options()),le$1(2),yt(`chat`,i.chat()),le$1(),Te(i.chat()?14:13))},dependencies:[Et,It,At,Ut,EX,CX,tF,_,w$2,A,WX,$X,Ene,Dne,Je$1,X$1,Y,D$1],styles:[`[_nghost-%COMP%]{display:flex;min-height:0;flex:1;flex-direction:column}.chat-layout[_ngcontent-%COMP%]{height:100%;min-height:0;flex:1}.chat-content[_ngcontent-%COMP%]{display:flex;height:100%;min-height:0;flex-direction:column;overflow:hidden}mat-drawer[_ngcontent-%COMP%]{display:flex;width:380px;max-width:90vw;flex-direction:column;border-left:1px solid var(--%NS%mat-sys-outline-variant)}.config-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex:0 0 auto;padding:14px 16px;border-bottom:1px solid var(--%NS%mat-sys-outline-variant)}.config-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-title-medium)}.config-body[_ngcontent-%COMP%]{min-height:0;flex:1;overflow:auto;padding:20px}.status-state[_ngcontent-%COMP%]{display:grid;justify-items:center;align-content:center;gap:12px;min-height:0;flex:1;padding:40px 20px;color:var(--%NS%mat-sys-on-surface-variant);text-align:center}.status-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{width:48px;height:48px;font-size:48px;color:var(--%NS%mat-sys-primary)}.status-state[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-small);color:var(--%NS%mat-sys-on-surface)}.error-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .error-state[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-error)}.welcome[_ngcontent-%COMP%]{display:flex;justify-content:center;min-height:0;overflow:auto;flex:1;padding:28px max(var(--%NS%hub-gutter),(100% - var(--%NS%hub-measure)) / 2)}.welcome[_ngcontent-%COMP%]   mat-card[_ngcontent-%COMP%]{width:100%;max-width:var(--%NS%hub-measure);align-self:flex-start}.welcome-heading[_ngcontent-%COMP%]{display:flex;align-items:center;gap:14px;margin-bottom:22px}.welcome-heading[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-small)}.welcome-heading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-top:4px;color:var(--%NS%mat-sys-on-surface-variant)}.avatar[_ngcontent-%COMP%]{display:grid;place-items:center;width:48px;height:48px;flex:0 0 auto;border-radius:16px 16px 16px 4px;background:var(--%NS%mat-sys-secondary-container);color:var(--%NS%mat-sys-on-secondary-container);font-weight:700;text-transform:uppercase}.status-banner[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px max(var(--%NS%hub-gutter),(100% - var(--%NS%hub-measure)) / 2);flex:0 0 auto;border-bottom:1px solid var(--%NS%mat-sys-outline-variant)}.error-banner[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-error-container);color:var(--%NS%mat-sys-on-error-container)}.banner-content[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;min-width:0;flex:1}.banner-content[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{flex:0 0 auto}.banner-text[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:2px;min-width:0}.banner-text[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-label-large)}.banner-text[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-body-small);word-break:break-word}@media(max-width:599px){.welcome[_ngcontent-%COMP%]{padding-inline:16px}.status-banner[_ngcontent-%COMP%]{flex-direction:column;align-items:stretch;padding-inline:16px}}`]})}};var Ji=class n{constructor(){this.route=u(oi);this.chatId=Ii$1(this.route.paramMap.pipe(H(t=>t.get(`chatId`)??``)),{initialValue:this.route.snapshot.paramMap.get(`chatId`)??``})}static{this.ɵfac=function(e){return new(e||n)}}static{this.ɵcmp=X({type:n,selectors:[[`hub-chat-page`]],decls:1,vars:1,consts:[[3,`chatId`]],template:function(e,i){e&1&&rt(0,`hub-chat-workspace`,0),e&2&&yt(`chatId`,i.chatId())},dependencies:[Xt],styles:[`[_nghost-%COMP%]{display:flex;min-height:0;flex:1;flex-direction:column}`]})}};export{Ji as ChatPageComponent};