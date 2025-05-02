import { useFieldArray, useFormContext } from 'react-hook-form';
import { WorldFormData, Race, GovernmentType, EconomicBase, Values } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';

const raceOptions = [
  { value: 'human', label: 'Human' },
  { value: 'elf', label: 'Elf' },
  { value: 'dwarf', label: 'Dwarf' },
  { value: 'halfling', label: 'Halfling' },
  { value: 'gnome', label: 'Gnome' },
  { value: 'half-elf', label: 'Half-Elf' },
  { value: 'half-orc', label: 'Half-Orc' },
  { value: 'dragonborn', label: 'Dragonborn' },
  { value: 'tiefling', label: 'Tiefling' },
  { value: 'other', label: 'Other' }
];

const governmentOptions = [
  { value: 'monarchy', label: 'Monarchy' },
  { value: 'theocracy', label: 'Theocracy' },
  { value: 'democracy', label: 'Democracy' },
  { value: 'oligarchy', label: 'Oligarchy' },
  { value: 'tribal', label: 'Tribal' },
  { value: 'other', label: 'Other' }
];

const economyOptions = [
  { value: 'agrarian', label: 'Agrarian' },
  { value: 'mercantile', label: 'Mercantile' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'magical', label: 'Magical Economy' }
];

const valuesOptions = [
  { value: 'honor', label: 'Honor' },
  { value: 'conquest', label: 'Conquest' },
  { value: 'secrecy', label: 'Secrecy' },
  { value: 'freedom', label: 'Freedom' },
  { value: 'knowledge', label: 'Knowledge' },
  { value: 'tradition', label: 'Tradition' }
];

const CulturesPolitics = () => {
  const { register, control, setValue, watch } = useFormContext<WorldFormData>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'civilizations'
  });

  const civilizationsCount = watch('civilizationsCount');

  const handleAddCivilization = () => {
    append({
      name: '',
      dominantRaces: ['human'],
      government: 'monarchy',
      economy: 'agrarian',
      values: ['honor']
    });
    setValue('civilizationsCount', civilizationsCount + 1);
  };

  const handleRemoveCivilization = (index: number) => {
    remove(index);
    setValue('civilizationsCount', civilizationsCount - 1);
  };

  return (
    <div className="cultures-politics-tab">
      <h2 className="font-medieval text-3xl text-primary mb-6">Cultures & Politics</h2>
      
      <div className="mb-8">
        <Label htmlFor="civilizationsCount" className="block font-cinzel text-brown-dark text-lg mb-2">
          Number of Major Civilizations
        </Label>
        <Input
          id="civilizationsCount"
          type="number"
          min={1}
          max={10}
          {...register('civilizationsCount', { valueAsNumber: true })}
          className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      
      <div className="mb-8 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="font-cinzel text-brown-dark text-xl">Civilization Details</h3>
          <Button 
            type="button" 
            onClick={handleAddCivilization}
            className="bg-accent hover:bg-accent-dark text-brown-dark font-bold py-1 px-3 rounded-full transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Civilization
          </Button>
        </div>
        
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="p-4 bg-parchment-dark border border-brown-light rounded-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-cinzel text-brown-dark text-lg">Civilization {index + 1}</h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveCivilization(index)}
                className="bg-secondary hover:bg-secondary-dark text-parchment h-8 w-8 rounded-full p-0 flex items-center justify-center"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`civilizations.${index}.name`} className="block font-cinzel text-brown-dark mb-1">
                  Civilization Name
                </Label>
                <Input
                  id={`civilizations.${index}.name`}
                  {...register(`civilizations.${index}.name`)}
                  className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="e.g. Elven Kingdom of Silverwood"
                />
              </div>
              
              <div>
                <Label htmlFor={`civilizations.${index}.dominantRaces`} className="block font-cinzel text-brown-dark mb-1">
                  Dominant Races
                </Label>
                <MultiSelect
                  options={raceOptions}
                  selected={watch(`civilizations.${index}.dominantRaces`)}
                  onChange={(selected) => setValue(`civilizations.${index}.dominantRaces`, selected as Race[])}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`civilizations.${index}.government`} className="block font-cinzel text-brown-dark mb-1">
                  Government Type
                </Label>
                <Select
                  defaultValue={field.government}
                  onValueChange={(value) => setValue(`civilizations.${index}.government`, value as GovernmentType)}
                >
                  <SelectTrigger className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent">
                    <SelectValue placeholder="Select government type" />
                  </SelectTrigger>
                  <SelectContent>
                    {governmentOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor={`civilizations.${index}.economy`} className="block font-cinzel text-brown-dark mb-1">
                  Economic Base
                </Label>
                <Select
                  defaultValue={field.economy}
                  onValueChange={(value) => setValue(`civilizations.${index}.economy`, value as EconomicBase)}
                >
                  <SelectTrigger className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent">
                    <SelectValue placeholder="Select economy type" />
                  </SelectTrigger>
                  <SelectContent>
                    {economyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor={`civilizations.${index}.values`} className="block font-cinzel text-brown-dark mb-1">
                Cultural Values
              </Label>
              <MultiSelect
                options={valuesOptions}
                selected={watch(`civilizations.${index}.values`)}
                onChange={(selected) => setValue(`civilizations.${index}.values`, selected as Values[])}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CulturesPolitics;
