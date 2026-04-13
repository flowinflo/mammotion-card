/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const s=this.t;if(t&&void 0===e){const t=void 0!==s&&1===s.length;t&&(e=i.get(s)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&i.set(s,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new n(i,e,s)},a=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:o,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,g=u.trustedTypes,_=g?g.emptyScript:"",m=u.reactiveElementPolyfillSupport,f=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},v=(e,t)=>!o(e,t),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&l(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:n}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const r=i?.call(this);n?.call(this,t),this.requestUpdate(e,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...d(e),...h(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(t)s.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of i){const i=document.createElement("style"),n=e.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=t.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(t,s.type);this._$Em=e,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=i;const r=n.fromAttribute(t,e.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(void 0!==e){const r=this.constructor;if(!1===i&&(n=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??v)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==n||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[f("elementProperties")]=new Map,x[f("finalized")]=new Map,m?.({ReactiveElement:x}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,w=e=>e,k=$.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+z,M=`<${E}>`,C=document,P=()=>C.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,T="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,H=/>/g,W=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,j=/"/g,I=/^(?:script|style|textarea|title)$/i,D=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),F=Symbol.for("lit-noChange"),Z=Symbol.for("lit-nothing"),K=new WeakMap,V=C.createTreeWalker(C,129);function q(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const G=(e,t)=>{const s=e.length-1,i=[];let n,r=2===t?"<svg>":3===t?"<math>":"",a=U;for(let t=0;t<s;t++){const s=e[t];let o,l,c=-1,d=0;for(;d<s.length&&(a.lastIndex=d,l=a.exec(s),null!==l);)d=a.lastIndex,a===U?"!--"===l[1]?a=R:void 0!==l[1]?a=H:void 0!==l[2]?(I.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=W):void 0!==l[3]&&(a=W):a===W?">"===l[0]?(a=n??U,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,o=l[1],a=void 0===l[3]?W:'"'===l[3]?j:B):a===j||a===B?a=W:a===R||a===H?a=U:(a=W,n=void 0);const h=a===W&&e[t+1].startsWith("/>")?" ":"";r+=a===U?s+M:c>=0?(i.push(o),s.slice(0,c)+A+s.slice(c)+z+h):s+z+(-2===c?t:h)}return[q(e,r+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class Y{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,r=0;const a=e.length-1,o=this.parts,[l,c]=G(e,t);if(this.el=Y.createElement(l,s),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=V.nextNode())&&o.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(A)){const t=c[r++],s=i.getAttribute(e).split(z),a=/([.?@])?(.*)/.exec(t);o.push({type:1,index:n,name:a[2],strings:s,ctor:"."===a[1]?te:"?"===a[1]?se:"@"===a[1]?ie:ee}),i.removeAttribute(e)}else e.startsWith(z)&&(o.push({type:6,index:n}),i.removeAttribute(e));if(I.test(i.tagName)){const e=i.textContent.split(z),t=e.length-1;if(t>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],P()),V.nextNode(),o.push({type:2,index:++n});i.append(e[t],P())}}}else if(8===i.nodeType)if(i.data===E)o.push({type:2,index:n});else{let e=-1;for(;-1!==(e=i.data.indexOf(z,e+1));)o.push({type:7,index:n}),e+=z.length-1}n++}}static createElement(e,t){const s=C.createElement("template");return s.innerHTML=e,s}}function J(e,t,s=e,i){if(t===F)return t;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const r=O(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(e),n._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(t=J(e,n._$AS(e,t.values),n,i)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??C).importNode(t,!0);V.currentNode=i;let n=V.nextNode(),r=0,a=0,o=s[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new X(n,n.nextSibling,this,e):1===o.type?t=new o.ctor(n,o.name,o.strings,this,e):6===o.type&&(t=new ne(n,this,e)),this._$AV.push(t),o=s[++a]}r!==o?.index&&(n=V.nextNode(),r++)}return V.currentNode=C,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=Z,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),O(e)?e===Z||null==e||""===e?(this._$AH!==Z&&this._$AR(),this._$AH=Z):e!==this._$AH&&e!==F&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Z&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=Y.createElement(q(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new Q(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=K.get(e.strings);return void 0===t&&K.set(e.strings,t=new Y(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const n of e)i===t.length?t.push(s=new X(this.O(P()),this.O(P()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=w(e).nextSibling;w(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=Z,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=Z}_$AI(e,t=this,s,i){const n=this.strings;let r=!1;if(void 0===n)e=J(this,e,t,0),r=!O(e)||e!==this._$AH&&e!==F,r&&(this._$AH=e);else{const i=e;let a,o;for(e=n[0],a=0;a<n.length-1;a++)o=J(this,i[s+a],t,a),o===F&&(o=this._$AH[a]),r||=!O(o)||o!==this._$AH[a],o===Z?e=Z:e!==Z&&(e+=(o??"")+n[a+1]),this._$AH[a]=o}r&&!i&&this.j(e)}j(e){e===Z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Z?void 0:e}}let se=class extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Z)}};class ie extends ee{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??Z)===F)return;const s=this._$AH,i=e===Z&&s!==Z||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==Z&&(s===Z||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(Y,X),($.litHtmlVersions??=[]).push("3.3.2");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class oe extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let n=i._$litPart$;if(void 0===n){const e=s?.renderBefore??null;i._$litPart$=n=new X(t.insertBefore(P(),e),e,void 0,s??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}oe._$litElement$=!0,oe.finalized=!0,ae.litElementHydrateSupport?.({LitElement:oe});const le=ae.litElementPolyfillSupport;le?.({LitElement:oe}),(ae.litElementVersions??=[]).push("4.2.2");const ce={sensors:{battery:"_batterie",activity_mode:"_aktivitatsmodus",progress:"_fortschritt",area:"_bereich",mowing_speed:"_mahgeschwindigkeit",blade_height:"_schnitthohe",total_time:"_gesamtzeit",elapsed_time:"_vergangene_zeit",left_time:"_verbleibende_zeit",satellites_robot:"_satelliten_roboter",l1_satellites:"_l1_satelliten_co_viewing",l2_satellites:"_l2_satelliten_co_viewing",rtk_position:"_rtk_position",position_type:"_typ_der_geratepositionierung",wifi_rssi:"_wi_fi_rssi",ble_rssi:"_ble_rssi",mnet_rssi:"_mobilfunk_rssi",connect_type:"_verbindungsart",latitude:"_breitengrad",longitude:"_langengrad",work_area:"_arbeitsbereich",error_code:"_letzter_fehlercode",error_message:"_letzte_fehlermeldung",error_time:"_letzter_fehlerzeitpunkt",blade_used_time:"_messernutzungszeit",blade_warn_time:"_messerverschleiss_warnzeit",total_distance:"_gesamtkilometerstand",battery_cycles:"_batteriezyklen",camera_brightness:"_kamera_helligkeit",non_work_hours:"_arbeitsfreie_zeit",task_duration:"_aufgabendauer",task_area:"_aufgabenbereich_area_1"},buttons:{release_dock:"_abdocken",cancel_task:"_aktuelle_aufgabe_abbrechen",sync_map:"_synchronisiere_karte",sync_schedule:"_synchronisiere_zeitplan",resync_rtk:"_synchronisiere_rtk_und_ladestation",relocate_dock:"_ladestation_umsetzen",nudge_forward:"_notfall_schub_vorwarts",nudge_back:"_notfall_schub_ruckwarts",nudge_left:"_notfall_schub_links",nudge_right:"_notfall_schub_rechts",restart:"_restart_mower"},selects:{charge_mode:"_aufladungsmodus",path_order:"_ausfuhrungsreihenfolge_des_pfades",obstacle_mode:"_modus_der_hinderniserkennung",nav_mode:"_navigationsmodus",border_laps:"_patrouillenrunden_fur_den_seitlichen_rasenschnitt",nogo_laps:"_patrouillenrunden_fur_mahen_von_no_go_zonen",angle_mode:"_wegwinkel_modus",turn_mode:"_wendemodus"},numbers:{working_speed:"_aufgabengeschwindigkeit",start_progress:"_fortschritt_beim_start",cutting_angle:"_kreuzungswinkel",blade_height:"_schnitthohe",path_spacing:"_wegabstand",path_angle:"_wegwinkel"},switches:{rain_mowing:"_regenerkennung_beim_mahen",rain_robot:"_regenerkennung_roboter",side_led:"_seitenlicht",schedule_updates:"_updates_ein_ausschalten"}};function de(e){return{sensors:"sensor",buttons:"button",selects:"select",numbers:"number",switches:"switch"}[e]||e}const he={single_grid:"Einzelbahn",double_grid:"Doppelbahn",segment_grid:"Segmentbahn",no_grid:"Ohne Bahn",zero_turn:"Nullwendung",multipoint:"Mehrpunkt",direct_touch:"Direktkontakt",slow_touch:"Langsamer Kontakt",less_touch:"Weniger Kontakt",no_touch:"Kein Kontakt",sensitive:"Empfindlich",direct:"Direkt",follow_perimeter:"Randverfolgung",border_first:"Rand zuerst",grid_first:"Bahn zuerst",relative_angle:"Relativer Winkel",absolute_angle:"Absoluter Winkel",random_angle:"Zufälliger Winkel",none:"Keine",one:"1 Runde",two:"2 Runden",three:"3 Runden",four:"4 Runden"};function pe(e,t){const s=function(e,t){return e&&t&&e.states[t]||null}(e,t);return s?s.state:null}function ue(e,t){const s=pe(e,t);if(null===s||"unknown"===s||"unavailable"===s)return null;const i=parseFloat(s);return isNaN(i)?null:i}const ge={map:!0,zones:!0,settings:!0,schedule:!0,maintenance:!0},_e={map:"Karte",zones:"Bereiche",settings:"Einstellungen",schedule:"Zeitplan",maintenance:"Wartung"};customElements.define("mammotion-card-editor",class extends oe{static get properties(){return{hass:{attribute:!1},_config:{state:!0}}}setConfig(e){this._config={...e}}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target,s=t.configValue;let i=e.detail?.value??t.value;"mode"===s&&(i=t.value);const n={...this._config,[s]:i};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n},bubbles:!0,composed:!0}))}_moduleChanged(e){const t=e.target.configValue,s=e.target.checked,i={...ge,...this._config.modules,[t]:s},n={...this._config,modules:i};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this._config)return D``;const e=Object.keys(this.hass.states).filter(e=>e.startsWith("lawn_mower.")).sort(),t={...ge,...this._config.modules};return D`
      <div class="card-config">
        <div class="field">
          <label>Mäher-Entity (Pflicht)</label>
          <select
            .configValue=${"entity"}
            .value=${this._config.entity||""}
            @change=${this._valueChanged}
          >
            <option value="">-- lawn_mower Entity wählen --</option>
            ${e.map(e=>D`
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
            ${Object.entries(t).map(([e,t])=>D`
                <label class="module-toggle">
                  <input
                    type="checkbox"
                    .configValue=${e}
                    .checked=${t}
                    @change=${this._moduleChanged}
                  />
                  ${_e[e]||e}
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
    `}});const me="0.9.0";customElements.define("mammotion-card",class extends oe{static get properties(){return{hass:{attribute:!1},_config:{state:!0},_entities:{state:!0},_syncingMap:{state:!0},_syncingSchedule:{state:!0},_serviceError:{state:!0},_openSections:{state:!0},_bladeWarnInput:{state:!0}}}static getConfigElement(){return document.createElement("mammotion-card-editor")}static getStubConfig(e){return{entity:Object.keys(e.states).find(e=>e.startsWith("lawn_mower."))||"",mode:"family",modules:{map:!0,zones:!0,settings:!0,schedule:!0,maintenance:!0}}}setConfig(e){if(!e.entity)throw new Error("Please define a lawn_mower entity");let t={map:!0,zones:!0,settings:!0,schedule:!0,maintenance:!0};if(e.modules){const s=e.modules;t={...t,...s},"map_and_zones"in s&&!("map"in s)&&(t.map=s.map_and_zones),"map_and_zones"in s&&!("zones"in s)&&(t.zones=s.map_and_zones),!("mowing_config"in s)&&!("device"in s)||"settings"in s||(t.settings=!1!==s.mowing_config||!1!==s.device)}this._config={mode:"family",...e,modules:t},this._entities=null,this._bladeWarnInput=null;const s="expert"===this._config.mode;this._openSections=new Set(s?["zones","settings"]:["zones"])}set hass(e){const t=this._hass;this._hass=e,this._entities&&t||(this._entities=function(e,t){if(!e||!t)return null;const s=t.replace("lawn_mower.",""),i={lawn_mower:t,camera:`camera.${s}`,device_tracker:null,charging:`binary_sensor.${s}_ladestatus`,sensors:{},buttons:{},selects:{},numbers:{},switches:{},areas:[],tasks:[],task_areas:[]},n=`device_tracker.${s}_${s}`;if(e.states[n])i.device_tracker=n;else for(const t of Object.keys(e.states))if(t.startsWith(`device_tracker.${s}`)){i.device_tracker=t;break}for(const[t,n]of Object.entries(ce))for(const[r,a]of Object.entries(n)){const n=`${de(t)}.${s}${a}`;e.states[n]&&(i[t][r]=n)}for(const t of Object.keys(e.states))(t.startsWith(`switch.${s}_bereich_area_`)||t.startsWith(`switch.${s}_bereich_`))&&(t.includes("_regenerkennung")||t.includes("_seitenlicht")||t.includes("_updates")||i.areas.push(t));for(const t of Object.keys(e.states))!t.startsWith(`button.${s}_`)||!t.includes("_aufgabe_")&&!t.includes("_task_")||t.includes("_abbrechen")||t.includes("_synchronisiere")||i.tasks.push(t);for(const t of Object.keys(e.states))t.startsWith(`sensor.${s}_aufgabenbereich_`)&&i.task_areas.push(t);return i}(e,this._config.entity)),this.requestUpdate("hass",t)}get hass(){return this._hass}getCardSize(){return"expert"===this._config?.mode?8:5}_getMowerState(){return pe(this.hass,this._config.entity)||"unknown"}_getGpsPosition(){const e=this._entities?.device_tracker;if(e){const t=this.hass.states[e],s=t?.attributes?.latitude,i=t?.attributes?.longitude;if(null!=s&&null!=i)return{lat:Number(s),lng:Number(i)}}const t=ue(this.hass,this._entities?.sensors?.latitude),s=ue(this.hass,this._entities?.sensors?.longitude);return null!==t&&null!==s?{lat:t,lng:s}:null}_stateIcon(e){const t={mowing:"mdi:robot-mower",paused:"mdi:pause-circle",docked:"mdi:home-circle",returning:"mdi:arrow-left-circle",error:"mdi:alert-circle",unknown:"mdi:help-circle"};return t[e]||t.unknown}_stateColor(e){return{mowing:"var(--state-active-color, #4caf50)",paused:"var(--warning-color, #ff9800)",docked:"var(--info-color, #2196f3)",returning:"var(--info-color, #2196f3)",error:"var(--error-color, #f44336)"}[e]||"var(--secondary-text-color)"}_stateLabel(e){return{mowing:"Mäht",paused:"Pausiert",docked:"Angedockt",returning:"Fährt zurück",error:"Fehler",unknown:"Unbekannt"}[e]||e}_batteryColor(e){return null===e?"var(--secondary-text-color)":e>50?"#4caf50":e>20?"#ff9800":"#f44336"}_toggleSection(e){this._openSections||(this._openSections=new Set),this._openSections.has(e)?this._openSections.delete(e):this._openSections.add(e),this.requestUpdate()}_isSectionOpen(e){return!!this._openSections&&this._openSections.has(e)}_renderSection(e,t,s,i,n){const r=this._isSectionOpen(e);return D`
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
    `}render(){if(!this.hass||!this._config)return D`<ha-card><div class="card-content"><div class="loading">Lade...</div></div></ha-card>`;if(!this.hass.states[this._config.entity])return D`<ha-card><div class="card-content">
        <div class="error-banner">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          Entity nicht gefunden: ${this._config.entity}
        </div>
      </div></ha-card>`;if(!this._entities)return D`<ha-card><div class="card-content"><div class="loading">Lade...</div></div></ha-card>`;const e=this._getMowerState(),t=this._config.name||"Luba",s=this.hass.states[this._config.entity]?.attributes?.friendly_name||""||this._config.entity.replace("lawn_mower.",""),i=ue(this.hass,this._entities.sensors.battery),n="on"===pe(this.hass,this._entities.charging),r="expert"===this._config.mode,a=this._config.modules||{},o=pe(this.hass,this._entities.sensors.error_message),l=this._entities.buttons.sync_map?D`<button
          class="sync-btn ${this._syncingMap?"syncing":""}"
          @click=${e=>{e.stopPropagation(),this._handleSync("map")}}
          title="Karte synchronisieren"
          aria-label="Karte synchronisieren"
        ><svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></button>`:"",c=this._entities.buttons.sync_schedule?D`<button
          class="sync-btn ${this._syncingSchedule?"syncing":""}"
          @click=${e=>{e.stopPropagation(),this._handleSync("schedule")}}
          title="Zeitplan synchronisieren"
          aria-label="Zeitplan synchronisieren"
        ><svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></button>`:"";return D`
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <ha-card>
        ${!1!==a.map?this._renderMapHero(t,s,e,i,n):this._renderSimpleHeader(t,s,e,i,n)}

        ${"mowing"===e||"paused"===e?this._renderMowingProgress(e):""}

        <div class="card-content">
          ${"error"===e&&o?D`<div class="error-msg-banner">
                <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size:18px"></ha-icon>
                ${o}
              </div>`:""}

          ${this._renderControls(e)}

          ${!1!==a.zones?this._renderSection("zones","mdi:vector-square","Bereiche",this._renderZonesContent(),l):""}
          ${!1!==a.settings?this._renderSection("settings","mdi:cog","Einstellungen",this._renderSettingsContent()):""}
          ${!1!==a.schedule?this._renderSection("schedule","mdi:calendar-clock","Zeitplan",this._renderScheduleContent(r),c):""}
          ${!1!==a.maintenance?this._renderSection("maintenance","mdi:wrench","Wartung",this._renderMaintenanceContent(r)):""}

          ${this._serviceError?D`<div class="service-error">
                <ha-icon icon="mdi:alert-outline"></ha-icon> ${this._serviceError}
              </div>`:""}

          <div class="footer">
            <span class="version">Mammotion Card v${me}</span>
            <span class="entity-count">${this._countEntities()} Entities</span>
          </div>
        </div>
      </ha-card>
    `}_renderMapHero(e,t,s,i,n){const r=ue(this.hass,this._entities.sensors.satellites_robot),a=pe(this.hass,this._entities.sensors.rtk_position),o=ue(this.hass,this._entities.sensors.wifi_rssi),l=this._getGpsPosition();return D`
      <div class="map-hero">
        ${null!==l?D`<div id="mmc-map" class="map-container"></div>`:D`<div class="map-hero-placeholder">
              <ha-icon icon="mdi:satellite-variant"></ha-icon>
              <span>GPS-Position wird gesucht...</span>
            </div>`}
        <div class="map-overlay">
          <div class="overlay-top">
            <div class="device-info">
              <span class="device-name">${e} <span class="device-id">(${t})</span></span>
              <span class="status-badge ${s}">${this._stateLabel(s)}</span>
            </div>
            <div class="battery-ring-hero">
              <svg viewBox="0 0 36 36">
                <path
                  class="battery-bg-hero"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="battery-fill-hero"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style="stroke-dasharray: ${i||0}, 100; stroke: ${this._batteryColor(i)}"
                />
              </svg>
              <span class="battery-text-hero">
                ${null!==i?`${Math.round(i)}%`:"?"}
              </span>
              ${n?D`<ha-icon icon="mdi:lightning-bolt" class="charging-icon-hero"></ha-icon>`:""}
            </div>
          </div>
          <div class="overlay-bottom">
            ${null!==r?D`<span class="info-pill">\u{1F6F0} ${r} Sat</span>`:""}
            ${null!==o?D`<span class="info-pill">\u{1F4E1} ${o} dBm</span>`:""}
            ${a&&"unknown"!==a&&"unavailable"!==a?D`<span class="info-pill">${a}</span>`:""}
          </div>
        </div>
      </div>
    `}_renderSimpleHeader(e,t,s,i,n){return D`
      <div class="simple-header">
        <ha-icon
          icon=${this._stateIcon(s)}
          class="${"mowing"===s?"mowing-animation":""}"
          style="color: ${this._stateColor(s)}; --mdc-icon-size: 36px"
        ></ha-icon>
        <div class="simple-header-info">
          <span class="simple-header-name">${e} <span class="device-id" style="color:var(--secondary-text-color)">(${t})</span></span>
          <span class="status-badge ${s}">${this._stateLabel(s)}</span>
        </div>
        <div class="battery-ring-hero" style="width:48px; height:48px">
          <svg viewBox="0 0 36 36">
            <path class="battery-bg-hero" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="battery-fill-hero" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style="stroke-dasharray: ${i||0}, 100; stroke: ${this._batteryColor(i)}" />
          </svg>
          <span class="battery-text-hero" style="color: var(--primary-text-color)">${null!==i?`${Math.round(i)}%`:"?"}</span>
          ${n?D`<ha-icon icon="mdi:lightning-bolt" class="charging-icon-hero"></ha-icon>`:""}
        </div>
      </div>
    `}_renderControls(e){return D`
      <div class="controls">
        <div class="button-row">
          ${"docked"===e||"paused"===e?D`
                <button class="ctrl-btn start" @click=${()=>this._callService("lawn_mower","start_mowing")}>
                  <ha-icon icon="mdi:play"></ha-icon>
                  ${"paused"===e?"Fortsetzen":"Start"}
                </button>
              `:""}
          ${"mowing"===e?D`
                <button class="ctrl-btn pause" @click=${()=>this._callService("lawn_mower","pause")}>
                  <ha-icon icon="mdi:pause"></ha-icon>
                  Pause
                </button>
              `:""}
          ${"mowing"===e||"paused"===e?D`
                <button class="ctrl-btn dock" @click=${()=>this._callService("lawn_mower","dock")}>
                  <ha-icon icon="mdi:home"></ha-icon>
                  Zurück
                </button>
              `:""}
          ${"mowing"===e||"paused"===e?D`
                <button class="ctrl-btn cancel" @click=${()=>this._pressButton(this._entities.buttons.cancel_task)}>
                  <ha-icon icon="mdi:close-circle"></ha-icon>
                  Abbrechen
                </button>
              `:""}
        </div>
      </div>
    `}_renderSelectAllZones(){const e=this._entities?.areas||[],t=(e.some(e=>!this._isOrphanedArea(e))?e.filter(e=>!this._isOrphanedArea(e)):e).filter(e=>"unavailable"!==this.hass.states[e]?.state);if(t.length<=1)return"";const s=t.every(e=>"on"===this.hass.states[e]?.state);return D`
      <div class="zone-row select-all">
        <span class="zone-name" style="font-weight:500">Alle Bereiche</span>
        <ha-switch
          .checked=${s}
          @change=${()=>this._toggleAllZones(!s)}
        ></ha-switch>
      </div>
      <div class="zone-divider"></div>
    `}async _toggleAllZones(e){const t=this._entities?.areas||[],s=t.some(e=>!this._isOrphanedArea(e))?t.filter(e=>!this._isOrphanedArea(e)):t,i=e?"turn_on":"turn_off";try{for(const e of s)"unavailable"!==this.hass.states[e]?.state&&await this.hass.callService("switch",i,{entity_id:e})}catch(e){this._showServiceError(e.message||"Bereiche umschalten fehlgeschlagen")}}_isOrphanedArea(e){const t=(this.hass.states[e]?.attributes?.friendly_name||"").toLowerCase().replace(/^[a-z]+-[a-z0-9]+\s+/i,"").trim();return/^(area|bereich)\s*\d*$/i.test(t)}_renderZonesContent(){const e=this._entities.areas;if(!e||0===e.length)return D`<div class="empty-hint">Keine Bereiche gefunden</div>`;const t=e.some(e=>!this._isOrphanedArea(e))?e.filter(e=>!this._isOrphanedArea(e)):e;return D`
      <div class="zone-list">
        ${this._renderSelectAllZones()}
        ${t.map(e=>{const t=this.hass.states[e],s=!t||"unavailable"===t.state,i="on"===t?.state,n=t?.attributes?.friendly_name||"";let r;if(n&&n!==e)r=n.replace(/^[A-Za-z]+-[A-Z0-9]+\s+/,""),r===n&&(r=n.replace(/^.*?\s+(Bereich)/i,"$1")),r=r.replace(/^Bereich\s+/i,"");else{const t=e.match(/bereich_(\w+)$/);r=t?t[1].replace(/_/g,"."):"Bereich"}return D`
            <div class="zone-row ${s?"unavailable":""}">
              <span class="zone-name">
                ${r}
                ${s?D`<span class="unavailable-hint">(nicht verfügbar)</span>`:""}
              </span>
              <ha-switch
                .checked=${i}
                .disabled=${s}
                @change=${()=>!s&&this._toggleSwitch(e)}
              ></ha-switch>
            </div>
          `})}
      </div>
    `}_renderSettingsContent(){const e=this._entities;return D`
      <div class="config-grid">
        ${this._renderNumberSlider(e.numbers.blade_height,"Schnitthöhe","mm")}
        ${this._renderNumberSlider(e.numbers.working_speed,"Geschwindigkeit","m/s")}
        ${this._renderNumberSlider(e.numbers.path_spacing,"Wegabstand","cm")}
        ${this._renderSelect(e.selects.nav_mode,"Navigation")}
        ${this._renderSelect(e.selects.turn_mode,"Wendemodus")}
        ${this._renderSelect(e.selects.obstacle_mode,"Hinderniserkennung")}
      </div>
      <div class="settings-divider"></div>
      <div class="device-toggles">
        ${this._renderCombinedRainToggle()}
        ${this._renderToggle(e.switches.side_led,"Seitenlicht")}
      </div>
    `}_renderScheduleContent(e){const t=this._entities,s=t.tasks||[],i=t.task_areas||[],n=pe(this.hass,t.sensors.non_work_hours),r=ue(this.hass,t.sensors.task_duration);return D`
      ${s.length>0?D`
            <div class="task-list">
              ${s.map(e=>{const t=this.hass.states[e];if(!t)return"";const s=t.attributes?.friendly_name||e,i=s.replace(/^[A-Za-z]+-[A-Z0-9]+\s+/,"")||s.replace(/^.*?\s+/,""),n=null!==r?` · ~${Math.ceil(r)} Min`:"";return D`
                  <button class="task-btn" @click=${()=>this._pressButton(e)}>
                    <ha-icon icon="mdi:play-circle-outline"></ha-icon>
                    <span class="task-label">${i}${n}</span>
                  </button>
                `})}
            </div>
          `:""}

      ${i.length>0?D`
            <div class="task-area-status">
              ${i.map(e=>{const t=this.hass.states[e];if(!t||"unknown"===t.state||"unavailable"===t.state)return"";const s=(t.attributes?.friendly_name||e).replace(/^[A-Za-z]+-[A-Z0-9]+\s+/,"").replace(/^Aufgabenbereich\s*/,"")||"Bereich";return D`
                  <span class="task-area-pill ${this._taskAreaClass(t.state)}">
                    ${s}: ${this._taskAreaLabel(t.state)}
                  </span>
                `})}
            </div>
          `:""}

      ${n&&"unknown"!==n&&"unavailable"!==n?D`
            <div class="schedule-info">
              <div class="schedule-row">
                <ha-icon icon="mdi:clock-remove-outline"></ha-icon>
                <span>Ruhezeit: ${this._formatNonWorkHours(n)}</span>
              </div>
            </div>
          `:""}

      ${e?D`
            <div class="schedule-hint">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              Weitere Mähpläne können in der Mammotion App erstellt werden.
            </div>
          `:""}
    `}_renderMaintenanceContent(e){const t=this._entities,s=ue(this.hass,t.sensors.blade_used_time),i=ue(this.hass,t.sensors.blade_warn_time),n=ue(this.hass,t.sensors.battery_cycles),r=ue(this.hass,t.sensors.total_distance),a=pe(this.hass,t.sensors.error_code),o=pe(this.hass,t.sensors.error_message),l=pe(this.hass,t.sensors.error_time);let c=null;null!==s&&null!==i&&i>0&&(c=Math.min(100,s/i*100));const d=null!==n&&65535!==n,h=a&&"unknown"!==a&&"unavailable"!==a&&"0"!==a;return D`
      ${null!==s?D`
            <div class="maint-blade">
              <div class="maint-label">Klingen-Laufzeit</div>
              ${null!==c?D`
                    <div class="blade-bar-wrap">
                      <div class="blade-bar">
                        <div class="blade-bar-fill" style="width:${c}%; background:${null===c?"#999":c<50?"#4caf50":c<80?"#ff9800":"#f44336"}"></div>
                      </div>
                      <span class="blade-bar-text">${s.toFixed(1)} von ${i.toFixed(1)} Stunden (${Math.round(c)}%)</span>
                    </div>
                  `:D`<div class="maint-val">${s.toFixed(1)} Stunden</div>`}
            </div>
          `:""}

      <div class="maint-row">
        <span>Batterie-Zyklen</span>
        <span class="maint-val">${d?n:"Nicht verfügbar"}</span>
      </div>

      ${null!==r?D`
            <div class="maint-row">
              <span>Gesamtstrecke</span>
              <span class="maint-val">${r.toFixed(1)} km</span>
            </div>
          `:""}

      ${h?D`
            <div class="maint-error">
              <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size:16px; color:var(--error-color, #f44336)"></ha-icon>
              <span>Letzter Fehler: ${a} - ${o&&!o.toLowerCase().includes("error message not found")?o:`Unbekannter Fehler (Code: ${a})`} (${this._formatRelativeDate(l)})</span>
            </div>
          `:D`
            <div class="maint-ok">
              <ha-icon icon="mdi:check-circle" style="--mdc-icon-size:16px; color:#4caf50"></ha-icon>
              <span>Keine Fehler</span>
            </div>
          `}

      ${e?D`
            <div class="maint-actions">
              <button class="maint-btn" @click=${()=>this._resetBladeTime()}>
                <ha-icon icon="mdi:refresh"></ha-icon>
                Klingenzeit zurücksetzen
              </button>
              <div class="maint-input-row">
                <input
                  type="number"
                  class="maint-input"
                  placeholder="Stunden"
                  .value=${this._bladeWarnInput||""}
                  @input=${e=>{this._bladeWarnInput=e.target.value}}
                />
                <button class="maint-btn small" @click=${()=>this._setBladeWarningTime()}>
                  Warnzeit setzen
                </button>
              </div>
            </div>
          `:""}
    `}_renderCombinedRainToggle(){const e=this._entities?.switches?.rain_mowing,t=this._entities?.switches?.rain_robot;if(!e&&!t)return"";const s=e&&"on"===this.hass.states[e]?.state||t&&"on"===this.hass.states[t]?.state;return D`
      <div class="toggle-row">
        <span><ha-icon icon="mdi:weather-rainy" style="--mdc-icon-size:18px; margin-right:4px; vertical-align:middle; color:var(--secondary-text-color)"></ha-icon>Regenschutz</span>
        <ha-switch
          .checked=${s}
          @change=${()=>this._toggleRainProtection(!s)}
        ></ha-switch>
      </div>
    `}_renderNumberSlider(e,t,s){if(!e||!this.hass.states[e])return"";const i=this.hass.states[e],n=parseFloat(i.state),r=i.attributes?.min,a=i.attributes?.max,o=r??0,l=a??100,c=i.attributes?.step??1;if(o>=l||0===l||void 0===r&&void 0===a&&0===n){const i=e.replace(/^number\./,""),r=this.hass.states[`sensor.${i}`],a=r?parseFloat(r.state):n,o=r?.attributes?.unit_of_measurement||s,l={schnitthohe:[15,100],aufgabengeschwindigkeit:[.2,1.2],wegabstand:[5,35]},d=e.split("_").pop(),[h,p]=l[d]||[0,100];return D`
        <div class="slider-row disabled">
          <label>${t}</label>
          <input type="range" min=${h} max=${p} step=${c} .value=${String(isNaN(a)?0:a)} disabled />
          <span class="slider-val">${isNaN(a)?"?":a} ${o} <ha-icon icon="mdi:lock" style="--mdc-icon-size:14px"></ha-icon></span>
        </div>
      `}return D`
      <div class="slider-row">
        <label>${t}</label>
        <input
          type="range"
          min=${o}
          max=${l}
          step=${c}
          .value=${String(n)}
          @change=${t=>this._setNumber(e,parseFloat(t.target.value))}
        />
        <span class="slider-val">${n} ${s}</span>
      </div>
    `}_renderSelect(e,t){if(!e||!this.hass.states[e])return"";const s=this.hass.states[e],i=s.attributes?.options||[],n=s.state;return D`
      <div class="select-row">
        <label>${t}</label>
        <select @change=${t=>this._setSelect(e,t.target.value)}>
          ${i.map(e=>{return D`<option value=${e} ?selected=${e===n}>${t=e,he[t]||t}</option>`;var t})}
        </select>
      </div>
    `}_renderToggle(e,t){if(!e||!this.hass.states[e])return"";const s="on"===this.hass.states[e].state;return D`
      <div class="toggle-row">
        <span>${t}</span>
        <ha-switch .checked=${s} @change=${()=>this._toggleSwitch(e)}></ha-switch>
      </div>
    `}async _callService(e,t){try{await this.hass.callService(e,t,{entity_id:this._config.entity})}catch(e){this._showServiceError(e.message||"Service-Aufruf fehlgeschlagen")}}async _pressButton(e){if(e)try{await this.hass.callService("button","press",{entity_id:e})}catch(e){this._showServiceError(e.message||"Button-Aufruf fehlgeschlagen")}}_handleSync(e){const t="map"===e?this._entities.buttons.sync_map:this._entities.buttons.sync_schedule;t&&(this._pressButton(t),"map"===e?this._syncingMap=!0:this._syncingSchedule=!0,this.requestUpdate(),setTimeout(()=>{"map"===e?this._syncingMap=!1:this._syncingSchedule=!1,this.requestUpdate()},3e3))}async _toggleSwitch(e){try{await this.hass.callService("switch","toggle",{entity_id:e})}catch(e){this._showServiceError(e.message||"Switch-Aufruf fehlgeschlagen")}}async _toggleRainProtection(e){const t=e?"turn_on":"turn_off",s=this._entities?.switches?.rain_mowing,i=this._entities?.switches?.rain_robot;try{s&&await this.hass.callService("switch",t,{entity_id:s}),i&&await this.hass.callService("switch",t,{entity_id:i})}catch(e){this._showServiceError(e.message||"Regenschutz-Umschaltung fehlgeschlagen")}}async _setNumber(e,t){try{await this.hass.callService("number","set_value",{entity_id:e,value:t})}catch(e){this._showServiceError(e.message||"Wert konnte nicht gesetzt werden")}}async _setSelect(e,t){try{await this.hass.callService("select","select_option",{entity_id:e,option:t})}catch(e){this._showServiceError(e.message||"Auswahl fehlgeschlagen")}}async _resetBladeTime(){if(window.confirm("Klingenzeit wirklich zurücksetzen?"))try{await this.hass.callService("mammotion","reset_blade_time",{entity_id:this._config.entity})}catch(e){this._showServiceError(e.message||"Klingenzeit zurücksetzen fehlgeschlagen")}}async _setBladeWarningTime(){const e=parseFloat(this._bladeWarnInput);if(isNaN(e)||e<=0)this._showServiceError("Bitte gültigen Stundenwert eingeben");else try{await this.hass.callService("mammotion","set_blade_warning_time",{entity_id:this._config.entity,hours:e})}catch(e){this._showServiceError(e.message||"Warnzeit setzen fehlgeschlagen")}}_showServiceError(e){this._serviceError=e,this.requestUpdate(),setTimeout(()=>{this._serviceError=null,this.requestUpdate()},4e3)}_renderMowingProgress(e){const t=ue(this.hass,this._entities.sensors.progress),s=ue(this.hass,this._entities.sensors.elapsed_time),i=ue(this.hass,this._entities.sensors.left_time),n=ue(this.hass,this._entities.sensors.area),r=null!==s&&null!==i?s+i:null;return D`
      <div class="mowing-progress">
        <div class="mowing-bar">
          <div class="mowing-bar-fill" style="width:${t||0}%; background:${"paused"===e?"#ff9800":"#4CAF50"}"></div>
        </div>
        <div class="mowing-stats">
          <span>${null!==t?`${t}%`:"--"}${null!==n?` · ${n} m²`:""}</span>
          <span>${this._fmtTime(s)} / ${this._fmtTime(r)}</span>
        </div>
      </div>
    `}_fmtTime(e){if(null==e)return"--";const t=Math.round(e);return t<60?`${t} Min`:`${Math.floor(t/60)}h ${t%60} Min`}async _loadLeaflet(){if(!window.L)return new Promise(e=>{const t=document.createElement("script");t.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",t.onload=e,document.head.appendChild(t)})}async _initMap(){if(this._leafletMap||!this._entities)return;const e=this.renderRoot.querySelector("#mmc-map");if(!e)return;const t=this._getGpsPosition();if(!t)return;if(await this._loadLeaflet(),!window.L||this._leafletMap)return;this._leafletMap=L.map(e,{zoomControl:!1,dragging:!1,touchZoom:!1,scrollWheelZoom:!1,doubleClickZoom:!1,boxZoom:!1,keyboard:!1,attributionControl:!1}).setView([t.lat,t.lng],19),L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:21}).addTo(this._leafletMap);const s=this._markerColor(this._getMowerState());this._mapMarker=L.circleMarker([t.lat,t.lng],{radius:8,color:"#fff",fillColor:s,fillOpacity:.9,weight:2}).addTo(this._leafletMap),setTimeout(()=>this._leafletMap.invalidateSize(),200)}_updateMapMarker(){if(!this._leafletMap||!this._mapMarker)return;const e=this._getGpsPosition();if(!e)return;this._mapMarker.setLatLng([e.lat,e.lng]);const t=this._getMowerState(),s=this._markerColor(t),i="mowing"===t?10:8;this._mapMarker.setStyle({fillColor:s,radius:i}),"mowing"===t&&this._leafletMap.setView([e.lat,e.lng],this._leafletMap.getZoom(),{animate:!0})}_markerColor(e){return{mowing:"#4CAF50",docked:"#2196F3",paused:"#FF9800",returning:"#2196F3",error:"#F44336"}[e]||"#999"}async updated(e){if(super.updated(e),this._leafletMap){const e=this.renderRoot.querySelector("#mmc-map");e&&e.contains(this._leafletMap.getContainer())||(this._leafletMap.remove(),this._leafletMap=null,this._mapMarker=null)}this._leafletMap||!1===this._config?.modules?.map||await this._initMap(),this._leafletMap&&this._updateMapMarker()}shouldUpdate(e){if(!e.has("hass"))return!0;const t=e.get("hass");if(!t||!this._entities)return!0;return this._getAllEntityIds().some(e=>t.states[e]!==this.hass.states[e])}_getAllEntityIds(){const e=this._entities;if(!e)return[];const t=[e.lawn_mower];e.device_tracker&&t.push(e.device_tracker),e.charging&&t.push(e.charging);for(const s of["sensors","buttons","selects","numbers","switches"])e[s]&&t.push(...Object.values(e[s]));return e.areas&&t.push(...e.areas),e.tasks&&t.push(...e.tasks),e.task_areas&&t.push(...e.task_areas),t}_formatMinutes(e){if(null===e)return"";const t=Math.floor(e/60),s=Math.round(e%60);return t>0?`${t}h ${s}m`:`${s}m`}_signalIcon(e){return e>-50?"mdi:wifi-strength-4":e>-60?"mdi:wifi-strength-3":e>-70?"mdi:wifi-strength-2":e>-80?"mdi:wifi-strength-1":"mdi:wifi-strength-alert-outline"}_taskAreaClass(e){const t=e.toUpperCase();return"MOWING"===t?"active":"COMPLETED"===t?"completed":"WAITING"===t?"waiting":"other"}_taskAreaLabel(e){return{MOWING:"Mäht",WAITING:"Wartet",COMPLETED:"Fertig",NOT_STARTED:"Nicht gestartet"}[e.toUpperCase()]||e}_formatNonWorkHours(e){return e&&"Not set"!==e?e.replace(/(\d{1,2}:\d{2})(am|pm)/gi,(e,t,s)=>{const[i,n]=t.split(":");let r=parseInt(i,10);return"pm"===s.toLowerCase()&&12!==r&&(r+=12),"am"===s.toLowerCase()&&12===r&&(r=0),`${String(r).padStart(2,"0")}:${n}`}):"Keine Ruhezeit konfiguriert"}_formatRelativeDate(e){if(!e||"unknown"===e||"unavailable"===e)return"Unbekannt";try{const t=new Date(e);if(isNaN(t.getTime()))return e;const s=new Date-t,i=Math.floor(s/864e5);return 0===i?"Heute":1===i?"Gestern":i<7?`vor ${i} Tagen`:i<30?`vor ${Math.floor(i/7)} Wochen`:`${String(t.getDate()).padStart(2,"0")}.${String(t.getMonth()+1).padStart(2,"0")}.${t.getFullYear()} ${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}`}catch{return e}}_countEntities(){if(!this._entities)return 0;let e=1;this._entities.device_tracker&&e++,this._entities.charging&&e++;for(const t of["sensors","buttons","selects","numbers","switches"])e+=Object.keys(this._entities[t]||{}).length;return e+=(this._entities.areas||[]).length,e+=(this._entities.tasks||[]).length,e+=(this._entities.task_areas||[]).length,e}static get styles(){return r`
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

      .error-msg-banner {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        margin-bottom: var(--mmc-spacing);
        background: var(--error-color, #f44336);
        color: white;
        font-size: 13px;
        border-radius: 8px;
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

      /* ===== Map Hero ===== */
      .map-hero {
        position: relative;
        height: 224px;
        overflow: hidden;
      }

      .map-hero .map-container {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      .map-hero-placeholder {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: var(--secondary-background-color, #2c2c2c);
        color: var(--secondary-text-color);
        font-size: 14px;
      }

      .map-hero-placeholder ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.4;
      }

      .map-overlay {
        position: absolute;
        inset: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 16px;
        pointer-events: none;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.45) 0%,
          transparent 35%,
          transparent 65%,
          rgba(0, 0, 0, 0.45) 100%
        );
      }

      .overlay-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        pointer-events: auto;
      }

      .device-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .device-name {
        font-size: 18px;
        font-weight: 500;
        color: white;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      }

      .device-id {
        font-size: 12px;
        font-weight: 400;
        opacity: 0.75;
      }

      .status-badge {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        color: white;
        width: fit-content;
      }
      .status-badge.docked { background: rgba(33, 150, 243, 0.85); }
      .status-badge.mowing { background: rgba(76, 175, 80, 0.85); }
      .status-badge.paused { background: rgba(255, 152, 0, 0.85); }
      .status-badge.returning { background: rgba(33, 150, 243, 0.85); }
      .status-badge.error { background: rgba(244, 67, 54, 0.85); }
      .status-badge.unknown { background: rgba(158, 158, 158, 0.85); }

      .battery-ring-hero {
        position: relative;
        width: 56px;
        height: 56px;
        pointer-events: auto;
      }

      .battery-ring-hero svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .battery-bg-hero {
        fill: none;
        stroke: rgba(255, 255, 255, 0.3);
        stroke-width: 3;
      }

      .battery-fill-hero {
        fill: none;
        stroke-width: 3;
        stroke-linecap: round;
        transition: stroke-dasharray 0.5s ease;
      }

      .battery-text-hero {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 13px;
        font-weight: 600;
        color: white;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      .charging-icon-hero {
        position: absolute;
        bottom: -4px;
        right: -4px;
        --mdc-icon-size: 18px;
        color: #ff9800;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
      }

      .overlay-bottom {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        pointer-events: auto;
      }

      .info-pill {
        background: rgba(0, 0, 0, 0.55);
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 11px;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }

      /* Simple Header (fallback when map disabled) */
      .simple-header {
        display: flex;
        align-items: center;
        gap: var(--mmc-spacing);
        padding: var(--mmc-spacing);
      }

      .simple-header-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }

      .simple-header-name {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .mowing-animation {
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      /* ===== Mowing Progress ===== */
      .mowing-progress {
        padding: 8px 16px 12px;
      }

      .mowing-bar {
        height: 6px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 6px;
      }

      .mowing-bar-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 1s ease;
      }

      .mowing-stats {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--secondary-text-color, #aaa);
      }

      /* ===== Controls ===== */
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

      .ctrl-btn:active { opacity: 0.7; }
      .ctrl-btn ha-icon { --mdc-icon-size: 20px; }
      .ctrl-btn.start { background: var(--state-active-color, #4caf50); }
      .ctrl-btn.pause { background: var(--warning-color, #ff9800); }
      .ctrl-btn.dock { background: var(--info-color, #2196f3); }
      .ctrl-btn.cancel { background: var(--error-color, #f44336); }

      /* ===== Accordion ===== */
      .section {
        margin-bottom: 4px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
      }

      .section:last-of-type { border-bottom: none; }

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

      .chevron.open { transform: rotate(90deg); }

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

      .sync-btn:active { opacity: 0.7; }
      .sync-btn svg { width: 18px; height: 18px; }
      .sync-btn.syncing svg { animation: spin 1s linear infinite; }
      .sync-btn.syncing { color: var(--state-active-color, #4caf50); }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* ===== Settings ===== */
      .settings-divider {
        height: 1px;
        background: var(--divider-color, #e0e0e0);
        margin: 8px 0;
      }

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

      .slider-row input[type="range"] { flex: 1; }

      .slider-val {
        flex: 0 0 70px;
        font-size: 13px;
        text-align: right;
        color: var(--primary-text-color);
      }

      .slider-row.disabled { opacity: 0.5; }
      .slider-row.disabled input[type="range"] { pointer-events: none; }

      .select-row select {
        flex: 1;
        padding: 6px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font-size: 13px;
      }

      /* ===== Zones ===== */
      .zone-list {
        display: grid;
        gap: 0;
        padding-bottom: 8px;
      }

      .zone-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2px 0;
        min-height: 38px;
      }

      .toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 0;
        min-height: 44px;
      }

      .zone-divider {
        height: 1px;
        background: var(--divider-color, #e0e0e0);
        margin: 2px 0;
      }

      .zone-name {
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .zone-row.unavailable { opacity: 0.45; }
      .zone-row.unavailable ha-switch { pointer-events: none; }

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

      ha-switch {
        min-height: 44px;
        min-width: 44px;
      }

      /* ===== Schedule ===== */
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

      .task-btn:active { opacity: 0.7; }

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

      .task-area-pill.active { background: var(--state-active-color, #4caf50); color: white; }
      .task-area-pill.waiting { background: var(--divider-color, #e0e0e0); color: var(--secondary-text-color); }
      .task-area-pill.completed { background: var(--info-color, #2196f3); color: white; }
      .task-area-pill.other { background: var(--warning-color, #ff9800); color: white; }

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

      .schedule-row ha-icon { --mdc-icon-size: 16px; }

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

      .schedule-hint ha-icon { --mdc-icon-size: 14px; }

      /* ===== Maintenance ===== */
      .maint-blade {
        margin-bottom: 12px;
      }

      .maint-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 6px;
      }

      .blade-bar-wrap {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .blade-bar {
        height: 10px;
        background: var(--divider-color, #e0e0e0);
        border-radius: 5px;
        overflow: hidden;
      }

      .blade-bar-fill {
        height: 100%;
        border-radius: 5px;
        transition: width 0.5s ease;
      }

      .blade-bar-text {
        font-size: 11px;
        color: var(--secondary-text-color);
      }

      .maint-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 0;
        font-size: 13px;
        color: var(--primary-text-color);
      }

      .maint-val {
        color: var(--secondary-text-color);
        font-weight: 500;
      }

      .maint-error,
      .maint-ok {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 0;
        font-size: 13px;
      }

      .maint-error { color: var(--error-color, #f44336); }
      .maint-ok { color: var(--state-active-color, #4caf50); }

      .maint-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid var(--divider-color, #e0e0e0);
      }

      .maint-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 14px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: var(--mmc-radius);
        background: var(--secondary-background-color, #f5f5f5);
        color: var(--primary-text-color);
        font-size: 13px;
        cursor: pointer;
        min-height: 40px;
      }

      .maint-btn:active { opacity: 0.7; }
      .maint-btn ha-icon { --mdc-icon-size: 16px; }

      .maint-btn.small {
        flex: 0 0 auto;
        min-height: 36px;
        padding: 6px 12px;
      }

      .maint-input-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .maint-input {
        flex: 1;
        padding: 6px 10px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font-size: 13px;
        min-height: 36px;
        box-sizing: border-box;
      }

      /* ===== Footer ===== */
      .footer {
        display: flex;
        justify-content: space-between;
        padding-top: 4px;
        font-size: 10px;
        color: var(--disabled-text-color, #999);
      }

      /* ===== Responsive ===== */

      @container mmc (max-width: 359px) {
        .map-hero { height: 180px; }

        .button-row { flex-direction: column; }

        .task-list { flex-direction: column; }
        .task-btn { width: 100%; justify-content: center; }

        .device-name { font-size: 15px; }

        .slider-row label,
        .select-row label {
          flex: 0 0 90px;
          font-size: 12px;
        }

        .slider-val {
          flex: 0 0 55px;
          font-size: 12px;
        }
      }

      @container mmc (max-width: 299px) {
        .slider-row,
        .select-row { flex-wrap: wrap; }

        .slider-row label,
        .select-row label {
          flex: 1 1 100%;
          margin-bottom: 2px;
        }

        .slider-row input[type="range"] { flex: 1 1 60%; }
        .slider-val { flex: 0 0 auto; }
      }

      @container mmc (min-width: 500px) {
        .map-hero { height: 260px; }
        .device-name { font-size: 20px; }
        .button-row { gap: 12px; }
        .config-grid { grid-template-columns: 1fr 1fr; }
      }
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"mammotion-card",name:"Mammotion Dashboard Card",description:"Custom card for Mammotion Luba robotic mowers",preview:!0,documentationURL:"https://github.com/mikey0000/Mammotion-HA"}),console.info(`%c MAMMOTION-CARD %c v${me} `,"color: white; background: #4caf50; font-weight: bold; padding: 2px 4px; border-radius: 4px 0 0 4px;","color: #4caf50; background: #f5f5f5; font-weight: bold; padding: 2px 4px; border-radius: 0 4px 4px 0;");
