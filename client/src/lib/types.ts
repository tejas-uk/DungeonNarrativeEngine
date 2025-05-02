export type TabName = 
  | 'world-settings'
  | 'cultures-politics'
  | 'magic-technology'
  | 'history'
  | 'factions'
  | 'narrative'
  | 'party';

export type Climate = 'temperate' | 'arid' | 'tropical' | 'polar' | 'alpine';

export type Terrain = 'mountains' | 'forests' | 'rivers' | 'deserts' | 'oceans' | 'plains';

export type MagicalPhenomena = 'ley-lines' | 'magical-storms' | 'floating-islands' | 'none' | 'other';

export type GovernmentType = 
  | 'monarchy' 
  | 'theocracy' 
  | 'democracy' 
  | 'oligarchy'
  | 'tribal' 
  | 'other';

export type EconomicBase =
  | 'agrarian'
  | 'mercantile'
  | 'industrial'
  | 'magical';

export type Values =
  | 'honor'
  | 'conquest'
  | 'secrecy'
  | 'freedom'
  | 'knowledge'
  | 'tradition';

export type MagicLevel = 'none' | 'rare' | 'common' | 'ubiquitous';

export type TechLevel = 
  | 'stone-age'
  | 'bronze-age'
  | 'medieval'
  | 'renaissance'
  | 'steampunk';

export type PowerSource = 
  | 'arcane'
  | 'divine'
  | 'psionic'
  | 'elemental'
  | 'technological';

export type WorldAge = 'ancient' | 'mid-age' | 'newly-formed';

export type FactionsType = 
  | 'political'
  | 'religious'
  | 'criminal'
  | 'merchant-guilds'
  | 'academic';

export type GenreType = 
  | 'high-fantasy'
  | 'grimdark'
  | 'sword-and-sorcery'
  | 'mystery'
  | 'political-intrigue'
  | 'horror';

export type MoralTone = 
  | 'black-and-white'
  | 'shades-of-gray'
  | 'ambiguous';

export type ThemeType = 
  | 'redemption'
  | 'betrayal'
  | 'survival'
  | 'discovery'
  | 'revolution';

export type DeadlinessLevel = 'low' | 'moderate' | 'high' | 'lethal';

export type Race = 
  | 'human'
  | 'elf'
  | 'dwarf'
  | 'halfling'
  | 'gnome'
  | 'half-elf'
  | 'half-orc'
  | 'dragonborn'
  | 'tiefling'
  | 'other';

export type Class = 
  | 'barbarian'
  | 'bard'
  | 'cleric'
  | 'druid'
  | 'fighter'
  | 'monk'
  | 'paladin'
  | 'ranger'
  | 'rogue'
  | 'sorcerer'
  | 'warlock'
  | 'wizard'
  | 'artificer'
  | 'blood-hunter';

export type Background = 
  | 'acolyte'
  | 'charlatan'
  | 'criminal'
  | 'entertainer'
  | 'folk-hero'
  | 'guild-artisan'
  | 'hermit'
  | 'noble'
  | 'outlander'
  | 'sage'
  | 'sailor'
  | 'soldier'
  | 'urchin';

export type NamingConvention = 
  | 'real-world'
  | 'elvish'
  | 'norse'
  | 'random-fantasy'
  | 'custom';

export type MeasurementSystem = 'metric' | 'imperial';

export type LevelRange = 
  | '1-3'
  | '4-6'
  | '7-10'
  | '11-16'
  | '17-20';

export type Civilization = {
  name: string;
  dominantRaces: Race[];
  government: GovernmentType;
  economy: EconomicBase;
  values: Values[];
};

export type Faction = {
  name: string;
  type: FactionsType;
  description: string;
  relationships: string;
};

export type Character = {
  name: string;
  race: Race;
  class: Class;
  background: Background;
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
};

export type WorldFormData = {
  // World Settings
  worldName: string;
  regionsCount: number;
  climates: Climate[];
  terrains: Terrain[];
  magicalPhenomena: MagicalPhenomena[];
  
  // Cultures and Politics
  civilizationsCount: number;
  civilizations: Civilization[];
  
  // Magic & Technology
  magicLevel: MagicLevel;
  techLevel: TechLevel;
  powerSources: PowerSource[];
  
  // Historical Background
  worldAge: WorldAge;
  worldChangingEvents: number;
  originMyths: string;
  
  // Factions and Organizations
  factionsCount: number;
  factions: Faction[];
  
  // Narrative Flavor
  genre: GenreType;
  moralTone: MoralTone;
  themes: ThemeType[];
  deadliness: DeadlinessLevel;
  
  // Party & Characters
  playerCount: number;
  startingLevelRange: LevelRange;
  allowedClasses: Class[];
  characters: Character[];
  partyRelationships: string;
  
  // Miscellaneous Options
  namingConvention: NamingConvention;
  measurementSystem: MeasurementSystem;
  customSeed?: string;
};

export type OutputTab = 'world' | 'npcs' | 'plot' | 'encounters' | 'dm-script' | 'player-sheets';

export type WorldOutput = {
  world: string;
  npcs: string;
  plot: string;
  encounters: string;
  dmScript?: string;
  playerSheets?: string;
};

export type SavedWorld = {
  id: number;
  name: string;
  formData: WorldFormData;
  output?: WorldOutput;
  createdAt: string;
};
