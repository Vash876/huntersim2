# Dependencies for Tool Development

## Required Dependencies

### Package.json Dependencies
```json
{
  "dependencies": {
    "vue": "^3.x",
    "@tabler/icons-vue": "^2.x",
    "break_infinity.js": "^2.x",
    "tippy.js": "^6.x"
  }
}
```

### Core Components Used
- `ToolValueControls.vue` - Numeric input controls with increment/decrement buttons
- `InfoTooltip.vue` - Tooltip component for help text

### Essential Utilities
- Number formatting functions
- LocalStorage handling for settings persistence
- Scientific notation parsing (e.g., "1e100", "5.5k", "2.3m")

## File Structure Context

```
src/
├── views/tools/
│   └── AttrGN3Calculator.vue     # Main calculator component
├── composables/
│   ├── ToolValueControls.vue     # Reusable numeric input component
│   └── InfoTooltip.vue           # Tooltip component
└── constants/
    └── (game-specific data files)
```

## Key Features Demonstrated

### 1. AttrGN3Calculator.vue Features:
- **Reactive Calculations**: Real-time updates based on input changes
- **LocalStorage Persistence**: Settings saved automatically
- **Scientific Notation Support**: Handles large numbers (1e333, etc.)
- **Responsive Design**: Mobile-friendly interface
- **Validation**: Input validation with min/max constraints

### 2. ToolValueControls.vue Features:
- **Touch & Mouse Support**: Works on desktop and mobile
- **Auto-repeat**: Hold buttons for continuous increment/decrement
- **Keyboard Navigation**: Enter/Escape handling
- **Custom Styling**: Flexible appearance via props
- **Validation Modes**: Real-time vs final-only validation

## Game Context (Travian: Legends)
This calculator is for the "Attraction GN#3" feature which:
- Involves tick-based calculations
- Uses research points and multipliers
- Has various boosts and efficiency factors
- Calculates progression toward 1e333 goal

## Implementation Patterns

### 1. Reactive State Management
```javascript
// Use Vue 3 Composition API
const tickSpeed = ref(1.5);
const calculatedValue = computed(() => {
  // Calculation logic here
  return someCalculation(tickSpeed.value);
});
```

### 2. LocalStorage Pattern
```javascript
function saveSettings() {
  localStorage.setItem('tool_settings', JSON.stringify({
    tickSpeed: tickSpeed.value,
    // ... other settings
  }));
}

function loadSettings() {
  const saved = localStorage.getItem('tool_settings');
  if (saved) {
    const data = JSON.parse(saved);
    tickSpeed.value = data.tickSpeed || 1.5;
  }
}
```

### 3. Number Formatting
```javascript
function formatNumber(num) {
  if (num >= 1e15) return num.toExponential(2);
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'k';
  return num.toFixed(2);
}
```

## Styling Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Dark Theme**: Gray-based color scheme (gray-800, gray-700, etc.)
- **Responsive**: Mobile-first design with breakpoints (sm:, md:, lg:)
- **Component Architecture**: Reusable styled components

## Development Tips

### 1. Start with Basic Structure
```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="bg-gray-900/95 rounded-xl p-5">
      <h2 class="text-2xl font-bold text-center text-white">
        Your Calculator Name
      </h2>
      
      <!-- Settings Section -->
      <div class="bg-gray-800/50 rounded-lg p-3 mb-3">
        <!-- Input controls here -->
      </div>
      
      <!-- Results Section -->
      <div class="bg-gray-800/50 rounded-lg p-3">
        <!-- Results display here -->
      </div>
    </div>
  </div>
</template>
```

### 2. Add Reactive Logic
```javascript
<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// State
const inputValue = ref(0);

// Computed results
const calculatedResult = computed(() => {
  return inputValue.value * 2; // Your calculation
});

// Persistence
watch([inputValue], saveSettings);
onMounted(loadSettings);
</script>
```

### 3. Include Essential Imports
```javascript
import { IconSettings, IconRefresh } from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';
```
