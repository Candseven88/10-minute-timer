import React, { useState } from 'react';
import { X, Upload, Volume2, VolumeX, Zap, ZapOff, Clock } from 'lucide-react';
import { TimerSettings } from '../types/timer';

interface SettingsProps {
  settings: TimerSettings;
  onSettingsUpdate: (settings: TimerSettings) => void;
  onClose: () => void;
  onTimeSet?: (totalSeconds: number) => void; // Add callback for setting timer time
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onSettingsUpdate,
  onClose,
  onTimeSet,
}) => {
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings);
  // Add state for timer time inputs
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const handleSave = () => {
    onSettingsUpdate(localSettings);
    onClose();
  };

  const handleSetTimer = () => {
    const totalSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
    if (totalSeconds > 0 && onTimeSet) {
      onTimeSet(totalSeconds);
    }
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

  const colorOptions = [
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
  ];

  const gradientOptions = [
    { name: 'Purple to Pink', from: '#8B5CF6', to: '#EC4899' },
    { name: 'Blue to Cyan', from: '#3B82F6', to: '#06B6D4' },
    { name: 'Green to Blue', from: '#10B981', to: '#3B82F6' },
    { name: 'Orange to Red', from: '#F59E0B', to: '#EF4444' },
    { name: 'Purple to Blue', from: '#8B5CF6', to: '#3B82F6' },
    { name: 'Pink to Orange', from: '#EC4899', to: '#F59E0B' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Timer Settings */}
        <div className="bg-slate-700/30 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Clock size={24} className="text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Timer Settings</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-300">Hours:</label>
              <input
                type="number"
                min="0"
                max="23"
                value={timerHours}
                onChange={(e) => setTimerHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                className="w-16 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-300">Minutes:</label>
              <input
                type="number"
                min="0"
                max="59"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-16 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-300">Seconds:</label>
              <input
                type="number"
                min="0"
                max="59"
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-16 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <button
              onClick={handleSetTimer}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Clock size={16} />
              <span>Set Timer</span>
            </button>
          </div>
          
          <div className="mt-3 text-xs text-slate-400">
            Total time: {timerHours > 0 && `${timerHours}h `}{timerMinutes > 0 && `${timerMinutes}m `}{timerSeconds > 0 && `${timerSeconds}s`}
            {timerHours === 0 && timerMinutes === 0 && timerSeconds === 0 && 'Please set a time'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Background Settings */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Background</h3>
            
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setLocalSettings(prev => ({ ...prev, backgroundType: 'solid' }))}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    localSettings.backgroundType === 'solid'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Solid Color
                </button>
                <button
                  onClick={() => setLocalSettings(prev => ({ ...prev, backgroundType: 'gradient' }))}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    localSettings.backgroundType === 'gradient'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => setLocalSettings(prev => ({ ...prev, backgroundType: 'image' }))}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    localSettings.backgroundType === 'image'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Image
                </button>
              </div>

              {localSettings.backgroundType === 'solid' && (
                <div className="grid grid-cols-3 gap-3">
                  {colorOptions.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setLocalSettings(prev => ({ ...prev, backgroundColor: color.value }))}
                      className={`h-12 rounded-lg border-2 transition-all ${
                        localSettings.backgroundColor === color.value
                          ? 'border-white scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              )}

              {localSettings.backgroundType === 'gradient' && (
                <div className="space-y-3">
                  {gradientOptions.map(gradient => (
                    <button
                      key={gradient.name}
                      onClick={() => setLocalSettings(prev => ({
                        ...prev,
                        gradientFrom: gradient.from,
                        gradientTo: gradient.to,
                      }))}
                      className={`w-full h-12 rounded-lg border-2 transition-all ${
                        localSettings.gradientFrom === gradient.from && localSettings.gradientTo === gradient.to
                          ? 'border-white scale-105'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      }}
                    >
                      <span className="text-white font-medium drop-shadow">{gradient.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {localSettings.backgroundType === 'image' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer transition-colors">
                      <Upload size={20} className="text-slate-300" />
                      <span className="text-slate-300">Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'background')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {localSettings.backgroundImage && (
                    <div className="w-full h-32 rounded-lg overflow-hidden">
                      <img
                        src={localSettings.backgroundImage}
                        alt="Background preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Logo Settings */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Logo & Text</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Logo</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer transition-colors">
                    <Upload size={20} className="text-slate-300" />
                    <span className="text-slate-300">Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {localSettings.logoUrl && (
                  <div className="mt-3 flex items-center space-x-4">
                    <img
                      src={localSettings.logoUrl}
                      alt="Logo preview"
                      className="w-16 h-16 object-contain rounded-lg bg-slate-700"
                    />
                    <select
                      value={localSettings.logoPosition}
                      onChange={(e) => setLocalSettings(prev => ({
                        ...prev,
                        logoPosition: e.target.value as TimerSettings['logoPosition'],
                      }))}
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="center">Center</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={localSettings.title}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subtitle</label>
                <textarea
                  value={localSettings.subtitle}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                  placeholder="Enter subtitle"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audio & Effects Settings */}
        <div className="mt-8 pt-6 border-t border-slate-600">
          <h3 className="text-xl font-semibold text-white mb-4">Audio & Effects</h3>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setLocalSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                localSettings.soundEnabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {localSettings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              <span>Sound Notifications</span>
            </button>
            
            <button
              onClick={() => setLocalSettings(prev => ({ ...prev, flashEnabled: !prev.flashEnabled }))}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                localSettings.flashEnabled
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {localSettings.flashEnabled ? <Zap size={20} /> : <ZapOff size={20} />}
              <span>Flash Effects</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};