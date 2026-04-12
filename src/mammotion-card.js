import { LitElement, html, css } from "lit";
import { discoverEntities, getStateValue, getNumericState, translateOption } from "./entity-discovery.js";
import "./editor.js";

const CARD_VERSION = "0.6.0";

class MammotionCard extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
      _entities: { state: true },
      _syncingMap: { state: true },
      _syncingSchedule: { state: true },
      _serviceError: { state: true },
      _openSections: { state: true },
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
        map: true,
        camera: true,
        mowing_config: true,
        zones: true,
        schedule: true,
        device: true,
      },
    };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Please define a lawn_mower entity");
    }
    this._config = {
      mode: "family",
      modules: {
        status: true,
        controls: true,
        map: true,
        camera: true,
        mowing_config: true,
        zones: true,
        schedule: true,
        device: true,
      },
      ...config,
    };
    this._entities = null;
    // Initialize accordion state based on mode
    const isExpert = this._config.mode === "expert";
    this._openSections = new Set(
      isExpert
        ? ["map", "zones", "mowing"]
        : ["map", "zones"]
    );
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
    return this._config?.mode === "expert" ? 8 : 4;
  }

  // --- State helpers ---

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

  // --- Accordion ---

  _toggleSection(section) {
    if (!this._openSections) this._openSections = new Set();
    if (this._openSections.has(section)) {
      this._openSections.delete(section);
    } else {
      this._openSections.add(section);
    }
    // Invalidate Leaflet size when map section opens
    if (section === "map" && this._openSections.has("map") && this._leafletMap) {
      setTimeout(() => this._leafletMap.invalidateSize(), 350);
    }
    this.requestUpdate();
  }

  _isSectionOpen(section) {
    return this._openSections ? this._openSections.has(section) : false;
  }

  _renderSection(key, icon, title, content, headerExtra) {
    const isOpen = this._isSectionOpen(key);
    return html`
      <div class="section">
        <div class="section-header" @click=${() => this._toggleSection(key)}>
          <ha-icon icon=${icon}></ha-icon>
          <span class="section-title-text">${title}</span>
          ${headerExtra || ""}
          <span class="chevron ${isOpen ? "open" : ""}">▸</span>
        </div>
        <div class="accordion-content ${isOpen ? "open" : ""}">
          ${content}
        </div>
      </div>
    `;
  }

  // --- Main render ---

  render() {
    if (!this.hass || !this._config) {
      return html`<ha-card><div class="card-content"><div class="loading">Lade...</div></div></ha-card>`;
    }

    if (!this.hass.states[this._config.entity]) {
      return html`<ha-card><div class="card-content">
        <div class="error-banner">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          Entity nicht gefunden: ${this._config.entity}
        </div>
      </div></ha-card>`;
    }

    if (!this._entities) {
      return html`<ha-card><div class="card-content"><div class="loading">Lade...</div></div></ha-card>`;
    }

    const state = this._getMowerState();
    const name =
      this._config.name ||
      this.hass.states[this._config.entity]?.attributes?.friendly_name ||
      "Mammotion";
    const battery = getNumericState(this.hass, this._entities.sensors.battery);
    const isCharging = getStateValue(this.hass, this._entities.charging) === "on";
    const isExpert = this._config.mode === "expert";
    const modules = this._config.modules || {};

    // Sync buttons for section headers
    const syncMapBtn = this._entities.buttons.sync_map
      ? html`<button
          class="sync-btn ${this._syncingMap ? "syncing" : ""}"
          @click=${(e) => { e.stopPropagation(); this._handleSync("map"); }}
          title="Karte synchronisieren"
          aria-label="Karte synchronisieren"
        ><svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></button>`
      : "";

    const syncScheduleBtn = this._entities.buttons.sync_schedule
      ? html`<button
          class="sync-btn ${this._syncingSchedule ? "syncing" : ""}"
          @click=${(e) => { e.stopPropagation(); this._handleSync("schedule"); }}
          title="Zeitplan synchronisieren"
          aria-label="Zeitplan synchronisieren"
        ><svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></button>`
      : "";

    return html`
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <ha-card>
        <div class="card-content">
          ${modules.status !== false ? this._renderStatus(name, state, battery, isCharging, isExpert) : ""}
          ${modules.controls !== false ? this._renderControls(state) : ""}
          ${modules.map !== false ? this._renderSection("map", "mdi:map-marker-radius", "Karte", this._renderMapContent(state)) : ""}
          ${modules.camera !== false && this._entities.camera ? this._renderSection("camera", "mdi:camera", "Kamera", this._renderCameraContent()) : ""}
          ${modules.zones !== false ? this._renderSection("zones", "mdi:vector-square", "Bereiche", this._renderZonesContent(), syncMapBtn) : ""}
          ${modules.mowing_config && isExpert ? this._renderSection("mowing", "mdi:cog", "Mäh-Einstellungen", this._renderMowingContent()) : ""}
          ${modules.schedule !== false ? this._renderSection("schedule", "mdi:calendar-clock", "Zeitplan", this._renderScheduleContent(isExpert), syncScheduleBtn) : ""}
          ${modules.device !== false && isExpert ? this._renderSection("device", "mdi:tune", "Gerätesteuerung", this._renderDeviceContent()) : ""}

          ${this._serviceError
            ? html`<div class="service-error">
                <ha-icon icon="mdi:alert-outline"></ha-icon> ${this._serviceError}
              </div>`
            : ""}

          <div class="footer">
            <span class="version">Mammotion Card v${CARD_VERSION}</span>
            <span class="entity-count">${this._countEntities()} Entities</span>
          </div>
        </div>
      </ha-card>
    `;
  }

  // --- Module renderers (content only, no section wrapper) ---

  _renderStatus(name, state, battery, isCharging, isExpert) {
    const progress = getNumericState(this.hass, this._entities.sensors.progress);
    const errorMsg = getStateValue(this.hass, this._entities.sensors.error_message);
    const wifiRssi = getNumericState(this.hass, this._entities.sensors.wifi_rssi);
    const satellites = getNumericState(this.hass, this._entities.sensors.satellites_robot);
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
          <div class="state-badge" style="background: ${this._stateColor(state)}">
            ${this._stateLabel(state)}
          </div>
          ${state === "error" && errorMsg
            ? html`<div class="error-msg">${errorMsg}</div>`
            : ""}
        </div>

        <div class="battery-wrap">
          <div class="battery-ring" style="--battery-color: ${this._batteryColor(battery)}">
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
            ${isCharging ? html`<ha-icon icon="mdi:lightning-bolt" class="charging-icon"></ha-icon>` : ""}
          </div>
        </div>
      </div>

      ${isExpert
        ? html`
            <div class="status-details">
              ${satellites !== null
                ? html`<span class="detail-badge" title="Satelliten">
                    <ha-icon icon="mdi:satellite-variant"></ha-icon> ${satellites}
                    ${rtk ? html`<span class="rtk-badge">${rtk}</span>` : ""}
                  </span>`
                : ""}
              ${wifiRssi !== null
                ? html`<span class="detail-badge" title="WiFi ${wifiRssi} dBm">
                    <ha-icon icon=${this._signalIcon(wifiRssi)}></ha-icon> ${wifiRssi} dBm
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
    const progress = getNumericState(this.hass, this._entities.sensors.progress);
    const elapsed = getNumericState(this.hass, this._entities.sensors.elapsed_time);
    const remaining = getNumericState(this.hass, this._entities.sensors.left_time);

    return html`
      <div class="controls">
        ${state === "mowing"
          ? html`
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress || 0}%"></div>
                <span class="progress-text">${progress || 0}%</span>
              </div>
              <div class="time-row">
                ${elapsed !== null ? html`<span>${this._formatMinutes(elapsed)} vergangen</span>` : ""}
                ${remaining !== null ? html`<span>${this._formatMinutes(remaining)} verbleibend</span>` : ""}
              </div>
            `
          : ""}

        <div class="button-row">
          ${state === "docked" || state === "paused"
            ? html`
                <button class="ctrl-btn start" @click=${() => this._callService("lawn_mower", "start_mowing")}>
                  <ha-icon icon="mdi:play"></ha-icon>
                  ${state === "paused" ? "Fortsetzen" : "Start"}
                </button>
              `
            : ""}
          ${state === "mowing"
            ? html`
                <button class="ctrl-btn pause" @click=${() => this._callService("lawn_mower", "pause")}>
                  <ha-icon icon="mdi:pause"></ha-icon>
                  Pause
                </button>
              `
            : ""}
          ${state === "mowing" || state === "paused"
            ? html`
                <button class="ctrl-btn dock" @click=${() => this._callService("lawn_mower", "dock")}>
                  <ha-icon icon="mdi:home"></ha-icon>
                  Zurück
                </button>
              `
            : ""}
          ${state === "mowing" || state === "paused"
            ? html`
                <button class="ctrl-btn cancel" @click=${() => this._pressButton(this._entities.buttons.cancel_task)}>
                  <ha-icon icon="mdi:close-circle"></ha-icon>
                  Abbrechen
                </button>
              `
            : ""}
        </div>
      </div>
    `;
  }

  _renderMapContent(state) {
    const lat = getNumericState(this.hass, this._entities.sensors.latitude);
    const lng = getNumericState(this.hass, this._entities.sensors.longitude);
    const sats = getNumericState(this.hass, this._entities.sensors.satellites_robot);

    if (lat === null || lng === null) {
      return html`<div class="map-placeholder">Keine GPS-Position verfügbar</div>`;
    }

    return html`
      <div id="mmc-map" class="map-container"></div>
      ${sats !== null ? html`<div class="map-info"><ha-icon icon="mdi:satellite-variant" style="--mdc-icon-size:14px"></ha-icon> ${sats} Satelliten · ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>` : ""}
    `;
  }

  _renderCameraContent() {
    const cameraEntity = this._entities.camera;
    if (!cameraEntity || !this.hass.states[cameraEntity]) {
      return html`<div class="map-placeholder">Keine Kamera verfügbar</div>`;
    }

    // Only render stream when section is open (saves bandwidth)
    if (!this._isSectionOpen("camera")) return "";

    const stateObj = this.hass.states[cameraEntity];
    return html`
      <div class="camera-container">
        <img
          src="/api/camera_proxy/${cameraEntity}"
          alt="Mäher-Kamera"
          class="camera-image"
          @error=${(e) => { e.target.style.display = "none"; }}
        />
      </div>
    `;
  }

  _renderZonesContent() {
    const areas = this._entities.areas;
    if (!areas || areas.length === 0) return html`<div class="empty-hint">Keine Bereiche gefunden</div>`;

    return html`
      <div class="zone-list">
        ${areas.map((eid) => {
          const state = this.hass.states[eid];
          const isUnavailable = !state || state.state === "unavailable";
          const isOn = state?.state === "on";

          const rawName = state?.attributes?.friendly_name || "";
          let name;
          if (rawName && rawName !== eid) {
            name = rawName.replace(/^[A-Za-z]+-[A-Z0-9]+\s+/, "");
            if (name === rawName) name = rawName.replace(/^.*?\s+(Bereich)/i, "$1");
          } else {
            const match = eid.match(/bereich_(\w+)$/);
            name = match ? `Bereich ${match[1].replace(/_/g, ".")}` : "Bereich";
          }

          return html`
            <div class="zone-row ${isUnavailable ? "unavailable" : ""}">
              <span class="zone-name">
                ${name}
                ${isUnavailable
                  ? html`<span class="unavailable-hint">(nicht verfügbar)</span>`
                  : ""}
              </span>
              <ha-switch
                .checked=${isOn}
                .disabled=${isUnavailable}
                @change=${() => !isUnavailable && this._toggleSwitch(eid)}
              ></ha-switch>
            </div>
          `;
        })}
      </div>
    `;
  }

  _renderMowingContent() {
    const ents = this._entities;
    return html`
      <div class="config-grid">
        ${this._renderNumberSlider(ents.numbers.blade_height, "Schnitthöhe", "mm")}
        ${this._renderNumberSlider(ents.numbers.working_speed, "Geschwindigkeit", "m/s")}
        ${this._renderNumberSlider(ents.numbers.path_spacing, "Wegabstand", "cm")}
        ${this._renderSelect(ents.selects.nav_mode, "Navigation")}
        ${this._renderSelect(ents.selects.turn_mode, "Wendemodus")}
        ${this._renderSelect(ents.selects.obstacle_mode, "Hinderniserkennung")}
      </div>
    `;
  }

  _renderScheduleContent(isExpert) {
    const ents = this._entities;
    const tasks = ents.tasks || [];
    const taskAreas = ents.task_areas || [];
    const nonWorkHours = getStateValue(this.hass, ents.sensors.non_work_hours);
    const taskDuration = getNumericState(this.hass, ents.sensors.task_duration);

    return html`
      ${tasks.length > 0
        ? html`
            <div class="task-list">
              ${tasks.map((eid) => {
                const state = this.hass.states[eid];
                if (!state) return "";
                const rawName = state.attributes?.friendly_name || eid;
                const name = rawName.replace(/^[A-Za-z]+-[A-Z0-9]+\s+/, "") || rawName.replace(/^.*?\s+/, "");
                const durationStr = taskDuration !== null ? ` · ~${Math.ceil(taskDuration)} Min` : "";
                return html`
                  <button class="task-btn" @click=${() => this._pressButton(eid)}>
                    <ha-icon icon="mdi:play-circle-outline"></ha-icon>
                    <span class="task-label">${name}${durationStr}</span>
                  </button>
                `;
              })}
            </div>
          `
        : ""}

      ${taskAreas.length > 0
        ? html`
            <div class="task-area-status">
              ${taskAreas.map((eid) => {
                const state = this.hass.states[eid];
                if (!state || state.state === "unknown" || state.state === "unavailable") return "";
                const rawName = state.attributes?.friendly_name || eid;
                const label = rawName.replace(/^[A-Za-z]+-[A-Z0-9]+\s+/, "").replace(/^Aufgabenbereich\s*/, "") || "Bereich";
                return html`
                  <span class="task-area-pill ${this._taskAreaClass(state.state)}">
                    ${label}: ${this._taskAreaLabel(state.state)}
                  </span>
                `;
              })}
            </div>
          `
        : ""}

      ${nonWorkHours && nonWorkHours !== "unknown" && nonWorkHours !== "unavailable"
        ? html`
            <div class="schedule-info">
              <div class="schedule-row">
                <ha-icon icon="mdi:clock-remove-outline"></ha-icon>
                <span>Ruhezeit: ${this._formatNonWorkHours(nonWorkHours)}</span>
              </div>
            </div>
          `
        : ""}

      ${isExpert
        ? html`
            <div class="schedule-hint">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              Weitere Mähpläne können in der Mammotion App erstellt werden.
            </div>
          `
        : ""}
    `;
  }

  _renderDeviceContent() {
    const ents = this._entities;
    return html`
      <div class="device-toggles">
        ${this._renderCombinedRainToggle()}
        ${this._renderToggle(ents.switches.side_led, "Seitenlicht")}
      </div>
    `;
  }

  _renderCombinedRainToggle() {
    const ent1 = this._entities?.switches?.rain_mowing;
    const ent2 = this._entities?.switches?.rain_robot;
    if (!ent1 && !ent2) return "";
    const isOn =
      (ent1 && this.hass.states[ent1]?.state === "on") ||
      (ent2 && this.hass.states[ent2]?.state === "on");
    return html`
      <div class="toggle-row">
        <span><ha-icon icon="mdi:weather-rainy" style="--mdc-icon-size:18px; margin-right:4px; vertical-align:middle; color:var(--secondary-text-color)"></ha-icon>Regenschutz</span>
        <ha-switch
          .checked=${isOn}
          @change=${() => this._toggleRainProtection(!isOn)}
        ></ha-switch>
      </div>
    `;
  }

  // --- Sub-renderers ---

  _renderNumberSlider(entityId, label, unit) {
    if (!entityId || !this.hass.states[entityId]) return "";
    const state = this.hass.states[entityId];
    const val = parseFloat(state.state);
    const rawMin = state.attributes?.min;
    const rawMax = state.attributes?.max;
    const min = rawMin ?? 0;
    const max = rawMax ?? 100;
    const step = state.attributes?.step ?? 1;

    const isBroken =
      min >= max ||
      max === 0 ||
      (rawMin === undefined && rawMax === undefined && val === 0);

    if (isBroken) {
      const suffix = entityId.replace(/^number\./, "");
      const sensorState = this.hass.states[`sensor.${suffix}`];
      const displayVal = sensorState ? parseFloat(sensorState.state) : val;
      const sensorUnit = sensorState?.attributes?.unit_of_measurement || unit;
      const defaults = { schnitthohe: [15, 100], aufgabengeschwindigkeit: [0.2, 1.2], wegabstand: [5, 35] };
      const key = entityId.split("_").pop();
      const [dMin, dMax] = defaults[key] || [0, 100];
      return html`
        <div class="slider-row disabled">
          <label>${label}</label>
          <input type="range" min=${dMin} max=${dMax} step=${step} .value=${String(isNaN(displayVal) ? 0 : displayVal)} disabled />
          <span class="slider-val">${isNaN(displayVal) ? "?" : displayVal} ${sensorUnit} <ha-icon icon="mdi:lock" style="--mdc-icon-size:14px"></ha-icon></span>
        </div>
      `;
    }

    return html`
      <div class="slider-row">
        <label>${label}</label>
        <input
          type="range"
          min=${min}
          max=${max}
          step=${step}
          .value=${String(val)}
          @change=${(e) => this._setNumber(entityId, parseFloat(e.target.value))}
        />
        <span class="slider-val">${val} ${unit}</span>
      </div>
    `;
  }

  _renderSelect(entityId, label) {
    if (!entityId || !this.hass.states[entityId]) return "";
    const state = this.hass.states[entityId];
    const options = state.attributes?.options || [];
    const current = state.state;

    return html`
      <div class="select-row">
        <label>${label}</label>
        <select @change=${(e) => this._setSelect(entityId, e.target.value)}>
          ${options.map(
            (opt) => html`<option value=${opt} ?selected=${opt === current}>${translateOption(opt)}</option>`
          )}
        </select>
      </div>
    `;
  }

  _renderToggle(entityId, label) {
    if (!entityId || !this.hass.states[entityId]) return "";
    const isOn = this.hass.states[entityId].state === "on";

    return html`
      <div class="toggle-row">
        <span>${label}</span>
        <ha-switch .checked=${isOn} @change=${() => this._toggleSwitch(entityId)}></ha-switch>
      </div>
    `;
  }

  // --- Service calls ---

  async _callService(domain, service) {
    try {
      await this.hass.callService(domain, service, {
        entity_id: this._config.entity,
      });
    } catch (e) {
      this._showServiceError(e.message || "Service-Aufruf fehlgeschlagen");
    }
  }

  async _pressButton(entityId) {
    if (!entityId) return;
    try {
      await this.hass.callService("button", "press", { entity_id: entityId });
    } catch (e) {
      this._showServiceError(e.message || "Button-Aufruf fehlgeschlagen");
    }
  }

  _handleSync(type) {
    const entityId =
      type === "map"
        ? this._entities.buttons.sync_map
        : this._entities.buttons.sync_schedule;
    if (!entityId) return;

    this._pressButton(entityId);

    if (type === "map") {
      this._syncingMap = true;
    } else {
      this._syncingSchedule = true;
    }
    this.requestUpdate();

    setTimeout(() => {
      if (type === "map") {
        this._syncingMap = false;
      } else {
        this._syncingSchedule = false;
      }
      this.requestUpdate();
    }, 3000);
  }

  async _toggleSwitch(entityId) {
    try {
      await this.hass.callService("switch", "toggle", { entity_id: entityId });
    } catch (e) {
      this._showServiceError(e.message || "Switch-Aufruf fehlgeschlagen");
    }
  }

  async _toggleRainProtection(turnOn) {
    const service = turnOn ? "turn_on" : "turn_off";
    const ent1 = this._entities?.switches?.rain_mowing;
    const ent2 = this._entities?.switches?.rain_robot;
    try {
      if (ent1) await this.hass.callService("switch", service, { entity_id: ent1 });
      if (ent2) await this.hass.callService("switch", service, { entity_id: ent2 });
    } catch (e) {
      this._showServiceError(e.message || "Regenschutz-Umschaltung fehlgeschlagen");
    }
  }

  async _setNumber(entityId, value) {
    try {
      await this.hass.callService("number", "set_value", {
        entity_id: entityId,
        value,
      });
    } catch (e) {
      this._showServiceError(e.message || "Wert konnte nicht gesetzt werden");
    }
  }

  async _setSelect(entityId, option) {
    try {
      await this.hass.callService("select", "select_option", {
        entity_id: entityId,
        option,
      });
    } catch (e) {
      this._showServiceError(e.message || "Auswahl fehlgeschlagen");
    }
  }

  _showServiceError(msg) {
    this._serviceError = msg;
    this.requestUpdate();
    setTimeout(() => {
      this._serviceError = null;
      this.requestUpdate();
    }, 4000);
  }

  // --- Leaflet Map ---

  async _loadLeaflet() {
    if (window.L) return;
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

  async _initMap() {
    if (this._leafletMap || !this._entities) return;
    const container = this.renderRoot.querySelector("#mmc-map");
    if (!container) return;

    const lat = getNumericState(this.hass, this._entities.sensors.latitude);
    const lng = getNumericState(this.hass, this._entities.sensors.longitude);
    if (lat === null || lng === null) return;

    await this._loadLeaflet();
    if (!window.L || this._leafletMap) return;

    this._leafletMap = L.map(container, { zoomControl: true }).setView([lat, lng], 19);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 21,
      attribution: "&copy; OSM",
    }).addTo(this._leafletMap);

    const color = this._markerColor(this._getMowerState());
    this._mapMarker = L.circleMarker([lat, lng], {
      radius: 8,
      color: color,
      fillColor: color,
      fillOpacity: 0.8,
      weight: 2,
    }).addTo(this._leafletMap);

    setTimeout(() => this._leafletMap.invalidateSize(), 200);
  }

  _updateMapMarker() {
    if (!this._leafletMap || !this._mapMarker) return;
    const lat = getNumericState(this.hass, this._entities.sensors.latitude);
    const lng = getNumericState(this.hass, this._entities.sensors.longitude);
    if (lat === null || lng === null) return;

    this._mapMarker.setLatLng([lat, lng]);
    const color = this._markerColor(this._getMowerState());
    this._mapMarker.setStyle({ color, fillColor: color });

    if (this._getMowerState() === "mowing") {
      this._leafletMap.panTo([lat, lng], { animate: true });
    }
  }

  _markerColor(state) {
    const colors = { mowing: "#4CAF50", docked: "#2196F3", paused: "#FF9800", returning: "#2196F3", error: "#F44336" };
    return colors[state] || "#999";
  }

  async updated(changedProps) {
    super.updated(changedProps);
    if (this._isSectionOpen("map") && !this._leafletMap) {
      await this._initMap();
    }
    if (this._leafletMap) {
      this._updateMapMarker();
    }
  }

  // --- Performance ---

  shouldUpdate(changedProps) {
    if (!changedProps.has("hass")) return true;
    const oldHass = changedProps.get("hass");
    if (!oldHass || !this._entities) return true;
    const ids = this._getAllEntityIds();
    return ids.some((eid) => oldHass.states[eid] !== this.hass.states[eid]);
  }

  _getAllEntityIds() {
    const ents = this._entities;
    if (!ents) return [];
    const ids = [ents.lawn_mower];
    if (ents.camera) ids.push(ents.camera);
    if (ents.device_tracker) ids.push(ents.device_tracker);
    if (ents.charging) ids.push(ents.charging);
    for (const group of ["sensors", "buttons", "selects", "numbers", "switches"]) {
      if (ents[group]) ids.push(...Object.values(ents[group]));
    }
    if (ents.areas) ids.push(...ents.areas);
    if (ents.tasks) ids.push(...ents.tasks);
    if (ents.task_areas) ids.push(...ents.task_areas);
    return ids;
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

  _taskAreaClass(state) {
    const s = state.toUpperCase();
    if (s === "MOWING") return "active";
    if (s === "COMPLETED") return "completed";
    if (s === "WAITING") return "waiting";
    return "other";
  }

  _taskAreaLabel(state) {
    const labels = {
      MOWING: "Mäht",
      WAITING: "Wartet",
      COMPLETED: "Fertig",
      NOT_STARTED: "Nicht gestartet",
    };
    return labels[state.toUpperCase()] || state;
  }

  _formatNonWorkHours(value) {
    if (!value || value === "Not set") return "Keine Ruhezeit konfiguriert";
    return value.replace(/(\d{1,2}:\d{2})(am|pm)/gi, (_, time, ampm) => {
      const [h, m] = time.split(":");
      let hour = parseInt(h, 10);
      if (ampm.toLowerCase() === "pm" && hour !== 12) hour += 12;
      if (ampm.toLowerCase() === "am" && hour === 12) hour = 0;
      return `${String(hour).padStart(2, "0")}:${m}`;
    });
  }

  _countEntities() {
    if (!this._entities) return 0;
    let count = 1;
    if (this._entities.camera) count++;
    if (this._entities.device_tracker) count++;
    if (this._entities.charging) count++;
    for (const group of ["sensors", "buttons", "selects", "numbers", "switches"]) {
      count += Object.keys(this._entities[group] || {}).length;
    }
    count += (this._entities.areas || []).length;
    count += (this._entities.tasks || []).length;
    count += (this._entities.task_areas || []).length;
    return count;
  }

  static get styles() {
    return css`
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
