import { useFormContext } from 'react-hook-form';
import { WorldFormData, WorldAge } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const worldAgeOptions = [
  { value: 'ancient', label: 'Ancient - Thousands of years of recorded history' },
  { value: 'mid-age', label: 'Mid-Age - Several centuries of established civilization' },
  { value: 'newly-formed', label: 'Newly Formed - Recent genesis or colonization' }
];

const History = () => {
  const { register, setValue, watch } = useFormContext<WorldFormData>();
  
  const worldAge = watch('worldAge');

  return (
    <div className="history-tab">
      <h2 className="font-medieval text-3xl text-primary mb-6">Historical Background</h2>
      
      <div className="mb-8">
        <Label htmlFor="worldAge" className="block font-cinzel text-brown-dark text-lg mb-2">
          Age of the World
        </Label>
        <Select
          value={worldAge}
          onValueChange={(value) => setValue('worldAge', value as WorldAge)}
        >
          <SelectTrigger 
            id="worldAge"
            className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <SelectValue placeholder="Select world age" />
          </SelectTrigger>
          <SelectContent>
            {worldAgeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-2 bg-parchment-dark p-3 rounded-md text-brown-dark italic">
          {worldAge === 'ancient' && 'A world with deep history, ancient ruins, forgotten dynasties, and knowledge lost to time.'}
          {worldAge === 'mid-age' && 'A world with established kingdoms and traditions, but still creating its defining historical moments.'}
          {worldAge === 'newly-formed' && 'A frontier world, recently discovered or created, with history still being written.'}
        </div>
      </div>
      
      <div className="mb-8">
        <Label htmlFor="worldChangingEvents" className="block font-cinzel text-brown-dark text-lg mb-2">
          Number of World-Changing Events in History
        </Label>
        <Input
          id="worldChangingEvents"
          type="number"
          min={0}
          max={10}
          {...register('worldChangingEvents', { valueAsNumber: true })}
          className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <p className="mt-2 text-sm text-brown-dark italic">
          Major historical events like wars, magical catastrophes, or celestial occurrences that shaped the current world.
        </p>
      </div>
      
      <div className="mb-8">
        <Label htmlFor="originMyths" className="block font-cinzel text-brown-dark text-lg mb-2">
          Creation Myths & Origin Stories
        </Label>
        <Textarea
          id="originMyths"
          {...register('originMyths')}
          className="w-full bg-parchment-dark border border-brown-light rounded px-4 py-2 text-brown-dark focus:outline-none focus:ring-2 focus:ring-accent min-h-[120px]"
          placeholder="Describe the myths about how the world was created, or leave blank for the AI to generate..."
        />
      </div>
      
      <div className="mb-8">
        <h3 className="font-cinzel text-brown-dark text-xl mb-4">Historical Context Preview</h3>
        <div className="bg-parchment-dark border-4 border-brown-light rounded-lg p-4">
          <div className="space-y-3 text-brown-dark">
            <h4 className="font-cinzel font-bold">Timeline Estimate</h4>
            {worldAge === 'ancient' && (
              <ul className="list-disc list-inside">
                <li>Dawn of time: World creation (mythic era)</li>
                <li>10,000+ years ago: First civilizations</li>
                <li>5,000+ years ago: Ancient empires and magic</li>
                <li>1,000+ years ago: Middle kingdoms period</li>
                <li>Recent centuries: Current era</li>
              </ul>
            )}
            {worldAge === 'mid-age' && (
              <ul className="list-disc list-inside">
                <li>1,000+ years ago: World creation or settlement</li>
                <li>500+ years ago: First kingdoms established</li>
                <li>200+ years ago: Formation of current nations</li>
                <li>Recent century: Modern political landscape</li>
              </ul>
            )}
            {worldAge === 'newly-formed' && (
              <ul className="list-disc list-inside">
                <li>Recent creation or discovery (within last century)</li>
                <li>Ongoing settlement and exploration</li>
                <li>Frontier societies and emerging governance</li>
                <li>Contemporary struggles for resources and territory</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
