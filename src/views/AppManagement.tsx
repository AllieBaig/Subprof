import React from 'react';
import { useAudio } from '../AudioContext';
import { useSettings } from '../SettingsContext';
import { useUIState } from '../UIStateContext';
import { Section } from '../components/SettingsUI';
import StorageInfo from '../components/StorageInfo';
import { 
  Download, Upload, Wrench, ChevronRight, History, Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const AppManagement = () => {
  const { settings } = useSettings();
  const isMini = settings.appearance.uiMode === 'mini';
  const { 
    exportAppData,
    importAppData
  } = useAudio();

  return (
    <Section
      id="management"
      title="Data Management"
      subtitle="Backup & Restore"
      icon={SettingsIcon}
      color="bg-apple-blue/10 text-apple-blue"
    >
      <div className="flex flex-col gap-3">
        <div className={cn("flex", isMini ? "gap-2" : "gap-3")}>
          <button 
            onClick={() => exportAppData()}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-2 bg-system-background text-apple-blue border border-apple-border rounded-2xl font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all",
              isMini ? "p-3 h-20" : "p-4 h-24"
            )}
          >
            <Download size={isMini ? 14 : 16} />
            Export Data
          </button>

          <label className={cn(
            "flex-1 flex flex-col items-center justify-center gap-2 bg-system-background text-apple-blue border border-apple-border rounded-2xl font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all cursor-pointer",
            isMini ? "p-3 h-20" : "p-4 h-24"
          )}>
            <Upload size={isMini ? 14 : 16} />
            Import Data
            <input type="file" accept=".json" className="hidden" onChange={(e) => e.target.files && importAppData(e.target.files[0])} />
          </label>
        </div>
      </div>
    </Section>
  );
};

export const AppMaintenance = () => {
  const { settings } = useSettings();
  const isMini = settings.appearance.uiMode === 'mini';
  const { clearAppCache } = useAudio();
  const { resetUISettings } = useSettings();

  return (
    <Section
      id="maintenance"
      title="App Maintenance"
      subtitle="Cache & Reset"
      icon={Wrench}
      color="bg-amber-100 text-amber-600"
    >
      <div className={isMini ? "flex flex-col gap-3" : "flex flex-col gap-4"}>
        <StorageInfo />
        
        <button 
          onClick={() => clearAppCache()}
          className={cn(
            "w-full flex items-center justify-between hover:bg-secondary-system-background transition-colors bg-system-background rounded-2xl border border-apple-border",
            isMini ? "p-3" : "p-4"
          )}
        >
          <div className="text-left">
            <p className={cn("font-semibold text-system-label", isMini ? "text-[11px]" : "text-xs")}>Clear Cache</p>
            <p className="text-[9px] text-system-secondary-label font-bold uppercase tracking-widest">Removes temporary data</p>
          </div>
          <ChevronRight size={14} className="text-system-tertiary-label" />
        </button>

        <button 
          onClick={() => resetUISettings()}
          className={cn(
            "w-full flex items-center justify-between hover:bg-red-50 transition-colors bg-system-background rounded-2xl border border-red-100 text-red-500",
            isMini ? "p-3" : "p-4"
          )}
        >
          <p className={cn("font-bold uppercase tracking-widest", isMini ? "text-[10px]" : "text-xs")}>Reset UI Settings</p>
          <ChevronRight size={14} className="opacity-40" />
        </button>
      </div>
    </Section>
  );
};
