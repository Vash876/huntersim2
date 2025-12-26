# 🏜️ Mirage Farmer - Game Design Document

> **Tagline:** *"Die Illusion ist nur so real wie der Glaube daran."*

---

## ⚠️ Wichtige Entwicklungsregeln

### Dokumentation als Single Source of Truth
**Diese .md Datei ist die zentrale Referenz für das gesamte Projekt.**

- Bei **jeder Code-Änderung**, die von dieser Dokumentation abweicht, **muss diese Datei aktualisiert werden**
- Neue Features → Hier dokumentieren
- Geänderte Formeln → Hier anpassen
- Entfernte Mechaniken → Hier streichen
- Die Dokumentation soll immer den aktuellen Stand des Spiels widerspiegeln

### Sprachen
- **Spiel (Code, UI, Texte):** Englisch 🇬🇧
- **Dokumentation (.md Datei):** Deutsch 🇩🇪

### Beispiele für Spiel-Texte (Englisch)
- Upgrade: "Sharper Eyes" (nicht "Schärfere Augen")
- Button: "Prestige" (nicht "Prestige durchführen")
- Ressource: "Mirages", "Belief", "Real Water"
- Events: "Sandstorm", "Heatwave", "Golden Mirage"

---

## 📋 Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Tech Stack](#tech-stack)
3. [Ressourcen-System](#ressourcen-system)
4. [Prestige-Layer Architektur](#prestige-layer-architektur)
5. [Layer 1: Oasis Essence](#layer-1-oasis-essence)
6. [Layer 2: Desert Dominion (Zukunft)](#layer-2-desert-dominion-zukunft)
7. [Layer 3: Reality Mastery (Zukunft)](#layer-3-reality-mastery-zukunft)
8. [Core Game Loop](#core-game-loop)
9. [Upgrade-Systeme](#upgrade-systeme)
10. [Wanderer-System](#wanderer-system)
11. [Events](#events)
12. [Visuelle Progression](#visuelle-progression)
13. [Balancing-Formeln](#balancing-formeln)
14. [Save System](#save-system)
15. [MVP Definition](#mvp-definition)
16. [Implementierungs-Roadmap](#implementierungs-roadmap)

---

## Übersicht

### Konzept

Du lebst in einer endlosen Wüste. Deine einzige Hoffnung: **Fata Morganas ernten** und sie irgendwie in echtes Wasser verwandeln. Je mehr Leute an deine Illusionen glauben, desto realer werden sie.

### Genre
- Incremental / Idle Game
- Browser-basiert (Vue 3 + Vite)
- Multi-Layer Prestige System

### Kernphilosophie
- **Glaube erschafft Realität** - Belief ist der Katalysator
- **Absurde Logik** - Die Spielmechaniken sind bewusst paradox
- **Visuelle Belohnung** - Die Wüste verwandelt sich in eine Oase
- **Depth through Layers** - Jeder Prestige-Layer fügt neue Dimensionen hinzu

---

## Tech Stack

### Empfohlen: Profectus Framework

```
Framework: Profectus (Vue 3 + Vite + TypeScript)
Big Numbers: break_eternity.js (bereits integriert)
State: Pinia (bereits integriert)
Styling: Tailwind CSS 4.1
```

### Profectus Vorteile
- ✅ break_eternity.js integriert (Zahlen bis 10^^10^^308)
- ✅ Save/Load System automatisch
- ✅ Offline Progress eingebaut
- ✅ Layer-System für Prestige
- ✅ Vue 3 Composition API
- ✅ Hot Module Replacement
- ✅ TypeScript Support

### Alternative: Custom Setup

```
Framework: Vue 3 + Vite
Big Numbers: break_eternity.js (manuell)
State: Pinia + useStorage (@vueuse/core)
Styling: Tailwind CSS
```

### Installation Profectus

```bash
git clone https://github.com/profectus-engine/Profectus.git mirage-farmer
cd mirage-farmer
npm install
npm run dev
```

---

## Ressourcen-System

### Primäre Ressourcen (Layer 0 - Basis)

| Ressource | Key | Symbol | Beschreibung | Erwerb |
|-----------|-----|--------|--------------|--------|
| **Mirages** | `mirages` | 🌀 | Rohe Illusionen von Wasser | Klicken, Auto-Spawn |
| **Belief** | `belief` | 🙏 | Glaube der Wanderer | Wanderer überzeugen |
| **Potential Water** | `potentialWater` | 💧 | Fast-echtes Wasser | Mirages × Belief |
| **Real Water** | `realWater` | 🌊 | Manifestiertes echtes Wasser | Potential Water konvertieren |

### Prestige-Währungen

| Layer | Ressource | Key | Symbol | Beschreibung |
|-------|-----------|-----|--------|--------------|
| 1 | **Oasis Essence** | `oasisEssence` | ✨ | Erste Prestige-Währung |
| 2 | **Desert Shards** | `desertShards` | 💎 | Zweite Prestige-Währung |
| 3 | **Reality Fragments** | `realityFragments` | 🔮 | Dritte Prestige-Währung |

### Ressourcen-Fluss Diagramm

```
LAYER 0 (Basis):
                                    
    🌀 Mirages ──────┐              
                     ├──→ 💧 Potential Water ──→ 🌊 Real Water
    🙏 Belief ───────┘                                  │
                                                        │
LAYER 1:                                                ↓
                                                 ✨ Oasis Essence
                                                        │
LAYER 2 (Zukunft):                                      ↓
                                                 💎 Desert Shards
                                                        │
LAYER 3 (Zukunft):                                      ↓
                                                 🔮 Reality Fragments
```

---

## Prestige-Layer Architektur

### Übersicht

Das Spiel verwendet ein Multi-Layer Prestige System. Jeder Layer:
- Resetet vorherige Layer (konfigurierbar)
- Gibt permanente Multiplier
- Schaltet neue Mechaniken frei
- Hat eigene Upgrade-Bäume

### Layer-Struktur

```typescript
interface PrestigeLayer {
  id: string;
  name: string;
  currency: Resource;
  unlockCondition: () => boolean;
  prestigeGain: () => Decimal;
  resetLayers: string[];  // Welche Layer werden zurückgesetzt
  multiplier: () => Decimal;  // Globaler Multiplier
  upgrades: Upgrade[];
  milestones: Milestone[];
}
```

### Reset-Kaskade

```
Layer 3 Reset → Layer 2 Reset → Layer 1 Reset → Layer 0 Reset
     │              │               │               │
     ↓              ↓               ↓               ↓
  Reality       Desert          Oasis           Mirages
  Fragments     Shards          Essence         Belief
                                                Potential Water
                                                Real Water
```

---

## Layer 1: Oasis Essence

> **Erste Implementierung - MVP Focus**

### Freischaltung
- **Bedingung:** 1,000 Real Water
- **UI:** "Prestige" Button erscheint

### Essence Berechnung

```javascript
// Formel für Oasis Essence Gewinn
function calculateOasisEssence(realWater) {
  if (realWater.lt(1000)) return new Decimal(0);
  return realWater.div(1000).sqrt().floor();
}

// Beispiele:
// 1,000 🌊 → 1 ✨
// 10,000 🌊 → 3 ✨
// 100,000 🌊 → 10 ✨
// 1,000,000 🌊 → 31 ✨
```

### Globaler Multiplier

```javascript
// Jede Essence gibt +10% auf ALLE Produktion
function getOasisMultiplier(oasisEssence) {
  return new Decimal(1).add(oasisEssence.times(0.1));
}

// Beispiele:
// 10 ✨ → 2x Multiplier
// 50 ✨ → 6x Multiplier
// 100 ✨ → 11x Multiplier
```

### Layer 1 Upgrades

| ID | Name | Kosten | Effekt | Beschreibung |
|----|------|--------|--------|--------------|
| `o1` | **Echter Brunnen** | 1 ✨ | Start mit 100 🌊 | "Ein echtes Fundament" |
| `o2` | **Oasen-Ruf** | 2 ✨ | +100% Wanderer Spawn | "Der Ruf verbreitet sich" |
| `o3` | **Palmen-Schatten** | 5 ✨ | +50% alle Produktion | "Schatten der Hoffnung" |
| `o4` | **Persistenter Glaube** | 10 ✨ | Belief bleibt bei Prestige (10%) | "Manche vergessen nie" |
| `o5` | **Ewige Quelle** | 25 ✨ | Offline 🌊 Progress | "Die Oase schläft nie" |
| `o6` | **Mirage Mastery** | 50 ✨ | Mirages ×2 Wert | "Meisterhafte Illusionen" |
| `o7` | **Kaskaden-Glaube** | 100 ✨ | Belief generiert Belief (+1%/s) | "Glaube breitet sich aus" |
| `o8` | **Realitäts-Verankerung** | 250 ✨ | 🌊 zerfällt nicht mehr | "Permanent manifestiert" |
| `o9` | **Oasen-Imperium** | 500 ✨ | Schalte Layer 2 Hinweis frei | "Es gibt mehr als eine Oase..." |
| `o10` | **Essenz-Synergy** | 1000 ✨ | ✨ Gain Formula verbessert | "Effizienz der Erleuchtung" |

### Layer 1 Milestones

| ✨ Benötigt | Effekt |
|-------------|--------|
| 1 | Automatischer Mirage-Sammler freigeschaltet |
| 5 | Wanderer kommen automatisch |
| 10 | 2x Belief von allen Quellen |
| 25 | Prestige behält 1% Real Water |
| 50 | Bulk-Buy für Upgrades |
| 100 | Neue Wanderer-Typen |
| 250 | Auto-Prestige Option |
| 500 | Layer 2 sichtbar |

---

## Layer 2: Desert Dominion (Zukunft)

> **Nicht im MVP - Spätere Erweiterung**

### Konzept
Du kontrollierst nicht mehr nur eine Oase, sondern ein **Netzwerk von Oasen**. Jede Oase ist wie ein eigener "Sub-Run".

### Freischaltung
- **Bedingung:** 500 Oasis Essence + Milestone
- **Reset:** Layer 0 + Layer 1

### Mechaniken (Geplant)
- Mehrere Oasen gleichzeitig verwalten
- Oasen handeln Ressourcen untereinander
- "Governor" System - NPCs verwalten Oasen
- Wüsten-Expansion Map

### Desert Shards Berechnung

```javascript
function calculateDesertShards(oasisEssence) {
  if (oasisEssence.lt(500)) return new Decimal(0);
  return oasisEssence.div(500).pow(0.5).floor();
}
```

---

## Layer 3: Reality Mastery (Zukunft)

> **Nicht im MVP - Endgame Content**

### Konzept
Du hast die Wüste gemeistert. Jetzt **kontrollierst du die Realität selbst**. Mirages und echtes Wasser sind für dich gleichwertig.

### Freischaltung
- **Bedingung:** 100 Desert Shards + Mega-Milestone
- **Reset:** Layer 0 + Layer 1 + Layer 2

### Mechaniken (Geplant)
- Mirages SIND echtes Wasser (Merger)
- Realitäts-Manipulation Events
- "God Mode" - Ändere Spielregeln
- Alternative Dimensionen (Parallelwelten)

---

## Core Game Loop

### Phase 1: Early Game (0-15 min)

```
Ziel: Erste Upgrades kaufen, System verstehen

1. Klicke auf Mirages (manuell)
2. Sammle genug für erstes Upgrade
3. Kaufe "Schärfere Augen" (+1 Mirage/Klick)
4. Wiederhole bis Auto-Sammler
```

**Key Milestones:**
- [ ] 10 Mirages - Erstes Upgrade
- [ ] 100 Mirages - Auto-Sammler
- [ ] 500 Mirages - Wanderer System freischalten

### Phase 2: Mid Game (15 min - 1h)

```
Ziel: Belief-System meistern, Potential Water generieren

1. Wanderer kommen automatisch
2. Überzeuge Wanderer für Belief
3. Mirages + Belief → Potential Water
4. Kaufe Manifestations-Upgrades
```

**Key Milestones:**
- [ ] 100 Belief - Conversion unlocked
- [ ] 1,000 Potential Water - Manifestation unlocked
- [ ] 100 Real Water - Prestige Button sichtbar

### Phase 3: Late Game (1h - 3h)

```
Ziel: Ersten Prestige vorbereiten und durchführen

1. Optimiere Real Water Produktion
2. Warte auf 1,000+ Real Water
3. Prestige für Oasis Essence
4. Kaufe Oasis Upgrades
5. Stärkerer Restart
```

**Key Milestones:**
- [ ] 1,000 Real Water - Erster Prestige möglich
- [ ] 10,000 Real Water - 3+ Essence
- [ ] 100,000 Real Water - 10+ Essence

### Phase 4: Post-Prestige Loop

```
Ziel: Essence akkumulieren, Milestone erreichen

1. Schnellerer Durchlauf durch Layer 0
2. Mehr Essence pro Run
3. Neue Upgrades kaufen
4. Milestones freischalten
5. Vorbereitung auf Layer 2
```

---

## Upgrade-Systeme

### Tier 0: Mirage Harvesting

| ID | Name | Basis-Kosten | Skalierung | Effekt |
|----|------|--------------|------------|--------|
| `m1` | Schärfere Augen | 10 🌀 | ×1.5 | +1 Mirage pro Klick |
| `m2` | Hitze-Meditation | 50 🌀 | ×2 | +100% Mirage Spawn Rate |
| `m3` | Mirage-Netz | 200 🌀 | ×2.5 | Auto-Sammler (+1 🌀/s) |
| `m4` | Illusionäre Linse | 1K 🌀 | ×3 | +10% Chance auf 10x Mirage |
| `m5` | Fata-Morgana-Magnet | 10K 🌀 | ×4 | +200% Auto-Sammler Speed |
| `m6` | Quantenbeobachter | 100K 🌀 | ×5 | Klick = Beobachtung = ×2 Spawn |

### Tier 1: Belief Generation

| ID | Name | Basis-Kosten | Skalierung | Effekt |
|----|------|--------------|------------|--------|
| `b1` | Überzeugende Gesten | 500 🌀 | ×2 | +100% Belief von Wanderern |
| `b2` | Werbeschild | 2K 🌀 | ×2.5 | +50% Wanderer Spawn Rate |
| `b3` | Motivationsrede | 10K 🌀 | ×3 | Wanderer bleiben 2x länger |
| `b4` | Religiöse Schriften | 50K 🌀 | ×4 | Belief wird bei Tod vererbt |
| `b5` | Kult der Oase | 500K 🌀 | ×5 | Gläubige rekrutieren (+10%/s) |
| `b6` | Massenhysterie | 5M 🌀 | ×10 | Belief ×2 exponentiell |

### Tier 2: Manifestation

| ID | Name | Basis-Kosten | Skalierung | Effekt |
|----|------|--------------|------------|--------|
| `p1` | Destillationskolben | 100 💧 | ×2 | +50% Potential Water Gain |
| `p2` | Glaubens-Katalysator | 1K 💧 | ×2.5 | Belief Effizienz +100% |
| `p3` | Realitäts-Anker | 10K 💧 | ×3 | Potential Water Decay -50% |
| `p4` | Manifestations-Kammer | 100K 💧 | ×4 | Auto-Konvertierung 💧→🌊 |
| `p5` | Illusionärer Reaktor | 1M 💧 | ×5 | 1% Chance auf ×100 Konvertierung |
| `p6` | Schrödingers Oase | 100M 💧 | ×10 | 💧 und 🌊 existieren gleichzeitig |

### Upgrade-Kauf Formel

```javascript
// Kosten für Level n
function getUpgradeCost(baseCost, scaling, level) {
  return new Decimal(baseCost).times(Decimal.pow(scaling, level));
}

// Beispiel: m1 auf Level 5
// 10 × 1.5^5 = 10 × 7.59 = 75.9 ≈ 76 Mirages
```

---

## Wanderer-System

### Wanderer-Typen

| Typ | Key | Spawn-Gewicht | Basis-Belief | Überzeugungszeit | Besonderheit |
|-----|-----|---------------|--------------|------------------|--------------|
| **Skeptiker** | `skeptic` | 50% | 1 🙏 | 10s | Gibt Bonus wenn überzeugt |
| **Hoffnungsvoller** | `hopeful` | 30% | 5 🙏 | 5s | Standard |
| **Verzweifelter** | `desperate` | 15% | 25 🙏 | 2s | Sofort überzeugt |
| **Pilger** | `pilgrim` | 4% | 100 🙏 | 15s | Bringt 2 weitere Wanderer |
| **Prophet** | `prophet` | 1% | 1000 🙏 | 30s | Permanenter +10% Belief Bonus |

### Wanderer-Spawn

```javascript
// Basis: 1 Wanderer alle 30 Sekunden
// Mit Upgrades: spawnInterval / (1 + upgradeBonus)

function spawnWanderer() {
  const weights = {
    skeptic: 50,
    hopeful: 30,
    desperate: 15,
    pilgrim: 4,
    prophet: 1
  };
  
  // Weighted random selection
  return weightedRandom(weights);
}
```

### Überzeugungs-Mechanik

```javascript
// Überzeugungs-Chance pro Sekunde
function getConversionChance(wandererType, upgrades) {
  const baseChance = {
    skeptic: 0.05,    // 5% pro Sekunde
    hopeful: 0.15,    // 15% pro Sekunde
    desperate: 0.50,  // 50% pro Sekunde
    pilgrim: 0.10,    // 10% pro Sekunde
    prophet: 0.03     // 3% pro Sekunde
  };
  
  return baseChance[wandererType] * (1 + upgrades.conviction);
}

// Bei Erfolg: Wanderer gibt Belief und bleibt (generiert weiter)
// Bei Timeout: Wanderer geht ohne Belief
```

### Wanderer UI State

```typescript
interface Wanderer {
  id: string;
  type: WandererType;
  timeRemaining: number;  // Sekunden bis er geht
  isConverted: boolean;
  believGeneratedTotal: Decimal;
}
```

---

## Events

### Zufällige Events

| Event | Key | Gewicht | Dauer | Effekt | Häufigkeit |
|-------|-----|---------|-------|--------|------------|
| 🌪️ **Sandsturm** | `sandstorm` | 20% | 30s | Mirages ×5, Wanderer -50% | Alle 3-5 min |
| ☀️ **Extreme Hitze** | `heatwave` | 20% | 60s | Mirages ×3, Wanderer -80% | Alle 3-5 min |
| 🌙 **Mondnacht** | `moonlight` | 20% | 120s | Potential Water +200% | Alle 3-5 min |
| 🐪 **Karawane** | `caravan` | 15% | instant | +10 Wanderer sofort | Alle 3-5 min |
| 💫 **Goldene Mirage** | `goldenMirage` | 10% | 10s | Klickbare Mirage = 1000x | Alle 3-5 min |
| 🌧️ **Wolke** | `cloud` | 5% | 10s | +1000 Real Water | Alle 10-15 min |

### Event-System

```javascript
// Event Timer
let eventCooldown = randomBetween(180, 300); // 3-5 Minuten

function checkForEvent(delta) {
  eventCooldown -= delta;
  
  if (eventCooldown <= 0) {
    triggerRandomEvent();
    eventCooldown = randomBetween(180, 300);
  }
}

function triggerRandomEvent() {
  const event = weightedRandom(eventWeights);
  activeEvent = event;
  eventTimer = event.duration;
}
```

---

## Visuelle Progression

### Hintergrund-Stages

| Real Water Total | Stage | Beschreibung | Elemente |
|------------------|-------|--------------|----------|
| 0 | `empty` | Endlose leere Wüste | Nur Sand, Hitzeflimmern |
| 100 | `sparse` | Erste Anzeichen | Einzelne Steine, Kakteen |
| 1,000 | `oasis_small` | Kleine Oase | Pfütze, 1 Palme |
| 10,000 | `oasis_medium` | Wachsende Oase | Kleiner Teich, 3 Palmen |
| 100,000 | `oasis_large` | Große Oase | See, Palmenhain, Gras |
| 1,000,000 | `paradise` | Paradies | Großer See, Dorf, Wald |
| 10,000,000+ | `ocean` | Rückkehr des Ozeans | Strand, Meer am Horizont |

### Prestige-Visuelle

Nach jedem Prestige:
- Oase startet größer (basierend auf Milestones)
- Permanente Dekorationen erscheinen
- Hintergrund-Farbtöne ändern sich

---

## Balancing-Formeln

### Mirage Production

```javascript
// Base Rate
const baseMirageRate = 1; // pro Sekunde

// Finale Rate
function getMirageRate() {
  const upgradeMulti = getUpgradeMultiplier('mirage');
  const prestigeMulti = getOasisMultiplier();
  const eventMulti = getEventMultiplier('mirage');
  
  return baseMirageRate
    .times(upgradeMulti)
    .times(prestigeMulti)
    .times(eventMulti);
}
```

### Potential Water Conversion

```javascript
// Potential Water = Mirages × Belief × Conversion Rate
function getPotentialWaterRate() {
  const mirages = resources.mirages.value;
  const belief = resources.belief.value;
  const conversionRate = 0.001; // Basis: 0.1%
  const upgradeBonus = getUpgradeMultiplier('conversion');
  
  return mirages
    .times(belief)
    .times(conversionRate)
    .times(upgradeBonus);
}
```

### Real Water Manifestation

```javascript
// Real Water = Potential Water × Manifestation Rate
function getRealWaterRate() {
  const potentialWater = resources.potentialWater.value;
  const manifestRate = 0.01; // Basis: 1%
  const upgradeBonus = getUpgradeMultiplier('manifest');
  
  return potentialWater
    .times(manifestRate)
    .times(upgradeBonus);
}
```

### Prestige Scaling

```javascript
// Zeit bis 1 Essence sollte ~30 min sein (erster Run)
// Zeit bis 10 Essence sollte ~15 min sein (nach erstem Prestige)
// Zeit bis 100 Essence sollte ~10 min sein (optimierter Run)

const FIRST_PRESTIGE_TARGET = 30 * 60; // 30 Minuten in Sekunden
const ESSENCE_SOFTCAP = 1000; // Danach logarithmische Skalierung
```

---

## Save System

### Auto-Save

```javascript
// Alle 30 Sekunden
const AUTO_SAVE_INTERVAL = 30000;

// Bei wichtigen Aktionen (Prestige, Upgrade-Kauf)
function onImportantAction() {
  saveGame();
}
```

### Save Data Struktur

```typescript
interface SaveData {
  version: number;
  lastSaved: number; // Timestamp für Offline Progress
  
  // Layer 0 Resources
  mirages: string; // Decimal als String
  belief: string;
  potentialWater: string;
  realWater: string;
  
  // Layer 1
  oasisEssence: string;
  oasisUpgrades: Record<string, number>;
  oasisMilestones: string[];
  
  // Layer 2 (Zukunft)
  desertShards: string;
  // ...
  
  // Upgrades
  upgrades: Record<string, number>; // upgradeId → level
  
  // Statistics
  totalMiragesCollected: string;
  totalPrestiges: number;
  playTime: number;
  
  // Settings
  settings: {
    notation: 'scientific' | 'engineering' | 'letters';
    theme: 'light' | 'dark';
    autoSave: boolean;
  };
}
```

### Offline Progress

```javascript
function calculateOfflineProgress(lastSaved, now) {
  const offlineSeconds = (now - lastSaved) / 1000;
  const maxOffline = 24 * 60 * 60; // Max 24 Stunden
  const effectiveOffline = Math.min(offlineSeconds, maxOffline);
  
  // Offline Effizienz: 50% der normalen Rate
  const offlineEfficiency = 0.5;
  
  return {
    mirages: getMirageRate().times(effectiveOffline).times(offlineEfficiency),
    belief: getBeliefRate().times(effectiveOffline).times(offlineEfficiency),
    // ... etc
  };
}
```

---

## MVP Definition

### Must Have (Version 0.1)

- [ ] **Mirages sammeln** (Klick + Auto)
- [ ] **3 Mirage Upgrades** (m1, m2, m3)
- [ ] **Belief System** (Wanderer kommen, geben Belief)
- [ ] **2 Belief Upgrades** (b1, b2)
- [ ] **Potential Water Conversion**
- [ ] **Real Water Manifestation**
- [ ] **1 Conversion Upgrade** (p1)
- [ ] **Prestige (Layer 1)** - Reset für Oasis Essence
- [ ] **3 Oasis Upgrades** (o1, o2, o3)
- [ ] **Save/Load**
- [ ] **Basic UI**

### Should Have (Version 0.2)

- [ ] Alle Tier 0 Upgrades (m1-m6, b1-b6, p1-p6)
- [ ] Alle Oasis Upgrades (o1-o10)
- [ ] Oasis Milestones
- [ ] Events System
- [ ] Visuelle Progression (Hintergründe)
- [ ] Offline Progress
- [ ] Number Formatting Optionen

### Nice to Have (Version 0.3+)

- [ ] Alle Wanderer-Typen
- [ ] Sound Effects
- [ ] Achievements
- [ ] Statistics Page
- [ ] Layer 2 Vorbereitung

---

## Implementierungs-Roadmap

### Sprint 1: Core Loop (1-2 Tage)

```
1. Projekt Setup (Profectus oder Custom)
2. Mirages Ressource + Klick Mechanik
3. Erstes Upgrade kaufen
4. Auto-Sammler
5. Basic UI Layout
```

### Sprint 2: Belief System (1-2 Tage)

```
1. Belief Ressource
2. Wanderer Spawn System
3. Überzeugung Mechanik
4. Belief Upgrades
5. Wanderer UI
```

### Sprint 3: Conversion Chain (1 Tag)

```
1. Potential Water Ressource
2. Mirages + Belief → Potential Water
3. Real Water Ressource
4. Potential Water → Real Water
5. Conversion Upgrades
```

### Sprint 4: Prestige Layer 1 (1-2 Tage)

```
1. Oasis Essence Ressource
2. Prestige Button + Confirmation
3. Reset Mechanik
4. Oasis Multiplier
5. Oasis Upgrades
6. Milestones
```

### Sprint 5: Polish (1-2 Tage)

```
1. Save/Load System
2. Offline Progress
3. Events
4. Visuelle Progression
5. Balancing Pass
6. Bug Fixes
```

---

## Code-Beispiele (Profectus)

### Resource Definition

```typescript
// src/features/resources.ts
import { createResource } from "features/resources/resource";
import Decimal from "lib/break_eternity";

export const mirages = createResource<Decimal>(new Decimal(0), "Mirages");
export const belief = createResource<Decimal>(new Decimal(0), "Belief");
export const potentialWater = createResource<Decimal>(new Decimal(0), "Potential Water");
export const realWater = createResource<Decimal>(new Decimal(0), "Real Water");
export const oasisEssence = createResource<Decimal>(new Decimal(0), "Oasis Essence");
```

### Upgrade Definition

```typescript
// src/features/upgrades.ts
import { createUpgrade } from "features/upgrades/upgrade";

export const sharpEyes = createUpgrade(() => ({
  display: {
    title: "Schärfere Augen",
    description: "+1 Mirage pro Klick"
  },
  cost: new Decimal(10),
  resource: mirages
}));
```

### Game Loop

```typescript
// src/game.ts
import { globalBus } from "game/events";

globalBus.on("update", (diff) => {
  // diff = Zeit seit letztem Update in Sekunden
  
  // Mirage Auto-Sammler
  if (hasUpgrade(mirageNet)) {
    mirages.value = mirages.value.add(getMirageRate().times(diff));
  }
  
  // Potential Water Conversion
  const pwGain = getPotentialWaterRate().times(diff);
  potentialWater.value = potentialWater.value.add(pwGain);
  
  // Real Water Manifestation  
  const rwGain = getRealWaterRate().times(diff);
  realWater.value = realWater.value.add(rwGain);
});
```

---

## Notizen & Ideen für später

### Potenzielle Features
- **Mirage Trading** - Tausche Mirages mit NPCs
- **Wetter-System** - Beeinflusst Spawn Rates
- **Achievements** - Langzeit-Ziele
- **Daily Challenges** - Tägliche Aufgaben
- **Leaderboards** - Wettbewerb (optional)

### Story Hooks
- Wer bist du? Woher kommst du?
- Was ist mit der alten Zivilisation passiert?
- Gibt es andere Oasen-Farmer?
- Was passiert wenn ALLES Wasser ist?

### Easter Eggs
- "Du hast 0 Belief. Niemand glaubt an dich... noch nicht."
- Prophet Wanderer haben eigene Namen
- Goldene Mirage ist ein Einhorn?

---

## Kontakt & Credits

- **Konzept:** [Dein Name]
- **Framework:** Profectus Engine
- **Inspiration:** Cookie Clicker, Antimatter Dimensions, The Prestige Tree

---

*Dieses Dokument ist ein Living Document und wird während der Entwicklung aktualisiert.*

**Version:** 1.0  
**Letzte Aktualisierung:** 18. Dezember 2025
