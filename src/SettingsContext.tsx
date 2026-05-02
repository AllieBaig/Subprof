import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { AppSettings, HzProfile, HzProfileValues } from './types';
import * as db from './db';
import { APP_HISTORY } from './constants/history';
import { v4 as uuidv4 } from 'uuid';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateSubliminalSettings: (newSettings: Partial<AppSettings['subliminal']>) => void;
  updateBinauralSettings: (newSettings: Partial<AppSettings['binaural']>) => void;
  updateNatureSettings: (newSettings: Partial<AppSettings['nature']>) => void;
  updateNoiseSettings: (newSettings: Partial<AppSettings['noise']>) => void;
  updateDidgeridooSettings: (newSettings: Partial<AppSettings['didgeridoo']>) => void;
  updateShamanicSettings: (newSettings: Partial<AppSettings['shamanic']>) => void;
  updatePureHzSettings: (newSettings: Partial<AppSettings['pureHz']>) => void;
  updateIsochronicSettings: (newSettings: Partial<AppSettings['isochronic']>) => void;
  updateSolfeggioSettings: (newSettings: Partial<AppSettings['solfeggio']>) => void;
  updateSchumannSettings: (newSettings: Partial<AppSettings['schumann']>) => void;
  updateMentalToughnessSettings: (newSettings: Partial<AppSettings['mentalToughness']>) => void;
  updateSyncLabSettings: (newSettings: Partial<AppSettings['syncLab']>) => void;
  updateLibrarySettings: (newSettings: Partial<AppSettings['library']>) => void;
  updateAppearanceSettings: (newSettings: Partial<AppSettings['appearance']>) => void;
  updateVisibilitySettings: (newSettings: Partial<AppSettings['visibility']>) => void;
  updateGlobalModes: (newModes: Partial<AppSettings['globalModes']>) => void;
  updateAdvancedAudioSettings: (newSettings: Partial<AppSettings['advancedAudio']>) => void;
  updateAudioTools: (newSettings: Partial<AppSettings['audioTools']>) => void;
  updateSleepTimer: (newSettings: Partial<AppSettings['sleepTimer']>) => void;
  resetUISettings: () => void;
  hzProfiles: HzProfile[];
  refreshHzProfiles: () => Promise<void>;
  saveHzProfile: (name: string, isDefault?: boolean) => Promise<void>;
  deleteHzProfile: (id: string) => Promise<void>;
  updateHzProfile: (id: string, updates: Partial<HzProfile>) => Promise<void>;
  applyHzProfile: (profile: HzProfile) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  subliminal: {
    isEnabled: true,
    selectedTrackId: null,
    volume: 0.1,
    isLooping: true,
    delayMs: 0,
    isPlaylistMode: false,
    sourcePlaylistId: null,
    gainDb: 0,
    normalize: false,
    playInBackground: false,
  },
  binaural: {
    isEnabled: false,
    leftFreq: 200,
    rightFreq: 210,
    volume: 0.05,
    gainDb: 0,
    normalize: false,
    playInBackground: false,
    pitchSafeMode: false,
    bufferMode: 'double',
  },
  nature: {
    isEnabled: false,
    type: 'rain',
    volume: 0.5,
    gainDb: 0,
    frequency: 432,
    pitchSafeMode: false,
    normalize: false,
    playInBackground: false,
    bufferMode: 'double',
  },
  noise: {
    isEnabled: false,
    type: 'white',
    volume: 0.2,
    gainDb: 0,
    frequency: 432,
    pitchSafeMode: false,
    normalize: false,
    playInBackground: false,
    bufferMode: 'double',
  },
  didgeridoo: {
    isEnabled: false,
    volume: 0.3,
    gainDb: -6,
    playbackRate: 1.0,
    frequency: 65,
    depth: 0.5,
    isLooping: true,
    normalize: false,
    playInBackground: false,
    pitchSafeMode: false,
    bufferMode: 'double',
    physical: {
      roomSize: 'medium',
      wallResonance: 'medium',
      materialTexture: 'solid_wall',
      resonanceDepth: 0.3,
      echoTailLength: 0.2
    },
  },
  shamanic: {
    isEnabled: false,
    volume: 0.4,
    gainDb: -6,
    playbackRate: 1.0,
    frequency: 70, // Warm low drum tone
    depth: 0.4,
    isLooping: true,
    normalize: false,
    playInBackground: false,
    pitchSafeMode: false,
    bufferMode: 'double',
    physical: {
      roomSize: 'medium',
      wallResonance: 'low',
      materialTexture: 'empty_wood',
      resonanceDepth: 0.4,
      echoTailLength: 0.3,
      bangingIntensity: 'medium'
    },
  },
  mentalToughness: {
    isEnabled: false,
    volume: 0.3,
    gainDb: -6,
    pitch: 'hard',
    texture: 'empty_wood',
    intensity: 'medium',
    playbackRate: 1.0,
    frequency: 60,
    isLooping: true,
    normalize: false,
    playInBackground: false,
    pitchSafeMode: false,
    bufferMode: 'double',
    physical: {
      roomSize: 'large',
      wallResonance: 'medium',
      materialTexture: 'solid_wall',
      resonanceDepth: 0.5,
      echoTailLength: 0.4,
      bangingIntensity: 'medium'
    },
  },
  pureHz: {
    isEnabled: false,
    frequency: 432,
    volume: 0.05,
    isLooping: true,
    gainDb: 0,
    normalize: false,
    playInBackground: false,
    pitchSafeMode: false,
    bufferMode: 'double',
  },
  isochronic: {
    isEnabled: false,
    frequency: 432,
    pulseRate: 7.83,
    volume: 0.1,
    gainDb: -6,
    normalize: false,
    playInBackground: false,
    pitchSafeMode: false,
    bufferMode: 'double',
  },
  solfeggio: {
    isEnabled: false,
    frequency: 528,
    volume: 0.1,
    gainDb: -6,
    normalize: false,
    playInBackground: false,
    pitchSafeMode: false,
    bufferMode: 'double',
  },
  schumann: {
    isEnabled: false,
    frequency: 7.83,
    volume: 0.1,
    gainDb: -6,
    normalize: false,
    playInBackground: false,
    pitchSafeMode: false,
    bufferMode: 'double',
  },
  syncLab: {
    linkMode: false,
    masterHz: 432,
  },
  audioTools: {
    gainDb: 0,
    normalizeTargetDb: null,
    playInBackground: false,
  },
  mainVolume: 1.0,
  mainGainDb: 0,
  playbackRate: 1.0,
  fadeInOut: true,
  syncPlayback: true,
  advancedAudio: {
    silenceRecovery: {
      isEnabled: false,
      sensitivity: 'medium',
      retryDelayMs: 2500,
    },
    layerPriority: {
      isEnabled: false,
      order: ['subliminal', 'pureHz', 'nature'],
      balanceStrength: 0.5,
    },
    timeAutomation: {
      isEnabled: false,
      steps: [],
      smoothTransitions: true,
    },
    safeListening: {
      isEnabled: false,
      maxVolumeCap: 0.85,
      harshSoftening: 0.3,
    }
  },
  library: {
    sort: 'recent',
    group: 'alphabetical',
    groupByMinutes: false,
  },
  appearance: {
    theme: 'light',
    followSystem: true,
    darkModeStyle: 'soft-purple',
    uiMode: typeof window !== 'undefined' && window.innerWidth < 400 ? 'mini' : 'pro',
  },
  hiddenLayersPosition: 'bottom',
  loop: 'none',
  shuffle: false,
  playlistMemory: {},
  menuPosition: 'bottom',
  bigTouchMode: false,
  animationStyle: 'slide-up',
  hzInputMode: 'slider',
  subliminalExpanded: false,
  showArtwork: false,
  alwaysHideArtworkByDefault: true,
  backButtonPosition: 'bottom',
  libraryControlsPosition: 'bottom',
  displayAlwaysOn: false,
  playbackMode: 'once',
  chunking: {
    activePlaylistId: null,
    currentChunkIndex: 0,
    lastChunkPosition: 0,
    currentTrackIndex: null,
    mode: 'heartbeat',
    sizeMinutes: 3
  },
  visibility: {
    audioLayers: true,
    appControl: true,
    navigation: {
      library: true,
      search: true,
      player: true,
      mode: true
    }
  },
  globalModes: {
    pitchSafeMode: false,
    backgroundMode: false,
    masterAudioEnabled: true,
    syncLabEnabled: true
  },
  defaultHzProfileId: null,
  sleepTimer: {
    isEnabled: false,
    minutes: 30,
    remainingSeconds: null
  },
  versionHistory: APP_HISTORY
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hzProfiles, setHzProfiles] = useState<HzProfile[]>([]);

  // Load from Storage (Priority: localStorage for speed, IndexedDB for reliability)
  useEffect(() => {
    async function load() {
      // Load Hz Profiles from IDB
      const profiles = await db.getHzProfiles();
      setHzProfiles(profiles);

      // Try localStorage first
      const local = localStorage.getItem('subliminal_settings_v3');
      let currentSettings = DEFAULT_SETTINGS;
      if (local) {
        try {
          const parsed = JSON.parse(local);
          currentSettings = { ...parsed, versionHistory: APP_HISTORY };
        } catch (e) {
          console.warn('[Settings] LocalStorage corruption, falling back to IDB');
        }
      }

      // Check IDB as source of truth/backup
      const saved = await db.getSettings();
      if (saved) {
        currentSettings = { ...saved, versionHistory: APP_HISTORY };
        // Sync to localStorage
        localStorage.setItem('subliminal_settings_v3', JSON.stringify(saved));
      }

      // Apply default profile if exists on app start
      if (currentSettings.defaultHzProfileId) {
        const defaultProfile = profiles.find(p => p.id === currentSettings.defaultHzProfileId);
        if (defaultProfile) {
          const { values } = defaultProfile;
          currentSettings = {
            ...currentSettings,
            binaural: { ...currentSettings.binaural, leftFreq: values.binauralLeft, rightFreq: values.binauralRight },
            pureHz: { ...currentSettings.pureHz, frequency: values.pureHz },
            isochronic: { ...currentSettings.isochronic, frequency: values.isochronic },
            solfeggio: { ...currentSettings.solfeggio, frequency: values.solfeggio },
            schumann: { ...currentSettings.schumann, frequency: values.schumann },
            nature: { ...currentSettings.nature, frequency: values.nature },
            noise: { ...currentSettings.noise, frequency: values.noise },
            didgeridoo: { ...currentSettings.didgeridoo, frequency: values.didgeridoo },
            shamanic: { ...currentSettings.shamanic, frequency: values.shamanic },
            mentalToughness: { ...currentSettings.mentalToughness, frequency: values.mentalToughness },
            syncLab: { ...currentSettings.syncLab, masterHz: values.masterHz }
          };
        }
      }

      setSettings(currentSettings);
    }
    load();
  }, []);

  // Save to Storage
  useEffect(() => {
    // Aggressive dual storage to prevent data loss on iPhone 8
    localStorage.setItem('subliminal_settings_v3', JSON.stringify(settings));
    db.saveSettings(settings);
  }, [settings]);

  // Theme support
  useEffect(() => {
    const applyTheme = () => {
      const { theme, followSystem, darkModeStyle } = settings.appearance;
      let targetTheme = theme;

      if (followSystem) {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        targetTheme = isDark ? 'dark' : 'light';
      }

      if (targetTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', darkModeStyle);
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };

    applyTheme();

    if (settings.appearance.followSystem) {
      const matcher = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      matcher.addEventListener('change', listener);
      return () => matcher.removeEventListener('change', listener);
    }
  }, [settings.appearance]);

  const refreshHzProfiles = useCallback(async () => {
    const profiles = await db.getHzProfiles();
    setHzProfiles(profiles);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const saveHzProfile = useCallback(async (name: string, isDefault: boolean = false) => {
    // Clamp values 1-1900 Hz helper
    const clamp = (v: number) => Math.min(1900, Math.max(1, v));

    const currentValues: HzProfileValues = {
      binauralLeft: clamp(settings.binaural.leftFreq),
      binauralRight: clamp(settings.binaural.rightFreq),
      pureHz: clamp(settings.pureHz.frequency),
      isochronic: clamp(settings.isochronic.frequency),
      solfeggio: clamp(settings.solfeggio.frequency),
      schumann: clamp(settings.schumann.frequency),
      nature: clamp(settings.nature.frequency),
      noise: clamp(settings.noise.frequency),
      didgeridoo: clamp(settings.didgeridoo.frequency),
      shamanic: clamp(settings.shamanic.frequency),
      mentalToughness: clamp(settings.mentalToughness.frequency),
      masterHz: clamp(settings.syncLab.masterHz)
    };

    const newProfile: HzProfile = {
      id: uuidv4(),
      name,
      values: currentValues,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDefault
    };

    await db.saveHzProfile(newProfile);
    if (isDefault) {
      updateSettings({ defaultHzProfileId: newProfile.id });
    }
    await refreshHzProfiles();
  }, [settings, refreshHzProfiles, updateSettings]);

  const deleteHzProfile = useCallback(async (id: string) => {
    await db.deleteHzProfile(id);
    if (settings.defaultHzProfileId === id) {
      updateSettings({ defaultHzProfileId: null });
    }
    await refreshHzProfiles();
  }, [settings.defaultHzProfileId, refreshHzProfiles, updateSettings]);

  const updateHzProfile = useCallback(async (id: string, updates: Partial<HzProfile>) => {
    const existing = hzProfiles.find(p => p.id === id);
    if (!existing) return;

    const updated = { ...existing, ...updates, updatedAt: Date.now() };
    await db.saveHzProfile(updated);

    if (updates.isDefault) {
      updateSettings({ defaultHzProfileId: id });
    } else if (updates.isDefault === false && settings.defaultHzProfileId === id) {
      updateSettings({ defaultHzProfileId: null });
    }

    await refreshHzProfiles();
  }, [hzProfiles, settings.defaultHzProfileId, refreshHzProfiles, updateSettings]);

  const applyHzProfile = useCallback((profile: HzProfile) => {
    const { values } = profile;
    
    // Clamp values 1-1900 Hz helper
    const clamp = (v: number) => Math.min(1900, Math.max(1, v));

    setSettings(prev => ({
      ...prev,
      binaural: { 
        ...prev.binaural, 
        leftFreq: clamp(values.binauralLeft), 
        rightFreq: clamp(values.binauralRight) 
      },
      pureHz: { ...prev.pureHz, frequency: clamp(values.pureHz) },
      isochronic: { ...prev.isochronic, frequency: clamp(values.isochronic) },
      solfeggio: { ...prev.solfeggio, frequency: clamp(values.solfeggio) },
      schumann: { ...prev.schumann, frequency: clamp(values.schumann) },
      nature: { ...prev.nature, frequency: clamp(values.nature) },
      noise: { ...prev.noise, frequency: clamp(values.noise) },
      didgeridoo: { ...prev.didgeridoo, frequency: clamp(values.didgeridoo) },
      shamanic: { ...prev.shamanic, frequency: clamp(values.shamanic) },
      mentalToughness: { ...prev.mentalToughness, frequency: clamp(values.mentalToughness) },
      syncLab: { ...prev.syncLab, masterHz: clamp(values.masterHz) }
    }));
  }, []);

  const updateSubliminalSettings = useCallback((newSub: Partial<AppSettings['subliminal']>) => {
    setSettings(prev => ({ ...prev, subliminal: { ...prev.subliminal, ...newSub } }));
  }, []);

  const updateBinauralSettings = useCallback((newBin: Partial<AppSettings['binaural']>) => {
    setSettings(prev => ({ ...prev, binaural: { ...prev.binaural, ...newBin } }));
  }, []);

  const updateNatureSettings = useCallback((newNat: Partial<AppSettings['nature']>) => {
    setSettings(prev => ({ ...prev, nature: { ...prev.nature, ...newNat } }));
  }, []);

  const updateNoiseSettings = useCallback((newNoi: Partial<AppSettings['noise']>) => {
    setSettings(prev => ({ ...prev, noise: { ...prev.noise, ...newNoi } }));
  }, []);

  const updateDidgeridooSettings = useCallback((newDid: Partial<AppSettings['didgeridoo']>) => {
    setSettings(prev => ({ ...prev, didgeridoo: { ...prev.didgeridoo, ...newDid } }));
  }, []);
  
  const updateShamanicSettings = useCallback((newSha: Partial<AppSettings['shamanic']>) => {
    setSettings(prev => ({ ...prev, shamanic: { ...prev.shamanic, ...newSha } }));
  }, []);

  const updatePureHzSettings = useCallback((newHz: Partial<AppSettings['pureHz']>) => {
    setSettings(prev => ({ ...prev, pureHz: { ...prev.pureHz, ...newHz } }));
  }, []);

  const updateIsochronicSettings = useCallback((newIso: Partial<AppSettings['isochronic']>) => {
    setSettings(prev => ({ ...prev, isochronic: { ...prev.isochronic, ...newIso } }));
  }, []);

  const updateSolfeggioSettings = useCallback((newSol: Partial<AppSettings['solfeggio']>) => {
    setSettings(prev => ({ ...prev, solfeggio: { ...prev.solfeggio, ...newSol } }));
  }, []);

  const updateSchumannSettings = useCallback((newSch: Partial<AppSettings['schumann']>) => {
    setSettings(prev => ({ ...prev, schumann: { ...prev.schumann, ...newSch } }));
  }, []);

  const updateMentalToughnessSettings = useCallback((newMT: Partial<AppSettings['mentalToughness']>) => {
    setSettings(prev => ({ ...prev, mentalToughness: { ...prev.mentalToughness, ...newMT } }));
  }, []);
  
  const updateSyncLabSettings = useCallback((newSync: Partial<AppSettings['syncLab']>) => {
    setSettings(prev => ({ ...prev, syncLab: { ...prev.syncLab, ...newSync } }));
  }, []);

  const updateLibrarySettings = useCallback((newLib: Partial<AppSettings['library']>) => {
    setSettings(prev => ({ ...prev, library: { ...prev.library, ...newLib } }));
  }, []);

  const updateAppearanceSettings = useCallback((newApp: Partial<AppSettings['appearance']>) => {
    setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, ...newApp } }));
  }, []);

  const updateVisibilitySettings = useCallback((newVisibility: Partial<AppSettings['visibility']>) => {
    setSettings(prev => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        ...newVisibility,
        navigation: {
          ...prev.visibility.navigation,
          ...(newVisibility.navigation || {})
        }
      }
    }));
  }, []);

  const updateGlobalModes = useCallback((newModes: Partial<AppSettings['globalModes']>) => {
    setSettings(prev => ({ ...prev, globalModes: { ...prev.globalModes, ...newModes } }));
  }, []);

  const updateAdvancedAudioSettings = useCallback((newAdv: Partial<AppSettings['advancedAudio']>) => {
    setSettings(prev => ({
      ...prev,
      advancedAudio: {
        ...prev.advancedAudio,
        ...newAdv,
      }
    }));
  }, []);

  const updateAudioTools = useCallback((newTools: Partial<AppSettings['audioTools']>) => {
    setSettings(prev => ({ ...prev, audioTools: { ...prev.audioTools, ...newTools } }));
  }, []);

  const updateSleepTimer = useCallback((newSleep: Partial<AppSettings['sleepTimer']>) => {
    setSettings(prev => ({ ...prev, sleepTimer: { ...prev.sleepTimer, ...newSleep } }));
  }, []);

  const resetUISettings = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        uiMode: window.innerWidth < 400 ? 'mini' : 'pro'
      },
      hiddenLayersPosition: 'bottom',
      menuPosition: 'bottom',
      bigTouchMode: false,
      animationStyle: 'slide-up',
      hzInputMode: 'slider',
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      updateSubliminalSettings,
      updateBinauralSettings,
      updateNatureSettings,
      updateNoiseSettings,
      updateDidgeridooSettings,
      updateShamanicSettings,
      updatePureHzSettings,
      updateIsochronicSettings,
      updateSolfeggioSettings,
      updateSchumannSettings,
      updateMentalToughnessSettings,
      updateSyncLabSettings,
      updateLibrarySettings,
      updateAppearanceSettings,
      updateVisibilitySettings,
      updateGlobalModes,
      updateAdvancedAudioSettings,
      updateAudioTools,
      updateSleepTimer,
      resetUISettings,
      hzProfiles,
      refreshHzProfiles,
      saveHzProfile,
      deleteHzProfile,
      updateHzProfile,
      applyHzProfile
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
