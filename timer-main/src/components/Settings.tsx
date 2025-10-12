import React, { useState } from 'react';
import { X, Upload, Volume2, VolumeX, Zap, ZapOff, Clock, BarChart3, ExternalLink, Globe } from 'lucide-react';
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

        {/* Progress Bar Settings */}
        <div className="mt-8 pt-6 border-t border-slate-600">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 size={24} className="text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Progress Bar Style</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setLocalSettings(prev => ({ ...prev, progressBarType: 'linear' }))}
              className={`p-4 rounded-lg border-2 transition-all ${
                localSettings.progressBarType === 'linear'
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">Linear Bar</span>
              </div>
            </button>

            <button
              onClick={() => setLocalSettings(prev => ({ ...prev, progressBarType: 'circular' }))}
              className={`p-4 rounded-lg border-2 transition-all ${
                localSettings.progressBarType === 'circular'
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                    <circle cx="16" cy="16" r="12" fill="none" stroke="url(#miniGradient)" strokeWidth="2" 
                            strokeLinecap="round" strokeDasharray="75" strokeDashoffset="20" />
                    <defs>
                      <linearGradient id="miniGradient">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="text-sm font-medium">Circular</span>
              </div>
            </button>

            <button
              onClick={() => setLocalSettings(prev => ({ ...prev, progressBarType: 'wave' }))}
              className={`p-4 rounded-lg border-2 transition-all ${
                localSettings.progressBarType === 'wave'
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-full h-4 bg-slate-600 rounded overflow-hidden relative">
                  <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded"></div>
                </div>
                <span className="text-sm font-medium">Wave Fill</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recommended Gaming Sites */}
        <div className="mt-8 pt-6 border-t border-slate-600">
          <div className="flex items-center space-x-3 mb-4">
            <Globe size={24} className="text-emerald-400" />
            <h3 className="text-xl font-semibold text-white">Recommended Gaming Sites</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="https://demonfall.xyz/" 
              target="_blank" 
              rel="dofollow"
              className="group p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-300 group-hover:text-blue-200">Demonfall</h4>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-300" />
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300">
                Ultimate Demon Slayer experience on Roblox with breathing techniques and epic battles.
              </p>
            </a>

            <a 
              href="https://plantsvsbrainrots.website/" 
              target="_blank" 
              rel="dofollow"
              className="group p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600 hover:border-green-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-300 group-hover:text-green-200">Plants vs Brainrots</h4>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-green-300" />
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300">
                Cool Roblox tycoon game mixing Plants vs Zombies with internet memes.
              </p>
            </a>

            <a 
              href="https://weaklegacy2.xyz/" 
              target="_blank" 
              rel="dofollow"
              className="group p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600 hover:border-purple-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-300 group-hover:text-purple-200">Weak Legacy 2</h4>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-purple-300" />
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300">
                Advanced gaming strategies and guides for competitive players.
              </p>
            </a>

            <a 
              href="https://silentsalt.site/" 
              target="_blank" 
              rel="dofollow"
              className="group p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600 hover:border-cyan-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-cyan-300 group-hover:text-cyan-200">Silent Salt</h4>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-cyan-300" />
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300">
                Ultimate gaming destination with free online games and resources.
              </p>
            </a>

            <a 
              href="https://rabbitroad.art/" 
              target="_blank" 
              rel="dofollow"
              className="group p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600 hover:border-pink-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-pink-300 group-hover:text-pink-200">Rabbit Road</h4>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-pink-300" />
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300">
                Creative art platform and gaming community for digital artists.
              </p>
            </a>

            <a 
              href="https://queensgame.games/" 
              target="_blank" 
              rel="dofollow"
              className="group p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600 hover:border-yellow-500 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-yellow-300 group-hover:text-yellow-200">Queens Game</h4>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-yellow-300" />
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300">
                Strategic gaming platform with competitive tournaments and rewards.
              </p>
            </a>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Discover amazing gaming experiences and boost your productivity with these recommended sites
            </p>
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