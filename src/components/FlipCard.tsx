import React, { useEffect, useState } from 'react';

interface FlipCardProps {
  value: string;
  label?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsChanging(true);
      setDisplayValue(value);
      
      const timer = setTimeout(() => {
        setIsChanging(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <div className="flex flex-col items-center">
      {/* Simple number display card */}
      <div className="relative w-20 h-24 sm:w-24 sm:h-28 md:w-32 md:h-36">
        {/* Main card */}
        <div className={`
          relative w-full h-full 
          bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900
          rounded-xl border border-slate-600
          shadow-2xl
          transition-all duration-200 ease-out
          ${isChanging ? 'scale-105 shadow-purple-500/20' : 'scale-100'}
        `}>
          {/* Inner glow border */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          
          {/* Number display area */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
            {/* Current number with simple transition */}
            <div className={`
              flex items-center justify-center
              transition-all duration-200 ease-out
              ${isChanging ? 'text-purple-300' : 'text-white'}
            `}>
              <span className="font-bold text-2xl sm:text-3xl md:text-4xl font-mono drop-shadow-lg">
                {displayValue}
              </span>
            </div>
          </div>
          
          {/* Decorative border */}
          <div className="absolute inset-2 rounded-lg border border-slate-500/30 pointer-events-none" />
          
          {/* Bottom highlight */}
          <div className="absolute bottom-0 left-2 right-2 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
        </div>

        {/* Card shadow */}
        <div className="absolute -bottom-2 left-2 right-2 h-3 bg-black/30 rounded-full blur-md" />
      </div>
      
      {/* Label */}
      {label && (
        <span className="mt-3 text-sm font-medium text-slate-300 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
};