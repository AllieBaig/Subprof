import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../SettingsContext';
import { usePlayback } from '../PlaybackContext';
import { FREQUENCY_PRESETS } from '../constants';
import { PickerWheel } from './PickerWheel';
import { Activity, Sliders, ChevronDown, ChevronRight, Ear } from 'lucide-react';

export const LayerProgress = ({ layerId }: { layerId: string }) => {
  const { layerProgress } = usePlayback();
  const progress = layerProgress[layerId];
  
  if (!progress || progress.duration === 0) return null;
  
  const percentage = (progress.currentTime / progress.duration) * 100;
  
  return (
    <div className="w-full h-0.5 bg-system-tertiary-label/20 rounded-full overflow-hidden">
      <motion.div 
        className="h-full bg-apple-blue"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
      />
    </div>
  );
};

export const HzSelector = ({ value, onChange, color }: { value: number, onChange: (v: number) => void, color: string }) => {
  const { settings, updateSettings } = useSettings();
  const inputMode = settings.hzInputMode || 'slider';

  const colorClass = color === 'purple' ? 'text-purple-600' : 
                    color === 'blue' ? 'text-apple-blue' : 
                    color === 'green' ? 'text-green-600' : 
                    color === 'amber' ? 'text-amber-800' : 
                    color === 'rose' ? 'text-rose-600' : 
                    color === 'indigo' ? 'text-indigo-600' : 
                    'text-orange-600';

  const bgActiveColorClass = color === 'purple' ? 'accent-purple-600' : 
                            color === 'blue' ? 'accent-apple-blue' : 
                            color === 'green' ? 'accent-green-600' : 
                            color === 'amber' ? 'accent-amber-800' : 
                            color === 'rose' ? 'accent-rose-600' : 
                            color === 'indigo' ? 'accent-indigo-600' : 
                            'accent-orange-600';

  const renderManual = () => (
    <div className="flex flex-col items-center py-6">
      <div className="paper-card px-10 py-8 flex flex-col items-center gap-2 min-w-[220px] relative animate-in zoom-in-95 duration-300 paper-emboss">
        <div className="flex items-baseline gap-2">
          <input 
            type="number"
            value={value}
            onChange={(e) => onChange(Math.max(0.1, Math.min(1900, parseFloat(e.target.value) || 0.1)))}
            className="bg-transparent border-none p-0 text-5xl font-[900] text-center tabular-nums focus:ring-0 outline-none w-32 tracking-tighter serif-title"
            style={{ color: value > 0 ? (color === 'purple' ? '#9333ea' : color === 'blue' ? '#4a5d7e' : color === 'green' ? '#16a34a' : color === 'amber' ? '#92400e' : color === 'rose' ? '#e11d48' : '#ea580c') : 'currentColor' }}
          />
          <span className="text-xl serif-title opacity-30 text-system-label italic">Hz</span>
        </div>
        <span className="text-[10px] font-black text-system-tertiary-label uppercase tracking-[0.3em] mt-1 opacity-50">Frequency</span>
        
        {/* Decorative Pill Header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-apple-secondary-bg px-4 py-1.5 rounded-full border border-apple-border text-[9px] font-black uppercase tracking-widest text-system-tertiary-label shadow-sm">
          Manual Tuning
        </div>
      </div>
    </div>
  );

  const renderSlider = () => (
    <div className="space-y-6 pt-2">
      <div className="flex justify-between items-center px-2">
         <div className="flex flex-col">
            <span className={`text-3xl serif-title tabular-nums tracking-tight ${colorClass}`}>{value}</span>
            <span className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest">Selected Frequency</span>
         </div>
         <div className="flex bg-secondary-system-background rounded-full p-1 border border-apple-border paper-emboss">
            <button 
              onClick={() => onChange(Math.max(0.1, value - 1))} 
              className="w-10 h-8 flex items-center justify-center text-system-label hover:bg-white active:scale-90 rounded-full transition-all font-black text-lg paper-button"
            >
              -
            </button>
            <div className="w-px h-4 bg-apple-border my-auto opacity-50" />
            <button 
              onClick={() => onChange(Math.min(1900, value + 1))} 
              className="w-10 h-8 flex items-center justify-center text-system-label hover:bg-white active:scale-90 rounded-full transition-all font-black text-lg paper-button"
            >
              +
            </button>
         </div>
      </div>
      <div className="relative px-1">
        <input 
          type="range" min={1} max={1900} step={1} value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full h-1.5 bg-apple-border/40 rounded-full appearance-none cursor-pointer ${bgActiveColorClass}`}
        />
      </div>
    </div>
  );

  const renderPicker = () => {
    const pickerItems = FREQUENCY_PRESETS.map(hz => ({
      id: hz,
      label: `${hz} Hz`
    }));

    const currentVal = value;
    const isPreset = FREQUENCY_PRESETS.includes(currentVal);

    return (
      <div className="space-y-6 pt-2">
        {!isPreset && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Custom Mode</span>
              <span className="text-[11px] font-bold text-amber-700/80">Frequency is outside presets</span>
            </div>
            <span className="text-sm font-black text-amber-600 tabular-nums bg-amber-500/10 px-3 py-1 rounded-full">{currentVal}Hz</span>
          </div>
        )}
        <div className="bg-system-background border border-apple-border rounded-[2rem] overflow-hidden shadow-sm paper-emboss">
          <PickerWheel 
            items={pickerItems}
            selectedValue={isPreset ? currentVal : -1}
            onValueChange={(hz) => onChange(hz)}
            height={160}
            itemHeight={40}
          />
        </div>
        <div className="flex justify-center">
           <button 
            onClick={() => updateSettings({ hzInputMode: 'manual' })}
            className="px-6 py-2 bg-apple-blue/5 border border-apple-blue/10 rounded-full text-[9px] font-black text-apple-blue uppercase tracking-widest hover:bg-apple-blue/10 active:scale-95 transition-all paper-button"
           >
             Set Manual Frequency
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex bg-secondary-system-background p-1.5 rounded-[1.25rem] h-11 border border-apple-border paper-emboss">
        {(['picker', 'slider', 'manual'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => updateSettings({ hzInputMode: mode })}
            className={`flex-1 h-full rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-200 paper-button ${inputMode === mode ? 'bg-white dark:bg-[#1c1c1b] text-apple-blue shadow-md' : 'text-system-secondary-label hover:text-system-label'}`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {inputMode === 'picker' && renderPicker()}
        {inputMode === 'slider' && renderSlider()}
        {inputMode === 'manual' && renderManual()}
      </div>
    </div>
  );
};

export const PhysicalSoundEngineUI = ({ phys, onChange, color }: { phys: any, onChange: (v: any) => void, color: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!phys) return null;

  const colorClass = color === 'red' ? 'text-red-900 bg-red-900/10' : 
                    color === 'amber' ? 'text-amber-800 bg-amber-800/10' : 
                    'text-indigo-600 bg-indigo-600/10';

  const accentClass = color === 'red' ? 'accent-red-900' : 
                     color === 'amber' ? 'accent-amber-800' : 
                     'accent-indigo-600';

  const borderClass = color === 'red' ? 'border-red-900/20' : 
                     color === 'amber' ? 'border-amber-800/20' : 
                     'border-indigo-600/20';

  const activeBtnClass = color === 'red' ? 'bg-red-900 text-white border-red-900' : 
                        color === 'amber' ? 'bg-amber-800 text-white border-amber-800' : 
                        'bg-indigo-600 text-white border-indigo-600';

  return (
    <div className="space-y-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 group"
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorClass}`}>
              <Activity size={14} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black text-system-label uppercase tracking-widest">Physical Sound Engine</span>
            <span className="text-[7px] font-bold text-system-tertiary-label uppercase">Simulated Physics & Resilience</span>
          </div>
        </div>
        <ChevronRight size={16} className={`text-system-tertiary-label transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`overflow-hidden space-y-6 pt-2 pb-6 px-4 bg-secondary-system-background rounded-3xl border ${borderClass} paper-emboss`}
          >
            {/* Room Size */}
            <div className="space-y-3 pt-2">
              <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest">Room Size</p>
              <div className="grid grid-cols-2 gap-2">
                {['small', 'medium', 'large', 'cave'].map(size => (
                  <button 
                    key={size}
                    onClick={() => onChange({ ...phys, roomSize: size })}
                    className={`py-2 px-1 rounded-xl text-[9px] font-bold uppercase transition-all border paper-button ${phys.roomSize === size ? activeBtnClass : 'bg-white dark:bg-[#1c1c1b] border-apple-border text-system-secondary-label'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Wall Resonance */}
            <div className="space-y-3">
              <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest">Wall Resonance</p>
              <div className="grid grid-cols-4 gap-1.5">
                {['off', 'low', 'medium', 'high'].map(res => (
                  <button 
                    key={res}
                    onClick={() => onChange({ ...phys, wallResonance: res })}
                    className={`py-2 px-1 rounded-xl text-[8px] font-black uppercase transition-all border paper-button ${phys.wallResonance === res ? activeBtnClass : 'bg-white dark:bg-[#1c1c1b] border-apple-border text-system-secondary-label'}`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Texture */}
            <div className="space-y-3">
              <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest">Material Texture</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'thin_wood', label: 'Thin Wood' },
                  { id: 'empty_wood', label: 'Empty Wood' },
                  { id: 'solid_wall', label: 'Solid Wall' },
                  { id: 'open_space', label: 'Open Space' }
                ].map(tex => (
                  <button 
                    key={tex.id}
                    onClick={() => onChange({ ...phys, materialTexture: tex.id })}
                    className={`py-2 px-1 rounded-xl text-[8px] font-bold uppercase transition-all border paper-button ${phys.materialTexture === tex.id ? activeBtnClass : 'bg-white dark:bg-[#1c1c1b] border-apple-border text-system-secondary-label'}`}
                  >
                    {tex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Banging Intensity */}
            {phys.bangingIntensity && (
               <div className="space-y-3">
                <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest">Global Hit Impact</p>
                <div className="grid grid-cols-3 gap-2">
                  {['soft', 'medium', 'hard'].map(i => (
                    <button 
                      key={i}
                      onClick={() => onChange({ ...phys, bangingIntensity: i })}
                      className={`py-2 px-1 rounded-xl text-[9px] font-bold uppercase transition-all border paper-button ${phys.bangingIntensity === i ? activeBtnClass : 'bg-white dark:bg-[#1c1c1b] border-apple-border text-system-secondary-label'}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resonance Depth Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest">Resonance Depth</span>
                <span className={`text-[10px] font-black tabular-nums ${color.includes('red') ? 'text-red-900' : color.includes('amber') ? 'text-amber-800' : 'text-indigo-600'}`}>{(phys.resonanceDepth * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" min={0} max={1} step={0.01} value={phys.resonanceDepth}
                onChange={(e) => onChange({ ...phys, resonanceDepth: parseFloat(e.target.value) })}
                className={`w-full h-1 bg-apple-border rounded-full appearance-none ${accentClass}`}
              />
            </div>

            {/* Echo Tail Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest">Tail Decay</span>
                <span className={`text-[10px] font-black tabular-nums ${color.includes('red') ? 'text-red-900' : color.includes('amber') ? 'text-amber-800' : 'text-indigo-600'}`}>{(phys.echoTailLength * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" min={0} max={1} step={0.01} value={phys.echoTailLength}
                onChange={(e) => onChange({ ...phys, echoTailLength: parseFloat(e.target.value) })}
                className={`w-full h-1 bg-apple-border rounded-full appearance-none ${accentClass}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LayerAccordion = ({ 
  id, icon: Icon, label, isEnabled, onToggle, vol, setVol, 
  gainDb, setGainDb, normalize, setNormalize, 
  playInBackground, setPlayInBackground,
  pitchSafeMode, setPitchSafeMode,
  bufferMode, setBufferMode,
  isExpanded, onAccordionToggle,
  color, subtitle, children, onApplyPreset,
  hideToggle = false
}: any) => {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);

  const expanded = onAccordionToggle ? isExpanded : internalIsExpanded;
  const toggleAccordion = () => {
    if (onAccordionToggle) onAccordionToggle();
    else setInternalIsExpanded(!internalIsExpanded);
  };

  const colorHex = color.includes('blue') ? '#007aff' : 
                   color.includes('purple') ? '#a855f7' : 
                   color.includes('green') ? '#22c55e' : 
                   color.includes('amber') ? '#92400e' : 
                   color.includes('rose') ? '#e11d48' : 
                   color.includes('emerald') ? '#059669' :
                   color.includes('red') ? '#7f1d1d' :
                   color.includes('indigo') ? '#4f46e5' :
                   '#f97316';

  const { settings } = useSettings();
  const isMini = settings.appearance.uiMode === 'mini';

  return (
    <div className="paper-card overflow-hidden">
      <div 
        className={`${isMini ? 'p-3' : 'p-5'} flex items-center justify-between cursor-pointer`}
        onClick={toggleAccordion}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={`${isMini ? 'w-10 h-10' : 'w-12 h-12'} ${isEnabled || hideToggle ? 'bg-system-background shadow-sm' : 'bg-system-background/50'} rounded-2xl flex-shrink-0 flex items-center justify-center ${isEnabled || hideToggle ? color : 'text-system-tertiary-label'} transition-all`}>
            <Icon size={isMini ? 20 : 24} />
          </div>
          <div className="min-w-0 flex-1">
            <h5 className={`${isMini ? 'text-[13px]' : 'text-sm'} font-black tracking-tight truncate text-system-label`}>{label}</h5>
            {subtitle && <p className={`text-[9px] text-system-secondary-label uppercase font-black tracking-widest truncate ${isMini ? 'scale-90 origin-left' : ''}`}>{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!hideToggle && (
            <button 
              onClick={(e) => { e.stopPropagation(); onToggle(!isEnabled); }}
              className={`flex-shrink-0 ${isMini ? 'w-10 h-6' : 'w-12 h-7'} rounded-full relative transition-colors ${isEnabled ? (color.includes('blue') ? 'bg-apple-blue' : color.includes('purple') ? 'bg-purple-500' : color.includes('green') ? 'bg-green-500' : color.includes('amber') ? 'bg-amber-800' : color.includes('rose') ? 'bg-rose-600' : 'bg-orange-500') : 'bg-system-tertiary-label'}`}
            >
              <motion.div className={`absolute top-0.5 left-0.5 bg-white ${isMini ? 'w-5 h-5' : 'w-5 h-5'} rounded-full`} animate={{ x: isEnabled ? (isMini ? 16 : 20) : 0 }} />
            </button>
          )}
          <ChevronDown size={isMini ? 16 : 18} className={`text-system-tertiary-label transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {(isEnabled || hideToggle) && <div className={`${isMini ? 'px-3 pb-2' : 'px-5 pb-3'}`}><LayerProgress layerId={id} /></div>}
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`${isMini ? 'px-3 pb-4 space-y-4' : 'px-5 pb-8 space-y-8'}`}
          >
            {/* Playback Controls Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Background Play Support */}
              {setPlayInBackground !== undefined && (
                <div className="flex flex-col gap-3 p-4 bg-secondary-system-background rounded-[2rem] border border-apple-border paper-emboss">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 bg-apple-blue/5 text-apple-blue rounded-xl flex items-center justify-center">
                      <Activity size={14} />
                    </div>
                    <button 
                      onClick={() => setPlayInBackground(!playInBackground)}
                      className={`w-9 h-5 rounded-full relative transition-colors paper-button ${playInBackground ? 'bg-apple-blue' : 'bg-system-tertiary-label'}`}
                    >
                      <motion.div className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full" animate={{ x: playInBackground ? 16 : 0 }} />
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-system-label uppercase tracking-widest">Background</span>
                    <span className="text-[7px] font-bold text-system-tertiary-label uppercase">Stable Play</span>
                  </div>
                </div>
              )}

              {/* Pitch Safe Mode Toggle */}
              {setPitchSafeMode !== undefined && (
                <div className="flex flex-col gap-3 p-4 bg-secondary-system-background rounded-[2rem] border border-apple-border paper-emboss">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${colorHex}10`, color: colorHex }}>
                      <Ear size={14} />
                    </div>
                    <button 
                      onClick={() => setPitchSafeMode(!pitchSafeMode)}
                      className={`w-9 h-5 rounded-full relative transition-colors paper-button ${pitchSafeMode ? (color.includes('emerald') ? 'bg-emerald-600' : color.includes('red') ? 'bg-red-900' : color.includes('blue') ? 'bg-apple-blue' : color.includes('purple') ? 'bg-purple-500' : color.includes('green') ? 'bg-green-500' : color.includes('amber') ? 'bg-amber-800' : color.includes('rose') ? 'bg-rose-600' : 'bg-orange-500') : 'bg-system-tertiary-label'}`}
                    >
                      <motion.div className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full" animate={{ x: pitchSafeMode ? 16 : 0 }} />
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-system-label uppercase tracking-widest">Pitch Safe</span>
                    <span className="text-[7px] font-bold text-system-tertiary-label uppercase">Meditation</span>
                  </div>
                </div>
              )}
            </div>

            {/* Buffer Mode Control */}
            {setBufferMode !== undefined && (
              <div className="space-y-4">
                <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1 leading-relaxed">
                  Loop Buffer Strategy
                </p>
                <div className="flex bg-secondary-system-background p-1.5 rounded-full h-11 border border-apple-border paper-emboss">
                  {(['single', 'double'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setBufferMode(m)}
                      className={`flex-1 h-full rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-200 paper-button ${bufferMode === m ? 'bg-white dark:bg-[#1c1c1b] text-apple-blue shadow-md' : 'text-system-secondary-label hover:text-system-label'}`}
                    >
                      {m === 'single' ? 'Single (Eco)' : 'Double (Gapless)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Volume Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-system-tertiary-label uppercase tracking-widest">Volume (%)</span>
                <input 
                  type="number"
                  value={Math.round(vol * 100)}
                  onChange={(e) => setVol(Math.min(1, Math.max(0, (parseInt(e.target.value) || 0) / 100)))}
                  className="w-12 h-7 bg-system-background border border-apple-border rounded-lg text-[10px] font-black text-center focus:outline-none tabular-nums"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 px-1">
                  <input 
                    type="range" min={0} max={1} step={0.01} value={vol}
                    onChange={(e) => setVol(parseFloat(e.target.value))}
                    className="w-full h-1 bg-apple-border rounded-full appearance-none accent-system-label"
                  />
                </div>
              </div>
            </div>

            {/* Gain Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-system-tertiary-label uppercase tracking-widest">Gain (dB)</span>
                <div className="flex items-center gap-2">
                   {gainDb < 0 && <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Reduction</span>}
                   <input 
                    type="number"
                    value={gainDb}
                    onChange={(e) => setGainDb(Math.min(0, Math.max(-60, parseInt(e.target.value) || 0)))}
                    className="w-12 h-7 bg-system-background border border-apple-border rounded-lg text-[10px] font-black text-center focus:outline-none tabular-nums"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 px-1">
                  <input 
                    type="range" min={-60} max={0} step={1} value={gainDb}
                    onChange={(e) => setGainDb(parseInt(e.target.value))}
                    className="w-full h-1 bg-apple-border rounded-full appearance-none accent-apple-blue"
                  />
                </div>
              </div>
            </div>

            {children && (
              <div className="pt-2 border-t border-apple-border/50">
                {children}
              </div>
            )}

            {(setNormalize || onApplyPreset) && (
              <div className="pt-2 border-t border-apple-border/50">
                <button 
                  onClick={() => setIsToolsExpanded(!isToolsExpanded)}
                  className="w-full flex items-center justify-between py-3 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-apple-blue/10 text-apple-blue rounded-xl flex items-center justify-center">
                        <Sliders size={14} />
                    </div>
                    <span className="text-[10px] font-black text-system-label uppercase tracking-widest">Audio Optimization</span>
                  </div>
                  <ChevronRight size={16} className={`text-system-tertiary-label transition-transform ${isToolsExpanded ? 'rotate-90 text-apple-blue' : ''}`} />
                </button>

                <AnimatePresence>
                  {isToolsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-5 pt-5"
                    >
                      {setNormalize && (
                        <div className="flex items-center justify-between p-4 bg-secondary-system-background rounded-2xl border border-apple-border paper-emboss">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-system-label uppercase tracking-widest">Normalization</span>
                              <span className="text-[8px] font-bold text-system-secondary-label uppercase">{normalize ? 'Perfect Balance' : 'Raw Output'}</span>
                            </div>
                            <button 
                              onClick={() => setNormalize(!normalize)}
                              className={`w-8 h-5 rounded-full relative transition-colors paper-button ${normalize ? 'bg-apple-blue' : 'bg-system-tertiary-label'}`}
                            >
                              <motion.div className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full" animate={{ x: normalize ? 12 : 0 }} />
                            </button>
                        </div>
                      )}
                      {onApplyPreset && (
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => onApplyPreset('soft')}
                            className="py-3 rounded-2xl bg-white dark:bg-[#1c1c1b] border border-apple-border text-[9px] font-black uppercase tracking-widest text-system-label paper-button shadow-sm"
                          >
                            Soft Mix
                          </button>
                          <button 
                            onClick={() => onApplyPreset('night')}
                            className="py-3 rounded-2xl bg-white dark:bg-[#1c1c1b] border border-apple-border text-[9px] font-black uppercase tracking-widest text-system-label paper-button shadow-sm"
                          >
                            Binaural Night
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
