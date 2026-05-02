import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, 
  Trash2, 
  Play, 
  Star, 
  Search, 
  Plus, 
  History, 
  Copy, 
  Edit2, 
  ChevronRight,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { HzProfile } from '../types';
import { format } from 'date-fns';

export const HzProfiles: React.FC = () => {
  const { 
    hzProfiles, 
    saveHzProfile, 
    deleteHzProfile, 
    updateHzProfile, 
    applyHzProfile,
    settings 
  } = useSettings();

  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const filteredProfiles = useMemo(() => {
    return hzProfiles
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b.updatedAt - a.updatedAt;
      });
  }, [hzProfiles, search, sortBy]);

  const handleSave = async () => {
    if (!profileName.trim()) return;
    await saveHzProfile(profileName.trim());
    setProfileName('');
    setIsSaving(false);
  };

  const handleDuplicate = async (profile: HzProfile) => {
    await saveHzProfile(`${profile.name} (Copy)`);
  };

  const handleStartRename = (profile: HzProfile) => {
    setEditingId(profile.id);
    setEditName(profile.name);
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    await updateHzProfile(id, { name: editName.trim() });
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" />
            Hz Profiles
          </h3>
          <button
            onClick={() => setIsSaving(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs font-medium transition-colors shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New Profile
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search profiles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
          <button
            onClick={() => setSortBy(sortBy === 'recent' ? 'name' : 'recent')}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            {sortBy === 'recent' ? 'Recent' : 'Name'}
          </button>
        </div>
      </div>

      {/* Save New Profile Modal-like Input */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-purple-50 border border-purple-100 rounded-2xl space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Save Current setup</span>
              <button onClick={() => setIsSaving(false)} className="text-purple-400 hover:text-purple-600 text-xs">Cancel</button>
            </div>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Profile name..."
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="flex-1 px-4 py-2 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-inner"
              />
              <button
                onClick={handleSave}
                disabled={!profileName.trim()}
                className="p-2 bg-purple-600 text-white rounded-xl disabled:opacity-50 hover:bg-purple-700 transition-colors shadow-sm"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-purple-600 leading-tight">
              This will save all active frequency values (Hz) from all layers into a single profile.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profiles List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredProfiles.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
            <History className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">No profiles found</p>
            <p className="text-xs text-gray-400">Save your favorite Hz setups here</p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <motion.div
              layout
              key={profile.id}
              className={`group relative overflow-hidden bg-white border rounded-2xl p-4 transition-all hover:shadow-md ${
                settings.defaultHzProfileId === profile.id 
                  ? 'border-purple-200 ring-1 ring-purple-100 shadow-sm' 
                  : 'border-gray-100'
              }`}
            >
              {/* Profile Background Decor */}
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-purple-50 to-transparent rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500" />

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {editingId === profile.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleRename(profile.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(profile.id)}
                        className="w-full px-2 py-1 bg-purple-50 border border-purple-200 rounded text-sm focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                        {profile.name}
                      </h4>
                      {profile.isDefault && (
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[9px] font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                          <Star className="w-2.5 h-2.5 fill-amber-500" />
                          Default
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <History className="w-3 h-3" />
                      {format(profile.updatedAt, 'MMM d, HH:mm')}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-gray-200" />
                      <span className="text-[10px] text-gray-500 font-medium bg-gray-50 px-1.5 rounded">
                        {profile.values.masterHz}Hz Master
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => applyHzProfile(profile)}
                    className="p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl transition-all shadow-sm active:scale-90"
                    title="Load Profile"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-100 mx-1" />

                  <div className="flex opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    <button
                      onClick={() => updateHzProfile(profile.id, { isDefault: !profile.isDefault })}
                      className={`p-2 rounded-lg transition-colors ${profile.isDefault ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      title="Set as Default"
                    >
                      <Star className={`w-4 h-4 ${profile.isDefault ? 'fill-amber-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleStartRename(profile)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(profile)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteHzProfile(profile.id)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Sync Info */}
      <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-start gap-2.5">
        <div className="p-1.5 bg-white border border-gray-100 rounded-lg shadow-xs">
          <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
        </div>
        <p className="text-[10px] text-gray-500 leading-relaxed">
          Profiles save Hz values for Binaural, Pure Hz, Isochronic, Solfeggio, Schumann, and Soundscapes (Nature, Noise, Didgeridoo, Drumming, Mental Toughness).
        </p>
      </div>
    </div>
  );
};
