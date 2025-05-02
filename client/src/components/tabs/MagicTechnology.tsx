import { useFormContext } from 'react-hook-form';
import { WorldFormData, MagicLevel, TechLevel, PowerSource } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MultiSelect } from '@/components/ui/multi-select';
import { useState } from 'react';

const magicLevelOptions = [
  { value: 'none', label: 'None - Magic is mythical or doesn\'t exist' },
  { value: 'rare', label: 'Rare - Magic is uncommon and mysterious' },
  { value: 'common', label: 'Common - Magic is a regular part of society' },
  { value: 'ubiquitous', label: 'Ubiquitous - Magic is everywhere and essential' }
];

const techLevelOptions = [
  { value: 'stone-age', label: 'Stone Age - Primitive tools and weapons' },
  { value: 'bronze-age', label: 'Bronze Age - Early metallurgy and agriculture' },
  { value: 'medieval', label: 'Medieval - Castles, plate armor, crossbows' },
  { value: 'renaissance', label: 'Renaissance - Early gunpowder, printing press' },
  { value: 'steampunk', label: 'Steampunk - Advanced machines, early industry' }
];

const powerSourceOptions = [
  { value: 'arcane', label: 'Arcane - Academic magic, wizardry' },
  { value: 'divine', label: 'Divine - Deity-granted powers, miracles' },
  { value: 'psionic', label: 'Psionic - Mental abilities, psychic powers' },
  { value: 'elemental', label: 'Elemental - Nature-based, druidic magic' },
  { value: 'technological', label: 'Technological - Magitech, artifice' }
];

const MagicTechnology = () => {
  const { setValue, watch } = useFormContext<WorldFormData>();
  const [magicLevelSlider, setMagicLevelSlider] = useState<number>(() => {
    const currentMagicLevel = watch('magicLevel');
    const levelMap: Record<MagicLevel, number> = {
      'none': 0,
      'rare': 33,
      'common': 66,
      'ubiquitous': 100
    };
    return levelMap[currentMagicLevel] || 66;
  });
  
  const magicLevel = watch('magicLevel');
  const techLevel = watch('techLevel');
  const powerSources = watch('powerSources');

  const handleMagicLevelChange = (value: number[]) => {
    setMagicLevelSlider(value[0]);
    let newLevel: MagicLevel = 'common';
    
    if (value[0] <= 25) {
      newLevel = 'none';
    } else if (value[0] <= 50) {
      newLevel = 'rare';
    } else if (value[0] <= 75) {
      newLevel = 'common';
    } else {
      newLevel = 'ubiquitous';
    }
    
    setValue('magicLevel', newLevel);
  };

  const getMagicLevelDescription = () => {
    const descriptions = {
      'none': 'A world where magic is merely superstition, or the stuff of legends long forgotten.',
      'rare': 'Magic is uncommon and often feared or misunderstood. Practitioners are rare and exceptional.',
      'common': 'Magic is an acknowledged part of everyday life, with formal training and institutions.',
      'ubiquitous': 'Magic infuses everything, from transportation to food production. It is as fundamental as technology.'
    };
    return descriptions[magicLevel];
  };

  return (
    <div className="magic-technology-tab">
      <h2 className="font-medieval text-3xl text-primary mb-6">Magic & Technology</h2>
      
      <div className="mb-8">
        <Label className="block font-cinzel text-brown-dark text-lg mb-2">
          How prevalent is magic?
        </Label>
        <div className="mb-4">
          <Slider 
            value={[magicLevelSlider]} 
            min={0} 
            max={100} 
            step={1} 
            onValueChange={handleMagicLevelChange} 
            className="my-6"
          />
          <div className="flex justify-between text-brown-dark text-sm">
            <span>None</span>
            <span>Rare</span>
            <span>Common</span>
            <span>Ubiquitous</span>
          </div>
        </div>
        <div className="bg-parchment-dark p-3 rounded-md text-brown-dark italic">
          {getMagicLevelDescription()}
        </div>
      </div>
      
      <div className="mb-8">
        <Label htmlFor="techLevel" className="block font-cinzel text-brown-dark text-lg mb-2">
          What is the technology level?
        </Label>
        <Select
          value={techLevel}
          onValueChange={(value) => setValue('techLevel', value as TechLevel)}
        >
          <SelectTrigger 
            id="techLevel"
            className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <SelectValue placeholder="Select technology level" />
          </SelectTrigger>
          <SelectContent>
            {techLevelOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-8">
        <Label className="block font-cinzel text-brown-dark text-lg mb-2">
          Dominant Power Sources
        </Label>
        <MultiSelect
          options={powerSourceOptions}
          selected={powerSources}
          onChange={(selected) => setValue('powerSources', selected as PowerSource[])}
        />
        <p className="mt-2 text-sm text-brown-dark italic">
          Select the types of power that fuel magic and exceptional abilities in your world.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="font-cinzel text-brown-dark text-xl mb-4">Technology & Magic Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-parchment-dark border-2 border-brown-light rounded-lg p-3">
            <h4 className="font-cinzel text-brown-dark font-bold mb-2">Common Magical Items</h4>
            <ul className="list-disc list-inside text-brown-dark">
              {magicLevel === 'none' && (
                <li className="italic">Magic items are essentially non-existent</li>
              )}
              {magicLevel === 'rare' && (
                <>
                  <li>Minor healing potions (rare)</li>
                  <li>Simple charms and talismans</li>
                </>
              )}
              {magicLevel === 'common' && (
                <>
                  <li>Healing potions and salves</li>
                  <li>Light-producing crystals</li>
                  <li>Enchanted tools and weapons</li>
                </>
              )}
              {magicLevel === 'ubiquitous' && (
                <>
                  <li>Magical household appliances</li>
                  <li>Personal teleportation devices</li>
                  <li>Animated servants and constructs</li>
                  <li>Magically enhanced foods and medicines</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="bg-parchment-dark border-2 border-brown-light rounded-lg p-3">
            <h4 className="font-cinzel text-brown-dark font-bold mb-2">Available Technology</h4>
            <ul className="list-disc list-inside text-brown-dark">
              {techLevel === 'stone-age' && (
                <>
                  <li>Stone tools and weapons</li>
                  <li>Basic agriculture</li>
                  <li>Simple shelters</li>
                </>
              )}
              {techLevel === 'bronze-age' && (
                <>
                  <li>Bronze weapons and armor</li>
                  <li>Irrigation systems</li>
                  <li>Early writing systems</li>
                </>
              )}
              {techLevel === 'medieval' && (
                <>
                  <li>Steel weapons and plate armor</li>
                  <li>Castles and fortifications</li>
                  <li>Sailing ships and caravans</li>
                </>
              )}
              {techLevel === 'renaissance' && (
                <>
                  <li>Early firearms</li>
                  <li>Printing press</li>
                  <li>Advanced sailing vessels</li>
                </>
              )}
              {techLevel === 'steampunk' && (
                <>
                  <li>Steam-powered machines</li>
                  <li>Airships and locomotives</li>
                  <li>Mechanical automata</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicTechnology;
