/**
 * Auto-discovers all Mammotion entities belonging to the same device
 * as the configured lawn_mower entity.
 *
 * Strategy:
 * 1. Extract the device prefix from the lawn_mower entity_id
 *    (e.g. lawn_mower.luba_mbgz9jc5 → "luba_mbgz9jc5")
 * 2. Scan hass.states for all entities sharing that prefix
 * 3. Categorise them by domain and known suffix patterns
 */

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

export function discoverEntities(hass, lawnMowerEntityId) {
  if (!hass || !lawnMowerEntityId) return null;

  // Extract device prefix: "lawn_mower.luba_mbgz9jc5" → "luba_mbgz9jc5"
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

  // Find device_tracker (has doubled prefix)
  const trackerCandidate = `device_tracker.${prefix}_${prefix}`;
  if (hass.states[trackerCandidate]) {
    resolved.device_tracker = trackerCandidate;
  } else {
    // Fallback: search for any device_tracker with the prefix
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

  // Discover area switches dynamically (switch.*_bereich_area_*)
  for (const eid of Object.keys(hass.states)) {
    if (
      eid.startsWith(`switch.${prefix}_bereich_area_`) ||
      eid.startsWith(`switch.${prefix}_bereich_`)
    ) {
      if (!eid.includes("_regenerkennung") && !eid.includes("_seitenlicht") && !eid.includes("_updates")) {
        resolved.areas.push(eid);
      }
    }
  }

  return resolved;
}

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

// German translations for select option values
const OPTION_LABELS = {
  single_grid: "Einzelbahn",
  double_grid: "Doppelbahn",
  segment_grid: "Segmentbahn",
  no_grid: "Ohne Bahn",
  zero_turn: "Nullwendung",
  multipoint: "Mehrpunkt",
  direct_touch: "Direktkontakt",
  slow_touch: "Langsamer Kontakt",
  less_touch: "Weniger Kontakt",
  no_touch: "Kein Kontakt",
  sensitive: "Empfindlich",
  direct: "Direkt",
  follow_perimeter: "Randverfolgung",
  border_first: "Rand zuerst",
  grid_first: "Bahn zuerst",
  relative_angle: "Relativer Winkel",
  absolute_angle: "Absoluter Winkel",
  random_angle: "Zufälliger Winkel",
  none: "Keine",
  one: "1 Runde",
  two: "2 Runden",
  three: "3 Runden",
  four: "4 Runden",
};

export function translateOption(value) {
  return OPTION_LABELS[value] || value;
}

export function getState(hass, entityId) {
  if (!hass || !entityId) return null;
  return hass.states[entityId] || null;
}

export function getStateValue(hass, entityId) {
  const state = getState(hass, entityId);
  return state ? state.state : null;
}

export function getNumericState(hass, entityId) {
  const val = getStateValue(hass, entityId);
  if (val === null || val === "unknown" || val === "unavailable") return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
}
