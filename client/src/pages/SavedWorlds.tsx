import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { SavedWorld } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WorldOutput from '@/components/WorldOutput';

const SavedWorlds = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: worlds, isLoading, error } = useQuery<SavedWorld[]>({
    queryKey: ['/api/worlds'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/worlds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/worlds'] });
      toast({
        title: "World deleted",
        description: "The world has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message || "There was an error deleting the world.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this world?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brown-dark">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8 text-center">
            <h1 className="font-medieval text-4xl md:text-6xl text-accent mb-2">Saved Worlds</h1>
            <Link href="/" className="text-accent hover:text-accent-light font-cinzel underline">
              Back to World Builder
            </Link>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-parchment">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brown-dark">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8 text-center">
            <h1 className="font-medieval text-4xl md:text-6xl text-accent mb-2">Saved Worlds</h1>
            <Link href="/" className="text-accent hover:text-accent-light font-cinzel underline">
              Back to World Builder
            </Link>
          </header>
          <div className="bg-parchment p-6 rounded-lg text-center">
            <h2 className="text-2xl font-cinzel text-primary mb-4">Error Loading Worlds</h2>
            <p className="text-brown-dark">{error.message || "There was an error loading your saved worlds."}</p>
            <Button 
              className="mt-4 bg-primary text-parchment hover:bg-primary-dark"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/worlds'] })}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brown-dark">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="font-medieval text-4xl md:text-6xl text-accent mb-2">Saved Worlds</h1>
          <Link href="/" className="text-accent hover:text-accent-light font-cinzel underline">
            Back to World Builder
          </Link>
        </header>

        {worlds && worlds.length === 0 ? (
          <div className="bg-parchment p-6 rounded-lg text-center">
            <h2 className="text-2xl font-cinzel text-primary mb-4">No Saved Worlds</h2>
            <p className="text-brown-dark mb-4">You haven't created any worlds yet. Start creating one now!</p>
            <div>
              <Link href="/">
                <Button className="bg-accent text-brown-dark hover:bg-accent-dark">
                  Create New World
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {worlds?.map((world) => (
              <Card key={world.id} className="bg-parchment">
                <CardHeader>
                  <CardTitle className="font-cinzel text-primary text-xl">{world.name}</CardTitle>
                  <p className="text-brown-dark text-sm">Created: {formatDate(world.createdAt)}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-brown-dark">
                    {world.formData.worldAge} {world.formData.genre} world with {world.formData.regionsCount} regions
                  </p>
                  <p className="text-brown-dark mt-2">
                    Magic level: <span className="font-bold">{world.formData.magicLevel}</span>
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {world.output && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="bg-accent-light text-brown-dark border-brown-light hover:bg-accent">
                          View Content
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-parchment max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-medieval text-2xl text-primary">{world.name}</DialogTitle>
                          <DialogDescription className="text-brown-dark">
                            Generated world content
                          </DialogDescription>
                        </DialogHeader>
                        <WorldOutput output={world.output} />
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  <Button 
                    variant="destructive" 
                    className="bg-secondary hover:bg-secondary-dark"
                    onClick={() => handleDelete(world.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedWorlds;
