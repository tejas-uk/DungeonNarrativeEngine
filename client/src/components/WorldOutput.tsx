import { useState } from 'react';
import { WorldOutput as WorldOutputType, OutputTab } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import DMVoiceAssistant from './DMVoiceAssistant';

interface WorldOutputProps {
  output: WorldOutputType;
}

const WorldOutput = ({ output }: WorldOutputProps) => {
  const [activeTab, setActiveTab] = useState<OutputTab>('world');
  const { toast } = useToast();

  const generateDMScriptMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/generate-dm-script', output);
      return response.json();
    },
    onSuccess: (data: {dmScript: string}) => {
      // Update the output with the DM script
      if (output) {
        output.dmScript = data.dmScript;
        setActiveTab('dm-script');
      }
      toast({
        title: "DM Script Generated!",
        description: "Your Dungeon Master script has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message || "There was an error generating your DM script.",
        variant: "destructive",
      });
    },
  });

  const generatePlayerSheetsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/generate-player-sheets', output);
      return response.json();
    },
    onSuccess: (data: {playerSheets: string}) => {
      // Update the output with the player sheets
      if (output) {
        output.playerSheets = data.playerSheets;
        setActiveTab('player-sheets');
      }
      toast({
        title: "Player Sheets Generated!",
        description: "Character sheets for players have been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message || "There was an error generating your player sheets.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="tabs-container">
      <div className="mb-4 flex space-x-4">
        <Button
          onClick={() => generateDMScriptMutation.mutate()}
          disabled={generateDMScriptMutation.isPending}
          className="bg-primary hover:bg-primary-dark text-parchment font-bold py-2 px-4 rounded"
        >
          {generateDMScriptMutation.isPending ? "Generating..." : "Generate DM Script"}
        </Button>
        <Button
          onClick={() => generatePlayerSheetsMutation.mutate()}
          disabled={generatePlayerSheetsMutation.isPending}
          className="bg-accent hover:bg-accent-dark text-brown-dark font-bold py-2 px-4 rounded"
        >
          {generatePlayerSheetsMutation.isPending ? "Generating..." : "Generate Player Sheets"}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OutputTab)}>
        <TabsList className="flex space-x-4 border-b border-brown-light mb-4 bg-transparent">
          <TabsTrigger
            value="world"
            className="font-cinzel pb-2 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-accent"
          >
            World
          </TabsTrigger>
          <TabsTrigger
            value="npcs"
            className="font-cinzel pb-2 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-accent"
          >
            NPCs
          </TabsTrigger>
          <TabsTrigger
            value="plot"
            className="font-cinzel pb-2 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-accent"
          >
            Plot
          </TabsTrigger>
          <TabsTrigger
            value="encounters"
            className="font-cinzel pb-2 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-accent"
          >
            Encounters
          </TabsTrigger>
          {output.dmScript && (
            <TabsTrigger
              value="dm-script"
              className="font-cinzel pb-2 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-accent"
            >
              DM Script
            </TabsTrigger>
          )}
          {output.playerSheets && (
            <TabsTrigger
              value="player-sheets"
              className="font-cinzel pb-2 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-accent"
            >
              Player Sheets
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="world" className="mt-4">
          <div className="prose prose-sm max-w-none text-brown-dark">
            <div dangerouslySetInnerHTML={{ __html: output.world.replace(/\n/g, '<br/>') }} />
          </div>
        </TabsContent>
        
        <TabsContent value="npcs" className="mt-4">
          <div className="prose prose-sm max-w-none text-brown-dark">
            <div dangerouslySetInnerHTML={{ __html: output.npcs.replace(/\n/g, '<br/>') }} />
          </div>
        </TabsContent>
        
        <TabsContent value="plot" className="mt-4">
          <div className="prose prose-sm max-w-none text-brown-dark">
            <div dangerouslySetInnerHTML={{ __html: output.plot.replace(/\n/g, '<br/>') }} />
          </div>
        </TabsContent>
        
        <TabsContent value="encounters" className="mt-4">
          <div className="prose prose-sm max-w-none text-brown-dark">
            <div dangerouslySetInnerHTML={{ __html: output.encounters.replace(/\n/g, '<br/>') }} />
          </div>
        </TabsContent>
        
        {output.dmScript && (
          <TabsContent value="dm-script" className="mt-4">
            <div className="prose prose-sm max-w-none text-brown-dark">
              <div dangerouslySetInnerHTML={{ __html: output.dmScript.replace(/\n/g, '<br/>') }} />
              <DMVoiceAssistant dmScript={output.dmScript} />
            </div>
          </TabsContent>
        )}
        
        {output.playerSheets && (
          <TabsContent value="player-sheets" className="mt-4">
            <div className="prose prose-sm max-w-none text-brown-dark">
              <div dangerouslySetInnerHTML={{ __html: output.playerSheets.replace(/\n/g, '<br/>') }} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default WorldOutput;
