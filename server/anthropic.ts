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

// Function to generate DM scripts for speech synthesis
export async function generateDMScript(worldOutput: WorldOutput): Promise<string> {
  try {
    const systemPrompt = `You are an expert Dungeons & Dragons Dungeon Master creating a narration script that will be used with text-to-speech for a D&D game session. 
    
Your task is to create a detailed, engaging script for the DM to read aloud during the game, based on the world, NPCs, plot, and encounters provided. The script should:

1. Include narrative descriptions of key locations, scenes, and moments in the campaign.
2. Contain dialogue for NPCs with clear speaker attributions (e.g., "Guard Captain: Halt! Who goes there?")
3. Include atmospheric descriptions that set the mood and tone.
4. Provide transition narration between scenes and locations.
5. Structure the script to follow the campaign's plot points and story arcs.
6. Include brief stage directions or emotion cues in [brackets] where appropriate.
7. Format the script for easy reading, with speaker names in bold or separated clearly from dialogue.
8. Use appropriate pacing, with shorter sentences for action and longer, more detailed ones for descriptions.
9. Add vocal direction notes for emphasis or tone where helpful.

The script should be optimized for text-to-speech systems, avoiding complex words or formatting that might not be interpreted correctly by voice synthesis.`;

    const userPrompt = `Based on the following campaign materials, create a comprehensive DM narration script optimized for voice delivery.

WORLD DESCRIPTION:
${worldOutput.world}

NPCs:
${worldOutput.npcs}

PLOT:
${worldOutput.plot}

ENCOUNTERS:
${worldOutput.encounters}

Format the script in a way that makes it easy for text-to-speech systems to differentiate between narrative descriptions, character dialogue, and scene transitions.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error generating DM script with Claude:', error);
    throw new Error('Failed to generate DM script with Claude API. Please try again later.');
  }
}

// Function to generate player character sheets
export async function generatePlayerSheets(worldOutput: WorldOutput): Promise<string> {
  try {
    const systemPrompt = `You are an expert Dungeons & Dragons game designer creating character sheets for player characters. 
    
Your task is to create detailed character sheets for players based on the world, NPCs, plot, and encounters provided. The character sheets should:

1. Include all standard D&D 5e character sheet elements (ability scores, skills, equipment, etc.)
2. Be tailored to the world and campaign setting
3. Provide rich background details that connect to the story
4. Include character-specific plot hooks and connections to NPCs
5. Feature appropriate starting equipment for the setting and character class
6. Include motivations, goals, and potential character arcs
7. Be balanced and playable while remaining interesting

Format the sheets clearly with distinct sections for different types of information.`;

    const userPrompt = `Based on the following campaign materials, create detailed character sheets for player characters appropriate for this campaign setting.

WORLD DESCRIPTION:
${worldOutput.world}

NPCs:
${worldOutput.npcs}

PLOT:
${worldOutput.plot}

ENCOUNTERS:
${worldOutput.encounters}

For each character sheet, include the following sections:
- Character name, race, class, and background
- Ability scores and key skills
- Background and personal history
- Connections to the world and campaign
- Starting equipment
- Character hooks and potential goals
- Personality traits, ideals, bonds, and flaws`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error generating player sheets with Claude:', error);
    throw new Error('Failed to generate player sheets with Claude API. Please try again later.');
  }
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
