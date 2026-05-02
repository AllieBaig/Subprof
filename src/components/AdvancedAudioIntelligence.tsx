import React from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Clock, Activity, Settings2, Sliders, Volume2, Shield } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { Section } from './SettingsUI';

export const AdvancedAudioIntelligence = () => {
  const { settings, updateAdvancedAudioSettings } = useSettings();
  const isMini = settings.appearance.uiMode === 'mini';

  if (!settings.advancedAudio) return null;

  const { advancedAudio } = settings;

  const ControlLabel = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex justify-between items-center mb-1.5 px-0.5">
      <span className="text-[10px] font-bold text-system-secondary-label uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-black text-apple-blue">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Smart Silence Recovery */}
      <Section
        id="silence-recovery"
        title="Smart Silence Recovery"
        subtitle="iOS Audio Restoration"
        icon={Zap}
        color="bg-amber-500/10 text-amber-600"
        isEnabled={advancedAudio.silenceRecovery.isEnabled}
        onToggle={(val: boolean) => updateAdvancedAudioSettings({ 
          silenceRecovery: { ...advancedAudio.silenceRecovery, isEnabled: val } 
        })}
      >
        <div className="space-y-4 pt-1">
          <div>
            <ControlLabel label="Sensitivity" value={advancedAudio.silenceRecovery.sensitivity.toUpperCase()} />
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((s) => (
                <button
                  key={s}
                  onClick={() => updateAdvancedAudioSettings({ 
                    silenceRecovery: { ...advancedAudio.silenceRecovery, sensitivity: s as any } 
                  })}
                  className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                    advancedAudio.silenceRecovery.sensitivity === s 
                    ? 'bg-apple-blue text-white border-apple-blue shadow-sm' 
                    : 'bg-secondary-system-background/50 text-system-secondary-label border-apple-border/50 hover:bg-secondary-system-background'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <ControlLabel label="Retry Delay" value={`${advancedAudio.silenceRecovery.retryDelayMs}ms`} />
            <input 
              type="range"
              min="500"
              max="10000"
              step="500"
              value={advancedAudio.silenceRecovery.retryDelayMs}
              onChange={(e) => updateAdvancedAudioSettings({ 
                silenceRecovery: { ...advancedAudio.silenceRecovery, retryDelayMs: parseInt(e.target.value) } 
              })}
              className="w-full accent-apple-blue h-1.5 bg-system-tertiary-label/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </Section>

      {/* 2. Layer Priority System */}
      <Section
        id="layer-priority"
        title="Layer Priority System"
        subtitle="Audio Dominance Engine"
        icon={Activity}
        color="bg-apple-blue/10 text-apple-blue"
        isEnabled={advancedAudio.layerPriority.isEnabled}
        onToggle={(val: boolean) => updateAdvancedAudioSettings({ 
          layerPriority: { ...advancedAudio.layerPriority, isEnabled: val } 
        })}
      >
        <div className="space-y-4 pt-1">
          <div>
            <div className="flex justify-between items-center mb-1.5 px-0.5">
              <span className="text-[10px] font-bold text-system-secondary-label uppercase tracking-widest">Priority Focus</span>
              <button 
                onClick={() => {
                   // Cycle through fake focus modes for now to show "Priority order selector"
                   const modes = ['Balanced', 'Main Focus', 'Hz Focus', 'Ambient Focus'];
                   const current = advancedAudio.layerPriority.priorityOrder || 'Balanced';
                   const next = modes[(modes.indexOf(current) + 1) % modes.length];
                   updateAdvancedAudioSettings({
                     layerPriority: { ...advancedAudio.layerPriority, priorityOrder: next }
                   });
                }}
                className="text-[10px] font-black text-apple-blue underline underline-offset-4"
              >
                {advancedAudio.layerPriority.priorityOrder || 'Balanced'}
              </button>
            </div>
            <div className="bg-secondary-system-background/50 rounded-xl p-3 border border-apple-border/30 flex flex-col gap-2">
               {['Main Audio', 'Hz Frequency', 'Soundscapes'].map((item, idx) => (
                 <div key={item} className="flex items-center gap-3">
                   <div className="w-5 h-5 rounded-full bg-apple-blue/10 text-apple-blue flex items-center justify-center text-[10px] font-black">{idx + 1}</div>
                   <span className="text-[11px] font-bold text-system-label">{item}</span>
                 </div>
               ))}
            </div>
          </div>
          <div>
            <ControlLabel label="Balance Strength" value={`${Math.round(advancedAudio.layerPriority.balanceStrength * 100)}%`} />
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={advancedAudio.layerPriority.balanceStrength}
              onChange={(e) => updateAdvancedAudioSettings({ 
                layerPriority: { ...advancedAudio.layerPriority, balanceStrength: parseFloat(e.target.value) } 
              })}
              className="w-full accent-apple-blue h-1.5 bg-system-tertiary-label/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </Section>

      {/* 3. Time-Based Automation */}
      <Section
        id="time-automation"
        title="Time-Based Automation"
        subtitle="Dynamic Audio Flow"
        icon={Clock}
        color="bg-purple-500/10 text-purple-600"
        isEnabled={advancedAudio.timeAutomation.isEnabled}
        onToggle={(val: boolean) => updateAdvancedAudioSettings({ 
          timeAutomation: { ...advancedAudio.timeAutomation, isEnabled: val } 
        })}
      >
        <div className="space-y-4 pt-1">
          <div>
             <ControlLabel label="Timeline" value="Active Program" />
             <div className="space-y-2">
               {[
                 { t: '00:00', task: 'Initial Fade' },
                 { t: '05:00', task: 'Hz Transition' },
                 { t: '15:00', task: 'Main Volume Dip' }
               ].map(step => (
                 <div key={step.t} className="flex items-center justify-between p-3 bg-secondary-system-background/50 border border-apple-border/30 rounded-xl">
                   <span className="text-[10px] font-black text-apple-blue">{step.t}</span>
                   <span className="text-[11px] font-bold text-system-label">{step.task}</span>
                 </div>
               ))}
             </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] font-bold text-system-secondary-label uppercase tracking-widest">Smooth Transitions</span>
            <button 
              onClick={() => updateAdvancedAudioSettings({ 
                timeAutomation: { ...advancedAudio.timeAutomation, smoothTransitions: !advancedAudio.timeAutomation.smoothTransitions } 
              })}
              className={`w-8 h-4 rounded-full relative transition-colors ${advancedAudio.timeAutomation.smoothTransitions ? 'bg-apple-blue' : 'bg-system-tertiary-label/30'}`}
            >
              <div className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${advancedAudio.timeAutomation.smoothTransitions ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </Section>

      {/* 4. Safe Listening Guard */}
      <Section
        id="safe-listening"
        title="Safe Listening Guard"
        subtitle="Hearing Protection"
        icon={ShieldCheck}
        color="bg-emerald-500/10 text-emerald-600"
        isEnabled={advancedAudio.safeListening.isEnabled}
        onToggle={(val: boolean) => updateAdvancedAudioSettings({ 
          safeListening: { ...advancedAudio.safeListening, isEnabled: val } 
        })}
      >
        <div className="space-y-4 pt-1">
          <div>
            <ControlLabel label="Max Volume Cap" value={`${Math.round(advancedAudio.safeListening.maxVolumeCap * 100)}%`} />
            <input 
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={advancedAudio.safeListening.maxVolumeCap}
              onChange={(e) => updateAdvancedAudioSettings({ 
                safeListening: { ...advancedAudio.safeListening, maxVolumeCap: parseFloat(e.target.value) } 
              })}
              className="w-full accent-emerald-500 h-1.5 bg-system-tertiary-label/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <ControlLabel label="Harsh Softening" value={`${Math.round(advancedAudio.safeListening.harshSoftening * 100)}%`} />
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={advancedAudio.safeListening.harshSoftening}
              onChange={(e) => updateAdvancedAudioSettings({ 
                safeListening: { ...advancedAudio.safeListening, harshSoftening: parseFloat(e.target.value) } 
              })}
              className="w-full accent-emerald-500 h-1.5 bg-system-tertiary-label/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </Section>
    </div>
  );
};
