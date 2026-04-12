import { LitElement, html, css } from "lit";

const MODULES_DEFAULT = {
  status: true,
  controls: true,
  mowing_config: true,
  zones: true,
  device: true,
  maintenance: false,
  map: false,
  camera: false,
  schedule: true,
};

export class MammotionCardEditor extends LitElement {
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

    if (key === "mode") {
      value = target.value;
    }

    const newConfig = { ...this._config, [key]: value };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  _moduleChanged(ev) {
    const module = ev.target.configValue;
    const checked = ev.target.checked;
    const modules = { ...MODULES_DEFAULT, ...this._config.modules, [module]: checked };
    const newConfig = { ...this._config, modules };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
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
