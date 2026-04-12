/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const s=this.t;if(t&&void 0===e){const t=void 0!==s&&1===s.length;t&&(e=i.get(s)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&i.set(s,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new n(i,e,s)},a=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:o,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,_=u.trustedTypes,g=_?_.emptyScript:"",m=u.reactiveElementPolyfillSupport,f=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},b=(e,t)=>!o(e,t),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&c(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:n}=l(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const r=i?.call(this);n?.call(this,t),this.requestUpdate(e,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...h(e),...d(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(t)s.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of i){const i=document.createElement("style"),n=e.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=t.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(t,s.type);this._$Em=e,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=i;const r=n.fromAttribute(t,e.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(void 0!==e){const r=this.constructor;if(!1===i&&(n=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??b)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==n||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[f("elementProperties")]=new Map,$[f("finalized")]=new Map,m?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,x=e=>e,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,z=`<${C}>`,M=document,P=()=>M.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,T="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,H=/>/g,j=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,W=/"/g,D=/^(?:script|style|textarea|title)$/i,I=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),F=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),V=new WeakMap,Z=M.createTreeWalker(M,129);function q(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const G=(e,t)=>{const s=e.length-1,i=[];let n,r=2===t?"<svg>":3===t?"<math>":"",a=U;for(let t=0;t<s;t++){const s=e[t];let o,c,l=-1,h=0;for(;h<s.length&&(a.lastIndex=h,c=a.exec(s),null!==c);)h=a.lastIndex,a===U?"!--"===c[1]?a=R:void 0!==c[1]?a=H:void 0!==c[2]?(D.test(c[2])&&(n=RegExp("</"+c[2],"g")),a=j):void 0!==c[3]&&(a=j):a===j?">"===c[0]?(a=n??U,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,o=c[1],a=void 0===c[3]?j:'"'===c[3]?W:B):a===W||a===B?a=j:a===R||a===H?a=U:(a=j,n=void 0);const d=a===j&&e[t+1].startsWith("/>")?" ":"";r+=a===U?s+z:l>=0?(i.push(o),s.slice(0,l)+A+s.slice(l)+E+d):s+E+(-2===l?t:d)}return[q(e,r+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class J{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,r=0;const a=e.length-1,o=this.parts,[c,l]=G(e,t);if(this.el=J.createElement(c,s),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=Z.nextNode())&&o.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(A)){const t=l[r++],s=i.getAttribute(e).split(E),a=/([.?@])?(.*)/.exec(t);o.push({type:1,index:n,name:a[2],strings:s,ctor:"."===a[1]?te:"?"===a[1]?se:"@"===a[1]?ie:ee}),i.removeAttribute(e)}else e.startsWith(E)&&(o.push({type:6,index:n}),i.removeAttribute(e));if(D.test(i.tagName)){const e=i.textContent.split(E),t=e.length-1;if(t>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],P()),Z.nextNode(),o.push({type:2,index:++n});i.append(e[t],P())}}}else if(8===i.nodeType)if(i.data===C)o.push({type:2,index:n});else{let e=-1;for(;-1!==(e=i.data.indexOf(E,e+1));)o.push({type:7,index:n}),e+=E.length-1}n++}}static createElement(e,t){const s=M.createElement("template");return s.innerHTML=e,s}}function Y(e,t,s=e,i){if(t===F)return t;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const r=O(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(e),n._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(t=Y(e,n._$AS(e,t.values),n,i)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??M).importNode(t,!0);Z.currentNode=i;let n=Z.nextNode(),r=0,a=0,o=s[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new X(n,n.nextSibling,this,e):1===o.type?t=new o.ctor(n,o.name,o.strings,this,e):6===o.type&&(t=new ne(n,this,e)),this._$AV.push(t),o=s[++a]}r!==o?.index&&(n=Z.nextNode(),r++)}return Z.currentNode=M,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),O(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==F&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=J.createElement(q(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new Q(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new J(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const n of e)i===t.length?t.push(s=new X(this.O(P()),this.O(P()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=x(e).nextSibling;x(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=K}_$AI(e,t=this,s,i){const n=this.strings;let r=!1;if(void 0===n)e=Y(this,e,t,0),r=!O(e)||e!==this._$AH&&e!==F,r&&(this._$AH=e);else{const i=e;let a,o;for(e=n[0],a=0;a<n.length-1;a++)o=Y(this,i[s+a],t,a),o===F&&(o=this._$AH[a]),r||=!O(o)||o!==this._$AH[a],o===K?e=K:e!==K&&(e+=(o??"")+n[a+1]),this._$AH[a]=o}r&&!i&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}let se=class extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}};class ie extends ee{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??K)===F)return;const s=this._$AH,i=e===K&&s!==K||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==K&&(s===K||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const re=w.litHtmlPolyfillSupport;re?.(J,X),(w.litHtmlVersions??=[]).push("3.3.2");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class oe extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let n=i._$litPart$;if(void 0===n){const e=s?.renderBefore??null;i._$litPart$=n=new X(t.insertBefore(P(),e),e,void 0,s??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}oe._$litElement$=!0,oe.finalized=!0,ae.litElementHydrateSupport?.({LitElement:oe});const ce=ae.litElementPolyfillSupport;ce?.({LitElement:oe}),(ae.litElementVersions??=[]).push("4.2.2");const le={sensors:{battery:"_batterie",activity_mode:"_aktivitatsmodus",progress:"_fortschritt",area:"_bereich",mowing_speed:"_mahgeschwindigkeit",blade_height:"_schnitthohe",total_time:"_gesamtzeit",elapsed_time:"_vergangene_zeit",left_time:"_verbleibende_zeit",satellites_robot:"_satelliten_roboter",l1_satellites:"_l1_satelliten_co_viewing",l2_satellites:"_l2_satelliten_co_viewing",rtk_position:"_rtk_position",position_type:"_typ_der_geratepositionierung",wifi_rssi:"_wi_fi_rssi",ble_rssi:"_ble_rssi",mnet_rssi:"_mobilfunk_rssi",connect_type:"_verbindungsart",latitude:"_breitengrad",longitude:"_langengrad",work_area:"_arbeitsbereich",error_code:"_letzter_fehlercode",error_message:"_letzte_fehlermeldung",error_time:"_letzter_fehlerzeitpunkt",blade_used_time:"_messernutzungszeit",blade_warn_time:"_messerverschleiss_warnzeit",total_distance:"_gesamtkilometerstand",battery_cycles:"_batteriezyklen",camera_brightness:"_kamera_helligkeit",non_work_hours:"_arbeitsfreie_zeit",task_duration:"_aufgabendauer",task_area:"_aufgabenbereich_area_1"},buttons:{release_dock:"_abdocken",cancel_task:"_aktuelle_aufgabe_abbrechen",sync_map:"_synchronisiere_karte",sync_schedule:"_synchronisiere_zeitplan",resync_rtk:"_synchronisiere_rtk_und_ladestation",relocate_dock:"_ladestation_umsetzen",nudge_forward:"_notfall_schub_vorwarts",nudge_back:"_notfall_schub_ruckwarts",nudge_left:"_notfall_schub_links",nudge_right:"_notfall_schub_rechts",restart:"_restart_mower"},selects:{charge_mode:"_aufladungsmodus",path_order:"_ausfuhrungsreihenfolge_des_pfades",obstacle_mode:"_modus_der_hinderniserkennung",nav_mode:"_navigationsmodus",border_laps:"_patrouillenrunden_fur_den_seitlichen_rasenschnitt",nogo_laps:"_patrouillenrunden_fur_mahen_von_no_go_zonen",angle_mode:"_wegwinkel_modus",turn_mode:"_wendemodus"},numbers:{working_speed:"_aufgabengeschwindigkeit",start_progress:"_fortschritt_beim_start",cutting_angle:"_kreuzungswinkel",blade_height:"_schnitthohe",path_spacing:"_wegabstand",path_angle:"_wegwinkel"},switches:{rain_mowing:"_regenerkennung_beim_mahen",rain_robot:"_regenerkennung_roboter",side_led:"_seitenlicht",schedule_updates:"_updates_ein_ausschalten"}};function he(e){return{sensors:"sensor",buttons:"button",selects:"select",numbers:"number",switches:"switch"}[e]||e}const de={single_grid:"Einzelbahn",double_grid:"Doppelbahn",segment_grid:"Segmentbahn",no_grid:"Ohne Bahn",zero_turn:"Nullwendung",multipoint:"Mehrpunkt",direct_touch:"Direktkontakt",slow_touch:"Langsamer Kontakt",less_touch:"Weniger Kontakt",no_touch:"Kein Kontakt",sensitive:"Empfindlich",direct:"Direkt",follow_perimeter:"Randverfolgung",border_first:"Rand zuerst",grid_first:"Bahn zuerst",relative_angle:"Relativer Winkel",absolute_angle:"Absoluter Winkel",random_angle:"Zufälliger Winkel",none:"Keine",one:"1 Runde",two:"2 Runden",three:"3 Runden",four:"4 Runden"};function pe(e,t){const s=function(e,t){return e&&t&&e.states[t]||null}(e,t);return s?s.state:null}function ue(e,t){const s=pe(e,t);if(null===s||"unknown"===s||"unavailable"===s)return null;const i=parseFloat(s);return isNaN(i)?null:i}const _e={status:!0,controls:!0,mowing_config:!0,zones:!0,device:!0,maintenance:!1,map:!1,camera:!1,schedule:!0};customElements.define("mammotion-card-editor",class extends oe{static get properties(){return{hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config={...e}}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target,s=t.configValue;let i=e.detail?.value??t.value;"mode"===s&&(i=t.value);const n={...this._config,[s]:i};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n},bubbles:!0,composed:!0}))}_moduleChanged(e){const t=e.target.configValue,s=e.target.checked,i={..._e,...this._config.modules,[t]:s},n={...this._config,modules:i};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this._config)return I``;const e=Object.keys(this.hass.states).filter(e=>e.startsWith("lawn_mower.")).sort(),t={..._e,...this._config.modules};return I`
      <div class="card-config">
        <div class="field">
          <label>Mäher-Entity (Pflicht)</label>
          <select
            .configValue=${"entity"}
            .value=${this._config.entity||""}
            @change=${this._valueChanged}
          >
            <option value="">-- lawn_mower Entity wählen --</option>
            ${e.map(e=>I`
                <option value=${e} ?selected=${this._config.entity===e}>
                  ${this.hass.states[e]?.attributes?.friendly_name||e}
                </option>
              `)}
          </select>
        </div>

        <div class="field">
          <label>Name (optional)</label>
          <input
            type="text"
            .configValue=${"name"}
            .value=${this._config.name||""}
            @input=${this._valueChanged}
            placeholder="z.B. Luba"
          />
        </div>

        <div class="field">
          <label>Modus</label>
          <select
            .configValue=${"mode"}
            .value=${this._config.mode||"family"}
            @change=${this._valueChanged}
          >
            <option value="family">Familie</option>
            <option value="expert">Experte</option>
          </select>
        </div>

        <div class="field">
          <label>Module</label>
          <div class="modules">
            ${Object.entries(t).map(([e,t])=>I`
                <label class="module-toggle">
                  <input
                    type="checkbox"
                    .configValue=${e}
                    .checked=${t}
                    @change=${this._moduleChanged}
                  />
                  ${e}
                </label>
              `)}
          </div>
        </div>
      </div>
    `}static get styles(){return r`
      .card-config {
        padding: 16px;
      }
      .field {
        margin-bottom: 16px;
      }
      .field > label {
        display: block;
        font-weight: 500;
        margin-bottom: 4px;
        color: var(--primary-text-color);
      }
      select,
      input[type="text"] {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font-size: 14px;
        box-sizing: border-box;
      }
      .modules {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
      }
      .module-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: var(--secondary-text-color);
      }
      .module-toggle input {
        width: auto;
      }
    `}});const ge="0.6.0";customElements.define("mammotion-card",class extends oe{static get properties(){return{hass:{attribute:!1},_config:{state:!0},_entities:{state:!0},_syncingMap:{state:!0},_syncingSchedule:{state:!0},_serviceError:{state:!0},_openSections:{state:!0}}}static getConfigElement(){return document.createElement("mammotion-card-editor")}static getStubConfig(e){return{entity:Object.keys(e.states).find(e=>e.startsWith("lawn_mower."))||"",mode:"family",modules:{status:!0,controls:!0,map:!0,camera:!0,mowing_config:!0,zones:!0,schedule:!0,device:!0}}}setConfig(e){if(!e.entity)throw new Error("Please define a lawn_mower entity");this._config={mode:"family",modules:{status:!0,controls:!0,map:!0,camera:!0,mowing_config:!0,zones:!0,schedule:!0,device:!0},...e},this._entities=null;const t="expert"===this._config.mode;this._openSections=new Set(t?["map","zones","mowing"]:["map","zones"])}set hass(e){const t=this._hass;this._hass=e,this._entities&&t||(this._entities=function(e,t){if(!e||!t)return null;const s=t.replace("lawn_mower.",""),i={lawn_mower:t,camera:`camera.${s}`,device_tracker:null,charging:`binary_sensor.${s}_ladestatus`,sensors:{},buttons:{},selects:{},numbers:{},switches:{},areas:[],tasks:[],task_areas:[]},n=`device_tracker.${s}_${s}`;if(e.states[n])i.device_tracker=n;else for(const t of Object.keys(e.states))if(t.startsWith(`device_tracker.${s}`)){i.device_tracker=t;break}for(const[t,n]of Object.entries(le))for(const[r,a]of Object.entries(n)){const n=`${he(t)}.${s}${a}`;e.states[n]&&(i[t][r]=n)}for(const t of Object.keys(e.states))(t.startsWith(`switch.${s}_bereich_area_`)||t.startsWith(`switch.${s}_bereich_`))&&(t.includes("_regenerkennung")||t.includes("_seitenlicht")||t.includes("_updates")||i.areas.push(t));for(const t of Object.keys(e.states))!t.startsWith(`button.${s}_`)||!t.includes("_aufgabe_")&&!t.includes("_task_")||t.includes("_abbrechen")||t.includes("_synchronisiere")||i.tasks.push(t);for(const t of Object.keys(e.states))t.startsWith(`sensor.${s}_aufgabenbereich_`)&&i.task_areas.push(t);return i}(e,this._config.entity)),this.requestUpdate("hass",t)}get hass(){return this._hass}getCardSize(){return"expert"===this._config?.mode?8:4}_getMowerState(){return pe(this.hass,this._config.entity)||"unknown"}_stateIcon(e){const t={mowing:"mdi:robot-mower",paused:"mdi:pause-circle",docked:"mdi:home-circle",returning:"mdi:arrow-left-circle",error:"mdi:alert-circle",unknown:"mdi:help-circle"};return t[e]||t.unknown}_stateColor(e){return{mowing:"var(--state-active-color, #4caf50)",paused:"var(--warning-color, #ff9800)",docked:"var(--info-color, #2196f3)",returning:"var(--info-color, #2196f3)",error:"var(--error-color, #f44336)"}[e]||"var(--secondary-text-color)"}_stateLabel(e){return{mowing:"Mäht",paused:"Pausiert",docked:"Angedockt",returning:"Fährt zurück",error:"Fehler",unknown:"Unbekannt"}[e]||e}_batteryColor(e){return null===e?"var(--secondary-text-color)":e>50?"var(--state-active-color, #4caf50)":e>20?"var(--warning-color, #ff9800)":"var(--error-color, #f44336)"}_toggleSection(e){this._openSections||(this._openSections=new Set),this._openSections.has(e)?this._openSections.delete(e):this._openSections.add(e),"map"===e&&this._openSections.has("map")&&this._leafletMap&&setTimeout(()=>this._leafletMap.invalidateSize(),350),this.requestUpdate()}_isSectionOpen(e){return!!this._openSections&&this._openSections.has(e)}_renderSection(e,t,s,i,n){const r=this._isSectionOpen(e);return I`
      <div class="section">
        <div class="section-header" @click=${()=>this._toggleSection(e)}>
          <ha-icon icon=${t}></ha-icon>
          <span class="section-title-text">${s}</span>
          ${n||""}
          <span class="chevron ${r?"open":""}">▸</span>
        </div>
        <div class="accordion-content ${r?"open":""}">
          ${i}
        </div>
      </div>
    `}render(){if(!this.hass||!this._config)return I`<ha-card><div class="card-content"><div class="loading">Lade...</div></div></ha-card>`;if(!this.hass.states[this._config.entity])return I`<ha-card><div class="card-content">
        <div class="error-banner">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          Entity nicht gefunden: ${this._config.entity}
        </div>
      </div></ha-card>`;if(!this._entities)return I`<ha-card><div class="card-content"><div class="loading">Lade...</div></div></ha-card>`;const e=this._getMowerState(),t=this._config.name||this.hass.states[this._config.entity]?.attributes?.friendly_name||"Mammotion",s=ue(this.hass,this._entities.sensors.battery),i="on"===pe(this.hass,this._entities.charging),n="expert"===this._config.mode,r=this._config.modules||{},a=this._entities.buttons.sync_map?I`<button
          class="sync-btn ${this._syncingMap?"syncing":""}"
          @click=${e=>{e.stopPropagation(),this._handleSync("map")}}
          title="Karte synchronisieren"
          aria-label="Karte synchronisieren"
        ><svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></button>`:"",o=this._entities.buttons.sync_schedule?I`<button
          class="sync-btn ${this._syncingSchedule?"syncing":""}"
          @click=${e=>{e.stopPropagation(),this._handleSync("schedule")}}
          title="Zeitplan synchronisieren"
          aria-label="Zeitplan synchronisieren"
        ><svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></button>`:"";return I`
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <ha-card>
        <div class="card-content">
          ${!1!==r.status?this._renderStatus(t,e,s,i,n):""}
          ${!1!==r.controls?this._renderControls(e):""}
          ${!1!==r.map?this._renderSection("map","mdi:map-marker-radius","Karte",this._renderMapContent(e)):""}
          ${!1!==r.camera&&this._entities.camera?this._renderSection("camera","mdi:camera","Kamera",this._renderCameraContent()):""}
          ${!1!==r.zones?this._renderSection("zones","mdi:vector-square","Bereiche",this._renderZonesContent(),a):""}
          ${r.mowing_config&&n?this._renderSection("mowing","mdi:cog","Mäh-Einstellungen",this._renderMowingContent()):""}
          ${!1!==r.schedule?this._renderSection("schedule","mdi:calendar-clock","Zeitplan",this._renderScheduleContent(n),o):""}
          ${!1!==r.device&&n?this._renderSection("device","mdi:tune","Gerätesteuerung",this._renderDeviceContent()):""}

          ${this._serviceError?I`<div class="service-error">
                <ha-icon icon="mdi:alert-outline"></ha-icon> ${this._serviceError}
              </div>`:""}

          <div class="footer">
            <span class="version">Mammotion Card v${ge}</span>
            <span class="entity-count">${this._countEntities()} Entities</span>
          </div>
        </div>
      </ha-card>
    `}_renderStatus(e,t,s,i,n){const r=ue(this.hass,this._entities.sensors.progress),a=pe(this.hass,this._entities.sensors.error_message),o=ue(this.hass,this._entities.sensors.wifi_rssi),c=ue(this.hass,this._entities.sensors.satellites_robot),l=pe(this.hass,this._entities.sensors.rtk_position);return I`
      <div class="status-header">
        <div class="status-icon-wrap">
          <ha-icon
            icon=${this._stateIcon(t)}
            class="status-icon ${"mowing"===t?"mowing-animation":""}"
            style="color: ${this._stateColor(t)}"
          ></ha-icon>
        </div>

        <div class="status-info">
          <div class="mower-name">${e}</div>
          <div class="state-badge" style="background: ${this._stateColor(t)}">
            ${this._stateLabel(t)}
          </div>
          ${"error"===t&&a?I`<div class="error-msg">${a}</div>`:""}
        </div>

        <div class="battery-wrap">
          <div class="battery-ring" style="--battery-color: ${this._batteryColor(s)}">
            <svg viewBox="0 0 36 36">
              <path
                class="battery-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="battery-fill"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                style="stroke-dasharray: ${s||0}, 100; stroke: ${this._batteryColor(s)}"
              />
            </svg>
            <span class="battery-text">
              ${null!==s?`${Math.round(s)}%`:"?"}
            </span>
            ${i?I`<ha-icon icon="mdi:lightning-bolt" class="charging-icon"></ha-icon>`:""}
          </div>
        </div>
      </div>

      ${n?I`
            <div class="status-details">
              ${null!==c?I`<span class="detail-badge" title="Satelliten">
                    <ha-icon icon="mdi:satellite-variant"></ha-icon> ${c}
                    ${l?I`<span class="rtk-badge">${l}</span>`:""}
                  </span>`:""}
              ${null!==o?I`<span class="detail-badge" title="WiFi ${o} dBm">
                    <ha-icon icon=${this._signalIcon(o)}></ha-icon> ${o} dBm
                  </span>`:""}
              ${null!==r&&"mowing"===t?I`<span class="detail-badge" title="Fortschritt">
                    <ha-icon icon="mdi:percent"></ha-icon> ${r}%
                  </span>`:""}
            </div>
          `:""}
    `}_renderControls(e){const t=ue(this.hass,this._entities.sensors.progress),s=ue(this.hass,this._entities.sensors.elapsed_time),i=ue(this.hass,this._entities.sensors.left_time);return I`
      <div class="controls">
        ${"mowing"===e?I`
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${t||0}%"></div>
                <span class="progress-text">${t||0}%</span>
              </div>
              <div class="time-row">
                ${null!==s?I`<span>${this._formatMinutes(s)} vergangen</span>`:""}
                ${null!==i?I`<span>${this._formatMinutes(i)} verbleibend</span>`:""}
              </div>
            `:""}

        <div class="button-row">
          ${"docked"===e||"paused"===e?I`
                <button class="ctrl-btn start" @click=${()=>this._callService("lawn_mower","start_mowing")}>
                  <ha-icon icon="mdi:play"></ha-icon>
                  ${"paused"===e?"Fortsetzen":"Start"}
                </button>
              `:""}
          ${"mowing"===e?I`
                <button class="ctrl-btn pause" @click=${()=>this._callService("lawn_mower","pause")}>
                  <ha-icon icon="mdi:pause"></ha-icon>
                  Pause
                </button>
              `:""}
          ${"mowing"===e||"paused"===e?I`
                <button class="ctrl-btn dock" @click=${()=>this._callService("lawn_mower","dock")}>
                  <ha-icon icon="mdi:home"></ha-icon>
                  Zurück
                </button>
              `:""}
          ${"mowing"===e||"paused"===e?I`
                <button class="ctrl-btn cancel" @click=${()=>this._pressButton(this._entities.buttons.cancel_task)}>
                  <ha-icon icon="mdi:close-circle"></ha-icon>
                  Abbrechen
                </button>
              `:""}
        </div>
      </div>
    `}_renderMapContent(e){const t=ue(this.hass,this._entities.sensors.latitude),s=ue(this.hass,this._entities.sensors.longitude),i=ue(this.hass,this._entities.sensors.satellites_robot);return null===t||null===s?I`<div class="map-placeholder">Keine GPS-Position verfügbar</div>`:I`
      <div id="mmc-map" class="map-container"></div>
      ${null!==i?I`<div class="map-info"><ha-icon icon="mdi:satellite-variant" style="--mdc-icon-size:14px"></ha-icon> ${i} Satelliten · ${t.toFixed(5)}, ${s.toFixed(5)}</div>`:""}
    `}_renderCameraContent(){const e=this._entities.camera;return e&&this.hass.states[e]?this._isSectionOpen("camera")?(this.hass.states[e],I`
      <div class="camera-container">
        <img
          src="/api/camera_proxy/${e}"
          alt="Mäher-Kamera"
          class="camera-image"
          @error=${e=>{e.target.style.display="none"}}
        />
      </div>
    `):"":I`<div class="map-placeholder">Keine Kamera verfügbar</div>`}_renderZonesContent(){const e=this._entities.areas;return e&&0!==e.length?I`
      <div class="zone-list">
        ${e.map(e=>{const t=this.hass.states[e],s=!t||"unavailable"===t.state,i="on"===t?.state,n=t?.attributes?.friendly_name||"";let r;if(n&&n!==e)r=n.replace(/^[A-Za-z]+-[A-Z0-9]+\s+/,""),r===n&&(r=n.replace(/^.*?\s+(Bereich)/i,"$1"));else{const t=e.match(/bereich_(\w+)$/);r=t?`Bereich ${t[1].replace(/_/g,".")}`:"Bereich"}return I`
            <div class="zone-row ${s?"unavailable":""}">
              <span class="zone-name">
                ${r}
                ${s?I`<span class="unavailable-hint">(nicht verfügbar)</span>`:""}
              </span>
              <ha-switch
                .checked=${i}
                .disabled=${s}
                @change=${()=>!s&&this._toggleSwitch(e)}
              ></ha-switch>
            </div>
          `})}
      </div>
    `:I`<div class="empty-hint">Keine Bereiche gefunden</div>`}_renderMowingContent(){const e=this._entities;return I`
      <div class="config-grid">
        ${this._renderNumberSlider(e.numbers.blade_height,"Schnitthöhe","mm")}
        ${this._renderNumberSlider(e.numbers.working_speed,"Geschwindigkeit","m/s")}
        ${this._renderNumberSlider(e.numbers.path_spacing,"Wegabstand","cm")}
        ${this._renderSelect(e.selects.nav_mode,"Navigation")}
        ${this._renderSelect(e.selects.turn_mode,"Wendemodus")}
        ${this._renderSelect(e.selects.obstacle_mode,"Hinderniserkennung")}
      </div>
    `}_renderScheduleContent(e){const t=this._entities,s=t.tasks||[],i=t.task_areas||[],n=pe(this.hass,t.sensors.non_work_hours),r=ue(this.hass,t.sensors.task_duration);return I`
      ${s.length>0?I`
            <div class="task-list">
              ${s.map(e=>{const t=this.hass.states[e];if(!t)return"";const s=t.attributes?.friendly_name||e,i=s.replace(/^[A-Za-z]+-[A-Z0-9]+\s+/,"")||s.replace(/^.*?\s+/,""),n=null!==r?` · ~${Math.ceil(r)} Min`:"";return I`
                  <button class="task-btn" @click=${()=>this._pressButton(e)}>
                    <ha-icon icon="mdi:play-circle-outline"></ha-icon>
                    <span class="task-label">${i}${n}</span>
                  </button>
                `})}
            </div>
          `:""}

      ${i.length>0?I`
            <div class="task-area-status">
              ${i.map(e=>{const t=this.hass.states[e];if(!t||"unknown"===t.state||"unavailable"===t.state)return"";const s=(t.attributes?.friendly_name||e).replace(/^[A-Za-z]+-[A-Z0-9]+\s+/,"").replace(/^Aufgabenbereich\s*/,"")||"Bereich";return I`
                  <span class="task-area-pill ${this._taskAreaClass(t.state)}">
                    ${s}: ${this._taskAreaLabel(t.state)}
                  </span>
                `})}
            </div>
          `:""}

      ${n&&"unknown"!==n&&"unavailable"!==n?I`
            <div class="schedule-info">
              <div class="schedule-row">
                <ha-icon icon="mdi:clock-remove-outline"></ha-icon>
                <span>Ruhezeit: ${this._formatNonWorkHours(n)}</span>
              </div>
            </div>
          `:""}

      ${e?I`
            <div class="schedule-hint">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              Weitere Mähpläne können in der Mammotion App erstellt werden.
            </div>
          `:""}
    `}_renderDeviceContent(){const e=this._entities;return I`
      <div class="device-toggles">
        ${this._renderCombinedRainToggle()}
        ${this._renderToggle(e.switches.side_led,"Seitenlicht")}
      </div>
    `}_renderCombinedRainToggle(){const e=this._entities?.switches?.rain_mowing,t=this._entities?.switches?.rain_robot;if(!e&&!t)return"";const s=e&&"on"===this.hass.states[e]?.state||t&&"on"===this.hass.states[t]?.state;return I`
      <div class="toggle-row">
        <span><ha-icon icon="mdi:weather-rainy" style="--mdc-icon-size:18px; margin-right:4px; vertical-align:middle; color:var(--secondary-text-color)"></ha-icon>Regenschutz</span>
        <ha-switch
          .checked=${s}
          @change=${()=>this._toggleRainProtection(!s)}
        ></ha-switch>
      </div>
    `}_renderNumberSlider(e,t,s){if(!e||!this.hass.states[e])return"";const i=this.hass.states[e],n=parseFloat(i.state),r=i.attributes?.min,a=i.attributes?.max,o=r??0,c=a??100,l=i.attributes?.step??1;if(o>=c||0===c||void 0===r&&void 0===a&&0===n){const i=e.replace(/^number\./,""),r=this.hass.states[`sensor.${i}`],a=r?parseFloat(r.state):n,o=r?.attributes?.unit_of_measurement||s,c={schnitthohe:[15,100],aufgabengeschwindigkeit:[.2,1.2],wegabstand:[5,35]},h=e.split("_").pop(),[d,p]=c[h]||[0,100];return I`
        <div class="slider-row disabled">
          <label>${t}</label>
          <input type="range" min=${d} max=${p} step=${l} .value=${String(isNaN(a)?0:a)} disabled />
          <span class="slider-val">${isNaN(a)?"?":a} ${o} <ha-icon icon="mdi:lock" style="--mdc-icon-size:14px"></ha-icon></span>
        </div>
      `}return I`
      <div class="slider-row">
        <label>${t}</label>
        <input
          type="range"
          min=${o}
          max=${c}
          step=${l}
          .value=${String(n)}
          @change=${t=>this._setNumber(e,parseFloat(t.target.value))}
        />
        <span class="slider-val">${n} ${s}</span>
      </div>
    `}_renderSelect(e,t){if(!e||!this.hass.states[e])return"";const s=this.hass.states[e],i=s.attributes?.options||[],n=s.state;return I`
      <div class="select-row">
        <label>${t}</label>
        <select @change=${t=>this._setSelect(e,t.target.value)}>
          ${i.map(e=>{return I`<option value=${e} ?selected=${e===n}>${t=e,de[t]||t}</option>`;var t})}
        </select>
      </div>
    `}_renderToggle(e,t){if(!e||!this.hass.states[e])return"";const s="on"===this.hass.states[e].state;return I`
      <div class="toggle-row">
        <span>${t}</span>
        <ha-switch .checked=${s} @change=${()=>this._toggleSwitch(e)}></ha-switch>
      </div>
    `}async _callService(e,t){try{await this.hass.callService(e,t,{entity_id:this._config.entity})}catch(e){this._showServiceError(e.message||"Service-Aufruf fehlgeschlagen")}}async _pressButton(e){if(e)try{await this.hass.callService("button","press",{entity_id:e})}catch(e){this._showServiceError(e.message||"Button-Aufruf fehlgeschlagen")}}_handleSync(e){const t="map"===e?this._entities.buttons.sync_map:this._entities.buttons.sync_schedule;t&&(this._pressButton(t),"map"===e?this._syncingMap=!0:this._syncingSchedule=!0,this.requestUpdate(),setTimeout(()=>{"map"===e?this._syncingMap=!1:this._syncingSchedule=!1,this.requestUpdate()},3e3))}async _toggleSwitch(e){try{await this.hass.callService("switch","toggle",{entity_id:e})}catch(e){this._showServiceError(e.message||"Switch-Aufruf fehlgeschlagen")}}async _toggleRainProtection(e){const t=e?"turn_on":"turn_off",s=this._entities?.switches?.rain_mowing,i=this._entities?.switches?.rain_robot;try{s&&await this.hass.callService("switch",t,{entity_id:s}),i&&await this.hass.callService("switch",t,{entity_id:i})}catch(e){this._showServiceError(e.message||"Regenschutz-Umschaltung fehlgeschlagen")}}async _setNumber(e,t){try{await this.hass.callService("number","set_value",{entity_id:e,value:t})}catch(e){this._showServiceError(e.message||"Wert konnte nicht gesetzt werden")}}async _setSelect(e,t){try{await this.hass.callService("select","select_option",{entity_id:e,option:t})}catch(e){this._showServiceError(e.message||"Auswahl fehlgeschlagen")}}_showServiceError(e){this._serviceError=e,this.requestUpdate(),setTimeout(()=>{this._serviceError=null,this.requestUpdate()},4e3)}async _loadLeaflet(){if(!window.L)return new Promise(e=>{const t=document.createElement("script");t.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",t.onload=e,document.head.appendChild(t)})}async _initMap(){if(this._leafletMap||!this._entities)return;const e=this.renderRoot.querySelector("#mmc-map");if(!e)return;const t=ue(this.hass,this._entities.sensors.latitude),s=ue(this.hass,this._entities.sensors.longitude);if(null===t||null===s)return;if(await this._loadLeaflet(),!window.L||this._leafletMap)return;this._leafletMap=L.map(e,{zoomControl:!0}).setView([t,s],19),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:21,attribution:"&copy; OSM"}).addTo(this._leafletMap);const i=this._markerColor(this._getMowerState());this._mapMarker=L.circleMarker([t,s],{radius:8,color:i,fillColor:i,fillOpacity:.8,weight:2}).addTo(this._leafletMap),setTimeout(()=>this._leafletMap.invalidateSize(),200)}_updateMapMarker(){if(!this._leafletMap||!this._mapMarker)return;const e=ue(this.hass,this._entities.sensors.latitude),t=ue(this.hass,this._entities.sensors.longitude);if(null===e||null===t)return;this._mapMarker.setLatLng([e,t]);const s=this._markerColor(this._getMowerState());this._mapMarker.setStyle({color:s,fillColor:s}),"mowing"===this._getMowerState()&&this._leafletMap.panTo([e,t],{animate:!0})}_markerColor(e){return{mowing:"#4CAF50",docked:"#2196F3",paused:"#FF9800",returning:"#2196F3",error:"#F44336"}[e]||"#999"}async updated(e){super.updated(e),this._isSectionOpen("map")&&!this._leafletMap&&await this._initMap(),this._leafletMap&&this._updateMapMarker()}shouldUpdate(e){if(!e.has("hass"))return!0;const t=e.get("hass");if(!t||!this._entities)return!0;return this._getAllEntityIds().some(e=>t.states[e]!==this.hass.states[e])}_getAllEntityIds(){const e=this._entities;if(!e)return[];const t=[e.lawn_mower];e.camera&&t.push(e.camera),e.device_tracker&&t.push(e.device_tracker),e.charging&&t.push(e.charging);for(const s of["sensors","buttons","selects","numbers","switches"])e[s]&&t.push(...Object.values(e[s]));return e.areas&&t.push(...e.areas),e.tasks&&t.push(...e.tasks),e.task_areas&&t.push(...e.task_areas),t}_formatMinutes(e){if(null===e)return"";const t=Math.floor(e/60),s=Math.round(e%60);return t>0?`${t}h ${s}m`:`${s}m`}_signalIcon(e){return e>-50?"mdi:wifi-strength-4":e>-60?"mdi:wifi-strength-3":e>-70?"mdi:wifi-strength-2":e>-80?"mdi:wifi-strength-1":"mdi:wifi-strength-alert-outline"}_taskAreaClass(e){const t=e.toUpperCase();return"MOWING"===t?"active":"COMPLETED"===t?"completed":"WAITING"===t?"waiting":"other"}_taskAreaLabel(e){return{MOWING:"Mäht",WAITING:"Wartet",COMPLETED:"Fertig",NOT_STARTED:"Nicht gestartet"}[e.toUpperCase()]||e}_formatNonWorkHours(e){return e&&"Not set"!==e?e.replace(/(\d{1,2}:\d{2})(am|pm)/gi,(e,t,s)=>{const[i,n]=t.split(":");let r=parseInt(i,10);return"pm"===s.toLowerCase()&&12!==r&&(r+=12),"am"===s.toLowerCase()&&12===r&&(r=0),`${String(r).padStart(2,"0")}:${n}`}):"Keine Ruhezeit konfiguriert"}_countEntities(){if(!this._entities)return 0;let e=1;this._entities.camera&&e++,this._entities.device_tracker&&e++,this._entities.charging&&e++;for(const t of["sensors","buttons","selects","numbers","switches"])e+=Object.keys(this._entities[t]||{}).length;return e+=(this._entities.areas||[]).length,e+=(this._entities.tasks||[]).length,e+=(this._entities.task_areas||[]).length,e}static get styles(){return r`
      :host {
        --mmc-spacing: 12px;
        --mmc-radius: 12px;
        container-type: inline-size;
        container-name: mmc;
      }

      ha-card {
        overflow: hidden;
        border-radius: var(--ha-card-border-radius, 12px);
      }

      .card-content {
        padding: var(--mmc-spacing);
      }

      .loading {
        padding: 24px;
        text-align: center;
        color: var(--secondary-text-color);
      }

      .error-banner {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px;
        color: var(--error-color, #f44336);
        font-size: 14px;
      }

      .error-banner ha-icon {
        --mdc-icon-size: 24px;
        flex-shrink: 0;
      }

      .service-error {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        margin-top: 8px;
        background: var(--error-color, #f44336);
        color: white;
        font-size: 12px;
        border-radius: 8px;
        animation: fadeIn 0.2s ease;
      }

      .service-error ha-icon {
        --mdc-icon-size: 16px;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Status Header */
      .status-header {
        display: flex;
        align-items: center;
        gap: var(--mmc-spacing);
        padding-bottom: var(--mmc-spacing);
      }

      .status-icon-wrap {
        flex-shrink: 0;
      }

      .status-icon {
        --mdc-icon-size: 40px;
      }

      .mowing-animation {
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .status-info {
        flex: 1;
        min-width: 0;
      }

      .mower-name {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .state-badge {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 12px;
        color: white;
        font-size: 12px;
        font-weight: 500;
        margin-top: 4px;
      }

      .error-msg {
        font-size: 12px;
        color: var(--error-color, #f44336);
        margin-top: 4px;
        word-break: break-word;
      }

      /* Battery Ring */
      .battery-wrap {
        flex-shrink: 0;
      }

      .battery-ring {
        position: relative;
        width: 56px;
        height: 56px;
      }

      .battery-ring svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .battery-bg {
        fill: none;
        stroke: var(--divider-color, #e0e0e0);
        stroke-width: 3;
      }

      .battery-fill {
        fill: none;
        stroke-width: 3;
        stroke-linecap: round;
        transition: stroke-dasharray 0.5s ease;
      }

      .battery-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .charging-icon {
        position: absolute;
        bottom: -4px;
        right: -4px;
        --mdc-icon-size: 18px;
        color: var(--warning-color, #ff9800);
      }

      /* Status Details */
      .status-details {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        padding-bottom: var(--mmc-spacing);
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
        margin-bottom: var(--mmc-spacing);
      }

      .detail-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color, #f5f5f5);
        padding: 2px 8px;
        border-radius: 8px;
      }

      .detail-badge ha-icon {
        --mdc-icon-size: 14px;
      }

      .rtk-badge {
        font-weight: 600;
        color: var(--state-active-color, #4caf50);
      }

      /* Controls */
      .controls {
        padding-bottom: var(--mmc-spacing);
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
        margin-bottom: var(--mmc-spacing);
      }

      .progress-bar {
        position: relative;
        height: 24px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: var(--mmc-radius);
        overflow: hidden;
        margin-bottom: 8px;
      }

      .progress-fill {
        height: 100%;
        background: var(--state-active-color, #4caf50);
        transition: width 0.5s ease;
        border-radius: var(--mmc-radius);
      }

      .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .time-row {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 8px;
      }

      .button-row {
        display: flex;
        gap: 8px;
      }

      .ctrl-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 12px;
        border: none;
        border-radius: var(--mmc-radius);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        color: white;
        transition: opacity 0.2s;
        min-height: 48px;
      }

      .ctrl-btn:active {
        opacity: 0.7;
      }

      .ctrl-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .ctrl-btn.start {
        background: var(--state-active-color, #4caf50);
      }
      .ctrl-btn.pause {
        background: var(--warning-color, #ff9800);
      }
      .ctrl-btn.dock {
        background: var(--info-color, #2196f3);
      }
      .ctrl-btn.cancel {
        background: var(--error-color, #f44336);
      }

      /* Accordion Sections */
      .section {
        margin-bottom: 4px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
      }

      .section:last-of-type {
        border-bottom: none;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 0;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .section-header ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
      }

      .section-title-text {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        flex: 1;
      }

      .chevron {
        font-size: 14px;
        color: var(--secondary-text-color);
        transition: transform 0.3s ease;
        flex-shrink: 0;
      }

      .chevron.open {
        transform: rotate(90deg);
      }

      .accordion-content {
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.3s ease-out;
      }

      .accordion-content.open {
        max-height: 2000px;
        transition: max-height 0.5s ease-in;
      }

      /* Sync Button */
      .sync-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border: none;
        border-radius: 50%;
        background: var(--secondary-background-color, #f5f5f5);
        color: var(--secondary-text-color);
        cursor: pointer;
        padding: 0;
        transition: color 0.2s, background 0.2s;
        flex-shrink: 0;
      }

      .sync-btn:hover {
        color: var(--primary-text-color);
        background: var(--divider-color, #e0e0e0);
      }

      .sync-btn:active {
        opacity: 0.7;
      }

      .sync-btn svg {
        width: 18px;
        height: 18px;
      }

      .sync-btn.syncing svg {
        animation: spin 1s linear infinite;
      }

      .sync-btn.syncing {
        color: var(--state-active-color, #4caf50);
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Map */
      .map-container {
        height: 250px;
        border-radius: var(--mmc-radius);
        overflow: hidden;
        margin-bottom: 4px;
        z-index: 0;
      }

      .map-placeholder {
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
        font-size: 13px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: var(--mmc-radius);
      }

      .map-info {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: var(--secondary-text-color);
        padding: 4px 0;
      }

      /* Camera */
      .camera-container {
        border-radius: var(--mmc-radius);
        overflow: hidden;
      }

      .camera-image {
        width: 100%;
        display: block;
        border-radius: var(--mmc-radius);
      }

      /* Config Grid */
      .config-grid {
        display: grid;
        gap: 8px;
        padding-bottom: 8px;
      }

      .slider-row,
      .select-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .slider-row label,
      .select-row label {
        flex: 0 0 120px;
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .slider-row input[type="range"] {
        flex: 1;
      }

      .slider-val {
        flex: 0 0 70px;
        font-size: 13px;
        text-align: right;
        color: var(--primary-text-color);
      }

      .slider-row.disabled {
        opacity: 0.5;
      }

      .slider-row.disabled input[type="range"] {
        pointer-events: none;
      }

      .select-row select {
        flex: 1;
        padding: 6px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font-size: 13px;
      }

      /* Zones */
      .zone-list {
        display: grid;
        gap: 4px;
        padding-bottom: 8px;
      }

      .zone-row,
      .toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 0;
      }

      .zone-name {
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .zone-row.unavailable {
        opacity: 0.45;
      }

      .zone-row.unavailable ha-switch {
        pointer-events: none;
      }

      .unavailable-hint {
        font-size: 11px;
        color: var(--secondary-text-color);
        font-style: italic;
        margin-left: 4px;
      }

      .empty-hint {
        font-size: 13px;
        color: var(--secondary-text-color);
        padding: 8px 0;
      }

      /* Device Toggles */
      .device-toggles {
        display: grid;
        gap: 4px;
        padding-bottom: 8px;
      }

      .toggle-row span {
        font-size: 14px;
        color: var(--primary-text-color);
      }

      /* Schedule */
      .task-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
      }

      .task-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: var(--mmc-radius);
        background: var(--secondary-background-color, #f5f5f5);
        color: var(--primary-text-color);
        font-size: 13px;
        cursor: pointer;
        transition: opacity 0.2s;
        min-height: 44px;
      }

      .task-btn:active {
        opacity: 0.7;
      }

      .task-btn ha-icon {
        --mdc-icon-size: 18px;
        color: var(--state-active-color, #4caf50);
        flex-shrink: 0;
      }

      .task-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Task Area Status Pills */
      .task-area-status {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 8px;
      }

      .task-area-pill {
        display: inline-flex;
        align-items: center;
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
      }

      .task-area-pill.active {
        background: var(--state-active-color, #4caf50);
        color: white;
      }

      .task-area-pill.waiting {
        background: var(--divider-color, #e0e0e0);
        color: var(--secondary-text-color);
      }

      .task-area-pill.completed {
        background: var(--info-color, #2196f3);
        color: white;
      }

      .task-area-pill.other {
        background: var(--warning-color, #ff9800);
        color: white;
      }

      .schedule-info {
        display: grid;
        gap: 4px;
        margin-bottom: 8px;
      }

      .schedule-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .schedule-row ha-icon {
        --mdc-icon-size: 16px;
      }

      .schedule-hint {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--secondary-text-color);
        opacity: 0.7;
        font-style: italic;
        padding-bottom: 4px;
      }

      .schedule-hint ha-icon {
        --mdc-icon-size: 14px;
      }

      /* Footer */
      .footer {
        display: flex;
        justify-content: space-between;
        padding-top: 4px;
        font-size: 10px;
        color: var(--disabled-text-color, #999);
      }

      /* ===== Responsive: Mobile-first ===== */

      ha-switch {
        min-height: 44px;
        min-width: 44px;
      }

      .zone-row,
      .toggle-row {
        min-height: 44px;
      }

      /* Small cards (< 360px) */
      @container mmc (max-width: 359px) {
        .button-row {
          flex-direction: column;
        }

        .task-list {
          flex-direction: column;
        }

        .task-btn {
          width: 100%;
          justify-content: center;
        }

        .status-header {
          flex-wrap: wrap;
        }

        .battery-wrap {
          margin-left: auto;
        }

        .detail-badge {
          font-size: 11px;
          padding: 2px 6px;
        }

        .slider-row label,
        .select-row label {
          flex: 0 0 90px;
          font-size: 12px;
        }

        .slider-val {
          flex: 0 0 55px;
          font-size: 12px;
        }

        .map-container {
          height: 200px;
        }
      }

      /* Very narrow (< 300px) */
      @container mmc (max-width: 299px) {
        .slider-row,
        .select-row {
          flex-wrap: wrap;
        }

        .slider-row label,
        .select-row label {
          flex: 1 1 100%;
          margin-bottom: 2px;
        }

        .slider-row input[type="range"] {
          flex: 1 1 60%;
        }

        .slider-val {
          flex: 0 0 auto;
        }
      }

      /* Wider cards (> 500px) */
      @container mmc (min-width: 500px) {
        .mower-name {
          font-size: 18px;
        }

        .button-row {
          gap: 12px;
        }

        .config-grid {
          grid-template-columns: 1fr 1fr;
        }

        .map-container {
          height: 300px;
        }
      }
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"mammotion-card",name:"Mammotion Dashboard Card",description:"Custom card for Mammotion Luba robotic mowers",preview:!0,documentationURL:"https://github.com/mikey0000/Mammotion-HA"}),console.info(`%c MAMMOTION-CARD %c v${ge} `,"color: white; background: #4caf50; font-weight: bold; padding: 2px 4px; border-radius: 4px 0 0 4px;","color: #4caf50; background: #f5f5f5; font-weight: bold; padding: 2px 4px; border-radius: 0 4px 4px 0;");
