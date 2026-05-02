import { ReactNode } from 'react';
import { useSettings } from '../SettingsContext';
import { useUIState, TabType } from '../UIStateContext';
import { Music, Settings as SettingsIcon, Search, PlayCircle, ArrowLeft, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TabBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function TabBar({ activeTab, setActiveTab }: TabBarProps) {
  const { settings } = useSettings();
  const isMini = settings.appearance.uiMode === 'mini';
  
  const allTabs: { id: TabType, label: string, icon: any }[] = [
    { id: 'library', label: 'Library', icon: Music },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'player', label: 'Playing', icon: PlayCircle },
    { id: 'mode', label: 'Mode', icon: Sliders },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const tabs = allTabs.filter(tab => {
    if (tab.id === 'settings') return true; // Settings is ALWAYS visible
    return settings.visibility.navigation[tab.id as keyof typeof settings.visibility.navigation] !== false;
  }) as ({ id: TabType | 'back', label: string, icon: any }[]);

  if (settings.backButtonPosition === 'bottom' && activeTab !== 'library') {
    tabs.unshift({ id: 'back', label: 'Back', icon: ArrowLeft });
  }

  return (
    <div className={cn(
      "w-full bg-secondary-system-background/80 backdrop-blur-3xl border border-apple-border/20 rounded-[2rem] flex justify-around items-center z-50 transition-all shadow-xl",
      isMini ? "px-1 h-12" : "px-4 py-2 h-16",
      settings.bigTouchMode && !isMini && "h-20"
    )}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'back') {
                setActiveTab('library');
              } else {
                setActiveTab(tab.id);
              }
            }}
            className={cn(
              "relative flex flex-col items-center transition-all duration-300 flex-1",
              isActive ? "text-apple-blue" : "text-system-secondary-label/60",
              tab.id === 'back' && "text-system-label",
              isMini ? "gap-0" : "gap-0.5"
            )}
          >
            <div className={cn("rounded-full transition-all flex items-center justify-center", isMini ? "p-0.5" : "p-1 px-4")}>
              <Icon size={isMini ? (isActive ? 20 : 18) : (isActive ? 24 : 22)} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "font-bold tracking-tight",
              isActive ? 'text-apple-blue' : 'text-system-secondary-label',
              isMini ? "text-[8px] scale-90" : "text-[10px]"
            )}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
