import { useFormContext } from 'react-hook-form';
import { WorldFormData, GenreType, MoralTone, ThemeType, DeadlinessLevel } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MultiSelect } from '@/components/ui/multi-select';
import { useState } from 'react';

const genreOptions = [
  { value: 'high-fantasy', label: 'High Fantasy - Epic quests, clear good vs. evil' },
  { value: 'grimdark', label: 'Grimdark - Gritty, morally ambiguous, brutal' },
  { value: 'sword-and-sorcery', label: 'Sword & Sorcery - Personal stakes, adventure' },
  { value: 'mystery', label: 'Mystery - Investigation, hidden truths' },
  { value: 'political-intrigue', label: 'Political Intrigue - Schemes, power plays' },
  { value: 'horror', label: 'Horror - Eldritch, supernatural terror' }
];

const moralToneOptions = [
  { value: 'black-and-white', label: 'Black & White - Clear heroes and villains' },
  { value: 'shades-of-gray', label: 'Shades of Gray - Complex motivations' },
  { value: 'ambiguous', label: 'Ambiguous - No clear right or wrong' }
];

const themeOptions = [
  { value: 'redemption', label: 'Redemption' },
  { value: 'betrayal', label: 'Betrayal' },
  { value: 'survival', label: 'Survival' },
  { value: 'discovery', label: 'Discovery' },
  { value: 'revolution', label: 'Revolution' }
];

const Narrative = () => {
  const { setValue, watch } = useFormContext<WorldFormData>();
  const [deadlinessSlider, setDeadlinessSlider] = useState<number>(() => {
    const currentDeadliness = watch('deadliness');
    const levelMap: Record<DeadlinessLevel, number> = {
      'low': 25,
      'moderate': 50,
      'high': 75,
      'lethal': 100
    };
    return levelMap[currentDeadliness] || 50;
  });
  
  const genre = watch('genre');
  const moralTone = watch('moralTone');
  const themes = watch('themes');
  const deadliness = watch('deadliness');

  const handleDeadlinessChange = (value: number[]) => {
    setDeadlinessSlider(value[0]);
    let newLevel: DeadlinessLevel = 'moderate';
    
    if (value[0] <= 25) {
      newLevel = 'low';
    } else if (value[0] <= 50) {
      newLevel = 'moderate';
    } else if (value[0] <= 75) {
      newLevel = 'high';
    } else {
      newLevel = 'lethal';
    }
    
    setValue('deadliness', newLevel);
  };

  const getDeadlinessDescription = () => {
    const descriptions = {
      'low': 'Characters rarely die. Combat is dangerous but rarely fatal. Resurrection is accessible.',
      'moderate': 'Death is a real threat, but heroes usually survive. Resurrection exists but is costly.',
      'high': 'Combat is very dangerous. Main characters can die. Resurrection is rare and difficult.',
      'lethal': 'Deadly world where anyone can die at any time. Resurrection might not exist at all.'
    };
    return descriptions[deadliness];
  };

  return (
    <div className="narrative-tab">
      <h2 className="font-medieval text-3xl text-primary mb-6">Narrative Flavor</h2>
      
      <div className="mb-8">
        <Label htmlFor="genre" className="block font-cinzel text-brown-dark text-lg mb-2">
          Primary Genre
        </Label>
        <Select
          value={genre}
          onValueChange={(value) => setValue('genre', value as GenreType)}
        >
          <SelectTrigger 
            id="genre"
            className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <SelectValue placeholder="Select primary genre" />
          </SelectTrigger>
          <SelectContent>
            {genreOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-8">
        <Label htmlFor="moralTone" className="block font-cinzel text-brown-dark text-lg mb-2">
          Moral Tone
        </Label>
        <Select
          value={moralTone}
          onValueChange={(value) => setValue('moralTone', value as MoralTone)}
        >
          <SelectTrigger 
            id="moralTone"
            className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <SelectValue placeholder="Select moral tone" />
          </SelectTrigger>
          <SelectContent>
            {moralToneOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-8">
        <Label className="block font-cinzel text-brown-dark text-lg mb-2">
          Central Themes
        </Label>
        <MultiSelect
          options={themeOptions}
          selected={themes}
          onChange={(selected) => setValue('themes', selected as ThemeType[])}
        />
        <p className="mt-2 text-sm text-brown-dark italic">
          Select the central themes that will run through your campaign's storylines.
        </p>
      </div>
      
      <div className="mb-8">
        <Label className="block font-cinzel text-brown-dark text-lg mb-2">
          How deadly should the world feel?
        </Label>
        <div className="mb-4">
          <Slider 
            value={[deadlinessSlider]} 
            min={0} 
            max={100} 
            step={1} 
            onValueChange={handleDeadlinessChange} 
            className="my-6"
          />
          <div className="flex justify-between text-brown-dark text-sm">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Lethal</span>
          </div>
        </div>
        <div className="bg-parchment-dark p-3 rounded-md text-brown-dark italic">
          {getDeadlinessDescription()}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="font-cinzel text-brown-dark text-xl mb-4">Narrative Style Preview</h3>
        <div className="bg-parchment-dark border-4 border-brown-light rounded-lg p-4">
          <div className="prose prose-sm text-brown-dark max-w-none">
            <p className="font-italic">Based on your selections, your campaign will have this narrative style:</p>
            <div className="mt-4 border-l-4 border-accent-light pl-4 py-1">
              <p>
                A <span className="font-bold">{genre.replace('-', ' ')}</span> adventure with a 
                <span className="font-bold"> {moralTone.replace('-', ' ')}</span> moral framework, 
                where the world presents a <span className="font-bold">{deadliness}</span> threat level.
              </p>
              <p className="mt-2">
                The story will explore themes of <span className="font-bold">
                  {themes.map(t => t.replace('-', ' ')).join(', ')}
                </span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Narrative;
