# Upgrade Integration Guide - HunterSim2

Diese Anleitung erklärt, wie neue Upgrades aus dem Spiel in das Tool integriert werden.

## Übersicht

Nach dem Gem-System Update gibt es zwei Hauptkategorien von Upgrades:

1. **Normale Upgrades** (Relics, Gadgets, Inscryptions) - **Genauso einfach wie vorher**
2. **Gem-Upgrades** - **Etwas komplexer**

---

## 1. NORMALE UPGRADES (Relics, Gadgets, Inscryptions)

### ✅ Aufwand: **2 Dateien** (wie vorher)

### Schritt 1: Upgrade in `upgrades.js` hinzufügen

```javascript
// src/constants/upgrades.js

// Für Relics:
relics: [
  // ... existing relics
  {
    id: "r25",              // Neue ID
    name: "New Relic #25",  // Name aus dem Spiel
    type: "level",
    upgradeType: "multiplicative",
    value: 1.05,
    maxLevel: 100,
    multitext: "Loot Reward",
  }
],

// Für Gadgets:
gadgets: [
  // ... existing gadgets
  {
    id: "newGadget",
    name: "New Gadget",
    type: "level",
    maxLevel: 50,
    // ...
  }
],

// Für Inscryptions:
inscryptions: [
  // ... existing inscryptions
  {
    id: "i95",
    name: "Inscryption #95",
    hunter: "borge",
    type: "level",
    add: 0.25,
    maxLevel: 7,
    description: "ATK Power",
    format: "percent",
    color: "blue"
  }
]
```

### Schritt 2: Parameter in Hunter-Datei hinzufügen

```javascript
// src/constants/borge.js (oder ozzy.js, knox.js)

export const EVAL_PARAMS = [
  // ... existing parameters
  "upgrades.relics.r25",           // Für Relics
  "upgrades.gadgets.newGadget",    // Für Gadgets
  "upgrades.inscryptions.i95",     // Für Inscryptions
];
```

### ✅ **Das war's!** - Upgrade funktioniert automatisch in:
- Build-Evaluierung
- Override-Modal
- Kostensystem
- Import/Export

---

## 2. GEM-UPGRADES

### ⚠️ Aufwand: **4 Dateien**

### Schritt 1: Gem-Node in `upgrades.js` hinzufügen

```javascript
// src/constants/upgrades.js

gems: [
  {
    id: 'attraction',
    name: 'Attraction Gem',
    nodes: [
      // ... existing nodes
      { 
        id: 'newUpgrade',           // Node ID
        name: 'New Upgrade Name',   // Anzeigename
        type: 'level',              // 'level' oder 'boolean'
        maxLevel: 20                // Nur bei type: 'level'
      },
    ]
  },
  {
    id: 'creation',
    name: 'Creation Gem',
    nodes: [
      // ... existing nodes
      { 
        id: 'anotherUpgrade',
        name: 'Another Upgrade',
        type: 'level',
        maxLevel: 50,
        minGemLevel: 4              // Optional: Unlock-Bedingung
      },
    ]
  }
]
```

### Schritt 2: Parameter in Hunter-Datei hinzufügen

```javascript
// src/constants/borge.js

export const EVAL_PARAMS = [
  // ... existing parameters
  "upgrades.gems_nodes.attraction_newUpgrade",    // attraction_[nodeId]
  "upgrades.gems_nodes.creation_anotherUpgrade",  // creation_[nodeId]
];
```

### Schritt 3: Mapping in `useBuildEvaluation.js` erweitern

```javascript
// src/composables/useBuildEvaluation.js

const upgradeMapping = {
  // ... existing mappings
  'new-upgrade-store-id': 'attraction_newUpgrade',      // Store ID → EVAL_PARAMS Format
  'another-upgrade-id': 'creation_anotherUpgrade',
};
```

**Hinweis:** Die Store-ID ist oft anders als die Node-ID. Prüfe in den Gem-Planner Konstanten!

### Schritt 4: Override-Modal Mapping erweitern (falls nötig)

```javascript
// src/components/common/OverrideModal.vue

const propertyToNodeMap = {
  // ... existing mappings
  'newUpgrade': 'newUpgrade',           // Nur wenn anders benannt
  'anotherUpgrade': 'anotherUpgrade',
};
```

---

## Debugging & Verification

### Teste das neue Upgrade:

1. **Gem-Planner öffnen** (`/upgrades/gems`)
   - Neues Upgrade sollte sichtbar sein
   - Wert ändern können

2. **Build-Evaluierung testen** (`/borge` etc.)
   - Gem-Werte ändern
   - Build neu evaluieren
   - Konsole prüfen auf Fehler

3. **Override-Modal testen**
   - Build-Overrides öffnen
   - Neues Upgrade sollte mit korrektem Namen und MaxLevel erscheinen

### Debug-Logs:

```javascript
// Konsole checken für:
console.log('💎 GEM CHANGE DETECTED - TRIGGERING EVALUATION');
console.log('🔧 [OverrideModal] Gem data converted for modal display');
```

---

## Spezielle Fälle

### Gem-Level Parameter:
```javascript
// Automatisch verfügbar für alle Gems:
"upgrades.gems_nodes.attraction_level",  // Gem Level
"upgrades.gems_nodes.creation_level",
```

### Gem-Nodes (Boolean):
```javascript
// Automatisch für Node #1, #2, #3:
"upgrades.gems_nodes.attraction_gem1",   // Boolean Nodes
"upgrades.gems_nodes.attraction_gem2",
"upgrades.gems_nodes.creation_gem1",
```

### Bestehende Gem-Upgrades:
```javascript
// Bereits implementiert:
"upgrades.gems_nodes.attraction_lootBorge",    // max: 50
"upgrades.gems_nodes.attraction_lootOzzy",     // max: 50  
"upgrades.gems_nodes.attraction_catchUp",      // max: 5
"upgrades.gems_nodes.creation_borgeGU",        // max: 50
"upgrades.gems_nodes.creation_ozzyGU",         // max: 50
"upgrades.gems_nodes.creation_knoxGU",         // max: 50
```

---

## Häufige Fehler

### ❌ Override-Modal zeigt falsche MaxLevel:
**Problem:** MaxLevel wird nicht aus `upgrades.js` gelesen  
**Lösung:** Prüfe ob Node-ID korrekt in `gem.nodes` definiert ist

### ❌ Gem-Upgrade funktioniert nicht in Evaluierung:
**Problem:** Mapping fehlt oder ist falsch  
**Lösung:** Prüfe `upgradeMapping` in `useBuildEvaluation.js`

### ❌ Parameter nicht gefunden:
**Problem:** EVAL_PARAMS fehlt oder falscher Format  
**Lösung:** Format: `"upgrades.gems_nodes.gemType_nodeId"`

### ❌ Store-ID vs Node-ID Konflikt:
**Problem:** Gem-Planner verwendet andere IDs als Override-Modal  
**Lösung:** Prüfe Gem-Planner Konstanten für korrekte Store-IDs

---

## Zusammenfassung

| Upgrade-Typ | Dateien | Aufwand | Bemerkung |
|-------------|---------|---------|-----------|
| **Relics** | 2 | ✅ Einfach | Wie vorher |
| **Gadgets** | 2 | ✅ Einfach | Wie vorher |
| **Inscryptions** | 2 | ✅ Einfach | Wie vorher |
| **Gem-Upgrades** | 4 | ⚠️ Komplex | Neue Kategorie |

**Das System ist NICHT komplizierter geworden** - es gibt nur eine zusätzliche Kategorie (Gems) die mehr Aufwand erfordert. Die meisten neuen Upgrades im Spiel sind normale Relics/Gadgets/Inscryptions.

---

## Kontakt

Bei Fragen oder Problemen mit der Integration neuer Upgrades, prüfe die Konsole auf Debug-Logs oder erstelle ein Issue.
