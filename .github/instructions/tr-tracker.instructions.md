---
applyTo: 'src/views/tools/TRTracking.vue,src/components/tr-tracking/**,src/store/trTrackingStore.js,src/services/indexedDBService.js'
---

# TR Tracker System Instructions

## System Overview
The TR (Traversal Reset) Tracker is a comprehensive progress tracking system for the CIFI idle game. It allows players to monitor their progress across multiple Traversal Resets with detailed resource tracking, goal setting, and data visualization.

## Architecture

### Core Components
- **TRTracking.vue** - Main view with track overview table and modal orchestration
- **trTrackingStore.js** - Pinia store with IndexedDB persistence for all TR tracking data
- **IndexedDBService.js** - Modern storage service with migration from localStorage
- **7 Modal Components** - Specialized UI components for different TR tracking functions

### Data Flow
```
User Input → Modal Components → Store Actions → IndexedDB Service → Database
Database → Store State → Computed Properties → UI Components → User Display
```

## Data Models

### Resource Model
```javascript
{
  id: string,           // Unique identifier (e.g., 'cells', 'mp', 'custom-resource-123')
  name: string,         // Display name shown in UI
  color: string,        // Hex color for UI elements and charts
  category: string,     // 'main', 'resources', 'zeus', 'camp', 'other', 'custom'
  format: string        // 'number', 'time', 'camp', 'text' - determines input/display formatting
}
```

### Track Model
```javascript
{
  id: string,           // Generated with generateId() from base58 utils
  name: string,         // User-defined track name
  trCount: number,      // TR number (1, 2, 3, etc.)
  startDate: string,    // ISO date string (YYYY-MM-DD)
  endDate: string,      // ISO date string (only when track is completed)
  isActive: boolean,    // true = currently tracking, false = completed
  entries: Entry[],     // Array of tracking entries (sorted by date desc)
  notes: string,        // Free-text notes for the track
  resourceOrder: string[], // Array of resource IDs defining column order
  initialValues: Object,   // Starting values when TR began
  targetGoals: Object,     // Target values to achieve
  createdAt: string,    // ISO timestamp
  updatedAt: string     // ISO timestamp (updated on any change)
}
```

### Entry Model
```javascript
{
  id: string,           // Generated with generateId()
  date: string,         // Entry date (YYYY-MM-DD format)
  values: Object,       // { resourceId: value } pairs for all tracked resources
  notes: string,        // Entry-specific notes
  createdAt: string     // ISO timestamp when entry was created
}
```

## Store Architecture (trTrackingStore.js)

### State Management
```javascript
{
  availableResources: Resource[],    // All available resources (default + custom)
  selectedResources: Resource[],     // Currently tracked resources
  trTracks: Track[],                 // All TR tracks
  isInitialized: boolean,            // Store initialization status
  useIndexedDB: boolean              // Storage mode flag
}
```

### Default Resources
- **Main**: hours-in-tr, oo-accum, lr-ticks, lr-count, loops-filled, loop-mods-purchased, attgn3-buff
- **Resources**: cells, mp, mp-accum, shards, rp, ap
- **Zeus**: blueprints, f1-1-difar, inno-cores, ulti-badge
- **Camp**: current-camp, camp-timer
- **Other**: notes

### Key Store Actions
- **Resource Management**: `updateSelectedResources()`, `addCustomResource()`, `removeCustomResource()`
- **Track CRUD**: `createTRTrack()`, `updateTRTrack()`, `deleteTRTrack()`, `completeTRTrack()`
- **Entry Management**: `addEntry()`, `updateEntry()`, `deleteEntry()`
- **Data Operations**: `importData()`, `exportData()`, `importTrackData()`
- **Settings**: `updateStandardResourceColor()`, `updateCustomResource()`

### Computed Properties
- `activeTracks` - Filters tracks where `isActive === true`
- `completedTracks` - Filters tracks where `isActive === false`

## Modal System

### 1. ResourceSettingsModal.vue
**Purpose**: Configure which resources to track
- Standard resource selection with color customization
- Custom resource creation, editing, and deletion
- Grid layout with EditableResource components
- Real-time validation and preview

### 2. NewTRModal.vue / Edit Mode
**Purpose**: Create new TR tracks or edit existing track settings
- Dual functionality: create mode vs edit mode controlled by `editMode` prop
- Basic information: TR count, name, dates, status
- Initial values: Starting resource values when TR began
- Target goals: Goal values to achieve during TR
- Form validation with multiple sections

### 3. TrackDetailsModal.vue
**Purpose**: Main track management interface
- **Entry Table**: Sortable table with all tracking entries
- **Add/Edit/Delete Entries**: Complete CRUD operations for entries
- **Live Statistics**: Duration, time in LR, AttGN3 calculations
- **Resource Management**: Draggable column reordering
- **Input Format Guide**: Expandable help section with format examples
- **Special Calculations**: Integration with AttGN3 calculator for live updates

### 4. ProgressModal.vue
**Purpose**: Data visualization and progress analysis
- Resource-based charts and trend analysis
- Progress calculations between entries
- Visual representation of resource growth over time

### 5. ShareTrackModal.vue / ImportModal.vue
**Purpose**: Track sharing between users
- **Export**: Generates Base64-encoded JSON track codes
- **Import**: Validates and imports track codes with full data
- **Data Integrity**: ID regeneration to prevent conflicts
- **Complete Transfer**: Includes all entries and metadata

### 6. MultiTRComparisonModal.vue
**Purpose**: Compare progress across multiple TR tracks
- Cross-track analysis and resource comparisons
- Requires minimum 2 tracks to function
- Resource-specific progress comparisons

### 7. AlertDialog.vue
**Purpose**: User confirmations and notifications
- Standard confirm/cancel pattern
- Used for destructive operations like track deletion

## IndexedDB Storage System

### Database Structure
```javascript
// Database: 'CIFI-Tools-DB' version 2
{
  'trTracker_tracks': {     // Track metadata (excluding entries)
    keyPath: 'id',
    indexes: ['isActive', 'createdAt']
  },
  'trTracker_settings': {   // User settings and preferences
    keyPath: 'key',         // 'selectedResources', 'customResources'
  },
  'trTracker_entries': {    // Track entries stored separately for performance
    keyPath: 'id',
    indexes: ['trackId', 'date']
  }
}
```

### Performance Optimizations
- **Separate Entry Storage**: Entries stored separately to avoid loading large data sets
- **Batch Operations**: Efficient bulk saves for multiple entries
- **Optimistic UI Updates**: UI updates immediately, DB saves in background
- **Migration System**: Automatic localStorage → IndexedDB migration

### Data Serialization
- All data is JSON.parse(JSON.stringify()) to remove Vue proxy objects
- Maintains data integrity across storage operations
- Handles complex nested objects and arrays

## UI/UX Patterns

### Design System
- **Color Scheme**: Green gradient theme (`from-green-900 to-gray-800`)
- **Modal Pattern**: Consistent backdrop, ESC handling, click-outside-to-close
- **Responsive Design**: Mobile-first with adaptive grid layouts
- **Loading States**: Proper loading indicators and skeleton states

### Table Functionality
- **Smart Sorting**: Active tracks first, then chronological by creation date
- **Action Buttons**: Hover states with icon-based actions
- **Click-to-Details**: Row clicks open TrackDetailsModal
- **Dynamic Columns**: `getHighestValueResources()` determines displayed columns
- **Status Indicators**: Visual badges for active/completed tracks

### Input System
- **Format Support**: 
  - Numbers: 1000, 1k, 2.5m, 1.2b, 500t
  - Time: "5 30" → "5:30", "12:45", "123 54" → "123:54"
  - Camp: "C1-5", "c3 8" → "C3-8"
  - Scientific: 1e6, 2.5e9 (AttGN3 only)
- **Auto-Conversion**: Intelligent input parsing and formatting
- **Real-time Validation**: Immediate feedback on input errors
- **Keyboard Navigation**: Tab/Shift+Tab, Enter to confirm

## Key Features

### Progress Tracking
```javascript
getTrackProgress(trackId, resourceId) {
  // Returns: { firstValue, lastValue, totalGain, dayCount, avgPerDay, values, dates }
  // Used for trend analysis and progress calculations
}
```

### Live Statistics
- **Track Duration**: Automatic calculation from start/end dates
- **Time in LR**: Live calculation based on LR Ticks and AttGN3 settings
- **AttGN3 Days to 1e333**: Integration with AttGN3 Calculator
- **Camp Timer**: Countdown integration with current camp status

### Resource Management
- **Default Resources**: Pre-configured common tracking resources
- **Custom Resources**: User-defined resources with full customization
- **Color Coding**: Consistent color themes across UI and charts
- **Category Organization**: Logical grouping of related resources

### Data Import/Export
- **Track Codes**: Base64-encoded JSON for easy sharing
- **Complete Data**: Includes all entries, settings, and metadata
- **Validation**: Robust error handling and data integrity checks
- **Backup/Restore**: Full data export/import for backup purposes

## Development Patterns

### Store Integration
```javascript
// Always use store actions for data modifications
trTrackingStore.addEntry(trackId, entryData);

// Use computed properties for reactive data
const activeTracks = computed(() => trTrackingStore.activeTracks);

// Handle async operations properly
await trTrackingStore.init(); // Ensure store is initialized
```

### Modal Communication
```javascript
// Event-based communication between modals and parent
function handleTrackUpdate(updateData) {
  const { action, trackId, entryId, entry } = updateData;
  switch (action) {
    case 'addEntry': /* handle */ break;
    case 'updateEntry': /* handle */ break;
    case 'deleteEntry': /* handle */ break;
    // ... other actions
  }
}
```

### Error Handling
```javascript
// Optimistic UI with error fallbacks
try {
  await trTrackingStore.saveData();
} catch (error) {
  console.error('Save failed:', error);
  // UI already updated, show error message but don't revert
}
```

## Extension Points

### Adding New Resource Types
1. Add to `DEFAULT_AVAILABLE_RESOURCES` in store
2. Update format handling in input components
3. Add category-specific styling if needed
4. Update validation logic for new formats

### New Chart Types
1. Extend ProgressModal.vue with new chart components
2. Add chart-specific data processing in store
3. Update getTrackProgress() if new calculations needed

### Additional Export Formats
1. Create new export functions in store
2. Add format selection to ShareTrackModal
3. Implement format-specific serialization

### Integration with Other Systems
- **Cloud Sync**: Extend with sync endpoints for cross-device data
- **Game Integration**: Auto-import from game data APIs
- **Advanced Analytics**: ML-based progress predictions

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Load entries only when needed
- **Virtual Scrolling**: For large entry lists
- **Debounced Saves**: Batch rapid user inputs
- **Computed Caching**: Expensive calculations cached automatically
- **IndexedDB Batching**: Group related operations

### Memory Management
- **Vue Proxy Removal**: Serialize data before storage
- **Event Cleanup**: Remove listeners in onUnmounted()
- **Large Data Handling**: Stream large imports/exports

## Testing Guidelines

### Critical Test Areas
- **Store Actions**: Verify all CRUD operations work correctly
- **Data Persistence**: Test IndexedDB save/load cycles
- **Import/Export**: Validate code generation and parsing
- **Modal Integration**: Test event flow between components
- **Input Validation**: Verify format parsing and validation

### Mock Patterns
```javascript
// Mock store for testing
const mockTRTrackingStore = {
  trTracks: [],
  addEntry: vi.fn(),
  updateEntry: vi.fn(),
  // ... other methods
};
```

## Security Considerations

### Data Validation
- **Input Sanitization**: All user inputs validated before storage
- **Import Validation**: Track codes validated for malicious content
- **Schema Validation**: Imported data checked against expected structure

### Privacy
- **Local Storage**: All data stored locally in IndexedDB
- **No Telemetry**: No automatic data transmission
- **User Control**: Complete user control over data export/sharing

## Common Issues and Solutions

### Store Initialization
```javascript
// Always check initialization before operations
if (!trTrackingStore.isInitialized) {
  await trTrackingStore.init();
}
```

### IndexedDB Errors
```javascript
// Handle IndexedDB unavailability gracefully
try {
  await idbService.init();
} catch (error) {
  // Fallback to localStorage or show error
}
```

### Large Data Sets
```javascript
// Use pagination for large entry lists
// Implement virtual scrolling for performance
// Consider data archiving for old tracks
```

## Migration Notes

### From localStorage to IndexedDB
- Automatic migration on first load
- Preserves all existing data
- Graceful fallback if migration fails
- User notification of migration status

### Future Data Migrations
- Version-based migration system
- Backward compatibility preservation
- Graceful handling of missing fields
- User data backup before migrations