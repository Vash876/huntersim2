<template>
  <div 
    v-if="faqStore.shouldShowFAQ" 
    class="faq-wrapper"
    :class="{ 'open': faqStore.isExpanded }"
  >
    <!-- FAQ Handle/Toggle Button -->
    <div 
      class="faq-handle"
      @click="faqStore.toggleExpanded"
    >
      <div class="handle-content">
        <IconChevronRight 
          :size="18" 
          class="handle-icon"
          :class="{ 'rotated': faqStore.isExpanded }"
        />
        <span class="handle-text">FAQ</span>
      </div>
    </div>

    <!-- FAQ Content Panel -->
    <div class="faq-panel">
      <!-- Header -->
      <div class="panel-header">
        <h3 class="panel-title">
          <IconHelpHexagon :size="22" class="mr-2" />
          {{ currentFAQ.title }}
        </h3>
      </div>

      <!-- Content -->
      <div class="panel-content">
        <div class="space-y-3">
          <div 
            v-for="(section, index) in currentFAQ.sections"
            :key="index"
            class="faq-section"
          >
            <!-- Question -->
            <button
              @click="toggleSection(index)"
              class="section-question"
            >
              <span class="question-text">{{ section.question }}</span>
              <IconChevronDown 
                :size="16" 
                class="question-icon"
                :class="{ 'rotated': expandedSections.includes(index) }"
              />
            </button>

            <!-- Answer -->
            <div 
              v-if="expandedSections.includes(index)"
              class="section-answer"
            >
              <p class="answer-text">
                {{ section.answer }}
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Links (if available) -->
        <div v-if="quickLinks.length > 0" class="quick-links">
          <h4 class="links-title">Schnelle Links:</h4>
          <div class="links-container">
            <button
              v-for="link in quickLinks"
              :key="link.path"
              @click="navigateTo(link.path)"
              class="link-button"
            >
              {{ link.label }}
            </button>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFAQStore } from '@/store/faqStore'
import { 
  IconHelpHexagon, 
  IconX,
  IconChevronLeft, 
  IconChevronRight,
  IconChevronDown 
} from '@tabler/icons-vue'

const route = useRoute()
const router = useRouter()
const faqStore = useFAQStore()

// Local state
const expandedSections = ref([])

// Get current FAQ content based on route
const currentFAQ = computed(() => {
  return faqStore.getFAQForRoute(route.path)
})

// Quick navigation links based on current route
const quickLinks = computed(() => {
  const currentPath = route.path
  const links = []

  // Add relevant quick links based on current route
  if (currentPath === '/') {
    links.push(
      { path: '/builds', label: 'Builds' },
      { path: '/tr-planner', label: 'TR Planner' },
      { path: '/gem-planner', label: 'Gems' }
    )
  } else if (currentPath === '/builds') {
    links.push(
      { path: '/tools/build-comparison', label: 'Vergleich' },
      { path: '/upgrades', label: 'Upgrades' }
    )
  } else if (currentPath.startsWith('/tr-')) {
    links.push(
      { path: '/tr-tracking', label: 'TR Tracking' },
      { path: '/tr-planner', label: 'TR Planner' }
    )
  } else if (currentPath === '/gem-planner') {
    links.push(
      { path: '/builds', label: 'Builds' },
      { path: '/upgrades', label: 'Upgrades' }
    )
  }

  return links
})

// Functions
function toggleSection(index) {
  const sectionIndex = expandedSections.value.indexOf(index)
  if (sectionIndex > -1) {
    expandedSections.value.splice(sectionIndex, 1)
  } else {
    expandedSections.value.push(index)
  }
}

function navigateTo(path) {
  router.push(path)
  faqStore.setExpanded(false)
}

// Reset expanded sections when route changes
watch(() => route.path, () => {
  expandedSections.value = []
})
</script>

<style scoped>
/* FAQ Wrapper - Korrigierte Position */
.faq-wrapper {
  position: fixed;
  top: 50%;
  left: -320px; /* Panel versteckt (-Panel-Breite) */
  transform: translateY(-50%);
  display: flex;
  z-index: 40;
  transition: left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.faq-wrapper.open {
  left: 0; /* Panel sichtbar */
}

/* FAQ Handle/Toggle Button */
.faq-handle {
  width: 50px;
  background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  cursor: pointer;
  padding: 24px 0;
  border-radius: 0 12px 12px 0;
  border: 1px solid #3b82f6;
  border-left: none;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  order: 2; /* Handle nach dem Panel */
}

.faq-handle:hover {
  background: linear-gradient(180deg, #1d4ed8 0%, #1e40af 100%);
}

.handle-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.handle-icon {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.handle-icon.rotated {
  transform: rotate(180deg);
}

.handle-text {
  font-size: 12px;
  font-weight: 500;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 0.05em;
  transform: rotate(180deg);
  user-select: none;
}

/* FAQ Panel - Korrigiert */
.faq-panel {
  width: 320px;
  background: #1f2937;
  border: 1px solid #4b5563;
  border-right: none;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  order: 1; /* Panel zuerst */
}

/* Panel Header */
.panel-header {
  background: linear-gradient(90deg, #1e40af 0%, #1e3a8a 100%);
  padding: 12px;
  border-bottom: 1px solid #4b5563;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  color: white;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin: 0;
}

.close-button {
  padding: 4px;
  border-radius: 9999px;
  background: transparent;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #2563eb;
}

/* Panel Content */
.panel-content {
  padding: 12px;
  overflow-y: auto;
  flex: 1;
}

.space-y-3 > * + * {
  margin-top: 12px;
}

/* FAQ Sections */
.faq-section {
  border: 1px solid #4b5563;
  border-radius: 8px;
  overflow: hidden;
}

.section-question {
  width: 100%;
  text-align: left;
  padding: 12px;
  background-color: rgba(42, 46, 53, 0.8);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.section-question:hover {
  background-color: #374151;
}

.question-text {
  flex: 1;
}

.question-icon {
  color: #9ca3af;
  transition: transform 0.2s;
}

.question-icon.rotated {
  transform: rotate(180deg);
}

.section-answer {
  padding: 12px;
  background-color: #1f2937;
  border-top: 1px solid #4b5563;
  animation: fadeIn 0.2s ease-in-out;
}

.answer-text {
  color: #d1d5db;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* Quick Links */
.quick-links {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #4b5563;
}

.links-title {
  color: white;
  font-size: 12px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.links-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.link-button {
  font-size: 12px;
  padding: 4px 8px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.link-button:hover {
  background-color: #1d4ed8;
}

/* Panel Footer */
.panel-footer {
  padding: 8px;
  background-color: rgba(42, 46, 53, 0.8);
  border-top: 1px solid #4b5563;
  text-align: center;
}

.footer-button {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.footer-button:hover {
  color: white;
}

/* Fade Animation */
@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(-4px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* Scrollbar Styling */
.panel-content::-webkit-scrollbar {
  width: 4px;
}

.panel-content::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 2px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 2px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .faq-wrapper {
    left: calc(-100vw + 50px); /* Mobile: fast kompletter Bildschirm versteckt */
  }
  
  .faq-wrapper.open {
    left: 0;
  }
  
  .faq-panel {
    width: calc(100vw - 50px);
    max-width: 320px;
  }
  
  .handle-text {
    font-size: 10px;
  }
}
</style>