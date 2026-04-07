/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(i,t,s)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,p=globalThis,_=p.trustedTypes,g=_?_.emptyScript:"",m=p.reactiveElementPolyfillSupport,f=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!a(t,e),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);n?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=i;const r=n.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const r=this.constructor;if(!1===i&&(n=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??b)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[f("elementProperties")]=new Map,y[f("finalized")]=new Map,m?.({ReactiveElement:y}),(p.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,x=t=>t,k=w.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,z=`<${C}>`,M=document,P=()=>M.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,U="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,H=/>/g,j=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,B=/"/g,L=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),I=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),F=new WeakMap,q=M.createTreeWalker(M,129);function K(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const Z=(t,e)=>{const s=t.length-1,i=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=R;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,h=0;for(;h<s.length&&(o.lastIndex=h,l=o.exec(s),null!==l);)h=o.lastIndex,o===R?"!--"===l[1]?o=T:void 0!==l[1]?o=H:void 0!==l[2]?(L.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=j):void 0!==l[3]&&(o=j):o===j?">"===l[0]?(o=n??R,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?j:'"'===l[3]?B:D):o===B||o===D?o=j:o===T||o===H?o=R:(o=j,n=void 0);const d=o===j&&t[e+1].startsWith("/>")?" ":"";r+=o===R?s+z:c>=0?(i.push(a),s.slice(0,c)+S+s.slice(c)+E+d):s+E+(-2===c?e:d)}return[K(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class G{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=G.createElement(l,s),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=q.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=c[r++],s=i.getAttribute(t).split(E),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:s,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(E),e=t.length-1;if(e>0){i.textContent=k?k.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],P()),q.nextNode(),a.push({type:2,index:++n});i.append(t[e],P())}}}else if(8===i.nodeType)if(i.data===C)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(E,t+1));)a.push({type:7,index:n}),t+=E.length-1}n++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function J(t,e,s=t,i){if(e===I)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const r=O(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=J(t,n._$AS(t,e.values),n,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);q.currentNode=i;let n=q.nextNode(),r=0,o=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new X(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new it(n,this,t)),this._$AV.push(e),a=s[++o]}r!==a?.index&&(n=q.nextNode(),r++)}return q.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),O(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=G.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new G(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new X(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(t,e=this,s,i){const n=this.strings;let r=!1;if(void 0===n)t=J(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==I,r&&(this._$AH=t);else{const i=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=J(this,i[s+o],e,o),a===I&&(a=this._$AH[o]),r||=!O(a)||a!==this._$AH[o],a===V?t=V:t!==V&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class st extends Y{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??V)===I)return;const s=this._$AH,i=t===V&&s!==V||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(G,X),(w.litHtmlVersions??=[]).push("3.3.2");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ot extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new X(e.insertBefore(P(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}ot._$litElement$=!0,ot.finalized=!0,rt.litElementHydrateSupport?.({LitElement:ot});const at=rt.litElementPolyfillSupport;at?.({LitElement:ot}),(rt.litElementVersions??=[]).push("4.2.2");const lt={sensors:{battery:"_batterie",activity_mode:"_aktivitatsmodus",progress:"_fortschritt",area:"_bereich",mowing_speed:"_mahgeschwindigkeit",blade_height:"_schnitthohe",total_time:"_gesamtzeit",elapsed_time:"_vergangene_zeit",left_time:"_verbleibende_zeit",satellites_robot:"_satelliten_roboter",l1_satellites:"_l1_satelliten_co_viewing",l2_satellites:"_l2_satelliten_co_viewing",rtk_position:"_rtk_position",position_type:"_typ_der_geratepositionierung",wifi_rssi:"_wi_fi_rssi",ble_rssi:"_ble_rssi",mnet_rssi:"_mobilfunk_rssi",connect_type:"_verbindungsart",latitude:"_breitengrad",longitude:"_langengrad",work_area:"_arbeitsbereich",error_code:"_letzter_fehlercode",error_message:"_letzte_fehlermeldung",error_time:"_letzter_fehlerzeitpunkt",blade_used_time:"_messernutzungszeit",blade_warn_time:"_messerverschleiss_warnzeit",total_distance:"_gesamtkilometerstand",battery_cycles:"_batteriezyklen",camera_brightness:"_kamera_helligkeit",non_work_hours:"_arbeitsfreie_zeit",task_duration:"_aufgabendauer",task_area:"_aufgabenbereich_area_1"},buttons:{release_dock:"_abdocken",cancel_task:"_aktuelle_aufgabe_abbrechen",sync_map:"_synchronisiere_karte",sync_schedule:"_synchronisiere_zeitplan",resync_rtk:"_synchronisiere_rtk_und_ladestation",relocate_dock:"_ladestation_umsetzen",nudge_forward:"_notfall_schub_vorwarts",nudge_back:"_notfall_schub_ruckwarts",nudge_left:"_notfall_schub_links",nudge_right:"_notfall_schub_rechts",restart:"_restart_mower"},selects:{charge_mode:"_aufladungsmodus",path_order:"_ausfuhrungsreihenfolge_des_pfades",obstacle_mode:"_modus_der_hinderniserkennung",nav_mode:"_navigationsmodus",border_laps:"_patrouillenrunden_fur_den_seitlichen_rasenschnitt",nogo_laps:"_patrouillenrunden_fur_mahen_von_no_go_zonen",angle_mode:"_wegwinkel_modus",turn_mode:"_wendemodus"},numbers:{working_speed:"_aufgabengeschwindigkeit",start_progress:"_fortschritt_beim_start",cutting_angle:"_kreuzungswinkel",blade_height:"_schnitthohe",path_spacing:"_wegabstand",path_angle:"_wegwinkel"},switches:{rain_mowing:"_regenerkennung_beim_mahen",rain_robot:"_regenerkennung_roboter",side_led:"_seitenlicht",schedule_updates:"_updates_ein_ausschalten"}};function ct(t){return{sensors:"sensor",buttons:"button",selects:"select",numbers:"number",switches:"switch"}[t]||t}const ht={single_grid:"Einzelbahn",double_grid:"Doppelbahn",segment_grid:"Segmentbahn",no_grid:"Ohne Bahn",zero_turn:"Nullwendung",multipoint:"Mehrpunkt",direct_touch:"Direktkontakt",slow_touch:"Langsamer Kontakt",less_touch:"Weniger Kontakt",no_touch:"Kein Kontakt",sensitive:"Empfindlich",direct:"Direkt",follow_perimeter:"Randverfolgung",border_first:"Rand zuerst",grid_first:"Bahn zuerst",relative_angle:"Relativer Winkel",absolute_angle:"Absoluter Winkel",random_angle:"Zufälliger Winkel",none:"Keine",one:"1 Runde",two:"2 Runden",three:"3 Runden",four:"4 Runden"};function dt(t,e){const s=function(t,e){return t&&e&&t.states[e]||null}(t,e);return s?s.state:null}function ut(t,e){const s=dt(t,e);if(null===s||"unknown"===s||"unavailable"===s)return null;const i=parseFloat(s);return isNaN(i)?null:i}const pt={status:!0,controls:!0,mowing_config:!0,zones:!0,device:!0,maintenance:!1,map:!1,camera:!1,schedule:!1};customElements.define("mammotion-card-editor",class extends ot{static get properties(){return{hass:{attribute:!1},_config:{state:!0}}}setConfig(t){this._config={...t}}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target,s=e.configValue;let i=t.detail?.value??e.value;"mode"===s&&(i=e.value);const n={...this._config,[s]:i};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n}}))}_moduleChanged(t){const e=t.target.configValue,s=t.target.checked,i={...pt,...this._config.modules,[e]:s},n={...this._config,modules:i};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n}}))}render(){if(!this.hass||!this._config)return W``;const t=Object.keys(this.hass.states).filter(t=>t.startsWith("lawn_mower.")).sort(),e={...pt,...this._config.modules};return W`
      <div class="card-config">
        <div class="field">
          <label>Mäher-Entity (Pflicht)</label>
          <select
            .configValue=${"entity"}
            .value=${this._config.entity||""}
            @change=${this._valueChanged}
          >
            <option value="">-- lawn_mower Entity wählen --</option>
            ${t.map(t=>W`
                <option value=${t} ?selected=${this._config.entity===t}>
                  ${this.hass.states[t]?.attributes?.friendly_name||t}
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
            ${Object.entries(e).map(([t,e])=>W`
                <label class="module-toggle">
                  <input
                    type="checkbox"
                    .configValue=${t}
                    .checked=${e}
                    @change=${this._moduleChanged}
                  />
                  ${t}
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
    `}});const _t="0.2.0";customElements.define("mammotion-card",class extends ot{static get properties(){return{hass:{attribute:!1},_config:{state:!0},_entities:{state:!0}}}static getConfigElement(){return document.createElement("mammotion-card-editor")}static getStubConfig(t){return{entity:Object.keys(t.states).find(t=>t.startsWith("lawn_mower."))||"",mode:"family",modules:{status:!0,controls:!0,mowing_config:!0,zones:!0,device:!0}}}setConfig(t){if(!t.entity)throw new Error("Entity (lawn_mower.*) muss konfiguriert werden");this._config={mode:"family",modules:{status:!0,controls:!0,mowing_config:!0,zones:!0,device:!0},...t},this._entities=null}set hass(t){const e=this._hass;this._hass=t,this._entities&&e||(this._entities=function(t,e){if(!t||!e)return null;const s=e.replace("lawn_mower.",""),i={lawn_mower:e,camera:`camera.${s}`,device_tracker:null,charging:`binary_sensor.${s}_ladestatus`,sensors:{},buttons:{},selects:{},numbers:{},switches:{},areas:[]},n=`device_tracker.${s}_${s}`;if(t.states[n])i.device_tracker=n;else for(const e of Object.keys(t.states))if(e.startsWith(`device_tracker.${s}`)){i.device_tracker=e;break}for(const[e,n]of Object.entries(lt))for(const[r,o]of Object.entries(n)){const n=`${ct(e)}.${s}${o}`;t.states[n]&&(i[e][r]=n)}for(const e of Object.keys(t.states))(e.startsWith(`switch.${s}_bereich_area_`)||e.startsWith(`switch.${s}_bereich_`))&&(e.includes("_regenerkennung")||e.includes("_seitenlicht")||e.includes("_updates")||i.areas.push(e));return i}(t,this._config.entity)),this.requestUpdate("hass",e)}get hass(){return this._hass}getCardSize(){return 4}_getMowerState(){return dt(this.hass,this._config.entity)||"unknown"}_stateIcon(t){const e={mowing:"mdi:robot-mower",paused:"mdi:pause-circle",docked:"mdi:home-circle",returning:"mdi:arrow-left-circle",error:"mdi:alert-circle",unknown:"mdi:help-circle"};return e[t]||e.unknown}_stateColor(t){return{mowing:"var(--state-active-color, #4caf50)",paused:"var(--warning-color, #ff9800)",docked:"var(--info-color, #2196f3)",returning:"var(--info-color, #2196f3)",error:"var(--error-color, #f44336)"}[t]||"var(--secondary-text-color)"}_stateLabel(t){return{mowing:"Mäht",paused:"Pausiert",docked:"Angedockt",returning:"Fährt zurück",error:"Fehler",unknown:"Unbekannt"}[t]||t}_batteryColor(t){return null===t?"var(--secondary-text-color)":t>50?"var(--state-active-color, #4caf50)":t>20?"var(--warning-color, #ff9800)":"var(--error-color, #f44336)"}render(){if(!this.hass||!this._config||!this._entities)return W`<ha-card><div class="loading">Lade...</div></ha-card>`;const t=this._getMowerState(),e=this._config.name||this.hass.states[this._config.entity]?.attributes?.friendly_name||"Mammotion",s=ut(this.hass,this._entities.sensors.battery),i="on"===dt(this.hass,this._entities.charging),n="expert"===this._config.mode,r=this._config.modules||{};return W`
      <ha-card>
        ${!1!==r.status?this._renderStatus(e,t,s,i,n):""}
        ${!1!==r.controls?this._renderControls(t):""}
        ${r.mowing_config&&n?this._renderMowingConfig():""}
        ${!1!==r.zones?this._renderZones():""}
        ${!1!==r.device&&n?this._renderDevice():""}

        <div class="footer">
          <span class="version">Mammotion Card v${_t}</span>
          <span class="entity-count">${this._countEntities()} Entities</span>
        </div>
      </ha-card>
    `}_renderStatus(t,e,s,i,n){const r=ut(this.hass,this._entities.sensors.progress),o=dt(this.hass,this._entities.sensors.error_message),a=ut(this.hass,this._entities.sensors.wifi_rssi),l=ut(this.hass,this._entities.sensors.satellites_robot),c=dt(this.hass,this._entities.sensors.rtk_position);return W`
      <div class="status-header">
        <div class="status-icon-wrap">
          <ha-icon
            icon=${this._stateIcon(e)}
            class="status-icon ${"mowing"===e?"mowing-animation":""}"
            style="color: ${this._stateColor(e)}"
          ></ha-icon>
        </div>

        <div class="status-info">
          <div class="mower-name">${t}</div>
          <div class="state-badge" style="background: ${this._stateColor(e)}">
            ${this._stateLabel(e)}
          </div>
          ${"error"===e&&o?W`<div class="error-msg">${o}</div>`:""}
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
            ${i?W`<ha-icon icon="mdi:lightning-bolt" class="charging-icon"></ha-icon>`:""}
          </div>
        </div>
      </div>

      ${n?W`
            <div class="status-details">
              ${null!==l?W`<span class="detail-badge" title="Satelliten">
                    <ha-icon icon="mdi:satellite-variant"></ha-icon> ${l}
                    ${c?W`<span class="rtk-badge">${c}</span>`:""}
                  </span>`:""}
              ${null!==a?W`<span class="detail-badge" title="WiFi ${a} dBm">
                    <ha-icon icon=${this._signalIcon(a)}></ha-icon> ${a} dBm
                  </span>`:""}
              ${null!==r&&"mowing"===e?W`<span class="detail-badge" title="Fortschritt">
                    <ha-icon icon="mdi:percent"></ha-icon> ${r}%
                  </span>`:""}
            </div>
          `:""}
    `}_renderControls(t){const e=ut(this.hass,this._entities.sensors.progress),s=ut(this.hass,this._entities.sensors.elapsed_time),i=ut(this.hass,this._entities.sensors.left_time);return W`
      <div class="controls">
        ${"mowing"===t?W`
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${e||0}%"></div>
                <span class="progress-text">${e||0}%</span>
              </div>
              <div class="time-row">
                ${null!==s?W`<span>${this._formatMinutes(s)} vergangen</span>`:""}
                ${null!==i?W`<span>${this._formatMinutes(i)} verbleibend</span>`:""}
              </div>
            `:""}

        <div class="button-row">
          ${"docked"===t||"paused"===t?W`
                <button class="ctrl-btn start" @click=${()=>this._callService("lawn_mower","start_mowing")}>
                  <ha-icon icon="mdi:play"></ha-icon>
                  ${"paused"===t?"Fortsetzen":"Start"}
                </button>
              `:""}
          ${"mowing"===t?W`
                <button class="ctrl-btn pause" @click=${()=>this._callService("lawn_mower","pause")}>
                  <ha-icon icon="mdi:pause"></ha-icon>
                  Pause
                </button>
              `:""}
          ${"mowing"===t||"paused"===t?W`
                <button class="ctrl-btn dock" @click=${()=>this._callService("lawn_mower","dock")}>
                  <ha-icon icon="mdi:home"></ha-icon>
                  Zurück
                </button>
              `:""}
          ${"mowing"===t||"paused"===t?W`
                <button class="ctrl-btn cancel" @click=${()=>this._pressButton(this._entities.buttons.cancel_task)}>
                  <ha-icon icon="mdi:close-circle"></ha-icon>
                  Abbrechen
                </button>
              `:""}
        </div>
      </div>
    `}_renderMowingConfig(){const t=this._entities;return W`
      <div class="section">
        <div class="section-title">
          <ha-icon icon="mdi:cog"></ha-icon> Mäh-Einstellungen
        </div>
        <div class="config-grid">
          ${this._renderNumberSlider(t.numbers.blade_height,"Schnitthöhe","mm")}
          ${this._renderNumberSlider(t.numbers.working_speed,"Geschwindigkeit","m/s")}
          ${this._renderNumberSlider(t.numbers.path_spacing,"Wegabstand","cm")}
          ${this._renderSelect(t.selects.nav_mode,"Navigation")}
          ${this._renderSelect(t.selects.turn_mode,"Wendemodus")}
          ${this._renderSelect(t.selects.obstacle_mode,"Hinderniserkennung")}
        </div>
      </div>
    `}_renderZones(){const t=this._entities.areas;return t&&0!==t.length?W`
      <div class="section">
        <div class="section-title">
          <ha-icon icon="mdi:vector-square"></ha-icon> Bereiche
        </div>
        <div class="zone-list">
          ${t.map(t=>{const e=this.hass.states[t];if(!e)return"";const s=e.attributes?.friendly_name||t,i="on"===e.state;return W`
              <div class="zone-row">
                <span class="zone-name">${s}</span>
                <ha-switch
                  .checked=${i}
                  @change=${()=>this._toggleSwitch(t)}
                ></ha-switch>
              </div>
            `})}
        </div>
      </div>
    `:""}_renderDevice(){const t=this._entities;return W`
      <div class="section">
        <div class="section-title">
          <ha-icon icon="mdi:tune"></ha-icon> Gerätesteuerung
        </div>
        <div class="device-toggles">
          ${this._renderToggle(t.switches.rain_mowing,"Regenerkennung (Mähen)")}
          ${this._renderToggle(t.switches.rain_robot,"Regenerkennung (Roboter)")}
          ${this._renderToggle(t.switches.side_led,"Seitenlicht")}
        </div>
      </div>
    `}_renderNumberSlider(t,e,s){if(!t||!this.hass.states[t])return"";const i=this.hass.states[t],n=parseFloat(i.state),r=i.attributes?.min,o=i.attributes?.max,a=r??0,l=o??100,c=i.attributes?.step??1;if(a>=l||0===l||void 0===r&&void 0===o&&0===n){const i=t.replace(/^number\./,""),r=this.hass.states[`sensor.${i}`],o=r?parseFloat(r.state):n,a=r?.attributes?.unit_of_measurement||s;return W`
        <div class="slider-row">
          <label>${e}</label>
          <span class="slider-val readonly">${isNaN(o)?"?":o} ${a}</span>
        </div>
      `}return W`
      <div class="slider-row">
        <label>${e}</label>
        <input
          type="range"
          min=${a}
          max=${l}
          step=${c}
          .value=${n}
          @change=${e=>this._setNumber(t,parseFloat(e.target.value))}
        />
        <span class="slider-val">${n} ${s}</span>
      </div>
    `}_renderSelect(t,e){if(!t||!this.hass.states[t])return"";const s=this.hass.states[t],i=s.attributes?.options||[],n=s.state;return W`
      <div class="select-row">
        <label>${e}</label>
        <select @change=${e=>this._setSelect(t,e.target.value)}>
          ${i.map(t=>{return W`<option value=${t} ?selected=${t===n}>${e=t,ht[e]||e}</option>`;var e})}
        </select>
      </div>
    `}_renderToggle(t,e){if(!t||!this.hass.states[t])return"";const s="on"===this.hass.states[t].state;return W`
      <div class="toggle-row">
        <span>${e}</span>
        <ha-switch .checked=${s} @change=${()=>this._toggleSwitch(t)}></ha-switch>
      </div>
    `}_callService(t,e){this.hass.callService(t,e,{entity_id:this._config.entity})}_pressButton(t){t&&this.hass.callService("button","press",{entity_id:t})}_toggleSwitch(t){this.hass.callService("switch","toggle",{entity_id:t})}_setNumber(t,e){this.hass.callService("number","set_value",{entity_id:t,value:e})}_setSelect(t,e){this.hass.callService("select","select_option",{entity_id:t,option:e})}_formatMinutes(t){if(null===t)return"";const e=Math.floor(t/60),s=Math.round(t%60);return e>0?`${e}h ${s}m`:`${s}m`}_signalIcon(t){return t>-50?"mdi:wifi-strength-4":t>-60?"mdi:wifi-strength-3":t>-70?"mdi:wifi-strength-2":t>-80?"mdi:wifi-strength-1":"mdi:wifi-strength-alert-outline"}_countEntities(){if(!this._entities)return 0;let t=1;this._entities.camera&&t++,this._entities.device_tracker&&t++,this._entities.charging&&t++;for(const e of["sensors","buttons","selects","numbers","switches"])t+=Object.keys(this._entities[e]||{}).length;return t+=(this._entities.areas||[]).length,t}static get styles(){return r`
      :host {
        --mmc-spacing: 12px;
        --mmc-radius: 12px;
      }

      ha-card {
        padding: var(--mmc-spacing);
        overflow: hidden;
      }

      .loading {
        padding: 24px;
        text-align: center;
        color: var(--secondary-text-color);
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
        font-size: 18px;
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
        font-size: 12px;
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

      /* Sections */
      .section {
        margin-bottom: var(--mmc-spacing);
        padding-bottom: var(--mmc-spacing);
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
      }

      .section:last-of-type {
        border-bottom: none;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 8px;
      }

      .section-title ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
      }

      /* Config Grid */
      .config-grid {
        display: grid;
        gap: 8px;
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

      /* Device Toggles */
      .device-toggles {
        display: grid;
        gap: 4px;
      }

      .toggle-row span {
        font-size: 14px;
        color: var(--primary-text-color);
      }

      /* Footer */
      .footer {
        display: flex;
        justify-content: space-between;
        padding-top: 4px;
        font-size: 10px;
        color: var(--disabled-text-color, #999);
      }
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"mammotion-card",name:"Mammotion Dashboard Card",description:"Custom card for Mammotion Luba robotic mowers",preview:!0,documentationURL:"https://github.com/mikey0000/Mammotion-HA"}),console.info(`%c MAMMOTION-CARD %c v${_t} `,"color: white; background: #4caf50; font-weight: bold; padding: 2px 4px; border-radius: 4px 0 0 4px;","color: #4caf50; background: #f5f5f5; font-weight: bold; padding: 2px 4px; border-radius: 0 4px 4px 0;");
