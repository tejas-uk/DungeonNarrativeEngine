import { Button } from './ui/button';
import { Link } from 'wouter';

const Sidebar = () => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-parchment rounded-lg p-4 mb-6">
        <h3 className="font-cinzel text-primary text-xl font-bold mb-4 text-center">Inspiration</h3>
        <div className="space-y-4">
          <img 
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop" 
            alt="Fantasy landscape" 
            className="w-full rounded-md shadow-md hover:shadow-lg transition-shadow duration-200" 
          />
          <img 
            src="https://images.unsplash.com/photo-1569973762663-f01b0fb7e55e?w=500&auto=format&fit=crop" 
            alt="Fantasy landscape" 
            className="w-full rounded-md shadow-md hover:shadow-lg transition-shadow duration-200" 
          />
          <img 
            src="https://images.unsplash.com/photo-1515658323406-25d61c141a6e?w=500&auto=format&fit=crop" 
            alt="Fantasy landscape" 
            className="w-full rounded-md shadow-md hover:shadow-lg transition-shadow duration-200" 
          />
          <img 
            src="https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=500&auto=format&fit=crop" 
            alt="Fantasy character" 
            className="w-full rounded-md shadow-md hover:shadow-lg transition-shadow duration-200" 
          />
          <img 
            src="https://images.unsplash.com/photo-1542623024-1182fdradclf?w=500&auto=format&fit=crop" 
            alt="Fantasy map element" 
            className="w-full rounded-md shadow-md hover:shadow-lg transition-shadow duration-200" 
          />
        </div>
      </div>
      
      <div className="bg-parchment rounded-lg p-4">
        <h3 className="font-cinzel text-primary text-xl font-bold mb-4 text-center">Controls</h3>
        <div className="space-y-4">
          <Link href="/saved-worlds">
            <Button className="w-full bg-primary hover:bg-primary-dark text-parchment font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center">
              <i className="ri-folder-open-line mr-2"></i> Saved Worlds
            </Button>
          </Link>
          
          <Button
            className="w-full bg-accent hover:bg-accent-dark text-brown-dark font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center"
            onClick={() => {
              // Clear form and reset to defaults
              window.location.reload();
            }}
          >
            <i className="ri-refresh-line mr-2"></i> Reset Form
          </Button>
          
          <a 
            href="https://www.dndbeyond.com/sources/basic-rules" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-secondary hover:bg-secondary-dark text-parchment font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center"
          >
            <i className="ri-book-line mr-2"></i> D&D Resources
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
