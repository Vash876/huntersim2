---
applyTo: '**'
---

# HunterSim2 Project Instructions

## Project Overview
HunterSim2 is a Vue 3 + AssemblyScript incremental game simulator focused on hunter builds optimization. This is a comprehensive tools suite for the idle game "CIFI", providing advanced calculators, planners, and optimization tools for hunter characters.

## Technology Stack
- **Frontend**: Vue 3 + Composition API with `<script setup>`, Tailwind CSS 4.x
- **State Management**: Pinia stores with Vue 3 Composition API pattern, persistent storage via localStorage/IndexedDB
- **Performance Computing**: AssemblyScript/WASM for high-performance battle simulations and calculations
- **Build Tools**: Vite 6.x with custom plugins
- **UI Components**: Custom components with Tabler Icons Vue, Draggable support
- **Data Persistence**: Multi-layer approach - localStorage for settings, IndexedDB for complex data, optional cloud sync

## Architecture Patterns

### Store Architecture (Pinia)
- **Composition API Style**: All stores use `defineStore` with setup function syntax
- **Persistent State**: Critical data persisted with `useStorage` from @vueuse/core
- **Store Initialization**: Async initialization pattern in App.vue, selective initialization for performance
- **Key Stores**:
  - `hunterStore` - Build data, upgrades, hunter-specific settings
  - `syncStore` - Cloud synchronization and authentication
  - `gemPlannerStore` - Gem optimization data
  - `trTrackingStore` - Time Rewind tracking data
  - `orbStore` (trPlannerStore) - TR planning calculations
  - `ultimaStore` - Ultima calculator state

### Component Architecture
- **Modal Pattern**: Consistent modal implementation with backdrop, ESC handling, mobile-safe positioning
- **Composables**: Reusable logic in composables/ with `use` prefix
- **Build Cards**: Multiple view types (Vertical, Horizontal, Mobile) with draggable reordering
- **Tool Components**: Self-contained calculator components with internal state management

### WASM Integration
- **High-Performance Calculations**: All build evaluations run in AssemblyScript
- **Multiple Evaluators**: `evalBorge.ts`, `evalKnox.ts`, `evalOzzy.ts` for different hunters
- **Worker Integration**: Web Workers for non-blocking WASM execution
- **Caching**: Evaluation results cached with smart invalidation

## Code Style Guidelines

### Vue Components
- **Script Setup**: Always use `<script setup>` syntax
- **Reactivity**: Prefer `computed()` over `watch()`, use `ref()` for primitives, `reactive()` for objects
- **Props**: TypeScript-style prop definitions with validation
- **Events**: Explicit `defineEmits()` declarations
- **Component Naming**: PascalCase for files, kebab-case in templates
- **Lifecycle**: Use composition API lifecycle hooks (`onMounted`, `onUnmounted`)

### State Management Patterns
- **Store Updates**: Always update store AND local reactive state when needed
- **Hunter-Specific Data**: Store in `hunterStore` with hunter ID organization
- **Composables**: Extract reusable logic with `use` prefix
- **Temporary State**: Use local `ref()` for modal states, form data
- **Persistent Settings**: Use `useStorage()` for user preferences

### AssemblyScript Conventions
- **Type Safety**: Explicit typing, avoid `any` type
- **Performance**: Optimize for speed in battle simulations
- **Patterns**: Follow existing patterns in eval files
- **Enemy System**: Use Enemy class with proper scaling calculations
- **Timer System**: Event-driven timers for boss abilities and mechanics

### Styling Standards
- **Tailwind Only**: No custom CSS except for animations
- **Dark Theme**: Default dark theme with gray-800/900 bases
- **Responsive**: Mobile-first design with proper breakpoints
- **Hunter Colors**: 
  - **Borge**: Red theme (`red-600`, `from-red-900`)
  - **Ozzy**: Green theme (`green-600`, `from-green-900`)
  - **Knox**: Blue theme (`blue-600`, `from-blue-900`)
- **Component Spacing**: Consistent gap-2, gap-4 usage
- **Interactive States**: Hover effects with transition-colors

### File Organization
```
src/
├── components/          # Reusable Vue components
│   ├── common/         # Shared components (modals, controls)
│   ├── builds/         # Build management components
│   ├── tr-tracking/    # Time Rewind tracking components
│   ├── tr-planner/     # TR planning components
│   └── gem-planner/    # Gem optimization components
├── views/              # Page-level route components
│   ├── tools/         # Calculator and planner pages
│   └── upgrades/      # Upgrade management pages
├── composables/        # Reusable composition functions
├── constants/          # Static data and configurations
│   ├── gem-planner/   # Gem-related constants
│   ├── tr-planner/    # TR planning data
│   └── ts-planner/    # Trait sphere data
├── services/           # API and external services
├── store/              # Pinia stores
├── utils/              # Helper functions and utilities
├── workers/            # Web workers for heavy computations
└── assets/             # Static assets (images, icons)
```

## Domain-Specific Knowledge

### Hunter System
- **Borge**:
- **Ozzy**: 
- **Knox**: 
- **Build System**: Equipment + Upgrades + Temporary Overrides = Complete build configuration
- **Evaluation**: WASM-powered simulations determine loot/min, average stage, completion time

### Core Game Concepts
- **Traversal Reset (TR)**: Prestige system that resets progress for permanent bonuses
- **Gems**: Permanent upgrades purchased with Ouroboros Orbs (OO)
- **Loop Mods**: Temporary buffs that modify game mechanics
- **Stages**: Progressive difficulty levels (1-1000+) with scaling enemy stats
- **Builds**: Complete hunter configurations for optimization comparison
- **Overrides**: Temporary modifications to test "what-if" scenarios

### Calculation Systems
- **Build Evaluation**: Complete battle simulation determining optimal performance
- **Reference Builds**: First build in list serves as comparison baseline
- **Drag & Drop**: Reorder builds with persistence, automatic reference update
- **Live Simulation**: Real-time battle visualization with detailed statistics
- **Multi-Threading**: Heavy calculations run in Web Workers to prevent UI blocking

### Data Management
- **Import/Export**: Base58-encoded build sharing system
- **Cloud Sync**: Optional authentication with Neon database backend
- **Backup System**: Complete data export/import with JSON format
- **Versioning**: Automatic data migration for store structure changes

## Common Patterns

### Modal Implementation
```javascript
// Modal state management
const showModal = ref(false);
const isLoading = ref(false);

// Modal functions
function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  // Reset form data if needed
}

// ESC key handling
function handleKeydown(event) {
  if (event.key === 'Escape' && showModal.value) {
    closeModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
```

### Mobile Modal Styling
```vue
<!-- Template Structure -->
<div 
  v-if="isVisible" 
  class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
  @click.self="closeModal"
>
  <div 
    class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in border border-gray-700"
    @click.stop
  >
    <!-- Header -->
    <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
      <h2 class="text-lg font-bold text-white flex items-center">
        <Icon size="18" class="mr-2 text-primary-400" />
        Modal Title
      </h2>
      <button @click="closeModal" class="p-1.5 rounded-full hover:bg-gray-700 transition-colors">
        <IconX size="16" />
      </button>
    </div>

    <!-- Content -->
    <div class="p-3 sm:p-4 max-h-[75vh] overflow-y-auto">
      <!-- Modal content here -->
    </div>

    <!-- Footer -->
    <div class="flex justify-between pt-2 border-t border-gray-700 px-3 pb-3">
      <button class="text-gray-400 hover:text-white transition-colors">Action</button>
      <button @click="closeModal" class="px-3 py-1.5 bg-gray-600 rounded-md">Close</button>
    </div>
  </div>
</div>

<!-- Required Mobile CSS -->
<style scoped>
.mobile-modal-container {
  padding-bottom: 1rem;
}

@media (max-width: 768px) {
  .mobile-modal-container {
    padding-bottom: var(--mobile-safe-bottom, 70px);
    padding-top: 60px;
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
```

### Toast Notifications
```javascript
const toast = ref({ show: false, message: '', type: 'info' });

function showToastMessage(message, type = 'success', duration = 3000) {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

// Usage: showToastMessage('Build saved successfully', 'success');
```

### Store Integration
```javascript
// Store updates with local state sync
function updateBuildData(newData) {
  // Update store
  hunterStore.updateBuild(newData);
  
  // Update local reactive state
  localBuildData.value = { ...newData };
  
  // Show confirmation
  showToastMessage('Build updated successfully', 'success');
}
```

### WASM Evaluation Pattern
```javascript
import { wasmService } from '@/services/wasmService';

async function evaluateBuild(buildData) {
  try {
    isLoading.value = true;
    
    const results = await wasmService.evaluateBuild(
      buildData.hunter,
      buildData,
      iterations.value
    );
    
    // Process results
    evaluationResults.value = results;
    
  } catch (error) {
    console.error('Evaluation failed:', error);
    showToastMessage('Evaluation failed', 'error');
  } finally {
    isLoading.value = false;
  }
}
```

### Draggable Lists
```javascript
import Draggable from 'vuedraggable';

// Template
<Draggable 
  v-model="items"
  handle=".grip-handle"
  :animation="200"
  @end="onDragEnd"
>
  <template #item="{ element }">
    <div class="drag-item">
      <div class="grip-handle">⋮⋮</div>
      <!-- Item content -->
    </div>
  </template>
</Draggable>

// Script
function onDragEnd() {
  // Save new order to store
  hunterStore.saveItemOrder(items.value);
}
```

### Form Value Controls
```javascript
// Use ToolValueControls for numeric inputs
<ToolValueControls
  :value="currentValue"
  :minValue="0"
  :maxValue="999"
  :step="1"
  @update:value="updateValue"
/>

// For suffix notation (1K, 1M, etc.)
<SuffixInput
  :value="largeNumber"
  @update:value="updateLargeNumber"
/>
```

## Performance Guidelines

### Optimization Strategies
- **WASM for Heavy Math**: All complex calculations in AssemblyScript
- **Web Workers**: Non-blocking execution for long-running tasks
- **Evaluation Caching**: Cache results with build fingerprints
- **Virtual Scrolling**: For large lists (100+ items)
- **Lazy Loading**: Route-based component splitting
- **Computed Properties**: Prefer over watchers for derived data
- **IndexedDB**: For large datasets (TR tracking, gem plans)

### Memory Management
- **Store Cleanup**: Clear temporary data on component unmount
- **Event Listeners**: Always remove in onUnmounted()
- **Large Arrays**: Use StaticArray in AssemblyScript
- **Image Optimization**: WebP format, proper sizing
- **Bundle Analysis**: Monitor chunk sizes with Vite

### Build System Optimization
- **Tree Shaking**: Ensure proper ES module imports
- **Code Splitting**: Route-based and feature-based chunks
- **Asset Optimization**: Compress images, minimize CSS
- **WASM Integration**: Optimized AssemblyScript compilation

## Testing Guidelines

### Critical Test Areas
- **Build Evaluation Logic**: Verify WASM calculations match expected results
- **Store State Management**: Test persistence and synchronization
- **Import/Export**: Validate build code generation and parsing
- **Responsive Design**: Test on mobile, tablet, desktop viewports
- **Data Migration**: Ensure backward compatibility with stored data

### Mock Patterns
```javascript
// Mock WASM service in tests
const mockWasmService = {
  evaluateBuild: vi.fn().mockResolvedValue(mockResults)
};
```

## Security Guidelines

### Data Validation
- **Input Sanitization**: Validate all user inputs before WASM calls
- **Build Codes**: Verify integrity of imported build data
- **File Uploads**: Validate backup file structure and content
- **XSS Prevention**: Escape user-generated content in templates

### Authentication
- **Optional Login**: Core functionality works without authentication
- **Secure Storage**: Sensitive data in HTTP-only cookies when applicable
- **API Security**: Rate limiting and input validation on backend endpoints

## Development Workflow

### Component Creation
1. Create component file in appropriate directory
2. Use composition API with `<script setup>`
3. Add proper TypeScript prop definitions
4. Implement responsive Tailwind styling
5. Add to parent component imports
6. Test on multiple screen sizes

### Store Integration
1. Define reactive state with appropriate persistence
2. Implement getter computeds for derived data
3. Create action functions for state mutations
4. Add initialization logic if needed
5. Test store persistence and restoration

### WASM Development
1. Follow existing patterns in assembly/ files
2. Add proper TypeScript definitions
3. Test calculations against known values
4. Optimize for performance
5. Update service layer integration

## Browser Compatibility

### Target Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS Safari 14+, Chrome Mobile 90+
- **Required Features**: ES2022, WebAssembly, IndexedDB, Web Workers
- **Graceful Degradation**: Fallbacks for older browsers where possible

## Deployment Considerations

### Build Configuration
- **Environment Variables**: Separate dev/prod configurations
- **Static Generation**: Pre-render for SEO where applicable
- **Asset Optimization**: Compress all assets for production
- **Service Workers**: Cache strategy for offline functionality

### Performance Monitoring
- **Bundle Analysis**: Regular monitoring of bundle sizes
- **Runtime Performance**: Monitor evaluation times and memory usage
- **User Experience**: Track load times and interaction responsiveness