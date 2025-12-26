# TR Planner Code Analysis

## Dokumentation für Rewrite - Stand: 26. Dezember 2025

---

## 🎯 NEUES UI-KONZEPT (Mission Planner Style)

### Layout-Struktur (Desktop)
```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER                                  │
│  TR Planner | Summary Bar (Orb Multi, Frag Multi, etc.)        │
├──────────────────────────┬──────────────────────────────────────┤
│                          │                                      │
│   LINKS: MODIFIER PANEL  │   RECHTS: PLÄNE                     │
│                          │                                      │
│   Tabs:                  │   - Plan-Dropdown (wie Profiles)    │
│   • Gems & Nodes         │   - Plan erstellen/bearbeiten       │
│   • Permanent Boosts     │   - Multi-TR Steps                  │
│   • Temporary Boosts     │   - Orb/Frag Berechnung (integriert)│
│   • Researches           │   - Import/Export                   │
│   • Loop Mods            │                                      │
│   • Settings             │                                      │
│                          │                                      │
└──────────────────────────┴──────────────────────────────────────┘
```

**Wichtige Design-Entscheidungen:**
- **Kein separater Orb Calculator** - Berechnung ist in den Plänen integriert
- **Pläne statt Plan-Karten** - Wie Profiles im Mission Planner (Dropdown)
- **Gem-Daten aus gemPlannerStore** - Keine Kopien, direkte Referenz
- **Gem Overrides** - Separates Modal für Plan-spezifische Gem-Änderungen

### Layout-Struktur (Mobile)
```
┌─────────────────────────────┐
│         HEADER              │
├─────────────────────────────┤
│   Tab Navigation (scroll)   │
│ [Modifiers][Plans][Calc]    │
├─────────────────────────────┤
│                             │
│   Tab Content               │
│   (je nach aktivem Tab)     │
│                             │
└─────────────────────────────┘
```

### Tab-Struktur für Modifiers (links)
1. **Gems & Nodes** - Gem Levels und aktive Nodes auswählen
2. **Permanent Boosts** - Boosts die TR überleben (Relics, Inscryptions, etc.)
3. **Temporary Boosts** - Boosts die bei TR zurückgesetzt werden
4. **Researches** - Research Levels
5. **Loop Mods** - Loop Mod Konfiguration
6. **Settings** - TR Count, All-Time Orbs, etc.

### Komponenten-Struktur (geplant)
```
src/views/tools/tr-planner/          # Neuer Ordner (ersetzt später alten)
├── TRPlanner.vue                    # Hauptansicht (wie MissionPlanner.vue)
├── components/
│   ├── ModifiersPanel.vue           # Linke Seite - Modifier Eingaben (Tabs)
│   ├── ModifiersPanelMobile.vue     # Mobile Version
│   ├── tabs/
│   │   ├── GemsTab.vue              # Gem & Node Auswahl
│   │   ├── PermanentBoostsTab.vue   # Permanente Boosts (Relics, etc.)
│   │   ├── TemporaryBoostsTab.vue   # Temporäre Boosts
│   │   ├── ResearchesTab.vue        # Research Auswahl
│   │   ├── LoopModsTab.vue          # Loop Mod Konfiguration
│   │   └── SettingsTab.vue          # TR Count, All-Time Orbs, etc.
│   ├── PlansPanel.vue               # Rechte Seite - Plan Management + Calc
│   ├── PlanSelector.vue             # Dropdown für Pläne (wie ProfileSelector)
│   ├── PlanSteps.vue                # Multi-TR Step Liste
│   ├── PlanResults.vue              # Orb/Frag Berechnungsergebnisse
│   ├── GemOverrideModal.vue         # Modal für Plan-spezifische Gem Overrides
│   ├── SummaryBar.vue               # Header Summary (Desktop)
│   └── SummaryBarMobile.vue         # Mobile Summary
├── composables/
│   ├── useOrbCalculations.js        # Orb/Frag Multiplikator Berechnungen
│   ├── usePlanManagement.js         # Plan CRUD Operationen
│   └── useBoostData.js              # Boost Definitionen & Filtering
└── constants/
    ├── boosts.js                    # Boost Definitionen (aus altem index.js)
    ├── categories.js                # Kategorie Definitionen
    └── formulas.js                  # Berechnungsformeln
```

### Store-Struktur (geplant)
```javascript
// src/store/trPlannerStore.js (neuer, sauberer Store)
{
  // User Modifiers (globale Einstellungen)
  modifiers: {
    gems: { gemId: { level: number, nodes: boolean[] } },
    boosts: { boostKey: value },
    researches: { researchId: level },
    loopMods: { loopModId: level },
    settings: {
      trCount: number,
      allTimeOrbs: number,
      hoursInTR: number
    }
  },
  
  // Gespeicherte Pläne
  plans: [{
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    steps: [{
      // Pro TR Step
      targetBoosts: [...],
      hoursInTR: number,
      notes: string
    }],
    // Plan-spezifische Overrides
    overrides: {
      gems: {},
      boosts: {}
    }
  }],
  
  // UI State
  ui: {
    activeTab: string,
    selectedPlan: string | null,
    isEditing: boolean
  }
}
```

### Berechnungs-Flow
```
User ändert Modifier
        ↓
Store Update (reaktiv)
        ↓
Composable berechnet neu (useOrbCalculations)
        ↓
OrbCalculator.vue zeigt Live-Ergebnisse
        ↓
PlansPanel kann Snapshot speichern
```

### Wichtige Prinzipien
1. **Single Source of Truth**: Nur Store, keine Window-Globals
2. **Reaktivität nutzen**: Keine manuellen JSON.parse/stringify Kopien
3. **Gem-Daten aus gemPlannerStore**: Direkt referenzieren, nicht kopieren
4. **Kleine Komponenten**: Max 300-500 Zeilen pro Vue-Datei
5. **Composables für Logik**: Berechnungen auslagern

---

## ⚠️ BEKANNTE BUGS & KRITISCHE PROBLEME (ALTER TR PLANNER)

### 1. Gem Management - Legacy vs. Neu
- **Problem**: Altes Gem-System wurde durch neues ersetzt, aber über Umwege/Workarounds verbunden
- **Symptom**: Gem-Daten werden mehrfach konvertiert und synchronisiert
- **Auswirkung**: Unzuverlässige Gem-Daten in Berechnungen

### 2. Maxed Boosts Modal - Namenskonflikt
- **Problem**: Variable mit ähnlichem Namen überschreibt/kollidiert mit anderen
- **Symptom**: Maxed Boosts werden manchmal nicht korrekt gespeichert/geladen
- **Vermutung**: `maxedBoosts` vs `maxedBoostsOverrides` vs ähnliche Namen

### 3. Gem Overrides - Funktioniert nicht
- **Problem**: Plan-spezifische Gem Level Overrides werden nicht korrekt angewendet
- **Symptom**: Überschriebene Gem-Levels werden in Berechnungen ignoriert

### 4. Maxed Boosts Overrides - Funktioniert nicht
- **Problem**: Plan-spezifische Maxed Boosts Overrides werden nicht korrekt angewendet
- **Symptom**: Override-Einstellungen haben keinen Effekt auf Berechnungen

### 5. Share Code - Funktioniert nicht
- **Problem**: Export/Import von Plänen fehlerhaft
- **Symptom**: Geteilte Pläne können nicht korrekt importiert werden oder haben falsche Werte

### 6. Gem Boosts Hardcoded
- **Problem**: Gem-abhängige Boosts sind fest im Code eingebaut mit `unlock: 'gemName', unlock_level: X`
- **Gewünscht**: Dynamisches System wo Gem-Boosts nur erscheinen wenn das Gem aktiv ist
- **Neues Konzept**:
  1. User wählt Gems (global oder per Override)
  2. Modal zeigt nur Boosts für aktive Gems an
  3. User wählt explizit welche Gem-Boosts er nutzen will
  4. Erst dann werden die Boosts in Berechnungen angewendet

---

## 🎯 ENTSCHEIDUNG: KOMPLETTER REWRITE

Der TR Planner wird **komplett neu geschrieben** aufgrund der Anzahl und Schwere der Probleme.

### Migration Strategy
1. **Neuer Ordner**: `src/views/tools/tr-planner/` wird komplett neu aufgebaut
2. **Alter TR Planner**: Wird in `tr-planner-old/` umbenannt während Entwicklung
3. **Kein "v2" Suffix**: Neuer Planner heißt einfach "TR Planner"
4. **Nach Fertigstellung**: Alter Planner wird manuell gelöscht

### Neue Dateien (geplant)
```
src/
├── views/tools/
│   ├── tr-planner-old/                # Alt - temporär umbenannt
│   │   └── ...
│   └── tr-planner/                    # Neu - wie Mission Planner
│       ├── TRPlanner.vue              # Hauptansicht
│       └── components/                # Alle Komponenten (siehe oben)
├── store/
│   ├── orbStore.js                    # Alt - bleibt bis Migration
│   └── trPlannerStore.js              # Neu - sauberer Store
```

---

## 📁 Dateistruktur

### Hauptdateien
| Datei | Zeilen | Zweck |
|-------|--------|-------|
| `TRPlanner.vue` | 831 | Hauptansicht, Modal-Orchestrierung, Plan Grid |
| `orbStore.js` | 659 | Pinia Store für alle TR Planner Daten |
| `constants/tr-planner/index.js` | 1546 | Boost-Definitionen, Multiplier-Formeln, Research Data |
| `constants/tr-planner/gems.js` | ? | Gem-Daten und Konfiguration |

### Modale (17 Stück!)
| Modal | Zweck |
|-------|-------|
| `TRPlanModal.vue` | **3751 Zeilen!** Hauptmodal für Plan-Erstellung/Bearbeitung |
| `TRPlanDetailModal.vue` | Plan-Details anzeigen |
| `TRPlanCard.vue` | Planvorschau-Karten im Grid |
| `TRPlanImportModal.vue` | Import von Plänen |
| `TRPlanShareModal.vue` | Export/Teilen von Plänen |
| `TRPlanImportExportModal.vue` | Kombiniertes Import/Export |
| `TRResultsSidePanel.vue` | Live-Ergebnisse Sidebar |
| `StatsInputModal.vue` | "Maxed Boosts" Eingabe |
| `OrbCalculatorModal.vue` | Orb Calculator Tool |
| `GemOverrideModal.vue` | Gem Level Overrides pro Plan |
| `GemOverviewModal.vue` | Gem Übersicht |
| `GemWelcomeModal.vue` | Willkommens-Modal für neue User |
| `MaxedBoostsOverrideModal.vue` | Maxed Boosts Override |
| `BoostOverviewModal.vue` | Boost Übersicht |
| `ShortsGuideModal.vue` | Anleitung |
| `TRUpdateModal.vue` | Update-Hinweise |
| `ResearchMultiSelect.vue` | Research Auswahl |

---

## 🔴 Probleme & Spaghetti-Code

### 1. TRPlanModal.vue - Das Monster (3751 Zeilen!)
- **Problem**: Eine einzige Vue-Datei mit fast 4000 Zeilen
- **Enthält**: 
  - TR Step Management
  - Boost-Auswahl und -Konfiguration
  - Orb/Frag Berechnungen
  - Copy/Paste Logik
  - Import/Export Handling
  - Gem Override Logic
  - Validierung
  - UI für alles
- **Sollte aufgeteilt werden in**:
  - Composable für Berechnungen
  - Composable für Plan-State
  - Kleinere UI-Komponenten
  - Separate Step-Komponente

### 2. Gem Data Synchronisation - Chaos
```javascript
// In index.js - globaler window Context Hack
if (typeof window !== 'undefined' && window.__PLAN_CONTEXT__ && window.__PLAN_CONTEXT__.gemData) {
  gemData = window.__PLAN_CONTEXT__.gemData;
}
```
- **Problem**: Gem-Daten werden über globale Window-Variable geteilt
- **Doppelte Speicherung**: localStorage UND gemPlannerStore
- **Sync-Funktionen**: `ensureGemDataSync()` als Workaround
- **Konvertierungen**: `convertFromGemPlannerStore()` zwischen Formaten

### 3. Store Naming & Organisation
- **`orbStore.js`** heißt so, exportiert aber `useTRPlannerStore`
- **Gemischte Verantwortlichkeiten**:
  - User Stats
  - Planner Config
  - Shorts (nicht mehr genutzt?)
  - TR Plans
  - Copy/Paste State
  - Orb Calculator State
  - UI Settings
  - Import Contexts

### 4. Doppelte State-Verwaltung
```javascript
// In TRPlanner.vue
const filteredPlans = ref([]);

// Manuelles Kopieren vom Store
function updatePlans() {
  const freshPlans = JSON.parse(JSON.stringify(trPlannerStore.trPlans));
  filteredPlans.value = freshPlans; 
}
```
- Plans werden JSON-kopiert statt reaktiv genutzt
- Force-Update Counter als Hack für Reaktivität

### 5. Inkonsistente Boost-Definitionen
```javascript
// Verschiedene Multiplier-Signaturen
multiplier: (value) => Math.pow(1.1, value),
multiplier: (value, allValues) => { ... },
multiplier: 1.25, // Statischer Wert

// Verschiedene Typen
type: 'number',
type: 'boolean',

// Optionale Properties
orbcalc: true/false,
fragmulti: ...,
permanent: true/false,
unlock: 'temporal',
unlock_level: 3,
```

### 6. Magic Numbers & Hardcoded Values
```javascript
// In TRPlanModal
setTimeout(() => { ... }, 200);

// In index.js
const hoursExponent = Math.min(2.42, 1.02 + hoursInTR * 0.00256);
```

### 7. Verwirrende Datenflüsse
```
User Gem Planner → gemPlannerStore → localStorage (gemData)
                                   ↓
                            ensureGemDataSync()
                                   ↓
                            localStorage (trplanner_userstats.gemData)
                                   ↓
                            Plan Context / window.__PLAN_CONTEXT__
```

---

## 📊 Datenmodelle

### Plan Model (aktuell)
```javascript
{
  id: 'trplan_timestamp_random',
  name: string,
  createdAt: ISO string,
  updatedAt: ISO string,
  
  // TR Configuration
  trStartDate: string,
  trStartTime: string,
  trCount: number,
  allTimeOrbs: number,
  
  // Steps (Multi-TR)
  trSteps: [{
    stats: { boostKey: value },
    targetBoosts: [{ key, type, targetLevel/targetState }],
    hoursInTR: number,
    // ... mehr
  }],
  
  // Overrides
  gemOverrides: { gemKey: level },
  maxedBoostsOverrides: { boostKey: boolean },
  
  // Import Status
  isImported: boolean,
  importedGemContext: object,
  
  // Progress
  progress: { completed: boolean, lastUpdated: string }
}
```

### Boost Model
```javascript
{
  id: number,              // Unique ID für Export
  key: string,             // Identifier
  label: string,           // Display name
  category: string,        // Kategorie-ID
  type: 'number' | 'boolean',
  
  // Multiplier
  orbcalc: boolean,        // Ob in Orb-Berechnung
  multiplier: number | function,
  fragmulti: number | function,
  
  // Constraints
  max: number,
  getMax: function,        // Dynamisches Max
  minRequirement: { boost: string, level: number },
  
  // Unlock
  unlock: string,          // Gem Name
  unlock_level: number,    // Benötigtes Gem Level
  
  // Flags
  permanent: boolean,      // Überlebt TR
  
  // UI
  tooltip: string | function,
  normalControl: number,
  fastControl: number,
}
```

### User Stats (im Store)
```javascript
{
  allTimeOrbs: number,
  trCount: number,
  
  // Alle Boost-Keys dynamisch
  [boostKey]: number | boolean,
  
  // Gem Data (redundant)
  gemData: {
    levels: { gemKey: level },
    activeNodes: { gemKey: [nodeIndices] },
    upgrades: { gemKey: { upgradeKey: boolean } }
  }
}
```

---

## 🧮 Berechnungslogik

### Orb Multiplier
```javascript
// Alle Boosts mit orbcalc: true werden multipliziert
totalOrbMultiplier = allBoosts
  .filter(b => b.orbcalc)
  .reduce((mult, boost) => {
    const value = userStats[boost.key];
    return mult * boost.multiplier(value, userStats);
  }, 1);
```

### Fragment Multiplier
```javascript
// Alle Boosts mit fragmulti werden multipliziert
totalFragMultiplier = allBoosts
  .filter(b => b.fragmulti)
  .reduce((mult, boost) => {
    const value = userStats[boost.key];
    return mult * boost.fragmulti(value, userStats);
  }, 1);
```

### Komplexe Formeln (Beispiele)
```javascript
// Hours in TR
const hoursExponent = Math.min(2.42, 1.02 + hoursInTR * 0.00256);
const loopModsExponent = Math.min(2.42, 1.02 + loopMods * 0.00005);
return Math.pow(1 + Math.pow(hoursInTR, hoursExponent) * Math.pow(loopMods, loopModsExponent), 0.06);

// Research Multiplier
// Abhängig von Innovation Gem Level
// Prüft welche Researches verfügbar sind
// Iteriert über Price-Thresholds
```

---

## 🔧 Was funktioniert gut

1. **Boost ID System** - Stabile IDs für Import/Export
2. **Category Organisation** - Boosts sind gut kategorisiert
3. **Draggable Grid** - Plan-Sortierung funktioniert
4. **Multiplier Validation** - Development Warnings für doppelte IDs

---

## 📝 Vorschläge für Rewrite

### 1. Store Aufteilung
```
stores/
├── trPlannerStore.js       # Nur TR Plans
├── trBoostsStore.js        # User Stats & Boosts
├── trCalculationsStore.js  # Berechnungsergebnisse (computed)
└── trUIStore.js            # UI State (Modals, Panels)
```

### 2. Composables extrahieren
```
composables/
├── useTRCalculations.js    # Orb/Frag Multiplier Berechnungen
├── useTRPlanBuilder.js     # Plan erstellen/bearbeiten
├── useTRSteps.js           # Multi-TR Step Management
├── useTRImportExport.js    # Import/Export Logik
└── useBoostValidation.js   # Boost Constraints prüfen
```

### 3. TRPlanModal aufteilen
```
components/tr-planner/
├── plan-modal/
│   ├── TRPlanModal.vue          # Container
│   ├── PlanHeader.vue           # Name, Datum, Orbs
│   ├── PlanStepList.vue         # TR Steps
│   ├── PlanStepItem.vue         # Einzelner Step
│   ├── BoostCategorySection.vue # Boost Kategorie
│   ├── BoostInput.vue           # Einzelner Boost
│   └── PlanSummary.vue          # Ergebnis-Übersicht
```

### 4. Gem Data Flow vereinfachen
```
gemPlannerStore → Single Source of Truth
                ↓
         Getter für TR Planner
                ↓
         Plan Context als Parameter (nicht global)
```

### 5. TypeScript Migration
- Boost Typen definieren
- Plan Typen definieren
- Strikte Typisierung für Multiplier-Funktionen

### 6. Berechnungen in WASM?
- Komplexe Formeln in AssemblyScript
- Performanter für große Pläne
- Konsistent mit Build Evaluation

---

## 🎯 Prioritäten für Rewrite

### Must Have
1. TRPlanModal.vue aufteilen
2. Gem Data Flow vereinfachen
3. Store umbenennen (orbStore → trPlannerStore)
4. Redundante State-Kopien entfernen

### Should Have
1. Composables extrahieren
2. TypeScript Typen
3. Shorts-Feature entfernen (falls ungenutzt)
4. Magic Numbers als Konstanten

### Nice to Have
1. WASM für Berechnungen
2. Bessere Tests
3. Dokumentation der Formeln
4. Performance Optimierung

---

## 📋 Feature Checkliste (aktuell)

- [x] Plan erstellen/bearbeiten/löschen
- [x] Multi-TR Steps
- [x] Boost-Konfiguration nach Kategorien
- [x] Orb/Frag Multiplier Berechnung
- [x] Gem Level Overrides
- [x] Maxed Boosts Overrides
- [x] Plan Import/Export (Base58)
- [x] Plan Kopieren
- [x] Plan Teilen
- [x] Draggable Plan-Sortierung
- [x] Live Results Sidebar
- [x] Orb Calculator
- [x] Research System
- [x] Unlock Requirements (Gem Levels)
- [ ] Plan Progress Tracking (unvollständig)
- [ ] Shorts Feature (vermutlich deprecated)

---

## 🔗 Abhängigkeiten

### Interne
- `gemPlannerStore` - Gem Daten
- `hunterStore` - Nicht direkt genutzt
- `loopModCostUtils` - MP zu Loop Mod Level

### Externe
- `vuedraggable` - Plan Sortierung
- `@vueuse/core` - useStorage
- `@tabler/icons-vue` - Icons

---

*Dokumentation erstellt für Rewrite-Planung*
