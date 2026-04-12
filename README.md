# Mammotion Dashboard Card

Custom Lovelace Card for Mammotion Luba robotic mowers in Home Assistant.

## Installation

### HACS (empfohlen)

1. HACS > Frontend > Benutzerdefiniertes Repository hinzufuegen
2. Repository-URL eingeben, Kategorie: Dashboard
3. Installieren und Browser-Cache leeren

### Manuell

1. `dist/mammotion-card.js` nach `config/www/mammotion-card.js` kopieren
2. In HA: Einstellungen > Dashboards > Ressourcen > `/local/mammotion-card.js` (JavaScript-Modul)

## Konfiguration

```yaml
type: custom:mammotion-card
entity: lawn_mower.luba_mbgz9jc5
name: Luba               # optional
mode: family              # oder "expert"
modules:
  status: true
  controls: true
  mowing_config: true     # nur im Expert-Modus sichtbar
  zones: true
  schedule: true
  device: true            # nur im Expert-Modus sichtbar
```

## Features

- Automatische Entity-Erkennung (alle Sensoren, Buttons, Switches)
- Batterie-Ring mit Ladeanzeige
- Mäh-Fortschritt mit Zeitanzeige
- Zonen-Verwaltung mit Sync-Button
- Zeitplan-Anzeige mit Sync-Button
- Mäh-Einstellungen (Schnitthöhe, Geschwindigkeit, Navigation)
- Responsive Design (Mobile + Desktop)
- Family- und Expert-Modus

## Hinweise

### Verwaiste Area-Entities

Nach Aenderungen an den Maehzonen (Hinzufuegen/Loeschen von Bereichen) koennen verwaiste
Switch-Entities in Home Assistant zurueckbleiben, die dauerhaft "unavailable" anzeigen.
Diese koennen manuell geloescht werden unter:

**Einstellungen > Geraete & Dienste > Mammotion > [Geraet] > Entities** (Zahnrad-Icon) > Nicht verfuegbare Entities loeschen.

Die Card zeigt unavailable Bereiche ausgegraut an — sie stören den Betrieb nicht.
