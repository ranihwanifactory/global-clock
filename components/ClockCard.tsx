
import React, { useState, useEffect, useMemo } from 'react';
import { City } from '../types';

interface ClockCardProps {
  city: City;
  onRemove: (id: string) => void;
}

const ClockCard: React.FC<ClockCardProps> = ({ city, onRemove }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = useMemo(() => currentTime.toLocaleTimeString('en-US', {
    timeZone: city.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }), [currentTime, city.timezone]);

  const formattedDate = useMemo(() => currentTime.toLocaleDateString('en-US', {
    timeZone: city.timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }), [currentTime, city.timezone]);

  const timeDetails = useMemo(() => {
    const cityTime = new Date(currentTime.toLocaleString('en-US', { timeZone: city.timezone }));
    const localTime = new Date();
    const diffInMs = cityTime.getTime() - localTime.getTime();
    const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
    
    const hour = cityTime.getHours();
    const isDay = hour >= 6 && hour < 18;
    
    return { diffInHours, isDay };
  }, [currentTime, city.timezone]);

  const isLocal = city.timezone === localTimezone;

  return (
    <div 
      className={`relative group transition-all duration-500 rounded-[2rem] p-8 glass overflow-hidden hover:shadow-2xl hover:-translate-y-1`}
    >
      <button 
        onClick={() => onRemove(city.id)}
        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-red-500 hover:scale-125 transition-all z-10"
        aria-label="Remove city"
      >
        <i className="fa-solid fa-circle-xmark text-xl"></i>
      </button>

      {isLocal && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-b-xl shadow-lg">
          Your Location
        </div>
      )}

      <div className="flex justify-between items-start mb-6 mt-2">
        <div>
          <h3 className="text-3xl font-bold tracking-tighter mb-1">{city.name}</h3>
          <p className="opacity-50 text-sm font-semibold tracking-wide uppercase">{city.country}</p>
        </div>
        <div className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] ${timeDetails.isDay ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'}`}>
          <i className={`fa-solid ${timeDetails.isDay ? 'fa-sun' : 'fa-moon'} mr-2`}></i>
          {timeDetails.isDay ? 'Daylight' : 'Midnight'}
        </div>
      </div>

      <div className="mb-8">
        <div className="text-6xl font-black mono tracking-tighter tabular-nums mb-2 drop-shadow-sm">
          {formattedTime}
        </div>
        <div className="opacity-40 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
          <span>{formattedDate}</span>
          <span className="w-1.5 h-1.5 bg-current rounded-full opacity-20"></span>
          <span>
            {timeDetails.diffInHours === 0 ? 'Current' : `${timeDetails.diffInHours > 0 ? '+' : ''}${timeDetails.diffInHours}h`}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="bg-black/5 rounded-[1.25rem] p-4 border border-black/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] opacity-30 font-black uppercase tracking-widest mb-1">Position</span>
            <span className="text-xs font-mono font-medium opacity-70">
              {city.lat !== 0 ? `${city.lat.toFixed(2)}N, ${city.lng.toFixed(2)}E` : 'Detected Location'}
            </span>
          </div>
          <i className="fa-solid fa-location-crosshairs opacity-20 text-xl"></i>
        </div>
      </div>

      {/* Atmospheric Glow */}
      <div className={`absolute -z-10 -bottom-20 -right-20 w-48 h-48 opacity-10 blur-[80px] rounded-full transition-all duration-1000 ${timeDetails.isDay ? 'bg-amber-400' : 'bg-indigo-600'}`}></div>
    </div>
  );
};

export default ClockCard;
