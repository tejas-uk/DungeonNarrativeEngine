import { useState } from 'react';
import { WorldOutput as WorldOutputType, OutputTab } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WorldOutputProps {
  output: WorldOutputType;
}

const WorldOutput = ({ output }: WorldOutputProps) => {
  const [activeTab, setActiveTab] = useState<OutputTab>('world');

  return (
    <div className="tabs-container">
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
      </Tabs>
    </div>
  );
};

export default WorldOutput;
