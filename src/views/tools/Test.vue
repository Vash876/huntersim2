<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
    <div class="w-[550px] bg-[#2c1f1a] rounded-xl shadow-lg border border-[#5a463e] overflow-hidden">
      <!-- Header -->
      <div class="flex justify-end items-center px-3 py-1 bg-[#3a2a24] text-gray-300 text-xs uppercase tracking-wide">
        <span class="text-right">Rig One: Worthless Rocks</span>
      </div>

      <!-- Main content -->
      <div class="flex items-center gap-4 px-4 py-3">
        <!-- Left circle -->
        <div class="relative flex flex-col items-center">
          <div class="w-24 h-24 rounded-full border-4 border-orange-600 flex items-center justify-center bg-[#1f1a18]">
            <!-- Maschine -->
            <img src="https://placehold.co/60x60?text=Rig" alt="rig" class="w-12 h-12" />
          </div>
          <span class="absolute bottom-[-20px] text-xs text-gray-300">28,40s</span>
        </div>

        <!-- Middle stats -->
        <div class="flex-1 flex flex-col gap-3">
          <!-- Row 1 -->
          <div class="flex items-center justify-between bg-[#1f1a18] px-3 py-2 rounded-md">
            <div class="flex items-center gap-2 text-gray-200 text-lg font-bold">
              <img src="https://placehold.co/20x20?text=⛏" class="w-6 h-6" />
              43,692
            </div>
            <button class="bg-green-700 hover:bg-green-600 text-white px-3 py-1 text-sm rounded">
              Upgrade<br />
              <span class="font-bold">25,337</span>
            </button>
          </div>

          <!-- Row 2 -->
          <div class="flex items-center justify-between bg-[#1f1a18] px-3 py-2 rounded-md">
            <div class="flex items-center gap-2 text-gray-200 text-lg font-bold">
              <img src="https://placehold.co/20x20?text=⏱" class="w-6 h-6" />
              34,44s
            </div>
            <button class="bg-green-700 hover:bg-green-600 text-white px-3 py-1 text-sm rounded">
              Upgrade<br />
              <span class="font-bold">25,873</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Power Supply bar -->
      <div class="px-4 pb-3">
        <!-- Slider and Button on same level -->
        <div class="flex items-center gap-3">
          <!-- Slider controls -->
          <div class="flex items-center gap-2 flex-1">
            <input 
              type="range" 
              min="0" 
              max="100" 
              v-model="powerLevel"
              class="flex-1 h-2 bg-[#4b2e3c] rounded appearance-none cursor-pointer"
            />
          </div>
          
          <button @click="toggleRunning" class="bg-green-700 hover:bg-green-600 text-white font-bold px-4 py-2 rounded transition-all duration-200 active:scale-95">
            {{ isRunning ? 'Stop' : 'Start' }}
          </button>
        </div>
        
        <div class="text-center text-gray-300 text-xs mt-1">
          POWER SUPPLY (2.00u PER SEC / {{ powerLevel }}%)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const powerLevel = ref(77)
const isRunning = ref(false)

const setPowerLevel = (level) => {
  powerLevel.value = level
}

const toggleRunning = () => {
  isRunning.value = !isRunning.value
}
</script>

<style scoped>
/* Custom Slider Styling */
input[type="range"] {
  appearance: none;
  -webkit-appearance: none;
  background: #4b2e3c;
  border-radius: 4px;
  height: 8px;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid #ffffff;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid #ffffff;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Button Touch Feedback */
button:active {
  transform: scale(0.95);
}

/* Glowing effect for active elements */
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}
</style>