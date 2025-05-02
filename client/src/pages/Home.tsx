import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import WorldBuilderForm from '@/components/WorldBuilderForm';
import { WorldFormData, SavedWorld, WorldOutput as WorldOutputType } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';

const Home = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const saveWorldMutation = useMutation({
    mutationFn: async (data: { name: string, formData: WorldFormData, output?: WorldOutput }) => {
      const response = await apiRequest('POST', '/api/worlds', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/worlds'] });
      toast({
        title: "World saved!",
        description: "Your world has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Save failed",
        description: error.message || "There was an error saving your world.",
        variant: "destructive",
      });
    },
  });

  const handleSaveWorld = (worldName: string, formData: WorldFormData, output?: WorldOutput) => {
    if (!worldName.trim()) {
      toast({
        title: "Name required",
        description: "Please give your world a name before saving.",
        variant: "destructive",
      });
      return;
    }
    
    saveWorldMutation.mutate({ name: worldName, formData, output });
  };

  return (
    <div className="min-h-screen bg-brown-dark">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="font-medieval text-4xl md:text-6xl text-accent mb-2">D&D Procedural World & Storyline Engine</h1>
          <p className="text-parchment text-lg md:text-xl italic">Create your fantasy world with a few clicks</p>
          <div className="mt-4">
            <Link href="/saved-worlds">
              <a className="text-accent hover:text-accent-light font-cinzel underline">View Saved Worlds</a>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <Sidebar />
          <div className="lg:col-span-5">
            <WorldBuilderForm onSaveWorld={handleSaveWorld} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
