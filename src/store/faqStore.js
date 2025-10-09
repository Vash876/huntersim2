import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

export const useFAQStore = defineStore('faq', () => {
  // Settings
  const isEnabled = useStorage('faq-enabled', true)
  const isExpanded = ref(false)

  // FAQ content by route
  const faqContent = {
    // Home/Dashboard
    '/': {
      title: 'HunterSim2 Übersicht',
      sections: [
        {
          question: 'Was ist HunterSim2?',
          answer: 'HunterSim2 ist eine umfassende Tools-Suite für das Idle-Game "CIFI", die fortgeschrittene Rechner, Planer und Optimierungstools für Hunter-Charaktere bereitstellt.'
        },
        {
          question: 'Welche Hunter werden unterstützt?',
          answer: 'Das Tool unterstützt alle drei Hunter: Borge (rot), Ozzy (grün) und Knox (blau), jeweils mit spezifischen Optimierungen.'
        }
      ]
    },

    // Builds
    '/builds': {
      title: 'Build Management',
      sections: [
        {
          question: 'Wie erstelle ich einen neuen Build?',
          answer: 'Klicke auf "Neuer Build" und wähle deinen Hunter aus. Das Tool erstellt automatisch einen Build basierend auf deinen aktuellen Daten.'
        },
        {
          question: 'Was sind Overrides?',
          answer: 'Overrides sind temporäre Änderungen an einem Build, um "Was-wäre-wenn"-Szenarien zu testen, ohne die Grunddaten zu ändern.'
        },
        {
          question: 'Wie funktioniert die Build-Bewertung?',
          answer: 'Die Bewertung erfolgt über WASM-powered Simulationen, die Loot/min, durchschnittliche Stage und Completion-Zeit berechnen.'
        }
      ]
    },

    // TR Tracking
    '/tr-tracking': {
      title: 'Traversal Reset Tracking',
      sections: [
        {
          question: 'Was ist TR Tracking?',
          answer: 'TR Tracking verfolgt deine Traversal Reset Fortschritte und hilft bei der Optimierung der TR-Zyklen.'
        },
        {
          question: 'Wie importiere ich TR-Daten?',
          answer: 'Du kannst TR-Daten aus dem Spiel oder aus Backup-Dateien importieren. Das Tool erkennt automatisch das Format.'
        }
      ]
    },

    // TR Planner
    '/tr-planner': {
      title: 'TR Planner',
      sections: [
        {
          question: 'Wie plane ich meinen nächsten TR?',
          answer: 'Der TR Planner berechnet optimale TR-Zeitpunkte basierend auf deinen aktuellen Stats und Zielen.'
        },
        {
          question: 'Was sind Orb-Optimierungen?',
          answer: 'Das Tool berechnet die effizienteste Verteilung von Ouroboros Orbs für maximalen Nutzen.'
        }
      ]
    },

    // Gem Planner
    '/gem-planner': {
      title: 'Gem Planner',
      sections: [
        {
          question: 'Wie funktioniert die Gem-Optimierung?',
          answer: 'Der Gem Planner berechnet die optimale Reihenfolge für Gem-Upgrades basierend auf Kosten-Nutzen-Verhältnis.'
        },
        {
          question: 'Was bedeuten die Effizienz-Scores?',
          answer: 'Effizienz-Scores (0-100) zeigen, wie wertvoll ein Gem-Upgrade im Verhältnis zu seinen Kosten ist.'
        }
      ]
    },

    // Tools/Calculators
    '/tools': {
      title: 'Rechner & Tools',
      sections: [
        {
          question: 'Welche Rechner sind verfügbar?',
          answer: 'Das Tool bietet verschiedene Rechner für Hunter-Stats, Upgrades, Gem-Effizienz und Build-Vergleiche.'
        },
        {
          question: 'Wie verwende ich die Build-Codes?',
          answer: 'Build-Codes ermöglichen das einfache Teilen von Builds. Sie enthalten alle wichtigen Parameter in kompakter Form.'
        }
      ]
    },

    // Upgrades
    '/upgrades': {
      title: 'Upgrade Management',
      sections: [
        {
          question: 'Wie verwalte ich meine Upgrades?',
          answer: 'Das Upgrade-System verfolgt automatisch deine Fortschritte und schlägt optimale Upgrade-Pfade vor.'
        },
        {
          question: 'Was ist der Upgrade-Vergleich?',
          answer: 'Der Vergleich zeigt die Effizienz verschiedener Upgrades und hilft bei der Prioritätensetzung.'
        }
      ]
    },

    // Settings
    '/settings': {
      title: 'Einstellungen',
      sections: [
        {
          question: 'Wie sichere ich meine Daten?',
          answer: 'Du kannst deine Daten lokal exportieren oder mit optionaler Cloud-Synchronisation sichern.'
        },
        {
          question: 'Wie stelle ich das Tool auf Deutsch um?',
          answer: 'Die Spracheinstellungen findest du in den allgemeinen Einstellungen. Das Tool unterstützt mehrere Sprachen.'
        }
      ]
    }
  }

  // Get FAQ content for current route
  const getFAQForRoute = (route) => {
    return faqContent[route] || faqContent['/']
  }

  // Toggle functions
  const toggleEnabled = () => {
    isEnabled.value = !isEnabled.value
  }

  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value
  }

  const setExpanded = (expanded) => {
    isExpanded.value = expanded
  }

  // Computed
  const shouldShowFAQ = computed(() => isEnabled.value)

  return {
    // State
    isEnabled,
    isExpanded,
    faqContent,

    // Actions
    toggleEnabled,
    toggleExpanded,
    setExpanded,
    getFAQForRoute,

    // Computed
    shouldShowFAQ
  }
})