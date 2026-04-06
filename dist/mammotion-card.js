/**
 * Mammotion Dashboard Card v0.1.0
 * Custom Lovelace Card for Mammotion Luba robotic mowers
 */

// Resolve LitElement from HA's custom elements (works across HA versions)
const LitElement = Object.getPrototypeOf(
  customElements.get("hui-view") || customElements.get("ha-panel-lovelace")
);
const { html, css } = LitElement.prototype.html
  ? { html: LitElement.prototype.html, css: LitElement.prototype.css }
  : await import("lit");

// ============================================================
// Entity Discovery
// ============================================================

const ENTITY_MAP = {
  sensors: {
    battery: "_batterie",
    activity_mode: "_aktivitatsmodus",
    progress: "_fortschritt",
    area: "_bereich",
    mowing_speed: "_mahgeschwindigkeit",
    blade_height: "_schnitthohe",
    total_time: "_gesamtzeit",
    elapsed_time: "_vergangene_zeit",
    left_time: "_verbleibende_zeit",
    satellites_robot: "_satelliten_roboter",
    l1_satellites: "_l1_satelliten_co_viewing",
    l2_satellites: "_l2_satelliten_co_viewing",
    rtk_position: "_rtk_position",
    position_type: "_typ_der_geratepositionierung",
    wifi_rssi: "_wi_fi_rssi",
    ble_rssi: "_ble_rssi",
    mnet_rssi: "_mobilfunk_rssi",
    connect_type: "_verbindungsart",
    latitude: "_breitengrad",
    longitude: "_langengrad",
    work_area: "_arbeitsbereich",
    error_code: "_letzter_fehlercode",
    error_message: "_letzte_fehlermeldung",
    error_time: "_letzter_fehlerzeitpunkt",
    blade_used_time: "_messernutzungszeit",
    blade_warn_time: "_messerverschleiss_warnzeit",
    total_distance: "_gesamtkilometerstand",
    battery_cycles: "_batteriezyklen",
    camera_brightness: "_kamera_helligkeit",
    non_work_hours: "_arbeitsfreie_zeit",
    task_duration: "_aufgabendauer",
    task_area: "_aufgabenbereich_area_1",
  },
  buttons: {
    release_dock: "_abdocken",
    cancel_task: "_aktuelle_aufgabe_abbrechen",
    sync_map: "_synchronisiere_karte",
    sync_schedule: "_synchronisiere_zeitplan",
    resync_rtk: "_synchronisiere_rtk_und_ladestation",
    relocate_dock: "_ladestation_umsetzen",
    nudge_forward: "_notfall_schub_vorwarts",
    nudge_back: "_notfall_schub_ruckwarts",
    nudge_left: "_notfall_schub_links",
    nudge_right: "_notfall_schub_rechts",
    restart: "_restart_mower",
  },
  selects: {
    charge_mode: "_aufladungsmodus",
    path_order: "_ausfuhrungsreihenfolge_des_pfades",
    obstacle_mode: "_modus_der_hinderniserkennung",
    nav_mode: "_navigationsmodus",
    border_laps: "_patrouillenrunden_fur_den_seitlichen_rasenschnitt",
    nogo_laps: "_patrouillenrunden_fur_mahen_von_no_go_zonen",
    angle_mode: "_wegwinkel_modus",
    turn_mode: "_wendemodus",
  },
  numbers: {
    working_speed: "_aufgabengeschwindigkeit",
    start_progress: "_fortschritt_beim_start",
    cutting_angle: "_kreuzungswinkel",
    blade_height: "_schnitthohe",
    path_spacing: "_wegabstand",
    path_angle: "_wegwinkel",
  },
  switches: {
    rain_mowing: "_regenerkennung_beim_mahen",
    rain_robot: "_regenerkennung_roboter",
    side_led: "_seitenlicht",
    schedule_updates: "_updates_ein_ausschalten",
  },
};

function domainToHA(domain) {
  const map = {
    sensors: "sensor",
    buttons: "button",
    selects: "select",
    numbers: "number",
    switches: "switch",
  };
  return map[domain] || domain;
}

function discoverEntities(hass, lawnMowerEntityId) {
  if (!hass || !lawnMowerEntityId) return null;

  const prefix = lawnMowerEntityId.replace("lawn_mower.", "");

  const resolved = {
    lawn_mower: lawnMowerEntityId,
    camera: `camera.${prefix}`,
    device_tracker: null,
    charging: `binary_sensor.${prefix}_ladestatus`,
    sensors: {},
    buttons: {},
    selects: {},
    numbers: {},
    switches: {},
    areas: [],
  };

  // Find device_tracker (doubled prefix pattern)
  const trackerCandidate = `device_tracker.${prefix}_${prefix}`;
  if (hass.states[trackerCandidate]) {
    resolved.device_tracker = trackerCandidate;
  } else {
    for (const eid of Object.keys(hass.states)) {
      if (eid.startsWith(`device_tracker.${prefix}`)) {
        resolved.device_tracker = eid;
        break;
      }
    }
  }

  // Resolve mapped entities
  for (const [domain, mapping] of Object.entries(ENTITY_MAP)) {
    for (const [key, suffix] of Object.entries(mapping)) {
      const entityId = `${domainToHA(domain)}.${prefix}${suffix}`;
      if (hass.states[entityId]) {
        resolved[domain][key] = entityId;
      }
    }
  }

  // Discover area switches dynamically
  for (const eid of Object.keys(hass.states)) {
    if (eid.startsWith(`switch.${prefix}_bereich_`)) {
      if (
        !eid.includes("_regenerkennung") &&
        !eid.includes("_seitenlicht") &&
        !eid.includes("_updates")
      ) {
        resolved.areas.push(eid);
      }
    }
  }

  return resolved;
}

function getStateValue(hass, entityId) {
  if (!hass || !entityId) return null;
  const s = hass.states[entityId];
  return s ? s.state : null;
}

function getNumericState(hass, entityId) {
  const val = getStateValue(hass, entityId);
  if (val === null || val === "unknown" || val === "unavailable") return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
}

// ============================================================
// Card Editor
// ============================================================

const MODULES_DEFAULT = {
  status: true,
  controls: true,
  mowing_config: true,
  zones: true,
  device: true,
  maintenance: false,
  map: false,
  camera: false,
  schedule: false,
};

class MammotionCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
    };
  }

  setConfig(config) {
    this._config = { ...config };
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const target = ev.target;
    const key = target.configValue;
    let value = ev.detail?.value ?? target.value;
    const newConfig = { ...this._config, [key]: value };
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: newConfig } })
    );
  }

  _moduleChanged(ev) {
    const module = ev.target.configValue;
    const checked = ev.target.checked;
    const modules = {
      ...MODULES_DEFAULT,
      ...this._config.modules,
      [module]: checked,
    };
    const newConfig = { ...this._config, modules };
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: newConfig } })
    );
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const lawnMowerEntities = Object.keys(this.hass.states)
      .filter((eid) => eid.startsWith("lawn_mower."))
      .sort();

    const modules = { ...MODULES_DEFAULT, ...this._config.modules };

    return html`
      <div class="card-config">
        <div class="field">
          <label>Mäher-Entity (Pflicht)</label>
          <select
            .configValue=${"entity"}
            .value=${this._config.entity || ""}
            @change=${this._valueChanged}
          >
            <option value="">-- lawn_mower Entity wählen --</option>
            ${lawnMowerEntities.map(
              (eid) => html`
                <option value=${eid} ?selected=${this._config.entity === eid}>
                  ${this.hass.states[eid]?.attributes?.friendly_name || eid}
                </option>
              `
            )}
          </select>
        </div>

        <div class="field">
          <label>Name (optional)</label>
          <input
            type="text"
            .configValue=${"name"}
            .value=${this._config.name || ""}
            @input=${this._valueChanged}
            placeholder="z.B. Luba"
          />
        </div>

        <div class="field">
          <label>Modus</label>
          <select
            .configValue=${"mode"}
            .value=${this._config.mode || "family"}
            @change=${this._valueChanged}
          >
            <option value="family">Familie</option>
            <option value="expert">Experte</option>
          </select>
        </div>

        <div class="field">
          <label>Module</label>
          <div class="modules">
            ${Object.entries(modules).map(
              ([key, enabled]) => html`
                <label class="module-toggle">
                  <input
                    type="checkbox"
                    .configValue=${key}
                    .checked=${enabled}
                    @change=${this._moduleChanged}
                  />
                  ${key}
                </label>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
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
    `;
  }
}

customElements.define("mammotion-card-editor", MammotionCardEditor);

// ============================================================
// Main Card
// ============================================================

const CARD_VERSION = "0.1.0";

class MammotionCard extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
      _entities: { state: true },
    };
  }

  static getConfigElement() {
    return document.createElement("mammotion-card-editor");
  }

  static getStubConfig(hass) {
    const lawnMower = Object.keys(hass.states).find((eid) =>
      eid.startsWith("lawn_mower.")
    );
    return {
      entity: lawnMower || "",
      mode: "family",
      modules: {
        status: true,
        controls: true,
        mowing_config: true,
        zones: true,
        device: true,
      },
    };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Entity (lawn_mower.*) muss konfiguriert werden");
    }
    this._config = {
      mode: "family",
      modules: {
        status: true,
        controls: true,
        mowing_config: true,
        zones: true,
        device: true,
      },
      ...config,
    };
    this._entities = null;
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;

    if (!this._entities || !oldHass) {
      this._entities = discoverEntities(hass, this._config.entity);
    }

    this.requestUpdate("hass", oldHass);
  }

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return 4;
  }

  _getMowerState() {
    return getStateValue(this.hass, this._config.entity) || "unknown";
  }

  _stateIcon(state) {
    const icons = {
      mowing: "mdi:robot-mower",
      paused: "mdi:pause-circle",
      docked: "mdi:home-circle",
      returning: "mdi:arrow-left-circle",
      error: "mdi:alert-circle",
      unknown: "mdi:help-circle",
    };
    return icons[state] || icons.unknown;
  }

  _stateColor(state) {
    const colors = {
      mowing: "var(--state-active-color, #4caf50)",
      paused: "var(--warning-color, #ff9800)",
      docked: "var(--info-color, #2196f3)",
      returning: "var(--info-color, #2196f3)",
      error: "var(--error-color, #f44336)",
    };
    return colors[state] || "var(--secondary-text-color)";
  }

  _stateLabel(state) {
    const labels = {
      mowing: "Mäht",
      paused: "Pausiert",
      docked: "Angedockt",
      returning: "Fährt zurück",
      error: "Fehler",
      unknown: "Unbekannt",
    };
    return labels[state] || state;
  }

  _batteryColor(level) {
    if (level === null) return "var(--secondary-text-color)";
    if (level > 50) return "var(--state-active-color, #4caf50)";
    if (level > 20) return "var(--warning-color, #ff9800)";
    return "var(--error-color, #f44336)";
  }

  render() {
    if (!this.hass || !this._config || !this._entities) {
      return html`<ha-card><div class="loading">Lade...</div></ha-card>`;
    }

    const state = this._getMowerState();
    const name =
      this._config.name ||
      this.hass.states[this._config.entity]?.attributes?.friendly_name ||
      "Mammotion";
    const battery = getNumericState(this.hass, this._entities.sensors.battery);
    const isCharging =
      getStateValue(this.hass, this._entities.charging) === "on";
    const isExpert = this._config.mode === "expert";
    const modules = this._config.modules || {};

    return html`
      <ha-card>
        ${modules.status !== false
          ? this._renderStatus(name, state, battery, isCharging, isExpert)
          : ""}
        ${modules.controls !== false ? this._renderControls(state) : ""}
        ${modules.mowing_config && isExpert ? this._renderMowingConfig() : ""}
        ${modules.zones !== false ? this._renderZones() : ""}
        ${modules.device !== false && isExpert ? this._renderDevice() : ""}

        <div class="footer">
          <span class="version">Mammotion Card v${CARD_VERSION}</span>
          <span class="entity-count">${this._countEntities()} Entities</span>
        </div>
      </ha-card>
    `;
  }

  _renderStatus(name, state, battery, isCharging, isExpert) {
    const progress = getNumericState(
      this.hass,
      this._entities.sensors.progress
    );
    const errorMsg = getStateValue(
      this.hass,
      this._entities.sensors.error_message
    );
    const wifiRssi = getNumericState(
      this.hass,
      this._entities.sensors.wifi_rssi
    );
    const satellites = getNumericState(
      this.hass,
      this._entities.sensors.satellites_robot
    );
    const rtk = getStateValue(this.hass, this._entities.sensors.rtk_position);

    return html`
      <div class="status-header">
        <div class="status-icon-wrap">
          <ha-icon
            icon=${this._stateIcon(state)}
            class="status-icon ${state === "mowing" ? "mowing-animation" : ""}"
            style="color: ${this._stateColor(state)}"
          ></ha-icon>
        </div>

        <div class="status-info">
          <div class="mower-name">${name}</div>
          <div
            class="state-badge"
            style="background: ${this._stateColor(state)}"
          >
            ${this._stateLabel(state)}
          </div>
          ${state === "error" && errorMsg
            ? html`<div class="error-msg">${errorMsg}</div>`
            : ""}
        </div>

        <div class="battery-wrap">
          <div
            class="battery-ring"
            style="--battery-color: ${this._batteryColor(battery)}"
          >
            <svg viewBox="0 0 36 36">
              <path
                class="battery-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="battery-fill"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                style="stroke-dasharray: ${battery || 0}, 100; stroke: ${this._batteryColor(battery)}"
              />
            </svg>
            <span class="battery-text">
              ${battery !== null ? `${Math.round(battery)}%` : "?"}
            </span>
            ${isCharging
              ? html`<ha-icon
                  icon="mdi:lightning-bolt"
                  class="charging-icon"
                ></ha-icon>`
              : ""}
          </div>
        </div>
      </div>

      ${isExpert
        ? html`
            <div class="status-details">
              ${satellites !== null
                ? html`<span class="detail-badge" title="Satelliten">
                    <ha-icon icon="mdi:satellite-variant"></ha-icon>
                    ${satellites}
                    ${rtk
                      ? html`<span class="rtk-badge">${rtk}</span>`
                      : ""}
                  </span>`
                : ""}
              ${wifiRssi !== null
                ? html`<span class="detail-badge" title="WiFi ${wifiRssi} dBm">
                    <ha-icon icon=${this._signalIcon(wifiRssi)}></ha-icon>
                    ${wifiRssi} dBm
                  </span>`
                : ""}
              ${progress !== null && state === "mowing"
                ? html`<span class="detail-badge" title="Fortschritt">
                    <ha-icon icon="mdi:percent"></ha-icon> ${progress}%
                  </span>`
                : ""}
            </div>
          `
        : ""}
    `;
  }

  _renderControls(state) {
    const progress = getNumericState(
      this.hass,
      this._entities.sensors.progress
    );
    const elapsed = getNumericState(
      this.hass,
      this._entities.sensors.elapsed_time
    );
    const remaining = getNumericState(
      this.hass,
      this._entities.sensors.left_time
    );

    return html`
      <div class="controls">
        ${state === "mowing"
          ? html`
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  style="width: ${progress || 0}%"
                ></div>
                <span class="progress-text">${progress || 0}%</span>
              </div>
              <div class="time-row">
                ${elapsed !== null
                  ? html`<span
                      >${this._formatMinutes(elapsed)} vergangen</span
                    >`
                  : ""}
                ${remaining !== null
                  ? html`<span
                      >${this._formatMinutes(remaining)} verbleibend</span
                    >`
                  : ""}
              </div>
            `
          : ""}

        <div class="button-row">
          ${state === "docked" || state === "paused"
            ? html`
                <button
                  class="ctrl-btn start"
                  @click=${() =>
                    this._callService("lawn_mower", "start_mowing")}
                >
                  <ha-icon icon="mdi:play"></ha-icon>
                  ${state === "paused" ? "Fortsetzen" : "Start"}
                </button>
              `
            : ""}
          ${state === "mowing"
            ? html`
                <button
                  class="ctrl-btn pause"
                  @click=${() => this._callService("lawn_mower", "pause")}
                >
                  <ha-icon icon="mdi:pause"></ha-icon>
                  Pause
                </button>
              `
            : ""}
          ${state === "mowing" || state === "paused"
            ? html`
                <button
                  class="ctrl-btn dock"
                  @click=${() => this._callService("lawn_mower", "dock")}
                >
                  <ha-icon icon="mdi:home"></ha-icon>
                  Zurück
                </button>
              `
            : ""}
          ${state === "mowing" || state === "paused"
            ? html`
                <button
                  class="ctrl-btn cancel"
                  @click=${() =>
                    this._pressButton(this._entities.buttons.cancel_task)}
                >
                  <ha-icon icon="mdi:close-circle"></ha-icon>
                  Abbrechen
                </button>
              `
            : ""}
        </div>
      </div>
    `;
  }

  _renderMowingConfig() {
    const ents = this._entities;
    return html`
      <div class="section">
        <div class="section-title">
          <ha-icon icon="mdi:cog"></ha-icon> Mäh-Einstellungen
        </div>
        <div class="config-grid">
          ${this._renderNumberSlider(ents.numbers.blade_height, "Schnitthöhe", "mm")}
          ${this._renderNumberSlider(ents.numbers.working_speed, "Geschwindigkeit", "m/s")}
          ${this._renderNumberSlider(ents.numbers.path_spacing, "Wegabstand", "cm")}
          ${this._renderSelect(ents.selects.nav_mode, "Navigation")}
          ${this._renderSelect(ents.selects.turn_mode, "Wendemodus")}
          ${this._renderSelect(ents.selects.obstacle_mode, "Hinderniserkennung")}
        </div>
      </div>
    `;
  }

  _renderZones() {
    const areas = this._entities.areas;
    if (!areas || areas.length === 0) return html``;

    return html`
      <div class="section">
        <div class="section-title">
          <ha-icon icon="mdi:vector-square"></ha-icon> Bereiche
        </div>
        <div class="zone-list">
          ${areas.map((eid) => {
            const state = this.hass.states[eid];
            if (!state) return html``;
            const name = state.attributes?.friendly_name || eid;
            const isOn = state.state === "on";
            return html`
              <div class="zone-row">
                <span class="zone-name">${name}</span>
                <ha-switch
                  .checked=${isOn}
                  @change=${() => this._toggleSwitch(eid)}
                ></ha-switch>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  _renderDevice() {
    const ents = this._entities;
    return html`
      <div class="section">
        <div class="section-title">
          <ha-icon icon="mdi:tune"></ha-icon> Gerätesteuerung
        </div>
        <div class="device-toggles">
          ${this._renderToggle(ents.switches.rain_mowing, "Regenerkennung (Mähen)")}
          ${this._renderToggle(ents.switches.rain_robot, "Regenerkennung (Roboter)")}
          ${this._renderToggle(ents.switches.side_led, "Seitenlicht")}
        </div>
      </div>
    `;
  }

  _renderNumberSlider(entityId, label, unit) {
    if (!entityId || !this.hass.states[entityId]) return html``;
    const state = this.hass.states[entityId];
    const val = parseFloat(state.state);
    const min = state.attributes?.min ?? 0;
    const max = state.attributes?.max ?? 100;
    const step = state.attributes?.step ?? 1;

    return html`
      <div class="slider-row">
        <label>${label}</label>
        <input
          type="range"
          min=${min}
          max=${max}
          step=${step}
          .value=${String(val)}
          @change=${(e) =>
            this._setNumber(entityId, parseFloat(e.target.value))}
        />
        <span class="slider-val">${val} ${unit}</span>
      </div>
    `;
  }

  _renderSelect(entityId, label) {
    if (!entityId || !this.hass.states[entityId]) return html``;
    const state = this.hass.states[entityId];
    const options = state.attributes?.options || [];
    const current = state.state;

    return html`
      <div class="select-row">
        <label>${label}</label>
        <select
          @change=${(e) => this._setSelect(entityId, e.target.value)}
        >
          ${options.map(
            (opt) =>
              html`<option value=${opt} ?selected=${opt === current}>
                ${opt}
              </option>`
          )}
        </select>
      </div>
    `;
  }

  _renderToggle(entityId, label) {
    if (!entityId || !this.hass.states[entityId]) return html``;
    const isOn = this.hass.states[entityId].state === "on";

    return html`
      <div class="toggle-row">
        <span>${label}</span>
        <ha-switch
          .checked=${isOn}
          @change=${() => this._toggleSwitch(entityId)}
        ></ha-switch>
      </div>
    `;
  }

  // --- Service calls ---

  _callService(domain, service) {
    this.hass.callService(domain, service, {
      entity_id: this._config.entity,
    });
  }

  _pressButton(entityId) {
    if (!entityId) return;
    this.hass.callService("button", "press", { entity_id: entityId });
  }

  _toggleSwitch(entityId) {
    this.hass.callService("switch", "toggle", { entity_id: entityId });
  }

  _setNumber(entityId, value) {
    this.hass.callService("number", "set_value", {
      entity_id: entityId,
      value,
    });
  }

  _setSelect(entityId, option) {
    this.hass.callService("select", "select_option", {
      entity_id: entityId,
      option,
    });
  }

  // --- Helpers ---

  _formatMinutes(minutes) {
    if (minutes === null) return "";
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  _signalIcon(rssi) {
    if (rssi > -50) return "mdi:wifi-strength-4";
    if (rssi > -60) return "mdi:wifi-strength-3";
    if (rssi > -70) return "mdi:wifi-strength-2";
    if (rssi > -80) return "mdi:wifi-strength-1";
    return "mdi:wifi-strength-alert-outline";
  }

  _countEntities() {
    if (!this._entities) return 0;
    let count = 1;
    if (this._entities.camera) count++;
    if (this._entities.device_tracker) count++;
    if (this._entities.charging) count++;
    for (const group of [
      "sensors",
      "buttons",
      "selects",
      "numbers",
      "switches",
    ]) {
      count += Object.keys(this._entities[group] || {}).length;
    }
    count += (this._entities.areas || []).length;
    return count;
  }

  static get styles() {
    return css`
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
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
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
    `;
  }
}

customElements.define("mammotion-card", MammotionCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "mammotion-card",
  name: "Mammotion Dashboard Card",
  description: "Custom card for Mammotion Luba robotic mowers",
  preview: true,
  documentationURL: "https://github.com/mikey0000/Mammotion-HA",
});

console.info(
  `%c MAMMOTION-CARD %c v${CARD_VERSION} `,
  "color: white; background: #4caf50; font-weight: bold; padding: 2px 4px; border-radius: 4px 0 0 4px;",
  "color: #4caf50; background: #f5f5f5; font-weight: bold; padding: 2px 4px; border-radius: 0 4px 4px 0;"
);
