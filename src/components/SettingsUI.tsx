import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useSettings } from '../SettingsContext';

export const Group = ({ title, icon: Icon, color, children, isExpanded, onToggle }: any) => {
  const { settings } = useSettings();
  const isMini = settings.appearance.uiMode === 'mini';

  return (
    <div className={`paper-card overflow-hidden flex flex-col ${isMini ? 'mb-3' : 'mb-6'}`}>
      <div className="bg-transparent">
        <button 
          onClick={onToggle}
          className={`w-full flex items-center gap-4 text-left hover:bg-secondary-system-background/50 transition-colors paper-button ${isMini ? 'p-3' : 'p-6'}`}
        >
          <div className={`${isMini ? 'w-10 h-10 rounded-xl' : 'w-12 h-12 rounded-2xl'} ${color} flex-shrink-0 flex items-center justify-center shadow-sm`}>
            <Icon size={isMini ? 20 : 24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`serif-title text-system-label tracking-tight truncate ${isMini ? 'text-sm' : 'text-lg'}`}>{title}</h3>
            {!isMini && <p className="text-[10px] text-system-secondary-label font-bold uppercase tracking-widest mt-1">Management & Settings</p>}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            className={`flex-shrink-0 flex items-center justify-center text-system-secondary-label ${isMini ? 'w-6 h-6' : 'w-8 h-8'}`}
          >
            <ChevronRight size={isMini ? 16 : 20} />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-apple-border bg-transparent overflow-hidden"
          >
            <div className={`flex flex-col ${isMini ? 'p-2 gap-2' : 'p-4 gap-3'}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Section = ({ id, title, subtitle, icon: Icon, color, isEnabled, onToggle, children }: any) => {
  const { settings } = useSettings();
  const isMini = settings.appearance.uiMode === 'mini';
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="paper-card overflow-hidden transition-all paper-emboss">
      <div className={`flex items-center justify-between ${isMini ? 'p-3' : 'p-5'}`}>
        <div className="flex items-center gap-4 min-w-0">
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className={`${isMini ? 'w-8 h-8 rounded-xl' : 'w-10 h-10 rounded-2xl'} ${isOpen ? 'bg-secondary-system-background' : 'bg-secondary-system-background/50'} flex-shrink-0 flex items-center justify-center ${color} transition-all cursor-pointer paper-button`}
          >
            <Icon size={isMini ? 16 : 20} />
          </div>
          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <h5 className={`${isMini ? 'text-[13px]' : 'text-sm'} font-black tracking-tight truncate text-system-label`}>{title}</h5>
            {subtitle && <p className="text-[9px] text-system-secondary-label uppercase font-black tracking-widest truncate">{subtitle}</p>}
          </div>
        </div>
        
        {onToggle !== undefined && (
          <button 
            onClick={() => onToggle(!isEnabled)}
            className={`flex-shrink-0 ${isMini ? 'w-8 h-5' : 'w-10 h-6'} rounded-full relative transition-colors paper-button ${isEnabled ? 'bg-apple-blue' : 'bg-system-tertiary-label'}`}
          >
            <motion.div className={`absolute top-0.5 left-0.5 bg-white ${isMini ? 'w-4 h-4' : 'w-5 h-5'} rounded-full`} animate={{ x: isEnabled ? (isMini ? 12 : 16) : 0 }} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={isMini ? 'px-3 pb-4' : 'px-5 pb-6'}
          >
             <div className="pt-2 border-t border-apple-border/50">
               {children}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
