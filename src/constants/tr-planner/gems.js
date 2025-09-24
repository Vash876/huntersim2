// Gem-Definitionen speziell für TR-Planner
export const gemTypes = [
  {
    id: 'exodus',
    name: 'Exodus',
    letter: 'E',
    maxLevel: 5,
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
    maxLevel: 3,
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
    { id: 2, angle: 70 },
    { id: 3, angle: 55 },
    { id: 4, angle: 65 },
    { id: 5, angle: 75 }
  ],
  innovation: [
    { id: 0, angle: 110 },
    { id: 1, angle: 120 },
    { id: 2, angle: 130 },
    { id: 3, angle: 115 },
    { id: 4, angle: 125 },
    { id: 5, angle: 135 }
  ],
  attraction: [
    { id: 0, angle: 230 },
    { id: 1, angle: 240 },
    { id: 2, angle: 250 },
    { id: 3, angle: 235 },
    { id: 4, angle: 245 },
    { id: 5, angle: 255 }
  ],
  power: [
    { id: 0, angle: 170 },
    { id: 1, angle: 180 },
    { id: 2, angle: 190 },
    { id: 3, angle: 175 },
    { id: 4, angle: 185 },
    { id: 5, angle: 195 }
  ],
  creation: [
    { id: 0, angle: 290 },
    { id: 1, angle: 300 },
    { id: 2, angle: 310 },
    { id: 3, angle: 295 },
    { id: 4, angle: 305 },
    { id: 5, angle: 315 }
  ],
  evolution: [
    { id: 0, angle: 350 },
    { id: 1, angle: 0 },
    { id: 2, angle: 10 },
    { id: 3, angle: 355 },
    { id: 4, angle: 5 },
    { id: 5, angle: 15 }
  ],
  exodus: [
    { id: 0, angle: 350 },
    { id: 1, angle: 0 },
    { id: 2, angle: 10 },
    { id: 3, angle: 355 },
    { id: 4, angle: 5 },
    { id: 5, angle: 15 }
  ]
};

export const getAllGemData = () => {
  return gemTypes.map(gem => ({
    ...gem,
    nodes: gemNodes[gem.id] || []
  }));
};