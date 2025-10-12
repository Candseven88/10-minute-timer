import React, { useState } from 'react';
import { X, Upload, Volume2, VolumeX, Zap, ZapOff } from 'lucide-react';
import { TimerSettings } from '../types/timer';

interface SettingsProps {
  settings: TimerSettings;
  onSettingsUpdate: (settings: TimerSettings) => void;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onSettingsUpdate,
  onClose,
}) => {
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings);

  const handleSave = () => {
    onSettingsUpdate(localSettings);
    onClose();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'logo') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'background') {
        setLocalSettings(prev => ({
          ...prev,
          backgroundType: 'image',
          backgroundImage: result,
        }));
      } else {
        setLocalSettings(prev => ({
          ...prev,
          logoUrl: result,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const gradientPresets = [
    { name: 'Purple to Pink', from: '#8B5CF6', to: '#EC4899' },
    { name: 'Blue to Cyan', from: '#3B82F6', to: '#06B6D4' },
    { name: 'Green to Blue', from: '#10B981', to: '#3B82F6' },
    { name: 'Orange to Red', from: '#F59E0B', to: '#EF4444' },
    { name: 'Purple to Blue', from: '#8B5CF6', to: '#3B82F6' },
    { name: 'Pink to Orange', from: '#EC4899', to: '#F59E0B' },
  ];

  const colorOptions = [
    { name: 'Slate', value: '#1e293b' },
    { name: 'Gray', value: '#374151' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Yellow', value: '#ca8a04' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Pink', value: '#db2777' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl p-4 w-full max-w-6xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Background Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Background</h3>
            
            {/* Background Type Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setLocalSettings(prev => ({ ...prev, backgroundType: 'solid' }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  localSettings.backgroundType === 'solid'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Solid Color
              </button>
              <button
                onClick={() => setLocalSettings(prev => ({ ...prev, backgroundType: 'gradient' }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  localSettings.backgroundType === 'gradient'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Gradient
              </button>
              <button
                onClick={() => setLocalSettings(prev => ({ ...prev, backgroundType: 'image' }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  localSettings.backgroundType === 'image'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Image
              </button>
            </div>

            {/* Solid Color Options */}
            {localSettings.backgroundType === 'solid' && (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setLocalSettings(prev => ({ ...prev, backgroundColor: color.value }))}
                      className={`h-12 rounded-lg border-2 transition-all ${
                        localSettings.backgroundColor === color.value
                          ? 'border-white scale-105'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Gradient Options - Optimized Layout */}
            {localSettings.backgroundType === 'gradient' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {gradientPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setLocalSettings(prev => ({
                        ...prev,
                        gradientFrom: preset.from,
                        gradientTo: preset.to,
                      }))}
                      className={`h-12 rounded-lg text-sm font-medium text-white transition-all hover:scale-105 shadow-md ${
                        localSettings.gradientFrom === preset.from && localSettings.gradientTo === preset.to
                          ? 'ring-2 ring-white scale-105'
                          : 'hover:shadow-lg'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            {localSettings.backgroundType === 'image' && (
              <div>
                <label className="block">
                  <div className="flex items-center justify-center w-full h-20 border-2 border-dashed border-slate-600 rounded-lg hover:border-slate-500 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload size={20} className="mx-auto text-slate-400 mb-1" />
                      <span className="text-xs text-slate-400">Upload Background</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'background')}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Logo & Text Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Logo & Text</h3>
            
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Logo</label>
              <label className="block">
                <div className="flex items-center justify-center w-full h-16 border-2 border-dashed border-slate-600 rounded-lg hover:border-slate-500 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Upload size={16} className="mx-auto text-slate-400 mb-1" />
                    <span className="text-xs text-slate-400">Upload Logo</span>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                  className="hidden"
                />
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                type="text"
                value={localSettings.title}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="Timer title"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Subtitle</label>
              <textarea
                value={localSettings.subtitle}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                rows={2}
                placeholder="Timer subtitle"
              />
            </div>

            {/* Audio Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLocalSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  localSettings.soundEnabled
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {localSettings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>Sound</span>
              </button>
              
              <button
                onClick={() => setLocalSettings(prev => ({ ...prev, flashEnabled: !prev.flashEnabled }))}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  localSettings.flashEnabled
                    ? 'bg-yellow-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {localSettings.flashEnabled ? <Zap size={16} /> : <ZapOff size={16} />}
                <span>Flash</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button - Always Visible */}
        <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};