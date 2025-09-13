import React from 'react';
import { Clock, Timer, Zap, Volume2, Palette, Smartphone } from 'lucide-react';

interface AboutProps {
  onClose: () => void;
}

export const About: React.FC<AboutProps> = ({ onClose }) => {
  return (
    <div className="bg-slate-900/95 backdrop-blur-lg rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Timer className="text-purple-400" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-white">10 Minute Timer</h1>
            <p className="text-slate-400">Free Online Countdown Timer</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors text-2xl"
        >
          ×
        </button>
      </div>

      {/* Main Description */}
      <div className="mb-8">
        <p className="text-slate-300 text-lg leading-relaxed">
          Free online timer for productivity and focus. Perfect for <strong className="text-white">1 min timer</strong> sessions, 
          <strong className="text-white"> 8 min timer</strong> workouts, <strong className="text-white">15 second timer</strong> quick tasks, 
          <strong className="text-white"> timer 10 minutes</strong> focus blocks, <strong className="text-white">timer 15 minutes</strong> study periods, 
          <strong className="text-white"> timer 20 minutes</strong> deep work, or any custom duration up to 60 minutes.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <Clock className="text-purple-400 mb-3" size={24} />
          <h3 className="text-white font-semibold mb-2">Quick Timer Access</h3>
          <p className="text-slate-300 text-sm">
            Instantly set timer to <strong>1 minute</strong>, <strong>5 minutes</strong>, <strong>10 minutes</strong>, 
            <strong> 15 minutes</strong>, or any duration. Perfect for focus sessions, study periods, and productivity tasks.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <Zap className="text-green-400 mb-3" size={24} />
          <h3 className="text-white font-semibold mb-2">Versatile Uses</h3>
          <p className="text-slate-300 text-sm">
            Ideal for <strong>debate time</strong>, <strong>quizizz time limit</strong>, workout sessions, meditation, 
            cooking, presentations, and <strong>Pomodoro technique</strong> implementation.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <Volume2 className="text-blue-400 mb-3" size={24} />
          <h3 className="text-white font-semibold mb-2">Professional Features</h3>
          <p className="text-slate-300 text-sm">
            Sound alerts, visual notifications, customizable backgrounds, 
            and precise timing from <strong>15 seconds</strong> to <strong>60 minutes</strong>.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <Palette className="text-pink-400 mb-3" size={24} />
          <h3 className="text-white font-semibold mb-2">Beautiful Design</h3>
          <p className="text-slate-300 text-sm">
            Elegant countdown animations, customizable backgrounds, 
            and clean interface designed for maximum focus and minimal distraction.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <Smartphone className="text-orange-400 mb-3" size={24} />
          <h3 className="text-white font-semibold mb-2">Mobile Friendly</h3>
          <p className="text-slate-300 text-sm">
            Works perfectly on desktop, tablet, and mobile devices. 
            No registration required - completely free online timer tool.
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <Timer className="text-cyan-400 mb-3" size={24} />
          <h3 className="text-white font-semibold mb-2">All Durations</h3>
          <p className="text-slate-300 text-sm">
            From <strong>1 min timer</strong> to <strong>60 minute timer</strong>, 
            including popular durations like <strong>25 minute timer</strong> for Pomodoro sessions.
          </p>
        </div>
      </div>

      {/* Popular Timer Durations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Popular Timer Durations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { name: '1 Minute Timer', desc: 'Quick tasks and micro-breaks' },
            { name: '2 Minute Timer', desc: 'Short meditation sessions' },
            { name: '3 Minute Timer', desc: 'Perfect for debate time' },
            { name: '5 Minute Timer', desc: 'Five minute timer for quick tasks' },
            { name: '7 Minute Timer', desc: 'Workout intervals' },
            { name: '8 Min Timer', desc: 'Study blocks' },
            { name: '10 Minute Timer', desc: 'Classic focus timer' },
            { name: '12 Minute Timer', desc: 'Extended focus' },
            { name: '14 Minute Timer', desc: 'Study sessions' },
            { name: '15 Minute Timer', desc: 'Timer 15 minutes productivity' },
            { name: '18 Minute Timer', desc: 'Presentation practice' },
            { name: '20 Minute Timer', desc: 'Timer 20 minutes deep work' },
            { name: '25 Minute Timer', desc: 'Pomodoro technique' },
            { name: '30 Minute Timer', desc: 'Half-hour focus blocks' },
            { name: '40 Minute Timer', desc: 'Detailed project work' },
            { name: '60 Minute Timer', desc: 'One hour deep focus' },
          ].map((timer, index) => (
            <div key={index} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
              <div className="text-white font-medium text-sm">{timer.name}</div>
              <div className="text-slate-400 text-xs mt-1">{timer.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Perfect Uses */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Perfect Uses for Our Timer</h2>
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
          <p className="text-slate-300 leading-relaxed">
            This online timer is ideal for various activities including <strong className="text-white">Pomodoro technique</strong> sessions, 
            <strong className="text-white"> debate time</strong> management, <strong className="text-white">quizizz time limit</strong> enforcement, 
            study periods, workout intervals, meditation sessions, cooking timing, meeting management, and any task requiring precise time tracking. 
            Features include sound alerts, visual flash effects, and beautiful countdown animations. 
            Ideal for study sessions, <strong className="text-white">debate time tracking</strong>, and Pomodoro technique implementation.
          </p>
        </div>
      </div>

      {/* Technical Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Timer Features</h2>
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
          <p className="text-slate-300 leading-relaxed">
            Our countdown timer includes visual and audio alerts, customizable backgrounds, 
            precise time setting capabilities, and works perfectly on desktop, tablet, and mobile devices. 
            No registration required - completely free online timer tool. 
            Set the timer to <strong className="text-white">1 minute</strong>, <strong className="text-white">5 minutes</strong>, 
            <strong className="text-white"> 10 minutes</strong>, <strong className="text-white">15 minutes</strong>, 
            <strong className="text-white"> 20 minutes</strong>, <strong className="text-white">30 minutes</strong> or any duration you need.
          </p>
        </div>
      </div>

      {/* Close Button */}
      <div className="text-center">
        <button
          onClick={onClose}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
        >
          Start Using Timer
        </button>
      </div>
    </div>
  );
}; 