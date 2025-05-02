import { useState } from 'react';
import { WorldFormData, TabName, WorldOutput as WorldOutputType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useForm, FormProvider } from 'react-hook-form';
import { apiRequest } from '@/lib/queryClient';
import FormTabs from './FormTabs';
import WorldSettings from './tabs/WorldSettings';
import CulturesPolitics from './tabs/CulturesPolitics';
import MagicTechnology from './tabs/MagicTechnology';
import History from './tabs/History';
import Factions from './tabs/Factions';
import Narrative from './tabs/Narrative';
import Party from './tabs/Party';
import WorldOutput from './WorldOutput';
import LoadingOverlay from './LoadingOverlay';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';

const defaultFormValues: WorldFormData = {
  worldName: '',
  regionsCount: 3,
  climates: ['temperate', 'tropical'],
  terrains: ['mountains', 'forests', 'rivers', 'oceans'],
  magicalPhenomena: ['ley-lines', 'floating-islands'],

  civilizationsCount: 2,
  civilizations: [
    {
      name: '',
      dominantRaces: ['human'],
      government: 'monarchy',
      economy: 'agrarian',
      values: ['honor', 'tradition']
    }
  ],

  magicLevel: 'common',
  techLevel: 'medieval',
  powerSources: ['arcane', 'divine'],

  worldAge: 'mid-age',
  worldChangingEvents: 2,
  originMyths: '',

  factionsCount: 3,
  factions: [
    {
      name: '',
      type: 'political',
      description: '',
      relationships: ''
    }
  ],

  genre: 'high-fantasy',
  moralTone: 'shades-of-gray',
  themes: ['discovery', 'redemption'],
  deadliness: 'moderate',

  playerCount: 4,
  startingLevelRange: '1-3',
  allowedClasses: ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'],
  characters: [],
  partyRelationships: '',

  namingConvention: 'random-fantasy',
  measurementSystem: 'imperial',
};

interface WorldBuilderFormProps {
  onSaveWorld: (worldName: string, formData: WorldFormData, output?: WorldOutputType) => void;
}

const WorldBuilderForm = ({ onSaveWorld }: WorldBuilderFormProps) => {
  const [activeTab, setActiveTab] = useState<TabName>('world-settings');
  const [generatedOutput, setGeneratedOutput] = useState<WorldOutputType | null>(null);
  const [isOutputVisible, setIsOutputVisible] = useState(false);
  const { toast } = useToast();
  
  const methods = useForm<WorldFormData>({
    defaultValues: defaultFormValues,
  });

  const generateMutation = useMutation({
    mutationFn: async (data: WorldFormData) => {
      const response = await apiRequest('POST', '/api/generate', data);
      return response.json();
    },
    onSuccess: (data: WorldOutputType) => {
      setGeneratedOutput(data);
      setIsOutputVisible(true);
      toast({
        title: "World generated!",
        description: "Your world has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message || "There was an error generating your world.",
        variant: "destructive",
      });
    },
  });

  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
  };

  const nextTab = () => {
    const tabs: TabName[] = ['world-settings', 'cultures-politics', 'magic-technology', 'history', 'factions', 'narrative', 'party'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs: TabName[] = ['world-settings', 'cultures-politics', 'magic-technology', 'history', 'factions', 'narrative', 'party'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const onSubmit = async (data: WorldFormData) => {
    generateMutation.mutate(data);
  };

  const toggleOutput = () => {
    setIsOutputVisible(!isOutputVisible);
  };

  const handleSaveWorld = () => {
    const formData = methods.getValues();
    onSaveWorld(formData.worldName, formData, generatedOutput || undefined);
    toast({
      title: "World saved!",
      description: "Your world has been saved successfully.",
    });
  };

  return (
    <div className="relative">
      {generateMutation.isPending && <LoadingOverlay message="Generating your world..." />}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormTabs activeTab={activeTab} onTabChange={handleTabChange} />
          
          <div className="scroll-top"></div>
          <div className="scroll-bg">
            <div className="scroll-content">
              {activeTab === 'world-settings' && <WorldSettings />}
              {activeTab === 'cultures-politics' && <CulturesPolitics />}
              {activeTab === 'magic-technology' && <MagicTechnology />}
              {activeTab === 'history' && <History />}
              {activeTab === 'factions' && <Factions />}
              {activeTab === 'narrative' && <Narrative />}
              {activeTab === 'party' && <Party />}
              
              <div className="flex justify-between mt-8">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={prevTab}
                  disabled={activeTab === 'world-settings'}
                  className="bg-brown-light hover:bg-brown-dark text-parchment font-bold py-2 px-6 rounded transition-colors duration-200 flex items-center"
                >
                  <i className="ri-arrow-left-line mr-2"></i> Previous
                </Button>
                
                {activeTab === 'party' ? (
                  <Button 
                    type="submit"
                    className="bg-secondary hover:bg-secondary-dark text-parchment font-bold py-2 px-6 rounded transition-colors duration-200 flex items-center"
                    disabled={generateMutation.isPending}
                  >
                    <i className="ri-magic-line mr-2"></i> Generate World
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={nextTab}
                    className="bg-accent hover:bg-accent-dark text-brown-dark font-bold py-2 px-6 rounded transition-colors duration-200 flex items-center"
                  >
                    Next <i className="ri-arrow-right-line ml-2"></i>
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="scroll-bottom"></div>
        </form>
      </FormProvider>
      
      <div className="mt-6 bg-parchment p-4 rounded-lg flex items-center">
        <div className={`w-3 h-3 ${generateMutation.isPending ? "bg-yellow-500" : "bg-green-500"} rounded-full mr-2`}></div>
        <span className="text-brown-dark">
          {generateMutation.isPending ? "Claude AI: Working on world generation..." : "Claude AI: Connected and ready to generate"}
        </span>
      </div>
      
      {generatedOutput && (
        <div className="mt-12">
          <button 
            onClick={toggleOutput}
            className="w-full bg-primary hover:bg-primary-dark text-parchment font-cinzel py-3 px-4 rounded-t-lg flex items-center justify-center"
          >
            <i className={`ri-book-open-line mr-2`}></i> 
            Preview Generated World Content
            <i className={`${isOutputVisible ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} ml-2`}></i>
          </button>
          
          {isOutputVisible && (
            <div className="bg-parchment rounded-b-lg p-6 shadow-lg">
              <WorldOutput output={generatedOutput} />
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleSaveWorld}
                  className="bg-accent hover:bg-accent-dark text-brown-dark font-bold py-2 px-4 rounded"
                >
                  <i className="ri-save-line mr-2"></i> Save This World
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorldBuilderForm;
