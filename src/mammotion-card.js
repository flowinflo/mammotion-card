import { LitElement, html, css } from "lit";
import { discoverEntities, getStateValue, getNumericState, translateOption } from "./entity-discovery.js";
import "./editor.js";

// Camera module disabled - WebRTC stream requires active mowing session
const CARD_VERSION = "0.9.0";

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
      _bladeWarnInput: { state: true },
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
        map: true,
        zones: true,
        settings: true,
        schedule: true,
        maintenance: true,
      },
    };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Please define a lawn_mower entity");
    }

    let modules = {
      map: true,
      zones: true,
      settings: true,
      schedule: true,
      maintenance: true,
    };

    if (config.modules) {
      const cm = config.modules;
      modules = { ...modules, ...cm };
      // Backward compat: map_and_zones → map + zones
      if ("map_and_zones" in cm && !("map" in cm)) modules.map = cm.map_and_zones;
      if ("map_and_zones" in cm && !("zones" in cm)) modules.zones = cm.map_and_zones;
      // Backward compat: mowing_config/device → settings
      if (("mowing_config" in cm || "device" in cm) && !("settings" in cm)) {
        modules.settings = cm.mowing_config !== false || cm.device !== false;
      }
    }

    this._config = {
      mode: "family",
      ...config,
      modules,
    };
    this._entities = null;
    this._bladeWarnInput = null;

    const isExpert = this._config.mode === "expert";
    this._openSections = new Set(
      isExpert ? ["zones", "settings"] : ["zones"]
    );
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;

    if (!this._entities || !oldHass) {
      this._entities = discoverEntities(hass, this._config.entity);
    }

    // Track mowing trail
    this._updateMowingTrail(oldHass);

    this.requestUpdate("hass", oldHass);
  }

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return this._config?.mode === "expert" ? 8 : 5;
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
    if (level > 50) return "#4caf50";
    if (level > 20) return "#ff9800";
    return "#f44336";
  }

  // --- Accordion ---

  _toggleSection(section) {
    if (!this._openSections) this._openSections = new Set();
    if (this._openSections.has(section)) {
      this._openSections.delete(section);
    } else {
      this._openSections.add(section);
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
    const displayName = this._config.name || "Luba";
    const entityFriendly = this.hass.states[this._config.entity]?.attributes?.friendly_name || "";
    const deviceId = entityFriendly || this._config.entity.replace("lawn_mower.", "");
    const battery = getNumericState(this.hass, this._entities.sensors.battery);
    const isCharging = getStateValue(this.hass, this._entities.charging) === "on";
    const isExpert = this._config.mode === "expert";
    const modules = this._config.modules || {};
    const errorMsg = getStateValue(this.hass, this._entities.sensors.error_message);

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
        ${modules.map !== false
          ? this._renderMapHero(displayName, deviceId, state, battery, isCharging)
          : this._renderSimpleHeader(displayName, deviceId, state, battery, isCharging)}

        ${state === "mowing" || state === "paused" ? this._renderMowingProgress(state) : ""}

        <div class="card-content">
          ${state === "error" && errorMsg
            ? html`<div class="error-msg-banner">
                <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size:18px"></ha-icon>
                ${errorMsg}
              </div>`
            : ""}

          ${this._renderControls(state)}

          ${modules.zones !== false ? this._renderSection("zones", "mdi:vector-square", "Bereiche", this._renderZonesContent(), syncMapBtn) : ""}
          ${modules.settings !== false ? this._renderSection("settings", "mdi:cog", "Einstellungen", this._renderSettingsContent()) : ""}
          ${modules.schedule !== false ? this._renderSection("schedule", "mdi:calendar-clock", "Zeitplan", this._renderScheduleContent(isExpert), syncScheduleBtn) : ""}
          ${modules.maintenance !== false ? this._renderSection("maintenance", "mdi:wrench", "Wartung", this._renderMaintenanceContent(isExpert)) : ""}

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

  // --- Map Hero with Status Overlay ---

  _renderMapHero(displayName, deviceId, state, battery, isCharging) {
    const satellites = getNumericState(this.hass, this._entities.sensors.satellites_robot);
    const rtk = getStateValue(this.hass, this._entities.sensors.rtk_position);
    const wifiRssi = getNumericState(this.hass, this._entities.sensors.wifi_rssi);
    const lat = getNumericState(this.hass, this._entities.sensors.latitude);
    const lng = getNumericState(this.hass, this._entities.sensors.longitude);
    const hasGps = lat !== null && lng !== null;

    return html`
      <div class="map-hero">
        ${hasGps
          ? html`<div id="mmc-map" class="map-container"></div>`
          : html`<div class="map-hero-placeholder">
              <ha-icon icon="mdi:satellite-variant"></ha-icon>
              <span>GPS-Position wird gesucht...</span>
            </div>`}
        <div class="map-overlay">
          <div class="overlay-top">
            <div class="device-info">
              <span class="device-name">${displayName} <span class="device-id">(${deviceId})</span></span>
              <span class="status-badge ${state}">${this._stateLabel(state)}</span>
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
                  style="stroke-dasharray: ${battery || 0}, 100; stroke: ${this._batteryColor(battery)}"
                />
              </svg>
              <span class="battery-text-hero">
                ${battery !== null ? `${Math.round(battery)}%` : "?"}
              </span>
              ${isCharging ? html`<ha-icon icon="mdi:lightning-bolt" class="charging-icon-hero"></ha-icon>` : ""}
            </div>
          </div>
          <div class="overlay-bottom">
            ${satellites !== null ? html`<span class="info-pill">\u{1F6F0} ${satellites} Sat</span>` : ""}
            ${wifiRssi !== null ? html`<span class="info-pill">\u{1F4E1} ${wifiRssi} dBm</span>` : ""}
            ${rtk && rtk !== "unknown" && rtk !== "unavailable" ? html`<span class="info-pill">${rtk}</span>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  _renderSimpleHeader(displayName, deviceId, state, battery, isCharging) {
    return html`
      <div class="simple-header">
        <ha-icon
          icon=${this._stateIcon(state)}
          class="${state === "mowing" ? "mowing-animation" : ""}"
          style="color: ${this._stateColor(state)}; --mdc-icon-size: 36px"
        ></ha-icon>
        <div class="simple-header-info">
          <span class="simple-header-name">${displayName} <span class="device-id" style="color:var(--secondary-text-color)">(${deviceId})</span></span>
          <span class="status-badge ${state}">${this._stateLabel(state)}</span>
        </div>
        <div class="battery-ring-hero" style="width:48px; height:48px">
          <svg viewBox="0 0 36 36">
            <path class="battery-bg-hero" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="battery-fill-hero" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style="stroke-dasharray: ${battery || 0}, 100; stroke: ${this._batteryColor(battery)}" />
          </svg>
          <span class="battery-text-hero" style="color: var(--primary-text-color)">${battery !== null ? `${Math.round(battery)}%` : "?"}</span>
          ${isCharging ? html`<ha-icon icon="mdi:lightning-bolt" class="charging-icon-hero"></ha-icon>` : ""}
        </div>
      </div>
    `;
  }

  // --- Module renderers ---

  _renderControls(state) {
    return html`
      <div class="controls">
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

  _renderSelectAllZones() {
    const areas = this._entities?.areas || [];
    const availableAreas = areas.filter((eid) =>
      this.hass.states[eid]?.state !== "unavailable"
    );
    if (availableAreas.length <= 1) return "";

    const allOn = availableAreas.every((eid) => this.hass.states[eid]?.state === "on");

    return html`
      <div class="zone-row select-all">
        <span class="zone-name" style="font-weight:500">Alle Bereiche</span>
        <ha-switch
          .checked=${allOn}
          @change=${() => this._toggleAllZones(!allOn)}
        ></ha-switch>
      </div>
      <div class="zone-divider"></div>
    `;
  }

  async _toggleAllZones(turnOn) {
    const areas = this._entities?.areas || [];
    const service = turnOn ? "turn_on" : "turn_off";
    try {
      for (const eid of areas) {
        if (this.hass.states[eid]?.state !== "unavailable") {
          await this.hass.callService("switch", service, { entity_id: eid });
        }
      }
    } catch (e) {
      this._showServiceError(e.message || "Bereiche umschalten fehlgeschlagen");
    }
  }

  _renderZonesContent() {
    const areas = this._entities.areas;
    if (!areas || areas.length === 0) return html`<div class="empty-hint">Keine Bereiche gefunden</div>`;

    return html`
      <div class="zone-list">
        ${this._renderSelectAllZones()}
        ${areas.map((eid) => {
          const stateObj = this.hass.states[eid];
          const isUnavailable = !stateObj || stateObj.state === "unavailable";
          const isOn = stateObj?.state === "on";

          const rawName = stateObj?.attributes?.friendly_name || "";
          let name;
          if (rawName && rawName !== eid) {
            name = rawName.replace(/^[A-Za-z]+-[A-Z0-9]+\s+/, "");
            if (name === rawName) name = rawName.replace(/^.*?\s+(Bereich)/i, "$1");
            name = name.replace(/^Bereich\s+/i, "");
          } else {
            const match = eid.match(/bereich_(\w+)$/);
            name = match ? match[1].replace(/_/g, ".") : "Bereich";
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

  _renderSettingsContent() {
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
      <div class="settings-divider"></div>
      <div class="device-toggles">
        ${this._renderCombinedRainToggle()}
        ${this._renderToggle(ents.switches.side_led, "Seitenlicht")}
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

  // --- Maintenance Module ---

  _renderMaintenanceContent(isExpert) {
    const ents = this._entities;
    const bladeUsed = getNumericState(this.hass, ents.sensors.blade_used_time);
    const bladeWarn = getNumericState(this.hass, ents.sensors.blade_warn_time);
    const batteryCycles = getNumericState(this.hass, ents.sensors.battery_cycles);
    const totalDistance = getNumericState(this.hass, ents.sensors.total_distance);
    const errorCode = getStateValue(this.hass, ents.sensors.error_code);
    const errorMessage = getStateValue(this.hass, ents.sensors.error_message);
    const errorTime = getStateValue(this.hass, ents.sensors.error_time);

    let bladePercent = null;
    if (bladeUsed !== null && bladeWarn !== null && bladeWarn > 0) {
      bladePercent = Math.min(100, (bladeUsed / bladeWarn) * 100);
    }
    const bladeBarColor = bladePercent === null ? "#999"
      : bladePercent < 50 ? "#4caf50"
      : bladePercent < 80 ? "#ff9800"
      : "#f44336";

    const cyclesValid = batteryCycles !== null && batteryCycles !== 65535;
    const hasError = errorCode && errorCode !== "unknown" && errorCode !== "unavailable" && errorCode !== "0";

    return html`
      ${bladeUsed !== null
        ? html`
            <div class="maint-blade">
              <div class="maint-label">Klingen-Laufzeit</div>
              ${bladePercent !== null
                ? html`
                    <div class="blade-bar-wrap">
                      <div class="blade-bar">
                        <div class="blade-bar-fill" style="width:${bladePercent}%; background:${bladeBarColor}"></div>
                      </div>
                      <span class="blade-bar-text">${bladeUsed.toFixed(1)} von ${bladeWarn.toFixed(1)} Stunden (${Math.round(bladePercent)}%)</span>
                    </div>
                  `
                : html`<div class="maint-val">${bladeUsed.toFixed(1)} Stunden</div>`}
            </div>
          `
        : ""}

      <div class="maint-row">
        <span>Batterie-Zyklen</span>
        <span class="maint-val">${cyclesValid ? batteryCycles : "Nicht verfügbar"}</span>
      </div>

      ${totalDistance !== null
        ? html`
            <div class="maint-row">
              <span>Gesamtstrecke</span>
              <span class="maint-val">${totalDistance.toFixed(1)} km</span>
            </div>
          `
        : ""}

      ${hasError
        ? html`
            <div class="maint-error">
              <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size:16px; color:var(--error-color, #f44336)"></ha-icon>
              <span>Letzter Fehler: ${errorCode} - ${errorMessage && !errorMessage.toLowerCase().includes("error message not found") ? errorMessage : `Unbekannter Fehler (Code: ${errorCode})`} (${this._formatRelativeDate(errorTime)})</span>
            </div>
          `
        : html`
            <div class="maint-ok">
              <ha-icon icon="mdi:check-circle" style="--mdc-icon-size:16px; color:#4caf50"></ha-icon>
              <span>Keine Fehler</span>
            </div>
          `}

      ${isExpert
        ? html`
            <div class="maint-actions">
              <button class="maint-btn" @click=${() => this._resetBladeTime()}>
                <ha-icon icon="mdi:refresh"></ha-icon>
                Klingenzeit zurücksetzen
              </button>
              <div class="maint-input-row">
                <input
                  type="number"
                  class="maint-input"
                  placeholder="Stunden"
                  .value=${this._bladeWarnInput || ""}
                  @input=${(e) => { this._bladeWarnInput = e.target.value; }}
                />
                <button class="maint-btn small" @click=${() => this._setBladeWarningTime()}>
                  Warnzeit setzen
                </button>
              </div>
            </div>
          `
        : ""}
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

  async _resetBladeTime() {
    if (!window.confirm("Klingenzeit wirklich zurücksetzen?")) return;
    try {
      await this.hass.callService("mammotion", "reset_blade_time", {
        entity_id: this._config.entity,
      });
    } catch (e) {
      this._showServiceError(e.message || "Klingenzeit zurücksetzen fehlgeschlagen");
    }
  }

  async _setBladeWarningTime() {
    const hours = parseFloat(this._bladeWarnInput);
    if (isNaN(hours) || hours <= 0) {
      this._showServiceError("Bitte gültigen Stundenwert eingeben");
      return;
    }
    try {
      await this.hass.callService("mammotion", "set_blade_warning_time", {
        entity_id: this._config.entity,
        hours: hours,
      });
    } catch (e) {
      this._showServiceError(e.message || "Warnzeit setzen fehlgeschlagen");
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

  // --- Mowing Progress Bar ---

  _renderMowingProgress(state) {
    const progress = getNumericState(this.hass, this._entities.sensors.progress);
    const elapsed = getNumericState(this.hass, this._entities.sensors.elapsed_time);
    const remaining = getNumericState(this.hass, this._entities.sensors.left_time);
    const area = getNumericState(this.hass, this._entities.sensors.area);
    const total = elapsed !== null && remaining !== null ? elapsed + remaining : null;
    const barColor = state === "paused" ? "#ff9800" : "#4CAF50";

    return html`
      <div class="mowing-progress">
        <div class="mowing-bar">
          <div class="mowing-bar-fill" style="width:${progress || 0}%; background:${barColor}"></div>
        </div>
        <div class="mowing-stats">
          <span>${progress !== null ? `${progress}%` : "--"}${area !== null ? ` · ${area} m\u00B2` : ""}</span>
          <span>${this._fmtTime(elapsed)} / ${this._fmtTime(total)}</span>
        </div>
      </div>
    `;
  }

  _fmtTime(minutes) {
    if (minutes === null || minutes === undefined) return "--";
    const m = Math.round(minutes);
    if (m < 60) return `${m} Min`;
    return `${Math.floor(m / 60)}h ${m % 60} Min`;
  }

  // --- Mowing Trail ---

  _updateMowingTrail(oldHass) {
    if (!this._entities) return;
    const state = this._getMowerState();
    const oldState = oldHass ? getStateValue(oldHass, this._config.entity) : null;

    // Reset trail when leaving mowing state
    if (oldState === "mowing" && state !== "mowing") {
      this._mowingTrail = [];
      if (this._trailLine && this._leafletMap) {
        this._leafletMap.removeLayer(this._trailLine);
        this._trailLine = null;
      }
      return;
    }

    if (state !== "mowing") return;

    const lat = getNumericState(this.hass, this._entities.sensors.latitude);
    const lng = getNumericState(this.hass, this._entities.sensors.longitude);
    if (lat === null || lng === null) return;

    if (!this._mowingTrail) this._mowingTrail = [];

    console.log("Trail check:", state, lat, lng, this._mowingTrail.length);

    // Check minimum distance (1m) from last point
    if (this._mowingTrail.length > 0) {
      const last = this._mowingTrail[this._mowingTrail.length - 1];
      if (this._distanceMeters(last[0], last[1], lat, lng) < 1) return;
    }

    this._mowingTrail.push([lat, lng]);

    // Cap at 500 points
    if (this._mowingTrail.length > 500) {
      this._mowingTrail.shift();
      if (this._trailLine) this._trailLine.setLatLngs(this._mowingTrail);
    }

    // Update/create polyline on map
    if (this._leafletMap) {
      if (this._trailLine) {
        this._trailLine.addLatLng([lat, lng]);
      } else if (this._mowingTrail.length >= 2) {
        this._trailLine = L.polyline(this._mowingTrail, {
          color: "#4CAF50",
          weight: 3,
          opacity: 0.7,
        }).addTo(this._leafletMap);
      }
    }
  }

  _distanceMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

    this._leafletMap = L.map(container, {
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      attributionControl: false,
    }).setView([lat, lng], 19);

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 21 }
    ).addTo(this._leafletMap);

    const color = this._markerColor(this._getMowerState());
    this._mapMarker = L.circleMarker([lat, lng], {
      radius: 8,
      color: "#fff",
      fillColor: color,
      fillOpacity: 0.9,
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
    const state = this._getMowerState();
    const color = this._markerColor(state);
    const radius = state === "mowing" ? 10 : 8;
    this._mapMarker.setStyle({ fillColor: color, radius });

    if (state === "mowing") {
      this._leafletMap.setView([lat, lng], this._leafletMap.getZoom(), { animate: true });
    }
  }

  _markerColor(state) {
    const colors = { mowing: "#4CAF50", docked: "#2196F3", paused: "#FF9800", returning: "#2196F3", error: "#F44336" };
    return colors[state] || "#999";
  }

  async updated(changedProps) {
    super.updated(changedProps);

    // Detect if Lit re-rendered the map container (old DOM node is orphaned)
    if (this._leafletMap) {
      const container = this.renderRoot.querySelector("#mmc-map");
      if (!container || !container.contains(this._leafletMap.getContainer())) {
        this._leafletMap.remove();
        this._leafletMap = null;
        this._mapMarker = null;
        this._trailLine = null;
      }
    }

    if (!this._leafletMap && this._config?.modules?.map !== false) {
      await this._initMap();
      // Re-draw existing trail after map re-init
      if (this._leafletMap && this._mowingTrail?.length >= 2) {
        this._trailLine = L.polyline(this._mowingTrail, {
          color: "#4CAF50",
          weight: 3,
          opacity: 0.7,
        }).addTo(this._leafletMap);
      }
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

  _formatRelativeDate(dateStr) {
    if (!dateStr || dateStr === "unknown" || dateStr === "unavailable") return "Unbekannt";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Heute";
      if (diffDays === 1) return "Gestern";
      if (diffDays < 7) return `vor ${diffDays} Tagen`;
      if (diffDays < 30) return `vor ${Math.floor(diffDays / 7)} Wochen`;
      return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    } catch {
      return dateStr;
    }
  }

  _countEntities() {
    if (!this._entities) return 0;
    let count = 1;
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
