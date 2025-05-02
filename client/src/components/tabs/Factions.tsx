import { useFieldArray, useFormContext } from 'react-hook-form';
import { WorldFormData, FactionsType } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const factionTypeOptions = [
  { value: 'political', label: 'Political (kingdoms, republics, empires)' },
  { value: 'religious', label: 'Religious (churches, cults, temples)' },
  { value: 'criminal', label: 'Criminal (thieves guilds, smugglers, assassins)' },
  { value: 'merchant-guilds', label: 'Merchant Guilds (trade companies, artisans)' },
  { value: 'academic', label: 'Academic (wizards colleges, libraries, sages)' }
];

const Factions = () => {
  const { register, control, setValue, watch } = useFormContext<WorldFormData>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'factions'
  });

  const factionsCount = watch('factionsCount');

  const handleAddFaction = () => {
    append({
      name: '',
      type: 'political',
      description: '',
      relationships: ''
    });
    setValue('factionsCount', factionsCount + 1);
  };

  const handleRemoveFaction = (index: number) => {
    remove(index);
    setValue('factionsCount', factionsCount - 1);
  };

  return (
    <div className="factions-tab">
      <h2 className="font-medieval text-3xl text-primary mb-6">Factions & Organizations</h2>
      
      <div className="mb-8">
        <Label htmlFor="factionsCount" className="block font-cinzel text-brown-dark text-lg mb-2">
          Number of Major Factions
        </Label>
        <Input
          id="factionsCount"
          type="number"
          min={0}
          max={10}
          {...register('factionsCount', { valueAsNumber: true })}
          className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      
      <div className="mb-8 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="font-cinzel text-brown-dark text-xl">Faction Details</h3>
          <Button 
            type="button" 
            onClick={handleAddFaction}
            className="bg-accent hover:bg-accent-dark text-brown-dark font-bold py-1 px-3 rounded-full transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Faction
          </Button>
        </div>
        
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="p-4 bg-parchment-dark border border-brown-light rounded-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-cinzel text-brown-dark text-lg">Faction {index + 1}</h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveFaction(index)}
                className="bg-secondary hover:bg-secondary-dark text-parchment h-8 w-8 rounded-full p-0 flex items-center justify-center"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`factions.${index}.name`} className="block font-cinzel text-brown-dark mb-1">
                  Faction Name
                </Label>
                <Input
                  id={`factions.${index}.name`}
                  {...register(`factions.${index}.name`)}
                  className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="e.g. The Silver Hand Brotherhood"
                />
              </div>
              
              <div>
                <Label htmlFor={`factions.${index}.type`} className="block font-cinzel text-brown-dark mb-1">
                  Faction Type
                </Label>
                <Select
                  defaultValue={field.type}
                  onValueChange={(value) => setValue(`factions.${index}.type`, value as FactionsType)}
                >
                  <SelectTrigger 
                    id={`factions.${index}.type`}
                    className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <SelectValue placeholder="Select faction type" />
                  </SelectTrigger>
                  <SelectContent>
                    {factionTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor={`factions.${index}.description`} className="block font-cinzel text-brown-dark mb-1">
                Brief Description
              </Label>
              <Textarea
                id={`factions.${index}.description`}
                {...register(`factions.${index}.description`)}
                className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent min-h-[80px]"
                placeholder="Goals, territory, notable members..."
              />
            </div>
            
            <div>
              <Label htmlFor={`factions.${index}.relationships`} className="block font-cinzel text-brown-dark mb-1">
                Key Relationships
              </Label>
              <Textarea
                id={`factions.${index}.relationships`}
                {...register(`factions.${index}.relationships`)}
                className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent min-h-[80px]"
                placeholder="Allies, rivals, conflicts with other factions..."
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-parchment-dark p-4 rounded-lg border border-brown-light">
        <h4 className="font-cinzel text-brown-dark font-bold mb-2">Faction Relations Preview</h4>
        <p className="text-brown-dark italic mb-2">
          The relationships between factions will be generated dynamically based on the information you provide.
        </p>
        <div className="h-48 flex items-center justify-center border border-dashed border-brown-light rounded">
          <p className="text-brown-dark text-sm italic">Relationship map will appear here after generation</p>
        </div>
      </div>
    </div>
  );
};

export default Factions;
