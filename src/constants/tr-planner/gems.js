// Gem-Definitionen speziell für TR-Planner
export const gemTypes = [
  {
    id: 'exodus',
    name: 'Exodus',
    letter: 'E',
    maxLevel: 4,
    color: 'purple',
    position: { angle: 0, distanceFromCenter: 0 }
  },
  {
    id: 'temporal',
    name: 'Temporal',
    letter: 'T',
    maxLevel: 3,
    color: 'red',
    position: { angle: 60, distanceFromCenter: 200 }
  },
  {
    id: 'innovation',
    name: 'Innovation',
    letter: 'I',
    maxLevel: 3,
    color: 'lime',
    position: { angle: 120, distanceFromCenter: 200 }
  },
  {
    id: 'attraction',
    name: 'Attraction',
    letter: 'A',
    maxLevel: 3,
    color: 'cyan',
    position: { angle: 240, distanceFromCenter: 200 }
  },
  {
    id: 'power',
    name: 'Power',
    letter: 'P',
    maxLevel: 2,
    color: 'purple',
    position: { angle: 180, distanceFromCenter: 200 }
  },
  {
    id: 'creation',
    name: 'Creation',
    letter: 'C',
    maxLevel: 4,
    color: 'orange',
    position: { angle: 300, distanceFromCenter: 200 }
  },
  {
    id: 'evolution',
    name: 'Evolution',
    letter: 'E',
    maxLevel: 1,
    color: 'green',
    position: { angle: 0, distanceFromCenter: 200 }
  }
];

// Node-Definitionen für TR-Planner
export const gemNodes = {
  temporal: [
    { id: 0, angle: 50 },
    { id: 1, angle: 60 },
    { id: 2, angle: 70 }
  ],
  innovation: [
    { id: 0, angle: 110 },
    { id: 1, angle: 120 },
    { id: 2, angle: 130 }
  ],
  attraction: [
    { id: 0, angle: 230 },
    { id: 1, angle: 240 },
    { id: 2, angle: 250 }
  ],
  power: [
    { id: 0, angle: 170 },
    { id: 1, angle: 180 },
    { id: 2, angle: 190 }
  ],
  creation: [
    { id: 0, angle: 290 },
    { id: 1, angle: 300 },
    { id: 2, angle: 310 }
  ],
  evolution: [
    { id: 0, angle: 350 },
    { id: 1, angle: 0 },
    { id: 2, angle: 10 }
  ],
  exodus: []
};

export const getAllGemData = () => {
  return gemTypes.map(gem => ({
    ...gem,
    nodes: gemNodes[gem.id] || []
  }));
};