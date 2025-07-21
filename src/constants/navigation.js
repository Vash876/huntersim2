import { 
  IconTool, 
  IconProng, 
  IconAnchor,
  IconShield,
  IconWriting,
  IconZodiacGemini,
  IconRefresh,
  IconHammer,
  IconMicroscope,
  IconCrown,
  IconDiamond,
  IconCards,
  IconCreditCard,
  IconClockFilled,
  IconCrane,
  IconBoxModel,
  IconHexagon,
  IconAbacus,
  IconRobot,
  IconChartLine
} from '@tabler/icons-vue';

const IconMP = {
  template: `
    <svg 
      :width="size || 20" 
      :height="size || 20" 
      viewBox="0 0 96 96" 
      xmlns="http://www.w3.org/2000/svg"
      :class="className"
      fill="currentColor"
      stroke="none"
    >
      <g transform="translate(0.000000,96.000000) scale(0.100000,-0.100000)">
        <path d="M413 942 c-86 -45 -324 -185 -328 -192 -3 -5 32 -32 77 -60 84 -51 111 -57 146 -28 12 11 77 48 120 70 21 11 22 17 22 120 0 59 -1 108 -2 108 -2 -1 -17 -9 -35 -18z"/>
        <path d="M502 853 l3 -107 93 -54 94 -55 41 21 c53 28 96 53 125 73 22 16 20 18 -130 104 -205 118 -218 125 -224 125 -2 0 -3 -48 -2 -107z"/>
        <path d="M50 480 l0 -221 43 24 c23 13 63 37 90 53 l47 29 0 115 0 115 -48 27 c-26 15 -66 39 -89 53 l-43 26 0 -221z"/>
        <path d="M855 669 c-16 -10 -37 -22 -45 -26 -8 -3 -32 -17 -52 -30 l-38 -23 0 -110 0 -110 38 -23 c20 -13 44 -27 52 -30 8 -4 29 -16 45 -26 56 -36 55 -39 55 189 0 228 1 225 -55 189z"/>
        <path d="M391 584 c-64 -53 -64 -155 0 -208 25 -21 41 -26 88 -26 53 0 60 3 94 38 34 34 37 43 37 93 0 50 -3 58 -38 92 -35 34 -43 37 -94 37 -46 0 -62 -5 -87 -26z"/>
        <path d="M180 280 c-89 -55 -100 -63 -95 -71 3 -3 67 -41 142 -84 76 -43 145 -83 153 -90 8 -6 27 -16 43 -23 l27 -12 0 109 c0 102 -1 108 -22 119 -43 22 -108 59 -120 70 -32 26 -63 22 -128 -18z"/>
        <path d="M595 266 l-90 -52 -3 -107 c-1 -59 0 -107 2 -107 5 0 31 14 239 134 l137 78 -24 19 c-13 11 -26 19 -29 19 -2 0 -31 16 -63 35 -32 19 -63 35 -68 35 -6 -1 -51 -25 -101 -54z"/>
      </g>
    </svg>
  `,
  props: {
    size: {
      type: [Number, String],
      default: 20
    },
    className: {
      type: String,
      default: ''
    }
  }
};

const IconResearch = {
  template: `
    <svg 
      :width="size || 20" 
      :height="size || 20" 
      viewBox="0 0 128 128" 
      xmlns="http://www.w3.org/2000/svg"
      :class="className"
      fill="currentColor"
    >
      <path d="m 55.829021,124.30112 c -1.50285,-1.65 -3.35171,-4.20642 -4.10856,-5.68092 -1.65577,-3.22578 -7.05501,-18.4136 -6.60693,-18.585 0.17405,-0.0666 2.41646,-0.924851 4.98312,-1.907261 11.86617,-4.54187 13.71398,-4.70038 19.62728,-1.68364 3.0799,1.57125 6.52372,2.85682 7.65294,2.85682 2.52511,0 2.59034,-0.7694 -0.73741,8.698621 -4.94881,14.08026 -8.88271,19.30138 -14.54281,19.30138 -1.96758,0 -4.7468,-1.33028 -6.26763,-3 z"/>
      <path d="M 13.429991,99.669639 c -4.3950603,-1.08032 -6.0051303,-3.13351 -5.9062903,-7.53178 0.12793,-5.692428 0.93864,-7.333701 8.2766303,-16.755919 6.37035,-8.179725 6.37035,-8.179725 14.33333,-2.052345 7.96299,6.12738 7.96299,6.12738 7.96299,15.111384 0,8.98401 0,8.98401 -9.35808,10.58874 -9.74989,1.671921 -10.9124,1.720511 -15.30858,0.63992 z"/>
      <path d="m 92.429991,99.068329 c -6.33334,-1.38902 -6.33334,-1.38902 -6.33334,-10.536061 0,-9.147035 0,-9.147035 7.59335,-14.756569 7.593339,-5.609534 7.593339,-5.609534 14.448289,1.933502 3.97307,4.371876 7.55333,9.874026 8.51614,13.087614 1.51002,5.039974 1.41576,5.790024 -1.03573,8.241504 -3.22505,3.225051 -13.59903,4.133221 -23.188709,2.03001 z"/>
      <path d="m 44.229861,92.147219 c -0.96105,-3.581451 -1.02331,-8.845103 -0.10462,-8.845103 0.38239,0 3.0925,1.586425 6.02248,3.525389 4.82496,3.193007 5.10511,3.676305 2.97141,5.126064 -4.65988,3.16619 -8.07166,3.24052 -8.88927,0.19365 z"/>
      <path d="m 71.763321,92.341459 c -4.05208,-1.954246 -3.82532,-2.556352 2.27443,-6.039343 6.53318,-3.730487 6.72557,-3.724071 6.72557,0.224283 0,7.23068 -2.59209,8.90548 -9,5.81506 z"/>
      <path d="m 56.096651,84.207656 c -15.14325,-8.383562 -14,-6.766604 -14,-19.80087 0,-11.65371 0,-11.65371 9.23263,-17.045857 5.07795,-2.965681 9.8462,-5.392147 10.59612,-5.392147 1.52961,0 10.91597,4.864264 16.50459,8.553118 3.53261,2.33176 3.66606,2.84116 3.65016,13.933562 -0.0165,11.51332 -0.0165,11.51332 -4.64797,14.51332 -2.5473,1.65 -5.04263,3 -5.54517,3 -0.50254,0 -1.86096,0.829032 -3.0187,1.842293 -3.78943,3.31652 -7.30043,3.425543 -12.77166,0.396581 z"/>
      <path d="m 31.480351,68.505565 c -4.6163,-3.870116 -4.6163,-3.870116 0,-7.740232 4.6163,-3.870116 4.6163,-3.870116 5.03411,0 0.2298,2.128564 0.2298,5.611668 0,7.740232 -0.41781,3.870116 -0.41781,3.870116 -5.03411,0 z"/>
      <path d="m 87.429981,64.635449 c 0,-8.113685 0,-8.113685 4.66662,-4.390176 2.56665,2.04793 4.66663,4.023509 4.66663,4.390176 0,0.366667 -2.09998,2.342246 -4.66663,4.390176 -4.66662,3.723509 -4.66662,3.723509 -4.66662,-4.390176 z"/>
      <path d="m 93.763311,55.739148 c -7.66667,-5.94159 -7.66667,-5.94159 -7.66667,-14.929309 0,-8.987719 0,-8.987719 9.67314,-10.613093 10.340039,-1.737433 17.316359,-1.052106 19.804139,1.94548 2.93975,3.542189 0.45495,11.917464 -6.03988,20.357978 -3.39369,4.410356 -6.60543,8.280212 -7.13721,8.599681 -0.53177,0.319469 -4.416849,-2.092863 -8.633519,-5.360737 z"/>
      <path d="M 15.734431,53.256883 C 7.6800807,44.220101 4.7912407,36.286885 8.1881007,32.533406 11.461221,28.916641 18.449921,28.032227 28.941171,29.907118 c 9.15548,1.636176 9.15548,1.636176 9.15548,10.806361 0,9.170186 0,9.170186 -7.2764,14.545578 -4.00202,2.956466 -7.55403,5.375392 -7.89335,5.375392 -0.33932,0 -3.57593,-3.319905 -7.19247,-7.377566 z"/>
      <path d="m 43.448191,42.967782 c 0.0382,-6.286824 1.39471,-8.72769 4.43013,-7.971163 1.58675,0.39547 3.94511,1.43934 5.24081,2.319711 2.1337,1.449758 1.85355,1.933056 -2.97141,5.126063 -6.46749,4.279983 -6.72243,4.299976 -6.69953,0.525389 z"/>
      <path d="m 73.743231,42.360573 c -4.56101,-3.131699 -4.80487,-3.59314 -2.66667,-5.045915 4.65767,-3.164593 8.06943,-3.238294 8.88689,-0.191976 1.08659,4.049289 0.97677,8.859278 -0.20013,8.764952 -0.55,-0.04408 -3.25904,-1.631259 -6.02009,-3.527061 z"/>
      <path d="m 54.096651,32.634449 c -2.56666,-1.405191 -5.71666,-2.580041 -7,-2.610779 -2.84519,-0.06815 -2.88871,0.765171 0.45719,-8.754515 4.94881,-14.0802565 8.88272,-19.3013735 14.54281,-19.3013735 5.6601,0 9.594,5.221117 14.54281,19.3013735 3.31183,9.422739 3.2339,8.698627 0.93613,8.698627 -1.01992,0 -4.46992,1.186823 -7.66666,2.637384 -7.20083,3.267455 -9.88847,3.272432 -15.81228,0.02928 z"/>
    </svg>
  `,
  props: {
    size: { type: [Number, String], default: 20 },
    className: { type: String, default: '' }
  }
};


export const NAVIGATION = {
  hunters: [
    {
      id: 'borge',
      name: 'Borge',
      path: '/borge',
      icon: IconTool,
      color: 'red',
    },
    {
      id: 'ozzy',
      name: 'Ozzy',
      path: '/ozzy',
      icon: IconProng,
      color: 'green',
    },
    {
      id: 'knox',
      name: 'Knox',
      path: '/knox',
      icon: IconAnchor,
      color: 'blue',
    }
  ],
  
  upgradeCategories: [
    {
      name: 'Core Upgrades',
      links: [
        { label: 'Relics', path: '/upgrades/relics', icon: IconShield },
        { label: 'Gadgets', path: '/upgrades/gadgets', icon: IconTool },
        { label: 'Inscryptions', path: '/upgrades/inscryptions', icon: IconWriting },
      ]
    },
    {
      name: 'Utility Upgrades',
      links: [
        { label: 'Gems', path: '/upgrades/gems', icon: IconZodiacGemini },
        { label: 'Loop Mods', path: '/upgrades/loopmods', icon: IconRefresh },
        { label: 'Shard Milestones', path: '/upgrades/milestones', icon: IconHammer },
        { label: 'Researches', path: '/upgrades/researches', icon: IconMicroscope },
        { label: 'Construction Milest.', path: '/upgrades/cms', icon: IconCrane },
      ]
    },
    {
      name: 'Premium',
      links: [
        { label: 'Diamond Ultima', path: '/upgrades/ultima', icon: IconCrown },
        { label: 'Diamond Specials', path: '/upgrades/diamondspecials', icon: IconDiamond },
        { label: 'Diamond Cards', path: '/upgrades/diamondcards', icon: IconCards },
        { label: 'IAP', path: '/upgrades/iap', icon: IconCreditCard }
      ]
    }
  ],
  
  toolCategories: [
    {
      name: 'Planning',
      color: 'blue',
      tools: [
        {
          id: 'trplanner',
          name: 'TR Planner',
          path: '/tools/tr-planner',
          icon: IconClockFilled
        },
        {
          id: 'trtracking',
          name: 'TR Tracking',
          path: '/tools/tr-tracking',
          icon: IconChartLine
        },
        {
          id: 'gadgetcalculator',
          name: 'Gadget Planner',
          path: '/tools/gadget-calculator',
          icon: IconTool
        },
        {
          id: 'mechplanner',
          name: 'Mech Planner',
          path: '/tools/mech-planner',
          icon: IconRobot
        },
        {
          id: 'tsplanner',
          name: 'Trait Sphere Planner',
          path: '/tools/ts-planner',
          icon: IconHexagon
        }
      ]
    },
    {
      name: 'Calculators',
      color: 'green',
      tools: [
        {
          id: 'attrgn3calculator',
          name: 'Attr. GN#3 Calculator',
          path: '/tools/attrgn3-calculator',
          icon: IconAbacus
        },
        {
          id: 'ultimatecalculator',
          name: 'Ultima Calculator',
          path: '/tools/ultima-calculator',
          icon: IconCrown
        }
      ]
    },
    {
      name: 'Data Overview',
      color: 'purple',
      tools: [
        {
          id: 'loopmodoverview',
          name: 'Loop Mod Overview',
          path: '/tools/loopmod-overview',
          icon: IconMP,
          color: 'red'
        },   
        {
          id: 'researchoverview',
          name: 'Research Overview',
          path: '/tools/research-overview',
          icon: IconResearch,
          color: 'orange'
        }
      ]
    }
  ],

  tools: [
    {
      id: 'trplanner',
      name: 'TR Planner',
      path: '/tools/tr-planner',
      icon: IconClockFilled
    },
    {
      id: 'gadgetcalculator',
      name: 'Gadget Calculator',
      path: '/tools/gadget-calculator',
      icon: IconTool
    },
    {
      id: 'tsplanner',
      name: 'Trait Sphere Planner',
      path: '/tools/ts-planner',
      icon: IconHexagon
    },
    {
      id: 'loopmodoverview',
      name: 'Loop Mod Overview',
      path: '/tools/loopmod-overview',
      icon: IconBoxModel
    },   
    {
      id: 'researchoverview',
      name: 'Research Overview',
      path: '/tools/research-overview',
      icon: IconMicroscope
    },  
    {
      id: 'attrgn3calculator',
      name: 'Attr. GN#3 Calculator',
      path: '/tools/attrgn3-calculator',
      icon: IconAbacus
    },
    {
      id: 'ultimatecalculator',
      name: 'Ultima Calculator',
      path: '/tools/ultima-calculator',
      icon: IconCrown
    }
  ]
};