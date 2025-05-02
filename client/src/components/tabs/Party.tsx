import { useFieldArray, useFormContext } from 'react-hook-form';
import { WorldFormData, LevelRange, Class, Race, Background } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const levelRangeOptions = [
  { value: '1-3', label: 'Levels 1-3 (Beginning adventurers)' },
  { value: '4-6', label: 'Levels 4-6 (Heroes of local renown)' },
  { value: '7-10', label: 'Levels 7-10 (Heroes of regional importance)' },
  { value: '11-16', label: 'Levels 11-16 (Masters of the realm)' },
  { value: '17-20', label: 'Levels 17-20 (World-shaping powers)' }
];

const classOptions = [
  { value: 'barbarian', label: 'Barbarian' },
  { value: 'bard', label: 'Bard' },
  { value: 'cleric', label: 'Cleric' },
  { value: 'druid', label: 'Druid' },
  { value: 'fighter', label: 'Fighter' },
  { value: 'monk', label: 'Monk' },
  { value: 'paladin', label: 'Paladin' },
  { value: 'ranger', label: 'Ranger' },
  { value: 'rogue', label: 'Rogue' },
  { value: 'sorcerer', label: 'Sorcerer' },
  { value: 'warlock', label: 'Warlock' },
  { value: 'wizard', label: 'Wizard' },
  { value: 'artificer', label: 'Artificer' },
  { value: 'blood-hunter', label: 'Blood Hunter' }
];

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

const backgroundOptions = [
  { value: 'acolyte', label: 'Acolyte' },
  { value: 'charlatan', label: 'Charlatan' },
  { value: 'criminal', label: 'Criminal' },
  { value: 'entertainer', label: 'Entertainer' },
  { value: 'folk-hero', label: 'Folk Hero' },
  { value: 'guild-artisan', label: 'Guild Artisan' },
  { value: 'hermit', label: 'Hermit' },
  { value: 'noble', label: 'Noble' },
  { value: 'outlander', label: 'Outlander' },
  { value: 'sage', label: 'Sage' },
  { value: 'sailor', label: 'Sailor' },
  { value: 'soldier', label: 'Soldier' },
  { value: 'urchin', label: 'Urchin' }
];

const Party = () => {
  const { register, control, setValue, watch } = useFormContext<WorldFormData>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'characters'
  });

  const playerCount = watch('playerCount');
  const startingLevelRange = watch('startingLevelRange');
  const allowedClasses = watch('allowedClasses');
  const partyRelationships = watch('partyRelationships');

  const handleAddCharacter = () => {
    append({
      name: '',
      race: 'human',
      class: 'fighter',
      background: 'soldier',
      personalityTraits: '',
      ideals: '',
      bonds: '',
      flaws: ''
    });
    setValue('playerCount', playerCount + 1);
  };

  const handleRemoveCharacter = (index: number) => {
    remove(index);
    setValue('playerCount', playerCount - 1);
  };

  return (
    <div className="party-tab">
      <h2 className="font-medieval text-3xl text-primary mb-6">Party & Characters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label htmlFor="playerCount" className="block font-cinzel text-brown-dark text-lg mb-2">
            Number of Players
          </Label>
          <Input
            id="playerCount"
            type="number"
            min={1}
            max={8}
            {...register('playerCount', { valueAsNumber: true })}
            className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        
        <div>
          <Label htmlFor="startingLevelRange" className="block font-cinzel text-brown-dark text-lg mb-2">
            Starting Level Range
          </Label>
          <Select
            value={startingLevelRange}
            onValueChange={(value) => setValue('startingLevelRange', value as LevelRange)}
          >
            <SelectTrigger 
              id="startingLevelRange"
              className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <SelectValue placeholder="Select level range" />
            </SelectTrigger>
            <SelectContent>
              {levelRangeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-8">
        <Label className="block font-cinzel text-brown-dark text-lg mb-2">
          Allowed Classes
        </Label>
        <MultiSelect
          options={classOptions}
          selected={allowedClasses}
          onChange={(selected) => setValue('allowedClasses', selected as Class[])}
        />
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-cinzel text-brown-dark text-xl">Character Details</h3>
          <Button 
            type="button" 
            onClick={handleAddCharacter}
            className="bg-accent hover:bg-accent-dark text-brown-dark font-bold py-1 px-3 rounded-full transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Character
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <Card 
              key={field.id} 
              className="bg-parchment-dark border border-brown-light"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="font-cinzel text-brown-dark text-lg">Character {index + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveCharacter(index)}
                    className="bg-secondary hover:bg-secondary-dark text-parchment h-8 w-8 rounded-full p-0 flex items-center justify-center"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-brown-dark">
                  Define your character's basics
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`characters.${index}.name`} className="block font-cinzel text-brown-dark mb-1">
                    Character Name
                  </Label>
                  <Input
                    id={`characters.${index}.name`}
                    {...register(`characters.${index}.name`)}
                    className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Character name"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor={`characters.${index}.race`} className="block font-cinzel text-brown-dark mb-1">
                      Race
                    </Label>
                    <Select
                      defaultValue={field.race}
                      onValueChange={(value) => setValue(`characters.${index}.race`, value as Race)}
                    >
                      <SelectTrigger 
                        id={`characters.${index}.race`}
                        className="w-full bg-parchment border border-brown-light rounded px-2 py-1 text-brown-dark text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <SelectValue placeholder="Race" />
                      </SelectTrigger>
                      <SelectContent>
                        {raceOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`characters.${index}.class`} className="block font-cinzel text-brown-dark mb-1">
                      Class
                    </Label>
                    <Select
                      defaultValue={field.class}
                      onValueChange={(value) => setValue(`characters.${index}.class`, value as Class)}
                    >
                      <SelectTrigger 
                        id={`characters.${index}.class`}
                        className="w-full bg-parchment border border-brown-light rounded px-2 py-1 text-brown-dark text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <SelectValue placeholder="Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`characters.${index}.background`} className="block font-cinzel text-brown-dark mb-1">
                      Background
                    </Label>
                    <Select
                      defaultValue={field.background}
                      onValueChange={(value) => setValue(`characters.${index}.background`, value as Background)}
                    >
                      <SelectTrigger 
                        id={`characters.${index}.background`}
                        className="w-full bg-parchment border border-brown-light rounded px-2 py-1 text-brown-dark text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <SelectValue placeholder="Background" />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`characters.${index}.personalityTraits`} className="block font-cinzel text-brown-dark mb-1">
                    Personality Traits
                  </Label>
                  <Textarea
                    id={`characters.${index}.personalityTraits`}
                    {...register(`characters.${index}.personalityTraits`)}
                    className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent min-h-[60px]"
                    placeholder="Character's distinct personality traits"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor={`characters.${index}.ideals`} className="block font-cinzel text-brown-dark mb-1">
                      Ideals
                    </Label>
                    <Input
                      id={`characters.${index}.ideals`}
                      {...register(`characters.${index}.ideals`)}
                      className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="Principles & beliefs"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`characters.${index}.bonds`} className="block font-cinzel text-brown-dark mb-1">
                      Bonds
                    </Label>
                    <Input
                      id={`characters.${index}.bonds`}
                      {...register(`characters.${index}.bonds`)}
                      className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="Connections & loyalties"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`characters.${index}.flaws`} className="block font-cinzel text-brown-dark mb-1">
                      Flaws
                    </Label>
                    <Input
                      id={`characters.${index}.flaws`}
                      {...register(`characters.${index}.flaws`)}
                      className="w-full bg-parchment border border-brown-light rounded px-3 py-2 text-brown-dark focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="Weaknesses & vices"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <Label htmlFor="partyRelationships" className="block font-cinzel text-brown-dark text-lg mb-2">
          Party Relationships & Secrets
        </Label>
        <Textarea
          id="partyRelationships"
          {...register('partyRelationships')}
          className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent min-h-[120px]"
          placeholder="Describe any existing relationships between party members, shared history, secrets, etc."
        />
      </div>
    </div>
  );
};

export default Party;
