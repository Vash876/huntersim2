---
applyTo: 'src/views/tools/MissionPlanner.vue,src/components/mission-planner/**,src/store/missionPlannerStore.js,src/constants/mission-planner/**'
---

# Mission Planner Instructions

## Overview
The Mission Planner is an optimization tool that automatically distributes personnel across missions to maximize fragment yield per time unit.

## Core Concepts

### Personnel Types
Personnel have tiers with different power levels:
| Tier | Name | Base Power | Notes |
|------|------|------------|-------|
| T1 | Mining Pod | 1 (+ modifiers) | Cheapest, use first when sufficient |
| T2 | Fireteam Carrier | 2 (+ modifiers) | Medium value |
| T3 | Titan Hauler | 3 (+ modifiers) | High value |
| T4 | Combat Corvette | 4 (+ modifiers) | Most valuable, save for hard missions |

**Key Principle**: Use the cheapest personnel that can complete the mission efficiently. Don't waste T4 on easy missions!

### Mission Types

#### Farm Missions (F1-1, F2-1, etc.)
- **Repeatable**: Auto-restart after completion
- **Infinite runs per TR**: Can run unlimited times per Traversal Reset
- **Fragment yield**: `Farm Fragments` value per completion
- **Optimization goal**: Maximize fragments/hour across all farms
- **IMPORTANT: 2 Second Cap**: Farm missions have a minimum completion time of 2 seconds. No matter how much power, they cannot complete faster than 2 seconds.

##### Fragment Search Missions (fX-4) - Special Multipliers
These missions have bonus fragment multipliers:
| Mission | Multiplier |
|---------|------------|
| F1-4 | ×2 |
| F2-4 | ×6 |
| F3-4 | ×51 |
| F4-4 | ×201 |

Formula: `Fragments = baseFarmFrags × farmFragsMultiplier × missionMultiplier`

#### Campaign Missions (C1-1, C2-1, etc.)
- **One-time per TR**: Can only complete once per Traversal Reset
- **Fragment yield**: `Campaign Fragments` value per completion
- **Optimization goal**: Complete as many as possible, prioritize by value

##### Campaign Unlock Order (IMPORTANT!)
Campaigns must be completed in sequence within each planet:
- **Planet 1 (Wasta-7)**: C1-1 → C1-2 → ... → C1-8 (must complete in order)
- **Planet 2 (Cryton)**: Unlocks after C1-8, then C2-1 → C2-2 → ... → C2-8
- **Planet 3 (Gaia Type-3)**: Unlocks after C2-8, then C3-1 → C3-2 → ... → C3-8
- **Planet 4 (Sekhur-5)**: **EXCEPTION** - Can start immediately! But C4-1 → C4-2 → ... → C4-8 still sequential

### Time Calculation Formula

```
Base Time = timeInMinutes (from mission data)
Total Power = Σ(personnel_count × power_per_unit)
Mission Speed Multiplier = missionSpeedMultiplier (from modifiers, e.g., 45689% = 456.89x)

Actual Time = Base Time / (Total Power × Mission Speed Multiplier)

// IMPORTANT: Apply 2-second cap for farm missions
if (isFarmMission && Actual Time < 2 seconds) {
  Actual Time = 2 seconds
}
```

**Example**:
- Mission F1-1: timeInMinutes = 30
- 1 T1 Personnel with 8.9 power
- Mission Speed = 456.89x
- Actual Time = 30 / (1 × 8.9 × 456.89) = 0.0074 minutes ≈ 0.44 seconds
- **After cap**: 2 seconds (0.033 minutes)

### Fragment Yield Calculation

#### Farm Missions
```
Fragments per Completion = farmFragsBase × farmFragsMultiplier × missionMultiplier
Completions per Hour = 60 / max(Actual Time in Minutes, 0.033)  // 2 second cap
Fragments per Hour = Fragments per Completion × Completions per Hour
```

#### Campaign Missions
```
Fragments per Completion = campaignFragsBase × campaignFragsMultiplier
Total Fragments = Fragments per Completion (one-time)
```

## Optimization Algorithm

### Goal
Maximize total fragment yield per hour while:
1. Not exceeding available personnel per tier
2. Not exceeding mission maxCrew limits
3. Preferring cheaper personnel when sufficient
4. Respecting the 2-second cap (don't over-invest power beyond cap)

### Manual Override Feature
- User can set a mission to "Manual" mode
- Manual missions have fixed personnel assignments set by user
- Optimizer subtracts manually assigned personnel from available pool
- Optimizer then distributes remaining personnel across auto missions

### Strategy: Greedy Allocation with Efficiency Priority

1. **Subtract manual assignments** from available personnel pool
2. **Calculate minimum power needed** for each mission to hit 2-second cap (for farms)
3. **Sort missions by efficiency** (fragments per power invested)
4. **Allocate personnel starting with T1**:
   - If T1 power is sufficient → use T1 only
   - If not → add T2, then T3, then T4 as needed
5. **Respect constraints**:
   - Personnel counts (can't use more than you have)
   - maxCrew per mission (can't assign more than allowed)
   - 2-second cap (don't waste power beyond it)

### Power Required for 2-Second Cap
```
Required Power = timeInMinutes / (0.033 × missionSpeedMultiplier)
```
This is the maximum useful power - anything beyond this is wasted.

### Personnel Allocation Priority

For each mission, determine required power:
```
Required Power = timeInMinutes / (target_completion_time × missionSpeedMultiplier)
```

Then allocate:
1. Try to fill with T1 first (cheapest)
2. If T1 not enough or maxCrew reached, add T2
3. Continue with T3, T4 as needed
4. Never over-allocate (waste of resources)

## Data Structures

### Personnel State (from modifiers)
```javascript
{
  t1: { count: 20562, power: 8.9 },
  t2: { count: 10943, power: 15.4 },
  t3: { count: 5003, power: 26.8 },
  t4: { count: 3064, power: 45.0 }
}
```

### Mission Assignment Result
```javascript
{
  missionTag: 'F1-1',
  isManual: false, // true if user set manually
  personnel: { T1: 1, T2: 0, T3: 0, T4: 0 },
  totalPower: 8.9,
  completionTime: 2, // seconds (capped)
  completionsPerHour: 1800,
  fragmentsPerHour: 526.1,
  missionMultiplier: 1 // or 2/6/51/201 for fX-4 missions
}
```

### Optimization Output
```javascript
{
  assignments: [...], // All mission assignments
  totalFragmentsPerHour: 50000,
  personnelUsed: { T1: 5000, T2: 3000, T3: 1000, T4: 500 },
  personnelRemaining: { T1: 15562, T2: 7943, T3: 4003, T4: 2564 },
  unassignedMissions: [...], // Missions with no personnel (not enough available)
  skippedMissions: [...] // Missions skipped (e.g., F4-2, F4-3 when not enough personnel)
}
```

## UI Requirements

### Main Display
- Show all missions with current/optimal assignment
- Show calculated completion time
- Show fragments/hour for farms
- Show total fragments for campaigns
- Highlight inefficient assignments (e.g., T4 on easy mission)
- Toggle for Manual/Auto mode per mission

### Controls
- "Optimize" button - runs algorithm and shows optimal distribution
- "Apply" button - applies optimal distribution to assignments
- "Reset" button - clears all assignments
- Manual override toggle - switch mission between auto/manual mode

### Summary Panel
- Total personnel available vs used
- Total fragments/hour (farms)
- Campaign completion status
- Efficiency score

## Edge Cases

1. **Not enough personnel**: Some missions may remain unassigned (e.g., F4-2, F4-3)
2. **Overkill prevention**: Don't assign more power than needed for 2-second cap
3. **maxCrew limits**: Respect mission crew limits even if more power available
4. **Zero personnel**: Handle gracefully, show "No personnel available"
5. **Manual assignments exceed available**: Show warning, don't allow

## Future Enhancements

- Time-based planning (when will X campaign complete?)
- Priority settings (user marks important missions)
- "What-if" scenarios (simulate with different personnel counts)
- Export/Import optimal configurations
