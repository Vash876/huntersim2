# Gem Planner - Complete Technical Documentation

## Overview
Das Gem Planner Tool ist ein komplexes System für die Planung und Optimierung von Gem-Investitionen in HunterSim2. Es basiert auf einem dualen Store-System und umfasst mehrere TR (Time Reset) Planungsmöglichkeiten.

## System Architecture

### 1. Dual Store System

#### gemPlannerStore.js (Legacy Store - LocalStorage)
- **Zweck**: Verwaltet aktuelle Gem-Daten und globale Einstellungen
- **Storage**: LocalStorage
- **Hauptfunktionen**:
  - Game Stats (ticks, loopMods, researchLevel, etc.)
  - Weights (cells, mp, shards, rp, ap, mats, orbs, etc.)
  - Gem States (level, nodes, upgrades)
  - Current Stats (availableOO)
  - TR Plan Integration

#### gemPlanningStore.js (New Store - IndexedDB)
- **Zweck**: Verwaltet gespeicherte Pläne und langfristige Planung
- **Storage**: IndexedDB mit eigener DB-Klasse (GemPlanningDB)
- **Hauptfunktionen**:
  - Orb Spending Plans
  - Gem Plans
  - Plan-spezifische Gem States
  - Active Plan Management

### 2. Component Structure

#### Main Components
1. **GemPlanner.vue** (Hauptansicht)
   - Zeigt Plan-Übersicht als draggable Cards
   - Modal-Management für alle Sub-Komponenten
   - Import/Export Funktionalität
   - Toast Notifications

2. **GemPlannerModal.vue** (Haupt-Planungsmodal)
   - TR Navigator (Multi-TR Planning)
   - Spending Mode (Manual/Auto)
   - Gem-spezifische Tabs
   - Efficiency Calculations
   - Budget Management
   - Integration mit useOrbOptimizer

3. **GemPlanCard.vue** (Plan-Karten)
   - Budget Overview
   - Plan-Metadaten
   - Action Buttons (Edit, Copy, Share, Delete)

4. **GemPlanDetailsModal.vue** (Plan-Details)
   - Readonly Plan-Ansicht
   - Gem Investment Übersicht
   - Budget Breakdown

5. **Supporting Modals**:
   - GameStatsModal.vue
   - WeightsModal.vue

### 3. Gem System Constants

#### Gem Structure (src/constants/gem-planner/)
Alle Gems folgen einem einheitlichen Schema:

```javascript
{
  id: 'gemId',
  name: 'Gem Name',
  maxLevel: number,
  color: { primary, secondary, gradient },
  qualityCosts: [{ level, cost }],
  gemNodes: [{ node, cost, unlockRequirement }],
  upgrades: [{
    id: 'upgradeId',
    name: 'Upgrade Name',
    weight: 'WeightType',
    baseCost: number,
    costMultiplier: number,
    maxLevel: number,
    unlock: number,
    costBumps: [{ startLevel, multiplier }],
    multiplier: { calculate: (level, gemLevel) => Decimal }
  }]
}
```

#### Available Gems
1. **Exodus** (Level 1-5, 6 nodes at L5, purple)
2. **Temporal** (Level 1-3, red)
3. **Innovation** (Level 1-3, yellow/orange)
4. **Power** (Level 1-3, green)
5. **Attraction** (Level 1-3, cyan)
6. **Creation** (Level 1-3, blue)
7. **Evolution** (Level 1-3, magenta)

### 4. Key Composables

#### useOrbOptimizer.js
- **Zweck**: Automatische Orb-Optimierung
- **Funktionen**:
  - optimizeGemPurchases()
  - calculateUpgradeEfficiency()
  - calculateGemLevelEfficiency()
  - resetAllUpgrades()
  - formatEfficiency() / formatValue()

#### useBuildEvaluation.js
- **Zweck**: Build-Evaluierung mit Gem-Integration
- **Features**:
  - Gem States → upgrades.gems_nodes Konvertierung
  - Cache-Integration mit evaluationCacheService
  - Worker-basierte Evaluation

### 5. Service Layer

#### evaluationCacheService.js
- **Zweck**: Caching von Build-Evaluierungen mit Gem-Berücksichtigung
- **Gem-spezifische Features**:
  - Gem-Parameter Extraktion aus EVAL_PARAMS
  - shouldUpdateOnGemChange() für Cache-Invalidierung
  - Konvertierung: gemStates → upgrades.gems_nodes Format

### 6. WASM Integration

#### AssemblyScript Evaluators
Die WASM-Module verwenden Gem-Parameter in verschiedenen Formaten:
- `evo_gem2`, `exodus_gem1`, `exodus_gem4`
- `tempGN4`, `evoGN3` (Gem Nodes)
- `inno_gem5`, `crea_gem4`, `crea_gem5`

Parameter werden vom JavaScript über die Worker-API übergeben.

## Data Flow

### 1. Gem State Management
```
User Input → GemPlannerModal → Store Updates → Cache Invalidation → Re-evaluation
```

### 2. Plan Management
```
Plan Creation → gemPlanningStore (IndexedDB) → Plan Cards → Details Modal
```

### 3. TR Planning
```
TR Navigator → TR-specific Gem States → Budget Tracking → Orb Spending
```

## Key Features

### 1. Multi-TR Planning
- Jeder Plan kann mehrere TRs enthalten
- TR-spezifische Gem States und Budgets
- Navigation zwischen TRs mit Prev/Next
- TR-spezifisches Orb Spending Tracking

### 2. Budget Management
- Budget pro TR
- Spent/Remaining Tracking
- Visual Progress Bars
- Budget Usage Percentage

### 3. Efficiency Calculations
- Value / Cost Ratio
- Configurable Efficiency Scaling (10^x)
- Real-time Updates
- Integration mit Game Stats und Weights

### 4. Spending Modes
- **Manual**: Benutzer kontrolliert alle Upgrades
- **Auto**: useOrbOptimizer übernimmt Optimierung

### 5. Import/Export
- JSON-basiert
- Kombiniert beide Stores
- Versioning Support
- Backward Compatibility

## Integration Points

### 1. TR Planner Integration
- activeTRPlanData für Context-sharing
- Gem Data Import aus TR Plans
- getContextualGemData() Function

### 2. Hunter Evaluation
- Gem States → upgrades.gems_nodes Mapping
- Cache-System Integration
- WASM Parameter Passing

### 3. Build System
- Gem Overrides in Build Data
- Real-time Evaluation Updates
- Cache Invalidation on Changes

## Performance Considerations

### 1. Caching
- Multi-level Cache (Memory, Store, LocalStorage)
- LRU Cache Management
- Gem-specific Cache Keys

### 2. IndexedDB
- Asynchrone Operations
- Structured Data Storage
- Plan-specific Queries

### 3. Worker Integration
- Non-blocking Evaluations
- Progress Reporting
- Parallel Processing

## Development Guidelines

### 1. Adding New Gems
1. Erstelle Gem-Konstante in `/constants/gem-planner/`
2. Füge zu index.js Export hinzu
3. Update WASM Evaluators wenn nötig
4. Teste Cache-Integration

### 2. Store Updates
- Verwende gemPlannerStore für aktuelle Daten
- Verwende gemPlanningStore für persistierte Pläne
- Achte auf Store-Synchronisation

### 3. UI Components
- Folge einheitlicher Modal-Architektur
- Verwende Tabler Icons
- Implementiere responsive Design
- Nutze Toast Notifications für Feedback

### 4. Performance
- Nutze computed Properties für reaktive Berechnungen
- Implementiere proper Watchers für Store Changes
- Cache teure Berechnungen
- Verwende nextTick für DOM Updates

## Error Handling

### 1. Store Operations
- Try-catch für alle async Operations
- Fallback zu Defaults bei Fehlern
- User-friendly Error Messages

### 2. Cache Operations
- Graceful Degradation bei Cache-Fehlern
- Multiple Fallback-Strategien
- Debug Logging

### 3. Import/Export
- Validation von Import-Daten
- Version Compatibility Checks
- Backup vor destructive Operations

## Testing Considerations

### 1. Unit Tests
- Store Methods
- Utility Functions
- Cache Logic

### 2. Integration Tests
- Store Synchronisation
- Modal Interactions
- Worker Communication

### 3. Performance Tests
- Cache Hit Rates
- IndexedDB Performance
- Large Dataset Handling

## Future Development

### 1. Planned Features
- Plan Sharing (URL-based)
- Advanced Optimization Algorithms
- Multi-dimensional Efficiency Metrics
- Plan Templates

### 2. Architecture Improvements
- Store Consolidation
- Enhanced Caching
- Real-time Collaboration
- Cloud Sync

## Debugging

### 1. Store Issues
- Check localStorage für gemPlanner_store
- Überprüfe IndexedDB für GemPlanningDB
- Console Logs in Store Methods

### 2. Cache Issues
- evaluationCacheService Debug Logs
- Memory Cache Inspection
- Cache Key Generation

### 3. Performance Issues
- Worker Performance Metrics
- Store Operation Timing
- Rendering Performance

## Code Examples

### Adding a new Gem Upgrade
```javascript
// In gem constant file
{
  id: 'new-upgrade',
  name: 'New Upgrade',
  weight: 'Cells',
  baseCost: 100,
  costMultiplier: 1.5,
  maxLevel: 999,
  unlock: 2,
  multiplier: {
    calculate: (level, gemLevel) => {
      return new Decimal(2).pow(level).mul(gemLevel + 1);
    }
  }
}
```

### Store Integration
```javascript
// Update gem level
gemPlannerStore.updateGemLevel('exodus', 3);

// Create new plan
const plan = await gemPlanningStore.createOrbSpendingPlan(
  'My Plan', null, 100000, 5
);
```

### Cache Integration
```javascript
// Check if re-evaluation needed
const needsUpdate = await EvaluationCacheService.shouldUpdateOnGemChange(
  hunterId, oldGemStates, newGemStates, hunterStore
);
```

Diese Dokumentation sollte als vollständige Referenz für die Arbeit am Gem Planner dienen und alle wichtigen Aspekte des Systems abdecken.