import { useFormContext } from 'react-hook-form';
import { WorldFormData, Climate, Terrain, MagicalPhenomena } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';

const climateOptions = [
  { value: 'temperate', label: 'Temperate' },
  { value: 'arid', label: 'Arid' },
  { value: 'tropical', label: 'Tropical' },
  { value: 'polar', label: 'Polar' },
  { value: 'alpine', label: 'Alpine' }
];

const terrainOptions = [
  { value: 'mountains', label: 'Mountains' },
  { value: 'forests', label: 'Forests' },
  { value: 'rivers', label: 'Rivers' },
  { value: 'deserts', label: 'Deserts' },
  { value: 'oceans', label: 'Oceans' },
  { value: 'plains', label: 'Plains' }
];

const magicalPhenomenaOptions = [
  { value: 'ley-lines', label: 'Ley Lines' },
  { value: 'magical-storms', label: 'Magical Storms' },
  { value: 'floating-islands', label: 'Floating Islands' },
  { value: 'none', label: 'None' },
  { value: 'other', label: 'Other' }
];

const WorldSettings = () => {
  const { register, setValue, watch } = useFormContext<WorldFormData>();
  
  const climates = watch('climates');
  const terrains = watch('terrains');
  const magicalPhenomena = watch('magicalPhenomena');

  return (
    <div className="world-settings-tab">
      <h2 className="font-medieval text-3xl text-primary mb-6">World Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* World Name */}
        <div className="form-group">
          <Label htmlFor="worldName" className="block font-cinzel text-brown-dark text-lg mb-2">World Name</Label>
          <Input
            id="worldName"
            {...register('worldName')}
            className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Enter a name for your world"
          />
        </div>
        
        {/* Regions Count */}
        <div className="form-group">
          <Label htmlFor="regionsCount" className="block font-cinzel text-brown-dark text-lg mb-2">Major Regions/Continents</Label>
          <Input
            id="regionsCount"
            type="number"
            min={1}
            max={10}
            {...register('regionsCount', { valueAsNumber: true })}
            className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <Label className="block font-cinzel text-brown-dark text-lg mb-2">Climates</Label>
        <MultiSelect
          options={climateOptions}
          selected={climates}
          onChange={(selected) => setValue('climates', selected as Climate[])}
        />
      </div>
      
      <div className="mb-8">
        <Label className="block font-cinzel text-brown-dark text-lg mb-2">Common Terrain Types</Label>
        <MultiSelect
          options={terrainOptions}
          selected={terrains}
          onChange={(selected) => setValue('terrains', selected as Terrain[])}
        />
      </div>
      
      <div className="mb-8">
        <Label className="block font-cinzel text-brown-dark text-lg mb-2">Magical Phenomena</Label>
        <MultiSelect
          options={magicalPhenomenaOptions}
          selected={magicalPhenomena}
          onChange={(selected) => setValue('magicalPhenomena', selected as MagicalPhenomena[])}
        />
      </div>
      
      {/* World Map Preview */}
      <div className="mb-8">
        <h3 className="font-cinzel text-brown-dark text-xl mb-4">World Map Preview</h3>
        <div className="bg-parchment-dark border-4 border-brown-light rounded-lg p-4 flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=1170&auto=format&fit=crop" 
            alt="Fantasy World Map" 
            className="max-w-full h-auto rounded shadow-lg" 
          />
        </div>
        <p className="text-center text-brown-dark mt-2 italic">Preview will update as you define your world</p>
      </div>
    </div>
  );
};

export default WorldSettings;
