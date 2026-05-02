import { useSettings } from '../SettingsContext';
import { useAudio } from '../AudioContext';
import { Sliders, Zap, Music, Play, Shield, Activity, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ModeView({ onBack }: { onBack?: () => void }) {
  const { settings, updateGlobalModes, updateSyncLabSettings } = useSettings();
  const isMini = settings.appearance.uiMode === 'mini';

  const ToggleControl = ({ 
    label, 
    sublabel, 
    isActive, 
    onToggle, 
    icon: Icon,
    color = "blue"
  }: { 
    label: string, 
    sublabel: string, 
    isActive: boolean, 
    onToggle: () => void,
    icon: any,
    color?: string
  }) => {
    const colorClasses: Record<string, string> = {
      blue: isActive ? "bg-apple-blue/10 text-apple-blue" : "bg-system-tertiary-label/10 text-system-tertiary-label",
      orange: isActive ? "bg-orange-500/10 text-orange-500" : "bg-system-tertiary-label/10 text-system-tertiary-label",
      green: isActive ? "bg-green-500/10 text-green-500" : "bg-system-tertiary-label/10 text-system-tertiary-label",
      purple: isActive ? "bg-purple-500/10 text-purple-500" : "bg-system-tertiary-label/10 text-system-tertiary-label",
      red: isActive ? "bg-red-500/10 text-red-500" : "bg-system-tertiary-label/10 text-system-tertiary-label"
    };

    const activeBgClasses: Record<string, string> = {
      blue: "bg-apple-blue",
      orange: "bg-orange-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      red: "bg-red-500"
    };

    return (
      <div className="flex items-center justify-between bg-secondary-system-background/30 p-4 rounded-2xl border border-apple-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
            colorClasses[color]
          )}>
            <Icon size={18} fill={isActive ? "currentColor" : "none"} strokeWidth={2.5} />
          </div>
          <div>
            <p className={cn("font-bold text-system-label uppercase tracking-widest", isMini ? "text-[9px]" : "text-[10px]")}>{label}</p>
            <p className={cn("text-system-secondary-label font-medium leading-tight", isMini ? "text-[8px]" : "text-[9px]")}>{sublabel}</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={cn(
            "w-12 h-6 rounded-full relative transition-all duration-300",
            isActive ? activeBgClasses[color] : "bg-system-tertiary-label/30"
          )}
        >
          <motion.div 
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-lg"
            animate={{ left: isActive ? "26px" : "2px" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl serif-title italic text-system-label">System Modes</h1>
          <p className="text-[10px] font-bold text-system-tertiary-label uppercase tracking-widest mt-1">Global System Control</p>
        </div>
        <div className="w-12 h-12 bg-apple-blue/5 border border-apple-blue/10 rounded-full flex items-center justify-center text-apple-blue">
          <Sliders size={20} />
        </div>
      </div>

      <div className="space-y-4">
        <ToggleControl 
          label="Master Audio" 
          sublabel="Enable/Disable all active audio layers" 
          isActive={settings.globalModes.masterAudioEnabled}
          onToggle={() => updateGlobalModes({ masterAudioEnabled: !settings.globalModes.masterAudioEnabled })}
          icon={Play}
          color="blue"
        />

        <ToggleControl 
          label="Pitch Safe Mode" 
          sublabel="Apply pitch-aware processing globally" 
          isActive={settings.globalModes.pitchSafeMode}
          onToggle={() => updateGlobalModes({ pitchSafeMode: !settings.globalModes.pitchSafeMode })}
          icon={Shield}
          color="green"
        />

        <ToggleControl 
          label="Background Play" 
          sublabel="Optimize for iPhone background behavior" 
          isActive={settings.globalModes.backgroundMode}
          onToggle={() => updateGlobalModes({ backgroundMode: !settings.globalModes.backgroundMode })}
          icon={Music}
          color="orange"
        />

        <ToggleControl 
          label="Sync Engine" 
          sublabel="Enable global Hz Sync Lab + locking" 
          isActive={settings.globalModes.syncLabEnabled}
          onToggle={() => {
            const next = !settings.globalModes.syncLabEnabled;
            updateGlobalModes({ syncLabEnabled: next });
            // For true "instant binding", we set linkMode to match syncLabEnabled
            updateSyncLabSettings({ linkMode: next });
          }}
          icon={Activity}
          color="purple"
        />
      </div>

      <div className="mt-auto pt-10 pb-20">
        <div className="p-6 bg-secondary-system-background/20 rounded-3xl border border-apple-border/30 text-center">
          <Target size={24} className="mx-auto mb-4 text-system-tertiary-label opacity-30" />
          <p className="text-[10px] text-system-tertiary-label font-bold uppercase tracking-[0.2em] mb-2 leading-relaxed">
            iPhone 8 Optimized
          </p>
          <p className="text-[9px] text-system-secondary-label/60 leading-relaxed max-w-[200px] mx-auto italic">
            Zero-latency mode switching with iOS16 lightweight processing safety.
          </p>
        </div>
      </div>
    </div>
  );
}
