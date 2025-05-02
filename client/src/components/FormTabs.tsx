import { TabName } from '@/lib/types';

interface FormTabsProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

const FormTabs = ({ activeTab, onTabChange }: FormTabsProps) => {
  const tabs: { name: TabName; label: string }[] = [
    { name: 'world-settings', label: 'World Settings' },
    { name: 'cultures-politics', label: 'Cultures & Politics' },
    { name: 'magic-technology', label: 'Magic & Technology' },
    { name: 'history', label: 'History' },
    { name: 'factions', label: 'Factions' },
    { name: 'narrative', label: 'Narrative' },
    { name: 'party', label: 'Party' },
  ];

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex space-x-4 border-b border-primary">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`tab-underline font-cinzel ${
              activeTab === tab.name
                ? 'active text-accent'
                : 'text-parchment'
            } relative pb-2 px-4 focus:outline-none`}
            onClick={() => onTabChange(tab.name)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormTabs;
