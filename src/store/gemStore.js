import { defineStore } from 'pinia';

export const useGemPlannerStore = defineStore('gemPlanner', {
  state: () => ({
    userStats: {
      gemDust: 0,
      rpMultiplier: 1,
      mpMultiplier: 1,
      cellMultiplier: 1,
      shardMultiplier: 1
    },
    currentPlan: null,
    savedPlans: [],
    gemData: {
      // Dieses Objekt wird später mit den echten Daten gefüllt
      exodus: {
        maxLevel: 4,
        upgrades: [
          { name: 'RP Bonus', type: 'rp', multiplier: 1.2, cost: 1000 },
          { name: 'Shard Bonus', type: 'shards', multiplier: 1.3, cost: 2000 },
          { name: 'Cells Bonus', type: 'cells', multiplier: 1.4, cost: 5000 },
          { name: 'MP Bonus', type: 'mp', multiplier: 1.5, cost: 10000 }
        ]
      },
      temporal: {
        maxLevel: 3,
        upgrades: [/* ... */]
      },
      // Andere Gems hier...
    }
  }),
  
  actions: {
    updateUserStats(stats) {
      this.userStats = { ...this.userStats, ...stats };
      this.saveToLocalStorage();
    },
    
    saveCurrentPlan(plan) {
      this.currentPlan = { ...plan, updatedAt: new Date().toISOString() };
      this.saveToLocalStorage();
    },
    
    savePlan(plan) {
      const id = Date.now().toString();
      const newPlan = {
        id,
        ...plan,
        createdAt: new Date().toISOString()
      };
      
      this.savedPlans.push(newPlan);
      this.saveToLocalStorage();
      
      return id;
    },
    
    deletePlan(planId) {
      this.savedPlans = this.savedPlans.filter(p => p.id !== planId);
      this.saveToLocalStorage();
    },
    
    loadFromLocalStorage() {
      try {
        const storedData = localStorage.getItem('gemPlanner');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          this.userStats = parsedData.userStats || this.userStats;
          this.currentPlan = parsedData.currentPlan || null;
          this.savedPlans = parsedData.savedPlans || [];
        }
      } catch (error) {
        console.error('Error loading Gem Planner data:', error);
      }
    },
    
    saveToLocalStorage() {
      try {
        const dataToStore = {
          userStats: this.userStats,
          currentPlan: this.currentPlan,
          savedPlans: this.savedPlans
        };
        localStorage.setItem('gemPlanner', JSON.stringify(dataToStore));
      } catch (error) {
        console.error('Error saving Gem Planner data:', error);
      }
    }
  }
});