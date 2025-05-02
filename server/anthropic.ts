import Anthropic from '@anthropic-ai/sdk';
import { WorldFormData, WorldOutput } from '@shared/schema';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key',
});

const MODEL = 'claude-3-7-sonnet-20250219';

function formatFormDataForPrompt(formData: WorldFormData): string {
  let prompt = `
## D&D World Generation Parameters

### World Settings
- World Name: ${formData.worldName || '[To be generated]'}
- Major Regions/Continents: ${formData.regionsCount}
- Climates: ${formData.climates.join(', ')}
- Terrain Types: ${formData.terrains.join(', ')}
- Magical Phenomena: ${formData.magicalPhenomena.join(', ')}

### Cultures & Politics
- Major Civilizations: ${formData.civilizationsCount}
`;

  // Add civilization details
  if (formData.civilizations.length > 0) {
    formData.civilizations.forEach((civ, index) => {
      prompt += `
#### Civilization ${index + 1}${civ.name ? ': ' + civ.name : ''}
- Dominant Races: ${civ.dominantRaces.join(', ')}
- Government: ${civ.government}
- Economy: ${civ.economy}
- Values: ${civ.values.join(', ')}
`;
    });
  }

  prompt += `
### Magic & Technology
- Magic Level: ${formData.magicLevel}
- Technology Level: ${formData.techLevel}
- Power Sources: ${formData.powerSources.join(', ')}

### Historical Background
- World Age: ${formData.worldAge}
- World-Changing Events: ${formData.worldChangingEvents}
- Origin Myths: ${formData.originMyths || '[To be generated]'}

### Factions & Organizations
- Major Factions: ${formData.factionsCount}
`;

  // Add faction details
  if (formData.factions.length > 0) {
    formData.factions.forEach((faction, index) => {
      prompt += `
#### Faction ${index + 1}${faction.name ? ': ' + faction.name : ''}
- Type: ${faction.type}
- Description: ${faction.description || '[To be generated]'}
- Relationships: ${faction.relationships || '[To be generated]'}
`;
    });
  }

  prompt += `
### Narrative Flavor
- Genre: ${formData.genre}
- Moral Tone: ${formData.moralTone}
- Themes: ${formData.themes.join(', ')}
- Deadliness: ${formData.deadliness}

### Party & Characters
- Number of Players: ${formData.playerCount}
- Starting Level Range: ${formData.startingLevelRange}
- Allowed Classes: ${formData.allowedClasses.join(', ')}
- Party Relationships: ${formData.partyRelationships || '[To be generated]'}
`;

  // Add character details
  if (formData.characters.length > 0) {
    formData.characters.forEach((character, index) => {
      prompt += `
#### Character ${index + 1}${character.name ? ': ' + character.name : ''}
- Race: ${character.race}
- Class: ${character.class}
- Background: ${character.background}
- Personality Traits: ${character.personalityTraits || '[To be generated]'}
- Ideals: ${character.ideals || '[To be generated]'}
- Bonds: ${character.bonds || '[To be generated]'}
- Flaws: ${character.flaws || '[To be generated]'}
`;
    });
  }

  prompt += `
### Miscellaneous Options
- Naming Convention: ${formData.namingConvention}
- Measurement System: ${formData.measurementSystem}
${formData.customSeed ? `- Custom Seed: ${formData.customSeed}` : ''}
`;

  return prompt;
}

export async function generateWorld(formData: WorldFormData): Promise<WorldOutput> {
  const formattedData = formatFormDataForPrompt(formData);
  
  const systemPrompt = `You are an expert Dungeons & Dragons Dungeon Master and worldbuilder. You are tasked with creating a complete and cohesive D&D campaign setting based on the user parameters. 
  
Areas where the user has not provided input, you should make appropriate decisions based on the existing context and the type of world being built.

Your response should be comprehensive and detailed, divided into the following four sections:

1. WORLD: Provide a detailed description of the world, including geography, history, cultures, magic systems, and important locations. This should include enough detail for a Dungeon Master to describe the setting to players.

2. NPCS: Create a set of interesting non-player characters that inhabit this world. Include major leaders, potential allies, villains, and other important figures. For each NPC, provide a name, brief physical description, personality traits, motivations, and role in the world.

3. PLOT: Develop an overarching campaign storyline with a main quest and several side quests. The plot should tie into the world's history and factions, providing hooks for character involvement. Include a beginning, middle, and potential endings. Break this down into approximately 5-8 major story arcs or chapters.

4. ENCOUNTERS: Design a variety of potential encounters appropriate to the setting and difficulty level. Include combat encounters with suggested monster stat blocks, social encounters with key NPCs, puzzle or trap encounters, and exploration challenges. Each encounter should have a purpose within the larger narrative.

Your content should be formatted in a way that makes it easy for a Dungeon Master to use directly in their game. Use D&D 5th Edition terminology and rules.`;

  const userPrompt = `Please generate a complete D&D campaign setting based on the following parameters:

${formattedData}

For any missing information, please fill in appropriate details that would create a cohesive and interesting world.`;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = response.content[0].text;
    
    // Parse the response into the four sections
    const sections: Record<string, string> = {
      world: '',
      npcs: '',
      plot: '',
      encounters: ''
    };
    
    // Simple parsing of sections based on headers
    if (content.includes('WORLD:')) {
      const worldStart = content.indexOf('WORLD:') + 6;
      const worldEnd = content.includes('NPCS:') ? content.indexOf('NPCS:') : content.length;
      sections.world = content.substring(worldStart, worldEnd).trim();
    }
    
    if (content.includes('NPCS:')) {
      const npcsStart = content.indexOf('NPCS:') + 5;
      const npcsEnd = content.includes('PLOT:') ? content.indexOf('PLOT:') : content.length;
      sections.npcs = content.substring(npcsStart, npcsEnd).trim();
    }
    
    if (content.includes('PLOT:')) {
      const plotStart = content.indexOf('PLOT:') + 5;
      const plotEnd = content.includes('ENCOUNTERS:') ? content.indexOf('ENCOUNTERS:') : content.length;
      sections.plot = content.substring(plotStart, plotEnd).trim();
    }
    
    if (content.includes('ENCOUNTERS:')) {
      const encountersStart = content.indexOf('ENCOUNTERS:') + 11;
      sections.encounters = content.substring(encountersStart).trim();
    }
    
    // If sections weren't properly identified, use the whole response
    if (!sections.world && !sections.npcs && !sections.plot && !sections.encounters) {
      sections.world = content;
    }
    
    return {
      world: sections.world || 'No world content was generated.',
      npcs: sections.npcs || 'No NPCs were generated.',
      plot: sections.plot || 'No plot was generated.',
      encounters: sections.encounters || 'No encounters were generated.'
    };
  } catch (error) {
    console.error('Error generating world with Claude:', error);
    throw new Error('Failed to generate world with Claude API. Please try again later.');
  }
}
