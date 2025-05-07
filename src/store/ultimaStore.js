import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

/**
 * Store für den Ultima Calculator mit Persistenz im LocalStorage
 */
export const useUltimaStore = defineStore('ultimaCalculator', {
  state: () => ({
    // TR Count und Status der Upgrades
    trCount: useStorage('ultima_trCount', 54),
    
    // Aktuelle Level der Upgrades
    currentLevels: useStorage('ultima_current_levels', {
      cells: 0,
      mp: 0,
      shards: 0,
      rp: 0,
      ap: 0,
      mats: 0,
      loot: 0
    }),
    
    // Ziel-Level der Upgrades
    targetLevels: useStorage('ultima_target_levels', {
      cells: 0,
      mp: 0,
      shards: 0,
      rp: 0,
      ap: 0,
      mats: 0,
      loot: 0
    }),
    
    // Konfigurationen für die Upgrades
    upgradeConfigs: useStorage('ultima_upgradeConfigs', {
      cells: { minTR: 1, base: 100, baseIncrease: 2 },
      mp: { minTR: 2, base: 200, baseIncrease: 2 },
      shards: { minTR: 3, base: 200, baseIncrease: 2 },
      rp: { minTR: 4, base: 200, baseIncrease: 2 },
      ap: { minTR: 10, base: 200, baseIncrease: 2 },
      mats: { minTR: 11, base: 300, baseIncrease: 3 },
      loot: { minTR: 12, base: 800, baseIncrease: 8 }
    })
  }),
  
  getters: {
    /**
     * Berechnet die Gesamtzahl aller Upgrade-Level
     */
    totalLevels() {
      let sum = 0;
      for (const type in this.currentLevels) {
        sum += this.currentLevels[type];
      }
      return sum;
    },
    
    /**
     * Berechnet den Milestone-Bonus basierend auf der Gesamtzahl der Level
     */
    milestoneBonusFactor() {
      const milestoneCount = Math.floor(this.totalLevels / 50);
      return Math.pow(1.05, milestoneCount);
    },
    
    /**
     * Spezieller Milestone-Bonus für Loot (x1.02 statt x1.05)
     */
    lootMilestoneBonusFactor() {
      const milestoneCount = Math.floor(this.totalLevels / 50);
      return Math.pow(1.02, milestoneCount);
    },
    
    /**
     * Berechnet die Caps für alle Upgrades basierend auf dem TR Count
     */
    upgradeCaps() {
      const trCount = this.trCount;
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
      
      // Berechne den Milestone-Bonus basierend auf den aktuellen Gesamtleveln
      const totalCurrentLevels = Object.values(this.currentLevels).reduce((sum, level) => sum + level, 0);
      const milestoneCount = Math.floor(totalCurrentLevels / 50);
      const standardBonusFactor = Math.pow(1.05, milestoneCount);
      const lootBonusFactor = Math.pow(1.02, milestoneCount);
      
      // Cells Bonus mit Milestone-Bonus
      result.cells = 1 + (0.04 * this.currentLevels.cells) * standardBonusFactor;
      
      // MP Bonus mit Milestone-Bonus
      result.mp = this.isUpgradeLocked('mp')
        ? "LOCKED"
        : 1 + (0.01 * this.currentLevels.mp) * standardBonusFactor;
      
      // Shards Bonus mit Milestone-Bonus
      result.shards = this.isUpgradeLocked('shards')
        ? "LOCKED"
        : 1 + (0.03 * this.currentLevels.shards) * standardBonusFactor;
      
      // RP Bonus mit Milestone-Bonus
      result.rp = this.isUpgradeLocked('rp')
        ? "LOCKED"
        : 1 + (0.02 * this.currentLevels.rp) * standardBonusFactor;
      
      // AP Bonus mit Milestone-Bonus
      result.ap = this.isUpgradeLocked('ap')
        ? "LOCKED"
        : 1 + (0.01 * this.currentLevels.ap) * standardBonusFactor;
      
      // Mats Bonus mit Milestone-Bonus
      result.mats = this.isUpgradeLocked('mats')
        ? "LOCKED"
        : 1 + (0.006 * this.currentLevels.mats) * standardBonusFactor;
      
      // Loot Bonus mit speziellem Loot-Milestone-Bonus
      result.loot = this.isUpgradeLocked('loot')
        ? "LOCKED"
        : 1 + (0.003 * this.currentLevels.loot) * lootBonusFactor;
      
      return result;
    },

    /**
     * Berechnet den Ziel-Bonus für alle Upgrades
     */
    targetBonuses() {
      const result = {};
      
      // Berechne den Milestone-Bonus basierend auf den Ziel-Gesamtleveln
      const totalTargetLevels = Object.values(this.targetLevels).reduce((sum, level) => sum + level, 0);
      const milestoneCount = Math.floor(totalTargetLevels / 50);
      const standardBonusFactor = Math.pow(1.05, milestoneCount);
      const lootBonusFactor = Math.pow(1.02, milestoneCount);
      
      // Cells Bonus mit Milestone-Bonus
      result.cells = 1 + (0.04 * this.targetLevels.cells) * standardBonusFactor;
      
      // MP Bonus mit Milestone-Bonus
      result.mp = this.isUpgradeLocked('mp')
        ? "LOCKED"
        : 1 + (0.01 * this.targetLevels.mp) * standardBonusFactor;
      
      // Shards Bonus mit Milestone-Bonus
      result.shards = this.isUpgradeLocked('shards')
        ? "LOCKED"
        : 1 + (0.03 * this.targetLevels.shards) * standardBonusFactor;
      
      // RP Bonus mit Milestone-Bonus
      result.rp = this.isUpgradeLocked('rp')
        ? "LOCKED"
        : 1 + (0.02 * this.targetLevels.rp) * standardBonusFactor;
      
      // AP Bonus mit Milestone-Bonus
      result.ap = this.isUpgradeLocked('ap')
        ? "LOCKED"
        : 1 + (0.01 * this.targetLevels.ap) * standardBonusFactor;
      
      // Mats Bonus mit Milestone-Bonus
      result.mats = this.isUpgradeLocked('mats')
        ? "LOCKED"
        : 1 + (0.006 * this.targetLevels.mats) * standardBonusFactor;
      
      // Loot Bonus mit speziellem Loot-Milestone-Bonus
      result.loot = this.isUpgradeLocked('loot')
        ? "LOCKED"
        : 1 + (0.003 * this.targetLevels.loot) * lootBonusFactor;
      
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
      return this.trCount < minTRRequired;
    },
    
    /**
     * Berechnet die Kosten für ein Upgrade von Current zu Target Level
     * @param {String} type - Der Upgrade-Typ
     * @returns {Number|String} Die Kosten oder "MAX"/"LOCKED"
     */
    calculateUpgradeCost(type) {
      if (this.isUpgradeLocked(type)) return "LOCKED";
      
      const currentLevel = this.currentLevels[type];
      const targetLevel = this.targetLevels[type];
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
      const base = this.upgradeConfigs[type].base;
      const increase = this.upgradeConfigs[type].baseIncrease;
      
      let totalCost = 0;
      
      for (let level = startLevel + 1; level <= endLevel; level++) {
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
  }
});