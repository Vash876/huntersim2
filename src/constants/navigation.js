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
} from '@tabler/icons-vue';


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
  
  tools: [
    {
      id: 'trplanner',
      name: 'TR Planner',
      path: '/tools/tr-planner',
      icon: IconClockFilled
    },
    // {
    //   id: 'gemplanner',
    //   name: 'Gem Planner',
    //   path: '/tools/gem-planner',
    //   icon: IconZodiacGemini
    // },
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
    // {
    //   id: 'attrgn3calculator',
    //   name: 'Attr. GN#3 Calculator',
    //   path: '/tools/attrgn3-calculator',
    //   icon: IconAbacus
    // },
    {
      id: 'ultimatecalculator',
      name: 'Ultima Calculator',
      path: '/tools/ultima-calculator',
      icon: IconCrown
    }
  ]
};