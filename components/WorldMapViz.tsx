
import React from 'react';
import { City } from '../types';

interface WorldMapVizProps {
  cities: City[];
}

const WorldMapViz: React.FC<WorldMapVizProps> = ({ cities }) => {
  // Simple Mercator-like mapping for the visualization
  // lat: -90 to 90 -> y: 100 to 0
  // lng: -180 to 180 -> x: 0 to 100
  const project = (lat: number, lng: number) => {
    const x = ((lng + 180) * 100) / 360;
    const y = ((90 - lat) * 100) / 180;
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden glass-dark border border-white/5 p-4 mb-8">
      <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-center bg-no-repeat bg-contain filter invert"></div>
      
      <div className="relative w-full h-full">
        {cities.map((city) => {
          const { x, y } = project(city.lat, city.lng);
          return (
            <div 
              key={city.id} 
              style={{ left: x, top: y }} 
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 backdrop-blur-sm text-[10px] text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {city.name}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Active nodes</span>
      </div>
    </div>
  );
};

export default WorldMapViz;
