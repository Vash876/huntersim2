import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

/**
 * Store für den Ultima Calculator mit Persistenz im LocalStorage
 */
export const useUltimaStore = defineStore('ultimaCalculator', {
  state: () => ({
    // Nur die Benutzereingaben speichern
    trCount: useStorage('ultima_trCount', 54),
    currentLevels: useStorage('ultima_current_levels', {
      cells: 0,
      mp: 0,
      shards: 0,
      rp: 0,
      ap: 0,
      mats: 0,
      loot: 0
    }),
    targetLevels: useStorage('ultima_target_levels', {
      cells: 0,
      mp: 0,
      shards: 0,
      rp: 0,
      ap: 0,
      mats: 0,
      loot: 0
    })
  }),
  
  
  getters: {
    // Berechnungsformeln als einfache Konstanten (nicht im localStorage)
    upgradeConfigs() {
      return {
        cells: { minTR: 1, base: 100, baseIncrease: 2 },
        mp: { minTR: 2, base: 200, baseIncrease: 2 },
        shards: { minTR: 3, base: 200, baseIncrease: 2 },
        rp: { minTR: 4, base: 200, baseIncrease: 2 },
        ap: { minTR: 10, base: 200, baseIncrease: 2 },
        mats: { minTR: 11, base: 300, baseIncrease: 3 },
        loot: { minTR: 12, base: 800, baseIncrease: 8 }
      };
    },

    /**
     * Berechnet die Gesamtzahl aller Upgrade-Level
     */
    totalLevels() {
      let sum = 0;
      for (const type in this.currentLevels) {
        sum += this.currentLevels[type] || 0;
      }
      return sum;
    },
    
    /**
     * Berechnet den Milestone-Bonus basierend auf der Gesamtzahl der Level
     */
    milestoneBonusFactor() {
      const totalLevels = this.totalLevels || 0;
      const milestoneCount = Math.floor(totalLevels / 50);
      return Math.pow(1.05, milestoneCount);
    },
    
    /**
     * Spezieller Milestone-Bonus für Loot (x1.02 statt x1.05)
     */
    lootMilestoneBonusFactor() {
      const totalLevels = this.totalLevels || 0;
      const milestoneCount = Math.floor(totalLevels / 50);
      return Math.pow(1.02, milestoneCount);
    },
    
    /**
     * Berechnet die Caps für alle Upgrades basierend auf dem TR Count
     */
    upgradeCaps() {
      const trCount = this.trCount || 54;
      const result = {};
      
      // Cells Cap: immer 1000 ab TR 53
      result.cells = trCount < 13
        ? 300 + (25 * (trCount - 1))
        : (trCount >= 53 ? 1000 : 470 + (10 * trCount));
      
      // MP Cap: 1000 ab TR 53
      result.mp = this.isUpgradeLocked('mp')
        ? "LOCKED"
        : (trCount < 13
            ? 300 + (25 * (trCount - 1))
            : (trCount >= 53 ? 1000 : 490 + (10 * (trCount - 2))));
      
      // Shards Cap: 1000 ab TR 53
      result.shards = this.isUpgradeLocked('shards')
        ? "LOCKED"
        : (trCount < 13
            ? 300 + (25 * (trCount - 1))
            : (trCount >= 53 ? 1000 : 500 + (10 * (trCount - 3))));
      
      // RP Cap: 1000 ab TR 53
      result.rp = this.isUpgradeLocked('rp')
        ? "LOCKED"
        : (trCount < 13
            ? 300 + (25 * (trCount - 1))
            : (trCount >= 53 ? 1000 : 510 + (10 * (trCount - 4))));
      
      // AP Cap: 1000 ab TR 53
      result.ap = this.isUpgradeLocked('ap')
        ? "LOCKED"
        : (trCount < 13
            ? 300 + (25 * (trCount - 1))
            : (trCount >= 53 ? 1000 : 570 + (10 * (trCount - 10))));
      
      // Mats Cap: 200 ab TR 26
      result.mats = this.isUpgradeLocked('mats')
        ? "LOCKED"
        : (trCount >= 26 ? 200 : 40 + (10 * (trCount - 10)));
      
      // Loot Cap: 100 ab TR 23
      result.loot = this.isUpgradeLocked('loot')
        ? "LOCKED"
        : (trCount >= 23 ? 100 : 45 + (5 * (trCount - 12)));
      
      return result;
    },
    
    /**
     * Berechnet die Kosten für alle Upgrades von Current zu Target
     */
    upgradeCosts() {
      const result = {};
      const upgrades = ['cells', 'mp', 'shards', 'rp', 'ap', 'mats', 'loot'];
      
      upgrades.forEach(upgrade => {
        result[upgrade] = this.calculateUpgradeCost(upgrade);
      });
      
      return result;
    },
    
    /**
     * Berechnet den aktuellen Bonus für alle Upgrades
     * Inklusive des x1.05 Bonus für alle 50 Level (bzw. x1.02 für Loot)
     */
    currentBonuses() {
      const result = {};
      
      // Sichere Werte mit Fallbacks
      const currentLevels = this.currentLevels || {};
      
      // Berechne den Milestone-Bonus basierend auf den aktuellen Gesamtleveln
      const totalCurrentLevels = Object.values(currentLevels).reduce((sum, level) => sum + (level || 0), 0);
      const milestoneCount = Math.floor(totalCurrentLevels / 50);
      const standardBonusFactor = Math.pow(1.05, milestoneCount);
      const lootBonusFactor = Math.pow(1.02, milestoneCount);
      
      // Cells Bonus mit Milestone-Bonus
      result.cells = 1 + (0.04 * (currentLevels.cells || 0)) * standardBonusFactor;
      
      // MP Bonus mit Milestone-Bonus
      result.mp = this.isUpgradeLocked('mp')
        ? "LOCKED"
        : 1 + (0.01 * (currentLevels.mp || 0)) * standardBonusFactor;
      
      // Shards Bonus mit Milestone-Bonus
      result.shards = this.isUpgradeLocked('shards')
        ? "LOCKED"
        : 1 + (0.03 * (currentLevels.shards || 0)) * standardBonusFactor;
      
      // RP Bonus mit Milestone-Bonus
      result.rp = this.isUpgradeLocked('rp')
        ? "LOCKED"
        : 1 + (0.02 * (currentLevels.rp || 0)) * standardBonusFactor;
      
      // AP Bonus mit Milestone-Bonus
      result.ap = this.isUpgradeLocked('ap')
        ? "LOCKED"
        : 1 + (0.01 * (currentLevels.ap || 0)) * standardBonusFactor;
      
      // Mats Bonus mit Milestone-Bonus
      result.mats = this.isUpgradeLocked('mats')
        ? "LOCKED"
        : 1 + (0.006 * (currentLevels.mats || 0)) * standardBonusFactor;
      
      // Loot Bonus mit speziellem Loot-Milestone-Bonus
      result.loot = this.isUpgradeLocked('loot')
        ? "LOCKED"
        : 1 + (0.003 * (currentLevels.loot || 0)) * lootBonusFactor;
      
      return result;
    },

    /**
     * Berechnet den Ziel-Bonus für alle Upgrades
     */
    targetBonuses() {
      const result = {};
      
      // Sichere Werte mit Fallbacks
      const targetLevels = this.targetLevels || {};
      
      // Berechne den Milestone-Bonus basierend auf den Ziel-Gesamtleveln
      const totalTargetLevels = Object.values(targetLevels).reduce((sum, level) => sum + (level || 0), 0);
      const milestoneCount = Math.floor(totalTargetLevels / 50);
      const standardBonusFactor = Math.pow(1.05, milestoneCount);
      const lootBonusFactor = Math.pow(1.02, milestoneCount);
      
      // Cells Bonus mit Milestone-Bonus
      result.cells = 1 + (0.04 * (targetLevels.cells || 0)) * standardBonusFactor;
      
      // MP Bonus mit Milestone-Bonus
      result.mp = this.isUpgradeLocked('mp')
        ? "LOCKED"
        : 1 + (0.01 * (targetLevels.mp || 0)) * standardBonusFactor;
      
      // Shards Bonus mit Milestone-Bonus
      result.shards = this.isUpgradeLocked('shards')
        ? "LOCKED"
        : 1 + (0.03 * (targetLevels.shards || 0)) * standardBonusFactor;
      
      // RP Bonus mit Milestone-Bonus
      result.rp = this.isUpgradeLocked('rp')
        ? "LOCKED"
        : 1 + (0.02 * (targetLevels.rp || 0)) * standardBonusFactor;
      
      // AP Bonus mit Milestone-Bonus
      result.ap = this.isUpgradeLocked('ap')
        ? "LOCKED"
        : 1 + (0.01 * (targetLevels.ap || 0)) * standardBonusFactor;
      
      // Mats Bonus mit Milestone-Bonus
      result.mats = this.isUpgradeLocked('mats')
        ? "LOCKED"
        : 1 + (0.006 * (targetLevels.mats || 0)) * standardBonusFactor;
      
      // Loot Bonus mit speziellem Loot-Milestone-Bonus
      result.loot = this.isUpgradeLocked('loot')
        ? "LOCKED"
        : 1 + (0.003 * (targetLevels.loot || 0)) * lootBonusFactor;
      
      return result;
    },

    /**
     * Berechnet den Gewinn-Faktor zwischen Current und Target für alle Upgrades
     */
    bonusGains() {
      const result = {};
      const upgradeTypes = ['cells', 'mp', 'shards', 'rp', 'ap', 'mats', 'loot'];
      
      upgradeTypes.forEach(type => {
        if (this.currentBonuses[type] === "LOCKED" || this.targetBonuses[type] === "LOCKED") {
          result[type] = "LOCKED";
        } else {
          result[type] = this.targetBonuses[type] / this.currentBonuses[type];
        }
      });
      
      return result;
    },
    
    /**
     * Berechnet die Gesamtkosten aller Upgrades
     */
    totalCost() {
      let total = 0;
      
      for (const upgrade in this.upgradeCosts) {
        if (typeof this.upgradeCosts[upgrade] === 'number') {
          total += this.upgradeCosts[upgrade];
        }
      }
      
      return total;
    },
    
    /**
     * Empfiehlt das nächste Upgrade basierend auf Kosten/Nutzen-Verhältnis
     */
    nextRecommendedUpgrade() {
      // Logik für die Empfehlung des nächsten Upgrades
      // Priorität auf Loot-Bonus bei geringsten Kosten
      
      // Beispiel-Implementierung (kann verfeinert werden)
      let bestUpgrade = null;
      let bestRatio = 0;
      
      const upgrades = ['mp', 'cells', 'shards', 'rp', 'ap', 'mats', 'loot'];
      
      for (const upgrade of upgrades) {
        if (this.isUpgradeLocked(upgrade)) continue;
        
        const currentLevel = this.currentLevels[upgrade];
        const potentialTargetLevel = currentLevel + 1;
        
        if (potentialTargetLevel > this.upgradeCaps[upgrade]) continue;
        
        // Simuliere potentielles Upgrade um 1 Level
        const currentLevelsCopy = { ...this.currentLevels };
        const targetLevelsCopy = { ...this.currentLevels, [upgrade]: potentialTargetLevel };
        
        // Berechne den aktuellen Bonus
        const currentBonus = this.calculateBonusForLevel(upgrade, currentLevel, this.totalLevels);
        
        // Berechne den neuen Bonus (berücksichtige auch mögliche neue Milestone-Boni)
        const newTotalLevels = this.totalLevels + 1;
        const newBonus = this.calculateBonusForLevel(upgrade, potentialTargetLevel, newTotalLevels);
        
        // Kosten für dieses potentielle Upgrade
        const upgradeCost = this.calculateCostForLevel(upgrade, currentLevel, potentialTargetLevel);
        if (upgradeCost === "MAX" || upgradeCost === 0) continue;
        
        // Berechne Kosten-Nutzen-Verhältnis
        const bonusIncrease = newBonus - currentBonus;
        const ratio = bonusIncrease / upgradeCost;
        
        // Wenn es Loot ist, multipliziere den Ratio mit 10, um Priorität zu geben
        const adjustedRatio = upgrade === 'loot' ? ratio * 10 : ratio;
        
        if (adjustedRatio > bestRatio) {
          bestRatio = adjustedRatio;
          bestUpgrade = upgrade;
        }
      }
      
      return {
        type: bestUpgrade,
        message: bestUpgrade ? 
          `Empfehlung: Upgrade ${bestUpgrade.toUpperCase()} von ${this.currentLevels[bestUpgrade]} auf ${this.currentLevels[bestUpgrade] + 1}` :
          "Keine Empfehlung verfügbar"
      };
    }
  },
  
  actions: {
    /**
     * Aktualisiert den TR Count
     * @param {Number} count - Der neue TR Count
     */
    updateTRCount(count) {
      this.trCount = count;
    },
    
    /**
     * Aktualisiert das aktuelle Level eines Upgrades
     * @param {String} type - Der Upgrade-Typ (cells, mp, usw.)
     * @param {Number} level - Das neue Level
     */
    updateCurrentLevel(type, level) {
      if (this.currentLevels[type] !== undefined) {
        this.currentLevels[type] = level;
      }
    },
    
    /**
     * Aktualisiert das Ziel-Level eines Upgrades
     * @param {String} type - Der Upgrade-Typ (cells, mp, usw.)
     * @param {Number} level - Das neue Level
     */
    updateTargetLevel(type, level) {
      if (this.targetLevels[type] !== undefined) {
        // Direkt den Wert setzen ohne Validierung gegen currentLevels
        this.targetLevels[type] = level;
      }
    },
    
    /**
     * Kauft die angegebenen Level-Upgrades
     */
    applyTargetLevels() {
      const types = ['cells', 'mp', 'shards', 'rp', 'ap', 'mats', 'loot'];
      
      types.forEach(type => {
        if (!this.isUpgradeLocked(type)) {
          this.currentLevels[type] = this.targetLevels[type];
        }
      });
    },
    
    /**
     * Prüft, ob ein Upgrade gesperrt ist basierend auf dem TR Count
     * @param {String} type - Der Upgrade-Typ
     * @returns {Boolean} true wenn gesperrt, sonst false
     */
    isUpgradeLocked(type) {
      const minTRRequired = this.upgradeConfigs[type]?.minTR || 0;
      const trCount = this.trCount || 54;
      return trCount < minTRRequired;
    },
    
    /**
     * Berechnet die Kosten für ein Upgrade von Current zu Target Level
     * @param {String} type - Der Upgrade-Typ
     * @returns {Number|String} Die Kosten oder "MAX"/"LOCKED"
     */
    calculateUpgradeCost(type) {
      if (this.isUpgradeLocked(type)) return "LOCKED";
      
      const currentLevels = this.currentLevels || {};
      const targetLevels = this.targetLevels || {};
      
      const currentLevel = currentLevels[type] || 0;
      const targetLevel = targetLevels[type] || 0;
      const cap = this.upgradeCaps[type];
      
      // Wenn Current = Target, dann 0 Kosten
      if (currentLevel === targetLevel) return 0;
      
      // Wenn Current oder Target = Cap, dann "MAX"
      if (typeof cap === 'number' && (currentLevel >= cap || targetLevel > cap)) return "MAX";
      
      // Berechne die Kosten
      return this.calculateCostForLevel(type, currentLevel, targetLevel);
    },
    
    /**
     * Berechnet die Kosten für ein Upgrade von startLevel zu endLevel
     * @param {String} type - Der Upgrade-Typ
     * @param {Number} startLevel - Das Start-Level
     * @param {Number} endLevel - Das End-Level
     * @returns {Number} Die Kosten
     */
    calculateCostForLevel(type, startLevel, endLevel) {
      const config = this.upgradeConfigs[type];
      
      if (!config) return 0;
      
      const base = config.base || 0;
      const increase = config.baseIncrease || 0;
      
      let totalCost = 0;
      
      for (let level = (startLevel || 0) + 1; level <= (endLevel || 0); level++) {
        const costForLevel = base + Math.floor((level - 1) / 10) * increase;
        totalCost += costForLevel;
      }
      
      return totalCost;
    },
    
    /**
     * Berechnet den Bonus für ein bestimmtes Level eines Upgrades
     * @param {String} type - Der Upgrade-Typ
     * @param {Number} level - Das Level
     * @param {Number} totalLevels - Gesamtlevel für Milestone-Bonus
     * @returns {Number} Der Bonus
     */
    calculateBonusForLevel(type, level, totalLevels) {
      let bonusMultiplier;
      
      switch (type) {
        case 'cells':
          bonusMultiplier = 0.04;
          break;
        case 'mp':
          bonusMultiplier = 0.01;
          break;
        case 'shards':
          bonusMultiplier = 0.03;
          break;
        case 'rp':
          bonusMultiplier = 0.02;
          break;
        case 'ap':
          bonusMultiplier = 0.01;
          break;
        case 'mats':
          bonusMultiplier = 0.006;
          break;
        case 'loot':
          bonusMultiplier = 0.003;
          break;
        default:
          bonusMultiplier = 0;
      }
      
      const milestoneCount = Math.floor(totalLevels / 50);
      
      const milestoneFactor = type === 'loot' 
        ? Math.pow(1.02, milestoneCount)
        : Math.pow(1.05, milestoneCount);
      
      return 1 + (bonusMultiplier * level) * milestoneFactor;
    },
    
    /**
     * Setzt alle Werte auf die Standardwerte zurück
     */
    resetToDefaults() {
      this.trCount = 54;
      
      this.currentLevels = {
        cells: 0,
        mp: 0,
        shards: 0,
        rp: 0,
        ap: 0,
        mats: 0,
        loot: 0
      };
      
      this.targetLevels = {
        cells: 0,
        mp: 0,
        shards: 0,
        rp: 0,
        ap: 0,
        mats: 0,
        loot: 0
      };
    }
  },

  
  actions: {
    /**
     * Initialisiert den Store mit Standardwerten falls nötig
     */
    initializeStore() {
      // Prüfe und setze Standardwerte für currentLevels
      if (!this.currentLevels || Object.keys(this.currentLevels).length === 0) {
        console.log('Initializing currentLevels with defaults');
        this.currentLevels = {
          cells: 0,
          mp: 0,
          shards: 0,
          rp: 0,
          ap: 0,
          mats: 0,
          loot: 0
        };
      }
      
      // Prüfe und setze Standardwerte für targetLevels
      if (!this.targetLevels || Object.keys(this.targetLevels).length === 0) {
        console.log('Initializing targetLevels with defaults');
        this.targetLevels = {
          cells: 0,
          mp: 0,
          shards: 0,
          rp: 0,
          ap: 0,
          mats: 0,
          loot: 0
        };
      }
    },

    /**
     * Aktualisiert den TR Count
     * @param {Number} count - Der neue TR Count
     */
    updateTRCount(count) {
      this.trCount = count;
      console.log('Store action updateTRCount:', count, 'Result:', this.trCount);
    },
    
    /**
     * Aktualisiert das aktuelle Level eines Upgrades
     * @param {String} type - Der Upgrade-Typ (cells, mp, usw.)
     * @param {Number} level - Das neue Level
     */
    updateCurrentLevel(type, level) {
      if (this.currentLevels && this.currentLevels[type] !== undefined) {
        // Erstelle ein neues Objekt, um Reaktivität zu gewährleisten
        this.currentLevels = {
          ...this.currentLevels,
          [type]: level
        };
        console.log('Store action updateCurrentLevel:', type, level, 'Result:', this.currentLevels[type]);
      }
    },
    
    /**
     * Aktualisiert das Ziel-Level eines Upgrades
     * @param {String} type - Der Upgrade-Typ (cells, mp, usw.)
     * @param {Number} level - Das neue Level
     */
    updateTargetLevel(type, level) {
      if (this.targetLevels && this.targetLevels[type] !== undefined) {
        // Erstelle ein neues Objekt, um Reaktivität zu gewährleisten
        this.targetLevels = {
          ...this.targetLevels,
          [type]: level
        };
        console.log('Store action updateTargetLevel:', type, level, 'Result:', this.targetLevels[type]);
      }
    },
    
    /**
     * Kauft die angegebenen Level-Upgrades
     */
    applyTargetLevels() {
      const types = ['cells', 'mp', 'shards', 'rp', 'ap', 'mats', 'loot'];
      
      types.forEach(type => {
        if (!this.isUpgradeLocked(type)) {
          this.currentLevels[type] = this.targetLevels[type];
        }
      });
    },
    
    /**
     * Setzt alle Werte auf die Standardwerte zurück
     */
    resetToDefaults() {
      this.trCount = 54;
      
      this.currentLevels = {
        cells: 0,
        mp: 0,
        shards: 0,
        rp: 0,
        ap: 0,
        mats: 0,
        loot: 0
      };
      
      this.targetLevels = {
        cells: 0,
        mp: 0,
        shards: 0,
        rp: 0,
        ap: 0,
        mats: 0,
        loot: 0
      };
    },
    
    /**
     * Prüft, ob ein Upgrade gesperrt ist basierend auf dem TR Count
     * @param {String} type - Der Upgrade-Typ
     * @returns {Boolean} true wenn gesperrt, sonst false
     */
    isUpgradeLocked(type) {
      const minTRRequired = this.upgradeConfigs[type]?.minTR || 0;
      const trCount = this.trCount || 54;
      return trCount < minTRRequired;
    },
    
    /**
     * Berechnet die Kosten für ein Upgrade von Current zu Target Level
     * @param {String} type - Der Upgrade-Typ
     * @returns {Number|String} Die Kosten oder "MAX"/"LOCKED"
     */
    calculateUpgradeCost(type) {
      if (this.isUpgradeLocked(type)) return "LOCKED";
      
      const currentLevels = this.currentLevels || {};
      const targetLevels = this.targetLevels || {};
      
      const currentLevel = currentLevels[type] || 0;
      const targetLevel = targetLevels[type] || 0;
      const cap = this.upgradeCaps[type];
      
      // Wenn Current = Target, dann 0 Kosten
      if (currentLevel === targetLevel) return 0;
      
      // Wenn Current oder Target = Cap, dann "MAX"
      if (typeof cap === 'number' && (currentLevel >= cap || targetLevel > cap)) return "MAX";
      
      // Berechne die Kosten
      return this.calculateCostForLevel(type, currentLevel, targetLevel);
    },
    
    /**
     * Berechnet die Kosten für ein Upgrade von startLevel zu endLevel
     * @param {String} type - Der Upgrade-Typ
     * @param {Number} startLevel - Das Start-Level
     * @param {Number} endLevel - Das End-Level
     * @returns {Number} Die Kosten
     */
    calculateCostForLevel(type, startLevel, endLevel) {
      const config = this.upgradeConfigs[type];
      
      if (!config) return 0;
      
      const base = config.base || 0;
      const increase = config.baseIncrease || 0;
      
      let totalCost = 0;
      
      for (let level = (startLevel || 0) + 1; level <= (endLevel || 0); level++) {
        const costForLevel = base + Math.floor((level - 1) / 10) * increase;
        totalCost += costForLevel;
      }
      
      return totalCost;
    }
  }
});