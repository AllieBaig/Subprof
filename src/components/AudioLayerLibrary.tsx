import React, { useState, useEffect } from 'react';
import { useSettings } from '../SettingsContext';
import { useAudio } from '../AudioContext';
import { LayerAccordion, HzSelector, PhysicalSoundEngineUI } from './LayerUI';
import { NATURE_SOUNDS } from '../constants';
import { 
  Volume2, Activity, CloudRain, Wind, 
  Music as MusicIcon, Zap, Sliders, Ear,
  ChevronDown, ChevronRight, Waves, Radio
} from 'lucide-react';
import { PickerWheel } from './PickerWheel';
import { HzProfiles } from './HzProfiles';

export const AudioLayerLibrary = () => {
  const { 
    settings, 
    updateSubliminalSettings,
    updateBinauralSettings,
    updateNatureSettings,
    updateNoiseSettings,
    updateDidgeridooSettings,
    updatePureHzSettings,
    updateIsochronicSettings,
    updateSolfeggioSettings,
    updateSchumannSettings,
    updateShamanicSettings,
    updateMentalToughnessSettings,
    updateSyncLabSettings,
    updateSettings
  } = useSettings();

  const { playlists, tracks } = useAudio();
  const [expandedLayerId, setExpandedLayerId] = useState<string | null>(() => {
    return localStorage.getItem('last_expanded_layer_id');
  });

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('expanded_audio_groups');
    return saved ? JSON.parse(saved) : { main: true, frequency: false, soundscape: true, sync: false };
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = { ...prev, [groupId]: !prev[groupId] };
      localStorage.setItem('expanded_audio_groups', JSON.stringify(next));
      return next;
    });
  };

  const toggleLayer = (id: string) => {
    const next = expandedLayerId === id ? null : id;
    setExpandedLayerId(next);
    if (next) localStorage.setItem('last_expanded_layer_id', next);
    else localStorage.removeItem('last_expanded_layer_id');
  };

  const applyLayerPreset = (layer: string, preset: 'soft' | 'night' | 'focus') => {
    // Shared preset logic
    const updateFnMap: any = {
      main: (s: any) => updateSettings({ mainVolume: s.volume, mainGainDb: s.gainDb }),
      subliminal: updateSubliminalSettings,
      binaural: updateBinauralSettings,
      nature: updateNatureSettings,
      noise: updateNoiseSettings,
      didgeridoo: updateDidgeridooSettings,
      pureHz: updatePureHzSettings,
      isochronic: updateIsochronicSettings,
      solfeggio: updateSolfeggioSettings,
      schumann: updateSchumannSettings,
      shamanic: updateShamanicSettings,
      mentalToughness: updateMentalToughnessSettings
    };

    const updateFn = updateFnMap[layer];
    if (!updateFn) return;

    if (preset === 'soft') {
      updateFn({ volume: 0.15, gainDb: -12, normalize: true });
    } else if (preset === 'night') {
      updateFn({ volume: 0.1, gainDb: -18, normalize: true });
    }
  };

  return (
    <div className={`flex flex-col ${settings.appearance.uiMode === 'mini' ? 'gap-3' : 'gap-6'}`}>
      {/* GROUP 0: MAIN AUDIO */}
      <div className={settings.appearance.uiMode === 'mini' ? 'space-y-1' : 'space-y-3'}>
        <button 
          onClick={() => toggleGroup('main')}
          className={`flex items-center gap-3 w-full border border-apple-border paper-button paper-emboss ${settings.appearance.uiMode === 'mini' ? 'px-3 py-2 rounded-xl bg-secondary-system-background/30' : 'px-4 py-3 rounded-2xl bg-secondary-system-background/50'}`}
        >
          <div className={`${settings.appearance.uiMode === 'mini' ? 'w-6 h-6 rounded-md' : 'w-8 h-8 rounded-lg'} bg-apple-blue/10 flex items-center justify-center text-apple-blue group-hover:scale-105 transition-transform`}>
            <MusicIcon size={settings.appearance.uiMode === 'mini' ? 12 : 16} />
          </div>
          <div className="flex-1 text-left">
            <h3 className={`${settings.appearance.uiMode === 'mini' ? 'text-[10px]' : 'text-xs'} serif-title text-system-label italic`}>Main Audio</h3>
            {settings.appearance.uiMode !== 'mini' && <p className="text-[9px] font-bold text-system-tertiary-label uppercase tracking-widest">Primary Channel</p>}
          </div>
          {expandedGroups.main ? <ChevronDown size={settings.appearance.uiMode === 'mini' ? 12 : 14} className="text-system-tertiary-label" /> : <ChevronRight size={settings.appearance.uiMode === 'mini' ? 12 : 14} className="text-system-tertiary-label" />}
        </button>

        {expandedGroups.main && (
          <div className={`flex flex-col animate-in slide-in-from-top-2 duration-300 ${settings.appearance.uiMode === 'mini' ? 'gap-2' : 'gap-3'}`}>
            <LayerAccordion 
              id="main_channel" icon={Sliders} label="Output Master" 
              isEnabled={true} 
              onToggle={() => {}} // Always enabled
              isExpanded={expandedLayerId === 'main_channel'}
              onAccordionToggle={() => toggleLayer('main_channel')}
              vol={settings.mainVolume}
              setVol={(v: number) => updateSettings({ mainVolume: v })}
              gainDb={settings.mainGainDb}
              setGainDb={(v: number) => updateSettings({ mainGainDb: v })}
              color="text-apple-blue"
              subtitle="Main Stream"
              onApplyPreset={(p: any) => applyLayerPreset('main', p)}
              hideToggle
            >
              <div className="space-y-4">
                <p className="text-[10px] font-medium text-system-secondary-label leading-relaxed">
                  Controls the primary playback volume and gain for your main playlist tracks.
                </p>
              </div>
            </LayerAccordion>
          </div>
        )}
      </div>

      {/* GROUP 1: FREQUENCY */}
      <div className={settings.appearance.uiMode === 'mini' ? 'space-y-1' : 'space-y-3'}>
        <button 
          onClick={() => toggleGroup('frequency')}
          className={`flex items-center gap-3 w-full border border-apple-border paper-button paper-emboss ${settings.appearance.uiMode === 'mini' ? 'px-3 py-2 rounded-xl bg-secondary-system-background/30' : 'px-4 py-3 rounded-2xl bg-secondary-system-background/50'}`}
        >
          <div className={`${settings.appearance.uiMode === 'mini' ? 'w-6 h-6 rounded-md' : 'w-8 h-8 rounded-lg'} bg-indigo-500/10 flex items-center justify-center text-indigo-500`}>
            <Radio size={settings.appearance.uiMode === 'mini' ? 12 : 16} />
          </div>
          <div className="flex-1 text-left">
            <h3 className={`${settings.appearance.uiMode === 'mini' ? 'text-[10px]' : 'text-xs'} serif-title text-system-label italic`}>Frequency</h3>
            {settings.appearance.uiMode !== 'mini' && <p className="text-[9px] font-bold text-system-tertiary-label uppercase tracking-widest">Hz-based layers</p>}
          </div>
          {expandedGroups.frequency ? <ChevronDown size={settings.appearance.uiMode === 'mini' ? 12 : 14} className="text-system-tertiary-label" /> : <ChevronRight size={settings.appearance.uiMode === 'mini' ? 12 : 14} className="text-system-tertiary-label" />}
        </button>

        {expandedGroups.frequency && (
          <div className={`flex flex-col animate-in slide-in-from-top-2 duration-300 ${settings.appearance.uiMode === 'mini' ? 'gap-2' : 'gap-3'}`}>
            {/* Binaural */}
            <LayerAccordion 
              id="binaural" icon={Activity} label="Binaural Beats" 
              isEnabled={settings.binaural.isEnabled} 
              onToggle={(v: boolean) => updateBinauralSettings({ isEnabled: v })}
              isExpanded={expandedLayerId === 'binaural'}
              onAccordionToggle={() => toggleLayer('binaural')}
              vol={settings.binaural.volume}
              setVol={(v: number) => updateBinauralSettings({ volume: v })}
              gainDb={settings.binaural.gainDb}
              setGainDb={(v: number) => updateBinauralSettings({ gainDb: v })}
              normalize={settings.binaural.normalize}
              setNormalize={(v: boolean) => updateBinauralSettings({ normalize: v })}
              playInBackground={settings.binaural.playInBackground}
              setPlayInBackground={(v: boolean) => updateBinauralSettings({ playInBackground: v })}
              pitchSafeMode={settings.binaural.pitchSafeMode}
              setPitchSafeMode={(v: boolean) => updateBinauralSettings({ pitchSafeMode: v })}
              bufferMode={settings.binaural.bufferMode}
              setBufferMode={(v: any) => updateBinauralSettings({ bufferMode: v })}
              color="text-purple-500"
              subtitle={`${settings.binaural.leftFreq}Hz / ${settings.binaural.rightFreq}Hz`}
              onApplyPreset={(p: any) => applyLayerPreset('binaural', p)}
            >
              <div className="flex flex-col gap-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <div className="flex justify-between items-center px-1">
                          <span className="text-[9px] font-black text-system-tertiary-label uppercase">Left (Hz)</span>
                       </div>
                       <HzSelector 
                         value={settings.binaural.leftFreq} 
                         onChange={(v) => updateBinauralSettings({ leftFreq: v })} 
                         color="purple"
                       />
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center px-1">
                          <span className="text-[9px] font-black text-system-tertiary-label uppercase">Right (Hz)</span>
                       </div>
                       <HzSelector 
                         value={settings.binaural.rightFreq} 
                         onChange={(v) => updateBinauralSettings({ rightFreq: v })} 
                         color="purple"
                       />
                    </div>
                 </div>
              </div>
            </LayerAccordion>

            {/* Pure Hz */}
            <LayerAccordion 
              id="pureHz" icon={Activity} label="Pure Hz" 
              isEnabled={settings.pureHz.isEnabled} 
              onToggle={(v: boolean) => updatePureHzSettings({ isEnabled: v })}
              isExpanded={expandedLayerId === 'pureHz'}
              onAccordionToggle={() => toggleLayer('pureHz')}
              vol={settings.pureHz.volume}
              setVol={(v: number) => updatePureHzSettings({ volume: v })}
              gainDb={settings.pureHz.gainDb}
              setGainDb={(v: number) => updatePureHzSettings({ gainDb: v })}
              normalize={settings.pureHz.normalize}
              setNormalize={(v: boolean) => updatePureHzSettings({ normalize: v })}
              playInBackground={settings.pureHz.playInBackground}
              setPlayInBackground={(v: boolean) => updatePureHzSettings({ playInBackground: v })}
              pitchSafeMode={settings.pureHz.pitchSafeMode}
              setPitchSafeMode={(v: boolean) => updatePureHzSettings({ pitchSafeMode: v })}
              bufferMode={settings.pureHz.bufferMode}
              setBufferMode={(v: any) => updatePureHzSettings({ bufferMode: v })}
              color="text-rose-600"
              subtitle={`${settings.pureHz.frequency}Hz`}
              onApplyPreset={(p: any) => applyLayerPreset('pureHz', p)}
            >
              <HzSelector 
                value={settings.pureHz.frequency} 
                onChange={(v) => updatePureHzSettings({ frequency: v })} 
                color="rose"
              />
            </LayerAccordion>

            {/* Isochronic */}
            <LayerAccordion 
              id="isochronic" icon={Zap} label="Isochronic Tones" 
              isEnabled={settings.isochronic.isEnabled} 
              onToggle={(v: boolean) => updateIsochronicSettings({ isEnabled: v })}
              isExpanded={expandedLayerId === 'isochronic'}
              onAccordionToggle={() => toggleLayer('isochronic')}
              vol={settings.isochronic.volume}
              setVol={(v: number) => updateIsochronicSettings({ volume: v })}
              gainDb={settings.isochronic.gainDb}
              setGainDb={(v: number) => updateIsochronicSettings({ gainDb: v })}
              normalize={settings.isochronic.normalize}
              setNormalize={(v: boolean) => updateIsochronicSettings({ normalize: v })}
              playInBackground={settings.isochronic.playInBackground}
              setPlayInBackground={(v: boolean) => updateIsochronicSettings({ playInBackground: v })}
              pitchSafeMode={settings.isochronic.pitchSafeMode}
              setPitchSafeMode={(v: boolean) => updateIsochronicSettings({ pitchSafeMode: v })}
              bufferMode={settings.isochronic.bufferMode}
              setBufferMode={(v: any) => updateIsochronicSettings({ bufferMode: v })}
              color="text-blue-600"
              subtitle={`${settings.isochronic.frequency}Hz pulse`}
              onApplyPreset={(p: any) => applyLayerPreset('isochronic', p)}
            >
              <div className="space-y-4">
                 <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1">Carrier Frequency (Hz)</p>
                 <HzSelector 
                   value={settings.isochronic.frequency} 
                   onChange={(v) => updateIsochronicSettings({ frequency: v })} 
                   color="blue"
                 />
                 <div className="space-y-2">
                    <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1">Pulse Rate (Hz)</p>
                    <HzSelector 
                      value={settings.isochronic.pulseRate} 
                      onChange={(v) => updateIsochronicSettings({ pulseRate: v })} 
                      color="blue"
                    />
                 </div>
              </div>
            </LayerAccordion>

            {/* Solfeggio */}
            <LayerAccordion 
              id="solfeggio" icon={Ear} label="Solfeggio Layers" 
              isEnabled={settings.solfeggio.isEnabled} 
              onToggle={(v: boolean) => updateSolfeggioSettings({ isEnabled: v })}
              isExpanded={expandedLayerId === 'solfeggio'}
              onAccordionToggle={() => toggleLayer('solfeggio')}
              vol={settings.solfeggio.volume}
              setVol={(v: number) => updateSolfeggioSettings({ volume: v })}
              gainDb={settings.solfeggio.gainDb}
              setGainDb={(v: number) => updateSolfeggioSettings({ gainDb: v })}
              normalize={settings.solfeggio.normalize}
              setNormalize={(v: boolean) => updateSolfeggioSettings({ normalize: v })}
              playInBackground={settings.solfeggio.playInBackground}
              setPlayInBackground={(v: boolean) => updateSolfeggioSettings({ playInBackground: v })}
              pitchSafeMode={settings.solfeggio.pitchSafeMode}
              setPitchSafeMode={(v: boolean) => updateSolfeggioSettings({ pitchSafeMode: v })}
              bufferMode={settings.solfeggio.bufferMode}
              setBufferMode={(v: any) => updateSolfeggioSettings({ bufferMode: v })}
              color="text-emerald-600"
              subtitle={`${settings.solfeggio.frequency}Hz Healing`}
              onApplyPreset={(p: any) => applyLayerPreset('solfeggio', p)}
            >
              <HzSelector 
                value={settings.solfeggio.frequency} 
                onChange={(v) => updateSolfeggioSettings({ frequency: v })} 
                color="emerald"
              />
            </LayerAccordion>

            {/* Schumann Resonance */}
            <LayerAccordion 
              id="schumann" icon={Waves} label="Schumann Resonance" 
              isEnabled={settings.schumann.isEnabled} 
              onToggle={(v: boolean) => updateSchumannSettings({ isEnabled: v })}
              isExpanded={expandedLayerId === 'schumann'}
              onAccordionToggle={() => toggleLayer('schumann')}
              vol={settings.schumann.volume}
              setVol={(v: number) => updateSchumannSettings({ volume: v })}
              gainDb={settings.schumann.gainDb}
              setGainDb={(v: number) => updateSchumannSettings({ gainDb: v })}
              normalize={settings.schumann.normalize}
              setNormalize={(v: boolean) => updateSchumannSettings({ normalize: v })}
              playInBackground={settings.schumann.playInBackground}
              setPlayInBackground={(v: boolean) => updateSchumannSettings({ playInBackground: v })}
              pitchSafeMode={settings.schumann.pitchSafeMode}
              setPitchSafeMode={(v: boolean) => updateSchumannSettings({ pitchSafeMode: v })}
              bufferMode={settings.schumann.bufferMode}
              setBufferMode={(v: any) => updateSchumannSettings({ bufferMode: v })}
              color="text-blue-500"
              subtitle={`${settings.schumann.frequency}Hz Resonance`}
              onApplyPreset={(p: any) => applyLayerPreset('schumann', p)}
            >
              <div className="space-y-4">
                <HzSelector 
                  value={settings.schumann.frequency} 
                  onChange={(v) => updateSchumannSettings({ frequency: v })} 
                  color="blue"
                />
                <div className="grid grid-cols-5 gap-1 pt-2">
                  {[7.83, 14.3, 20.8, 27.3, 33.8].map(hz => (
                    <button 
                      key={hz}
                      onClick={() => updateSchumannSettings({ frequency: hz })}
                      className={`py-1.5 rounded-lg text-[8px] font-black tracking-tight transition-all border ${settings.schumann.frequency === hz ? 'bg-blue-500 text-white border-blue-500' : 'bg-secondary-system-background text-system-secondary-label border-transparent'}`}
                    >
                      {hz}Hz
                    </button>
                  ))}
                </div>
              </div>
            </LayerAccordion>
          </div>
        )}
      </div>

      {/* GROUP 2: SOUNDSCAPE */}
      <div className={settings.appearance.uiMode === 'mini' ? 'space-y-1' : 'space-y-3'}>
        <button 
          onClick={() => toggleGroup('soundscape')}
          className={`flex items-center gap-3 w-full border border-apple-border paper-button paper-emboss ${settings.appearance.uiMode === 'mini' ? 'px-3 py-2 rounded-xl bg-secondary-system-background/30' : 'px-4 py-3 rounded-2xl bg-secondary-system-background/50'}`}
        >
          <div className={`${settings.appearance.uiMode === 'mini' ? 'w-6 h-6 rounded-md' : 'w-8 h-8 rounded-lg'} bg-orange-500/10 flex items-center justify-center text-orange-500`}>
            <Waves size={settings.appearance.uiMode === 'mini' ? 12 : 16} />
          </div>
          <div className="flex-1 text-left">
            <h3 className={`${settings.appearance.uiMode === 'mini' ? 'text-[10px]' : 'text-xs'} serif-title text-system-label italic`}>Soundscape</h3>
            {settings.appearance.uiMode !== 'mini' && <p className="text-[9px] font-bold text-system-tertiary-label uppercase tracking-widest">Ambient + Human</p>}
          </div>
          {expandedGroups.soundscape ? <ChevronDown size={settings.appearance.uiMode === 'mini' ? 12 : 14} className="text-system-tertiary-label" /> : <ChevronRight size={settings.appearance.uiMode === 'mini' ? 12 : 14} className="text-system-tertiary-label" />}
        </button>

        {expandedGroups.soundscape && (
          <div className={`flex flex-col animate-in slide-in-from-top-2 duration-300 ${settings.appearance.uiMode === 'mini' ? 'gap-2' : 'gap-3'}`}>
            {/* Subliminal */}
            <LayerAccordion 
              id="subliminal" icon={Volume2} label="Subliminal Audio" 
              isEnabled={settings.subliminal.isEnabled} 
              onToggle={(v: boolean) => updateSubliminalSettings({ isEnabled: v })}
              isExpanded={expandedLayerId === 'subliminal'}
              onAccordionToggle={() => toggleLayer('subliminal')}
              vol={settings.subliminal.volume}
              setVol={(v: number) => updateSubliminalSettings({ volume: v })}
              gainDb={settings.subliminal.gainDb}
              setGainDb={(v: number) => updateSubliminalSettings({ gainDb: v })}
              normalize={settings.subliminal.normalize}
              setNormalize={(v: boolean) => updateSubliminalSettings({ normalize: v })}
              playInBackground={settings.subliminal.playInBackground}
              setPlayInBackground={(v: boolean) => updateSubliminalSettings({ playInBackground: v })}
              color="text-apple-blue"
              subtitle={settings.subliminal.isPlaylistMode ? 'Playlist Mode' : 'Track Mode'}
              onApplyPreset={(p: any) => applyLayerPreset('subliminal', p)}
            >
              <div className="flex flex-col gap-6">
                <div className="bg-secondary-system-background/50 p-1 rounded-xl flex items-center h-8 paper-emboss">
                  <button 
                    onClick={() => updateSubliminalSettings({ isPlaylistMode: false })}
                    className={`flex-1 h-full text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all paper-button ${!settings.subliminal.isPlaylistMode ? 'bg-white shadow-sm text-apple-blue' : 'text-system-secondary-label'}`}
                  >
                    Track
                  </button>
                  <button 
                    onClick={() => updateSubliminalSettings({ isPlaylistMode: true })}
                    className={`flex-1 h-full text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all paper-button ${settings.subliminal.isPlaylistMode ? 'bg-white shadow-sm text-apple-blue' : 'text-system-secondary-label'}`}
                  >
                    Playlist
                  </button>
                </div>

                {!settings.subliminal.isPlaylistMode && settings.subliminal.sourcePlaylistId && (
                  <div className="flex flex-col gap-3">
                    {(() => {
                      const sourcePlaylist = playlists.find(p => p.id === settings.subliminal.sourcePlaylistId);
                      if (!sourcePlaylist || sourcePlaylist.trackIds.length === 0) return null;

                      const pickerItems = sourcePlaylist.trackIds.map(tid => ({
                        id: tid,
                        label: tracks.find(mt => mt.id === tid)?.name || 'Unknown Track'
                      }));

                      return (
                        <PickerWheel 
                          items={pickerItems}
                          selectedValue={settings.subliminal.selectedTrackId}
                          onValueChange={(id) => updateSubliminalSettings({ selectedTrackId: id })}
                          height={140}
                          itemHeight={36}
                        />
                      );
                    })()}
                  </div>
                )}
              </div>
            </LayerAccordion>

            {/* Nature */}
            <LayerAccordion 
              id="nature" icon={CloudRain} label="Nature Ambience" 
              isEnabled={settings.nature.isEnabled} 
              onToggle={(v: boolean) => updateNatureSettings({ isEnabled: v })}
              isExpanded={expandedLayerId === 'nature'}
              onAccordionToggle={() => toggleLayer('nature')}
              vol={settings.nature.volume}
              setVol={(v: number) => updateNatureSettings({ volume: v })}
              gainDb={settings.nature.gainDb}
              setGainDb={(v: number) => updateNatureSettings({ gainDb: v })}
              normalize={settings.nature.normalize}
              setNormalize={(v: boolean) => updateNatureSettings({ normalize: v })}
              playInBackground={settings.nature.playInBackground}
              setPlayInBackground={(v: boolean) => updateNatureSettings({ playInBackground: v })}
              pitchSafeMode={settings.nature.pitchSafeMode}
              setPitchSafeMode={(v: boolean) => updateNatureSettings({ pitchSafeMode: v })}
              bufferMode={settings.nature.bufferMode}
              setBufferMode={(v: any) => updateNatureSettings({ bufferMode: v })}
              color="text-green-500"
              subtitle={`${settings.nature.type} @ ${settings.nature.frequency}Hz`}
              onApplyPreset={(p: any) => applyLayerPreset('nature', p)}
            >
              <div className="space-y-6">
                <HzSelector 
                  value={settings.nature.frequency} 
                  onChange={(v) => updateNatureSettings({ frequency: v })} 
                  color="green"
                />
                <div className="grid grid-cols-3 gap-2">
                  {NATURE_SOUNDS.map(sound => (
                    <button 
                      key={sound.id}
                      onClick={() => updateNatureSettings({ type: sound.id as any })}
                      className={`py-2 px-1 rounded-xl text-[9px] font-bold uppercase transition-all border paper-button ${settings.nature.type === sound.id ? 'bg-green-500 text-white border-green-500 shadow-sm' : 'bg-secondary-system-background/50 border-apple-border text-system-secondary-label'}`}
                    >
                      {sound.name}
                    </button>
                  ))}
                </div>
              </div>
            </LayerAccordion>

            {/* Noise */}
            <LayerAccordion 
              id="noise" icon={Wind} label="Noise Colors" 
              isEnabled={settings.noise.isEnabled} 
              onToggle={(v: boolean) => updateNoiseSettings({ isEnabled: v })}
              isExpanded={expandedLayerId === 'noise'}
              onAccordionToggle={() => toggleLayer('noise')}
              vol={settings.noise.volume}
              setVol={(v: number) => updateNoiseSettings({ volume: v })}
              gainDb={settings.noise.gainDb}
              setGainDb={(v: number) => updateNoiseSettings({ gainDb: v })}
              normalize={settings.noise.normalize}
              setNormalize={(v: boolean) => updateNoiseSettings({ normalize: v })}
              playInBackground={settings.noise.playInBackground}
              setPlayInBackground={(v: boolean) => updateNoiseSettings({ playInBackground: v })}
              pitchSafeMode={settings.noise.pitchSafeMode}
              setPitchSafeMode={(v: boolean) => updateNoiseSettings({ pitchSafeMode: v })}
              bufferMode={settings.noise.bufferMode}
              setBufferMode={(v: any) => updateNoiseSettings({ bufferMode: v })}
              color="text-orange-500"
              subtitle={`${settings.noise.type} @ ${settings.noise.frequency}Hz`}
              onApplyPreset={(p: any) => applyLayerPreset('noise', p)}
            >
              <div className="space-y-6">
                <HzSelector 
                  value={settings.noise.frequency} 
                  onChange={(v) => updateNoiseSettings({ frequency: v })} 
                  color="orange"
                />
                <div className="grid grid-cols-3 gap-2">
                  {['white', 'pink', 'brown'].map(type => (
                    <button 
                      key={type}
                      onClick={() => updateNoiseSettings({ type: type as any })}
                      className={`py-2 px-1 rounded-xl text-[9px] font-bold uppercase transition-all border paper-button ${settings.noise.type === type ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'bg-secondary-system-background/50 border-apple-border text-system-secondary-label'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </LayerAccordion>

            {/* Didgeridoo */}
            <LayerAccordion 
              id="didgeridoo" icon={MusicIcon} label="Didgeridoo" 
              isEnabled={settings.didgeridoo.isEnabled} 
              onToggle={(v: boolean) => updateDidgeridooSettings({ isEnabled: v })}
              isExpanded={expandedLayerId === 'didgeridoo'}
              onAccordionToggle={() => toggleLayer('didgeridoo')}
              vol={settings.didgeridoo.volume}
              setVol={(v: number) => updateDidgeridooSettings({ volume: v })}
              gainDb={settings.didgeridoo.gainDb}
              setGainDb={(v: number) => updateDidgeridooSettings({ gainDb: v })}
              normalize={settings.didgeridoo.normalize}
              setNormalize={(v: boolean) => updateDidgeridooSettings({ normalize: v })}
              playInBackground={settings.didgeridoo.playInBackground}
              setPlayInBackground={(v: boolean) => updateDidgeridooSettings({ playInBackground: v })}
              pitchSafeMode={settings.didgeridoo.pitchSafeMode}
              setPitchSafeMode={(v: boolean) => updateDidgeridooSettings({ pitchSafeMode: v })}
              bufferMode={settings.didgeridoo.bufferMode}
              setBufferMode={(v: any) => updateDidgeridooSettings({ bufferMode: v })}
              color="text-amber-800"
              subtitle={`${Math.round(settings.didgeridoo.frequency)}Hz Drone`}
              onApplyPreset={(p: any) => applyLayerPreset('didgeridoo', p)}
            >
              <div className="space-y-4">
                 <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1">Target Frequency (Hz)</p>
                 <HzSelector 
                   value={settings.didgeridoo.frequency} 
                   onChange={(v) => updateDidgeridooSettings({ 
                     frequency: v,
                     playbackRate: v / 65 
                   })} 
                   color="amber"
                 />
                 <div className="space-y-2">
                    <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1">Resonance Depth</p>
                    <div className="px-2">
                      <input 
                        type="range" min={0.0} max={1.0} step={0.05}
                        value={settings.didgeridoo.depth}
                        onChange={(e) => updateDidgeridooSettings({ depth: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-apple-border rounded-full appearance-none accent-amber-800"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[8px] font-bold text-system-tertiary-label uppercase">Narrow</span>
                        <span className="text-[10px] font-black text-amber-800 tabular-nums">{(settings.didgeridoo.depth * 100).toFixed(0)}%</span>
                        <span className="text-[8px] font-bold text-system-tertiary-label uppercase">Deep</span>
                      </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-apple-border/30">
                   <PhysicalSoundEngineUI 
                     phys={settings.didgeridoo.physical} 
                     onChange={(v) => updateDidgeridooSettings({ physical: v })} 
                     color="amber"
                   />
                 </div>
              </div>
            </LayerAccordion>

            {/* Shamanic Drumming */}
            <LayerAccordion 
              id="shamanic" icon={MusicIcon} label="Shamanic Drumming" 
              isEnabled={settings.shamanic.isEnabled} 
              onToggle={(v: boolean) => updateShamanicSettings({ isEnabled: v })}
              isExpanded={expandedLayerId === 'shamanic'}
              onAccordionToggle={() => toggleLayer('shamanic')}
              vol={settings.shamanic.volume}
              setVol={(v: number) => updateShamanicSettings({ volume: v })}
              gainDb={settings.shamanic.gainDb}
              setGainDb={(v: number) => updateShamanicSettings({ gainDb: v })}
              normalize={settings.shamanic.normalize}
              setNormalize={(v: boolean) => updateShamanicSettings({ normalize: v })}
              playInBackground={settings.shamanic.playInBackground}
              setPlayInBackground={(v: boolean) => updateShamanicSettings({ playInBackground: v })}
              pitchSafeMode={settings.shamanic.pitchSafeMode}
              setPitchSafeMode={(v: boolean) => updateShamanicSettings({ pitchSafeMode: v })}
              bufferMode={settings.shamanic.bufferMode}
              setBufferMode={(v: any) => updateShamanicSettings({ bufferMode: v })}
              color="text-red-900"
              subtitle={`${Math.round(settings.shamanic.frequency)}Hz Tribal`}
              onApplyPreset={(p: any) => applyLayerPreset('shamanic', p)}
            >
              <div className="space-y-4">
                 <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1">Drum Tone Frequency (Hz)</p>
                 <HzSelector 
                   value={settings.shamanic.frequency} 
                   onChange={(v) => updateShamanicSettings({ 
                     frequency: v 
                   })} 
                   color="red"
                 />
                 <div className="space-y-2">
                    <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1">Tempo / Intensity</p>
                    <div className="px-2">
                      <input 
                        type="range" min={0.5} max={4.0} step={0.1}
                        value={settings.shamanic.playbackRate}
                        onChange={(e) => updateShamanicSettings({ playbackRate: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-apple-border rounded-full appearance-none accent-red-900"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[8px] font-bold text-system-tertiary-label uppercase">Slow</span>
                        <span className="text-[10px] font-black text-red-900 tabular-nums">{settings.shamanic.playbackRate.toFixed(1)}x</span>
                        <span className="text-[8px] font-bold text-system-tertiary-label uppercase">Fast</span>
                      </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-apple-border/30">
                   <PhysicalSoundEngineUI 
                     phys={settings.shamanic.physical} 
                     onChange={(v) => updateShamanicSettings({ physical: v })} 
                     color="red"
                   />
                 </div>
              </div>
            </LayerAccordion>

            {/* Mental Toughness */}
            <LayerAccordion 
              id="mentalToughness" icon={Activity} label="Mental Toughness" 
              isEnabled={settings.mentalToughness.isEnabled} 
              onToggle={(v: boolean) => updateMentalToughnessSettings({ isEnabled: v })}
              isExpanded={expandedLayerId === 'mentalToughness'}
              onAccordionToggle={() => toggleLayer('mentalToughness')}
              vol={settings.mentalToughness.volume}
              setVol={(v: number) => updateMentalToughnessSettings({ volume: v })}
              gainDb={settings.mentalToughness.gainDb}
              setGainDb={(v: number) => updateMentalToughnessSettings({ gainDb: v })}
              normalize={settings.mentalToughness.normalize}
              setNormalize={(v: boolean) => updateMentalToughnessSettings({ normalize: v })}
              playInBackground={settings.mentalToughness.playInBackground}
              setPlayInBackground={(v: boolean) => updateMentalToughnessSettings({ playInBackground: v })}
              pitchSafeMode={settings.mentalToughness.pitchSafeMode}
              setPitchSafeMode={(v: boolean) => updateMentalToughnessSettings({ pitchSafeMode: v })}
              bufferMode={settings.mentalToughness.bufferMode}
              setBufferMode={(v: any) => updateMentalToughnessSettings({ bufferMode: v })}
              color="text-indigo-600"
              subtitle={`${settings.mentalToughness.pitch} ${settings.mentalToughness.texture}`}
              onApplyPreset={(p: any) => applyLayerPreset('mentalToughness', p)}
            >
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                   <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1">Hz Frequency Depth</p>
                   <HzSelector 
                     value={settings.mentalToughness.frequency} 
                     onChange={(v) => updateMentalToughnessSettings({ frequency: v })} 
                     color="indigo"
                   />
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1">Pitch Style</p>
                  <div className="grid grid-cols-4 gap-2">
                    {['soft', 'hard', 'loud', 'low'].map(p => (
                      <button 
                        key={p}
                        onClick={() => updateMentalToughnessSettings({ pitch: p as any })}
                        className={`py-2 px-1 rounded-xl text-[9px] font-bold uppercase transition-all border paper-button ${settings.mentalToughness.pitch === p ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-secondary-system-background/50 border-apple-border text-system-secondary-label'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1">Impact Texture</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'empty_wood', label: 'Empty Wood' },
                      { id: 'thin_wood', label: 'Thin Wood' },
                      { id: 'double_thin', label: 'Double Thin' },
                      { id: 'hollow_wood', label: 'Hollow Wood' },
                      { id: 'tribal_wood', label: 'Tribal Wood' }
                    ].map(t => (
                      <button 
                        key={t.id}
                        onClick={() => updateMentalToughnessSettings({ texture: t.id as any })}
                        className={`py-2 px-1 rounded-xl text-[8px] font-bold uppercase transition-all border paper-button ${settings.mentalToughness.texture === t.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-secondary-system-background/50 border-apple-border text-system-secondary-label'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1">Tempo / Speed</p>
                  <div className="px-2">
                    <input 
                      type="range" min={0.5} max={4.0} step={0.1}
                      value={settings.mentalToughness.playbackRate}
                      onChange={(e) => updateMentalToughnessSettings({ playbackRate: parseFloat(e.target.value) })}
                      className="w-full h-1 bg-apple-border rounded-full appearance-none accent-indigo-600"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[8px] font-bold text-system-tertiary-label uppercase">Slow</span>
                      <span className="text-[10px] font-black text-indigo-600 tabular-nums">{settings.mentalToughness.playbackRate.toFixed(1)}x</span>
                      <span className="text-[8px] font-bold text-system-tertiary-label uppercase">Fast</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] font-black text-system-tertiary-label uppercase tracking-widest pl-1">Banging Intensity</p>
                  <div className="grid grid-cols-4 gap-2">
                    {['light', 'medium', 'strong', 'deep'].map(i => (
                      <button 
                        key={i}
                        onClick={() => updateMentalToughnessSettings({ intensity: i as any })}
                        className={`py-2 px-1 rounded-xl text-[9px] font-bold uppercase transition-all border paper-button ${settings.mentalToughness.intensity === i ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-secondary-system-background/50 border-apple-border text-system-secondary-label'}`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-apple-border/30">
                  <PhysicalSoundEngineUI 
                    phys={settings.mentalToughness.physical} 
                    onChange={(v) => updateMentalToughnessSettings({ physical: v })} 
                    color="indigo"
                  />
                </div>
              </div>
            </LayerAccordion>
          </div>
        )}
      </div>

      {/* GROUP 3: SYNC LAB */}
      {settings.globalModes.syncLabEnabled && (
        <div className={settings.appearance.uiMode === 'mini' ? 'space-y-1' : 'space-y-3'}>
        <button 
          onClick={() => toggleGroup('sync')}
          className={`flex items-center gap-3 w-full border border-apple-border paper-button paper-emboss ${settings.appearance.uiMode === 'mini' ? 'px-3 py-2 rounded-xl bg-secondary-system-background/30' : 'px-4 py-3 rounded-2xl bg-secondary-system-background/50'}`}
        >
          <div className={`${settings.appearance.uiMode === 'mini' ? 'w-6 h-6 rounded-md' : 'w-8 h-8 rounded-lg'} bg-apple-blue/10 flex items-center justify-center text-apple-blue`}>
            <Activity size={settings.appearance.uiMode === 'mini' ? 12 : 16} />
          </div>
          <div className="flex-1 text-left">
            <h3 className={`${settings.appearance.uiMode === 'mini' ? 'text-[10px]' : 'text-xs'} serif-title text-system-label italic`}>Sync Lab</h3>
            {settings.appearance.uiMode !== 'mini' && <p className="text-[9px] font-bold text-system-tertiary-label uppercase tracking-widest">Global Hz Sync</p>}
          </div>
          {expandedGroups.sync ? <ChevronDown size={settings.appearance.uiMode === 'mini' ? 12 : 14} className="text-system-tertiary-label" /> : <ChevronRight size={settings.appearance.uiMode === 'mini' ? 12 : 14} className="text-system-tertiary-label" />}
        </button>

        {expandedGroups.sync && (
          <div className={`p-4 border border-apple-border rounded-2xl bg-system-background/50 backdrop-blur-md animate-in slide-in-from-top-2 duration-300 flex flex-col gap-6`}>
            {/* Link Mode Toggle */}
            <div className="flex items-center justify-between bg-secondary-system-background/30 p-3 rounded-xl border border-apple-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${settings.syncLab.linkMode ? 'bg-apple-blue/10 text-apple-blue' : 'bg-system-tertiary-label/10 text-system-tertiary-label'}`}>
                  <Zap size={14} fill={settings.syncLab.linkMode ? "currentColor" : "none"} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-system-label uppercase tracking-widest">Link Mode</p>
                  <p className="text-[8px] font-medium text-system-secondary-label">Sync all layers to Master Hz</p>
                </div>
              </div>
              <button 
                onClick={() => updateSyncLabSettings({ linkMode: !settings.syncLab.linkMode })}
                className={`w-10 h-5 rounded-full relative transition-colors ${settings.syncLab.linkMode ? 'bg-apple-blue' : 'bg-system-tertiary-label/30'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${settings.syncLab.linkMode ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Master Hz (if Link Mode) */}
            {settings.syncLab.linkMode && (
              <div className="space-y-3 pb-4 border-b border-apple-border/30">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-black text-apple-blue uppercase tracking-widest">Master Hz Carrier</span>
                  <span className="text-[12px] font-black text-system-label tabular-nums">{settings.syncLab.masterHz}Hz</span>
                </div>
                <HzSelector 
                  value={settings.syncLab.masterHz} 
                  onChange={(v) => {
                    updateSyncLabSettings({ masterHz: v });
                    // Sync all layers
                    const updates: any = {
                      pureHz: { frequency: v },
                      isochronic: { frequency: v },
                      solfeggio: { frequency: v },
                      schumann: { frequency: v },
                      nature: { frequency: v },
                      noise: { frequency: v },
                      didgeridoo: { frequency: v, playbackRate: v / 65 },
                      shamanic: { frequency: v },
                      mentalToughness: { frequency: v }
                    };
                    
                    // Binaural requires special handling
                    const beat = settings.binaural.rightFreq - settings.binaural.leftFreq;
                    updates.binaural = {
                      leftFreq: v - beat / 2,
                      rightFreq: v + beat / 2
                    };

                    updateBinauralSettings(updates.binaural);
                    updatePureHzSettings(updates.pureHz);
                    updateIsochronicSettings(updates.isochronic);
                    updateSolfeggioSettings(updates.solfeggio);
                    updateSchumannSettings(updates.schumann);
                    updateNatureSettings(updates.nature);
                    updateNoiseSettings(updates.noise);
                    updateDidgeridooSettings(updates.didgeridoo);
                    updateShamanicSettings(updates.shamanic);
                    updateMentalToughnessSettings(updates.mentalToughness);
                  }} 
                  color="blue"
                />
              </div>
            )}

            {/* Individual Sync Controls */}
            <div className="grid grid-cols-1 gap-4">
              {/* Hz PROFILES SYSTEM */}
              <div className="pt-2 border-t border-apple-border/30">
                <HzProfiles />
              </div>

              {/* Binaural Base */}
              <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <p className="text-[9px] font-bold text-system-secondary-label uppercase tracking-widest group-hover:text-purple-500 transition-colors">Binaural Base</p>
                  <span className="text-[10px] font-black text-system-label">{( (settings.binaural.leftFreq + settings.binaural.rightFreq) / 2 ).toFixed(1)}Hz</span>
                </div>
                <HzSelector 
                  value={ (settings.binaural.leftFreq + settings.binaural.rightFreq) / 2 } 
                  onChange={(v) => {
                    const beat = settings.binaural.rightFreq - settings.binaural.leftFreq;
                    updateBinauralSettings({
                      leftFreq: v - beat / 2,
                      rightFreq: v + beat / 2
                    });
                    if (settings.syncLab.linkMode) updateSyncLabSettings({ masterHz: v });
                  }} 
                  color="purple"
                />
              </div>

              {/* Pure Hz */}
              <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <p className="text-[9px] font-bold text-system-secondary-label uppercase tracking-widest group-hover:text-rose-600 transition-colors">Pure Hz</p>
                  <span className="text-[10px] font-black text-system-label">{settings.pureHz.frequency}Hz</span>
                </div>
                <HzSelector 
                  value={settings.pureHz.frequency} 
                  onChange={(v) => {
                    updatePureHzSettings({ frequency: v });
                    if (settings.syncLab.linkMode) updateSyncLabSettings({ masterHz: v });
                  }} 
                  color="rose"
                />
              </div>

              {/* Isochronic */}
              <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <p className="text-[9px] font-bold text-system-secondary-label uppercase tracking-widest group-hover:text-blue-600 transition-colors">Isochronic</p>
                  <span className="text-[10px] font-black text-system-label">{settings.isochronic.frequency}Hz</span>
                </div>
                <HzSelector 
                  value={settings.isochronic.frequency} 
                  onChange={(v) => {
                    updateIsochronicSettings({ frequency: v });
                    if (settings.syncLab.linkMode) updateSyncLabSettings({ masterHz: v });
                  }} 
                  color="blue"
                />
              </div>

              {/* Solfeggio */}
              <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <p className="text-[9px] font-bold text-system-secondary-label uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Solfeggio</p>
                  <span className="text-[10px] font-black text-system-label">{settings.solfeggio.frequency}Hz</span>
                </div>
                <HzSelector 
                  value={settings.solfeggio.frequency} 
                  onChange={(v) => {
                    updateSolfeggioSettings({ frequency: v });
                    if (settings.syncLab.linkMode) updateSyncLabSettings({ masterHz: v });
                  }} 
                  color="emerald"
                />
              </div>

              {/* Schumann */}
              <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <p className="text-[9px] font-bold text-system-secondary-label uppercase tracking-widest group-hover:text-blue-500 transition-colors">Schumann</p>
                  <span className="text-[10px] font-black text-system-label">{settings.schumann.frequency}Hz</span>
                </div>
                <HzSelector 
                  value={settings.schumann.frequency} 
                  onChange={(v) => {
                    updateSchumannSettings({ frequency: v });
                    if (settings.syncLab.linkMode) updateSyncLabSettings({ masterHz: v });
                  }} 
                  color="blue"
                />
              </div>

              {/* Nature */}
              <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <p className="text-[9px] font-bold text-system-secondary-label uppercase tracking-widest group-hover:text-green-500 transition-colors">Nature</p>
                  <span className="text-[10px] font-black text-system-label">{settings.nature.frequency}Hz</span>
                </div>
                <HzSelector 
                  value={settings.nature.frequency} 
                  onChange={(v) => {
                    updateNatureSettings({ frequency: v });
                    if (settings.syncLab.linkMode) updateSyncLabSettings({ masterHz: v });
                  }} 
                  color="green"
                />
              </div>

              {/* Noise */}
              <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <p className="text-[9px] font-bold text-system-secondary-label uppercase tracking-widest group-hover:text-orange-500 transition-colors">Noise</p>
                  <span className="text-[10px] font-black text-system-label">{settings.noise.frequency}Hz</span>
                </div>
                <HzSelector 
                  value={settings.noise.frequency} 
                  onChange={(v) => {
                    updateNoiseSettings({ frequency: v });
                    if (settings.syncLab.linkMode) updateSyncLabSettings({ masterHz: v });
                  }} 
                  color="orange"
                />
              </div>

              {/* Didgeridoo */}
              <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <p className="text-[9px] font-bold text-system-secondary-label uppercase tracking-widest group-hover:text-amber-800 transition-colors">Didgeridoo</p>
                  <span className="text-[10px] font-black text-system-label">{Math.round(settings.didgeridoo.frequency)}Hz</span>
                </div>
                <HzSelector 
                  value={settings.didgeridoo.frequency} 
                  onChange={(v) => {
                    updateDidgeridooSettings({ 
                      frequency: v,
                      playbackRate: v / 65
                    });
                    if (settings.syncLab.linkMode) updateSyncLabSettings({ masterHz: v });
                  }} 
                  color="amber"
                />
              </div>

              {/* Shamanic Drumming */}
              <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <p className="text-[9px] font-bold text-system-secondary-label uppercase tracking-widest group-hover:text-red-900 transition-colors">Shamanic Drum</p>
                  <span className="text-[10px] font-black text-system-label">{Math.round(settings.shamanic.frequency)}Hz</span>
                </div>
                <HzSelector 
                  value={settings.shamanic.frequency} 
                  onChange={(v) => {
                    updateShamanicSettings({ frequency: v });
                    if (settings.syncLab.linkMode) updateSyncLabSettings({ masterHz: v });
                  }} 
                  color="red"
                />
              </div>

              {/* Mental Toughness */}
              <div className="space-y-2">
                <div className="flex justify-between items-center group">
                  <p className="text-[9px] font-bold text-system-secondary-label uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Mental Toughness</p>
                  <span className="text-[10px] font-black text-system-label">{Math.round(settings.mentalToughness.frequency)}Hz</span>
                </div>
                <HzSelector 
                  value={settings.mentalToughness.frequency} 
                  onChange={(v) => {
                    updateMentalToughnessSettings({ frequency: v });
                    if (settings.syncLab.linkMode) updateSyncLabSettings({ masterHz: v });
                  }} 
                  color="indigo"
                />
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};
